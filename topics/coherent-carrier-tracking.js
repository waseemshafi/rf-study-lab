/* coherent-carrier-tracking.js — "Coherent Carrier Tracking" topic (Synchronization).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "coherent-carrier-tracking-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'coherent-carrier-tracking',
    title: 'Coherent Carrier Tracking',
    category: 'Synchronization',
    tags: ['carrier recovery', 'Costas loop', 'squaring loop', 'suppressed carrier', 'phase ambiguity', 'squaring loss', 'phase jitter', 'BPSK', 'QPSK'],
    summary: String.raw`Coherent demodulation needs a local oscillator locked to the incoming carrier in both frequency and phase — but a suppressed-carrier signal like BPSK has no discrete line at $f_c$ for a plain PLL to grab. Coherent carrier tracking regenerates that phase reference from the modulation itself: a squaring loop squares the signal to expose a component at $2f_c$, and a Costas loop uses I and Q arms whose product forms a data-independent error $\propto\sin(2\Delta\phi)$. Both recover the carrier at the price of a $180^\circ$ phase ambiguity and a squaring loss, leaving a residual phase jitter $\sigma_\phi^2=1/(2\rho_L)$ that rotates the constellation and degrades BER.`,
    prerequisites: ['costas-loop', 'pll', 'bpsk'],
    intro: String.raw`<p><strong>Why go to all the trouble of regenerating a carrier we cannot even see?</strong> A coherent receiver multiplies the incoming signal by a locally generated $\cos(\omega_c t+\hat\phi)$ to strip the carrier and pull the data down to baseband. That only works if $\hat\phi$ matches the true carrier phase: a phase error $\Delta\phi$ scales every decision statistic by $\cos\Delta\phi$, so a $60^\circ$ error already halves the signal amplitude and a $90^\circ$ error erases the signal entirely. Coherent detection is worth this effort because it is the best there is — about <strong>1 dB better than differential DBPSK</strong> and several dB better than non-coherent envelope detection, and it is <em>mandatory</em> for high-order QAM where the constellation carries information in both amplitude and phase. The whole payoff of coherent modulation hinges on having an accurate, continuously updated phase reference, and manufacturing that reference is the job of carrier tracking.</p>
<p>The trouble is that the most common coherent signals hide their carrier. A BPSK waveform is $\pm A\cos(\omega_c t)$: the data flips the sign of the carrier, and because $+\cos$ and $-\cos$ are equally likely and average to zero, <strong>there is no spectral line at $f_c$</strong> for an ordinary PLL to lock onto. The carrier is <em>suppressed</em> — all the transmit power went into the modulation, none into a residual pilot tone. Point a plain PLL at a BPSK signal and it finds nothing to track. We must first process the signal to <em>re-create</em> a carrier-related tone, and only then lock a loop to it.</p>
<p>Two classic structures do exactly this. The <strong>squaring loop</strong> squares the received signal; squaring $\pm A\cos(\omega_c t)$ removes the sign (since $(\pm1)^2=1$) and produces a clean component at <em>twice</em> the carrier frequency, which a PLL locks and a divide-by-two converts back to the carrier. The <strong>Costas loop</strong> reaches the same result more elegantly with parallel in-phase and quadrature arms whose product gives a data-independent error voltage proportional to $\sin(2\Delta\phi)$. This topic derives both from scratch, explains the $180^\circ$ phase ambiguity they inherit and how differential encoding or a unique word resolves it, quantifies the squaring loss and the residual phase-jitter law $\sigma_\phi^2=1/(2\rho_L)$, and shows how that jitter rotates the constellation and costs you BER.</p>`,
    sections: [
      {
        h: 'Why coherent, and why the carrier is hard to find',
        html: String.raw`<p><strong>Why insist on coherent detection?</strong> Because knowing the carrier phase lets the receiver project the noisy received vector onto the exact signal direction, keeping all the signal energy while averaging noise in the orthogonal direction to nothing. The alternatives throw information away: non-coherent envelope detection ignores phase entirely (paying several dB), and differential detection (DBPSK) uses the <em>previous</em> symbol as a noisy phase reference (paying about 1 dB and doubling error bursts). For BPSK the coherent bit-error probability is $Q(\sqrt{2E_b/N_0})$, the best achievable in AWGN; DBPSK is roughly $\tfrac12 e^{-E_b/N_0}$, about 1 dB worse at useful SNR. For 16-QAM and above, where symbols differ in amplitude <em>and</em> phase, there is simply no non-coherent option — you must track the carrier.</p>
<p><strong>So why is tracking hard?</strong> Consider BPSK, $s(t)=A\,d(t)\cos(\omega_c t)$ with data $d(t)=\pm1$. Its power spectrum is the baseband data spectrum shifted up to $\pm f_c$ — a smooth continuous lobe (its sinc$^2$ shape actually <em>peaks</em> at $f_c$) containing <em>no discrete spectral line</em>, no impulse, at $f_c$. There is no discrete carrier line because the expected value of $d(t)\cos(\omega_c t)$ is zero: over many symbols the $+\cos$ and $-\cos$ contributions cancel. A PLL is a device that locks to a <em>sinusoid</em>; presented with a signal that has no sinusoidal component at $f_c$, it has nothing to lock to. This is the defining feature of a <strong>suppressed-carrier</strong> signal, and it is why carrier recovery for BPSK/QPSK is a nonlinear-processing problem, not a plain-PLL problem.</p>
<div class="callout"><strong>Intuition:</strong> a residual-carrier signal is like a lighthouse with a steady beam you can steer toward. A suppressed-carrier signal blinks the beam on-positive and on-negative equally often, so on average it looks dark — you must first process the blinking to recover a steady reference before you can steer to it.</div>`
      },
      {
        h: 'The squaring loop: exposing a line at twice the carrier',
        html: String.raw`<p>The oldest fix is to make the hidden carrier visible by a <strong>nonlinearity</strong>. Square the received BPSK signal:</p>
<p>$$s^2(t)=\big[A\,d(t)\cos(\omega_c t)\big]^2=A^2 d^2(t)\cos^2(\omega_c t).$$</p>
<p>Two facts collapse this into something a PLL loves. First, $d(t)=\pm1$ so $d^2(t)=1$ <em>always</em> — squaring annihilates the data modulation. Second, $\cos^2(\omega_c t)=\tfrac12+\tfrac12\cos(2\omega_c t)$. Hence</p>
<p>$$s^2(t)=\tfrac{A^2}{2}+\tfrac{A^2}{2}\cos(2\omega_c t),$$</p>
<p>a DC term plus a <strong>pure, unmodulated tone at $2f_c$</strong> whose phase is exactly twice the carrier phase and is completely independent of the data. A bandpass filter around $2f_c$ isolates this tone; a PLL locks to it; and a <strong>divide-by-two</strong> brings the frequency (and phase) back down to $f_c$, yielding the coherent reference $\cos(\omega_c t+\hat\phi)$ needed to demodulate the original signal.</p>
<p>The block chain is: <em>square &rarr; bandpass at $2f_c$ &rarr; PLL &rarr; &divide;2 &rarr; carrier</em>. It works for any binary suppressed-carrier signal, but it pays two penalties covered below: a <strong>$180^\circ$ phase ambiguity</strong> introduced by the divide-by-two (halving the $2f_c$ phase leaves two valid answers $\hat\phi$ and $\hat\phi+180^\circ$), and a <strong>squaring loss</strong> — the squarer multiplies signal by noise and noise by noise, degrading the effective SNR of the recovered tone, badly so at low input SNR.</p>
<div class="callout tip"><strong>Tip:</strong> the reason we double the frequency is not to work at $2f_c$ for its own sake — it is that doubling the phase turns the two data states ($0^\circ$ and $180^\circ$) into ($0^\circ$ and $360^\circ$), which are identical. Doubling is the trick that makes the two data phases coincide so the modulation disappears.</div>`
      },
      {
        h: 'The Costas loop: a data-independent error from I and Q',
        html: String.raw`<p>The <strong>Costas loop</strong> reaches the same coherent reference without an explicit squarer, bandpass filter, and frequency divider. It runs the received signal into two multipliers driven by quadrature copies of the VCO — an <strong>in-phase (I) arm</strong> using $\cos(\omega_c t+\hat\phi)$ and a <strong>quadrature (Q) arm</strong> using $-\sin(\omega_c t+\hat\phi)$ — each followed by a lowpass filter. With received signal $A\,d(t)\cos(\omega_c t+\phi)$ and phase error $\Delta\phi=\phi-\hat\phi$, the low-frequency arm outputs are</p>
<p>$$I=\tfrac{A}{2}d(t)\cos\Delta\phi,\qquad Q=\tfrac{A}{2}d(t)\sin\Delta\phi.$$</p>
<p>The I arm is the demodulated data (scaled by $\cos\Delta\phi$); the Q arm is near zero when locked. Multiplying the two arms forms the <strong>phase-detector output</strong>:</p>
<p>$$e=I\cdot Q=\tfrac{A^2}{4}\,d^2(t)\,\cos\Delta\phi\,\sin\Delta\phi=\tfrac{A^2}{8}\sin(2\Delta\phi),$$</p>
<p>using $d^2(t)=1$ and $2\sin x\cos x=\sin 2x$. The crucial result: the <strong>data $d(t)$ has cancelled</strong>, leaving an error voltage $\propto\sin(2\Delta\phi)$ that is a clean, odd, data-independent function of phase error — exactly what a loop filter and VCO need to drive $\Delta\phi\to0$. This is why the Costas loop is a suppressed-carrier tracker: the $I\cdot Q$ product is mathematically the squaring operation performed at baseband, so the Costas loop and the squaring loop have <em>identical</em> theoretical performance, including the same $\sin(2\Delta\phi)$ S-curve, the same $180^\circ$ ambiguity, and the same squaring loss.</p>
<p>Higher-order modulations extend the idea. <strong>QPSK</strong> uses a fourth-power (or decision-directed) variant whose error is $\propto\sin(4\Delta\phi)$, giving a $90^\circ$ ambiguity; general <strong>decision-directed</strong> carrier recovery replaces the analytic nonlinearity with the receiver's own hard decisions $\hat d(t)$, forming the error from the difference between the received point and the nearest constellation point.</p>`
      },
      {
        h: 'The phase-detector S-curve and lock behaviour',
        html: String.raw`<p>Plotting the Costas/squaring error $e(\Delta\phi)\propto\sin(2\Delta\phi)$ against the phase error gives the <strong>S-curve</strong> (phase-detector characteristic). Its shape dictates everything about lock:</p>
<ul>
<li><strong>Zero crossings.</strong> $\sin(2\Delta\phi)=0$ at $\Delta\phi=0,\ \pm90^\circ,\ \pm180^\circ$. The crossings at $0^\circ$ and $\pm180^\circ$ have <em>positive</em> slope — a small positive $\Delta\phi$ produces a positive error that speeds the VCO and pulls $\Delta\phi$ back down — and are <strong>stable lock points</strong>; those at $\pm90^\circ$ have negative slope and are <strong>unstable</strong>. Because $0^\circ$ and $180^\circ$ are <em>both</em> stable, the loop can lock in either — the geometric root of the $180^\circ$ ambiguity.</li>
<li><strong>Doubled slope.</strong> Near $\Delta\phi=0$, $\sin(2\Delta\phi)\approx2\Delta\phi$, so the detector gain is <em>twice</em> that of an ordinary PLL tracking a residual carrier ($\sin\Delta\phi\approx\Delta\phi$). This doubled sensitivity is a feature — but it also means noise on the error is amplified, part of the squaring-loss story.</li>
<li><strong>Halved linear range.</strong> The linear tracking region spans only $\pm45^\circ$ (a quarter of the $\sin(2\Delta\phi)$ period on each side of a stable point), versus $\pm90^\circ$ for a residual-carrier PLL. A larger transient can slip the loop into the neighbouring stable point $180^\circ$ away.</li>
</ul>
<div class="callout"><strong>Why two stable points matter:</strong> the S-curve is $180^\circ$-periodic, so the loop physically cannot tell $\hat\phi$ from $\hat\phi+180^\circ$. Both make the I arm maximal and the Q arm zero; both demodulate BPSK perfectly except that the recovered bit stream may be wholesale inverted. Resolving which one you are in is a separate, data-layer problem.</div>`
      },
      {
        h: 'Phase ambiguity and how to resolve it',
        html: String.raw`<p>Every suppressed-carrier tracker inherits a <strong>phase ambiguity</strong> equal to $360^\circ/M$ for an $M$-phase constellation: $180^\circ$ for BPSK ($M=2$), $90^\circ$ for QPSK ($M=4$). The loop locks correctly and demodulates correctly, but it has no way to know the <em>absolute</em> phase datum, so the recovered data may be rotated by a multiple of the symbol spacing — for BPSK that means every bit may be inverted; for QPSK the I and Q bit pairs may be swapped and/or inverted. The ambiguity is fundamental (it comes from the modulation's own symmetry) and must be broken at a higher layer. Two standard remedies:</p>
<ul>
<li><strong>Differential encoding.</strong> Encode information in the <em>change</em> between successive symbols rather than their absolute phase. A constant $180^\circ$ (or $90^\circ$) offset on every symbol leaves the symbol-to-symbol <em>differences</em> unchanged, so a differential decoder recovers the data regardless of which stable point the loop chose. This costs a small BER penalty (an error tends to affect two adjacent decisions) but needs no overhead bits and self-corrects after a cycle slip.</li>
<li><strong>Unique word / preamble.</strong> Transmit a known synchronization pattern (a "unique word" or pilot preamble). The receiver correlates its de-rotated data against the known pattern; if it matches the inverted pattern, the receiver flips its phase reference (or its output bits) by the ambiguity. This gives absolute phase with no per-symbol penalty, at the cost of overhead and a re-check after any loss of lock.</li>
</ul>
<table class="data">
<tr><th>Modulation</th><th>$M$</th><th>Ambiguity $360^\circ/M$</th><th>Recovery nonlinearity</th></tr>
<tr><td>BPSK</td><td>2</td><td>$180^\circ$</td><td>Squaring / $\sin(2\Delta\phi)$ Costas</td></tr>
<tr><td>QPSK</td><td>4</td><td>$90^\circ$</td><td>Fourth power / $\sin(4\Delta\phi)$</td></tr>
<tr><td>8-PSK</td><td>8</td><td>$45^\circ$</td><td>Eighth power / decision-directed</td></tr>
</table>`
      },
      {
        h: 'Loop SNR and steady-state phase jitter',
        html: String.raw`<p>Once locked, the reference is not perfect: noise leaks through the loop and makes $\hat\phi$ jitter around the true phase. The governing quantity is the <strong>loop signal-to-noise ratio</strong></p>
<p>$$\rho_L=\frac{C}{N_0\,B_L},$$</p>
<p>where $C$ is the carrier (signal) power, $N_0$ the one-sided noise density, and $B_L$ the one-sided loop noise bandwidth in Hz. A narrow $B_L$ passes less noise and raises $\rho_L$; a wide $B_L$ tracks faster dynamics but lowers $\rho_L$. For a first-order (or high-gain second-order) tracking loop the <strong>steady-state phase-error variance</strong> is</p>
<p>$$\sigma_\phi^2=\frac{1}{2\rho_L}=\frac{N_0 B_L}{2C}\quad\text{(clean carrier)},$$</p>
<p>and a suppressed-carrier loop makes it worse: the variance is <em>divided</em> by the <strong>squaring-loss factor</strong> $S_L\le1$ — equivalently, multiplied by the inflation bracket $(1+1/2\rho_i)\ge1$:</p>
<p>$$\sigma_\phi^2=\frac{1}{2\rho_L\,S_L}\ \text{ where }\ S_L=\frac{1}{1+\dfrac{1}{2\,\rho_i}}\le1\ \Rightarrow\ \sigma_\phi^2=\frac{1}{2\rho_L}\Big(1+\frac{1}{2\rho_i}\Big),$$</p>
<p>with $\rho_i$ the SNR in the arm (predetection) bandwidth. The bracket $(1+1/2\rho_i)$ is the price of the nonlinearity: at high arm SNR it tends to 1 (no penalty) and at low SNR it blows up, which is exactly why suppressed-carrier tracking struggles on weak signals. The $\sqrt{}$ of the variance, $\sigma_\phi$, is the RMS phase jitter that rotates the constellation.</p>
<div class="callout tip"><strong>Tip:</strong> $\rho_L$ (loop SNR) sets how quiet the reference is; $\rho_i$ (arm SNR) sets how badly the squarer/Costas nonlinearity degrades it. Design pushes $\rho_L$ up with a narrow $B_L$ and pushes $\rho_i$ up with a matched arm-filter bandwidth — but a narrower $B_L$ also slows the loop, the usual bandwidth trade.</div>`
      },
      {
        h: 'Frequency offset, static phase error, and cycle slips',
        html: String.raw`<p>Real oscillators and Doppler leave a residual <strong>frequency offset</strong> $\Delta f$ between transmitter and receiver. A <strong>type-1 (first-order) loop</strong> can hold lock on a constant $\Delta f$ only by sitting at a <em>non-zero static phase error</em> — it must lean into the S-curve to generate the DC error voltage that keeps the VCO running fast enough. Setting the loop's error term equal to the frequency stress gives the static phase error</p>
<p>$$\sin(2\Delta\phi_{ss})=\frac{2\pi\,\Delta f}{K}\ \Rightarrow\ \Delta\phi_{ss}\approx\frac{\pi\,\Delta f}{K}\ \text{(small error)},$$</p>
<p>where $K$ is the loop gain (rad/s per rad of error). If the frequency stress exceeds the loop's pull range — when $2\pi\Delta f>K$, so the required $\sin(2\Delta\phi_{ss})>1$ — <strong>lock is impossible</strong>. This is why a plain phase loop is often preceded by a frequency-locked loop (FLL) or a frequency sweep to reduce $\Delta f$ before the phase loop takes over. A <strong>type-2 (second-order) loop</strong> adds an integrator that supplies the steady VCO offset, driving the <em>static</em> phase error for a constant $\Delta f$ to zero — the standard choice when Doppler must be tracked with no bias.</p>
<p>Even in lock, noise occasionally pushes $\Delta\phi$ past an unstable point ($\pm90^\circ$ from lock, halfway to the next stable point). The loop then <strong>cycle-slips</strong> — it jumps to the adjacent stable phase, typically $180^\circ$ away for BPSK — inverting the data until a differential decoder or unique word re-syncs. Slip rate rises steeply as $\rho_L$ falls; a robust design keeps $\rho_L$ high enough (often $\rho_L\gtrsim 10$ to $15$ dB) that slips are rare over the message duration.</p>`
      },
      {
        h: 'Phase jitter, constellation rotation, and BER cost',
        html: String.raw`<p>The RMS jitter $\sigma_\phi$ has a direct, visible effect: it <strong>rotates the constellation</strong>. Each received symbol appears at its ideal location rotated by the instantaneous phase error, so a tight constellation smears into arcs. Two consequences follow.</p>
<p><strong>Signal loss.</strong> A phase error $\Delta\phi$ scales the in-phase (matched-filter) output by $\cos\Delta\phi$, so the effective bit energy drops to $E_b\cos^2\Delta\phi$. For BPSK the conditional error probability becomes $Q(\sqrt{2E_b/N_0}\,\cos\Delta\phi)$; averaging over the jitter distribution raises the mean BER above the ideal $Q(\sqrt{2E_b/N_0})$. A small residual — say $\sigma_\phi=10^\circ$ — costs only a few tenths of a dB, but the penalty grows fast as $\sigma_\phi$ approaches $30^\circ$ because $\cos^2$ falls and the tails of the jitter distribution reach toward the $90^\circ$ cliff.</p>
<p><strong>Cross-rail leakage (QPSK/QAM).</strong> Rotation spills energy from the I rail into the Q rail (and vice-versa), so the two bit streams interfere; a $\Delta\phi$ that merely scales BPSK actively creates errors in QPSK. This is why higher-order modulations demand tighter carrier tracking (larger $\rho_L$, narrower $B_L$) than BPSK for the same target BER.</p>
<p>The practical rule: budget the carrier loop so that $\sigma_\phi$ is small enough that the implementation loss (extra dB of $E_b/N_0$ needed to hit the target BER) stays within the link margin — often a few degrees RMS for QAM, a bit looser for BPSK. Everything upstream — arm-filter bandwidth, loop bandwidth $B_L$, loop order, and input $C/N_0$ — feeds into that single number $\sigma_\phi$.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>Coherent carrier tracking is the machinery that manufactures the phase reference coherent demodulation depends on. You should now be able to say:</p>
<ul>
<li><strong>The motivation:</strong> coherent detection is ~1 dB better than DBPSK, several dB better than non-coherent, and mandatory for QAM — but a phase error $\Delta\phi$ scales the signal by $\cos\Delta\phi$, so the reference must be accurate.</li>
<li><strong>The problem:</strong> BPSK/QPSK are suppressed-carrier — the data cancels any line at $f_c$, so a plain PLL has nothing to lock to; carrier recovery is a nonlinear-processing problem.</li>
<li><strong>The squaring loop:</strong> squaring gives $\cos^2(\omega_c t)$ with a data-independent tone at $2f_c$; lock a PLL there and divide by two to recover the carrier, inheriting a $180^\circ$ ambiguity and a squaring loss.</li>
<li><strong>The Costas loop:</strong> I and Q arms whose product yields a data-independent error $\propto\sin(2\Delta\phi)$ — the squaring operation done at baseband, with identical performance and the same ambiguity; QPSK uses a fourth-power/decision-directed variant.</li>
<li><strong>Ambiguity and jitter:</strong> the $360^\circ/M$ ambiguity is resolved by differential encoding or a unique word; the residual jitter obeys $\sigma_\phi^2=1/(2\rho_L)$ times a squaring-loss factor, with $\rho_L=C/(N_0 B_L)$.</li>
<li><strong>The consequences:</strong> a frequency offset forces a static phase error in a type-1 loop (zero in type-2); noise causes cycle slips; and phase jitter rotates the constellation, costing BER through the $\cos^2\Delta\phi$ energy loss and cross-rail leakage.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Carrier_recovery" target="_blank" rel="noopener">Wikipedia — Carrier recovery</a> — broad, well-referenced overview of suppressed-carrier recovery covering the multiply-filter-divide (squaring) method, the Costas loop, decision-directed recovery, and the $360^\circ/M$ phase ambiguity with its remedies.</li>
<li><a href="https://en.wikipedia.org/wiki/Costas_loop" target="_blank" rel="noopener">Wikipedia — Costas loop</a> — focused article deriving the I/Q phase detector, the $\sin(2(\theta_i-\theta_f))$ error voltage and its doubled sensitivity, the classical block diagram, frequency acquisition, and the QPSK Costas variant.</li>
<li><a href="https://descanso.jpl.nasa.gov/monograph/series9/Descanso9_08_rev.pdf" target="_blank" rel="noopener">NASA/JPL DESCANSO — Carrier Synchronization (Simon &amp; Hamkins, Ch. 8)</a> — a rigorous deep-space-communications monograph chapter deriving squaring and Costas loops, loop SNR, squaring loss, phase-error variance, and cycle-slip statistics from first principles.</li>
<li><a href="https://wirelesspi.com/costas-loop-for-carrier-phase-synchronization/" target="_blank" rel="noopener">Wireless Pi — Costas Loop for Carrier Phase Synchronization</a> — an intuition-first tutorial with full baseband math, block diagrams, and a working software-radio implementation showing the error signal $-\tfrac12 v_I^2\sin(2\Delta\phi)$ and the stable lock point.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Coherent demodulation needs a local reference locked to the carrier in frequency and phase; a phase error $\Delta\phi$ scales the decision statistic by $\cos\Delta\phi$ (and energy by $\cos^2\Delta\phi$).`,
      String.raw`Coherent BPSK is ~1 dB better than DBPSK and several dB better than non-coherent detection, and coherence is mandatory for high-order QAM.`,
      String.raw`BPSK $\pm A\cos(\omega_c t)$ is suppressed-carrier: the $\pm$ data averages the carrier line at $f_c$ to zero, so a plain PLL has no sinusoid to lock to.`,
      String.raw`Squaring loop: $s^2(t)=\tfrac{A^2}{2}+\tfrac{A^2}{2}\cos(2\omega_c t)$ because $d^2=1$ and $\cos^2=\tfrac12(1+\cos 2\omega_c t)$, giving a data-free tone at $2f_c$.`,
      String.raw`Squaring-loop chain: square $\to$ bandpass at $2f_c$ $\to$ PLL $\to$ divide-by-two $\to$ recovered carrier at $f_c$.`,
      String.raw`Costas loop: I arm $\tfrac{A}{2}d\cos\Delta\phi$, Q arm $\tfrac{A}{2}d\sin\Delta\phi$; their product $e=\tfrac{A^2}{8}\sin(2\Delta\phi)$ is data-independent.`,
      String.raw`The Costas loop is the squaring operation done at baseband, so it has identical performance to the squaring loop (same S-curve, ambiguity, squaring loss).`,
      String.raw`The S-curve $\sin(2\Delta\phi)$ has stable (positive-slope, restoring) zeros at $0^\circ$ and $180^\circ$ and unstable (negative-slope) zeros at $\pm90^\circ$; near-lock gain is double a residual-carrier PLL.`,
      String.raw`Every $M$-phase suppressed-carrier tracker has a $360^\circ/M$ ambiguity: $180^\circ$ for BPSK, $90^\circ$ for QPSK.`,
      String.raw`The ambiguity is resolved by differential encoding (self-correcting, no overhead bits) or by a unique word / preamble (absolute phase, needs overhead).`,
      String.raw`Loop SNR $\rho_L=C/(N_0 B_L)$; steady-state phase-error variance $\sigma_\phi^2=1/(2\rho_L)$ for a clean carrier.`,
      String.raw`Suppressed-carrier loops multiply the variance by a squaring-loss bracket $(1+1/2\rho_i)$; negligible at high arm SNR $\rho_i$, dominant at low SNR.`,
      String.raw`A type-1 loop tracks a constant frequency offset $\Delta f$ only via a static phase error $\sin(2\Delta\phi_{ss})=2\pi\Delta f/K$; a type-2 loop drives it to zero.`,
      String.raw`Phase jitter $\sigma_\phi$ rotates the constellation; it costs BER through the $\cos^2\Delta\phi$ energy loss and, for QPSK/QAM, cross-rail leakage, and low $\rho_L$ causes cycle slips.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="coherent-carrier-tracking-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="250" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Squaring loop: recover a suppressed carrier via a line at $2f_c$</text>
<line x1="10" y1="120" x2="46" y2="120" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#coherent-carrier-tracking-a1)"/>
<text x="6" y="112" fill="#9aa7b5" font-size="10">$\pm A\cos\omega_c t$</text>
<rect x="46" y="104" width="52" height="32" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="58" y="124" fill="#e6edf3" font-size="12">$(\cdot)^2$</text>
<line x1="98" y1="120" x2="134" y2="120" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#coherent-carrier-tracking-a1)"/>
<rect x="134" y="100" width="66" height="40" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/><text x="142" y="116" fill="#e6edf3" font-size="9">BPF</text><text x="142" y="131" fill="#9aa7b5" font-size="9">$2f_c$</text>
<line x1="200" y1="120" x2="236" y2="120" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#coherent-carrier-tracking-a1)"/>
<text x="196" y="112" fill="#63e6be" font-size="9">tone $2f_c$</text>
<rect x="236" y="100" width="70" height="40" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="254" y="124" fill="#e6edf3" font-size="10">PLL</text>
<line x1="306" y1="120" x2="342" y2="120" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#coherent-carrier-tracking-a1)"/>
<rect x="342" y="100" width="70" height="40" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/><text x="352" y="116" fill="#e6edf3" font-size="10">$\div 2$</text><text x="350" y="131" fill="#9aa7b5" font-size="8">$180^\circ$ ambig.</text>
<line x1="412" y1="120" x2="454" y2="120" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#coherent-carrier-tracking-a1)"/>
<text x="428" y="112" fill="#ffa94d" font-size="9">$\cos(\omega_c t+\hat\phi)$</text>
<text x="46" y="176" fill="#9aa7b5" font-size="10">$s^2=\tfrac{A^2}{2}+\tfrac{A^2}{2}\cos 2\omega_c t$  ($d^2=1$ removes the data)</text>
<text x="46" y="196" fill="#9aa7b5" font-size="10">Squaring multiplies signal$\times$noise: squaring loss degrades the recovered-tone SNR.</text>
</svg>`,
        caption: 'Squaring loop: squaring the BPSK signal removes the data (d^2=1) and produces a pure tone at 2f_c. A bandpass filter isolates it, a PLL locks it, and a divide-by-two recovers the carrier at f_c — introducing a 180-degree phase ambiguity and a squaring loss.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="coherent-carrier-tracking-a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Costas loop: I and Q arms, error $e=I\cdot Q\propto\sin 2\Delta\phi$</text>
<line x1="10" y1="130" x2="52" y2="130" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#coherent-carrier-tracking-a2)"/>
<text x="6" y="122" fill="#9aa7b5" font-size="9">$A d\cos(\omega_c t+\phi)$</text>
<!-- I arm -->
<circle cx="80" cy="70" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="74" y="75" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="110" y="58" width="56" height="24" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="122" y="74" fill="#e6edf3" font-size="9">LPF</text>
<text x="172" y="66" fill="#63e6be" font-size="9">$I=\tfrac{A}{2}d\cos\Delta\phi$</text>
<!-- Q arm -->
<circle cx="80" cy="190" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="74" y="195" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="110" y="178" width="56" height="24" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="122" y="194" fill="#e6edf3" font-size="9">LPF</text>
<text x="172" y="186" fill="#63e6be" font-size="9">$Q=\tfrac{A}{2}d\sin\Delta\phi$</text>
<!-- split input -->
<line x1="52" y1="130" x2="52" y2="70" stroke="#9aa7b5" stroke-width="1.1"/><line x1="52" y1="70" x2="68" y2="70" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#coherent-carrier-tracking-a2)"/>
<line x1="52" y1="130" x2="52" y2="190" stroke="#9aa7b5" stroke-width="1.1"/><line x1="52" y1="190" x2="68" y2="190" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#coherent-carrier-tracking-a2)"/>
<line x1="92" y1="70" x2="110" y2="70" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#coherent-carrier-tracking-a2)"/>
<line x1="92" y1="190" x2="110" y2="190" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#coherent-carrier-tracking-a2)"/>
<!-- multiplier of arms -->
<circle cx="300" cy="130" r="14" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.5"/><text x="293" y="135" fill="#e6edf3" font-size="12">$\times$</text>
<line x1="234" y1="66" x2="300" y2="118" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#coherent-carrier-tracking-a2)"/>
<line x1="234" y1="186" x2="300" y2="142" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#coherent-carrier-tracking-a2)"/>
<line x1="314" y1="130" x2="350" y2="130" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#coherent-carrier-tracking-a2)"/>
<text x="316" y="122" fill="#b197fc" font-size="9">$\sin 2\Delta\phi$</text>
<rect x="350" y="114" width="66" height="32" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="356" y="134" fill="#e6edf3" font-size="9">loop filt.</text>
<rect x="428" y="114" width="66" height="32" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/><text x="446" y="134" fill="#e6edf3" font-size="10">VCO</text>
<line x1="416" y1="130" x2="428" y2="130" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#coherent-carrier-tracking-a2)"/>
<line x1="461" y1="146" x2="461" y2="230" stroke="#9aa7b5" stroke-width="1.1"/><line x1="461" y1="230" x2="80" y2="230" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="80" y1="230" x2="80" y2="202" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#coherent-carrier-tracking-a2)"/>
<text x="150" y="245" fill="#9aa7b5" font-size="9">VCO feeds $\cos$ to I arm and $-\sin$ (90$^\circ$) to Q arm</text>
<text x="86" y="98" fill="#9aa7b5" font-size="8">I: demod data (feeds decisions)</text>
</svg>`,
        caption: 'Costas loop: quadrature I and Q arms multiply the input by cos and -sin of the VCO, lowpass filter, then multiply the two arms. The data cancels (d^2=1), leaving an error e = (A^2/8) sin(2 delta-phi) that drives the loop filter and VCO to zero phase error. The I arm is the demodulated data.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Phase-detector S-curve $\sin(2\Delta\phi)$ and constellation jitter</text>
<!-- S-curve axes -->
<line x1="40" y1="120" x2="300" y2="120" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="170" y1="45" x2="170" y2="195" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="4 3"/>
<text x="292" y="136" fill="#9aa7b5" font-size="9">$\Delta\phi$</text>
<text x="176" y="56" fill="#9aa7b5" font-size="9">$e$</text>
<!-- sin(2 dphi): period 180 deg; one full sine over -90..+90 mapped 60..280 px -->
<path d="M60,120 C80,70 100,70 115,120 C130,170 150,170 170,120 C190,70 210,70 225,120 C240,170 260,170 280,120" fill="none" stroke="#63e6be" stroke-width="2"/>
<circle cx="170" cy="120" r="4" fill="#ffa94d"/><text x="150" y="146" fill="#ffa94d" font-size="8">$0^\circ$ stable</text>
<circle cx="60" cy="120" r="3.5" fill="#ffa94d"/><text x="40" y="112" fill="#ffa94d" font-size="8">$-180^\circ$ st.</text>
<circle cx="280" cy="120" r="3.5" fill="#ffa94d"/><text x="262" y="112" fill="#ffa94d" font-size="8">$180^\circ$ st.</text>
<circle cx="115" cy="120" r="3.5" fill="#ff6b6b"/><text x="96" y="150" fill="#ff6b6b" font-size="8">$-90^\circ$ unst.</text>
<circle cx="225" cy="120" r="3.5" fill="#ff6b6b"/><text x="208" y="150" fill="#ff6b6b" font-size="8">$90^\circ$ unst.</text>
<!-- constellation with rotation -->
<text x="360" y="48" fill="#e6edf3" font-size="11">BPSK constellation</text>
<line x1="330" y1="140" x2="490" y2="140" stroke="#9aa7b5" stroke-width="1"/>
<line x1="410" y1="70" x2="410" y2="210" stroke="#9aa7b5" stroke-width="1"/>
<circle cx="465" cy="140" r="4" fill="#4dabf7"/><circle cx="355" cy="140" r="4" fill="#4dabf7"/>
<!-- rotated jitter arcs -->
<path d="M455,118 A56,56 0 0 0 455,162" fill="none" stroke="#ff6b6b" stroke-width="2"/>
<path d="M365,162 A56,56 0 0 0 365,118" fill="none" stroke="#ff6b6b" stroke-width="2"/>
<text x="352" y="230" fill="#9aa7b5" font-size="9">jitter $\sigma_\phi$ rotates points into arcs; energy $\to E_b\cos^2\Delta\phi$</text>
<text x="40" y="220" fill="#9aa7b5" font-size="9">Stable at $0^\circ,180^\circ$ (both lock $\Rightarrow$ $180^\circ$ ambiguity); linear span $\pm45^\circ$.</text>
</svg>`,
        caption: 'Left: the sin(2 delta-phi) phase-detector S-curve, with stable positive-slope (restoring) lock points at 0 and 180 degrees (source of the 180-degree ambiguity) and unstable points at +/-90 degrees; the linear region spans only +/-45 degrees. Right: residual phase jitter sigma_phi rotates the BPSK constellation points into arcs, reducing effective energy to E_b cos^2(delta-phi).'
      }
    ],
    equations: [
      {
        title: 'Squaring Reveals a Line at Twice the Carrier',
        tex: String.raw`$$s^2(t)=\tfrac{A^2}{2}+\tfrac{A^2}{2}\cos(2\omega_c t)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Take a BPSK signal $s(t)=A\,d(t)\cos(\omega_c t)$ with data $d(t)=\pm1$ and no discrete carrier line at $f_c$. We want to process it so that a data-independent sinusoid appears that a PLL can lock to.</p>
<p><b>Step 1.</b> Pass $s(t)$ through a square-law device: $s^2(t)=A^2 d^2(t)\cos^2(\omega_c t)$. Because $d(t)$ only ever takes the values $+1$ or $-1$, its square is $d^2(t)=1$ for all $t$ — the data modulation is annihilated by the squaring.</p>
<p><b>Step 2.</b> Apply the power-reduction identity $\cos^2\theta=\tfrac12+\tfrac12\cos(2\theta)$ with $\theta=\omega_c t$: $s^2(t)=A^2\big(\tfrac12+\tfrac12\cos(2\omega_c t)\big)$.</p>
<p><b>Result.</b> $s^2(t)=\tfrac{A^2}{2}+\tfrac{A^2}{2}\cos(2\omega_c t)$: a DC term plus a pure, unmodulated tone at $2f_c$ whose phase is exactly twice the carrier phase and is independent of the data. A bandpass filter isolates this tone, a PLL locks it, and a divide-by-two recovers a coherent reference at $f_c$. The doubling is what makes the two data phases ($0^\circ$ and $180^\circ$) coincide (at $0^\circ$ and $360^\circ$), which is precisely why the modulation vanishes.</p>`
      },
      {
        title: 'Costas Loop I and Q Arm Outputs',
        tex: String.raw`$$I=\tfrac{A}{2}d(t)\cos\Delta\phi,\qquad Q=\tfrac{A}{2}d(t)\sin\Delta\phi$$`,
        derivation: String.raw`<p><b>Where we start.</b> The received signal is $r(t)=A\,d(t)\cos(\omega_c t+\phi)$; the VCO produces $\cos(\omega_c t+\hat\phi)$ for the I arm and $-\sin(\omega_c t+\hat\phi)$ for the Q arm. Define the phase error $\Delta\phi=\phi-\hat\phi$.</p>
<p><b>Step 1.</b> Multiply in the I arm: $r(t)\cos(\omega_c t+\hat\phi)=A d\cos(\omega_c t+\phi)\cos(\omega_c t+\hat\phi)$. Use $\cos X\cos Y=\tfrac12[\cos(X-Y)+\cos(X+Y)]$, giving $\tfrac{A}{2}d\big[\cos\Delta\phi+\cos(2\omega_c t+\phi+\hat\phi)\big]$.</p>
<p><b>Step 2.</b> The lowpass filter removes the $2\omega_c$ term, leaving $I=\tfrac{A}{2}d\cos\Delta\phi$. Repeat for the Q arm: $r(t)\cdot[-\sin(\omega_c t+\hat\phi)]$ uses $\cos X\sin Y=\tfrac12[\sin(X+Y)-\sin(X-Y)]$; after lowpass filtering the double-frequency term the surviving baseband term is $Q=\tfrac{A}{2}d\sin\Delta\phi$.</p>
<p><b>Result.</b> $I=\tfrac{A}{2}d\cos\Delta\phi$ and $Q=\tfrac{A}{2}d\sin\Delta\phi$. When locked ($\Delta\phi\to0$) the I arm carries the full demodulated data and Q collapses to zero, which is why the I arm feeds the data slicer and the Q arm signals residual phase error. These two arms are the raw material the phase detector multiplies together.</p>`
      },
      {
        title: 'Costas Phase-Detector Error (Data Cancels)',
        tex: String.raw`$$e=I\cdot Q=\tfrac{A^2}{8}\sin(2\Delta\phi)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Take the two Costas arm outputs $I=\tfrac{A}{2}d\cos\Delta\phi$ and $Q=\tfrac{A}{2}d\sin\Delta\phi$. The Costas phase detector forms their product $e=I\cdot Q$; we want to show this product is independent of the data.</p>
<p><b>Step 1.</b> Multiply: $e=\big(\tfrac{A}{2}d\cos\Delta\phi\big)\big(\tfrac{A}{2}d\sin\Delta\phi\big)=\tfrac{A^2}{4}d^2\cos\Delta\phi\sin\Delta\phi$.</p>
<p><b>Step 2.</b> Two simplifications: the data satisfies $d^2(t)=1$ (since $d=\pm1$), so it drops out entirely; and the double-angle identity $2\sin\theta\cos\theta=\sin 2\theta$ gives $\cos\Delta\phi\sin\Delta\phi=\tfrac12\sin(2\Delta\phi)$.</p>
<p><b>Result.</b> $e=\tfrac{A^2}{4}\cdot\tfrac12\sin(2\Delta\phi)=\tfrac{A^2}{8}\sin(2\Delta\phi)$ — a clean, odd, data-independent function of the phase error. This is exactly the S-curve of the squaring loop, confirming the two structures are theoretically identical: the $I\cdot Q$ product is the squaring operation carried out at baseband. The loop filter and VCO drive this error to a stable zero at $\Delta\phi=0$ (or $180^\circ$), completing the phase lock.</p>`
      },
      {
        title: 'Loop Signal-to-Noise Ratio',
        tex: String.raw`$$\rho_L=\frac{C}{N_0\,B_L}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The recovered reference is corrupted by the noise that the tracking loop passes. We want a single figure of merit — the loop SNR $\rho_L$ — that predicts how quiet the reference is, in terms of carrier power $C$, one-sided noise density $N_0$, and the loop's noise bandwidth $B_L$.</p>
<p><b>Step 1.</b> The useful quantity driving the loop is the carrier power $C$ (watts). The noise that competes with it is the white noise $N_0$ (W/Hz) that falls inside the frequencies the closed loop actually responds to. That effective band is the one-sided loop noise bandwidth $B_L$ (Hz), defined so that white noise of density $N_0$ contributes a total in-loop noise power of $N_0 B_L$.</p>
<p><b>Step 2.</b> Form the ratio of in-loop signal power to in-loop noise power: $\rho_L=C/(N_0 B_L)$. A narrower $B_L$ admits proportionally less noise and raises $\rho_L$; a wider $B_L$ admits more noise (but tracks faster dynamics), lowering $\rho_L$ — the fundamental bandwidth trade.</p>
<p><b>Result.</b> $\rho_L=C/(N_0 B_L)$ is the loop SNR, the master parameter of tracking-loop performance. It sets the phase-error variance directly (next equation), governs the cycle-slip rate, and is the knob a designer turns via $B_L$. Note $C/N_0$ (in Hz) is often quoted in dB-Hz; convert with $C/N_0=10^{(C/N_0)_{\mathrm{dB}}/10}$ before dividing by $B_L$.</p>`
      },
      {
        title: 'Steady-State Phase-Error Variance',
        tex: String.raw`$$\sigma_\phi^2=\frac{1}{2\rho_L}=\frac{N_0 B_L}{2C}$$`,
        derivation: String.raw`<p><b>Where we start.</b> With loop SNR $\rho_L=C/(N_0 B_L)$, noise makes the tracked phase $\hat\phi$ jitter about the true phase. We want the variance $\sigma_\phi^2$ of that phase error for a linearized (high-SNR) tracking loop.</p>
<p><b>Step 1.</b> Refer the additive noise to an equivalent <em>phase</em> noise on the carrier. Write the carrier as $\sqrt{2C}\cos(\omega_c t+\phi)$ and the bandpass noise as $n_c\cos-n_s\sin$; for small angles only the quadrature component matters, and it perturbs the carrier phase by $n_s(t)/\sqrt{2C}$. Since $n_s$ has one-sided density $N_0$, the equivalent phase noise has flat one-sided spectral density $S_\phi(f)=N_0/(2C)$ rad$^2$/Hz.</p>
<p><b>Step 2.</b> Near lock the detector is linear ($e\approx K_d\,\Delta\phi$), so the loop passes this phase noise through its closed-loop response $H(f)$. The one-sided loop noise bandwidth is <em>defined</em> as $B_L=\int_0^\infty|H(f)|^2\,df$, so the output variance is $\sigma_\phi^2=\int_0^\infty S_\phi(f)|H(f)|^2\,df=\dfrac{N_0}{2C}B_L=\dfrac{1}{2\rho_L}$ with $\rho_L=C/(N_0 B_L)$.</p>
<p><b>Result.</b> $\sigma_\phi^2=1/(2\rho_L)=N_0 B_L/(2C)$ radians$^2$. Jitter falls as $\sqrt{B_L}$ (narrow loop) and as $1/\sqrt{C/N_0}$ (strong signal). This is the <em>clean-carrier</em> result for an ordinary PLL; a suppressed-carrier squaring/Costas loop inflates it by the squaring-loss factor derived next. The RMS value $\sigma_\phi$ is what rotates the constellation and drives the BER penalty.</p>`
      },
      {
        title: 'Squaring Loss Factor',
        tex: String.raw`$$\sigma_\phi^2=\frac{1}{2\rho_L}\Big(1+\frac{1}{2\rho_i}\Big),\qquad S_L=\frac{1}{1+\dfrac{1}{2\rho_i}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A suppressed-carrier loop must square (or form the $I\cdot Q$ product) to remove the data. Squaring is nonlinear: it mixes signal with noise and noise with itself, injecting extra noise absent in a clean PLL. We correct the phase-error variance for this squaring loss, using the arm (predetection) SNR $\rho_i$.</p>
<p><b>Step 1.</b> Write the squared signal schematically as $(s+n)^2=s^2+2sn+n^2$. The wanted term is $s^2$; the cross term $2sn$ is signal$\times$noise (reproducing the ordinary loop noise) and $n^2$ is noise$\times$noise, a purely nonlinear penalty. Referred to the recovered tone, these extra terms reduce the effective SNR by a factor $S_L\le1$.</p>
<p><b>Step 2.</b> Carrying the noise bookkeeping through the squarer gives $S_L=1/\big(1+1/(2\rho_i)\big)$, where $\rho_i$ is the SNR in the arm/predetection bandwidth. The effective loop SNR becomes $\rho_L S_L$, so the variance is $\sigma_\phi^2=1/(2\rho_L S_L)=\tfrac{1}{2\rho_L}\big(1+1/(2\rho_i)\big)$.</p>
<p><b>Result.</b> The bracket $(1+1/2\rho_i)$ is the squaring-loss inflation of the phase jitter. At high arm SNR ($\rho_i\gg1$) it tends to 1 and the suppressed-carrier loop matches a clean PLL; at low $\rho_i$ it grows without bound, which is why squaring/Costas loops degrade sharply on weak signals and why designers widen the arm filter only as far as noise allows, or switch to decision-directed recovery that avoids the raw $n^2$ term.</p>`
      },
      {
        title: 'Type-1 Loop Static Phase Error from a Frequency Offset',
        tex: String.raw`$$\sin(2\Delta\phi_{ss})=\frac{2\pi\,\Delta f}{K}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A first-order (type-1) tracking loop has no integrator, so its VCO frequency correction is proportional to the instantaneous phase-detector output. If the incoming carrier is offset by a constant $\Delta f$ (Hz) from the VCO's rest frequency, the loop must generate a steady correction to keep up — and it can do so only by sitting at a non-zero phase error.</p>
<p><b>Step 1.</b> The VCO frequency deviation is $K$ times the phase-detector output, where $K$ (rad/s) is the loop gain. For the suppressed-carrier detector the output is $\propto\sin(2\Delta\phi)$, so the sustained frequency correction the loop can produce is $K\sin(2\Delta\phi)/(2\pi)$ in Hz (dividing by $2\pi$ to convert rad/s to Hz).</p>
<p><b>Step 2.</b> In steady state this correction must exactly equal the frequency stress $\Delta f$: $\dfrac{K}{2\pi}\sin(2\Delta\phi_{ss})=\Delta f$. Rearranging, $\sin(2\Delta\phi_{ss})=2\pi\Delta f/K$. For small errors $\sin(2\Delta\phi_{ss})\approx2\Delta\phi_{ss}$, so $\Delta\phi_{ss}\approx\pi\Delta f/K$.</p>
<p><b>Result.</b> A type-1 loop tracks a constant frequency offset only by leaning into the S-curve at $\Delta\phi_{ss}$. If $2\pi\Delta f>K$ the required $\sin(2\Delta\phi_{ss})$ exceeds 1 and <b>lock is impossible</b> — the loop's pull range is exceeded, motivating an FLL or frequency sweep beforehand. A type-2 loop adds an integrator that supplies the steady VCO offset internally, driving the static phase error to zero for a constant $\Delta f$.</p>`
      },
      {
        title: 'BER Degradation from Residual Phase Error',
        tex: String.raw`$$P_b(\Delta\phi)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\,\cos\Delta\phi\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Coherent BPSK detection projects the received signal onto the recovered carrier direction. If the reference is off by $\Delta\phi$, that projection is imperfect; we want the resulting bit-error probability as a function of $\Delta\phi$, starting from the ideal $P_b=Q(\sqrt{2E_b/N_0})$.</p>
<p><b>Step 1.</b> The matched-filter / correlator output for a symbol $\pm A$ is scaled by the cosine of the phase mismatch: the in-phase component that survives is $A\cos\Delta\phi$, while the orthogonal part $A\sin\Delta\phi$ is rejected by the I-arm integrator. So the <em>effective</em> signal amplitude is reduced by the factor $\cos\Delta\phi$.</p>
<p><b>Step 2.</b> Reducing signal amplitude by $\cos\Delta\phi$ reduces the effective bit energy to $E_b\cos^2\Delta\phi$ while the noise density $N_0$ is unchanged. Substituting into the ideal BPSK formula $Q(\sqrt{2E_b/N_0})$ replaces $E_b$ by $E_b\cos^2\Delta\phi$: $P_b(\Delta\phi)=Q\big(\sqrt{2E_b/N_0}\cos\Delta\phi\big)$.</p>
<p><b>Result.</b> The conditional BER is $Q(\sqrt{2E_b/N_0}\,\cos\Delta\phi)$; the average BER is this expression integrated over the phase-jitter distribution of $\Delta\phi$. A small RMS jitter costs only tenths of a dB (since $\cos^2\Delta\phi\approx1$ for small $\Delta\phi$), but the penalty accelerates as $\Delta\phi$ grows because $\cos^2$ drops steeply and the jitter tails approach the $90^\circ$ null where the signal vanishes entirely — the quantitative reason carrier tracking must keep $\sigma_\phi$ small, especially for QAM.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Why is coherent detection worth the effort of carrier recovery?`, back: String.raw`It is optimal in AWGN — ~1 dB better than DBPSK, several dB better than non-coherent, and mandatory for QAM where information is in amplitude and phase.` },
      { front: String.raw`How does a phase error $\Delta\phi$ affect a coherent detector?`, back: String.raw`It scales the decision statistic by $\cos\Delta\phi$ (energy by $\cos^2\Delta\phi$); a $90^\circ$ error erases the signal.` },
      { front: String.raw`Why can't a plain PLL lock to a BPSK signal?`, back: String.raw`BPSK is suppressed-carrier: the $\pm1$ data makes the carrier average to zero, so there is no discrete spectral line at $f_c$ to lock to.` },
      { front: String.raw`What does squaring a BPSK signal produce?`, back: String.raw`$s^2=\tfrac{A^2}{2}+\tfrac{A^2}{2}\cos(2\omega_c t)$: the data cancels ($d^2=1$) leaving a pure tone at $2f_c$.` },
      { front: String.raw`Give the squaring-loop block chain.`, back: String.raw`Square $\to$ bandpass at $2f_c$ $\to$ PLL $\to$ divide-by-two $\to$ recovered carrier at $f_c$.` },
      { front: String.raw`Write the Costas loop I and Q arm outputs.`, back: String.raw`$I=\tfrac{A}{2}d\cos\Delta\phi$ (demodulated data), $Q=\tfrac{A}{2}d\sin\Delta\phi$ (near zero when locked).` },
      { front: String.raw`What is the Costas phase-detector error, and why is it useful?`, back: String.raw`$e=I\cdot Q=\tfrac{A^2}{8}\sin(2\Delta\phi)$; the data cancels ($d^2=1$), giving a clean data-independent S-curve.` },
      { front: String.raw`How are the Costas and squaring loops related?`, back: String.raw`The $I\cdot Q$ product is the squaring operation done at baseband, so they have identical performance: same S-curve, ambiguity, and squaring loss.` },
      { front: String.raw`Where are the stable and unstable points of the $\sin(2\Delta\phi)$ S-curve?`, back: String.raw`Stable (positive slope, restoring) at $0^\circ$ and $180^\circ$; unstable (negative slope) at $\pm90^\circ$. Two stable points cause the $180^\circ$ ambiguity.` },
      { front: String.raw`What is the phase ambiguity for BPSK and QPSK, and why?`, back: String.raw`$180^\circ$ for BPSK, $90^\circ$ for QPSK — it equals $360^\circ/M$, arising from the $M$-phase symmetry the recovery nonlinearity cannot resolve.` },
      { front: String.raw`Name two ways to resolve the phase ambiguity.`, back: String.raw`Differential encoding (self-correcting, no overhead) or a unique word / preamble (absolute phase, needs overhead).` },
      { front: String.raw`Define loop SNR and steady-state phase variance.`, back: String.raw`$\rho_L=C/(N_0 B_L)$; $\sigma_\phi^2=1/(2\rho_L)=N_0 B_L/(2C)$ for a clean carrier.` },
      { front: String.raw`What is squaring loss and its factor?`, back: String.raw`Extra noise from the squarer's signal$\times$noise and noise$\times$noise terms; it multiplies the variance by $(1+1/2\rho_i)$ ($\rho_i$ = arm SNR), negligible at high SNR.` },
      { front: String.raw`How does a type-1 loop track a constant frequency offset $\Delta f$?`, back: String.raw`Only via a static phase error $\sin(2\Delta\phi_{ss})=2\pi\Delta f/K$; if $2\pi\Delta f>K$ it cannot lock. A type-2 loop drives this error to zero.` },
      { front: String.raw`What is a cycle slip?`, back: String.raw`Noise pushes $\Delta\phi$ past an unstable point ($\pm90^\circ$ from lock) so the loop jumps to the adjacent stable phase ($180^\circ$ away for BPSK), inverting data until re-sync.` },
      { front: String.raw`How does residual phase jitter degrade BER?`, back: String.raw`It rotates the constellation, reducing energy to $E_b\cos^2\Delta\phi$ so $P_b=Q(\sqrt{2E_b/N_0}\cos\Delta\phi)$; for QPSK/QAM it also causes cross-rail leakage.` }
    ],
    mcqs: [
      { q: String.raw`Coherent detection of BPSK is preferred over DBPSK mainly because it is:`, options: [String.raw`simpler to implement`, String.raw`about 1 dB better in $E_b/N_0$`, String.raw`immune to frequency offset`, String.raw`free of phase ambiguity`], answer: 1, explain: String.raw`Coherent BPSK $Q(\sqrt{2E_b/N_0})$ beats DBPSK ($\approx\tfrac12 e^{-E_b/N_0}$) by roughly 1 dB; it is not simpler and still has ambiguity.` },
      { q: String.raw`A BPSK signal $\pm A\cos(\omega_c t)$ has no discrete carrier line at $f_c$ because:`, options: [String.raw`the carrier frequency is too high`, String.raw`the $\pm1$ data makes the carrier average to zero`, String.raw`the noise masks it`, String.raw`the filter removes it`], answer: 1, explain: String.raw`Equally likely $\pm$ data means $E[d\cos\omega_c t]=0$, suppressing the spectral line — the defining feature of a suppressed-carrier signal.` },
      { q: String.raw`Squaring a BPSK signal removes the data modulation because:`, options: [String.raw`$d^2(t)=1$ for $d=\pm1$`, String.raw`the squarer is a lowpass filter`, String.raw`the carrier cancels`, String.raw`noise averages out`], answer: 0, explain: String.raw`Since $d=\pm1$, $d^2=1$ always, so squaring annihilates the modulation and leaves a data-free tone.` },
      { q: String.raw`After squaring, the recoverable tone appears at:`, options: [String.raw`$f_c/2$`, String.raw`$f_c$`, String.raw`$2f_c$`, String.raw`DC only`], answer: 2, explain: String.raw`$\cos^2(\omega_c t)=\tfrac12+\tfrac12\cos(2\omega_c t)$, so the usable tone is at $2f_c$; a divide-by-two brings it back to $f_c$.` },
      { q: String.raw`In a Costas loop, the product of the I and Q arm outputs is proportional to:`, options: [String.raw`$\cos\Delta\phi$`, String.raw`$\sin\Delta\phi$`, String.raw`$\sin(2\Delta\phi)$`, String.raw`$d(t)$`], answer: 2, explain: String.raw`$e=I\cdot Q=\tfrac{A^2}{8}\sin(2\Delta\phi)$; $d^2=1$ cancels the data, leaving a $\sin(2\Delta\phi)$ error.` },
      { q: String.raw`The Costas loop and the squaring loop have identical performance because:`, options: [String.raw`both use a divide-by-two`, String.raw`the $I\cdot Q$ product is squaring done at baseband`, String.raw`both avoid phase ambiguity`, String.raw`both require a pilot tone`], answer: 1, explain: String.raw`Forming $I\cdot Q$ is mathematically the same nonlinearity as squaring, so the two share the same S-curve, ambiguity, and squaring loss.` },
      { q: String.raw`On the $\sin(2\Delta\phi)$ S-curve, the stable lock points are at:`, options: [String.raw`$\pm90^\circ$`, String.raw`$0^\circ$ and $180^\circ$`, String.raw`$45^\circ$ only`, String.raw`$\pm135^\circ$`], answer: 1, explain: String.raw`Positive-slope (restoring) zero crossings at $0^\circ$ and $180^\circ$ are stable; $\pm90^\circ$ (negative slope) are unstable.` },
      { q: String.raw`The phase ambiguity of a suppressed-carrier tracker for an $M$-phase modulation is:`, options: [String.raw`$90^\circ$ always`, String.raw`$360^\circ/M$`, String.raw`$180^\circ$ always`, String.raw`$M\times90^\circ$`], answer: 1, explain: String.raw`It is $360^\circ/M$: $180^\circ$ for BPSK ($M=2$), $90^\circ$ for QPSK ($M=4$).` },
      { q: String.raw`Which technique resolves phase ambiguity without any overhead bits?`, options: [String.raw`Unique word`, String.raw`Pilot preamble`, String.raw`Differential encoding`, String.raw`Longer training sequence`], answer: 2, explain: String.raw`Differential encoding puts data in symbol-to-symbol changes, which a constant phase offset leaves unchanged — no overhead bits needed.` },
      { q: String.raw`The loop SNR is defined as:`, options: [String.raw`$\rho_L=N_0 B_L/C$`, String.raw`$\rho_L=C/(N_0 B_L)$`, String.raw`$\rho_L=C B_L/N_0$`, String.raw`$\rho_L=C/N_0$`], answer: 1, explain: String.raw`$\rho_L=C/(N_0 B_L)$: signal power over the noise in the loop bandwidth; a narrower $B_L$ raises it.` },
      { q: String.raw`For a clean carrier the steady-state phase-error variance is:`, options: [String.raw`$\sigma_\phi^2=2\rho_L$`, String.raw`$\sigma_\phi^2=1/(2\rho_L)$`, String.raw`$\sigma_\phi^2=\rho_L$`, String.raw`$\sigma_\phi^2=1/\rho_L^2$`], answer: 1, explain: String.raw`$\sigma_\phi^2=1/(2\rho_L)=N_0 B_L/(2C)$; jitter falls as $\sqrt{B_L}$ and $1/\sqrt{C/N_0}$.` },
      { q: String.raw`The squaring-loss bracket $(1+1/2\rho_i)$ becomes negligible when:`, options: [String.raw`the arm SNR $\rho_i$ is large`, String.raw`the loop bandwidth is wide`, String.raw`the arm SNR $\rho_i$ is small`, String.raw`the frequency offset is large`], answer: 0, explain: String.raw`At high arm SNR $\rho_i$ the term $1/2\rho_i\to0$, so the bracket $\to1$ and the suppressed-carrier loop matches a clean PLL.` },
      { q: String.raw`A type-1 loop holds lock on a constant frequency offset $\Delta f$ by:`, options: [String.raw`driving the phase error to zero`, String.raw`sitting at a static phase error $\sin(2\Delta\phi_{ss})=2\pi\Delta f/K$`, String.raw`increasing the loop bandwidth automatically`, String.raw`switching to non-coherent detection`], answer: 1, explain: String.raw`Without an integrator, a type-1 loop must lean into the S-curve; if $2\pi\Delta f>K$ it cannot lock. A type-2 loop zeros the static error.` },
      { q: String.raw`A residual phase error $\Delta\phi$ changes the coherent BPSK BER to:`, options: [String.raw`$Q(\sqrt{2E_b/N_0})$ unchanged`, String.raw`$Q(\sqrt{2E_b/N_0}\,\cos\Delta\phi)$`, String.raw`$Q(\sqrt{2E_b/N_0}\,\sin\Delta\phi)$`, String.raw`$Q(\sqrt{2E_b/N_0}/\cos\Delta\phi)$`], answer: 1, explain: String.raw`The effective energy is $E_b\cos^2\Delta\phi$, so the argument gains a $\cos\Delta\phi$ factor.` }
    ],
    numericals: [
      {
        q: String.raw`A BPSK Costas loop has carrier-to-noise density $C/N_0=45$ dB-Hz and loop noise bandwidth $B_L=100$ Hz. Assuming a clean-carrier approximation, find the RMS phase jitter $\sigma_\phi$ in degrees.`,
        solution: String.raw`<p><b>Formula.</b> $$\rho_L=\frac{C/N_0}{B_L},\qquad \sigma_\phi^2=\frac{1}{2\rho_L},\qquad \sigma_\phi=\sqrt{\frac{1}{2\rho_L}}\ \text{rad}.$$ Here $C/N_0$ is a linear ratio in Hz; convert from dB-Hz first.</p>
<p><b>Substitute.</b> $C/N_0=10^{45/10}=10^{4.5}=3.162\times10^4$ Hz. Then $\rho_L=\dfrac{3.162\times10^4}{100}=316.2$, and $\sigma_\phi^2=\dfrac{1}{2\times316.2}=\dfrac{1}{632.4}$.</p>
<p><b>Compute.</b> $\sigma_\phi^2=1.581\times10^{-3}$ rad$^2$; $\sigma_\phi=\sqrt{1.581\times10^{-3}}=0.03977$ rad $=0.03977\times\dfrac{180}{\pi}=\mathbf{2.28^\circ}$.</p>
<p><b>Explanation.</b> A loop SNR of ~25 dB gives about $2.3^\circ$ RMS jitter — tight enough that the BPSK implementation loss is only a few tenths of a dB. Narrowing $B_L$ would reduce it further as $\sqrt{B_L}$, at the cost of slower dynamic tracking.</p>`
      },
      {
        q: String.raw`A squaring loop operates at an arm (predetection) SNR of $\rho_i=3$ (linear, i.e. ~4.8 dB). By what factor does squaring loss inflate the phase-jitter variance, and the RMS jitter?`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_\phi^2=\frac{1}{2\rho_L}\Big(1+\frac{1}{2\rho_i}\Big),\qquad \text{inflation of variance}=1+\frac{1}{2\rho_i},\quad \text{of RMS}=\sqrt{1+\frac{1}{2\rho_i}}.$$</p>
<p><b>Substitute.</b> $\rho_i=3$: bracket $=1+\dfrac{1}{2\times3}=1+\dfrac{1}{6}$.</p>
<p><b>Compute.</b> Variance factor $=1+0.1667=\mathbf{1.167}$; RMS factor $=\sqrt{1.167}=\mathbf{1.080}$.</p>
<p><b>Explanation.</b> At this modest arm SNR the squaring loss raises the jitter variance by ~17% and the RMS jitter by ~8% over a clean PLL — a real but tolerable penalty. At much lower $\rho_i$ the $1/2\rho_i$ term would dominate; at high $\rho_i$ the bracket approaches 1 and the penalty vanishes.</p>`
      },
      {
        q: String.raw`A coherent BPSK link runs at $E_b/N_0=8$ dB. The carrier loop leaves a fixed residual phase error of $\Delta\phi=20^\circ$. Compare the BER with and without this phase error.`,
        solution: String.raw`<p><b>Formula.</b> $$P_b(\Delta\phi)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\,\cos\Delta\phi\right),\qquad P_b(0)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right).$$</p>
<p><b>Substitute.</b> $E_b/N_0=10^{8/10}=6.31$; $\sqrt{2\times6.31}=\sqrt{12.62}=3.553$. Ideal argument $=3.553$. With error, $\cos20^\circ=0.9397$, so argument $=3.553\times0.9397=3.339$.</p>
<p><b>Compute.</b> $P_b(0)=Q(3.553)\approx\mathbf{1.9\times10^{-4}}$; $P_b(20^\circ)=Q(3.339)\approx\mathbf{4.2\times10^{-4}}$ — about $2.2\times$ more errors.</p>
<p><b>Explanation.</b> A $20^\circ$ residual roughly doubles the BER, equivalent to needing about $0.5$ dB more $E_b/N_0$ to recover the ideal rate (since $\cos^2 20^\circ=0.883$, a $0.54$ dB energy loss). This is why carrier loops are budgeted to keep the residual well below $\sim20^\circ$.</p>`
      },
      {
        q: String.raw`A type-1 BPSK carrier loop has loop gain $K=2000$ rad/s. The received carrier is offset by $\Delta f=100$ Hz. Find the steady-state phase error $\Delta\phi_{ss}$, and the maximum $\Delta f$ the loop can hold.`,
        solution: String.raw`<p><b>Formula.</b> $$\sin(2\Delta\phi_{ss})=\frac{2\pi\,\Delta f}{K}\ \Rightarrow\ \Delta\phi_{ss}=\tfrac12\arcsin\!\Big(\frac{2\pi\Delta f}{K}\Big);\qquad \Delta f_{\max}=\frac{K}{2\pi}.$$</p>
<p><b>Substitute.</b> $\dfrac{2\pi\times100}{2000}=\dfrac{628.3}{2000}=0.3142$. So $\sin(2\Delta\phi_{ss})=0.3142$.</p>
<p><b>Compute.</b> $2\Delta\phi_{ss}=\arcsin(0.3142)=0.3197$ rad; $\Delta\phi_{ss}=0.1599$ rad $=\mathbf{9.16^\circ}$. Maximum hold-in: $\Delta f_{\max}=\dfrac{2000}{2\pi}=\mathbf{318.3}$ Hz.</p>
<p><b>Explanation.</b> The $100$ Hz offset forces about a $9^\circ$ static lean on the S-curve, well within range; the loop drops lock once $\Delta f$ exceeds $318$ Hz (where $\sin(2\Delta\phi_{ss})$ would exceed 1). A type-2 loop would hold the same offset with zero static error, which is why Doppler-heavy links use second-order loops.</p>`
      },
      {
        q: String.raw`A QPSK receiver uses a fourth-power carrier recovery. State the phase ambiguity and how many distinct valid lock phases exist. If the loop cycle-slips once, by how much can the recovered phase jump?`,
        solution: String.raw`<p><b>Formula.</b> $$\text{ambiguity}=\frac{360^\circ}{M},\quad \text{number of valid phases}=M,\quad M=4\ \text{for QPSK}.$$ A cycle slip moves the loop to an adjacent stable point, i.e. by one ambiguity step.</p>
<p><b>Substitute.</b> $M=4$: ambiguity $=\dfrac{360^\circ}{4}=90^\circ$; valid lock phases $=4$ (at $0^\circ,90^\circ,180^\circ,270^\circ$).</p>
<p><b>Compute.</b> Ambiguity $=\mathbf{90^\circ}$; there are $\mathbf{4}$ equally valid lock phases; a single cycle slip jumps the recovered phase by $\mathbf{90^\circ}$ (or a multiple thereof).</p>
<p><b>Explanation.</b> The fourth-power nonlinearity (needed because QPSK has 4 phase states) leaves four indistinguishable lock points $90^\circ$ apart. A slip rotates the whole constellation by $90^\circ$, mapping every symbol to a neighbour — corrupting the I/Q bit assignment until a differential decoder or unique word restores absolute phase.</p>`
      },
      {
        q: String.raw`A Costas loop tracks a signal with $C/N_0=40$ dB-Hz. What loop bandwidth $B_L$ is needed to achieve a loop SNR of $\rho_L=20$ dB (a common threshold for rare cycle slips)?`,
        solution: String.raw`<p><b>Formula.</b> $$\rho_L=\frac{C/N_0}{B_L}\ \Rightarrow\ B_L=\frac{C/N_0}{\rho_L},$$ with both $C/N_0$ (Hz) and $\rho_L$ as linear ratios.</p>
<p><b>Substitute.</b> $C/N_0=10^{40/10}=10^4$ Hz; $\rho_L=10^{20/10}=100$. Then $B_L=\dfrac{10^4}{100}$.</p>
<p><b>Compute.</b> $B_L=\mathbf{100}$ Hz.</p>
<p><b>Explanation.</b> A $100$ Hz loop bandwidth turns a $40$ dB-Hz signal into a $20$ dB loop SNR, keeping cycle slips rare. If the platform dynamics demanded a wider $B_L$ (say $500$ Hz for faster tracking), $\rho_L$ would fall to $13$ dB and slips would become far more frequent — the direct bandwidth-versus-robustness trade.</p>`
      }
    ],
    realWorld: String.raw`<p>Coherent carrier tracking is inside essentially every high-performance digital receiver. Satellite and deep-space modems (the domain of the NASA/JPL carrier-synchronization literature) recover suppressed BPSK/QPSK carriers with Costas or squaring loops, because at the extreme low $C/N_0$ of a Mars link the ~1 dB coherent advantage and the ability to run QPSK are worth the added squaring loss — which those receivers fight by narrowing the loop bandwidth to a few Hz and lengthening integration. Cable and terrestrial digital TV (DVB), cellular downlinks, Wi-Fi, and satellite modems all run decision-directed or Costas-type carrier recovery on QPSK/QAM constellations, where the phase-jitter budget is tight because cross-rail leakage from constellation rotation directly corrupts the densely packed points of 64- and 256-QAM. In spread-spectrum receivers — GPS/GNSS above all — the carrier loop (a Costas loop in most GPS trackers, since the navigation data makes the signal suppressed-carrier) runs <em>alongside</em> the code-tracking loop (DLL): the code loop keeps the despreading PN replica aligned so the carrier loop sees a clean narrowband signal, while the much-lower-jitter carrier loop aids the code loop with its precise Doppler estimate — two coupled trackers, one on the code phase and one on the carrier phase.</p>
<p>The design levers this topic quantifies show up as concrete engineering choices. The $180^\circ$ (BPSK) or $90^\circ$ (QPSK) ambiguity is why virtually every real link either differentially encodes (DVB and many satellite systems use differential precoding precisely so a cycle slip self-heals) or inserts a unique word / frame-sync pattern to nail absolute phase. The loop-SNR and squaring-loss formulas set the loop bandwidth: a high-dynamics platform (a launch vehicle, a fast aircraft) must widen $B_L$ to follow Doppler, accepting more jitter, while a fixed ground station narrows $B_L$ to milli-hertz for the cleanest possible reference and the lowest BER. And the $\cos^2\Delta\phi$ energy penalty is exactly the implementation loss a link-budget engineer must reserve margin for — the reason carrier tracking is not an afterthought but a first-class part of the demodulator design.</p>`,
    related: ['costas-loop', 'pll', 'cfo', 'bpsk-vs-dbpsk', 'synchronization']
  }
);
