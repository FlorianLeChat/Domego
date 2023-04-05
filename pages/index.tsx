//
// Route vers la page d'accueil du site.
//
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import type { SweetAlertIcon } from "sweetalert2";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useContext, useEffect, ChangeEvent } from "react";

import styles from "./index.module.scss";
import { UserType } from "@/enums/User";
import { SocketContext } from "@/utils/SocketContext";

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

		if ( process.env.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY && process.env.NODE_ENV === "production" )
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
							const key = process.env.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY ?? "";
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
				<svg width="80" height="80" viewBox="0 0 250 250" style={{ fill: "#3f3f3f", color: "#fff", position: "absolute", top: 0, border: 0, right: 0 }}>
					<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
					<path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: "130px 106px" }} />
					<path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" />
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
				<Trans
					i18nKey="pages.index.google_recaptcha"
					components={{
						a1: <a href="https://policies.google.com/privacy">...</a>,
						a2: <a href="https://policies.google.com/terms">...</a>
					}}
				/>
			</small>
		</section>
	);
}