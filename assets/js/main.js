(() => {
  'use strict';

  const GA_ID = 'G-LFZ07J97HY';
  const CONSENT_KEY = 'cdl_analytics_consent_v1';
  const CONSENT_VERSION = '1';
  const CONSENT_GRANTED = 'granted';
  const CONSENT_DENIED = 'denied';
  let analyticsLoaded = false;

  const safeStorage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); return true; } catch (_) { return false; } }
  };

  const readConsent = () => {
    const raw = safeStorage.get(CONSENT_KEY);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return value && value.version === CONSENT_VERSION ? value.choice : null;
    } catch (_) {
      return raw === CONSENT_GRANTED || raw === CONSENT_DENIED ? raw : null;
    }
  };

  const writeConsent = (choice) => safeStorage.set(CONSENT_KEY, JSON.stringify({
    choice,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString()
  }));

  const defineGtag = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  };

  const loadAnalytics = () => {
    if (analyticsLoaded || readConsent() !== CONSENT_GRANTED) return;
    analyticsLoaded = true;
    defineGtag();

    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500
    });
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_update: true,
      transport_type: 'beacon'
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    script.dataset.cdlAnalytics = 'true';
    document.head.appendChild(script);
  };

  const deleteCookie = (name) => {
    const host = window.location.hostname;
    const domains = ['', host, `.${host}`];
    domains.forEach((domain) => {
      const domainPart = domain ? `; Domain=${domain}` : '';
      document.cookie = `${name}=; Max-Age=0; Path=/${domainPart}; SameSite=Lax`;
    });
  };

  const disableAnalytics = () => {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    deleteCookie('_ga');
    deleteCookie(`_ga_${GA_ID.replace(/^G-/, '')}`);
  };

  const trackEvent = (name, params = {}) => {
    if (readConsent() !== CONSENT_GRANTED) return;
    loadAnalytics();
    if (!window.gtag) return;
    window.gtag('event', name, {
      page_path: window.location.pathname,
      ...params
    });
  };
  window.cdlTrackEvent = trackEvent;

  const consentLabel = (choice) => {
    if (choice === CONSENT_GRANTED) return 'acceptata';
    if (choice === CONSENT_DENIED) return 'respinsa';
    return 'nealeasa';
  };

  const updateConsentStatus = () => {
    const text = consentLabel(readConsent());
    document.querySelectorAll('[data-consent-status]').forEach((element) => {
      element.textContent = text;
    });
  };

  const createConsentBanner = () => {
    const banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-labelledby', 'cookie-consent-title');
    banner.setAttribute('aria-describedby', 'cookie-consent-description');
    banner.hidden = true;
    banner.innerHTML = `
      <div class="cookie-banner__inner" role="document" tabindex="-1">
        <div class="cookie-banner__text">
          <strong id="cookie-consent-title">Cookie-uri de analiza</strong>
          <p id="cookie-consent-description">Accepti folosirea cookie-urilor de analiza pentru statistici de utilizare?</p>
          <a href="confidentialitate.html">Detalii</a>
        </div>
        <div class="cookie-banner__actions">
          <button class="cookie-consent-button cookie-consent-button--reject" data-consent-reject type="button">Refuza</button>
          <button class="cookie-consent-button cookie-consent-button--accept" data-consent-accept type="button">Accepta</button>
        </div>
      </div>`;
    document.body.appendChild(banner);

    const panel = banner.querySelector('.cookie-banner__inner');
    const rejectButton = banner.querySelector('[data-consent-reject]');
    const acceptButton = banner.querySelector('[data-consent-accept]');
    const detailsLink = banner.querySelector('a[href]');
    let lastFocused = null;

    const getFocusable = () => [detailsLink, rejectButton, acceptButton].filter(Boolean);

    const show = () => {
      lastFocused = document.activeElement;
      banner.hidden = false;
      document.body.classList.add('cookie-consent-open');
      requestAnimationFrame(() => {
        banner.classList.add('is-open');
        rejectButton.focus({ preventScroll: true });
      });
    };

    const hide = () => {
      banner.classList.remove('is-open');
      document.body.classList.remove('cookie-consent-open');
      window.setTimeout(() => {
        banner.hidden = true;
        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus({ preventScroll: true });
        }
      }, 180);
    };

    banner.addEventListener('keydown', (event) => {
      if (banner.hidden || event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    acceptButton.addEventListener('click', () => {
      writeConsent(CONSENT_GRANTED);
      updateConsentStatus();
      hide();
      loadAnalytics();
      trackEvent('consent_granted', { consent_version: CONSENT_VERSION });
    });

    rejectButton.addEventListener('click', () => {
      const wasGranted = readConsent() === CONSENT_GRANTED;
      writeConsent(CONSENT_DENIED);
      disableAnalytics();
      updateConsentStatus();
      hide();
      if (wasGranted) window.location.reload();
    });

    document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
      button.addEventListener('click', show);
    });

    if (!readConsent()) show();
    return { show, hide };
  };

  // Navigation menu
  const toggle = document.querySelector('.menu-button');
  const menu = document.querySelector('.menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Dynamic year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Reveal animation with fallback
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  // Contact form: no data is stored by the website.
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = (id) => document.getElementById(id).value.trim();
      const subject = encodeURIComponent(`Solicitare colaborare - ${value('name')}`);
      const body = encodeURIComponent(`Buna ziua,\n\nDoresc sa discut o posibila colaborare cu Laborator Dentar CDL.\n\nNume medic / clinica: ${value('name')}\nTelefon: ${value('phone')}\nEmail: ${value('email')}\nFlux preferat: ${value('flow')}\nMesaj: ${value('message')}\n\nNu am inclus date identificabile ale pacientului.\n\nMultumesc.`);
      const mailto = `mailto:laborator.cdl@gmail.com?subject=${subject}&body=${body}`;
      let opened = false;
      const openMail = () => {
        if (opened) return;
        opened = true;
        window.location.href = mailto;
      };

      if (readConsent() === CONSENT_GRANTED) {
        loadAnalytics();
        window.gtag('event', 'generate_lead', {
          method: 'email_form',
          flow_preference: value('flow'),
          page_path: window.location.pathname,
          transport_type: 'beacon',
          event_callback: openMail
        });
        window.setTimeout(openMail, 500);
      } else {
        openMail();
      }
    });
  }

  // Track only anonymous interaction metadata; never form field values.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const absolute = link.href || href;
    const label = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100);

    if (href.startsWith('tel:')) {
      trackEvent('contact_click', { method: 'phone', link_text: label });
    } else if (href.startsWith('mailto:')) {
      trackEvent('contact_click', { method: 'email', link_text: label });
    } else if (/facebook\.com/i.test(absolute)) {
      trackEvent('social_click', { network: 'facebook', link_url: absolute });
    } else if (/contact\.html(?:$|[?#])/.test(href) && !/contact\.html$/.test(window.location.pathname)) {
      trackEvent('contact_page_click', { link_text: label });
    }
  });

  // Accessible portfolio lightbox
  (() => {
    const links = Array.from(document.querySelectorAll('.portfolio-page .portfolio-open'));
    if (!links.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'portfolio-lightbox';
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <div class="portfolio-lightbox__backdrop" data-lightbox-close></div>
      <div class="portfolio-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Vizualizare fotografie portofoliu">
        <div class="portfolio-lightbox__counter" aria-live="polite"></div>
        <button class="portfolio-lightbox__close" type="button" aria-label="Inchide fotografia" data-lightbox-close>&times;</button>
        <button class="portfolio-lightbox__nav portfolio-lightbox__prev" type="button" aria-label="Fotografia precedenta">&#8249;</button>
        <figure class="portfolio-lightbox__figure"><img class="portfolio-lightbox__image" alt="" /></figure>
        <button class="portfolio-lightbox__nav portfolio-lightbox__next" type="button" aria-label="Fotografia urmatoare">&#8250;</button>
        <figcaption class="portfolio-lightbox__caption"><strong></strong><span></span></figcaption>
      </div>`;
    document.body.appendChild(lightbox);

    const image = lightbox.querySelector('.portfolio-lightbox__image');
    const title = lightbox.querySelector('.portfolio-lightbox__caption strong');
    const detail = lightbox.querySelector('.portfolio-lightbox__caption span');
    const counter = lightbox.querySelector('.portfolio-lightbox__counter');
    const closeButton = lightbox.querySelector('.portfolio-lightbox__close');
    const prevButton = lightbox.querySelector('.portfolio-lightbox__prev');
    const nextButton = lightbox.querySelector('.portfolio-lightbox__next');
    const dialog = lightbox.querySelector('.portfolio-lightbox__dialog');
    let currentIndex = 0;
    let lastFocused = null;
    let touchStartX = 0;
    let touchStartY = 0;
    const normaliseIndex = (index) => (index + links.length) % links.length;

    const render = (index) => {
      currentIndex = normaliseIndex(index);
      const link = links[currentIndex];
      const thumbnail = link.querySelector('img');
      const figure = link.closest('.portfolio-item');
      const captionTitle = figure ? figure.querySelector('figcaption strong') : null;
      const captionDetail = figure ? figure.querySelector('figcaption span') : null;
      image.src = link.href;
      image.alt = thumbnail ? thumbnail.alt : '';
      title.textContent = captionTitle ? captionTitle.textContent.trim() : image.alt;
      detail.textContent = captionDetail ? captionDetail.textContent.trim() : '';
      detail.hidden = !detail.textContent;
      counter.textContent = `${currentIndex + 1} / ${links.length}`;
    };

    const openLightbox = (index, source) => {
      lastFocused = source || document.activeElement;
      render(index);
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      requestAnimationFrame(() => {
        lightbox.classList.add('is-open');
        closeButton.focus({ preventScroll: true });
      });
      const figure = links[index].closest('.portfolio-item');
      const caption = figure ? figure.querySelector('figcaption strong') : null;
      trackEvent('portfolio_image_open', {
        image_index: index + 1,
        image_title: caption ? caption.textContent.trim() : ''
      });
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      window.setTimeout(() => {
        lightbox.hidden = true;
        image.removeAttribute('src');
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
      }, 220);
    };

    links.forEach((link, index) => link.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(index, link);
    }));
    prevButton.addEventListener('click', () => render(currentIndex - 1));
    nextButton.addEventListener('click', () => render(currentIndex + 1));
    lightbox.querySelectorAll('[data-lightbox-close]').forEach((element) => element.addEventListener('click', closeLightbox));

    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') render(currentIndex - 1);
      if (event.key === 'ArrowRight') render(currentIndex + 1);
      if (event.key === 'Tab') {
        const focusable = [closeButton, prevButton, nextButton];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });

    dialog.addEventListener('touchstart', (event) => {
      if (event.touches.length !== 1) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });
    dialog.addEventListener('touchend', (event) => {
      if (event.changedTouches.length !== 1) return;
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
        render(deltaX > 0 ? currentIndex - 1 : currentIndex + 1);
      }
    }, { passive: true });
  })();

  createConsentBanner();
  updateConsentStatus();
  if (readConsent() === CONSENT_GRANTED) loadAnalytics();

  window.addEventListener('storage', (event) => {
    if (event.key !== CONSENT_KEY) return;
    updateConsentStatus();
    if (readConsent() === CONSENT_GRANTED) loadAnalytics();
    else window.location.reload();
  });
})();
