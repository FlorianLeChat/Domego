//
// Page utilisée pour générer le contenu statique HTML de la page.
//  Source : https://nextjs.org/docs/advanced-features/custom-app
//

// Importation de la feuille de style CSS globale.
import "./_global.scss";

// Importation du normalisateur TypeScript.
import "@total-typescript/ts-reset";

// Importation des dépendances.
import Head from "next/head";
import dynamic from "next/dynamic";
import { Roboto } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";

// Importation des types.
import type { AppProps } from "next/app";

// Importation des composants.
const Layout = dynamic( () => import( "@/components/Layout" ) );

// Création de la police de caractères Roboto.
const roboto = Roboto( {
	weight: [ "300", "400", "500" ],
	subsets: [ "latin" ],
	display: "swap"
} );

function Domego( { Component, pageProps }: AppProps )
{
	// Déclaration des constantes.
	const { basePath } = useRouter();
	const favicons = `${ basePath }/assets/favicons`;

	// Création du socket de communication avec le serveur.
	//  Source : https://github.com/vercel/next.js/discussions/15341
	useEffect( () =>
	{
		fetch( `${ basePath }/api/socket` );
	}, [ basePath ] );

	// Affichage du rendu HTML de la page.
	return (
		<>
			<Head>
				{/* Méta-données du document */}
				<meta charSet="utf-8" />
				<meta name="author" content={process.env.NEXT_PUBLIC_AUTHOR} />
				<meta name="description" content={process.env.NEXT_PUBLIC_DESCRIPTION} />
				<meta name="keywords" content={process.env.NEXT_PUBLIC_TAGS} />
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				<meta name="theme-color" content="#40a9ff" />

				{/* Titre du document */}
				<title>{`${ process.env.NEXT_PUBLIC_TITLE }`}</title>

				{/* Icônes et manifeste du document */}
				<link rel="icon" type="image/webp" sizes="16x16" href={`${ favicons }/16x16.webp`} />
				<link rel="icon" type="image/webp" sizes="32x32" href={`${ favicons }/32x32.webp`} />
				<link rel="icon" type="image/webp" sizes="48x48" href={`${ favicons }/48x48.webp`} />
				<link rel="icon" type="image/webp" sizes="192x192" href={`${ favicons }/192x192.webp`} />
				<link rel="icon" type="image/webp" sizes="512x512" href={`${ favicons }/512x512.webp`} />

				<link rel="apple-touch-icon" href={`${ favicons }/180x180.webp`} />
				<link rel="manifest" href={`${ basePath }/manifest.json`} />
			</Head>

			{/* Avertissement page sans JavaScript */}
			<noscript>
				<h1>This website created with <a href="https://nextjs.org/">NextJS</a> requires JavaScript to run.</h1>
				<h2>
					Click <a href="https://www.whatismybrowser.com/detect/is-javascript-enabled">here</a>
					to be redirected to an external site to help you solve this issue.
				</h2>
			</noscript>

			{/* Injection de règles de style CSS */}
			<style jsx global>
				{`
					html
					{
						font-family: ${ roboto.style.fontFamily };
					}
				`}
			</style>

			{/* Affichage du composant demandé */}
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	);
}

export default appWithTranslation( Domego );