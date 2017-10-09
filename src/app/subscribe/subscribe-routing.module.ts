import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { PasswordForgotComponent } from './password-forgot/password-forgot.component';
import { MessageEmailVerificationComponent } from './message-email-verification/message-email-verification.component';
import { MessageAdminVerificationComponent } from './message-admin-verification/message-admin-verification.component';
import { IsLoggedAuthGuard } from './guards/is-logged-auth/is-logged-auth.guard';
import { SubscribeComponent } from './subscribe.component';

const routes: Routes = [
	{ path: '', component: SubscribeComponent, children: [
	    { path: 'signup', component: SignUpComponent, canActivate: [IsLoggedAuthGuard] },
	    { path: 'signin', component: SignInComponent, canActivate: [IsLoggedAuthGuard] },
	    { path: 'emailverication', component: MessageEmailVerificationComponent, canActivate: [IsLoggedAuthGuard] },
	    { path: 'adminverication', component: MessageAdminVerificationComponent, canActivate: [IsLoggedAuthGuard] },
	    { path: 'forgot', component: PasswordForgotComponent, canActivate: [IsLoggedAuthGuard] },
	    { path: '', redirectTo: 'signin', pathMatch: 'full' },
	    { path: '**', redirectTo: 'signin', pathMatch: 'full' }
  	]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [IsLoggedAuthGuard]
})
export class SubscribeRoutingModule { }
