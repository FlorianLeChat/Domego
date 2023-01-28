//
// Route vers le chat de communication du jeu.
//
import dynamic from "next/dynamic";

const GameChat = dynamic( () => import( "@/components/GameChat" ), {
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export default function Chat()
{
	return <GameChat />;
}