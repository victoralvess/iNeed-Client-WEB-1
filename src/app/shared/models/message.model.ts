export class Message {
    sentAt: any;
    sentTo: string;
    sentFrom: string;
    message: string;

    constructor(sentFrom: string, sentTo: string, message: string, sentAt: any) {
        this.sentFrom = sentFrom;
        this.sentTo = sentTo;
        this.message = message;
        this.sentAt = sentAt;
    }
}