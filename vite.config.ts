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
  const distDir = path.resolve(__dirname, 'dist');

  // Ensure the dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const vercelConfig = {
    rewrites: [{ source: "/(.*)", destination: "/index.html" }]
  };

  // Write vercel.json
  fs.writeFileSync(
    path.join(distDir, 'vercel.json'),
    JSON.stringify(vercelConfig, null, 2)
  );

  // Write _redirects file as fallback
  fs.writeFileSync(
    path.join(distDir, '_redirects'),
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
