import Component from '@ember/component';

export default Component.extend({
  classes: null,
  text: 'Sign In',

  showIcon: true,
  tagName: 'button',
  classNames: ['LoginButton btn py-1 px-4 btn-app-access text-white f5 c-pointer'],
  attributeBindings: ['tabindex'],
  tabindex: 0,

  click() {
    this.send('login');
  },

  actions: {
    login() {
      this.sendAction('showLoginModal');
    },
  },

  keyDown(event) {
    // 13 = return key
    if (event.keyCode == 13) {
      this.click();
    }
  },
});
