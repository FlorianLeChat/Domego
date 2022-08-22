// Importation de déclarations.
import { findUser, UserType } from "../utils/UserManager";

// Déclaration des interfaces.
export interface RoomAttributes
{
	// Identifiant unique de la partie (UUID v4).
	// 	Source : https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
	id: string;

	// État actuel de la partie (en cours, terminée, etc.).
	state: RoomState;

	// Nom d'utilisateur du créateur de la partie.
	creator: string;

	// Liste des joueurs présents dans la partie.
	players: string[];

	// Liste des spectateurs présents dans la partie.
	spectators: string[];
}

// Déclaration des énumérations.
export enum RoomState
{
	// État de création (aucun joueur prêt).
	CREATED = 0,

	// État de préparation (tous les joueurs prêts).
	READY = 1,

	// État de jeu (partie en cours).
	LAUNCHED = 2,

	// État de fin (partie terminée).
	FINISHED = 3
}

// Déclaration des constantes.
export const rooms: RoomAttributes[] = [];
export const MAX_PLAYERS = 6;

//
// Permet d'enregistrer les informations d'une nouvelle partie.
//
export function registerRoom( id: string, player: string )
{
	const room = { id: id, state: RoomState.CREATED, creator: player, players: [ player ], spectators: [] };
	rooms.push( room );

	return rooms;
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

		if ( type === UserType.PLAYER )
		{
			list = room.players;
		}
		else if ( type === UserType.SPECTATOR )
		{
			list = room.spectators;
		}

		// Ajout ou suppression d'une entrée.
		if ( state )
		{
			list.push( player );
		}
		else
		{
			const index = list.findIndex( ( id ) => id === player );

			if ( index !== -1 )
			{
				list.splice( index, 1 )[ 0 ];
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
// Permet de supprimer les données d'une partie vide.
//
export function destroyRoom( id: string )
{
	const index = rooms.findIndex( ( room ) => room.id === id );

	if ( index !== -1 )
	{
		return rooms.splice( index, 1 )[ 0 ];
	}
}

//
// Permet de récupérer les informations d'une partie en particulier.
//
export function findRoom( id: string )
{
	return rooms.find( ( room ) => room.id === id );
}

//
// Permet de récupérer l'ensemble des parties en mémoire.
//	Note : certains champs sont masqués/modifiés avant d'être envoyés
//		aux utilisateurs de la partie React.
//
export function getRooms()
{
	return rooms.map( ( room ) =>
	{
		return {
			id: room.id,
			creator: findUser( room.creator )?.name,
			players: room.players.length,
			spectators: room.spectators.length
		};
	} );
}