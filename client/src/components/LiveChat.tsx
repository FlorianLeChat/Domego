//
// Composant pour simuler un chat en réseau via les sockets.
//
import { SocketContext } from "../utils/SocketContext";
import { useState, useEffect, useContext } from "react";

import "./LiveChat.scss";

export default function LiveChat(): JSX.Element
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

		// On vérifie alors que l'utilisateur est connecté à un socket.
		if ( socket.connected )
		{
			// L'utilisateur est connecté, on envoie le message au serveur.
			socket.emit( "GameChat", input );
		}
		else
		{
			// Dans le cas, on affiche un message d'erreur.
			console.log( "Vous n'êtes pas connecté au chat." );
		}

		// On vide enfin le champ de saisie.
		setInput( "" );
	};

	// Récupération des nouveaux messages.
	useEffect( () =>
	{
		// On accroche un écouteur pour récupérer les messages du serveur.
		socket.on( "GameChat", ( message ) =>
		{
			// Lors de chaque nouveau message, on l'ajoute en mémoire.
			addMessage( elements => [ ...elements, <li key={elements.length}>{message}</li> ] );
		} );
	}, [ socket ] );

	// Affichage du rendu HTML du composant.
	return (
		<section className="LiveChat">
			{/* Titre de la page */}
			<h1>Test des sockets réseau</h1>

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