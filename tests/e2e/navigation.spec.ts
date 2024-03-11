import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

//
// Accès à la page d'accueil avant chaque test.
//
test.beforeEach( async ( { page } ) =>
{
	// Accès à la page d'accueil.
	await page.goto( "/" );
} );

//
// Vérification de l'accessibilité du site et des contenus associés.
//
test( "Vérification de certains contenus", async ( { page } ) =>
{
	// Vérification du titre de la page.
	await expect( page ).toHaveTitle( "Domego" );

	// Vérification du titre principal.
	await expect( page.getByRole( "heading", { name: "Domego" } ) ).toBeVisible();

	// Vérification du sous-titre.
	await expect( page.getByText( "A serious educational game" ) ).toBeVisible();
} );

//
// Vérification de l'affichage du consentement des cookies.
//
test( "Affichage du consentement des cookies", async ( { page } ) =>
{
	// Clic sur le bouton du consentement des cookies.
	await page.getByRole( "link", { name: "manage your preferences" } ).click();

	// Sauvegarde des préférences actuelles.
	await page.getByRole( "button", { name: "Save preferences" } ).click();

	// Vérification de la page actuelle.
	await expect( page ).toHaveURL( "/" );
} );

//
// Vérification de l'annulation de la création d'une nouvelle partie.
//
test( "Annulation d'une nouvelle partie", async ( { page } ) =>
{
	// Remplissage d'un pseudonyme dans le champ de saisie.
	await page.getByPlaceholder( "Marc007" ).fill( faker.internet.displayName() );

	// Clic sur le bouton de création d'une nouvelle partie.
	await page.getByRole( "button", { name: "Create a new game" } ).click();

	// Clic sur le bouton pour annuler la création d'une nouvelle partie.
	await page.getByRole( "button", { name: "No" } ).click();

	// Vérification de l'URL de la page.
	await expect( page ).toHaveURL( "/" );
} );

//
// Vérification de la possibilité de créer une nouvelle partie.
//
test( "Création d'une nouvelle partie", async ( { page } ) =>
{
	// Remplissage d'un pseudonyme dans le champ de saisie.
	await page.getByPlaceholder( "Marc007" ).fill( faker.internet.displayName() );

	// Clic sur le bouton de création d'une nouvelle partie.
	await page.getByRole( "button", { name: "Create a new game" } ).click();

	// Clic sur le bouton pour confirmer la création d'une nouvelle partie.
	await page.getByRole( "button", { name: "Yes" } ).click();

	// Vérification de l'URL de la page.
	await expect( page ).toHaveURL( "/game/selection" );
} );