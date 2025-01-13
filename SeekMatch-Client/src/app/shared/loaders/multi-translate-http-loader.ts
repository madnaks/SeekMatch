import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private resources: string[]) {}

  getTranslation(lang: string): Observable<any> {
    const requests = this.resources.map(path =>
      this.http.get(`${path}${lang}.json`)
    );
    return forkJoin(requests).pipe(
      map(response => {
        return response.reduce((acc, current) => {
          return { ...acc, ...current };
        }, {});
      })
    );
  }
}
