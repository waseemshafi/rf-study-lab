/* split-bit-tracking.js — "Split-Bit (Data-Transition) Tracking" topic (Spread Spectrum & Coding).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "split-bit-tracking-" to avoid collisions.
   Treats the split-bit / split-symbol synchronizer and the Data-Transition
   Tracking Loop (DTTL) as one technique; cross-references delay-lock-tracking
   and early-late-correlator without duplicating them. */
CONTENT.topics.push(
  {
    id: 'split-bit-tracking',
    title: 'Split-Bit (Data-Transition) Tracking',
    category: 'Spread Spectrum & Coding',
    tags: ['DTTL', 'split-bit', 'split-symbol', 'symbol synchronization', 'timing error detector', 'transition density', 'S-curve', 'self-noise', 'symbol clock NCO', 'telemetry'],
    summary: String.raw`Split-bit (data-transition) tracking recovers symbol timing from the data itself: each bit interval is split at its estimated midpoint or boundary, an in-phase integrator spans the full symbol for the bit decision, and a mid-phase integrator straddles the boundary; when a data transition occurs, the mid-phase output is proportional to the timing offset $\tau$ and, multiplied by the transition sign, forms the error $e_k=2A\tau$ that a loop filter and symbol-clock NCO drive to zero — the Data-Transition Tracking Loop (DTTL).`,
    prerequisites: ['early-late-correlator', 'correlation', 'dsss'],
    intro: String.raw`<p><strong>Why can a receiver find the bit clock inside the bits themselves?</strong> A binary NRZ stream carries no separate clock line, no pilot tone, and (usually) no dedicated sync waveform — just a sequence of $\pm A$ levels, each held for one symbol time $T$. Yet the demodulator must integrate each symbol over <em>exactly</em> the right interval: start or stop the integrate-and-dump a fraction of a bit early and part of the neighbouring bit leaks in, eroding the decision energy and multiplying the error rate. The only timing landmarks the waveform offers are its <strong>data transitions</strong> — the instants where one bit ends at $+A$ and the next begins at $-A$ (or vice versa). Split-bit tracking is the art of turning those irregular, data-dependent edges into a continuous, precise symbol clock.</p>
<p>The core trick is disarmingly simple: <strong>split the bit and compare the halves</strong>. If the receiver's estimate of the bit interval is perfectly aligned, the first half and the second half of a bit integrate to the same value, and a window straddling the boundary between two opposite bits integrates to exactly zero — the positive sliver before the true edge cancels the negative sliver after it. Slide the estimate off by $\tau$ and the cancellation fails: the straddling integral grows <em>linearly</em> in $\tau$, with a sign that says which way to correct. One subtlety remains — the raw imbalance also flips sign with the data pattern — and the <strong>Data-Transition Tracking Loop (DTTL)</strong> resolves it by multiplying the mid-phase integral by the <em>detected transition sign</em>, rectifying the error so that every transition, up or down, pushes the clock the same correct way. Symbols with no transition are gated out: they simply carry no timing information.</p>
<p>This topic builds the machinery from scratch: the half-symbol integrals and their difference, the mid-phase (transition) integrator, the gated error signal $e_k=2A\tau$, the S-curve and its slope $2Ap_t$ set by the transition density $p_t$, the window-width parameter $\xi$, decision-error slope degradation and self-noise, the thermal timing-jitter law, and the loop filter plus symbol-clock NCO that close the loop. It is the timing-recovery sibling of the <em>Delay-Lock Loop</em>: where the DLL balances Early and Late code correlators on an autocorrelation triangle, the DTTL balances the two halves of a bit around a data edge — same feedback philosophy, different landmark.</p>`,
    sections: [
      {
        h: 'Why track timing from the data itself',
        html: String.raw`<p><strong>Why not just send a clock?</strong> Because every hertz of link budget and bandwidth spent on a separate clock tone or sync channel is a hertz not spent on data. Deep-space telemetry, satellite downlinks, and most PSK modems therefore ship <em>self-clocking</em> waveforms: the receiver must mine the symbol timing out of the modulated data stream itself. Three facts frame the problem:</p>
<ul>
<li><strong>The matched filter is timing-critical.</strong> The optimum NRZ receiver integrates each symbol over its exact interval. A normalized offset $\lambda=\tau/T$ wastes a fraction of the symbol energy whenever a transition is present and admits interference from the neighbouring bit, so BER climbs quickly with $\lvert\lambda\rvert$.</li>
<li><strong>The clock drifts continuously.</strong> Transmit and receive oscillators disagree by parts per million, and Doppler stretches the symbol rate; an initial alignment decays within seconds unless a loop keeps correcting it.</li>
<li><strong>Only transitions carry timing.</strong> A long run of identical bits is a flat DC level — featureless, with no landmark to lock to. Every timing detector that works on random NRZ data must extract its information from the bit <em>edges</em>, which occur only when consecutive bits differ.</li>
</ul>
<p>Split-bit tracking embraces the third fact instead of fighting it: it builds a discriminator that measures the offset of each observed data edge from where the receiver <em>expected</em> the edge, uses those measurements when transitions occur, and coasts on its flywheel (the loop filter and NCO) through transition-free runs. The classic realization is the <strong>Data-Transition Tracking Loop (DTTL)</strong>, developed for NASA deep-space telemetry in the 1960s and still the symbol synchronizer in the Deep Space Network's receivers.</p>
<div class="callout"><strong>Intuition:</strong> you cannot set your watch by staring at a wall, but you can set it by the door that slams at every shift change. The DTTL sets the symbol clock by the data's own "door slams" — its transitions — and simply holds steady between them.</div>`
      },
      {
        h: 'The split-bit idea: compare the two halves',
        html: String.raw`<p>Take one estimated bit interval and split it at its midpoint into a first-half integral $Y_1$ and a second-half integral $Y_2$, each of duration $T/2$. If the estimate is perfectly aligned with a bit of amplitude $a_kA$ ($a_k=\pm1$), both halves see the same constant level, so $Y_1=Y_2=a_kAT/2$ and the difference $Y_1-Y_2$ is zero.</p>
<p>Now let the estimate be <em>early</em> by $\tau$ (so the true bit boundary sits $\tau$ later than the receiver thinks). The first half-window now begins inside the <em>previous</em> bit $a_{k-1}$ for a duration $\tau$, while the second half-window still lies wholly inside bit $k$. Working the integrals through (see the derivations) gives</p>
<p>$$Y_1-Y_2=A\,(a_{k-1}-a_k)\,\tau=\begin{cases}-2A\,a_k\,\tau,&a_{k-1}\ne a_k\ \text{(transition)},\\[2pt]0,&a_{k-1}=a_k\ \text{(no transition)}.\end{cases}$$</p>
<p>Two lessons fall straight out of this formula:</p>
<ul>
<li><strong>The imbalance is linear in the offset</strong> — exactly what a discriminator needs: magnitude proportional to how far off the clock is, sign indicating which way.</li>
<li><strong>But it also flips with the data.</strong> The factor $a_k$ means an upward edge and a downward edge produce opposite raw imbalances for the same timing error. Averaged blindly over random data the errors would cancel to zero. The raw split-bit difference must therefore be <em>rectified</em> by the data pattern before it can steer a loop — which is precisely the job of the transition-sign multiplication in the DTTL.</li>
</ul>
<div class="callout"><strong>Intuition:</strong> checking whether a picture is centred on the wall by comparing the gaps on its left and right — equal gaps mean centred, and the bigger gap tells you which way to slide it. The complication here is that half the pictures are hung mirror-imaged, so you must first note which way each one faces (the transition sign) before trusting which gap is "left".</div>`
      },
      {
        h: 'DTTL architecture: in-phase arm, mid-phase arm, transition logic',
        html: String.raw`<p>The Data-Transition Tracking Loop packages the split-bit idea into two parallel integrate-and-dump arms driven by the same estimated symbol clock, plus a small logic block that ties them together:</p>
<ul>
<li><strong>In-phase (I) arm:</strong> integrates the <em>full</em> estimated symbol interval, $I_k=\int$ over $[\,\hat t_k,\hat t_k+T\,]$. Its output feeds the hard decision $\hat a_k=\mathrm{sgn}(I_k)$ — this arm <em>is</em> the data demodulator, so the timing loop costs no extra correlator for data.</li>
<li><strong>Mid-phase (transition, Q) arm:</strong> integrates a window of width $\xi T$ ($0<\xi\le1$) <em>straddling</em> the estimated boundary between symbols $k{-}1$ and $k$ — half the window in the tail of one symbol, half in the head of the next. Its output $J_k$ is the raw, data-signed timing imbalance.</li>
<li><strong>Transition detector:</strong> compares consecutive decisions and forms the sign $\dfrac{\hat a_{k-1}-\hat a_k}{2}\in\lbrace-1,0,+1\rbrace$. It is $\pm1$ when a transition is detected and $0$ when the two bits agree.</li>
<li><strong>Multiplier:</strong> the error signal is $e_k=J_k\cdot\dfrac{\hat a_{k-1}-\hat a_k}{2}$ — the mid-phase integral <em>gated and rectified</em> by the detected transition.</li>
</ul>
<p>Because the mid-phase window for the boundary between symbols $k{-}1$ and $k$ extends into symbol $k$, the loop must wait until the decision $\hat a_k$ is available before forming $e_k$; a half-to-one-symbol delay in the I arm keeps the two arms aligned. The error samples then flow into a loop filter and a symbol-clock NCO exactly as in any tracking loop.</p>
<table class="data">
<tr><th>Block</th><th>Spans</th><th>Output</th><th>Role</th></tr>
<tr><td>In-phase integrator</td><td>full symbol $T$</td><td>$I_k$</td><td>bit decision $\hat a_k=\mathrm{sgn}(I_k)$ (data out)</td></tr>
<tr><td>Mid-phase integrator</td><td>window $\xi T$ straddling boundary</td><td>$J_k$</td><td>raw timing imbalance, sign tangled with data</td></tr>
<tr><td>Transition detector</td><td>decisions $\hat a_{k-1},\hat a_k$</td><td>$(\hat a_{k-1}-\hat a_k)/2$</td><td>gate (0 if no transition) and rectifying sign</td></tr>
<tr><td>Multiplier</td><td>—</td><td>$e_k$</td><td>gated error: $2A\tau$ on transitions, $0$ otherwise</td></tr>
<tr><td>Loop filter + NCO</td><td>—</td><td>clock phase</td><td>smooths $e_k$, retimes both integrators</td></tr>
</table>`
      },
      {
        h: 'The error signal: gated by data transitions',
        html: String.raw`<p>Put numbers on the mid-phase arm. Let the receiver's estimated boundary be <em>early</em> by $\tau$ (true boundary $\tau$ later), with $\lvert\tau\rvert\le\xi T/2$ so the true edge stays inside the window. The window sees the level $a_{k-1}A$ for a duration $\xi T/2+\tau$ and the level $a_kA$ for the remaining $\xi T/2-\tau$, so</p>
<p>$$J_k=A\,(a_{k-1}+a_k)\,\frac{\xi T}{2}+A\,(a_{k-1}-a_k)\,\tau.$$</p>
<p>Read the two terms separately. The first is a <em>data pedestal</em>: when the bits agree it equals $a_kA\,\xi T$ — large, but carrying no timing information. The second is the <em>timing term</em>: zero without a transition, $2A a_{k-1}\tau$ with one. Multiplying by the detected transition sign $(\hat a_{k-1}-\hat a_k)/2$ does three jobs at once:</p>
<ul>
<li><strong>Gates out no-transition symbols</strong> — the sign is $0$, so the useless pedestal never reaches the loop;</li>
<li><strong>Rectifies the data polarity</strong> — with correct decisions the sign equals $a_{k-1}$, and $2Aa_{k-1}\tau\cdot a_{k-1}=2A\tau$: every transition, rising or falling, now votes the same way for the same offset;</li>
<li><strong>Leaves a clean discriminator</strong> — on transition symbols $e_k=2A\tau$, positive when the clock is early (push the estimate later), negative when late (pull it earlier). The zero crossing at $\tau=0$ with the loop's corrective feedback sign is the stable lock point.</li>
</ul>
<p>Symbols without transitions contribute $e_k=0$: <em>no timing information, but also no disturbance</em> (to first order). The loop's flywheel — its filter memory and NCO rate — carries the clock across transition-free runs, which is why line codes or scramblers that guarantee a healthy transition density are the DTTL's best friends.</p>`
      },
      {
        h: 'The S-curve: slope, transition density, and window width',
        html: String.raw`<p>Average the error over random data to get the discriminator's <strong>S-curve</strong> $g(\tau)=\mathrm{E}[e_k]$. A transition occurs with probability $p_t$ (the <strong>transition density</strong>), each contributing $2A\tau$, and non-transitions contribute zero, so in the linear window</p>
<p>$$g(\tau)=2A\,p_t\,\tau,\qquad\lvert\tau\rvert\le\frac{\xi T}{2},\qquad K_d=\left.\frac{dg}{d\tau}\right|_{0}=2A\,p_t.$$</p>
<p>For independent equiprobable bits $p_t=\tfrac12$ and the slope is simply $A$. Three structural properties matter:</p>
<ul>
<li><strong>The slope is proportional to transition density.</strong> Biased or repetitive data ($p_t<\tfrac12$) weakens the discriminator; the loop gain and bandwidth shift with the data statistics unless the design normalizes for it. In the limit $p_t\to0$ (unbroken run of identical bits) the S-curve collapses — there is nothing to track.</li>
<li><strong>The linear region spans $\pm\xi T/2$.</strong> Beyond it the true edge falls outside the mid-phase window, the error stops growing and decays back toward zero as the offset approaches half a symbol, where the loop can face a half-symbol ambiguity. Narrowing $\xi$ shrinks the pull-in range exactly as narrowing the early-late spacing does in a DLL.</li>
<li><strong>Window width $\xi$ trades noise against pull-in.</strong> The mid-phase integrator collects noise over $\xi T$, so its noise variance is proportional to $\xi$; a narrow window (typical $\xi=\tfrac14$ to $\tfrac12$) admits less noise <em>and</em> less self-noise while keeping the same central slope — the DTTL's version of the narrow correlator — at the cost of a smaller linear region and a tighter acquisition handover.</li>
</ul>
<div class="callout tip"><strong>Tip:</strong> systems that rely on data-transition tracking protect the transition density by design — scramblers randomize user data toward $p_t\approx\tfrac12$, convolutional coding keeps symbol streams busy, and Manchester (bi-phase) line coding goes further by forcing a transition in <em>every</em> bit, at the price of doubled bandwidth.</div>`
      },
      {
        h: 'Noise: thermal jitter, self-noise, and decision errors',
        html: String.raw`<p>Three disturbances shake the DTTL's clock even in solid lock:</p>
<p><strong>Thermal noise.</strong> White noise of density $N_0/2$ integrated over the mid-phase window adds a zero-mean variable of variance $N_0\xi T/2$ to every gated $J_k$. Dividing the loop-filtered noise by the discriminator slope and collecting terms (see the derivation) gives the normalized 1-sigma timing jitter</p>
<p>$$\sigma_\lambda\approx\sqrt{\frac{\xi\,B_L\,T}{4\,p_t\,(E_s/N_0)}},$$</p>
<p>with $B_L$ the loop noise bandwidth (Hz), $T$ the symbol time (s), $E_s/N_0$ the <em>linear</em> symbol SNR, and $\lambda=\tau/T$. Every design lever is visible: narrow the window ($\xi\downarrow$), narrow the loop ($B_L\downarrow$), raise the SNR, or raise the transition density, and the jitter falls as the square root of each.</p>
<p><strong>Decision errors.</strong> The transition detector runs on <em>decisions</em>, not true bits. A symbol error flips the detected transition sign, turning a correct $+2A\tau$ vote into $-2A\tau$. The detected sign is right only when <em>both</em> decisions are correct; both wrong <em>inverts</em> it and exactly one wrong <em>gates the symbol out</em>, so the mean slope is multiplied by $(1-2P_s)$, where $P_s=Q\big(\sqrt{2E_s/N_0}\big)$ is the symbol error probability — negligible at high SNR, but a genuine gain droop at the low SNRs where deep-space links live.</p>
<p><strong>Self-noise (pattern noise).</strong> Even with no thermal noise the loop is not perfectly quiet: decision errors occasionally gate in a no-transition symbol, whose large data pedestal $a_kA\xi T$ then rides through the multiplier with a random sign; and with $\tau\ne0$ the random arrival of transitions makes $e_k$ a random telegraph of $2A\tau$'s and zeros whose fluctuation about the mean $2Ap_t\tau$ is filtered but not eliminated. Self-noise scales with $\xi$ and with how far the loop wanders from lock, and it is the reason the practical window is narrowed once lock is achieved.</p>
<div class="callout"><strong>Intuition:</strong> the DTTL only "hears" the clock at random, data-dependent instants. Thermal noise blurs each tick it hears, decision errors occasionally report a tick backwards, and the irregular spacing of the ticks themselves adds a rustle — the loop filter is the flywheel that averages all three into a steady rotation.</div>`
      },
      {
        h: 'Closing the loop: filter and symbol-clock NCO',
        html: String.raw`<p>The gated errors $e_k$ arrive once per symbol (nonzero roughly every other symbol for random data) and drive the standard tracking-loop back end:</p>
<ol>
<li><strong>Loop filter</strong> — averages the sparse, noisy $e_k$ stream and sets the loop noise bandwidth $B_L$. A first-order loop nulls a constant timing offset; a second-order loop additionally nulls a constant clock-frequency error (symbol-rate offset or Doppler), which every real link needs because the transmit and receive symbol clocks never agree exactly.</li>
<li><strong>Symbol-clock NCO</strong> — a phase accumulator whose overflow ticks define the estimated symbol boundaries $\hat t_k$. The filter output nudges the accumulator rate: a positive filtered error (clock early) slows the NCO so the boundaries slide later; a negative error speeds it up. The same ticks retime <em>both</em> integrate-and-dump arms, so the whole detector slides as one.</li>
</ol>
<p>The update in its simplest first-order form is $\hat t_{k+1}=\hat t_k+T+K\,e_k$: each symbol epoch advances by the nominal period plus a correction proportional to the error. The usual bandwidth trade applies with one DTTL-specific twist — the loop's <em>effective</em> update rate is $p_t/T$, not $1/T$, because only transition symbols carry information. Long transition-free runs are coasting intervals: the narrower $B_L$, the longer the loop's memory and the more gracefully it coasts, but the slower it recovers from a clock-rate step. Designs for low-transition-density data either lengthen the filter memory or enforce transitions at the source (scrambling, Manchester).</p>`
      },
      {
        h: 'Relation to the early-late gate and other timing detectors',
        html: String.raw`<p>The split-bit/DTTL is one member of the family of <strong>timing-error detectors (TEDs)</strong>, and seeing its siblings clarifies what is special about it:</p>
<ul>
<li><strong>Early-late gate:</strong> integrates two full-symbol windows offset $\pm\Delta$ around the estimate and compares their <em>magnitudes</em>. Same "balance two samples around a landmark" philosophy as the DLL on the code autocorrelation; the DTTL instead splits at the boundary and uses decision feedback — it needs no magnitude/squaring, so it avoids squaring loss, but it does need reliable decisions.</li>
<li><strong>Gardner TED:</strong> $e_k=x(kT-T/2)\,[\,x(kT-T)-x(kT)\,]$ — a two-samples-per-symbol cousin that multiplies the <em>mid-sample</em> by the difference of adjacent strobes. It is non-data-aided (no decisions) and carrier-phase tolerant; the DTTL is its decision-directed, integrate-and-dump ancestor, and the zero-crossing (decision-directed) TED in modern modem libraries is exactly the DTTL idea in sampled form.</li>
<li><strong>Mueller-Muller TED:</strong> one sample per symbol, decision-directed, popular in wireline; lowest rate but sensitive to pulse-shape symmetry.</li>
</ul>
<table class="data">
<tr><th>Detector</th><th>Decision-directed?</th><th>Timing info source</th><th>Notes</th></tr>
<tr><td>Split-bit / DTTL</td><td>yes</td><td>mid-phase integral at data transitions</td><td>optimal-ish for NRZ at low SNR; gated by transitions; slope $\propto p_t$</td></tr>
<tr><td>Early-late gate</td><td>no (envelope)</td><td>energy imbalance of $\pm\Delta$ windows</td><td>simple; squaring loss; DLL's sibling</td></tr>
<tr><td>Gardner</td><td>no</td><td>mid-sample times strobe difference</td><td>2 samples/symbol; rotation-insensitive</td></tr>
<tr><td>Mueller-Muller</td><td>yes</td><td>decision-weighted strobes</td><td>1 sample/symbol; needs symmetric pulses</td></tr>
</table>
<p>The same split-window principle also tracks <em>ranging</em> waveforms: a <strong>split-gate range tracker</strong> centres an early gate and a late gate on a radar or ranging pulse and balances their energies, and split-chip variants appear in spread-spectrum code tracking — the DLL topic's Early/Late correlators are the code-domain version of the same balance test. Split-bit tracking is what the idea becomes when the landmark is a <em>data edge</em> rather than a pulse peak or a correlation peak.</p>`
      },
      {
        h: 'Applications: PSK telemetry, deep space, and beyond',
        html: String.raw`<p><strong>Deep-space and satellite telemetry</strong> is the DTTL's home turf. After carrier tracking (a PLL or Costas loop) strips the RF, the receiver faces exactly the waveform this topic assumes: antipodal NRZ symbols in white noise, often at $E_s/N_0$ of a few dB or below. The DTTL was developed for this regime and implemented in NASA's Deep Space Network — including the Block V receiver — because its decision-directed structure approximates the maximum-a-posteriori symbol synchronizer for binary NRZ while remaining a simple two-integrator loop that shares its I arm with the data detector.</p>
<p><strong>PSK modems</strong> use the same detector in sampled-data form: the zero-crossing (decision-directed) TED found in software radios and modem libraries computes the mid-symbol sample times the difference of adjacent decisions — a discrete DTTL. <strong>Command receivers and telemetry ground stations</strong> pair it with scramblers or Manchester coding to guarantee transition density. And the split-window balance test generalizes: split-gate trackers hold radar range gates centred on echo pulses, and code-tracking loops split correlation windows around a PN edge — one geometric idea, three domains.</p>
<div class="callout"><strong>Design checklist:</strong> guarantee transition density (scramble or line-code); pick the window $\xi$ small enough for jitter and self-noise but wide enough that acquisition can hand over inside $\pm\xi T/2$; size $B_L$ for the worst clock drift and the sparsest expected transitions; and budget for the $(1-2P_s)$ slope droop at your operating $E_s/N_0$.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>Split-bit (data-transition) tracking turns the data's own edges into a symbol clock. You should now be able to say:</p>
<ul>
<li><strong>The idea:</strong> split each bit at its estimated midpoint/boundary and compare half-integrals; perfect alignment balances them, and an offset $\tau$ unbalances a boundary-straddling integral linearly, $Y_1-Y_2=A(a_{k-1}-a_k)\tau$ — but only when a data transition is present.</li>
<li><strong>The DTTL structure:</strong> an in-phase integrator over the full symbol makes the bit decision, a mid-phase integrator of width $\xi T$ straddles the boundary, and the error $e_k=J_k\,(\hat a_{k-1}-\hat a_k)/2$ is gated to zero on no-transition symbols and rectified to $2A\tau$ on transitions.</li>
<li><strong>The S-curve:</strong> $g(\tau)=2Ap_t\tau$ in the linear window $\pm\xi T/2$, slope proportional to the transition density ($p_t=\tfrac12$ for random data, $p_t=2p(1-p)$ for biased bits); beyond the window the curve decays and half-symbol ambiguity looms.</li>
<li><strong>The noise story:</strong> thermal jitter $\sigma_\lambda\approx\sqrt{\xi B_LT/(4p_t\,E_s/N_0)}$; decision errors droop the slope by $(1-2P_s)$; self-noise from falsely gated pedestals and the random arrival of transitions scales with $\xi$ — all arguing for a narrow window once locked.</li>
<li><strong>The loop:</strong> loop filter (sets $B_L$, second order to null clock-rate error) plus symbol-clock NCO retiming both arms, with an effective update rate $p_t/T$ that makes transition density a first-class design parameter.</li>
<li><strong>The family:</strong> DTTL is the decision-directed relative of the early-late gate, Gardner, and Mueller-Muller detectors, and the data-edge version of the split-gate balance test used in radar range tracking and DLL code tracking.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://descanso.jpl.nasa.gov/monograph/series9/Descanso9_10_rev.pdf" target="_blank" rel="noopener">JPL DESCANSO Monograph 9, Ch. 10 — Symbol Synchronization (M. K. Simon)</a> — the definitive treatment of the DTTL from the lab that invented it: I/Q-arm structure, window width, S-curves, jitter analysis, and modern noncoherent variants for deep-space receivers.</li>
<li><a href="https://ipnpr.jpl.nasa.gov/progress_report/42-128/128A.pdf" target="_blank" rel="noopener">JPL TMO Progress Report 42-128 — Effects of Symbol Transition Density</a> — quantifies exactly how transition density drives DTTL tracking performance and telemetry SNR in the DSN's Block V receiver, the point this topic's $2Ap_t$ slope makes in theory.</li>
<li><a href="https://www.mathworks.com/help/comm/ref/comm.symbolsynchronizer-system-object.html" target="_blank" rel="noopener">MathWorks — comm.SymbolSynchronizer</a> — a runnable modern implementation: the zero-crossing (decision-directed) timing error detector is the sampled-data DTTL, documented alongside its Gardner, early-late, and Mueller-Muller siblings with their exact equations.</li>
<li><a href="https://en.wikipedia.org/wiki/Clock_recovery" target="_blank" rel="noopener">Wikipedia — Clock recovery</a> — the wider context: why serial links embed timing in the data, how PLL/DLL-based clock-data recovery works, and how line codes such as Manchester and 8b/10b guarantee the transition density that data-transition tracking depends on.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Split-bit (data-transition) tracking recovers symbol timing from the data waveform itself: the only timing landmarks in random NRZ are the data transitions between unlike bits.`,
      String.raw`The split-bit test: split the estimated bit at its midpoint; perfect alignment balances the half-integrals, while an offset $\tau$ gives $Y_1-Y_2=A(a_{k-1}-a_k)\tau$ — linear in $\tau$ but sign-tangled with the data.`,
      String.raw`The DTTL runs two arms off one clock: an in-phase integrator over the full symbol $T$ for the bit decision $\hat a_k=\mathrm{sgn}(I_k)$, and a mid-phase integrator of width $\xi T$ straddling the estimated boundary.`,
      String.raw`The mid-phase output is $J_k=A(a_{k-1}+a_k)\xi T/2+A(a_{k-1}-a_k)\tau$: a data pedestal with no timing content plus a timing term that exists only when a transition occurs.`,
      String.raw`The error signal $e_k=J_k\,(\hat a_{k-1}-\hat a_k)/2$ gates out no-transition symbols (sign $=0$) and rectifies the data polarity, leaving $e_k=2A\tau$ on every correctly detected transition.`,
      String.raw`Symbols without transitions carry no timing information and (to first order) inject no disturbance; the loop coasts across them on its filter memory and NCO rate.`,
      String.raw`The S-curve is $g(\tau)=2Ap_t\tau$ for $\lvert\tau\rvert\le\xi T/2$: slope $K_d=2Ap_t$ proportional to the transition density, so biased or repetitive data weakens the loop.`,
      String.raw`Transition density for independent bits with $P(+1)=p$ is $p_t=2p(1-p)$, maximized at $p_t=\tfrac12$ for random data; scramblers and Manchester coding protect it by design.`,
      String.raw`The mid-phase window width $\xi$ is the DTTL's narrow-correlator knob: smaller $\xi$ cuts thermal and self-noise (variance $\propto\xi$) but shrinks the linear pull-in region $\pm\xi T/2$.`,
      String.raw`Normalized thermal timing jitter: $\sigma_\lambda\approx\sqrt{\xi B_LT/(4p_t\,(E_s/N_0))}$ with $E_s/N_0$ a linear ratio — jitter falls with narrower window, narrower loop, denser transitions, stronger signal.`,
      String.raw`Decision errors flip the detected transition sign; the mean S-curve slope droops by the factor $(1-2P_s)$ with $P_s=Q(\sqrt{2E_s/N_0})$.`,
      String.raw`Self-noise arises from falsely gated data pedestals and from the random arrival of transitions; it scales with $\xi$ and motivates narrowing the window after lock.`,
      String.raw`Loop back end: loop filter (sets $B_L$; second order nulls a constant symbol-rate error) plus a symbol-clock NCO whose ticks retime both integrators; simplest update $\hat t_{k+1}=\hat t_k+T+K\,e_k$.`,
      String.raw`The loop's effective update rate is $p_t/T$, not $1/T$ — only transition symbols inform the clock, so transition density is a first-class design parameter.`,
      String.raw`Family ties: the DTTL is the decision-directed sibling of the early-late gate, Gardner, and Mueller-Muller TEDs, and the data-edge version of the split-gate balance used in radar range tracking and DLL code tracking; it powers symbol sync in deep-space telemetry (DSN Block V) and PSK modems.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 288" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="split-bit-tracking-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="288" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">DTTL block diagram: in-phase and mid-phase arms, transition gating</text>
<line x1="10" y1="140" x2="46" y2="140" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#split-bit-tracking-a1)"/>
<text x="8" y="132" fill="#9aa7b5" font-size="10">$r(t)$</text>
<line x1="46" y1="140" x2="46" y2="76" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="46" y1="140" x2="46" y2="210" stroke="#9aa7b5" stroke-width="1.1"/>
<!-- In-phase arm -->
<line x1="46" y1="76" x2="62" y2="76" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<rect x="62" y="58" width="96" height="36" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/>
<text x="70" y="74" fill="#e6edf3" font-size="9">in-phase</text><text x="70" y="87" fill="#9aa7b5" font-size="9">$\int$ full symbol $T$</text>
<line x1="158" y1="76" x2="182" y2="76" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<rect x="182" y="58" width="62" height="36" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/>
<text x="192" y="80" fill="#e6edf3" font-size="10">sgn( )</text>
<line x1="244" y1="76" x2="300" y2="76" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<text x="252" y="68" fill="#b197fc" font-size="9">data $\hat a_k$</text>
<!-- transition detector -->
<line x1="272" y1="76" x2="272" y2="118" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<rect x="216" y="118" width="132" height="36" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/>
<text x="224" y="133" fill="#e6edf3" font-size="9">transition detector</text>
<text x="224" y="147" fill="#9aa7b5" font-size="9">$(\hat a_{k-1}-\hat a_k)/2$</text>
<!-- Mid-phase arm -->
<line x1="46" y1="210" x2="62" y2="210" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<rect x="62" y="192" width="128" height="36" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/>
<text x="70" y="207" fill="#e6edf3" font-size="9">mid-phase</text><text x="70" y="221" fill="#9aa7b5" font-size="9">$\int$ window $\xi T$ at boundary</text>
<line x1="190" y1="210" x2="266" y2="210" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<text x="222" y="202" fill="#9aa7b5" font-size="9">$J_k$</text>
<circle cx="280" cy="210" r="13" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.4"/>
<text x="274" y="215" fill="#e6edf3" font-size="12">$\times$</text>
<line x1="280" y1="154" x2="280" y2="195" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<line x1="293" y1="210" x2="352" y2="210" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<text x="306" y="202" fill="#63e6be" font-size="9">$e_k$</text>
<rect x="352" y="192" width="80" height="36" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/>
<text x="362" y="207" fill="#e6edf3" font-size="9">loop filter</text><text x="362" y="221" fill="#9aa7b5" font-size="8">sets $B_L$</text>
<line x1="432" y1="210" x2="450" y2="210" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<rect x="450" y="192" width="80" height="36" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/>
<text x="456" y="207" fill="#e6edf3" font-size="9">symbol-clock</text><text x="466" y="221" fill="#e6edf3" font-size="9">NCO</text>
<line x1="490" y1="228" x2="490" y2="262" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="490" y1="262" x2="110" y2="262" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="110" y1="262" x2="110" y2="230" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)"/>
<line x1="110" y1="262" x2="110" y2="262" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="126" y1="262" x2="126" y2="96" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#split-bit-tracking-a1)" stroke-dasharray="4 3"/>
<text x="150" y="276" fill="#9aa7b5" font-size="9">clock ticks retime both integrators; error gated to zero when no transition</text>
</svg>`,
        caption: 'DTTL block diagram: the in-phase arm integrates the full symbol T and makes the bit decision (the data output); the mid-phase arm integrates a window of width xi*T straddling the estimated symbol boundary. The transition detector (a_hat_(k-1) - a_hat_k)/2 gates and rectifies the mid-phase output J_k, producing an error e_k = 2*A*tau on transition symbols and zero otherwise. A loop filter and symbol-clock NCO close the loop, retiming both integrators.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 268" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="268" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Mid-phase window straddling a data transition: offset $\tau$ unbalances it</text>
<!-- NRZ waveform: high (+A) until true boundary x=260, then low (-A) -->
<line x1="40" y1="130" x2="510" y2="130" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="3 3"/>
<text x="498" y="124" fill="#9aa7b5" font-size="9">0</text>
<path d="M50,80 L260,80 L260,180 L470,180" fill="none" stroke="#4dabf7" stroke-width="2"/>
<text x="80" y="70" fill="#4dabf7" font-size="10">$a_{k-1}A=+A$</text>
<text x="330" y="200" fill="#4dabf7" font-size="10">$a_kA=-A$</text>
<!-- true boundary -->
<line x1="260" y1="52" x2="260" y2="216" stroke="#63e6be" stroke-width="1.2"/>
<text x="264" y="50" fill="#63e6be" font-size="9">true boundary</text>
<!-- estimated boundary (early by tau) -->
<line x1="216" y1="52" x2="216" y2="216" stroke="#ff6b6b" stroke-width="1.2" stroke-dasharray="5 3"/>
<text x="96" y="50" fill="#ff6b6b" font-size="9">estimated boundary (early)</text>
<line x1="216" y1="60" x2="260" y2="60" stroke="#ffa94d" stroke-width="1.4"/>
<text x="228" y="56" fill="#ffa94d" font-size="9">$\tau$</text>
<!-- window xi*T centered on estimated boundary: [146, 286] -->
<rect x="146" y="80" width="140" height="100" fill="#ffa94d" fill-opacity="0.10" stroke="#ffa94d" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="146" y1="228" x2="286" y2="228" stroke="#ffa94d" stroke-width="1.2"/>
<text x="160" y="242" fill="#ffa94d" font-size="9">mid-phase window $\xi T$</text>
<!-- unbalanced sliver between estimated and true boundary -->
<rect x="216" y="80" width="44" height="50" fill="#ff6b6b" fill-opacity="0.35"/>
<text x="300" y="96" fill="#ff6b6b" font-size="9">extra $+A$ sliver of duration $\tau$:</text>
<text x="300" y="110" fill="#ff6b6b" font-size="9">window integral $J_k=2A\,a_{k-1}\tau$</text>
<text x="52" y="258" fill="#9aa7b5" font-size="10">Aligned: slivers cancel, $J_k=0$. Early clock: the $+A$ side outweighs the $-A$ side by $2A\tau$.</text>
</svg>`,
        caption: 'Timing geometry of the mid-phase (transition) integrator. The window of width xi*T is centred on the estimated boundary; the true data edge sits tau later (clock early). With a transition present, the window integrates +A for xi*T/2 + tau and -A for xi*T/2 - tau, so the pedestal cancels and the residue J_k = 2*A*a_(k-1)*tau is proportional to the timing offset. Perfect alignment makes the two slivers cancel exactly.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 262" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="262" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">DTTL S-curve: slope $2Ap_t$, linear region $\pm\xi/2$, transition density</text>
<line x1="40" y1="140" x2="510" y2="140" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="275" y1="42" x2="275" y2="238" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="4 3"/>
<text x="486" y="156" fill="#9aa7b5" font-size="10">$\lambda=\tau/T$</text>
<text x="282" y="54" fill="#9aa7b5" font-size="10">$g(\lambda)$</text>
<text x="466" y="134" fill="#9aa7b5" font-size="9">$+0.5$</text>
<text x="66" y="134" fill="#9aa7b5" font-size="9">$-0.5$</text>
<!-- p_t = 1/2 curve (teal): linear to lambda=+/-0.25 (x=175/375), decay to zero at +/-0.5 (x=75/475) -->
<path d="M75,140 L175,200 L375,80 L475,140" fill="none" stroke="#63e6be" stroke-width="2"/>
<!-- p_t = 1/4 curve (purple dashed): half slope -->
<path d="M75,140 L175,170 L375,110 L475,140" fill="none" stroke="#b197fc" stroke-width="2" stroke-dasharray="5 3"/>
<text x="330" y="72" fill="#63e6be" font-size="9">$p_t=1/2$ (random data): slope $2A\,p_t=A$</text>
<text x="352" y="118" fill="#b197fc" font-size="9">$p_t=1/4$: half the slope</text>
<!-- linear region marker -->
<line x1="175" y1="222" x2="375" y2="222" stroke="#4dabf7" stroke-width="1.5"/>
<text x="196" y="236" fill="#4dabf7" font-size="9">linear region $\pm\xi/2$ (here $\xi=0.5$)</text>
<circle cx="275" cy="140" r="4" fill="#ffa94d"/>
<text x="186" y="126" fill="#ffa94d" font-size="10">stable lock point</text>
<text x="386" y="170" fill="#9aa7b5" font-size="9">edge leaves window:</text>
<text x="386" y="182" fill="#9aa7b5" font-size="9">restoring force decays</text>
</svg>`,
        caption: 'The DTTL S-curve: mean error g(lambda) versus normalized timing offset lambda = tau/T for window width xi = 0.5. The curve is linear with slope 2*A*p_t over +/- xi/2, so halving the transition density p_t (purple, dashed) halves the discriminator gain. Beyond the linear region the true edge leaves the mid-phase window and the restoring force decays toward zero near a half-symbol offset, where the loop faces boundary ambiguity. The zero crossing at lambda = 0 is the stable lock point.'
      }
    ],
    equations: [
      {
        title: 'Half-Symbol Split: the Raw Timing Test',
        tex: String.raw`$$Y_1-Y_2=A\,(a_{k-1}-a_k)\,\tau=\begin{cases}-2A\,a_k\,\tau,&\text{transition}\\ 0,&\text{no transition}\end{cases}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The received baseband NRZ signal is $s(t)=A\sum_k a_k\,p(t-kT)$ with $a_k=\pm1$ and $p$ a unit rectangle of width $T$. The receiver splits its <em>estimated</em> bit-$k$ interval at the midpoint into half-integrals $Y_1$ (first half) and $Y_2$ (second half), each of length $T/2$. Let the estimate be early by $\tau>0$ ($\tau<T/2$), so the true boundary sits $\tau$ after the estimated one.</p>
<p><b>Step 1.</b> The estimated interval begins $\tau$ before the true start of bit $k$, so its first half contains the tail of bit $k{-}1$ for a duration $\tau$ and bit $k$ for the remaining $T/2-\tau$: $Y_1=A\,a_{k-1}\tau+A\,a_k(T/2-\tau)$. The second half lies wholly inside bit $k$ (since $\tau<T/2$): $Y_2=A\,a_k\,T/2$.</p>
<p><b>Step 2.</b> Subtract: $Y_1-Y_2=A\,a_{k-1}\tau+A\,a_k T/2-A\,a_k\tau-A\,a_k T/2=A(a_{k-1}-a_k)\tau$. If $a_{k-1}=a_k$ the difference vanishes for any $\tau$; if $a_{k-1}=-a_k$ it equals $-2A\,a_k\tau$.</p>
<p><b>Result.</b> The half-symbol imbalance is exactly linear in the timing offset — a ready-made discriminator — but only when a data transition borders the bit, and its sign is multiplied by the data polarity $a_k$. Averaged blindly over random data it would cancel to zero. Split-bit tracking therefore needs two additions: a gate that uses only transition symbols and a rectification by the (detected) transition sign — the two jobs the DTTL's transition logic performs.</p>`
      },
      {
        title: 'Mid-Phase (Transition) Integrator Output',
        tex: String.raw`$$J_k=A\,(a_{k-1}+a_k)\,\frac{\xi T}{2}+A\,(a_{k-1}-a_k)\,\tau,\qquad \lvert\tau\rvert\le\frac{\xi T}{2}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The DTTL's mid-phase arm integrates the received signal over a window of width $\xi T$ ($0<\xi\le1$) centred on the <em>estimated</em> boundary between symbols $k{-}1$ and $k$. Take the estimate early by $\tau$, so the true edge sits at $+\tau$ inside the window, and assume $\lvert\tau\rvert\le\xi T/2$ so the edge stays inside.</p>
<p><b>Step 1.</b> Split the window at the true edge. Before it (duration $\xi T/2+\tau$) the signal is the old level $a_{k-1}A$; after it (duration $\xi T/2-\tau$) the new level $a_kA$. So $J_k=A\,a_{k-1}(\xi T/2+\tau)+A\,a_k(\xi T/2-\tau)$.</p>
<p><b>Step 2.</b> Regroup into symmetric and antisymmetric parts: $J_k=A(a_{k-1}+a_k)\,\xi T/2+A(a_{k-1}-a_k)\,\tau$. With no transition ($a_k=a_{k-1}$) only the first term survives: a data pedestal $a_kA\,\xi T$, large but blind to $\tau$. With a transition ($a_k=-a_{k-1}$) the pedestal cancels and $J_k=2A\,a_{k-1}\tau$.</p>
<p><b>Result.</b> The mid-phase integrator is a transition-edge ruler: whenever the data flips, its output measures the signed offset of the true edge from the window centre, scaled by $2A$ and by the (unknown) data polarity $a_{k-1}$. Whenever the data does not flip, its output is pure pedestal that must be discarded. The window width $\xi$ never appears in the timing term — narrowing $\xi$ keeps the same sensitivity while collecting less noise, which is why practical DTTLs run $\xi$ well below 1 once locked.</p>`
      },
      {
        title: 'DTTL Error Signal (Transition Gating)',
        tex: String.raw`$$e_k=J_k\cdot\frac{\hat a_{k-1}-\hat a_k}{2}=\begin{cases}2A\,\tau,&\text{transition, correct decisions}\\ 0,&\text{no transition detected}\end{cases}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The mid-phase output $J_k=2A\,a_{k-1}\tau$ (on a transition) still carries the data polarity $a_{k-1}$, and no-transition symbols deliver a useless pedestal. The in-phase arm supplies decisions $\hat a_{k-1},\hat a_k$; form the transition-sign statistic $(\hat a_{k-1}-\hat a_k)/2$, which takes the values $+1$ ($+\to-$ edge), $-1$ ($-\to+$ edge), or $0$ (no detected transition).</p>
<p><b>Step 1.</b> No detected transition: the statistic is $0$, so $e_k=0$ — the pedestal $a_kA\,\xi T$ is gated out and never disturbs the loop.</p>
<p><b>Step 2.</b> Detected transition with correct decisions: $\hat a_{k-1}=a_{k-1}=-a_k$, so $(\hat a_{k-1}-\hat a_k)/2=a_{k-1}$. Multiplying, $e_k=2A\,a_{k-1}\tau\cdot a_{k-1}=2A\tau$ since $a_{k-1}^2=1$. Both edge directions now vote identically: the data polarity is rectified away.</p>
<p><b>Result.</b> On every correctly detected transition the DTTL outputs $e_k=2A\tau$: positive when the clock is early (true edge later than expected — push the estimate later), negative when late. The zero crossing at $\tau=0$, combined with corrective feedback, is the stable lock point. The decision-directed gating is the loop's defining feature: it wastes nothing on transition-free symbols, avoids the squaring loss of envelope-based detectors, and inherits its reliability from the bit decisions themselves — which is also its weakness at very low SNR, where decision errors flip the sign.</p>`
      },
      {
        title: 'Mean S-Curve and Discriminator Slope',
        tex: String.raw`$$g(\tau)=\mathrm{E}[e_k]=2A\,p_t\,\tau,\quad \lvert\tau\rvert\le\frac{\xi T}{2};\qquad K_d=2A\,p_t$$`,
        derivation: String.raw`<p><b>Where we start.</b> The loop responds to the <em>average</em> error over the data statistics, not to any single symbol. Let $p_t$ be the probability that consecutive symbols differ (the transition density), and assume high SNR so decisions are correct and each transition symbol yields $e_k=2A\tau$ while each no-transition symbol yields $e_k=0$.</p>
<p><b>Step 1.</b> Take the expectation over the data pattern: $g(\tau)=\mathrm{E}[e_k]=p_t\cdot(2A\tau)+(1-p_t)\cdot0=2A\,p_t\,\tau$, valid while the true edge stays inside the mid-phase window, $\lvert\tau\rvert\le\xi T/2$.</p>
<p><b>Step 2.</b> Differentiate at the origin to get the discriminator gain: $K_d=dg/d\tau\vert_0=2A\,p_t$. For random equiprobable data $p_t=1/2$ and $K_d=A$. Beyond $\lvert\tau\rvert=\xi T/2$ the edge exits the window, the per-transition error stops growing at its plateau and then shrinks as the offset approaches half a symbol, where the boundary becomes ambiguous and the S-curve returns to zero.</p>
<p><b>Result.</b> The S-curve is a straight line of slope $2Ap_t$ through a stable zero crossing, with linear region $\pm\xi T/2$. The slope — and hence the effective loop gain and bandwidth — is <em>proportional to the transition density</em>: a data stream that transitions half as often gives a loop that pulls half as hard. This is the quantitative reason telemetry systems scramble their data or use Manchester coding, and why DTTL analyses always quote performance as a function of $p_t$.</p>`
      },
      {
        title: 'Transition Density of the Data',
        tex: String.raw`$$p_t=\Pr(a_k\ne a_{k-1})=2p(1-p)\ \ \text{for i.i.d. bits with } \Pr(a_k=+1)=p;\qquad p_t^{\max}=\tfrac12$$`,
        derivation: String.raw`<p><b>Where we start.</b> The S-curve slope is $2Ap_t$, so we need $p_t$ from the bit statistics. Model the symbols $a_k$ as independent and identically distributed with $\Pr(a_k=+1)=p$ and $\Pr(a_k=-1)=1-p$.</p>
<p><b>Step 1.</b> A transition means consecutive symbols differ. By independence, $\Pr(a_{k-1}=+1,\ a_k=-1)=p(1-p)$ and $\Pr(a_{k-1}=-1,\ a_k=+1)=(1-p)p$. These are disjoint events, so $p_t=p(1-p)+(1-p)p=2p(1-p)$.</p>
<p><b>Step 2.</b> Maximize over $p$: $d\,[2p(1-p)]/dp=2-4p=0$ gives $p=\tfrac12$, where $p_t=2\cdot\tfrac12\cdot\tfrac12=\tfrac12$. Any bias reduces it — e.g. $p=0.8$ gives $p_t=0.32$ — and correlated (repetitive) data can push it far lower than the i.i.d. formula suggests.</p>
<p><b>Result.</b> Even perfectly random data feeds the DTTL timing information only every other symbol on average ($p_t=\tfrac12$), and biased or structured data does worse, shrinking the loop gain proportionally and stretching the intervals the loop must coast through. This is why practical links scramble user data toward $p\approx\tfrac12$, why Manchester coding (a forced mid-bit transition in every symbol, $p_t=1$ at double bandwidth) exists, and why DSN telemetry standards specify minimum transition densities for symbol synchronizer performance.</p>`
      },
      {
        title: 'Decision-Error Slope Degradation',
        tex: String.raw`$$K_{\text{eff}}=2A\,p_t\,(1-2P_s),\qquad P_s=Q\!\big(\sqrt{2E_s/N_0}\big)$$`,
        derivation: String.raw`<p><b>Where we start.</b> The transition sign $(\hat a_{k-1}-\hat a_k)/2$ is built from two noisy decisions, each wrong with the antipodal-signalling symbol error probability $P_s=Q(\sqrt{2E_s/N_0})$. On a true transition, a wrong sign turns the vote $+2A\tau$ into $-2A\tau$; we ask what happens to the mean slope.</p>
<p><b>Step 1.</b> Enumerate the two flanking decisions on a true transition ($a_{k-1}=-a_k$). The detected sign is <em>correct</em> only when <em>both</em> decisions are correct — probability $(1-P_s)^2$, vote $+2A\tau$. When <em>both</em> are wrong, the difference $(\hat a_{k-1}-\hat a_k)$ flips its sign, <em>inverting</em> the vote to $-2A\tau$ — probability $P_s^2$. When <em>exactly one</em> decision errs, the two decisions come out equal, the transition is not detected and the gate closes to zero — probability $2P_s(1-P_s)$.</p>
<p><b>Step 2.</b> The mean multiplier on the per-transition error is therefore $(1-P_s)^2\,(+1)+P_s^2\,(-1)+2P_s(1-P_s)\,(0)=(1-P_s)^2-P_s^2=1-2P_s$. Equivalently, the error is <em>linear</em> in the decisions and $\mathrm{E}[\hat a]=a(1-2P_s)$, so exactly one such factor appears (not two — the detector is a difference of decisions, not a product). Scaling the ideal slope $2Ap_t$ gives $K_{\text{eff}}=2Ap_t(1-2P_s)$.</p>
<p><b>Result.</b> Decision noise droops the discriminator gain by $(1-2P_s)$: invisible at high SNR ($P_s\to0$), but a real effect in the low-$E_s/N_0$ regimes where the DTTL is most used — at $P_s=0.1$ the slope falls to $0.8$ of ideal. Decision errors also open the gate on no-transition symbols, letting their large pedestals through with random sign: pure <em>self-noise</em> that raises jitter on top of the gain droop. Both effects motivate the narrow window $\xi$ and, in deep-space practice, soft-decision (linear) DTTL variants that replace the hard sign with a soft weighting.</p>`
      },
      {
        title: 'Thermal Timing Jitter of the DTTL',
        tex: String.raw`$$\sigma_\lambda\approx\sqrt{\frac{\xi\,B_L\,T}{4\,p_t\,(E_s/N_0)}}\qquad\big(\lambda=\tau/T\big)$$`,
        derivation: String.raw`<p><b>Where we start.</b> White noise of two-sided density $N_0/2$ enters both arms. We want the closed-loop 1-sigma jitter of the normalized timing estimate $\lambda=\tau/T$ given loop noise bandwidth $B_L$, window $\xi$, transition density $p_t$, and symbol SNR $E_s/N_0$ with $E_s=A^2T$.</p>
<p><b>Step 1.</b> The mid-phase integrate-and-dump over $\xi T$ turns the input noise into a zero-mean sample of variance $N_0\xi T/2$. The gate passes it (multiplied by $\pm1$, which preserves variance) on the fraction $p_t$ of symbols, so the per-symbol error-signal noise variance is $\sigma_e^2\approx p_t\,N_0\xi T/2$, roughly white from symbol to symbol.</p>
<p><b>Step 2.</b> A tracking loop converts input-error noise to estimate noise via its gain and bandwidth: $\sigma_\tau^2=\sigma_e^2\,T\cdot2B_L/K_d^2$ (discrete white noise of variance $\sigma_e^2$ every $T$ has flat spectral density $\sigma_e^2T$; the loop passes $2B_L$ of it; the discriminator slope $K_d=2Ap_t$ converts volts-seconds to seconds). Substituting: $\sigma_\tau^2=\dfrac{(p_tN_0\xi T/2)\,T\,2B_L}{4A^2p_t^2}=\dfrac{N_0\,\xi\,B_L\,T^2}{4A^2p_t}$.</p>
<p><b>Result.</b> Dividing by $T^2$ and using $E_s=A^2T$: $\sigma_\lambda^2\approx\dfrac{\xi\,B_LT}{4\,p_t\,(E_s/N_0)}$. Every lever reads off directly: halve the window $\xi$ or the bandwidth $B_L$ and the variance halves; double the SNR or the transition density and it halves again. Note $p_t$ appears in the <em>denominator</em> once, not twice — the gate removes noise as well as signal, so sparse transitions cost gain faster than they save noise. Convert a dB value of $E_s/N_0$ to linear before substituting.</p>`
      },
      {
        title: 'Symbol-Clock NCO Update',
        tex: String.raw`$$\hat t_{k+1}=\hat t_k+T+K\,e_k\qquad\Longleftrightarrow\qquad f_{\text{sym}}[k]=f_0-K_f\,\bar e[k]$$`,
        derivation: String.raw`<p><b>Where we start.</b> The loop must translate the error samples $e_k$ into motion of the estimated symbol boundaries $\hat t_k$. In hardware or software this is a symbol-clock NCO: a phase accumulator whose overflow instants define the boundaries, with the accumulator rate as the control knob.</p>
<p><b>Step 1.</b> First-order (epoch) form: advance each boundary by the nominal period plus a proportional correction, $\hat t_{k+1}=\hat t_k+T+K\,e_k$. Check the sign: clock early means the true edge is later, $e_k=2A\tau>0$, and the update pushes $\hat t_{k+1}$ later — corrective. With gain $K$ small, the mean error obeys $\tau_{k+1}=\tau_k-K\,g(\tau_k)\approx(1-2Ap_tK)\,\tau_k$: a geometric decay to lock for $0<2Ap_tK<2$.</p>
<p><b>Step 2.</b> Rate (NCO) form: accumulate the filtered error into the NCO frequency, $f_{\text{sym}}[k]=f_0-K_f\bar e[k]$, where $\bar e$ is the loop-filter output. A positive sustained error (clock persistently early) lowers the symbol-clock frequency so boundaries drift later. Adding this integrating branch to the proportional one makes the loop second order, driving the steady-state error to zero even when transmit and receive symbol rates differ by a constant offset (clock ppm error or Doppler).</p>
<p><b>Result.</b> The NCO closes the loop: discriminator $\to$ filter $\to$ clock rate $\to$ boundary positions $\to$ back into both integrators. The effective update rate is $p_t/T$ since only transitions inform the loop, so the loop time constant in <em>symbols</em> stretches as $1/p_t$; between transitions the NCO free-runs at its last commanded rate — the flywheel that carries timing across data runs, and the reason a second-order loop (which remembers rate, not just phase) is standard.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What problem does split-bit (data-transition) tracking solve?`, back: String.raw`Recovering the symbol clock from a self-clocking NRZ data stream — no pilot or clock line — by measuring the offset of observed data transitions from the receiver's estimated symbol boundaries.` },
      { front: String.raw`State the split-bit test in one sentence.`, back: String.raw`Split the estimated bit at its midpoint and compare half-integrals: aligned clocks balance them, and an offset $\tau$ produces an imbalance $A(a_{k-1}-a_k)\tau$, linear in $\tau$ but present only at data transitions.` },
      { front: String.raw`Name the two integrator arms of the DTTL and their jobs.`, back: String.raw`In-phase arm: integrates the full symbol $T$ and makes the bit decision (also the data demodulator). Mid-phase (transition) arm: integrates a window $\xi T$ straddling the estimated boundary to measure the edge offset.` },
      { front: String.raw`Write the mid-phase integrator output for offset $\tau$.`, back: String.raw`$J_k=A(a_{k-1}+a_k)\xi T/2+A(a_{k-1}-a_k)\tau$: a data pedestal (no timing content) plus a timing term $2Aa_{k-1}\tau$ that exists only on transitions.` },
      { front: String.raw`How is the DTTL error signal formed and what does it equal?`, back: String.raw`$e_k=J_k\cdot(\hat a_{k-1}-\hat a_k)/2$; on a correctly detected transition $e_k=2A\tau$, and on no-transition symbols the gate is zero.` },
      { front: String.raw`Why multiply by the transition sign instead of using $J_k$ directly?`, back: String.raw`$J_k$'s timing term carries the data polarity $a_{k-1}$, so raw errors from up and down edges would cancel on average; the detected sign rectifies them (and gates out pedestal-only symbols).` },
      { front: String.raw`What do no-transition symbols contribute to the loop?`, back: String.raw`No timing information and, to first order, no disturbance: the transition gate is zero, so the loop coasts on its filter memory and NCO rate until the next edge.` },
      { front: String.raw`Give the DTTL S-curve and its slope in the linear region.`, back: String.raw`$g(\tau)=2Ap_t\tau$ for $\lvert\tau\rvert\le\xi T/2$; slope $K_d=2Ap_t$, proportional to the transition density ($K_d=A$ for random data).` },
      { front: String.raw`Define transition density and give it for i.i.d. bits.`, back: String.raw`$p_t=\Pr(a_k\ne a_{k-1})$; for independent bits with $\Pr(+1)=p$, $p_t=2p(1-p)$, maximized at $1/2$ for random data.` },
      { front: String.raw`What does the window width $\xi$ trade?`, back: String.raw`Noise against pull-in: mid-phase noise (and self-noise) variance scales with $\xi$ while the central slope does not, but the linear region is $\pm\xi T/2$ — narrow windows are quieter yet need a more accurate handover.` },
      { front: String.raw`State the DTTL thermal timing-jitter law.`, back: String.raw`$\sigma_\lambda\approx\sqrt{\xi B_LT/(4p_t\,(E_s/N_0))}$ with $\lambda=\tau/T$, $B_L$ the loop bandwidth, and $E_s/N_0$ a linear ratio — jitter falls with narrower $\xi$, narrower $B_L$, denser transitions, stronger signal.` },
      { front: String.raw`How do decision errors affect the DTTL?`, back: String.raw`They flip the detected transition sign, drooping the mean slope by $(1-2P_s)$ with $P_s=Q(\sqrt{2E_s/N_0})$, and they falsely gate in pedestals from no-transition symbols, adding self-noise.` },
      { front: String.raw`What is self-noise (pattern noise) in a DTTL?`, back: String.raw`Loop disturbance present even without thermal noise: falsely gated data pedestals and the random arrival of transitions make $e_k$ fluctuate about its mean; it scales with $\xi$ and with distance from lock.` },
      { front: String.raw`Write the simplest DTTL clock update and its stability condition.`, back: String.raw`$\hat t_{k+1}=\hat t_k+T+Ke_k$; the mean error decays geometrically for $0<2Ap_tK<2$. A second-order (rate-integrating) loop also nulls a constant symbol-rate offset.` },
      { front: String.raw`Why is the DTTL's effective update rate $p_t/T$ rather than $1/T$?`, back: String.raw`Only transition symbols open the gate and inform the loop; runs of identical bits are coasting intervals, so the loop time constant in symbols stretches as $1/p_t$.` },
      { front: String.raw`How does the DTTL relate to the early-late gate and Gardner detectors?`, back: String.raw`All balance samples around a timing landmark. The early-late gate compares energies of offset full-symbol windows (non-data-aided, squaring loss); Gardner multiplies the mid-sample by the strobe difference (non-data-aided); the DTTL is the decision-directed integrate-and-dump form, and the zero-crossing TED is its sampled version.` },
      { front: String.raw`Why do telemetry links scramble data or use Manchester coding for the DTTL's sake?`, back: String.raw`The loop gain is proportional to $p_t$: scrambling drives user data toward $p_t\approx1/2$, and Manchester forces a transition every bit ($p_t=1$) at double bandwidth, guaranteeing the synchronizer always has edges to track.` }
    ],
    mcqs: [
      { q: String.raw`Split-bit (data-transition) tracking recovers symbol timing from:`, options: [String.raw`a separate transmitted clock tone`, String.raw`the data waveform's own transitions between unlike bits`, String.raw`the carrier phase`, String.raw`a training preamble sent every frame`], answer: 1, explain: String.raw`Random NRZ has no clock line; the only timing landmarks are the data edges, and the loop measures their offset from the expected boundaries.` },
      { q: String.raw`In the DTTL, the in-phase (full-symbol) integrator output is used to:`, options: [String.raw`measure the timing offset directly`, String.raw`make the bit decision that feeds the transition detector (and the data output)`, String.raw`set the loop bandwidth`, String.raw`cancel the carrier`], answer: 1, explain: String.raw`The I arm is the data demodulator; its decisions $\hat a_k$ both deliver the data and drive the transition gating.` },
      { q: String.raw`The mid-phase (transition) integrator window is placed:`, options: [String.raw`over the middle of one symbol`, String.raw`straddling the estimated boundary between two consecutive symbols`, String.raw`over two full symbols`, String.raw`anywhere — position is irrelevant`], answer: 1, explain: String.raw`Half the window covers the tail of symbol $k{-}1$ and half the head of symbol $k$, so a misplaced boundary leaves a linear residue.` },
      { q: String.raw`With a transition present and the clock early by $\tau$, the gated DTTL error (correct decisions) is:`, options: [String.raw`$A\tau^2$`, String.raw`$2A\tau$`, String.raw`$A\xi T$`, String.raw`zero`], answer: 1, explain: String.raw`The pedestal cancels on a transition and the rectified residue is $e_k=2A\tau$, independent of edge direction.` },
      { q: String.raw`When two consecutive bits are identical, the DTTL error signal for that boundary is:`, options: [String.raw`$2A\tau$`, String.raw`$A\xi T$`, String.raw`zero — the transition gate closes`, String.raw`negative`], answer: 2, explain: String.raw`$(\hat a_{k-1}-\hat a_k)/2=0$ with equal decisions, so no-transition symbols contribute neither timing information nor (to first order) disturbance.` },
      { q: String.raw`The DTTL S-curve slope in the linear region equals:`, options: [String.raw`$2Ap_t$`, String.raw`$A\xi$`, String.raw`$2A/\xi$`, String.raw`$4Ap_t^2$`], answer: 0, explain: String.raw`Each transition contributes slope $2A$ and transitions occur with probability $p_t$, so the mean slope is $K_d=2Ap_t$.` },
      { q: String.raw`For independent equiprobable bits, the transition density is:`, options: [String.raw`$1$`, String.raw`$3/4$`, String.raw`$1/2$`, String.raw`$1/4$`], answer: 2, explain: String.raw`$p_t=2p(1-p)$ peaks at $p=1/2$, giving $p_t=1/2$: even random data informs the loop only every other symbol on average.` },
      { q: String.raw`Narrowing the mid-phase window width $\xi$ primarily:`, options: [String.raw`increases the S-curve central slope`, String.raw`reduces noise and self-noise while shrinking the linear pull-in region $\pm\xi T/2$`, String.raw`raises the transition density`, String.raw`eliminates decision errors`], answer: 1, explain: String.raw`The timing term is independent of $\xi$ but the collected noise variance scales with $\xi$ — the DTTL's narrow-correlator trade.` },
      { q: String.raw`In $\sigma_\lambda\approx\sqrt{\xi B_LT/(4p_t\,E_s/N_0)}$, halving the loop bandwidth $B_L$ changes the jitter by a factor:`, options: [String.raw`$1/2$`, String.raw`$1/\sqrt2$`, String.raw`$1/4$`, String.raw`no change`], answer: 1, explain: String.raw`The variance is proportional to $B_L$, so the 1-sigma jitter scales as $\sqrt{B_L}$: halving $B_L$ divides $\sigma_\lambda$ by $\sqrt2$.` },
      { q: String.raw`A symbol decision error on one of the two bits flanking a true transition causes the error sample to:`, options: [String.raw`double`, String.raw`flip sign, pushing the clock the wrong way`, String.raw`become zero always`, String.raw`be unaffected`], answer: 1, explain: String.raw`One wrong decision inverts the detected transition sign, turning $+2A\tau$ into $-2A\tau$; averaged, the slope droops by $(1-2P_s)$.` },
      { q: String.raw`The DTTL's mean slope degradation factor from decision errors is:`, options: [String.raw`$(1-2P_s)$`, String.raw`$(1-2P_s)^2$`, String.raw`$P_s^2$`, String.raw`$1/(1+P_s)$`], answer: 0, explain: String.raw`The detected sign is right only when both decisions are correct (both wrong inverts it, one wrong gates it out); the mean multiplier is $(1-P_s)^2-P_s^2=1-2P_s$. It is linear, not squared, because the transition detector is a difference of two decisions, not a product.` },
      { q: String.raw`Compared with the early-late gate, the DTTL:`, options: [String.raw`needs no bit decisions`, String.raw`is decision-directed, avoiding squaring loss but depending on decision reliability`, String.raw`only works with a pilot tone`, String.raw`has a slope independent of the data`], answer: 1, explain: String.raw`The early-late gate compares window energies (non-data-aided, squaring loss); the DTTL uses decisions to gate and rectify a linear mid-phase measurement.` },
      { q: String.raw`A long run of identical bits causes the DTTL to:`, options: [String.raw`lose lock immediately`, String.raw`coast on its loop-filter memory and NCO rate, receiving no new timing information`, String.raw`double its bandwidth`, String.raw`invert its S-curve`], answer: 1, explain: String.raw`No transitions means every gate closes; the flywheel carries the clock, which is why transition density is protected by scrambling or line coding.` },
      { q: String.raw`Manchester (bi-phase) coding helps data-transition tracking because it:`, options: [String.raw`halves the bandwidth`, String.raw`guarantees a transition in every bit, maximizing transition density`, String.raw`removes thermal noise`, String.raw`makes decisions unnecessary`], answer: 1, explain: String.raw`Its forced mid-bit transition gives $p_t=1$ — a timing edge every symbol — at the cost of doubled bandwidth.` }
    ],
    numericals: [
      {
        q: String.raw`A DTTL tracks NRZ data with amplitude $A=2$ V and symbol time $T=1$ ms, window $\xi=1$. The estimated boundary is early by $\tau=40\ \mu$s and the current symbol pair contains a transition (decisions correct). Find the error sample $e_k$ and the normalized offset $\lambda$.`,
        solution: String.raw`<p><b>Formula.</b> On a correctly detected transition with $\lvert\tau\rvert\le\xi T/2$, $$e_k=2A\,\tau,\qquad \lambda=\frac{\tau}{T}.$$</p>
<p><b>Substitute.</b> Check the window: $\xi T/2=0.5$ ms $\ge40\ \mu$s — inside. Then $e_k=2\times2\ \text{V}\times40\times10^{-6}\ \text{s}$ and $\lambda=40\times10^{-6}/10^{-3}$.</p>
<p><b>Compute.</b> $e_k=1.6\times10^{-4}$ V·s $=\mathbf{160\ \mu V\cdot s}$; $\lambda=\mathbf{0.04}$ (4% of a symbol).</p>
<p><b>Explanation.</b> The integrate-and-dump output has volt-second units; what matters is its sign and proportionality: $+160\ \mu$V·s says the clock is early, so the loop pushes the boundary later. A no-transition symbol pair would have returned exactly zero regardless of $\tau$ — the DTTL learns nothing between edges.</p>`
      },
      {
        q: String.raw`With amplitude $A=1$ V, compare the DTTL discriminator slope for random data ($p_t=0.5$) and for sluggish data with $p_t=0.25$. What does the slope change do to the thermal timing jitter, all else fixed?`,
        solution: String.raw`<p><b>Formula.</b> $$K_d=2A\,p_t,\qquad \sigma_\lambda=\sqrt{\frac{\xi B_LT}{4p_t(E_s/N_0)}}\ \Rightarrow\ \frac{\sigma_2}{\sigma_1}=\sqrt{\frac{p_{t1}}{p_{t2}}}.$$</p>
<p><b>Substitute.</b> $K_d(0.5)=2\times1\times0.5$; $K_d(0.25)=2\times1\times0.25$; jitter ratio $=\sqrt{0.5/0.25}$.</p>
<p><b>Compute.</b> $K_d(0.5)=\mathbf{1.0}$ V and $K_d(0.25)=\mathbf{0.5}$ V — the slope halves. Jitter grows by $\sqrt2=\mathbf{1.414}$ (41.4% more).</p>
<p><b>Explanation.</b> Halving the transition density halves the loop's restoring gain, and because $p_t$ sits once in the jitter denominator, the 1-sigma jitter grows only as $1/\sqrt{p_t}$ — the gate discards noise as well as signal. The loop also updates half as often, stretching its settling time in symbols by a factor 2, which is why links protect $p_t$ with scramblers.</p>`
      },
      {
        q: String.raw`A DTTL runs with window $\xi=1$, loop bandwidth $B_L=50$ Hz, symbol time $T=1$ ms, random data ($p_t=0.5$), and $E_s/N_0=10$ dB. Find the 1-sigma timing jitter as a fraction of a symbol and in microseconds.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_\lambda=\sqrt{\frac{\xi\,B_L\,T}{4\,p_t\,(E_s/N_0)}},$$ with $E_s/N_0$ converted to a linear ratio first.</p>
<p><b>Substitute.</b> $E_s/N_0=10^{10/10}=10$; $B_LT=50\times10^{-3}=0.05$. Then $\sigma_\lambda=\sqrt{\dfrac{1\times0.05}{4\times0.5\times10}}=\sqrt{\dfrac{0.05}{20}}$.</p>
<p><b>Compute.</b> $\sigma_\lambda^2=2.5\times10^{-3}$, so $\sigma_\lambda=\mathbf{0.05}$ (5% of a symbol); in time, $\sigma_\tau=0.05\times1\ \text{ms}=\mathbf{50\ \mu s}$.</p>
<p><b>Explanation.</b> A 5% symbol jitter is workable but not luxurious: the $3\sigma$ excursion is 15% of a symbol, comfortably inside the $\pm\xi T/2=\pm50\%$ linear region, so lock is secure. The dominant cheap improvement is narrowing $\xi$ or $B_L$ — see the next problem — since both enter under the square root.</p>`
      },
      {
        q: String.raw`Repeat the previous case with the mid-phase window narrowed to $\xi=0.25$ after lock. Find the new jitter and the improvement factor, and state the new linear pull-in range.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_\lambda=\sqrt{\frac{\xi\,B_L\,T}{4\,p_t\,(E_s/N_0)}}\ \Rightarrow\ \frac{\sigma_{\text{new}}}{\sigma_{\text{old}}}=\sqrt{\xi_{\text{new}}/\xi_{\text{old}}}.$$</p>
<p><b>Substitute.</b> $\sigma_\lambda^2=\dfrac{0.25\times0.05}{4\times0.5\times10}=\dfrac{0.0125}{20}$; improvement factor $=\sqrt{0.25/1}$.</p>
<p><b>Compute.</b> $\sigma_\lambda^2=6.25\times10^{-4}$, so $\sigma_\lambda=\mathbf{0.025}$ (2.5%, i.e. $\sigma_\tau=25\ \mu$s) — a factor $\sqrt{0.25}=\mathbf{0.5}$, halving the jitter. The linear region shrinks to $\pm\xi T/2=\pm0.125\,T=\pm\mathbf{125\ \mu s}$.</p>
<p><b>Explanation.</b> Narrowing the window collects one quarter of the noise while the per-transition slope $2A$ is unchanged, so the jitter halves — the DTTL's exact analogue of the DLL's narrow correlator. The price is a pull-in range cut from $\pm500\ \mu$s to $\pm125\ \mu$s: still $5\sigma$ deep here, but the reason receivers acquire with a wide window and narrow it only once locked.</p>`
      },
      {
        q: String.raw`At $E_s/N_0=6.02$ dB (linear 4), evaluate the DTTL slope-degradation factor $(1-2P_s)$ with $P_s=Q(\sqrt{2E_s/N_0})$, and the effective slope for $A=1$ V, $p_t=0.5$. Use $Q(2.83)\approx2.3\times10^{-3}$.`,
        solution: String.raw`<p><b>Formula.</b> $$P_s=Q\big(\sqrt{2E_s/N_0}\big),\qquad K_{\text{eff}}=2A\,p_t\,(1-2P_s).$$</p>
<p><b>Substitute.</b> $\sqrt{2\times4}=\sqrt8=2.83$, so $P_s\approx2.3\times10^{-3}$. Then the factor is $1-2P_s=1-4.6\times10^{-3}=0.9954$ and $K_{\text{eff}}=2\times1\times0.5\times0.9954$.</p>
<p><b>Compute.</b> The degradation factor is $\mathbf{0.9954}$ (a 0.46% slope loss) and $K_{\text{eff}}=1.0\times0.9954=\mathbf{0.995}$ V.</p>
<p><b>Explanation.</b> At 6 dB the decisions are already good enough that the DTTL keeps over 99% of its ideal gain — decision-directed tracking is cheap here. The droop becomes serious only at very low SNR: at $P_s=0.1$ the factor falls to $1-0.2=0.8$, a 20% gain loss plus extra self-noise from false gating, which is when soft-decision (linear) DTTL variants earn their keep. The factor is linear in $P_s$ (not squared) because the transition detector is a difference of two decisions, so each carries a single $(1-2P_s)$.</p>`
      },
      {
        q: String.raw`A telemetry source emits i.i.d. bits with $\Pr(+1)=0.8$ (no scrambler). Find the transition density, the S-curve slope relative to random data, and the resulting thermal-jitter penalty factor.`,
        solution: String.raw`<p><b>Formula.</b> $$p_t=2p(1-p),\qquad \frac{K_d}{K_d^{\text{rand}}}=\frac{p_t}{0.5},\qquad \frac{\sigma}{\sigma_{\text{rand}}}=\sqrt{\frac{0.5}{p_t}}.$$</p>
<p><b>Substitute.</b> $p_t=2\times0.8\times0.2$; slope ratio $=p_t/0.5$; jitter factor $=\sqrt{0.5/p_t}$.</p>
<p><b>Compute.</b> $p_t=\mathbf{0.32}$. Slope ratio $=0.32/0.5=\mathbf{0.64}$ (36% gain loss). Jitter factor $=\sqrt{0.5/0.32}=\sqrt{1.5625}=\mathbf{1.25}$ (25% more jitter).</p>
<p><b>Explanation.</b> Biased data starves the loop of edges: only 32% of boundaries carry timing, the discriminator pulls 36% less hard, and the timing jitter grows 25%. The loop also coasts through longer transition-free runs (mean run length $1/p_t\approx3.1$ symbols instead of 2). A scrambler restoring $p\approx0.5$ recovers all of this for free — which is exactly why standards mandate one.</p>`
      }
    ],
    realWorld: String.raw`<p>The DTTL earns its keep wherever binary data must be clocked out of noise with no timing pilot — above all in <strong>deep-space telemetry</strong>. NASA's Deep Space Network baselined the data-transition tracking loop in its receivers, including the Block V, precisely because a Voyager or Mars-orbiter downlink arrives at a few dB of $E_s/N_0$ with every decibel spoken for: the DTTL approximates the optimum (MAP) binary symbol synchronizer while sharing its in-phase integrator with the data detector, so the timing function is nearly free. JPL's DESCANSO analyses quantify everything this topic derived — window-width trades, transition-density sensitivity (DSN standards specify minimum transition densities for exactly this reason), and noncoherent DTTL variants that tolerate imperfect carrier lock during critical events like planetary encounters.</p>
<p>The same detector lives on in modern hardware under a different name: the <strong>zero-crossing (decision-directed) timing error detector</strong> in software radios and modem libraries (MATLAB's comm.SymbolSynchronizer among them) is the sampled-data DTTL, sitting alongside its non-data-aided cousins Gardner and early-late. Satellite command receivers pair it with scramblers or Manchester coding to guarantee edges; CCSDS telemetry chains rely on it after Costas-loop carrier recovery. And the split-window balance test generalizes across domains: radar range trackers hold a split gate centred on the echo pulse, and spread-spectrum receivers split correlation windows around PN code edges for ranging — the same geometry the DLL implements with Early and Late correlators. One idea — split the window, balance the halves, correct toward balance — quietly keeps clocks, gates, and codes centred across half of RF engineering.</p>`,
    related: ['delay-lock-tracking', 'tau-dither-tracking', 'early-late-correlator', 'synchronization']
  }
);
