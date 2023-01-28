// Importation des fichiers de configuration.
import i18nextConfig from "@/next-i18next.config";

// Importation des dépendances.
import { Html, Main, Head, NextScript } from "next/document";

// Importation des types.
import type { DocumentProps } from "next/document";

export default function Document( props: DocumentProps )
{
	// Génération de la structure HTML.
	return (
		<Html lang={props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale} dir="auto" prefix="og: https://ogp.me/ns#">
			<Head>
				{/* Pré-connexion des ressources externes */}
				<link rel="preconnect" href="https://www.google.com" />
				<link rel="preconnect" href="https://www.gstatic.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://www.google-analytics.com" />

				{/* Polices de caractères */}
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" crossOrigin="anonymous" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}