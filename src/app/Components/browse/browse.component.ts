import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Observable, switchMap } from 'rxjs';
import { Beer } from 'src/app/Model/beer';
import { BeerService } from 'src/app/Services/beer.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { BeerModalService } from 'src/app/Services/beer-modal.service';
import { ViewChild } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  beers$!: Observable<Beer[]>;
  pageSize = environment.beersPerPage;
  pageIndex = 0;
  foodControl = new FormControl('');
  search$ = new BehaviorSubject<string>('');
  index$ = new BehaviorSubject<number>(1);

  constructor(private beerService: BeerService, private beerModalService: BeerModalService) {}

  ngOnInit(): void {
    this.checkForLastPageVisited();
    this.initListeners();
  }


  onSearch(): void {
    this.search$.next(this.foodControl.value ?? '');
    this.paginator.firstPage();
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

  checkForLastPageVisited() {
    const lastPage = localStorage.getItem(this.beerService.lastPageLS);
    const lastFood = localStorage.getItem(this.beerService.lastFoodLS);
    if(lastPage) {
      this.index$.next(+lastPage)
      this.pageIndex = +lastPage - 1; //paginator starts with 0 and the api with 1
    }

    if(lastFood) {
      this.foodControl.setValue(lastFood);
      this.search$.next(lastFood);
    }

    console.log(lastPage, lastFood);
    
  }

}
