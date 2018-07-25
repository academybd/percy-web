import {computed} from '@ember/object';
import Component from '@ember/component';
import {htmlSafe} from '@ember/string';

export default Component.extend({
  tagName: '',
  organization: null,

  _dayStats: computed.alias('organization.subscription.currentUsageStats.dayStatsFormatted'),

  dayStatsFormatted: computed('_dayStats', 'maxDailySnapshot', function() {
    const dayStats = this.get('_dayStats');
    const yAxisCeiling = this.get('yAxisCeiling');
    if (!dayStats) {
      return;
    }

    return dayStats.map(dayStat => {
      const barHeight = (dayStat[1] / yAxisCeiling) * 100;
      return {
        date: dayStat[0],
        count: dayStat[1],
        percentOfHeight: htmlSafe(`--bar-height: ${barHeight}%`),
      };
    });
  }),

  yAxisCeiling: computed('_dayStats', function() {
    const dayStats = this.get('_dayStats');
    if (!dayStats) {
      return;
    }

    const dailySnapshots = dayStats.map(stat => stat[1]);
    const max = Math.max(...dailySnapshots);

    // round up to the next 5,000
    return Math.ceil(max / 5000.0) * 5000 || 5000;
  }),

  yAxisIncrementMarks: computed('yAxisCeiling', function() {
    const yAxisCeiling = this.get('yAxisCeiling');
    if (!yAxisCeiling) {
      return;
    }
    const ceiling = yAxisCeiling || 5000;
    return [5, 4, 3, 2, 1, 0].map(i => (ceiling / 5.0) * i).map(x => parseInt(x, 10));
  }),
});
