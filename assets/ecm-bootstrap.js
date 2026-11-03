/**
 * ECM bootstrap for Snorkeling Watamu (official runtime: https://ecm.plus/ecm.js)
 * Privacy fail closed while the ECM policy remains a draft.
 * Analytics must be configured in ECM rather than loaded directly on this website.
 */
(function () {
  'use strict';
  var cfg = window.__ECM_CONFIG__ || {};
  if (!cfg.siteId || cfg.apiBase !== 'https://ecm.plus') return;
  if (window.__SW_ECM_BOOTSTRAPPED__) return;
  window.__SW_ECM_BOOTSTRAPPED__ = true;
  var lang = document.documentElement.lang || 'it';
  if (!/^(it|en|de|fr)$/.test(lang)) lang = 'it';
  var url = cfg.apiBase + '/api/cmp/config?site_id=' +
    encodeURIComponent(cfg.siteId) + '&lang=' + encodeURIComponent(lang);
  fetch(url, { mode: 'cors', credentials: 'omit', cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('ECM config unavailable');
      return res.json();
    })
    .then(function (data) {
      if (!data || !data.site || data.site.id !== cfg.siteId ||
          !data.policy || !data.policy.id ||
          (data.policy.status && data.policy.status !== 'published')) return;
      if (document.querySelector('script[data-ecm-site]')) return;
      var script = document.createElement('script');
      script.src = cfg.apiBase + '/ecm.js';
      script.setAttribute('data-ecm-site', cfg.siteId);
      script.setAttribute('data-ecm-api', cfg.apiBase);
      script.setAttribute('data-ecm-lang', lang);
      script.async = true;
      document.head.appendChild(script);
    })
    .catch(function () {
      // Stay in denied/default consent state on failure.
    });
})();
