import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./openapi";

export function createDocsRouter(): Router {
  const router = Router();
  const document = generateOpenApiDocument();

  router.get("/openapi.json", (_req, res) => {
    res.json(document);
  });

  router.use("/", swaggerUi.serve, swaggerUi.setup(document));

  return router;
}
