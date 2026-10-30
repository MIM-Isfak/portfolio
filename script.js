/* Independent progressive enhancements: optional markup never stops later features. */
(() => {
  // The demos are local illustrations; project content lives here for easy editing.
  const LAB_PROJECTS = {
    kapru: {
      title: 'Kapru',
      scenario: 'A friend’s birthday is coming up. Explore how a shopping conversation could help you find a gift.',
      action: 'Send sample request',
      note: 'My prototype explores multilingual shopping with Gemini and MCP.',
      repository: 'https://github.com/MIM-Isfak/kapru-project',
      resultTitle: 'Gift ideas revealed.',
      result: 'A conversation turns a broad request into sample categories to explore.'
    },
    classroom: {
      title: 'Smart Classroom',
      scenario: 'Only two students have arrived. See how a fuller classroom could change a simulated AC response.',
      action: 'Let more students enter',
      note: 'University team project. My role: Product Owner, covering requirements, system architecture and the final demonstration.',
      repository: 'https://github.com/MIM-Isfak/Smart_Classroom_Edge_AI_System',
      resultTitle: 'Classroom response updated.',
      result: 'Higher simulated occupancy changed the simulated AC response.'
    },
    timealert: {
      title: 'TimeAlert',
      scenario: 'Tomorrow’s Database Systems class has moved. See how a timetable update could keep students informed.',
      action: 'Apply sample update',
      note: 'My timetable app is in development, with batch workflows, acknowledgements and Web Push integration.',
      repository: 'https://github.com/MIM-Isfak/timealert_app',
      resultTitle: 'Timetable updated.',
      result: 'The new time and room are visible together with an update notice.'
    },
    darkscan: {
      title: 'DarkScan',
      scenario: 'You are about to share a snippet. See how a pattern check could flag something to review first.',
      action: 'Reveal sample finding',
      note: 'Pattern checks can flag risky content; a clean scan is not a security guarantee.',
      repository: 'https://github.com/MIM-Isfak/DarkScan_app',
      resultTitle: 'Sample warning revealed.',
      result: 'The example line needs review; a warning is not proof of an exploitable issue.'
    }
  };
  const LAB_ORDER = ['kapru', 'classroom', 'timealert', 'darkscan'];

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

  function setupBuilderLab() {
    const lab = document.getElementById('creative-feature');
    if (!lab) return;
    const get = id => lab.querySelector(`#lab-${id}`);
    const ui = {
      startOptions: get('start-options'), start: get('start'), silent: get('silent'),
      audio: get('audio'), sound: get('sound'), voice: get('voice'),
      successParticles: get('success-particles'),
      soundStatus: get('sound-status'), voiceStatus: get('voice-status'),
      progress: get('progress'), meter: get('meter'), details: get('details'),
      title: get('detail-title'), scenario: get('scenario'), visual: get('visual'),
      action: get('demo-action'), demoState: get('demo-state'), replay: get('replay'),
      response: get('response'), feedback: get('feedback'), successTitle: get('success-title'),
      successCopy: get('success-copy'), nextHint: get('next-hint'),
      note: get('note'), repository: get('repository'), complete: get('complete'),
      storyTitle: get('story-title'), storyMessage: get('story-message'), particles: get('particles'), reset: get('reset'),
      announcement: get('announcement')
    };
    if (Object.values(ui).some(element => !element)) return;
    const buttons = [...lab.querySelectorAll('[data-project]')];
    const state = {
      started: false, selectedProject: 'kapru', exploredIds: new Set(),
      demoPhase: 'before', soundEnabled: false, voiceEnabled: false, celebrationShown: false,
      storySelected: false
    };
    let audioContext = null, masterGain = null, audioGeneration = 0, speechGeneration = 0, demoGeneration = 0;
    // One pending narration belongs to the current audio sequence; never a speech queue.
    const audioOwner = { narrationTimer: null, cueEndsAt: 0 };
    let preferredVoice = null, restoreActionFocus = false, finalSequenceActive = false;
    const timers = new Set(), oscillators = new Map();
    const synthesis = window.speechSynthesis;
    const canSpeak = Boolean(synthesis && window.SpeechSynthesisUtterance);
    const active = () => {
      const rect = lab.getBoundingClientRect();
      return state.started && !document.hidden && rect.bottom > 0 && rect.top < innerHeight;
    };
    const nextProject = () => LAB_ORDER.find(id => !state.exploredIds.has(id));
    const nextHint = () => {
      const next = nextProject();
      return next ? `Choose Next to explore ${LAB_PROJECTS[next].title}.` :
        'All four projects explored. Choose See my builder story.';
    };
    const resultExplanation = () => {
      const project = LAB_PROJECTS[state.selectedProject];
      return `${project.resultTitle} ${project.result} ${nextHint()}`;
    };
    function announce(message) { ui.announcement.textContent = message; }
    const closingExplanation = () => `${ui.storyTitle.textContent} ${ui.storyMessage.textContent}`;
    function syncAudio() {
      ui.sound.textContent = `Sound: ${state.soundEnabled ? 'on' : 'off'}`;
      ui.sound.setAttribute('aria-pressed', String(state.soundEnabled));
      ui.voice.textContent = `Voice: ${state.voiceEnabled ? 'on' : 'off'}`;
      ui.voice.setAttribute('aria-pressed', String(state.voiceEnabled));
    }
    function idleVoiceStatus() {
      ui.voiceStatus.textContent = state.voiceEnabled ? 'Voice on.' : 'Voice off.';
    }
    function cancelSpeech() {
      speechGeneration += 1;
      clearTimeout(audioOwner.narrationTimer);
      audioOwner.narrationTimer = null;
      if (canSpeak) synthesis.cancel();
      idleVoiceStatus();
    }
    function stopEffects(suspend = false) {
      const generation = ++audioGeneration;
      audioOwner.cueEndsAt = 0;
      const running = audioContext?.state === 'running';
      const now = audioContext?.currentTime || 0;
      const suspendWhenQuiet = () => {
        if (suspend && generation === audioGeneration && !oscillators.size && audioContext?.state === 'running') {
          audioContext.suspend().catch(() => {});
        }
      };
      oscillators.forEach(({ gain, peak }, oscillator) => {
        const release = () => {
          oscillators.delete(oscillator);
          oscillator.disconnect();
          gain.disconnect();
          suspendWhenQuiet();
        };
        oscillator.onended = release;
        if (running) {
          // A 12ms release also softens cancellation mid-note; no cleanup timer.
          if (gain.gain.cancelAndHoldAtTime) gain.gain.cancelAndHoldAtTime(now);
          else {
            gain.gain.cancelScheduledValues(now);
            // Never boost a quiet/releasing layer to AudioParam's default value.
            gain.gain.setValueAtTime(Math.min(peak, Math.max(0, gain.gain.value)), now);
          }
          gain.gain.linearRampToValueAtTime(0, now + 0.012);
          oscillator.stop(now + 0.012);
        } else {
          try { oscillator.stop(); } catch (_) {}
          release();
        }
      });
      suspendWhenQuiet();
      if (!suspend && state.soundEnabled && audioContext?.state === 'running') ui.soundStatus.textContent = 'Sound on.';
    }
    // Only the sound-enabled start and Sound-on toggle create/resume this context.
    function cancelAudio(suspend = false) {
      stopEffects(suspend);
      cancelSpeech();
    }
    function enableSound(narrateAfterResume = false) {
      const generation = ++audioGeneration;
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('Web Audio unavailable');
        if (!audioContext) {
          audioContext = new Audio();
          masterGain = audioContext.createGain();
          masterGain.gain.value = 0.1;
          masterGain.connect(audioContext.destination);
        }
        state.soundEnabled = true;
        const resumed = audioContext.resume();
        ui.soundStatus.textContent = 'Starting sound…';
        Promise.resolve(resumed).then(() => {
          if (generation !== audioGeneration || !active() || !state.soundEnabled) return;
          ui.soundStatus.textContent = audioContext.state === 'running' ? 'Sound on.' :
            'Sound paused by the browser. Toggle Sound to retry.';
          cue('select');
          if (narrateAfterResume) explain();
        }).catch(() => {
          if (generation !== audioGeneration) return;
          state.soundEnabled = false;
          syncAudio();
          ui.soundStatus.textContent = 'Sound unavailable. Silent demos are fully available.';
          if (narrateAfterResume) explain();
        });
      } catch (_) {
        state.soundEnabled = false;
        ui.soundStatus.textContent = 'Sound unavailable. Silent demos are fully available.';
        if (narrateAfterResume) explain();
      }
      syncAudio();
    }
    function cue(kind) {
      if (!active() || !state.soundEnabled) return 0;
      if (audioContext?.state !== 'running') {
        ui.soundStatus.textContent = 'Sound paused by the browser. Toggle Sound to retry.';
        return 0;
      }
      cancelAudio();
      const frequencies = kind === 'final' ? [261.63, 329.63, 392, 523.25] :
        kind === 'success' ? [523.25, 659.25, 783.99] : [330];
      const stagger = kind === 'final' ? 0.12 : 0.105;
      const notes = frequencies.map((frequency, index) => ({
        frequency, offset: index * stagger,
        duration: kind === 'final' ? 0.55 : kind === 'success' ? 0.38 : 0.055,
        strength: kind === 'final' ? (index === 0 ? 0.35 : 0.65) : 1,
        attack: kind === 'final' ? 0.04 : 0.015
      }));
      if (kind === 'final') {
        // A soft lead-in and ascending notes resolve into a quiet C-major chord.
        notes.push(...frequencies.map(frequency => ({
          frequency, offset: 0.62, duration: 0.86, strength: 0.5, attack: 0.06
        })));
      }
      const length = Math.max(...notes.map(note => note.offset + note.duration));
      try {
        masterGain.gain.setValueAtTime(0.1, audioContext.currentTime);
        notes.forEach(({ frequency, offset, duration, strength, attack }) => {
          const start = audioContext.currentTime + offset;
          ['triangle', 'sine'].forEach((type, layer) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            const peak = (kind === 'select' ? 0.12 : 0.26) * strength * (layer ? 0.25 : 1);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(peak, start + attack);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration - 0.012);
            gain.gain.linearRampToValueAtTime(0, start + duration);
            oscillator.connect(gain);
            gain.connect(masterGain);
            oscillators.set(oscillator, { gain, peak });
            oscillator.onended = () => {
              oscillators.delete(oscillator);
              oscillator.disconnect();
              gain.disconnect();
            };
            oscillator.start(start);
            oscillator.stop(start + duration);
          });
        });
        audioOwner.cueEndsAt = performance.now() + length * 1000;
        return length * 1000;
      } catch (_) {
        state.soundEnabled = false;
        stopEffects(true);
        syncAudio();
        ui.soundStatus.textContent = 'Sound unavailable. Silent demos are fully available.';
        return 0;
      }
    }
    function updateVoices() {
      // Voice lists often arrive asynchronously. Loading one never opts the visitor in.
      try {
        preferredVoice = canSpeak ? synthesis.getVoices().find(voice =>
          voice.localService && /^en(?:[-_]|$)/i.test(voice.lang)) || null : null;
      } catch (_) { preferredVoice = null; }
    }
    updateVoices();
    if (canSpeak) synthesis.addEventListener?.('voiceschanged', updateVoices);
    function speak(text) {
      cancelSpeech();
      if (!state.voiceEnabled || !active()) return;
      const unavailable = () => {
        cancelSpeech();
        ui.voiceStatus.textContent = 'Voice unavailable. Read the text, or switch Voice off and on to retry.';
      };
      if (!canSpeak) { unavailable(); return; }
      const generation = speechGeneration;
      const narrate = () => {
        audioOwner.narrationTimer = null;
        if (generation !== speechGeneration || !state.voiceEnabled || !active()) return;
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice?.lang || 'en';
          utterance.rate = 0.97;
          utterance.volume = 0.65;
          utterance.onstart = () => {
            if (generation !== speechGeneration) return;
            if (active()) ui.voiceStatus.textContent = 'Speaking.';
            else cancelSpeech();
          };
          utterance.onend = () => {
            if (generation !== speechGeneration) return;
            idleVoiceStatus();
          };
          utterance.onerror = () => { if (generation === speechGeneration) unavailable(); };
          ui.voiceStatus.textContent = 'Voice requested. Waiting for the browser.';
          synthesis.speak(utterance);
        } catch (_) { unavailable(); }
      };
      const remaining = audioOwner.cueEndsAt - performance.now();
      if (remaining > 0) {
        ui.voiceStatus.textContent = 'Voice will follow the sound.';
        audioOwner.narrationTimer = setTimeout(narrate, Math.ceil(remaining) + 25);
      } else narrate();
    }
    function explain() {
      if (state.demoPhase === 'running') return;
      speak(state.storySelected ? closingExplanation() :
        state.demoPhase === 'completed' ? resultExplanation() : LAB_PROJECTS[state.selectedProject].scenario);
    }
    function later(callback, delay) {
      const generation = demoGeneration;
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (generation === demoGeneration && active()) callback();
      }, delay);
      timers.add(timer);
    }
    function updateControls() {
      buttons.forEach(button => {
        const id = button.dataset.project;
        const selected = id === state.selectedProject;
        const explored = state.exploredIds.has(id);
        button.setAttribute('aria-pressed', String(selected));
        button.querySelector('.lab-project-state').textContent =
          `${selected ? 'Selected' : 'Explore'}${explored ? ' · explored' : ''}`;
        button.querySelector('.lab-check').hidden = !explored;
      });
      ui.progress.textContent = `${state.exploredIds.size} / 4 explored`;
      ui.meter.value = state.exploredIds.size;
      ui.meter.textContent = `${state.exploredIds.size} / 4`;
    }
    function setPhase(phase) {
      state.demoPhase = phase;
      ui.details.dataset.phase = phase;
      ui.details.setAttribute('aria-busy', String(phase === 'running'));
      ui.demoState.textContent = phase === 'before' ? 'Before' : phase === 'running' ? 'Running' : 'Completed · after';
      syncAudio();
    }
    function showBefore() {
      const project = LAB_PROJECTS[state.selectedProject];
      state.storySelected = false;
      setPhase('before');
      ui.title.textContent = project.title;
      ui.scenario.textContent = project.scenario;
      ui.note.textContent = project.note;
      ui.repository.href = project.repository;
      ui.repository.setAttribute('aria-label', `${project.title} repository (opens in a new tab)`);
      ui.visual.replaceChildren(get(`template-${state.selectedProject}`).content.cloneNode(true));
      ui.action.disabled = false;
      ui.action.textContent = project.action;
      ui.action.setAttribute('aria-controls', 'lab-visual');
      ui.replay.hidden = true;
      ui.feedback.hidden = true;
    }
    function cancelDemo() {
      demoGeneration += 1;
      timers.forEach(clearTimeout);
      timers.clear();
      lab.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      ui.particles.replaceChildren();
      ui.complete.classList.remove('is-revealing');
      finalSequenceActive = false;
      ui.successParticles.replaceChildren();
      ui.details.classList.remove('is-success-animating');
      if (state.demoPhase === 'running') showBefore();
    }
    function focusHeading(heading) {
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' });
    }
    function select(id, guided = false) {
      cancelDemo();
      cancelAudio();
      state.selectedProject = id;
      updateControls();
      if (state.started) {
        showBefore();
        if (guided) focusHeading(ui.title);
        announce(`${LAB_PROJECTS[id].title} ready. Choose ${LAB_PROJECTS[id].action}.`);
        cue('select');
        explain();
      } else announce(`${LAB_PROJECTS[id].title} selected. Choose a start option above.`);
    }
    function start(withAudio) {
      state.started = true;
      state.soundEnabled = false;
      state.voiceEnabled = withAudio;
      ui.startOptions.hidden = true;
      ui.audio.hidden = false;
      ui.details.hidden = false;
      showBefore();
      lab.querySelector('.lab-workbench').scrollIntoView({ block: 'start', behavior: 'instant' });
      if (withAudio) enableSound(true);
      else ui.soundStatus.textContent = 'Sound off.';
      syncAudio();
      ui.title.focus({ preventScroll: true });
      announce(`${LAB_PROJECTS[state.selectedProject].title} ready to explore.`);
      if (!withAudio) idleVoiceStatus();
    }
    function revealStory() {
      if (!state.started || state.exploredIds.size !== LAB_ORDER.length) return;
      if (state.celebrationShown) {
        // A second click must neither restart nor cut off the current sequence.
        if (!finalSequenceActive) cancelAudio();
        state.storySelected = true;
        ui.complete.hidden = false;
        ui.storyTitle.focus({ preventScroll: true });
        ui.complete.scrollIntoView({ block: 'start', behavior: 'instant' });
        return;
      }
      cancelDemo();
      cancelAudio();
      state.celebrationShown = true;
      state.storySelected = true;
      finalSequenceActive = true;
      ui.complete.hidden = false;
      ui.storyTitle.focus({ preventScroll: true });
      ui.complete.scrollIntoView({ block: 'start', behavior: 'instant' });
      cue('final');
      if (state.voiceEnabled) speak(closingExplanation());
      if (!motion.matches) {
        ui.complete.classList.add('is-revealing');
        ui.particles.replaceChildren(...Array.from({ length: 48 }, (_, index) => {
          const particle = document.createElement('span');
          const right = index >= 24;
          particle.className = right ? 'from-right' : 'from-left';
          particle.style.setProperty('--x', `${(18 + index % 6 * 17) * (right ? -1 : 1)}px`);
          particle.style.setProperty('--y', `${18 + index % 8 * 15}px`);
          particle.style.setProperty('--turn', `${index * 43}deg`);
          return particle;
        }));
      }
      later(() => {
        finalSequenceActive = false;
        ui.complete.classList.remove('is-revealing');
        ui.particles.replaceChildren();
      }, 1900);
      announce('Four projects. One direction. Your builder story is open.');
    }
    function finishDemo() {
      setPhase('completed');
      state.exploredIds.add(state.selectedProject);
      updateControls();
      const project = LAB_PROJECTS[state.selectedProject];
      const next = nextProject();
      ui.successTitle.textContent = project.resultTitle;
      ui.successCopy.textContent = project.result;
      ui.nextHint.textContent = nextHint();
      ui.feedback.hidden = false;
      ui.action.disabled = false;
      ui.action.textContent = next ? `Next: ${LAB_PROJECTS[next].title} →` : 'See my builder story →';
      ui.action.setAttribute('aria-controls', next ? 'lab-details' : 'lab-complete');
      ui.replay.hidden = false;
      if (!motion.matches) {
        ui.details.classList.add('is-success-animating');
        ui.successParticles.replaceChildren(...Array.from({ length: 14 }, (_, index) => {
          const particle = document.createElement('span');
          const angle = index / 14 * Math.PI * 2;
          const radius = 28 + index % 4 * 8;
          particle.style.setProperty('--x', `${Math.cos(angle) * radius}px`);
          particle.style.setProperty('--y', `${Math.sin(angle) * radius * 0.55}px`);
          particle.style.setProperty('--turn', `${index * 47}deg`);
          return particle;
        }));
        later(() => {
          ui.details.classList.remove('is-success-animating');
          ui.successParticles.replaceChildren();
        }, 950);
      }
      // Disabling a running action can blur it; restore its keyboard position only
      // when the visitor has not moved focus to another control in the meantime.
      if (restoreActionFocus && (document.activeElement === ui.action || document.activeElement === document.body)) {
        ui.action.focus({ preventScroll: true });
        ui.response.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }
      cue('success');
      announce(`${project.resultTitle} ${state.exploredIds.size} / 4 explored. ${nextHint()}`);
      if (state.voiceEnabled) speak(resultExplanation());
    }
    function runDemo() {
      if (!state.started || state.demoPhase !== 'before' || !active()) return;
      cancelDemo();
      cancelAudio();
      restoreActionFocus = document.activeElement === ui.action;
      setPhase('running');
      ui.action.disabled = true;
      ui.action.textContent = 'Making the change…';
      ui.replay.hidden = false;
      const find = selector => ui.visual.querySelector(selector);
      const finish = () => {
        switch (state.selectedProject) {
          case 'kapru': find('.lab-result').hidden = false; break;
          case 'classroom':
            ui.visual.querySelectorAll('.lab-seat').forEach(seat => seat.classList.add('occupied'));
            find('.lab-seats').setAttribute('aria-label', 'Six classroom seats, all six occupied');
            find('[data-occupancy]').textContent = 'HIGH · 6 / 6 seats';
            find('[data-ac]').textContent = 'AC · cooling';
            find('[data-ac]').classList.add('is-cooling');
            break;
          case 'timealert': find('.lab-notification').hidden = false; break;
          case 'darkscan':
            find('.lab-code').classList.remove('is-scanning');
            find('.lab-code').classList.add('has-finding');
            find('.lab-finding').hidden = false;
            break;
        }
        finishDemo();
      };
      if (state.selectedProject === 'timealert') {
        find('[data-time]').textContent = '10:00 AM';
        find('[data-room]').textContent = 'Room B';
        find('[data-time-field]').classList.add('lab-changed');
        find('[data-room-field]').classList.add('lab-changed');
      }
      if (state.selectedProject === 'darkscan') find('.lab-code').classList.add('is-scanning');
      if (motion.matches) finish();
      else later(finish, state.selectedProject === 'darkscan' ? 600 : 300);
    }
    function replay() {
      cancelDemo();
      cancelAudio();
      showBefore();
      // Replay may hide the focused secondary button, so return to the action.
      ui.action.focus({ preventScroll: true });
      ui.action.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      announce(`${LAB_PROJECTS[state.selectedProject].title} reset to before. Progress unchanged.`);
    }
    function leaveLab() {
      if (!state.started) return;
      cancelDemo();
      stopEffects(true);
      state.soundEnabled = false;
      state.voiceEnabled = false;
      cancelSpeech();
      syncAudio();
      ui.soundStatus.textContent = 'Sound off. Use the toggles to enable audio again.';
    }
    buttons.forEach(button => {
      button.disabled = false;
      button.addEventListener('click', () => select(button.dataset.project));
    });
    ui.start.addEventListener('click', () => start(true));
    ui.silent.addEventListener('click', () => start(false));
    ui.sound.addEventListener('click', () => {
      if (state.soundEnabled) {
        state.soundEnabled = false;
        state.voiceEnabled = false;
        cancelAudio(true);
        ui.soundStatus.textContent = 'Sound off.';
      } else enableSound();
      syncAudio();
    });
    ui.voice.addEventListener('click', () => {
      state.voiceEnabled = !state.voiceEnabled;
      if (state.voiceEnabled) {
        if (state.demoPhase === 'running') idleVoiceStatus();
        else explain();
      } else cancelSpeech();
      syncAudio();
    });
    ui.action.addEventListener('click', () => {
      if (state.demoPhase === 'completed') {
        const next = nextProject();
        if (next) select(next, true);
        else revealStory();
      } else runDemo();
    });
    ui.replay.addEventListener('click', replay);
    ui.reset.addEventListener('click', () => {
      // Preserve this visit's explicit Sound/Voice choices across a fresh run.
      cancelDemo();
      cancelAudio();
      state.selectedProject = 'kapru';
      state.exploredIds.clear();
      state.celebrationShown = false;
      ui.complete.hidden = true;
      updateControls();
      showBefore();
      focusHeading(ui.title);
      announce('New exploration. 0 / 4 explored. Kapru is ready.');
      if (state.voiceEnabled) explain();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) leaveLab(); });
    addEventListener('pagehide', leaveLab);
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      if (link.hash !== '#creative-feature') link.addEventListener('click', leaveLab);
    });
    lab.addEventListener('focusout', event => {
      if (event.relatedTarget && !lab.contains(event.relatedTarget)) leaveLab();
    });
    document.addEventListener('pointerdown', event => { if (!lab.contains(event.target)) leaveLab(); }, { passive: true });
    addEventListener('scroll', () => { if (!active()) leaveLab(); }, { passive: true });
    watch(motion, () => { if (motion.matches) cancelDemo(); });
    document.querySelector('.lab-hint[href="#creative-feature"]')?.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      requestAnimationFrame(() => (state.started ? ui.sound : ui.start).focus({ preventScroll: true }));
    });
    updateControls();
    ui.startOptions.hidden = false;
  }


  function setupHero() {
    const art = document.querySelector('.hero-orbit');
    const cv = art?.querySelector('.hero-orbit-canvas');
    const ctx = cv?.getContext('2d');
    if (!art || !ctx || art.dataset.heroReady) return;
    art.dataset.heroReady = 'true';

    let W = 0, H = 0, M = 0, R = 0, badgeUnit = 1;
    let colors, LIME, LINE;
    let frame = null, elapsed = 0, startedAt = 0, running = false, visible = false;
    const previousCenters = new Map(), maxBadgeSizes = new Map();
    let placementTime = null;

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
    // Move through free space around other label slots.
    function routeStep(start, goal, obstacles, width, height, distance) {
      const halfW = width / 2 + 1, halfH = height / 2 + 1;
      const bounds = { left: halfW + 1, top: halfH + 1, right: W - halfW - 1, bottom: H - halfH - 1 };
      const blocked = obstacles.map(box => {
        const pad = 1;
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
        const obstacles = [...placed, ...locked];
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
              obstacles.some(obstacle => intersects(ink,
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
      // Place the compact ML badge first to preserve stable label priority.
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
    function syncMotion() {
      const active = visible && !document.hidden && !motion.matches;
      if (running && !active) {
        elapsed += performance.now() - startedAt;
        running = false;
        cancelAnimationFrame(frame);
        frame = null;
      } else if (!running && active) {
        running = true;
        startedAt = performance.now();
        frame = requestAnimationFrame(animateHero);
      }
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
      let frame = 0, x = 0, y = 0;
      let visible = false;
      let glowX = null, glowY = null;
      const cards = [...document.querySelectorAll('.project-card, .skill-card')];
      const resets = [];
      const resizes = [];
      function paint() {
        frame = 0;
        if (!visible) return;
        // Ambient lighting updates once per frame without replacing the cursor.
        if (x !== glowX || y !== glowY) {
          glow.style.setProperty('--mx', `${x}px`);
          glow.style.setProperty('--my', `${y}px`);
          glowX = x; glowY = y;
        }
      }
      function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
      function hide() {
        visible = false;
        cancelAnimationFrame(frame); frame = 0;
        glow.classList.remove('is-active');
        resets.forEach(reset => reset());
      }
      listen(document, 'pointermove', event => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        x = event.clientX; y = event.clientY;
        visible = true;
        glow.classList.add('is-active');
        schedule();
      });
      listen(document, 'pointerout', event => { if (!event.relatedTarget) hide(); });
      listen(document.documentElement, 'pointerleave', hide);
      listen(window, 'pointercancel', hide);
      listen(window, 'blur', hide);
      listen(document, 'visibilitychange', () => { if (document.hidden) hide(); });

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
      listen(window, 'resize', () => { resizes.forEach(resize => resize()); if (visible) schedule(); });
      dispose = () => {
        events.abort(); hide();
        glow.remove();
      };
    }
    watch(pointer, enable);
    watch(motion, enable);
    enable();
  }

  // Fail independently: a broken optional enhancement cannot disable navigation.
  [setupTheme, setupMenu, setupBuilderLab, setupScroll, setupHero, setupPointerEffects, setupReveals].forEach(setup => {
    try { setup(); } catch (error) { console.warn(`Portfolio: ${setup.name} unavailable`, error); }
  });
})();
