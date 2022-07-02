import cors from "cors";
import path from "path";
import express from "express";

// Création du serveur express.
const app = express();
const root = path.resolve( `${ __dirname }/../client/build` );

app.use( cors() );
app.use( express.json() );
app.use( express.static( root ) );

app.listen( 3001 );

// Création des routes de tests.
import json from "./routes/json";
import database from "./routes/database";

app.use( "/api/json", json );
app.use( "/api/database", database );

// Affichage par défaut des fichiers statiques.
app.get( "*", function ( _request, result, _next )
{
	result.sendFile( `${ root }/index.html` );
} );

// Envoi d'un message d'erreur sur les routes manquantes.
app.use( function ( _request, result, _next )
{
	result.sendStatus( 404 );
} );