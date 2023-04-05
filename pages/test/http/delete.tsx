//
// Route vers la page de test de la base de données (requêtes DELETE).
//
import useSWR from "swr";
import styles from "./test.module.scss";

export default function HttpGet()
{
	// Récupération des données de l'API.
	const { data, error, isLoading } = useSWR( "http://localhost:3000/api/users", async ( url ) => fetch( url, {
		method: "DELETE",
		body: JSON.stringify( { age: 10 } ),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	} ).then( ( response ) => response.json() ) );

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
		<section id={styles.TestApi}>
			<h1>Requête de type DELETE vers l&apos;API</h1>

			<p>État de la réponse : {response}</p>
		</section>
	);
}