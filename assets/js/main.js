
(function(){
  'use strict';

  const nav = document.querySelector('.cw-navbar');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('nav-scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal, .fade-in-left, .fade-in-right');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Animated hero background image slider on every page
  document.querySelectorAll('[data-hero-images]').forEach(hero => {
    let images = [];
    try { images = JSON.parse(hero.getAttribute('data-hero-images')); } catch(e) {}
    if (!images.length) return;

    const layerA = document.createElement('div');
    const layerB = document.createElement('div');
    layerA.className = 'hero-bg-layer active';
    layerB.className = 'hero-bg-layer';
    layerA.style.backgroundImage = `url('${images[0]}')`;
    hero.prepend(layerB);
    hero.prepend(layerA);

    let active = 0;
    let showingA = true;
    setInterval(() => {
      active = (active + 1) % images.length;
      const show = showingA ? layerB : layerA;
      const hide = showingA ? layerA : layerB;
      show.style.backgroundImage = `url('${images[active]}')`;
      requestAnimationFrame(() => {
        show.classList.add('active');
        hide.classList.remove('active');
      });
      showingA = !showingA;
    }, 4600);
  });

  // Form UX only. Connect a production endpoint for real email/CRM submissions.
  document.querySelectorAll('form[data-form="quote"]').forEach(form => {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      const old = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = '<i class="bi bi-check2-circle"></i> Request received';
        btn.disabled = true;
      }
      setTimeout(() => {
        alert('Thank you. Your quote request has been received. CRESTWELL FACILITIES will contact you shortly.');
        if (btn) { btn.innerHTML = old; btn.disabled = false; }
        form.reset();
        form.classList.remove('was-validated');
      }, 450);
    });
  });
})();
