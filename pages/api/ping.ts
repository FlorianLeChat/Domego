import type { NextApiRequest, NextApiResponse } from "next";

export default function handler( _request: NextApiRequest, result: NextApiResponse )
{
	result.status( 200 ).json( { name: "John Doe" } );
}