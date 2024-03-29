//
// Page utilisée pour générer le contenu dynamique HTML de la page.
//  Source : https://nextjs.org/docs/advanced-features/custom-document
//

// Importation des dépendances.
import { join } from "path";
import { Html, Main, Head, NextScript } from "next/document";

// Importation des types.
import type { DocumentProps } from "next/document";

export default function Document( { __NEXT_DATA__ }: DocumentProps )
{
	// Déclaration des constantes.
	const websiteUrl = join( process.env.NEXT_PUBLIC_URL ?? "", __NEXT_DATA__.page );

	// Affichage du rendu HTML de la page.
	return (
		<Html lang={__NEXT_DATA__.locale} prefix="og: https://ogp.me/ns#">
			<Head>
				{/* Informations pour les moteurs de recherche */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content={websiteUrl} />
				<meta property="og:locale" content={__NEXT_DATA__.locale} />
				<meta property="og:title" content={process.env.NEXT_PUBLIC_TITLE} />
				<meta property="og:description" content={process.env.NEXT_PUBLIC_DESCRIPTION} />
				<meta property="og:image" content={process.env.NEXT_PUBLIC_BANNER} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content={websiteUrl} />
				<meta property="twitter:title" content={process.env.NEXT_PUBLIC_TITLE} />
				<meta property="twitter:description" content={process.env.NEXT_PUBLIC_DESCRIPTION} />
				<meta property="twitter:image" content={process.env.NEXT_PUBLIC_BANNER} />
				<meta property="twitter:creator" content={process.env.NEXT_PUBLIC_TWITTER} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}