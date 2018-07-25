import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth-auth0/mixins/application-route-mixin';
import localStorageProxy from 'percy-web/lib/localstorage';
import {DO_NOT_FORWARD_REDIRECT_ROUTES} from 'percy-web/router';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import isDevWithProductionAPI from 'percy-web/lib/dev-auth';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/router';

export default Route.extend(ApplicationRouteMixin, EnsureStatefulLogin, {
  session: service(),
  flashMessages: service(),
  raven: service(),
  currentUser: alias('session.currentUser'),

  beforeModel(transition) {
    this._super(...arguments);
    if (!this.get('session.isAuthenticated')) {
      this._storeTargetTransition(transition);

      // When running our development environment with a production API, we need to shortcut the
      // auth flow otherwise you'll get CSRF detected errors from Auth0. This is somewhat of a hack
      // and means you won't be able to log out or test login functionality in this mode.
      if (isDevWithProductionAPI()) {
        this.set('session.isAuthenticated', true);
      }
    }
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    // This method is called after the session is authenticated by ember-simple-auth.
    // By default, it executes some pre-set redirects but we want our own redirect logic,
    // so we're not calling super here.
    this._loadCurrentUser().then(() => {
      this.closeLock();
      this._decideRedirect();
    });
  },

  _loadCurrentUser() {
    return this.get('session')
      .loadCurrentUser()
      .catch(() => {
        return this._showLoginFailedFlashMessage();
      });
  },

  actions: {
    showSupport() {
      window.Intercom('show');
    },

    showLoginModal() {
      this.showLoginModalEnsuringState();
    },

    logout() {
      this.get('session').invalidateAndLogout();
    },

    redirectToDefaultOrganization() {
      this._redirectToDefaultOrganization();
    },

    navigateToProject(project) {
      let organizationSlug = project.get('organization.slug');
      let projectSlug = project.get('slug');
      this.transitionTo('organization.project.index', organizationSlug, projectSlug);
    },

    navigateToBuild(build) {
      let organizationSlug = build.get('project.organization.slug');
      let projectSlug = build.get('project.slug');
      // VERY IMPORTANT: pass the build id rather than the build object
      // in order to always activate the model hook in org.project.builds.build route
      this.transitionTo(
        'organization.project.builds.build',
        organizationSlug,
        projectSlug,
        build.get('id'),
      );
    },

    navigateToOrganizationBilling(organization) {
      let organizationSlug = organization.get('slug');
      this.transitionTo('organizations.organization.billing', organizationSlug);
    },

    navigateToProjectSettings(project) {
      let organizationSlug = project.get('organization.slug');
      let projectSlug = project.get('slug');
      this.transitionTo('organization.project.settings', organizationSlug, projectSlug);
    },

    // See: https://github.com/damiencaselli/ember-cli-sentry/issues/105
    error(error) {
      if (this.get('raven.isRavenUsable')) {
        this.get('raven').captureException(error);
      }
      return true; // Let the route above this handle the error.
    },
  },

  _redirectToDefaultOrganization() {
    if (!this.get('currentUser')) {
      return this.transitionTo('/login');
    }

    let lastOrganizationSlug = localStorageProxy.get('lastOrganizationSlug');
    if (lastOrganizationSlug) {
      this.transitionTo('organization.index', lastOrganizationSlug);
    } else {
      this.get('currentUser.organizations').then(orgs => {
        let org = orgs.get('firstObject');
        if (org) {
          this.transitionTo('organization.index', org.get('slug'));
        } else {
          // User has no organizations.
          this.transitionTo('organizations.new');
        }
      });
    }
  },

  _storeTargetTransition(transition) {
    const attemptedRoute = transition.targetName;
    if (!DO_NOT_FORWARD_REDIRECT_ROUTES.includes(attemptedRoute)) {
      const attemptedTransitionUrl = transition.intent.url;
      localStorageProxy.set(AUTH_REDIRECT_LOCALSTORAGE_KEY, attemptedTransitionUrl, {
        useSessionStorage: true,
      });
    }
  },

  _decideRedirect() {
    const redirectAddress = localStorageProxy.get(AUTH_REDIRECT_LOCALSTORAGE_KEY, '/', {
      useSessionStorage: true,
    });
    if (redirectAddress) {
      if (redirectAddress === '/') {
        this._redirectToDefaultOrganization();
      } else {
        localStorageProxy.removeItem(AUTH_REDIRECT_LOCALSTORAGE_KEY, {useSessionStorage: true});
        this.transitionTo(redirectAddress);
      }
    } else {
      this._redirectToDefaultOrganization();
    }
  },

  activate() {
    this.get('flashMessages').displayLocalStorageMessages();
  },

  _showLoginFailedFlashMessage() {
    this.get('flashMessages').createPersistentFlashMessage(
      {
        type: 'danger',
        message:
          'There was a problem with logging in. \
        Please try again or contact us if the issue does not resolve.',
        sticky: true,
      },
      {persistentReloads: 1},
    );
  },
});
