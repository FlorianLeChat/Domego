//
// Route permettant de valider les jetons d'authentification de Google reCAPTCHA.
//
import { Server, Socket } from "socket.io";
import type { RecaptchaAttributes } from "@/interfaces/Recaptcha";

export function Recaptcha( _io: Server, socket: Socket )
{
	socket.on( "GameRecaptcha", async ( token, callback ) =>
	{
		// On vérifie d'abord si la clé secrète de l'API de Google reCAPTCHA
		//  a été définie ou non.
		if ( !process.env.CAPTCHA_SECRET_KEY || process.env.NODE_ENV === "development" )
		{
			callback( "success", "🤖", "🤖" );
			return;
		}

		// On vérifie ensuite si le jeton d'authentification qui a été transmis
		//  semble valide ou non.
		if ( !token )
		{
			callback( "error", "modals.recaptcha_invalid_token_title", "modals.recaptcha_invalid_token_description" );
			return;
		}

		// On effectue alors une requête à l'API de Google reCAPTCHA
		//  afin de vérifier si le jeton d'authentification envoyé par le client
		//  est valide ou non.
		const response = await fetch( `https://www.google.com/recaptcha/api/siteverify?secret=${ process.env.CAPTCHA_SECRET_KEY }&response=${ token }` );

		if ( response.ok )
		{
			// Si la réponse est correcte, on transforme le résultat sous format JSON
			//  avant de vérifier si le jeton est valide ou non.
			const json = await response.json() as RecaptchaAttributes;

			if ( json.success )
			{
				// En cas de jeton valide, on vérifie le score obtenu et on détermine
				//  arbitrairement si l'utilisateur est un humain ou un robot;
				callback( json.score > 0.7 ? "success" : "error", "🤖", "🤖" );
			}
			else
			{
				// Dans le cas contraire, on indique tout simplement que la requête
				//  n'a pas aboutie jusqu'à son terme.
				callback( "error", "modals.recaptcha_invalid_token_title", "modals.recaptcha_invalid_token_description" );
			}
		}
	} );
}