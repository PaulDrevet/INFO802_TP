import { FastifyReply, FastifyRequest } from "fastify";
export default class RoadController {
    handlerGetVehicles: (req: FastifyRequest, reply: FastifyReply) => Promise<any>;
    handlerGetVehicleDetail: (req: FastifyRequest, reply: FastifyReply) => Promise<any>;
}
