import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Beer } from 'src/app/Model/beer';
import { BeerModalService } from 'src/app/Services/beer-modal.service';
import { BeerService } from 'src/app/Services/beer.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  beers$!: Observable<Map<number, Beer>>;
  constructor(private beerService: BeerService, private beerModalService: BeerModalService) {
    this.beers$ = beerService.favorites;
   }

  ngOnInit(): void {
  }

  openDialog(beer: Beer) {
    this.beerModalService.openDialog(beer)
  }

  removeAllFavorites() {
    this.beerService.removeAllFavorites();
  }
}
