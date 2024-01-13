// map.service.ts

import {Injectable} from '@angular/core';
import {Map, Marker} from 'maplibre-gl';

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
      this.drawRoad();
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
      this.drawRoad();
    }

    return marker;

  }

  drawRoadTest() {
    let request = new XMLHttpRequest();

    request.open('POST', "https://api.openrouteservice.org/v2/directions/driving-car");

    request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', '5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049');

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        console.log('Status:', this.status);
        console.log('Headers:', this.getAllResponseHeaders());
        console.log('Body:', this.responseText);
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: this.responseText
          }
        }
      }
    };

    const data = {
      coordinates: [
        [8.681495, 49.41461],
        [8.686507, 49.41943],
        [8.687872, 49.420318]
      ],
      instructions: false
    };

    const jsonString = JSON.stringify(data);
      request.send(jsonString);
  }

  drawRoad() {
    const coordinates = [
      this.previousStartMarker.getLngLat().toArray(),
      this.previousEndMarker.getLngLat().toArray()
    ];

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049&start=${coordinates[0]}&end=${coordinates[1]}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const route = data.features[0].geometry.coordinates;
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
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
      });
  }
}
