window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Using the injected `container` is deprecated. Please use the `getOwner` helper instead to access the owner of this object." },
    { handler: "silence", matchMessage: "Using `ApplicationInstance.registry.injection` is deprecated. Please use `ApplicationInstance.inject` instead." }
  ]
};