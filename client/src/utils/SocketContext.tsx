// Importation de React et de ses dépendances.
import { io, Socket } from "socket.io-client";
import { createContext } from "react";

//
// Permet de créer le socket de communication avec le serveur.
//
const instance = io( { path: process.env.PUBLIC_URL + "/socket.io" } );

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