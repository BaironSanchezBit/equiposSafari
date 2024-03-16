import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginError: string = '';
  passwordFieldType: string = 'password';
  rememberMe: boolean = false;
  private routerSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.removeModalBackdrop();
      }
    });


    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      this.loginForm.patchValue({
        email: userData.email,
        password: userData.password
      });
      this.rememberMe = true;
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private removeModalBackdrop(): void {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }


  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLogin() {
    if (this.loginForm.valid) {

      Swal.fire({
        title: 'Iniciando Sesión!',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading(null)
        }
      }).then(() => {
        const { email, password } = this.loginForm.value;
        this.authService.loginUserUsuario(email, password).subscribe(
          res => {
            this.rememberMe = true;
            if (this.rememberMe) {
              const userData = { email, password };
              localStorage.setItem('userData', JSON.stringify(userData));
            } else {
              localStorage.removeItem('userData');
            }
            this.router.navigate(['/adminProductos/Todo']);
          },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Usuario o contraseña incorrecta!',
            })
          }
        );
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Completa los espacios',
      })
    }
  }
}
