/* Independent progressive enhancements: optional markup never stops later features. */
(() => {
  // Learning status belongs to Isfak; saved quest progress belongs to the visitor.
  const QUEST_LEVELS = [
    {
      id: 'programming-foundations', title: 'Programming Foundations',
      learningStatus: 'In progress',
      blurb: 'Java and Python are helping me build my foundations in programming, problem solving and writing understandable code.',
      tags: ['Java', 'Python', 'Problem solving'], projectUrl: null
    },
    {
      id: 'software-development', title: 'Software Development',
      learningStatus: 'Project experience',
      blurb: 'Through projects such as TimeAlert and DarkScan, I am learning how APIs, databases, testing and security fit together in working applications.',
      tags: ['APIs', 'Databases', 'Testing'],
      projectName: 'TimeAlert',
      projectUrl: 'https://github.com/MIM-Isfak/timealert_app'
    },
    {
      id: 'python-data', title: 'Python & Data',
      learningStatus: 'In progress',
      blurb: 'I am strengthening my Python scripting and data-handling skills as a foundation for automation and machine-learning workflows.',
      tags: ['Python', 'Data', 'Automation'], projectUrl: null
    },
    {
      id: 'machine-learning', title: 'Machine Learning',
      learningStatus: 'In progress',
      blurb: 'I am learning how data, training, evaluation and inference connect. As Product Owner for our Smart Classroom Edge AI team project, I contributed to requirements, system architecture and the final demonstration.',
      tags: ['ML fundamentals', 'Evaluation', 'Inference'],
      projectName: 'Smart Classroom Edge AI System', isTeamProject: true,
      projectUrl: 'https://github.com/MIM-Isfak/Smart_Classroom_Edge_AI_System'
    },
    {
      id: 'devops-foundations', title: 'DevOps Foundations',
      learningStatus: 'In progress',
      blurb: 'I am learning Linux, Docker and CI/CD to understand how software is packaged, tested and delivered reliably.',
      tags: ['Linux', 'Docker', 'CI/CD'], projectUrl: null
    },
    {
      id: 'cloud-deployment', title: 'Cloud & Deployment — Boss Level',
      learningStatus: 'In progress',
      blurb: 'This portfolio is my AWS deployment challenge and one step towards my goal of becoming an MLOps or DevOps Engineer.',
      tags: ['AWS Amplify', 'Deployment', 'Reliability'], projectUrl: null
    }
  ];
  const QUEST_STORAGE_KEY = 'isfak-portfolio:learning-quest:v2';
  const QUEST_PREVIOUS_STORAGE_KEY = 'isfak-portfolio:learning-quest:v1';

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

  function setupQuest() {
    const quest = document.getElementById('creative-feature');
    if (!quest) return;
    const ui = Object.fromEntries(Object.entries({
      start: 'quest-start', board: 'quest-board', path: 'quest-path',
      progress: 'quest-progress', meter: 'quest-meter',
      number: 'quest-detail-number', title: 'quest-detail-title',
      learningStatus: 'quest-learning-status', blurb: 'quest-blurb', tags: 'quest-tags',
      project: 'quest-project', projectLabel: 'quest-project-label', advance: 'quest-continue',
      complete: 'quest-complete', completeTitle: 'quest-complete-title', reset: 'quest-reset',
      announcement: 'quest-announcement'
    }).map(([name, id]) => [name, quest.querySelector(`#${id}`)]));
    if (Object.values(ui).some(element => !element)) return;

    const total = QUEST_LEVELS.length;
    let progress = { reached: 0, finished: false };
    // Only a highest reached level and a finish flag are stored. Selection is transient.
    try {
      if (localStorage.getItem(QUEST_PREVIOUS_STORAGE_KEY) !== null) {
        localStorage.removeItem(QUEST_PREVIOUS_STORAGE_KEY);
      }
      const raw = localStorage.getItem(QUEST_STORAGE_KEY);
      if (raw !== null) {
        const saved = JSON.parse(raw);
        if (!saved || Array.isArray(saved) || !Number.isInteger(saved.reached) ||
            saved.reached < 0 || saved.reached > total || typeof saved.finished !== 'boolean' ||
            (saved.finished && saved.reached !== total)) throw new Error('Invalid quest progress');
        progress = { reached: saved.reached, finished: saved.finished };
      }
    } catch (_) {
      try { localStorage.removeItem(QUEST_STORAGE_KEY); } catch (_) {}
    }
    let started = false;
    let selected = Math.max(0, progress.reached - 1);
    const progressText = () => `${progress.reached} / ${total} levels explored`;
    function saveProgress() {
      try { localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(progress)); } catch (_) {}
    }

    const nodes = QUEST_LEVELS.map((level, index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quest-node';
      button.id = `quest-level-${level.id}`;
      button.setAttribute('aria-controls', 'quest-details');
      const number = document.createElement('span');
      number.className = 'quest-node-number';
      number.textContent = index + 1;
      number.setAttribute('aria-hidden', 'true');
      const copy = document.createElement('span');
      const title = document.createElement('span');
      title.className = 'quest-node-title';
      title.textContent = level.title;
      const state = document.createElement('span');
      state.className = 'quest-node-state';
      copy.append(title, state);
      button.append(number, copy);
      item.append(button);
      ui.path.append(item);
      button.addEventListener('click', () => {
        if (!started) return;
        if (index >= progress.reached) {
          ui.announcement.textContent = 'Complete the previous level to unlock.';
          return;
        }
        selected = index;
        render();
        ui.title.focus();
      });
      return { button, state };
    });

    function render() {
      ui.board.hidden = !started;
      ui.start.textContent = progress.reached ? 'Resume quest' : 'Start quest';
      ui.progress.textContent = progressText();
      ui.meter.max = total;
      ui.meter.value = progress.reached;
      ui.meter.textContent = `${progress.reached} / ${total}`;
      nodes.forEach(({ button, state }, index) => {
        const locked = index >= Math.max(1, progress.reached);
        const current = started && index === selected;
        button.setAttribute('aria-disabled', String(locked));
        if (current) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
        const label = `Level ${index + 1}: ${QUEST_LEVELS[index].title}.`;
        button.setAttribute('aria-label', locked ? `${label} Complete the previous level to unlock.` :
          `${label}${current ? ' Selected.' : ''}`);
        state.textContent = locked ? 'Locked' : current ? 'Selected · explored' :
          index < progress.reached ? 'Explored · revisit' : 'Ready to explore';
      });
      const level = QUEST_LEVELS[selected];
      ui.number.textContent = `Level ${selected + 1} of ${total}`;
      ui.title.textContent = level.title;
      ui.learningStatus.textContent = level.learningStatus;
      ui.blurb.textContent = level.blurb;
      ui.tags.replaceChildren(...level.tags.map(tag => {
        const item = document.createElement('li');
        item.textContent = tag;
        return item;
      }));
      ui.project.hidden = !level.projectUrl;
      if (level.projectUrl) {
        ui.project.href = level.projectUrl;
        const label = level.isTeamProject ? 'View team project' : 'View project';
        ui.projectLabel.textContent = label;
        ui.project.setAttribute('aria-label', `${label}: ${level.projectName || level.title} (opens in a new tab)`);
      } else {
        ui.project.removeAttribute('href');
        ui.project.removeAttribute('aria-label');
        ui.projectLabel.textContent = '';
      }
      ui.advance.textContent = selected === total - 1 ? 'Finish quest' : 'Continue to next level';
      ui.advance.hidden = progress.finished && selected === total - 1;
      ui.complete.hidden = !started || !progress.finished;
    }

    ui.start.addEventListener('click', () => {
      const fresh = progress.reached === 0;
      if (fresh) { progress.reached = 1; saveProgress(); }
      started = true;
      selected = progress.reached - 1;
      render();
      (progress.finished ? ui.completeTitle : ui.title).focus();
      ui.announcement.textContent = `${fresh ? 'Quest started.' : 'Quest resumed.'} ${progressText()}.`;
    });
    ui.advance.addEventListener('click', () => {
      if (!started || (progress.finished && selected === total - 1)) return;
      if (selected < total - 1) {
        selected += 1;
        const advanced = selected + 1 > progress.reached;
        if (advanced) { progress.reached = selected + 1; saveProgress(); }
        render();
        ui.title.focus();
        if (advanced) ui.announcement.textContent = progressText();
      } else {
        progress.finished = true;
        saveProgress();
        render();
        ui.completeTitle.focus();
        ui.announcement.textContent = `Quest finished. ${progressText()}.`;
      }
    });
    ui.reset.addEventListener('click', () => {
      progress = { reached: 0, finished: false };
      selected = 0;
      started = false;
      try { localStorage.removeItem(QUEST_STORAGE_KEY); } catch (_) {}
      render();
      ui.start.focus();
      ui.announcement.textContent = `Quest reset. ${progressText()}.`;
    });
    const hint = document.querySelector('.lab-hint[href="#creative-feature"]');
    hint?.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      // Let the normal fragment navigation run first, retaining its reduced-motion behavior.
      requestAnimationFrame(() => ui.start.focus({ preventScroll: true }));
    });
    render(); // Restore quietly: no focus change, announcement, or entrance animation.
    ui.start.hidden = false;
  }

  function setupHero() {
    const art = document.querySelector('.hero-orbit');
    const cv = art?.querySelector('.hero-orbit-canvas');
    const terminal = art?.querySelector('.hero-terminal');
    const word = art?.querySelector('.hero-terminal-word');
    const cursor = art?.querySelector('.hero-terminal-cursor');
    const ctx = cv?.getContext('2d');
    if (!art || !ctx || !terminal || !word || !cursor || art.dataset.heroReady) return;
    art.dataset.heroReady = 'true';

    let W = 0, H = 0, M = 0, R = 0, badgeUnit = 1;
    let colors, LIME, LINE;
    let frame = null, elapsed = 0, startedAt = 0, running = false, visible = false;
    let timer = null, due = 0, remaining = 1800, typingStarted = false;
    let length = 1, phase = 'initial';
    let exclusion = null;
    const previousCenters = new Map(), maxBadgeSizes = new Map();
    let placementTime = null;
    const name = 'Isfak';

    /* a = plane tilt, b = roll, w = orbit spin speed (atom precession), p = start phase, s = node speed */
    const O=[
      {a:1.10,b:0.15,w:0.22,p:-1.57,s:0.55,label:'CODE',icon:'code'},
      {a:1.15,b:-0.55,w:-0.17,p:3.14,s:-0.42,label:'CLOUD',icon:'cloud'},
      {a:1.00,b:0.95,w:0.13,p:1.57,s:0.36,label:'ML',icon:'ml'}
    ];
    function pt(o,phi,t){
      const x=Math.cos(phi),y=Math.sin(phi);
      const y1=y*Math.cos(o.a),z1=y*Math.sin(o.a);
      const x2=x*Math.cos(o.b)-y1*Math.sin(o.b),y2=x*Math.sin(o.b)+y1*Math.cos(o.b);
      const th=o.w*t;
      return [x2*Math.cos(th)+z1*Math.sin(th),y2,-x2*Math.sin(th)+z1*Math.cos(th)];
    }
    function icon(kind,ix,iy,s){
      ctx.strokeStyle=LIME;ctx.lineWidth=1.4*s;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
      if(kind==='code'){
        ctx.moveTo(ix+5*s,iy-5*s);ctx.lineTo(ix,iy);ctx.lineTo(ix+5*s,iy+5*s);
        ctx.moveTo(ix+11*s,iy-5*s);ctx.lineTo(ix+16*s,iy);ctx.lineTo(ix+11*s,iy+5*s);
        ctx.moveTo(ix+9.5*s,iy-6*s);ctx.lineTo(ix+6.5*s,iy+6*s);
      }else if(kind==='cloud'){
        ctx.moveTo(ix+4*s,iy+5*s);ctx.arc(ix+4*s,iy+1.5*s,3.5*s,Math.PI/2,Math.PI*1.5);
        ctx.arc(ix+8*s,iy-1.5*s,4.5*s,Math.PI*1.1,Math.PI*1.95);
        ctx.arc(ix+12*s,iy+1.5*s,3.5*s,Math.PI*1.5,Math.PI/2);ctx.closePath();
      }else{
        ctx.rect(ix+5.75*s,iy-7*s,4.5*s,4.5*s);ctx.rect(ix,iy+3*s,4.5*s,4.5*s);ctx.rect(ix+11.5*s,iy+3*s,4.5*s,4.5*s);
        ctx.moveTo(ix+8*s,iy-2.5*s);ctx.lineTo(ix+8*s,iy);
        ctx.moveTo(ix+2.25*s,iy+3*s);ctx.lineTo(ix+2.25*s,iy);ctx.lineTo(ix+13.75*s,iy);ctx.lineTo(ix+13.75*s,iy+3*s);
      }
      ctx.stroke();
    }
    // Measure the same depth-scaled bounds used when painting each badge.
    function badgeSize(o, z) {
      const scale = badgeUnit * (1 + 0.12 * z);
      ctx.font = `700 ${12 * scale}px "Courier New",monospace`;
      const width = 37 * scale + ctx.measureText(o.label).width, height = 30 * scale;
      // Reserve the frontmost size so depth changes cannot squeeze adjacent labels.
      const maximum = maxBadgeSizes.get(o.label);
      return { scale, width, height, layoutWidth: maximum.width, layoutHeight: maximum.height };
    }
    function intersects(a, b) {
      return a.x < b.x + b.width && a.x + a.width > b.x &&
        a.y < b.y + b.height && a.y + a.height > b.y;
    }
    // Move through free space around the padded name and other label slots.
    function routeStep(start, goal, obstacles, width, height, distance) {
      const halfW = width / 2 + 1, halfH = height / 2 + 1;
      const bounds = { left: halfW + 1, top: halfH + 1, right: W - halfW - 1, bottom: H - halfH - 1 };
      const blocked = obstacles.map((box, i) => {
        const pad = i ? 1 : 0;
        return { left: box.x - halfW - pad, right: box.x + box.width + halfW + pad,
          top: box.y - halfH - pad, bottom: box.y + box.height + halfH + pad };
      });
      const inside = p => p.x < bounds.left || p.x > bounds.right || p.y < bounds.top || p.y > bounds.bottom ||
        blocked.some(b => p.x > b.left && p.x < b.right && p.y > b.top && p.y < b.bottom);
      function clear(a, b) {
        return blocked.every(box => {
          let lo = 0, hi = 1;
          for (const [origin, delta, min, max] of [[a.x, b.x - a.x, box.left + 0.001, box.right - 0.001],
            [a.y, b.y - a.y, box.top + 0.001, box.bottom - 0.001]]) {
            if (Math.abs(delta) < 0.00001) { if (origin <= min || origin >= max) return true; continue; }
            const t1 = (min - origin) / delta, t2 = (max - origin) / delta;
            lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2));
            if (lo >= hi) return true;
          }
          return false;
        });
      }
      if (inside(start) || inside(goal)) return null;
      if (clear(start, goal)) {
        const length = Math.hypot(goal.x - start.x, goal.y - start.y), part = length ? Math.min(1, distance / length) : 0;
        return { x: start.x + (goal.x - start.x) * part, y: start.y + (goal.y - start.y) * part };
      }
      const points = [start, goal];
      for (const b of blocked) for (const x of [b.left - 0.1, b.right + 0.1]) for (const y of [b.top - 0.1, b.bottom + 0.1]) {
        const point = { x, y };
        if (!inside(point)) points.push(point);
      }
      const costs = points.map(() => Infinity), previous = points.map(() => -1), visited = points.map(() => false);
      costs[0] = 0;
      for (let i = 0; i < points.length; i++) {
        let current = -1;
        for (let j = 0; j < points.length; j++) if (!visited[j] && (current < 0 || costs[j] < costs[current])) current = j;
        if (current < 0 || !Number.isFinite(costs[current]) || current === 1) break;
        visited[current] = true;
        for (let j = 1; j < points.length; j++) {
          if (visited[j] || !clear(points[current], points[j])) continue;
          const next = costs[current] + Math.hypot(points[j].x - points[current].x, points[j].y - points[current].y);
          if (next < costs[j]) { costs[j] = next; previous[j] = current; }
        }
      }
      if (!Number.isFinite(costs[1])) return null;
      let next = 1;
      while (previous[next] > 0) next = previous[next];
      const point = points[next], length = Math.hypot(point.x - start.x, point.y - start.y);
      const part = length ? Math.min(1, distance / length) : 0;
      return { x: start.x + (point.x - start.x) * part, y: start.y + (point.y - start.y) * part };
    }
    function placeBadges(nodes, time) {
      const margin = 2, gap = 5;
      const step = placementTime === null ? Infinity : Math.min(30, Math.max(0, time - placementTime) * 160);
      function candidates(node, placed, locked) {
        const width = node.size.layoutWidth, height = node.size.layoutHeight;
        const originX = node.x - width / 2, originY = node.y - height / 2;
        const previous = previousCenters.get(node.o.label);
        const obstacles = [exclusion, ...placed, ...locked];
        const xs = [originX, margin, W - width - margin];
        const ys = [originY, margin, H - height - margin];
        if (previous) { xs.push(previous.x - width / 2); ys.push(previous.y - height / 2); }
        for (const box of obstacles) {
          xs.push(box.x - width - gap, box.x + box.width + gap);
          ys.push(box.y - height - gap, box.y + box.height + gap);
        }
        const choices = [], seen = new Set();
        for (const x of xs) for (const y of ys) {
          const box = { x, y, width, height };
          const ink = { x: x - 1, y: y - 1, width: width + 2, height: height + 2 };
          if (x < margin || y < margin || x + width > W - margin || y + height > H - margin ||
              obstacles.some((obstacle, i) => intersects(ink, i === 0 ? obstacle :
                { x: obstacle.x - 1, y: obstacle.y - 1, width: obstacle.width + 2, height: obstacle.height + 2 }))) continue;
          const key = `${x.toFixed(3)},${y.toFixed(3)}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const dx = x - originX, dy = y - originY;
          const change = previous ? Math.hypot(x + width / 2 - previous.x, y + height / 2 - previous.y) : 0;
          choices.push({ ...box, score: Math.hypot(dx, dy) + change * 0.15 });
        }
        choices.sort((a, b) => a.score - b.score || a.x - b.x || a.y - b.y);
        if (!previous) return choices;
        for (const choice of choices) {
          const goal = { x: choice.x + width / 2, y: choice.y + height / 2 };
          const point = routeStep(previous, goal, obstacles, width, height, step);
          if (point) return [{ x: point.x - width / 2, y: point.y - height / 2, width, height }];
        }
        return [];
      }
      function search(index, placed) {
        if (index === nodes.length) return placed;
        // Reserve other labels' previous locations so they can move without jumping.
        const locked = nodes.slice(index + 1).flatMap(node => {
          const old = previousCenters.get(node.o.label);
          return old ? [{ x: old.x - node.size.layoutWidth / 2, y: old.y - node.size.layoutHeight / 2,
            width: node.size.layoutWidth, height: node.size.layoutHeight }] : [];
        });
        for (const choice of candidates(nodes[index], placed, locked)) {
          const result = search(index + 1, [...placed, choice]);
          if (result) return result;
        }
        return null;
      }
      const placed = search(0, []);
      placementTime = time;
      // At impossibly small sizes, keep labels visible even if no collision-free packing exists.
      if (!placed) return nodes.map(node => {
        const x = Math.max(margin, Math.min(W - node.size.width - margin, node.x - node.size.width / 2));
        const y = Math.max(margin, Math.min(H - node.size.height - margin, node.y - node.size.height / 2));
        return { ...node, box: { x, y, width: node.size.width, height: node.size.height,
          dx: x - node.x + node.size.width / 2, dy: y - node.y + node.size.height / 2 } };
      });
      return nodes.map((node, index) => {
        const slot = placed[index], x = slot.x + (slot.width - node.size.width) / 2;
        const y = slot.y + (slot.height - node.size.height) / 2;
        previousCenters.set(node.o.label, { x: slot.x + slot.width / 2, y: slot.y + slot.height / 2 });
        return { ...node, box: { x, y, width: node.size.width, height: node.size.height,
          dx: x - node.x + node.size.width / 2, dy: y - node.y + node.size.height / 2 } };
      });
    }
    function pill(node) {
      const { o, p, size, box } = node;
      const s = size.scale, x = box.x, y = box.y, py = y + size.height / 2;
      ctx.globalAlpha = 0.78 + 0.22 * p[2];
      ctx.font = `700 ${12 * s}px "Courier New",monospace`;
      ctx.beginPath(); ctx.roundRect(x, y, size.width, size.height, 7 * s);
      ctx.fillStyle = colors.surface; ctx.fill(); ctx.strokeStyle = colors.border; ctx.lineWidth = 1.2 * s; ctx.stroke();
      icon(o.icon, x + 8 * s, py, s);
      ctx.fillStyle = LIME; ctx.textBaseline = 'middle'; ctx.fillText(o.label, x + 29 * s, py + 0.5 * s);
      ctx.globalAlpha = 1;
    }

    function activeTime(now = performance.now()) {
      return (elapsed + (running ? now - startedAt : 0)) / 1000;
    }
    function drawHero(t) {
      if (!W || !H) return;
      const cx = W / 2, cy = H / 2;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.55;
      for (const o of O) {
        ctx.beginPath();
        for (let i = 0; i <= 160; i++) {
          const p = pt(o, i / 160 * Math.PI * 2, t);
          i ? ctx.lineTo(cx + p[0] * R, cy + p[1] * R) : ctx.moveTo(cx + p[0] * R, cy + p[1] * R);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // Calculate each physical position from the same approved projection.
      const nodes = O.map(o => {
        const p = pt(o, o.p + o.s * t, t);
        return { o, p, x: cx + p[0] * R, y: cy + p[1] * R, size: badgeSize(o, p[2]) };
      });
      // Place the compact ML badge first so it can use the narrower side corridors.
      nodes.sort((a, b) => ['ML', 'CLOUD', 'CODE'].indexOf(a.o.label) - ['ML', 'CLOUD', 'CODE'].indexOf(b.o.label));
      const labels = placeBadges(nodes, t);
      for (const node of labels) {
        const { x, y, box } = node;
        const edgeX = Math.max(box.x, Math.min(x, box.x + box.width));
        const edgeY = Math.max(box.y, Math.min(y, box.y + box.height));
        if (Math.hypot(box.dx, box.dy) > 0.1 && Math.hypot(edgeX - x, edgeY - y) > 0.1) {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(edgeX, edgeY);
          ctx.strokeStyle = LINE; ctx.globalAlpha = 0.4; ctx.lineWidth = 0.8; ctx.stroke();
        }
        // A node remains at the true projected position, beneath its label when aligned.
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = LIME; ctx.globalAlpha = 0.8; ctx.fill();
      }
      ctx.globalAlpha = 1;
      labels.sort((a, b) => a.p[2] - b.p[2]).forEach(pill);
    }
    function refreshColors() {
      const style = getComputedStyle(art);
      const color = name => style.getPropertyValue(name).trim();
      colors = { surface: color('--elevated-surface'), border: color('--border') };
      LIME = color('--accent');
      LINE = color('--muted');
      drawHero(motion.matches ? 0 : activeTime());
    }
    function resizeHero() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      M = Math.min(W, H);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      terminal.style.fontSize = `${M * 0.075}px`;
      const textRect = terminal.getBoundingClientRect(), canvasRect = cv.getBoundingClientRect();
      // The terminal always reserves all six characters, even while typing.
      exclusion = { x: textRect.left - canvasRect.left - 12, y: textRect.top - canvasRect.top - 12,
        width: textRect.width + 24, height: textRect.height + 24 };
      previousCenters.clear();
      placementTime = null;
      // Keep the reference's depth scale, with a legible base size in this smaller slot.
      badgeUnit = Math.max(M / 500, 1);
      const maxScale = badgeUnit * 1.12;
      ctx.font = `700 ${12 * maxScale}px "Courier New",monospace`;
      const maxWidth = Math.max(...O.map(o => {
        const textWidth = ctx.measureText(o.label).width;
        maxBadgeSizes.set(o.label, { width: textWidth + 37 * maxScale, height: 30 * maxScale });
        // Retain the original orbit radius and its generous edge clearance.
        return textWidth + 48 * maxScale;
      }));
      // Reserve the full frontmost badge, including its stroke, at every orbit extreme.
      R = Math.max(0, Math.min(M * 0.43, W / 2 - maxWidth / 2 - 3, H / 2 - 17 * maxScale - 3));
      drawHero(motion.matches ? 0 : activeTime());
    }
    function animateHero(now) {
      frame = null;
      if (!running) return;
      drawHero(activeTime(now));
      frame = requestAnimationFrame(animateHero);
    }
    function renderName() {
      const text = motion.matches ? name : name.slice(0, length);
      if (word.textContent !== text) word.textContent = text;
      cursor.style.setProperty('--typed-length', text.length);
      cursor.classList.toggle('is-blinking', running && ['initial', 'holding', 'empty'].includes(phase));
    }
    function scheduleTyping() {
      if (!running || timer !== null) return;
      due = performance.now() + remaining;
      timer = setTimeout(advanceTyping, remaining);
    }
    function pauseTyping() {
      if (timer === null) return;
      remaining = Math.max(0, due - performance.now());
      clearTimeout(timer);
      timer = null;
    }
    function advanceTyping() {
      timer = null;
      if (!running) return;
      if (phase === 'initial') {
        length = 2; phase = 'typing'; remaining = 150;
      } else if (phase === 'typing') {
        if (length < name.length) { length += 1; remaining = 150; }
        else { phase = 'holding'; remaining = 2000; }
      } else if (phase === 'holding') {
        length -= 1; phase = 'deleting'; remaining = 80;
      } else if (phase === 'deleting') {
        if (length > 0) { length -= 1; remaining = 80; }
        else { phase = 'empty'; remaining = 700; }
      } else {
        length = 1; phase = 'typing'; remaining = 150;
      }
      renderName();
      scheduleTyping();
    }
    function syncMotion() {
      const active = visible && !document.hidden && !motion.matches;
      if (running && !active) {
        elapsed += performance.now() - startedAt;
        running = false;
        cancelAnimationFrame(frame);
        frame = null;
        pauseTyping();
      } else if (!running && active) {
        running = true;
        startedAt = performance.now();
        if (!typingStarted) {
          typingStarted = true; length = 1; phase = 'initial'; remaining = 1800;
        }
        frame = requestAnimationFrame(animateHero);
      }
      if (motion.matches) typingStarted = false;
      if (typingStarted || motion.matches) renderName();
      scheduleTyping();
      if (!running) drawHero(motion.matches ? 0 : activeTime());
    }
    refreshColors();
    const resizeObserver = new ResizeObserver(resizeHero);
    resizeObserver.observe(art);
    const themeObserver = new MutationObserver(refreshColors);
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('visibilitychange', syncMotion);
    watch(motion, syncMotion);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting);
        syncMotion();
      });
      observer.observe(art);
    } else visible = true;
    resizeHero();
    syncMotion();
  }

  function setupReveals() {
    if (motion.matches || !('IntersectionObserver' in window)) return;
    // Reveal section introductions separately so tall sections never hide their cards.
    const elements = [...document.querySelectorAll('.section-heading, .about-copy, .skill-card, .project-card')];
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
  [setupTheme, setupMenu, setupQuest, setupScroll, setupHero, setupPointerEffects, setupReveals].forEach(setup => {
    try { setup(); } catch (error) { console.warn(`Portfolio: ${setup.name} unavailable`, error); }
  });
})();
