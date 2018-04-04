import DS from 'ember-data';

export default DS.Model.extend({
  browsers: DS.hasMany('browser'),
  name: DS.attr(),
  slug: DS.attr(),
});
