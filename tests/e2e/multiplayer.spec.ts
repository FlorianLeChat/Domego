import { test, expect } from "@playwright/test";

//
// Permet de vérifier qu'il est possible de rejoindre une partie existante.
//
test( "Connexion à une partie existante", async ( { browser } ) =>
{
	// Création de deux contextes de navigateur.
	const player1Context = await browser.newContext();
	const player2Context = await browser.newContext();

	const player1Page = await player1Context.newPage();
	const player2Page = await player2Context.newPage();

	// Accès à la page d'accueil.
	await player1Page.goto( "/" );
	await player2Page.goto( "/" );

	// Création d'une nouvelle partie par le joueur 1.
	await player1Page.getByPlaceholder( "Marc007" ).fill( "Player 1" );
	await player1Page.getByRole( "button", { name: "Create a new game" } ).click();
	await player1Page.getByRole( "button", { name: "Yes" } ).click();

	// Choix du rôle pour le joueur 1.
	await expect( player1Page ).toHaveURL( "/game/selection" );
	await player1Page.getByText( "Choose this role" ).first().click();

	// Connexion à la partie par le joueur 2.
	await player2Page.getByPlaceholder( "Marc007" ).fill( "Player 2" );
	await player2Page.getByRole( "button", { name: "Join" } ).last().click();
	await player2Page.getByRole( "button", { name: "Yes" } ).click();

	// Vérification du rôle du joueur 1 par le joueur 2.
	await expect( player2Page ).toHaveURL( "/game/selection" );
	await expect( player2Page.getByText( "Player 1" ).first() ).toBeVisible();

	// Choix du rôle pour le joueur 2.
	await player2Page.getByText( "Choose this role" ).last().check();

	// Vérification du rôle du joueur 2 par le joueur 1.
	await expect( player1Page.getByText( "Player 2" ).first() ).toBeVisible();
} );

//
// Permet de vérifier qu'il est impossible de choisir un pseudonyme déjà utilisé
//  dans une partie existante.
//
test( "Pseudonyme déjà utilisé", async ( { browser } ) =>
{
	// Création de deux contextes de navigateur.
	const player1Context = await browser.newContext();
	const player2Context = await browser.newContext();

	const player1Page = await player1Context.newPage();
	const player2Page = await player2Context.newPage();

	// Accès à la page d'accueil.
	await player1Page.goto( "/" );
	await player2Page.goto( "/" );

	// Création d'une nouvelle partie par le joueur 1.
	await player1Page.getByPlaceholder( "Marc007" ).fill( "Player 1" );
	await player1Page.getByRole( "button", { name: "Create a new game" } ).click();
	await player1Page.getByRole( "button", { name: "Yes" } ).click();

	await expect( player1Page ).toHaveURL( "/game/selection" );

	// Connexion à la partie par le joueur 2.
	await player2Page.getByPlaceholder( "Marc007" ).fill( "Player 1" );
	await player2Page.getByRole( "button", { name: "Join" } ).last().click();
	await player2Page.getByRole( "button", { name: "Yes" } ).click();

	// Vérification du message d'erreur par le serveur.
	await expect( player2Page ).toHaveURL( "/" );
	await expect( player2Page.getByRole( "dialog", { name: "Duplicated username" } ) ).toBeVisible();
} );

//
// Permet de vérifier qu'il est impossible de créer une partie si une partie
//  est déjà en cours.
//
test( "Partie encore active", async ( { page } ) =>
{
	// Accès à la page d'accueil.
	await page.goto( "/" );

	// Création d'une nouvelle partie.
	await page.getByPlaceholder( "Marc007" ).fill( "Player 1" );
	await page.getByRole( "button", { name: "Create a new game" } ).click();
	await page.getByRole( "button", { name: "Yes" } ).click();

	await expect( page ).toHaveURL( "/game/selection" );

	// Retour à la page d'accueil.
	await page.goBack();

	// Création d'une nouvelle partie (encore).
	await page.getByPlaceholder( "Marc007" ).fill( "Player 1" );
	await page.getByRole( "button", { name: "Create a new game" } ).click();
	await page.getByRole( "button", { name: "Yes" } ).click();

	// Vérification du message d'erreur par le serveur.
	await expect( page ).toHaveURL( "/" );
	await expect( page.getByRole( "dialog", { name: "Data duplication" } ) ).toBeVisible();
} );

//
// Permet de vérifier qu'il est possible de se reconnecter à une partie
//  existante à la volée.
//
test( "Reconnexion à la volée", async ( { page } ) =>
{
	// Accès à la page d'accueil.
	await page.goto( "/" );

	// Création d'une nouvelle partie.
	await page.getByPlaceholder( "Marc007" ).fill( "Player 1" );
	await page.getByRole( "button", { name: "Create a new game" } ).click();
	await page.getByRole( "button", { name: "Yes" } ).click();

	await expect( page ).toHaveURL( "/game/selection" );

	// Retour à la page d'accueil.
	await page.goBack();

	// Reconnexion à la partie.
	await page.getByPlaceholder( "Marc007" ).fill( "Player 1" );
	await page.getByRole( "button", { name: "Join" } ).last().click();
	await page.getByRole( "button", { name: "Yes" } ).click();

	// Vérification de la redirection vers la page de sélection de rôle.
	await expect( page ).toHaveURL( "/game/selection" );
} );