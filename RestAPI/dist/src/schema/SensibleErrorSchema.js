"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyError = void 0;
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
exports.default = () => fluent_json_schema_1.default.object()
    .prop("statusCode", fluent_json_schema_1.default.number().required())
    .prop("error", fluent_json_schema_1.default.string().required())
    .prop("messages", fluent_json_schema_1.default.array().items(fluent_json_schema_1.default.object()
    .prop("lang", fluent_json_schema_1.default.string())
    .prop("message", fluent_json_schema_1.default.string())));
/**
 * Send an error response
 * @param reply - The reply of your route
 * @param sensibleError - The options of your error
 */
function replyError(reply, sensibleError) {
    reply.code(sensibleError.statusCode).send(sensibleError);
}
exports.replyError = replyError;
