// Importation de l'ensemble des modules de traduction.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importation des traductions.
import english from "./en.json";
import french from "./fr.json";

// Initialisation du module de traduction.
i18n.use( initReactI18next ).init( {
	lng: navigator.language,
	fallbackLng: "en",
	resources: {
		en: { translation: english },
		fr: { translation: french }
	},
	interpolation: {
		escapeValue: false,
	}
} );