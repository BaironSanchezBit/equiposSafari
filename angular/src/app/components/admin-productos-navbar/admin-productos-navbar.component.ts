import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-productos-navbar',
  templateUrl: './admin-productos-navbar.component.html',
  styleUrls: ['./admin-productos-navbar.component.css']
})
export class AdminProductosNavbarComponent {
  loggedIn: boolean = false;
  userData: string = "";
  user: any;
  navbarOpen = false;
  datosUser: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.user = this.authService.getUser();
    } else {
      this.loggedIn = false;
      this.user = null;
    }

    this.authService.getUserDetails().subscribe(
      user => {
        this.datosUser = user;
        console.log(this.datosUser);
      },
      error => {
      }
    );
  }

  onLogout() {
    let timerInterval: any;
    Swal.fire({
      title: 'Cerrando Sesión!',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      this.authService.logoutUser().subscribe(() => {
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.router.navigate(['/adminLogin/login'], { replaceUrl: true, queryParams: {} });
      })
    });
  }

  redirectToCatalogo(opcion: string) {
    let timerInterval: any;
    Swal.fire({
      title: 'Redirigiendo!',
      timer: 800,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      this.router.navigate(['/', opcion]);
    });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}






