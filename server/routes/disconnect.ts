//
// Fonction permettant de gérer les déconnexions des utilisateurs aux sockets.
//
import { updateRoom } from "../utils/RoomManager";
import { destroyUser } from "../utils/UserManager";
import { Server, Socket } from "socket.io";

export function Disconnect( io: Server, socket: Socket )
{
	socket.on( "disconnect", () =>
	{
		// On tente de récupérer les informations de l'utilisateur avant
		//	de le déconnecter définitivement du salon.
		const user = destroyUser( socket.id );

		if ( user )
		{
			// On envoie ensuite une notification à l'ensemble des utilisateurs
			//	encore présents dans le salon.
			io.to( user.game ).emit( "GameAlert", {
				id: user.id,
				name: user.name,
				message: `${ user.name } a quitté la partie.`,
			} );

			// On met enfin à jour les informations de la partie.
			updateRoom( user.game, socket.id, user.type, false );
		}
	} );
};