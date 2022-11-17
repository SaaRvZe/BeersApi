import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowseComponent } from './Components/browse/browse.component';
import { FavoritesComponent } from './Components/favorites/favorites.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { BeerCardComponent } from './Components/beer-card/beer-card.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { BeerModalComponent } from './Components/beer-modal/beer-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ClickStopPropagationDirective } from './Directives/click-stop-propagation.directive';
import { ConfirmModalComponent } from './Components/confirm-modal/confirm-modal.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BrowseComponent,
    FavoritesComponent,
    BeerCardComponent,
    BeerModalComponent,
    ClickStopPropagationDirective,
    ConfirmModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
