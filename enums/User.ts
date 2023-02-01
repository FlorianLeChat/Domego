// Énumération des types de joueurs.
export enum UserType
{
	// Joueur.
	PLAYER = "player",

	// Spectateur.
	SPECTATOR = "spectator"
}

// Énumération des états d'un joueur.
export enum UserState
{
	// En attente.
	WAITING = 0,

	// Prêt.
	READY = 1
}

// Énumération des rôles d'un joueur.
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