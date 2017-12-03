import { Component, ElementRef, Renderer, ViewChild, OnInit, HostListener } from '@angular/core';
import { Http } from '@angular/http';

import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import * as SendBird from 'sendbird/SendBird.min.js';
import { Subject } from 'rxjs/Subject';
import { CrudService } from '../../shared/services/crud-service/crud.service';

import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import { SelectDialogComponent } from '../../shared/dialogs/select/select-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userSubscription;
  /*
    CHAT SDK
  */

  sb = new SendBird({
    appId: '0AE653E2-CB57-4945-A496-00C12C0BC0B8'
  });

  storeId = '';
  consumerId = '';
  messages: any[] = [];
  channelUrl: string;
  channelMessages$ = new Subject<string>();
  channelList$ = new Subject<any[]>();
  channelListHack$ = new Subject<any>();
  channelList: any[] = [];
  stores;
  chat$ = new Subject<any>();
  /*
    END CHAT SDK
  */
  user: firebase.User;
  // messagesObservable: FirebaseListObservable<Message[]>;

  textAreaInput: string;

  lastMessageKey: string;
  messagesAreLoading = true;

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
              private router: Router,
              private crudService: CrudService,
              private dialog: MatDialog,
              private viewContainerRef: ViewContainerRef,
              private dialogService: TdDialogService,
              private titleService: Title) {
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

    this.userSubscription = crudService.getStoresWhereUserWorks().subscribe((stores) => {
      this.stores = stores;
      this.storeId = this.stores[0].$key;
      this.connectionHandler(this.storeId, '');
    });

  }

  updateChannels() {
    const hackList = this.channelList$;
    const allChannelListQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
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
        const messageListQuery = channel.createPreviousMessageListQuery();

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

            this.scroll();

            setTimeout(() => {
              this.scroll();
            }, 1500);

            console.log(messageList);
          }
        });
      } else {
        this.messages = [];
        this.scroll();
      }
    });
  }

  ngOnInit() {
    this.adaptChatToScreen(window.innerWidth);
    this.titleService.setTitle(
        'Chat'
    );
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

    this.messagesAreLoading = false;
  }

  changeConsumerChannel(consumerId) {
    this.messagesAreLoading = true;
    this.connectionHandler(this.storeId, consumerId);
  }

  changeStoreChannel(storeId) {
    this.messagesAreLoading = true;
    this.connectionHandler(storeId, this.consumerId);
  }

  connectionHandler(storeId, consumerId) {
    this.sb.connect(storeId, (user, connectionError) => {
      if (user) {
        console.log(user);
        const hackMessages = this.channelMessages$;
        const hackList = this.channelListHack$;
        const channelHandler = new this.sb.ChannelHandler();
        channelHandler.onMessageReceived = function (channel, message) {
          if (this.channelUrl === channel.url) {
            hackMessages.next(channel.url);
          }
          hackList.next('');
        };
        channelHandler.onChannelDeleted = function (channelUrl, channelType) {
          hackList.next('');
        };
        this.sb.addChannelHandler(`${storeId}_handler`, channelHandler);

        const channelListQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
        channelListQuery.includeEmpty = true;
        channelListQuery.userIdsFilter = [storeId, consumerId];
        channelListQuery.queryType = 'AND';
        channelListQuery.channelNameContainsFilter = `${storeId}_${consumerId}`;
        if (channelListQuery.hasNext) {
          channelListQuery.next(function (channelList, filterError) {
            if (filterError) {
              console.error(filterError);
              return;
            }
            if (channelList && channelList.length > 0) {
              hackMessages.next(channelList[0].url);
            } else {
              hackMessages.next('');
            }
            console.log(channelList);

          });
        }
        this.updateChannels();
      }
    });
  }

  openChannelChangeDialog() {
    let dialogRef;
    console.log('here');
    const options = [];

    this.stores.forEach(store => {
      options.push({value: store.$key, label: store.name});
    });

    dialogRef = this.dialog.open(SelectDialogComponent, {
      data: {options: options}
    });

    dialogRef.afterClosed().subscribe((storeId: any) => {
      if (storeId) {
        this.changeStoreChannel(storeId);
      }
    });
  }
}
