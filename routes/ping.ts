//
// Route permettant de calculer la latence entre le client et le serveur.
//
import { Server, Socket } from "socket.io";

export function Ping( _io: Server, socket: Socket )
{
	socket.on( "GamePing", ( callback ) =>
	{
		callback();
	} );
};