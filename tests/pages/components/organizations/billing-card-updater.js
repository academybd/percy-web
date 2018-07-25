import {create, is, clickable, isVisible} from 'ember-cli-page-object';

const SELECTORS = {
  STRIPE_CARD_COMPONENT: '[data-test-billing-card-updater-stripe-card]',
  UPDATE_CARD_BUTTON: '[data-test-open-card-form]',
  SUBMIT_CARD_BUTTON: '[data-test-submit-card-button]',
};

export const GithubEnterpriseSettings = {
  isStripeCardComponentVisible: isVisible(SELECTORS.STRIPE_CARD_COMPONENT),
  clickUpdateCard: clickable(SELECTORS.UPDATE_CARD_BUTTON),
  isSubmitCardButtonDisabled: is(':disabled', SELECTORS.SUBMIT_CARD_BUTTON),
  clickSubmitCard: clickable(SELECTORS.SUBMIT_CARD_BUTTON),
};

export default create(GithubEnterpriseSettings);
