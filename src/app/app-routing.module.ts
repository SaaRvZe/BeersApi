import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './Components/browse/browse.component';
import { FavoritesComponent } from './Components/favorites/favorites.component';

const routes: Routes = [
  {path: 'browse', component: BrowseComponent},
  {path: 'favorites', component: FavoritesComponent},
  {path: '**', redirectTo: 'browse'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
