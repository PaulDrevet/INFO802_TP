import { Component, OnInit } from '@angular/core';
import {VehicleListComponent} from "./vehicle-list/vehicle-list.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    VehicleListComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project';

}
