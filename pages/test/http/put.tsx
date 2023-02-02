//
// Route vers la page de test de la base de données (requêtes PUT).
//
import Router from "next/router";

import styles from "@/styles/TestApi.module.scss";
import { fetchApi } from "@/utils/NetworkHelper";

export default function HttpGet()
{
	// Restriction d'accès à la page.
	if ( process.env.NODE_ENV === "production" )
	{
		Router.push( "/" );
		return;
	}

	// Récupération des données de l'API.
	const { data, error, isLoading } = fetchApi( "users", "PUT", { filter: { email: "florian@gmail.com", age: { $not: { $eq: 10 } } }, update: { age: 10 } } );
	let response = "";

	if ( error )
	{
		response = "Une erreur est survenue.";
	}
	else if ( isLoading )
	{
		response = "Chargement en cours...";
	}
	else if ( !data )
	{
		response = "Aucune donnée disponible.";
	}
	else
	{
		response = JSON.stringify( data );
	}

	// Affichage du rendu HTML du composant.
	return (
		<section id={styles[ "TestApi" ]}>
			<h1>Requête de type PUT vers l'API</h1>

			<p>État de la réponse : {response}</p>
		</section>
	);
}