import express from "express";
import path from "path";

const app = express();
const __dirname = process.cwd(); // garante o caminho absoluto

// Serve tudo que está em dist/public
app.use(express.static(path.join(__dirname, "dist", "public")));

// Qualquer rota volta para o index.html (SPA)
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SERVIDOR PRONTO: http://localhost:${PORT}`);
});
