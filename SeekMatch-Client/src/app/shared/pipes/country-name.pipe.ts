import { Pipe, PipeTransform } from '@angular/core';
import { countries } from '../constants/constants';

@Pipe({
  name: 'countryName'
})

export class CountryNamePipe implements PipeTransform {
  transform(countryCode: string): string {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  }
}