// Importation de React et des fonctions logiques.
import { Component } from "react";
import callApi from "../logic/CallApi";

// Importation de la feuille de style CSS lié au composant.
import "./TestApi.css";

// Classe de test pour l'API de test côté serveur.
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
				<h1>Bienvenue sur React !</h1>

				<p>État de la réponse : {this.state.response}</p>
			</section>
		);
	}
}