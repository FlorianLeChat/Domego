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
// Permet d'enregistrer un utilisateur ayant rejoint une partie.
//
export function registerUser( id: string, name: string, room: string )
{
	const user = { id, name, room };
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
// Permet de récupérer les informations d'un utilisateur.
//
export function findUser( id: string )
{
	return users.find( ( user ) => user.id === id );
}

//
// Permet de récupérer l'ensemble des utilisateurs associés à des parties.
//
export function getUsers()
{
	return users.map( ( user ) =>
	{
		return {
			// L'identifiant unique de la partie.
			id: user.room,

			// Le nom de l'utilisateur ayant créé la partie.
			creator: user.name,

			// Le nombre de joueurs associés à cette partie.
			count: users.filter( ( room ) => room.id === user.id ).length,
		};
	} );
}