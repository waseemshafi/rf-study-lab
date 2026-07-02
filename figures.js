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
  const M = { left: 52, right: 18, top: 16, bottom: 42 };
  const plotBox = (w, h) => ({ x: M.left, y: M.top, w: w - M.left - M.right, h: h - M.top - M.bottom });

  /* ================= FIGURE GENERATORS ================= */
  const T = {};

  // Shannon capacity C/B vs SNR(dB)
  T.capacity = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const ax = drawAxes(ctx, plotBox(w, h), { xr: [-10, 40], yr: [0, 14], xlabel: 'SNR (dB)', ylabel: 'Capacity  C/B  (bit/s/Hz)' });
    const pts = []; for (let d = -10; d <= 40; d += 0.5) pts.push([d, Math.log2(1 + lin(d))]);
    line(ctx, ax, pts, C.blue, 2.5);
    // low-SNR linear approx marker
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('≈ +1 bit/s/Hz per 3 dB (high SNR)', ax.x + 60, ax.y + 30);
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

  // Phase noise L(f) log-log with Leeson slopes
  T.phaseNoise = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const box = plotBox(w, h);
    const ax = drawAxes(ctx, box, {
      xr: [10, 1e7], yr: [-160, -20], logx: true, xlabel: 'offset from carrier (Hz)', ylabel: 'ℒ(f)  (dBc/Hz)',
      xtickfmt: t => { const e = Math.log10(t); return e >= 6 ? (t / 1e6) + 'M' : e >= 3 ? (t / 1e3) + 'k' : t; }
    });
    // piecewise Leeson: -30 dB/dec (1/f^3) then -20 (1/f^2) then flat floor
    const pts = [];
    for (let e = 1; e <= 7; e += 0.05) {
      const f = Math.pow(10, e); let L;
      if (f < 1e3) L = -60 - 30 * (Math.log10(f) - 1);         // 1/f^3
      else if (f < 1e5) L = -120 - 20 * (Math.log10(f) - 3);   // 1/f^2
      else L = -160;                                           // floor
      pts.push([f, Math.max(L, -160)]);
    }
    line(ctx, ax, pts, C.blue, 2.5);
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('−30 dB/dec', ax.fx(60), ax.fy(-70));
    ctx.fillText('−20 dB/dec', ax.fx(6e3), ax.fy(-135));
    ctx.fillText('noise floor', ax.fx(1.5e6), ax.fy(-150));
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

  // Costas loop S-curve: error = sin(2·Δφ)
  T.costasScurve = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const box = plotBox(w, h);
    const ax = drawAxes(ctx, box, { xr: [-180, 180], yr: [-1.2, 1.2], xlabel: 'phase error Δφ (degrees)', ylabel: 'loop error  I·Q' });
    const pts = []; for (let d = -180; d <= 180; d += 1) pts.push([d, Math.sin(2 * d * Math.PI / 180)]);
    line(ctx, ax, pts, C.blue, 2.5);
    const y0 = ax.fy(0); ctx.strokeStyle = C.grid; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.x, y0); ctx.lineTo(ax.x + ax.w, y0); ctx.stroke(); ctx.setLineDash([]);
    // stable lock points at 0 and 180 (zero crossing, negative slope)
    [0, 180, -180].forEach(d => { ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(ax.fx(d), ax.fy(0), 4, 0, TAU); ctx.fill(); });
    ctx.fillStyle = C.teal; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('stable lock', ax.fx(0), ax.fy(0) + 18); ctx.fillText('180° ambiguity', ax.fx(180), ax.fy(0) - 12);
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

  // Frequency hopping time-frequency pattern
  T.hopping = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const box = plotBox(w, h), Nhop = 24, Nch = 10;
    const ax = drawAxes(ctx, box, { xr: [0, Nhop], yr: [0, Nch], xlabel: 'time (hop slots)', ylabel: 'channel' });
    // deterministic pseudo pattern (no RNG so it is stable): LCG
    let x = 7;
    for (let t = 0; t < Nhop; t++) { x = (x * 5 + 3) % Nch; const jam = (x === 4); ctx.fillStyle = jam ? C.red : C.blue; ctx.fillRect(ax.fx(t) + 1, ax.fy(x + 0.9), (ax.fx(1) - ax.fx(0)) - 2, ax.fy(0) - ax.fy(0.9)); }
    // jammed channel band
    ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = C.red; ctx.fillRect(ax.x, ax.fy(5), ax.w, ax.fy(4) - ax.fy(5)); ctx.restore();
    ctx.fillStyle = C.red; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('jammed channel — only brief dwells hit', ax.x + 8, ax.fy(5) - 4);
  };

  // m-sequence autocorrelation (LFSR)
  T.autocorr = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const n = 5, L = (1 << n) - 1; // length 31, taps x^5+x^2+1
    let reg = 1, seq = [];
    for (let i = 0; i < L; i++) { const b = reg & 1; seq.push(b ? 1 : -1); const fb = ((reg) ^ (reg >> 3)) & 1; reg = (reg >> 1) | (fb << (n - 1)); }
    const R = []; for (let s = 0; s < L; s++) { let acc = 0; for (let i = 0; i < L; i++) acc += seq[i] * seq[(i + s) % L]; R.push([s, acc]); }
    const box = plotBox(w, h);
    const ax = drawAxes(ctx, box, { xr: [0, L], yr: [-5, L + 3], xlabel: 'shift', ylabel: 'autocorrelation' });
    R.forEach(p => { ctx.strokeStyle = C.blue; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax.fx(p[0]), ax.fy(0)); ctx.lineTo(ax.fx(p[0]), ax.fy(p[1])); ctx.stroke(); });
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('two-valued: peak = ' + L + ' at zero shift, −1 elsewhere', ax.x + 10, ax.y + 14);
  };

  // Gold code cross-correlation (three-valued)
  T.crosscorr = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const n = 5, L = (1 << n) - 1;
    function mseq(taps, seed) { let reg = seed, s = []; for (let i = 0; i < L; i++) { s.push(reg & 1); let fb = 0; taps.forEach(t => fb ^= (reg >> (t - 1)) & 1); reg = ((reg >> 1) | (fb << (n - 1))) & L; } return s; }
    const a = mseq([5, 3], 1), b = mseq([5, 4, 3, 2], 1);
    const g1 = a.map((v, i) => v ^ b[i]).map(v => v ? 1 : -1);
    const g2 = a.map((v, i) => v ^ b[(i + 5) % L]).map(v => v ? 1 : -1);
    const R = []; for (let s = 0; s < L; s++) { let acc = 0; for (let i = 0; i < L; i++) acc += g1[i] * g2[(i + s) % L]; R.push([s, acc]); }
    const box = plotBox(w, h);
    const ax = drawAxes(ctx, box, { xr: [0, L], yr: [-Math.max(12, ...R.map(r => Math.abs(r[1]))) - 2, Math.max(12, ...R.map(r => Math.abs(r[1]))) + 2], xlabel: 'shift', ylabel: 'cross-correlation' });
    const y0 = ax.fy(0); ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(ax.x, y0); ctx.lineTo(ax.x + ax.w, y0); ctx.stroke();
    R.forEach(p => { ctx.strokeStyle = C.purple; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax.fx(p[0]), y0); ctx.lineTo(ax.fx(p[0]), ax.fy(p[1])); ctx.stroke(); });
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('bounded to 3 values {−1, −t(n), t(n)−2}, t(5)=9 — low mutual interference', ax.x + 8, ax.y + 14);
  };

  // Viterbi trellis with a survivor path
  T.trellis = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const stages = 6, states = 4, mL = 60, mT = 30;
    const gx = i => mL + i * (w - mL - 30) / (stages - 1);
    const gy = s => mT + s * (h - mT - 50) / (states - 1);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (let i = 0; i < stages - 1; i++) for (let s = 0; s < states; s++) {
      [(s >> 1), ((s >> 1) | 2)].forEach(ns => { if (ns < states) { ctx.beginPath(); ctx.moveTo(gx(i), gy(s)); ctx.lineTo(gx(i + 1), gy(ns)); ctx.stroke(); } });
    }
    // survivor path (illustrative)
    const path = [0, 2, 1, 0, 2, 1];
    ctx.strokeStyle = C.teal; ctx.lineWidth = 3; ctx.beginPath();
    path.forEach((s, i) => { const X = gx(i), Y = gy(s); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
    for (let i = 0; i < stages; i++) for (let s = 0; s < states; s++) { ctx.fillStyle = (path[i] === s) ? C.teal : C.blue; ctx.beginPath(); ctx.arc(gx(i), gy(s), 5, 0, TAU); ctx.fill(); }
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ['00', '01', '10', '11'].forEach((lbl, s) => ctx.fillText(lbl, 8, gy(s) + 4));
    ctx.fillStyle = C.teal; ctx.textAlign = 'center'; ctx.fillText('surviving maximum-likelihood path (add–compare–select)', w / 2, h - 16);
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

  // DAC sinc envelope + images
  T.sincImages = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const box = plotBox(w, h);
    const ax = drawAxes(ctx, box, { xr: [0, 3], yr: [-30, 3], xlabel: 'frequency / fs', ylabel: 'response (dB)', xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3] });
    const sinc = x => x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
    const env = []; for (let f = 0; f <= 3; f += 0.01) env.push([f, dB(Math.pow(Math.abs(sinc(f)), 2) + 1e-4)]);
    line(ctx, ax, env, C.dim, 1.5);
    // baseband + image lobes (triangles centered at 0, fs, 2fs within |sinc|)
    [0, 1, 2, 3].forEach(c => {
      const pts = []; for (let f = c - 0.4; f <= c + 0.4; f += 0.01) { if (f < 0 || f > 3) continue; const shape = Math.max(0, 1 - Math.abs(f - c) / 0.4); pts.push([f, dB(shape * shape * Math.pow(Math.abs(sinc(f)), 2) + 1e-4)]); }
      line(ctx, ax, pts, c === 0 ? C.teal : C.red, 2.2);
    });
    ctx.fillStyle = C.teal; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('wanted', ax.fx(0.1), ax.fy(-2));
    ctx.fillStyle = C.red; ctx.fillText('images (removed by reconstruction filter)', ax.fx(1.1), ax.fy(-2));
    ctx.fillStyle = C.dim; ctx.fillText('sinc envelope', ax.fx(1.9), ax.fy(dB(Math.pow(sinc(1.9), 2)) + 3));
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

  // Link budget waterfall
  T.linkWaterfall = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 320);
    const steps = [
      { l: 'Tx power', v: 20, add: true }, { l: 'Tx antenna', v: 6, add: true },
      { l: 'path loss', v: -100, add: false }, { l: 'misc loss', v: -3, add: false }, { l: 'Rx antenna', v: 6, add: true }
    ];
    const box = plotBox(w, h);
    let cum = 0; const levels = [cum]; steps.forEach(s => { cum += s.v; levels.push(cum); });
    const prx = cum, sens = -95;
    const ax = drawAxes(ctx, box, { xr: [0, steps.length + 1], yr: [-110, 40], xlabel: '', ylabel: 'power (dBm)', xticks: [] });
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i], y1 = ax.fy(levels[i]), y2 = ax.fy(levels[i + 1]);
      ctx.fillStyle = s.add ? 'rgba(99,230,190,0.6)' : 'rgba(255,107,107,0.6)';
      const bx = ax.fx(i + 0.5) - 22; ctx.fillRect(bx, Math.min(y1, y2), 44, Math.abs(y2 - y1));
      ctx.fillStyle = C.dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.save(); ctx.translate(ax.fx(i + 0.5), ax.y + ax.h + 10); ctx.fillText(s.l, 0, 0); ctx.restore();
    }
    // Prx and sensitivity lines
    ctx.strokeStyle = C.blue; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(prx)); ctx.lineTo(ax.x + ax.w, ax.fy(prx)); ctx.stroke();
    ctx.strokeStyle = C.orange; ctx.beginPath(); ctx.moveTo(ax.x, ax.fy(sens)); ctx.lineTo(ax.x + ax.w, ax.fy(sens)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.blue; ctx.textAlign = 'left'; ctx.font = '11px sans-serif'; ctx.fillText('Prx = ' + prx + ' dBm', ax.x + 6, ax.fy(prx) - 6);
    ctx.fillStyle = C.orange; ctx.fillText('sensitivity = ' + sens + ' dBm', ax.x + 6, ax.fy(sens) + 12);
    ctx.fillStyle = C.text; ctx.fillText('margin = ' + (prx - sens) + ' dB', ax.x + ax.w - 110, ax.fy((prx + sens) / 2));
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

  // Antenna gain vs frequency for several apertures
  T.gainFreq = function (host, spec) {
    const { ctx, w, h } = makeCard(host, spec, 520, 300);
    const box = plotBox(w, h), eta = 0.55, cc = 3e8;
    const ds = [{ d: 0.3, c: C.teal, l: '0.3 m' }, { d: 1, c: C.blue, l: '1 m' }, { d: 3, c: C.orange, l: '3 m' }];
    const ax = drawAxes(ctx, box, { xr: [1e8, 4e10], yr: [0, 60], logx: true, xlabel: 'frequency', ylabel: 'gain (dBi)', xtickfmt: t => t >= 1e9 ? (t / 1e9) + 'G' : (t / 1e6) + 'M' });
    ds.forEach(o => { const A = Math.PI * (o.d / 2) ** 2, pts = []; for (let e = 8; e <= 10.6; e += 0.05) { const f = Math.pow(10, e), lam = cc / f; pts.push([f, dB(eta * 4 * Math.PI * A / (lam * lam))]); } line(ctx, ax, pts, o.c, 2.2); });
    legend(ctx, box, ds.map(o => ({ label: o.l, color: o.c })));
    ctx.fillStyle = C.dim; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('G = η·4πA/λ²  →  +6 dB per octave of frequency', ax.x + 8, ax.y + 12);
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

  /* ---- topic → figure specs map ---- */
  const map = {
    'comm-basics': [{ type: 'capacity', title: 'Shannon capacity vs SNR', caption: 'Capacity rises only logarithmically with SNR — each 3 dB buys ~1 bit/s/Hz.' }],
    'noise': [{ type: 'gaussianNoise', title: 'AWGN: samples vs Gaussian pdf', caption: 'Thermal noise is Gaussian. Drag σ to change noise power (kTB).' }],
    'psd': [{ type: 'psd', title: 'Power spectral density (periodogram)', caption: 'A carrier sitting above a flat white-noise floor. Change SNR to see it emerge.' }],
    'noise-floor': [{ type: 'noiseFloorBw', title: 'Noise floor vs bandwidth', caption: 'Floor = −174 + 10·log₁₀(B) + NF. Wider bandwidth = higher floor.' }],
    'noise-figure': [{ type: 'friisNF', title: 'Friis: why the first stage dominates', caption: 'With enough LNA gain, total NF collapses to the LNA’s own NF.' }],
    'phase-noise': [{ type: 'phaseNoise', title: 'Phase-noise skirt (Leeson)', caption: 'ℒ(f) falls in characteristic −30 / −20 dB/decade slopes down to a floor.' }],
    'bpsk': [
      { type: 'constellation', order: 2, snr: 12, title: 'BPSK constellation with noise', caption: 'Two antipodal points. Lower the SNR until the noise clouds cross zero → errors.' },
      { type: 'berCurve', series: [{ name: 'bpsk' }], title: 'BPSK BER vs Eb/N0', caption: 'The benchmark curve Pb = Q(√(2Eb/N0)). Drag to read any operating point.' }
    ],
    'dbpsk': [{ type: 'berCurve', series: [{ name: 'coh8' }, { name: 'dbpsk' }], title: 'DBPSK vs coherent BPSK', caption: 'Differential detection costs about 1 dB — the gap between the curves.' }],
    'matched-filter': [{ type: 'matchedFilter', title: 'Matched filter output', caption: 'The correlator squeezes a noisy input into a clean peak at t=T. Lower SNR to see it work.' }],
    'evm': [{ type: 'constellation', order: 16, snr: 22, title: '16-QAM constellation & EVM', caption: 'EVM is the RMS spread from ideal points. Note dense constellations need high SNR.' }],
    'pll': [{ type: 'pllStep', title: 'PLL phase-step response vs damping', caption: 'ζ≈0.707 settles fast with little overshoot; low ζ rings, high ζ crawls.' }],
    'fll': [{ type: 'fllPull', title: 'FLL frequency pull-in', caption: 'An FLL captures large offsets a PLL never could — ideal for acquisition.' }],
    'costas-loop': [{ type: 'costasScurve', title: 'Costas loop S-curve', caption: 'Error = I·Q ∝ sin(2Δφ): data-independent, with a stable lock every 180° (the ambiguity).' }],
    'dsss': [{ type: 'spread', title: 'Spreading lowers the PSD', caption: 'Same power spread over N× the band drops the PSD by the processing gain — below the floor.' }],
    'frequency-hopping': [{ type: 'hopping', title: 'Frequency-hop pattern', caption: 'The carrier hops pseudo-randomly; a fixed jammer only spoils the few dwells on its channel.' }],
    'pn-codes': [{ type: 'autocorr', title: 'm-sequence autocorrelation', caption: 'Sharp two-valued autocorrelation (peak L, −1 elsewhere) — perfect for timing/despreading.' }],
    'gold-code': [{ type: 'crosscorr', title: 'Gold-code cross-correlation', caption: 'Bounded to three small values, so many users (satellites) share a band with low interference.' }],
    'fec': [{ type: 'berCurve', series: [{ name: 'bpsk' }, { name: 'coded' }], title: 'Coding gain', caption: 'FEC shifts the BER curve left — the horizontal gap is the coding gain (dB).' }],
    'viterbi': [{ type: 'trellis', title: 'Viterbi trellis & survivor path', caption: 'Add–compare–select keeps one survivor per state; the green path is the ML sequence.' }],
    'adc': [{ type: 'quantize', title: 'Quantization & SNR', caption: 'Each added bit is ~6 dB more SNR (6.02N+1.76). Watch the staircase refine.' }],
    'dac': [{ type: 'sincImages', title: 'DAC sinc roll-off & images', caption: 'Zero-order hold imposes a sinc envelope and images at every multiple of fs.' }],
    'rssi': [{ type: 'pathLoss', title: 'Received power vs distance', caption: 'RSSI tracks path loss; the exponent n controls how fast it falls in real environments.' }],
    'path-loss': [{ type: 'pathLoss', title: 'Path loss vs distance & frequency', caption: 'Free space: +6 dB per octave of distance AND of frequency. Drag n for cluttered channels.' }],
    'link-budget': [{ type: 'linkWaterfall', title: 'Link-budget waterfall', caption: 'Gains add, losses subtract; the gap between received power and sensitivity is your margin.' }],
    'antenna': [{ type: 'polarPattern', N: 4, title: 'Radiation pattern (steerable)', caption: 'More elements → narrower main beam and more side lobes. Try steering the beam.' }],
    'antenna-gain': [{ type: 'gainFreq', title: 'Aperture gain vs frequency', caption: 'G = η·4πA/λ²: bigger dish or higher frequency = more gain (+6 dB/octave).' }],
    'antenna-beamwidth': [{ type: 'polarPattern', N: 8, title: 'Beamwidth vs array size', caption: 'HPBW narrows as elements/aperture grow; note the side lobes and steering trade-offs.' }],
    'maxwell': [{ type: 'emWave', title: 'Propagating EM plane wave', caption: 'Self-sustaining orthogonal E and B fields travel at c = 1/√(μ₀ε₀).' }]
  };

  /* ---- registry / render ---- */
  function render(host, spec) {
    const fn = T[spec.type];
    if (!fn) { host.appendChild(el('div', 'fig-caption', 'Figure "' + spec.type + '" not available.')); return; }
    try { fn(host, spec); } catch (e) { host.appendChild(el('div', 'fig-caption', 'Figure error: ' + e.message)); }
  }

  return { render, T, C, map, _util: { Q, gauss, dB, lin } };
})();
