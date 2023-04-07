// Types pour le cache de connexion à la base de données MongoDB.
// Source : https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html
import mongoose from "mongoose";

export const conn: mongoose.Mongoose | undefined;
export const promise: Promise<mongoose.Mongoose> | undefined;
export as namespace mongoose;