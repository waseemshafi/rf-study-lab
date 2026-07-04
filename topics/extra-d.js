// Modulation & Detection — extra-d topics: Amplitude Modulation (AM), Frequency Modulation (FM), QPSK, Root-Raised-Cosine Filter
CONTENT.topics.push(
{
  id: 'am',
  title: 'Amplitude Modulation (AM)',
  category: 'Modulation & Detection',
  tags: ['AM', 'DSB', 'SSB', 'VSB', 'envelope detection', 'modulation index', 'sidebands', 'analog modulation'],
  summary: String.raw`Amplitude modulation encodes a message onto the envelope of a sinusoidal carrier, trading power efficiency for the simplicity of envelope detection.`,
  diagram: {
    svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr-am" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <text x="20" y="46" fill="#9aa7b5">m(t)</text>
  <text x="20" y="130" fill="#9aa7b5">carrier</text>
  <rect x="120" y="30" width="110" height="50" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="175" y="52" fill="#e6edf3" text-anchor="middle">Modulator</text>
  <text x="175" y="68" fill="#9aa7b5" text-anchor="middle">×(1+m·cos)</text>
  <rect x="300" y="30" width="110" height="50" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="355" y="52" fill="#e6edf3" text-anchor="middle">Envelope</text>
  <text x="355" y="68" fill="#9aa7b5" text-anchor="middle">detector (RC)</text>
  <rect x="460" y="30" width="60" height="50" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="490" y="60" fill="#e6edf3" text-anchor="middle">m(t)</text>
  <line x1="55" y1="42" x2="118" y2="50" stroke="#9aa7b5" marker-end="url(#arr-am)"/>
  <line x1="80" y1="126" x2="175" y2="82" stroke="#9aa7b5" marker-end="url(#arr-am)"/>
  <line x1="230" y1="55" x2="298" y2="55" stroke="#9aa7b5" marker-end="url(#arr-am)"/>
  <text x="264" y="46" fill="#b197fc" text-anchor="middle">AM s(t)</text>
  <line x1="410" y1="55" x2="458" y2="55" stroke="#9aa7b5" marker-end="url(#arr-am)"/>
  <text x="270" y="175" fill="#9aa7b5" text-anchor="middle">envelope A_c[1+m·cos] carries the message; carrier is pure overhead</text>
</svg>`,
    caption: String.raw`AM mechanism: message and carrier multiply in the modulator to ride the envelope, which an RC envelope detector recovers.`
  },
  prerequisites: ['comm-basics', 'fourier-transform', 'frequency-spectrum', 'bandwidth'],
  intro: String.raw`<p>Amplitude modulation (AM) is the oldest and conceptually simplest way to carry information on a radio wave: let the <em>amplitude</em> of a high-frequency carrier follow the shape of a low-frequency message. If the message is $m(t)$ and the carrier is $A_c\cos(\omega_c t)$, standard (full-carrier) AM transmits $s(t)=A_c[1+k_a m(t)]\cos(\omega_c t)$, so the carrier's envelope traces $A_c[1+k_a m(t)]$. This single idea underpins a whole family — DSB-SC, SSB and VSB — that differ only in which parts of the spectrum are kept. AM's enduring appeal is the <strong>envelope detector</strong>: a diode, a capacitor and a resistor recover the message with no local oscillator, which is why broadcast AM survived for a century. Its enduring weakness is <strong>power efficiency</strong>: in standard AM most of the transmitted power sits in a carrier that conveys no information, capping efficiency at $33\%$.</p>`,
  sections: [
    {
      h: 'The standard AM signal and its envelope',
      html: String.raw`<p>Take a single-tone message $m(t)=A_m\cos(\omega_m t)$. Standard AM forms</p>
      <p>$$s(t)=A_c\bigl[1+m\cos(\omega_m t)\bigr]\cos(\omega_c t),\qquad m=k_a A_m,$$</p>
      <p>where $m$ is the <strong>modulation index</strong> (also called depth of modulation). The term in brackets is the instantaneous envelope; as long as $1+m\cos(\omega_m t)\ge 0$ everywhere — i.e. $m\le 1$ — the envelope never goes negative and reproduces the message faithfully.</p>
      <ul>
        <li><strong>$m<1$ (under-modulation):</strong> envelope $A_c(1\pm m)$ swings between $A_c(1-m)$ and $A_c(1+m)$; the message is recoverable by simple envelope detection.</li>
        <li><strong>$m=1$ (100% modulation):</strong> envelope just touches zero at troughs; maximum message power without distortion.</li>
        <li><strong>$m>1$ (over-modulation):</strong> the bracket goes negative, the envelope folds, and an envelope detector produces gross distortion (phase reversals). Coherent detection can still recover $m(t)$, but envelope detection cannot.</li>
      </ul>
      <p>The modulation index can be read straight off an oscilloscope trace of the modulated waveform: $m=(A_{max}-A_{min})/(A_{max}+A_{min})$, where $A_{max}=A_c(1+m)$ and $A_{min}=A_c(1-m)$.</p>
      <div class="callout"><strong>Intuition:</strong> AM slides the message spectrum up to sit around $\pm f_c$ and adds a spectral spike (the carrier) so the envelope is always positive. That spike is a "pilot" that lets a dumb detector track the envelope — but it is pure overhead in terms of information.</div></p>`
    },
    {
      h: 'Spectrum: carrier and two sidebands',
      html: String.raw`<p>Expand the single-tone AM signal using the product-to-sum identity $\cos A\cos B=\tfrac12[\cos(A-B)+\cos(A+B)]$:</p>
      <p>$$s(t)=A_c\cos(\omega_c t)+\frac{mA_c}{2}\cos[(\omega_c-\omega_m)t]+\frac{mA_c}{2}\cos[(\omega_c+\omega_m)t].$$</p>
      <p>Three discrete spectral lines appear: the <strong>carrier</strong> at $f_c$, a <strong>lower sideband (LSB)</strong> at $f_c-f_m$, and an <strong>upper sideband (USB)</strong> at $f_c+f_m$. For a general message occupying $0$ to $W$ Hz, the sidebands become continuous bands mirrored about $f_c$:</p>
      <ul>
        <li>Upper sideband: $f_c$ to $f_c+W$ — an erect copy of the message spectrum.</li>
        <li>Lower sideband: $f_c-W$ to $f_c$ — an inverted (frequency-reversed) copy.</li>
      </ul>
      <p>The two sidebands are mirror images, so each carries the <em>complete</em> message; the second is redundant. The occupied <strong>bandwidth</strong> is therefore</p>
      <p>$$B_{AM}=2W\quad(=2f_m\text{ for a single tone}),$$</p>
      <p>twice the message bandwidth. This redundancy is exactly what SSB later exploits to halve the bandwidth.</p></p>`
    },
    {
      h: 'Power budget and efficiency',
      html: String.raw`<p>The total average power of the single-tone AM signal is the sum of the powers in the three lines. Each cosine $A\cos(\cdot)$ carries average power $A^2/2$ into a $1\,\Omega$ load:</p>
      <p>$$P_c=\frac{A_c^2}{2},\qquad P_{LSB}=P_{USB}=\frac{1}{2}\!\left(\frac{mA_c}{2}\right)^2=\frac{m^2A_c^2}{8}.$$</p>
      <p>$$P_T=P_c+2\cdot\frac{m^2A_c^2}{8}=\frac{A_c^2}{2}\!\left(1+\frac{m^2}{2}\right)=P_c\!\left(1+\frac{m^2}{2}\right).$$</p>
      <p>The information lives entirely in the sidebands, so the <strong>transmission (power) efficiency</strong> is</p>
      <p>$$\eta=\frac{P_{sidebands}}{P_T}=\frac{m^2/2}{1+m^2/2}=\frac{m^2}{2+m^2}.$$</p>
      <p>Even at full modulation $m=1$, $\eta=1/3\approx 33\%$ — two-thirds of the transmitted power is wasted in the carrier. At a typical $m=0.5$, $\eta$ collapses to only $11\%$.</p>
      <table class="data">
        <tr><th>$m$</th><th>Sideband fraction $\eta$</th><th>Carrier fraction</th></tr>
        <tr><td>0.25</td><td>3.0%</td><td>97.0%</td></tr>
        <tr><td>0.5</td><td>11.1%</td><td>88.9%</td></tr>
        <tr><td>0.7</td><td>19.7%</td><td>80.3%</td></tr>
        <tr><td>1.0</td><td>33.3%</td><td>66.7%</td></tr>
      </table>
      <div class="callout"><strong>Why keep the carrier at all?</strong> Because it lets the receiver be a $10¢$ diode. Broadcasters accepted the efficiency penalty to make receivers cheap and universal.</div></p>`
    },
    {
      h: 'DSB-SC, SSB and VSB — trimming the fat',
      html: String.raw`<p>Since the carrier carries no information and one sideband is redundant, several variants remove them:</p>
      <ul>
        <li><strong>DSB-SC (double-sideband, suppressed carrier):</strong> transmit only $s(t)=A_c m(t)\cos(\omega_c t)$. All power now goes into information (100% efficient), but there is no carrier to lock onto — the receiver must regenerate a phase-coherent carrier (e.g. with a Costas loop). Bandwidth stays at $2W$.</li>
        <li><strong>SSB (single sideband):</strong> transmit just one sideband. This halves bandwidth to $W$ and is maximally efficient, but requires either sharp filtering or a phasing (Hartley) network, plus coherent detection. SSB dominates HF voice communications (amateur radio, aeronautical, marine).</li>
        <li><strong>VSB (vestigial sideband):</strong> transmit one full sideband plus a small "vestige" of the other, with a carefully shaped filter whose skirts have odd symmetry about $f_c$. This is a compromise used when the message has energy down to DC (which makes true SSB filtering impossible) — the classic case is analog TV video.</li>
      </ul>
      <table class="data">
        <tr><th>Scheme</th><th>Bandwidth</th><th>Efficiency</th><th>Detector</th></tr>
        <tr><td>Full AM (DSB-LC)</td><td>$2W$</td><td>$\le 33\%$</td><td>Envelope (simple)</td></tr>
        <tr><td>DSB-SC</td><td>$2W$</td><td>100%</td><td>Coherent</td></tr>
        <tr><td>SSB</td><td>$W$</td><td>100%</td><td>Coherent</td></tr>
        <tr><td>VSB</td><td>$\approx W$ to $1.25W$</td><td>High</td><td>Coherent / envelope+pilot</td></tr>
      </table></p>`
    },
    {
      h: 'Envelope detection vs coherent detection',
      html: String.raw`<p><strong>Envelope detection</strong> is the killer feature of full-carrier AM. A diode rectifies the RF, and an $RC$ low-pass smooths the result to follow the envelope $A_c[1+k_a m(t)]$. The $RC$ time constant must satisfy $1/f_c \ll RC \ll 1/W$: fast enough to discharge between message peaks, slow enough to ride over individual RF cycles. It requires no local oscillator, no phase lock — hence its ubiquity. It works <em>only</em> when the envelope is a faithful copy of the message, i.e. when a carrier is present and $m\le 1$.</p>
      <p><strong>Coherent (synchronous) detection</strong> multiplies the received signal by a locally generated carrier $\cos(\omega_c t)$ phase-locked to the transmitter, then low-pass filters:</p>
      <p>$$s(t)\cos(\omega_c t)=A_c m(t)\cos^2(\omega_c t)=\frac{A_c}{2}m(t)+\frac{A_c}{2}m(t)\cos(2\omega_c t).$$</p>
      <p>The LPF removes the $2\omega_c$ term, leaving $\tfrac{A_c}{2}m(t)$. Coherent detection is <em>required</em> for DSB-SC and SSB (no envelope to follow) and is more robust in noise, but it needs a carrier-recovery loop. A phase error $\phi$ scales the output by $\cos\phi$ (DSB-SC) — a $90°$ error nulls the signal entirely, the basis of the quadrature idea used later in QPSK.</p>
      <div class="callout"><strong>Pitfall:</strong> Envelope detection of a DSB-SC or over-modulated signal produces the <em>rectified</em> message with phase reversals — badly distorted. Match the detector to the modulation.</div></p>`
    },
    {
      h: 'Noise performance and practical issues',
      html: String.raw`<p>AM's output SNR after detection depends on the scheme. For coherent DSB-SC/SSB, the detection gain is essentially unity (SSB and DSB-SC both give $\text{SNR}_o=\text{SNR}_i$ referenced appropriately). For full AM with envelope detection, the presence of the power-hungry carrier means the <em>figure of merit</em> $\gamma=\text{SNR}_o/\text{SNR}_{baseband}$ is only $m^2/(2+m^2)\le 1/3$ — the same efficiency factor reappears. Worse, envelope detectors exhibit a <strong>threshold effect</strong>: below a certain input SNR the noise captures the envelope and the output degrades catastrophically rather than gracefully.</p>
      <p>Other practical concerns:</p>
      <ul>
        <li><strong>Selective fading:</strong> if the carrier fades more than the sidebands (or vice versa) the envelope distorts; a reason SSB (which carries no separate carrier) is preferred on HF.</li>
        <li><strong>Adjacent-channel interference:</strong> the $2W$ bandwidth and slow spectral roll-off require guard bands; broadcast AM channels are spaced 9 or 10 kHz.</li>
        <li><strong>Linearity:</strong> AM must be amplified with a <em>linear</em> PA (or use high-level plate modulation); a saturated (Class-C/E) PA would clip the envelope and destroy the information — unlike FM, which tolerates nonlinear PAs.</li>
      </ul></p>`
    }
  ],
  keyPoints: [
    String.raw`Standard AM: $s(t)=A_c[1+m\cos\omega_m t]\cos\omega_c t$; the envelope $A_c[1+m\cos\omega_m t]$ carries the message.`,
    String.raw`Modulation index $m=k_a A_m$; from a scope, $m=(A_{max}-A_{min})/(A_{max}+A_{min})$.`,
    String.raw`Spectrum = carrier at $f_c$ plus USB at $f_c+f_m$ and LSB at $f_c-f_m$; bandwidth $B=2W$ (or $2f_m$).`,
    String.raw`Total power $P_T=P_c(1+m^2/2)$; only the sidebands carry information.`,
    String.raw`Efficiency $\eta=m^2/(2+m^2)\le 33\%$ at $m=1$; two-thirds of power is in the useless carrier.`,
    String.raw`Over-modulation ($m>1$) folds the envelope and destroys envelope detection; keep $m\le 1$.`,
    String.raw`DSB-SC removes the carrier (100% efficient) but needs coherent detection; bandwidth still $2W$.`,
    String.raw`SSB transmits one sideband: half the bandwidth ($W$) and full efficiency, but needs coherent detection.`,
    String.raw`VSB keeps one sideband plus a vestige of the other for messages with DC energy (analog TV video).`,
    String.raw`Envelope detection ($RC$ diode) needs no LO but works only with a present carrier and $m\le 1$.`,
    String.raw`Coherent detection multiplies by a phase-locked carrier and LP-filters; phase error scales output by $\cos\phi$.`,
    String.raw`AM needs a linear PA (envelope carries data); this is a key drawback versus constant-envelope FM.`
  ],
  equations: [
    {
      title: 'Standard AM signal',
      tex: String.raw`$$s(t)=A_c\bigl[1+m\cos(\omega_m t)\bigr]\cos(\omega_c t)$$`,
      derivation: String.raw`<p><b>Where we start.</b> We want the carrier amplitude to follow a message. Begin with an unmodulated carrier $c(t)=A_c\cos(\omega_c t)$ of fixed amplitude $A_c$, and a single-tone message $m(t)=A_m\cos(\omega_m t)$ with $f_m\ll f_c$.</p>
      <p><b>Step 1 — make the amplitude time-varying.</b> Replace the constant $A_c$ with an envelope $a(t)$ that rides on the message:</p>
      $$a(t)=A_c+k_a A_c\,m(t)=A_c\bigl[1+k_a A_m\cos(\omega_m t)\bigr].$$
      <p>The constant term $A_c$ keeps the envelope biased positive; $k_a$ is the amplitude-sensitivity constant that sets how strongly the message pushes the envelope.</p>
      <p><b>Step 2 — define the modulation index.</b> Collect the message swing into a single number $m=k_a A_m$, the fraction by which the envelope deviates from $A_c$. Then $a(t)=A_c[1+m\cos(\omega_m t)]$.</p>
      <p><b>Step 3 — put the envelope back on the carrier.</b> Multiply the (positive) envelope by the carrier oscillation:</p>
      $$s(t)=a(t)\cos(\omega_c t)=A_c\bigl[1+m\cos(\omega_m t)\bigr]\cos(\omega_c t).$$
      <p><b>Result.</b> $$s(t)=A_c\bigl[1+m\cos(\omega_m t)\bigr]\cos(\omega_c t).$$ Sanity check: with $m=0$ (no message) this reduces to the bare carrier $A_c\cos\omega_c t$, as it must.</p>`
    },
    {
      title: 'AM spectrum (carrier + two sidebands)',
      tex: String.raw`$$s(t)=A_c\cos\omega_c t+\frac{mA_c}{2}\cos(\omega_c-\omega_m)t+\frac{mA_c}{2}\cos(\omega_c+\omega_m)t$$`,
      derivation: String.raw`<p><b>Where we start.</b> Take the time-domain AM signal $s(t)=A_c[1+m\cos\omega_m t]\cos\omega_c t$ and ask which frequencies it contains.</p>
      <p><b>Step 1 — expand the bracket.</b></p>
      $$s(t)=A_c\cos\omega_c t+mA_c\cos(\omega_m t)\cos(\omega_c t).$$
      <p>The first term is plainly the carrier at $f_c$. The second is a product of two cosines, which must be turned into a sum.</p>
      <p><b>Step 2 — apply the product-to-sum identity.</b> Using $\cos A\cos B=\tfrac12[\cos(A-B)+\cos(A+B)]$ with $A=\omega_m t$, $B=\omega_c t$:</p>
      $$mA_c\cos\omega_m t\cos\omega_c t=\frac{mA_c}{2}\cos(\omega_c-\omega_m)t+\frac{mA_c}{2}\cos(\omega_c+\omega_m)t.$$
      <p><b>Step 3 — collect.</b> Substituting back gives three sinusoids at $f_c$, $f_c-f_m$ and $f_c+f_m$.</p>
      <p><b>Result.</b> $$s(t)=A_c\cos\omega_c t+\frac{mA_c}{2}\cos(\omega_c-\omega_m)t+\frac{mA_c}{2}\cos(\omega_c+\omega_m)t.$$ Sanity check: the two sideband lines are symmetric about $f_c$ and each is scaled by $m/2$, so as $m\to0$ only the carrier remains.</p>`
    },
    {
      title: 'Total transmitted power',
      tex: String.raw`$$P_T=P_c\left(1+\frac{m^2}{2}\right)=\frac{A_c^2}{2}\left(1+\frac{m^2}{2}\right)$$`,
      derivation: String.raw`<p><b>Where we start.</b> The AM signal is a sum of three uncorrelated sinusoids at distinct frequencies. Because they are orthogonal over a period, their average powers simply add.</p>
      <p><b>Step 1 — power of each line.</b> A sinusoid $A\cos(\cdot)$ has mean-square value (average power into $1\,\Omega$) of $A^2/2$. Hence:</p>
      $$P_c=\frac{A_c^2}{2},\qquad P_{USB}=P_{LSB}=\frac{1}{2}\left(\frac{mA_c}{2}\right)^2=\frac{m^2A_c^2}{8}.$$
      <p><b>Step 2 — add them.</b></p>
      $$P_T=\frac{A_c^2}{2}+2\cdot\frac{m^2A_c^2}{8}=\frac{A_c^2}{2}+\frac{m^2A_c^2}{4}.$$
      <p><b>Step 3 — factor out the carrier power.</b></p>
      $$P_T=\frac{A_c^2}{2}\left(1+\frac{m^2}{2}\right)=P_c\left(1+\frac{m^2}{2}\right).$$
      <p><b>Result.</b> $$P_T=P_c\left(1+\frac{m^2}{2}\right).$$ Sanity check: at $m=1$, $P_T=1.5P_c$, so sidebands add half the carrier power — consistent with the $33\%$ efficiency figure.</p>`
    },
    {
      title: 'Transmission efficiency',
      tex: String.raw`$$\eta=\frac{m^2}{2+m^2}$$`,
      derivation: String.raw`<p><b>Where we start.</b> Efficiency is the fraction of transmitted power that actually carries information — i.e. the fraction in the sidebands.</p>
      <p><b>Step 1 — sideband power.</b> From the power budget, $P_{sb}=2\cdot\dfrac{m^2A_c^2}{8}=\dfrac{m^2A_c^2}{4}=\dfrac{m^2}{2}P_c$.</p>
      <p><b>Step 2 — form the ratio.</b></p>
      $$\eta=\frac{P_{sb}}{P_T}=\frac{\tfrac{m^2}{2}P_c}{P_c(1+\tfrac{m^2}{2})}=\frac{m^2/2}{1+m^2/2}.$$
      <p><b>Step 3 — clear the fractions.</b> Multiply numerator and denominator by $2$:</p>
      $$\eta=\frac{m^2}{2+m^2}.$$
      <p><b>Result.</b> $$\eta=\frac{m^2}{2+m^2}.$$ Sanity check: $\eta$ increases monotonically with $m$ and at the maximum undistorted depth $m=1$ gives $\eta=1/3=33.3\%$.</p>`
    },
    {
      title: 'Modulation index from the waveform',
      tex: String.raw`$$m=\frac{A_{max}-A_{min}}{A_{max}+A_{min}}$$`,
      derivation: String.raw`<p><b>Where we start.</b> The envelope is $a(t)=A_c[1+m\cos\omega_m t]$. Its extreme values are what a scope's envelope shows.</p>
      <p><b>Step 1 — find the extremes.</b> The cosine ranges over $[-1,+1]$, so:</p>
      $$A_{max}=A_c(1+m),\qquad A_{min}=A_c(1-m).$$
      <p><b>Step 2 — form sum and difference.</b></p>
      $$A_{max}+A_{min}=2A_c,\qquad A_{max}-A_{min}=2A_c m.$$
      <p><b>Step 3 — divide to eliminate $A_c$.</b></p>
      $$\frac{A_{max}-A_{min}}{A_{max}+A_{min}}=\frac{2A_c m}{2A_c}=m.$$
      <p><b>Result.</b> $$m=\frac{A_{max}-A_{min}}{A_{max}+A_{min}}.$$ Sanity check: if $A_{min}=0$ (envelope just touches zero) then $m=1$, exactly the $100\%$-modulation boundary.</p>`
    },
    {
      title: 'Coherent detection of DSB-SC',
      tex: String.raw`$$v_o(t)=\frac{A_c}{2}m(t)\cos\phi$$`,
      derivation: String.raw`<p><b>Where we start.</b> A DSB-SC signal is $s(t)=A_c m(t)\cos\omega_c t$. The coherent receiver multiplies by a local oscillator $\cos(\omega_c t+\phi)$ with phase error $\phi$, then low-pass filters.</p>
      <p><b>Step 1 — multiply.</b></p>
      $$s(t)\cos(\omega_c t+\phi)=A_c m(t)\cos\omega_c t\cos(\omega_c t+\phi).$$
      <p><b>Step 2 — product-to-sum.</b> Using $\cos A\cos B=\tfrac12[\cos(A-B)+\cos(A+B)]$:</p>
      $$=\frac{A_c}{2}m(t)\Bigl[\cos\phi+\cos(2\omega_c t+\phi)\Bigr].$$
      <p><b>Step 3 — low-pass filter.</b> The $2\omega_c$ term is far above the message band and is rejected, leaving only the baseband term.</p>
      <p><b>Result.</b> $$v_o(t)=\frac{A_c}{2}m(t)\cos\phi.$$ Sanity check: at perfect lock $\phi=0$ the message is recovered at full amplitude; at $\phi=90°$ the output vanishes — the quadrature null exploited by Costas loops and QPSK.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`Write the standard (full-carrier) AM signal.`, back: String.raw`$s(t)=A_c[1+m\cos\omega_m t]\cos\omega_c t$, where $m$ is the modulation index.` },
    { front: String.raw`What is the modulation index in terms of scope readings?`, back: String.raw`$m=(A_{max}-A_{min})/(A_{max}+A_{min})$, with $A_{max}=A_c(1+m)$, $A_{min}=A_c(1-m)$.` },
    { front: String.raw`Where are the AM sidebands located?`, back: String.raw`At $f_c\pm f_m$ (LSB below, USB above the carrier), each scaled by $m/2$.` },
    { front: String.raw`What is the bandwidth of an AM signal?`, back: String.raw`$B=2W$ (twice the message bandwidth); $2f_m$ for a single tone.` },
    { front: String.raw`Give the total power of single-tone AM.`, back: String.raw`$P_T=P_c(1+m^2/2)$; carrier plus two sidebands.` },
    { front: String.raw`What is AM's maximum transmission efficiency?`, back: String.raw`$\eta=m^2/(2+m^2)$, maximised at $33.3\%$ when $m=1$.` },
    { front: String.raw`What happens when $m>1$?`, back: String.raw`Over-modulation: the envelope folds through zero, and envelope detection produces severe distortion.` },
    { front: String.raw`How does DSB-SC differ from full AM?`, back: String.raw`It suppresses the carrier — 100% efficient — but requires coherent detection; bandwidth stays $2W$.` },
    { front: String.raw`What advantage does SSB give over DSB?`, back: String.raw`It transmits only one sideband, halving bandwidth to $W$ while keeping full efficiency.` },
    { front: String.raw`When is VSB used?`, back: String.raw`When the message has energy near DC (e.g. analog TV video), where sharp SSB filtering is impossible.` },
    { front: String.raw`What condition must an envelope detector's $RC$ satisfy?`, back: String.raw`$1/f_c \ll RC \ll 1/W$ — fast enough to follow the envelope, slow enough to skip RF cycles.` },
    { front: String.raw`Effect of coherent-detector phase error $\phi$ on DSB-SC?`, back: String.raw`Output scales by $\cos\phi$; a $90°$ error nulls the signal entirely.` },
    { front: String.raw`Why does AM require a linear power amplifier?`, back: String.raw`The information is in the envelope; a saturated PA would clip it and destroy the message.` },
    { front: String.raw`What is the threshold effect in AM?`, back: String.raw`Below a certain input SNR, envelope detection degrades catastrophically rather than gracefully.` },
    { front: String.raw`Which sideband is a frequency-inverted copy of the message?`, back: String.raw`The lower sideband (LSB); the upper sideband is an erect (non-inverted) copy.` }
  ],
  mcqs: [
    { q: String.raw`The maximum power efficiency of standard AM occurs at $m=1$ and equals:`, options: [String.raw`50%`, String.raw`33.3%`, String.raw`66.7%`, String.raw`100%`], answer: 1, explain: String.raw`$\eta=m^2/(2+m^2)$; at $m=1$ this is $1/3=33.3\%$. Two-thirds of the power is in the carrier.` },
    { q: String.raw`An AM waveform shows $A_{max}=12$ V and $A_{min}=4$ V. The modulation index is:`, options: [String.raw`0.33`, String.raw`0.5`, String.raw`0.67`, String.raw`0.75`], answer: 1, explain: String.raw`$m=(12-4)/(12+4)=8/16=0.5$.` },
    { q: String.raw`The bandwidth of an AM signal carrying a message of bandwidth $W$ is:`, options: [String.raw`$W$`, String.raw`$W/2$`, String.raw`$2W$`, String.raw`$4W$`], answer: 2, explain: String.raw`Both sidebands each span $W$, giving total occupied bandwidth $2W$.` },
    { q: String.raw`Which modulation is most bandwidth-efficient?`, options: [String.raw`Full AM (DSB-LC)`, String.raw`DSB-SC`, String.raw`SSB`, String.raw`VSB`], answer: 2, explain: String.raw`SSB transmits a single sideband, occupying only $W$ — half the bandwidth of DSB schemes.` },
    { q: String.raw`Over-modulation ($m>1$) causes:`, options: [String.raw`Higher efficiency with no penalty`, String.raw`Envelope folding and distortion under envelope detection`, String.raw`Reduced bandwidth`, String.raw`Carrier suppression`], answer: 1, explain: String.raw`The envelope $A_c(1+m\cos\omega_m t)$ goes negative, folds, and an envelope detector cannot recover the message.` },
    { q: String.raw`DSB-SC requires which detector?`, options: [String.raw`Simple diode envelope detector`, String.raw`Coherent (synchronous) detector`, String.raw`Slope detector`, String.raw`Ratio detector`], answer: 1, explain: String.raw`With no carrier present there is no faithful envelope; a phase-locked coherent detector is needed.` },
    { q: String.raw`In coherent DSB-SC detection, a phase error of $90°$ produces an output that is:`, options: [String.raw`Doubled`, String.raw`Unchanged`, String.raw`Zero`, String.raw`Inverted but full amplitude`], answer: 2, explain: String.raw`Output scales by $\cos\phi$; $\cos 90°=0$, so the message is completely nulled.` },
    { q: String.raw`VSB modulation is preferred when the message:`, options: [String.raw`Is a pure tone`, String.raw`Has significant energy near DC`, String.raw`Has no low-frequency content`, String.raw`Is already band-pass`], answer: 1, explain: String.raw`Near-DC energy makes the sharp filtering of true SSB impractical, so a vestige of the second sideband is retained.` },
    { q: String.raw`For single-tone AM at $m=0.5$, the fraction of total power in the sidebands is about:`, options: [String.raw`3%`, String.raw`11%`, String.raw`25%`, String.raw`33%`], answer: 1, explain: String.raw`$\eta=0.25/(2+0.25)=0.25/2.25=11.1\%$.` },
    { q: String.raw`The lower sideband of an AM signal is:`, options: [String.raw`An erect copy of the message spectrum`, String.raw`A frequency-inverted copy of the message spectrum`, String.raw`Identical to the carrier`, String.raw`Always suppressed`], answer: 1, explain: String.raw`The LSB (from $f_c-W$ to $f_c$) is a mirror-image, frequency-reversed copy; the USB is erect.` },
    { q: String.raw`Why can FM use a nonlinear (saturated) PA but AM cannot?`, options: [String.raw`FM has higher bandwidth`, String.raw`AM's information is in the envelope, which nonlinear PAs distort`, String.raw`FM uses lower frequencies`, String.raw`AM has no sidebands`], answer: 1, explain: String.raw`AM carries data in amplitude; clipping the envelope destroys it. FM has a constant envelope, so amplitude distortion is harmless.` },
    { q: String.raw`Removing the carrier from full AM (creating DSB-SC) changes efficiency to:`, options: [String.raw`Still 33%`, String.raw`100%`, String.raw`50%`, String.raw`11%`], answer: 1, explain: String.raw`With no carrier, all transmitted power resides in the information-bearing sidebands — 100% efficient.` }
  ],
  numericals: [
    { q: String.raw`A 5 kW AM transmitter operates at $m=0.8$ with a single-tone message. Find the carrier power and the total transmitted power. (Take 5 kW as the carrier power $P_c$.)`, solution: String.raw`<p>$P_c=5$ kW (given as the unmodulated carrier power).</p><p>$P_T=P_c(1+m^2/2)=5(1+0.64/2)=5(1.32)=6.6$ kW.</p><p>Sideband power $=P_T-P_c=1.6$ kW; efficiency $\eta=1.6/6.6=24.2\%$ (or $m^2/(2+m^2)=0.64/2.64=24.2\%$).</p>` },
    { q: String.raw`An AM envelope on a scope reads $A_{max}=15$ V and $A_{min}=5$ V. Compute $m$ and the sideband-to-total power ratio.`, solution: String.raw`<p>$m=(15-5)/(15+5)=10/20=0.5$.</p><p>$\eta=m^2/(2+m^2)=0.25/2.25=0.111=11.1\%$.</p>` },
    { q: String.raw`A message occupies 0–4.5 kHz. Find the AM bandwidth, and the SSB bandwidth.`, solution: String.raw`<p>AM (DSB): $B=2W=2\times4.5=9$ kHz — the standard broadcast AM channel spacing.</p><p>SSB: $B=W=4.5$ kHz — half the bandwidth.</p>` },
    { q: String.raw`Two tones modulate a carrier: $m_1=0.4$ and $m_2=0.3$. Find the effective modulation index and the efficiency.`, solution: String.raw`<p>Effective index (uncorrelated tones): $m_{eff}=\sqrt{m_1^2+m_2^2}=\sqrt{0.16+0.09}=\sqrt{0.25}=0.5$.</p><p>$\eta=m_{eff}^2/(2+m_{eff}^2)=0.25/2.25=11.1\%$.</p>` },
    { q: String.raw`A carrier $A_c=10$ V is amplitude-modulated to $m=1$. Find $A_{max}$, $A_{min}$, and the peak envelope power relative to the carrier power.`, solution: String.raw`<p>$A_{max}=A_c(1+m)=20$ V; $A_{min}=A_c(1-m)=0$ V.</p><p>Peak envelope power $\propto A_{max}^2=400$ vs carrier $\propto A_c^2=100$, i.e. peak envelope power is $4\times$ the carrier power.</p>` },
    { q: String.raw`An AM broadcast station transmits total power $P_T=10$ kW at $m=0.6$. How much power is wasted in the carrier?`, solution: String.raw`<p>$P_T=P_c(1+m^2/2)=P_c(1+0.18)=1.18P_c\Rightarrow P_c=10/1.18=8.47$ kW.</p><p>The carrier (no information) wastes $8.47$ kW of the $10$ kW — about $84.7\%$ of transmitted power.</p>` },
    { q: String.raw`Design an envelope detector for a 1 MHz carrier and a 5 kHz message. Give an acceptable $RC$ range.`, solution: String.raw`<p>Require $1/f_c \ll RC \ll 1/W$: $1\,\mu\text{s}\ll RC\ll 200\,\mu\text{s}$.</p><p>A good choice is $RC\approx 20$–$50\,\mu$s (e.g. $R=10$ k$\Omega$, $C=3.3$ nF gives $33\,\mu$s), safely between the two limits.</p>` }
  ],
  realWorld: String.raw`<p>Standard AM still fills the medium-wave broadcast band (530–1710 kHz) precisely because a receiver needs nothing more than a diode, capacitor and earpiece — the "crystal set" that put radio in every home. Its power inefficiency is tolerated for the sake of receiver simplicity and universal compatibility. SSB, by contrast, dominates long-haul HF voice — amateur, aeronautical and marine radio — where every watt and every kilohertz counts and operators accept the more complex coherent receiver. VSB carried analog broadcast television's video for decades. Even in modern digital radios, the AM envelope-and-quadrature machinery reappears: quadrature (I/Q) up/down-conversion is DSB-SC in two orthogonal channels, and the Costas loop that recovers a suppressed carrier is the direct descendant of AM's coherent detector.</p>`,
  related: ['fm', 'comm-basics', 'bandwidth', 'costas-loop', 'qpsk']
},
{
  id: 'fm',
  title: 'Frequency Modulation (FM)',
  category: 'Modulation & Detection',
  tags: ['FM', 'frequency modulation', 'modulation index', 'Carson rule', 'Bessel', 'capture effect', 'pre-emphasis', 'constant envelope'],
  summary: String.raw`Frequency modulation encodes the message in the carrier's instantaneous frequency, giving a constant-envelope signal that trades bandwidth for a large SNR improvement.`,
  diagram: {
    svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr-fm" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <rect x="20" y="35" width="70" height="50" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="55" y="65" fill="#e6edf3" text-anchor="middle">m(t)</text>
  <rect x="140" y="35" width="120" height="50" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="200" y="57" fill="#e6edf3" text-anchor="middle">VCO / freq</text>
  <text x="200" y="73" fill="#9aa7b5" text-anchor="middle">modulator</text>
  <rect x="310" y="35" width="130" height="50" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="375" y="57" fill="#e6edf3" text-anchor="middle">Limiter +</text>
  <text x="375" y="73" fill="#9aa7b5" text-anchor="middle">discriminator</text>
  <rect x="475" y="35" width="55" height="50" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="502" y="65" fill="#e6edf3" text-anchor="middle">m(t)</text>
  <line x1="90" y1="60" x2="138" y2="60" stroke="#9aa7b5" marker-end="url(#arr-fm)"/>
  <line x1="260" y1="60" x2="308" y2="60" stroke="#9aa7b5" marker-end="url(#arr-fm)"/>
  <text x="284" y="50" fill="#b197fc" text-anchor="middle">FM s(t)</text>
  <line x1="440" y1="60" x2="473" y2="60" stroke="#9aa7b5" marker-end="url(#arr-fm)"/>
  <text x="200" y="115" fill="#9aa7b5" text-anchor="middle">f_i = f_c + k_f·m(t)</text>
  <text x="270" y="170" fill="#9aa7b5" text-anchor="middle">constant envelope; discriminator differentiates phase → recovers m(t)</text>
</svg>`,
    caption: String.raw`FM mechanism: the message drives a VCO to set the instantaneous frequency; a limiter-discriminator differentiates the phase back to m(t).`
  },
  prerequisites: ['comm-basics', 'am', 'fourier-transform', 'bandwidth', 'noise'],
  intro: String.raw`<p>Frequency modulation (FM) leaves the carrier amplitude alone and instead varies its <em>instantaneous frequency</em> in proportion to the message. Because the envelope is constant, FM is immune to the amplitude noise and fading that plague AM, and it can be amplified by efficient saturating (Class-C) power amplifiers. FM is an <strong>angle modulation</strong>: the information lives in the phase/frequency of $s(t)=A_c\cos[\omega_c t+\phi(t)]$, and it is fundamentally <em>nonlinear</em> — its spectrum is not a simple frequency-shifted copy of the message but an infinite set of Bessel-weighted sidebands. FM's defining bargain is that by spreading over more bandwidth (governed by the modulation index $\beta$ and summarised by Carson's rule) it buys a disproportionate improvement in output SNR. This wideband trade of bandwidth for noise immunity is why FM gave hi-fi broadcast radio and why it underlies the capture effect that lets the strongest signal win.</p>`,
  sections: [
    {
      h: 'Instantaneous frequency and the FM signal',
      html: String.raw`<p>For a general angle-modulated carrier $s(t)=A_c\cos\theta(t)$, the <strong>instantaneous frequency</strong> is the rate of change of the total phase:</p>
      <p>$$f_i(t)=\frac{1}{2\pi}\frac{d\theta(t)}{dt}.$$</p>
      <p>FM makes this instantaneous frequency track the message: $f_i(t)=f_c+k_f m(t)$, where $k_f$ (Hz per volt) is the frequency sensitivity. Integrating to recover the phase,</p>
      <p>$$\theta(t)=2\pi f_c t+2\pi k_f\!\int_{-\infty}^{t} m(\tau)\,d\tau,$$</p>
      <p>so the FM signal is</p>
      <p>$$\boxed{\,s(t)=A_c\cos\!\left[2\pi f_c t+2\pi k_f\!\int_{-\infty}^{t}m(\tau)\,d\tau\right].}$$</p>
      <p>For a single tone $m(t)=A_m\cos(2\pi f_m t)$, the integral gives $\frac{A_m}{2\pi f_m}\sin(2\pi f_m t)$, so</p>
      <p>$$s(t)=A_c\cos\!\left[2\pi f_c t+\beta\sin(2\pi f_m t)\right],\qquad \beta=\frac{k_f A_m}{f_m}=\frac{\Delta f}{f_m}.$$</p>
      <div class="callout"><strong>Key contrast with PM:</strong> In phase modulation the phase itself follows $m(t)$; in FM the phase follows the <em>integral</em> of $m(t)$ (equivalently, the frequency follows $m(t)$). FM = PM of the integrated message.</div></p>`
    },
    {
      h: 'Frequency deviation and modulation index',
      html: String.raw`<p>Two quantities characterise an FM signal:</p>
      <ul>
        <li><strong>Peak frequency deviation</strong> $\Delta f=k_f\,|m(t)|_{max}$ — how far the instantaneous frequency swings from $f_c$. For a single tone $\Delta f=k_f A_m$. It depends only on the message <em>amplitude</em>, not its frequency.</li>
        <li><strong>Modulation index</strong> $\beta=\dfrac{\Delta f}{f_m}$ — the peak <em>phase</em> deviation in radians. Unlike AM's index, $\beta$ can exceed 1 freely and depends on both amplitude ($\Delta f$) and message frequency ($f_m$).</li>
      </ul>
      <p>The value of $\beta$ splits FM into two regimes:</p>
      <table class="data">
        <tr><th>Regime</th><th>Condition</th><th>Bandwidth</th><th>Character</th></tr>
        <tr><td>Narrowband FM (NBFM)</td><td>$\beta\ll 1$ (roughly $\beta<0.3$)</td><td>$\approx 2f_m$ (like AM)</td><td>Two significant sidebands; spectrum resembles AM</td></tr>
        <tr><td>Wideband FM (WBFM)</td><td>$\beta\gg 1$</td><td>$\approx 2\Delta f$</td><td>Many sidebands; large SNR gain</td></tr>
      </table>
      <p>Broadcast FM uses $\Delta f=75$ kHz with audio up to $f_m=15$ kHz, giving $\beta=5$ — firmly wideband. This large index is the source of FM's famous fidelity.</p></p>`
    },
    {
      h: 'Narrowband FM: the small-index approximation',
      html: String.raw`<p>When $\beta\ll1$ the FM phase excursion is tiny, and we can linearise. Writing $s(t)=A_c\cos[\omega_c t+\beta\sin\omega_m t]$ and expanding the cosine of a sum:</p>
      <p>$$s(t)=A_c\bigl[\cos\omega_c t\cos(\beta\sin\omega_m t)-\sin\omega_c t\sin(\beta\sin\omega_m t)\bigr].$$</p>
      <p>For small $\beta$, $\cos(\beta\sin\omega_m t)\approx1$ and $\sin(\beta\sin\omega_m t)\approx\beta\sin\omega_m t$, giving</p>
      <p>$$s(t)\approx A_c\cos\omega_c t-A_c\beta\sin\omega_c t\sin\omega_m t.$$</p>
      <p>Using $\sin\omega_c t\sin\omega_m t=\tfrac12[\cos(\omega_c-\omega_m)t-\cos(\omega_c+\omega_m)t]$, this becomes a carrier plus two sidebands at $f_c\pm f_m$ — exactly like AM, except the lower sideband carries a sign flip (the sidebands are in <em>quadrature</em> with the carrier). So NBFM has AM-like bandwidth $2f_m$ but a fundamentally different phase structure. NBFM is used where spectrum is scarce: two-way land-mobile radio, older analog voice systems.</p>
      <div class="callout"><strong>Insight:</strong> The quadrature sideband is what distinguishes FM from AM at small index: AM sidebands add in-phase to swell the amplitude; FM sidebands add in quadrature to swing the phase, leaving the amplitude (ideally) constant.</div></p>`
    },
    {
      h: 'Wideband FM and the Bessel spectrum',
      html: String.raw`<p>For arbitrary $\beta$ the small-angle trick fails; we must use the exact Jacobi–Anger expansion. A single-tone FM signal has the exact spectrum</p>
      <p>$$s(t)=A_c\sum_{n=-\infty}^{\infty}J_n(\beta)\cos[(\omega_c+n\omega_m)t],$$</p>
      <p>where $J_n(\beta)$ are Bessel functions of the first kind. The spectrum is an <em>infinite</em> comb of lines at $f_c\pm nf_m$, each weighted by $J_n(\beta)$. Key facts:</p>
      <ul>
        <li>The carrier line amplitude is $J_0(\beta)$ — and it can vanish entirely. $J_0(\beta)=0$ at $\beta\approx2.405, 5.520,\dots$ (Bessel nulls), a classic way to <em>calibrate</em> the deviation of an FM transmitter.</li>
        <li>Power is conserved: $\sum_n J_n^2(\beta)=1$, so the total power always equals $A_c^2/2$ regardless of $\beta$ (constant envelope).</li>
        <li>Sidebands with $|n|>\beta+1$ carry negligible power — the basis of Carson's rule.</li>
      </ul>
      <table class="data">
        <tr><th>$\beta$</th><th>$J_0$</th><th>$J_1$</th><th>$J_2$</th><th>$J_3$</th><th>Significant pairs</th></tr>
        <tr><td>0.25</td><td>0.98</td><td>0.12</td><td>0.00</td><td>—</td><td>1 (NBFM)</td></tr>
        <tr><td>1.0</td><td>0.77</td><td>0.44</td><td>0.11</td><td>0.02</td><td>3</td></tr>
        <tr><td>2.405</td><td>0.00</td><td>0.52</td><td>0.43</td><td>0.20</td><td>4 (carrier null)</td></tr>
        <tr><td>5.0</td><td>-0.18</td><td>-0.33</td><td>0.05</td><td>0.36</td><td>~7 (broadcast FM)</td></tr>
      </table></p>`
    },
    {
      h: "Carson's rule and bandwidth",
      html: String.raw`<p>Although FM theoretically occupies infinite bandwidth, almost all power lies within a finite band. <strong>Carson's rule</strong> estimates the bandwidth containing $\ge 98\%$ of the power:</p>
      <p>$$B_{FM}\approx 2(\Delta f+f_m)=2f_m(1+\beta)=2\Delta f\!\left(1+\frac{1}{\beta}\right).$$</p>
      <p>The two limiting cases fall out naturally:</p>
      <ul>
        <li>NBFM ($\beta\ll1$): $B\approx 2f_m$ — dominated by the message bandwidth, like AM.</li>
        <li>WBFM ($\beta\gg1$): $B\approx 2\Delta f$ — dominated by the deviation.</li>
      </ul>
      <p>For broadcast FM ($\Delta f=75$ kHz, $f_m=15$ kHz): $B\approx2(75+15)=180$ kHz, which is why FM channels are spaced 200 kHz apart (with guard band). Carson's rule slightly underestimates for very small or very large $\beta$; a more conservative estimate uses the highest significant Bessel sideband, $B\approx 2(\beta+1)f_m$ — which is algebraically identical to Carson's rule.</p></p>`
    },
    {
      h: 'Detection, capture effect and pre-emphasis',
      html: String.raw`<p><strong>Detection.</strong> An FM discriminator converts frequency variations to amplitude: a slope detector, a Foster–Seeley discriminator, a ratio detector, or (universally in modern radios) a PLL that tracks the instantaneous frequency, with its control voltage being the demodulated output. A <em>limiter</em> precedes the discriminator to strip any residual amplitude variation (from noise or fading) — since FM carries no information in amplitude, this hard-limiting is harmless and gives FM much of its noise immunity.</p>
      <p><strong>Capture effect.</strong> When two FM signals share a channel, the discriminator locks onto the <em>stronger</em> one and suppresses the weaker almost entirely — a capture ratio of only a few dB. This is why FM interference sounds like an abrupt switch between stations rather than the muddled overlap heard on AM.</p>
      <p><strong>FM threshold.</strong> FM's SNR advantage holds only above a threshold input SNR (typically ~10 dB at the discriminator). Below it, "clicks" and impulsive noise appear and the output SNR collapses rapidly — the threshold effect. Wideband FM has a higher threshold, so there is a limit to how much bandwidth you can profitably trade for SNR.</p>
      <p><strong>Pre-/de-emphasis.</strong> Noise at the FM discriminator output rises with frequency (a parabolic noise power spectrum, $\propto f^2$), so high audio frequencies suffer most. The fix: <em>pre-emphasise</em> (boost) high frequencies at the transmitter with a $75\,\mu$s time-constant network, and <em>de-emphasise</em> (cut them back) at the receiver. The message is restored flat while the receiver's de-emphasis simultaneously attenuates the high-frequency noise — a several-dB SNR improvement for free.</p></p>`
    },
    {
      h: 'SNR gain: trading bandwidth for noise immunity',
      html: String.raw`<p>The great payoff of wideband FM is that the output SNR grows as the <em>cube</em> of bandwidth (via $\beta$). Above threshold, the FM figure of merit is</p>
      <p>$$\frac{\text{SNR}_o}{\text{SNR}_{baseband}}=3\beta^2(\beta+1)\approx 3\beta^3\quad(\text{large }\beta),$$</p>
      <p>where $\text{SNR}_{baseband}$ is the reference SNR in the message bandwidth. Doubling $\beta$ (and hence roughly doubling bandwidth) multiplies output SNR by $\sim8$ ($9$ dB). This is a dramatically better exchange rate than any linear scheme, and it is the fundamental reason WBFM sounds so clean. The catch is the threshold: you cannot keep raising $\beta$ indefinitely, because a wider bandwidth admits more noise power and eventually pushes the receiver below threshold. FM thus embodies Shannon's bandwidth–power trade-off in an analog form: spend bandwidth to save power (SNR).</p>
      <div class="callout"><strong>Rule of thumb:</strong> Every doubling of FM bandwidth (deviation) buys about $9$ dB of output SNR — until the FM threshold bites.</div></p>`
    }
  ],
  keyPoints: [
    String.raw`FM signal: $s(t)=A_c\cos[2\pi f_c t+2\pi k_f\int m\,d\tau]$; instantaneous frequency $f_i=f_c+k_f m(t)$.`,
    String.raw`Peak deviation $\Delta f=k_f|m|_{max}$ depends only on message amplitude; modulation index $\beta=\Delta f/f_m$ is the peak phase deviation.`,
    String.raw`NBFM ($\beta\ll1$): two quadrature sidebands, bandwidth $\approx2f_m$ (AM-like). WBFM ($\beta\gg1$): many sidebands.`,
    String.raw`Single-tone FM spectrum: $s(t)=A_c\sum_n J_n(\beta)\cos[(\omega_c+n\omega_m)t]$ — a Bessel-weighted comb.`,
    String.raw`Power is conserved: $\sum_n J_n^2(\beta)=1$; the envelope (and total power) is constant for any $\beta$.`,
    String.raw`Carrier line $J_0(\beta)$ vanishes at $\beta\approx2.405,5.52,\dots$ (Bessel nulls) — used to calibrate deviation.`,
    String.raw`Carson's rule: $B_{FM}\approx2(\Delta f+f_m)=2f_m(1+\beta)$; broadcast FM $\approx180$ kHz.`,
    String.raw`Constant envelope lets FM use efficient nonlinear (Class-C) PAs and resist amplitude noise/fading.`,
    String.raw`A limiter before the discriminator strips amplitude noise; the capture effect suppresses the weaker co-channel signal.`,
    String.raw`FM threshold (~10 dB input SNR): below it, clicks appear and output SNR collapses.`,
    String.raw`Pre-emphasis (Tx boost) + de-emphasis (Rx cut), $75\,\mu$s, counter the rising ($\propto f^2$) FM noise spectrum.`,
    String.raw`SNR gain $\approx3\beta^2(\beta+1)\approx3\beta^3$: doubling bandwidth buys ~9 dB — bandwidth traded for noise immunity.`
  ],
  equations: [
    {
      title: 'Instantaneous frequency of an angle-modulated wave',
      tex: String.raw`$$f_i(t)=\frac{1}{2\pi}\frac{d\theta(t)}{dt}$$`,
      derivation: String.raw`<p><b>Where we start.</b> A general carrier is $s(t)=A_c\cos\theta(t)$ where $\theta(t)$ is the total instantaneous phase. For a pure tone $\theta(t)=2\pi f_0 t+\phi_0$ and the frequency is simply $f_0$.</p>
      <p><b>Step 1 — generalise "frequency" to a time-varying phase.</b> For the pure tone, note that $f_0=\frac{1}{2\pi}\frac{d\theta}{dt}$ because $\frac{d}{dt}(2\pi f_0 t)=2\pi f_0$. We <em>define</em> instantaneous frequency by the same relation even when $\theta(t)$ is not linear in $t$.</p>
      $$f_i(t)\equiv\frac{1}{2\pi}\frac{d\theta(t)}{dt}.$$
      <p><b>Step 2 — impose the FM rule.</b> FM demands $f_i(t)=f_c+k_f m(t)$. Multiply by $2\pi$ and integrate to get the phase:</p>
      $$\theta(t)=2\pi f_c t+2\pi k_f\int_{-\infty}^{t}m(\tau)\,d\tau.$$
      <p><b>Result.</b> $$f_i(t)=\frac{1}{2\pi}\frac{d\theta(t)}{dt}.$$ Sanity check: differentiating the FM phase returns $2\pi f_c+2\pi k_f m(t)$, so $f_i=f_c+k_f m(t)$, exactly the FM definition.</p>`
    },
    {
      title: 'Single-tone FM signal and modulation index',
      tex: String.raw`$$s(t)=A_c\cos[\,2\pi f_c t+\beta\sin(2\pi f_m t)\,],\quad \beta=\frac{\Delta f}{f_m}$$`,
      derivation: String.raw`<p><b>Where we start.</b> Use the FM signal $s(t)=A_c\cos[2\pi f_c t+2\pi k_f\int m\,d\tau]$ with a single tone $m(t)=A_m\cos(2\pi f_m t)$.</p>
      <p><b>Step 1 — integrate the message.</b></p>
      $$\int_{-\infty}^{t}A_m\cos(2\pi f_m\tau)\,d\tau=\frac{A_m}{2\pi f_m}\sin(2\pi f_m t).$$
      <p><b>Step 2 — substitute into the phase.</b></p>
      $$\theta(t)=2\pi f_c t+2\pi k_f\cdot\frac{A_m}{2\pi f_m}\sin(2\pi f_m t)=2\pi f_c t+\frac{k_f A_m}{f_m}\sin(2\pi f_m t).$$
      <p><b>Step 3 — identify the deviation and index.</b> The peak frequency deviation is $\Delta f=k_f A_m$, so the coefficient of the sine is $\Delta f/f_m$. Name it the modulation index $\beta=\Delta f/f_m$.</p>
      <p><b>Result.</b> $$s(t)=A_c\cos[2\pi f_c t+\beta\sin(2\pi f_m t)].$$ Sanity check: $\beta$ has units of radians (peak phase swing); larger message amplitude raises $\Delta f$ and $\beta$, while a faster message ($f_m\uparrow$) lowers $\beta$.</p>`
    },
    {
      title: 'Bessel-function spectrum of single-tone FM',
      tex: String.raw`$$s(t)=A_c\sum_{n=-\infty}^{\infty}J_n(\beta)\cos[(\omega_c+n\omega_m)t]$$`,
      derivation: String.raw`<p><b>Where we start.</b> The single-tone FM signal $s(t)=A_c\cos[\omega_c t+\beta\sin\omega_m t]$ is nonlinear in the message, so its spectrum is not obvious. Work with the complex representation $s(t)=A_c\,\mathrm{Re}\{e^{j\omega_c t}e^{j\beta\sin\omega_m t}\}$.</p>
      <p><b>Step 1 — recognise a periodic factor.</b> The term $e^{j\beta\sin\omega_m t}$ is periodic in $t$ with period $1/f_m$, so it has a Fourier series. The coefficients are, by definition, Bessel functions of the first kind:</p>
      $$e^{j\beta\sin\omega_m t}=\sum_{n=-\infty}^{\infty}J_n(\beta)\,e^{jn\omega_m t}\quad\text{(Jacobi–Anger expansion)}.$$
      <p><b>Step 2 — multiply by the carrier phasor.</b></p>
      $$s(t)=A_c\,\mathrm{Re}\!\left\{e^{j\omega_c t}\sum_n J_n(\beta)e^{jn\omega_m t}\right\}=A_c\sum_n J_n(\beta)\,\mathrm{Re}\{e^{j(\omega_c+n\omega_m)t}\}.$$
      <p><b>Step 3 — take the real part.</b></p>
      $$s(t)=A_c\sum_{n=-\infty}^{\infty}J_n(\beta)\cos[(\omega_c+n\omega_m)t].$$
      <p><b>Result.</b> An infinite comb of lines at $f_c+nf_m$ weighted by $J_n(\beta)$. Sanity check: at $\beta\to0$, $J_0\to1$ and all other $J_n\to0$, so only the carrier survives — as it must for no modulation.</p>`
    },
    {
      title: 'Power conservation (Bessel identity)',
      tex: String.raw`$$\sum_{n=-\infty}^{\infty}J_n^2(\beta)=1$$`,
      derivation: String.raw`<p><b>Where we start.</b> FM has a constant envelope, so its total average power must be $A_c^2/2$ independent of $\beta$. We verify this from the Bessel spectrum.</p>
      <p><b>Step 1 — sum the sideband powers.</b> Each line $A_c J_n(\beta)\cos[(\omega_c+n\omega_m)t]$ contributes average power $\tfrac12 A_c^2 J_n^2(\beta)$ (lines at distinct frequencies are orthogonal, so powers add):</p>
      $$P_T=\sum_{n=-\infty}^{\infty}\frac{A_c^2}{2}J_n^2(\beta)=\frac{A_c^2}{2}\sum_n J_n^2(\beta).$$
      <p><b>Step 2 — equate to the constant-envelope power.</b> But directly, $s(t)=A_c\cos\theta(t)$ has power $A_c^2/2$. Equating:</p>
      $$\frac{A_c^2}{2}\sum_n J_n^2(\beta)=\frac{A_c^2}{2}\ \Rightarrow\ \sum_n J_n^2(\beta)=1.$$
      <p><b>Result.</b> $$\sum_{n=-\infty}^{\infty}J_n^2(\beta)=1.$$ Sanity check: this is a standard Bessel identity. It means modulation merely <em>redistributes</em> the carrier power among sidebands — it never creates or destroys power.</p>`
    },
    {
      title: "Carson's rule for FM bandwidth",
      tex: String.raw`$$B_{FM}\approx 2(\Delta f+f_m)=2f_m(1+\beta)$$`,
      derivation: String.raw`<p><b>Where we start.</b> The FM spectrum has infinitely many Bessel sidebands, but $J_n(\beta)$ becomes negligibly small once $|n|$ exceeds roughly $\beta+1$. We need the band that holds essentially all the power.</p>
      <p><b>Step 1 — count significant sidebands.</b> Empirically (and from the asymptotics of $J_n$), sidebands up to order $n_{max}\approx\beta+1$ carry $\ge98\%$ of the power; beyond that they are negligible.</p>
      <p><b>Step 2 — convert order to bandwidth.</b> The highest significant sideband sits at $f_c+n_{max}f_m$, so the one-sided occupied band from the carrier is $n_{max}f_m=(\beta+1)f_m$. The double-sided bandwidth is twice this:</p>
      $$B_{FM}\approx 2(\beta+1)f_m.$$
      <p><b>Step 3 — rewrite via the deviation.</b> Since $\beta f_m=\Delta f$, expand $2(\beta+1)f_m=2\beta f_m+2f_m=2\Delta f+2f_m$.</p>
      <p><b>Result.</b> $$B_{FM}\approx 2(\Delta f+f_m).$$ Sanity check: NBFM ($\beta\ll1$) gives $B\approx2f_m$ (AM-like); WBFM ($\beta\gg1$) gives $B\approx2\Delta f$ — both correct limits.</p>`
    },
    {
      title: 'Narrowband FM approximation',
      tex: String.raw`$$s(t)\approx A_c\cos\omega_c t-A_c\beta\sin\omega_c t\sin\omega_m t$$`,
      derivation: String.raw`<p><b>Where we start.</b> Take single-tone FM $s(t)=A_c\cos[\omega_c t+\beta\sin\omega_m t]$ and assume $\beta\ll1$ (small phase excursion).</p>
      <p><b>Step 1 — expand the cosine of a sum.</b> With $\theta=\beta\sin\omega_m t$:</p>
      $$s(t)=A_c[\cos\omega_c t\cos\theta-\sin\omega_c t\sin\theta].$$
      <p><b>Step 2 — apply small-angle approximations.</b> For $\beta\ll1$, $\cos\theta\approx1$ and $\sin\theta\approx\theta=\beta\sin\omega_m t$:</p>
      $$s(t)\approx A_c\cos\omega_c t-A_c\beta\sin\omega_c t\sin\omega_m t.$$
      <p><b>Step 3 — expose the sidebands.</b> Using $\sin\omega_c t\sin\omega_m t=\tfrac12[\cos(\omega_c-\omega_m)t-\cos(\omega_c+\omega_m)t]$ shows two sidebands at $f_c\pm f_m$, in quadrature with the carrier (note the sign difference from AM).</p>
      <p><b>Result.</b> $$s(t)\approx A_c\cos\omega_c t-A_c\beta\sin\omega_c t\sin\omega_m t.$$ Sanity check: bandwidth is $2f_m$ like AM, but the quadrature sidebands modulate the phase, not the amplitude — the essence of FM.</p>`
    },
    {
      title: 'FM output SNR (figure of merit)',
      tex: String.raw`$$\frac{\text{SNR}_o}{\text{SNR}_{baseband}}=3\beta^2(\beta+1)$$`,
      derivation: String.raw`<p><b>Where we start.</b> After the limiter and discriminator, additive white noise appears at the output with a power spectral density that <em>rises</em> as $f^2$ (differentiating phase to get frequency amplifies high-frequency noise). We compare the recovered signal power to the integrated output noise.</p>
      <p><b>Step 1 — output signal power.</b> The discriminator output is proportional to the instantaneous frequency deviation, giving a signal power $\propto (\Delta f)^2=(\beta f_m)^2$.</p>
      <p><b>Step 2 — output noise power.</b> Integrating the parabolic noise density $\propto f^2$ over the message band $[0,f_m]$ (or $W$) gives noise power $\propto f_m^3/3$. The factor $1/3$ comes from $\int_0^{f_m}f^2\,df=f_m^3/3$.</p>
      <p><b>Step 3 — form the ratio and normalise.</b> Dividing signal by noise and referencing to the baseband SNR (which has flat noise over $[0,f_m]$) introduces the factor $3$ and the deviation ratio $\beta$. Carrying the algebra through the known result:</p>
      $$\frac{\text{SNR}_o}{\text{SNR}_{baseband}}=3\beta^2(\beta+1).$$
      <p><b>Result.</b> For large $\beta$ this is $\approx3\beta^3$. Sanity check: SNR grows as the cube of bandwidth — doubling $\beta$ multiplies SNR by ~8 (9 dB), the celebrated FM bandwidth-for-SNR trade, valid only above the FM threshold.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`Define instantaneous frequency for an angle-modulated wave.`, back: String.raw`$f_i(t)=\frac{1}{2\pi}\frac{d\theta(t)}{dt}$ — the derivative of the total phase.` },
    { front: String.raw`Write the FM signal for message $m(t)$.`, back: String.raw`$s(t)=A_c\cos[2\pi f_c t+2\pi k_f\int m(\tau)d\tau]$.` },
    { front: String.raw`How does FM relate to PM?`, back: String.raw`FM is PM of the integrated message; the frequency (not phase) follows $m(t)$.` },
    { front: String.raw`Define peak frequency deviation $\Delta f$.`, back: String.raw`$\Delta f=k_f|m(t)|_{max}$; depends only on message amplitude, not frequency.` },
    { front: String.raw`Define the FM modulation index $\beta$.`, back: String.raw`$\beta=\Delta f/f_m$ — the peak phase deviation in radians; can be $\gg1$.` },
    { front: String.raw`Give the Bessel-function FM spectrum.`, back: String.raw`$s(t)=A_c\sum_n J_n(\beta)\cos[(\omega_c+n\omega_m)t]$ — an infinite comb at $f_c\pm nf_m$.` },
    { front: String.raw`What Bessel identity expresses FM power conservation?`, back: String.raw`$\sum_n J_n^2(\beta)=1$; total power stays $A_c^2/2$ regardless of $\beta$.` },
    { front: String.raw`What happens to the carrier at $\beta\approx2.405$?`, back: String.raw`$J_0(2.405)=0$, so the carrier line vanishes — a Bessel null used to calibrate deviation.` },
    { front: String.raw`State Carson's rule.`, back: String.raw`$B_{FM}\approx2(\Delta f+f_m)=2f_m(1+\beta)$, holding ~98% of the power.` },
    { front: String.raw`What is broadcast FM's deviation, message BW and index?`, back: String.raw`$\Delta f=75$ kHz, $f_m=15$ kHz, $\beta=5$; Carson BW $\approx180$ kHz.` },
    { front: String.raw`What is the capture effect?`, back: String.raw`The FM discriminator locks onto the stronger of two co-channel signals and suppresses the weaker.` },
    { front: String.raw`Why does FM tolerate nonlinear PAs?`, back: String.raw`Constant envelope — no information is in amplitude, so amplitude distortion is harmless.` },
    { front: String.raw`What do pre-emphasis and de-emphasis achieve?`, back: String.raw`Boost highs at Tx, cut them at Rx ($75\,\mu$s), flattening the message while cutting the rising HF noise for extra SNR.` },
    { front: String.raw`What is the FM threshold effect?`, back: String.raw`Below ~10 dB input SNR, impulsive "clicks" appear and output SNR collapses rapidly.` },
    { front: String.raw`How does FM output SNR scale with bandwidth?`, back: String.raw`As $\approx3\beta^3$ (cube of bandwidth); doubling $\beta$ gains ~9 dB, above threshold.` },
    { front: String.raw`Role of the limiter before an FM discriminator?`, back: String.raw`It strips amplitude variation (noise/fading), which FM ignores, giving noise immunity.` }
  ],
  mcqs: [
    { q: String.raw`In FM, the peak frequency deviation $\Delta f$ depends on:`, options: [String.raw`Message frequency only`, String.raw`Message amplitude only`, String.raw`Both amplitude and frequency`, String.raw`Carrier frequency`], answer: 1, explain: String.raw`$\Delta f=k_f|m|_{max}$ depends solely on the message amplitude, not its frequency.` },
    { q: String.raw`The FM modulation index is defined as:`, options: [String.raw`$\beta=f_m/\Delta f$`, String.raw`$\beta=\Delta f/f_m$`, String.raw`$\beta=k_f/f_c$`, String.raw`$\beta=\Delta f\cdot f_m$`], answer: 1, explain: String.raw`$\beta=\Delta f/f_m$ is the peak phase deviation in radians.` },
    { q: String.raw`Carson's rule gives the bandwidth of an FM signal with $\Delta f=75$ kHz and $f_m=15$ kHz as:`, options: [String.raw`90 kHz`, String.raw`150 kHz`, String.raw`180 kHz`, String.raw`75 kHz`], answer: 2, explain: String.raw`$B=2(\Delta f+f_m)=2(75+15)=180$ kHz.` },
    { q: String.raw`The carrier component of an FM signal disappears when:`, options: [String.raw`$\beta=1$`, String.raw`$J_0(\beta)=0$ (e.g. $\beta\approx2.405$)`, String.raw`$\beta=0$`, String.raw`$f_m=0$`], answer: 1, explain: String.raw`The carrier amplitude is $A_c J_0(\beta)$; it vanishes at the Bessel nulls $\beta\approx2.405, 5.52,\dots$.` },
    { q: String.raw`Total power in a single-tone FM signal, for any $\beta$, equals:`, options: [String.raw`Increases with $\beta$`, String.raw`$A_c^2/2$ (constant)`, String.raw`$A_c^2\beta^2/2$`, String.raw`Decreases with $\beta$`], answer: 1, explain: String.raw`$\sum_n J_n^2(\beta)=1$, so total power is always $A_c^2/2$ — constant envelope.` },
    { q: String.raw`Narrowband FM ($\beta\ll1$) occupies a bandwidth of approximately:`, options: [String.raw`$2\Delta f$`, String.raw`$2f_m$`, String.raw`$f_m$`, String.raw`$\Delta f$`], answer: 1, explain: String.raw`For small $\beta$, Carson's rule reduces to $\approx2f_m$, the same as AM.` },
    { q: String.raw`The capture effect in FM means:`, options: [String.raw`Both co-channel signals are heard equally`, String.raw`The stronger signal suppresses the weaker`, String.raw`Weak signals dominate`, String.raw`The carrier is captured by noise`], answer: 1, explain: String.raw`The discriminator locks to the stronger signal, suppressing the weaker with only a few dB of capture ratio.` },
    { q: String.raw`Pre-emphasis in FM is applied because output noise power spectral density:`, options: [String.raw`Is flat`, String.raw`Rises with frequency ($\propto f^2$)`, String.raw`Falls with frequency`, String.raw`Is zero`], answer: 1, explain: String.raw`The discriminator's differentiation amplifies HF noise ($\propto f^2$), so highs are pre-boosted and de-emphasised at Rx.` },
    { q: String.raw`Which is an advantage of FM's constant envelope?`, options: [String.raw`Requires a linear PA`, String.raw`Allows efficient nonlinear (Class-C) PAs`, String.raw`Doubles the bandwidth`, String.raw`Removes all sidebands`], answer: 1, explain: String.raw`No information is in the amplitude, so saturating PAs (and limiters) can be used without harming the signal.` },
    { q: String.raw`Above threshold, doubling the FM modulation index $\beta$ improves output SNR by roughly:`, options: [String.raw`3 dB`, String.raw`6 dB`, String.raw`9 dB`, String.raw`No change`], answer: 2, explain: String.raw`SNR $\propto\beta^3$, so a factor-of-2 in $\beta$ is $\times8\approx9$ dB.` },
    { q: String.raw`FM is equivalent to phase modulation of:`, options: [String.raw`The message itself`, String.raw`The integral of the message`, String.raw`The derivative of the message`, String.raw`The carrier`], answer: 1, explain: String.raw`In FM the phase follows $\int m\,d\tau$, so FM = PM of the integrated message.` },
    { q: String.raw`Below the FM threshold, the output exhibits:`, options: [String.raw`Graceful linear SNR degradation`, String.raw`Impulsive clicks and rapid SNR collapse`, String.raw`Improved SNR`, String.raw`Constant SNR`], answer: 1, explain: String.raw`Below ~10 dB input SNR, the discriminator produces clicks and the output SNR falls off a cliff.` }
  ],
  numericals: [
    { q: String.raw`An FM signal has $k_f=10$ kHz/V and message $m(t)=3\cos(2\pi\cdot2000t)$. Find $\Delta f$, $\beta$, and the Carson bandwidth.`, solution: String.raw`<p>$\Delta f=k_f A_m=10\text{ kHz}\times3=30$ kHz.</p><p>$\beta=\Delta f/f_m=30/2=15$.</p><p>$B=2(\Delta f+f_m)=2(30+2)=64$ kHz.</p>` },
    { q: String.raw`Broadcast FM uses $\Delta f=75$ kHz and audio to 15 kHz. Find $\beta$ and Carson bandwidth. If the audio tone drops to 3 kHz at the same deviation, what is the new $\beta$?`, solution: String.raw`<p>$\beta=75/15=5$; $B=2(75+15)=180$ kHz.</p><p>At $f_m=3$ kHz with $\Delta f=75$ kHz: $\beta=75/3=25$ (deviation set by amplitude, so unchanged).</p>` },
    { q: String.raw`An FM transmitter is calibrated using the first carrier null. If the modulating frequency is $f_m=1$ kHz, what deviation $\Delta f$ produces the first $J_0$ null?`, solution: String.raw`<p>First $J_0$ null at $\beta=2.405$. So $\Delta f=\beta f_m=2.405\times1\text{ kHz}=2.405$ kHz.</p>` },
    { q: String.raw`A message of bandwidth $W=5$ kHz frequency-modulates a carrier with $\beta=3$. Estimate the transmission bandwidth by Carson's rule.`, solution: String.raw`<p>$\Delta f=\beta W=3\times5=15$ kHz. $B=2(\Delta f+W)=2(15+5)=40$ kHz.</p>` },
    { q: String.raw`Compare NBFM and WBFM bandwidth for $f_m=4$ kHz with $\beta=0.2$ vs $\beta=8$.`, solution: String.raw`<p>NBFM: $B=2(1+0.2)(4)=9.6$ kHz $\approx2f_m$. WBFM: $\Delta f=8\times4=32$ kHz, $B=2(32+4)=72$ kHz $\approx2\Delta f$.</p>` },
    { q: String.raw`Above threshold, an FM system operates at $\beta=5$. By how many dB does its output SNR exceed the baseline (using $3\beta^2(\beta+1)$)?`, solution: String.raw`<p>Gain $=3\beta^2(\beta+1)=3\times25\times6=450$. In dB: $10\log_{10}450=26.5$ dB above the baseband reference.</p>` },
    { q: String.raw`An FM signal has instantaneous frequency $f_i(t)=100\text{ MHz}+5000\cos(2\pi\cdot1000t)$ Hz. Find $\Delta f$, $f_m$, $\beta$.`, solution: String.raw`<p>$\Delta f=5000$ Hz $=5$ kHz; $f_m=1000$ Hz $=1$ kHz; $\beta=\Delta f/f_m=5$.</p>` },
    { q: String.raw`FM channels are spaced 200 kHz. If a station uses $f_m=15$ kHz, what maximum deviation keeps the Carson bandwidth within 180 kHz?`, solution: String.raw`<p>$B=2(\Delta f+f_m)\le180\Rightarrow\Delta f\le90-15=75$ kHz — exactly the standard broadcast deviation, leaving a 20 kHz guard band within the 200 kHz slot.</p>` }
  ],
  realWorld: String.raw`<p>Wideband FM is why broadcast radio (88–108 MHz) sounds so clean: its $\beta=5$ index and the pre-/de-emphasis pairing deliver hi-fi audio with strong noise immunity, and the capture effect makes co-channel interference switch cleanly rather than blur. Narrowband FM (and its digital cousins) runs two-way land-mobile radio, aviation ILS marker beacons, and countless embedded telemetry links, prized for the constant envelope that lets cheap Class-C amplifiers run at high efficiency. FM's bandwidth-for-SNR trade also inspired spread-spectrum thinking, and the frequency discriminator lives on in modern PLL-based demodulators inside every SDR. Even GPS and many satellite links exploit angle modulation's constant-envelope robustness against the nonlinear, power-limited amplifiers aboard spacecraft.</p>`,
  related: ['am', 'comm-basics', 'bandwidth', 'pll', 'noise']
},
{
  id: 'qpsk',
  title: 'QPSK',
  category: 'Modulation & Detection',
  tags: ['QPSK', 'digital modulation', 'I/Q', 'constellation', 'Gray coding', 'BER', 'offset QPSK', 'PAPR', 'phase shift keying'],
  summary: String.raw`QPSK sends two bits per symbol using four carrier phases, structured as two orthogonal BPSK streams on the I and Q axes, doubling spectral efficiency at the same per-bit BER as BPSK.`,
  diagram: {
    svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr-qpsk" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <rect x="15" y="85" width="90" height="45" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="60" y="103" fill="#e6edf3" text-anchor="middle">bits</text>
  <text x="60" y="119" fill="#9aa7b5" text-anchor="middle">serial→parallel</text>
  <rect x="150" y="35" width="120" height="45" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="210" y="55" fill="#e6edf3" text-anchor="middle">I arm</text>
  <text x="210" y="71" fill="#9aa7b5" text-anchor="middle">× cos(ω_c t)</text>
  <rect x="150" y="135" width="120" height="45" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="210" y="155" fill="#e6edf3" text-anchor="middle">Q arm</text>
  <text x="210" y="171" fill="#9aa7b5" text-anchor="middle">× (−sin ω_c t)</text>
  <circle cx="345" cy="107" r="18" fill="#1c232e" stroke="#b197fc"/>
  <text x="345" y="112" fill="#e6edf3" text-anchor="middle">Σ</text>
  <rect x="420" y="85" width="100" height="45" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="470" y="112" fill="#e6edf3" text-anchor="middle">QPSK s(t)</text>
  <line x1="105" y1="100" x2="148" y2="65" stroke="#9aa7b5" marker-end="url(#arr-qpsk)"/>
  <line x1="105" y1="115" x2="148" y2="152" stroke="#9aa7b5" marker-end="url(#arr-qpsk)"/>
  <text x="127" y="80" fill="#9aa7b5">I</text>
  <text x="127" y="150" fill="#9aa7b5">Q</text>
  <line x1="270" y1="57" x2="332" y2="97" stroke="#9aa7b5" marker-end="url(#arr-qpsk)"/>
  <line x1="270" y1="157" x2="332" y2="117" stroke="#9aa7b5" marker-end="url(#arr-qpsk)"/>
  <line x1="363" y1="107" x2="418" y2="107" stroke="#9aa7b5" marker-end="url(#arr-qpsk)"/>
  <text x="270" y="210" fill="#9aa7b5" text-anchor="middle">two orthogonal BPSK arms; 2 bits/symbol at 4 phases</text>
</svg>`,
    caption: String.raw`QPSK mechanism: serial-to-parallel splits bits into I and Q BPSK arms modulated on cos and −sin, then summed — two orthogonal BPSK streams.`
  },
  prerequisites: ['bpsk', 'comm-basics', 'ber', 'eb-no', 'matched-filter'],
  intro: String.raw`<p>Quadrature Phase Shift Keying (QPSK) is the workhorse of digital communications: it carries <strong>two bits per symbol</strong> by choosing one of four carrier phases, typically $\{45°,135°,225°,315°\}$. The deep insight is that QPSK is nothing more than <em>two independent BPSK signals sent simultaneously on orthogonal carriers</em> — a cosine (in-phase, I) and a sine (quadrature, Q) — that do not interfere because $\cos$ and $\sin$ are orthogonal over a symbol. This orthogonality is what lets QPSK achieve <strong>twice the spectral efficiency of BPSK</strong> (2 bit/s/Hz) while, with Gray coding, keeping exactly the <strong>same bit error rate per bit</strong>: $\text{BER}=Q(\sqrt{2E_b/N_0})$. From that single I/Q idea flow all the practical variants — offset QPSK and $\pi/4$-QPSK to tame envelope transitions, and the PAPR concerns that shape real transmitter design.</p>`,
  sections: [
    {
      h: 'Four phases, two bits: the QPSK signal',
      html: String.raw`<p>QPSK maps each pair of bits to one of four equally spaced carrier phases. A common form is</p>
      <p>$$s_i(t)=A\cos\!\left(2\pi f_c t+\frac{(2i-1)\pi}{4}\right),\quad i=1,2,3,4,$$</p>
      <p>giving phases $45°, 135°, 225°, 315°$. Expanding with the angle-sum identity reveals the I/Q structure:</p>
      <p>$$s(t)=\underbrace{A\cos\phi_i}_{I}\cos(2\pi f_c t)-\underbrace{A\sin\phi_i}_{Q}\sin(2\pi f_c t).$$</p>
      <p>Each of $\cos\phi_i$ and $\sin\phi_i$ takes only the values $\pm A/\sqrt2$, so QPSK is literally two BPSK signals — one riding $\cos$, one riding $\sin$ — each carrying one bit. The four constellation points sit on a circle of radius $A$ at the corners of a square.</p>
      <div class="callout"><strong>Symbol energy vs bit energy:</strong> Each QPSK symbol carries 2 bits, so $E_s=2E_b$. The constellation radius (symbol energy) is double the per-bit energy — a fact that keeps QPSK's per-bit performance identical to BPSK.</div></p>`
    },
    {
      h: 'The I/Q decomposition: two orthogonal BPSK channels',
      html: String.raw`<p>The magic of QPSK is orthogonality. The transmitted signal is</p>
      <p>$$s(t)=I(t)\cos(2\pi f_c t)-Q(t)\sin(2\pi f_c t),$$</p>
      <p>where $I(t),Q(t)\in\{+A/\sqrt2,-A/\sqrt2\}$ carry the even and odd bits of the stream respectively. Because $\int_0^{T_s}\cos(2\pi f_c t)\sin(2\pi f_c t)\,dt\approx0$, a receiver can recover I and Q <em>separately</em> by correlating against $\cos$ and $\sin$:</p>
      <ul>
        <li>Multiply the received signal by $\cos(2\pi f_c t)$ and integrate over $T_s$ → recovers $I$ (the second, quadrature term averages to zero).</li>
        <li>Multiply by $-\sin(2\pi f_c t)$ and integrate → recovers $Q$.</li>
      </ul>
      <p>Thus a QPSK receiver is two parallel BPSK detectors. The two bits per symbol are decided independently, and — crucially — noise on the I arm is independent of noise on the Q arm. This independence is the reason QPSK's per-bit error rate matches BPSK's exactly.</p></p>`
    },
    {
      h: 'Constellation and Gray coding',
      html: String.raw`<p>The QPSK constellation is four points on a circle. How we assign bit pairs to points matters enormously. With <strong>Gray coding</strong>, adjacent constellation points differ by exactly one bit:</p>
      <table class="data">
        <tr><th>Phase</th><th>Gray bits (I,Q)</th><th>I</th><th>Q</th></tr>
        <tr><td>$45°$</td><td>00</td><td>$+$</td><td>$+$</td></tr>
        <tr><td>$135°$</td><td>01</td><td>$-$</td><td>$+$</td></tr>
        <tr><td>$225°$</td><td>11</td><td>$-$</td><td>$-$</td></tr>
        <tr><td>$315°$</td><td>10</td><td>$+$</td><td>$-$</td></tr>
      </table>
      <p>Why it matters: the most likely error is a slip to an <em>adjacent</em> phase (the nearest neighbour). With Gray coding that neighbour differs by only one bit, so each symbol error usually causes just one bit error. Without Gray coding, some adjacent slips would flip two bits at once, nearly doubling the BER. Gray coding is what makes the tidy identity $\text{BER}\approx\tfrac12\text{SER}$ hold and preserves BPSK-equivalent per-bit performance.</p></p>`
    },
    {
      h: 'Bit and symbol error rates',
      html: String.raw`<p>Because I and Q are independent BPSK channels each carrying energy $E_b$ per bit, the <strong>bit error rate</strong> of QPSK is identical to BPSK:</p>
      <p>$$\text{BER}_{QPSK}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right).$$</p>
      <p>The <strong>symbol error rate</strong> is the probability that <em>either</em> arm errs. With $p=Q(\sqrt{2E_b/N_0})$ per arm and independence,</p>
      <p>$$\text{SER}=1-(1-p)^2=2p-p^2\approx 2p=2Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right),$$</p>
      <p>for small $p$. So QPSK's SER is about twice its BER, but its BER per bit is unchanged from BPSK. This is the headline result: <strong>QPSK doubles data rate for the same bandwidth and the same $E_b/N_0$, at no BER penalty.</strong> The one subtlety: at the same <em>symbol</em> energy $E_s$, QPSK points are closer together than BPSK's, but since each symbol carries twice the bits, the per-bit accounting comes out even.</p>
      <div class="callout"><strong>Common confusion resolved:</strong> "QPSK is worse than BPSK because the points are closer" is a per-symbol view. Per bit, at equal $E_b/N_0$, they are identical — the doubled bits exactly compensate the halved distance.</div></p>`
    },
    {
      h: 'Bandwidth efficiency',
      html: String.raw`<p>QPSK transmits 2 bits per symbol, so for a symbol rate $R_s$ the bit rate is $R_b=2R_s$. The occupied bandwidth is set by the symbol rate (and pulse shaping), so:</p>
      <p>$$\eta=\frac{R_b}{B}.$$</p>
      <p>With ideal Nyquist signalling the minimum bandwidth is $B=R_s$ (passband), giving $\eta=2$ bit/s/Hz — <strong>double BPSK's 1 bit/s/Hz</strong>. In practice, root-raised-cosine shaping with roll-off $\beta$ makes $B=(1+\beta)R_s$, so $\eta=2/(1+\beta)$. For $\beta=0.35$, $\eta\approx1.48$ bit/s/Hz. QPSK's doubling of efficiency at no BER cost is precisely why it is the default choice when spectrum is scarce: it packs twice the data of BPSK into the same channel with the same link margin.</p>
      <table class="data">
        <tr><th>Scheme</th><th>Bits/symbol</th><th>$\eta$ (ideal)</th><th>BER at fixed $E_b/N_0$</th></tr>
        <tr><td>BPSK</td><td>1</td><td>1</td><td>$Q(\sqrt{2E_b/N_0})$</td></tr>
        <tr><td>QPSK</td><td>2</td><td>2</td><td>$Q(\sqrt{2E_b/N_0})$ (same)</td></tr>
        <tr><td>8-PSK</td><td>3</td><td>3</td><td>Worse (points closer)</td></tr>
      </table></p>`
    },
    {
      h: 'Variants: Offset-QPSK and π/4-QPSK',
      html: String.raw`<p>Standard QPSK has a problem: when both I and Q bits flip simultaneously the phase jumps by $180°$, and the signal trajectory passes through the <em>origin</em>. After pulse shaping this creates a deep envelope dip toward zero, forcing a nonlinear PA to reproduce a large amplitude swing — bad for efficiency and spectral regrowth. Two variants fix this:</p>
      <ul>
        <li><strong>Offset QPSK (OQPSK):</strong> delay the Q stream by half a symbol ($T_s/2$). Now I and Q never transition at the same instant, so phase changes are limited to $\pm90°$ — the trajectory never crosses the origin. The envelope dips less, easing PA linearity requirements. Used in IEEE 802.15.4 (Zigbee) and older CDMA reverse links.</li>
        <li><strong>$\pi/4$-QPSK:</strong> alternate between two QPSK constellations rotated by $45°$ each symbol. Maximum phase change is $\pm135°$ (never $180°$), avoiding the origin, and — a practical bonus — it can be differentially detected, needing no absolute phase reference. Used in TETRA, TDMA cellular (IS-136) and some satellite systems.</li>
      </ul>
      <div class="callout"><strong>The theme:</strong> All three carry the same 2 bits/symbol with the same BER; the variants differ only in how the phase <em>transitions</em> behave, trading constellation complexity for a friendlier envelope.</div></p>`
    },
    {
      h: 'Peak-to-average power ratio (PAPR)',
      html: String.raw`<p>An unfiltered QPSK signal is constant-envelope (all four points share radius $A$), giving PAPR $=0$ dB. But <em>pulse shaping</em> destroys the constant envelope: as the signal transitions between symbols the shaped waveform rings and, for standard QPSK, dives toward the origin on $180°$ transitions, producing envelope peaks well above the average. This <strong>peak-to-average power ratio</strong> matters because a power amplifier must be backed off from saturation to accommodate the peaks linearly — wasting DC power and battery.</p>
      <ul>
        <li>Standard filtered QPSK: PAPR typically 3–4 dB (origin crossings on $180°$ jumps).</li>
        <li>OQPSK / $\pi/4$-QPSK: lower PAPR because origin crossings are avoided.</li>
        <li>Contrast with OFDM (many subcarriers), where PAPR can reach 10+ dB — a far worse problem.</li>
      </ul>
      <p>PAPR is the reason handset designers favour OQPSK-like schemes: a lower PAPR lets the PA run closer to saturation (higher efficiency, longer battery life) without violating the spectral mask through nonlinear regrowth.</p></p>`
    }
  ],
  keyPoints: [
    String.raw`QPSK carries 2 bits/symbol using 4 phases ($45°,135°,225°,315°$); $E_s=2E_b$.`,
    String.raw`It is two orthogonal BPSK channels: $s(t)=I(t)\cos\omega_c t-Q(t)\sin\omega_c t$, with $I,Q\in\{\pm A/\sqrt2\}$.`,
    String.raw`Orthogonality of $\cos$ and $\sin$ lets the receiver recover I and Q independently by correlation.`,
    String.raw`Gray coding assigns adjacent points to 1-bit-different pairs, so each symbol error causes ~1 bit error.`,
    String.raw`BER $=Q(\sqrt{2E_b/N_0})$ — identical to BPSK per bit.`,
    String.raw`SER $=2p-p^2\approx2Q(\sqrt{2E_b/N_0})$, about twice the BER for small $p$.`,
    String.raw`Bandwidth efficiency $\eta=2$ bit/s/Hz (ideal), double BPSK; $\eta=2/(1+\beta)$ with RRC roll-off $\beta$.`,
    String.raw`QPSK doubles the data rate of BPSK at the same bandwidth and same $E_b/N_0$, with no BER penalty.`,
    String.raw`Standard QPSK $180°$ transitions cross the origin, causing envelope dips and higher PAPR.`,
    String.raw`OQPSK delays Q by $T_s/2$, limiting phase steps to $\pm90°$ and avoiding origin crossings.`,
    String.raw`$\pi/4$-QPSK rotates the constellation $45°$ each symbol, caps steps at $\pm135°$, and allows differential detection.`,
    String.raw`Lower PAPR (OQPSK, $\pi/4$-QPSK) lets the PA run nearer saturation for higher efficiency and less spectral regrowth.`
  ],
  equations: [
    {
      title: 'QPSK signal and I/Q decomposition',
      tex: String.raw`$$s(t)=I\cos(2\pi f_c t)-Q\sin(2\pi f_c t),\quad I,Q\in\{\pm A/\sqrt2\}$$`,
      derivation: String.raw`<p><b>Where we start.</b> QPSK picks one of four phases: $s_i(t)=A\cos(2\pi f_c t+\phi_i)$ with $\phi_i\in\{45°,135°,225°,315°\}$.</p>
      <p><b>Step 1 — expand the phase using the angle-sum identity.</b> $\cos(x+\phi)=\cos x\cos\phi-\sin x\sin\phi$, so</p>
      $$s_i(t)=A\cos\phi_i\cos(2\pi f_c t)-A\sin\phi_i\sin(2\pi f_c t).$$
      <p><b>Step 2 — evaluate the coefficients.</b> For $\phi_i=\pm45°,\pm135°$, both $\cos\phi_i$ and $\sin\phi_i$ equal $\pm1/\sqrt2$. Define $I=A\cos\phi_i$ and $Q=A\sin\phi_i$, each in $\{+A/\sqrt2,-A/\sqrt2\}$.</p>
      <p><b>Step 3 — interpret.</b> The signal is a sum of a cosine (in-phase) carrying $I$ and a sine (quadrature) carrying $Q$ — two independent binary streams.</p>
      <p><b>Result.</b> $$s(t)=I\cos(2\pi f_c t)-Q\sin(2\pi f_c t).$$ Sanity check: each of $I,Q$ carries one bit ($\pm$), so the symbol carries 2 bits, consistent with 4 phases $=2^2$.</p>`
    },
    {
      title: 'Orthogonality of the I and Q carriers',
      tex: String.raw`$$\int_0^{T_s}\cos(2\pi f_c t)\sin(2\pi f_c t)\,dt\approx 0$$`,
      derivation: String.raw`<p><b>Where we start.</b> We must show the I and Q carriers do not interfere, so the receiver can separate them.</p>
      <p><b>Step 1 — use a product-to-sum identity.</b> $\cos\theta\sin\theta=\tfrac12\sin(2\theta)$, so with $\theta=2\pi f_c t$:</p>
      $$\cos(2\pi f_c t)\sin(2\pi f_c t)=\tfrac12\sin(4\pi f_c t).$$
      <p><b>Step 2 — integrate over a symbol.</b></p>
      $$\int_0^{T_s}\tfrac12\sin(4\pi f_c t)\,dt=\left[-\frac{\cos(4\pi f_c t)}{8\pi f_c}\right]_0^{T_s}.$$
      <p><b>Step 3 — bound it.</b> When $f_c T_s$ is a large integer (many carrier cycles per symbol), the bracket evaluates to zero; in general it is $O(1/f_c T_s)\approx0$.</p>
      <p><b>Result.</b> $$\int_0^{T_s}\cos\sin\,dt\approx0.$$ Sanity check: this orthogonality is exactly what lets a correlator against $\cos$ ignore the $Q$ term and recover $I$ alone.</p>`
    },
    {
      title: 'QPSK bit error rate',
      tex: String.raw`$$\text{BER}_{QPSK}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)$$`,
      derivation: String.raw`<p><b>Where we start.</b> QPSK = two independent BPSK channels (I and Q). Analyse one arm.</p>
      <p><b>Step 1 — one arm is BPSK.</b> The I channel sends $\pm A/\sqrt2$ against $\cos$; over a symbol its energy is $E_s/2=E_b$ per bit (since $E_s=2E_b$). A matched filter yields decision variable $r=\pm\sqrt{E_b}+n$, with noise $n\sim\mathcal{N}(0,N_0/2)$.</p>
      <p><b>Step 2 — probability of error on one arm.</b> An error occurs if noise crosses the midpoint (0). The distance from each signal point to the threshold is $\sqrt{E_b}$, so:</p>
      $$P_b=Q\!\left(\frac{\sqrt{E_b}}{\sqrt{N_0/2}}\right)=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right).$$
      <p><b>Step 3 — both arms behave identically.</b> With Gray coding each arm's bit is decided independently and each carries the same $E_b$, so the overall per-bit BER equals the single-arm result.</p>
      <p><b>Result.</b> $$\text{BER}_{QPSK}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right).$$ Sanity check: identical to BPSK — the doubled bits/symbol exactly offset the halved inter-symbol distance.</p>`
    },
    {
      title: 'QPSK symbol error rate',
      tex: String.raw`$$\text{SER}=2p-p^2\approx 2Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)$$`,
      derivation: String.raw`<p><b>Where we start.</b> A symbol is correct only if <em>both</em> the I bit and the Q bit are correct. Let $p=Q(\sqrt{2E_b/N_0})$ be the per-arm error probability.</p>
      <p><b>Step 1 — probability both arms correct.</b> The arms are independent (orthogonal, independent noise), so $P(\text{both correct})=(1-p)^2$.</p>
      <p><b>Step 2 — complement for symbol error.</b></p>
      $$\text{SER}=1-(1-p)^2=1-(1-2p+p^2)=2p-p^2.$$
      <p><b>Step 3 — small-error approximation.</b> For high SNR $p\ll1$, so $p^2$ is negligible:</p>
      $$\text{SER}\approx 2p=2Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right).$$
      <p><b>Result.</b> $$\text{SER}\approx2Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right).$$ Sanity check: SER $\approx2\times$BER, consistent with two independent bit-decisions per symbol.</p>`
    },
    {
      title: 'Bandwidth efficiency',
      tex: String.raw`$$\eta=\frac{R_b}{B}=\frac{2}{1+\beta}\ \text{bit/s/Hz}$$`,
      derivation: String.raw`<p><b>Where we start.</b> QPSK carries 2 bits per symbol, so $R_b=2R_s$. Bandwidth is set by the pulse shaping.</p>
      <p><b>Step 1 — passband bandwidth with RRC shaping.</b> Root-raised-cosine pulses at symbol rate $R_s$ with roll-off $\beta$ occupy passband bandwidth $B=(1+\beta)R_s$.</p>
      <p><b>Step 2 — form the ratio.</b></p>
      $$\eta=\frac{R_b}{B}=\frac{2R_s}{(1+\beta)R_s}=\frac{2}{1+\beta}.$$
      <p><b>Step 3 — ideal limit.</b> As $\beta\to0$, $\eta\to2$ bit/s/Hz — double BPSK's ideal 1 bit/s/Hz.</p>
      <p><b>Result.</b> $$\eta=\frac{2}{1+\beta}.$$ Sanity check: for $\beta=0.35$, $\eta=2/1.35\approx1.48$ bit/s/Hz — the practical figure for many QPSK links.</p>`
    },
    {
      title: 'Symbol energy vs bit energy',
      tex: String.raw`$$E_s=2E_b$$`,
      derivation: String.raw`<p><b>Where we start.</b> A QPSK symbol conveys 2 bits. Its energy is spread across those bits.</p>
      <p><b>Step 1 — count bits per symbol.</b> QPSK has $M=4$ points, so bits/symbol $=\log_2 M=\log_2 4=2$.</p>
      <p><b>Step 2 — relate energies.</b> Total symbol energy divided over the bits it carries gives the per-bit energy: $E_b=E_s/\log_2 M=E_s/2$.</p>
      <p><b>Step 3 — invert.</b></p>
      $$E_s=2E_b.$$
      <p><b>Result.</b> $$E_s=2E_b.$$ Sanity check: for general $M$-ary, $E_s=E_b\log_2 M$; QPSK ($M=4$) gives the factor 2, and this is why QPSK's larger symbol energy keeps its per-bit BER equal to BPSK's.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`How many bits per symbol does QPSK carry, and how?`, back: String.raw`2 bits, via 4 carrier phases (e.g. $45°,135°,225°,315°$).` },
    { front: String.raw`Write the I/Q form of a QPSK signal.`, back: String.raw`$s(t)=I\cos\omega_c t-Q\sin\omega_c t$, with $I,Q\in\{\pm A/\sqrt2\}$.` },
    { front: String.raw`Why can a QPSK receiver separate I and Q?`, back: String.raw`$\cos$ and $\sin$ are orthogonal over a symbol, so correlating against each recovers one arm without the other.` },
    { front: String.raw`What is the QPSK BER?`, back: String.raw`$Q(\sqrt{2E_b/N_0})$ — the same per bit as BPSK.` },
    { front: String.raw`What is the QPSK SER for small error probability?`, back: String.raw`$\approx2Q(\sqrt{2E_b/N_0})\approx2\times$BER (either arm may err).` },
    { front: String.raw`Why does Gray coding help QPSK?`, back: String.raw`Adjacent points differ by 1 bit, so the most likely (adjacent) symbol slip flips only one bit.` },
    { front: String.raw`Relationship between symbol and bit energy in QPSK?`, back: String.raw`$E_s=2E_b$ (2 bits per symbol).` },
    { front: String.raw`Ideal bandwidth efficiency of QPSK?`, back: String.raw`2 bit/s/Hz — double BPSK; $2/(1+\beta)$ with RRC roll-off $\beta$.` },
    { front: String.raw`Is QPSK worse than BPSK in BER?`, back: String.raw`No — per bit it is identical at the same $E_b/N_0$; it just carries twice the data in the same bandwidth.` },
    { front: String.raw`What problem occurs on a $180°$ QPSK transition?`, back: String.raw`The trajectory crosses the origin, causing a deep envelope dip and higher PAPR.` },
    { front: String.raw`How does OQPSK avoid origin crossings?`, back: String.raw`It delays the Q stream by $T_s/2$ so I and Q never switch together; phase steps are limited to $\pm90°$.` },
    { front: String.raw`What is distinctive about $\pi/4$-QPSK?`, back: String.raw`It alternates two constellations $45°$ apart (max step $\pm135°$) and supports differential detection.` },
    { front: String.raw`Why does PAPR matter for QPSK transmitters?`, back: String.raw`Higher PAPR forces PA back-off, wasting efficiency; lower PAPR lets the PA run near saturation.` },
    { front: String.raw`What is the max phase change in OQPSK?`, back: String.raw`$\pm90°$, because I and Q never transition simultaneously.` },
    { front: String.raw`How is QPSK detected coherently?`, back: String.raw`Two parallel correlators/matched filters against $\cos$ and $-\sin$, then independent sign decisions on I and Q.` }
  ],
  mcqs: [
    { q: String.raw`How many bits does each QPSK symbol carry?`, options: [String.raw`1`, String.raw`2`, String.raw`3`, String.raw`4`], answer: 1, explain: String.raw`4 phases $=2^2$, so 2 bits per symbol.` },
    { q: String.raw`The bit error rate of Gray-coded QPSK equals:`, options: [String.raw`$Q(\sqrt{E_b/N_0})$`, String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$2Q(\sqrt{2E_b/N_0})$`, String.raw`$\frac{1}{2}Q(\sqrt{E_b/N_0})$`], answer: 1, explain: String.raw`QPSK BER is identical to BPSK: $Q(\sqrt{2E_b/N_0})$.` },
    { q: String.raw`QPSK can be viewed as:`, options: [String.raw`Two BPSK signals on orthogonal carriers`, String.raw`Two FSK signals`, String.raw`A single AM signal`, String.raw`Four independent carriers`], answer: 0, explain: String.raw`I and Q are BPSK streams on $\cos$ and $\sin$, which are orthogonal.` },
    { q: String.raw`The ideal bandwidth efficiency of QPSK is:`, options: [String.raw`1 bit/s/Hz`, String.raw`2 bit/s/Hz`, String.raw`4 bit/s/Hz`, String.raw`0.5 bit/s/Hz`], answer: 1, explain: String.raw`2 bits/symbol at minimum Nyquist bandwidth gives 2 bit/s/Hz.` },
    { q: String.raw`Compared to BPSK at the same $E_b/N_0$, QPSK has:`, options: [String.raw`Worse BER`, String.raw`Better BER`, String.raw`Identical BER, double the data rate`, String.raw`Half the data rate`], answer: 2, explain: String.raw`Per bit the BER is the same; QPSK doubles throughput in the same bandwidth.` },
    { q: String.raw`Gray coding in QPSK ensures that:`, options: [String.raw`Each symbol error causes two bit errors`, String.raw`Adjacent constellation points differ by one bit`, String.raw`All symbols have the same phase`, String.raw`The carrier is suppressed`], answer: 1, explain: String.raw`Adjacent points differ by a single bit, so the likely adjacent slip flips only one bit.` },
    { q: String.raw`The relationship between symbol and bit energy in QPSK is:`, options: [String.raw`$E_s=E_b$`, String.raw`$E_s=2E_b$`, String.raw`$E_s=4E_b$`, String.raw`$E_s=E_b/2$`], answer: 1, explain: String.raw`Two bits per symbol means $E_s=2E_b$.` },
    { q: String.raw`Offset QPSK (OQPSK) differs from QPSK by:`, options: [String.raw`Using 8 phases`, String.raw`Delaying the Q stream by half a symbol`, String.raw`Doubling the bandwidth`, String.raw`Removing Gray coding`], answer: 1, explain: String.raw`The half-symbol Q offset prevents simultaneous I/Q transitions, avoiding origin crossings.` },
    { q: String.raw`The maximum phase change in OQPSK is:`, options: [String.raw`$\pm45°$`, String.raw`$\pm90°$`, String.raw`$\pm135°$`, String.raw`$\pm180°$`], answer: 1, explain: String.raw`Since I and Q never switch together, the phase can change by at most $\pm90°$.` },
    { q: String.raw`Why is a $180°$ phase transition in standard QPSK undesirable?`, options: [String.raw`It increases BER`, String.raw`It crosses the origin, raising PAPR`, String.raw`It reduces bandwidth`, String.raw`It flips the carrier frequency`], answer: 1, explain: String.raw`Origin crossings cause deep envelope dips, increasing PAPR and demanding PA linearity.` },
    { q: String.raw`$\pi/4$-QPSK is notable because it:`, options: [String.raw`Uses only two phases`, String.raw`Allows differential detection and avoids $180°$ jumps`, String.raw`Has the highest PAPR`, String.raw`Cannot be Gray coded`], answer: 1, explain: String.raw`Rotating the constellation $45°$ each symbol caps the phase step at $\pm135°$ and enables differential detection.` },
    { q: String.raw`The QPSK symbol error rate for small $p=Q(\sqrt{2E_b/N_0})$ is about:`, options: [String.raw`$p/2$`, String.raw`$p$`, String.raw`$2p$`, String.raw`$4p$`], answer: 2, explain: String.raw`$\text{SER}=2p-p^2\approx2p$; either arm erring causes a symbol error.` }
  ],
  numericals: [
    { q: String.raw`A QPSK link operates at $E_b/N_0=9.6$ dB. Estimate the BER. (Use $Q(x)$ with $x=\sqrt{2E_b/N_0}$.)`, solution: String.raw`<p>$E_b/N_0=10^{0.96}\approx9.12$ (linear). $x=\sqrt{2\times9.12}=\sqrt{18.24}\approx4.27$.</p><p>$\text{BER}=Q(4.27)\approx1\times10^{-5}$ — the classic QPSK operating point.</p>` },
    { q: String.raw`A QPSK system transmits at symbol rate $R_s=5$ Msym/s. Find the bit rate and the ideal bandwidth efficiency.`, solution: String.raw`<p>$R_b=2R_s=10$ Mb/s. Ideal bandwidth $B=R_s=5$ MHz, so $\eta=R_b/B=10/5=2$ bit/s/Hz.</p>` },
    { q: String.raw`A channel of 6 MHz (passband) uses QPSK with RRC roll-off $\beta=0.25$. Find the maximum symbol rate and bit rate.`, solution: String.raw`<p>$B=(1+\beta)R_s\Rightarrow R_s=6/1.25=4.8$ Msym/s. $R_b=2R_s=9.6$ Mb/s. Efficiency $\eta=9.6/6=1.6$ bit/s/Hz.</p>` },
    { q: String.raw`At $E_b/N_0=10.5$ dB, compute the QPSK BER and the approximate SER.`, solution: String.raw`<p>$E_b/N_0=10^{1.05}\approx11.2$. $x=\sqrt{2\times11.2}=\sqrt{22.4}\approx4.73$. $\text{BER}=Q(4.73)\approx1.1\times10^{-6}$.</p><p>$\text{SER}\approx2\times\text{BER}\approx2.3\times10^{-6}$.</p>` },
    { q: String.raw`Compare the throughput of BPSK and QPSK over a 10 MHz channel (ideal Nyquist).`, solution: String.raw`<p>BPSK: 1 bit/s/Hz $\Rightarrow$ 10 Mb/s. QPSK: 2 bit/s/Hz $\Rightarrow$ 20 Mb/s. QPSK doubles throughput at the same BER and $E_b/N_0$.</p>` },
    { q: String.raw`A QPSK symbol has amplitude $A=2$ V (constellation radius). Find the per-arm amplitude and the symbol energy over $T_s=1\,\mu$s (into $1\,\Omega$).`, solution: String.raw`<p>Per-arm amplitude $=A/\sqrt2=2/1.414=1.414$ V. Symbol energy $E_s=\tfrac12 A^2 T_s=\tfrac12(4)(10^{-6})=2\times10^{-6}$ J. Per-bit $E_b=E_s/2=1\times10^{-6}$ J.</p>` },
    { q: String.raw`A QPSK modem targets $R_b=100$ Mb/s. What symbol rate is needed, and what channel bandwidth for $\beta=0.2$?`, solution: String.raw`<p>$R_s=R_b/2=50$ Msym/s. $B=(1+\beta)R_s=1.2\times50=60$ MHz.</p>` }
  ],
  realWorld: String.raw`<p>QPSK is arguably the single most-used digital modulation on Earth. It carries the control and lower-rate data channels of virtually every cellular standard from 3G through 5G (where it is the robust base of the adaptive-modulation ladder), the physical layer of satellite links (DVB-S/S2, GPS's navigation data on the I channel), cable modems, and countless microwave backhaul hops. Its variants are everywhere the envelope matters: OQPSK underlies Zigbee (802.15.4) and the older CDMA reverse link, while $\pi/4$-DQPSK powered TETRA public-safety radio and TDMA cellular. In an SDR, QPSK modulation and demodulation are a few lines of I/Q arithmetic, and the same I/Q correlator that demodulates QPSK is the front end for QAM, making QPSK the conceptual gateway to all higher-order modulation.</p>`,
  related: ['bpsk', 'ber', 'eb-no', 'rrc-filter', 'matched-filter']
},
{
  id: 'rrc-filter',
  title: 'Root-Raised-Cosine Filter',
  category: 'Modulation & Detection',
  tags: ['RRC', 'raised cosine', 'matched filter', 'Nyquist', 'pulse shaping', 'roll-off', 'ISI', 'excess bandwidth'],
  summary: String.raw`The root-raised-cosine filter splits a Nyquist raised-cosine response equally between transmitter and receiver so their cascade is ISI-free while the receiver is simultaneously a matched filter.`,
  diagram: {
    svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr-rrc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <rect x="15" y="45" width="70" height="48" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="50" y="74" fill="#e6edf3" text-anchor="middle">Tx bits</text>
  <rect x="120" y="45" width="90" height="48" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="165" y="67" fill="#e6edf3" text-anchor="middle">RRC</text>
  <text x="165" y="83" fill="#9aa7b5" text-anchor="middle">√H_RC</text>
  <rect x="245" y="45" width="90" height="48" rx="6" fill="#1c232e" stroke="#9aa7b5"/>
  <text x="290" y="74" fill="#e6edf3" text-anchor="middle">channel</text>
  <rect x="370" y="45" width="90" height="48" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="415" y="63" fill="#e6edf3" text-anchor="middle">RRC</text>
  <text x="415" y="79" fill="#9aa7b5" text-anchor="middle">matched</text>
  <circle cx="500" cy="69" r="14" fill="#1c232e" stroke="#b197fc"/>
  <text x="500" y="73" fill="#e6edf3" text-anchor="middle">↓</text>
  <line x1="85" y1="69" x2="118" y2="69" stroke="#9aa7b5" marker-end="url(#arr-rrc)"/>
  <line x1="210" y1="69" x2="243" y2="69" stroke="#9aa7b5" marker-end="url(#arr-rrc)"/>
  <line x1="335" y1="69" x2="368" y2="69" stroke="#9aa7b5" marker-end="url(#arr-rrc)"/>
  <line x1="460" y1="69" x2="484" y2="69" stroke="#9aa7b5" marker-end="url(#arr-rrc)"/>
  <text x="500" y="105" fill="#9aa7b5" text-anchor="middle">sample</text>
  <text x="270" y="150" fill="#b197fc" text-anchor="middle">RRC × RRC = raised cosine (Nyquist, zero-ISI)</text>
  <text x="270" y="175" fill="#9aa7b5" text-anchor="middle">a lone RRC is NOT zero-ISI; only the Tx+Rx cascade is</text>
</svg>`,
    caption: String.raw`RRC mechanism: identical √H_RC filters at Tx and Rx; their cascade forms the Nyquist raised cosine while the Rx is a matched filter.`
  },
  prerequisites: ['pulse-shaping', 'matched-filter', 'nyquist-sampling', 'convolution', 'fourier-transform'],
  intro: String.raw`<p>The root-raised-cosine (RRC) filter answers a subtle engineering demand: a digital receiver wants <em>two</em> things at once — <strong>zero intersymbol interference</strong> (ISI) at the sampling instants, and a <strong>matched filter</strong> that maximises SNR. These pull in different directions, because the zero-ISI (Nyquist) property is a constraint on the <em>end-to-end</em> pulse, whereas matched filtering is a constraint on the <em>receive</em> filter alone. The elegant resolution: take the raised-cosine (RC) filter — the standard Nyquist pulse — and split it into two identical square-root halves, $H_{RRC}(f)=\sqrt{H_{RC}(f)}$, placing one at the transmitter and one at the receiver. Their cascade reconstitutes the full raised cosine (so the <em>system</em> is ISI-free), and because both halves are identical, the receive RRC is exactly matched to the transmit RRC (so SNR is maximised). The price is a crucial subtlety: a <em>single</em> RRC pulse is <strong>not</strong> zero-ISI — only the Tx+Rx cascade is.</p>`,
  sections: [
    {
      h: 'Why RRC? The two-goal problem',
      html: String.raw`<p>Consider a baseband digital link. The transmitter shapes symbols with a filter $H_T(f)$; the channel (idealised as flat) passes them; the receiver filters with $H_R(f)$ before sampling. Two independent requirements act on this chain:</p>
      <ul>
        <li><strong>Zero ISI (Nyquist):</strong> the <em>overall</em> pulse $P(f)=H_T(f)H_R(f)$ must be a Nyquist pulse — its time response must cross zero at every symbol instant except $t=0$. This is a property of the <em>product</em>.</li>
        <li><strong>Matched filtering (max SNR):</strong> to maximise output SNR in white noise, the receive filter must be matched to the received pulse: $H_R(f)=H_T^*(f)$. This is a property of the <em>receiver alone</em>.</li>
      </ul>
      <p>If we naively put a whole raised cosine at the transmitter and nothing at the receiver, we get zero ISI but no noise rejection and no matched filter. If we put an arbitrary matched pair, the product may not be Nyquist. The RRC solution satisfies <em>both</em>:</p>
      <p>$$H_T(f)=H_R(f)=\sqrt{H_{RC}(f)}\ \Rightarrow\ \underbrace{H_T H_R=H_{RC}}_{\text{Nyquist}},\ \underbrace{H_R=H_T^*}_{\text{matched (real, even)}}.$$</p>
      <div class="callout"><strong>The core idea in one line:</strong> square-root the Nyquist filter and give each end a copy — the cascade is Nyquist, and each end is the other's matched filter.</div></p>`
    },
    {
      h: 'The raised cosine as the target cascade',
      html: String.raw`<p>The desired end-to-end pulse is the raised cosine, the canonical Nyquist pulse parameterised by roll-off $\beta\in[0,1]$:</p>
      <p>$$H_{RC}(f)=\begin{cases}T,&|f|\le\dfrac{1-\beta}{2T}\\[6pt]\dfrac{T}{2}\!\left[1+\cos\!\dfrac{\pi T}{\beta}\!\left(|f|-\dfrac{1-\beta}{2T}\right)\right],&\dfrac{1-\beta}{2T}<|f|\le\dfrac{1+\beta}{2T}\\[6pt]0,&|f|>\dfrac{1+\beta}{2T}.\end{cases}$$</p>
      <p>Its time response has zero crossings at every $t=kT$ ($k\ne0$), guaranteeing zero ISI. The RRC is defined so that its <em>square</em> is this RC:</p>
      <p>$$H_{RRC}(f)=\sqrt{H_{RC}(f)}.$$</p>
      <p>Because $H_{RC}(f)$ is real and non-negative, its square root is well defined and also real and even — which makes the RRC filter its own matched filter (a real, even $h(t)$ satisfies $h(-t)=h(t)$, i.e. the matched-filter conjugate-time-reverse is the filter itself).</p></p>`
    },
    {
      h: 'RRC frequency and time responses',
      html: String.raw`<p>Taking the square root of each piece of $H_{RC}$ gives the RRC frequency response:</p>
      <p>$$H_{RRC}(f)=\begin{cases}\sqrt{T},&|f|\le\dfrac{1-\beta}{2T}\\[6pt]\sqrt{\dfrac{T}{2}\!\left[1+\cos\!\dfrac{\pi T}{\beta}\!\left(|f|-\dfrac{1-\beta}{2T}\right)\right]},&\dfrac{1-\beta}{2T}<|f|\le\dfrac{1+\beta}{2T}\\[6pt]0,&\text{otherwise.}\end{cases}$$</p>
      <p>Its (messier) closed-form impulse response is</p>
      <p>$$h_{RRC}(t)=\frac{1}{\sqrt T}\,\frac{\sin\!\left[\pi\frac{t}{T}(1-\beta)\right]+4\beta\frac{t}{T}\cos\!\left[\pi\frac{t}{T}(1+\beta)\right]}{\pi\frac{t}{T}\left[1-\left(4\beta\frac{t}{T}\right)^2\right]}.$$</p>
      <p>Special (L'Hopital) values handle the removable singularities:</p>
      <ul>
        <li>At $t=0$: $h_{RRC}(0)=\frac{1}{\sqrt T}\left[1+\beta\!\left(\frac{4}{\pi}-1\right)\right]$.</li>
        <li>At $t=\pm\frac{T}{4\beta}$: $h_{RRC}=\frac{\beta}{\sqrt{2T}}\left[\left(1+\frac{2}{\pi}\right)\sin\frac{\pi}{4\beta}+\left(1-\frac{2}{\pi}\right)\cos\frac{\pi}{4\beta}\right]$.</li>
      </ul>
      <p>Critically, $h_{RRC}(t)$ does <em>not</em> have zeros at all $t=kT$ — unlike the RC. That is expected: only the cascade of two RRCs recovers the RC's zero crossings.</p></p>`
    },
    {
      h: 'The matched-filter split — why halves work',
      html: String.raw`<p>Split the raised cosine as $H_{RC}=H_{RRC}\cdot H_{RRC}$. Two facts must hold simultaneously, and RRC delivers both:</p>
      <ul>
        <li><strong>Nyquist (zero ISI):</strong> the <em>product</em> $H_T(f)H_R(f)=\sqrt{H_{RC}}\cdot\sqrt{H_{RC}}=H_{RC}(f)$ is exactly the raised cosine, whose time response has the required zero crossings.</li>
        <li><strong>Matched filter (max SNR):</strong> the optimum receive filter for a transmit pulse $p(t)$ in AWGN is $h_R(t)=p^*(-t)$, i.e. $H_R(f)=H_T^*(f)$. For the real, even RRC this is just $H_R=H_T$, so the receiver <em>is</em> matched to the transmit pulse.</li>
      </ul>
      <p>The matched filter maximises the signal-to-noise ratio at the sampling instant to $2E/N_0$, where $E$ is the symbol energy. So RRC-at-both-ends gives simultaneously the best possible SNR <em>and</em> zero ISI — a result no single-filter arrangement can match. This is why essentially every modern digital radio (LTE, DVB, Wi-Fi's SC modes, satellite modems) uses matched RRC pairs.</p>
      <div class="callout"><strong>Matched filtering recap:</strong> Correlating the received waveform with a copy of the transmit pulse concentrates all the pulse energy at the sampling instant while averaging noise down — the RRC receiver does exactly this.</div></p>`
    },
    {
      h: 'A single RRC is NOT zero-ISI',
      html: String.raw`<p>This is the most-tested and most-misunderstood point. The raised cosine is Nyquist; its <em>square root</em> is not. If you examine a lone RRC transmit pulse $h_{RRC}(t)$, it does <strong>not</strong> vanish at all $t=kT$, so a receiver that samples an RRC-shaped signal <em>without</em> a matching receive RRC will suffer ISI.</p>
      <ul>
        <li>Sample an eye diagram after a <em>single</em> RRC: the eye is partly closed — nonzero ISI.</li>
        <li>Sample after the <em>cascade</em> of Tx-RRC and Rx-RRC: the eye is fully open — zero ISI at the ideal instant.</li>
      </ul>
      <p>The zero-ISI property is a property of the <em>combined</em> response only. Practically this means: (1) you must have RRC at both ends for the system to work; (2) an RRC-shaped signal measured on a spectrum/vector analyser will show ISI unless you apply a matched RRC in the measurement receiver; (3) if the channel is non-ideal, the actual cascade drifts from a perfect RC and an equaliser may be needed to restore the Nyquist condition.</p>
      <div class="callout"><strong>Exam trap:</strong> "Is the RRC pulse ISI-free?" — No. Only $\text{RRC}\ast\text{RRC}=\text{RC}$ is ISI-free.</div></p>`
    },
    {
      h: 'Roll-off, excess bandwidth and group delay',
      html: String.raw`<p>The RRC shares the raised cosine's bandwidth. The single-sided occupied bandwidth is</p>
      <p>$$B=\frac{1+\beta}{2T}=\frac{(1+\beta)R_s}{2},$$</p>
      <p>so the passband (double-sided) bandwidth is $(1+\beta)R_s$. The factor $(1+\beta)$ is the <strong>excess bandwidth</strong>: a fraction $\beta$ above the Nyquist minimum $R_s/2$ (single-sided). Choosing $\beta$ is a classic trade:</p>
      <table class="data">
        <tr><th>$\beta$</th><th>Excess BW</th><th>Filter length</th><th>Timing sensitivity</th><th>Typical use</th></tr>
        <tr><td>0.20</td><td>20%</td><td>Long</td><td>High</td><td>LTE ($\beta\approx0.22$ historically)</td></tr>
        <tr><td>0.25</td><td>25%</td><td>Long</td><td>High</td><td>DVB-S2</td></tr>
        <tr><td>0.35</td><td>35%</td><td>Moderate</td><td>Moderate</td><td>DVB-S, common default</td></tr>
        <tr><td>0.5</td><td>50%</td><td>Short</td><td>Low</td><td>Robust links</td></tr>
      </table>
      <p><strong>Group delay.</strong> A practical RRC is a truncated FIR of length $(2N+1)$ taps (spanning $\pm N$ symbols), designed to be linear-phase and symmetric. Linear phase means <em>constant group delay</em> $= N T$ seconds (the filter delays all frequencies equally, so no phase distortion is added). The truncation to $\pm N$ symbols (typically $N=4$ to $8$) introduces slight passband ripple and stopband leakage; longer filters reduce this at the cost of latency and computation. Both Tx and Rx contribute their group delays, so the end-to-end latency is $2NT$.</p></p>`
    },
    {
      h: 'Implementation and practical pitfalls',
      html: String.raw`<p>An RRC is realised as an <strong>oversampled FIR filter</strong>: the symbol impulses are upsampled to $L$ samples-per-symbol (typically $L=4$–$16$) and convolved with the RRC taps, producing a smooth band-limited waveform. Practical concerns:</p>
      <ul>
        <li><strong>Truncation:</strong> the ideal RRC is infinite; truncating to $\pm N$ symbols and applying a window controls stopband leakage and adjacent-channel emission.</li>
        <li><strong>Gain normalisation:</strong> the taps should be normalised so unit-energy symbols yield the intended output power; the cascade of two RRCs must have unity peak so $p(0)=1$.</li>
        <li><strong>Timing recovery:</strong> because a smaller $\beta$ gives slower-decaying tails, tight symbol-timing recovery is essential; a timing error causes residual ISI that grows as $\beta$ shrinks.</li>
        <li><strong>PAPR/envelope:</strong> like all pulse shaping, RRC gives a varying envelope (rings between symbols), raising PAPR versus an unshaped constant-envelope signal.</li>
        <li><strong>Matched pair matters:</strong> if the Tx and Rx roll-offs differ, the cascade is no longer a clean RC and ISI reappears — always match $\beta$ at both ends.</li>
      </ul></p>`
    }
  ],
  keyPoints: [
    String.raw`RRC splits the Nyquist raised cosine: $H_{RRC}(f)=\sqrt{H_{RC}(f)}$, one copy at Tx and one at Rx.`,
    String.raw`The cascade $H_{RRC}\cdot H_{RRC}=H_{RC}$ is Nyquist (zero ISI); the identical halves make the Rx a matched filter (max SNR).`,
    String.raw`A single RRC pulse is NOT zero-ISI — only the Tx+Rx cascade has zeros at all $t=kT$, $k\ne0$.`,
    String.raw`The RRC is real and even, so its matched filter equals itself ($H_R=H_T$).`,
    String.raw`Matched filtering maximises the sampling-instant SNR to $2E/N_0$ in AWGN.`,
    String.raw`Single-sided bandwidth $B=(1+\beta)R_s/2$; passband $(1+\beta)R_s$; excess bandwidth is the factor $(1+\beta)$.`,
    String.raw`Roll-off $\beta$: small $\beta$ saves bandwidth but demands tight timing and longer filters; large $\beta$ is robust but wide.`,
    String.raw`A linear-phase FIR RRC has constant group delay $NT$; the Tx+Rx pair adds $2NT$ latency.`,
    String.raw`Implemented as an oversampled FIR (L = 4–16 samples/symbol) with truncation to $\pm N$ symbols.`,
    String.raw`Tx and Rx must use the same $\beta$; mismatched roll-offs break the RC cascade and reintroduce ISI.`,
    String.raw`RRC shaping gives a varying envelope, raising PAPR relative to an unshaped signal.`,
    String.raw`Non-ideal channels distort the cascade away from a perfect RC; an equaliser may be needed to restore zero ISI.`
  ],
  equations: [
    {
      title: 'The RRC split condition',
      tex: String.raw`$$H_T(f)=H_R(f)=\sqrt{H_{RC}(f)}\ \Rightarrow\ H_T H_R=H_{RC}$$`,
      derivation: String.raw`<p><b>Where we start.</b> We need the end-to-end pulse $P(f)=H_T(f)H_R(f)$ to be Nyquist (a raised cosine), and simultaneously the receiver to be matched: $H_R(f)=H_T^*(f)$.</p>
      <p><b>Step 1 — impose the matched condition.</b> Set $H_R=H_T^*$. For a real, even filter this is $H_R=H_T$, so $P(f)=H_T^2(f)$.</p>
      <p><b>Step 2 — impose the Nyquist condition.</b> We want $P(f)=H_{RC}(f)$. Substituting from Step 1:</p>
      $$H_T^2(f)=H_{RC}(f).$$
      <p><b>Step 3 — solve for the filter.</b> Since $H_{RC}(f)\ge0$ everywhere, take the (real, non-negative) square root:</p>
      $$H_T(f)=\sqrt{H_{RC}(f)}=H_{RRC}(f).$$
      <p><b>Result.</b> $$H_T=H_R=\sqrt{H_{RC}}.$$ Sanity check: multiplying the two identical square roots gives back $H_{RC}$ — Nyquist — while $H_R=H_T$ confirms the matched-filter property. Both goals met at once.</p>`
    },
    {
      title: 'RRC frequency response',
      tex: String.raw`$$H_{RRC}(f)=\sqrt{H_{RC}(f)}$$`,
      derivation: String.raw`<p><b>Where we start.</b> The raised-cosine spectrum has three regions: flat passband, cosine roll-off, and stopband. The RRC is its pointwise square root.</p>
      <p><b>Step 1 — passband.</b> Where $H_{RC}=T$ (for $|f|\le(1-\beta)/2T$), the RRC is $\sqrt{T}$, a flat value.</p>
      <p><b>Step 2 — roll-off region.</b> Where $H_{RC}=\frac{T}{2}[1+\cos(\cdot)]$, take the root:</p>
      $$H_{RRC}(f)=\sqrt{\frac{T}{2}\left[1+\cos\frac{\pi T}{\beta}\left(|f|-\frac{1-\beta}{2T}\right)\right]}.$$
      <p>Using the identity $\tfrac12[1+\cos\theta]=\cos^2(\theta/2)$, this simplifies to $\sqrt{T}\,\cos\!\left(\frac{\pi T}{2\beta}(|f|-\frac{1-\beta}{2T})\right)$ — a smooth cosine taper.</p>
      <p><b>Step 3 — stopband.</b> Where $H_{RC}=0$, the RRC is $0$.</p>
      <p><b>Result.</b> $$H_{RRC}(f)=\sqrt{H_{RC}(f)}.$$ Sanity check: at $\beta=0$ the RRC collapses to a brick-wall $\sqrt{T}$ over $|f|\le1/2T$ — the ideal (impractical) minimum-bandwidth filter.</p>`
    },
    {
      title: 'RRC impulse response',
      tex: String.raw`$$h_{RRC}(t)=\frac{1}{\sqrt T}\,\frac{\sin[\pi\frac{t}{T}(1-\beta)]+4\beta\frac{t}{T}\cos[\pi\frac{t}{T}(1+\beta)]}{\pi\frac{t}{T}[1-(4\beta\frac{t}{T})^2]}$$`,
      derivation: String.raw`<p><b>Where we start.</b> The impulse response is the inverse Fourier transform of $H_{RRC}(f)=\sqrt{H_{RC}(f)}$.</p>
      <p><b>Step 1 — write the transform.</b> $h_{RRC}(t)=\int_{-\infty}^{\infty}H_{RRC}(f)e^{j2\pi ft}\,df$. Because $H_{RRC}$ is real and even, this reduces to a cosine transform over the occupied band $[0,(1+\beta)/2T]$.</p>
      <p><b>Step 2 — split the integral by region.</b> Integrate the flat $\sqrt{T}$ passband and the $\sqrt{T}\cos(\cdot)$ roll-off region separately. Each piece integrates to a sinc-like term; the flat part yields the $\sin[\pi\frac{t}{T}(1-\beta)]$ contribution and the roll-off part yields the $4\beta\frac{t}{T}\cos[\pi\frac{t}{T}(1+\beta)]$ contribution.</p>
      <p><b>Step 3 — combine over the common denominator.</b> Collecting the terms over $\pi\frac{t}{T}[1-(4\beta t/T)^2]$ gives the compact closed form.</p>
      <p><b>Result.</b> $$h_{RRC}(t)=\frac{1}{\sqrt T}\,\frac{\sin[\pi\frac{t}{T}(1-\beta)]+4\beta\frac{t}{T}\cos[\pi\frac{t}{T}(1+\beta)]}{\pi\frac{t}{T}[1-(4\beta\frac{t}{T})^2]}.$$ Sanity check: the denominator vanishes at $t=\pm T/4\beta$ and $t=0$ — removable singularities resolved by L'Hopital, giving finite tap values. Note it does NOT zero at all $kT$, confirming a lone RRC is not Nyquist.</p>`
    },
    {
      title: 'RRC / raised-cosine bandwidth',
      tex: String.raw`$$B=\frac{(1+\beta)R_s}{2}=\frac{1+\beta}{2T}$$`,
      derivation: String.raw`<p><b>Where we start.</b> The RRC occupies exactly the same band as the raised cosine (square-rooting does not change where the response is zero).</p>
      <p><b>Step 1 — locate the band edge.</b> $H_{RC}(f)=0$ for $|f|>(1+\beta)/2T$, so the single-sided occupied bandwidth is the upper edge $B=(1+\beta)/2T$.</p>
      <p><b>Step 2 — express via symbol rate.</b> With $R_s=1/T$:</p>
      $$B=\frac{1+\beta}{2T}=\frac{(1+\beta)R_s}{2}.$$
      <p><b>Step 3 — identify the excess.</b> The Nyquist minimum single-sided bandwidth is $R_s/2$ (at $\beta=0$); the factor $(1+\beta)$ inflates it by the fractional excess $\beta$.</p>
      <p><b>Result.</b> $$B=\frac{(1+\beta)R_s}{2}.$$ Sanity check: at $\beta=1$, $B=R_s$ — the widest RRC, double the Nyquist minimum; passband bandwidth is $2B=(1+\beta)R_s$.</p>`
    },
    {
      title: 'Matched-filter SNR maximisation',
      tex: String.raw`$$\text{SNR}_{max}=\frac{2E}{N_0}$$`,
      derivation: String.raw`<p><b>Where we start.</b> A known pulse $p(t)$ of energy $E$ arrives in AWGN of two-sided density $N_0/2$. We seek the linear filter $h(t)$ maximising SNR at sampling time $t_0$.</p>
      <p><b>Step 1 — write SNR.</b> Output signal at $t_0$ is $s_o=\int H(f)P(f)e^{j2\pi ft_0}df$; output noise power is $\sigma^2=\frac{N_0}{2}\int|H(f)|^2df$. SNR $=|s_o|^2/\sigma^2$.</p>
      <p><b>Step 2 — apply Cauchy–Schwarz.</b> The inequality $|\int H P^*e^{j\cdot}|^2\le\int|H|^2\int|P|^2$ is tight when $H(f)=k\,P^*(f)e^{-j2\pi ft_0}$ — the matched filter. Then the numerator equals $(\int|P|^2df)^2=E^2$ (Parseval).</p>
      <p><b>Step 3 — substitute.</b></p>
      $$\text{SNR}=\frac{E^2}{\frac{N_0}{2}E}=\frac{2E}{N_0}.$$
      <p><b>Result.</b> $$\text{SNR}_{max}=\frac{2E}{N_0}.$$ Sanity check: this is the fundamental matched-filter bound; RRC-at-both-ends achieves it because the Rx RRC is $P^*(f)$ for the transmitted RRC pulse.</p>`
    },
    {
      title: 'FIR RRC group delay',
      tex: String.raw`$$\tau_g=NT\ \text{(per filter)},\qquad \tau_{total}=2NT$$`,
      derivation: String.raw`<p><b>Where we start.</b> A practical RRC is a symmetric linear-phase FIR truncated to span $\pm N$ symbols, i.e. length $(2NL+1)$ samples at $L$ samples/symbol.</p>
      <p><b>Step 1 — linear phase means constant group delay.</b> A symmetric FIR of length $M$ has phase $\theta(\omega)=-\omega(M-1)/2$, so group delay $\tau_g=-d\theta/d\omega=(M-1)/2$ samples — constant across frequency.</p>
      <p><b>Step 2 — convert to symbol time.</b> With the filter centred over $\pm N$ symbols, the peak sits $N$ symbols in, so $\tau_g=NT$ seconds per filter.</p>
      <p><b>Step 3 — cascade Tx and Rx.</b> Both the transmit and receive RRC contribute $NT$, so end-to-end:</p>
      $$\tau_{total}=NT+NT=2NT.$$
      <p><b>Result.</b> $$\tau_{total}=2NT.$$ Sanity check: constant group delay means no phase distortion — the filter delays all frequencies equally, preserving the pulse shape; only overall latency is added.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What does an RRC filter accomplish that a full RC at the Tx cannot?`, back: String.raw`It makes the Rx a matched filter (max SNR) while the Tx+Rx cascade stays Nyquist (zero ISI).` },
    { front: String.raw`Define the RRC frequency response.`, back: String.raw`$H_{RRC}(f)=\sqrt{H_{RC}(f)}$ — the square root of the raised-cosine response.` },
    { front: String.raw`Is a single RRC pulse ISI-free?`, back: String.raw`No. Only the cascade of Tx-RRC and Rx-RRC forms the raised cosine with zero crossings at $kT$.` },
    { front: String.raw`Why place identical RRCs at both ends?`, back: String.raw`The product is the RC (Nyquist) and, being identical/real/even, the Rx is matched to the Tx (max SNR).` },
    { front: String.raw`Single-sided bandwidth of an RRC signal?`, back: String.raw`$B=(1+\beta)R_s/2$; passband bandwidth $(1+\beta)R_s$.` },
    { front: String.raw`What does the roll-off $\beta$ control?`, back: String.raw`The excess bandwidth above the Nyquist minimum and the tail decay / timing sensitivity.` },
    { front: String.raw`What is the matched-filter SNR bound?`, back: String.raw`$\text{SNR}_{max}=2E/N_0$, achieved when the receive filter is matched to the pulse.` },
    { front: String.raw`Why is the RRC its own matched filter?`, back: String.raw`It is real and even, so $H_R=H_T^*=H_T$.` },
    { front: String.raw`What is the group delay of a symmetric FIR RRC?`, back: String.raw`Constant $NT$ per filter (linear phase); $2NT$ for the Tx+Rx cascade.` },
    { front: String.raw`What happens if Tx and Rx use different roll-offs?`, back: String.raw`The cascade is no longer a clean RC, so ISI reappears; always match $\beta$ at both ends.` },
    { front: String.raw`How is an RRC implemented digitally?`, back: String.raw`As an oversampled FIR (typically 4–16 samples/symbol) convolving upsampled symbol impulses.` },
    { front: String.raw`Effect of decreasing $\beta$ on timing recovery?`, back: String.raw`It worsens — slower-decaying tails make the eye more sensitive to sampling-time error.` },
    { front: String.raw`Value of $h_{RRC}(0)$?`, back: String.raw`$\frac{1}{\sqrt T}[1+\beta(4/\pi-1)]$ (L'Hopital at the $t=0$ singularity).` },
    { front: String.raw`Why does RRC shaping raise PAPR?`, back: String.raw`The shaped envelope rings between symbols, so it is no longer constant, forcing PA back-off.` },
    { front: String.raw`Does the RC or the RRC have zero crossings at all $kT$?`, back: String.raw`The RC does; the lone RRC does not — only the RRC-RRC cascade recovers them.` }
  ],
  mcqs: [
    { q: String.raw`The root-raised-cosine filter is defined as:`, options: [String.raw`$H_{RC}^2(f)$`, String.raw`$\sqrt{H_{RC}(f)}$`, String.raw`$1/H_{RC}(f)$`, String.raw`$H_{RC}(f)/2$`], answer: 1, explain: String.raw`RRC is the square root of the raised cosine, so two of them cascade back to $H_{RC}$.` },
    { q: String.raw`A single RRC transmit pulse examined by itself:`, options: [String.raw`Is zero-ISI`, String.raw`Does not have zero crossings at all $kT$`, String.raw`Is identical to the raised cosine`, String.raw`Has infinite bandwidth`], answer: 1, explain: String.raw`Only the Tx+Rx RRC cascade forms the Nyquist RC; a lone RRC is not ISI-free.` },
    { q: String.raw`Why is the raised cosine split into two RRC filters?`, options: [String.raw`To halve the transmit power`, String.raw`So the receiver is matched while the cascade stays Nyquist`, String.raw`To double the bandwidth`, String.raw`To remove timing recovery`], answer: 1, explain: String.raw`Each RRC is $\sqrt{H_{RC}}$; the product is Nyquist and the identical Rx filter is matched to the Tx pulse.` },
    { q: String.raw`The matched-filter SNR bound in AWGN is:`, options: [String.raw`$E/N_0$`, String.raw`$2E/N_0$`, String.raw`$E/(2N_0)$`, String.raw`$4E/N_0$`], answer: 1, explain: String.raw`The matched filter achieves $\text{SNR}_{max}=2E/N_0$, with $E$ the symbol energy.` },
    { q: String.raw`The single-sided bandwidth of an RRC signal is:`, options: [String.raw`$R_s/2$`, String.raw`$(1+\beta)R_s/2$`, String.raw`$(1+\beta)R_s$`, String.raw`$\beta R_s$`], answer: 1, explain: String.raw`Same as the raised cosine: $B=(1+\beta)R_s/2$ single-sided.` },
    { q: String.raw`The RRC filter is its own matched filter because it is:`, options: [String.raw`Complex and odd`, String.raw`Real and even`, String.raw`Purely imaginary`, String.raw`Non-causal only`], answer: 1, explain: String.raw`For a real, even filter, $H_R=H_T^*=H_T$, so it matches itself.` },
    { q: String.raw`A symmetric linear-phase FIR RRC has:`, options: [String.raw`Frequency-dependent group delay`, String.raw`Constant group delay`, String.raw`Zero group delay`, String.raw`Infinite group delay`], answer: 1, explain: String.raw`Linear phase gives constant group delay, so all frequencies are delayed equally — no phase distortion.` },
    { q: String.raw`If the Tx uses $\beta=0.35$ and the Rx uses $\beta=0.2$, the result is:`, options: [String.raw`Perfect zero ISI`, String.raw`Residual ISI because the cascade is not a clean RC`, String.raw`Lower bandwidth`, String.raw`Higher SNR`], answer: 1, explain: String.raw`The mismatched roll-offs mean the product is not a raised cosine, so ISI reappears.` },
    { q: String.raw`Decreasing the RRC roll-off $\beta$:`, options: [String.raw`Relaxes timing recovery`, String.raw`Saves bandwidth but tightens timing requirements`, String.raw`Increases the envelope constancy`, String.raw`Removes the need for a matched filter`], answer: 1, explain: String.raw`Smaller $\beta$ narrows the spectrum but the slower tails make the system more timing-sensitive.` },
    { q: String.raw`The end-to-end group delay of matched Tx/Rx RRC FIRs spanning $\pm N$ symbols is:`, options: [String.raw`$NT$`, String.raw`$2NT$`, String.raw`$NT/2$`, String.raw`$4NT$`], answer: 1, explain: String.raw`Each filter contributes $NT$; the cascade adds them to $2NT$.` },
    { q: String.raw`RRC pulse shaping affects the signal envelope by:`, options: [String.raw`Keeping it perfectly constant`, String.raw`Introducing amplitude variation that raises PAPR`, String.raw`Removing all sidebands`, String.raw`Doubling the carrier frequency`], answer: 1, explain: String.raw`Shaped pulses ring between symbols, so the envelope varies and PAPR rises.` },
    { q: String.raw`Which pulse actually has zero crossings at every $kT$ ($k\ne0$)?`, options: [String.raw`The lone RRC pulse`, String.raw`The raised cosine (RRC-RRC cascade)`, String.raw`Neither`, String.raw`A rectangular pulse`], answer: 1, explain: String.raw`The RC has the Nyquist zero crossings; the single RRC does not.` }
  ],
  numericals: [
    { q: String.raw`An RRC-shaped QPSK link has $R_s=20$ Msym/s and roll-off $\beta=0.25$. Find the passband occupied bandwidth.`, solution: String.raw`<p>Passband bandwidth $=(1+\beta)R_s=1.25\times20=25$ MHz. (Single-sided baseband $B=(1+\beta)R_s/2=12.5$ MHz.)</p>` },
    { q: String.raw`A 30 MHz passband channel uses RRC with $\beta=0.2$. What maximum symbol rate fits, and what QPSK bit rate results?`, solution: String.raw`<p>$R_s=B/(1+\beta)=30/1.2=25$ Msym/s. QPSK: $R_b=2R_s=50$ Mb/s.</p>` },
    { q: String.raw`Compute the excess bandwidth (MHz and %) for $R_s=10$ Msym/s at $\beta=0.35$ (single-sided).`, solution: String.raw`<p>Nyquist min single-sided $=R_s/2=5$ MHz. Actual $=(1+0.35)(10)/2=6.75$ MHz. Excess $=6.75-5=1.75$ MHz $=35\%$ — matching $\beta$.</p>` },
    { q: String.raw`An FIR RRC spans $\pm 6$ symbols at 8 samples/symbol. Find the filter length and the per-filter group delay if $T=0.1\,\mu$s.`, solution: String.raw`<p>Length $=2NL+1=2(6)(8)+1=97$ taps. Group delay $=NT=6\times0.1\,\mu\text{s}=0.6\,\mu$s per filter; Tx+Rx total $=1.2\,\mu$s.</p>` },
    { q: String.raw`Evaluate $h_{RRC}(0)$ for $\beta=0.35$ and $T=1$ (normalised).`, solution: String.raw`<p>$h_{RRC}(0)=\frac{1}{\sqrt T}[1+\beta(4/\pi-1)]=1\times[1+0.35(1.273-1)]=1+0.35(0.273)=1.096$.</p>` },
    { q: String.raw`A matched RRC receiver operates on a pulse of energy $E=2\times10^{-9}$ J in noise $N_0=1\times10^{-10}$ W/Hz. Find the maximum output SNR (dB).`, solution: String.raw`<p>$\text{SNR}=2E/N_0=2(2\times10^{-9})/(1\times10^{-10})=40$. In dB: $10\log_{10}40=16.0$ dB.</p>` },
    { q: String.raw`Two RRC filters with roll-offs 0.3 (Tx) and 0.3 (Rx) cascade. What is the effective end-to-end pulse, and is it zero-ISI?`, solution: String.raw`<p>$H_T H_R=\sqrt{H_{RC}}\cdot\sqrt{H_{RC}}=H_{RC}$ with $\beta=0.3$ — a raised cosine. Yes, it is zero-ISI (zeros at all $kT$), and the Rx is matched to the Tx.</p>` }
  ],
  realWorld: String.raw`<p>Matched RRC pairs are the invisible standard behind almost every single-carrier digital radio. DVB-S/S2 satellite TV specifies RRC with roll-offs of 0.35/0.25/0.20; 3G WCDMA used $\beta=0.22$; LTE and many satellite modems, cable systems, and microwave backhaul links all rely on RRC transmit/receive pairs to pack symbols tightly while achieving optimum matched-filter SNR. In an SDR, the RRC is one of the first blocks in the transmit chain and the last before symbol decision in the receive chain — often the largest FIR in the design. Test equipment (vector signal analysers) apply a reference RRC to demodulate captured signals, and the classic eye-diagram measurement is really a check that the RRC-RRC cascade is opening the eye as intended. Understanding that a lone RRC is not ISI-free is the single most common insight that separates engineers who can debug a link from those who cannot.</p>`,
  related: ['pulse-shaping', 'matched-filter', 'eye-diagram', 'qpsk', 'nyquist-sampling']
}
);
