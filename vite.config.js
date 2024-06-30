import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';
import handlebars from "./vitePrecompilePlugin.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [handlebars()],
    root: resolve(__dirname, "src"),
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
    }
});
