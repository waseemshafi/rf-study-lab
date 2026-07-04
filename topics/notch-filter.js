// Notch (band-stop) filter topic. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'notch-filter',
    title: 'Notch (Band-Stop) Filter',
    category: 'Filters',
    tags: ['notch', 'band-stop', 'twin-T', 'trap', 'Q', 'interference rejection', 'digital notch'],
    summary: String.raw`A notch (band-stop) filter deeply attenuates a narrow band of frequencies centred on a rejection frequency $f_0$ while passing everything else, making it the complement of a band-pass filter and the standard tool for excising a single interfering tone such as mains hum or a jammer.`,
    diagram: [
      {
        title: String.raw`Notch magnitude response (deep null at f0)`,
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr-notch-filter" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Band-stop magnitude: flat pass with a deep null at f0</text>
          <line x1="60" y1="40" x2="60" y2="180" stroke="#9aa7b5" marker-end="url(#arr-notch-filter)"/>
          <line x1="60" y1="180" x2="510" y2="180" stroke="#9aa7b5" marker-end="url(#arr-notch-filter)"/>
          <text x="40" y="52" fill="#9aa7b5" font-size="10" text-anchor="middle">|H|</text>
          <text x="504" y="196" fill="#9aa7b5" font-size="10">f</text>
          <path d="M70,60 L250,60 Q285,60 290,150 L290,150 Q295,60 330,60 L500,60" fill="none" stroke="#4dabf7" stroke-width="2"/>
          <path d="M290,60 L290,168" stroke="#ffa94d" stroke-width="2"/>
          <text x="290" y="196" fill="#ffa94d" font-size="10" text-anchor="middle">f0</text>
          <line x1="250" y1="120" x2="330" y2="120" stroke="#63e6be" stroke-dasharray="4 3"/>
          <text x="360" y="118" fill="#63e6be" font-size="10">-3 dB reject BW</text>
          <line x1="290" y1="60" x2="290" y2="150" stroke="#b197fc" stroke-dasharray="2 2"/>
          <text x="300" y="150" fill="#b197fc" font-size="10">notch depth</text>
          <text x="150" y="52" fill="#9aa7b5" font-size="10">passband (flat, ~0 dB)</text>
        </svg>`,
        caption: String.raw`Ideal notch response: near-unity gain everywhere except a sharp, deep null at f0. The reject bandwidth is measured at the -3 dB points and the notch depth is how far the null drops below the passband; Q = f0/BW sets how narrow the notch is.`
      },
      {
        title: String.raw`Twin-T and LC trap realizations`,
        svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr2-notch-filter" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Two classic notch circuits</text>
          <rect x="24" y="40" width="230" height="150" rx="6" fill="#1c232e" stroke="#4dabf7"/>
          <text x="139" y="60" fill="#e6edf3" text-anchor="middle">Twin-T (RC)</text>
          <text x="139" y="92" fill="#9aa7b5" font-size="10" text-anchor="middle">Low-pass T: R-R-2C</text>
          <text x="139" y="110" fill="#9aa7b5" font-size="10" text-anchor="middle">High-pass T: C-C-R/2</text>
          <text x="139" y="140" fill="#63e6be" font-size="10" text-anchor="middle">null at f0 = 1/(2 pi R C)</text>
          <text x="139" y="164" fill="#9aa7b5" font-size="10" text-anchor="middle">balanced Ts cancel at f0</text>
          <rect x="286" y="40" width="230" height="150" rx="6" fill="#1c232e" stroke="#ffa94d"/>
          <text x="401" y="60" fill="#e6edf3" text-anchor="middle">LC series trap</text>
          <line x1="316" y1="100" x2="360" y2="100" stroke="#9aa7b5"/>
          <rect x="360" y="92" width="34" height="16" fill="none" stroke="#b197fc"/>
          <text x="377" y="86" fill="#b197fc" font-size="9" text-anchor="middle">L</text>
          <path d="M394,100 h8 m0,-5 v10 m6,-10 v10 m0,5 h8" stroke="#63e6be" fill="none"/>
          <text x="410" y="86" fill="#63e6be" font-size="9" text-anchor="middle">C</text>
          <line x1="424" y1="100" x2="470" y2="100" stroke="#9aa7b5"/>
          <text x="401" y="150" fill="#63e6be" font-size="10" text-anchor="middle">series L-C to ground</text>
          <text x="401" y="170" fill="#9aa7b5" font-size="10" text-anchor="middle">low Z at f0 = 1/(2 pi sqrt(LC))</text>
        </svg>`,
        caption: String.raw`Left: the twin-T passive RC notch, a low-pass T and high-pass T in parallel whose outputs cancel at f0 = 1/(2 pi R C). Right: an LC series-resonant trap that shunts the offending tone to ground at f0 = 1/(2 pi sqrt(LC)); a parallel LC placed in series blocks the tone instead.`
      },
      {
        title: String.raw`Interference rejection and z-plane zeros for a digital notch`,
        svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr3-notch-filter" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Use: excise a tone / place zeros on the unit circle</text>
          <text x="30" y="70" fill="#9aa7b5" font-size="10">signal + tone</text>
          <path d="M30,110 q10,-25 20,0 q10,25 20,0 q10,-25 20,0" fill="none" stroke="#4dabf7"/>
          <path d="M30,110 q5,-18 10,0 q5,18 10,0 q5,-18 10,0 q5,18 10,0 q5,-18 10,0 q5,18 10,0" fill="none" stroke="#ffa94d" transform="translate(0,0)"/>
          <line x1="120" y1="105" x2="170" y2="105" stroke="#9aa7b5" marker-end="url(#arr3-notch-filter)"/>
          <rect x="172" y="82" width="90" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/>
          <text x="217" y="102" fill="#e6edf3" text-anchor="middle">notch</text>
          <text x="217" y="118" fill="#9aa7b5" font-size="9" text-anchor="middle">at tone freq</text>
          <line x1="262" y1="105" x2="312" y2="105" stroke="#9aa7b5" marker-end="url(#arr3-notch-filter)"/>
          <text x="345" y="70" fill="#63e6be" font-size="10">tone removed</text>
          <path d="M312,110 q10,-25 20,0 q10,25 20,0 q10,-25 20,0" fill="none" stroke="#4dabf7"/>
          <circle cx="430" cy="185" r="45" fill="none" stroke="#9aa7b5"/>
          <line x1="380" y1="185" x2="480" y2="185" stroke="#9aa7b5"/>
          <line x1="430" y1="140" x2="430" y2="230" stroke="#9aa7b5"/>
          <text x="465" y="150" fill="#b197fc" font-size="10">z-plane</text>
          <circle cx="462" cy="153" r="4" fill="none" stroke="#ffa94d"/>
          <circle cx="462" cy="217" r="4" fill="none" stroke="#ffa94d"/>
          <text x="486" y="150" fill="#ffa94d" font-size="9">e^{+jw0}</text>
          <text x="486" y="225" fill="#ffa94d" font-size="9">e^{-jw0}</text>
          <text x="430" y="238" fill="#9aa7b5" font-size="9" text-anchor="middle">zeros on unit circle</text>
        </svg>`,
        caption: String.raw`Left: a wideband signal contaminated by a single tone passes through a notch tuned to that tone, emerging clean. Right: a second-order digital notch places a conjugate pair of zeros exactly on the unit circle at e^{+/- j w0}, forcing the response to zero at that frequency; nearby poles at radius r < 1 set the notch width.`
      }
    ],
    prerequisites: ['filters', 'frequency-spectrum'],
    intro: String.raw`<p><b>Why does a notch filter exist?</b> Because sometimes a single, known, offending frequency is the whole problem. A power line induces 50/60 Hz hum into an audio or biomedical signal; a strong continuous-wave jammer or a carrier/LO leakage tone sits right on top of an otherwise clean spectrum; a spur from a clock lands exactly where you are trying to receive. In every case you do not want to reshape the whole band — you want to surgically remove one narrow slice and leave everything else untouched. A notch filter is that scalpel: it is the exact complement of a band-pass filter, passing the entire spectrum <i>except</i> a narrow reject band around $f_0$.</p>
<p>A <b>notch (band-stop) filter</b> is defined by three numbers: its <b>centre / rejection frequency</b> $f_0$, its <b>notch depth</b> (how deeply the tone is attenuated), and its <b>reject bandwidth</b> (how wide the removed slice is, measured at the $-3$ dB points). These combine into the quality factor $Q=f_0/\mathrm{BW}$: a high-$Q$ notch is very narrow and removes the tone while sparing nearby wanted signal, whereas a low-$Q$ notch is broad and safe against small frequency errors. Understanding notches means understanding how to hit $f_0$ exactly, how deep and how narrow to make the null, and which realization — passive twin-T, LC trap, active gyrator, or a digital biquad with zeros on the unit circle — best fits the job.</p>`,
    sections: [
      {
        h: 'What a notch filter is and its defining parameters',
        html: String.raw`<p>A notch filter has a magnitude response that is essentially flat (near unity) across the whole frequency axis except for a sharp dip — the <b>notch</b> — at the rejection frequency $f_0$. It is the frequency-domain complement of a band-pass filter (BPF): where a BPF keeps a narrow band and rejects the rest, a notch rejects a narrow band and keeps the rest. Indeed a notch response can be written as $H_{notch}=1-H_{BPF}$ for a matched BPF.</p>
        <p>Three quantities specify it:</p>
        <ul>
          <li><b>Rejection frequency $f_0$:</b> the centre of the null, where attenuation is greatest.</li>
          <li><b>Notch depth:</b> the ratio of passband gain to the gain at $f_0$, usually in dB. A "deep" notch might be $-40$ to $-60$ dB or more; how deep depends on component matching (analog) or coefficient precision and pole radius (digital).</li>
          <li><b>Reject bandwidth (BW):</b> the width between the two $-3$ dB points straddling $f_0$. From this, $Q=f_0/\mathrm{BW}$.</li>
        </ul>
        <div class="callout tip"><b>Key intuition:</b> depth and width are largely independent design targets. Depth is about how completely you cancel at $f_0$; width (Q) is about how much of the neighbourhood you disturb. You want maximum depth <i>and</i> minimum width — but a very narrow notch demands you know $f_0$ precisely and hold it there.</div>`
      },
      {
        h: 'Notch depth, reject bandwidth and Q',
        html: String.raw`<p>The <b>reject bandwidth</b> is defined exactly as for a resonator: it is the span of frequencies over which the notch attenuates by at least $3$ dB relative to the passband. The <b>quality factor</b> ties it to the centre frequency:</p>
        <p>$$Q=\frac{f_0}{\mathrm{BW}_{-3\,\mathrm{dB}}}.$$</p>
        <p>A high $Q$ (say $Q=50$ at $f_0=1$ kHz gives a $20$ Hz reject band) is a razor-thin notch that removes a tone while barely touching signal $30$ Hz away. A low $Q$ notch (broad) tolerates drift in the interferer's frequency but eats more of the wanted spectrum.</p>
        <p><b>Depth</b> is a separate axis. In a passive twin-T, the null goes to $-\infty$ dB only if the two T-sections are perfectly matched; any component tolerance lifts the floor. In a digital notch, depth is set by how exactly the zeros sit on the unit circle: a zero exactly at $|z|=1$ gives an infinitely deep null in theory, limited in practice by coefficient quantisation.</p>
        <div class="callout tip"><b>Design trade:</b> narrow (high-Q) notches spare more signal but are unforgiving of $f_0$ error and drift; broad (low-Q) notches are robust but remove more of the band. Adaptive notches solve this by <i>tracking</i> $f_0$, letting you keep Q high even when the interferer moves.</div>`
      },
      {
        h: 'Passive realizations: twin-T, bridged-T and LC traps',
        html: String.raw`<p>The classic <b>twin-T</b> (parallel-T) notch is two RC T-networks in parallel: a low-pass T built from two series resistors $R$ and a shunt capacitor $2C$, and a high-pass T built from two series capacitors $C$ and a shunt resistor $R/2$. Below $f_0$ the signal takes the low-pass path; above $f_0$ it takes the high-pass path; at exactly</p>
        <p>$$f_0=\frac{1}{2\pi R C}$$</p>
        <p>the two paths are equal in magnitude and opposite in phase, so their sum cancels — a deep null. The twin-T needs no inductor, which is why it dominates audio-frequency hum rejection.</p>
        <ul>
          <li><b>Bridged-T:</b> a single T bridged by an extra element; more compact and easier to tune than the twin-T, common in RF traps.</li>
          <li><b>LC series trap:</b> a series-resonant $L$-$C$ from the signal line to ground. At $f_0=1/(2\pi\sqrt{LC})$ its impedance is nearly zero, shunting the tone away. Placing a <i>parallel</i> $LC$ (high impedance at resonance) <i>in series</i> with the line instead blocks the tone.</li>
        </ul>
        <div class="callout tip"><b>Practical note:</b> passive twin-T depth is limited by resistor/capacitor matching — 1% parts give roughly a $-40$ dB notch. Trimming one leg lets you tune the null deeper. LC traps are limited by inductor $Q$ (series resistance).</div>`
      },
      {
        h: 'Active and gyrator-based notch filters',
        html: String.raw`<p>Passive twin-Ts have two weaknesses: their $Q$ is low (about $0.25$ unbuffered) and they load the source. An <b>active notch</b> wraps the twin-T (or a state-variable topology) around an op-amp. Feeding a fraction of the output back into the twin-T's centre tap sharpens the null: the effective $Q$ becomes $Q_{eff}=Q_0/(1-k)$, so a feedback fraction $k$ near unity yields a very narrow, high-$Q$ notch from the same components.</p>
        <p>At low frequencies a real inductor for an LC trap would be huge, so designers synthesise one with a <b>gyrator</b>: an op-amp circuit that makes a capacitor <i>look like</i> an inductor. A gyrator-based simulated $LC$ trap gives a tunable, high-$Q$, inductor-free notch ideal for $50/60$ Hz and audio work.</p>
        <p>The <b>state-variable / biquad</b> filter is the most flexible: it simultaneously produces low-pass, high-pass and band-pass outputs, and summing the LP and HP outputs (or subtracting the BP output from the input) yields a notch whose $f_0$ and $Q$ are independently tunable by resistors — the workhorse of precision analog notches.</p>
        <div class="callout tip"><b>Why active:</b> active notches decouple depth, $Q$ and $f_0$ into separately adjustable knobs and add gain, so you get a deep, narrow, buffered notch without bulky inductors.</div>`
      },
      {
        h: 'Digital and adaptive notch filters',
        html: String.raw`<p>In DSP a notch is a second-order (biquad) IIR filter. You place a conjugate pair of <b>zeros exactly on the unit circle</b> at the digital angular frequency $\omega_0=2\pi f_0/f_s$, which forces the frequency response to zero at $f_0$:</p>
        <p>$$H(z)=\frac{1-2\cos\omega_0\,z^{-1}+z^{-2}}{1-2r\cos\omega_0\,z^{-1}+r^2 z^{-2}}.$$</p>
        <p>The numerator zeros at $z=e^{\pm j\omega_0}$ create the null; a matching pair of <b>poles</b> just inside the circle at radius $r$ (with $0<r<1$) pulls the response back up to unity away from $f_0$, so the notch is narrow. The pole radius sets the width: $r\to 1$ gives an extremely narrow notch, but too close to $1$ risks a long ringing transient and quantisation trouble.</p>
        <p>An <b>adaptive notch filter</b> makes $\omega_0$ track a drifting interferer. An LMS-type update adjusts the single notch-frequency coefficient to minimise output power, so the null follows a wandering tone (e.g. a chirping jammer or slowly drifting mains). This is how you keep a high-$Q$ (narrow) notch effective against a moving target — impossible with a fixed analog notch.</p>
        <div class="callout tip"><b>Zeros vs poles:</b> the zeros on the unit circle set <i>where and how deep</i> the null is; the pole radius $r$ sets <i>how narrow</i> it is. Approximate reject bandwidth $\mathrm{BW}\approx(1-r)\,f_s/\pi$.</div>`
      },
      {
        h: 'Applications: hum, jammers, carrier leakage and spurs',
        html: String.raw`<p>Notch filters appear anywhere one known frequency must be removed:</p>
        <ul>
          <li><b>Mains hum removal:</b> a $50$ Hz (Europe) or $60$ Hz (North America) notch cleans power-line pickup from audio, ECG/EEG and instrumentation signals. Because mains can drift, adaptive or comb notches (also hitting harmonics) are common.</li>
          <li><b>Single-tone interference / jammer excision:</b> a narrowband continuous-wave interferer or partial-band jammer is notched out before demodulation, improving the effective SNR and <a href="#jamming-margin">jamming margin</a>.</li>
          <li><b>Carrier / LO leakage suppression:</b> in direct-conversion transceivers a DC or LO-leakage tone is notched to stop it swamping the wanted signal.</li>
          <li><b>Spur / anti-alias of a specific tone:</b> a known clock spur or image can be notched so it does not alias into band after sampling.</li>
        </ul>
        <div class="callout tip"><b>System view:</b> a notch trades a sliver of the spectrum for a large gain in dynamic range against one strong interferer — cheap insurance when you know exactly where the trouble lives.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>What a notch is:</b> the complement of a band-pass filter — flat everywhere except a deep, narrow null at $f_0$, so $H_{notch}=1-H_{BPF}$.</li>
<li><b>Its three parameters:</b> rejection frequency $f_0$, notch depth (attenuation at $f_0$, in dB), and reject bandwidth (the $-3$ dB width), tied together by $Q=f_0/\mathrm{BW}$; depth and width are largely independent design targets.</li>
<li><b>Analog realizations:</b> the twin-T with $f_0=1/(2\pi RC)$ (depth limited by matching), bridged-T, and LC series/parallel traps at $f_0=1/(2\pi\sqrt{LC})$; active/gyrator versions raise $Q$ and remove bulky inductors.</li>
<li><b>The digital notch:</b> a biquad with conjugate zeros on the unit circle at $e^{\pm j\omega_0}$ (setting the null) and poles at radius $r<1$ (setting the width), with $\mathrm{BW}\approx(1-r)f_s/\pi$; adaptive notches track a moving interferer.</li>
<li><b>Where it is used:</b> $50/60$ Hz hum, single-tone jammer excision, carrier/LO-leakage suppression and specific-spur removal — surgically deleting one frequency while sparing the rest.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`A notch (band-stop) filter passes all frequencies except a narrow reject band around $f_0$; it is the complement of a band-pass filter, $H_{notch}=1-H_{BPF}$.`,
      String.raw`Three parameters define it: rejection frequency $f_0$, notch depth (attenuation at $f_0$ in dB), and reject bandwidth measured at the $-3$ dB points.`,
      String.raw`Quality factor $Q=f_0/\mathrm{BW}$: high $Q$ = narrow notch (spares nearby signal but needs precise $f_0$); low $Q$ = broad notch (robust but removes more band).`,
      String.raw`The twin-T passive RC notch nulls at $f_0=1/(2\pi RC)$ by cancelling matched low-pass and high-pass T-sections; needs no inductor.`,
      String.raw`An LC trap nulls at $f_0=1/(2\pi\sqrt{LC})$: a series-resonant LC shunts the tone to ground, or a parallel LC in series blocks it.`,
      String.raw`Active/gyrator notches raise $Q$ (e.g. $Q_{eff}=Q_0/(1-k)$) and synthesise inductors, giving deep, narrow, tunable notches for $50/60$ Hz and audio.`,
      String.raw`A digital notch is a biquad with conjugate zeros on the unit circle at $e^{\pm j\omega_0}$ (the null) and poles at radius $r<1$ (the width), $\mathrm{BW}\approx(1-r)f_s/\pi$.`,
      String.raw`Notch depth depends on component matching (analog) or how exactly the zeros sit on $|z|=1$ (digital); imperfect matching lifts the null floor.`,
      String.raw`Adaptive notch filters let $\omega_0$ track a drifting interferer, keeping a high-Q notch effective against a moving tone or jammer.`,
      String.raw`Uses: mains hum removal, single-tone/CW jammer excision, carrier/LO-leakage suppression, and removing a specific spur before sampling.`
    ],
    equations: [
      {
        title: 'LC-trap notch frequency',
        tex: String.raw`$$f_0=\frac{1}{2\pi\sqrt{LC}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A series $L$-$C$ trap rejects a tone at the frequency where its impedance collapses to (near) zero and shunts that tone to ground. We find that frequency from the reactances.</p>
        <p><b>Step 1 — write the branch impedance.</b> A series inductor and capacitor have impedance $$Z(\omega)=j\omega L+\frac{1}{j\omega C}=j\left(\omega L-\frac{1}{\omega C}\right).$$ The magnitude is minimum (ideally zero for a lossless trap) when the reactive part vanishes.</p>
        <p><b>Step 2 — set the reactance to zero (resonance).</b> $$\omega_0 L-\frac{1}{\omega_0 C}=0\ \Longrightarrow\ \omega_0 L=\frac{1}{\omega_0 C}\ \Longrightarrow\ \omega_0^2=\frac{1}{LC}.$$</p>
        <p><b>Step 3 — solve for angular then ordinary frequency.</b> $$\omega_0=\frac{1}{\sqrt{LC}},\qquad f_0=\frac{\omega_0}{2\pi}=\frac{1}{2\pi\sqrt{LC}}.$$</p>
        <p><b>Result.</b> $$f_0=\frac{1}{2\pi\sqrt{LC}}.$$ Sanity check: at $f_0$ the inductive and capacitive reactances are equal and opposite, so the series branch is a short (ideally) and the tone is dumped to ground; the same $\omega_0^2=1/(LC)$ governs a parallel LC used to <i>block</i> a tone.</p>`
      },
      {
        title: 'Quality factor and reject bandwidth',
        tex: String.raw`$$Q=\frac{f_0}{\mathrm{BW}_{-3\,\mathrm{dB}}}\qquad\Longrightarrow\qquad \mathrm{BW}=\frac{f_0}{Q}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The sharpness of a notch is captured by how narrow its $-3$ dB reject band is relative to the centre frequency. We define that ratio from scratch.</p>
        <p><b>Step 1 — locate the band edges.</b> Let the two frequencies where the notch attenuation crosses $-3$ dB (relative to the passband) be $f_L$ and $f_H$, straddling the null at $f_0$. The reject bandwidth is $$\mathrm{BW}=f_H-f_L.$$</p>
        <p><b>Step 2 — define the quality factor.</b> For a resonant network the quality factor is the ratio of the resonant (centre) frequency to this half-power bandwidth: $$Q\equiv\frac{f_0}{\mathrm{BW}}=\frac{f_0}{f_H-f_L}.$$</p>
        <p><b>Step 3 — invert for the practical form.</b> Solving for the bandwidth, $$\mathrm{BW}=\frac{f_0}{Q}.$$ For a series RLC trap the loaded value is $Q=\tfrac{1}{R}\sqrt{L/C}$, tying $Q$ to the physical components.</p>
        <p><b>Result.</b> $$Q=\frac{f_0}{\mathrm{BW}},\qquad \mathrm{BW}=\frac{f_0}{Q}.$$ Sanity check: at fixed $f_0$, doubling $Q$ halves the removed slice of spectrum — a narrower, more selective notch that spares more nearby signal but demands more accurate tuning of $f_0$.</p>`
      },
      {
        title: 'Second-order digital notch transfer function',
        tex: String.raw`$$H(z)=\frac{1-2\cos\omega_0\,z^{-1}+z^{-2}}{1-2r\cos\omega_0\,z^{-1}+r^2 z^{-2}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A digital notch must force the frequency response to zero at one digital frequency $\omega_0=2\pi f_0/f_s$ while leaving the rest of the band near unity. We build it from its poles and zeros.</p>
        <p><b>Step 1 — place zeros on the unit circle.</b> The response is zero at a frequency exactly when a transfer-function zero sits on the unit circle at that angle. To null $\omega_0$ (and, for a real filter, its conjugate $-\omega_0$) we place zeros at $$z=e^{+j\omega_0}\ \text{and}\ z=e^{-j\omega_0}.$$ The numerator is therefore $$(1-e^{j\omega_0}z^{-1})(1-e^{-j\omega_0}z^{-1})=1-2\cos\omega_0\,z^{-1}+z^{-2},$$ using $e^{j\omega_0}+e^{-j\omega_0}=2\cos\omega_0$.</p>
        <p><b>Step 2 — add poles just inside the circle.</b> Zeros alone give a very wide dip. Placing a conjugate pair of poles at the <i>same angle</i> but radius $r<1$, $z=re^{\pm j\omega_0}$, pulls the response back up to $\approx 1$ away from $\omega_0$: $$1-2r\cos\omega_0\,z^{-1}+r^2 z^{-2}.$$</p>
        <p><b>Step 3 — form the ratio.</b> $$H(z)=\frac{1-2\cos\omega_0\,z^{-1}+z^{-2}}{1-2r\cos\omega_0\,z^{-1}+r^2 z^{-2}}.$$</p>
        <p><b>Result.</b> At $z=e^{j\omega_0}$ the numerator vanishes so $H=0$ (deep null); away from $\omega_0$ numerator and denominator nearly cancel so $|H|\approx 1$. The pole radius sets the width, $\mathrm{BW}\approx(1-r)f_s/\pi$; $r\to 1$ makes the notch arbitrarily narrow.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does a notch (band-stop) filter do?`, back: String.raw`It passes all frequencies except a narrow reject band around $f_0$, deeply attenuating one tone — the complement of a band-pass filter.` },
      { front: String.raw`How is a notch related to a band-pass filter?`, back: String.raw`It is the complement: $H_{notch}=1-H_{BPF}$ for a matched BPF.` },
      { front: String.raw`What three numbers specify a notch?`, back: String.raw`Rejection frequency $f_0$, notch depth (attenuation at $f_0$, in dB), and reject bandwidth (the $-3$ dB width).` },
      { front: String.raw`Define the notch quality factor $Q$.`, back: String.raw`$Q=f_0/\mathrm{BW}_{-3\,\mathrm{dB}}$; high $Q$ = narrow notch, low $Q$ = broad notch.` },
      { front: String.raw`Notch frequency of a twin-T RC network?`, back: String.raw`$f_0=1/(2\pi RC)$, where the matched low-pass and high-pass T-sections cancel.` },
      { front: String.raw`Notch frequency of an LC trap?`, back: String.raw`$f_0=1/(2\pi\sqrt{LC})$ — series LC resonance shorts the tone to ground.` },
      { front: String.raw`What limits the depth of a passive twin-T notch?`, back: String.raw`Component matching: with 1% R/C the null floors around $-40$ dB; trimming a leg deepens it.` },
      { front: String.raw`Where are the zeros of a digital notch placed?`, back: String.raw`On the unit circle at $z=e^{\pm j\omega_0}$, forcing the response to zero at $\omega_0=2\pi f_0/f_s$.` },
      { front: String.raw`What sets the width of a digital notch?`, back: String.raw`The pole radius $r$: poles at $re^{\pm j\omega_0}$ with $r\to 1$ give a narrow notch; $\mathrm{BW}\approx(1-r)f_s/\pi$.` },
      { front: String.raw`What is an adaptive notch filter for?`, back: String.raw`It tracks $\omega_0$ (e.g. via LMS) so a high-Q notch follows a drifting interferer such as a chirping jammer or wandering mains.` },
      { front: String.raw`How does a gyrator help build a low-frequency notch?`, back: String.raw`It makes a capacitor look like an inductor, synthesising an LC trap without a bulky inductor for $50/60$ Hz work.` },
      { front: String.raw`Name three uses of notch filters.`, back: String.raw`Mains hum ($50/60$ Hz) removal, single-tone/CW jammer excision, and carrier/LO-leakage or spur suppression.` }
    ],
    mcqs: [
      { q: String.raw`A notch filter is the frequency-domain complement of a:`, options: [String.raw`Low-pass filter`, String.raw`High-pass filter`, String.raw`Band-pass filter`, String.raw`All-pass filter`], answer: 2, explain: String.raw`A notch rejects a narrow band and passes the rest, exactly the opposite of a band-pass filter: $H_{notch}=1-H_{BPF}$.` },
      { q: String.raw`The reject bandwidth of a notch is measured at:`, options: [String.raw`The $-1$ dB points`, String.raw`The $-3$ dB points`, String.raw`The $-20$ dB points`, String.raw`The null itself`], answer: 1, explain: String.raw`Reject bandwidth is the width between the two $-3$ dB (half-power) points straddling $f_0$, giving $Q=f_0/\mathrm{BW}$.` },
      { q: String.raw`The notch frequency of a twin-T network is:`, options: [String.raw`$1/(2\pi RC)$`, String.raw`$1/(RC)$`, String.raw`$RC/2\pi$`, String.raw`$2\pi RC$`], answer: 0, explain: String.raw`The matched low-pass and high-pass Ts cancel at $f_0=1/(2\pi RC)$.` },
      { q: String.raw`An LC series trap rejects a tone at $f_0=$`, options: [String.raw`$1/(2\pi LC)$`, String.raw`$1/(2\pi\sqrt{LC})$`, String.raw`$\sqrt{LC}/2\pi$`, String.raw`$2\pi\sqrt{LC}$`], answer: 1, explain: String.raw`Series resonance occurs where $\omega L=1/(\omega C)$, giving $f_0=1/(2\pi\sqrt{LC})$.` },
      { q: String.raw`Increasing the $Q$ of a notch at fixed $f_0$:`, options: [String.raw`Widens the reject band`, String.raw`Narrows the reject band`, String.raw`Deepens the null but widens it`, String.raw`Has no effect on width`], answer: 1, explain: String.raw`Since $\mathrm{BW}=f_0/Q$, higher $Q$ shrinks the reject bandwidth — a narrower notch.` },
      { q: String.raw`In a digital notch, the response is forced to zero at $f_0$ by placing:`, options: [String.raw`Poles on the unit circle`, String.raw`Zeros on the unit circle at $e^{\pm j\omega_0}$`, String.raw`Zeros at the origin`, String.raw`Poles at infinity`], answer: 1, explain: String.raw`A conjugate pair of zeros on $|z|=1$ at angle $\omega_0$ makes $|H(e^{j\omega_0})|=0$.` },
      { q: String.raw`In a second-order digital notch, the notch width is controlled mainly by:`, options: [String.raw`The zero angle`, String.raw`The pole radius $r$`, String.raw`The sample rate only`, String.raw`The DC gain`], answer: 1, explain: String.raw`Poles at $re^{\pm j\omega_0}$ set the width; $r\to 1$ narrows the notch, $\mathrm{BW}\approx(1-r)f_s/\pi$.` },
      { q: String.raw`What most limits the achievable depth of a passive twin-T notch?`, options: [String.raw`Supply voltage`, String.raw`Component (R,C) matching`, String.raw`Sample rate`, String.raw`Antenna gain`], answer: 1, explain: String.raw`Perfect cancellation needs perfectly matched T-sections; real tolerances lift the null floor.` },
      { q: String.raw`An adaptive notch filter is primarily used to:`, options: [String.raw`Add gain to the passband`, String.raw`Track a drifting interferer's frequency`, String.raw`Lower the sample rate`, String.raw`Convert a notch into a low-pass`], answer: 1, explain: String.raw`Adapting $\omega_0$ (e.g. via LMS) keeps a narrow notch centred on a moving tone or jammer.` },
      { q: String.raw`A common application of a $50/60$ Hz notch is:`, options: [String.raw`GPS acquisition`, String.raw`Mains hum removal from ECG/audio`, String.raw`Increasing symbol rate`, String.raw`Pulse shaping`], answer: 1, explain: String.raw`A $50$ or $60$ Hz notch removes power-line hum picked up by audio, ECG and instrumentation signals.` },
      { q: String.raw`Why use a gyrator in a low-frequency notch?`, options: [String.raw`To increase sample rate`, String.raw`To synthesise a large inductor from a capacitor`, String.raw`To add quantisation noise`, String.raw`To remove the op-amp`], answer: 1, explain: String.raw`At mains frequencies a real inductor would be impractically large; a gyrator makes a capacitor emulate one.` },
      { q: String.raw`Approximate reject bandwidth of a digital notch with pole radius $r$ and sample rate $f_s$:`, options: [String.raw`$(1-r)f_s/\pi$`, String.raw`$r f_s$`, String.raw`$f_s/(1-r)$`, String.raw`$2\pi r f_s$`], answer: 0, explain: String.raw`The $-3$ dB reject bandwidth is approximately $(1-r)f_s/\pi$, so $r$ near 1 gives a very narrow notch.` }
    ],
    numericals: [
      { q: String.raw`An LC series trap uses $L=10$ mH and $C=100$ nF. Find the rejection frequency $f_0$, and state what happens to the impedance and the tone at $f_0$.`, solution: String.raw`<p><b>Formula.</b> A series LC trap rejects at its resonance $$f_0=\frac{1}{2\pi\sqrt{LC}},$$ where at resonance the inductive and capacitive reactances cancel so the branch impedance is minimal (ideally zero).</p>
<p><b>Substitute.</b> $$f_0=\frac{1}{2\pi\sqrt{(10\times10^{-3})(100\times10^{-9})}}.$$</p>
<p><b>Compute.</b> The product $LC=10^{-2}\times10^{-7}=10^{-9}$, so $\sqrt{LC}=\sqrt{10^{-9}}=3.162\times10^{-5}$ s. Then $2\pi\sqrt{LC}=1.987\times10^{-4}$, and $f_0=1/1.987\times10^{-4}\approx 5.03$ kHz.</p>
<p><b>Explanation.</b> At about $5.03$ kHz the series LC is (nearly) a short circuit to ground, so a tone at that frequency is shunted away and removed while other frequencies pass. Real inductor loss ($R$) keeps the impedance from reaching exactly zero, limiting notch depth.</p>` },
      { q: String.raw`A notch is centred at $f_0=1$ kHz with $Q=25$. Find the $-3$ dB reject bandwidth and the two band-edge frequencies.`, solution: String.raw`<p><b>Formula.</b> The reject bandwidth follows from the quality factor $$\mathrm{BW}=\frac{f_0}{Q},$$ and for a narrow notch the band edges sit approximately symmetrically at $f_0\pm\mathrm{BW}/2$.</p>
<p><b>Substitute.</b> $$\mathrm{BW}=\frac{1000\text{ Hz}}{25},\qquad f_{L,H}=1000\mp\frac{\mathrm{BW}}{2}.$$</p>
<p><b>Compute.</b> $\mathrm{BW}=40$ Hz. Half-bandwidth is $20$ Hz, so $f_L\approx 980$ Hz and $f_H\approx 1020$ Hz.</p>
<p><b>Explanation.</b> A $Q=25$ notch removes only a $40$ Hz slice around $1$ kHz, sparing signal even $30$ Hz away — but it demands the interferer stay within roughly $\pm 20$ Hz of $1$ kHz, else the tone escapes the null. Raising $Q$ would shrink the band further.</p>` },
      { q: String.raw`A twin-T notch reduces a tone from a passband level of $1.0$ V to $6.3$ mV at $f_0$. Express the notch depth in dB.`, solution: String.raw`<p><b>Formula.</b> Notch depth in decibels is the passband-to-null voltage ratio $$\text{depth (dB)}=20\log_{10}\!\left(\frac{V_{pass}}{V_{null}}\right).$$</p>
<p><b>Substitute.</b> $$\text{depth}=20\log_{10}\!\left(\frac{1.0\text{ V}}{6.3\times10^{-3}\text{ V}}\right).$$</p>
<p><b>Compute.</b> The ratio is $1/0.0063\approx 158.7$; $\log_{10}(158.7)\approx 2.20$, so depth $=20\times2.20\approx 44$ dB.</p>
<p><b>Explanation.</b> The tone is knocked down by about $44$ dB, consistent with a passive twin-T built from roughly 1% components (finite matching floors the null near $-40$ to $-45$ dB). Trimming one leg or going active would deepen it further.</p>` },
      { q: String.raw`A digital notch runs at $f_s=8$ kHz and must reject a $60$ Hz tone with a $-3$ dB width of about $8$ Hz. Find the digital notch angle $\omega_0$ and the required pole radius $r$.`, solution: String.raw`<p><b>Formula.</b> The notch angle is $\omega_0=2\pi f_0/f_s$, and the pole radius follows from the width approximation $$\mathrm{BW}\approx\frac{(1-r)f_s}{\pi}\ \Longrightarrow\ r\approx 1-\frac{\pi\,\mathrm{BW}}{f_s}.$$</p>
<p><b>Substitute.</b> $$\omega_0=\frac{2\pi(60)}{8000},\qquad r\approx 1-\frac{\pi(8)}{8000}.$$</p>
<p><b>Compute.</b> $\omega_0=2\pi\times0.0075=0.0471$ rad ($\approx 2.7^\circ$). For the radius, $\pi\times8/8000=0.00314$, so $r\approx 1-0.00314=0.9969$.</p>
<p><b>Explanation.</b> The zeros sit on the unit circle at $e^{\pm j0.0471}$ to kill $60$ Hz, and poles at radius $0.9969$ (very close to the circle) squeeze the reject band down to about $8$ Hz. Such a high $r$ gives a razor-thin, deep notch but a long transient, so coefficient precision matters.</p>` },
      { q: String.raw`A twin-T built with $R=16$ k$\Omega$ and $C=100$ nF is intended to notch mains hum. Find $f_0$ and state whether it targets 50 Hz or 60 Hz mains.`, solution: String.raw`<p><b>Formula.</b> The twin-T null is at $$f_0=\frac{1}{2\pi RC},$$ set by the resistor $R$ and capacitor $C$ of the matched T-sections.</p>
<p><b>Substitute.</b> $$f_0=\frac{1}{2\pi(16\times10^{3})(100\times10^{-9})}.$$</p>
<p><b>Compute.</b> $RC=16\times10^{3}\times100\times10^{-9}=1.6\times10^{-3}$ s. Then $2\pi RC=1.005\times10^{-2}$, so $f_0=1/1.005\times10^{-2}\approx 99.5$ Hz... re-checking: $1/0.01005\approx 99.5$ Hz. Halving the sensitivity: with $R=16$ k and $C=100$ nF, $f_0\approx 99.5$ Hz. To land on $50$ Hz mains, use $R\approx 32$ k$\Omega$; to land on $60$ Hz use $R\approx 26.5$ k$\Omega$.</p>
<p><b>Explanation.</b> The chosen parts give roughly $100$ Hz, which is the second harmonic of $50$ Hz mains rather than the fundamental — a useful reminder that hum-notch component values must be picked for the exact target frequency. Scaling $R$ (or $C$) inversely with $f_0$ retargets the null to $50$ or $60$ Hz.</p>` }
    ],
    realWorld: String.raw`<p>Notch filters are everywhere a single frequency must be surgically removed. In biomedical instrumentation, a $50$ or $60$ Hz notch (often a switched-capacitor or DSP biquad) strips power-line hum from ECG, EEG and EMG recordings so the microvolt-level physiology is not buried under mains pickup; because mains drifts, many designs use adaptive notches that track the line frequency. In audio, twin-T and gyrator-based notches kill hum and specific whistles without gutting the music. In RF and communications, notch/trap filters excise a strong continuous-wave interferer or partial-band jammer ahead of the demodulator to protect <a href="#jamming-margin">jamming margin</a>, and direct-conversion transceivers notch DC/LO leakage so it does not swamp the wanted signal. Software-defined radios implement all of this digitally: a biquad with conjugate zeros on the unit circle, or an adaptive LMS notch, removes a clock spur or CW tone before it can alias into band after sampling. A notch is the natural complement to the <a href="#bpf">band-pass filter</a> and sits alongside the <a href="#hpf">high-pass</a> and <a href="#filters">general filter</a> toolkit for shaping a spectrum.</p>`,
    related: ['filters', 'bpf', 'hpf']
  }
);
