//
// Classe de test pour l'API de test côté serveur.
//
import { Component } from "react";
import callApi from "../utils/CallApi";

import "./TestApi.scss";

export default class TestApi extends Component
{
	constructor( props )
	{
		// Création des variables du constructeur.
		super( props );

		this.state = {
			get: "Veuillez patienter...",	// Méthode GET.
			post: "Veuillez patienter...",	// Méthode POST.
			put: "Veuillez patienter...",	// Méthode PUT.
			delete: "Veuillez patienter..."	// Méthode DELETE.
		};
	}

	componentDidMount()
	{
		// Récupération de l'ensemble des données de l'API.
		callApi( this, "users", "GET" );

		// Ajout d'une nouvelle valeur au travers de l'API.
		callApi( this, "users", "POST", { email: "florian@gmail.com", name: { first: "Florian", last: "Trayon" }, age: Math.floor( Math.random() * 100 ) + 1 } );

		// Mise à jour d'une valeur existante au travers de l'API.
		callApi( this, "users", "PUT", { filter: { email: "florian@gmail.com", age: { $not: { $eq: 10 } } }, update: { age: 10 } } );

		// Suppression définitive d'une valeur de l'API.
		callApi( this, "users", "DELETE", { age: 10 } );
	}

	render()
	{
		// Affichage du rendu HTML du composant.
		return (
			<section className="TestApi">
				<h1>Test de l'appel API vers le serveur</h1>

				<p>État de la réponse GET : {this.state.get}</p>
				<p>État de la réponse POST : {this.state.post}</p>
				<p>État de la réponse PUT : {this.state.put}</p>
				<p>État de la réponse DELETE : {this.state.delete}</p>
			</section>
		);
	}
}