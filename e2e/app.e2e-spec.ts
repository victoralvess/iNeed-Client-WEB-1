<<<<<<< HEAD
import { INeedWebProjectPage } from './app.po';

describe('i-need-web-project App', () => {
  let page: INeedWebProjectPage;

  beforeEach(() => {
    page = new INeedWebProjectPage();
=======
import { AppPage } from './app.po';

describe('ineed-stores-module App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
>>>>>>> stores-module
  });

  it('should display welcome message', () => {
    page.navigateTo();
<<<<<<< HEAD
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
=======
    expect(page.getParagraphText()).toEqual('Welcome to app!');
>>>>>>> stores-module
  });
});
