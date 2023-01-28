/**
 * @type {import("next-next").NextConfig}
 */
const path = require( "path" );
const { i18n } = require( "./next-i18next.config" );

module.exports = {
	i18n,
	basePath: "",
	poweredByHeader: false,
	reactStrictMode: true,
	sassOptions: {
		includePaths: [ path.join( __dirname, "styles" ) ],
	},
	async redirects()
	{
		return [
			{
				source: "/source",
				permanent: true,
				destination: "https://github.com/FlorianLeChat/Domego"
			},
		];
	},
};