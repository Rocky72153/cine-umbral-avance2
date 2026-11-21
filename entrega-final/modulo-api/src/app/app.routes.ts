import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CinemaMain } from './cinema-main/cinema-main';
import { CinemaPruchase } from './cinema-pruchase/cinema-pruchase';

export const routes: Routes = [
  { path: '', component: CinemaMain },
  { path: 'cinema-pruchase', component: CinemaPruchase },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
