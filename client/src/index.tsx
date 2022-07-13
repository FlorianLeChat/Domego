// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses composants.
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TestApi from "./components/TestApi";
import NotFound from "./components/NotFound";
import LiveChat from "./components/LiveChat";
import GameRooms from "./components/GameRooms";

// Création du conteneur principal.
export default class Home extends React.Component
{
	render()
	{
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
						<input type="text" id="pseudo" placeholder="Marc007" autoComplete="off" spellCheck="false" minLength={5} maxLength={20} required />
					</label>

					{/* Bouton de création d'une nouvelle partie */}
					<button type="button">Créer une partie</button>

					{/* Tableau des parties en cours */}
					<GameRooms title="Parties disponibles" />
				</article>
			</section>
		);
	}
}

const root = createRoot( document.querySelector( "body > main" ) as HTMLElement );
root.render(
	<React.StrictMode>
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<Routes>
				<Route path="/">
					<Route index element={<Home />} />
					<Route path="*" element={<NotFound />} />
					<Route path="chat" element={<LiveChat />} />
					<Route path="database" element={<TestApi />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);