/* Memorial – Đào Huy Việt | app.js */
(function () {
  'use strict';

  /* ── CONFIG ── */
  const SECTIONS_CONFIG = [
    { id:'P1', icon:'🌱', badge:'Giai đoạn 1', title:'Thời Tuổi Trẻ & 34 Năm Công Tác',           period:'1934 — 1988',           navLabel:'1. Tuổi trẻ (1934-1988)' },
    { id:'P2', icon:'💒', badge:'Giai đoạn 2', title:'Lập Gia Đình & Xây Đắp Mái Ấm',              period:'1955 — 2001',           navLabel:'2. Gia đình (1955-2001)' },
    { id:'P3', icon:'👶', badge:'Giai đoạn 3', title:'Vui Vầy Bên Con Cháu (Phần 1)',              period:'2002 — 2007',           navLabel:'3. Con cháu I (2002-2007)' },
    { id:'P4', icon:'🎈', badge:'Giai đoạn 4', title:'Bên Cháu Yêu Thương (Phần 2)',               period:'2008 — 2010',           navLabel:'4. Con cháu II (2008-2010)' },
    { id:'P5', icon:'🏠', badge:'Giai đoạn 5', title:'Với Họ Hàng & Những Ngôi Nhà Kỷ Niệm', period:'Đa thời kỳ (1966 — 2020)', navLabel:'5. Ngôi nhà & Họ hàng' }
  ];

  /* ── DOM ── */
  const $  = id => document.getElementById(id);
  const $timeline  = $('timeline-content');
  const $navLinks  = $('nav-links');
  const $nav       = $('main-nav');
  const $navToggle = $('nav-toggle');
  const $lightbox  = $('lightbox');
  const $lbImg     = $('lightbox-img');
  const $lbCaption = $('lightbox-caption');
  const $lbCounter = $('lightbox-counter');

  /* ── STATE ── */
  let allImages = [], curIdx = -1, ytPlayer = null, isPlaying = false;

  /* ── UTILS ── */
  function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* ── INIT ── */
  async function init() {
    // Progress bar
    const bar = Object.assign(document.createElement('div'), { className: 'scroll-progress' });
    document.body.appendChild(bar);

    // Back-to-top
    const btn = Object.assign(document.createElement('button'), {
      className: 'back-to-top',
      title: 'Về đầu trang',
      innerHTML: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
    });
    btn.setAttribute('aria-label', 'Về đầu trang');
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);

    try {
      const data = window.MEMORIAL_DATA || await fetch('data.json').then(r => r.json());
      renderTimeline(data);
      buildNav();
      initObservers();
      initScroll(bar, btn);
      initLightbox();
      initMusic();
      $navToggle.addEventListener('click', () => {
        $navToggle.classList.toggle('open');
        $navLinks.classList.toggle('open');
      });
      const si = $('scroll-indicator');
      if (si) si.addEventListener('click', () => $('intro-section')?.scrollIntoView({ behavior:'smooth' }));
    } catch (err) {
      console.error('Lỗi nạp dữ liệu:', err);
      $timeline.innerHTML = '<div style="text-align:center;padding:5rem 1.5rem;color:#5A5450"><p style="font-size:1.2rem">Không thể nạp dữ liệu. Vui lòng làm mới trang.</p></div>';
    }
  }

  /* ── RENDER TIMELINE ── */
  function renderTimeline(data) {
    $timeline.innerHTML = '';
    allImages = [];

    data.forEach((section, si) => {
      const cfg = SECTIONS_CONFIG.find(c => c.id === section.id) || { icon:'📷', badge:`Phần ${si+1}`, title: section.title, period:'', navLabel: section.title };
      const el = document.createElement('section');
      el.className = 'timeline-section';
      el.id = 'section-' + section.id;

      let h = `<div class="section-inner">
        <div class="section-header fade-in">
          <span class="section-number">${cfg.icon} ${cfg.badge}</span>
          <h2 class="section-title">${esc(cfg.title)}</h2>
          ${cfg.period ? `<p class="section-period">${esc(cfg.period)}</p>` : ''}
        </div>`;

      buildBlocks(section).forEach(block => {
        if (block.year) {
          const yid = String(block.year).replace(/[^0-9]/g, '');
          h += `<div class="timeline-year-node fade-in" id="year-${yid}">
            <div class="timeline-year-badge"><span class="badge-icon">⏳</span><span class="badge-year">Năm ${esc(block.year)}</span></div>
          </div>`;
        }
        h += `<div class="slide-card fade-in">`;
        if (block.title) h += `<h3 class="slide-title">${esc(block.title)}</h3>`;
        if (block.lead)  h += `<div class="block-lead">${esc(block.lead)}</div>`;

        if (block.photos?.length) {
          h += '<div class="photo-grid">';
          block.photos.forEach(item => {
            const src = 'assets/images/' + item.img;
            const caption = item.caption || block.title || cfg.title;
            const idx = allImages.length;
            allImages.push({ src, caption, year: block.year });

            let cardCap = '';
            if (item.texts?.length) {
              if (item.texts.length === 1) {
                const t = item.texts[0].trim();
                if (t && t !== block.year && !block.title.includes(t))
                  cardCap = t.length > 85 ? t.slice(0,83)+'...' : t;
              } else {
                const title = item.texts[0].trim();
                const desc  = item.texts.slice(1).join(' ').trim();
                const combo = (title && !desc.toLowerCase().startsWith(title.toLowerCase())) ? `${title}: ${desc}` : (desc || title);
                cardCap = combo.length > 95 ? combo.slice(0,92)+'...' : combo;
              }
            }
            h += `<div class="photo-card" data-idx="${idx}" title="Nhấp để phóng to ảnh">
              <div class="photo-thumb-wrapper">
                <img src="${esc(src)}" alt="${esc(caption)}" loading="lazy">
                <div class="photo-overlay"><span class="zoom-icon">🔍 Phóng to</span></div>
              </div>
              ${cardCap ? `<div class="photo-card-caption">${esc(cardCap)}</div>` : ''}
            </div>`;
          });
          h += '</div>';
        }
        h += '</div>'; // slide-card
      });

      h += '</div>'; // section-inner
      el.innerHTML = h;
      $timeline.appendChild(el);
    });
  }

  /* ── BUILD BLOCKS ── */
  function mkBlock(title, year, lead) { return { title, year, lead, photos: [] }; }
  function pushPhotos(sl, block) {
    const cap = sl.texts.length ? sl.texts.join(' — ') : '';
    sl.images.forEach(img => block.photos.push({ img, caption: cap, texts: sl.texts }));
  }

  function buildBlocks(sec) {
    const id = sec.id;

    if (id === 'P1') {
      const b1 = mkBlock('Thời Tuổi Trẻ & Gia Thế Dòng Họ Đào', '1934 – 1954',
        'Gia thế họ Đào, thuở thiếu thời tự lập học nghề đúc tiện từ năm 13 tuổi, xưởng Hợp Hưng tại 42 Nguyễn Thiệp và biến cố phân ly năm 1954 khi gia đình vào Nam.');
      const b2 = mkBlock('34 Năm Bền Bỉ Cống Hiến Cho Quân Đội & Đất Nước', '1955 – 1988',
        'Từ thợ kỹ thuật xưởng Đại tu ô tô đến Công nhân Quốc phòng Tổng cục Kỹ thuật Bộ Quốc phòng; đạt bậc 7/7 thợ kỹ thuật cao quý cùng nhiều huân huy chương vẻ vang.');
      sec.slides.forEach(sl => pushPhotos(sl, sl.slide_num <= 10 ? b1 : b2));
      return [b1, b2];
    }

    if (id === 'P2') {
      const b1 = mkBlock('Tìm Hiểu & Lễ Cưới Phố Cổ', '1955 – 1957',
        'Mối tình chớm nở đầu những năm 50 và đám cưới đầu năm 1957 tại phòng cưới Nguyên Sinh phố Thuốc Bắc; lễ đón dâu và tiệc trà tại 38 Nguyễn Thiệp.');
      const b2 = mkBlock('Sinh Con & Những Năm Tháng Đầu Tiên', '1957 – 1976',
        'Ba người con lần lượt chào đời: Khánh Hòa (1957), Kim Chi (1959), Đình Khả (1964); ảnh gia đình Tết Bính Thìn 1976.');
      const b3 = mkBlock('Đại Đoàn Tụ & Con Cái Trưởng Thành', '1976 – 2001',
        'Năm 1976 vào Sài Gòn gặp lại Ông Bà nội sau 22 năm cách biệt; các con dựng vợ gả chồng, những dịp Tết sum vầy ấm cúng.');
      sec.slides.forEach(sl => {
        const b = sl.slide_num <= 12 ? b1 : sl.slide_num <= 19 ? b2 : b3;
        pushPhotos(sl, b);
      });
      return [b1, b2, b3];
    }

    if (id === 'P3') {
      const ys = ['2002','2003','2004','2005','2006','2007'];
      const leads = {
        '2002':'Hai cháu ngoại về nước ở với ông bà tại 16 Võ Văn Dũng; đón thêm cháu nội ở Nhật về.',
        '2003':'Kỷ niệm chuyến đi Sầm Sơn của Ba Mẹ và những ngày tháng sum vầy hạnh phúc.',
        '2004':'Kỷ niệm tại ngôi nhà 27A1 Hoàng Cầu cùng các cháu thân yêu.',
        '2005':'Ba đón cháu đích tôn; kỷ niệm đón giao thừa tại Big C ngày 31/12/2005.',
        '2006':'Những khoảnh khắc ấm áp, rộn rã tiếng cười của Ba Mẹ bên đàn cháu nhỏ.',
        '2007':'Sinh nhật Bambi, Chick, Cúc và chuyến dã ngoại đầy kỷ niệm tại Sóc Sơn.'
      };
      const map = Object.fromEntries(ys.map(y => [y, mkBlock(`Vui Vầy Bên Con Cháu – Năm ${y}`, y, leads[y])]));
      let cur = '2002';
      sec.slides.forEach(sl => {
        if (sl.texts.length) { const f = ys.find(y => sl.texts[0].includes(y)); if (f) cur = f; }
        pushPhotos(sl, map[cur]);
      });
      return Object.values(map);
    }

    if (id === 'P4') {
      const ys = ['2008','2009','2010'];
      const leads = {
        '2008':'Sinh nhật Tấn, sinh nhật Miu và những ngày tháng đầy ắp yêu thương bên các cháu.',
        '2009':'Đi chơi ngày Quốc tế Thiếu nhi 1/6 tại Công viên Thủ Lệ, sinh nhật Ngan, dã ngoại Cọ Xanh ngày 2/9.',
        '2010':'Những khoảnh khắc sum vầy cuối cùng tràn ngập nụ cười và tình cảm của Ba bên đàn con cháu.'
      };
      const map = Object.fromEntries(ys.map(y => [y, mkBlock(`Bên Cháu Yêu Thương – Năm ${y}`, y, leads[y])]));
      let cur = '2008';
      sec.slides.forEach(sl => {
        if (sl.texts.length) { const f = ys.find(y => sl.texts[0].includes(y)); if (f) cur = f; }
        pushPhotos(sl, map[cur]);
      });
      return Object.values(map);
    }

    if (id === 'P5') {
      const b1 = mkBlock('Kỷ Niệm Bên Họ Hàng Thân Tộc', 'Họ Hàng',
        'Tình cảm gắn bó keo sơn với gia đình nội ngoại, họ hàng thân thiết qua bao thế hệ; thăm nhà Tuấn Huyền năm 2010.');
      const b2 = mkBlock('Ký Ức Trận Bom Phố Nguyễn Thiếp & Các Lần Chuyển Nhà', '1966 – 1991',
        'Trưa ngày 13/12/1966, bom Mỹ dội phố Nguyễn Thiếp làm sập nhà 23A, Ba thoát chết trong gang tấc nhờ trú hầm Hàng Đậu; xây lại nhà năm 1974-1977 và những lần chuyển tổ ấm đến Linh Lang, Cống Vị năm 1991.');
      const b3 = mkBlock('Ngôi Nhà 16 Võ Văn Dũng & Hai Cây Xoài Kỷ Niệm', '1997 – Nay',
        'Năm 1997, Ba mẹ chuyển nhà về 16 Võ Văn Dũng. Hai cây xoài Ba trồng trước cửa nhà năm 1997-1998, đến năm 2019 đã cao lớn bằng tòa nhà 4 tầng, rợp bóng mát yêu thương qua bao năm tháng.');
      sec.slides.forEach(sl => {
        const b = sl.slide_num <= 8 ? b1 : sl.slide_num <= 15 ? b2 : b3;
        pushPhotos(sl, b);
      });
      return [b1, b2, b3];
    }

    return [];
  }

  /* ── NAVIGATION ── */
  function buildNav() {
    let h = `<li><a href="#hero" data-target="hero">Trang đầu</a></li>
      <li><a href="#intro-section" data-target="intro-section">Giới thiệu & Mục đích</a></li>`;
    SECTIONS_CONFIG.forEach(c => { h += `<li><a href="#section-${c.id}" data-target="section-${c.id}">${esc(c.navLabel)}</a></li>`; });
    h += `<li><a href="#closing-memorial" data-target="closing-memorial">Lời Tri Ân (2020)</a></li>`;
    $navLinks.innerHTML = h;

    $navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const el = document.getElementById(a.dataset.target);
        if (el) {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - ($nav.offsetHeight || 62), behavior: 'smooth' });
          $navLinks.classList.remove('open');
          $navToggle.classList.remove('open');
        }
      });
    });
  }

  window.scrollToYear = function(year) {
    const el = document.getElementById('year-' + year);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - ($nav.offsetHeight||62) - 20, behavior:'smooth' });
    } else {
      const y = parseInt(year);
      const id = y<=1988?'P1': y<=2001?'P2': y<=2007?'P3':'P4';
      document.getElementById('section-'+id)?.scrollIntoView({ behavior:'smooth' });
    }
  };

  /* ── OBSERVERS ── */
  function initObservers() {
    const fadeObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

    const secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting)
          $navLinks.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.dataset.target === e.target.id));
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('#hero, #intro-section, .timeline-section, #closing-memorial').forEach(s => secObs.observe(s));
  }

  /* ── SCROLL HANDLERS ── */
  function initScroll(bar, btn) {
    const hero = $('hero');
    window.addEventListener('scroll', () => {
      const sy = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
      if (dh > 0) bar.style.width = (sy / dh * 100) + '%';
      $nav.classList.toggle('visible', sy > (hero ? hero.offsetHeight * 0.65 : 400));
      btn.classList.toggle('visible', sy > 600);
    }, { passive: true });
  }

  /* ── LIGHTBOX ── */
  function initLightbox() {
    document.addEventListener('click', e => {
      const item = e.target.closest('.photo-card');
      if (!item) return;
      const idx = parseInt(item.dataset.idx, 10);
      if (!isNaN(idx)) openLb(idx);
    });

    const close = $('lightbox-close');
    close.addEventListener('click', closeLb);
    $lightbox.addEventListener('click', e => {
      if (e.target === $lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-img-wrapper')) closeLb();
    });
    $('lightbox-prev').addEventListener('click', e => { e.stopPropagation(); navLb(-1); });
    $('lightbox-next').addEventListener('click', e => { e.stopPropagation(); navLb(1); });

    document.addEventListener('keydown', e => {
      if (!$lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') navLb(-1);
      if (e.key === 'ArrowRight') navLb(1);
    });

    let tx = 0;
    $lightbox.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive:true });
    $lightbox.addEventListener('touchend',   e => {
      const d = e.changedTouches[0].screenX - tx;
      if (Math.abs(d) > 50) navLb(d > 0 ? -1 : 1);
    }, { passive:true });
  }

  function openLb(idx) {
    if (idx < 0 || idx >= allImages.length) return;
    curIdx = idx;
    const item = allImages[idx];
    $lbImg.src = item.src; $lbImg.alt = item.caption || 'Ảnh kỷ niệm';
    $lbCaption.textContent = item.caption || '';
    $lbCounter.textContent = `Ảnh ${idx+1} / ${allImages.length}`;
    $lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { $lightbox.classList.remove('active'); document.body.style.overflow = ''; curIdx = -1; }
  function navLb(dir) {
    if (curIdx < 0) return;
    let n = curIdx + dir;
    if (n < 0) n = allImages.length - 1;
    if (n >= allImages.length) n = 0;
    openLb(n);
  }

  /* ── MUSIC ── */
  function initMusic() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    const toggle = $('music-toggle');
    const player = $('music-player');

    window.onYouTubeIframeAPIReady = () => {
      ytPlayer = new YT.Player('yt-player', {
        height: '1', width: '1', videoId: 'SgUHZ_G9uCA',
        playerVars: { autoplay: 0, loop: 1, playlist: 'SgUHZ_G9uCA', controls: 0, showinfo: 0 },
        events: {
          onStateChange: ev => {
            isPlaying = ev.data === YT.PlayerState.PLAYING;
            player.classList.toggle('playing', isPlaying);
            toggle.querySelector('.icon-play').style.display  = isPlaying ? 'none' : '';
            toggle.querySelector('.icon-pause').style.display = isPlaying ? '' : 'none';
          }
        }
      });
    };

    toggle.addEventListener('click', () => {
      if (!ytPlayer?.playVideo) { alert('Đang tải nhạc, vui lòng thử lại sau giây lát...'); return; }
      isPlaying ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
    });
  }

  /* ── BOOTSTRAP ── */
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
