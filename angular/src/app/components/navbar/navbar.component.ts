import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  loggedIn: boolean = false;
  userData: string = "";
  user: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    /*this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.user = this.authService.getUser();
    } else {
      // Agregar esto para establecer loggedIn y user en false
      this.loggedIn = false;
      this.user = null;
    }*/
  }

  redirectToCatalogo(opcion: string) {
    this.router.navigate(['/catalogos', opcion]);
  }

  /*getFirstWord(): string {
    if (this.user) {
      const fullName = this.user.nombre.trim();
      const spaceIndex = fullName.indexOf(" ");
      if (spaceIndex >= 0) {
        return fullName.substring(0, spaceIndex).substring(0, 10);
      } else {
        return fullName.substring(0, 10);
      }
    }
    return "";
  }

  goToProfile() {
    this.router.navigate(['api/users', this.user.id]);
  }


  onLogout() {
    this.authService.logoutUser().subscribe(() => {
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.router.navigate(['/'], { replaceUrl: true, queryParams: {} });
      location.reload();
    });
  }*/

}