//
// Route permettant de gérer les commandes des administrateurs.
//
import { findUser } from "@/utils/UserManager";
import { findRoom } from "@/utils/RoomManager";
import { RoomState } from "@/enums/Room";
import { Server, Socket } from "socket.io";

export function Admin( io: Server, socket: Socket )
{
	socket.on( "GameAdmin", ( action, callback ) =>
	{
		// On tente de récupérer tout d'abord les informations de l'utilisateur.
		const user = findUser( socket.id );

		if ( !user )
		{
			return;
		}

		// On récupère ensuite les informations de la partie où l'administrateur
		//	cherche à se connecter.
		const room = findRoom( user.game );

		if ( !room || room.creator !== user.id )
		{
			return;
		}

		// On détermine alors l'action qu'il veut réaliser sur la partie.
		if ( action === "start" )
		{
			// L'administrateur veut démarrer la partie, on vérifie alors l'état
			//	actuel de la partie.
			if ( room.state === RoomState.READY )
			{
				// Tous les participants sont prêts, on peut donc démarrer la partie.
				room.state = RoomState.LAUNCHED;

				io.to( room.id ).emit( "GameStart" );

				callback( "success" );
			}
			else
			{
				// Dans le cas contraire, on affiche une notification d'erreur.
				callback( "error", "server.game_unready_title", "server.game_unready_description" );
			}
		}
	} );
};