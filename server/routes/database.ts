//
// Route fournissant des données après récupération dans une base de données SQL.
//
import express from "express";

const router = express.Router();

router.use( function ( request, _result, next )
{
	// Exemple de la journalisation avant traitement.
	console.log( "Heure d'accès à la base de données :", Date.now(), request.protocol + "://" + request.hostname + request.originalUrl );
	next();
} );

// router.param( "user", function ( request, _result, next, id )
// {
// 	// Exemple d'un traitement asynchronique des paramètres avant traitement.
// 	request.user = {
// 		id: id,
// 		name: "Florian"
// 	};

// 	next();
// } );

router.route( "/:id" )
	.get( function ( request, result, _next )
	{
		// Exemple de la méthode GET.
		result.send( `Récupération des données : ${ request.params.id }.` );
	} )

	.post( function ( request, result, _next )
	{
		// Exemple de la méthode POST.
		result.send( `Ajout d'une nouvelle donnée : ${ request.params.id }.` );
	} )

	.put( function ( request, result, _next )
	{
		// Exemple de la méthode PUT.
		result.send( `Mise à jour de la donnée existante : ${ request.params.id }.` );
	} )

	.delete( function ( request, result, _next )
	{
		// Exemple de la méthode DELETE.
		result.send( `Suppression de la donnée existante : ${ request.params.id }.` );
	} );

export default router;