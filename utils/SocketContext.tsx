// Importation des dépendances.
import Router from "next/router";
import { io, Socket } from "socket.io-client";
import { createContext } from "react";

//
// Permet de créer le socket de communication avec le serveur.
//
let instance!: Socket;

if ( typeof window !== "undefined" )
{
	// On tente d'abord de récupérer l'identifiant unique précédemment
	// 	mis en mémoire.
	const cacheId = sessionStorage.getItem( "cacheId" );

	// On crée ensuite le socket de communication avec le serveur.
	instance = io( { path: process.env[ "NEXT_PUBLIC_BASE_PATH" ] + "/socket.io" } );
	instance.auth = { "cacheId": cacheId };
	instance.on( "connect", () =>
	{
		// Si la connexion au serveur a réussi, on met alors en mémoire
		//	l'identifiant unique du socket.
		sessionStorage.setItem( "cacheId", instance.id );
	} );
	instance.once( "connect_error", ( error ) =>
	{
		// Si la connexion au serveur a échoué, on affiche enfin un message
		// 	d'erreur à l'utilisateur.
		console.error( error.message );

		if ( Router.pathname !== "/500" )
		{
			Router.push( "/500" );
		}
	} );
}

//
// Permet de créer un contexte d'exportation avec le socket précédemment créé.
//
export const SocketContext = createContext<Socket>( instance );

//
// Permet d'importer la référence du contexte du socket.
// 	Source : https://stackoverflow.com/a/67270359
//
export const SocketProvider = ( { children }: any ) =>
(
	<SocketContext.Provider value={instance}>{children}</SocketContext.Provider>
);