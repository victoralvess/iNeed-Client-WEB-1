import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './shared/services/services-auth/auth.service';
import { VerifyAuth } from './shared/services/verify-auth/verify-auth';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CallbackComponent } from './callback/callback.component';
import { Auth0Service } from './shared/services/auth0-service/auth0.service';
import { MatToolbarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { NoConflictStyleCompatibilityMode, CompatibilityModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    NoConflictStyleCompatibilityMode,
    CompatibilityModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [AuthService, VerifyAuth, Auth0Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
