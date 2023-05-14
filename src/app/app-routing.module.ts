import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArkanoidComponent } from './arkanoid/arkanoid.component';

const routes: Routes = [
  { path: 'game', component: ArkanoidComponent },
  { path: '*', component: ArkanoidComponent },
  { path: '', component: ArkanoidComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
