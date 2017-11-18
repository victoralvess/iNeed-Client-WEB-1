import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SubscribeRoutingModule } from './subscribe-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { PasswordForgotComponent } from './password-forgot/password-forgot.component';
import { MessageEmailVerificationComponent } from './message-email-verification/message-email-verification.component';
import { MessageAdminVerificationComponent } from './message-admin-verification/message-admin-verification.component';
import { SubscribeComponent } from './subscribe.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatListModule, MatInputModule, MatCardModule, MatButtonModule, NoConflictStyleCompatibilityMode, CompatibilityModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
ReactiveFormsModule,
    SubscribeRoutingModule,
    FlexLayoutModule,
MatIconModule,    MatListModule, MatCardModule, MatButtonModule, NoConflictStyleCompatibilityMode, CompatibilityModule,MatInputModule
  ],
  declarations: [SignUpComponent, SignInComponent, PasswordForgotComponent, MessageEmailVerificationComponent, MessageAdminVerificationComponent, SubscribeComponent]
})
export class SubscribeModule { }
