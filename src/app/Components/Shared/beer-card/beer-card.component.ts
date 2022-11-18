import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Beer } from 'src/app/Model/beer';
import { BeerService } from 'src/app/Services/beer.service';
import { BeerModalComponent } from '../beer-modal/beer-modal.component';

@Component({
  selector: 'app-beer-card',
  templateUrl: './beer-card.component.html',
  styleUrls: ['./beer-card.component.scss']
})
export class BeerCardComponent implements OnInit {
  @Input() beer!: Beer;
  isFavorite$?: Observable<boolean>;
  constructor(private beerService: BeerService) {
  }

  ngOnInit(): void {
    this.isFavorite$ = this.beerService.isFavorite(this.beer.id);
  }

  toggleFavorites(): void {
    this.beerService.toggleFavorites(this.beer);
  }
}
