//
// Permet d'établir une connexion avec la base de données MongoDB.
// 	Source : https://github.com/vercel/next.js/blob/c45481beb1d8c3bc0e1882ee153ef22004ba60c1/examples/with-mongodb-mongoose/lib/dbConnect.js
//
import mongoose from "mongoose";

declare global
{
	// Déclaration de la variable globale mongoose.
	var mongoose: { conn: mongoose.Connection | null, promise: Promise<mongoose.Mongoose> | null; };
}

// On récupère d'abord la connexion établie avec la base de données.
let cached = global.mongoose;

if ( !cached )
{
	// Si aucune connexion n'est établie, on se prépare à en établir une.
	cached = global.mongoose = { conn: null, promise: null };
}

export async function ConnectToMongoDB()
{
	// On vérifie ensuite si la connexion est déjà établie.
	if ( cached.conn )
	{
		// Si c'est le cas, on retourne directement la connexion.
		return cached.conn;
	}

	// On vérifie également si la promesse de connexion est déjà en cours.
	if ( !cached.promise )
	{
		// Si ce n'est pas le cas, on définit d'abord la connexion à la base de données.
		const connection = mongoose.connection;
		mongoose.set( "strictQuery", true );
		mongoose.connect( `mongodb://${ process.env[ "MONGODB_HOST" ] }:${ process.env[ "MONGODB_PORT" ] }/`,
			{
				user: process.env[ "MONGODB_USERNAME" ],
				pass: process.env[ "MONGODB_PASSWORD" ],
				dbName: process.env[ "MONGODB_DATABASE" ]
			} as mongoose.ConnectOptions );

		// On retourne ensuite une promesse pour attendre la connexion à la base de données.
		cached.promise = new Promise( ( resolve, reject ) =>
		{
			connection.once( "open", () =>
			{
				// Une fois la connexion établie, on termine enfin la promesse.
				console.log( "Connexion à la base de données établie." );
				resolve( mongoose );
			} );

			connection.on( "error", ( error ) =>
			{
				// On affiche alors les erreurs de connexion dans la console.
				console.error( "Erreur de connexion à la base de données :", error.message );
				reject( error );
			} );
		} );
	}

	try
	{
		// On attend après la connexion à la base de données.
		cached.conn = await cached.promise;
	}
	catch ( error )
	{
		// Si une erreur survient, on supprime la promesse de connexion.
		cached.promise = null;
		throw error;
	}

	// On retourne enfin la connexion à la base de données.
	return cached.conn;
};