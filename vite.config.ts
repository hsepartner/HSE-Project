import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'generate-spa-redirect',
      closeBundle() {
        // Create vercel.json in the dist folder
        const vercelConfig = {
          "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
        };
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/vercel.json'), 
          JSON.stringify(vercelConfig, null, 2)
        );
        
        // Also create a _redirects file as a fallback
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/_redirects'),
          '/* /index.html 200'
        );
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
