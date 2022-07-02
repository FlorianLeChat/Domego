//
// Permet de créer un appel asynchrone vers une API de test côté serveur.
//
export default function callApi(component, url)
{
	fetch( url )
		.then( res => res.text() )
		.then( res => component.setState( { response: res } ) )
		.catch( err => err );
}