import { test, expect } from "@playwright/test";

//
// Permet d'accéder à la page d'accueil avant chaque test.
//
test.beforeEach( async ( { page } ) =>
{
	// Accès à la page d'accueil.
	await page.goto( "/" );
} );

//
// Permet de vérifier que le site est accessible et que les contenus sont bien présents.
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
// Permet de vérifier que le consentement des cookies fonctionne.
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
// Permet de vérifier qu'il est possible d'annuler la création d'une nouvelle partie.
//
test( "Annulation d'une nouvelle partie", async ( { page } ) =>
{
	// Remplissage d'un pseudonyme dans le champ de saisie.
	await page.getByPlaceholder( "Marc007" ).fill( "Marc007" );

	// Clic sur le bouton de création d'une nouvelle partie.
	await page.getByRole( "button", { name: "Create a new game" } ).click();

	// Clic sur le bouton pour annuler la création d'une nouvelle partie.
	await page.getByRole( "button", { name: "No" } ).click();

	// Vérification de l'URL de la page.
	await expect( page ).toHaveURL( "/" );
} );

//
// Permet de vérifier qu'il est possible de créer une nouvelle partie.
//
test( "Création d'une nouvelle partie", async ( { page } ) =>
{
	// Remplissage d'un pseudonyme dans le champ de saisie.
	await page.getByPlaceholder( "Marc007" ).fill( "Marc007" );

	// Clic sur le bouton de création d'une nouvelle partie.
	await page.getByRole( "button", { name: "Create a new game" } ).click();

	// Clic sur le bouton pour confirmer la création d'une nouvelle partie.
	await page.getByRole( "button", { name: "Yes" } ).click();

	// Vérification de l'URL de la page.
	await expect( page ).toHaveURL( "/game/selection" );
} );