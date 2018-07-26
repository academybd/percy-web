import Ember from 'ember';
import startApp from 'percy-web/tests/helpers/start-app';
import destroyApp from 'percy-web/tests/helpers/destroy-app';
import seedFaker from './seed-faker';
import {authenticateSession} from 'percy-web/tests/helpers/ember-simple-auth';

// Import mocha helpers so that they will be included for all tests.
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "it|describe" }]*/
import {describe, it, beforeEach, afterEach} from 'mocha';
import {expect} from 'chai';
import StubClient from 'ember-launch-darkly/test-support/helpers/launch-darkly-client-test';

export default function setupAcceptance({authenticate = true} = {}) {
  beforeEach(function() {
    this.application = startApp();
    window.localStorage.clear();
    seedFaker();
    if (authenticate) {
      authenticateSession(this.application);
    }
    this.application.__container__.registry.register('service:launch-darkly-client', StubClient);
  });

  afterEach(function() {
    destroyApp(this.application);
    this.application = null;
  });
}

// Helper to render error pages. By default any error raised during test runs
// aborts the tests. This helper lets you pass those errors to the application
// so we can verify the error pages rendered.
// Example:
//   renderAdapterErrorsAsPage(async () => {
//     await visit('/join/invalid-code');
//     expect(currentPath()).to.equal('error');
//   );
// See https://github.com/emberjs/ember.js/issues/12791
export function renderAdapterErrorsAsPage(callbackThatReturnsAPromise) {
  let adapterException = Ember.Test.adapter.exception;
  Ember.Test.adapter.exception = error => {
    if (error.isAdapterError) {
      Ember.Logger.info('Rendering exception:', error, ' as application error page');
      return null;
    } else {
      return adapterException(error);
    }
  };
  return callbackThatReturnsAPromise().finally(() => {
    Ember.Test.adapter.exception = adapterException;
    adapterException = null;
  });
}

// sets up the session, the createData should set create mirage models.
// If there is only 1 user the this.loginUser will be set to first user.
// It there are more than one user then createData should set this.loginUser to the user who
// is to be used for authentication.
// Example:
//  setupSession(function() {
//    let user = server.create('user', {name: 'Test user', id: 'test_user'});
//    let organization = server.create('organization', {name: 'Test org'});
//    server.create('organizationUser', {user: user, organization: organization});
//    this.loginUser = user;
//  })
export function setupSession(createData) {
  beforeEach(function() {
    createData.bind(this)(server);
    if (this.loginUser === undefined && server.schema.users.all().models.length === 1) {
      this.loginUser = server.schema.users.first();
    }
    expect(this.loginUser).not.to.be.undefined; // eslint-disable-line no-unused-expressions
    if (this.loginUser) {
      this.loginUser.update({_currentLoginInTest: true});
    }
  });
  afterEach(function() {
    this.loginUser = undefined;
  });
}
