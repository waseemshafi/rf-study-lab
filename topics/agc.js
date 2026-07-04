// Automatic Gain Control (AGC) — RF front-end receiver topic.
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'agc',
    title: 'Automatic Gain Control (AGC)',
    category: 'RF Front-End & Receivers',
    tags: ['AGC', 'VGA', 'dynamic range', 'attack time', 'decay time', 'log-domain', 'feedback loop', 'ADC full-scale'],
    summary: String.raw`AGC is a feedback loop that continuously adjusts a variable-gain amplifier so the receiver output level stays roughly constant despite an enormous range of input powers, keeping the demodulator and ADC in their optimal operating window.`,
    diagram: [
      {
        title: String.raw`AGC feedback loop (VGA → detector → compare → loop filter → gain)`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr-agc" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">AGC as a level-regulating feedback loop</text>
          <text x="14" y="70" fill="#9aa7b5">RF in</text>
          <line x1="46" y1="66" x2="86" y2="66" stroke="#9aa7b5" marker-end="url(#arr-agc)"/>
          <rect x="88" y="46" width="96" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
          <text x="136" y="66" fill="#e6edf3" text-anchor="middle">VGA</text>
          <text x="136" y="82" fill="#9aa7b5" font-size="9" text-anchor="middle">gain G(V)</text>
          <line x1="184" y1="66" x2="230" y2="66" stroke="#9aa7b5" marker-end="url(#arr-agc)"/>
          <text x="207" y="59" fill="#63e6be" font-size="9" text-anchor="middle">out</text>
          <rect x="232" y="46" width="104" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/>
          <text x="284" y="66" fill="#e6edf3" text-anchor="middle">detector</text>
          <text x="284" y="82" fill="#9aa7b5" font-size="9" text-anchor="middle">envelope/power</text>
          <line x1="336" y1="66" x2="470" y2="66" stroke="#9aa7b5" marker-end="url(#arr-agc)"/>
          <text x="440" y="59" fill="#63e6be" font-size="10" text-anchor="middle">to demod/ADC</text>
          <line x1="284" y1="90" x2="284" y2="128" stroke="#9aa7b5" marker-end="url(#arr-agc)"/>
          <rect x="232" y="130" width="104" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
          <text x="284" y="150" fill="#e6edf3" text-anchor="middle">Σ (−ref)</text>
          <text x="284" y="164" fill="#9aa7b5" font-size="9" text-anchor="middle">error e</text>
          <rect x="88" y="130" width="112" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/>
          <text x="144" y="150" fill="#e6edf3" text-anchor="middle">loop filter</text>
          <text x="144" y="164" fill="#9aa7b5" font-size="9" text-anchor="middle">integrator</text>
          <line x1="232" y1="150" x2="200" y2="150" stroke="#9aa7b5" marker-end="url(#arr-agc)"/>
          <line x1="144" y1="130" x2="144" y2="90" stroke="#9aa7b5" marker-end="url(#arr-agc)"/>
          <text x="120" y="112" fill="#9aa7b5" font-size="9">V (gain ctrl)</text>
        </svg>`,
        caption: String.raw`The AGC loop: the VGA amplifies the RF; a detector measures the output level; a summer subtracts a reference to form the error; a loop filter (integrator) turns the error into the gain-control voltage that drives the VGA — closing the loop so output level tracks the reference.`
      },
      {
        title: String.raw`Transfer characteristic (output level vs input level)`,
        svg: String.raw`<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr2-agc" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="260" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">AGC transfer characteristic</text>
          <line x1="60" y1="180" x2="480" y2="180" stroke="#9aa7b5" marker-end="url(#arr2-agc)"/>
          <line x1="60" y1="180" x2="60" y2="40" stroke="#9aa7b5" marker-end="url(#arr2-agc)"/>
          <text x="470" y="200" fill="#9aa7b5" font-size="10" text-anchor="end">input level (dBm)</text>
          <text x="16" y="46" fill="#9aa7b5" font-size="10">out (dB)</text>
          <line x1="60" y1="176" x2="180" y2="96" stroke="#4dabf7" stroke-width="2"/>
          <line x1="180" y1="96" x2="460" y2="86" stroke="#63e6be" stroke-width="2"/>
          <line x1="180" y1="96" x2="180" y2="180" stroke="#9aa7b5" stroke-dasharray="3 3"/>
          <text x="120" y="120" fill="#4dabf7" font-size="10">below threshold:</text>
          <text x="120" y="134" fill="#4dabf7" font-size="10">max gain, rises</text>
          <text x="300" y="72" fill="#63e6be" font-size="10">AGC range: output nearly flat</text>
          <text x="182" y="196" fill="#ffa94d" font-size="9">threshold</text>
          <line x1="60" y1="86" x2="460" y2="86" stroke="#ffa94d" stroke-dasharray="2 4"/>
          <text x="66" y="80" fill="#ffa94d" font-size="9">target</text>
        </svg>`,
        caption: String.raw`Below the AGC threshold the loop runs at maximum gain, so output rises 1:1 with input. Once the input is strong enough to reach the target, the loop backs off gain and the output flattens into the AGC range — a nearly constant output level over a wide input span.`
      },
      {
        title: String.raw`Time response to a step in input (attack then settle)`,
        svg: String.raw`<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr3-agc" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="260" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Output level after a step increase in input</text>
          <line x1="60" y1="170" x2="480" y2="170" stroke="#9aa7b5" marker-end="url(#arr3-agc)"/>
          <line x1="60" y1="170" x2="60" y2="40" stroke="#9aa7b5" marker-end="url(#arr3-agc)"/>
          <text x="470" y="192" fill="#9aa7b5" font-size="10" text-anchor="end">time</text>
          <text x="16" y="46" fill="#9aa7b5" font-size="10">out level</text>
          <line x1="60" y1="120" x2="150" y2="120" stroke="#63e6be" stroke-width="2"/>
          <path d="M150,120 L150,58 Q170,58 200,96 T300,116 T430,120" fill="none" stroke="#4dabf7" stroke-width="2"/>
          <line x1="60" y1="120" x2="460" y2="120" stroke="#ffa94d" stroke-dasharray="2 4"/>
          <text x="66" y="114" fill="#ffa94d" font-size="9">target level</text>
          <line x1="150" y1="40" x2="150" y2="170" stroke="#9aa7b5" stroke-dasharray="3 3"/>
          <text x="152" y="52" fill="#b197fc" font-size="10">input step ↑</text>
          <text x="180" y="86" fill="#4dabf7" font-size="9">overshoot</text>
          <text x="250" y="140" fill="#4dabf7" font-size="9">fast attack, then settle</text>
        </svg>`,
        caption: String.raw`When the input jumps up, the output momentarily overshoots before the loop reduces gain and pulls the level back to target. A fast attack time constant catches the surge quickly; a slower decay (release) time constant avoids pumping on modulation — the classic fast-attack / slow-decay asymmetry.`
      }
    ],
    prerequisites: ['rssi', 'lna'],
    intro: String.raw`<p><b>Why does AGC exist?</b> A receiver antenna can present a wanted signal that is a picowatt in one instant and a milliwatt in the next — a range of a hundred million to one — as the transmitter moves, fades, or a nearby emitter turns on. Yet the ADC that digitizes the signal has a single fixed full-scale, and the demodulator wants a roughly constant amplitude to slice symbols, estimate phase, and hold error-vector magnitude low. Something has to squeeze that vast input dynamic range down to the narrow window the ADC and demodulator can use. That something is <b>Automatic Gain Control</b>: a feedback loop that turns the receiver's gain up when the signal is weak and down when it is strong, so the output level stays roughly constant. Without it, weak signals vanish into quantization noise and strong signals clip — either way the demodulator fails.</p>
<p><b>Automatic Gain Control (AGC)</b> is a closed loop wrapped around a <b>variable-gain amplifier (VGA)</b>. A detector measures the output level, a comparison against a <b>reference</b> forms an error, a <b>loop filter</b> integrates that error, and the result drives the VGA's gain in the direction that shrinks the error. Understanding AGC means understanding three things: the loop structure and why it is best analysed in the <b>logarithmic (dB) domain</b>; the two time constants — <b>attack</b> and <b>decay</b> — that set how fast it reacts; and how it maps a large input dynamic range onto the ADC's full-scale so the converter's effective bits are actually used.</p>`,
    sections: [
      {
        h: 'What AGC is and why receivers need it',
        html: String.raw`<p>The wanted signal arriving at a receiver varies over an enormous <b>input dynamic range</b>. Path loss changes with distance (a factor of thousands), multipath fading adds fast fluctuations of tens of dB, and the "near/far" problem — a close interferer versus a distant wanted transmitter — can span 60-100 dB. The blocks downstream cannot tolerate this: an <a href="#adc">ADC</a> has a fixed full-scale voltage, and a demodulator wants a roughly constant amplitude to keep its slicers, timing and phase estimators, and <a href="#evm">EVM</a> in spec.</p>
        <p><b>Automatic Gain Control</b> solves this by making the receiver gain a function of the signal level: strong in, low gain; weak in, high gain. The result is an output whose level is held near a target regardless of how the input swings. This is a <i>regulation</i> problem — exactly the kind of thing feedback does well.</p>
        <ul>
          <li><b>Prevents clipping:</b> a strong signal that would saturate the ADC is attenuated first.</li>
          <li><b>Prevents underflow:</b> a weak signal is boosted so it spans enough ADC codes to survive quantization.</li>
          <li><b>Constant EVM:</b> the demodulator sees a stable amplitude, so symbol decisions and error metrics stay well-conditioned.</li>
        </ul>
        <div class="callout tip"><b>Key intuition:</b> AGC does not improve signal-to-noise ratio — the noise is set upstream by the <a href="#lna">LNA</a> and <a href="#noise-floor">noise floor</a>. AGC's job is to <i>place</i> the signal correctly within the fixed window of the ADC and demodulator so none of the available dynamic range is wasted.</div>`
      },
      {
        h: 'The AGC feedback loop',
        html: String.raw`<p>The canonical AGC is a loop with four blocks. The <b>VGA</b> (variable-gain amplifier, sometimes called a PGA when stepped) provides a gain $G$ set by a control signal $V_c$. A <b>power or envelope detector</b> measures the output level $y$ (often squared, or its magnitude). A <b>summer</b> subtracts a <b>reference</b> $R$ to form the error $e = R - \text{level}(y)$. A <b>loop filter</b> — almost always an integrator — turns that error into the control signal that drives the VGA gain.</p>
        <p>Because the detector output responds to $G$ and $G$ responds to the detector, the loop is nonlinear. But it settles at the <b>equilibrium</b> where the measured output level equals the reference: the loop drives the error to zero, so <i>the output level is pinned to whatever the reference dictates</i>, independent of input power (within the gain range).</p>
        <ul>
          <li><b>Feedback AGC:</b> the detector measures the <i>output</i> (post-VGA). Self-correcting and accurate at equilibrium, but the loop's own dynamics limit speed.</li>
          <li><b>Feedforward AGC:</b> the detector measures the <i>input</i> and directly computes the required gain. Potentially instantaneous, but accuracy depends on how well the gain law is calibrated.</li>
        </ul>
        <div class="callout tip"><b>Design note:</b> most practical receivers use feedback AGC (robust, self-calibrating) but add a fast feedforward or "AGC hold" path to catch sudden bursts that the feedback loop is too slow to handle on its own.</div>`
      },
      {
        h: 'Why AGC lives in the log (dB) domain',
        html: String.raw`<p>Gain in a receiver is naturally multiplicative: cascaded stages multiply, and the input range spans many decades. If you build the loop in the linear domain, the loop gain — and hence the settling behaviour — depends on the operating point, so the loop is slow at low levels and jumpy at high levels.</p>
        <p>The fix is a <b>log-domain (dB-linear) AGC</b>: use a VGA whose <i>decibel</i> gain is linear in the control voltage, $G_{dB} = k\,V_c$, and detect the output level in dB (a log detector). Then the whole loop operates on logarithmic quantities:</p>
        <p>$$e_{dB} = R_{dB} - \big(P_{in,dB} + G_{dB}\big),$$</p>
        <p>and the loop dynamics become <b>independent of signal level</b> — the settling time constant is the same whether the input is $-70$ dBm or $-10$ dBm. This "constant-dB-per-volt" or "linear-in-dB" VGA is why AGC settling time can be specified as a single number rather than a function of level.</p>
        <div class="callout tip"><b>Why it matters:</b> a level-independent loop means one design meets the attack-time spec across the entire input dynamic range — no need to gain-schedule the loop filter. This is the single most important architectural choice in a practical AGC.</div>`
      },
      {
        h: 'Attack and decay time constants',
        html: String.raw`<p>The loop filter's time constant sets how fast the AGC reacts. Two distinct constants are usually specified:</p>
        <ul>
          <li><b>Attack time:</b> how fast the loop <i>reduces</i> gain when the input suddenly rises. This must be fast so a burst does not clip the ADC before the loop responds.</li>
          <li><b>Decay (release) time:</b> how fast the loop <i>increases</i> gain when the input drops. This is usually made slower so the loop does not "pump" — chasing the amplitude dips of legitimate modulation and distorting the signal.</li>
        </ul>
        <p>The classic asymmetry is <b>fast attack, slow decay</b>. A fast attack protects against overload; a slow decay ignores the momentary nulls of an amplitude-modulated waveform (or the gaps between packets) so the gain does not surge up and then have to catch the next burst.</p>
        <p>The time response to a step (see diagram 3) shows the loop overshooting briefly, then relaxing to target with a time constant set by the loop-filter integrator. Too fast and the loop tracks modulation (distortion, gain pumping); too slow and bursts overload the ADC before the loop reacts.</p>
        <div class="callout tip"><b>Key intuition:</b> attack protects the hardware (anti-clip), decay protects the signal (anti-distortion). Getting the two constants right is the core tuning problem of any AGC.</div>`
      },
      {
        h: 'Interaction with the ADC full-scale and quantization',
        html: String.raw`<p>The ultimate purpose of AGC is to hand the <a href="#adc">ADC</a> a signal that fills its input range well — neither clipping nor vanishing. An ADC of $N$ bits has a fixed full-scale $V_{FS}$ and a quantization step $\Delta = V_{FS}/2^N$. The signal-to-quantization-noise ratio depends on how much of the full-scale the signal actually occupies:</p>
        <ul>
          <li><b>Too large:</b> the signal <b>clips</b> at full-scale, generating gross harmonic and intermodulation distortion that no amount of downstream processing removes.</li>
          <li><b>Too small:</b> the signal spans only a few codes, so <b>quantization noise dominates</b> and the effective number of bits (ENOB) collapses — the loud back of the room hears nothing.</li>
        </ul>
        <p>AGC keeps the signal at an optimal <b>loading factor</b> — typically the RMS level set several dB below full-scale (the "crest-factor backoff") so that peaks of a high-PAPR waveform such as OFDM rarely clip while the RMS level still uses most of the codes. This backoff is exactly the AGC <i>reference</i>: the target output level is chosen relative to $V_{FS}$.</p>
        <div class="callout tip"><b>Why it matters:</b> ENOB, and therefore the demodulator's noise floor, depends on correct loading. AGC is what turns the ADC's <i>nominal</i> resolution into <i>usable</i> resolution across a huge input range.</div>`
      },
      {
        h: 'Where AGC sits in the receiver chain',
        html: String.raw`<p>A modern receiver rarely has a single VGA. Gain is <b>distributed</b>: some in the RF stage after the <a href="#lna">LNA</a>, some at IF, some in baseband before the ADC. AGC control is split accordingly, because putting all the gain (or all the attenuation) in one place hurts either noise figure or linearity:</p>
        <ul>
          <li><b>Attenuate early for strong signals:</b> a big blocker must be reduced before it drives a later stage into compression — so RF/front-end gain drops first.</li>
          <li><b>Amplify late for weak signals:</b> for a weak wanted signal, keep the <a href="#lna">LNA</a> and front-end at maximum gain (best <a href="#noise-floor">noise figure</a>) and add gain in baseband.</li>
        </ul>
        <p>This <b>gain-distribution schedule</b> trades noise figure against linearity as a function of level, and the AGC loop is what walks the receiver along that schedule. In <a href="#superheterodyne">superheterodyne</a> and <a href="#zero-if">zero-IF</a> architectures alike, an RSSI-derived level estimate (<a href="#rssi">RSSI</a>) often drives the coarse AGC while a fast baseband loop trims the fine gain to hit the ADC target.</p>
        <table class="data">
          <tr><th>Aspect</th><th>Feedback AGC</th><th>Feedforward AGC</th></tr>
          <tr><td>Detector senses</td><td>Output level</td><td>Input level</td></tr>
          <tr><td>Accuracy</td><td>Exact at equilibrium</td><td>Depends on gain calibration</td></tr>
          <tr><td>Speed</td><td>Limited by loop dynamics</td><td>Potentially instantaneous</td></tr>
          <tr><td>Robustness</td><td>Self-correcting</td><td>Sensitive to model error</td></tr>
          <tr><td>Typical use</td><td>Main AGC</td><td>Burst/overload catch</td></tr>
        </table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Why AGC exists:</b> the input dynamic range (fading, near/far, path loss) is enormous, but the ADC full-scale and the demodulator's amplitude window are fixed — AGC regulates the output level so weak signals do not underflow and strong signals do not clip, keeping EVM constant.</li>
<li><b>The loop:</b> VGA → power/envelope detector → summer that subtracts a reference → loop-filter integrator → back to the VGA gain; at equilibrium the error is zero, so the output level is pinned to the reference regardless of input power.</li>
<li><b>The log domain:</b> a linear-in-dB VGA ($G_{dB}=kV_c$) with a log detector makes the loop dynamics independent of signal level, so one attack-time spec holds across the whole range.</li>
<li><b>Attack vs decay:</b> fast attack protects against clipping; slow decay avoids pumping on modulation — the fast-attack / slow-decay asymmetry.</li>
<li><b>ADC loading:</b> AGC sets the RMS level several dB below full-scale (crest-factor backoff) to maximise ENOB without clipping high-PAPR peaks — turning nominal ADC bits into usable bits.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`AGC is a feedback loop that holds the receiver output level roughly constant despite a huge input dynamic range (fading, near/far, path loss).`,
      String.raw`Loop structure: VGA → power/envelope detector → subtract reference (error) → loop-filter integrator → drive VGA gain; equilibrium pins output level to the reference.`,
      String.raw`AGC does not improve SNR (set upstream by the LNA and noise floor); it places the signal correctly within the fixed ADC/demod window.`,
      String.raw`A linear-in-dB VGA ($G_{dB}=kV_c$) plus a log detector makes loop dynamics level-independent, so one settling-time spec holds across the whole range.`,
      String.raw`Attack time (gain reduction on rising input) is fast to prevent clipping; decay/release (gain increase on falling input) is slow to prevent gain pumping on modulation.`,
      String.raw`AGC keeps the signal at an optimal loading factor a few dB below ADC full-scale (crest-factor backoff) to maximise ENOB without clipping peaks.`,
      String.raw`Feedback AGC (senses output) is exact at equilibrium but loop-speed limited; feedforward AGC (senses input) is fast but calibration-dependent.`,
      String.raw`Required VGA gain range must at least equal the input dynamic range to be regulated (e.g. a 60 dB input range needs ≥60 dB of gain range).`,
      String.raw`Gain is distributed across RF/IF/baseband: attenuate early for strong blockers (linearity), amplify late for weak signals (noise figure).`,
      String.raw`Constant output amplitude keeps demodulator slicers, timing/phase estimators, and EVM well-conditioned.`
    ],
    equations: [
      {
        title: 'Log-domain AGC error and equilibrium',
        tex: String.raw`$$e_{dB}=R_{dB}-\big(P_{in,dB}+G_{dB}\big)$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want to see why building the loop in decibels makes its behaviour independent of signal level. Begin with the linear signal chain and then take logarithms.</p>
        <p><b>Step 1 — the linear chain.</b> Let the input power be $P_{in}$ (linear) and the VGA power gain be $G$ (linear). The output power is the product $P_{out}=G\,P_{in}$. A power detector measures $P_{out}$, and the loop compares it to a linear reference $R_{lin}$, giving a multiplicative error ratio $P_{out}/R_{lin}=G P_{in}/R_{lin}$. Because this is a product, the loop's sensitivity to the error depends on the absolute level — a multiplicative loop is level-dependent, which is exactly what we want to avoid.</p>
        <p><b>Step 2 — take decibels.</b> Convert every quantity to dB: $P_{in,dB}=10\log_{10}P_{in}$, $G_{dB}=10\log_{10}G$, $R_{dB}=10\log_{10}R_{lin}$. The product $P_{out}=GP_{in}$ becomes a sum $P_{out,dB}=P_{in,dB}+G_{dB}$.</p>
        <p><b>Step 3 — form the error in dB.</b> The loop error is the reference minus the measured output level, all in dB:</p>
        $$e_{dB}=R_{dB}-P_{out,dB}=R_{dB}-\big(P_{in,dB}+G_{dB}\big).$$
        <p><b>Result.</b> $$e_{dB}=R_{dB}-\big(P_{in,dB}+G_{dB}\big).$$ At equilibrium $e_{dB}=0$, so $G_{dB}=R_{dB}-P_{in,dB}$: the loop simply supplies whatever gain (in dB) is needed to lift the input to the reference. Because the relation is additive, the loop's response to a given dB error is the same at any level — the level-independence that a log-domain AGC buys.</p>`
      },
      {
        title: 'AGC settling / attack time constant',
        tex: String.raw`$$g_{dB}(t)=g_{\infty}+\big(g_0-g_{\infty}\big)e^{-t/\tau},\qquad \tau=\frac{1}{k\,\mu}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want the transient shape of the gain after a step in input, and the time constant that sets the attack time. Model the loop filter as an integrator and use the log-domain gain law so the loop is linear.</p>
        <p><b>Step 1 — the integrating loop.</b> The loop filter integrates the dB error with a loop constant $\mu$: the control voltage evolves as $\dot V_c=\mu\,e_{dB}$. With a linear-in-dB VGA, $g_{dB}=k V_c$, so $\dot g_{dB}=k\dot V_c=k\mu\,e_{dB}$. Substituting the error $e_{dB}=R_{dB}-(P_{in,dB}+g_{dB})$ gives a first-order differential equation in the gain.</p>
        <p><b>Step 2 — write the ODE.</b> $$\dot g_{dB}=k\mu\big[R_{dB}-P_{in,dB}-g_{dB}\big].$$ Define the equilibrium gain $g_{\infty}=R_{dB}-P_{in,dB}$ (where $\dot g_{dB}=0$). Then $\dot g_{dB}=-k\mu\,(g_{dB}-g_{\infty})$, a linear first-order relaxation toward $g_{\infty}$.</p>
        <p><b>Step 3 — solve.</b> A first-order equation $\dot x=-a(x-x_\infty)$ has the exponential solution $x(t)=x_\infty+(x_0-x_\infty)e^{-at}$. Here $a=k\mu$, so with initial gain $g_0$:</p>
        $$g_{dB}(t)=g_{\infty}+\big(g_0-g_{\infty}\big)e^{-k\mu t}.$$
        <p><b>Result.</b> $$\tau=\frac{1}{k\mu},$$ and the gain relaxes to target with this single time constant. The attack time (say to reach 90% of the change) is roughly $2.3\tau$. Crucially $\tau$ contains no signal level — the log-domain construction made settling level-independent. Making $\mu$ (or $k$) larger speeds attack but risks tracking modulation; the decay path typically uses a smaller effective $\mu$ to slow release.</p>`
      },
      {
        title: 'Required gain range equals input dynamic range',
        tex: String.raw`$$\Delta G_{dB}\;\ge\;P_{in,\max}-P_{in,\min}=\mathrm{DR}_{in}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want to know how much gain-adjustment range a VGA must provide to regulate a given span of input powers. Use the equilibrium condition and require constant output at both extremes.</p>
        <p><b>Step 1 — equilibrium at each extreme.</b> From the log-domain analysis, at equilibrium the loop sets $G_{dB}=R_{dB}-P_{in,dB}$ so the output equals the reference $R_{dB}$. For the strongest input $P_{in,\max}$ the loop needs the minimum gain $G_{\min}=R_{dB}-P_{in,\max}$; for the weakest input $P_{in,\min}$ it needs the maximum gain $G_{\max}=R_{dB}-P_{in,\min}$.</p>
        <p><b>Step 2 — subtract to get the required span.</b> The gain range the VGA must be able to cover is $$\Delta G_{dB}=G_{\max}-G_{\min}=\big(R_{dB}-P_{in,\min}\big)-\big(R_{dB}-P_{in,\max}\big).$$ The reference cancels: $$\Delta G_{dB}=P_{in,\max}-P_{in,\min}=\mathrm{DR}_{in}.$$</p>
        <p><b>Step 3 — allow margin.</b> In practice add margin for detector error, gain-law tolerance, and the desired backoff, so the specified range is $\Delta G_{dB}\ge \mathrm{DR}_{in}$ plus a few dB.</p>
        <p><b>Result.</b> $$\Delta G_{dB}\ge \mathrm{DR}_{in}.$$ Sanity check: to hold the output constant over a 60 dB input dynamic range the VGA (or the sum of the distributed VGAs) must provide at least 60 dB of adjustable gain. If the VGA range is smaller than the input range, the loop saturates at one extreme and output regulation fails — the signal either clips or drops below the ADC's usable floor.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What problem does AGC solve?`, back: String.raw`It regulates the receiver output level so a huge input dynamic range (fading, near/far, path loss) is squeezed into the fixed window of the ADC and demodulator — no clipping, no underflow.` },
      { front: String.raw`Name the four blocks of a classic AGC loop.`, back: String.raw`Variable-gain amplifier (VGA), power/envelope detector, summer that subtracts a reference (error), and a loop filter (integrator) that drives the VGA gain.` },
      { front: String.raw`Does AGC improve SNR?`, back: String.raw`No. SNR is set upstream by the LNA and noise floor. AGC only places the signal correctly within the fixed ADC/demod dynamic window.` },
      { front: String.raw`Why is AGC best analysed in the dB (log) domain?`, back: String.raw`A linear-in-dB VGA ($G_{dB}=kV_c$) plus a log detector make the loop additive, so its dynamics (settling time) are independent of signal level.` },
      { front: String.raw`What is attack time?`, back: String.raw`How fast the loop reduces gain when the input rises; made fast so bursts do not clip the ADC.` },
      { front: String.raw`What is decay (release) time?`, back: String.raw`How fast the loop increases gain when the input falls; made slow to avoid gain pumping on legitimate modulation.` },
      { front: String.raw`State the fast-attack / slow-decay principle.`, back: String.raw`Fast attack protects hardware (anti-clip); slow decay protects the signal (anti-distortion / anti-pumping).` },
      { front: String.raw`How much VGA gain range is needed for a 60 dB input dynamic range?`, back: String.raw`At least 60 dB. The required gain range equals the input dynamic range (reference cancels), plus a few dB of margin.` },
      { front: String.raw`Feedback vs feedforward AGC?`, back: String.raw`Feedback senses the output (exact at equilibrium, loop-speed limited); feedforward senses the input and computes gain directly (fast, calibration-dependent).` },
      { front: String.raw`Why set the AGC target a few dB below ADC full-scale?`, back: String.raw`Crest-factor backoff: high-PAPR waveforms (e.g. OFDM) have peaks well above RMS; backing off keeps peaks from clipping while the RMS still uses most codes, maximising ENOB.` },
      { front: String.raw`What happens if the signal into the ADC is too small?`, back: String.raw`It spans only a few codes, so quantization noise dominates and ENOB collapses.` },
      { front: String.raw`What happens if the signal into the ADC is too large?`, back: String.raw`It clips at full-scale, generating harmonic/intermodulation distortion that downstream processing cannot remove.` },
      { front: String.raw`What is gain distribution in a receiver AGC?`, back: String.raw`Splitting gain across RF/IF/baseband: attenuate early to protect linearity against strong blockers, amplify late to preserve noise figure for weak signals.` }
    ],
    mcqs: [
      { q: String.raw`The primary purpose of AGC in a receiver is to:`, options: [String.raw`Improve the signal-to-noise ratio`, String.raw`Hold the output level roughly constant over a wide input range`, String.raw`Remove multipath fading`, String.raw`Increase the ADC's number of bits`], answer: 1, explain: String.raw`AGC regulates output level so the ADC/demod window is used correctly; it does not create SNR, remove fading, or change the ADC's physical resolution.` },
      { q: String.raw`In a feedback AGC loop, the detector measures the:`, options: [String.raw`Input signal level`, String.raw`Output signal level`, String.raw`Reference voltage`, String.raw`Loop-filter output`], answer: 1, explain: String.raw`Feedback AGC senses the output (post-VGA) and corrects gain to pin it to the reference. Feedforward AGC is the one that senses the input.` },
      { q: String.raw`At equilibrium, a log-domain AGC sets the VGA gain to:`, options: [String.raw`$G_{dB}=P_{in,dB}-R_{dB}$`, String.raw`$G_{dB}=R_{dB}-P_{in,dB}$`, String.raw`$G_{dB}=R_{dB}+P_{in,dB}$`, String.raw`$G_{dB}=0$`], answer: 1, explain: String.raw`Setting the error $e_{dB}=R_{dB}-(P_{in,dB}+G_{dB})$ to zero gives $G_{dB}=R_{dB}-P_{in,dB}$ — exactly the gain needed to lift the input to the reference.` },
      { q: String.raw`Why is a linear-in-dB VGA preferred for AGC?`, options: [String.raw`It has lower noise figure`, String.raw`It makes the loop dynamics independent of signal level`, String.raw`It removes the need for a detector`, String.raw`It doubles the tuning range`], answer: 1, explain: String.raw`With $G_{dB}=kV_c$ and a log detector the loop becomes additive, so the settling time constant is the same at every input level.` },
      { q: String.raw`The attack time of an AGC is made fast primarily to:`, options: [String.raw`Avoid clipping the ADC on a rising input`, String.raw`Track amplitude modulation`, String.raw`Reduce power consumption`, String.raw`Improve frequency selectivity`], answer: 0, explain: String.raw`Fast attack reduces gain quickly when the input surges, protecting the ADC from overload before the loop responds.` },
      { q: String.raw`Making the decay (release) time too fast causes:`, options: [String.raw`Clipping on strong bursts`, String.raw`Gain pumping that tracks modulation and distorts the signal`, String.raw`Loss of noise figure`, String.raw`Increased ADC full-scale`], answer: 1, explain: String.raw`A fast decay lets the loop chase the amplitude nulls of the modulation, surging the gain and distorting the waveform — "pumping".` },
      { q: String.raw`To regulate an input dynamic range of 70 dB, the AGC gain range must be at least:`, options: [String.raw`7 dB`, String.raw`35 dB`, String.raw`70 dB`, String.raw`140 dB`], answer: 2, explain: String.raw`The required gain range equals the input dynamic range (the reference cancels), so at least 70 dB, plus margin.` },
      { q: String.raw`AGC keeps the ADC input a few dB below full-scale mainly to:`, options: [String.raw`Save power`, String.raw`Leave headroom for high-PAPR signal peaks (crest-factor backoff)`, String.raw`Increase the sampling rate`, String.raw`Reduce the reference voltage`], answer: 1, explain: String.raw`High-PAPR waveforms have peaks well above RMS; backoff keeps those peaks from clipping while the RMS still uses most codes, maximising ENOB.` },
      { q: String.raw`If the signal delivered to the ADC is far too small, the dominant impairment is:`, options: [String.raw`Clipping distortion`, String.raw`Quantization noise (collapsed ENOB)`, String.raw`Local-oscillator leakage`, String.raw`Image rejection loss`], answer: 1, explain: String.raw`A tiny signal spans only a few codes, so quantization noise dominates and effective bits collapse.` },
      { q: String.raw`Compared with feedback AGC, feedforward AGC is:`, options: [String.raw`Slower but self-correcting`, String.raw`Faster but dependent on gain-law calibration`, String.raw`Exact at equilibrium and level-independent`, String.raw`Immune to detector error`], answer: 1, explain: String.raw`Feedforward computes the gain directly from the input, so it can be near-instantaneous, but its accuracy depends on how well the gain law is calibrated.` },
      { q: String.raw`In a distributed-gain receiver AGC, a strong blocker is best handled by:`, options: [String.raw`Adding baseband gain`, String.raw`Attenuating early (RF/front-end) to protect later-stage linearity`, String.raw`Increasing the LNA gain`, String.raw`Raising the AGC reference`], answer: 1, explain: String.raw`A big blocker must be reduced before it drives a later stage into compression, so front-end gain drops first; weak wanted signals instead keep front-end gain high and add gain late.` },
      { q: String.raw`The AGC loop filter is typically an integrator because it:`, options: [String.raw`Adds high-frequency gain`, String.raw`Drives the steady-state level error to zero`, String.raw`Removes the VGA nonlinearity`, String.raw`Increases the noise floor`], answer: 1, explain: String.raw`An integrator accumulates error until it is zero, so at equilibrium the output level exactly equals the reference.` }
    ],
    numericals: [
      { q: String.raw`A receiver must regulate inputs from $-80$ dBm to $-20$ dBm to a constant output. (a) What input dynamic range is this? (b) What minimum VGA gain range is required? (c) If the target output is $0$ dBm, what gain is needed at each extreme? (d) Comment on the margin you would add.`, solution: String.raw`<p><b>Formula.</b> Input dynamic range $\mathrm{DR}_{in}=P_{in,\max}-P_{in,\min}$; at equilibrium the required gain is $G_{dB}=R_{dB}-P_{in,dB}$, and the required gain range is $\Delta G_{dB}=G_{\max}-G_{\min}=\mathrm{DR}_{in}$.</p>
<p><b>Substitute.</b> $\mathrm{DR}_{in}=(-20)-(-80)$. With $R_{dB}=0$ dBm: $G_{\min}=0-(-20)$ for the strongest input and $G_{\max}=0-(-80)$ for the weakest.</p>
<p><b>Compute.</b> (a) $\mathrm{DR}_{in}=60$ dB. (b) minimum VGA gain range $=60$ dB. (c) at $-20$ dBm need $G=+20$ dB; at $-80$ dBm need $G=+80$ dB. (d) These match: $80-20=60$ dB, confirming the 60 dB range.</p>
<p><b>Explanation.</b> The reference cancels when you take the difference, so the gain range you must build equals the 60 dB input span regardless of where you set the target. In practice you would specify perhaps 66-70 dB to allow for detector error, gain-law tolerance, and crest-factor backoff, so the loop never runs out of range at either extreme.</p>` },
      { q: String.raw`A signal arrives at $-70$ dBm and the AGC target (reference) is $-10$ dBm at the demodulator. (a) What VGA gain brings it to target? (b) If the VGA is linear-in-dB with $k=20$ dB/V, what control voltage is that? (c) If the input then jumps to $-40$ dBm, what new gain and voltage are needed? (d) By how much did the control voltage change?`, solution: String.raw`<p><b>Formula.</b> Required gain $G_{dB}=R_{dB}-P_{in,dB}$; for a linear-in-dB VGA $G_{dB}=k V_c\Rightarrow V_c=G_{dB}/k$.</p>
<p><b>Substitute.</b> (a) $G_{dB}=(-10)-(-70)$. (b) $V_c=G_{dB}/20$. (c) $G_{dB}'=(-10)-(-40)$, $V_c'=G_{dB}'/20$.</p>
<p><b>Compute.</b> (a) $G_{dB}=60$ dB. (b) $V_c=60/20=3.0$ V. (c) $G_{dB}'=30$ dB, $V_c'=30/20=1.5$ V. (d) $\Delta V_c=3.0-1.5=1.5$ V (the loop reduces the control voltage as the input strengthens).</p>
<p><b>Explanation.</b> The stronger input needs less gain, so the loop backs the control voltage down by 1.5 V. Because the VGA is linear-in-dB, a 30 dB change in required gain maps to a fixed 1.5 V change in control regardless of the operating point — the level-independence that makes log-domain AGC easy to specify.</p>` },
      { q: String.raw`An AGC loop has attack time constant $\tau=200\ \mu$s. (a) After a step increase in input, what fraction of the gain change is complete after one $\tau$? (b) After $2.3\tau$? (c) What is the time to reach 90% of the final gain? (d) If a spec demands 90% settling within $300\ \mu$s, is this loop fast enough?`, solution: String.raw`<p><b>Formula.</b> First-order relaxation $g(t)=g_\infty+(g_0-g_\infty)e^{-t/\tau}$; the fraction of the change completed at time $t$ is $1-e^{-t/\tau}$, and the time to reach fraction $f$ is $t=\tau\ln\!\frac{1}{1-f}$.</p>
<p><b>Substitute.</b> (a) $1-e^{-1}$. (b) $1-e^{-2.3}$. (c) $t_{90}=\tau\ln\frac{1}{1-0.9}=\tau\ln 10$. (d) compare $t_{90}$ with $300\ \mu$s.</p>
<p><b>Compute.</b> (a) $1-e^{-1}=0.632$, i.e. 63.2%. (b) $1-e^{-2.3}=0.90$, i.e. 90%. (c) $t_{90}=200\ \mu\mathrm{s}\times\ln 10=200\times2.303=461\ \mu$s. (d) $461\ \mu\mathrm{s}>300\ \mu$s, so it is <b>not</b> fast enough; $\tau$ must be reduced to $\tau\le 300/2.303\approx 130\ \mu$s.</p>
<p><b>Explanation.</b> One time constant covers 63%, and $2.3\tau$ (i.e. $\tau\ln10$) covers 90% — a standard first-order result. To meet a 300 µs / 90% attack spec the loop needs a smaller time constant (larger loop constant $\mu$ or gain slope $k$), which speeds attack at the cost of being more likely to track modulation on the decay side.</p>` },
      { q: String.raw`A 12-bit ADC has full-scale $1\ \mathrm{V_{pp}}$ (i.e. $\pm0.5$ V). AGC targets the RMS level at 12 dB below full-scale to leave headroom for OFDM peaks. (a) What is the ideal SQNR of the ADC at full-scale? (b) What RMS voltage does the 12 dB backoff correspond to relative to the 0.5 V peak? (c) Roughly how many dB of SQNR are lost versus full-scale loading? (d) Why accept that loss?`, solution: String.raw`<p><b>Formula.</b> Ideal full-scale SQNR $\approx 6.02N+1.76$ dB for $N$ bits. Backoff in dB reduces the signal power by the same dB, and SQNR (relative to fixed quantization noise) drops roughly dB-for-dB with backoff: $\mathrm{SQNR}\approx (6.02N+1.76)-\mathrm{backoff}_{dB}$. A backoff of $B$ dB means RMS $=V_{peak}\times10^{-B/20}$.</p>
<p><b>Substitute.</b> (a) $6.02\times12+1.76$. (b) $V_{RMS}=0.5\times10^{-12/20}$. (c) subtract 12 dB from (a). (d) qualitative.</p>
<p><b>Compute.</b> (a) $6.02\times12+1.76=72.2+1.76\approx 74.0$ dB. (b) $10^{-0.6}=0.251$, so $V_{RMS}\approx0.5\times0.251=0.126$ V. (c) with 12 dB backoff the usable SQNR is about $74.0-12\approx 62$ dB (loss $\approx12$ dB). (d) the loss buys crest-factor headroom.</p>
<p><b>Explanation.</b> Full-scale loading gives the best SQNR, but a high-PAPR OFDM signal has peaks roughly 10-12 dB above its RMS; loading the RMS at full-scale would clip those peaks and create far worse distortion than the 12 dB of SQNR sacrificed. The AGC reference is therefore set to keep the RMS about 12 dB down — trading a bit of quantization SNR for freedom from clipping, which is the correct engineering choice for OFDM.</p>` },
      { q: String.raw`A fading channel drops the input by 25 dB during a deep fade. (a) By how much must the AGC raise the gain to hold the output constant? (b) If the VGA is linear-in-dB at $k=25$ dB/V, what control-voltage change is that? (c) If the fade recovers, what is the sign of the gain change on the decay path? (d) Why is a slow decay preferred here?`, solution: String.raw`<p><b>Formula.</b> To hold output constant the gain change equals the negative of the input change: $\Delta G_{dB}=-\Delta P_{in,dB}$. For a linear-in-dB VGA $\Delta V_c=\Delta G_{dB}/k$.</p>
<p><b>Substitute.</b> (a) $\Delta P_{in,dB}=-25$ dB, so $\Delta G_{dB}=-(-25)$. (b) $\Delta V_c=\Delta G_{dB}/25$. (c) recovery means $\Delta P_{in,dB}=+25$ dB, so $\Delta G_{dB}=-25$ dB. (d) qualitative.</p>
<p><b>Compute.</b> (a) the AGC must raise gain by $+25$ dB. (b) $\Delta V_c=25/25=+1.0$ V. (c) on recovery the gain change is $-25$ dB (gain is reduced), i.e. the decay path. (d) a slow decay avoids chasing short recovery transients.</p>
<p><b>Explanation.</b> During the fade the loop boosts gain 25 dB (1.0 V of control) to keep the demodulator amplitude constant; when the signal returns it must shed that gain. Making the decay slow means the loop does not react to brief amplitude fluctuations of the modulation or short interruptions, preventing gain pumping — while the fast attack path still protects against sudden overload when the signal surges back.</p>` }
    ],
    realWorld: String.raw`<p>Every practical receiver runs AGC. In a Wi-Fi or LTE/5G front-end the AGC must settle within the short preamble at the start of each packet: a fast digital AGC reads an early <a href="#rssi">RSSI</a> estimate, sets a coarse gain, then a baseband loop trims the fine gain so the OFDM signal lands a fixed number of dB below the <a href="#adc">ADC</a> full-scale before the payload arrives — mis-set it and the whole packet is lost to clipping or quantization noise. In <a href="#superheterodyne">superheterodyne</a> and <a href="#zero-if">zero-IF</a> RFICs the gain is distributed across LNA, mixer, and baseband VGAs, and the AGC state machine walks a gain-distribution table that trades <a href="#noise-floor">noise figure</a> against linearity as the input level changes — dropping <a href="#lna">LNA</a> gain only when a strong blocker threatens compression. Broadcast FM/AM receivers, radar, and SDR platforms all rely on the same fast-attack / slow-decay loop to keep <a href="#evm">EVM</a> constant across deep fades and near/far power swings. The AGC is, in short, what makes a fixed-resolution ADC and a fixed-window demodulator cope with the real world's enormous and ever-changing signal levels.</p>`,
    related: ['rssi', 'adc', 'lna', 'sensitivity', 'evm']
  }
);
