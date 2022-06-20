import express from "express";

// Création du serveur express.
const PORT = process.env.PORT || 3001;
const app = express();

app.listen( PORT, function ()
{
	console.log( `Serveur lancé sur le port ${ PORT }` );
} );

// Création des routes de tests.
const birds = require( "./routes/birds" );
const cats = require( "./routes/cats" );
const json = require( "./routes/json" );

app.use( "/birds", birds );
app.use( "/cats", cats );
app.use( "/json", json );

// Interaction quelconque avec la base de données SQL.
app.get( "/database", function ( _request, _result )
{
	// TODO.
} );