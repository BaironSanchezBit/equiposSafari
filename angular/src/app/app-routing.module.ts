import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CatalogoVistaComponent } from './components/catalogo-vista/catalogo-vista.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { AdminProductosCrearComponent } from './components/admin-productos-crear/admin-productos-crear.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'adminLogin/login', component: AdminLoginComponent },
  { path: 'adminLogin/logout', component: AdminLoginComponent, canActivate: [AuthGuard] },
  { path: 'adminProductosCrear', component: AdminProductosCrearComponent, canActivate: [AuthGuard] },
  { path: 'adminProductos/Todo', component: AdminProductosComponent, canActivate: [AuthGuard] },
  { path: 'adminProductos/update/:id', component: AdminProductosCrearComponent, canActivate: [AuthGuard] },
  { path: 'adminProductos/:opcion', component: AdminProductosComponent, canActivate: [AuthGuard] },
  { path: 'catalogos/:opcion', component: CatalogoComponent },
  { path: 'catalogos/id/:id', component: CatalogoVistaComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})


export class AppRoutingModule { }
