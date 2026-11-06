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
    const mobile = media('(max-width: 859px)');
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
    const audioOwner = { narrationTimer: null, voiceWatchdog: null, cueEndsAt: 0 };
    let preferredVoice = null, voiceUnavailable = false, restoreActionFocus = false, finalSequenceActive = false;
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
      ui.voiceStatus.textContent = voiceUnavailable ? 'Voice unavailable. Read the text, or switch Voice on to retry.' :
        state.voiceEnabled ? 'Voice on.' : 'Voice off.';
    }
    function cancelSpeech() {
      speechGeneration += 1;
      clearTimeout(audioOwner.narrationTimer);
      clearTimeout(audioOwner.voiceWatchdog);
      audioOwner.narrationTimer = null;
      if (canSpeak) synthesis.cancel();
      idleVoiceStatus();
    }
    function stopEffects(suspend = false) {
      const generation = ++audioGeneration;
      audioOwner.cueEndsAt = 0;
      const running = audioContext?.state === 'running';
      const now = audioContext?.currentTime || 0;
      const hadNotes = oscillators.size > 0;
      const releaseDuration = 0.012;
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
          gain.gain.linearRampToValueAtTime(0, now + releaseDuration);
          oscillator.stop(now + releaseDuration);
        } else {
          try { oscillator.stop(); } catch (_) {}
          release();
        }
      });
      suspendWhenQuiet();
      if (!suspend && state.soundEnabled && audioContext?.state === 'running') ui.soundStatus.textContent = 'Sound on.';
      return running && hadNotes ?
        (releaseDuration + (audioContext.baseLatency || 0) + (audioContext.outputLatency || 0)) * 1000 : 0;
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
          masterGain.gain.value = 0.16;
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
        // All layers share one schedule origin and ample summed-signal headroom.
        const origin = audioContext.currentTime + 0.008;
        masterGain.gain.setValueAtTime(0.16, audioContext.currentTime);
        notes.forEach(({ frequency, offset, duration, strength, attack }) => {
          const start = origin + offset;
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
        audioOwner.cueEndsAt = origin + length;
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
        const english = canSpeak ? synthesis.getVoices().filter(voice => /^en(?:[-_]|$)/i.test(voice.lang)) : [];
        // Use an installed English voice; never select a remote TTS service.
        preferredVoice = english.find(voice => voice.localService) || null;
      } catch (_) { preferredVoice = null; }
    }
    updateVoices();
    if (canSpeak) synthesis.addEventListener?.('voiceschanged', updateVoices);
    function speak(text) {
      cancelSpeech();
      if (!state.voiceEnabled || !active()) return;
      const unavailable = () => {
        voiceUnavailable = true;
        cancelSpeech();
        state.voiceEnabled = false;
        syncAudio();
        ui.voiceStatus.textContent = 'Voice unavailable. Read the text, or switch Voice on to retry.';
      };
      if (!canSpeak) { unavailable(); return; }
      const generation = speechGeneration;
      let voiceWaitStarted = null;
      const narrate = () => {
        audioOwner.narrationTimer = null;
        if (generation !== speechGeneration || !state.voiceEnabled || !active()) return;
        // Recheck the audio clock: a delayed/suspended context must not let
        // narration jump ahead of the scheduled release tail or output latency.
        const remaining = state.soundEnabled && audioContext?.state === 'running' ?
          audioOwner.cueEndsAt - audioContext.currentTime + (audioContext.baseLatency || 0) + (audioContext.outputLatency || 0) : 0;
        if (remaining > 0) {
          ui.voiceStatus.textContent = 'Voice will follow the sound.';
          audioOwner.narrationTimer = setTimeout(narrate, Math.ceil(remaining * 1000) + 20);
          return;
        }
        try {
          updateVoices();
          if (!preferredVoice) {
            // OS voice lists can arrive after page load. Wait briefly, with the
            // same cancellation owner as cue sequencing, before falling back to text.
            if (voiceWaitStarted === null) voiceWaitStarted = performance.now();
            if (performance.now() - voiceWaitStarted >= 1500) { unavailable(); return; }
            ui.voiceStatus.textContent = 'Loading an installed English voice…';
            audioOwner.narrationTimer = setTimeout(narrate, 100);
            return;
          }
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice?.lang || 'en';
          utterance.rate = 0.97;
          utterance.volume = 0.65;
          utterance.onstart = () => {
            if (generation !== speechGeneration) return;
            clearTimeout(audioOwner.voiceWatchdog);
            if (active()) ui.voiceStatus.textContent = 'Speaking.';
            else cancelSpeech();
          };
          utterance.onend = () => {
            if (generation !== speechGeneration) return;
            idleVoiceStatus();
          };
          utterance.onerror = () => { if (generation === speechGeneration) unavailable(); };
          ui.voiceStatus.textContent = 'Voice requested. Waiting for the browser.';
          audioOwner.voiceWatchdog = setTimeout(() => {
            if (generation === speechGeneration) unavailable();
          }, 5000);
          synthesis.speak(utterance);
        } catch (_) { unavailable(); }
      };
      narrate();
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
        button.dataset.explored = String(explored);
        button.querySelector('.lab-project-state').textContent = selected && state.started ?
          (state.demoPhase === 'running' ? 'Running…' : state.demoPhase === 'completed' ? 'Completed · explored' : `Selected${explored ? ' · explored' : ''}`) :
          (explored ? 'Explored · revisit' : selected ? 'Selected' : 'Ready to explore');
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
      updateControls();
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
      // Keep guided controls stable even when Next and the following action are
      // used quickly; a second smooth scroll can otherwise move the hit target.
      heading.scrollIntoView({ block: 'start', behavior: 'instant' });
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
        const reach = Math.min(ui.complete.clientWidth * .29, 230);
        // Two balanced waves share one bounded node set and the existing cleanup
        // owner. Their longer flight never changes the sound or narration clocks.
        ui.particles.replaceChildren(...Array.from({ length: 64 }, (_, index) => {
          const particle = document.createElement('span');
          const wave = Math.floor(index / 32);
          const slot = index % 16;
          const right = index % 32 >= 16;
          particle.className = right ? 'from-right' : 'from-left';
          particle.style.setProperty('--flight-delay', `${wave * .68 + slot % 5 * .035}s`);
          particle.style.setProperty('--flight-time', `${1.85 + slot % 4 * .065}s`);
          particle.style.setProperty('--particle-width', `${3 + slot % 3}px`);
          particle.style.setProperty('--particle-height', `${5 + slot % 4}px`);
          const travel = reach * (.4 + slot / 25) * (right ? -1 : 1);
          const rise = 52 + slot % 7 * 11;
          const drop = 64 + slot % 5 * 13;
          for (const percent of [25, 50, 75, 100]) {
            const t = percent / 100;
            particle.style.setProperty(`--x${percent}`, `${travel * t}px`);
            particle.style.setProperty(`--y${percent}`, `${-4 * rise * t * (1 - t) + drop * t * t}px`);
            particle.style.setProperty(`--r${percent}`, `${(120 + slot * 23) * t * (right ? -1 : 1)}deg`);
          }
          return particle;
        }));
      }
      later(() => {
        finalSequenceActive = false;
        ui.complete.classList.remove('is-revealing');
        ui.particles.replaceChildren();
      }, 3000);
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
        const releaseDelay = stopEffects(true);
        // Sound and Voice are independent. Move a waiting explanation to voice
        // alone after the cancellation fade, without leaving a stale callback.
        if (state.voiceEnabled && audioOwner.narrationTimer !== null) {
          cancelSpeech();
          audioOwner.narrationTimer = setTimeout(explain, Math.ceil(releaseDelay));
        }
        ui.soundStatus.textContent = 'Sound off.';
      } else enableSound(state.voiceEnabled);
      syncAudio();
    });
    ui.voice.addEventListener('click', () => {
      state.voiceEnabled = !state.voiceEnabled;
      if (state.voiceEnabled) {
        voiceUnavailable = false;
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
    const cv = art?.querySelector('canvas');
    const ctx = cv?.getContext('2d');
    if (!ctx || art.dataset.heroReady) return;
    art.dataset.heroReady = 'true';
    let width = 0, height = 0, radius = 0, frame = 0, last = 0, angle = .35;
    let orbitTime = 0;
    let inView = false, mx = 0, my = 0, targetX = 0, targetY = 0;
    let colors = {};
    const tau = Math.PI * 2;
    const badges = [...art.querySelectorAll('.orbit-badge')].map((element, index) => ({
      element, width: 0, height: 0,
      phase: [4.2, 4.95, 1.4][index], speed: [.17, -.135, .115][index],
      roll: [-.55, .7, .05][index], tilt: [.9, 1.05, .8][index]
    }));
    function satellite(badge, phase) {
      const reach = Math.max(0, width / 2 - badge.width / 2 - 12);
      const x = Math.cos(phase) * reach;
      const y = Math.sin(phase) * reach * Math.cos(badge.tilt);
      return {
        x: width / 2 + x * Math.cos(badge.roll) - y * Math.sin(badge.roll),
        y: height * .49 + x * Math.sin(badge.roll) + y * Math.cos(badge.roll),
        z: Math.sin(phase) * Math.sin(badge.tilt)
      };
    }
    function drawSatellites() {
      const points = badges.map(badge => ({...satellite(badge, badge.phase + orbitTime * badge.speed), badge}));
      // Start separating in a soft outer margin, before the actual boxes meet.
      // With three small labels, vertical separation keeps their paths legible
      // without swapping labels, spinning text or allocating another frame loop.
      for (let pass = 0; pass < 6; pass++) {
        for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const clearanceX = (a.badge.width + b.badge.width) / 2 + 10;
          const clearanceY = (a.badge.height + b.badge.height) / 2 + 10;
          const pressure = Math.min(1, Math.max(0, (clearanceX + 18 - Math.abs(a.x - b.x)) / 18));
          const overlap = clearanceY * pressure - Math.abs(a.y - b.y);
          if (overlap > 0) {
            const direction = a.y === b.y ? (i < j ? -1 : 1) : Math.sign(a.y - b.y);
            a.y += direction * overlap / 2; b.y -= direction * overlap / 2;
          }
        }
        points.forEach(({badge, ...point}, index) => {
          points[index].x = Math.min(width - badge.width / 2 - 8, Math.max(badge.width / 2 + 8, point.x));
          points[index].y = Math.min(height - badge.height / 2 - 8, Math.max(badge.height / 2 + 8, point.y));
        });
      }
      points.forEach(({badge, x, y, z}) => {
        badge.element.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${.97 + z * .025})`;
        badge.element.style.opacity = String(.93 + z * .07);
        badge.element.style.zIndex = z > 0 ? '3' : '2';
      });
    }
    const vector = (lat, lon) => [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
    // Decorative great-circle arcs. These are not geography or live telemetry.
    const routes = [[.4,-1.2,.7,1.4],[-.6,-.5,.5,2.5],[.8,-2.2,-.4,.9],[-.35,1.8,.3,-.6]].map(values => {
      const a = vector(values[0], values[1]), b = vector(values[2], values[3]);
      const omega = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum,v,i) => sum + v*b[i],0))));
      return { a, b, omega };
    });
    function routePoint(route, t) {
      const { a, b, omega } = route;
      const lift = 1 + Math.sin(t * Math.PI) * .08;
      return a.map((v,i) => (v*Math.sin((1-t)*omega) + b[i]*Math.sin(t*omega)) / Math.sin(omega) * lift);
    }
    function project([x,y,z]) {
      const yaw = angle + mx, pitch = -.22 + my;
      const rx = x*Math.cos(yaw) + z*Math.sin(yaw);
      const rz = z*Math.cos(yaw) - x*Math.sin(yaw);
      const ry = y*Math.cos(pitch) - rz*Math.sin(pitch);
      const depth = y*Math.sin(pitch) + rz*Math.cos(pitch);
      // Orthographic projection keeps the grid calm and the silhouette round.
      return [width*.5 + rx*radius, height*.49 - ry*radius, depth];
    }
    function stroke(points, color, frontAlpha, backAlpha, lineWidth = 1) {
      ctx.strokeStyle = color; ctx.lineWidth = lineWidth;
      for (const front of [false,true]) {
        ctx.globalAlpha = front ? frontAlpha : backAlpha;
        ctx.beginPath(); let pen = false;
        points.forEach(point => {
          const [x,y,z] = project(point);
          if ((z >= 0) === front) {
            if (pen) ctx.lineTo(x,y); else ctx.moveTo(x,y);
            pen = true;
          } else pen = false;
        });
        ctx.stroke();
      }
    }
    function draw() {
      ctx.clearRect(0,0,width,height);
      ctx.globalAlpha = 1;
      const wash = ctx.createRadialGradient(width*.43,height*.4,0,width*.5,height*.49,radius);
      wash.addColorStop(0,colors.surface); wash.addColorStop(1,colors.bg);
      ctx.fillStyle = wash; ctx.beginPath(); ctx.arc(width*.5,height*.49,radius,0,tau); ctx.fill();
      badges.forEach(badge => {
        ctx.globalAlpha = .34; ctx.strokeStyle = colors.teal; ctx.lineWidth = .8;
        ctx.beginPath();
        for (let step = 0; step <= 72; step++) {
          const point = satellite(badge, step / 72 * tau);
          if (step) ctx.lineTo(point.x, point.y); else ctx.moveTo(point.x, point.y);
        }
        ctx.stroke();
      });
      for (let lat=-3;lat<=3;lat++) stroke(Array.from({length:97},(_,i) => vector(lat*Math.PI/8,i/96*tau)),colors.grid,.82,.34);
      for (let lon=0;lon<12;lon++) stroke(Array.from({length:65},(_,i) => vector(-Math.PI/2+i/64*Math.PI,lon/12*tau)),colors.grid,.82,.34);
      ctx.globalAlpha=.6; ctx.strokeStyle=colors.accent; ctx.lineWidth=.9;
      ctx.beginPath(); ctx.arc(width*.5,height*.49,radius,0,tau); ctx.stroke();
      routes.forEach((route,index) => {
        stroke(Array.from({length:65},(_,i) => routePoint(route,i/64)),index%2 ? colors.teal : colors.accent,.88,.28,1.2);
        // One packet per route, capped at four; static when reduced motion is on.
        const t = ((angle*.48 + index*.24) % .9) + .05;
        const [x,y,z] = project(routePoint(route,t));
        if (z < 0) return;
        ctx.globalAlpha=.95; ctx.fillStyle=index%2 ? colors.teal : colors.accent;
        ctx.beginPath(); ctx.arc(x,y,2.3,0,tau); ctx.fill();
        ctx.globalAlpha=.11; ctx.beginPath(); ctx.arc(x,y,6,0,tau); ctx.fill();
      });
      ctx.globalAlpha=1;
      drawSatellites();
    }
    function palette() {
      const style = getComputedStyle(root);
      colors = Object.fromEntries(['bg','surface','grid','accent','teal'].map(name => [name,style.getPropertyValue(`--${name}`).trim()]));
    }
    function resize() {
      const box=art.getBoundingClientRect();
      width=box.width; height=box.height; radius=Math.min(width,height)*.405;
      const dpr=Math.min(devicePixelRatio || 1,2);
      cv.width=Math.round(width*dpr); cv.height=Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      badges.forEach(badge => { badge.width = badge.element.offsetWidth; badge.height = badge.element.offsetHeight; });
      draw();
    }
    function tick(now) {
      const delta=Math.min((now-last)/1000,.05); last=now;
      angle+=delta*.075;
      orbitTime+=delta;
      mx+=(targetX-mx)*.035; my+=(targetY-my)*.035;
      draw(); frame=requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame); frame=0;
      const running=inView && !document.hidden && !motion.matches;
      art.dataset.motion=running ? 'running' : 'static';
      if (running) { last=performance.now(); frame=requestAnimationFrame(tick); }
      else draw();
    }
    function resetPointer() { targetX=targetY=0; }
    addEventListener('pointermove',event => {
      if (!effectsAllowed() || !inView || document.hidden || event.pointerType !== 'mouse') return;
      targetX=(event.clientX/innerWidth-.5)*.16;
      targetY=(event.clientY/innerHeight-.5)*.10;
    },{passive:true});
    document.documentElement.addEventListener('pointerleave',resetPointer);
    addEventListener('blur',resetPointer);
    document.addEventListener('visibilitychange',() => { resetPointer(); sync(); });
    watch(motion,() => { resetPointer(); mx=my=0; sync(); });
    new MutationObserver(() => { palette(); draw(); }).observe(root,{attributes:true,attributeFilter:['data-theme']});
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(art); else addEventListener('resize',resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView=entries[0].isIntersecting; sync(); }).observe(art);
    else { inView=true; addEventListener('scroll',() => { const rect=art.getBoundingClientRect(); inView=rect.bottom>0 && rect.top<innerHeight; sync(); },{passive:true}); }
    palette(); resize(); sync();
  }

  function setupSkillBars() {
    const cards=[...document.querySelectorAll('.skill-card')];
    if (motion.matches || !('IntersectionObserver' in window)) return;
    const observer=new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('skill-waiting');
      entry.target.classList.add('skill-entered');
      observer.unobserve(entry.target);
    }),{threshold:.18});
    cards.forEach((card,index) => {
      card.style.setProperty('--skill-delay',`${index%2*70}ms`);
      card.classList.add('skill-waiting'); observer.observe(card);
    });
    const finish=() => { observer.disconnect(); cards.forEach(card => card.classList.remove('skill-waiting','skill-entered')); };
    watch(motion,() => { if (motion.matches) finish(); });
    addEventListener('error',finish,{once:true});
    addEventListener('unhandledrejection',finish,{once:true});
  }


  function setupReveals() {
    if (motion.matches || !('IntersectionObserver' in window)) return;
    // Reveal section introductions separately so tall sections never hide their cards.
    const elements = [...document.querySelectorAll('.section-heading, .about-copy, .project-card')];
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
      dispose?.(); dispose = null;
      if (motion.matches) return;
      const events = new AbortController(), signal = events.signal;
      const listen = (target, type, callback) => target.addEventListener(type, callback, {passive: true, signal});
      // One noninteractive overlay owns the accepted dot and following ring.
      const layer = document.createElement('div');
      layer.className = 'pointer-decoration'; layer.setAttribute('aria-hidden', 'true');
      const dot = document.createElement('span'), ring = document.createElement('span');
      dot.className = 'pointer-dot'; ring.className = 'pointer-ring';
      [dot, ring].forEach(element => element.setAttribute('aria-hidden', 'true'));
      layer.append(ring, dot); document.body.append(layer);
      const interactive = 'a[href],button:not(:disabled),[role="button"]:not([aria-disabled="true"])';
      const editable = 'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[data-native-cursor]';
      let frame = 0, x = 0, y = 0, rx = 0, ry = 0, lastFrame = 0;
      let visible = false, selecting = false, cursorAvailable = true, validate = true;
      let tap = null, expiry = 0;
      const touches = new Set(), ripples = new Set();
      const hasSelection = () => {
        const selection = window.getSelection?.();
        return Boolean(selection && !selection.isCollapsed);
      };
      function hideCursor() {
        visible = false;
        cancelAnimationFrame(frame); frame = 0; lastFrame = 0;
        document.body.classList.remove('custom-cursor-active');
        layer.classList.remove('is-visible', 'is-interactive');
      }
      function paint(now) {
        frame = 0;
        if (!visible || document.hidden) return;
        try {
          const delta = lastFrame ? Math.min(now - lastFrame, 40) : 16;
          lastFrame = now;
          const follow = 1 - Math.exp(-delta / 65);
          rx += (x - rx) * follow; ry += (y - ry) * follow;
          const settling = Math.hypot(x - rx, y - ry) > .12;
          if (!settling) { rx = x; ry = y; }
          dot.style.transform = `translate3d(${x}px,${y}px,0)`;
          ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
          layer.classList.add('is-visible');
          if (validate || !dot.isConnected || !ring.isConnected) {
            const styles = [dot, ring].map(element => getComputedStyle(element));
            const layerStyle = getComputedStyle(layer);
            if (!dot.isConnected || !ring.isConnected || styles.some(style => style.display === 'none' ||
                style.visibility === 'hidden' || parseFloat(style.width) < 6 || parseFloat(style.opacity) === 0) ||
                layerStyle.display === 'none' || parseFloat(layerStyle.opacity) === 0) { hideCursor(); return; }
            validate = false;
          }
          // Native hiding follows successful positioning/visibility of BOTH parts.
          document.body.classList.add('custom-cursor-active');
          // Stop after the following ring settles; no ambient movement loop.
          if (settling) frame = requestAnimationFrame(paint);
        } catch (_) { cursorAvailable = false; hideCursor(); }
      }
      function cancelTap() { tap = null; clearTimeout(expiry); }
      function hide() {
        hideCursor(); selecting = false; cancelTap(); touches.clear();
        ripples.forEach(item => { clearTimeout(item.timer); item.element.remove(); }); ripples.clear();
      }
      function track(event) {
        if (event.pointerType === 'touch') {
          hideCursor();
          if (tap && (event.pointerId !== tap.id || Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 9)) cancelTap();
          return;
        }
        const target = event.target instanceof Element ? event.target : null;
        if (event.pointerType !== 'mouse' || !pointer.matches || document.hidden || !cursorAvailable ||
            !target?.closest('body') || target.closest(editable) || target.isContentEditable ||
            event.buttons || selecting || hasSelection()) { hideCursor(); return; }
        x = event.clientX; y = event.clientY;
        if (!visible) { rx = x; ry = y; }
        visible = true; validate = true;
        layer.classList.toggle('is-interactive', Boolean(target.closest(interactive)));
        if (!frame) frame = requestAnimationFrame(paint);
      }
      listen(document, 'pointermove', track);
      listen(document, 'pointerover', event => { if (!event.relatedTarget) track(event); });
      listen(document, 'pointerdown', event => {
        if (event.pointerType === 'mouse') {
          if (event.button === 0 && !event.target.closest(interactive)) { selecting = true; hideCursor(); }
          return;
        }
        hideCursor();
        if (event.pointerType !== 'touch') return;
        touches.add(event.pointerId);
        if (touches.size !== 1 || !event.isPrimary) { cancelTap(); return; }
        tap = {id: event.pointerId, x: event.clientX, y: event.clientY, start: performance.now()};
        expiry = setTimeout(cancelTap, 260);
      });
      listen(document, 'pointerup', event => {
        if (event.pointerType === 'mouse') { selecting = false; return; }
        if (event.pointerType !== 'touch') return;
        const valid = tap && event.pointerId === tap.id && touches.size === 1 && performance.now() - tap.start < 260 && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) <= 9;
        touches.delete(event.pointerId); cancelTap();
        if (!valid) return;
        // At most one short tap ripple. Compatibility mouse events are unused.
        ripples.forEach(item => { clearTimeout(item.timer); item.element.remove(); }); ripples.clear();
        const element = document.createElement('span'); element.className = 'tap-ripple'; element.setAttribute('aria-hidden', 'true');
        element.style.left = `${event.clientX}px`; element.style.top = `${event.clientY}px`;
        document.body.append(element);
        const item = {element, timer: setTimeout(() => { element.remove(); ripples.delete(item); }, 390)};
        ripples.add(item);
      });
      listen(document, 'selectionchange', () => { if (hasSelection()) hideCursor(); });
      listen(document, 'keydown', event => { if (event.key === 'Tab') hideCursor(); });
      listen(document, 'pointercancel', hide);
      listen(document, 'pointerout', event => { if (!event.relatedTarget && event.pointerType === 'mouse') hide(); });
      listen(document.documentElement, 'pointerleave', event => { if (event.pointerType === 'mouse') hide(); });
      listen(window, 'blur', hide);
      listen(window, 'scroll', cancelTap);
      listen(document, 'visibilitychange', () => { if (document.hidden) hide(); });
      listen(window, 'pagehide', hide);
      dispose = () => { events.abort(); hide(); layer.remove(); };
    }
    watch(pointer, enable); watch(motion, enable); enable();
  }

  // Water heading effect
  function setupWaterHeadings() {
    if (root.dataset.waterHeadingsReady || !window.CSS?.supports('filter', 'url("#water-probe")') ||
        !('SVGFETurbulenceElement' in window) || !('SVGFEDisplacementMapElement' in window)) return;
    const selector = 'h1, h2, h3, h4, h5, h6';
    const ns = 'http://www.w3.org/2000/svg';
    const make = (tag, attrs = {}) => {
      const node = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    };
    const svg = make('svg', {class: 'water-heading-defs', width: '0', height: '0', 'aria-hidden': 'true', focusable: 'false'});
    const defs = make('defs'); svg.append(defs); document.body.append(svg);
    const prefix = `heading-water-${window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;
    const records = new Map(), active = new Set();
    let counter = 0, frame = 0, last = 0, hovered = null;
    const selectionActive = () => Boolean(window.getSelection?.()?.toString());
    function saveStyle(element, name) {
      return {value: element.style.getPropertyValue(name), priority: element.style.getPropertyPriority(name)};
    }
    function restoreStyle(element, name, saved, owned) {
      if (!saved || element.style.getPropertyValue(name) !== owned) return;
      if (saved.value) element.style.setProperty(name, saved.value, saved.priority);
      else element.style.removeProperty(name);
    }
    function clearRipple(record) {
      record.ripple?.remove(); record.ripple = null;
    }
    function reset(record) {
      record.target = record.scale = 0;
      record.displacement.setAttribute('scale', '0');
      clearRipple(record);
      if (record.applied) {
        restoreStyle(record.element, 'filter', record.filterStyle, record.ownedFilter);
        restoreStyle(record.element, 'position', record.positionStyle, 'relative');
        restoreStyle(record.element, 'isolation', record.isolationStyle, 'isolate');
        if (record.addedClass) record.element.classList.remove('water-heading-active');
        record.applied = false;
      }
      active.delete(record);
      if (hovered === record) hovered = null;
    }
    function clearAll() {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      [...active].forEach(reset); hovered = null;
    }
    function dispose(record) {
      reset(record); record.events.abort(); record.filter.remove(); records.delete(record.element);
    }
    function schedule() {
      if (!frame && active.size && !document.hidden && !motion.matches && pointer.matches) {
        last = last || performance.now(); frame = requestAnimationFrame(animate);
      }
    }
    function animate(now) {
      frame = 0;
      if (document.hidden || motion.matches || !pointer.matches) { clearAll(); return; }
      const delta = Math.min(now - last, 50); last = now;
      const mix = 1 - Math.pow(1 - .12, delta / (1000 / 60));
      for (const record of [...active]) {
        if (!record.element.isConnected) { dispose(record); continue; }
        try {
          record.scale += (record.target - record.scale) * mix;
          if (!record.target && record.scale < .04) { reset(record); continue; }
          record.displacement.setAttribute('scale', record.scale.toFixed(3));
          const t = (now - record.started) / 1000;
          record.noise.setAttribute('baseFrequency', `${(.012 + Math.sin(t * .75) * .0018).toFixed(5)} ${(.021 + Math.cos(t * .62) * .002).toFixed(5)}`);
          if (record.ripple && now >= record.rippleEnds) clearRipple(record);
        } catch (_) { record.failed = true; reset(record); }
      }
      if (active.size) schedule(); else last = 0;
    }
    function targetScale(element) {
      const size = parseFloat(getComputedStyle(element).fontSize) || 16;
      const level = Number(element.tagName[1]);
      if (level <= 2) return size >= 34 ? Math.min(22, Math.max(18, size * .4)) : Math.min(16, size * .45);
      if (level === 3) return Math.min(15, Math.max(10, size * .5));
      return Math.min(12, Math.max(8, size * .5));
    }
    function enter(record, event) {
      if (event.pointerType !== 'mouse' || event.buttons || !effectsAllowed() || document.hidden ||
          record.failed || selectionActive() || record.element.isContentEditable) return;
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      if (hit?.closest(selector) !== record.element) return;
      if (hovered && hovered !== record) { hovered.target = 0; }
      const element = record.element, style = getComputedStyle(element);
      // Non-replaced inline boxes cannot reliably render CSS SVG filters. Keep
      // their original display and ordinary text instead of changing layout.
      if (style.display === 'inline' || style.display === 'contents' || style.display === 'none') return;
      try {
        const box = element.getBoundingClientRect();
        // Pixel bounds include displaced glyphs, accents and existing outlines.
        record.filter.setAttribute('width', Math.ceil(box.width + 64));
        record.filter.setAttribute('height', Math.ceil(box.height + 64));
        if (!record.applied) {
          record.filterStyle = saveStyle(element, 'filter');
          record.positionStyle = style.position === 'static' ? saveStyle(element, 'position') : null;
          record.isolationStyle = style.isolation === 'auto' ? saveStyle(element, 'isolation') : null;
          record.ownedFilter = `${style.filter === 'none' ? '' : `${style.filter} `}url("#${record.filter.id}")`;
          element.style.setProperty('filter', record.ownedFilter, 'important');
          // Read back the serialized inline value for exact ownership checks.
          record.ownedFilter = element.style.getPropertyValue('filter');
          if (record.positionStyle) element.style.setProperty('position', 'relative');
          if (record.isolationStyle) element.style.setProperty('isolation', 'isolate');
          record.addedClass = !element.classList.contains('water-heading-active');
          element.classList.add('water-heading-active');
          record.applied = true;
        }
        clearRipple(record);
        const overlay = document.createElement('span'), ripple = document.createElement('span');
        overlay.className = 'heading-water-bounds'; ripple.className = 'heading-water-ripple';
        overlay.setAttribute('aria-hidden', 'true'); ripple.setAttribute('aria-hidden', 'true');
        const diameter = Math.min(1000, Math.max(100, Math.hypot(box.width, box.height) * 1.8));
        ripple.style.setProperty('--heading-ripple-size', `${diameter}px`);
        ripple.style.left = `${event.clientX - box.left}px`;
        ripple.style.top = `${event.clientY - box.top}px`;
        overlay.append(ripple); element.append(overlay); record.ripple = overlay;
        record.rippleEnds = performance.now() + 900;
        record.started = performance.now(); record.target = targetScale(element);
        hovered = record; active.add(record); schedule();
      } catch (_) { record.failed = true; reset(record); }
    }
    function initialize(element) {
      if (records.has(element)) return;
      const filter = make('filter', {id: `${prefix}-${++counter}`, filterUnits: 'userSpaceOnUse', x: '-32', y: '-32', width: '100', height: '100', 'color-interpolation-filters': 'sRGB'});
      const noise = make('feTurbulence', {type: 'fractalNoise', baseFrequency: '.012 .021', numOctaves: '2', seed: String(counter), stitchTiles: 'stitch', result: 'headingNoise'});
      const displacement = make('feDisplacementMap', {in: 'SourceGraphic', in2: 'headingNoise', scale: '0', xChannelSelector: 'R', yChannelSelector: 'G'});
      filter.append(noise, displacement); defs.append(filter);
      const record = {element, filter, noise, displacement, scale: 0, target: 0, applied: false, ripple: null, events: new AbortController()};
      records.set(element, record);
      element.addEventListener('pointerenter', event => enter(record, event), {passive: true, signal: record.events.signal});
      element.addEventListener('pointerleave', () => { record.target = 0; if (hovered === record) hovered = null; schedule(); }, {passive: true, signal: record.events.signal});
    }
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(initialize);
    new MutationObserver(changes => {
      let removed = false;
      for (const change of changes) {
        removed ||= change.removedNodes.length > 0;
        for (const node of change.addedNodes) if (node instanceof Element) {
          if (node.matches(selector)) initialize(node);
          node.querySelectorAll(selector).forEach(initialize);
        }
      }
      if (removed) for (const record of [...records.values()]) if (!record.element.isConnected) dispose(record);
      if (!active.size) { cancelAnimationFrame(frame); frame = 0; last = 0; }
    }).observe(document.body, {childList: true, subtree: true});
    document.addEventListener('pointerdown', clearAll, {passive: true});
    document.addEventListener('selectionchange', () => { if (selectionActive()) clearAll(); });
    document.addEventListener('keydown', event => { if (event.key === 'Tab') clearAll(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) clearAll(); });
    addEventListener('blur', clearAll); addEventListener('pagehide', clearAll);
    addEventListener('resize', clearAll);
    watch(motion, () => { if (motion.matches) clearAll(); });
    watch(pointer, () => { if (!pointer.matches) clearAll(); });
    root.dataset.waterHeadingsReady = 'true';
  }

  // Fail independently: a broken optional enhancement cannot disable navigation.
  [setupTheme, setupMenu, setupBuilderLab, setupScroll, setupHero, setupPointerEffects, setupWaterHeadings, setupSkillBars, setupReveals].forEach(setup => {
    try { setup(); } catch (error) { console.warn(`Portfolio: ${setup.name} unavailable`, error); }
  });
})();
