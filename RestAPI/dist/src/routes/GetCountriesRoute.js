"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = __importDefault(require("./AbstractRoute"));
const SensibleSuccessSchema_1 = require("../schema/SensibleSuccessSchema");
require('dotenv').config();
class GetCountriesRoute extends AbstractRoute_1.default {
    run = async (req, reply) => {
        try {
            const api_key = process.env.OPENROUTESERVICE_API_KEY;
            if (!api_key) {
                return (0, SensibleSuccessSchema_1.replySuccess)(reply, {
                    statusCode: 500,
                    data: 'Missing API key'
                });
            }
            let { input } = req.query;
            const apiUrl = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${api_key}&text=${input}&boundary.country=FR`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            return (0, SensibleSuccessSchema_1.replySuccess)(reply, {
                statusCode: 200,
                data: data.features
            });
        }
        catch (error) {
            console.error('Fetch error:', error);
        }
    };
}
exports.default = GetCountriesRoute;
