/* ============================================================
   figures.js — computed, interactive teaching figures.
   FIG.map[topicId] = [ {type, ...params, title, caption}, ... ]
   FIG.render(hostEl, spec) draws one figure (canvas + controls).
   Everything is computed from the real math so the graphics are
   accurate, not decorative.
   ============================================================ */
const FIG = (function () {
  const C = {
    blue: '#4dabf7', teal: '#63e6be', orange: '#ffa94d', red: '#ff6b6b',
    purple: '#b197fc', text: '#e6edf3', dim: '#9aa7b5', grid: '#26303d', box: '#12171f'
  };
  const TAU = Math.PI * 2;
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };

  /* ---- math helpers ---- */
  function erf(x) { // Abramowitz-Stegun
    const s = x < 0 ? -1 : 1; x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  }
  const Q = x => 0.5 * (1 - erf(x / Math.SQRT2));
  function gauss() { // Box-Muller
    let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
  }
  const dB = x => 10 * Math.log10(x);
  const lin = d => Math.pow(10, d / 10);

  /* ---- formatting & ticks ---- */
  function fmt(v) {
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e4 || a < 1e-3) return v.toExponential(0).replace('e+', 'e').replace('e-0', 'e-').replace('e+0', 'e');
    if (a < 1) return (Math.round(v * 1000) / 1000).toString();
    return (Math.round(v * 100) / 100).toString();
  }
  function niceTicks(range, log, n) {
    const [lo, hi] = range;
    if (log) {
      const a = Math.ceil(Math.log10(lo)), b = Math.floor(Math.log10(hi)), out = [];
      for (let k = a; k <= b; k++) out.push(Math.pow(10, k));
      return out.length ? out : [lo, hi];
    }
    n = n || 5;
    const raw = (hi - lo) / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), norm = raw / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const out = []; let t = Math.ceil(lo / step) * step;
    for (; t <= hi + step * 1e-6; t += step) out.push(Math.round(t / step) * step);
    return out;
  }

  /* ---- figure card + axes ---- */
  function makeCard(host, spec, w, h) {
    const c = el('div', 'fig-card');
    if (spec.title) c.appendChild(el('div', 'fig-title', spec.title));
    const cv = document.createElement('canvas');
    cv.className = 'fig-canvas';
    const dpr = window.devicePixelRatio || 1;
    w = w || 520; h = h || 300;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.width = '100%'; cv.style.maxWidth = w + 'px'; cv.style.height = 'auto';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    c.appendChild(cv);
    const controls = el('div', 'fig-controls'); c.appendChild(controls);
    if (spec.caption) c.appendChild(el('div', 'fig-caption', spec.caption));
    if (spec.explain) c.appendChild(el('div', 'fig-explain', spec.explain));
    host.appendChild(c);
    return { ctx, w, h, controls, card: c };
  }
  function clearBg(ctx, w, h) { ctx.clearRect(0, 0, w, h); }

  function drawAxes(ctx, box, o) {
    const { x, y, w, h } = box, xr = o.xr, yr = o.yr;
    const lx = o.logx, ly = o.logy;
    const fx = lx ? v => x + w * (Math.log10(v) - Math.log10(xr[0])) / (Math.log10(xr[1]) - Math.log10(xr[0]))
      : v => x + w * (v - xr[0]) / (xr[1] - xr[0]);
    const fy = ly ? v => y + h - h * (Math.log10(v) - Math.log10(yr[0])) / (Math.log10(yr[1]) - Math.log10(yr[0]))
      : v => y + h - h * (v - yr[0]) / (yr[1] - yr[0]);
    ctx.fillStyle = C.box; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.fillStyle = C.dim; ctx.font = '11px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    (o.xticks || niceTicks(xr, lx)).forEach(t => {
      const px = fx(t); ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + h); ctx.stroke();
      ctx.fillText(o.xtickfmt ? o.xtickfmt(t) : fmt(t), px, y + h + 5);
    });
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    (o.yticks || niceTicks(yr, ly)).forEach(t => {
      const py = fy(t); ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + w, py); ctx.stroke();
      ctx.fillText(o.ytickfmt ? o.ytickfmt(t) : fmt(t), x - 6, py);
    });
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1.2; ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = C.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    if (o.xlabel) ctx.fillText(o.xlabel, x + w / 2, y + h + 20);
    if (o.ylabel) { ctx.save(); ctx.translate(x - 40, y + h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(o.ylabel, 0, 0); ctx.restore(); }
    return { fx, fy, x, y, w, h };
  }
  function line(ctx, ax, pts, color, width) {
    ctx.save(); ctx.beginPath(); ctx.rect(ax.x, ax.y, ax.w, ax.h); ctx.clip();
    ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.beginPath();
    let started = false;
    pts.forEach(p => {
      if (p == null || !isFinite(p[1])) { started = false; return; }
      const X = ax.fx(p[0]), Y = ax.fy(p[1]);
      if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
    });
    ctx.stroke(); ctx.restore();
  }
  function legend(ctx, box, items) {
    let ly = box.y + 8;
    ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    items.forEach(it => {
      const lx = box.x + box.w - 130;
      ctx.strokeStyle = it.color; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 22, ly); ctx.stroke();
      ctx.fillStyle = C.text; ctx.fillText(it.label, lx + 28, ly);
      ly += 16;
    });
  }
  function slider(controls, o, cb) {
    const wrap = el('label', 'fig-slider');
    const lab = el('span', 'fig-slider-lab', o.label + ': ');
    const val = el('b', '', o.fmt ? o.fmt(o.value) : o.value);
    lab.appendChild(val);
    const r = document.createElement('input');
    r.type = 'range'; r.min = o.min; r.max = o.max; r.step = o.step; r.value = o.value;
    r.oninput = () => { const v = parseFloat(r.value); val.textContent = o.fmt ? o.fmt(v) : v; cb(v); };
    wrap.append(lab, r); controls.appendChild(wrap);
    return r;
  }
  function chooser(controls, opts, initial, cb) {
    const wrap = el('div', 'fig-chooser');
    opts.forEach(o => {
      const b = el('button', 'fig-choice' + (o.v === initial ? ' active' : ''), o.l);
      b.onclick = () => { wrap.querySelectorAll('.fig-choice').forEach(x => x.classList.remove('active')); b.classList.add('active'); cb(o.v); };
      wrap.appendChild(b);
    });
    controls.appendChild(wrap);
  }
  function toggle(controls, label, initial, cb) {
    const wrap = el('label', 'fig-slider');
    const box = document.createElement('input'); box.type = 'checkbox'; box.checked = initial;
    box.onchange = () => cb(box.checked);
    wrap.append(box, el('span', 'fig-slider-lab', ' ' + label));
    controls.appendChild(wrap);
  }
  const M = { left: 52, right: 18, top: 16, bottom: 42 };
  const plotBox = (w, h) => ({ x: M.left, y: M.top, w: w - M.left - M.right, h: h - M.top - M.bottom });

  /* ================= FIGURE GENERATORS ================= */
  const T = {};

  // Shannon capacity C/B vs SNR(dB) — draggable operating point
  T.capacity = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(snr) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [-10, 40], yr: [0, 14], xlabel: 'SNR (dB)', ylabel: 'Capacity  C/B  (bit/s/Hz)' });
      const pts = []; for (let d = -10; d <= 40; d += 0.5) pts.push([d, Math.log2(1 + lin(d))]);
      line(ctx, ax, pts, C.blue, 2.5);
      const cap = Math.log2(1 + lin(snr));
      const mx = ax.fx(snr), my = ax.fy(cap);
      ctx.strokeStyle = C.dim; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(mx, ax.y + ax.h); ctx.lineTo(mx, my); ctx.lineTo(ax.x, my); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(mx, my, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('SNR ' + snr + ' dB → ' + cap.toFixed(2) + ' bit/s/Hz', ax.x + 60, ax.y + 26);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif';
      ctx.fillText('≈ +1 bit/s/Hz per 3 dB in the high-SNR region', ax.x + 60, ax.y + 44);
    }
    draw(15);
    slider(card.controls, { label: 'SNR', min: -10, max: 40, step: 1, value: 15, fmt: v => v + ' dB' }, draw);
  };

  // AWGN: time trace + histogram vs Gaussian pdf
  T.gaussianNoise = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const N = 4000, sigmaRef = 1;
    function draw(sigma) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const bins = 41, lim = 4, hist = new Array(bins).fill(0);
      let samples = [];
      for (let i = 0; i < N; i++) { const x = sigma * gauss(); samples.push(x); const b = Math.floor((x / lim + 1) / 2 * bins); if (b >= 0 && b < bins) hist[b]++; }
      const maxh = Math.max(...hist) / N * bins / (2 * lim);
      const yr = [0, Math.max(0.45, maxh * 1.15)];
      const ax = drawAxes(ctx, box, { xr: [-lim, lim], yr, xlabel: 'amplitude / σ_ref', ylabel: 'probability density' });
      // histogram bars
      ctx.fillStyle = 'rgba(77,171,247,0.35)';
      for (let b = 0; b < bins; b++) {
        const x0 = -lim + b / bins * 2 * lim, x1 = -lim + (b + 1) / bins * 2 * lim;
        const dens = hist[b] / N / ((2 * lim) / bins);
        ctx.fillRect(ax.fx(x0), ax.fy(dens), ax.fx(x1) - ax.fx(x0) - 1, ax.fy(0) - ax.fy(dens));
      }
      // theoretical pdf
      const pts = []; for (let x = -lim; x <= lim; x += 0.05) pts.push([x, Math.exp(-x * x / (2 * sigma * sigma)) / (sigma * Math.sqrt(TAU))]);
      line(ctx, ax, pts, C.orange, 2.5);
      legend(ctx, box, [{ label: 'samples', color: C.blue }, { label: 'Gaussian pdf', color: C.orange }]);
    }
    draw(sigmaRef);
    slider(card.controls, { label: 'noise σ', min: 0.4, max: 2, step: 0.05, value: 1, fmt: v => v.toFixed(2) }, draw);
  };

  // PSD of tone + white noise (periodogram)
  T.psd = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(snrdB) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h), Nf = 256, fs = Nf;
      const sig = lin(snrdB);
      const re = new Array(Nf), im = new Array(Nf);
      const f0 = 64; const amp = Math.sqrt(sig);
      for (let n = 0; n < Nf; n++) { re[n] = amp * Math.cos(TAU * f0 * n / Nf) + gauss() * 0.7; im[n] = 0; }
      // naive DFT magnitude (Nf small)
      const psd = [];
      for (let k = 0; k < Nf / 2; k++) {
        let sr = 0, si = 0;
        for (let n = 0; n < Nf; n++) { const a = -TAU * k * n / Nf; sr += re[n] * Math.cos(a) - im[n] * Math.sin(a); si += re[n] * Math.sin(a) + im[n] * Math.cos(a); }
        psd.push([k, dB((sr * sr + si * si) / Nf + 1e-6)]);
      }
      const ax = drawAxes(ctx, box, { xr: [0, Nf / 2], yr: [-20, 40], xlabel: 'frequency bin', ylabel: 'PSD (dB)' });
      line(ctx, ax, psd, C.blue, 1.5);
      // noise floor line
      const floor = dB(0.7 * 0.7);
      ctx.save(); ctx.setLineDash([5, 4]); line(ctx, ax, [[0, floor + 3], [Nf / 2, floor + 3]], C.orange, 1.5); ctx.restore();
      ctx.fillStyle = C.orange; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('noise floor', ax.x + 8, ax.fy(floor + 3) - 12);
      ctx.fillStyle = C.teal; ctx.fillText('carrier', ax.fx(f0) + 6, ax.fy(30));
    }
    draw(20);
    slider(card.controls, { label: 'signal SNR', min: -5, max: 35, step: 1, value: 20, fmt: v => v + ' dB' }, draw);
  };

  // Noise floor vs bandwidth
  T.noiseFloorBw = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(nf) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, {
        xr: [1e3, 1e9], yr: [-150, -70], logx: true, xlabel: 'bandwidth B (Hz)', ylabel: 'noise floor (dBm)',
        xtickfmt: t => { const e = Math.log10(t); return e >= 6 ? (t / 1e6) + 'M' : e >= 3 ? (t / 1e3) + 'k' : t; }
      });
      const pts = []; for (let e = 3; e <= 9; e += 0.1) { const B = Math.pow(10, e); pts.push([B, -174 + 10 * Math.log10(B) + nf]); }
      line(ctx, ax, pts, C.blue, 2.5);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('floor = −174 + 10·log₁₀(B) + NF', ax.x + 10, ax.y + 12);
    }
    draw(6);
    slider(card.controls, { label: 'noise figure', min: 0, max: 15, step: 0.5, value: 6, fmt: v => v + ' dB' }, draw);
  };

  // Friis: total NF vs first-stage gain (dominance)
  T.friisNF = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(f1dB) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const F1 = lin(f1dB), F2 = lin(10); // 2nd stage 10 dB NF
      const ax = drawAxes(ctx, box, { xr: [0, 30], yr: [0, 12], xlabel: 'LNA (stage 1) gain (dB)', ylabel: 'total NF (dB)' });
      const pts = []; for (let g = 0; g <= 30; g += 0.5) { const G1 = lin(g); pts.push([g, dB(F1 + (F2 - 1) / G1)]); }
      line(ctx, ax, pts, C.blue, 2.5);
      ctx.save(); ctx.setLineDash([5, 4]); line(ctx, ax, [[0, f1dB], [30, f1dB]], C.teal, 1.5); ctx.restore();
      ctx.fillStyle = C.teal; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('LNA NF floor (' + f1dB.toFixed(1) + ' dB)', ax.x + 10, ax.fy(f1dB) - 14);
      ctx.fillStyle = C.dim; ctx.fillText('stage-2 NF = 10 dB; high LNA gain ⇒ total NF → LNA NF', ax.x + 10, ax.y + 12);
    }
    draw(2);
    slider(card.controls, { label: 'LNA NF', min: 0.5, max: 6, step: 0.1, value: 2, fmt: v => v.toFixed(1) + ' dB' }, draw);
  };

  // Phase noise L(f) log-log with Leeson slopes — marker + integrated jitter
  T.phaseNoise = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const Lf = f => { // piecewise Leeson model, dBc/Hz
      let L;
      if (f < 1e3) L = -60 - 30 * (Math.log10(f) - 1);
      else if (f < 1e5) L = -120 - 20 * (Math.log10(f) - 3);
      else L = -160;
      return Math.max(L, -160);
    };
    function draw(markLog) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, {
        xr: [10, 1e7], yr: [-160, -20], logx: true, xlabel: 'offset from carrier (Hz)', ylabel: 'ℒ(f)  (dBc/Hz)',
        xtickfmt: t => { const e = Math.log10(t); return e >= 6 ? (t / 1e6) + 'M' : e >= 3 ? (t / 1e3) + 'k' : t; }
      });
      const pts = []; for (let e = 1; e <= 7; e += 0.05) { const f = Math.pow(10, e); pts.push([f, Lf(f)]); }
      line(ctx, ax, pts, C.blue, 2.5);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('−30 dB/dec', ax.fx(60), ax.fy(-70));
      ctx.fillText('−20 dB/dec', ax.fx(6e3), ax.fy(-135));
      ctx.fillText('floor', ax.fx(2e6), ax.fy(-150));
      // integrate jitter from marker offset out to 10 MHz (2 sidebands)
      const fLo = Math.pow(10, markLog);
      let acc = 0; const N = 400;
      for (let i = 0; i < N; i++) {
        const a = Math.log10(fLo) + (7 - Math.log10(fLo)) * i / N;
        const b = Math.log10(fLo) + (7 - Math.log10(fLo)) * (i + 1) / N;
        const fa = Math.pow(10, a), fbb = Math.pow(10, b);
        acc += 0.5 * (Math.pow(10, Lf(fa) / 10) + Math.pow(10, Lf(fbb) / 10)) * (fbb - fa);
      }
      const jitterRad = Math.sqrt(2 * acc), jitterDeg = jitterRad * 180 / Math.PI;
      // marker line + point
      const mx = ax.fx(fLo), my = ax.fy(Lf(fLo));
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(mx, ax.y); ctx.lineTo(mx, ax.y + ax.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(mx, my, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('ℒ(' + (fLo >= 1e6 ? (fLo / 1e6) + ' MHz' : fLo >= 1e3 ? (fLo / 1e3) + ' kHz' : fLo + ' Hz') + ') = ' + Lf(fLo).toFixed(0) + ' dBc/Hz', ax.x + 70, ax.y + 22);
      ctx.fillText('integrated RMS jitter → 10 MHz ≈ ' + jitterDeg.toFixed(2) + '°', ax.x + 70, ax.y + 40);
    }
    draw(4); // 10 kHz
    slider(card.controls, { label: 'offset', min: 1.3, max: 6, step: 0.1, value: 4, fmt: v => { const f = Math.pow(10, v); return f >= 1e6 ? (f / 1e6).toFixed(1) + ' MHz' : f >= 1e3 ? (f / 1e3).toFixed(0) + ' kHz' : f.toFixed(0) + ' Hz'; } }, draw);
  };

  // Constellation with live noise cloud (order: 2 BPSK, 4 QPSK, 16 QAM)
  T.constellation = function (host, spec) {
    const card = makeCard(host, spec, 380, 360);
    const order = spec.order || 2;
    const pts = [];
    if (order === 2) pts.push([-1, 0], [1, 0]);
    else if (order === 4) [-1, 1].forEach(i => [-1, 1].forEach(q => pts.push([i, q])));
    else { const L = [-3, -1, 1, 3]; L.forEach(i => L.forEach(q => pts.push([i / 3, q / 3]))); }
    const Es = pts.reduce((a, p) => a + p[0] * p[0] + p[1] * p[1], 0) / pts.length;
    function draw(snrdB) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const R = Math.min(w, h) / 2 - 30, cx = w / 2, cy = h / 2, S = R / 1.5;
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('I', cx + R, cy - 6); ctx.textAlign = 'left'; ctx.fillText('Q', cx + 6, cy - R + 6);
      const sigma = Math.sqrt(Es / (2 * lin(snrdB)));
      // noisy samples
      ctx.fillStyle = 'rgba(77,171,247,0.5)';
      for (let k = 0; k < 500; k++) { const p = pts[k % pts.length]; const X = cx + (p[0] + sigma * gauss()) * S, Y = cy - (p[1] + sigma * gauss()) * S; ctx.fillRect(X, Y, 2, 2); }
      // ideal points
      pts.forEach(p => { ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(cx + p[0] * S, cy - p[1] * S, 4, 0, TAU); ctx.fill(); });
      ctx.fillStyle = C.text; ctx.textAlign = 'left';
      ctx.fillText('EVM ≈ ' + (100 * Math.sqrt(1 / lin(snrdB))).toFixed(1) + '%', 12, 18);
    }
    draw(spec.snr != null ? spec.snr : 15);
    slider(card.controls, { label: 'SNR', min: 0, max: 30, step: 1, value: spec.snr != null ? spec.snr : 15, fmt: v => v + ' dB' }, draw);
  };

  // BER vs Eb/N0 with interactive marker; series list of {name,color}
  T.berCurve = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const series = spec.series || [{ name: 'bpsk' }];
    const defs = {
      bpsk: { color: C.blue, label: 'BPSK / QPSK', f: g => Q(Math.sqrt(2 * g)) },
      dbpsk: { color: C.orange, label: 'DBPSK', f: g => 0.5 * Math.exp(-g) },
      coh8: { color: C.teal, label: 'BPSK (coherent)', f: g => Q(Math.sqrt(2 * g)) },
      coded: { color: C.teal, label: 'with ~4.5 dB coding gain', f: g => Q(Math.sqrt(2 * lin(dB(g) + 4.5))) },
      noncoh: { color: C.purple, label: 'noncoherent FSK', f: g => 0.5 * Math.exp(-g / 2) }
    };
    function draw(mark) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, {
        xr: [0, 14], yr: [1e-6, 0.5], logy: true, xlabel: 'Eb/N0 (dB)', ylabel: 'Bit error rate',
        ytickfmt: t => t.toExponential(0).replace('e+0', '').replace('e', 'e')
      });
      series.forEach(s => {
        const d = defs[s.name]; if (!d) return;
        const pts = []; for (let db = 0; db <= 14; db += 0.25) { const b = d.f(lin(db)); pts.push([db, Math.max(b, 1e-7)]); }
        line(ctx, ax, pts, d.color, 2.2);
      });
      legend(ctx, box, series.map(s => ({ label: defs[s.name].label, color: defs[s.name].color })));
      // marker
      const d0 = defs[series[0].name], b0 = d0.f(lin(mark));
      const mx = ax.fx(mark), my = ax.fy(Math.max(b0, 1e-7));
      ctx.strokeStyle = C.dim; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(mx, ax.y); ctx.lineTo(mx, ax.y + ax.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(mx, my, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.font = '12px sans-serif';
      ctx.fillText('Eb/N0 = ' + mark + ' dB → BER ≈ ' + b0.toExponential(1), ax.x + 8, ax.y + ax.h - 12);
    }
    draw(8);
    slider(card.controls, { label: 'Eb/N0', min: 0, max: 14, step: 0.5, value: 8, fmt: v => v + ' dB' }, draw);
  };

  // Matched filter: pulse, noisy input, MF output peak
  T.matchedFilter = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(snrdB) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h), N = 200, T0 = 100;
      const s = i => (i >= 20 && i < T0 + 20) ? 1 : 0; // rect pulse
      const sigma = Math.sqrt(1 / lin(snrdB)) * 3;
      const rx = []; for (let i = 0; i < N; i++) rx.push(s(i) + sigma * gauss());
      // matched filter = correlate with pulse (moving sum over pulse width)
      const mf = []; for (let i = 0; i < N; i++) { let acc = 0; for (let k = 0; k < T0; k++) { const j = i - k; if (j >= 20 && j < N) acc += rx[j] * (s(j)); } mf.push(acc / T0); }
      const ax = drawAxes(ctx, box, { xr: [0, N], yr: [-2.5, 2.5], xlabel: 'sample', ylabel: 'amplitude' });
      line(ctx, ax, rx.map((v, i) => [i, v]), 'rgba(154,167,181,0.7)', 1);
      line(ctx, ax, mf.map((v, i) => [i, v]), C.orange, 2.5);
      // clean pulse
      const ideal = []; for (let i = 0; i < N; i++) ideal.push([i, s(i)]); line(ctx, ax, ideal, C.teal, 1.5);
      legend(ctx, box, [{ label: 'noisy input', color: C.dim }, { label: 'pulse s(t)', color: C.teal }, { label: 'MF output', color: C.orange }]);
      ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.font = '12px sans-serif';
      ctx.fillText('peak SNR gain ≈ 2E/N0; sample MF at t=T for the decision', ax.x + 8, ax.y + 14);
    }
    draw(3);
    slider(card.controls, { label: 'input SNR', min: -6, max: 12, step: 1, value: 3, fmt: v => v + ' dB' }, draw);
  };

  // Optimal binary detection: two conditional Gaussians, movable threshold, shaded error tails
  T.decisionRegions = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    let ebn0 = 6, gam = 0;             // Eb/N0 (dB) and decision threshold
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const mu = 1;                    // signals at +/-1 (antipodal, d = 2)
      const sig = 1 / Math.sqrt(2 * lin(ebn0));   // so d/2sigma = sqrt(2 Eb/N0)
      const lo = -3.5, hi = 3.5;
      const pk = 1 / (sig * Math.sqrt(TAU));
      const ax = drawAxes(ctx, box, { xr: [lo, hi], yr: [0, pk * 1.15], xlabel: 'decision statistic r', ylabel: 'likelihood p(r | s)' });
      const pdf = (x, m) => Math.exp(-((x - m) * (x - m)) / (2 * sig * sig)) / (sig * Math.sqrt(TAU));
      // shade error tails (red): s0 pdf right of threshold, s1 pdf left of threshold
      ctx.save(); ctx.beginPath(); ctx.rect(ax.x, ax.y, ax.w, ax.h); ctx.clip();
      ctx.fillStyle = 'rgba(255,107,107,0.38)';
      ctx.beginPath(); ctx.moveTo(ax.fx(gam), ax.fy(0));
      for (let x = gam; x <= hi; x += 0.02) ctx.lineTo(ax.fx(x), ax.fy(pdf(x, -mu)));
      ctx.lineTo(ax.fx(hi), ax.fy(0)); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(ax.fx(lo), ax.fy(0));
      for (let x = lo; x <= gam; x += 0.02) ctx.lineTo(ax.fx(x), ax.fy(pdf(x, mu)));
      ctx.lineTo(ax.fx(gam), ax.fy(0)); ctx.closePath(); ctx.fill();
      ctx.restore();
      // the two conditional densities
      const p0 = [], p1 = [];
      for (let x = lo; x <= hi; x += 0.02) { p0.push([x, pdf(x, -mu)]); p1.push([x, pdf(x, mu)]); }
      line(ctx, ax, p0, C.blue, 2.4);
      line(ctx, ax, p1, C.orange, 2.4);
      // threshold line
      ctx.strokeStyle = C.purple; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ax.fx(gam), ax.y); ctx.lineTo(ax.fx(gam), ax.y + ax.h); ctx.stroke(); ctx.setLineDash([]);
      // Pe (equal priors): 0.5[Q((mu-gam)/sig) + Q((gam+mu)/sig)]
      const pe = 0.5 * (Q((mu - gam) / sig) + Q((gam + mu) / sig));
      const peOpt = Q(mu / sig);
      legend(ctx, box, [{ label: 'p(r | s0)', color: C.blue }, { label: 'p(r | s1)', color: C.orange }, { label: 'threshold', color: C.purple }]);
      ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.font = '12px sans-serif';
      ctx.fillText('Eb/N0 = ' + ebn0 + ' dB,  threshold = ' + gam.toFixed(2) + '  ->  P(e) = ' + pe.toExponential(2), ax.x + 8, ax.y + 16);
      ctx.fillStyle = (Math.abs(gam) < 1e-6) ? C.teal : C.dim; ctx.font = '11px sans-serif';
      ctx.fillText('optimal (equal priors) is threshold = 0:  P(e) = Q(sqrt(2 Eb/N0)) = ' + peOpt.toExponential(2), ax.x + 8, ax.y + 34);
    }
    draw();
    slider(card.controls, { label: 'Eb/N0', min: 0, max: 12, step: 1, value: 6, fmt: v => v + ' dB' }, v => { ebn0 = v; draw(); });
    slider(card.controls, { label: 'threshold', min: -1.5, max: 1.5, step: 0.05, value: 0, fmt: v => v.toFixed(2) }, v => { gam = v; draw(); });
  };

  // PLL phase-step error response for different damping
  T.pllStep = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(zeta) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h), wn = 1;
      const ax = drawAxes(ctx, box, { xr: [0, 12], yr: [-0.5, 1], xlabel: 'ωn · t', ylabel: 'phase error / Δθ' });
      ctx.strokeStyle = C.grid; ctx.setLineDash([3, 3]); const y0 = ax.fy(0); ctx.beginPath(); ctx.moveTo(ax.x, y0); ctx.lineTo(ax.x + ax.w, y0); ctx.stroke(); ctx.setLineDash([]);
      const wd = wn * Math.sqrt(Math.abs(1 - zeta * zeta)), pts = [];
      for (let t = 0; t <= 12; t += 0.05) {
        let e;
        if (zeta < 1) e = Math.exp(-zeta * wn * t) * (Math.cos(wd * t) - (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t));
        else e = Math.exp(-wn * t) * (1 - wn * t);
        pts.push([t, e]);
      }
      line(ctx, ax, pts, C.blue, 2.5);
      ctx.fillStyle = C.dim; ctx.textAlign = 'left'; ctx.font = '11px sans-serif';
      ctx.fillText('ζ = ' + zeta.toFixed(2) + (Math.abs(zeta - 0.707) < 0.03 ? '  (flat, ~optimal)' : zeta < 0.5 ? '  (ringy)' : ''), ax.x + 10, ax.y + 12);
    }
    draw(0.707);
    slider(card.controls, { label: 'damping ζ', min: 0.2, max: 0.99, step: 0.01, value: 0.707, fmt: v => v.toFixed(2) }, draw);
  };

  // FLL frequency pull-in from a large offset
  T.fllPull = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(f0) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0, 50], yr: [-Math.max(120, f0 * 1.1), Math.max(120, f0 * 1.1)], xlabel: 'time (loop iterations)', ylabel: 'frequency error (kHz)' });
      const k = 0.12, pts = []; let f = f0;
      for (let t = 0; t <= 50; t++) { pts.push([t, f]); f = f * (1 - k) + gauss() * 2; }
      line(ctx, ax, pts, C.teal, 2.5);
      ctx.strokeStyle = C.grid; ctx.setLineDash([3, 3]); const y0 = ax.fy(0); ctx.beginPath(); ctx.moveTo(ax.x, y0); ctx.lineTo(ax.x + ax.w, y0); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.dim; ctx.textAlign = 'left'; ctx.font = '11px sans-serif';
      ctx.fillText('FLL pulls in even large offsets a PLL could not capture', ax.x + 10, ax.y + 12);
    }
    draw(90);
    slider(card.controls, { label: 'initial offset', min: 20, max: 200, step: 10, value: 90, fmt: v => v + ' kHz' }, draw);
  };

  // Costas loop S-curve: error = sin(2·Δφ) — draggable phase error shows correction
  T.costasScurve = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(dphi) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [-180, 180], yr: [-1.2, 1.2], xlabel: 'phase error Δφ (degrees)', ylabel: 'loop error  I·Q' });
      const pts = []; for (let d = -180; d <= 180; d += 1) pts.push([d, Math.sin(2 * d * Math.PI / 180)]);
      line(ctx, ax, pts, C.blue, 2.5);
      const y0 = ax.fy(0); ctx.strokeStyle = C.grid; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.x, y0); ctx.lineTo(ax.x + ax.w, y0); ctx.stroke(); ctx.setLineDash([]);
      [0, 180, -180].forEach(d => { ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(ax.fx(d), ax.fy(0), 4, 0, TAU); ctx.fill(); });
      ctx.fillStyle = C.teal; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('stable lock', ax.fx(0), ax.fy(0) + 18); ctx.fillText('±180° ambiguity', ax.fx(180), ax.fy(0) - 10);
      // current operating point + correction arrow (loop drives toward nearest stable zero)
      const err = Math.sin(2 * dphi * Math.PI / 180);
      const px = ax.fx(dphi), py = ax.fy(err);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(px, py, 5, 0, TAU); ctx.fill();
      const dir = err > 0 ? -1 : 1; // correction reduces |Δφ| toward 0/±180
      ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + dir * 26, py); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px + dir * 26, py); ctx.lineTo(px + dir * 18, py - 4); ctx.lineTo(px + dir * 18, py + 4); ctx.closePath(); ctx.fillStyle = C.orange; ctx.fill();
      ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.font = '12px sans-serif';
      ctx.fillText('Δφ = ' + dphi + '° → error ' + err.toFixed(2) + ', VCO nudged ' + (dir < 0 ? 'left' : 'right'), ax.x + 8, ax.y + ax.h - 12);
    }
    draw(60);
    slider(card.controls, { label: 'phase error Δφ', min: -170, max: 170, step: 5, value: 60, fmt: v => v + '°' }, draw);
  };

  // Spread spectrum: PSD before/after spreading
  T.spread = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(gpdB) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [-1, 1], yr: [-40, 5], xlabel: 'normalized frequency', ylabel: 'PSD (dB)' });
      // narrowband: tall narrow; spread: low wide (area equal)
      const nbW = 0.06, spW = Math.min(0.95, nbW * lin(gpdB));
      const nbTop = 0, spTop = nbTop - gpdB;
      ctx.fillStyle = 'rgba(99,230,190,0.35)'; ctx.fillRect(ax.fx(-nbW), ax.fy(nbTop), ax.fx(nbW) - ax.fx(-nbW), ax.fy(-40) - ax.fy(nbTop));
      ctx.fillStyle = 'rgba(77,171,247,0.4)'; ctx.fillRect(ax.fx(-spW), ax.fy(spTop), ax.fx(spW) - ax.fx(-spW), ax.fy(-40) - ax.fy(spTop));
      // jammer
      ctx.fillStyle = 'rgba(255,107,107,0.6)'; ctx.fillRect(ax.fx(0.28), ax.fy(-8), 4, ax.fy(-40) - ax.fy(-8));
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = C.teal; ctx.fillText('data', ax.fx(0), ax.fy(nbTop) - 6);
      ctx.fillStyle = C.blue; ctx.fillText('spread (PSD −' + gpdB + ' dB)', ax.fx(0), ax.fy(spTop) - 6);
      ctx.fillStyle = C.red; ctx.fillText('jammer', ax.fx(0.28) + 22, ax.fy(-8));
    }
    draw(15);
    slider(card.controls, { label: 'processing gain', min: 6, max: 30, step: 1, value: 15, fmt: v => v + ' dB' }, draw);
  };

  // Frequency hopping time-frequency pattern — channel count adjustable
  T.hopping = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(Nch) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h), Nhop = 26, jamCh = Math.floor(Nch / 2);
      const ax = drawAxes(ctx, box, { xr: [0, Nhop], yr: [0, Nch], xlabel: 'time (hop slots)', ylabel: 'channel' });
      let x = 7, hits = 0;
      for (let t = 0; t < Nhop; t++) {
        x = (x * 5 + 3) % Nch; const jam = (x === jamCh); if (jam) hits++;
        ctx.fillStyle = jam ? C.red : C.blue;
        ctx.fillRect(ax.fx(t) + 1, ax.fy(x + 0.9), (ax.fx(1) - ax.fx(0)) - 2, ax.fy(0) - ax.fy(0.9));
      }
      ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = C.red; ctx.fillRect(ax.x, ax.fy(jamCh + 1), ax.w, ax.fy(jamCh) - ax.fy(jamCh + 1)); ctx.restore();
      ctx.fillStyle = C.red; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('jammer hits only ' + hits + '/' + Nhop + ' dwells (~' + Math.round(100 * hits / Nhop) + '%) — FEC repairs them', ax.x + 8, ax.y + 14);
    }
    draw(10);
    slider(card.controls, { label: 'channels', min: 5, max: 40, step: 1, value: 10 }, v => draw(Math.round(v)));
  };

  // m-sequence autocorrelation (LFSR) — adjustable register length
  const MSEQ_TAPS = { 3: [3, 2], 4: [4, 3], 5: [5, 3], 6: [6, 5], 7: [7, 6] };
  function mSequence(n) {
    const L = (1 << n) - 1, taps = MSEQ_TAPS[n], seq = []; let reg = 1;
    for (let i = 0; i < L; i++) { seq.push((reg & 1) ? 1 : -1); let fb = 0; taps.forEach(s => fb ^= (reg >> (s - 1)) & 1); reg = (reg >> 1) | (fb << (n - 1)); }
    return seq;
  }
  T.autocorr = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(n) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const L = (1 << n) - 1, seq = mSequence(n);
      const R = []; for (let s = 0; s < L; s++) { let acc = 0; for (let i = 0; i < L; i++) acc += seq[i] * seq[(i + s) % L]; R.push([s, acc]); }
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0, L], yr: [-5, L + 5], xlabel: 'shift (chips)', ylabel: 'autocorrelation' });
      R.forEach(p => { ctx.strokeStyle = C.blue; ctx.lineWidth = Math.max(1.5, (ax.fx(1) - ax.fx(0)) * 0.5); ctx.beginPath(); ctx.moveTo(ax.fx(p[0]), ax.fy(0)); ctx.lineTo(ax.fx(p[0]), ax.fy(p[1])); ctx.stroke(); });
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(n + '-stage LFSR → length ' + L + ' = 2^' + n + '−1', ax.x + 10, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif';
      ctx.fillText('two-valued: peak = ' + L + ' at zero shift, −1 at all others', ax.x + 10, ax.y + 34);
    }
    draw(5);
    slider(card.controls, { label: 'LFSR stages n', min: 3, max: 7, step: 1, value: 5, fmt: v => v + ' (len ' + ((1 << v) - 1) + ')' }, v => draw(Math.round(v)));
  };

  // Gold code cross-correlation (three-valued) — draggable shift marker
  T.crosscorr = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const n = 5, L = (1 << n) - 1;
    function mseq(taps, seed) { let reg = seed, s = []; for (let i = 0; i < L; i++) { s.push(reg & 1); let fb = 0; taps.forEach(t => fb ^= (reg >> (t - 1)) & 1); reg = ((reg >> 1) | (fb << (n - 1))) & L; } return s; }
    const a = mseq([5, 3], 1), b = mseq([5, 4, 3, 2], 1);
    const g1 = a.map((v, i) => v ^ b[i]).map(v => v ? 1 : -1);
    const g2 = a.map((v, i) => v ^ b[(i + 5) % L]).map(v => v ? 1 : -1);
    const R = []; for (let s = 0; s < L; s++) { let acc = 0; for (let i = 0; i < L; i++) acc += g1[i] * g2[(i + s) % L]; R.push([s, acc]); }
    const lim = Math.max(12, ...R.map(r => Math.abs(r[1]))) + 2;
    function draw(mark) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0, L], yr: [-lim, lim], xlabel: 'shift (chips)', ylabel: 'cross-correlation' });
      const y0 = ax.fy(0); ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(ax.x, y0); ctx.lineTo(ax.x + ax.w, y0); ctx.stroke();
      R.forEach(p => { const on = (p[0] === mark); ctx.strokeStyle = on ? C.orange : C.purple; ctx.lineWidth = on ? 3 : 2; ctx.beginPath(); ctx.moveTo(ax.fx(p[0]), y0); ctx.lineTo(ax.fx(p[0]), ax.fy(p[1])); ctx.stroke(); });
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('shift ' + mark + ' → cross-corr = ' + R[mark][1] + '  (one of {−1, −9, 7})', ax.x + 8, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif';
      ctx.fillText('bounded 3-valued vs peak 31 → satellites separate cleanly', ax.x + 8, ax.y + 34);
    }
    draw(0);
    slider(card.controls, { label: 'shift', min: 0, max: L - 1, step: 1, value: 0 }, v => draw(Math.round(v)));
  };

  // Viterbi trellis with a survivor path — reveal stage-by-stage
  T.trellis = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const stages = 6, states = 4, mL = 60, mT = 30;
    const path = [0, 2, 1, 0, 2, 1];
    function draw(upto) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const gx = i => mL + i * (w - mL - 30) / (stages - 1);
      const gy = s => mT + s * (h - mT - 50) / (states - 1);
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
      for (let i = 0; i < stages - 1; i++) for (let s = 0; s < states; s++) {
        [(s >> 1), ((s >> 1) | 2)].forEach(ns => { if (ns < states) { ctx.beginPath(); ctx.moveTo(gx(i), gy(s)); ctx.lineTo(gx(i + 1), gy(ns)); ctx.stroke(); } });
      }
      // survivor path revealed up to current stage
      ctx.strokeStyle = C.teal; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= upto && i < stages; i++) { const X = gx(i), Y = gy(path[i]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke();
      for (let i = 0; i < stages; i++) for (let s = 0; s < states; s++) {
        const onPath = (path[i] === s && i <= upto);
        ctx.fillStyle = onPath ? C.teal : (i === upto + 1 ? C.orange : C.blue);
        ctx.beginPath(); ctx.arc(gx(i), gy(s), onPath ? 6 : 5, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ['00', '01', '10', '11'].forEach((lbl, s) => ctx.fillText(lbl, 8, gy(s) + 4));
      ctx.fillStyle = C.teal; ctx.textAlign = 'center'; ctx.font = '12px sans-serif';
      ctx.fillText('stage ' + (upto + 1) + '/' + stages + ' — add–compare–select keeps one survivor per state', w / 2, h - 14);
    }
    draw(stages - 1);
    slider(card.controls, { label: 'decode step', min: 0, max: stages - 1, step: 1, value: stages - 1 }, v => draw(Math.round(v)));
  };

  // ADC quantization staircase + SNR readout
  T.quantize = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(N) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h), L = Math.pow(2, N);
      const ax = drawAxes(ctx, box, { xr: [0, 1], yr: [-1.1, 1.1], xlabel: 'time', ylabel: 'amplitude' });
      const sine = []; for (let t = 0; t <= 1; t += 0.002) sine.push([t, Math.sin(TAU * 2 * t)]);
      line(ctx, ax, sine, C.dim, 1.2);
      const q = []; for (let t = 0; t <= 1; t += 0.004) { const v = Math.sin(TAU * 2 * t); const qq = Math.round((v + 1) / 2 * (L - 1)) / (L - 1) * 2 - 1; q.push([t, qq]); }
      // staircase
      ctx.save(); ctx.beginPath(); ctx.rect(ax.x, ax.y, ax.w, ax.h); ctx.clip();
      ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.beginPath();
      q.forEach((p, i) => { const X = ax.fx(p[0]), Y = ax.fy(p[1]); if (!i) ctx.moveTo(X, Y); else { ctx.lineTo(X, ctx._py != null ? ctx._py : Y); ctx.lineTo(X, Y); } ctx._py = Y; }); ctx.stroke(); ctx._py = null; ctx.restore();
      const snr = 6.02 * N + 1.76;
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(N + '-bit → ' + L + ' levels → ideal SNR = 6.02·' + N + '+1.76 = ' + snr.toFixed(1) + ' dB', ax.x + 8, ax.y + 14);
      legend(ctx, box, [{ label: 'analog', color: C.dim }, { label: 'quantized', color: C.orange }]);
    }
    draw(3);
    slider(card.controls, { label: 'resolution', min: 1, max: 8, step: 1, value: 3, fmt: v => v + ' bits' }, draw);
  };

  // DAC sinc envelope + images — signal-frequency marker + pre-emphasis toggle
  T.sincImages = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const sinc = x => x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
    let preemph = false;
    function draw(fsig) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0, 3], yr: [-30, 5], xlabel: 'frequency / fs', ylabel: 'response (dB)', xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3] });
      const env = []; for (let f = 0; f <= 3; f += 0.01) env.push([f, dB(Math.pow(Math.abs(sinc(f)), 2) + 1e-4)]);
      line(ctx, ax, env, C.dim, 1.5);
      if (preemph) { // inverse-sinc flattens the baseband
        const flat = []; for (let f = 0; f <= 0.5; f += 0.01) flat.push([f, 0]); line(ctx, ax, flat, C.purple, 2);
      }
      [0, 1, 2, 3].forEach(c => {
        const pts = []; for (let f = c - 0.4; f <= c + 0.4; f += 0.01) { if (f < 0 || f > 3) continue; const shape = Math.max(0, 1 - Math.abs(f - c) / 0.4); pts.push([f, dB(shape * shape * Math.pow(Math.abs(sinc(f)), 2) + 1e-4)]); }
        line(ctx, ax, pts, c === 0 ? C.teal : C.red, 2.2);
      });
      // droop marker at the chosen signal frequency
      const droop = 20 * Math.log10(Math.abs(sinc(fsig)) || 1e-4);
      const mx = ax.fx(fsig), my = ax.fy(droop);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(mx, ax.y + ax.h); ctx.lineTo(mx, my); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(mx, my, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('at f = ' + fsig.toFixed(2) + '·fs, sinc droop = ' + droop.toFixed(2) + ' dB' + (preemph ? ' (pre-corrected)' : ''), ax.x + 8, ax.y + 16);
      ctx.fillStyle = C.red; ctx.font = '11px sans-serif'; ctx.fillText('images', ax.fx(1.05), ax.fy(-2));
    }
    let cur = 0.4;
    draw(cur);
    slider(card.controls, { label: 'signal freq', min: 0.05, max: 0.5, step: 0.01, value: 0.4, fmt: v => v.toFixed(2) + '·fs' }, v => { cur = v; draw(v); });
    toggle(card.controls, 'inverse-sinc pre-emphasis', false, v => { preemph = v; draw(cur); });
  };

  // Free-space path loss vs distance for several frequencies
  T.pathLoss = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const freqs = [{ f: 100, c: C.teal, l: '100 MHz' }, { f: 1000, c: C.blue, l: '1 GHz' }, { f: 5000, c: C.orange, l: '5 GHz' }];
    function draw(n) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, {
        xr: [1, 1e5], yr: [20, 160], logx: true, xlabel: 'distance (m)', ylabel: 'path loss (dB)',
        xtickfmt: t => t >= 1000 ? (t / 1000) + 'k' : t
      });
      freqs.forEach(fr => {
        const pts = []; for (let e = 0; e <= 5; e += 0.05) { const d = Math.pow(10, e); const dkm = d / 1000; const fspl = 20 * Math.log10(Math.max(dkm, 1e-6)) + 20 * Math.log10(fr.f) + 32.44; pts.push([d, fspl]); }
        line(ctx, ax, pts, fr.c, 2);
      });
      // path-loss exponent overlay at 1 GHz
      const d0 = 1, pl0 = 20 * Math.log10(d0 / 1000) + 20 * Math.log10(1000) + 32.44;
      const pe = []; for (let e = 0; e <= 5; e += 0.05) { const d = Math.pow(10, e); pe.push([d, pl0 + 10 * n * Math.log10(d / d0)]); }
      ctx.save(); ctx.setLineDash([5, 4]); line(ctx, ax, pe, C.purple, 2); ctx.restore();
      legend(ctx, box, freqs.map(f => ({ label: f.l, color: f.c })).concat([{ label: 'n=' + n.toFixed(1) + ' model', color: C.purple }]));
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('+6 dB per doubling of distance (free space)', ax.x + 8, ax.y + 12);
    }
    draw(3);
    slider(card.controls, { label: 'path-loss exponent n', min: 2, max: 4, step: 0.1, value: 3, fmt: v => v.toFixed(1) }, draw);
  };

  // Link budget waterfall — live calculator (Tx power, distance, antenna gain)
  T.linkWaterfall = function (host, spec) {
    const card = makeCard(host, spec, 520, 330);
    const sens = -95;
    let ptx = 20, distKm = 5, gant = 6;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const fspl = 20 * Math.log10(distKm) + 20 * Math.log10(2400) + 32.44; // 2.4 GHz
      const steps = [
        { l: 'Tx power', v: ptx, add: true }, { l: 'Tx ant', v: gant, add: true },
        { l: 'path loss', v: -fspl, add: false }, { l: 'misc', v: -3, add: false }, { l: 'Rx ant', v: gant, add: true }
      ];
      const box = plotBox(w, h);
      let cum = 0; const levels = [cum]; steps.forEach(s => { cum += s.v; levels.push(cum); });
      const prx = cum, margin = prx - sens;
      const lo = Math.min(-120, prx - 15), hi = Math.max(40, ptx + 10);
      const ax = drawAxes(ctx, box, { xr: [0, steps.length + 1], yr: [lo, hi], xlabel: '', ylabel: 'power (dBm)', xticks: [] });
      for (let i = 0; i < steps.length; i++) {
        const s = steps[i], y1 = ax.fy(levels[i]), y2 = ax.fy(levels[i + 1]);
        ctx.fillStyle = s.add ? 'rgba(99,230,190,0.6)' : 'rgba(255,107,107,0.6)';
        const bx = ax.fx(i + 0.5) - 22; ctx.fillRect(bx, Math.min(y1, y2), 44, Math.abs(y2 - y1));
        ctx.strokeStyle = C.grid; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(ax.fx(i + 0.5) + 22, ax.fy(levels[i + 1])); ctx.lineTo(ax.fx(i + 1.5) - 22, ax.fy(levels[i + 1])); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.l, ax.fx(i + 0.5), ax.y + ax.h + 12);
      }
      ctx.strokeStyle = C.blue; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(prx)); ctx.lineTo(ax.x + ax.w, ax.fy(prx)); ctx.stroke();
      ctx.strokeStyle = C.orange; ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(sens)); ctx.lineTo(ax.x + ax.w, ax.fy(sens)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.blue; ctx.textAlign = 'left'; ctx.font = '11px sans-serif'; ctx.fillText('Prx = ' + prx.toFixed(0) + ' dBm', ax.x + 6, ax.fy(prx) - 6);
      ctx.fillStyle = C.orange; ctx.fillText('sensitivity = ' + sens + ' dBm', ax.x + 6, ax.fy(sens) + 12);
      ctx.fillStyle = margin >= 0 ? C.teal : C.red; ctx.font = '13px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText((margin >= 0 ? 'margin = +' : 'LINK FAILS: ') + margin.toFixed(0) + ' dB', ax.x + ax.w - 6, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'Tx power', min: 0, max: 33, step: 1, value: 20, fmt: v => v + ' dBm' }, v => { ptx = v; draw(); });
    slider(card.controls, { label: 'distance', min: 0.5, max: 40, step: 0.5, value: 5, fmt: v => v + ' km' }, v => { distKm = v; draw(); });
    slider(card.controls, { label: 'antenna gain', min: 0, max: 20, step: 1, value: 6, fmt: v => v + ' dBi' }, v => { gant = v; draw(); });
  };

  // Antenna radiation pattern (N-element ULA) polar, with steering
  T.polarPattern = function (host, spec) {
    const card = makeCard(host, spec, 420, 380);
    let N = spec.N || 8, steer = 0;
    function AF(theta) { // theta from broadside, d=lambda/2
      const psi = Math.PI * (Math.sin(theta) - Math.sin(steer));
      const denom = N * Math.sin(psi / 2);
      return Math.abs(psi) < 1e-6 ? 1 : Math.abs(Math.sin(N * psi / 2) / denom);
    }
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const cx = w / 2, cy = h - 40, R = Math.min(w / 2, h - 70) - 10;
      // rings (dB)
      ctx.strokeStyle = C.grid; ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      [-30, -20, -10, 0].forEach(dbv => { const r = R * (1 + dbv / 40); ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, TAU); ctx.stroke(); ctx.fillText(dbv + 'dB', cx, cy - r - 2); });
      for (let a = -90; a <= 90; a += 30) { const rad = a * Math.PI / 180; ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.sin(rad), cy - R * Math.cos(rad)); ctx.stroke(); }
      // pattern
      ctx.strokeStyle = C.blue; ctx.lineWidth = 2.5; ctx.beginPath(); let started = false;
      for (let a = -90; a <= 90; a += 0.5) { const th = a * Math.PI / 180; const g = Math.max(-40, dB(AF(th) * AF(th) + 1e-5)); const r = R * (1 + g / 40); const X = cx + r * Math.sin(th), Y = cy - r * Math.cos(th); if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y); }
      ctx.stroke();
      const hpbw = 0.886 * (1 / N) * 180 / Math.PI * 2; // approx for ULA broadside (rad->deg)
      ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.font = '11px sans-serif';
      ctx.fillText(N + ' elements · steer ' + (steer * 180 / Math.PI).toFixed(0) + '° · HPBW ≈ ' + hpbw.toFixed(0) + '°', 10, 16);
    }
    draw();
    slider(card.controls, { label: 'elements N', min: 2, max: 24, step: 1, value: N }, v => { N = v; draw(); });
    slider(card.controls, { label: 'steer angle', min: -60, max: 60, step: 5, value: 0, fmt: v => v + '°' }, v => { steer = v * Math.PI / 180; draw(); });
  };

  // Antenna gain vs frequency — adjustable dish diameter + frequency marker
  T.gainFreq = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const eta = 0.55, cc = 3e8;
    const gainDbi = (d, f) => { const A = Math.PI * (d / 2) ** 2, lam = cc / f; return dB(eta * 4 * Math.PI * A / (lam * lam)); };
    let diam = 1, fMark = 1e10;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [1e8, 4e10], yr: [0, 60], logx: true, xlabel: 'frequency', ylabel: 'gain (dBi)', xtickfmt: t => t >= 1e9 ? (t / 1e9) + 'G' : (t / 1e6) + 'M' });
      // faint reference curves
      [0.3, 3].forEach(d => { const pts = []; for (let e = 8; e <= 10.6; e += 0.05) { const f = Math.pow(10, e); pts.push([f, gainDbi(d, f)]); } line(ctx, ax, pts, C.grid, 1.5); });
      // active dish curve
      const pts = []; for (let e = 8; e <= 10.6; e += 0.05) { const f = Math.pow(10, e); pts.push([f, gainDbi(diam, f)]); } line(ctx, ax, pts, C.blue, 2.5);
      // marker
      const g = gainDbi(diam, fMark), mx = ax.fx(fMark), my = ax.fy(g);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(mx, ax.y + ax.h); ctx.lineTo(mx, my); ctx.lineTo(ax.x, my); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(mx, my, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(diam.toFixed(1) + ' m dish @ ' + (fMark / 1e9).toFixed(1) + ' GHz → ' + g.toFixed(1) + ' dBi', ax.x + 8, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.fillText('G = η·4πA/λ² → +6 dB per octave of frequency (grey = 0.3 m & 3 m)', ax.x + 8, ax.y + 34);
    }
    draw();
    slider(card.controls, { label: 'dish diameter', min: 0.2, max: 5, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' m' }, v => { diam = v; draw(); });
    slider(card.controls, { label: 'frequency', min: 8, max: 10.6, step: 0.05, value: 10, fmt: v => (Math.pow(10, v) / 1e9).toFixed(1) + ' GHz' }, v => { fMark = Math.pow(10, v); draw(); });
  };

  // Animated EM plane wave (E vertical, B horizontal, orthogonal)
  T.emWave = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const { ctx, w, h } = card;
    let t = 0, running = true;
    const btn = el('button', 'fig-btn', '⏸ pause'); card.controls.appendChild(btn);
    btn.onclick = () => { running = !running; btn.textContent = running ? '⏸ pause' : '▶ play'; if (running) frame(); };
    function frame() {
      if (!document.body.contains(card.card)) return; // stop if removed
      clearBg(ctx, w, h);
      const midY = h / 2, midX = 40, len = w - 70, amp = 60;
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(midX, midY); ctx.lineTo(midX + len, midY); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('propagation →', midX + len - 90, midY - 6);
      // E field (blue, vertical)
      ctx.strokeStyle = C.blue; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = 0; x <= len; x += 3) { const y = midY - amp * Math.sin(0.05 * x - t); x ? ctx.lineTo(midX + x, y) : ctx.moveTo(midX + x, y); } ctx.stroke();
      // B field (teal, drawn as smaller mirrored to suggest orthogonal plane)
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = 0; x <= len; x += 3) { const y = midY + 0.5 * amp * Math.sin(0.05 * x - t); x ? ctx.lineTo(midX + x, y) : ctx.moveTo(midX + x, y); } ctx.stroke();
      ctx.fillStyle = C.blue; ctx.fillText('E field', midX + 4, midY - amp - 4);
      ctx.fillStyle = C.teal; ctx.fillText('B field (⊥, into plane)', midX + 4, midY + 0.5 * amp + 16);
      if (running) { t += 0.12; requestAnimationFrame(frame); }
    }
    frame();
  };

  // SDR: I/Q phasor — how a complex sample carries amplitude AND phase
  T.iqDemod = function (host, spec) {
    const card = makeCard(host, spec, 400, 380);
    let phase = 35, amp = 0.8;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 34;
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = '12px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('I', cx + R - 2, cy + 14); ctx.textAlign = 'left'; ctx.fillText('Q', cx + 6, cy - R + 12);
      const ph = phase * Math.PI / 180, I = amp * Math.cos(ph), Qv = amp * Math.sin(ph);
      const px = cx + I * R, py = cy - Qv * R;
      // projections
      ctx.strokeStyle = C.grid; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke(); ctx.setLineDash([]);
      // I and Q components
      ctx.strokeStyle = C.teal; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();
      ctx.strokeStyle = C.orange; ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
      // phasor
      ctx.strokeStyle = C.blue; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
      ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(px, py, 5, 0, TAU); ctx.fill();
      // phase arc
      ctx.strokeStyle = C.purple; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, -ph, ph < 0); ctx.stroke();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('I = A·cosφ = ' + I.toFixed(2), 12, 20);
      ctx.fillText('Q = A·sinφ = ' + Qv.toFixed(2), 12, 38);
      ctx.fillText('|A| = ' + amp.toFixed(2) + '   φ = ' + phase + '°', 12, 56);
      ctx.fillStyle = C.teal; ctx.fillText('I', (cx + px) / 2 - 4, cy + 16);
      ctx.fillStyle = C.orange; ctx.textAlign = 'left'; ctx.fillText('Q', px + 6, (cy + py) / 2);
    }
    draw();
    slider(card.controls, { label: 'phase φ', min: -180, max: 180, step: 5, value: 35, fmt: v => v + '°' }, v => { phase = v; draw(); });
    slider(card.controls, { label: 'amplitude', min: 0.1, max: 1, step: 0.05, value: 0.8, fmt: v => v.toFixed(2) }, v => { amp = v; draw(); });
  };

  // AD9361: agile tuning — a movable narrow capture window over a wide band
  T.tunableRx = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const signals = [{ f: 100, l: 'FM' }, { f: 900, l: 'GSM' }, { f: 1575, l: 'GPS' }, { f: 2440, l: 'WiFi' }, { f: 3500, l: '5G' }, { f: 5800, l: 'ISM' }];
    let lo = 2440, bw = 20;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [70, 6000], yr: [0, 1], xlabel: 'frequency (MHz)', ylabel: '', yticks: [], xtickfmt: t => t >= 1000 ? (t / 1000) + 'G' : t });
      // capture window
      const half = Math.max(bw / 2, 15); // min visual width
      ctx.fillStyle = 'rgba(99,230,190,0.18)'; ctx.fillRect(ax.fx(lo - half), ax.y, ax.fx(lo + half) - ax.fx(lo - half), ax.h);
      ctx.strokeStyle = C.teal; ctx.lineWidth = 1.5; ctx.strokeRect(ax.fx(lo - half), ax.y, ax.fx(lo + half) - ax.fx(lo - half), ax.h);
      // signals
      signals.forEach(s => {
        const inside = Math.abs(s.f - lo) <= bw / 2;
        ctx.strokeStyle = inside ? C.teal : C.blue; ctx.lineWidth = inside ? 3 : 2;
        ctx.beginPath(); ctx.moveTo(ax.fx(s.f), ax.fy(0)); ctx.lineTo(ax.fx(s.f), ax.fy(inside ? 0.85 : 0.55)); ctx.stroke();
        ctx.fillStyle = inside ? C.teal : C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(s.l, ax.fx(s.f), ax.fy(inside ? 0.9 : 0.6) - 4);
      });
      const captured = signals.filter(s => Math.abs(s.f - lo) <= bw / 2).map(s => s.l);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('LO ' + lo + ' MHz · BW ' + bw + ' MHz → capturing: ' + (captured.length ? captured.join(', ') : 'noise only'), ax.x + 6, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'LO (tune)', min: 100, max: 5900, step: 10, value: 2440, fmt: v => v >= 1000 ? (v / 1000).toFixed(2) + ' GHz' : v + ' MHz' }, v => { lo = v; draw(); });
    slider(card.controls, { label: 'bandwidth', min: 1, max: 56, step: 1, value: 20, fmt: v => v + ' MHz' }, v => { bw = v; draw(); });
  };

  // RFSoC: direct RF sampling — how a high-frequency input folds into Nyquist zone 1
  T.nyquistZones = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const fs = 500; // MS/s
    let fin = 700;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0, 3 * fs], yr: [0, 1], xlabel: 'frequency (MHz)', ylabel: '', yticks: [] });
      // shade Nyquist zones
      for (let z = 0; z < 6; z++) {
        const a = z * fs / 2, b = (z + 1) * fs / 2;
        ctx.fillStyle = (z % 2 === 0) ? 'rgba(77,171,247,0.07)' : 'rgba(177,151,252,0.09)';
        ctx.fillRect(ax.fx(a), ax.y, ax.fx(b) - ax.fx(a), ax.h);
        ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('zone ' + (z + 1), ax.fx((a + b) / 2), ax.y + 12);
      }
      // input tone
      ctx.strokeStyle = C.blue; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax.fx(fin), ax.fy(0)); ctx.lineTo(ax.fx(fin), ax.fy(0.8)); ctx.stroke();
      ctx.fillStyle = C.blue; ctx.textAlign = 'center'; ctx.font = '11px sans-serif'; ctx.fillText('input ' + fin, ax.fx(fin), ax.fy(0.85) - 3);
      // alias into zone 1
      const k = Math.round(fin / fs); const alias = Math.abs(fin - k * fs);
      ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax.fx(alias), ax.fy(0)); ctx.lineTo(ax.fx(alias), ax.fy(0.6)); ctx.stroke();
      ctx.fillStyle = C.orange; ctx.fillText('alias ' + alias.toFixed(0), ax.fx(alias), ax.fy(0.65) - 3);
      const zone = Math.floor(fin / (fs / 2)) + 1;
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('fs = ' + fs + ' MS/s · input in Nyquist zone ' + zone + ' → samples as ' + alias.toFixed(0) + ' MHz baseband', ax.x + 6, ax.y + ax.h - 10);
    }
    draw();
    slider(card.controls, { label: 'input frequency', min: 10, max: 1490, step: 10, value: 700, fmt: v => v + ' MHz' }, v => { fin = v; draw(); });
  };

  // Antenna types: pick a type and see its radiation pattern
  T.antennaZoo = function (host, spec) {
    const card = makeCard(host, spec, 440, 380);
    const types = {
      iso: { l: 'Isotropic', gain: '0 dBi', pat: () => 1 },
      dipole: { l: 'λ/2 dipole', gain: '2.15 dBi', pat: th => { const s = Math.cos(th); const d = Math.sqrt(1 - s * s); return d < 1e-3 ? 1e-3 : Math.cos(Math.PI / 2 * s) / d; } },
      arr4: { l: '4-elem array', gain: '~9 dBi', pat: th => AFn(4, th) },
      arr8: { l: '8-elem array', gain: '~12 dBi', pat: th => AFn(8, th) }
    };
    function AFn(N, th) { const psi = Math.PI * Math.sin(th); return Math.abs(psi) < 1e-6 ? 1 : Math.abs(Math.sin(N * psi / 2) / (N * Math.sin(psi / 2))); }
    let cur = 'dipole';
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const cx = w / 2, cy = h - 46, R = Math.min(w / 2, h - 80) - 10;
      ctx.strokeStyle = C.grid; ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      [-30, -20, -10, 0].forEach(dbv => { const r = R * (1 + dbv / 40); ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, TAU); ctx.stroke(); ctx.fillText(dbv + 'dB', cx, cy - r - 2); });
      for (let a = -90; a <= 90; a += 30) { const rad = a * Math.PI / 180; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.sin(rad), cy - R * Math.cos(rad)); ctx.stroke(); }
      const t = types[cur];
      ctx.strokeStyle = C.blue; ctx.lineWidth = 2.5; ctx.beginPath(); let started = false;
      for (let a = -90; a <= 90; a += 0.5) { const th = a * Math.PI / 180; const g = Math.max(-40, dB(Math.pow(t.pat(th), 2) + 1e-5)); const r = R * (1 + g / 40); const X = cx + r * Math.sin(th), Y = cy - r * Math.cos(th); if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y); }
      ctx.stroke();
      ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.font = '13px sans-serif'; ctx.fillText(t.l + ' — typical gain ' + t.gain, 12, 20);
    }
    draw();
    chooser(card.controls, Object.keys(types).map(k => ({ v: k, l: types[k].l })), cur, v => { cur = v; draw(); });
  };

  // Fourier synthesis: build a square wave from odd harmonics
  T.fourierTransform = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(N) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 1], yr: [-1.5, 1.5], xlabel: 'time', ylabel: 'amplitude' });
      const sq = []; for (let t = 0; t <= 1; t += 0.002) sq.push([t, t < 0.5 ? 1 : -1]); line(ctx, ax, sq, C.grid, 1.4);
      const ps = []; for (let t = 0; t <= 1; t += 0.002) { let s = 0; for (let k = 1; k <= N; k++) { const m = 2 * k - 1; s += Math.sin(TAU * m * t) / m; } ps.push([t, s * 4 / Math.PI]); }
      line(ctx, ax, ps, C.blue, 2.3);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(N + ' sine harmonic' + (N > 1 ? 's' : '') + ' added → a square wave emerges', ax.x + 8, ax.y + 16);
    }
    draw(3);
    slider(card.controls, { label: 'harmonics', min: 1, max: 20, step: 1, value: 3 }, v => draw(Math.round(v)));
  };

  // Laplace: s-plane poles + the time response they produce
  T.laplacePoleZero = function (host, spec) {
    const card = makeCard(host, spec, 540, 300);
    let re = -0.6, im = 1.5;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const L = { x: 40, y: 18, w: 200, h: h - 58 };
      ctx.fillStyle = C.box; ctx.fillRect(L.x, L.y, L.w, L.h); ctx.strokeStyle = C.dim; ctx.strokeRect(L.x, L.y, L.w, L.h);
      const scx = L.x + L.w * 0.62, scy = L.y + L.h / 2, sSc = 42;
      ctx.fillStyle = 'rgba(99,230,190,0.08)'; ctx.fillRect(L.x, L.y, scx - L.x, L.h);
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(L.x, scy); ctx.lineTo(L.x + L.w, scy); ctx.moveTo(scx, L.y); ctx.lineTo(scx, L.y + L.h); ctx.stroke();
      [im, -im].forEach(q => { const px = scx + re * sSc, py = scy - q * sSc; ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - 5, py - 5); ctx.lineTo(px + 5, py + 5); ctx.moveTo(px - 5, py + 5); ctx.lineTo(px + 5, py - 5); ctx.stroke(); });
      ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('σ', L.x + L.w - 12, scy - 5); ctx.fillText('jω', scx + 4, L.y + 10);
      ctx.fillStyle = C.teal; ctx.fillText('stable half', L.x + 5, L.y + L.h - 6);
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.fillText('s-plane', L.x + 5, L.y + 12);
      const R = { x: 300, y: 18, w: 210, h: h - 58 };
      const ax = drawAxes(ctx, R, { xr: [0, 8], yr: [-1.6, 1.6], xlabel: 't', ylabel: '' });
      const pts = []; for (let t = 0; t <= 8; t += 0.04) pts.push([t, Math.exp(re * t) * Math.cos(im * t)]); line(ctx, ax, pts, re < 0 ? C.blue : C.red, 2.2);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(re < 0 ? 'left-half poles → decays (stable)' : (re > 0 ? 'right-half poles → grows (UNSTABLE)' : 'on jω axis → pure oscillation'), 40, h - 6);
    }
    draw();
    slider(card.controls, { label: 'pole real σ', min: -1.5, max: 1, step: 0.05, value: -0.6, fmt: v => v.toFixed(2) }, v => { re = v; draw(); });
    slider(card.controls, { label: 'pole freq ω', min: 0, max: 3, step: 0.1, value: 1.5, fmt: v => v.toFixed(1) }, v => { im = v; draw(); });
  };

  // Z-transform: z-plane pole vs unit circle + discrete impulse response
  T.zPlane = function (host, spec) {
    const card = makeCard(host, spec, 540, 300);
    let r = 0.8, th = 0.6;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const L = { x: 40, y: 18, w: 200, h: h - 58 }; const cx = L.x + L.w / 2, cy = L.y + L.h / 2, U = Math.min(L.w, L.h) / 2 - 14;
      ctx.fillStyle = C.box; ctx.fillRect(L.x, L.y, L.w, L.h); ctx.strokeStyle = C.dim; ctx.strokeRect(L.x, L.y, L.w, L.h);
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(L.x, cy); ctx.lineTo(L.x + L.w, cy); ctx.moveTo(cx, L.y); ctx.lineTo(cx, L.y + L.h); ctx.stroke();
      ctx.strokeStyle = C.teal; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, U, 0, TAU); ctx.stroke();
      [th, -th].forEach(a => { const px = cx + r * U * Math.cos(a), py = cy - r * U * Math.sin(a); ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - 5, py - 5); ctx.lineTo(px + 5, py + 5); ctx.moveTo(px - 5, py + 5); ctx.lineTo(px + 5, py - 5); ctx.stroke(); });
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('z-plane', L.x + 5, L.y + 12);
      ctx.fillStyle = C.teal; ctx.fillText('|z|=1', cx + U - 26, cy - 5);
      const R = { x: 300, y: 18, w: 210, h: h - 58 };
      const ax = drawAxes(ctx, R, { xr: [0, 20], yr: [-1.6, 1.6], xlabel: 'n (samples)', ylabel: '' });
      for (let n = 0; n <= 20; n++) { const y = Math.pow(r, n) * Math.cos(n * th); const X = ax.fx(n); ctx.strokeStyle = r < 1 ? C.blue : C.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X, ax.fy(0)); ctx.lineTo(X, ax.fy(y)); ctx.stroke(); ctx.fillStyle = r < 1 ? C.blue : C.red; ctx.beginPath(); ctx.arc(X, ax.fy(y), 2.5, 0, TAU); ctx.fill(); }
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(r < 1 ? 'pole inside circle → decays (stable)' : 'pole outside → grows (UNSTABLE)', 40, h - 6);
    }
    draw();
    slider(card.controls, { label: 'pole radius r', min: 0.2, max: 1.25, step: 0.05, value: 0.8, fmt: v => v.toFixed(2) }, v => { r = v; draw(); });
    slider(card.controls, { label: 'pole angle θ', min: 0, max: 3, step: 0.1, value: 0.6, fmt: v => v.toFixed(1) }, v => { th = v; draw(); });
  };

  // Convolution: flip-and-slide
  T.convolutionDemo = function (host, spec) {
    const card = makeCard(host, spec, 520, 340);
    const x = t => (t >= 0 && t < 2) ? 1 : 0, hh = t => (t >= 0 && t < 2) ? 1 : 0;
    function conv(tt) { let s = 0; for (let tau = -1; tau <= 5; tau += 0.02) s += x(tau) * hh(tt - tau) * 0.02; return s; }
    function draw(tt) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const b1 = { x: 52, y: 16, w: w - 72, h: (h - 74) / 2 };
      const a1 = drawAxes(ctx, b1, { xr: [-1, 5], yr: [-0.2, 1.4], xlabel: '', ylabel: 'x, h' });
      const xp = []; for (let t = -1; t <= 5; t += 0.02) xp.push([t, x(t)]); line(ctx, a1, xp, C.teal, 2);
      const hp = []; for (let t = -1; t <= 5; t += 0.02) hp.push([t, hh(tt - t)]); line(ctx, a1, hp, C.orange, 2);
      ctx.save(); ctx.beginPath(); ctx.rect(a1.x, a1.y, a1.w, a1.h); ctx.clip(); ctx.fillStyle = 'rgba(255,169,77,0.25)';
      for (let t = -1; t <= 5; t += 0.02) if (x(t) > 0 && hh(tt - t) > 0) ctx.fillRect(a1.fx(t), a1.fy(1), a1.fx(t + 0.02) - a1.fx(t) + 1, a1.fy(0) - a1.fy(1)); ctx.restore();
      legend(ctx, b1, [{ label: 'x(τ)', color: C.teal }, { label: 'h(t−τ)', color: C.orange }]);
      const b2 = { x: 52, y: 20 + b1.h + 34, w: w - 72, h: (h - 74) / 2 };
      const a2 = drawAxes(ctx, b2, { xr: [-1, 5], yr: [-0.2, 2.4], xlabel: 't', ylabel: 'y = x∗h' });
      const yp = []; for (let t = -1; t <= tt; t += 0.05) yp.push([t, conv(t)]); line(ctx, a2, yp, C.blue, 2.5);
      const yc = conv(tt); ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(a2.fx(tt), a2.fy(yc), 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('flip h, slide to t, multiply, sum the shaded overlap → y(t)', b1.x + 4, b1.y + 12);
    }
    draw(2);
    slider(card.controls, { label: 'slide t', min: -1, max: 4, step: 0.1, value: 2, fmt: v => v.toFixed(1) }, v => draw(v));
  };

  // Correlation: slide a template to find a hidden pattern
  T.correlationDemo = function (host, spec) {
    const card = makeCard(host, spec, 520, 340);
    const Ln = 40, delay = 15, patt = []; for (let i = 0; i < 8; i++) patt.push(Math.sin(i * 1.3));
    const sig = []; for (let i = 0; i < Ln; i++) sig.push(((i - delay) >= 0 && (i - delay) < 8 ? patt[i - delay] : 0) + 0.35 * gauss());
    function corr(lag) { let s = 0; for (let i = 0; i < 8; i++) { const j = i + lag; if (j >= 0 && j < Ln) s += patt[i] * sig[j]; } return s; }
    function draw(lag) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const b1 = { x: 52, y: 16, w: w - 72, h: (h - 74) / 2 };
      const a1 = drawAxes(ctx, b1, { xr: [0, Ln], yr: [-2.5, 2.5], xlabel: '', ylabel: 'signal' });
      line(ctx, a1, sig.map((v, i) => [i, v]), C.dim, 1.5);
      const tp = []; for (let i = 0; i < 8; i++) tp.push([i + lag, patt[i]]); line(ctx, a1, tp, C.orange, 2.5);
      const b2 = { x: 52, y: 20 + b1.h + 34, w: w - 72, h: (h - 74) / 2 };
      const cc = []; let peak = -1e9, pl = 0; for (let l = 0; l < Ln - 4; l++) { const c = corr(l); cc.push([l, c]); if (c > peak) { peak = c; pl = l; } }
      const a2 = drawAxes(ctx, b2, { xr: [0, Ln], yr: [-4, 6], xlabel: 'lag', ylabel: 'correlation' });
      line(ctx, a2, cc, C.blue, 2);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(a2.fx(lag), a2.y); ctx.lineTo(a2.fx(lag), a2.y + a2.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('slide the orange template; correlation peaks at the hidden delay (lag ' + pl + ')', b1.x + 4, b1.y + 12);
    }
    draw(delay);
    slider(card.controls, { label: 'lag', min: 0, max: Ln - 5, step: 1, value: delay }, v => draw(Math.round(v)));
  };

  // Nyquist sampling: is fs fast enough?
  T.samplingDemo = function (host, spec) {
    const card = makeCard(host, spec, 520, 300); const f = 3;
    function draw(fs) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 1], yr: [-1.4, 1.4], xlabel: 'time (s)', ylabel: 'amplitude' });
      const orig = []; for (let t = 0; t <= 1; t += 0.002) orig.push([t, Math.cos(TAU * f * t)]); line(ctx, ax, orig, C.grid, 1.5);
      const Ns = Math.round(fs);
      for (let k = 0; k <= Ns; k++) { const t = k / Ns, y = Math.cos(TAU * f * t); ctx.strokeStyle = C.orange; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax.fx(t), ax.fy(0)); ctx.lineTo(ax.fx(t), ax.fy(y)); ctx.stroke(); ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(ax.fx(t), ax.fy(y), 3, 0, TAU); ctx.fill(); }
      const ok = fs >= 2 * f;
      ctx.fillStyle = ok ? C.teal : C.red; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('signal ' + f + ' Hz, sampling ' + Ns + ' Hz → ' + (ok ? 'OK: fs ≥ 2f, fully recoverable' : 'TOO SLOW: fs < 2f → aliasing!'), ax.x + 8, ax.y + 16);
    }
    draw(8);
    slider(card.controls, { label: 'sampling rate', min: 2, max: 20, step: 1, value: 8, fmt: v => v + ' Hz' }, v => draw(v));
  };

  // Aliasing: a fast tone masquerading as a slow one
  T.aliasingDemo = function (host, spec) {
    const card = makeCard(host, spec, 520, 300); const fs = 10;
    function draw(f) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 1], yr: [-1.4, 1.4], xlabel: 'time (s)', ylabel: 'amplitude' });
      const orig = []; for (let t = 0; t <= 1; t += 0.002) orig.push([t, Math.cos(TAU * f * t)]); line(ctx, ax, orig, C.grid, 1.2);
      const k = Math.round(f / fs), fa = Math.abs(f - k * fs);
      const al = []; for (let t = 0; t <= 1; t += 0.002) al.push([t, Math.cos(TAU * fa * t)]); line(ctx, ax, al, C.blue, 2.3);
      for (let n = 0; n <= fs; n++) { const t = n / fs, y = Math.cos(TAU * f * t); ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(ax.fx(t), ax.fy(y), 3.5, 0, TAU); ctx.fill(); }
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('true ' + f + ' Hz sampled at ' + fs + ' Hz → looks like ' + fa.toFixed(1) + ' Hz (the alias, blue)', ax.x + 8, ax.y + 16);
    }
    draw(13);
    slider(card.controls, { label: 'true frequency', min: 1, max: 29, step: 1, value: 13, fmt: v => v + ' Hz' }, v => draw(v));
  };

  // Pulse shaping: raised-cosine pulse and its ISI-free zero crossings
  T.raisedCosine = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function rc(t, b) { if (Math.abs(t) < 1e-6) return 1; const d = 1 - Math.pow(2 * b * t, 2); const s = Math.sin(Math.PI * t) / (Math.PI * t) * Math.cos(Math.PI * b * t); return Math.abs(d) < 1e-4 ? 0.5 : s / d; }
    function draw(b) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [-4, 4], yr: [-0.35, 1.15], xlabel: 'time (in symbols)', ylabel: 'amplitude' });
      const pts = []; for (let t = -4; t <= 4; t += 0.02) pts.push([t, rc(t, b)]); line(ctx, ax, pts, C.blue, 2.5);
      for (let k = -4; k <= 4; k++) { ctx.fillStyle = k === 0 ? C.orange : C.teal; ctx.beginPath(); ctx.arc(ax.fx(k), ax.fy(rc(k, b)), 3, 0, TAU); ctx.fill(); }
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('β = ' + b.toFixed(2) + ' → zero at every neighbouring symbol (no ISI); bandwidth ≈ ' + ((1 + b) / 2).toFixed(2) + '/T', ax.x + 8, ax.y + 16);
    }
    draw(0.35);
    slider(card.controls, { label: 'roll-off β', min: 0, max: 1, step: 0.05, value: 0.35, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // Eye diagram: overlaid symbol transitions
  T.eyeDiagram = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const Nsym = 60, syms = []; for (let i = 0; i < Nsym; i++) syms.push(Math.random() < 0.5 ? -1 : 1);
    function rc(t, b) { if (Math.abs(t) < 1e-6) return 1; const d = 1 - Math.pow(2 * b * t, 2); const s = Math.sin(Math.PI * t) / (Math.PI * t) * Math.cos(Math.PI * b * t); return Math.abs(d) < 1e-4 ? 0.5 : s / d; }
    function draw(noise, b) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [-1, 1], yr: [-1.9, 1.9], xlabel: 'time within symbol', ylabel: 'amplitude' });
      ctx.save(); ctx.beginPath(); ctx.rect(ax.x, ax.y, ax.w, ax.h); ctx.clip();
      ctx.strokeStyle = 'rgba(77,171,247,0.45)'; ctx.lineWidth = 1;
      for (let c = 3; c < Nsym - 3; c++) {
        ctx.beginPath();
        for (let s = 0; s <= 40; s++) { const tt = s / 20 - 1; let v = 0; for (let k = -3; k <= 3; k++) v += syms[c + k] * rc(tt - k, b); v += noise * gauss(); const X = ax.fx(tt), Y = ax.fy(v); s ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(0), ax.y); ctx.lineTo(ax.fx(0), ax.y + ax.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('a wide-open "eye" = easy, error-free decisions; noise/ISI close it', ax.x + 6, ax.y + 14);
    }
    let n = 0.06, bb = 0.5; draw(n, bb);
    slider(card.controls, { label: 'noise', min: 0, max: 0.4, step: 0.02, value: 0.06, fmt: v => v.toFixed(2) }, v => { n = v; draw(n, bb); });
    slider(card.controls, { label: 'roll-off β', min: 0.05, max: 1, step: 0.05, value: 0.5, fmt: v => v.toFixed(2) }, v => { bb = v; draw(n, bb); });
  };

  // Receiver sensitivity: stack the pieces
  T.sensitivityStack = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    let Bexp = 6, nf = 6, snr = 10;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const B = Math.pow(10, Bexp), floor = -174 + 10 * Math.log10(B), withNF = floor + nf, sens = withNF + snr;
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 4], yr: [-178, -50], xlabel: '', ylabel: 'power (dBm)', xticks: [] });
      const bar = (i, base, top, col, lbl) => { const bx = ax.fx(i + 0.5) - 40; ctx.fillStyle = col; ctx.fillRect(bx, ax.fy(top), 80, ax.fy(base) - ax.fy(top)); ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(lbl, ax.fx(i + 0.5), ax.y + ax.h + 12); };
      bar(0, -174, floor, 'rgba(77,171,247,0.6)', 'kTB floor');
      bar(1, floor, withNF, 'rgba(255,169,77,0.6)', '+ NF');
      bar(2, withNF, sens, 'rgba(177,151,252,0.6)', '+ SNR req');
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(sens)); ctx.lineTo(ax.x + ax.w, ax.fy(sens)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.teal; ctx.font = '13px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('sensitivity = ' + sens.toFixed(1) + ' dBm', ax.x + ax.w - 6, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('B=' + (B >= 1e6 ? (B / 1e6) + ' MHz' : (B / 1e3) + ' kHz') + ' · NF=' + nf + ' dB · SNR=' + snr + ' dB', ax.x + 6, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'bandwidth', min: 3, max: 8, step: 0.25, value: 6, fmt: v => { const B = Math.pow(10, v); return B >= 1e6 ? (B / 1e6).toFixed(1) + ' MHz' : (B / 1e3).toFixed(0) + ' kHz'; } }, v => { Bexp = v; draw(); });
    slider(card.controls, { label: 'noise figure', min: 0, max: 12, step: 0.5, value: 6, fmt: v => v + ' dB' }, v => { nf = v; draw(); });
    slider(card.controls, { label: 'required SNR', min: 0, max: 25, step: 1, value: 10, fmt: v => v + ' dB' }, v => { snr = v; draw(); });
  };

  // Jamming margin: processing gain minus what you spend
  T.jammingMargin = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    let gp = 30, snr = 10, loss = 3;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const mj = gp - snr - loss;
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 4], yr: [0, Math.max(40, gp + 5)], xlabel: '', ylabel: 'dB', xticks: [] });
      const bar = (i, base, top, col, lbl) => { const bx = ax.fx(i + 0.5) - 40; ctx.fillStyle = col; ctx.fillRect(bx, ax.fy(top), 80, ax.fy(base) - ax.fy(top)); ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(lbl, ax.fx(i + 0.5), ax.y + ax.h + 12); };
      bar(0, 0, gp, 'rgba(99,230,190,0.6)', 'processing gain');
      bar(1, gp - snr, gp, 'rgba(255,107,107,0.55)', '− SNR req');
      bar(2, gp - snr - loss, gp - snr, 'rgba(255,169,77,0.55)', '− losses');
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(mj)); ctx.lineTo(ax.x + ax.w, ax.fy(mj)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.teal; ctx.font = '13px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('jamming margin = ' + mj.toFixed(0) + ' dB', ax.x + ax.w - 6, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('survives a jammer up to ' + mj.toFixed(0) + ' dB stronger than the signal', ax.x + 6, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'processing gain', min: 10, max: 50, step: 1, value: 30, fmt: v => v + ' dB' }, v => { gp = v; draw(); });
    slider(card.controls, { label: 'required SNR', min: 0, max: 20, step: 1, value: 10, fmt: v => v + ' dB' }, v => { snr = v; draw(); });
    slider(card.controls, { label: 'losses', min: 0, max: 10, step: 0.5, value: 3, fmt: v => v + ' dB' }, v => { loss = v; draw(); });
  };

  // The sinc function + time/frequency duality
  T.sincFunction = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(a) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [-6, 6], yr: [-0.35, 1.15], xlabel: 'x', ylabel: 'sinc(x/a)' });
      const s = x => { const t = x / a; return Math.abs(t) < 1e-6 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t); };
      const pts = []; for (let x = -6; x <= 6; x += 0.02) pts.push([x, s(x)]); line(ctx, ax, pts, C.blue, 2.5);
      for (let k = -6; k <= 6; k++) { if (!k) continue; const z = k * a; if (z >= -6 && z <= 6) { ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(ax.fx(z), ax.fy(0), 3, 0, TAU); ctx.fill(); } }
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(ax.fx(0), ax.fy(1), 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('zeros at multiples of a; wider sinc in time ⇄ narrower rectangle in frequency', ax.x + 8, ax.y + 16);
    }
    draw(1);
    slider(card.controls, { label: 'width a', min: 0.5, max: 3, step: 0.1, value: 1, fmt: v => v.toFixed(1) }, v => draw(v));
  };

  // Frequency spectrum: a signal is just a few tones
  T.spectrumBuilder = function (host, spec) {
    const card = makeCard(host, spec, 520, 340);
    let f2 = 7, a2 = 0.5;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const b1 = { x: 52, y: 16, w: w - 72, h: (h - 74) / 2 };
      const a1 = drawAxes(ctx, b1, { xr: [0, 1], yr: [-2, 2], xlabel: '', ylabel: 'signal' });
      const comps = [{ f: 3, a: 1 }, { f: f2, a: a2 }];
      const sig = []; for (let t = 0; t <= 1; t += 0.002) { let v = 0; comps.forEach(c => v += c.a * Math.sin(TAU * c.f * t)); sig.push([t, v]); }
      line(ctx, a1, sig, C.blue, 2);
      const b2 = { x: 52, y: 20 + b1.h + 34, w: w - 72, h: (h - 74) / 2 };
      const a2x = drawAxes(ctx, b2, { xr: [0, 15], yr: [0, 1.2], xlabel: 'frequency (Hz)', ylabel: 'amplitude' });
      comps.forEach(c => { ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a2x.fx(c.f), a2x.fy(0)); ctx.lineTo(a2x.fx(c.f), a2x.fy(c.a)); ctx.stroke(); ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(a2x.fx(c.f), a2x.fy(c.a), 3, 0, TAU); ctx.fill(); });
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('a wiggly signal (top) is just a sum of pure tones — its spectrum (bottom)', b1.x + 4, b1.y + 12);
    }
    draw();
    slider(card.controls, { label: '2nd tone freq', min: 1, max: 14, step: 1, value: 7, fmt: v => v + ' Hz' }, v => { f2 = v; draw(); });
    slider(card.controls, { label: '2nd tone amp', min: 0, max: 1, step: 0.05, value: 0.5, fmt: v => v.toFixed(2) }, v => { a2 = v; draw(); });
  };

  // FFT: noisy wave → clean spectral spikes
  T.fftDemo = function (host, spec) {
    const card = makeCard(host, spec, 520, 340);
    let ftone = 12;
    function dft(re) { const N = re.length, mag = []; for (let k = 0; k < N / 2; k++) { let sr = 0, si = 0; for (let n = 0; n < N; n++) { const a = -TAU * k * n / N; sr += re[n] * Math.cos(a); si += re[n] * Math.sin(a); } mag.push(Math.sqrt(sr * sr + si * si) / (N / 2)); } return mag; }
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const N = 128, sig = []; for (let n = 0; n < N; n++) sig.push(Math.sin(TAU * 5 * n / N) + 0.7 * Math.sin(TAU * ftone * n / N) + 0.3 * gauss());
      const b1 = { x: 52, y: 16, w: w - 72, h: (h - 74) / 2 };
      const a1 = drawAxes(ctx, b1, { xr: [0, N], yr: [-3, 3], xlabel: '', ylabel: 'signal' });
      line(ctx, a1, sig.map((v, i) => [i, v]), C.dim, 1.2);
      const mag = dft(sig);
      const b2 = { x: 52, y: 20 + b1.h + 34, w: w - 72, h: (h - 74) / 2 };
      const a2 = drawAxes(ctx, b2, { xr: [0, N / 2], yr: [0, 1.2], xlabel: 'frequency bin', ylabel: '|FFT|' });
      mag.forEach((m, k) => { ctx.strokeStyle = C.blue; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(a2.fx(k), a2.fy(0)); ctx.lineTo(a2.fx(k), a2.fy(m)); ctx.stroke(); });
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('the FFT turns a noisy wave (top) into clean spikes at its hidden tones (bottom)', b1.x + 4, b1.y + 12);
    }
    draw();
    slider(card.controls, { label: '2nd tone bin', min: 8, max: 60, step: 1, value: 12 }, v => { ftone = v; draw(); });
  };

  // FIR filter magnitude response (moving average) — taps adjustable
  T.firResponse = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(M) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 0.5], yr: [-60, 5], xlabel: 'normalized frequency (×fs)', ylabel: 'magnitude (dB)' });
      const pts = []; for (let f = 0.001; f <= 0.5; f += 0.002) { const num = Math.sin(Math.PI * f * M), den = M * Math.sin(Math.PI * f); const H = Math.abs(den) < 1e-9 ? 1 : Math.abs(num / den); pts.push([f, 20 * Math.log10(H + 1e-4)]); }
      line(ctx, ax, pts, C.blue, 2.2);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(M + '-tap FIR: more taps → sharper cutoff. Always stable, exactly linear phase.', ax.x + 8, ax.y + 16);
    }
    draw(8);
    slider(card.controls, { label: 'taps', min: 2, max: 40, step: 1, value: 8 }, v => draw(Math.round(v)));
  };

  // IIR one-pole low-pass magnitude response — cheap, feedback
  T.iirResponse = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(r) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 0.5], yr: [-60, 5], xlabel: 'normalized frequency (×fs)', ylabel: 'magnitude (dB)' });
      const pts = []; for (let f = 0.001; f <= 0.5; f += 0.002) { const wv = TAU * f, reD = 1 - r * Math.cos(wv), imD = r * Math.sin(wv); const H = (1 - r) / Math.sqrt(reD * reD + imD * imD); pts.push([f, 20 * Math.log10(H + 1e-4)]); }
      line(ctx, ax, pts, C.blue, 2.2);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('1-pole IIR (pole r=' + r.toFixed(2) + '): just one coefficient, very cheap — stable while r < 1.', ax.x + 8, ax.y + 16);
    }
    draw(0.8);
    slider(card.controls, { label: 'pole r (cutoff)', min: 0.3, max: 0.98, step: 0.02, value: 0.8, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // Entropy / source coding: how compressible is a source?
  T.entropyCoding = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(p) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const H = (p <= 0 || p >= 1) ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 1], yr: [0, 1.15], xlabel: 'probability of symbol A', ylabel: 'entropy (bits/symbol)' });
      const pts = []; for (let x = 0.005; x < 1; x += 0.005) pts.push([x, -(x * Math.log2(x) + (1 - x) * Math.log2(1 - x))]); line(ctx, ax, pts, C.blue, 2.5);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(p), ax.fy(0)); ctx.lineTo(ax.fx(p), ax.fy(H)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(ax.fx(p), ax.fy(H), 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('entropy = ' + H.toFixed(2) + ' bits/symbol → 1 raw bit compresses toward ' + H.toFixed(2) + ' bits (' + Math.round((1 - H) * 100) + '% saved)', ax.x + 8, ax.y + 16);
    }
    draw(0.5);
    slider(card.controls, { label: 'symbol skew p', min: 0.02, max: 0.98, step: 0.02, value: 0.5, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // AM: carrier modulated by a message envelope
  T.amWave = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(m) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [0, 1], yr: [-2.3, 2.3], xlabel: 'time', ylabel: 'amplitude' });
      const fc = 30, fm = 3, sig = [], eU = [], eL = [];
      for (let t = 0; t <= 1; t += 0.001) { const env = 1 + m * Math.cos(TAU * fm * t); sig.push([t, env * Math.cos(TAU * fc * t)]); eU.push([t, env]); eL.push([t, -env]); }
      line(ctx, ax, sig, C.blue, 1.1); line(ctx, ax, eU, C.orange, 2); line(ctx, ax, eL, C.orange, 2);
      const eff = m * m / (2 + m * m) * 100;
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('m = ' + m.toFixed(2) + (m > 1 ? '  — OVERMODULATED, envelope distorts' : '') + ' · power efficiency ≈ ' + eff.toFixed(0) + '%', ax.x + 8, ax.y + 16);
    }
    draw(0.6);
    slider(card.controls, { label: 'modulation index m', min: 0, max: 1.5, step: 0.05, value: 0.6, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // FM: message and the frequency-modulated carrier
  T.fmWave = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(beta) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const fc = 20, fm = 3;
      const b1 = { x: 52, y: 16, w: w - 72, h: (h - 74) / 2 };
      const a1 = drawAxes(ctx, b1, { xr: [0, 1], yr: [-1.4, 1.4], xlabel: '', ylabel: 'message' });
      const msg = []; for (let t = 0; t <= 1; t += 0.002) msg.push([t, Math.cos(TAU * fm * t)]); line(ctx, a1, msg, C.teal, 2);
      const b2 = { x: 52, y: 20 + b1.h + 34, w: w - 72, h: (h - 74) / 2 };
      const a2 = drawAxes(ctx, b2, { xr: [0, 1], yr: [-1.4, 1.4], xlabel: 'time', ylabel: 'FM signal' });
      const fw = []; for (let t = 0; t <= 1; t += 0.0008) fw.push([t, Math.cos(TAU * fc * t + beta * Math.sin(TAU * fm * t))]); line(ctx, a2, fw, C.blue, 1.1);
      const carson = 2 * (beta + 1) * fm;
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('β = ' + beta.toFixed(1) + ' · Carson BW ≈ 2(β+1)·fm = ' + carson.toFixed(0) + ' Hz — the carrier squeezes/stretches with the message', b1.x + 4, b1.y + 12);
    }
    draw(3);
    slider(card.controls, { label: 'modulation index β', min: 0.5, max: 10, step: 0.5, value: 3, fmt: v => v.toFixed(1) }, v => draw(v));
  };

  // Early-Late gate: the DLL timing discriminator
  T.earlyLate = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const d = 0.5, R = x => Math.max(0, 1 - Math.abs(x));
    function draw(eps) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const b1 = { x: 52, y: 16, w: w - 72, h: (h - 74) / 2 };
      const a1 = drawAxes(ctx, b1, { xr: [-1.5, 1.5], yr: [-0.1, 1.15], xlabel: '', ylabel: 'code corr R(τ)' });
      const tri = []; for (let x = -1.5; x <= 1.5; x += 0.02) tri.push([x, R(x)]); line(ctx, a1, tri, C.dim, 1.5);
      [['E', eps - d / 2, C.teal], ['P', eps, C.orange], ['L', eps + d / 2, C.red]].forEach(g => { const X = a1.fx(g[1]), Y = a1.fy(R(g[1])); ctx.fillStyle = g[2]; ctx.beginPath(); ctx.arc(X, Y, 4, 0, TAU); ctx.fill(); ctx.fillText(g[0], X - 3, Y - 8); });
      const b2 = { x: 52, y: 20 + b1.h + 34, w: w - 72, h: (h - 74) / 2 };
      const a2 = drawAxes(ctx, b2, { xr: [-1.5, 1.5], yr: [-1.1, 1.1], xlabel: 'timing error ε (chips)', ylabel: 'E − L' });
      const sc = []; for (let e = -1.5; e <= 1.5; e += 0.02) sc.push([e, R(e - d / 2) - R(e + d / 2)]); line(ctx, a2, sc, C.blue, 2.2);
      const y0 = a2.fy(0); ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(a2.x, y0); ctx.lineTo(a2.x + a2.w, y0); ctx.stroke();
      const D = R(eps - d / 2) - R(eps + d / 2); ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(a2.fx(eps), a2.fy(D), 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('discriminator (Early − Late) = ' + D.toFixed(2) + ' → the loop drives ε toward 0', b1.x + 4, b1.y + 12);
    }
    draw(0.4);
    slider(card.controls, { label: 'timing error ε', min: -1.2, max: 1.2, step: 0.05, value: 0.4, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // Polarization ellipse from two orthogonal components
  T.polarizationEllipse = function (host, spec) {
    const card = makeCard(host, spec, 400, 380);
    let ratio = 1, phase = 90;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const cx = w / 2, cy = h / 2, S = Math.min(w, h) / 2 - 44;
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(cx - S, cy); ctx.lineTo(cx + S, cy); ctx.moveTo(cx, cy - S); ctx.lineTo(cx, cy + S); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('Ex', cx + S, cy - 6); ctx.textAlign = 'left'; ctx.fillText('Ey', cx + 6, cy - S + 6);
      const ph = phase * Math.PI / 180;
      ctx.strokeStyle = C.blue; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let a = 0; a <= TAU + 0.02; a += 0.02) { const ex = Math.cos(a), ey = ratio * Math.cos(a + ph); const X = cx + ex * S * 0.9, Y = cy - ey * S * 0.9; a ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.stroke();
      const diff = ((phase % 360) + 360) % 360;
      let type;
      if (Math.abs(ratio - 1) < 0.06 && (Math.abs(diff - 90) < 4 || Math.abs(diff - 270) < 4)) type = 'Circular';
      else if (ratio < 0.02 || diff < 4 || Math.abs(diff - 180) < 4 || Math.abs(diff - 360) < 4) type = 'Linear';
      else type = 'Elliptical';
      ctx.fillStyle = C.text; ctx.font = '13px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(type + ' polarization', 12, 22);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.fillText('|Ey/Ex| = ' + ratio.toFixed(2) + ' · phase diff = ' + phase + '°', 12, 40);
    }
    draw();
    slider(card.controls, { label: 'amplitude Ey/Ex', min: 0, max: 2, step: 0.05, value: 1, fmt: v => v.toFixed(2) }, v => { ratio = v; draw(); });
    slider(card.controls, { label: 'phase difference', min: 0, max: 360, step: 5, value: 90, fmt: v => v + '°' }, v => { phase = v; draw(); });
  };

  // Shift-register encoder schematic (rate-1/2, K=3 convolutional encoder)
  T.shiftReg = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 240);
    const y = 70, bx = 120, bw = 60, bh = 40, gap = 20;
    ctx.fillStyle = C.dim; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('input bits →', 30, y + bh / 2 + 4);
    // three register stages
    const stages = [];
    for (let i = 0; i < 3; i++) { const x = bx + i * (bw + gap); stages.push(x); ctx.fillStyle = C.box; ctx.strokeStyle = C.blue; ctx.lineWidth = 1.5; ctx.fillRect(x, y, bw, bh); ctx.strokeRect(x, y, bw, bh); ctx.fillStyle = C.text; ctx.textAlign = 'center'; ctx.fillText('D' + (i + 1), x + bw / 2, y + bh / 2 + 4); }
    // wires between stages
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(105, y + bh / 2); ctx.lineTo(bx, y + bh / 2); ctx.stroke();
    for (let i = 0; i < 2; i++) { const x = stages[i] + bw; ctx.beginPath(); ctx.moveTo(x, y + bh / 2); ctx.lineTo(x + gap, y + bh / 2); ctx.stroke(); }
    // two XOR adders (outputs)
    const adders = [{ yy: 18, taps: [0, 1, 2], lbl: 'output 1 (g₁)', col: C.teal }, { yy: h - 34, taps: [0, 2], lbl: 'output 2 (g₂)', col: C.orange }];
    adders.forEach(a => {
      const ax = stages[2] + bw + 40, ay = a.yy < y ? y - 30 : y + bh + 30;
      const cxq = ax, cyq = a.yy < y ? y - 28 : y + bh + 28;
      ctx.strokeStyle = a.col; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cxq, cyq, 12, 0, TAU); ctx.stroke();
      ctx.fillStyle = a.col; ctx.textAlign = 'center'; ctx.font = '13px sans-serif'; ctx.fillText('⊕', cxq, cyq + 4);
      a.taps.forEach(ti => { const sx = stages[ti] + bw / 2; ctx.strokeStyle = a.col; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(sx, a.yy < y ? y : y + bh); ctx.lineTo(sx, cyq); ctx.lineTo(cxq - 12, cyq); ctx.stroke(); ctx.setLineDash([]); });
      ctx.beginPath(); ctx.moveTo(cxq + 12, cyq); ctx.lineTo(cxq + 46, cyq); ctx.stroke();
      ctx.fillStyle = a.col; ctx.textAlign = 'left'; ctx.font = '11px sans-serif'; ctx.fillText(a.lbl, cxq + 50, cyq + 4);
    });
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Each input bit produces 2 output bits (rate 1/2), each an XOR of tapped register stages (K=3).', w / 2, h - 6);
  };

  // Step-waveform helper: bits array (0/1) → drawn digital signal in a box
  function stepWave(ctx, bits, box, color, hi, lo) {
    const n = bits.length, X = v => box.x + v * box.w / n, Y = b => b ? hi : lo;
    ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(X(0), Y(bits[0]));
    for (let i = 0; i < n; i++) { ctx.lineTo(X(i + 1), Y(bits[i])); if (i + 1 < n) ctx.lineTo(X(i + 1), Y(bits[i + 1])); }
    ctx.stroke();
  }

  // Async serial frame (UART / RS-232): idle-start-8data-stop
  T.serialFrame = function (host, spec) {
    const card = makeCard(host, spec, 540, 230);
    function draw(val) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const bits = [1, 1, 0]; for (let i = 0; i < 8; i++) bits.push((val >> i) & 1); bits.push(1, 1);
      const labels = ['idle', 'idle', 'START', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'STOP', 'idle'];
      const box = { x: 30, w: w - 46 }, top = 46, bot = h - 52, n = bits.length;
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
      for (let i = 0; i <= n; i++) { const x = box.x + i * box.w / n; ctx.beginPath(); ctx.moveTo(x, top - 6); ctx.lineTo(x, bot + 6); ctx.stroke(); if (i < n) { ctx.fillStyle = (i >= 3 && i <= 10) ? C.teal : (labels[i] === 'START' || labels[i] === 'STOP' ? C.orange : C.dim); ctx.fillText(labels[i], x + box.w / n / 2, bot + 18); } }
      stepWave(ctx, bits, { x: box.x, w: box.w }, C.blue, top, bot);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('byte 0x' + val.toString(16).toUpperCase().padStart(2, '0') + ' (' + val + ') sent LSB-first · 8N1 = 10 bits on the wire for 8 data → 80% efficient', 30, 26);
    }
    draw(0x53);
    slider(card.controls, { label: 'data byte', min: 0, max: 255, step: 1, value: 0x53, fmt: v => '0x' + Math.round(v).toString(16).toUpperCase() }, v => draw(Math.round(v)));
  };

  // Differential signalling & common-mode noise rejection (RS-422/485/LVDS/1553)
  T.diffSignal = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(noise) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const N = 240, sw = 0.5, data = i => (Math.floor(i / 30) % 2 ? 1 : -1);
      const cm = []; for (let i = 0; i < N; i++) cm.push(noise * (Math.sin(i * 0.06) + 0.4 * Math.sin(i * 0.31)));
      const b1 = { x: 52, y: 16, w: w - 72, h: (h - 74) / 2 };
      const a1 = drawAxes(ctx, b1, { xr: [0, N], yr: [-2, 2], xlabel: '', ylabel: 'A, B (V)' });
      const A = [], B = []; for (let i = 0; i < N; i++) { A.push([i, sw * data(i) + cm[i]]); B.push([i, -sw * data(i) + cm[i]]); }
      line(ctx, a1, A, C.blue, 1.6); line(ctx, a1, B, C.orange, 1.6);
      legend(ctx, b1, [{ label: 'A (D+)', color: C.blue }, { label: 'B (D−)', color: C.orange }]);
      const b2 = { x: 52, y: 20 + b1.h + 34, w: w - 72, h: (h - 74) / 2 };
      const a2 = drawAxes(ctx, b2, { xr: [0, N], yr: [-1.5, 1.5], xlabel: 'time', ylabel: 'A − B' });
      const D = []; for (let i = 0; i < N; i++) D.push([i, 2 * sw * data(i)]); line(ctx, a2, D, C.teal, 2.4);
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('the same noise rides on BOTH wires; the receiver takes A−B, so the common-mode noise cancels', b1.x + 4, b1.y + 12);
    }
    draw(0.6);
    slider(card.controls, { label: 'common-mode noise', min: 0, max: 1.4, step: 0.05, value: 0.6, fmt: v => v.toFixed(2) + ' V' }, v => draw(v));
  };

  // Bus topology: multidrop vs point-to-point
  T.busTopology = function (host, spec) {
    const card = makeCard(host, spec, 520, 250);
    const multidrop = spec.multidrop !== false;
    let N = spec.nodes || 4;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const busY = h / 2, x0 = 55, x1 = w - 55;
      ctx.strokeStyle = C.blue; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, busY); ctx.lineTo(x1, busY); ctx.stroke();
      ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      [x0, x1].forEach(x => { ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, busY - 9); ctx.lineTo(x, busY + 9); ctx.stroke(); ctx.fillStyle = C.orange; ctx.fillText('R', x, busY + 22); });
      for (let i = 0; i < N; i++) {
        const x = x0 + (x1 - x0) * (i + 0.5) / N, ny = i % 2 ? busY + 46 : busY - 46;
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, busY); ctx.lineTo(x, ny > busY ? ny - 14 : ny + 14); ctx.stroke();
        ctx.fillStyle = C.box; ctx.strokeStyle = C.teal; ctx.lineWidth = 1.5; ctx.fillRect(x - 24, ny - 13, 48, 26); ctx.strokeRect(x - 24, ny - 13, 48, 26);
        ctx.fillStyle = C.text; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(i === 0 ? 'Ctrl' : 'Dev ' + i, x, ny + 3);
      }
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(multidrop ? (N + ' devices share one bus (multidrop) · terminated (R) at both ends') : 'point-to-point link (one driver, one receiver)', 30, 22);
    }
    draw();
    if (multidrop) slider(card.controls, { label: 'devices', min: 2, max: 16, step: 1, value: N }, v => { N = Math.round(v); draw(); });
  };

  // SPI timing with CPOL/CPHA modes
  T.spiTiming = function (host, spec) {
    const card = makeCard(host, spec, 540, 300);
    let mode = 0;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const cpol = (mode >> 1) & 1, cpha = mode & 1, N = 8, x0 = 70, x1 = w - 20, bw = (x1 - x0) / N;
      const rows = [{ lbl: 'SS', y: 40 }, { lbl: 'SCLK', y: 100 }, { lbl: 'MOSI', y: 170 }, { lbl: 'MISO', y: 240 }];
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
      rows.forEach(r => ctx.fillText(r.lbl, x0 - 8, r.y + 4));
      const hi = -16, lo = 16;
      // SS active low (0 during transfer)
      ctx.strokeStyle = C.purple; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x0 - 30, 40 + hi); ctx.lineTo(x0, 40 + hi); ctx.lineTo(x0, 40 + lo); ctx.lineTo(x1, 40 + lo); ctx.lineTo(x1, 40 + hi); ctx.lineTo(x1 + 10, 40 + hi); ctx.stroke();
      // SCLK: N pulses, idle = cpol
      ctx.strokeStyle = C.blue; ctx.lineWidth = 2.2; ctx.beginPath(); let cy = 100; const idle = cpol ? hi : lo;
      ctx.moveTo(x0, cy + idle);
      for (let i = 0; i < N; i++) { const a = x0 + i * bw, m = a + bw / 2, b = a + bw; ctx.lineTo(m, cy + idle); ctx.lineTo(m, cy + (cpol ? lo : hi)); ctx.lineTo(b, cy + (cpol ? lo : hi)); ctx.lineTo(b, cy + idle); }
      ctx.stroke();
      // data bits (a byte) for MOSI/MISO
      const dv = 0xB4, dv2 = 0x6D;
      [[170, dv, C.teal], [240, dv2, C.orange]].forEach(g => {
        ctx.strokeStyle = g[2]; ctx.lineWidth = 2.2; ctx.beginPath();
        for (let i = 0; i < N; i++) { const bit = (g[1] >> (7 - i)) & 1, a = x0 + i * bw, b = a + bw, y = g[0] + (bit ? hi : lo); if (i === 0) ctx.moveTo(a, y); else ctx.lineTo(a, y); ctx.lineTo(b, y); }
        ctx.stroke();
      });
      // sample-edge markers
      ctx.strokeStyle = C.red; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) { const edge = x0 + i * bw + (cpha ? bw : bw / 2); ctx.beginPath(); ctx.moveTo(edge, 155); ctx.lineTo(edge, 258); ctx.stroke(); }
      ctx.setLineDash([]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Mode ' + mode + ' (CPOL=' + cpol + ', CPHA=' + cpha + ') · red = sample edges · 1 bit per clock, full-duplex', 30, 20);
    }
    draw();
    chooser(card.controls, [0, 1, 2, 3].map(m => ({ v: m, l: 'Mode ' + m })), 0, v => { mode = v; draw(); });
  };

  // Cable length vs data rate trade-off (RS-422/485/LVDS)
  T.lengthVsRate = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(rate) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [1e4, 1e8], yr: [1, 2000], logx: true, logy: true, xlabel: 'data rate (bps)', ylabel: 'max cable length (m)', xtickfmt: t => t >= 1e6 ? (t / 1e6) + 'M' : (t / 1e3) + 'k' });
      // rule of thumb: length·rate ≈ 1.2e8 (10Mbps→12m, 100kbps→1200m), capped 1200 m
      const pts = []; for (let e = 4; e <= 8; e += 0.05) { const r = Math.pow(10, e); pts.push([r, Math.min(1200, 1.2e8 / r)]); }
      line(ctx, ax, pts, C.blue, 2.5);
      const L = Math.min(1200, 1.2e8 / rate);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(rate), ax.y + ax.h); ctx.lineTo(ax.fx(rate), ax.fy(L)); ctx.lineTo(ax.x, ax.fy(L)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(ax.fx(rate), ax.fy(L), 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('at ' + (rate >= 1e6 ? (rate / 1e6) + ' Mbps' : (rate / 1e3) + ' kbps') + ' → up to ~' + L.toFixed(0) + ' m (faster = shorter reach)', ax.x + 8, ax.y + 16);
    }
    draw(1e6);
    slider(card.controls, { label: 'data rate', min: 4, max: 7, step: 0.1, value: 6, fmt: v => { const r = Math.pow(10, v); return r >= 1e6 ? (r / 1e6).toFixed(1) + ' Mbps' : (r / 1e3).toFixed(0) + ' kbps'; } }, v => draw(Math.pow(10, v)));
  };

  // Manchester encoding (MIL-STD-1553)
  T.manchester = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 540, 260);
    const data = [1, 0, 1, 1, 0, 0, 1, 0], N = data.length, x0 = 40, x1 = w - 16, bw = (x1 - x0) / N;
    // NRZ (top)
    const b1 = { top: 44, bot: 108 };
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('NRZ data', 8, 40);
    stepWave(ctx, data, { x: x0, w: x1 - x0 }, C.dim, b1.top, b1.bot);
    // Manchester (bottom): each bit = transition mid-bit; 1 = hi→lo (or lo→hi per convention). Use IEEE: 0 = lo→hi, 1 = hi→lo? 1553 uses 1 = hi-lo.
    const b2 = { top: 150, bot: 214 };
    ctx.fillStyle = C.teal; ctx.fillText('Manchester-II (self-clocking)', 8, 146);
    ctx.strokeStyle = C.blue; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let i = 0; i < N; i++) { const a = x0 + i * bw, m = a + bw / 2, b = a + bw; const first = data[i] ? b2.top : b2.bot, second = data[i] ? b2.bot : b2.top; if (i === 0) ctx.moveTo(a, first); else ctx.lineTo(a, first); ctx.lineTo(m, first); ctx.lineTo(m, second); ctx.lineTo(b, second); }
    ctx.stroke();
    ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = C.dim;
    for (let i = 0; i < N; i++) { const x = x0 + i * bw; ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, 220); ctx.stroke(); ctx.fillStyle = C.text; ctx.fillText(data[i], x + bw / 2, 235); }
    ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('every bit has a mid-bit transition → the clock is embedded in the data (no separate clock wire)', 30, h - 6);
  };

  // AXI VALID/READY handshake
  T.axiHandshake = function (host, spec) {
    const card = makeCard(host, spec, 540, 280);
    function draw(stall) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const N = 8, x0 = 80, x1 = w - 20, bw = (x1 - x0) / N;
      // VALID high from beat1; READY high except a stall window
      const valid = [0, 1, 1, 1, 1, 1, 1, 0];
      const ready = []; for (let i = 0; i < N; i++) ready.push((i >= 2 && i < 2 + stall) ? 0 : 1);
      const rows = [{ lbl: 'ACLK', y: 40 }, { lbl: 'VALID', y: 100 }, { lbl: 'READY', y: 160 }, { lbl: 'DATA', y: 220 }];
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; rows.forEach(r => ctx.fillText(r.lbl, x0 - 8, r.y + 4));
      const hi = -16, lo = 16;
      // clock
      ctx.strokeStyle = C.dim; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < N; i++) { const a = x0 + i * bw, m = a + bw / 2, b = a + bw; ctx.moveTo(a, 40 + lo); ctx.lineTo(m, 40 + lo); ctx.lineTo(m, 40 + hi); ctx.lineTo(b, 40 + hi); ctx.lineTo(b, 40 + lo); } ctx.stroke();
      stepWave(ctx, valid, { x: x0, w: x1 - x0 }, C.blue, 100 + hi, 100 + lo);
      stepWave(ctx, ready, { x: x0, w: x1 - x0 }, C.orange, 160 + hi, 160 + lo);
      // DATA beats + transfer markers when valid&ready
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2.2; ctx.strokeRect(x0, 220 + hi, x1 - x0, lo - hi);
      let count = 0;
      for (let i = 0; i < N; i++) { if (valid[i] && ready[i]) { count++; const a = x0 + i * bw; ctx.fillStyle = 'rgba(99,230,190,0.25)'; ctx.fillRect(a, 220 + hi, bw, lo - hi); ctx.fillStyle = C.teal; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('beat' + count, a + bw / 2, 220 + 3); } }
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('a transfer happens ONLY when VALID and READY are both high · ' + count + ' beats moved (READY low = back-pressure/stall)', 30, 20);
    }
    draw(1);
    slider(card.controls, { label: 'stall length', min: 0, max: 3, step: 1, value: 1, fmt: v => v + ' clk' }, v => draw(Math.round(v)));
  };

  // Packet / word / frame bit-field structure diagram
  T.packetStructure = function (host, spec) {
    const words = spec.words || [];
    const rowH = 46, gap = 30, H = 22 + words.length * (rowH + gap);
    const card = makeCard(host, spec, 560, Math.max(120, H));
    const { ctx, w, h } = card;
    const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
    const pal = [C.blue, C.teal, C.orange, C.purple, C.red];
    const x0 = 14, x1 = w - 14, W = x1 - x0;
    words.forEach((word, wi) => {
      const y = 26 + wi * (rowH + gap);
      const total = word.fields.reduce((a, f) => a + f.bits, 0);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(word.name + (word.note ? '  — ' + word.note : ''), x0, y - 7);
      ctx.fillStyle = C.dim; ctx.textAlign = 'right'; ctx.fillText(total + (word.unit || ' bits'), x1, y - 7);
      let cx = x0;
      word.fields.forEach((f, fi) => {
        const fw = W * f.bits / total, col = f.c || pal[fi % pal.length];
        ctx.fillStyle = rgba(col, 0.18); ctx.fillRect(cx, y, fw, rowH);
        ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.strokeRect(cx, y, fw, rowH);
        ctx.fillStyle = C.text; ctx.textAlign = 'center';
        if (fw < 24) { ctx.save(); ctx.translate(cx + fw / 2, y + rowH / 2 + 2); ctx.rotate(-Math.PI / 2); ctx.font = '8px sans-serif'; ctx.fillText(f.l, 0, 3); ctx.restore(); }
        else { ctx.font = (fw < 66 ? '9px' : '11px') + ' sans-serif'; ctx.fillText(f.l, cx + fw / 2, y + rowH / 2); }
        ctx.fillStyle = C.dim; ctx.font = '8px sans-serif'; ctx.fillText('' + f.bits, cx + fw / 2, y + rowH - 5);
        cx += fw;
      });
    });
  };

  // MIL-STD-1553 message formats (word sequence on the bus)
  T.msgSequence1553 = function (host, spec) {
    const card = makeCard(host, spec, 540, 250);
    const F = {
      'bc-rt': { l: 'BC → RT (receive)', seq: [['C', 'BC'], ['D', 'BC'], ['D', 'BC'], ['G', ''], ['S', 'RT']] },
      'rt-bc': { l: 'RT → BC (transmit)', seq: [['C', 'BC'], ['G', ''], ['S', 'RT'], ['D', 'RT'], ['D', 'RT']] },
      'rt-rt': { l: 'RT → RT', seq: [['C', 'BC'], ['C', 'BC'], ['G', ''], ['S', 'RT'], ['D', 'RT'], ['D', 'RT'], ['G', ''], ['S', 'RT']] },
      'mode': { l: 'Mode command (no data)', seq: [['C', 'BC'], ['G', ''], ['S', 'RT']] }
    };
    const col = { C: C.blue, D: C.teal, S: C.orange };
    const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
    let cur = 'bc-rt';
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const seq = F[cur].seq, x0 = 20, x1 = w - 20, y = h / 2 - 6, bh = 48;
      const units = seq.length, bw = (x1 - x0) / units;
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x0, y + bh + 22); ctx.lineTo(x1, y + bh + 22); ctx.stroke();
      let x = x0;
      seq.forEach(s => {
        if (s[0] === 'G') { ctx.fillStyle = C.dim; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('gap', x + bw / 2, y + bh / 2 + 3); }
        else {
          const c = col[s[0]], name = s[0] === 'C' ? 'Command' : s[0] === 'S' ? 'Status' : 'Data';
          ctx.fillStyle = rgba(c, 0.2); ctx.fillRect(x + 4, y, bw - 8, bh); ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.strokeRect(x + 4, y, bw - 8, bh);
          ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(name, x + bw / 2, y + bh / 2 - 2);
          ctx.fillStyle = C.dim; ctx.font = '9px sans-serif'; ctx.fillText('word', x + bw / 2, y + bh / 2 + 12);
          ctx.fillStyle = s[1] === 'BC' ? C.purple : C.teal; ctx.font = '10px sans-serif'; ctx.fillText(s[1] + ' sends', x + bw / 2, y - 8);
        }
        x += bw;
      });
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(F[cur].l + ' · every word is 20 bit-times (20 µs) · the RT answers within 4–12 µs', 20, 22);
    }
    draw();
    chooser(card.controls, Object.keys(F).map(k => ({ v: k, l: F[k].l.split(' ')[0] })), 'bc-rt', v => { cur = v; draw(); });
  };

  // AXI burst types: how the address advances across beats
  T.axiBurst = function (host, spec) {
    const card = makeCard(host, spec, 520, 260);
    let type = 'INCR';
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const len = 4, size = 4, base = 0x108, boundary = len * size;
      const addr = i => type === 'FIXED' ? base : type === 'INCR' ? base + i * size : (base - (base % boundary) + ((base % boundary + i * size) % boundary));
      const x0 = 30, x1 = w - 20, y = 70, bh = 60, bw = (x1 - x0) / len;
      for (let i = 0; i < len; i++) {
        const x = x0 + i * bw;
        ctx.fillStyle = 'rgba(77,171,247,0.14)'; ctx.fillRect(x + 6, y, bw - 12, bh); ctx.strokeStyle = C.blue; ctx.lineWidth = 1.6; ctx.strokeRect(x + 6, y, bw - 12, bh);
        ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('beat ' + i, x + bw / 2, y + 20);
        ctx.fillStyle = C.orange; ctx.font = '13px monospace'; ctx.fillText('0x' + addr(i).toString(16).toUpperCase(), x + bw / 2, y + 42);
      }
      const notes = { FIXED: 'address stays fixed (e.g. reading one FIFO/register repeatedly)', INCR: 'address increments by the transfer size each beat (normal memory access)', WRAP: 'increments then wraps at a boundary (cache-line fills — critical word first)' };
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(type + ' burst, ' + len + ' beats × ' + size + ' bytes from 0x' + base.toString(16).toUpperCase(), 30, 30);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.fillText(notes[type], 30, h - 16);
    }
    draw();
    chooser(card.controls, ['FIXED', 'INCR', 'WRAP'].map(t => ({ v: t, l: t })), 'INCR', v => { type = v; draw(); });
  };

  // VCO tuning curve: f_out = f0 + Kvco·Vctrl
  T.vcoTune = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const f0 = 1000;
    function draw(kvco) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const ax = drawAxes(ctx, plotBox(w, h), { xr: [-1, 1], yr: [f0 - kvco * 1.15, f0 + kvco * 1.15], xlabel: 'control voltage Vctrl (V)', ylabel: 'output frequency (MHz)' });
      const pts = []; for (let v = -1; v <= 1; v += 0.02) pts.push([v, f0 + kvco * v]); line(ctx, ax, pts, C.blue, 2.5);
      const vm = 0.3, fm = f0 + kvco * vm;
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(vm), ax.y + ax.h); ctx.lineTo(ax.fx(vm), ax.fy(fm)); ctx.lineTo(ax.x, ax.fy(fm)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(ax.fx(vm), ax.fy(fm), 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('f = f0 + Kvco·V · slope Kvco = ' + kvco + ' MHz/V — steeper tunes wider but amplifies control-line noise', ax.x + 8, ax.y + 16);
    }
    draw(50);
    slider(card.controls, { label: 'Kvco', min: 10, max: 200, step: 10, value: 50, fmt: v => v + ' MHz/V' }, v => draw(v));
  };

  // NCO: phase accumulator ramp + synthesized sine
  T.ncoDDS = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const Nbits = 6, M = Math.pow(2, Nbits);
    function draw(fcw) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const b1 = { x: 52, y: 16, w: w - 72, h: (h - 74) / 2 };
      const a1 = drawAxes(ctx, b1, { xr: [0, 64], yr: [0, M], xlabel: '', ylabel: 'phase acc' });
      const ph = []; let acc = 0; for (let n = 0; n < 64; n++) { ph.push([n, acc]); acc = (acc + fcw) % M; } line(ctx, a1, ph, C.teal, 1.6);
      const b2 = { x: 52, y: 20 + b1.h + 34, w: w - 72, h: (h - 74) / 2 };
      const a2 = drawAxes(ctx, b2, { xr: [0, 64], yr: [-1.2, 1.2], xlabel: 'clock cycles', ylabel: 'sine out' });
      const s = []; for (let n = 0; n <= 64; n++) s.push([n, Math.sin(TAU * ((fcw * n) % M) / M)]); line(ctx, a2, s, C.blue, 2);
      ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('phase ramp wraps every 2^N=' + M + ' · f_out = FCW·f_clk/2^N = ' + fcw + '/' + M + ' = ' + (fcw / M).toFixed(3) + '·f_clk', b1.x + 4, b1.y + 12);
    }
    draw(5);
    slider(card.controls, { label: 'freq word (FCW)', min: 1, max: 31, step: 1, value: 5 }, v => draw(Math.round(v)));
  };

  // CFO: a spinning QPSK constellation
  T.cfoSpin = function (host, spec) {
    const card = makeCard(host, spec, 380, 360);
    const pts = [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(p => [p[0] / Math.SQRT2, p[1] / Math.SQRT2]);
    function draw(cfo) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 30, S = R / 1.5;
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      for (let k = 0; k < 64; k++) { const ang = cfo * k * Math.PI / 180, p = pts[k % 4]; const ex = p[0] * Math.cos(ang) - p[1] * Math.sin(ang), ey = p[0] * Math.sin(ang) + p[1] * Math.cos(ang); ctx.fillStyle = 'rgba(77,171,247,0.6)'; ctx.beginPath(); ctx.arc(cx + ex * S, cy - ey * S, 3, 0, TAU); ctx.fill(); }
      pts.forEach(p => { ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(cx + p[0] * S, cy - p[1] * S, 4, 0, TAU); ctx.fill(); });
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(cfo === 0 ? 'no CFO — the points stay put' : 'CFO rotates each symbol by 2π·Δf·t', 12, 20);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.fillText('phase drift ' + cfo + '° per symbol → a spinning constellation', 12, 38);
    }
    draw(15);
    slider(card.controls, { label: 'CFO', min: 0, max: 60, step: 2, value: 15, fmt: v => v + '°/sym' }, v => draw(v));
  };

  // DLL: a delay line aligning a clock edge to a reference
  T.dllAlign = function (host, spec) {
    const card = makeCard(host, spec, 540, 250);
    function draw(delay) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const x0 = 60, x1 = w - 16, T = 80;
      function clk(y, shift, color, lbl) {
        ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(lbl, 8, y + 4);
        ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.beginPath();
        for (let x = x0; x < x1 - T; x += T) { const a = x + shift, hi = y - 16, lo = y + 16; ctx.moveTo(a, lo); ctx.lineTo(a, hi); ctx.lineTo(a + T / 2, hi); ctx.lineTo(a + T / 2, lo); ctx.lineTo(a + T, lo); }
        ctx.stroke();
      }
      clk(70, 0, C.blue, 'ref clk'); clk(150, delay, C.teal, 'delayed');
      const aligned = (delay % T) < 5 || (delay % T) > T - 5;
      ctx.strokeStyle = aligned ? C.teal : C.orange; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x0 + delay, 46); ctx.lineTo(x0 + delay, 170); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('a DLL adjusts a DELAY LINE (not a VCO) until the edge lines up' + (aligned ? ' — LOCKED' : ''), 20, 22);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.fillText('delay = ' + delay.toFixed(0) + ' · a pure delay → first-order loop, so no jitter accumulation (unlike a PLL)', 20, h - 10);
    }
    draw(30);
    slider(card.controls, { label: 'delay', min: 0, max: 80, step: 2, value: 30 }, v => draw(v));
  };

  // LDPC Tanner (bipartite) graph
  T.tannerGraph = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const nV = 6, nC = 3, vY = h - 62, cY = 62;
    const vx = i => 55 + i * (w - 110) / (nV - 1), cx = i => 120 + i * (w - 240) / (nC - 1);
    const edges = [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1], [3, 1], [4, 1], [2, 1], [0, 2], [4, 2], [5, 2], [3, 2]];
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.3; edges.forEach(e => { ctx.beginPath(); ctx.moveTo(vx(e[0]), vY - 14); ctx.lineTo(cx(e[1]), cY + 14); ctx.stroke(); });
    for (let i = 0; i < nV; i++) { ctx.fillStyle = C.box; ctx.strokeStyle = C.blue; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(vx(i), vY, 14, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('v' + i, vx(i), vY + 4); }
    for (let i = 0; i < nC; i++) { ctx.fillStyle = C.box; ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.fillRect(cx(i) - 15, cY - 15, 30, 30); ctx.strokeRect(cx(i) - 15, cY - 15, 30, 30); ctx.fillStyle = C.text; ctx.fillText('+', cx(i), cY + 5); }
    ctx.fillStyle = C.blue; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('variable nodes = code bits', 18, vY + 34);
    ctx.fillStyle = C.orange; ctx.fillText('check nodes = parity equations', 18, cY - 24);
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.fillText('sparse edges → belief-propagation messages flow until every parity check is satisfied', w / 2, h - 8);
  };

  // Turbo encoder block diagram
  T.turboEncoder = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 540, 240);
    const box = (x, y, bw, bh, lbl, col) => { ctx.fillStyle = C.box; ctx.strokeStyle = col; ctx.lineWidth = 1.7; ctx.fillRect(x, y, bw, bh); ctx.strokeRect(x, y, bw, bh); ctx.fillStyle = C.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(lbl, x + bw / 2, y + bh / 2 + 4); };
    const inx = 34, iny = h / 2;
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('input', 8, iny + 4);
    ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(inx, iny, 4, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(inx, iny); ctx.lineTo(w - 24, iny - 78); ctx.stroke();
    ctx.fillStyle = C.teal; ctx.textAlign = 'right'; ctx.fillText('systematic (data)', w - 24, iny - 82);
    box(190, iny - 74, 96, 30, 'RSC encoder 1', C.blue);
    ctx.beginPath(); ctx.moveTo(inx, iny); ctx.lineTo(190, iny - 59); ctx.stroke(); ctx.beginPath(); ctx.moveTo(286, iny - 59); ctx.lineTo(w - 24, iny - 34); ctx.stroke();
    ctx.fillStyle = C.blue; ctx.fillText('parity 1', w - 24, iny - 30);
    box(150, iny + 34, 84, 30, 'Interleaver π', C.purple); box(270, iny + 34, 96, 30, 'RSC encoder 2', C.blue);
    ctx.strokeStyle = C.dim; ctx.beginPath(); ctx.moveTo(inx, iny); ctx.lineTo(150, iny + 49); ctx.stroke(); ctx.beginPath(); ctx.moveTo(234, iny + 49); ctx.lineTo(270, iny + 49); ctx.stroke(); ctx.beginPath(); ctx.moveTo(366, iny + 49); ctx.lineTo(w - 24, iny + 74); ctx.stroke();
    ctx.fillStyle = C.blue; ctx.fillText('parity 2', w - 24, iny + 78);
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '11px sans-serif'; ctx.fillText('two recursive encoders (one on interleaved bits) → rate-1/3: systematic + parity 1 + parity 2', w / 2, h - 8);
  };

  // Normal distribution: Gaussian pdf with mu/sigma, shaded +/-k-sigma band + enclosed probability
  T.ndPdf = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    let mu = 0, sig = 1, kk = 1;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const lo = -6, hi = 6, ymax = 1 / (0.5 * Math.sqrt(TAU)) * 1.1;
      const ax = drawAxes(ctx, box, { xr: [lo, hi], yr: [0, ymax], xlabel: 'x', ylabel: 'probability density' });
      const pdf = x => Math.exp(-((x - mu) * (x - mu)) / (2 * sig * sig)) / (sig * Math.sqrt(TAU));
      // shaded band mu +/- k*sigma
      ctx.save(); ctx.beginPath(); ctx.rect(ax.x, ax.y, ax.w, ax.h); ctx.clip();
      ctx.fillStyle = 'rgba(99,230,190,0.30)';
      const a = mu - kk * sig, b = mu + kk * sig;
      ctx.beginPath(); ctx.moveTo(ax.fx(a), ax.fy(0));
      for (let x = a; x <= b; x += 0.02) ctx.lineTo(ax.fx(x), ax.fy(pdf(x)));
      ctx.lineTo(ax.fx(b), ax.fy(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      // curve
      const pts = []; for (let x = lo; x <= hi; x += 0.02) pts.push([x, pdf(x)]); line(ctx, ax, pts, C.blue, 2.5);
      // mean marker
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(mu), ax.fy(0)); ctx.lineTo(ax.fx(mu), ax.fy(pdf(mu))); ctx.stroke(); ctx.setLineDash([]);
      const prob = 1 - 2 * Q(kk); // P(|x-mu| < k*sigma), sigma-independent
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('mu = ' + mu.toFixed(1) + ', sigma = ' + sig.toFixed(2) + '  ->  P(|x-mu| < ' + kk.toFixed(1) + 'sigma) = ' + (prob * 100).toFixed(1) + '%', ax.x + 8, ax.y + 16);
      ctx.fillStyle = C.teal; ctx.font = '11px sans-serif';
      ctx.fillText('68-95-99.7 rule: 1sigma~68%, 2sigma~95%, 3sigma~99.7%', ax.x + 8, ax.y + 34);
    }
    draw();
    slider(card.controls, { label: 'mean mu', min: -3, max: 3, step: 0.1, value: 0, fmt: v => v.toFixed(1) }, v => { mu = v; draw(); });
    slider(card.controls, { label: 'std dev sigma', min: 0.5, max: 2.5, step: 0.05, value: 1, fmt: v => v.toFixed(2) }, v => { sig = v; draw(); });
    slider(card.controls, { label: 'band k', min: 0.5, max: 3, step: 0.5, value: 1, fmt: v => v.toFixed(1) + ' sigma' }, v => { kk = v; draw(); });
  };

  // Central-Limit demo: histogram of sum of N uniforms approaches a bell
  T.ndClt = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(N) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const trials = 6000, bins = 41;
      // sum of N uniforms(0,1): mean N/2, variance N/12 -> normalize to zero mean, unit-ish spread
      const mean = N / 2, sd = Math.sqrt(N / 12);
      const lim = 4, hist = new Array(bins).fill(0);
      for (let t = 0; t < trials; t++) {
        let s = 0; for (let i = 0; i < N; i++) s += Math.random();
        const z = (s - mean) / sd; const bi = Math.floor((z / lim + 1) / 2 * bins);
        if (bi >= 0 && bi < bins) hist[bi]++;
      }
      const yr = [0, 0.5];
      const ax = drawAxes(ctx, box, { xr: [-lim, lim], yr, xlabel: 'normalized sum (z)', ylabel: 'probability density' });
      ctx.fillStyle = 'rgba(77,171,247,0.35)';
      for (let bi = 0; bi < bins; bi++) {
        const x0 = -lim + bi / bins * 2 * lim, x1 = -lim + (bi + 1) / bins * 2 * lim;
        const dens = hist[bi] / trials / ((2 * lim) / bins);
        ctx.fillRect(ax.fx(x0), ax.fy(dens), ax.fx(x1) - ax.fx(x0) - 1, ax.fy(0) - ax.fy(dens));
      }
      const pts = []; for (let x = -lim; x <= lim; x += 0.04) pts.push([x, Math.exp(-x * x / 2) / Math.sqrt(TAU)]); line(ctx, ax, pts, C.orange, 2.5);
      legend(ctx, box, [{ label: 'N uniforms', color: C.blue }, { label: 'Gaussian limit', color: C.orange }]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('sum of N = ' + N + ' uniform' + (N > 1 ? 's' : '') + (N === 1 ? ' -> flat (not yet Gaussian)' : ' -> approaching the bell'), ax.x + 8, ax.y + 16);
    }
    draw(3);
    slider(card.controls, { label: 'summed uniforms N', min: 1, max: 12, step: 1, value: 3 }, v => draw(Math.round(v)));
  };

  // Error function: standard-normal curve with shaded Q(x)/erfc tail region + value
  T.erfTail = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(xv) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const lo = -4, hi = 4;
      const ax = drawAxes(ctx, box, { xr: [lo, hi], yr: [0, 0.46], xlabel: 'x (standard deviations)', ylabel: 'phi(x)' });
      const phi = x => Math.exp(-x * x / 2) / Math.sqrt(TAU);
      // shade the tail x >= xv
      ctx.save(); ctx.beginPath(); ctx.rect(ax.x, ax.y, ax.w, ax.h); ctx.clip();
      ctx.fillStyle = 'rgba(255,107,107,0.35)';
      ctx.beginPath(); ctx.moveTo(ax.fx(xv), ax.fy(0));
      for (let x = xv; x <= hi; x += 0.02) ctx.lineTo(ax.fx(x), ax.fy(phi(x)));
      ctx.lineTo(ax.fx(hi), ax.fy(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      const pts = []; for (let x = lo; x <= hi; x += 0.02) pts.push([x, phi(x)]); line(ctx, ax, pts, C.blue, 2.5);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(xv), ax.fy(0)); ctx.lineTo(ax.fx(xv), ax.fy(phi(xv))); ctx.stroke(); ctx.setLineDash([]);
      const q = Q(xv);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Q(' + xv.toFixed(2) + ') = ' + q.toExponential(2) + '  (shaded tail area)', ax.x + 8, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif';
      ctx.fillText('Q(x) = 0.5*erfc(x/sqrt2); erfc(' + (xv / Math.SQRT2).toFixed(2) + ') = ' + (2 * q).toExponential(2), ax.x + 8, ax.y + 34);
    }
    draw(1);
    slider(card.controls, { label: 'threshold x', min: -1, max: 4, step: 0.05, value: 1, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // Error function: BPSK BER = Q(sqrt(2 Eb/N0)) vs Eb/N0 (dB) with a draggable operating point
  T.erfBer = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(mark) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, {
        xr: [0, 12], yr: [1e-6, 0.5], logy: true, xlabel: 'Eb/N0 (dB)', ylabel: 'BER = Q(sqrt(2 Eb/N0))',
        ytickfmt: t => t.toExponential(0).replace('e+0', '').replace('e', 'e')
      });
      const pts = []; for (let db = 0; db <= 12; db += 0.25) { const b = Q(Math.sqrt(2 * lin(db))); pts.push([db, Math.max(b, 1e-7)]); }
      line(ctx, ax, pts, C.blue, 2.4);
      const b0 = Q(Math.sqrt(2 * lin(mark)));
      const mx = ax.fx(mark), my = ax.fy(Math.max(b0, 1e-7));
      ctx.strokeStyle = C.dim; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(mx, ax.y); ctx.lineTo(mx, ax.y + ax.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(mx, my, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Eb/N0 = ' + mark + ' dB  ->  BER = ' + b0.toExponential(2), ax.x + 8, ax.y + ax.h - 12);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif';
      ctx.fillText('the Q-function turns link SNR into an error probability', ax.x + 8, ax.y + 14);
    }
    draw(8);
    slider(card.controls, { label: 'Eb/N0', min: 0, max: 12, step: 0.5, value: 8, fmt: v => v + ' dB' }, v => draw(v));
  };

  // Rayleigh distribution: pdf with sigma slider, mark mean = sigma*sqrt(pi/2) and mode = sigma
  T.rayPdf = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    function draw(sig) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const hi = 6, ymax = (1 / Math.E) / 0.5 * 1.1; // roughly peak at r=sigma
      const pdf = r => (r / (sig * sig)) * Math.exp(-(r * r) / (2 * sig * sig));
      let pk = 0; for (let r = 0; r <= hi; r += 0.02) pk = Math.max(pk, pdf(r));
      const ax = drawAxes(ctx, box, { xr: [0, hi], yr: [0, pk * 1.15], xlabel: 'envelope r', ylabel: 'probability density' });
      const pts = []; for (let r = 0; r <= hi; r += 0.02) pts.push([r, pdf(r)]); line(ctx, ax, pts, C.blue, 2.5);
      const mode = sig, mean = sig * Math.sqrt(Math.PI / 2);
      ctx.strokeStyle = C.teal; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(mode), ax.fy(0)); ctx.lineTo(ax.fx(mode), ax.fy(pdf(mode))); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(mean), ax.fy(0)); ctx.lineTo(ax.fx(mean), ax.fy(pdf(mean))); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.teal; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('mode = sigma', ax.fx(mode), ax.fy(pdf(mode)) - 8);
      ctx.fillStyle = C.orange; ctx.fillText('mean', ax.fx(mean), ax.fy(pdf(mean)) - 8);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('sigma = ' + sig.toFixed(2) + '  ->  mode = ' + mode.toFixed(2) + ', mean = sigma*sqrt(pi/2) = ' + mean.toFixed(2), ax.x + 8, ax.y + 16);
    }
    draw(1);
    slider(card.controls, { label: 'scale sigma', min: 0.4, max: 2.2, step: 0.05, value: 1, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // Rayleigh: envelope-vs-time from two Gaussian quadratures + threshold line (deep fades)
  T.rayEnv = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const N = 300, I = [], Qd = [];
    // correlated-ish random walk of the two quadratures for a smooth fading envelope
    (function () { let i = gauss(), q = gauss(); for (let n = 0; n < N; n++) { i = 0.92 * i + 0.39 * gauss(); q = 0.92 * q + 0.39 * gauss(); I.push(i); Qd.push(q); } })();
    const env = I.map((v, n) => Math.sqrt(v * v + Qd[n] * Qd[n]));
    function draw(thrDb) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const rms = Math.sqrt(env.reduce((a, e) => a + e * e, 0) / N);
      const ax = drawAxes(ctx, box, { xr: [0, N], yr: [-30, 12], xlabel: 'time (samples)', ylabel: 'envelope (dB re RMS)' });
      const pts = env.map((e, n) => [n, dB((e * e) / (rms * rms) + 1e-6)]); line(ctx, ax, pts, C.blue, 1.6);
      ctx.strokeStyle = C.orange; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(thrDb)); ctx.lineTo(ax.x + ax.w, ax.fy(thrDb)); ctx.stroke(); ctx.setLineDash([]);
      let fades = 0; for (let n = 0; n < N; n++) { const lv = dB((env[n] * env[n]) / (rms * rms) + 1e-6); if (lv < thrDb) { ctx.fillStyle = 'rgba(255,107,107,0.5)'; ctx.fillRect(ax.fx(n), ax.fy(thrDb), Math.max(1, ax.fx(1) - ax.fx(0)), ax.fy(-30) - ax.fy(thrDb)); if (n === 0 || dB((env[n - 1] * env[n - 1]) / (rms * rms) + 1e-6) >= thrDb) fades++; } }
      ctx.fillStyle = C.orange; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('fade threshold ' + thrDb + ' dB', ax.x + 8, ax.fy(thrDb) - 6);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif';
      ctx.fillText('two Gaussian quadratures -> Rayleigh envelope; ' + fades + ' deep fade' + (fades === 1 ? '' : 's') + ' below threshold', ax.x + 8, ax.y + 16);
    }
    draw(-10);
    slider(card.controls, { label: 'fade threshold', min: -25, max: 0, step: 1, value: -10, fmt: v => v + ' dB' }, v => draw(v));
  };

  // AWGN: BPSK/QPSK constellation scatter with noise cloud, measured vs theoretical BER
  T.awgnScatter = function (host, spec) {
    const card = makeCard(host, spec, 400, 380);
    let ord = 2;
    function draw(ebno) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 30, S = R / 1.6;
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('I', cx + R, cy - 6); ctx.textAlign = 'left'; ctx.fillText('Q', cx + 6, cy - R + 6);
      // symbols (unit energy per symbol). For QPSK each axis carries one bit at Eb.
      const pts = ord === 2 ? [[1, 0], [-1, 0]] : [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(p => [p[0] / Math.SQRT2, p[1] / Math.SQRT2]);
      // per-bit noise sigma: with Eb/N0 = g, sigma_per_dim = sqrt(1/(2g)) on the per-bit-normalized axis
      const g = lin(ebno);
      const sigma = ord === 2 ? Math.sqrt(1 / (2 * g)) : Math.sqrt(1 / (2 * g)) / Math.SQRT2;
      // draw noisy samples and count bit errors
      let bits = 0, errs = 0;
      ctx.fillStyle = 'rgba(77,171,247,0.5)';
      for (let k = 0; k < 700; k++) {
        const p = pts[k % pts.length];
        const rx = p[0] + sigma * gauss(), ry = p[1] + sigma * gauss();
        ctx.fillRect(cx + rx * S, cy - ry * S, 2, 2);
        if (ord === 2) { bits++; if ((rx >= 0) !== (p[0] >= 0)) errs++; }
        else { bits += 2; if ((rx >= 0) !== (p[0] >= 0)) errs++; if ((ry >= 0) !== (p[1] >= 0)) errs++; }
      }
      pts.forEach(p => { ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(cx + p[0] * S, cy - p[1] * S, 4, 0, TAU); ctx.fill(); });
      const theo = Q(Math.sqrt(2 * g)), meas = errs / bits;
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText((ord === 2 ? 'BPSK' : 'QPSK') + ' @ Eb/N0 = ' + ebno + ' dB', 12, 18);
      ctx.fillText('measured BER = ' + (meas > 0 ? meas.toExponential(1) : '0'), 12, 36);
      ctx.fillText('theory Q(sqrt(2Eb/N0)) = ' + theo.toExponential(1), 12, 54);
    }
    draw(6);
    chooser(card.controls, [{ v: 2, l: 'BPSK' }, { v: 4, l: 'QPSK' }], 2, v => { ord = v; draw(curEb); });
    let curEb = 6;
    slider(card.controls, { label: 'Eb/N0', min: -2, max: 12, step: 1, value: 6, fmt: v => v + ' dB' }, v => { curEb = v; draw(v); });
  };

  // AWGN: flat white PSD vs a coloured (1/f-ish) reference
  T.awgnPsd = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(n0db) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0, 1], yr: [-40, 10], xlabel: 'normalized frequency', ylabel: 'PSD (dB/Hz)' });
      // white: flat line at N0/2 (here n0db), with small random ripple to look measured
      const white = []; for (let f = 0; f <= 1; f += 0.005) white.push([f, n0db + 1.2 * gauss()]); line(ctx, ax, white, C.blue, 1.4);
      ctx.strokeStyle = C.teal; ctx.setLineDash([5, 4]); line(ctx, ax, [[0, n0db], [1, n0db]], C.teal, 2); ctx.setLineDash([]);
      // coloured reference (falls with frequency)
      const col = []; for (let f = 0.005; f <= 1; f += 0.005) col.push([f, n0db + 8 - 22 * f]); line(ctx, ax, col, C.orange, 2);
      legend(ctx, box, [{ label: 'white (flat)', color: C.blue }, { label: 'N0/2 level', color: C.teal }, { label: 'coloured', color: C.orange }]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('AWGN is "white": equal power at every frequency (flat PSD = N0/2 = ' + n0db + ' dB)', ax.x + 8, ax.y + ax.h - 12);
    }
    draw(-15);
    slider(card.controls, { label: 'N0/2 level', min: -30, max: 0, step: 1, value: -15, fmt: v => v + ' dB' }, v => draw(v));
  };

  // Trellis diagram: 4-state (K=3) trellis over several steps with a highlighted survivor path
  T.trelPath = function (host, spec) {
    const card = makeCard(host, spec, 540, 300);
    const stages = 7, states = 4, mL = 64, mT = 30;
    const path = [0, 2, 1, 2, 3, 1, 0];
    function draw(upto) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const gx = i => mL + i * (w - mL - 30) / (stages - 1);
      const gy = s => mT + s * (h - mT - 54) / (states - 1);
      // full trellis butterflies: from state s, next states (s>>1) and (s>>1)|2
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
      for (let i = 0; i < stages - 1; i++) for (let s = 0; s < states; s++) {
        [(s >> 1), ((s >> 1) | 2)].forEach(ns => { if (ns < states) { ctx.beginPath(); ctx.moveTo(gx(i), gy(s)); ctx.lineTo(gx(i + 1), gy(ns)); ctx.stroke(); } });
      }
      // survivor path up to current step
      ctx.strokeStyle = C.teal; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= upto && i < stages; i++) { const X = gx(i), Y = gy(path[i]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke();
      for (let i = 0; i < stages; i++) for (let s = 0; s < states; s++) {
        const onPath = (path[i] === s && i <= upto);
        ctx.fillStyle = onPath ? C.teal : (i === upto + 1 ? C.orange : C.blue);
        ctx.beginPath(); ctx.arc(gx(i), gy(s), onPath ? 6 : 5, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ['S0 00', 'S1 01', 'S2 10', 'S3 11'].forEach((lbl, s) => ctx.fillText(lbl, 6, gy(s) + 4));
      ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '10px sans-serif';
      for (let i = 0; i < stages; i++) ctx.fillText('t' + i, gx(i), h - 28);
      ctx.fillStyle = C.teal; ctx.font = '12px sans-serif';
      ctx.fillText('K=3, 4-state trellis - survivor path traced to step ' + (upto + 1) + '/' + stages, w / 2, h - 10);
    }
    draw(stages - 1);
    slider(card.controls, { label: 'time step', min: 0, max: stages - 1, step: 1, value: stages - 1 }, v => draw(Math.round(v)));
  };

  /* ================= FILTERS & RF FRONT-END (round 19) ================= */

  // Generic filter magnitude response in dB vs log-f. Params: kind lp/hp/bp/notch,
  // fc or f0 (Hz), order n (for lp/hp), Q (for bp/notch). Butterworth-family shapes.
  T.filtResp = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const kind = spec.kind || 'lp';
    const f0base = spec.f0 || spec.fc || 1000;
    // frequency response magnitude (linear) for a given normalized w = f/f0
    function mag(f, fc, n, Q) {
      const x = f / fc;
      if (kind === 'lp') return 1 / Math.sqrt(1 + Math.pow(x, 2 * n));
      if (kind === 'hp') return 1 / Math.sqrt(1 + Math.pow(1 / x, 2 * n));
      if (kind === 'bp') { const d = x - 1 / x; return 1 / Math.sqrt(1 + Q * Q * d * d); }
      // notch (band-stop): magnitude goes to 0 at f0
      const d = x - 1 / x; return Math.abs(Q * d) / Math.sqrt(1 + Q * Q * d * d);
    }
    let fc = f0base, n = spec.order || 2, Q = spec.Q || 5;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const lo = f0base / 100, hi = f0base * 100;
      const ax = drawAxes(ctx, box, {
        xr: [lo, hi], yr: [-60, 6], logx: true, xlabel: 'frequency (Hz)', ylabel: 'magnitude (dB)',
        xtickfmt: t => t >= 1e6 ? (t / 1e6) + 'M' : t >= 1e3 ? (t / 1e3) + 'k' : t
      });
      // response curve
      const pts = []; for (let e = Math.log10(lo); e <= Math.log10(hi); e += 0.01) { const f = Math.pow(10, e); pts.push([f, dB(mag(f, fc, n, Q) * mag(f, fc, n, Q) + 1e-9)]); }
      line(ctx, ax, pts, C.blue, 2.5);
      // -3 dB line and marker
      ctx.strokeStyle = C.grid; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(-3)); ctx.lineTo(ax.x + ax.w, ax.fy(-3)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('-3 dB', ax.x + 4, ax.fy(-3) - 4);
      // mark centre / cutoff
      const markF = fc;
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(markF), ax.y); ctx.lineTo(ax.fx(markF), ax.y + ax.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.textAlign = 'center';
      ctx.fillText((kind === 'bp' || kind === 'notch') ? 'f0' : 'fc', ax.fx(markF), ax.y + ax.h - 6);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      const fLbl = markF >= 1e6 ? (markF / 1e6).toFixed(2) + ' MHz' : markF >= 1e3 ? (markF / 1e3).toFixed(2) + ' kHz' : markF.toFixed(0) + ' Hz';
      if (kind === 'lp') ctx.fillText('low-pass, order ' + n + ' -> roll-off ' + (20 * n) + ' dB/decade, fc = ' + fLbl, ax.x + 8, ax.y + 16);
      else if (kind === 'hp') ctx.fillText('high-pass, order ' + n + ' -> ' + (20 * n) + ' dB/dec below fc = ' + fLbl + ' (blocks DC)', ax.x + 8, ax.y + 16);
      else if (kind === 'bp') { const BW = fc / Q; ctx.fillText('band-pass, Q = ' + Q.toFixed(1) + ' -> BW = f0/Q = ' + (BW >= 1e3 ? (BW / 1e3).toFixed(2) + ' kHz' : BW.toFixed(0) + ' Hz') + ', f0 = ' + fLbl, ax.x + 8, ax.y + 16); }
      else { const notchDepth = dB(mag(fc, fc, n, Q) * mag(fc, fc, n, Q) + 1e-9); const BW = fc / Q; ctx.fillText('notch: depth ' + notchDepth.toFixed(0) + ' dB at f0 = ' + fLbl + ', reject BW = ' + (BW >= 1e3 ? (BW / 1e3).toFixed(2) + ' kHz' : BW.toFixed(0) + ' Hz'), ax.x + 8, ax.y + 16); }
    }
    draw();
    if (kind === 'lp' || kind === 'hp') {
      slider(card.controls, { label: (kind === 'lp' ? 'cutoff fc' : 'cutoff fc'), min: f0base / 10, max: f0base * 10, step: f0base / 10, value: f0base, fmt: v => v >= 1e6 ? (v / 1e6).toFixed(1) + ' MHz' : v >= 1e3 ? (v / 1e3).toFixed(1) + ' kHz' : v.toFixed(0) + ' Hz' }, v => { fc = v; draw(); });
      slider(card.controls, { label: 'order n', min: 1, max: 8, step: 1, value: n }, v => { n = Math.round(v); draw(); });
    } else {
      slider(card.controls, { label: 'centre f0', min: f0base / 4, max: f0base * 4, step: f0base / 20, value: f0base, fmt: v => v >= 1e6 ? (v / 1e6).toFixed(2) + ' MHz' : v >= 1e3 ? (v / 1e3).toFixed(2) + ' kHz' : v.toFixed(0) + ' Hz' }, v => { fc = v; draw(); });
      slider(card.controls, { label: 'quality Q', min: 1, max: 40, step: 1, value: Q }, v => { Q = Math.round(v); draw(); });
    }
  };

  // Filter families: Butterworth (maximally flat) vs Chebyshev (ripple, steeper) low-pass
  T.filtFamily = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    // Chebyshev type-I magnitude: 1/sqrt(1 + eps^2 * Tn(x)^2), Tn = cos(n*acos(x)) for |x|<=1
    function cheb(n, x) { return Math.abs(x) <= 1 ? Math.cos(n * Math.acos(x)) : Math.cosh(n * Math.acosh(Math.abs(x))); }
    let n = 4, rippleDb = 1;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0.05, 5], yr: [-60, 6], logx: true, xlabel: 'frequency / fc', ylabel: 'magnitude (dB)' });
      const eps = Math.sqrt(Math.pow(10, rippleDb / 10) - 1);
      const butter = [], chebv = [];
      for (let e = Math.log10(0.05); e <= Math.log10(5); e += 0.008) {
        const x = Math.pow(10, e);
        butter.push([x, dB(1 / (1 + Math.pow(x, 2 * n)) + 1e-9)]);
        const t = cheb(n, x); chebv.push([x, dB(1 / (1 + eps * eps * t * t) + 1e-9)]);
      }
      line(ctx, ax, butter, C.blue, 2.4);
      line(ctx, ax, chebv, C.orange, 2.4);
      // ripple band marker
      ctx.strokeStyle = C.grid; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(-rippleDb)); ctx.lineTo(ax.fx(1), ax.fy(-rippleDb)); ctx.stroke(); ctx.setLineDash([]);
      legend(ctx, box, [{ label: 'Butterworth (flat)', color: C.blue }, { label: 'Chebyshev (ripple)', color: C.orange }]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('order ' + n + ': Chebyshev rolls off steeper but ripples ' + rippleDb.toFixed(1) + ' dB in the passband', ax.x + 8, ax.y + ax.h - 12);
    }
    draw();
    slider(card.controls, { label: 'order n', min: 2, max: 8, step: 1, value: 4 }, v => { n = Math.round(v); draw(); });
    slider(card.controls, { label: 'Chebyshev ripple', min: 0.1, max: 3, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' dB' }, v => { rippleDb = v; draw(); });
  };

  // RC low-pass step response: v(t) = 1 - exp(-t/RC); mark 10-90% rise time = 2.2 RC
  T.rcStep = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    function draw(rc) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const tmax = 5 * 2.2e-3; // fixed window in seconds (rc in ms)
      const ax = drawAxes(ctx, box, { xr: [0, tmax * 1000], yr: [0, 1.1], xlabel: 'time (ms)', ylabel: 'output / input' });
      // input step
      ctx.strokeStyle = C.dim; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(1)); ctx.lineTo(ax.x + ax.w, ax.fy(1)); ctx.stroke(); ctx.setLineDash([]);
      const RC = rc / 1000; // s
      const pts = []; for (let ms = 0; ms <= tmax * 1000; ms += tmax * 1000 / 400) { const t = ms / 1000; pts.push([ms, 1 - Math.exp(-t / RC)]); }
      line(ctx, ax, pts, C.blue, 2.5);
      const tr = 2.2 * RC * 1000; // 10-90% rise time in ms
      const fc = 1 / (TAU * RC);
      // mark 90% level
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(0.9)); ctx.lineTo(ax.fx(tr), ax.fy(0.9)); ctx.lineTo(ax.fx(tr), ax.y + ax.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(ax.fx(tr), ax.fy(0.9), 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('RC = ' + rc.toFixed(2) + ' ms -> rise time (10-90%) = 2.2 RC = ' + tr.toFixed(2) + ' ms', ax.x + 8, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif';
      ctx.fillText('cutoff fc = 1/(2 pi RC) = ' + (fc >= 1e3 ? (fc / 1e3).toFixed(2) + ' kHz' : fc.toFixed(0) + ' Hz') + ' -> slower RC = lower fc = longer rise', ax.x + 8, ax.y + 34);
    }
    draw(1);
    slider(card.controls, { label: 'time constant RC', min: 0.1, max: 2, step: 0.05, value: 1, fmt: v => v.toFixed(2) + ' ms' }, v => draw(v));
  };

  // LNA sensitivity / noise-floor bar: shows floor, +NF, +required-SNR = sensitivity,
  // with LNA-gain effect on system NF via Friis (2nd stage NF=10 dB).
  T.lnaSens = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const B = 1e6, snrReq = 10, F2 = lin(10), F1 = lin(2);
    let gLna = 15;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const G1 = lin(gLna);
      const Fsys = F1 + (F2 - 1) / G1, nfSys = dB(Fsys);
      const floor = -174 + 10 * Math.log10(B), withNF = floor + nfSys, sens = withNF + snrReq;
      const ax = drawAxes(ctx, box, { xr: [0, 4], yr: [-140, -80], xlabel: '', ylabel: 'power (dBm)', xticks: [] });
      const bar = (i, base, top, col, lbl) => { const bx = ax.fx(i + 0.5) - 40; ctx.fillStyle = col; ctx.fillRect(bx, ax.fy(top), 80, ax.fy(base) - ax.fy(top)); ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(lbl, ax.fx(i + 0.5), ax.y + ax.h + 12); };
      bar(0, -174 + 10 * Math.log10(B), floor, 'rgba(77,171,247,0.6)', 'kTB floor');
      bar(1, floor, withNF, 'rgba(255,169,77,0.6)', '+ sys NF');
      bar(2, withNF, sens, 'rgba(177,151,252,0.6)', '+ SNR req');
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(sens)); ctx.lineTo(ax.x + ax.w, ax.fy(sens)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.teal; ctx.font = '13px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('sensitivity = ' + sens.toFixed(1) + ' dBm', ax.x + ax.w - 6, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('LNA gain ' + gLna + ' dB -> system NF = ' + nfSys.toFixed(2) + ' dB (LNA NF 2 dB, next stage 10 dB)', ax.x + 6, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'LNA gain', min: 0, max: 30, step: 1, value: 15, fmt: v => v + ' dB' }, v => { gLna = v; draw(); });
  };

  // AGC transfer curve: output level vs input level (flat AGC range), slider = loop gain / ref
  T.agcCurve = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    let ref = -10, loop = 0.85; // loop 0..1 = how hard the AGC clamps
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [-80, 0], yr: [-40, 5], xlabel: 'input level (dBm)', ylabel: 'output level (dBm)' });
      // AGC: below threshold, gain fixed; above, output = ref + (1-loop)*(in - thresh)
      const thresh = -60;
      const pts = []; for (let pin = -80; pin <= 0; pin += 0.5) { let pout; if (pin < thresh) pout = ref + (pin - thresh); else pout = ref + (1 - loop) * (pin - thresh); pts.push([pin, pout]); }
      // linear (no-AGC) reference
      const lin0 = []; for (let pin = -80; pin <= 0; pin += 1) lin0.push([pin, ref + (pin - thresh)]);
      ctx.save(); ctx.setLineDash([4, 3]); line(ctx, ax, lin0, C.dim, 1.5); ctx.restore();
      line(ctx, ax, pts, C.blue, 2.5);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(thresh), ax.y); ctx.lineTo(ax.fx(thresh), ax.y + ax.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('AGC threshold', ax.fx(thresh), ax.y + ax.h - 6);
      legend(ctx, box, [{ label: 'with AGC', color: C.blue }, { label: 'no AGC', color: C.dim }]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('above threshold the output stays nearly flat (slope ' + (1 - loop).toFixed(2) + ') over a wide input range', ax.x + 8, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'loop gain', min: 0.3, max: 0.98, step: 0.02, value: 0.85, fmt: v => v.toFixed(2) }, v => { loop = v; draw(); });
    slider(card.controls, { label: 'reference level', min: -20, max: 0, step: 1, value: -10, fmt: v => v + ' dBm' }, v => { ref = v; draw(); });
  };

  // AGC time response to an input step: attack/decay of the gain-control envelope
  T.agcStep = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    let tau = 8; // response time constant (ms-ish, in samples)
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h), N = 200;
      const ax = drawAxes(ctx, box, { xr: [0, N], yr: [0, 2.2], xlabel: 'time (samples)', ylabel: 'level' });
      // input: steps up at n=40 (10x), back down at n=130
      const inp = n => (n < 40 ? 0.3 : n < 130 ? 1.8 : 0.6);
      const ip = []; for (let n = 0; n < N; n++) ip.push([n, inp(n)]); line(ctx, ax, ip, C.dim, 1.6);
      // AGC output: envelope relaxes toward a target (~1.0) with time constant tau
      const target = 1.0; const out = []; let g = 1 / 0.3; // gain to hit target from initial
      let y = target;
      for (let n = 0; n < N; n++) { const desiredG = target / Math.max(inp(n), 1e-3); g += (desiredG - g) / tau; y = g * inp(n); out.push([n, y]); }
      line(ctx, ax, out, C.blue, 2.5);
      ctx.strokeStyle = C.orange; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(target)); ctx.lineTo(ax.x + ax.w, ax.fy(target)); ctx.stroke(); ctx.setLineDash([]);
      legend(ctx, box, [{ label: 'input level', color: C.dim }, { label: 'AGC output', color: C.blue }]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('input jumps up then down; the AGC settles back to the target with time constant ~' + tau.toFixed(0) + ' samples', ax.x + 8, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'attack/decay time', min: 2, max: 30, step: 1, value: 8, fmt: v => '~' + v + ' samp' }, v => { tau = v; draw(); });
  };

  // Mixer spectrum: RF, LO, IF = |fRF - fLO|, sum, and the IMAGE folding to IF.
  // Reused for image-frequency (spec.showImage forced) and intermediate-frequency.
  T.mixSpec = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    let fRF = spec.fRF || 100, fLO = spec.fLO || 90;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const IF = Math.abs(fRF - fLO), sum = fRF + fLO, image = fLO - IF === fRF ? fLO + IF : 2 * fLO - fRF;
      const hi = Math.max(sum, fRF, fLO, image) * 1.15 + 10;
      const ax = drawAxes(ctx, box, { xr: [0, hi], yr: [0, 1], xlabel: 'frequency (MHz)', ylabel: '', yticks: [] });
      const tone = (f, col, lbl, hgt) => { if (f < 0 || f > hi) return; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax.fx(f), ax.fy(0)); ctx.lineTo(ax.fx(f), ax.fy(hgt)); ctx.stroke(); ctx.fillStyle = col; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(lbl, ax.fx(f), ax.fy(hgt) - 4); };
      tone(fLO, C.purple, 'LO ' + fLO, 0.9);
      tone(fRF, C.blue, 'RF ' + fRF, 0.8);
      tone(IF, C.teal, 'IF ' + IF.toFixed(0), 0.7);
      tone(sum, C.dim, 'sum ' + sum.toFixed(0), 0.5);
      tone(image, C.red, 'image ' + image.toFixed(0), 0.6);
      // arrow: image also folds to IF
      ctx.strokeStyle = C.red; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ax.fx(image), ax.fy(0.6)); ctx.lineTo(ax.fx(IF), ax.fy(0.68)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('IF = |RF - LO| = ' + IF.toFixed(0) + ' MHz; the image at ' + image.toFixed(0) + ' MHz also lands on IF (2*IF = ' + (2 * IF).toFixed(0) + ' away)', ax.x + 8, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'RF frequency', min: 50, max: 200, step: 1, value: fRF, fmt: v => v + ' MHz' }, v => { fRF = v; draw(); });
    slider(card.controls, { label: 'LO frequency', min: 50, max: 200, step: 1, value: fLO, fmt: v => v + ' MHz' }, v => { fLO = v; draw(); });
  };

  // Receiver frequency plan: fixed IF filter, tunable LO lands channels on the IF.
  // Shows RF band, LO, IF passband, and the image band a preselector must kill.
  T.rxPlan = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const IF = spec.IF || 45; // MHz fixed
    let fLO = spec.fLO || 145; // high-side LO
    const channels = [120, 140, 160, 180, 200];
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0, 320], yr: [0, 1], xlabel: 'frequency (MHz)', ylabel: '', yticks: [] });
      const fRF = fLO - IF, image = fLO + IF;
      // IF passband (fixed)
      ctx.fillStyle = 'rgba(99,230,190,0.18)'; ctx.fillRect(ax.fx(IF - 5), ax.y, ax.fx(IF + 5) - ax.fx(IF - 5), ax.h);
      ctx.strokeStyle = C.teal; ctx.lineWidth = 1.4; ctx.strokeRect(ax.fx(IF - 5), ax.y, ax.fx(IF + 5) - ax.fx(IF - 5), ax.h);
      ctx.fillStyle = C.teal; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('fixed IF ' + IF, ax.fx(IF), ax.y + 12);
      // RF channels
      channels.forEach(ch => { const sel = Math.abs(ch - fRF) < 3; ctx.strokeStyle = sel ? C.blue : C.grid; ctx.lineWidth = sel ? 3 : 2; ctx.beginPath(); ctx.moveTo(ax.fx(ch), ax.fy(0)); ctx.lineTo(ax.fx(ch), ax.fy(sel ? 0.8 : 0.45)); ctx.stroke(); ctx.fillStyle = sel ? C.blue : C.dim; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(ch, ax.fx(ch), ax.fy(sel ? 0.85 : 0.5) - 3); });
      // LO
      ctx.strokeStyle = C.purple; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax.fx(fLO), ax.fy(0)); ctx.lineTo(ax.fx(fLO), ax.fy(0.95)); ctx.stroke(); ctx.fillStyle = C.purple; ctx.textAlign = 'center'; ctx.font = '10px sans-serif'; ctx.fillText('LO ' + fLO, ax.fx(fLO), ax.fy(0.95) - 3);
      // image band
      ctx.strokeStyle = C.red; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(image), ax.fy(0)); ctx.lineTo(ax.fx(image), ax.fy(0.55)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = C.red; ctx.fillText('image ' + image, ax.fx(image), ax.fy(0.6) - 3);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('tune LO so RF = LO - IF = ' + fRF + ' MHz drops onto the fixed IF; image sits 2*IF = ' + (2 * IF) + ' MHz above', ax.x + 8, ax.y + ax.h - 12);
    }
    draw();
    slider(card.controls, { label: 'LO (tune)', min: 120, max: 250, step: 1, value: fLO, fmt: v => v + ' MHz' }, v => { fLO = v; draw(); });
  };

  // Harmonic distortion spectrum: tone through y = a1 x + a2 x^2 + a3 x^3, FFT-style bars.
  T.thdSpec = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const a1 = 1, a2 = 0.15, a3 = 0.08, f0 = 5;
    function draw(drive) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h), N = 256;
      const x = []; for (let n = 0; n < N; n++) { const s = drive * Math.cos(TAU * f0 * n / N); x.push(a1 * s + a2 * s * s + a3 * s * s * s); }
      // DFT magnitude
      const mag = []; for (let k = 0; k <= 20; k++) { let sr = 0, si = 0; for (let n = 0; n < N; n++) { const a = -TAU * k * n / N; sr += x[n] * Math.cos(a); si += x[n] * Math.sin(a); } mag.push(Math.sqrt(sr * sr + si * si) / (N / 2)); }
      const fund = mag[f0] || 1e-9;
      const magdb = mag.map(m => dB((m * m) / (fund * fund) + 1e-12));
      const ax = drawAxes(ctx, box, { xr: [0, 20], yr: [-70, 6], xlabel: 'harmonic (x fundamental)', ylabel: 'level (dBc)', xticks: [0, 5, 10, 15, 20], xtickfmt: t => (t / f0).toFixed(0) + 'f' });
      for (let k = 1; k <= 20; k++) { const isH = (k % f0 === 0); ctx.strokeStyle = k === f0 ? C.blue : (isH ? C.orange : C.grid); ctx.lineWidth = isH ? 4 : 1.5; ctx.beginPath(); ctx.moveTo(ax.fx(k), ax.fy(-70)); ctx.lineTo(ax.fx(k), ax.fy(Math.max(-70, magdb[k]))); ctx.stroke(); }
      // THD from 2f, 3f
      const p2 = mag[2 * f0] || 0, p3 = mag[3 * f0] || 0; const thd = Math.sqrt(p2 * p2 + p3 * p3) / fund * 100;
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('drive = ' + drive.toFixed(2) + ' -> 2nd & 3rd harmonics rise; THD = ' + thd.toFixed(1) + '%', ax.x + 8, ax.y + 16);
    }
    draw(0.7);
    slider(card.controls, { label: 'drive level', min: 0.1, max: 1.5, step: 0.05, value: 0.7, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // Harmonic distortion time waveform: pure sine vs the distorted output
  T.thdWave = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    const a1 = 1, a2 = 0.15, a3 = 0.08;
    function draw(drive) {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [0, 1], yr: [-1.8, 1.8], xlabel: 'time', ylabel: 'amplitude' });
      const pure = [], dist = [];
      for (let t = 0; t <= 1; t += 0.002) { const s = drive * Math.sin(TAU * 2 * t); pure.push([t, s]); dist.push([t, a1 * s + a2 * s * s + a3 * s * s * s]); }
      line(ctx, ax, pure, C.dim, 1.6);
      line(ctx, ax, dist, C.blue, 2.5);
      legend(ctx, box, [{ label: 'ideal sine', color: C.dim }, { label: 'distorted out', color: C.blue }]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('drive = ' + drive.toFixed(2) + ': the a2/a3 terms flatten one side and sharpen the other (clipping-like)', ax.x + 8, ax.y + 16);
    }
    draw(0.8);
    slider(card.controls, { label: 'drive level', min: 0.1, max: 1.5, step: 0.05, value: 0.8, fmt: v => v.toFixed(2) }, v => draw(v));
  };

  // Third-order intercept: fundamental (1:1) and IM3 (3:1) lines vs Pin, extrapolated to IIP3.
  T.ip3Plot = function (host, spec) {
    const card = makeCard(host, spec, 520, 320);
    const gain = 10, iip3 = 0; // dBm input-referred intercept
    let pin = -30;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [-50, 10], yr: [-110, 25], xlabel: 'input power per tone (dBm)', ylabel: 'output power (dBm)' });
      // fundamental: Pout = Pin + gain (slope 1)
      const fund = []; for (let p = -50; p <= 10; p += 1) fund.push([p, p + gain]);
      // IM3: slope 3, passes through intercept at (iip3, iip3+gain)
      const im3 = []; for (let p = -50; p <= 10; p += 1) im3.push([p, 3 * (p - iip3) + (iip3 + gain)]);
      line(ctx, ax, fund, C.blue, 2.4);
      ctx.save(); ctx.setLineDash([5, 4]); line(ctx, ax, im3, C.red, 2.2); ctx.restore();
      // intercept point
      const ipy = iip3 + gain;
      ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(ax.fx(iip3), ax.fy(ipy), 5, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.orange; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.fx(iip3), ax.y + ax.h); ctx.lineTo(ax.fx(iip3), ax.fy(ipy)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.orange; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('IIP3 = ' + iip3 + ' dBm', ax.fx(iip3), ax.y + ax.h - 6);
      // operating point + markers
      const pf = pin + gain, pim = 3 * (pin - iip3) + ipy;
      ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(ax.fx(pin), ax.fy(pf), 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(ax.fx(pin), ax.fy(pim), 4, 0, TAU); ctx.fill();
      legend(ctx, box, [{ label: 'fundamental (1:1)', color: C.blue }, { label: 'IM3 (3:1)', color: C.red }]);
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Pin = ' + pin + ' dBm: spurious-free range SFDR = ' + (pf - pim).toFixed(0) + ' dB (fundamental over IM3)', ax.x + 8, ax.y + 16);
    }
    draw();
    slider(card.controls, { label: 'input power/tone', min: -50, max: 0, step: 1, value: -30, fmt: v => v + ' dBm' }, v => { pin = v; draw(); });
  };

  // IP3 two-tone spectrum: f1, f2 and the IM3 products 2f1-f2, 2f2-f1 close in.
  T.ip3TwoTone = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    let pin = -30; const gain = 10, iip3 = 0, f1 = 98, f2 = 102;
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [90, 110], yr: [-110, 25], xlabel: 'frequency (MHz)', ylabel: 'output power (dBm)' });
      const pf = pin + gain, pim = 3 * (pin - iip3) + (iip3 + gain);
      const tone = (f, p, col, lbl) => { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax.fx(f), ax.fy(-110)); ctx.lineTo(ax.fx(f), ax.fy(p)); ctx.stroke(); ctx.fillStyle = col; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(lbl, ax.fx(f), ax.fy(p) - 4); };
      tone(f1, pf, C.blue, 'f1'); tone(f2, pf, C.blue, 'f2');
      tone(2 * f1 - f2, pim, C.red, '2f1-f2'); tone(2 * f2 - f1, pim, C.red, '2f2-f1');
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('two tones make IM3 products right next to them, ' + (pf - pim).toFixed(0) + ' dB down — they fall in-band and cannot be filtered', ax.x + 8, ax.y + ax.h - 12);
    }
    draw();
    slider(card.controls, { label: 'input power/tone', min: -50, max: 0, step: 1, value: -30, fmt: v => v + ' dBm' }, v => { pin = v; draw(); });
  };

  // Zero-IF: RF folds to DC baseband with I/Q; I/Q imbalance raises the residual image (IRR).
  T.zifSpec = function (host, spec) {
    const card = makeCard(host, spec, 520, 300);
    let imbDb = 0.5, phErr = 2; // amplitude imbalance (dB), phase error (deg)
    function draw() {
      const { ctx, w, h } = card; clearBg(ctx, w, h);
      const box = plotBox(w, h);
      const ax = drawAxes(ctx, box, { xr: [-15, 15], yr: [-70, 6], xlabel: 'baseband frequency (MHz)', ylabel: 'level (dBc)' });
      // wanted signal at +5 MHz; residual image at -5 MHz set by IRR
      const eps = Math.pow(10, imbDb / 20) - 1, ph = phErr * Math.PI / 180;
      const irr = -10 * Math.log10((eps * eps + ph * ph) / 4 + 1e-9); // approx image-reject ratio in dB
      const wanted = 5;
      const tone = (f, p, col, lbl) => { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax.fx(f), ax.fy(-70)); ctx.lineTo(ax.fx(f), ax.fy(p)); ctx.stroke(); ctx.fillStyle = col; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(lbl, ax.fx(f), ax.fy(p) - 4); };
      // DC line
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(ax.fx(0), ax.y); ctx.lineTo(ax.fx(0), ax.y + ax.h); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('DC', ax.fx(0), ax.y + ax.h - 4);
      tone(wanted, 0, C.blue, 'wanted');
      tone(-wanted, -irr, C.red, 'image');
      ctx.fillStyle = C.text; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('I/Q imbalance ' + imbDb.toFixed(2) + ' dB, phase ' + phErr.toFixed(1) + ' deg -> image reject IRR = ' + irr.toFixed(0) + ' dB', ax.x + 8, ax.y + 16);
      ctx.fillStyle = C.dim; ctx.font = '11px sans-serif';
      ctx.fillText('perfect I/Q would fully cancel the mirror image at -' + wanted + ' MHz', ax.x + 8, ax.y + 34);
    }
    draw();
    slider(card.controls, { label: 'amplitude imbalance', min: 0, max: 3, step: 0.1, value: 0.5, fmt: v => v.toFixed(1) + ' dB' }, v => { imbDb = v; draw(); });
    slider(card.controls, { label: 'phase error', min: 0, max: 15, step: 0.5, value: 2, fmt: v => v.toFixed(1) + ' deg' }, v => { phErr = v; draw(); });
  };

  /* ---- topic → figure specs map ---- */
  const EX = s => s; // helper for readability
  const map = {
    'filters': [
      { type: 'filtResp', kind: 'lp', fc: 1000, order: 2, title: 'Filter magnitude response', caption: 'Slide the order — the roll-off steepens by 20 dB/decade per order.', explain: EX('<b>What it shows:</b> the magnitude response of a low-pass filter in dB vs log-frequency, with the -3 dB point and cutoff marked. <b>Try:</b> raise the order — each extra order adds 20 dB/decade of roll-off, so a higher-order filter rejects out-of-band signals far harder past fc.') },
      { type: 'filtFamily', title: 'Butterworth vs Chebyshev', caption: 'Trade a flat passband for a steeper roll-off (with ripple).', explain: EX('<b>What it shows:</b> two classic filter families at the same order — Butterworth is maximally flat in the passband, Chebyshev rolls off steeper but ripples. <b>Try:</b> raise the ripple allowance and the Chebyshev cutoff sharpens; this is the fundamental flatness-vs-selectivity trade in filter design.') }
    ],
    'lpf': [
      { type: 'filtResp', kind: 'lp', fc: 1000, order: 2, title: 'Low-pass response', caption: 'Set the cutoff fc and order; note -20 dB/dec per order past fc.', explain: EX('<b>What it shows:</b> a low-pass passes DC and low frequencies, attenuating above fc at -20*order dB/decade. <b>Try:</b> move fc to slide the corner, and raise the order to steepen the skirt — the two knobs that define any LPF.') },
      { type: 'rcStep', title: 'RC step (rise time)', caption: 'Slide the time constant RC — rise time = 2.2 RC.', explain: EX('<b>What it shows:</b> the time-domain view of a one-pole RC low-pass responding to a step. <b>Try:</b> a larger RC gives a lower cutoff (fc = 1/(2 pi RC)) and a slower 10-90% rise time of 2.2 RC — the same filter seen in time rather than frequency.') }
    ],
    'hpf': [
      { type: 'filtResp', kind: 'hp', fc: 1000, order: 2, title: 'High-pass response', caption: 'Slide fc — everything below it (including DC) is blocked.', explain: EX('<b>What it shows:</b> a high-pass filter attenuates below fc at -20*order dB/decade, so DC and low frequencies are rejected while highs pass. <b>Try:</b> move fc up and watch more of the low end get cut — this is exactly how AC-coupling blocks a DC offset while passing the signal.') },
      { type: 'rcStep', title: 'The complementary RC (DC block)', caption: 'The same RC that low-passes also defines the high-pass corner.', explain: EX('<b>What it shows:</b> the RC time constant that sets a low-pass corner also sets the complementary high-pass corner at fc = 1/(2 pi RC). <b>Try:</b> a smaller RC pushes the high-pass corner up, blocking more low-frequency content and DC.') }
    ],
    'bpf': [
      { type: 'filtResp', kind: 'bp', f0: 1000, Q: 5, title: 'Band-pass response', caption: 'Set f0 and Q; bandwidth = f0/Q, printed live.', explain: EX('<b>What it shows:</b> a band-pass passes a band around f0 and rejects both sides, with -3 dB edges. <b>Try:</b> raise Q and the response narrows — bandwidth BW = f0/Q shrinks, so a high-Q filter is selective but only lets a thin slice through.') },
      { type: 'filtResp', kind: 'bp', f0: 1000, Q: 2, title: 'Narrowband vs wideband', caption: 'Low Q = wide band; high Q = narrow, selective band.', explain: EX('<b>What it shows:</b> the same band-pass with the Q slider spanning wideband to narrowband. <b>Try:</b> drop Q toward 1 for a wide, gentle passband or push it high for a razor-thin selective filter — Q is the single knob trading bandwidth for selectivity.') }
    ],
    'notch-filter': [
      { type: 'filtResp', kind: 'notch', f0: 1000, Q: 10, title: 'Notch (band-stop) response', caption: 'Set f0 and Q; the deep null rejects one frequency.', explain: EX('<b>What it shows:</b> a notch filter is the inverse of a band-pass — it passes everything except a deep null at f0. <b>Try:</b> raise Q and the reject band narrows (BW = f0/Q), so a high-Q notch surgically removes a single interfering tone while barely touching nearby signals.') },
      { type: 'zifSpec', title: 'Interference rejection', caption: 'A notch pulls one strong tone down, leaving the wanted signal.', explain: EX('<b>What it shows:</b> conceptually, removing an unwanted spectral component while leaving the wanted one — like a notch deleting a mains hum or a jammer tone. <b>Try:</b> the residual depth is set by how well the notch is placed and how sharp it is.') }
    ],
    'filter-design': [
      { type: 'filtResp', kind: 'lp', fc: 1000, order: 3, title: 'Meeting a spec with order', caption: 'Raise the order until the roll-off clears the stopband need.', explain: EX('<b>What it shows:</b> filter design picks the order that meets a required attenuation at a stopband frequency. <b>Try:</b> increase the order until the curve drops past your target at the stopband edge — more order always meets a tougher spec, at the cost of complexity.') },
      { type: 'filtFamily', title: 'Family choice vs requirement', caption: 'Chebyshev meets a spec at lower order than Butterworth.', explain: EX('<b>What it shows:</b> for a given stopband requirement, Chebyshev meets it at a lower order than Butterworth because it rolls off faster. <b>Try:</b> raise the ripple to steepen the Chebyshev skirt — you trade passband flatness for fewer poles, a core design decision.') }
    ],
    'lna': [
      { type: 'friisNF', title: 'Friis: LNA sets the system NF', caption: 'Raise the LNA gain and watch total NF collapse onto the LNA NF.', explain: EX('<b>What it shows:</b> Friis F_tot = F1 + (F2-1)/G1 — the first stage dominates. <b>Try:</b> as LNA gain rises, the second stage stops mattering and total NF flattens to the LNA alone, which is exactly why a low-noise amp goes first, right at the antenna.') },
      { type: 'lnaSens', title: 'LNA gain -> sensitivity', caption: 'More LNA gain lowers system NF, lowering the noise floor / sensitivity.', explain: EX('<b>What it shows:</b> sensitivity stacked as thermal floor + system NF + required SNR. <b>Try:</b> raise the LNA gain — the Friis system NF drops, pulling sensitivity lower so the receiver can hear fainter signals and reach farther.') }
    ],
    'agc': [
      { type: 'agcCurve', title: 'AGC transfer curve', caption: 'Above threshold the output stays flat over a wide input range.', explain: EX('<b>What it shows:</b> output level vs input level — below the threshold the gain is fixed, above it the AGC clamps the output nearly flat. <b>Try:</b> raise the loop gain and the flat region gets flatter (smaller slope), holding the output constant across a wide input swing.') },
      { type: 'agcStep', title: 'AGC step response', caption: 'Slide the attack/decay time to see how fast it settles.', explain: EX('<b>What it shows:</b> the time response when the input level jumps up then down — the AGC pulls the output back toward its target. <b>Try:</b> a shorter time constant reacts fast but can pump on modulation; a longer one is smooth but slow — the attack/decay trade.') }
    ],
    'mixer': [
      { type: 'mixSpec', fRF: 100, fLO: 90, title: 'Mixer output spectrum', caption: 'Slide RF and LO — IF = |RF-LO|, plus the sum and the image.', explain: EX('<b>What it shows:</b> a mixer multiplies RF by LO, producing IF = |RF-LO| and a sum term, and folding the image onto the same IF. <b>Try:</b> move RF and LO and watch IF and the image move; the image sits 2*IF away and is why a preselector is needed before the mixer.') },
      { type: 'thdSpec', title: 'Mixers are nonlinear', caption: 'The multiplying nonlinearity also creates spurs/harmonics.', explain: EX('<b>What it shows:</b> a mixer relies on a nonlinearity, which also breeds harmonics and spurious tones. <b>Try:</b> raise the drive and watch the extra spectral products grow — real mixers must balance conversion gain against these spurs.') }
    ],
    'harmonics': [
      { type: 'thdSpec', title: 'Harmonic spectrum & THD', caption: 'Raise the drive — 2f, 3f grow and THD climbs.', explain: EX('<b>What it shows:</b> a pure tone through a nonlinearity y = a1 x + a2 x^2 + a3 x^3 spawns harmonics at 2f, 3f... <b>Try:</b> push the drive level and the harmonics rise faster than the fundamental, so total harmonic distortion (THD) grows — the signature of an overdriven amplifier.') },
      { type: 'thdWave', title: 'Distortion in the waveform', caption: 'Watch the sine flatten on one side as drive increases.', explain: EX('<b>What it shows:</b> the same nonlinearity in the time domain — the even/odd terms flatten one side of the sine and sharpen the other. <b>Try:</b> raise the drive and the output visibly departs from the ideal sine, which is exactly what the harmonic spectrum measures.') }
    ],
    'third-order-intercept': [
      { type: 'ip3Plot', title: 'The IP3 intercept lines', caption: 'Fundamental (1:1) and IM3 (3:1) extrapolate to IIP3.', explain: EX('<b>What it shows:</b> output power of the fundamental (slope 1) and the third-order product (slope 3) vs input power; extended, they cross at the third-order intercept IIP3. <b>Try:</b> move the input power and read the spurious-free range — IM3 grows 3 dB for every 1 dB of input, so it catches up fast.') },
      { type: 'ip3TwoTone', title: 'Two-tone IM3 products', caption: 'IM3 lands at 2f1-f2 and 2f2-f1, right beside the tones.', explain: EX('<b>What it shows:</b> two closely spaced tones create IM3 products at 2f1-f2 and 2f2-f1 that fall in-band, right next to the wanted signals. <b>Try:</b> raise the drive — the IM3 pair rises 3x faster and cannot be filtered out because it sits inside the passband.') }
    ],
    'intermediate-frequency': [
      { type: 'rxPlan', IF: 45, fLO: 145, title: 'IF frequency plan', caption: 'Tune the LO to land each RF channel on the fixed IF filter.', explain: EX('<b>What it shows:</b> a superhet uses a fixed IF filter and a tunable LO, so RF = LO - IF always drops onto the same IF. <b>Try:</b> tune the LO and watch different RF channels fall onto the fixed IF passband — one high-quality filter serves the whole band.') },
      { type: 'mixSpec', fRF: 100, fLO: 55, title: 'High-IF vs low-IF trade', caption: 'A larger IF pushes the image further away (easier to reject).', explain: EX('<b>What it shows:</b> the IF = |RF-LO| and the image 2*IF away. <b>Try:</b> a higher IF puts the image further from the RF (easier to filter) but demands a harder IF filter; a lower IF is easier to filter at IF but leaves the image close in — the classic IF-selection trade.') }
    ],
    'image-frequency': [
      { type: 'mixSpec', fRF: 100, fLO: 90, title: 'The image folds onto IF', caption: 'The image at 2*IF from RF converts to the same IF as the signal.', explain: EX('<b>What it shows:</b> both the wanted RF and an image frequency (2*IF away) mix down to the identical IF. <b>Try:</b> move the LO and watch the red image track; without a preselector filter to attenuate it before the mixer, the image interferes with the signal on the same IF.') },
      { type: 'zifSpec', title: 'Image rejection', caption: 'Imperfect rejection leaves a residual image (IRR).', explain: EX('<b>What it shows:</b> how well the image is suppressed sets the image-reject ratio (IRR). <b>Try:</b> increase the imbalance and the residual image rises; a preselector or an image-reject mixer is what drives this leftover image down.') }
    ],
    'superheterodyne': [
      { type: 'rxPlan', IF: 45, fLO: 145, title: 'Single-conversion plan', caption: 'Tunable LO + fixed IF filter — the superhet idea.', explain: EX('<b>What it shows:</b> the superheterodyne receiver — a tunable LO converts any selected RF channel down to one fixed IF, where a high-quality fixed filter does the selectivity. <b>Try:</b> tune the LO to move the selected channel; note the image band the front-end preselector must reject.') },
      { type: 'mixSpec', fRF: 100, fLO: 145, title: 'The conversion & its image', caption: 'RF and image both convert to IF; preselect to kill the image.', explain: EX('<b>What it shows:</b> the down-conversion producing the IF plus the troublesome image. <b>Try:</b> a dual- or multi-conversion superhet uses a high first IF to throw the image far away, then a low second IF for tight channel filtering.') }
    ],
    'zero-if': [
      { type: 'zifSpec', title: 'Zero-IF & I/Q imbalance', caption: 'RF folds to DC; I/Q imbalance raises the residual image (IRR).', explain: EX('<b>What it shows:</b> a direct-conversion (zero-IF) receiver mixes the signal straight to DC using I and Q. <b>Try:</b> add amplitude/phase imbalance between I and Q and the mirror-image on the other side of DC rises — the image-reject ratio (IRR) is set by how well I and Q are matched.') },
      { type: 'mixSpec', fRF: 100, fLO: 100, title: 'DC-offset / self-mixing', caption: 'With LO = RF the wanted signal sits at DC (IF = 0).', explain: EX('<b>What it shows:</b> setting LO = RF makes IF = 0, so the signal lands at DC — the defining feature of zero-IF. <b>Try:</b> note that LO leakage self-mixing then also lands at DC as an offset, the other big zero-IF impairment alongside I/Q imbalance.') }
    ],
    'normal-distribution': [
      { type: 'ndPdf', title: 'Gaussian pdf & the k-sigma band', caption: 'Slide mu, sigma and k — the shaded band prints its enclosed probability.', explain: EX('<b>What it shows:</b> the normal (Gaussian) pdf. <b>Try:</b> shifting mu slides the bell, sigma widens it, and the k-sigma band shows the famous 68-95-99.7 rule — the enclosed probability depends only on k, not on mu or sigma.') },
      { type: 'ndClt', title: 'Central-limit theorem in action', caption: 'Sum more uniforms and watch a bell emerge from flat noise.', explain: EX('<b>What it shows:</b> the CLT — add up N independent uniform variables and their (normalized) sum converges to a Gaussian. <b>Try:</b> N=1 is flat, but by N=3-4 the bell is already unmistakable. This is why thermal noise, made of countless tiny contributions, is Gaussian.') },
      { type: 'gaussianNoise', title: 'Gaussian samples vs the pdf', caption: 'Drag the noise sigma and watch the histogram track the curve.', explain: EX('Random Gaussian samples (blue) fill the theoretical pdf (orange) — the same distribution that models receiver thermal noise.') }
    ],
    'error-function': [
      { type: 'erfTail', title: 'The Q-function tail area', caption: 'Drag the threshold x — the shaded tail is Q(x) = 0.5*erfc(x/sqrt2).', explain: EX('<b>What it shows:</b> Q(x) is the area under the standard-normal curve to the right of x. <b>Try:</b> slide x outward and the tail (and its probability) shrinks fast. Q and the error function erfc are two names for this same tail integral that governs detection error rates.') },
      { type: 'erfBer', title: 'BPSK BER from the Q-function', caption: 'Drag Eb/N0 — the operating point reads BER = Q(sqrt(2 Eb/N0)).', explain: EX('<b>What it shows:</b> the error function turns link SNR into a bit-error probability. <b>Try:</b> move the operating point; the classic waterfall Pb = Q(sqrt(2 Eb/N0)) plunges steeply, so a couple of extra dB slash the error rate by orders of magnitude.') },
      { type: 'berCurve', series: [{ name: 'bpsk' }], title: 'Where erfc shows up', caption: 'Every coherent BER curve is built from Q/erfc.', explain: EX('The BER of essentially every coherent scheme is a Q-function of the SNR — the error function is the workhorse of digital-comm analysis.') }
    ],
    'rayleigh-distribution': [
      { type: 'rayPdf', title: 'Rayleigh pdf, mode & mean', caption: 'Slide sigma — the markers track mode = sigma and mean = sigma*sqrt(pi/2).', explain: EX('<b>What it shows:</b> the Rayleigh pdf of a fading envelope. <b>Try:</b> change sigma; the peak (mode) sits at sigma while the mean is a bit higher at sigma*sqrt(pi/2). This is the amplitude distribution when there is no dominant line-of-sight path.') },
      { type: 'rayEnv', title: 'Fading envelope vs time', caption: 'Set a fade threshold and count the deep fades below it.', explain: EX('<b>What it shows:</b> two independent Gaussian quadratures (I and Q) combine into a Rayleigh-distributed envelope that fades over time. <b>Try:</b> lower the threshold and the red deep-fade dropouts — where the signal briefly vanishes — become rarer. Diversity and coding exist to ride through exactly these fades.') },
      { type: 'gaussianNoise', title: 'The Gaussian quadratures behind it', caption: 'Each of I and Q is Gaussian; their magnitude is Rayleigh.', explain: EX('A Rayleigh envelope is the magnitude of two zero-mean Gaussian components — this shows one such Gaussian quadrature.') }
    ],
    'awgn': [
      { type: 'awgnScatter', title: 'Constellation in AWGN', caption: 'Pick BPSK/QPSK and drag Eb/N0 — compare measured vs theoretical BER.', explain: EX('<b>What it shows:</b> ideal symbols (orange) blurred by a Gaussian noise cloud. <b>Try:</b> drop Eb/N0 and the cloud spills across the decision axes, flipping bits; the measured BER tracks the theoretical Q(sqrt(2 Eb/N0)) — the channel that all digital links are benchmarked against.') },
      { type: 'awgnPsd', title: 'Why it is called "white"', caption: 'The AWGN power spectral density is flat across all frequencies.', explain: EX('<b>What it shows:</b> AWGN has a flat (white) power spectral density at N0/2, in contrast to a coloured noise that emphasises some frequencies. <b>Try:</b> raise the level; the whole flat floor lifts. "White" = equal power everywhere, "additive" = it simply sums with the signal.') },
      { type: 'gaussianNoise', title: 'Gaussian amplitude statistics', caption: 'AWGN amplitudes follow the bell curve.', explain: EX('The "G" in AWGN — its instantaneous amplitude is Gaussian, matching the theoretical pdf as samples accumulate.') }
    ],
    'trellis-diagram': [
      { type: 'trelPath', title: 'K=3 trellis & survivor path', caption: 'Step through time — the teal survivor path grows across the 4-state trellis.', explain: EX('<b>What it shows:</b> a 4-state (K=3) convolutional-code trellis unrolled over time; each state can go to two next states (a butterfly). <b>Try:</b> step forward and watch the single surviving maximum-likelihood path (teal) extend — the structure the Viterbi decoder walks.') },
      { type: 'trellis', title: 'Add-compare-select in action', caption: 'Step the decode: one survivor is kept per state.', explain: EX('<b>What it shows:</b> the Viterbi "add-compare-select" step keeps exactly one survivor into every state, so the search stays linear rather than exponential in length.') },
      { type: 'berCurve', series: [{ name: 'bpsk' }, { name: 'coded' }], title: 'The coding gain it delivers', caption: 'Decoding the trellis buys a left-shift in BER.', explain: EX('Following the best path through the trellis corrects errors, shifting the BER curve left by the coding gain.') }
    ],
    'vco': [
      { type: 'vcoTune', title: 'VCO tuning curve', caption: 'Slide Kvco — the slope of frequency vs control voltage.', explain: EX('<b>What it shows:</b> a VCO’s output frequency rides on its control voltage, f = f0 + Kvco·V. <b>Try:</b> a bigger Kvco tunes over a wider range but also turns any noise on the control line into more frequency (phase) noise — the core VCO design trade.') },
      { type: 'phaseNoise', title: 'VCO phase noise', caption: 'Real oscillators have a noise skirt.', explain: EX('A VCO is never perfectly pure — its phase noise (Leeson skirt) is what a PLL is built to clean up close-in.') },
      { type: 'pllStep', title: 'The VCO inside a loop', caption: 'A PLL steers the VCO to lock.', explain: EX('The VCO is the actuator of a PLL; the loop drives its control voltage so its phase tracks the reference.') }
    ],
    'nco': [
      { type: 'ncoDDS', title: 'NCO phase accumulator', caption: 'Change the frequency word (FCW) and watch the tone.', explain: EX('<b>What it shows:</b> an NCO adds a frequency word to a phase accumulator each clock, then looks up the sine. <b>Try:</b> bigger FCW = steeper ramp = higher output frequency, f_out = FCW·f_clk/2^N. It is the all-digital cousin of the VCO.') },
      { type: 'fftDemo', title: 'Output spectrum', caption: 'An NCO makes a clean spectral tone.', explain: EX('The NCO output is a tone whose frequency is set purely by a number — the basis of direct digital synthesis (DDS).') },
      { type: 'sincImages', title: 'Feeding a DAC', caption: 'The NCO usually drives a DAC (sinc & images).', explain: EX('An NCO+DAC is a DDS; the DAC’s zero-order hold then imposes the sinc droop and images.') }
    ],
    'cfo': [
      { type: 'cfoSpin', title: 'CFO spins the constellation', caption: 'Increase the offset — the points rotate faster.', explain: EX('<b>What it shows:</b> a carrier-frequency mismatch rotates every symbol by 2π·Δf·t, smearing the constellation into a spiral. <b>Try:</b> raise the CFO and the points spin — left uncorrected it destroys the link (and breaks OFDM orthogonality).') },
      { type: 'fllPull', title: 'Correcting the offset', caption: 'A frequency loop pulls the offset to zero.', explain: EX('An FLL (or pilot-based estimator) measures the CFO and de-rotates it back to zero before detection.') },
      { type: 'berCurve', title: 'Uncorrected CFO costs SNR', caption: 'Residual CFO raises the error rate.', explain: EX('Even a small leftover CFO rotates points across decision boundaries, shifting you up the BER curve.') }
    ],
    'dll': [
      { type: 'dllAlign', title: 'DLL delay alignment', caption: 'Slide the delay until the edges line up (lock).', explain: EX('<b>What it shows:</b> a DLL tunes a delay line so its output clock edge aligns with a reference. <b>Try:</b> adjust the delay to alignment. Because a delay is a pure gain (no integrator), a DLL is first-order — unconditionally stable and it does not accumulate jitter like a PLL.') },
      { type: 'pllStep', title: 'Contrast: a PLL is 2nd-order', caption: 'The PLL uses a VCO and can ring.', explain: EX('A PLL’s VCO integrates phase (2nd-order, can overshoot/ring); a DLL’s delay line does not — the key DLL-vs-PLL difference.') },
      { type: 'phaseNoise', title: 'Lower jitter accumulation', caption: 'DLLs don’t accumulate phase noise.', explain: EX('Because a DLL doesn’t integrate, it doesn’t build up phase noise over time the way a free-running VCO/PLL can.') }
    ],
    'turbo-codes': [
      { type: 'turboEncoder', title: 'Turbo encoder structure', caption: 'Two RSC encoders and an interleaver.', explain: EX('<b>What it shows:</b> a turbo code sends the data plus two parity streams — one from an encoder on the original bits, one from an encoder on interleaved bits. The interleaver is the secret sauce that makes the two views nearly independent, enabling powerful iterative decoding.') },
      { type: 'berCurve', series: [{ name: 'bpsk' }, { name: 'coded' }], title: 'Near-Shannon waterfall', caption: 'A steep cliff close to the limit.', explain: EX('Iterative (turbo) decoding produces a very steep BER waterfall within a fraction of a dB of the Shannon limit — its historic breakthrough.') },
      { type: 'trellis', title: 'Its component codes', caption: 'Each RSC is decoded on a trellis.', explain: EX('Each constituent convolutional code is decoded (softly, BCJR/MAP) on a trellis; the two decoders swap extrinsic info each iteration.') }
    ],
    'ldpc': [
      { type: 'tannerGraph', title: 'LDPC Tanner graph', caption: 'Sparse links between bits and parity checks.', explain: EX('<b>What it shows:</b> an LDPC code is defined by a sparse parity-check matrix, drawn here as a bipartite graph — code bits (circles) wired to parity checks (squares). <b>Belief propagation</b> passes messages along these edges until every check is satisfied. Sparsity is what makes decoding feasible near capacity.') },
      { type: 'berCurve', series: [{ name: 'bpsk' }, { name: 'coded' }], title: 'Near-capacity performance', caption: 'A steep waterfall like turbo codes.', explain: EX('LDPC codes rival turbo codes, getting within a fraction of a dB of Shannon with a low error floor.') },
      { type: 'capacity', title: 'Approaching the Shannon limit', caption: 'LDPC gets close to this ceiling.', explain: EX('Well-designed irregular LDPC codes operate remarkably close to the Shannon capacity bound.') }
    ],
    'rs232': [
      { type: 'serialFrame', title: 'RS-232 async frame (8N1)', caption: 'Change the byte and watch the start/data/stop bits.', explain: EX('<b>What it shows:</b> RS-232 has no clock wire — it frames each byte with a start bit and stop bit so the receiver can find the byte. <b>Try:</b> change the data byte; bits go out LSB-first between the orange start/stop bits. 10 bits carry 8 data bits → 80% efficient.') },
      { type: 'lengthVsRate', title: 'Speed vs cable length', caption: 'Faster signalling means shorter usable cable.', explain: EX('<b>What it shows:</b> RS-232 is single-ended and short-range; like all wired links, going faster shortens the reach. <b>Try:</b> slide the rate — RS-232 tops out around 15 m at modest speeds.') },
      { type: 'busTopology', multidrop: false, title: 'Point-to-point link', caption: 'RS-232 connects exactly two devices.', explain: EX('<b>What it shows:</b> RS-232 is strictly one driver to one receiver (e.g. PC ↔ modem) — no sharing, no addressing.') }
    ],
    'rs422': [
      { type: 'diffSignal', title: 'Differential noise rejection', caption: 'Add common-mode noise — A−B cancels it.', explain: EX('<b>What it shows:</b> RS-422 sends each bit as the difference between two wires. <b>Try:</b> add noise — it lands on both wires equally, so the receiver’s A−B subtraction cancels it. That is why RS-422 runs far and fast where RS-232 can’t.') },
      { type: 'serialFrame', title: 'Same async framing', caption: 'RS-422 usually carries UART-style frames.', explain: EX('<b>What it shows:</b> RS-422 changes only the electrical layer — the data is still framed like RS-232 (start/data/stop), just sent differentially.') },
      { type: 'lengthVsRate', title: 'Reach vs speed', caption: '10 Mbps at ~12 m down to 100 kbps at ~1200 m.', explain: EX('<b>What it shows:</b> the classic RS-422/485 trade — up to ~1200 m slow, or ~10 Mbps short. <b>Try:</b> drag the rate to read the max length.') }
    ],
    'rs485': [
      { type: 'diffSignal', title: 'Differential signalling', caption: 'Common-mode noise cancels in A−B.', explain: EX('<b>What it shows:</b> like RS-422, RS-485 is differential for noise immunity and long reach. <b>Try:</b> add noise and watch A−B stay clean.') },
      { type: 'busTopology', multidrop: true, nodes: 6, title: 'Multidrop bus', caption: 'Many devices share one twisted pair.', explain: EX('<b>What it shows:</b> RS-485’s superpower — up to 32 unit loads share one bus, terminated (R) at both ends. <b>Try:</b> add devices. Only one may drive at a time (half-duplex), so a protocol decides whose turn it is.') },
      { type: 'lengthVsRate', title: 'Reach vs speed', caption: 'Same length-rate curve as RS-422.', explain: EX('<b>What it shows:</b> RS-485 shares the RS-422 reach curve — long and slow, or short and fast.') }
    ],
    'lvds': [
      { type: 'diffSignal', title: 'Low-voltage differential', caption: 'A tiny differential swing, noise cancels.', explain: EX('<b>What it shows:</b> LVDS drives a small (~350 mV) differential swing at very high speed. <b>Try:</b> add noise — the differential receiver rejects it, so LVDS can run at gigabit rates on low power.') },
      { type: 'lengthVsRate', title: 'Very fast, short reach', caption: 'Gigabit rates over short distances.', explain: EX('<b>What it shows:</b> LVDS trades distance for blistering speed — it lives on short board/cable runs (displays, camera links), the far top-left of this curve.') },
      { type: 'busTopology', multidrop: false, title: 'Usually point-to-point', caption: 'Short, terminated differential pair.', explain: EX('<b>What it shows:</b> LVDS is typically a point-to-point differential pair with a 100 Ω termination at the receiver.') }
    ],
    'spi': [
      { type: 'spiTiming', title: 'SPI timing (CPOL/CPHA)', caption: 'Pick a mode — see the clock idle level & sample edge.', explain: EX('<b>What it shows:</b> SPI is clocked (SCLK) and full-duplex — MOSI and MISO shift together, one bit per clock, while SS is low. <b>Try:</b> switch modes; CPOL sets the idle clock level and CPHA sets which edge samples the data.') },
      { type: 'busTopology', multidrop: true, nodes: 4, title: 'One master, several slaves', caption: 'Each slave gets its own chip-select.', explain: EX('<b>What it shows:</b> SPI shares SCLK/MOSI/MISO but selects one slave at a time with a dedicated SS line — no addressing, no acknowledge.') },
      { type: 'lengthVsRate', title: 'Short on-board reach', caption: 'SPI is a fast, very short-range bus.', explain: EX('<b>What it shows:</b> with no differential signalling, SPI is meant for chip-to-chip on one board — high clock rate but centimetres, not metres.') }
    ],
    'axi': [
      { type: 'axiHandshake', title: 'VALID/READY handshake', caption: 'Data moves only when both are high.', explain: EX('<b>What it shows:</b> every AXI channel uses a VALID/READY handshake — the sender raises VALID, the receiver raises READY, and a beat transfers only when both are high. <b>Try:</b> add a stall (READY low) to see back-pressure pause the burst with no data lost.') },
      { type: 'busTopology', multidrop: true, nodes: 5, title: 'On-chip interconnect', caption: 'Masters and slaves via an interconnect.', explain: EX('<b>What it shows:</b> AXI is the on-chip bus that ties CPUs, DMA and peripherals together inside an SoC/FPGA through an interconnect.') },
      { type: 'spiTiming', title: 'Contrast: a simple serial bus', caption: 'SPI is trivial next to AXI’s channels.', explain: EX('<b>Contrast:</b> where SPI just shifts bits on a clock, AXI adds separate address/data/response channels, bursts, and handshaking for high-throughput memory-mapped access.') }
    ],
    'mil-std-1553': [
      { type: 'manchester', title: 'Manchester-encoded words', caption: 'The clock is embedded in every bit.', explain: EX('<b>What it shows:</b> 1553 encodes data in Manchester-II, so every bit has a mid-bit transition — the receiver recovers the clock from the data itself (no separate clock wire), and it’s DC-balanced for transformer coupling.') },
      { type: 'busTopology', multidrop: true, nodes: 6, title: 'Dual-redundant bus', caption: 'A Bus Controller commands up to 31 terminals.', explain: EX('<b>What it shows:</b> 1553 is a command/response bus — one Bus Controller directs up to 31 Remote Terminals over a shared, terminated bus (usually dual-redundant for reliability).') },
      { type: 'diffSignal', title: 'Transformer-coupled differential', caption: 'Balanced differential for noise immunity.', explain: EX('<b>What it shows:</b> 1553 uses a balanced, transformer-coupled differential pair — robust against the harsh electrical noise of a military aircraft.') }
    ],
    'am': [{ type: 'amWave', title: 'AM waveform & envelope', caption: 'Raise the modulation index and watch the envelope grow.', explain: EX('<b>What it shows:</b> AM rides the message on the carrier’s amplitude — the orange envelope IS your signal. <b>Try:</b> push m past 1 and the envelope crosses zero (overmodulation), which a simple envelope detector can no longer recover. Note how little power is efficient (≤33%).') }],
    'fm': [{ type: 'fmWave', title: 'FM waveform', caption: 'The carrier squeezes and stretches with the message.', explain: EX('<b>What it shows:</b> FM puts the message into the carrier’s frequency — tighter cycles where the message is high, looser where it’s low. <b>Try:</b> raise β and the frequency swings harder, widening the spectrum per Carson’s rule (~2(β+1)·fm). That extra bandwidth is what buys FM its noise immunity.') }],
    'qpsk': [{ type: 'constellation', order: 4, snr: 14, title: 'QPSK constellation', caption: 'Four phases = 2 bits/symbol; lower SNR to see errors.', explain: EX('<b>What it shows:</b> QPSK is two BPSK channels (I and Q) at once — four points, 2 bits each. <b>Try:</b> drop the SNR until the clouds cross the axes. Per-bit error rate is identical to BPSK, but QPSK carries twice the data in the same bandwidth.') }],
    'rrc-filter': [{ type: 'raisedCosine', title: 'The (raised-cosine) pulse it builds', caption: 'Two RRC filters (Tx×Rx) combine into this zero-ISI shape.', explain: EX('<b>What it shows:</b> a single RRC is not zero-ISI on its own — but an RRC at the transmitter times an RRC at the receiver equals this raised-cosine, which is zero at every neighbouring symbol. <b>Try:</b> β trades excess bandwidth for gentler tails. Splitting it this way also makes the receiver a matched filter.') }],
    'bandwidth': [{ type: 'spectrumBuilder', title: 'Occupied bandwidth', caption: 'A signal’s spectrum spans a range of frequencies.', explain: EX('<b>What it shows:</b> bandwidth is how much of the frequency axis a signal occupies. <b>Try:</b> add a second tone and the spread widens. Real definitions differ — −3 dB (half-power), null-to-null, or 99% occupied — but all measure this same “width in frequency.”') }],
    'early-late-correlator': [{ type: 'earlyLate', title: 'Early-Late timing discriminator', caption: 'Drag the timing error — the E−L S-curve pulls it to zero.', explain: EX('<b>What it shows:</b> Early, Prompt and Late correlators sample the code-correlation triangle at ε−d/2, ε, ε+d/2. <b>Try:</b> off-time, Early and Late are unequal, so (Early − Late) is non-zero and pushes the loop back toward perfect alignment (ε=0). This S-curve is the heart of GPS code tracking and symbol-timing recovery.') }],
    'polarization': [{ type: 'polarizationEllipse', title: 'Polarization ellipse', caption: 'Set the amplitude ratio and phase to trace linear/circular/elliptical.', explain: EX('<b>What it shows:</b> the tip of the E-field traces this shape as the wave passes. <b>Try:</b> equal amplitudes with a 90° phase gives a circle (circular polarization); 0° phase gives a straight line (linear); anything else is an ellipse. Matching the receiver’s polarization to this is what avoids signal loss.') }],
    'shannon': [{ type: 'capacity', title: 'Shannon capacity', caption: 'Drag SNR to read the maximum error-free bit-rate per hertz.', explain: EX('<b>What it shows:</b> Shannon’s ceiling C = B·log₂(1+SNR) — the fastest error-free rate any scheme can ever reach. <b>Try:</b> notice it climbs fast at low SNR then flattens; beyond ~20 dB, more power barely helps, which is why we add bandwidth or antennas (MIMO) to go faster. No code can beat this line.') }],
    'source-coding': [{ type: 'entropyCoding', title: 'Entropy = the compression limit', caption: 'Skew the symbol probabilities and watch how compressible the source becomes.', explain: EX('<b>What it shows:</b> entropy is the average information per symbol — the hard floor for lossless compression. <b>Try:</b> a 50/50 source (entropy 1 bit) can’t be squeezed; make one symbol far more likely and entropy drops, so a coder (like Huffman/ZIP) can represent it in far fewer bits. Predictable = compressible.') }],
    'sinc-function': [{ type: 'sincFunction', title: 'The sinc function', caption: 'Change the width and see the zero crossings move.', explain: EX('<b>What it shows:</b> sinc(x)=sin(πx)/(πx) — the shape behind ideal sampling and pulse shaping. <b>Try:</b> it’s 1 at the centre and exactly zero at every other integer (the teal dots), which is what lets samples not interfere. A wider sinc in time means a narrower rectangle in frequency — the time-frequency duality.') }],
    'frequency-spectrum': [{ type: 'spectrumBuilder', title: 'A signal is a sum of tones', caption: 'Add a second tone and watch both the wave and its spectrum change.', explain: EX('<b>What it shows:</b> the spectrum is the list of pure tones (their frequency and amplitude) that make up a signal. <b>Try:</b> change the second tone — the wiggly time-waveform (top) reshapes, and its spectrum (bottom) is just two clean lines. Every complicated signal is really a recipe of simple sine waves.') }],
    'fft': [{ type: 'fftDemo', title: 'FFT: find the hidden tones', caption: 'Move the second tone and watch its spike track in the spectrum.', explain: EX('<b>What it shows:</b> the FFT is a fast algorithm that computes a signal’s spectrum. <b>Try:</b> even with noise smeared over the time waveform (top), the FFT (bottom) pulls out sharp spikes exactly at the tones present. This near-magical clean-up is why the FFT is the workhorse of all DSP.') }],
    'fir-filters': [{ type: 'firResponse', title: 'FIR filter response', caption: 'Add taps to sharpen the cutoff.', explain: EX('<b>What it shows:</b> an FIR filter mixes recent input samples (no feedback), so it is always stable and has perfectly linear phase. <b>Try:</b> more taps → a sharper transition from passband to stopband, at the cost of more computation and delay. This is the safe, predictable filter.') }],
    'iir-filters': [{ type: 'iirResponse', title: 'IIR filter response', caption: 'Move the pole toward the unit circle to sharpen (and risk instability).', explain: EX('<b>What it shows:</b> an IIR filter uses feedback, so a single coefficient can give a sharp response — far cheaper than an FIR. <b>Try:</b> push the pole radius toward 1 and the cutoff sharpens; go past 1 and it would blow up. The trade for that efficiency is nonlinear phase and a stability worry.') }],
    'convolutional-codes': [{ type: 'trellis', title: 'Convolutional-code trellis', caption: 'Step through the trellis the encoder walks (and Viterbi decodes).', explain: EX('<b>What it shows:</b> a convolutional encoder slides bits through a shift register, tracing a path through this trellis of states. <b>Try:</b> step through — each stage the code moves between states; the decoder (Viterbi) later finds the most likely path back. The redundancy woven into that path is what corrects errors.') }],
    'channel-coding': [{ type: 'berCurve', series: [{ name: 'bpsk' }, { name: 'coded' }], title: 'Coding gain', caption: 'The left-shift of the curve is the coding gain (dB).', explain: EX('<b>What it shows:</b> channel coding adds structured redundancy so errors can be corrected, shifting the BER curve to the left. <b>Try:</b> at a target error rate, the horizontal gap (~4.5 dB here) is the coding gain — dB you can trade for more range, a smaller antenna, or lower power. This is the flip side of source coding, which removes redundancy.') }],
    'fourier-transform': [{ type: 'fourierTransform', title: 'Building a square wave from pure tones', caption: 'Add harmonics one at a time and watch a square wave appear.', explain: EX('<b>What it shows:</b> any signal is a sum of simple sine waves — the Fourier idea. <b>Try:</b> add more harmonics and the wobbly sum snaps toward a crisp square wave (the little overshoot at the edges is the famous "Gibbs ripple"). Seeing a signal as its recipe of tones is what lets us filter and analyse it.') }],
    'laplace-transform': [{ type: 'laplacePoleZero', title: 's-plane poles ↔ time response', caption: 'Drag the pole across the imaginary axis to flip stable ↔ unstable.', explain: EX('<b>What it shows:</b> a system’s "poles" on the s-plane decide how it behaves in time. <b>Try:</b> keep the pole in the shaded left half → the response decays and settles (stable); push it to the right half → it blows up (unstable). This is exactly how engineers check that cruise control or a feedback loop won’t run away.') }],
    'z-transform': [{ type: 'zPlane', title: 'z-plane poles ↔ digital response', caption: 'Move the pole in/out of the unit circle to see stable vs unstable.', explain: EX('<b>What it shows:</b> the Z-transform is the Laplace idea for step-by-step digital signals; the "danger line" is the unit circle. <b>Try:</b> pole inside the circle → the impulse response fades (stable filter); pole outside → it grows without bound. Every digital filter lives or dies by this rule.') }],
    'convolution': [{ type: 'convolutionDemo', title: 'Convolution: flip and slide', caption: 'Slide t and watch the overlap build the output.', explain: EX('<b>What it shows:</b> convolution is how a system’s response smears an input. <b>Try:</b> as you slide, the moving flipped copy (orange) overlaps the fixed signal (teal); the shaded overlap area is the output value at that instant, tracing out the triangle below. Two boxes convolved make a triangle — that’s an echo/blur in action.') }],
    'correlation': [{ type: 'correlationDemo', title: 'Correlation: find the hidden pattern', caption: 'Slide the template — correlation spikes at the true delay.', explain: EX('<b>What it shows:</b> correlation measures how much two signals look alike at each shift. <b>Try:</b> a known pattern is buried in noise at a secret delay; slide the orange template and the correlation curve peaks exactly where they line up. This is how radar, GPS, and sync words locate a signal in noise.') }],
    'nyquist-sampling': [{ type: 'samplingDemo', title: 'Sampling: is it fast enough?', caption: 'Lower the sample rate below 2×frequency and it breaks.', explain: EX('<b>What it shows:</b> to capture a wave you must sample faster than twice its frequency (the Nyquist rate). <b>Try:</b> above 2f the dots pin the wave down perfectly; drop below and the samples no longer describe the true signal — it can’t be rebuilt. It’s like needing enough film frames to catch a fast motion.') }],
    'aliasing': [{ type: 'aliasingDemo', title: 'Aliasing: a fast tone in disguise', caption: 'Raise the true frequency past the sample rate — see the fake slow wave.', explain: EX('<b>What it shows:</b> sample a fast wave too slowly and the same dots also fit a totally different slow wave — the "alias." <b>Try:</b> crank the true frequency up; the orange dots start tracing a low blue wave that was never really there. It’s the wagon-wheel effect (spokes spinning backwards on film) and why we filter before sampling.') }],
    'pulse-shaping': [{ type: 'raisedCosine', title: 'Raised-cosine pulse & zero-ISI', caption: 'Change the roll-off β to trade bandwidth for smoother tails.', explain: EX('<b>What it shows:</b> a raised-cosine pulse is shaped so it’s exactly zero at every neighbouring symbol time (the teal dots) — so symbols don’t smear into each other (no inter-symbol interference). <b>Try:</b> a bigger β gives gentler tails but uses more bandwidth; smaller β is tighter in frequency but rings more. That trade is at the heart of every modem.') }],
    'eye-diagram': [{ type: 'eyeDiagram', title: 'Eye diagram', caption: 'Add noise or change roll-off and watch the "eye" open or close.', explain: EX('<b>What it shows:</b> overlay every symbol transition and you get an "eye." A wide-open eye means the 1s and 0s are easy to tell apart; a closing eye means trouble. <b>Try:</b> raise the noise and the eye shuts — the height left is your noise margin, and you sample at the widest opening (dashed line).') }],
    'ber': [{ type: 'berCurve', series: [{ name: 'bpsk' }], title: 'The BER "waterfall" curve', caption: 'Drag Eb/N0 and read the error rate.', explain: EX('<b>What it shows:</b> Bit Error Rate is simply the fraction of bits that arrive wrong — your link’s report card. <b>Try:</b> the curve plunges steeply, so just a couple more dB of signal quality can take you from 1 error in 100 to 1 in 100,000. That cliff-like shape is why engineers fight for every last dB.') }],
    'eb-no': [{ type: 'berCurve', series: [{ name: 'bpsk' }], title: 'BER vs Eb/N0', caption: 'Eb/N0 is the fair x-axis for comparing any scheme.', explain: EX('<b>What it shows:</b> Eb/N0 is "energy per bit versus noise" — the fair yardstick that lets you compare any two modulation schemes apples-to-apples. <b>Try:</b> read off how much Eb/N0 a target error rate needs; that number, not raw power, is what link budgets and textbooks quote.') }],
    'processing-gain': [{ type: 'spread', title: 'Processing gain = spread then squeeze', caption: 'Raise the gain and push the signal under the noise floor.', explain: EX('<b>What it shows:</b> processing gain is the boost you get by spreading a signal wide and then correlating it back together. <b>Try:</b> as the gain grows, the signal’s power spreads so thin it drops below the noise floor — yet despreading at the receiver lifts it back out. That’s how GPS is heard from below the noise.') }],
    'jamming-margin': [{ type: 'jammingMargin', title: 'Jamming margin', caption: 'Set processing gain and costs — see how strong a jammer you survive.', explain: EX('<b>What it shows:</b> jamming margin = processing gain minus the SNR you need minus your losses. <b>Try:</b> it tells you how much <i>stronger</i> than your own signal a hostile jammer can be before your link finally breaks. More processing gain buys more anti-jam headroom.') }],
    'sensitivity': [{ type: 'sensitivityStack', title: 'Receiver sensitivity, stacked up', caption: 'Slide bandwidth, NF and required SNR to build the sensitivity number.', explain: EX('<b>What it shows:</b> sensitivity is the faintest signal a receiver can still understand, built from three pieces: the thermal floor (−174 + 10·log₁₀B), plus the receiver’s noise figure, plus the SNR the demodulator needs. <b>Try:</b> narrower bandwidth, lower NF, or a more robust scheme (less required SNR) all push sensitivity lower — meaning you can hear fainter signals and reach farther.') }],
    'comm-basics': [{ type: 'capacity', title: 'Shannon capacity vs SNR', caption: 'Drag the SNR to read the maximum error-free bit-rate per hertz.', explain: EX('<b>What it shows:</b> the hard ceiling C = B·log₂(1+SNR). <b>Try:</b> notice it climbs steeply at low SNR but flattens — past ~20 dB, each extra 3 dB of power buys only ~1 more bit/s/Hz. That diminishing return is why we add <i>bandwidth</i> or <i>antennas</i> (MIMO), not just power, to go faster.') }],
    'noise': [{ type: 'gaussianNoise', title: 'AWGN: samples vs the Gaussian pdf', caption: 'Drag σ (noise power) and watch the histogram track the bell curve.', explain: EX('<b>What it shows:</b> thermal noise really is Gaussian — the random samples (blue) fill the theoretical pdf (orange). <b>Try:</b> increasing σ widens the bell; since noise power ∝ σ² ∝ kTB, this is exactly what a wider bandwidth or hotter receiver does to your noise.') }],
    'psd': [{ type: 'psd', title: 'Power spectral density (periodogram)', caption: 'Lower the SNR until the carrier spike sinks into the noise floor.', explain: EX('<b>What it shows:</b> a single carrier as a spike standing on a flat white-noise floor. <b>Try:</b> drop the SNR — when the spike reaches the floor it becomes undetectable, which is precisely the sensitivity limit of a receiver.') }],
    'noise-floor': [{ type: 'noiseFloorBw', title: 'Noise floor vs bandwidth', caption: 'Slide the noise figure; the whole floor shifts up dB-for-dB.', explain: EX('<b>What it shows:</b> floor = −174 dBm/Hz + 10·log₁₀(B) + NF. <b>Try:</b> the curve rises 3 dB every time bandwidth doubles, and NF lifts the entire line — so a quieter front end or a narrower channel directly improves how weak a signal you can hear.') }],
    'noise-figure': [{ type: 'friisNF', title: 'Friis: why the first stage dominates', caption: 'Increase the LNA gain and watch total NF collapse onto the LNA’s own NF.', explain: EX('<b>What it shows:</b> Friis’ formula F_tot = F₁ + (F₂−1)/G₁. <b>Try:</b> with only a few dB of LNA gain the second stage still hurts, but past ~15 dB the total NF flattens to the LNA alone — the reason the low-noise amp goes <i>first</i>, right at the antenna.') }],
    'phase-noise': [{ type: 'phaseNoise', title: 'Phase-noise skirt (Leeson) & jitter', caption: 'Drag the offset marker to read ℒ(f) and the integrated RMS jitter.', explain: EX('<b>What it shows:</b> an oscillator’s noise skirt falling in −30 then −20 dB/decade slopes to a floor. <b>Try:</b> move the marker outward — the integrated jitter (in degrees) shrinks, showing why close-in phase noise dominates and why it wrecks dense QAM constellations.') }],
    'bpsk': [
      { type: 'constellation', order: 2, snr: 12, title: 'BPSK constellation with live noise', caption: 'Lower the SNR until the two clouds bleed across zero → bit errors.', explain: EX('<b>What it shows:</b> the two antipodal points ±√Eb with a real Gaussian noise cloud. <b>Try:</b> reduce SNR — once a cloud crosses the vertical decision line, the detector flips that bit. That overlap area <i>is</i> the bit-error rate.') },
      { type: 'berCurve', series: [{ name: 'bpsk' }], title: 'BPSK BER vs Eb/N0', caption: 'Drag the marker to read the error rate at any operating point.', explain: EX('<b>What it shows:</b> the benchmark curve Pb = Q(√(2Eb/N0)) on a log axis. <b>Try:</b> the “waterfall” steepness means a couple of extra dB takes you from 1-in-100 to 1-in-10⁵ errors — every dB of link margin counts.') }
    ],
    'dbpsk': [{ type: 'berCurve', series: [{ name: 'coh8' }, { name: 'dbpsk' }], title: 'DBPSK vs coherent BPSK', caption: 'The horizontal gap between the curves is the ~1 dB penalty.', explain: EX('<b>What it shows:</b> differential BPSK (orange) sits about 1 dB right of coherent BPSK (teal). <b>Why:</b> each decision reuses the previous noisy symbol as its reference, so noise counts twice — the price you pay for needing no carrier-phase recovery.') }],
    'matched-filter': [{ type: 'matchedFilter', title: 'Matched filter output', caption: 'Lower the input SNR and watch the correlator still find the peak.', explain: EX('<b>What it shows:</b> a noisy pulse (grey) turned into a clean triangle peaking at t=T (orange) by correlating against the known shape (teal). <b>Try:</b> even at negative SNR the peak survives — the matched filter delivers the maximum possible SNR = 2E/N₀ at the sampling instant.') }],
    'optimal-receiver': [
      { type: 'decisionRegions', title: 'Optimal decision & error tails', caption: 'Move the threshold — the shaded overlap is the error probability; it is smallest at 0.', explain: EX('<b>What it shows:</b> the two conditional densities p(r|s₀) and p(r|s₁); the red shaded tails past the threshold are P(e). <b>Try:</b> slide the threshold away from 0 and P(e) grows — for equal priors the midpoint is optimal, giving Q(√(2Eb/N0)). Raise Eb/N0 to pull the humps apart and watch the error shrink.') },
      { type: 'constellation', order: 4, snr: 12, title: 'Signal space & decision regions (QPSK)', caption: 'Each received dot is decoded to the nearest signal point — the min-distance rule.', explain: EX('<b>What it shows:</b> the sufficient statistic as a point in signal space; the optimal receiver picks the nearest of the four ideal points (the quadrants are the decision regions). <b>Try:</b> lower the SNR until clouds cross the axes — those crossings are exactly the symbol errors the union bound counts.') },
      { type: 'erfBer', title: 'Optimal BER vs Eb/N0', caption: 'The best achievable antipodal error rate, Q(√(2Eb/N0)).', explain: EX('<b>What it shows:</b> the minimum error probability any receiver can reach for antipodal signalling in AWGN. <b>Try:</b> drag the marker — this is the same Q-function the pairwise/union bound is built from, now read directly against Eb/N0.') }
    ],
    'evm': [{ type: 'constellation', order: 16, snr: 22, title: '16-QAM constellation & EVM', caption: 'Drop the SNR and watch tightly-packed points start colliding.', explain: EX('<b>What it shows:</b> EVM is the RMS distance of each received dot from its ideal 16-QAM location. <b>Try:</b> lower SNR (worse EVM) and the clouds merge — dense constellations have tiny spacing, so they demand very low EVM (high SNR) to stay error-free.') }],
    'pll': [{ type: 'pllStep', title: 'PLL phase-step response vs damping', caption: 'Sweep the damping ζ from ringy to sluggish.', explain: EX('<b>What it shows:</b> how the loop’s phase error settles after a disturbance. <b>Try:</b> ζ≈0.707 (the classic choice) settles fast with barely any overshoot; low ζ rings for a long time, high ζ crawls — the core loop-filter design trade-off.') }],
    'fll': [{ type: 'fllPull', title: 'FLL frequency pull-in', caption: 'Crank up the initial offset — the FLL still drags it to zero.', explain: EX('<b>What it shows:</b> a frequency-locked loop capturing a large starting frequency error. <b>Try:</b> set a huge offset (e.g. 200 kHz) — a PLL would slip and never lock, but the FLL still converges, which is why receivers acquire with an FLL first, then hand over to a PLL.') }],
    'costas-loop': [{ type: 'costasScurve', title: 'Costas loop S-curve', caption: 'Drag the phase error — the arrow shows which way the VCO is nudged.', explain: EX('<b>What it shows:</b> the loop error I·Q ∝ sin(2Δφ), which is <i>independent of the data bit</i>. <b>Try:</b> the curve crosses zero (stable lock) at both 0° and ±180° — that second stable point is the famous 180° phase ambiguity you fix with differential coding or a preamble.') }],
    'dsss': [{ type: 'spread', title: 'Spreading lowers the PSD', caption: 'Raise the processing gain and push the signal under the floor.', explain: EX('<b>What it shows:</b> the same total power spread over N× the bandwidth, so its PSD drops by the processing gain (10·log₁₀N). <b>Try:</b> at high gain the blue spread signal sinks below the noise floor — exactly how GPS hides ~20 dB under the noise yet still gets recovered by despreading.') }],
    'frequency-hopping': [{ type: 'hopping', title: 'Frequency-hop pattern', caption: 'Change the channel count and watch the jammer’s hit-rate fall.', explain: EX('<b>What it shows:</b> the carrier hopping pseudo-randomly across channels over time; the red channel is jammed. <b>Try:</b> more channels means the jammer catches a smaller fraction of dwells — and forward error correction repairs those few, so the link survives.') }],
    'pn-codes': [{ type: 'autocorr', title: 'm-sequence autocorrelation', caption: 'Change the register length and see the period 2ⁿ−1 and the sharp peak.', explain: EX('<b>What it shows:</b> the two-valued autocorrelation of an LFSR m-sequence — a tall spike of height L at zero shift, and −1 everywhere else. <b>Try:</b> more stages → a longer code with a sharper, more selective peak, which is what lets a receiver nail code timing to a fraction of a chip.') }],
    'gold-code': [{ type: 'crosscorr', title: 'Gold-code cross-correlation', caption: 'Slide across shifts — every value is one of just three small numbers.', explain: EX('<b>What it shows:</b> the cross-correlation between two <i>different</i> Gold codes. <b>Try:</b> every bar is −1, −9 or 7 (tiny vs the peak of 31) — this bounded three-valued property is why 30+ GPS satellites can share one frequency without drowning each other out.') }],
    'fec': [{ type: 'berCurve', series: [{ name: 'bpsk' }, { name: 'coded' }], title: 'Coding gain', caption: 'The left-shift of the curve is the coding gain, in dB.', explain: EX('<b>What it shows:</b> adding forward error correction moves the BER curve to the left. <b>Try:</b> at a target BER, the horizontal gap (~4.5 dB here) is the coding gain — dB you can spend on more range, a smaller antenna, or lower transmit power.') }],
    'viterbi': [{ type: 'trellis', title: 'Viterbi trellis & survivor path', caption: 'Step through the decode to watch the survivor path grow.', explain: EX('<b>What it shows:</b> the trellis of a convolutional code; the orange node is the stage being processed, the teal path is the surviving maximum-likelihood sequence. <b>Try:</b> step forward — at each stage “add–compare–select” keeps only one path into every state, which is how Viterbi avoids an exponential search.') }],
    'sdr': [{ type: 'iqDemod', title: 'I/Q: one complex sample = amplitude + phase', caption: 'Drag phase and amplitude — read off I and Q.', explain: EX('<b>What it shows:</b> an SDR represents the signal as a complex number I + jQ. <b>Try:</b> spin the phasor: I = A·cosφ and Q = A·sinφ change together, yet the pair always encodes the full amplitude <i>and</i> phase. That is why quadrature (I/Q) sampling can represent any modulation at baseband.') }],
    'ad9361': [{ type: 'tunableRx', title: 'Agile tuning — a movable capture window', caption: 'Tune the LO across 70 MHz–6 GHz and set the bandwidth to grab a signal.', explain: EX('<b>What it shows:</b> the AD9361 is a wideband tunable transceiver — a narrow capture window you can place anywhere in the band. <b>Try:</b> slide the LO onto a signal (FM, GPS, Wi-Fi…) and widen the bandwidth until it fits; that “tune anywhere, choose your slice” agility is the whole point of the chip.') }],
    'adc': [{ type: 'quantize', title: 'Quantization & SNR', caption: 'Add bits and watch the staircase refine (and SNR jump ~6 dB/bit).', explain: EX('<b>What it shows:</b> an N-bit ADC snapping a smooth sine onto 2ᴺ levels. <b>Try:</b> each extra bit halves the step size and adds ~6 dB of SNR (6.02N+1.76) — the fundamental resolution-vs-quality trade in every data converter.') }],
    'dac': [{ type: 'sincImages', title: 'DAC sinc roll-off & images', caption: 'Move the signal frequency; toggle the inverse-sinc pre-emphasis.', explain: EX('<b>What it shows:</b> a DAC’s zero-order hold droops the passband by a sinc envelope and creates image copies at every multiple of fs. <b>Try:</b> slide the tone toward fs/2 to see the droop grow, then switch on pre-emphasis to flatten it — and note the images a reconstruction filter must remove.') }],
    'rfsoc': [{ type: 'nyquistZones', title: 'Direct RF sampling & Nyquist zones', caption: 'Sweep the input frequency — see which zone it folds from.', explain: EX('<b>What it shows:</b> an RFSoC samples RF directly at gigasamples/sec. A tone above fs/2 lives in a higher Nyquist zone and <i>aliases</i> down to a baseband copy. <b>Try:</b> move the input — the orange alias is what the ADC actually captures, letting the chip receive high-band RF with no analog mixer.') }],
    'rssi': [{ type: 'pathLoss', title: 'Received power vs distance', caption: 'Change the path-loss exponent to model open vs cluttered sites.', explain: EX('<b>What it shows:</b> RSSI is really received power, which falls with distance. <b>Try:</b> raise the exponent n from 2 (free space) toward 3.5 (indoor/urban) — the steeper drop is why RSSI-based distance estimates are so environment-dependent and noisy.') }],
    'path-loss': [{ type: 'pathLoss', title: 'Path loss vs distance & frequency', caption: 'Compare 100 MHz / 1 GHz / 5 GHz; drag the exponent for real channels.', explain: EX('<b>What it shows:</b> free-space loss adds 6 dB per doubling of distance <i>and</i> per doubling of frequency. <b>Try:</b> the 5 GHz line always sits above the 100 MHz line — the reason sub-GHz bands reach farther and why mmWave needs dense small cells.') }],
    'link-budget': [{ type: 'linkWaterfall', title: 'Link-budget calculator', caption: 'Slide Tx power, distance and antenna gain — watch the margin.', explain: EX('<b>What it shows:</b> gains add (green), losses subtract (red), and the running total lands at received power vs the sensitivity line. <b>Try:</b> push distance out until the margin goes negative (“LINK FAILS”), then recover it with antenna gain or Tx power — the everyday trade of RF system design.') }],
    'antenna': [{ type: 'polarPattern', N: 4, title: 'Radiation pattern (steerable)', caption: 'Add elements to sharpen the beam; steer it off broadside.', explain: EX('<b>What it shows:</b> the polar radiation pattern of an antenna array — a main lobe plus side lobes. <b>Try:</b> more elements narrows the main beam (more gain) but raises more side lobes; steering shifts the beam electronically, the basis of phased arrays.') }],
    'antenna-gain': [{ type: 'gainFreq', title: 'Aperture gain vs frequency', caption: 'Change dish size and frequency to read the gain directly.', explain: EX('<b>What it shows:</b> G = η·4πA/λ². <b>Try:</b> doubling the frequency or the diameter both raise the gain — a bigger dish or a higher band gives a tighter, higher-gain beam, which is why satellite and radar dishes reach tens of dBi.') }],
    'antenna-beamwidth': [{ type: 'polarPattern', N: 8, title: 'Beamwidth vs array size', caption: 'Grow the array and watch the half-power beamwidth shrink.', explain: EX('<b>What it shows:</b> half-power beamwidth (HPBW) versus the number of elements / aperture size. <b>Try:</b> more elements → a narrower main lobe (higher gain) but a tighter pointing requirement, and more side lobes to manage — the gain-vs-beamwidth trade.') }],
    'antenna-types': [{ type: 'antennaZoo', title: 'Antenna zoo — pick a type', caption: 'Switch between isotropic, dipole, and arrays to compare patterns.', explain: EX('<b>What it shows:</b> the radiation pattern and typical gain of common antennas. <b>Try:</b> the isotropic reference is a circle (0 dBi); the dipole is a gentle lobe (2.15 dBi); arrays focus energy into an ever-narrower beam — how you choose an antenna for coverage vs range.') }],
    'maxwell': [{ type: 'emWave', title: 'Propagating EM plane wave', caption: 'Play/pause the self-sustaining E and B fields.', explain: EX('<b>What it shows:</b> a plane wave with the electric (blue) and magnetic (teal) fields at right angles, in step, moving together. <b>Why:</b> a changing E makes a B and vice-versa, so the fields regenerate each other and propagate at c = 1/√(μ₀ε₀) — light and radio are the same thing.') }]
  };

  /* ---- registry / render ---- */
  function render(host, spec) {
    const fn = T[spec.type];
    if (!fn) { host.appendChild(el('div', 'fig-caption', 'Figure "' + spec.type + '" not available.')); return; }
    try { fn(host, spec); } catch (e) { host.appendChild(el('div', 'fig-caption', 'Figure error: ' + e.message)); }
  }

  return { render, T, C, map, _util: { Q, gauss, dB, lin } };
})();
