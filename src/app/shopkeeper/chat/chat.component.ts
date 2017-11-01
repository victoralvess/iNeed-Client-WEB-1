import { Component, ElementRef, Renderer, ViewChild, OnInit, HostListener } from '@angular/core';
import { Http } from '@angular/http';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { Message } from '../../shared/models/message.model';
import * as SendBird from 'sendbird/SendBird.min.js';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  /*
    CHAT SDK
  */

  sb = new SendBird({
    appId: '0AE653E2-CB57-4945-A496-00C12C0BC0B8'
  });

  storeId = '-KxYMBGkiuW0me9Stnjd';
  consumerId = 'joaozinho_app';
  messages: any[] = [];
  channelUrl: string;
  channelMessages$ = new Subject<string>();
  channelList$ = new Subject<any[]>();
  channelListHack$ = new Subject<any>();
  channelList: any[] = [];
  /*
    END CHAT SDK
  */
  user: firebase.User;
  // messagesObservable: FirebaseListObservable<Message[]>;

  textAreaInput: string;

  lastMessageKey: string;
  // messagesAreLoading: boolean = true;

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
    this.channelMessages$.asObservable().subscribe((channelUrl) => {
      this.channelUrl = channelUrl;
      this.getMessagesFrom(channelUrl);
    });
    this.channelList$.asObservable().subscribe((channelList) => {
      this.channelList = channelList;
    });
    this.channelListHack$.asObservable().subscribe((hack) => {
      this.updateChannels();
    });
    /*
    this.messagesObservable = db.list('/messages', {
      query: {
        orderByChild: 'sentAt',
        limitToLast: 20
      }
    });
    */
    const worksAt = [{ id: '-KxYMBGkiuW0me9Stnjd', name: 'Estrutura Completa' }];
    this.sb.connect('-KxYMBGkiuW0me9Stnjd', (user, connectionError) => {
      if (user) {
        console.log(user);
        let hackMessages = this.channelMessages$;
        let hackList = this.channelListHack$;
        let channelHandler = new this.sb.ChannelHandler();
        channelHandler.onMessageReceived = function (channel, message) {
          if (this.channelUrl === channel.url) {
            hackMessages.next(channel.url);
          }
          hackList.next('hack');
        };
        channelHandler.onChannelDeleted = function (channelUrl, channelType) { 
          hackList.next('hack');
        }; 
        this.sb.addChannelHandler(`${this.storeId}_handler`, channelHandler);
        // tslint:disable-next-line:max-line-length
        /* this.sb.updateCurrentUserInfo(worksAt[0].name, 'https://s.gravatar.com/avatar/a3f6a72374f74dd7457fd19f4495b866?s=480&r=pg', (response, errr) => {
           console.log(response, errr);
         });*/
        let channelListQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
        channelListQuery.includeEmpty = true;
        channelListQuery.userIdsFilter = [this.storeId, this.consumerId];
        channelListQuery.queryType = 'AND';
        channelListQuery.channelNameContainsFilter = `${this.storeId}_${this.consumerId}`;
        if (channelListQuery.hasNext) {
          channelListQuery.next(function (channelList, filterError) {
            if (filterError) {
              console.error(filterError);
              return;
            }
            hackMessages.next(channelList[0].url);
            console.log(channelList);

          });
        }

        this.updateChannels();
      }
    });
  }

  updateChannels() {
    let hackList = this.channelList$;
    let allChannelListQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
    allChannelListQuery.includeEmpty = true;
    allChannelListQuery.userIdsFilter = [this.storeId];
    allChannelListQuery.channelNameContainsFilter = `${this.storeId}_`;
    if (allChannelListQuery.hasNext) {
      allChannelListQuery.next(function (allChannelList, filterError) {
        if (filterError) {
          console.error(filterError);
          return;
        }
        hackList.next(allChannelList);
        console.log('all', allChannelList);

      });
    }
  }

  getMessagesFrom(channelUrl) {
    this.sb.GroupChannel.getChannel(channelUrl, (channel, channelError) => {
      if (channel) {
        let messageListQuery = channel.createPreviousMessageListQuery();
        channel.createPreviousMessageListQuery();

        messageListQuery.load(30, true, (messageList, messagesError) => {
          if (messageList) {
            this.messages = messageList;
            this.messages.sort((a, b) => {
              let aVal = 0;
              let bVal = 0;

              aVal = (a.updatedAt > 0) ? a.updatedAt : a.createdAt;
              bVal = (b.updatedAt > 0) ? b.updatedAt : b.createdAt;

              return aVal - bVal;
            });
            setTimeout(() => {
              this.scroll();
            });
            setTimeout(() => {
              this.scroll();
            }, 1500);
            console.log(messageList);
          }
        });
      }
    });
  }

  ngOnInit() {

    this.adaptChatToScreen(window.innerWidth);


    /*this.messagesObservable.subscribe(() => {
      setTimeout(() => {
        this.scroll();
      });
      setTimeout(() => {
        this.scroll();
      }, 1500);
      setTimeout(() => {
        this.messagesAreLoading = false;
      }, 1000);
    });*/
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

  send(message: string) {
    /*
    if (!message || message.trim().length === 0) {
      return;
    }
   
    this.textAreaInput = '';
    let message = new Message(this.user.uid, 'cliente_1', message, firebase.database.ServerValue.TIMESTAMP);
    this.lastMessageKey = this.messagesObservable.push(message).key;*/
    this.textAreaInput = '';
    this.sb.GroupChannel.getChannel(this.channelUrl, (channel, channelError) => {
      if (channel) {
        channel.sendUserMessage(message, (sentMessage, error) => {
          if (error) {
            console.error(error);
            return;
          }
          console.log(sentMessage);
          this.getMessagesFrom(channel.url);
        });
      }
    });
  }

  scroll() {
    this.renderer.setElementProperty(
      this.erScrollable.nativeElement,
      'scrollTop',
      this.erScrollable.nativeElement.scrollHeight
    );
  }
}
