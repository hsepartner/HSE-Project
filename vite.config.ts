// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Import conditionally inside the function to avoid issues during build
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  // Only require lovable-tagger in development to prevent build-time errors
  const devPlugins = isDev ? [require("lovable-tagger").componentTagger()] : [];

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      ...devPlugins,
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
