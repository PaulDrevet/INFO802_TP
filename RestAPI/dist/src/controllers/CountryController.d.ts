import { FastifyReply, FastifyRequest } from "fastify";
export default class CountryController {
    handlerGetCountries: (req: FastifyRequest, reply: FastifyReply) => Promise<any>;
}
