import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { HttpErrorComponent } from '@app/shared/components/pages/http-error/http-error.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'http-error', component: HttpErrorComponent, data: { title: extract('Honest - HTTP Error') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HttpErrorRoutingModule {}
