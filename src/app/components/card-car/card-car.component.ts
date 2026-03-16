import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ICars, TNavigations } from '../../models/system.model';
import { AuthService } from '../../services/Auth.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-card-car',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-car.component.html',
  styleUrl: './card-car.component.css',
})
export class CardCarComponent implements OnInit {
  editForm: FormGroup;
  @Output() updated = new EventEmitter<void>();
  @Input() carItem: ICars = {
    name: '',
    year: '',
    type: '',
    engine: '',
    size: '',
    isReserved: false,
    id: '',
  };
  carReserved: ICars | null = null;
  endpoint: TNavigations = 'home';
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private authService: AuthService,
    private route: Router,
  ) {
    this.editForm = this.fb.group({
      name: [''],
      year: [''],
      type: [''],
      engine: [''],
      size: [''],
    });
  }

  ngOnInit(): void {
    this.endpoint = this.route.url.split('/').at(-1) as TNavigations;
    this.getCarReserved(this.authService.userInformations()!.id);
  }

  getCarReserved(userId: string) {
    this.backendService
      .findUserById(userId)
      .subscribe((user) => (this.carReserved = user.carReserved));
  }

  deleteCar() {
    this.backendService
      .deleteCar(this.carItem.id)
      .subscribe(() => this.updated.emit());
  }

  reserveCar() {
    this.backendService
      .postReserveCar(this.carItem.id, this.authService.userInformations()!.id)
      .subscribe(() =>
        setTimeout(() => {
          this.updated.emit();
        }),
      );
  }

  cancelEditingCar() {
    this.isEditing = false;
    this.editForm.reset();
  }

  clickEditCar() {
    this.isEditing = true;
  }

  postEditCar() {
    const car: ICars = {
      id: this.carItem.id,
      name:
        this.editForm.value.name.trim().length > 0
          ? this.editForm.value.name
          : this.carItem.name,
      year:
        this.editForm.value.year.trim().length > 0
          ? this.editForm.value.year
          : this.carItem.year,
      type:
        this.editForm.value.type.trim().length > 0
          ? this.editForm.value.type
          : this.carItem.type,
      engine:
        this.editForm.value.engine.trim().length > 0
          ? this.editForm.value.engine
          : this.carItem.engine,
      size:
        this.editForm.value.size.trim().length > 0
          ? this.editForm.value.size
          : this.carItem.size,
      isReserved: this.carItem.isReserved,
    };
    this.backendService.postUpdateCar(this.carItem.id, car).subscribe(() => {
      (setTimeout(() => {
        this.updated.emit();
      }),
        (this.isEditing = false));
    });
  }
}
