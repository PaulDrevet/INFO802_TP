// map.service.ts

import {Injectable} from '@angular/core';
import {Map, Marker} from 'maplibre-gl';
import axios from "axios";
import {VehicleService} from "./vehicle.service";


@Injectable({
  providedIn: 'root',
})
export class MapService {

  constructor(private vehicleService : VehicleService){}

  getVehicle(){
    return this.vehicleService.getSelectedVehicle();
  }

  private map!: Map;
  private previousStartMarker!: Marker;
  private previousEndMarker!: Marker;
  private markers: Marker[] = [];

  setMap(map: Map) {
    this.map = map;
  }

  addMarkerStart(lng: number, lat: number): Marker {
    if (this.previousStartMarker) {
      this.previousStartMarker.remove();
    }

    const marker = new Marker({color: 'red'})
      .setLngLat([lng, lat])
      .addTo(this.map);

    this.previousStartMarker = marker;
    return marker;

  }

  addMarkerEnd(lng: number, lat: number): Marker {
    if (this.previousEndMarker) {
      this.previousEndMarker.remove();
    }

    const marker = new Marker({color: 'red'})
      .setLngLat([lng, lat])
      .addTo(this.map);

    this.previousEndMarker = marker;
    return marker;

  }

  async processRoad() : Promise<any> {

    const startingPoint = this.previousStartMarker.getLngLat().toArray();
    const endPoint = this.previousEndMarker.getLngLat().toArray();

    let coordinates = [
      startingPoint,
      endPoint
    ];

    const selectedVehicle = await this.getVehicle();

    const requestBody = {
      coordinates: coordinates,
      autonomy: selectedVehicle.range.best.combined,
      chargingTime: selectedVehicle.time
    };

    try {
      const response = await axios.post('http://localhost/road', requestBody);

      this.drawMarkers(response.data.data.steps)
      this.drawRoad(response.data.data.road)

      return [response.data.data.distance, response.data.data.duration, response.data.data.steps.length - 2]
    } catch (error) {
      throw error
    }
  }

  drawMarkers(coordinates: number[][]) {
    this.markers.forEach(marker => marker.remove());

    coordinates = coordinates.slice(1, -1)

    coordinates.forEach((coordinate) => {
      const m = new Marker({
        color: '#73af13',
      })
        .setLngLat([coordinate[0], coordinate[1]])
        .addTo(this.map);
      this.markers.push(m)
    });
  }

  drawRoad(coordinates: number[][], color: string = '#ff0000', width: number = 5) {
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    };

    if (this.map.getSource('route')) {
      (this.map.getSource('route') as any).setData(geojson);
    } else {
      this.map.addSource('route', {
        type: 'geojson',
        data: geojson
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': color,
          'line-width': width
        }
      });
    }
  }
}
