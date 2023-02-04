//
// Route vers la page d'accueil du site.
//
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { useState, useContext } from "react";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "@/styles/GameHome.module.scss";
import { UserType } from "@/enums/User";
import i18nextConfig from "@/next-i18next.config";
import { SocketContext } from "@/utils/SocketContext";

const GameRooms = dynamic( () => import( "@/components/GameRooms" ) );

export async function getStaticProps( { locale }: { locale: string; } )
{
	// Récupération des traductions côté serveur.
	return {
		props: {
			...( await serverSideTranslations( locale ?? i18nextConfig.i18n.defaultLocale ) )
		},
	};
}

export default function GameHome()
{
	// Déclaration des constantes.
	// @ts-ignore
	const { t } = useTranslation();
	const router = useRouter();
	const socket = useContext( SocketContext );

	// Déclaration des variables d'état.
	const [ username, setUsername ] = useState( "" );
	const [ disabled, setDisabled ] = useState( true );

	// Bouton de création d'une nouvelle partie.
	const createNewGame = async () =>
	{
		// On vérifie d'abord que la connexion aux sockets est établie.
		if ( !socket?.connected )
		{
			return;
		}

		// On réalise juste après une vérification de sécurité en utilisant le service
		//	Google reCAPTCHA pour déterminer si l'utilisateur est un humain.
		// 	Note : cette vérification n'est pas nécessaire en mode développement.
		if ( process.env[ "NODE_ENV" ] === "production" && process.env[ "NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY" ] !== "" )
		{
			await Swal.fire( {
				icon: "info",
				text: t( "modals.recaptcha_waiting_description" ),
				title: t( "modals.recaptcha_waiting_title" ),
				allowEscapeKey: false,
				timerProgressBar: true,
				allowOutsideClick: false,
				didOpen: async () =>
				{
					// Affichage de l'animation de chargement.
					Swal.showLoading();

					// Vérification de la disponibilité du service reCAPTCHA.
					if ( !window.grecaptcha )
					{
						// Si le service est indisponible, on affiche un message d'erreur
						// 	et on arrête l'exécution de la fonction.
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
							//	par l'API de Google reCAPTCHA.
							const token = await window.grecaptcha.execute( process.env[ "NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY" ] ?? "", { action: "create" } );

							socket.emit( "GameRecaptcha", token, ( icon: SweetAlertIcon, title: string, message: string ) =>
							{
								// Si la réponse indique que le joueur n'est pas un humain,
								//	on affiche le message d'erreur correspondant avec les informations
								//	transmises par le serveur.
								if ( icon !== "success" )
								{
									Swal.fire( {
										icon: icon,
										text: t( message ),
										title: t( title ),
										confirmButtonColor: "#28a745"
									} );

									return;
								}

								// Dans le cas contraire, on ferme la fenêtre de chargement pour poursuivre
								//	l'exécution des opérations.
								Swal.close();
							} );
						}
						catch ( error )
						{
							console.log( error );
							// Si une erreur est survenue lors de l'exécution de la fonction de vérification,
							//	on affiche un message d'erreur.
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
		//	que la partie est en cours de création.
		const uuid = uuidv4();

		await Swal.fire( {
			icon: "info",
			text: t( "modals.creating_new_game_description" ),
			title: t( "modals.creating_new_game_title" ),
			allowEscapeKey: false,
			timerProgressBar: true,
			allowOutsideClick: false,
			didOpen: () =>
			{
				// Affichage de l'animation de chargement.
				Swal.showLoading();

				// Envoi de la requête de création de la partie.
				socket.emit( "GameConnect", username, UserType.PLAYER, uuid, ( icon: SweetAlertIcon, title: string, message: string ) =>
				{
					// Si la réponse indique que la partie n'a pas été créée avec succès,
					//	on affiche le message d'erreur correspondant avec les informations
					//	transmises par le serveur.
					if ( icon !== "success" )
					{
						Swal.fire( {
							icon: icon,
							text: t( message ),
							title: t( title ),
							confirmButtonColor: "#28a745"
						} );

						return;
					}

					// Dans le cas contraire, on ferme la fenêtre de chargement pour poursuivre
					//	l'exécution des opérations.
					Swal.close();
				} );
			},
			willClose: () =>
			{
				// Redirection automatique si la fenêtre de chargement est fermée
				//	normalement (sans aucune erreur émise par le serveur).
				router.push( {
					query: { roomId: uuid, username: username, admin: true, type: UserType.PLAYER },
					pathname: `/game/selection`
				}, `/game/selection` );
			}
		} );
	};

	// Champ de saisie pour le nom d'utilisateur.
	const updateUsername = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		setUsername( event.target.value );
		setDisabled( !event.target.validity.valid );
	};

	// Affichage du rendu HTML du composant.
	return (
		<section id={styles[ "GameHome" ]}>
			{/* Titre de la page */}
			<h1>{t( "pages.index.title" )}</h1>

			{/* Descriptif du jeu */}
			<u>{t( "pages.index.description" )}</u>

			<article>
				{/* Saisie d'un nom d'utilisateur */}
				<label>
					{t( "pages.index.choose_username" )}<span>*</span>
					<br />
					(<Trans i18nKey="pages.index.username_length" components={{ strong: <strong /> }} />)
				</label>

				<input type="text" name="pseudo" placeholder="Marc007" autoComplete="username" spellCheck="false" minLength={5} maxLength={20} onChange={updateUsername} value={username} required />

				{/* Bouton de création d'une nouvelle partie */}
				<button type="button" onClick={createNewGame} disabled={disabled}>{t( "pages.index.create_new_game" )}</button>

				{/* Tableau des parties en cours */}
				<GameRooms username={username} />
			</article>
		</section>
	);
}