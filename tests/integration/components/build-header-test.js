import {setupComponentTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import {make} from 'ember-data-factory-guy';
import BuildHeader from 'percy-web/tests/pages/components/build-header';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: BuildHeader', function() {
  setupComponentTest('build-header', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    BuildHeader.setContext(this);
  });

  const states = [
    ['pending'],
    ['processing'],
    ['finished'],
    ['finished', 'withBaseBuild', 'noDiffs'],
    ['finished', 'withUpgradedBrowser'],
    ['finished', 'withTwoUpgradedBrowsers'],
    ['failed', 'missingResources'],
    ['failed', 'missingParallelBuilds'],
    ['failed', 'noSnapshots'],
    ['failed', 'renderTimeout'],
    // This snapshot should not show any browser upgrade notice.
    ['failed', 'withTwoUpgradedBrowsers'],
    ['expired'],
  ];

  states.forEach(state => {
    const testTitle = state.join(' ');

    it(`renders in state: ${testTitle}`, function() {
      const build = make.apply(this, ['build'].concat(state));
      const showSupportStub = sinon.stub();
      this.set('actions', {
        showSupport: showSupportStub,
      });
      this.setProperties({build});

      this.render(hbs`{{build-header build=build showSupport=(action "showSupport")}}`);
      percySnapshot(this.test);
    });
  });

  it('sends showSupport action when clicking "reach out" on timed out build', function() {
    const build = make('build', 'failed', 'renderTimeout');
    const showSupportStub = sinon.stub();
    this.set('actions', {
      showSupport: showSupportStub,
    });
    this.setProperties({
      build,
      showSupport: showSupportStub,
    });
    this.render(hbs`{{build-header build=build showSupport=(action "showSupport")}}`);

    this.$('[data-test-build-overview-show-support]').click();
    expect(showSupportStub).to.have.been.called; // eslint-disable-line
  });

  it('sends showSupport action when clicking "reach out" when missing parallel builds', function() {
    const build = make('build', 'failed', 'missingParallelBuilds');
    const showSupportStub = sinon.stub();
    this.set('actions', {
      showSupport: showSupportStub,
    });
    this.setProperties({
      build,
      showSupport: showSupportStub,
    });
    this.render(hbs`{{build-header build=build showSupport=(action "showSupport")}}`);

    this.$('[data-test-build-overview-show-support]').click();
    expect(showSupportStub).to.have.been.called; // eslint-disable-line
  });
});
