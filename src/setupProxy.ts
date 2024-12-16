import { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export default function setupProxy(app: Application): void {
  app.use(
    "/loginAsGuest",
    createProxyMiddleware({
      target: "https://bridge-4204.onrender.com",
      changeOrigin: true,
    })
  );
}