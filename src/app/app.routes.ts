import { Routes } from '@angular/router';
import { AvisosComponent } from './avisos/avisos.component';
import { CrearAvisoComponent } from './crear-aviso/crear-aviso.component';

export const routes: Routes = [
  { path: '', redirectTo: '/avisos', pathMatch: 'full' },
  { path: 'avisos', component: AvisosComponent },
  { path: 'crear-aviso', component: CrearAvisoComponent },
];
