// Importation de la feuille de style CSS.
import "@/styles/_global.scss";

// Importation des fichiers de configuration.
import "@/config/translations";

// Importation des composants.
import Head from "next/head";
import type { AppProps } from "next/app";

export default function Domego( { Component, pageProps }: AppProps )
{
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
				<link rel="icon" type="image/webp" sizes="16x16" href={`${ process.env[ "NEXT_PUBLIC_URL" ] }16x16.webp`} />
				<link rel="icon" type="image/webp" sizes="32x32" href={`${ process.env[ "NEXT_PUBLIC_URL" ] }32x32.webp`} />
				<link rel="icon" type="image/webp" sizes="48x48" href={`${ process.env[ "NEXT_PUBLIC_URL" ] }48x48.webp`} />
				<link rel="icon" type="image/webp" sizes="192x192" href={`${ process.env[ "NEXT_PUBLIC_URL" ] }192x192.webp`} />
				<link rel="icon" type="image/webp" sizes="512x512" href={`${ process.env[ "NEXT_PUBLIC_URL" ] }512x512.webp`} />

				<link rel="apple-touch-icon" href={`${ process.env[ "NEXT_PUBLIC_URL" ] }/180x180.webp`} />
				<link rel="manifest" href={`${ process.env[ "NEXT_PUBLIC_URL" ] }manifest.json`} />
			</Head>
			<main>
				<noscript>
					<h1>This website created with <a href="https://nextjs.org/">NextJS</a> requires JavaScript to run.</h1>
					<h2>Click <a href="https://www.whatismybrowser.com/detect/is-javascript-enabled">here</a> to be redirected to an external site to help you solve this issue.</h2>
				</noscript>

				<Component {...pageProps} />;
			</main>
		</>
	);
}