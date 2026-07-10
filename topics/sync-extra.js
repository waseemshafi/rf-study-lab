// Synchronization extra topics: VCO, NCO, CFO, DLL
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'vco',
    title: 'Voltage-Controlled Oscillator (VCO)',
    category: 'Synchronization',
    tags: ['oscillator', 'PLL', 'phase noise', 'tuning', 'varactor', 'Kvco'],
    summary: String.raw`A VCO is an oscillator whose instantaneous output frequency is a (nominally linear) function of an applied control voltage, acting as the frequency-to-phase integrator at the heart of every analog PLL.`,
    diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 520 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-vco" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="14" y="70" fill="#e6edf3">V<tspan baseline-shift="sub" font-size="9">ctrl</tspan></text>
        <line x1="60" y1="70" x2="118" y2="70" stroke="#9aa7b5" marker-end="url(#arr-vco)"/>
        <rect x="120" y="44" width="150" height="52" rx="6" fill="#1c232e" stroke="#4dabf7"/>
        <text x="195" y="66" fill="#e6edf3" text-anchor="middle">VCO</text>
        <text x="195" y="84" fill="#9aa7b5" text-anchor="middle">gain K<tspan baseline-shift="sub" font-size="9">vco</tspan> (Hz/V)</text>
        <text x="195" y="118" fill="#9aa7b5" text-anchor="middle">LC tank + varactor C(V)</text>
        <line x1="270" y1="70" x2="340" y2="70" stroke="#9aa7b5" marker-end="url(#arr-vco)"/>
        <rect x="342" y="44" width="164" height="52" rx="6" fill="#1c232e" stroke="#63e6be"/>
        <text x="424" y="66" fill="#e6edf3" text-anchor="middle">output</text>
        <text x="424" y="84" fill="#9aa7b5" text-anchor="middle">f = f<tspan baseline-shift="sub" font-size="9">0</tspan> + K<tspan baseline-shift="sub" font-size="9">vco</tspan>·V<tspan baseline-shift="sub" font-size="9">ctrl</tspan></text>
        <text x="305" y="30" fill="#ffa94d" text-anchor="middle">phase = ∫ f dt  →  1/s integrator</text>
      </svg>`,
      caption: String.raw`Control voltage tunes an LC-tank/varactor VCO: output frequency f = f0 + Kvco·Vctrl, and phase is its time-integral (1/s).`
    },
    {
      title: String.raw`VCO inside a PLL (the actuator that closes the loop)`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-vco" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">VCO as the frequency actuator of a charge-pump PLL</text>
        <text x="14" y="82" fill="#9aa7b5">f<tspan baseline-shift="sub" font-size="9">ref</tspan></text>
        <line x1="34" y1="86" x2="60" y2="86" stroke="#9aa7b5" marker-end="url(#arr2-vco)"/>
        <rect x="60" y="66" width="70" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="95" y="84" fill="#e6edf3" text-anchor="middle">PFD</text><text x="95" y="99" fill="#9aa7b5" font-size="9" text-anchor="middle">K<tspan baseline-shift="sub" font-size="8">pd</tspan></text>
        <rect x="160" y="66" width="80" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="200" y="84" fill="#e6edf3" text-anchor="middle">loop filt</text><text x="200" y="99" fill="#9aa7b5" font-size="9" text-anchor="middle">F(s)</text>
        <rect x="270" y="66" width="90" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="315" y="84" fill="#e6edf3" text-anchor="middle">VCO</text><text x="315" y="99" fill="#9aa7b5" font-size="9" text-anchor="middle">2πK<tspan baseline-shift="sub" font-size="8">vco</tspan>/s</text>
        <line x1="130" y1="86" x2="160" y2="86" stroke="#9aa7b5" marker-end="url(#arr2-vco)"/>
        <line x1="240" y1="86" x2="270" y2="86" stroke="#9aa7b5" marker-end="url(#arr2-vco)"/><text x="255" y="79" fill="#9aa7b5" font-size="9">V<tspan baseline-shift="sub" font-size="8">ctrl</tspan></text>
        <line x1="360" y1="86" x2="470" y2="86" stroke="#9aa7b5" marker-end="url(#arr2-vco)"/><text x="430" y="79" fill="#63e6be" font-size="11">f<tspan baseline-shift="sub" font-size="9">out</tspan>=N f<tspan baseline-shift="sub" font-size="9">ref</tspan></text>
        <rect x="230" y="150" width="80" height="36" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="270" y="172" fill="#e6edf3" text-anchor="middle">÷ N</text>
        <line x1="410" y1="86" x2="410" y2="168" stroke="#9aa7b5"/><line x1="410" y1="168" x2="310" y2="168" stroke="#9aa7b5" marker-end="url(#arr2-vco)"/>
        <line x1="230" y1="168" x2="95" y2="168" stroke="#9aa7b5"/><line x1="95" y1="168" x2="95" y2="106" stroke="#9aa7b5" marker-end="url(#arr2-vco)"/>
        <text x="160" y="163" fill="#9aa7b5" font-size="9" text-anchor="middle">feedback (÷N phase)</text>
      </svg>`,
      caption: String.raw`The VCO is the actuator of a PLL: the PFD compares reference and divided VCO phase, the loop filter converts error to Vctrl, and the VCO's 2πKvco/s integrator closes the loop. The ÷N feedback gives fout = N·fref — frequency multiplication a DLL cannot do.`
    },
    {
      title: String.raw`Varactor tuning mechanism (V → C(V) → f)`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-vco" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">How a control voltage becomes a frequency</text>
        <rect x="30" y="70" width="96" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="78" y="90" fill="#e6edf3" text-anchor="middle">V<tspan baseline-shift="sub" font-size="9">ctrl</tspan></text><text x="78" y="106" fill="#9aa7b5" font-size="9" text-anchor="middle">reverse bias</text>
        <rect x="176" y="70" width="120" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="236" y="90" fill="#e6edf3" text-anchor="middle">varactor C(V)</text><text x="236" y="106" fill="#9aa7b5" font-size="9" text-anchor="middle">depletion cap ↓ as V↑</text>
        <rect x="346" y="70" width="108" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="400" y="90" fill="#e6edf3" text-anchor="middle">LC tank</text><text x="400" y="106" fill="#9aa7b5" font-size="9" text-anchor="middle">f=1/(2π√(LC))</text>
        <line x1="126" y1="92" x2="176" y2="92" stroke="#9aa7b5" marker-end="url(#arr3-vco)"/>
        <line x1="296" y1="92" x2="346" y2="92" stroke="#9aa7b5" marker-end="url(#arr3-vco)"/>
        <line x1="454" y1="92" x2="500" y2="92" stroke="#9aa7b5" marker-end="url(#arr3-vco)"/><text x="478" y="84" fill="#63e6be" font-size="11">f<tspan baseline-shift="sub" font-size="9">out</tspan></text>
        <text x="270" y="165" fill="#b197fc" font-size="11" text-anchor="middle">K<tspan baseline-shift="sub" font-size="9">vco</tspan> = df/dV = −(f/2C)·(dC/dV)</text>
        <text x="270" y="184" fill="#9aa7b5" font-size="10" text-anchor="middle">bigger dC/dV → wider tuning range but more injected control-line noise</text>
      </svg>`,
      caption: String.raw`Varactor tuning chain: the control voltage sets the reverse bias, which sets the varactor's depletion capacitance C(V); C tunes the LC resonance f=1/(2π√(LC)). Differentiating gives Kvco = −(f/2C)(dC/dV) — the source of the tuning-range vs phase-noise trade.`
    }
    ],
    prerequisites: ['comm-basics', 'phase-noise', 'pll'],
    intro: String.raw`<p><b>Why does the VCO exist?</b> A feedback loop can only correct a frequency if it has a knob to turn — some element whose output frequency responds to an electrical signal. The VCO is that knob. Without a voltage-to-frequency actuator there is no way for a phase-locked loop to steer its oscillator toward the reference, no way to synthesize a tunable local oscillator from a fixed crystal, and no way to demodulate FM. The VCO is the actuator that makes every analog synchronization and synthesis loop possible; its two defining properties — a tuning law and a phase-noise floor — set the agility and spectral purity of everything built around it.</p>
<p>A <b>Voltage-Controlled Oscillator (VCO)</b> converts a control <i>voltage</i> into an oscillation <i>frequency</i>. It is the actuator of an analog phase-locked loop: the loop filter drives the VCO's tuning port, and the VCO's phase is the quantity that is ultimately aligned to the reference. Understanding the VCO means understanding two things deeply: (1) its <b>tuning law</b> $f_{out}=f_0+K_{vco}V_{ctrl}$ and the crucial fact that <b>frequency is the derivative of phase</b>, so the VCO behaves as a $1/s$ integrator in the phase domain; and (2) its <b>phase noise</b>, described by Leeson's model, which sets the ultimate spectral purity of any synthesizer built around it.</p>`,
    sections: [
      {
        h: 'What a VCO is and the tuning law',
        html: String.raw`<p>A VCO produces a periodic signal $v(t)=A\cos\big(\theta(t)\big)$ whose <b>instantaneous frequency</b> is controlled by an input voltage $V_{ctrl}$. Around a bias point the relationship is linearised as</p>
        <p>$$f_{out}(t) = f_0 + K_{vco}\,V_{ctrl}(t)$$</p>
        <p>where $f_0$ is the <b>free-running (rest) frequency</b> at $V_{ctrl}=0$ (or at the mid-range bias), and $K_{vco}$ is the <b>VCO gain</b> or <b>tuning sensitivity</b>. $K_{vco}$ has units of Hz/V (or, when working in angular frequency, rad/s/V, differing by a factor of $2\pi$). Typical integrated LC-VCOs have $K_{vco}$ of tens to hundreds of MHz/V; wideband ring oscillators can reach GHz/V.</p>
        <p>Two practical numbers bound the device:</p>
        <ul>
          <li><b>Tuning range:</b> the span $[f_{min},f_{max}]$ reachable as $V_{ctrl}$ sweeps its allowed range. A wide range demands a large varactor ratio, which usually costs phase noise.</li>
          <li><b>Tuning linearity:</b> real $K_{vco}$ is not constant across the range — the curve $f(V)$ is S-shaped. Loop dynamics (bandwidth, damping) therefore drift with the operating frequency because loop gain $\propto K_{vco}$.</li>
        </ul>
        <div class="callout"><b>Key intuition:</b> a VCO is a voltage-to-frequency converter, but in a PLL you must think of it as a voltage-to-<i>phase</i> converter with a built-in integration. That single integrator is what lets a PLL drive steady-state phase error to zero for a frequency step.</div>`
      },
      {
        h: 'The VCO as a phase integrator (why 1/s)',
        html: String.raw`<p>The single most important VCO fact for loop analysis: <b>instantaneous frequency is the time-derivative of phase</b>, hence phase is the time-<i>integral</i> of frequency. Excess phase (departure from the nominal $2\pi f_0 t$ carrier) is</p>
        <p>$$\phi(t)=2\pi\!\int_0^t \big(f_{out}(\tau)-f_0\big)\,d\tau = 2\pi K_{vco}\!\int_0^t V_{ctrl}(\tau)\,d\tau.$$</p>
        <p>Taking the Laplace transform, the transfer function from control voltage to excess phase is</p>
        <p>$$\frac{\Phi(s)}{V_{ctrl}(s)} = \frac{2\pi K_{vco}}{s}.$$</p>
        <p>The $1/s$ is not incidental — it is the defining feature. Contrast this with a <b>DLL</b>, whose delay line contributes a pure gain (no $1/s$), which is exactly why DLLs are first-order and unconditionally stable while PLLs are second-order and can ring.</p>
        <p>This integrator also explains why VCO phase noise dominates at <i>low</i> offset frequencies: any control-line noise or intrinsic device noise is integrated, so slow fluctuations accumulate into large phase excursions (random-walk / $1/f^3$ behaviour close to the carrier).</p>`
      },
      {
        h: 'Physical implementations and varactor tuning',
        html: String.raw`<p>Most RF VCOs are <b>LC resonator</b> oscillators: an inductor $L$ resonates with a capacitance $C$ at $f_{osc}=1/(2\pi\sqrt{LC})$, and a cross-coupled transistor pair supplies the negative resistance to cancel tank loss and sustain oscillation. Frequency is tuned by making $C$ voltage-dependent using a <b>varactor</b> (a reverse-biased diode or MOS capacitor whose depletion capacitance $C(V)$ shrinks as reverse bias grows).</p>
        <p>Differentiating $f=1/(2\pi\sqrt{LC})$ gives the tuning sensitivity</p>
        <p>$$K_{vco}=\frac{df}{dV}= -\frac{f}{2C}\,\frac{dC}{dV},$$</p>
        <p>so sensitivity scales with the varactor's $dC/dV$. Other topologies:</p>
        <ul>
          <li><b>Ring oscillators:</b> odd number of inverting delay stages; frequency set by delay-per-stage via bias current. Very wide tuning, small area, but far worse phase noise than LC.</li>
          <li><b>Crystal-based VCXO/TCXO:</b> a varactor pulls a crystal by a tiny amount (ppm). Extremely low noise but almost no tuning range — used as clean references, not wideband synthesis.</li>
          <li><b>YIG oscillators:</b> a ferrite sphere tuned by a magnetic field; multi-octave, low noise, used in instrumentation.</li>
        </ul>`
      },
      {
        h: 'Phase noise and the Leeson model',
        html: String.raw`<p>No oscillator is spectrally pure — thermal and flicker noise modulate the phase, spreading the ideal delta-function spectrum into skirts. <b>Phase noise</b> $\mathcal{L}(f_m)$ is the single-sideband noise power in a 1 Hz bandwidth at offset $f_m$ from the carrier, normalised to carrier power, in dBc/Hz. <b>Leeson's semi-empirical model</b> captures the shape:</p>
        <p>$$\mathcal{L}(f_m)=10\log_{10}\!\left[\frac{2FkT}{P_{sig}}\left(1+\frac{f_0^2}{(2Q_L f_m)^2}\right)\left(1+\frac{f_c}{f_m}\right)\right].$$</p>
        <p>Reading the regions from far-in to far-out:</p>
        <ul>
          <li><b>$1/f^3$ (close-in):</b> device flicker ($1/f$) noise up-converted and then integrated — corner at $f_c$.</li>
          <li><b>$1/f^2$:</b> white noise integrated by the oscillator (the phase-integrator random walk). Slope set by the $f_0^2/(2Q_L f_m)^2$ term.</li>
          <li><b>Flat noise floor:</b> the additive $2FkT/P_{sig}$ thermal floor far from carrier.</li>
        </ul>
        <p><b>Design levers:</b> raise loaded $Q_L$ (dominant — noise improves as $1/Q_L^2$), raise signal power $P_{sig}$, and lower device noise figure $F$. This is why LC (high-$Q$) beats ring (low-$Q$) oscillators by 20-40 dB.</p>
        <div class="callout"><b>Loop interaction:</b> inside a PLL, the loop <i>high-pass</i> filters VCO phase noise (loop suppresses it below the loop bandwidth) and <i>low-pass</i> filters reference noise. Choosing loop bandwidth trades reference/divider noise against VCO noise — the optimum sits near their crossover.</div>`
      },
      {
        h: 'Pushing, pulling and other real-world impairments',
        html: String.raw`<p>Two impairments named on every RF datasheet:</p>
        <ul>
          <li><b>Pushing (supply pushing):</b> sensitivity of $f_{out}$ to supply voltage, in Hz/V. Because the supply is an unintended second tuning port, supply ripple modulates the carrier — a hidden spur/phase-noise source. Fix with clean regulation.</li>
          <li><b>Pulling (load pulling):</b> shift in $f_{out}$ caused by a changing load impedance (e.g. an antenna VSWR change or a nearby PA turning on). Quantified as frequency change for a given return-loss circle. Fix with a buffer/isolator between VCO and load.</li>
        </ul>
        <p>Other issues: <b>injection locking</b> (a strong nearby tone captures the VCO), <b>$K_{vco}$ variation</b> across the band destabilising the loop, and <b>temperature drift</b> of $f_0$. A common architecture uses a <b>switched-capacitor bank</b> for coarse tuning (many overlapping sub-bands) plus a small-$K_{vco}$ varactor for fine tuning — this keeps $K_{vco}$ low (good phase noise, stable loop) while still covering a wide range.</p>`
      },
      {
        h: 'The VCO inside a PLL',
        html: String.raw`<p>In a classic charge-pump PLL the VCO closes the loop. The phase/frequency detector compares reference phase to the divided VCO phase; the charge pump and loop filter convert phase error to a control voltage; the VCO integrates that into phase. The open-loop gain is</p>
        <p>$$G(s)=\underbrace{K_{pd}}_{\text{PFD}}\cdot\underbrace{F(s)}_{\text{loop filter}}\cdot\underbrace{\frac{2\pi K_{vco}}{s}}_{\text{VCO}}\cdot\underbrace{\frac{1}{N}}_{\text{divider}}.$$</p>
        <p>The output frequency is $f_{out}=N f_{ref}$, so the VCO also enables <b>frequency multiplication</b> — a capability a basic DLL lacks. Because $K_{vco}$ appears directly in loop gain, loop bandwidth and damping are functions of the operating frequency; designers minimise this dependence via the switched-cap coarse tuning above.</p>
        <table class="data">
          <tr><th>Aspect</th><th>VCO</th><th>NCO (DDS)</th></tr>
          <tr><td>Domain</td><td>Analog</td><td>Digital</td></tr>
          <tr><td>Tuning input</td><td>Voltage $V_{ctrl}$</td><td>Frequency control word (integer)</td></tr>
          <tr><td>Core relation</td><td>$f=f_0+K_{vco}V$</td><td>$f=\text{FCW}\cdot f_{clk}/2^N$</td></tr>
          <tr><td>Phase behaviour</td><td>$1/s$ integrator (continuous)</td><td>Accumulator (discrete integrator)</td></tr>
          <tr><td>Linearity</td><td>Nonlinear $K_{vco}(V)$</td><td>Exactly linear</td></tr>
          <tr><td>Frequency resolution</td><td>Continuous (analog)</td><td>$f_{clk}/2^N$ (very fine)</td></tr>
          <tr><td>Purity limit</td><td>Leeson phase noise</td><td>Truncation spurs (SFDR)</td></tr>
          <tr><td>Max frequency</td><td>Up to tens of GHz directly</td><td>$< f_{clk}/2$ (Nyquist)</td></tr>
        </table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The tuning law and the $1/s$ integrator:</b> $f_{out}=f_0+K_{vco}V_{ctrl}$, and because frequency is the derivative of phase, the VCO is a $2\pi K_{vco}/s$ integrator — the reason a PLL nulls steady-state phase error to a frequency step and why VCO noise dominates close to the carrier.</li>
<li><b>Varactor tuning:</b> $K_{vco}=-(f/2C)(dC/dV)$, so wider tuning range needs a larger $dC/dV$ (bigger $K_{vco}$), which injects more control-line noise — the central range-vs-purity tension.</li>
<li><b>Leeson phase noise:</b> $1/f^3$ close-in (flicker), $1/f^2$ (integrated white noise), then a flat floor; noise improves as $1/Q_L^2$, so high-$Q$ LC beats low-$Q$ ring by 20-40 dB.</li>
<li><b>Real-world impairments:</b> pushing (supply→frequency) and pulling (load→frequency), fixed by clean regulation and buffering; and how switched-cap coarse banks keep $K_{vco}$ small for a clean, stable loop.</li>
<li><b>The loop role:</b> a PLL high-pass filters VCO noise and low-pass filters reference noise, and the VCO enables frequency multiplication ($f_{out}=Nf_{ref}$) that a DLL cannot.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Voltage-controlled_oscillator" target="_blank" rel="noopener">Wikipedia — Voltage-controlled oscillator</a> — solid canonical overview of tuning law, LC/crystal/relaxation topologies, phase-domain modeling, and key specs (tuning range, phase noise, Q).</li>
<li><a href="https://people.engr.tamu.edu/spalermo/ecen620/lecture16_ee620_vco_pn.pdf" target="_blank" rel="noopener">Texas A&amp;M ECEN620 Lecture 16 — VCO Phase Noise</a> — graduate lecture notes deriving Leeson's model and the Hajimiri ISF theory from first principles, the deepest treatment of the $1/f^3$/$1/f^2$ skirts.</li>
<li><a href="https://people.engr.tamu.edu/spalermo/ecen620/lecture10_ee620_vcos.pdf" target="_blank" rel="noopener">Texas A&amp;M ECEN620 Lecture 10 — Voltage-Controlled Oscillators</a> — companion lecture on LC-tank and ring-oscillator design, varactor tuning, $K_{vco}$, and switched-capacitor coarse banks.</li>
<li><a href="https://www.mwrf.com/active-components/how-vco-tuning-bw-affects-phase-noise" target="_blank" rel="noopener">Microwaves &amp; RF — How VCO Tuning BW Affects Phase Noise</a> — practical article quantifying the tuning-range vs phase-noise tradeoff with measured commercial GaAs VCO data.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Tuning law: $f_{out}=f_0+K_{vco}V_{ctrl}$; $K_{vco}$ (Hz/V or rad/s/V) is the tuning sensitivity and appears directly in PLL loop gain.`,
      String.raw`Frequency is the derivative of phase, so a VCO is a $1/s$ integrator in the phase domain: $\Phi(s)/V(s)=2\pi K_{vco}/s$.`,
      String.raw`That integrator gives a PLL zero steady-state phase error for a frequency step, and makes VCO phase noise dominate close to the carrier.`,
      String.raw`LC-VCOs tune via a varactor ($C(V)$); ring oscillators tune via delay/bias — far wider range but much worse phase noise.`,
      String.raw`Leeson's model: $1/f^3$ close-in (flicker), $1/f^2$ (integrated white noise), then a flat floor; phase noise improves as $1/Q_L^2$.`,
      String.raw`Raise loaded $Q$, raise signal power, lower device $F$ to cut phase noise; high-$Q$ LC beats low-$Q$ ring by 20-40 dB.`,
      String.raw`Pushing = frequency sensitivity to supply voltage (Hz/V); pulling = frequency shift due to load impedance change — buffer/isolate to fix.`,
      String.raw`A PLL high-pass filters VCO phase noise and low-pass filters reference noise; loop bandwidth trades one against the other.`,
      String.raw`Switched-capacitor coarse bands + small-$K_{vco}$ varactor fine tuning keeps $K_{vco}$ low (clean, stable) while spanning a wide range.`,
      String.raw`Unlike a basic DLL, a VCO-based PLL provides frequency multiplication ($f_{out}=N f_{ref}$).`
    ],
    equations: [
      {
        title: 'VCO tuning law',
        tex: String.raw`$$f_{out}(t)=f_0+K_{vco}\,V_{ctrl}(t)$$`,
        derivation: String.raw`<p><b>Where we start.</b> An oscillator's instantaneous frequency depends on the reactances of its resonant tank (or the delay of its stages). We introduce one voltage-controlled element and ask how frequency responds.</p>
        <p><b>Step 1 — expand the frequency about a bias point.</b> Let the controlled element make frequency a general function $f_{out}=g(V_{ctrl})$. Around the operating voltage $V_b$, a first-order Taylor expansion gives</p>
        $$f_{out}\approx g(V_b)+\left.\frac{dg}{dV}\right|_{V_b}\big(V_{ctrl}-V_b\big).$$
        <p><b>Step 2 — name the constants.</b> Define the rest frequency $f_0\equiv g(V_b)$ and the tuning sensitivity $K_{vco}\equiv \left.dg/dV\right|_{V_b}$ (Hz/V). Re-referencing the control voltage so that $V_{ctrl}=0$ at the bias point,</p>
        $$f_{out}=f_0+K_{vco}\,V_{ctrl}.$$
        <p><b>Why linear is an approximation.</b> The true $g(V)$ (e.g. from a varactor's $C(V)$) is S-shaped, so $K_{vco}$ is only locally constant. Over a wide range you must treat $K_{vco}$ as $K_{vco}(V)$.</p>
        <p><b>Result.</b> $$f_{out}=f_0+K_{vco}V_{ctrl}.$$ Sanity check: $V_{ctrl}=0\Rightarrow f_{out}=f_0$ (free-running), and increasing $V_{ctrl}$ by 1 V shifts frequency by exactly $K_{vco}$ Hz.</p>`
      },
      {
        title: 'VCO phase transfer function (the 1/s integrator)',
        tex: String.raw`$$\frac{\Phi(s)}{V_{ctrl}(s)}=\frac{2\pi K_{vco}}{s}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Loop analysis needs the VCO's output <i>phase</i>, not frequency, because phase detectors compare phases. We convert the tuning law into a phase relation.</p>
        <p><b>Step 1 — frequency is the rate of change of phase.</b> By definition, instantaneous angular frequency $\omega(t)=d\theta/dt$. Writing total phase as the nominal carrier plus excess phase $\phi$, $\theta(t)=2\pi f_0 t+\phi(t)$, the <i>excess</i> angular frequency is $d\phi/dt=2\pi\big(f_{out}-f_0\big)$.</p>
        <p><b>Step 2 — substitute the tuning law.</b> Since $f_{out}-f_0=K_{vco}V_{ctrl}$,</p>
        $$\frac{d\phi(t)}{dt}=2\pi K_{vco}\,V_{ctrl}(t).$$
        <p><b>Step 3 — integrate to get phase.</b> Phase is the accumulated frequency:</p>
        $$\phi(t)=2\pi K_{vco}\int_0^t V_{ctrl}(\tau)\,d\tau.$$
        <p><b>Step 4 — Laplace transform.</b> Integration in time is division by $s$ in the Laplace domain, so with zero initial phase</p>
        $$\Phi(s)=2\pi K_{vco}\frac{V_{ctrl}(s)}{s}.$$
        <p><b>Result.</b> $$\frac{\Phi(s)}{V_{ctrl}(s)}=\frac{2\pi K_{vco}}{s}.$$ The pole at the origin is the loop's "free" integrator: it is why a PLL nulls steady-state phase error for a step in frequency, and why VCO noise is amplified near DC (small $s$).</p>`
      },
      {
        title: 'Varactor tuning sensitivity of an LC-VCO',
        tex: String.raw`$$K_{vco}=-\frac{f_{osc}}{2C}\frac{dC}{dV}$$`,
        derivation: String.raw`<p><b>Where we start.</b> An LC tank sets the frequency; the varactor makes $C$ depend on voltage. We find how much frequency moves per volt.</p>
        <p><b>Step 1 — resonance condition.</b> $$f_{osc}=\frac{1}{2\pi\sqrt{LC}}.$$</p>
        <p><b>Step 2 — differentiate with respect to $C$.</b> Treating $L$ as fixed and using $f\propto C^{-1/2}$,</p>
        $$\frac{df}{dC}=\frac{d}{dC}\Big[(2\pi)^{-1}L^{-1/2}C^{-1/2}\Big]=-\tfrac{1}{2}\frac{f_{osc}}{C}.$$
        <p><b>Step 3 — chain rule through the varactor.</b> Because $C$ is a function of the control voltage, $K_{vco}=df/dV=(df/dC)(dC/dV)$:</p>
        $$K_{vco}=-\frac{f_{osc}}{2C}\frac{dC}{dV}.$$
        <p><b>Result.</b> $$K_{vco}=-\frac{f_{osc}}{2C}\frac{dC}{dV}.$$ Sanity check: a varactor whose capacitance <i>decreases</i> with increasing reverse bias ($dC/dV<0$) yields $K_{vco}>0$ (frequency rises with voltage). Higher operating frequency and higher varactor $dC/dV$ both increase sensitivity — which is exactly the tension with phase noise (large tuning range = large $K_{vco}$ = more control-line noise injected).</p>`
      },
      {
        title: 'Leeson phase-noise model',
        tex: String.raw`$$\mathcal{L}(f_m)=10\log_{10}\!\left[\frac{2FkT}{P_{sig}}\left(1+\frac{f_0^2}{(2Q_L f_m)^2}\right)\left(1+\frac{f_c}{f_m}\right)\right]$$`,
        derivation: String.raw`<p><b>Where we start.</b> An oscillator is a resonator with a noisy sustaining amplifier. We build the phase-noise skirt by tracking how amplifier noise turns into phase fluctuations and how the resonator shapes them.</p>
        <p><b>Step 1 — amplifier noise floor.</b> The active device adds noise power $FkT$ per Hz (noise figure $F$, thermal $kT$). Split equally into amplitude and phase, the phase-noise floor relative to signal power $P_{sig}$ is $\sim FkT/P_{sig}$; the factor 2 accounts for the single-sideband convention.</p>
        <p><b>Step 2 — resonator (bandpass) shaping.</b> A tank of loaded quality factor $Q_L$ has half-bandwidth $f_0/(2Q_L)$. Phase perturbations <i>inside</i> this bandwidth are integrated by the oscillator's feedback (a $1/f_m$ effect on amplitude of phase, hence $1/f_m^2$ in power). Modeling this gives the multiplicative factor</p>
        $$\left(1+\frac{f_0^2}{(2Q_L f_m)^2}\right),$$
        <p>which is $\approx 1$ far out (flat floor) and $\propto 1/f_m^2$ close in.</p>
        <p><b>Step 3 — flicker up-conversion.</b> Device $1/f$ (flicker) noise below the corner $f_c$ modulates the carrier and, after the resonator integration, becomes a $1/f_m^3$ region. This is the factor $(1+f_c/f_m)$.</p>
        <p><b>Step 4 — combine and express in dBc/Hz.</b> Multiplying the floor by both shaping factors and taking $10\log_{10}$:</p>
        $$\mathcal{L}(f_m)=10\log_{10}\!\left[\frac{2FkT}{P_{sig}}\Big(1+\tfrac{f_0^2}{(2Q_L f_m)^2}\Big)\Big(1+\tfrac{f_c}{f_m}\Big)\right].$$
        <p><b>Result / sanity check.</b> Regions: far out $\to$ flat $2FkT/P_{sig}$ floor; middle $\to$ $-20$ dB/decade ($1/f_m^2$); close in $\to$ $-30$ dB/decade ($1/f_m^3$). Doubling $Q_L$ improves the $1/f_m^2$ region by 6 dB — the strongest design lever.</p>`
      },
      {
        title: 'PLL open-loop gain with the VCO',
        tex: String.raw`$$G(s)=K_{pd}\,F(s)\,\frac{2\pi K_{vco}}{s}\,\frac{1}{N}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A PLL is a feedback loop; its behaviour is governed by the product of the gains around the loop. We assemble that product block by block.</p>
        <p><b>Step 1 — phase detector.</b> The PFD/charge pump outputs a signal proportional to the phase error: gain $K_{pd}$ (V/rad or A/rad).</p>
        <p><b>Step 2 — loop filter.</b> A filter $F(s)$ turns that into the control voltage, shaping loop dynamics (adds a zero for stability, a pole for spur rejection).</p>
        <p><b>Step 3 — VCO.</b> From the earlier derivation, control voltage to phase is $2\pi K_{vco}/s$ — the loop's dominant integrator.</p>
        <p><b>Step 4 — feedback divider.</b> The output phase is divided by $N$ before comparison, contributing $1/N$.</p>
        <p><b>Step 5 — multiply around the loop.</b></p>
        $$G(s)=K_{pd}\,F(s)\,\frac{2\pi K_{vco}}{s}\,\frac{1}{N}.$$
        <p><b>Result.</b> $$G(s)=\frac{2\pi K_{pd}K_{vco}F(s)}{Ns}.$$ Sanity check: the pole at $s=0$ (from the VCO) guarantees a type-II loop when $F(s)$ adds a second integrator, giving zero steady-state phase error and $f_{out}=Nf_{ref}$. Note loop gain scales with $K_{vco}$, so bandwidth drifts with frequency unless $K_{vco}$ is held small.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the VCO tuning law?`, back: String.raw`$f_{out}=f_0+K_{vco}V_{ctrl}$, where $f_0$ is the free-running frequency and $K_{vco}$ (Hz/V) is the tuning sensitivity.` },
      { front: String.raw`Why is a VCO a $1/s$ block in the phase domain?`, back: String.raw`Frequency is the derivative of phase, so phase is the integral of frequency: $\phi=2\pi K_{vco}\int V\,dt \Rightarrow \Phi(s)/V(s)=2\pi K_{vco}/s$.` },
      { front: String.raw`Units of $K_{vco}$?`, back: String.raw`Hz/V (or rad/s/V, which is $2\pi\times$ the Hz/V value).` },
      { front: String.raw`What tunes an LC-VCO?`, back: String.raw`A varactor — a voltage-dependent capacitance $C(V)$ (reverse-biased diode or MOS cap) in the LC tank.` },
      { front: String.raw`What is VCO pushing?`, back: String.raw`Frequency sensitivity to supply voltage (Hz/V); supply ripple then modulates the carrier. Fixed with clean regulation.` },
      { front: String.raw`What is VCO pulling?`, back: String.raw`Frequency shift caused by a change in load impedance (VSWR). Fixed by buffering/isolating the VCO output.` },
      { front: String.raw`What sets the $1/f^2$ region slope in Leeson's model?`, back: String.raw`The resonator term $f_0^2/(2Q_L f_m)^2$; noise improves as $1/Q_L^2$, so higher loaded $Q$ is the strongest lever.` },
      { front: String.raw`What causes the $1/f^3$ close-in region?`, back: String.raw`Up-converted device flicker ($1/f$) noise below the flicker corner $f_c$, integrated by the oscillator.` },
      { front: String.raw`Why do ring oscillators have worse phase noise than LC?`, back: String.raw`Their low resonator $Q$; phase noise scales as $1/Q^2$, so low-$Q$ rings are 20-40 dB worse than high-$Q$ LC tanks.` },
      { front: String.raw`How does a PLL treat VCO vs reference phase noise?`, back: String.raw`It high-pass filters VCO noise (suppressed below loop BW) and low-pass filters reference/divider noise.` },
      { front: String.raw`Why keep $K_{vco}$ small with a switched-cap bank?`, back: String.raw`Small $K_{vco}$ injects less control-line noise and stabilises loop gain; the cap bank restores wide range via coarse sub-bands.` },
      { front: String.raw`Does a basic VCO-PLL give frequency multiplication?`, back: String.raw`Yes: $f_{out}=N f_{ref}$ via the feedback divider — a capability a basic DLL lacks.` },
      { front: String.raw`What is injection locking?`, back: String.raw`A strong nearby tone captures the oscillator, forcing it to the injected frequency instead of its free-running one.` },
      { front: String.raw`What is the flicker corner $f_c$?`, back: String.raw`The offset where the $1/f^3$ flicker-dominated region transitions to the $1/f^2$ region.` }
    ],
    mcqs: [
      { q: String.raw`A VCO has $K_{vco}=50$ MHz/V and $f_0=2.00$ GHz. What is $f_{out}$ at $V_{ctrl}=0.4$ V?`, options: [String.raw`2.005 GHz`, String.raw`2.020 GHz`, String.raw`2.050 GHz`, String.raw`2.200 GHz`], answer: 1, explain: String.raw`$f_{out}=2.00\text{ GHz}+50\text{ MHz/V}\times0.4\text{ V}=2.00+0.020=2.020$ GHz.` },
      { q: String.raw`In the phase domain a VCO behaves as:`, options: [String.raw`A pure gain`, String.raw`A differentiator ($s$)`, String.raw`An integrator ($1/s$)`, String.raw`A second-order low-pass`], answer: 2, explain: String.raw`Phase is the integral of frequency, so $\Phi(s)/V(s)=2\pi K_{vco}/s$ — an integrator.` },
      { q: String.raw`Which change most improves VCO phase noise in the $1/f^2$ region?`, options: [String.raw`Lower the loaded $Q$`, String.raw`Raise the loaded $Q$`, String.raw`Increase $K_{vco}$`, String.raw`Increase the noise figure`], answer: 1, explain: String.raw`Leeson's $1/f^2$ term $\propto 1/Q_L^2$; doubling $Q_L$ improves it by 6 dB.` },
      { q: String.raw`VCO "pushing" refers to sensitivity of frequency to:`, options: [String.raw`Load impedance`, String.raw`Supply voltage`, String.raw`Temperature`, String.raw`Control-line current`], answer: 1, explain: String.raw`Pushing is frequency change per volt of supply (Hz/V); pulling is due to load impedance.` },
      { q: String.raw`Why do wideband ring-oscillator VCOs have poor spectral purity?`, options: [String.raw`Too much $Q$`, String.raw`Low resonator $Q$`, String.raw`No varactor`, String.raw`Excessive $P_{sig}$`], answer: 1, explain: String.raw`Rings have low $Q$; since $\mathcal{L}\propto 1/Q^2$, they are far noisier than high-$Q$ LC oscillators.` },
      { q: String.raw`In a PLL, VCO phase noise is:`, options: [String.raw`Low-pass filtered by the loop`, String.raw`High-pass filtered by the loop`, String.raw`Unaffected by the loop`, String.raw`Notched at the loop bandwidth`], answer: 1, explain: String.raw`The loop suppresses VCO noise below the loop bandwidth (high-pass), while reference noise is low-pass filtered.` },
      { q: String.raw`The $1/f^3$ close-in phase-noise region originates from:`, options: [String.raw`Thermal noise floor`, String.raw`Up-converted flicker (1/f) noise`, String.raw`Load pulling`, String.raw`Divider quantisation`], answer: 1, explain: String.raw`Device $1/f$ noise below $f_c$ is up-converted and integrated, producing the $-30$ dB/decade region.` },
      { q: String.raw`Increasing the tuning range of a VCO typically:`, options: [String.raw`Improves phase noise`, String.raw`Requires larger $K_{vco}$ and hurts phase noise`, String.raw`Has no effect on noise`, String.raw`Removes the varactor`], answer: 1, explain: String.raw`Wider range needs a bigger $dC/dV$ (larger $K_{vco}$), which injects more control-line noise and worsens phase noise.` },
      { q: String.raw`A VCO-based PLL outputs $f_{out}=$`, options: [String.raw`$f_{ref}/N$`, String.raw`$N f_{ref}$`, String.raw`$f_{ref}-N$`, String.raw`$f_{ref}$ only`], answer: 1, explain: String.raw`With a divide-by-$N$ in feedback, locked output is $f_{out}=N f_{ref}$ — enabling frequency multiplication.` },
      { q: String.raw`Load pulling of a VCO is best mitigated by:`, options: [String.raw`Increasing $K_{vco}$`, String.raw`Adding a buffer/isolator at the output`, String.raw`Reducing $Q$`, String.raw`Removing the varactor`], answer: 1, explain: String.raw`A buffer or isolator decouples the VCO tank from load-impedance variations, reducing pulling.` },
      { q: String.raw`A switched-capacitor bank plus small-$K_{vco}$ varactor is used to:`, options: [String.raw`Increase phase noise`, String.raw`Cover wide range while keeping $K_{vco}$ small`, String.raw`Eliminate the loop filter`, String.raw`Provide frequency division`], answer: 1, explain: String.raw`Coarse cap sub-bands give wide range; the small varactor $K_{vco}$ keeps injected noise low and loop gain stable.` },
      { q: String.raw`Converting $K_{vco}=100$ MHz/V to rad/s/V gives:`, options: [String.raw`$100\times10^6$`, String.raw`$2\pi\times100\times10^6$`, String.raw`$100\times10^6/2\pi$`, String.raw`$100\times10^3$`], answer: 1, explain: String.raw`Angular gain is $2\pi K_{vco}=2\pi\times10^8\approx6.28\times10^8$ rad/s/V.` }
    ],
    numericals: [
      { q: String.raw`A VCO has $f_0=1.5$ GHz and $K_{vco}=80$ MHz/V. Find $f_{out}$ at $V_{ctrl}=1.25$ V and the control voltage needed for 1.62 GHz.`, solution: String.raw`<p><b>Formula.</b> The VCO tuning law is $$f_{out}=f_0+K_{vco}V_{ctrl},$$ where $f_0$ is the rest frequency, $K_{vco}$ the tuning sensitivity (Hz/V), and $V_{ctrl}$ the control voltage; inverting gives $V_{ctrl}=(f_{out}-f_0)/K_{vco}$.</p>
<p><b>Substitute.</b> $$f_{out}=1.5\text{ GHz}+(80\text{ MHz/V})(1.25\text{ V}),\qquad V_{ctrl}=\frac{1.62\text{ GHz}-1.5\text{ GHz}}{80\text{ MHz/V}}.$$</p>
<p><b>Compute.</b> $80\times1.25=100$ MHz, so $f_{out}=1.5\text{ GHz}+100\text{ MHz}=1.600$ GHz. For 1.62 GHz the needed shift is $\Delta f=120$ MHz, so $V_{ctrl}=120/80=1.5$ V.</p>
<p><b>Explanation.</b> Frequency moves linearly with control voltage at 80 MHz per volt; the 1.5 V figure is a plausible mid-range tuning voltage, confirming the device covers 1.62 GHz within its range. Doubling $K_{vco}$ would halve the voltage needed but inject more control-line noise.</p>` },
      { q: String.raw`A VCO tunes from 2.0 to 2.4 GHz as $V_{ctrl}$ goes 0 to 5 V (assume linear). Find $K_{vco}$ and the frequency at 3 V.`, solution: String.raw`<p><b>Formula.</b> Assuming linear tuning, the sensitivity is the slope $$K_{vco}=\frac{f_{max}-f_{min}}{V_{max}-V_{min}},\qquad f(V)=f_{min}+K_{vco}(V-V_{min}).$$</p>
<p><b>Substitute.</b> $$K_{vco}=\frac{2.4\text{ GHz}-2.0\text{ GHz}}{5\text{ V}-0\text{ V}},\qquad f(3\text{ V})=2.0\text{ GHz}+K_{vco}\times3.$$</p>
<p><b>Compute.</b> $K_{vco}=400\text{ MHz}/5\text{ V}=80$ MHz/V. At 3 V: $f=2.0\text{ GHz}+80\times3=2.0\text{ GHz}+240\text{ MHz}=2.24$ GHz.</p>
<p><b>Explanation.</b> The full 400 MHz span over 5 V gives an 80 MHz/V slope, and 3 V (60% of the range) lands 60% up the band at 2.24 GHz — the linear-tuning assumption made this a simple interpolation. Real varactor curves are S-shaped, so $K_{vco}$ would vary across the range.</p>` },
      { q: String.raw`An LC-VCO oscillates at 5 GHz with tank $C=1$ pF. The varactor gives $dC/dV=-0.05$ pF/V. Estimate $K_{vco}$.`, solution: String.raw`<p><b>Formula.</b> Differentiating the resonance $f=1/(2\pi\sqrt{LC})$ gives the varactor tuning sensitivity $$K_{vco}=-\frac{f}{2C}\frac{dC}{dV},$$ where $f$ is the oscillation frequency, $C$ the tank capacitance, and $dC/dV$ the varactor slope.</p>
<p><b>Substitute.</b> $$K_{vco}=-\frac{5\times10^{9}}{2\times(1\times10^{-12})}\times(-0.05\times10^{-12}).$$</p>
<p><b>Compute.</b> The prefactor $f/2C=5\times10^{9}/(2\times10^{-12})=2.5\times10^{21}$; multiplying by $-dC/dV=5\times10^{-14}$ gives $K_{vco}=2.5\times10^{21}\times5\times10^{-14}=1.25\times10^{8}$ Hz/V $=125$ MHz/V.</p>
<p><b>Explanation.</b> Because $dC/dV<0$ (capacitance falls with reverse bias), the two minus signs cancel to give a positive $K_{vco}$: frequency rises with voltage. The 125 MHz/V sensitivity is typical for a wideband LC-VCO — large, which buys tuning range at the cost of noise sensitivity.</p>` },
      { q: String.raw`Phase noise at 100 kHz offset is $-100$ dBc/Hz in the $1/f^2$ region. Estimate it at 1 MHz offset.`, solution: String.raw`<p><b>Formula.</b> In the $1/f^2$ region phase noise falls at $-20$ dB per decade of offset: $$\mathcal{L}(f_2)=\mathcal{L}(f_1)-20\log_{10}\!\left(\frac{f_2}{f_1}\right)\ \text{dBc/Hz}.$$</p>
<p><b>Substitute.</b> $$\mathcal{L}(1\text{ MHz})=-100-20\log_{10}\!\left(\frac{1\text{ MHz}}{100\text{ kHz}}\right).$$</p>
<p><b>Compute.</b> The ratio is 10 (one decade), so $20\log_{10}(10)=20$ dB. Thus $\mathcal{L}=-100-20=-120$ dBc/Hz.</p>
<p><b>Explanation.</b> Moving one decade further from the carrier in the $1/f^2$ (integrated-white-noise) region drops phase noise by exactly 20 dB. This slope is the Leeson resonator term; the sanity check is that the number gets more negative (cleaner) further out.</p>` },
      { q: String.raw`A VCO has pushing of 2 MHz/V. A 10 mV supply ripple appears. What frequency deviation results?`, solution: String.raw`<p><b>Formula.</b> Pushing $K_{push}$ is the frequency sensitivity to supply voltage, so the induced deviation is $$\Delta f=K_{push}\,\Delta V_{supply},$$ with $K_{push}$ in Hz/V and $\Delta V_{supply}$ the ripple amplitude.</p>
<p><b>Substitute.</b> $$\Delta f=(2\text{ MHz/V})\times(0.010\text{ V}).$$</p>
<p><b>Compute.</b> $\Delta f=2\times10^{6}\times0.010=2\times10^{4}$ Hz $=20$ kHz peak deviation.</p>
<p><b>Explanation.</b> The supply acts as an unintended second tuning port: 10 mV of ripple frequency-modulates the carrier by 20 kHz, appearing as spurs/FM sidebands at the ripple frequency. This is why VCO supplies get clean regulation — the fix is to shrink $\Delta V_{supply}$ or $K_{push}$.</p>` },
      { q: String.raw`Doubling the loaded $Q$ of an LC tank: by how many dB does the $1/f^2$ phase noise improve?`, solution: String.raw`<p><b>Formula.</b> In Leeson's $1/f^2$ region the phase noise scales inversely with the square of loaded quality factor, $\mathcal{L}\propto 1/Q_L^2$, so the change for a $Q$ ratio is $$\Delta\mathcal{L}=10\log_{10}\!\left(\frac{Q_{L,1}^2}{Q_{L,2}^2}\right)=20\log_{10}\!\left(\frac{Q_{L,1}}{Q_{L,2}}\right).$$</p>
<p><b>Substitute.</b> Doubling $Q_L$ means $Q_{L,2}=2Q_{L,1}$: $$\Delta\mathcal{L}=10\log_{10}\!\left(\frac{1}{2^2}\right).$$</p>
<p><b>Compute.</b> $10\log_{10}(1/4)=10\times(-0.602)=-6.02$ dB — a 6 dB improvement.</p>
<p><b>Explanation.</b> Loaded $Q$ is the strongest phase-noise lever: every doubling buys 6 dB. This is exactly why high-$Q$ LC tanks beat low-$Q$ ring oscillators by 20-40 dB, and why designers fight to raise resonator $Q$.</p>` },
      { q: String.raw`A PLL uses $K_{vco}=50$ MHz/V, $K_{pd}=0.2$ V/rad, $N=100$, and a filter with DC gain 1. Find the DC open-loop gain magnitude coefficient (excluding $1/s$).`, solution: String.raw`<p><b>Formula.</b> The PLL open-loop gain with a VCO is $G(s)=K_{pd}F(s)\,(2\pi K_{vco}/s)\,(1/N)$; stripping the $1/s$ and taking $F(0)=1$ leaves the coefficient $$K=\frac{2\pi K_{pd}K_{vco}}{N},$$ with $K_{pd}$ in V/rad, $K_{vco}$ in Hz/V (the $2\pi$ converts to rad/s/V), and $N$ the divide ratio.</p>
<p><b>Substitute.</b> $$K=\frac{2\pi\,(0.2)\,(50\times10^{6})}{100}.$$</p>
<p><b>Compute.</b> Numerator $2\pi\times0.2\times50\times10^{6}=2\pi\times10^{7}$; dividing by 100 gives $K=2\pi\times10^{5}\approx6.28\times10^{5}$ rad/s.</p>
<p><b>Explanation.</b> This coefficient sets the loop's unity-gain crossover and hence its bandwidth scale (~628 krad/s, or ~100 kHz). Note the $1/N$ factor: increasing the divider lowers loop gain, which is why synthesizer bandwidth falls as $1/\sqrt N$ once the second-order dynamics are worked out.</p>` }
    ],
    realWorld: String.raw`<p>Every wireless transceiver, GPS receiver, radar and SDR front-end contains at least one VCO inside its frequency synthesizer. In an <a href="#ad9361">AD9361</a>-class RFIC the on-chip LC-VCOs are locked in fractional-N PLLs to generate the LO for I/Q up/down-conversion; their phase noise directly limits the receiver's reciprocal-mixing floor and the EVM of high-order QAM. Radar and comms systems specify VCO phase noise carefully because close-in noise sets Doppler resolution and adjacent-channel leakage. In practice designers fight the classic trade — wide tuning range (needs large $K_{vco}$) versus spectral purity (wants small $K_{vco}$) — with switched-capacitor coarse banks, and they isolate the VCO with buffers to kill load pulling from the PA. The digital counterpart, the <a href="#nco">NCO/DDS</a>, replaces the analog VCO in fully digital PLLs and in the numerically controlled derotators used for <a href="#cfo">CFO</a> correction.</p>`,
    related: ['pll', 'nco', 'phase-noise', 'fll', 'costas-loop']
  },
  {
    id: 'nco',
    title: 'Numerically-Controlled Oscillator (NCO)',
    category: 'Synchronization',
    tags: ['DDS', 'phase accumulator', 'LUT', 'SFDR', 'CORDIC', 'digital PLL'],
    summary: String.raw`An NCO synthesises a sinusoid entirely in the digital domain by accumulating phase from a frequency control word and mapping accumulated phase to amplitude, forming the core of direct digital synthesis (DDS) and the digital equivalent of a VCO.`,
    diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-nco" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="10" y="62" fill="#e6edf3">FCW</text>
        <line x1="46" y1="58" x2="86" y2="58" stroke="#9aa7b5" marker-end="url(#arr-nco)"/>
        <rect x="88" y="34" width="132" height="52" rx="6" fill="#1c232e" stroke="#4dabf7"/>
        <text x="154" y="55" fill="#e6edf3" text-anchor="middle">phase accum.</text>
        <text x="154" y="73" fill="#9aa7b5" text-anchor="middle">N-bit, + each clk</text>
        <line x1="220" y1="58" x2="262" y2="58" stroke="#9aa7b5" marker-end="url(#arr-nco)"/>
        <text x="241" y="50" fill="#ffa94d" text-anchor="middle">θ</text>
        <rect x="264" y="34" width="120" height="52" rx="6" fill="#1c232e" stroke="#63e6be"/>
        <text x="324" y="55" fill="#e6edf3" text-anchor="middle">sine LUT</text>
        <text x="324" y="73" fill="#9aa7b5" text-anchor="middle">phase→ampl</text>
        <line x1="384" y1="58" x2="426" y2="58" stroke="#9aa7b5" marker-end="url(#arr-nco)"/>
        <rect x="428" y="34" width="100" height="52" rx="6" fill="#1c232e" stroke="#b197fc"/>
        <text x="478" y="55" fill="#e6edf3" text-anchor="middle">DAC</text>
        <text x="478" y="73" fill="#9aa7b5" text-anchor="middle">samples→out</text>
        <text x="180" y="118" fill="#9aa7b5">clock f<tspan baseline-shift="sub" font-size="9">clk</tspan></text>
        <line x1="175" y1="112" x2="154" y2="90" stroke="#9aa7b5" marker-end="url(#arr-nco)"/>
        <text x="270" y="150" fill="#ffa94d" text-anchor="middle">f<tspan baseline-shift="sub" font-size="9">out</tspan> = FCW·f<tspan baseline-shift="sub" font-size="9">clk</tspan>/2<tspan baseline-shift="super" font-size="9">N</tspan>   ·   Δf = f<tspan baseline-shift="sub" font-size="9">clk</tspan>/2<tspan baseline-shift="super" font-size="9">N</tspan></text>
      </svg>`,
      caption: String.raw`FCW drives an N-bit phase accumulator (discrete integrator) → sine LUT → DAC; f_out = FCW·f_clk/2^N with resolution f_clk/2^N.`
    },
    {
      title: String.raw`Complete DDS chain with spur sources annotated`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">
        <defs><marker id="arr2-nco" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Full DDS: accumulator → truncate → LUT → DAC → reconstruction LPF</text>
        <text x="8" y="70" fill="#e6edf3">FCW</text>
        <line x1="40" y1="66" x2="60" y2="66" stroke="#9aa7b5" marker-end="url(#arr2-nco)"/>
        <rect x="60" y="48" width="86" height="38" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="103" y="66" fill="#e6edf3" text-anchor="middle">accum</text><text x="103" y="80" fill="#9aa7b5" font-size="8" text-anchor="middle">N bits</text>
        <rect x="162" y="48" width="76" height="38" rx="6" fill="#1c232e" stroke="#ff6b6b"/><text x="200" y="63" fill="#e6edf3" text-anchor="middle">truncate</text><text x="200" y="78" fill="#9aa7b5" font-size="8" text-anchor="middle">keep W bits</text>
        <rect x="254" y="48" width="70" height="38" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="289" y="66" fill="#e6edf3" text-anchor="middle">sin LUT</text><text x="289" y="80" fill="#9aa7b5" font-size="8" text-anchor="middle">B-bit ampl</text>
        <rect x="340" y="48" width="60" height="38" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="370" y="70" fill="#e6edf3" text-anchor="middle">DAC</text>
        <rect x="416" y="48" width="86" height="38" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="459" y="63" fill="#e6edf3" text-anchor="middle">recon LPF</text><text x="459" y="78" fill="#9aa7b5" font-size="8" text-anchor="middle">anti-image</text>
        <line x1="146" y1="67" x2="162" y2="67" stroke="#9aa7b5" marker-end="url(#arr2-nco)"/>
        <line x1="238" y1="67" x2="254" y2="67" stroke="#9aa7b5" marker-end="url(#arr2-nco)"/>
        <line x1="324" y1="67" x2="340" y2="67" stroke="#9aa7b5" marker-end="url(#arr2-nco)"/>
        <line x1="400" y1="67" x2="416" y2="67" stroke="#9aa7b5" marker-end="url(#arr2-nco)"/>
        <line x1="502" y1="67" x2="524" y2="67" stroke="#9aa7b5" marker-end="url(#arr2-nco)"/><text x="514" y="60" fill="#63e6be" font-size="10">out</text>
        <text x="200" y="120" fill="#ff6b6b" font-size="9" text-anchor="middle">phase-truncation spurs</text><text x="200" y="132" fill="#9aa7b5" font-size="9" text-anchor="middle">SFDR≈6.02W dBc</text>
        <line x1="200" y1="112" x2="200" y2="88" stroke="#ff6b6b" stroke-dasharray="3 3"/>
        <text x="289" y="150" fill="#ff6b6b" font-size="9" text-anchor="middle">amplitude quantisation</text><text x="289" y="162" fill="#9aa7b5" font-size="9" text-anchor="middle">SQNR≈6.02B+1.76 dB</text>
        <line x1="289" y1="142" x2="289" y2="88" stroke="#ff6b6b" stroke-dasharray="3 3"/>
        <text x="459" y="120" fill="#ff6b6b" font-size="9" text-anchor="middle">DAC INL/DNL,</text><text x="459" y="132" fill="#9aa7b5" font-size="9" text-anchor="middle">sinc roll-off + images</text>
        <line x1="459" y1="112" x2="459" y2="88" stroke="#ff6b6b" stroke-dasharray="3 3"/>
        <text x="270" y="192" fill="#b197fc" font-size="10" text-anchor="middle">resolution set by N (accumulator) ; purity set by W, B, and DAC</text>
      </svg>`,
      caption: String.raw`Full direct-digital-synthesis chain with each purity limit called out: phase truncation to W bits sets SFDR≈6.02W dBc, amplitude quantisation to B bits sets SQNR≈6.02B+1.76 dB, and the DAC's INL/DNL plus sinc roll-off and Nyquist images require the reconstruction low-pass. Resolution depends only on the accumulator width N.`
    },
    {
      title: String.raw`Quadrature NCO (simultaneous sin and cos for I/Q)`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-nco" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Quadrature NCO: one accumulator, two LUTs</text>
        <text x="10" y="100" fill="#e6edf3">FCW</text>
        <line x1="46" y1="96" x2="70" y2="96" stroke="#9aa7b5" marker-end="url(#arr3-nco)"/>
        <rect x="72" y="76" width="126" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="135" y="94" fill="#e6edf3" text-anchor="middle">phase accum.</text><text x="135" y="109" fill="#9aa7b5" font-size="9" text-anchor="middle">θ[k], N-bit</text>
        <rect x="250" y="42" width="120" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="310" y="60" fill="#e6edf3" text-anchor="middle">cos LUT</text><text x="310" y="75" fill="#9aa7b5" font-size="9" text-anchor="middle">→ I(k)</text>
        <rect x="250" y="112" width="120" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="310" y="130" fill="#e6edf3" text-anchor="middle">sin LUT</text><text x="310" y="145" fill="#9aa7b5" font-size="9" text-anchor="middle">→ Q(k)</text>
        <line x1="198" y1="90" x2="250" y2="62" stroke="#9aa7b5" marker-end="url(#arr3-nco)"/>
        <line x1="198" y1="102" x2="250" y2="132" stroke="#9aa7b5" marker-end="url(#arr3-nco)"/>
        <line x1="370" y1="62" x2="470" y2="62" stroke="#63e6be" marker-end="url(#arr3-nco)"/><text x="430" y="55" fill="#63e6be" font-size="11">I = cos θ</text>
        <line x1="370" y1="132" x2="470" y2="132" stroke="#ffa94d" marker-end="url(#arr3-nco)"/><text x="430" y="125" fill="#ffa94d" font-size="11">Q = sin θ</text>
        <text x="270" y="185" fill="#b197fc" font-size="11" text-anchor="middle">complex LO  e^{jθ} = cos θ + j sin θ  for DDC/DUC mixers and derotators</text>
      </svg>`,
      caption: String.raw`A quadrature NCO shares one phase accumulator between a cos LUT and a sin LUT (often via quarter-wave symmetry), emitting I=cos θ and Q=sin θ together. This forms the complex LO e^{jθ} used by digital up/down-converter mixers and the CFO derotator.`
    }
    ],
    prerequisites: ['nyquist-sampling', 'vco', 'dac'],
    intro: String.raw`<p><b>Why does the NCO exist?</b> Analog VCOs drift, are hard to make exactly linear, cannot switch frequency instantly without a settling transient, and are not bit-for-bit repeatable — all fatal in a modern software-defined radio that must hop, chirp, and derotate with numerical precision. The NCO exists to give a fully digital system a frequency/phase source with none of those flaws: perfectly linear tuning, sub-hertz resolution, instantaneous phase-continuous frequency changes, and exact repeatability. It is what lets a digital receiver generate its own local oscillator, correct carrier offsets, and track timing entirely in logic — replacing the analog VCO wherever the signal path is already digital.</p>
<p>A <b>Numerically-Controlled Oscillator (NCO)</b> is the digital counterpart of the analog <a href="#vco">VCO</a>. Instead of a voltage tuning an analog tank, an integer <b>frequency control word (FCW)</b> is repeatedly added to an $N$-bit <b>phase accumulator</b> on every clock; the accumulator's value is a linearly ramping phase, and a <b>phase-to-amplitude converter</b> (a LUT or a CORDIC engine) turns that phase into sample values of $\cos$ and $\sin$. Followed by a DAC this becomes <b>Direct Digital Synthesis (DDS)</b>. The NCO's beauty is exactness: output frequency $f_{out}=\text{FCW}\cdot f_{clk}/2^N$ is perfectly linear in FCW, frequency resolution is $f_{clk}/2^N$ (sub-milli-hertz is routine), and phase/frequency can be changed instantaneously and continuously. Its limitations are equally characteristic: it cannot exceed Nyquist ($f_{out}<f_{clk}/2$), and <b>phase truncation</b> and finite amplitude quantisation create <b>spurious tones</b> that bound the spurious-free dynamic range (SFDR).</p>`,
    sections: [
      {
        h: 'Architecture: accumulator + phase-to-amplitude map',
        html: String.raw`<p>An NCO has two stages:</p>
        <ul>
          <li><b>Phase accumulator:</b> an $N$-bit register that on every clock adds the frequency control word: $\theta[k]=(\theta[k-1]+\text{FCW})\bmod 2^N$. The accumulator overflows (wraps) periodically — each wrap is one full cycle of the output, since $2^N$ counts represent $2\pi$ radians.</li>
          <li><b>Phase-to-amplitude converter:</b> maps the (top bits of the) accumulator to $\sin/\cos$. Classically a <b>ROM lookup table (LUT)</b>; alternatively a <b>CORDIC</b> rotator or a Taylor/polynomial approximation to save memory.</li>
        </ul>
        <p>The linearly increasing phase is exactly a discrete-time ramp; wrapping it modulo $2^N$ is exactly taking phase modulo $2\pi$. Thus the accumulator <i>is</i> a discrete-time integrator — the digital analogue of the VCO's $1/s$. A frequency control word is a constant "control voltage"; a time-varying FCW performs FM/chirp; adding an offset to the accumulator output performs phase modulation.</p>
        <div class="callout"><b>Mapping to the VCO:</b> FCW $\leftrightarrow$ $V_{ctrl}$; accumulator $\leftrightarrow$ the $1/s$ phase integrator; LUT $\leftrightarrow$ the resonator that turns phase into a waveform. The NCO is the VCO made digital and perfectly linear.</div>`
      },
      {
        h: 'Output frequency and the tuning equation',
        html: String.raw`<p>Each clock adds FCW to a modulo-$2^N$ accumulator. The accumulator completes one full turn ($2^N$ counts $=$ one output cycle) after $2^N/\text{FCW}$ clock ticks. Since each tick lasts $1/f_{clk}$, the output period is $T_{out}=(2^N/\text{FCW})/f_{clk}$, giving the fundamental DDS equation</p>
        <p>$$f_{out}=\frac{\text{FCW}\cdot f_{clk}}{2^N}.$$</p>
        <p>Consequences:</p>
        <ul>
          <li><b>Frequency resolution</b> (the smallest step, FCW $=1$): $$\Delta f=\frac{f_{clk}}{2^N}.$$ With $f_{clk}=100$ MHz and $N=32$, $\Delta f=100\times10^6/2^{32}\approx 0.0233$ Hz — extraordinarily fine.</li>
          <li><b>Maximum output</b>: FCW must stay below $2^{N-1}$ so $f_{out}<f_{clk}/2$ (Nyquist). In practice one keeps well below Nyquist so the reconstruction filter can remove images.</li>
          <li><b>Exact linearity</b>: $f_{out}$ is a perfectly linear function of the integer FCW — unlike the S-shaped $K_{vco}(V)$ of an analog VCO.</li>
        </ul>`
      },
      {
        h: 'Phase truncation and spurious tones (SFDR)',
        html: String.raw`<p>A full $N$-bit LUT would need $2^N$ entries — impossible for $N=32$. In practice only the top $W$ phase bits address the LUT; the lower $N-W$ bits are <b>truncated</b>. This truncation is a periodic error that folds back as discrete <b>spurious tones</b> ("spurs"), not white noise.</p>
        <p>The worst-case spur level from phase truncation is bounded by</p>
        <p>$$\text{SFDR}\approx 6.02\,W\ \text{dBc},$$</p>
        <p>i.e. roughly 6 dB of spur suppression per phase bit sent to the LUT. So $W=12$ bits gives $\approx 72$ dBc, $W=16$ gives $\approx 96$ dBc. Two more error sources:</p>
        <ul>
          <li><b>Amplitude/LUT quantisation:</b> finite output word length adds quantisation error (SQNR $\approx 6.02 B + 1.76$ dB for $B$ amplitude bits).</li>
          <li><b>DAC nonlinearity and images:</b> the DAC's INL/DNL and the $\text{sinc}$ roll-off plus Nyquist images require an analog reconstruction (anti-image) filter.</li>
        </ul>
        <p><b>Spur mitigation:</b> <i>phase dithering</i> (adding a small random sequence to the truncated bits) trades discrete spurs for a raised noise floor — cleaner-looking spectrum; larger LUTs (bigger $W$) or CORDIC push spurs down directly.</p>`
      },
      {
        h: 'LUT vs CORDIC vs Taylor: computing the sine',
        html: String.raw`<p>Three ways to convert phase to amplitude, trading memory for logic:</p>
        <table class="data">
          <tr><th>Method</th><th>Cost</th><th>Notes</th></tr>
          <tr><td>Full ROM LUT</td><td>$2^W$ words of memory</td><td>Fastest, simplest; memory explodes with $W$. Use quarter-wave symmetry to cut ROM by 4x.</td></tr>
          <tr><td>CORDIC</td><td>Shift-add per iteration, no multiplier</td><td>Iterative vector rotation; each stage adds ~1 bit of accuracy. Great for FPGAs; deterministic latency.</td></tr>
          <tr><td>Taylor / polynomial</td><td>Small LUT + multiplier(s)</td><td>Coarse LUT plus a low-order correction; balances memory and DSP resources.</td></tr>
        </table>
        <p><b>Quarter-wave trick:</b> a sine is symmetric, so storing only 0 to $\pi/2$ and using the top two phase bits to fold/negate reduces the LUT by a factor of 4 with no loss of accuracy. <b>CORDIC</b> (COordinate Rotation DIgital Computer) rotates a unit vector through the target angle using only shifts and adds, emitting $\cos$ and $\sin$ simultaneously — ideal when memory is scarce or when many independent NCOs are needed.</p>`
      },
      {
        h: 'NCO vs VCO: the digital equivalence',
        html: String.raw`<p>The NCO is the digital sibling of the VCO. Both are frequency-controlled phase sources; the differences are all consequences of digital vs analog implementation.</p>
        <table class="data">
          <tr><th>Property</th><th>VCO (analog)</th><th>NCO (digital)</th></tr>
          <tr><td>Control</td><td>Voltage $V_{ctrl}$ (continuous)</td><td>Frequency control word (integer)</td></tr>
          <tr><td>Tuning law</td><td>$f=f_0+K_{vco}V$ (nonlinear)</td><td>$f=\text{FCW}\,f_{clk}/2^N$ (exactly linear)</td></tr>
          <tr><td>Phase element</td><td>$1/s$ analog integrator</td><td>Modulo-$2^N$ accumulator (discrete integrator)</td></tr>
          <tr><td>Resolution</td><td>Continuous</td><td>$f_{clk}/2^N$ (very fine, but discrete)</td></tr>
          <tr><td>Purity limited by</td><td>Thermal/flicker phase noise (Leeson)</td><td>Truncation spurs + quantisation (SFDR)</td></tr>
          <tr><td>Max frequency</td><td>Tens of GHz directly</td><td>$< f_{clk}/2$ (Nyquist)</td></tr>
          <tr><td>Switching speed</td><td>Loop settling time</td><td>Instantaneous, phase-continuous</td></tr>
          <tr><td>Repeatability</td><td>Drifts with temp/supply</td><td>Exact, deterministic</td></tr>
        </table>
        <p>Because the NCO is deterministic and phase-continuous, it is preferred wherever fast, repeatable, hop-free frequency and phase agility matter — frequency hopping, chirp generation, and the derotators used for carrier/timing recovery.</p>`
      },
      {
        h: 'Where NCOs live: digital PLLs, DDC/DUC, recovery loops',
        html: String.raw`<p>NCOs are ubiquitous in modern SDR:</p>
        <ul>
          <li><b>Digital PLL (ADPLL):</b> the NCO replaces the analog VCO; a digital loop filter drives the FCW. Common in RFSoC and SoC clocking.</li>
          <li><b>Digital down/up-conversion (DDC/DUC):</b> an NCO generates the complex LO $e^{-j2\pi f_{LO}t}$ that a digital mixer multiplies with the signal to shift it to/from baseband. This is the heart of a channeliser.</li>
          <li><b>Carrier recovery / CFO correction:</b> a <a href="#costas-loop">Costas</a> or <a href="#fll">FLL</a> loop estimates the offset and steers an NCO-based derotator to null the <a href="#cfo">carrier frequency offset</a>.</li>
          <li><b>Timing recovery:</b> an NCO acts as the interpolation-control/timing accumulator that positions the sampling phase (as in a Gardner or early-late loop).</li>
        </ul>
        <p>In all these the NCO provides a numerically exact, agile phase/frequency reference — the reason fully digital receivers can lock, hop and track with bit-exact repeatability.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>After this topic you should be able to explain:</p>
<ul>
<li><b>The two-block architecture:</b> a phase accumulator (a discrete-time integrator, the digital analogue of the VCO's $1/s$) followed by a phase-to-amplitude converter (LUT/CORDIC), with FCW playing the role of the control voltage.</li>
<li><b>The tuning equations:</b> $f_{out}=\text{FCW}\cdot f_{clk}/2^N$ with resolution $\Delta f=f_{clk}/2^N$ set by $N$ alone — exactly linear and bounded below Nyquist ($f_{out}<f_{clk}/2$).</li>
<li><b>Purity limits, decoupled from resolution:</b> phase truncation to $W$ bits gives discrete spurs (SFDR $\approx6.02W$ dBc), amplitude quantisation to $B$ bits gives SQNR $\approx6.02B+1.76$ dB, and DAC/image effects need a reconstruction filter.</li>
<li><b>Spur mitigation and sine computation:</b> phase dithering trades spurs for noise; quarter-wave symmetry and CORDIC reduce memory/logic cost.</li>
<li><b>Why the NCO beats the VCO for agility:</b> exact linearity, sub-Hz resolution, instantaneous phase-continuous switching, and perfect repeatability — making it the LO in DDC/DUC, the derotator for CFO, and the oscillator in digital PLLs.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Direct_digital_synthesis" target="_blank" rel="noopener">Wikipedia — Direct digital synthesis</a> — canonical overview of the NCO/DAC/reference architecture, truncation spurs, Nyquist images, and why DDS phase noise beats a PLL close-in.</li>
<li><a href="https://www.digikey.com/en/articles/basics-of-direct-digital-synthesis" target="_blank" rel="noopener">DigiKey — Basics of Direct Digital Synthesis</a> — clear applications-engineering walkthrough of the phase accumulator, phase-to-amplitude LUT, DAC, SFDR figures, and reconstruction filtering.</li>
<li><a href="https://john-gentile.com/kb/dsp/NCO_DDS.html" target="_blank" rel="noopener">John Gentile DSP KB — NCO / DDS</a> — in-depth notes deriving SFDR ($6.02P$) and quantization SQNR ($6.02M+1.76$ dB), plus quarter-wave LUT, phase dithering, and Taylor-series spur correction with Python.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`An NCO = phase accumulator (discrete integrator) + phase-to-amplitude converter (LUT/CORDIC); it is the digital VCO.`,
      String.raw`Output frequency: $f_{out}=\text{FCW}\cdot f_{clk}/2^N$ — exactly linear in the integer control word FCW.`,
      String.raw`Frequency resolution is $\Delta f=f_{clk}/2^N$; with a 32-bit accumulator this is sub-Hz for MHz clocks.`,
      String.raw`Output is bounded by Nyquist: $f_{out}<f_{clk}/2$, and images require an analog reconstruction filter after the DAC (DDS).`,
      String.raw`Using only the top $W$ phase bits truncates phase, producing discrete spurs; worst-case SFDR $\approx 6.02\,W$ dBc.`,
      String.raw`Amplitude quantisation to $B$ bits gives SQNR $\approx 6.02B+1.76$ dB; DAC INL/DNL and sinc roll-off also degrade purity.`,
      String.raw`Phase dithering trades discrete spurs for a raised noise floor; quarter-wave symmetry cuts the LUT by 4x.`,
      String.raw`CORDIC computes sin/cos with shifts and adds (no multiplier), ~1 bit accuracy per stage — memory-free alternative to a LUT.`,
      String.raw`NCO advantages over VCO: exact linearity, sub-Hz resolution, instantaneous phase-continuous switching, perfect repeatability.`,
      String.raw`NCOs are the LO source in DDC/DUC, the derotator in CFO correction, the oscillator in digital PLLs, and the timing accumulator in symbol synchronisers.`
    ],
    equations: [
      {
        title: 'DDS output-frequency equation',
        tex: String.raw`$$f_{out}=\frac{\text{FCW}\cdot f_{clk}}{2^N}$$`,
        derivation: String.raw`<p><b>Where we start.</b> An $N$-bit accumulator represents phase on a wheel of $2^N$ counts, where one full turn ($2^N$ counts) equals one output cycle ($2\pi$ radians). Each clock adds the constant FCW.</p>
        <p><b>Step 1 — count clocks per output cycle.</b> Starting from 0 and adding FCW each tick, the accumulator reaches $2^N$ (one wrap) after</p>
        $$M=\frac{2^N}{\text{FCW}}\ \text{clock ticks.}$$
        <p><b>Step 2 — convert ticks to time.</b> Each tick lasts $T_{clk}=1/f_{clk}$, so one output period is</p>
        $$T_{out}=M\,T_{clk}=\frac{2^N}{\text{FCW}}\cdot\frac{1}{f_{clk}}.$$
        <p><b>Step 3 — invert for frequency.</b></p>
        $$f_{out}=\frac{1}{T_{out}}=\frac{\text{FCW}\cdot f_{clk}}{2^N}.$$
        <p><b>Result.</b> $$f_{out}=\frac{\text{FCW}\cdot f_{clk}}{2^N}.$$ Sanity check: FCW $=1$ gives the smallest step $f_{clk}/2^N$; FCW $=2^{N-1}$ gives $f_{clk}/2$ (Nyquist), the theoretical ceiling.</p>`
      },
      {
        title: 'Frequency resolution',
        tex: String.raw`$$\Delta f=\frac{f_{clk}}{2^N}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The frequency control word is an <i>integer</i>. The finest tuning step is therefore the change caused by incrementing FCW by 1.</p>
        <p><b>Step 1 — differentiate the DDS equation w.r.t. FCW.</b> From $f_{out}=\text{FCW}\,f_{clk}/2^N$, the change per unit FCW is</p>
        $$\frac{\partial f_{out}}{\partial\,\text{FCW}}=\frac{f_{clk}}{2^N}.$$
        <p><b>Step 2 — integer step.</b> Since $\Delta(\text{FCW})=1$ is the smallest possible change,</p>
        $$\Delta f=\frac{f_{clk}}{2^N}.$$
        <p><b>Result.</b> $$\Delta f=\frac{f_{clk}}{2^N}.$$ Sanity check: doubling accumulator width $N$ halves the step exponentially; e.g. $f_{clk}=100$ MHz, $N=32 \Rightarrow \Delta f\approx0.023$ Hz. Resolution is set by $N$ alone (independent of the LUT width $W$, which affects purity, not resolution).</p>`
      },
      {
        title: 'Phase-truncation SFDR bound',
        tex: String.raw`$$\text{SFDR}\approx 6.02\,W\ \text{dBc}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The accumulator has $N$ bits but the LUT is addressed by only the top $W$ bits. The discarded $N-W$ bits are a deterministic, periodic phase error that generates spurious lines.</p>
        <p><b>Step 1 — size the phase error.</b> Truncating to $W$ bits leaves a maximum phase error of one LSB of the retained word, i.e. a fraction $2^{-W}$ of a full cycle. This small periodic error phase-modulates the ideal sinusoid.</p>
        <p><b>Step 2 — spur amplitude from a small phase error.</b> A peak phase deviation $\Delta\phi$ produces first-order sidebands of relative amplitude $\approx \Delta\phi/2$. With $\Delta\phi\approx 2\pi\,2^{-W}$, the worst spur sits roughly $2^{-W}$ of the carrier in amplitude (the $2\pi$ and $1/2$ factors and the specific FCW set the exact constant, giving the well-known $\approx6.02W$ rule rather than $6.02W+$const).</p>
        <p><b>Step 3 — convert to dBc.</b> A factor $2^{-W}$ in amplitude is</p>
        $$20\log_{10}(2^{-W})=-W\cdot20\log_{10}2=-6.02\,W\ \text{dBc}.$$
        <p><b>Result.</b> $$\text{SFDR}\approx 6.02\,W\ \text{dBc}.$$ Sanity check: each extra phase bit into the LUT buys ~6 dB of spur suppression, so $W=12\to\approx72$ dBc, $W=16\to\approx96$ dBc. Resolution ($N$) and purity ($W$) are decoupled — you get fine tuning from $N$ and clean spectrum from $W$.</p>`
      },
      {
        title: 'Phase-accumulator recurrence (discrete integrator)',
        tex: String.raw`$$\theta[k]=\big(\theta[k-1]+\text{FCW}\big)\bmod 2^N$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want the digital equivalent of the VCO relation "phase = integral of frequency." In discrete time integration becomes accumulation.</p>
        <p><b>Step 1 — instantaneous phase increment.</b> Over one clock period the phase advances by $2\pi f_{out}T_{clk}$. Scaling a full cycle to $2^N$ counts, that increment in counts is exactly FCW $=2^N f_{out}/f_{clk}$ (rearranging the DDS equation).</p>
        <p><b>Step 2 — accumulate.</b> Total phase is the running sum of increments:</p>
        $$\theta[k]=\sum_{i=1}^{k}\text{FCW}=\theta[k-1]+\text{FCW}.$$
        <p><b>Step 3 — wrap to the phase wheel.</b> Phase is only meaningful modulo one cycle, and the finite $N$-bit register naturally overflows, so</p>
        $$\theta[k]=\big(\theta[k-1]+\text{FCW}\big)\bmod 2^N.$$
        <p><b>Result.</b> $$\theta[k]=\big(\theta[k-1]+\text{FCW}\big)\bmod 2^N.$$ Sanity check: this is a discrete-time integrator (transfer function $1/(1-z^{-1})$), the exact digital analogue of the VCO's continuous $1/s$. The register overflow implements the $2\pi$ phase wrap for free.</p>`
      },
      {
        title: 'Amplitude SQNR of the digital sinusoid',
        tex: String.raw`$$\text{SQNR}\approx 6.02\,B+1.76\ \text{dB}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Beyond phase truncation, the LUT/DAC output amplitude is quantised to $B$ bits. We estimate the noise floor from this rounding.</p>
        <p><b>Step 1 — quantisation step and noise power.</b> For a full-scale range $\Delta_{FS}$ with $B$ bits, the LSB is $q=\Delta_{FS}/2^{B}$. Uniform quantisation error has variance $\sigma_q^2=q^2/12$.</p>
        <p><b>Step 2 — signal power of a full-scale sinusoid.</b> A sine of amplitude $A=\Delta_{FS}/2$ has power $A^2/2=\Delta_{FS}^2/8$.</p>
        <p><b>Step 3 — form the SQNR ratio.</b></p>
        $$\text{SQNR}=\frac{\Delta_{FS}^2/8}{q^2/12}=\frac{\Delta_{FS}^2/8}{(\Delta_{FS}/2^B)^2/12}=\frac{12}{8}\,2^{2B}=\frac{3}{2}2^{2B}.$$
        <p><b>Step 4 — express in dB.</b></p>
        $$10\log_{10}\!\Big(\tfrac{3}{2}2^{2B}\Big)=20B\log_{10}2+10\log_{10}1.5=6.02\,B+1.76\ \text{dB}.$$
        <p><b>Result.</b> $$\text{SQNR}\approx 6.02\,B+1.76\ \text{dB}.$$ Sanity check: identical to the ADC/DAC rule — each amplitude bit adds ~6 dB. Total NCO purity is limited by the worse of phase-truncation SFDR and this amplitude SQNR (plus DAC nonlinearity).</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What two blocks form an NCO?`, back: String.raw`A phase accumulator (adds FCW every clock, modulo $2^N$) and a phase-to-amplitude converter (LUT or CORDIC).` },
      { front: String.raw`Give the NCO/DDS output-frequency formula.`, back: String.raw`$f_{out}=\text{FCW}\cdot f_{clk}/2^N$.` },
      { front: String.raw`What is the NCO frequency resolution?`, back: String.raw`$\Delta f=f_{clk}/2^N$ — set by the accumulator width $N$ (FCW step of 1).` },
      { front: String.raw`What is the maximum NCO output frequency?`, back: String.raw`Below Nyquist: $f_{out}<f_{clk}/2$ (FCW $<2^{N-1}$); practically lower to allow image filtering.` },
      { front: String.raw`What causes NCO spurious tones?`, back: String.raw`Phase truncation — addressing the LUT with only the top $W$ phase bits produces periodic phase error that folds into discrete spurs.` },
      { front: String.raw`State the phase-truncation SFDR rule.`, back: String.raw`SFDR $\approx 6.02\,W$ dBc, where $W$ is the number of phase bits driving the LUT (~6 dB per bit).` },
      { front: String.raw`How does the NCO relate to the VCO?`, back: String.raw`It is the digital VCO: FCW $\leftrightarrow V_{ctrl}$, accumulator $\leftrightarrow$ the $1/s$ integrator; but exactly linear and perfectly repeatable.` },
      { front: String.raw`What is phase dithering?`, back: String.raw`Adding a small random sequence to the truncated phase bits to break up discrete spurs, trading them for a slightly higher noise floor.` },
      { front: String.raw`What is the quarter-wave symmetry trick?`, back: String.raw`Store only 0 to $\pi/2$ of the sine and use the top two phase bits to fold/negate, shrinking the LUT by 4x with no accuracy loss.` },
      { front: String.raw`What is CORDIC used for in an NCO?`, back: String.raw`Computing sin/cos via iterative shift-add vector rotations — no LUT or multiplier; ~1 bit accuracy per iteration.` },
      { front: String.raw`Where is an NCO used in a DDC?`, back: String.raw`It generates the complex LO $e^{-j2\pi f_{LO}t}$ that a digital mixer multiplies with the signal to shift it to baseband.` },
      { front: String.raw`What is DDS?`, back: String.raw`Direct Digital Synthesis: an NCO followed by a DAC and reconstruction filter to produce an analog waveform.` },
      { front: String.raw`How does an NCO switch frequency?`, back: String.raw`Instantaneously and phase-continuously by changing FCW — no loop settling, unlike an analog PLL.` },
      { front: String.raw`Does increasing $W$ improve frequency resolution?`, back: String.raw`No — resolution depends on $N$. Increasing $W$ improves spectral purity (SFDR), not tuning resolution.` }
    ],
    mcqs: [
      { q: String.raw`An NCO has $N=32$, $f_{clk}=100$ MHz. What FCW gives $f_{out}=10$ MHz?`, options: [String.raw`$\approx 4.29\times10^7$`, String.raw`$\approx 4.29\times10^8$`, String.raw`$10^7$`, String.raw`$2^{31}$`], answer: 1, explain: String.raw`FCW $=f_{out}2^N/f_{clk}=10^7\times2^{32}/10^8=0.1\times2^{32}=0.1\times4.2949\times10^9\approx4.29\times10^8$.` },
      { q: String.raw`The NCO frequency resolution is:`, options: [String.raw`$f_{clk}/2^W$`, String.raw`$f_{clk}/2^N$`, String.raw`$\text{FCW}/2^N$`, String.raw`$f_{clk}\cdot2^N$`], answer: 1, explain: String.raw`Resolution is set by the accumulator width: $\Delta f=f_{clk}/2^N$ (smallest FCW step of 1).` },
      { q: String.raw`Using only the top 14 phase bits of the accumulator, the worst-case SFDR is about:`, options: [String.raw`14 dBc`, String.raw`42 dBc`, String.raw`84 dBc`, String.raw`168 dBc`], answer: 2, explain: String.raw`SFDR $\approx6.02\times W=6.02\times14\approx84$ dBc.` },
      { q: String.raw`The maximum NCO output frequency is limited by:`, options: [String.raw`LUT depth`, String.raw`The Nyquist limit $f_{clk}/2$`, String.raw`The DAC resolution`, String.raw`Accumulator width $N$`], answer: 1, explain: String.raw`Output must satisfy $f_{out}<f_{clk}/2$; beyond Nyquist the output aliases.` },
      { q: String.raw`Phase truncation in an NCO produces:`, options: [String.raw`White noise only`, String.raw`Discrete spurious tones`, String.raw`DC offset`, String.raw`No error`], answer: 1, explain: String.raw`Truncation is a periodic (deterministic) error, so it folds into discrete spurs, not white noise.` },
      { q: String.raw`The phase accumulator is equivalent to which VCO element?`, options: [String.raw`The varactor`, String.raw`The $1/s$ phase integrator`, String.raw`The loop filter`, String.raw`The output buffer`], answer: 1, explain: String.raw`Accumulation is discrete-time integration — the digital analogue of the VCO's continuous $1/s$.` },
      { q: String.raw`CORDIC is attractive in an NCO because it:`, options: [String.raw`Needs a large ROM`, String.raw`Uses only shifts and adds (no multiplier/LUT)`, String.raw`Improves frequency resolution`, String.raw`Removes Nyquist limits`], answer: 1, explain: String.raw`CORDIC rotates a vector via iterative shift-add operations, avoiding both a big LUT and a multiplier.` },
      { q: String.raw`Increasing the accumulator width $N$ primarily improves:`, options: [String.raw`SFDR`, String.raw`Frequency resolution`, String.raw`Amplitude SQNR`, String.raw`Maximum output frequency`], answer: 1, explain: String.raw`$\Delta f=f_{clk}/2^N$: larger $N$ gives finer resolution. Purity depends on $W$ (phase bits) and $B$ (amplitude bits).` },
      { q: String.raw`Phase dithering in an NCO:`, options: [String.raw`Increases frequency resolution`, String.raw`Trades discrete spurs for a slightly higher noise floor`, String.raw`Eliminates all quantisation`, String.raw`Doubles the clock rate`], answer: 1, explain: String.raw`Randomising the truncated bits spreads spur energy into noise, cleaning the spectrum at the cost of a raised floor.` },
      { q: String.raw`A 12-bit amplitude DAC in a DDS gives an SQNR of about:`, options: [String.raw`$\approx 50$ dB`, String.raw`$\approx 62$ dB`, String.raw`$\approx 74$ dB`, String.raw`$\approx 96$ dB`], answer: 2, explain: String.raw`SQNR $\approx6.02\times12+1.76\approx74$ dB.` },
      { q: String.raw`Compared with a VCO, an NCO's tuning law is:`, options: [String.raw`Nonlinear and drifting`, String.raw`Exactly linear and repeatable`, String.raw`Logarithmic`, String.raw`Undefined`], answer: 1, explain: String.raw`$f_{out}=\text{FCW}\,f_{clk}/2^N$ is perfectly linear in the integer FCW and deterministic, unlike $K_{vco}(V)$.` },
      { q: String.raw`In a digital down-converter, the NCO's job is to:`, options: [String.raw`Amplify the signal`, String.raw`Generate the complex LO for the digital mixer`, String.raw`Perform channel coding`, String.raw`Filter out-of-band noise`], answer: 1, explain: String.raw`The NCO produces $e^{-j2\pi f_{LO}t}$, which the mixer multiplies with the signal to translate it to baseband.` }
    ],
    numericals: [
      { q: String.raw`$N=32$, $f_{clk}=200$ MHz. Find the frequency resolution and the FCW for $f_{out}=25$ MHz.`, solution: String.raw`<p><b>Formula.</b> $$\Delta f=\frac{f_{clk}}{2^N},\qquad \text{FCW}=\frac{f_{out}\,2^N}{f_{clk}},$$ where $N$ is the accumulator width, $f_{clk}$ the clock, and FCW the integer frequency control word.</p>
<p><b>Substitute.</b> $$\Delta f=\frac{200\times10^{6}}{2^{32}},\qquad \text{FCW}=\frac{(25\times10^{6})\,2^{32}}{200\times10^{6}}.$$</p>
<p><b>Compute.</b> With $2^{32}=4.2949\times10^{9}$: $\Delta f=200\times10^{6}/4.2949\times10^{9}\approx0.0466$ Hz. FCW $=(25/200)\times4.2949\times10^{9}=0.125\times4.2949\times10^{9}\approx5.369\times10^{8}$.</p>
<p><b>Explanation.</b> A 32-bit accumulator gives sub-0.05 Hz tuning steps — far finer than any analog VCO. The FCW is an exact integer here (0.125 of full scale is $2^{29}$), so 25 MHz is synthesized with zero frequency error. Resolution depends only on $N$, not on the LUT.</p>` },
      { q: String.raw`A 48-bit NCO clocked at 491.52 MHz. What is $\Delta f$?`, solution: String.raw`<p><b>Formula.</b> The frequency resolution is $$\Delta f=\frac{f_{clk}}{2^N},$$ with accumulator width $N=48$ and clock $f_{clk}=491.52$ MHz.</p>
<p><b>Substitute.</b> $$\Delta f=\frac{491.52\times10^{6}}{2^{48}}.$$</p>
<p><b>Compute.</b> With $2^{48}=2.815\times10^{14}$: $\Delta f=491.52\times10^{6}/2.815\times10^{14}\approx1.75\times10^{-6}$ Hz $\approx1.75$ µHz.</p>
<p><b>Explanation.</b> A 48-bit accumulator yields microhertz-class tuning — a resolution unreachable by analog means. Each extra accumulator bit halves the step, so the 16 extra bits over a 32-bit design shrink the step by $2^{16}\approx65{,}000\times$. This is why long accumulators are used for precise frequency generation.</p>` },
      { q: String.raw`How many phase bits $W$ into the LUT are needed for $\geq90$ dBc SFDR?`, solution: String.raw`<p><b>Formula.</b> The phase-truncation spurious-free dynamic range is $$\text{SFDR}\approx6.02\,W\ \text{dBc}\ \Rightarrow\ W\ge\frac{\text{SFDR}}{6.02},$$ where $W$ is the number of phase bits addressing the LUT.</p>
<p><b>Substitute.</b> $$W\ge\frac{90}{6.02}.$$</p>
<p><b>Compute.</b> $W\ge14.95$; since $W$ must be an integer, use $W=15$ bits (giving $\approx6.02\times15=90.3$ dBc).</p>
<p><b>Explanation.</b> Each phase bit into the LUT buys ~6 dB of spur suppression, so 15 bits clears the 90 dBc target with a hair of margin. Note this is independent of the accumulator width $N$ (which sets resolution) — purity and resolution are decoupled.</p>` },
      { q: String.raw`$N=24$, $f_{clk}=50$ MHz, FCW $=3\,355\,443$. Find $f_{out}$.`, solution: String.raw`<p><b>Formula.</b> The DDS output frequency is $$f_{out}=\frac{\text{FCW}\cdot f_{clk}}{2^N},$$ with FCW the control word, $f_{clk}$ the clock, and $N=24$ the accumulator width.</p>
<p><b>Substitute.</b> $$f_{out}=\frac{3\,355\,443\times(50\times10^{6})}{2^{24}}.$$</p>
<p><b>Compute.</b> With $2^{24}=16\,777\,216$, the fractional tuning is $3\,355\,443/16\,777\,216=0.19999\approx0.2$, so $f_{out}\approx0.2\times50\times10^{6}=10.0$ MHz.</p>
<p><b>Explanation.</b> The FCW is very close to one-fifth of full scale ($2^{24}/5=3\,355\,443.2$), producing 10 MHz. The tiny 0.2-count shortfall is the quantisation of frequency — the residual error is well under the $\Delta f=f_{clk}/2^{24}\approx3$ Hz resolution.</p>` },
      { q: String.raw`What is the SQNR of a DDS with a 10-bit amplitude output?`, solution: String.raw`<p><b>Formula.</b> The signal-to-quantisation-noise ratio of a full-scale sinusoid quantised to $B$ amplitude bits is $$\text{SQNR}\approx6.02\,B+1.76\ \text{dB}.$$</p>
<p><b>Substitute.</b> $$\text{SQNR}\approx6.02\times10+1.76.$$</p>
<p><b>Compute.</b> $6.02\times10=60.2$, so $\text{SQNR}\approx60.2+1.76=61.96$ dB.</p>
<p><b>Explanation.</b> This is the same "6 dB per bit" rule as an ADC/DAC — a 10-bit amplitude path sets a ~62 dB noise floor. The overall DDS purity is limited by the worse of this amplitude SQNR and the phase-truncation SFDR (plus DAC nonlinearity).</p>` },
      { q: String.raw`An NCO must produce 1 Hz steps. With $f_{clk}=100$ MHz, what accumulator width $N$ is needed?`, solution: String.raw`<p><b>Formula.</b> The step must satisfy $\Delta f=f_{clk}/2^N\le\Delta f_{target}$, i.e. $$2^N\ge\frac{f_{clk}}{\Delta f_{target}}\ \Rightarrow\ N\ge\log_2\!\left(\frac{f_{clk}}{\Delta f_{target}}\right).$$</p>
<p><b>Substitute.</b> $$N\ge\log_2\!\left(\frac{100\times10^{6}}{1}\right)=\log_2(10^{8}).$$</p>
<p><b>Compute.</b> $\log_2(10^{8})=8\log_2 10\approx8\times3.32=26.6$, so round up to $N=27$ bits. Check: $\Delta f=10^{8}/2^{27}=10^{8}/1.342\times10^{8}\approx0.745$ Hz $\le1$ Hz.</p>
<p><b>Explanation.</b> You always round the bit count up, because a fractional bit is not realisable; 27 bits over-satisfies the 1 Hz spec (giving 0.745 Hz). Adding one more bit would halve the step again, showing how cheaply digital resolution scales.</p>` },
      { q: String.raw`A DDS at $f_{clk}=250$ MHz outputs 30 MHz. Where do the nearest images appear?`, solution: String.raw`<p><b>Formula.</b> A sampled DDS output has spectral images at $$f_{image}=|k\,f_{clk}\pm f_{out}|,\quad k=1,2,\dots,$$ with the nearest pair at $k=1$, i.e. $f_{clk}-f_{out}$ and $f_{clk}+f_{out}$.</p>
<p><b>Substitute.</b> $$f_{image}=250\text{ MHz}-30\text{ MHz}\quad\text{and}\quad 250\text{ MHz}+30\text{ MHz}.$$</p>
<p><b>Compute.</b> Nearest images at $220$ MHz and $280$ MHz.</p>
<p><b>Explanation.</b> The reconstruction (anti-image) low-pass must pass the wanted 30 MHz while rejecting the 220 MHz image. That is an easy filter transition here because 30 MHz sits well below the 125 MHz Nyquist limit — keeping $f_{out}$ low relative to $f_{clk}$ is standard DDS practice precisely to ease this filtering.</p>` }
    ],
    realWorld: String.raw`<p>NCOs are everywhere in software-defined radio. AD9361/RFSoC-class devices use NCO-based digital up/down-converters to place channels anywhere in the band with sub-Hz precision, and standalone DDS chips (e.g. the AD98xx family) generate agile local oscillators for test equipment, radar chirps and frequency-hopping transmitters. In a receiver, the carrier-recovery loop (a <a href="#costas-loop">Costas</a> or <a href="#fll">FLL</a>) steers an NCO derotator to cancel <a href="#cfo">carrier frequency offset</a>, and the timing-recovery loop uses an NCO as the interpolation accumulator. Because the NCO is phase-continuous and bit-exact, it enables hop-free frequency agility that no analog <a href="#vco">VCO</a> can match — critical for <a href="#frequency-hopping">frequency-hopping</a> and cognitive-radio systems. The engineering trade in DDS design is always memory/logic (LUT size $W$, CORDIC depth) versus spectral purity (SFDR), plus DAC quality and reconstruction filtering.</p>`,
    related: ['vco', 'pll', 'dac', 'cfo', 'frequency-hopping']
  },
  {
    id: 'cfo',
    title: 'Carrier Frequency Offset (CFO)',
    category: 'Synchronization',
    tags: ['CFO', 'Doppler', 'OFDM', 'ICI', 'Schmidl-Cox', 'derotation', 'synchronization'],
    summary: String.raw`Carrier Frequency Offset is the residual frequency mismatch between transmit and receive local oscillators (plus Doppler), which rotates the received constellation at rate $2\pi\Delta f\,t$ and, in OFDM, destroys subcarrier orthogonality.`,
    diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 530 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-cfo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="8" y="66" fill="#e6edf3">rx y(t)</text>
        <text x="8" y="82" fill="#9aa7b5">·e</text>
        <text x="24" y="76" fill="#9aa7b5" font-size="9">j2πΔf·t</text>
        <line x1="60" y1="62" x2="108" y2="62" stroke="#9aa7b5" marker-end="url(#arr-cfo)"/>
        <circle cx="130" cy="62" r="20" fill="#1c232e" stroke="#4dabf7"/>
        <text x="130" y="67" fill="#e6edf3" text-anchor="middle" font-size="16">×</text>
        <line x1="152" y1="62" x2="210" y2="62" stroke="#9aa7b5" marker-end="url(#arr-cfo)"/>
        <rect x="212" y="40" width="150" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/>
        <text x="287" y="60" fill="#e6edf3" text-anchor="middle">derotated x̂(t)</text>
        <text x="287" y="77" fill="#9aa7b5" text-anchor="middle">·e<tspan baseline-shift="super" font-size="9">−j2πΔf̂·t</tspan></text>
        <rect x="88" y="120" width="128" height="46" rx="6" fill="#1c232e" stroke="#ffa94d"/>
        <text x="152" y="140" fill="#e6edf3" text-anchor="middle">NCO derotator</text>
        <text x="152" y="157" fill="#9aa7b5" text-anchor="middle">e<tspan baseline-shift="super" font-size="9">−j2πΔf̂·t</tspan></text>
        <line x1="152" y1="120" x2="140" y2="86" stroke="#ffa94d" marker-end="url(#arr-cfo)"/>
        <rect x="300" y="120" width="150" height="46" rx="6" fill="#1c232e" stroke="#b197fc"/>
        <text x="375" y="140" fill="#e6edf3" text-anchor="middle">CFO estimator</text>
        <text x="375" y="157" fill="#9aa7b5" text-anchor="middle">pilots / CP autocorr.</text>
        <line x1="300" y1="143" x2="218" y2="143" stroke="#b197fc" marker-end="url(#arr-cfo)"/>
        <text x="258" y="136" fill="#9aa7b5" text-anchor="middle" font-size="10">Δf̂</text>
      </svg>`,
      caption: String.raw`An NCO-driven derotator multiplies rx by e^{−j2πΔf̂·t}; a CFO estimator (pilots/CP autocorrelation) supplies Δf̂ to null the 2πΔf·t spin.`
    },
    {
      title: String.raw`CFO impact in OFDM: subcarrier drift and ICI`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-cfo" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Frequency offset ε shifts every subcarrier off its DFT bin</text>
        <text x="120" y="34" fill="#63e6be" font-size="11" text-anchor="middle">aligned (ε=0): nulls fall on neighbours</text>
        <line x1="30" y1="95" x2="230" y2="95" stroke="#9aa7b5"/>
        <path d="M40,95 Q60,50 80,95 Q100,50 120,95 Q140,50 160,95 Q180,50 200,95" fill="none" stroke="#63e6be" stroke-width="1.6"/>
        <line x1="80" y1="95" x2="80" y2="55" stroke="#4dabf7" stroke-dasharray="2 2"/><line x1="120" y1="95" x2="120" y2="55" stroke="#4dabf7" stroke-dasharray="2 2"/><line x1="160" y1="95" x2="160" y2="55" stroke="#4dabf7" stroke-dasharray="2 2"/>
        <text x="410" y="34" fill="#ff6b6b" font-size="11" text-anchor="middle">offset (ε≠0): sampling misses the peaks</text>
        <line x1="310" y1="95" x2="510" y2="95" stroke="#9aa7b5"/>
        <path d="M320,95 Q340,50 360,95 Q380,50 400,95 Q420,50 440,95 Q460,50 480,95" fill="none" stroke="#ffa94d" stroke-width="1.6"/>
        <line x1="372" y1="95" x2="372" y2="55" stroke="#ff6b6b" stroke-dasharray="2 2"/><line x1="412" y1="95" x2="412" y2="55" stroke="#ff6b6b" stroke-dasharray="2 2"/><line x1="452" y1="95" x2="452" y2="55" stroke="#ff6b6b" stroke-dasharray="2 2"/>
        <text x="392" y="112" fill="#ff6b6b" font-size="9" text-anchor="middle">↔ ε·Δf<tspan baseline-shift="sub" font-size="8">sc</tspan></text>
        <text x="270" y="150" fill="#b197fc" font-size="11" text-anchor="middle">ε = Δf / Δf<tspan baseline-shift="sub" font-size="9">sc</tspan> = Δf·T<tspan baseline-shift="sub" font-size="9">u</tspan></text>
        <text x="270" y="172" fill="#9aa7b5" font-size="10" text-anchor="middle">integer part → cyclic subcarrier shift ; fractional part → ICI + common phase error</text>
        <text x="270" y="192" fill="#9aa7b5" font-size="10" text-anchor="middle">ICI power ≈ (πε)²/3 ; SNR loss ≈ (10/3ln10)(πε)²·Es/N0</text>
      </svg>`,
      caption: String.raw`Left, orthogonal subcarriers whose spectral nulls land exactly on neighbours; right, a CFO of ε subcarrier-spacings shifts every carrier so the DFT no longer samples its peak with neighbours at zero. The result is inter-carrier interference (ICI≈(πε)²/3) and a common phase error — OFDM's Achilles heel.`
    },
    {
      title: String.raw`Two-stage CFO acquisition (coarse preamble → fine pilots → derotate)`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">
        <defs><marker id="arr3-cfo" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Coarse-then-fine CFO estimation feeding the NCO derotator</text>
        <line x1="6" y1="70" x2="34" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-cfo)"/><text x="6" y="62" fill="#9aa7b5" font-size="9">rx</text>
        <rect x="34" y="50" width="120" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="94" y="66" fill="#e6edf3" text-anchor="middle">coarse est.</text><text x="94" y="81" fill="#9aa7b5" font-size="8" text-anchor="middle">preamble autocorr</text>
        <rect x="180" y="50" width="120" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="240" y="66" fill="#e6edf3" text-anchor="middle">fine est.</text><text x="240" y="81" fill="#9aa7b5" font-size="8" text-anchor="middle">pilots / residual</text>
        <rect x="326" y="50" width="96" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="374" y="66" fill="#e6edf3" text-anchor="middle">NCO</text><text x="374" y="81" fill="#9aa7b5" font-size="8" text-anchor="middle">derotator</text>
        <circle cx="470" cy="70" r="18" fill="#1c232e" stroke="#b197fc"/><text x="470" y="75" fill="#e6edf3" text-anchor="middle" font-size="14">×</text>
        <line x1="154" y1="70" x2="180" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-cfo)"/><text x="167" y="63" fill="#9aa7b5" font-size="8">Δf̂c</text>
        <line x1="300" y1="70" x2="326" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-cfo)"/><text x="313" y="63" fill="#9aa7b5" font-size="8">Δf̂f</text>
        <line x1="422" y1="70" x2="452" y2="70" stroke="#ffa94d" marker-end="url(#arr3-cfo)"/>
        <line x1="470" y1="52" x2="470" y2="34" stroke="#9aa7b5"/><line x1="470" y1="34" x2="60" y2="34" stroke="#9aa7b5"/><line x1="60" y1="34" x2="60" y2="50" stroke="#9aa7b5" marker-end="url(#arr3-cfo)"/><text x="250" y="30" fill="#9aa7b5" font-size="8" text-anchor="middle">rx samples in</text>
        <line x1="488" y1="70" x2="520" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-cfo)"/><text x="508" y="63" fill="#63e6be" font-size="10">x̂</text>
        <text x="270" y="150" fill="#b197fc" font-size="10" text-anchor="middle">coarse grabs large offset (wide range, ±1/2DTs) ; fine cleans residual (high accuracy)</text>
        <text x="270" y="170" fill="#9aa7b5" font-size="10" text-anchor="middle">FLL-assisted PLL / Costas then tracks any remaining drift, steering the same NCO</text>
      </svg>`,
      caption: String.raw`Two-stage acquisition: a coarse estimator (preamble autocorrelation, wide but low-resolution) removes the bulk offset, then a fine estimator (pilots/residual) refines it; both drive an NCO derotator that multiplies the incoming samples by e^{−j2πΔf̂t}. A closed-loop FLL-assisted PLL/Costas then tracks residual drift.`
    }
    ],
    prerequisites: ['bpsk', 'fft', 'vco'],
    intro: String.raw`<p><b>Why care about CFO?</b> No two independent oscillators ever run at exactly the same frequency, and any relative motion adds Doppler on top — so the frequency the receiver <i>thinks</i> it is tuned to is always slightly wrong. Left uncorrected, that tiny mismatch spins the constellation until symbols cross into the wrong decision regions, and in OFDM it shatters the delicate orthogonality that the whole scheme depends on. CFO is therefore not an academic nicety but the single most performance-critical synchronization task in a broadband receiver: get it wrong and throughput collapses. Understanding CFO means understanding how the offset arises, how it damages single-carrier and OFDM links, and how estimators plus an NCO derotator remove it.</p>
<p><b>Carrier Frequency Offset (CFO)</b> is the difference $\Delta f=f_{Tx}-f_{Rx}$ between the transmitter's and receiver's local-oscillator frequencies, augmented by any <b>Doppler shift</b> from relative motion. No two independent oscillators are ever exactly equal — a modest 10 ppm crystal at 2.4 GHz already produces up to 24 kHz of offset. After downconversion this leftover offset multiplies the baseband signal by $e^{j2\pi\Delta f\,t}$, so the received constellation <b>spins</b> at $2\pi\Delta f$ rad/s. In single-carrier systems this rotates symbols (and, if uncorrected, collapses BER); in <a href="#fft">OFDM</a> it is far more damaging because it breaks the <b>orthogonality</b> of subcarriers, producing <b>inter-carrier interference (ICI)</b> and a <b>common phase error (CPE)</b>. Estimating and correcting CFO — with pilots, preambles (Schmidl-Cox), or cyclic-prefix autocorrelation (Moose), then derotating with an <a href="#nco">NCO</a> — is a mandatory front-end synchronisation task.</p>`,
    sections: [
      {
        h: 'What CFO is: LO mismatch and Doppler',
        html: String.raw`<p>Two independent sources create CFO:</p>
        <ul>
          <li><b>Oscillator mismatch:</b> Tx and Rx derive their carriers from separate reference oscillators with finite accuracy (specified in parts-per-million). At carrier $f_c$, an accuracy of $\pm p$ ppm on each end gives a worst-case offset up to $\Delta f_{max}=2p\times10^{-6}f_c$.</li>
          <li><b>Doppler shift:</b> relative motion at radial velocity $v$ shifts the carrier by $\Delta f_D=(v/c)f_c$. At high $f_c$ or high mobility (satellites, LEO, aircraft) Doppler can dominate.</li>
        </ul>
        <p>These add: $\Delta f=\Delta f_{LO}+\Delta f_D$. The receiver cannot distinguish the two — it just sees a total offset that must be estimated and removed. A related but separate impairment is the <b>sampling-clock offset</b> (the ADC clock differs from the DAC clock), which we do not treat here.</p>
        <div class="callout"><b>Rule of thumb:</b> CFO tolerance scales with symbol rate. A high-rate system with wide subcarrier spacing tolerates more absolute Hz of offset than a narrowband/OFDM system with closely spaced subcarriers — which is why OFDM demands tight CFO correction.</div>`
      },
      {
        h: 'The progressive phase rotation (single carrier)',
        html: String.raw`<p>Let the transmitter send a baseband symbol on carrier $f_{Tx}$: $s_{RF}(t)=\Re\{x(t)e{}^{j2\pi f_{Tx}t}\}$. The receiver mixes with its own LO at $f_{Rx}=f_{Tx}-\Delta f$. After the mixer and low-pass filter, the recovered baseband is</p>
        <p>$$y(t)=x(t)\,e^{j2\pi\Delta f\,t}\,e^{j\theta_0}+n(t),$$</p>
        <p>where $\theta_0$ is a fixed phase offset and $n(t)$ noise. The factor $e^{j2\pi\Delta f t}$ is a phase that grows <i>linearly with time</i> at rate $2\pi\Delta f$ — the constellation rotates a full turn every $1/\Delta f$ seconds. Over one symbol period $T_s$ the phase advances by $\Delta\phi=2\pi\Delta f\,T_s$.</p>
        <p>Effects on a single-carrier link:</p>
        <ul>
          <li><b>Spinning constellation:</b> without correction, decision regions are crossed and BER climbs toward 0.5 as the offset grows.</li>
          <li><b>SNR/EVM loss:</b> even small residual CFO smears symbols radially in the eye and increases <a href="#evm">EVM</a>.</li>
          <li><b>Correlation loss</b> in the matched filter if the rotation is significant across a symbol.</li>
        </ul>
        <p>A <a href="#costas-loop">Costas loop</a> or decision-directed <a href="#pll">PLL</a> tracks and cancels this rotation for PSK/QAM.</p>`
      },
      {
        h: 'CFO in OFDM: loss of orthogonality and ICI',
        html: String.raw`<p>OFDM packs subcarriers at spacing $\Delta f_{sc}=1/T_u$ (where $T_u$ is the useful symbol time) so that each subcarrier's spectral nulls fall on its neighbours — perfect <b>orthogonality</b>. A frequency offset $\Delta f$ shifts every subcarrier off its DFT bin, so the sampling of each subcarrier no longer lands on its own peak with neighbours at zero. Two damaging effects result:</p>
        <ul>
          <li><b>Common Phase Error (CPE):</b> the wanted subcarrier is attenuated and rotated by a common factor $\text{sinc}(\varepsilon)e^{j\pi\varepsilon(K-1)/K}$-type term — a per-symbol phase twist shared by all subcarriers.</li>
          <li><b>Inter-Carrier Interference (ICI):</b> energy leaks from every other subcarrier into the one being demodulated, because their nulls no longer align. ICI acts like added noise, and its power grows roughly as $(\pi\varepsilon)^2/3$ for small normalised offset $\varepsilon$.</li>
        </ul>
        <p>The <b>normalised CFO</b> is defined relative to subcarrier spacing:</p>
        <p>$$\varepsilon=\frac{\Delta f}{\Delta f_{sc}}.$$</p>
        <p>It splits into an <b>integer part</b> (a cyclic shift of subcarrier indices — recovered from the preamble) and a <b>fractional part</b> $|\varepsilon|<0.5$ (the source of ICI — estimated from the cyclic prefix or preamble). OFDM's sensitivity to CFO is its Achilles' heel; systems typically require $|\varepsilon|$ below a few percent.</p>`
      },
      {
        h: 'SNR degradation from residual CFO',
        html: String.raw`<p>A useful engineering bound: for small normalised offset the SNR loss (in dB) of an OFDM system with $N$ subcarriers is approximately</p>
        <p>$$D_{SNR}\approx\frac{10}{3\ln 10}\,(\pi\varepsilon)^2\cdot\frac{E_s}{N_0}\ \text{(dB)},$$</p>
        <p>i.e. the degradation grows with the <i>square</i> of the offset and with the operating SNR — so high-order QAM (which needs high SNR) is far less CFO-tolerant than QPSK. The practical takeaway: to run 256-QAM you need residual $\varepsilon$ an order of magnitude tighter than for QPSK. In single-carrier systems the analogous loss comes from imperfect derotation leaving a slowly rotating constellation, which a tracking loop must keep well within the decision margin.</p>`
      },
      {
        h: 'Estimation: pilots, preambles, and CP autocorrelation',
        html: String.raw`<p>Three classes of CFO estimator, from most to least overhead:</p>
        <ul>
          <li><b>Data-aided / pilot-based:</b> known pilot symbols (scattered in OFDM, or a training sequence) let the receiver measure the accumulated phase between known points. Accurate and robust; costs spectrum.</li>
          <li><b>Preamble autocorrelation (Schmidl-Cox):</b> a preamble with two identical halves. CFO advances the phase between the halves by a known amount; correlating the two halves and taking the angle yields the fractional CFO. A second symbol resolves the integer part. Robust at low SNR, standard in Wi-Fi/LTE-like systems.</li>
          <li><b>Cyclic-prefix autocorrelation (Moose / blind):</b> the CP is a copy of the symbol's tail, separated by $N$ samples. Correlating a received block with a copy delayed by $N$ gives a phasor whose angle equals $2\pi\varepsilon$ — no pilots needed, but lower accuracy and limited to $|\varepsilon|<0.5$.</li>
        </ul>
        <p>The generic estimator structure is an autocorrelation $R=\sum r[n]\,r^*[n+D]$ between two segments separated by a known delay $D$ that are identical apart from the CFO-induced phase; the estimate is $\hat{\Delta f}=\dfrac{1}{2\pi D T_s}\angle R$. The $\angle$ (arg) wraps at $\pm\pi$, which sets the unambiguous acquisition range — larger $D$ gives finer resolution but a smaller pull-in range.</p>`
      },
      {
        h: 'Correction: NCO derotation and the tracking loop',
        html: String.raw`<p>Once $\hat{\Delta f}$ is estimated, correction multiplies the received samples by the conjugate rotation:</p>
        <p>$$\hat{x}(t)=y(t)\,e^{-j2\pi\hat{\Delta f}\,t}.$$</p>
        <p>This complex multiply is generated by an <a href="#nco">NCO</a> (the digital derotator): the NCO synthesises $e^{-j2\pi\hat{\Delta f}t}$ and a digital mixer applies it — the exact digital analogue of tuning an <a href="#vco">analog VCO/LO</a> to null the offset. In a full receiver, coarse acquisition (preamble/CP) is followed by <b>closed-loop tracking</b>:</p>
        <ul>
          <li>an <a href="#fll">FLL</a> pulls in a large initial frequency offset quickly (frequency discriminator drives the NCO);</li>
          <li>a <a href="#costas-loop">Costas loop</a> or decision-directed PLL then tracks the residual phase precisely (phase discriminator).</li>
        </ul>
        <p>A common architecture is <b>FLL-assisted PLL</b>: the FLL grabs the frequency, then hands off to the PLL for tight phase lock. The NCO is the common actuator both loops steer — mirroring how a VCO is steered in an analog loop.</p>
        <div class="callout"><b>Connection:</b> CFO correction is carrier synchronisation. FLL handles frequency, Costas/PLL handles phase, and an NCO applies the correction — the same phase/frequency-source ideas as VCO and NCO, now used in reverse to <i>remove</i> an unwanted offset.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Where CFO comes from:</b> oscillator ppm mismatch ($\Delta f_{max}=2p\times10^{-6}f_c$) plus Doppler ($(v/c)f_c$), which add and are indistinguishable at the receiver.</li>
<li><b>The single-carrier effect:</b> CFO multiplies baseband by $e^{j2\pi\Delta f t}$, spinning the constellation at $2\pi\Delta f$ rad/s ($\Delta\phi=2\pi\Delta f T_s$ per symbol), driving BER toward 0.5 if untracked.</li>
<li><b>The OFDM effect:</b> normalised CFO $\varepsilon=\Delta f/\Delta f_{sc}$ splits into an integer part (cyclic subcarrier shift) and a fractional part that breaks orthogonality, producing ICI ($\propto(\pi\varepsilon)^2/3$) and a common phase error; SNR loss grows with $\varepsilon^2$ and with $E_s/N_0$.</li>
<li><b>Estimation:</b> pilots, Schmidl-Cox preamble halves, and Moose CP autocorrelation all reduce to $\hat{\Delta f}=\frac{1}{2\pi DT_s}\angle\sum r[n]r^*[n+D]$, with $\pm\pi$ wrap setting the range-vs-resolution trade.</li>
<li><b>Correction:</b> derotate by $e^{-j2\pi\hat{\Delta f}t}$ from an NCO, with an FLL acquiring frequency and a Costas/PLL tracking residual phase — carrier synchronisation is the VCO/NCO idea run in reverse.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Orthogonal_frequency-division_multiplexing" target="_blank" rel="noopener">Wikipedia — Orthogonal frequency-division multiplexing</a> — why OFDM is acutely sensitive to CFO (loss of subcarrier orthogonality → ICI) and how preamble/pilot synchronization such as the Schmidl-Cox two-halves method corrects it.</li>
<li><a href="http://comlab.ecs.syr.edu/files/papers/spl_april2002.pdf" target="_blank" rel="noopener">Syracuse ComLab — ML Estimation of OFDM Carrier Frequency Offset</a> — rigorous maximum-likelihood derivation of the autocorrelation estimator and its Cramer-Rao bound.</li>
<li><a href="https://dspillustrations.com/pages/posts/misc/schmidlcox-synchronization-for-ofdm.html" target="_blank" rel="noopener">DSP Illustrations — The Schmidl &amp; Cox Technique for OFDM</a> — worked tutorial with Python, preamble construction, and metric plots that make the timing/frequency metric concrete.</li>
<li><a href="https://www.informit.com/articles/article.aspx?p=2832588&seqNum=4" target="_blank" rel="noopener">InformIT (Heath) — CFO Correction in Frequency-Selective Channels</a> — textbook chapter connecting Moose/Schmidl-Cox to the 802.11a STF/LTF coarse-then-fine two-step correction.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`CFO $=\Delta f=f_{Tx}-f_{Rx}$ from independent-oscillator mismatch (ppm) plus Doppler $(v/c)f_c$; the two add and are indistinguishable at the Rx.`,
      String.raw`CFO multiplies baseband by $e^{j2\pi\Delta f\,t}$ — a phase growing linearly in time, so the constellation spins at $2\pi\Delta f$ rad/s.`,
      String.raw`Per symbol the constellation rotates $\Delta\phi=2\pi\Delta f\,T_s$; left uncorrected, single-carrier BER climbs toward 0.5.`,
      String.raw`Normalised CFO $\varepsilon=\Delta f/\Delta f_{sc}$ splits into an integer part (subcarrier cyclic shift) and a fractional part $|\varepsilon|<0.5$ (source of ICI).`,
      String.raw`In OFDM, CFO breaks subcarrier orthogonality, giving a common phase error (CPE) and inter-carrier interference (ICI $\propto(\pi\varepsilon)^2/3$).`,
      String.raw`OFDM SNR loss $\approx\frac{10}{3\ln10}(\pi\varepsilon)^2\,E_s/N_0$ dB — grows with the square of offset and with SNR, so high-order QAM is least tolerant.`,
      String.raw`Estimators: pilot/data-aided, Schmidl-Cox preamble (identical halves), and Moose cyclic-prefix autocorrelation (blind).`,
      String.raw`Generic estimate: $\hat{\Delta f}=\frac{1}{2\pi D T_s}\angle\!\sum r[n]r^*[n+D]$; the arg wraps at $\pm\pi$, trading resolution against pull-in range via $D$.`,
      String.raw`Correction derotates: $\hat{x}=y\,e^{-j2\pi\hat{\Delta f}t}$, generated by an NCO — the digital equivalent of tuning a VCO/LO.`,
      String.raw`Full carrier sync: an FLL acquires the frequency, then a Costas/PLL tracks the residual phase — FLL-assisted-PLL, both steering the same NCO.`
    ],
    equations: [
      {
        title: 'Baseband model of CFO (progressive rotation)',
        tex: String.raw`$$y(t)=x(t)\,e^{j2\pi\Delta f\,t}e^{j\theta_0}+n(t)$$`,
        derivation: String.raw`<p><b>Where we start.</b> The transmitter modulates a baseband symbol stream $x(t)$ onto a carrier; the receiver downconverts with its own LO at a slightly different frequency. We track exactly what leftover term the frequency mismatch leaves.</p>
        <p><b>Step 1 — transmitted passband signal.</b> Using complex-baseband notation with Tx carrier $f_{Tx}$:</p>
        $$s(t)=\Re\!\big\{x(t)\,e^{j2\pi f_{Tx}t}\big\}.$$
        <p><b>Step 2 — receiver downconversion.</b> The Rx multiplies by its LO $e^{-j2\pi f_{Rx}t}$ (with phase $\theta_0$) and low-pass filters. Keeping the baseband term,</p>
        $$y(t)=x(t)\,e^{j2\pi (f_{Tx}-f_{Rx})t}\,e^{j\theta_0}+n(t).$$
        <p><b>Step 3 — define the offset.</b> Let $\Delta f\equiv f_{Tx}-f_{Rx}$ (LO mismatch plus Doppler). Then</p>
        $$y(t)=x(t)\,e^{j2\pi\Delta f\,t}\,e^{j\theta_0}+n(t).$$
        <p><b>Result.</b> $$y(t)=x(t)\,e^{j2\pi\Delta f\,t}e^{j\theta_0}+n(t).$$ Sanity check: if $\Delta f=0$ the exponential is a constant $e^{j\theta_0}$ (a fixed phase, handled by phase recovery). When $\Delta f\neq0$ the exponent grows with $t$ — a rotation whose rate is exactly $2\pi\Delta f$, i.e. the spinning constellation.</p>`
      },
      {
        title: 'Per-symbol phase increment',
        tex: String.raw`$$\Delta\phi=2\pi\Delta f\,T_s$$`,
        derivation: String.raw`<p><b>Where we start.</b> Symbols are sampled once per symbol period $T_s$. We ask how much the CFO rotation advances between consecutive symbol instants.</p>
        <p><b>Step 1 — evaluate the rotation phase at symbol times.</b> The CFO phase is $\phi(t)=2\pi\Delta f\,t$. At symbol $k$, $t=kT_s$, so $\phi_k=2\pi\Delta f\,kT_s$.</p>
        <p><b>Step 2 — difference successive symbols.</b></p>
        $$\Delta\phi=\phi_{k+1}-\phi_k=2\pi\Delta f\,\big[(k+1)-k\big]T_s=2\pi\Delta f\,T_s.$$
        <p><b>Result.</b> $$\Delta\phi=2\pi\Delta f\,T_s.$$ Sanity check: for BPSK the decision boundary is $\pm90^\circ$; requiring $\Delta\phi\ll\pi/2$ across a burst bounds how much uncorrected CFO the demodulator can tolerate before symbols cross into the wrong decision region. This is why a tracking loop must null $\Delta f$.</p>`
      },
      {
        title: 'Normalised CFO',
        tex: String.raw`$$\varepsilon=\frac{\Delta f}{\Delta f_{sc}}=\Delta f\,T_u$$`,
        derivation: String.raw`<p><b>Where we start.</b> In OFDM the natural yardstick for frequency is the subcarrier spacing, because orthogonality is a statement about integer numbers of cycles per useful symbol.</p>
        <p><b>Step 1 — subcarrier spacing.</b> With useful (FFT) symbol duration $T_u$, subcarriers are placed at spacing $\Delta f_{sc}=1/T_u$ so that each carries an integer number of cycles over $T_u$ (orthogonality condition).</p>
        <p><b>Step 2 — normalise the offset.</b> Divide the physical offset by the spacing:</p>
        $$\varepsilon=\frac{\Delta f}{\Delta f_{sc}}=\Delta f\cdot T_u.$$
        <p><b>Step 3 — split integer and fractional parts.</b> Write $\varepsilon=\ell+\delta$ with integer $\ell$ and $|\delta|<0.5$. The integer $\ell$ merely cyclically shifts subcarrier indices (recoverable from the preamble); the fractional $\delta$ moves each subcarrier off its bin, causing ICI.</p>
        <p><b>Result.</b> $$\varepsilon=\Delta f\,T_u.$$ Sanity check: $\varepsilon=1$ means the offset equals one full subcarrier spacing — every subcarrier lands exactly on its neighbour's bin (pure integer shift, zero ICI but wrong mapping). Small $|\delta|$ is what standards budget for.</p>`
      },
      {
        title: 'Autocorrelation CFO estimator',
        tex: String.raw`$$\hat{\Delta f}=\frac{1}{2\pi D T_s}\,\angle\!\left(\sum_{n} r[n]\,r^*[n+D]\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Many CFO estimators exploit a signal that repeats after $D$ samples (identical preamble halves, or the cyclic prefix copying the tail). The only difference between the two identical copies is the phase the CFO added in between.</p>
        <p><b>Step 1 — model two identical segments.</b> If a transmitted segment repeats, $x[n+D]=x[n]$. With CFO $\Delta f$, the received samples pick up the rotation:</p>
        $$r[n]=x[n]e^{j2\pi\Delta f nT_s},\qquad r[n+D]=x[n]e^{j2\pi\Delta f (n+D)T_s}.$$
        <p><b>Step 2 — form the lag-$D$ product.</b> Multiply the earlier by the conjugate of the later's counterpart; the data $x[n]$ cancels as $|x[n]|^2$, leaving a pure phasor:</p>
        $$r[n]\,r^*[n+D]=|x[n]|^2\,e^{-j2\pi\Delta f D T_s}.$$
        <p><b>Step 3 — sum over the segment.</b> Averaging over $n$ boosts SNR while keeping the common phase:</p>
        $$R=\sum_n r[n]\,r^*[n+D]=\Big(\sum_n |x[n]|^2\Big)e^{-j2\pi\Delta f D T_s}.$$
        <p><b>Step 4 — extract the angle.</b> The magnitude sum is real and positive, so $\angle R=-2\pi\Delta f D T_s$. Solving,</p>
        $$\hat{\Delta f}=-\frac{\angle R}{2\pi D T_s}=\frac{1}{2\pi D T_s}\angle\!\Big(\sum_n r[n]r^*[n+D]\Big),$$
        <p>(sign convention absorbed by defining $R$ with the conjugate on the later term).</p>
        <p><b>Result.</b> $$\hat{\Delta f}=\frac{1}{2\pi D T_s}\angle R.$$ Sanity check: the arg is only unambiguous over $(-\pi,\pi]$, so the estimable range is $|\Delta f|<1/(2D T_s)$ — larger separation $D$ gives finer resolution but a smaller unambiguous (pull-in) range. This is the Moose/Schmidl-Cox core.</p>`
      },
      {
        title: 'Derotation (CFO correction)',
        tex: String.raw`$$\hat{x}(t)=y(t)\,e^{-j2\pi\hat{\Delta f}\,t}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Having estimated $\hat{\Delta f}$, we remove the rotation by applying the opposite one — the same idea as retuning the LO, done numerically.</p>
        <p><b>Step 1 — the received model.</b> From before, $y(t)=x(t)e^{j2\pi\Delta f t}e^{j\theta_0}+n(t)$.</p>
        <p><b>Step 2 — multiply by the conjugate rotation.</b> Generate $e^{-j2\pi\hat{\Delta f}t}$ (an NCO) and multiply:</p>
        $$\hat{x}(t)=y(t)e^{-j2\pi\hat{\Delta f}t}=x(t)e^{j2\pi(\Delta f-\hat{\Delta f})t}e^{j\theta_0}+n'(t).$$
        <p><b>Step 3 — perfect estimate limit.</b> If $\hat{\Delta f}=\Delta f$, the time-varying exponential collapses to 1:</p>
        $$\hat{x}(t)=x(t)e^{j\theta_0}+n'(t).$$
        <p><b>Result.</b> $$\hat{x}(t)=y(t)e^{-j2\pi\hat{\Delta f}t}.$$ Sanity check: only the static phase $\theta_0$ remains, which a phase-recovery loop (Costas/PLL) removes. Any residual $\Delta f-\hat{\Delta f}$ leaves a slow spin that the closed-loop tracker mops up. The NCO is exactly the digital derotator.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What are the two sources of CFO?`, back: String.raw`Independent Tx/Rx local-oscillator frequency mismatch (ppm accuracy) and Doppler shift $(v/c)f_c$ from relative motion; they add.` },
      { front: String.raw`How does CFO affect the received baseband signal?`, back: String.raw`It multiplies it by $e^{j2\pi\Delta f\,t}$ — a phase growing linearly in time, so the constellation spins at $2\pi\Delta f$ rad/s.` },
      { front: String.raw`What is the per-symbol phase rotation from CFO?`, back: String.raw`$\Delta\phi=2\pi\Delta f\,T_s$, where $T_s$ is the symbol period.` },
      { front: String.raw`Define normalised CFO.`, back: String.raw`$\varepsilon=\Delta f/\Delta f_{sc}=\Delta f\,T_u$; it splits into an integer part (subcarrier shift) and fractional part $|\delta|<0.5$ (causes ICI).` },
      { front: String.raw`Why is OFDM more CFO-sensitive than single carrier?`, back: String.raw`CFO breaks subcarrier orthogonality, producing inter-carrier interference (ICI) and a common phase error (CPE); ICI $\propto(\pi\varepsilon)^2$.` },
      { front: String.raw`What is the common phase error (CPE)?`, back: String.raw`A per-OFDM-symbol phase rotation and attenuation shared by all subcarriers, caused by fractional CFO.` },
      { front: String.raw`What is inter-carrier interference (ICI)?`, back: String.raw`Energy leaking between OFDM subcarriers when CFO misaligns their spectral nulls; it acts like added noise, growing as $(\pi\varepsilon)^2/3$.` },
      { front: String.raw`How does Schmidl-Cox estimate CFO?`, back: String.raw`A preamble with two identical halves; the phase difference between the halves (via autocorrelation) gives fractional CFO; a second symbol gives the integer part.` },
      { front: String.raw`How does the Moose / cyclic-prefix method work?`, back: String.raw`Correlate the received block with a copy delayed by the FFT length $N$ (the CP repeats the tail); the arg of the correlation equals $2\pi\varepsilon$. Blind, but $|\varepsilon|<0.5$.` },
      { front: String.raw`What sets the unambiguous CFO estimation range?`, back: String.raw`The arg wraps at $\pm\pi$, so $|\Delta f|<1/(2DT_s)$; larger delay $D$ gives finer resolution but smaller pull-in range.` },
      { front: String.raw`How is CFO corrected once estimated?`, back: String.raw`Derotate: multiply by $e^{-j2\pi\hat{\Delta f}t}$, generated by an NCO — the digital equivalent of retuning the LO.` },
      { front: String.raw`What handles frequency vs phase in carrier recovery?`, back: String.raw`An FLL pulls in large frequency offset; a Costas loop / PLL then tracks the residual phase (FLL-assisted-PLL); both steer the same NCO.` },
      { front: String.raw`Estimate CFO from a 10 ppm oscillator pair at 2.4 GHz.`, back: String.raw`Worst case $\Delta f\approx2\times10\times10^{-6}\times2.4\times10^9=48$ kHz (each end $\pm$10 ppm).` },
      { front: String.raw`Why is high-order QAM less CFO-tolerant than QPSK?`, back: String.raw`SNR loss from CFO scales with $E_s/N_0$; QAM needs high SNR and has tighter decision regions, so it demands much smaller residual $\varepsilon$.` }
    ],
    mcqs: [
      { q: String.raw`CFO multiplies the baseband signal by:`, options: [String.raw`A constant real gain`, String.raw`$e^{j2\pi\Delta f\,t}$ (time-growing phase)`, String.raw`$e^{-t/\tau}$`, String.raw`A delayed impulse`], answer: 1, explain: String.raw`A frequency offset appears as $e^{j2\pi\Delta f t}$ — a linearly growing phase, i.e. a spinning constellation.` },
      { q: String.raw`Two 10 ppm oscillators at 5 GHz produce a worst-case CFO of about:`, options: [String.raw`5 kHz`, String.raw`50 kHz`, String.raw`100 kHz`, String.raw`500 kHz`], answer: 2, explain: String.raw`$\Delta f\approx2\times10\times10^{-6}\times5\times10^9=100$ kHz (both ends $\pm10$ ppm).` },
      { q: String.raw`In OFDM, fractional CFO primarily causes:`, options: [String.raw`Only a constant delay`, String.raw`Inter-carrier interference and common phase error`, String.raw`Increased bandwidth`, String.raw`Improved orthogonality`], answer: 1, explain: String.raw`It breaks orthogonality, leaking energy between subcarriers (ICI) and rotating all subcarriers together (CPE).` },
      { q: String.raw`The normalised CFO $\varepsilon$ is defined as:`, options: [String.raw`$\Delta f\cdot f_c$`, String.raw`$\Delta f/\Delta f_{sc}$`, String.raw`$\Delta f\cdot T_s$ only`, String.raw`$f_c/\Delta f$`], answer: 1, explain: String.raw`$\varepsilon=\Delta f/\Delta f_{sc}=\Delta f\,T_u$ — offset measured in units of subcarrier spacing.` },
      { q: String.raw`The integer part of $\varepsilon$ in OFDM causes:`, options: [String.raw`ICI`, String.raw`A cyclic shift of subcarrier indices`, String.raw`Timing offset`, String.raw`Amplitude fading`], answer: 1, explain: String.raw`An integer offset shifts subcarrier mapping by whole bins; the fractional part causes ICI.` },
      { q: String.raw`Schmidl-Cox CFO estimation relies on:`, options: [String.raw`A preamble with two identical halves`, String.raw`A single random symbol`, String.raw`The channel impulse response`, String.raw`The DAC clock`], answer: 0, explain: String.raw`The known repetition lets the phase accumulated between halves reveal the fractional CFO.` },
      { q: String.raw`The Moose estimator uses the fact that:`, options: [String.raw`Pilots are inserted`, String.raw`The cyclic prefix repeats the symbol tail`, String.raw`The carrier is unmodulated`, String.raw`Noise is white`], answer: 1, explain: String.raw`The CP is a copy of the tail separated by $N$ samples; correlating them exposes the CFO phase — a blind method.` },
      { q: String.raw`Increasing the correlation lag $D$ in an autocorrelation CFO estimator:`, options: [String.raw`Widens the pull-in range`, String.raw`Improves resolution but narrows the unambiguous range`, String.raw`Has no effect`, String.raw`Removes noise entirely`], answer: 1, explain: String.raw`Resolution $\propto1/D$ improves, but the $\pm\pi$ arg wrap makes the range $|\Delta f|<1/(2DT_s)$ shrink.` },
      { q: String.raw`CFO correction is applied by:`, options: [String.raw`Adding a constant`, String.raw`Multiplying by $e^{-j2\pi\hat{\Delta f}t}$ from an NCO`, String.raw`Convolving with the channel`, String.raw`Increasing gain`], answer: 1, explain: String.raw`Derotation multiplies the samples by the conjugate rotation generated by an NCO derotator.` },
      { q: String.raw`In FLL-assisted-PLL carrier recovery:`, options: [String.raw`The PLL acquires frequency, FLL tracks phase`, String.raw`The FLL acquires frequency, the PLL tracks phase`, String.raw`Both track only amplitude`, String.raw`Neither uses an NCO`], answer: 1, explain: String.raw`The FLL pulls in a large frequency offset; the Costas/PLL then locks the residual phase precisely.` },
      { q: String.raw`OFDM SNR loss from residual CFO grows:`, options: [String.raw`Linearly with $\varepsilon$`, String.raw`With the square of $\varepsilon$ (and with SNR)`, String.raw`Inversely with $\varepsilon$`, String.raw`Independently of $\varepsilon$`], answer: 1, explain: String.raw`$D_{SNR}\approx\frac{10}{3\ln10}(\pi\varepsilon)^2 E_s/N_0$: quadratic in offset and proportional to operating SNR.` },
      { q: String.raw`Doppler shift for a target at 300 m/s at 10 GHz is about:`, options: [String.raw`1 kHz`, String.raw`10 kHz`, String.raw`100 kHz`, String.raw`1 MHz`], answer: 1, explain: String.raw`$\Delta f_D=(v/c)f_c=(300/3\times10^8)\times10^{10}=10^{-6}\times10^{10}=10$ kHz.` }
    ],
    numericals: [
      { q: String.raw`A link at $f_c=2.4$ GHz uses $\pm20$ ppm oscillators at both ends. Find the worst-case CFO.`, solution: String.raw`<p><b>Formula.</b> With each end accurate to $\pm p$ ppm, the worst-case (opposite-drift) offset is $$\Delta f_{max}=2p\times10^{-6}\,f_c,$$ where $p$ is the ppm accuracy and $f_c$ the carrier frequency.</p>
<p><b>Substitute.</b> $$\Delta f_{max}=2\times20\times10^{-6}\times2.4\times10^{9}.$$</p>
<p><b>Compute.</b> $2\times20=40$ ppm total, so $\Delta f_{max}=40\times10^{-6}\times2.4\times10^{9}=96$ kHz.</p>
<p><b>Explanation.</b> The factor of 2 assumes the transmitter and receiver drift in opposite directions, doubling the mismatch. 96 kHz at 2.4 GHz is substantial — far larger than typical subcarrier spacings — which is why front-end CFO correction is mandatory.</p>` },
      { q: String.raw`A satellite moving at 7.5 km/s (radial) transmits at 12 GHz. Find the Doppler CFO.`, solution: String.raw`<p><b>Formula.</b> The Doppler frequency shift for radial velocity $v$ is $$\Delta f_D=\frac{v}{c}\,f_c,$$ where $c=3\times10^{8}$ m/s and $f_c$ is the carrier.</p>
<p><b>Substitute.</b> $$\Delta f_D=\frac{7500}{3\times10^{8}}\times12\times10^{9}.$$</p>
<p><b>Compute.</b> $v/c=7500/3\times10^{8}=2.5\times10^{-5}$, so $\Delta f_D=2.5\times10^{-5}\times12\times10^{9}=300$ kHz.</p>
<p><b>Explanation.</b> A LEO satellite's high orbital speed produces hundreds of kHz of Doppler at Ku-band — often dominating oscillator mismatch and demanding a wide-pull-in FLL before phase tracking. Doubling either the velocity or the carrier doubles the shift.</p>` },
      { q: String.raw`An OFDM system has subcarrier spacing 15 kHz. If the CFO is 3 kHz, find $\varepsilon$.`, solution: String.raw`<p><b>Formula.</b> The normalised CFO is the offset measured in subcarrier spacings: $$\varepsilon=\frac{\Delta f}{\Delta f_{sc}},$$ with $\Delta f$ the physical offset and $\Delta f_{sc}$ the subcarrier spacing.</p>
<p><b>Substitute.</b> $$\varepsilon=\frac{3\,000}{15\,000}.$$</p>
<p><b>Compute.</b> $\varepsilon=0.2$.</p>
<p><b>Explanation.</b> Since $|\varepsilon|=0.2<0.5$, the offset is entirely fractional — no integer subcarrier shift, but it does misalign each subcarrier from its bin, causing ICI and a common phase error. At 20% of the spacing this is well above the few-percent budget standards allow, so it must be corrected.</p>` },
      { q: String.raw`A BPSK symbol rate is 1 Msym/s and the CFO is 5 kHz. Find the per-symbol phase rotation.`, solution: String.raw`<p><b>Formula.</b> The constellation rotates by $$\Delta\phi=2\pi\Delta f\,T_s,\qquad T_s=\frac{1}{R_s},$$ where $\Delta f$ is the CFO, $T_s$ the symbol period, and $R_s$ the symbol rate.</p>
<p><b>Substitute.</b> $$T_s=\frac{1}{10^{6}}=1\ \mu\text{s},\qquad \Delta\phi=2\pi(5000)(10^{-6}).$$</p>
<p><b>Compute.</b> $\Delta\phi=2\pi\times0.005=0.0314$ rad $=1.8^{\circ}$ per symbol.</p>
<p><b>Explanation.</b> Only 1.8° per symbol seems tiny, but it accumulates: after 50 symbols the constellation has spun 90° into the wrong decision region. That cumulative drift is why even a small CFO must be tracked and derotated, not ignored.</p>` },
      { q: String.raw`A CFO estimator correlates samples separated by $D=64$ at $f_s=1/T_s=10$ MHz. Find the unambiguous CFO range.`, solution: String.raw`<p><b>Formula.</b> The autocorrelation estimator's arg wraps at $\pm\pi$, so the unambiguous range is $$|\Delta f|<\frac{1}{2D T_s}=\frac{f_s}{2D},$$ with $D$ the correlation lag (samples), $T_s=1/f_s$ the sample period.</p>
<p><b>Substitute.</b> $$|\Delta f|<\frac{10^{7}}{2\times64}.$$</p>
<p><b>Compute.</b> $|\Delta f|<10^{7}/128\approx78.1$ kHz.</p>
<p><b>Explanation.</b> Offsets beyond $\pm78.1$ kHz rotate more than half a cycle over the $D$-sample lag and alias (wrap). A larger lag $D$ would give finer resolution but shrink this pull-in range — the fundamental resolution-vs-range trade of autocorrelation CFO estimation.</p>` },
      { q: String.raw`OFDM with $T_u=66.7\,\mu s$ (15 kHz spacing). A residual $\varepsilon=0.02$ remains. Estimate the SNR loss at $E_s/N_0=25$ dB.`, solution: String.raw`<p><b>Formula.</b> The OFDM SNR degradation from a small residual normalised offset is $$D_{SNR}\approx\frac{10}{3\ln10}(\pi\varepsilon)^2\,\frac{E_s}{N_0}\ \text{(dB)},$$ where $\varepsilon$ is the normalised CFO and $E_s/N_0$ the operating SNR (linear).</p>
<p><b>Substitute.</b> Convert $25$ dB: $E_s/N_0=10^{2.5}\approx316$. $$D_{SNR}\approx\frac{10}{3\ln10}(\pi\times0.02)^2\times316.$$</p>
<p><b>Compute.</b> $3\ln10=6.908$, $\pi\times0.02=0.0628$, $(0.0628)^2=3.95\times10^{-3}$. So $D_{SNR}\approx(10/6.908)\times3.95\times10^{-3}\times316=1.448\times3.95\times10^{-3}\times316\approx1.81$ dB.</p>
<p><b>Explanation.</b> A mere 2% residual offset costs ~1.8 dB at 25 dB SNR — and the loss scales with $E_s/N_0$, so high-order QAM (which needs high SNR) is far more CFO-sensitive than QPSK. This is why 256-QAM demands an order-of-magnitude tighter $\varepsilon$ than QPSK.</p>` },
      { q: String.raw`Schmidl-Cox uses two identical halves each of length $L=128$ samples at $f_s=20$ MHz. What CFO makes the inter-half phase exactly $\pi$ (the ambiguity edge)?`, solution: String.raw`<p><b>Formula.</b> The two halves are separated by $D=L$ samples; the inter-half phase is $\angle=2\pi\Delta f\,D T_s$, which reaches the wrap edge at $\angle=\pi$: $$\Delta f_{edge}=\frac{1}{2D T_s}=\frac{f_s}{2L},$$ with $L$ the half-length and $T_s=1/f_s$.</p>
<p><b>Substitute.</b> $$\Delta f_{edge}=\frac{20\times10^{6}}{2\times128}.$$</p>
<p><b>Compute.</b> $\Delta f_{edge}=20\times10^{6}/256\approx78.1$ kHz.</p>
<p><b>Explanation.</b> At $\pm78.1$ kHz the phase between the identical halves is exactly half a cycle; beyond it the estimate wraps and aliases. Longer halves (bigger $L$) give a finer, lower-noise estimate but shrink this unambiguous acquisition range — the same trade as the generic autocorrelation estimator.</p>` }
    ],
    realWorld: String.raw`<p>Every practical receiver corrects CFO before demodulating. Wi-Fi (802.11a/g/n/ac) uses the two identical short/long training halves for Schmidl-Cox-style coarse and fine CFO estimation; LTE and 5G NR use primary/secondary synchronisation signals plus the cyclic prefix. In LEO satellite and aeronautical links Doppler dominates and can reach hundreds of kHz, demanding a wide-pull-in FLL before the tracking PLL. GNSS receivers must sweep and acquire large Doppler-plus-clock offsets during cold start. In an <a href="#sdr">SDR</a> the whole chain is digital: a preamble/CP estimator produces $\hat{\Delta f}$, an <a href="#nco">NCO</a> derotator removes the bulk offset, and an <a href="#fll">FLL</a>-assisted <a href="#costas-loop">Costas loop</a> tracks the residual — the exact reverse of how a <a href="#vco">VCO</a>/NCO <i>creates</i> a controlled frequency. Because OFDM's throughput collapses with even a few percent of normalised offset, CFO synchronisation is one of the most performance-critical blocks in modern broadband radios.</p>`,
    related: ['fll', 'costas-loop', 'nco', 'pll', 'evm']
  },
  {
    id: 'dll',
    title: 'Delay-Locked Loop (DLL)',
    category: 'Synchronization',
    tags: ['DLL', 'delay line', 'clock deskew', 'multiphase clock', 'jitter', 'FPGA'],
    summary: String.raw`A clock DLL aligns an output clock edge to a reference by adjusting a voltage-controlled delay line rather than an oscillator, giving a first-order, unconditionally stable loop with no jitter accumulation.`,
    diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 530 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-dll" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="8" y="52" fill="#e6edf3">ref clk</text>
        <line x1="52" y1="48" x2="98" y2="48" stroke="#9aa7b5" marker-end="url(#arr-dll)"/>
        <rect x="100" y="26" width="176" height="46" rx="6" fill="#1c232e" stroke="#4dabf7"/>
        <text x="188" y="46" fill="#e6edf3" text-anchor="middle">voltage-ctrl delay line</text>
        <text x="188" y="63" fill="#9aa7b5" text-anchor="middle">t<tspan baseline-shift="sub" font-size="9">d</tspan> = t<tspan baseline-shift="sub" font-size="9">d0</tspan> + K<tspan baseline-shift="sub" font-size="9">DL</tspan>·V</text>
        <line x1="276" y1="48" x2="330" y2="48" stroke="#63e6be" marker-end="url(#arr-dll)"/>
        <text x="360" y="52" fill="#63e6be">output clk</text>
        <rect x="300" y="90" width="150" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/>
        <text x="375" y="110" fill="#e6edf3" text-anchor="middle">phase detector</text>
        <text x="375" y="126" fill="#9aa7b5" text-anchor="middle">compares edges</text>
        <rect x="96" y="90" width="150" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/>
        <text x="171" y="110" fill="#e6edf3" text-anchor="middle">loop filter</text>
        <text x="171" y="126" fill="#9aa7b5" text-anchor="middle">charge pump + C</text>
        <line x1="303" y1="90" x2="315" y2="66" stroke="#ffa94d" marker-end="url(#arr-dll)"/>
        <line x1="300" y1="112" x2="246" y2="112" stroke="#9aa7b5" marker-end="url(#arr-dll)"/>
        <line x1="171" y1="90" x2="171" y2="72" stroke="#b197fc" marker-end="url(#arr-dll)"/>
        <text x="200" y="106" fill="#9aa7b5" font-size="10" text-anchor="middle">up/dn</text>
        <text x="150" y="83" fill="#9aa7b5" font-size="10">V (delay ctrl)</text>
        <text x="265" y="176" fill="#ffa94d" text-anchor="middle">first-order loop: delay line = pure gain (no VCO / no 1/s)</text>
      </svg>`,
      caption: String.raw`A phase detector compares ref and delayed edges; a loop filter tunes a voltage-controlled delay line (t_d = t_d0 + K_DL·V) — a first-order loop, no VCO.`
    },
    {
      title: String.raw`De-skew / DDR strobe alignment application`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-dll" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">DLL de-skews a clock / centers a DDR strobe</text>
        <text x="10" y="70" fill="#9aa7b5" font-size="10">clock in</text>
        <line x1="10" y1="80" x2="60" y2="80" stroke="#9aa7b5" marker-end="url(#arr2-dll)"/>
        <rect x="60" y="60" width="120" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="120" y="78" fill="#e6edf3" text-anchor="middle">clock tree</text><text x="120" y="92" fill="#9aa7b5" font-size="8" text-anchor="middle">insertion delay</text>
        <rect x="210" y="60" width="120" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="270" y="78" fill="#e6edf3" text-anchor="middle">DLL</text><text x="270" y="92" fill="#9aa7b5" font-size="8" text-anchor="middle">add delay → total nT</text>
        <rect x="360" y="60" width="130" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="425" y="78" fill="#e6edf3" text-anchor="middle">aligned strobe</text><text x="425" y="92" fill="#9aa7b5" font-size="8" text-anchor="middle">edge = ref edge</text>
        <line x1="180" y1="80" x2="210" y2="80" stroke="#9aa7b5" marker-end="url(#arr2-dll)"/>
        <line x1="330" y1="80" x2="360" y2="80" stroke="#63e6be" marker-end="url(#arr2-dll)"/>
        <text x="80" y="140" fill="#ff6b6b" font-size="10">skewed edge ⌐‾|__</text>
        <text x="300" y="140" fill="#63e6be" font-size="10">re-aligned edge ⌐‾|__</text>
        <line x1="150" y1="150" x2="150" y2="185" stroke="#ff6b6b" stroke-dasharray="3 3"/>
        <line x1="360" y1="150" x2="360" y2="185" stroke="#63e6be" stroke-dasharray="3 3"/>
        <text x="270" y="195" fill="#9aa7b5" font-size="9" text-anchor="middle">DDR: a 90° DLL shift centers DQS in the data eye for setup/hold margin</text>
      </svg>`,
      caption: String.raw`De-skew use: a clock arrives delayed by its distribution tree; the DLL adds just enough delay to make the total an integer number of periods, so the internal edge re-aligns with the incoming reference (zero effective skew). In DDR, a 90° DLL shift centers the DQS strobe in the data eye.`
    },
    {
      title: String.raw`Multiphase clock generation from delay taps`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-dll" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Locked delay line = one period → equally spaced phase taps</text>
        <line x1="14" y1="70" x2="40" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-dll)"/><text x="10" y="62" fill="#9aa7b5" font-size="9">clk</text>
        <rect x="40" y="52" width="70" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="75" y="74" fill="#e6edf3" text-anchor="middle">Δt</text>
        <rect x="130" y="52" width="70" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="165" y="74" fill="#e6edf3" text-anchor="middle">Δt</text>
        <rect x="220" y="52" width="70" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="255" y="74" fill="#e6edf3" text-anchor="middle">Δt</text>
        <rect x="310" y="52" width="70" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="345" y="74" fill="#e6edf3" text-anchor="middle">Δt</text>
        <line x1="110" y1="70" x2="130" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-dll)"/>
        <line x1="200" y1="70" x2="220" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-dll)"/>
        <line x1="290" y1="70" x2="310" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-dll)"/>
        <line x1="380" y1="70" x2="410" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-dll)"/><text x="420" y="74" fill="#b197fc" font-size="9">→ PD (lock=T)</text>
        <line x1="40" y1="88" x2="40" y2="120" stroke="#63e6be"/><text x="40" y="135" fill="#63e6be" font-size="10" text-anchor="middle">0°</text>
        <line x1="130" y1="88" x2="130" y2="120" stroke="#63e6be"/><text x="130" y="135" fill="#63e6be" font-size="10" text-anchor="middle">90°</text>
        <line x1="220" y1="88" x2="220" y2="120" stroke="#63e6be"/><text x="220" y="135" fill="#63e6be" font-size="10" text-anchor="middle">180°</text>
        <line x1="310" y1="88" x2="310" y2="120" stroke="#63e6be"/><text x="310" y="135" fill="#63e6be" font-size="10" text-anchor="middle">270°</text>
        <text x="270" y="165" fill="#b197fc" font-size="11" text-anchor="middle">φ<tspan baseline-shift="sub" font-size="9">k</tspan> = k·360°/M   (M=4 → 0/90/180/270°)</text>
        <text x="270" y="185" fill="#9aa7b5" font-size="10" text-anchor="middle">whole line forced to exactly T, so taps are precise and self-calibrating</text>
      </svg>`,
      caption: String.raw`Multiphase generation: because the loop forces the whole delay line to span exactly one period T, tapping between the M equal stages yields phases φk = k·360°/M — e.g. 0/90/180/270° for M=4. These self-calibrating quadrature clocks drive interleaved ADCs, SerDes, and phase interpolators.`
    }
    ],
    prerequisites: ['pll', 'vco', 'nco'],
    intro: String.raw`<p><b>Why does the DLL exist?</b> Often you already have a clean clock at exactly the right frequency and need only to fix its <i>timing</i> — de-skew it against a distribution network, center a strobe in a data eye, or produce several evenly spaced phases. A PLL could do this, but its VCO integrates noise (jitter accumulates) and its second-order dynamics can ring and need careful damping. The DLL exists to solve the timing-alignment problem without an oscillator: by tuning a delay line instead, it becomes a first-order, unconditionally stable loop that adds no accumulating jitter. When frequency synthesis is not required, that makes the DLL the cleaner, simpler, safer choice — which is why on-chip clocking leans on it so heavily.</p>
<p>A <b>Delay-Locked Loop (DLL)</b> aligns the phase of an output clock to a reference clock by controlling a <b>voltage-controlled delay line (VCDL)</b> — a chain of buffers whose total delay is tuned — instead of a <a href="#vco">VCO</a>. A phase detector compares the reference edge to the delayed output edge and steers the delay so the two align (typically to one full clock period, i.e. zero effective skew). Because a delay line contributes a <b>pure gain</b> in the phase domain (no $1/s$ integrator like a VCO), the DLL is a <b>first-order</b> loop: unconditionally stable, no ringing, and — crucially — it does <b>not accumulate jitter</b>, since each reference edge freshly re-times the output. DLLs are the workhorse for clock <b>de-skew</b>, precise <b>phase alignment</b>, and <b>multiphase clock generation</b> inside FPGAs, DDR memory interfaces, and SoCs. This topic focuses on the clock/delay-line DLL; the code-tracking early-late DLL used in spread-spectrum receivers is covered separately in <a href="#early-late-correlator">early-late correlator</a>.</p>`,
    sections: [
      {
        h: 'Architecture: phase detector, charge pump, delay line',
        html: String.raw`<p>A basic DLL has three blocks in a feedback loop:</p>
        <ul>
          <li><b>Phase detector (PD):</b> compares the reference clock edge with the output (delayed) edge and produces an up/down signal proportional to their misalignment.</li>
          <li><b>Charge pump + loop filter (capacitor):</b> integrates the PD output into a control voltage $V_{ctrl}$. Note: the <i>loop</i> still contains one integrator here (in the filter), but the <i>delay line</i> does not — that is the key distinction from a PLL.</li>
          <li><b>Voltage-controlled delay line (VCDL):</b> a chain of buffer stages whose per-stage delay depends on $V_{ctrl}$; total delay $t_d=t_{d0}+K_{DL}V_{ctrl}$.</li>
        </ul>
        <p>The reference clock enters the delay line; the delayed clock is fed back to the PD. The loop drives $V_{ctrl}$ until the delayed edge lines up with the reference edge one cycle later — i.e. the delay line spans exactly one clock period $T$. At lock the output clock has the same frequency as the input but a controlled, de-skewed phase.</p>
        <div class="callout"><b>Core idea:</b> a PLL creates a clock (a VCO generates cycles); a DLL delays an existing clock. There is no oscillator, so there is nothing to accumulate error — each incoming edge resets the timing.</div>`
      },
      {
        h: 'Why the delay line is a gain, not an integrator',
        html: String.raw`<p>This is the conceptual heart of the DLL. In a VCO, output phase is the <i>integral</i> of the control voltage (frequency = derivative of phase), giving $\Phi/V=2\pi K_{vco}/s$ — a $1/s$ integrator. In a delay line, the control voltage sets a <b>delay</b> $t_d$, and the phase shift it imposes on a clock of angular frequency $\omega$ is simply</p>
        <p>$$\phi_{out}=-\omega\,t_d=-\omega\,(t_{d0}+K_{DL}V_{ctrl}).$$</p>
        <p>Phase is a <i>direct, memoryless</i> function of $V_{ctrl}$ — a pure <b>gain</b> $K_{DL}$, no $1/s$. Consequences:</p>
        <ul>
          <li><b>Loop order:</b> the only integrator left in the loop is the charge-pump capacitor, so the open loop has a single pole — the DLL is <b>first-order</b>. A charge-pump PLL, by contrast, has the VCO's $1/s$ <i>plus</i> the filter's $1/s$ = second-order (two poles), and can ring or go unstable.</li>
          <li><b>Stability:</b> a first-order loop with a single pole is <b>unconditionally stable</b> — no damping factor to tune, no peaking, no overshoot in the classic sense.</li>
          <li><b>No jitter accumulation:</b> a VCO integrates its own noise (random walk), so PLL output jitter accumulates over many cycles; a delay line does not integrate — reference jitter passes through but the DLL's own contribution does not build up cycle-to-cycle.</li>
        </ul>`
      },
      {
        h: 'DLL vs PLL: a systematic comparison',
        html: String.raw`<p>Both align phase, but their mechanisms and trade-offs differ fundamentally.</p>
        <table class="data">
          <tr><th>Property</th><th>DLL (clock)</th><th>PLL</th></tr>
          <tr><td>Controlled element</td><td>Voltage-controlled delay line (VCDL)</td><td>Voltage-controlled oscillator (VCO)</td></tr>
          <tr><td>Phase transfer of element</td><td>Pure gain $K_{DL}$ (no $1/s$)</td><td>Integrator $2\pi K_{vco}/s$</td></tr>
          <tr><td>Loop order</td><td>First-order (single pole)</td><td>Second-order (two poles) typical</td></tr>
          <tr><td>Stability</td><td>Unconditionally stable</td><td>Needs damping; can ring/peak</td></tr>
          <tr><td>Jitter</td><td>No accumulation; lower jitter</td><td>VCO jitter accumulates</td></tr>
          <tr><td>Frequency multiplication</td><td>No (basic DLL)</td><td>Yes ($f_{out}=Nf_{ref}$)</td></tr>
          <tr><td>Input clock required</td><td>Yes (delays an existing clock)</td><td>Can generate frequency from reference</td></tr>
          <tr><td>Delay/frequency range</td><td>Limited by delay-line span</td><td>Wide (VCO tuning range)</td></tr>
          <tr><td>Typical use</td><td>De-skew, phase align, multiphase</td><td>Frequency synthesis, clock gen</td></tr>
        </table>
        <p>The headline: choose a <b>DLL</b> when you already have a clean clock at the right frequency and need <b>low-jitter phase alignment</b> or multiple phases; choose a <b>PLL</b> when you need to <b>synthesize or multiply</b> a frequency. Many SoCs use both — a PLL to make the clock, DLLs to distribute and de-skew it.</p>`
      },
      {
        h: 'Applications: de-skew, phase alignment, multiphase clocks',
        html: String.raw`<p>DLLs excel where a clock exists and only its <i>timing</i> must be manipulated:</p>
        <ul>
          <li><b>Clock de-skew:</b> a clock arriving at a chip is delayed by its distribution network; a DLL adds delay to make the total exactly one (or an integer number of) period(s), so the internal clock edge aligns with the incoming edge — zero effective skew. This is the classic FPGA DCM/MMCM/clock-manager function.</li>
          <li><b>Precise phase alignment:</b> DDR memory interfaces use DLLs to center the data-strobe (DQS) in the data eye — a 90 degree shift for read/write alignment — improving setup/hold margins.</li>
          <li><b>Multiphase clock generation:</b> tapping the delay line at equally spaced points yields multiple clock phases (e.g. 0, 90, 180, 270 degrees). Because the total line is locked to one period $T$, a tap at fraction $k/M$ of the line gives a phase of exactly $k\cdot360/M$ degrees — used to clock interleaved ADCs, SerDes, and phase interpolators.</li>
        </ul>
        <p>In all three the DLL's stability and low jitter are decisive: interleaved converters and high-speed I/O are exquisitely sensitive to phase error, and a DLL delivers precise, non-accumulating alignment.</p>`
      },
      {
        h: 'Limitations: finite delay range and harmonic (false) lock',
        html: String.raw`<p>The DLL's simplicity comes with constraints:</p>
        <ul>
          <li><b>Limited delay range:</b> the VCDL can only span a bounded delay $[t_{d,min}, t_{d,max}]$. If one clock period $T$ falls outside this window the loop cannot lock — so a given DLL works only over a limited frequency band, and the delay line must be sized for the target period.</li>
          <li><b>Harmonic / false lock:</b> a simple phase detector cannot tell whether the delay line spans one period, two periods, or zero. If it locks to the wrong multiple ($t_d=nT$) or, worse, tries to drive the delay to zero or beyond its range, the DLL <b>false-locks</b> or "stacks/collapses." Mitigations: a start-up/initialization circuit that biases the delay to a safe mid-range, plus a frequency/harmonic-lock detector.</li>
          <li><b>No frequency change:</b> a basic DLL cannot multiply or divide frequency (output = input frequency). Frequency-multiplying DLLs exist (edge-combining multiple delayed phases) but add complexity.</li>
          <li><b>Static phase error:</b> charge-pump mismatch and PD offset leave a residual phase error; careful PD/charge-pump design minimizes it.</li>
        </ul>
        <p>Despite these, the DLL's unconditional stability and lack of jitter accumulation make it the preferred choice for on-chip clock timing whenever frequency synthesis is not required.</p>`
      },
      {
        h: 'Loop dynamics and the code-tracking cousin',
        html: String.raw`<p>Modeling the first-order loop: with PD gain $K_{PD}$, charge-pump/filter transfer $I_{cp}/(sC)$, and delay-line gain $K_{DL}$ (phase per volt), the open-loop gain is</p>
        <p>$$G(s)=\frac{K_{PD}\,I_{cp}\,K_{DL}}{sC},$$</p>
        <p>a single pole at the origin. The closed-loop response is a clean first-order low-pass with bandwidth $\omega_n=K_{PD}I_{cp}K_{DL}/C$ and <b>no</b> second-order damping term — hence no peaking and no stability condition to satisfy. Contrast the second-order PLL, whose damping $\zeta$ must be designed to avoid ringing.</p>
        <p><b>The code-tracking DLL:</b> in <a href="#dsss">DSSS</a>/<a href="#frequency-hopping">GNSS</a> receivers, an "early-late" DLL tracks the timing of a spreading code rather than a clock edge. It correlates the received signal with early and late replicas of the <a href="#pn-codes">PN code</a> and drives the code phase to center the correlation peak. Though it shares the "delay-locked" name and the feedback structure, it operates on code phase, not a buffer chain — see <a href="#early-late-correlator">early-late correlator</a> for that variant.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The core mechanism:</b> a DLL tunes a voltage-controlled delay line (not an oscillator) so the output edge aligns with the reference; at lock the line spans exactly one period, $t_d=T$, so $f_{out}=f_{in}$.</li>
<li><b>Why it is first-order:</b> the delay line is a pure gain ($\phi=-\omega t_d$, no $1/s$), so the loop's only integrator is the charge-pump capacitor — a single-pole, unconditionally stable loop with no damping to tune and no jitter accumulation.</li>
<li><b>DLL vs PLL:</b> delay line vs VCO, first- vs second-order, no frequency multiplication in a basic DLL but lower jitter — choose a DLL for phase alignment of an existing clock, a PLL for frequency synthesis.</li>
<li><b>The applications:</b> clock de-skew, DDR DQS centering (a 90° shift), and multiphase generation where a tap at fraction $k/M$ gives $\phi_k=k\cdot360^\circ/M$.</li>
<li><b>The limitations:</b> finite delay range (band-limited operation) and harmonic/false lock at $nT$, mitigated by start-up biasing and lock detectors — plus the distinct early-late code-tracking DLL cousin.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Delay-locked_loop" target="_blank" rel="noopener">Wikipedia — Delay-locked loop</a> — canonical overview of the delay-line-vs-VCO distinction, why a DLL is first-order and unconditionally stable, and DRAM/de-skew applications.</li>
<li><a href="https://resources.pcb.cadence.com/blog/2020-pll-vs-dll-for-clock-synchronization-and-skew-compensation" target="_blank" rel="noopener">Cadence — PLL vs. DLL for Clock Synchronization and Skew Compensation</a> — practical comparison of when to choose a DLL (deskew, low jitter) versus a PLL (frequency synthesis).</li>
<li><a href="https://web.stanford.edu/class/archive/ee/ee371/ee371.1066/lectures/Old/Older/lect_15_1up.pdf" target="_blank" rel="noopener">Stanford EE371 Lecture 15 — Clock Recovery (DLL/PLL)</a> — VLSI-course lecture notes analyzing the delay line, charge-pump loop dynamics, and jitter-accumulation differences.</li>
<li><a href="https://www2.eecs.berkeley.edu/Pubs/TechRpts/2025/Archive/EECS-2025-86.pdf" target="_blank" rel="noopener">UC Berkeley EECS — Delay-Locked Loops for Multiphase Clock Generation</a> — a full technical report on multiphase DLL design, tap generation, and duty-cycle correction.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`A clock DLL aligns an output clock edge to a reference by tuning a voltage-controlled delay line (VCDL), not an oscillator.`,
      String.raw`Delay line phase transfer is a pure gain ($\phi=-\omega t_d$, $t_d=t_{d0}+K_{DL}V$) — no $1/s$ integrator like a VCO.`,
      String.raw`The only loop integrator is the charge-pump capacitor, so a DLL is first-order (single pole) and unconditionally stable — no damping to tune, no ringing.`,
      String.raw`A DLL does not accumulate jitter: each reference edge re-times the output, unlike a VCO which integrates its own noise (random walk).`,
      String.raw`DLL vs PLL: delay line vs VCO; first- vs second-order; no frequency multiplication in a basic DLL; generally lower jitter.`,
      String.raw`At lock the delay line spans exactly one clock period $T$, so output frequency equals input frequency with de-skewed phase.`,
      String.raw`Applications: clock de-skew (FPGA clock managers), phase alignment (DDR DQS centering), multiphase clock generation (interleaved ADC/SerDes).`,
      String.raw`Tapping the locked delay line at fraction $k/M$ gives a phase of exactly $k\cdot360/M$ degrees — precise multiphase clocks.`,
      String.raw`Limitations: finite delay range (works over a limited frequency band) and harmonic/false lock (may lock to $nT$ or collapse) — mitigated by start-up biasing and lock detectors.`,
      String.raw`The early-late code-tracking DLL (DSSS/GNSS) shares the name and feedback idea but tracks PN-code phase, not a buffer chain — see early-late correlator.`
    ],
    equations: [
      {
        title: 'Delay-line phase response (pure gain)',
        tex: String.raw`$$\phi_{out}=-\omega\,t_d=-\omega\,(t_{d0}+K_{DL}V_{ctrl})$$`,
        derivation: String.raw`<p><b>Where we start.</b> A delay line shifts a signal in time. We ask what phase that time shift imposes on a clock, and how it depends on the control voltage.</p>
        <p><b>Step 1 — a pure delay is a phase shift.</b> Delaying $\cos(\omega t)$ by $t_d$ gives $\cos\!\big(\omega(t-t_d)\big)=\cos(\omega t-\omega t_d)$. The phase shift is $\phi=-\omega t_d$ — proportional to both frequency and delay.</p>
        <p><b>Step 2 — control-voltage dependence of the delay.</b> The VCDL's total delay is tuned by $V_{ctrl}$; linearising, $t_d=t_{d0}+K_{DL}V_{ctrl}$ where $K_{DL}$ (s/V) is the delay gain.</p>
        <p><b>Step 3 — combine.</b></p>
        $$\phi_{out}=-\omega\,t_d=-\omega\,(t_{d0}+K_{DL}V_{ctrl}).$$
        <p><b>Result / the crucial observation.</b> $$\phi_{out}=-\omega(t_{d0}+K_{DL}V_{ctrl}).$$ Phase is a <i>direct algebraic</i> function of $V_{ctrl}$ — there is <b>no integral</b>, no $1/s$. This is the defining contrast with a VCO ($\Phi/V=2\pi K_{vco}/s$) and the reason the DLL is first-order and unconditionally stable.</p>`
      },
      {
        title: 'Lock condition (delay spans one period)',
        tex: String.raw`$$t_d = T \;\Rightarrow\; f_{out}=f_{in}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The phase detector compares the reference edge with the edge that has passed through the delay line. The loop moves the delay until these coincide.</p>
        <p><b>Step 1 — alignment condition.</b> The delayed edge must line up with the <i>next</i> reference edge. Reference edges are spaced by the clock period $T=1/f_{in}$. The loop nulls the phase error when the delay equals one full period:</p>
        $$t_d=T\qquad(\text{or an integer }nT).$$
        <p><b>Step 2 — frequency is unchanged.</b> A delay line only shifts edges in time; it neither creates nor removes cycles. So the output clock has the same period as the input:</p>
        $$f_{out}=1/T=f_{in}.$$
        <p><b>Result.</b> $$t_d=T\Rightarrow f_{out}=f_{in}.$$ Sanity check: the DLL cannot multiply frequency (a basic one), confirming the DLL-vs-PLL table. The requirement $t_d=T$ also exposes the range limit: if $T$ lies outside the achievable $[t_{d,min},t_{d,max}]$, the loop cannot lock — and it may false-lock to $nT$.</p>`
      },
      {
        title: 'DLL open-loop gain (first-order)',
        tex: String.raw`$$G(s)=\frac{K_{PD}\,I_{cp}\,K_{DL}}{sC}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We assemble the loop gain block by block, then observe how many poles it has compared with a PLL.</p>
        <p><b>Step 1 — phase detector.</b> Produces current/voltage proportional to phase error: gain $K_{PD}$.</p>
        <p><b>Step 2 — charge pump and filter capacitor.</b> The charge pump sources current $I_{cp}$ onto a capacitor $C$; the resulting control voltage is the integral $V_{ctrl}(s)=I_{cp}/(sC)\cdot(\text{PD output})$. This is the loop's single integrator (one pole at $s=0$).</p>
        <p><b>Step 3 — delay line.</b> Converts control voltage to output phase with pure gain $K_{DL}$ (no $1/s$, from the first derivation).</p>
        <p><b>Step 4 — multiply around the loop.</b></p>
        $$G(s)=K_{PD}\cdot\frac{I_{cp}}{sC}\cdot K_{DL}=\frac{K_{PD}I_{cp}K_{DL}}{sC}.$$
        <p><b>Result.</b> $$G(s)=\frac{K_{PD}I_{cp}K_{DL}}{sC}.$$ Sanity check: exactly <b>one</b> pole (at the origin) $\Rightarrow$ first-order loop, closed-loop bandwidth $\omega_n=K_{PD}I_{cp}K_{DL}/C$, unconditionally stable, no damping term. Compare the charge-pump PLL, whose extra VCO $1/s$ makes it second-order with a damping factor $\zeta$ that must be designed to avoid peaking.</p>`
      },
      {
        title: 'Multiphase tap phase',
        tex: String.raw`$$\phi_k = k\cdot\frac{360^\circ}{M}\quad(k=0,1,\dots,M-1)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Once the DLL is locked, the delay line spans exactly one period. We tap it at equally spaced points to make multiple clock phases.</p>
        <p><b>Step 1 — total delay equals one period.</b> At lock, the whole line delays by $T$ (one full $360^\circ$).</p>
        <p><b>Step 2 — equal taps.</b> If the line has $M$ equal segments, each contributes $T/M$ of delay, i.e. a phase step of $360^\circ/M$.</p>
        <p><b>Step 3 — the $k$-th tap.</b> The output at tap $k$ is delayed by $kT/M$, a phase of</p>
        $$\phi_k=\frac{kT/M}{T}\times360^\circ=k\cdot\frac{360^\circ}{M}.$$
        <p><b>Result.</b> $$\phi_k=k\cdot\frac{360^\circ}{M}.$$ Sanity check: $M=4$ gives phases $0^\circ,90^\circ,180^\circ,270^\circ$ — the standard quadrature clocks for interleaved ADCs and SerDes. Because the loop <i>forces</i> the whole line to exactly $T$, these phases are precise and self-calibrating against process/temperature drift.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does a clock DLL control instead of an oscillator?`, back: String.raw`A voltage-controlled delay line (VCDL) — a tunable chain of buffer stages that delays an existing clock.` },
      { front: String.raw`Why is a DLL first-order while a PLL is second-order?`, back: String.raw`The delay line is a pure gain (no $1/s$); the loop's only integrator is the charge-pump capacitor. A PLL adds the VCO's $1/s$, making two poles.` },
      { front: String.raw`Is a basic DLL unconditionally stable?`, back: String.raw`Yes — a single-pole (first-order) loop has no damping factor to tune and cannot ring or become unstable.` },
      { front: String.raw`Why does a DLL not accumulate jitter?`, back: String.raw`It has no oscillator to integrate its own noise; each reference edge freshly re-times the output, so DLL jitter does not build up cycle-to-cycle.` },
      { front: String.raw`What is the lock condition of a clock DLL?`, back: String.raw`The delay line spans exactly one clock period ($t_d=T$, or $nT$), so the output edge aligns with the reference and $f_{out}=f_{in}$.` },
      { front: String.raw`Can a basic DLL multiply frequency?`, back: String.raw`No — a delay line only shifts edges, so $f_{out}=f_{in}$. Frequency multiplication is a PLL capability (edge-combining DLLs are a special exception).` },
      { front: String.raw`Name three DLL applications.`, back: String.raw`Clock de-skew (FPGA clock managers), phase alignment (DDR DQS centering), and multiphase clock generation (interleaved ADC/SerDes).` },
      { front: String.raw`What phase does the $k$-th tap of an $M$-tap locked delay line give?`, back: String.raw`$\phi_k=k\cdot360^\circ/M$; e.g. $M=4$ gives $0/90/180/270^\circ$.` },
      { front: String.raw`What is harmonic (false) lock in a DLL?`, back: String.raw`Locking to the wrong multiple of the period ($nT$) or collapsing the delay, because a simple PD can't distinguish periods; mitigated by start-up biasing and lock detectors.` },
      { front: String.raw`What limits the frequency range of a DLL?`, back: String.raw`The finite span of the delay line: it can only lock if one period $T$ lies within $[t_{d,min},t_{d,max}]$.` },
      { front: String.raw`Phase shift a delay $t_d$ imposes on a clock of frequency $\omega$?`, back: String.raw`$\phi=-\omega t_d$ — proportional to both frequency and delay.` },
      { front: String.raw`When choose a DLL over a PLL?`, back: String.raw`When a clean clock already exists at the right frequency and you need low-jitter phase alignment or multiphase clocks, not frequency synthesis.` },
      { front: String.raw`How does the code-tracking (early-late) DLL differ from a clock DLL?`, back: String.raw`It tracks the phase of a spreading/PN code by correlating early and late replicas, not the delay of a buffer chain — see early-late correlator.` },
      { front: String.raw`What is the DLL open-loop gain?`, back: String.raw`$G(s)=K_{PD}I_{cp}K_{DL}/(sC)$ — a single pole at the origin (first-order).` }
    ],
    mcqs: [
      { q: String.raw`A clock DLL controls a:`, options: [String.raw`Voltage-controlled oscillator`, String.raw`Voltage-controlled delay line`, String.raw`Numerically-controlled oscillator`, String.raw`Varactor tank`], answer: 1, explain: String.raw`A DLL tunes a delay line (VCDL) to shift an existing clock's phase; a VCO is used by a PLL.` },
      { q: String.raw`In the phase domain, a delay line acts as:`, options: [String.raw`An integrator ($1/s$)`, String.raw`A pure gain`, String.raw`A differentiator`, String.raw`A second-order filter`], answer: 1, explain: String.raw`Phase $=-\omega t_d$ is a direct algebraic function of control voltage — a gain, with no $1/s$.` },
      { q: String.raw`A basic DLL is:`, options: [String.raw`Second-order and conditionally stable`, String.raw`First-order and unconditionally stable`, String.raw`Third-order`, String.raw`Marginally stable only`], answer: 1, explain: String.raw`The delay line adds no pole, so the loop's single integrator (charge-pump cap) makes it first-order and unconditionally stable.` },
      { q: String.raw`Compared with a PLL, a DLL:`, options: [String.raw`Accumulates more jitter`, String.raw`Does not accumulate jitter`, String.raw`Always multiplies frequency`, String.raw`Has a VCO`], answer: 1, explain: String.raw`No oscillator means no integration of self-noise; each reference edge re-times the output, so jitter does not accumulate.` },
      { q: String.raw`At lock, a clock DLL's delay line spans:`, options: [String.raw`Half a period`, String.raw`Exactly one period (or $nT$)`, String.raw`A random delay`, String.raw`Zero delay`], answer: 1, explain: String.raw`The loop nulls phase error when the delay equals one full clock period, aligning output and reference edges.` },
      { q: String.raw`A basic DLL's output frequency is:`, options: [String.raw`$N f_{in}$`, String.raw`$f_{in}/N$`, String.raw`$f_{in}$`, String.raw`$2f_{in}$`], answer: 2, explain: String.raw`A delay line shifts edges but does not add/remove cycles, so $f_{out}=f_{in}$; no multiplication in a basic DLL.` },
      { q: String.raw`Tapping a 4-stage locked delay line gives phases of:`, options: [String.raw`0, 45, 90, 135 degrees`, String.raw`0, 90, 180, 270 degrees`, String.raw`0, 120, 240 degrees`, String.raw`all 0 degrees`], answer: 1, explain: String.raw`$\phi_k=k\cdot360/M=k\cdot90^\circ$ for $M=4$: 0, 90, 180, 270 degrees (quadrature clocks).` },
      { q: String.raw`Harmonic (false) lock in a DLL means it:`, options: [String.raw`Locks to the correct single period`, String.raw`Locks to a wrong multiple of the period or collapses`, String.raw`Doubles the frequency`, String.raw`Cannot be avoided`], answer: 1, explain: String.raw`A simple PD may settle at $nT$ or drive the delay out of range; start-up biasing and lock detectors prevent it.` },
      { q: String.raw`The main range limitation of a DLL is:`, options: [String.raw`Infinite delay`, String.raw`Finite delay-line span`, String.raw`Unlimited frequency`, String.raw`No phase detector`], answer: 1, explain: String.raw`The VCDL delays only within $[t_{d,min},t_{d,max}]$; it locks only if one period fits in that window.` },
      { q: String.raw`DDR memory interfaces use DLLs mainly to:`, options: [String.raw`Multiply the memory clock`, String.raw`Center the data strobe in the data eye (phase align)`, String.raw`Generate a new frequency`, String.raw`Down-convert data`], answer: 1, explain: String.raw`A ~90 degree DLL shift centers DQS in the data window, improving setup/hold margins.` },
      { q: String.raw`The DLL open-loop transfer function is:`, options: [String.raw`$K/s^2$`, String.raw`$K_{PD}I_{cp}K_{DL}/(sC)$`, String.raw`Constant $K$`, String.raw`$K/(s^2+2\zeta\omega_n s+\omega_n^2)$`], answer: 1, explain: String.raw`One pole at the origin from the charge-pump capacitor; the delay line adds only gain — first-order.` },
      { q: String.raw`When would you prefer a PLL over a DLL?`, options: [String.raw`For low-jitter phase alignment of an existing clock`, String.raw`For frequency synthesis / multiplication`, String.raw`For multiphase taps`, String.raw`For clock de-skew only`], answer: 1, explain: String.raw`A PLL's VCO can generate/multiply frequency ($f_{out}=Nf_{ref}$); a basic DLL cannot change frequency.` }
    ],
    numericals: [
      { q: String.raw`A DLL locks a delay line to a 500 MHz clock. What total delay does the line provide at lock?`, solution: String.raw`<p><b>Formula.</b> At lock the delay line spans exactly one clock period: $$t_d=T=\frac{1}{f},$$ where $f$ is the clock frequency.</p>
<p><b>Substitute.</b> $$t_d=\frac{1}{500\times10^{6}}.$$</p>
<p><b>Compute.</b> $t_d=2\times10^{-9}$ s $=2$ ns.</p>
<p><b>Explanation.</b> The loop drives the delay until the delayed edge aligns with the next reference edge, one period later — so the line delays by exactly 2 ns. The output frequency is unchanged (a delay adds no cycles), confirming $f_{out}=f_{in}$.</p>` },
      { q: String.raw`An 8-stage DLL is locked to a 200 MHz clock. Find the per-stage delay and the phase step per tap.`, solution: String.raw`<p><b>Formula.</b> With the line spanning one period $T=1/f$ across $M$ equal stages, the per-stage delay and phase step are $$\frac{T}{M},\qquad \frac{360^\circ}{M}.$$</p>
<p><b>Substitute.</b> $$T=\frac{1}{200\times10^{6}},\qquad \frac{T}{8},\qquad \frac{360^\circ}{8}.$$</p>
<p><b>Compute.</b> $T=5$ ns; per-stage delay $=5/8=0.625$ ns; phase step $=45^\circ$, giving taps at $0,45,90,\dots,315^\circ$.</p>
<p><b>Explanation.</b> Because the loop forces the whole line to exactly one period, the eight taps are precise, evenly spaced $45^\circ$ phases — self-calibrating against process and temperature drift. These are the multiphase clocks used for interleaved converters and SerDes.</p>` },
      { q: String.raw`A VCDL has delay $t_d=t_{d0}+K_{DL}V$ with $t_{d0}=1$ ns and $K_{DL}=0.5$ ns/V. What $V_{ctrl}$ locks it to a 400 MHz clock?`, solution: String.raw`<p><b>Formula.</b> Lock requires $t_d=T=1/f$; inverting the VCDL law $t_d=t_{d0}+K_{DL}V$ gives $$V_{ctrl}=\frac{T-t_{d0}}{K_{DL}},$$ where $t_{d0}$ is the base delay and $K_{DL}$ the delay gain (s/V).</p>
<p><b>Substitute.</b> $$T=\frac{1}{400\times10^{6}}=2.5\text{ ns},\qquad V_{ctrl}=\frac{2.5-1}{0.5}.$$</p>
<p><b>Compute.</b> $V_{ctrl}=(2.5-1)/0.5=1.5/0.5=3$ V.</p>
<p><b>Explanation.</b> The line must add 2.5 ns; with 1 ns base delay it needs 1.5 ns more, and at 0.5 ns/V that is 3 V. The result must fall within the VCDL's voltage range — if the required delay exceeded the line's span the DLL could not lock (or would false-lock to $nT$).</p>` },
      { q: String.raw`A DLL delay line spans 0.8 ns to 3.2 ns. Over what clock-frequency range can it lock (fundamental)?`, solution: String.raw`<p><b>Formula.</b> Fundamental lock needs one period to fit in the achievable delay window, $T\in[t_{d,min},t_{d,max}]$, so the lockable frequency range is $$f=\frac{1}{T}\in\left[\frac{1}{t_{d,max}},\frac{1}{t_{d,min}}\right].$$</p>
<p><b>Substitute.</b> $$f\in\left[\frac{1}{3.2\text{ ns}},\frac{1}{0.8\text{ ns}}\right].$$</p>
<p><b>Compute.</b> $1/3.2\text{ ns}=312.5$ MHz and $1/0.8\text{ ns}=1.25$ GHz, so the range is $312.5$ MHz to $1.25$ GHz.</p>
<p><b>Explanation.</b> The finite delay-line span makes a DLL a band-limited device: too low a frequency needs more delay than the line provides, too high needs less than $t_{d,min}$. Note the shortest delay maps to the highest frequency and vice versa (the inversion flips the interval).</p>` },
      { q: String.raw`A DDR DLL must shift the strobe by 90 degrees at 800 MHz (DDR data rate context). What delay is that?`, solution: String.raw`<p><b>Formula.</b> A phase shift $\theta$ corresponds to a delay that is that fraction of the period: $$t_d=\frac{\theta}{360^\circ}\,T=\frac{\theta}{360^\circ}\cdot\frac{1}{f}.$$</p>
<p><b>Substitute.</b> $$T=\frac{1}{800\times10^{6}}=1.25\text{ ns},\qquad t_d=\frac{90^\circ}{360^\circ}\times1.25\text{ ns}.$$</p>
<p><b>Compute.</b> $90^\circ$ is a quarter period: $t_d=T/4=1.25/4=0.3125$ ns $=312.5$ ps.</p>
<p><b>Explanation.</b> Centering the DQS strobe in the data eye requires a 90° (quarter-period) shift, here 312.5 ps. This maximises setup/hold margin for the read/write capture, which is exactly why DDR controllers embed DLLs.</p>` },
      { q: String.raw`A first-order DLL has $K_{PD}I_{cp}K_{DL}/C=2\pi\times1\times10^6$ rad/s. What is the loop bandwidth?`, solution: String.raw`<p><b>Formula.</b> The DLL open-loop gain is $G(s)=K_{PD}I_{cp}K_{DL}/(sC)$ — a single pole at the origin. For this first-order loop the closed-loop $-3$ dB bandwidth equals the open-loop unity-gain frequency $$\omega_n=\frac{K_{PD}I_{cp}K_{DL}}{C},\qquad f_n=\frac{\omega_n}{2\pi}.$$</p>
<p><b>Substitute.</b> $$\omega_n=2\pi\times1\times10^{6}\ \text{rad/s},\qquad f_n=\frac{2\pi\times10^{6}}{2\pi}.$$</p>
<p><b>Compute.</b> $f_n=1$ MHz.</p>
<p><b>Explanation.</b> With only one pole there is no damping factor and no peaking — the loop is unconditionally stable, unlike a second-order PLL whose $\zeta$ must be tuned to avoid ringing. The 1 MHz bandwidth simply sets how fast the DLL tracks slow drift while rejecting high-frequency jitter.</p>` },
      { q: String.raw`A DLL could false-lock at $t_d=2T$ for a 250 MHz clock. What erroneous delay is that, and why is it a problem?`, solution: String.raw`<p><b>Formula.</b> A harmonic (false) lock occurs when the delay is an integer multiple of the period, $t_d=nT$; here $$T=\frac{1}{f},\qquad t_d=2T.$$</p>
<p><b>Substitute.</b> $$T=\frac{1}{250\times10^{6}}=4\text{ ns},\qquad t_d=2\times4\text{ ns}.$$</p>
<p><b>Compute.</b> $t_d=8$ ns — double the intended 4 ns.</p>
<p><b>Explanation.</b> At $2T$ the delayed and reference edges still coincide (two full periods apart), so a simple phase detector sees zero error and declares lock — but the delay is wrong, corrupting multiphase tap positions and possibly running the line out of its optimal range. Start-up biasing toward a sub-$T$ delay plus a harmonic-lock detector prevent this false lock.</p>` }
    ],
    realWorld: String.raw`<p>DLLs are pervasive in digital and mixed-signal ICs. Xilinx/AMD and Intel/Altera FPGAs provide clock managers (DCM/MMCM/PLL blocks) that use DLL techniques for zero-delay clock de-skew and precise phase shifting; DDR/DDR2/DDR3/DDR4 memory controllers rely on DLLs to center the DQS strobe in the read/write data eye, which is essential for meeting nanosecond-scale setup/hold at multi-gigabit rates. High-speed SerDes and time-interleaved <a href="#adc">ADCs</a> (as in <a href="#rfsoc">RFSoC</a> data converters) use DLL-generated multiphase clocks so that interleaved sampling instants are evenly and stably spaced — timing skew between interleaved paths would otherwise create spurious tones. The DLL's unconditional stability and freedom from jitter accumulation are exactly why designers reach for it instead of a <a href="#pll">PLL</a> when frequency synthesis is not needed. A distinct but related device, the early-late code-tracking DLL, keeps <a href="#dsss">spread-spectrum</a> and GNSS receivers aligned to the incoming <a href="#pn-codes">PN code</a> — covered in <a href="#early-late-correlator">early-late correlator</a>.</p>`,
    related: ['pll', 'vco', 'early-late-correlator', 'nco', 'rfsoc']
  }
);
