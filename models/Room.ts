//
// Modèle de données pour les parties.
//
import validator from "validator";
import { Schema } from "mongoose";

const RoomSchema = new Schema( {

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

export default RoomSchema;