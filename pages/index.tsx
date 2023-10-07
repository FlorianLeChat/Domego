//
// Route vers la page d'accueil du site.
//
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import * as CookieConsent from "vanilla-cookieconsent";
import type { SweetAlertIcon } from "sweetalert2";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useContext, useEffect, ChangeEvent, MouseEvent } from "react";

import { UserType } from "@/enums/User";
import { SocketContext } from "@/utils/SocketContext";

import styles from "./index.module.scss";

const GameRooms = dynamic( () => import( "@/components/GameRooms" ) );

export async function getStaticProps( { locale }: { locale: string; } )
{
	// Récupération des traductions côté serveur.
	return {
		props: {
			...( await serverSideTranslations( locale ) )
		}
	};
}

export default function GameHome()
{
	// Déclaration des constantes.
	const { t } = useTranslation();
	const router = useRouter();
	const socket = useContext( SocketContext );

	// Déclaration des variables d'état.
	const [ username, setUsername ] = useState( "" );
	const [ disabled, setDisabled ] = useState( true );

	// Bouton de création d'une nouvelle partie.
	const createNewGame = async () =>
	{
		// On réalise d'abord une vérification de sécurité en utilisant le service
		//  Google reCAPTCHA pour déterminer si l'utilisateur est un humain.
		const Swal = ( await import( "sweetalert2" ) ).default;

		if ( process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true" )
		{
			await Swal.fire( {
				icon: "info",
				text: t( "modals.recaptcha_waiting_description" ),
				title: t( "modals.recaptcha_waiting_title" ),
				allowEscapeKey: false,
				allowOutsideClick: false,
				didOpen: async () =>
				{
					// Affichage de l'animation de chargement.
					Swal.showLoading();

					// Vérification de la disponibilité du service reCAPTCHA.
					if ( typeof window.grecaptcha === "undefined" )
					{
						// Si le service est indisponible, on affiche un message d'erreur
						//  et on arrête l'exécution de la fonction.
						Swal.fire( {
							icon: "error",
							text: t( "modals.recaptcha_unavailable_description" ),
							title: t( "modals.recaptcha_unavailable_title" ),
							confirmButtonColor: "#28a745"
						} );

						return;
					}

					// On attend ensuite que les services de reCAPTCHA soient chargés.
					window.grecaptcha.ready( async () =>
					{
						try
						{
							// Récupération et vérification du jeton d'authentification généré
							//  par l'API de Google reCAPTCHA.
							const key = process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY ?? "";
							const token = await window.grecaptcha.execute( key, { action: "create" } );

							socket?.emit( "GameRecaptcha", token, ( icon: SweetAlertIcon, title: string, message: string ) =>
							{
								// Si la réponse indique que le joueur n'est pas un humain,
								//  on affiche le message d'erreur correspondant avec les informations
								//  transmises par le serveur.
								if ( icon !== "success" )
								{
									Swal.fire( {
										icon,
										text: t( message ),
										title: t( title ),
										confirmButtonColor: "#28a745"
									} );

									return;
								}

								// Dans le cas contraire, on ferme la fenêtre de chargement pour poursuivre
								//  l'exécution des opérations.
								Swal.close();
							} );
						}
						catch ( error )
						{
							// Si une erreur est survenue lors de l'exécution de la fonction de vérification,
							//  on affiche un message d'erreur.
							Swal.fire( {
								icon: "error",
								text: t( "modals.recaptcha_invalid_token_description" ),
								title: t( "modals.recaptcha_invalid_token_title" ),
								confirmButtonColor: "#28a745"
							} );
						}
					} );
				}
			} );
		}

		// On vérifie alors si l'utilisateur veut bien créer une nouvelle partie.
		const result = await Swal.fire( {
			icon: "question",
			text: t( "modals.create_new_game_description" ),
			title: t( "modals.create_new_game_title" ),
			reverseButtons: true,
			showCancelButton: true,
			cancelButtonText: t( "global.no" ),
			confirmButtonText: t( "global.yes" ),
			cancelButtonColor: "#dc3545",
			confirmButtonColor: "#28a745"
		} );

		if ( result.isDenied || result.isDismissed )
		{
			// Si ce n'est pas le cas, on ne fait rien.
			return;
		}

		// On affiche enfin une animation de chargement pour indiquer à l'utilisateur
		//  que la partie est en cours de création.
		const uuid = ( await import( "uuid" ) ).v4();

		await Swal.fire( {
			icon: "info",
			text: t( "modals.creating_new_game_description" ),
			title: t( "modals.creating_new_game_title" ),
			allowEscapeKey: false,
			allowOutsideClick: false,
			didOpen: () =>
			{
				// Affichage de l'animation de chargement.
				Swal.showLoading();

				// Envoi de la requête de création de la partie.
				socket?.emit( "GameConnect", username, UserType.PLAYER, uuid, (
					icon: SweetAlertIcon,
					title: string,
					message: string
				) =>
				{
					// Si la réponse indique que la partie n'a pas été créée avec succès,
					//  on affiche le message d'erreur correspondant avec les informations
					//  transmises par le serveur.
					if ( icon !== "success" )
					{
						Swal.fire( {
							icon,
							text: t( message ),
							title: t( title ),
							confirmButtonColor: "#28a745"
						} );

						return;
					}

					// Dans le cas contraire, on ferme la fenêtre de chargement pour poursuivre
					//  l'exécution des opérations.
					Swal.close();
				} );
			},
			willClose: () =>
			{
				// Redirection automatique si la fenêtre de chargement est fermée
				//  normalement (sans aucune erreur émise par le serveur).
				router.push( {
					query: { roomId: uuid, username, admin: true, type: UserType.PLAYER },
					pathname: "/game/selection"
				}, "/game/selection" );
			}
		} );
	};

	// Champ de saisie pour le nom d'utilisateur.
	const updateUsername = ( event: ChangeEvent<HTMLInputElement> ) =>
	{
		setUsername( event.target.value );
		setDisabled( !event.target.validity.valid );
	};

	// Affichage de la fenêtre de préférences des cookies.
	const showPreferences = ( event: MouseEvent<HTMLAnchorElement> ) =>
	{
		event.preventDefault();
		CookieConsent.showPreferences();
	};

	// Préchargement de la page de sélection de la partie.
	useEffect( () =>
	{
		router.prefetch( "/game/selection" );
	}, [ router ] );

	// Affichage du rendu HTML de la page.
	return (
		<section id={styles.GameHome}>
			{/* Affichage de l'animation du logo vers le dépôt GitHub */}
			{/* Source : https://tholman.com/github-corners/ */}
			<a href="https://github.com/FlorianLeChat/Domego" target="_blank" rel="noopener noreferrer">
				<svg width="80" height="80" viewBox="0 0 250 250">
					<path d="M0 0l115 115h15l12 27 108 108V0z" />
					<path d="M128 109c-15-9-9-19-9-19 3-7 2-11 2-11-1-7 3-2 3-2 4 5 2 11 2 11-3 10 5 15 9 16" />
					<path d="M115 115s4 2 5 0l14-14c3-2 6-3 8-3-8-11-15-24 2-41 5-5 10-7 16-7 1-2 3-7 12-11 0 0
						5 3 7 16 4 2 8 5 12 9s7 8 9 12c14 3 17 7 17 7-4 8-9 11-11 11 0 6-2 11-7 16-16 16-30 10-41
						2 0 3-1 7-5 11l-12 11c-1 1 1 5 1 5z"
					/>
				</svg>
			</a>

			{/* Titre de la page */}
			<h1>{t( "pages.index.title" )}</h1>

			{/* Descriptif du jeu */}
			<u>{t( "pages.index.description" )}</u>

			<article>
				{/* Saisie d'un nom d'utilisateur */}
				<label htmlFor="pseudo">
					{t( "pages.index.choose_username" )}<span>*</span>
					<br />
					(<Trans i18nKey="pages.index.username_length" components={{ strong: <strong /> }} />)
				</label>

				<input
					type="text" id="pseudo" name="pseudo" placeholder="Marc007" autoComplete="username" spellCheck="false"
					minLength={5} maxLength={20} value={username} onChange={updateUsername} required
				/>

				{/* Bouton de création d'une nouvelle partie */}
				<button type="button" onClick={createNewGame} disabled={disabled}>
					{t( "pages.index.create_new_game" )}
				</button>

				{/* Tableau des parties en cours */}
				<GameRooms username={username} />
			</article>

			{/* Avertissement de Google reCAPTCHA */}
			<small>
				{
					( process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true" ) && (
						<>
							<Trans
								i18nKey="pages.index.google_recaptcha"
								components={{
									a1: <a rel="noopener noreferrer" href="https://policies.google.com/privacy" target="_blank">...</a>,
									a2: <a rel="noopener noreferrer" href="https://policies.google.com/terms" target="_blank">...</a>
								}}
							/>

							<br />
						</>
					)
				}

				<Trans
					i18nKey="pages.index.cookies_preferences"
					components={{
						a1: <a href="#cookies" onClick={showPreferences}>...</a>
					}}
				/>
			</small>
		</section>
	);
}