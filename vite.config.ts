import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { llmFriendlyPlugin, llmTxtPlugin } from "vite-plugin-llm-friendly";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    llmFriendlyPlugin({ mdDir: "public" }),
    llmTxtPlugin({ dir: "public" }),
  ],
  base: "/sexxion-blog/",
});
