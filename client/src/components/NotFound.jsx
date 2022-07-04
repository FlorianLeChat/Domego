//
// Classe pour indiquer à l'utilisateur que la page n'existe pas.
//
import { Link } from "react-router-dom";
import { Component } from "react";

import "./NotFound.scss";

export default class NotFound extends Component
{
	render()
	{
		return (
			<section className="NotFound">
				<h1>404</h1>

				<h2>Page introuvable</h2>

				<Link to="/">Cliquez ici pour revenir en lieu sûr</Link>
			</section>
		);
	}
}