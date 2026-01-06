import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Education } from '../models/education';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  private readonly apiUrl = 'https://localhost:7216/api/Education';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  getAll(): Observable<any> {
    return this.http.get<Education[]>(`${this.apiUrl}`);
  }

  create(education: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, education);
  }

  update(education: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, education);
  }

  delete(educationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${educationId}`);
  }

  getDurationString(education: Education): string {
    if (education.currentlyStudying) {
      return this.getMonthName(education.startMonth) + ' ' + education.startYear + ' - '
        + this.translate.instant('Date.Today');
    } else if (education.endMonth > 0 && education.endYear > 0) {
      return this.getMonthName(education.startMonth) + ' ' + education.startYear + ' - '
        + this.getMonthName(education.endMonth) + ' ' + education.endYear
    } else {
      return this.getMonthName(education.startMonth) + ' ' + education.startYear
    }
  }

  public getMonthName(monthId: number): string {
    const month = months.find(m => m.id === monthId);
    return month ? this.translate.instant(month.value) : '';
  }

}
