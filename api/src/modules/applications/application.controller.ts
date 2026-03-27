import { Request, Response } from "express";
import { ApplicationService } from "./application.service";
import { makeAppError } from "../../middleware/errorHandler";

export class ApplicationController {
  static async postApplication(req: Request, res: Response) {
    const user = (req as any).user; // Extract full user object
    const userId = user?.sub;

    if (!userId) throw makeAppError("Unauthorized", 401);

    const input = req.body;
    console.log('This is input from req.body: ', input);
    if (!input || Object.keys(input).length === 0) throw makeAppError("Missing application data", 400);

    const application = await ApplicationService.createApplication(userId, input);
    res.status(201).json({ data: application });
  }
}
