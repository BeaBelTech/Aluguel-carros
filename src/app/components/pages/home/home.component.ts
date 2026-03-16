import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ICars } from '../../../models/system.model';
import { AuthService } from '../../../services/Auth.service';
import { BackendService } from '../../../services/backend.service';
import { CardCarComponent } from '../../card-car/card-car.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardCarComponent,
    CommonModule,
    ɵInternalFormsSharedModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  historyCars: ICars[] = [];
  carsAvaliable: ICars[] = [];
  resultOfSearch: ICars[] = [];
  carReserved: ICars | null = null;
  userInformations = {
    name: '',
    photo: '',
  };
  carSearched = '';

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getHistoryCars();

    this.getCarsAvailable();

    this.getCarReserved();

    this.userInformations = {
      name: this.authService.userInformations()!.user,
      photo:
        this.authService.userInformations()?.photo ||
        'https://cdn-icons-png.flaticon.com/512/219/219969.png',
    };
  }

  refreshAll() {
    this.getCarReserved();
    this.getHistoryCars();
    this.getCarReserved();
  }
  getCarReserved() {
    this.backendService
      .findUserById(this.authService.userInformations()!.id)
      .subscribe((user) => (this.carReserved = user.carReserved));
  }

  getHistoryCars() {
    this.backendService
      .findUserById(this.authService.userInformations()!.id)
      .subscribe((user) => {
        this.historyCars = [...user.historyReservations];
      });
  }

  getCarsAvailable() {
    this.backendService.listOfCars().subscribe((listCars) => {
      this.carsAvaliable = listCars.filter((c) => !c.isReserved);
    });
  }

  searchCarByName() {
    this.backendService.listOfCars().subscribe((cars) => {
      const search = this.carSearched.toLowerCase().trim();

      const resultado = cars.filter((car) =>
        car.name.toLowerCase().includes(search),
      );

      this.resultOfSearch = resultado;
    });
  }
}
