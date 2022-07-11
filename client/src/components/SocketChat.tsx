//
// Composant pour simuler un chat en réseau via les sockets.
//
import io from "socket.io-client";
import { useEffect, useState } from "react";

import "./SocketChat.scss";

export default function SocketChat()
{
	const socket = io();
	const [ inputValue, setInputValue ] = useState( "" );

	const handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		setInputValue( event.target.value );
	}

	const handleFormSubmit = ( event: React.FormEvent<HTMLFormElement> ) =>
	{
		event.preventDefault();

		socket.emit( "chat message", inputValue );

		setInputValue( "" );
	}

	useEffect( () =>
	{
		socket.on( "chat message", ( message: string ) =>
		{
			console.log( message );
		} );
	} )

	// Affichage du rendu HTML du composant.
	return (
		<section className="SocketChat">
			<h1>Test des sockets réseau</h1>

			<ul></ul>

			<form onSubmit={handleFormSubmit}>
				<input type="text" onChange={handleInputChange} value={inputValue} />
				<button type="submit">Envoyer</button>
			</form>
		</section>
	);
}