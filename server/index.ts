import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import routes from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (process.env.NODE_ENV === "development") {
    // Setup Vite dev server
    const vite = await createViteServer({
      plugins: [
        {
          name: "react-jsx-runtime",
          config() {
            return {
              esbuild: {
                jsx: "automatic",
                jsxImportSource: "react"
              }
            };
          }
        }
      ],
      server: { 
        middlewareMode: true, 
        hmr: { server },
        allowedHosts: ["0b9dc262-d94f-4205-ae6f-4654c93ab584-00-ultt68ws1yda.riker.replit.dev", "localhost", "127.0.0.1"],
        host: "0.0.0.0"
      },
      appType: "custom",
      root: path.resolve(__dirname, "..", "client"),
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "..", "client/src"),
          "@shared": path.resolve(__dirname, "..", "shared"),
          "@assets": path.resolve(__dirname, "..", "attached_assets"),
        },
      },
      define: {
        global: 'globalThis',
      },
    });

    // API routes MUST come before vite middlewares
    app.use("/api", routes);
    
    app.use(vite.middlewares);
    
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
    
    console.log("🚀 Vite HMR server ready");
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, "public");
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
    console.log("📦 Serving static files");
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.log(`❌ Failed to start server: ${error.message}`);
  process.exit(1);
});
