(function () {
  'use strict';

  /* ── CURSOR ── */
  var cDot  = document.getElementById('cDot');
  var cH    = document.getElementById('cH');
  var cV    = document.getElementById('cV');
  var cRing = document.getElementById('cRing');

  if (cDot && cH && cV && cRing && !window._CP_CURSOR) {
    window._CP_CURSOR = true;
    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cDot.style.transform = 'translate3d(' + (mx - 2.5) + 'px,' + (my - 2.5) + 'px,0)';
      cH.style.transform   = 'translate3d(' + (mx - 11)  + 'px,' + (my - .5)  + 'px,0)';
      cV.style.transform   = 'translate3d(' + (mx - .5)  + 'px,' + (my - 11)  + 'px,0)';
    });

    (function rl(now) {
      var dt = Math.min((now - (rl.t = rl.t || now)) / 16.667, 3); rl.t = now;
      var s  = 1 - Math.pow(0.88, dt);
      rx += (mx - rx) * s; ry += (my - ry) * s;
      cRing.style.transform = 'translate3d(' + (rx - 18) + 'px,' + (ry - 18) + 'px,0)';
      requestAnimationFrame(rl);
    })(performance.now());

    var hoverOn  = document.body.dataset.cursorAccent || 'rgba(0,245,255,.9)';
    var hoverOff = document.body.dataset.cursorBase   || 'rgba(0,245,255,.55)';
    var hoverSel = 'a,.ccard,.lcrd,.skill-card,.gang-card,.wcard,.cc,.gc,.rcard,.mp-wrap,button,.show-more-btn';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverSel)) {
        cRing.style.width = '54px'; cRing.style.height = '54px'; cRing.style.borderColor = hoverOn;
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverSel)) {
        cRing.style.width = '36px'; cRing.style.height = '36px'; cRing.style.borderColor = hoverOff;
      }
    });
  }

  /* ── MATRIX RAIN ── */
  var cv = document.getElementById('rain');
  if (cv) {
    var ctx    = cv.getContext('2d');
    var col1   = cv.dataset.rainColor     || '#00f5ff';
    var col2   = cv.dataset.rainSecondary || null;
    var chance = parseFloat(cv.dataset.rainSecondaryChance || '0');
    var CHARS  = '01アイウカキクコサシスタチツナニネノ!@#$%&ABCDEF9876543210';
    var FS     = 13;
    var drops  = [];

    function rsz() { cv.width = innerWidth; cv.height = innerHeight; }
    rsz(); addEventListener('resize', rsz);

    function initDrops() {
      var cols = Math.floor(cv.width / FS);
      drops = [];
      for (var i = 0; i < cols; i++) {
        drops.push({
          x: i * FS,
          y: Math.random() * -cv.height,
          spd: Math.random() * .9 + .35,
          len: Math.floor(Math.random() * 22) + 6,
          col: (col2 && Math.random() < chance) ? col2 : col1,
          chars: Array.from({ length: 35 }, function () { return CHARS[Math.floor(Math.random() * CHARS.length)]; })
        });
      }
    }
    initDrops(); addEventListener('resize', initDrops);

    (function rainLoop() {
      ctx.fillStyle = 'rgba(6,6,9,.12)';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = FS + 'px monospace';
      drops.forEach(function (d) {
        for (var j = 0; j < d.len; j++) {
          var y = d.y - j * FS;
          if (y < -FS || y > cv.height) continue;
          var a = Math.max(0, 1 - j / d.len);
          if (j === 0)     ctx.fillStyle = '#ffffff';
          else if (j < 3)  ctx.fillStyle = d.col;
          else              ctx.fillStyle = d.col + Math.floor(a * 180).toString(16).padStart(2, '0');
          if (Math.random() < .06) d.chars[j] = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillText(d.chars[j], d.x, y);
        }
        d.y += d.spd;
        if (d.y - d.len * FS > cv.height) {
          d.y = 0; d.spd = Math.random() * .9 + .35;
          d.len = Math.floor(Math.random() * 22) + 6;
          d.col = (col2 && Math.random() < chance) ? col2 : col1;
        }
      });
      requestAnimationFrame(rainLoop);
    })();
  }

  /* ── SCROLL REVEAL ── */
  var rvObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .1 });
  document.querySelectorAll('.rv').forEach(function (el) { rvObs.observe(el); });

  /* ── STATS BARS (character pages) ── */
  if (document.querySelector('.sbar-item')) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var fill = e.target.querySelector('.sbar-fill');
          if (fill && !fill.dataset.done) { fill.dataset.done = '1'; fill.style.width = fill.dataset.pct + '%'; }
        }
      });
    }, { threshold: .5 });
    document.querySelectorAll('.sbar-item').forEach(function (el) { barObs.observe(el); });
  }

  /* ── HAMBURGER ── */
  (function () {
    if (window._CP_BURGER) return; window._CP_BURGER = true;
    var burger   = document.getElementById('navBurger');
    var mobNav   = document.getElementById('mobNav');
    var closeBtn = document.getElementById('mobNavClose');
    if (!burger || !mobNav) return;

    function closeMenu() {
      burger.classList.remove('open');
      mobNav.classList.remove('open');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', function () {
      var open = mobNav.classList.contains('open');
      burger.classList.toggle('open');
      mobNav.classList.toggle('open');
      document.body.style.overflow = open ? '' : 'hidden';
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    mobNav.querySelectorAll('.mob-nav-link, a').forEach(function (a) { a.addEventListener('click', closeMenu); });

    var page = location.pathname.split('/').pop() || 'index.html';
    mobNav.querySelectorAll('[href]').forEach(function (a) {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });
  })();

  /* ── MUSIC PLAYER ── */
  (function () {
    if (window._CP_MUSIC) return; window._CP_MUSIC = true;
    var mpWrap  = document.getElementById('mpWrap');
    var mpBtn   = document.getElementById('mpBtn');
    var mpTitle = document.getElementById('mpTitle');
    var iframe  = document.getElementById('ytIframe');
    if (!mpWrap || !mpBtn || !iframe) return;

    var isPlaying = false;
    var LS = 'cp_music';

    function ytCmd(fn) {
      try { iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: fn, args: [] }), 'https://www.youtube.com'); } catch (e) {}
    }
    function setPlay(p) {
      isPlaying = p;
      mpBtn.innerHTML = p ? '&#9646;&#9646;' : '&#9654;';
      p ? mpWrap.classList.add('playing') : mpWrap.classList.remove('playing');
      try { localStorage.setItem(LS, p ? '1' : '0'); } catch (e) {}
    }

    mpBtn.addEventListener('click', function () {
      if (isPlaying) { ytCmd('pauseVideo'); setPlay(false); }
      else           { ytCmd('playVideo');  setPlay(true); }
    });

    setTimeout(function () {
      if (!mpTitle) return;
      var wrap = mpTitle.parentElement;
      if (mpTitle.scrollWidth > wrap.clientWidth + 4) {
        mpTitle.style.setProperty('--scroll-dist', -(mpTitle.scrollWidth - wrap.clientWidth + 10) + 'px');
        mpTitle.classList.add('scrolling');
      }
    }, 400);

    try {
      if (localStorage.getItem(LS) === '1') {
        setTimeout(function () { ytCmd('playVideo'); setPlay(true); }, 2500);
      }
    } catch (e) {}
  })();

})();
