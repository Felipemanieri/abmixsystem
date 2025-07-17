import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Configurações para melhor performance móvel
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Headers para forçar atualização - ANTI-CACHE TOTAL
app.use((req, res, next) => {
  const timestamp = Date.now();
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  
  // Cache headers mais agressivos para mobile
  if (isMobile) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0, s-maxage=0, stale-while-revalidate=0');
    res.set('Surrogate-Control', 'no-store');
  } else {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
  }
  
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Last-Modified', new Date(timestamp).toUTCString());
  res.set('ETag', '"v' + Math.floor(timestamp/10000) + '"'); // Muda a cada 10 segundos
  res.set('Vary', 'Accept-Encoding, User-Agent, Cache-Control');
  res.set('X-Cache-Bust', timestamp.toString());
  res.set('X-Timestamp', timestamp.toString());
  res.set('X-No-Cache', 'true');
  
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    await serveStatic(app);
  }

  const PORT = Number(process.env.PORT || process.env.REPL_ID ? 5000 : 3000);
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();