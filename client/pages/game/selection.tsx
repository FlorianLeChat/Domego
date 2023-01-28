//
// Route vers la page de sélection du rôle pour le joueur.
//
import dynamic from "next/dynamic";

const RoleSelection = dynamic( () => import( "@/components/RoleSelection" ), {
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export default function Selection()
{
	return <RoleSelection />;
}