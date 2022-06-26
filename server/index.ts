import cors from "cors";
import path from "path";
import express from "express";

// Création du serveur express.
const app = express();
const port = 3001;

app.use( cors() );
app.use( express.static( path.resolve( `${ __dirname }/../client/build` ) ) );

app.listen( port, function ()
{
	console.log( `Serveur lancé sur le port ${ port }` );
} );

// Création des routes de tests.
import birds from "./routes/birds";
import cats from "./routes/cats";
import json from "./routes/json";

app.use( "/birds", birds );
app.use( "/cats", cats );
app.use( "/json", json );

// Affichage des fichiers statiques.
app.get( "/", function ( _request, result )
{
	result.sendFile( path.resolve( `${ __dirname }/../client/build/index.html` ) );
} );

// Interaction quelconque avec la base de données SQL.
app.get( "/database", function ( _request, _result )
{
	// TODO.
} );