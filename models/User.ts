//
// Modèle de données pour les utilisateurs.
//
import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema( {

	// Adresse électronique de l'utilisateur.
	email: {
		type: String,
		required: true,
		lowercase: true,
		validate: ( value: string ) =>
		{
			return validator.isEmail( value );
		}
	},

	// Identité de l'utilisateur.
	name: {
		first: String,
		last: String
	},

	// Âge de l'utilisateur.
	age: Number,

	// Date de création de l'utilisateur.
	createdAt: Date

} );

export default mongoose.models[ "User" ] || mongoose.model( "User", schema );