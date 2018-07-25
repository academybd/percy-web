export function initialize(appInstance) {
  const {container = appInstance} = appInstance;
  const launchDarklyService = container.lookup('service:launch-darkly');
  launchDarklyService.initialize({key: 'anon', anonymous: true});
}

export default {
  initialize,
};
