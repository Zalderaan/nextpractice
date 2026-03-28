import Application, { IApplication } from "./Application.model"
import { makeAppError } from "../../middleware/errorHandler";
import { 
    CreateApplicationInput, CreateApplicationData,
    MoveApplicationInput, 
    UpdateApplicationInput 
} from './application.validator'
import { Types } from "mongoose";


export class ApplicationService {
    /**
     * Create a new application for a user.
     * @param {string} userId - User's _id as a string (converted to Types.ObjectId).
     * @param {CreateApplicationInput} payload - Validated form input (does not include userId or DB-only fields). Use position to suggest an order.
     * ? uses {CreateApplicationData} to be type-safe
     *
     * @returns {Promise<import("mongoose").HydratedDocument<IApplication>>} The created application document. 
     * */
    static async createApplication(
        userId: string,
        payload: CreateApplicationInput
    ) {
        const normalizedUserId = new Types.ObjectId(userId);
        const targetStatus = payload.status ?? "wishlist";

        // get card's order
        const last = await Application
            .findOne({ userId: normalizedUserId, status: targetStatus })
            .sort({ order: -1 })
            .select("order")
            .lean<{ order?: number | null }>();
        const computedOrder = last && typeof last.order === "number" ? last.order + 1 : 0;
        const order = (payload as any).order ?? computedOrder;

        // auto add appliedAt
        const appliedAt =
            payload.appliedAt !== undefined
                ? payload.appliedAt
                : targetStatus === "applied"
                    ? new Date()
                    : null;


        const new_application_data: CreateApplicationData = {
            ...payload,
            userId: normalizedUserId,
            order: order,
            appliedAt: appliedAt
        }

        const new_application = Application.create(new_application_data);
        return new_application;
    }

    static async findApplications(userId: string) {
        const user_applications = await Application.find({ userId }).lean();
        return user_applications;
    }

    static async changeApplicationStatus(updateApplicationData: UpdateApplicationInput) {
        // extract user id
        // const {} = user;

        const { } = updateApplicationData;
        // find application first
        const orig_application = await Application.find()

    }

    static async updateApplication() {

    }

    static async deleteApplication() {

    }
}