import {hash} from 'rsvp';
import {get} from '@ember/object';
import Route from '@ember/routing/route';
import ResetScrollMixin from '../../mixins/reset-scroll';
import percyDocs from 'percy-docs';

export default Route.extend(ResetScrollMixin, {
  model(params) {
    let pageMarkdown = get(percyDocs.markdownFiles, params.path.replace(/\//g, '.')) || '';
    let pageTitleMatch = /# (.*)/.exec(pageMarkdown);
    let pageTitle = pageTitleMatch ? pageTitleMatch[1] : 'Docs';

    let headerRegex = /\n(#{2,3}) ((.+))\n/g;
    let anchoredMarkdown = pageMarkdown.replace(headerRegex, function(match, hashes, title) {
      let titleDashed = title.replace(/( \(.*?\))/g, '').dasherize();

      return `\n${hashes} ${title} \
        <a href="#${titleDashed}" id="_${titleDashed}" class="DocsAnchor"> \
          <i aria-hidden="true" class="fa fa-link"></i> \
        </a>\n`;
    });

    return hash({
      docPath: `/docs/${params.path}`, // TODO(fotinakis): make more dynamic?
      navMarkdown: get(percyDocs.markdownFiles, 'nav'),
      pageMarkdown: anchoredMarkdown,
      pageTitle: pageTitle,
    });
  },
  actions: {
    didTransition() {
      this._super(...arguments);

      let model = this.modelFor(this.routeName);
      this.analytics.track('Docs Page Viewed', null, {path: model.docPath});
    },
  },
});
