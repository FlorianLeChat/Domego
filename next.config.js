// @ts-check

/**
 * @type {import("next").NextConfig}
 */
const { i18n } = require("./next-i18next.config");
const basePath = new URL(process.env.NEXT_PUBLIC_URL ?? "").pathname;

module.exports = {
	i18n,
	basePath:
		basePath === "/"
			? ""
			: basePath.endsWith("/")
			? basePath.slice(0, -1)
			: basePath,
	poweredByHeader: false,
};