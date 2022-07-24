//
// Composant pour afficher un tableau de l'ensemble des parties en cours.
//
import { useParams } from "react-router-dom";
import "./GameRooms.scss";

export default function RoleSelection(): JSX.Element
{
	// Récupération des paramètres.
	const { roomid } = useParams();

	// Affichage du rendu HTML du composant.
	return (
		<h1>Salut {roomid} !</h1>
	);
}