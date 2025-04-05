import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // base:"/Portfolio/",        // uncomment this line if you want to deploy on github pages
  plugins: [react()],
  assetsInclude: ["**/*.JPG"],
});
