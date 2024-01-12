import { Component, OnInit } from '@angular/core';
import {VehicleListComponent} from "./vehicle-list/vehicle-list.component";
import {CitiesComponent} from "./cities/cities.component";
import {MapComponent} from "./map/map.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    VehicleListComponent,
    CitiesComponent,
    MapComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project';

}
