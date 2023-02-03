//
// Interface des attributs d'une partie.
//
import type { RoomState } from "@/enums/Room";

export interface RoomAttributes
{
	// Identifiant unique de la partie (UUID v4).
	// Source : https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
	id: string;

	// État actuel de la partie (en cours, terminée, etc.).
	state: RoomState;

	// Nom d'utilisateur du créateur de la partie.
	creator: string;

	// Liste des joueurs présents dans la partie.
	players: string[];

	// Liste des spectateurs présents dans la partie.
	spectators: string[];
}