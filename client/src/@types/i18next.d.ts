// Paramètres personnalisés pour le typage de i18next.
import "i18next";

declare module "i18next"
{
	interface CustomTypeOptions
	{
		returnNull: false;
	}
}