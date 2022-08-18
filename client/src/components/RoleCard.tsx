//
// Composant d'affichage pour la carte d'un rôle.
//
import { useTranslation } from "react-i18next";
import "./RoleCard.scss";

interface RoleCardProps
{
	// Déclaration des champs des propriétés du composant.
	name: string;
	budget: string;
}

export default function RoleCard( props: RoleCardProps ): JSX.Element
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
			<img src={`../../assets/images/jobs/${ props.name }.webp`} alt={t( `pages.selection.${ props.name }_title` )} />

			{/* Utilisateur jouant ce rôle */}
			<span>Prénom Nom</span>

			<div>
				{/* Nom du rôle */}
				<h2>{t( `pages.selection.${ props.name }_title` )}</h2>

				{/* Description du rôle */}
				<p>{t( `pages.selection.${ props.name }_description` )}</p>

				{/* Budget à disposition */}
				<span>{props.budget}</span>
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