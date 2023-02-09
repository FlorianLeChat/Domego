//
// Route vers la page de la perte de connexion entre le client et le serveur.
//
import Error from "next/error";

export default function Offline()
{
	return <Error statusCode={503} title="Service Unavailable" />;
}