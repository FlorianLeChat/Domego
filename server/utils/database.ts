//
// Fonctions utilitaires pour la gestion des connexions à la base de données MongoDB.
//
import { MongoClient, Db, AnyError } from "mongodb";

const url = "mongodb://127.0.0.1:27017/domego";
let database: Db | undefined;

export default {

	// Permet de se connecter au serveur de la base de données.
	connectDatabase: function ( callback: ( arg0: AnyError | undefined ) => void )
	{
		MongoClient.connect( url, function ( error, client )
		{
			database = client?.db( "domego" );

			return callback( error );
		} );
	},

	// Permet de retourner l'objet associé à la base de données.
	getDatabase: function ()
	{
		return database;
	}
};