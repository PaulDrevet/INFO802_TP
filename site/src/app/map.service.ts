// map.service.ts

import {Injectable} from '@angular/core';
import {Map, Marker} from 'maplibre-gl';
import * as polyline from 'polyline';


@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: Map;
  private previousStartMarker!: Marker;
  private previousEndMarker!: Marker;

  setMap(map: Map) {
    this.map = map;
  }

  addMarkerStart(lng: number, lat: number): Marker {
    if (this.previousStartMarker) {
      this.previousStartMarker.remove();
    }

    const marker = new Marker({draggable: true, color: 'red'})
      .setLngLat([lng, lat])
      .addTo(this.map);

    this.previousStartMarker = marker;

    if (this.previousEndMarker) {
      this.displayRoad2Points()
    }
    return marker;

  }

  addMarkerEnd(lng: number, lat: number): Marker {
    if (this.previousEndMarker) {
      this.previousEndMarker.remove();
    }

    const marker = new Marker({draggable: true, color: 'red'})
      .setLngLat([lng, lat])
      .addTo(this.map);

    this.previousEndMarker = marker;

    if (this.previousStartMarker) {
      this.displayRoad2Points()
    }

    return marker;

  }


  displayRoad3Points(): Promise<number[][]> {
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

      const coordinates = [
        this.previousStartMarker.getLngLat().toArray(),
        this.previousEndMarker.getLngLat().toArray()
      ];

      const coordinates2 = [
        this.previousStartMarker.getLngLat().toArray().reverse(),
        this.previousEndMarker.getLngLat().toArray().reverse()]
      console.log(coordinates, coordinates2)
      const body = `{"coordinates":[[${coordinates[0]}],[${coordinates[1]}]]}`;


      request.send(body);
    });
  }

  displayRoad2Points() {
    const coordinates = [
      this.previousStartMarker.getLngLat().toArray(),
      this.previousEndMarker.getLngLat().toArray()
    ]

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049&start=${coordinates[0]}&end=${coordinates[1]}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const coordinates = data.features[0].geometry.coordinates;
        this.drawRoad(coordinates)
      })
  }

  drawRoad(coordinates: number[][]) {
    console.log(coordinates)
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
          'line-color': '#ff0000',
          'line-width': 5
        }
      });
    }
    console.log('drawRoad')
  }
}
