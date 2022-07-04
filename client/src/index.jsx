// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses composants.
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TestApi from "./components/TestApi";
import SocketChat from "./components/SocketChat";

// Création du conteneur principal.
export default class Home extends React.Component
{
	render()
	{
		return (
			<section className="Home" >
				<h1>Page d'accueil</h1>

				<h3>Vous êtes sur la page d'accueil du site...</h3>
			</section>
		);
	}
}

const root = createRoot( document.querySelector( "body > main" ) );
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="database" element={<TestApi />} />
				<Route path="chat" element={<SocketChat />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);