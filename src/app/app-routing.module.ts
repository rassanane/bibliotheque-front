import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuteursComponent } from './auteurs/auteurs.component';
import { AccueilComponent } from './accueil/accueil.component';
import { LivresComponent } from './livres/livres.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'auteurs', component: AuteursComponent },
  { path: 'livres', component: LivresComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
