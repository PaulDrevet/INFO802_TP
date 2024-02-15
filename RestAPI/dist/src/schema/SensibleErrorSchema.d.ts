import { FastifyReply } from "fastify";
export interface ISensibleErrorSchema {
    statusCode: number;
    error: string;
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
 * @param sensibleError - The options of your error
 */
export declare function replyError(reply: FastifyReply, sensibleError: ISensibleErrorSchema): void;
