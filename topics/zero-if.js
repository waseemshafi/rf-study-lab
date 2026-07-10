// Zero-IF (Direct-Conversion) Receiver — deep exam-mastery study content.
// CONTENT is a global object provided by the app.
CONTENT.topics.push(
  {
    id: 'zero-if',
    title: 'Zero-IF (Direct-Conversion) Receiver',
    category: 'RF Front-End & Receivers',
    tags: ['direct conversion', 'homodyne', 'I/Q', 'DC offset', 'flicker noise', 'IP2', 'image rejection'],
    summary: String.raw`A zero-IF (direct-conversion / homodyne) receiver sets the local oscillator equal to the carrier so the wanted signal folds straight to DC, using quadrature (I/Q) mixing to separate the overlapping positive- and negative-frequency sidebands and eliminate the image-reject filter and IF strip — at the cost of DC offset, I/Q imbalance and flicker-noise impairments unique to baseband conversion.`,
    diagram: [
      {
        title: String.raw`Zero-IF I/Q receiver chain (RF straight to complex baseband)`,
        svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr-zero-if" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Direct-conversion receiver: LNA, quadrature mix, LPF, ADC, DSP</text>
          <rect x="20" y="96" width="70" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="55" y="120" fill="#e6edf3" text-anchor="middle">LNA</text>
          <line x1="90" y1="116" x2="128" y2="116" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <circle cx="140" cy="116" r="6" fill="#1c232e" stroke="#9aa7b5"/><text x="140" y="120" fill="#9aa7b5" text-anchor="middle" font-size="10">split</text>
          <line x1="146" y1="112" x2="176" y2="72" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <line x1="146" y1="120" x2="176" y2="160" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <rect x="178" y="52" width="52" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="204" y="70" fill="#e6edf3" text-anchor="middle">mix I</text><text x="204" y="85" fill="#9aa7b5" text-anchor="middle" font-size="9">×cos</text>
          <rect x="178" y="140" width="52" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="204" y="158" fill="#e6edf3" text-anchor="middle">mix Q</text><text x="204" y="173" fill="#9aa7b5" text-anchor="middle" font-size="9">×(−sin)</text>
          <rect x="230" y="96" width="60" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="260" y="115" fill="#e6edf3" text-anchor="middle">LO 0/90</text><text x="260" y="129" fill="#9aa7b5" text-anchor="middle" font-size="9">f=f_RF</text>
          <line x1="245" y1="96" x2="215" y2="92" stroke="#b197fc"/>
          <line x1="245" y1="136" x2="215" y2="140" stroke="#b197fc"/>
          <line x1="230" y1="72" x2="300" y2="72" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <line x1="230" y1="160" x2="300" y2="160" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <rect x="302" y="52" width="50" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="327" y="76" fill="#e6edf3" text-anchor="middle" font-size="10">LPF I</text>
          <rect x="302" y="140" width="50" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="327" y="164" fill="#e6edf3" text-anchor="middle" font-size="10">LPF Q</text>
          <line x1="352" y1="72" x2="392" y2="72" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <line x1="352" y1="160" x2="392" y2="160" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <rect x="394" y="52" width="46" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="417" y="76" fill="#e6edf3" text-anchor="middle" font-size="10">ADC</text>
          <rect x="394" y="140" width="46" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="417" y="164" fill="#e6edf3" text-anchor="middle" font-size="10">ADC</text>
          <line x1="440" y1="72" x2="470" y2="106" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <line x1="440" y1="160" x2="470" y2="126" stroke="#9aa7b5" marker-end="url(#arr-zero-if)"/>
          <rect x="472" y="96" width="56" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="500" y="115" fill="#e6edf3" text-anchor="middle">DSP</text><text x="500" y="129" fill="#9aa7b5" text-anchor="middle" font-size="9">I+jQ</text>
        </svg>`,
        caption: String.raw`After the LNA the signal splits into two mixers driven by a quadrature LO at f_LO=f_RF. The I branch multiplies by cos, the Q branch by −sin; low-pass filters keep only the baseband product; ADCs digitise I and Q; the DSP treats them as a complex signal I+jQ. There is no IF stage and no image-reject filter.`
      },
      {
        title: String.raw`Spectrum: the RF channel folds down onto DC`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr2-zero-if" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">RF at f_LO translates to 0 Hz; I/Q keeps both sidebands</text>
          <line x1="40" y1="90" x2="300" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-zero-if)"/><text x="308" y="94" fill="#9aa7b5" font-size="10">f</text>
          <line x1="200" y1="86" x2="200" y2="94" stroke="#9aa7b5"/><text x="200" y="108" fill="#9aa7b5" text-anchor="middle" font-size="10">f_LO=f_RF</text>
          <rect x="176" y="58" width="20" height="28" rx="3" fill="#4dabf7"/><rect x="204" y="66" width="20" height="20" rx="3" fill="#63e6be"/>
          <text x="186" y="52" fill="#4dabf7" font-size="9" text-anchor="middle">USB</text><text x="214" y="60" fill="#63e6be" font-size="9" text-anchor="middle">LSB</text>
          <line x1="40" y1="170" x2="300" y2="170" stroke="#9aa7b5" marker-end="url(#arr2-zero-if)"/><text x="308" y="174" fill="#9aa7b5" font-size="10">f</text>
          <line x1="130" y1="166" x2="130" y2="174" stroke="#9aa7b5"/><text x="130" y="188" fill="#9aa7b5" text-anchor="middle" font-size="10">0 (DC)</text>
          <rect x="130" y="140" width="20" height="28" rx="3" fill="#4dabf7"/><rect x="108" y="148" width="20" height="20" rx="3" fill="#63e6be"/>
          <text x="140" y="134" fill="#4dabf7" font-size="9" text-anchor="middle">+f</text><text x="118" y="134" fill="#63e6be" font-size="9" text-anchor="middle">−f</text>
          <line x1="360" y1="60" x2="360" y2="150" stroke="#9aa7b5"/>
          <text x="450" y="70" fill="#e6edf3" font-size="11" text-anchor="middle">signal is its</text>
          <text x="450" y="86" fill="#e6edf3" font-size="11" text-anchor="middle">own image</text>
          <text x="450" y="112" fill="#9aa7b5" font-size="10" text-anchor="middle">I/Q = complex mix</text>
          <text x="450" y="128" fill="#9aa7b5" font-size="10" text-anchor="middle">keeps ± apart</text>
          <text x="450" y="144" fill="#ffa94d" font-size="10" text-anchor="middle">real mix would fold</text>
        </svg>`,
        caption: String.raw`The wanted channel sits at f_LO, so downconversion maps it to 0 Hz. Because IF=0 the image sits at −(the same offset), i.e. the signal is its own image: a real (single-mixer) product would fold the two sidebands on top of each other. Quadrature mixing produces a complex baseband whose positive and negative frequencies stay distinct, recovering both sidebands.`
      },
      {
        title: String.raw`Impairment map and its mitigations`,
        svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr3-zero-if" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Zero-IF impairments (left) and their fixes (right)</text>
          <rect x="20" y="40" width="200" height="36" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="120" y="63" fill="#e6edf3" text-anchor="middle" font-size="11">DC offset (LO self-mix)</text>
          <rect x="20" y="86" width="200" height="36" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="120" y="109" fill="#e6edf3" text-anchor="middle" font-size="11">I/Q gain/phase imbalance</text>
          <rect x="20" y="132" width="200" height="36" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="120" y="155" fill="#e6edf3" text-anchor="middle" font-size="11">1/f flicker noise</text>
          <rect x="20" y="178" width="200" height="36" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="120" y="201" fill="#e6edf3" text-anchor="middle" font-size="11">even-order (IP2), LO leak</text>
          <line x1="220" y1="58" x2="316" y2="58" stroke="#9aa7b5" marker-end="url(#arr3-zero-if)"/>
          <line x1="220" y1="104" x2="316" y2="104" stroke="#9aa7b5" marker-end="url(#arr3-zero-if)"/>
          <line x1="220" y1="150" x2="316" y2="150" stroke="#9aa7b5" marker-end="url(#arr3-zero-if)"/>
          <line x1="220" y1="196" x2="316" y2="196" stroke="#9aa7b5" marker-end="url(#arr3-zero-if)"/>
          <rect x="318" y="40" width="202" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="419" y="63" fill="#9aa7b5" text-anchor="middle" font-size="11">DC servo / AC-couple / notch</text>
          <rect x="318" y="86" width="202" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="419" y="109" fill="#9aa7b5" text-anchor="middle" font-size="11">I/Q calibration in DSP</text>
          <rect x="318" y="132" width="202" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="419" y="155" fill="#9aa7b5" text-anchor="middle" font-size="11">chopping / larger devices</text>
          <rect x="318" y="178" width="202" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="419" y="201" fill="#9aa7b5" text-anchor="middle" font-size="11">high IP2 design / LO isolation</text>
        </svg>`,
        caption: String.raw`The four impairments unique to (or worst in) zero-IF and their standard mitigations: DC offset from LO self-mixing is removed by a DC servo loop, AC-coupling or a digital notch; I/Q gain and phase mismatch is corrected by DSP calibration; baseband flicker (1/f) noise is reduced by chopper stabilisation and larger devices; even-order (IP2) products and LO leakage are fought with high-IP2 balanced design and LO-to-antenna isolation.`
      }
    ],
    prerequisites: ['mixer', 'superheterodyne'],
    intro: String.raw`<p><b>Why does the zero-IF receiver exist?</b> A superheterodyne receiver is excellent but expensive to integrate: it needs a high-$Q$ image-reject filter and one or more intermediate-frequency (IF) filters that cannot be built on-chip, forcing bulky, tunable, off-chip components. The direct-conversion (zero-IF) architecture removes all of that. By setting the local oscillator exactly equal to the carrier, $f_{LO}=f_{RF}$, the wanted channel translates straight to DC — there is no IF, so there is no IF strip, and the image problem changes character entirely. The payoff is an almost fully integrable, easily tunable receiver, which is exactly why it dominates modern smartphones, WiFi/Bluetooth radios and software-defined radios (SDR).</p>
<p>But moving the signal to DC creates a new family of problems that a superhet mostly avoids: <b>DC offset</b> from LO self-mixing, <b>I/Q gain and phase imbalance</b>, <b>1/f flicker noise</b> that now sits right on top of the wanted band, <b>LO leakage</b> back out the antenna, and <b>even-order (IP2) distortion</b>. Understanding zero-IF means understanding two things deeply: (1) why <b>quadrature (I/Q) mixing is mandatory</b> — with IF=0 the signal is its own image, and only a complex mix keeps the positive- and negative-frequency sidebands apart; and (2) the impairment set above and its standard mitigations. This topic builds the math of complex downconversion from scratch, derives the image-rejection ratio from I/Q mismatch, and works the numbers you are expected to reproduce in an exam.</p>`,
    sections: [
      {
        h: 'What zero-IF means and why IF = 0',
        html: String.raw`<p>A <b>zero-IF</b> (also called <b>direct-conversion</b> or <b>homodyne</b>) receiver chooses the local oscillator to sit exactly on the carrier, $f_{LO}=f_{RF}$, so that the intermediate frequency is zero: $f_{IF}=|f_{RF}-f_{LO}|=0$. The wanted channel therefore folds straight down to <b>baseband</b> (centred on DC), and its modulation occupies roughly $\pm B/2$ around 0 Hz, where $B$ is the channel bandwidth.</p>
        <p>Contrast this with a <b>superheterodyne</b>, where $f_{LO}$ is offset from $f_{RF}$ by a fixed IF ($f_{IF}=|f_{RF}-f_{LO}|$, typically tens of MHz). The superhet must reject a distinct <b>image</b> at $f_{LO}\mp f_{IF}$ with a dedicated filter before the mixer, and it needs sharp IF filtering for channel selection. Zero-IF removes both: channel selection becomes a low-pass filter at baseband (easy to integrate and to make tunable by simply changing its bandwidth), and there is no separate image band to filter.</p>
        <div class="callout tip"><b>Key intuition:</b> "IF = 0" is not a small IF — it is a qualitatively different regime. Because baseband straddles DC, the receiver's own DC offsets, 1/f noise and second-order distortion all land <i>inside</i> the wanted band. That is the price of integrability.</div>`
      },
      {
        h: 'Why quadrature (I/Q) mixing is mandatory',
        html: String.raw`<p>Multiply the received signal $r(t)$ by a single LO $\cos(2\pi f_{LO}t)$ and low-pass filter. A tone at $f_{LO}+f_m$ (upper sideband) produces a baseband tone at $+f_m$; but a tone at $f_{LO}-f_m$ (lower sideband) <i>also</i> produces a baseband tone at $|{-}f_m|=f_m$. A real (single-mixer) product cannot tell $+f_m$ from $-f_m$: the two sidebands fold on top of each other. With IF=0 the "image" is the mirror sideband of the very same channel — <b>the signal is its own image</b>.</p>
        <p>The cure is to mix with two LO phases 90° apart and keep both outputs:</p>
        <ul>
          <li><b>In-phase (I):</b> multiply by $\cos(2\pi f_{LO}t)$.</li>
          <li><b>Quadrature (Q):</b> multiply by $-\sin(2\pi f_{LO}t)$.</li>
        </ul>
        <p>Forming the complex baseband $x(t)=I(t)+jQ(t)$ is equivalent to multiplying by $e^{-j2\pi f_{LO}t}$, which is a <i>one-sided</i> frequency shift. Positive and negative baseband frequencies now stay distinct, so both sidebands are recovered independently. This is why every zero-IF receiver is an I/Q receiver — quadrature is not optional.</p>
        <div class="callout tip"><b>Exam line:</b> "With zero IF the signal is its own image; a single real mixer folds the two sidebands together, so quadrature (I/Q) mixing is required to separate positive from negative baseband frequencies."</div>`
      },
      {
        h: 'DC offset from LO self-mixing',
        html: String.raw`<p>The most notorious zero-IF impairment is a <b>static (and slowly varying) DC offset</b> at the mixer output. Its dominant cause is <b>LO self-mixing</b>: the strong LO leaks — through the substrate, bond wires or finite mixer isolation — to the mixer's RF port, where it mixes with itself. A signal at $f_{LO}$ multiplied by $f_{LO}$ yields a product at $0$ Hz, i.e. a DC term that lands right in the middle of the wanted band.</p>
        <p>A second path is <b>reverse leakage</b>: LO radiates out of the antenna, reflects off nearby objects and returns time-varying, producing a <i>drifting</i> DC offset. Large in-band interferers hitting a second-order nonlinearity (IP2) also generate DC.</p>
        <p>Because a DC offset is a constant added to $I$ and $Q$, it shifts the whole received constellation off the origin — often swamping the wanted signal, since the offset can be much larger than the desired baseband amplitude. Mitigations:</p>
        <ul>
          <li><b>AC coupling / high-pass:</b> a series capacitor removes DC, but notches the signal energy near 0 Hz — acceptable only for modulations with little DC content.</li>
          <li><b>DC servo loop:</b> a feedback loop estimates and subtracts the offset continuously.</li>
          <li><b>Digital estimation/notch:</b> measure the mean during idle slots and subtract it in DSP.</li>
        </ul>
        <div class="callout tip"><b>Design tension:</b> aggressive high-pass filtering kills DC offset but also removes low-frequency signal content and can hurt EVM for near-DC modulations; the corner frequency is a deliberate compromise.</div>`
      },
      {
        h: 'I/Q gain and phase imbalance',
        html: String.raw`<p>Quadrature only works if the I and Q branches are perfectly matched. In reality the two mixers, LO phases and baseband paths differ slightly, giving a <b>gain mismatch</b> $\varepsilon$ (the amplitude ratio departs from 1) and a <b>phase mismatch</b> $\phi$ (the LO phases are not exactly 90° apart). This imbalance means the complex mix is no longer a clean $e^{-j2\pi f_{LO}t}$: a fraction of the negative-frequency image leaks onto the positive frequency and vice-versa.</p>
        <p>The residual leakage is quantified by the <b>image-rejection ratio (IRR)</b> — the power ratio of wanted to image. For small mismatches (with $\phi$ in radians),</p>
        <p>$$\text{IRR}\approx\frac{\varepsilon^2+\phi^2}{4},$$</p>
        <p>expressed in dB as $10\log_{10}$ of that quantity (a more negative dB value means better rejection). Finite IRR raises the <b>error-vector magnitude (EVM)</b> and therefore caps the usable modulation order: 64-QAM and 256-QAM demand far better IRR than QPSK. Mitigation is <b>I/Q calibration</b> in the DSP: estimate $\varepsilon$ and $\phi$ (from a pilot or blind statistics) and apply the inverse correction, routinely pushing IRR below −40 dB.</p>
        <div class="callout tip"><b>Rule of thumb:</b> 1° of phase error alone or ~1% of gain error alone each limit IRR to roughly −40 dB; both together are added in quadrature ($\varepsilon^2+\phi^2$).</div>`
      },
      {
        h: 'Flicker noise, LO leakage and even-order distortion',
        html: String.raw`<p>Three more impairments are aggravated by placing the signal at DC:</p>
        <ul>
          <li><b>1/f flicker noise:</b> active baseband devices (mixers, baseband amplifiers) have noise that rises as $1/f$ toward DC. In a superhet the signal sits at a high IF where flicker is negligible; in zero-IF the signal is at baseband, directly on top of the flicker corner, degrading sensitivity for narrowband channels. Mitigations: <b>chopper stabilisation</b> (chopping up-converts the signal past the flicker corner, amplifies, then chops back), larger devices, and lower baseband gain in the noisiest stage.</li>
          <li><b>LO leakage / radiation:</b> the on-channel LO can leak out of the antenna, violating spurious-emission limits and desensitising nearby receivers. Fixed with LO-to-RF isolation, balanced mixers and careful layout.</li>
          <li><b>Even-order distortion (IP2):</b> two strong out-of-band interferers beating against a second-order nonlinearity create a low-frequency envelope that lands at baseband as an in-band blocker. Zero-IF is uniquely sensitive because the second-order product falls at DC. The figure of merit is the <b>second-order intercept, IP2</b>; balanced/differential design and IP2 calibration push it high.</li>
        </ul>
        <div class="callout tip"><b>Why superhet is immune:</b> in a superhet the DC offset, flicker noise and IP2 envelope all fall <i>outside</i> the IF passband and are filtered away — the very reason those impairments are "zero-IF problems."</div>`
      },
      {
        h: 'Zero-IF vs superheterodyne, and where it wins',
        html: String.raw`<p>The two architectures trade complementary strengths.</p>
        <table class="data">
          <tr><th>Aspect</th><th>Zero-IF (direct conversion)</th><th>Superheterodyne</th></tr>
          <tr><td>IF</td><td>0 (baseband)</td><td>Fixed non-zero IF</td></tr>
          <tr><td>Image</td><td>Signal is its own image; solved by I/Q</td><td>Distinct image band; needs image-reject filter</td></tr>
          <tr><td>Channel select</td><td>Baseband LPF (integrable, tunable)</td><td>Sharp IF filter (often off-chip)</td></tr>
          <tr><td>DC offset</td><td>Serious (LO self-mixing)</td><td>Not in-band</td></tr>
          <tr><td>Flicker (1/f)</td><td>In-band at DC</td><td>At high IF, negligible</td></tr>
          <tr><td>IP2 sensitivity</td><td>High (product at DC)</td><td>Low (filtered out)</td></tr>
          <tr><td>Integration</td><td>Excellent — few external parts</td><td>Poorer — external filters</td></tr>
          <tr><td>Typical use</td><td>Phones, WiFi/BT, SDR, RFICs</td><td>Legacy/high-performance, instrumentation</td></tr>
        </table>
        <p>Zero-IF dominates modern integrated radios precisely because its impairments are now correctable in silicon and DSP, while its structural advantages — no image filter, no IF strip, tunable baseband, small area — are decisive for the SDR and smartphone era. A related sibling is the <b>low-IF</b> receiver, which uses a small non-zero IF to dodge DC offset and flicker while still integrating well, at the cost of a modest image-rejection requirement.</p>
        <div class="callout tip"><b>Bottom line:</b> choose zero-IF when integration, cost and tunability dominate and you can calibrate the impairments; choose superhet when you need the cleanest possible dynamic range and can afford external filters.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The defining choice:</b> $f_{LO}=f_{RF}$ so IF=0 and the channel folds to baseband — removing the image-reject filter and the entire IF strip, which is what makes zero-IF highly integrable and tunable (dominant in SDR and phones).</li>
<li><b>Why I/Q is mandatory:</b> with IF=0 the signal is its own image; a single real mixer folds the two sidebands together, so quadrature mixing ($\cos$ and $-\sin$, forming $I+jQ=r(t)e^{-j2\pi f_{LO}t}$) is required to keep positive and negative baseband frequencies distinct.</li>
<li><b>DC offset:</b> LO self-mixing (and reverse leakage, and IP2) puts a large, drifting DC term at the constellation origin; fixed by AC-coupling, a DC servo, or digital notch/estimation.</li>
<li><b>I/Q imbalance and IRR:</b> gain $\varepsilon$ and phase $\phi$ mismatch limit image rejection to $\text{IRR}\approx(\varepsilon^2+\phi^2)/4$, raising EVM and capping modulation order; fixed by DSP I/Q calibration.</li>
<li><b>Flicker, LO leakage, even-order:</b> 1/f noise sits on the signal at DC (chopping helps), the on-channel LO can radiate (isolation helps), and IP2 products fall at DC (balanced/high-IP2 design helps) — all filtered out in a superhet but in-band here.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Direct-conversion_receiver" target="_blank" rel="noopener">Wikipedia — Direct-conversion receiver</a> — the canonical overview of the homodyne/zero-IF architecture, its history, principle of operation and DC-offset/leakage drawbacks.</li>
<li><a href="https://wirelesspi.com/direct-conversion-zero-if-receiver/" target="_blank" rel="noopener">Wireless Pi — Direct Conversion (Zero-IF) Receiver</a> — a thorough tutorial with clear math on why complex I/Q mixing is required, plus LO self-mixing DC offset and I/Q-imbalance constellation effects.</li>
<li><a href="http://www.seas.ucla.edu/brweb/teaching/ee215c_notes3.pdf" target="_blank" rel="noopener">Razavi (UCLA EE215C) — Transceiver Architectures lecture notes</a> — graduate RFIC notes from the author of the seminal direct-conversion paper, deriving the impairments (DC offset, I/Q mismatch, flicker, IP2) from circuit principles.</li>
<li><a href="https://www.ti.com/lit/pdf/snaa329" target="_blank" rel="noopener">Texas Instruments SNAA329 — Direct-Conversion Receiver with LMX8410L I/Q Demodulator</a> — a vendor application note showing a real wideband zero-IF I/Q receiver chain and the practical calibration of its impairments.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Zero-IF sets $f_{LO}=f_{RF}$ so $f_{IF}=0$: the wanted channel folds straight to baseband, eliminating the image-reject filter and the IF strip.`,
      String.raw`Because IF=0 the signal is its own image; a single real mixer folds the two sidebands together, so quadrature (I/Q) mixing is mandatory.`,
      String.raw`I/Q downconversion forms the complex baseband $x(t)=I(t)+jQ(t)=r(t)e^{-j2\pi f_{LO}t}$ (multiply by $\cos$ for I and by $-\sin$ for Q), keeping $\pm$ frequencies distinct.`,
      String.raw`DC offset from LO self-mixing lands at the constellation origin and can swamp the signal; fixed by AC-coupling, a DC servo loop, or digital estimation/notch.`,
      String.raw`I/Q gain/phase imbalance limits image rejection to $\text{IRR}\approx(\varepsilon^2+\phi^2)/4$ (with $\phi$ in radians); it raises EVM and caps the modulation order.`,
      String.raw`1/f flicker noise sits on the signal at baseband (negligible at a high IF); chopper stabilisation and larger devices mitigate it.`,
      String.raw`Even-order (IP2) distortion produces low-frequency products that fall at DC in zero-IF; balanced/high-IP2 design and calibration are the fixes.`,
      String.raw`LO leakage/radiation out of the antenna is a spurious-emission hazard unique to on-channel LOs; solved with LO isolation and balanced mixers.`,
      String.raw`Zero-IF is highly integrable, cheap and tunable (baseband LPF for channel selection), which is why it dominates SDR, smartphones and RFICs.`,
      String.raw`Superheterodyne filters DC offset, flicker and IP2 products out at IF, so those are "zero-IF-specific" impairments; low-IF is a compromise that dodges DC/flicker.`
    ],
    equations: [
      {
        title: 'Quadrature downconversion to complex baseband',
        tex: String.raw`$$x(t)=I(t)+jQ(t)=\tfrac12\,\tilde r(t)\,e^{-j2\pi f_{LO}t}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Write the passband signal as $r(t)=\operatorname{Re}\{\tilde r(t)\,e^{j2\pi f_{RF}t}\}$, where $\tilde r(t)$ is the complex baseband (modulation) envelope. We form the two quadrature products, low-pass filter each, and combine them into a complex number to see what survives.</p>
        <p><b>Step 1 — the two mixer products.</b> The in-phase branch multiplies by $\cos(2\pi f_{LO}t)$ and the quadrature branch by $-\sin(2\pi f_{LO}t)$. Using the product-to-sum identities, each mixer creates a sum term near $2f_{LO}$ and a difference term near baseband. Explicitly, for a real signal $r(t)$, $I_{raw}(t)=r(t)\cos(2\pi f_{LO}t)$ contains a component at $f_{RF}-f_{LO}$ and one at $f_{RF}+f_{LO}$; the low-pass filter after the mixer removes the high $2f_{LO}$ term and keeps only the low-frequency difference. The same happens on the Q branch with $-\sin$. Carrying the algebra through with $r=\operatorname{Re}\{\tilde r\,e^{j2\pi f_{RF}t}\}$ gives, after the LPF, $I(t)=\tfrac12\operatorname{Re}\{\tilde r(t)e^{j2\pi(f_{RF}-f_{LO})t}\}$ and $Q(t)=\tfrac12\operatorname{Im}\{\tilde r(t)e^{j2\pi(f_{RF}-f_{LO})t}\}$.</p>
        <p><b>Step 2 — combine into a complex signal.</b> Form $x(t)=I(t)+jQ(t)=\tfrac12\,\tilde r(t)\,e^{j2\pi(f_{RF}-f_{LO})t}$.</p>
        <p><b>Step 3 — impose the zero-IF condition.</b> Set $f_{LO}=f_{RF}$ so the exponent vanishes:</p>
        $$x(t)=\tfrac12\,\tilde r(t).$$
        <p>Equivalently, in operator form the I/Q mix is exactly a multiplication by $e^{-j2\pi f_{LO}t}$: $x(t)=\tfrac12\,\tilde r(t)e^{-j2\pi f_{LO}t}\big|_{f_{LO}=f_{RF}}$.</p>
        <p><b>Result / sanity check.</b> $$x(t)=I(t)+jQ(t)=\tfrac12\,\tilde r(t).$$ The complex mix is a one-sided ($e^{-j\omega t}$) shift, so it does <i>not</i> fold $+f$ onto $-f$ — the reason both sidebands survive. A single real mixer (I only) would keep just $\operatorname{Re}\{\tfrac12\tilde r\}$ and lose the sideband information.</p>`
      },
      {
        title: 'Image-rejection ratio from I/Q amplitude & phase mismatch',
        tex: String.raw`$$\text{IRR}\approx\frac{\varepsilon^2+\phi^2}{4}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Perfect quadrature would give $x(t)=I+jQ$ with the Q branch exactly $90^\circ$ and unit gain relative to I. Real hardware has a gain mismatch $\varepsilon$ (fractional amplitude error, so the Q gain is $1+\varepsilon$) and a phase mismatch $\phi$ (the LO quadrature departs from $90^\circ$ by $\phi$ radians). We find how much of the image leaks through.</p>
        <p><b>Step 1 — model the imbalanced mix.</b> An imbalanced I/Q downconverter maps the ideal complex baseband $x$ to $y=K_1 x + K_2 x^\ast$, where $x^\ast$ is the conjugate (the image). Writing the I gain as 1 and the Q gain as $(1+\varepsilon)e^{j\phi}$, the two coefficients are $K_1=\tfrac12\big(1+(1+\varepsilon)e^{-j\phi}\big)$ and $K_2=\tfrac12\big(1-(1+\varepsilon)e^{+j\phi}\big)$. The wanted term rides on $K_1$; the leaked image rides on $K_2$.</p>
        <p><b>Step 2 — expand for small mismatch.</b> For small $\varepsilon$ and small $\phi$ (radians), use $e^{\pm j\phi}\approx 1\pm j\phi$. Then $K_1\approx 1$, and $K_2\approx\tfrac12\big(1-(1+\varepsilon)(1+j\phi)\big)\approx\tfrac12\big(-\varepsilon-j\phi\big)=-\tfrac12(\varepsilon+j\phi)$.</p>
        <p><b>Step 3 — form the power ratio.</b> The image-rejection ratio is the image power over the wanted power, $\text{IRR}=|K_2|^2/|K_1|^2$. With $|K_1|^2\approx1$ and $|K_2|^2=\tfrac14(\varepsilon^2+\phi^2)$,</p>
        $$\text{IRR}\approx\frac{\varepsilon^2+\phi^2}{4}.$$
        <p><b>Result / sanity check.</b> $$\text{IRR}\approx\frac{\varepsilon^2+\phi^2}{4}\quad\Rightarrow\quad \text{IRR(dB)}=10\log_{10}\!\frac{\varepsilon^2+\phi^2}{4}.$$ With $\varepsilon=0$ and $\phi=0$ the image vanishes ($\text{IRR}\to-\infty$ dB), as expected. Amplitude and phase errors add in quadrature. Example: $\phi=1^\circ=0.0175$ rad with $\varepsilon=0$ gives $\text{IRR}=10\log_{10}(0.0175^2/4)=10\log_{10}(7.6\times10^{-5})\approx-41$ dB.</p>`
      },
      {
        title: 'DC offset from LO self-mixing',
        tex: String.raw`$$V_{DC}=\tfrac12\,\alpha\,A_{LO}^2$$`,
        derivation: String.raw`<p><b>Where we start.</b> A fraction of the local oscillator leaks to the mixer's RF port and mixes with the same LO on the switching port. We compute the low-frequency (DC) product this creates. Let the LO be $s(t)=A_{LO}\cos(2\pi f_{LO}t)$ and let a leakage coefficient $\alpha$ describe the fraction that reaches the RF port.</p>
        <p><b>Step 1 — the leaked RF-port term.</b> The RF port therefore sees $\alpha\,A_{LO}\cos(2\pi f_{LO}t)$ in addition to the wanted signal. The mixer multiplies this by the LO drive $\cos(2\pi f_{LO}t)$ (unit-normalised switching), so the self-mixing product is $\alpha A_{LO}\cos^2(2\pi f_{LO}t)$.</p>
        <p><b>Step 2 — apply the double-angle identity.</b> Using $\cos^2\theta=\tfrac12\big(1+\cos2\theta\big)$,</p>
        $$\alpha A_{LO}\cos^2(2\pi f_{LO}t)=\tfrac12\alpha A_{LO}\big(1+\cos(4\pi f_{LO}t)\big).$$
        <p>(If the leaked amplitude is itself proportional to $A_{LO}$, i.e. $\propto\alpha A_{LO}^2$, the DC term scales with LO power $A_{LO}^2$ — the form quoted above.)</p>
        <p><b>Step 3 — low-pass filter.</b> The baseband LPF removes the $2f_{LO}$ term and keeps the constant, leaving a DC offset</p>
        $$V_{DC}=\tfrac12\,\alpha\,A_{LO}^2.$$
        <p><b>Result / sanity check.</b> $$V_{DC}=\tfrac12\,\alpha\,A_{LO}^2.$$ The offset grows with LO power and leakage, and — crucially — sits at exactly 0 Hz, in the centre of the wanted band. If the reflection path varies (LO radiating and bouncing off moving objects), $\alpha$ becomes time-varying and the offset <i>drifts</i>, which is why a static one-time cancellation is insufficient and a servo/tracking loop is used.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What defines a zero-IF receiver?`, back: String.raw`$f_{LO}=f_{RF}$ so the IF is zero: the channel downconverts straight to baseband (DC). Also called direct-conversion or homodyne.` },
      { front: String.raw`Why is quadrature (I/Q) mixing mandatory in zero-IF?`, back: String.raw`With IF=0 the signal is its own image; a single real mixer folds the two sidebands onto each other. I/Q mixing ($\cos$ and $-\sin$) separates positive from negative baseband frequencies.` },
      { front: String.raw`What complex operation does I/Q downconversion perform?`, back: String.raw`It multiplies by $e^{-j2\pi f_{LO}t}$, forming $x(t)=I+jQ=\tfrac12\tilde r(t)$ at zero IF — a one-sided shift that preserves both sidebands.` },
      { front: String.raw`What is the main cause of DC offset in zero-IF?`, back: String.raw`LO self-mixing: LO leaks to the RF port and mixes with itself, producing a product at 0 Hz that lands in the wanted band.` },
      { front: String.raw`Where does a DC offset move the constellation?`, back: String.raw`It adds a constant to I and Q, shifting the whole constellation off the origin — and can be larger than the wanted signal.` },
      { front: String.raw`Give the small-mismatch image-rejection ratio formula.`, back: String.raw`$\text{IRR}\approx(\varepsilon^2+\phi^2)/4$, with $\varepsilon$ the fractional gain error and $\phi$ the phase error in radians; in dB it is $10\log_{10}$ of that.` },
      { front: String.raw`How is I/Q imbalance corrected?`, back: String.raw`DSP I/Q calibration: estimate the gain $\varepsilon$ and phase $\phi$ errors (pilot or blind) and apply the inverse correction, pushing IRR below $-40$ dB.` },
      { front: String.raw`Why is flicker (1/f) noise worse in zero-IF than in a superhet?`, back: String.raw`The signal sits at baseband, right on the $1/f$ corner; in a superhet it sits at a high IF where flicker is negligible. Chopping and larger devices help.` },
      { front: String.raw`Why is IP2 (even-order distortion) critical in zero-IF?`, back: String.raw`Two strong interferers beating through a second-order nonlinearity create a low-frequency envelope that falls at DC — in-band. High-IP2 balanced design fixes it.` },
      { front: String.raw`What is LO leakage/radiation and why does it matter here?`, back: String.raw`The on-channel LO can leak out the antenna, causing spurious emissions and desensitising nearby receivers. Fixed with LO isolation and balanced mixers.` },
      { front: String.raw`Name the key advantages of zero-IF over superheterodyne.`, back: String.raw`No image-reject filter, no IF strip, baseband LPF channel selection (integrable and tunable), small area — dominant in SDR and phones.` },
      { front: String.raw`What is a low-IF receiver and why use it?`, back: String.raw`A small non-zero IF to dodge DC offset and flicker noise while staying integrable, at the cost of a modest image-rejection requirement.` },
      { front: String.raw`How does a superheterodyne avoid DC offset, flicker and IP2 products?`, back: String.raw`Those all fall outside the IF passband and are filtered away — which is exactly why they are "zero-IF-specific" impairments.` },
      { front: String.raw`Which mitigations remove DC offset?`, back: String.raw`AC-coupling/high-pass, a DC servo feedback loop, or digital estimation/notch during idle slots.` }
    ],
    mcqs: [
      { q: String.raw`In a zero-IF receiver, the local oscillator frequency is chosen so that:`, options: [String.raw`$f_{LO}=f_{RF}$ (IF = 0)`, String.raw`$f_{LO}=f_{RF}+f_{IF}$`, String.raw`$f_{LO}=2 f_{RF}$`, String.raw`$f_{LO}=f_{RF}/2$`], answer: 0, explain: String.raw`Zero-IF (direct conversion) sets $f_{LO}=f_{RF}$, so the IF is zero and the channel folds to baseband.` },
      { q: String.raw`Why must a zero-IF receiver use quadrature (I/Q) mixing?`, options: [String.raw`To double the gain`, String.raw`Because the signal is its own image and a real mixer folds the sidebands`, String.raw`To reject the DC offset`, String.raw`To lower the noise figure`], answer: 1, explain: String.raw`With IF=0 the image is the mirror sideband of the same channel; only a complex (I/Q) mix keeps $+f$ and $-f$ distinct.` },
      { q: String.raw`The complex baseband formed by I/Q downconversion is equivalent to multiplying $r(t)$ by:`, options: [String.raw`$\cos(2\pi f_{LO}t)$`, String.raw`$e^{-j2\pi f_{LO}t}$`, String.raw`$\delta(t)$`, String.raw`$e^{+j4\pi f_{LO}t}$`], answer: 1, explain: String.raw`Forming $I+jQ$ with $\cos$ and $-\sin$ is a one-sided shift, i.e. multiplication by $e^{-j2\pi f_{LO}t}$.` },
      { q: String.raw`The dominant cause of static DC offset in a zero-IF receiver is:`, options: [String.raw`Thermal noise`, String.raw`LO self-mixing`, String.raw`ADC quantisation`, String.raw`Antenna mismatch`], answer: 1, explain: String.raw`LO leakage to the RF port mixes with the LO to produce a 0 Hz product — LO self-mixing.` },
      { q: String.raw`A DC offset at the mixer output affects the received constellation by:`, options: [String.raw`Rotating it`, String.raw`Scaling it`, String.raw`Shifting it off the origin`, String.raw`Adding phase noise`], answer: 2, explain: String.raw`A DC offset is a constant added to I and Q, translating the whole constellation away from the origin.` },
      { q: String.raw`For small mismatches, the image-rejection ratio is approximately:`, options: [String.raw`$(\varepsilon+\phi)/2$`, String.raw`$(\varepsilon^2+\phi^2)/4$`, String.raw`$\varepsilon\phi$`, String.raw`$4(\varepsilon^2+\phi^2)$`], answer: 1, explain: String.raw`$\text{IRR}\approx(\varepsilon^2+\phi^2)/4$ with $\phi$ in radians; amplitude and phase errors add in quadrature.` },
      { q: String.raw`Compared with a high-IF superheterodyne, 1/f flicker noise in zero-IF is:`, options: [String.raw`Negligible`, String.raw`Worse, because the signal sits at baseband`, String.raw`Filtered by the IF filter`, String.raw`Only a problem at high temperature`], answer: 1, explain: String.raw`The signal is at DC, on top of the $1/f$ corner; a superhet places it at a high IF where flicker is negligible.` },
      { q: String.raw`Even-order distortion is especially harmful in zero-IF because its product:`, options: [String.raw`Falls at $2f_{LO}$`, String.raw`Falls at DC / low frequency, in-band`, String.raw`Is always filtered out`, String.raw`Only affects the LO`], answer: 1, explain: String.raw`Two interferers through a second-order nonlinearity create a low-frequency envelope that lands at baseband — hence the IP2 emphasis.` },
      { q: String.raw`Which is a structural advantage of zero-IF over superheterodyne?`, options: [String.raw`Better IP2`, String.raw`No image-reject filter and no IF strip`, String.raw`Lower flicker noise`, String.raw`Immune to DC offset`], answer: 1, explain: String.raw`Removing the image filter and IF stage makes zero-IF highly integrable and tunable.` },
      { q: String.raw`I/Q gain and phase imbalance is best corrected by:`, options: [String.raw`A sharper RF filter`, String.raw`DSP I/Q calibration`, String.raw`Increasing LO power`, String.raw`AC coupling`], answer: 1, explain: String.raw`Estimating $\varepsilon$ and $\phi$ and applying the inverse in the DSP routinely pushes IRR below $-40$ dB.` },
      { q: String.raw`A DC servo loop or AC-coupling capacitor is used to combat:`, options: [String.raw`I/Q imbalance`, String.raw`DC offset`, String.raw`Phase noise`, String.raw`Image frequency`], answer: 1, explain: String.raw`Both remove the DC term from LO self-mixing; AC-coupling also notches near-DC signal energy.` },
      { q: String.raw`A low-IF receiver differs from zero-IF by:`, options: [String.raw`Using a small non-zero IF to dodge DC offset/flicker`, String.raw`Requiring no I/Q mixing`, String.raw`Using $f_{LO}=2f_{RF}$`, String.raw`Having no baseband filter`], answer: 0, explain: String.raw`Low-IF shifts the signal slightly off DC to avoid DC offset and flicker, at the price of a modest image-rejection spec.` }
    ],
    numericals: [
      { q: String.raw`A zero-IF receiver has an I/Q amplitude imbalance of 0.5 dB and a phase imbalance of 2°. Estimate the image-rejection ratio (IRR) in dB.`, solution: String.raw`<p><b>Formula.</b> For small mismatch $\text{IRR}\approx(\varepsilon^2+\phi^2)/4$, where $\varepsilon$ is the fractional amplitude error and $\phi$ the phase error in radians; the dB value is $10\log_{10}$ of this. Convert the amplitude imbalance $g$ (dB) to $\varepsilon$ via $\varepsilon=10^{g/20}-1$ and the phase to radians via $\phi=\theta^\circ\times\pi/180$.</p>
<p><b>Substitute.</b> $$\varepsilon=10^{0.5/20}-1,\qquad \phi=2\times\frac{\pi}{180},\qquad \text{IRR}=10\log_{10}\!\frac{\varepsilon^2+\phi^2}{4}.$$</p>
<p><b>Compute.</b> $\varepsilon=10^{0.025}-1=1.0593-1=0.0593$, so $\varepsilon^2=3.52\times10^{-3}$. $\phi=0.0349$ rad, so $\phi^2=1.22\times10^{-3}$. Sum $=4.73\times10^{-3}$; divide by 4 $=1.18\times10^{-3}$. Then $\text{IRR}=10\log_{10}(1.18\times10^{-3})\approx-29.3$ dB.</p>
<p><b>Explanation.</b> The two errors add in quadrature; here the amplitude term ($3.5\times10^{-3}$) dominates the phase term ($1.2\times10^{-3}$). About $-29$ dB is mediocre for high-order QAM, so DSP I/Q calibration would be applied to drive it below $-40$ dB. Halving both errors would improve IRR by ~6 dB.</p>` },
      { q: String.raw`A channel occupies 20 MHz of RF bandwidth. What baseband (low-pass) bandwidth must each of the I and Q paths pass in a zero-IF receiver, and what is the ideal minimum complex sample rate?`, solution: String.raw`<p><b>Formula.</b> At zero IF the channel centres on DC and occupies $\pm B/2$, so each real baseband path needs a low-pass bandwidth $B_{LPF}=B/2$. For complex (I+jQ) sampling the Nyquist rate equals the complex bandwidth $B$ (one complex sample carries both I and Q).</p>
<p><b>Substitute.</b> $$B_{LPF}=\frac{B}{2}=\frac{20\text{ MHz}}{2},\qquad f_{s,\text{complex}}\ge B=20\text{ MHz}.$$</p>
<p><b>Compute.</b> $B_{LPF}=10$ MHz per I/Q path; the minimum complex sample rate is 20 Msample/s (i.e. 20 MHz on each of the I and Q ADCs).</p>
<p><b>Explanation.</b> Because the channel straddles DC, each real path only spans half the channel (10 MHz), but the two together (complex) carry the full 20 MHz. A superhet at IF would instead need real sampling at $\ge 2B=40$ MHz for the same channel — the zero-IF complex approach halves the per-converter Nyquist requirement.</p>` },
      { q: String.raw`Explain quantitatively why a DC offset in a zero-IF receiver maps to the origin of the constellation, using an offset of 0.10 V added to a QPSK signal of amplitude 0.30 V.`, solution: String.raw`<p><b>Formula.</b> The received complex baseband is $x=(I+I_{dc})+j(Q+Q_{dc})$, so a DC offset $(I_{dc},Q_{dc})$ is a constant translation of every symbol: $x=s+d$ with $d=I_{dc}+jQ_{dc}$. It shifts the constellation centroid from 0 to $d$.</p>
<p><b>Substitute.</b> Take $d=0.10+j0.10$ V added to ideal QPSK points $s=\tfrac{0.30}{\sqrt2}(\pm1\pm j)$ V (amplitude 0.30 V). $$x=s+(0.10+j0.10).$$</p>
<p><b>Compute.</b> The QPSK points have coordinates $\pm0.212$ V. After the offset the four points become $(0.312,0.312),(0.312,-0.112),(-0.112,0.312),(-0.112,-0.112)$ V — the whole cloud has moved by $(0.10,0.10)$ toward the origin's shift, and its centroid is at $(0.10,0.10)$ instead of $(0,0)$.</p>
<p><b>Explanation.</b> A DC term is not signal-dependent, so it does not rotate or scale the constellation — it rigidly translates it. Here the 0.10 V offset is a third of the 0.30 V signal amplitude, badly biasing the decision regions; that is why the constellation appears pulled off the origin and why DC-offset removal (servo/AC-couple) is essential before slicing.</p>` },
      { q: String.raw`An I/Q imbalance gives an image-rejection ratio of $-30$ dB. Estimate the resulting EVM contribution (as a percentage), treating the leaked image as the error term.`, solution: String.raw`<p><b>Formula.</b> Modeling the leaked image as an added error whose power relative to the signal is the IRR, the RMS error-vector magnitude contribution is $\text{EVM}=\sqrt{\text{IRR(linear)}}=10^{\text{IRR(dB)}/20}$, expressed as a percentage by $\times100$.</p>
<p><b>Substitute.</b> $$\text{IRR(linear)}=10^{-30/10}=10^{-3},\qquad \text{EVM}=\sqrt{10^{-3}}=10^{-30/20}.$$</p>
<p><b>Compute.</b> $\text{EVM}=10^{-1.5}=0.0316=3.16\%$.</p>
<p><b>Explanation.</b> A $-30$ dB image contributes about 3.2% EVM, which already jeopardises 64-QAM (needs roughly $<2\%$) and rules out 256-QAM. Improving IRR to $-40$ dB drops the contribution to $1.0\%$ — a factor of $\sqrt{10}\approx3.16$ per 10 dB. This is why high-order QAM in zero-IF radios depends on good I/Q calibration.</p>` },
      { q: String.raw`Compare converter effort: a signal at a 70 MHz IF (real, 20 MHz channel) vs the same channel at zero IF (complex). What minimum ADC rates are required in each case?`, solution: String.raw`<p><b>Formula.</b> Real bandpass sampling of an IF requires $f_{s,\text{real}}\ge 2\times(\text{highest frequency of interest})$ for straightforward Nyquist sampling, i.e. $\ge 2(f_{IF}+B/2)$; zero-IF complex sampling requires each of the two ADCs to run only at $f_{s,\text{cx}}\ge B$ (the channel bandwidth), since I and Q together form a complex stream.</p>
<p><b>Substitute.</b> $$f_{s,\text{real}}\ge 2\left(70\text{ MHz}+\frac{20}{2}\text{ MHz}\right),\qquad f_{s,\text{cx}}\ge 20\text{ MHz (per I and Q ADC)}.$$</p>
<p><b>Compute.</b> IF Nyquist: $f_{s,\text{real}}\ge 2\times80=160$ MHz (one fast ADC). Zero-IF: two ADCs at 20 MHz each = 40 Msample/s total, but at one-quarter the clock speed of the IF converter.</p>
<p><b>Explanation.</b> Direct IF sampling demands a very fast, high-dynamic-range ADC (undersampling can reduce this but adds aliasing/jitter constraints), whereas zero-IF trades one fast converter for two slow, low-power baseband converters. That converter relaxation — plus dropping the image filter and IF strip — is a core reason zero-IF dominates integrated SDR front-ends.</p>` }
    ],
    realWorld: String.raw`<p>Direct-conversion is the default architecture of essentially every modern integrated radio. In a smartphone the cellular, <a href="#wifi">WiFi</a> and Bluetooth transceivers are zero-IF (or low-IF) I/Q radios: the RFIC generates an on-channel LO in a fractional-N synthesizer, downconverts to complex baseband, and hands I and Q to the modem's ADCs and DSP, where DC offset and I/Q imbalance are calibrated out in real time. Wideband software-defined radios such as the Analog Devices <a href="#ad9361">AD9361</a> are built around exactly this chain — quadrature <a href="#mixer">mixers</a> after the <a href="#lna">LNA</a>, tunable baseband low-pass filters for channel selection, and on-chip I/Q and DC-offset calibration — which is what lets one small chip cover 70 MHz to 6 GHz with no external image filter. The price paid is engineering the impairments this topic covers: LO self-mixing DC offset, I/Q imbalance (which caps <a href="#evm">EVM</a> and thus how high-order a <a href="#qpsk">QAM</a> constellation the link can use), baseband flicker noise, LO radiation limits, and IP2. Where the very cleanest dynamic range is required — some base-station and instrumentation receivers — a <a href="#superheterodyne">superheterodyne</a> with a real <a href="#intermediate-frequency">IF</a> and an <a href="#image-frequency">image-reject</a> filter is still chosen, trading integration for performance.</p>`,
    related: ['superheterodyne', 'intermediate-frequency', 'mixer', 'sdr', 'ad9361', 'image-frequency']
  }
);
