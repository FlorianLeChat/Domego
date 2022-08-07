//
// Composant pour sélectionner un rôle avant de lancer la partie.
//
import { useParams } from "react-router-dom";
import { SocketContext } from "../utils/SocketContext";
import { useTranslation } from "react-i18next";
import { useEffect, useContext } from "react";

import RoleCard from "../components/RoleCard";
import "./RoleSelection.scss";

export default function RoleSelection(): JSX.Element
{
	// Récupération des paramètres.
	const { roomId } = useParams();

	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );

	// Estimation de la latence entre le client et le serveur.
	useEffect( () =>
	{
		console.log( roomId, socket );
		// On met tout d'abord la date du moment actuelle.
		// const start = Date.now();

		// socket.emit( "GamePing", () =>
		// {
		// 	// Lo
		// 	const delta = Date.now() - start;

		// 	if ( delta > 500 )
		// 	{
		// 		Swal.fire( {
		// 			icon: "warning",
		// 			title: "Latence élevée",
		// 			text: `La latence entre vous et le serveur semble élevé (${ delta } ms). Certaines de vos actions pourraient subir un délai conséquent.`,
		// 			confirmButtonText: "Je comprends l'avertissement",
		// 			confirmButtonColor: "#28a745"
		// 		} );
		// 	}
		// } );
	}, [] );

	// Affichage du rendu HTML du composant.
	return (
		<section id="RoleSelection">
			{/* Titre de la page */}
			<h1>{t( "pages.selection.title" )}</h1>

			<div>
				{/* Conteneur de la liste des rôles */}
				<RoleCard name="project_owner" />
				<RoleCard name="project_manager" />
				<RoleCard name="engineering_office" />
				<RoleCard name="control_office" />
				<RoleCard name="secondary_state" />
				<RoleCard name="general_construction" />
			</div>

			{/* Bouton de lancement de la partie */}
			<button type="button">{t( "pages.selection.launch" )}</button>
		</section>
	);
}