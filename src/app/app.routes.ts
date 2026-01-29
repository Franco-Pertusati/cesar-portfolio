import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { WorkComponent } from './modules/work/work.component';
import { CatalogComponent } from './modules/catalog/catalog.component';
import { AdminComponent } from './modules/admin/admin.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './modules/login/login.component';

export const routes: Routes = [
    { path: 'inicio', component: HomeComponent },
    { path: 'mis-trabajos', component: WorkComponent },
    { path: 'catalogo', component: CatalogComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
