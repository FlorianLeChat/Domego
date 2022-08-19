//
// Fonction permettant de réceptionner et de diffuser les messages utilisateur.
//
import { findUser } from "../utils/UserManager";
import { Server, Socket } from "socket.io";

export function Chat( io: Server, socket: Socket )
{
	socket.on( "GameChat", ( message ) =>
	{
		// On tente de récupérer les informations de l'utilisateur avant
		//	d'émettre le message à tous les autres utilisateurs du salon.
		const user = findUser( socket.id );

		if ( user )
		{
			io.to( user.game ).emit( "GameChat", {
				id: user.id,
				name: user.name,
				message: message,
			} );
		}
	} );
};