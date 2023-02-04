//
// Route utilisée lorsqu'une page n'est pas trouvée (erreur HTTP 404).
//
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "@/styles/NotFound.module.scss";
import i18nextConfig from "@/next-i18next.config";

export async function getStaticProps( { locale }: { locale: string; } )
{
	// Récupération des traductions côté serveur.
	return {
		props: {
			...( await serverSideTranslations( locale ?? i18nextConfig.i18n.defaultLocale ) )
		},
	};
}

export default function HTTP404()
{
	// Déclaration des constantes.
	// @ts-ignore
	const { t } = useTranslation();

	// Affichage du rendu HTML du composant.
	return (
		<section id={styles[ "NotFound" ]}>
			{/* Titre de la page */}
			<h1>{t( "pages.notfound.title" )}</h1>

			{/* Sous-titre de la page */}
			<h2>{t( "pages.notfound.description" )}</h2>

			{/* Redirection vers la page principale */}
			<Link href="/">{t( "pages.notfound.link" )}</Link>
		</section>
	);
}
