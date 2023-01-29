//
// Route utilisé lorsqu'une erreur interne est survenue (erreur HTTP 500).
//
import Link from "next/link";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "@/styles/NotFound.module.scss";
import i18nextConfig from "@/next-i18next.config";

export const getStaticProps: GetStaticProps = async ( { locale } ) =>
{
	// Récupération des traductions côté serveur.
	return {
		props: {
			...( await serverSideTranslations( locale ?? i18nextConfig.i18n.defaultLocale ) )
		},
	};
};

export default function HTTP500()
{
	// Déclaration des constantes.
	const { t } = useTranslation();

	// Affichage du rendu HTML du composant.
	return (
		<section id={styles[ "NotFound" ]}>
			{/* Titre de la page */}
			<h1>{t( "pages.internalerror.title" )}</h1>

			{/* Sous-titre de la page */}
			<h2>{t( "pages.internalerror.description" )}</h2>

			{/* Redirection vers la page principale */}
			<Link href="/">{t( "pages.notfound.link" )}</Link>
		</section>
	);
}
