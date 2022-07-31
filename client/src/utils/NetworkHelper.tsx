//
// Permet de créer un appel asynchrone vers une route de données côté serveur.
//
export function fetchApi( url: string, method: string = "GET", body: Object = {} ): Promise<string>
{
	// On génère une promesse à cause de la création d'une requête réseau.
	return new Promise<string>( async ( resolve, reject ) =>
	{
		// On créé une requête réseau en direction de l'API de test.
		const response = await fetch( `api/${ url }`, {

			// Méthode de la requête.
			method: method,

			// Corps de la requête.
			body: method === "GET" ? null : JSON.stringify( body ),

			// En-tête HTTP de la requête.
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}

		} )

		// Lors de sa réponse, on vérifie si la réponse est valide.
		if ( response.ok )
		{
			// Si c'est le cas, on transforme ensuite la réponse en JSON.
			const json = await response.json();

			// On donne enfin le résultat adéquat en fonction de la réponse de l'API.
			json.state === true ? resolve( JSON.stringify( json.response ?? "" ) ) : reject( "Aucune réponse disponible." );
		}

		// Dans le cas contraire, on rejette la promesse avec le message d'erreur.
		reject( response.statusText );
	} );
}