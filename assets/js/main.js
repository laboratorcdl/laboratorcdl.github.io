const toggle=document.querySelector('.menu-button');const menu=document.querySelector('.menu');if(toggle&&menu){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.classList.toggle('open')});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}))}const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));const form=document.getElementById('contactForm');if(form){form.addEventListener('submit',event=>{event.preventDefault();const v=id=>document.getElementById(id).value.trim();const subject=encodeURIComponent('Solicitare colaborare - '+v('name'));const body=encodeURIComponent(`Buna ziua,\n\nDoresc sa discut o posibila colaborare cu Laborator Dentar CDL.\n\nNume medic / clinica: ${v('name')}\nTelefon: ${v('phone')}\nEmail: ${v('email')}\nFlux preferat: ${v('flow')}\nMesaj: ${v('message')}\n\nNu am inclus date identificabile ale pacientului.\n\nMultumesc.`);window.location.href=`mailto:laborator.cdl@gmail.com?subject=${subject}&body=${body}`})}

/* CDL Faza 6.2 - lightbox accesibil pentru Portofoliu */
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
      <figure class="portfolio-lightbox__figure">
        <img class="portfolio-lightbox__image" alt="" />
      </figure>
      <button class="portfolio-lightbox__nav portfolio-lightbox__next" type="button" aria-label="Fotografia urmatoare">&#8250;</button>
      <figcaption class="portfolio-lightbox__caption">
        <strong></strong><span></span>
      </figcaption>
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
    const caption = figure ? figure.querySelector('figcaption') : null;
    const captionTitle = caption ? caption.querySelector('strong') : null;
    const captionDetail = caption ? caption.querySelector('span') : null;

    image.src = link.href;
    image.alt = thumbnail ? thumbnail.alt : '';
    title.textContent = captionTitle ? captionTitle.textContent.trim() : (thumbnail ? thumbnail.alt : '');
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
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    window.setTimeout(() => {
      lightbox.hidden = true;
      image.removeAttribute('src');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus({ preventScroll: true });
      }
    }, 220);
  };

  links.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(index, link);
    });
  });

  prevButton.addEventListener('click', () => render(currentIndex - 1));
  nextButton.addEventListener('click', () => render(currentIndex + 1));
  lightbox.querySelectorAll('[data-lightbox-close]').forEach((element) => {
    element.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') render(currentIndex - 1);
    if (event.key === 'ArrowRight') render(currentIndex + 1);
    if (event.key === 'Tab') {
      const focusable = [closeButton, prevButton, nextButton];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
