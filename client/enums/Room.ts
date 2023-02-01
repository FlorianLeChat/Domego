// Énumération des états d'une partie.
export enum RoomState
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