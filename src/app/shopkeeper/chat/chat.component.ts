import { Component, ElementRef, Renderer, ViewChild, OnInit, HostListener } from '@angular/core';
import { Http } from '@angular/http';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { Message } from '../../shared/models/message.model';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    user: firebase.User;
    messagesObservable: FirebaseListObservable<Message[]>;

    textAreaInput: string;

    lastMessageKey: string;
    messagesAreLoading: boolean = true;

    @ViewChild('scrollable') private erScrollable: ElementRef;
    @ViewChild('messagesList') private erMessages: ElementRef;
    @ViewChild('container') private erContainer: ElementRef;
    @ViewChild('stackWrap') private erStackWrap: ElementRef;
    @ViewChild('contacts') private erContacts: ElementRef;
    screenIsSmall = false;

    @HostListener('window:resize')
    onResize() {
        this.adaptChatToScreen(window.innerWidth);
    }

    constructor(private db: AngularFireDatabase,
                private http: Http,
                private elementRef: ElementRef,
                private renderer: Renderer,
                private router: Router) {
        this.user = firebase.auth().currentUser;
        this.messagesObservable = db.list('/messages', {
            query: {
                orderByChild: 'sentAt',
                limitToLast: 2
            }
        });
    }

    ngOnInit() {

        this.adaptChatToScreen(window.innerWidth);


        this.messagesObservable.subscribe(() => {
            setTimeout(() => {
                this.scroll();
            });
            setTimeout(() => {
                this.scroll();
            }, 1500);
            setTimeout(() => {
                this.messagesAreLoading = false;
            }, 1000);
        });
    }

    adaptChatToScreen(width: number) {
        if (!this.screenIsSmall && width < 600) {
            this.screenIsSmall = true;

            this.renderer.invokeElementMethod(this.erStackWrap.nativeElement, 'appendChild', [this.erMessages.nativeElement]);
            this.renderer.invokeElementMethod(this.erStackWrap.nativeElement, 'appendChild', [this.erContacts.nativeElement]);
        } else if (this.screenIsSmall && width >= 600) {
            this.screenIsSmall = false;

            this.renderer.invokeElementMethod(this.erContainer.nativeElement, 'insertBefore', [this.erContacts.nativeElement, this.erStackWrap.nativeElement]);
            this.renderer.invokeElementMethod(this.erContainer.nativeElement, 'insertBefore', [this.erMessages.nativeElement, this.erStackWrap.nativeElement]);
        }
        this.renderer.setElementClass(
            this.erContainer.nativeElement,
            'small-screen',
            this.screenIsSmall
        );

        this.scroll();
    }

    send(messageText: string) {
        if (!messageText || messageText.trim().length === 0) {
            return;
        }

        this.textAreaInput = '';
        let message = new Message(this.user.uid, 'cliente_1', messageText, firebase.database.ServerValue.TIMESTAMP);
        this.lastMessageKey = this.messagesObservable.push(message).key;
    }

    scroll() {
        this.renderer.setElementProperty(
            this.erScrollable.nativeElement,
            'scrollTop',
            this.erScrollable.nativeElement.scrollHeight
        );
    }
}
