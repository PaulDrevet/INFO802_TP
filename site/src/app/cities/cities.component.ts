// cities.component.ts

import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import {MapService} from '../map.service';
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import { ToastModule } from 'primeng/toast';
import {MessageService} from "primeng/api";

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
    ButtonModule,
    NgIf,
    ToastModule
  ],
  providers: [MessageService],
  standalone: true
})
export class CitiesComponent {
  api_key: string = '5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049';

  suggestions: AutoCompleteSuggestion[] = [];
  selectedCityStart: any;
  selectedCityEnd: any;
  loading: boolean = false;
  distance : string | undefined;
  duration : string | undefined;
  breaks : string | undefined;

  constructor(private mapService: MapService, private messageService: MessageService) {
  }


  calculate() {
    console.log(this.selectedCityStart)
    if (this.selectedCityStart == undefined || this.selectedCityEnd == undefined) {
      this.messageService.add({ severity: 'info', summary: 'Erreur', detail: 'Sélectionnez 2 villes !' });
    }
    else {
      this.loading = true;
      this.mapService.getRoad().then(data => this.update(data))
    }
  }

  update(data: [number, number, number]): void {
    const minutes = data[0] / 60;
    const hours = Math.floor(minutes / 60);
    this.distance = Math.trunc(data[0]/60).toString() + "h" + Math.trunc(data[0]%60).toString() + "min"
    this.duration = Math.trunc(data[1]/1000).toString() + "km"
    this.breaks = data[2].toString()
    this.loading = false
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
