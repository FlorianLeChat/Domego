// Importation des déclarations.
import { UserType } from "@/enums/User";
import { UserAttributes } from "@/interfaces/User";

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