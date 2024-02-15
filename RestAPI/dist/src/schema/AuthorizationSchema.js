"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
exports.default = {
    headers: fluent_json_schema_1.default.object().required(["authorization"]).prop("authorization", fluent_json_schema_1.default.string()).valueOf(),
    response: {
        401: fluent_json_schema_1.default.object()
            .prop("statusCode", fluent_json_schema_1.default.number())
            .prop("error", fluent_json_schema_1.default.string())
            .prop("message", fluent_json_schema_1.default.string())
            .description("Header not provided")
            .valueOf(),
        403: fluent_json_schema_1.default.object()
            .prop("statusCode", fluent_json_schema_1.default.number())
            .prop("error", fluent_json_schema_1.default.string())
            .prop("message", fluent_json_schema_1.default.string())
            .description("Invalid JWT token")
            .valueOf(),
    },
};
