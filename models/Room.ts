//
// Modèle de données pour les parties.
//
import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema( {

	// Nom du créateur de la partie.
	creatorName: {
		type: String,
		required: true,
		validate: ( value: string ) => validator.isEmail( value )
	},

	// Nombre de joueurs présents.
	playerCount: Number,

	// Date de création de la partie.
	createdAt: Date

} );

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default mongoose.models.Room || mongoose.model( "Room", schema );