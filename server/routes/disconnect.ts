//
// Route permettant de gérer les déconnexions des utilisateurs aux sockets.
//
import { updateRoom } from "../utils/RoomManager";
import { Server, Socket } from "socket.io";
import { destroyUser, findUser } from "../utils/UserManager";

// Temps d'attente avant une nouvelle vérification de l'identifiant
//	unique de l'utilisateur déconnecté.
const GRACE_TIME = 10000;

export function Disconnect( io: Server, socket: Socket )
{
	socket.on( "disconnect", async () =>
	{
		// On tente de récupérer les informations de l'utilisateur.
		const user = findUser( socket.id );

		if ( user )
		{
			// On met en mémoire son identifiant unique.
			const identifier = user.id;

			// On patiente quelques secondes afin de permettre à l'utilisateur
			//	de se reconnecter et de reprendre la partie.
			await new Promise( resolve => setTimeout( resolve, GRACE_TIME ) );

			// On vérifie alors si l'identifiant unique a été actualisé ou non.
			// 	Note : cela signifie que l'utilisateur s'est reconnecté.
			if ( identifier !== socket.id )
			{
				return;
			}

			// Si l'utilisateur s'est déconnecté pendant une trop longue période,
			// 	on le supprime définitivement de la liste des utilisateurs.
			destroyUser( socket.id );

			// On envoie ensuite une notification à l'ensemble des utilisateurs
			//	encore présents dans le salon afin d'indiquer son départ.
			io.to( user.game ).emit( "GameAlert", user.name, "server.user_disconnected" );

			// On met enfin à jour les informations de la partie.
			updateRoom( user.game, socket.id, user.type, false );
		}
	} );
};