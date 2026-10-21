import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

/**
 * Shared registry. Feature `*.docs.ts` modules register their paths here;
 * the document is generated once when the docs router is created.
 */
export const registry = new OpenAPIRegistry();
