//
// Classe pour simuler un chat en réseau via les sockets.
//
import io from "socket.io-client";
import { Component } from "react";

import "./SocketChat.scss";

export default class SocketChat extends Component
{
	constructor( props )
	{
		// Création des variables du constructeur.
		super( props );

		// this.state.inputValue = "";
	}

	handleSubmit( event )
	{
		const socket = io();

		event.preventDefault();

		socket.emit( "chat message", this.state.inputValue );

		this.state.setState( {
			inputValue: ""
		} );
	}

	handleChange( event )
	{
		this.setState( {
			inputValue: event.target.value
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