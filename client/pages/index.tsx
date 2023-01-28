//
// Route vers la page d'accueil du jeu.
//
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps( { locale } )
{
	return {
		props: {
			...( await serverSideTranslations( locale ) )
		},
	};
}

const GameHome = dynamic( () => import( "@/components/GameHome" ), {
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export default function Home()
{
	return <GameHome />;
}