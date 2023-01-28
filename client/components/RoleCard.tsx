//
// Composant d'affichage pour la carte d'un rôle.
//
import Image from "next/image";
import { useLocation } from "next/link";
import { SocketContext } from "@/utils/SocketContext";
import { LocationState } from "@/types/LocationState";
import { useTranslation } from "react-i18next";
import { useState, useContext, useEffect } from "react";

import styles from "@/styles/RoleCard.module.scss";

interface RoleCardProps
{
	// Déclaration des champs des propriétés du composant.
	name: string;
	budget: string;
}

export default function RoleCard( props: RoleCardProps ): JSX.Element
{
	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const location = useLocation().state as LocationState;

	// Déclaration des variables d'état.
	const [ ready, setReady ] = useState( false );
	const [ player, setPlayer ] = useState( "" );

	// Bouton de sélection d'un rôle.
	const selectRole = ( event: React.MouseEvent<HTMLInputElement> ) =>
	{
		// On détermine si le bouton est coché ou non.
		const state = event.currentTarget.checked;

		// On envoie une requête au serveur pour déterminer s'il est possible
		//	de sélectionner le rôle.
		socket.emit( "GameRole", props.name, "select", state, ( available: boolean, player: string ) =>
		{
			// Si le serveur renvoie une réponse positive, on s'assigne localement
			//	le rôle sélectionné.
			if ( available && state )
			{
				setPlayer( player );
			}
			else
			{
				// Dans le cas contraire, soit le rôle est déjà occupé ou soit
				//	on a voulu désélectionner le rôle.
				setReady( false );
				setPlayer( "" );
			}
		} );
	};

	// Bouton de confirmation de sélection d'un rôle.
	const readyToPlay = ( event: React.MouseEvent<HTMLInputElement> ) =>
	{
		// On envoie une simple requête d'usage au serveur pour signaler
		//	que le joueur est prêt à jouer sans autre vérification.
		const state = event.currentTarget.checked;

		socket.emit( "GameRole", props.name, "ready", state );

		setReady( state );
	};

	// Réception des mises à jour de sélection des rôles.
	useEffect( () =>
	{
		// On émet d'abord une requête au serveur pour vérifier
		//	si le rôle est déjà sélectionné ou non.
		socket.emit( "GameRole", props.name, "check", true, ( available: boolean, player: string ) =>
		{
			// Si le rôle est déjà sélectionné, on l'assigne localement
			//	le rôle avec les informations reçues depuis le serveur.
			if ( !available )
			{
				setReady( true );
				setPlayer( player );
			}
		} );

		// On accroche ensuite un écouteur pour réceptionner les mises à jour
		//	des sélections des rôles.
		socket.on( "GameRole", ( role: string, state: boolean, player: string ) =>
		{
			// Si la mise à jour correspond au rôle actuelle, alors on l'assigne
			//	localement avec les informations reçues depuis le serveur.
			if ( props.name === role )
			{
				setReady( state );
				setPlayer( player );
			}
		} );
	}, [ props.name, socket ] );

	// Affichage du rendu HTML du composant.
	return (
		<article className={styles[ "RoleCard" ]}>
			{/* Image représentative du rôle */}
			<Image src={`${ process.env[ "PUBLIC_URL" ] }/assets/images/jobs/${ props.name }.webp`} alt={t( `pages.selection.${ props.name }_title` )} />

			{/* Utilisateur jouant ce rôle */}
			<span>{player}</span>

			<div>
				{/* Nom du rôle */}
				<h2>{t( `pages.selection.${ props.name }_title` )}</h2>

				{/* Description du rôle */}
				<p>{t( `pages.selection.${ props.name }_description` )}</p>

				{/* Budget à disposition */}
				<span>{props.budget}</span>
			</div>

			{/* Bouton de sélection du rôle */}
			<div>
				<input type="checkbox" onClick={selectRole} disabled={location.type === "spectator" || ready} />
				<label>{t( "pages.selection.check" )}</label>
			</div>

			{/* Bouton de prêt à jouer */}
			{/* (disponible seulement si le rôle est sélectionné par l'utilisateur) */}
			{player === location.username &&
				<div>
					<input type="checkbox" onClick={readyToPlay} />
					<label>{t( "pages.selection.ready" )}</label>
				</div>
			}
		</article>
	);
}