"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = __importDefault(require("./AbstractRoute"));
const SensibleSuccessSchema_1 = require("../schema/SensibleSuccessSchema");
const urql_1 = require("urql");
const SensibleErrorSchema_1 = require("../schema/SensibleErrorSchema");
class GetVehiclesRoute extends AbstractRoute_1.default {
    run = async (req, reply) => {
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
        const page = 0;
        const size = 100;
        const query = (0, urql_1.gql) `
        query vehicleList($page: Int, $size: Int, $search: String) {
          vehicleList(
            page: $page,
            size: $size,
            search: $search,
          ) {
            id
            connectors {
              standard
              power
              max_electric_power
              time
              speed
            }
            naming {
              make
              model
              chargetrip_version
            }
            media {
              image {
                thumbnail_url
              }
            }

          }
        }
      `;
        try {
            const response = await client.query(query, { page, size, search: '' }).toPromise();
            const { data, error } = response;
            if (error) {
                console.log(error);
            }
            else {
                const vehicleList = data.vehicleList;
                console.log("vehicleList", vehicleList);
                return (0, SensibleSuccessSchema_1.replySuccess)(reply, { statusCode: 200, data: { vehicles: vehicleList } });
            }
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.default = GetVehiclesRoute;
