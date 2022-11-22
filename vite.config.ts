import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  plugins: [preact()],
});
