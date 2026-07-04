// Harmonics & Harmonic Distortion — RF Front-End & Receivers
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'harmonics',
    title: 'Harmonics & Harmonic Distortion',
    category: 'RF Front-End & Receivers',
    tags: ['harmonics', 'THD', 'nonlinearity', 'gain compression', 'spurious emissions', 'harmonic filter'],
    summary: String.raw`When a single tone drives a nonlinear device, the device manufactures new tones at integer multiples of the input frequency — the harmonics; their generation, measurement (THD), and suppression (harmonic filtering) are the foundation of every distortion and intermod problem in an RF front end.`,
    diagram: [
      {
        title: String.raw`One tone in, a comb of harmonics out`,
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr-harmonics" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">A nonlinearity turns one input tone into a harmonic comb</text>
          <text x="70" y="40" fill="#9aa7b5" text-anchor="middle">clean input at f</text>
          <path d="M20,90 Q45,55 70,90 T120,90" fill="none" stroke="#4dabf7" stroke-width="1.5"/>
          <line x1="130" y1="90" x2="196" y2="90" stroke="#9aa7b5" marker-end="url(#arr-harmonics)"/>
          <rect x="198" y="66" width="120" height="48" rx="6" fill="#1c232e" stroke="#ffa94d"/>
          <text x="258" y="87" fill="#e6edf3" text-anchor="middle">nonlinear device</text>
          <text x="258" y="104" fill="#9aa7b5" font-size="9" text-anchor="middle">y=a1x+a2x²+a3x³</text>
          <line x1="318" y1="90" x2="384" y2="90" stroke="#9aa7b5" marker-end="url(#arr-harmonics)"/>
          <text x="450" y="40" fill="#9aa7b5" text-anchor="middle">distorted output</text>
          <path d="M386,90 Q400,58 410,90 Q416,70 424,90 T470,90 T520,90" fill="none" stroke="#63e6be" stroke-width="1.5"/>
          <text x="150" y="175" fill="#e6edf3" font-size="11" text-anchor="middle">spectrum of the output</text>
          <line x1="40" y1="200" x2="300" y2="200" stroke="#9aa7b5"/>
          <line x1="60" y1="200" x2="60" y2="150" stroke="#63e6be" stroke-width="3"/><text x="60" y="214" fill="#9aa7b5" font-size="9" text-anchor="middle">f</text>
          <line x1="110" y1="200" x2="110" y2="172" stroke="#4dabf7" stroke-width="3"/><text x="110" y="214" fill="#9aa7b5" font-size="9" text-anchor="middle">2f</text>
          <line x1="160" y1="200" x2="160" y2="182" stroke="#4dabf7" stroke-width="3"/><text x="160" y="214" fill="#9aa7b5" font-size="9" text-anchor="middle">3f</text>
          <line x1="210" y1="200" x2="210" y2="190" stroke="#4dabf7" stroke-width="3"/><text x="210" y="214" fill="#9aa7b5" font-size="9" text-anchor="middle">4f</text>
          <line x1="260" y1="200" x2="260" y2="194" stroke="#4dabf7" stroke-width="3"/><text x="260" y="214" fill="#9aa7b5" font-size="9" text-anchor="middle">5f</text>
        </svg>`,
        caption: String.raw`A pure tone at f entering a nonlinear device (y=a1x+a2x²+a3x³…) emerges distorted; its spectrum is a comb at f, 2f, 3f, 4f… The fundamental stays largest and the harmonics fall off, but each new tone is energy the input never contained.`
      },
      {
        title: String.raw`THD: fundamental plus a decaying harmonic tail`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr2-harmonics" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Total Harmonic Distortion = harmonic energy ÷ fundamental</text>
          <line x1="50" y1="170" x2="500" y2="170" stroke="#9aa7b5"/>
          <line x1="50" y1="170" x2="50" y2="40" stroke="#9aa7b5"/>
          <text x="30" y="45" fill="#9aa7b5" font-size="9" text-anchor="middle">V</text>
          <rect x="66" y="55" width="14" height="115" rx="2" fill="#63e6be"/><text x="73" y="184" fill="#9aa7b5" font-size="9" text-anchor="middle">V1 (f)</text>
          <rect x="146" y="110" width="14" height="60" rx="2" fill="#ffa94d"/><text x="153" y="184" fill="#9aa7b5" font-size="9" text-anchor="middle">V2 (2f)</text>
          <rect x="226" y="130" width="14" height="40" rx="2" fill="#ffa94d"/><text x="233" y="184" fill="#9aa7b5" font-size="9" text-anchor="middle">V3 (3f)</text>
          <rect x="306" y="146" width="14" height="24" rx="2" fill="#ffa94d"/><text x="313" y="184" fill="#9aa7b5" font-size="9" text-anchor="middle">V4 (4f)</text>
          <rect x="386" y="156" width="14" height="14" rx="2" fill="#ffa94d"/><text x="393" y="184" fill="#9aa7b5" font-size="9" text-anchor="middle">V5 (5f)</text>
          <text x="300" y="70" fill="#b197fc" font-size="12" text-anchor="middle">THD = √(V2²+V3²+V4²+…) / V1</text>
          <text x="300" y="90" fill="#9aa7b5" font-size="10" text-anchor="middle">only the harmonic tail (orange) enters the numerator</text>
        </svg>`,
        caption: String.raw`THD compares the RMS sum of all harmonic amplitudes (V2, V3, V4…) to the fundamental V1. A cleaner device has a steeper-decaying tail and thus lower THD; the fundamental itself is excluded from the numerator.`
      },
      {
        title: String.raw`Even vs odd order, and cleaning up with a low-pass filter`,
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr3-harmonics" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Even-order squares/rectifies; odd-order compresses the fundamental</text>
          <rect x="24" y="40" width="150" height="70" rx="6" fill="#1c232e" stroke="#4dabf7"/>
          <text x="99" y="62" fill="#e6edf3" text-anchor="middle">x² term (even)</text>
          <text x="99" y="80" fill="#9aa7b5" font-size="9" text-anchor="middle">cos²=½+½cos2ωt</text>
          <text x="99" y="96" fill="#63e6be" font-size="9" text-anchor="middle">→ DC + 2f</text>
          <rect x="196" y="40" width="150" height="70" rx="6" fill="#1c232e" stroke="#b197fc"/>
          <text x="271" y="62" fill="#e6edf3" text-anchor="middle">x³ term (odd)</text>
          <text x="271" y="80" fill="#9aa7b5" font-size="9" text-anchor="middle">cos³=¾cosωt+¼cos3ωt</text>
          <text x="271" y="96" fill="#ffa94d" font-size="9" text-anchor="middle">→ 3f + compresses f</text>
          <text x="430" y="66" fill="#9aa7b5" font-size="10" text-anchor="middle">even: no f term,</text>
          <text x="430" y="82" fill="#9aa7b5" font-size="10" text-anchor="middle">odd: feeds back onto f</text>
          <text x="270" y="150" fill="#e6edf3" font-size="12" text-anchor="middle">Harmonic low-pass filter cleans the output</text>
          <line x1="30" y1="200" x2="90" y2="200" stroke="#9aa7b5" marker-end="url(#arr3-harmonics)"/>
          <text x="55" y="192" fill="#9aa7b5" font-size="9">f,2f,3f…</text>
          <rect x="92" y="178" width="120" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
          <text x="152" y="198" fill="#e6edf3" text-anchor="middle">LPF / harmonic</text>
          <text x="152" y="213" fill="#9aa7b5" font-size="9" text-anchor="middle">filter (cutoff &gt; f)</text>
          <line x1="212" y1="200" x2="290" y2="200" stroke="#9aa7b5" marker-end="url(#arr3-harmonics)"/>
          <path d="M300,200 Q320,175 340,200 T380,200" fill="none" stroke="#63e6be" stroke-width="1.5"/>
          <text x="420" y="204" fill="#63e6be" font-size="10">clean f only</text>
        </svg>`,
        caption: String.raw`The x² (even-order) term produces cos²=½+½cos2ωt — DC plus the 2nd harmonic, with no term back at f. The x³ (odd-order) term gives cos³=¾cosωt+¼cos3ωt — a 3rd harmonic plus a component back on the fundamental that (for a3<0) compresses gain. A low-pass/harmonic filter placed after the device rejects the 2f, 3f… comb and passes only f.`
      }
    ],
    prerequisites: ['frequency-spectrum', 'lna'],
    intro: String.raw`<p><b>Why do harmonics matter?</b> Because no real amplifier, mixer, or power stage is perfectly linear, and the instant a device bends its input–output curve even slightly, it stops merely amplifying your signal and starts <i>manufacturing</i> new signals at frequencies you never transmitted. Those new tones — the harmonics at 2f, 3f, 4f… — are the reason a transmitter fails its spurious-emission mask, the reason a receiver desensitizes when a strong nearby carrier drives its front end into compression, and the reason every RF chain ends in an output or harmonic filter. Harmonic generation is also the simplest, single-tone window into the whole nonlinearity story: master it and the two-tone intermodulation and third-order-intercept picture follows directly.</p>
<p>A <b>harmonic</b> is a spectral component at an integer multiple of a fundamental frequency $f$: the components at $2f, 3f, 4f,\dots$. A perfectly linear device ($y=a_1x$) can only scale and shift a tone — it cannot create new frequencies. A <b>nonlinear</b> device, modeled by the power series $y=a_1x+a_2x^2+a_3x^3+\dots$, generates them: the squaring term makes the 2nd harmonic (and DC), the cubing term makes the 3rd (and pushes energy back onto the fundamental, causing <b>gain compression</b>). We quantify the resulting corruption with <b>Total Harmonic Distortion (THD)</b> and we suppress it with filtering. This topic builds the whole chain from the power series up.</p>`,
    sections: [
      {
        h: 'What a harmonic is and why only nonlinearity makes one',
        html: String.raw`<p>Drive a device with a single tone $x(t)=A\cos(\omega t)$, where $\omega=2\pi f$. A <b>linear</b> device outputs $a_1 A\cos(\omega t)$ — same frequency, scaled amplitude, possibly a phase shift. No new frequency can appear, because scaling and delaying a sinusoid leaves a sinusoid at the same frequency.</p>
        <p>A <b>nonlinear</b> device follows a curved transfer characteristic. Expanding that curve as a power series about the operating point,</p>
        <p>$$y(t)=a_1 x + a_2 x^2 + a_3 x^3 + a_4 x^4 + \dots$$</p>
        <p>Each power of a cosine, via the power-reduction identities, contains cosines at <i>multiple</i> frequencies. For example $\cos^2\theta=\tfrac12+\tfrac12\cos 2\theta$ and $\cos^3\theta=\tfrac34\cos\theta+\tfrac14\cos 3\theta$. So $x^2$ creates a term at $2\omega$ (the 2nd harmonic) plus a DC term; $x^3$ creates a term at $3\omega$ (the 3rd harmonic) plus a term back at $\omega$. The output spectrum becomes a <b>comb</b> at $f, 2f, 3f, 4f,\dots$</p>
        <div class="callout tip"><b>Key intuition:</b> harmonics are not "in" your signal — the device makes them. Their very existence is a direct measurement of how curved (nonlinear) the transfer characteristic is. A ruler-straight device produces none.</div>`
      },
      {
        h: 'The power series: which term makes which harmonic',
        html: String.raw`<p>Substitute $x=A\cos\omega t$ into the series and collect by frequency. Using the identities repeatedly:</p>
        <ul>
          <li><b>$a_1 x$</b> → amplitude at $f$ (the wanted linear gain).</li>
          <li><b>$a_2 x^2$</b> → $a_2 A^2(\tfrac12+\tfrac12\cos 2\omega t)$: a <b>DC</b> offset and the <b>2nd harmonic</b> at $2f$. Amplitude of the 2nd harmonic $\propto a_2 A^2$.</li>
          <li><b>$a_3 x^3$</b> → $a_3 A^3(\tfrac34\cos\omega t+\tfrac14\cos 3\omega t)$: a <b>3rd harmonic</b> at $3f$ plus a term <i>back on the fundamental</i>. Amplitude of the 3rd harmonic $\propto a_3 A^3$.</li>
        </ul>
        <p>Two scaling laws fall straight out and are worth memorizing:</p>
        <ul>
          <li>The <b>$n$-th harmonic amplitude grows as $A^n$</b>: doubling the input (+6 dB) raises the 2nd harmonic by +12 dB and the 3rd by +18 dB. On a dB plot the $n$-th harmonic has slope $n$.</li>
          <li>Because it also scales with $a_n$, the harmonic content is set by the <i>shape</i> of the nonlinearity, not just its strength.</li>
        </ul>
        <div class="callout tip"><b>Exam trap:</b> the 3rd-order term does two things — it makes a 3rd harmonic <i>and</i> it adds a same-frequency term to the fundamental. That second effect is the seed of gain compression and, in the two-tone case, of third-order intermodulation.</div>`
      },
      {
        h: 'Even-order vs odd-order distortion',
        html: String.raw`<p>The parity of the term controls what it produces:</p>
        <ul>
          <li><b>Even-order ($x^2, x^4,\dots$):</b> a squarer rectifies. $\cos^2$ produces a DC term (it never goes negative) and an even harmonic $2f$. Even-order distortion therefore creates <b>DC + even harmonics</b> and no term back on the fundamental. It is the mechanism behind self-mixing, DC offsets in direct-conversion receivers, and 2nd-harmonic spurs.</li>
          <li><b>Odd-order ($x^3, x^5,\dots$):</b> $\cos^3$ produces an odd harmonic $3f$ <i>and</i> a term at the fundamental. When $a_3$ is negative (the usual compressive case), that fundamental term <b>subtracts</b> from the wanted signal as amplitude grows, so the effective gain <b>drops at high input</b> — this is <b>gain compression</b>, quantified by the 1-dB compression point ($P_{1dB}$).</li>
        </ul>
        <p><b>Symmetry link:</b> a device with an <b>odd-symmetric</b> transfer curve ($y(-x)=-y(x)$, e.g. a differential pair) cancels all even-order terms, leaving only odd harmonics — which is exactly why differential and push-pull stages suppress even harmonics. A <b>clipping/square-wave</b> waveform is odd-symmetric and so contains <b>only odd harmonics</b> ($f, 3f, 5f,\dots$).</p>
        <div class="callout tip"><b>Design consequence:</b> pick the topology for the harmonics you fear. Differential kills even order (great for 2nd-harmonic-sensitive links); but odd order — and hence compression and IM3 — survives, so you still need back-off or filtering.</div>`
      },
      {
        h: 'Total Harmonic Distortion (THD)',
        html: String.raw`<p><b>THD</b> collapses the whole harmonic comb into one number: the RMS sum of all harmonic amplitudes relative to the fundamental,</p>
        <p>$$\mathrm{THD}=\frac{\sqrt{V_2^2+V_3^2+V_4^2+\dots}}{V_1},$$</p>
        <p>where $V_1$ is the fundamental amplitude and $V_n$ the $n$-th harmonic. It is reported either as a percentage or in dB ($20\log_{10}\mathrm{THD}$). A related figure, <b>THD+N</b>, folds noise into the numerator as well.</p>
        <p>Reading THD:</p>
        <ul>
          <li>A single strong harmonic dominates the sum, so THD is usually set by $V_2$ or $V_3$.</li>
          <li>A 2nd-harmonic level of $-40$ dBc (i.e. $V_2/V_1=0.01$) with negligible higher harmonics gives $\mathrm{THD}\approx1\%$.</li>
          <li>Because harmonic amplitudes climb faster than the fundamental with drive level, <b>THD worsens as you push the device harder</b> — the same trend that produces compression.</li>
        </ul>
        <div class="callout tip"><b>Watch the reference:</b> "dBc" is dB relative to the carrier (the fundamental). A harmonic at $-50$ dBc is $10^{-2.5}\approx0.32\%$ of the fundamental in amplitude — convert carefully between dBc, percent, and voltage ratio.</div>`
      },
      {
        h: 'Harmonic content of clipped and square waves',
        html: String.raw`<p>Drive a device hard enough and it clips; in the limit the output becomes a <b>square wave</b>. A 50%-duty square wave of amplitude $V$ has the Fourier series</p>
        <p>$$v(t)=\frac{4V}{\pi}\left(\sin\omega t+\tfrac13\sin 3\omega t+\tfrac15\sin 5\omega t+\dots\right),$$</p>
        <p>i.e. <b>only odd harmonics</b>, with the $n$-th harmonic amplitude falling as $1/n$. This is the extreme end of odd-order distortion: hard, symmetric clipping is odd-symmetric, so all even harmonics vanish and the spectrum is a slowly-decaying odd comb.</p>
        <p>Consequences:</p>
        <ul>
          <li>The 3rd harmonic of a square wave sits at $\tfrac13$ the fundamental amplitude, i.e. about $-9.5$ dBc — enormous compared with a well-behaved amplifier.</li>
          <li>Class-D / switching stages exploit this: a filter after the switch recovers the fundamental. The same math warns that any accidental clipping sprays strong odd harmonics across the band.</li>
          <li>A <b>triangle</b> wave also has only odd harmonics but they fall as $1/n^2$ — smoother, so much lower harmonic content than a square wave.</li>
        </ul>
        <div class="callout tip"><b>Rule of thumb:</b> symmetric hard clipping ⇒ odd harmonics only; asymmetric clipping ⇒ even harmonics appear too. The harmonic pattern in a spectrum analyzer plot tells you <i>how</i> the device is misbehaving.</div>`
      },
      {
        h: 'Why harmonics matter: emissions, desense, and filtering',
        html: String.raw`<p>Harmonics are not a lab curiosity — they drive real system constraints:</p>
        <ul>
          <li><b>Spurious emissions:</b> a transmitter's 2nd and 3rd harmonics can land in other licensed bands. Regulatory masks (FCC/ETSI) set hard limits, so the PA is always followed by an <b>output/harmonic low-pass filter</b> that passes $f$ and rejects $2f, 3f,\dots$</li>
          <li><b>Receiver desensitization (desense):</b> a strong out-of-band carrier can drive the LNA/mixer into compression, so the wanted signal's gain drops and its noise rises — the receiver goes "deaf." This is the same $a_3$ compression seen from the receive side.</li>
          <li><b>Harmonic mixing:</b> a mixer's LO harmonics let unwanted RF frequencies convert onto the IF, creating spurious responses — again fixed with pre-selection filtering.</li>
        </ul>
        <p><b>Filtering strategy:</b> because harmonics live at $2f, 3f,\dots$ — well above $f$ — a low-pass (or band-pass) filter separates them cleanly, unlike two-tone intermod products that can fall in-band. This is why single-tone harmonics are the "easy" distortion: you can filter them. The hard problem — third-order intermodulation, which lands next to the wanted signal — is the sequel to this topic.</p>
        <div class="callout tip"><b>The bridge to IP3:</b> the very $a_3 x^3$ term that makes the 3rd harmonic and compresses gain here also makes the two-tone IM3 products that define the third-order intercept point. Harmonics are the single-tone face of the same nonlinearity.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Origin:</b> only a nonlinear device ($y=a_1x+a_2x^2+a_3x^3+\dots$) creates harmonics; a single tone at $f$ produces a comb at $2f,3f,4f,\dots$, with the $n$-th harmonic amplitude scaling as $A^n$ (slope $n$ in dB).</li>
<li><b>Even vs odd:</b> even-order ($x^2$) squares/rectifies → DC + even harmonics, no fundamental term; odd-order ($x^3$) → odd harmonics <i>and</i> a fundamental term that (for $a_3<0$) causes gain compression and sets $P_{1dB}$.</li>
<li><b>THD:</b> $\mathrm{THD}=\sqrt{V_2^2+V_3^2+\dots}/V_1$; it worsens with drive level and is usually dominated by the largest single harmonic.</li>
<li><b>Clipping:</b> symmetric hard clipping (square wave) contains only odd harmonics falling as $1/n$; asymmetric clipping adds even harmonics.</li>
<li><b>Why it matters:</b> harmonics cause spurious emissions and receiver desense and are removed with output/harmonic low-pass filtering — and the same $a_3$ term is exactly what leads into two-tone intermod and the third-order intercept.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`Only a nonlinear device creates harmonics: $y=a_1x+a_2x^2+a_3x^3+\dots$ turns a tone at $f$ into a comb at $f,2f,3f,\dots$`,
      String.raw`The $n$-th harmonic amplitude scales as $A^n$ (and as $a_n$): +6 dB of input raises the 2nd harmonic by +12 dB, the 3rd by +18 dB.`,
      String.raw`Even-order ($x^2$): $\cos^2=\tfrac12+\tfrac12\cos2\omega t$ → DC + 2nd harmonic, no term back on the fundamental (self-mixing, DC offset).`,
      String.raw`Odd-order ($x^3$): $\cos^3=\tfrac34\cos\omega t+\tfrac14\cos3\omega t$ → 3rd harmonic plus a fundamental term that compresses gain when $a_3<0$.`,
      String.raw`Gain compression from the $a_3x^3$ term is quantified by the 1-dB compression point $P_{1dB}$.`,
      String.raw`THD $=\sqrt{V_2^2+V_3^2+V_4^2+\dots}/V_1$; it grows with drive level and is dominated by the largest harmonic.`,
      String.raw`Symmetric hard clipping (square wave) contains only odd harmonics with amplitudes $\propto 1/n$; the 3rd harmonic is at $\tfrac13$ ($\approx-9.5$ dBc).`,
      String.raw`Odd-symmetric topologies (differential/push-pull) cancel even harmonics, leaving odd order (and hence compression/IM3).`,
      String.raw`Harmonics cause spurious emissions and receiver desense; an output/harmonic low-pass filter rejects $2f,3f,\dots$ while passing $f$.`,
      String.raw`Harmonics are the single-tone face of nonlinearity; the same $a_3$ term produces two-tone IM3 and defines the third-order intercept (IP3).`
    ],
    equations: [
      {
        title: 'Second and third harmonic amplitudes from the power series',
        tex: String.raw`$$V_2=\tfrac12 a_2 A^2,\qquad V_3=\tfrac14 a_3 A^3$$`,
        derivation: String.raw`<p><b>Where we start.</b> A nonlinear device is modeled by its transfer characteristic expanded as a power series about the bias point, $y=a_1x+a_2x^2+a_3x^3+\dots$ We drive it with a single tone $x(t)=A\cos\omega t$ and ask what frequencies appear and with what amplitudes.</p>
        <p><b>Step 1 — substitute the tone into each term.</b> With $x=A\cos\omega t$ the first three terms are</p>
        $$a_1 A\cos\omega t + a_2 A^2\cos^2\omega t + a_3 A^3\cos^3\omega t.$$
        <p><b>Step 2 — expand the squared term with the power-reduction identity.</b> Using $\cos^2\theta=\tfrac12+\tfrac12\cos2\theta$,</p>
        $$a_2 A^2\cos^2\omega t=\tfrac12 a_2 A^2+\tfrac12 a_2 A^2\cos 2\omega t.$$
        <p>This is a DC term plus a component at $2\omega$: the <b>2nd harmonic</b> has amplitude $V_2=\tfrac12 a_2 A^2$.</p>
        <p><b>Step 3 — expand the cubed term.</b> Using $\cos^3\theta=\tfrac34\cos\theta+\tfrac14\cos3\theta$,</p>
        $$a_3 A^3\cos^3\omega t=\tfrac34 a_3 A^3\cos\omega t+\tfrac14 a_3 A^3\cos 3\omega t.$$
        <p>The $3\omega$ term is the <b>3rd harmonic</b> with amplitude $V_3=\tfrac14 a_3 A^3$; the $\cos\omega t$ piece adds to the fundamental.</p>
        <p><b>Result.</b> $$V_2=\tfrac12 a_2 A^2,\qquad V_3=\tfrac14 a_3 A^3.$$ Sanity check: the $n$-th harmonic amplitude scales as $A^n$, so on a log–log plot the 2nd harmonic rises with slope 2 and the 3rd with slope 3 — a hallmark used to identify harmonic order on a spectrum analyzer.</p>`
      },
      {
        title: 'Definition of Total Harmonic Distortion',
        tex: String.raw`$$\mathrm{THD}=\frac{\sqrt{\sum_{n\ge 2} V_n^2}}{V_1}$$`,
        derivation: String.raw`<p><b>Where we start.</b> After passing a pure tone through a nonlinear device we measure a fundamental $V_1$ at $f$ and a set of harmonics $V_2,V_3,\dots$ at $2f,3f,\dots$ We want one number that captures how corrupted the signal is.</p>
        <p><b>Step 1 — total harmonic power.</b> Distinct harmonics are orthogonal over a period, so their powers add. The total power carried by the harmonics (everything except the fundamental) is proportional to</p>
        $$P_{harm}\propto V_2^2+V_3^2+V_4^2+\dots=\sum_{n\ge2}V_n^2.$$
        <p><b>Step 2 — normalize to the fundamental.</b> Distortion should be a relative quantity, so divide by the fundamental power $\propto V_1^2$. Taking the square root converts the power ratio to an amplitude (RMS) ratio:</p>
        $$\mathrm{THD}=\sqrt{\frac{\sum_{n\ge2}V_n^2}{V_1^2}}=\frac{\sqrt{\sum_{n\ge2}V_n^2}}{V_1}.$$
        <p><b>Step 3 — express in convenient units.</b> As a percentage, $\mathrm{THD}\%=100\times\mathrm{THD}$; in decibels, $\mathrm{THD}_{dB}=20\log_{10}\mathrm{THD}$. If noise is folded into the numerator the metric becomes THD+N.</p>
        <p><b>Result.</b> $$\mathrm{THD}=\frac{\sqrt{V_2^2+V_3^2+V_4^2+\dots}}{V_1}.$$ Sanity check: a device with only a single 2nd harmonic at $-40$ dBc has $V_2/V_1=0.01$, so $\mathrm{THD}=1\%$ — dominated, as usual, by the largest single harmonic.</p>`
      },
      {
        title: 'Gain compression and the 1-dB compression point',
        tex: String.raw`$$G(A)=a_1+\tfrac34 a_3 A^2\quad(a_3<0)$$`,
        derivation: String.raw`<p><b>Where we start.</b> From the single-tone expansion, the cubic term $a_3x^3$ contributes not only a 3rd harmonic but also a component <i>at the fundamental frequency</i>. We collect everything at $\omega$ to find the effective gain and how it falls with drive level.</p>
        <p><b>Step 1 — gather all fundamental-frequency terms.</b> The linear term gives $a_1 A\cos\omega t$; from Step 3 above the cubic term contributes $\tfrac34 a_3 A^3\cos\omega t$. Adding them, the total amplitude at $\omega$ is</p>
        $$V_1=a_1 A+\tfrac34 a_3 A^3=\left(a_1+\tfrac34 a_3 A^2\right)A.$$
        <p><b>Step 2 — read off the amplitude-dependent gain.</b> The effective voltage gain is</p>
        $$G(A)=\frac{V_1}{A}=a_1+\tfrac34 a_3 A^2.$$
        <p>For a compressive device $a_3<0$, so as $A$ grows the second term subtracts and the gain <b>drops below</b> the small-signal value $a_1$ — this is gain compression.</p>
        <p><b>Step 3 — define $P_{1dB}$.</b> The 1-dB compression point is the input (or output) level at which $G$ has fallen by 1 dB from $a_1$:</p>
        $$20\log_{10}\!\frac{G(A_{1dB})}{a_1}=-1\ \text{dB}\;\Rightarrow\;\left|\tfrac34\frac{a_3}{a_1}A_{1dB}^2\right|\approx0.109.$$
        <p><b>Result.</b> $$G(A)=a_1+\tfrac34 a_3 A^2,\quad a_3<0.$$ Sanity check: at small $A$ the correction vanishes and $G\to a_1$ (linear); the same $a_3$ that compresses gain here is the term that, with two tones, produces the IM3 products defining IP3 — tying harmonics, compression, and intercept to one coefficient.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is a harmonic?`, back: String.raw`A spectral component at an integer multiple of a fundamental frequency $f$ — i.e. energy at $2f, 3f, 4f,\dots$ created when a tone passes through a nonlinear device.` },
      { front: String.raw`Why can't a linear device create harmonics?`, back: String.raw`A linear device ($y=a_1x$) only scales and delays a sinusoid, which leaves it at the same frequency. Creating a new frequency requires a curved (nonlinear) transfer characteristic.` },
      { front: String.raw`Which power-series term makes the 2nd harmonic, and what else does it make?`, back: String.raw`The $a_2x^2$ term: $\cos^2=\tfrac12+\tfrac12\cos2\omega t$, giving a 2nd harmonic at $2f$ plus a DC term. It adds nothing back at the fundamental.` },
      { front: String.raw`Which term makes the 3rd harmonic, and its side effect?`, back: String.raw`The $a_3x^3$ term: $\cos^3=\tfrac34\cos\omega t+\tfrac14\cos3\omega t$, giving a 3rd harmonic at $3f$ and a fundamental-frequency term that (for $a_3<0$) compresses gain.` },
      { front: String.raw`How does the $n$-th harmonic amplitude scale with input amplitude $A$?`, back: String.raw`As $A^n$: on a dB plot the $n$-th harmonic has slope $n$. Raising input by 6 dB raises the 2nd harmonic by 12 dB and the 3rd by 18 dB.` },
      { front: String.raw`Define THD.`, back: String.raw`$\mathrm{THD}=\sqrt{V_2^2+V_3^2+V_4^2+\dots}/V_1$ — the RMS sum of all harmonic amplitudes relative to the fundamental, reported as a percentage or in dB.` },
      { front: String.raw`Even-order vs odd-order distortion: what does each produce?`, back: String.raw`Even-order ($x^2$) squares/rectifies → DC + even harmonics, no fundamental term. Odd-order ($x^3$) → odd harmonics plus a fundamental term (source of gain compression).` },
      { front: String.raw`What harmonics does a symmetric square wave contain?`, back: String.raw`Only odd harmonics: $v=\tfrac{4V}{\pi}(\sin\omega t+\tfrac13\sin3\omega t+\tfrac15\sin5\omega t+\dots)$, amplitudes falling as $1/n$.` },
      { front: String.raw`What is gain compression / $P_{1dB}$?`, back: String.raw`As drive rises, the $a_3x^3$ term (with $a_3<0$) subtracts from the fundamental, so gain falls. $P_{1dB}$ is the level where gain has dropped 1 dB below the small-signal value.` },
      { front: String.raw`Why do differential/push-pull stages suppress even harmonics?`, back: String.raw`They have an odd-symmetric transfer curve ($y(-x)=-y(x)$), which cancels all even-order terms — leaving only odd harmonics (and compression/IM3).` },
      { front: String.raw`What is dBc, and what is a $-40$ dBc harmonic as a ratio?`, back: String.raw`dBc = dB relative to the carrier (fundamental). $-40$ dBc means the harmonic is $10^{-40/20}=0.01$ (1%) of the fundamental amplitude.` },
      { front: String.raw`Why are single-tone harmonics easier to remove than IM3 products?`, back: String.raw`Harmonics land at $2f,3f,\dots$ — far above $f$ — so a low-pass/harmonic filter rejects them. Two-tone IM3 products fall right next to the wanted signal and can't be filtered out.` },
      { front: String.raw`Name two system problems harmonics cause.`, back: String.raw`Spurious emissions (a transmitter's harmonics violate regulatory masks) and receiver desensitization (a strong carrier compresses the front end).` }
    ],
    mcqs: [
      { q: String.raw`A single tone at frequency $f$ passes through a nonlinear device. What appears at the output?`, options: [String.raw`Only the tone at $f$`, String.raw`Tones at $f, 2f, 3f, \dots$ (a harmonic comb)`, String.raw`A tone at $f/2$`, String.raw`Broadband white noise only`], answer: 1, explain: String.raw`Nonlinearity ($y=a_1x+a_2x^2+\dots$) generates integer multiples of the input frequency: $f, 2f, 3f,\dots$` },
      { q: String.raw`Which power-series term generates the 2nd harmonic and a DC component?`, options: [String.raw`$a_1x$`, String.raw`$a_2x^2$`, String.raw`$a_3x^3$`, String.raw`$a_5x^5$`], answer: 1, explain: String.raw`$\cos^2\theta=\tfrac12+\tfrac12\cos2\theta$, so $a_2x^2$ yields DC plus a $2f$ component.` },
      { q: String.raw`The $a_3x^3$ term does which two things to a single tone?`, options: [String.raw`Makes only a 3rd harmonic`, String.raw`Makes a 3rd harmonic and adds a term at the fundamental`, String.raw`Makes only DC`, String.raw`Makes a 2nd harmonic and DC`], answer: 1, explain: String.raw`$\cos^3\theta=\tfrac34\cos\theta+\tfrac14\cos3\theta$: a $3f$ term plus a fundamental term (the seed of gain compression).` },
      { q: String.raw`If the input amplitude rises by 6 dB, by how much does the 3rd harmonic rise?`, options: [String.raw`6 dB`, String.raw`12 dB`, String.raw`18 dB`, String.raw`3 dB`], answer: 2, explain: String.raw`The 3rd harmonic scales as $A^3$, so it rises 3× as fast in dB: $3\times6=18$ dB.` },
      { q: String.raw`Total Harmonic Distortion is defined as:`, options: [String.raw`$V_1/\sqrt{V_2^2+V_3^2+\dots}$`, String.raw`$\sqrt{V_2^2+V_3^2+\dots}/V_1$`, String.raw`$V_2/V_1$ only`, String.raw`$V_1+V_2+V_3+\dots$`], answer: 1, explain: String.raw`THD is the RMS sum of the harmonics divided by the fundamental amplitude $V_1$.` },
      { q: String.raw`Even-order distortion (the $x^2$ term) primarily produces:`, options: [String.raw`Odd harmonics and gain expansion`, String.raw`DC plus even harmonics, no fundamental term`, String.raw`A 3rd harmonic`, String.raw`Only phase noise`], answer: 1, explain: String.raw`Squaring rectifies: $\cos^2=\tfrac12+\tfrac12\cos2\omega t$ gives DC and $2f$, with nothing back at the fundamental.` },
      { q: String.raw`Gain compression ($P_{1dB}$) arises mainly from:`, options: [String.raw`The $a_2x^2$ term`, String.raw`The $a_3x^3$ term with $a_3<0$`, String.raw`The linear $a_1x$ term`, String.raw`Thermal noise`], answer: 1, explain: String.raw`The cubic term adds $\tfrac34a_3A^3$ at the fundamental; with $a_3<0$ this subtracts, lowering gain as drive rises.` },
      { q: String.raw`A symmetric (50% duty) square wave contains:`, options: [String.raw`Only even harmonics`, String.raw`Only odd harmonics, falling as $1/n$`, String.raw`All harmonics equally`, String.raw`No harmonics`], answer: 1, explain: String.raw`$v=\tfrac{4V}{\pi}(\sin\omega t+\tfrac13\sin3\omega t+\dots)$ — odd harmonics only, amplitudes $\propto1/n$.` },
      { q: String.raw`Why do differential (push-pull) amplifiers suppress even harmonics?`, options: [String.raw`They add a low-pass filter`, String.raw`Their odd-symmetric transfer curve cancels even-order terms`, String.raw`They increase $a_2$`, String.raw`They operate at higher frequency`], answer: 1, explain: String.raw`An odd-symmetric characteristic $y(-x)=-y(x)$ has no even-power terms, so even harmonics cancel.` },
      { q: String.raw`A harmonic measured at $-40$ dBc corresponds to what amplitude ratio to the fundamental?`, options: [String.raw`$0.1$`, String.raw`$0.01$`, String.raw`$0.001$`, String.raw`$0.5$`], answer: 1, explain: String.raw`$10^{-40/20}=10^{-2}=0.01$, i.e. 1% of the fundamental amplitude.` },
      { q: String.raw`Why are single-tone harmonics easier to remove than two-tone IM3 products?`, options: [String.raw`They are smaller`, String.raw`They fall at $2f,3f,\dots$, far from $f$, so a filter rejects them`, String.raw`They are noise, not tones`, String.raw`They occur only at low power`], answer: 1, explain: String.raw`Harmonics sit well above the fundamental and are filtered by a low-pass; IM3 products land in-band next to the signal.` },
      { q: String.raw`A transmitter is followed by a harmonic low-pass filter primarily to:`, options: [String.raw`Increase output power`, String.raw`Meet spurious-emission masks by rejecting $2f, 3f,\dots$`, String.raw`Improve noise figure`, String.raw`Add gain at the fundamental`], answer: 1, explain: String.raw`The filter passes $f$ and attenuates harmonics so the transmitter meets regulatory spurious-emission limits.` }
    ],
    numericals: [
      { q: String.raw`A 2.4 GHz tone drives a nonlinear amplifier. (a) List the first five harmonic frequencies. (b) Which of these fall inside the 5–6 GHz band?`, solution: String.raw`<p><b>Formula.</b> The $n$-th harmonic of a fundamental $f$ is $$f_n=n\,f,\qquad n=1,2,3,\dots$$ The fundamental itself is $n=1$; harmonics are $n\ge2$.</p>
<p><b>Substitute.</b> With $f=2.4$ GHz: $f_1=1\times2.4$, $f_2=2\times2.4$, $f_3=3\times2.4$, $f_4=4\times2.4$, $f_5=5\times2.4$ GHz.</p>
<p><b>Compute.</b> $f_1=2.4$ GHz (fundamental), $f_2=4.8$ GHz, $f_3=7.2$ GHz, $f_4=9.6$ GHz, $f_5=12.0$ GHz. Of these, none of the harmonics land inside 5–6 GHz (the 2nd is 4.8 GHz, just below; the 3rd is 7.2 GHz, above).</p>
<p><b>Explanation.</b> Harmonics march in equal 2.4 GHz steps, so they are widely spaced from the fundamental and from each other — which is exactly why a low-pass filter can strip them. Note the 2nd harmonic at 4.8 GHz sits close to the 5 GHz Wi-Fi band, a classic reason a 2.4 GHz radio needs good 2nd-harmonic rejection.</p>` },
      { q: String.raw`An amplifier output has fundamental $V_1=1.0$ V, and harmonics $V_2=0.05$ V, $V_3=0.03$ V, $V_4=0.01$ V. Find the THD in percent and in dB.`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{THD}=\frac{\sqrt{V_2^2+V_3^2+V_4^2+\dots}}{V_1},\qquad \mathrm{THD}_{dB}=20\log_{10}\mathrm{THD}.$$</p>
<p><b>Substitute.</b> $$\mathrm{THD}=\frac{\sqrt{0.05^2+0.03^2+0.01^2}}{1.0}.$$</p>
<p><b>Compute.</b> $0.05^2=0.0025$, $0.03^2=0.0009$, $0.01^2=0.0001$; sum $=0.0035$. $\sqrt{0.0035}=0.05916$. So $\mathrm{THD}=0.0592=5.92\%$, and $\mathrm{THD}_{dB}=20\log_{10}(0.0592)=-24.6$ dB.</p>
<p><b>Explanation.</b> The 2nd harmonic dominates the RMS sum (its square is by far the largest), so THD is set mainly by $V_2$. About 5.9% is quite high — typical of an amplifier pushed toward compression; a linear stage would show a fraction of a percent.</p>` },
      { q: String.raw`A transmitter fundamental is $+30$ dBm and its 2nd harmonic is $+30$ dBm $-45$ dB $=-15$ dBm. (a) State the 2nd-harmonic level in dBc. (b) A spec requires harmonics below $-60$ dBm; how much filter attenuation at $2f$ is needed?`, solution: String.raw`<p><b>Formula.</b> Level in dBc is relative to the carrier: $$\text{dBc}=P_{harm,dBm}-P_{fund,dBm}.$$ Required filter attenuation to meet an absolute spec: $$A_{req}=P_{harm,dBm}-P_{spec,dBm}.$$</p>
<p><b>Substitute.</b> (a) $\text{dBc}=(-15)-(+30)$. (b) $A_{req}=(-15)-(-60)$ dB.</p>
<p><b>Compute.</b> (a) $\text{dBc}=-45$ dBc — the 2nd harmonic is 45 dB below the carrier. (b) $A_{req}=-15+60=45$ dB of attenuation at $2f$.</p>
<p><b>Explanation.</b> The harmonic is 45 dB below the carrier but only 45 dB above the $-60$ dBm limit, so we need 45 dB of low-pass rejection at the 2nd-harmonic frequency (while passing the fundamental). This drives the order and cutoff of the output filter — a real transmitter design constraint.</p>` },
      { q: String.raw`A device is driven into hard symmetric clipping, approximating a square wave of amplitude $V=1$ V. Find the amplitudes of the fundamental and the 3rd harmonic, and the 3rd-harmonic level in dBc.`, solution: String.raw`<p><b>Formula.</b> A 50%-duty square wave of amplitude $V$ has the Fourier series $$v(t)=\frac{4V}{\pi}\left(\sin\omega t+\tfrac13\sin3\omega t+\tfrac15\sin5\omega t+\dots\right),$$ so the $n$-th (odd) harmonic amplitude is $V_n=\dfrac{4V}{\pi n}$.</p>
<p><b>Substitute.</b> Fundamental ($n=1$): $V_1=\dfrac{4(1)}{\pi}$. Third harmonic ($n=3$): $V_3=\dfrac{4(1)}{3\pi}$. Level in dBc: $20\log_{10}(V_3/V_1)$.</p>
<p><b>Compute.</b> $V_1=4/\pi=1.273$ V, $V_3=4/(3\pi)=0.424$ V. Ratio $V_3/V_1=1/3=0.333$, so the 3rd harmonic is $20\log_{10}(0.333)=-9.5$ dBc.</p>
<p><b>Explanation.</b> Hard clipping is odd-symmetric, so only odd harmonics appear, and the 3rd is only about 9.5 dB below the fundamental — enormous compared with a well-behaved amplifier at $-40$ to $-60$ dBc. This is why accidental clipping is a serious spectral-purity problem and why switching stages must be filtered.</p>` },
      { q: String.raw`An amplifier has small-signal voltage gain coefficient $a_1=10$ and $a_3=-0.5$ (with $a_2\approx0$). At input amplitude $A=1.0$ V, find the effective gain, and by how many dB it has compressed from the small-signal value.`, solution: String.raw`<p><b>Formula.</b> Collecting fundamental-frequency terms, the amplitude-dependent gain is $$G(A)=a_1+\tfrac34 a_3 A^2,$$ and the compression relative to small signal is $$\Delta G_{dB}=20\log_{10}\!\frac{G(A)}{a_1}.$$</p>
<p><b>Substitute.</b> $$G=10+\tfrac34(-0.5)(1.0)^2,\qquad \Delta G_{dB}=20\log_{10}\!\frac{G}{10}.$$</p>
<p><b>Compute.</b> $\tfrac34\times(-0.5)=-0.375$, so $G=10-0.375=9.625$. Then $\Delta G_{dB}=20\log_{10}(9.625/10)=20\log_{10}(0.9625)=-0.332$ dB.</p>
<p><b>Explanation.</b> With $a_3<0$ the cubic term subtracts from the fundamental, dropping gain from 10 to 9.625 — about 0.33 dB of compression at this level. Push $A$ higher and the $A^2$ dependence quickly reaches the 1-dB compression point $P_{1dB}$; the same $a_3$ that compresses gain here also sets the third-order intermodulation and IP3.</p>` }
    ],
    realWorld: String.raw`<p>Harmonic control shapes real hardware everywhere in the RF chain. Every transmitter — from a phone's PA to a broadcast station — ends in an <b>output/harmonic low-pass filter</b> so its 2nd and 3rd harmonics stay under FCC/ETSI spurious-emission masks; a 2.4 GHz radio, for instance, must keep its 4.8 GHz 2nd harmonic from splattering into the 5 GHz Wi-Fi band. On the receive side, a strong out-of-band carrier can drive an <a href="#lna">LNA</a> or <a href="#mixer">mixer</a> into gain compression and <b>desensitize</b> the front end, which is why pre-selection <a href="#filters">filters</a> and adequate back-off matter. Switching power stages (Class-D audio, DC–DC converters) deliberately generate square waves rich in odd harmonics and then filter back to the fundamental. Audio and instrumentation gear quote <b>THD</b> (or THD+N) as a headline linearity spec. And the single-tone harmonic picture here is the direct on-ramp to two-tone intermodulation: the same $a_3$ nonlinearity that makes the 3rd harmonic defines the <a href="#third-order-intercept">third-order intercept point</a> that dominates receiver dynamic-range budgets.</p>`,
    related: ['third-order-intercept', 'mixer', 'lna', 'filters', 'lpf']
  }
);
