
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    getCities(countryCode: string): Observable<any> {
        // Set the country code dynamically in the URL
        const url = `http://api.geonames.org/searchJSON?username=${this.username}&country=${countryCode}&featureClass=P`;
        return this.http.get<any>(url);
    }
}
