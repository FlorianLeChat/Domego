// Importation de la feuille de style CSS.
import "@/styles/_global.scss";

// Importation des fichiers de configuration.
import "@/config/translations";

// Importation des composants.
import type { AppProps } from "next/app";

export default function Domego( { Component, pageProps }: AppProps )
{
	return <Component {...pageProps} />;
}