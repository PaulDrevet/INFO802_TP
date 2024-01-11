import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import { ListboxModule } from 'primeng/listbox';
import {cacheExchange, createClient, fetchExchange} from "@urql/core";
import gql from "graphql-tag";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgOptimizedImage,
    ListboxModule,
    FormsModule
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit {
  title = 'project';

  private client: any;
  data: any;
  vehicleList: any;
  selectedVehicle: any;

  ngOnInit() {
    this.getVehicle();
  }

  getVehicle() : void {
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

    this.getVehicleList({ page: 0, size: 100 });
  }

  getVehicleList({ page, size = 10, search = '' }: { page: number; size?: number; search?: string }): void {

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
      `, { page, size, search })
      .toPromise()
      .then((response :any) => {
        const { data, error } = response;
        if (error) {
          console.log(error);
        } else {
          console.log(data);
          console.log(data.vehicleList);
          console.log(data.vehicleList.length);
          this.vehicleList = data.vehicleList;
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  getMaxHeight(): string {
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const maxHeightPercentage = 90;
    return (screenHeight * maxHeightPercentage / 100) + 'px';
  }
}
