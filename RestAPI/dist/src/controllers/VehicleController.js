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
const SensibleErrorSchema_1 = __importDefault(require("../schema/SensibleErrorSchema"));
const SensibleSuccessSchema_1 = __importDefault(require("../schema/SensibleSuccessSchema"));
const GetVehiclesRoute_1 = __importDefault(require("../routes/GetVehiclesRoute"));
const GetVehicleDetailRoute_1 = __importDefault(require("../routes/GetVehicleDetailRoute"));
let RoadController = class RoadController {
    handlerGetVehicles = async (req, reply) => new GetVehiclesRoute_1.default().run(req, reply);
    handlerGetVehicleDetail = async (req, reply) => new GetVehicleDetailRoute_1.default().run(req, reply);
};
__decorate([
    (0, fastify_decorators_1.GET)('/', {
        schema: {
            response: {
                200: (0, SensibleSuccessSchema_1.default)(),
                400: (0, SensibleErrorSchema_1.default)()
            }
        }
    }),
    __metadata("design:type", Object)
], RoadController.prototype, "handlerGetVehicles", void 0);
__decorate([
    (0, fastify_decorators_1.GET)('/:id', {
        schema: {
            response: {
                200: (0, SensibleSuccessSchema_1.default)(),
                400: (0, SensibleErrorSchema_1.default)()
            }
        }
    }),
    __metadata("design:type", Object)
], RoadController.prototype, "handlerGetVehicleDetail", void 0);
RoadController = __decorate([
    (0, fastify_decorators_1.Controller)('/vehicle')
], RoadController);
exports.default = RoadController;
