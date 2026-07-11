/* sliding-correlator.js — "Sliding Correlator" topic (Spread Spectrum & Coding).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "sliding-correlator-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'sliding-correlator',
    title: 'Sliding Correlator',
    category: 'Spread Spectrum & Coding',
    tags: ['serial search', 'code acquisition', 'STDCC', 'channel sounder', 'PN correlation', 'slide factor', 'time dilation', 'dwell time', 'processing gain'],
    summary: String.raw`A sliding correlator slides a local PN replica in code phase against an incoming spread signal: the correlation stays near zero until the two codes align within a chip, then rises to the triangular autocorrelation peak. In the same hardware it serves two classic roles — as the simplest serial-search DSSS code-acquisition engine (step the replica, dwell, threshold, advance) and as the swept time-delay cross-correlation (STDCC) channel sounder, where clocking the replica slightly slow ($f-\Delta f$) maps a wideband channel impulse response onto a slow, time-dilated axis a cheap ADC can capture.`,
    prerequisites: ['dsss', 'pn-codes', 'correlation'],
    intro: String.raw`<p><strong>Why do we need a "sliding" correlator at all — why not just correlate once and be done?</strong> A direct-sequence spread-spectrum (DSSS) signal is a data stream multiplied by a fast pseudo-noise (PN) chip sequence that smears the energy across a wide band and buries it below the noise floor. To recover anything, the receiver must line up its own local copy of that PN code with the incoming code to within a fraction of one chip. But the receiver does not know the arriving code phase: the transmitter started at an unknown time, the path delay is unknown, and Doppler stretches the timing. A single correlation at one guessed phase almost always lands on the flat, near-zero part of the autocorrelation and tells you nothing. You must <em>search</em> — try phase after phase until the codes align and the correlation suddenly peaks. The sliding correlator is the machine that performs that search by sliding its local replica through the possible code phases and watching for the peak.</p>
<p>The same "slide the replica past the incoming code and watch the correlation" idea powers a second, beautiful application: the <strong>swept time-delay cross-correlation (STDCC) channel sounder</strong>. Here you deliberately clock the local PN replica at a slightly <em>slower</em> chip rate than the transmitted one. The replica then drifts continuously in phase relative to the incoming code, and as it drifts it sweeps out the entire channel impulse response — every multipath echo — but stretched onto a slow, <strong>time-dilated</strong> time axis. That dilation is the whole trick: it lets a modest, slow analog-to-digital converter capture a response that was originally hundreds of megahertz wide. One elegant structure, two indispensable jobs.</p>
<p>This topic derives the PN autocorrelation triangle that makes the peak detectable, the serial-search mechanics (half-chip stepping, dwell time, threshold, cell count) and its mean acquisition time, and the STDCC slide factor $k=f/\Delta f$ with its delay resolution $1/f$ and unambiguous range equal to the code period. It complements the <em>DSSS acquisition</em> topic (which surveys the whole family of acquisition schemes); here we focus on the sliding correlator as the canonical serial searcher and as the channel-sounding instrument.</p>`,
    sections: [
      {
        h: 'Why sliding: the code-phase search problem',
        html: String.raw`<p><strong>Why is acquisition a search and not a single measurement?</strong> Despreading a DSSS signal requires the local PN replica to be aligned with the incoming code to within a small fraction of a chip. The receiver, however, faces an <em>uncertainty region</em>: the code phase can be anywhere within one full code period (there are $N$ chips, so $N$ possible whole-chip alignments and, at half-chip resolution, $2N$ cells), and the carrier can be offset by an unknown Doppler. Together these form a two-dimensional grid of candidate <strong>cells</strong> — code phase $\times$ Doppler — and exactly one cell is correct.</p>
<p>Because the PN autocorrelation is essentially zero everywhere except within $\pm1$ chip of perfect alignment, a correlation at a wrong cell returns noise-level output, while the one right cell returns a sharp peak. The sliding correlator exploits this: it parks its replica at one code phase, correlates (integrates) for a <strong>dwell time</strong> $T_d$, compares the result to a threshold, and if nothing is found it <em>slides</em> the replica to the next phase and repeats. The slide can be discrete (step by half a chip each dwell) or continuous (run the replica clock slightly off-rate so the phase creeps).</p>
<div class="callout"><strong>Intuition:</strong> imagine two identical, very long barcodes, one printed on a fixed strip and one on a sliding strip. Overlap is meaningless noise until the two barcodes line up — then a photocell reading the overlap suddenly spikes. The sliding correlator is that photocell, and "acquisition" is the moment the barcodes register.</div>`
      },
      {
        h: 'The PN autocorrelation triangle: what makes the peak detectable',
        html: String.raw`<p>Everything the sliding correlator does rests on one property of a good PN sequence: its autocorrelation is a narrow triangular spike. For a maximal-length (m-sequence) or similar code of $\pm1$ chips, each of duration $T_c$, the normalized autocorrelation is</p>
<p>$$R(\tau)=\begin{cases}1-\dfrac{\lvert\tau\rvert}{T_c}, & \lvert\tau\rvert\le T_c,\\[4pt]-\dfrac1N\approx0,&\lvert\tau\rvert>T_c,\end{cases}$$</p>
<p>where $\tau$ is the delay between incoming and local codes and $N$ is the code length. Two facts matter. First, the peak is only $\pm1$ chip wide, so the searcher must test phases at a spacing fine enough not to step over it — hence the standard <strong>half-chip step</strong>. Second, off the peak the correlation collapses to $-1/N$, which for a long code is negligible; this near-zero floor is what makes the peak stand out against noise and gives DSSS its <em>processing gain</em>.</p>
<p>When the searcher's replica is offset by $\tau$ chips, the correlator output magnitude follows $R(\tau)$: near zero for $\lvert\tau\rvert>1$ chip, then climbing linearly to the peak at $\tau=0$. Plotting output versus code offset (the figure below) is therefore a triangle sitting on a noise floor — the search is a hunt for that triangle.</p>
<div class="callout tip"><strong>Tip:</strong> the triangle's $\pm1$-chip width is exactly the delay resolution of the instrument. You cannot resolve two multipath echoes closer than one chip, which is why channel sounders push the chip rate $f$ as high as possible — resolution is $1/f$.</div>`
      },
      {
        h: 'Serial search: step, dwell, threshold, advance',
        html: String.raw`<p>The classic sliding correlator implements a <strong>serial search</strong> over the uncertainty region, one cell at a time. The procedure per cell is:</p>
<ol>
<li><strong>Set phase.</strong> Position the local replica at the current candidate code phase (and Doppler bin).</li>
<li><strong>Dwell.</strong> Correlate the incoming signal against the replica and integrate for the dwell time $T_d$. Longer $T_d$ raises the signal-to-noise ratio of the test statistic but slows the search.</li>
<li><strong>Compare.</strong> Test the integrated magnitude against a threshold $\gamma$. If it exceeds $\gamma$, declare a hit and hand over to verification/tracking; otherwise it is a miss.</li>
<li><strong>Advance.</strong> On a miss, slide the replica by the step size (typically $\tfrac12$ chip) to the next cell and repeat, wrapping around the code period and sweeping Doppler bins as needed.</li>
</ol>
<p>The number of cells to examine is $q = 2N \times N_D$, where $2N$ is the count of half-chip code-phase cells over an $N$-chip period and $N_D$ is the number of Doppler bins. Detection is probabilistic: at the correct cell the test exceeds $\gamma$ with <strong>detection probability</strong> $P_d$; at any wrong cell it may exceed $\gamma$ by noise alone with <strong>false-alarm probability</strong> $P_{fa}$, triggering a costly penalty (a verification dwell of duration $\sim K\,T_d$) before the search resumes.</p>
<table class="data">
<tr><th>Design lever</th><th>Effect on search</th><th>Trade-off</th></tr>
<tr><td>Step $=\tfrac12$ chip</td><td>Guarantees a cell within $\pm\tfrac14$ chip of the peak</td><td>Doubles cell count vs 1-chip step</td></tr>
<tr><td>Longer dwell $T_d$</td><td>Higher $P_d$, lower $P_{fa}$</td><td>Slower per-cell, longer total search</td></tr>
<tr><td>Higher threshold $\gamma$</td><td>Lower $P_{fa}$ (fewer penalties)</td><td>Lower $P_d$ (may miss the true cell)</td></tr>
</table>`
      },
      {
        h: 'Continuous slide: two clocks and a creeping phase',
        html: String.raw`<p>Instead of discretely stepping the replica, the sliding correlator can slide it <em>continuously</em> by running the local code clock at a slightly different rate from the incoming code. If the incoming chip rate is $f$ and the local replica is clocked at $f-\Delta f$, the two codes accumulate a relative phase difference at a steady rate of $\Delta f$ chips per second. The replica therefore creeps past the incoming code, and the correlator output traces the entire autocorrelation triangle over time — a peak appears once per code period as alignment sweeps by.</p>
<p>This continuous slide is the natural mode for two reasons. In <strong>acquisition</strong>, it removes the need for explicit phase-stepping logic: the phase advances itself, and you simply watch for the peak, then stop (or slow) the offset once found. In <strong>channel sounding</strong>, the continuous slide is the whole measurement principle — the steady creep maps the channel's delay axis onto a slow output time axis, as the next section develops.</p>
<p>The slide rate sets a fundamental compromise. A larger $\Delta f$ sweeps the uncertainty region faster (quick acquisition, rapid channel snapshots) but spends less dwell time per chip of alignment, lowering the effective integration gain and the ability to detect weak peaks. A smaller $\Delta f$ dwells longer near each alignment (better sensitivity and finer effective resolution) but takes proportionally longer to sweep the whole code.</p>
<div class="callout"><strong>Intuition:</strong> two turntables spinning at almost the same speed. Their patterns line up briefly, once per beat period, at a rate set purely by the tiny speed difference $\Delta f$ — not by how fast either turntable spins.</div>`
      },
      {
        h: 'The STDCC channel sounder: time dilation from the slide',
        html: String.raw`<p>The <strong>swept time-delay cross-correlation (STDCC)</strong> channel sounder is the sliding correlator deployed as a measurement instrument. A transmitter sends a known PN sequence at chip rate $f$ through the radio channel. Multipath makes the receiver see many delayed, scaled copies of that PN signal — the channel impulse response (CIR) convolved with the PN. At the receiver an identical PN replica is generated at the slightly slower rate $f-\Delta f$ and cross-correlated with the incoming signal.</p>
<p>Because the replica slides at $\Delta f$ chips per second, each multipath component produces a correlation peak as the replica sweeps through its delay, and the peaks appear spread out on a <em>stretched</em> time axis. The stretch is the <strong>slide factor</strong> (time-dilation factor)</p>
<p>$$k=\frac{f}{\Delta f},$$</p>
<p>meaning one chip of real channel delay ($1/f$ seconds) is mapped to $k$ chips of output time, i.e. to $k/f = 1/\Delta f$ seconds of output. A channel that is, say, 200 MHz wide (a 5 ns chip) is thereby displayed on an output whose features are $k$ times slower — slow enough for an inexpensive ADC to sample faithfully. The instrument trades measurement <em>time</em> for measurement <em>bandwidth</em>: it captures a wideband CIR with narrowband electronics.</p>
<ul>
<li><strong>Delay resolution</strong> = one chip = $1/f$: two echoes closer than a chip merge into one triangle.</li>
<li><strong>Unambiguous delay (range) window</strong> = one code period $= N/f$: delays beyond this alias back, exactly as the code repeats.</li>
<li><strong>Processing gain</strong> $\approx 10\log_{10}(k)$ dB in the compressed output, from integrating the slide; it rejects out-of-band interference just as DSSS despreading does.</li>
</ul>`
      },
      {
        h: 'Mean acquisition time of the serial search',
        html: String.raw`<p>How long does the serial search take on average? The dominant cost is the number of cells that must be examined before the true one is tested and detected, plus the penalty for any false alarms along the way. A standard result for a single-dwell serial search over $q$ equally likely cells gives the <strong>mean acquisition time</strong></p>
<p>$$E[T_{acq}]=\frac{(2-P_d)}{2P_d}\,\big(1+K\,P_{fa}\big)\,q\,T_d,$$</p>
<p>where $q=2N\,N_D$ is the cell count, $T_d$ the dwell per cell, $P_d$ the detection probability at the true cell, $P_{fa}$ the false-alarm probability at a wrong cell, and $K$ the penalty factor (a false alarm wastes about $K$ dwell times before the search resumes).</p>
<p>Read the structure directly. The factor $q\,T_d$ is the time to sweep all cells once. The $(2-P_d)/(2P_d)$ term reflects that with imperfect detection you may sweep past the true cell and go around again: at $P_d=1$ it equals $\tfrac12$ (on average the true cell sits halfway through the sweep), and it grows as $P_d$ falls. The $(1+K\,P_{fa})$ term inflates the time by the expected false-alarm penalties. The equations section derives this from first principles.</p>
<div class="callout tip"><strong>Tip:</strong> the search time scales <em>linearly</em> with the code length $N$ (through $q$). This is the sliding correlator's Achilles heel — for a very long code, serial search is slow, motivating the parallel and FFT-based acquisition schemes covered under <em>DSSS acquisition</em>.</div>`
      },
      {
        h: 'Sliding correlator vs parallel and matched-filter acquisition',
        html: String.raw`<p>The sliding (serial) correlator is prized for its <strong>simplicity</strong>: one correlator, one PN generator, minimal hardware, and it works with arbitrarily long codes without more silicon. Its cost is <strong>speed</strong>: mean acquisition time grows linearly with $q$ (hence with code length and Doppler uncertainty), which becomes prohibitive for long codes or high dynamics. The alternatives buy speed with hardware:</p>
<table class="data">
<tr><th>Scheme</th><th>Hardware</th><th>Search time</th><th>Best when</th></tr>
<tr><td>Sliding / serial correlator</td><td>1 correlator</td><td>$\propto q$ (slow)</td><td>Long codes, cheap hardware, relaxed time</td></tr>
<tr><td>Parallel (bank of) correlators</td><td>$M$ correlators</td><td>$\propto q/M$</td><td>Moderate code length, faster lock needed</td></tr>
<tr><td>PN matched filter</td><td>Tapped delay line ($N$ taps)</td><td>$\propto 1$ (fastest)</td><td>Short codes, low-latency preambles</td></tr>
<tr><td>FFT / frequency-domain</td><td>FFT engine</td><td>$\propto N_D$ (one FFT block tests all code phases)</td><td>Large code $\times$ Doppler search space</td></tr>
</table>
<p>The engineering choice is a classic time-versus-resources trade. A GPS receiver acquiring a 1023-chip C/A code under Doppler uncertainty may use parallel or FFT acquisition for a fast first fix, whereas a simple telemetry link with a long code and no urgency can slide serially. The sliding correlator remains the conceptual baseline against which the faster schemes are measured — and, uniquely, it doubles as a wideband channel-sounding instrument, a role the fast acquisition engines do not fill.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>The sliding correlator is one structure with two jobs — serial DSSS acquisition and STDCC channel sounding. You should now be able to say:</p>
<ul>
<li><strong>The principle:</strong> a local PN replica is slid in code phase against the incoming code; correlation is near the $-1/N$ floor until alignment within one chip, then rises up the autocorrelation triangle $R(\tau)=1-\lvert\tau\rvert/T_c$ to its peak — the searcher hunts for that triangle.</li>
<li><strong>Serial search mechanics:</strong> step (usually $\tfrac12$ chip), dwell $T_d$, threshold $\gamma$, advance; the uncertainty region holds $q=2N\,N_D$ cells, and detection is governed by $P_d$ and $P_{fa}$.</li>
<li><strong>Continuous slide:</strong> clocking the replica at $f-\Delta f$ makes the phase creep at $\Delta f$ chips/s, so the correlation peak sweeps by once per code period — no explicit stepping logic needed.</li>
<li><strong>STDCC sounding:</strong> the slide dilates the channel delay axis by $k=f/\Delta f$, letting a slow ADC capture a wideband impulse response; delay resolution is $1/f$ and the unambiguous window is one code period $N/f$.</li>
<li><strong>Mean acquisition time:</strong> $E[T_{acq}]=\tfrac{(2-P_d)}{2P_d}(1+K P_{fa})\,q\,T_d$, which scales <em>linearly</em> with code length — simple but slow.</li>
<li><strong>Where it sits:</strong> simplest of the acquisition family; parallel, matched-filter, and FFT schemes trade hardware for speed, but only the sliding correlator also serves as a channel sounder.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://patents.google.com/patent/US5574754" target="_blank" rel="noopener">Google Patents US5574754 — "Sliding correlator"</a> — the primary-source patent for a spread-spectrum sliding correlator, describing early/center/late reference codes, fractional-chip stepping, and the digital acquisition-then-track flow in concrete hardware terms.</li>
<li><a href="https://arxiv.org/abs/2009.13490" target="_blank" rel="noopener">arXiv 2009.13490 — A Wideband Sliding Correlator Based Channel Sounder in 65 nm CMOS</a> — a modern hardware realization of the STDCC principle: a monolithic sliding-correlator channel sounder with 2 GHz null-to-null RF bandwidth and nanosecond multipath time resolution, showing how the slide/time-dilation technique lets low-cost integrated electronics capture a wideband impulse response.</li>
<li><a href="https://nvlpubs.nist.gov/nistpubs/TechnicalNotes/NIST.TN.1979.pdf" target="_blank" rel="noopener">NIST Technical Note 1979 — Channel Sounder Overview</a> — a government-lab reference on PN-sequence correlation-based channel sounders, covering the measurement chain, resolution/range trade-offs, and calibration for real propagation measurements.</li>
<li><a href="https://en.wikipedia.org/wiki/Spread_spectrum" target="_blank" rel="noopener">Wikipedia — Spread spectrum</a> — a broad, accessible entry point placing PN correlation, despreading, processing gain, and code synchronization in the wider spread-spectrum context, with links onward to DSSS and acquisition topics.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`A sliding correlator slides a local PN replica in code phase against the incoming spread signal and watches for the autocorrelation peak that appears only when the codes align within one chip.`,
      String.raw`The PN autocorrelation is a narrow triangle $R(\tau)=1-\lvert\tau\rvert/T_c$ for $\lvert\tau\rvert\le T_c$, falling to $\approx-1/N$ off the peak — the near-zero floor is what makes the peak detectable.`,
      String.raw`Serial search examines cells one at a time: set phase, dwell $T_d$, compare to threshold $\gamma$, advance (typically by $\tfrac12$ chip) on a miss.`,
      String.raw`The uncertainty region has $q=2N\,N_D$ cells ($2N$ half-chip code-phase cells over an $N$-chip period times $N_D$ Doppler bins).`,
      String.raw`Detection is probabilistic: the true cell exceeds $\gamma$ with probability $P_d$; a wrong cell falsely alarms with probability $P_{fa}$, incurring a penalty of about $K$ dwell times.`,
      String.raw`A continuous slide is produced by clocking the local code at $f-\Delta f$ so the relative code phase creeps at $\Delta f$ chips per second, no explicit stepping logic required.`,
      String.raw`Mean acquisition time: $E[T_{acq}]=\dfrac{(2-P_d)}{2P_d}(1+K P_{fa})\,q\,T_d$, scaling linearly with code length $N$ through $q$.`,
      String.raw`In the STDCC channel sounder the transmitter uses chip rate $f$ and the receiver correlates with a replica at $f-\Delta f$, sliding to map the channel impulse response onto a stretched output axis.`,
      String.raw`The slide (time-dilation) factor is $k=f/\Delta f$: one chip of real delay maps to $k$ chips ($=1/\Delta f$ seconds) of output time, letting a slow ADC capture a wideband response.`,
      String.raw`Delay resolution of the sounder is one chip $=1/f$; two echoes closer than a chip cannot be resolved, so higher $f$ gives finer resolution.`,
      String.raw`Unambiguous delay (range) window equals one code period $N/f$; delays beyond it alias, mirroring the code's periodicity.`,
      String.raw`Sliding-correlator processing gain in the compressed output is about $10\log_{10}(k)$ dB, rejecting out-of-band interference like DSSS despreading.`,
      String.raw`A larger $\Delta f$ sweeps faster but dwells less (lower sensitivity); a smaller $\Delta f$ dwells longer (more sensitive) but sweeps slowly — the core slide-rate trade.`,
      String.raw`The sliding correlator is the simplest acquisition scheme (one correlator, any code length) but the slowest; parallel, matched-filter, and FFT methods trade hardware for speed.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Correlation vs code offset: the triangle on a noise floor</text>
<line x1="40" y1="200" x2="510" y2="200" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="275" y1="55" x2="275" y2="210" stroke="#9aa7b5" stroke-width="0.8" stroke-dasharray="4 3"/>
<text x="498" y="216" fill="#9aa7b5" font-size="10">offset $\tau$ (chips)</text>
<text x="282" y="66" fill="#9aa7b5" font-size="10">$R(\tau)$</text>
<!-- noise floor near -1/N (approx 0) -->
<line x1="40" y1="188" x2="215" y2="188" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="335" y1="188" x2="510" y2="188" stroke="#9aa7b5" stroke-width="1.1"/>
<text x="70" y="182" fill="#9aa7b5" font-size="9">floor $\approx -1/N$</text>
<text x="410" y="182" fill="#9aa7b5" font-size="9">floor</text>
<!-- triangle: peak at (275,65), base corners at (215,188) and (335,188) -->
<path d="M215,188 L275,65 L335,188" fill="none" stroke="#4dabf7" stroke-width="2"/>
<circle cx="275" cy="65" r="4" fill="#63e6be"/><text x="284" y="60" fill="#63e6be" font-size="10">peak at $\tau=0$</text>
<line x1="215" y1="188" x2="215" y2="205" stroke="#ffa94d" stroke-width="0.9" stroke-dasharray="3 2"/>
<line x1="335" y1="188" x2="335" y2="205" stroke="#ffa94d" stroke-width="0.9" stroke-dasharray="3 2"/>
<text x="196" y="228" fill="#ffa94d" font-size="9">$-1$</text>
<text x="330" y="228" fill="#ffa94d" font-size="9">$+1$</text>
<text x="250" y="228" fill="#ffa94d" font-size="9">$\pm1$ chip wide</text>
<!-- slide arrow -->
<line x1="120" y1="240" x2="230" y2="240" stroke="#b197fc" stroke-width="1.4" marker-end="url(#sliding-correlator-arrow)"/>
<defs><marker id="sliding-correlator-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#b197fc"/></marker></defs>
<text x="130" y="253" fill="#b197fc" font-size="9">replica slides in phase, output climbs the triangle</text>
</svg>`,
        caption: 'Correlator output versus code offset. Off the peak the output sits on a near-zero floor (about -1/N); within one chip of alignment it rises linearly to the triangular autocorrelation peak at tau=0. Acquisition is the hunt for this triangle as the replica slides in code phase.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="sliding-correlator-a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="300" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Serial-search flow: step, dwell, threshold, advance</text>
<!-- Set phase -->
<rect x="200" y="40" width="140" height="30" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/>
<text x="214" y="59" fill="#e6edf3" font-size="10">set replica code phase</text>
<line x1="270" y1="70" x2="270" y2="90" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#sliding-correlator-a2)"/>
<!-- Dwell -->
<rect x="200" y="90" width="140" height="30" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/>
<text x="212" y="109" fill="#e6edf3" font-size="10">dwell: integrate $T_d$</text>
<line x1="270" y1="120" x2="270" y2="140" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#sliding-correlator-a2)"/>
<!-- Threshold decision -->
<path d="M270,140 L350,175 L270,210 L190,175 Z" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.4"/>
<text x="238" y="172" fill="#e6edf3" font-size="10">output</text>
<text x="242" y="186" fill="#9aa7b5" font-size="9">$> \gamma$ ?</text>
<!-- No branch: advance -->
<line x1="190" y1="175" x2="90" y2="175" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#sliding-correlator-a2)"/>
<text x="120" y="168" fill="#ff6b6b" font-size="9">no (miss)</text>
<rect x="20" y="160" width="70" height="30" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/>
<text x="28" y="179" fill="#e6edf3" font-size="9">advance $\tfrac12$ chip</text>
<line x1="55" y1="160" x2="55" y2="55" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="55" y1="55" x2="200" y2="55" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#sliding-correlator-a2)"/>
<!-- Yes branch: hit -->
<line x1="350" y1="175" x2="440" y2="175" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#sliding-correlator-a2)"/>
<text x="360" y="168" fill="#63e6be" font-size="9">yes (hit)</text>
<rect x="440" y="160" width="90" height="30" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/>
<text x="450" y="179" fill="#e6edf3" font-size="9">verify / track</text>
<!-- footer: cells -->
<text x="60" y="255" fill="#9aa7b5" font-size="10">Uncertainty region: $q = 2N \times N_D$ cells (half-chip code phase x Doppler bins).</text>
<text x="60" y="275" fill="#9aa7b5" font-size="10">True cell detected w.p. $P_d$; a wrong cell false-alarms w.p. $P_{fa}$ (penalty $\approx K\,T_d$).</text>
</svg>`,
        caption: 'The serial-search loop of a sliding correlator: set the replica code phase, dwell (integrate for T_d), compare to threshold gamma; on a miss advance by half a chip and repeat, on a hit hand over to verification/tracking. The uncertainty region spans q = 2N x N_D cells, with detection probability P_d and false-alarm probability P_fa.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 270" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="sliding-correlator-a3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="270" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">STDCC channel sounder: slide dilates the delay axis by $k=f/\Delta f$</text>
<!-- TX -->
<rect x="20" y="50" width="96" height="34" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/>
<text x="30" y="65" fill="#e6edf3" font-size="9">PN gen @ $f$</text>
<text x="30" y="78" fill="#9aa7b5" font-size="9">BPSK TX</text>
<line x1="116" y1="67" x2="170" y2="67" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#sliding-correlator-a3)"/>
<!-- channel -->
<rect x="170" y="48" width="96" height="38" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/>
<text x="180" y="64" fill="#e6edf3" font-size="9">radio channel</text>
<text x="180" y="78" fill="#9aa7b5" font-size="9">multipath CIR</text>
<line x1="266" y1="67" x2="320" y2="67" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#sliding-correlator-a3)"/>
<!-- mixer/correlator -->
<circle cx="340" cy="67" r="15" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/><text x="333" y="72" fill="#e6edf3" font-size="13">$\times$</text>
<rect x="300" y="120" width="120" height="30" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/>
<text x="308" y="139" fill="#e6edf3" font-size="9">PN replica @ $f-\Delta f$</text>
<line x1="340" y1="120" x2="340" y2="84" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#sliding-correlator-a3)"/>
<line x1="355" y1="67" x2="410" y2="67" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#sliding-correlator-a3)"/>
<rect x="410" y="50" width="110" height="34" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.4"/>
<text x="420" y="65" fill="#e6edf3" font-size="9">integrate + slow</text>
<text x="420" y="78" fill="#9aa7b5" font-size="9">ADC</text>
<!-- dilated output plot -->
<text x="40" y="180" fill="#e6edf3" font-size="10">dilated output (time-stretched CIR):</text>
<line x1="40" y1="245" x2="510" y2="245" stroke="#9aa7b5" stroke-width="1.1"/>
<path d="M70,245 L82,205 L94,245" fill="none" stroke="#b197fc" stroke-width="1.6"/>
<path d="M180,245 L192,222 L204,245" fill="none" stroke="#b197fc" stroke-width="1.6"/>
<path d="M330,245 L342,232 L354,245" fill="none" stroke="#b197fc" stroke-width="1.6"/>
<text x="60" y="262" fill="#9aa7b5" font-size="9">1 chip real delay = $1/f$  maps to  $k/f = 1/\Delta f$  of output time</text>
<text x="360" y="200" fill="#9aa7b5" font-size="9">res. $=1/f$; window $=N/f$</text>
</svg>`,
        caption: 'STDCC channel sounder block diagram. The transmitter sends a PN sequence at chip rate f through the multipath channel; the receiver correlates against a replica clocked slightly slow at f - delta_f. The slide stretches the channel impulse response by the slide factor k = f/delta_f onto a slow output axis a cheap ADC can sample. Delay resolution is 1/f and the unambiguous window is one code period N/f.'
      }
    ],
    equations: [
      {
        title: 'PN Autocorrelation Triangle',
        tex: String.raw`$$R(\tau)=1-\frac{\lvert\tau\rvert}{T_c},\ \ \lvert\tau\rvert\le T_c;\qquad R(\tau)=-\frac1N,\ \ \lvert\tau\rvert>T_c$$`,
        derivation: String.raw`<p><b>Where we start.</b> A maximal-length PN code is a periodic stream of $N$ chips, each $\pm1$ and of duration $T_c$, with the near-ideal property that its normalized periodic autocorrelation is $+1$ at zero shift and $-1/N$ at every nonzero integer-chip shift. We correlate the code $c(t)$ with a copy shifted by a delay $\tau$: $R(\tau)=\tfrac1{NT_c}\int c(t)\,c(t-\tau)\,dt$, normalized so $R(0)=1$.</p>
<p><b>Step 1.</b> Take a shift of $\tau$ with $0\le\tau\le T_c$ (less than one chip). Within each chip interval the shifted copy overlaps the same chip for a fraction $1-\tau/T_c$ of the interval and overlaps the neighbouring chip for the remaining fraction $\tau/T_c$.</p>
<p><b>Step 2.</b> Over the matched fraction $1-\tau/T_c$ the product $c\cdot c=+1$. Over the mismatched fraction $\tau/T_c$ the product involves adjacent chips, whose sum over the whole period contributes the small $-1/N$ background. Ignoring the $-1/N$ term for a long code, the correlation is $(1-\tau/T_c)\cdot1=1-\tau/T_c$.</p>
<p><b>Result.</b> By symmetry the same holds for negative shifts, giving the triangle $R(\tau)=1-\lvert\tau\rvert/T_c$ for $\lvert\tau\rvert\le T_c$, decaying to the floor $-1/N\approx0$ beyond one chip. This narrow, $\pm1$-chip-wide spike sitting on a near-zero floor is exactly what the sliding correlator hunts for: the peak marks alignment, the floor makes it stand out, and the one-chip width sets the instrument's delay resolution.</p>`
      },
      {
        title: 'Number of Search Cells',
        tex: String.raw`$$q = 2N \times N_D$$`,
        derivation: String.raw`<p><b>Where we start.</b> Acquisition must test every candidate alignment of code phase and carrier Doppler. We count how many discrete cells that uncertainty region contains, since the search time is proportional to it.</p>
<p><b>Step 1.</b> The code repeats every $N$ chips, so the code-phase ambiguity spans $N$ chips. To guarantee that some test cell lands within a fraction of a chip of the peak (whose base is $\pm1$ chip), the searcher steps by half a chip. Half-chip stepping over $N$ chips yields $2N$ code-phase cells.</p>
<p><b>Step 2.</b> Independently, the carrier frequency is uncertain by an unknown Doppler. Dividing the Doppler uncertainty into resolvable bins of width set by the dwell time gives $N_D$ Doppler cells. Because code phase and Doppler are independent axes, the total is their product.</p>
<p><b>Result.</b> $q = 2N\,N_D$ cells. Every cell costs one dwell $T_d$ to test, so $q$ directly sets the search burden — and because $q$ grows with $N$, the serial search slows linearly with code length. This is the quantity that appears in the mean-acquisition-time formula and the reason very long codes push designers toward parallel or FFT acquisition.</p>`
      },
      {
        title: 'Mean Acquisition Time (Serial Search)',
        tex: String.raw`$$E[T_{acq}]=\frac{(2-P_d)}{2P_d}\,\big(1+K\,P_{fa}\big)\,q\,T_d$$`,
        derivation: String.raw`<p><b>Where we start.</b> Model the serial search as sweeping $q$ equally likely cells in a fixed order, testing each for one dwell $T_d$. The true cell is detected with probability $P_d$; each of the $q-1$ wrong cells raises a false alarm with probability $P_{fa}$, and a false alarm costs an extra penalty time modelled as $K$ dwells (a verification stage) before the sweep resumes.</p>
<p><b>Step 1.</b> Suppose the true cell is the $i$-th one reached on a sweep. If detected, the time spent is roughly $i\,T_d$ (plus false-alarm penalties from the $i-1$ wrong cells already tested). Because the true cell is equally likely to be anywhere, averaging $i$ over a sweep contributes a factor of about $q/2$ when $P_d=1$.</p>
<p><b>Step 2.</b> Imperfect detection means the true cell may be missed (probability $1-P_d$), forcing another full sweep of $q$ cells before another chance. Summing the geometric series of repeated sweeps replaces the simple $q/2$ with $\dfrac{(2-P_d)}{2P_d}\,q$: this equals $q/2$ at $P_d=1$ and grows as $P_d$ falls. Meanwhile every dwell (there are $\propto q$ of them) carries an expected false-alarm penalty, inflating the per-cell time by the factor $(1+K\,P_{fa})$.</p>
<p><b>Result.</b> Multiplying the averaged cell count by the dwell and the false-alarm inflation gives $E[T_{acq}]=\dfrac{(2-P_d)}{2P_d}(1+K P_{fa})\,q\,T_d$. It shows the three levers cleanly: raise $P_d$ (longer dwell) to cut repeated sweeps, lower $P_{fa}$ (higher threshold) to cut penalties, and shrink $q$ (shorter code, narrower Doppler search) to cut the linear burden — at the cost of dwell time or missed detections.</p>`
      },
      {
        title: 'Continuous Slide Rate',
        tex: String.raw`$$\frac{d\,\tau}{dt}=\Delta f\ \text{chips/s},\qquad T_{slide}=\frac{N}{\Delta f}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Instead of stepping, run the local PN clock at $f-\Delta f$ while the incoming code chips at $f$. We want the rate at which the relative code phase $\tau$ (in chips) advances, and how long it takes the replica to slide through one full code period.</p>
<p><b>Step 1.</b> In one second the incoming code advances by $f$ chips and the local replica by $f-\Delta f$ chips. The relative phase between them therefore advances by $f-(f-\Delta f)=\Delta f$ chips in that second, so $d\tau/dt=\Delta f$ chips per second — a steady creep set purely by the clock offset.</p>
<p><b>Step 2.</b> The code repeats every $N$ chips, so a full sweep of the code-phase ambiguity requires the relative phase to advance by $N$ chips. At the creep rate $\Delta f$ chips/s, this takes $T_{slide}=N/\Delta f$ seconds, during which the correlation peak appears exactly once as alignment passes through.</p>
<p><b>Result.</b> The relative phase slides at $\Delta f$ chips/s and one full sweep takes $T_{slide}=N/\Delta f$. A larger $\Delta f$ sweeps the code faster (quick acquisition or rapid channel snapshots) but dwells less near each alignment, reducing sensitivity; a smaller $\Delta f$ dwells longer (more sensitive, finer effective resolution) at the price of a slower sweep. This single clock-offset parameter governs the whole speed-versus-sensitivity trade of the continuous sliding correlator.</p>`
      },
      {
        title: 'Slide (Time-Dilation) Factor',
        tex: String.raw`$$k=\frac{f}{\Delta f}$$`,
        derivation: String.raw`<p><b>Where we start.</b> In the STDCC sounder a feature (multipath echo) at real channel delay $\tau_{real}$ appears in the correlator output at some later output time $\tau_{out}$. We want the ratio $k=\tau_{out}/\tau_{real}$, the factor by which the delay axis is stretched.</p>
<p><b>Step 1.</b> A real delay of one chip is $\tau_{real}=1/f$ seconds. For that echo's replica-to-signal alignment to be reached, the sliding replica must creep by one chip of relative phase. From the slide-rate result, the relative phase advances at $\Delta f$ chips per second.</p>
<p><b>Step 2.</b> Advancing one chip of relative phase at $\Delta f$ chips/s takes $\tau_{out}=1/\Delta f$ seconds of output time. Forming the ratio: $k=\dfrac{\tau_{out}}{\tau_{real}}=\dfrac{1/\Delta f}{1/f}=\dfrac{f}{\Delta f}$.</p>
<p><b>Result.</b> The output time axis is a dilated copy of the real delay axis by the slide factor $k=f/\Delta f$. One chip of real delay ($1/f$) is stretched to $1/\Delta f$ of output time, so a very wideband (small $1/f$) response is displayed slowly enough for a modest ADC to sample. This bandwidth-for-time trade is the defining property of the STDCC sounder, and $k$ also equals the compression gain, giving processing gain $\approx10\log_{10}k$ dB.</p>`
      },
      {
        title: 'Delay Resolution',
        tex: String.raw`$$\Delta\tau_{res}=T_c=\frac1f$$`,
        derivation: String.raw`<p><b>Where we start.</b> Two multipath echoes arriving at delays $\tau_1$ and $\tau_2$ each produce an autocorrelation triangle in the output. We ask how close $\tau_1$ and $\tau_2$ can be before the two triangles merge into one and become unresolvable.</p>
<p><b>Step 1.</b> Each triangle has a base half-width of one chip: it is nonzero only for offsets within $\pm T_c$ of that echo's true delay, peaking at the delay itself. So an echo at $\tau_1$ contributes a triangle spanning $[\tau_1-T_c,\ \tau_1+T_c]$.</p>
<p><b>Step 2.</b> If the second echo's delay satisfies $\lvert\tau_2-\tau_1\rvert<T_c$, its triangle's rising edge overlaps the first triangle's falling edge before either has returned to the floor, so the sum shows a single broadened lobe with no distinct second peak. Only when $\lvert\tau_2-\tau_1\rvert\ge T_c$ do two separable peaks appear.</p>
<p><b>Result.</b> The minimum resolvable delay separation is one chip, $\Delta\tau_{res}=T_c=1/f$. Resolution is set entirely by the chip rate: doubling $f$ halves the chip and resolves echoes twice as close. This is why wideband channel sounders and high-resolution rangers use the highest chip rate their hardware allows — and note the slide factor does not change resolution, it only stretches the axis so a slow ADC can read that fine resolution off a slow trace.</p>`
      },
      {
        title: 'Unambiguous Delay (Range) Window',
        tex: String.raw`$$\tau_{max}=N\,T_c=\frac{N}{f},\qquad R_{unamb}=\frac{c\,N}{2f}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The PN code is periodic with period $N$ chips. A delay is measured as a code-phase offset, but code phase only spans one period before repeating, so delays wrap. We find the largest delay that maps uniquely, and the corresponding one-way/two-way range.</p>
<p><b>Step 1.</b> One code period lasts $N T_c=N/f$ seconds. A channel echo delayed by $\tau$ aligns the incoming code with a replica shifted by $\tau$; but a delay of $\tau$ and a delay of $\tau+N T_c$ produce the same alignment because the code has repeated. Hence delays are only distinguishable modulo $N T_c$.</p>
<p><b>Step 2.</b> The unambiguous delay window is therefore one full period, $\tau_{max}=N T_c=N/f$. Converting delay to distance for a monostatic (two-way) ranging geometry uses $\tau=2R/c$, so the unambiguous range is $R_{unamb}=c\,\tau_{max}/2=cN/(2f)$; for a one-way propagation measurement the factor of 2 is dropped and the unambiguous distance is $cN/f$.</p>
<p><b>Result.</b> $\tau_{max}=N/f$ and $R_{unamb}=cN/(2f)$. There is a direct tension with resolution: raising $f$ sharpens resolution ($1/f$) but, for a fixed code length $N$, shrinks the unambiguous window ($N/f$). Designers set both by choosing the chip rate $f$ and the code length $N$ together — long codes buy a wide unambiguous window, fast chips buy fine resolution.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does a sliding correlator do?`, back: String.raw`It slides a local PN replica in code phase against the incoming spread signal and watches for the autocorrelation peak that appears only when the codes align within one chip.` },
      { front: String.raw`Why is DSSS acquisition a search rather than a single measurement?`, back: String.raw`The incoming code phase and Doppler are unknown; a correlation at a wrong phase returns near-zero noise, so you must test phase after phase until the peak appears.` },
      { front: String.raw`Write the PN autocorrelation triangle.`, back: String.raw`$R(\tau)=1-\lvert\tau\rvert/T_c$ for $\lvert\tau\rvert\le T_c$, and $\approx-1/N$ (near zero) beyond one chip. Peak is only $\pm1$ chip wide.` },
      { front: String.raw`Why step the replica by half a chip in serial search?`, back: String.raw`The peak's base is $\pm1$ chip; half-chip steps guarantee a test cell lands within $\pm\tfrac14$ chip of the peak so it is not stepped over.` },
      { front: String.raw`What are the four steps of a serial search per cell?`, back: String.raw`Set the replica phase, dwell (integrate for $T_d$), compare the output to threshold $\gamma$, and advance by a half-chip on a miss (or hand over on a hit).` },
      { front: String.raw`How many cells $q$ are in the uncertainty region?`, back: String.raw`$q=2N\,N_D$: $2N$ half-chip code-phase cells over an $N$-chip period times $N_D$ Doppler bins.` },
      { front: String.raw`Define $P_d$ and $P_{fa}$ in serial search.`, back: String.raw`$P_d$ = probability the true cell exceeds the threshold (detection); $P_{fa}$ = probability a wrong cell exceeds it by noise (false alarm), which costs a penalty of about $K$ dwells.` },
      { front: String.raw`How is a continuous slide produced?`, back: String.raw`Clock the local code at $f-\Delta f$ while the incoming code chips at $f$; the relative phase then creeps at $\Delta f$ chips per second.` },
      { front: String.raw`State the mean acquisition time of a serial search.`, back: String.raw`$E[T_{acq}]=\dfrac{(2-P_d)}{2P_d}(1+K P_{fa})\,q\,T_d$; it scales linearly with code length through $q$.` },
      { front: String.raw`What is the STDCC channel sounder?`, back: String.raw`Swept time-delay cross-correlation: transmit a PN at rate $f$, correlate at the receiver with a replica at $f-\Delta f$, sliding to map the channel impulse response onto a stretched output axis.` },
      { front: String.raw`Give the slide (time-dilation) factor and its meaning.`, back: String.raw`$k=f/\Delta f$; one chip of real delay ($1/f$) maps to $1/\Delta f$ of output time, so a slow ADC can capture a wideband response.` },
      { front: String.raw`What sets the delay resolution of the sounder?`, back: String.raw`One chip, $1/f$: echoes closer than a chip merge into one triangle. Resolution improves only by raising the chip rate $f$.` },
      { front: String.raw`What is the unambiguous delay window and why?`, back: String.raw`One code period, $N/f$: because the code repeats, delays wrap modulo $N T_c$, so delays beyond $N/f$ alias.` },
      { front: String.raw`Does the slide factor change delay resolution?`, back: String.raw`No. Resolution stays $1/f$; the slide only stretches the time axis so a slow ADC can read that fine resolution off a slow trace.` },
      { front: String.raw`Give the sliding-correlator processing gain in the compressed output.`, back: String.raw`About $10\log_{10}(k)$ dB, with $k=f/\Delta f$; it rejects out-of-band interference like DSSS despreading.` },
      { front: String.raw`Why is the sliding correlator slow for long codes?`, back: String.raw`Mean acquisition time is proportional to $q=2N N_D$, which grows linearly with code length $N$ — motivating parallel, matched-filter, and FFT acquisition.` }
    ],
    mcqs: [
      { q: String.raw`A sliding correlator acquires a DSSS signal by:`, options: [String.raw`transmitting a longer preamble`, String.raw`sliding a local PN replica in code phase and watching for the correlation peak`, String.raw`increasing the carrier power`, String.raw`filtering out the PN code`], answer: 1, explain: String.raw`It searches code phase by sliding the replica; the autocorrelation peak appears only at alignment.` },
      { q: String.raw`Off the peak (more than one chip from alignment), the PN autocorrelation is approximately:`, options: [String.raw`$+1$`, String.raw`$-1/N$ (near zero)`, String.raw`$+N$`, String.raw`undefined`], answer: 1, explain: String.raw`A long PN code has a near-zero off-peak floor of $-1/N$, which makes the peak stand out.` },
      { q: String.raw`Serial search typically advances the replica per miss by:`, options: [String.raw`one full code period`, String.raw`half a chip`, String.raw`one bit`, String.raw`ten chips`], answer: 1, explain: String.raw`Half-chip steps ensure a test cell falls within $\pm\tfrac14$ chip of the $\pm1$-chip-wide peak.` },
      { q: String.raw`The number of cells in the acquisition uncertainty region is:`, options: [String.raw`$N$`, String.raw`$2N \times N_D$`, String.raw`$N_D$ only`, String.raw`$N/2$`], answer: 1, explain: String.raw`$2N$ half-chip code-phase cells times $N_D$ Doppler bins gives $q=2N N_D$.` },
      { q: String.raw`In serial search, $P_{fa}$ (false alarm at a wrong cell) is costly because it:`, options: [String.raw`ends the search successfully`, String.raw`triggers a verification penalty of about $K$ dwells`, String.raw`increases $P_d$`, String.raw`has no effect`], answer: 1, explain: String.raw`A false alarm forces a verification stage costing $\sim K T_d$ before the search resumes.` },
      { q: String.raw`A continuous slide is created by clocking the local code at:`, options: [String.raw`the same rate $f$`, String.raw`$f-\Delta f$ (slightly slower)`, String.raw`$2f$`, String.raw`a random rate`], answer: 1, explain: String.raw`The offset $\Delta f$ makes the relative code phase creep at $\Delta f$ chips per second.` },
      { q: String.raw`In $E[T_{acq}]=\frac{(2-P_d)}{2P_d}(1+K P_{fa})q T_d$, the mean acquisition time scales with code length as:`, options: [String.raw`independent of $N$`, String.raw`linearly (through $q=2N N_D$)`, String.raw`as $\log N$`, String.raw`as $1/N$`], answer: 1, explain: String.raw`$q$ is proportional to $N$, so the search time grows linearly with code length.` },
      { q: String.raw`In the STDCC sounder, the receiver correlates the incoming signal against a replica clocked at:`, options: [String.raw`$f$ (identical rate)`, String.raw`$f-\Delta f$`, String.raw`$2f$ (twice the chip rate)`, String.raw`the carrier frequency`], answer: 1, explain: String.raw`The slightly slower replica ($f-\Delta f$) slides to map the channel impulse response onto a stretched axis.` },
      { q: String.raw`The slide (time-dilation) factor of a sliding-correlator sounder is:`, options: [String.raw`$\Delta f/f$`, String.raw`$f/\Delta f$`, String.raw`$f\cdot\Delta f$`, String.raw`$f-\Delta f$`], answer: 1, explain: String.raw`$k=f/\Delta f$ stretches one chip of real delay ($1/f$) to $1/\Delta f$ of output time.` },
      { q: String.raw`The delay resolution of the sliding-correlator sounder equals:`, options: [String.raw`one code period $N/f$`, String.raw`one chip $1/f$`, String.raw`the slide period $1/\Delta f$`, String.raw`the dwell time $T_d$`], answer: 1, explain: String.raw`Two echoes closer than one chip merge; resolution is $1/f$, set by the chip rate.` },
      { q: String.raw`The unambiguous delay window of the sounder is:`, options: [String.raw`one chip $1/f$`, String.raw`one code period $N/f$`, String.raw`the slide factor $k$`, String.raw`infinite`], answer: 1, explain: String.raw`The code repeats every $N$ chips, so delays wrap modulo $N/f$.` },
      { q: String.raw`Raising the chip rate $f$ while holding code length $N$ fixed:`, options: [String.raw`worsens resolution and widens the window`, String.raw`improves resolution ($1/f$) but shrinks the unambiguous window ($N/f$)`, String.raw`changes neither`, String.raw`only affects Doppler`], answer: 1, explain: String.raw`Resolution $1/f$ sharpens with higher $f$, but the window $N/f$ shrinks for fixed $N$.` },
      { q: String.raw`Compared with a PN matched filter, the sliding correlator is:`, options: [String.raw`faster but more complex`, String.raw`simpler (one correlator) but slower`, String.raw`identical in speed`, String.raw`unable to handle long codes`], answer: 1, explain: String.raw`One correlator handles any code length but must search serially, so it is slow; a matched filter tests all phases at once.` },
      { q: String.raw`Increasing the slide-rate offset $\Delta f$ in a continuous sliding correlator:`, options: [String.raw`sweeps faster but dwells less, lowering sensitivity`, String.raw`sweeps slower and improves sensitivity`, String.raw`has no effect on sweep time`, String.raw`increases the code length`], answer: 0, explain: String.raw`Larger $\Delta f$ speeds the sweep ($T_{slide}=N/\Delta f$) but spends less dwell near each alignment, reducing sensitivity.` }
    ],
    numericals: [
      {
        q: String.raw`A serial-search sliding correlator acquires an $N=1023$-chip code with a single Doppler bin ($N_D=1$), half-chip stepping, dwell $T_d=1$ ms, detection probability $P_d=0.9$, false-alarm probability $P_{fa}=0.01$, and penalty $K=100$. Find the mean acquisition time.`,
        solution: String.raw`<p><b>Formula.</b> $$E[T_{acq}]=\frac{(2-P_d)}{2P_d}\,(1+K P_{fa})\,q\,T_d,\qquad q=2N\,N_D.$$</p>
<p><b>Substitute.</b> $q=2\times1023\times1=2046$ cells. Prefactor $\dfrac{2-0.9}{2\times0.9}=\dfrac{1.1}{1.8}=0.611$. Penalty factor $1+100\times0.01=1+1=2$. Then $E[T_{acq}]=0.611\times2\times2046\times0.001$ s.</p>
<p><b>Compute.</b> $0.611\times2=1.222$; $1.222\times2046=2500$; $2500\times0.001=\mathbf{2.50}$ s.</p>
<p><b>Explanation.</b> About 2.5 seconds to acquire — dominated by the $q T_d\approx2.05$ s single-sweep time, inflated modestly by imperfect detection ($0.611$ vs the ideal $0.5$) and doubled by false-alarm penalties: each false alarm costs $K T_d=0.1$ s, and with $K P_{fa}=100\times0.01=1$ the expected penalty is one extra dwell per cell, exactly doubling the sweep time. This is why long codes or many Doppler bins make serial search painfully slow.</p>`
      },
      {
        q: String.raw`An STDCC channel sounder transmits at chip rate $f=200$ MHz and the receiver replica runs at $f-\Delta f$ with $\Delta f=25$ kHz. Find the slide (time-dilation) factor and the output time to which one chip of real delay is mapped.`,
        solution: String.raw`<p><b>Formula.</b> $$k=\frac{f}{\Delta f},\qquad \tau_{out}=k\cdot T_c=k\cdot\frac1f=\frac1{\Delta f}.$$</p>
<p><b>Substitute.</b> $k=\dfrac{200\times10^6}{25\times10^3}$; one chip is $T_c=1/f=1/(200\times10^6)=5$ ns; $\tau_{out}=1/\Delta f=1/(25\times10^3)$ s.</p>
<p><b>Compute.</b> $k=\dfrac{2\times10^8}{2.5\times10^4}=\mathbf{8000}$. And $\tau_{out}=k\times5\text{ ns}=8000\times5\text{ ns}=40{,}000\text{ ns}=\mathbf{40\ \mu s}$ (equivalently $1/25\text{ kHz}=40\ \mu$s).</p>
<p><b>Explanation.</b> A 5 ns chip of real delay is stretched to 40 microseconds of output — an 8000$\times$ dilation. That turns a 200 MHz-wide response into features slow enough for a modest ADC to sample, and yields a processing gain of $10\log_{10}(8000)\approx39$ dB. Time is traded for bandwidth.</p>`
      },
      {
        q: String.raw`For the sounder above ($f=200$ MHz), using a code of length $N=511$, find the delay resolution and the unambiguous one-way range window.`,
        solution: String.raw`<p><b>Formula.</b> $$\Delta\tau_{res}=\frac1f,\qquad \tau_{max}=\frac{N}{f},\qquad R_{unamb,\,1\text{-way}}=c\,\tau_{max}.$$</p>
<p><b>Substitute.</b> $\Delta\tau_{res}=1/(200\times10^6)$ s; $\tau_{max}=511/(200\times10^6)$ s; $c=3\times10^8$ m/s.</p>
<p><b>Compute.</b> $\Delta\tau_{res}=5\times10^{-9}$ s $=\mathbf{5\text{ ns}}$ (resolving paths $\ge c\times5\text{ ns}=1.5$ m apart). $\tau_{max}=2.555\times10^{-6}$ s $=2.555\ \mu$s; $R_{unamb}=3\times10^8\times2.555\times10^{-6}=\mathbf{766.5\ m}$.</p>
<p><b>Explanation.</b> The 5 ns chip resolves multipath echoes about 1.5 m apart, while the 511-chip period gives an unambiguous window of $\sim767$ m one-way — any echo delayed beyond that aliases. Note the tension: a faster chip sharpens the 1.5 m resolution but, for fixed $N$, would shrink this window.</p>`
      },
      {
        q: String.raw`A continuous sliding correlator uses $N=1023$ chips and a slide offset $\Delta f=200$ Hz. How long does one full code-phase sweep take, and how many sweeps occur per second?`,
        solution: String.raw`<p><b>Formula.</b> $$T_{slide}=\frac{N}{\Delta f},\qquad \text{sweeps/s}=\frac1{T_{slide}}=\frac{\Delta f}{N}.$$</p>
<p><b>Substitute.</b> $T_{slide}=\dfrac{1023}{200}$ s; sweeps/s $=\dfrac{200}{1023}$.</p>
<p><b>Compute.</b> $T_{slide}=5.115$ s $\approx\mathbf{5.12\ s}$ per sweep; sweeps/s $=0.1955\approx\mathbf{0.20}$ per second (about one sweep every 5 s).</p>
<p><b>Explanation.</b> At a 200 Hz clock offset the relative phase creeps at 200 chips/s, so covering all 1023 chips takes about 5.1 s — one channel-impulse-response snapshot every 5 s. Increasing $\Delta f$ would produce snapshots faster (good for time-varying channels) but with less dwell per alignment, reducing sensitivity.</p>`
      },
      {
        q: String.raw`Compare the mean acquisition time of the code in problem 1 ($q=2046$, $T_d=1$ ms, same $P_d,P_{fa},K$) when acquisition adds Doppler search over $N_D=11$ bins.`,
        solution: String.raw`<p><b>Formula.</b> $$E[T_{acq}]=\frac{(2-P_d)}{2P_d}(1+K P_{fa})\,q\,T_d,\qquad q=2N\,N_D.$$</p>
<p><b>Substitute.</b> Now $q=2\times1023\times11=22506$ cells. The prefactor $0.611$ and penalty factor $2$ are unchanged. $E[T_{acq}]=0.611\times2\times22506\times0.001$ s.</p>
<p><b>Compute.</b> $0.611\times2=1.222$; $1.222\times22506=27507$; $\times0.001=\mathbf{27.5}$ s.</p>
<p><b>Explanation.</b> Adding 11 Doppler bins multiplies the cell count (and the time) by 11, from 2.5 s to 27.5 s. Doppler uncertainty is as expensive as code length in a serial search — both enter linearly through $q$ — which is precisely why FFT-based acquisition, which searches all Doppler bins in one transform, is attractive when the Doppler space is large.</p>`
      },
      {
        q: String.raw`A sliding-correlator sounder must resolve two echoes separated by $10$ ns and cover an unambiguous one-way range of at least $300$ m. Find the minimum chip rate $f$ and a suitable code length $N$.`,
        solution: String.raw`<p><b>Formula.</b> $$\Delta\tau_{res}=\frac1f\le10\text{ ns}\ \Rightarrow\ f\ge\frac1{10\text{ ns}};\qquad \tau_{max}=\frac{N}{f}\ge\frac{R}{c}\ \Rightarrow\ N\ge\frac{f R}{c}.$$</p>
<p><b>Substitute.</b> $f\ge\dfrac1{10\times10^{-9}}=10^8$ Hz $=100$ MHz. For the range, $\tau_{max}\ge300/(3\times10^8)=1.0\ \mu$s, so $N\ge f\times1.0\ \mu\text{s}=10^8\times10^{-6}=100$.</p>
<p><b>Compute.</b> Minimum chip rate $f=\mathbf{100\text{ MHz}}$ (10 ns chip). Minimum $N=100$; choose a standard m-sequence length $\ge100$, e.g. $\mathbf{N=127}$ (a 7-stage m-sequence), giving $\tau_{max}=127/10^8=1.27\ \mu$s $\to$ range $381$ m, comfortably above $300$ m.</p>
<p><b>Explanation.</b> The 10 ns resolution fixes $f\ge100$ MHz; the 300 m window then demands $N\ge100$, met by the next convenient m-sequence length $127$. This is the everyday design flow: chip rate sets resolution, then code length is chosen to buy enough unambiguous range without wasting sweep time.</p>`
      }
    ],
    realWorld: String.raw`<p>The sliding correlator is the workhorse behind two very different but everyday technologies. As a serial searcher it is the textbook acquisition front end of low-cost DSSS links — simple telemetry, some Zigbee-class radios, and legacy CDMA handsets that could tolerate a slower first lock — because it needs only a single correlator and one PN generator regardless of how long the spreading code is. Where fast lock matters, such as a GPS receiver acquiring a 1023-chip C/A code across a wide Doppler uncertainty, designers move to parallel or FFT acquisition, but they still reason about performance relative to the serial search's mean acquisition time; the sliding correlator remains the conceptual yardstick.</p>
<p>As a swept time-delay cross-correlation (STDCC) instrument, the sliding correlator is the classic wideband channel sounder used to measure multipath in everything from indoor and urban propagation studies to modern millimeter-wave and sub-terahertz 5G/6G research. By transmitting a fast PN code and correlating against a replica clocked a few kilohertz slower, a research group can capture a several-hundred-megahertz-wide impulse response with an inexpensive, slow ADC — the slide factor $k=f/\Delta f$ (often several thousand) does the bandwidth compression, delivering tens of dB of processing gain and rejecting interference along the way. The same principle underlies pseudo-noise ranging and radar, where the code period sets the unambiguous range and the chip rate sets the range resolution. Understanding the slide factor, resolution, and unambiguous window lets an engineer size $f$, $N$, and $\Delta f$ for a target resolution, range, and snapshot rate.</p>`,
    related: ['dsss-acquisition', 'dsss', 'pn-codes', 'delay-lock-tracking']
  }
);
