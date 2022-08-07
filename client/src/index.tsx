// Importation de la feuille de style CSS.
import "./index.scss";

// Importation des fichiers de configuration.
import "./i18n/config";

// Importation de React et de ses dépendances.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importation des composants React.
import TestApi from "./components/TestApi";
import GameHome from "./components/GameHome";
import GameChat from "./components/GameChat";
import NotFound from "./components/NotFound";
import RoleSelection from "./components/RoleSelection";

// Importation des fonctions utilitaires.
import { SocketProvider } from "./utils/SocketContext";

// Gestion des routes vers les pages du site.
const root = createRoot( document.querySelector( "body > main" ) as Element );
root.render(
	<StrictMode>
		<SocketProvider>
			<GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_CAPTCHA_PUBLIC_KEY ?? ""}>
				<BrowserRouter basename={process.env.PUBLIC_URL}>
					<Routes>
						<Route path="/">
							{/* Page d'accueil */}
							<Route index element={<GameHome />} />

							{/* Page non trouvée. */}
							<Route path="*" element={<NotFound />} />

							{/* Chat de test pour chaque partie. */}
							<Route path="game/:roomId/chat" element={<GameChat />} />

							{/* Page de sélection des rôles avant chaque partie. */}
							<Route path="game/:roomId/selection" element={<RoleSelection />} />

							{/* Tableau de contrôle durant une partie en cours. */}
							<Route path="game/:roomId/dashboard" element={<GameHome />} />

							{/* Page de test des requêtes via MongoDB */}
							<Route path="database" element={<TestApi />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</GoogleReCaptchaProvider>
		</SocketProvider>
	</StrictMode>
);