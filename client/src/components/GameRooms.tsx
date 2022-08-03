//
// Composant pour afficher un tableau de l'ensemble des parties en cours.
//
import { SocketContext } from "../utils/SocketContext";
import { useTranslation } from "react-i18next";
import { HTMLProps, useEffect, useState, useContext } from "react";

import "../i18n/config";
import "./GameRooms.scss";

interface Room
{
	// Déclaration des variables de l'interface.
	id: string;
	creator: string;
	players: number;
	spectators: number;
}

export default function GameRooms( props: HTMLProps<HTMLTableElement> ): JSX.Element
{
	// Déclaration des variables d'état.
	const [ rooms, setRooms ] = useState<JSX.Element[]>( [] );

	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );

	// Récupération de l'ensemble des parties en cours.
	useEffect( () =>
	{
		const interval = setInterval( () =>
		{
			// On actualise les informations des parties en cours toutes les 3 secondes
			//	à partir du montage du composant.
			socket.emit( "GameRooms", ( rooms: Room[] ) =>
			{
				// Lors de la réception des données, on construit le HTML afin de l'afficher
				//	lors du rendu de la page.
				const rows = rooms.map( ( element: Room, indice: number ) =>
					<tr key={indice}>
						<td>{element.id}</td>
						<td>{element.creator}</td>
						<td>{element.players}/6 [{element.spectators}]</td>
						<td>
							<button type="button" onClick={joinGame}>{t( "pages.rooms.join" )}</button>
							<button type="button" onClick={watchGame}>{t( "pages.rooms.watch" )}</button>
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
	}, [ t, socket ] );

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
					<th>{t( "pages.rooms.unique_identifier" )}</th>
					<th>{t( "pages.rooms.creator_name" )}</th>
					<th>{t( "pages.rooms.player_count" )}</th>
					<th>{t( "pages.rooms.available_actions" )}</th>
				</tr>
			</thead>
			<tbody>
				{rooms.length > 0 ? rooms : <tr><td colSpan={4}>{t( "pages.rooms.no_current_data" )}</td></tr>}
			</tbody>
		</table>
	);
}