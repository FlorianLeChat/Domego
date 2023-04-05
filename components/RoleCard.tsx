//
// Composant d'affichage pour la carte d'un rôle.
//
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState, useContext, useEffect, ChangeEvent } from "react";

import styles from "./RoleCard.module.scss";
import { UserType } from "@/enums/User";
import { SocketContext } from "@/utils/SocketContext";

interface RoleCardProps
{
	// Déclaration des champs des propriétés du composant.
	name: string;
	budget: string;
}

export default function RoleCard( { name, budget }: RoleCardProps )
{
	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const { query, basePath } = useRouter();

	// Déclaration des variables d'état.
	const [ ready, setReady ] = useState( false );
	const [ target, setTarget ] = useState( "" );
	const [ selected, setSelected ] = useState( false );

	// Bouton de sélection d'un rôle.
	const selectRole = () =>
	{
		// On détermine d'abord si le bouton est coché ou non.
		const state = !selected;

		// On envoie enfin une requête au serveur pour déterminer s'il est
		//  possible de sélectionner le rôle.
		socket?.emit( "GameRole", name, "select", state, ( available: boolean, player: string ) =>
		{
			// Si le serveur renvoie une réponse positive, on s'assigne localement
			//  le rôle sélectionné.
			if ( available && state )
			{
				setTarget( player );
				setSelected( true );
			}
			else
			{
				// Dans le cas contraire, soit le rôle est déjà occupé ou soit
				//  on a voulu désélectionner le rôle.
				setReady( false );
				setTarget( "" );
				setSelected( false );
			}
		} );
	};

	// Bouton de confirmation de sélection d'un rôle.
	const readyToPlay = ( event: ChangeEvent<HTMLInputElement> ) =>
	{
		// On envoie une simple requête d'usage au serveur pour signaler
		//  que le joueur est prêt à jouer sans autre vérification.
		const state = event.currentTarget.checked;

		socket?.emit( "GameRole", name, "ready", state );

		setReady( state );
	};

	// Réception des mises à jour de sélection des rôles.
	useEffect( () =>
	{
		// On émet d'abord une requête au serveur pour vérifier
		//  si le rôle est déjà sélectionné ou non.
		socket?.emit( "GameRole", name, "check", true, ( available: boolean, player: string ) =>
		{
			// Si le rôle est déjà sélectionné, on l'assigne localement
			//  le rôle avec les informations reçues depuis le serveur.
			if ( !available )
			{
				setReady( true );
				setTarget( player );
				setSelected( true );
			}
		} );

		// On accroche alors un écouteur pour réceptionner les mises à jour
		//  des sélections des rôles.
		socket?.on( "GameRole", ( role: string, state: boolean, player: string ) =>
		{
			// Si la mise à jour correspond au rôle actuelle, alors on l'assigne
			//  enfin localement avec les informations reçues depuis le serveur.
			if ( name === role )
			{
				setReady( state );
				setTarget( player );
				setSelected( state );
			}
		} );
	}, [ socket, name ] );

	// Affichage du rendu HTML du composant.
	return (
		<article className={styles.RoleCard}>
			{/* Image représentative du rôle */}
			<Image src={`${ basePath }/assets/images/jobs/${ name }.webp`} alt={t( `pages.selection.${ name }_title` )} width={225} height={225} />

			{/* Utilisateur jouant ce rôle */}
			<span>{target}</span>

			<div>
				{/* Nom du rôle */}
				<h2>{t( `pages.selection.${ name }_title` )}</h2>

				{/* Description du rôle */}
				<p>{t( `pages.selection.${ name }_description` )}</p>

				{/* Budget à disposition */}
				<span>{budget}</span>
			</div>

			{/* Bouton de sélection du rôle */}
			<div>
				<input id="select" type="checkbox" onChange={selectRole} checked={selected} disabled={query.type === UserType.SPECTATOR || ready} />
				<label htmlFor="select">{t( "pages.selection.check" )}</label>
			</div>

			{/* Bouton de prêt à jouer */}
			{/* (disponible seulement si le rôle est sélectionné par l'utilisateur) */}
			{target === query.username && (
				<div>
					<input id="ready" type="checkbox" onChange={readyToPlay} />
					<label htmlFor="ready">{t( "pages.selection.ready" )}</label>
				</div>
			)}
		</article>
	);
}