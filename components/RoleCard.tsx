//
// Composant d'affichage pour la carte d'un rôle.
//
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState, useContext, useEffect } from "react";

import styles from "./RoleCard.module.scss";
import { UserType } from "@/enums/User";
import { SocketContext } from "@/utils/SocketContext";

interface RoleCardProps
{
	// Déclaration des champs des propriétés du composant.
	name: string;
	budget: string;
}

export default function RoleCard( props: RoleCardProps )
{
	// Déclaration des constantes.
	// @ts-ignore
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const { query } = useRouter();

	// Déclaration des variables d'état.
	const [ ready, setReady ] = useState( false );
	const [ player, setPlayer ] = useState( "" );
	const [ selected, setSelected ] = useState( false );

	// Bouton de sélection d'un rôle.
	const selectRole = () =>
	{
		// On vérifie d'abord que la connexion aux sockets est établie.
		if ( !socket?.connected )
		{
			return;
		}

		// On détermine ensuite si le bouton est coché ou non.
		const state = !selected;

		// On envoie enfin une requête au serveur pour déterminer s'il est
		//	possible de sélectionner le rôle.
		socket.emit( "GameRole", props.name, "select", state, ( available: boolean, player: string ) =>
		{
			// Si le serveur renvoie une réponse positive, on s'assigne localement
			//	le rôle sélectionné.
			if ( available && state )
			{
				setPlayer( player );
				setSelected( true );
			}
			else
			{
				// Dans le cas contraire, soit le rôle est déjà occupé ou soit
				//	on a voulu désélectionner le rôle.
				setReady( false );
				setPlayer( "" );
				setSelected( false );
			}
		} );
	};

	// Bouton de confirmation de sélection d'un rôle.
	const readyToPlay = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		// On envoie une simple requête d'usage au serveur pour signaler
		//	que le joueur est prêt à jouer sans autre vérification.
		const state = event.currentTarget.checked;

		if ( socket?.connected )
		{
			socket.emit( "GameRole", props.name, "ready", state );
		}

		setReady( state );
	};

	// Réception des mises à jour de sélection des rôles.
	useEffect( () =>
	{
		// On vérifie d'abord que la connexion aux sockets est établie.
		if ( !socket?.connected )
		{
			return;
		}

		// On émet ensuite une requête au serveur pour vérifier
		//	si le rôle est déjà sélectionné ou non.
		socket.emit( "GameRole", props.name, "check", true, ( available: boolean, player: string ) =>
		{
			// Si le rôle est déjà sélectionné, on l'assigne localement
			//	le rôle avec les informations reçues depuis le serveur.
			if ( !available )
			{
				setReady( true );
				setPlayer( player );
				setSelected( true );
			}
		} );

		// On accroche alors un écouteur pour réceptionner les mises à jour
		//	des sélections des rôles.
		socket.on( "GameRole", ( role: string, state: boolean, player: string ) =>
		{
			// Si la mise à jour correspond au rôle actuelle, alors on l'assigne
			//	enfin localement avec les informations reçues depuis le serveur.
			if ( props.name === role )
			{
				setReady( state );
				setPlayer( player );
				setSelected( state );
			}
		} );
	}, [ props.name, socket ] );

	// Affichage du rendu HTML du composant.
	return (
		<article className={styles[ "RoleCard" ]}>
			{/* Image représentative du rôle */}
			<Image src={`/assets/images/jobs/${ props.name }.webp`} alt={t( `pages.selection.${ props.name }_title` )} width={225} height={225} />

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
				<input type="checkbox" onChange={selectRole} checked={selected} disabled={query[ "type" ] === UserType.SPECTATOR || ready} />
				<label>{t( "pages.selection.check" )}</label>
			</div>

			{/* Bouton de prêt à jouer */}
			{/* (disponible seulement si le rôle est sélectionné par l'utilisateur) */}
			{player === query[ "username" ] &&
				<div>
					<input type="checkbox" onChange={readyToPlay} />
					<label>{t( "pages.selection.ready" )}</label>
				</div>
			}
		</article>
	);
}