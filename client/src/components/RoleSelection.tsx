//
// Composant pour afficher un tableau de l'ensemble des parties en cours.
//
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

import "./GameRooms.scss";

interface RoleProps
{
	// Déclaration des variables de l'interface.
	socket: Socket;
}

export default function RoleSelection( _props: RoleProps ): JSX.Element
{
	// Récupération des paramètres.
	const { roomid } = useParams();

	// Affichage du rendu HTML du composant.
	return (
		<h1>Salut {roomid} !</h1>
	);
}