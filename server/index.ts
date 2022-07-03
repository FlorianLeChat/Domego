import cors from "cors";
import path from "path";
import express from "express";

// Création du serveur express.
const app = express();
const root = path.resolve( `${ __dirname }/../client/build` );

app.use( cors() );
app.use( express.json() );
app.use( express.static( root ) );

const server = app.listen( 3001 );

// Communication avec le chat de test.
import { Server } from "socket.io";
const io = new Server( server );

io.on( "connection", function ( socket )
{
	console.log( "Un utilisateur s'est connecté." );

	socket.on( "disconnect", function ()
	{
		console.log( "L'utilisateur s'est déconnecté." );
	} );
} );

// Initialisation de la base de données.
import { connectDatabase } from "./utils/database";

connectDatabase();

// Création des routes de tests.
import json from "./routes/json";
import database from "./routes/database";

app.use( "/api/json", json );
app.use( "/api/database", database );

// Affichage par défaut des fichiers statiques.
app.get( "*", function ( _request, result, _next )
{
	result.sendFile( `${ root }/index.html` );
} );

// Envoi d'un message d'erreur sur les routes manquantes.
app.use( function ( _request, result, _next )
{
	result.sendStatus( 404 );
} );