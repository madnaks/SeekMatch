import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Experience } from '../models/experience';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  private readonly apiUrl = 'https://localhost:7216/api/Experience';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  getAll(): Observable<any> {
    return this.http.get<Experience[]>(`${this.apiUrl}`);
  }

  create(experience: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, experience);
  }

  update(experience: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, experience);
  }

  delete(experienceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${experienceId}`);
  }

  public getExperienceDuration(experience: Experience): string {
    if (experience.currentlyWorking) {
      return this.getMonthName(experience.startMonth) + ' ' + experience.startYear + ' - '
        + this.translate.instant('Date.Today');
    } else if (experience.endMonth > 0 && experience.endYear > 0) {
      return this.getMonthName(experience.startMonth) + ' ' + experience.startYear + ' - '
        + this.getMonthName(experience.endMonth) + ' ' + experience.endYear
    } else {
      return this.getMonthName(experience.startMonth) + ' ' + experience.startYear
    }
  }

  public getMonthName(monthId: number): string {
    const month = months.find(m => m.id === monthId);
    return month ? this.translate.instant(month.value) : '';
  }

}
