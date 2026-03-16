import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive, RouterModule, Routes } from '@angular/router';
import { OrdersPageComponent } from '../orders-page/orders-page.component';
import { ProfilePageComponent } from '../profile-page/profile-page.component';
import { SuportPageComponent } from '../suport-page/suport-page.component';
import { HomeComponent } from './home.component';
import { FiltersPageComponent } from '../../filters-page/filters-page.component';

const rotas: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'order',
    component: OrdersPageComponent,
  },
  {
    path: 'suport',
    component: SuportPageComponent,
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
  },
  {
    path: 'filters',
    component: FiltersPageComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(rotas),
    FormsModule,
    RouterLinkActive,
  ],
})
export class HomeModule {}
