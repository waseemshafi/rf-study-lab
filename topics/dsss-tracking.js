/* dsss-tracking.js — "DSSS Tracking" topic (Spread Spectrum & Coding).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "dsss-tracking-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'dsss-tracking',
    title: 'DSSS Tracking',
    category: 'Spread Spectrum & Coding',
    tags: ['DLL', 'early-late', 'code tracking', 'discriminator', 'S-curve', 'code jitter', 'carrier aiding', 'GPS'],
    summary: String.raw`After acquisition finds the code phase and Doppler to within a chip, DSSS tracking keeps the local PN replica and carrier continuously locked as they drift: a delay-locked loop (DLL) with Early/Prompt/Late correlators nulls code-phase error via an S-curve discriminator, while a parallel Costas/PLL and FLL hold the carrier — the prompt correlator then feeds clean data demodulation.`,
    prerequisites: ['dsss-acquisition', 'early-late-correlator', 'costas-loop'],
    intro: String.raw`<p><strong>Why do we need tracking at all after acquisition already "found" the signal?</strong> Acquisition only locates the code phase and carrier frequency to within a fraction of a chip and a coarse Doppler bin — good enough to start, but not good enough to keep. The moment you stop searching, the alignment begins to rot: the satellite (or handset) moves, so the code arrives stretched or compressed by <em>code Doppler</em>; the receiver's own crystal oscillator drifts with temperature; platform dynamics add acceleration. Left alone, the local PN replica slides off the incoming code within milliseconds, the correlation peak collapses, and the link dies. Tracking is the fine, <em>continuous</em>, closed-loop stage that runs forever after acquisition to hold the replica pinned to the incoming signal — in code phase <em>and</em> carrier phase — despite all that drift.</p>
<p>The engine of code tracking is the <strong>delay-locked loop (DLL)</strong>. It runs three correlators against three time-shifted copies of the local code: an <strong>Early (E)</strong> replica advanced by half the early-late spacing, a <strong>Prompt (P)</strong> replica exactly aligned, and a <strong>Late (L)</strong> replica retarded by the same amount. If the replica is early, the Early correlator wins; if late, the Late correlator wins; the difference between them is a signed error voltage that a loop filter smooths and feeds to a <strong>code numerically-controlled oscillator (NCO)</strong>, which nudges the local chipping rate until Early and Late are balanced — the instant the Prompt correlator is perfectly aligned and largest. That aligned Prompt output is exactly the despread signal handed to the data demodulator.</p>
<p>Running in lockstep is <strong>carrier tracking</strong>: a Costas loop (or PLL) holds carrier phase and an FLL holds frequency, both driven by the Prompt correlator's I and Q. Carrier tracking is not optional — without a phase reference the coherent code discriminator falls apart, and <em>carrier aiding</em> of the code loop is the single biggest reducer of code jitter. This topic derives the early-late correlator responses from the code autocorrelation triangle, the coherent and normalized non-coherent discriminators, the S-curve and its slope, the thermal-noise code-jitter formulas, and the NCO update — the complete machinery that turns a one-time acquisition into a signal you can hold and demodulate.</p>`,
    sections: [
      {
        h: 'Why tracking follows acquisition: the handover',
        html: String.raw`<p><strong>Why hand over at all?</strong> Acquisition is a coarse, open-loop <em>search</em>: it sweeps a 2-D grid of code phase and Doppler and declares detection when a correlation exceeds a threshold. Its resolution is limited by the search step (typically half a chip in code, tens to hundreds of Hz in Doppler), and it makes no attempt to follow motion. That is fine to <em>find</em> the signal but useless to <em>keep</em> it, because within milliseconds the true code phase and Doppler have already moved off the grid cell they were found in.</p>
<p><strong>Tracking is the closed-loop opposite:</strong> it does not search, it <em>corrects</em>. Given the acquisition estimate as a starting point, the tracking loops continuously measure the residual error (via discriminators) and drive it toward zero through feedback. The handover has three parts that must all succeed:</p>
<ul>
<li><strong>Code handover:</strong> load the acquisition code phase into the code NCO so the Prompt replica starts within roughly $\pm\tfrac12$ chip of the incoming code — inside the DLL's linear pull-in region.</li>
<li><strong>Carrier handover:</strong> load the acquisition Doppler into the carrier NCO so the residual frequency error is small enough for the FLL (and then the PLL) to pull in.</li>
<li><strong>Loop settling:</strong> the loops are given a brief settling interval; a lock detector confirms sustained lock before the receiver trusts the demodulated data.</li>
</ul>
<div class="callout"><strong>Intuition:</strong> acquisition parks the car in roughly the right spot; tracking is the driver's hands on the wheel making constant small corrections to stay in the lane. If acquisition parks outside the lane (error beyond the pull-in region), tracking can never take over.</div>`
      },
      {
        h: 'Early / Prompt / Late correlators and the autocorrelation triangle',
        html: String.raw`<p>The DLL generates <strong>three</strong> local code replicas from the code NCO and correlates each against the incoming despread signal over the integration time $T$. Let $\tau$ be the code-phase error (in chips) between the incoming code and the <em>Prompt</em> replica, and let $d$ be the <strong>early-late spacing</strong> in chips (typically $d=1$, or a narrow $d=0.1$ to $0.5$ for a "narrow correlator").</p>
<ul>
<li><strong>Early (E):</strong> replica advanced by $d/2$ chip — correlates the code at offset $\tau+d/2$.</li>
<li><strong>Prompt (P):</strong> replica exactly at the loop's current estimate — correlates at offset $\tau$; this output drives data demodulation.</li>
<li><strong>Late (L):</strong> replica retarded by $d/2$ chip — correlates at offset $\tau-d/2$.</li>
</ul>
<p>For an ideal PN code the normalized autocorrelation is the <strong>triangle function</strong></p>
<p>$$R(\tau)=\begin{cases}1-\lvert\tau\rvert, & \lvert\tau\rvert\le 1,\\[2pt]0,&\lvert\tau\rvert>1,\end{cases}$$</p>
<p>because the code is $\pm1$ and shifting it by $\tau$ chips leaves a fraction $1-\lvert\tau\rvert$ of chips still matched. The three correlator magnitudes are then $E=A\,R(\tau+d/2)$, $P=A\,R(\tau)$, and $L=A\,R(\tau-d/2)$, where $A$ is the signal amplitude after carrier wipe-off. When $\tau=0$ (perfect alignment) $E$ and $L$ sit symmetrically on the two flanks of the triangle and are <em>equal</em>; any offset unbalances them, and that imbalance is the tracking error signal.</p>
<div class="callout"><strong>Key picture:</strong> the Prompt sits on the peak; Early and Late straddle it on the slopes. Balancing Early against Late is the same as centering the Prompt on the peak.</div>`
      },
      {
        h: 'Discriminators: coherent, non-coherent, normalized, dot-product',
        html: String.raw`<p>The <strong>discriminator</strong> turns the E and L correlator outputs into a signed estimate of the code error $\tau$. Several forms exist, trading complexity, carrier-phase dependence, and amplitude sensitivity.</p>
<p><strong>Coherent early-minus-late.</strong> If carrier phase is known (PLL locked), use the in-phase correlators directly:</p>
<p>$$D_{\text{coh}}=E-L=A\big[R(\tau+\tfrac d2)-R(\tau-\tfrac d2)\big].$$</p>
<p>This is the simplest and lowest-jitter form, but it needs a good phase reference.</p>
<p><strong>Non-coherent power discriminator.</strong> If phase is uncertain, remove the phase dependence by squaring the envelopes (using both I and Q of E and L):</p>
<p>$$D_{\text{ncoh}}=E^2-L^2=(E_I^2+E_Q^2)-(L_I^2+L_Q^2).$$</p>
<p>It works without a phase lock but suffers <em>squaring loss</em> at low SNR.</p>
<p><strong>Normalized non-coherent.</strong> Dividing by the total power makes the discriminator amplitude-independent (immune to AGC error and fading):</p>
<p>$$D_{\text{norm}}=\frac{E^2-L^2}{E^2+L^2}.$$</p>
<p><strong>Dot-product discriminator.</strong> Using the Prompt as a phase reference, the dot product form</p>
<p>$$D_{\text{dp}}=(E_I-L_I)P_I+(E_Q-L_Q)P_Q$$</p>
<p>is quasi-coherent and computationally cheap, widely used in GNSS receivers. All four share the same S-curve shape near zero; they differ in noise behavior and how they degrade when carrier lock is weak.</p>`
      },
      {
        h: 'The discriminator S-curve and its lock point',
        html: String.raw`<p>Plotting the discriminator output against the code-phase error $\tau$ gives the <strong>S-curve</strong> (discriminator curve). Substituting the triangle $R(\tau)$ into $D_{\text{coh}}=E-L$ for $d=1$ gives, near the origin, a straight line through zero with <em>negative</em> slope: positive $\tau$ (replica late) produces a negative correction and vice-versa. That negative-going zero-crossing at $\tau=0$ is the <strong>stable lock point</strong> — the feedback pushes the error back toward it.</p>
<ul>
<li>The <strong>linear (pull-in) region</strong> spans roughly $\pm(\tfrac d2+\tfrac12)$ chips for a triangular autocorrelation — about $\pm1$ chip for $d=1$, narrowing toward $\pm(d/2)$ behavior for very small $d$; outside it the S-curve flattens and the loop cannot pull in.</li>
<li>The <strong>slope</strong> at the origin sets the loop gain: a steeper slope means a given error produces a bigger correction, which lowers jitter but shrinks the pull-in range.</li>
<li><strong>Narrow correlator</strong> ($d\ll1$): steeper slope, lower thermal jitter, and much better multipath rejection (a delayed path outside the $\pm d/2$ window barely biases the discriminator) — at the cost of a smaller pull-in region and tighter acquisition-handover accuracy.</li>
</ul>
<div class="callout"><strong>Why the zero-crossing must be negative-going:</strong> a positive-going crossing would push errors <em>away</em> from zero (unstable). The physical geometry of Early-minus-Late on the triangle guarantees the correct sign — that is the whole reason the DLL locks.</div>`
      },
      {
        h: 'DLL loop structure: discriminator, loop filter, code NCO',
        html: String.raw`<p>The DLL is a classic feedback loop with three blocks after the correlators:</p>
<ol>
<li><strong>Discriminator</strong> — forms the error estimate $D(\tau)$ from E and L each integration period $T$.</li>
<li><strong>Loop filter</strong> — a first- or second-order filter that smooths the noisy discriminator output and sets the <strong>loop noise bandwidth</strong> $B_L$ (Hz). A first-order loop tracks a constant code-phase offset with zero steady-state error; a second-order loop additionally tracks a constant code <em>rate</em> (Doppler) with zero error, essential for moving platforms.</li>
<li><strong>Code NCO</strong> — accumulates a phase step each clock to set the local chipping rate; the loop filter output adjusts this rate to advance or retard the replica and null the error.</li>
</ol>
<p>The fundamental design tension is the <strong>bandwidth trade</strong>: a <em>wide</em> $B_L$ lets the loop follow fast dynamics (high code Doppler, jerk) but admits more noise, raising jitter; a <em>narrow</em> $B_L$ rejects noise (low jitter) but sluggishly follows dynamics and can lose lock under acceleration. The chosen $B_L$ is the compromise between dynamic stress and thermal jitter.</p>
<div class="callout tip"><strong>Tip:</strong> think of $B_L$ as the loop's "reaction speed." Fast reactions catch a swerving target but also react to every noise twitch; slow reactions ignore noise but miss sudden moves.</div>`
      },
      {
        h: 'Carrier tracking, carrier aiding, and the code-carrier partnership',
        html: String.raw`<p>Code tracking never runs alone. In parallel, a <strong>carrier loop</strong> tracks the residual carrier from the Prompt correlator's I and Q:</p>
<ul>
<li><strong>FLL (frequency-locked loop)</strong> — robust, pulls in large frequency errors after handover using a frequency discriminator (e.g. cross-product of successive Prompt samples); tolerant of dynamics but leaves a residual phase error.</li>
<li><strong>Costas loop / PLL</strong> — once the FLL has reduced the frequency error, the Costas loop locks carrier <em>phase</em> (insensitive to the data-bit sign, using $\arctan(P_Q/P_I)$), giving a clean phase reference for coherent data demodulation and the coherent code discriminator.</li>
</ul>
<p><strong>Carrier aiding</strong> exploits a physical fact: code Doppler and carrier Doppler come from the <em>same</em> line-of-sight velocity, scaled by the ratio of chip rate to carrier frequency. The carrier loop, with its far larger frequency, measures Doppler with tiny fractional error; feeding a scaled version of the carrier-loop rate estimate into the code NCO removes almost all of the code loop's dynamic stress. This lets the code loop use a <em>very narrow</em> $B_L$ (low jitter) while still tracking high dynamics — the carrier does the heavy lifting. It is why a carrier-aided code loop dramatically out-performs a stand-alone DLL.</p>
<div class="callout"><strong>Handover chain:</strong> acquisition &rarr; FLL pulls frequency &rarr; PLL/Costas locks phase &rarr; carrier aids the DLL &rarr; narrow-band, low-jitter code lock with the Prompt correlator feeding data demod.</div>`
      },
      {
        h: 'Code tracking jitter: thermal noise and squaring loss',
        html: String.raw`<p>Even in perfect lock, noise makes the code phase estimate jitter around zero. The <strong>1-sigma thermal-noise code jitter</strong> (in chips) for a <em>coherent</em> DLL is</p>
<p>$$\sigma_{\text{coh}}\approx\sqrt{\frac{B_L\,d}{2\,(C/N_0)}},$$</p>
<p>and for a <em>non-coherent</em> DLL (with squaring loss) it gains a bracket:</p>
<p>$$\sigma_{\text{ncoh}}\approx\sqrt{\frac{B_L\,d}{2\,(C/N_0)}\left(1+\frac{1}{(2-d)\,T\,(C/N_0)}\right)}.$$</p>
<p>The symbols are: $B_L$ = code loop noise bandwidth (Hz); $C/N_0$ = carrier-to-noise density as a <strong>ratio in Hz</strong> (not dB) — convert from dB-Hz via $10^{(C/N_0)_{\text{dB}}/10}$; $T$ = predetection integration time (s); $d$ = early-late spacing (chips). Read off the design levers directly:</p>
<ul>
<li><strong>Narrower $d$</strong> lowers jitter (both formulas scale as $\sqrt d$) and improves multipath rejection.</li>
<li><strong>Larger $C/N_0$</strong> lowers jitter (as $1/\sqrt{C/N_0}$, faster for the squaring-loss term).</li>
<li><strong>Narrower $B_L$</strong> lowers jitter (as $\sqrt{B_L}$) but slows the dynamic response — the bandwidth trade again.</li>
<li>The <strong>squaring-loss bracket</strong> matters only at low $C/N_0$ or short $T$; at high $C/N_0$ it tends to 1 and the two formulas agree.</li>
</ul>`
      },
      {
        h: 'Lock detectors, cycle slips, and loss of lock',
        html: String.raw`<p>A tracking loop must know whether it is actually tracking. <strong>Lock detectors</strong> monitor the correlators:</p>
<ul>
<li><strong>Code lock:</strong> Prompt power well above Early/Late, or a running estimate of $C/N_0$ above threshold.</li>
<li><strong>Carrier (phase) lock:</strong> the ratio $ (P_I^2-P_Q^2)/(P_I^2+P_Q^2)$ near +1 indicates energy concentrated on the in-phase arm (phase locked); near 0 or negative signals loss of lock.</li>
</ul>
<p>Two failure modes dominate. A <strong>cycle slip</strong> occurs when noise or a dynamic transient pushes the carrier phase error past $\pm\tfrac\pi2$ (Costas) so the loop re-locks a half/whole cycle away, corrupting data until detected. <strong>Loss of lock</strong> occurs when the error leaves the discriminator's linear region — the S-curve flattens, feedback vanishes, and the loop drifts; the receiver must then declare loss and re-acquire. Wider $B_L$ resists dynamic loss of lock but slips more often on noise; narrower $B_L$ is quieter but fragile under dynamics — the same bandwidth-versus-dynamics-versus-jitter triangle that governs every choice in the loop.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>DSSS tracking is the continuous, closed-loop stage that keeps a despread signal alive after acquisition. You should now be able to say:</p>
<ul>
<li><strong>The purpose:</strong> tracking corrects (does not search) the residual code-phase and carrier errors that drift in from Doppler, oscillator error, and dynamics — acquisition parks the car, tracking steers it.</li>
<li><strong>The code machine:</strong> Early/Prompt/Late correlators ride the autocorrelation triangle; Early-minus-Late imbalance is the code error, and the Prompt (balanced E and L) feeds data demodulation.</li>
<li><strong>The discriminators:</strong> coherent $E-L$, non-coherent $E^2-L^2$, amplitude-independent normalized $(E^2-L^2)/(E^2+L^2)$, and the dot-product form — all with a negative-going S-curve zero-crossing at the stable lock point.</li>
<li><strong>The loop and its trade:</strong> discriminator &rarr; loop filter (sets $B_L$) &rarr; code NCO; wide $B_L$ tracks dynamics but admits noise, narrow $B_L$ is quiet but sluggish.</li>
<li><strong>The carrier partnership:</strong> a parallel FLL+Costas/PLL provides the phase reference, and carrier aiding scales carrier Doppler into the code NCO so the DLL can run narrow-band and low-jitter under high dynamics.</li>
<li><strong>The jitter law:</strong> $\sigma\approx\sqrt{B_L d/(2\,C/N_0)}$ (plus a squaring-loss bracket when non-coherent); narrow $d$, high $C/N_0$, and narrow $B_L$ all cut jitter, and lock detectors guard against cycle slips and loss of lock.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Tracking is the continuous closed-loop stage after acquisition; it corrects residual code-phase and carrier errors instead of searching.`,
      String.raw`The DLL uses three correlators: Early (advanced $d/2$), Prompt (aligned, feeds data), Late (retarded $d/2$), with $d$ the early-late spacing in chips.`,
      String.raw`Correlator outputs follow the code autocorrelation triangle $R(\tau)=1-\lvert\tau\rvert$ for $\lvert\tau\rvert\le1$; at $\tau=0$, $E=L$.`,
      String.raw`Coherent discriminator $D=E-L$; non-coherent $D=E^2-L^2$; amplitude-independent normalized $D=(E^2-L^2)/(E^2+L^2)$; plus the dot-product form using P as phase reference.`,
      String.raw`The S-curve (discriminator vs code error) has a negative-going zero-crossing at $\tau=0$ — the stable lock point.`,
      String.raw`For $d=1$ the linear pull-in region spans roughly $\pm1.5$ chips; narrower $d$ steepens the slope (lower jitter, better multipath rejection) but shrinks pull-in.`,
      String.raw`DLL chain: discriminator $\to$ loop filter (sets loop noise bandwidth $B_L$) $\to$ code NCO that adjusts the local chipping rate to null the error.`,
      String.raw`A first-order loop zeros a constant offset; a second-order loop also zeros a constant rate (Doppler) with no steady-state error.`,
      String.raw`Carrier tracking runs in parallel: an FLL pulls in frequency, a Costas/PLL locks phase from the Prompt I/Q, giving the reference the coherent code discriminator needs.`,
      String.raw`Carrier aiding scales carrier-loop Doppler into the code NCO, letting the DLL use a very narrow $B_L$ (low jitter) while tracking high dynamics.`,
      String.raw`Coherent code jitter $\sigma\approx\sqrt{B_L d/(2\,C/N_0)}$ in chips; non-coherent multiplies by a squaring-loss bracket $1+1/((2-d)T\,C/N_0)$.`,
      String.raw`In the jitter formulas $C/N_0$ is a linear ratio in Hz (convert from dB-Hz), $B_L$ is in Hz, $T$ in seconds, $d$ in chips.`,
      String.raw`Narrower $d$, larger $C/N_0$, and narrower $B_L$ all reduce code jitter; the bandwidth choice trades jitter against dynamic tracking.`,
      String.raw`Lock detectors watch Prompt power and the carrier ratio $(P_I^2-P_Q^2)/(P_I^2+P_Q^2)$; cycle slips (phase past $\pm\pi/2$) and loss of lock (error out of the linear region) trigger re-acquisition.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-tracking-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Delay-locked loop: Early / Prompt / Late correlators</text>
<line x1="12" y1="130" x2="60" y2="130" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#dsss-tracking-a1)"/>
<text x="10" y="122" fill="#9aa7b5" font-size="10">$r(t)$</text>
<!-- Early branch -->
<circle cx="90" cy="60" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="84" y="65" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="120" y="48" width="66" height="24" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="130" y="64" fill="#e6edf3" font-size="10">$\int_0^T$</text>
<text x="192" y="55" fill="#63e6be" font-size="11">E</text>
<text x="60" y="44" fill="#9aa7b5" font-size="9">code$+d/2$</text>
<!-- Prompt branch -->
<circle cx="90" cy="130" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="84" y="135" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="120" y="118" width="66" height="24" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="130" y="134" fill="#e6edf3" font-size="10">$\int_0^T$</text>
<text x="192" y="125" fill="#63e6be" font-size="11">P</text>
<text x="66" y="114" fill="#9aa7b5" font-size="9">code (aligned)</text>
<!-- Late branch -->
<circle cx="90" cy="200" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="84" y="205" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="120" y="188" width="66" height="24" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="130" y="204" fill="#e6edf3" font-size="10">$\int_0^T$</text>
<text x="192" y="197" fill="#63e6be" font-size="11">L</text>
<text x="62" y="228" fill="#9aa7b5" font-size="9">code$-d/2$</text>
<line x1="60" y1="130" x2="60" y2="60" stroke="#9aa7b5" stroke-width="1.1"/><line x1="60" y1="60" x2="78" y2="60" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<line x1="78" y1="130" x2="102" y2="130" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<line x1="60" y1="130" x2="60" y2="200" stroke="#9aa7b5" stroke-width="1.1"/><line x1="60" y1="200" x2="78" y2="200" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<line x1="102" y1="60" x2="120" y2="60" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<line x1="102" y1="200" x2="120" y2="200" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<line x1="186" y1="130" x2="220" y2="130" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<text x="204" y="124" fill="#b197fc" font-size="9">data</text>
<!-- discriminator + filter + NCO -->
<rect x="220" y="42" width="90" height="176" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.4"/>
<text x="230" y="118" fill="#e6edf3" font-size="10">discrim.</text>
<text x="230" y="134" fill="#9aa7b5" font-size="9">$E-L$</text>
<line x1="186" y1="55" x2="220" y2="80" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<line x1="186" y1="200" x2="220" y2="180" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<rect x="330" y="100" width="82" height="30" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="340" y="119" fill="#e6edf3" font-size="9">loop filter</text>
<line x1="310" y1="130" x2="330" y2="115" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<rect x="432" y="100" width="82" height="30" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/><text x="446" y="119" fill="#e6edf3" font-size="9">code NCO</text>
<line x1="412" y1="115" x2="432" y2="115" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<line x1="473" y1="130" x2="473" y2="240" stroke="#9aa7b5" stroke-width="1.1"/><line x1="473" y1="240" x2="90" y2="240" stroke="#9aa7b5" stroke-width="1.1"/><line x1="90" y1="240" x2="90" y2="212" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-tracking-a1)"/>
<text x="250" y="252" fill="#9aa7b5" font-size="9">feedback adjusts local chipping rate</text>
</svg>`,
        caption: 'DLL block diagram: three correlators (Early advanced d/2, Prompt aligned, Late retarded d/2) integrate over T; the discriminator (E-L) drives a loop filter (setting B_L) and a code NCO that adjusts the local chipping rate to null the error. The Prompt output feeds data demodulation.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Autocorrelation triangle with Early / Prompt / Late taps</text>
<line x1="40" y1="200" x2="510" y2="200" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="275" y1="60" x2="275" y2="210" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="4 3"/>
<text x="500" y="216" fill="#9aa7b5" font-size="10">$\tau$ (chips)</text>
<text x="282" y="72" fill="#9aa7b5" font-size="10">$R(\tau)$</text>
<!-- triangle: peak at (275,70), zeros at (155,200) and (395,200) -->
<path d="M155,200 L275,70 L395,200" fill="none" stroke="#4dabf7" stroke-width="2"/>
<!-- prompt at tau=0 (peak) -->
<circle cx="275" cy="70" r="4" fill="#63e6be"/><text x="264" y="60" fill="#63e6be" font-size="10">P</text>
<!-- early at tau=+d/2 (right flank), late at tau=-d/2 (left flank) for aligned case -->
<circle cx="335" cy="135" r="4" fill="#ffa94d"/><text x="342" y="132" fill="#ffa94d" font-size="10">E</text>
<circle cx="215" cy="135" r="4" fill="#ff6b6b"/><text x="196" y="132" fill="#ff6b6b" font-size="10">L</text>
<line x1="335" y1="135" x2="335" y2="200" stroke="#ffa94d" stroke-width="0.8" stroke-dasharray="3 2"/>
<line x1="215" y1="135" x2="215" y2="200" stroke="#ff6b6b" stroke-width="0.8" stroke-dasharray="3 2"/>
<text x="300" y="214" fill="#ffa94d" font-size="9">$+d/2$</text>
<text x="200" y="214" fill="#ff6b6b" font-size="9">$-d/2$</text>
<text x="60" y="240" fill="#9aa7b5" font-size="10">When aligned ($\tau=0$): E = L, so $D=E-L=0$. A shift unbalances them and generates the error.</text>
</svg>`,
        caption: 'The code autocorrelation triangle R(tau)=1-|tau|. Prompt sits on the peak; Early (+d/2) and Late (-d/2) straddle it on the flanks. At perfect alignment E and L are equal, so the discriminator E-L is zero; any code-phase offset tips the balance and produces a signed error.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Discriminator S-curve: negative-going zero-crossing = lock point</text>
<line x1="40" y1="140" x2="510" y2="140" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="275" y1="40" x2="275" y2="240" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="4 3"/>
<text x="498" y="156" fill="#9aa7b5" font-size="10">$\tau$ (chips)</text>
<text x="282" y="52" fill="#9aa7b5" font-size="10">$D(\tau)$</text>
<!-- S-curve: flat left, linear through origin (neg slope), flat right -->
<path d="M70,80 L150,80 L275,140 L400,200 L480,200" fill="none" stroke="#63e6be" stroke-width="2"/>
<!-- highlight linear region -->
<line x1="150" y1="235" x2="400" y2="235" stroke="#b197fc" stroke-width="1.5"/>
<text x="210" y="230" fill="#b197fc" font-size="10">linear pull-in region</text>
<circle cx="275" cy="140" r="4" fill="#ffa94d"/><text x="284" y="132" fill="#ffa94d" font-size="10">stable lock (neg slope)</text>
<text x="330" y="105" fill="#9aa7b5" font-size="9">$\tau>0\Rightarrow D<0$</text>
<text x="120" y="185" fill="#9aa7b5" font-size="9">$\tau<0\Rightarrow D>0$</text>
<text x="60" y="70" fill="#4dabf7" font-size="9">flat: no feedback (loss of lock)</text>
<text x="410" y="192" fill="#4dabf7" font-size="9">flat</text>
</svg>`,
        caption: 'The discriminator S-curve: output D(tau) versus code-phase error. It is linear through the origin with a negative slope, so a late replica (tau>0) gets a negative correction and an early replica a positive one — the negative-going zero-crossing is the stable lock point. Outside the linear pull-in region the curve flattens and the loop cannot recover.'
      }
    ],
    equations: [
      {
        title: 'Code Autocorrelation Triangle',
        tex: String.raw`$$R(\tau)=1-\lvert\tau\rvert,\quad \lvert\tau\rvert\le1;\qquad R(\tau)=0,\ \lvert\tau\rvert>1$$`,
        derivation: String.raw`<p><b>Where we start.</b> A long PN code is a stream of $\pm1$ chips, each of duration $T_c$, with the ideal property that averaged over a period the code is uncorrelated with any nonzero shift of itself. We correlate the code $c(t)$ with a copy shifted by $\tau$ chips: $R(\tau)=\overline{c(t)\,c(t-\tau T_c)}$, normalized so $R(0)=1$.</p>
<p><b>Step 1.</b> Consider a shift of $\tau$ chips with $0\le\tau\le1$. Within each chip interval the shifted copy overlaps the original chip for a fraction $1-\tau$ of the time and overlaps the neighbouring chip for the remaining fraction $\tau$.</p>
<p><b>Step 2.</b> Over the matched fraction $1-\tau$ the product $c\cdot c=+1$ (a chip against itself). Over the mismatched fraction $\tau$ the product involves independent $\pm1$ neighbouring chips, which for an ideal code average to $0$. So the correlation contributes $(1-\tau)\cdot1+\tau\cdot0=1-\tau$.</p>
<p><b>Result.</b> By symmetry the same holds for negative shifts, giving $R(\tau)=1-\lvert\tau\rvert$ for $\lvert\tau\rvert\le1$ and $R(\tau)=0$ beyond one chip (no overlap of the same chip). This triangular peak, only $\pm1$ chip wide, is the object the DLL rides — Early and Late sample its two flanks, and its narrowness is exactly why fractional-chip tracking is both necessary and possible.</p>`
      },
      {
        title: 'Early and Late Correlator Outputs',
        tex: String.raw`$$E=A\,R\!\left(\tau+\tfrac d2\right),\qquad L=A\,R\!\left(\tau-\tfrac d2\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Let $\tau$ be the code-phase error between the incoming code and the Prompt replica (in chips), $A$ the signal amplitude after carrier wipe-off, and $d$ the early-late spacing. The Early replica is advanced by $d/2$ and the Late replica retarded by $d/2$ relative to Prompt.</p>
<p><b>Step 1.</b> Each correlator output is the signal amplitude times the code autocorrelation evaluated at that branch's net offset from the incoming code. The Prompt offset from the incoming code is $\tau$, so $P=A\,R(\tau)$.</p>
<p><b>Step 2.</b> Advancing the Early replica by $d/2$ makes its net offset from the incoming code $\tau+d/2$; retarding the Late replica by $d/2$ makes its offset $\tau-d/2$. Multiplying each by $A$ and by the triangle $R(\cdot)$ gives $E=A\,R(\tau+d/2)$ and $L=A\,R(\tau-d/2)$.</p>
<p><b>Result.</b> At perfect alignment $\tau=0$: $E=A\,R(d/2)=L=A\,R(-d/2)$ because $R$ is even, so $E=L$ and the discriminator is zero. Any nonzero $\tau$ moves one sample up the triangle and the other down, unbalancing $E$ and $L$ by an amount proportional (near the peak) to $\tau$ — this is the raw material of every DLL discriminator.</p>`
      },
      {
        title: 'Coherent Early-Minus-Late Discriminator',
        tex: String.raw`$$D_{\text{coh}}=E-L=A\big[R(\tau+\tfrac d2)-R(\tau-\tfrac d2)\big]$$`,
        derivation: String.raw`<p><b>Where we start.</b> Assume the carrier PLL is locked so the signal energy is on the in-phase arm and $E,L$ are real (signed) correlator outputs. Take their difference as the error estimate $D_{\text{coh}}=E-L$.</p>
<p><b>Step 1.</b> Substitute the Early/Late outputs: $D_{\text{coh}}=A\,R(\tau+d/2)-A\,R(\tau-d/2)$. Consider a small error $\tau$ with $d=1$, so the samples sit on the two straight flanks of the triangle near the peak.</p>
<p><b>Step 2.</b> On the right flank $R(\tau+d/2)=1-(\tau+d/2)$ and on the left flank $R(\tau-d/2)=1-\lvert\tau-d/2\rvert=1-(d/2-\tau)$ for small $\tau$. Subtracting: $D_{\text{coh}}=A\big[(1-\tau-\tfrac d2)-(1-\tfrac d2+\tau)\big]=A(-2\tau)=-2A\,\tau$.</p>
<p><b>Result.</b> Near lock the coherent discriminator is $D_{\text{coh}}\approx-2A\,\tau$ — a straight line through the origin with negative slope. Positive error (replica late) yields negative $D$, which the loop uses to advance the code and drive $\tau$ back to zero. This is the lowest-jitter discriminator but requires a good carrier phase reference to keep the energy real.</p>`
      },
      {
        title: 'Normalized Non-Coherent Discriminator',
        tex: String.raw`$$D_{\text{norm}}=\frac{E^2-L^2}{E^2+L^2}$$`,
        derivation: String.raw`<p><b>Where we start.</b> When carrier phase is uncertain, $E$ and $L$ carry an unknown phase $\phi$: the in-phase and quadrature parts combine as $E^2=E_I^2+E_Q^2$ and $L^2=L_I^2+L_Q^2$, which are phase-independent powers. Build the discriminator from these powers.</p>
<p><b>Step 1.</b> The raw non-coherent form $E^2-L^2$ removes the phase dependence but scales with signal amplitude $A^2$, so its slope and lock behaviour drift with AGC error and fading. To fix that, divide by the total power $E^2+L^2$.</p>
<p><b>Step 2.</b> Substitute the triangle values (take $d=1$, small $\tau$): with $E=A(1-d/2-\tau)$ and $L=A(1-d/2+\tau)$ the amplitude $A$ cancels in the ratio. Numerator $E^2-L^2=(E-L)(E+L)$; denominator $E^2+L^2$. Both are quadratic in $A$, so $D_{\text{norm}}$ depends only on $\tau$ and $d$, not on $A$.</p>
<p><b>Result.</b> $D_{\text{norm}}=(E^2-L^2)/(E^2+L^2)$ is amplitude-independent: it reads the same $\tfrac{}{}$ error whether the signal is strong or weak, so it is immune to gain errors and slow fading. It bounds the output to $[-1,1]$, keeping the loop gain well-conditioned, and it is the workhorse code discriminator when a clean phase lock is not guaranteed — at the price of squaring loss at low SNR.</p>`
      },
      {
        title: 'S-Curve Slope Near Lock',
        tex: String.raw`$$\left.\frac{dD_{\text{coh}}}{d\tau}\right|_{\tau=0}=-2A\quad(d=1),\ \ \text{generally }\propto-A$$`,
        derivation: String.raw`<p><b>Where we start.</b> The loop gain and thus the jitter and pull-in range are set by the discriminator's slope at the zero-crossing. Take the coherent form $D_{\text{coh}}(\tau)=A[R(\tau+d/2)-R(\tau-d/2)]$ and differentiate at $\tau=0$.</p>
<p><b>Step 1.</b> On the triangle the derivative of $R$ is $R'(\tau)=-\,\mathrm{sgn}(\tau)$ for $0<\lvert\tau\rvert<1$ (slope $-1$ on the right flank, $+1$ on the left). So $dD/d\tau=A[R'(\tau+d/2)-R'(\tau-d/2)]$.</p>
<p><b>Step 2.</b> At $\tau=0$ with $d=1$: the Early sample sits at $+d/2=+0.5$ (right flank, $R'=-1$) and the Late sample at $-d/2=-0.5$ (left flank, $R'=+1$). Thus $dD/d\tau=A[(-1)-(+1)]=-2A$.</p>
<p><b>Result.</b> The slope at lock is $-2A$ for $d=1$, and in general the magnitude grows as $d$ shrinks because the two samples climb steeper parts of the flanks relative to the offset — a <em>narrow correlator</em> has a steeper S-curve, hence lower thermal jitter and sharper multipath rejection, but a correspondingly smaller linear pull-in region. The negative sign is what makes the zero-crossing stable.</p>`
      },
      {
        title: 'Coherent DLL Code Tracking Jitter',
        tex: String.raw`$$\sigma_{\text{coh}}\approx\sqrt{\frac{B_L\,d}{2\,(C/N_0)}}\ \ \text{[chips]}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Noise on the Early and Late correlators perturbs the discriminator, so the estimated code phase jitters around zero. We want the 1-sigma jitter $\sigma$ (in chips) as a function of loop noise bandwidth $B_L$, early-late spacing $d$, and carrier-to-noise ratio $C/N_0$ (a linear ratio in Hz).</p>
<p><b>Step 1.</b> The variance of the code-phase estimate equals the discriminator output noise variance divided by the square of its slope, then shaped by the loop's noise bandwidth. The correlator noise power passed by the loop scales with $B_L$; the useful signal scales with $C/N_0$; and the discriminator geometry contributes the factor $d$ (a narrower spacing samples a steeper part of the triangle, reducing the effective noise gain proportionally to $d$).</p>
<p><b>Step 2.</b> Collecting these, the code-phase error variance is $\sigma^2\approx \dfrac{B_L\,d}{2\,(C/N_0)}$, where the factor $2$ comes from the two-flank (Early and Late) differencing and the definition of $B_L$ as a one-sided loop noise bandwidth.</p>
<p><b>Result.</b> $\sigma_{\text{coh}}\approx\sqrt{B_L\,d/(2\,C/N_0)}$ chips. The design levers are explicit: jitter falls as $\sqrt d$ (narrow correlator), as $\sqrt{B_L}$ (narrow loop), and as $1/\sqrt{C/N_0}$ (stronger signal). To convert a $C/N_0$ given in dB-Hz, use $C/N_0=10^{(C/N_0)_{\text{dB}}/10}$ before substituting.</p>`
      },
      {
        title: 'Non-Coherent DLL Jitter (Squaring Loss)',
        tex: String.raw`$$\sigma_{\text{ncoh}}\approx\sqrt{\frac{B_L\,d}{2\,(C/N_0)}\left(1+\frac{1}{(2-d)\,T\,(C/N_0)}\right)}\ \ \text{[chips]}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A non-coherent discriminator squares the Early and Late envelopes to remove carrier phase. Squaring multiplies signal-times-noise and noise-times-noise terms, adding an extra noise term absent in the coherent case — the <em>squaring loss</em>. We correct the coherent jitter for it.</p>
<p><b>Step 1.</b> The signal-times-noise cross term reproduces the coherent variance $\sigma_{\text{coh}}^2=B_L d/(2\,C/N_0)$. The additional noise-times-noise term scales inversely with the number of independent noise samples integrated, i.e. with the predetection integration time $T$ and again with $C/N_0$, and with the effective correlator overlap $(2-d)$.</p>
<p><b>Step 2.</b> Writing the extra term as a multiplicative bracket on the coherent variance gives $\sigma_{\text{ncoh}}^2=\sigma_{\text{coh}}^2\big(1+\tfrac{1}{(2-d)T(C/N_0)}\big)$. The bracket exceeds 1 and grows as $C/N_0$ or $T$ shrink — exactly where squaring loss bites.</p>
<p><b>Result.</b> $\sigma_{\text{ncoh}}\approx\sqrt{\dfrac{B_L d}{2(C/N_0)}\big(1+\tfrac{1}{(2-d)T(C/N_0)}\big)}$ chips. At high $C/N_0$ the bracket tends to 1 and the non-coherent loop matches the coherent one; at low $C/N_0$ the squaring loss dominates, which is why weak-signal receivers lengthen $T$ and, when possible, use carrier phase to go coherent.</p>`
      },
      {
        title: 'Code NCO Rate Update',
        tex: String.raw`$$f_{\text{co}}[n]=f_{\text{co,0}}+K\,D(\tau[n]),\qquad \phi_{\text{co}}[n{+}1]=\phi_{\text{co}}[n]+\frac{f_{\text{co}}[n]}{f_s}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The code NCO is a phase accumulator clocked at sample rate $f_s$: it adds a phase step each clock and emits a code chip whenever its accumulated phase crosses an integer chip boundary. Its output chipping rate $f_{\text{co}}$ is set by the size of that step. The loop must adjust $f_{\text{co}}$ to null the measured error $D(\tau)$.</p>
<p><b>Step 1.</b> Start from the nominal chipping rate $f_{\text{co,0}}$ (the acquisition estimate, including nominal code Doppler). Each integration period the discriminator returns $D(\tau[n])$, a signed estimate of the residual error in chips.</p>
<p><b>Step 2.</b> The loop filter converts $D$ into a rate correction with gain $K$ (containing the loop-filter coefficients that set $B_L$): $f_{\text{co}}[n]=f_{\text{co,0}}+K\,D(\tau[n])$. If the replica is late ($\tau>0$, $D<0$ for the negative-slope discriminator) the correction lowers the chipping rate so the replica catches up; if early, it raises the rate.</p>
<p><b>Result.</b> The NCO integrates this rate into phase, $\phi_{\text{co}}[n{+}1]=\phi_{\text{co}}[n]+f_{\text{co}}[n]/f_s$, advancing the local code exactly fast enough to hold $\tau\to0$. Adding a second (integrating) filter branch makes the loop second-order, driving the steady-state error to zero even under constant code Doppler, and carrier aiding adds a scaled carrier-Doppler term to $f_{\text{co,0}}$ to offload the dynamics.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What problem does DSSS tracking solve that acquisition does not?`, back: String.raw`Acquisition finds code phase/Doppler coarsely once; tracking continuously corrects the residual drift from code Doppler, oscillator error, and dynamics so lock is maintained.` },
      { front: String.raw`Name the three correlators in a DLL and what each does.`, back: String.raw`Early (replica advanced $d/2$), Prompt (aligned, feeds data demod), Late (replica retarded $d/2$). Early minus Late gives the code-phase error.` },
      { front: String.raw`What is the early-late spacing $d$ and a typical value?`, back: String.raw`The separation in chips between the Early and Late replicas; $d=1$ chip standard, or $d=0.1$ to $0.5$ for a narrow correlator.` },
      { front: String.raw`Write the code autocorrelation triangle.`, back: String.raw`$R(\tau)=1-\lvert\tau\rvert$ for $\lvert\tau\rvert\le1$, else $0$. Its peak is only $\pm1$ chip wide.` },
      { front: String.raw`Why is $E=L$ at perfect alignment?`, back: String.raw`At $\tau=0$ the Early and Late samples sit symmetrically on the two flanks of the even triangle $R$, so $R(d/2)=R(-d/2)$ and the discriminator $E-L=0$.` },
      { front: String.raw`Give the coherent and non-coherent power discriminators.`, back: String.raw`Coherent: $D=E-L$. Non-coherent: $D=E^2-L^2=(E_I^2+E_Q^2)-(L_I^2+L_Q^2)$.` },
      { front: String.raw`Why use the normalized discriminator $(E^2-L^2)/(E^2+L^2)$?`, back: String.raw`Dividing by total power makes it amplitude-independent — immune to AGC error and slow fading — and bounds the output to $[-1,1]$.` },
      { front: String.raw`What is the dot-product discriminator?`, back: String.raw`$D=(E_I-L_I)P_I+(E_Q-L_Q)P_Q$, using the Prompt as phase reference; quasi-coherent and cheap, common in GNSS.` },
      { front: String.raw`Describe the S-curve and its lock point.`, back: String.raw`Discriminator output vs code error; linear through the origin with a negative slope, so the negative-going zero-crossing at $\tau=0$ is the stable lock point.` },
      { front: String.raw`How does narrow $d$ affect the S-curve and tracking?`, back: String.raw`Steeper slope: lower thermal jitter and better multipath rejection, but a smaller pull-in region and tighter handover requirement.` },
      { front: String.raw`List the DLL loop blocks after the correlators.`, back: String.raw`Discriminator $\to$ loop filter (sets loop noise bandwidth $B_L$) $\to$ code NCO that adjusts the local chipping rate.` },
      { front: String.raw`What is carrier aiding and why does it help?`, back: String.raw`Feeding scaled carrier-loop Doppler into the code NCO removes the code loop's dynamic stress, letting it use a narrow $B_L$ (low jitter) while still tracking high dynamics.` },
      { front: String.raw`State the coherent code-jitter formula and its symbols.`, back: String.raw`$\sigma\approx\sqrt{B_L d/(2\,C/N_0)}$ chips; $B_L$ = loop bandwidth (Hz), $d$ = spacing (chips), $C/N_0$ = ratio in Hz (not dB).` },
      { front: String.raw`What is squaring loss in a non-coherent DLL?`, back: String.raw`Squaring the envelopes adds a noise-times-noise term, the bracket $1+1/((2-d)T\,C/N_0)$; it dominates at low $C/N_0$ or short $T$ and vanishes at high $C/N_0$.` },
      { front: String.raw`What is a cycle slip?`, back: String.raw`When noise/dynamics push the carrier phase error past $\pm\pi/2$ (Costas), the loop re-locks a half/whole cycle away, corrupting data until detected.` },
      { front: String.raw`How does a carrier phase-lock detector work?`, back: String.raw`It watches $(P_I^2-P_Q^2)/(P_I^2+P_Q^2)$: near $+1$ means energy is on the in-phase arm (locked); near $0$ or negative signals loss of lock.` }
    ],
    mcqs: [
      { q: String.raw`The fundamental job of DSSS tracking (as distinct from acquisition) is to:`, options: [String.raw`search a 2-D code/Doppler grid`, String.raw`continuously correct residual code-phase and carrier drift`, String.raw`generate the spreading code`, String.raw`increase the processing gain`], answer: 1, explain: String.raw`Acquisition searches; tracking is the closed loop that keeps the replica aligned as it drifts.` },
      { q: String.raw`In a DLL, which correlator output is used for data demodulation?`, options: [String.raw`Early`, String.raw`Prompt`, String.raw`Late`, String.raw`Early minus Late`], answer: 1, explain: String.raw`The Prompt (aligned) correlator is the despread signal fed to the demodulator; Early/Late only steer the loop.` },
      { q: String.raw`The Early and Late replicas are offset from Prompt by:`, options: [String.raw`$\pm d$ chips`, String.raw`$\pm d/2$ chips`, String.raw`$\pm1$ bit`, String.raw`$\pm d/4$ chips`], answer: 1, explain: String.raw`Early is advanced $d/2$ and Late retarded $d/2$, so they are separated by $d$ and centered on Prompt.` },
      { q: String.raw`The ideal PN code autocorrelation for $\lvert\tau\rvert\le1$ chip is:`, options: [String.raw`$\cos\tau$`, String.raw`$1-\lvert\tau\rvert$ (triangle)`, String.raw`$e^{-\tau}$`, String.raw`a rectangle`], answer: 1, explain: String.raw`Overlap of matched chips falls linearly with shift, giving the triangle $1-\lvert\tau\rvert$.` },
      { q: String.raw`At perfect code alignment ($\tau=0$), the coherent discriminator $E-L$ equals:`, options: [String.raw`its maximum`, String.raw`zero`, String.raw`the Prompt value`, String.raw`$-1$`], answer: 1, explain: String.raw`$E$ and $L$ sit symmetrically on the even triangle, so they are equal and their difference is zero.` },
      { q: String.raw`Which discriminator is amplitude-independent (immune to AGC/fading)?`, options: [String.raw`$E-L$`, String.raw`$E^2-L^2$`, String.raw`$(E^2-L^2)/(E^2+L^2)$`, String.raw`$E+L$`], answer: 2, explain: String.raw`Dividing by total power cancels the amplitude, so the normalized form depends only on the error.` },
      { q: String.raw`The stable lock point on the S-curve is where the curve:`, options: [String.raw`peaks`, String.raw`crosses zero with negative slope`, String.raw`crosses zero with positive slope`, String.raw`is flat`], answer: 1, explain: String.raw`A negative-going zero-crossing feeds errors back toward zero; a positive one would be unstable.` },
      { q: String.raw`Choosing a narrower early-late spacing $d$ (narrow correlator) primarily:`, options: [String.raw`widens the pull-in region`, String.raw`lowers thermal jitter and improves multipath rejection`, String.raw`removes the need for carrier tracking`, String.raw`increases the data rate`], answer: 1, explain: String.raw`A steeper S-curve slope reduces jitter and rejects multipath, at the cost of a smaller pull-in range.` },
      { q: String.raw`In the DLL, the block that sets the loop noise bandwidth $B_L$ is the:`, options: [String.raw`correlator`, String.raw`loop filter`, String.raw`code NCO`, String.raw`AGC`], answer: 1, explain: String.raw`The loop filter's coefficients determine $B_L$; the NCO merely applies the resulting rate correction.` },
      { q: String.raw`Carrier aiding of the code loop allows the DLL to:`, options: [String.raw`use a wider $B_L$ for the same jitter`, String.raw`use a narrower $B_L$ while still tracking dynamics`, String.raw`ignore the Prompt correlator`, String.raw`skip acquisition`], answer: 1, explain: String.raw`The carrier loop supplies the Doppler, offloading dynamics so the code loop can be narrow-band and low-jitter.` },
      { q: String.raw`In $\sigma\approx\sqrt{B_L d/(2\,C/N_0)}$, the quantity $C/N_0$ must be expressed as:`, options: [String.raw`a value in dB-Hz`, String.raw`a linear ratio in Hz`, String.raw`dimensionless dB`, String.raw`watts`], answer: 1, explain: String.raw`It is a linear ratio in Hz; convert dB-Hz via $10^{(C/N_0)_{dB}/10}$ before substituting.` },
      { q: String.raw`The squaring-loss bracket $1+1/((2-d)T\,C/N_0)$ becomes negligible when:`, options: [String.raw`$C/N_0$ is small`, String.raw`$T$ is very short`, String.raw`$C/N_0$ is large`, String.raw`$d\to2$`], answer: 2, explain: String.raw`At high $C/N_0$ the added noise-times-noise term vanishes and the bracket tends to 1.` },
      { q: String.raw`A cycle slip in the carrier loop occurs when the phase error:`, options: [String.raw`stays within $\pm\pi/8$`, String.raw`exceeds $\pm\pi/2$ (Costas)`, String.raw`is exactly zero`, String.raw`equals the Doppler`], answer: 1, explain: String.raw`Past $\pm\pi/2$ a Costas loop re-locks a half/whole cycle away, corrupting data until detected.` },
      { q: String.raw`Choosing the DLL loop bandwidth $B_L$ is a trade among:`, options: [String.raw`gain, phase, and delay`, String.raw`dynamics, jitter, and noise`, String.raw`chips, bits, and symbols`, String.raw`code, Gold, and Barker`], answer: 1, explain: String.raw`Wide $B_L$ tracks dynamics but admits more noise (jitter); narrow $B_L$ is quiet but sluggish.` },
      { q: String.raw`Which loop is typically used first after handover to pull in a large frequency error?`, options: [String.raw`PLL`, String.raw`Costas`, String.raw`FLL`, String.raw`DLL`], answer: 2, explain: String.raw`The FLL robustly pulls in frequency; the PLL/Costas then locks phase once the error is small.` },
      { q: String.raw`Loss of lock (as opposed to a cycle slip) happens when the tracking error:`, options: [String.raw`stays near zero`, String.raw`leaves the discriminator's linear region so feedback vanishes`, String.raw`equals half a chip exactly`, String.raw`is negative`], answer: 1, explain: String.raw`Outside the linear region the S-curve flattens, feedback disappears, the loop drifts, and re-acquisition is needed.` }
    ],
    numericals: [
      {
        q: String.raw`A coherent DLL has loop bandwidth $B_L=1$ Hz, early-late spacing $d=0.5$ chip, and $C/N_0=40$ dB-Hz. Find the 1-sigma code tracking jitter in chips.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_{\text{coh}}=\sqrt{\frac{B_L\,d}{2\,(C/N_0)}}\ \text{[chips]},$$ with $C/N_0$ a linear ratio in Hz (convert from dB-Hz first).</p>
<p><b>Substitute.</b> $C/N_0=10^{40/10}=10^4$ Hz. Then $$\sigma_{\text{coh}}=\sqrt{\frac{1\times0.5}{2\times10^4}}=\sqrt{\frac{0.5}{2\times10^4}}.$$</p>
<p><b>Compute.</b> $\dfrac{0.5}{20000}=2.5\times10^{-5}$; $\sigma_{\text{coh}}=\sqrt{2.5\times10^{-5}}=\mathbf{5.0\times10^{-3}}$ chip (0.005 chip).</p>
<p><b>Explanation.</b> A 5-millichip jitter is excellent — well under a tenth of a chip — showing that a narrow loop ($B_L=1$ Hz), narrow spacing ($d=0.5$), and a healthy $40$ dB-Hz signal together give very tight code lock. The linear ratio conversion is essential: using $40$ directly would understate the signal by orders of magnitude.</p>`
      },
      {
        q: String.raw`Repeat the previous case but non-coherent, with predetection integration time $T=20$ ms ($0.02$ s), $d=0.5$, $B_L=1$ Hz, $C/N_0=40$ dB-Hz. How much does squaring loss inflate the jitter?`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_{\text{ncoh}}=\sqrt{\frac{B_L\,d}{2\,(C/N_0)}\left(1+\frac{1}{(2-d)\,T\,(C/N_0)}\right)}.$$</p>
<p><b>Substitute.</b> $C/N_0=10^4$ Hz, $d=0.5$, $T=0.02$ s. Bracket $=1+\dfrac{1}{(2-0.5)(0.02)(10^4)}=1+\dfrac{1}{1.5\times0.02\times10^4}=1+\dfrac{1}{300}$.</p>
<p><b>Compute.</b> Bracket $=1+0.00333=1.00333$. The coherent variance was $2.5\times10^{-5}$, so $\sigma_{\text{ncoh}}=\sqrt{2.5\times10^{-5}\times1.00333}=\sqrt{2.508\times10^{-5}}=\mathbf{5.008\times10^{-3}}$ chip.</p>
<p><b>Explanation.</b> At $40$ dB-Hz the squaring-loss bracket is only $1.0033$, so the jitter rises from $5.000$ to $5.008$ millichips — a negligible $0.17\%$. Squaring loss is harmless at strong signal; it only bites at low $C/N_0$ or short $T$, where the $1/((2-d)T\,C/N_0)$ term grows large.</p>`
      },
      {
        q: String.raw`Compare code jitter for a narrow correlator ($d=0.1$) versus a wide one ($d=1.0$), holding $B_L=2$ Hz and $C/N_0=35$ dB-Hz, coherent DLL.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_{\text{coh}}=\sqrt{\frac{B_L\,d}{2\,(C/N_0)}}\ \Rightarrow\ \frac{\sigma_{0.1}}{\sigma_{1.0}}=\sqrt{\frac{0.1}{1.0}}.$$</p>
<p><b>Substitute.</b> $C/N_0=10^{35/10}=10^{3.5}=3162$ Hz. For $d=1.0$: $\sigma=\sqrt{\dfrac{2\times1.0}{2\times3162}}=\sqrt{\dfrac{2}{6324}}$. For $d=0.1$: $\sigma=\sqrt{\dfrac{2\times0.1}{2\times3162}}=\sqrt{\dfrac{0.2}{6324}}$.</p>
<p><b>Compute.</b> $d=1.0$: $\sqrt{3.163\times10^{-4}}=1.78\times10^{-2}$ chip. $d=0.1$: $\sqrt{3.163\times10^{-5}}=5.62\times10^{-3}$ chip. Ratio $=\sqrt{0.1}=0.316$.</p>
<p><b>Explanation.</b> The narrow correlator cuts jitter from $17.8$ to $5.6$ millichips — a factor $\sqrt{10}\approx3.16$ improvement — and additionally rejects multipath. The cost, not shown by this formula, is a pull-in region shrunk roughly tenfold, demanding a more accurate acquisition handover.</p>`
      },
      {
        q: String.raw`Using the triangle autocorrelation with $d=1$ chip, compute the coherent discriminator $D=E-L$ (in units of amplitude $A$) for a code error of $\tau=0.2$ chip.`,
        solution: String.raw`<p><b>Formula.</b> $$D=E-L=A\big[R(\tau+\tfrac d2)-R(\tau-\tfrac d2)\big],\quad R(\tau)=1-\lvert\tau\rvert.$$</p>
<p><b>Substitute.</b> With $d=1$, $\tau=0.2$: Early offset $=0.2+0.5=0.7$; Late offset $=0.2-0.5=-0.3$. So $R(0.7)=1-0.7=0.3$ and $R(-0.3)=1-0.3=0.7$.</p>
<p><b>Compute.</b> $D=A(0.3-0.7)=\mathbf{-0.4\,A}$.</p>
<p><b>Explanation.</b> The negative output for a positive (late) error is exactly the negative-slope behaviour that pulls the loop back. Note $D=-0.4A=-2A\tau$ with $\tau=0.2$, confirming the near-lock linear slope $-2A$ derived for $d=1$ — the small-error approximation is exact here on the straight flanks.</p>`
      },
      {
        q: String.raw`A GPS C/A signal has chip rate $R_c=1.023$ Mcps. If the code jitter is $\sigma=0.02$ chip (1-sigma), what is the equivalent pseudorange jitter in metres?`,
        solution: String.raw`<p><b>Formula.</b> $$\ell_{\text{chip}}=\frac{c}{R_c},\qquad \sigma_{\text{range}}=\sigma\,\ell_{\text{chip}},$$ where $\ell_{\text{chip}}$ is the distance spanned by one chip and $c=3\times10^8$ m/s.</p>
<p><b>Substitute.</b> $\ell_{\text{chip}}=\dfrac{3\times10^8}{1.023\times10^6}$ m; $\sigma_{\text{range}}=0.02\times\ell_{\text{chip}}$.</p>
<p><b>Compute.</b> $\ell_{\text{chip}}=293.3$ m/chip; $\sigma_{\text{range}}=0.02\times293.3=\mathbf{5.87}$ m.</p>
<p><b>Explanation.</b> One C/A chip is about $293$ m of range, so a $0.02$-chip tracking jitter maps to roughly $5.9$ m of ranging noise — before carrier smoothing. This is why tight code tracking (and, ultimately, carrier-phase tracking at millimetre wavelengths) matters so much for GNSS accuracy.</p>`
      },
      {
        q: String.raw`Choose a DLL loop bandwidth. A platform produces a maximum code-phase dynamic that a first-order loop tracks with steady-state error $e_{ss}=R_D/(4B_L)$, where $R_D=0.05$ chip/s is the code-rate stress. What $B_L$ keeps $e_{ss}\le0.05$ chip?`,
        solution: String.raw`<p><b>Formula.</b> $$e_{ss}=\frac{R_D}{4B_L}\ \Rightarrow\ B_L\ge\frac{R_D}{4\,e_{ss}},$$ the steady-state velocity error of a first-order loop under a constant code-rate ramp $R_D$.</p>
<p><b>Substitute.</b> $R_D=0.05$ chip/s, $e_{ss}=0.05$ chip: $$B_L\ge\frac{0.05}{4\times0.05}=\frac{0.05}{0.2}.$$</p>
<p><b>Compute.</b> $B_L\ge0.25$ Hz. Choose $B_L=0.25$ Hz (or a little more for margin).</p>
<p><b>Explanation.</b> A wider loop reduces dynamic error but admits more noise (higher jitter via $\sigma\propto\sqrt{B_L}$), so the minimum $B_L$ that meets the dynamic requirement is preferred. Here $0.25$ Hz just satisfies the ramp; if dynamics were higher you would widen $B_L$ or add carrier aiding to offload the stress and keep the loop narrow.</p>`
      }
    ],
    realWorld: String.raw`<p>Every GNSS receiver in a phone, car, or aircraft runs exactly this machinery: after acquisition, each satellite channel spins up a carrier-aided DLL (often a narrow correlator, $d=0.1$ chip, to beat urban multipath) alongside an FLL-to-PLL carrier loop, all fed by Early/Prompt/Late correlators. The Prompt correlator's I/Q yields the 50 bps navigation data, while the code and carrier NCOs' running rate estimates become the pseudorange and Doppler measurements that the position solver consumes. Design choices are visible in performance specs: a high-dynamics receiver on a launch vehicle widens $B_L$ and leans hard on carrier aiding to survive acceleration, while a static survey receiver narrows $B_L$ to milli-hertz for the lowest possible jitter and centimetre ranging.</p>
<p>The same DLL/Costas structure appears well beyond GNSS — in CDMA cellular (IS-95/CDMA2000/WCDMA) RAKE fingers, each finger being an independently tracked correlator on one multipath component; in Zigbee and other DSSS links; and in deep-space telemetry, where extremely low $C/N_0$ forces very long integration $T$ and very narrow $B_L$ to keep the squaring-loss term in check. Understanding the jitter formula and the bandwidth-versus-dynamics-versus-jitter triangle is what lets an engineer pick $B_L$, $d$, and $T$ for a given $C/N_0$ and platform, and understand why lock is lost when a receiver is shaken, jammed, or driven into an urban canyon.</p>`,
    related: ['dsss-acquisition', 'dsss-data-extraction', 'dsss', 'early-late-correlator', 'dll']
  }
);
