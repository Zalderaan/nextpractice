import { NextFunction, Request, Response } from "express";
import { ApplicationService } from "./application.service";
import { makeAppError } from "../../middleware/errorHandler";
import Application, { IApplication } from "./Application.model";
import { HydratedDocument } from "mongoose";
import {
  MoveApplicationInput,
  UpdateApplicationInput,
} from "./application.validator";

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

      // ! NOT TYPE SAFE
      const input = req.body;
      // console.log("received input in ApplicationController: ", input)
      // console.log("This is input from req.body: ", input);
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

      // console.log(`This is userId: ${userId}`);
      // console.log(`This is appId: ${appId}`);

      if (!appId) throw makeAppError("Application not found", 404);

      const update_appl_input = req.body;

      const application = await ApplicationService.findApplication(
        appId,
        userId,
      );

      // console.log(`This is application: ${application} `);

      res.status(200).json({
        success: true,
        message: "Application fetched successfully",
        data: { application },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateApplication(
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

      const safeinput = req.body as UpdateApplicationInput;
      const updated_application = await ApplicationService.updateApplication(
        appId,
        userId,
        safeinput,
      );

      if (!updated_application)
        throw makeAppError(
          "Application not found or could not be updated",
          404,
        );

      res.status(200).json({
        success: true,
        message: "Application updated successfully",
        data: updated_application,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateApplicationStatus(
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

      const newStatusAndOrder = req.body as MoveApplicationInput;

      const updated_application =
        await ApplicationService.changeApplicationStatus(
          appId,
          userId,
          newStatusAndOrder,
        );

      if (!updated_application)
        throw makeAppError(
          "Application not found or could not be updated",
          404,
        );

      res.status(200).json({
        success: true,
        message: "Application updated successfully",
        data: updated_application,
      });
    } catch (error) {
      console.error("Error in updateApplicationStatus:", error);
      next(error);
    }
  }

  static async dismissNotification(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const userId = user?.sub;

      if (!userId) throw makeAppError("Unauthorized", 401);

      const appId = req.params.id as string;
      const { reason } = req.body;

      if (!appId) throw makeAppError("Application not found", 404);
      if (!reason) throw makeAppError("Notification reason not found", 404);

      const dismissed_app = await ApplicationService.dismissReason(
        appId,
        userId,
        reason,
      );

      res.status(200).json({
        success: true,
        message: "App notificaiton dismissed successfully",
        data: { dismissed_app },
      });
    } catch (error) {
      next(error);
    }
  }

  static async snoozeNotification(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const userId = user?.sub;

      if (!userId) throw makeAppError("Unauthorized", 401);

      const appId = req.params.id as string;
      const { reason, snoozedUntil } = req.body;

      if (!appId) throw makeAppError("Application not found", 404);
      if (!reason) throw makeAppError("Notification reason not found", 404);
      if (!snoozedUntil)
        throw makeAppError("Notification snoozedUntil not found", 404);

      const dismissed_app = await ApplicationService.snoozeReason(
        appId,
        userId,
        reason,
        snoozedUntil,
      );

      res.status(200).json({
        success: true,
        message: "App notificaiton dismissed successfully",
        data: { dismissed_app },
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
