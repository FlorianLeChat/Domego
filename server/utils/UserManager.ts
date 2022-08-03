// Déclaration des interfaces.
interface UserAttributes
{
	// Identifiant unique de l'utilisateur (socket).
	// 	Source : https://socket.io/docs/v4/server-socket-instance/#socketid
	id: string[ 20 ];

	// Nom d'utilisateur (le premier équivaut au créateur).
	name: string;

	// Rôle de l'utilisateur (joueur ou spectateur).
	role: UserRole;

	// Identifiant unique de la partie (UUID v4).
	// 	Source : https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
	game: string[ 36 ];
}

// Déclaration des énumérations.
enum UserRole
{
	// Joueur.
	PLAYER = "player",

	// Spectateur.
	SPECTATOR = "spectator",
}

// Déclaration des constantes.
const users: UserAttributes[] = [];

//
// Permet d'enregistrer un utilisateur ayant rejoint une partie.
//
export function registerUser( id: string, name: string, role: UserRole, game: string )
{
	const user = { id, name, role, game };
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