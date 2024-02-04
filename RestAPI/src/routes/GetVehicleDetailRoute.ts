import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
import { replySuccess } from "../schema/SensibleSuccessSchema";
import { createClient, fetchExchange, cacheExchange, gql } from 'urql';
import { replyError } from "../schema/SensibleErrorSchema";

export default class GetVehicleDetailRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {
        const { id } = <{ id: string }>req.params;

        const headers = {
            'x-client-id': "65b21034082e3c09d1c2eeff",
            'x-app-id': "65b21034082e3c09d1c2ef01"
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

                if (vehicleDetails.connectors && vehicleDetails.connectors.length > 0) {
                    let bestConnector = vehicleDetails.connectors[0];

                    for (const connector of vehicleDetails.connectors) {
                        if (connector.time < bestConnector.time) {
                            bestConnector = connector;
                        }
                    }

                    vehicleDetails.time = bestConnector.time;
                }
                console.log("vehicleDetails", vehicleDetails);
                return replySuccess(reply, { statusCode: 200, data: { vehicle: vehicleDetails } });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
