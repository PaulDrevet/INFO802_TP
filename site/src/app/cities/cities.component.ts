import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AutoCompleteModule} from "primeng/autocomplete";
import {trigger} from "@angular/animations";
import * as xml2js from 'xml2js';
import * as fs from "fs";
import {NgIf} from "@angular/common";

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css',
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    FormsModule,
    NgIf,
  ],
  standalone: true
})
export class CitiesComponent implements OnInit{
  cities: any;
  suggestions: any;
  selectedCityStart: any;
  selectedCityEnd: any;
  api_key : string = "5b3ce3597851110001cf6248c033c235cd58408988708d1c480a3049";

  ngOnInit() {
    this.cities = [
      "France",
      "Germany",
      "Spain",
      "United Kingdom"
    ]
  }

  filterCountry(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.cities as any[]).length; i++) {
      let country = (this.cities as any[])[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.suggestions = filtered;
  }

  getCountries(event : AutoCompleteCompleteEvent){
    let query = event.query;
    const apiUrl = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${this.api_key}&text=${query}&boundary.country=FR`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data.features[0].properties.name);
        this.suggestions = data.features;
        console.log(data)
        // Traitez les données ici
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
  }

}
