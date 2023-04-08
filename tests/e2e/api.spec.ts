import { test, expect } from "@playwright/test";

//
// Permet de vérifier la bonne exécution du serveur Socket.IO.
//
test( "Connexion au serveur Socket.IO", async ( { request } ) =>
{
	const response = await request.get( "/api/socket" );

	expect( response.ok() ).toBeTruthy();
} );

//
// Permet de vérifier les requêtes de type GET à l'API MongoDB.
//
test( "Requête de type GET à l'API", async ( { request } ) =>
{
	const response = await request.get( "/api/users" );

	expect( response.ok() ).toBeTruthy();
} );

//
// Permet de vérifier les requêtes de type POST à l'API MongoDB.
//
test( "Requête de type POST à l'API", async ( { request } ) =>
{
	const response = await request.post( "/api/users", {
		params: {
			email: "florian@gmail.com",
			name: "{\"first\":\"Florian\",\"last\":\"Trayon\"}",
			age: Math.floor( Math.random() * 100 ) + 1
		}
	} );

	expect( response.ok() ).toBeTruthy();
} );

//
// Permet de vérifier les requêtes de type PUT à l'API MongoDB.
//
test( "Requête de type PUT à l'API", async ( { request } ) =>
{
	const response = await request.put( "/api/users", {
		params: {
			email: "florian@gmail.com",
			name: "{\"filter\":{\"email\":\"florian@gmail.com\",\"age\":{\"$not\":{\"$eq\":10}}},\"update\":{\"age\":10}}",
			age: Math.floor( Math.random() * 100 ) + 1
		}
	} );

	expect( response.ok() ).toBeTruthy();
} );

//
// Permet de vérifier les requêtes de type DELETE à l'API MongoDB.
//
test( "Requête de type DELETE à l'API", async ( { request } ) =>
{
	const response = await request.delete( "/api/users", {
		params: {
			email: "florian@gmail.com",
			name: "{\"age\":10}",
			age: Math.floor( Math.random() * 100 ) + 1
		}
	} );

	expect( response.ok() ).toBeTruthy();
} );