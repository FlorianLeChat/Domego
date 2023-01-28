/** @type {import("next").NextConfig} */
const path = require( "path" );

module.exports = {
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