import Controller from '@ember/controller';
import snapshotSort from 'percy-web/lib/snapshot-sort';
import {filterBy, alias, or} from '@ember/object/computed';
import {computed} from '@ember/object';

export default Controller.extend({
  defaultBrowser: alias('browsers.firstObject'),
  chosenBrowser: null,
  selectedBrowser: or('chosenBrowser', 'defaultBrowser'),
  _browsers: alias('model.browsers'),
  browsers: computed('_browsers.@each.slug', function() {
    return this.get('_browsers').sortBy('slug');
  }),

  // set by initializeSnapshotOrdering
  snapshots: null,
  sortedSnapshots: computed('snapshots.[]', function() {
    if (!this.get('snapshots')) {
      return [];
    }
    return snapshotSort(this.get('snapshots').toArray(), this.get('selectedBrowser'));
  }),
  snapshotsUnreviewed: filterBy('sortedSnapshots', 'isUnreviewed', true),
  snapshotsApproved: filterBy('sortedSnapshots', 'isApprovedByUserEver', true),

  snapshotsChanged: null, // Manually managed by initializeSnapshotOrdering.

  numSnapshotsMissing: 0,
  numSnapshotsUnchanged: alias('numSnapshotsMissing'),

  // This breaks the binding for snapshotsChanged, specifically so that when a user clicks
  // approve, the snapshot stays in place until reload.
  //
  // Called by the route when entered and snapshots load.
  // Called by polling when snapshots reload after build is finished.
  initializeSnapshotOrdering(snapshots) {
    this.set('snapshots', snapshots);
    let orderedSnapshots = [].concat(
      this.get('snapshotsUnreviewed'),
      this.get('snapshotsApproved'),
    );

    this.set('snapshotsChanged', orderedSnapshots);

    const numSnapshotsMissing = this.get('model.totalSnapshots') - snapshots.get('length');
    this.set('numSnapshotsMissing', numSnapshotsMissing);

    this.set('isSnapshotsLoading', false);
  },

  actions: {
    updateSelectedBrowser(newBrowser) {
      this.set('chosenBrowser', newBrowser);
    },
  },
});
