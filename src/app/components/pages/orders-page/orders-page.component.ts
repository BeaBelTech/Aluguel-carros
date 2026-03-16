import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ICars } from '../../../models/system.model';
import { AuthService } from '../../../services/Auth.service';
import { BackendService } from '../../../services/backend.service';
import { CardCarComponent } from '../../card-car/card-car.component';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CardCarComponent, CommonModule],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css',
})
export class OrdersPageComponent implements OnInit {
  userInformations = {
    user: '',
    photo: '',
  };
  carReserved: ICars | null = null;
  infoMessage = '';

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.getCarReserved(this.authService.userInformations()!.id);

    this.userInformations = {
      user: this.authService.userInformations()!.user,
      photo:
        this.authService.userInformations()?.photo ||
        'https://cdn-icons-png.flaticon.com/512/219/219969.png',
    };
  }

  getCarReserved(userId: string) {
    this.backendService
      .findUserById(userId)
      .subscribe((user) => (this.carReserved = user.carReserved));
  }

  cancelReserve() {
    this.backendService
      .cancelReservation(
        this.authService.userInformations()!.id,
        this.carReserved!.id,
      )
      .subscribe({
        next: () => {
          this.infoMessage = 'Reserva cancelada com sucesso';
          //workhand (não é o ideal, mas funciona = gambiarra)
          this.getCarReserved(this.authService.userInformations()!.id);
          setTimeout(
            () => (
              (this.infoMessage = ''),
              this.getCarReserved(this.authService.userInformations()!.id)
            ),
            1000,
          );
        },
      });
  }
}
