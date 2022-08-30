//
// Composant pour sélectionner un rôle avant de lancer la partie.
//
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../utils/SocketContext";
import { LocationState } from "../types/LocationState";
import { useTranslation } from "react-i18next";
import { useContext, useState, useEffect, lazy, Suspense } from "react";

import NotFound from "../components/NotFound";
import "./RoleSelection.scss";

const RoleCard = lazy( () => import( "../components/RoleCard" ) );

export default function RoleSelection(): JSX.Element
{
	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const location = useLocation().state as LocationState;

	// Déclaration des variables d'état.
	const [ disabled, setDisabled ] = useState( true );

	// Envoi et des réceptions des mises à jour depuis/vers le serveur.
	useEffect( () =>
	{
		// On vérifie d'abord la latence entre le client et le serveur
		//	distant en mettant en mémoire le temps actuel.
		const start = Date.now();

		socket.emit( "GamePing", () =>
		{
			// Lors de la réception de la requête par le serveur,
			//	on calcule la différence entre la temps actuel ainsi
			//	que le temps précédemment mis en mémoire.
			const delta = Date.now() - start;

			if ( delta > 500 )
			{
				// Si la différence est supérieure à 500ms,
				//	on affiche un avertissement à l'utilisateur.
				Swal.fire( {
					icon: "warning",
					text: t( "modals.network_latency_description", { latency: delta } ),
					title: t( "modals.network_latency_title" ),
					confirmButtonColor: "#28a745"
				} );
			}
		} );

		// On accroche enfin un dernier événement (seulement pour les administrateurs)
		//	afin de déterminer l'état du bouton de lancement de partie.
		socket.on( "GameReady", ( state: boolean ) =>
		{
			setDisabled( !state );
		} );
	}, [ t, navigate, socket, location ] );

	// Vérification de la connexion à la partie.
	if ( !socket.connected || location === null )
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
					<RoleCard name="project_owner" budget="150K" />
					<RoleCard name="project_manager" budget="30K" />
					<RoleCard name="engineering_office" budget="20K" />
					<RoleCard name="control_office" budget="20K" />
					<RoleCard name="secondary_state" budget="30K" />
					<RoleCard name="general_construction" budget="30K" />
				</Suspense>
			</div>

			{/* Bouton de lancement de la partie */}
			{/* (disponible seulement pour l'administrateur) */}
			{location.admin && <button type="button" onClick={startGame} disabled={disabled}>{t( "pages.selection.launch" )}</button>}
		</section>
	);
}