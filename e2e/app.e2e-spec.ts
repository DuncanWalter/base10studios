import { AlgorithmEnginePage } from './app.po';

describe('algorithm-engine App', function() {
  let page: AlgorithmEnginePage;

  beforeEach(() => {
    page = new AlgorithmEnginePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
