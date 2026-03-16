import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICars, IUsers } from '../models/system.model';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private readonly API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  postReserveCar(carId: string, userId: string) {
    return this.getFindCarById(carId).pipe(
      switchMap((car) =>
        this.postUpdateCar(car.id, { ...car, isReserved: true }),
      ),

      switchMap((car) =>
        this.findUserById(userId).pipe(
          tap((user) => {
            user.carReserved = car;

            user.historyReservations.forEach((c) => {
              if (c.id === car.id) {
                return (c.isReserved = true);
              }
              return user.historyReservations.push(car);
            });

            this.updateUser(user).subscribe();
          }),
        ),
      ),
    );
  }

  cancelReservation(userId: string, carId: string) {
    return this.findUserById(userId).pipe(
      tap((user) => {
        user.historyReservations.forEach((car) => {
          if (car.id === carId) {
            car.isReserved = false;
          }
        });
        user.carReserved = null;
        this.updateUser(user).subscribe({
          complete: () => {
            this.getFindCarById(carId)
              .pipe(tap((car) => (car.isReserved = false)))
              .subscribe((car) => {
                this.postUpdateCar(car.id, car).subscribe();
              });
          },
        });
      }),
    );
  }

  listOfCars() {
    return this.http.get<ICars[]>(this.API + '/cars');
  }

  getFindCarById(id: string) {
    return this.http.get<ICars>(this.API + '/cars/' + id);
  }

  deleteCar(id: string) {
    return this.http.delete<ICars>(this.API + '/cars/' + id);
  }

  postUpdateCar(id: string, car: ICars) {
    return this.http.put<ICars>(this.API + '/cars/' + id, car);
  }

  postCreateCar(car: ICars) {
    return this.http.post<ICars>(this.API + '/cars', car);
  }

  listOfUsers() {
    return this.http.get<IUsers[]>(this.API + '/users');
  }

  findUserById(id: string) {
    return this.http.get<IUsers>(this.API + '/users/' + id);
  }

  createUser(
    user: string,
    password: string,
    callback: (userObject: IUsers) => void,
  ): void {
    const userObj: IUsers = {
      id: crypto.randomUUID(),
      user,
      password,
      bookIt: false,
      historyReservations: [],
      carReserved: null,
      photo: null,
    };
    this.http
      .post<IUsers>(this.API + '/users', userObj)
      .subscribe((createdUser) => {
        callback(createdUser);
      });
  }

  updateUser(user: IUsers) {
    return this.http.put<IUsers>(this.API + '/users/' + user.id, user);
  }

  deleteUser(id: string) {
    return this.http.delete<IUsers>(this.API + '/users/' + id);
  }
}
