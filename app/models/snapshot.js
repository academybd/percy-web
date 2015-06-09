import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  build: DS.belongsTo('build'),
  screenshots: DS.hasMany('screenshot'),
  finishedProcessingAt: DS.attr('date'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
});
