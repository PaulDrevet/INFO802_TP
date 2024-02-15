import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
export default class GetVehiclesRoute extends AbstractRoute {
    run: (req: FastifyRequest, reply: FastifyReply) => Promise<any>;
}
