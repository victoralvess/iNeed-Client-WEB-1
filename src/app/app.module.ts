import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './shared/services/services-auth/auth.service';
import { VerifyAuth } from './shared/services/verify-auth/verify-auth';

@NgModule({ 
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AuthService,VerifyAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
