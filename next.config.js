// @ts-check

/**
 * @type {import("next").NextConfig}
 */
const { i18n } = require( "./next-i18next.config" );
const { withSentryConfig } = require( "@sentry/nextjs" );

const basePath = new URL( process.env.NEXT_PUBLIC_URL ?? "" ).pathname;
const nextConfig = {
	i18n,
	poweredByHeader: false,
	basePath: basePath === "/" ? "" : basePath.endsWith("/") ? basePath.slice(0, -1) : basePath,
	sentry: {
		tunnelRoute: "/monitoring",
		disableLogger: true,
		hideSourceMaps: true,
		widenClientFileUpload: true
	}
};

const sentryConfig = {
	org: process.env.SENTRY_ORG,
	silent: true,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN
};

module.exports = process.env.SENTRY_ENABLED === "true" ? withSentryConfig( nextConfig, sentryConfig ) : nextConfig;