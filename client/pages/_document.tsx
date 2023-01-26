import { Html, Main, NextScript } from "next/document";

export default function Document()
{
	return (
		<Html lang="fr" dir="auto" prefix="og: https://ogp.me/ns#">
			<head>
				{/* Méta-données du document */}
				<meta charSet="utf-8" />
				<meta name="author" content="%REACT_APP_AUTHOR%" />
				<meta name="description" content="%REACT_APP_DESCRIPTION%" />
				<meta name="keywords" lang="fr" content="%REACT_APP_TAGS%" />
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				<meta name="theme-color" content="#40a9ff" />

				<meta property="og:type" content="website" />
				<meta property="og:url" content="%REACT_APP_URL%" />
				<meta property="og:title" content="%REACT_APP_TITLE%" />
				<meta property="og:description" content="%REACT_APP_DESCRIPTION%" />
				<meta property="og:image" content="%REACT_APP_BANNER%" />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="%REACT_APP_URL%" />
				<meta property="twitter:title" content="%REACT_APP_TITLE%" />
				<meta property="twitter:description" content="%REACT_APP_DESCRIPTION%" />
				<meta property="twitter:image" content="%REACT_APP_BANNER%" />

				{/* Pré-connexion des ressources externes */}
				<link rel="preconnect" href="https://www.google.com" />
				<link rel="preconnect" href="https://www.gstatic.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://www.google-analytics.com" />

				{/* Polices de caractères */}
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" crossOrigin="anonymous" />

				{/* Titre du document */}
				<title>%REACT_APP_TITLE%</title>

				{/* Icônes et manifeste du document */}
				<link rel="icon" type="image/webp" sizes="16x16" href="%PUBLIC_URL%/assets/favicons/16x16.webp" />
				<link rel="icon" type="image/webp" sizes="32x32" href="%PUBLIC_URL%/assets/favicons/32x32.webp" />
				<link rel="icon" type="image/webp" sizes="48x48" href="%PUBLIC_URL%/assets/favicons/48x48.webp" />
				<link rel="icon" type="image/webp" sizes="192x192" href="%PUBLIC_URL%/assets/favicons/192x192.webp" />
				<link rel="icon" type="image/webp" sizes="512x512" href="%PUBLIC_URL%/assets/favicons/512x512.webp" />

				<link rel="apple-touch-icon" href="%PUBLIC_URL%/assets/favicons/180x180.webp" />
				<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
			</head>
			<body>
				<noscript>
					<h1>This website created with <a href="https://nextjs.org/">NextJS</a> requires JavaScript to run.</h1>
					<h2>Click <a href="https://www.whatismybrowser.com/detect/is-javascript-enabled">here</a> to be redirected to an external site to help you solve this issue.</h2>
				</noscript>

				<Main />

				<NextScript />
			</body>
		</Html>
	);
}