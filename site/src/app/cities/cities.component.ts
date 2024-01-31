// cities.component.ts

import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import {MapService} from '../map.service';
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import { ToastModule } from 'primeng/toast';
import {MessageService} from "primeng/api";
import axios from "axios";
import {VehicleService} from "../vehicle.service";

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
  time : string | undefined;
  breaks : string | undefined;

  constructor(private mapService: MapService, private messageService: MessageService, private vehiculeService : VehicleService) {
  }

  calculateRoad() {
    console.log(this.selectedCityStart)
    if (this.selectedCityStart == undefined || this.selectedCityEnd == undefined) {
      this.messageService.add({ severity: 'info', summary: 'Erreur', detail: 'Sélectionnez 2 villes !' });
      return
    }
    if (this.vehiculeService.getSelectedVehicle() == undefined){
      this.messageService.add({ severity: 'info', summary: 'Erreur', detail: 'Sélectionnez un véhicule !' });
      return
    }
    this.loading = true;
    this.mapService.processRoad().then(data => this.updateFront(data))
  }

  updateFront(data: [number, number, number]): void {
    const distance = data[0];
    const time : number = data[1];
    this.breaks = data[2].toString()
    this.distance = Math.trunc(distance/1000).toString() + "km"
    this.time = Math.trunc(time/3600).toString() + "h" + Math.trunc(time/60%60).toString() + "min"
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
