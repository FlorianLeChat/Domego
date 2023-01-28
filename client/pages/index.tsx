//
// Route vers la page d'accueil du jeu.
//
import dynamic from "next/dynamic";

const GameHome = dynamic( () => import( "@/components/GameHome" ), {
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export default function Home()
{
	return <GameHome />;
}