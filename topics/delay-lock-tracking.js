/* delay-lock-tracking.js — "Delay-Lock Loop (Code Tracking)" topic (Spread Spectrum & Coding).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "delay-lock-tracking-" to avoid collisions.
   Focused on the DLL itself; cross-references dsss-tracking (receiver chain) and dll (clock loop),
   deliberately not duplicating them. */
CONTENT.topics.push(
  {
    id: 'delay-lock-tracking',
    title: 'Delay-Lock Loop (Code Tracking)',
    category: 'Spread Spectrum & Coding',
    tags: ['DLL', 'early-late', 'code tracking', 'discriminator', 'S-curve', 'code jitter', 'narrow correlator', 'code NCO', 'GNSS'],
    summary: String.raw`The delay-lock loop (DLL) is the classic code-phase tracking method for spread spectrum: three correlators (Early, Prompt, Late) ride the PN autocorrelation triangle, their Early/Late imbalance forms a discriminator whose S-curve has a stable negative-going zero crossing, and a loop filter plus code NCO null the code-phase error $\varepsilon$ while the Prompt arm feeds data demodulation.`,
    prerequisites: ['dsss', 'early-late-correlator', 'correlation'],
    intro: String.raw`<p><strong>Why do we need a whole feedback loop just to line up a code in time?</strong> A direct-sequence spread-spectrum signal only reveals itself when the receiver's local PN replica is aligned with the incoming code to within a small fraction of a chip. Miss by half a chip and the despread correlation peak collapses, the buried signal sinks back under the noise, and no data comes out. Acquisition gets you close — within roughly $\pm\tfrac12$ chip — but the alignment then drifts continuously as the transmitter moves, the receiver's clock wanders, and Doppler stretches or compresses the code. The <strong>delay-lock loop (DLL)</strong> is the mechanism that <em>holds</em> that fractional-chip alignment forever after, by measuring the residual code-phase error and steering the local code rate to drive it to zero.</p>
<p>The DLL is elegantly simple in principle. It runs <strong>three</strong> copies of the local code at slightly different delays — an <strong>Early (E)</strong> replica advanced by half the early-late spacing, a <strong>Prompt (P)</strong> replica at the loop's best estimate, and a <strong>Late (L)</strong> replica retarded by the same amount. Because the code autocorrelation is a sharp triangle, the Early and Late correlator outputs are equal only when the Prompt is exactly centred on the peak. Any misalignment tips the balance: if the replica is late, Early wins; if early, Late wins. The signed difference is an error voltage that a loop filter smooths and a <strong>code numerically-controlled oscillator (NCO)</strong> uses to nudge the local chipping rate until Early and Late rebalance — the instant the Prompt sits on the peak and hands the cleanest despread signal to the demodulator.</p>
<p>This topic is a focused, in-depth treatment of the loop itself. It complements the receiver-chain overview in <em>DSSS Tracking</em> and the clock-recovery <em>DLL</em> topic, and here we derive the machinery from scratch: the autocorrelation triangle, the Early/Late responses versus the error $\varepsilon$, the coherent and non-coherent (power, normalized, dot-product) discriminators, the S-curve and its slope, the linear pull-in range, the thermal-noise code jitter for coherent and non-coherent loops, and the code NCO rate update. By the end you will be able to size a DLL — its early-late spacing $\delta$, loop bandwidth $B_L$, and integration time $T$ — for a given signal strength and platform.</p>`,
    sections: [
      {
        h: 'Why a delay-lock loop: holding fractional-chip alignment',
        html: String.raw`<p><strong>Why bother, when acquisition already found the code?</strong> Because acquisition is a one-shot, open-loop <em>search</em> that ends the moment it declares detection — and detection only pins the code phase to within roughly half a chip. From that instant the true alignment starts to rot. Three physical effects push it:</p>
<ul>
<li><strong>Code Doppler:</strong> line-of-sight motion between transmitter and receiver stretches or compresses the arriving code, so its chip rate differs slightly from the nominal — the replica must chase a moving target.</li>
<li><strong>Oscillator drift:</strong> the receiver's own reference clock wanders with temperature and ageing, shifting the local chip rate independently of the signal.</li>
<li><strong>Platform dynamics:</strong> acceleration and jerk on a vehicle continuously change the code Doppler, not just its value but its rate.</li>
</ul>
<p>Left uncorrected, these slide the Prompt replica off the autocorrelation peak within milliseconds and the link dies. The DLL is the <em>closed-loop</em> answer: it does not search, it <em>corrects</em>. Each integration period it measures the residual code-phase error $\varepsilon$ (in chips) and feeds back a rate adjustment that drives $\varepsilon\to0$ and keeps it there. The whole point is continuous, automatic, fractional-chip precision that no open-loop search could ever maintain.</p>
<div class="callout"><strong>Intuition:</strong> acquisition parks the replica in roughly the right spot; the DLL is the servo that keeps it centred on a peak that is always drifting underfoot. If acquisition parks outside the loop's pull-in range, the DLL can never take over — handover accuracy and pull-in range must overlap.</div>`
      },
      {
        h: 'Structure: Early, Prompt, and Late correlators',
        html: String.raw`<p>The DLL generates three time-shifted replicas of the local PN code from a single code NCO and correlates each against the incoming despread signal over the integration time $T$. Let $\varepsilon$ be the code-phase error (in chips) between the incoming code and the <em>Prompt</em> replica, and let $\delta$ be the <strong>early-late spacing</strong> in chips.</p>
<ul>
<li><strong>Early (E):</strong> replica advanced by $\delta/2$ chip — its net offset from the incoming code is $\varepsilon+\delta/2$.</li>
<li><strong>Prompt (P):</strong> replica at the loop's current estimate — net offset $\varepsilon$; <em>this correlator's output feeds data demodulation</em>.</li>
<li><strong>Late (L):</strong> replica retarded by $\delta/2$ chip — net offset $\varepsilon-\delta/2$.</li>
</ul>
<p>Typical values of $\delta$ are $1.0$ chip (a "wide" correlator, the classic choice) or a <strong>narrow correlator</strong> $\delta=0.1$ to $0.5$ chip used in modern GNSS receivers for lower jitter and better multipath rejection. The three replicas are spaced symmetrically about the Prompt, so the Early and Late samples always straddle the peak that the Prompt is trying to sit on. The loop's entire job is to keep those two straddling samples balanced — because balanced Early and Late is exactly the condition that the Prompt is centred.</p>
<table class="data">
<tr><th>Replica</th><th>Delay offset (chips)</th><th>Net offset from incoming code</th><th>Role</th></tr>
<tr><td>Early (E)</td><td>$+\delta/2$</td><td>$\varepsilon+\delta/2$</td><td>steers loop (samples the flank at $+\delta/2$)</td></tr>
<tr><td>Prompt (P)</td><td>$0$</td><td>$\varepsilon$</td><td>data demodulation</td></tr>
<tr><td>Late (L)</td><td>$-\delta/2$</td><td>$\varepsilon-\delta/2$</td><td>steers loop (samples the flank at $-\delta/2$)</td></tr>
</table>`
      },
      {
        h: 'The autocorrelation triangle and E/P/L on its flanks',
        html: String.raw`<p>Everything the DLL does rests on the shape of the PN code autocorrelation. For an ideal long code of $\pm1$ chips, correlating the code with a copy shifted by $\tau$ chips gives the <strong>triangle function</strong></p>
<p>$$R(\tau)=\begin{cases}1-\lvert\tau\rvert,&\lvert\tau\rvert\le1,\\[2pt]0,&\lvert\tau\rvert>1,\end{cases}$$</p>
<p>because a fraction $1-\lvert\tau\rvert$ of the chips still line up while the rest average to zero. The peak is only $\pm1$ chip wide, which is precisely why sub-chip tracking is both necessary and possible: the correlation collapses fast off the peak, so a tiny shift produces a measurable change. The three correlator magnitudes (after carrier wipe-off, amplitude $A$) are</p>
<p>$$E=A\,R\!\left(\varepsilon+\tfrac\delta2\right),\qquad P=A\,R(\varepsilon),\qquad L=A\,R\!\left(\varepsilon-\tfrac\delta2\right).$$</p>
<p>When $\varepsilon=0$ (perfect alignment) the Early sample sits at $+\delta/2$ on the trailing flank and the Late sample at $-\delta/2$ on the leading flank; because $R$ is even, $R(\delta/2)=R(-\delta/2)$, so $E=L$. Any nonzero $\varepsilon$ moves one sample up the triangle and the other down, and that imbalance is the raw tracking error. The Prompt, meanwhile, is largest exactly at $\varepsilon=0$ — so centring the Prompt (maximum despread signal) and balancing Early against Late are the same condition seen two ways.</p>
<div class="callout"><strong>Key picture:</strong> the Prompt rides the apex; Early and Late cling to the two slopes at $\pm\delta/2$. Making E equal L is the same as sliding the Prompt back onto the apex.</div>`
      },
      {
        h: 'Discriminators: coherent, non-coherent power, normalized, dot-product',
        html: String.raw`<p>The <strong>discriminator</strong> converts the Early and Late outputs into a signed estimate of $\varepsilon$. Several forms trade carrier-phase dependence, amplitude sensitivity, and computational cost.</p>
<p><strong>Coherent Early-minus-Late.</strong> If the carrier phase is known (a PLL is locked), the correlator outputs are real and signed, and the simplest discriminator is</p>
<p>$$D_{\text{coh}}=E-L=A\big[R(\varepsilon+\tfrac\delta2)-R(\varepsilon-\tfrac\delta2)\big].$$</p>
<p>It is the lowest-jitter form but demands a good phase reference.</p>
<p><strong>Non-coherent power.</strong> When phase is uncertain, square the envelopes (using both I and Q of each arm) to remove the phase dependence:</p>
<p>$$D_{\text{ncoh}}=E^2-L^2=(E_I^2+E_Q^2)-(L_I^2+L_Q^2).$$</p>
<p>It works with no phase lock but suffers <em>squaring loss</em> at low SNR.</p>
<p><strong>Normalized non-coherent.</strong> Dividing by the total power makes the discriminator immune to gain (AGC) errors and slow fading:</p>
<p>$$D_{\text{norm}}=\frac{E^2-L^2}{E^2+L^2}.$$</p>
<p><strong>Dot-product.</strong> Using the Prompt as a phase reference gives a cheap quasi-coherent form widely used in GNSS ASICs:</p>
<p>$$D_{\text{dp}}=(E_I-L_I)P_I+(E_Q-L_Q)P_Q.$$</p>
<p>All four share the same S-curve shape and stable zero crossing near $\varepsilon=0$; they differ in how they degrade when carrier lock is weak and in their noise behaviour.</p>
<table class="data">
<tr><th>Discriminator</th><th>Form</th><th>Needs phase lock?</th><th>Amplitude-independent?</th></tr>
<tr><td>Coherent E&minus;L</td><td>$E-L$</td><td>yes</td><td>no</td></tr>
<tr><td>Non-coherent power</td><td>$E^2-L^2$</td><td>no</td><td>no</td></tr>
<tr><td>Normalized</td><td>$(E^2-L^2)/(E^2+L^2)$</td><td>no</td><td>yes</td></tr>
<tr><td>Dot-product</td><td>$(E_I-L_I)P_I+(E_Q-L_Q)P_Q$</td><td>quasi</td><td>no</td></tr>
</table>`
      },
      {
        h: 'The S-curve, the stable lock point, and the pull-in range',
        html: String.raw`<p>Plotting the discriminator output against the code-phase error $\varepsilon$ gives the <strong>S-curve</strong>. Substituting the triangle into $D_{\text{coh}}=E-L$ with $\delta=1$ gives, near the origin, a straight line $D_{\text{coh}}\approx-2\varepsilon$ (in units of $A$): a <em>negative</em>-slope zero crossing at $\varepsilon=0$. Positive error ($\varepsilon>0$: with the sign convention of the correlator equations, the replica is running <em>early</em> — the incoming code arrives later than the replica expects) yields a negative correction that retards the replica, and negative error yields a positive one — feedback pushes the error back toward zero. That negative-going zero crossing is the <strong>stable lock point</strong>; a positive-going crossing would drive errors <em>away</em> from zero and could never lock, so the sign, guaranteed by the triangle geometry, is the whole reason the DLL works.</p>
<ul>
<li>The strictly <strong>linear region</strong> spans $\pm\delta/2$ chips (where Early and Late sit on opposite flanks); beyond it the coherent S-curve holds a restoring plateau of height $A\delta$ and then decays, reaching zero at $\pm(1+\tfrac\delta2)$ chips — about $\pm1.5$ chips of total <strong>pull-in (restoring) region</strong> for $\delta=1$. Outside $\pm(1+\delta/2)$ the S-curve is flat at zero; the loop has no restoring signal and cannot pull in.</li>
<li>The <strong>slope at the origin</strong> sets the discriminator gain: for the coherent $E-L$ on the ideal triangle it is $-2A$ <em>independent of the spacing</em> $\delta$ (both samples always sit on unit-slope flanks), so the loop gain calibration does not change as $\delta$ is narrowed.</li>
<li>A <strong>narrow correlator</strong> ($\delta\ll1$) keeps that same central slope but wins on noise: Early and Late share all but a fraction $\delta$ of their chips, so their noise is strongly correlated and mostly cancels in the difference (differenced-noise power $\propto\delta$) — lower thermal jitter and much better multipath rejection (a reflected path arriving outside the $\pm\delta/2$ window barely biases the discriminator). The cost: the linear region $\pm\delta/2$ and the restoring plateau (height $A\delta$) both shrink with $\delta$, so the usable pull-in collapses and the handover-accuracy requirement tightens.</li>
</ul>
<div class="callout tip"><strong>Tip:</strong> the standard tracking-threshold rule of thumb is that the $3\sigma$ jitter from all stress sources should stay below about half the pull-in (restoring) range of the discriminator — cross that and the loop risks slipping out of lock.</div>`
      },
      {
        h: 'Loop dynamics: discriminator, loop filter, code NCO',
        html: String.raw`<p>After the correlators the DLL is a textbook feedback loop with three blocks:</p>
<ol>
<li><strong>Discriminator</strong> — forms $D(\varepsilon)$ from E and L each integration period $T$, as above.</li>
<li><strong>Loop filter</strong> — smooths the noisy discriminator output and sets the <strong>loop noise bandwidth</strong> $B_L$ (Hz). A <em>first-order</em> loop zeros a constant code-phase offset with no steady-state error but lags a constant code-rate (Doppler) input; a <em>second-order</em> loop additionally zeros a constant code rate, essential for moving platforms.</li>
<li><strong>Code NCO</strong> — a phase accumulator clocked at the sample rate whose step size sets the local chipping rate; the loop filter output adjusts that rate to advance or retard the replica and null $\varepsilon$.</li>
</ol>
<p>The central design tension is the <strong>bandwidth trade</strong>. A <em>wide</em> $B_L$ lets the loop follow fast dynamics (high code Doppler and jerk) but admits more noise, raising jitter; a <em>narrow</em> $B_L$ rejects noise (low jitter) but responds sluggishly and can lose lock under acceleration. The chosen $B_L$ is a compromise between dynamic stress and thermal jitter — and <em>carrier aiding</em>, treated in the DSSS Tracking topic, is the standard trick to escape it by feeding scaled carrier-loop Doppler into the code NCO so the DLL can run narrow-band yet still track dynamics.</p>
<div class="callout"><strong>Intuition:</strong> think of $B_L$ as the loop's reaction speed. Fast reactions catch a swerving target but also twitch at every noise spike; slow reactions ignore noise but miss sudden moves.</div>`
      },
      {
        h: 'Code tracking jitter: thermal noise and squaring loss',
        html: String.raw`<p>Even in perfect lock, correlator noise makes the estimated code phase jitter around zero. The <strong>1-sigma thermal-noise code jitter</strong> (in chips) for a <em>coherent</em> DLL is</p>
<p>$$\sigma_{\text{coh}}\approx\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}},$$</p>
<p>and for a <em>non-coherent</em> DLL, with the extra squaring-loss term, it gains a bracket:</p>
<p>$$\sigma_{\text{ncoh}}\approx\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}\left(1+\frac{1}{(2-\delta)\,T\,(C/N_0)}\right)}.$$</p>
<p>The symbols: $B_L$ is the code loop noise bandwidth (Hz); $C/N_0$ is the carrier-to-noise density as a <strong>linear ratio in Hz</strong> — convert from dB-Hz via $10^{(C/N_0)_{\text{dB}}/10}$ before using it; $T$ is the predetection integration time (s); $\delta$ is the early-late spacing (chips). Read the design levers straight off the formulas:</p>
<ul>
<li><strong>Narrower $\delta$</strong> lowers jitter (both scale as $\sqrt\delta$) and improves multipath rejection.</li>
<li><strong>Larger $C/N_0$</strong> lowers jitter (as $1/\sqrt{C/N_0}$, faster for the squaring-loss term).</li>
<li><strong>Narrower $B_L$</strong> lowers jitter (as $\sqrt{B_L}$) but slows the dynamic response — the bandwidth trade again.</li>
<li>The <strong>squaring-loss bracket</strong> matters only at low $C/N_0$ or short $T$; at high $C/N_0$ it tends to 1 and the two formulas agree.</li>
</ul>
<p>To turn a chip jitter into a ranging error, multiply by the chip length $\ell_{\text{chip}}=c/R_c$ (metres per chip): $\sigma_{\text{range}}=\sigma\,\ell_{\text{chip}}$.</p>`
      },
      {
        h: 'Lock detection, cycle slips, and loss of lock',
        html: String.raw`<p>A tracking loop must know whether it is actually tracking. <strong>Lock detectors</strong> watch the correlators. Code lock is confirmed when the Prompt power stands well above Early/Late, or when a running $C/N_0$ estimate exceeds a threshold. When the DLL is aided by a carrier loop, the carrier phase-lock detector monitors the ratio $(P_I^2-P_Q^2)/(P_I^2+P_Q^2)$: near $+1$ the energy is on the in-phase arm (phase locked), while values near $0$ or negative signal loss of lock.</p>
<p>Two failure modes dominate. A <strong>cycle slip</strong> in the aiding carrier loop occurs when noise or a transient pushes the carrier phase error past $\pm\tfrac\pi2$ (Costas), so the loop re-locks a half or whole cycle away and corrupts data until detected; the code loop then loses its clean phase reference. <strong>Loss of lock</strong> in the DLL proper occurs when the code error $\varepsilon$ leaves the discriminator's linear region — the S-curve flattens, the restoring signal vanishes, and the replica drifts off the peak, forcing re-acquisition. Wider $B_L$ resists dynamic loss of lock but slips more often on noise; narrower $B_L$ is quieter but fragile under dynamics — the same bandwidth-versus-dynamics-versus-jitter triangle that governs every DLL choice.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>The delay-lock loop is the servo that holds a spread-spectrum code aligned to a fraction of a chip. You should now be able to say:</p>
<ul>
<li><strong>The purpose:</strong> the DLL is a closed loop that corrects (does not search) the residual code-phase error $\varepsilon$ left drifting by code Doppler, oscillator error, and dynamics — it keeps the Prompt on the autocorrelation peak so the despread signal survives.</li>
<li><strong>The structure:</strong> three correlators — Early ($+\delta/2$), Prompt (aligned, feeds data), Late ($-\delta/2$) — ride the triangle $R(\tau)=1-\lvert\tau\rvert$; at $\varepsilon=0$, $E=L$, and Early-minus-Late imbalance is the error.</li>
<li><strong>The discriminators:</strong> coherent $E-L$, non-coherent power $E^2-L^2$, amplitude-independent normalized $(E^2-L^2)/(E^2+L^2)$, and the dot-product form — all with a stable negative-going S-curve zero crossing at $\varepsilon=0$, a linear region of $\pm\delta/2$, and a restoring (pull-in) region out to about $\pm(1+\delta/2)$ chips.</li>
<li><strong>The loop and its trade:</strong> discriminator &rarr; loop filter (sets $B_L$) &rarr; code NCO; wide $B_L$ tracks dynamics but admits noise, narrow $B_L$ is quiet but sluggish, and a second-order loop is needed to zero constant code Doppler.</li>
<li><strong>The jitter law:</strong> $\sigma\approx\sqrt{B_L\,\delta/(2\,C/N_0)}$ chips (plus a squaring-loss bracket when non-coherent), with $C/N_0$ a linear ratio in Hz; narrow $\delta$, high $C/N_0$, and narrow $B_L$ all cut jitter, and multiplying by $c/R_c$ converts it to a ranging error.</li>
<li><strong>The failure modes:</strong> lock detectors guard against cycle slips (aiding-carrier phase past $\pm\pi/2$) and loss of lock ($\varepsilon$ leaving the linear region), with the $3\sigma$-below-half-pull-in rule as the tracking threshold.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://gssc.esa.int/navipedia/index.php/Delay_Lock_Loop_(DLL)" target="_blank" rel="noopener">ESA Navipedia — Delay Lock Loop (DLL)</a> — the canonical GNSS reference: derives the Early/Prompt/Late correlators, the non-coherent, dot-product and normalized discriminators, the S-curve zero crossing, and thermal-noise code jitter, with clear correlation-function figures.</li>
<li><a href="https://gssc.esa.int/navipedia/index.php/Tracking_Loops" target="_blank" rel="noopener">ESA Navipedia — Tracking Loops</a> — places the DLL alongside the PLL/FLL, covering the loop filter's role, filter order and bandwidth trade, the code NCO, and carrier aiding of the code loop.</li>
<li><a href="https://gnss-sdr.org/docs/sp-blocks/tracking/" target="_blank" rel="noopener">GNSS-SDR — Tracking block documentation</a> — an open-source software-receiver reference giving the exact E/P/L discriminator equations, correlator spacing from $0.1T_c$ to $0.5T_c$, lock detectors, and configurable loop bandwidths as implemented in real code.</li>
<li><a href="https://www.mathworks.com/help/satcom/ug/gps-receiver-acquisition-and-tracking-using-ca-code.html" target="_blank" rel="noopener">MathWorks — GPS Receiver Acquisition and Tracking Using C/A-Code</a> — a runnable MATLAB example that builds a full DLL (with the half-chip Early/Late replicas and the $(E-L)/(2(E+L))$ discriminator) alongside the carrier loops on GPS C/A code.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`The DLL is the classic code-phase tracking loop: it continuously nulls the residual code error $\varepsilon$ (in chips) so the local PN replica stays aligned with the incoming code.`,
      String.raw`Three correlators run at once: Early (advanced $\delta/2$), Prompt (aligned, feeds data demod), Late (retarded $\delta/2$), where $\delta$ is the early-late spacing in chips.`,
      String.raw`Correlator outputs follow the code autocorrelation triangle $R(\tau)=1-\lvert\tau\rvert$ for $\lvert\tau\rvert\le1$; the peak is only $\pm1$ chip wide.`,
      String.raw`At perfect alignment $\varepsilon=0$, the Early and Late samples sit symmetrically on the two flanks so $E=L$ and the discriminator is zero.`,
      String.raw`Coherent discriminator $D=E-L$; non-coherent power $D=E^2-L^2$; amplitude-independent normalized $D=(E^2-L^2)/(E^2+L^2)$; and the quasi-coherent dot-product form.`,
      String.raw`Near lock (with $\delta=1$) the coherent discriminator is $D\approx-2\varepsilon$ (in units of $A$): a negative-slope straight line through the origin.`,
      String.raw`The S-curve has a negative-going zero crossing at $\varepsilon=0$ — the stable lock point; a positive-going crossing would be unstable and never lock.`,
      String.raw`The S-curve is linear over $\pm\delta/2$ chips and keeps a restoring output out to $\pm(1+\delta/2)$ chips (about $\pm1.5$ chips for $\delta=1$); beyond that it is flat at zero and the loop cannot pull in.`,
      String.raw`A narrow correlator ($\delta=0.1$ to $0.5$) keeps the same central slope $-2A$ but makes the Early/Late noise correlated so it cancels in the difference: lower jitter and better multipath rejection, at the cost of a smaller linear region/plateau and tighter handover accuracy.`,
      String.raw`Loop chain: discriminator $\to$ loop filter (sets loop noise bandwidth $B_L$) $\to$ code NCO that adjusts the local chipping rate; a second-order loop zeros constant code Doppler.`,
      String.raw`Coherent code jitter $\sigma\approx\sqrt{B_L\,\delta/(2\,C/N_0)}$ chips; non-coherent multiplies by the squaring-loss bracket $1+1/((2-\delta)\,T\,C/N_0)$.`,
      String.raw`In the jitter formulas $C/N_0$ is a linear ratio in Hz (convert from dB-Hz via $10^{(C/N_0)_{dB}/10}$), $B_L$ is in Hz, $T$ in seconds, $\delta$ in chips.`,
      String.raw`Narrower $\delta$, larger $C/N_0$, and narrower $B_L$ all reduce code jitter; a chip jitter maps to a ranging error via $\sigma_{\text{range}}=\sigma\,(c/R_c)$.`,
      String.raw`The tracking-threshold rule of thumb: keep the $3\sigma$ code jitter below about half the discriminator's pull-in (restoring) range to avoid slipping out of lock.`,
      String.raw`Lock detectors watch Prompt power and (when carrier-aided) the ratio $(P_I^2-P_Q^2)/(P_I^2+P_Q^2)$; loss of lock occurs when $\varepsilon$ leaves the linear region and the restoring signal vanishes.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 268" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="delay-lock-tracking-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="268" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">DLL block diagram: Early / Prompt / Late to loop filter and code NCO</text>
<line x1="12" y1="132" x2="60" y2="132" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#delay-lock-tracking-a1)"/>
<text x="8" y="124" fill="#9aa7b5" font-size="10">$r(t)$</text>
<!-- Early branch -->
<circle cx="90" cy="62" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="84" y="67" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="120" y="50" width="64" height="24" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="129" y="66" fill="#e6edf3" font-size="10">$\int_0^T$</text>
<text x="190" y="57" fill="#63e6be" font-size="11">E</text>
<text x="56" y="46" fill="#9aa7b5" font-size="9">code $+\delta/2$</text>
<!-- Prompt branch -->
<circle cx="90" cy="132" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="84" y="137" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="120" y="120" width="64" height="24" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="129" y="136" fill="#e6edf3" font-size="10">$\int_0^T$</text>
<text x="190" y="127" fill="#63e6be" font-size="11">P</text>
<text x="62" y="116" fill="#9aa7b5" font-size="9">code (aligned)</text>
<!-- Late branch -->
<circle cx="90" cy="202" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="84" y="207" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="120" y="190" width="64" height="24" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="129" y="206" fill="#e6edf3" font-size="10">$\int_0^T$</text>
<text x="190" y="199" fill="#63e6be" font-size="11">L</text>
<text x="58" y="230" fill="#9aa7b5" font-size="9">code $-\delta/2$</text>
<line x1="60" y1="132" x2="60" y2="62" stroke="#9aa7b5" stroke-width="1.1"/><line x1="60" y1="62" x2="78" y2="62" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<line x1="78" y1="132" x2="102" y2="132" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<line x1="60" y1="132" x2="60" y2="202" stroke="#9aa7b5" stroke-width="1.1"/><line x1="60" y1="202" x2="78" y2="202" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<line x1="102" y1="62" x2="120" y2="62" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<line x1="102" y1="202" x2="120" y2="202" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<line x1="184" y1="132" x2="218" y2="132" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<text x="196" y="126" fill="#b197fc" font-size="9">data</text>
<!-- discriminator -->
<rect x="218" y="44" width="86" height="176" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.4"/>
<text x="228" y="120" fill="#e6edf3" font-size="10">discrim.</text>
<text x="228" y="136" fill="#9aa7b5" font-size="9">$E-L$</text>
<line x1="184" y1="57" x2="218" y2="82" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<line x1="184" y1="199" x2="218" y2="182" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<rect x="322" y="104" width="82" height="30" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="331" y="123" fill="#e6edf3" font-size="9">loop filter</text>
<text x="332" y="150" fill="#9aa7b5" font-size="8">sets $B_L$</text>
<line x1="304" y1="132" x2="322" y2="119" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<rect x="424" y="104" width="82" height="30" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/><text x="437" y="123" fill="#e6edf3" font-size="9">code NCO</text>
<line x1="404" y1="119" x2="424" y2="119" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<line x1="465" y1="134" x2="465" y2="246" stroke="#9aa7b5" stroke-width="1.1"/><line x1="465" y1="246" x2="90" y2="246" stroke="#9aa7b5" stroke-width="1.1"/><line x1="90" y1="246" x2="90" y2="214" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#delay-lock-tracking-a1)"/>
<text x="236" y="260" fill="#9aa7b5" font-size="9">feedback adjusts local chipping rate to null $\varepsilon$</text>
</svg>`,
        caption: 'DLL block diagram: three correlators (Early advanced delta/2, Prompt aligned, Late retarded delta/2) integrate over T; the discriminator E-L drives a loop filter (which sets the loop noise bandwidth B_L) and a code NCO that adjusts the local chipping rate to null the code error epsilon. The Prompt output feeds data demodulation.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 262" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="262" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Autocorrelation triangle: Early / Prompt / Late taps at $\pm\delta/2$</text>
<line x1="40" y1="200" x2="510" y2="200" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="275" y1="60" x2="275" y2="210" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="4 3"/>
<text x="498" y="216" fill="#9aa7b5" font-size="10">$\tau$ (chips)</text>
<text x="282" y="72" fill="#9aa7b5" font-size="10">$R(\tau)$</text>
<!-- triangle: peak at (275,70), zeros at (155,200) and (395,200) -->
<path d="M155,200 L275,70 L395,200" fill="none" stroke="#4dabf7" stroke-width="2"/>
<!-- prompt at tau=0 (peak) -->
<circle cx="275" cy="70" r="4" fill="#63e6be"/><text x="266" y="60" fill="#63e6be" font-size="10">P</text>
<!-- late at tau=-delta/2 (left flank), early at tau=+delta/2 (right flank), aligned case -->
<circle cx="335" cy="135" r="4" fill="#ffa94d"/><text x="342" y="132" fill="#ffa94d" font-size="10">E</text>
<circle cx="215" cy="135" r="4" fill="#ff6b6b"/><text x="198" y="132" fill="#ff6b6b" font-size="10">L</text>
<line x1="335" y1="135" x2="335" y2="200" stroke="#ffa94d" stroke-width="0.8" stroke-dasharray="3 2"/>
<line x1="215" y1="135" x2="215" y2="200" stroke="#ff6b6b" stroke-width="0.8" stroke-dasharray="3 2"/>
<text x="300" y="214" fill="#ffa94d" font-size="9">$+\delta/2$</text>
<text x="198" y="214" fill="#ff6b6b" font-size="9">$-\delta/2$</text>
<text x="52" y="242" fill="#9aa7b5" font-size="10">Aligned ($\varepsilon=0$): $E=L$, so $D=E-L=0$. A shift tips the balance and forms the error.</text>
</svg>`,
        caption: 'The code autocorrelation triangle R(tau)=1-|tau|. The Prompt sits on the peak; Early (+delta/2) and Late (-delta/2) straddle it on the two flanks. At perfect alignment the Early and Late samples are equal, so the discriminator E-L is zero; any code-phase offset tips the balance and produces a signed error.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 262" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="262" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Discriminator S-curve: negative-going zero crossing = lock point</text>
<line x1="40" y1="140" x2="510" y2="140" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="275" y1="42" x2="275" y2="242" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="4 3"/>
<text x="496" y="156" fill="#9aa7b5" font-size="10">$\varepsilon$ (chips)</text>
<text x="282" y="54" fill="#9aa7b5" font-size="10">$D(\varepsilon)$</text>
<!-- wide correlator delta=1 (teal) and narrow correlator delta=0.2 (purple): same central slope, smaller plateau -->
<path d="M70,140 L155,140 L235,80 L315,200 L395,140 L480,140" fill="none" stroke="#63e6be" stroke-width="2"/>
<path d="M187,140 L203,128 L267,128 L283,152 L347,152 L363,140" fill="none" stroke="#b197fc" stroke-width="2" stroke-dasharray="5 3"/>
<text x="60" y="70" fill="#63e6be" font-size="9">wide $\delta=1$: tall S-curve, wide linear region</text>
<text x="316" y="170" fill="#b197fc" font-size="9">narrow $\delta=0.2$: same central slope, low plateau</text>
<!-- linear and pull-in region markers (wide correlator) -->
<line x1="235" y1="224" x2="315" y2="224" stroke="#4dabf7" stroke-width="1.5"/>
<text x="212" y="219" fill="#4dabf7" font-size="9">linear region $\pm\delta/2$</text>
<line x1="155" y1="242" x2="395" y2="242" stroke="#9aa7b5" stroke-width="1.2"/>
<text x="180" y="237" fill="#9aa7b5" font-size="9">restoring (pull-in) region $\pm(1+\delta/2)$</text>
<circle cx="275" cy="140" r="4" fill="#ffa94d"/><text x="284" y="132" fill="#ffa94d" font-size="10">stable lock (neg. slope)</text>
<text x="330" y="92" fill="#9aa7b5" font-size="9">$\varepsilon>0\Rightarrow D<0$</text>
<text x="90" y="186" fill="#9aa7b5" font-size="9">$\varepsilon<0\Rightarrow D>0$</text>
<text x="404" y="128" fill="#9aa7b5" font-size="9">flat: no feedback</text>
</svg>`,
        caption: 'The discriminator S-curve: output D versus code-phase error epsilon for a wide (delta=1) and a narrow (delta=0.2) correlator. Both cross zero at epsilon=0 with the same negative slope -2A — the stable lock point. The narrow correlator saturates at a much lower plateau (height A*delta) with a linear region of only +/-delta/2, so its usable pull-in shrinks; its jitter advantage comes from correlated Early/Late noise cancelling in the difference, not from a steeper slope. Outside +/-(1+delta/2) chips the curve is flat at zero and the loop cannot pull in.'
      }
    ],
    equations: [
      {
        title: 'Code Autocorrelation Triangle',
        tex: String.raw`$$R(\tau)=1-\lvert\tau\rvert,\quad \lvert\tau\rvert\le1;\qquad R(\tau)=0,\ \lvert\tau\rvert>1$$`,
        derivation: String.raw`<p><b>Where we start.</b> A long PN code is a stream of $\pm1$ chips of duration $T_c$, ideally uncorrelated with any nonzero shift of itself. Correlate the code $c(t)$ with a copy shifted by $\tau$ chips: $R(\tau)=\overline{c(t)\,c(t-\tau T_c)}$, normalized so $R(0)=1$. This triangle is the surface the whole DLL rides on, so we build it first.</p>
<p><b>Step 1.</b> Take a shift $0\le\tau\le1$. Within each chip interval, the shifted copy overlaps the <em>same</em> original chip for a fraction $1-\tau$ of the time and overlaps the <em>neighbouring</em> chip for the remaining fraction $\tau$.</p>
<p><b>Step 2.</b> Over the matched fraction $1-\tau$ the product $c\cdot c=+1$. Over the mismatched fraction $\tau$ the product involves independent $\pm1$ neighbouring chips, which for an ideal code average to $0$. So the correlation is $(1-\tau)\cdot1+\tau\cdot0=1-\tau$.</p>
<p><b>Result.</b> By symmetry the same holds for negative shifts, giving $R(\tau)=1-\lvert\tau\rvert$ for $\lvert\tau\rvert\le1$ and $R(\tau)=0$ beyond one chip (no overlap of the same chip). The triangular peak is only $\pm1$ chip wide — its steep flanks are exactly what let Early and Late sense a fractional-chip error, and its narrowness is why sub-chip tracking is both necessary and possible.</p>`
      },
      {
        title: 'Early and Late Correlator Outputs',
        tex: String.raw`$$E=A\,R\!\left(\varepsilon+\tfrac\delta2\right),\qquad L=A\,R\!\left(\varepsilon-\tfrac\delta2\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Let $\varepsilon$ be the code-phase error (chips) between the incoming code and the Prompt replica, $A$ the signal amplitude after carrier wipe-off, and $\delta$ the early-late spacing. The Early replica is advanced by $\delta/2$ and the Late replica retarded by $\delta/2$ relative to Prompt.</p>
<p><b>Step 1.</b> Each correlator output is the amplitude times the autocorrelation evaluated at that branch's net offset from the incoming code. The Prompt offset is $\varepsilon$, so $P=A\,R(\varepsilon)$.</p>
<p><b>Step 2.</b> Advancing the Early replica by $\delta/2$ makes its net offset $\varepsilon+\delta/2$; retarding the Late replica by $\delta/2$ makes its offset $\varepsilon-\delta/2$. Multiplying each by $A$ and the triangle $R(\cdot)$ gives $E=A\,R(\varepsilon+\delta/2)$ and $L=A\,R(\varepsilon-\delta/2)$.</p>
<p><b>Result.</b> At perfect alignment $\varepsilon=0$: $E=A\,R(\delta/2)$ and $L=A\,R(-\delta/2)$, equal because $R$ is even, so $E=L$ and any discriminator built on their difference is zero. A nonzero $\varepsilon$ slides one sample up the triangle and the other down, unbalancing $E$ and $L$ by an amount proportional (near the peak) to $\varepsilon$ — the raw material of every DLL discriminator.</p>`
      },
      {
        title: 'Coherent Early-Minus-Late Discriminator',
        tex: String.raw`$$D_{\text{coh}}=E-L=A\big[R(\varepsilon+\tfrac\delta2)-R(\varepsilon-\tfrac\delta2)\big]\approx-2A\,\varepsilon\ (\delta=1)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Assume a carrier PLL is locked so the correlator energy is real (signed). Take the difference of the Early and Late outputs as the error estimate $D_{\text{coh}}=E-L$, and evaluate it near lock with $\delta=1$.</p>
<p><b>Step 1.</b> Substitute the Early/Late outputs: $D_{\text{coh}}=A\,R(\varepsilon+\delta/2)-A\,R(\varepsilon-\delta/2)$. For small $\varepsilon$ with $\delta=1$ the two samples sit on the two straight flanks of the triangle near the peak.</p>
<p><b>Step 2.</b> On the right (trailing) flank $R(\varepsilon+\delta/2)=1-(\varepsilon+\delta/2)$; on the left (leading) flank $R(\varepsilon-\delta/2)=1-\lvert\varepsilon-\delta/2\rvert=1-(\delta/2-\varepsilon)$ for small $\varepsilon$. Subtracting: $D_{\text{coh}}=A\big[(1-\varepsilon-\tfrac\delta2)-(1-\tfrac\delta2+\varepsilon)\big]=A(-2\varepsilon)=-2A\,\varepsilon$.</p>
<p><b>Result.</b> Near lock $D_{\text{coh}}\approx-2A\,\varepsilon$: a straight line through the origin with negative slope (exact for $\lvert\varepsilon\rvert\le\delta/2$). With this sign convention $\varepsilon>0$ means the replica runs early (the incoming code arrives later than the replica expects); the negative $D$ then retards the replica — lowers the chip rate — and drives $\varepsilon$ back to zero. This is the lowest-jitter discriminator, but it needs a good carrier phase reference to keep the energy real.</p>`
      },
      {
        title: 'Normalized Non-Coherent Discriminator',
        tex: String.raw`$$D_{\text{norm}}=\frac{E^2-L^2}{E^2+L^2}$$`,
        derivation: String.raw`<p><b>Where we start.</b> When carrier phase is uncertain the correlator outputs carry an unknown phase $\phi$, but the powers $E^2=E_I^2+E_Q^2$ and $L^2=L_I^2+L_Q^2$ are phase-independent. Build a discriminator from these powers so no PLL is required.</p>
<p><b>Step 1.</b> The raw non-coherent form $E^2-L^2$ removes the phase dependence but still scales with signal power $A^2$, so its slope and lock behaviour drift with AGC error and fading. To fix that, divide by the total power $E^2+L^2$.</p>
<p><b>Step 2.</b> With the triangle values (take $\delta=1$, small $\varepsilon$): $E=A(1-\delta/2-\varepsilon)$ and $L=A(1-\delta/2+\varepsilon)$. Both numerator $E^2-L^2=(E-L)(E+L)$ and denominator $E^2+L^2$ are quadratic in $A$, so $A$ cancels in the ratio, leaving a function of $\varepsilon$ and $\delta$ only.</p>
<p><b>Result.</b> $D_{\text{norm}}=(E^2-L^2)/(E^2+L^2)$ is amplitude-independent: it reads the same error whether the signal is strong or weak, so it is immune to gain errors and slow fading, and it bounds the output to $[-1,1]$ which keeps the loop gain well conditioned. It is the workhorse code discriminator when a clean phase lock is not guaranteed — at the price of squaring loss at low SNR.</p>`
      },
      {
        title: 'S-Curve Slope Near Lock',
        tex: String.raw`$$\left.\frac{dD_{\text{coh}}}{d\varepsilon}\right|_{\varepsilon=0}=-2A\quad\text{for any }0<\delta<2\ \ (\text{independent of }\delta)$$`,
        derivation: String.raw`<p><b>Where we start.</b> The loop gain, and hence both the jitter and the pull-in range, are set by the discriminator's slope at the zero crossing. Take $D_{\text{coh}}(\varepsilon)=A[R(\varepsilon+\delta/2)-R(\varepsilon-\delta/2)]$ and differentiate at $\varepsilon=0$.</p>
<p><b>Step 1.</b> On the triangle the derivative of $R$ is $R'(\tau)=-\,\mathrm{sgn}(\tau)$ for $0<\lvert\tau\rvert<1$ (slope $-1$ on the trailing flank, $+1$ on the leading flank). So $dD/d\varepsilon=A[R'(\varepsilon+\delta/2)-R'(\varepsilon-\delta/2)]$.</p>
<p><b>Step 2.</b> At $\varepsilon=0$ with any $0<\delta<2$ (take $\delta=1$ for concreteness): the Early sample sits at $+\delta/2$ on the trailing flank ($R'=-1$) and the Late sample at $-\delta/2$ on the leading flank ($R'=+1$). Thus $dD/d\varepsilon=A[(-1)-(+1)]=-2A$, with no $\delta$ anywhere in the result.</p>
<p><b>Result.</b> The slope at lock is $-2A$ <em>independent of the spacing</em> $\delta$: both samples always sit on unit-slope flanks, so narrowing $\delta$ does <em>not</em> steepen the coherent S-curve, and the loop gain calibration is unchanged as $\delta$ shrinks. The narrow correlator's jitter advantage comes instead from the Early and Late <em>noises</em> becoming strongly correlated (the replicas share all but a fraction $\delta$ of their chips) so they largely cancel in the difference — while the linear region $\pm\delta/2$ and the restoring plateau (height $A\delta$) shrink with $\delta$. The negative sign is what makes the zero crossing stable.</p>`
      },
      {
        title: 'Coherent DLL Code Tracking Jitter',
        tex: String.raw`$$\sigma_{\text{coh}}\approx\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}}\ \ \text{[chips]}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Noise on the Early and Late correlators perturbs the discriminator, so the code-phase estimate jitters around zero. We want the 1-sigma jitter $\sigma$ (in chips) in terms of the loop noise bandwidth $B_L$, the spacing $\delta$, and the carrier-to-noise ratio $C/N_0$ (a linear ratio in Hz).</p>
<p><b>Step 1.</b> The variance of the code-phase estimate equals the discriminator output-noise variance divided by the square of its slope, then shaped by the loop's noise bandwidth. The correlator noise power passed by the loop scales with $B_L$; the useful signal scales with $C/N_0$; and the discriminator geometry contributes the factor $\delta$: a narrower spacing makes the Early and Late replicas share all but a fraction $\delta$ of their chips, so their noises are strongly correlated and largely cancel in the difference — the differenced-noise power is proportional to $\delta$.</p>
<p><b>Step 2.</b> Collecting these, the code-phase error variance is $\sigma^2\approx\dfrac{B_L\,\delta}{2\,(C/N_0)}$, where the factor $2$ comes from the two-flank (Early and Late) differencing together with the definition of $B_L$ as a one-sided loop noise bandwidth.</p>
<p><b>Result.</b> $\sigma_{\text{coh}}\approx\sqrt{B_L\,\delta/(2\,C/N_0)}$ chips. The design levers are explicit: jitter falls as $\sqrt\delta$ (narrow correlator), as $\sqrt{B_L}$ (narrow loop), and as $1/\sqrt{C/N_0}$ (stronger signal). To use a $C/N_0$ given in dB-Hz, first convert with $C/N_0=10^{(C/N_0)_{\text{dB}}/10}$.</p>`
      },
      {
        title: 'Non-Coherent DLL Jitter (Squaring Loss)',
        tex: String.raw`$$\sigma_{\text{ncoh}}\approx\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}\left(1+\frac{1}{(2-\delta)\,T\,(C/N_0)}\right)}\ \ \text{[chips]}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A non-coherent discriminator squares the Early and Late envelopes to remove carrier phase. Squaring produces signal-times-noise and noise-times-noise terms, the latter absent in the coherent case — the <em>squaring loss</em>. We correct the coherent jitter for it.</p>
<p><b>Step 1.</b> The signal-times-noise cross term reproduces the coherent variance $\sigma_{\text{coh}}^2=B_L\,\delta/(2\,C/N_0)$. The additional noise-times-noise term scales inversely with the number of independent noise samples integrated — i.e. with the predetection integration time $T$ and again with $C/N_0$ — and with the effective correlator overlap $(2-\delta)$.</p>
<p><b>Step 2.</b> Writing the extra term as a multiplicative bracket on the coherent variance gives $\sigma_{\text{ncoh}}^2=\sigma_{\text{coh}}^2\big(1+\tfrac{1}{(2-\delta)\,T\,(C/N_0)}\big)$. The bracket exceeds 1 and grows as $C/N_0$ or $T$ shrink — exactly where squaring loss bites.</p>
<p><b>Result.</b> $\sigma_{\text{ncoh}}\approx\sqrt{\dfrac{B_L\,\delta}{2\,(C/N_0)}\big(1+\tfrac{1}{(2-\delta)\,T\,(C/N_0)}\big)}$ chips. At high $C/N_0$ the bracket tends to 1 and the non-coherent loop matches the coherent one; at low $C/N_0$ the squaring loss dominates, which is why weak-signal receivers lengthen $T$ and, when possible, use carrier phase to go coherent.</p>`
      },
      {
        title: 'Code NCO Rate Update',
        tex: String.raw`$$f_{\text{co}}[n]=f_{\text{co,0}}+K\,D(\varepsilon[n]),\qquad \phi_{\text{co}}[n{+}1]=\phi_{\text{co}}[n]+\frac{f_{\text{co}}[n]}{f_s}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The code NCO is a phase accumulator clocked at sample rate $f_s$: it adds a phase step each clock and emits a chip whenever its accumulated phase crosses an integer chip boundary. Its output chipping rate $f_{\text{co}}$ is set by the step size, and the loop adjusts $f_{\text{co}}$ to null the measured error $D(\varepsilon)$.</p>
<p><b>Step 1.</b> Start from the nominal chipping rate $f_{\text{co,0}}$ (the acquisition estimate, including nominal code Doppler). Each integration period the discriminator returns $D(\varepsilon[n])$, a signed estimate of the residual error in chips.</p>
<p><b>Step 2.</b> The loop filter converts $D$ into a rate correction with gain $K$ (containing the filter coefficients that set $B_L$): $f_{\text{co}}[n]=f_{\text{co,0}}+K\,D(\varepsilon[n])$. With this topic's sign convention $\varepsilon>0$ means the replica runs <em>early</em> (the incoming code arrives later than the replica expects), and the negative-slope discriminator then gives $D<0$: the correction lowers the chipping rate, letting the incoming code catch up so $\varepsilon$ falls. If the replica runs late ($\varepsilon<0$, $D>0$) the rate is raised instead.</p>
<p><b>Result.</b> The NCO integrates this rate into phase, $\phi_{\text{co}}[n{+}1]=\phi_{\text{co}}[n]+f_{\text{co}}[n]/f_s$, advancing the local code just fast enough to hold $\varepsilon\to0$. Adding a second integrating branch makes the loop second-order, driving the steady-state error to zero even under constant code Doppler; carrier aiding adds a scaled carrier-Doppler term to $f_{\text{co,0}}$ to offload the dynamics.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does a delay-lock loop (DLL) do?`, back: String.raw`It is the closed-loop code-phase tracker that continuously nulls the residual code error $\varepsilon$ so the local PN replica stays aligned with the incoming code, keeping the Prompt on the autocorrelation peak.` },
      { front: String.raw`Name the three DLL correlators and their offsets.`, back: String.raw`Early (advanced $\delta/2$), Prompt (aligned, feeds data demod), Late (retarded $\delta/2$), where $\delta$ is the early-late spacing in chips.` },
      { front: String.raw`What is the early-late spacing $\delta$ and typical values?`, back: String.raw`The separation in chips between the Early and Late replicas; $\delta=1$ chip is the classic wide correlator, $\delta=0.1$ to $0.5$ is a narrow correlator.` },
      { front: String.raw`Write the code autocorrelation triangle.`, back: String.raw`$R(\tau)=1-\lvert\tau\rvert$ for $\lvert\tau\rvert\le1$, else $0$. The peak is only $\pm1$ chip wide.` },
      { front: String.raw`Why is $E=L$ at perfect alignment?`, back: String.raw`At $\varepsilon=0$ the Early ($+\delta/2$) and Late ($-\delta/2$) samples sit symmetrically on the even triangle, so $R(\delta/2)=R(-\delta/2)$ and the discriminator $E-L=0$.` },
      { front: String.raw`Give the coherent and non-coherent power discriminators.`, back: String.raw`Coherent: $D=E-L$. Non-coherent power: $D=E^2-L^2=(E_I^2+E_Q^2)-(L_I^2+L_Q^2)$.` },
      { front: String.raw`Why use the normalized discriminator $(E^2-L^2)/(E^2+L^2)$?`, back: String.raw`Dividing by total power cancels the amplitude, making it immune to AGC error and slow fading and bounding the output to $[-1,1]$.` },
      { front: String.raw`What is the dot-product discriminator?`, back: String.raw`$D=(E_I-L_I)P_I+(E_Q-L_Q)P_Q$, using the Prompt as phase reference; quasi-coherent and cheap, common in GNSS hardware.` },
      { front: String.raw`Describe the S-curve and its lock point.`, back: String.raw`Discriminator output vs code error $\varepsilon$; linear through the origin with a negative slope, so the negative-going zero crossing at $\varepsilon=0$ is the stable lock point.` },
      { front: String.raw`Why must the zero crossing be negative-going?`, back: String.raw`A negative slope feeds errors back toward zero (stable); a positive-going crossing would push them away and never lock. The triangle geometry guarantees the negative sign.` },
      { front: String.raw`How wide is the DLL pull-in (restoring) region?`, back: String.raw`The linear region is $\pm\delta/2$ chips, and a restoring output persists out to $\pm(1+\delta/2)$ chips for the triangular autocorrelation — about $\pm1.5$ chips for $\delta=1$; beyond that the S-curve is flat at zero and the loop cannot pull in.` },
      { front: String.raw`How does a narrow correlator change tracking?`, back: String.raw`The central slope stays $-2A$, but the Early/Late noises become strongly correlated and cancel in the difference (noise power $\propto\delta$): lower thermal jitter and better multipath rejection, at the cost of a smaller linear/pull-in region and tighter acquisition-handover accuracy.` },
      { front: String.raw`List the DLL loop blocks after the correlators.`, back: String.raw`Discriminator $\to$ loop filter (sets loop noise bandwidth $B_L$) $\to$ code NCO that adjusts the local chipping rate.` },
      { front: String.raw`First-order vs second-order DLL?`, back: String.raw`First-order zeros a constant code-phase offset but lags a constant code rate; second-order additionally zeros a constant code rate (Doppler) with no steady-state error.` },
      { front: String.raw`State the coherent code-jitter formula and its symbols.`, back: String.raw`$\sigma\approx\sqrt{B_L\,\delta/(2\,C/N_0)}$ chips; $B_L$ = loop bandwidth (Hz), $\delta$ = spacing (chips), $C/N_0$ = linear ratio in Hz (not dB).` },
      { front: String.raw`What is squaring loss in a non-coherent DLL?`, back: String.raw`The extra noise from squaring the envelopes, giving the bracket $1+1/((2-\delta)\,T\,C/N_0)$; it dominates at low $C/N_0$ or short $T$ and vanishes at high $C/N_0$.` },
      { front: String.raw`How do you convert code jitter to a ranging error?`, back: String.raw`Multiply by the chip length $\ell_{\text{chip}}=c/R_c$ (metres per chip): $\sigma_{\text{range}}=\sigma\,\ell_{\text{chip}}$.` },
      { front: String.raw`State the DLL tracking-threshold rule of thumb.`, back: String.raw`Keep the $3\sigma$ code jitter below about half the discriminator's pull-in (restoring) range, or the loop risks slipping out of lock.` }
    ],
    mcqs: [
      { q: String.raw`The fundamental job of a delay-lock loop is to:`, options: [String.raw`search a 2-D code/Doppler grid`, String.raw`continuously null the residual code-phase error and hold the replica aligned`, String.raw`generate the spreading code`, String.raw`increase the processing gain`], answer: 1, explain: String.raw`The DLL is a closed loop that corrects (does not search) the residual code error so the Prompt stays on the peak.` },
      { q: String.raw`Which DLL correlator output is used for data demodulation?`, options: [String.raw`Early`, String.raw`Prompt`, String.raw`Late`, String.raw`Early minus Late`], answer: 1, explain: String.raw`The aligned Prompt correlator is the despread signal fed to the demodulator; Early and Late only steer the loop.` },
      { q: String.raw`The Early and Late replicas are offset from the Prompt by:`, options: [String.raw`$\pm\delta$ chips`, String.raw`$\pm\delta/2$ chips`, String.raw`$\pm1$ bit`, String.raw`$\pm\delta/4$ chips`], answer: 1, explain: String.raw`Early is advanced $\delta/2$ and Late retarded $\delta/2$, so they are separated by $\delta$ and centred on the Prompt.` },
      { q: String.raw`The ideal PN autocorrelation for $\lvert\tau\rvert\le1$ chip is:`, options: [String.raw`$\cos\tau$`, String.raw`$1-\lvert\tau\rvert$ (triangle)`, String.raw`$e^{-\tau}$`, String.raw`a rectangle`], answer: 1, explain: String.raw`Matched-chip overlap falls linearly with shift, giving the triangle $1-\lvert\tau\rvert$.` },
      { q: String.raw`At perfect code alignment ($\varepsilon=0$), the coherent discriminator $E-L$ equals:`, options: [String.raw`its maximum`, String.raw`zero`, String.raw`the Prompt value`, String.raw`$-1$`], answer: 1, explain: String.raw`$E$ and $L$ sit symmetrically on the even triangle, so they are equal and their difference is zero.` },
      { q: String.raw`Which discriminator is amplitude-independent (immune to AGC and fading)?`, options: [String.raw`$E-L$`, String.raw`$E^2-L^2$`, String.raw`$(E^2-L^2)/(E^2+L^2)$`, String.raw`$E+L$`], answer: 2, explain: String.raw`Dividing by total power cancels the amplitude, so the normalized form depends only on the error.` },
      { q: String.raw`The stable lock point on the S-curve is where the curve:`, options: [String.raw`peaks`, String.raw`crosses zero with negative slope`, String.raw`crosses zero with positive slope`, String.raw`is flat`], answer: 1, explain: String.raw`A negative-going zero crossing feeds errors back toward zero; a positive one would be unstable.` },
      { q: String.raw`For $\delta=1$, the DLL pull-in (restoring) region is about:`, options: [String.raw`$\pm0.1$ chip`, String.raw`$\pm0.5$ chip`, String.raw`$\pm1.5$ chips`, String.raw`$\pm3$ chips`], answer: 2, explain: String.raw`A restoring output persists out to $\pm(1+\delta/2)=\pm1.5$ chips for $\delta=1$ on the triangular autocorrelation; beyond that the S-curve is flat at zero.` },
      { q: String.raw`Choosing a narrower early-late spacing $\delta$ primarily:`, options: [String.raw`widens the pull-in region`, String.raw`lowers thermal jitter and improves multipath rejection`, String.raw`removes the need for a loop filter`, String.raw`increases the data rate`], answer: 1, explain: String.raw`With narrow spacing the Early/Late noises are correlated and cancel in the difference (noise power $\propto\delta$), and reflections arriving outside $\pm\delta/2$ barely bias the discriminator — at the cost of a smaller pull-in region.` },
      { q: String.raw`In the DLL, the block that sets the loop noise bandwidth $B_L$ is the:`, options: [String.raw`correlator`, String.raw`loop filter`, String.raw`code NCO`, String.raw`AGC`], answer: 1, explain: String.raw`The loop filter's coefficients determine $B_L$; the NCO merely applies the resulting rate correction.` },
      { q: String.raw`In $\sigma\approx\sqrt{B_L\,\delta/(2\,C/N_0)}$, the quantity $C/N_0$ must be expressed as:`, options: [String.raw`a value in dB-Hz`, String.raw`a linear ratio in Hz`, String.raw`dimensionless dB`, String.raw`watts`], answer: 1, explain: String.raw`It is a linear ratio in Hz; convert from dB-Hz via $10^{(C/N_0)_{dB}/10}$ before substituting.` },
      { q: String.raw`The squaring-loss bracket $1+1/((2-\delta)\,T\,C/N_0)$ becomes negligible when:`, options: [String.raw`$C/N_0$ is small`, String.raw`$T$ is very short`, String.raw`$C/N_0$ is large`, String.raw`$\delta\to2$`], answer: 2, explain: String.raw`At high $C/N_0$ the added noise-times-noise term vanishes and the bracket tends to 1.` },
      { q: String.raw`A second-order DLL is preferred over a first-order one because it:`, options: [String.raw`removes the need for correlators`, String.raw`zeros the steady-state error under constant code Doppler`, String.raw`doubles the pull-in range`, String.raw`eliminates thermal noise`], answer: 1, explain: String.raw`A second-order loop tracks a constant code rate with no steady-state error, essential for moving platforms.` },
      { q: String.raw`Choosing the DLL loop bandwidth $B_L$ is a trade among:`, options: [String.raw`gain, phase, and delay`, String.raw`dynamics, jitter, and noise`, String.raw`chips, bits, and symbols`, String.raw`code, Gold, and Barker`], answer: 1, explain: String.raw`Wide $B_L$ tracks dynamics but admits more noise (jitter); narrow $B_L$ is quiet but sluggish.` },
      { q: String.raw`Converting a code jitter of $\sigma$ chips to a ranging error uses:`, options: [String.raw`$\sigma\,R_c$`, String.raw`$\sigma\,(c/R_c)$`, String.raw`$\sigma\,c\,R_c$`, String.raw`$\sigma/c$`], answer: 1, explain: String.raw`One chip spans $\ell_{\text{chip}}=c/R_c$ metres, so $\sigma_{\text{range}}=\sigma\,(c/R_c)$.` },
      { q: String.raw`Loss of lock in the DLL occurs when the code error $\varepsilon$:`, options: [String.raw`stays near zero`, String.raw`leaves the discriminator's linear region so the restoring signal vanishes`, String.raw`equals half a chip exactly`, String.raw`is negative`], answer: 1, explain: String.raw`Outside the linear region the S-curve flattens, feedback disappears, the replica drifts, and re-acquisition is needed.` }
    ],
    numericals: [
      {
        q: String.raw`A coherent DLL has loop bandwidth $B_L=1$ Hz, early-late spacing $\delta=0.5$ chip, and $C/N_0=40$ dB-Hz. Find the 1-sigma code tracking jitter in chips.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_{\text{coh}}=\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}}\ \text{[chips]},$$ with $C/N_0$ a linear ratio in Hz (convert from dB-Hz first).</p>
<p><b>Substitute.</b> $C/N_0=10^{40/10}=10^4$ Hz. Then $$\sigma_{\text{coh}}=\sqrt{\frac{1\times0.5}{2\times10^4}}=\sqrt{\frac{0.5}{2\times10^4}}.$$</p>
<p><b>Compute.</b> $\dfrac{0.5}{20000}=2.5\times10^{-5}$; $\sigma_{\text{coh}}=\sqrt{2.5\times10^{-5}}=\mathbf{5.0\times10^{-3}}$ chip (0.005 chip).</p>
<p><b>Explanation.</b> A 5-millichip jitter is excellent — well under a tenth of a chip — showing that a narrow loop ($B_L=1$ Hz), narrow spacing ($\delta=0.5$), and a healthy $40$ dB-Hz signal together give tight code lock. The linear-ratio conversion is essential: using $40$ directly would understate the signal by orders of magnitude.</p>`
      },
      {
        q: String.raw`Repeat the previous case but non-coherent, with predetection integration time $T=20$ ms ($0.02$ s), $\delta=0.5$, $B_L=1$ Hz, $C/N_0=40$ dB-Hz. How much does squaring loss inflate the jitter?`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_{\text{ncoh}}=\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}\left(1+\frac{1}{(2-\delta)\,T\,(C/N_0)}\right)}.$$</p>
<p><b>Substitute.</b> $C/N_0=10^4$ Hz, $\delta=0.5$, $T=0.02$ s. Bracket $=1+\dfrac{1}{(2-0.5)(0.02)(10^4)}=1+\dfrac{1}{1.5\times0.02\times10^4}=1+\dfrac{1}{300}$.</p>
<p><b>Compute.</b> Bracket $=1+0.00333=1.00333$. The coherent variance was $2.5\times10^{-5}$, so $\sigma_{\text{ncoh}}=\sqrt{2.5\times10^{-5}\times1.00333}=\sqrt{2.508\times10^{-5}}=\mathbf{5.008\times10^{-3}}$ chip.</p>
<p><b>Explanation.</b> At $40$ dB-Hz the squaring-loss bracket is only $1.0033$, so the jitter rises from $5.000$ to $5.008$ millichips — a negligible $0.17\%$. Squaring loss is harmless at strong signal; it only bites at low $C/N_0$ or short $T$, where the $1/((2-\delta)\,T\,C/N_0)$ term grows large.</p>`
      },
      {
        q: String.raw`Compare code jitter for a narrow correlator ($\delta=0.1$) versus a wide one ($\delta=1.0$), holding $B_L=2$ Hz and $C/N_0=35$ dB-Hz, coherent DLL.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_{\text{coh}}=\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}}\ \Rightarrow\ \frac{\sigma_{0.1}}{\sigma_{1.0}}=\sqrt{\frac{0.1}{1.0}}.$$</p>
<p><b>Substitute.</b> $C/N_0=10^{35/10}=10^{3.5}=3162$ Hz. For $\delta=1.0$: $\sigma=\sqrt{\dfrac{2\times1.0}{2\times3162}}=\sqrt{\dfrac{2}{6324}}$. For $\delta=0.1$: $\sigma=\sqrt{\dfrac{2\times0.1}{2\times3162}}=\sqrt{\dfrac{0.2}{6324}}$.</p>
<p><b>Compute.</b> $\delta=1.0$: $\sqrt{3.163\times10^{-4}}=1.78\times10^{-2}$ chip. $\delta=0.1$: $\sqrt{3.163\times10^{-5}}=5.62\times10^{-3}$ chip. Ratio $=\sqrt{0.1}=0.316$.</p>
<p><b>Explanation.</b> The narrow correlator cuts jitter from $17.8$ to $5.6$ millichips — a factor $\sqrt{10}\approx3.16$ improvement — and additionally rejects multipath. The cost, not shown by this formula, is a linear region ($\pm\delta/2$) shrunk tenfold — from $\pm0.5$ to $\pm0.05$ chip — demanding a more accurate acquisition handover.</p>`
      },
      {
        q: String.raw`Using the triangle autocorrelation with $\delta=1$ chip, compute the coherent discriminator $D=E-L$ (in units of amplitude $A$) for a code error of $\varepsilon=0.2$ chip.`,
        solution: String.raw`<p><b>Formula.</b> $$D=E-L=A\big[R(\varepsilon+\tfrac\delta2)-R(\varepsilon-\tfrac\delta2)\big],\quad R(\tau)=1-\lvert\tau\rvert.$$</p>
<p><b>Substitute.</b> With $\delta=1$, $\varepsilon=0.2$: Early offset $=0.2+0.5=0.7$; Late offset $=0.2-0.5=-0.3$. So $R(0.7)=1-0.7=0.3$ and $R(-0.3)=1-0.3=0.7$.</p>
<p><b>Compute.</b> $D=A(0.3-0.7)=\mathbf{-0.4\,A}$.</p>
<p><b>Explanation.</b> The negative output for a positive (late) error is exactly the negative-slope behaviour that pulls the loop back. Note $D=-0.4A=-2A\varepsilon$ with $\varepsilon=0.2$, confirming the near-lock slope $-2A$ derived for $\delta=1$ — on the straight flanks the linear approximation is exact.</p>`
      },
      {
        q: String.raw`A GPS C/A signal has chip rate $R_c=1.023$ Mcps. If a DLL holds code jitter $\sigma=0.02$ chip (1-sigma), what is the equivalent pseudorange jitter in metres?`,
        solution: String.raw`<p><b>Formula.</b> $$\ell_{\text{chip}}=\frac{c}{R_c},\qquad \sigma_{\text{range}}=\sigma\,\ell_{\text{chip}},$$ where $\ell_{\text{chip}}$ is the distance spanned by one chip and $c=3\times10^8$ m/s.</p>
<p><b>Substitute.</b> $\ell_{\text{chip}}=\dfrac{3\times10^8}{1.023\times10^6}$ m; $\sigma_{\text{range}}=0.02\times\ell_{\text{chip}}$.</p>
<p><b>Compute.</b> $\ell_{\text{chip}}=293.3$ m/chip; $\sigma_{\text{range}}=0.02\times293.3=\mathbf{5.87}$ m.</p>
<p><b>Explanation.</b> One C/A chip is about $293$ m of range, so a $0.02$-chip tracking jitter maps to roughly $5.9$ m of ranging noise — before carrier smoothing. This is why tight code tracking (and, ultimately, carrier-phase tracking at millimetre wavelengths) matters so much for GNSS accuracy.</p>`
      },
      {
        q: String.raw`Check the tracking threshold. A wide correlator ($\delta=1$) has a pull-in (restoring) range of about $\pm1.5$ chips, and the DLL runs at $\sigma=0.15$ chip. Does it satisfy the $3\sigma$-below-half-pull-in rule of thumb?`,
        solution: String.raw`<p><b>Formula.</b> $$\text{Require } 3\sigma\le\tfrac12\,(\text{pull-in half-range}),\qquad \text{half-range}\approx1.5\ \text{chips}.$$</p>
<p><b>Substitute.</b> $3\sigma=3\times0.15=0.45$ chip; the threshold is $\tfrac12\times1.5=0.75$ chip.</p>
<p><b>Compute.</b> $0.45\ \text{chip}\le0.75\ \text{chip}$ — the condition holds, with margin $0.75-0.45=\mathbf{0.30}$ chip.</p>
<p><b>Explanation.</b> The $3\sigma$ excursion of $0.45$ chip stays comfortably inside half the $1.5$-chip pull-in range, so the loop is expected to hold lock. If jitter grew past $\sigma=0.25$ chip (so $3\sigma=0.75$) the loop would sit right at the threshold and become prone to slipping out of the linear region — the point at which one would widen $\delta$, narrow $B_L$, or add carrier aiding.</p>`
      }
    ],
    realWorld: String.raw`<p>The delay-lock loop is the beating heart of code tracking in every GNSS receiver — GPS, Galileo, GLONASS, BeiDou — and in every direct-sequence CDMA system. In a phone or survey receiver each satellite channel, once acquired, spins up a DLL running Early/Prompt/Late correlators against a locally generated PRN replica; modern receivers favour a narrow correlator ($\delta=0.1$ chip) precisely because its correlated Early/Late noise cancels in the difference, slashing both thermal jitter and the multipath error that plagues urban canyons. The Prompt arm feeds the 50 bps navigation-data demodulator, while the code NCO's running rate estimate becomes the pseudorange measurement handed to the position solver. Software-defined receivers such as GNSS-SDR implement exactly this structure in open source, exposing the discriminator choice, the $0.1T_c$-to-$0.5T_c$ spacing, and the loop bandwidth as configuration parameters an engineer tunes for the target environment.</p>
<p>Design choices show up directly in performance. A high-dynamics receiver on a launch vehicle widens $B_L$ and leans on carrier aiding to survive acceleration without slipping out of the linear pull-in region; a static reference station narrows $B_L$ to milli-hertz for the lowest possible jitter and centimetre-class ranging. The same DLL appears beyond navigation: in IS-95/CDMA2000/WCDMA cellular RAKE receivers, each finger is an independently tracked DLL locked to one multipath component; in Zigbee and other DSSS links; and in deep-space telemetry, where extremely low $C/N_0$ forces long integration $T$ and very narrow $B_L$ to keep the squaring-loss term in check. Mastering the jitter law and the bandwidth-versus-dynamics-versus-jitter triangle is what lets an engineer pick $\delta$, $B_L$, and $T$ for a given $C/N_0$ and platform — and diagnose why lock is lost when a receiver is shaken, jammed, or driven under a bridge.</p>`,
    related: ['dsss-tracking', 'tau-dither-tracking', 'split-bit-tracking', 'early-late-correlator', 'dll']
  }
);
