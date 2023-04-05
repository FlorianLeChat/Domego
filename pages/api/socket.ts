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
		const io = new Server( response.socket.server, {
			path: `${ process.env.NEXT_PUBLIC_BASE_PATH }/socket.io`
		} );

		response.socket.server.io = io;

		io.use( ( socket, next ) =>
		{
			// On vérifie ensuite si l'utilisateur a transmis un identifiant
			//  unique en provenance de son navigateur pendant la phase de connexion.
			if ( socket.handshake.auth.cacheId )
			{
				// On tente de récupère un quelconque utilisateur actuellement
				//  enregistré avant de le mettre à jour.
				const user = findUser( socket.handshake.auth.cacheId );

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
			import( "@/routes/connect" ).then( ( { Connect } ) => Connect( io, socket ) );

			// Déconnexion des utilisateurs.
			import( "@/routes/disconnect" ).then( ( { Disconnect } ) => Disconnect( io, socket ) );

			// Récupération des parties.
			import( "@/routes/rooms" ).then( ( { Rooms } ) => Rooms( io, socket ) );

			// Assignation des rôles.
			import( "@/routes/roles" ).then( ( { Roles } ) => Roles( io, socket ) );

			// Gestion des messages.
			import( "@/routes/chat" ).then( ( { Chat } ) => Chat( io, socket ) );

			// Action des administrateurs.
			import( "@/routes/admin" ).then( ( { Admin } ) => Admin( io, socket ) );

			// Calcul de la latence client<->serveur.
			import( "@/routes/ping" ).then( ( { Ping } ) => Ping( io, socket ) );

			// Validation des jetons reCAPTCHA.
			import( "@/routes/recaptcha" ).then( ( { Recaptcha } ) => Recaptcha( io, socket ) );
		} );
	}

	// On signale enfin que la réponse a été traitée.
	response.end();
}