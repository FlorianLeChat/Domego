// Déclaration des interfaces.
interface UserAttributes
{
	id: string;
	name: string;
	room: string;
}

// Déclaration des constantes.
const users: UserAttributes[] = [];

//
// Permet d'ajouter les informations d'un utilisateur en mémoire.
//
export function joinUser( id: string, name: string, room: string )
{
	const user = { id, name, room };
	users.push( user );

	return user;
}

//
// Permet de récupérer l'ensemble des informations d'un utilisateur.
//
export function getCurrentUser( id: string )
{
	return users.find( ( user ) => user.id === id );
}

//
// Permet de supprimer les informations d'un utilisateur à sa déconnexion.
//
export function userDisconnect( id: string )
{
	const index = users.findIndex( ( user ) => user.id === id );

	if ( index !== -1 )
	{
		return users.splice( index, 1 )[ 0 ];
	}
}