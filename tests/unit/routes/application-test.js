/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import {it, describe, beforeEach, afterEach} from 'mocha';
import {AUTH_CALLBACK_ROUTE} from 'percy-web/router';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/routes/application';
import {setupTest} from 'ember-mocha';

describe('ApplicationRoute', function() {
  let subject;

  setupTest('route:application', {
    needs: ['service:session', 'service:flashMessages', 'service:auth0', 'service:analytics'],
  });

  beforeEach(function() {
    subject = this.subject();
  });

  afterEach(function() {
    localStorage.clear();
  });

  describe('_storeTargetTransition', function() {
    describe('when the route is present in DO_NOT_FORWARD_REDIRECT_ROUTES', function() {
      it('does not store route in localStorage', function() {
        subject._storeTargetTransition({targetName: AUTH_CALLBACK_ROUTE});
        expect(localStorage.getItem(AUTH_REDIRECT_LOCALSTORAGE_KEY)).to.equal(null);
      });
    });

    describe('when the route is not present in DO_NOT_FORWARD_REDIRECT_ROUTES', function() {
      it('stores route in localStorage', function() {
        const fakeRedirectTarget = 'foo/bar/baz';
        subject._storeTargetTransition({intent: {url: fakeRedirectTarget}});
        expect(localStorage.getItem(AUTH_REDIRECT_LOCALSTORAGE_KEY)).to.equal(
          `"${fakeRedirectTarget}"`,
        );
      });
    });
  });
});
