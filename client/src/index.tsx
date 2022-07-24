// Importation des feuilles de style CSS.
import "normalize.css";
import "./index.scss";

// Importation de React et de ses dépendances.
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { createRoot } from "react-dom/client";
import { useState, StrictMode } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Importation des composants React.
import TestApi from "./components/TestApi";
import NotFound from "./components/NotFound";
import LiveChat from "./components/LiveChat";
import GameRooms from "./components/GameRooms";
import RoleSelection from "./components/RoleSelection";

// Création du socket de communication.
const socket = io( { path: process.env.PUBLIC_URL + "/socket.io" } );

// Création du conteneur principal.
export default function Home(): JSX.Element
{
	// Création des constantes.
	const uuid = crypto.randomUUID();
	const navigate = useNavigate();

	// Déclaration des variables d'état.
	const [ username, setUsername ] = useState( "" );

	// Création d'une nouvelle partie.
	const handleButtonClick = async () =>
	{
		// On vérifie tout d'abord si l'utilisateur veut bien créer une nouvelle partie.
		const result = await Swal.fire( {
			title: "Voulez-vous créer une nouvelle partie ?",
			icon: "question",
			text: "Une fois la partie créée, vous ne pourrez plus changer de nom d'utilisateur.",
			reverseButtons: true,
			showCancelButton: true,
			cancelButtonText: "Non",
			confirmButtonText: "Oui",
			cancelButtonColor: '#d33333',
			confirmButtonColor: '#3085d6',
		} );

		if ( result.isConfirmed )
		{
			// Si c'est le cas, on vérifie ensuite si un nom d'utilisateur a bien été renseigné.
			if ( username.trim() !== "" )
			{
				// On signale alors au serveur qu'on veut créer une nouvelle partie.
				socket.emit( "joinRoom", username, uuid );

				// On redirige enfin l'utilisateur vers la page de sélection des rôles.
				await Swal.fire( {
					timer: 500,
					title: "Création de la partie en cours...",
					allowEscapeKey: false,
					timerProgressBar: true,
					allowOutsideClick: false,
					didOpen: () =>
					{
						// Affichage de l'animation de chargement.
						Swal.showLoading();
					},
					willClose: () =>
					{
						// Redirection automatique à la fin du temps d'attente.
						navigate( `/game/${ uuid }/selection` );
					}
				} );
			}
			else
			{
				// Dans le cas contraire, on avertit enfin l'utilisateur qu'une information
				//	est manquante.
				Swal.fire( "Information manquante", "Le nom d'utilisateur est manquant ou invalide.", "error" );
			}
		}
	};

	// Récupération de la valeur du champ de saisie.
	const handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
	{
		setUsername( event.target.value );
	};

	// Affichage du rendu HTML du composant.
	return (
		<section className="Home">
			{/* Titre de la page */}
			<h1>Domego</h1>

			{/* Descriptif du jeu */}
			<u>Un jeu sérieux pédagogique</u>

			<article>
				{/* Saisie d'un pseudonyme */}
				<label>
					Veuillez saisir un pseudonyme.
					<input type="text" placeholder="Marc007" autoComplete="off" spellCheck="false" minLength={5} maxLength={20} onChange={handleInputChange} value={username} />
				</label>

				{/* Bouton de création d'une nouvelle partie */}
				<button type="button" onClick={handleButtonClick}>Créer une partie</button>

				{/* Tableau des parties en cours */}
				<GameRooms title="Parties disponibles" />
			</article>
		</section>
	);
}

// Gestion des routes vers les pages du site.
const root = createRoot( document.querySelector( "body > main" ) as Element );
root.render(
	<StrictMode>
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<Routes>
				<Route path="/">
					{/* Page d'accueil */}
					<Route index element={<Home />} />

					{/* Page non trouvée. */}
					<Route path="*" element={<NotFound />} />

					{/* Chat de test pour chaque partie. */}
					<Route path="chat/:roomid" element={<LiveChat socket={socket} />} />

					{/* Page de sélection des rôles avant chaque partie. */}
					<Route path="game/:roomid/selection" element={<RoleSelection socket={socket} />} />

					{/* Page de test des requêtes via MongoDB */}
					<Route path="database" element={<TestApi />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);