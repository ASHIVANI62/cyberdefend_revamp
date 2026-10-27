(() => {
  'use strict';
  const id = 'G-BFH57PLZRQ';
  const hosts = ['cyberdefend.in', 'www.cyberdefend.in', 'academy.cyberdefend.in', 'services.cyberdefend.in'];
  if (!hosts.includes(location.hostname)) return;
  const key = 'cd_analytics_consent';
  const choice = () => document.cookie.split('; ').find(c => c.startsWith(key + '='))?.split('=')[1];
  let enabled = false, loaded = false;
  window.dataLayer = window.dataLayer || [];
  const gtag = function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  const cleanURL = value => { try { const u = new URL(value); return u.origin + u.pathname; } catch { return ''; } };
  const enable = () => {
    enabled = true;
    window['ga-disable-' + id] = false;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (loaded) return;
    loaded = true;
    gtag('js', new Date());
    gtag('config', id, {
      page_location: cleanURL(location.href), page_referrer: cleanURL(document.referrer),
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: 'cyberdefend.in', cookie_flags: 'SameSite=Lax;Secure'
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  };
  const disable = () => {
    enabled = false;
    window['ga-disable-' + id] = true;
    // Do not send consent pings after withdrawal (basic consent mode).
    for (const item of document.cookie.split('; ')) {
      const name = item.split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ['', '; Domain=cyberdefend.in', '; Domain=' + location.hostname]) {
        document.cookie = name + '=; Max-Age=0; Path=/; Secure; SameSite=Lax' + domain;
      }
    }
  };
  const panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.setAttribute('aria-label', 'Analytics preferences');
  panel.innerHTML = '<strong>Help us improve CyberDefend</strong><p>Allow optional Google Analytics cookies to measure visits and enquiries? Your choice applies across our three sites. Enquiry contents are not included.</p><div><button type="button" data-choice="accepted">Accept analytics</button><button type="button" data-choice="declined">Reject analytics</button><a href="https://cyberdefend.in/privacy/">Privacy notice</a></div>';
  panel.hidden = true;
  document.body.append(panel);
  const settings = document.querySelector('[data-analytics-settings]');
  let openedFromSettings = false;
  settings?.addEventListener('click', () => { openedFromSettings = true; panel.hidden = false; panel.querySelector('button').focus({ preventScroll: true }); });
  panel.addEventListener('click', e => {
    const button = e.target.closest('[data-choice]');
    if (!button) return;
    const value = button.dataset.choice;
    document.cookie = key + '=' + value + '; Max-Age=15552000; Path=/; Domain=cyberdefend.in; Secure; SameSite=Lax';
    value === 'accepted' ? enable() : disable();
    panel.hidden = true;
    // Restore focus only when preferences were explicitly opened from the footer.
    // Never scroll the page when closing the initial consent banner.
    if (openedFromSettings) settings?.focus({ preventScroll: true });
    openedFromSettings = false;
  });
  if (choice() === 'accepted') enable();
  else if (choice() !== 'declined') panel.hidden = false;
  const track = (name, params) => {
    if (enabled && choice() === 'accepted') gtag('event', name, { ...params, transport_type: 'beacon' });
  };
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    try {
      const u = new URL(anchor.href);
      if (['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(u.hostname)) track('whatsapp_click', { contact_method: 'whatsapp' });
    } catch { /* Non-web links are not tracked. */ }
  });
  document.addEventListener('cyberdefend:enquiry-success', () => track('generate_lead', { contact_method: 'website_form' }));
  // Respect withdrawal on another subdomain or tab before further collection.
  window.addEventListener('focus', () => { if (choice() !== 'accepted') disable(); });
})();
