// Importation de l'ensemble des modules de traduction.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importation des traductions.
import english from "../i18n/english.json";
import french from "../i18n/french.json";

// Initialisation du module des traductions.
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