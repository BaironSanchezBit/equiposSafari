import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  registerError: string = '';
  invalidEmailFormat = false; // variable para indicar si el correo tiene un formato inválido
  passwordFieldType: string = 'password';
  confirmPassword: string = 'password';
  confirmPasswordValue: string = "";


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onRegister(form: FormGroup) {
    if (form.valid && form.value.password === form.value.confirmPassword) {
      if (!/^[a-zA-Z]+$/.test(form.value.nombre)) {
        this.registerError = "El nombre solo puede contener letras";
        return;
      }
      this.authService.registerUser(form.value.nombre, form.value.apellido, form.value.telefono, form.value.email, form.value.password).subscribe(
        res => {
          if (res && res.data && res.data.accessToken) {
            this.authService.setToken(res.data.accessToken);
            this.authService.setUser(res.data);
            this.router.navigate(['']);
          } else {
            console.log("Error al obtener los datos de usuario");
          }
        },
        err => {
          if (err.error && err.error.message === 'Invalid email format') {
            this.registerError = "El email no es válido";
          } else {
            this.registerError = "El email ya existe";
          }
        }
      );
    } else if (form.value.password !== form.value.confirmPassword) {
      this.registerError = "Las contraseñas no son iguales";
    } else {
      let errorMessage = "";
      Object.keys(form.controls).forEach(key => {
        if (form.controls[key].invalid) {
          switch (key) {
            case 'nombre':
              errorMessage = "Por favor, ingrese un nombre válido";
              break;
            case 'apellido':
              errorMessage = "Por favor, ingrese un apellido válido";
              break;
            case 'telefono':
              errorMessage = "Por favor, ingrese un telefono válido";
              break;
            case 'email':
              errorMessage = "Por favor, ingrese un correo electrónico válido";
              break;
            case 'password':
              errorMessage = "Por favor, ingrese una contraseña válida";
              break;
            case 'confirmPassword':
              errorMessage = "Por favor, confirme su contraseña";
              break;
          }
          return;
        }
      });
      this.registerError = errorMessage;
    }
  }



  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibilityCheck() {
    this.confirmPasswordValue = this.registerForm.controls['confirmPassword'].value;
  }


}
