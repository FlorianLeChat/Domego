//
// Route vers la page de test de la base de données.
//
import dynamic from "next/dynamic";

const TestApi = dynamic( () => import( "@/components/TestApi" ), {
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export default function Database()
{
	return <TestApi />;
}