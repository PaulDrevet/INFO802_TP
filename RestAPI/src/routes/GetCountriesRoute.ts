import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
import { replySuccess } from "../schema/SensibleSuccessSchema";
require('dotenv').config();


export default class GetCountriesRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {
        try {

            const api_key = process.env.OPENROUTESERVICE_API_KEY;

            if (!api_key) {
                return replySuccess(reply, {
                    statusCode: 500,
                    data: 'Missing API key'
                });
            }

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
