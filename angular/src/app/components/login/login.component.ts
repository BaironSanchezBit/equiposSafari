import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserI } from 'src/app/models/user'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginError: string= '';
  passwordFieldType: string = 'password';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLogin(form: FormGroup) {
    if (form.valid) {
      this.authService.loginUser(form.value.email, form.value.password).subscribe(
        res => {
          if (res && res.success && res.data && res.data.accessToken) {
            this.authService.setToken(res.data.accessToken);
            this.authService.setUser(res.data);
            this.router.navigate(['']); // redirige al usuario a la página principal
          } else {
            const errorMessage = res.message ?? "Error al obtener los datos de usuario";
            console.log(errorMessage);
          }                
        },
        err => {
          this.loginError = "Error: Email or Password incorrect";
        }
      );
    }
  }
  
  
  

}
