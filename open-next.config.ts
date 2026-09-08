import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
	...defineCloudflareConfig({
		incrementalCache: "dummy",
		tagCache: "dummy",
		queue: "dummy",
	}),
	buildCommand: "bun run build:next",
};
