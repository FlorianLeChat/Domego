//
// Fonctions utilitaires pour la gestion des connexions à la base de données MongoDB.
//
import { MongoClient, Db } from "mongodb";

const url = "mongodb://127.0.0.1:27017/domego";
let database: Db | undefined;

// Permet de se connecter au serveur de la base de données.
export function connectDatabase()
{
	MongoClient.connect( url, function ( error, client )
	{
		if ( error ) throw error;

		database = client?.db( "domego" );
	} );
}

// Permet de retourner l'objet associé à la base de données.
export function getDatabase()
{
	return database;
}