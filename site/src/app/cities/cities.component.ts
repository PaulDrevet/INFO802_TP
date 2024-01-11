import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AutoCompleteModule} from "primeng/autocomplete";
import {trigger} from "@angular/animations";
import * as xml2js from 'xml2js';
import * as fs from "fs";

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
  ],
  animations : [
    trigger('overlayContentAnimation', [
      // ... your animation configurations ...
    ]),
  ],
  standalone: true
})
export class CitiesComponent implements OnInit{
  cities: any;
  suggestions: any;
  selectedCityStart: any;
  selectedCityEnd: any;

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
    console.log(filtered);
    this.suggestions = filtered;
  }

}
