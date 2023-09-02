import { join } from "path";
import { PlaywrightTestConfig, defineConfig, devices } from "@playwright/test";

const port = process.env.PORT ?? 3000;
const baseURL = `http://localhost:${ port }`;

export default defineConfig(
	{
		use: {
			baseURL,
			trace: process.env.CI ? "off" : "on-first-retry",
			video: process.env.CI ? "off" : "on-first-retry"
		},
		expect: { timeout: 10000 },
		workers: 1,
		retries: process.env.CI ? 2 : 0,
		testDir: join( __dirname, "tests/e2e" ),
		reporter: process.env.CI ? "github" : "html",
		outputDir: "test-results/",
		webServer: {
			port,
			command: "next start",
			reuseExistingServer: !process.env.CI
		},
		projects: [
			{
				name: "Google Chrome",
				use: {
					...devices[ "Desktop Chrome" ]
				}
			},
			{
				name: "Microsoft Edge",
				use: {
					...devices[ "Desktop Edge" ]
				}
			},
			{
				name: "Mobile Chrome",
				use: {
					...devices[ "Pixel 5" ]
				}
			}
		]
	} as PlaywrightTestConfig
);