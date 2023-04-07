//
// Modèle de données pour les utilisateurs.
//
import validator from "validator";
import { Schema } from "mongoose";

const UserSchema = new Schema( {

	// Adresse électronique de l'utilisateur.
	email: {
		type: String,
		required: true,
		lowercase: true,
		validate: ( value: string ) => validator.isEmail( value )
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

export default UserSchema;