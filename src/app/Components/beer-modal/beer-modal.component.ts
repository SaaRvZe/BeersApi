import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Beer } from 'src/app/Model/beer';

@Component({
  selector: 'app-beer-modal',
  templateUrl: './beer-modal.component.html',
  styleUrls: ['./beer-modal.component.scss']
})
export class BeerModalComponent implements OnInit {
  beer: Beer;
  constructor(public dialogRef: MatDialogRef<BeerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Beer) {
      this.beer = data;
     }

  ngOnInit(): void {
  }

}
