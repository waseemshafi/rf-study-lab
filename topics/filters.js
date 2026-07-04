// Filters — Fundamentals & Families
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'filters',
    title: 'Filters — Fundamentals & Families',
    category: 'Filters',
    tags: ['filter', 'Butterworth', 'Chebyshev', 'elliptic', 'Bessel', 'roll-off', 'poles', 'Q'],
    summary: String.raw`A filter is a frequency-selective two-port that passes wanted frequencies and rejects unwanted ones; this topic builds the shared vocabulary — passband, stopband, transition band, cutoff, order, roll-off, ripple, Q, poles and zeros — and contrasts the classic approximations (Butterworth, Chebyshev, elliptic, Bessel).`,
    diagram: [
    {
      title: String.raw`Anatomy of a magnitude response`,
      svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-filters" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Low-pass template: the bands and their edges</text>
        <line x1="60" y1="40" x2="60" y2="210" stroke="#9aa7b5" marker-end="url(#arr-filters)"/>
        <line x1="60" y1="210" x2="520" y2="210" stroke="#9aa7b5" marker-end="url(#arr-filters)"/>
        <text x="30" y="55" fill="#9aa7b5">|H|</text>
        <text x="510" y="228" fill="#9aa7b5">f</text>
        <path d="M60,60 L230,60 Q270,60 300,120 Q330,178 400,178 L490,178" fill="none" stroke="#4dabf7" stroke-width="2"/>
        <line x1="60" y1="72" x2="240" y2="72" stroke="#ffa94d" stroke-dasharray="4 3"/>
        <text x="130" y="88" fill="#ffa94d" font-size="10" text-anchor="middle">passband ripple</text>
        <line x1="270" y1="40" x2="270" y2="210" stroke="#63e6be" stroke-dasharray="4 3"/>
        <text x="270" y="235" fill="#63e6be" font-size="10" text-anchor="middle">f_c (−3 dB)</text>
        <rect x="62" y="42" width="168" height="16" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="146" y="54" fill="#e6edf3" font-size="10" text-anchor="middle">passband</text>
        <rect x="240" y="90" width="90" height="16" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="285" y="102" fill="#e6edf3" font-size="10" text-anchor="middle">transition</text>
        <rect x="360" y="185" width="128" height="16" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="424" y="197" fill="#e6edf3" font-size="10" text-anchor="middle">stopband</text>
        <line x1="360" y1="178" x2="490" y2="178" stroke="#b197fc" stroke-dasharray="4 3"/>
        <text x="440" y="172" fill="#b197fc" font-size="10" text-anchor="middle">stopband floor</text>
      </svg>`,
      caption: String.raw`Generic low-pass magnitude response. The passband passes signals (flat to within the passband ripple), the transition band is the finite-width slope, and the stopband is attenuated below a floor. The cutoff f_c is conventionally the −3 dB (half-power) point.`
    },
    {
      title: String.raw`The four classic families compared`,
      svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-filters" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Same order, different approximations</text>
        <line x1="55" y1="40" x2="55" y2="205" stroke="#9aa7b5" marker-end="url(#arr2-filters)"/>
        <line x1="55" y1="205" x2="510" y2="205" stroke="#9aa7b5" marker-end="url(#arr2-filters)"/>
        <text x="30" y="52" fill="#9aa7b5">|H|</text>
        <text x="500" y="223" fill="#9aa7b5">f</text>
        <path d="M55,60 L200,60 Q235,62 270,120 Q305,178 360,182 L490,190" fill="none" stroke="#4dabf7" stroke-width="2"/>
        <path d="M55,60 L120,58 130,66 150,56 175,66 200,58 Q235,58 262,110 Q290,168 340,180 L490,188" fill="none" stroke="#ffa94d" stroke-width="2"/>
        <path d="M55,60 L190,58 200,66 215,56 Q245,58 255,150 265,110 275,175 285,150 L490,178" fill="none" stroke="#b197fc" stroke-width="2"/>
        <path d="M55,62 Q150,70 230,120 Q320,180 420,192 L490,196" fill="none" stroke="#63e6be" stroke-width="2"/>
        <rect x="330" y="44" width="176" height="80" rx="6" fill="#1c232e" stroke="#9aa7b5"/>
        <text x="342" y="60" fill="#4dabf7" font-size="10">Butterworth — maximally flat</text>
        <text x="342" y="76" fill="#ffa94d" font-size="10">Chebyshev I — passband ripple</text>
        <text x="342" y="92" fill="#b197fc" font-size="10">Elliptic — ripple both bands</text>
        <text x="342" y="108" fill="#63e6be" font-size="10">Bessel — gentle, linear phase</text>
      </svg>`,
      caption: String.raw`At equal order: Butterworth is flat but rolls off slowly; Chebyshev I trades passband ripple for a steeper skirt; elliptic ripples in both bands for the steepest transition; Bessel gives the gentlest slope but the best (linear) phase.`
    },
    {
      title: String.raw`Order sets roll-off steepness`,
      svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-filters" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">More poles → steeper skirt (Butterworth low-pass)</text>
        <line x1="55" y1="40" x2="55" y2="200" stroke="#9aa7b5" marker-end="url(#arr3-filters)"/>
        <line x1="55" y1="200" x2="510" y2="200" stroke="#9aa7b5" marker-end="url(#arr3-filters)"/>
        <text x="20" y="52" fill="#9aa7b5">|H| dB</text>
        <text x="500" y="218" fill="#9aa7b5">f (log)</text>
        <line x1="255" y1="40" x2="255" y2="200" stroke="#63e6be" stroke-dasharray="4 3"/>
        <text x="255" y="218" fill="#63e6be" font-size="10" text-anchor="middle">f_c</text>
        <path d="M55,60 L235,62 255,70 L360,110 L490,150" fill="none" stroke="#4dabf7" stroke-width="2"/>
        <path d="M55,60 L240,62 255,72 L360,150 L470,235" fill="none" stroke="#ffa94d" stroke-width="2"/>
        <path d="M55,60 L248,62 255,74 L330,180 L370,235" fill="none" stroke="#b197fc" stroke-width="2"/>
        <rect x="360" y="44" width="146" height="60" rx="6" fill="#1c232e" stroke="#9aa7b5"/>
        <text x="372" y="60" fill="#4dabf7" font-size="10">n=1 → 20 dB/decade</text>
        <text x="372" y="76" fill="#ffa94d" font-size="10">n=2 → 40 dB/decade</text>
        <text x="372" y="92" fill="#b197fc" font-size="10">n=4 → 80 dB/decade</text>
      </svg>`,
      caption: String.raw`Each pole adds ≈20 dB/decade (6 dB/octave) to the ultimate roll-off. A 1-pole filter falls 20 dB/decade, a 2-pole 40 dB/decade, a 4-pole 80 dB/decade — order buys stopband steepness at the cost of size, phase lag and (for ripple families) passband flatness.`
    }
    ],
    prerequisites: ['bandwidth'],
    intro: String.raw`<p><b>Why do filters exist?</b> Almost no real signal arrives alone. It shares the spectrum with noise, interferers, harmonics, images and the aliases of its own sampling. A receiver that cannot separate the 100 MHz station you want from the 100.2 MHz one you do not is useless; an ADC fed frequencies above half its sample rate folds garbage on top of the wanted band forever. The filter is the one block whose entire job is to be <i>frequency-selective</i> — to let some frequencies through and hold others back — and it is therefore present, in some form, in every radio, every audio chain, every power supply, and every data converter. Master the filter vocabulary once and it reappears everywhere: the same passband/stopband/order/roll-off ideas describe an RC network, a crystal ladder, a cavity, and a digital FIR alike.</p>
<p>A <b>filter</b> is a two-port network whose transfer function $H(f)=V_{out}/V_{in}$ is deliberately shaped in frequency. This topic is the foundation for the whole filter family: it fixes the language (passband, stopband, transition band, cutoff, order, roll-off, insertion loss, ripple, Q, poles and zeros, group delay) and then explains the four classic approximations — <b>Butterworth</b> (maximally flat), <b>Chebyshev</b> (ripple for a steeper skirt), <b>elliptic/Cauer</b> (steepest of all), and <b>Bessel</b> (linear phase) — that every specific filter you will design is built from.</p>`,
    sections: [
      {
        h: String.raw`What a filter does and the response bands`,
        html: String.raw`<p>A filter shapes a signal's spectrum by applying a frequency-dependent gain $|H(f)|$ and phase $\angle H(f)$. The magnitude response divides the frequency axis into named regions:</p>
        <ul>
          <li><b>Passband:</b> the range of frequencies the filter is meant to transmit with (ideally) unity gain. Real passbands droop or ripple by a small amount — the <b>passband ripple</b>.</li>
          <li><b>Stopband:</b> the range the filter is meant to reject. It is specified by a minimum <b>stopband attenuation</b> (how far down the floor sits, in dB).</li>
          <li><b>Transition band:</b> the finite-width region between passband and stopband where the response slides from one to the other. An ideal "brick-wall" filter would have zero-width transition; real filters cannot.</li>
        </ul>
        <p>The <b>filter type</b> names which band is where: <i>low-pass</i> (pass low, reject high), <i>high-pass</i> (the reverse), <i>band-pass</i> (pass a middle band), and <i>band-stop/notch</i> (reject a middle band). Everything in this topic is stated for the low-pass prototype because the others are obtained from it by frequency transformations.</p>
        <div class="callout tip"><b>Key intuition:</b> a filter is a "spectral gate". Draw the wanted signal and the interferers on a frequency axis, then ask which side of the gate each falls on. The whole art of filter <i>specification</i> is placing the transition band so the gate lands cleanly between wanted and unwanted.</div>`
      },
      {
        h: String.raw`Cutoff, order and roll-off`,
        html: String.raw`<p>The <b>cutoff frequency</b> $f_c$ marks the edge of the passband. By near-universal convention it is the <b>−3 dB point</b>: the frequency where $|H|^2$ has fallen to one half of its passband value (so $|H|=1/\sqrt2\approx0.707$). Because power is proportional to $|H|^2$, −3 dB is the <b>half-power</b> frequency.</p>
        <p>The <b>order</b> $n$ of a filter is the degree of the denominator of its transfer function — equivalently the number of independent energy-storage elements (Ls and Cs, or poles). Order controls two things:</p>
        <ul>
          <li><b>Ultimate roll-off:</b> far into the stopband the magnitude falls at $\approx 20n$ dB per decade of frequency, i.e. $6n$ dB per octave. Each added pole steepens the skirt by another 20 dB/decade.</li>
          <li><b>Sharpness near $f_c$:</b> higher order also tightens the transition band, letting the response turn the corner faster.</li>
        </ul>
        <p><b>Roll-off</b> is that slope. A first-order RC low-pass rolls off 20 dB/decade; a fourth-order design 80 dB/decade. "Decade" = ×10 in frequency; "octave" = ×2, and $20\log_{10}2\approx6.02$, which is why 20 dB/decade and 6 dB/octave are the same slope.</p>
        <div class="callout tip"><b>Rule of thumb:</b> to hit an attenuation $A$ (dB) at a frequency ratio $f/f_c$, you need roughly $n \gtrsim A / (20\log_{10}(f/f_c))$ poles for a Butterworth. This one inequality decides the order in most first-pass designs.</div>`
      },
      {
        h: String.raw`Ripple, insertion loss and attenuation`,
        html: String.raw`<p>Three more specification numbers pin down a real filter:</p>
        <ul>
          <li><b>Passband ripple</b> $A_p$ (dB): the peak-to-peak variation of $|H|$ across the passband. Butterworth and Bessel have essentially none; Chebyshev I and elliptic trade a chosen ripple (e.g. 0.1 or 0.5 dB) for a steeper skirt.</li>
          <li><b>Stopband attenuation</b> $A_s$ (dB): the minimum rejection guaranteed everywhere in the stopband. Elliptic and Chebyshev II hold a flat stopband floor set by ripple; Butterworth's attenuation keeps growing with frequency.</li>
          <li><b>Insertion loss:</b> the extra loss a real (lossy) filter adds even in the middle of its passband, caused by finite component Q and matching. An ideal filter has 0 dB passband insertion loss; a real crystal or cavity filter has a fraction of a dB to several dB.</li>
        </ul>
        <p>These trade against each other. Tightening the transition band (steeper skirt) for a fixed order forces either more passband ripple, more stopband ripple, or worse phase. There is no free lunch — a filter is a budget shared among flatness, selectivity, and phase.</p>`
      },
      {
        h: String.raw`Poles, zeros, Q and group delay`,
        html: String.raw`<p>A filter's behaviour is captured by the <b>poles and zeros</b> of its transfer function $H(s)$ in the complex $s$-plane. <b>Poles</b> are the roots of the denominator; each conjugate pole pair contributes a resonance. <b>Zeros</b> are the roots of the numerator; they force $|H|\to0$ at specific frequencies and are what let elliptic and Chebyshev-II filters place deep <b>transmission nulls</b> in the stopband. Butterworth and Chebyshev-I are <i>all-pole</i> (no finite zeros).</p>
        <p>The <b>quality factor</b> $Q$ of a pole pair measures how close it sits to the imaginary axis — a high-$Q$ pole gives a sharp resonant peak and a narrow, selective response but rings and is sensitive to component tolerance. For a resonant band-pass, $Q = f_0/\mathrm{BW}$, the ratio of centre frequency to −3 dB bandwidth.</p>
        <p><b>Group delay</b> $\tau_g(f) = -\,d\phi/d\omega$ is the time each frequency component is delayed. If $\tau_g$ is <i>not</i> constant across the band, different frequencies arrive at different times and pulses smear — <b>dispersion</b>. A filter with <b>linear phase</b> ($\phi$ proportional to $f$) has constant group delay and does not distort waveforms. This is exactly what Bessel filters optimise, and why sharp elliptic filters — with their wildly varying group delay near cutoff — are poor for pulse or data waveforms.</p>
        <div class="callout tip"><b>Key intuition:</b> magnitude and phase are two sides of one coin. You can have a razor-sharp magnitude skirt (elliptic) or a clean, dispersion-free phase (Bessel), but not both from one filter. The application decides which matters.</div>`
      },
      {
        h: String.raw`The four classic approximations`,
        html: String.raw`<p>Given a target brick-wall shape, an <b>approximation</b> is a realizable rational $|H(f)|$ that comes close. The four canonical families differ in <i>how</i> they spend their order:</p>
        <ul>
          <li><b>Butterworth (maximally flat):</b> $|H|^2 = 1/\big(1+(f/f_c)^{2n}\big)$. The flattest possible passband (all derivatives zero at DC), monotonic everywhere, gentle skirt. The safe default when flatness matters and you can afford the order.</li>
          <li><b>Chebyshev type I:</b> equiripple in the passband, monotonic (steeper) in the stopband. For the same order it reaches a given attenuation at a lower $f/f_c$ than Butterworth — you buy skirt with passband ripple.</li>
          <li><b>Chebyshev type II (inverse):</b> flat passband, equiripple stopband with finite zeros. Steeper than Butterworth without disturbing the passband, but the stopband only reaches a floor (does not keep improving).</li>
          <li><b>Elliptic / Cauer:</b> equiripple in <i>both</i> bands. The steepest possible transition for a given order — the minimum order to meet a mask — at the cost of ripple everywhere and badly non-linear phase.</li>
          <li><b>Bessel / Thomson:</b> maximally flat <i>group delay</i>. The gentlest magnitude skirt of all, but the only family with (near) linear phase — the choice for pulses, video, and data where waveform fidelity beats selectivity.</li>
        </ul>
        <table class="data">
          <tr><th>Family</th><th>Passband</th><th>Stopband</th><th>Skirt (same n)</th><th>Phase</th></tr>
          <tr><td>Butterworth</td><td>flat</td><td>monotonic</td><td>gentle</td><td>fair</td></tr>
          <tr><td>Chebyshev I</td><td>ripple</td><td>monotonic</td><td>steep</td><td>poor</td></tr>
          <tr><td>Chebyshev II</td><td>flat</td><td>ripple</td><td>steep</td><td>fair</td></tr>
          <tr><td>Elliptic</td><td>ripple</td><td>ripple</td><td>steepest</td><td>worst</td></tr>
          <tr><td>Bessel</td><td>flat</td><td>monotonic</td><td>gentlest</td><td>best (linear)</td></tr>
        </table>`
      },
      {
        h: String.raw`Analog vs digital, active vs passive`,
        html: String.raw`<p>The same approximations are realized in very different hardware:</p>
        <ul>
          <li><b>Passive analog:</b> only R, L, C (and transformers). No power supply, excellent large-signal handling and noise, but bulky inductors, insertion loss, and no gain. Used at RF as LC ladders, cavities, and crystal/SAW filters.</li>
          <li><b>Active analog:</b> op-amps or transconductors plus R and C, avoiding inductors (Sallen–Key, multiple-feedback, gm-C, switched-capacitor). Compact, can have gain, but limited by op-amp bandwidth, noise and supply.</li>
          <li><b>Digital:</b> the filter is arithmetic on sampled data — <b>FIR</b> (finite impulse response, inherently stable, can be exactly linear-phase) and <b>IIR</b> (infinite impulse response, uses feedback, matches analog prototypes efficiently but can be unstable and non-linear-phase). Exactly repeatable, no component drift, but bounded by sample rate and quantization.</li>
        </ul>
        <p>The choice is set by frequency and requirements: GHz selectivity demands passive/distributed filters; audio and baseband favour active or digital; anything needing exact linear phase or reconfigurability leans digital FIR. The <i>theory</i> — bands, order, roll-off, the four families — is identical across all of them.</p>`
      },
      {
        h: String.raw`What you should now understand`,
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The band vocabulary:</b> passband (transmit, with ripple $A_p$), stopband (reject, to a floor $A_s$), and the finite transition band between them, with the cutoff $f_c$ defined at the −3 dB (half-power) point.</li>
<li><b>Order and roll-off:</b> order $n$ = number of poles / energy-storage elements; ultimate roll-off is $\approx 20n$ dB/decade $= 6n$ dB/octave, so each pole steepens the skirt by 20 dB/decade.</li>
<li><b>The trade budget:</b> insertion loss, passband ripple, stopband attenuation, and phase/group-delay flatness all trade against selectivity — no filter is best at everything.</li>
<li><b>Poles, zeros, Q and group delay:</b> poles set resonances (high-$Q$ = sharp but ringy), finite zeros make stopband nulls, and constant group delay (linear phase) means no waveform dispersion.</li>
<li><b>The four families:</b> Butterworth (maximally flat), Chebyshev I/II (ripple for a steeper skirt), elliptic (steepest, ripple both bands), Bessel (linear phase, gentlest) — and where each wins.</li>
<li><b>The realizations:</b> passive vs active analog and FIR vs IIR digital all implement the <i>same</i> approximation theory; frequency and phase requirements pick the technology.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`A filter is a frequency-selective two-port: it shapes $|H(f)|$ into a passband (transmit), stopband (reject) and a finite transition band between them.`,
      String.raw`Cutoff $f_c$ is the −3 dB (half-power) point where $|H|=1/\sqrt2$ of the passband value; the four types are low-pass, high-pass, band-pass and band-stop/notch.`,
      String.raw`Order $n$ = number of poles / energy-storage elements; ultimate roll-off is $\approx 20n$ dB/decade $= 6n$ dB/octave — each pole adds 20 dB/decade.`,
      String.raw`Key specs trade off: passband ripple $A_p$, stopband attenuation $A_s$, insertion loss, and phase/group-delay linearity all compete with transition steepness.`,
      String.raw`Poles set resonances (high-$Q$ = sharp but ringy); finite zeros create stopband transmission nulls; Butterworth and Chebyshev-I are all-pole (no finite zeros).`,
      String.raw`Constant group delay (linear phase) means no waveform dispersion; Bessel maximises it, elliptic has the worst phase.`,
      String.raw`Butterworth is maximally flat ($|H|^2=1/(1+(f/f_c)^{2n})$), monotonic, gentle skirt — the flatness-first default.`,
      String.raw`Chebyshev I (passband ripple) and II (stopband ripple) are steeper than Butterworth at equal order; elliptic ripples both bands for the steepest transition of all.`,
      String.raw`Bessel gives the gentlest magnitude skirt but the best (linear) phase — the choice for pulses, video and data.`,
      String.raw`The same approximation theory is realized as passive/active analog and FIR/IIR digital; frequency and phase requirements pick the technology.`
    ],
    equations: [
      {
        title: String.raw`First-order RC low-pass and its −3 dB cutoff`,
        tex: String.raw`$$|H(f)|=\frac{1}{\sqrt{1+(f/f_c)^2}},\qquad f_c=\frac{1}{2\pi RC}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The simplest filter is a resistor $R$ feeding a capacitor $C$, output taken across $C$. We find its transfer function and the frequency at which it is 3 dB down.</p>
        <p><b>Step 1 — voltage divider with impedances.</b> The capacitor's impedance is $Z_C=1/(j\omega C)$ with $\omega=2\pi f$. Treating $R$ and $C$ as a divider, the output over input is</p>
        $$H(j\omega)=\frac{Z_C}{R+Z_C}=\frac{1/(j\omega C)}{R+1/(j\omega C)}=\frac{1}{1+j\omega RC}.$$
        <p><b>Step 2 — take the magnitude.</b> The magnitude of $1/(1+jx)$ is $1/\sqrt{1+x^2}$ with $x=\omega RC$, so</p>
        $$|H(j\omega)|=\frac{1}{\sqrt{1+(\omega RC)^2}}.$$
        <p><b>Step 3 — find the −3 dB point.</b> The cutoff is where power is halved, i.e. $|H|^2=\tfrac12$, so $1+(\omega RC)^2=2\Rightarrow \omega RC=1$. Hence $\omega_c=1/(RC)$ and, dividing by $2\pi$,</p>
        $$f_c=\frac{1}{2\pi RC}.$$
        <p><b>Step 4 — rewrite in terms of $f_c$.</b> Substituting $\omega RC=f/f_c$ gives the standard form $|H(f)|=1/\sqrt{1+(f/f_c)^2}$.</p>
        <p><b>Result.</b> $$|H(f)|=\frac{1}{\sqrt{1+(f/f_c)^2}},\quad f_c=\frac{1}{2\pi RC}.$$ Sanity check: at $f=f_c$, $|H|=1/\sqrt2\approx0.707$ (−3 dB), and for $f\gg f_c$, $|H|\approx f_c/f$ — a 20 dB/decade roll-off, as expected for one pole.</p>`
      },
      {
        title: String.raw`Ultimate roll-off per pole (dB/decade)`,
        tex: String.raw`$$\text{slope}\approx -20\,n\ \text{dB/decade}=-6\,n\ \text{dB/octave}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want the far-stopband slope of an $n$-pole all-pole low-pass, and to show each pole contributes the same 20 dB/decade.</p>
        <p><b>Step 1 — far-out magnitude of one pole.</b> A single pole gives $|H_1|=1/\sqrt{1+(f/f_c)^2}$. For $f\gg f_c$ the "1" is negligible, so $|H_1|\approx f_c/f\propto f^{-1}$.</p>
        <p><b>Step 2 — stack $n$ poles.</b> An $n$-pole low-pass behaves as $|H_n|\approx (f_c/f)^n\propto f^{-n}$ far out (the magnitudes multiply because the transfer functions multiply).</p>
        <p><b>Step 3 — convert to decibels.</b> In dB, $|H_n|_{dB}=20\log_{10}|H_n|=20\log_{10}\big((f_c/f)^n\big)=-20\,n\log_{10}(f/f_c).$</p>
        <p><b>Step 4 — evaluate a decade and an octave.</b> One decade is $f/f_c\to10\times$ larger, so $\log_{10}(f/f_c)$ increases by 1 and the level drops by $20n$ dB — that is $-20n$ dB/decade. One octave is $\times2$, and $20\log_{10}2=6.02$, giving $-6n$ dB/octave.</p>
        <p><b>Result.</b> $$\text{slope}\approx -20n\ \text{dB/decade}=-6n\ \text{dB/octave}.$$ Sanity check: $n=1$ gives the RC result of 20 dB/decade; $n=4$ gives 80 dB/decade. The 20 dB/decade and 6 dB/octave figures are identical because a decade and an octave differ only by the $\log_{10}$ vs $\log_2$ of the frequency ratio.</p>`
      },
      {
        title: String.raw`Butterworth magnitude-squared response`,
        tex: String.raw`$$|H(f)|^2=\frac{1}{1+(f/f_c)^{2n}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The Butterworth family is defined as the all-pole low-pass whose passband is "maximally flat". We show what that condition produces and read off its properties.</p>
        <p><b>Step 1 — write a normalized magnitude-squared.</b> Let $\Omega=f/f_c$ be the normalized frequency and posit $|H|^2=1/(1+\varepsilon(\Omega))$ where $\varepsilon(\Omega)$ is a polynomial in $\Omega^2$ that must be small in the passband and large in the stopband.</p>
        <p><b>Step 2 — impose maximal flatness.</b> "Maximally flat at DC" means as many derivatives of $|H|^2$ as possible vanish at $\Omega=0$. The polynomial that makes the first $2n-1$ derivatives zero is the pure monomial $\varepsilon(\Omega)=\Omega^{2n}$ — any lower-power term would introduce a non-zero low-order derivative and curvature in the passband.</p>
        <p><b>Step 3 — assemble the response.</b> Substituting gives</p>
        $$|H(\Omega)|^2=\frac{1}{1+\Omega^{2n}}=\frac{1}{1+(f/f_c)^{2n}}.$$
        <p><b>Step 4 — check the three regimes.</b> At $\Omega=0$: $|H|^2=1$ (unity, flat). At $\Omega=1$ (i.e. $f=f_c$): $|H|^2=1/2$, so $|H|=0.707$ — the −3 dB cutoff for every order. For $\Omega\gg1$: $|H|^2\approx\Omega^{-2n}$, so $|H|\approx\Omega^{-n}$ — a $20n$ dB/decade roll-off.</p>
        <p><b>Result.</b> $$|H(f)|^2=\frac{1}{1+(f/f_c)^{2n}}.$$ Sanity check: monotonic (no ripple), always exactly −3 dB at $f_c$ regardless of $n$, and steeper skirt as $n$ grows — the defining Butterworth behaviour.</p>`
      },
      {
        title: String.raw`Quality factor of a resonant band-pass`,
        tex: String.raw`$$Q=\frac{f_0}{\mathrm{BW}}=\frac{f_0}{f_2-f_1}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A resonant (band-pass) filter is characterized by how narrow and selective its peak is. We define the quality factor $Q$ and connect it to the −3 dB bandwidth.</p>
        <p><b>Step 1 — define $Q$ from stored vs dissipated energy.</b> Physically $Q=2\pi\,(\text{energy stored})/(\text{energy dissipated per cycle})$ at resonance $f_0$. A high $Q$ means low loss per cycle, so the resonance is sharp.</p>
        <p><b>Step 2 — relate loss to bandwidth.</b> For a second-order resonator the magnitude response peaks at $f_0$ and falls to $1/\sqrt2$ of the peak (−3 dB) at two frequencies $f_1<f_0<f_2$. The energy-based $Q$ can be shown to equal $\omega_0/\Delta\omega$, where $\Delta\omega=\omega_2-\omega_1$ is the −3 dB angular bandwidth.</p>
        <p><b>Step 3 — express in ordinary frequency.</b> Dividing numerator and denominator by $2\pi$ turns angular into cyclic frequency without changing the ratio:</p>
        $$Q=\frac{\omega_0}{\omega_2-\omega_1}=\frac{f_0}{f_2-f_1}=\frac{f_0}{\mathrm{BW}}.$$
        <p><b>Result.</b> $$Q=\frac{f_0}{\mathrm{BW}}.$$ Sanity check: a 10 MHz band-pass with a 100 kHz −3 dB bandwidth has $Q=100$ — a narrow, selective filter. Doubling $Q$ halves the fractional bandwidth, giving sharper selectivity but longer ringing (higher group delay) and tighter component tolerances.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Define passband, stopband and transition band.`, back: String.raw`Passband = frequencies transmitted (ideally unity gain); stopband = frequencies rejected (to a floor); transition band = the finite-width region between them where the response slides from one to the other.` },
      { front: String.raw`What is the cutoff frequency $f_c$ conventionally?`, back: String.raw`The −3 dB (half-power) point, where $|H|^2$ is half its passband value and $|H|=1/\sqrt2\approx0.707$.` },
      { front: String.raw`What does a filter's order $n$ control?`, back: String.raw`The number of poles / energy-storage elements. It sets the ultimate roll-off ($\approx20n$ dB/decade) and how tightly the response turns near $f_c$.` },
      { front: String.raw`How steep is the roll-off per pole?`, back: String.raw`About 20 dB/decade per pole, equivalently 6 dB/octave (since $20\log_{10}2\approx6$).` },
      { front: String.raw`What is passband ripple vs stopband attenuation?`, back: String.raw`Passband ripple $A_p$ = the allowed peak-to-peak gain variation in the passband; stopband attenuation $A_s$ = the minimum guaranteed rejection in the stopband, both in dB.` },
      { front: String.raw`What is insertion loss?`, back: String.raw`The extra loss a real, lossy filter adds even in the middle of its passband, from finite component Q and matching; ideal filters have 0 dB.` },
      { front: String.raw`What do poles and zeros do in a filter?`, back: String.raw`Poles create resonances (sharpness/selectivity); finite zeros force $|H|\to0$ at specific frequencies, creating stopband transmission nulls. All-pole filters (Butterworth, Chebyshev-I) have no finite zeros.` },
      { front: String.raw`What is $Q$ for a resonant band-pass?`, back: String.raw`$Q=f_0/\mathrm{BW}$, the ratio of centre frequency to −3 dB bandwidth. High $Q$ = narrow, selective, but ringy and tolerance-sensitive.` },
      { front: String.raw`What is group delay and why does it matter?`, back: String.raw`$\tau_g=-d\phi/d\omega$, the delay each frequency experiences. Non-constant group delay smears pulses (dispersion); constant group delay = linear phase = no waveform distortion.` },
      { front: String.raw`Butterworth: defining property and formula?`, back: String.raw`Maximally flat passband: $|H|^2=1/(1+(f/f_c)^{2n})$. Monotonic, no ripple, gentle skirt, always −3 dB at $f_c$.` },
      { front: String.raw`How do Chebyshev I and II differ?`, back: String.raw`Type I ripples in the passband (flat, monotonic stopband); type II is flat in the passband and ripples in the stopband (with finite zeros). Both are steeper than Butterworth at equal order.` },
      { front: String.raw`What makes the elliptic (Cauer) filter special?`, back: String.raw`Equiripple in BOTH bands, giving the steepest transition — the minimum order to meet a given mask — at the cost of ripple everywhere and the worst phase.` },
      { front: String.raw`What is the Bessel filter optimised for?`, back: String.raw`Maximally flat group delay (near-linear phase). It has the gentlest magnitude skirt but does not distort waveforms — ideal for pulses/video/data.` },
      { front: String.raw`Analog vs digital, active vs passive filters?`, back: String.raw`Passive = R/L/C only; active = op-amps + R/C (no inductors); digital = arithmetic on samples (FIR = stable, linear-phase; IIR = feedback, efficient, can be unstable). Same approximation theory throughout.` }
    ],
    mcqs: [
      { q: String.raw`The cutoff frequency of a filter is conventionally defined at the point where the response has fallen by:`, options: [String.raw`1 dB`, String.raw`3 dB`, String.raw`6 dB`, String.raw`20 dB`], answer: 1, explain: String.raw`The −3 dB (half-power) point is the standard cutoff: $|H|^2=1/2$, so $|H|=0.707$.` },
      { q: String.raw`A fourth-order low-pass filter has an ultimate roll-off of approximately:`, options: [String.raw`20 dB/decade`, String.raw`40 dB/decade`, String.raw`80 dB/decade`, String.raw`160 dB/decade`], answer: 2, explain: String.raw`Roll-off $\approx20n$ dB/decade; for $n=4$ that is $20\times4=80$ dB/decade.` },
      { q: String.raw`Which family has the flattest possible passband and no ripple?`, options: [String.raw`Chebyshev I`, String.raw`Elliptic`, String.raw`Butterworth`, String.raw`Chebyshev II`], answer: 2, explain: String.raw`Butterworth is "maximally flat" — all passband derivatives at DC vanish and the response is monotonic with no ripple.` },
      { q: String.raw`Which filter gives the steepest transition band for a given order?`, options: [String.raw`Bessel`, String.raw`Butterworth`, String.raw`Elliptic (Cauer)`, String.raw`Chebyshev I`], answer: 2, explain: String.raw`The elliptic filter ripples in both bands and achieves the steepest possible skirt (minimum order) for a given specification mask.` },
      { q: String.raw`Which family is chosen when linear phase / constant group delay is required?`, options: [String.raw`Elliptic`, String.raw`Bessel`, String.raw`Chebyshev II`, String.raw`Butterworth`], answer: 1, explain: String.raw`Bessel filters maximise group-delay flatness (near-linear phase), preserving pulse shapes even though their magnitude skirt is the gentlest.` },
      { q: String.raw`Finite transmission zeros in the stopband are a feature of:`, options: [String.raw`Butterworth and Chebyshev I`, String.raw`Elliptic and Chebyshev II`, String.raw`Bessel only`, String.raw`No practical filter`], answer: 1, explain: String.raw`Elliptic and Chebyshev-II filters place finite zeros that create deep stopband nulls; Butterworth and Chebyshev-I are all-pole with no finite zeros.` },
      { q: String.raw`For a resonant band-pass filter, $Q$ equals:`, options: [String.raw`$\mathrm{BW}/f_0$`, String.raw`$f_0/\mathrm{BW}$`, String.raw`$f_0\times\mathrm{BW}$`, String.raw`$f_0+\mathrm{BW}$`], answer: 1, explain: String.raw`$Q=f_0/\mathrm{BW}$; higher $Q$ means a narrower −3 dB bandwidth relative to the centre frequency, hence sharper selectivity.` },
      { q: String.raw`Chebyshev type I filters trade a steeper skirt for:`, options: [String.raw`Stopband ripple`, String.raw`Passband ripple`, String.raw`Higher insertion loss`, String.raw`Linear phase`], answer: 1, explain: String.raw`Type I is equiripple in the passband (accepting passband ripple) to gain a steeper transition than Butterworth at equal order.` },
      { q: String.raw`A 20 dB/decade slope is equivalent to how many dB per octave?`, options: [String.raw`3 dB/octave`, String.raw`6 dB/octave`, String.raw`10 dB/octave`, String.raw`20 dB/octave`], answer: 1, explain: String.raw`An octave is a factor of 2 in frequency and $20\log_{10}2\approx6.02$ dB, so 20 dB/decade = 6 dB/octave.` },
      { q: String.raw`Which realization can be made exactly linear-phase?`, options: [String.raw`Passive LC ladder`, String.raw`Analog Sallen–Key`, String.raw`Digital FIR`, String.raw`Analog elliptic`], answer: 2, explain: String.raw`A symmetric-coefficient FIR filter has exactly linear phase (constant group delay); analog and IIR realizations can only approximate it.` },
      { q: String.raw`The Butterworth magnitude-squared response is:`, options: [String.raw`$1/(1+(f/f_c)^{n})$`, String.raw`$1/(1+(f/f_c)^{2n})$`, String.raw`$1/(1+\varepsilon^2 T_n^2)$`, String.raw`$(f/f_c)^{2n}$`], answer: 1, explain: String.raw`$|H|^2=1/(1+(f/f_c)^{2n})$; the $\varepsilon^2 T_n^2$ form is Chebyshev, not Butterworth.` },
      { q: String.raw`Insertion loss refers to:`, options: [String.raw`Attenuation in the stopband`, String.raw`Loss in the passband of a real filter`, String.raw`The width of the transition band`, String.raw`The phase shift at cutoff`], answer: 1, explain: String.raw`Insertion loss is the extra passband loss a real, lossy filter adds even where it should be transmitting, due to finite component Q and matching.` }
    ],
    numericals: [
      { q: String.raw`An RC low-pass uses $R=1\ \mathrm{k\Omega}$ and $C=159\ \mathrm{nF}$. Find the −3 dB cutoff frequency.`, solution: String.raw`<p><b>Formula.</b> A first-order RC low-pass has cutoff $$f_c=\frac{1}{2\pi RC},$$ the frequency where $\omega RC=1$ and the response is 3 dB down.</p>
<p><b>Substitute.</b> $$f_c=\frac{1}{2\pi(1\times10^{3}\,\Omega)(159\times10^{-9}\,\mathrm{F})}.$$</p>
<p><b>Compute.</b> The product $RC=1\times10^{3}\times159\times10^{-9}=1.59\times10^{-4}$ s. Then $f_c=1/(2\pi\times1.59\times10^{-4})=1/(9.99\times10^{-4})\approx1000$ Hz $=1.0$ kHz.</p>
<p><b>Explanation.</b> The 159 nF value was chosen so $RC\approx1/(2\pi\times1000)$, giving a clean 1 kHz corner. At 1 kHz the output is 0.707 of the input; at 10 kHz (one decade up) it is about 20 dB (10×) smaller, confirming the single-pole 20 dB/decade roll-off.</p>` },
      { q: String.raw`A signal one decade above the cutoff of a first-order low-pass. By how many dB is it attenuated relative to the passband?`, solution: String.raw`<p><b>Formula.</b> Far above cutoff a single pole rolls off at $-20\log_{10}(f/f_c)$ dB, i.e. $$A(\text{dB})=20\log_{10}\!\left(\frac{f}{f_c}\right)\ \text{for } f\gg f_c.$$</p>
<p><b>Substitute.</b> One decade means $f/f_c=10$, so $$A=20\log_{10}(10).$$</p>
<p><b>Compute.</b> $\log_{10}(10)=1$, so $A=20\times1=20$ dB.</p>
<p><b>Explanation.</b> A first-order filter loses 20 dB per decade, so exactly one decade above cutoff the signal is 20 dB (a factor of 10 in voltage) down. Two decades up would be 40 dB down — the slope is constant on a log-log plot, which is why Bode plots are drawn that way.</p>` },
      { q: String.raw`A Butterworth low-pass must provide at least 60 dB of attenuation at 10× the cutoff frequency. Find the minimum order.`, solution: String.raw`<p><b>Formula.</b> A Butterworth's far-stopband attenuation is $A\approx20n\log_{10}(f/f_c)$ dB, so the order needed is $$n\gtrsim\frac{A}{20\log_{10}(f/f_c)}.$$</p>
<p><b>Substitute.</b> With $A=60$ dB and $f/f_c=10$: $$n\gtrsim\frac{60}{20\log_{10}(10)}=\frac{60}{20\times1}.$$</p>
<p><b>Compute.</b> $n\gtrsim60/20=3$, so a 3rd-order Butterworth just meets 60 dB at a decade out; round up to $n=3$.</p>
<p><b>Explanation.</b> Each pole gives 20 dB/decade, so three poles give 60 dB/decade — exactly the requirement one decade above $f_c$. A steeper family (Chebyshev/elliptic) could meet the same spec at lower order by accepting ripple, which is precisely why they exist.</p>` },
      { q: String.raw`A band-pass filter is centred at $f_0=10.7$ MHz with a −3 dB bandwidth of 200 kHz. Find its $Q$.`, solution: String.raw`<p><b>Formula.</b> The quality factor of a resonant band-pass is $$Q=\frac{f_0}{\mathrm{BW}},$$ the centre frequency divided by the −3 dB bandwidth.</p>
<p><b>Substitute.</b> $$Q=\frac{10.7\times10^{6}\ \mathrm{Hz}}{200\times10^{3}\ \mathrm{Hz}}.$$</p>
<p><b>Compute.</b> $Q=10.7\times10^{6}/2.0\times10^{5}=53.5$.</p>
<p><b>Explanation.</b> This is a typical 10.7 MHz IF filter; $Q\approx54$ means a moderately narrow, selective response. To halve the bandwidth to 100 kHz you would need $Q=107$, doubling the selectivity but also roughly doubling the ringing (group delay) and demanding tighter component tolerances.</p>` },
      { q: String.raw`At $f=2f_c$, find $|H|$ (in dB) for a second-order Butterworth low-pass.`, solution: String.raw`<p><b>Formula.</b> A Butterworth magnitude is $$|H|=\frac{1}{\sqrt{1+(f/f_c)^{2n}}},\qquad |H|_{dB}=20\log_{10}|H|=-10\log_{10}\!\big(1+(f/f_c)^{2n}\big).$$</p>
<p><b>Substitute.</b> With $n=2$ and $f/f_c=2$: $$|H|_{dB}=-10\log_{10}\!\big(1+2^{2\times2}\big)=-10\log_{10}(1+2^{4}).$$</p>
<p><b>Compute.</b> $2^{4}=16$, so $1+16=17$; $\log_{10}(17)=1.230$, giving $|H|_{dB}=-10\times1.230=-12.3$ dB.</p>
<p><b>Explanation.</b> One octave above cutoff a 2nd-order filter is about 12 dB down (close to the asymptotic $6n=12$ dB/octave, plus a small correction because we are not yet deep in the stopband). At $f=f_c$ the same formula gives $-10\log_{10}(2)=-3.0$ dB, confirming the −3 dB cutoff.</p>` }
    ],
    realWorld: String.raw`<p>Filters are everywhere in a signal chain. A superheterodyne receiver uses an RF <a href="#bpf">band-pass</a> preselector to reject the <a href="#image-frequency">image frequency</a> before the <a href="#mixer">mixer</a>, a sharp <a href="#intermediate-frequency">IF</a> filter (often a 10.7 MHz or 455 kHz crystal/ceramic filter, a resonant high-$Q$ band-pass) to set adjacent-channel selectivity, and an anti-alias <a href="#lpf">low-pass</a> ahead of the ADC so nothing above Nyquist folds into the band. Power supplies use LC low-pass filters to smooth switching ripple; audio systems use gentle Bessel-like responses to avoid smearing transients, while a spectrum-mask-limited transmitter uses a steep elliptic filter to cram maximum energy into its channel without spilling into the neighbours. In software-defined radios (<a href="#sdr">SDR</a>) the same theory is realized digitally as <a href="#fir-filters">FIR</a> and <a href="#iir-filters">IIR</a> filters, where exact linear phase (FIR) or analog-prototype efficiency (IIR) is chosen per requirement. The specific realizations — <a href="#lpf">LPF</a>, <a href="#hpf">HPF</a>, <a href="#bpf">BPF</a>, <a href="#notch-filter">notch</a> — and the whole <a href="#filter-design">filter-design</a> flow build directly on the vocabulary and families in this topic.</p>`,
    related: ['lpf', 'hpf', 'bpf', 'filter-design', 'fir-filters']
  }
);
