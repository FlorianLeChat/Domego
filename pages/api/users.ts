//
// Route fournissant des données sur les utilisateurs.
//
import User from "@/models/User";
import { ConnectToMongoDB } from "@/utils/MongoConnection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler( request: NextApiRequest, result: NextApiResponse )
{
	// Connexion à la base de données.
	await ConnectToMongoDB();

	// Restriction de l'accès à l'API en mode de production.
	if ( process.env.NODE_ENV === "production" )
	{
		result.status( 403 ).end();
	}

	// Détermination de la méthode HTTP utilisée.
	switch ( request.method )
	{
		case "GET":
			// Exemple de la méthode GET.
			// Récupération de l'ensemble des utilisateurs (maximum 10).
			try
			{
				const document = await User.find().limit( 10 );

				result.json( document ? { state: true, response: document } : { state: false } );
			}
			catch ( error )
			{
				result.json( { state: false } );
			}

			break;

		case "POST":
			// Exemple de la méthode POST.
			// Ajout d'un nouvel utilisateur dans la base de données.
			try
			{
				const user = new User( request.body );
				const document = await user.save();

				result.json( document ? { state: true, response: document } : { state: false } );
			}
			catch ( error )
			{
				result.json( { state: false } );
			}

			break;

		case "PUT":
			// Exemple de la méthode PUT.
			// Modification d'un l'utilisateur dans la base de données.
			try
			{
				const document = await User.findOneAndUpdate( request.body.filter, request.body.update );

				result.json( document ? { state: true, response: document } : { state: false } );
			}
			catch ( error )
			{
				result.json( { state: false } );
			}

			break;

		case "DELETE":
			// Exemple de la méthode DELETE.
			// Suppression d'un utilisateur dans la base de données.
			try
			{
				const document = await User.findOneAndDelete( request.body );

				result.json( document ? { state: true, response: document } : { state: false } );
			}
			catch ( error )
			{
				result.json( { state: false } );
			}

			break;

		default:
			// La méthode utilisée n'est pas supportée.
			result.status( 405 ).end();
	}
};