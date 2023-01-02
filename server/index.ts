//
// Initialisation du serveur express.
//
import cors from "cors";
import path from "path";
import express from "express";
import rateLimit from "express-rate-limit";
import * as dotenv from "dotenv";

dotenv.config( { path: "../client/.env" } );

const app = express();
const root = path.resolve( `${ __dirname }/../client/build` );
const limiter = rateLimit( {
	max: 100,
	legacyHeaders: false
} );

app.use( cors( { origin: "http://localhost:3000" } ) );
app.use( limiter );
app.use( express.json() );
app.use( express.static( root ) );

app.disable( "x-powered-by" );

//
// Liaison à la base de données MongoDB.
//
import mongoose from "mongoose";

const connection = mongoose.connection;
mongoose.set( "strictQuery", true );
mongoose.connect( `mongodb://${ process.env.REACT_APP_MONGODB_HOST }:${ process.env.REACT_APP_MONGODB_PORT }/`,
	{
		user: process.env.REACT_APP_MONGODB_USERNAME,
		pass: process.env.REACT_APP_MONGODB_PASSWORD,
		dbName: process.env.REACT_APP_MONGODB_DATABASE
	} as mongoose.ConnectOptions );

connection.on( "error", ( error ) =>
{
	console.error( "Erreur de connexion à la base de données :", error );
} );

//
// Création des routes de réponses via HTTP.
//
import users from "./routes/users";

app.use( "/api/users", users );

app.all( "*", ( _request, result ) =>
{
	result.sendFile( `${ root }/index.html` );
} );

const server = app.listen( 3001 );

//
// Création des routes de réponses via WebSockets.
//
import { Server } from "socket.io";
import { findUser } from "./utils/UserManager";

const io = new Server( server );

io.use( ( socket, next ) =>
{
	// On vérifie tout d'abord si l'utilisateur a transmis un identifiant
	//	unique en provenance de son navigateur pendant la phase de connexion.
	if ( socket.handshake.auth.cacheId )
	{
		// On tente de récupère un quelconque utilisateur actuellement
		//	enregistré avant de le mettre à jour.
		const user = findUser( socket.handshake.auth.cacheId );

		if ( user )
		{
			user.id = socket.id;
		}
	}

	// On continue enfin la connexion.
	next();
} );

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

	// Assignation des rôles.
	const { Roles } = require( "./routes/roles" );
	Roles( io, socket );

	// Gestion des messages.
	const { Chat } = require( "./routes/chat" );
	Chat( io, socket );

	// Action des administrateurs.
	const { Admin } = require( "./routes/admin" );
	Admin( io, socket );

	// Calcul de la latence client<->serveur.
	const { Ping } = require( "./routes/ping" );
	Ping( io, socket );

	// Validation des jetons reCAPTCHA.
	const { Recaptcha } = require( "./routes/recaptcha" );
	Recaptcha( io, socket );
} );