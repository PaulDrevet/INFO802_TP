import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ListboxModule} from 'primeng/listbox';
import {FormsModule} from "@angular/forms";
import {DialogModule} from 'primeng/dialog';
import {VehicleService} from "../vehicle.service";
import {list} from './vehicles-json';
import axios from "axios";


@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgOptimizedImage,
    ListboxModule,
    FormsModule,
    DialogModule
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit {

  private client: any;
  data: any;
  vehicleList: any;
  selectedVehicle: any;
  detailVehicle: any;

  visible: boolean = false;


  constructor(private vehicleService: VehicleService) {
  }


  async showDetail(event: Event, vehicleId: any) {
    event.stopPropagation();
    this.detailVehicle = await this.getVehicleDetail(vehicleId);
    this.visible = true;
  }

  async selectVehicle(vehicleId: string): Promise<void> {
    const vehicleDetail = await this.getVehicleDetail(vehicleId);
    this.vehicleService.setSelectedVehicle(vehicleDetail);
  }

  ngOnInit() {
    this.getVehicleList().then()
  }

  async getVehicleDetail(vehiculeId: any): Promise<any> {
    const vehicleDetail = await axios.get('http://localhost/vehicle/' + vehiculeId);
    return vehicleDetail.data.data.vehicle;
  }

  async getVehicleList (){
    //const response = await axios.get('http://localhost/vehicle');
    //this.vehicleList = response.data.data.vehicles;
    this.vehicleList = list;
  }


  getMaxHeight(): string {
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const maxHeightPercentage = 96;
    return (screenHeight * maxHeightPercentage / 100) + 'px';
  }
}
