import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import stubLockModal from 'percy-web/tests/helpers/stub-lock-modal';
import PasswordUpdatedPageObject from 'percy-web/tests/pages/password-updated';

describe('Acceptance: PasswordUpdated when user is not logged in', function() {
  setupAcceptance({authenticate: false});

  it('displays password update message and login button when success is true', function() {
    stubLockModal(this.application);

    PasswordUpdatedPageObject.visitSuccessfulPasswordReset();
    percySnapshot(this.test.fullTitle());
    PasswordUpdatedPageObject.PasswordUpdatedStatusPanel.clickSignin();
    andThen(() => {
      expect(currentURL()).to.equal('/login');
    });
  });
});

describe('Acceptance: PasswordUpdated when user is logged in', function() {
  setupAcceptance({authenticate: true});

  setupSession(function(server) {
    server.create('user');
  });

  it('displays failure message and continue to profile button when success is false', function() {
    stubLockModal(this.application);

    PasswordUpdatedPageObject.visitFailedPasswordReset();
    percySnapshot(this.test.fullTitle());
    PasswordUpdatedPageObject.PasswordUpdatedStatusPanel.clickSettings();
    andThen(() => {
      expect(currentURL()).to.equal('/settings/profile');
    });
  });
});
