import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import {make} from 'ember-data-factory-guy';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import IntegrationItem from 'percy-web/tests/pages/components/integration-item';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import AdminMode from 'percy-web/lib/admin-mode';

describe('Integration | Component | organizations/integrations/integration-item', function() {
  setupComponentTest('organizations/integrations/integration-item', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    IntegrationItem.setContext(this);
    AdminMode.clear();
  });

  describe('with no integrations installed', function() {
    beforeEach(function() {
      const organization = make('organization');
      this.set('organization', organization);
    });

    it('shows the intall button for github', function() {
      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github"
        organization=organization}}`);

      expect(IntegrationItem.hasInstallButton).to.equal(true);
      percySnapshot(this.test);
    });

    it('shows the contact us button for github enterprise', function() {
      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github_enterprise"
        organization=organization}}`);

      expect(IntegrationItem.hasContactButton).to.equal(true);
      percySnapshot(this.test);
    });

    it('shows the contact us button for gitlab', function() {
      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab"
        organization=organization}}`);

      expect(IntegrationItem.hasContactButton).to.equal(true);
      percySnapshot(this.test);
    });

    it('links to the github enterprise form', function() {
      const formLink = 'https://docs.percy.io/docs/github-enterprise';

      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github_enterprise"
        organization=organization}}`);

      expect(IntegrationItem.contactButtonLink).to.equal(formLink);
    });

    it('links to the gitlab form', function() {
      const formLink = 'https://docs.percy.io/docs/gitlab';

      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab"
        organization=organization}}`);

      expect(IntegrationItem.contactButtonLink).to.equal(formLink);
    });

    it('does not show the beta badge for github', function() {
      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github"
        organization=organization}}`);

      expect(IntegrationItem.hasBetaBadge).to.equal(false);
    });

    it('does not show the beta badge for github enterprise', function() {
      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github_enterprise"
        organization=organization}}`);

      expect(IntegrationItem.hasBetaBadge).to.equal(false);
    });

    it('shows the beta badge for gitlab', function() {
      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab"
        organization=organization}}`);

      expect(IntegrationItem.hasBetaBadge).to.equal(true);
    });
  });

  describe('as an installed github integration item', function() {
    beforeEach(function() {
      const organization = make('organization', 'withGithubIntegration');
      this.set('organization', organization);

      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github"
        organization=organization}}`);
    });

    it('shows the edit settings button', function() {
      expect(IntegrationItem.hasEditButton).to.equal(true);
      percySnapshot(this.test);
    });
  });

  describe('as an installed github enterprise integration item', function() {
    beforeEach(function() {
      const organization = make('organization', 'withGithubEnterpriseIntegration');
      this.set('organization', organization);

      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github_enterprise"
        organization=organization}}`);
    });

    it('shows the contact us button', function() {
      expect(IntegrationItem.hasContactButton).to.equal(true);
      percySnapshot(this.test);
    });
  });

  describe('as an installed gitlab integration item', function() {
    beforeEach(function() {
      const organization = make('organization', 'withGitlabIntegration');
      this.set('organization', organization);

      this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab"
        organization=organization}}`);
    });

    it('shows the contact us button', function() {
      expect(IntegrationItem.hasContactButton).to.equal(true);
      percySnapshot(this.test);
    });
  });
});
