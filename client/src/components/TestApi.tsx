//
// Composant pour le test de récupération des données de l'API côté serveur.
//
import { callApi } from "../utils/NetworkHelper";
import { useState, useEffect } from "react";

import "./TestApi.scss";

export default function TestApi(): JSX.Element
{
	// Déclaration des variables d'état.
	const [ responses, setResponse ] = useState( {
		get: "Veuillez patienter...",
		post: "Veuillez patienter...",
		put: "Veuillez patienter...",
		delete: "Veuillez patienter..."
	} );

	useEffect( () =>
	{
		// Récupération de l'ensemble des données de l'API.
		const makeGetRequest = async () =>
		{
			const response = await callApi( "users", "GET" );

			setResponse( ( state ) => ( {
				...state, get: response
			} ) );
		}

		makeGetRequest()
			.catch( console.error );

		// Ajout d'une nouvelle valeur au travers de l'API.
		const makePostRequest = async () =>
		{
			const response = await callApi( "users", "POST", { email: "florian@gmail.com", name: { first: "Florian", last: "Trayon" }, age: Math.floor( Math.random() * 100 ) + 1 } );

			setResponse( ( state ) => ( {
				...state, post: response
			} ) );
		};

		makePostRequest()
			.catch( console.error );

		// Mise à jour d'une valeur existante au travers de l'API.
		const makePutRequest = async () =>
		{
			const response = await callApi( "users", "PUT", { filter: { email: "florian@gmail.com", age: { $not: { $eq: 10 } } }, update: { age: 10 } } );

			setResponse( ( state ) => ( {
				...state, put: response
			} ) );
		};

		makePutRequest()
			.catch( console.error );

		// Suppression définitive d'une valeur de l'API.
		const makeDeleteRequest = async () =>
		{
			const response = await callApi( "users", "DELETE", { age: 10 } );

			setResponse( ( state ) => ( {
				...state, delete: response
			} ) );
		};

		makeDeleteRequest()
			.catch( console.error );
	}, [] );

	// Affichage du rendu HTML du composant.
	return (
		<section className="TestApi">
			<h1>Test de l'appel API vers le serveur</h1>

			<p>État de la réponse GET : {responses.get}</p>
			<p>État de la réponse POST : {responses.post}</p>
			<p>État de la réponse PUT : {responses.put}</p>
			<p>État de la réponse DELETE : {responses.delete}</p>
		</section>
	);
}