import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = {
	...defineCloudflareConfig({
		incrementalCache: "dummy",
		tagCache: "dummy",
		queue: "dummy",
	}),
	buildCommand: "bun run build:next",
};

export default config;
