//
// Route fournissant des validations sur les jetons d'authentification.
//
import express from "express";
import * as dotenv from "dotenv";

const router = express.Router();
dotenv.config( { path: "../client/.env" } );

router.post( "/", async ( request, result ) =>
{
	try
	{
		// On effectue tout d'abord une requête à l'API de Google reCAPTCHA
		//	afin de vérifier si le jeton d'authentification envoyé par le client
		//	est valide ou non.
		const response = await fetch( `https://www.google.com/recaptcha/api/siteverify?secret=${ process.env.REACT_APP_CAPTCHA_SECRET_KEY }&response=${ request.body.token }` );

		if ( response.ok )
		{
			// Si la réponse est correcte, on transforme le résultat sous format JSON
			//	avant de vérifier si le jeton est valide ou non.
			const json = await response.json();

			if ( json.success )
			{
				// En cas de jeton valide, on vérifie le score obtenu et on détermine
				//	arbitrairement si l'utilisateur est un humain ou un robot;
				result.json( { state: true, response: json.score > 0.7 ? "human" : "robot" } );
			}
			else
			{
				// Dans le cas contraire, on indique tout simplement que la requête
				//	n'a pas aboutie jusqu'à son terme.
				result.json( { state: false } );
			}
		}
	}
	catch ( error )
	{
		// En cas d'erreur quelconque, on le signale tout simplement.
		result.json( { state: false } );
	}
} );

export default router;