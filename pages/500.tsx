//
// Route vers la page des erreurs internes (erreur HTTP 500).
//
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "./500.module.scss";

export async function getStaticProps( { locale }: { locale: string } )
{
	// Récupération des traductions côté serveur.
	return {
		props: {
			...( await serverSideTranslations( locale ) )
		}
	};
}

export default function HTTP500()
{
	// Déclaration des constantes.
	const { t } = useTranslation();

	// Affichage du rendu HTML de la page.
	return (
		<section id={styles.InternalError}>
			{/* Titre de la page */}
			<h1>{t( "pages.internalerror.title" )}</h1>

			{/* Sous-titre de la page */}
			<h2>{t( "pages.internalerror.description" )}</h2>

			{/* Redirection vers la page principale */}
			<Link href="/">{t( "pages.notfound.link" )}</Link>
		</section>
	);
}