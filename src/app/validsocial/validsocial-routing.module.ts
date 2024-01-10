import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidsocialPage } from './validsocial.page';

const routes: Routes = [
  {
    path: '',
    component: ValidsocialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidsocialPageRoutingModule {}
