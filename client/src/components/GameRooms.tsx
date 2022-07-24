//
// Composant pour afficher un tableau de l'ensemble des parties en cours.
//
import { SocketContext } from "../utils/SocketContext";
import { HTMLProps, useEffect, useState, useContext } from "react";

import "./GameRooms.scss";

interface Room
{
	// Déclaration des variables de l'interface.
	id: string;
	count: number;
	creator: string;
}

export default function GameRooms( props: HTMLProps<HTMLTableElement> ): JSX.Element
{
	// Déclaration des variables d'état.
	const [ rooms, setRooms ] = useState<JSX.Element[]>( [] );

	// Déclaration des constantes.
	const socket = useContext( SocketContext );

	// Récupération de l'ensemble des parties en cours.
	useEffect( () =>
	{
		const interval = setInterval( () =>
		{
			// On actualise les informations des parties en cours toutes les 3 secondes
			//	à partir du montage du composant.
			socket.emit( "GameRooms", ( rooms: any ) =>
			{
				// Lors de la réception des données, on construit le HTML afin de l'afficher
				//	lors du rendu de la page.
				const rows = rooms.map( ( element: Room, indice: number ) =>
					<tr key={indice}>
						<td>{element.id}</td>
						<td>{element.creator}</td>
						<td>{element.count}/6</td>
						<td>
							<button type="button">Rejoindre</button>
							<button type="button">Regarder</button>
						</td>
					</tr>
				);

				setRooms( rows );
			} );
		}, 1000 );

		return () =>
		{
			// On supprime le minuteur au démontage du composant.
			clearInterval( interval );
		};
	}, [ socket ] );

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
				{rooms}
			</tbody>
		</table>
	);
}