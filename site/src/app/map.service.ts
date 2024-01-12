// map.service.ts

import {Injectable} from '@angular/core';
import {Map, Marker} from 'maplibre-gl';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: Map;

  setMap(map: Map) {
    this.map = map;
  }

  addMarker(lng: number, lat: number): Marker {
    return new Marker({color : "#FF0000"}).setLngLat([lng, lat]).addTo(this.map);
  }
}
