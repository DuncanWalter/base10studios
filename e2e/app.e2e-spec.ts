import { Base10StudiosPage } from './app.po';

describe('base-10-studios App', function() {
  let page: Base10StudiosPage;

  beforeEach(() => {
    page = new Base10StudiosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
