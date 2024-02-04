import AbstractRoute from "./AbstractRoute";
import { FastifyReply, FastifyRequest } from "fastify";
import { replySuccess } from "../schema/SensibleSuccessSchema";
import { createClient, fetchExchange, cacheExchange, gql } from 'urql';
import {replyError} from "../schema/SensibleErrorSchema";

export default class GetVehiclesRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

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

        const page = 0;
        const size = 100;

        const query = gql`
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
            } else {
                const vehicleList = data.vehicleList;
                console.log("vehicleList", vehicleList);
                return replySuccess(reply, { statusCode: 200, data: { vehicles: vehicleList } });
            }
        } catch (error) {
            console.log(error);
        }

    }


}
