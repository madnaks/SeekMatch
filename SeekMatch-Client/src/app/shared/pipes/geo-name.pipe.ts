import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { GeonamesService } from '../services/geonames.service';

@Pipe({
  name: 'geoName',
  pure: false,
})
export class GeoNamePipe implements PipeTransform {
    private cache = new Map<number, Observable<string>>(); // Caching to avoid multiple requests
  
    constructor(private geoNamesService: GeonamesService) {}
  
    transform(geoId: number | null): Observable<string> {
      if (!geoId) return of('-');
  
      if (!this.cache.has(geoId)) {
        this.cache.set(
          geoId,
          this.geoNamesService.getGeoNameById(geoId).pipe(
            map(data => data?.name || 'Unknown'),
            shareReplay(1)
          )
        );
      }
  
      return this.cache.get(geoId)!;
    }
  }
  