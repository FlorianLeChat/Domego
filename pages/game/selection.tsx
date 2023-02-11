//
// Route vers la page de sélection du rôle avant de commencer une partie.
//
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import type { SweetAlertIcon } from "sweetalert2";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useState, useEffect } from "react";

import styles from "./selection.module.scss";
import { UserType } from "@/enums/User";
import i18nextConfig from "@/next-i18next.config";
import { SocketContext } from "@/utils/SocketContext";

const RoleCard = dynamic( () => import( "@/components/RoleCard" ) );
const GameChat = dynamic( () => import( "@/components/GameChat" ) );

export async function getStaticProps( { locale }: { locale: string; } )
{
	// Récupération des traductions côté serveur.
	return {
		props: {
			...( await serverSideTranslations( locale ?? i18nextConfig.i18n.defaultLocale ) )
		},
	};
}

export default function RoleSelection()
{
	// Déclaration des constantes.
	const { t } = useTranslation();
	const router = useRouter();
	const socket = useContext( SocketContext );

	// Déclaration des variables d'état.
	const [ disabled, setDisabled ] = useState( true );
	const [ showChat, setShowChat ] = useState( true );

	// Bouton de lancement de la partie.
	const startGame = () =>
	{
		// On vérifie d'abord que la connexion aux sockets est établie.
		if ( !socket?.connected )
		{
			return;
		}

		// On envoie enfin une requête au serveur pour lancer la partie.
		socket.emit( "GameAdmin", "start", async ( icon: SweetAlertIcon, title: string, message: string ) =>
		{
			// Si la réponse indique que la partie ne peut pas être actuellement lancée,
			//	on affiche le message d'erreur correspondant avec les informations
			//	transmises par le serveur.
			if ( icon !== "success" )
			{
				const Swal = ( await import( "sweetalert2" ) ).default;

				Swal.fire( {
					icon: icon,
					text: t( message as any ),
					title: t( title as any ),
					confirmButtonColor: "#28a745"
				} );
			}
		} );
	};

	// Apparition ou disparition des communications textuelles.
	const toggleChat = () =>
	{
		setShowChat( !showChat );
	};

	// Envoi et des réceptions des mises à jour depuis/vers le serveur.
	useEffect( () =>
	{
		// On vérifie d'abord si des paramètres ont été transmis à la page.
		if ( Object.keys( router.query ).length === 0 )
		{
			router.push( "/404" );
			return;
		}

		// On vérifie également que la connexion aux sockets est établie.
		if ( !socket?.connected )
		{
			return;
		}

		// On vérifie après la latence entre le client et le serveur
		//	distant en mettant en mémoire le temps actuel.
		const start = Date.now();

		socket.emit( "GamePing", async () =>
		{
			// Lors de la réception de la requête par le serveur,
			//	on calcule la différence entre la temps actuel ainsi
			//	que le temps précédemment mis en mémoire.
			const delta = Date.now() - start;

			if ( delta > 500 )
			{
				// Si la différence est supérieure à 500ms,
				//	on affiche un avertissement à l'utilisateur.
				const Swal = ( await import( "sweetalert2" ) ).default;

				Swal.fire( {
					icon: "warning",
					text: t( "modals.network_latency_description", { latency: delta } ),
					title: t( "modals.network_latency_title" ),
					confirmButtonColor: "#28a745"
				} );
			}
		} );

		// On accroche ensuite un événement pour rediriger automatiquement
		//	l'utilisateur lorsque la partie a été lancée par l'administrateur.
		socket.on( "GameStart", () =>
		{
			router.replace( {
				query: { roomId: router.query[ "uuid" ], username: router.query[ "username" ], admin: router.query[ "admin" ], type: router.query[ "type" ] },
				pathname: "/game/board"
			} );
		} );

		// On accroche enfin un dernier événement (seulement pour les administrateurs)
		//	afin de déterminer l'état du bouton de lancement de partie.
		socket.on( "GameReady", ( state: boolean ) =>
		{
			setDisabled( !state );
		} );
	}, [ t, router, socket ] );

	// Affichage du rendu HTML du composant.
	return (
		<section id={styles[ "RoleSelection" ]}>
			{/* Titre de la page */}
			<h1>{t( "pages.selection.title" )}</h1>

			<div>
				{/* Liste des rôles */}
				<RoleCard name="project_owner" budget="150K" />
				<RoleCard name="project_manager" budget="30K" />
				<RoleCard name="engineering_office" budget="20K" />
				<RoleCard name="control_office" budget="20K" />
				<RoleCard name="secondary_state" budget="30K" />
				<RoleCard name="general_construction" budget="30K" />
			</div>

			{/* Bouton de lancement de la partie */}
			{/* (disponible seulement pour l'administrateur) */}
			{router.query[ "admin" ] && <button type="button" onClick={startGame} disabled={disabled}>{t( "pages.selection.launch" )}</button>}

			{/* Communications textuelles de la partie */}
			{/* (disponible seulement pour les non-spectateurs) */}
			{router.query[ "type" ] === UserType.PLAYER && <button type="button" onClick={toggleChat}></button>}<GameChat show={showChat} />
		</section>
	);
}