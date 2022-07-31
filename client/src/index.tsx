// Importation des feuilles de style CSS.
import "./index.scss";

// Importation de React et de ses dépendances.
import { createRoot } from "react-dom/client";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { useState, StrictMode, useContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Importation des composants React.
import TestApi from "./components/TestApi";
import NotFound from "./components/NotFound";
import LiveChat from "./components/LiveChat";
import GameRooms from "./components/GameRooms";
import RoleSelection from "./components/RoleSelection";

// Importation des fonctions utilitaires.
import { fetchApi } from "./utils/NetworkHelper";
import { SocketProvider, SocketContext } from "./utils/SocketContext";

// Création du conteneur principal.
export default function Home(): JSX.Element
{
	// Déclaration des constantes.
	const uuid = crypto.randomUUID();
	const socket = useContext( SocketContext );
	const navigate = useNavigate();
	const { executeRecaptcha } = useGoogleReCaptcha();

	// Déclaration des variables d'état.
	const [ username, setUsername ] = useState( "" );

	// Bouton de création d'une nouvelle partie.
	const handleButtonClick = async () =>
	{
		// On réalise tout d'abord une vérification de sécurité en utilisant le service
		//	Google reCAPTCHA pour déterminer si l'utilisateur est un humain.
		await Swal.fire( {
			icon: "info",
			text: "Nous sommes en train d'utiliser le service Google reCAPTCHA pour garantir que vous êtes un humain.",
			title: "Vérification en cours...",
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
						text: "Les services de vérification de Google reCAPTCHA sont actuellement indisponibles. Veuillez réessayer dans quelques instants.",
						title: "Services indisponibles",
						confirmButtonText: "D'accord",
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
					//	considéré comme un programme informatique.
					Swal.close();
				}
				catch ( error )
				{
					// On affiche un message d'erreur si le traitement du jeton d'authentification
					//	ainsi que la requête au serveur a échouée.
					Swal.fire( {
						icon: "error",
						text: "Le jeton d'authentification transmis par Google reCAPTCHA est invalide ou erroné. Veuillez réessayer dans quelques instants.",
						title: "Jeton invalide ou erroné",
						confirmButtonText: "D'accord",
						confirmButtonColor: "#28a745"
					} );

					return;
				}
			}
		} );

		// On vérifie alors si l'utilisateur veut bien créer une nouvelle partie.
		const result = await Swal.fire( {
			icon: "question",
			text: "Une fois la partie créée, vous ne pourrez plus changer de nom d'utilisateur.",
			title: "Voulez-vous créer une nouvelle partie ?",
			reverseButtons: true,
			showCancelButton: true,
			cancelButtonText: "Non",
			confirmButtonText: "Oui",
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
			text: "Vous trouvez ça long ? Rassurez-vous, le serveur se démène pour traiter la requête.",
			title: "Création de la partie en cours...",
			allowEscapeKey: false,
			timerProgressBar: true,
			allowOutsideClick: false,
			didOpen: () =>
			{
				// Affichage de l'animation de chargement.
				Swal.showLoading();

				// Envoi de la requête de création de la partie.
				socket.emit( "GameConnect", username, uuid, ( type: SweetAlertIcon, title: string, message: string ) =>
				{
					// Si la réponse indique que la partie n'a pas été créée avec succès,
					//	on affiche le message d'erreur correspondant avec les informations
					//	transmises par le serveur.
					if ( type !== "success" )
					{
						Swal.fire( title, message, type );
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
	const handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		setUsername( event.target.value );
	};

	// Affichage du rendu HTML du composant.
	return (
		<section className="Home">
			{/* Titre de la page */}
			<h1>Domego</h1>

			{/* Descriptif du jeu */}
			<u>Un jeu sérieux pédagogique</u>

			<article>
				{/* Saisie d'un nom d'utilisateur */}
				<label htmlFor="pseudo">
					Veuillez saisir un nom d'utilisateur<span>*</span><br />
					(<strong>5</strong> caractères minimum, <strong>20</strong> caractères maximum)
				</label>

				<input type="text" name="pseudo" placeholder="Marc007" autoComplete="off" spellCheck="false" minLength={5} maxLength={20} onChange={handleInputChange} value={username} required />

				{/* Bouton de création d'une nouvelle partie */}
				<button type="button" onClick={handleButtonClick}>Créer une partie</button>

				{/* Tableau des parties en cours */}
				<GameRooms title="Parties disponibles" />
			</article>
		</section>
	);
}

// Gestion des routes vers les pages du site.
const root = createRoot( document.querySelector( "body > main" ) as Element );
root.render(
	<StrictMode>
		<SocketProvider>
			<GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_CAPTCHA_PUBLIC_KEY || ""}>
				<BrowserRouter basename={process.env.PUBLIC_URL}>
					<Routes>
						<Route path="/">
							{/* Page d'accueil */}
							<Route index element={<Home />} />

							{/* Page non trouvée. */}
							<Route path="*" element={<NotFound />} />

							{/* Chat de test pour chaque partie. */}
							<Route path="chat/:roomid" element={<LiveChat />} />

							{/* Page de sélection des rôles avant chaque partie. */}
							<Route path="game/:roomid/selection" element={<RoleSelection />} />

							{/* Page de test des requêtes via MongoDB */}
							<Route path="database" element={<TestApi />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</GoogleReCaptchaProvider>
		</SocketProvider>
	</StrictMode>
);