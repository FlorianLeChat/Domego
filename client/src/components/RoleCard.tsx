//
// Composant pour sélectionner un rôle avant de lancer la partie.
//
import { useTranslation } from "react-i18next";
import "./RoleSelection.scss";

export default function RoleSelection(): JSX.Element
{
	// Déclaration des constantes.
	const { t } = useTranslation();

	//
	const selectRole = ( event: React.MouseEvent<HTMLInputElement> ) =>
	{
		console.log( event );
	};

	//
	const readyToPlay = ( event: React.MouseEvent<HTMLInputElement> ) =>
	{
		console.log( event );
	};

	// Affichage du rendu HTML du composant.
	return (
		<article className="RoleCard">
			{/* Image représentative du rôle */}
			<img src="../../assets/images/jobs/maitre_ouvrage.jpg" alt={t( "pages.selection.project_owner_title" )} />

			{/* Utilisateur jouant ce rôle */}
			<span>El Presidente</span>

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
				<input type="checkbox" onClick={selectRole} />
				<label>{t( "pages.selection.check" )}</label>
			</div>

			<div>
				{/* Prêt à jouer */}
				<input type="checkbox" onClick={readyToPlay} />
				<label>{t( "pages.selection.ready" )}</label>
			</div>
		</article>
	);
}