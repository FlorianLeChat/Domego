//
// Composant des communications textuelles entre les joueurs d'une partie.
//
import { useLocation } from "react-router-dom";
import { LocationState } from "../types/LocationState";
import { SocketContext } from "../utils/SocketContext";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useContext } from "react";

import NotFound from "../components/NotFound";
import "./GameChat.scss";

interface GameChatProps
{
	// Déclaration des champs des propriétés du composant.
	show?: boolean;
}

export default function GameChat( props: GameChatProps ): JSX.Element
{
	// Création des constantes.
	const list = useRef<HTMLUListElement>( null );
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const location = useLocation().state as LocationState;

	// Déclaration des variables d'état.
	const [ input, setInput ] = useState( "" );
	const [ messages, addMessage ] = useState<JSX.Element[]>( [ <i key={0}>{t( "pages.index.chat_welcome" )}</i> ] );

	// Récupération du message saisi par l'utilisateur.
	const handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		setInput( event.target.value );
	};

	// Envoi des nouveaux messages au serveur.
	const handleFormSubmit = ( event: React.FormEvent<HTMLFormElement> ) =>
	{
		// On cesse d'abord le comportement par défaut du formulaire.
		event.preventDefault();

		// On envoie ensuite le message au serveur.
		socket.emit( "GameChat", input );

		// On vide enfin le champ de saisie.
		setInput( "" );
	};

	// Récupération des nouveaux messages.
	useEffect( () =>
	{
		// On accroche un premier écouteur pour récupérer les messages
		//	des autres joueurs depuis le serveur.
		socket.on( "GameChat", ( name, message ) =>
		{
			addMessage( elements => [ ...elements, <li key={elements.length}>{`[${ new Date().toLocaleTimeString() }] ${ name } : ${ message }`}</li> ] );
		} );

		// On accroche un deuxième écouteur pour récupérer les notifications
		//	de connexion et de déconnexion des autres joueurs.
		socket.on( "GameAlert", ( name, message ) =>
		{
			addMessage( elements => [ ...elements, <i key={elements.length}>{t( message, { username: name } )}</i> ] );
		} );
	}, [ t, socket ] );

	// Retour automatique aux messages les plus récents.
	useEffect( () =>
	{
		const last = list.current?.lastChild as Element;
		last.scrollIntoView( { behavior: "smooth", block: "end", inline: "nearest" } );
	}, [ messages ] );

	// Vérification de l'autorisation d'accès au composant.
	if ( !socket.connected || location === null || location.type === "spectator" )
	{
		return <NotFound />;
	}

	// Affichage conditionnel du rendu HTML du composant.
	if ( props.show )
	{
		// Le rendu est demandé par un composant parent ou par l'utilisateur.
		// 	Note : c'est principalement le cas dans la page dédiée aux communications
		//		textuelles entre les joueurs de la partie.
		return (
			<section id="GameChat">
				{/* Liste des messages */}
				<ul ref={list}>{messages}</ul>

				{/* Champ de saisie */}
				<form onSubmit={handleFormSubmit}>
					<input type="text" placeholder="Lorem ipsum dolor sit amet..." onChange={handleInputChange} value={input} />
					<button type="submit">Envoyer</button>
				</form>
			</section>
		);
	}
	else
	{
		// Le rendu est caché par un composant parent.
		// 	Note : c'est uniquement le cas lorsqu'on veut cacher le chat dans
		//		 la page de sélection des rôles.
		return ( <></> );
	}
}