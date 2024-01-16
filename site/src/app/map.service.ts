// map.service.ts

import {Injectable} from '@angular/core';
import {Map, Marker} from 'maplibre-gl';
import * as polyline from 'polyline';
import axios from "axios";


@Injectable({
  providedIn: 'root',
})
export class MapService {
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

    if (this.previousEndMarker) {
      this.getRoad();
    }
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

    if (this.previousStartMarker) {
      this.getRoad();
    }

    return marker;

  }

  getRoad(): void {
    const startingPoint = this.previousStartMarker.getLngLat().toArray(); // Paris
    const endPoint = this.previousEndMarker.getLngLat().toArray(); // Lyon

    const coordinates = [
      startingPoint,
      endPoint
    ]

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049&start=${coordinates[0]}&end=${coordinates[1]}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const coordinates = data.features[0].geometry.coordinates;
        this.drawRoad(coordinates)
        this.getChargingStationsAtIntervals(coordinates, 90).then(steps =>
          this.getRoadCoordinates(steps).then(coordinates =>
            this.drawRoad(coordinates, '#73af13', 3))
        );
      })
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
    const earthRadiusKm = 6371; // Rayon moyen de la Terre en kilomètres

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const deltaLat = toRadians(coordB[0] - coordA[0]);
    const deltaLon = toRadians(coordB[1] - coordA[1]);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(toRadians(coordA[0])) * Math.cos(toRadians(coordB[0])) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }


  getRoadCoordinates(coordinates: [number, number][]): Promise<number[][]> {

    this.drawMarkers(coordinates)

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open('POST', 'https://api.openrouteservice.org/v2/directions/driving-car/json');

      request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Authorization', '5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049');

      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            const encodedGeometry: string = data.routes[0].geometry;
            const decodedCoordinates: number[][] = polyline.decode(encodedGeometry);

            const fixedCoordinates = decodedCoordinates.map(coord => [coord[1], coord[0]]);
            resolve(fixedCoordinates);
          } else {
            reject(new Error('Échec de la requête'));
          }
        }
      };
      const body = `{"coordinates":[${coordinates.map(coord => `[${coord}]`).join(',')}]}`;

      request.send(body);
    });
  }

  drawMarkers(coordinates: number[][]) {
    this.markers.forEach(marker => marker.remove());

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
