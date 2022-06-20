import express from "express";
const router = express.Router();

router.get( "/", function ( _request, result )
{
	result.send( "Page d'accueil des chats." );
} );

router.get( "/about", function ( _request, result )
{
	result.send( "Page à propos des chats." );
} );

module.exports = router;