import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUsers } from '../../../models/system.model';
import { AuthService } from '../../../services/Auth.service';
import { BackendService } from '../../../services/backend.service';
@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  editForm: FormGroup;
  warningAlert = '';

  userInformations = {
    user: '',
    photo: '',
    password: '',
  };

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.editForm = this.fb.group({
      user: [''],
      password: [''],
      photo: [''],
    });
  }

  ngOnInit(): void {
    this.userInformations = {
      user: this.authService.userInformations()!.user,
      photo:
        this.authService.userInformations()?.photo ||
        'https://cdn-icons-png.flaticon.com/512/219/219969.png',
      password: this.authService.userInformations()!.password,
    };
  }

  editUser() {
    this.warningAlert = '';

    const userUpdated: IUsers = {
      bookIt: this.authService.userInformations()!.bookIt,
      carReserved: this.authService.userInformations()!.carReserved,
      historyReservations:
        this.authService.userInformations()!.historyReservations,
      id: this.authService.userInformations()!.id,
      user:
        this.editForm.value.user.trim().length > 0
          ? this.editForm.value.user
          : this.userInformations.user,
      password:
        this.editForm.value.password.trim().length > 0
          ? this.editForm.value.password
          : this.userInformations.password,
      photo: this.editForm.value.photo,
    };

    this.backendService.listOfUsers().subscribe((users) => {
      const searchUserOnDB = users.find(
        (u) => u.user === this.editForm.value.user,
      );
      !searchUserOnDB
        ? this.backendService.updateUser(userUpdated).subscribe((user) => {
            this.warningAlert = 'Usuário atualizado com sucesso';
            setTimeout(() => {
              this.warningAlert = '';
            }, 3000);
            this.editForm.reset();
          })
        : (this.warningAlert = 'Este nome de usuário já está em uso');
    });
  }

  deleteUser() {
    this.backendService
      .deleteUser(this.authService.userInformations()!.id)
      .subscribe({
        complete: () => {
          this.authService.logout();
        },
      });
  }
}
