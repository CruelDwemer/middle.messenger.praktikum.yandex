import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "./vitePrecompilePlugin.js";

export default defineConfig({
    plugins: [handlebars()],
    root: resolve(__dirname, "src"),
    // build: {
    //     outDir: resolve(__dirname, "dist"),
    // },
    build: {
        rollupOptions: {
            input: './src/index.html',
            output:
                {
                    format: 'es',
                    strict: false,
                    dir: 'dist/',
                    entryFileNames: `assets/[name].js`,
                    chunkFileNames: `assets/[name].js`,
                    assetFileNames: `assets/[name].[ext]`,
                }
        }
    },
});
