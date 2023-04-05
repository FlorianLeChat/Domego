// Importation des déclarations.
import { findUser } from "@/utils/UserManager";
import { UserType } from "@/enums/User";
import { RoomState } from "@/enums/Room";
import { RoomAttributes } from "@/interfaces/Room";

// Déclaration des constantes.
export const rooms: RoomAttributes[] = [];
export const MAX_PLAYERS = 6;

//
// Permet d'enregistrer les informations d'une nouvelle partie.
//
export function registerRoom( id: string, player: string )
{
	const room = { id, state: RoomState.CREATED, creator: player, players: [ player ], spectators: [] };
	rooms.push( room );

	return rooms;
}

//
// Permet de récupérer les informations d'une partie en particulier.
//
export function findRoom( id: string )
{
	return rooms.find( ( room ) => room.id === id );
}

//
// Permet de supprimer les données d'une partie vide.
//
export function destroyRoom( id: string )
{
	const index = rooms.findIndex( ( room ) => room.id === id );

	if ( index !== -1 )
	{
		return rooms.splice( index, 1 )[ 0 ];
	}

	return null;
}

//
// Permet de mettre à jour certaines informations relatives à une partie.
//
export function updateRoom( id: string, player: string, type: UserType, state: boolean )
{
	const room = findRoom( id );

	if ( room && Object.values( UserType ).includes( type ) )
	{
		// Récupération de la liste des joueurs/spectateurs.
		let list: string[] = [];

		switch ( type )
		{
			case UserType.PLAYER:
				list = room.players;
				break;

			case UserType.SPECTATOR:
				list = room.spectators;
				break;

			default:
				break;
		}

		// Ajout ou suppression d'une entrée.
		if ( state )
		{
			list.push( player );
		}
		else
		{
			const index = list.findIndex( ( target ) => target === player );

			if ( index !== -1 )
			{
				list.splice( index, 1 );
			}
		}

		// Suppression de la partie si elle devient complètement vide.
		if ( room.players.length === 0 && room.spectators.length === 0 )
		{
			destroyRoom( id );
		}
	}
}

//
// Permet de récupérer l'ensemble des parties en mémoire.
//  Note : certains champs sont masqués/modifiés avant d'être envoyés
//   aux utilisateurs de la partie React.
//
export function getRooms()
{
	return rooms.map( ( room ) => ( {
		id: room.id,
		state: room.state,
		creator: findUser( room.creator )?.name,
		players: room.players.length,
		spectators: room.spectators.length
	} ) );
}