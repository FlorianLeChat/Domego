//
// Route vers la page de test de la base de données (opérations CRUD).
//
import { useState, useEffect } from "react";

import styles from "@/styles/TestApi.module.scss";
import { fetchApi } from "@/utils/NetworkHelper";

export default function TestApi()
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
		fetchApi( "users", "GET" ).then( response =>
		{
			setResponse( ( state ) => ( {
				...state, get: JSON.stringify( response )
			} ) );
		} );

		// Ajout d'une nouvelle valeur au travers de l'API.
		fetchApi( "users", "POST", { email: "florian@gmail.com", name: { first: "Florian", last: "Trayon" }, age: Math.floor( Math.random() * 100 ) + 1 } ).then( response =>
		{
			setResponse( ( state ) => ( {
				...state, post: JSON.stringify( response )
			} ) );
		} );

		// Mise à jour d'une valeur existante au travers de l'API.
		fetchApi( "users", "PUT", { filter: { email: "florian@gmail.com", age: { $not: { $eq: 10 } } }, update: { age: 10 } } ).then( response =>
		{
			setResponse( ( state ) => ( {
				...state, put: JSON.stringify( response )
			} ) );
		} );

		// Suppression définitive d'une valeur de l'API.
		fetchApi( "users", "DELETE", { age: 10 } ).then( response =>
		{
			setResponse( ( state ) => ( {
				...state, delete: JSON.stringify( response )
			} ) );
		} );
	}, [] );

	// Affichage du rendu HTML du composant.
	return (
		<section id={styles[ "TestApi" ]}>
			<h1>Test de l'appel API vers le serveur</h1>

			<p>État de la réponse GET : {responses.get}</p>
			<p>État de la réponse POST : {responses.post}</p>
			<p>État de la réponse PUT : {responses.put}</p>
			<p>État de la réponse DELETE : {responses.delete}</p>
		</section>
	);
}