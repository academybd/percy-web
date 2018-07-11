import {create, collection, hasClass} from 'ember-cli-page-object';

const SELECTORS = {
  BROWSER_FAMILY_SELECTOR: '[data-test-browser-family-selector]',
  BUTTON: '[data-test-browser-selector-button]',
};

export const BrowserFamilySelector = {
  scope: SELECTORS.BROWSER_FAMILY_SELECTOR,

  buttons: collection({
    itemScope: SELECTORS.BUTTON,
    item: {
      isActive: hasClass('is-browser-active'),
      isChrome: hasClass('data-test-browser-selector-chrome'),
      isFirefox: hasClass('data-test-browser-selector-firefox'),
    },
  }),

  chromeButton: {
    isDescriptor: true,
    get() {
      return this.buttons()
        .toArray()
        .findBy('isChrome');
    },
  },

  firefoxButton: {
    isDescriptor: true,
    get() {
      return this.buttons()
        .toArray()
        .findBy('isFirefox');
    },
  },

  clickChrome() {
    this.chromeButton.click();
  },

  clickFirefox() {
    this.firefoxButton.click();
  },
};

export default create(BrowserFamilySelector);
