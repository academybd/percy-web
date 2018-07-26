import {or} from '@ember/object/computed';
import Component from '@ember/component';
import {computed, get} from '@ember/object';
import {alias, readOnly} from '@ember/object/computed';
import {htmlSafe} from '@ember/string';

export default Component.extend({
  build: null,
  tagName: null,

  buildCompletionPercent: alias('build.buildCompletionPercent'),

  /* eslint-disable camelcase */
  isParallelBuildError: readOnly('build.failureDetails.missing_parallel_builds'),
  parallelBuildsExpected: readOnly('build.failureDetails.parallel_builds_expected'),
  parallelBuildsReceived: readOnly('build.failureDetails.parallel_builds_received'),
  /* eslint-enable camelcase */

  progressBarWidth: computed('buildCompletionPercent', function() {
    return `${get(this, 'buildCompletionPercent') - 100}%`;
  }),

  progressBarWidthStyle: computed('progressBarWidth', function() {
    return htmlSafe(`--progress-bar-width: ${get(this, 'progressBarWidth')}`);
  }),

  showActions: or('build.isPending', 'build.isProcessing', 'build.isFinished'),

  formattedFailedSnapshots: computed('build.failureDetails', function() {
    return '"' + get(this, 'build.failureDetails').failed_snapshots.join('", "') + '"';
  }),
});
