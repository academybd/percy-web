/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupComponentTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import {resolve, defer} from 'rsvp';
import SnapshotApprovalButton from 'percy-web/tests/pages/components/snapshot-approval-button';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {browserSnapshot} from 'percy-web/models/snapshot';

describe('Integration: SnapshotApprovalButton', function() {
  setupComponentTest('snapshot-approval-button', {
    integration: true,
  });

  let snapshot;
  let createReview;

  beforeEach(function() {
    setupFactoryGuy(this.container);
    SnapshotApprovalButton.setContext(this);
    snapshot = browserSnapshot.create({content: make('snapshot'), browser: make('browser')});
    createReview = sinon.stub().returns(resolve());
    this.setProperties({snapshot, createReview});
  });

  it('displays correctly when snapshot is not approved ', function() {
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
    }}`);
    percySnapshot(this.test);
  });

  it('displays correctly when snapshot is approved', function() {
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
    }}`);
    this.set('snapshot.reviewState', 'approved');
    percySnapshot(this.test);
  });

  it('calls createReview with correct args when clicked', function() {
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
    }}`);
    SnapshotApprovalButton.clickButton();

    expect(createReview).to.have.been.calledWith([snapshot.get('content')]);
  });

  it('displays correctly when in loading state ', function() {
    const deferred = defer();
    const createReview = sinon.stub().returns(deferred.promise);
    this.set('createReview', createReview);
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=(action createReview)
    }}`);
    SnapshotApprovalButton.clickButton();

    percySnapshot(this.test);
  });
});
