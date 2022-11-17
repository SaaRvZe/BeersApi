import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable, switchMap } from 'rxjs';
import { Beer } from 'src/app/Model/beer';
import { BeerService } from 'src/app/Services/beer.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { BeerModalService } from 'src/app/Services/beer-modal.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  beers$!: Observable<Beer[]>;
  pageSize = environment.beersPerPage;
  pageIndex = 0;
  foodControl = new FormControl('');
  search$ = new BehaviorSubject<string>('');
  index$ = new BehaviorSubject<number>(1);

  constructor(private beerService: BeerService, private beerModalService: BeerModalService) {}

  ngOnInit(): void {
    this.initListeners();
  }


  onSearch(): void {
    this.search$.next(this.foodControl.value);
  }

  onPageChange(event: PageEvent): void {
    this.index$.next(event.pageIndex + 1);
  }

  initListeners() {
    this.beers$ = combineLatest([this.search$, this.index$]).pipe(switchMap(([food, index]) => this.beerService.getBeers(food, index)));
  }

  openDialog(beer: Beer) {
    this.beerModalService.openDialog(beer)
  }

}
