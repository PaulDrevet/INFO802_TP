import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AutoCompleteModule} from "primeng/autocomplete";
import {trigger} from "@angular/animations";

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
  ],
  animations : [
    trigger('overlayContentAnimation', [
      // ... your animation configurations ...
    ]),
  ],
  standalone: true
})
export class CitiesComponent {
  items: any[] | undefined;

  selectedItem: any;

  suggestions: any[] = ["france", "brest"];

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = ["france", "brest"];
  }
}
