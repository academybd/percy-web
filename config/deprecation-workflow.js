window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    {handler: 'silence', matchId: 'ember-cli-page-object.old-collection-api'},
    {handler: 'silence', matchId: 'ember-simple-auth.session.authorize'},
    {handler: 'silence', matchId: 'ember-simple-auth.baseAuthorizer'},
    {handler: 'silence', matchId: 'ember-font-awesome.no-fa-prefix'},
  ],
};
