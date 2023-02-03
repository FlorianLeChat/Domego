//
// Route permettant l'initialisation des connexions via Socket.io.
//
import { Server } from "socket.io";
import { findUser } from "@/utils/UserManager";
import type { NextApiRequest } from "next";
import type { NextApiResponseWithSocket } from "@/interfaces/Socket";

export default function handler( _request: NextApiRequest, response: NextApiResponseWithSocket )
{
	// On vérifie tout d'abord si le socket n'a pas déjà été initialisé.
	if ( !response.socket.server.io )
	{
		// Si ce n'est pas le cas, on créé une nouvelle instance de Socket.io avant de la mettre en mémoire.
		const io = new Server( response.socket.server );

		response.socket.server.io = io;

		io.use( ( socket, next ) =>
		{
			// On vérifie ensuite si l'utilisateur a transmis un identifiant
			//	unique en provenance de son navigateur pendant la phase de connexion.
			if ( socket.handshake.auth[ "cacheId" ] )
			{
				// On tente de récupère un quelconque utilisateur actuellement
				//	enregistré avant de le mettre à jour.
				const user = findUser( socket.handshake.auth[ "cacheId" ] );

				if ( user )
				{
					user.id = socket.id;
				}
			}

			// On continue alors la connexion.
			next();
		} );

		// On définit après les différentes routes Socket.io.
		io.on( "connection", ( socket ) =>
		{
			// Connexion des utilisateurs.
			const { Connect } = require( "@/routes/connect" );
			Connect( io, socket );

			// Déconnexion des utilisateurs.
			const { Disconnect } = require( "@/routes/disconnect" );
			Disconnect( io, socket );

			// Récupération des parties.
			const { Rooms } = require( "@/routes/rooms" );
			Rooms( io, socket );

			// Assignation des rôles.
			const { Roles } = require( "@/routes/roles" );
			Roles( io, socket );

			// Gestion des messages.
			const { Chat } = require( "@/routes/chat" );
			Chat( io, socket );

			// Action des administrateurs.
			const { Admin } = require( "@/routes/admin" );
			Admin( io, socket );

			// Calcul de la latence client<->serveur.
			const { Ping } = require( "@/routes/ping" );
			Ping( io, socket );

			// Validation des jetons reCAPTCHA.
			const { Recaptcha } = require( "@/routes/recaptcha" );
			Recaptcha( io, socket );
		} );
	}

	// On signale enfin que la réponse a été traitée.
	response.end();
}