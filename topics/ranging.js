/* ranging.js — "Ranging (PN / Pseudorange)" topic (RF Link & Metrics).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "ranging-" to avoid collisions.
   Covers time-of-flight ranging, PN code-phase ranging, the pseudorange and
   receiver clock bias, the 4-satellite navigation solution, carrier-phase
   ranging with integer ambiguity, ambiguity resolution, and the error budget. */
CONTENT.topics.push(
  {
    id: 'ranging',
    title: 'Ranging (PN / Pseudorange)',
    category: 'RF Link & Metrics',
    tags: ['ranging', 'pseudorange', 'time of flight', 'PN code', 'code phase', 'clock bias', 'carrier phase', 'integer ambiguity', 'DOP', 'GNSS', 'TOA', 'TDOA'],
    summary: String.raw`Ranging turns propagation time into distance: $R=c\,\tau$ one-way or $R=c\,\tau_{rt}/2$ two-way. PN code-phase ranging reads $\tau$ off the correlation-peak position to a small fraction of a chip (each chip spans $c/R_c$ metres) with an unambiguous window of one code period $c\,N\,T_c$. Because the receiver clock is offset by $\delta t$, every measured range is a <em>pseudorange</em> $\rho=R+c\,\delta t+\text{errors}$; four satellites solve the three position coordinates and the clock bias together. Carrier phase adds millimetre precision at the price of an integer-cycle ambiguity $N\lambda$, and the total error budget (thermal jitter, multipath, ionosphere, troposphere, clocks) is scaled into position error by the DOP geometry factor.`,
    prerequisites: ['dsss', 'pn-codes', 'correlation'],
    intro: String.raw`<p><strong>Why can a radio measure distance at all?</strong> Because electromagnetic waves travel at a known, constant speed: $c\approx3\times10^8$ m/s in vacuum. If you can measure how long a signal took to get from a transmitter to a receiver — the propagation delay $\tau$ — you know the distance: $R=c\,\tau$. Every radio-ranging system ever built, from WWII radar to GPS in your phone to the transponders that track deep-space probes, is at heart a clock attached to an antenna. The whole engineering problem collapses into one question: <em>how precisely, and how unambiguously, can you timestamp the arrival of a signal?</em> At $c$, a nanosecond of timing error is 30 cm of range error — so ranging is timing, and timing is everything.</p>
<p>Pseudo-noise (PN) codes are the great enabler. A PN sequence has a razor-sharp autocorrelation: correlate the incoming code against a local replica and the output is essentially zero everywhere except a single triangular peak, one chip wide, exactly where the replica delay matches the propagation delay. Slide the replica until the peak appears and you have read $\tau$ directly off the code phase — to a small fraction of a chip, thanks to a tracking loop. The chip length $c/R_c$ sets the ruler's tick spacing, and the code period sets how far the ruler reaches before it wraps around and repeats: the <strong>ambiguity</strong> problem. Long codes measure far; short codes measure fast; real systems layer them.</p>
<p>One stubborn obstacle remains: the receiver's clock is <em>not</em> synchronized to the transmitter's. A cheap crystal oscillator may be off by milliseconds — at $c$, that is hundreds of kilometres of apparent range error, identical on every measurement. The masterstroke of satellite navigation is not to fight this bias but to <em>solve for it</em>: each measured range is a <strong>pseudorange</strong> $\rho=R+c\,\delta t$, contaminated by the same unknown clock offset, and with four (or more) satellites the receiver solves simultaneously for its three position coordinates <em>and</em> its clock bias. This topic builds the whole chain: one-way and two-way time-of-flight, PN code-phase ranging and its resolution/ambiguity trade, the pseudorange equation and the navigation solution, millimetre-class carrier-phase ranging with its integer ambiguity, and the error budget — thermal jitter, multipath, atmosphere, clocks — scaled into position error by geometry (DOP).</p>`,
    sections: [
      {
        h: 'Why ranging: distance is propagation time',
        html: String.raw`<p><strong>Why is time-of-flight the universal ranging method?</strong> Because radio waves travel at essentially exactly $c=2.998\times10^8$ m/s (in vacuum; a whisker slower in air), and $c$ is the most precisely known constant in physics. Measure the propagation delay $\tau$ between transmission and reception, multiply by $c$, and you have the distance — no signal-strength calibration, no assumptions about antennas or path loss. Contrast this with received-signal-strength (RSSI) ranging, where the path-loss exponent, fading, and antenna gains make a 10 dB uncertainty — a factor of about 3 in distance — routine. Time-of-flight is the method of choice whenever accuracy matters.</p>
<p>The catch is the scale. Light covers:</p>
<table class="data">
<tr><th>Timing error</th><th>Range error</th><th>Context</th></tr>
<tr><td>1 ms</td><td>300 km</td><td>typical cheap-crystal clock bias</td></tr>
<tr><td>1 &mu;s</td><td>300 m</td><td>one C/A-code chip is 0.98 &mu;s</td></tr>
<tr><td>1 ns</td><td>30 cm</td><td>survey-grade code ranging</td></tr>
<tr><td>10 ps</td><td>3 mm</td><td>carrier-phase ranging</td></tr>
</table>
<p>So the entire discipline of ranging is a fight for timing precision (how finely can you split the arrival time?), timing <em>ambiguity</em> (over what span is the answer unique?), and timing <em>reference</em> (whose clock do you trust?). PN codes attack the first two; the pseudorange trick disposes of the third.</p>
<div class="callout"><strong>Intuition:</strong> ranging is the lightning-and-thunder trick done with radio. You see the flash (the transmit epoch, known from the signal's timestamp), you hear the thunder (the code arrives), and the delay between them times the distance. The only difference: light is a million times faster than sound, so your stopwatch must be a million times better.</div>`
      },
      {
        h: 'One-way and two-way ranging: TOA, TDOA, transponders',
        html: String.raw`<p>There are two basic geometries, distinguished by <em>whose clock measures what</em>.</p>
<p><strong>One-way ranging (time of arrival, TOA).</strong> The transmitter stamps the signal with its transmit epoch $t_{tx}$ (embedded in the data, as GPS does); the receiver notes the arrival epoch $t_{rx}$ on its own clock and forms $\tau=t_{rx}-t_{tx}$, so $R=c\,\tau$. The delay is measured <em>once</em>, but across <em>two different clocks</em> — so any offset between them corrupts $\tau$ directly. One-way ranging therefore demands either synchronized clocks (atomic clocks on GPS satellites, steered by the control segment) or the pseudorange trick of solving the offset out (next sections).</p>
<p><strong>Two-way ranging.</strong> The interrogator transmits, a transponder (or a passive reflector, as in radar and laser ranging) returns the signal, and the interrogator measures the round-trip time $\tau_{rt}$ on <em>its own single clock</em>: $R=c\,\tau_{rt}/2$. Clock synchronization is not needed at all — the same clock starts and stops the stopwatch — which is why two-way is used wherever you control both ends: radar, aviation DME, deep-space transponders, UWB indoor tags, and satellite laser ranging. The costs: the transponder's internal turnaround delay must be calibrated and subtracted, the link must be closed twice (path loss counts both ways — for a passive radar reflector the echo power falls as $1/R^4$), and the channel is occupied by a dialogue rather than a broadcast.</p>
<p><strong>TDOA (time difference of arrival).</strong> A receiver that cannot know absolute transmit epochs can still measure the <em>difference</em> in arrival times of the same signal at two synchronized stations (or of two synchronized transmitters at one receiver). Each TDOA constrains the position to a hyperboloid rather than a sphere; multiple pairs intersect to fix the position. LORAN, multilateration aircraft surveillance, and E911 cell-network location all work this way. Note the duality: TOA needs the <em>user</em> synchronized to the transmitters; TDOA moves the synchronization burden onto the <em>infrastructure</em>.</p>
<table class="data">
<tr><th>Scheme</th><th>Formula</th><th>Clock requirement</th><th>Examples</th></tr>
<tr><td>One-way TOA</td><td>$R=c\,\tau$</td><td>both ends synchronized (or solve bias)</td><td>GPS/GNSS pseudoranging</td></tr>
<tr><td>Two-way</td><td>$R=c\,\tau_{rt}/2$</td><td>one clock only</td><td>radar, DME, deep-space transponders, UWB</td></tr>
<tr><td>TDOA</td><td>$c\,\Delta\tau=$ range difference</td><td>infrastructure synchronized, user free-running</td><td>LORAN, multilateration, E911</td></tr>
</table>`
      },
      {
        h: 'PN code-phase ranging: reading delay off the correlation peak',
        html: String.raw`<p>To measure $\tau$ you need a distinctive timing mark on the signal. A single sharp pulse works (radar) but concentrates all the energy into an instant — poor for power-limited links and easy to jam. The spread-spectrum answer is to transmit a <strong>PN code</strong>: a long $\pm1$ chip sequence at rate $R_c$ whose autocorrelation is the narrow triangle $R(\tau)=1-\lvert\tau\rvert$ (in chips), essentially zero beyond one chip. The timing mark is now smeared over the whole code — every chip contributes — yet the correlation compresses it all back into one peak.</p>
<p>The receiver runs a local replica of the known code and correlates it with the incoming signal at trial delays (a sliding-correlator or FFT search for acquisition, then a delay-lock loop for tracking). The correlation output is maximal when the replica delay equals the propagation delay $\tau$: <em>the position of the peak is the range measurement</em>. Three numbers characterize the ruler this builds:</p>
<ul>
<li><strong>Tick spacing (chip length):</strong> one chip lasts $T_c=1/R_c$ and spans $\ell_{\text{chip}}=c\,T_c=c/R_c$ metres. GPS C/A code at $R_c=1.023$ Mcps: 293 m per chip; P(Y) code at 10.23 Mcps: 29.3 m per chip. Faster chips, finer ruler.</li>
<li><strong>Reading precision:</strong> the tracking loop interpolates the peak to a small fraction of a chip — typically $10^{-2}$ to $10^{-3}$ chip at good $C/N_0$ — so code ranging resolves metres even with 300-m chips. The jitter law is quantified in the error-budget section.</li>
<li><strong>Reach before wrap-around (unambiguous range):</strong> the code repeats every $N$ chips, so delays $\tau$ and $\tau+N\,T_c$ produce identical correlations. The measurement is unique only within one code period: $R_u=c\,N\,T_c$. The C/A code (1023 chips, 1 ms) wraps every $\approx300$ km — much shorter than the 20&thinsp;200+ km to a GPS satellite, so the receiver resolves the whole number of code epochs from the data-message timestamps; the P(Y) code, one week long, never wraps in practice.</li>
</ul>
<div class="callout"><strong>Key picture:</strong> the PN code is a tape measure made of code phase. $R_c$ sets the fineness of the millimetre marks, the tracking loop reads between the marks, and the code period is the length of the tape — past its end, the reading wraps and you must count laps some other way.</div>`
      },
      {
        h: 'The pseudorange: measuring with an unsynchronized clock',
        html: String.raw`<p>One-way ranging compares the transmit epoch (stamped by the satellite's atomic clock, held to nanoseconds of system time) against the receive epoch measured on the <em>receiver's</em> clock — a free-running crystal that may be off by milliseconds. Call the receiver clock offset from system time $\delta t_r$ (and the residual satellite clock error $\delta t^s$). The measured delay is then wrong by exactly $\delta t_r-\delta t^s$, and the inferred range is</p>
<p>$$\rho=R+c\,(\delta t_r-\delta t^s)+I+T+\varepsilon,$$</p>
<p>where $R$ is the true geometric range, $I$ and $T$ are the ionospheric and tropospheric delays (both add apparent range), and $\varepsilon$ lumps multipath and receiver noise. Because $\rho$ is not the true range, it is called the <strong>pseudorange</strong> — a range polluted by clocks.</p>
<p>Two observations turn this from a bug into a feature:</p>
<ul>
<li>The satellite clock term $c\,\delta t^s$ is <em>broadcast</em>: the control segment monitors each satellite's clock and transmits polynomial corrections in the navigation message, so the receiver removes it.</li>
<li>The receiver clock term $c\,\delta t_r$ is unknown but <strong>identical on every satellite measured at the same instant</strong> — one clock, one bias. A common unknown shared across equations can be solved for like any other coordinate.</li>
</ul>
<p>So instead of buying an atomic clock for every phone, the system carries the atomic clocks on the satellites and lets each receiver estimate its own bias for free. Every GNSS receiver is therefore also a time-transfer instrument: after the fix, it knows system time to tens of nanoseconds — which is exactly how cellular base stations, power grids, and stock exchanges get their time.</p>
<div class="callout tip"><strong>Tip:</strong> a 1 ms receiver clock error is 300 km of pseudorange bias — a thousand times the metre-level errors from everything else. Never confuse pseudorange accuracy (dominated by the clock) with pseudorange <em>precision</em> (the noise), because the bias cancels perfectly in the navigation solution while the noise does not.</div>`
      },
      {
        h: 'Four satellites, four unknowns: the navigation solution',
        html: String.raw`<p>After removing the broadcast satellite-clock and atmospheric model terms, each pseudorange to satellite $i$ at known position $\mathbf{r}^i$ constrains the receiver position $\mathbf{r}=(x,y,z)$ and clock bias $b=c\,\delta t_r$:</p>
<p>$$\rho_i=\lVert\mathbf{r}^i-\mathbf{r}\rVert+b+\varepsilon_i .$$</p>
<p>There are <strong>four unknowns</strong> — three coordinates plus the bias — so <strong>four satellites</strong> give four equations and a unique fix (more satellites give an overdetermined least-squares solution, which is the normal case). Geometrically: without the bias, each pseudorange would put the receiver on a sphere centred on its satellite, and three spheres intersect at a point. The unknown bias inflates or deflates <em>all</em> the spheres by the same amount $b$; the fourth measurement pins down how much.</p>
<p>The equations are nonlinear (the norm), so the receiver linearizes about a guessed position and iterates (Gauss-Newton). Expanding to first order around the guess $\mathbf{r}_0,b_0$ gives, for each satellite,</p>
<p>$$\Delta\rho_i=-\,\mathbf{u}_i\cdot\Delta\mathbf{r}+\Delta b,$$</p>
<p>where $\mathbf{u}_i$ is the unit line-of-sight vector from receiver to satellite $i$. Stacking these rows builds the <strong>geometry matrix</strong> $G$ (each row $[-\mathbf{u}_i^T\;\;1]$), and the least-squares update is $\Delta\mathbf{x}=(G^TG)^{-1}G^T\,\Delta\boldsymbol{\rho}$. Two or three iterations converge from even a wildly wrong initial guess, because the geometry is gentle at satellite distances.</p>
<p>The same matrix $G$ measures how <em>well-conditioned</em> the geometry is. The covariance of the solution is $(G^TG)^{-1}\sigma_{\text{UERE}}^2$, and the scalar summary is the <strong>dilution of precision</strong>: $\sigma_{\text{pos}}=\text{DOP}\times\sigma_{\text{UERE}}$. Satellites clustered together in the sky make near-parallel rows in $G$, a nearly singular $G^TG$, and a large DOP — the classic surveyor's rule that good fixes need widely spread satellites. Typical open-sky PDOP is 1.5&ndash;2.5; in an urban canyon it can exceed 10.</p>`
      },
      {
        h: 'Carrier-phase ranging: millimetre ruler, unknown lap count',
        html: String.raw`<p>The code is not the only timing mark on the signal — the <strong>carrier itself</strong> is a far finer one. The GPS L1 carrier at 1575.42 MHz has a wavelength $\lambda=c/f\approx19$ cm, and a phase-lock loop routinely tracks the carrier phase to better than 1% of a cycle: <em>a couple of millimetres of range</em>. The carrier-phase observable (in cycles) is</p>
<p>$$\Phi=\frac{R}{\lambda}+\frac{c\,(\delta t_r-\delta t^s)}{\lambda}+N+\varepsilon_\phi ,$$</p>
<p>identical in structure to the pseudorange <em>except</em> for the extra term $N$: an unknown <strong>integer number of whole cycles</strong>. A sinusoid looks the same every cycle, so the PLL can measure the fractional phase exquisitely but has no idea how many whole wavelengths lie along the path — about $10^8$ of them for a GNSS satellite. This is the <strong>integer ambiguity</strong>, the carrier's version of the code-period wrap-around, except the ruler now wraps every 19 cm instead of every 300 km.</p>
<p>The standard architecture is therefore a two-scale ruler, <strong>code coarse + carrier fine</strong>:</p>
<ul>
<li>the code pseudorange gives an unambiguous but noisy (metre-level) range;</li>
<li>it brackets the carrier ambiguity to a handful of candidate integers;</li>
<li>an ambiguity-resolution algorithm (differencing between receivers and satellites to cancel clocks and atmosphere, then an integer search such as LAMBDA) fixes $N$ exactly;</li>
<li>once $N$ is fixed, the carrier delivers millimetre-to-centimetre ranging as long as lock is maintained — a cycle slip forces re-fixing.</li>
</ul>
<p>Even without fixing $N$, the carrier earns its keep: <strong>carrier smoothing</strong> (the Hatch filter) uses the ultra-quiet carrier <em>changes</em> to average down the code noise over time, since the carrier tracks range variations perfectly even while its absolute level is ambiguous. RTK (real-time kinematic) surveying, centimetre-level machine control, and geodesy all rest on fixed-ambiguity carrier phase.</p>
<table class="data">
<tr><th>Observable</th><th>Ruler tick</th><th>Typical noise</th><th>Ambiguity</th></tr>
<tr><td>C/A code phase</td><td>293 m/chip</td><td>0.1&ndash;3 m</td><td>300 km (code period)</td></tr>
<tr><td>P(Y) code phase</td><td>29.3 m/chip</td><td>0.01&ndash;0.3 m</td><td>1 week (none in practice)</td></tr>
<tr><td>L1 carrier phase</td><td>19 cm/cycle</td><td>1&ndash;3 mm</td><td>19 cm (integer $N$)</td></tr>
</table>`
      },
      {
        h: 'Ambiguity resolution: multiple codes, tones, and component codes',
        html: String.raw`<p>Every ranging signal trades precision against unambiguous span: a fine ruler (fast code, short wavelength) wraps quickly. The universal cure is to <strong>measure with several rulers of different lengths at once</strong> and reconcile them — each coarse ruler resolves which lap of the next finer one you are on.</p>
<p><strong>Layered / component PN codes.</strong> GNSS layers a short fast code (C/A: fine, wraps at 300 km) under data-message timestamps (which count the 1-ms epochs, extending uniqueness to the whole week). Deep-space ranging goes further: transponder ranging codes are built as combinations of several short <em>component codes</em> of coprime lengths; each component is correlated separately (fast, because each is short), and the Chinese-remainder structure of the coprime periods reconstructs a delay unique over the very long composite period. You get the acquisition speed of short codes with the unambiguous reach of a huge one.</p>
<p><strong>Tone (sidetone) ranging.</strong> The oldest version of the trick modulates a set of sinusoidal tones onto the carrier — say 8 Hz, 160 Hz, ..., up to 500 kHz. The phase of each received tone measures the delay modulo that tone's period: the highest tone gives precision (its phase divides its short period finely), and each lower tone disambiguates the one above it, down to the 8 Hz tone whose period spans thousands of kilometres. Classic satellite TT&amp;C systems (and the ESA/NASA standards that grew from them) used exactly this ladder before PN ranging took over.</p>
<p><strong>Dual-frequency carriers.</strong> Carrier-phase ambiguities shrink when you form the <em>widelane</em> combination of two carriers: $\lambda_{WL}=c/(f_1-f_2)$ — for GPS L1/L2 about 86 cm, four times easier to fix than 19 cm, after which the fixed widelane brackets the individual ambiguities. Same ladder, built in frequency instead of code length.</p>
<div class="callout"><strong>Intuition:</strong> it is the vernier-caliper principle. The main scale (coarse code or low tone) tells you roughly where you are; the vernier (fine code, high tone, carrier) tells you exactly where within one coarse division. Neither alone suffices; together they give reach <em>and</em> precision.</div>`
      },
      {
        h: 'The error budget: jitter, multipath, atmosphere, clocks, geometry',
        html: String.raw`<p>A pseudorange is only as good as its error budget. The classic decomposition, each term in metres of equivalent range:</p>
<table class="data">
<tr><th>Error source</th><th>Typical 1-sigma (single-freq. code)</th><th>Behaviour / mitigation</th></tr>
<tr><td>Thermal noise (code jitter)</td><td>0.1&ndash;1 m</td><td>random; $\sigma_R=(c/R_c)\sqrt{B_L\delta/(2\,C/N_0)}$ — faster code, narrower loop, stronger signal, carrier smoothing</td></tr>
<tr><td>Multipath</td><td>0.2&ndash;5 m</td><td>reflections bias the correlation peak; narrow correlator, antenna siting, choke rings</td></tr>
<tr><td>Ionosphere (residual)</td><td>1&ndash;5 m</td><td>dispersive: scales as $1/f^2$, so dual-frequency measurement cancels it almost entirely</td></tr>
<tr><td>Troposphere (residual)</td><td>0.2&ndash;1 m</td><td>non-dispersive wet/dry delay; modelled, elevation-dependent</td></tr>
<tr><td>Satellite clock + ephemeris</td><td>0.5&ndash;2 m</td><td>broadcast corrections; differential/precise products reduce to cm</td></tr>
</table>
<p><strong>Thermal range jitter</strong> is the tracking-loop chip jitter scaled by the chip length: the delay-lock loop holds $\sigma_{\text{DLL}}=\sqrt{B_L\,\delta/(2\,C/N_0)}$ chips (coherent case), and each chip is $c/R_c$ metres, so $\sigma_R=(c/R_c)\,\sigma_{\text{DLL}}$. This is why the 10.23 Mcps P(Y) code out-ranges the 1.023 Mcps C/A code tenfold at equal loop settings, and why signal designers push chip rate (and correlator spacing $\delta$ down) for ranging performance.</p>
<p><strong>Multipath</strong> deserves special fear: a reflection delayed by less than a chip overlaps the direct path's correlation triangle and drags the peak, producing a slowly varying <em>bias</em> that no averaging removes. It is the dominant error in urban and indoor ranging; narrow-correlator discriminators, multipath-estimating correlators, and antenna design are the countermeasures.</p>
<p>Root-sum-squaring the terms gives the <strong>user-equivalent range error</strong> $\sigma_{\text{UERE}}$, and geometry scales it into position error: $\sigma_{\text{pos}}=\text{DOP}\times\sigma_{\text{UERE}}$. Both factors matter — a superb 0.5 m UERE through a PDOP-8 urban-canyon geometry still yields a 4 m fix. Differential systems (DGPS, RTK, SBAS) attack the <em>correlated</em> terms (atmosphere, ephemeris, satellite clock) by measuring them at a reference station and broadcasting corrections; the uncorrelated terms (receiver noise, local multipath) remain and set the differential floor.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>Ranging converts timing into geometry, and every design choice is a timing choice. You should now be able to say:</p>
<ul>
<li><strong>The principle:</strong> distance is propagation time — $R=c\,\tau$ one-way (needs synchronized or solved clocks) and $R=c\,\tau_{rt}/2$ two-way (one clock, calibrated transponder turnaround); TDOA shifts the synchronization burden onto the infrastructure and yields hyperbolic position lines.</li>
<li><strong>PN code-phase ranging:</strong> the correlation peak's position reads $\tau$ directly; the chip length $c/R_c$ is the ruler tick (293 m for C/A, 29.3 m for P(Y)), tracking interpolates to $10^{-2}$&ndash;$10^{-3}$ chip, and the measurement wraps at one code period $R_u=c\,N\,T_c$ (about 300 km for C/A).</li>
<li><strong>The pseudorange:</strong> receiver clock bias adds $c\,\delta t_r$ identically to every measurement, giving $\rho=R+c\,(\delta t_r-\delta t^s)+I+T+\varepsilon$; the satellite clock term is broadcast away and the receiver bias is solved as a fourth unknown — which is also why every GNSS receiver is a nanosecond-class clock.</li>
<li><strong>The navigation solution:</strong> $\rho_i=\lVert\mathbf{r}^i-\mathbf{r}\rVert+b$; four satellites, four unknowns; linearize with unit vectors into the geometry matrix $G$, iterate least squares; $(G^TG)^{-1}$ sets DOP, and spread-out satellites mean low DOP.</li>
<li><strong>Carrier phase:</strong> $\Phi=R/\lambda+N+\dots$ gives millimetre precision with an integer-cycle ambiguity $N$; code coarse + carrier fine, differencing plus integer search (LAMBDA) fixes $N$; carrier smoothing helps even unfixed; widelane $\lambda_{WL}=c/(f_1-f_2)$ eases the fix.</li>
<li><strong>The error budget:</strong> $\sigma_R=(c/R_c)\sqrt{B_L\delta/(2\,C/N_0)}$ for thermal jitter; multipath biases the peak and resists averaging; iono scales as $1/f^2$ (dual-frequency cancels); RSS the terms into $\sigma_{\text{UERE}}$ and multiply by DOP for position error.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://gssc.esa.int/navipedia/index.php/GNSS_Basic_Observables" target="_blank" rel="noopener">ESA Navipedia — GNSS Basic Observables</a> — the authoritative compact treatment of the code pseudorange and carrier-phase observables, with every clock, ionospheric, tropospheric, and ambiguity term of the measurement equations laid out exactly as receivers model them.</li>
<li><a href="https://en.wikipedia.org/wiki/Pseudorange" target="_blank" rel="noopener">Wikipedia — Pseudorange</a> — a clear conceptual walk through why the receiver clock bias makes ranges "pseudo", how the fourth satellite recovers both time and position, and the accuracy consequences of unsynchronized clocks.</li>
<li><a href="https://courses.ems.psu.edu/geog862/node/1752" target="_blank" rel="noopener">Penn State GEOG 862 — GPS Observables (code and carrier)</a> — a university surveying course that contrasts code pseudoranging with carrier-phase ranging in depth, including the integer ambiguity, cycle slips, and why surveyors live on the carrier.</li>
<li><a href="https://www.mathworks.com/help/nav/ref/pseudoranges.html" target="_blank" rel="noopener">MathWorks — pseudoranges (Navigation Toolbox)</a> — reference documentation for generating pseudorange and pseudorange-rate measurements in MATLAB, useful for building and validating your own least-squares navigation solver against a known model.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Ranging measures distance from propagation time: $R=c\,\tau$ one-way and $R=c\,\tau_{rt}/2$ two-way, with $c\approx3\times10^8$ m/s; 1 ns of timing error is 30 cm of range.`,
      String.raw`One-way (TOA) ranging spans two clocks, so any offset between them corrupts the range directly; two-way ranging uses a single clock plus a calibrated transponder turnaround delay; TDOA needs only synchronized infrastructure and yields hyperbolic position lines.`,
      String.raw`PN code-phase ranging reads the delay off the position of the code correlation peak: the autocorrelation triangle $R(\tau)=1-\lvert\tau\rvert$ is one chip wide, so the peak locates $\tau$ sharply.`,
      String.raw`The chip length $\ell_{\text{chip}}=c/R_c=c\,T_c$ is the ruler tick: 293 m for the 1.023 Mcps C/A code, 29.3 m for the 10.23 Mcps P(Y) code — faster chipping means finer ranging.`,
      String.raw`Tracking loops interpolate the peak to about $10^{-2}$ to $10^{-3}$ chip, so metre-level code ranging is routine even with 300-m chips.`,
      String.raw`The code repeats every $N$ chips, so code-phase ranging is unambiguous only within one code period: $R_u=c\,N\,T_c$ (about 300 km for the 1-ms C/A code); longer laps are counted from data-message timestamps or longer codes.`,
      String.raw`The pseudorange is $\rho=R+c\,(\delta t_r-\delta t^s)+I+T+\varepsilon$: true range plus receiver and satellite clock biases plus ionospheric and tropospheric delays plus noise/multipath.`,
      String.raw`The receiver clock bias $c\,\delta t_r$ is identical on all simultaneous measurements — one clock, one bias — so it can be solved as a fourth unknown instead of requiring an atomic clock in the receiver.`,
      String.raw`Four satellites solve four unknowns $(x,y,z,b)$ via $\rho_i=\lVert\mathbf{r}^i-\mathbf{r}\rVert+b$; the linearized rows $[-\mathbf{u}_i^T\;1]$ form the geometry matrix $G$ and Gauss-Newton iteration converges in a few steps.`,
      String.raw`Solution quality scales with geometry: $\sigma_{\text{pos}}=\text{DOP}\times\sigma_{\text{UERE}}$ with DOP from $(G^TG)^{-1}$; clustered satellites give large DOP, spread satellites small DOP.`,
      String.raw`Carrier-phase ranging uses the 19-cm L1 wavelength as the ruler: $\Phi=R/\lambda+N+\dots$ gives millimetre precision but with an unknown integer-cycle ambiguity $N$.`,
      String.raw`The standard architecture is code coarse + carrier fine: the unambiguous code range brackets the carrier ambiguity, differencing cancels clocks/atmosphere, and an integer search (e.g. LAMBDA) fixes $N$ for cm-level RTK.`,
      String.raw`Ambiguity resolution ladders appear everywhere: layered/component PN codes of coprime lengths (deep-space ranging), sidetone ranging with a tone ladder, and the widelane carrier combination $\lambda_{WL}=c/(f_1-f_2)\approx86$ cm.`,
      String.raw`Thermal ranging jitter is chip jitter scaled by chip length: $\sigma_R=(c/R_c)\sqrt{B_L\,\delta/(2\,C/N_0)}$, with $C/N_0$ a linear ratio in Hz.`,
      String.raw`Multipath drags the correlation peak and produces a slowly varying bias that averaging cannot remove — the dominant error in urban ranging; the ionosphere scales as $1/f^2$ so dual-frequency measurements cancel it.`,
      String.raw`Every GNSS receiver is also a time-transfer instrument: after the fix, the solved clock bias gives system time to tens of nanoseconds, which is how cell networks and power grids get their time.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 270" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="ranging-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker>
<marker id="ranging-a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#4dabf7"/></marker>
<marker id="ranging-a3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ffa94d"/></marker></defs>
<rect x="0" y="0" width="540" height="270" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Time-of-flight ranging: one-way (TOA) vs two-way (transponder)</text>
<!-- one-way -->
<text x="16" y="48" fill="#63e6be" font-size="11">One-way: $R=c\,\tau$ (two clocks!)</text>
<rect x="20" y="58" width="70" height="26" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="30" y="75" fill="#e6edf3" font-size="10">TX clock</text>
<rect x="440" y="58" width="80" height="26" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/><text x="448" y="75" fill="#e6edf3" font-size="10">RX clock</text>
<line x1="92" y1="71" x2="438" y2="71" stroke="#4dabf7" stroke-width="1.6" marker-end="url(#ranging-a2)"/>
<text x="220" y="64" fill="#4dabf7" font-size="10">signal, delay $\tau$</text>
<text x="20" y="102" fill="#9aa7b5" font-size="9">TX stamps epoch $t_{tx}$; RX reads $t_{rx}$ on its own clock: any clock offset corrupts $\tau=t_{rx}-t_{tx}$</text>
<!-- two-way -->
<text x="16" y="130" fill="#ffa94d" font-size="11">Two-way: $R=c\,\tau_{rt}/2$ (one clock)</text>
<rect x="20" y="140" width="88" height="26" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/><text x="26" y="157" fill="#e6edf3" font-size="10">interrogator</text>
<rect x="430" y="140" width="90" height="26" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="438" y="157" fill="#e6edf3" font-size="10">transponder</text>
<line x1="110" y1="147" x2="428" y2="147" stroke="#ffa94d" stroke-width="1.4" marker-end="url(#ranging-a3)"/>
<line x1="428" y1="160" x2="110" y2="160" stroke="#ffa94d" stroke-width="1.4" stroke-dasharray="5 3" marker-end="url(#ranging-a3)"/>
<text x="216" y="141" fill="#ffa94d" font-size="9">uplink</text>
<text x="200" y="176" fill="#ffa94d" font-size="9">reply (turnaround calibrated)</text>
<!-- timeline -->
<line x1="40" y1="220" x2="510" y2="220" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#ranging-a1)"/>
<text x="500" y="236" fill="#9aa7b5" font-size="9">time</text>
<line x1="80" y1="212" x2="80" y2="228" stroke="#ffa94d" stroke-width="1.6"/><text x="60" y="244" fill="#ffa94d" font-size="9">transmit</text>
<line x1="270" y1="212" x2="270" y2="228" stroke="#b197fc" stroke-width="1.6"/><text x="238" y="244" fill="#b197fc" font-size="9">transponder</text>
<line x1="460" y1="212" x2="460" y2="228" stroke="#63e6be" stroke-width="1.6"/><text x="440" y="244" fill="#63e6be" font-size="9">receive</text>
<line x1="80" y1="204" x2="460" y2="204" stroke="#9aa7b5" stroke-width="0.9" marker-end="url(#ranging-a1)"/>
<text x="240" y="200" fill="#9aa7b5" font-size="9">$\tau_{rt}$ measured on one clock</text>
<text x="40" y="262" fill="#9aa7b5" font-size="9">1 ns of timing error = 30 cm of range; 1 ms = 300 km — ranging is timing.</text>
</svg>`,
        caption: 'Two ranging geometries. One-way (TOA): the transmitter stamps its transmit epoch and the receiver times the arrival on its own clock, so R = c*tau but any offset between the two clocks corrupts the measurement directly. Two-way: the interrogator times the round trip tau_rt on a single clock and R = c*tau_rt/2; no synchronization is needed, only calibration of the transponder turnaround delay. The timeline shows the round-trip interval measured entirely on the interrogator clock.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 268" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="268" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">PN code-phase ranging: the correlation peak position IS the range</text>
<!-- incoming and replica chip streams -->
<text x="16" y="46" fill="#4dabf7" font-size="10">incoming code (delayed by $\tau$)</text>
<path d="M40,72 h20 v-14 h20 v14 h40 v-14 h20 v14 h20 v-14 h40 v14 h40 v-14 h20 v14 h40 v-14 h40 v14 h20 v-14 h20 v14 h40" fill="none" stroke="#4dabf7" stroke-width="1.6"/>
<text x="16" y="102" fill="#63e6be" font-size="10">local replica (search / track shift)</text>
<path d="M60,128 h20 v-14 h20 v14 h40 v-14 h20 v14 h20 v-14 h40 v14 h40 v-14 h20 v14 h40 v-14 h40 v14 h20 v-14 h20 v14 h20" fill="none" stroke="#63e6be" stroke-width="1.6"/>
<line x1="40" y1="60" x2="40" y2="136" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="3 2"/>
<line x1="60" y1="60" x2="60" y2="136" stroke="#ffa94d" stroke-width="0.9" stroke-dasharray="3 2"/>
<text x="34" y="150" fill="#ffa94d" font-size="9">replica shift = $\hat\tau$</text>
<!-- correlation vs shift -->
<line x1="40" y1="230" x2="510" y2="230" stroke="#9aa7b5" stroke-width="1.2"/>
<text x="470" y="246" fill="#9aa7b5" font-size="10">replica delay</text>
<text x="46" y="176" fill="#9aa7b5" font-size="10">correlation</text>
<path d="M60,230 L200,228 L230,228 L260,170 L290,228 L320,228 L470,228" fill="none" stroke="#ffa94d" stroke-width="2"/>
<circle cx="260" cy="170" r="4" fill="#ff6b6b"/>
<line x1="260" y1="170" x2="260" y2="230" stroke="#ff6b6b" stroke-width="0.8" stroke-dasharray="3 2"/>
<text x="238" y="162" fill="#ff6b6b" font-size="10">peak at $\hat\tau$</text>
<line x1="230" y1="238" x2="290" y2="238" stroke="#63e6be" stroke-width="1.4"/>
<text x="216" y="252" fill="#63e6be" font-size="9">2 chips wide: tick = $c/R_c$</text>
<line x1="60" y1="256" x2="470" y2="256" stroke="#b197fc" stroke-width="1.2"/>
<text x="150" y="266" fill="#b197fc" font-size="9">unambiguous window = one code period $R_u=c\,N\,T_c$ (then it wraps)</text>
<text x="300" y="200" fill="#9aa7b5" font-size="9">$R=c\,\hat\tau$; loop reads peak to</text>
<text x="300" y="212" fill="#9aa7b5" font-size="9">0.01&ndash;0.001 chip</text>
</svg>`,
        caption: 'PN code-phase ranging. The incoming code arrives delayed by the propagation time tau; the receiver slides a local replica until the correlation peak appears. The peak position is the delay measurement: R = c*tau_hat. The triangle is only two chips wide at its base, so the chip length c/Rc sets the ruler tick (293 m for GPS C/A), a tracking loop interpolates the peak to a hundredth of a chip or better, and the measurement repeats (wraps) every code period, giving the unambiguous range c*N*Tc.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 272" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="ranging-a4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="272" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Pseudorange: one clock bias inflates ALL ranges; 4 satellites solve it</text>
<!-- satellites -->
<circle cx="90" cy="58" r="9" fill="none" stroke="#4dabf7" stroke-width="1.6"/><text x="76" y="44" fill="#4dabf7" font-size="10">SV1</text>
<circle cx="230" cy="44" r="9" fill="none" stroke="#63e6be" stroke-width="1.6"/><text x="216" y="30" fill="#63e6be" font-size="10">SV2</text>
<circle cx="370" cy="52" r="9" fill="none" stroke="#ffa94d" stroke-width="1.6"/><text x="356" y="36" fill="#ffa94d" font-size="10">SV3</text>
<circle cx="480" cy="82" r="9" fill="none" stroke="#b197fc" stroke-width="1.6"/><text x="466" y="66" fill="#b197fc" font-size="10">SV4</text>
<!-- receiver -->
<rect x="248" y="196" width="52" height="26" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.6"/>
<text x="256" y="213" fill="#e6edf3" font-size="10">RX $(x,y,z,b)$</text>
<line x1="95" y1="68" x2="262" y2="196" stroke="#4dabf7" stroke-width="1.1" marker-end="url(#ranging-a4)"/>
<line x1="231" y1="54" x2="270" y2="194" stroke="#63e6be" stroke-width="1.1" marker-end="url(#ranging-a4)"/>
<line x1="366" y1="62" x2="284" y2="194" stroke="#ffa94d" stroke-width="1.1" marker-end="url(#ranging-a4)"/>
<line x1="473" y1="90" x2="298" y2="198" stroke="#b197fc" stroke-width="1.1" marker-end="url(#ranging-a4)"/>
<text x="130" y="130" fill="#4dabf7" font-size="10">$\rho_1$</text>
<text x="238" y="126" fill="#63e6be" font-size="10">$\rho_2$</text>
<text x="330" y="132" fill="#ffa94d" font-size="10">$\rho_3$</text>
<text x="400" y="150" fill="#b197fc" font-size="10">$\rho_4$</text>
<text x="60" y="244" fill="#e6edf3" font-size="11">$\rho_i=\lVert\mathbf{r}^i-\mathbf{r}\rVert+b,\qquad b=c\,\delta t_r$ common to all</text>
<text x="60" y="262" fill="#9aa7b5" font-size="9">4 unknowns $(x,y,z,b)$, 4+ equations: position AND time solved together (DOP from geometry)</text>
<!-- bias illustration: true vs measured arc -->
<path d="M180,178 a95,95 0 0 1 60,-38" fill="none" stroke="#ff6b6b" stroke-width="1.1" stroke-dasharray="4 3"/>
<text x="128" y="176" fill="#ff6b6b" font-size="9">all spheres inflated by $b$</text>
</svg>`,
        caption: 'The pseudorange navigation solution. Each satellite broadcasts its position and transmit epoch; the receiver measures pseudoranges rho_i = ||r_i - r|| + b, where the clock-bias term b = c*delta_t_r is identical on every measurement because a single receiver clock timestamps them all. Three unknown coordinates plus the shared bias make four unknowns, so four (or more) satellites solve position and time together by linearized least squares; the geometry of the unit line-of-sight vectors sets the DOP that scales measurement noise into position error.'
      }
    ],
    equations: [
      {
        title: 'One-Way Ranging',
        tex: String.raw`$$R=c\,\tau,\qquad \tau=t_{rx}-t_{tx}$$`,
        derivation: String.raw`<p><b>Where we start.</b> An electromagnetic wavefront leaves the transmitter at epoch $t_{tx}$ and propagates at speed $c$ (vacuum value $2.998\times10^8$ m/s; in the atmosphere fractionally slower, which becomes the tropospheric correction). We want the distance $R$ between transmitter and receiver from the arrival epoch $t_{rx}$.</p>
<p><b>Step 1.</b> Uniform propagation means the wavefront's travelled distance grows linearly with time: after an interval $\Delta t$ it has covered $c\,\Delta t$. The wavefront reaches the receiver when that distance equals the geometric range, i.e. at $t_{rx}=t_{tx}+R/c$.</p>
<p><b>Step 2.</b> Solve for $R$: the measured propagation delay is $\tau=t_{rx}-t_{tx}=R/c$, hence $R=c\,\tau$. The sensitivity is $dR=c\,d\tau$: every nanosecond of delay error maps to $0.3$ m of range error, every microsecond to $300$ m, every millisecond to $300$ km.</p>
<p><b>Result.</b> $R=c\,\tau$ — but note carefully <em>whose clocks</em> define the two epochs. $t_{tx}$ is stamped by the transmitter's clock and $t_{rx}$ by the receiver's; if the receiver clock runs offset by $\delta t_r$ from the transmitter's timescale, the measured delay is $\tau+\delta t_r$ and the inferred range is wrong by $c\,\delta t_r$. This single observation motivates the entire pseudorange formalism: one-way ranging is only as good as the synchronization between the two ends, or as the method used to solve the offset out.</p>`
      },
      {
        title: 'Two-Way (Round-Trip) Ranging',
        tex: String.raw`$$R=\frac{c\,(\tau_{rt}-\tau_{ta})}{2}$$`,
        derivation: String.raw`<p><b>Where we start.</b> An interrogator transmits a ranging signal at epoch $t_1$; a transponder at distance $R$ receives it, holds it for a fixed internal turnaround time $\tau_{ta}$, and retransmits; the interrogator receives the reply at $t_2$, measuring the round-trip interval $\tau_{rt}=t_2-t_1$ on its own single clock.</p>
<p><b>Step 1.</b> Decompose the round trip: the uplink takes $R/c$, the transponder adds $\tau_{ta}$, the downlink takes $R/c$ again. So $\tau_{rt}=R/c+\tau_{ta}+R/c=2R/c+\tau_{ta}$.</p>
<p><b>Step 2.</b> Subtract the calibrated turnaround and solve: $\tau_{rt}-\tau_{ta}=2R/c$, hence $R=c\,(\tau_{rt}-\tau_{ta})/2$. For a passive reflector (radar, laser ranging to corner cubes) $\tau_{ta}=0$ and the familiar $R=c\,\tau_{rt}/2$ results.</p>
<p><b>Result.</b> $R=c(\tau_{rt}-\tau_{ta})/2$. The decisive advantage: both epochs are read on the <em>same</em> clock, so clock <em>offset</em> cancels exactly — only clock <em>rate</em> error over the round trip matters, a far weaker requirement (a clock off by 1 ms still times a 0.1 s round trip almost perfectly). The costs are the calibration burden of $\tau_{ta}$ (temperature-dependent group delay through the transponder), a two-hop link budget, and the need for cooperation from the far end. This is why deep-space navigation, DME, and UWB tags — systems that control both ends — are two-way, while broadcast systems like GNSS must be one-way.</p>`
      },
      {
        title: 'Chip Length: the Code-Ranging Tick',
        tex: String.raw`$$\ell_{\text{chip}}=c\,T_c=\frac{c}{R_c}$$`,
        derivation: String.raw`<p><b>Where we start.</b> PN code-phase ranging measures delay in units of chips: the correlator localizes the peak to some fraction of a chip, so we need the conversion from chips to metres. A chip lasts $T_c=1/R_c$ seconds, where $R_c$ is the chipping rate.</p>
<p><b>Step 1.</b> During one chip interval the wavefront advances a distance $c\,T_c$. Two signals whose codes are offset by exactly one chip therefore correspond to propagation paths differing by $c\,T_c$ metres — this is the physical length of one tick on the code-phase ruler: $\ell_{\text{chip}}=c\,T_c=c/R_c$.</p>
<p><b>Step 2.</b> Evaluate for the standard GNSS codes: C/A at $R_c=1.023$ Mcps gives $\ell_{\text{chip}}=3\times10^8/1.023\times10^6\approx293$ m; P(Y) at $10.23$ Mcps gives $29.3$ m. A tracking loop holding $\sigma=0.01$ chip then delivers $2.9$ m and $0.29$ m of range jitter respectively — the range precision inherits the chip rate directly.</p>
<p><b>Result.</b> $\ell_{\text{chip}}=c/R_c$: chip rate is the fineness of the ranging ruler, which is why ranging-optimized signals push chip rate as high as spectrum allows (P(Y) at 10.23 Mcps, Galileo E5 at even wider effective bandwidth) and why a range measurement quoted in chips is meaningless until multiplied by $c/R_c$. The same conversion runs the other way: any timing bias in chips (multipath, correlator asymmetry) becomes metres of ranging bias through the identical factor.</p>`
      },
      {
        title: 'Unambiguous Range of a Periodic Code',
        tex: String.raw`$$R_u=c\,N\,T_c=\frac{c\,N}{R_c}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A PN code of length $N$ chips repeats with period $T_{\text{code}}=N\,T_c$. The correlation of the incoming code against the replica is therefore also periodic: delays $\tau$ and $\tau+k\,N\,T_c$ (any integer $k$) produce identical correlation functions, and the receiver cannot distinguish them from the code alone.</p>
<p><b>Step 1.</b> The measured code phase is thus $\tau \bmod N\,T_c$ — unique only within one code period. Converting that time window to distance with $R=c\,\tau$ gives the unambiguous range window $R_u=c\,N\,T_c=c\,N/R_c$.</p>
<p><b>Step 2.</b> Evaluate for GPS C/A: $N=1023$ chips at $1.023$ Mcps makes $T_{\text{code}}=1$ ms exactly, so $R_u=3\times10^8\times10^{-3}=300$ km. But the satellites are 20&thinsp;200&ndash;26&thinsp;000 km away: the true delay is 67&ndash;86 ms, some 67 to 86 whole code periods plus a fraction. The code phase pins the fraction; the whole number of periods must come from elsewhere — the navigation data's timestamps (bit and frame boundaries mark 20 ms and 6 s intervals), or coarse prior knowledge of position and time.</p>
<p><b>Result.</b> $R_u=c\,N\,T_c$: the length of the tape measure before it wraps. It exposes the fundamental design tension — short codes acquire fast (few cells to search) but wrap early; long codes reach far but search slowly — and motivates every layered-ambiguity scheme: short code + data timestamps (GNSS), component codes of coprime lengths (deep-space), tone ladders (sidetone ranging), and code + carrier (RTK), each coarse layer counting the laps of the finer one below it.</p>`
      },
      {
        title: 'The Pseudorange Observation Equation',
        tex: String.raw`$$\rho=R+c\,(\delta t_r-\delta t^s)+I+T+\varepsilon$$`,
        derivation: String.raw`<p><b>Where we start.</b> The receiver measures the apparent propagation delay as the difference between the reception epoch read on its own clock and the transmission epoch stamped by the satellite clock. Let true system time run underneath both: the receiver clock reads system time plus an offset $\delta t_r$, the satellite clock reads system time plus $\delta t^s$, and the signal truly propagates for $R/c$ plus the atmospheric excess delays $I/c$ (ionosphere) and $T/c$ (troposphere).</p>
<p><b>Step 1.</b> Write both epochs in true time. Reception epoch as read: $t_{rx}=t_{\text{true,rx}}+\delta t_r$. Transmission epoch as stamped: $t_{tx}=t_{\text{true,tx}}+\delta t^s$. The measured delay is their difference: $\tau_{\text{meas}}=t_{rx}-t_{tx}=(t_{\text{true,rx}}-t_{\text{true,tx}})+\delta t_r-\delta t^s$.</p>
<p><b>Step 2.</b> The true propagation interval is $t_{\text{true,rx}}-t_{\text{true,tx}}=R/c+I/c+T/c$. Multiply the whole measured delay by $c$ to convert to range units and add the receiver noise and multipath as $\varepsilon$: $\rho=c\,\tau_{\text{meas}}+\varepsilon=R+c\,(\delta t_r-\delta t^s)+I+T+\varepsilon$.</p>
<p><b>Result.</b> The pseudorange equation. Each term has its own remedy: $c\,\delta t^s$ is removed with the broadcast clock-correction polynomial; $I$ scales as $1/f^2$ and is cancelled by dual-frequency combination or reduced by a broadcast model; $T$ is modelled from meteorology and elevation angle; $\varepsilon$ is beaten down by loop design and carrier smoothing; and the one term that cannot be removed in advance — the receiver bias $c\,\delta t_r$, potentially hundreds of kilometres — is <em>identical on every simultaneous measurement</em> and is therefore promoted to a solved-for unknown alongside position.</p>`
      },
      {
        title: 'The Four-Satellite Navigation Solution',
        tex: String.raw`$$\rho_i=\lVert\mathbf{r}^i-\mathbf{r}\rVert+b,\quad i=1..4;\qquad \Delta\rho_i=-\,\mathbf{u}_i\cdot\Delta\mathbf{r}+\Delta b$$`,
        derivation: String.raw`<p><b>Where we start.</b> After the broadcast corrections, each pseudorange to satellite $i$ (position $\mathbf{r}^i$ known from the ephemeris) constrains the receiver position $\mathbf{r}=(x,y,z)$ and the range-equivalent clock bias $b=c\,\delta t_r$: $\rho_i=\lVert\mathbf{r}^i-\mathbf{r}\rVert+b$. Four unknowns demand at least four such equations — hence four satellites.</p>
<p><b>Step 1.</b> The equations are nonlinear through the Euclidean norm, so linearize about a guess $(\mathbf{r}_0,b_0)$. The gradient of $\lVert\mathbf{r}^i-\mathbf{r}\rVert$ with respect to $\mathbf{r}$ is $-\mathbf{u}_i$, the negative unit vector from receiver toward the satellite. To first order: $\rho_i\approx\lVert\mathbf{r}^i-\mathbf{r}_0\rVert+b_0-\mathbf{u}_i\cdot\Delta\mathbf{r}+\Delta b$, i.e. the residual $\Delta\rho_i=\rho_i-\rho_{i,\text{predicted}}$ obeys $\Delta\rho_i=-\mathbf{u}_i\cdot\Delta\mathbf{r}+\Delta b$.</p>
<p><b>Step 2.</b> Stack the $m\ge4$ residuals: $\Delta\boldsymbol\rho=G\,\Delta\mathbf{x}$ with rows $G_i=[-\mathbf{u}_i^T\;\;1]$ and $\Delta\mathbf{x}=[\Delta x,\Delta y,\Delta z,\Delta b]^T$. Solve by least squares, $\Delta\mathbf{x}=(G^TG)^{-1}G^T\Delta\boldsymbol\rho$, update the guess, and iterate; convergence takes 2&ndash;3 iterations because at 20&thinsp;000 km the unit vectors barely change with receiver position.</p>
<p><b>Result.</b> Position and time solved simultaneously from four or more pseudoranges. The error covariance is $(G^TG)^{-1}\sigma^2_{\text{UERE}}$, so the same geometry matrix that solves the fix also grades it: nearly parallel unit vectors (satellites clustered in the sky) make $G^TG$ ill-conditioned and blow up the covariance — the dilution-of-precision effect. The bias estimate $\Delta b$ is a bonus product: it disciplines the receiver clock to system time within tens of nanoseconds.</p>`
      },
      {
        title: 'The Carrier-Phase Observable',
        tex: String.raw`$$\lambda\,\Phi=R+c\,(\delta t_r-\delta t^s)-I+T+\lambda N+\varepsilon_\phi$$`,
        derivation: String.raw`<p><b>Where we start.</b> A PLL tracks the received carrier and accumulates its phase $\Phi$ (in cycles) relative to a receiver-generated reference. The carrier of frequency $f$ has wavelength $\lambda=c/f$, so each full cycle of phase corresponds to $\lambda$ metres of path. We want the measurement equation linking $\Phi$ to the range $R$.</p>
<p><b>Step 1.</b> The received phase lags the transmitted phase by the propagation time: the fractional and accumulated-since-lock part of that lag is exactly measurable, giving $R/\lambda$ cycles <em>up to an unknown integer</em> $N$ — the whole cycles in flight when the PLL first locked, which the loop can never observe because every cycle of a sinusoid is identical. Clock offsets enter in range units exactly as for the code, contributing $c(\delta t_r-\delta t^s)/\lambda$ cycles.</p>
<p><b>Step 2.</b> Multiply through by $\lambda$ to express in metres and include the atmosphere: the troposphere delays code and carrier alike ($+T$), but the dispersive ionosphere <em>advances</em> the carrier phase by the same magnitude it delays the code group — hence the sign flip, $-I$. Adding phase noise $\varepsilon_\phi$ (millimetres, since PLLs track to about a hundredth of a cycle): $\lambda\Phi=R+c(\delta t_r-\delta t^s)-I+T+\lambda N+\varepsilon_\phi$.</p>
<p><b>Result.</b> A range measurement structurally identical to the pseudorange but roughly a hundred times more precise, carrying an integer ambiguity $\lambda N$ and an opposite-sign ionosphere. The whole art of precise GNSS is exploiting this: difference between receivers and satellites to cancel the clock terms, use the code range to bracket $N$, fix $N$ by integer search (LAMBDA), and then read centimetre-level ranges from the carrier — with the code-minus-carrier combination doubling as an ionosphere and multipath monitor thanks to that sign flip.</p>`
      },
      {
        title: 'Thermal Ranging Jitter from Code Tracking',
        tex: String.raw`$$\sigma_R=\frac{c}{R_c}\,\sigma_{\text{DLL}}\approx\frac{c}{R_c}\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The pseudorange is read from the code-tracking loop's estimate of the correlation-peak position, so the loop's thermal chip jitter is the floor of the ranging precision. The coherent delay-lock loop holds a 1-sigma code-phase jitter of $\sigma_{\text{DLL}}\approx\sqrt{B_L\,\delta/(2\,C/N_0)}$ chips, where $B_L$ is the loop noise bandwidth (Hz), $\delta$ the early-late correlator spacing (chips), and $C/N_0$ the carrier-to-noise density as a linear ratio in Hz.</p>
<p><b>Step 1.</b> Convert chips to metres with the chip length: each chip spans $c/R_c$ metres, so a chip-domain jitter $\sigma_{\text{DLL}}$ becomes a range jitter $\sigma_R=(c/R_c)\,\sigma_{\text{DLL}}$. Substituting the DLL law gives $\sigma_R=(c/R_c)\sqrt{B_L\,\delta/(2\,C/N_0)}$ (a non-coherent loop multiplies the radicand by the squaring-loss bracket).</p>
<p><b>Step 2.</b> Read off the design levers. Chip rate enters directly: ten times the chip rate is ten times better ranging at identical loop settings — the deepest reason P(Y), and modern wideband signals, outrange C/A. Loop bandwidth and correlator spacing enter under the square root, and carrier smoothing effectively narrows $B_L$ further by letting the quiet carrier average the code. Example: C/A code, $B_L=0.5$ Hz, $\delta=0.2$, $C/N_0=45$ dB-Hz ($3.16\times10^4$): $\sigma_{\text{DLL}}=\sqrt{0.1/63246}=1.26\times10^{-3}$ chip, so $\sigma_R=293\times0.00126\approx0.37$ m.</p>
<p><b>Result.</b> $\sigma_R=(c/R_c)\sqrt{B_L\delta/(2\,C/N_0)}$: sub-metre code ranging is routine at open-sky signal strengths, and the formula quantifies exactly what jamming (lower $C/N_0$), dynamics (forcing wider $B_L$), and signal design (higher $R_c$, smaller $\delta$) do to the range error budget.</p>`
      },
      {
        title: 'Dilution of Precision (DOP)',
        tex: String.raw`$$\sigma_{\text{pos}}=\text{DOP}\times\sigma_{\text{UERE}},\qquad \text{DOP}^2=\mathrm{tr}\big[(G^TG)^{-1}\big]_{\text{(selected terms)}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The linearized navigation solution is $\Delta\mathbf{x}=(G^TG)^{-1}G^T\Delta\boldsymbol\rho$. Assume each pseudorange carries independent, zero-mean measurement error of equal standard deviation $\sigma_{\text{UERE}}$ (the root-sum-square of the per-satellite error budget). We want the resulting error in the solved position and time.</p>
<p><b>Step 1.</b> Propagate the covariance through the linear estimator: $\mathrm{cov}(\Delta\mathbf{x})=(G^TG)^{-1}G^T\,(\sigma^2_{\text{UERE}}I)\,G(G^TG)^{-1}=(G^TG)^{-1}\sigma^2_{\text{UERE}}$. The $4\times4$ matrix $(G^TG)^{-1}$ depends <em>only on the satellite geometry</em> — the unit line-of-sight vectors — not on signal quality.</p>
<p><b>Step 2.</b> Summarize with traces of its diagonal: GDOP takes all four diagonal terms (position + time), PDOP the three position terms, HDOP the two horizontal, VDOP the vertical, TDOP the clock term. Each DOP is the square root of the corresponding partial trace, so $\sigma_{\text{pos}}=\text{PDOP}\times\sigma_{\text{UERE}}$, $\sigma_{\text{clock}}=\text{TDOP}\times\sigma_{\text{UERE}}/c$, etc.</p>
<p><b>Result.</b> Total error factors cleanly into <em>measurement quality</em> ($\sigma_{\text{UERE}}$) times <em>geometry</em> (DOP). Satellites spread widely across the sky give nearly orthogonal rows in $G$, a well-conditioned $G^TG$, and PDOP near its theoretical floor (about 1.5 with an open sky); satellites clustered in one region give near-parallel rows and DOP of 10 or worse — the same metre-level pseudoranges then yield tens of metres of position error. This is why receivers report DOP alongside the fix, why urban canyons hurt twice (multipath raises $\sigma_{\text{UERE}}$ <em>and</em> masking raises DOP), and why constellation design fusses over orbital geometry as much as signal power.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the fundamental ranging equation for one-way and two-way measurements?`, back: String.raw`One-way: $R=c\,\tau$ with $\tau=t_{rx}-t_{tx}$. Two-way: $R=c\,(\tau_{rt}-\tau_{ta})/2$, halving the round trip after subtracting the transponder turnaround $\tau_{ta}$.` },
      { front: String.raw`How much range error do 1 ns, 1 &mu;s, and 1 ms of timing error cause?`, back: String.raw`At $c=3\times10^8$ m/s: 1 ns $\to$ 30 cm, 1 &mu;s $\to$ 300 m, 1 ms $\to$ 300 km. Ranging is timing.` },
      { front: String.raw`Why does two-way ranging not need synchronized clocks?`, back: String.raw`The same clock timestamps both transmit and receive epochs, so any clock offset cancels exactly; only the transponder turnaround delay must be calibrated.` },
      { front: String.raw`What is TDOA and what geometric surface does each measurement define?`, back: String.raw`Time difference of arrival between synchronized stations; each TDOA fixes a range difference, placing the target on a hyperboloid. Multiple pairs intersect for a fix (LORAN, multilateration).` },
      { front: String.raw`How does PN code-phase ranging measure the propagation delay?`, back: String.raw`Correlate the incoming code with a local replica: the correlation peak (the 1-chip-wide triangle) appears when replica delay equals propagation delay, so the peak position is the delay measurement, read to a fraction of a chip by the tracking loop.` },
      { front: String.raw`Give the chip length formula and its value for GPS C/A and P(Y) codes.`, back: String.raw`$\ell_{\text{chip}}=c/R_c$. C/A (1.023 Mcps): 293 m/chip. P(Y) (10.23 Mcps): 29.3 m/chip.` },
      { front: String.raw`What is the unambiguous range of a periodic PN code?`, back: String.raw`$R_u=c\,N\,T_c$ — one code period converted to distance. GPS C/A (1023 chips, 1 ms) wraps every 300 km; the whole number of periods comes from data timestamps.` },
      { front: String.raw`Write the pseudorange equation and name each term.`, back: String.raw`$\rho=R+c\,(\delta t_r-\delta t^s)+I+T+\varepsilon$: true range, receiver and satellite clock biases (range units), ionospheric and tropospheric delays, noise/multipath.` },
      { front: String.raw`Why is the receiver clock bias solvable rather than fatal?`, back: String.raw`One receiver clock timestamps all simultaneous measurements, so $c\,\delta t_r$ is identical on every pseudorange — a single common unknown solved alongside $(x,y,z)$ using a fourth satellite.` },
      { front: String.raw`Why exactly four satellites for a GNSS fix?`, back: String.raw`Four unknowns: three position coordinates plus the clock bias $b=c\,\delta t_r$. Each satellite adds one equation $\rho_i=\lVert\mathbf{r}^i-\mathbf{r}\rVert+b$; four equations determine four unknowns (more gives least squares).` },
      { front: String.raw`What is the geometry matrix $G$ and what two jobs does it do?`, back: String.raw`Rows $[-\mathbf{u}_i^T\;\;1]$ from the unit line-of-sight vectors. It solves the linearized fix ($\Delta\mathbf{x}=(G^TG)^{-1}G^T\Delta\boldsymbol\rho$) and its inverse Gramian $(G^TG)^{-1}$ gives the DOP factors.` },
      { front: String.raw`State the DOP relation and typical open-sky vs urban values.`, back: String.raw`$\sigma_{\text{pos}}=\text{DOP}\times\sigma_{\text{UERE}}$. Open sky PDOP is about 1.5&ndash;2.5; urban canyons can exceed 10, multiplying the same range noise into a far worse fix.` },
      { front: String.raw`What is the carrier-phase observable and its key complication?`, back: String.raw`$\lambda\Phi=R+c(\delta t_r-\delta t^s)-I+T+\lambda N+\varepsilon_\phi$: millimetre-precision range with an unknown integer-cycle ambiguity $N$ (and an opposite-sign ionosphere term).` },
      { front: String.raw`Explain "code coarse + carrier fine".`, back: String.raw`The unambiguous but noisy code pseudorange brackets the carrier's integer ambiguity to a few candidates; once an integer search (e.g. LAMBDA, after double differencing) fixes $N$, the carrier delivers cm&ndash;mm ranging.` },
      { front: String.raw`Name three ambiguity-resolution ladders used in ranging systems.`, back: String.raw`Layered/component PN codes of coprime lengths (deep-space transponder ranging), sidetone ranging with a tone-frequency ladder, and code+carrier or widelane carrier combinations ($\lambda_{WL}=c/(f_1-f_2)\approx86$ cm for L1/L2).` },
      { front: String.raw`How does code-tracking jitter map into ranging error?`, back: String.raw`$\sigma_R=(c/R_c)\,\sigma_{\text{DLL}}$ with $\sigma_{\text{DLL}}\approx\sqrt{B_L\delta/(2\,C/N_0)}$ chips — chip jitter times chip length; higher chip rate directly buys finer ranging.` },
      { front: String.raw`Why is multipath the most feared ranging error?`, back: String.raw`A sub-chip-delayed reflection overlaps and drags the correlation peak, creating a slowly varying bias that averaging cannot remove; countermeasures are narrow correlators, multipath-estimating discriminators, and antenna design.` },
      { front: String.raw`Why does dual-frequency operation nearly eliminate ionospheric error?`, back: String.raw`The ionospheric delay is dispersive, scaling as $1/f^2$; measuring the same range on two carrier frequencies lets the receiver solve for and remove the ionospheric term (it also flips sign between code delay and carrier advance).` }
    ],
    mcqs: [
      { q: String.raw`The one-way ranging equation is:`, options: [String.raw`$R=c/\tau$`, String.raw`$R=c\,\tau$`, String.raw`$R=\tau/c$`, String.raw`$R=c\,\tau^2$`], answer: 1, explain: String.raw`Distance equals propagation speed times propagation time: $R=c\,\tau$.` },
      { q: String.raw`In two-way ranging the factor of $1/2$ appears because:`, options: [String.raw`only half the power returns`, String.raw`the signal covers the distance twice, so the round-trip time is $2R/c$`, String.raw`the transponder halves the frequency`, String.raw`the clocks are averaged`], answer: 1, explain: String.raw`Up and back is $2R$; $R=c\,\tau_{rt}/2$ after subtracting the transponder turnaround delay.` },
      { q: String.raw`The main advantage of two-way over one-way ranging is:`, options: [String.raw`it needs no antennas`, String.raw`clock synchronization between the ends is unnecessary — one clock times both epochs`, String.raw`it works at longer wavelengths`, String.raw`it needs no transponder`], answer: 1, explain: String.raw`Both epochs are read on the interrogator's single clock, so clock offset cancels exactly.` },
      { q: String.raw`A timing error of 1 microsecond corresponds to a range error of about:`, options: [String.raw`30 cm`, String.raw`3 m`, String.raw`300 m`, String.raw`30 km`], answer: 2, explain: String.raw`$c\,\Delta t=3\times10^8\times10^{-6}=300$ m.` },
      { q: String.raw`In PN code-phase ranging, the propagation delay is read from:`, options: [String.raw`the received signal amplitude`, String.raw`the position of the code correlation peak`, String.raw`the carrier frequency offset`, String.raw`the data bit rate`], answer: 1, explain: String.raw`The correlation peak occurs when the replica delay matches the propagation delay; its position is the measurement.` },
      { q: String.raw`The chip length of the GPS C/A code (1.023 Mcps) is about:`, options: [String.raw`29.3 m`, String.raw`293 m`, String.raw`2.93 km`, String.raw`19 cm`], answer: 1, explain: String.raw`$\ell_{\text{chip}}=c/R_c=3\times10^8/1.023\times10^6\approx293$ m.` },
      { q: String.raw`The unambiguous range of a PN code of $N$ chips at chip period $T_c$ is:`, options: [String.raw`$c\,T_c$`, String.raw`$c\,N\,T_c$`, String.raw`$c/(N\,T_c)$`, String.raw`$N\,T_c/c$`], answer: 1, explain: String.raw`The code (and hence its correlation) repeats every $N\,T_c$ seconds, i.e. every $c\,N\,T_c$ metres of delay-equivalent distance.` },
      { q: String.raw`A pseudorange differs from the true range chiefly because of:`, options: [String.raw`antenna gain uncertainty`, String.raw`receiver (and satellite) clock bias, plus atmospheric delays and noise`, String.raw`Doppler shift`, String.raw`transmit power variation`], answer: 1, explain: String.raw`$\rho=R+c(\delta t_r-\delta t^s)+I+T+\varepsilon$; the receiver clock term is the dominant, common-to-all bias.` },
      { q: String.raw`Four satellites are needed for a GNSS fix because:`, options: [String.raw`the Earth blocks half the sky`, String.raw`three position coordinates plus the receiver clock bias make four unknowns`, String.raw`redundancy against satellite failure`, String.raw`each satellite gives only half an equation`], answer: 1, explain: String.raw`The common clock bias is promoted to a fourth unknown: $(x,y,z,b)$ need four equations.` },
      { q: String.raw`A 1 ms receiver clock bias corrupts every pseudorange by about:`, options: [String.raw`3 m`, String.raw`300 m`, String.raw`3 km`, String.raw`300 km`], answer: 3, explain: String.raw`$c\,\delta t=3\times10^8\times10^{-3}=3\times10^5$ m $=300$ km — identical on all satellites, hence solvable.` },
      { q: String.raw`The integer ambiguity $N$ in carrier-phase ranging exists because:`, options: [String.raw`the PLL loses lock every cycle`, String.raw`every cycle of a sinusoid is identical, so whole in-flight cycles are unobservable`, String.raw`the ionosphere randomizes the phase`, String.raw`the code and carrier are unsynchronized`], answer: 1, explain: String.raw`The PLL measures fractional (and accumulated) phase superbly but cannot know how many whole wavelengths spanned the path at lock-on.` },
      { q: String.raw`"Code coarse + carrier fine" means:`, options: [String.raw`the code is filtered more heavily than the carrier`, String.raw`the unambiguous code range brackets the carrier integer ambiguity, then the fixed carrier gives cm-level range`, String.raw`the code runs at a lower power than the carrier`, String.raw`coarse acquisition precedes fine acquisition`], answer: 1, explain: String.raw`The metre-level code measurement limits the integer candidates; fixing $N$ unlocks the millimetre-level carrier ruler.` },
      { q: String.raw`Sidetone (tone) ranging resolves ambiguity by:`, options: [String.raw`increasing transmit power tone by tone`, String.raw`a ladder of tone frequencies — each lower tone disambiguates the finer phase reading of the tone above it`, String.raw`using two antennas`, String.raw`averaging many measurements`], answer: 1, explain: String.raw`The highest tone gives precision, the lower tones extend the unambiguous span — the vernier-caliper principle.` },
      { q: String.raw`Thermal ranging jitter relates to code-tracking jitter by:`, options: [String.raw`$\sigma_R=\sigma_{\text{DLL}}\,R_c/c$`, String.raw`$\sigma_R=(c/R_c)\,\sigma_{\text{DLL}}$`, String.raw`$\sigma_R=c\,R_c\,\sigma_{\text{DLL}}$`, String.raw`$\sigma_R=\sigma_{\text{DLL}}/c$`], answer: 1, explain: String.raw`Chip jitter times the chip length $c/R_c$ gives metres; a tenfold chip rate cuts range jitter tenfold.` },
      { q: String.raw`Multipath is especially harmful to code ranging because it:`, options: [String.raw`adds white noise that averages away`, String.raw`biases the correlation peak with a slowly varying error that averaging cannot remove`, String.raw`only affects the carrier`, String.raw`reduces the chip rate`], answer: 1, explain: String.raw`A sub-chip reflection distorts the triangle and drags the peak — a bias, not noise; narrow correlators and antenna design mitigate it.` },
      { q: String.raw`With $\sigma_{\text{UERE}}=1.5$ m and PDOP $=2.0$, the expected 1-sigma position error is:`, options: [String.raw`0.75 m`, String.raw`1.5 m`, String.raw`3.0 m`, String.raw`4.5 m`], answer: 2, explain: String.raw`$\sigma_{\text{pos}}=\text{PDOP}\times\sigma_{\text{UERE}}=2.0\times1.5=3.0$ m — geometry multiplies measurement error.` }
    ],
    numericals: [
      {
        q: String.raw`A GPS satellite's signal arrives 67 ms after the transmit epoch stamped in the message (clocks assumed perfect). What is the range to the satellite? Use $c=3\times10^8$ m/s.`,
        solution: String.raw`<p><b>Formula.</b> $$R=c\,\tau$$ — one-way time-of-flight ranging with synchronized clocks.</p>
<p><b>Substitute.</b> $R=(3\times10^8\ \text{m/s})\times(67\times10^{-3}\ \text{s}).$</p>
<p><b>Compute.</b> $R=3\times10^8\times0.067=2.01\times10^7\ \text{m}=\mathbf{20\,100\ km}.$</p>
<p><b>Explanation.</b> About 20&thinsp;100 km — the zenith distance to a GPS satellite in its 20&thinsp;200 km altitude orbit (slant ranges to low-elevation satellites stretch to about 26&thinsp;000 km, or 86 ms). Note the assumption doing all the work: "clocks assumed perfect". A real receiver clock off by just 1 ms would corrupt this answer by 300 km, which is precisely why real measurements are pseudoranges and the bias must be solved with a fourth satellite.</p>`
      },
      {
        q: String.raw`A lunar laser-ranging station measures a round-trip time of 2.56 s to a retroreflector on the Moon (no transponder delay). How far is the reflector? Use $c=3\times10^8$ m/s.`,
        solution: String.raw`<p><b>Formula.</b> $$R=\frac{c\,\tau_{rt}}{2}$$ — two-way ranging to a passive reflector ($\tau_{ta}=0$).</p>
<p><b>Substitute.</b> $R=\dfrac{(3\times10^8)\times2.56}{2}.$</p>
<p><b>Compute.</b> $R=\dfrac{7.68\times10^8}{2}=3.84\times10^8\ \text{m}=\mathbf{384\,000\ km}.$</p>
<p><b>Explanation.</b> The mean Earth&ndash;Moon distance. Both epochs are timed on the observatory's single clock, so no synchronization with anything on the Moon is needed — the essential two-way advantage. Modern lunar laser ranging times the round trip to tens of picoseconds, measuring the Moon's distance to millimetres, and has revealed that the Moon recedes about 3.8 cm per year.</p>`
      },
      {
        q: String.raw`For the GPS C/A code ($R_c=1.023$ Mcps, $N=1023$ chips): find the chip length, the unambiguous range, and the range resolution if the tracking loop reads the peak to $0.01$ chip. Use $c=3\times10^8$ m/s.`,
        solution: String.raw`<p><b>Formula.</b> $$\ell_{\text{chip}}=\frac{c}{R_c},\qquad R_u=c\,N\,T_c=\frac{c\,N}{R_c},\qquad \sigma_R=0.01\,\ell_{\text{chip}}.$$</p>
<p><b>Substitute.</b> $\ell_{\text{chip}}=\dfrac{3\times10^8}{1.023\times10^6}$; $R_u=\dfrac{3\times10^8\times1023}{1.023\times10^6}$; $\sigma_R=0.01\times\ell_{\text{chip}}$.</p>
<p><b>Compute.</b> $\ell_{\text{chip}}=293.3\ \text{m/chip}$. Code period $=1023/1.023\times10^6=1.000$ ms, so $R_u=3\times10^8\times10^{-3}=3\times10^5\ \text{m}=\mathbf{300\ km}$. Resolution $\sigma_R=0.01\times293.3=\mathbf{2.93\ m}$.</p>
<p><b>Explanation.</b> The three numbers of the code-phase ruler: 293-m ticks, read to about 3 m by sub-chip interpolation, wrapping every 300 km. Since the satellites are 20&thinsp;100&ndash;26&thinsp;000 km away, the delay contains 67&ndash;86 whole code periods that the code phase alone cannot count — the navigation data's timestamps supply the lap count, a textbook layered-ambiguity ladder.</p>`
      },
      {
        q: String.raw`A receiver's pseudorange to a satellite reads $\rho=22\,100.0$ km while the true geometric range (from a surveyed position and precise ephemeris, all other errors removed) is $R=21\,800.0$ km. Find the receiver clock bias in time units.`,
        solution: String.raw`<p><b>Formula.</b> $$\rho=R+c\,\delta t_r\ \Rightarrow\ \delta t_r=\frac{\rho-R}{c}.$$</p>
<p><b>Substitute.</b> $\rho-R=22\,100.0-21\,800.0=300.0\ \text{km}=3.0\times10^5$ m; $\delta t_r=\dfrac{3.0\times10^5}{3\times10^8}$.</p>
<p><b>Compute.</b> $\delta t_r=1.0\times10^{-3}\ \text{s}=\mathbf{1.0\ ms}$ (receiver clock running 1 ms ahead of system time).</p>
<p><b>Explanation.</b> A perfectly ordinary crystal-oscillator offset produces a 300 km range overshoot — three orders of magnitude larger than every other error in the budget. The saving grace: this same 300 km appears identically on <em>every</em> satellite tracked at that instant, so the navigation solution absorbs it into the fourth unknown $b=c\,\delta t_r$ and simultaneously disciplines the receiver clock to GPS time.</p>`
      },
      {
        q: String.raw`A P(Y)-code receiver ($R_c=10.23$ Mcps) runs a coherent DLL with $B_L=0.5$ Hz, early-late spacing $\delta=0.2$ chip, at $C/N_0=42$ dB-Hz. Find the 1-sigma thermal ranging jitter in metres. Use $c=3\times10^8$ m/s.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_R=\frac{c}{R_c}\sqrt{\frac{B_L\,\delta}{2\,(C/N_0)}},$$ with $C/N_0$ converted to a linear ratio in Hz.</p>
<p><b>Substitute.</b> $C/N_0=10^{42/10}=10^{4.2}=1.585\times10^4$ Hz. Chip jitter $=\sqrt{\dfrac{0.5\times0.2}{2\times1.585\times10^4}}=\sqrt{\dfrac{0.1}{3.170\times10^4}}$. Chip length $=\dfrac{3\times10^8}{10.23\times10^6}=29.33$ m.</p>
<p><b>Compute.</b> Chip jitter $=\sqrt{3.155\times10^{-6}}=1.776\times10^{-3}$ chip. $\sigma_R=29.33\times1.776\times10^{-3}=\mathbf{0.052\ m}\approx5.2$ cm.</p>
<p><b>Explanation.</b> Five centimetres of thermal range noise from a 29-m-chip code — the power of sub-chip interpolation with a narrow loop and narrow correlator. The identical loop settings on the C/A code (293-m chips) would give ten times worse (52 cm), showing how chip rate scales straight into ranging precision. In practice multipath and residual atmosphere, not thermal noise, would dominate this receiver's error budget.</p>`
      },
      {
        q: String.raw`The GPS L1 carrier is at $f=1575.42$ MHz. Find the carrier wavelength, the range precision if the PLL tracks phase to $0.5\%$ of a cycle, and the number of whole wavelengths to a satellite 20&thinsp;100 km away. Use $c=3\times10^8$ m/s.`,
        solution: String.raw`<p><b>Formula.</b> $$\lambda=\frac{c}{f},\qquad \sigma_R=0.005\,\lambda,\qquad N\approx\frac{R}{\lambda}.$$</p>
<p><b>Substitute.</b> $\lambda=\dfrac{3\times10^8}{1.57542\times10^9}$; $\sigma_R=0.005\times\lambda$; $N=\dfrac{2.01\times10^7}{\lambda}$.</p>
<p><b>Compute.</b> $\lambda=0.1904\ \text{m}\approx\mathbf{19\ cm}$. $\sigma_R=0.005\times0.1904=9.5\times10^{-4}\ \text{m}\approx\mathbf{1\ mm}$. $N=\dfrac{2.01\times10^7}{0.1904}=\mathbf{1.06\times10^8}$ cycles.</p>
<p><b>Explanation.</b> The carrier is a millimetre-precision ruler — a hundred times finer than even sub-chip code tracking — but the path contains about 106 million whole wavelengths and the PLL cannot count a single one of them: that count is the integer ambiguity. The code pseudorange (metre-level) brackets the integer to within a handful of candidates ($\pm1$ m spans about $\pm5$ cycles), after which differencing and an integer search (LAMBDA) fix $N$ and unlock RTK-grade centimetre positioning.</p>`
      },
      {
        q: String.raw`A receiver's error budget gives $\sigma_{\text{UERE}}=1.4$ m per satellite. Compute the expected 1-sigma position error for an open-sky geometry with PDOP $=1.8$ and an urban-canyon geometry with PDOP $=6.0$.`,
        solution: String.raw`<p><b>Formula.</b> $$\sigma_{\text{pos}}=\text{PDOP}\times\sigma_{\text{UERE}}.$$</p>
<p><b>Substitute.</b> Open sky: $\sigma_{\text{pos}}=1.8\times1.4$. Urban canyon: $\sigma_{\text{pos}}=6.0\times1.4$.</p>
<p><b>Compute.</b> Open sky: $\sigma_{\text{pos}}=\mathbf{2.5\ m}$ (2.52 m). Urban canyon: $\sigma_{\text{pos}}=\mathbf{8.4\ m}$.</p>
<p><b>Explanation.</b> Identical receivers, identical per-satellite measurement quality — yet the fix is more than three times worse downtown purely because the visible satellites cluster in the strip of sky between buildings, making the geometry matrix ill-conditioned. In reality the canyon is doubly cruel: masking raises DOP <em>and</em> reflections raise $\sigma_{\text{UERE}}$ through multipath, so real urban errors grow faster than the DOP ratio alone predicts. This factorization — measurement times geometry — is the first diagnostic every navigation engineer applies to a bad fix.</p>`
      }
    ],
    realWorld: String.raw`<p>Pseudorange processing is the invisible infrastructure of modern life. Every smartphone fix begins with four or more code-phase pseudoranges — the phone's DLLs read each satellite's PN code phase to a few metres, the navigation solver inverts the geometry matrix, and out come latitude, longitude, altitude, and time. The time output is arguably the bigger business: cellular base stations, power-grid phasor measurement units, and financial-exchange timestamping all run on the nanosecond-class receiver clock bias that falls out of the fix for free. Surveyors and precision agriculture go two rungs up the ladder — RTK carrier-phase with fixed integer ambiguities delivers 1&ndash;2 cm in real time, and geodesists using days of carrier data measure continental drift at millimetres per year. The same pseudorange mathematics, with the signs rearranged, runs TDOA multilateration for air-traffic surveillance and E911 phone location.</p>
<p>Beyond Earth orbit, ranging is how we know where anything is. Deep-space probes carry coherent transponders: the DSN uplinks a PN ranging code (modern regenerative systems use component codes of coprime lengths, correlating each separately and reconstructing the delay by the Chinese-remainder structure), the spacecraft turns it around at a calibrated phase, and the two-way delay — measured on one hydrogen-maser clock — fixes the distance to metres at billions of kilometres; Doppler on the same carrier adds the velocity. Lunar laser ranging to Apollo retroreflectors times 2.56-second round trips to picoseconds, tracking the Moon to millimetres and testing general relativity. And indoors, UWB two-way ranging chips in phones and car keys measure round trips over nanosecond-wide pulses for 10-cm accuracy — the same $R=c\,\tau_{rt}/2$ as radar, shrunk onto a die. In every case the engineering levers are the ones derived here: chip rate for resolution, code period and layered ladders for ambiguity, clock architecture for bias, and geometry for how measurement errors become position errors.</p>`,
    related: ['dsss-acquisition', 'sliding-correlator', 'pn-codes', 'gold-code', 'link-budget']
  }
);
