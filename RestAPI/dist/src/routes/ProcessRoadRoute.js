"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRoute_1 = __importDefault(require("./AbstractRoute"));
const polyline = __importStar(require("polyline"));
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const SensibleSuccessSchema_1 = require("../schema/SensibleSuccessSchema");
class ProcessRoadRoute extends AbstractRoute_1.default {
    run = async (req, reply) => {
        const api_key = process.env.OPENROUTESERVICE_API_KEY;
        if (!api_key) {
            return (0, SensibleSuccessSchema_1.replySuccess)(reply, {
                statusCode: 500,
                data: 'Missing API key'
            });
        }
        let { coordinates, autonomy, chargingTime } = req.body;
        const firstRoad = await this.getFirstRoad(coordinates, api_key);
        const steps = await this.getChargingStationsAtIntervals(firstRoad, autonomy);
        const data = await this.getSecondRoad(steps, api_key);
        const finalRoad = data[0];
        const distance = data[1];
        const duration = data[2];
        const durationWithSteps = await this.callSoap(duration, chargingTime, steps.length - 2);
        console.log(steps.length - 2);
        (0, SensibleSuccessSchema_1.replySuccess)(reply, {
            statusCode: 200,
            data: {
                road: finalRoad,
                distance: distance,
                duration: durationWithSteps,
                steps: steps
            }
        });
    };
    async getFirstRoad(coordinates, apiKey) {
        const _start = coordinates[0];
        const _end = coordinates[1];
        let response = (await axios_1.default.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
            params: {
                api_key: apiKey,
                start: `${_start[0]},${_start[1]}`,
                end: `${_end[0]},${_end[1]}`
            }
        })).data;
        return response.features.flatMap((feature) => feature.geometry.coordinates);
    }
    async getSecondRoad(steps, api_key) {
        let response = (await axios_1.default.post(`https://api.openrouteservice.org/v2/directions/driving-car/json`, {
            coordinates: steps,
        }, {
            params: {
                api_key: api_key,
            }
        })).data;
        const encodedGeometry = response.routes[0].geometry;
        const decodedCoordinates = polyline.decode(encodedGeometry);
        const fixedCoordinates = decodedCoordinates.map(coord => [coord[1], coord[0]]);
        const distance = response.routes[0].summary.distance;
        const duration = response.routes[0].summary.duration;
        return [fixedCoordinates, distance, duration];
    }
    async getChargingStationsAtIntervals(routeCoordinates, intervalKilometers) {
        const steps = [];
        steps.push(routeCoordinates[0]);
        let distanceAccumulator = 0;
        for (let i = 1; i < routeCoordinates.length; i++) {
            const coordA = routeCoordinates[i - 1];
            const coordB = routeCoordinates[i];
            const distanceBetweenPoints = this.calculateDistance(coordA, coordB);
            distanceAccumulator += distanceBetweenPoints;
            if (distanceAccumulator >= intervalKilometers) {
                const query = `within_distance(geo_point_borne, GEOM'POINT(${coordA[0]} ${coordA[1]})', ${30000}m)`;
                const url = `https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?limit=1&where=${encodeURIComponent(query)}`;
                const bornes = (await axios_1.default.get(url)).data.results;
                if (bornes.length > 0) {
                    const nearestBorn = bornes[0];
                    const latBorne = nearestBorn.geo_point_borne.lat;
                    const lngBorne = nearestBorn.geo_point_borne.lon;
                    steps.push([lngBorne, latBorne]);
                    distanceAccumulator = 0;
                }
            }
        }
        steps.push(routeCoordinates[routeCoordinates.length - 1]);
        return steps;
    }
    calculateDistance(coordA, coordB) {
        const earthRadiusKm = 6371;
        const toRadians = (degrees) => (degrees * Math.PI) / 180;
        const deltaLat = toRadians(coordB[0] - coordA[0]);
        const deltaLon = toRadians(coordB[1] - coordA[1]);
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(toRadians(coordA[0])) * Math.cos(toRadians(coordB[0])) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }
    async callSoap(duration, chargingTime, breaks) {
        const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:exa="spyne.getTime">
      <soapenv:Header/>
      <soapenv:Body>
        <exa:road>
          <exa:duration>${duration}</exa:duration>
          <exa:charging_time>${chargingTime}</exa:charging_time>
          <exa:breaks>${breaks}</exa:breaks>
        </exa:road>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
        try {
            const response = await axios_1.default.post('http://127.0.0.1:8001', soapEnvelope, {
                headers: { 'Content-Type': 'text/xml' }
            });
            const result = await response.data;
            return new Promise((resolve, reject) => {
                (0, xml2js_1.parseString)(result, { explicitArray: false, ignoreAttrs: true }, (err, result) => {
                    if (err) {
                        console.error('Erreur lors de l\'analyse XML :', err);
                        reject(err);
                    }
                    const roadResult = result['soap11env:Envelope']['soap11env:Body']['tns:roadResponse']['tns:roadResult'];
                    const distanceValue = parseFloat(roadResult);
                    resolve(distanceValue);
                });
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = ProcessRoadRoute;
