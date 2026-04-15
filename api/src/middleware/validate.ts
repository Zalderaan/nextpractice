import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

type Schema = z.ZodType<unknown>;

type Schemas = {
    body?: Schema;
    query?: Schema;
    params?: Schema;
};

export const validate = (schemas: Schemas) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (schemas.body) {
                console.log("This is req.body: ", req.body)
                req.body = schemas.body.parse(req.body);
            }

            if (schemas.query) {
                req.query = schemas.query.parse(req.query) as Request["query"];
            }

            if (schemas.params) {
                req.params = schemas.params.parse(req.params) as Request["params"];
            }

            next();
        } catch (error) {
            next(error as ZodError);
        }
    };
};