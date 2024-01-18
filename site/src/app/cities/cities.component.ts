// cities.component.ts

import { Component, OnInit } from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import { MapService } from '../map.service';
import {ButtonModule} from "primeng/button";

interface AutoCompleteSuggestion {
  properties: {
    name: string;
    centroid: {
      coordinates: number[];
    };
  };
}

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css'],
  imports: [
    AutoCompleteModule,
    FormsModule,
    ButtonModule
  ],
  standalone: true
})
export class CitiesComponent{
  api_key: string = '5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049';

  suggestions: AutoCompleteSuggestion[] = [];
  selectedCityStart: any;
  selectedCityEnd: any;
  loading: boolean = false;


  constructor(private mapService: MapService) {}


  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  drawRoad(){
  }

  onAddMarkerStartClick() {
    if (this.selectedCityStart) {
      const coordinates = this.selectedCityStart.geometry.coordinates;
      console.log(coordinates)
      this.mapService.addMarkerStart(coordinates[0], coordinates[1]);
    }
  }

  onAddMarkerEndClick() {
    if (this.selectedCityEnd) {
      const coordinates = this.selectedCityEnd.geometry.coordinates;
      console.log(coordinates)
      this.mapService.addMarkerEnd(coordinates[0], coordinates[1]);
    }
  }

  getCountries(event: AutoCompleteCompleteEvent) {
    let query = event.query;
    const apiUrl = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${this.api_key}&text=${query}&boundary.country=FR`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.suggestions = data.features;
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }
}
