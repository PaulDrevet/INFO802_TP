// cities.component.ts

import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import {MapService} from '../map.service';
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {ToastModule} from 'primeng/toast';
import {MessageService} from "primeng/api";
import {VehicleService} from "../vehicle.service";
import axios from "axios";

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

  suggestions: AutoCompleteSuggestion[] = [];
  selectedCityStart: any;
  selectedCityEnd: any;
  loading: boolean = false;
  distance : string | undefined;
  time : string | undefined;
  breaks : number | undefined;

  constructor(private mapService: MapService, private messageService: MessageService, private vehiculeService : VehicleService) {
  }

  calculateRoad() {
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
    const distance : number = data[0];
    const time : number = data[1];
    this.breaks = data[2]
    this.distance = Math.trunc(distance/1000).toString() + "km"
    this.time = Math.trunc(time/3600).toString() + "h" + Math.trunc(time/60%60).toString() + "min"
    this.loading = false
  }

  onAddMarkerStartClick() {
    if (this.selectedCityStart) {
      const coordinates = this.selectedCityStart.geometry.coordinates;
      this.mapService.addMarkerStart(coordinates[0], coordinates[1]);
    }
  }

  onAddMarkerEndClick() {
    if (this.selectedCityEnd) {
      const coordinates = this.selectedCityEnd.geometry.coordinates;
      this.mapService.addMarkerEnd(coordinates[0], coordinates[1]);
    }
  }

  async getCountries(event: AutoCompleteCompleteEvent) {
    const response = await axios.get('http://localhost/countries', {
      params: {
        input: event.query
      }
    });

    console.log(response.data.data)

    this.suggestions = response.data.data;
  }
}
