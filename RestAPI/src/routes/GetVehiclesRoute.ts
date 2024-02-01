import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
import { replySuccess } from "../schema/SensibleSuccessSchema";

export default class GetVehiclesRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

    }
}
