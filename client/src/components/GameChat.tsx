//
// Composant des communications textuelles entre les joueurs d'une partie.
//
import { SocketContext } from "../utils/SocketContext";
import { useState, useEffect, useContext } from "react";

import "./GameChat.scss";

export default function GameChat(): JSX.Element
{
	// Déclaration des variables d'état.
	const [ input, setInput ] = useState( "" );
	const [ messages, addMessage ] = useState<JSX.Element[]>( [] );

	// Création des constantes.
	const socket = useContext( SocketContext );

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
		// On accroche un écouteur pour récupérer les messages du serveur.
		socket.on( "GameChat", ( name, message ) =>
		{
			// Lors de chaque nouveau message, on l'ajoute en mémoire.
			addMessage( elements => [ ...elements, <li key={elements.length}>{name + " : " + message}</li> ] );
		} );
	}, [ socket ] );

	// Affichage du rendu HTML du composant.
	return (
		<section id="GameChat">
			{/* Liste des messages */}
			<ul>{messages}</ul>

			{/* Champ de saisie */}
			<form onSubmit={handleFormSubmit}>
				<input type="text" onChange={handleInputChange} value={input} />
				<button type="submit">Envoyer</button>
			</form>
		</section>
	);
}