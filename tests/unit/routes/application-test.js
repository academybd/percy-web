/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import {it, describe, beforeEach, afterEach} from 'mocha';
import {AUTH_CALLBACK_ROUTE} from 'percy-web/router';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/router';
import {setupTest} from 'ember-mocha';
import sinon from 'sinon';
import {resolve} from 'rsvp';

describe('ApplicationRoute', function() {
  let subject;

  setupTest('route:application', {
    needs: [
      'service:session',
      'service:flashMessages',
      'service:auth0',
      'service:analytics',
      'service:raven',
      'service:launch-darkly',
    ],
  });

  beforeEach(function() {
    sessionStorage.clear();
    subject = this.subject();
  });

  afterEach(function() {
    sessionStorage.clear();
  });

  describe('_storeTargetTransition', function() {
    describe('when the route is present in DO_NOT_FORWARD_REDIRECT_ROUTES', function() {
      it('does not store route in sessionStorage', function() {
        subject._storeTargetTransition({targetName: AUTH_CALLBACK_ROUTE});
        expect(sessionStorage.getItem(AUTH_REDIRECT_LOCALSTORAGE_KEY)).to.equal(null);
      });
    });

    describe('when the route is not present in DO_NOT_FORWARD_REDIRECT_ROUTES', function() {
      it('stores route in sessionStorage', function() {
        const fakeRedirectTarget = 'foo/bar/baz';
        subject._storeTargetTransition({intent: {url: fakeRedirectTarget}});
        expect(sessionStorage.getItem(AUTH_REDIRECT_LOCALSTORAGE_KEY)).to.equal(
          `"${fakeRedirectTarget}"`,
        );
      });
    });
  });

  describe('_redirectToDefaultOrganization', function() {
    it('redirects to /login if there is no user', function() {
      const transitionStub = sinon.stub(subject, 'transitionTo').returns(resolve());

      subject.set('currentUser', null);
      subject._redirectToDefaultOrganization();

      expect(transitionStub).to.have.been.calledWith('/login');
    });
  });
});
