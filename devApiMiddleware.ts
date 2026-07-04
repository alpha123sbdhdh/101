import type { Plugin, ViteDevServer } from "vite";

/**
 * Dev-only shim so `npm run dev` can exercise /api/valuation and /api/ai-tips
 * without needing the Vercel CLI. In production, vercel.json routes these
 * paths to the real serverless functions in /api directly — this plugin
 * never runs there.
 */
export function devApiMiddleware(): Plugin {
  return {
    name: "dev-api-middleware",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "POST" || !req.url) return next();

        const readBody = () =>
          new Promise<string>((resolve) => {
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => resolve(body));
          });

        try {
          if (req.url === "/api/valuation") {
            const { address } = JSON.parse((await readBody()) || "{}");
            const { getValuation } = await server.ssrLoadModule("/api/_lib/valuationProvider.ts");
            const result = await getValuation(address);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
            return;
          }

          if (req.url === "/api/ai-tips") {
            const { roomType, photoCount } = JSON.parse((await readBody()) || "{}");
            const { getTips } = await server.ssrLoadModule("/api/_lib/tipsProvider.ts");
            const tips = await getTips(roomType, Number(photoCount) || 0);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ roomType, tips, source: "stub" }));
            return;
          }
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(err) }));
          return;
        }

        next();
      });
    },
  };
}
