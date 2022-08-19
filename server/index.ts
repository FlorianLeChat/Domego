//
// Initialisation du serveur express.
//
import cors from "cors";
import path from "path";
import express from "express";

const app = express();
const root = path.resolve( `${ __dirname }/../client/build` );

app.use( cors( { origin: "http://localhost:3000" } ) );
app.use( express.json() );
app.use( express.static( root ) );

app.disable( "x-powered-by" );

//
// Création des routes de réponses.
//
import users from "./routes/users";

app.use( "/api/users", users );

app.all( "*", ( _request, result ) =>
{
	result.sendFile( `${ root }/index.html` );
} );

const server = app.listen( 3001 );

//
// Liaison à la base de données MongoDB.
//
import mongoose from "mongoose";

const connection = mongoose.connection;

mongoose.connect( "mongodb://127.0.0.1:27017/domego" );

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
	// Connexion des utilisateurs.
	const { Connect } = require( "./routes/connect" );
	Connect( io, socket );

	// Déconnexion des utilisateurs.
	const { Disconnect } = require( "./routes/disconnect" );
	Disconnect( io, socket );

	// Récupération des parties.
	const { Rooms } = require( "./routes/rooms" );
	Rooms( io, socket );

	// Gestion des messages.
	const { Chat } = require( "./routes/chat" );
	Chat( io, socket );

	// Calcul de la latence client<->serveur.
	const { Ping } = require( "./routes/ping" );
	Ping( io, socket );

	// Validation des jetons reCAPTCHA.
	const { Recaptcha } = require( "./routes/recaptcha" );
	Recaptcha( io, socket );
} );