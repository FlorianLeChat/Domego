// Importation de React et de ses dépendances.
import { io, Socket } from "socket.io-client";
import { createContext } from "react";

//
// Permet de créer le socket de communication avec le serveur.
//	Note : on tente de définir l'identifiant unique précédemment en mémoire
//		afin de garder une persistence avec les données du serveur.
//
const cacheId = sessionStorage.getItem( "cacheId" );
const instance = io( { path: process.env.PUBLIC_URL + "/socket.io" } );

instance.auth = { "cacheId": cacheId ?? instance.id };

if ( !cacheId )
{
	sessionStorage.setItem( "cacheId", instance.id );
}

console.log( cacheId );

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