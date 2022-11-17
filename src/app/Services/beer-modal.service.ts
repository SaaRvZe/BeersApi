import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BeerModalComponent } from '../Components/beer-modal/beer-modal.component';
import { Beer } from '../Model/beer';

@Injectable({
  providedIn: 'root'
})
export class BeerModalService {

  constructor( public dialog: MatDialog) { }

  openDialog(beer: Beer): void {
    const dialogRef = this.dialog.open(BeerModalComponent, {
      width: '60%',
      data: beer,
    });
  }
}
