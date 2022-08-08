//
// Composant de la page d'accueil du site.
//
import ReactGA from "react-ga";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { useTranslation, Trans } from "react-i18next";
import { useState, useContext, useEffect } from "react";

import GameRooms from "../components/GameRooms";
import { fetchApi } from "../utils/NetworkHelper";
import { SocketContext } from "../utils/SocketContext";

import "./GameHome.scss";

export default function GameHome(): JSX.Element
{
	// Déclaration des constantes.
	const uuid = crypto.randomUUID();
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const navigate = useNavigate();
	const { executeRecaptcha } = useGoogleReCaptcha();

	// Déclaration des variables d'état.
	const [ username, setUsername ] = useState( "" );

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
						confirmButtonText: t( "global.yes" ),
						confirmButtonColor: "#28a745"
					} );

					return;
				}

				// Récupération et vérification du jeton d'authentification généré
				//	par l'API de Google reCAPTCHA.
				try
				{
					// On envoie d'abord une requête de vérification au serveur.
					const token = await executeRecaptcha();
					const response = await fetchApi( "tokens", "POST", { token } );

					// On vérifie si le serveur a validé l'intégrité de l'utilisateur.
					// 	Note : un score trop bas est considéré comme un utilisateur non humain.
					if ( response !== "human" )
					{
						return;
					}

					// On ferme enfin l'animation de chargement si l'utilisateur n'est pas
					//	considéré comme un programme malveillant.
					Swal.close();
				}
				catch ( error )
				{
					// On affiche un message d'erreur si le traitement du jeton d'authentification
					//	ainsi que la requête au serveur a échouée.
					Swal.fire( {
						icon: "error",
						text: t( "modals.recaptcha_invalid_token_description" ),
						title: t( "modals.recaptcha_invalid_token_title" ),
						confirmButtonText: t( "global.yes" ),
						confirmButtonColor: "#28a745"
					} );

					return;
				}
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
				socket.emit( "GameConnect", username, "player", uuid, ( type: SweetAlertIcon, title: string, message: string ) =>
				{
					// Si la réponse indique que la partie n'a pas été créée avec succès,
					//	on affiche le message d'erreur correspondant avec les informations
					//	transmises par le serveur.
					if ( type !== "success" )
					{
						Swal.fire( t( title ), t( message ), type );
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
				navigate( `/game/${ uuid }/selection` );
			}
		} );
	};

	// Champ de saisie pour le nom d'utilisateur.
	const updateUsername = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		setUsername( event.target.value );
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

				<input type="text" name="pseudo" placeholder="Marc007" autoComplete="off" spellCheck="false" minLength={5} maxLength={20} onChange={updateUsername} value={username} required />

				{/* Bouton de création d'une nouvelle partie */}
				<button type="button" onClick={createNewGame}>{t( "pages.index.create_new_game" )}</button>

				{/* Tableau des parties en cours */}
				<GameRooms username={username} />
			</article>
		</section>
	);
}