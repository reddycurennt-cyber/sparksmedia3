// Main interactions for Sparks Media single-page site
// Requires Swiper and GSAP loaded on the page.

document.addEventListener('DOMContentLoaded', function () {

  // Smooth scroll for anchors with data-scroll
  function scrollToTarget(href){
    const target = document.querySelector(href);
    if(target){
      gsap.to(window, {duration:0.85, scrollTo: {y: target, autoKill:true}, ease:'power2.out'});
    }
  }

  document.querySelectorAll('a[data-scroll]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const href = a.getAttribute('href');
      scrollToTarget(href);
      // close nav modal if open
      closeNavModal();
    });
  });

  // Year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = (new Date()).getFullYear();

  // NAV: modal behavior (works at all resolutions)
  const navToggle = document.querySelector('.nav-toggle');
  const navModal = document.getElementById('nav-modal');
  const navModalClose = document.querySelector('.nav-modal-close');

  function openNavModal(){
    navModal.classList.add('show');
    navModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    setTimeout(()=> {
      const focusEl = navModal.querySelector('.nav-modal-close');
      focusEl && focusEl.focus();
    }, 60);
  }

  function closeNavModal(){
    if(!navModal) return;
    navModal.classList.remove('show');
    navModal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    navToggle?.setAttribute('aria-expanded','false');
  }

  navToggle?.addEventListener('click', (e)=>{
    e.stopPropagation();
    const isOpen = navModal.classList.contains('show');
    if(isOpen) closeNavModal();
    else {
      openNavModal();
      navToggle.setAttribute('aria-expanded','true');
    }
  });

  navModalClose?.addEventListener('click', (e)=>{
    e.stopPropagation();
    closeNavModal();
  });

  navModal?.addEventListener('click', (e)=>{
    if(e.target === navModal) closeNavModal();
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeNavModal();
  });

  navModal?.addEventListener('click', (e)=>{
    const toggle = e.target.closest('.modal-dropdown-toggle');
    if(toggle){
      const submenu = toggle.nextElementSibling;
      if(submenu){
        submenu.classList.toggle('show');
      }
    }
    const anchor = e.target.closest('a[data-scroll]');
    if(anchor && navModal.contains(anchor)){
      closeNavModal();
    }
  });

  navModal.querySelectorAll('a[data-scroll]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const href = a.getAttribute('href');
      scrollToTarget(href);
      closeNavModal();
    });
  });

  // Initialize Swiper - Hero
  const heroSwiper = new Swiper('.hero-swiper', {
    loop: true, speed: 800, autoplay: {delay: 2800, disableOnInteraction: false}, pagination: {el: '.swiper-pagination', clickable: true}, effect: 'slide'
  });

  // Clients slider
  const clientSwiper = new Swiper('.clients-swiper', {
    slidesPerView: 4, spaceBetween: 18, loop: true, autoplay: {delay: 1800},
    breakpoints: {0:{slidesPerView:2},600:{slidesPerView:3},940:{slidesPerView:4}}
  });

  // Testimonials swiper - added sliding effect, autoplay and coverflow option for nicer motion
  const testimonialsSwiper = new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 18,
    loop: true,
    centeredSlides: true,
    autoplay: { delay: 4200, disableOnInteraction: false },
    pagination: { el: '.testimonials-pagination', clickable: true },
    breakpoints: { 760: { slidesPerView: 2 }, 1100: { slidesPerView: 2.4 } },
    effect: 'slide',
    speed: 700
  });

  // Insta subsection swiper - sliding, autoplay
  const instaSwiper = new Swiper('.insta-swiper', {
    slidesPerView: 1,
    spaceBetween: 12,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { el: '.insta-pagination', clickable: true },
    breakpoints: { 700: { slidesPerView: 2 }, 1000: { slidesPerView: 3 } },
    effect: 'slide',
    speed: 700
  });

  // Reels swiper (if present in gallery) - keep simple sliding
  const reelsSwiper = new Swiper('.reels-swiper', {
    slidesPerView: 1,
    spaceBetween: 12,
    loop: true,
    pagination: { el: '.reels-pagination', clickable: true },
    breakpoints: { 700: { slidesPerView: 2 }, 1000: { slidesPerView: 3 } },
    autoplay: { delay: 3200, disableOnInteraction: false },
    effect: 'slide',
    speed: 200
  });

  // Hero GSAP
  gsap.fromTo('#hero-title', {y:18, opacity:0, scale:0.98}, {y:0, opacity:1, scale:1, duration:1.05, ease:'power3.out', delay:0.4});
  gsap.from('.hero-sub', {y:8, opacity:0, duration:0.8, delay:0.9});

  // Reveal on scroll using IntersectionObserver for .fade-in elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.section, .card, .portfolio-item, .gallery-item, .acc-item, .ach-item').forEach(el=>{
    el.classList.add('fade-in');
    revealObserver.observe(el);
  });

  // Achievements count-up when visible
  const achObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count') || '0',10);
        const valueNode = el.querySelector('.ach-value');
        if(valueNode && !valueNode.dataset.counted){
          const duration = 1200;
          const startTime = performance.now();
          function step(now){
            const t = Math.min(1, (now - startTime)/duration);
            const eased = Math.floor(t * target);
            valueNode.textContent = eased + (target > 9 ? '+' : '');
            if(t < 1) requestAnimationFrame(step);
            else { valueNode.dataset.counted = '1'; }
          }
          requestAnimationFrame(step);
        }
        achObserver.unobserve(el);
      }
    });
  }, {threshold: 0.25});
  document.querySelectorAll('.ach-item').forEach(item=>achObserver.observe(item));

  // Filters setup
  function setupFilter(containerSelector, itemSelector, btnSelector){
    const container = document.querySelector(containerSelector);
    if(!container) return;
    const items = container.querySelectorAll(itemSelector);
    const buttons = document.querySelectorAll(btnSelector);
    buttons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        buttons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        items.forEach(it=>{
          if(filter === 'all' || it.getAttribute('data-type') === filter){
            it.style.display = '';
            it.classList.remove('revealed');
            setTimeout(()=>it.classList.add('revealed'), 20);
          } else {
            it.style.display = 'none';
          }
        });
      });
    });
  }
  setupFilter('#expertise', '.card', '.expertise-filters .filter-btn');
  setupFilter('#portfolio', '.portfolio-item', '.portfolio-filters .filter-btn');
  setupFilter('#gallery', '.gallery-item', '.gallery-filters .filter-btn');

  // Accordion behavior for services (main section)
  document.querySelectorAll('.acc-trigger').forEach(trigger=>{
    trigger.addEventListener('click', ()=>{
      const item = trigger.parentElement;
      const panel = trigger.nextElementSibling;
      const open = panel.style.maxHeight && panel.style.maxHeight !== '0px';
      // close others
      document.querySelectorAll('.acc-panel').forEach(p=>{ if(p !== panel) p.style.maxHeight = null; p.previousElementSibling?.querySelector('.acc-icon i')?.classList?.add && (p.previousElementSibling.querySelector('.acc-icon i').className = 'fa fa-plus'); });
      if(!open){
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.querySelector('.acc-icon i').className = 'fa fa-minus';
        // animate entry sliding from above into place (slide down)
        gsap.fromTo(panel, {y:-12, opacity:0}, {y:0, opacity:1, duration:0.42, ease:'power2.out'});
        gsap.to(window, {duration:0.5, scrollTo: {y: item, offsetY: 80}});
      } else {
        panel.style.maxHeight = null;
        trigger.querySelector('.acc-icon i').className = 'fa fa-plus';
      }
    });
  });

  // Dropdown keyboard accessibility (top nav)
  document.querySelectorAll('.has-dropdown > a').forEach(a=>{
    a.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        const expanded = a.getAttribute('aria-expanded') === 'true';
        a.setAttribute('aria-expanded', String(!expanded));
        a.parentElement.querySelector('.dropdown')?.classList.toggle('open');
      }
    });
  });

  // Tiny micro-interactions: tilt on cards
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(py - 0.5) * 4}deg) rotateY(${(px - 0.5) * 6}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', ()=>card.style.transform = '');
  });

  // Reels & insta iframes attributes
  document.querySelectorAll('.reels-slide iframe, .insta-slide iframe').forEach(iframe=>{
    iframe.setAttribute('loading','lazy');
    iframe.setAttribute('referrerpolicy','no-referrer');
  });

  // CTA micro-popups (whatsapp, call, mail) - keep visible for click until outside click or timeout
  const micro = document.getElementById('micro-actions');
  let microVisible = false;
  let microTimeout = null;

  function showMicroActions(){
    if(!micro) return;
    micro.classList.add('active');
    microVisible = true;
    gsap.killTweensOf(micro);
    gsap.fromTo('#micro-actions .micro-btn', {y:12, opacity:0, scale:0.92}, {y:0, opacity:1, scale:1, duration:0.36, ease:'back.out(1.1)', stagger:0.06});
    // auto-hide after 12s as a fallback
    if(microTimeout) clearTimeout(microTimeout);
    microTimeout = setTimeout(()=>{ hideMicroActions(); microTimeout = null; }, 12000);
  }

  function hideMicroActions(){
    if(!micro) return;
    gsap.to('#micro-actions .micro-btn', {y:10, opacity:0, scale:0.92, duration:0.22, stagger:0.04, onComplete: ()=>{ micro.classList.remove('active'); microVisible = false; }});
    if(microTimeout) { clearTimeout(microTimeout); microTimeout = null; }
  }

  // attach micro actions to CTA triggers and floating CTA
  document.querySelectorAll('.js-cta, .js-floating').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      // toggle micro popups
      if(micro.classList.contains('active')) hideMicroActions();
      else showMicroActions();
      // if the link has a hash, scroll after showing micro actions
      const href = btn.getAttribute('href');
      if(href && href.startsWith('#')){
        const target = document.querySelector(href);
        if(target) gsap.to(window, {duration:0.9, scrollTo: {y: target, autoKill:true}, ease:'power2.out', delay: 0.28});
      }
    });

    // touch support trigger
    btn.addEventListener('touchstart', (e)=>{
      // show micro actions on touch as well
      if(!micro.classList.contains('active')) showMicroActions();
    }, {passive:true});
  });

  // Click actions for micro buttons (redirects already set in href)
  document.querySelectorAll('#micro-actions .micro-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      // hide micro actions after click to clear UI
      hideMicroActions();
      // let default navigation (href) work
    });
  });

  // Close micro-actions on click outside
  document.addEventListener('click', (e)=>{
    if(!e.target.closest('#micro-actions') && !e.target.closest('.js-cta') && !e.target.closest('.js-floating')){
      if(micro.classList.contains('active')) hideMicroActions();
    }
  });

  // Close micro-actions on ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && micro.classList.contains('active')) hideMicroActions();
  });

  // Contact form submit: demo
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const submit = contactForm.querySelector('button[type="submit"]');
      submit.disabled = true; submit.textContent = 'Sending...';
      setTimeout(()=>{
        submit.disabled = false; submit.textContent = 'Send Message';
        alert('Thanks! Your enquiry was sent (demo). Replace this handler with your backend email or API.');
        contactForm.reset();
      }, 1200);
    });
  }

});