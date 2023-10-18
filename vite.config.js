import { defineConfig } from "vite";
import { resolve } from "node:path";

const PUBLIC_GITHUB_PAGES_URL = "https://toto.github.io/oc-les-petits-plats";
const isProductionNode = process.env.NODE_ENV === "production";

const base = isProductionNode ? PUBLIC_GITHUB_PAGES_URL : "/";
const root = resolve(__dirname, "src");
const publicDir = resolve(__dirname, "public");
const outDir = resolve(__dirname, "dist");

/** HTML Pages */
const input = {
	main: resolve(root, "index.html"),
};

export default defineConfig({
	base,
	root,
	publicDir,
	build: {
		rollupOptions: { input },
		outDir,
	},
});
