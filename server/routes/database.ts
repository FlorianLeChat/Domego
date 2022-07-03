//
// Route fournissant des données après récupération dans une base de données SQL.
//
import express from "express";
import { getDatabase } from "../utils/database";

const router = express.Router();

router.route( "/:collection" )

	.get( async function ( request, result, _next )
	{
		// Exemple de la méthode GET.
		// Récupération de l'ensemble des données (maximum 10).
		try
		{
			const database = getDatabase();
			const collection = database?.collection( request.params.collection );
			const response = await collection?.find().limit( 10 ).toArray();

			result.json( response !== null ? { state: true, response: response } : { state: false } );
		}
		catch ( error )
		{
			result.json( { state: false } );
		}
	} )

	.post( async function ( request, result, _next )
	{
		// Exemple de la méthode POST.
		// Ajout d'une nouvelle donnée quelconque dans la base de données.
		try
		{
			const database = getDatabase();
			const collection = database?.collection( request.params.collection );

			await collection?.insertOne( request.body );

			result.json( { state: true, response: request.body } );
		}
		catch ( error )
		{
			result.json( { state: false } );
		}
	} )

	.put( async function ( request, result, _next )
	{
		// Exemple de la méthode PUT.
		// Modification d'une donnée existante dans la base de données.
		try
		{
			const database = getDatabase();
			const collection = database?.collection( request.params.collection );

			await collection?.findOneAndUpdate( request.body.filter, { $set: request.body.update }, {
				upsert: true
			} );

			result.json( { state: true, response: request.body } );
		}
		catch ( error )
		{
			result.json( { state: false } );
		}
	} )

	.delete( async function ( request, result, _next )
	{
		// Exemple de la méthode DELETE.
		// Suppression d'une donnée existante dans la base de données.
		try
		{
			const database = getDatabase();
			const collection = database?.collection( request.params.collection );

			await collection?.deleteOne( request.body );

			result.json( { state: true, response: request.body } );
		}
		catch ( error )
		{
			result.json( { state: false } );
		}
	} );

export default router;