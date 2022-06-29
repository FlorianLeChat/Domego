// Importation of the main CSS stylesheets.
import "normalize.css";
import "./index.scss";

// Importation of React and its components.
import { Component } from "react";
import { createRoot } from "react-dom/client";

import TestApi from "./components/TestApi";

// Create the root element.
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