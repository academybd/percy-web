import {computed} from '@ember/object';
import BaseFormComponent from './base';
import OrganizationNewValidations from '../../validations/organization-new';

export default BaseFormComponent.extend({
  classNames: ['FormsOrganizationNew', 'Form'],
  classNameBindings: ['classes'],

  classes: null,
  marketplaceListingPlanId: null,
  isSubmitDisabled: false,

  validator: OrganizationNewValidations,

  // Setup data for creating an org from different billing providers and marketplaces.
  _billingProvider: computed('marketplaceListingPlanId', function() {
    let marketplaceListingPlanId = this.get('marketplaceListingPlanId');
    if (marketplaceListingPlanId) {
      return 'github_marketplace';
    }
  }),
  _billingProviderData: computed('marketplaceListingPlanId', function() {
    let marketplaceListingPlanId = this.get('marketplaceListingPlanId');
    if (marketplaceListingPlanId) {
      return JSON.stringify({
        marketplace_listing_plan_id: parseInt(marketplaceListingPlanId),
      });
    }
  }),

  model: computed(function() {
    return this.get('store').createRecord('organization', {
      billingProvider: this.get('_billingProvider'),
      billingProviderData: this.get('_billingProviderData'),
    });
  }),
});
