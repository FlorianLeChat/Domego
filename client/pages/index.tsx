//
// Route vers la page d'accueil du jeu.
//
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import i18nextConfig from "@/next-i18next.config";

const GameHome = dynamic( () => import( "@/components/GameHome" ), {
	// Chargement dynamique du composant.
	loading: () => <span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>,
} );

export const getStaticProps: GetStaticProps = async ( { locale } ) =>
{
	// Récupération des traductions côté serveur.
	return {
		props: {
			...( await serverSideTranslations( locale ?? i18nextConfig.i18n.defaultLocale ) )
		},
	};
};

export default function Home()
{
	// Génération du composant.
	return <GameHome />;
}