//
// Classe pour indiquer à l'utilisateur que la page n'existe pas.
//
import { Link } from "react-router-dom";
import "./NotFound.scss";

export default function NotFound()
{
	return (
		<section className="NotFound">
			<h1>Erreur 404</h1>

			<h2>Page introuvable</h2>

			<Link to="./">Cliquez ici pour revenir en lieu sûr</Link>
		</section>
	);
}