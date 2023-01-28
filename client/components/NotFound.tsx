//
// Composant d'affichage lorsqu'une page du routeur n'est pas trouvée.
//
import { Link } from "next/link";
import { useTranslation } from "next-i18next";

import styles from "@/styles/NotFound.module.scss";

export default function NotFound()
{
	// Déclaration des constantes.
	const { t } = useTranslation();

	// Affichage du rendu HTML du composant.
	return (
		<section id={styles[ "NotFound" ]}>
			{/* Titre de la page */}
			<h1>{t( "pages.notfound.title" )}</h1>

			{/* Sous-titre de la page */}
			<h2>{t( "pages.notfound.description" )}</h2>

			{/* Redirection vers la page principale */}
			<Link to="../">{t( "pages.notfound.link" )}</Link>
		</section>
	);
}