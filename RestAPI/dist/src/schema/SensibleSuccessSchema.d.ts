import { FastifyReply } from "fastify";
export interface ISensibleSuccessSchema {
    statusCode: number;
    success?: string;
    data?: any;
    messages?: {
        lang: string;
        message: string;
    }[];
}
declare const _default: () => import("fluent-json-schema").ObjectSchema<{
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
}>;
export default _default;
/**
 * Send an error response
 * @param reply - The reply of your route
 * @param sensibleSuccess - The option of your success
 */
export declare function replySuccess(reply: FastifyReply, sensibleSuccess: ISensibleSuccessSchema): void;
