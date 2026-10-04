import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const indexPath = path.join(publicDir, "Index.html");

app.disable("x-powered-by");
app.use(express.static(publicDir, { index: false }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "suntree-frontend" });
});

app.get("/", (_req, res) => {
  res.sendFile(indexPath);
});

app.get("/proxy", async (req, res) => {
  const target = req.query.url;

  if (!target || typeof target !== "string") {
    return res.status(400).json({ error: "Missing ?url parameter" });
  }

  const cleanTarget = target.trim();
  const targetUrl = new URL(cleanTarget.startsWith("http") ? cleanTarget : `https://${cleanTarget}`);

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SuntreeFrontend/1.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const responseBody = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get("content-type") || "text/html; charset=utf-8";

    res.status(upstreamResponse.status);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(responseBody);
  } catch (error) {
    console.error("Proxy request failed:", error);
    res.status(502).json({ error: "Unable to fetch the requested URL." });
  }
});

const port = Number(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`Suntree frontend is running on http://localhost:${port}`);
});
