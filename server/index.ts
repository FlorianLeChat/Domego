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
import tokens from "./routes/tokens";

app.use( "/api/users", users );
app.use( "/api/tokens", tokens );

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
import { registerUser, findUser, destroyUser, getUsers } from "./utils/UserManager";

const io = new Server( server );

io.on( "connection", ( socket ) =>
{
	// Connexion des utilisateurs aux salons.
	socket.on( "GameConnect", ( username, roomid, callback ) =>
	{
		// On vérifie tout d'abord si l'utilisateur n'est pas déjà connecté
		// 	dans une autre partie.
		if ( findUser( socket.id ) )
		{
			callback( "error", "Duplication des données", "Vous êtes déjà connecté à une partie en cours. Veuillez la quitter avant d'en rejoindre une autre." )
			return;
		}

		// On vérifie également si les informations transmises par l'utilisateur
		//	sont considérées comme valides.
		if ( username.length === 0 || roomid.length === 0 )
		{
			callback( "error", "Informations invalides", "Le nom d'utilisateur ou l'identifiant unique de la partie sont manquants ou invalides." );
			return;
		}

		// On enregistre alors les données en utilisateur en mémoire.
		const user = registerUser( socket.id, username, roomid );
		socket.join( user.room );

		callback( "success" );

		// On affiche ensuite un message de bienvenue au nouvel utilisateur.
		socket.emit( "GameChat", {
			id: user.id,
			name: user.name,
			message: `Bienvenue ${ user.name } !`
		} );

		// On envoie enfin un message de connexion à tous les joueurs du salon
		//	sauf au nouvel utilisateur.
		socket.broadcast.to( user.room ).emit( "GameChat", {
			id: user.id,
			name: user.name,
			message: `${ user.name } a rejoint le chat.`
		} );
	} );

	// Listage des parties actuellement disponibles.
	socket.on( "GameRooms", ( callback ) =>
	{
		callback( getUsers() );
	} );

	// Réception et calcul des estimations de latence client <-> serveur.
	socket.on( "GamePing", ( callback ) =>
	{
		callback();
	} );

	// Réception et diffusion globale des messages utilisateur.
	socket.on( "GameChat", ( message ) =>
	{
		// On tente de récupérer les informations de l'utilisateur avant
		//	d'émettre le message à tous les autres utilisateurs du salon.
		const user = findUser( socket.id );

		if ( user )
		{
			io.to( user.room ).emit( "GameChat", {
				id: user.id,
				name: user.name,
				message: message,
			} );
		}
	} );

	// Déconnexion des utilisateurs du socket.
	socket.on( "disconnect", () =>
	{
		// On tente de récupérer les informations de l'utilisateur avant
		//	de le déconnecter définitivement du salon.
		const user = destroyUser( socket.id );

		if ( user )
		{
			io.to( user.room ).emit( "GameAlert", {
				id: user.id,
				name: user.name,
				message: `${ user.name } a quitté le chat.`,
			} );
		}
	} );
} );