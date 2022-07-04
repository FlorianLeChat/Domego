// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses composants.
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TestApi from "./components/TestApi";
import NotFound from "./components/NotFound";
import SocketChat from "./components/SocketChat";

// Création du conteneur principal.
export default class Home extends React.Component
{
	render()
	{
		return (
			<section className="Home">
				<h1>Page d'accueil</h1>

				<h3>Vous êtes sur la page d'accueil du site...</h3>
			</section>
		);
	}
}

const root = createRoot( document.querySelector( "body > main" ) );
root.render(
	<React.StrictMode>
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<Routes>
				<Route path="/">
					<Route index element={<Home />} />
					<Route path="*" element={<NotFound />} />
					<Route path="chat" element={<SocketChat />} />
					<Route path="database" element={<TestApi />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);