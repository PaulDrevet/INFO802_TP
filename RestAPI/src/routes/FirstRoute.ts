import AbstractRoute from "./AbstractRoute";
import {FastifyReply, FastifyRequest} from "fastify";
import {replyError} from "../schema/SensibleErrorSchema";
import {replySuccess} from "../schema/SensibleSuccessSchema";

export default class FirstRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        replySuccess(reply, { statusCode: 200, success: "It's a success !", data: {
            p:"ok"
        }});

    }

}