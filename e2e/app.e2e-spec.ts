import { MobiusFfToolkitPage } from './app.po';

describe('mobius-ff-toolkit App', () => {
  let page: MobiusFfToolkitPage;

  beforeEach(() => {
    page = new MobiusFfToolkitPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
