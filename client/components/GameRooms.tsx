//
// Composant d'affichage de l'ensemble des parties créées.
//
import { useNavigate } from "next/link";
import { SocketContext } from "@/utils/SocketContext";
import { useTranslation } from "next-i18next";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { useEffect, useState, useCallback, useContext } from "react";

import styles from "@/styles/GameRooms.module.scss";

interface GameRoomsProps
{
	// Déclaration des champs des propriétés du composant.
	username: string;
}

interface GameRoomList
{
	// Déclaration des champs de la liste des parties.
	id: string;
	state: number;
	creator: string;
	players: number;
	spectators: number;
}

// Temps d'attente entre chaque rafraîchissement de la liste
//	des serveurs auprès du serveur (en millisecondes).
const REFRESH_TIME = 5000;

export default function GameRooms( props: GameRoomsProps ): JSX.Element
{
	// Déclaration des variables d'état.
	const [ rooms, setRooms ] = useState<JSX.Element[]>( [] );

	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );
	const navigate = useNavigate();

	// Bouton pour rejoindre une partie (joueur/spectateur).
	const joinGame = useCallback( async ( roomId: string, type: string, state: number ) =>
	{
		// On vérifie d'abord si l'utilisateur veut bien rejoindre la partie.
		const result = await Swal.fire( {
			icon: "question",
			text: t( `modals.join_game_${ type }_description` ),
			title: t( `modals.join_game_${ type }_title` ),
			reverseButtons: true,
			showCancelButton: true,
			cancelButtonText: t( "global.no" ),
			confirmButtonText: t( "global.yes" ),
			cancelButtonColor: "#dc3545",
			confirmButtonColor: "#28a745"
		} );

		if ( result.isDenied || result.isDismissed )
		{
			// Si ce n'est pas le cas, on ne fait rien.
			return;
		}

		// On affiche ensuite une animation de chargement pour indiquer à l'utilisateur
		//	que la partie est en cours de chargement.
		await Swal.fire( {
			icon: "info",
			text: t( "modals.joining_game_description", { type: t( `pages.rooms.${ type }` ).toLowerCase() } ),
			title: t( "modals.joining_game_title" ),
			allowEscapeKey: false,
			timerProgressBar: true,
			allowOutsideClick: false,
			didOpen: () =>
			{
				// Affichage de l'animation de chargement.
				Swal.showLoading();

				// Envoi de la requête pour rejoindre la partie.
				socket.emit( "GameConnect", props.username, type, roomId, ( icon: SweetAlertIcon, title: string, message: string ) =>
				{
					// Si la réponse indique que la partie n'a pas été créée avec succès,
					//	on affiche le message d'erreur correspondant avec les informations
					//	transmises par le serveur.
					if ( icon !== "success" )
					{
						Swal.fire( {
							icon: icon,
							text: t( message ),
							title: t( title ),
							confirmButtonColor: "#28a745"
						} );

						return;
					}

					// Dans le cas contraire, on ferme la fenêtre de chargement pour poursuivre
					//	l'exécution des opérations.
					Swal.close();
				} );
			},
			willClose: () =>
			{
				// Redirection automatique si la fenêtre de chargement est fermée
				//	normalement (sans aucune erreur émise par le serveur).
				navigate( `/game/${ state === 2 ? "board" : "selection" }`, { state: { roomId: roomId, username: props.username, admin: false, type: type } } );
			}
		} );
	}, [ t, props, socket, navigate ] );

	// Récupération de l'ensemble des parties en cours.
	const updateRooms = useCallback( () =>
	{
		// On effectue une requête pour récupérer la liste des parties en cours.
		socket.emit( "GameRooms", ( rooms: GameRoomList[] ) =>
		{
			// Lors de la réception des données, on construit le HTML afin de l'afficher
			//	lors du rendu de la page.
			const rows = rooms.map( ( room: GameRoomList, indice: number ) =>
				<tr key={indice}>
					<td>{room.id}</td>
					<td>{room.creator}</td>
					<td>{room.players}/6 [{room.spectators}]</td>
					<td>
						{/* Rejoindre la partie */}
						<button type="button" onClick={() => joinGame( room.id, "player", room.state )} disabled={room.state !== 0}>{t( "pages.rooms.join" )}</button>
						{/* Observer la partie */}
						<button type="button" onClick={() => joinGame( room.id, "spectator", room.state )} disabled={room.state === 3}>{t( "pages.rooms.watch" )}</button>
					</td>
				</tr>
			);

			setRooms( rows );
		} );
	}, [ t, socket, joinGame ] );

	// Rafraîchissement des parties en cours.
	useEffect( () =>
	{
		// On créé un minuteur qui actualise périodiquement les informations
		//	des parties en cours au montage du composant.
		const interval = setInterval( updateRooms, REFRESH_TIME );

		// On effectue ensuite une première actualisation des parties en cours.
		updateRooms();

		return () =>
		{
			// On supprime enfin le minuteur au démontage du composant.
			clearInterval( interval );
		};
	}, [ t, socket, updateRooms ] );

	// Affichage du rendu HTML du composant.
	return (
		<table id={styles[ "GameRooms" ]}>
			<thead>
				<tr>
					{/* Titre du tableau */}
					<th colSpan={4}>{t( "pages.index.games_available" )}</th>
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
				{/* Liste des parties en cours */}
				{rooms.length > 0 ? rooms : <tr><td colSpan={4}>{t( "pages.rooms.no_current_data" )}</td></tr>}
			</tbody>
		</table>
	);
}