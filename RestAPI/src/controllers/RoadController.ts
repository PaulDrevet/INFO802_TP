import {Controller, POST} from "fastify-decorators";
import S from "fluent-json-schema";
import SensibleErrorSchema from "../schema/SensibleErrorSchema";
import SensibleSuccessSchema from "../schema/SensibleSuccessSchema";
import {FastifyReply, FastifyRequest} from "fastify";
import ProcessRoadRoute from "../routes/ProcessRoadRoute";

@Controller('/road')
export default class RoadController {

    @POST('/', {
        schema: {
            body: S.object()
                .prop('coordinates', S.array()).required()
                .prop('autonomy', S.number()).required()
                .prop('chargingTime', S.number()).required(),

            response: {
                200: SensibleSuccessSchema(),
                400: SensibleErrorSchema()
            }
        }
    })
    public handlerProcessRoad = async (req: FastifyRequest, reply: FastifyReply) => new ProcessRoadRoute().run(req, reply);

}