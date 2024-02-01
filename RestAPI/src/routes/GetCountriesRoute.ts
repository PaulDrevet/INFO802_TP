import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
import { replySuccess } from "../schema/SensibleSuccessSchema";

export default class GetCountriesRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {
        try {
            const api_key = '5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049';

            let {input} = <{ input: string }>req.query;

            const apiUrl = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${api_key}&text=${input}&boundary.country=FR`;

            const response = await fetch(apiUrl);

            const data = await response.json();

            return replySuccess(reply, {
                statusCode: 200,
                data: data.features
            });
        } catch (error) {
            console.error('Fetch error:', error);

        }
    }
}
