// Paramètres personnalisés pour le typage de i18next.
import "i18next";

declare module "i18next"
{
	interface CustomTypeOptions
	{
		defaultNS: "common";
		resources: I18nNamespaces;
		returnNull: false;
		returnEmptyString: false;
	}
}