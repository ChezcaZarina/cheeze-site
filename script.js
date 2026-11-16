const $ = s => document.querySelector(s);
const eyes = [...document.querySelectorAll('.eye')];
const svg = $('#cheese');

// ===== CHEESE (home page only) =====
const lines = ['Hehe, that tickles!', 'Have you had a snack today?', 'You’re doing okay.', 'Boop!', 'More pets, please.', 'Drink some water.', 'Rest counts too.'];
let n = 0, timer;

function pet(text) {
  document.body.classList.remove('hop');
  void document.body.offsetWidth;
  document.body.classList.add('hop');
  const say = $('#say');                       // not on fun.html, so check first
  if (say) say.textContent = typeof text === 'string' ? text : lines[n++ % lines.length];
  clearTimeout(timer);
  timer = setTimeout(() => document.body.classList.remove('hop'), 1200);
}

if (svg) {
  // Eyes follow the mouse
  document.addEventListener('pointermove', e => {
    const r = svg.getBoundingClientRect();
    const k = r.width / 300;
    const mx = (e.clientX - r.left) / k;
    const my = (e.clientY - r.top) / k;
    eyes.forEach(g => {
      const cx = +g.dataset.cx, cy = +g.dataset.cy;
      const a = Math.atan2(my - cy, mx - cx);
      const d = Math.min(7, Math.hypot(mx - cx, my - cy) / 20);
      g.style.transform = 'translate(' + Math.cos(a) * d + 'px,' + Math.sin(a) * d + 'px)';
    });
  });

  svg.addEventListener('click', () => pet());
  svg.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pet(); }
  });
}

// ===== ENVELOPE (home page only) =====
if ($('#env')) {
  const env = $('#env');

  function toggleEnvelope() {
    const open = env.classList.toggle('open');
    env.setAttribute('aria-expanded', open);
  }

  env.addEventListener('click', e => {
    if (e.target.closest('.letter a')) return;
    toggleEnvelope();
  });

  env.addEventListener('keydown', e => {
    if (e.target === env && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleEnvelope();
    }
  });
}

// ===== MOOD CHECK-IN (fun page only) =====
if ($('#moods')) {
    const moods = [
    { name: 'Happy', say: "Yay, we're back!", msgs: [
      "Love this for you. Soak it in for a bit.",
      "Someone's having a good day. We love to see it!",
      "Whatever's going right, I hope it keeps going.",
      "A good day is a good day. Notice this one.",
      "Treat yourself a little today, just because.",
      "Your happy is welcome here. Enjoy it!"
    ] },

    { name: 'Overwhelmed', say: "One thing at a time.", msgs: [
      "Okay, that's a lot. Let's not try to do it all at once.",
      "Pick one small thing and start there. Just that one for now.",
      "If someone can take even one thing off your plate, it's okay to let them.",
      "Not everything needs your attention right this second.",
      "It's a lot right now, and that's okay. You're allowed to go slow.",
      "Try writing it all down. It's easier to handle when it's not all in your head."
    ] },

    { name: 'Anxious', say: "I'm right here.", msgs: [
      "Your brain has a lot of tabs open. Try closing one.",
      "I know it's easier said than done, but you don't have to figure it all out today.",
      "Whatever happens, you'll handle it when you get there.",
      "Take a slow breath. In for a few seconds, out a little longer.",
      "Worries can sound louder than they really are. Give it a minute.",
      "You've gotten through rough days before, and you'll get through this one too."
    ] },

    { name: 'Alone', say: "Hey, you're here.", msgs: [
      "You're worth checking in on, too.",
      "A quiet day doesn't mean you're forgotten.",
      "Feeling alone doesn't mean something is wrong with you.",
      "I'm glad you're here, even if it's just for a little while.",
      "Maybe do something small that feels comforting, like a favorite song or a snack.",
      "Reaching out to someone is always an option, but only if you feel like it."
    ] },

    { name: 'Sad', say: "Sending a hug.", msgs: [
      "I hope tomorrow is a little kinder to you.",
      "You don't have to pretend you're fine here.",
      "It's okay if today isn't your favorite. We've all had those days.",
      "Maybe wrap yourself in something warm for a bit.",
      "Be gentle with yourself today. You deserve the same kindness you'd give a friend.",
      "Let yourself feel it for a bit. It's okay to not be okay today."
    ] },

    { name: 'Tired', say: "Time for a break?", msgs: [
      "Have you had some water today? Just checking.",
      "You've earned a little do-nothing time.",
      "The to-do list can wait. It has no choice.",
      "Go rest. The world can manage without you for a bit.",
      "Being tired is your body asking for a break. Maybe listen to it.",
      "Even ten minutes lying down with your eyes closed can help."
    ] },

    { name: 'Numb', say: "That's okay too.", msgs: [
      "Feeling nothing is still a feeling. You don't have to force anything.",
      "You don't have to figure out what you feel right now.",
      "A warm shower or a change of scenery might help you feel a bit more present.",
      "Some days are just quiet inside. That's okay.",
      "Doing something with your hands can help, like tidying, doodling, or cooking something simple.",
      "If this feeling sticks around for a while, talking to someone you trust can help."
    ] },

    { name: 'Bored', say: "Let's find something fun.", msgs: [
      "Boredom usually means you're ready for something new.",
      "Reorganize a drawer or a playlist. It's weirdly satisfying.",
      "Maybe poke around the terminal on this page. Just a thought.",
      "Bored days can be oddly good for ideas.",
      "Do something small and silly. It counts.",
      "Try something you've been curious about but never started."
    ] },

    { name: 'Mad', say: "Okay, that's valid.", msgs: [
      "You're allowed to be mad. Your feelings make sense.",
      "Give it a minute before you react to anything.",
      "Maybe let it out safely: a fast walk, loud music, or a pillow to yell into.",
      "If you want to send a message, it's okay to wait a bit before you do.",
      "Anger usually means something matters to you. That's worth noticing.",
      "A little space can help. You can come back to it when you're ready."
    ] }
  ];

  const box = $('#moods');
  const hug = $('#hug');
  const hugText = $('#hugText');
  const more = $('#more');
  const next = $('#next');
  const brLink = $('#brLink');
  let current = null, idx = 0;

    function showMessage() {
    hugText.textContent = current.msgs[idx % current.msgs.length];
    brLink.hidden = !['Anxious', 'Overwhelmed'].includes(current.name);
    hug.classList.remove('pop');
  }

  moods.forEach(m => {
    const b = document.createElement('button');
    b.className = 'mood';
    b.setAttribute('aria-pressed', 'false');
    b.textContent = m.name;
    b.onclick = () => {
      box.querySelectorAll('.mood').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      current = m;
      idx = Math.floor(Math.random() * m.msgs.length);
      more.hidden = false;
      showMessage();
      pet(m.say);          // does nothing visible here, there's no cheese on this page
    };
    box.appendChild(b);
  });

  more.onclick = () => { idx++; showMessage(); };

  // The › arrow scrolls the row and hides itself at the end
  function checkArrow() {
    next.hidden = box.scrollLeft + box.clientWidth >= box.scrollWidth - 4;
  }
  next.onclick = () => box.scrollBy({ left: box.clientWidth * .7, behavior: 'smooth' });
  box.addEventListener('scroll', checkArrow);
  addEventListener('resize', checkArrow);
  addEventListener('load', checkArrow);
  checkArrow();
}

// ===== TERMINAL + REACTION TEST (fun page only) =====
(function () {
  if (!$('#tOut')) return;
  const tOut = $('#tOut'), tIn = $('#tIn'), tBody = $('#tBody');
  const tGame = $('#tGame'), tGameText = $('#tGameText'), tGameSub = $('#tGameSub');
  const PROMPT = 'C:\\Users\\Visitor>';

  let history = [], pos = 0;
  let mode = null;            // null, 'wait', or 'go' (reaction game)
  let gameTimer, startTime, best = null;
  try { best = JSON.parse(localStorage.getItem('cheeze-best')); } catch (e) {}

  // ---------- helpers ----------
  const pick = list => list[Math.floor(Math.random() * list.length)];

  function print(text, cls) {
    const d = document.createElement('div');
    d.className = 'tl' + (cls ? ' ' + cls : '');
    d.textContent = text || '\u00a0';
    tOut.appendChild(d);
    tBody.scrollTop = tBody.scrollHeight;
  }

  function printHTML(html) {           // only used with text written by you
    const d = document.createElement('div');
    d.className = 'tl';
    d.innerHTML = html;
    tOut.appendChild(d);
    tBody.scrollTop = tBody.scrollHeight;
  }

  // ---------- content (edit these!) ----------
  const block = lines => lines.forEach(l => print(l));

  const RANDOM = [
    'Having 20 things to do and choosing to do none of them.',
    'The confidence after watching one tutorial is unmatched.',
    'Going into a room and immediately forgetting why.',
    'Saying “I’m almost ready” while still deciding what to wear.',
    'The urge to buy a notebook just to feel productive.',
    'A simple task somehow becoming a whole project.',
    'Having a favorite spoon and refusing to admit it.',
    'The relief of cancelling plans you didn’t really want to attend.',
    'Reading a message, thinking of a reply, then forgetting to send it.',
    'The floor is basically a temporary wardrobe.',
    'Starting a new series while having three unfinished ones.',
    'Somehow being tired after doing absolutely nothing.',
    'The panic when someone says “we need to talk.”',
    'Taking 50 pictures and liking absolutely none.',
    'A five-minute break turning into an unexpected vacation.',
    'Forgetting someone’s name immediately after being introduced.',
    'The sudden motivation to clean everything except the thing that needs cleaning.',
    'Having a whole argument in your head and winning.',
    'The struggle of finding something to watch for longer than actually watching it.',
    'Saying “no worries” while worrying.',
    'The charger is always just a little too far away.',
    'Being early but still somehow feeling late.',
    'The amount of effort it takes to reply to one message.',
    'Opening a new tab and forgetting what you were searching for.',
    'The best ideas arrive at the worst possible times.',
    'Getting hungry immediately after brushing your teeth.',
    'Trying to save money while online shopping.',
    'The excitement of ordering food followed by the longest wait of your life.',
    'Having a clean room for approximately 12 minutes.',
    'Doing one productive thing and feeling like the day is complete.'
  ];

  // shuffled "bag": every item shows once before any repeats
  let bag = [];
  function nextRandom() {
    if (!bag.length) {
      bag = RANDOM.map((t, i) => [i + 1, t]);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    return bag.pop();
  }

  // ---------- commands ----------
  const commands = {
    help() {
      print('Available commands:');
      print('');
      [['help', 'show available commands'], ['about', 'what this website is'],
       ['explore', 'browse the sections'], ['secret', 'find something hidden'],
       ['games', 'see available mini-games'], ['random', 'something unexpected'],
       ['whoami', 'your visitor profile'], ['credits', 'who made this'],
       ['contact', 'find me online'], ['reaction', 'test your reaction time'],
       ['clear', 'clear the terminal']]
        .forEach(([c, d]) => print(c.padEnd(11) + d));
    },
    about() {
      block(['This website started as a personal project.',
             'I wanted to learn, experiment, and make',
             'something of my own along the way.', '',
             'Still learning, still figuring things out,',
             'and occasionally fixing things I probably',
             'broke myself.']);
    },
    explore() {
      print('Here’s what’s waiting for you:');
      print('');
      printHTML('01. <a href="index.html">About Me</a>');
      printHTML('02. <a href="fun.html#mood">Current Status</a>');
      printHTML('03. <a href="index.html#questions">FAQ</a>');
      printHTML('04. <a href="index.html#note">A Quick Message</a>');
      printHTML('05. <a href="index.html#links">Find Me Online</a>');
      print('');
      print('Go have a look around!');
    },
    secret() {
      block(['You found the secret.', '',
             'There isn’t a prize.',
             'There isn’t even a reason for this message.', '',
             'But hey, good job being curious.']);
    },
    games() {
      block(['Currently available:', '',
             '01. Reaction Test',
             '    Find out how fast you can react.', '',
             'More games?',
             'Maybe. Let’s not get ahead of ourselves.']);
    },
    random() {
      const [num, text] = nextRandom();
      print(String(num).padStart(2, '0') + '. ' + text);
      print('');
      print('Type random again for another one.', 'dim');
    },
    whoami() {
      block(['User detected: Visitor', '',
             'Status: Curious',
             'Access level: Unreasonably nosy',
             'Current activity: Exploring this website', '',
             'Welcome. Make yourself at home.']);
    },
    credits() {
      block(['Created by: Me',
             'Built with: HTML, CSS & JavaScript, and Canva for the mockup',
             'Powered by: Curiosity and trial & error.']);
    },
    contact() {
      print('Want to find me elsewhere?');
      print('');
      printHTML('Instagram: <a href="https://www.instagram.com/chezcxaaaaa" target="_blank" rel="noopener">@chezcxaaaaa</a>');
      printHTML('GitHub: <a href="https://github.com/ChezcaZarina" target="_blank" rel="noopener">@ChezcaZarina</a>');
      printHTML('Other: <a href="index.html#links">see the Find Me section</a>');
      print('');
      print('Feel free to say hi!');
    },
    clear() { tOut.innerHTML = ''; print('Terminal cleared.', 'dim'); },
    reaction() { startGame(); },
    exit() { print('Nothing to exit. You’re already home.', 'dim'); },

    // easter eggs (hidden)
    cheese() { print('Gouda choice.', 'ok'); },
    sudo() { print('Nice try. You have no power here, only snacks.', 'err'); },
    hello() { print('Hi there!', 'ok'); },
    ver() { print('Cheeze OS [Version 1.0]'); },
    dir() {
      print(' Directory of C:\\Users\\Visitor', 'dim');
      ['snacks.txt', 'cheese.png', 'todo.txt (empty)', 'secret.txt  <- try the secret command'].forEach(f => print('  ' + f));
    }
  };
  commands.hi = commands.hello;

  // ---------- reaction game ----------
  function startGame() {
    mode = 'wait';
    print('Reaction test initialized...');
    print('Get ready...', 'dim');
    tGame.hidden = false;
    tGame.className = 'game';
    tGameText.textContent = 'WAIT FOR THE SIGNAL';
    tGameSub.textContent = 'Click only when the terminal tells you to!';
    tBody.scrollTop = tBody.scrollHeight;
    clearTimeout(gameTimer);
    gameTimer = setTimeout(() => {
      mode = 'go';
      tGame.classList.add('go');
      tGameText.textContent = 'CLICK NOW!';
      tGameSub.textContent = '';
      startTime = performance.now();
    }, 1500 + Math.random() * 2500);   // random wait: 1.5 to 4 seconds
  }

  function endGame() {
    clearTimeout(gameTimer);
    mode = null;
    tGame.hidden = true;
  }

  function hitGame() {
    if (mode === 'wait') {
      clearTimeout(gameTimer);
      mode = null;
      tGame.hidden = true;
      print('Too early! Wait for the signal.', 'err');
      print('Type reaction to try again, or exit to leave.', 'dim');
    } else if (mode === 'go') {
      const ms = Math.round(performance.now() - startTime);
      endGame();
      print('CLICK NOW!', 'ok');
      print('Reaction time: ' + ms + ' ms');
      if (best === null || ms < best) {
        best = ms;
        try { localStorage.setItem('cheeze-best', JSON.stringify(best)); } catch (e) {}
        print('New personal best!', 'ok');
      } else {
        print('Personal best: ' + best + ' ms', 'dim');
      }
      print('Type reaction to play again, or exit to leave.', 'dim');
    }
    tIn.focus();
  }

  tGame.addEventListener('click', hitGame);
  tGame.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hitGame(); }
  });

  // ---------- running a command ----------
  function suggest(word) {
    const names = Object.keys(commands);
    return names.filter(n => n.startsWith(word.slice(0, 2)) || n.includes(word) || word.includes(n));
  }

  function run(raw) {
    const input = raw.trim();
    print(PROMPT + ' ' + raw);
    if (!input) return;
    history.push(input);
    pos = history.length;
    const word = input.toLowerCase().split(/\s+/)[0];

    if (mode) {                                  // a game is running
      if (word === 'exit') { endGame(); print('Returned to the main terminal.', 'dim'); }
      else print('Reaction test is running. Click the game area, or type exit.', 'dim');
      return;
    }
    if (commands[word]) { commands[word](); return; }

    print('\'' + input + '\' is not recognized as an internal or external command,', 'err');
    print('operable program or batch file.', 'err');
    const maybe = suggest(word).slice(0, 3);
    print(maybe.length ? 'Did you mean: ' + maybe.join(', ') + '?' : 'Type help to see what you can do.', 'dim');
  }

  // ---------- input ----------
  tIn.addEventListener('keydown', e => {
    if (e.key === 'Enter') { run(tIn.value); tIn.value = ''; }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pos > 0) { pos--; tIn.value = history[pos]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (pos < history.length - 1) { pos++; tIn.value = history[pos]; }
      else { pos = history.length; tIn.value = ''; }
    }
  });

  tBody.addEventListener('click', e => {
    if (!e.target.closest('a') && !e.target.closest('.game') && !getSelection().toString()) tIn.focus();
  });

  $('#tChips').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) { run(b.dataset.c); }
  });

  // ---------- welcome message ----------
  print('Cheeze OS [Version 1.0]', 'dim');
  print('Welcome, Visitor! Type help to see what you can do.', 'ok');
  print('');
})();

// ===== SCROLL REVEAL + FAQ ACCORDION =====
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
            'section > h2, section > .sub, details, .moodrow, .hug, .term, .chips, .links a, .hero > div, .daycard, .daygo'
    );
    const seen = new Map();            // counts siblings so they appear one after another
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) en.target.classList.add('show');
        else en.target.classList.remove('show');     // reset when it leaves the screen
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => {
      const i = seen.get(el.parentElement) || 0;
      seen.set(el.parentElement, i + 1);
      el.style.setProperty('--d', Math.min(i, 3) * 0.04 + 's');
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // FAQ: smooth open/close, and opening one closes the others
  const faqs = [...document.querySelectorAll('#questions details')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = { duration: 320, easing: 'cubic-bezier(.4, 0, .2, 1)' };
  const running = new WeakMap();

  function slide(d, toOpen) {
    const from = d.offsetHeight;
    running.get(d)?.cancel();
    const frame = d.offsetHeight - d.clientHeight;
    d.style.overflow = 'hidden';
    d.dataset.closing = toOpen ? '' : '1';
    if (toOpen) d.open = true;
    const to = toOpen ? d.offsetHeight : d.querySelector('summary').offsetHeight + frame;

    const a = d.animate({ height: [from + 'px', to + 'px'] }, T);
    running.set(d, a);
    if (toOpen) {
      d.querySelector('p').animate(
        [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], T);
    }
    a.onfinish = () => {
      if (!toOpen) d.open = false;
      d.style.overflow = '';
      d.dataset.closing = '';
      running.delete(d);
    };
  }

  faqs.forEach(d => {
    d.querySelector('summary').addEventListener('click', e => {
      e.preventDefault();
      const opening = !d.open || d.dataset.closing === '1';
      if (reduceMotion) {
        faqs.forEach(o => { o.open = (o === d) ? opening : false; });
        return;
      }
      slide(d, opening);
      if (opening) faqs.forEach(o => {
        if (o !== d && o.open && o.dataset.closing !== '1') slide(o, false);
      });
    });
  });
})();

// ===== LINK TILES: tap to flip on touch screens =====
const tiles = document.querySelectorAll('.tile');
const canHover = matchMedia('(hover: hover)').matches;

tiles.forEach(t => {
  t.addEventListener('click', e => {
    if (canHover) return;                    // mouse users: hover handles it
    if (!t.classList.contains('flip')) {
      e.preventDefault();                    // first tap: flip, don't open yet
      tiles.forEach(x => x.classList.remove('flip'));
      t.classList.add('flip');
    }                                        // second tap: link opens normally
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.tile')) tiles.forEach(x => x.classList.remove('flip'));
});

// ===== HOME: TODAY CARD (greeting, week, quest, day meter) =====
if ($('#today')) {
  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const KEY = 'cheeze-done', RKEY = 'cheeze-rate';
  const QUESTS = [
    'Drink a glass of water.', 'Stretch for one minute.', 'Text someone you like.',
    'Step outside for five minutes.', 'Tidy one tiny corner.', 'Eat something that isn’t a snack.',
    'Put your phone down for ten minutes.', 'Write down one thing you’re looking forward to.',
    'Take three slow breaths.', 'Listen to one song all the way through.',
    'Say thanks to someone.', 'Fix one small thing you’ve been putting off.',
    'Do something just because it’s fun.', 'Go to bed a little earlier.'
  ];
  const LABELS = [ "I'm cooked.",
  "Not my day.",
  "Getting by.",
  "Pretty good.",
  "We're so back."];
  const REPLY = [  "Today really took it out of you. Hope you get a break.",
  "Could've gone better, honestly. Hopefully tomorrow's nicer.",
  "Nothing crazy, but we're getting through it.",
  "Okay, that's a decent day. We take those.",
  "Wait, a good day? Keep that energy going."];

  // saved on this device only
  let done = [], rates = {};
  try { done = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  try { rates = JSON.parse(localStorage.getItem(RKEY)) || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} };
  const saveRates = () => { try { localStorage.setItem(RKEY, JSON.stringify(rates)); } catch (e) {} };

  const key = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  function streak(now) {
    let s = 0;
    const d = new Date(now);
    if (!done.includes(key(d))) d.setDate(d.getDate() - 1);
    while (done.includes(key(d))) { s++; d.setDate(d.getDate() - 1); }
    return s;
  }

  function questFor(now) {
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    return QUESTS[dayOfYear % QUESTS.length];
  }

  // draggable cheese meter: the slider runs 0 to 500, each 100 is one level
  const meter = $('#meter');
  let dragging = false;

    // the label bubble that follows the cheese
  const tip = $('#tip');
  let tipTimer;

  function showTip(v) {
    const lv = Math.round(v / 100);
    if (!lv) { tip.classList.remove('show'); return; }   // no label when unrated
    const s = parseFloat(getComputedStyle(meter).getPropertyValue('--s')) || 64;
    tip.textContent = LABELS[lv - 1];
    tip.style.left = (s / 2 + (meter.clientWidth - s) * v / 500) + 'px';
    tip.classList.add('show');
  }

  // after letting go: keep the label visible for a moment, then hide it
  function flashTip() {
    showTip(meter.value);
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => tip.classList.remove('show'), 1200);
  }

    // draws the cheese with a mouth that goes from sad (0) to happy (500)
  function drawCheese(v) {
       const cy = (24 + v / 500 * 10).toFixed(1);   // mouth curve: 24 frowns, 34 smiles
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'>" +
      "<path d='M3 37V14Q3 11 6 10.5L34 4Q38 3.2 38 7V37Z' fill='#ffd978' stroke='#4a2c3f' stroke-width='2.5' stroke-linejoin='round'/>" +
      "<circle cx='30' cy='14' r='3.2' fill='#f2be4d'/><circle cx='32' cy='30' r='2.8' fill='#f2be4d'/><circle cx='8' cy='31' r='2.2' fill='#f2be4d'/>" +
      "<circle cx='14' cy='22' r='2.2' fill='#4a2c3f'/><circle cx='27' cy='22' r='2.2' fill='#4a2c3f'/>" +
      "<path d='M15.5 29Q20.5 " + cy + " 25.5 29' fill='none' stroke='#4a2c3f' stroke-width='2' stroke-linecap='round'/>" +
      "</svg>";
    meter.style.setProperty('--cheese', 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
  }

  meter.addEventListener('pointerdown', () => { dragging = true; clearTimeout(tipTimer); showTip(meter.value); });
  meter.addEventListener('pointerup', () => { dragging = false; });
  meter.addEventListener('pointercancel', () => { dragging = false; });

  // while dragging: the fill follows the cheese and the text previews the level
  meter.addEventListener('input', () => {
        drawCheese(meter.value);
    meter.style.setProperty('--p', meter.value / 5);
    const lv = Math.round(meter.value / 100);
        showTip(meter.value);
    $('#rMeta').textContent = lv ? REPLY[lv - 1] : 'Drag the cheese. No wrong answers.';
  });

  // on release: snap to the nearest level and save it
  meter.addEventListener('change', () => {
    dragging = false;
    const lv = Math.round(meter.value / 100);
    const k = key(new Date());
    if (lv) rates[k] = lv; else delete rates[k];
    saveRates();
    render();
        flashTip();
  });

  // keyboard: arrows move one level at a time
  meter.addEventListener('keydown', e => {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const k = key(new Date());
    const lv = Math.max(0, Math.min(5, (rates[k] || 0) + step));
    if (lv) rates[k] = lv; else delete rates[k];
    saveRates();
    render();
        flashTip();
  });
  

  function render() {
    const now = new Date(), h = now.getHours();
    let greet, line;
    if (h < 5)       { greet = 'Hello, night owl.'; line = 'Rest counts too.'; }
    else if (h < 12) { greet = 'Good morning.';     line = 'Hope today starts gently.'; }
    else if (h < 17) { greet = 'Good afternoon.';   line = 'Have you had a snack yet?'; }
    else if (h < 21) { greet = 'Good evening.';     line = 'You made it through another day.'; }
    else             { greet = 'Hello, night owl.'; line = 'Rest counts too.'; }

    $('#dHi').textContent = greet;
    $('#dNote').textContent = line;
    $('#dTime').textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    $('#dDate').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    // week strip, Monday to Sunday
    const mon = new Date(now);
    mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    let html = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      const cls = 'wd' + (d.toDateString() === now.toDateString() ? ' today' : '') + (done.includes(key(d)) ? ' done' : '');
      const r = rates[key(d)] || 0;
      html += '<div class="' + cls + '"><span>' + DAYS[d.getDay()] + '</span><b>' + d.getDate() + '</b><i class="rbar" style="--r:' + r / 5 + '"></i></div>';
    }
    $('#week').innerHTML = html;

    // the quest
    const isDone = done.includes(key(now));
    $('#qText').textContent = questFor(now);
    $('#qBtn').setAttribute('aria-pressed', isDone);
    const s = streak(now);
    $('#qMeta').textContent = s > 1
      ? s + ' days in a row. Nice.'
      : (isDone ? 'Done for today. Nicely done.' : 'Tap it when you’ve done it. Saved on this device.');

    // the meter
    if (!dragging) {
      const lv = rates[key(now)] || 0;
      meter.value = lv * 100;
      drawCheese(lv * 100);
      meter.style.setProperty('--p', lv * 20);
      meter.setAttribute('aria-valuetext', lv ? LABELS[lv - 1] : 'Not rated');
            $('#rMeta').textContent = lv ? REPLY[lv - 1] : 'Drag the cheese. No wrong answers.';
    }
  }

  $('#qBtn').addEventListener('click', () => {
    const k = key(new Date());
    done = done.includes(k) ? done.filter(x => x !== k) : done.concat(k);
    save();
    render();
  });

  render();
  setInterval(render, 30000);
}

// ===== FUN PAGE: COVERFLOW PANELS =====
if ($('#cfStage')) {
  const stage = $('#cfStage');
  const panels = [...stage.querySelectorAll('.panel')];
  const dotsBox = $('#cfDots');
  const n = panels.length;
  const SIZE = [1, .82, .68], FADE = [1, .45, .2];   // by distance from the center
  let active = 0, first = true;

  const dots = dotsBox ? panels.map((p, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Show panel ' + (i + 1));
    b.onclick = () => go(i);
    dotsBox.appendChild(b);
    return b;
  }) : [];

  function render() {
    const half = Math.floor(n / 2);
    panels.forEach((p, i) => {
      const d = ((i - active + n + half) % n) - half;   // -1 left, 0 center, 1 right (loops around)
      const a = Math.abs(d);
      const prev = +p.dataset.d;
      const snap = first || Math.abs(d - prev) > 1;      // a panel wrapping around jumps instead of flying across
      if (snap) p.style.transition = 'none';
      p.style.setProperty('--d', d);
      p.style.setProperty('--s', SIZE[a] ?? .6);
      p.style.setProperty('--o', FADE[a] ?? 0);
      p.style.zIndex = 3 - a;
      p.style.pointerEvents = a > 2 ? 'none' : '';
      p.classList.toggle('active', d === 0);
      if (p.tagName === 'A') p.tabIndex = d === 0 ? 0 : -1;
      p.dataset.d = d;
      if (snap) { void p.offsetWidth; p.style.transition = ''; }
    });
    dots.forEach((b, i) => b.setAttribute('aria-current', i === active));
    first = false;
  }

  function go(i) { active = (i + n) % n; render(); }

  $('#cfPrev').onclick = () => go(active - 1);
  $('#cfNext').onclick = () => go(active + 1);

  // clicking a side panel brings it to the center instead of opening it
  panels.forEach((p, i) => p.addEventListener('click', e => {
    if (i !== active) { e.preventDefault(); go(i); }
  }));

  // swipe / drag left and right
  let startX = null, moved = false;
  stage.addEventListener('pointerdown', e => { startX = e.clientX; moved = false; });
  stage.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) { moved = true; go(active + (dx < 0 ? 1 : -1)); }
  });
  stage.addEventListener('click', e => {               // a swipe shouldn't also open a link
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  render();
}

// ===== FUN PAGE: BREATHING CIRCLE =====
if ($('#br')) {
  const circle = $('#brCircle'), word = $('#brWord'), count = $('#brCount');
  const startBtn = $('#brStart'), meta = $('#brMeta');
  const modeBtns = [...document.querySelectorAll('#brModes .mood')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // each step: [what to say, seconds, how big the circle gets]
  const MODES = {
    calm:  [['Breathe in', 4, 1], ['Breathe out', 6, .55]],
    box:   [['Breathe in', 4, 1], ['Hold', 4, 1], ['Breathe out', 4, .55], ['Hold', 4, .55]],
    sleep: [['Breathe in', 4, 1], ['Hold', 7, 1], ['Breathe out', 8, .55]]
  };

  let mode = 'calm', running = false, step = 0, rounds = 0, left = 0, phaseTimer, tickTimer;

  function setScale(s, secs) {
    circle.style.transitionDuration = reduce ? '0s' : secs + 's';
    circle.style.transform = 'scale(' + s + ')';
  }

  function showRounds() {
    meta.textContent = rounds
      ? rounds + (rounds === 1 ? ' round' : ' rounds') + ' done. Nice.'
      : '';
  }

  function runPhase() {
    const [label, secs, target] = MODES[mode][step];
    word.textContent = label;
    circle.classList.toggle('hold', label === 'Hold');
    setScale(target, secs);

    left = secs;
    count.textContent = left;
    clearInterval(tickTimer);
    tickTimer = setInterval(() => { left--; if (left > 0) count.textContent = left; }, 1000);

    clearTimeout(phaseTimer);
    phaseTimer = setTimeout(() => {
      step++;
      if (step >= MODES[mode].length) { step = 0; rounds++; showRounds(); }
      runPhase();
    }, secs * 1000);
  }

  function start() {
    running = true;
    step = 0;
    rounds = 0;
    showRounds();
    startBtn.textContent = 'Stop';
    runPhase();
  }

  function stop() {
    running = false;
    clearTimeout(phaseTimer);
    clearInterval(tickTimer);
    circle.classList.remove('hold');
    setScale(.55, 1.2);
    word.textContent = 'Ready?';
    count.textContent = '';
    startBtn.textContent = 'Start';
    if (rounds) meta.textContent = rounds + (rounds === 1 ? ' round' : ' rounds') + '. Hope that helped.';
  }

  startBtn.addEventListener('click', () => running ? stop() : start());

  modeBtns.forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode;
    modeBtns.forEach(x => x.setAttribute('aria-pressed', x === b));
    if (running) { step = 0; runPhase(); }
  }));

  // stop if the tab is hidden, so it doesn't keep counting in the background
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) stop(); });
}

// ===== FUN PAGE: CHEESE CATCHER =====
if ($('#game')) {
  const canvas = $('#game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const FLOOR = H - 14;
  const SANS = '"Figtree", sans-serif', SERIF = '"Fraunces", serif', HAND = 'Caveat, cursive';

  // the mascot's body outline, reused for every cheese
  const CHEESE = new Path2D('M42 256 L42 170 Q42 150 62 146 L236 104 Q262 98 262 126 L262 256 Z');

  const plate = { x: W / 2, y: H - 40, w: 110, h: 14, pop: 0 };

  // ----- game state -----
  let state = 'ready';                  // 'ready', 'playing' or 'over'
  let score = 0, lives = 3, combo = 0;
  let cheeses = [], pops = [];          // cheese on screen, and little floating texts
  let spawnIn = 0, last = 0, overAt = 0, newBest = false, onScreen = true;

  let best = 0;                         // saved on this device, like your reaction time
  try { best = JSON.parse(localStorage.getItem('cheeze-catcher-best')) || 0; } catch (e) {}

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const multiplier = () => 1 + Math.min(3, Math.floor(combo / 5));   // x1, x2, x3, x4

  // ----- controls -----
  function movePlate(x) { plate.x = clamp(x, plate.w / 2, W - plate.w / 2); }

  function toGameX(e) {
    const r = canvas.getBoundingClientRect();
    return (e.clientX - r.left) * (W / r.width);     // screen pixels -> game pixels
  }

  function canStart() { return state !== 'playing' && performance.now() - overAt > 700; }

  canvas.addEventListener('pointermove', e => movePlate(toGameX(e)));
  canvas.addEventListener('pointerdown', e => {
    movePlate(toGameX(e));
    if (canStart()) start();
  });

  canvas.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); movePlate(plate.x - 40); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); movePlate(plate.x + 40); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (canStart()) start(); }
  });

  // only play while the game is on screen, so you don't lose lives while scrolled away
  new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; }, { threshold: 0.3 }).observe(canvas);

  // ----- game flow -----
  function start() {
    state = 'playing';
    score = 0; lives = 3; combo = 0;
    cheeses = []; pops = [];
    spawnIn = 0.6;
  }

  function gameOver() {
    state = 'over';
    overAt = performance.now();
    cheeses = [];
    newBest = score > best;
    if (newBest) {
      best = score;
      try { localStorage.setItem('cheeze-catcher-best', JSON.stringify(best)); } catch (e) {}
    }
  }

  function spawn() {
    const faster = Math.min(1 + score * 0.025, 2.2);   // the more you score, the faster it falls
    cheeses.push({
      x: 30 + Math.random() * (W - 60),
      y: -30,
      size: 40 + Math.random() * 14,
      speed: (90 + Math.random() * 60) * faster,
      rot: Math.random() * 6.28,
      spin: (Math.random() - .5) * 2
    });
  }

  function update(dt) {
    plate.pop = Math.max(0, plate.pop - dt * 4);
    pops.forEach(p => { p.y -= 40 * dt; p.life -= dt; });
    pops = pops.filter(p => p.life > 0);

    if (state !== 'playing' || !onScreen) return;

    spawnIn -= dt;
    if (spawnIn <= 0) {
      spawn();
      spawnIn = Math.max(0.45, 1.3 - score * 0.015) * (0.8 + Math.random() * 0.5);
    }

    cheeses = cheeses.filter(c => {
      c.y += c.speed * dt;
      c.rot += c.spin * dt;
      const bottom = c.y + c.size * 0.35;

      // caught: its bottom reached the plate, and it's above the plate's top, and over the plate
      if (bottom >= plate.y && c.y < plate.y + plate.h &&
          Math.abs(c.x - plate.x) < plate.w / 2 + c.size * 0.3) {
        combo++;
        const m = multiplier();
        score += m;
        plate.pop = 1;
        pops.push({ x: c.x, y: plate.y - 10, text: '+' + m, life: 0.8 });
        return false;                                   // false = remove this cheese
      }

      // missed: it hit the floor
      if (bottom >= FLOOR) {
        lives--;
        combo = 0;
        pops.push({ x: c.x, y: FLOOR - 10, text: 'miss', life: 0.8, bad: true });
        return false;
      }
      return true;                                      // still falling, keep it
    });

    if (lives <= 0) gameOver();
  }

  // ----- drawing -----
  function dot(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCheese(c) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    const s = c.size / 220;
    ctx.scale(s, s);
    ctx.translate(-152, -180);

    ctx.fillStyle = '#ffd978';
    ctx.fill(CHEESE);
    ctx.lineWidth = 10;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#4a2c3f';
    ctx.stroke(CHEESE);

    dot(226, 150, 17, '#f2be4d');
    dot(74, 236, 12, '#f2be4d');
    dot(122, 196, 13, '#4a2c3f');
    dot(186, 196, 13, '#4a2c3f');
    ctx.restore();
  }

  function write(str, x, y, font, color, align) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.fillText(str, x, y);
  }

  function hud() {
    write('Score ' + score, 16, 30, '700 20px ' + SANS, '#ffeef3');
    write('Best ' + best, W - 16, 30, '700 16px ' + SANS, '#c9a9b9', 'right');
    for (let i = 0; i < lives; i++) drawCheese({ x: W / 2 - 40 + i * 40, y: 24, size: 28, rot: 0 });
    if (combo >= 5) write('x' + multiplier() + ' combo!', W / 2, 64, '700 26px ' + HAND, '#ffd978', 'center');
  }

  function overlay() {
    ctx.fillStyle = 'rgba(27, 16, 34, .78)';
    ctx.fillRect(0, 0, W, H);
    if (state === 'ready') {
      write('Cheese Catcher', W / 2, 150, '400 46px ' + SERIF, '#ffeef3', 'center');
      write('Catch the cheese. Three misses and it’s over.', W / 2, 190, '400 18px ' + SANS, '#c9a9b9', 'center');
      if (best) write('Best: ' + best, W / 2, 224, '700 18px ' + SANS, '#ffd978', 'center');
      write('tap to start', W / 2, 276, '700 32px ' + HAND, '#ffd978', 'center');
    } else {
      write('Game over', W / 2, 140, '400 46px ' + SERIF, '#ffeef3', 'center');
      write('Score ' + score + '  ·  Best ' + best, W / 2, 184, '700 20px ' + SANS, '#c9a9b9', 'center');
      if (newBest) write('New best!', W / 2, 222, '700 30px ' + HAND, '#ffd978', 'center');
      write('tap to play again', W / 2, 276, '700 32px ' + HAND, '#ffd978', 'center');
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(255, 217, 120, .15)';
    ctx.fillRect(0, FLOOR, W, 14);

    cheeses.forEach(drawCheese);

    ctx.fillStyle = plate.pop > .3 ? '#ffd978' : '#ffeef3';   // flashes yellow when you catch
    ctx.beginPath();
    ctx.roundRect(plate.x - plate.w / 2, plate.y + plate.pop * 3, plate.w, plate.h, 8);
    ctx.fill();

    pops.forEach(p => {
      ctx.globalAlpha = Math.min(1, p.life / .4);
      write(p.text, p.x, p.y, '700 22px ' + SANS, p.bad ? '#ff9ebb' : '#ffd978', 'center');
    });
    ctx.globalAlpha = 1;

    if (state === 'playing') hud(); else overlay();
  }

  // ----- the loop -----
  function loop(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(t => { last = t; loop(t); });
}