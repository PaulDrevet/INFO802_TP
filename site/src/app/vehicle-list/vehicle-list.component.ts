import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ListboxModule} from 'primeng/listbox';
import {cacheExchange, createClient, fetchExchange} from "@urql/core";
import gql from "graphql-tag";
import {FormsModule} from "@angular/forms";
import { DialogModule } from 'primeng/dialog';


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

  showDetail(event : Event,vehicleId: any) {
    event.stopPropagation();
    this.getVehicleDetail(vehicleId);
    this.visible = true;
  }

  ngOnInit() {
    this.getVehicleList();
  }

  getVehicleDetail(vehiculeId : any): void {
    const headers = {
      'x-client-id': '659fbb1c03f11572e9c6a30a',
      'x-app-id': '659fbb1c03f11572e9c6a30c',
    };

    this.client = createClient({
      url: 'https://api.chargetrip.io/graphql',
      fetchOptions: {
        method: 'POST',
        headers,
      },
      exchanges: [fetchExchange, cacheExchange],
    });
    this.retrieveVehicleDetail(vehiculeId)
  }

  retrieveVehicleDetail(vehicleId: string): void {
    this.detailVehicle = null;

    this.client
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
        const {data, error} = response;
        if (error) {
          console.log(error);
        } else {
          this.detailVehicle = data.vehicle;
          console.log(this.detailVehicle)
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  getVehicleList(): void {
    const headers = {
      'x-client-id': '659fbb1c03f11572e9c6a30a',
      'x-app-id': '659fbb1c03f11572e9c6a30c',
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
    const maxHeightPercentage = 92;
    return (screenHeight * maxHeightPercentage / 100) + 'px';
  }
}
