// Low-Pass Filter (LPF) — deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'lpf',
    title: 'Low-Pass Filter (LPF)',
    category: 'Filters',
    tags: ['low-pass', 'cutoff', 'RC', 'roll-off', 'anti-aliasing', 'Sallen-Key'],
    summary: String.raw`A low-pass filter passes signal components from DC up to a cutoff frequency $f_c$ and progressively attenuates everything above it, making it the workhorse for anti-aliasing before an ADC, reconstruction after a DAC, and general noise smoothing and band-limiting.`,
    diagram: [
      {
        title: String.raw`RC low-pass circuit and its magnitude response`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr-lpf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">RC low-pass: series R, shunt C, output across C</text>
          <line x1="20" y1="70" x2="70" y2="70" stroke="#9aa7b5"/>
          <text x="34" y="62" fill="#9aa7b5" font-size="10">V_in</text>
          <rect x="70" y="60" width="60" height="20" rx="6" fill="#1c232e" stroke="#4dabf7"/>
          <text x="100" y="74" fill="#e6edf3" text-anchor="middle">R</text>
          <line x1="130" y1="70" x2="200" y2="70" stroke="#9aa7b5"/>
          <line x1="200" y1="70" x2="200" y2="120" stroke="#9aa7b5"/>
          <rect x="185" y="120" width="30" height="16" rx="4" fill="#1c232e" stroke="#63e6be"/>
          <text x="235" y="132" fill="#e6edf3">C</text>
          <line x1="200" y1="136" x2="200" y2="160" stroke="#9aa7b5"/>
          <line x1="180" y1="160" x2="220" y2="160" stroke="#9aa7b5"/>
          <line x1="200" y1="70" x2="270" y2="70" stroke="#9aa7b5" marker-end="url(#arr-lpf)"/>
          <text x="250" y="62" fill="#ffa94d" font-size="10">V_out</text>
          <text x="330" y="196" fill="#9aa7b5" font-size="10" text-anchor="middle">f (log)</text>
          <line x1="310" y1="60" x2="310" y2="170" stroke="#9aa7b5"/>
          <line x1="310" y1="170" x2="520" y2="170" stroke="#9aa7b5"/>
          <path d="M310,80 L410,80 L510,150" stroke="#4dabf7" fill="none" stroke-width="2"/>
          <line x1="410" y1="60" x2="410" y2="170" stroke="#b197fc" stroke-dasharray="4 3"/>
          <text x="410" y="188" fill="#b197fc" font-size="10" text-anchor="middle">f_c</text>
          <text x="360" y="74" fill="#63e6be" font-size="10">passband (flat)</text>
          <text x="470" y="120" fill="#ffa94d" font-size="10" text-anchor="middle">-20 dB/dec</text>
          <text x="322" y="94" fill="#9aa7b5" font-size="9">-3 dB at f_c</text>
        </svg>`,
        caption: String.raw`A series resistor and shunt capacitor form the simplest low-pass: below $f_c$ the capacitor is a high impedance and the output tracks the input (flat passband), while above $f_c$ the capacitor shunts signal to ground so the response rolls off at −20 dB/decade, passing through −3 dB exactly at $f_c$.`
      },
      {
        title: String.raw`1st vs 2nd vs 4th-order roll-off`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr2-lpf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Order sets the stopband slope (20 dB/decade per pole)</text>
          <line x1="70" y1="40" x2="70" y2="175" stroke="#9aa7b5"/>
          <line x1="70" y1="175" x2="510" y2="175" stroke="#9aa7b5" marker-end="url(#arr2-lpf)"/>
          <text x="500" y="192" fill="#9aa7b5" font-size="10" text-anchor="middle">f (log)</text>
          <text x="40" y="60" fill="#9aa7b5" font-size="10">|H| dB</text>
          <line x1="220" y1="40" x2="220" y2="175" stroke="#b197fc" stroke-dasharray="4 3"/>
          <text x="220" y="192" fill="#b197fc" font-size="10" text-anchor="middle">f_c</text>
          <path d="M70,60 L220,60 L470,130" stroke="#4dabf7" fill="none" stroke-width="2"/>
          <text x="480" y="128" fill="#4dabf7" font-size="10">1st (−20)</text>
          <path d="M70,60 L220,60 L400,175" stroke="#63e6be" fill="none" stroke-width="2"/>
          <text x="410" y="168" fill="#63e6be" font-size="10">2nd (−40)</text>
          <path d="M70,60 L220,60 L330,175" stroke="#ffa94d" fill="none" stroke-width="2"/>
          <text x="332" y="168" fill="#ffa94d" font-size="10">4th (−80)</text>
        </svg>`,
        caption: String.raw`Each pole adds 20 dB/decade to the stopband slope: a 1st-order filter rolls off at −20 dB/dec, a 2nd-order at −40 dB/dec, and a 4th-order at −80 dB/dec. Higher order gives a sharper transition (closer to the ideal brick wall) at the cost of more components, steeper phase, and possible passband ripple/overshoot.`
      },
      {
        title: String.raw`Anti-alias LPF placement in an ADC chain`,
        svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr3-lpf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Anti-aliasing LPF sits before the sampler</text>
          <text x="16" y="80" fill="#9aa7b5" font-size="10">signal</text>
          <line x1="52" y1="76" x2="82" y2="76" stroke="#9aa7b5" marker-end="url(#arr3-lpf)"/>
          <rect x="84" y="56" width="110" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
          <text x="139" y="74" fill="#e6edf3" text-anchor="middle">anti-alias</text>
          <text x="139" y="89" fill="#9aa7b5" font-size="9" text-anchor="middle">LPF, f_c &lt; f_s/2</text>
          <line x1="194" y1="76" x2="224" y2="76" stroke="#9aa7b5" marker-end="url(#arr3-lpf)"/>
          <rect x="226" y="56" width="90" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/>
          <text x="271" y="74" fill="#e6edf3" text-anchor="middle">S/H</text>
          <text x="271" y="89" fill="#9aa7b5" font-size="9" text-anchor="middle">sample f_s</text>
          <line x1="316" y1="76" x2="346" y2="76" stroke="#9aa7b5" marker-end="url(#arr3-lpf)"/>
          <rect x="348" y="56" width="90" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
          <text x="393" y="80" fill="#e6edf3" text-anchor="middle">ADC</text>
          <line x1="438" y1="76" x2="470" y2="76" stroke="#9aa7b5" marker-end="url(#arr3-lpf)"/>
          <text x="500" y="80" fill="#b197fc" font-size="11" text-anchor="middle">bits</text>
          <text x="270" y="140" fill="#9aa7b5" font-size="10" text-anchor="middle">Remove energy above f_s/2 BEFORE sampling — aliases cannot be undone afterward.</text>
        </svg>`,
        caption: String.raw`In a digitising chain the anti-aliasing low-pass filter must precede the sample-and-hold: it removes energy above the Nyquist frequency $f_s/2$ so that high-frequency content cannot fold down (alias) into the baseband. Because aliasing is irreversible once sampling has occurred, the LPF is a mandatory front-end block, not an optional one.`
      }
    ],
    prerequisites: ['filters', 'frequency-spectrum'],
    intro: String.raw`<p><b>Why does the low-pass filter exist?</b> Almost every real signal path carries energy you do not want at high frequencies — wideband thermal noise, switching spurs, out-of-band interferers, and (fatally for a digitiser) spectral content above half the sampling rate that will fold irreversibly into your band. You need a block that keeps the low-frequency information you care about and throws away the high-frequency energy you do not. That block is the low-pass filter. Without it there is no safe way to sample an analog signal, no way to reconstruct a smooth waveform from a DAC's staircase, and no way to strip wideband noise off a slowly varying measurement.</p>
<p>A <b>low-pass filter (LPF)</b> passes frequency components from DC up to a <b>cutoff frequency</b> $f_c$ and attenuates components above it. Mastering the LPF means understanding three things deeply: (1) its <b>transfer function</b> $H(j\omega)=1/(1+j\omega/\omega_c)$ and the <b>−3 dB cutoff</b> $f_c=1/(2\pi RC)$ that defines where the passband ends; (2) its <b>roll-off</b> of 20 dB/decade per pole and how filter <b>order</b> trades sharpness against complexity, phase, and ringing; and (3) its <b>time-domain</b> behaviour — the exponential step response and the rise time $t_r\approx 0.35/f_{3\mathrm{dB}}$ that ties the frequency and time views together.</p>`,
    sections: [
      {
        h: 'What a low-pass filter does and how it is realized',
        html: String.raw`<p>A low-pass filter is a two-port whose gain is (ideally) flat from DC up to a cutoff frequency $f_c$ and then falls off above it. In the ideal "brick-wall" abstraction the gain is 1 for $f<f_c$ and 0 for $f>f_c$; real filters approximate this with a smooth transition.</p>
        <p>Passive realizations use only R, L, and C:</p>
        <ul>
          <li><b>RC:</b> a series resistor and a shunt capacitor. The capacitor's impedance $1/(j\omega C)$ falls with frequency, shorting high-frequency signal to ground. Simplest, most common, single-pole.</li>
          <li><b>RL:</b> a series inductor (impedance $j\omega L$ rises with frequency) feeding a shunt resistor — also single-pole low-pass.</li>
          <li><b>LC:</b> an inductor and capacitor form a resonant, two-pole filter with a much sharper knee than RC, at the cost of possible peaking near $f_c$.</li>
        </ul>
        <p><b>Active</b> realizations add an op-amp. The classic unit cell is the <b>Sallen-Key</b> stage, a second-order section that provides gain, a low output impedance (so cascading does not load the previous stage), and independent control of cutoff and Q without bulky inductors. Cascading Sallen-Key sections builds high-order Butterworth, Chebyshev, or Bessel responses.</p>
        <div class="callout tip"><b>Intuition:</b> think of the capacitor in an RC low-pass as a frequency-controlled short. At low frequency it is an open circuit and the signal sails through the resistor untouched; at high frequency it becomes a near-short to ground, so the output collapses. The cutoff is simply where the capacitor's impedance equals the resistor's.</div>`
      },
      {
        h: 'The transfer function and the −3 dB cutoff',
        html: String.raw`<p>For the RC low-pass, the output is the voltage divider between $R$ and the capacitor impedance $Z_C=1/(j\omega C)$:</p>
        <p>$$H(j\omega)=\frac{Z_C}{R+Z_C}=\frac{1/(j\omega C)}{R+1/(j\omega C)}=\frac{1}{1+j\omega RC}.$$</p>
        <p>Defining the cutoff angular frequency $\omega_c=1/RC$, this is the canonical single-pole low-pass form</p>
        <p>$$H(j\omega)=\frac{1}{1+j\,\omega/\omega_c}.$$</p>
        <p>Its magnitude is $|H|=1/\sqrt{1+(\omega/\omega_c)^2}$. At $\omega=\omega_c$ the magnitude is $1/\sqrt{2}\approx 0.707$, i.e. $-3$ dB, and the power is halved — which is exactly why $f_c$ is called the <b>−3 dB (half-power) cutoff</b>:</p>
        <p>$$f_c=\frac{\omega_c}{2\pi}=\frac{1}{2\pi RC}.$$</p>
        <p>At the cutoff the phase is $-45^\circ$; far below it approaches $0^\circ$ and far above it approaches $-90^\circ$ (for one pole). The filter therefore introduces <b>phase lag</b> that grows through the transition band — important whenever waveform shape or loop stability matters.</p>
        <div class="callout tip"><b>Intuition:</b> the cutoff is where $|Z_C|=R$. Setting $1/(\omega C)=R$ gives $\omega=1/RC$ immediately — no algebra with square roots needed to remember where the knee sits.</div>`
      },
      {
        h: 'Roll-off, order, and filter families',
        html: String.raw`<p>Above cutoff a single-pole low-pass attenuates at <b>20 dB/decade</b> (equivalently 6 dB/octave): every tenfold increase in frequency costs a factor of 10 in amplitude. This slope is set by the number of poles — the filter <b>order</b> $n$:</p>
        <p>$$\text{stopband slope}=20n\ \text{dB/decade}.$$</p>
        <p>So a 2nd-order filter rolls off at 40 dB/dec, a 4th-order at 80 dB/dec, and so on. Higher order gives a sharper transition from passband to stopband, approaching the ideal brick wall, but needs more components and generally worse phase behaviour and transient ringing.</p>
        <p>Given a fixed order, the <b>response family</b> chooses how to spend the available sharpness:</p>
        <ul>
          <li><b>Butterworth:</b> maximally flat passband, monotonic — no ripple, moderate transition sharpness. The default "smooth" choice.</li>
          <li><b>Chebyshev:</b> allows ripple in the passband (Type I) to gain a sharper transition for the same order.</li>
          <li><b>Bessel:</b> maximally flat <i>group delay</i> (linear phase), preserving waveform shape at the cost of a gentle roll-off — ideal where transient fidelity matters.</li>
          <li><b>Elliptic (Cauer):</b> ripple in both bands, giving the steepest possible transition for a given order.</li>
        </ul>
        <div class="callout tip"><b>Intuition:</b> "order = poles = slope." If a spec says "reject a tone 40 dB down one decade past cutoff," you need a slope of 40 dB/decade, hence a 2nd-order filter — you can read the required order straight off the stopband requirement.</div>`
      },
      {
        h: 'Time-domain behaviour: step and rise time',
        html: String.raw`<p>The frequency and time pictures are two views of the same filter. Feed a step $V_{in}=V$ to an RC low-pass and the capacitor charges exponentially:</p>
        <p>$$v_{out}(t)=V\left(1-e^{-t/\tau}\right),\qquad \tau=RC.$$</p>
        <p>The time constant $\tau=RC$ is the reciprocal of the cutoff: $\tau=1/\omega_c=1/(2\pi f_c)$. A faster filter (higher $f_c$) has a smaller $\tau$ and reacts more quickly; a slower filter smooths more but lags.</p>
        <p>The <b>10%–90% rise time</b> of this exponential is $t_r=\tau\ln 9\approx 2.2\,\tau$. Substituting $\tau=1/(2\pi f_c)$ gives the famous engineering rule of thumb</p>
        <p>$$t_r\approx\frac{0.35}{f_{3\mathrm{dB}}}.$$</p>
        <p>This links bandwidth and speed directly: a 1 MHz-bandwidth channel cannot resolve edges faster than about 350 ns. Higher-order and Chebyshev/elliptic filters add <b>overshoot and ringing</b> to the step response (their poles are complex), while Bessel filters keep the step clean because their group delay is flat.</p>
        <div class="callout tip"><b>Intuition:</b> narrowing a filter to reject more noise necessarily slows its response. You cannot have both a very sharp edge in time and a very narrow bandwidth in frequency — the $t_r\approx 0.35/f_{3\mathrm{dB}}$ rule is the everyday face of the time–bandwidth trade.</div>`
      },
      {
        h: 'Anti-aliasing before an ADC',
        html: String.raw`<p>The most safety-critical use of a low-pass filter is <b>anti-aliasing</b>. Sampling at rate $f_s$ folds any energy above the Nyquist frequency $f_s/2$ down into the baseband, where it is indistinguishable from real signal and <b>cannot be removed after the fact</b>. An anti-aliasing LPF placed <i>before</i> the sampler attenuates everything above $f_s/2$ so nothing aliases.</p>
        <p>Design tension: an ideal brick-wall filter is impossible, so practical anti-alias filters need a finite transition band between the highest wanted frequency $f_{max}$ and $f_s/2$. Two ways to buy that room:</p>
        <ul>
          <li><b>Higher-order filter:</b> steeper roll-off lets you place $f_c$ closer to $f_s/2$.</li>
          <li><b>Oversampling:</b> sampling well above $2f_{max}$ opens a wide guard band, so a gentle (even 1st-order) analog filter suffices, and the sharp filtering is done digitally after the ADC and then decimated.</li>
        </ul>
        <p>The dual operation happens after a <b>DAC</b>: a <b>reconstruction (anti-imaging) filter</b> is a low-pass that removes the spectral images at multiples of $f_s$ from the DAC's staircase output, smoothing it into the intended continuous waveform.</p>
        <div class="callout tip"><b>Intuition:</b> aliasing is a one-way door. The anti-alias LPF is the only place you can stop out-of-band energy — once the sample-and-hold has fired, a folded tone looks exactly like a legitimate in-band tone and no later processing can separate them.</div>`
      },
      {
        h: 'Other uses: smoothing, band-limiting, and demodulation',
        html: String.raw`<p>Beyond sampling, low-pass filters appear wherever high-frequency energy must be suppressed:</p>
        <ul>
          <li><b>Noise smoothing:</b> a slowly varying sensor signal sits at low frequency while thermal/quantisation noise is spread across a wide band; a low-pass keeps the signal and integrates away much of the noise, improving SNR at the cost of response speed.</li>
          <li><b>Band-limiting / pulse shaping:</b> restricting a signal's bandwidth before transmission (e.g. limiting the occupied spectrum of a baseband data stream) so it fits a channel and does not interfere with neighbours.</li>
          <li><b>Demodulation:</b> in an envelope detector or an I/Q downconverter, a low-pass removes the doubled-frequency and sum terms produced by a mixer, leaving only the wanted baseband. This is why a low-pass follows almost every mixer.</li>
          <li><b>Power-supply and control loops:</b> a low-pass on a control voltage or a supply rail removes ripple and switching spurs.</li>
        </ul>
        <p>In each case the same two knobs govern the design: the cutoff $f_c$ sets where "wanted" ends and "unwanted" begins, and the order/family sets how sharply and cleanly the transition is made.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Transfer function and cutoff:</b> the single-pole low-pass is $H(j\omega)=1/(1+j\omega/\omega_c)$ with $|H(\omega_c)|=1/\sqrt2=-3$ dB, and for an RC the cutoff is $f_c=1/(2\pi RC)$ — the point where $|Z_C|=R$.</li>
<li><b>Roll-off and order:</b> the stopband slope is $20n$ dB/decade for an $n$-pole filter, so you can read the required order straight off a stopband attenuation spec.</li>
<li><b>Families:</b> Butterworth (flat), Chebyshev (sharper, passband ripple), Bessel (linear phase, clean step), elliptic (steepest) — the same order spent differently.</li>
<li><b>Time domain:</b> an RC step response is $V(1-e^{-t/RC})$ with $\tau=1/(2\pi f_c)$, giving the rule $t_r\approx 0.35/f_{3\mathrm{dB}}$ — bandwidth and edge speed are two views of one thing.</li>
<li><b>Why it matters:</b> anti-aliasing before an ADC (aliasing is irreversible), reconstruction after a DAC, plus smoothing, band-limiting, and post-mixer baseband recovery.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`A low-pass filter passes DC..$f_c$ and attenuates above $f_c$; the single-pole form is $H(j\omega)=1/(1+j\omega/\omega_c)$.`,
      String.raw`For an RC low-pass the −3 dB (half-power) cutoff is $f_c=1/(2\pi RC)$, the frequency where $|Z_C|=R$ and $|H|=1/\sqrt2$.`,
      String.raw`Each pole adds 20 dB/decade (6 dB/octave) of stopband slope, so an $n$th-order filter rolls off at $20n$ dB/decade.`,
      String.raw`Order sets sharpness; the response family (Butterworth/Chebyshev/Bessel/elliptic) trades flatness, phase, and transition steepness for the same order.`,
      String.raw`At cutoff a single pole gives $-45^\circ$ phase; the filter adds phase lag reaching $-90^\circ$ per pole far above $f_c$.`,
      String.raw`The RC step response is $v_{out}=V(1-e^{-t/\tau})$ with $\tau=RC=1/(2\pi f_c)$; time constant and cutoff are reciprocals.`,
      String.raw`Rise time and bandwidth are linked by $t_r\approx 0.35/f_{3\mathrm{dB}}$: narrower filters respond more slowly.`,
      String.raw`Anti-aliasing: a low-pass must precede an ADC to remove energy above $f_s/2$, because aliasing cannot be undone after sampling.`,
      String.raw`Reconstruction (anti-imaging): a low-pass after a DAC removes spectral images at multiples of $f_s$, smoothing the staircase output.`,
      String.raw`Active Sallen-Key stages build high-order low-pass filters with gain and low output impedance and no bulky inductors; oversampling relaxes the analog anti-alias filter.`
    ],
    equations: [
      {
        title: 'RC low-pass transfer function',
        tex: String.raw`$$H(j\omega)=\frac{1}{1+j\omega RC}=\frac{1}{1+j\,\omega/\omega_c}$$`,
        derivation: String.raw`<p><b>Where we start.</b> An RC low-pass is a series resistor $R$ feeding a shunt capacitor $C$, with the output taken across the capacitor. We find the frequency response by treating it as a complex voltage divider.</p>
        <p><b>Step 1 — write the capacitor impedance.</b> In the phasor domain a capacitor has impedance $$Z_C=\frac{1}{j\omega C}.$$ The resistor keeps its real impedance $R$.</p>
        <p><b>Step 2 — apply the voltage-divider rule.</b> The output is the fraction of the input dropped across $Z_C$:</p>
        $$H(j\omega)=\frac{V_{out}}{V_{in}}=\frac{Z_C}{R+Z_C}=\frac{1/(j\omega C)}{R+1/(j\omega C)}.$$
        <p><b>Step 3 — clear the fraction.</b> Multiply numerator and denominator by $j\omega C$:</p>
        $$H(j\omega)=\frac{1}{j\omega C\cdot R+1}=\frac{1}{1+j\omega RC}.$$
        <p><b>Step 4 — introduce the cutoff.</b> Define $\omega_c=1/RC$ so that $\omega RC=\omega/\omega_c$, giving the canonical single-pole form</p>
        $$H(j\omega)=\frac{1}{1+j\,\omega/\omega_c}.$$
        <p><b>Result.</b> $$H(j\omega)=\frac{1}{1+j\omega/\omega_c},\quad |H|=\frac{1}{\sqrt{1+(\omega/\omega_c)^2}}.$$ Sanity check: at $\omega\to0$, $H\to1$ (DC passes); at $\omega\to\infty$, $H\to0$ (high frequencies blocked); at $\omega=\omega_c$, $|H|=1/\sqrt2$.</p>`
      },
      {
        title: 'The −3 dB cutoff frequency',
        tex: String.raw`$$f_c=\frac{1}{2\pi RC}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The cutoff is defined as the frequency where the output power is half the input power, i.e. the magnitude drops to $1/\sqrt2$ of its passband value. We locate that frequency for the RC low-pass.</p>
        <p><b>Step 1 — write the magnitude.</b> From the transfer function, $$|H(\omega)|=\frac{1}{\sqrt{1+(\omega RC)^2}}.$$</p>
        <p><b>Step 2 — set the half-power condition.</b> Half power means $|H|^2=1/2$:</p>
        $$\frac{1}{1+(\omega_c RC)^2}=\frac12\ \Longrightarrow\ 1+(\omega_c RC)^2=2.$$
        <p><b>Step 3 — solve for the angular cutoff.</b> Thus $(\omega_c RC)^2=1$, so $$\omega_c RC=1\ \Longrightarrow\ \omega_c=\frac{1}{RC}.$$</p>
        <p><b>Step 4 — convert to ordinary frequency.</b> With $\omega_c=2\pi f_c$,</p>
        $$f_c=\frac{\omega_c}{2\pi}=\frac{1}{2\pi RC}.$$
        <p><b>Result.</b> $$f_c=\frac{1}{2\pi RC}.$$ Sanity check: an equivalent one-line route is to note the knee is where $|Z_C|=R$, i.e. $1/(\omega C)=R\Rightarrow\omega=1/RC$ — the same answer. In decibels $20\log_{10}(1/\sqrt2)=-3.01$ dB, hence the name.</p>`
      },
      {
        title: 'Roll-off slope and filter order',
        tex: String.raw`$$\text{slope}=20n\ \text{dB/decade}\quad(n=\text{number of poles})$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want the asymptotic attenuation of an $n$-pole low-pass far above cutoff, to connect a stopband specification to the required filter order.</p>
        <p><b>Step 1 — magnitude of one pole far above cutoff.</b> For a single pole, $|H|=1/\sqrt{1+(\omega/\omega_c)^2}$. When $\omega\gg\omega_c$ the 1 is negligible, so $$|H|\approx\frac{\omega_c}{\omega}\propto\frac{1}{\omega}.$$</p>
        <p><b>Step 2 — express in decibels.</b> $$|H|_{dB}=20\log_{10}|H|\approx 20\log_{10}\!\left(\frac{\omega_c}{\omega}\right)=-20\log_{10}\!\left(\frac{\omega}{\omega_c}\right).$$</p>
        <p><b>Step 3 — evaluate a decade.</b> Increasing $\omega$ by a factor of 10 changes the term by $-20\log_{10}(10)=-20$ dB. So one pole gives $-20$ dB/decade.</p>
        <p><b>Step 4 — cascade $n$ poles.</b> Cascaded stages multiply their magnitudes, which <i>add</i> in dB. With $n$ poles $|H|\propto \omega^{-n}$, giving $$|H|_{dB}\approx -20n\log_{10}\!\left(\frac{\omega}{\omega_c}\right),$$ i.e. a slope of $20n$ dB/decade.</p>
        <p><b>Result.</b> $$\text{slope}=20n\ \text{dB/decade}=6n\ \text{dB/octave}.$$ Sanity check: a 2nd-order filter falls 40 dB per decade, so a tone one decade past cutoff is 40 dB down — read the needed order directly from a stopband spec.</p>`
      },
      {
        title: 'Step response and rise-time / bandwidth relation',
        tex: String.raw`$$v_{out}(t)=V\!\left(1-e^{-t/RC}\right),\qquad t_r\approx\frac{0.35}{f_{3\mathrm{dB}}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We connect the frequency-domain cutoff to the time-domain speed of an RC low-pass by solving its step response and extracting the 10%–90% rise time.</p>
        <p><b>Step 1 — circuit equation.</b> Current through $R$ charges $C$: $C\,dv_{out}/dt=(V-v_{out})/R$, i.e. $$RC\frac{dv_{out}}{dt}+v_{out}=V.$$</p>
        <p><b>Step 2 — solve for a step from 0.</b> With $\tau=RC$ and $v_{out}(0)=0$, the solution is the charging exponential $$v_{out}(t)=V\left(1-e^{-t/\tau}\right).$$</p>
        <p><b>Step 3 — find the 10% and 90% times.</b> Setting $1-e^{-t/\tau}=0.1$ and $0.9$ gives $t_{10}=\tau\ln(1/0.9)$ and $t_{90}=\tau\ln(1/0.1)$. The rise time is the difference $$t_r=t_{90}-t_{10}=\tau\ln 9\approx 2.197\,\tau.$$</p>
        <p><b>Step 4 — substitute the cutoff.</b> Since $\tau=RC=1/\omega_c=1/(2\pi f_{3\mathrm{dB}})$,</p>
        $$t_r\approx\frac{2.197}{2\pi f_{3\mathrm{dB}}}=\frac{0.350}{f_{3\mathrm{dB}}}.$$
        <p><b>Result.</b> $$t_r\approx\frac{0.35}{f_{3\mathrm{dB}}}.$$ Sanity check: a 1 MHz bandwidth gives $t_r\approx350$ ns — wider bandwidth means faster edges, the everyday face of the time–bandwidth trade-off.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does a low-pass filter do?`, back: String.raw`Passes frequency components from DC up to the cutoff $f_c$ and attenuates components above $f_c$.` },
      { front: String.raw`Single-pole low-pass transfer function?`, back: String.raw`$H(j\omega)=1/(1+j\omega/\omega_c)$, with $|H|=1/\sqrt{1+(\omega/\omega_c)^2}$.` },
      { front: String.raw`RC low-pass cutoff frequency?`, back: String.raw`$f_c=1/(2\pi RC)$ — the −3 dB (half-power) point, where $|Z_C|=R$.` },
      { front: String.raw`Why is the cutoff called "−3 dB"?`, back: String.raw`There the magnitude is $1/\sqrt2\approx0.707$, so power is halved: $20\log_{10}(1/\sqrt2)=-3$ dB.` },
      { front: String.raw`Roll-off of a single-pole low-pass?`, back: String.raw`20 dB/decade (6 dB/octave); an $n$-pole filter gives $20n$ dB/decade.` },
      { front: String.raw`How does filter order relate to slope?`, back: String.raw`Slope $=20n$ dB/decade where $n$ is the number of poles; higher order = sharper transition.` },
      { front: String.raw`Phase of a one-pole low-pass at $f_c$ and far above?`, back: String.raw`$-45^\circ$ at $f_c$; approaches $-90^\circ$ far above cutoff (per pole).` },
      { front: String.raw`RC step response and time constant?`, back: String.raw`$v_{out}(t)=V(1-e^{-t/\tau})$ with $\tau=RC=1/(2\pi f_c)$.` },
      { front: String.raw`Rise-time vs bandwidth rule?`, back: String.raw`$t_r\approx 0.35/f_{3\mathrm{dB}}$ (10%–90% rise time); narrower bandwidth = slower edges.` },
      { front: String.raw`Why must an anti-aliasing LPF go before the ADC?`, back: String.raw`It removes energy above $f_s/2$ before sampling; aliasing is irreversible once the signal is sampled.` },
      { front: String.raw`What is a reconstruction (anti-imaging) filter?`, back: String.raw`A low-pass after a DAC that removes spectral images at multiples of $f_s$, smoothing the staircase into a continuous waveform.` },
      { front: String.raw`What is a Sallen-Key stage?`, back: String.raw`An active (op-amp) second-order low-pass cell giving gain, low output impedance, and controllable $f_c$/Q without inductors.` },
      { front: String.raw`Butterworth vs Bessel low-pass?`, back: String.raw`Butterworth = maximally flat magnitude; Bessel = maximally flat group delay (linear phase, clean step, gentler roll-off).` },
      { front: String.raw`Why does a low-pass follow a mixer?`, back: String.raw`To remove the sum/doubled-frequency products and keep only the wanted baseband (difference) term.` }
    ],
    mcqs: [
      { q: String.raw`An RC low-pass has $R=1\,\mathrm{k\Omega}$ and $C=159\,\mathrm{nF}$. Its cutoff $f_c$ is approximately:`, options: [String.raw`100 Hz`, String.raw`1 kHz`, String.raw`10 kHz`, String.raw`159 kHz`], answer: 1, explain: String.raw`$f_c=1/(2\pi RC)=1/(2\pi\cdot10^3\cdot159\times10^{-9})\approx1$ kHz.` },
      { q: String.raw`At the cutoff frequency of a single-pole low-pass, the magnitude $|H|$ equals:`, options: [String.raw`1 (0 dB)`, String.raw`$1/\sqrt2$ (−3 dB)`, String.raw`1/2 (−6 dB)`, String.raw`0 (−∞ dB)`], answer: 1, explain: String.raw`By definition of the −3 dB point, $|H(\omega_c)|=1/\sqrt2\approx0.707$, i.e. half power.` },
      { q: String.raw`A 3rd-order low-pass filter rolls off in its stopband at:`, options: [String.raw`20 dB/decade`, String.raw`40 dB/decade`, String.raw`60 dB/decade`, String.raw`80 dB/decade`], answer: 2, explain: String.raw`Slope $=20n=20\times3=60$ dB/decade.` },
      { q: String.raw`The phase of an ideal single-pole low-pass at its cutoff frequency is:`, options: [String.raw`$0^\circ$`, String.raw`$-45^\circ$`, String.raw`$-90^\circ$`, String.raw`$-180^\circ$`], answer: 1, explain: String.raw`For one pole the phase is $-\arctan(\omega/\omega_c)$; at $\omega=\omega_c$ this is $-45^\circ$.` },
      { q: String.raw`Why must an anti-aliasing filter precede the sampler in an ADC chain?`, options: [String.raw`It boosts SNR after sampling`, String.raw`Aliasing cannot be removed once the signal is sampled`, String.raw`It converts voltage to bits`, String.raw`It reduces the sample rate`], answer: 1, explain: String.raw`Energy above $f_s/2$ folds irreversibly into baseband; only a pre-sampling LPF can prevent it.` },
      { q: String.raw`The rise-time / bandwidth rule of thumb for a first-order low-pass is:`, options: [String.raw`$t_r\approx 0.10/f_{3\mathrm{dB}}$`, String.raw`$t_r\approx 0.35/f_{3\mathrm{dB}}$`, String.raw`$t_r\approx 1/f_{3\mathrm{dB}}$`, String.raw`$t_r\approx 2.2/f_{3\mathrm{dB}}$`], answer: 1, explain: String.raw`$t_r=\tau\ln9\approx2.2\tau$ and $\tau=1/(2\pi f_{3\mathrm{dB}})$, giving $t_r\approx0.35/f_{3\mathrm{dB}}$.` },
      { q: String.raw`The RC low-pass time constant $\tau$ relates to the cutoff by:`, options: [String.raw`$\tau=2\pi f_c$`, String.raw`$\tau=1/(2\pi f_c)$`, String.raw`$\tau=f_c$`, String.raw`$\tau=1/f_c^2$`], answer: 1, explain: String.raw`$\tau=RC=1/\omega_c=1/(2\pi f_c)$: time constant and cutoff are reciprocals (up to $2\pi$).` },
      { q: String.raw`Which filter family gives a maximally flat passband magnitude (no ripple)?`, options: [String.raw`Chebyshev Type I`, String.raw`Butterworth`, String.raw`Elliptic`, String.raw`Inverse Chebyshev with ripple`], answer: 1, explain: String.raw`Butterworth is defined by maximally flat (monotonic, ripple-free) passband magnitude.` },
      { q: String.raw`A Sallen-Key topology is used to build:`, options: [String.raw`A passive RC divider`, String.raw`An active second-order low-pass section`, String.raw`A crystal oscillator`, String.raw`A power amplifier`], answer: 1, explain: String.raw`The Sallen-Key is an op-amp second-order filter cell providing gain and low output impedance without inductors.` },
      { q: String.raw`Doubling the cutoff frequency of an RC low-pass (halving $\tau$) makes the step response:`, options: [String.raw`Slower (larger rise time)`, String.raw`Faster (smaller rise time)`, String.raw`Unchanged`, String.raw`Oscillatory`], answer: 1, explain: String.raw`Rise time $t_r\approx0.35/f_{3\mathrm{dB}}$, so raising $f_{3\mathrm{dB}}$ lowers $t_r$ — a faster response.` },
      { q: String.raw`One decade above cutoff, a first-order low-pass attenuates the signal by about:`, options: [String.raw`3 dB`, String.raw`6 dB`, String.raw`20 dB`, String.raw`40 dB`], answer: 2, explain: String.raw`Single-pole slope is 20 dB/decade, so one decade past cutoff the response is about 20 dB down.` },
      { q: String.raw`A low-pass filter placed after a DAC is called a:`, options: [String.raw`Anti-aliasing filter`, String.raw`Reconstruction (anti-imaging) filter`, String.raw`Matched filter`, String.raw`Notch filter`], answer: 1, explain: String.raw`After a DAC the low-pass removes spectral images at multiples of $f_s$, reconstructing the smooth waveform.` }
    ],
    numericals: [
      { q: String.raw`An RC low-pass uses $R=2.2\,\mathrm{k\Omega}$ and $C=10\,\mathrm{nF}$. Find the −3 dB cutoff frequency $f_c$.`, solution: String.raw`<p><b>Formula.</b> The RC low-pass cutoff is $$f_c=\frac{1}{2\pi RC},$$ where $R$ is the series resistance and $C$ the shunt capacitance.</p>
<p><b>Substitute.</b> $$f_c=\frac{1}{2\pi\,(2.2\times10^{3})\,(10\times10^{-9})}.$$</p>
<p><b>Compute.</b> $RC=2.2\times10^{3}\times10\times10^{-9}=2.2\times10^{-5}$ s. Then $f_c=1/(2\pi\times2.2\times10^{-5})=1/(1.382\times10^{-4})\approx7.23\times10^{3}$ Hz $\approx7.23$ kHz.</p>
<p><b>Explanation.</b> The product $RC=22\,\mu$s sets the time constant; its reciprocal over $2\pi$ places the −3 dB knee near 7.2 kHz. Signals well below this pass essentially unchanged, while those well above are attenuated at 20 dB/decade.</p>` },
      { q: String.raw`A single-pole low-pass has $f_c=1\,\mathrm{kHz}$. By how many dB is a 100 kHz tone attenuated relative to the passband (asymptotic estimate)?`, solution: String.raw`<p><b>Formula.</b> Far above cutoff a single pole falls at 20 dB/decade: $$A\approx 20\log_{10}\!\left(\frac{f}{f_c}\right)\ \text{dB below passband}.$$</p>
<p><b>Substitute.</b> $$A\approx 20\log_{10}\!\left(\frac{100\,\text{kHz}}{1\,\text{kHz}}\right)=20\log_{10}(100).$$</p>
<p><b>Compute.</b> The ratio is 100, i.e. two decades, so $20\log_{10}(100)=20\times2=40$ dB of attenuation.</p>
<p><b>Explanation.</b> Each decade past cutoff costs 20 dB for one pole; 100 kHz is two decades above the 1 kHz cutoff, hence about 40 dB down. The exact value is marginally larger because the asymptote ignores the −3 dB already present at $f_c$, but 40 dB is the standard engineering estimate.</p>` },
      { q: String.raw`An oscilloscope channel has a 3 dB bandwidth of 100 MHz. Estimate the fastest 10%–90% rise time it can display.`, solution: String.raw`<p><b>Formula.</b> The rise-time / bandwidth relation for a first-order response is $$t_r\approx\frac{0.35}{f_{3\mathrm{dB}}}.$$</p>
<p><b>Substitute.</b> $$t_r\approx\frac{0.35}{100\times10^{6}\ \text{Hz}}.$$</p>
<p><b>Compute.</b> $t_r\approx0.35/10^{8}=3.5\times10^{-9}$ s $=3.5$ ns.</p>
<p><b>Explanation.</b> A 100 MHz bandwidth limits observable edges to about 3.5 ns; anything faster is smeared by the instrument. This is why probing a fast edge needs an instrument bandwidth several times the signal's own bandwidth to avoid corrupting the measured rise time.</p>` },
      { q: String.raw`A signal must be band-limited to 20 kHz before sampling at $f_s=48\,\mathrm{kHz}$. A tone at 40 kHz must be at least 60 dB down. What minimum filter order is needed if $f_c=20\,\mathrm{kHz}$?`, solution: String.raw`<p><b>Formula.</b> With cutoff at $f_c$, the asymptotic attenuation at frequency $f$ for an $n$-pole filter is $$A\approx 20\,n\,\log_{10}\!\left(\frac{f}{f_c}\right)\ \text{dB},$$ solved for the order $$n\ge \frac{A}{20\log_{10}(f/f_c)}.$$</p>
<p><b>Substitute.</b> $$n\ge\frac{60}{20\log_{10}(40\,\text{kHz}/20\,\text{kHz})}=\frac{60}{20\log_{10}(2)}.$$</p>
<p><b>Compute.</b> $\log_{10}(2)=0.301$, so the denominator is $20\times0.301=6.02$ dB. Then $n\ge 60/6.02\approx9.97$, so round up to $n=10$.</p>
<p><b>Explanation.</b> Because 40 kHz is only one octave (6 dB/octave per pole) above the 20 kHz cutoff, reaching 60 dB there demands about ten poles — an impractically steep analog filter. The realistic fix is oversampling: sampling far above 48 kHz opens a wide guard band so a gentle analog filter plus sharp digital filtering and decimation does the job.</p>` },
      { q: String.raw`An RC low-pass with $R=10\,\mathrm{k\Omega}$, $C=1\,\mathrm{nF}$ is driven by a 5 V step. Find the time constant, the cutoff, and $v_{out}$ at $t=20\,\mu\mathrm{s}$.`, solution: String.raw`<p><b>Formula.</b> The charging step response is $v_{out}(t)=V(1-e^{-t/\tau})$ with $\tau=RC$ and cutoff $f_c=1/(2\pi RC)$.</p>
<p><b>Substitute.</b> $$\tau=(10\times10^{3})(1\times10^{-9}),\quad f_c=\frac{1}{2\pi\tau},\quad v_{out}(20\,\mu s)=5\left(1-e^{-20\mu s/\tau}\right).$$</p>
<p><b>Compute.</b> $\tau=10^{-5}$ s $=10\,\mu$s. $f_c=1/(2\pi\times10^{-5})\approx15.9$ kHz. At $t=20\,\mu$s, $t/\tau=2$, so $v_{out}=5(1-e^{-2})=5(1-0.135)=5\times0.865\approx4.32$ V.</p>
<p><b>Explanation.</b> After two time constants the capacitor has charged to about 86.5% of the final value, giving 4.32 V toward the 5 V step; full settling (≈99%) takes roughly five time constants (50 µs). The 15.9 kHz cutoff and the 10 µs time constant are the same fact seen in frequency and time.</p>` }
    ],
    realWorld: String.raw`<p>Low-pass filters are everywhere in a signal chain. Every <a href="#adc">ADC</a> front-end places an anti-aliasing low-pass ahead of the sampler so that energy above $f_s/2$ cannot fold into the band — a mistake here is unrecoverable, so it is treated as a mandatory block. Modern converters lean heavily on <a href="#nyquist-sampling">oversampling</a>: sampling far above the Nyquist rate opens a wide guard band, letting a cheap 1st- or 2nd-order analog filter handle anti-aliasing while a sharp digital low-pass and decimation finish the job. On the output side, a <a href="#dac">DAC</a> is followed by a reconstruction (anti-imaging) low-pass that smooths the staircase and kills images at multiples of $f_s$. In radios a low-pass follows almost every <a href="#mixer">mixer</a> to strip the sum term and keep the wanted baseband, and audio and sensor systems use gentle Bessel or Butterworth low-passes to smooth noise without distorting waveform shape. The same math ties together the frequency view ($f_c=1/2\pi RC$, 20 dB/decade per pole) and the time view ($t_r\approx0.35/f_{3\mathrm{dB}}$) that instrument designers use to match probe and scope bandwidths.</p>`,
    related: ['filters', 'hpf', 'bpf', 'aliasing', 'nyquist-sampling']
  }
);
