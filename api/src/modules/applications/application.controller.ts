import { ApplicationService } from "./application.service";
export class ApplicationController {
    static async postApplication(req: Request, res: Response) {
        // extract id from cookies
        const userId = req.user.id;
        const input = req.body;

        const application = await ApplicationService.createApplication(userId, input);

        res.status(201).json({  })
    }
}