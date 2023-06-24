import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  confirmForm: FormGroup;
  updateForm: FormGroup;
  id!: string | null;
  passwordFieldType: string = 'password';
  confirmPassword: string = 'password';
  confirmPasswordValue: string = "";

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private idRoute: ActivatedRoute) {
    this.updateForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });

    this.confirmForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });

    const id = this.idRoute.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.authService.getUserById(this.id).subscribe(data => {
        this.updateForm.setValue({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          email: data.email
        })
      })
    }
  }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibilityCheck() {
    this.confirmPasswordValue = this.confirmForm.controls['confirmPassword'].value;
  }


  updateUser() {
    const nombre = this.updateForm.controls['nombre'].value;
    const apellido = this.updateForm.controls['apellido'].value;
    const telefono = this.updateForm.controls['telefono'].value;
    const password = this.confirmForm.controls['password'].value;
    const confirmPassword = this.confirmForm.controls['confirmPassword'].value;

    if (!nombre) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, ingresa tu nombre para confirmar los cambios.',
      });
      return;
    }
    if (!apellido) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, ingresa tu apellido para confirmar los cambios.',
      });
      return;
    }
    if (!telefono) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, ingresa tu telefono para confirmar los cambios.',
      });
      return;
    }
    if (!password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, ingresa tu contraseña para confirmar los cambios.',
      });
      return;
    }

    if (!confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, ingresa la confirmación de la contraseña para confirmar los cambios.',
      });
      return;
    }



    this.authService.validPassword(this.id!, password).subscribe(
      (response) => {
        Swal.fire({
          title: '¿Quieres guardar los cambios?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Guardad',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Actualizado!', '', 'success');
            // Contraseña válida, actualizar datos del usuario
            this.authService.updateUser(this.id!, nombre, apellido, telefono).subscribe(
              (response) => {
                // Actualización exitosa
                setTimeout(()=>{
                  Swal.fire({
                    title: 'Se cerrará sesión!',
                    showConfirmButton: true,
                  }).then((result) => {
                      // Cerrar sesión
                      this.router.navigate(['/']);
                      this.onLogout();
                  });
                }, 1500);
              },
              (error) => {
                console.error(error);
              }
            );
          } else if (result.isDenied) {
            Swal.fire('Los cambios no han sido guardados', '', 'info');
          }
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Contraseña incorrecta!',
        });
      }
    );
  }

  onLogout() {
    this.authService.logoutUser().subscribe(() => {
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.router.navigate(['/'], { replaceUrl: true, queryParams: {} });
      location.reload();
    });
  }
}

