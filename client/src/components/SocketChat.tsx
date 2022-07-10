//
// Composant pour simuler un chat en réseau via les sockets.
//
import io from "socket.io-client";
import React from "react";

import "./SocketChat.scss";

interface ChatInput
{
	// Déclaration des variables de l'interface.
	value?: string;
}

export default class SocketChat extends React.Component<{}, ChatInput>
{
	constructor( props: ChatInput )
	{
		// Initialisation des variables du constructeur.
		super( props );

		this.state = {
			value: ""
		};
	}

	handleSubmit( event: React.FormEvent<HTMLFormElement> )
	{
		const socket = io();

		event.preventDefault();

		socket.emit( "chat message", this.state.value );

		this.setState( {
			value: ""
		} );
	}

	handleChange( event: React.ChangeEvent<HTMLInputElement> )
	{
		this.setState( {
			value: event.target.value
		} );
	}

	render()
	{
		// Affichage du rendu HTML du composant.
		return (
			<section className="SocketChat">
				<h1>Test des sockets réseau</h1>

				<ul></ul>

				<form onSubmit={this.handleSubmit}>
					<input type="text" onChange={this.handleChange} />
					<button type="submit">Envoyer</button>
				</form>
			</section>
		);
	}
}