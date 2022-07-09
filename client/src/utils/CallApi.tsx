//
// Permet de créer un appel asynchrone vers une API de test côté serveur.
//
export default function callApi( component: React.Component, url: string, method: string, body: Object="GET" )
{
	fetch( `api/${ url }`, {

		// Méthode de la requête.
		method: method,

		// Corps de la requête.
		body: method === "GET" ? null : JSON.stringify( body ),

		// En-tête HTTP de la requête.
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}

	} )

		// Conversion de la requête sous forme textuelle.
		.then( result => result.json() )

		// Mise à jour de l'état du composant.
		.then( function ( result )
		{
			if ( result.state === true )
			{
				component.setState( { [ method.toLowerCase() ]: JSON.stringify( result.response ?? "" ) } );
			}
			else
			{
				component.setState( { [ method.toLowerCase() ]: "Aucune réponse disponible." } );
			}
		} )

		// Gestion des erreurs.
		.catch( error => console.error( error ) );
}