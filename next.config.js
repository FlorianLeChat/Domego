// @ts-check

/**
 * @type {import("next").NextConfig}
 */
const { i18n } = require( "./next-i18next.config" );
const withPWA = require( "next-pwa" )( {
	dest: "public",
	disable: process.env.NODE_ENV === "development",
	fallbacks: {
		// Source : https://github.com/shadowwalker/next-pwa/issues/400
		document: `${ process.env.NEXT_PUBLIC_BASE_PATH }/_offline`,
		image: "",
		font: "",
		audio: "",
		video: ""
	}
} );

module.exports = withPWA( {
	i18n,
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
	poweredByHeader: false,
	reactStrictMode: true,
	async redirects()
	{
		// Définition des redirections de base.
		const redirects = [
			{
				source: "/source",
				permanent: true,
				destination: "https://github.com/FlorianLeChat/Domego"
			}
		];

		if ( process.env.NODE_ENV === "production" )
		{
			// Ajout des redirections de test en production.
			redirects.push( {
				source: "/test/:path*",
				permanent: true,
				destination: "/"
			} );
		}

		// Application des redirections.
		return redirects;
	}
} );