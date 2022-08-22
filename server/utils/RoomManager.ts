// Déclaration des interfaces.
interface RoomAttributes
{
	// Identifiant unique de la partie (UUID v4).
	// 	Source : https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
	id: string[ 36 ];

	// État actuel de la partie (en cours, terminée, etc.).
	state: RoomState;

	// Nom d'utilisateur du créateur de la partie.
	creator: string;

	// Nombre de joueurs présents dans la partie.
	players: number;

	// Nombre de spectateurs présents dans la partie.
	spectators: number;
}

// Déclaration des énumérations.
enum RoomState
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
const rooms: RoomAttributes[] = [];

//
// Permet d'enregistrer les informations d'une nouvelle partie.
//
export function registerRoom( id: string, creator: string )
{
	const room = { id: id, state: RoomState.CREATED, creator: creator, players: 0, spectators: 0 };
	rooms.push( room );

	return rooms;
}

//
// Permet de mettre à jour certaines informations relatives à une partie.
//
export function updateRoom( id: string, state?: RoomState, role?: string, incremental?: boolean )
{
	const room = findRoom( id );

	if ( room )
	{
		// Tentative de mise à jour de l'état de la partie.
		if ( state !== undefined )
		{
			room.state = state;
		}

		// Tentative de mise à jour du nombre de joueurs/spectateurs.
		if ( role !== undefined && incremental !== undefined )
		{
			if ( role === "player" )
			{
				// Incrémentation/décrémentation du nombre de joueurs.
				incremental ? room.players++ : room.players--;
			}
			else
			{
				// Incrémentation/décrémentation du nombre de spectateurs.
				incremental ? room.spectators++ : room.spectators--;
			}
		}

		// Suppression de la partie si elle devient complètement vide.
		if ( room.players === 0 && room.spectators === 0 )
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
//
export function getRooms()
{
	return structuredClone( rooms );
}