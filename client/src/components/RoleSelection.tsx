//
// Composant pour sélectionner un rôle avant de lancer la partie.
//
import { useLocation } from "react-router-dom";
import { SocketContext } from "../utils/SocketContext";
import { useTranslation } from "react-i18next";
import { useState, useContext, useEffect, lazy, Suspense } from "react";

import NotFound from "../components/NotFound";
import "./RoleSelection.scss";

const RoleCard = lazy( () => import( "../components/RoleCard" ) );

interface RoleSelectionPlayers
{
	// Déclaration des champs des propriétés du rôle des joueurs.
	owner?: string;
	artisan?: string;
	manager?: string;
	builder?: string;
	engineer?: string;
	inspector?: string;
}

export default function RoleSelection(): JSX.Element
{
	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const location = useLocation();

	// Déclaration des variables d'état.
	const [ players ] = useState<RoleSelectionPlayers>();

	// Estimation de la latence entre le client et le serveur.
	useEffect( () =>
	{
		console.log( location.state, socket );
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

	// Vérification de la connexion à la partie.
	if ( location.state === null )
	{
		return <NotFound />;
	}

	// Affichage du rendu HTML du composant.
	return (
		<section id="RoleSelection">
			{/* Titre de la page */}
			<h1>{t( "pages.selection.title" )}</h1>

			<div>
				{/* Liste des rôles */}
				<Suspense fallback={<div className="loading"></div>}>
					<RoleCard name="project_owner" player={players?.owner} budget="150K" />
					<RoleCard name="project_manager" player={players?.manager} budget="30K" />
					<RoleCard name="engineering_office" player={players?.engineer} budget="20K" />
					<RoleCard name="control_office" player={players?.inspector} budget="20K" />
					<RoleCard name="secondary_state" player={players?.artisan} budget="30K" />
					<RoleCard name="general_construction" player={players?.builder} budget="30K" />
				</Suspense>
			</div>

			{/* Bouton de lancement de la partie */}
			<button type="button">{t( "pages.selection.launch" )}</button>
		</section>
	);
}