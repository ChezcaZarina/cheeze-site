const $ = s => document.querySelector(s);
const eyes = [...document.querySelectorAll('.eye')];
const svg = $('#cheese');

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

// Petting the cheese
const lines = ['Hehe, that tickles!', 'Have you had a snack today?', 'You’re doing okay.', 'Boop!', 'More pets, please.', 'Drink some water.', 'Rest counts too.'];
let n = 0, timer;

function pet(text) {
  document.body.classList.remove('hop');
  void document.body.offsetWidth;
  document.body.classList.add('hop');
  $('#say').textContent = typeof text === 'string' ? text : lines[n++ % lines.length];
  clearTimeout(timer);
  timer = setTimeout(() => document.body.classList.remove('hop'), 1200);
}

svg.addEventListener('click', () => pet());
svg.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pet(); }
});

// ===== ENVELOPE =====
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

// ===== MOOD CHECK-IN =====
const moods = [
  { name: 'Happy', say: 'Yay! Me too!', msgs: [
    'I’m so glad. Let yourself soak it in for a minute.',
    'Good days count. Notice this one.',
    'Your happy is welcome here. Save a little of it for later.' ] },
  { name: 'Overwhelmed', say: 'One thing at a time.', msgs: [
    'Pick just one tiny thing. Everything else can wait.',
    'You don’t have to do it all today. Really.',
    'Pause. Unclench your shoulders. You’re doing better than you think.' ] },
  { name: 'Anxious', say: 'I’m right here.', msgs: [
    'Try one slow breath in, and a longer one out. You’re safe in this moment.',
    'You don’t have to solve everything right now. Just the next small thing.',
    'Worries feel loud, but they aren’t always true. You’ve gotten through hard days before.' ] },
  { name: 'Alone', say: 'I’m right here.', msgs: [
    'You’re not as alone as it feels. I’m glad you’re here.',
    'Feeling lonely doesn’t mean something is wrong with you. It means you want connection, and that’s human.',
    'Maybe send one small message to someone you trust. Or just stay here a while.' ] },
  { name: 'Sad', say: 'Sending a big squish.', msgs: [
    'It’s okay to feel this. You don’t have to hurry it along.',
    'I’m sorry it hurts today. You’re not alone with it.',
    'Soft days are allowed. Be as kind to yourself as you would to a friend.' ] },
  { name: 'Tired', say: 'Sleepy cheese hugs.', msgs: [
    'Being tired is a signal, not a failure. Rest is allowed.',
    'You’ve been carrying a lot. You can put some of it down.',
    'Water, a stretch, maybe a nap. Be gentle with yourself.' ] }
];

const box = $('#moods');
const hug = $('#hug');
const hugText = $('#hugText');
const more = $('#more');
const next = $('#next');
let current = null, idx = 0;

function showMessage() {
  hugText.textContent = current.msgs[idx % current.msgs.length];
  hug.classList.remove('pop');
  void hug.offsetWidth;
  hug.classList.add('pop');
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
    pet(m.say);
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

(function () {
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
      printHTML('01. <a href="#top">About Me</a>');
      printHTML('02. <a href="#mood">Current Status</a>');
      printHTML('03. <a href="#questions">FAQ</a>');
      printHTML('04. <a href="#note">A Quick Message</a>');
      printHTML('05. <a href="#links">Find Me Online</a>');
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
      printHTML('Other: <a href="#links">see the Find Me section</a>');
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
      'section > h2, section > .sub, details, .moodrow, .hug, .term, .chips, .links a, .hero > div'
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
    const from = d.offsetHeight;                 // where it is right now
    running.get(d)?.cancel();                    // stop any animation in progress
    const frame = d.offsetHeight - d.clientHeight;   // the border thickness
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
      e.preventDefault();                        // we handle opening ourselves
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