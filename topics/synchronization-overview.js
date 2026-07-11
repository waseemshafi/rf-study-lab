/* synchronization-overview.js — "Synchronization (Overview)" topic (Synchronization).
   Umbrella overview that ties together pll / fll / costas-loop / cfo / early-late-correlator /
   delay-lock-tracking: the sync hierarchy, acquisition vs tracking, DA vs NDA, feedback vs
   feedforward, the ML framework, and performance limits (loop SNR, jitter, CRLB, cycle slips).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "synchronization-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'synchronization',
    title: 'Synchronization (Overview)',
    category: 'Synchronization',
    tags: ['synchronization', 'carrier recovery', 'symbol timing', 'frame sync', 'acquisition', 'tracking', 'loop SNR', 'cycle slip', 'CRLB', 'Gardner', 'Viterbi-Viterbi', 'data-aided'],
    summary: String.raw`Synchronization is the receiver's campaign to recover every reference the channel destroyed — carrier frequency, carrier phase, symbol timing, frame position, and (for spread spectrum) code phase — in a strict hierarchy of acquisition-then-tracking stages, using data-aided or blind estimators arranged as feedback loops or feedforward blocks, all of them special cases of maximum-likelihood estimation whose accuracy is governed by the loop SNR $\rho_L=C/(N_0B_L)$, the phase-jitter law $\sigma_\phi^2=1/(2\rho_L)$, and ultimately the Cramer-Rao lower bound.`,
    prerequisites: ['pll', 'costas-loop', 'early-late-correlator'],
    intro: String.raw`<p><strong>Why does a receiver that already knows the modulation, the pulse shape, and the data rate still recover garbage the instant it is switched on?</strong> Because a coherent receiver is a machine for comparing the received waveform against locally generated references — a carrier, a symbol clock, a frame ruler, perhaps a spreading code — and every one of those references is initially <em>wrong</em>. The transmitter's oscillator and the receiver's oscillator are separate pieces of quartz that disagree by parts per million; the propagation path inserts an unknown delay and an unknown phase; Doppler stretches everything; and none of these values stands still. Until the receiver drags each local reference into alignment with the signal, matched filtering samples the wrong instants, the constellation spins or sits rotated, and the demodulator's decisions are no better than coin flips.</p>
<p><strong>Synchronization</strong> is the collective name for the estimators and feedback loops that fix this, and this topic is the map of that territory. The individual weapons each have their own topic — the PLL and FLL, the Costas loop, CFO estimation, the early-late gate, the delay-lock loop — but here we ask the questions that live <em>above</em> any single loop: What exactly must be aligned, and how badly does each misalignment hurt? In what order must the stages run, and why does frequency come before phase and phase (usually) after timing is at least coarse? When do we burn overhead on a known preamble (data-aided) and when do we estimate blindly from the modulated signal itself? When is a closed feedback loop the right architecture and when is a one-shot feedforward estimate better? And what fundamental limits — loop SNR, thermal jitter, cycle slips, the Cramer-Rao bound — decide how well any of it can ever work?</p>
<p>The deepest idea in the topic is that this zoo is not a zoo at all. Every practical synchronizer — Costas loop, Gardner detector, early-late gate, Viterbi&ndash;Viterbi estimator — can be derived from a single principle: write the likelihood of the received waveform as a function of the unknown frequency, phase, and timing, and either maximize it directly (feedforward) or follow its gradient toward the peak (feedback). The discriminators you met in other topics are simply that gradient, evaluated with different amounts of knowledge about the data. Seeing the family resemblance is what turns a bag of tricks into a discipline you can design with.</p>`,
    sections: [
      {
        h: 'Why receivers must synchronize: what each misalignment destroys',
        html: String.raw`<p><strong>Why is synchronization not optional?</strong> Because coherent detection is, mathematically, an inner product between the received waveform and a local template — and an inner product is exquisitely sensitive to the template being <em>the same signal</em> in frequency, phase, and time. Each residual error attacks the demodulator in its own characteristic way:</p>
<ul>
<li><strong>Carrier frequency error $\Delta f$:</strong> the constellation <em>rotates continuously</em> at $\Delta f$ revolutions per second. The phase advance per symbol is $2\pi\,\Delta f\,T$; once the accumulated rotation approaches a decision-boundary half-angle ($\pi/4$ for QPSK) every symbol is decided wrongly. Even small $\Delta f$ also slides the signal spectrum against the matched filter, losing energy and admitting adjacent-channel noise.</li>
<li><strong>Carrier phase error $\theta$:</strong> the constellation sits <em>statically rotated</em>. The useful (in-phase) component shrinks by $\cos\theta$ and, for two-dimensional constellations, energy leaks into the wrong quadrature rail — QPSK suffers crosstalk proportional to $\sin\theta$ between its two bit streams.</li>
<li><strong>Symbol timing error $\varepsilon$:</strong> the matched filter is sampled off the eye centre: the wanted sample shrinks (following the pulse autocorrelation) and, because Nyquist pulses are only ISI-free <em>at</em> the correct instants, neighbouring symbols leak in as intersymbol interference — the constellation points blur into clouds.</li>
<li><strong>Frame misalignment:</strong> every bit can be correct and the message still unreadable — codewords, headers, and fields are sliced at the wrong boundaries, so the deframer and decoder consume shifted nonsense.</li>
<li><strong>Code phase error (spread spectrum):</strong> the most brutal of all — misalign the despreading code by more than about a chip and the correlation collapses entirely; the signal simply never emerges from the noise floor.</li>
</ul>
<div class="callout"><strong>Intuition:</strong> the receiver is trying to shake hands with the signal. Frequency error means the two hands orbit each other; phase error means they meet at an angle; timing error means they grab at different moments; frame error means they grab the wrong hand; code error means they are in different rooms.</div>`
      },
      {
        h: 'The five alignments and their symptoms',
        html: String.raw`<p>It pays to be precise about what the receiver does not know. Writing the received complex baseband signal as a distorted copy of the transmitted one, the channel and the oscillators insert five unknowns, each with its own estimator family:</p>
<table class="data">
<tr><th>Unknown</th><th>Symbol</th><th>Symptom when wrong</th><th>Typical corrector</th></tr>
<tr><td>Carrier frequency offset</td><td>$\Delta f$</td><td>spinning constellation, spectral slide</td><td>FLL, CFO estimator (autocorrelation of pilots), AFC</td></tr>
<tr><td>Carrier phase</td><td>$\theta$</td><td>static rotation, quadrature crosstalk</td><td>PLL, Costas loop, Viterbi&ndash;Viterbi ($M$-th power)</td></tr>
<tr><td>Symbol timing</td><td>$\tau$ (fraction $\varepsilon$)</td><td>ISI, eye closure, amplitude loss</td><td>early-late gate, Gardner, Mueller&ndash;Muller, DTTL</td></tr>
<tr><td>Frame position</td><td>$k_0$</td><td>correct bits, wrong boundaries</td><td>preamble / unique-word correlation</td></tr>
<tr><td>Code phase (spread spectrum)</td><td>$\tau_c$</td><td>no despread signal at all</td><td>serial/parallel search, then DLL or tau-dither loop</td></tr>
</table>
<p>Two remarks sharpen the picture. First, the unknowns are <em>coupled</em>: a frequency error is the derivative of a phase error, and a clock-rate error is simultaneously a timing drift and (after enough symbols) a frame slip — which is why frequency must be fixed before phase can even be defined. Second, they live on very different scales: crystal tolerance of $\pm10$ ppm at a 2.4 GHz carrier is tens of kilohertz of $\Delta f$, while the same $10$ ppm on a megasymbol clock drifts the sampling instant by only one symbol every $10^5$ symbols. The hierarchy of the next section exists precisely because the big, fast errors must be beaten down before the small, slow ones become observable.</p>`
      },
      {
        h: 'The synchronization hierarchy: order of operations',
        html: String.raw`<p>A practical receiver runs its synchronizers as a <strong>chain</strong>, each stage shrinking the uncertainty the next stage must survive:</p>
<ol>
<li><strong>AGC first.</strong> Every discriminator's gain (S-curve slope) scales with signal amplitude; until the automatic gain control holds the level constant, no loop's bandwidth or stability is what its designer computed.</li>
<li><strong>Carrier frequency (FLL / coarse CFO).</strong> The largest error, and the one that makes phase meaningless — you cannot lock to a phase that is sweeping through $2\pi$ thousands of times per second. A frequency-lock loop or a data-aided CFO estimate pulls $\Delta f$ inside the phase loop's pull-in range.</li>
<li><strong>Carrier phase (PLL / Costas).</strong> With the spin removed, a phase-tracking loop (Costas for suppressed-carrier modulation) nulls the residual rotation and hands the demodulator a coherent reference.</li>
<li><strong>Symbol timing (early-late / Gardner / DTTL).</strong> A timing-error detector steers an interpolator or sampling NCO onto the eye centre. Note the flexibility: the Gardner detector is rotation-invariant, so many modern receivers close the timing loop <em>before</em> (or independently of) carrier phase — the classical order is a guideline, not a law.</li>
<li><strong>Frame / word sync.</strong> With clean symbols flowing, a correlator hunts the known preamble or unique word to plant the frame ruler.</li>
<li><strong>Spread spectrum inserts code sync at the front:</strong> code acquisition (sliding correlator or parallel search) followed by code tracking (DLL / tau-dither) must despread the signal before any of the data-recovery stages can even see it.</li>
</ol>
<div class="callout"><strong>Key idea:</strong> each stage is a <em>funnel</em>. Acquisition-grade frequency estimation leaves an error small enough for the phase loop's pull-in range; phase lock leaves a constellation clean enough for decision-directed timing refinement; timing lock produces symbols reliable enough for frame correlation to spike unambiguously. Break the order and the downstream stage faces an error outside its capture range — it will hunt forever.</div>
<p>The chain also explains receiver <em>state machines</em>: real modems walk a lock-status ladder (AGC settled &rarr; frequency locked &rarr; phase locked &rarr; timing locked &rarr; frame found), with lock detectors at each rung and fallback transitions when a rung is lost. A GPS receiver's channel state machine — search, pull-in, tracking, with FLL-assisted-PLL in between — is exactly this ladder with code sync added at the front.</p>`
      },
      {
        h: 'Acquisition versus tracking: two regimes, two designs',
        html: String.raw`<p>Every synchronizer lives a double life. <strong>Acquisition</strong> is the initial, large-uncertainty phase: the parameter may be anywhere in a wide range (frequency within the crystal tolerance, code phase anywhere in the code period), and the job is a coarse <em>search</em> or estimate that gets close. <strong>Tracking</strong> is the steady state: the error is already small, and the job is to <em>hold</em> it near zero with minimum jitter while the true value drifts. The two regimes want opposite designs:</p>
<table class="data">
<tr><th>Property</th><th>Acquisition</th><th>Tracking</th></tr>
<tr><td>Error size</td><td>large (outside linear region)</td><td>small (inside linear region)</td></tr>
<tr><td>Bandwidth / dwell</td><td>wide $B_L$, short dwells, fast sweep</td><td>narrow $B_L$, long integration</td></tr>
<tr><td>Optimized for</td><td>speed and detection probability</td><td>low jitter, hold under dynamics</td></tr>
<tr><td>Typical tools</td><td>search bins, preamble estimates, FLL</td><td>PLL/Costas, DLL, Gardner loop</td></tr>
<tr><td>Failure mode</td><td>false alarm / missed detection</td><td>cycle slip / loss of lock</td></tr>
</table>
<p>For a feedback loop the acquisition-speed-versus-jitter conflict is quantitative: a second-order PLL pulls in a frequency offset $\Delta f$ in roughly $T_p\approx4.2\,\Delta f^2/B_L^3$ seconds — the <em>cube</em> of the loop bandwidth in the denominator — while its tracking jitter grows only as $\sqrt{B_L}$. Hence the standard tactics: <strong>gear shifting</strong> (open wide to acquire, then narrow to track), <strong>FLL-assisted PLL</strong> (let a frequency loop eat the big offset, then hand over), and <strong>aided acquisition</strong> (use a data-aided estimate from a preamble to jump-start the loop inside its linear region). The handover condition is always the same: the residual error the acquisition stage leaves behind must sit inside the tracking stage's pull-in range, with margin for noise.</p>`
      },
      {
        h: 'Data-aided, non-data-aided, and decision-directed estimation',
        html: String.raw`<p>The modulation itself is the synchronizer's enemy: the data randomly flips the very phase and transitions the estimator is trying to measure. Three strategies deal with it:</p>
<ul>
<li><strong>Data-aided (DA):</strong> the transmitter embeds symbols the receiver already knows — a <em>preamble</em> at burst start, or <em>pilots</em> sprinkled through the stream. The receiver correlates against the known pattern, so the modulation is wiped off exactly. DA estimates are fast, unbiased, and reach the Cramer-Rao bound at moderate SNR; the price is overhead that carries no user data.</li>
<li><strong>Non-data-aided (NDA, blind):</strong> no overhead — exploit statistical structure of the modulation instead. Squaring a BPSK signal (or raising $M$-PSK to the $M$-th power) erases the data and leaves a spectral line at $M$ times the carrier, from which phase and frequency are read off after dividing by $M$; the Gardner timing detector uses mid-symbol samples whose average behaviour depends on timing but not on the data or carrier phase. The price is <em>self-noise and squaring loss</em> (nonlinearities multiply noise by noise) and an inherent <strong>$M$-fold phase ambiguity</strong> — the $M$-th power cannot tell rotations of $2\pi/M$ apart, which is why blind carrier recovery is paired with differential encoding or a known word to resolve the ambiguity.</li>
<li><strong>Decision-directed (DD):</strong> a hybrid — treat the demodulator's own decisions as if they were known pilots and wipe the modulation with them. At high SNR decisions are almost always right and DD performs nearly as well as DA with zero overhead; below a threshold SNR wrong decisions feed wrong corrections, the loop chases its own errors, and performance collapses (hang-up). DD is therefore a <em>tracking</em> tool, never an acquisition tool.</li>
</ul>
<table class="data">
<tr><th>Class</th><th>Uses</th><th>Examples</th><th>Strength</th><th>Weakness</th></tr>
<tr><td>Data-aided</td><td>known preamble/pilots</td><td>CFO from pilot autocorrelation; DA phase estimate</td><td>fast, hits CRLB</td><td>overhead</td></tr>
<tr><td>Non-data-aided</td><td>signal statistics</td><td>squaring loop, Viterbi&ndash;Viterbi, Gardner TED</td><td>no overhead</td><td>squaring loss, $2\pi/M$ ambiguity</td></tr>
<tr><td>Decision-directed</td><td>demod decisions</td><td>DD-PLL, Mueller&ndash;Muller TED</td><td>efficient at high SNR</td><td>fails below threshold SNR</td></tr>
</table>
<p>Burst systems (TDMA, WLAN, satellite return links) lean on DA preambles because they must sync in microseconds; continuous broadcast links (DVB, deep space) lean on NDA/DD loops because overhead forever is expensive while seconds of pull-in once are cheap.</p>`
      },
      {
        h: 'Feedback loops versus feedforward estimators',
        html: String.raw`<p>Whatever the parameter and whatever the aiding, a synchronizer takes one of two architectural forms.</p>
<p><strong>Feedback (closed loop).</strong> The canonical trio you have met in every loop topic: an <strong>error detector</strong> (discriminator) produces a signed, noisy measure of the residual error; a <strong>loop filter</strong> integrates and smooths it, setting the loop noise bandwidth $B_L$ and the loop order (a second-order loop tracks a frequency ramp with zero steady-state phase error); and an <strong>NCO</strong> (or interpolator control word) applies the correction to the incoming signal, closing the loop. Feedback loops shine in <em>continuous</em> reception: they track drift forever, average noise over an adjustable $B_L$, and need no signal buffering. Their vices are the pull-in transient, the acquisition/jitter conflict, hang-up, and cycle slips.</p>
<p><strong>Feedforward (open loop).</strong> Buffer a block of $L$ symbols, compute an estimate $\hat\theta$ (or $\widehat{\Delta f}$, $\hat\tau$) from the whole block at once — for example the Viterbi&ndash;Viterbi $M$-th-power phase estimate or a preamble-autocorrelation CFO estimate — then <em>rotate/resample the block by the estimate and move on</em>. No loop, no pull-in, no cycle slips, deterministic latency of one block. Feedforward is the natural choice for <em>burst</em> modems, where a loop would spend the whole burst still converging. Its vices: it needs buffering, its estimate is frozen within a block (residual drift across the block must be small), and block-edge stitching needs care.</p>
<table class="data">
<tr><th>Property</th><th>Feedback loop</th><th>Feedforward estimator</th></tr>
<tr><td>Convergence</td><td>pull-in transient, then tracks</td><td>immediate (one block)</td></tr>
<tr><td>Drift handling</td><td>continuous, automatic</td><td>only block-by-block</td></tr>
<tr><td>Cycle slips / hang-up</td><td>possible</td><td>impossible</td></tr>
<tr><td>Buffering / latency</td><td>none needed</td><td>one block</td></tr>
<tr><td>Best suited to</td><td>continuous links, GNSS, broadcast</td><td>burst / packet modems, TDMA, WLAN</td></tr>
</table>
<div class="callout tip"><strong>Tip:</strong> the two forms are two ways of climbing the same likelihood function — feedforward jumps straight to (near) the peak computed over a block; feedback takes small gradient steps every symbol. Mixed designs are common: feedforward coarse estimate to land inside the linear region, feedback loop to track thereafter.</div>`
      },
      {
        h: 'The maximum-likelihood view: one theory behind every loop',
        html: String.raw`<p>Here is the unifying idea. In AWGN, the log-likelihood that the received waveform $r(t)$ was produced by a transmitted signal with trial phase $\tilde\theta$, trial frequency $\widetilde{\Delta f}$, and trial timing $\tilde\tau$ is (up to constants)</p>
<p>$$\Lambda(\tilde\theta,\widetilde{\Delta f},\tilde\tau)=\frac{2}{N_0}\,\mathrm{Re}\!\left\{\int r(t)\,s^*(t;\tilde\theta,\widetilde{\Delta f},\tilde\tau)\,dt\right\},$$</p>
<p>i.e. <em>correlate the received signal against the template and take the real part</em>. The <strong>maximum-likelihood synchronizer</strong> picks the trial values that maximize $\Lambda$. Everything else in this topic is a strategy for finding that maximum:</p>
<ul>
<li><strong>Feedforward = solve for the peak.</strong> When the maximization has a closed form — as for DA phase estimation, where $\hat\theta=\arg\Sigma_k y_k a_k^*$ over known pilots $a_k$ — compute it in one shot.</li>
<li><strong>Feedback = follow the gradient.</strong> Differentiate $\Lambda$ with respect to the parameter and drive the derivative to zero with a loop: $\partial\Lambda/\partial\tilde\theta$ evaluated with hard data decisions <em>is</em> the DD phase detector $\mathrm{Im}\lbrace y_k\hat a_k^*\rbrace$; $\partial\Lambda/\partial\tilde\tau$ replaces the derivative of the matched-filter output by a finite difference of samples either side — which is <em>exactly the early-late gate</em>. Discriminators are not clever hacks; they are the score function of the likelihood.</li>
<li><strong>DA versus NDA is what you do about the unknown data.</strong> If the data are known (pilots), plug them in. If not, average the likelihood over the data distribution; at low SNR the average produces the squaring/$M$-th-power nonlinearities (the $\tanh$ of the exact average linearizes to a product), which is where the Costas loop and Viterbi&ndash;Viterbi estimator come from.</li>
<li><strong>The curvature sets the limit.</strong> The sharper the likelihood peak, the better any estimator can do: the Cramer-Rao bound is the inverse of the expected curvature (Fisher information), which is why wideband signals time-sync better (sharper correlation peak in $\tau$) and long observations phase-sync better (curvature grows with $L$).</li>
</ul>
<div class="callout"><strong>Big picture:</strong> one function $\Lambda$; maximize it directly and you get feedforward estimators, differentiate it and you get every discriminator, average it over data and you get the blind (NDA) versions, take its curvature and you get the performance bound. The whole synchronization zoo is one animal drawn from different angles.</div>`
      },
      {
        h: 'Performance limits: loop SNR, jitter, cycle slips, and the bandwidth trade',
        html: String.raw`<p>How well can a synchronizer work? Four quantities organize the answer.</p>
<p><strong>Loop SNR.</strong> A tracking loop of noise bandwidth $B_L$ passes only the noise within $B_L$, so the signal-to-noise ratio <em>inside the loop</em> is $\rho_L=\dfrac{C}{N_0B_L}$ — carrier power over noise density times loop bandwidth. It is enormous compared with the symbol-rate SNR: a signal at $C/N_0=40$ dB-Hz tracked with $B_L=10$ Hz enjoys $\rho_L=1000$ (30 dB) in the loop even if each individual symbol is noisy.</p>
<p><strong>Phase jitter.</strong> Linearizing the locked loop, the tracked phase jitters with variance $\sigma_\phi^2=\dfrac{1}{2\rho_L}=\dfrac{N_0B_L}{2C}$ rad$^2$ (with $B_L$ the two-sided loop noise bandwidth; the one-sided convention gives $\sigma_\phi^2=N_0B_L/C$ — always check which a datasheet uses). Squaring-type (Costas, $M$-th power) loops multiply this by a squaring-loss factor $\ge1$ that grows at low SNR.</p>
<p><strong>Cycle slips.</strong> Jitter is benign while the error stays inside one lobe of the S-curve; occasionally noise conspires to push it over the separatrix and the loop re-locks one stable point away — $2\pi$ for a PLL, $2\pi/M$ for an $M$-PSK Costas loop, one chip for a DLL. The mean time between slips for a first-order PLL, $T_{\text{slip}}\approx\dfrac{\pi}{4B_L}\,e^{2\rho_L}$, is <em>exponential</em> in the loop SNR: raising $\rho_L$ from 7 to 10 stretches the slip interval from about a day to over a year. The classic design rule keeps $\sigma_\phi\le15^\circ$ (so $3\sigma$ stays inside a QPSK quadrant) — equivalently $\rho_L\gtrsim13$ dB.</p>
<p><strong>The Cramer-Rao bound.</strong> No unbiased estimator, loop or block, DA or NDA, can beat the CRLB set by the likelihood curvature. For phase over $L$ known symbols at symbol SNR $E_s/N_0$: $\sigma_{\hat\theta}^2\ge\dfrac{1}{2L\,(E_s/N_0)}$. Doubling the observation or the SNR halves the best possible variance; a good DA estimator sits essentially on this bound, and the gap between a blind estimator and the bound is the price of not knowing the data.</p>
<p><strong>The trade that rules them all.</strong> Every knob ultimately moves along one curve: wide $B_L$ (or short blocks) means fast acquisition, tolerance of dynamics, frequent slips, high jitter; narrow $B_L$ (long blocks) means slow, fragile acquisition but superb jitter and rare slips. Pull-in time scales as $1/B_L^3$ while jitter scales as $\sqrt{B_L}$ — which is why gear-shifting and FLL-assisted-PLL handovers are not luxuries but the standard way to buy both ends of the curve.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>Synchronization is the umbrella discipline that makes coherent reception possible. You should now be able to say:</p>
<ul>
<li><strong>What must be aligned and why:</strong> carrier frequency (spinning constellation), carrier phase (static rotation and crosstalk), symbol timing (ISI and eye closure), frame position (right bits, wrong boundaries), and code phase for spread spectrum (no signal at all until despread).</li>
<li><strong>The hierarchy:</strong> AGC &rarr; frequency (FLL/CFO) &rarr; phase (PLL/Costas) &rarr; timing (early-late/Gardner) &rarr; frame (unique-word correlation), with code acquisition and tracking prepended for spread spectrum — each stage funnels the error into the next stage's capture range.</li>
<li><strong>Acquisition versus tracking:</strong> wide-bandwidth coarse search versus narrow-bandwidth low-jitter hold, connected by a handover that must land inside the tracking pull-in range; pull-in time scales as $\Delta f^2/B_L^3$.</li>
<li><strong>The three aiding classes:</strong> data-aided (preamble/pilots, fast, CRLB-reaching, costs overhead), non-data-aided (squaring/$M$-th power/Gardner, free but with squaring loss and a $2\pi/M$ ambiguity), decision-directed (near-DA at high SNR, collapses below threshold).</li>
<li><strong>The two architectures and the one theory:</strong> feedback loops (error detector &rarr; loop filter &rarr; NCO) follow the likelihood gradient; feedforward blocks jump to its peak; every discriminator is the ML score function in disguise, and the CRLB is the likelihood curvature.</li>
<li><strong>The numbers:</strong> loop SNR $\rho_L=C/(N_0B_L)$; phase jitter $\sigma_\phi^2=1/(2\rho_L)$; cycle-slip interval $\approx(\pi/4B_L)e^{2\rho_L}$; DA phase CRLB $1/(2L\,E_s/N_0)$; and the $15^\circ$ rms rule of thumb for holding QPSK lock.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Carrier_recovery" target="_blank" rel="noopener">Wikipedia — Carrier recovery</a> — a compact survey of the carrier half of the sync problem: closed-loop (Costas, squaring, $M$-th power) versus open-loop feedforward recovery, multiplied versus suppressed carriers, and the phase-ambiguity issue with its differential-coding fix.</li>
<li><a href="https://en.wikipedia.org/wiki/Clock_recovery" target="_blank" rel="noopener">Wikipedia — Clock recovery</a> — the timing half: how symbol clocks are extracted from data transitions, why line codes guarantee transition density, and how clock recovery connects to eye diagrams and jitter.</li>
<li><a href="https://www.mathworks.com/help/comm/ref/comm.carriersynchronizer-system-object.html" target="_blank" rel="noopener">MathWorks — comm.CarrierSynchronizer</a> — a production PLL-based carrier synchronizer with the loop-bandwidth and damping parameters exposed; the algorithm section documents the exact phase-error detectors used per modulation and is an excellent bridge from theory to implementation.</li>
<li><a href="https://gssc.esa.int/navipedia/index.php/Tracking_Loops" target="_blank" rel="noopener">ESA Navipedia — Tracking Loops</a> — the full sync chain in the most demanding consumer application, GNSS: DLL, PLL, and FLL side by side, discriminator tables, loop-filter orders, bandwidth trades, and FLL-assisted-PLL handover exactly as described in this topic.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Coherent detection is an inner product against local references; synchronization is the recovery of every reference the channel corrupted: carrier frequency, carrier phase, symbol timing, frame position, and (spread spectrum) code phase.`,
      String.raw`Each error has a signature: $\Delta f$ spins the constellation at $2\pi\Delta f T$ rad/symbol; $\theta$ rotates it statically and leaks $\sin\theta$ crosstalk between rails; timing error $\varepsilon$ causes ISI and eye closure; frame error slices correct bits at wrong boundaries; code misalignment kills despreading entirely.`,
      String.raw`The sync hierarchy runs AGC $\to$ carrier frequency (FLL/CFO) $\to$ carrier phase (PLL/Costas) $\to$ symbol timing (early-late/Gardner) $\to$ frame sync (unique word); spread spectrum prepends code acquisition and code tracking.`,
      String.raw`The order exists because each stage must funnel the error into the next stage's capture range — you cannot phase-lock a constellation that is still spinning, and frequency error is the derivative of phase error.`,
      String.raw`Acquisition (large error, wide bandwidth, optimized for speed and detection) and tracking (small error, narrow bandwidth, optimized for jitter) are opposite regimes; gear shifting and FLL-assisted-PLL bridge them.`,
      String.raw`Second-order PLL pull-in time is roughly $T_p\approx4.2\,\Delta f^2/B_L^3$ — the cubic dependence on $B_L$ is why acquisition wants the loop wide open.`,
      String.raw`Data-aided sync wipes modulation with known preamble/pilot symbols: fast, essentially CRLB-optimal, but costs overhead — the choice of burst modems.`,
      String.raw`Non-data-aided sync exploits signal statistics: squaring/M-th power for carrier, Gardner for timing; free of overhead but pays squaring loss and carries an inherent $2\pi/M$ phase ambiguity that differential coding or a unique word must resolve.`,
      String.raw`Decision-directed sync treats demod decisions as pilots: near-DA efficiency at high SNR, catastrophic error propagation below a threshold SNR — a tracking tool, never an acquisition tool.`,
      String.raw`Feedback loops (error detector $\to$ loop filter $\to$ NCO) track drift continuously but suffer pull-in transients and cycle slips; feedforward block estimators converge instantly with no slips but freeze the estimate within each block — burst modems go feedforward.`,
      String.raw`All synchronizers are maximum-likelihood in disguise: feedforward maximizes the likelihood $\Lambda$, feedback loops drive its gradient to zero (the early-late gate is the finite-difference $\partial\Lambda/\partial\tau$), and NDA forms arise from averaging $\Lambda$ over the unknown data.`,
      String.raw`Loop SNR $\rho_L=C/(N_0B_L)$ is the SNR inside the loop bandwidth; linearized phase jitter is $\sigma_\phi^2=1/(2\rho_L)$ rad$^2$ (two-sided $B_L$ convention; one-sided gives $N_0B_L/C$).`,
      String.raw`Cycle slips re-lock the loop $2\pi/M$ (or one chip) away; mean time between slips $\approx(\pi/4B_L)e^{2\rho_L}$ grows exponentially with loop SNR — the $\sigma_\phi\le15^\circ$ rule keeps QPSK slips rare.`,
      String.raw`No unbiased estimator beats the Cramer-Rao bound; for DA phase over $L$ symbols, $\sigma_{\hat\theta}^2\ge1/(2L\,E_s/N_0)$ — more symbols or more SNR is the only honest way to a better estimate.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 264" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="synchronization-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="264" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">The synchronization chain of a coherent receiver</text>
<line x1="6" y1="66" x2="28" y2="66" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#synchronization-a1)"/>
<text x="4" y="56" fill="#9aa7b5" font-size="9">$r(t)$</text>
<rect x="28" y="50" width="66" height="32" fill="#1c232e" stroke="#9aa7b5" stroke-width="1.3"/><text x="46" y="70" fill="#e6edf3" font-size="10">AGC</text>
<line x1="94" y1="66" x2="118" y2="66" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a1)"/>
<rect x="118" y="50" width="92" height="32" fill="#1c232e" stroke="#4dabf7" stroke-width="1.3"/><text x="126" y="64" fill="#e6edf3" font-size="9">carrier freq</text><text x="126" y="76" fill="#9aa7b5" font-size="8">FLL / CFO est.</text>
<line x1="210" y1="66" x2="234" y2="66" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a1)"/>
<rect x="234" y="50" width="92" height="32" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/><text x="242" y="64" fill="#e6edf3" font-size="9">carrier phase</text><text x="242" y="76" fill="#9aa7b5" font-size="8">PLL / Costas</text>
<line x1="326" y1="66" x2="350" y2="66" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a1)"/>
<rect x="350" y="50" width="86" height="32" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="358" y="64" fill="#e6edf3" font-size="9">matched</text><text x="358" y="76" fill="#e6edf3" font-size="9">filter</text>
<line x1="436" y1="66" x2="460" y2="66" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="460" y1="66" x2="460" y2="120" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="460" y1="120" x2="96" y2="120" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="96" y1="120" x2="96" y2="152" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a1)"/>
<rect x="46" y="152" width="104" height="34" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.3"/><text x="56" y="166" fill="#e6edf3" font-size="9">symbol timing</text><text x="56" y="179" fill="#9aa7b5" font-size="8">TED + interp NCO</text>
<line x1="150" y1="169" x2="182" y2="169" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a1)"/>
<rect x="182" y="152" width="104" height="34" fill="#1c232e" stroke="#b197fc" stroke-width="1.3"/><text x="192" y="166" fill="#e6edf3" font-size="9">frame sync</text><text x="192" y="179" fill="#9aa7b5" font-size="8">unique-word corr.</text>
<line x1="286" y1="169" x2="318" y2="169" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a1)"/>
<rect x="318" y="152" width="104" height="34" fill="#1c232e" stroke="#9aa7b5" stroke-width="1.3"/><text x="328" y="166" fill="#e6edf3" font-size="9">demod +</text><text x="328" y="179" fill="#e6edf3" font-size="9">decode</text>
<line x1="422" y1="169" x2="452" y2="169" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a1)"/>
<text x="456" y="173" fill="#63e6be" font-size="9">data</text>
<!-- feedback ticks -->
<path d="M164,90 q0,14 -18,14 q-18,0 -18,-14" fill="none" stroke="#4dabf7" stroke-width="1" marker-end="url(#synchronization-a1)"/>
<path d="M280,90 q0,14 -18,14 q-18,0 -18,-14" fill="none" stroke="#63e6be" stroke-width="1" marker-end="url(#synchronization-a1)"/>
<path d="M116,194 q0,14 -18,14 q-18,0 -18,-14" fill="none" stroke="#ff6b6b" stroke-width="1" marker-end="url(#synchronization-a1)"/>
<text x="118" y="214" fill="#9aa7b5" font-size="8">closed loops: discriminator + loop filter + NCO</text>
<text x="14" y="240" fill="#9aa7b5" font-size="9">spread spectrum: code acquisition (search) + code tracking (DLL) run BEFORE the data path can see a signal</text>
<text x="14" y="256" fill="#9aa7b5" font-size="9">each stage funnels the residual error into the next stage's capture range: AGC, then $\Delta f$, then $\theta$, then $\tau$, then frame</text>
</svg>`,
        caption: 'The receiver synchronization chain: AGC levels the signal, a frequency stage (FLL or CFO estimator) removes the spin, a phase loop (PLL/Costas) plants the coherent reference, the matched-filter output is sampled by a timing loop (TED plus interpolator NCO), and a unique-word correlator finds the frame boundaries before demodulation and decoding. Frequency, phase, and timing stages are closed loops (discriminator, loop filter, NCO); spread-spectrum receivers prepend code acquisition and DLL code tracking.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 258" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="synchronization-a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="258" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">Two architectures for the same estimate</text>
<text x="14" y="44" fill="#4dabf7" font-size="11">Feedback (closed loop) — continuous links</text>
<line x1="10" y1="80" x2="40" y2="80" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#synchronization-a2)"/>
<circle cx="54" cy="80" r="13" fill="#1c232e" stroke="#4dabf7" stroke-width="1.3"/><text x="48" y="85" fill="#e6edf3" font-size="12">$\times$</text>
<line x1="67" y1="80" x2="100" y2="80" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a2)"/>
<rect x="100" y="64" width="98" height="32" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.3"/><text x="108" y="78" fill="#e6edf3" font-size="9">error detector</text><text x="108" y="90" fill="#9aa7b5" font-size="8">(discriminator)</text>
<line x1="198" y1="80" x2="232" y2="80" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a2)"/>
<rect x="232" y="64" width="84" height="32" fill="#1c232e" stroke="#b197fc" stroke-width="1.3"/><text x="240" y="78" fill="#e6edf3" font-size="9">loop filter</text><text x="240" y="90" fill="#9aa7b5" font-size="8">sets $B_L$, order</text>
<line x1="316" y1="80" x2="350" y2="80" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a2)"/>
<rect x="350" y="64" width="66" height="32" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/><text x="362" y="84" fill="#e6edf3" font-size="10">NCO</text>
<line x1="383" y1="96" x2="383" y2="120" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="383" y1="120" x2="54" y2="120" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="54" y1="120" x2="54" y2="93" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#synchronization-a2)"/>
<line x1="67" y1="80" x2="84" y2="60" stroke="#9aa7b5" stroke-width="0"/>
<line x1="80" y1="56" x2="80" y2="56" stroke="#9aa7b5" stroke-width="0"/>
<line x1="80" y1="80" x2="80" y2="40" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#synchronization-a2)"/>
<text x="86" y="44" fill="#63e6be" font-size="9">corrected signal out</text>
<text x="430" y="72" fill="#9aa7b5" font-size="8">tracks drift forever;</text>
<text x="430" y="84" fill="#9aa7b5" font-size="8">pull-in transient,</text>
<text x="430" y="96" fill="#9aa7b5" font-size="8">cycle slips possible</text>
<text x="14" y="152" fill="#ffa94d" font-size="11">Feedforward (open loop) — burst modems</text>
<line x1="10" y1="192" x2="40" y2="192" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#synchronization-a2)"/>
<rect x="40" y="176" width="96" height="32" fill="#1c232e" stroke="#9aa7b5" stroke-width="1.3"/><text x="50" y="190" fill="#e6edf3" font-size="9">buffer block</text><text x="50" y="202" fill="#9aa7b5" font-size="8">$L$ symbols</text>
<line x1="136" y1="192" x2="170" y2="192" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a2)"/>
<rect x="170" y="176" width="118" height="32" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="178" y="190" fill="#e6edf3" font-size="9">block estimator</text><text x="178" y="202" fill="#9aa7b5" font-size="8">V&amp;V, preamble corr.</text>
<line x1="288" y1="192" x2="322" y2="192" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a2)"/>
<rect x="322" y="176" width="104" height="32" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/><text x="330" y="190" fill="#e6edf3" font-size="9">rotate / resample</text><text x="330" y="202" fill="#9aa7b5" font-size="8">apply estimate once</text>
<line x1="426" y1="192" x2="458" y2="192" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#synchronization-a2)"/>
<text x="462" y="196" fill="#63e6be" font-size="9">out</text>
<text x="40" y="232" fill="#9aa7b5" font-size="8">no pull-in, no slips, deterministic latency of one block; estimate frozen within the block</text>
<text x="40" y="248" fill="#9aa7b5" font-size="8">both climb the same likelihood: feedback follows the gradient, feedforward jumps to the peak</text>
</svg>`,
        caption: 'Feedback versus feedforward synchronization. Top: the closed loop — error detector (discriminator), loop filter (sets the noise bandwidth B_L and loop order), and NCO applying the correction — tracks drift continuously but suffers a pull-in transient and occasional cycle slips. Bottom: the feedforward block estimator (e.g. Viterbi-Viterbi or preamble correlation) buffers L symbols, computes the estimate once, and applies it — instant convergence and no slips, at the cost of buffering and a frozen estimate within each block.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 236" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="236" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">Constellation symptoms of the three carrier/timing errors (QPSK)</text>
<!-- panel 1: phase offset -->
<rect x="16" y="36" width="160" height="150" fill="none" stroke="#2a3442" stroke-width="1"/>
<line x1="96" y1="36" x2="96" y2="186" stroke="#2a3442" stroke-width="1"/>
<line x1="16" y1="111" x2="176" y2="111" stroke="#2a3442" stroke-width="1"/>
<circle cx="131" cy="76" r="3" fill="#2f3a49"/><circle cx="61" cy="76" r="3" fill="#2f3a49"/><circle cx="61" cy="146" r="3" fill="#2f3a49"/><circle cx="131" cy="146" r="3" fill="#2f3a49"/>
<circle cx="138" cy="93" r="4" fill="#4dabf7"/><circle cx="79" cy="69" r="4" fill="#4dabf7"/><circle cx="54" cy="129" r="4" fill="#4dabf7"/><circle cx="113" cy="153" r="4" fill="#4dabf7"/>
<text x="30" y="204" fill="#4dabf7" font-size="10">phase offset $\theta$</text>
<text x="30" y="220" fill="#9aa7b5" font-size="8">static rotation by $\theta$</text>
<!-- panel 2: frequency offset -->
<rect x="190" y="36" width="160" height="150" fill="none" stroke="#2a3442" stroke-width="1"/>
<line x1="270" y1="36" x2="270" y2="186" stroke="#2a3442" stroke-width="1"/>
<line x1="190" y1="111" x2="350" y2="111" stroke="#2a3442" stroke-width="1"/>
<circle cx="270" cy="111" r="49" fill="none" stroke="#63e6be" stroke-width="1" stroke-dasharray="3 3"/>
<circle cx="305" cy="76" r="3.5" fill="#63e6be"/><circle cx="318" cy="97" r="3.5" fill="#63e6be"/><circle cx="319" cy="122" r="3.5" fill="#63e6be"/><circle cx="307" cy="146" r="3.5" fill="#63e6be"/><circle cx="284" cy="158" r="3.5" fill="#63e6be"/><circle cx="258" cy="159" r="3.5" fill="#63e6be"/><circle cx="235" cy="146" r="3.5" fill="#63e6be"/><circle cx="222" cy="124" r="3.5" fill="#63e6be"/><circle cx="223" cy="99" r="3.5" fill="#63e6be"/><circle cx="236" cy="77" r="3.5" fill="#63e6be"/><circle cx="259" cy="64" r="3.5" fill="#63e6be"/><circle cx="284" cy="63" r="3.5" fill="#63e6be"/>
<text x="204" y="204" fill="#63e6be" font-size="10">frequency offset $\Delta f$</text>
<text x="204" y="220" fill="#9aa7b5" font-size="8">spins $2\pi\Delta f T$ per symbol</text>
<!-- panel 3: timing error -->
<rect x="364" y="36" width="160" height="150" fill="none" stroke="#2a3442" stroke-width="1"/>
<line x1="444" y1="36" x2="444" y2="186" stroke="#2a3442" stroke-width="1"/>
<line x1="364" y1="111" x2="524" y2="111" stroke="#2a3442" stroke-width="1"/>
<circle cx="479" cy="76" r="2.5" fill="#ffa94d"/><circle cx="472" cy="70" r="2.5" fill="#ffa94d"/><circle cx="486" cy="83" r="2.5" fill="#ffa94d"/><circle cx="474" cy="84" r="2.5" fill="#ffa94d"/><circle cx="484" cy="70" r="2.5" fill="#ffa94d"/>
<circle cx="409" cy="76" r="2.5" fill="#ffa94d"/><circle cx="402" cy="82" r="2.5" fill="#ffa94d"/><circle cx="416" cy="70" r="2.5" fill="#ffa94d"/><circle cx="404" cy="69" r="2.5" fill="#ffa94d"/><circle cx="414" cy="84" r="2.5" fill="#ffa94d"/>
<circle cx="409" cy="146" r="2.5" fill="#ffa94d"/><circle cx="402" cy="140" r="2.5" fill="#ffa94d"/><circle cx="416" cy="152" r="2.5" fill="#ffa94d"/><circle cx="404" cy="153" r="2.5" fill="#ffa94d"/><circle cx="415" cy="139" r="2.5" fill="#ffa94d"/>
<circle cx="479" cy="146" r="2.5" fill="#ffa94d"/><circle cx="472" cy="152" r="2.5" fill="#ffa94d"/><circle cx="486" cy="139" r="2.5" fill="#ffa94d"/><circle cx="474" cy="139" r="2.5" fill="#ffa94d"/><circle cx="485" cy="153" r="2.5" fill="#ffa94d"/>
<text x="378" y="204" fill="#ffa94d" font-size="10">timing error $\varepsilon$</text>
<text x="378" y="220" fill="#9aa7b5" font-size="8">ISI clouds, eye closure</text>
</svg>`,
        caption: 'How each synchronization error deforms a QPSK constellation. Left: a fixed carrier phase error rotates the whole constellation by theta (grey dots mark ideal positions) and leaks crosstalk between the I and Q rails. Centre: a carrier frequency offset makes the constellation spin continuously, smearing the points around a ring at 2*pi*df*T radians per symbol. Right: a symbol timing error samples off the eye centre, so intersymbol interference blurs each point into a cloud even with the carrier perfect.'
      }
    ],
    equations: [
      {
        title: 'Received Samples with Residual Sync Errors',
        tex: String.raw`$$y_k=e^{\,j(2\pi\Delta f\,kT+\theta)}\sum_m a_m\,g\big((k-m)T+\varepsilon T\big)+n_k$$`,
        derivation: String.raw`<p><b>Where we start.</b> The transmitter sends $s(t)=\sum_m a_m\,p(t-mT)$ on a carrier $f_c$; the receiver downconverts with its own oscillator at $f_c+\Delta f$ and phase $-\theta$, matched-filters with $p^*(-t)$, and samples at $t=kT+\hat\tau$ while the true delay is $\tau$. Define the timing error as a fraction of a symbol, $\varepsilon=(\tau-\hat\tau)/T$, and let $g$ be the overall pulse autocorrelation (transmit pulse convolved with matched filter), a Nyquist pulse with $g(0)=1$ and $g(mT)=0$ for integer $m\ne0$.</p>
<p><b>Step 1.</b> Downconversion with an oscillator offset by $\Delta f$ and $\theta$ multiplies the complex envelope by $e^{\,j(2\pi\Delta f t+\theta)}$. Sampling that residual rotation at $t=kT$ turns it into the discrete spin $e^{\,j(2\pi\Delta f\,kT+\theta)}$: a phasor that advances by $2\pi\Delta f\,T$ radians every symbol.</p>
<p><b>Step 2.</b> The matched-filter output of the pulse train, sampled with a timing offset $\varepsilon T$, is $\sum_m a_m\,g((k-m)T+\varepsilon T)$. If $\varepsilon=0$ the Nyquist property collapses the sum to the single wanted symbol $a_k$; if $\varepsilon\ne0$ the wanted term shrinks to $a_k\,g(\varepsilon T)$ and every neighbouring symbol contributes a nonzero $g((k-m)T+\varepsilon T)$ — intersymbol interference. Adding filtered noise $n_k$ completes the model.</p>
<p><b>Result.</b> One equation exhibits every synchronization disease at once: $\Delta f$ appears as a rotation that grows linearly with $k$ (spinning constellation), $\theta$ as a fixed rotation, and $\varepsilon$ as amplitude loss plus ISI. Setting each error to zero recovers the textbook $y_k=a_k+n_k$ — the entire purpose of the sync chain is to make this substitution legitimate.</p>`
      },
      {
        title: 'Loop SNR',
        tex: String.raw`$$\rho_L=\frac{C}{N_0\,B_L}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A tracking loop with closed-loop transfer function $H(f)$ does not see all the front-end noise — it responds only to noise components inside its loop noise bandwidth $B_L=\int_{-\infty}^{\infty}\lvert H(f)\rvert^2\,df$ (two-sided convention). We want the effective signal-to-noise ratio governing the loop's behaviour, given carrier power $C$ and one-sided noise density $N_0$ (W/Hz).</p>
<p><b>Step 1.</b> The noise power that actually perturbs the loop is the density times the bandwidth the loop admits: $P_n=N_0\,B_L$. This is usually far smaller than the noise in the signal bandwidth, because $B_L$ (hertz to tens of hertz) is orders of magnitude narrower than the symbol rate.</p>
<p><b>Step 2.</b> Dividing the carrier power by the admitted noise power gives the in-loop SNR: $\rho_L=C/(N_0B_L)$. Written with the standard link quantity $C/N_0$ (dB-Hz, converted to a linear ratio in Hz), this is simply $\rho_L=(C/N_0)/B_L$ — the receivable density ratio divided by how much of it the loop lets in.</p>
<p><b>Result.</b> $\rho_L=C/(N_0B_L)$ is the single number that governs tracking quality: phase jitter is $1/(2\rho_L)$, and the cycle-slip rate falls exponentially in $\rho_L$. It explains the central paradox of synchronization — a loop can track a signal whose individual symbols are deeply noisy, because the loop averages over $1/B_L$ seconds: at $C/N_0=40$ dB-Hz and $B_L=10$ Hz, $\rho_L=1000$ (30 dB) even though a $1$ Msym/s stream would have a per-symbol SNR of $-20$ dB.</p>`
      },
      {
        title: 'Linearized Phase Jitter of a Locked Loop',
        tex: String.raw`$$\sigma_\phi^2=\frac{1}{2\rho_L}=\frac{N_0\,B_L}{2C}\ \ \text{[rad}^2\text{]}$$`,
        derivation: String.raw`<p><b>Where we start.</b> In lock the phase error is small, so the sinusoidal phase detector is linear: its output is proportional to the error plus additive noise. The additive front-end noise of one-sided density $N_0$, referred to the phase of a carrier of power $C$, becomes an equivalent phase-noise process with two-sided spectral density $S_\phi(f)=N_0/(2C)$ rad$^2$/Hz (dividing by carrier power converts volts of noise into radians of apparent phase wobble).</p>
<p><b>Step 1.</b> The loop passes this phase noise through its closed-loop response $H(f)$, so the tracked-phase error variance is the integral of density times response: $\sigma_\phi^2=\int_{-\infty}^{\infty}S_\phi(f)\,\lvert H(f)\rvert^2\,df=\frac{N_0}{2C}\int_{-\infty}^{\infty}\lvert H(f)\rvert^2\,df$.</p>
<p><b>Step 2.</b> The remaining integral is precisely the two-sided loop noise bandwidth $B_L$. Substituting gives $\sigma_\phi^2=N_0B_L/(2C)$, and dividing numerator and denominator by $N_0B_L$ expresses it through the loop SNR: $\sigma_\phi^2=1/(2\rho_L)$.</p>
<p><b>Result.</b> $\sigma_\phi^2=1/(2\rho_L)$ rad$^2$: halve the loop bandwidth and you halve the jitter variance; double the carrier power, same. Beware the convention trap — many GNSS texts define $B_L$ one-sided, which doubles the formula to $\sigma_\phi^2=N_0B_L/C$; the physics is identical, only the bookkeeping differs. For squaring-type loops (Costas, $M$-th power) multiply by a squaring-loss factor $\ge1$ that grows at low SNR, and remember the linearization itself fails once $\sigma_\phi$ approaches the S-curve's linear-region edge — the onset of cycle slips.</p>`
      },
      {
        title: 'Cramer-Rao Bound for Data-Aided Phase Estimation',
        tex: String.raw`$$\operatorname{var}(\hat\theta)\ \ge\ \frac{1}{2L\,(E_s/N_0)}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Suppose $L$ known pilot symbols are received as $y_k=\sqrt{E_s}\,e^{j\theta}a_k+n_k$, $k=1,\dots,L$, with unit-energy known symbols $a_k$ and complex AWGN of variance $N_0$ per complex sample. The Cramer-Rao inequality says no unbiased estimator of $\theta$ can have variance below the inverse Fisher information $I(\theta)$, where $I(\theta)=-\mathrm{E}[\partial^2\ln p(\mathbf y;\theta)/\partial\theta^2]$.</p>
<p><b>Step 1.</b> The log-likelihood of the Gaussian observations is $\ln p=-\frac{1}{N_0}\sum_k\lvert y_k-\sqrt{E_s}\,e^{j\theta}a_k\rvert^2+\text{const}$. Expanding and keeping the $\theta$-dependent term gives $\ln p=\frac{2\sqrt{E_s}}{N_0}\,\mathrm{Re}\lbrace e^{-j\theta}\sum_k y_k a_k^*\rbrace+\text{const}$ — the likelihood depends on the data only through the pilot correlation $\sum_k y_k a_k^*$.</p>
<p><b>Step 2.</b> Differentiate twice with respect to $\theta$ and take the expectation: the second derivative of $\mathrm{Re}\lbrace e^{-j\theta}(\cdot)\rbrace$ returns $-\mathrm{Re}\lbrace e^{-j\theta}(\cdot)\rbrace$, whose mean is $-L\sqrt{E_s}\cdot\sqrt{E_s}=-LE_s$. Hence $I(\theta)=\frac{2\sqrt{E_s}}{N_0}\cdot L\sqrt{E_s}=\frac{2LE_s}{N_0}$.</p>
<p><b>Result.</b> $\operatorname{var}(\hat\theta)\ge1/I(\theta)=\dfrac{1}{2L\,(E_s/N_0)}$. The bound falls inversely with both the pilot count and the symbol SNR: 100 pilots at $E_s/N_0=10$ dB bound the rms phase error at $1.28^\circ$, and nothing — no algorithm, loop, or neural network — can do better without more symbols, more SNR, or bias. The DA ML estimator $\hat\theta=\arg\sum_k y_ka_k^*$ essentially achieves the bound, which is why preambles are the gold standard; the excess variance of any blind estimator over this bound is the measurable price of not knowing the data.</p>`
      },
      {
        title: 'Viterbi-Viterbi M-th Power (NDA) Phase Estimator',
        tex: String.raw`$$\hat\theta=\frac{1}{M}\arg\!\left\{\sum_{k=1}^{L}y_k^{\,M}\right\}+\text{const},\qquad\text{ambiguous modulo }\frac{2\pi}{M}$$`,
        derivation: String.raw`<p><b>Where we start.</b> With no pilots, the received $M$-PSK samples are $y_k=\sqrt{E_s}\,e^{j(\theta+\phi_k)}+n_k$, where the data phase $\phi_k$ takes one of $M$ equally spaced values ($\phi_k=2\pi m_k/M$ plus a constellation-dependent constant). The data phase randomizes the argument of every sample, so a direct average of $\arg y_k$ tells us nothing. We need an operation that erases the modulation but preserves $\theta$.</p>
<p><b>Step 1.</b> Raise each sample to the $M$-th power. Ignoring noise, $y_k^M=E_s^{M/2}e^{jM\theta}e^{jM\phi_k}$, and $M\phi_k=2\pi m_k$ (plus a fixed constant) is a multiple of $2\pi$ — the data phase vanishes identically. Every sample now points (noisily) in the single direction $M\theta$: the nonlinearity has converted a modulated carrier into an unmodulated tone at $M$ times the phase.</p>
<p><b>Step 2.</b> Average the powered samples over the block, $\sum_k y_k^M$, so the noise contributions (signal-times-noise and noise-to-the-$M$ cross terms) partially cancel while the common $e^{jM\theta}$ direction adds coherently; then take the argument and divide by $M$ to undo the scaling: $\hat\theta=\frac{1}{M}\arg\Sigma_k y_k^M$ (subtracting the fixed constellation constant).</p>
<p><b>Result.</b> A completely blind, feedforward, one-shot phase estimate. Two structural costs are unavoidable. First, the powering multiplies noise by signal and noise by noise, inflating the variance above the DA bound — the squaring loss, worst at low SNR and larger for larger $M$. Second, since the estimator only ever sees $M\theta$, any rotation of the constellation by $2\pi/M$ produces identical statistics: the estimate is ambiguous modulo $2\pi/M$ ($90^\circ$ for QPSK), which is exactly why blind carrier recovery is paired with differential encoding or a unique word to pin the absolute rotation.</p>`
      },
      {
        title: 'Gardner Timing Error Detector',
        tex: String.raw`$$e_k=\mathrm{Re}\!\left\{y_{k-\frac12}\left(y_{k-1}^{\,*}-y_k^{\,*}\right)\right\}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want a timing discriminator that runs at only two samples per symbol and — crucially — works <em>before</em> carrier phase is known. Let $y_k$ denote the matched-filter output sampled at the (estimated) symbol instants and $y_{k-1/2}$ the sample midway between symbols $k{-}1$ and $k$. For a Nyquist pulse the waveform between two opposite-sign symbols crosses zero exactly at the midpoint <em>when timing is perfect</em>.</p>
<p><b>Step 1.</b> Consider a data transition ($y_{k-1}$ and $y_k$ of opposite polarity, BPSK for intuition). With correct timing the midpoint sample $y_{k-1/2}$ sits on the zero crossing, so it is zero and contributes nothing. If sampling is <em>late</em>, the midpoint sample slides past the crossing toward the new symbol: its sign matches $y_k$ and opposes $y_{k-1}$, so the product $y_{k-1/2}(y_{k-1}-y_k)$ is negative; sampling <em>early</em> flips the sign. When there is no transition ($y_{k-1}\approx y_k$) the bracket vanishes and the detector emits nothing — transitions are the only source of timing information.</p>
<p><b>Step 2.</b> For complex constellations, conjugate the strobe difference and keep the real part: $e_k=\mathrm{Re}\lbrace y_{k-1/2}(y_{k-1}^*-y_k^*)\rbrace$. A common carrier rotation $e^{j\phi}$ multiplies $y_{k-1/2}$ by $e^{j\phi}$ and the conjugated bracket by $e^{-j\phi}$ — the rotations cancel identically, so the detector output is independent of carrier phase and only weakly affected by small frequency offsets.</p>
<p><b>Result.</b> $e_k$ is a signed, NDA, rotation-invariant timing error signal generated once per symbol from just two samples per symbol; averaged over many symbols it traces an S-curve through zero at perfect timing. Its phase invariance is what licenses the modern receiver ordering in which the timing loop closes before (or wholly independently of) the carrier phase loop — timing hands a clean eye to the Costas loop rather than the other way round. Its price: self-noise on random data and reliance on transition density (long runs of identical symbols starve it, one reason scramblers exist).</p>`
      },
      {
        title: 'Second-Order PLL Pull-In (Acquisition) Time',
        tex: String.raw`$$T_p\approx\frac{(\Delta\omega)^2}{2\zeta\,\omega_n^3}\ \approx\ 4.2\,\frac{(\Delta f)^2}{B_L^3}\quad(\zeta=0.707)$$`,
        derivation: String.raw`<p><b>Where we start.</b> A phase loop switched on with a frequency error $\Delta f$ outside its lock-in range does not snap to lock; it <em>pulls in</em> slowly, ratcheting energy out of the frequency error through repeated cycle slipping while the integrator in the loop filter accumulates the correction. Phaselock theory (Gardner) gives the pull-in time of a high-gain second-order loop as $T_p\approx(\Delta\omega)^2/(2\zeta\omega_n^3)$, with $\Delta\omega=2\pi\Delta f$, natural frequency $\omega_n$, and damping $\zeta$. We convert this to the designer's variable, the loop noise bandwidth $B_L$.</p>
<p><b>Step 1.</b> For a second-order loop the (one-sided) noise bandwidth relates to the natural frequency by $B_L=\frac{\omega_n}{2}\left(\zeta+\frac{1}{4\zeta}\right)$. At the standard damping $\zeta=1/\sqrt2\approx0.707$, the bracket is $0.707+0.354=1.061$, so $B_L\approx0.53\,\omega_n$, i.e. $\omega_n\approx1.89\,B_L$.</p>
<p><b>Step 2.</b> Substitute into the pull-in formula: $T_p\approx\dfrac{(2\pi\Delta f)^2}{2(0.707)(1.89B_L)^3}=\dfrac{39.5\,\Delta f^2}{1.414\times6.74\,B_L^3}=\dfrac{39.5}{9.53}\cdot\dfrac{\Delta f^2}{B_L^3}\approx4.2\,\dfrac{\Delta f^2}{B_L^3}$.</p>
<p><b>Result.</b> Acquisition time grows with the <em>square</em> of the frequency error and falls with the <em>cube</em> of the loop bandwidth. The cubic law is the quantitative heart of the acquisition/tracking conflict: a loop narrow enough for beautiful jitter ($\sigma\propto\sqrt{B_L}$) can take minutes to pull in a modest offset. Hence every practical fix — gear-shift bandwidths, sweep acquisition, FLL-assisted PLL, or a feedforward DA frequency estimate that jumps the loop straight into its lock-in range and skips pull-in entirely.</p>`
      },
      {
        title: 'Mean Time Between Cycle Slips (First-Order PLL)',
        tex: String.raw`$$T_{\text{slip}}\approx\frac{\pi}{4B_L}\,e^{\,2\rho_L}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A locked loop's phase error does not merely jitter — it performs Brownian motion in the periodic potential defined by the S-curve, with wells at each stable lock point ($2\pi$ apart for a PLL). Noise occasionally drives the error over the potential barrier at $\pm\pi$, after which it falls into the next well: a cycle slip. The mean first-passage time out of a well follows from the Fokker&ndash;Planck equation for the phase-error density; Viterbi solved it exactly for the first-order loop: $2B_L\,T_{\text{slip}}=\pi^2\rho_L\,I_0^2(\rho_L)$, with $I_0$ the modified Bessel function.</p>
<p><b>Step 1.</b> For the strong-signal regime $\rho_L\gg1$, use the asymptotic form $I_0(\rho_L)\approx e^{\rho_L}/\sqrt{2\pi\rho_L}$, so $I_0^2(\rho_L)\approx e^{2\rho_L}/(2\pi\rho_L)$.</p>
<p><b>Step 2.</b> Substitute into Viterbi's result: $2B_LT_{\text{slip}}\approx\pi^2\rho_L\cdot\dfrac{e^{2\rho_L}}{2\pi\rho_L}=\dfrac{\pi}{2}e^{2\rho_L}$; the $\rho_L$ factors cancel, leaving $T_{\text{slip}}\approx\dfrac{\pi}{4B_L}e^{2\rho_L}$.</p>
<p><b>Result.</b> The slip interval is <em>exponential</em> in loop SNR — the strongest dependence in all of synchronization. Each extra dB of $\rho_L$ multiplies the time between slips severalfold: at $B_L=10$ Hz, $\rho_L=7$ gives about a day between slips while $\rho_L=10$ gives over a year. This is why the $\sigma_\phi\le15^\circ$ ($\rho_L\gtrsim13$ dB) rule keeps slips negligible, why Costas loops (whose stable points are only $2\pi/M$ apart, lowering the barrier) need extra margin, and why a link that "mostly works" but loses frame sync every few minutes is usually a loop running a few dB below its slip threshold.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What five quantities must a coherent receiver synchronize?`, back: String.raw`Carrier frequency, carrier phase, symbol timing, frame position, and — for spread spectrum — code phase.` },
      { front: String.raw`What is the visible symptom of a carrier frequency offset on a constellation?`, back: String.raw`The constellation spins continuously at $\Delta f$ revolutions per second — a phase advance of $2\pi\Delta f T$ radians per symbol.` },
      { front: String.raw`What does a static carrier phase error do to QPSK?`, back: String.raw`Rotates the constellation by $\theta$: the wanted component shrinks by $\cos\theta$ and crosstalk proportional to $\sin\theta$ leaks between the I and Q bit streams.` },
      { front: String.raw`Why does symbol timing error cause ISI?`, back: String.raw`Nyquist pulses are zero only at the correct sampling instants; sampling offset by $\varepsilon T$ makes neighbouring pulses nonzero at the sampling moment, so they leak into every decision.` },
      { front: String.raw`State the receiver synchronization hierarchy in order.`, back: String.raw`AGC $\to$ carrier frequency (FLL/CFO) $\to$ carrier phase (PLL/Costas) $\to$ symbol timing (early-late/Gardner) $\to$ frame sync (unique word); spread spectrum prepends code acquisition and code tracking (DLL).` },
      { front: String.raw`Why must frequency be corrected before phase?`, back: String.raw`Phase is undefined while it sweeps through $2\pi$ thousands of times a second; the residual $\Delta f$ must first be brought inside the phase loop's pull-in range.` },
      { front: String.raw`Define acquisition versus tracking.`, back: String.raw`Acquisition: coarse search/estimation over a large uncertainty, wide bandwidth, optimized for speed. Tracking: closed-loop refinement of a small error, narrow bandwidth, optimized for low jitter and hold.` },
      { front: String.raw`What is data-aided (DA) synchronization?`, back: String.raw`Estimation using symbols the receiver already knows — preambles or pilots — which wipe the modulation exactly; fast and near-CRLB but costs overhead.` },
      { front: String.raw`Name three non-data-aided synchronizers.`, back: String.raw`The squaring loop / $M$-th power (Viterbi-Viterbi) carrier estimator, the Costas loop (NDA in the sense of using the modulated signal), and the Gardner timing error detector.` },
      { front: String.raw`What is the weakness of decision-directed loops?`, back: String.raw`Below a threshold SNR the decisions feeding the loop are frequently wrong, corrections chase errors, and performance collapses — DD is a tracking tool, never an acquisition tool.` },
      { front: String.raw`Give the three blocks of every feedback synchronizer.`, back: String.raw`Error detector (discriminator) $\to$ loop filter (sets $B_L$ and loop order) $\to$ NCO/interpolator applying the correction.` },
      { front: String.raw`When is feedforward synchronization preferred?`, back: String.raw`Burst/packet modems: buffer a block, estimate once (e.g. Viterbi-Viterbi, preamble correlation), apply it — no pull-in transient, no cycle slips, deterministic latency.` },
      { front: String.raw`How are discriminators related to maximum likelihood?`, back: String.raw`They are the gradient (score function) of the log-likelihood with respect to the unknown parameter; a feedback loop is gradient ascent on $\Lambda$, e.g. the early-late gate is a finite-difference $\partial\Lambda/\partial\tau$.` },
      { front: String.raw`Define loop SNR and the phase jitter law.`, back: String.raw`$\rho_L=C/(N_0B_L)$ — carrier power over noise density times loop noise bandwidth; linearized jitter $\sigma_\phi^2=1/(2\rho_L)$ rad$^2$ (two-sided $B_L$ convention).` },
      { front: String.raw`What is a cycle slip and how often does it happen?`, back: String.raw`Noise pushes the phase error over the S-curve barrier and the loop re-locks $2\pi$ (or $2\pi/M$) away; mean time between slips $\approx(\pi/4B_L)e^{2\rho_L}$ — exponential in loop SNR.` },
      { front: String.raw`State the DA phase-estimation Cramer-Rao bound.`, back: String.raw`$\operatorname{var}(\hat\theta)\ge1/(2L\,E_s/N_0)$ for $L$ known symbols at symbol SNR $E_s/N_0$; no unbiased estimator can do better.` },
      { front: String.raw`Why is the Gardner TED usable before carrier lock?`, back: String.raw`Its form $\mathrm{Re}\lbrace y_{k-1/2}(y_{k-1}^*-y_k^*)\rbrace$ cancels any common rotation $e^{j\phi}$ between the midpoint sample and the conjugated strobe difference — it is carrier-phase invariant.` },
      { front: String.raw`What resolves the $2\pi/M$ ambiguity of blind carrier recovery?`, back: String.raw`Differential encoding (data carried in phase changes) or a known unique word whose detected orientation pins the absolute rotation.` }
    ],
    mcqs: [
      { q: String.raw`Coherent detection fundamentally requires the receiver to:`, options: [String.raw`have more transmit power than the noise`, String.raw`align its local references in carrier frequency, phase, and symbol timing with the received signal`, String.raw`use error-correcting codes`, String.raw`sample faster than the Nyquist rate of the carrier`], answer: 1, explain: String.raw`Coherent detection is an inner product against local templates; every unaligned reference (frequency, phase, timing, frame, code) corrupts that inner product.` },
      { q: String.raw`The correct order of the classical synchronization hierarchy is:`, options: [String.raw`phase $\to$ frequency $\to$ frame $\to$ timing`, String.raw`AGC $\to$ frequency $\to$ phase $\to$ timing $\to$ frame`, String.raw`frame $\to$ timing $\to$ phase $\to$ frequency`, String.raw`timing $\to$ frame $\to$ AGC $\to$ phase`], answer: 1, explain: String.raw`AGC first (all discriminator gains scale with amplitude), then the big fast error (frequency), then phase, then timing, then frame; code sync prepends for spread spectrum.` },
      { q: String.raw`Carrier frequency must be corrected before carrier phase because:`, options: [String.raw`frequency errors are smaller than phase errors`, String.raw`phase is meaningless while the constellation is still spinning — the offset must first enter the phase loop's pull-in range`, String.raw`phase loops are more expensive`, String.raw`the FLL also recovers the data`], answer: 1, explain: String.raw`A frequency error is a phase ramp; until $\Delta f$ is small a phase loop has nothing stationary to lock to.` },
      { q: String.raw`A constellation that is rotated by a fixed angle but not spinning indicates:`, options: [String.raw`a symbol timing error`, String.raw`a residual carrier phase error`, String.raw`a frame sync error`, String.raw`an AGC error`], answer: 1, explain: String.raw`A static rotation is the signature of a phase offset; a frequency offset would make it spin, and a timing error blurs points into ISI clouds.` },
      { q: String.raw`Acquisition and tracking differ in that acquisition:`, options: [String.raw`uses narrow bandwidth for low jitter`, String.raw`handles large uncertainty with wide bandwidth, optimized for speed and detection`, String.raw`only runs after frame sync`, String.raw`is only needed in spread spectrum`], answer: 1, explain: String.raw`Acquisition beats down a large initial error quickly; tracking then holds the small residual with a narrow, low-jitter loop.` },
      { q: String.raw`Data-aided synchronization achieves near-CRLB accuracy because:`, options: [String.raw`it squares the signal`, String.raw`known preamble/pilot symbols wipe the modulation exactly, leaving a clean estimation problem`, String.raw`it uses a wider loop bandwidth`, String.raw`it avoids matched filtering`], answer: 1, explain: String.raw`With the data known, the likelihood is maximized by a simple pilot correlation, essentially reaching the bound; the cost is overhead.` },
      { q: String.raw`The inherent ambiguity of $M$-th-power (Viterbi-Viterbi) carrier recovery is:`, options: [String.raw`a $2\pi/M$ phase ambiguity, since rotations by $2\pi/M$ give identical statistics`, String.raw`a factor-$M$ amplitude ambiguity`, String.raw`an $M$-symbol timing ambiguity`, String.raw`no ambiguity at all`], answer: 0, explain: String.raw`The estimator only observes $M\theta$, so $\theta$ is known only modulo $2\pi/M$; differential coding or a unique word resolves it.` },
      { q: String.raw`The Gardner timing error detector is attractive before carrier lock because it:`, options: [String.raw`requires eight samples per symbol`, String.raw`is invariant to carrier phase rotation`, String.raw`needs known pilots`, String.raw`estimates frequency simultaneously`], answer: 1, explain: String.raw`A common rotation cancels between the midpoint sample and the conjugated strobe difference, so the TED works with the carrier still unlocked.` },
      { q: String.raw`Decision-directed synchronizers fail at low SNR because:`, options: [String.raw`the NCO saturates`, String.raw`wrong decisions feed wrong corrections and the loop chases its own errors`, String.raw`the loop filter becomes unstable`, String.raw`pilots are unavailable`], answer: 1, explain: String.raw`DD treats decisions as pilots; below a threshold error rate this bootstrapping collapses — DD is a tracking tool only.` },
      { q: String.raw`Compared with a feedback loop, a feedforward block estimator:`, options: [String.raw`tracks continuous drift better`, String.raw`converges in one block with no pull-in transient and no cycle slips`, String.raw`requires no buffering`, String.raw`has random latency`], answer: 1, explain: String.raw`Feedforward jumps straight to the likelihood peak computed over a block — ideal for bursts; its estimate is frozen within the block.` },
      { q: String.raw`In the ML framework, a feedback discriminator corresponds to:`, options: [String.raw`the gradient (score) of the log-likelihood with respect to the parameter`, String.raw`the prior distribution of the data`, String.raw`the determinant of the Fisher matrix`, String.raw`the channel impulse response`], answer: 0, explain: String.raw`Loops perform gradient ascent on $\Lambda$: the early-late gate is a finite-difference $\partial\Lambda/\partial\tau$, the DD phase detector is $\partial\Lambda/\partial\theta$.` },
      { q: String.raw`With $C/N_0=40$ dB-Hz and $B_L=10$ Hz, the loop SNR $\rho_L$ is:`, options: [String.raw`4`, String.raw`100`, String.raw`1000`, String.raw`10000`], answer: 2, explain: String.raw`$C/N_0=10^{40/10}=10^4$ Hz, so $\rho_L=10^4/10=1000$ (30 dB) — the loop averages noise over $1/B_L$ seconds.` },
      { q: String.raw`Halving the loop noise bandwidth $B_L$ of a locked loop:`, options: [String.raw`halves the phase jitter variance but slows acquisition and dynamic response`, String.raw`doubles the jitter variance`, String.raw`has no effect on jitter`, String.raw`eliminates cycle slips entirely`], answer: 0, explain: String.raw`$\sigma_\phi^2=1/(2\rho_L)\propto B_L$, so halving $B_L$ halves the variance; but pull-in time grows as $1/B_L^3$ and dynamics tolerance shrinks.` },
      { q: String.raw`The mean time between cycle slips grows with loop SNR:`, options: [String.raw`linearly`, String.raw`as the square root`, String.raw`quadratically`, String.raw`exponentially`], answer: 3, explain: String.raw`$T_{\text{slip}}\approx(\pi/4B_L)e^{2\rho_L}$ — a few dB of loop SNR turns slips from hourly events into yearly ones.` },
      { q: String.raw`The Cramer-Rao lower bound for phase estimation improves (decreases) when:`, options: [String.raw`the observation length $L$ or the symbol SNR $E_s/N_0$ increases`, String.raw`the loop bandwidth increases`, String.raw`the modulation order increases`, String.raw`differential encoding is used`], answer: 0, explain: String.raw`$\operatorname{var}(\hat\theta)\ge1/(2L\,E_s/N_0)$: more symbols or more SNR sharpen the likelihood peak; nothing else helps an unbiased estimator.` }
    ],
    numericals: [
      {
        q: String.raw`A carrier tracking loop runs with loop noise bandwidth $B_L=20$ Hz on a signal with $C/N_0=40$ dB-Hz. Find the loop SNR $\rho_L$ and the rms phase jitter in degrees.`,
        solution: String.raw`<p><b>Formula.</b> $$\rho_L=\frac{C/N_0}{B_L},\qquad \sigma_\phi=\sqrt{\frac{1}{2\rho_L}},$$ with $C/N_0$ converted from dB-Hz to a linear ratio in Hz.</p>
<p><b>Substitute.</b> $C/N_0=10^{40/10}=10^4$ Hz. $\rho_L=\dfrac{10^4}{20}=500$. $\sigma_\phi=\sqrt{\dfrac{1}{2\times500}}=\sqrt{10^{-3}}$.</p>
<p><b>Compute.</b> $\sigma_\phi=0.0316$ rad $=0.0316\times\dfrac{180}{\pi}=\mathbf{1.81^\circ}$ rms (loop SNR $\rho_L=500=27$ dB).</p>
<p><b>Explanation.</b> Although each millisecond of this signal is individually noisy, the loop only admits 20 Hz of noise, so it enjoys a 27 dB in-loop SNR and jitters less than $2^\circ$ rms — far inside the $15^\circ$ rule of thumb, so cycle slips will be essentially nonexistent. Note the mandatory dB-Hz-to-linear conversion: substituting 40 directly would be wrong by orders of magnitude.</p>`
      },
      {
        q: String.raw`A QPSK receiver runs at $R_s=1$ Msym/s with an uncorrected carrier frequency offset of $\Delta f=500$ Hz. Find the phase rotation per symbol and the number of symbols before the accumulated rotation reaches the QPSK decision-boundary half-angle of $\pi/4$.`,
        solution: String.raw`<p><b>Formula.</b> $$\Delta\phi_{\text{sym}}=2\pi\,\Delta f\,T=\frac{2\pi\,\Delta f}{R_s},\qquad N_{\pi/4}=\frac{\pi/4}{\Delta\phi_{\text{sym}}}.$$</p>
<p><b>Substitute.</b> $\Delta\phi_{\text{sym}}=\dfrac{2\pi\times500}{10^6}=2\pi\times5\times10^{-4}$ rad; $N_{\pi/4}=\dfrac{\pi/4}{2\pi\times5\times10^{-4}}$.</p>
<p><b>Compute.</b> $\Delta\phi_{\text{sym}}=3.14\times10^{-3}$ rad $=\mathbf{0.18^\circ}$ per symbol; $N_{\pi/4}=\dfrac{0.7854}{3.14\times10^{-3}}=\mathbf{250}$ symbols (i.e. $250\ \mu$s at 1 Msym/s).</p>
<p><b>Explanation.</b> A seemingly tiny 500 Hz offset — 0.5 ppm at a 1 GHz carrier — rotates the constellation into guaranteed symbol errors within 250 symbols. This is why frequency correction cannot be skipped even for short bursts, and why burst modems put a CFO-estimation preamble first: without it, everything after the first few hundred symbols of the burst is lost.</p>`
      },
      {
        q: String.raw`A burst modem estimates carrier phase from a preamble of $L=100$ known symbols at $E_s/N_0=10$ dB. Compute the Cramer-Rao bound on the phase-estimate variance and the corresponding minimum rms error in degrees.`,
        solution: String.raw`<p><b>Formula.</b> $$\operatorname{var}(\hat\theta)\ge\frac{1}{2L\,(E_s/N_0)},\qquad \sigma_{\min}=\sqrt{\operatorname{var}_{\min}},$$ with $E_s/N_0$ as a linear ratio.</p>
<p><b>Substitute.</b> $E_s/N_0=10^{10/10}=10$. $\operatorname{var}(\hat\theta)\ge\dfrac{1}{2\times100\times10}=\dfrac{1}{2000}$.</p>
<p><b>Compute.</b> $\operatorname{var}_{\min}=5.0\times10^{-4}$ rad$^2$; $\sigma_{\min}=\sqrt{5.0\times10^{-4}}=0.02236$ rad $=\mathbf{1.28^\circ}$ rms.</p>
<p><b>Explanation.</b> No unbiased estimator — loop or block, however sophisticated — can beat $1.28^\circ$ rms from these 100 pilots at this SNR. The DA correlation estimator $\hat\theta=\arg\Sigma\,y_ka_k^*$ essentially achieves it, which is why preamble design is about length and SNR, not algorithmic cleverness: to halve the error, quadruple $L$ or raise $E_s/N_0$ by 6 dB.</p>`
      },
      {
        q: String.raw`A second-order PLL ($\zeta=0.707$) must pull in a frequency offset of $\Delta f=1$ kHz. Compare the pull-in time for loop bandwidths $B_L=100$ Hz and $B_L=200$ Hz using $T_p\approx4.2\,\Delta f^2/B_L^3$.`,
        solution: String.raw`<p><b>Formula.</b> $$T_p\approx4.2\,\frac{(\Delta f)^2}{B_L^3}.$$</p>
<p><b>Substitute.</b> For $B_L=100$ Hz: $T_p=4.2\times\dfrac{(10^3)^2}{(100)^3}=4.2\times\dfrac{10^6}{10^6}$. For $B_L=200$ Hz: $T_p=4.2\times\dfrac{10^6}{8\times10^6}$.</p>
<p><b>Compute.</b> $B_L=100$ Hz: $T_p=\mathbf{4.2}$ s. $B_L=200$ Hz: $T_p=\mathbf{0.525}$ s — doubling the bandwidth cuts pull-in by $2^3=8\times$.</p>
<p><b>Explanation.</b> The cubic law makes acquisition brutally sensitive to bandwidth: the loop that tracks beautifully at $B_L=100$ Hz takes over four seconds to acquire a 1 kHz offset, unacceptable for most links. The standard remedies follow directly: open the loop wide (or use an FLL, or a feedforward DA frequency estimate) to kill the offset, then gear-shift down to the narrow tracking bandwidth — buying the $1/B_L^3$ speed and the $\sqrt{B_L}$ jitter at the same time.</p>`
      },
      {
        q: String.raw`A first-order PLL runs at loop SNR $\rho_L=10$ (linear) with $B_L=10$ Hz. Estimate the mean time between cycle slips, and compare with $\rho_L=7$.`,
        solution: String.raw`<p><b>Formula.</b> $$T_{\text{slip}}\approx\frac{\pi}{4B_L}\,e^{2\rho_L}.$$</p>
<p><b>Substitute.</b> $\rho_L=10$: $T_{\text{slip}}=\dfrac{\pi}{40}\,e^{20}$. $\rho_L=7$: $T_{\text{slip}}=\dfrac{\pi}{40}\,e^{14}$.</p>
<p><b>Compute.</b> $e^{20}=4.85\times10^{8}$, so $T_{\text{slip}}=0.0785\times4.85\times10^{8}=\mathbf{3.81\times10^{7}}$ s $\approx441$ days. For $\rho_L=7$: $e^{14}=1.20\times10^{6}$, $T_{\text{slip}}=0.0785\times1.20\times10^{6}=9.4\times10^{4}$ s $\approx\mathbf{26}$ hours.</p>
<p><b>Explanation.</b> Dropping the loop SNR from 10 to 7 (a mere 1.5 dB) collapses the slip interval from over a year to about a day — the exponential law in action. A link budget that leaves the tracking loop only marginal $\rho_L$ will "work" between slips yet mysteriously lose frame sync and drop packets every so often; the cure is more $C/N_0$, narrower $B_L$, or both.</p>`
      },
      {
        q: String.raw`A 2.4 GHz radio uses $\pm10$ ppm crystals at both ends (worst-case 20 ppm total) and signals at $R_s=250$ ksym/s. Find the worst-case CFO and the constellation rotation per symbol, and judge whether a phase loop alone can cope.`,
        solution: String.raw`<p><b>Formula.</b> $$\Delta f=f_c\times(\text{ppm}_{\text{total}}\times10^{-6}),\qquad \Delta\phi_{\text{sym}}=\frac{2\pi\,\Delta f}{R_s}.$$</p>
<p><b>Substitute.</b> $\Delta f=2.4\times10^{9}\times20\times10^{-6}$; $\Delta\phi_{\text{sym}}=\dfrac{2\pi\times\Delta f}{2.5\times10^{5}}$.</p>
<p><b>Compute.</b> $\Delta f=\mathbf{48}$ kHz. $\Delta\phi_{\text{sym}}=\dfrac{2\pi\times4.8\times10^{4}}{2.5\times10^{5}}=2\pi\times0.192=1.21$ rad $=\mathbf{69.1^\circ}$ per symbol.</p>
<p><b>Explanation.</b> A rotation of $69^\circ$ every symbol is nearly a fifth of a full turn — no phase-tracking loop can follow it, since it far exceeds any usable pull-in range and even violates the small-error linearization. This single number dictates the receiver architecture: a coarse CFO stage (FLL, or preamble autocorrelation estimating $\Delta f$ from the phase ramp) must first crush the 48 kHz to tens of hertz; only then does the Costas/PLL stage stand a chance. It is the concrete justification for the frequency-before-phase rule of the sync hierarchy.</p>`
      }
    ],
    realWorld: String.raw`<p>Every receiver you own runs the full synchronization chain of this topic, tuned to its traffic pattern. Your Wi-Fi card is the feedforward, data-aided extreme: each packet opens with the standardized preamble, from which the baseband estimates AGC level, coarse and fine CFO (autocorrelation of the repeated short and long training fields), symbol timing, and channel — all within the first few tens of microseconds, no tracking loops required, because a burst is too short for pull-in transients. A DVB-S2 satellite tuner is the opposite extreme: a continuous stream justifies closed loops everywhere — a frequency sweep and FLL for the LNB's hundreds-of-kilohertz drift, a decision-directed phase loop leaning on pilot blocks to survive low SNR near the FEC threshold, a Gardner timing loop, and frame sync on the physical-layer header. A GPS receiver is the most demanding of all: code acquisition over a two-dimensional code-phase/Doppler grid, handover to a DLL for code and an FLL-assisted-PLL for carrier, loop bandwidths gear-shifted as lock tightens, and cycle-slip monitoring — precisely the acquisition-to-tracking ladder, run per satellite, at $C/N_0$ values where every dB of loop SNR matters.</p>
<p>The performance laws of this topic are daily engineering currency. Modem datasheets specify acquisition ranges (the CFO a receiver tolerates, in ppm) and acquisition times — direct descendants of the $\Delta f^2/B_L^3$ pull-in law and of preamble length choices set by the Cramer-Rao bound. Deep-space links, with their extreme weak-signal budgets, choose loop bandwidths of fractions of a hertz and accept the resulting dynamics fragility, because $\sigma_\phi^2=1/(2\rho_L)$ leaves no other lever at a $C/N_0$ of 25 dB-Hz. Cycle-slip statistics decide whether a coherent transponder needs differential coding as insurance against the $2\pi/M$ re-lock ambiguity. And when a deployed link "mostly works" but drops frames every few minutes, an engineer who knows this topic reaches first for the loop-SNR calculation — because a slip interval that is exponential in $\rho_L$ means the difference between a solid link and a flaky one is often just two or three decibels.</p>`,
    related: ['pll', 'fll', 'costas-loop', 'cfo', 'early-late-correlator', 'coherent-carrier-tracking']
  }
);
