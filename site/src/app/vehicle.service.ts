// vehicle.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Cela garantit que le service est injecté au niveau de l'application
})
export class VehicleService {
  selectedVehicle: any;

  setSelectedVehicle(vehicle: any) {
    this.selectedVehicle = vehicle;
  }

  getSelectedVehicle() {
    return this.selectedVehicle;
  }
}
