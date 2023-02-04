// @ts-check

/**
 * @type {import("next").NextConfig}
 */
const path = require( "path" );
const { i18n } = require( "./next-i18next.config" );
const withPWA = require( "next-pwa" )( {
	dest: "public",
	disable: process.env.NODE_ENV === "development",
} );

module.exports = withPWA( {
	i18n,
	basePath: "",
	poweredByHeader: false,
	reactStrictMode: true,
	sassOptions: {
		includePaths: [ path.join( __dirname, "styles" ) ],
	},
	async redirects()
	{
		// Définition des redirections de base.
		let redirects = [
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