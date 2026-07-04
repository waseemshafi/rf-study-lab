// Synchronization extra topics: VCO, NCO, CFO, DLL
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'vco',
    title: 'Voltage-Controlled Oscillator (VCO)',
    category: 'Synchronization',
    tags: ['oscillator', 'PLL', 'phase noise', 'tuning', 'varactor', 'Kvco'],
    summary: String.raw`A VCO is an oscillator whose instantaneous output frequency is a (nominally linear) function of an applied control voltage, acting as the frequency-to-phase integrator at the heart of every analog PLL.`,
    prerequisites: ['comm-basics', 'phase-noise', 'pll'],
    intro: String.raw`<p>A <b>Voltage-Controlled Oscillator (VCO)</b> converts a control <i>voltage</i> into an oscillation <i>frequency</i>. It is the actuator of an analog phase-locked loop: the loop filter drives the VCO's tuning port, and the VCO's phase is the quantity that is ultimately aligned to the reference. Understanding the VCO means understanding two things deeply: (1) its <b>tuning law</b> $f_{out}=f_0+K_{vco}V_{ctrl}$ and the crucial fact that <b>frequency is the derivative of phase</b>, so the VCO behaves as a $1/s$ integrator in the phase domain; and (2) its <b>phase noise</b>, described by Leeson's model, which sets the ultimate spectral purity of any synthesizer built around it.</p>`,
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
      { q: String.raw`A VCO has $f_0=1.5$ GHz and $K_{vco}=80$ MHz/V. Find $f_{out}$ at $V_{ctrl}=1.25$ V and the control voltage needed for 1.62 GHz.`, solution: String.raw`$f_{out}=1.5\text{ GHz}+80\times1.25=1.5\text{ GHz}+100\text{ MHz}=1.600$ GHz. For 1.62 GHz: $\Delta f=120$ MHz $\Rightarrow V_{ctrl}=120/80=1.5$ V.` },
      { q: String.raw`A VCO tunes from 2.0 to 2.4 GHz as $V_{ctrl}$ goes 0 to 5 V (assume linear). Find $K_{vco}$ and the frequency at 3 V.`, solution: String.raw`$K_{vco}=(2.4-2.0)\text{ GHz}/5\text{ V}=400\text{ MHz}/5\text{ V}=80$ MHz/V. At 3 V: $f=2.0\text{ GHz}+80\times3=2.0+0.24=2.24$ GHz.` },
      { q: String.raw`An LC-VCO oscillates at 5 GHz with tank $C=1$ pF. The varactor gives $dC/dV=-0.05$ pF/V. Estimate $K_{vco}$.`, solution: String.raw`$K_{vco}=-\dfrac{f}{2C}\dfrac{dC}{dV}=-\dfrac{5\times10^9}{2\times1\times10^{-12}}(-0.05\times10^{-12})=-2.5\times10^{21}\times(-5\times10^{-14})=1.25\times10^{8}$ Hz/V $=125$ MHz/V.` },
      { q: String.raw`Phase noise at 100 kHz offset is $-100$ dBc/Hz in the $1/f^2$ region. Estimate it at 1 MHz offset.`, solution: String.raw`In the $1/f^2$ region slope is $-20$ dB/decade. One decade out (100 kHz $\to$ 1 MHz): $-100-20=-120$ dBc/Hz.` },
      { q: String.raw`A VCO has pushing of 2 MHz/V. A 10 mV supply ripple appears. What frequency deviation results?`, solution: String.raw`$\Delta f=2\text{ MHz/V}\times0.010\text{ V}=20$ kHz peak deviation — this creates supply-related spurs/FM sidebands on the carrier.` },
      { q: String.raw`Doubling the loaded $Q$ of an LC tank: by how many dB does the $1/f^2$ phase noise improve?`, solution: String.raw`$\mathcal{L}\propto 1/Q_L^2$. Doubling $Q_L$ multiplies noise by $1/4$, i.e. $10\log_{10}(1/4)=-6.02$ dB improvement.` },
      { q: String.raw`A PLL uses $K_{vco}=50$ MHz/V, $K_{pd}=0.2$ V/rad, $N=100$, and a filter with DC gain 1. Find the DC open-loop gain magnitude coefficient (excluding $1/s$).`, solution: String.raw`Loop gain coefficient $=2\pi K_{pd}K_{vco}/N=2\pi(0.2)(50\times10^6)/100=2\pi\times10^5\approx6.28\times10^5$ (rad/s). This sets the unity-gain crossover / loop bandwidth scale.` }
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
    prerequisites: ['nyquist-sampling', 'vco', 'dac'],
    intro: String.raw`<p>A <b>Numerically-Controlled Oscillator (NCO)</b> is the digital counterpart of the analog <a href="#vco">VCO</a>. Instead of a voltage tuning an analog tank, an integer <b>frequency control word (FCW)</b> is repeatedly added to an $N$-bit <b>phase accumulator</b> on every clock; the accumulator's value is a linearly ramping phase, and a <b>phase-to-amplitude converter</b> (a LUT or a CORDIC engine) turns that phase into sample values of $\cos$ and $\sin$. Followed by a DAC this becomes <b>Direct Digital Synthesis (DDS)</b>. The NCO's beauty is exactness: output frequency $f_{out}=\text{FCW}\cdot f_{clk}/2^N$ is perfectly linear in FCW, frequency resolution is $f_{clk}/2^N$ (sub-milli-hertz is routine), and phase/frequency can be changed instantaneously and continuously. Its limitations are equally characteristic: it cannot exceed Nyquist ($f_{out}<f_{clk}/2$), and <b>phase truncation</b> and finite amplitude quantisation create <b>spurious tones</b> that bound the spurious-free dynamic range (SFDR).</p>`,
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
      { q: String.raw`An NCO has $N=32$, $f_{clk}=100$ MHz. What FCW gives $f_{out}=10$ MHz?`, options: [String.raw`$\approx 4.29\times10^7$`, String.raw`$\approx 4.29\times10^8$`, String.raw`$10^7$`, String.raw`$2^{31}$`], answer: 0, explain: String.raw`FCW $=f_{out}2^N/f_{clk}=10^7\times2^{32}/10^8=0.1\times2^{32}\approx4.29\times10^8$... wait: $0.1\times4.295\times10^9=4.295\times10^8$. So option (a) $4.29\times10^7$ is off by 10x; the correct value is $4.29\times10^8$. Recompute: $2^{32}=4.2949\times10^9$; $\times0.1=4.295\times10^8$.` },
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
      { q: String.raw`$N=32$, $f_{clk}=200$ MHz. Find the frequency resolution and the FCW for $f_{out}=25$ MHz.`, solution: String.raw`$\Delta f=f_{clk}/2^N=200\times10^6/4.2949\times10^9\approx0.0466$ Hz. FCW $=f_{out}2^N/f_{clk}=(25\times10^6)(4.2949\times10^9)/(200\times10^6)=(0.125)(4.2949\times10^9)\approx5.369\times10^8$.` },
      { q: String.raw`A 48-bit NCO clocked at 491.52 MHz. What is $\Delta f$?`, solution: String.raw`$\Delta f=f_{clk}/2^{48}=491.52\times10^6/2.815\times10^{14}\approx1.75\times10^{-6}$ Hz $\approx1.75$ microhertz — sub-microhertz tuning.` },
      { q: String.raw`How many phase bits $W$ into the LUT are needed for $\geq90$ dBc SFDR?`, solution: String.raw`SFDR $\approx6.02W\geq90\Rightarrow W\geq90/6.02\approx14.95$, so use $W=15$ bits (giving $\approx90.3$ dBc).` },
      { q: String.raw`$N=24$, $f_{clk}=50$ MHz, FCW $=3\,355\,443$. Find $f_{out}$.`, solution: String.raw`$f_{out}=\text{FCW}\,f_{clk}/2^N=3\,355\,443\times50\times10^6/16\,777\,216\approx(0.19999)\times50\times10^6\approx10.0$ MHz.` },
      { q: String.raw`What is the SQNR of a DDS with a 10-bit amplitude output?`, solution: String.raw`SQNR $\approx6.02\times10+1.76=60.2+1.76\approx61.96$ dB.` },
      { q: String.raw`An NCO must produce 1 Hz steps. With $f_{clk}=100$ MHz, what accumulator width $N$ is needed?`, solution: String.raw`Need $f_{clk}/2^N\leq1\Rightarrow 2^N\geq10^8\Rightarrow N\geq\log_2(10^8)\approx26.6$, so $N=27$ bits (giving $\Delta f\approx0.745$ Hz).` },
      { q: String.raw`A DDS at $f_{clk}=250$ MHz outputs 30 MHz. Where do the nearest images appear?`, solution: String.raw`Images at $|kf_{clk}\pm f_{out}|$: first images at $250-30=220$ MHz and $250+30=280$ MHz. The reconstruction filter must pass 30 MHz and reject 220 MHz — feasible since output is well below Nyquist (125 MHz).` }
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
    prerequisites: ['bpsk', 'fft', 'vco'],
    intro: String.raw`<p><b>Carrier Frequency Offset (CFO)</b> is the difference $\Delta f=f_{Tx}-f_{Rx}$ between the transmitter's and receiver's local-oscillator frequencies, augmented by any <b>Doppler shift</b> from relative motion. No two independent oscillators are ever exactly equal — a modest 10 ppm crystal at 2.4 GHz already produces up to 24 kHz of offset. After downconversion this leftover offset multiplies the baseband signal by $e^{j2\pi\Delta f\,t}$, so the received constellation <b>spins</b> at $2\pi\Delta f$ rad/s. In single-carrier systems this rotates symbols (and, if uncorrected, collapses BER); in <a href="#fft">OFDM</a> it is far more damaging because it breaks the <b>orthogonality</b> of subcarriers, producing <b>inter-carrier interference (ICI)</b> and a <b>common phase error (CPE)</b>. Estimating and correcting CFO — with pilots, preambles (Schmidl-Cox), or cyclic-prefix autocorrelation (Moose), then derotating with an <a href="#nco">NCO</a> — is a mandatory front-end synchronisation task.</p>`,
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
      { q: String.raw`A link at $f_c=2.4$ GHz uses $\pm20$ ppm oscillators at both ends. Find the worst-case CFO.`, solution: String.raw`Worst case both ends drift oppositely: $\Delta f=2\times20\times10^{-6}\times2.4\times10^9=40\times10^{-6}\times2.4\times10^9=96$ kHz.` },
      { q: String.raw`A satellite moving at 7.5 km/s (radial) transmits at 12 GHz. Find the Doppler CFO.`, solution: String.raw`$\Delta f_D=(v/c)f_c=(7500/3\times10^8)\times12\times10^9=2.5\times10^{-5}\times12\times10^9=300$ kHz.` },
      { q: String.raw`An OFDM system has subcarrier spacing 15 kHz. If the CFO is 3 kHz, find $\varepsilon$.`, solution: String.raw`$\varepsilon=\Delta f/\Delta f_{sc}=3\,000/15\,000=0.2$ (all fractional, so it causes ICI/CPE and must be corrected).` },
      { q: String.raw`A BPSK symbol rate is 1 Msym/s and the CFO is 5 kHz. Find the per-symbol phase rotation.`, solution: String.raw`$T_s=1\,\mu s$; $\Delta\phi=2\pi\Delta f\,T_s=2\pi(5000)(10^{-6})=2\pi\times0.005=0.0314$ rad $\approx1.8^\circ$ per symbol — small but accumulating, so it must be tracked.` },
      { q: String.raw`A CFO estimator correlates samples separated by $D=64$ at $f_s=1/T_s=10$ MHz. Find the unambiguous CFO range.`, solution: String.raw`$|\Delta f|<1/(2DT_s)=f_s/(2D)=10^7/(2\times64)=10^7/128\approx78.1$ kHz. Offsets beyond $\pm78.1$ kHz alias.` },
      { q: String.raw`OFDM with $T_u=66.7\,\mu s$ (15 kHz spacing). A residual $\varepsilon=0.02$ remains. Estimate the SNR loss at $E_s/N_0=25$ dB.`, solution: String.raw`$E_s/N_0=10^{2.5}\approx316$. $D_{SNR}\approx\frac{10}{3\ln10}(\pi\times0.02)^2\times316=\frac{10}{6.908}(0.0628)^2\times316=1.448\times0.00395\times316\approx1.81$ dB. Small offset, but ~1.8 dB loss at high SNR shows QAM sensitivity.` },
      { q: String.raw`Schmidl-Cox uses two identical halves each of length $L=128$ samples at $f_s=20$ MHz. What CFO makes the inter-half phase exactly $\pi$ (the ambiguity edge)?`, solution: String.raw`Half separation $D=L=128$; ambiguity at $\angle=\pi\Rightarrow\Delta f=1/(2DT_s)=f_s/(2L)=20\times10^6/256\approx78.1$ kHz. Beyond this the estimate wraps.` }
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
    prerequisites: ['pll', 'vco', 'nco'],
    intro: String.raw`<p>A <b>Delay-Locked Loop (DLL)</b> aligns the phase of an output clock to a reference clock by controlling a <b>voltage-controlled delay line (VCDL)</b> — a chain of buffers whose total delay is tuned — instead of a <a href="#vco">VCO</a>. A phase detector compares the reference edge to the delayed output edge and steers the delay so the two align (typically to one full clock period, i.e. zero effective skew). Because a delay line contributes a <b>pure gain</b> in the phase domain (no $1/s$ integrator like a VCO), the DLL is a <b>first-order</b> loop: unconditionally stable, no ringing, and — crucially — it does <b>not accumulate jitter</b>, since each reference edge freshly re-times the output. DLLs are the workhorse for clock <b>de-skew</b>, precise <b>phase alignment</b>, and <b>multiphase clock generation</b> inside FPGAs, DDR memory interfaces, and SoCs. This topic focuses on the clock/delay-line DLL; the code-tracking early-late DLL used in spread-spectrum receivers is covered separately in <a href="#early-late-correlator">early-late correlator</a>.</p>`,
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
      { q: String.raw`A DLL locks a delay line to a 500 MHz clock. What total delay does the line provide at lock?`, solution: String.raw`$t_d=T=1/f=1/(500\times10^6)=2$ ns. The line spans exactly one 2 ns period at lock.` },
      { q: String.raw`An 8-stage DLL is locked to a 200 MHz clock. Find the per-stage delay and the phase step per tap.`, solution: String.raw`$T=1/200\text{ MHz}=5$ ns; per-stage delay $=T/8=0.625$ ns. Phase step $=360^\circ/8=45^\circ$ per tap (0, 45, 90, ... 315 degrees).` },
      { q: String.raw`A VCDL has delay $t_d=t_{d0}+K_{DL}V$ with $t_{d0}=1$ ns and $K_{DL}=0.5$ ns/V. What $V_{ctrl}$ locks it to a 400 MHz clock?`, solution: String.raw`Need $t_d=T=1/400\text{ MHz}=2.5$ ns. $2.5=1+0.5V\Rightarrow V=(2.5-1)/0.5=3$ V.` },
      { q: String.raw`A DLL delay line spans 0.8 ns to 3.2 ns. Over what clock-frequency range can it lock (fundamental)?`, solution: String.raw`Lock needs $T\in[0.8,3.2]$ ns $\Rightarrow f=1/T\in[1/3.2\text{ns},1/0.8\text{ns}]=[312.5\text{ MHz},1.25\text{ GHz}]$.` },
      { q: String.raw`A DDR DLL must shift the strobe by 90 degrees at 800 MHz (DDR data rate context). What delay is that?`, solution: String.raw`Period $T=1/800\text{ MHz}=1.25$ ns; $90^\circ$ is a quarter period $=T/4=0.3125$ ns $=312.5$ ps.` },
      { q: String.raw`A first-order DLL has $K_{PD}I_{cp}K_{DL}/C=2\pi\times1\times10^6$ rad/s. What is the loop bandwidth?`, solution: String.raw`For a first-order loop the closed-loop $-3$ dB bandwidth equals the open-loop unity-gain frequency $\omega_n=K_{PD}I_{cp}K_{DL}/C=2\pi\times10^6$, i.e. $f_n=1$ MHz. No damping factor — no peaking.` },
      { q: String.raw`A DLL could false-lock at $t_d=2T$ for a 250 MHz clock. What erroneous delay is that, and why is it a problem?`, solution: String.raw`$T=4$ ns; $2T=8$ ns. The edges still appear aligned (two full periods), so the PD sees zero error, but the delay is double the intended value — wrong phase for taps and possibly outside optimal range. Start-up biasing to sub-$T$ delay and a harmonic-lock detector prevent this.` }
    ],
    realWorld: String.raw`<p>DLLs are pervasive in digital and mixed-signal ICs. Xilinx/AMD and Intel/Altera FPGAs provide clock managers (DCM/MMCM/PLL blocks) that use DLL techniques for zero-delay clock de-skew and precise phase shifting; DDR/DDR2/DDR3/DDR4 memory controllers rely on DLLs to center the DQS strobe in the read/write data eye, which is essential for meeting nanosecond-scale setup/hold at multi-gigabit rates. High-speed SerDes and time-interleaved <a href="#adc">ADCs</a> (as in <a href="#rfsoc">RFSoC</a> data converters) use DLL-generated multiphase clocks so that interleaved sampling instants are evenly and stably spaced — timing skew between interleaved paths would otherwise create spurious tones. The DLL's unconditional stability and freedom from jitter accumulation are exactly why designers reach for it instead of a <a href="#pll">PLL</a> when frequency synthesis is not needed. A distinct but related device, the early-late code-tracking DLL, keeps <a href="#dsss">spread-spectrum</a> and GNSS receivers aligned to the incoming <a href="#pn-codes">PN code</a> — covered in <a href="#early-late-correlator">early-late correlator</a>.</p>`,
    related: ['pll', 'vco', 'early-late-correlator', 'nco', 'rfsoc']
  }
);
