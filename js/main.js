(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     NAV — scroll state + mobile menu
     ============================================================ */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ============================================================
     HERO ROLE ROTATOR
     ============================================================ */
  var roles = ['Data Analytics', 'AI / ML', 'Software Development', 'Robotics'];
  var track = document.getElementById('rolesTrack');

  if (track) {
    var i = 0;
    function showRole(idx) {
      track.style.transition = reduceMotion ? 'none' : 'transform .6s cubic-bezier(.16,.84,.44,1), opacity .5s ease';
      track.style.opacity = '0';
      track.style.transform = 'translateY(10px)';
      setTimeout(function () {
        track.innerHTML = '<span>' + roles[idx] + '</span>';
        track.style.transform = 'translateY(-6px)';
        requestAnimationFrame(function () {
          track.style.opacity = '1';
          track.style.transform = 'translateY(0)';
        });
      }, reduceMotion ? 0 : 260);
    }
    showRole(0);
    if (!reduceMotion) {
      setInterval(function () {
        i = (i + 1) % roles.length;
        showRole(i);
      }, 2600);
    } else {
      setInterval(function () {
        i = (i + 1) % roles.length;
        track.innerHTML = '<span>' + roles[i] + '</span>';
      }, 3200);
    }
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ============================================================
     MAGNETIC BUTTONS (subtle)
     ============================================================ */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.18 + 'px,' + y * 0.35 + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ============================================================
     HERO NODE-NETWORK CANVAS
     Subtle "data -> AI -> solution" motif: drifting connected nodes.
     ============================================================ */
  var canvas = document.getElementById('heroCanvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var hero = canvas.closest('.hero');
    var W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [];
    var NODE_COUNT = 46;
    var LINK_DIST = 150;
    var raf;

    function resize() {
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function makeNodes() {
      nodes = [];
      for (var n = 0; n < NODE_COUNT; n++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);

      for (var a = 0; a < nodes.length; a++) {
        var p = nodes[a];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      for (var i2 = 0; i2 < nodes.length; i2++) {
        for (var j = i2 + 1; j < nodes.length; j++) {
          var dx = nodes[i2].x - nodes[j].x;
          var dy = nodes[i2].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = 'rgba(198,161,91,' + (0.14 * (1 - dist / LINK_DIST)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i2].x, nodes[i2].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (var k = 0; k < nodes.length; k++) {
        var pt = nodes[k];
        ctx.fillStyle = 'rgba(217,186,124,0.55)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    resize();
    makeNodes();

    if (!reduceMotion) {
      step();
    } else {
      // draw a single static frame
      step();
      cancelAnimationFrame(raf);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        makeNodes();
      }, 200);
    });
  }

  /* ============================================================
     MINI NODE GRAPH — used inside the Caretroid project mockup
     ============================================================ */
  var mockNode = document.getElementById('mockNode');
  if (mockNode) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 320 140');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '140');
    svg.style.display = 'block';

    var pts = [
      [30, 70], [90, 30], [90, 110], [160, 70], [230, 30], [230, 110], [290, 70]
    ];
    var links = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6]];

    links.forEach(function (l) {
      var line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', pts[l[0]][0]);
      line.setAttribute('y1', pts[l[0]][1]);
      line.setAttribute('x2', pts[l[1]][0]);
      line.setAttribute('y2', pts[l[1]][1]);
      line.setAttribute('stroke', 'rgba(217,186,124,0.35)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    });

    pts.forEach(function (p, idx) {
      var c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', p[0]);
      c.setAttribute('cy', p[1]);
      c.setAttribute('r', idx === 3 ? 6 : 4);
      c.setAttribute('fill', idx === 3 ? '#D9BA7C' : 'rgba(217,186,124,0.6)');
      svg.appendChild(c);
    });

    mockNode.appendChild(svg);
  }

  /* ============================================================
     RESUME PREVIEW MODAL
     ============================================================ */
  var resumeModal = document.getElementById('resumeModal');
  var closeResumeModalBtn = document.getElementById('closeResumeModal');
  var openResumeBtns = document.querySelectorAll('[data-open-resume]');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openResumeBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openResumeModal();
    });
  });

  if (closeResumeModalBtn) {
    closeResumeModalBtn.addEventListener('click', closeResumeModal);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', function (e) {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
        closeResumeModal();
      }
    });
  }

})();
