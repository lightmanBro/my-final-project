import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        artist: resolve(__dirname, "src/artist/index.html"),
        wireframes: resolve(__dirname, "src/wireframes/index.html"),
      },
    },
  },
});
