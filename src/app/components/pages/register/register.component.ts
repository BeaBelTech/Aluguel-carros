import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/Auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  warningMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.registerForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(1)]],
      passwordConfirmed: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  register() {
    this.registerForm.valid &&
      this.authService.register(
        this.registerForm.value.user,
        this.registerForm.value.password,
        this.registerForm.value.passwordConfirmed,
        (Register) => {
          Register.trim() === 'true'
            ? this.router.navigate(['home'])
            : (this.warningMessage = Register);
        },
      );
  }
}
