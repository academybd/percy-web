import FactoryGuy from 'ember-data-factory-guy';
import moment from 'moment';
import faker from 'faker';

FactoryGuy.define('build', {
  sequences: {
    buildNumber: num => 5000 + num,
  },
  default: {
    buildNumber: FactoryGuy.generate('buildNumber'),
    state: 'pending',
    branch: 'master',
    userAgent: () => faker.lorem.slug(10),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    commit: FactoryGuy.belongsTo('commit'),
    snapshots: FactoryGuy.hasMany('snapshot'),
    browsers: () => [FactoryGuy.make('browser')],
  },
  traits: {
    withLongBranch: {branch: () => faker.lorem.slug(20)},
    withBaseBuild: {baseBuild: FactoryGuy.belongsTo('build')},
    withRepo: {repo: FactoryGuy.belongsTo('repo')},
    withGithubRepo: {repo: FactoryGuy.belongsTo('repo', 'github')},
    withGitlabRepo: {repo: FactoryGuy.belongsTo('repo', 'gitlab')},
    withGithubEnterpriseRepo: {repo: FactoryGuy.belongsTo('repo', 'githubEnterprise')},
    finished: {
      state: 'finished',
      finishedAt: () =>
        moment()
          .add(2, 'minutes')
          .add(31, 'seconds'),
      totalComparisons: 15,
      totalComparisonsDiff: 10,
      totalComparisonsFinished: 15,
      totalSnapshots: 10,
      totalSnapshotsUnreviewed: 8,
    },
    pending: {state: 'pending'},
    processing: {
      state: 'processing',
      totalComparisons: 2312,
      totalComparisonsFinished: 1543,
    },
    failed: {
      state: 'failed',
      failureReason: 'render_timeout',
      failureDetails: {failed_snapshots: ['The snapshot that failed']},
    },
    expired: {state: 'expired'},
    noDiffs: {
      totalComparisonsDiff: 0,
      totalComparisonsFinished: 12,
    },
    missingResources: {failureReason: 'missing_resources'},
    missingParallelBuilds: {
      failureReason: 'missing_resources',
      failureDetails: {
        missing_parallel_builds: true,
        parallel_builds_expected: 4,
        parallel_builds_received: 3,
      },
    },
    noSnapshots: {failureReason: 'no_snapshots'},
    renderTimeout: {
      failureReason: 'render_timeout',
      failureDetails: {failed_snapshots: ['The snapshot that failed']},
    },
    hasPullRequest: {
      isPullRequest: true,
      pullRequestNumber: 123,
      pullRequestHtmlUrl: f => `http://example.com/pull/${f.pullRequestNumber}`,
      pullRequestTitle: () => faker.lorem.sentence(5),
    },
    hasPullRequestWithoutTitle: {
      isPullRequest: true,
      pullRequestHtmlUrl: f => `http://example.com/pull/${f.pullRequestNumber}`,
      pullRequestNumber: 456,
    },

    // TODO: refactor these commit message customizations out of this build factory
    // https://github.com/percy/percy-web/pull/154#discussion_r129167477
    withLongHeadCommitMessage: {
      commit: FactoryGuy.belongsTo('commit', 'longMessage'),
    },
    withNoSpacesMessageCommitMessage: {
      commit: FactoryGuy.belongsTo('commit', 'noSpacesMessage'),
    },

    withTwoBrowsers: {
      browsers: () => {
        return [FactoryGuy.make('browser'), FactoryGuy.make('browser', 'chrome')];
      },
    },

    withUpgradedBrowser: {
      baseBuild: FactoryGuy.belongsTo('build', '_withOlderBrowser'),
      browsers: () => [FactoryGuy.make('browser')],
    },

    withTwoUpgradedBrowsers: {
      baseBuild: FactoryGuy.belongsTo('build', '_withTwoOlderBrowsers'),
      browsers: () => {
        return [FactoryGuy.make('browser'), FactoryGuy.make('browser', 'chrome')];
      },
    },

    // Private: use withUpgradedBrowser instead.
    _withOlderBrowser: {
      browsers: () => [FactoryGuy.make('browser', 'olderFirefox')],
    },

    // Private: use withTwoUpgradedBrowsers instead.
    _withTwoOlderBrowsers: {
      browsers: () => [
        FactoryGuy.make('browser', 'olderFirefox'),
        FactoryGuy.make('browser', 'olderChrome'),
      ],
    },
  },
});
