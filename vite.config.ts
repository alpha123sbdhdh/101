import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { devApiMiddleware } from "./devApiMiddleware";

export default defineConfig({
  plugins: [react(), devApiMiddleware()],
  build: {
    target: "es2020",
  },
});
