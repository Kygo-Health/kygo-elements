// Wix Velo page code: the same snippet on every component page (see docs/seo-markup-poc.md).
// If the page already has an $w.onReady, merge the body into it: one onReady per page.
import wixWindowFrontend from 'wix-window-frontend';
import wixLocationFrontend from 'wix-location-frontend';
import { getSeoMarkup } from 'backend/seoMarkup.web';

$w.onReady(function () {
  // Crawlers always get a server render; browsers don't need the markup.
  if (wixWindowFrontend.rendering.env !== 'backend') return;
  const path = '/' + wixLocationFrontend.path.join('/');
  return getSeoMarkup(path).then((html) => {
    if (html) $w('CustomElement').seoMarkup = html;
  });
});
