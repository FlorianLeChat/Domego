//
// Route vers le tableau de bord du jeu.
//
import dynamic from "next/dynamic";

const GameBoard = dynamic( () => import( "@/components/GameBoard" ), {
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export default function Board()
{
	return <GameBoard />;
}