import { Component } from "react";
import "./TestApi.css";

export default class TestApi extends Component
{
	constructor( props )
	{
		super( props );

		this.state = { response: "" };
	}

	callAPI()
	{
		// Requête de l'API vers le serveur NodeJS.
		fetch( "cats" )
			.then( res => res.text() )
			.then( res => this.setState( { response: res } ) )
			.catch( err => err );
	}

	componentDidMount()
	{
		// Appel de la requête API au chargement du composant.
		this.callAPI();
	}

	render()
	{
		// Rendu final de la page.
		return (
			<section className="component-testApi">
				<h1>Bienvenue sur React !</h1>

				<p>État de la réponse : {this.state.response}</p>
			</section>
		);
	}
}