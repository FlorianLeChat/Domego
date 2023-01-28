//
// Route utilisé lorsqu'une erreur interne est survenue (erreur HTTP 500).
//
import dynamic from "next/dynamic";

const InternalError = dynamic( () => import( "@/components/InternalError" ), {
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export default function HTTP505()
{
	return <InternalError />;
}
