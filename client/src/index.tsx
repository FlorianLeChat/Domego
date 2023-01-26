// Importation de la feuille de style CSS.
import "./index.scss";

// Importation des fichiers de configuration.
import "./config/translations";

// Importation de React et de ses dépendances.
import { createRoot } from "react-dom/client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { StrictMode, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "next/link";

// Importation des fonctions utilitaires.
import { SocketProvider } from "./utils/SocketContext";

// Importation des composants React.
const TestApi = lazy( () => import( "./components/TestApi" ) );
const GameHome = lazy( () => import( "./components/GameHome" ) );
const GameChat = lazy( () => import( "./components/GameChat" ) );
const NotFound = lazy( () => import( "./components/NotFound" ) );
const GameBoard = lazy( () => import( "./components/GameBoard" ) );
const RoleSelection = lazy( () => import( "./components/RoleSelection" ) );

// Gestion des routes vers les pages du site.
const root = createRoot( document.querySelector( "body > main" ) as Element );
root.render(
	<StrictMode>
		<SocketProvider>
			<GoogleReCaptchaProvider reCaptchaKey={process.env[ "NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY" ] ?? ""}>
				<BrowserRouter basename={process.env[ "PUBLIC_URL" ]}>
					<Suspense fallback={<span className="loading">🏗️ {process.env[ "NEXT_PUBLIC_TITLE" ]}</span>}>
						<Routes>
							<Route path="/">
								{/* Page d'accueil */}
								<Route index element={<GameHome />} />

								{/* Page non trouvée. */}
								<Route path="*" element={<NotFound />} />

								{/* Communications textuelles pour une partie. */}
								<Route path="game/chat" element={<GameChat />} />

								{/* Page de sélection des rôles avant chaque partie. */}
								<Route path="game/selection" element={<RoleSelection />} />

								{/* Tableau de contrôle durant une partie en cours. */}
								<Route path="game/board" element={<GameBoard />} />

								{/* Page de test des requêtes via MongoDB */}
								<Route path="test/database" element={<TestApi />} />
							</Route>
						</Routes>
					</Suspense>
				</BrowserRouter>
			</GoogleReCaptchaProvider>
		</SocketProvider>
	</StrictMode>
);