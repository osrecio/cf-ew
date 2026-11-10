import { bindings, defineConfig, triggers } from "cf/config";

export default defineConfig({
	accountId: "e7c225f0114a669dceb086c8197fa3dd",
	worker: {
		name: "aem-cf-ew-worker",
		compatibilityDate: "2025-03-17",
		entrypoint: "src/index.mjs",
		workersDev: false,
		triggers: [
			triggers.fetch({
				pattern: "cf-ew.osrecio.com/*",
				zone: "osrecio.com",
			}),
		],
		env: {
			ORIGIN_HOSTNAME: bindings.text("main--cf-ew--osrecio.aem.live"),
		},
	},
});
