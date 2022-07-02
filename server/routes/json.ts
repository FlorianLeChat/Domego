//
// Route fournissant des données sous format JSON.
//
import express from "express";

const router = express.Router();

router.get( "/", function ( _request, result )
{
	result.json( { message: "Données JSON depuis le serveur..." } );
} );

export default router;