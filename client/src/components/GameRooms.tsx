//
// Composant pour afficher un tableau de l'ensemble des parties en cours.
//
import { io, Socket } from "socket.io-client";
import { useState, useEffect, HTMLProps } from "react";

import "./GameRooms.scss";

export default function GameRooms( props: HTMLProps<HTMLTableElement> )
{
	// Déclaration des variables d'état.
	const [ socket, setSocket ] = useState<Socket>();

	// Création du socket au montage du composant.
	useEffect( () =>
	{
		setSocket( io( { path: process.env.PUBLIC_URL + "/socket.io" } ) );
	}, [] );

	// Gestion de la connexion du socket.
	// Note : cet effet se déclenche uniquement lorsque le socket est créé.
	useEffect( () =>
	{
		//
		const start = Date.now();

		socket?.emit( "ping", () =>
		{
			console.log( "Temps de réponse : %d ms", Date.now() - start );
		} );

		return () =>
		{
			// On déconnecte le socket au démontage du composant.
			socket?.disconnect();
		};
	} );

	// Affichage du rendu HTML du composant.
	return (
		<table className="GameRooms">
			<thead>
				<tr>
					{/* Titre du tableau */}
					<th colSpan={4}>{props.title}</th>
				</tr>
				<tr>
					{/* Catégories du tableau */}
					<th>Identifiant unique</th>
					<th>Nom du créateur</th>
					<th>Nombre de joueurs</th>
					<th>Actions disponibles</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>38e6364b-6ae1-49ab-8b07-f41d934fb100</td>
					<td>Florian06</td>
					<td>18</td>
					<td>
						<button type="button">Rejoindre</button>
						<button type="button">Regarder</button>
					</td>
				</tr>
				{/* <tr *ngFor="let data of filterTable.data">
					<td>{{ data?.roomID}}</td>
					<td>{{ data?.creator}}</td>
					<td>{{ data?.numberOfPlayer }}</td>
					<td>
						<button nz-button (click)="joinSalon(data)" [disabled]="data.numberOfPlayer===6">Join</button>
					</td>
				</tr> */}
			</tbody>
		</table>
	);
}