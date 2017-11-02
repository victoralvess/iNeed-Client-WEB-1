import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import {
  MatIconModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  MatCardModule,
  MatProgressSpinnerModule,
MatButtonModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CrudService } from '../../shared/services/crud-service/crud.service';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
MatButtonModule
  ],
  declarations: [ChatComponent],
  providers: [CrudService]
})
export class ChatModule { }
