//
// Initialisation du serveur express.
//
import cors from "cors";
import path from "path";
import express from "express";

const app = express();
const root = path.resolve( `${ __dirname }/../client/build` );

app.use( cors() );
app.use( express.json() );
app.use( express.static( root ) );

//
// Création des routes de réponses.
//
import users from "./routes/users";
import rooms from "./routes/rooms";

app.use( "/api/users", users );
app.use( "/api/rooms", rooms );

app.all( "*", ( _request, result, _next ) =>
{
	result.sendFile( `${ root }/index.html` );
} );

const server = app.listen( 3001 );

//
// Liaison à la base de données MongoDB.
//
import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/domego";
const connection = mongoose.connection;

mongoose.connect( url );

connection.once( "open", () =>
{
	console.log( "Connecté à la base de données :", url );
} );

connection.on( "error", ( error ) =>
{
	console.error( "Erreur de connexion à la base de données :", error );
} );

//
// Prise en charge des connexions via les sockets.
//
import { Server } from "socket.io";

const io = new Server( server );

io.on( "connection", ( socket ) =>
{
	console.log( "Un utilisateur s'est connecté." );

	socket.on( "disconnect", () =>
	{
		console.log( "L'utilisateur s'est déconnecté." );
	} );
} );