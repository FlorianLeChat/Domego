//
// Route utilisé lorsqu'une page n'est pas trouvée (erreur HTTP 404).
//
import dynamic from "next/dynamic";

const NotFound = dynamic( () => import( "@/components/NotFound" ), {
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export default function HTTP404()
{
	return <NotFound />;
}
