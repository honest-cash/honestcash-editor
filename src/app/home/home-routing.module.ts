import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: HomeComponent, data: { title: extract('Honest') } },
    { path: 'write', pathMatch: 'full', component: HomeComponent, data: { title: extract('Honest') } },
    {
      path: 'write/response/:parentPostId',
      pathMatch: 'full',
      component: HomeComponent,
      data: { title: extract('Honest') }
    },
    { path: 'edit/:postId', pathMatch: 'full', component: HomeComponent, data: { title: extract('Honest') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule {}
