import { Injectable, signal } from '@angular/core';
import { BackendService } from './backend.service';
import { IUsers } from '../models/system.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = signal<boolean>(false);
  userLogged = signal<IUsers | null>(null);

  constructor(
    private service: BackendService,
    private router: Router,
  ) {}

  login(name: string, password: string, callback: (logado: boolean) => void) {
    this.service.listOfUsers().subscribe((users) => {
      const user = users.find(
        (u) => u.user === name && u.password === password,
      );

      this.isLoggedIn.set(!!user);
      !!user &&
        this.userLogged.set({
          id: user.id,
          user: user.user,
          password: user.password,
          bookIt: user.bookIt,
          historyReservations: user.historyReservations,
          carReserved: user.carReserved,
          photo: user.photo,
        });
      callback(this.isLoggedIn());
    });
  }

  register(
    user: string,
    password: string,
    passwordConfirmed: string,
    callback: (Register: string) => void,
  ) {
    this.service.listOfUsers().subscribe((users) => {
      const searchUserOnDB = users.find((u) => u.user === user);

      searchUserOnDB
        ? callback('Este nome de usuário já está sendo usado')
        : password === passwordConfirmed
          ? (this.service.createUser(user, password, (userObj) => {
              this.userLogged.set(userObj);
            }),
            this.isLoggedIn.set(true),
            callback('true'))
          : (callback('As senhas não conferem'), this.isLoggedIn.set(false));
    });
  }

  logout() {
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  isLogged() {
    return this.isLoggedIn();
  }

  userInformations() {
    return this.userLogged();
  }
}
