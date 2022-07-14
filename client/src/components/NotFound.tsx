//
// Composant pour indiquer à l'utilisateur que la page n'existe pas.
//
import { Link } from "react-router-dom";
import "./NotFound.scss";

export default function NotFound()
{
	// Affichage du rendu HTML du composant.
	return (
		<section className="NotFound">
			{/* Titre de la page */}
			<h1>Erreur 404</h1>

			{/* Sous-titre de la page */}
			<h2>Page introuvable</h2>

			{/* Redirection vers la page principale */}
			<Link to="./">Cliquez ici pour revenir en lieu sûr</Link>
		</section>
	);
}