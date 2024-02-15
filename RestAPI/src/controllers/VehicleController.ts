import {Controller, GET} from "fastify-decorators";
import SensibleErrorSchema from "../schema/SensibleErrorSchema";
import SensibleSuccessSchema from "../schema/SensibleSuccessSchema";
import {FastifyReply, FastifyRequest} from "fastify";
import GetVehiclesRoute from "../routes/GetVehiclesRoute";
import GetVehicleDetailRoute from "../routes/GetVehicleDetailRoute";

@Controller('/vehicle')
export default class RoadController {

    @GET('/', {
        schema: {
            response: {
                200: SensibleSuccessSchema(),
                400: SensibleErrorSchema()
            }
        }
    })
    public handlerGetVehicles = async (req: FastifyRequest, reply: FastifyReply) => new GetVehiclesRoute().run(req, reply);

    @GET('/:id', {
        schema: {
            response: {
                200: SensibleSuccessSchema(),
                400: SensibleErrorSchema()
            }
        }
    })
    public handlerGetVehicleDetail = async (req: FastifyRequest, reply: FastifyReply) => new GetVehicleDetailRoute().run(req, reply);

}