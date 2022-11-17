import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from '../Components/confirm-modal/confirm-modal.component';
import { Beer } from '../Model/beer';




@Injectable({
  providedIn: 'root'
})

export class BeerService {
  favorites$ = new BehaviorSubject<Map<number, Beer>>(new Map<number, Beer>());
  browse = new Map<any, Beer[]>();

  favoritesLS = 'favorites'; // for favorites local storage
  browseLS = 'browse'; // for search result local storage
  lastPageBrowseKeyLS = 'lastPage'; // save last page for refresh
  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar) {
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

    const browseKey = foodPairing + page;
    if(this.browse.get(browseKey)) {
      console.log('from cache');
      
      return of(this.browse.get(browseKey) ?? []);
    }

    return this.http.get<Beer[]>(`${environment.beerHost}/beers`, {params: queryParams}).pipe(tap(beers => {
      this.browse.set(browseKey, beers);
      localStorage.setItem(this.browseLS, this.stringifyMap(this.browse));
      localStorage.setItem(this.lastPageBrowseKeyLS, browseKey);
    }));
  }


  isFavorite(beerId: number): Observable<boolean> {
    return this.favorites$.pipe(map((fav: Map<number, Beer>) => !!fav.get(beerId)))
  }

  toggleFavorites(beer: Beer) {
    // deletes from favorites, if it didnt exist then add to favorites
    if (!this.favorites$.value.delete(beer.id)) {
      this.favorites$.value.set(beer.id, beer);      
    } else {
      const oldValue = structuredClone(this.favorites$.value);
      this.promptUndoRemoveFavorite(oldValue);
    }
    
    this.favorites$.next(this.favorites$.value);
    localStorage.setItem(this.favoritesLS, this.stringifyMap(this.favorites$.value));
  }

  removeAllFavorites() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '250px',
      data: 'Are you sure you wanna remove all favorite beers?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        const oldValue = structuredClone(this.favorites$.value);
        this.favorites$.next(new Map<number, Beer>())
        localStorage.setItem(this.favoritesLS, this.stringifyMap(this.favorites$.value));
        this.promptUndoRemoveFavorite(oldValue);
      }
    });

  }

  promptUndoRemoveFavorite(oldValue: Map<number, Beer>) {
    const snackRef = this._snackBar.open('Successfuly deleted :)', 'Undo');
    snackRef.onAction().subscribe(() => {
      this.favorites$.next(oldValue);
      localStorage.setItem(this.favoritesLS, this.stringifyMap(this.favorites$.value));
    })
  }


  // set values from local storage
  initCache() {
    if( this.favoritesLS in localStorage) {
      const favorites = this.parseMapString(localStorage.getItem(this.favoritesLS) ?? '{}');
      if(favorites instanceof Map) {
        this.favorites$.next(favorites);
      }
    }

    if(localStorage.getItem(this.browseLS)) {
      this.browse = this.parseMapString(localStorage.getItem(this.browseLS) ?? '{}')
    }
  }




  stringifyMap(map: Map<any, any>): string {
    return JSON.stringify(map, this.replacer)
  }

  parseMapString(mapString: string): Map<any, any> {
    return JSON.parse(mapString, this.reviver)
  }

  ///// support Map JSON.stringify
  replacer(key: any, value: any) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }

  ///// Suppoer Map JSON.parse
  reviver(key: any, value: any) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

}
