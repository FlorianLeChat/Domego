//
// Permet de créer un appel asynchrone vers une route de données côté serveur.
//
import useSWR from "swr";

export function fetchApi( url: string, method: string = "GET", body: Object = {} )
{
	// On utilise la librairie SWR pour créer un appel asynchrone vers l'API.
	const { data, error, isLoading, isValidating } = useSWR( `http://localhost:3000/api/${ url }`, async ( url: string ) =>
	{
		// On créé alors une requête réseau en direction de l'API de test.
		return await fetch( url, {
			// Méthode de la requête.
			method: method,

			// Corps de la requête.
			body: method === "GET" ? null : JSON.stringify( body ),

			// En-tête HTTP de la requête.
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		} ).then( response => response.json() );
	} );

	// On retourne enfin les données de l'API.
	return {
		data: data,
		error: error,
		isLoading,
		isValidating
	};
}