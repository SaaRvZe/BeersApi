import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, Observable, of, tap, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from '../Components/Shared/confirm-modal/confirm-modal.component';
import { Beer } from '../Model/beer';
import { UtilService } from './util.service';




@Injectable({
  providedIn: 'root'
})

export class BeerService {
  favorites$ = new BehaviorSubject<Map<number, Beer>>(new Map<number, Beer>());
  browse = new Map<any, Beer[]>();

  favoritesLS = 'favorites'; // for favorites local storage
  browseLS = 'browse'; // for search result local storage
  lastPageLS = 'lastPage'; // save last page for refresh
  lastFoodLS = 'lastFood'; // save last food for refresh
  constructor(private http: HttpClient, public dialog: MatDialog, 
    private _snackBar: MatSnackBar, private utilService: UtilService) {
    this.initCache();    
  }

  get favorites(): Observable<Map<number, Beer>> {
    return this.favorites$.asObservable();
  }

  getBeers(foodPairing: string = '', page: number = 1,): Observable<Beer[]> {  
    const queryParams = {
      per_page: environment.beersPerPage,
      ...(foodPairing ? {food: foodPairing}: {}), // if there is value then add 'food' property
      page: page
    }

    const browseKey = foodPairing + page; // create the Map key to find cached results
    if(this.browse.get(browseKey)) {
      console.log('from cache');
      this.setBrowseCache(page.toString(), foodPairing);
      return of(this.browse.get(browseKey) ?? []);
    }

    return this.http.get<Beer[]>(`${environment.beerHost}/beers`, {params: queryParams}).pipe(tap((beers: Beer[]) => {
      this.browse.set(browseKey, beers);
      localStorage.setItem(this.browseLS, this.utilService.stringifyMap(this.browse));
      this.setBrowseCache(page.toString(), foodPairing);

    }), catchError((err: any) => {
      // Would use interceptor or handle in more specific way
      this._snackBar.open('An error occured please try again!', 'Ok!');
      return of([])
    }));
  }

  setBrowseCache(lastPage: string, lastFood: string) {
    localStorage.setItem(this.lastPageLS, lastPage);
    localStorage.setItem(this.lastFoodLS, lastFood);
  }

  isFavorite(beerId: number): Observable<boolean> {
    return this.favorites$.pipe(map((fav: Map<number, Beer>) => !!fav.get(beerId)))
  }

  toggleFavorites(beer: Beer) {
    const oldValue = structuredClone(this.favorites$.value);

    // deletes from favorites, if it didnt exist then add to favorites
    if (!this.favorites$.value.delete(beer.id)) {
      this.favorites$.value.set(beer.id, beer);      
    } else {   
      this.promptUndoRemoveFavorite(oldValue);
    }
    
    this.favorites$.next(this.favorites$.value);
    localStorage.setItem(this.favoritesLS, this.utilService.stringifyMap(this.favorites$.value));
  }

  removeAllFavorites() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '250px',
      data: 'Are you sure you wanna remove all favorite beers?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result === true) {
        const oldValue = structuredClone(this.favorites$.value);
        this.favorites$.next(new Map<number, Beer>())
        localStorage.setItem(this.favoritesLS, this.utilService.stringifyMap(this.favorites$.value));
        this.promptUndoRemoveFavorite(oldValue);
      }
    });

  }

  promptUndoRemoveFavorite(oldValue: Map<number, Beer>) {
    const snackRef = this._snackBar.open('Successfuly deleted :)', 'Undo');
    snackRef.onAction().subscribe(() => {
      this.favorites$.next(oldValue);
      localStorage.setItem(this.favoritesLS, this.utilService.stringifyMap(this.favorites$.value));
    })
  }


  // set values from local storage
  initCache() {
    if( this.favoritesLS in localStorage) {
      const favorites = this.utilService.parseMapString(localStorage.getItem(this.favoritesLS) ?? '{}');
      if(favorites instanceof Map) {
        this.favorites$.next(favorites);
      }
    }

    if(localStorage.getItem(this.browseLS)) {
      this.browse = this.utilService.parseMapString(localStorage.getItem(this.browseLS) ?? '{}')
    }
  }
}
