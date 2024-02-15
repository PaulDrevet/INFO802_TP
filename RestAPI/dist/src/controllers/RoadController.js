"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_decorators_1 = require("fastify-decorators");
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const SensibleErrorSchema_1 = __importDefault(require("../schema/SensibleErrorSchema"));
const SensibleSuccessSchema_1 = __importDefault(require("../schema/SensibleSuccessSchema"));
const ProcessRoadRoute_1 = __importDefault(require("../routes/ProcessRoadRoute"));
let RoadController = class RoadController {
    handlerProcessRoad = async (req, reply) => new ProcessRoadRoute_1.default().run(req, reply);
};
__decorate([
    (0, fastify_decorators_1.POST)('/', {
        schema: {
            body: fluent_json_schema_1.default.object()
                .prop('coordinates', fluent_json_schema_1.default.array()).required()
                .prop('autonomy', fluent_json_schema_1.default.number()).required()
                .prop('chargingTime', fluent_json_schema_1.default.number()).required(),
            response: {
                200: (0, SensibleSuccessSchema_1.default)(),
                400: (0, SensibleErrorSchema_1.default)()
            }
        }
    }),
    __metadata("design:type", Object)
], RoadController.prototype, "handlerProcessRoad", void 0);
RoadController = __decorate([
    (0, fastify_decorators_1.Controller)('/road')
], RoadController);
exports.default = RoadController;
