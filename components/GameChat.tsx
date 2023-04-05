//
// Composant des communications textuelles entre les joueurs d'une partie.
//
import { useTranslation } from "next-i18next";
import { useState, useRef, useEffect, useContext, ChangeEvent, FormEvent } from "react";

import styles from "./GameChat.module.scss";
import { SocketContext } from "@/utils/SocketContext";

interface GameChatProps
{
	// Déclaration des champs des propriétés du composant.
	show?: boolean;
}

export default function GameChat( props: GameChatProps )
{
	// Déclaration des constantes.
	const list = useRef<HTMLUListElement>( null );
	const { t } = useTranslation();
	const socket = useContext( SocketContext );

	// Déclaration des variables d'état.
	const [ input, setInput ] = useState( "" );
	const [ messages, addMessage ] = useState<JSX.Element[]>( [ <i key={0}>{t( "pages.index.chat_welcome" )}</i> ] );

	// Récupération du message saisi par l'utilisateur.
	const handleInputChange = ( event: ChangeEvent<HTMLInputElement> ) =>
	{
		setInput( event.target.value );
	};

	// Envoi des nouveaux messages au serveur.
	const handleFormSubmit = ( event: FormEvent<HTMLFormElement> ) =>
	{
		// On cesse d'abord le comportement par défaut du formulaire.
		event.preventDefault();

		// On envoie ensuite le message au serveur.
		if ( socket?.connected )
		{
			socket.emit( "GameChat", input );
		}

		// On vide enfin le champ de saisie.
		setInput( "" );
	};

	// Récupération des nouveaux messages.
	useEffect( () =>
	{
		// On vérifie d'abord que la connexion aux sockets est établie.
		if ( !socket?.connected )
		{
			return;
		}

		// On accroche ensuite un premier écouteur pour récupérer les messages
		socket.on( "GameChat", ( name, message ) =>
		//  des autres joueurs depuis le serveur.
		{
			addMessage( elements => [ ...elements, <li key={elements.length}>{`[${ new Date().toLocaleTimeString() }] ${ name } : ${ message }`}</li> ] );
		} );

		// On accroche enfin un deuxième écouteur pour récupérer les notifications
		socket.on( "GameAlert", ( name, message ) =>
		//  de connexion et de déconnexion des autres joueurs.
		{
			addMessage( elements => [ ...elements, <i key={elements.length}>{t( message, { username: name } )}</i> ] );
		} );
	}, [ t, socket ] );

	// Retour automatique aux messages les plus récents.
	useEffect( () =>
	{
		const last = list.current?.lastChild as Element;

		if ( last )
		{
			// Le dernier élément peut être invalide si le composant
			//  parent est actuellement caché ou en cours de démontage.
			last.scrollIntoView( { behavior: "smooth", block: "end", inline: "nearest" } );
		}
	}, [ messages ] );

	// Affichage conditionnel du rendu HTML du composant.
	if ( props.show )
	{
		// Le rendu est demandé par un composant parent ou par l'utilisateur.
		//  Note : c'est principalement le cas dans la page dédiée aux communications
		//   textuelles entre les joueurs de la partie.
		return (
			<section id={styles.GameChat}>
				{/* Liste des messages */}
				<ul ref={list}>{messages}</ul>

				{/* Champ de saisie */}
				<form onSubmit={handleFormSubmit}>
					<input type="text" placeholder="Lorem ipsum dolor sit amet..." onChange={handleInputChange} value={input} />
					<button type="submit">{t( "pages.index.send_chat_message" )}</button>
				</form>
			</section>
		);
	}

	// Le rendu est caché par un composant parent.
	//  Note : c'est uniquement le cas lorsqu'on veut cacher le chat dans
	//   la page de sélection des rôles.
	return null;
}