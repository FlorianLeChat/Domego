//
// Fonction permettant de gérer les connexions des utilisateurs aux sockets.
//
import { Server, Socket } from "socket.io";
import { registerUser, findUser } from "../utils/UserManager";
import { registerRoom, updateRoom, findRoom } from "../utils/RoomManager";

export function Connect( _io: Server, socket: Socket )
{
	socket.on( "GameConnect", ( name, role, game, callback ) =>
	{
		// On vérifie tout d'abord si l'utilisateur n'est pas déjà connecté
		// 	dans une autre partie.
		if ( findUser( socket.id ) )
		{
			callback( "error", "server.duplicated_data_title", "server.duplicated_data_description" );
			return;
		}

		// On vérifie également si les informations transmises par l'utilisateur
		//	sont considérées comme valides.
		if ( ( name.length < 5 || name.length > 20 ) || ( role !== "player" && role !== "spectator" ) || game.length !== 36 )
		{
			callback( "error", "server.invalid_data_title", "server.invalid_data_description" );
			return;
		}

		// On met à jour par la même occasion les informations des parties actuelles
		//	afin de prendre en compte ou non les nouveaux joueurs.
		const room = findRoom( game );

		if ( !room )
		{
			// Création d'une nouvelle partie.
			registerRoom( game, name );
		}
		else
		{
			// Vérification du nombre de places restantes.
			if ( role === "player" && room.players >= 6 )
			{
				callback( "error", "server.full_game_title", "server.full_game_description" );
				return;
			}
		}

		updateRoom( game, undefined, role, true );

		// On enregistre alors les données en utilisateur en mémoire.
		const user = registerUser( socket.id, name, role, game );
		socket.join( user.game );

		callback( "success" );

		// On affiche ensuite un message de bienvenue au nouvel utilisateur.
		socket.emit( "GameChat", {
			id: user.id,
			name: user.name,
			message: `Bienvenue ${ user.name } !`
		} );

		// On envoie enfin un message de connexion à tous les joueurs du salon
		//	sauf au nouvel utilisateur.
		socket.broadcast.to( user.game ).emit( "GameChat", {
			id: user.id,
			name: user.name,
			message: `${ user.name } a rejoint la partie.`
		} );
	} );
};