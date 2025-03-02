
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GeonamesService {
    private username = 'madnaks';

    constructor(private http: HttpClient) { }

    getCountries(): Observable<any> {
        const url = `http://api.geonames.org/countryInfoJSON?username=${this.username}`;
        return this.http.get<any>(url);
    }

    getCountryGeoId(countryCode: string): Observable<number | null> {
        const url = `http://api.geonames.org/searchJSON?username=${this.username}&q=${countryCode}&featureClass=A&maxRows=1`;
        return this.http.get<any>(url).pipe(
            map(response => response.geonames?.[0]?.geonameId || null)
        );
    }

    getRegions(countryGeoId: number): Observable<any[]> {
        const url = `http://api.geonames.org/childrenJSON?geonameId=${countryGeoId}&username=${this.username}`;
        return this.http.get<any>(url).pipe(
            map(response => response.geonames || [])
        );
    }

    getCities(provinceGeoId: number): Observable<any[]> {
        if (!provinceGeoId) return of([]);

        const url = `http://api.geonames.org/childrenJSON?geonameId=${provinceGeoId}&username=${this.username}`;
        return this.http.get<any>(url).pipe(
            map(response => response.geonames || [])
        );
    }

    getRegionByGeonameId(regionGeonameId: number): Observable<any> {
        const url = `http://api.geonames.org/childrenJSON?geonameId=${regionGeonameId}&username=${this.username}`;
        return this.http.get<any>(url).pipe(
            map(response => response || null)
        );
    }

    getCityByGeonameId(cityGeonameId: number): Observable<any> {
        const url = `http://api.geonames.org/childrenJSON?geonameId=${cityGeonameId}&username=${this.username}`;
        return this.http.get<any>(url).pipe(
            map(response => response || null)
        );
    }
}
