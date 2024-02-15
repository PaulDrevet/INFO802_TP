import { FastifyReply, FastifyRequest } from "fastify";
export default class RoadController {
    handlerProcessRoad: (req: FastifyRequest, reply: FastifyReply) => Promise<any>;
}
