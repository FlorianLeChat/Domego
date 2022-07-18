// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses dépendances.
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { randomUUID } from "crypto";
import { createRoot } from "react-dom/client";
import { useState, StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importation des composants React.
import TestApi from "./components/TestApi";
import NotFound from "./components/NotFound";
import LiveChat from "./components/LiveChat";
import GameRooms from "./components/GameRooms";

// Création des constantes.
const uuid = randomUUID();
const socket = io( { path: process.env.PUBLIC_URL + "/socket.io" } );

// Création du conteneur principal.
export default function Home(): JSX.Element
{
	// Déclaration des variables d'éstat.
	const [ username, setUsername ] = useState( "" );

	// Création d'une nouvelle partie.
	const handleButtonClick = ( _event: React.MouseEvent<HTMLButtonElement> ) =>
	{
		if ( username !== "" )
		{
			// Le nom d'utilisateur a été renseigné, on créé la nouvelle partie.
			socket.emit( "joinRoom", { username, uuid } );
		}
		else
		{
			// Le nom d'utilisateur est invalide, on bloque l'action.
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
				<Link to={`/game/${ uuid }/${ username }`}>
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