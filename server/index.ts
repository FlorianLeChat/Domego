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
import { joinUser, getCurrentUser, userDisconnect } from "./utils/UserManager";

const io = new Server( server );

io.on( "connection", ( socket ) =>
{
	// Connexion des utilisateurs aux salons.
	socket.on( "joinRoom", ( { username, roomname } ) =>
	{
		// On met en mémoire l'utilisateur.
		const user = joinUser( { id: socket.id, name: username, room: roomname } );
		socket.join( user.room );

		// On affiche ensuite un message de bienvenue au nouvel utilisateur.
		socket.emit( "message", {
			id: user.id,
			name: user.name,
			message: `Bienvenue ${ user.name } !`
		} );

		// On envoie enfin un message de connexion à tous les joueurs du salon
		//	sauf au nouvel utilisateur.
		socket.broadcast.to( user.room ).emit( "message", {
			id: user.id,
			name: user.name,
			message: `${ user.name } a rejoint le chat.`
		} );
	} );

	// Réception des estimations de latence client <-> serveur.
	socket.on( "ping", ( callback ) =>
	{
		callback();
	} );

	// Réception des messages.
	socket.on( "chat", ( message ) =>
	{
		// On tente de récupérer les informations de l'utilisateur avant
		//	d'émettre le message à tous les autres utilisateurs du salon.
		const user = getCurrentUser( socket.id );

		if ( user )
		{
			io.to( user.room ).emit( "message", {
				id: user.id,
				name: user.name,
				message: message,
			} );
		}
	} );

	// Déconnexion des utilisateurs des salons.
	socket.on( "disconnect", () =>
	{
		// On tente de récupérer les informations de l'utilisateur avant
		//	de le déconnecter définitivement du salon.
		const user = userDisconnect( socket.id );

		if ( user )
		{
			io.to( user.room ).emit( "message", {
				id: user.id,
				name: user.name,
				message: `${ user.name } a quitté le chat.`,
			} );
		}
	} );
} );