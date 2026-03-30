import { NextFunction, Request, Response } from "express";
import { ApplicationService } from "./application.service";
import { makeAppError } from "../../middleware/errorHandler";
import { IApplication } from "./Application.model";
import { HydratedDocument } from "mongoose";

export class ApplicationController {
  static async postApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // ! NOT TYPE SAFE
      const user = (req as any).user; // Extract full user object
      const userId = user?.sub;

      if (!userId) throw makeAppError("Unauthorized", 401);

      const input = req.body;
      console.log("This is input from req.body: ", input);
      if (!input || Object.keys(input).length === 0)
        throw makeAppError("Missing application data", 400);

      const application: HydratedDocument<IApplication> =
        await ApplicationService.createApplication(userId, input);
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

  static async getApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const userId = user?.sub;

      if (!userId) throw makeAppError("Unauthorized", 401);

      const appId = req.params.id as string;

      console.log(`This is userId: ${userId}`);
      console.log(`This is appId: ${appId}`);

      if (!appId) throw makeAppError("Application not found", 404);

      const application = await ApplicationService.findApplication(
        appId,
        userId,
      );

      console.log(`This is application: ${application} `);

      res.status(200).json({
        success: true,
        message: "Application fetched successfully",
        data: { application },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const userId = user?.sub;

      if (!userId) throw makeAppError("Unauthorized", 401);

      const appId = req.params.id as string;

      if (!appId) throw makeAppError("Application not found", 404);

      const application = await ApplicationService.deleteApplication(
        appId,
        userId,
      );

      console.log(`This is application: ${application} `);

      res.status(200).json({
        success: true,
        message: "Application fetched successfully",
        data: { application },
      });
    } catch (error) {
      next(error);
    }
  }
}
