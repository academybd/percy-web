import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  snapshotQuery: service(),
  reviews: service(),

  model(params) {
    // Note: passing {reload: true} here to ensure a full reload including all sideloaded data.
    return this.store.findRecord('build', params.build_id, {reload: true});
  },
  afterModel(model) {
    const controller = this.controllerFor(this.routeName);
    controller.set('build', model);

    if (model && model.get('isFinished')) {
      controller.set('isSnapshotsLoading', true);

      this.get('snapshotQuery')
        .getChangedSnapshots(model)
        .then(() => {
          return this._initializeSnapshotOrdering();
        });
    }
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('build', model);
  },

  _initializeSnapshotOrdering() {
    // this route path needs to be explicit so it will work with fullscreen snapshots.
    let controller = this.controllerFor('organization.project.builds.build');
    controller.initializeSnapshotOrdering();
  },

  actions: {
    updateIsHidingBuildContainer(isHidingBuildContainer) {
      const controller = this.controllerFor(this.routeName);
      controller.set('isHidingBuildContainer', isHidingBuildContainer);
    },

    initializeSnapshotOrdering() {
      this._initializeSnapshotOrdering();
    },

    didTransition() {
      this._super.apply(this, arguments);

      this.send('updateIsHidingBuildContainer', false);

      const build = this._getBuild();
      let organization = build.get('project.organization');
      let eventProperties = {
        project_id: build.get('project.id'),
        project_slug: build.get('project.slug'),
        build_id: build.get('id'),
        state: build.get('state'),
      };
      this.analytics.track('Build Viewed', organization, eventProperties);
    },

    openSnapshotFullModal(snapshotId, snapshotSelectedWidth, activeBrowser) {
      this.send('updateIsHidingBuildContainer', true);
      const build = this._getBuild();

      let organization = build.get('project.organization');
      let eventProperties = {
        project_id: build.get('project.id'),
        project_slug: build.get('project.slug'),
        build_id: build.get('id'),
        snapshot_id: snapshotId,
      };
      this.analytics.track('Snapshot Fullscreen Selected', organization, eventProperties);

      this.transitionTo(
        'organization.project.builds.build.snapshot',
        snapshotId,
        snapshotSelectedWidth,
        {
          queryParams: {mode: 'diff', activeBrowserFamilySlug: activeBrowser.get('familySlug')},
        },
      );
    },
    closeSnapshotFullModal() {
      const build = this._getBuild();
      this.send('updateIsHidingBuildContainer', false);
      this.transitionTo('organization.project.builds.build', build.get('id'));
    },

    createReview(snapshots) {
      const build = this._getBuild();
      return this.get('reviews').createApprovalReview(build, snapshots);
    },
  },

  // Use this instead of `modelFor(this.routeName)` because it returns a resolved build object
  // rather than a PromiseObject.
  _getBuild() {
    const controller = this.controllerFor(this.routeName);
    return controller.get('build');
  },
});
