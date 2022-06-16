const express = require( "express" );

const PORT = process.env.PORT || 3001;
const app = express();

app.get( "/api", function ( _request, result )
{
	result.json( { message: "Ecriture depuis le serveur..." } );
} );

app.listen( PORT, function ()
{
	console.log( `Serveur lancé sur le port ${ PORT }` );
} );