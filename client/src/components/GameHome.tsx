//
// Composant de la page d'accueil du site.
//
import ReactGA from "react-ga";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { useTranslation, Trans } from "react-i18next";
import { useState, useContext, useEffect, lazy, Suspense } from "react";

import { SocketContext } from "../utils/SocketContext";
import "./GameHome.scss";

const GameRooms = lazy( () => import( "../components/GameRooms" ) );

export default function GameHome(): JSX.Element
{
	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const navigate = useNavigate();
	const { executeRecaptcha } = useGoogleReCaptcha();

	// Déclaration des variables d'état.
	const [ username, setUsername ] = useState( "" );
	const [ disabled, setDisabled ] = useState( true );

	// Bouton de création d'une nouvelle partie.
	const createNewGame = async () =>
	{
		// On réalise tout d'abord une vérification de sécurité en utilisant le service
		//	Google reCAPTCHA pour déterminer si l'utilisateur est un humain.
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
				if ( !executeRecaptcha )
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

				// Récupération et vérification du jeton d'authentification généré
				//	par l'API de Google reCAPTCHA.
				const token = await executeRecaptcha();

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
		} );

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
				socket.emit( "GameConnect", username, "player", uuid, ( icon: SweetAlertIcon, title: string, message: string ) =>
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
				navigate( `/game/selection`, { state: { roomId: uuid, username: username, type: "player" } } );
			}
		} );
	};

	// Champ de saisie pour le nom d'utilisateur.
	const updateUsername = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		setUsername( event.target.value );
		setDisabled( !event.target.validity.valid );
	};

	// Mise en place des statistiques de Google Analytics.
	useEffect( () =>
	{
		ReactGA.initialize( process.env.REACT_APP_ANALYTICS_IDENTIFIER ?? "" );
		ReactGA.pageview( window.location.pathname + window.location.search );
	}, [] );

	// Affichage du rendu HTML du composant.
	return (
		<section id="GameHome">
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
				<Suspense fallback={<div className="loading"></div>}>
					<GameRooms username={username} />
				</Suspense>
			</article>
		</section>
	);
}