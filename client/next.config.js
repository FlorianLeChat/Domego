/** @type {import("next").NextConfig} */
const path = require( "path" );

module.exports = {
	basePath: "",
	reactStrictMode: true,
	sassOptions: {
		includePaths: [ path.join( __dirname, "styles" ) ],
	}
};