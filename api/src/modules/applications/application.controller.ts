import { NextFunction, Request, Response } from "express";
import { ApplicationService } from "./application.service";
import { makeAppError } from "../../middleware/errorHandler";

export class ApplicationController {
  static async postApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user; // Extract full user object
      const userId = user?.sub;

      if (!userId) throw makeAppError("Unauthorized", 401);

      const input = req.body;
      console.log("This is input from req.body: ", input);
      if (!input || Object.keys(input).length === 0)
        throw makeAppError("Missing application data", 400);

      const application = await ApplicationService.createApplication(
        userId,
        input,
      );
      res.status(201).json({
        success: true,
        message: "Application created successfully",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserApplicatons(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const userId = user?.sub;

      if (!userId) throw makeAppError("Unauthorized", 401);

      const applications = await ApplicationService.findApplications(userId);
      res.status(200).json({
        success: true,
        message: "Applications fetched successfully",
        data: {
          applications: applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
