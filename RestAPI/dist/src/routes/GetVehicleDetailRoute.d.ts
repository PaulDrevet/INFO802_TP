import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
export default class GetVehicleDetailRoute extends AbstractRoute {
    run: (req: FastifyRequest, reply: FastifyReply) => Promise<any>;
    getBestTime(connectors: any[]): number;
}
