import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-navbar-top',
  templateUrl: './admin-navbar-top.component.html',
  styleUrls: ['./admin-navbar-top.component.css']
})
export class AdminNavbarTopComponent {
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
      },
      error => {
      }
    );
  }
}
