import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import {equal, not, or} from '@ember/object/computed';
import utils from 'percy-web/lib/utils';
import FilteredComparisonMixin from 'percy-web/mixins/filtered-comparisons';

export default Component.extend(FilteredComparisonMixin, {
  // required params
  flashMessages: service(),
  selectedWidth: null,
  selectedComparison: null,
  // required for FilteredComparisonMixin:
  snapshot: null,
  snapshotSelectedWidth: null,
  activeBrowser: null,

  // optional params
  fullscreen: false,
  comparisonMode: '',
  tagName: '',

  // required actions
  toggleViewMode: null,
  updateSelectedWidth: null,

  // optional actions
  expandSnapshot() {},
  registerChild() {},
  updateComparisonMode() {},

  isShowingFilteredComparisons: true,
  isNotShowingFilteredComparisons: not('isShowingFilteredComparisons'),
  isShowingAllComparisons: or('noComparisonsHaveDiffs', 'isNotShowingFilteredComparisons'),
  noComparisonsHaveDiffs: equal('comparisonsWithDiffs.length', 0),
  allComparisonsHaveDiffs: computed('browserComparisons.[]', 'comparisonsWithDiffs.[]', function() {
    return this.get('browserComparisons.length') === this.get('comparisonsWithDiffs.length');
  }),

  actions: {
    onCopySnapshotUrlToClipboard() {
      this.get('flashMessages').success('Snapshot URL was copied to your clipboard');
    },

    toggleFilteredComparisons() {
      this.toggleProperty('isShowingFilteredComparisons');
    },

    downloadHTML(type, snapshot) {
      const options = {includePercyMode: true};
      const url = utils.buildApiUrl(`${type}Asset`, snapshot.get('id'), options);

      utils.setWindowLocation(url);
    },
  },
});
