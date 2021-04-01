import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {path : 'login/:token' , component : ListComponent},
  {path : 'list' , component : ListComponent},
  {path : 'home' , component : HomeComponent},
  {path : '**' , pathMatch : 'full' , redirectTo : 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
