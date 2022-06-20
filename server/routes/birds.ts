import express from "express";

const router = express.Router();

router.get( "/", function ( _request, result )
{
	result.send( "Page d'accueil des oiseaux." );
} );

router.get( "/about", function ( _request, result )
{
	result.send( "Page à propos des oiseaux." );
} );

export default router;