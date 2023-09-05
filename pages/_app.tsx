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
import Script from "next/script";
import dynamic from "next/dynamic";
import { run } from "vanilla-cookieconsent";
import { Roboto } from "next/font/google";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import { useEffect, useState } from "react";

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
	const analyticsUrl = new URL( "https://www.googletagmanager.com/gtag/js" );
	const recaptchaUrl = new URL( "https://www.google.com/recaptcha/api.js" );
	const favicons = `${ basePath }/assets/favicons`;

	analyticsUrl.searchParams.append( "id", process.env.NEXT_PUBLIC_ANALYTICS_TAG ?? "" );
	recaptchaUrl.searchParams.append( "render", process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY ?? "" );

	// Déclaration des variables d'état.
	const [ analytics, setAnalytics ] = useState( false );
	const [ recaptcha, setRecaptcha ] = useState( false );

	// Création du socket de communication avec le serveur.
	//  Source : https://github.com/vercel/next.js/discussions/15341
	useEffect( () =>
	{
		fetch( `${ basePath }/api/socket` );
	}, [ basePath ] );

	// Affichage du consentement des cookies.
	//  Source : https://cookieconsent.orestbida.com/reference/api-reference.html
	useEffect( () =>
	{
		run( {
			// Activation automatique de la fenêtre de consentement.
			autoShow: process.env.NEXT_PUBLIC_ENV === "production",

			// Désactivation de l'interaction avec la page.
			disablePageInteraction: true,

			// Disparition du mécanisme pour les robots.
			hideFromBots: process.env.NEXT_PUBLIC_ENV === "production",

			// Paramètres internes des cookies.
			cookie: {
				path: basePath,
				name: "NEXT_ANALYTICS"
			},

			// Paramètres de l'interface utilisateur.
			guiOptions: {
				consentModal: {
					layout: "bar",
					position: "bottom center"
				}
			},

			// Configuration des catégories de cookies.
			categories: {
				necessary: {
					enabled: true,
					readOnly: true
				},
				analytics: {
					autoClear: {
						cookies: [
							{
								name: /^(_ga|_gid)/
							}
						]
					}
				},
				security: {
					autoClear: {
						cookies: [
							{
								name: /^(OTZ|__Secure-ENID|SOCS|CONSENT|AEC)/
							}
						]
					}
				}
			},

			// Configuration des traductions.
			language: {
				default: "en",
				autoDetect: "document",
				translations: {
					en: `${ basePath }/locales/en/common.json`,
					fr: `${ basePath }/locales/fr/common.json`
				}
			},

			// Exécution des actions de consentement.
			onConsent: ( { cookie } ) =>
			{
				cookie.categories.forEach( ( category: string ) =>
				{
					if ( category === "analytics" )
					{
						setAnalytics(
							process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
								=== "true"
						);
					}
					else if ( category === "security" )
					{
						setRecaptcha(
							process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED
								=== "true"
						);
					}
				} );
			}
		} );
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

			{/* Google Analytics */}
			{analytics && (
				<>
					<Script src={analyticsUrl.href} strategy="lazyOnload" />
					<Script id="google-analytics" strategy="lazyOnload">
						{`
							window.dataLayer = window.dataLayer || [];

							function gtag( ...args )
							{
								window.dataLayer.push( ...args );
							}

							gtag( "js", new Date() );
							gtag( "config", "${ process.env.NEXT_PUBLIC_ANALYTICS_TAG ?? "" }" );
						`}
					</Script>
				</>
			)}

			{/* Google reCAPTCHA */}
			{recaptcha && <Script src={recaptchaUrl.href} strategy="lazyOnload" />}

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