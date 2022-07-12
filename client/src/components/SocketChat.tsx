//
// Composant pour simuler un chat en réseau via les sockets.
//
import { Component } from "react";
import { io, Socket } from "socket.io-client";

import "./SocketChat.scss";

interface ChatState
{
	// Déclaration des variables de l'interface.
	input: string;
	socket?: Socket;
	messages: string[];
}

export default class SocketChat extends Component<{}, ChatState>
{
	constructor( props: ChatState )
	{
		// Initialisation des variables du constructeur.
		super( props );

		this.state = {
			input: "",
			messages: []
		};
	}

	handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		// On récupère la valeur du champ de saisie.
		this.setState( {
			input: event.target.value
		} );
	};

	handleFormSubmit = ( event: React.FormEvent<HTMLFormElement> ) =>
	{
		// On cesse d'abord le comportement par défaut du formulaire.
		event.preventDefault();

		// On vérifie que l'utilisateur est connecté à un socket.
		if ( this.state.socket?.connected )
		{
			// L'utilisateur est connecté, on envoie le message au serveur.
			this.state.socket?.emit( "chat message", this.state.input );
		}
		else
		{
			// Dans le cas, on affiche un message d'erreur.
			console.log( "Vous n'êtes pas connecté au chat." );
		}

		// On vide enfin le champ de saisie.
		this.setState(
			{ input: "" }
		);
	};

	componentDidMount = () =>
	{
		// On crée un socket au montage du composant.
		this.setState( { socket: io() }, () =>
		{
			// Une fois le socket créé, on écoute les messages du serveur.
			this.state.socket?.on( "chat message", ( message: string ) =>
			{
				// Lors de chaque nouveau message, on ajoute le message en mémoire.
				this.setState( ( state ) => ( {
					messages: [ ...state.messages, message ]
				} ) );

				console.log( message );
			} );
		} );
	};

	componentWillUnmount = () =>
	{
		// On déconnecte le socket au démontage du composant.
		this.state.socket?.disconnect();
	};

	render()
	{
		// On génère le rendu HTML du composant.
		const messages: JSX.Element[] = [];

		this.state.messages.forEach( ( element ) =>
		{
			messages.push( <li>{element}</li> );
		} )

		// On retourne le rendu HTML du composant.
		return (
			<section className="SocketChat">
				{/* Titre de la page */}
				<h1>Test des sockets réseau</h1>

				{/* Liste des messages */}
				<ul>{messages}</ul>

				{/* Champ de saisie */}
				<form onSubmit={this.handleFormSubmit}>
					<input type="text" onChange={this.handleInputChange} value={this.state.input} />
					<button type="submit">Envoyer</button>
				</form>
			</section>
		);
	}
}