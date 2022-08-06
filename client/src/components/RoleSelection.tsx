//
// Composant pour afficher un tableau de l'ensemble des parties en cours.
//
import { useParams } from "react-router-dom";
import { SocketContext } from "../utils/SocketContext";
import { useTranslation } from "react-i18next";
import { useEffect, useContext } from "react";

import "./RoleSelection.scss";

export default function RoleSelection(): JSX.Element
{
	// Récupération des paramètres.
	const { roomId } = useParams();

	// Déclaration des constantes.
	const { t } = useTranslation();
	const socket = useContext( SocketContext );

	// Affichage du rendu HTML du composant.
	return (
		<section id="RoleSelection">
			{/* Titre de la page */}
			<h1>{t( "pages.selection.title" )}</h1>

			<div>
				{/* Conteneur de la liste des rôles */}
				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/maitre_ouvrage.jpg" alt={t( "pages.selection.project_owner_title" )} />

					<div>
						{/* Nom du rôle */}
						<h2>{t( "pages.selection.project_owner_title" )}</h2>

						{/* Description du rôle */}
						<p>{t( "pages.selection.project_owner_description" )}</p>

						{/* Budget à disposition */}
						<span>150K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>{t( "pages.selection.check" )}</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/architecte.png" alt={t( "pages.selection.architect_title" )} />

					<div>
						{/* Nom du rôle */}
						<h2>{t( "pages.selection.architect_title" )}</h2>

						{/* Description du rôle */}
						<p>{t( "pages.selection.architect_description" )}</p>

						{/* Budget à disposition */}
						<span>30K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>{t( "pages.selection.check" )}</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/bureau_etude.png" alt={t( "pages.selection.engineering_office_title" )} />

					<div>
						{/* Nom du rôle */}
						<h2>{t( "pages.selection.engineering_office_title" )}</h2>

						{/* Description du rôle */}
						<p>{t( "pages.selection.engineering_office_description" )}</p>

						{/* Budget à disposition */}
						<span>20K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>{t( "pages.selection.check" )}</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/bureau_de_controle.jpg" alt={t( "pages.selection.control_office_title" )} />

					<div>
						{/* Nom du rôle */}
						<h2>{t( "pages.selection.control_office_title" )}</h2>

						{/* Description du rôle */}
						<p>{t( "pages.selection.control_office_description" )}</p>

						{/* Budget à disposition */}
						<span>20K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>{t( "pages.selection.check" )}</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/entreprise_corps_etat_secondaire.png" alt={t( "pages.selection.secondary_state_title" )} />

					<div>
						{/* Nom du rôle */}
						<h2>{t( "pages.selection.secondary_state_title" )}</h2>

						{/* Description du rôle */}
						<p>{t( "pages.selection.secondary_state_description" )}</p>

						{/* Budget à disposition */}
						<span>30K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>{t( "pages.selection.check" )}</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/entreprise_gros_oeuvre.png" alt={t( "pages.selection.general_construction_title" )} />

					<div>
						{/* Nom du rôle */}
						<h2>{t( "pages.selection.general_construction_title" )}</h2>

						{/* Description du rôle */}
						<p>{t( "pages.selection.general_construction_description" )}</p>

						{/* Budget à disposition */}
						<span>30K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>{t( "pages.selection.check" )}</label>
					</div>
				</article>
			</div>

			{/* Bouton de lancement de la partie */}
			<button type="button">{t( "pages.selection.launch" )}</button>
		</section>
	);
}