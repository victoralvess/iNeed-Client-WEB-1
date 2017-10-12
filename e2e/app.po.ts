import { browser, by, element } from 'protractor';

<<<<<<< HEAD
export class INeedWebProjectPage {
=======
export class AppPage {
>>>>>>> stores-module
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
