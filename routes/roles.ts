//
// Route permettant de gérer les assignations des rôles aux utilisateurs.
//
import { findRoom } from "@/utils/RoomManager";
import { findUser } from "@/utils/UserManager";
import { RoomState } from "@/enums/Room";
import { Server, Socket } from "socket.io";
import { UserType, UserState, UserRole } from "@/enums/User";

export function Roles( _io: Server, socket: Socket )
{
	socket.on( "GameRole", ( role, action, state, callback ) =>
	{
		// On tente de récupérer tout d'abord les informations de l'utilisateur
		//  avant de réaliser certaines vérifications pour l'authentifier.
		const user = findUser( socket.id );

		if ( !user || user.type === UserType.SPECTATOR )
		{
			return;
		}

		// On récupère ensuite les informations de la partie où le joueur
		//  cherche à se connecter.
		const room = findRoom( user.game );

		if ( !room )
		{
			return;
		}

		// On récupère alors le rôle sélectionné par l'utilisateur avant
		//  de déterminer l'action qu'il veut réaliser.
		if ( role && Object.values( UserRole ).includes( role ) )
		{
			if ( action === "select" || action === "check" )
			{
				// L'utilisateur semble vouloir sélectionner ou désélectionner
				//  un rôle, on poursuit les vérifications d'usage.
				if ( state )
				{
					// Si c'est une sélection, on vérifie que le rôle sélectionné
					//  n'est pas occupé par quelqu'un d'autre.
					let cache = user.role && user.name;

					room.players.forEach( ( identifier ) =>
					{
						const target = findUser( identifier );

						// L'utilisateur ne doit pas avoir le même rôle que celui
						//  qui a été sélectionné.
						if ( target && target.role === role )
						{
							cache = target.name;
						}
					} );

					if ( !cache && !user.role && action === "select" )
					{
						// Si le rôle est libre, on l'assigne à l'utilisateur et
						//  on signale le changement à tous les utilisateurs du salon.
						user.role = role;

						socket.broadcast.to( room.id ).emit( "GameRole", role, true, user.name );
					}

					// Dans le cas contraire, rien ne se passe mais on renvoie
					//  systématiquement un résultat pour indiquer si le changement
					//  s'est effectué ou non.
					callback( !cache, cache ?? user.name );
				}
				else
				{
					// En cas de désélection, on met à jour les informations de l'utilisateur
					//  avant de signaler ce même changement à tous les utilisateurs du salon.
					if ( user.role === role )
					{
						user.role = undefined;
					}

					socket.broadcast.to( room.id ).emit( "GameRole", role, false, "" );

					callback( true, user.name );
				}
			}
			else if ( action === "ready" && user.role === role )
			{
				// L'utilisateur semble vouloir indiquer qu'il est prêt pour la partie.
				user.state = state ? UserState.READY : UserState.WAITING;

				// Par la même occasion, on essaie de déterminer si la partie est prête
				//  à être lancée par l'administrateur de la partie.
				let ready = room.players.length === 6 && state;

				if ( !ready )
				{
					room.players.forEach( ( identifier ) =>
					{
						const target = findUser( identifier );

						// Un utilisateur ne doit pas être marqué comme en attente.
						if ( target && target.state === UserState.WAITING )
						{
							ready = false;
						}
					} );
				}

				// Après la vérification, on change l'état de la partie si nécessaire
				//  avant d'en avertir l'administrateur.
				room.state = ready ? RoomState.READY : RoomState.CREATED;

				socket.broadcast.to( room.creator ).emit( "GameReady", ready );
			}
		}
	} );
}