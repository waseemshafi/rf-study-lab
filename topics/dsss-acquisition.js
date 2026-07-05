// dsss-acquisition.js — "DSSS Acquisition" topic (Spread Spectrum & Coding).
// Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
// All text in String.raw; no literal backticks, no dollar-then-brace sequence.
CONTENT.topics.push(
  {
    id: 'dsss-acquisition',
    title: 'DSSS Acquisition',
    category: 'Spread Spectrum & Coding',
    tags: ['acquisition', 'code phase', 'Doppler', 'serial search', 'sliding correlator', 'FFT search', 'non-coherent', 'Pd', 'Pfa', 'mean acquisition time'],
    summary: String.raw`Acquisition is the coarse two-dimensional search that aligns the local PN replica and carrier frequency with the incoming DSSS signal to within about half a chip, so that fine tracking can lock — traded off through dwell time, detection probability $P_d$, false-alarm probability $P_{fa}$, and mean acquisition time.`,
    prerequisites: ['dsss', 'pn-codes', 'correlation'],
    intro: String.raw`<p><strong>Why acquisition is the hardest first step.</strong> Despreading a DSSS signal only works when the receiver's local PN code is time-aligned with the incoming code to a small fraction of a chip. But when a receiver first switches on, it has <em>no idea</em> where in the code period the transmitter currently is, and it usually does not know the exact carrier frequency either (the transmitter is moving, so there is a Doppler shift). The correlation peak that despreading depends on is only about one chip wide — miss it by half a chip and the output collapses into noise. So before any tracking loop can help, the receiver must first <em>find</em> that peak in a blind, two-dimensional search over code phase and frequency. That search is acquisition, and it is why a GPS receiver takes seconds to get a first fix rather than milliseconds.</p>
<p>Acquisition is the <strong>coarse alignment stage</strong> of DSSS synchronization. Its job is to bring the locally generated PN replica, and the local carrier/Doppler estimate, into alignment with the received signal to within about $\pm\tfrac12$ chip and within one frequency bin — close enough that the fine <em>tracking</em> loops (a delay-lock loop for code, a Costas or FLL loop for carrier) can pull in and hold lock. Because the carrier phase is unknown before lock, acquisition detection is <strong>non-coherent</strong>: it forms an envelope $Z=I^2+Q^2$ and compares it to a threshold.</p>
<p>This topic develops the search space (code phase $\times$ Doppler), the serial sliding-correlator and the fast FFT-based parallel search, the detection statistics ($P_d$, $P_{fa}$, the Neyman–Pearson threshold), and the master result — the <strong>mean acquisition time</strong> — plus the fundamental sensitivity-versus-speed trade set by the dwell time.</p>`,
    sections: [
      {
        h: 'The two-dimensional uncertainty region',
        html: String.raw`<p><strong>Why two dimensions?</strong> The receiver is uncertain about two independent quantities. First, the <em>code phase</em>: where in the $N$-chip PN sequence the incoming signal currently sits — anywhere from $0$ to $N-1$ chips. Second, the <em>carrier frequency</em>: the true frequency is offset from nominal by an unknown Doppler shift. Both must be right for the correlation to peak, so the search space is a grid.</p>
<p>Along the <strong>code-phase axis</strong>, the autocorrelation peak is only about one chip wide, so stepping in whole chips risks straddling and missing the peak. Practice is to search in <em>half-chip</em> steps, giving $2N$ code cells for a length-$N$ code. Along the <strong>frequency axis</strong>, the usable frequency error is limited by the coherent integration: over a dwell time $T_d$ a frequency offset $\Delta f$ rotates the integrand, and the correlation collapses when $\Delta f \approx 1/T_d$. So the Doppler bin width is roughly $1/T_d$, and the number of Doppler bins is the Doppler span divided by that width.</p>
<p>The total number of cells to test is</p>
<p>$$q = (2N)\times N_{\text{dop}},\qquad N_{\text{dop}}=\left\lceil\frac{f_{\text{span}}}{1/T_d}\right\rceil.$$</p>
<div class="callout"><strong>Intuition:</strong> think of a dark room with a grid of light switches; exactly one lights the lamp. Acquisition is flipping switches (cells) until the lamp (correlation peak) comes on. Half-chip spacing guarantees no switch is skipped over.</div>`
      },
      {
        h: 'Serial search: the sliding correlator',
        html: String.raw`<p>The simplest acquisition engine tests one cell at a time. The receiver sets its local code to a trial phase and its local oscillator to a trial Doppler bin, then <strong>integrates (dwells)</strong> the despread signal for a time $T_d$ to build up correlation energy. It compares the correlator output to a threshold $V_t$:</p>
<ul>
<li>If the output <strong>exceeds</strong> $V_t$, the cell is declared a hit (peak found) and handed to verification/tracking.</li>
<li>If it is <strong>below</strong> $V_t$, the receiver advances the local code by a half chip (or, at the end of the code, steps to the next Doppler bin) and dwells again.</li>
</ul>
<p>The name "sliding correlator" comes from the local replica sliding in half-chip steps relative to the incoming code until they line up. The engine sweeps all $2N$ code phases for one Doppler bin, then the next bin, until the peak is found. Serial search is cheap in hardware (one correlator) but slow: worst case it visits all $q$ cells, each costing $T_d$.</p>
<div class="callout tip"><strong>Tip:</strong> a longer dwell $T_d$ raises the correlation peak relative to noise (better sensitivity) but slows every one of the $q$ cells — the central trade of acquisition. Halving the false-alarm rate is cheap; doubling sensitivity by doubling $T_d$ doubles the search time.</div>`
      },
      {
        h: 'Non-coherent detection: why $Z=I^2+Q^2$',
        html: String.raw`<p>Before the carrier is locked, the receiver does not know the incoming carrier phase, and a residual frequency error keeps rotating it. If it despread with a single (say, in-phase) arm, an unknown phase $\theta$ would scale the output by $\cos\theta$ — which can be zero even when perfectly code-aligned. Coherent detection is therefore <em>impossible</em> before carrier lock.</p>
<p>The fix is to despread on <strong>two quadrature arms</strong>, forming an in-phase accumulation $I$ and a quadrature accumulation $Q$ over the dwell, then take the <strong>square-law envelope</strong></p>
<p>$$Z = I^2 + Q^2.$$</p>
<p>Because $I^2+Q^2$ removes the phase (it is the squared magnitude of the complex correlation), $Z$ is large whenever the codes align regardless of the unknown carrier phase, and small otherwise. The decision is $Z\gtrless V_t^2$ (equivalently compare $\sqrt Z$ to $V_t$). The price of discarding phase is a small <strong>squaring (non-coherent) loss</strong> of order a decibel relative to an ideal coherent detector — the unavoidable cost of not knowing the phase.</p>`
      },
      {
        h: 'Detection statistics: $P_d$ and $P_{fa}$',
        html: String.raw`<p>At the correlator output, model the decision variable (here the envelope amplitude) as a signal amplitude $A$ (the correlation-peak height, present only in the correct cell) plus Gaussian noise of standard deviation $\sigma$. Two probabilities govern performance:</p>
<ul>
<li><strong>False alarm</strong> $P_{fa}$: a wrong (noise-only) cell exceeds the threshold. With mean $0$ and std $\sigma$, $P_{fa}=Q\!\left(\dfrac{V_t}{\sigma}\right).$</li>
<li><strong>Detection</strong> $P_d$: the correct cell (mean $A$) exceeds the threshold, $P_d=Q\!\left(\dfrac{V_t-A}{\sigma}\right).$</li>
</ul>
<p>The threshold $V_t$ is set by the <strong>Neyman–Pearson</strong> philosophy: fix an acceptable false-alarm rate and choose the smallest $V_t$ meeting it, which then maximizes $P_d$. Raising $V_t$ lowers $P_{fa}$ but also lowers $P_d$; the only way to improve <em>both</em> is to increase $A/\sigma$ — and $A$ grows with a longer coherent dwell (more accumulated signal), which is exactly why longer integration means better sensitivity.</p>
<table class="data">
<tr><th>Quantity</th><th>Meaning</th><th>Form</th></tr>
<tr><td>$P_{fa}$</td><td>noise cell crosses threshold</td><td>$Q(V_t/\sigma)$</td></tr>
<tr><td>$P_d$</td><td>correct cell crosses threshold</td><td>$Q((V_t-A)/\sigma)$</td></tr>
<tr><td>$A/\sigma$</td><td>peak SNR (grows with dwell)</td><td>set by $T_d$</td></tr>
</table>`
      },
      {
        h: 'Mean acquisition time (single-dwell serial search)',
        html: String.raw`<p>The headline performance figure is the <strong>mean acquisition time</strong> $E[T_{acq}]$ — how long, on average, serial search takes to find and confirm the correct cell. For a single-dwell serial search over $q$ equally likely cells, the standard result is</p>
<p>$$E[T_{acq}]=\frac{(2-P_d)(1+K\,P_{fa})}{2P_d}\;q\,T_d.$$</p>
<ul>
<li>$q$ — number of cells in the search ($q=2N\times N_{\text{dop}}$).</li>
<li>$T_d$ — dwell (integration) time spent testing each cell.</li>
<li>$P_d$ — probability of detecting the correct cell on a single dwell.</li>
<li>$P_{fa}$ — probability a wrong cell falsely crosses the threshold.</li>
<li>$K$ — the false-alarm penalty factor: each false alarm wastes about $K\,T_d$ extra time in verification/recovery before the search resumes.</li>
</ul>
<p>The factor $(2-P_d)/(2P_d)$ captures the average number of full sweeps needed given an imperfect $P_d$ (a missed peak forces another lap of the code ring); the factor $(1+K P_{fa})$ inflates every cell's cost to account for time wasted chasing false alarms. As $P_d\to 1$ and $P_{fa}\to 0$, this collapses toward $E[T_{acq}]\approx \tfrac12 qT_d$ — on average you find the peak halfway through the sweep.</p>
<div class="callout"><strong>Worst case</strong> (full search, every cell dwelt once) is simply $q\,T_d$. The mean is smaller because the peak is, on average, encountered partway through.</div>`
      },
      {
        h: 'Parallel, matched-filter, and FFT-based search',
        html: String.raw`<p>Serial search is slow because it tests cells one by one. Three faster architectures trade hardware for speed:</p>
<ul>
<li><strong>Parallel search:</strong> replicate the correlator so many code phases (or Doppler bins) are tested simultaneously. $M$ parallel correlators cut the search time by about $M$ at $M\times$ the hardware.</li>
<li><strong>Matched-filter acquisition:</strong> a filter matched to the PN code produces the full correlation as the samples stream through, effectively evaluating all code phases for one Doppler bin in one pass.</li>
<li><strong>FFT-based parallel code-phase search (GPS):</strong> correlating the incoming samples against the code at <em>every</em> code phase is a circular correlation, which the FFT computes in one shot. Take the FFT of the received block and of the code, multiply (one conjugated), and inverse-FFT: the output is the correlation for <em>all $N$ code phases at once</em>. This replaces $N$ serial correlations with a handful of transforms, an enormous speed-up, and is the standard in modern GPS acquisition.</li>
</ul>
<p>These parallel methods attack the $2N$ code-phase dimension; the Doppler dimension is typically still swept in bins (or handled with additional FFTs across the dwell). The FFT approach is why "assisted" and software receivers acquire so fast.</p>`
      },
      {
        h: 'Two-dwell verification and threshold setting',
        html: String.raw`<p>A single-dwell detector faces a dilemma: a low threshold catches the peak (high $P_d$) but lets many noise cells through (high $P_{fa}$), while a high threshold does the reverse. <strong>Two-dwell (verification) acquisition</strong> breaks the dilemma by using a fast, sensitive first dwell to <em>flag candidates</em>, then a longer second dwell to <em>confirm</em> them before declaring lock. A true peak passes both; a noise spike rarely passes twice, so the effective false-alarm probability becomes roughly the product $P_{fa,1}P_{fa,2}$, dramatically reducing wasted verification time while keeping sensitivity high.</p>
<p><strong>Setting the threshold</strong> starts from a target $P_{fa}$. Inverting $P_{fa}=Q(V_t/\sigma)$ gives</p>
<p>$$V_t=\sigma\,Q^{-1}(P_{fa}),$$</p>
<p>so the threshold is a fixed number of noise standard deviations. This is the Neyman–Pearson recipe: pin the false-alarm rate, then the physics ($A/\sigma$, i.e. the dwell length) determines the resulting $P_d$.</p>`
      },
      {
        h: 'The sensitivity-versus-search-time trade',
        html: String.raw`<p>Every acquisition design lives on one trade. Coherent integration accumulates the signal amplitude linearly while noise adds in RMS, so the peak SNR $A/\sigma$ grows with the dwell — <em>longer $T_d$ raises $P_d$ and lets you tolerate weaker signals</em>. A longer dwell also narrows the usable Doppler bin (width $\approx 1/T_d$), so weak-signal acquisition needs <em>more</em> Doppler bins, multiplying $q$. And of course every cell now costs more time. So:</p>
<ul>
<li>Longer dwell $\Rightarrow$ higher sensitivity and finer Doppler resolution, but larger $q$ and slower per-cell search $\Rightarrow$ longer $E[T_{acq}]$.</li>
<li>Beyond the coherence time, you cannot integrate coherently (residual frequency/phase decorrelates); further gain comes from <strong>non-coherent combining</strong> of several coherent dwells, which is less efficient (non-coherent combining loss).</li>
</ul>
<p>This is why fast, strong-signal acquisition uses short dwells and few Doppler bins, while cold-start or weak-signal (indoor GPS) acquisition accepts long searches, many Doppler bins, and heavy parallelism (FFT) to keep $E[T_{acq}]$ bounded.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>Acquisition is the blind coarse search that makes despreading possible. You should now be able to say:</p>
<ul>
<li><strong>The search space:</strong> a 2-D grid of code phase (searched in half-chip steps, $2N$ cells) crossed with Doppler bins (width $\approx 1/T_d$), giving $q=2N\times N_{\text{dop}}$ cells.</li>
<li><strong>The engine:</strong> serial search slides one correlator through the cells, dwelling $T_d$ each and comparing to a threshold $V_t$; parallel, matched-filter, and FFT circular-correlation methods evaluate many code phases at once.</li>
<li><strong>Why non-coherent:</strong> the carrier phase is unknown before lock, so the detector forms $Z=I^2+Q^2$ to remove phase, paying a small squaring loss.</li>
<li><strong>The statistics:</strong> $P_{fa}=Q(V_t/\sigma)$ and $P_d=Q((V_t-A)/\sigma)$; the Neyman–Pearson threshold $V_t=\sigma Q^{-1}(P_{fa})$ fixes the false-alarm rate, and only larger $A/\sigma$ (longer dwell) improves both.</li>
<li><strong>The master metric:</strong> $E[T_{acq}]=\dfrac{(2-P_d)(1+KP_{fa})}{2P_d}qT_d$, with worst case $qT_d$; verification (two-dwell) slashes the false-alarm cost.</li>
<li><strong>The trade:</strong> longer dwell buys sensitivity and finer Doppler bins but enlarges $q$ and slows the search — sensitivity versus speed is the fundamental tension.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Acquisition is coarse alignment: bring the local PN code and Doppler to within about $\pm\tfrac12$ chip and one frequency bin before tracking can lock.`,
      String.raw`The search space is 2-D: code phase ($2N$ cells in half-chip steps) crossed with Doppler bins.`,
      String.raw`Total cells $q=(2N)\times N_{\text{dop}}$, where $N_{\text{dop}}$ is the Doppler span divided by the bin width.`,
      String.raw`Doppler bin width $\approx 1/T_d$: a longer dwell gives finer frequency resolution but more bins.`,
      String.raw`Serial search (sliding correlator) tests one cell at a time, dwelling $T_d$ and comparing to a threshold $V_t$.`,
      String.raw`Detection is non-coherent before carrier lock: form $Z=I^2+Q^2$ to remove the unknown carrier phase.`,
      String.raw`False-alarm probability $P_{fa}=Q(V_t/\sigma)$; detection probability $P_d=Q((V_t-A)/\sigma)$.`,
      String.raw`$A$ is the correlation-peak amplitude and grows with dwell time; larger $A/\sigma$ improves both $P_d$ and $P_{fa}$.`,
      String.raw`Neyman–Pearson threshold: fix $P_{fa}$, then $V_t=\sigma\,Q^{-1}(P_{fa})$ maximizes $P_d$.`,
      String.raw`Mean acquisition time $E[T_{acq}]=\dfrac{(2-P_d)(1+KP_{fa})}{2P_d}\,qT_d$; $K$ is the false-alarm penalty factor.`,
      String.raw`Worst-case (full search) time is $q\,T_d$; the mean is smaller because the peak is met partway through.`,
      String.raw`FFT-based parallel code-phase search (GPS) computes correlation at all $N$ code phases at once via circular correlation.`,
      String.raw`Two-dwell verification multiplies false-alarm probabilities ($\approx P_{fa,1}P_{fa,2}$), cutting wasted recovery time.`,
      String.raw`Fundamental trade: longer dwell raises sensitivity and Doppler resolution but enlarges $q$ and slows the search.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 270" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-acquisition-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="270" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Acquisition search grid: code phase x Doppler</text>
<line x1="70" y1="235" x2="510" y2="235" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-acquisition-a1)"/>
<line x1="70" y1="235" x2="70" y2="45" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-acquisition-a1)"/>
<text x="300" y="255" fill="#9aa7b5" font-size="11">code phase (half-chip cells, 0 .. 2N-1)</text>
<text x="16" y="45" fill="#9aa7b5" font-size="11">Doppler</text>
<text x="16" y="58" fill="#9aa7b5" font-size="11">bins</text>
<!-- grid of cells -->
<g stroke="#2c3947" stroke-width="1">
<rect x="90" y="70" width="36" height="30" fill="#1c232e"/><rect x="126" y="70" width="36" height="30" fill="#1c232e"/><rect x="162" y="70" width="36" height="30" fill="#1c232e"/><rect x="198" y="70" width="36" height="30" fill="#1c232e"/><rect x="234" y="70" width="36" height="30" fill="#1c232e"/><rect x="270" y="70" width="36" height="30" fill="#1c232e"/><rect x="306" y="70" width="36" height="30" fill="#1c232e"/><rect x="342" y="70" width="36" height="30" fill="#1c232e"/><rect x="378" y="70" width="36" height="30" fill="#1c232e"/>
<rect x="90" y="100" width="36" height="30" fill="#1c232e"/><rect x="126" y="100" width="36" height="30" fill="#1c232e"/><rect x="162" y="100" width="36" height="30" fill="#1c232e"/><rect x="198" y="100" width="36" height="30" fill="#1c232e"/><rect x="234" y="100" width="36" height="30" fill="#1c232e"/><rect x="270" y="100" width="36" height="30" fill="#63e6be"/><rect x="306" y="100" width="36" height="30" fill="#1c232e"/><rect x="342" y="100" width="36" height="30" fill="#1c232e"/><rect x="378" y="100" width="36" height="30" fill="#1c232e"/>
<rect x="90" y="130" width="36" height="30" fill="#1c232e"/><rect x="126" y="130" width="36" height="30" fill="#1c232e"/><rect x="162" y="130" width="36" height="30" fill="#1c232e"/><rect x="198" y="130" width="36" height="30" fill="#1c232e"/><rect x="234" y="130" width="36" height="30" fill="#1c232e"/><rect x="270" y="130" width="36" height="30" fill="#1c232e"/><rect x="306" y="130" width="36" height="30" fill="#1c232e"/><rect x="342" y="130" width="36" height="30" fill="#1c232e"/><rect x="378" y="130" width="36" height="30" fill="#1c232e"/>
</g>
<text x="284" y="119" fill="#1c232e" font-size="13" font-weight="bold">*</text>
<text x="288" y="119" fill="#1c232e" font-size="1">.</text>
<circle cx="288" cy="115" r="9" fill="none" stroke="#ff6b6b" stroke-width="2"/>
<text x="404" y="112" fill="#63e6be" font-size="10">correct cell</text>
<text x="404" y="126" fill="#9aa7b5" font-size="9">(peak here)</text>
<!-- serial scan arrow -->
<line x1="90" y1="180" x2="396" y2="180" stroke="#ffa94d" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#dsss-acquisition-a1)"/>
<text x="150" y="200" fill="#ffa94d" font-size="10">serial search sweeps cells one by one, dwell $T_d$ each</text>
</svg>`,
        caption: 'The acquisition uncertainty grid: code phase (2N half-chip cells) crossed with Doppler bins. Exactly one cell holds the correlation peak; serial search dwells on each cell in turn until it is found.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-acquisition-a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Non-coherent serial correlator: form $Z=I^2+Q^2$, compare to $V_t$</text>
<line x1="12" y1="120" x2="52" y2="120" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#dsss-acquisition-a2)"/>
<text x="10" y="112" fill="#9aa7b5" font-size="10">$r(t)$</text>
<!-- I arm -->
<circle cx="80" cy="80" r="13" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/><text x="74" y="85" fill="#e6edf3" font-size="12">$\times$</text>
<line x1="52" y1="120" x2="52" y2="80" stroke="#9aa7b5" stroke-width="1.2"/><line x1="52" y1="80" x2="66" y2="80" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-acquisition-a2)"/>
<text x="46" y="58" fill="#63e6be" font-size="9">code x cos</text>
<line x1="80" y1="102" x2="80" y2="93" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-acquisition-a2)"/>
<rect x="60" y="102" width="40" height="18" fill="#1c232e" stroke="#63e6be" stroke-width="1.1"/><text x="64" y="115" fill="#e6edf3" font-size="8">$c(t)$</text>
<line x1="93" y1="80" x2="140" y2="80" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#dsss-acquisition-a2)"/>
<rect x="140" y="62" width="60" height="34" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/><text x="150" y="83" fill="#e6edf3" font-size="10">$\int_0^{T_d}$</text>
<line x1="200" y1="79" x2="240" y2="79" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#dsss-acquisition-a2)"/>
<text x="205" y="72" fill="#9aa7b5" font-size="9">$I$</text>
<rect x="240" y="64" width="40" height="30" fill="#1c232e" stroke="#b197fc" stroke-width="1.3"/><text x="248" y="83" fill="#e6edf3" font-size="11">$(\cdot)^2$</text>
<!-- Q arm -->
<circle cx="80" cy="170" r="13" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/><text x="74" y="175" fill="#e6edf3" font-size="12">$\times$</text>
<line x1="52" y1="120" x2="52" y2="170" stroke="#9aa7b5" stroke-width="1.2"/><line x1="52" y1="170" x2="66" y2="170" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-acquisition-a2)"/>
<text x="42" y="200" fill="#63e6be" font-size="9">code x (-sin)</text>
<line x1="93" y1="170" x2="140" y2="170" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#dsss-acquisition-a2)"/>
<rect x="140" y="153" width="60" height="34" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/><text x="150" y="174" fill="#e6edf3" font-size="10">$\int_0^{T_d}$</text>
<line x1="200" y1="170" x2="240" y2="170" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#dsss-acquisition-a2)"/>
<text x="205" y="163" fill="#9aa7b5" font-size="9">$Q$</text>
<rect x="240" y="155" width="40" height="30" fill="#1c232e" stroke="#b197fc" stroke-width="1.3"/><text x="248" y="174" fill="#e6edf3" font-size="11">$(\cdot)^2$</text>
<!-- sum -->
<circle cx="330" cy="124" r="16" fill="#1c232e" stroke="#63e6be" stroke-width="1.6"/><text x="323" y="129" fill="#e6edf3" font-size="14">$+$</text>
<line x1="280" y1="79" x2="314" y2="115" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#dsss-acquisition-a2)"/>
<line x1="280" y1="170" x2="314" y2="133" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#dsss-acquisition-a2)"/>
<line x1="346" y1="124" x2="390" y2="124" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#dsss-acquisition-a2)"/>
<text x="352" y="116" fill="#63e6be" font-size="10">$Z$</text>
<rect x="390" y="104" width="80" height="40" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.6"/><text x="400" y="122" fill="#e6edf3" font-size="10">compare</text><text x="400" y="136" fill="#e6edf3" font-size="10">$Z \gtrless V_t^2$</text>
<line x1="470" y1="124" x2="510" y2="124" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#dsss-acquisition-a2)"/>
<text x="478" y="116" fill="#b197fc" font-size="9">hit / step</text>
</svg>`,
        caption: 'Non-coherent acquisition: the received signal is despread on I and Q arms, each integrated over the dwell, squared and summed to Z = I^2 + Q^2, which is compared to a threshold. Squaring removes the unknown carrier phase.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="250" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Threshold, $P_d$ and $P_{fa}$: noise vs signal-plus-noise</text>
<line x1="40" y1="190" x2="515" y2="190" stroke="#9aa7b5" stroke-width="1.2"/>
<text x="470" y="205" fill="#9aa7b5" font-size="10">envelope</text>
<line x1="300" y1="45" x2="300" y2="200" stroke="#b197fc" stroke-width="1.6" stroke-dasharray="5 4"/>
<text x="278" y="40" fill="#b197fc" font-size="11">threshold $V_t$</text>
<!-- noise-only pdf centered left (mean 0-ish) -->
<path d="M60,190 C110,190 130,70 165,70 C200,70 220,190 270,190" fill="none" stroke="#4dabf7" stroke-width="2"/>
<text x="95" y="100" fill="#4dabf7" font-size="10">noise cell</text>
<!-- signal+noise pdf centered right (mean A) -->
<path d="M280,190 C330,190 350,65 390,65 C430,65 450,190 500,190" fill="none" stroke="#ffa94d" stroke-width="2"/>
<text x="400" y="100" fill="#ffa94d" font-size="10">correct cell (mean $A$)</text>
<!-- Pfa tail: noise pdf beyond Vt -->
<path d="M300,190 C315,188 322,150 270,190 Z" fill="#ff6b6b" opacity="0.55"/>
<text x="235" y="220" fill="#ff6b6b" font-size="10">$P_{fa}=Q(V_t/\sigma)$</text>
<!-- Pd tail: signal pdf beyond Vt -->
<path d="M300,190 C340,185 370,70 390,65 C420,120 440,190 500,190 Z" fill="#63e6be" opacity="0.28"/>
<text x="410" y="220" fill="#63e6be" font-size="10">$P_d=Q((V_t-A)/\sigma)$</text>
<line x1="165" y1="192" x2="390" y2="192" stroke="#9aa7b5" stroke-width="1" stroke-dasharray="3 2"/>
<text x="250" y="182" fill="#9aa7b5" font-size="9">peak amplitude $A$</text>
</svg>`,
        caption: 'The detection picture: a noise-only cell (blue, mean 0) and the correct cell (orange, mean A) both spread by sigma. The threshold V_t sets the false-alarm tail (red, P_fa) and the detection area (green, P_d); a larger A/sigma from longer dwell separates them.'
      }
    ],
    equations: [
      {
        title: 'Number of search cells',
        tex: String.raw`$$q=(2N)\times N_{\text{dop}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The receiver is uncertain in two independent dimensions — code phase and carrier frequency (Doppler) — so the total number of hypotheses to test is the product of the counts along each axis.</p>
<p><b>Step 1.</b> Along the code-phase axis the code is $N$ chips long. Because the autocorrelation peak is only about one chip wide, stepping in whole chips could straddle and miss it, so the search uses half-chip steps. Half-chip resolution over $N$ chips gives $N/(1/2)=2N$ code cells.</p>
<p><b>Step 2.</b> Along the frequency axis the Doppler uncertainty spans $f_{\text{span}}$ and is divided into bins of width $\Delta f_{\text{bin}}$, giving $N_{\text{dop}}=\lceil f_{\text{span}}/\Delta f_{\text{bin}}\rceil$ bins. Each bin is a distinct frequency hypothesis.</p>
<p><b>Result.</b> Since every code cell must be tested at every Doppler bin, the grid has $q=(2N)\times N_{\text{dop}}$ cells. This $q$ is the multiplier in the acquisition-time formula, so both finer code stepping and more Doppler bins directly inflate the search.</p>`
      },
      {
        title: 'Doppler bin width from dwell',
        tex: String.raw`$$\Delta f_{\text{bin}}\approx\frac{1}{T_d}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Over a coherent dwell of length $T_d$ the correlator integrates the despread signal. A residual carrier frequency error $\Delta f$ makes the integrand rotate as $e^{j2\pi\Delta f\,t}$ across the dwell.</p>
<p><b>Step 1.</b> The coherent sum over $[0,T_d]$ of that rotating phasor is proportional to $\dfrac{\sin(\pi\Delta f\,T_d)}{\pi\Delta f\,T_d}$, a sinc in $\Delta f$. The correlation is full when $\Delta f=0$ and falls as the phase winds up.</p>
<p><b>Step 2.</b> The sinc reaches its first null at $\Delta f\,T_d=1$, i.e. $\Delta f=1/T_d$; by roughly half that offset the loss is already a few dB. So a single frequency bin can only tolerate an error of order $1/T_d$ before the peak collapses.</p>
<p><b>Result.</b> To keep the loss bounded, adjacent Doppler bins must be spaced by about $\Delta f_{\text{bin}}\approx 1/T_d$. Longer dwells give finer bins (better frequency resolution) but, for a fixed Doppler span, more bins and hence a larger $q$.</p>`
      },
      {
        title: 'False-alarm probability',
        tex: String.raw`$$P_{fa}=Q\!\left(\frac{V_t}{\sigma}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Consider a wrong (noise-only) cell. Under the Gaussian approximation its decision variable has zero mean and standard deviation $\sigma$, the noise level at the correlator output.</p>
<p><b>Step 1.</b> A false alarm is declared when this noise-only variable $X$ exceeds the threshold $V_t$: the event is $X>V_t$.</p>
<p><b>Step 2.</b> For a zero-mean Gaussian, $\Pr\{X>V_t\}=\Pr\{X/\sigma>V_t/\sigma\}$. Standardizing by dividing by $\sigma$ turns the tail probability into the standard-normal tail function $Q(\cdot)$.</p>
<p><b>Result.</b> $P_{fa}=Q(V_t/\sigma)$. The false-alarm rate depends only on how many noise standard deviations the threshold sits at; raising $V_t$ lowers $P_{fa}$ monotonically. Inverting gives the design rule $V_t=\sigma\,Q^{-1}(P_{fa})$.</p>`
      },
      {
        title: 'Detection probability',
        tex: String.raw`$$P_d=Q\!\left(\frac{V_t-A}{\sigma}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> In the correct cell the codes align, so the decision variable has a nonzero mean $A$ (the correlation-peak amplitude) plus the same Gaussian noise of std $\sigma$: $X=A+n$.</p>
<p><b>Step 1.</b> Detection occurs when $X>V_t$, i.e. $A+n>V_t$, which rearranges to $n>V_t-A$.</p>
<p><b>Step 2.</b> Since $n$ is zero-mean Gaussian with std $\sigma$, $\Pr\{n>V_t-A\}=Q\!\big((V_t-A)/\sigma\big)$ by standardizing exactly as for the false-alarm case.</p>
<p><b>Result.</b> $P_d=Q((V_t-A)/\sigma)$. Because $Q$ decreases with its argument, a larger peak $A$ (from a longer dwell) shrinks the argument and raises $P_d$. Note that with $A>0$ the detection argument is smaller than the false-alarm argument $V_t/\sigma$, so always $P_d>P_{fa}$ — the whole point of having signal present.</p>`
      },
      {
        title: 'Neyman–Pearson threshold',
        tex: String.raw`$$V_t=\sigma\,Q^{-1}(P_{fa})$$`,
        derivation: String.raw`<p><b>Where we start.</b> The Neyman–Pearson approach fixes a tolerable false-alarm probability $P_{fa}$ and then picks the threshold that meets it (which simultaneously maximizes $P_d$ for that $P_{fa}$).</p>
<p><b>Step 1.</b> Begin from the false-alarm relation $P_{fa}=Q(V_t/\sigma)$, which ties the threshold to the target false-alarm rate.</p>
<p><b>Step 2.</b> Apply the inverse $Q$-function to both sides: $Q^{-1}(P_{fa})=V_t/\sigma$. The inverse exists because $Q$ is strictly monotonic.</p>
<p><b>Result.</b> Multiplying by $\sigma$ gives $V_t=\sigma\,Q^{-1}(P_{fa})$ — the threshold is a fixed number of noise standard deviations, set purely by the false-alarm budget. The signal amplitude $A$ (i.e. the dwell length) then determines the resulting $P_d$; sensitivity and false-alarm rate are thereby decoupled into two knobs.</p>`
      },
      {
        title: 'Mean acquisition time (single dwell)',
        tex: String.raw`$$E[T_{acq}]=\frac{(2-P_d)(1+K\,P_{fa})}{2P_d}\,q\,T_d$$`,
        derivation: String.raw`<p><b>Where we start.</b> Serial search examines $q$ equally likely cells, one dwell $T_d$ each, restarting the sweep if the true cell is missed. We want the expected time to first correct detection.</p>
<p><b>Step 1.</b> On a single sweep the true cell is detected with probability $P_d$; if missed (probability $1-P_d$) the whole ring of $q$ cells must be swept again. The expected number of sweeps is $1/P_d$, and combined with the fact that the true cell sits, on average, partway through a sweep, the average number of cell-tests scales as $\dfrac{(2-P_d)}{2P_d}\,q$.</p>
<p><b>Step 2.</b> Each false alarm costs extra time: instead of $T_d$, a falsely flagged cell consumes about $(1+K)T_d$ because verification/recovery adds $K\,T_d$. Averaged over cells (fraction $P_{fa}$ of which false-alarm), the effective time per cell is inflated by the factor $(1+K\,P_{fa})$.</p>
<p><b>Result.</b> Multiplying the average cell count by the per-cell time $T_d$ and the false-alarm inflation gives $E[T_{acq}]=\dfrac{(2-P_d)(1+K P_{fa})}{2P_d}\,qT_d$. As $P_d\to1,\,P_{fa}\to0$ it tends to $\tfrac12 qT_d$; the worst-case full search is $qT_d$.</p>`
      },
      {
        title: 'Coherent integration SNR gain',
        tex: String.raw`$$\left(\frac{A}{\sigma}\right)^2 \propto T_d,\qquad \text{peak SNR grows linearly with dwell}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Coherent integration over a dwell $T_d$ accumulates $M=T_d/T_c$ despread chip samples. Signal samples add coherently (same sign after despreading); noise samples are independent and zero-mean.</p>
<p><b>Step 1.</b> The signal amplitude after summing $M$ aligned samples grows in proportion to $M$: $A\propto M$. Coherent, in-phase addition means the peak height scales with the number of samples.</p>
<p><b>Step 2.</b> Independent noise adds in RMS, so the noise standard deviation grows only as $\sqrt{M}$: $\sigma\propto\sqrt{M}$. Hence the amplitude signal-to-noise ratio is $A/\sigma\propto M/\sqrt{M}=\sqrt{M}$, and the power (squared) SNR is $(A/\sigma)^2\propto M\propto T_d$.</p>
<p><b>Result.</b> The correlator peak SNR grows linearly with the dwell time $T_d$ (about $3$ dB per doubling). This is why a longer dwell lifts $A/\sigma$, raising $P_d$ for a fixed $P_{fa}$ and enabling weak-signal acquisition — at the cost of a slower, larger search. Beyond the coherence time this coherent gain saturates and only less-efficient non-coherent combining remains.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is DSSS acquisition?`, back: String.raw`The coarse alignment stage that brings the local PN code and Doppler within about $\pm\tfrac12$ chip and one frequency bin of the incoming signal, so tracking can lock.` },
      { front: String.raw`Why is the acquisition search two-dimensional?`, back: String.raw`Both code phase (unknown position in the $N$-chip sequence) and carrier frequency (unknown Doppler) must be right for the correlation to peak.` },
      { front: String.raw`Why search code phase in half-chip steps?`, back: String.raw`The autocorrelation peak is only about one chip wide; half-chip spacing guarantees the peak is not straddled and missed. It gives $2N$ code cells.` },
      { front: String.raw`How many cells does the search grid have?`, back: String.raw`$q=(2N)\times N_{\text{dop}}$: $2N$ half-chip code cells times the number of Doppler bins.` },
      { front: String.raw`How wide is a Doppler bin?`, back: String.raw`About $1/T_d$: a frequency error near $1/T_d$ makes the coherent sum (a sinc) collapse, so bins are spaced by roughly the inverse dwell time.` },
      { front: String.raw`What is a sliding correlator?`, back: String.raw`A serial search engine that dwells $T_d$ on one cell, compares to threshold $V_t$, and slides the local code by a half chip to the next cell if below.` },
      { front: String.raw`Why is acquisition detection non-coherent?`, back: String.raw`The carrier phase is unknown before lock; the detector forms $Z=I^2+Q^2$ to remove phase. Coherent detection needs carrier lock, which does not yet exist.` },
      { front: String.raw`What is the false-alarm probability?`, back: String.raw`$P_{fa}=Q(V_t/\sigma)$ — the chance a noise-only cell (mean 0, std $\sigma$) crosses the threshold $V_t$.` },
      { front: String.raw`What is the detection probability?`, back: String.raw`$P_d=Q((V_t-A)/\sigma)$ — the chance the correct cell (mean $A$, std $\sigma$) crosses the threshold.` },
      { front: String.raw`How is the threshold set (Neyman–Pearson)?`, back: String.raw`Fix a target $P_{fa}$, then $V_t=\sigma\,Q^{-1}(P_{fa})$; the dwell length (via $A/\sigma$) then determines $P_d$.` },
      { front: String.raw`State the mean-acquisition-time formula.`, back: String.raw`$E[T_{acq}]=\dfrac{(2-P_d)(1+KP_{fa})}{2P_d}\,qT_d$, with $q$ cells, dwell $T_d$, and false-alarm penalty $K$.` },
      { front: String.raw`What is the worst-case acquisition time?`, back: String.raw`A full search of every cell once: $q\,T_d$. The mean is smaller because the peak is met partway through the sweep.` },
      { front: String.raw`How does FFT-based parallel code-phase search work?`, back: String.raw`Circular correlation via FFT: FFT the samples and the code, multiply (one conjugated), inverse-FFT — giving the correlation at all $N$ code phases at once (used in GPS).` },
      { front: String.raw`What does two-dwell verification achieve?`, back: String.raw`A short first dwell flags candidates, a longer second confirms them; the effective false-alarm probability becomes about $P_{fa,1}P_{fa,2}$, slashing wasted recovery time.` },
      { front: String.raw`How does dwell time affect sensitivity and search?`, back: String.raw`Longer dwell raises peak SNR ($ (A/\sigma)^2\propto T_d$) and narrows Doppler bins — better sensitivity but larger $q$ and slower search.` }
    ],
    mcqs: [
      { q: String.raw`The purpose of DSSS acquisition is to:`, options: [String.raw`decode the navigation data bits`, String.raw`coarsely align the PN replica and Doppler to within about half a chip`, String.raw`equalize multipath`, String.raw`perform final carrier phase tracking`], answer: 1, explain: String.raw`Acquisition is the coarse alignment stage that precedes fine tracking; it gets within about $\pm\tfrac12$ chip and one frequency bin.` },
      { q: String.raw`The acquisition search space is two-dimensional in:`, options: [String.raw`amplitude and phase`, String.raw`code phase and carrier frequency (Doppler)`, String.raw`I and Q`, String.raw`chip rate and bit rate`], answer: 1, explain: String.raw`Both code phase and frequency must be correct for the correlation to peak.` },
      { q: String.raw`Searching code phase in half-chip steps for a length-$N$ code gives how many code cells?`, options: [String.raw`$N$`, String.raw`$N/2$`, String.raw`$2N$`, String.raw`$N^2$`], answer: 2, explain: String.raw`Half-chip resolution over $N$ chips is $N/(1/2)=2N$ cells, avoiding straddling the one-chip-wide peak.` },
      { q: String.raw`The Doppler bin width is approximately:`, options: [String.raw`$T_d$`, String.raw`$1/T_d$`, String.raw`$1/T_c$`, String.raw`$R_c$`], answer: 1, explain: String.raw`The coherent sum is a sinc in frequency with first null at $\Delta f=1/T_d$, so bins are spaced about $1/T_d$.` },
      { q: String.raw`Acquisition detection is non-coherent because:`, options: [String.raw`the noise is non-Gaussian`, String.raw`the carrier phase is unknown before lock`, String.raw`the code is unknown`, String.raw`the data rate is too high`], answer: 1, explain: String.raw`With unknown carrier phase, a single-arm output scales by $\cos\theta$; forming $Z=I^2+Q^2$ removes the phase.` },
      { q: String.raw`The non-coherent decision variable is:`, options: [String.raw`$I+Q$`, String.raw`$I^2+Q^2$`, String.raw`$I-Q$`, String.raw`$IQ$`], answer: 1, explain: String.raw`The square-law envelope $Z=I^2+Q^2$ is the squared magnitude of the complex correlation, independent of carrier phase.` },
      { q: String.raw`The false-alarm probability in the Gaussian model is:`, options: [String.raw`$Q(V_t/\sigma)$`, String.raw`$Q((V_t-A)/\sigma)$`, String.raw`$Q(A/\sigma)$`, String.raw`$1-Q(V_t/\sigma)$`], answer: 0, explain: String.raw`A noise-only cell has mean 0 and std $\sigma$; crossing $V_t$ has probability $Q(V_t/\sigma)$.` },
      { q: String.raw`The detection probability in the Gaussian model is:`, options: [String.raw`$Q(V_t/\sigma)$`, String.raw`$Q((V_t-A)/\sigma)$`, String.raw`$Q((V_t+A)/\sigma)$`, String.raw`$Q(\sigma/V_t)$`], answer: 1, explain: String.raw`The correct cell has mean $A$; detection needs $A+n>V_t$, i.e. $n>V_t-A$, giving $Q((V_t-A)/\sigma)$.` },
      { q: String.raw`To improve both $P_d$ and $P_{fa}$ simultaneously you must:`, options: [String.raw`raise the threshold`, String.raw`lower the threshold`, String.raw`increase $A/\sigma$ (e.g. longer dwell)`, String.raw`add more Doppler bins`], answer: 2, explain: String.raw`Moving the threshold trades one against the other; only a larger peak-to-noise ratio helps both, and dwell raises $A/\sigma$.` },
      { q: String.raw`The Neyman–Pearson threshold for a target $P_{fa}$ is:`, options: [String.raw`$V_t=\sigma\,Q^{-1}(P_{fa})$`, String.raw`$V_t=A\,Q(P_{fa})$`, String.raw`$V_t=P_{fa}/\sigma$`, String.raw`$V_t=\sigma\,\ln P_{fa}$`], answer: 0, explain: String.raw`Invert $P_{fa}=Q(V_t/\sigma)$ to get $V_t=\sigma Q^{-1}(P_{fa})$ — a fixed number of noise sigmas.` },
      { q: String.raw`In $E[T_{acq}]=\frac{(2-P_d)(1+KP_{fa})}{2P_d}qT_d$, the factor $K$ represents:`, options: [String.raw`the number of Doppler bins`, String.raw`the false-alarm penalty (extra verification time per false alarm)`, String.raw`the code length`, String.raw`the processing gain`], answer: 1, explain: String.raw`Each false alarm wastes about $K\,T_d$ recovering/verifying, inflating the per-cell cost by $(1+KP_{fa})$.` },
      { q: String.raw`FFT-based parallel code-phase acquisition (as in GPS) computes:`, options: [String.raw`one code phase per transform`, String.raw`the correlation at all $N$ code phases at once via circular correlation`, String.raw`only the Doppler estimate`, String.raw`the data bits directly`], answer: 1, explain: String.raw`Circular correlation via FFT/IFFT evaluates every code phase simultaneously, hugely faster than serial search.` }
    ],
    numericals: [
      {
        q: String.raw`A DSSS receiver acquires a length $N=1023$ code searched in half-chip steps. The Doppler uncertainty spans $\pm5$ kHz (10 kHz total) and the dwell is $T_d=1$ ms, so the Doppler bin width is about $1/T_d$. How many cells $q$ are there?`,
        solution: String.raw`<p><b>Formula.</b> $$q=(2N)\times N_{\text{dop}},\qquad N_{\text{dop}}=\left\lceil\frac{f_{\text{span}}}{1/T_d}\right\rceil,$$ where $2N$ is the number of half-chip code cells and $N_{\text{dop}}$ the number of Doppler bins of width $1/T_d$.</p>
<p><b>Substitute.</b> Code cells $=2\times1023=2046$. Bin width $=1/T_d=1/(1\times10^{-3})=1000$ Hz. $N_{\text{dop}}=\lceil 10000/1000\rceil=10$.</p>
<p><b>Compute.</b> $q=2046\times10=\mathbf{20460}$ cells.</p>
<p><b>Explanation.</b> The receiver must test about 20460 code-phase/Doppler hypotheses. This is why serial acquisition of even a modest 1023-chip code with a 10 kHz Doppler window is slow — it motivates parallel and FFT-based search that collapse the $2N=2046$ code dimension into a single pass.</p>`
      },
      {
        q: String.raw`Using the grid above ($q=20460$ cells, dwell $T_d=1$ ms), find the worst-case (full-search) acquisition time.`,
        solution: String.raw`<p><b>Formula.</b> $$T_{\text{worst}}=q\,T_d,$$ the time to dwell once on every cell in the grid.</p>
<p><b>Substitute.</b> $$T_{\text{worst}}=20460\times1\times10^{-3}\ \text{s}.$$</p>
<p><b>Compute.</b> $T_{\text{worst}}=20460\times0.001=\mathbf{20.46\ s}.$</p>
<p><b>Explanation.</b> A pure serial search that must visit every cell once takes over 20 seconds — clearly too slow for a cold start. The mean time is roughly half this when $P_d\approx1$, and parallel/FFT engines reduce it by orders of magnitude by testing many code phases at once.</p>`
      },
      {
        q: String.raw`For the same grid ($q=20460$, $T_d=1$ ms), the single-dwell detection probability is $P_d=0.9$, the false-alarm probability is $P_{fa}=10^{-3}$, and the false-alarm penalty is $K=100$. Find the mean acquisition time.`,
        solution: String.raw`<p><b>Formula.</b> $$E[T_{acq}]=\frac{(2-P_d)(1+K\,P_{fa})}{2P_d}\,q\,T_d,$$ with $q$ cells, dwell $T_d$, detection $P_d$, false-alarm $P_{fa}$, and penalty $K$.</p>
<p><b>Substitute.</b> $$E[T_{acq}]=\frac{(2-0.9)(1+100\times10^{-3})}{2\times0.9}\times20460\times1\times10^{-3}.$$</p>
<p><b>Compute.</b> Numerator factor $=(1.1)(1.1)=1.21$; denominator $=1.8$; so the leading coefficient $=1.21/1.8=0.6722$. Then $q\,T_d=20460\times0.001=20.46$ s, giving $E[T_{acq}]=0.6722\times20.46=\mathbf{13.75\ s}.$</p>
<p><b>Explanation.</b> With imperfect detection ($P_d=0.9$) and a modest false-alarm inflation ($1+KP_{fa}=1.1$), the mean is about $0.67\,qT_d\approx13.8$ s — more than the ideal $\tfrac12 qT_d=10.2$ s because missed peaks force extra sweeps and false alarms waste verification time.</p>`
      },
      {
        q: String.raw`A correlator has output noise std $\sigma=0.5$ (volts). Set the acquisition threshold for a target false-alarm probability $P_{fa}=10^{-3}$. Use $Q^{-1}(10^{-3})\approx3.09$.`,
        solution: String.raw`<p><b>Formula.</b> $$V_t=\sigma\,Q^{-1}(P_{fa}),$$ obtained by inverting $P_{fa}=Q(V_t/\sigma)$.</p>
<p><b>Substitute.</b> $$V_t=0.5\times Q^{-1}(10^{-3})=0.5\times3.09.$$</p>
<p><b>Compute.</b> $V_t=\mathbf{1.545\ \text{V}}$ (about $3.09\,\sigma$).</p>
<p><b>Explanation.</b> The threshold sits at $3.09$ noise standard deviations, so a pure-noise cell exceeds it only once in a thousand dwells. The resulting detection probability then depends on the peak amplitude $A$: with $A$ large compared to $V_t$, $P_d$ is high; the dwell length is what buys that $A$.</p>`
      },
      {
        q: String.raw`With the threshold $V_t=1.545$ V and noise std $\sigma=0.5$ V from the previous problem, the correlation-peak amplitude at the correct cell is $A=3.0$ V. Find the detection probability. Use $Q(-2.91)\approx0.998$.`,
        solution: String.raw`<p><b>Formula.</b> $$P_d=Q\!\left(\frac{V_t-A}{\sigma}\right),$$ where $A$ is the peak amplitude and $\sigma$ the output-noise std.</p>
<p><b>Substitute.</b> $$P_d=Q\!\left(\frac{1.545-3.0}{0.5}\right)=Q\!\left(\frac{-1.455}{0.5}\right)=Q(-2.91).$$</p>
<p><b>Compute.</b> $P_d=Q(-2.91)\approx\mathbf{0.998}.$</p>
<p><b>Explanation.</b> Because the peak $A=3.0$ V sits well above the $1.545$ V threshold (nearly $3\sigma$ above it), the correct cell is detected about 99.8% of the time while the false-alarm rate stays at $10^{-3}$. This separation of $P_d$ and $P_{fa}$ is exactly what a healthy peak-to-noise ratio $A/\sigma=6$ delivers.</p>`
      },
      {
        q: String.raw`A weak-signal acquisition needs a Doppler bin width of at most 250 Hz to limit integration loss. What minimum coherent dwell time is required, and how many bins cover a $\pm7.5$ kHz Doppler span?`,
        solution: String.raw`<p><b>Formula.</b> $$\Delta f_{\text{bin}}\approx\frac{1}{T_d}\ \Rightarrow\ T_d\ge\frac{1}{\Delta f_{\text{bin}}},\qquad N_{\text{dop}}=\left\lceil\frac{f_{\text{span}}}{\Delta f_{\text{bin}}}\right\rceil.$$</p>
<p><b>Substitute.</b> $$T_d\ge\frac{1}{250\ \text{Hz}},\qquad N_{\text{dop}}=\left\lceil\frac{15000\ \text{Hz}}{250\ \text{Hz}}\right\rceil.$$ (The span is $\pm7.5$ kHz, i.e. 15 kHz total.)</p>
<p><b>Compute.</b> $T_d\ge1/250=4\times10^{-3}\ \text{s}=\mathbf{4\ ms}$; $N_{\text{dop}}=\lceil 60\rceil=\mathbf{60\ bins}.$</p>
<p><b>Explanation.</b> Finer Doppler resolution (250 Hz) demands a longer 4 ms coherent dwell — which also raises sensitivity — but it forces 60 Doppler bins across the 15 kHz span, multiplying the cell count $q$ and hence the search time. This is the sensitivity-versus-speed trade in concrete numbers.</p>`
      }
    ],
    realWorld: String.raw`<p>Every GPS receiver performs this search at power-on. A "cold start" with no almanac must sweep code phase (1023 chips, half-chip = 2046 cells) across a Doppler window of roughly $\pm5$ kHz for a stationary user (wider for aircraft), which is why an unaided receiver can take tens of seconds for a first fix. Modern chips slash this with massively parallel correlators and FFT-based parallel code-phase search, evaluating all 1023 code phases per Doppler bin in one transform; assisted-GPS further supplies the almanac and a coarse Doppler estimate to shrink the search grid, cutting time-to-first-fix to a second or two.</p>
<p>The same statistics govern indoor and weak-signal GNSS, deep-space telemetry, and military LPI/anti-jam waveforms. Weak-signal receivers extend the coherent dwell (and then non-coherently combine dwells) to raise the peak $A/\sigma$ enough to detect signals far below the noise floor, accepting narrower Doppler bins and a larger, slower search. Threshold setting is a live design choice: a Neyman–Pearson threshold pinned to a target false-alarm rate, often backed by two-dwell verification, keeps the receiver from repeatedly false-locking on noise while still catching genuine peaks — the difference between a receiver that locks reliably and one that wanders.</p>`,
    related: ['dsss-tracking', 'dsss-data-extraction', 'dsss', 'pn-codes', 'processing-gain']
  }
);
