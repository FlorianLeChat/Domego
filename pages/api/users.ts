//
// Route fournissant des données sur les utilisateurs.
//
import mongoose from "mongoose";
import UserSchema from "@/models/User";
import { ConnectToMongoDB } from "@/utils/MongoConnection";
import type { NextApiRequest, NextApiResponse } from "next";

type SchemaAttributes = mongoose.InferSchemaType<typeof UserSchema>;

export default async function handler( request: NextApiRequest, response: NextApiResponse )
{
	// Connexion à la base de données.
	await ConnectToMongoDB();

	// Restriction de l'accès à l'API en mode de production.
	if ( process.env.NEXT_PUBLIC_ENV === "production" )
	{
		response.status( 403 ).end();
	}

	// Génération du modèle de données pour les utilisateurs.
	const UserModel: mongoose.Model<SchemaAttributes> = ( "User" in mongoose.models )
		? mongoose.models.User : mongoose.model( "User", UserSchema );

	// Détermination de la méthode HTTP utilisée.
	switch ( request.method )
	{
		case "GET":
			// Exemple de la méthode GET.
			// Récupération de l'ensemble des utilisateurs (maximum 10).
			try
			{
				const document = await UserModel.find().limit( 10 );

				if ( Object.keys( document ).length > 0 )
				{
					// Résultats trouvés.
					response.status( 200 ).json( { response: document } );
				}
				else
				{
					// Aucun résultat trouvé.
					response.status( 204 ).end();
				}
			}
			catch ( error )
			{
				// Erreur lors de la récupération des données.
				response.status( 500 ).end();
			}

			break;

		case "POST":
			// Exemple de la méthode POST.
			// Ajout d'un nouvel utilisateur dans la base de données.
			try
			{
				const document = new UserModel( request.query ).save();

				if ( Object.keys( document ).length > 0 )
				{
					// Données ajoutées.
					response.status( 200 ).json( { response: document } );
				}
				else
				{
					// Aucune donnée ajoutée.
					response.status( 204 ).end();
				}
			}
			catch ( error )
			{
				// Erreur lors de l'ajout des données.
				response.status( 500 ).end();
			}

			break;

		case "PUT":
			// Exemple de la méthode PUT.
			// Modification d'un l'utilisateur dans la base de données.
			try
			{
				const { filter, update } = request.body;
				const document = await UserModel.findOneAndUpdate( filter, update );

				if ( document && Object.keys( document ).length > 0 )
				{
					// Données modifiées.
					response.status( 200 ).json( { response: document } );
				}
				else
				{
					// Aucune donnée modifiée.
					response.status( 204 ).end();
				}
			}
			catch ( error )
			{
				response.status( 500 ).end();
			}

			break;

		case "DELETE":
			// Exemple de la méthode DELETE.
			// Suppression d'un utilisateur dans la base de données.
			try
			{
				const document = await UserModel.findOneAndDelete( request.body );

				if ( document && Object.keys( document ).length > 0 )
				{
					// Données supprimées.
					response.status( 200 ).json( { response: document } );
				}
				else
				{
					// Aucune donnée supprimée.
					response.status( 204 ).end();
				}
			}
			catch ( error )
			{
				response.json( { state: false } );
			}

			break;

		default:
			// La méthode utilisée n'est pas supportée.
			response.status( 405 ).end();
	}
}