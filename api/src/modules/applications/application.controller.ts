import { Request, Response } from "express";
import { ApplicationService } from "./application.service";

export class ApplicationController {
    static async postApplication(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(401).json({ error: "Unauthorized" });

            const input = req.body;
            if (!input || Object.keys(input).length === 0) {
                return res.status(400).json({ error: "Missing application data" });
            }

            const application = await ApplicationService.createApplication(userId, input);
            return res.status(201).json({ data: application });
        } catch (err) {
            console.error("postApplication error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}