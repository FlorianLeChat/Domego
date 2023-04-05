//
// Composant d'architecture générale du site.
//

// Importation des dépendances.
import { ReactNode } from "react";

// Importation des fonctions utilitaires.
import { SocketProvider } from "@/utils/SocketContext";

export default function Layout( { children }: { children: ReactNode; } )
{
	// Affichage du rendu HTML du composant.
	return (
		<>
			{/* Utilisation du contexte des sockets */}
			<SocketProvider>
				{/* Affichage du composant enfant */}
				<main>
					{children}
				</main>
			</SocketProvider>
		</>
	);
}