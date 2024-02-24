import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
  passwordFieldType: string = 'password';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLogin(form: FormGroup) {
    let timerInterval: any;
    Swal.fire({
      title: 'Iniciando Sesión!',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (form.valid) {
        this.authService.loginUserName(form.value.nombre, form.value.password).subscribe(
          res => {
            if (res && res.success && res.data && res.data.accessToken) {
              this.authService.setToken(res.data.accessToken);
              this.authService.setUser(res.data);
              this.router.navigate(['/adminProductos/Todo']); // Redirige al usuario a la ruta "/adminProductos"
            } else {
              const errorMessage = res.message ?? "Error al obtener los datos de usuario";
              console.log(errorMessage);
            }
          },
          err => {
            this.loginError = "Error: Name or Password incorrect";
          }
        );
      }
    });

  }
}
