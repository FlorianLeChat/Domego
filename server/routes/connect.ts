//
// Route permettant de gérer les connexions des utilisateurs aux sockets.
//
import { Server, Socket } from "socket.io";
import { registerUser, findUser, UserType } from "../utils/UserManager";
import { registerRoom, updateRoom, findRoom, RoomState, MAX_PLAYERS } from "../utils/RoomManager";

export function Connect( io: Server, socket: Socket )
{
	socket.on( "GameConnect", ( name, type, game, callback ) =>
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
		if ( ( name.length < 5 || name.length > 20 ) || ( !Object.values( UserType ).includes( type ) ) || game.length !== 36 )
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
			registerRoom( game, socket.id );
		}
		else
		{
			// Vérification de l'unicité des noms d'utilisateurs.
			for ( const identifier of room.players )
			{
				const user = findUser( identifier );

				// L'utilisateur ne doit pas avoir le même nom d'utilisateur que celui
				//	qui a été indiqué.
				if ( user && user.name === name )
				{
					callback( "error", "server.duplicated_username_title", "server.duplicated_username_description" );
					return;
				}
			}

			// Vérification du nombre de places restantes.
			if ( type === UserType.PLAYER && room.players.length >= MAX_PLAYERS )
			{
				callback( "error", "server.full_game_title", "server.full_game_description" );
				return;
			}

			// Vérification de l'état actuel de la partie.
			if ( ( room.state !== RoomState.CREATED && type === UserType.PLAYER ) || room.state === RoomState.FINISHED )
			{
				callback( "error", "server.game_started_title", "server.game_started_description" );
				return;
			}

			// Actualisation des informations de la partie.
			updateRoom( game, socket.id, type, true );
		}

		// On enregistre alors les données en utilisateur en mémoire.
		const user = registerUser( socket.id, name, type, game );
		socket.join( user.game );

		callback( "success" );

		// On envoie enfin un message de connexion à tous les joueurs du salon
		//	sauf au nouvel utilisateur.
		io.to( user.game ).emit( "GameAlert", user.name, "server.user_connected" );
	} );
};