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

    const marker = new Marker({draggable: true, color : 'red'})
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

    const marker = new Marker({draggable: true, color : 'red'})
      .setLngLat([lng, lat])
      .addTo(this.map);

    this.previousEndMarker = marker;

    if (this.previousStartMarker) {
      this.drawRoad();
    }

    return marker;

  }

  drawRoad(){
    const coordinates = [
      this.previousStartMarker.getLngLat().toArray(),
      this.previousEndMarker.getLngLat().toArray()
    ];

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049&start=${coordinates[0]}&end=${coordinates[1]}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
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
