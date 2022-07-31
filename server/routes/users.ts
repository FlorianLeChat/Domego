//
// Route fournissant des données sur les utilisateurs.
//
import User from "../models/User";
import express from "express";

const router = express.Router();

router.route( "/" )

	.get( async ( _request, result ) =>
	{
		// Exemple de la méthode GET.
		// Récupération de l'ensemble des utilisateurs (maximum 10).
		try
		{
			const document = await User.find().limit( 10 );

			result.json( document !== null ? { state: true, response: document } : { state: false } );
		}
		catch ( error )
		{
			result.json( { state: false } );
		}
	} )

	.post( async ( request, result ) =>
	{
		// Exemple de la méthode POST.
		// Ajout d'un nouvel utilisateur dans la base de données.
		try
		{
			const user = new User( request.body );
			const document = await user.save();

			result.json( document !== null ? { state: true, response: document } : { state: false } );
		}
		catch ( error )
		{
			result.json( { state: false } );
		}
	} )

	.put( async ( request, result ) =>
	{
		// Exemple de la méthode PUT.
		// Modification d'un l'utilisateur dans la base de données.
		try
		{
			const document = await User.findOneAndUpdate( request.body.filter, request.body.update );

			result.json( document !== null ? { state: true, response: document } : { state: false } );
		}
		catch ( error )
		{
			result.json( { state: false } );
		}
	} )

	.delete( async ( request, result ) =>
	{
		// Exemple de la méthode DELETE.
		// Suppression d'un utilisateur dans la base de données.
		try
		{
			const document = await User.findOneAndDelete( request.body );

			result.json( document !== null ? { state: true, response: document } : { state: false } );
		}
		catch ( error )
		{
			result.json( { state: false } );
		}
	} );

export default router;