// Filter Design: the full analog + digital design flow.
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'filter-design',
    title: 'Filter Design',
    category: 'Filters',
    tags: ['approximation', 'Butterworth', 'Chebyshev', 'elliptic', 'prototype', 'bilinear-transform'],
    summary: String.raw`Filter design is the disciplined flow from a specification — passband ripple, stopband attenuation, and band edges — to a realizable circuit or algorithm: choose an approximation, estimate the order, start from a normalized low-pass prototype, apply a frequency transformation and scaling, and finally realize it as an LC ladder, active stage, or digital difference equation.`,
    diagram: [
    {
      title: String.raw`The design flow (spec to realization)`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-filter-design" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Specification-driven design flow</text>
        <rect x="14" y="40" width="96" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="62" y="60" fill="#e6edf3" text-anchor="middle">spec</text><text x="62" y="76" fill="#9aa7b5" font-size="9" text-anchor="middle">Ap,As,wp,ws</text>
        <rect x="132" y="40" width="112" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="188" y="60" fill="#e6edf3" text-anchor="middle">approximation</text><text x="188" y="76" fill="#9aa7b5" font-size="9" text-anchor="middle">Butter/Cheby/ell</text>
        <rect x="266" y="40" width="88" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="310" y="60" fill="#e6edf3" text-anchor="middle">order n</text><text x="310" y="76" fill="#9aa7b5" font-size="9" text-anchor="middle">from spec</text>
        <rect x="376" y="40" width="150" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="451" y="60" fill="#e6edf3" text-anchor="middle">LP prototype</text><text x="451" y="76" fill="#9aa7b5" font-size="9" text-anchor="middle">normalized wc=1</text>
        <line x1="110" y1="62" x2="132" y2="62" stroke="#9aa7b5" marker-end="url(#arr-filter-design)"/>
        <line x1="244" y1="62" x2="266" y2="62" stroke="#9aa7b5" marker-end="url(#arr-filter-design)"/>
        <line x1="354" y1="62" x2="376" y2="62" stroke="#9aa7b5" marker-end="url(#arr-filter-design)"/>
        <rect x="132" y="130" width="150" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="207" y="150" fill="#e6edf3" text-anchor="middle">transform + scale</text><text x="207" y="166" fill="#9aa7b5" font-size="9" text-anchor="middle">LP-HP/BP/BS, w0,R</text>
        <rect x="306" y="130" width="150" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="381" y="150" fill="#e6edf3" text-anchor="middle">realize</text><text x="381" y="166" fill="#9aa7b5" font-size="9" text-anchor="middle">LC/Sallen-Key/SAW</text>
        <line x1="451" y1="84" x2="451" y2="108" stroke="#9aa7b5"/><line x1="451" y1="108" x2="207" y2="108" stroke="#9aa7b5"/><line x1="207" y1="108" x2="207" y2="130" stroke="#9aa7b5" marker-end="url(#arr-filter-design)"/>
        <line x1="282" y1="152" x2="306" y2="152" stroke="#9aa7b5" marker-end="url(#arr-filter-design)"/>
      </svg>`,
      caption: String.raw`The canonical flow: a spec (Ap, As, wp, ws) selects an approximation family, which fixes the order n; a normalized low-pass prototype (wc=1) is then frequency-transformed and scaled to the target band, and finally realized as hardware or a difference equation.`
    },
    {
      title: String.raw`Order grows with tighter requirements`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-filter-design" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Steeper transition or more attenuation raises n</text>
        <line x1="60" y1="160" x2="500" y2="160" stroke="#9aa7b5" marker-end="url(#arr2-filter-design)"/>
        <line x1="60" y1="160" x2="60" y2="40" stroke="#9aa7b5" marker-end="url(#arr2-filter-design)"/>
        <text x="500" y="178" fill="#9aa7b5" font-size="10">freq</text>
        <text x="30" y="46" fill="#9aa7b5" font-size="10">|H|</text>
        <path d="M60,60 L180,60 Q250,60 300,140 L500,150" fill="none" stroke="#4dabf7" stroke-width="2"/>
        <path d="M60,60 L200,60 Q235,60 250,150 L500,155" fill="none" stroke="#ffa94d" stroke-width="2"/>
        <rect x="180" y="55" width="40" height="10" fill="none" stroke="#9aa7b5" stroke-dasharray="3 3"/>
        <text x="150" y="52" fill="#4dabf7" font-size="10">low n (gentle)</text>
        <text x="300" y="120" fill="#ffa94d" font-size="10">high n (steep)</text>
        <line x1="200" y1="60" x2="200" y2="160" stroke="#b197fc" stroke-dasharray="3 3"/>
        <text x="205" y="150" fill="#b197fc" font-size="9">wp</text>
        <line x1="300" y1="40" x2="300" y2="160" stroke="#63e6be" stroke-dasharray="3 3"/>
        <text x="305" y="55" fill="#63e6be" font-size="9">ws</text>
        <text x="230" y="185" fill="#9aa7b5" font-size="9" text-anchor="middle">narrower transition ws/wp -> larger n</text>
      </svg>`,
      caption: String.raw`Order n is driven by two demands: a narrower transition band (ws/wp closer to 1) and a deeper stopband (larger As) both force a higher order. A gentle curve needs few poles; a brick-wall response needs many.`
    },
    {
      title: String.raw`Approximation trade-off map`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-filter-design" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Which approximation? Flatness vs steepness vs phase</text>
        <rect x="20" y="40" width="120" height="70" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="80" y="64" fill="#e6edf3" text-anchor="middle">Butterworth</text><text x="80" y="82" fill="#9aa7b5" font-size="9" text-anchor="middle">maximally flat</text><text x="80" y="98" fill="#9aa7b5" font-size="9" text-anchor="middle">no ripple, gentle</text>
        <rect x="150" y="40" width="120" height="70" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="210" y="64" fill="#e6edf3" text-anchor="middle">Chebyshev</text><text x="210" y="82" fill="#9aa7b5" font-size="9" text-anchor="middle">steeper, ripple</text><text x="210" y="98" fill="#9aa7b5" font-size="9" text-anchor="middle">in one band</text>
        <rect x="280" y="40" width="120" height="70" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="340" y="64" fill="#e6edf3" text-anchor="middle">Elliptic</text><text x="340" y="82" fill="#9aa7b5" font-size="9" text-anchor="middle">steepest, ripple</text><text x="340" y="98" fill="#9aa7b5" font-size="9" text-anchor="middle">both bands</text>
        <rect x="410" y="40" width="118" height="70" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="469" y="64" fill="#e6edf3" text-anchor="middle">Bessel</text><text x="469" y="82" fill="#9aa7b5" font-size="9" text-anchor="middle">linear phase</text><text x="469" y="98" fill="#9aa7b5" font-size="9" text-anchor="middle">gentlest roll-off</text>
        <line x1="60" y1="130" x2="490" y2="130" stroke="#9aa7b5" marker-end="url(#arr3-filter-design)"/>
        <text x="70" y="150" fill="#4dabf7" font-size="10">flatter / lower order</text>
        <text x="360" y="150" fill="#ffa94d" font-size="10">steeper / more selective</text>
        <text x="270" y="185" fill="#9aa7b5" font-size="10" text-anchor="middle">Elliptic gives the lowest order for a brick wall; Bessel gives the best phase but poorest selectivity.</text>
      </svg>`,
      caption: String.raw`The four classic approximations trade off flatness, selectivity, and phase: Butterworth is maximally flat, Chebyshev is steeper at the cost of ripple in one band, elliptic (Cauer) is steepest with ripple in both bands, and Bessel sacrifices selectivity for linear phase.`
    }
    ],
    prerequisites: ['filters', 'frequency-spectrum'],
    intro: String.raw`<p><b>Why does filter design need a method at all?</b> Because "let through what I want and block the rest" is not a circuit — it is a wish. A real filter cannot have an infinitely sharp edge, zero ripple, and linear phase all at once; every one of those is bought at the price of the others and of hardware cost. Filter design exists to turn a set of numbers you can measure — how much ripple you tolerate in the passband, how much rejection you demand in the stopband, and where the two bands sit in frequency — into the <i>smallest</i> circuit or algorithm that meets them. Without this flow you would size components by trial and error and never know whether a cheaper solution existed.</p>
<p>The discipline is a short, repeatable pipeline. You <b>specify</b> passband ripple $A_p$, stopband attenuation $A_s$, and the passband/stopband edges $\omega_p,\omega_s$. You <b>choose an approximation</b> (Butterworth, Chebyshev, elliptic, Bessel) that best trades flatness against steepness against phase. You <b>estimate the order</b> $n$ — the number of poles — directly from the spec. You start from a <b>normalized low-pass prototype</b> (cutoff $\omega_c=1$, $1\,\Omega$ reference), apply a <b>frequency transformation</b> (LP to LP/HP/BP/BS) and impedance/frequency <b>scaling</b>, and finally <b>realize</b> it as an LC ladder, a Sallen-Key active stage, a SAW device, or — in the digital world — a difference equation via windowing, Parks-McClellan, or the bilinear transform.</p>`,
    sections: [
      {
        h: 'The specification: what you must pin down first',
        html: String.raw`<p>Every design begins with four numbers that fence off the allowed magnitude response into a <b>tolerance mask</b>:</p>
        <ul>
          <li><b>Passband ripple $A_p$</b> (dB): the maximum allowed deviation of $|H|$ inside the passband, e.g. $A_p=0.5$ dB.</li>
          <li><b>Stopband attenuation $A_s$</b> (dB): the minimum rejection required in the stopband, e.g. $A_s=40$ dB.</li>
          <li><b>Passband edge $\omega_p$</b>: the highest frequency that must still be passed within $A_p$.</li>
          <li><b>Stopband edge $\omega_s$</b>: the lowest frequency that must already be attenuated by $A_s$.</li>
        </ul>
        <p>The gap between $\omega_p$ and $\omega_s$ is the <b>transition band</b>; the response is unconstrained there. The ratio $\omega_s/\omega_p$ (the <b>selectivity factor</b>) and the two dB numbers are exactly what fix the required order.</p>
        <div class="callout tip"><b>Key intuition:</b> the spec is a box the response must thread — stay above the passband floor, drop below the stopband ceiling. A tighter box (smaller transition, deeper stopband) always costs more poles, regardless of which approximation you pick.</div>`
      },
      {
        h: 'Choosing an approximation family',
        html: String.raw`<p>No rational transfer function is an ideal brick wall, so we choose a polynomial family that approximates it with a known trade-off:</p>
        <ul>
          <li><b>Butterworth</b> — <i>maximally flat</i> magnitude, monotonic in both bands, no ripple. Gentlest roll-off, so it needs the highest order for a given selectivity. The default when flatness matters.</li>
          <li><b>Chebyshev Type I</b> — equiripple in the <i>passband</i>, monotonic stopband. Steeper transition than Butterworth for the same order, paid for with passband ripple.</li>
          <li><b>Chebyshev Type II (inverse)</b> — flat passband, equiripple <i>stopband</i>. Good when passband flatness is sacred but you can tolerate stopband ripple.</li>
          <li><b>Elliptic (Cauer)</b> — equiripple in <i>both</i> bands. The steepest transition for a given order (lowest order for a given mask), at the cost of ripple everywhere and poor phase.</li>
          <li><b>Bessel/Thomson</b> — <i>maximally flat group delay</i> (near-linear phase), so it preserves pulse shape. The gentlest roll-off of all — chosen for time-domain fidelity, not selectivity.</li>
        </ul>
        <p>The one-line rule: <b>flatness (Butterworth) → passband ripple buys steepness (Chebyshev) → ripple in both bands buys the steepest edge (elliptic); if phase/pulse shape dominates, pick Bessel.</b></p>
        <div class="callout tip"><b>Design tip:</b> if you only remember one thing, remember that elliptic gives the lowest order for a hard magnitude mask, and Bessel gives the best phase but the worst selectivity — the other families sit between them.</div>`
      },
      {
        h: 'Estimating the order n',
        html: String.raw`<p>The <b>order</b> $n$ — the number of poles — is the single most consequential design number: it sets component count, cost, sensitivity, and roll-off rate ($-20n$ dB/decade asymptotically). It is computed <i>from the spec</i> before any component is chosen. For a <b>Butterworth</b> low-pass,</p>
        <p>$$n \ge \frac{\log\!\big[(10^{0.1A_s}-1)/(10^{0.1A_p}-1)\big]}{2\,\log(\omega_s/\omega_p)},$$</p>
        <p>then round up to the next integer. The numerator measures how much extra attenuation the stopband needs beyond the passband edge; the denominator measures how much room the transition band gives you. A wider transition (larger $\omega_s/\omega_p$) shrinks $n$; a deeper stopband grows it.</p>
        <p>For a <b>Chebyshev</b> filter the same numerator is divided by $2\,\cosh^{-1}(\omega_s/\omega_p)$ instead of $2\log(\omega_s/\omega_p)$; because $\cosh^{-1}$ grows faster than $\log$, Chebyshev meets the same mask with a <i>lower</i> order. Elliptic order estimates use complete elliptic integrals and are lower still.</p>
        <div class="callout tip"><b>Sanity check:</b> if your computed $n$ is huge, either loosen the transition band, accept ripple (switch families), or split the job across stages — never just crank $n$ blindly, since sensitivity and loss climb with order.</div>`
      },
      {
        h: 'The normalized low-pass prototype',
        html: String.raw`<p>Rather than redesign from scratch for every cutoff and impedance, filter design works from a <b>normalized low-pass prototype</b>: a low-pass filter with cutoff $\omega_c=1$ rad/s and a $1\,\Omega$ reference resistance. Its element values (the famous $g_k$ coefficients) are tabulated per family and order. For an $n$th-order Butterworth prototype the $g_k$ follow a closed form:</p>
        <p>$$g_k = 2\sin\!\Big(\frac{(2k-1)\pi}{2n}\Big),\qquad k=1,\dots,n.$$</p>
        <p>These $g_k$ alternate as series inductors and shunt capacitors in an LC ladder (a <b>ladder prototype</b>), or become the pole locations of an active realization. The whole point of normalization is reuse: <i>one</i> prototype table serves every cutoff frequency and every impedance level, because the next two steps — frequency transformation and scaling — map the prototype onto the real target.</p>
        <div class="callout tip"><b>Why normalize?</b> It decouples the <i>shape</i> of the response (set by family and order) from its <i>placement</i> (set by cutoff and impedance). Design the shape once, then slide and stretch it to fit.</div>`
      },
      {
        h: 'Frequency transformation and scaling',
        html: String.raw`<p>Two operations map the normalized low-pass prototype onto the real filter.</p>
        <p><b>1. Frequency transformation</b> converts the low-pass shape into low-pass, high-pass, band-pass, or band-stop, using a substitution on the complex frequency $s$:</p>
        <ul>
          <li>LP to LP: $s \to s/\omega_c$ (just rescale cutoff).</li>
          <li>LP to HP: $s \to \omega_c/s$ (reflect the band).</li>
          <li>LP to BP: $s \to \dfrac{s^2+\omega_0^2}{s\,B}$, centre $\omega_0=\sqrt{\omega_1\omega_2}$, bandwidth $B=\omega_2-\omega_1$ (doubles the order).</li>
          <li>LP to BS: $s \to \dfrac{s\,B}{s^2+\omega_0^2}$ (band-reject; also doubles the order).</li>
        </ul>
        <p><b>2. Impedance and frequency scaling</b> moves the prototype from $\omega_c=1$, $1\,\Omega$ to the real cutoff $\omega_c$ and reference $R$. Scaling factors $k_f=\omega_c$ (frequency) and $k_m=R$ (magnitude) transform each element:</p>
        <p>$$L_{\text{real}} = \frac{k_m}{k_f}\,L_{\text{proto}},\qquad C_{\text{real}} = \frac{1}{k_m k_f}\,C_{\text{proto}}.$$</p>
        <div class="callout tip"><b>Order note:</b> LP-to-BP and LP-to-BS <i>double</i> the number of reactive elements — an $n$th-order prototype becomes a $2n$th-order band filter. Budget for this when you estimate cost.</div>`
      },
      {
        h: 'Realization: LC, active, SAW, crystal',
        html: String.raw`<p>The final step turns the scaled transfer function into hardware (or code):</p>
        <ul>
          <li><b>LC ladder</b> (passive): series/shunt L and C from the $g_k$ table. Low loss at RF, no power, but bulky inductors and load-sensitive.</li>
          <li><b>Active (Sallen-Key, MFB, biquad cascade):</b> op-amps + RC realize each conjugate pole pair as a second-order section. No inductors, easy tuning — ideal below a few MHz.</li>
          <li><b>SAW / BAW:</b> surface/bulk acoustic-wave devices give very steep, small RF band-pass filters (handset front-ends), exploiting mechanical resonance.</li>
          <li><b>Crystal / ceramic:</b> extremely high-Q resonators for very narrow band-pass (IF filters, oscillators).</li>
        </ul>
        <p><b>Digital realization</b> is a parallel world. <b>FIR</b> filters are designed by <i>windowing</i> the ideal impulse response or by the optimal equiripple <b>Parks-McClellan</b> (Remez) algorithm; they give exactly linear phase and unconditional stability but need many taps. <b>IIR</b> filters are usually obtained by mapping an analog prototype with the <b>bilinear transform</b> $s=\tfrac{2}{T}\tfrac{z-1}{z+1}$, using <b>pre-warping</b> to place critical frequencies correctly; they meet a mask with far fewer coefficients but have nonlinear phase and can go unstable.</p>
        <div class="callout tip"><b>Trade-off summary:</b> analog LC for RF power handling, active for cheap low-frequency, SAW/crystal for narrow steep RF; FIR for linear phase, IIR for efficiency. The choice is driven by frequency, phase requirement, and cost.</div>`
      },
      {
        h: 'Digital design: windowing, Remez, and the bilinear transform',
        html: String.raw`<p>The digital branch deserves its own detail because two of its tools — the bilinear transform and pre-warping — are exam staples.</p>
        <p><b>FIR by windowing:</b> take the ideal (infinite, non-causal) impulse response $h_d[n]=\operatorname{sinc}$, truncate it with a window (Hamming, Kaiser, Blackman) to control the transition-band width and sidelobe (stopband) level, and delay to make it causal. Result: exactly linear phase.</p>
        <p><b>FIR by Parks-McClellan:</b> the Remez exchange algorithm finds the <i>equiripple</i> (minimax-optimal) FIR for a given tap count — the FIR analogue of the elliptic filter. A useful rule of thumb for the tap count is $N \approx \dfrac{3.3}{\Delta f/f_s}$ for a Hamming-class design, where $\Delta f$ is the transition width.</p>
        <p><b>IIR by bilinear transform:</b> map a good analog prototype $H(s)$ to $H(z)$ via $s=\tfrac{2}{T}\tfrac{z-1}{z+1}$. This maps the entire $j\omega$ axis onto the unit circle (no aliasing), but it <i>warps</i> the frequency axis nonlinearly: $\omega_{\text{analog}}=\tfrac{2}{T}\tan(\omega_{\text{digital}}/2)$. To land a cutoff exactly, you <b>pre-warp</b> the analog design frequency to $\omega_a=\tfrac{2}{T}\tan(\omega_d/2)$ before designing, so the warp maps it back to the desired $\omega_d$.</p>
        <div class="callout tip"><b>Pre-warp reminder:</b> without pre-warping, every critical frequency lands low (compressed near $\pi$). Pre-warp only fixes discrete critical frequencies exactly; the rest of the response is still warped, which is usually acceptable.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The flow:</b> spec ($A_p,A_s,\omega_p,\omega_s$) → approximation → order $n$ → normalized LP prototype → frequency transform + impedance/frequency scaling → realization; each stage decouples one design decision from the next.</li>
<li><b>The four approximations:</b> Butterworth (maximally flat), Chebyshev (steeper, ripple in one band), elliptic (steepest, ripple in both), Bessel (best phase, gentlest roll-off), and why order falls as you tolerate more ripple.</li>
<li><b>Order estimation:</b> the Butterworth formula $n\ge\log[(10^{0.1A_s}-1)/(10^{0.1A_p}-1)]/(2\log(\omega_s/\omega_p))$, and that a narrower transition or deeper stopband raises $n$, while Chebyshev/elliptic meet the same mask at lower order.</li>
<li><b>Transformation and scaling:</b> the $s$-substitutions LP-LP/HP/BP/BS (BP and BS double the order) and the element scaling $L=(k_m/k_f)L_p$, $C=C_p/(k_m k_f)$.</li>
<li><b>Digital design:</b> FIR by windowing / Parks-McClellan (linear phase, many taps) versus IIR by the bilinear transform $s=\tfrac{2}{T}\tfrac{z-1}{z+1}$ with pre-warping (few coefficients, nonlinear phase), and the flatness-vs-steepness-vs-phase-vs-cost trade running through it all.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Filter_design" target="_blank" rel="noopener">Wikipedia — Filter design</a> — a solid canonical overview of the spec-to-realization flow, approximation families, and both analog and digital methods with links out to each subtopic.</li>
<li><a href="https://www.dspguide.com/ch20.htm" target="_blank" rel="noopener">The Scientist and Engineer's Guide to DSP, Ch. 20 — Chebyshev Filters</a> — Steven Smith's free textbook chapter deriving recursive (IIR) Chebyshev design from analog prototypes, with clear pole-placement and stability discussion.</li>
<li><a href="https://www.mathworks.com/help/signal/ug/iir-filter-design.html" target="_blank" rel="noopener">MathWorks — IIR Filter Design</a> — authoritative reference documentation comparing Butterworth, Chebyshev I/II, elliptic and Bessel, with order estimation and the bilinear transform shown in worked code.</li>
<li><a href="https://my.ece.utah.edu/~ece3500/Fall2014/notes/class19.html" target="_blank" rel="noopener">University of Utah ECE 3500 — Analog Filter Design</a> — university lecture notes walking through normalized low-pass prototypes, pole-zero placement, and the frequency transformations to HP/BP/BS.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`A filter spec is four numbers: passband ripple $A_p$, stopband attenuation $A_s$, and the band edges $\omega_p,\omega_s$; they define a tolerance mask.`,
      String.raw`The design flow is: spec → approximation → order $n$ → normalized LP prototype → frequency transform + scaling → realization.`,
      String.raw`Butterworth is maximally flat; Chebyshev is steeper with ripple in one band; elliptic is steepest with ripple in both; Bessel has the best (linear) phase.`,
      String.raw`Butterworth order: $n\ge\log[(10^{0.1A_s}-1)/(10^{0.1A_p}-1)]/(2\log(\omega_s/\omega_p))$; a tighter transition or deeper stopband raises $n$.`,
      String.raw`For the same mask, Chebyshev (uses $\cosh^{-1}$) needs a lower order than Butterworth, and elliptic needs the lowest of all.`,
      String.raw`A normalized LP prototype ($\omega_c=1$, $1\,\Omega$) is designed once, then frequency-transformed and scaled to the real cutoff and impedance.`,
      String.raw`Frequency transforms: LP-LP ($s\to s/\omega_c$), LP-HP ($s\to\omega_c/s$), LP-BP and LP-BS use quadratic substitutions and double the order.`,
      String.raw`Element scaling: $L_{real}=(k_m/k_f)L_p$ and $C_{real}=C_p/(k_m k_f)$ with $k_f=\omega_c$, $k_m=R$.`,
      String.raw`Realizations: LC ladder (RF, passive), Sallen-Key/biquad (active, low freq), SAW/BAW and crystal (narrow steep RF).`,
      String.raw`Digital: FIR via windowing or Parks-McClellan gives linear phase (many taps); IIR via bilinear transform with pre-warping is efficient but nonlinear-phase.`,
      String.raw`The bilinear transform $s=\tfrac{2}{T}\tfrac{z-1}{z+1}$ warps frequency by $\omega_a=\tfrac{2}{T}\tan(\omega_d/2)$; pre-warp fixes critical frequencies exactly.`
    ],
    equations: [
      {
        title: 'Butterworth order estimate',
        tex: String.raw`$$n \ge \frac{\log\!\big[(10^{0.1A_s}-1)/(10^{0.1A_p}-1)\big]}{2\,\log(\omega_s/\omega_p)}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A Butterworth low-pass has the magnitude-squared response $|H(j\omega)|^2 = 1/[1+(\omega/\omega_c)^{2n}]$. We want the smallest order $n$ that simultaneously satisfies the passband and stopband constraints of the mask.</p>
        <p><b>Step 1 — write attenuation in dB.</b> Attenuation is $A(\omega)=-10\log_{10}|H|^2 = 10\log_{10}\big[1+(\omega/\omega_c)^{2n}\big]$. At the passband edge $\omega_p$ we require $A(\omega_p)\le A_p$, and at the stopband edge $\omega_s$ we require $A(\omega_s)\ge A_s$.</p>
        <p><b>Step 2 — turn the two constraints into ratio conditions.</b> From $A_p = 10\log_{10}[1+(\omega_p/\omega_c)^{2n}]$ we get $(\omega_p/\omega_c)^{2n} = 10^{0.1A_p}-1$. Likewise $(\omega_s/\omega_c)^{2n} = 10^{0.1A_s}-1$.</p>
        <p><b>Step 3 — divide to cancel the unknown cutoff.</b> Dividing the stopband equation by the passband equation eliminates $\omega_c$:</p>
        $$\left(\frac{\omega_s}{\omega_p}\right)^{2n} = \frac{10^{0.1A_s}-1}{10^{0.1A_p}-1}.$$
        <p><b>Step 4 — solve for $n$ by taking logs.</b> Taking $\log_{10}$ of both sides and dividing:</p>
        $$2n\,\log\!\frac{\omega_s}{\omega_p} = \log\!\frac{10^{0.1A_s}-1}{10^{0.1A_p}-1}\ \Rightarrow\ n=\frac{\log[(10^{0.1A_s}-1)/(10^{0.1A_p}-1)]}{2\log(\omega_s/\omega_p)}.$$
        <p><b>Result.</b> Round the right-hand side <i>up</i> to the next integer, since $n$ must be a whole number and rounding up guarantees the mask is met (with margin). Sanity check: a deeper stopband (larger $A_s$) increases the numerator and hence $n$; a wider transition (larger $\omega_s/\omega_p$) increases the denominator and reduces $n$.</p>`
      },
      {
        title: 'Frequency scaling of the prototype (ω → ω/ωc)',
        tex: String.raw`$$L_{\text{real}}=\frac{k_m}{k_f}L_{\text{proto}},\qquad C_{\text{real}}=\frac{1}{k_m k_f}C_{\text{proto}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The normalized prototype is designed at cutoff $\omega_c=1$ rad/s and reference $1\,\Omega$. We must move it to a real cutoff $\omega_c$ and a real impedance level $R$ without changing the <i>shape</i> of the response. Define the frequency scale $k_f=\omega_c$ and the magnitude (impedance) scale $k_m=R$.</p>
        <p><b>Step 1 — frequency scaling by variable substitution.</b> Replacing $s\to s/k_f$ (equivalently $\omega\to\omega/\omega_c$) slides the normalized cutoff of 1 up to $\omega_c$. An inductor's impedance $sL$ must be invariant under this remap, so $s L_{proto} = (s/k_f)L'$ forces $L' = L_{proto}/k_f$. Similarly a capacitor's admittance $sC$ gives $C' = C_{proto}/k_f$.</p>
        <p><b>Step 2 — impedance (magnitude) scaling.</b> Multiplying every impedance in the network by $k_m$ leaves the voltage transfer function unchanged (it is a ratio of impedances). An inductor scales as $L\to k_m L$; a capacitor, being an admittance element, scales as $C\to C/k_m$.</p>
        <p><b>Step 3 — combine both scalings.</b> Applying frequency scaling then impedance scaling to the prototype elements:</p>
        $$L_{real}=\frac{k_m}{k_f}L_{proto},\qquad C_{real}=\frac{1}{k_m k_f}C_{proto}.$$
        <p><b>Result.</b> The dimensionless $g_k$ prototype values become physical henries and farads. Sanity check: raising the cutoff $k_f$ shrinks both $L$ and $C$ (faster circuit = smaller reactances), and raising the impedance $k_m$ grows $L$ but shrinks $C$, consistent with $\sqrt{L/C}$ setting the characteristic impedance. This single mapping is why one prototype table serves all cutoffs and impedances.</p>`
      },
      {
        title: 'Bilinear transform with pre-warping',
        tex: String.raw`$$s=\frac{2}{T}\frac{z-1}{z+1},\qquad \omega_a=\frac{2}{T}\tan\!\Big(\frac{\omega_d}{2}\Big)$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want to convert a stable analog design $H(s)$ into a digital $H(z)$ while mapping the whole imaginary axis $s=j\omega$ onto the unit circle $z=e^{j\omega_d}$ (so no aliasing occurs and stability is preserved). The bilinear transform is the algebraic map that does this.</p>
        <p><b>Step 1 — motivate the map from the integrator.</b> The trapezoidal (Tustin) approximation of integration replaces $1/s$ with $\tfrac{T}{2}\tfrac{z+1}{z-1}$. Inverting gives the substitution $s=\tfrac{2}{T}\tfrac{z-1}{z+1}$, applied everywhere $s$ appears in $H(s)$.</p>
        <p><b>Step 2 — find the frequency mapping.</b> Put $z=e^{j\omega_d}$ and simplify. Using $e^{j\omega_d}-1 = e^{j\omega_d/2}(e^{j\omega_d/2}-e^{-j\omega_d/2}) = e^{j\omega_d/2}\,2j\sin(\omega_d/2)$ and similarly for $z+1$ with cosine:</p>
        $$s=j\omega_a=\frac{2}{T}\frac{2j\sin(\omega_d/2)}{2\cos(\omega_d/2)}=\frac{2}{T}\,j\tan\!\Big(\frac{\omega_d}{2}\Big).$$
        <p><b>Step 3 — read off the warping.</b> Hence $\omega_a=\tfrac{2}{T}\tan(\omega_d/2)$: the analog frequency is a nonlinear (tangent) function of the digital frequency. Low frequencies map almost linearly, but as $\omega_d\to\pi$, $\omega_a\to\infty$ — the entire analog axis is squashed into $[0,\pi)$.</p>
        <p><b>Step 4 — pre-warp to fix a critical frequency.</b> Because of the warp, a naively placed cutoff lands too low. To make the digital cutoff appear exactly at $\omega_d$, design the analog prototype at the pre-warped frequency $\omega_a=\tfrac{2}{T}\tan(\omega_d/2)$; the bilinear map then bends it back precisely to $\omega_d$.</p>
        <p><b>Result.</b> $s=\tfrac{2}{T}\tfrac{z-1}{z+1}$ with pre-warp gives a stable, alias-free IIR whose critical frequencies are exact. Sanity check: as $T\to0$ (fast sampling), $\tan(\omega_d/2)\approx\omega_d/2$ and $\omega_a\approx\omega_d/T$, recovering the un-warped continuous case.</p>`
      },
      {
        title: 'Chebyshev order estimate',
        tex: String.raw`$$n \ge \frac{\cosh^{-1}\!\sqrt{(10^{0.1A_s}-1)/(10^{0.1A_p}-1)}}{\cosh^{-1}(\omega_s/\omega_p)}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A Chebyshev Type-I low-pass has $|H(j\omega)|^2 = 1/[1+\varepsilon^2 T_n^2(\omega/\omega_p)]$, where $T_n$ is the $n$th Chebyshev polynomial and $\varepsilon$ sets passband ripple. We again seek the minimum $n$ meeting the mask.</p>
        <p><b>Step 1 — fix the ripple parameter.</b> The passband ripple $A_p$ gives $\varepsilon^2 = 10^{0.1A_p}-1$ (at the passband edge $T_n=1$, so attenuation there equals $A_p$).</p>
        <p><b>Step 2 — apply the stopband constraint.</b> At $\omega_s$ we need $10\log_{10}[1+\varepsilon^2 T_n^2(\omega_s/\omega_p)]\ge A_s$, so $\varepsilon^2 T_n^2(\omega_s/\omega_p)\ge 10^{0.1A_s}-1$, giving $T_n(\omega_s/\omega_p)\ge\sqrt{(10^{0.1A_s}-1)/(10^{0.1A_p}-1)}$.</p>
        <p><b>Step 3 — invert the Chebyshev polynomial.</b> For arguments $x>1$, $T_n(x)=\cosh(n\cosh^{-1}x)$. Substituting $x=\omega_s/\omega_p$ and solving the inequality for $n$:</p>
        $$n\ge\frac{\cosh^{-1}\!\sqrt{(10^{0.1A_s}-1)/(10^{0.1A_p}-1)}}{\cosh^{-1}(\omega_s/\omega_p)}.$$
        <p><b>Result.</b> Round up. Sanity check: because $\cosh^{-1}$ grows faster than $\log$, the Chebyshev denominator $\cosh^{-1}(\omega_s/\omega_p)$ exceeds the Butterworth $\log(\omega_s/\omega_p)$ term, so Chebyshev meets the same mask with a smaller $n$ — the reward for tolerating passband ripple.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What four numbers define a filter specification?`, back: String.raw`Passband ripple $A_p$ (dB), stopband attenuation $A_s$ (dB), passband edge $\omega_p$, and stopband edge $\omega_s$ — together they form the tolerance mask.` },
      { front: String.raw`List the design flow in order.`, back: String.raw`Spec $\to$ choose approximation $\to$ estimate order $n$ $\to$ normalized LP prototype $\to$ frequency transform + impedance/frequency scaling $\to$ realize.` },
      { front: String.raw`Which approximation is maximally flat?`, back: String.raw`Butterworth — monotonic, no ripple in either band; gentlest roll-off so it needs the highest order for a given mask.` },
      { front: String.raw`Which approximation gives the steepest transition for a given order?`, back: String.raw`Elliptic (Cauer) — equiripple in both passband and stopband; lowest order for a hard magnitude mask, but poor phase.` },
      { front: String.raw`Which approximation has the best (most linear) phase?`, back: String.raw`Bessel/Thomson — maximally flat group delay, preserves pulse shape, but has the gentlest roll-off / worst selectivity.` },
      { front: String.raw`State the Butterworth order formula.`, back: String.raw`$n\ge\log[(10^{0.1A_s}-1)/(10^{0.1A_p}-1)]/(2\log(\omega_s/\omega_p))$, rounded up.` },
      { front: String.raw`What is a normalized low-pass prototype?`, back: String.raw`A low-pass filter with cutoff $\omega_c=1$ rad/s and $1\,\Omega$ reference, whose tabulated $g_k$ values are later scaled and transformed to the real filter.` },
      { front: String.raw`Give the LP-to-HP frequency transformation.`, back: String.raw`Substitute $s\to\omega_c/s$ in the prototype transfer function; series L become C and shunt C become L.` },
      { front: String.raw`What do the LP-to-BP and LP-to-BS transforms do to the order?`, back: String.raw`They double it: an $n$th-order prototype becomes a $2n$th-order band-pass or band-stop filter.` },
      { front: String.raw`Give the element scaling equations.`, back: String.raw`$L_{real}=(k_m/k_f)L_{proto}$ and $C_{real}=C_{proto}/(k_m k_f)$, with $k_f=\omega_c$ and $k_m=R$.` },
      { front: String.raw`How are linear-phase FIR filters designed?`, back: String.raw`By windowing the ideal sinc impulse response, or by the equiripple Parks-McClellan (Remez) algorithm; both give exactly linear phase.` },
      { front: String.raw`What is the bilinear transform?`, back: String.raw`$s=\tfrac{2}{T}\tfrac{z-1}{z+1}$: maps analog $H(s)$ to digital $H(z)$, the $j\omega$ axis onto the unit circle, preserving stability with no aliasing.` },
      { front: String.raw`Why is pre-warping needed with the bilinear transform?`, back: String.raw`The map warps frequency as $\omega_a=\tfrac{2}{T}\tan(\omega_d/2)$; pre-warping the analog design frequency makes the digital critical frequency land exactly where wanted.` },
      { front: String.raw`Why does Chebyshev need a lower order than Butterworth for the same mask?`, back: String.raw`Its order formula uses $\cosh^{-1}(\omega_s/\omega_p)$, which grows faster than $\log(\omega_s/\omega_p)$; the reward is paid for with passband ripple.` }
    ],
    mcqs: [
      { q: String.raw`Which approximation is maximally flat in the passband with no ripple?`, options: [String.raw`Chebyshev I`, String.raw`Butterworth`, String.raw`Elliptic`, String.raw`Bessel`], answer: 1, explain: String.raw`Butterworth is maximally flat and monotonic in both bands; the price is the gentlest roll-off (highest order for a given mask).` },
      { q: String.raw`For a given order, which approximation gives the steepest transition band?`, options: [String.raw`Butterworth`, String.raw`Bessel`, String.raw`Elliptic (Cauer)`, String.raw`Chebyshev II`], answer: 2, explain: String.raw`Elliptic filters are equiripple in both bands and give the steepest transition (lowest order) for a magnitude mask.` },
      { q: String.raw`Which family is chosen when phase linearity / pulse fidelity matters most?`, options: [String.raw`Elliptic`, String.raw`Chebyshev I`, String.raw`Bessel`, String.raw`Butterworth`], answer: 2, explain: String.raw`Bessel/Thomson has maximally flat group delay (near-linear phase), preserving pulse shape at the cost of poor selectivity.` },
      { q: String.raw`In the Butterworth order formula, increasing the stopband attenuation $A_s$ has what effect on $n$?`, options: [String.raw`Decreases $n$`, String.raw`Increases $n$`, String.raw`No effect`, String.raw`Makes $n$ non-integer permanently`], answer: 1, explain: String.raw`A larger $A_s$ increases the numerator $10^{0.1A_s}-1$, so the required order $n$ increases.` },
      { q: String.raw`A wider transition band (larger $\omega_s/\omega_p$) does what to the required order?`, options: [String.raw`Increases it`, String.raw`Decreases it`, String.raw`Leaves it unchanged`, String.raw`Forces elliptic only`], answer: 1, explain: String.raw`A larger $\omega_s/\omega_p$ increases the denominator $2\log(\omega_s/\omega_p)$, so $n$ decreases — more transition room means fewer poles.` },
      { q: String.raw`What is a normalized low-pass prototype referenced to?`, options: [String.raw`$\omega_c=2\pi$, $50\,\Omega$`, String.raw`$\omega_c=1$ rad/s, $1\,\Omega$`, String.raw`$f_c=1$ Hz, $75\,\Omega$`, String.raw`$\omega_c=1$ rad/s, $50\,\Omega$`], answer: 1, explain: String.raw`Prototypes are normalized to cutoff $\omega_c=1$ rad/s and $1\,\Omega$ reference so one table serves every cutoff and impedance.` },
      { q: String.raw`Which substitution turns a low-pass prototype into a high-pass?`, options: [String.raw`$s\to s/\omega_c$`, String.raw`$s\to\omega_c/s$`, String.raw`$s\to (s^2+\omega_0^2)/(sB)$`, String.raw`$s\to sB/(s^2+\omega_0^2)$`], answer: 1, explain: String.raw`LP-to-HP uses $s\to\omega_c/s$, which reflects the passband about the cutoff.` },
      { q: String.raw`The LP-to-BP frequency transformation changes an $n$th-order prototype into a filter of order:`, options: [String.raw`$n$`, String.raw`$n/2$`, String.raw`$2n$`, String.raw`$n^2$`], answer: 2, explain: String.raw`The quadratic band-pass substitution doubles the number of reactive elements, so the order becomes $2n$.` },
      { q: String.raw`Under frequency+impedance scaling, a prototype inductor becomes:`, options: [String.raw`$L=(k_f/k_m)L_p$`, String.raw`$L=(k_m/k_f)L_p$`, String.raw`$L=k_m k_f L_p$`, String.raw`$L=L_p/(k_m k_f)$`], answer: 1, explain: String.raw`$L_{real}=(k_m/k_f)L_{proto}$ with $k_f=\omega_c$, $k_m=R$; capacitors scale as $C_p/(k_m k_f)$.` },
      { q: String.raw`Which digital design method guarantees exactly linear phase?`, options: [String.raw`Bilinear-transform IIR`, String.raw`FIR by windowing or Parks-McClellan`, String.raw`Impulse invariance`, String.raw`Matched-z transform`], answer: 1, explain: String.raw`Symmetric FIR filters (from windowing or Parks-McClellan) have exactly linear phase; IIR methods do not.` },
      { q: String.raw`The bilinear transform maps the analog $j\omega$ axis onto:`, options: [String.raw`The real axis of the z-plane`, String.raw`The unit circle`, String.raw`The interior of the unit disc only`, String.raw`A parabola`], answer: 1, explain: String.raw`It maps the entire $j\omega$ axis onto the unit circle $z=e^{j\omega_d}$, preserving stability and avoiding aliasing.` },
      { q: String.raw`Pre-warping in bilinear-transform design is used to:`, options: [String.raw`Remove passband ripple`, String.raw`Make a critical frequency land exactly at the desired digital frequency`, String.raw`Guarantee FIR linear phase`, String.raw`Double the filter order`], answer: 1, explain: String.raw`The bilinear map warps frequency by $\tan(\omega_d/2)$; pre-warping the analog design frequency cancels the warp at that critical frequency.` }
    ],
    numericals: [
      { q: String.raw`A Butterworth low-pass must have $A_p=1$ dB at $\omega_p=1$ and $A_s=40$ dB at $\omega_s=2$. Find the minimum order $n$.`, solution: String.raw`<p><b>Formula.</b> The Butterworth order is $$n\ge\frac{\log_{10}\!\big[(10^{0.1A_s}-1)/(10^{0.1A_p}-1)\big]}{2\log_{10}(\omega_s/\omega_p)},$$ rounded up to the next integer, where $A_p,A_s$ are in dB and $\omega_s/\omega_p$ is the selectivity ratio.</p>
<p><b>Substitute.</b> $$n\ge\frac{\log_{10}\!\big[(10^{4}-1)/(10^{0.1}-1)\big]}{2\log_{10}(2/1)}.$$</p>
<p><b>Compute.</b> $10^{4}-1=9999$; $10^{0.1}-1=1.259-1=0.259$; ratio $=9999/0.259\approx38{,}607$; $\log_{10}(38607)\approx4.587$. Denominator $2\log_{10}2=2\times0.301=0.602$. So $n\ge4.587/0.602\approx7.62$, round up to $n=8$.</p>
<p><b>Explanation.</b> An 8th-order Butterworth meets the mask with margin. The steep demand (40 dB in one octave, only 1 dB ripple allowed) forces a high order; switching to Chebyshev or elliptic would cut this substantially. Rounding up (never down) guarantees the spec is satisfied.</p>` },
      { q: String.raw`Repeat the previous mask ($A_p=1$ dB, $A_s=40$ dB, $\omega_s/\omega_p=2$) for a Chebyshev Type-I filter. Find $n$.`, solution: String.raw`<p><b>Formula.</b> The Chebyshev order is $$n\ge\frac{\cosh^{-1}\!\sqrt{(10^{0.1A_s}-1)/(10^{0.1A_p}-1)}}{\cosh^{-1}(\omega_s/\omega_p)},$$ using the inverse hyperbolic cosine because $T_n(x)=\cosh(n\cosh^{-1}x)$ for $x>1$.</p>
<p><b>Substitute.</b> $$n\ge\frac{\cosh^{-1}\!\sqrt{9999/0.259}}{\cosh^{-1}(2)}=\frac{\cosh^{-1}\sqrt{38607}}{\cosh^{-1}2}.$$</p>
<p><b>Compute.</b> $\sqrt{38607}\approx196.5$; $\cosh^{-1}(196.5)=\ln(196.5+\sqrt{196.5^2-1})\approx\ln(392.99)\approx5.974$. $\cosh^{-1}(2)=\ln(2+\sqrt{3})\approx\ln(3.732)\approx1.317$. So $n\ge5.974/1.317\approx4.54$, round up to $n=5$.</p>
<p><b>Explanation.</b> Chebyshev meets the identical mask with $n=5$ versus Butterworth's $n=8$ — three fewer poles — because $\cosh^{-1}$ grows faster than $\log$. The cost is 1 dB of equiripple in the passband. This is the classic flatness-vs-order trade.</p>` },
      { q: String.raw`A digital IIR low-pass is to have a cutoff at $\omega_d=0.3\pi$ rad/sample, sampling period $T=1$ s. Find the pre-warped analog design frequency $\omega_a$.`, solution: String.raw`<p><b>Formula.</b> The bilinear transform warps frequency as $$\omega_a=\frac{2}{T}\tan\!\Big(\frac{\omega_d}{2}\Big),$$ so the analog prototype must be designed at $\omega_a$ (pre-warp) for the digital cutoff to land exactly at $\omega_d$.</p>
<p><b>Substitute.</b> $$\omega_a=\frac{2}{1}\tan\!\Big(\frac{0.3\pi}{2}\Big)=2\tan(0.15\pi).$$</p>
<p><b>Compute.</b> $0.15\pi=0.4712$ rad; $\tan(0.4712)\approx0.5095$; so $\omega_a=2\times0.5095\approx1.019$ rad/s.</p>
<p><b>Explanation.</b> The analog prototype is designed with cutoff $\approx1.019$ rad/s, not $0.3\pi\approx0.942$; the bilinear map then bends this back to exactly $0.3\pi$ in the digital filter. Without pre-warping the digital cutoff would land low (near $0.28\pi$), because the tangent warp compresses high frequencies.</p>` },
      { q: String.raw`A normalized Butterworth prototype has $L_p=1.414$ H and $C_p=1.414$ F. Scale it to a cutoff $f_c=1$ MHz in a $50\,\Omega$ system.`, solution: String.raw`<p><b>Formula.</b> With frequency scale $k_f=\omega_c=2\pi f_c$ and impedance scale $k_m=R$, the real elements are $$L_{real}=\frac{k_m}{k_f}L_{proto},\qquad C_{real}=\frac{1}{k_m k_f}C_{proto}.$$</p>
<p><b>Substitute.</b> $k_f=2\pi\times10^{6}=6.283\times10^{6}$ rad/s, $k_m=50$. $$L_{real}=\frac{50}{6.283\times10^{6}}\times1.414,\qquad C_{real}=\frac{1.414}{50\times6.283\times10^{6}}.$$</p>
<p><b>Compute.</b> $L_{real}=(7.958\times10^{-6})\times1.414\approx1.125\times10^{-5}$ H $=11.25\,\mu$H. $C_{real}=1.414/(3.142\times10^{8})\approx4.50\times10^{-9}$ F $=4.50$ nF.</p>
<p><b>Explanation.</b> The dimensionless prototype values become physical: about 11.3 $\mu$H and 4.5 nF. Raising the cutoff shrinks both reactances; the $50\,\Omega$ level scales $L$ up and $C$ down, keeping the characteristic impedance $\sqrt{L/C}$ near $50\,\Omega$. One prototype table thus serves any frequency and impedance.</p>` },
      { q: String.raw`A linear-phase FIR low-pass needs a transition width $\Delta f=2$ kHz at a sampling rate $f_s=48$ kHz (Hamming-class design). Estimate the number of taps $N$.`, solution: String.raw`<p><b>Formula.</b> A rule-of-thumb tap count for a Hamming-window FIR is $$N\approx\frac{3.3}{\Delta f/f_s},$$ where $\Delta f/f_s$ is the normalized transition-band width; narrower transitions need more taps.</p>
<p><b>Substitute.</b> $$N\approx\frac{3.3}{2\text{ kHz}/48\text{ kHz}}=\frac{3.3}{0.04167}.$$</p>
<p><b>Compute.</b> $\Delta f/f_s=2/48=0.04167$; $N\approx3.3/0.04167\approx79.2$, so use about $N=80$ taps (round up, typically to an odd number like 81 for a symmetric type-I FIR).</p>
<p><b>Explanation.</b> Around 80 taps deliver a 2 kHz transition with Hamming sidelobe levels ($\approx-53$ dB stopband). Halving the transition width would double the taps — FIR length scales inversely with transition width, the reason IIR (bilinear) designs are far more coefficient-efficient when linear phase is not required.</p>` }
    ],
    realWorld: String.raw`<p>Filter design underpins every radio and signal chain. In an RF front-end, the antenna feeds a <a href="#bpf">band-pass</a> SAW or BAW filter designed as a steep elliptic-like response to reject out-of-band interferers before the LNA; the IF stage uses a crystal or ceramic band-pass for channel selection. Anti-aliasing filters ahead of an ADC are typically Butterworth or Bessel <a href="#lpf">low-pass</a> stages (flat passband or clean phase), sized by the order formula so the stopband hits the required rejection by $f_s/2$. On the digital side, an SDR realizes its channel filters as <a href="#fir-filters">FIR</a> (linear phase for QAM/OFDM) via Parks-McClellan, or as efficient <a href="#iir-filters">IIR</a> biquads via the bilinear transform for audio and control loops. Test-and-measurement gear leans on Bessel filters where pulse fidelity matters, while power-supply and EMI filters use LC ladders straight from a normalized prototype table. The same flow — spec, approximation, order, prototype, transform, realize — runs from a 5G handset to a lab function generator.</p>`,
    related: ['filters', 'lpf', 'bpf', 'fir-filters', 'iir-filters']
  }
);
