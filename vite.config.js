import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "./vitePrecompilePlugin.js";

export default defineConfig({
    plugins: [handlebars()],
    root: resolve(__dirname, "src"),
    build: {
        outDir: resolve(__dirname, "dist"),
    },
});
