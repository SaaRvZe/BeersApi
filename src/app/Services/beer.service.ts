import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Beer } from '../Model/beer';

@Injectable({
  providedIn: 'root'
})


export class BeerService {

  constructor(private http: HttpClient) { }

  getBeers(foodPairing: string = '', page: number = 1,): Observable<Beer[]> {

    
    const queryParams = {
      per_page: environment.beersPerPage,
      ...(foodPairing ? {food: foodPairing}: {}), // if there is value then add 'food' property
      page: page
    }

    return this.http.get<Beer[]>(`${environment.beerHost}/beers`, {params: queryParams});
  }
}
