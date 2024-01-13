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
      this.drawRoad()
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
      this.drawRoad()
    }

    return marker;

  }

  test() {
    const startCoords = this.previousStartMarker.getLngLat().toArray();
    const endCoords = this.previousEndMarker.getLngLat().toArray();

    const url = "https://api.openrouteservice.org/v2/directions/driving-car";
    const apiKey = "5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049";

    const data = {
      coordinates: [startCoords, endCoords],
      instructions: false
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        "Content-Type": "application/json",
        "Authorization": apiKey
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const geometryValue = data.routes[0].geometry;
        const route = polyline.decode(geometryValue);
        console.log(route)
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
      })
      .catch(error => {
        console.log(error)
      });
  }

  getRoad(): Promise<any> {
    return new Promise((resolve, reject) => {
      const startCoords = this.previousStartMarker.getLngLat().toArray();
      const endCoords = this.previousEndMarker.getLngLat().toArray();

      const url = "https://api.openrouteservice.org/v2/directions/driving-car";
      const apiKey = "5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049";

      const data = {
        coordinates: [startCoords, endCoords],
        instructions: false
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          "Content-Type": "application/json",
          "Authorization": apiKey
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const geometryValue = data.routes[0].geometry;
          const decodedRoute = polyline.decode(geometryValue);
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  async drawRoadTest() {
    const route = await this.getRoad();
    console.log("route 2", route)
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
  }

  drawRoad() {
    const coordinates = [
      this.previousStartMarker.getLngLat().toArray(),
      this.previousEndMarker.getLngLat().toArray()
    ]

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049&start=${coordinates[0]}&end=${coordinates[1]}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const route = data.features[0].geometry.coordinates;
        console.log("route 1", route)
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
