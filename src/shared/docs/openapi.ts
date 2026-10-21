import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

export function generateOpenApiDocument() {
  return new OpenApiGeneratorV3(registry.definitions).generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Cueva del Lector API",
      version: "1.0.0",
      description: "Mini Wattpad × AO3 — works, chapters, comments, kudos and more.",
    },
    servers: [{ url: "/" }],
  });
}
