import AbstractRoute from "./AbstractRoute";
import {FastifyReply, FastifyRequest} from "fastify";
import * as polyline from 'polyline';
import axios from "axios";
import {parseString} from 'xml2js';
import {replySuccess} from "../schema/SensibleSuccessSchema";
import {readyMap} from "fastify-decorators/decorators";
import xml2js from "xml2js";


export default class ProcessRoadRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const api_key = process.env.OPENROUTESERVICE_API_KEY;

        if (!api_key) {
            return replySuccess(reply, {
                statusCode: 500,
                data: 'Missing API key'
            });
        }

        let {coordinates, autonomy, chargingTime} = <{
            coordinates: [number, number][],
            autonomy: number,
            chargingTime: number
        }>req.body;

        const firstRoad = await this.getFirstRoad(coordinates, api_key);

        const steps = await this.getChargingStationsAtIntervals(firstRoad, autonomy);

        const data: any = await this.getSecondRoad(steps, api_key);
        const finalRoad = data[0];
        const distance = data[1];
        const duration = data[2];

        const durationWithSteps = await this.callSoap(duration, chargingTime, steps.length - 2)
        console.log(steps.length - 2)

        replySuccess(reply, {
            statusCode: 200,
            data: {
                road: finalRoad,
                distance: distance,
                duration: durationWithSteps,
                steps: steps
            }
        })

    }

    async getFirstRoad(coordinates: [number, number][], apiKey : string): Promise<any> {

        const _start = coordinates[0];
        const _end = coordinates[1];

        let response = (await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
            params: {
                api_key: apiKey,
                start: `${_start[0]},${_start[1]}`,
                end: `${_end[0]},${_end[1]}`
            }
        })).data

        return response.features.flatMap((feature: any) => feature.geometry.coordinates);
    }

    async getSecondRoad(steps: [number, number][], api_key : string): Promise<any> {
        let response = (await axios.post(`https://api.openrouteservice.org/v2/directions/driving-car/json`,
            {
                coordinates: steps,
            },
            {
                params: {
                    api_key: api_key,
                }
            })).data

        const encodedGeometry: string = response.routes[0].geometry;
        const decodedCoordinates: number[][] = polyline.decode(encodedGeometry);
        const fixedCoordinates = decodedCoordinates.map(coord => [coord[1], coord[0]]);

        const distance: number = response.routes[0].summary.distance;
        const duration: string = response.routes[0].summary.duration;

        return [fixedCoordinates, distance, duration];
    }

    async getChargingStationsAtIntervals(routeCoordinates: [number, number][], intervalKilometers: number): Promise<any> {

        const steps = []
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
                const bornes = (await axios.get(url)).data.results;

                if (bornes.length > 0) {
                    const nearestBorn = bornes[0]
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


    calculateDistance(coordA: [number, number], coordB: [number, number]): number {
        const earthRadiusKm = 6371;
        const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

        const deltaLat = toRadians(coordB[0] - coordA[0]);
        const deltaLon = toRadians(coordB[1] - coordA[1]);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(toRadians(coordA[0])) * Math.cos(toRadians(coordB[0])) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }

    async callSoap(duration: number, chargingTime: number, breaks : number): Promise<number> {
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
            const response = await axios.post('http://127.0.0.1:8001', soapEnvelope, {
                headers: { 'Content-Type': 'text/xml' }
            });
            const result = await response.data;

            return new Promise<number>((resolve, reject) => {
                parseString(result, { explicitArray: false, ignoreAttrs: true }, (err, result) => {
                    if (err) {
                        console.error('Erreur lors de l\'analyse XML :', err);
                        reject(err);
                    }

                    const roadResult = result['soap11env:Envelope']['soap11env:Body']['tns:roadResponse']['tns:roadResult'];
                    const distanceValue = parseFloat(roadResult);
                    resolve(distanceValue);
                });
            });

        } catch (error) {
            throw error;
        }
    }

}
