"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replySuccess = void 0;
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
exports.default = () => fluent_json_schema_1.default.object()
    .prop("statusCode", fluent_json_schema_1.default.number().required())
    .prop("success", fluent_json_schema_1.default.string())
    .prop("data")
    .prop("messages", fluent_json_schema_1.default.array().items(fluent_json_schema_1.default.object()
    .prop("lang", fluent_json_schema_1.default.string())
    .prop("message", fluent_json_schema_1.default.string())));
/**
 * Send an error response
 * @param reply - The reply of your route
 * @param sensibleSuccess - The option of your success
 */
function replySuccess(reply, sensibleSuccess) {
    reply.code(sensibleSuccess.statusCode).send(sensibleSuccess);
}
exports.replySuccess = replySuccess;
