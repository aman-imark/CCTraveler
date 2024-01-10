import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountriesComparisonPageRoutingModule } from './countries-comparison-routing.module';

import { CountriesComparisonPage } from './countries-comparison.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountriesComparisonPageRoutingModule
  ],
  declarations: [CountriesComparisonPage]
})
export class CountriesComparisonPageModule {}
