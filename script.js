/* Independent progressive enhancements: optional markup never stops later features. */
(() => {
  const root = document.documentElement;
  const media = (query) => window.matchMedia ? window.matchMedia(query) : { matches: false };
  const motion = media('(prefers-reduced-motion: reduce)');
  const pointer = media('(hover: hover) and (pointer: fine)');
  const watch = (query, callback) => {
    if (query.addEventListener) query.addEventListener('change', callback);
    else if (query.addListener) query.addListener(callback);
  };
  const effectsAllowed = () => pointer.matches && !motion.matches;

  function setupTheme() {
    const system = media('(prefers-color-scheme: light)');
    const button = document.querySelector('.theme-toggle');
    const meta = document.querySelector('meta[name="theme-color"]');
    let explicit = false;
    try { explicit = ['light', 'dark'].includes(localStorage.getItem('portfolio-theme')); } catch (_) {}
    function apply(theme) {
      root.dataset.theme = theme;
      const light = theme === 'light';
      if (button) {
        button.setAttribute('aria-pressed', String(light));
        button.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
        const icon = button.querySelector('[aria-hidden]');
        if (icon) icon.textContent = light ? '\u263e' : '\u2600';
      }
      if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim();
    }
    apply(['light', 'dark'].includes(root.dataset.theme) ? root.dataset.theme : (system.matches ? 'light' : 'dark'));
    if (button) {
      button.addEventListener('click', () => {
        explicit = true;
        apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
        try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) {}
      });
      button.hidden = false;
    }
    watch(system, () => { if (!explicit) apply(system.matches ? 'light' : 'dark'); });
  }

  function setupMenu() {
    const nav = document.querySelector('.nav');
    const button = document.querySelector('.menu-toggle');
    const menu = document.getElementById(button?.getAttribute('aria-controls') || '');
    if (!nav || !button || !menu) return; // Keep the plain links visible.
    const mobile = media('(max-width: 719px)');
    function close(returnFocus = false) {
      nav.classList.remove('menu-open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation menu');
      if (returnFocus) button.focus();
    }
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('menu-open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close(mobile.matches)));
    document.addEventListener('click', event => { if (!nav.contains(event.target)) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('menu-open')) close(true);
    });
    nav.addEventListener('focusout', event => {
      if (event.relatedTarget && !nav.contains(event.relatedTarget)) close();
    });
    watch(mobile, () => close(mobile.matches && menu.contains(document.activeElement)));
    button.hidden = false;
    nav.classList.add('menu-ready');
  }

  function setupScroll() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
    const progress = document.querySelector('.scroll-progress');
    const header = document.querySelector('.site-header');
    const links = [...document.querySelectorAll('.nav-links a')];
    // getElementById accepts fragment IDs without CSS-selector parsing errors.
    const targets = links.map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
      .filter(item => item.section);
    let frame = 0;
    function update() {
      frame = 0;
      const maximum = Math.max(0, root.scrollHeight - innerHeight);
      const ratio = maximum ? Math.min(1, Math.max(0, scrollY / maximum)) : 0;
      const marker = (header?.offsetHeight || 0) + innerHeight * 0.2;
      let active = null;
      // All layout reads precede style writes.
      targets.forEach(({ section }) => { if (section.getBoundingClientRect().top <= marker) active = section.id; });
      if (maximum > 0 && scrollY >= maximum - 2) active = targets.at(-1)?.section.id;
      if (progress) progress.style.transform = `scaleX(${ratio})`;
      links.forEach(link => {
        if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    update();
  }

  function setupReveals() {
    if (motion.matches || !('IntersectionObserver' in window)) return;
    // Reveal section introductions separately so tall sections never hide their cards.
    const elements = [...document.querySelectorAll('.section-heading, .about-copy, .skill-card, .project-card, .creative-feature')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.15) return;
        observer.unobserve(entry.target); // Each element is observed only once.
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-visible');
      });
    }, { threshold: 0.15 });
    function show(element) {
      element.classList.remove('reveal-pending', 'reveal-visible');
      observer.unobserve(element);
    }
    try {
      // Measure every element before adding classes that alter its rendering.
      const pending = elements.filter(element => element.getBoundingClientRect().top >= innerHeight);
      pending.forEach(element => {
        const index = [...element.parentElement.children].indexOf(element);
        element.style.setProperty('--reveal-delay', `${element.matches('article') ? (index % 3) * 30 : 0}ms`);
        element.addEventListener('animationend', event => { if (event.target === element && event.animationName === 'reveal-in') show(element); });
        observer.observe(element);
        element.classList.add('reveal-pending');
      });
    } catch (error) {
      observer.disconnect();
      elements.forEach(show);
      throw error;
    }
    // A later runtime error must never strand content in its hidden state.
    const showAll = () => { observer.disconnect(); elements.forEach(show); };
    addEventListener('error', showAll, { once: true });
    addEventListener('unhandledrejection', showAll, { once: true });
    watch(motion, () => { if (motion.matches) showAll(); });
    document.addEventListener('focusin', event => {
      let element = event.target;
      while (element instanceof Element) {
        if (element.classList.contains('reveal-pending') || element.classList.contains('reveal-visible')) show(element);
        element = element.parentElement;
      }
    });
  }

  function setupPointerEffects() {
    let dispose = null;
    function enable() {
      if (dispose) { dispose(); dispose = null; }
      if (!effectsAllowed() || !document.body) return;
      const events = new AbortController();
      const listen = (target, type, callback) => target.addEventListener(type, callback, { passive: true, signal: events.signal });
      const makeLayer = (name) => {
        const element = document.createElement('div');
        element.className = name;
        element.setAttribute('aria-hidden', 'true');
        document.body.append(element);
        return element;
      };
      const glow = makeLayer('site-glow');
      const dot = makeLayer('cursor-dot');
      const ring = makeLayer('cursor-ring');
      const interactive = 'a, button, .skill-card, .project-card, [role="button"]';
      const editable = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable]:not([contenteditable="false"])';
      let frame = 0, x = 0, y = 0, ringX = 0, ringY = 0;
      let visible = false, hovering = false, refreshHit = false;
      let glowX = null, glowY = null;
      const cards = [...document.querySelectorAll('.project-card, .skill-card')];
      const resets = [];
      const resizes = [];
      function hit(target) {
        const element = target instanceof Element ? target : null;
        hovering = Boolean(element?.closest(interactive));
        root.classList.toggle('cursor-over-text', Boolean(element?.closest(editable)));
        ring.classList.toggle('is-hovering', hovering);
        ring.classList.toggle('is-over-copy', Boolean(element?.closest('p, h1, h2, h3, li, label, .eyebrow, .hero-footnote')));
        dot.classList.toggle('is-on-primary', Boolean(element?.closest('.button-primary')));
      }
      function paint() {
        frame = 0;
        if (!visible) return;
        // Hit-testing is done before any writes, only when scrolling changes the target.
        if (refreshHit) { hit(document.elementFromPoint(x, y)); refreshHit = false; }
        ringX += (x - ringX) * 0.35;
        ringY += (y - ringY) * 0.35;
        const settled = Math.abs(x - ringX) + Math.abs(y - ringY) < 0.01;
        if (settled) { ringX = x; ringY = y; }
        dot.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0) scale(${hovering ? 0.75 : 1})`;
        ring.style.transform = `translate3d(${ringX - 13}px, ${ringY - 13}px, 0)`;
        // The requested full-viewport gradient is updated at most once per frame.
        if (x !== glowX || y !== glowY) {
          glow.style.setProperty('--mx', `${x}px`);
          glow.style.setProperty('--my', `${y}px`);
          glowX = x; glowY = y;
        }
        if (!settled) frame = requestAnimationFrame(paint);
      }
      function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
      function hide() {
        visible = false;
        ring.classList.remove('is-pressed', 'is-hovering', 'is-over-copy');
        cancelAnimationFrame(frame); frame = 0;
        root.classList.remove('custom-cursor', 'cursor-over-text');
        glow.classList.remove('is-active');
        resets.forEach(reset => reset());
      }
      listen(document, 'pointermove', event => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        x = event.clientX; y = event.clientY;
        if (!visible) {
          ringX = x; ringY = y;
          // Set both positions before hiding the system cursor on first entry.
          dot.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0) scale(${hovering ? 0.75 : 1})`;
          ring.style.transform = `translate3d(${x - 13}px, ${y - 13}px, 0)`;
        }
        visible = true; hit(event.target);
        root.classList.add('custom-cursor'); glow.classList.add('is-active');
        schedule();
      });
      listen(document, 'pointerover', event => {
        if (event.pointerType === 'mouse' && visible) { hit(event.target); schedule(); }
      });
      listen(document, 'pointerdown', event => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        ring.classList.add('is-pressed'); schedule();
      });
      listen(window, 'pointerup', () => { ring.classList.remove('is-pressed'); schedule(); });
      listen(document, 'pointerout', event => { if (!event.relatedTarget) hide(); });
      listen(document.documentElement, 'pointerleave', hide);
      listen(window, 'pointercancel', hide);
      listen(window, 'blur', hide);
      listen(document, 'visibilitychange', () => { if (document.hidden) hide(); });
      listen(window, 'scroll', () => { if (visible) { refreshHit = true; schedule(); } });

      // Every card receives a spotlight; project cards retain their smoothed tilt.
      cards.forEach(card => {
        const tilts = card.classList.contains('project-card');
        let box = null, originScroll = 0, cardFrame = 0, inside = false;
        let angleX = 0, angleY = 0, targetX = 0, targetY = 0, lift = 0, targetLift = 0;
        let localX = 0, localY = 0;
        function measure() { box = card.getBoundingClientRect(); originScroll = scrollY; }
        function paintCard() {
          cardFrame = 0;
          angleX += (targetX - angleX) * 0.15;
          angleY += (targetY - angleY) * 0.15;
          lift += (targetLift - lift) * 0.15;
          const settled = Math.abs(targetX - angleX) + Math.abs(targetY - angleY) + Math.abs(targetLift - lift) < 0.01;
          if (settled) { angleX = targetX; angleY = targetY; lift = targetLift; }
          card.style.setProperty('--card-x', `${localX}px`);
          card.style.setProperty('--card-y', `${localY}px`);
          if (tilts) {
            card.style.setProperty('--card-lift', `${lift.toFixed(3)}px`);
            card.style.setProperty('--tilt-x', `${angleX.toFixed(3)}deg`);
            card.style.setProperty('--tilt-y', `${angleY.toFixed(3)}deg`);
          }
          if (tilts && !settled) cardFrame = requestAnimationFrame(paintCard);
          else if (!inside) card.classList.remove('tilt-tracking');
        }
        function scheduleCard() { if (!cardFrame) cardFrame = requestAnimationFrame(paintCard); }
        function move(event) {
          if (event.pointerType !== 'mouse' || card.matches('.reveal-pending, .reveal-visible')) return;
          if (!box) measure();
          inside = true;
          localX = event.clientX - box.left;
          localY = event.clientY - box.top + scrollY - originScroll;
          const horizontal = Math.min(1, Math.max(0, localX / Math.max(1, box.width)));
          const vertical = Math.min(1, Math.max(0, localY / Math.max(1, box.height)));
          targetX = (0.5 - vertical) * 5; targetY = (horizontal - 0.5) * 5; targetLift = -4;
          card.classList.add('spotlight-active');
          if (tilts) card.classList.add('tilt-tracking');
          scheduleCard();
        }
        function leave() {
          inside = false; targetX = targetY = targetLift = 0;
          card.classList.remove('spotlight-active');
          scheduleCard();
        }
        function reset() {
          cancelAnimationFrame(cardFrame); cardFrame = 0; inside = false; box = null;
          angleX = angleY = targetX = targetY = lift = targetLift = 0;
          ['--card-x', '--card-y', '--card-lift', '--tilt-x', '--tilt-y'].forEach(name => card.style.removeProperty(name));
          card.classList.remove('tilt-tracking', 'spotlight-active');
        }
        listen(card, 'pointerenter', event => { if (event.pointerType === 'mouse') { measure(); move(event); } });
        listen(card, 'pointermove', move);
        listen(card, 'pointerleave', leave);
        listen(card, 'pointercancel', leave);
        resets.push(reset);
        resizes.push(() => { if (inside) measure(); else box = null; });
      });
      listen(window, 'resize', () => { resizes.forEach(resize => resize()); if (visible) { refreshHit = true; schedule(); } });
      dispose = () => {
        events.abort(); hide();
        [dot, ring, glow].forEach(element => element.remove());
      };
      // Restore the native cursor if an unrelated script error interrupts the page.
      listen(window, 'error', () => { if (dispose) { dispose(); dispose = null; } });
      listen(window, 'unhandledrejection', () => { if (dispose) { dispose(); dispose = null; } });
    }
    watch(pointer, enable);
    watch(motion, enable);
    enable();
  }

  // Fail independently: a broken optional enhancement cannot disable navigation.
  [setupTheme, setupMenu, setupScroll, setupPointerEffects, setupReveals].forEach(setup => {
    try { setup(); } catch (error) { console.warn(`Portfolio: ${setup.name} unavailable`, error); }
  });
})();
