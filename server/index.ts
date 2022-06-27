import cors from "cors";
import path from "path";
import express from "express";

// Création du serveur express.
const app = express();
const root = path.resolve( `${ __dirname }/../client/build` );

app.use( cors() );
app.use( express.static( root ) );

app.listen( 3001 );

// Création des routes de tests.
import birds from "./routes/birds";
import cats from "./routes/cats";
import json from "./routes/json";

app.use( "/birds", birds );
app.use( "/cats", cats );
app.use( "/json", json );

// Modification du contenu de certains fichiers.
import { readFileSync, writeFileSync } from "fs";

let index = readFileSync( `${ root }/index.html`, "utf8" );
index = index.replace( "INSERT_GITHUB_IMAGE_HERE", "this is a test" );

writeFileSync( `${ root }/index.html`, index );

// Affichage des fichiers statiques.
app.get( "/", function ( _request, result )
{
	result.sendFile( `${ root }/index.html` );
} );

// Interaction quelconque avec la base de données SQL.
app.get( "/database", function ( _request, _result )
{
	// TODO.
} );