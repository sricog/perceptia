import { defineConfig } from "cf/config";

// Sitio estático de Astro servido como Worker de solo assets.
// Build: `astro build` → ./dist ; Deploy: `cf deploy ./dist`
export default defineConfig({
	worker: {
		name: "perceptia",
		compatibilityDate: "2026-11-21",
		assets: {
			htmlHandling: "auto-trailing-slash",
			notFoundHandling: "404-page",
		},
		domains: ["perceptiastudio.com", "www.perceptiastudio.com"],
		observability: { enabled: true },
	},
});
