import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
import { replySuccess } from "../schema/SensibleSuccessSchema";
import { createClient, fetchExchange, cacheExchange, gql } from 'urql';
import { replyError } from "../schema/SensibleErrorSchema";
require('dotenv').config();

export default class GetVehicleDetailRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {
        const { id } = <{ id: string }>req.params;

        const api_key = process.env.GRAPHQL_CLIENT_ID;
        const app_id = process.env.GRAPHQL_APP_ID;

        if (!api_key || !app_id) {
            return replyError(reply, { statusCode: 500, error: 'Missing API key or app ID' });
        }

        const headers = {
            'x-client-id': api_key,
            'x-app-id': app_id
        };

        const client = createClient({
            url: 'https://api.chargetrip.io/graphql',
            fetchOptions: {
                method: 'POST',
                headers,
            },
            exchanges: [fetchExchange, cacheExchange],
        });

        const vehicleQuery = gql`
            query GetVehicleDetail($id: ID!) {
                vehicle(id: $id) {
                    id
                    naming {
                        make
                        model
                        version
                        edition
                        chargetrip_version
                    }
                    connectors {
                        standard
                        power
                        max_electric_power
                        time
                        speed
                    }
                    battery {
                        usable_kwh
                        full_kwh
                    }
                    body {
                        width
                        height
                        weight {
                            minimum
                            nominal
                            maximal
                        }
                        seats
                    }
                    availability {
                        status
                    }
                    performance {
                        acceleration
                        top_speed
                    }
                    range {
                        best {
                            highway
                            city
                            combined
                        }
                    }
                    media {
                        image {
                            id
                            type
                            url
                            height
                            width
                            thumbnail_url
                            thumbnail_height
                            thumbnail_width
                        }
                        brand {
                            id
                            type
                            url
                            height
                            width
                            thumbnail_url
                            thumbnail_height
                            thumbnail_width
                        }
                        image_list {
                            id
                            type
                            url
                            height
                            width
                            thumbnail_url
                            thumbnail_height
                            thumbnail_width
                        }
                    }
                }
            }
        `;

        try {
            const response = await client.query(vehicleQuery, { id }).toPromise();
            const { data, error } = response;

            if (error) {
                console.log(error);
            } else {
                const vehicleDetails = data.vehicle;

                if (!vehicleDetails) {
                    return replyError(reply, { statusCode: 404, error: 'Vehicle not found' });
                }

                vehicleDetails.time = this.getBestTime(vehicleDetails.connectors);
                return replySuccess(reply, { statusCode: 200, data: { vehicle: vehicleDetails } });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getBestTime(connectors: any[]): number {
        let bestTime = connectors[0].time;

        for (const connector of connectors) {
            if (connector.time < bestTime) {
                bestTime = connector.time;
            }
        }

        return bestTime;
    }
}
