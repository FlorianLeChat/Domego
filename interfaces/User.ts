// Interface des attributs d'un joueur.
import { UserType, UserRole, UserState } from "@/utils/UserManager";

export interface UserAttributes
{
	// Identifiant unique de l'utilisateur (socket).
	// Source : https://socket.io/docs/v4/server-socket-instance/#socketid
	id: string;

	// Nom d'utilisateur dans la partie.
	name: string;

	// Type de l'utilisateur (joueur ou spectateur).
	type: UserType;

	// Identifiant unique de la partie (UUID v4).
	// Source : https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
	game: string;

	// Rôle de l'utilisateur (métier dans la partie).
	role?: UserRole;

	// État de l'utilisateur (prêt ou en attente).
	state?: UserState;
}