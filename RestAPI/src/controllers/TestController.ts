import {Controller, GET} from "fastify-decorators";
import S from "fluent-json-schema";
import SensibleErrorSchema from "../schema/SensibleErrorSchema";
import SensibleSuccessSchema from "../schema/SensibleSuccessSchema";
import FirstRoute from "../routes/FirstRoute";
import {FastifyReply, FastifyRequest} from "fastify";

@Controller('/test')
export default class TestController{

    @GET('/first', {
        schema: {
            response: {
                200: SensibleSuccessSchema(),
                400: SensibleErrorSchema()
            }
        }
    })
    public handlerFirst = async(req: FastifyRequest, reply: FastifyReply) => new FirstRoute().run(req, reply);

}