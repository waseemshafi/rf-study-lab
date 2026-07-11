/* tau-dither-tracking.js — "Tau-Dither Loop Tracking" topic (Spread Spectrum & Coding).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "tau-dither-tracking-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'tau-dither-tracking',
    title: 'Tau-Dither Loop Tracking',
    category: 'Spread Spectrum & Coding',
    tags: ['tau-dither', 'TDL', 'DDLL', 'code tracking', 'single correlator', 'early-late', 'dither', 'synchronous detection', 'gain imbalance', 'S-curve'],
    summary: String.raw`The tau-dither loop (TDL), or dithering delay-lock loop, tracks DSSS code phase with a SINGLE correlator time-shared between an early ($+\Delta/2$) and late ($-\Delta/2$) position by a square-wave dither $q(t)=\pm1$ at rate $f_d$. The correlator output is amplitude-modulated at $f_d$ by $R(\varepsilon+\Delta/2)-R(\varepsilon-\Delta/2)$; synchronous detection (multiply by the dither, low-pass filter) recovers the early-minus-late S-curve that drives the code NCO — halving the hardware of a two-arm DLL and, crucially, removing the early/late gain-imbalance bias, at the price of a small dither/time-sharing noise loss.`,
    prerequisites: ['dsss', 'early-late-correlator', 'delay-lock-tracking'],
    intro: String.raw`<p><strong>Why build a tracking loop with only one correlator when the classic delay-lock loop already works?</strong> A full non-coherent DLL runs <em>two</em> arms in parallel — an early correlator and a late correlator — and forms the discriminator from their difference, typically $E^2-L^2$. That works beautifully <em>on paper</em>, where the two arms are identical. In real hardware they never are: two separate mixers, two integrate-and-dump filters, two envelope detectors, and two analog gain stages drift apart with temperature, aging, and component tolerance. The moment the early arm has even a slightly higher gain than the late arm, the discriminator reads a nonzero error when the code is <em>perfectly</em> aligned, and the loop locks at the wrong code phase — a <strong>gain-imbalance bias</strong> that directly corrupts the pseudorange or despread data. You can trim it, but trimming drifts.</p>
<p>The <strong>tau-dither loop (TDL)</strong> — also called the dithering delay-lock loop or the tau-dither early-late loop — attacks that problem by using <strong>one</strong> correlator and <em>time-sharing</em> it between the early and late positions. A square-wave dither $q(t)=\pm1$ at a modest rate $f_d$ toggles the local code phase between $+\Delta/2$ (early) and $-\Delta/2$ (late). Because the <em>same</em> physical correlator, with the <em>same</em> gain, produces both the early and late samples, any gain error multiplies both equally and cancels in the difference. The imbalance bias is gone by construction, and the hardware is roughly halved.</p>
<p>The price is subtle. Each gate — early and late — is now observed only <em>part</em> of the time (the correlator is dithered away from it for the other half), so the loop collects less signal energy per second than an ideal two-arm DLL that watches both gates continuously. This <strong>dither (time-sharing) loss</strong> raises the tracking jitter by roughly 1 to 3 dB depending on the dither duty. This topic derives the dithered code phase, the amplitude-modulated correlator output, the synchronous-detection recovery of the S-curve, the discriminator gain and its slope, the tracking-jitter penalty relative to a two-arm DLL, and the rules for choosing the dither rate — the complete machinery of a one-correlator code-tracking loop that trades a little noise for the removal of a stubborn hardware bias.</p>`,
    sections: [
      {
        h: 'Why a single-correlator loop: killing the gain-imbalance bias',
        html: String.raw`<p><strong>Why revisit the discriminator at all?</strong> The two-arm non-coherent DLL forms its error signal as $D=g_E\,E^2-g_L\,L^2$, where $g_E$ and $g_L$ are the (ideally equal) gains of the early and late processing chains. Set the code error $\varepsilon=0$: the true correlations are equal, $E=L=A\,R(\Delta/2)$, so the <em>ideal</em> discriminator is zero. But if $g_E\neq g_L$, then $D=(g_E-g_L)\,A^2R^2(\Delta/2)\neq0$ at $\varepsilon=0$. The loop must move the code phase until $D$ returns to zero, so it settles at a biased offset $\varepsilon_b\neq0$ — a lock-point shift set entirely by a hardware mismatch, not by the signal.</p>
<p>In a ranging system this bias becomes a direct range error; in a data link it moves the prompt correlator off the correlation peak and costs SNR. Analog trimming, matched components, and periodic calibration all fight it, but gain drifts with temperature and time, so the bias is never truly eliminated in a two-arm design.</p>
<p>The tau-dither idea removes the mismatch at its root: use <strong>one</strong> correlator for both gates. If a single gain $g$ produces both the early and the late sample, then the difference the loop actually uses is $g\big[R(\varepsilon+\Delta/2)-R(\varepsilon-\Delta/2)\big]$ — the gain $g$ is a common multiplicative factor that scales the loop gain but <em>cannot</em> create a zero-error offset. At $\varepsilon=0$ the bracket is exactly zero regardless of $g$.</p>
<div class="callout"><strong>Intuition:</strong> a two-arm DLL is like weighing two objects on two different scales and comparing — if one scale reads high, you get a false difference. The tau-dither loop weighs both objects on the <em>same</em> scale, one after the other; a miscalibrated scale adds the same error to both readings, so the difference is still correct.</div>`
      },
      {
        h: 'How the dither works: time-sharing one correlator',
        html: String.raw`<p>The tau-dither loop keeps a single local PN replica whose phase is <strong>dithered</strong> — toggled — between two positions straddling the loop's current estimate by the dither square wave $q(t)$, which alternates between $+1$ and $-1$ at the dither frequency $f_d$ (period $T_d=1/f_d$):</p>
<ul>
<li>When $q(t)=+1$ the replica is advanced to the <strong>early</strong> position, offset $\varepsilon+\Delta/2$ from the incoming code, where $\Delta$ is the early-late spacing in chips.</li>
<li>When $q(t)=-1$ the replica is retarded to the <strong>late</strong> position, offset $\varepsilon-\Delta/2$.</li>
</ul>
<p>The single correlator (one multiplier followed by one integrate-and-dump / low-pass filter) therefore produces, in alternating half-periods of the dither, the early correlation $A\,R(\varepsilon+\Delta/2)$ and then the late correlation $A\,R(\varepsilon-\Delta/2)$. Writing the instantaneous local offset compactly, the dithered code phase is</p>
<p>$$\tau_{\text{loc}}(t)=\varepsilon+\tfrac{\Delta}{2}\,q(t),\qquad q(t)\in\{+1,-1\}.$$</p>
<p>A crucial second job of the dither: to keep the despread data usable, most implementations do not let the code wander a full half-chip during the data-bearing correlation — they either apply the dither only to a separate <em>tracking</em> replica while a prompt replica despreads the data, or they keep $\Delta$ small. The takeaway is that <strong>one</strong> correlator now performs the entire early-late measurement sequentially in time rather than two correlators performing it in parallel.</p>
<div class="callout tip"><strong>Tip:</strong> think of $q(t)$ as a fast switch flipping the local code between "a hair early" and "a hair late." The correlator's output then carries a slow ripple whose size and phase tell you which way, and how far, the code is off.</div>`
      },
      {
        h: 'The dither modulates the correlator output at f_d',
        html: String.raw`<p>Because the correlator alternately measures the early and late correlations, its low-pass-filtered output is a square wave at the dither frequency $f_d$ riding on a DC level. Split it into an average (common-mode) part and a dither-frequency (differential) part. Over one dither period the two half-cycles give</p>
<p>$$y(t)=\underbrace{\tfrac{A}{2}\big[R(\varepsilon+\tfrac{\Delta}{2})+R(\varepsilon-\tfrac{\Delta}{2})\big]}_{\text{DC / common mode}}+\underbrace{\tfrac{A}{2}\big[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})\big]\,q(t)}_{\text{amplitude-modulated at }f_d}.$$</p>
<p>The first term is a bias that carries no sign information — it is roughly constant near lock and is rejected later. The <strong>second term is the useful signal</strong>: a square wave at $f_d$ whose amplitude is proportional to the <em>early-minus-late</em> correlation difference $R(\varepsilon+\Delta/2)-R(\varepsilon-\Delta/2)$.</p>
<ul>
<li>When $\varepsilon=0$, the early and late correlations are equal, the difference vanishes, and there is <strong>no</strong> $f_d$ ripple — the correlator output is pure DC.</li>
<li>When $\varepsilon>0$ (replica late on average), the late gate climbs higher on the triangle than the early gate, the difference is negative, and the $f_d$ ripple has one phase.</li>
<li>When $\varepsilon<0$, the difference reverses sign and the $f_d$ ripple flips phase by $180^\circ$.</li>
</ul>
<p>So the <em>magnitude</em> of the $f_d$ component measures how far off we are, and its <em>phase</em> (in step with $q(t)$ or inverted) tells us the direction. That is exactly a suppressed-carrier amplitude modulation whose "carrier" is the dither square wave — and it is recovered the same way any such AM is: synchronous detection.</p>`
      },
      {
        h: 'Synchronous detection: recovering the S-curve',
        html: String.raw`<p>To extract the signed error from the dither-modulated output we <strong>synchronously detect</strong> it: multiply $y(t)$ by the same dither square wave $q(t)$ and low-pass filter. Because $q(t)^2=1$, the multiplication turns the wanted differential term into DC while pushing the unwanted common-mode term to $f_d$ (where the low-pass filter kills it):</p>
<p>$$q(t)\,y(t)=\tfrac{A}{2}\big[R(\varepsilon+\tfrac{\Delta}{2})+R(\varepsilon-\tfrac{\Delta}{2})\big]q(t)+\tfrac{A}{2}\big[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})\big].$$</p>
<p>After the low-pass filter (which averages $q(t)$ to zero) the surviving DC output is the <strong>discriminator</strong></p>
<p>$$D(\varepsilon)=\tfrac{A}{2}\big[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})\big].$$</p>
<p>This is precisely the <em>early-minus-late</em> discriminator of a coherent DLL, up to the factor $\tfrac12$ — but produced with a single correlator. Plotted against $\varepsilon$ it is the familiar <strong>S-curve</strong>: zero at $\varepsilon=0$, positive on one side and negative on the other, with a negative-going zero-crossing that is the stable lock point. The synchronous detector plays exactly the role the subtractor plays in a two-arm DLL, but it separates the early and late contributions in <em>time</em> (via the dither phase) rather than in <em>space</em> (via two hardware arms).</p>
<div class="callout"><strong>Key picture:</strong> the dither writes the early-minus-late error onto an $f_d$ "carrier"; the synchronous detector reads it back off. No ripple means aligned; a big ripple in phase with $q$ means one direction, inverted ripple means the other.</div>`
      },
      {
        h: 'The S-curve, discriminator gain, and slope',
        html: String.raw`<p>Substitute the ideal PN autocorrelation triangle $R(\tau)=1-\lvert\tau\rvert$ (for $\lvert\tau\rvert\le1$, else $0$) into the discriminator. Near lock, with a spacing $\Delta$ (take $\Delta\le1$), the early sample sits at $\varepsilon+\Delta/2$ on one flank and the late sample at $\varepsilon-\Delta/2$ on the other. For small $\varepsilon$ both samples are on the straight flanks, so</p>
<p>$$D(\varepsilon)=\tfrac{A}{2}\big[(1-\lvert\varepsilon+\tfrac{\Delta}{2}\rvert)-(1-\lvert\varepsilon-\tfrac{\Delta}{2}\rvert)\big]=\tfrac{A}{2}\big[\lvert\varepsilon-\tfrac{\Delta}{2}\rvert-\lvert\varepsilon+\tfrac{\Delta}{2}\rvert\big]=-A\,\varepsilon,$$</p>
<p>valid for $\lvert\varepsilon\rvert\le\Delta/2$. The <strong>discriminator (or S-curve) slope</strong> at the origin is therefore</p>
<p>$$K_D=\left.\frac{dD}{d\varepsilon}\right|_{\varepsilon=0}=-A\quad(\text{for a triangular }R,\ \varepsilon\text{ in chips}).$$</p>
<ul>
<li>The <strong>linear (pull-in) region</strong> spans $\lvert\varepsilon\rvert\le\Delta/2$ before the samples cross the peak or leave a flank; beyond it the curve bends and eventually flattens, and the loop cannot pull in.</li>
<li>The slope magnitude sets the <strong>loop gain</strong>: a steeper slope means a given error produces a larger correction, lowering jitter but shrinking the pull-in range.</li>
<li>Compared with the two-arm coherent $E-L$ discriminator (slope $-2A$ for $\Delta=1$), the tau-dither discriminator carries the extra factor $\tfrac12$ from time-sharing; the loop-filter gain is simply scaled to compensate, so the closed-loop behaviour is equivalent up to the noise penalty discussed next.</li>
</ul>
<table class="data">
<tr><th>Quantity</th><th>Two-arm coherent DLL</th><th>Tau-dither loop</th></tr>
<tr><td>Correlators</td><td>Two (E and L, parallel)</td><td>One (time-shared)</td></tr>
<tr><td>Discriminator</td><td>$A[R(\varepsilon{+}\tfrac{\Delta}{2}){-}R(\varepsilon{-}\tfrac{\Delta}{2})]$</td><td>$\tfrac{A}{2}[R(\varepsilon{+}\tfrac{\Delta}{2}){-}R(\varepsilon{-}\tfrac{\Delta}{2})]$</td></tr>
<tr><td>Slope $K_D$ ($\Delta{=}1$)</td><td>$-2A$</td><td>$-A$</td></tr>
<tr><td>Gain-imbalance bias</td><td>Yes (two arms)</td><td>None (one arm)</td></tr>
<tr><td>Jitter penalty</td><td>Reference</td><td>$+1$ to $3$ dB (dither loss)</td></tr>
</table>`
      },
      {
        h: 'Tracking jitter and the dither (time-sharing) loss',
        html: String.raw`<p>The tau-dither loop pays for its single correlator with a <strong>dither loss</strong>. In a two-arm DLL both the early and late gates are correlated <em>continuously</em>; in the TDL the single correlator spends only a fraction of each dither period on each gate, so the effective integration time per gate is reduced. Less energy per gate means a noisier discriminator for the same $C/N_0$, and hence larger jitter.</p>
<p>Write the two-arm (coherent) DLL code jitter as the reference $\sigma_{\text{DLL}}\approx\sqrt{B_L\,\Delta/(2\,C/N_0)}$ chips. The tau-dither loop inflates it by a dither-loss factor $L_d>1$:</p>
<p>$$\sigma_{\text{TDL}}\approx L_d\,\sqrt{\frac{B_L\,\Delta}{2\,(C/N_0)}},\qquad L_d\approx 1.1\ \text{to}\ 1.4\ (\text{i.e. }+1\ \text{to}\ +3\ \text{dB}),$$</p>
<p>where $B_L$ is the loop noise bandwidth (Hz), $\Delta$ the spacing (chips), and $C/N_0$ a linear ratio in Hz. The exact $L_d$ depends on the dither <strong>duty cycle</strong> (how the dither period is split between the early and late gates and any dead time), on whether the loop is coherent or non-coherent, and on the loop bandwidth relative to $f_d$. A commonly quoted figure is about $3$ dB in the classic 50/50 non-coherent TDL, reducible toward $1$ dB with careful dither and detection design (double-dither variants recover most of it).</p>
<ul>
<li>Everything that lowers a DLL's jitter still lowers the TDL's: narrower $\Delta$ (as $\sqrt\Delta$), narrower $B_L$ (as $\sqrt{B_L}$), and higher $C/N_0$ (as $1/\sqrt{C/N_0}$).</li>
<li>The <em>net</em> engineering trade is: accept $+1$ to $3$ dB of jitter in exchange for removing the gain-imbalance bias and halving the correlator hardware.</li>
</ul>
<div class="callout"><strong>Why the loss is worth it:</strong> a fixed bias corrupts <em>every</em> measurement in the same direction and cannot be averaged away; extra random jitter averages down with time and loop filtering. Trading a stubborn bias for a little more zero-mean noise is usually a good bargain.</div>`
      },
      {
        h: 'Choosing the dither rate and dealing with self-noise',
        html: String.raw`<p>The dither frequency $f_d$ is a free design parameter, but it is squeezed between two hard limits:</p>
<ul>
<li><strong>Lower bound — well above the loop bandwidth.</strong> The loop must respond to the <em>average</em> code error, not to the dither itself. If $f_d$ were comparable to the loop noise bandwidth $B_L$, the loop would try to chase the dither and the synchronous detector could not cleanly separate the differential term from the loop dynamics. Rule of thumb: $f_d\gg B_L$ (often $f_d$ is tens to hundreds of times $B_L$; classic hardware used a few hundred hertz for hertz-class loops).</li>
<li><strong>Upper bound — well below the chip rate.</strong> The dither must not smear the correlation. Each early or late correlation needs many chips of integration to build the autocorrelation peak, so the dither half-period must contain many chips: $f_d\ll R_c$ (the chip rate). Equivalently, the correlator's integrate-and-dump interval must fit comfortably inside a dither half-period.</li>
</ul>
<p>So the design window is $B_L\ll f_d\ll R_c$. Within it, higher $f_d$ gives faster, finer error updates and better rejection of low-frequency common-mode drift, but leaves fewer chips per gate; lower $f_d$ integrates more per gate but tracks slugglishly and lets $1/f$ effects through.</p>
<p><strong>Self-noise.</strong> The very act of dithering injects a small disturbance: the abrupt half-chip code shifts create switching transients and a residual $f_d$ component that leaks past the synchronous detector, adding a <em>dithering self-noise</em> on top of thermal noise. It is minimized by a clean 50/50 (or optimized) duty cycle, a synchronous detector locked exactly to $q(t)$, and a low-pass filter narrow enough to reject $f_d$ and its harmonics while still passing the loop's error updates. Keeping $f_d$ safely inside the $B_L\ll f_d\ll R_c$ window is what makes all three of those achievable at once.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>The tau-dither loop is a one-correlator code-tracking loop that trades a small noise penalty for the removal of a hardware bias. You should now be able to say:</p>
<ul>
<li><strong>The motivation:</strong> a two-arm non-coherent DLL suffers a gain-imbalance bias — unequal early/late gains make the discriminator nonzero at $\varepsilon=0$ and shift the lock point; the tau-dither loop removes this by construction because one correlator, with one gain, forms both gates.</li>
<li><strong>The mechanism:</strong> a square-wave dither $q(t)=\pm1$ at rate $f_d$ toggles the local code between early ($+\Delta/2$) and late ($-\Delta/2$), so a single correlator time-shares the early-late measurement, $\tau_{\text{loc}}=\varepsilon+\tfrac{\Delta}{2}q(t)$.</li>
<li><strong>The signal:</strong> the correlator output is amplitude-modulated at $f_d$ with magnitude $\propto R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})$ — zero when aligned, phase-reversing about the lock point.</li>
<li><strong>The recovery:</strong> synchronous detection (multiply by $q(t)$, low-pass filter) turns that AM back into the DC early-minus-late S-curve $D(\varepsilon)=\tfrac{A}{2}[R(\varepsilon{+}\tfrac{\Delta}{2}){-}R(\varepsilon{-}\tfrac{\Delta}{2})]$, slope $K_D=-A$ for a triangular $R$, driving the code NCO.</li>
<li><strong>The cost:</strong> a dither (time-sharing) loss of about $1$ to $3$ dB raises jitter relative to an ideal two-arm DLL, $\sigma_{\text{TDL}}\approx L_d\sqrt{B_L\Delta/(2\,C/N_0)}$, because each gate is watched only part of the time.</li>
<li><strong>The dither rate:</strong> choose $B_L\ll f_d\ll R_c$ so the loop ignores the dither yet each gate still integrates many chips, and control dithering self-noise with a clean duty cycle and a matched synchronous detector.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://gssc.esa.int/navipedia/index.php/Delay_Lock_Loop_(DLL)" target="_blank" rel="noopener">ESA Navipedia — Delay Lock Loop (DLL)</a> — the authoritative reference for the parent two-arm DLL: early/late correlators, the coherent, non-coherent, dot-product and normalized discriminators, the S-curve, and the thermal-noise code-jitter law the tau-dither loss is measured against.</li>
<li><a href="https://gssc.esa.int/navipedia/index.php/Tracking_Loops" target="_blank" rel="noopener">ESA Navipedia — Tracking Loops</a> — situates the code loop among the PLL/FLL carrier loops, with loop-filter order, the loop noise bandwidth trade, the code NCO, and carrier aiding — the context in which a tau-dither code loop actually runs.</li>
<li><a href="https://patents.google.com/patent/US5077754A/en" target="_blank" rel="noopener">US Patent 5,077,754 — Tau-Dither Circuit</a> — a primary-source hardware description of a tau-dither code-tracking circuit, showing the dither switch, the single correlator/multiplier, and how the early/late codes are time-shared for synchronization while a separate replica despreads the data.</li>
<li><a href="https://www.jocm.us/uploadfile/2016/0524/20160524043245528.pdf" target="_blank" rel="noopener">Journal of Communications — Delay Lock Loop Assisted PLL for GNSS Signal Tracking (Hui Bao)</a> — a peer-reviewed deep dive into DLL-based code tracking, the discriminator S-curve, loop bandwidth and jitter at low SNR — useful for seeing how the tau-dither loss compares with a full DLL in a working GNSS receiver.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`A two-arm non-coherent DLL forms $D=g_E E^2-g_L L^2$; unequal arm gains ($g_E\neq g_L$) make $D\neq0$ at $\varepsilon=0$, biasing the lock point — the gain-imbalance problem the tau-dither loop solves.`,
      String.raw`The tau-dither loop (TDL / dithering DLL) uses a SINGLE correlator time-shared between the early and late positions, so one common gain cancels in the difference and no imbalance bias can arise.`,
      String.raw`A square-wave dither $q(t)=\pm1$ at rate $f_d$ toggles the local code phase: $\tau_{\text{loc}}(t)=\varepsilon+\tfrac{\Delta}{2}q(t)$, with $\Delta$ the early-late spacing in chips.`,
      String.raw`The correlator output splits into a DC common-mode term and a term at $f_d$ of amplitude $\propto R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})$ — the early-minus-late difference.`,
      String.raw`At $\varepsilon=0$ the early and late correlations are equal, the difference is zero, and there is NO $f_d$ ripple; the ripple grows with $\lvert\varepsilon\rvert$ and reverses phase across the lock point.`,
      String.raw`Synchronous detection — multiply $y(t)$ by $q(t)$ and low-pass filter — recovers the DC discriminator $D(\varepsilon)=\tfrac{A}{2}[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})]$.`,
      String.raw`The resulting S-curve has a negative-going zero-crossing at $\varepsilon=0$ (the stable lock point) and, for a triangular $R$, slope $K_D=dD/d\varepsilon|_0=-A$.`,
      String.raw`The linear pull-in region spans $\lvert\varepsilon\rvert\le\Delta/2$; outside it the curve bends and the loop cannot pull in.`,
      String.raw`Relative to a two-arm coherent DLL (slope $-2A$ at $\Delta=1$), the TDL discriminator carries an extra factor $\tfrac12$ from time-sharing, compensated by the loop-filter gain.`,
      String.raw`The single correlator watches each gate only part of the time, so the TDL pays a dither (time-sharing) loss: $\sigma_{\text{TDL}}\approx L_d\sqrt{B_L\Delta/(2\,C/N_0)}$ with $L_d\approx1.1$ to $1.4$ ($+1$ to $3$ dB).`,
      String.raw`The classic 50/50 non-coherent TDL is often quoted at about $3$ dB worse than an ideal DLL; careful dither/detection (e.g. double-dither) recovers most of that loss.`,
      String.raw`Trading a fixed bias for extra zero-mean jitter is usually worthwhile: bias corrupts every measurement identically and cannot be averaged out, whereas jitter averages down with loop filtering.`,
      String.raw`Choose the dither rate in the window $B_L\ll f_d\ll R_c$: well above the loop bandwidth so the loop ignores the dither, well below the chip rate so each gate still integrates many chips.`,
      String.raw`Dithering self-noise (switching transients and residual $f_d$ leakage) is minimized with a clean 50/50 duty cycle, a synchronous detector locked exactly to $q(t)$, and a low-pass filter that rejects $f_d$ and its harmonics.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 270" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="tau-dither-tracking-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="270" fill="#1c232e"/>
<text x="14" y="22" fill="#e6edf3" font-size="13">Tau-dither loop: one correlator, dither generator, synchronous detector</text>
<!-- input -->
<line x1="10" y1="90" x2="60" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#tau-dither-tracking-a1)"/>
<text x="8" y="82" fill="#9aa7b5" font-size="10">$r(t)$</text>
<!-- single correlator: multiplier + integrate/dump -->
<circle cx="78" cy="90" r="13" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="72" y="95" fill="#e6edf3" font-size="12">$\times$</text>
<rect x="108" y="76" width="72" height="28" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="118" y="94" fill="#e6edf3" font-size="10">$\int$ / LPF</text>
<line x1="91" y1="90" x2="108" y2="90" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#tau-dither-tracking-a1)"/>
<text x="120" y="118" fill="#63e6be" font-size="10">$y(t)$ (AM at $f_d$)</text>
<!-- dithered local code into multiplier -->
<rect x="40" y="150" width="90" height="28" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/><text x="49" y="168" fill="#e6edf3" font-size="9">code + dither</text>
<line x1="85" y1="150" x2="78" y2="105" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#tau-dither-tracking-a1)"/>
<text x="132" y="165" fill="#9aa7b5" font-size="9">$\varepsilon+\tfrac{\Delta}{2}q(t)$</text>
<!-- dither generator -->
<rect x="40" y="205" width="90" height="30" fill="#1c232e" stroke="#b197fc" stroke-width="1.3"/><text x="49" y="224" fill="#e6edf3" font-size="9">dither gen $q(t)$</text>
<line x1="85" y1="205" x2="85" y2="178" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#tau-dither-tracking-a1)"/>
<text x="60" y="248" fill="#9aa7b5" font-size="9">square wave $\pm1$ at $f_d$</text>
<!-- synchronous detector -->
<circle cx="215" cy="90" r="13" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="209" y="95" fill="#e6edf3" font-size="12">$\times$</text>
<line x1="180" y1="90" x2="202" y2="90" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#tau-dither-tracking-a1)"/>
<text x="196" y="70" fill="#9aa7b5" font-size="9">synchronous</text><text x="200" y="132" fill="#9aa7b5" font-size="9">detector</text>
<!-- q(t) into synchronous detector -->
<line x1="130" y1="219" x2="215" y2="219" stroke="#9aa7b5" stroke-width="1.0"/><line x1="215" y1="219" x2="215" y2="105" stroke="#9aa7b5" stroke-width="1.0" marker-end="url(#tau-dither-tracking-a1)"/>
<!-- low pass after detector -->
<rect x="250" y="76" width="66" height="28" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="264" y="94" fill="#e6edf3" font-size="10">LPF</text>
<line x1="228" y1="90" x2="250" y2="90" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#tau-dither-tracking-a1)"/>
<text x="258" y="118" fill="#ff6b6b" font-size="9">$D(\varepsilon)$</text>
<!-- loop filter -->
<rect x="340" y="76" width="78" height="28" fill="#1c232e" stroke="#b197fc" stroke-width="1.3"/><text x="350" y="94" fill="#e6edf3" font-size="9">loop filter</text>
<line x1="316" y1="90" x2="340" y2="90" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#tau-dither-tracking-a1)"/>
<!-- code NCO -->
<rect x="440" y="76" width="86" height="28" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/><text x="452" y="94" fill="#e6edf3" font-size="9">code NCO</text>
<line x1="418" y1="90" x2="440" y2="90" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#tau-dither-tracking-a1)"/>
<!-- feedback to local code -->
<line x1="483" y1="104" x2="483" y2="258" stroke="#9aa7b5" stroke-width="1.0"/><line x1="483" y1="258" x2="85" y2="258" stroke="#9aa7b5" stroke-width="1.0"/><line x1="85" y1="258" x2="85" y2="178" stroke="#9aa7b5" stroke-width="1.0" marker-end="url(#tau-dither-tracking-a1)"/>
<text x="250" y="252" fill="#9aa7b5" font-size="9">NCO sets $\varepsilon$; dither adds $\pm\tfrac{\Delta}{2}$</text>
</svg>`,
        caption: 'Tau-dither loop block diagram. A single correlator (one multiplier plus integrate-and-dump/LPF) correlates the incoming signal against a local code that the dither generator q(t) toggles between early (+Delta/2) and late (-Delta/2). The output y(t) is amplitude-modulated at f_d; the synchronous detector multiplies by q(t) and low-pass filters to recover the discriminator D(eps), which drives the loop filter and code NCO. One correlator replaces the two arms of a DLL.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="14" y="22" fill="#e6edf3" font-size="13">Dither timing: code toggles early/late; output ripples at $f_d$</text>
<!-- dither square wave q(t) -->
<text x="14" y="52" fill="#b197fc" font-size="10">$q(t)$</text>
<path d="M60,60 L120,60 L120,80 L180,80 L180,60 L240,60 L240,80 L300,80 L300,60 L360,60 L360,80 L420,80 L420,60 L480,60" fill="none" stroke="#b197fc" stroke-width="1.8"/>
<text x="82" y="54" fill="#9aa7b5" font-size="9">early</text><text x="142" y="94" fill="#9aa7b5" font-size="9">late</text>
<!-- local code offset -->
<text x="14" y="118" fill="#63e6be" font-size="10">offset</text>
<line x1="60" y1="130" x2="480" y2="130" stroke="#9aa7b5" stroke-width="0.7" stroke-dasharray="3 3"/>
<text x="484" y="133" fill="#9aa7b5" font-size="8">$\varepsilon$</text>
<path d="M60,112 L120,112 L120,148 L180,148 L180,112 L240,112 L240,148 L300,148 L300,112 L360,112 L360,148 L420,148 L420,112 L480,112" fill="none" stroke="#63e6be" stroke-width="1.6"/>
<text x="486" y="110" fill="#63e6be" font-size="8">$+\tfrac{\Delta}{2}$</text><text x="486" y="152" fill="#63e6be" font-size="8">$-\tfrac{\Delta}{2}$</text>
<!-- correlator output when eps>0 (late gate higher): ripple present -->
<text x="14" y="182" fill="#ffa94d" font-size="10">$y(t)$</text>
<text x="120" y="182" fill="#9aa7b5" font-size="8">(when $\varepsilon&gt;0$)</text>
<path d="M60,200 L120,200 L120,175 L180,175 L180,200 L240,200 L240,175 L300,175 L300,200 L360,200 L360,175 L420,175 L420,200 L480,200" fill="none" stroke="#ffa94d" stroke-width="1.6"/>
<text x="330" y="222" fill="#9aa7b5" font-size="9">ripple amplitude $\propto R(\varepsilon{+}\tfrac{\Delta}{2}){-}R(\varepsilon{-}\tfrac{\Delta}{2})$</text>
<!-- when eps=0: flat -->
<text x="14" y="246" fill="#4dabf7" font-size="9">$\varepsilon=0$:</text>
<line x1="60" y1="242" x2="300" y2="242" stroke="#4dabf7" stroke-width="1.6"/>
<text x="306" y="246" fill="#9aa7b5" font-size="9">no ripple (early = late) $\Rightarrow$ locked</text>
</svg>`,
        caption: 'Dither timing waveform. The square-wave dither q(t) (top) alternately advances and retards the local code by +/-Delta/2 about the loop estimate eps (middle). When eps>0 the late gate sits higher on the autocorrelation triangle than the early gate, so the correlator output y(t) carries a square-wave ripple at f_d whose amplitude equals the early-minus-late difference; when eps=0 the two gates are equal and the ripple vanishes, signalling lock.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="14" y="22" fill="#e6edf3" font-size="13">Tau-dither S-curve $D(\varepsilon)$: negative-going zero-crossing = lock</text>
<line x1="40" y1="140" x2="510" y2="140" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="275" y1="40" x2="275" y2="240" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="4 3"/>
<text x="494" y="156" fill="#9aa7b5" font-size="10">$\varepsilon$ (chips)</text>
<text x="282" y="52" fill="#9aa7b5" font-size="10">$D(\varepsilon)$</text>
<!-- S-curve: flat left, linear neg slope through origin, flat right -->
<path d="M70,80 L165,80 L275,140 L385,200 L480,200" fill="none" stroke="#63e6be" stroke-width="2"/>
<!-- linear region markers at +/- Delta/2 -->
<line x1="220" y1="118" x2="220" y2="200" stroke="#b197fc" stroke-width="0.8" stroke-dasharray="3 2"/>
<line x1="330" y1="80" x2="330" y2="162" stroke="#b197fc" stroke-width="0.8" stroke-dasharray="3 2"/>
<text x="200" y="214" fill="#b197fc" font-size="9">$-\tfrac{\Delta}{2}$</text>
<text x="318" y="214" fill="#b197fc" font-size="9">$+\tfrac{\Delta}{2}$</text>
<line x1="220" y1="232" x2="330" y2="232" stroke="#b197fc" stroke-width="1.4"/>
<text x="222" y="228" fill="#b197fc" font-size="9">linear pull-in $\lvert\varepsilon\rvert\le\tfrac{\Delta}{2}$</text>
<circle cx="275" cy="140" r="4" fill="#ffa94d"/><text x="284" y="132" fill="#ffa94d" font-size="10">stable lock (slope $-A$)</text>
<text x="330" y="108" fill="#9aa7b5" font-size="9">$\varepsilon&gt;0\Rightarrow D&lt;0$</text>
<text x="120" y="182" fill="#9aa7b5" font-size="9">$\varepsilon&lt;0\Rightarrow D&gt;0$</text>
<text x="60" y="70" fill="#4dabf7" font-size="9">flat: no feedback</text>
<text x="418" y="192" fill="#4dabf7" font-size="9">flat</text>
</svg>`,
        caption: 'The tau-dither discriminator S-curve D(eps) = (A/2)[R(eps+Delta/2) - R(eps-Delta/2)]. It passes through zero with a negative slope (-A for a triangular autocorrelation) at eps=0, the stable lock point: a late replica (eps>0) gets a negative correction and an early replica a positive one. The output is linear within |eps| <= Delta/2 and flattens outside, where the loop can no longer pull in. It is identical in shape to a coherent DLL S-curve, produced with a single correlator.'
      }
    ],
    equations: [
      {
        title: 'Dithered Local Code Phase',
        tex: String.raw`$$\tau_{\text{loc}}(t)=\varepsilon+\frac{\Delta}{2}\,q(t),\qquad q(t)\in\{+1,-1\}\ \text{at rate }f_d$$`,
        derivation: String.raw`<p><b>Where we start.</b> A tau-dither loop keeps one local PN replica and a dither generator that produces a square wave $q(t)$ alternating between $+1$ and $-1$ at the dither frequency $f_d$ (period $T_d=1/f_d$). Let $\varepsilon$ be the average code-phase error (in chips) between the incoming code and the loop's current estimate, and let $\Delta$ be the early-late spacing.</p>
<p><b>Step 1.</b> Split the dither period into two halves. In the first half $q(t)=+1$: the loop advances the local replica by $\Delta/2$ so its net offset from the incoming code is $\varepsilon+\Delta/2$ — the <em>early</em> gate. In the second half $q(t)=-1$: the loop retards the replica by $\Delta/2$, giving offset $\varepsilon-\Delta/2$ — the <em>late</em> gate.</p>
<p><b>Step 2.</b> Both cases are captured by a single expression: the instantaneous local offset is the average error $\varepsilon$ plus a $\pm\Delta/2$ term whose sign follows $q(t)$. Writing that term as $(\Delta/2)\,q(t)$ reproduces $+\Delta/2$ when $q=+1$ and $-\Delta/2$ when $q=-1$.</p>
<p><b>Result.</b> $\tau_{\text{loc}}(t)=\varepsilon+\tfrac{\Delta}{2}q(t)$. The single correlator thus sees a code phase that hops between the early and late positions at rate $f_d$, so it measures the early and late correlations in alternating half-periods rather than needing two hardware arms. Everything else in the loop — the AM output, the synchronous detector, the S-curve — follows from this one time-shared offset.</p>`
      },
      {
        title: 'Correlator Output: DC + Dither-Frequency AM',
        tex: String.raw`$$y(t)=\frac{A}{2}\big[R(\varepsilon{+}\tfrac{\Delta}{2}){+}R(\varepsilon{-}\tfrac{\Delta}{2})\big]+\frac{A}{2}\big[R(\varepsilon{+}\tfrac{\Delta}{2}){-}R(\varepsilon{-}\tfrac{\Delta}{2})\big]q(t)$$`,
        derivation: String.raw`<p><b>Where we start.</b> The single correlator multiplies the incoming signal by the dithered local code and integrates (low-pass filters). After carrier wipe-off its output equals the signal amplitude $A$ times the code autocorrelation evaluated at the current local offset $\tau_{\text{loc}}(t)=\varepsilon+\tfrac{\Delta}{2}q(t)$: $y(t)=A\,R(\tau_{\text{loc}}(t))$.</p>
<p><b>Step 1.</b> Evaluate the two half-periods. When $q=+1$: $y=A\,R(\varepsilon+\Delta/2)$ (the early value, call it $R_E$). When $q=-1$: $y=A\,R(\varepsilon-\Delta/2)$ (the late value, $R_L$). So $y(t)$ is a two-level square wave switching between $A R_E$ and $A R_L$ at $f_d$.</p>
<p><b>Step 2.</b> Any two-level square wave decomposes into its average (common-mode) and its swing (differential) about that average. The average is $\tfrac{A}{2}(R_E+R_L)$. The half-amplitude swing is $\tfrac{A}{2}(R_E-R_L)$, and it follows the sign of $q(t)$ because $y=A R_E$ exactly when $q=+1$. Hence $y(t)=\tfrac{A}{2}(R_E+R_L)+\tfrac{A}{2}(R_E-R_L)q(t)$.</p>
<p><b>Result.</b> $y(t)=\tfrac{A}{2}[R(\varepsilon{+}\tfrac{\Delta}{2}){+}R(\varepsilon{-}\tfrac{\Delta}{2})]+\tfrac{A}{2}[R(\varepsilon{+}\tfrac{\Delta}{2}){-}R(\varepsilon{-}\tfrac{\Delta}{2})]q(t)$. The first term is a DC bias carrying no sign of $\varepsilon$; the second is a square wave at $f_d$ — a suppressed-carrier amplitude modulation whose envelope is the early-minus-late correlation difference. At $\varepsilon=0$ the differential term is zero (pure DC); a nonzero $\varepsilon$ creates the $f_d$ ripple that the loop reads.</p>`
      },
      {
        title: 'Synchronous Detection Recovers the Discriminator',
        tex: String.raw`$$D(\varepsilon)=\big\langle q(t)\,y(t)\big\rangle_{\text{LPF}}=\frac{A}{2}\big[R(\varepsilon{+}\tfrac{\Delta}{2}){-}R(\varepsilon{-}\tfrac{\Delta}{2})\big]$$`,
        derivation: String.raw`<p><b>Where we start.</b> The dither-frequency term in $y(t)$ holds the signed error, but it is riding on the $f_d$ "carrier" $q(t)$ and sits beside a DC common-mode term. To pull the signed error down to DC we synchronously detect: multiply $y(t)$ by the same dither $q(t)$ and low-pass filter (average).</p>
<p><b>Step 1.</b> Multiply term by term. Using $y(t)=\tfrac{A}{2}(R_E+R_L)+\tfrac{A}{2}(R_E-R_L)q(t)$, we get $q(t)y(t)=\tfrac{A}{2}(R_E+R_L)q(t)+\tfrac{A}{2}(R_E-R_L)q(t)^2$.</p>
<p><b>Step 2.</b> A $\pm1$ square wave satisfies $q(t)^2=1$, so the second term becomes the constant $\tfrac{A}{2}(R_E-R_L)$. The first term is still multiplied by $q(t)$, a zero-mean square wave at $f_d$, so its time-average (and low-pass output) is zero. Thus $\langle q(t)y(t)\rangle=\tfrac{A}{2}(R_E-R_L)$.</p>
<p><b>Result.</b> $D(\varepsilon)=\tfrac{A}{2}[R(\varepsilon{+}\tfrac{\Delta}{2})-R(\varepsilon{-}\tfrac{\Delta}{2})]$. The common-mode bias was swept to $f_d$ and filtered out; the differential (early-minus-late) term was demodulated to DC. This is exactly the coherent early-minus-late discriminator of a two-arm DLL, up to the factor $\tfrac12$ from time-sharing — but obtained with a single correlator whose gain cancels in the difference, so no arm imbalance can bias it.</p>`
      },
      {
        title: 'S-Curve Slope Near Lock',
        tex: String.raw`$$K_D=\left.\frac{dD}{d\varepsilon}\right|_{\varepsilon=0}=-A\quad(\text{triangular }R,\ \lvert\varepsilon\rvert\le\tfrac{\Delta}{2})$$`,
        derivation: String.raw`<p><b>Where we start.</b> The loop gain, and thus the jitter and pull-in range, are set by the discriminator slope at the zero-crossing. Take $D(\varepsilon)=\tfrac{A}{2}[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})]$ with the ideal triangle $R(\tau)=1-\lvert\tau\rvert$, and evaluate near $\varepsilon=0$ for a spacing $\Delta\le1$.</p>
<p><b>Step 1.</b> For small $\varepsilon$ with $\lvert\varepsilon\rvert\le\Delta/2$, both sample offsets stay inside $\pm1$ chip and on the straight flanks. The early offset $\varepsilon+\Delta/2$ is positive, so $R(\varepsilon+\tfrac{\Delta}{2})=1-(\varepsilon+\tfrac{\Delta}{2})$. The late offset $\varepsilon-\Delta/2$ is negative, so $R(\varepsilon-\tfrac{\Delta}{2})=1-\lvert\varepsilon-\tfrac{\Delta}{2}\rvert=1-(\tfrac{\Delta}{2}-\varepsilon)$.</p>
<p><b>Step 2.</b> Subtract: $R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})=[1-\varepsilon-\tfrac{\Delta}{2}]-[1-\tfrac{\Delta}{2}+\varepsilon]=-2\varepsilon$. Multiply by $\tfrac{A}{2}$: $D(\varepsilon)=\tfrac{A}{2}(-2\varepsilon)=-A\varepsilon$. Differentiate: $dD/d\varepsilon=-A$, constant across the whole linear region.</p>
<p><b>Result.</b> $K_D=-A$ for a triangular autocorrelation. The negative sign makes the zero-crossing stable (errors are pushed back to zero). The linear region is exactly $\lvert\varepsilon\rvert\le\Delta/2$; beyond it one sample crosses the peak or a flank end and the curve bends. Compared with a two-arm coherent DLL's slope $-2A$ at $\Delta=1$, the tau-dither slope is half as steep (the $\tfrac12$ time-sharing factor), which the loop-filter gain simply rescales.</p>`
      },
      {
        title: 'Gain-Imbalance Bias in a Two-Arm DLL (and its cancellation)',
        tex: String.raw`$$D_{\text{2arm}}(0)=(g_E-g_L)\,A^2R^2(\tfrac{\Delta}{2})\neq0;\qquad D_{\text{TDL}}(0)=0$$`,
        derivation: String.raw`<p><b>Where we start.</b> A non-coherent two-arm DLL forms $D_{\text{2arm}}=g_E E^2-g_L L^2$, where $g_E,g_L$ are the gains of the early and late processing chains and $E=A R(\varepsilon+\tfrac{\Delta}{2})$, $L=A R(\varepsilon-\tfrac{\Delta}{2})$. We ask what the discriminator reads at perfect alignment $\varepsilon=0$.</p>
<p><b>Step 1.</b> At $\varepsilon=0$ the true correlations are equal because $R$ is even: $E=L=A R(\Delta/2)$. Substitute into the two-arm discriminator: $D_{\text{2arm}}(0)=g_E[A R(\tfrac{\Delta}{2})]^2-g_L[A R(\tfrac{\Delta}{2})]^2=(g_E-g_L)A^2R^2(\tfrac{\Delta}{2})$.</p>
<p><b>Step 2.</b> If the arms are perfectly matched ($g_E=g_L$) this is zero, as desired. But any mismatch $g_E\neq g_L$ leaves a nonzero output at $\varepsilon=0$, so the loop drives the code to a biased offset $\varepsilon_b$ where $D_{\text{2arm}}(\varepsilon_b)=0$ instead — a lock-point shift caused purely by hardware. Now form the tau-dither discriminator: one correlator gives both gates with a single gain $g$, so $D_{\text{TDL}}=\tfrac{g A}{2}[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})]$.</p>
<p><b>Result.</b> At $\varepsilon=0$, $D_{\text{TDL}}(0)=\tfrac{gA}{2}[R(\tfrac{\Delta}{2})-R(\tfrac{\Delta}{2})]=0$ for <em>any</em> gain $g$: the common gain is a multiplicative factor that scales the loop gain but cannot create a zero-error offset. This is the mathematical statement of the tau-dither loop's central advantage — the gain-imbalance bias of the two-arm DLL is removed by construction because a single correlator forms both gates.</p>`
      },
      {
        title: 'Tau-Dither Tracking Jitter with Dither Loss',
        tex: String.raw`$$\sigma_{\text{TDL}}\approx L_d\sqrt{\frac{B_L\,\Delta}{2\,(C/N_0)}}\ \text{[chips]},\qquad L_d\approx1.1\ \text{to}\ 1.4$$`,
        derivation: String.raw`<p><b>Where we start.</b> Noise on the correlator perturbs the discriminator, so the code phase jitters. For a two-arm coherent DLL the 1-sigma code jitter is $\sigma_{\text{DLL}}\approx\sqrt{B_L\Delta/(2\,C/N_0)}$ chips, with $B_L$ the loop noise bandwidth (Hz), $\Delta$ the spacing (chips), and $C/N_0$ a linear ratio in Hz. We want the tau-dither loop's jitter.</p>
<p><b>Step 1.</b> The variance of the code-phase estimate equals the discriminator output-noise variance divided by the square of its slope, shaped by the loop bandwidth. In a two-arm DLL both gates are correlated <em>continuously</em>, so the full integration time contributes to each gate. In the tau-dither loop the single correlator dwells on each gate only part of each dither period, so the effective per-gate integration time is reduced by the dither duty.</p>
<p><b>Step 2.</b> Less integration time per gate means more output-noise variance for the same $C/N_0$. Capturing that as a multiplicative penalty on the standard-deviation gives $\sigma_{\text{TDL}}=L_d\,\sigma_{\text{DLL}}$, where the dither-loss factor $L_d>1$ depends on the duty cycle (how the period splits between early, late, and any dead time), on coherent vs non-coherent detection, and on $B_L/f_d$. A classic 50/50 non-coherent split gives roughly $L_d^2\approx2$, i.e. about $+3$ dB; optimized dithering brings it toward $+1$ dB.</p>
<p><b>Result.</b> $\sigma_{\text{TDL}}\approx L_d\sqrt{B_L\Delta/(2\,C/N_0)}$ chips with $L_d\approx1.1$ to $1.4$. All the usual DLL levers still apply — narrower $\Delta$, narrower $B_L$, higher $C/N_0$ all cut jitter — but the tau-dither loop always carries the extra $L_d$ as the standing price of using one time-shared correlator instead of two continuous ones.</p>`
      },
      {
        title: 'Dither-Rate Selection Window',
        tex: String.raw`$$B_L\ \ll\ f_d\ \ll\ R_c\qquad(\text{loop bandwidth}\ \ll\ \text{dither rate}\ \ll\ \text{chip rate})$$`,
        derivation: String.raw`<p><b>Where we start.</b> The dither frequency $f_d$ is a free parameter, but it must satisfy two physical constraints simultaneously, one setting a lower bound and one an upper bound. Let $B_L$ be the loop noise bandwidth and $R_c$ the chip rate.</p>
<p><b>Step 1 (lower bound).</b> The loop must respond to the <em>average</em> code error $\varepsilon$, not to the dither itself. The synchronous detector demodulates the $f_d$ component to DC only if $f_d$ is well outside the loop's tracking band; if $f_d\sim B_L$ the loop would chase the dither and the error signal could not be cleanly separated from loop dynamics. Hence $f_d\gg B_L$: the dither must be far faster than the loop reacts.</p>
<p><b>Step 2 (upper bound).</b> Each early or late correlation must integrate enough chips to build the autocorrelation peak, so a dither half-period $T_d/2=1/(2f_d)$ must contain many chip intervals $T_c=1/R_c$. Requiring $1/(2f_d)\gg T_c=1/R_c$ gives $f_d\ll R_c$: the dither must be far slower than the chip rate so it does not smear the correlation.</p>
<p><b>Result.</b> The usable window is $B_L\ll f_d\ll R_c$. Inside it, higher $f_d$ gives finer, faster error updates and better rejection of low-frequency common-mode drift but fewer chips per gate; lower $f_d$ integrates more per gate but tracks sluggishly and admits $1/f$ effects. Classic hardware placed $f_d$ at a few hundred hertz for hertz-class loops on megachip-per-second codes — comfortably inside the window.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is a tau-dither loop (TDL)?`, back: String.raw`A DSSS code-tracking loop that uses a single correlator time-shared between an early ($+\Delta/2$) and late ($-\Delta/2$) code position by a square-wave dither $q(t)=\pm1$ at rate $f_d$, replacing the two arms of a DLL.` },
      { front: String.raw`What problem does the tau-dither loop solve versus a two-arm DLL?`, back: String.raw`The gain-imbalance bias: unequal early/late arm gains make a two-arm discriminator nonzero at $\varepsilon=0$ and shift the lock point. One shared correlator removes it because a common gain cancels in the difference.` },
      { front: String.raw`Write the dithered local code phase.`, back: String.raw`$\tau_{\text{loc}}(t)=\varepsilon+\tfrac{\Delta}{2}q(t)$, with $q(t)\in\{+1,-1\}$ at dither rate $f_d$, $\varepsilon$ the average code error, $\Delta$ the early-late spacing.` },
      { front: String.raw`What does the dither do to the correlator output?`, back: String.raw`It amplitude-modulates it at $f_d$: $y(t)$ has a DC common-mode term plus a term $\propto R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})$ times $q(t)$.` },
      { front: String.raw`Why is there no $f_d$ ripple at perfect lock?`, back: String.raw`At $\varepsilon=0$ the early and late correlations are equal (even triangle), so their difference — the amplitude of the $f_d$ term — is zero, leaving pure DC.` },
      { front: String.raw`How is the error signal recovered from $y(t)$?`, back: String.raw`Synchronous detection: multiply $y(t)$ by the dither $q(t)$ and low-pass filter. Since $q^2=1$, the differential term becomes DC and the common-mode term is pushed to $f_d$ and filtered out.` },
      { front: String.raw`Write the tau-dither discriminator.`, back: String.raw`$D(\varepsilon)=\tfrac{A}{2}[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})]$ — the early-minus-late S-curve, from a single correlator.` },
      { front: String.raw`What is the S-curve slope near lock for a triangular $R$?`, back: String.raw`$K_D=dD/d\varepsilon|_0=-A$, valid over the linear region $\lvert\varepsilon\rvert\le\Delta/2$. The negative sign makes the zero-crossing stable.` },
      { front: String.raw`How does the TDL slope compare with a two-arm coherent DLL?`, back: String.raw`The TDL carries an extra factor $\tfrac12$ (slope $-A$ vs $-2A$ at $\Delta=1$) from time-sharing; the loop-filter gain rescales to compensate.` },
      { front: String.raw`What is the dither (time-sharing) loss?`, back: String.raw`Because one correlator watches each gate only part of the time, the effective integration per gate drops, raising jitter by a factor $L_d\approx1.1$ to $1.4$ ($+1$ to $3$ dB) over an ideal DLL.` },
      { front: String.raw`Give the tau-dither tracking-jitter formula.`, back: String.raw`$\sigma_{\text{TDL}}\approx L_d\sqrt{B_L\Delta/(2\,C/N_0)}$ chips, with $B_L$ in Hz, $\Delta$ in chips, $C/N_0$ a linear ratio in Hz, and $L_d$ the dither-loss factor.` },
      { front: String.raw`What is the design window for the dither rate $f_d$?`, back: String.raw`$B_L\ll f_d\ll R_c$: well above the loop bandwidth (so the loop ignores the dither) and well below the chip rate (so each gate integrates many chips).` },
      { front: String.raw`Why must $f_d\gg B_L$?`, back: String.raw`So the loop responds to the average error, not the dither; the synchronous detector can then cleanly demodulate the $f_d$ term to DC without the loop chasing the dither.` },
      { front: String.raw`Why must $f_d\ll R_c$?`, back: String.raw`Each early/late correlation needs many chips to build the autocorrelation peak; a dither half-period must contain many chip intervals, so $1/(2f_d)\gg T_c$.` },
      { front: String.raw`What is dithering self-noise and how is it minimized?`, back: String.raw`Switching transients and residual $f_d$ leakage past the detector. Minimized with a clean 50/50 duty cycle, a synchronous detector locked exactly to $q(t)$, and an LPF rejecting $f_d$ and its harmonics.` },
      { front: String.raw`Why is trading bias for jitter usually a good deal?`, back: String.raw`A fixed bias corrupts every measurement identically and cannot be averaged out; extra zero-mean jitter averages down with loop filtering and integration time.` }
    ],
    mcqs: [
      { q: String.raw`The primary motivation for the tau-dither loop over a two-arm non-coherent DLL is to:`, options: [String.raw`increase processing gain`, String.raw`remove the early/late gain-imbalance bias and halve the correlator hardware`, String.raw`eliminate carrier tracking`, String.raw`widen the pull-in region`], answer: 1, explain: String.raw`One time-shared correlator forms both gates with a single gain, so no arm mismatch can bias the lock point, and only one correlator is needed.` },
      { q: String.raw`How many correlators does a tau-dither loop use?`, options: [String.raw`Zero`, String.raw`One (time-shared)`, String.raw`Two (parallel)`, String.raw`Three (E/P/L)`], answer: 1, explain: String.raw`The defining feature of the TDL is a single correlator dithered between the early and late positions in time.` },
      { q: String.raw`In $\tau_{\text{loc}}(t)=\varepsilon+\tfrac{\Delta}{2}q(t)$, the quantity $q(t)$ is:`, options: [String.raw`the code chip stream`, String.raw`a square wave $\pm1$ at the dither rate $f_d$`, String.raw`the carrier phase`, String.raw`the data bits`], answer: 1, explain: String.raw`$q(t)$ is the dither square wave that toggles the local code between the early ($+\Delta/2$) and late ($-\Delta/2$) positions at rate $f_d$.` },
      { q: String.raw`The dither-frequency component of the correlator output $y(t)$ has amplitude proportional to:`, options: [String.raw`$R(\varepsilon+\tfrac{\Delta}{2})+R(\varepsilon-\tfrac{\Delta}{2})$`, String.raw`$R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})$`, String.raw`$R(\varepsilon)$ only`, String.raw`the chip rate $R_c$`], answer: 1, explain: String.raw`The differential (AM) term carries the early-minus-late difference; the sum term is the DC common-mode part.` },
      { q: String.raw`At perfect code alignment ($\varepsilon=0$), the $f_d$ ripple on the correlator output is:`, options: [String.raw`maximum`, String.raw`zero`, String.raw`equal to the DC term`, String.raw`inverted`], answer: 1, explain: String.raw`The early and late correlations are equal at $\varepsilon=0$, so their difference — the ripple amplitude — vanishes, leaving pure DC.` },
      { q: String.raw`The error signal is recovered from $y(t)$ by:`, options: [String.raw`squaring it`, String.raw`multiplying by the dither $q(t)$ then low-pass filtering (synchronous detection)`, String.raw`differentiating it`, String.raw`taking its envelope`], answer: 1, explain: String.raw`Multiplying by $q(t)$ (with $q^2=1$) demodulates the differential term to DC and moves the common-mode term to $f_d$, which the LPF removes.` },
      { q: String.raw`The recovered tau-dither discriminator is:`, options: [String.raw`$\tfrac{A}{2}[R(\varepsilon+\tfrac{\Delta}{2})+R(\varepsilon-\tfrac{\Delta}{2})]$`, String.raw`$\tfrac{A}{2}[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})]$`, String.raw`$A^2 R(\varepsilon)$`, String.raw`$A\,R(\varepsilon)q(t)$`], answer: 1, explain: String.raw`Synchronous detection yields the early-minus-late difference scaled by $A/2$ — the S-curve.` },
      { q: String.raw`For a triangular autocorrelation, the tau-dither S-curve slope at $\varepsilon=0$ is:`, options: [String.raw`$+A$`, String.raw`$-A$`, String.raw`$-2A$`, String.raw`$0$`], answer: 1, explain: String.raw`$D(\varepsilon)=-A\varepsilon$ in the linear region, so $dD/d\varepsilon|_0=-A$; the negative slope makes the lock point stable.` },
      { q: String.raw`The linear pull-in region of the tau-dither discriminator spans:`, options: [String.raw`$\lvert\varepsilon\rvert\le1$ chip`, String.raw`$\lvert\varepsilon\rvert\le\Delta/2$`, String.raw`$\lvert\varepsilon\rvert\le\Delta$`, String.raw`$\lvert\varepsilon\rvert\le2\Delta$`], answer: 1, explain: String.raw`Within $\lvert\varepsilon\rvert\le\Delta/2$ both samples stay on the straight flanks and $D$ is linear; beyond it the curve bends.` },
      { q: String.raw`Relative to an ideal two-arm DLL, the tau-dither loop's tracking jitter is:`, options: [String.raw`lower by 3 dB`, String.raw`identical`, String.raw`higher by roughly 1 to 3 dB (dither loss)`, String.raw`higher by 10 dB`], answer: 2, explain: String.raw`Time-sharing one correlator reduces the effective integration per gate, so jitter rises by the dither-loss factor $L_d$ ($+1$ to $3$ dB).` },
      { q: String.raw`The dither loss arises because:`, options: [String.raw`the code rate is halved`, String.raw`each gate (early/late) is observed only part of each dither period`, String.raw`the carrier is unlocked`, String.raw`the spacing $\Delta$ is doubled`], answer: 1, explain: String.raw`One correlator dwells on each gate only a fraction of the dither period, cutting the effective integration time per gate and raising noise.` },
      { q: String.raw`The correct design window for the dither rate is:`, options: [String.raw`$f_d\ll B_L\ll R_c$`, String.raw`$B_L\ll f_d\ll R_c$`, String.raw`$R_c\ll f_d\ll B_L$`, String.raw`$f_d\approx R_c$`], answer: 1, explain: String.raw`Well above the loop bandwidth so the loop ignores the dither, and well below the chip rate so each gate integrates many chips.` },
      { q: String.raw`If $f_d$ were made comparable to the loop bandwidth $B_L$, the loop would:`, options: [String.raw`track faster with no penalty`, String.raw`chase the dither, corrupting error separation`, String.raw`have zero jitter`, String.raw`stop despreading`], answer: 1, explain: String.raw`With $f_d\sim B_L$ the loop responds to the dither itself, so the synchronous detector cannot cleanly separate the average error from loop dynamics.` },
      { q: String.raw`Why is a gain-imbalance bias worse than extra random jitter?`, options: [String.raw`bias averages out over time; jitter does not`, String.raw`bias corrupts every measurement identically and cannot be averaged out, while jitter is zero-mean and averages down`, String.raw`they are equivalent`, String.raw`jitter shifts the lock point permanently`], answer: 1, explain: String.raw`A fixed bias is a systematic error the loop filter cannot remove; zero-mean jitter reduces with integration and filtering.` },
      { q: String.raw`In the tau-dither discriminator $D_{\text{TDL}}=\tfrac{gA}{2}[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})]$, a change in the single gain $g$:`, options: [String.raw`shifts the lock point`, String.raw`scales the loop gain but keeps $D(0)=0$`, String.raw`creates a bias at $\varepsilon=0$`, String.raw`inverts the S-curve permanently`], answer: 1, explain: String.raw`$g$ is a common multiplicative factor; at $\varepsilon=0$ the bracket is zero for any $g$, so the lock point is unbiased — only the loop gain scales.` },
      { q: String.raw`Dithering self-noise is best reduced by:`, options: [String.raw`raising the data rate`, String.raw`a clean 50/50 duty cycle, a detector locked to $q(t)$, and an LPF rejecting $f_d$ and its harmonics`, String.raw`removing the loop filter`, String.raw`using two correlators`], answer: 1, explain: String.raw`Matched, symmetric dithering and detection plus proper filtering suppress switching transients and residual $f_d$ leakage.` }
    ],
    numericals: [
      {
        q: String.raw`A tau-dither loop uses spacing $\Delta=1$ chip and a triangular autocorrelation $R(\tau)=1-\lvert\tau\rvert$. For a code error $\varepsilon=0.2$ chip, compute the discriminator $D(\varepsilon)$ in units of amplitude $A$.`,
        solution: String.raw`<p><b>Formula.</b> $$D(\varepsilon)=\frac{A}{2}\big[R(\varepsilon+\tfrac{\Delta}{2})-R(\varepsilon-\tfrac{\Delta}{2})\big],\qquad R(\tau)=1-\lvert\tau\rvert.$$</p>
<p><b>Substitute.</b> With $\Delta=1$, $\varepsilon=0.2$: early offset $=0.2+0.5=0.7$, late offset $=0.2-0.5=-0.3$. So $R(0.7)=1-0.7=0.3$ and $R(-0.3)=1-0.3=0.7$.</p>
<p><b>Compute.</b> $D=\tfrac{A}{2}(0.3-0.7)=\tfrac{A}{2}(-0.4)=\mathbf{-0.2\,A}$.</p>
<p><b>Explanation.</b> The negative output for a positive (late) error is the negative-slope behaviour that pulls the loop back to lock. Note $D=-0.2A=-A\varepsilon$ with $\varepsilon=0.2$, confirming the near-lock slope $K_D=-A$ derived for a triangular $R$. This is exactly half the value a two-arm coherent DLL ($E-L=-0.4A$) would give — the $\tfrac12$ time-sharing factor.</p>`
      },
      {
        q: String.raw`A two-arm non-coherent DLL has early-arm gain $g_E=1.05$ and late-arm gain $g_L=0.95$ (a 10% imbalance), spacing $\Delta=1$, triangular $R$. Find the discriminator value at perfect alignment $\varepsilon=0$ (in units of $A^2$), and contrast with the tau-dither loop.`,
        solution: String.raw`<p><b>Formula.</b> $$D_{\text{2arm}}(0)=(g_E-g_L)\,A^2R^2(\tfrac{\Delta}{2}),\qquad D_{\text{TDL}}(0)=\tfrac{gA}{2}\big[R(\tfrac{\Delta}{2})-R(\tfrac{\Delta}{2})\big].$$</p>
<p><b>Substitute.</b> $\Delta=1$ so $R(\Delta/2)=R(0.5)=1-0.5=0.5$, hence $R^2(0.5)=0.25$. Gains: $g_E-g_L=1.05-0.95=0.10$.</p>
<p><b>Compute.</b> $D_{\text{2arm}}(0)=0.10\times A^2\times0.25=\mathbf{0.025\,A^2}$ (nonzero). $D_{\text{TDL}}(0)=\tfrac{gA}{2}[0.5-0.5]=\mathbf{0}$.</p>
<p><b>Explanation.</b> The 10% arm imbalance leaves the two-arm discriminator reading $0.025A^2$ at true alignment, so the loop settles at a biased offset where that is cancelled by the S-curve slope — a systematic code error. The tau-dither loop reads exactly zero at $\varepsilon=0$ regardless of its single gain $g$, because the common gain cancels in the difference. This is the quantitative statement of the TDL's central advantage.</p>`
      },
      {
        q: String.raw`Estimate the tau-dither code jitter for $B_L=1$ Hz, $\Delta=0.5$ chip, $C/N_0=40$ dB-Hz, with a dither-loss factor $L_d=1.4$ (about $+3$ dB). Compare with the ideal two-arm DLL jitter.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_{\text{DLL}}=\sqrt{\frac{B_L\,\Delta}{2\,(C/N_0)}},\qquad \sigma_{\text{TDL}}=L_d\,\sigma_{\text{DLL}},$$ with $C/N_0$ a linear ratio in Hz.</p>
<p><b>Substitute.</b> $C/N_0=10^{40/10}=10^4$ Hz. $\sigma_{\text{DLL}}=\sqrt{\dfrac{1\times0.5}{2\times10^4}}=\sqrt{\dfrac{0.5}{20000}}$.</p>
<p><b>Compute.</b> $\dfrac{0.5}{20000}=2.5\times10^{-5}$; $\sigma_{\text{DLL}}=\sqrt{2.5\times10^{-5}}=5.0\times10^{-3}$ chip. Then $\sigma_{\text{TDL}}=1.4\times5.0\times10^{-3}=\mathbf{7.0\times10^{-3}}$ chip.</p>
<p><b>Explanation.</b> The ideal DLL jitters at $5.0$ millichips; the tau-dither loop at $7.0$ millichips — a factor $1.4$ ($+3$ dB) worse, purely from time-sharing one correlator. Both are excellent (well under a hundredth of a chip); the modest extra jitter buys the removal of the gain-imbalance bias and half the hardware.</p>`
      },
      {
        q: String.raw`A DSSS system has chip rate $R_c=1.023$ Mcps and a code loop bandwidth $B_L=2$ Hz. Choose a dither rate $f_d$ two orders of magnitude above $B_L$ and check it is well below $R_c$. How many chips fall in one dither half-period?`,
        solution: String.raw`<p><b>Formula.</b> Design window $B_L\ll f_d\ll R_c$. Pick $f_d=100\,B_L$; chips per half-period $N=\dfrac{1}{2f_d}\Big/T_c=\dfrac{R_c}{2f_d}$, where $T_c=1/R_c$.</p>
<p><b>Substitute.</b> $f_d=100\times2=200$ Hz. Check: $f_d/B_L=200/2=100$ (well above $B_L$) and $R_c/f_d=1.023\times10^6/200\approx5115$ (well below $R_c$). Chips per half-period $N=\dfrac{1.023\times10^6}{2\times200}$.</p>
<p><b>Compute.</b> $N=\dfrac{1.023\times10^6}{400}=\mathbf{2558}$ chips per dither half-period. The dither sits $100\times$ above the loop and about $5000\times$ below the chip rate.</p>
<p><b>Explanation.</b> $f_d=200$ Hz lands comfortably inside $B_L\ll f_d\ll R_c$. Each early or late gate integrates roughly $2558$ chips — plenty to build the autocorrelation peak — while the loop, reacting at $\sim2$ Hz, treats the $200$ Hz dither as a fast carrier it can synchronously detect. This matches the classic few-hundred-hertz dither used with megachip codes.</p>`
      },
      {
        q: String.raw`For the tau-dither loop of the previous jitter example ($\sigma_{\text{TDL}}=7.0\times10^{-3}$ chip) on a $R_c=1.023$ Mcps GPS C/A code, convert the tracking jitter to an equivalent pseudorange jitter in metres.`,
        solution: String.raw`<p><b>Formula.</b> $$\ell_{\text{chip}}=\frac{c}{R_c},\qquad \sigma_{\text{range}}=\sigma_{\text{TDL}}\,\ell_{\text{chip}},$$ with $c=3\times10^8$ m/s the speed of light.</p>
<p><b>Substitute.</b> $\ell_{\text{chip}}=\dfrac{3\times10^8}{1.023\times10^6}$ m; $\sigma_{\text{range}}=7.0\times10^{-3}\times\ell_{\text{chip}}$.</p>
<p><b>Compute.</b> $\ell_{\text{chip}}=293.3$ m/chip; $\sigma_{\text{range}}=7.0\times10^{-3}\times293.3=\mathbf{2.05}$ m.</p>
<p><b>Explanation.</b> One C/A chip spans about $293$ m of range, so a $7.0$-millichip tau-dither jitter maps to roughly $2.05$ m of ranging noise — before carrier smoothing. The equivalent ideal-DLL value ($5.0$ millichips) would be about $1.47$ m; the $\sim0.6$ m difference is the ranging cost of the dither loss, traded for the elimination of the imbalance bias.</p>`
      },
      {
        q: String.raw`A classic 50/50 non-coherent tau-dither loop has a dither loss quoted as $L_d^2\approx2$. Express this loss in dB, and state the multiplicative factor on the 1-sigma jitter.`,
        solution: String.raw`<p><b>Formula.</b> $$\text{Loss (dB)}=10\log_{10}(L_d^2),\qquad L_d=\sqrt{L_d^2}.$$ The variance scales by $L_d^2$; the standard deviation (jitter) scales by $L_d$.</p>
<p><b>Substitute.</b> $L_d^2=2$: Loss $=10\log_{10}(2)$; $L_d=\sqrt{2}$.</p>
<p><b>Compute.</b> $10\log_{10}(2)=10\times0.3010=\mathbf{3.01}$ dB. Jitter factor $L_d=\sqrt{2}=\mathbf{1.414}$.</p>
<p><b>Explanation.</b> A doubling of noise variance is the familiar $3$ dB, and it multiplies the 1-sigma jitter by $\sqrt2\approx1.41$. This is the textbook worst-case tau-dither penalty for the simple 50/50 non-coherent design; optimized dithering and double-dither variants recover much of it, bringing the loss toward $1$ dB (a jitter factor near $1.12$).</p>`
      }
    ],
    realWorld: String.raw`<p>The tau-dither loop earned its place in early and hardware-limited spread-spectrum receivers, where duplicating an entire analog correlator arm — mixer, integrate-and-dump, envelope detector, and gain stage — was expensive and where matching two such arms tightly enough to avoid a gain-imbalance bias was harder still. By dithering one correlator between the early and late positions at a few hundred hertz and synchronously detecting the result, a receiver got an unbiased early-minus-late S-curve from half the hardware. The same idea appears in tau-dither circuits patented for consumer and military DSSS gear and in the code-tracking front ends of early GPS and CDMA designs, and it remains a clean teaching model for how one correlator can do a two-correlator job by trading space for time.</p>
<p>In modern all-digital GNSS and CDMA receivers, correlators are cheap logic, so the full multi-correlator DLL (often with narrow spacing and extra taps for multipath estimation) is usually preferred and the tau-dither loss is no longer worth paying. But the tau-dither principle still matters: it is the canonical example of time-sharing a scarce resource to cancel a systematic error, and its descendants — double-dither loops that recover most of the noise loss, and dithered discriminators that self-calibrate gain — live on wherever hardware or power is tight. Understanding the dither/synchronous-detection chain also illuminates the general lesson that a fixed bias is more dangerous than extra zero-mean noise, which guides discriminator and calibration design across the whole field.</p>`,
    related: ['delay-lock-tracking', 'dsss-tracking', 'split-bit-tracking', 'early-late-correlator']
  }
);
