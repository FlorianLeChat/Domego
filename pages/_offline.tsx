//
// Route utilisée lorsqu'un utilisateur devient hors-ligne.
//
import Error from "next/error";

export default function Offline()
{
	return <Error statusCode={503} title="Service Unavailable" />;
}