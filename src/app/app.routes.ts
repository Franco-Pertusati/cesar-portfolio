import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { WorkComponent } from './modules/work/work.component';
import { CatalogComponent } from './modules/catalog/catalog.component';

export const routes: Routes = [
    { path: 'inicio', component: HomeComponent },
    { path: 'mis-trabajos', component: WorkComponent },
    { path: 'catalogo', component: CatalogComponent },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
