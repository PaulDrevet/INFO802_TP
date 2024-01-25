import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ListboxModule} from 'primeng/listbox';
import {cacheExchange, createClient, fetchExchange} from "@urql/core";
import gql from "graphql-tag";
import {FormsModule} from "@angular/forms";
import {DialogModule} from 'primeng/dialog';
import {VehicleService} from "../vehicle.service";
import {list} from './vehicles-json';

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

  constructor(private vehicleService: VehicleService) {}


  async showDetail(event : Event,vehicleId: any) {
    event.stopPropagation();
    this.detailVehicle = await this.getVehicleDetail(vehicleId);
    this.visible = true;
  }

  async shareVehicle(vehicleId : string) : Promise<void>{
    const v = this.getVehicleDetail(vehicleId)
    this.vehicleService.setSelectedVehicle(v);
  }

  ngOnInit() {
    //this.getVehicleList();
    this.vehicleList = list;
  }

  async getVehicleDetail(vehiculeId: any): Promise<any> {
    const headers = {
      'x-client-id': "65b21034082e3c09d1c2eeff",
      'x-app-id': "65b21034082e3c09d1c2ef01"
    };

    this.client = createClient({
      url: 'https://api.chargetrip.io/graphql',
      fetchOptions: {
        method: 'POST',
        headers,
      },
      exchanges: [fetchExchange, cacheExchange],
    });

    try {
      return await this.retrieveVehicleDetail(vehiculeId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async retrieveVehicleDetail(vehicleId: string): Promise<any> {
    return this.client
      .query(gql`
        query vehicle {
  vehicle(id: "${vehicleId}") {
    id
    naming {
      make
      model
      version
      edition
      chargetrip_version
    }
    drivetrain {
      type
    }
    connectors {
      standard
      power
      max_electric_power
      time
      speed
    }
    adapters {
      standard
      power
      max_electric_power
      time
      speed
    }
    battery {
      usable_kwh
      full_kwh
    }
    body {
      width
      height
      weight {
        minimum
        nominal
        maximal
      }
      seats
    }
    availability {
      status
    }
    performance {
      acceleration
      top_speed
    }
    range {
      provider
      provider_is_estimated
      worst{
        highway
        city
        combined
      }
      best {
        highway
        city
        combined
      }
      chargetrip_range {
        best
        worst
      }
    }
    media {
      image {
        id
        type
        url
        height
        width
        thumbnail_url
        thumbnail_height
        thumbnail_width
      }
      brand {
        id
        type
        url
        height
        width
        thumbnail_url
        thumbnail_height
        thumbnail_width
      }
      image_list {
        id
        type
        url
        height
        width
        thumbnail_url
        thumbnail_height
        thumbnail_width
      }
      video {
        id
        url
      }
      video_list {
        id
        url
      }
    }
    routing {
      fast_charging_support
    }
    connect {
      providers
    }
  }
}
      ` )
      .toPromise()
      .then((response: any) => {
        const { data, error } = response;
        if (error) {
          console.log(error);
          throw error; // Propager l'erreur pour être capturée dans le bloc catch
        } else {
          return data.vehicle;
        }
      });
  }


  getVehicleList(): void {
    const headers = {
      'x-client-id': "65b21034082e3c09d1c2eeff",
      'x-app-id': "65b21034082e3c09d1c2ef01"
    };

    this.client = createClient({
      url: 'https://api.chargetrip.io/graphql',
      fetchOptions: {
        method: 'POST',
        headers,
      },
      exchanges: [fetchExchange, cacheExchange],
    });

    this.retrieveVehicleList({page: 0, size: 100});
  }

  retrieveVehicleList({page, size = 10, search = ''}: { page: number; size?: number; search?: string }): void {

    this.client
      .query(gql`
        query vehicleList($page: Int, $size: Int, $search: String) {
          vehicleList(
            page: $page,
            size: $size,
            search: $search,
          ) {
            id
            naming {
              make
              model
              chargetrip_version
            }
            media {
              image {
                thumbnail_url
              }
            }
          }
        }
      `, {page, size, search})
      .toPromise()
      .then((response: any) => {
        const {data, error} = response;
        if (error) {
          console.log(error);
        } else {
          this.vehicleList = data.vehicleList;
          console.log(this.vehicleList)
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  getMaxHeight(): string {
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const maxHeightPercentage = 96;
    return (screenHeight * maxHeightPercentage / 100) + 'px';
  }
}
