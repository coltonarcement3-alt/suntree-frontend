import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import wisp from "wisp-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { publicPath } from "ultraviolet-static";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

app.disable("x-powered-by");
app.use(express.static(publicDir, { index: false }));
app.use(express.static(publicPath, { index: false }));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "suntree-frontend" });
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, "404.html"));
});

const server = createServer((req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url?.includes("/wisp/")) {
    wisp.routeRequest(req, socket, head);
    return;
  }

  socket.end();
});

const port = Number(process.env.PORT) || 8080;

server.listen(port, () => {
  console.log(`Suntree frontend is running on http://localhost:${port}`);
});
