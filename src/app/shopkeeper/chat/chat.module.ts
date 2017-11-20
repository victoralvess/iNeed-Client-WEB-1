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
import { SelectDialogComponent } from '../../shared/dialogs/select/select-dialog.component';
import { CovalentDialogsModule } from '@covalent/core';

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
    MatButtonModule,
CovalentDialogsModule
  ],
  declarations: [ChatComponent, SelectDialogComponent],
  providers: [CrudService],
  exports: [SelectDialogComponent],
  entryComponents: [SelectDialogComponent]
})
export class ChatModule { }
