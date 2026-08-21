/* cookie.js — lichte cookiebanner + consent voor Google Maps & Google Ads
   Nederlands */
(function () {
  'use strict';

  var TEXT = {
    message: 'Wij gebruiken noodzakelijke cookies en — met uw toestemming — cookies voor kaartweergave en advertentiemeting.',
    policy: 'Meer informatie',
    policyUrl: './cookiebeleid.html',
    accept: 'Accepteren',
    reject: 'Alleen noodzakelijk',
    mapNotice: 'Om de kaart te tonen worden cookies van een externe kaartaanbieder geplaatst. Accepteer om de kaart te laden.',
    mapButton: 'Kaart laden'
  };

  // ── Google Consent Mode (standaard: geweigerd) ──
  window.dataLayer = window.dataLayer || [];
  // globaal maken: index.html en app.js roepen gtag() ook aan
  window.gtag = function gtag() { dataLayer.push(arguments); };
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  var KEY = 'cookieConsent';
  var choice = localStorage.getItem(KEY);

  function loadMaps() {
    document.querySelectorAll('iframe[data-cookiesrc]').forEach(function (f) {
      if (!f.getAttribute('src')) { f.setAttribute('src', f.getAttribute('data-cookiesrc')); }
    });
    document.querySelectorAll('.map-placeholder').forEach(function (p) { p.remove(); });
  }

  function grant() {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
  }

  function accept() {
    localStorage.setItem(KEY, 'accepted');
    grant();
    loadMaps();
    removeBanner();
  }

  function reject() {
    localStorage.setItem(KEY, 'rejected');
    removeBanner();
  }

  function removeBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) { b.remove(); }
  }

  // ── Kaart-placeholder tonen zolang geen toestemming ──
  function buildMapPlaceholders() {
    document.querySelectorAll('iframe[data-cookiesrc]').forEach(function (f) {
      var wrap = f.parentElement;
      if (wrap.querySelector('.map-placeholder')) { return; }
      var ph = document.createElement('div');
      ph.className = 'map-placeholder';
      ph.innerHTML = '<p>' + TEXT.mapNotice + '</p>' +
        '<button type="button" class="cookie-btn cookie-btn--primary" data-cookie-action="map">' + TEXT.mapButton + '</button>';
      wrap.appendChild(ph);
      ph.querySelector('[data-cookie-action="map"]').addEventListener('click', accept);
    });
  }

  // ── Banner bouwen ──
  function buildBanner() {
    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie-toestemming');
    el.innerHTML =
      '<p class="cookie-banner__text">' + TEXT.message +
      ' <a href="' + TEXT.policyUrl + '">' + TEXT.policy + '</a></p>' +
      '<div class="cookie-banner__actions">' +
      '<button type="button" class="cookie-btn cookie-btn--ghost" data-cookie-action="reject">' + TEXT.reject + '</button>' +
      '<button type="button" class="cookie-btn cookie-btn--primary" data-cookie-action="accept">' + TEXT.accept + '</button>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('[data-cookie-action="accept"]').addEventListener('click', accept);
    el.querySelector('[data-cookie-action="reject"]').addEventListener('click', reject);
  }

  function init() {
    if (choice === 'accepted') {
      grant();
      loadMaps();
    } else {
      buildMapPlaceholders();
      if (!choice) { buildBanner(); }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
