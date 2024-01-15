import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const initialState = { lng: 1, lat: 46, zoom: 5 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=DHbnNFArRn7lySbHERl5`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.mapService.setMap(this.map);
    this.map.addControl(new NavigationControl({}), 'top-right');
  }

  ngOnDestroy() {
    this.map?.remove();
  }


}
