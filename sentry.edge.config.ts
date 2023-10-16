import { init } from "@sentry/nextjs";

if ( process.env.SENTRY_ENABLED === "true" )
{
	init( {
		dsn: process.env.SENTRY_DSN,
		debug: false,
		tracesSampleRate: 1
	} );
}