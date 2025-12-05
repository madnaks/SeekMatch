import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'environments/environment.development';

@Pipe({
  name: 'countryName'
})

export class CountryNamePipe implements PipeTransform {
  transform(countryCode: string): string {
    const country = environment.address.countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  }
}