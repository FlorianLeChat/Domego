//
// Composant pour indiquer à l'utilisateur que la page n'existe pas.
//
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../i18n/config";
import "./NotFound.scss";

export default function NotFound(): JSX.Element
{
	// Déclaration des constantes.
	const { t } = useTranslation();

	// Affichage du rendu HTML du composant.
	return (
		<section className="NotFound">
			{/* Titre de la page */}
			<h1>{t( "pages.notfound.title" )}</h1>

			{/* Sous-titre de la page */}
			<h2>{t( "pages.notfound.description" )}</h2>

			{/* Redirection vers la page principale */}
			<Link to="./">{t( "pages.notfound.link" )}</Link>
		</section>
	);
}