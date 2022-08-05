//
// Composant pour afficher un tableau de l'ensemble des parties en cours.
//
import { useParams } from "react-router-dom";
import "./RoleSelection.scss";

export default function RoleSelection(): JSX.Element
{
	// Récupération des paramètres.
	const { roomid } = useParams();

	// Affichage du rendu HTML du composant.
	return (
		<section id="RoleSelection">
			{/* Titre de la page */}
			<h1>Choisissez votre rôle</h1>

			<div>
				{/* Conteneur de la liste des rôles */}
				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/maitre_ouvrage.jpg" alt="Maître d'ouvrage" />

					<div>
						{/* Nom du rôle */}
						<h2>Maître d'ouvrage</h2>

						{/* Description du rôle */}
						<p>
							Le maître d'ouvrage est la personne pour laquelle est réalisée l'ouvrage.
							Il est le porteur du projet, il définit l'objectif du projet, son calendrier et le budget.
							Le résultat attendu du projet est la réalisation et la livraison d'un résultat, appelé l'ouvrage.
						</p>

						{/* Budget à disposition */}
						<span>150K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>Choisir ce rôle</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/architecte.png" alt="Maître d'œuvre" />

					<div>
						{/* Nom du rôle */}
						<h2>Maître d'œuvre (Architecte)</h2>

						{/* Description du rôle */}
						<p>
							Le maître d'œuvre (souvent l'architecte) est le chef de projet de construction, la personne physique ou morale qui dirige et vérifie la bonne exécution des travaux.
							En tant qu'architecte, il doit aussi concevoir le projet en répondant aux exigences du maître d'ouvrage.
						</p>

						{/* Budget à disposition */}
						<span>30K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>Choisir ce rôle</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/bureau_etude.png" alt="Bureau d'études" />

					<div>
						{/* Nom du rôle */}
						<h2>Bureau d'études</h2>

						{/* Description du rôle */}
						<p>
							Le bureau d'études doit assister l'architecte sur les spécificités techniques qui relèvent de sa compétence.
							Ils assurent des études techniques spécifiques : étude de la structure, étude de sol, étude thermique, étude acoustique, étude des réseaux...
						</p>

						{/* Budget à disposition */}
						<span>20K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>Choisir ce rôle</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/bureau_de_controle.jpg" alt="Bureau de contrôle" />

					<div>
						{/* Nom du rôle */}
						<h2>Bureau de contrôle</h2>

						{/* Description du rôle */}
						<p>
							Le bureau de contrôle juge de la solidité de l'ouvrage et vérifie le respect des normes et des règles de construction - appelées souvent « règles de l'art ».
							Il a une responsabilité juridique vis-à-vis du respect des différentes normes et réglementations.
						</p>

						{/* Budget à disposition */}
						<span>20K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>Choisir ce rôle</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/entreprise_corps_etat_secondaire.png" alt="Entreprise corps état secondaire" />

					<div>
						{/* Nom du rôle */}
						<h2>Entreprise corps état secondaire</h2>

						{/* Description du rôle */}
						<p>
							Leur rôle est de construire tout ce qui n'est pas assuré par le gros œuvre.
							Il s'agit des cloisons et plâtrerie, de la peinture, de l'électricité, de la ventilation, des menuiseries, des revêtement de sol, de la plomberie...
						</p>

						{/* Budget à disposition */}
						<span>30K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>Choisir ce rôle</label>
					</div>
				</article>

				<article>
					{/* Image représentative du rôle */}
					<img src="../../assets/images/jobs/entreprise_gros_oeuvre.png" alt="Entreprise gros œuvre" />

					<div>
						{/* Nom du rôle */}
						<h2>Entreprise gros œuvre</h2>

						{/* Description du rôle */}
						<p>
							Ces entreprises ont pour but de bâtir l'ossature de l'ouvrage.
							Cela comprend les fondations, les poutres, les poteaux, les murs, la charpente, le dallage...
							Ils ont aussi souvent en charge les installations de chantier et le terrassement.
						</p>

						{/* Budget à disposition */}
						<span>30K</span>
					</div>

					<div>
						{/* Sélection du rôle */}
						<input type="checkbox" />
						<label>Choisir ce rôle</label>
					</div>
				</article>
			</div>

			{/* Bouton de lancement de la partie */}
			<button type="button">Démarrer la partie</button>
		</section>
	);
}