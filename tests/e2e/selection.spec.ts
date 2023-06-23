import { test, expect } from "@playwright/test";

//
// Création d'une nouvelle partie avant chaque test.
//
test.beforeEach( async ( { page } ) =>
{
	// Accès à la page d'accueil.
	await page.goto( "/" );

	// Remplissage d'un pseudonyme dans le champ de saisie.
	await page.getByPlaceholder( "Marc007" ).fill( "Marc007" );

	// Clic sur le bouton de création d'une nouvelle partie.
	await page.getByRole( "button", { name: "Create a new game" } ).click();

	// Clic sur le bouton pour confirmer la création d'une nouvelle partie.
	await page.getByRole( "button", { name: "Yes" } ).click();

	// Vérification du titre de la page.
	await expect( page.getByRole( "heading", { name: "Choose your role" } ) ).toBeVisible();

	// Vérification de l'URL de la page.
	await expect( page ).toHaveURL( "/game/selection" );
} );

//
// Vérification de la prise et la confirmation d'un rôle.
//
test( "Sélection d'un rôle", async ( { page } ) =>
{
	// Clic sur le bouton pour prendre un rôle quelconque.
	await page.getByRole( "checkbox", { name: "Choose this role" } ).click();

	// Clic sur le bouton pour confirmer la prise du rôle.
	await page.getByRole( "checkbox", { name: "I'm ready!" } ).click();

	// Vérification de la confirmation de la prise du rôle.
	await expect( page.getByText( "Marc007", { exact: true } ) ).toBeVisible();
} );

//
// Vérification de la capacité à envoyer un message dans le chat.
//
test( "Utilisation du chat", async ( { page } ) =>
{
	// Remplissage d'un message dans le champ de saisie.
	await page.getByPlaceholder( "Lorem ipsum dolor sit amet..." ).fill( "Bonjour" );

	// Clic sur le bouton pour envoyer le message.
	await page.getByRole( "button", { name: "Send" } ).click();

	// Vérification de l'envoi du message.
	await expect( page.getByText( "Bonjour" ).first() ).toBeVisible();
} );