import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { NotAuthorizedComponent } from '@app/shell/components/pages/not-authorized/not-authorized.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'not-authorized', component: NotAuthorizedComponent, data: { title: extract('Honest - Not Authorized') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NotAuthorizedRoutingModule {}
