import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GeonamesService } from '@app/shared/services/geonames.service';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'environments/environment.development';

@Component({
  selector: 'be-address-group',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, NgbPopoverModule, CommonModule],
  templateUrl: './address-group.component.html',
  styleUrl: './address-group.component.scss'
})
export class AddressGroupComponent implements OnInit {

  @Input({ required: true }) form!: FormGroup;
  @Input() isCompany: boolean = false;

  public defaultCountryCode: string = environment.address.defaultCountry;
  public disableCountryChange: boolean = environment.address.disableCountryChange;

  public countries = environment.address.countries;

  public regions: Region[] = [];
  public cities: City[] = [];

  constructor(private geonamesService: GeonamesService) {
  }

  ngOnInit(): void {
    if (this.defaultCountryCode) {
      if (this.form.get('country')?.value != this.defaultCountryCode) {
        this.form.patchValue({ country: this.defaultCountryCode });
      }
    }

    this.getRegions();
    this.getCities(this.form.get('region')?.value);
    
    if(this.disableCountryChange) {
      this.form.get('country')?.disable();
    }
  }

  public onCountrySelect(event: any): void {
    this.regions = [];
    this.cities = [];

    this.form.patchValue({ region: null });
    this.form.patchValue({ city: null });

    const countryCode = event.target.value;
    this.geonamesService.getCountryGeoId(countryCode).subscribe(geonameId => {
      if (geonameId) {
        this.geonamesService.getRegions(geonameId).subscribe(regions => {
          this.regions = regions;
        });
      }
    });
  }

  public onRegionSelect(event: any): void {
    const regionGeoId = event.target.value;
    if (regionGeoId) {
      this.getCities(regionGeoId);
    }
  }

  private getRegions(): void {
    if (!this.defaultCountryCode) {
      this.regions = [];
      this.cities = [];
    } else {
      this.geonamesService.getCountryGeoId(this.defaultCountryCode).subscribe(geonameId => {
        if (geonameId) {
          this.geonamesService.getRegions(geonameId).subscribe(regions => {
            this.regions = regions;
          });
        }
      });
    }
  }

  private getCities(regionGeoId: number): void {
    if (!regionGeoId) {
      this.cities = [];
    } else {
      this.geonamesService.getCities(regionGeoId).subscribe(cities => {
        this.cities = cities;
      });
    }
  }

}

export interface Region {
  geonameId: number;
  toponymName: string;
}

export interface City {
  geonameId: number;
  name: string;
}