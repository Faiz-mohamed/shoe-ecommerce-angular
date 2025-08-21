import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { UnsavedChangesGuard } from 'src/app/core/guards/unsaved-changes.guard';

const routes: Routes = [
  { path: 'login' , component: LoginPageComponent, canDeactivate : [UnsavedChangesGuard]},
  { path: 'signup' , component: SignUpPageComponent, canDeactivate : [UnsavedChangesGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
