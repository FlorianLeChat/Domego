//
// Création et gestion des sockets de communication avec le serveur.
//  Source : https://stackoverflow.com/a/67270359
//
import Router from "next/router";
import { join } from "path";
import { io, Socket } from "socket.io-client";
import { createContext, ReactNode } from "react";

let instance!: Socket | null;

if ( typeof window !== "undefined" )
{
	// On tente d'abord de récupérer l'identifiant unique précédemment
	//  mis en mémoire et on stocke le nombre de tentatives de connexion.
	const cacheId = sessionStorage.getItem( "cacheId" );
	let retries = 0;

	// On crée ensuite le socket de communication avec le serveur.
	instance = io( {
		path: join( new URL( process.env.NEXT_PUBLIC_URL ?? "" ).pathname, "/internal/socket.io/" ).replace( /\\/g, "/" )
	} );
	instance.auth = { cacheId };
	instance.on( "connect", () =>
	{
		// Si la connexion au serveur a réussi, on met alors en mémoire
		//  l'identifiant unique du socket.
		sessionStorage.setItem( "cacheId", instance?.id ?? "" );
	} );
	instance.on( "connect_error", () =>
	{
		// Si la connexion au serveur a échoué, on vérifie le nombre de
		//  tentatives de connexion.
		if ( retries < 2 )
		{
			// Si c'est la première ou deuxième tentative, on tente de se
			//  reconnecter au serveur après 1 seconde.
			setTimeout( () =>
			{
				retries++;
				instance?.connect();
			}, 1000 );
		}
		else if ( Router.pathname !== "/404" && Router.pathname !== "/500" )
		{
			// Si c'est la troisième tentative, on affiche l'erreur dans la
			//  console et on redirige vers la page d'erreur.
			Router.push( "/500" );
		}
	} );
}

// Création et exportation du contexte.
export const SocketContext = createContext( instance );

// Exportation du fournisseur de contexte.
export function SocketProvider( { children }: { children: ReactNode } )
{
	return <SocketContext.Provider value={instance}>{children}</SocketContext.Provider>;
}