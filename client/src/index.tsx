// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses dépendances.
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { useState, StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importation des composants React.
import TestApi from "./components/TestApi";
import NotFound from "./components/NotFound";
import LiveChat from "./components/LiveChat";
import GameRooms from "./components/GameRooms";

// Création des constantes.
const uuid = crypto.randomUUID();
const socket = io( { path: process.env.PUBLIC_URL + "/socket.io" } );

// Création du conteneur principal.
export default function Home(): JSX.Element
{
	// Déclaration des variables d'éstat.
	const [ username, setUsername ] = useState( "" );

	// Création d'une nouvelle partie.
	const handleButtonClick = ( event: React.MouseEvent<HTMLButtonElement> ) =>
	{
		// On vérifie tout d'abord si l'utilisateur veut bien créer une nouvelle partie.
		if ( window.confirm( "Voulez-vous créer une nouvelle partie ?" ) === false )
		{
			event.preventDefault();
			return;
		}

		// Si c'est le cas, on vérifie si un pseudonyme a bien été renseigné.
		if ( username.trim() !== "" )
		{
			// On signale au serveur qu'on veut créer une nouvelle partie.
			socket.emit( "joinRoom", username, uuid );
		}
		else
		{
			// Dans le cas contraire, on bloque l'action de l'utilisateur.
			event.preventDefault();

			alert( "Le nom d'utilisateur est manquant ou invalide." );
		}
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
				<Link to={`/game/${ uuid }`}>
					<button type="button" onClick={handleButtonClick}>Créer une partie</button>
				</Link>

				{/* Tableau des parties en cours */}
				<GameRooms title="Parties disponibles" />
			</article>
		</section>
	);
}

const root = createRoot( document.querySelector( "body > main" ) as HTMLElement );
root.render(
	<StrictMode>
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<Routes>
				<Route path="/">
					<Route index element={<Home />} />
					<Route path="*" element={<NotFound />} />
					<Route path="chat" element={<LiveChat socket={socket} />} />
					<Route path="database" element={<TestApi />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);