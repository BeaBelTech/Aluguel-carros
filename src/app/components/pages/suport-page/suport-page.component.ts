import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICars } from '../../../models/system.model';
import { BackendService } from '../../../services/backend.service';
import { CardCarComponent } from '../../card-car/card-car.component';

@Component({
  selector: 'app-suport-page',
  standalone: true,
  imports: [CardCarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './suport-page.component.html',
  styleUrl: './suport-page.component.css',
})
export class SuportPageComponent implements OnInit {
  createForm: FormGroup;
  allCars: ICars[] = [];
  isCreating: boolean = false;

  constructor(
    private backendService: BackendService,
    private fb: FormBuilder,
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required, Validators.minLength(1)],
      year: ['', Validators.required],
      type: ['', Validators.required, Validators.minLength(1)],
      engine: ['', Validators.required, Validators.minLength(1)],
      size: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllCars();
  }

  getAllCars() {
    this.backendService.listOfCars().subscribe((cars) => (this.allCars = cars));
  }

  cancelCreatingCar() {
    this.isCreating = false;
    this.createForm.reset();
  }

  clickCreateCar() {
    this.isCreating = true;
  }

  postRegisterCar() {
    const car: ICars = {
      name: this.createForm.value.name,
      year: this.createForm.value.year,
      type: this.createForm.value.type,
      engine: this.createForm.value.engine,
      size: this.createForm.value.size,
      isReserved: false,
      id: crypto.randomUUID(),
    };
    this.backendService.postCreateCar(car).subscribe(() => {
      (setTimeout(() => {
        this.getAllCars();
      }),
        (this.isCreating = false));
    });
  }
}
