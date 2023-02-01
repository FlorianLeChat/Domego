// Importation des déclarations.
import { UserAttributes } from "@/interfaces/User";

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