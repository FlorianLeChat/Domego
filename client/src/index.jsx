// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses composants.
import { Component } from "react";
import { createRoot } from "react-dom/client";

import TestApi from "./components/TestApi";

// Création du conteneur principal.
export default class App extends Component
{
	render()
	{
		return (
			<TestApi></TestApi>
		);
	}
}

const root = createRoot( document.querySelector( "main" ) );
root.render( <App /> );