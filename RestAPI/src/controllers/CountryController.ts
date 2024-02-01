import {Controller, GET} from "fastify-decorators";
import S from "fluent-json-schema";
import SensibleErrorSchema from "../schema/SensibleErrorSchema";
import SensibleSuccessSchema from "../schema/SensibleSuccessSchema";
import {FastifyReply, FastifyRequest} from "fastify";
import GetCountriesRoad from "../routes/GetCountriesRoad";

@Controller('/countries')
export default class CountryController{

    @GET('/', {
        schema: {
            querystring : S.object().prop('input', S.string().required()),
            response: {
                200: SensibleSuccessSchema(),
                400: SensibleErrorSchema()
            }
        }
    })
    public handlerGetCountries = async(req: FastifyRequest, reply: FastifyReply) => new GetCountriesRoad().run(req, reply);

}