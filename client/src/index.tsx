// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses dépendances.
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { createRoot } from "react-dom/client";
import { useState, StrictMode } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Importation des composants React.
import TestApi from "./components/TestApi";
import NotFound from "./components/NotFound";
import LiveChat from "./components/LiveChat";
import GameRooms from "./components/GameRooms";
import RoleSelection from "./components/RoleSelection";

// Création du socket de communication.
const socket = io( { path: process.env.PUBLIC_URL + "/socket.io" } );

// Création du conteneur principal.
export default function Home(): JSX.Element
{
	// Création des constantes.
	const uuid = crypto.randomUUID();
	const navigate = useNavigate();

	// Déclaration des variables d'état.
	const [ username, setUsername ] = useState( "" );

	// Création d'une nouvelle partie.
	const handleButtonClick = async () =>
	{
		// On vérifie tout d'abord si l'utilisateur veut bien créer une nouvelle partie.
		const result = await Swal.fire( {
			icon: "question",
			text: "Une fois la partie créée, vous ne pourrez plus changer de nom d'utilisateur.",
			title: "Voulez-vous créer une nouvelle partie ?",
			reverseButtons: true,
			showCancelButton: true,
			cancelButtonText: "Non",
			confirmButtonText: "Oui",
			cancelButtonColor: '#d33333',
			confirmButtonColor: '#3085d6',
		} );

		if ( result.isDenied || result.isDismissed )
		{
			// Si ce n'est pas le cas, on ne fait rien.
			return;
		}

		// On affiche alors une animation de chargement pour indiquer à l'utilisateur
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

				// Récupération des messages créés par le serveur.
				socket.once( "GameAlert", ( response ) =>
				{
					// Si la réponse indique que la partie n'a pas été créée avec succès,
					//	on affiche le message d'erreur correspondant avec les informations
					//	transmises par le serveur.
					if ( response.type !== "success" )
					{
						Swal.fire( response.title, response.message, response.type );
						return;
					}

					// Dans le cas contraire, on ferme la fenêtre de chargement afin de poursuivre
					//	l'exécution des opérations.
					Swal.close();
				} );

				// Envoi de la requête de création de la partie.
				socket.emit( "GameConnect", username, uuid );
			},
			willClose: () =>
			{
				// Redirection automatique si la fenêtre de chargement est fermée
				//	normalement (sans aucune erreur émise par le serveur).
				navigate( `/game/${ uuid }/selection` );
			}
		} );
	};

	// Récupération de la valeur du champ de saisie.
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
				{/* Saisie d'un pseudonyme */}
				<label>
					Veuillez saisir un pseudonyme.
					<input type="text" placeholder="Marc007" autoComplete="off" spellCheck="false" minLength={5} maxLength={20} onChange={handleInputChange} value={username} />
				</label>

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
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<Routes>
				<Route path="/">
					{/* Page d'accueil */}
					<Route index element={<Home />} />

					{/* Page non trouvée. */}
					<Route path="*" element={<NotFound />} />

					{/* Chat de test pour chaque partie. */}
					<Route path="chat/:roomid" element={<LiveChat socket={socket} />} />

					{/* Page de sélection des rôles avant chaque partie. */}
					<Route path="game/:roomid/selection" element={<RoleSelection socket={socket} />} />

					{/* Page de test des requêtes via MongoDB */}
					<Route path="database" element={<TestApi />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);