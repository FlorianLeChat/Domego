//
// Permet d'établir une connexion avec la base de données MongoDB.
//  Source : https://github.com/vercel/next.js/blob/c45481beb1d8c3bc0e1882ee153ef22004ba60c1/examples/with-mongodb-mongoose/lib/dbConnect.js
//
import mongoose from "mongoose";

// On récupère d'abord la connexion établie avec la base de données.
declare global
{
	// Note : https://mariusschulz.com/blog/declaring-global-variables-in-typescript#declare-a-global-variable
	// eslint-disable-next-line vars-on-top, no-var
	var mongoose: { conn?: mongoose.Mongoose, promise?: Promise<mongoose.Mongoose>; };
}

let cached = global.mongoose;

if ( typeof cached === "undefined" )
{
	// Si aucune connexion n'est établie, on se prépare à en établir une.
	cached = global.mongoose = { conn: undefined, promise: undefined };
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
		const uri = `mongodb://${ process.env.MONGODB_HOST }:${ process.env.MONGODB_PORT }/`;
		const options = {
			user: process.env.MONGODB_USERNAME,
			pass: process.env.MONGODB_PASSWORD,
			dbName: process.env.MONGODB_DATABASE
		};

		mongoose.set( "strictQuery", true );

		cached.promise = mongoose.connect( uri, options )
			.then( ( connection ) => connection );
	}

	try
	{
		// On attend après la connexion à la base de données.
		cached.conn = await cached.promise;
	}
	catch ( error )
	{
		// Si une erreur survient, on supprime la promesse de connexion.
		cached.promise = undefined;
		throw error;
	}

	// On retourne enfin la connexion à la base de données.
	return cached.conn;
}