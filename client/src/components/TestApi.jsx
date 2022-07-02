//
// Classe de test pour l'API de test côté serveur.
//
import { Component } from "react";
import callApi from "../logic/CallApi";

import "./TestApi.scss";

export default class TestApi extends Component
{
	constructor( props )
	{
		// Création des variables du constructeur.
		super( props );

		this.state = { response: "" };
	}

	componentDidMount()
	{
		// Création de l'appel via l'API lors de la création du composant.
		callApi(this, "cats");
	}

	render()
	{
		// Affichage du rendu HTML du composant.
		return (
			<section className="component-testApi">
				<h1>Test de l'appel API vers le serveur</h1>

				<p>État de la réponse : {this.state.response}</p>
			</section>
		);
	}
}