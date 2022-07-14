//
// Composant pour simuler un chat en réseau via les sockets.
//
import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";

import "./LiveChat.scss";

export default function LiveChat()
{
	// Déclaration des variables d'état.
	const [ input, setInput ] = useState( "" );
	const [ socket, setSocket ] = useState<Socket>();
	const [ messages, addMessage ] = useState<JSX.Element[]>( [] );

	// Récupération de la valeur du champ de saisie.
	const handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		setInput( event.target.value );
	};

	// Envoi des nouveaux messages au serveur via les sockets.
	const handleFormSubmit = ( event: React.FormEvent<HTMLFormElement> ) =>
	{
		// On cesse d'abord le comportement par défaut du formulaire.
		event.preventDefault();

		// On vérifie alors que l'utilisateur est connecté à un socket.
		if ( socket?.connected )
		{
			// L'utilisateur est connecté, on envoie le message au serveur.
			socket.emit( "chat message", input );
		}
		else
		{
			// Dans le cas, on affiche un message d'erreur.
			console.log( "Vous n'êtes pas connecté au chat." );
		}

		// On vide enfin le champ de saisie.
		setInput( "" );
	};

	// Création du socket au montage du composant.
	useEffect( () =>
	{
		setSocket( io( { path: process.env.PUBLIC_URL + "/socket.io" } ) );
	}, [] );

	// Gestion de la connexion du socket.
	// Note : cet effet se déclenche uniquement lorsque le socket est créé.
	useEffect( () =>
	{
		// On accroche un écouteur pour récupérer les messages du serveur.
		socket?.on( "chat message", ( message ) =>
		{
			// Lors de chaque nouveau message, on l'ajoute en mémoire.
			addMessage( elements => [ ...elements, <li key={elements.length}>{message}</li> ] );
		} );

		return () =>
		{
			// On déconnecte le socket au démontage du composant.
			socket?.disconnect();
		};
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