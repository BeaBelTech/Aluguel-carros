import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/Auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  warningMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required, Validators.minLength(1)],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  login() {
    this.authService.login(
      this.loginForm.value.user,
      this.loginForm.value.password,
      (logado) => {
        if (logado) {
          return this.router.navigate(['/home']);
        }
        return (
          (this.warningMessage = 'Usuário ou senha incorretos'),
          this.loginForm.reset()
        );
      },
    );
  }
}
