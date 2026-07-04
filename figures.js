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

  /* ---- topic → figure specs map ---- */
  const EX = s => s; // helper for readability
  const map = {
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
