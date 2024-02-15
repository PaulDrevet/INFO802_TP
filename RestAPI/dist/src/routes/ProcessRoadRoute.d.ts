import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
export default class ProcessRoadRoute extends AbstractRoute {
    run: (req: FastifyRequest, reply: FastifyReply) => Promise<any>;
    getFirstRoad(coordinates: [number, number][], apiKey: string): Promise<any>;
    getSecondRoad(steps: [number, number][], api_key: string): Promise<any>;
    getChargingStationsAtIntervals(routeCoordinates: [number, number][], intervalKilometers: number): Promise<any>;
    calculateDistance(coordA: [number, number], coordB: [number, number]): number;
    callSoap(duration: number, chargingTime: number, breaks: number): Promise<number>;
}
