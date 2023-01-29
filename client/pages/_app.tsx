// Importation de la feuille de style CSS globale.
import "@/styles/_global.scss";

// Importation des dépendances.
import Head from "next/head";
import { Roboto } from "@next/font/google";
import { appWithTranslation } from "next-i18next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// Importation des fonctions utilitaires.
import { SocketProvider } from "@/utils/SocketContext";

// Importation des types.
import type { AppProps } from "next/app";

// Création de la police de caractères Roboto.
const roboto = Roboto( {
	weight: [ "300", "400", "500" ],
	subsets: [ "latin" ],
} );

const Domego = ( { Component, pageProps }: AppProps ) =>
{
	// Génération de la structure de la page.
	return (
		<>
			<Head>
				{/* Méta-données du document */}
				<meta charSet="utf-8" />
				<meta name="author" content={`${ process.env[ "NEXT_PUBLIC_AUTHOR" ] }`} />
				<meta name="description" content={`${ process.env[ "NEXT_PUBLIC_DESCRIPTION" ] }`} />
				<meta name="keywords" lang="fr" content={`${ process.env[ "NEXT_PUBLIC_TAGS" ] }`} />
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				<meta name="theme-color" content="#40a9ff" />

				<meta property="og:type" content="website" />
				<meta property="og:url" content={`${ process.env[ "NEXT_PUBLIC_URL" ] }`} />
				<meta property="og:title" content={`${ process.env[ "NEXT_PUBLIC_TITLE" ] }`} />
				<meta property="og:description" content={`${ process.env[ "NEXT_PUBLIC_DESCRIPTION" ] }`} />
				<meta property="og:image" content={`${ process.env[ "NEXT_PUBLIC_BANNER" ] }`} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content={`${ process.env[ "NEXT_PUBLIC_URL" ] }`} />
				<meta property="twitter:title" content={`${ process.env[ "NEXT_PUBLIC_TITLE" ] }`} />
				<meta property="twitter:description" content={`${ process.env[ "NEXT_PUBLIC_DESCRIPTION" ] }`} />
				<meta property="twitter:image" content={`${ process.env[ "NEXT_PUBLIC_BANNER" ] }`} />

				{/* Titre du document */}
				<title>{`${ process.env[ "NEXT_PUBLIC_TITLE" ] }`}</title>

				{/* Icônes et manifeste du document */}
				<link rel="icon" type="image/webp" sizes="16x16" href="/assets/favicons/16x16.webp" />
				<link rel="icon" type="image/webp" sizes="32x32" href="/assets/favicons/32x32.webp" />
				<link rel="icon" type="image/webp" sizes="48x48" href="/assets/favicons/48x48.webp" />
				<link rel="icon" type="image/webp" sizes="192x192" href="/assets/favicons/192x192.webp" />
				<link rel="icon" type="image/webp" sizes="512x512" href="/assets/favicons/512x512.webp" />

				<link rel="apple-touch-icon" href="/assets/favicons//180x180.webp" />
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<main className={roboto.className}>
				<noscript>
					<h1>This website created with <a href="https://nextjs.org/">NextJS</a> requires JavaScript to run.</h1>
					<h2>Click <a href="https://www.whatismybrowser.com/detect/is-javascript-enabled">here</a> to be redirected to an external site to help you solve this issue.</h2>
				</noscript>

				<SocketProvider>
					<GoogleReCaptchaProvider reCaptchaKey={process.env[ "NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY" ] ?? ""}>
						<Component {...pageProps} />
					</GoogleReCaptchaProvider>
				</SocketProvider>
			</main>
		</>
	);
};

export default appWithTranslation( Domego );