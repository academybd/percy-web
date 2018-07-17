import Service, {inject as service} from '@ember/service';
import {task} from 'ember-concurrency';

export default Service.extend({
  store: service(),
  flashMessages: service(),
  stripeService: service('stripev3'),

  updateCreditCard: task(function*(stripeElement, organization, planId) {
    try {
      const stripeResponse = yield this.get('stripeService').createToken(stripeElement);
      return this.changeSubscription.perform(organization, planId, stripeResponse.token);
    } catch (e) {
      console.log(e)
    }
  }),

  changeSubscription: task(function*(organization, planId, token) {
    // Always create a new POST request to change subscription, don't modify the subscription
    // object directly unless just changing attributes.
    let subscription = this.get('store').createRecord('subscription', {
      organization: organization,
      billingEmail: organization.get('subscription.billingEmail'),
      plan: this._get_or_create_plan(planId),
      token: token && token.id,
    });
    const savingPromise = subscription.save();

    try {
      return yield savingPromise;
    } catch (e) {
      console.log(e);
    }
  }),

  _get_or_create_plan(planId) {
    let plan = this.get('store').peekRecord('plan', planId);
    if (!plan) {
      plan = this.get('store').push({
        data: {
          id: planId,
          type: 'plan',
        },
      });
    }
    return plan;
  },
});
