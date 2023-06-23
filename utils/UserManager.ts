// Importation des déclarations.
import { UserType } from "@/enums/User";
import { UserAttributes } from "@/interfaces/User";

// Déclaration des constantes.
export const users: UserAttributes[] = [];

//
// Enregistrement d'un nouvel utilisateur ayant rejoint la partie.
//
export function registerUser( id: string, name: string, type: UserType, game: string )
{
	const user = { id, name, type, game };
	users.push( user );

	return user;
}

//
// Récupération d'un utilisateur en fonction de son identifiant.
//
export function findUser( id: string )
{
	return users.find( ( user ) => user.id === id );
}

//
// Suppression d'un utilisateur en fonction de son identifiant.
//
export function destroyUser( id: string )
{
	const index = users.findIndex( ( user ) => user.id === id );

	if ( index !== -1 )
	{
		return users.splice( index, 1 )[ 0 ];
	}

	return null;
}

//
// Récupération de tous les utilisateurs en mémoire.
//
export function getUsers()
{
	return structuredClone( users );
}