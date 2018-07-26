import {on} from '@ember/object/evented';
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export const AUTH_REDIRECT_LOCALSTORAGE_KEY = 'percyAttemptedTransition';
export const AUTH_CALLBACK_ROUTE = 'auth-callback';
const VERIFY_EMAIL_ROUTE = 'verify-email';
const VERIFICATION_REQUIRED_ROUTE = 'email-verification-required';
const PASSWORD_UPDATED_ROUTE = 'password-updated';
const LOGIN_ROUTE = 'login';

export const DO_NOT_FORWARD_REDIRECT_ROUTES = [
  AUTH_CALLBACK_ROUTE,
  VERIFY_EMAIL_ROUTE,
  VERIFICATION_REQUIRED_ROUTE,
  PASSWORD_UPDATED_ROUTE,
  LOGIN_ROUTE,
];

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  notifyGoogleAnalytics: on('didTransition', function() {
    if (window.ga) {
      window.ga('send', 'pageview', {page: this.get('url')});
    }
    if (window.Intercom) {
      window.Intercom('update');
    }
    return true;
  }),
});

Router.map(function() {
  this.route('join', {path: '/join/:invite_code'});
  this.route('auth-failure', {path: 'auth/failure'});
  this.route(AUTH_CALLBACK_ROUTE, {path: '/auth/callback'});
  this.route(VERIFY_EMAIL_ROUTE, {path: '/auth/verify-email'});
  this.route(VERIFICATION_REQUIRED_ROUTE, {path: '/auth/email-verification-required'});
  this.route(PASSWORD_UPDATED_ROUTE, {path: '/auth/password-updated'});
  // Docs and child routes are deprecated and are intercepted in docs route for redirect.
  this.route('docs', {path: '/docs'}, function() {
    this.route('page', {path: '*path'});
  });
  this.route(LOGIN_ROUTE);
  this.route('pricing');
  this.route('enterprise');
  this.route('team');
  this.route('about'); // Redirects to team in route.
  this.route('terms');
  this.route('privacy');
  this.route('security');
  this.route('admin');
  this.route('changelog');
  this.route('settings', function() {
    this.route('profile');
    this.route('connected-accounts');
  });
  this.route('setup', {path: '/setup'}, function() {
    this.route('github-app');
  });
  this.route('organizations', {path: '/organizations'}, function() {
    this.route('new');
    this.route('organization', {path: '/:organization_id'}, function() {
      this.route('setup');
      this.route('projects', {path: '/projects'}, function() {
        this.route('new');
      });
      this.route('settings');
      this.route('users', function() {
        this.route('invite');
      });
      this.route('billing');
      this.route('integrations', function() {
        this.route('github-enterprise');
        this.route('github');
        this.route('gitlab');
      });
    });
  });
  this.route('organization', {path: '/:organization_id'}, function() {
    // Don't add anything else in this top-level namespace, we want to allow users to own the whole
    // projects namespace. Org-level settings and such should go in the above "organizations" route.
    this.route('project', {path: '/:project_id'}, function() {
      this.route('settings');
      this.route('builds', {}, function() {
        this.route('build', {path: '/:build_id'}, function() {
          this.route('snapshot', {path: '/view/:snapshot_id/:width'});
        });
      });
    });
  });
});

export default Router;
