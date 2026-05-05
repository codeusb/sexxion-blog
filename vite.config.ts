import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function llmFriendlyPlugin(): Plugin {
  return {
    name: 'llm-friendly',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        const basePath = "/sexxion-blog";
        let urlPath = req.url;
        if (urlPath.startsWith(basePath)) {
          urlPath = urlPath.slice(basePath.length);
        }
        if (urlPath === '/' || urlPath === '') {
          urlPath = '/index.html';
        }

        const accept = req.headers.accept || '';
        const mdUrl = req.url === '/' || req.url === basePath || req.url === `${basePath}/`
            ? `${basePath}/index.md`
            : `${req.url}.md`;

        res.setHeader('Link', `<${mdUrl}>; rel="alternate"; type="text/markdown"`);

        if (accept.includes('text/markdown')) {
          res.setHeader('Vary', 'Accept');
          let mdFilePath = '';
          if (urlPath === '/index.html') {
             mdFilePath = path.join(server.config.root, 'public', 'index.md');
          } else {
             // For static files that might exist
             const cleanPath = urlPath.split('?')[0];
             mdFilePath = path.join(server.config.root, 'public', cleanPath + '.md');
          }

          if (fs.existsSync(mdFilePath)) {
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
            res.end(fs.readFileSync(mdFilePath));
            return;
          }
        }

        if (!res.hasHeader('Vary')) {
          res.setHeader('Vary', 'Accept');
        } else {
          const vary = res.getHeader('Vary');
          if (typeof vary === 'string' && !vary.includes('Accept')) {
            res.setHeader('Vary', `${vary}, Accept`);
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), llmFriendlyPlugin()],
  base: "/sexxion-blog/",
});
