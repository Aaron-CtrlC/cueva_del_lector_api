import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { BadRequestError } from "../errors";

export interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

/**
 * Validates the request with Zod and stores the parsed result in `req.valid`.
 * Express 5 exposes `req.query` as a read-only getter, so replacing it in
 * place is not an option.
 */
export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req, _res, next) => {
    const valid: { body?: unknown; params?: unknown; query?: unknown } = {};

    for (const key of ["body", "params", "query"] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        const details = result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        return next(new BadRequestError("Validation failed", details));
      }

      valid[key] = result.data;
    }

    req.valid = valid;
    next();
  };
}
