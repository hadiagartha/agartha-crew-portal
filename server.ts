import express from "express";
import { createServer as createViteServer } from "vite";
import backendApp from "./api/index";

const app = express();
const PORT = 3000;

// Mount the backend app's routes
app.use(backendApp);

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
