"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = __importDefault(require("./AbstractRoute"));
const SensibleSuccessSchema_1 = require("../schema/SensibleSuccessSchema");
const urql_1 = require("urql");
const SensibleErrorSchema_1 = require("../schema/SensibleErrorSchema");
require('dotenv').config();
class GetVehicleDetailRoute extends AbstractRoute_1.default {
    run = async (req, reply) => {
        const { id } = req.params;
        const api_key = process.env.GRAPHQL_CLIENT_ID;
        const app_id = process.env.GRAPHQL_APP_ID;
        if (!api_key || !app_id) {
            return (0, SensibleErrorSchema_1.replyError)(reply, { statusCode: 500, error: 'Missing API key or app ID' });
        }
        const headers = {
            'x-client-id': api_key,
            'x-app-id': app_id
        };
        const client = (0, urql_1.createClient)({
            url: 'https://api.chargetrip.io/graphql',
            fetchOptions: {
                method: 'POST',
                headers,
            },
            exchanges: [urql_1.fetchExchange, urql_1.cacheExchange],
        });
        const vehicleQuery = (0, urql_1.gql) `
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
            }
            else {
                const vehicleDetails = data.vehicle;
                if (!vehicleDetails) {
                    return (0, SensibleErrorSchema_1.replyError)(reply, { statusCode: 404, error: 'Vehicle not found' });
                }
                vehicleDetails.time = this.getBestTime(vehicleDetails.connectors);
                return (0, SensibleSuccessSchema_1.replySuccess)(reply, { statusCode: 200, data: { vehicle: vehicleDetails } });
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    getBestTime(connectors) {
        let bestTime = connectors[0].time;
        for (const connector of connectors) {
            if (connector.time < bestTime) {
                bestTime = connector.time;
            }
        }
        return bestTime;
    }
}
exports.default = GetVehicleDetailRoute;
