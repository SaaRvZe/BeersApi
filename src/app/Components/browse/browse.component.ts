import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Beer } from 'src/app/Model/beer';
import { BeerService } from 'src/app/Services/beer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  beers$?: Observable<Beer[]>;
  pageSize = environment.beersPerPage;
  pageIndex = 0;
  constructor(private beerService: BeerService) { 
    this.getBeers();
 }

  ngOnInit(): void {
  }

  getBeers(event?: PageEvent) {
    //Todo add food
    const index = event?.pageIndex ? event?.pageIndex + 1 : 1;
    this.beers$ = this.beerService.getBeers('', index);
  }

}
