import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidsocialPageRoutingModule } from './validsocial-routing.module';

import { ValidsocialPage } from './validsocial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidsocialPageRoutingModule
  ],
  declarations: [ValidsocialPage]
})
export class ValidsocialPageModule {}
