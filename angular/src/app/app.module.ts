import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CatalogoVistaComponent } from './components/catalogo-vista/catalogo-vista.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { AdminProductosCrearComponent } from './components/admin-productos-crear/admin-productos-crear.component';
import { AdminProductosNavbarComponent } from './components/admin-productos-navbar/admin-productos-navbar.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { FormsModule } from '@angular/forms';
import { ImageModalComponent } from './components/image-modal/image-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminNavbarTopComponent } from './components/admin-navbar-top/admin-navbar-top.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    NosotrosComponent,
    ContactoComponent,
    CatalogoComponent,
    CatalogoVistaComponent,
    AdminProductosComponent,
    AdminProductosCrearComponent,
    AdminProductosNavbarComponent,
    AdminLoginComponent,
    ImageModalComponent,
    AdminNavbarTopComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
