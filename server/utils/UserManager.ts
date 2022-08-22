// Déclaration des interfaces.
export interface UserAttributes
{
	// Identifiant unique de l'utilisateur (socket).
	// 	Source : https://socket.io/docs/v4/server-socket-instance/#socketid
	id: string;

	// Nom d'utilisateur dans la partie.
	name: string;

	// Type de l'utilisateur (joueur ou spectateur).
	type: UserType;

	// Identifiant unique de la partie (UUID v4).
	// 	Source : https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
	game: string;

	// Rôle de l'utilisateur (métier dans la partie).
	role?: UserRole;

	// État de l'utilisateur (prêt ou en attente).
	state?: UserState;
}

// Déclaration des énumérations.
export enum UserType
{
	// Joueur.
	PLAYER = "player",

	// Spectateur.
	SPECTATOR = "spectator"
}

export enum UserState
{
	// En attente.
	WAITING = 0,

	// Prêt.
	READY = 1
}

export enum UserRole
{
	// Maître d'ouvrage.
	OWNER = "project_owner",

	// Maître d'œuvre (Architecte).
	MANAGER = "project_manager",

	// Bureau d'études.
	ENGINEER = "engineering_office",

	// Bureau de contrôle.
	INSPECTOR = "control_office",

	// Entreprise corps état secondaire.
	ARTISAN = "secondary_state",

	// Entreprise gros œuvre.
	BUILDER = "general_construction",
}

// Déclaration des constantes.
export const users: UserAttributes[] = [];

//
// Permet d'enregistrer un utilisateur ayant rejoint une partie.
//
export function registerUser( id: string, name: string, type: UserType, game: string )
{
	const user = { id, name, type, game };
	users.push( user );

	return user;
}

//
// Permet de supprimer les données d'un utilisateur déconnecté.
//
export function destroyUser( id: string )
{
	const index = users.findIndex( ( user ) => user.id === id );

	if ( index !== -1 )
	{
		return users.splice( index, 1 )[ 0 ];
	}
}

//
// Permet de récupérer les informations d'un utilisateur en particulier.
//
export function findUser( id: string )
{
	return users.find( ( user ) => user.id === id );
}

//
// Permet d'exporter l'ensemble des utilisateurs en mémoire.
//
export function getUsers()
{
	return structuredClone( users );
}