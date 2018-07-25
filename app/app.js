import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import {registerWarnHandler} from '@ember/debug';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
});

registerWarnHandler((message, options, next) => {
  var skip = ['ds.store.findRecord.id-mismatch', 'ds.store.push-link-for-sync-relationship'];

  if (skip.includes(options.id)) {
    return;
  }

  next(message, options);
});

loadInitializers(App, config.modulePrefix);

export default App;
