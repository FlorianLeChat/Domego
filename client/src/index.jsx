// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses composants.
import React from "react";
import { createRoot } from "react-dom/client";

import TestApi from "./components/TestApi";
import SocketChat from "./components/SocketChat";

// Création du conteneur principal.
export default class App extends React.Component
{
	render()
	{
		return (
			<main>
				<TestApi />
				<SocketChat />
			</main>
		);
	}
}

const root = createRoot( document.querySelector( "div" ) );
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);