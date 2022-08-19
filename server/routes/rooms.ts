//
// Fonction permettant de lister les parties actuellement disponibles.
//
import { getRooms } from "../utils/RoomManager";
import { Server, Socket } from "socket.io";

export function Rooms( _io: Server, socket: Socket )
{
	socket.on( "GameRooms", ( callback ) =>
	{
		callback( getRooms() );
	} );
};