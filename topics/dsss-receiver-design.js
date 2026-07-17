/* dsss-receiver-design.js — "DSSS Receiver Design" topic (Spread Spectrum & Coding).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   This is the SYSTEM / ARCHITECTURE topic that integrates acquisition, tracking,
   and despreading into one end-to-end receiver; it cross-references those topics
   rather than re-deriving them.
   All text in String.raw; no literal backticks, no dollar-then-curly-brace sequence.
   Every SVG marker/def id is prefixed "dsss-receiver-design-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'dsss-receiver-design',
    title: 'DSSS Receiver Design',
    category: 'Spread Spectrum & Coding',
    tags: ['DSSS', 'receiver architecture', 'front-end', 'ADC', 'acquisition', 'tracking', 'RAKE', 'MRC', 'near-far', 'processing gain', 'link budget', 'SDR'],
    summary: String.raw`DSSS receiver design is the end-to-end architecture that turns a spread signal buried below the noise floor into recovered data: an RF front-end (LNA, downconversion, AGC, ADC) feeds code acquisition, which hands off to concurrent code (DLL) and carrier (FLL then Costas/PLL) tracking, whose prompt correlator despreads and demodulates before de-interleave and FEC. This topic integrates the acquisition, tracking, and despreading stages into one system, sizes the chip-rate/code-length/loop-bandwidth/ADC budget, and adds the multipath RAKE receiver, maximal-ratio combining, and the CDMA near-far problem.`,
    prerequisites: ['dsss', 'dsss-acquisition', 'dsss-tracking'],
    intro: String.raw`<p><strong>Why design a whole receiver when we already have a correlator?</strong> A single despreading correlator recovers a bit only if it is handed a signal whose code phase is aligned to within a fraction of a chip and whose carrier phase is known to within a few degrees. Nothing supplies those two alignments for free. Delivering them, continuously, against Doppler, oscillator drift, platform dynamics, multipath, and jamming, is the job of an entire coordinated <em>receiver</em> — a chain of stages in which the correlator is only the final, easy step. DSSS receiver design is the study of that chain as a system: how the blocks connect, hand off, share information, and are jointly sized so the link closes.</p>
    <p>The architecture has a fixed skeleton. An <strong>RF front-end</strong> (low-noise amplifier, downconversion to IF or baseband, automatic gain control, and an analog-to-digital converter) presents clean digital samples. <strong>Code acquisition</strong> performs a coarse two-dimensional open-loop search over code phase and Doppler and declares the signal found within roughly half a chip and one Doppler bin. That estimate is <strong>handed over</strong> to closed-loop tracking, where a <strong>delay-locked loop</strong> holds code phase and, running in lockstep, a <strong>frequency-locked loop then a Costas/PLL</strong> hold carrier. The tracking loops' <strong>prompt correlator</strong> is the pivot of the whole design: its in-phase/quadrature output simultaneously feeds the carrier loop and, after integrate-and-dump <strong>despreading</strong>, the symbol decision — which then flows to de-interleaving and forward-error-correction decoding. Each of these stages has its own topic; here we assemble them and reason about the <em>interfaces</em>.</p>
    <p>Design is where the numbers live. Chip rate and code length set the occupied bandwidth, the range/delay resolution, the processing gain, and the acquisition time. Loop bandwidths trade jitter against dynamic stress. Predetection integration time and ADC word length set the weak-signal sensitivity and the jammer headroom. And two system-level effects that a single correlator never sees — resolvable <strong>multipath</strong> (answered by the RAKE receiver and maximal-ratio combining) and the CDMA <strong>near-far problem</strong> (answered by power control) — only appear when you look at the receiver as a whole. This topic is that whole-system view.</p>`,
    sections: [
      {
        h: 'Why a receiver, not just a correlator',
        html: String.raw`<p><strong>Why start at the system level?</strong> Because every attractive property of DSSS — recovering a signal tens of dB below the noise floor, shrugging off a strong jammer, hiding the transmission (low probability of intercept), letting many users share one band (CDMA) — is delivered not by any single block but by the <em>cooperation</em> of blocks. Acquisition without tracking finds a signal it immediately loses. Tracking without a clean front-end chases noise. Despreading without alignment produces garbage. The receiver is the smallest unit that actually works.</p>
        <p>Think of the design as answering three questions in order. <strong>Can I see it?</strong> — the front-end must deliver the signal-plus-noise with enough dynamic range and low enough added noise that acquisition can detect the correlation peak. <strong>Can I lock it?</strong> — acquisition must land inside the tracking loops' pull-in region, and the loops must have enough bandwidth to follow the dynamics yet little enough to keep jitter low. <strong>Can I read it?</strong> — the prompt correlator must despread coherently and hand a clean decision statistic to the demodulator and decoder. A receiver design is a set of parameter choices (chip rate, code length, ADC bits, loop bandwidths, integration times) that makes all three answers "yes" simultaneously for the worst-case signal, dynamics, and interference the mission specifies.</p>
        <div class="callout"><strong>Framing:</strong> the individual topics (<em>DSSS Acquisition</em>, <em>DSSS Tracking</em>, <em>DSSS Data Extraction</em>) each perfect one block. This topic is the general contractor: it wires those blocks together, defines the handoffs, and balances the budget so the finished receiver meets spec.</div>`
      },
      {
        h: 'The end-to-end signal chain',
        html: String.raw`<p>The canonical DSSS receiver is a pipeline. Following one satellite/user channel from antenna to data:</p>
        <ol>
          <li><strong>RF front-end.</strong> Low-noise amplifier (LNA) sets the system noise figure; downconversion (one or more mixers with a local oscillator) translates the RF to an intermediate frequency or directly to baseband; filtering limits the band to the spread bandwidth; automatic gain control (AGC) holds the level; the analog-to-digital converter (ADC) samples to a digital stream.</li>
          <li><strong>Acquisition.</strong> A coarse, open-loop 2-D search over code phase and Doppler (serial, parallel, or FFT-based) that declares detection when a correlation exceeds threshold, aligning the local PN code within about $\pm\tfrac12$ chip. (See the dedicated <em>DSSS Acquisition</em> topic.)</li>
          <li><strong>Handover.</strong> The acquisition code-phase and Doppler estimates initialize the tracking loops' numerically-controlled oscillators (NCOs), placing the loops inside their linear pull-in region.</li>
          <li><strong>Concurrent tracking.</strong> A <strong>code loop (DLL)</strong> with Early/Prompt/Late correlators holds code phase; in lockstep a <strong>carrier loop</strong> (an FLL to pull in frequency, then a Costas/PLL to lock phase) holds carrier. (See <em>DSSS Tracking</em>.)</li>
          <li><strong>Despreading and demodulation.</strong> The <strong>prompt</strong> correlator multiplies the signal by the aligned PN replica and integrates over the symbol (integrate-and-dump matched filter); the symbol decision follows from the coherent in-phase accumulation. (See <em>DSSS Data Extraction</em>.)</li>
          <li><strong>De-interleave and FEC decode.</strong> Soft symbol metrics are de-interleaved and passed to a Viterbi/turbo/LDPC decoder, then descrambled and frame-synchronized to yield the user data.</li>
        </ol>
        <p>Two architectural facts make the pipeline efficient. First, everything after the ADC is <strong>digital</strong> in a modern software-defined receiver, so acquisition, tracking, and despreading are the same multiply-and-accumulate arithmetic reused at different rates. Second, the <strong>prompt correlator is shared</strong>: the identical I/Q correlation that closes the carrier loop also, integrated over a full symbol, becomes the data decision statistic — one correlator, two consumers.</p>`
      },
      {
        h: 'RF front-end and ADC: sensitivity and jammer headroom',
        html: String.raw`<p>The front-end sets two limits that no amount of digital cleverness can recover: how <em>weak</em> a signal the receiver can hear, and how <em>strong</em> an interferer it can tolerate before it clips.</p>
        <p><strong>Sensitivity</strong> is governed by the noise figure. The LNA is placed first precisely because, by Friis' formula, the first stage's noise figure dominates the whole cascade; a low-noise-figure LNA with enough gain makes later-stage noise negligible. The receiver's carrier-to-noise-density ratio $C/N_0$ — the currency of every DSSS sensitivity calculation — is fixed here, before any despreading.</p>
        <p><strong>Dynamic range</strong> is governed by the AGC and the ADC word length. A DSSS receiver is designed to work with the wanted signal <em>below</em> the noise, so the ADC is not set by the signal at all — it is set by the largest <em>interferer</em> that must pass through without saturating the converter while the tiny signal still sits above the quantization noise. The rule of thumb is about <strong>6 dB of dynamic range per ADC bit</strong> (from the full-scale sine SQNR $=6.02\,b+1.76$ dB). A receiver expected to survive a jammer 30-40 dB above the signal therefore needs enough bits to span the jammer <em>plus</em> headroom for the signal and the crest factor — often 8-12 bits even though the signal itself would need only 1-2.</p>
        <div class="callout tip"><strong>Design tension:</strong> more ADC bits buy jammer headroom but cost power and sample-rate; too few bits and a strong jammer clips, destroying the processing gain before despreading can dilute it. Sizing the ADC to the jammer-to-signal ratio is a core DSSS front-end decision.</div>
        <p>AGC deserves special care in interference: a strong jammer can drive the AGC to back off gain so far that the wanted signal falls below the ADC's least significant bits. Good designs use a fast AGC referenced to the noise floor and rely on the following despreading to reject the jammer, rather than letting the AGC try to.</p>`
      },
      {
        h: 'Acquisition-to-tracking handover',
        html: String.raw`<p>The seam between the open-loop search and the closed-loop steady state is the <strong>handover</strong>, and getting it right is a design problem in its own right. Acquisition is a coarse, <em>open-loop</em> search: it sweeps a grid of code-phase and Doppler cells and declares the signal when a cell's correlation crosses threshold. Tracking is the closed-loop opposite: it does not search, it <em>corrects</em>, driving residual error to zero by feedback. The handover must satisfy three conditions:</p>
        <ul>
          <li><strong>Code pull-in.</strong> The acquisition code-phase estimate must land within the DLL's linear pull-in region (roughly $\pm\tfrac12$ chip for a wide correlator, tighter for a narrow one), so the code NCO starts close enough for the Early/Prompt/Late discriminator to pull it to zero.</li>
          <li><strong>Frequency pull-in.</strong> The residual Doppler after acquisition must be inside the FLL's pull-in range, so the frequency loop can reduce it before the Costas/PLL attempts phase lock.</li>
          <li><strong>Loop settling and confirmation.</strong> The loops are given a brief settling interval and a lock detector confirms sustained lock (prompt power high, carrier-lock ratio near $+1$) before the receiver trusts the demodulated data.</li>
        </ul>
        <p>This couples the two stages' designs. A finer acquisition grid (smaller code/Doppler steps) hands over more accurately — easing the tracking loops and permitting a narrow correlator — but costs more search time. A wider tracking pull-in region tolerates a coarser, faster acquisition but at higher steady-state jitter. The chosen split of the code/Doppler uncertainty between "searched away" (acquisition) and "pulled in" (tracking) is a joint optimization, not two independent choices.</p>
        <div class="callout"><strong>Handover chain:</strong> acquisition finds the cell &rarr; NCOs are loaded &rarr; FLL pulls in frequency &rarr; Costas/PLL locks phase &rarr; carrier aids the DLL &rarr; steady-state, narrow-band, low-jitter lock with the prompt correlator feeding data.</div>`
      },
      {
        h: 'Concurrent code and carrier tracking; the shared prompt correlator',
        html: String.raw`<p>In steady state the receiver runs <strong>two feedback loops at once</strong>, tightly coupled through the correlators. The <strong>code loop (DLL)</strong> uses Early minus Late to null code-phase error; the <strong>carrier loop</strong> uses the prompt I/Q to hold frequency (FLL) and then phase (Costas/PLL). The design decision that ties them together is where each loop's information comes from — and the answer is the <strong>prompt correlator</strong>.</p>
        <p>The prompt correlator forms $I_P=\int r(t)\,c_{\text{prompt}}(t)\cos(\hat\omega t+\hat\phi)\,dt$ and the matching $Q_P$. This single quantity has two jobs:</p>
        <ul>
          <li>It <strong>closes the carrier loop</strong>: the Costas discriminator $\arctan(Q_P/I_P)$ (data-insensitive) drives the phase, and a cross-product of successive prompts drives the FLL.</li>
          <li>It <strong>is the data</strong>: integrated over a full symbol with the carrier wiped off, the sign of $I_P$ is the demodulated bit.</li>
        </ul>
        <p>Hence <strong>coherent vs non-coherent</strong> structure is a whole-receiver choice, not a per-block one. A <em>coherent</em> receiver locks carrier phase (Costas/PLL) so the data lands entirely on $I_P$, giving lowest BER and the lowest-jitter code discriminator, but it demands a good $C/N_0$ and low dynamics. A <em>non-coherent</em> receiver (envelope/power discriminators, FLL only) tolerates residual phase error and high dynamics but pays a squaring loss. Crucially, <strong>carrier aiding</strong> lets the carrier loop — whose far higher frequency measures Doppler with tiny fractional error — feed a scaled rate into the code NCO, offloading the DLL's dynamic stress so it can run a very narrow bandwidth for low jitter. The code and carrier loops are partners, and the prompt correlator is the partnership's shared ledger.</p>`
      },
      {
        h: 'Despreading, processing gain, and the AWGN "no free lunch"',
        html: String.raw`<p>With alignment supplied, the prompt correlator despreads: multiply by the aligned code $c(t)$ (using $c^2(t)=1$) and integrate over the symbol. The wanted signal re-concentrates from the chip bandwidth $B_{ss}\approx R_c$ back to the data bandwidth $R_b$, while any uncoded interferer is <em>spread</em> across $R_c$. The output signal-to-interference ratio therefore improves by exactly the <strong>processing gain</strong>:</p>
        <p>$$ \mathrm{SNR}_{\text{out}}=N\cdot\mathrm{SNR}_{\text{in}},\qquad G_p=10\log_{10}N=10\log_{10}\!\left(\frac{B_{ss}}{R_b}\right)=10\log_{10}\!\left(\frac{R_c}{R_b}\right). $$</p>
        <p>The usable robustness is the <strong>jamming margin</strong> $M_j=G_p-(E_b/N_0)_{\text{req}}-L_{\text{sys}}$ (dB): the amount by which a jammer may exceed the signal at the receiver and the link still closes. This is the concrete payoff the entire architecture exists to deliver.</p>
        <table class="data">
          <tr><th>What despreading does to...</th><th>Wanted DSSS signal</th><th>Narrowband jammer</th><th>White thermal noise</th></tr>
          <tr><td>Bandwidth</td><td>collapses $R_c\!\to\!R_b$</td><td>spread $\to R_c$</td><td>unchanged</td></tr>
          <tr><td>Power in data band</td><td>preserved</td><td>diluted to $\approx J/N$</td><td>unchanged ($N_0$)</td></tr>
          <tr><td>Net effect on SNR</td><td>reference</td><td>$+G_p$ suppression</td><td>no change</td></tr>
        </table>
        <div class="callout tip"><strong>The most-tested design fact:</strong> over a <em>pure AWGN</em> channel the despread BER equals plain BPSK at the same $E_b/N_0=(C/N_0)/R_b$. Processing gain buys interference, jamming, and LPI margin — <em>not</em> thermal-noise BER. So a DSSS link is budgeted for $E_b/N_0$ as if it were narrowband BPSK, and the processing gain is spent entirely on anti-jam, covertness, and multiple-access capacity. (Derived in full in <em>DSSS Data Extraction</em>.)</div>`
      },
      {
        h: 'Multipath and the RAKE receiver',
        html: String.raw`<p>A wideband DSSS signal has a hidden gift: because its autocorrelation peak is only $\pm1$ chip wide, echoes that arrive more than one chip apart are <strong>resolvable</strong> — they appear as separate, near-independent correlation peaks rather than fading into one another. Two paths are resolvable when their delay separation exceeds a chip, i.e. the chip duration is smaller than the delay spread, $T_c<\Delta\tau$, equivalently $R_c>1/\Delta\tau$. A narrowband signal cannot do this; its long symbol smears the echoes together into destructive fading.</p>
        <p>The <strong>RAKE receiver</strong> turns this resolution into <em>diversity</em>. It assigns a bank of correlator <strong>fingers</strong>, each a complete despread-and-integrate locked to one resolvable path delay $\tau_l$ (a mini-DLL keeps each finger on its echo). Each finger recovers one copy of the symbol with its own amplitude and phase. The fingers are then combined by <strong>maximal-ratio combining (MRC)</strong>: weight each finger by the conjugate of its channel gain (co-phasing the copies and weighting strong fingers more), and sum. The combined SNR is the <em>sum</em> of the individual finger SNRs:</p>
        <p>$$ \gamma_{\text{MRC}}=\sum_{l=1}^{L}\gamma_l. $$</p>
        <p>For $L$ equal-strength fingers this is an $L$-fold ($10\log_{10}L$ dB) improvement, and — more importantly — it converts multipath from a fading liability into a diversity asset: the probability that <em>all</em> $L$ independent paths fade simultaneously is far lower than for one path. The number of usable fingers is set by the design: it is roughly the delay spread divided by the chip duration, $L\approx\tau_{\text{spread}}/T_c$, so a higher chip rate resolves more paths and buys more diversity.</p>
        <div class="callout"><strong>Same primitive, replicated:</strong> every RAKE finger is exactly the despread-and-dump of a single DSSS data extractor, just locked to a different delay; the RAKE is that primitive instantiated $L$ times and combined by MRC.</div>`
      },
      {
        h: 'The near-far problem and power control',
        html: String.raw`<p>When many DSSS users share one band (CDMA), the receiver design meets a problem a single link never sees. Distinct users are separated by (near-)orthogonal codes, but real spreading codes have <strong>non-zero cross-correlation</strong>: when the receiver despreads user A, every other user leaks through as residual interference proportional to their received power. If a nearby user B arrives far stronger than a distant user A, B's cross-correlation leakage can <strong>swamp</strong> A entirely, even though A's own despreading gain is intact. This is the <strong>near-far problem</strong>, and it is a defining constraint of CDMA receiver and system design.</p>
        <p>The processing gain does <em>not</em> solve it, because the interferer here is another coded signal, not a narrowband tone; its leakage is set by code cross-correlation, not by $1/N$ dilution of a tone. The standard answer is <strong>tight transmit power control</strong>: the network commands every user to adjust transmit power so that all signals arrive at the receiver at nearly equal power, removing the imbalance. IS-95 and later CDMA systems run fast closed-loop power control (hundreds to over a thousand updates per second) for exactly this reason. Complementary measures include well-designed low-cross-correlation code families (Gold codes and Kasami sequences), and, in advanced receivers, multi-user detection or interference cancellation.</p>
        <div class="callout"><strong>Contrast:</strong> against a <em>jammer</em>, processing gain is the defense; against <em>another user</em> in the same code family, <em>power control</em> is the defense. A DSSS receiver designer must budget for both, because they fail in different ways.</div>`
      },
      {
        h: 'Design sizing: the receiver budget',
        html: String.raw`<p>Designing a DSSS receiver is choosing a handful of coupled parameters so the link closes for the worst case. The dominant trades:</p>
        <table class="data">
          <tr><th>Parameter</th><th>Sets</th><th>Trade</th></tr>
          <tr><td>Chip rate $R_c$</td><td>occupied bandwidth, range/delay resolution, $L$ RAKE fingers</td><td>higher $R_c$ = more resolution/diversity/bandwidth, but faster ADC and more processing</td></tr>
          <tr><td>Code length $N$ (chips)</td><td>processing gain $G_p$, code period, cross-correlation floor, acquisition cells</td><td>longer code = more gain/covertness/users but longer acquisition search</td></tr>
          <tr><td>Loop bandwidths $B_L$</td><td>code/carrier jitter vs dynamic tracking</td><td>wide = tracks dynamics but noisy; narrow = low jitter but sluggish</td></tr>
          <tr><td>Predetection integration $T$</td><td>weak-signal sensitivity, squaring loss</td><td>longer $T$ = more sensitivity but limited by coherence/Doppler and data rate</td></tr>
          <tr><td>ADC word length $b$</td><td>jammer headroom (~6 dB/bit)</td><td>more bits = more headroom but more power/cost</td></tr>
        </table>
        <p>These are not independent. Chip rate and code length together fix the <strong>acquisition time</strong> (more cells to search) and the <strong>processing gain</strong>. The chip rate fixes both the <strong>range resolution</strong> ($c\,T_c$) and how many <strong>RAKE fingers</strong> the delay spread yields. The loop bandwidths and integration time are set jointly against the platform dynamics and the minimum $C/N_0$. And the ADC is sized to the specified jammer-to-signal ratio. A coherent design of the whole receiver picks these so that acquisition succeeds within the time budget, tracking holds through the dynamics at acceptable jitter, and despreading delivers the required $E_b/N_0$ and jamming margin simultaneously.</p>
        <div class="callout tip"><strong>Worked link budget order:</strong> (1) from the mission, fix $R_b$ and the required BER, hence $(E_b/N_0)_{\text{req}}$; (2) from the anti-jam spec, fix $G_p$ hence $R_c=N R_b$; (3) size the ADC to the jammer-to-signal ratio; (4) from the dynamics and minimum $C/N_0$, set $B_L$ and $T$; (5) from acquisition-time budget, choose the search architecture (serial/parallel/FFT). Every number in this topic feeds one of those steps.</div>`
      },
      {
        h: 'Practical realizations: GPS, IS-95, and the all-digital SDR',
        html: String.raw`<p>The same skeleton appears across very different systems, distinguished by their parameter choices and their despreading implementation.</p>
        <ul>
          <li><strong>GPS (L1 C/A).</strong> $R_c=1.023$ Mcps, code length 1023 chips, $R_b=50$ bps navigation data, so $N\approx20{,}460$ per bit and $G_p\approx43$ dB. Each channel runs a carrier-aided DLL (often a narrow correlator to beat urban multipath) with an FLL-to-PLL carrier loop; the receiver recovers a signal about 20-30 dB below the noise floor purely through coherent despread-and-dump. The code and carrier NCO rates become the pseudorange and Doppler measurements the position solver consumes.</li>
          <li><strong>IS-95 / CDMA2000 cellular.</strong> $R_c=1.2288$ Mcps, $R_b=9.6$ kbps voice, $N=128$, $G_p\approx21$ dB. A RAKE receiver assigns fingers to resolvable multipath and MRC-combines them; fast closed-loop power control defeats the near-far problem; the soft finger outputs feed a Viterbi decoder.</li>
        </ul>
        <p>The despreading engine itself has three classic forms. A <strong>matched filter</strong> (or correlator bank) computes all code phases in parallel — fast acquisition, more hardware. A <strong>serial correlator</strong> tests one phase at a time — minimal hardware, slower. An <strong>FFT-based</strong> circular correlation computes an entire code-phase dimension at once via the frequency domain — the standard modern acquisition accelerator. In today's <strong>all-digital software-defined receiver (SDR)</strong> everything after the ADC is arithmetic on samples: acquisition, tracking, despreading, and decoding are the same multiply-accumulate operations reused at different rates and reconfigurable in software, which is why one radio can serve GPS, Galileo, and a CDMA waveform by changing code and parameters rather than hardware.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>DSSS receiver design is the system that makes the individual DSSS stages add up to a working link. You should now be able to say:</p>
        <ul>
          <li><strong>The architecture:</strong> RF front-end (LNA &rarr; downconvert &rarr; AGC &rarr; ADC) &rarr; acquisition &rarr; handover &rarr; concurrent DLL + FLL/Costas tracking &rarr; despread/demod &rarr; de-interleave/FEC — a pipeline in which the correlator is the last, easy step.</li>
          <li><strong>The front-end limits:</strong> the LNA fixes sensitivity ($C/N_0$) and the ADC word length fixes jammer headroom at roughly 6 dB per bit; the ADC is sized to the interferer, not the signal.</li>
          <li><strong>The handover and the shared prompt:</strong> acquisition (coarse, open-loop) must land inside the tracking pull-in region; the prompt correlator both closes the carrier loop and is the data, and carrier aiding lets the DLL run narrow and quiet.</li>
          <li><strong>The payoff and its limit:</strong> despreading gives $\mathrm{SNR}_{\text{out}}=N\,\mathrm{SNR}_{\text{in}}$ and jamming margin $M_j=G_p-(E_b/N_0)_{\text{req}}-L_{\text{sys}}$ against interference, but no AWGN BER gain — budget $E_b/N_0$ as plain BPSK.</li>
          <li><strong>The system-level effects:</strong> resolvable multipath ($T_c<\Delta\tau$) is harvested by a RAKE receiver whose MRC combined SNR is $\sum_l\gamma_l$ (diversity), and the CDMA near-far problem is defeated by power control, not processing gain.</li>
          <li><strong>The budget:</strong> chip rate and code length set bandwidth, resolution, processing gain, and acquisition time; loop bandwidths and integration time trade jitter against dynamics; the ADC is sized to the jammer — and all of these are chosen jointly for the worst case.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://gssc.esa.int/navipedia/index.php/Baseband_Processing" target="_blank" rel="noopener">ESA Navipedia — Baseband Processing</a> — authoritative GNSS reference that walks the full receiver baseband chain (correlation, acquisition, PLL/DLL tracking, despreading) as one integrated system, matching this topic's architecture view.</li>
<li><a href="https://gnss-sdr.org/docs/" target="_blank" rel="noopener">GNSS-SDR — Documentation</a> — the open-source software-defined GNSS receiver, with per-block documentation (signal source, acquisition, tracking, telemetry decoding) that shows the all-digital SDR architecture in real, runnable code.</li>
<li><a href="https://en.wikipedia.org/wiki/Rake_receiver" target="_blank" rel="noopener">Wikipedia — Rake receiver</a> — clear treatment of the RAKE fingers, resolvable multipath, and maximal-ratio combining that turn delay spread into diversity gain, exactly the multipath section here.</li>
<li><a href="https://en.wikipedia.org/wiki/Near%E2%80%93far_problem" target="_blank" rel="noopener">Wikipedia — Near-far problem</a> — concise explanation of why code cross-correlation lets a strong nearby user swamp a weak far one in CDMA, and why tight power control (not processing gain) is the fix.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`A DSSS receiver is a coordinated pipeline: RF front-end (LNA, downconvert, AGC, ADC) $\to$ acquisition $\to$ handover $\to$ concurrent DLL + FLL/Costas tracking $\to$ despread/demod $\to$ de-interleave/FEC.`,
      String.raw`The correlator is the easy last step; the receiver's real job is to deliver code-phase and carrier-phase alignment continuously against Doppler, drift, dynamics, multipath, and jamming.`,
      String.raw`Everything after the ADC is digital in an SDR: acquisition, tracking, and despreading are the same multiply-accumulate arithmetic reused at different rates.`,
      String.raw`The prompt correlator is shared: its I/Q both closes the carrier loop and, integrated over a symbol, is the data decision statistic.`,
      String.raw`The LNA (first stage) fixes the system noise figure and hence $C/N_0$; front-end noise cannot be recovered by later processing.`,
      String.raw`The ADC word length is set by the jammer, not the signal: about 6 dB of dynamic range per bit (SQNR $=6.02\,b+1.76$ dB), so a strong jammer needs many bits of headroom.`,
      String.raw`Handover requires the acquisition estimate to land inside the tracking pull-in region ($\sim\pm\tfrac12$ chip in code, within FLL range in frequency); it couples acquisition and tracking design.`,
      String.raw`Carrier aiding scales carrier-loop Doppler into the code NCO so the DLL can run a very narrow bandwidth (low jitter) while still tracking high dynamics.`,
      String.raw`Despreading gives output SNR $=N\times$ input SNR against interference; $G_p=10\log_{10}(R_c/R_b)$.`,
      String.raw`Jamming margin $M_j=G_p-(E_b/N_0)_{\text{req}}-L_{\text{sys}}$ (dB) is the concrete anti-jam payoff of the architecture.`,
      String.raw`In pure AWGN the despread BER equals plain BPSK at $E_b/N_0=(C/N_0)/R_b$: processing gain buys interference/jam/LPI margin, not thermal-noise BER.`,
      String.raw`Multipath paths are resolvable when separated by more than a chip ($T_c<\Delta\tau$, i.e. $R_c>1/\Delta\tau$); a narrowband signal cannot resolve them.`,
      String.raw`A RAKE receiver assigns a despread-and-integrate finger to each resolvable path and combines them by maximal-ratio combining; combined SNR $\gamma_{\text{MRC}}=\sum_l\gamma_l$.`,
      String.raw`For $L$ equal fingers, MRC gives an $L$-fold ($10\log_{10}L$ dB) SNR gain and multipath diversity; the finger count is roughly $\tau_{\text{spread}}/T_c$.`,
      String.raw`The CDMA near-far problem (a strong user's code cross-correlation swamping a weak one) is defeated by tight transmit power control, not by processing gain.`,
      String.raw`Chip rate and code length jointly set bandwidth, range resolution, RAKE finger count, processing gain, and acquisition time; loop bandwidth, integration time, and ADC bits complete the budget.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-receiver-design-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="300" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">End-to-end DSSS receiver: analog front-end, then all-digital baseband</text>
<!-- antenna -->
<line x1="24" y1="70" x2="24" y2="48" stroke="#9aa7b5" stroke-width="1.4"/>
<line x1="14" y1="42" x2="24" y2="48" stroke="#9aa7b5" stroke-width="1.4"/>
<line x1="34" y1="42" x2="24" y2="48" stroke="#9aa7b5" stroke-width="1.4"/>
<line x1="24" y1="70" x2="44" y2="70" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/>
<!-- RF front-end row -->
<rect x="44" y="56" width="46" height="28" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="55" y="74" fill="#e6edf3" font-size="11">LNA</text>
<line x1="90" y1="70" x2="106" y2="70" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/>
<circle cx="122" cy="70" r="13" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="116" y="75" fill="#ffa94d" font-size="13">$\times$</text>
<line x1="122" y1="98" x2="122" y2="83" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a1)"/>
<text x="108" y="112" fill="#9aa7b5" font-size="9">LO</text>
<line x1="135" y1="70" x2="150" y2="70" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/>
<rect x="150" y="56" width="46" height="28" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="161" y="74" fill="#e6edf3" font-size="11">AGC</text>
<line x1="196" y1="70" x2="212" y2="70" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/>
<rect x="212" y="56" width="46" height="28" fill="#1c232e" stroke="#63e6be" stroke-width="1.5"/><text x="221" y="74" fill="#e6edf3" font-size="11">ADC</text>
<text x="46" y="100" fill="#9aa7b5" font-size="9">analog RF front-end (sets noise figure and jammer headroom)</text>
<!-- drop into digital -->
<line x1="235" y1="84" x2="235" y2="140" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="235" y1="140" x2="40" y2="140" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="40" y1="140" x2="40" y2="160" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/>
<text x="250" y="132" fill="#9aa7b5" font-size="9">digital samples</text>
<!-- digital baseband row -->
<rect x="16" y="160" width="64" height="34" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/><text x="24" y="176" fill="#e6edf3" font-size="9">Acquisition</text><text x="28" y="188" fill="#9aa7b5" font-size="8">2-D search</text>
<line x1="80" y1="177" x2="96" y2="177" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/><text x="72" y="153" fill="#63e6be" font-size="8">handover</text>
<rect x="96" y="160" width="86" height="34" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.4"/><text x="104" y="176" fill="#e6edf3" font-size="9">Tracking</text><text x="104" y="188" fill="#9aa7b5" font-size="8">DLL + Costas</text>
<line x1="182" y1="177" x2="198" y2="177" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/>
<rect x="198" y="160" width="92" height="34" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="206" y="176" fill="#e6edf3" font-size="9">Despread</text><text x="206" y="188" fill="#9aa7b5" font-size="8">prompt $\int_0^{T_b}$</text>
<line x1="290" y1="177" x2="306" y2="177" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/>
<rect x="306" y="160" width="70" height="34" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="314" y="176" fill="#e6edf3" font-size="9">Decision</text><text x="320" y="188" fill="#9aa7b5" font-size="8">sgn(z)</text>
<line x1="376" y1="177" x2="392" y2="177" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/>
<rect x="392" y="160" width="86" height="34" fill="#1c232e" stroke="#63e6be" stroke-width="1.5"/><text x="400" y="176" fill="#e6edf3" font-size="9">De-intlv /</text><text x="400" y="188" fill="#e6edf3" font-size="9">FEC decode</text>
<line x1="478" y1="177" x2="500" y2="177" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a1)"/><text x="486" y="172" fill="#63e6be" font-size="9">data</text>
<!-- prompt shared feedback -->
<line x1="244" y1="194" x2="244" y2="220" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="244" y1="220" x2="139" y2="220" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="139" y1="220" x2="139" y2="194" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a1)"/>
<text x="150" y="234" fill="#9aa7b5" font-size="9">prompt I/Q feeds carrier loop AND data; carrier aids the code NCO</text>
<text x="16" y="262" fill="#9aa7b5" font-size="9">All blocks right of the ADC are digital (software-defined receiver): the same</text>
<text x="16" y="276" fill="#9aa7b5" font-size="9">multiply-accumulate arithmetic reused for search, tracking, and despreading.</text>
</svg>`,
        caption: 'End-to-end DSSS receiver architecture. The analog front-end (LNA, downconversion mixer with LO, AGC, ADC) sets sensitivity and jammer headroom; everything after the ADC is digital. Acquisition searches, hands over to concurrent DLL + Costas tracking, whose shared prompt correlator despreads (integrate-and-dump), feeds the decision and the carrier loop, and passes soft bits to de-interleave and FEC decode.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-receiver-design-a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="300" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">Acquisition-to-tracking handover and the shared prompt correlator</text>
<!-- Left: 2D search grid -->
<text x="40" y="46" fill="#ffa94d" font-size="11">Acquisition: open-loop 2-D search</text>
<line x1="40" y1="60" x2="40" y2="170" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="40" y1="170" x2="180" y2="170" stroke="#9aa7b5" stroke-width="1.1"/>
<text x="70" y="186" fill="#9aa7b5" font-size="9">code phase</text>
<text x="12" y="118" fill="#9aa7b5" font-size="9" transform="rotate(-90 12 118)">Doppler</text>
<!-- grid cells -->
<g stroke="#4dabf7" stroke-width="0.7" fill="none" opacity="0.55">
<rect x="48" y="66" width="20" height="20"/><rect x="68" y="66" width="20" height="20"/><rect x="88" y="66" width="20" height="20"/><rect x="108" y="66" width="20" height="20"/><rect x="128" y="66" width="20" height="20"/><rect x="148" y="66" width="20" height="20"/>
<rect x="48" y="86" width="20" height="20"/><rect x="68" y="86" width="20" height="20"/><rect x="88" y="86" width="20" height="20"/><rect x="108" y="86" width="20" height="20"/><rect x="128" y="86" width="20" height="20"/><rect x="148" y="86" width="20" height="20"/>
<rect x="48" y="106" width="20" height="20"/><rect x="68" y="106" width="20" height="20"/><rect x="88" y="106" width="20" height="20"/><rect x="108" y="106" width="20" height="20"/><rect x="128" y="106" width="20" height="20"/><rect x="148" y="106" width="20" height="20"/>
<rect x="48" y="126" width="20" height="20"/><rect x="68" y="126" width="20" height="20"/><rect x="88" y="126" width="20" height="20"/><rect x="108" y="126" width="20" height="20"/><rect x="128" y="126" width="20" height="20"/><rect x="148" y="126" width="20" height="20"/>
</g>
<rect x="88" y="106" width="20" height="20" fill="#63e6be" opacity="0.85"/>
<text x="84" y="150" fill="#63e6be" font-size="9">peak found</text>
<!-- handover arrow -->
<line x1="182" y1="116" x2="240" y2="116" stroke="#9aa7b5" stroke-width="1.6" marker-end="url(#dsss-receiver-design-a2)"/>
<text x="184" y="108" fill="#63e6be" font-size="9">handover</text>
<text x="184" y="132" fill="#9aa7b5" font-size="8">load NCOs</text>
<text x="184" y="143" fill="#9aa7b5" font-size="8">$\pm\tfrac12$ chip</text>
<!-- Right: closed loops -->
<text x="300" y="46" fill="#ff6b6b" font-size="11">Tracking: closed-loop steady state</text>
<rect x="300" y="60" width="120" height="30" fill="#1c232e" stroke="#b197fc" stroke-width="1.5"/><text x="308" y="79" fill="#e6edf3" font-size="10">Prompt correlator (I/Q)</text>
<line x1="360" y1="90" x2="360" y2="108" stroke="#9aa7b5" stroke-width="1.1"/>
<!-- split to three -->
<line x1="300" y1="108" x2="440" y2="108" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="315" y1="108" x2="315" y2="126" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a2)"/>
<line x1="360" y1="108" x2="360" y2="126" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a2)"/>
<line x1="425" y1="108" x2="425" y2="126" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a2)"/>
<rect x="286" y="126" width="60" height="30" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.3"/><text x="292" y="140" fill="#e6edf3" font-size="8">Code loop</text><text x="300" y="151" fill="#9aa7b5" font-size="8">DLL</text>
<rect x="352" y="126" width="70" height="30" fill="#1c232e" stroke="#4dabf7" stroke-width="1.3"/><text x="358" y="140" fill="#e6edf3" font-size="8">Carrier loop</text><text x="358" y="151" fill="#9aa7b5" font-size="8">FLL$\to$PLL</text>
<rect x="428" y="126" width="60" height="30" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/><text x="434" y="140" fill="#e6edf3" font-size="8">Data</text><text x="434" y="151" fill="#9aa7b5" font-size="8">sgn(I)</text>
<!-- carrier aiding arrow to code loop -->
<line x1="387" y1="156" x2="387" y2="168" stroke="#9aa7b5" stroke-width="1.0"/>
<line x1="387" y1="168" x2="316" y2="168" stroke="#9aa7b5" stroke-width="1.0"/>
<line x1="316" y1="168" x2="316" y2="156" stroke="#9aa7b5" stroke-width="1.0" marker-end="url(#dsss-receiver-design-a2)"/>
<text x="300" y="182" fill="#63e6be" font-size="8">carrier aiding</text>
<text x="40" y="212" fill="#9aa7b5" font-size="9">Acquisition parks the loops within the pull-in region; tracking then corrects (does not</text>
<text x="40" y="226" fill="#9aa7b5" font-size="9">search). The single prompt correlator both closes the carrier loop and forms the data bit,</text>
<text x="40" y="240" fill="#9aa7b5" font-size="9">while carrier aiding offloads dynamics from the code loop so the DLL can run narrow-band.</text>
<text x="40" y="266" fill="#9aa7b5" font-size="9">A finer search hands over more accurately (eases tracking) but costs more acquisition time —</text>
<text x="40" y="280" fill="#9aa7b5" font-size="9">so the code/Doppler uncertainty is split jointly between search and pull-in.</text>
</svg>`,
        caption: 'Acquisition-to-tracking handover. Acquisition is a coarse open-loop 2-D search over code phase and Doppler; on detection it loads the tracking NCOs within about half a chip. Steady-state tracking then runs closed loops that correct rather than search. The shared prompt correlator both closes the carrier loop and produces the data decision, and carrier aiding offloads dynamics to let the DLL run narrow-band.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 290" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-receiver-design-a3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="290" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">RAKE receiver: one despreading finger per resolvable multipath, MRC combined</text>
<line x1="12" y1="120" x2="52" y2="120" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#dsss-receiver-design-a3)"/>
<text x="10" y="112" fill="#9aa7b5" font-size="10">$r(t)$</text>
<circle cx="60" cy="120" r="5" fill="#9aa7b5"/>
<!-- split lines to 3 fingers -->
<line x1="60" y1="120" x2="60" y2="58" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="60" y1="120" x2="60" y2="182" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="60" y1="58" x2="86" y2="58" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<line x1="60" y1="120" x2="86" y2="120" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<line x1="60" y1="182" x2="86" y2="182" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<!-- finger 1 -->
<rect x="86" y="42" width="120" height="32" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/><text x="94" y="56" fill="#e6edf3" font-size="9">despread @ $\tau_1$</text><text x="94" y="68" fill="#9aa7b5" font-size="8">$\int_0^{T_b}$ (finger 1)</text>
<rect x="86" y="104" width="120" height="32" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="94" y="118" fill="#e6edf3" font-size="9">despread @ $\tau_2$</text><text x="94" y="130" fill="#9aa7b5" font-size="8">$\int_0^{T_b}$ (finger 2)</text>
<rect x="86" y="166" width="120" height="32" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.4"/><text x="94" y="180" fill="#e6edf3" font-size="9">despread @ $\tau_3$</text><text x="94" y="192" fill="#9aa7b5" font-size="8">$\int_0^{T_b}$ (finger 3)</text>
<!-- weights -->
<line x1="206" y1="58" x2="230" y2="58" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<line x1="206" y1="120" x2="230" y2="120" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<line x1="206" y1="182" x2="230" y2="182" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<circle cx="244" cy="58" r="14" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="235" y="62" fill="#e6edf3" font-size="11">$\times$</text><text x="232" y="40" fill="#b197fc" font-size="9">$w_1$</text>
<circle cx="244" cy="120" r="14" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="235" y="124" fill="#e6edf3" font-size="11">$\times$</text><text x="232" y="102" fill="#b197fc" font-size="9">$w_2$</text>
<circle cx="244" cy="182" r="14" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="235" y="186" fill="#e6edf3" font-size="11">$\times$</text><text x="232" y="210" fill="#b197fc" font-size="9">$w_3$</text>
<text x="214" y="230" fill="#9aa7b5" font-size="8">$w_l\propto h_l^{*}$ (MRC weights)</text>
<!-- combiner -->
<line x1="258" y1="58" x2="330" y2="106" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<line x1="258" y1="120" x2="330" y2="120" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<line x1="258" y1="182" x2="330" y2="134" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-design-a3)"/>
<circle cx="346" cy="120" r="16" fill="#1c232e" stroke="#63e6be" stroke-width="1.6"/><text x="339" y="125" fill="#e6edf3" font-size="14">$\sum$</text>
<text x="330" y="150" fill="#63e6be" font-size="9">MRC combine</text>
<line x1="362" y1="120" x2="392" y2="120" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a3)"/>
<rect x="392" y="104" width="70" height="32" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="400" y="124" fill="#e6edf3" font-size="10">decision</text>
<line x1="462" y1="120" x2="486" y2="120" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-design-a3)"/><text x="470" y="114" fill="#63e6be" font-size="9">bit</text>
<text x="30" y="258" fill="#9aa7b5" font-size="9">Paths are resolvable when separated by more than a chip ($T_c<\Delta\tau$). Each finger despreads one</text>
<text x="30" y="272" fill="#9aa7b5" font-size="9">echo; maximal-ratio combining co-phases and weights them, so combined SNR $=\sum_l\gamma_l$ (diversity gain).</text>
</svg>`,
        caption: 'RAKE receiver. Because the DSSS autocorrelation peak is only one chip wide, echoes separated by more than a chip are resolvable. Each finger is an independent despread-and-integrate locked to one path delay; maximal-ratio combining weights each finger by the conjugate channel gain and sums, giving combined SNR equal to the sum of the finger SNRs and turning multipath into diversity.'
      }
    ],
    equations: [
      {
        title: 'Processing gain of the receiver',
        tex: String.raw`$$ G_p=10\log_{10}N=10\log_{10}\!\left(\frac{B_{ss}}{R_b}\right)=10\log_{10}\!\left(\frac{R_c}{R_b}\right) $$`,
        derivation: String.raw`<p><b>Where we start.</b> The transmitter spreads a data stream of rate $R_b$ (bandwidth $\approx R_b$) with a PN code of chip rate $R_c$, producing an occupied spread bandwidth $B_{ss}\approx R_c$. The number of chips per bit is $N=R_c/R_b=B_{ss}/R_b$, which is the bandwidth expansion factor the receiver will later collapse.</p>
<p><b>Step 1.</b> On despreading, the receiver multiplies by the aligned code and integrates. The wanted signal, matched to the code, re-concentrates into the data bandwidth $R_b$ with its power preserved, while any uncoded interferer is smeared across $B_{ss}$. Only the fraction $R_b/B_{ss}=1/N$ of the interferer's power remains in the post-correlation data band.</p>
<p><b>Step 2.</b> The signal-to-interference ratio therefore improves by the linear factor $N$. Engineering budgets are done in decibels, so take $10\log_{10}$ of that factor: $G_p=10\log_{10}N$.</p>
<p><b>Result.</b> $G_p=10\log_{10}N=10\log_{10}(B_{ss}/R_b)=10\log_{10}(R_c/R_b)$. One ratio of two clock rates governs the whole extraction budget: it is simultaneously the spreading factor, the interference-suppression figure in dB, and (through $N=R_c/R_b$) the coupling between chip rate and data rate that every other receiver parameter is sized against. For example $R_c=10$ Mcps and $R_b=10$ kbps give $N=1000$ and $G_p=30$ dB.</p>`
      },
      {
        title: 'Despread output SNR gain',
        tex: String.raw`$$ \mathrm{SNR}_{\text{out}}=N\cdot\mathrm{SNR}_{\text{in}},\qquad N=\frac{R_c}{R_b} $$`,
        derivation: String.raw`<p><b>Where we start.</b> At the despreader input the wanted signal has power $S$ spread over $\approx R_c$, and a narrowband interferer has power $J$ concentrated in a bandwidth much less than $R_c$. The input ratio, measured over the wide band, is $\mathrm{SNR}_{\text{in}}=S/J$.</p>
<p><b>Step 1.</b> Despreading multiplies everything by the time-aligned code $c(t)$, with $c^2(t)=1$. The signal, coded identically to the replica, correlates with itself and re-concentrates into the data bandwidth $R_b$ with power $S$ intact.</p>
<p><b>Step 2.</b> The uncoded interferer is multiplied by the fast code and thereby spread over $\approx R_c$. Only the portion falling in the post-correlation data band $R_b$ affects the decision, namely $J_{\text{eff}}\approx J\,(R_b/R_c)=J/N$.</p>
<p><b>Result.</b> $\mathrm{SNR}_{\text{out}}=S/J_{\text{eff}}=S/(J/N)=N\,(S/J)=N\cdot\mathrm{SNR}_{\text{in}}$. The signal is preserved while the interferer is diluted by $N$, so the ratio improves by exactly the processing gain. This is why a receiver can accept a signal that sits below the interferer at its input and still demodulate it — but note the mechanism is dilution of <em>interference</em>; against white thermal noise, which stays white under multiplication by $\pm1$, there is no such gain.</p>`
      },
      {
        title: 'Jamming margin',
        tex: String.raw`$$ M_j=G_p-\left(\frac{E_b}{N_0}\right)_{\text{req}}-L_{\text{sys}}\quad[\text{dB}] $$`,
        derivation: String.raw`<p><b>Where we start.</b> A jammer of received power $J$ competes with signal power $S$ at the receiver. Despreading spreads the uncoded jammer over the chip bandwidth so only about $1/N$ of its power reaches the decision, while the demodulator still requires a minimum $(E_b/N_0)_{\text{req}}$ to hit its target BER.</p>
<p><b>Step 1.</b> After despreading, the effective jammer-to-signal ratio at the decision is reduced by the processing gain $G_p$. Written in dB, the receiver has $G_p$ decibels of suppression headroom available to fight the jammer.</p>
<p><b>Step 2.</b> From that headroom, first reserve what the demodulator must keep to close the link, $(E_b/N_0)_{\text{req}}$, and then subtract implementation and system losses $L_{\text{sys}}$ (filtering, quantization, imperfect synchronization, correlator losses). What is left is the tolerable jammer-to-signal excess.</p>
<p><b>Result.</b> $M_j=G_p-(E_b/N_0)_{\text{req}}-L_{\text{sys}}$ (dB) is the jamming margin — the number of decibels by which the jammer may exceed the signal at the receiver while the link still closes. Example: $G_p=30$ dB, required $E_b/N_0=10$ dB, $L_{\text{sys}}=2$ dB give $M_j=18$ dB. This single number, produced by the whole acquire-track-despread chain, is the quantified anti-jam specification the architecture is built to meet.</p>`
      },
      {
        title: 'Post-despread Eb/N0 from C/N0',
        tex: String.raw`$$ \frac{E_b}{N_0}=\frac{C/N_0}{R_b} $$`,
        derivation: String.raw`<p><b>Where we start.</b> The front-end fixes the received carrier power $C$ and the one-sided noise power spectral density $N_0$ (watts/Hz), hence the carrier-to-noise-density ratio $C/N_0$ (a rate, quoted in dB-Hz). The energy collected per bit is the power multiplied by the time spent per bit, $E_b=C\,T_b$.</p>
<p><b>Step 1.</b> Substitute $T_b=1/R_b$: $E_b=C/R_b$. This is exactly what the integrate-and-dump performs — accumulating the carrier power over one bit duration builds the bit energy, coherently summing the $N$ chips.</p>
<p><b>Step 2.</b> Divide by the noise density $N_0$ to form the normalized ratio the demodulator cares about: $E_b/N_0=(C/R_b)/N_0=(C/N_0)/R_b$. Note the chip rate $R_c$ does not appear anywhere.</p>
<p><b>Result.</b> $E_b/N_0=(C/N_0)/R_b$; in dB, $(E_b/N_0)_{\text{dB}}=(C/N_0)_{\text{dB-Hz}}-10\log_{10}R_b$. Because spreading and despreading cancel for white noise, only the data rate sets the thermal-noise $E_b/N_0$ — this is the mathematical basis of the "no AWGN gain from spreading" rule, and it tells the designer that sensitivity is bought with a lower data rate or a higher $C/N_0$, never with more chip rate.</p>`
      },
      {
        title: 'Mean acquisition time (serial search)',
        tex: String.raw`$$ \overline{T}_{\text{acq}}=\frac{2-P_d}{2P_d}\,(1+K\,P_{fa})\,q\,T_d $$`,
        derivation: String.raw`<p><b>Where we start.</b> A serial-search acquisition tests code/Doppler cells one at a time. There are $q$ cells to examine, each dwelt on for $T_d$ seconds; the probability of correctly detecting the signal when its cell is tested is $P_d$, the false-alarm probability in a wrong cell is $P_{fa}$, and each false alarm costs a verification penalty of $K$ dwell times before the search resumes.</p>
<p><b>Step 1.</b> Count cells examined. If detection were certain ($P_d=1$) the search would visit on average half of the $q$ cells before hitting the right one, i.e. $\approx q/2$. Missed detections ($P_d<1$) force additional full sweeps; summing the geometric series of repeated sweeps inflates the average number of tested cells to $\dfrac{2-P_d}{2P_d}\,q$, which correctly reduces to $q/2$ when $P_d=1$ and grows as $P_d$ falls.</p>
<p><b>Step 2.</b> Cost per examined cell. Each tested cell costs one dwell $T_d$, plus, whenever a false alarm occurs (probability $P_{fa}$), an extra penalty of $K\,T_d$. The expected cost per cell is therefore $T_d(1+K\,P_{fa})$.</p>
<p><b>Result.</b> Multiplying the average number of cells by the expected cost per cell gives $\overline{T}_{\text{acq}}=\dfrac{2-P_d}{2P_d}(1+K\,P_{fa})\,q\,T_d$. It shows the designer's levers directly: fewer cells $q$ (shorter code or a parallel/FFT search), higher $P_d$ (longer or more sensitive dwell), and lower $P_{fa}$ (higher threshold) all cut acquisition time — but a higher threshold lowers $P_d$, so threshold setting is itself a trade inside this formula.</p>`
      },
      {
        title: 'RAKE combined SNR (maximal-ratio combining)',
        tex: String.raw`$$ \gamma_{\text{MRC}}=\sum_{l=1}^{L}\gamma_l,\qquad \gamma_l=\frac{|h_l|^2 E_b}{N_0} $$`,
        derivation: String.raw`<p><b>Where we start.</b> In a multipath channel the wideband DSSS signal arrives as $L$ resolvable echoes; finger $l$ despreads path $l$ and outputs a copy of the symbol scaled by complex channel gain $h_l$ with additive noise of power $N_0$ (equal per finger). We combine the fingers linearly with weights $w_l$: $z=\sum_l w_l\,y_l$, and ask which weights maximize the output SNR.</p>
<p><b>Step 1.</b> The combined signal amplitude is $\sum_l w_l h_l\sqrt{E_b}$ and the combined noise power is $N_0\sum_l|w_l|^2$. The output SNR is $\gamma=\dfrac{E_b\,|\sum_l w_l h_l|^2}{N_0\sum_l|w_l|^2}$.</p>
<p><b>Step 2.</b> By the Cauchy-Schwarz inequality, $|\sum_l w_l h_l|^2\le(\sum_l|w_l|^2)(\sum_l|h_l|^2)$, with equality when $w_l\propto h_l^{*}$ (co-phase each finger and weight it by its own strength). Choosing those maximal-ratio weights makes the bound tight.</p>
<p><b>Result.</b> $\gamma_{\text{MRC}}=\dfrac{E_b}{N_0}\sum_l|h_l|^2=\sum_l\gamma_l$: the combined SNR is exactly the <em>sum</em> of the individual finger SNRs. For $L$ equal fingers ($\gamma_l=\gamma_0$) this is $\gamma=L\gamma_0$, a $10\log_{10}L$ dB array gain, and because the fingers fade independently it also delivers diversity — the receiver harvests the multipath energy the channel scattered rather than suffering it.</p>`
      },
      {
        title: 'ADC dynamic range vs jammer-to-signal ratio',
        tex: String.raw`$$ D=6.02\,b+1.76\ [\text{dB}]\ \Longrightarrow\ b\ \gtrsim\ \frac{\mathrm{JSR}+H}{6.02} $$`,
        derivation: String.raw`<p><b>Where we start.</b> An ideal $b$-bit ADC driven by a full-scale sinusoid has a signal-to-quantization-noise ratio (its usable dynamic range) of $D=6.02\,b+1.76$ dB. In a DSSS receiver the wanted signal sits below the noise, so the converter must instead accommodate the strongest interferer without clipping while still leaving the tiny signal above the quantization floor.</p>
<p><b>Step 1.</b> Set the required dynamic range. The converter must span the jammer-to-signal ratio $\mathrm{JSR}$ (dB) plus a headroom $H$ that covers the signal's own margin above quantization noise, the noise floor, and the crest factor of the composite waveform: $D_{\text{req}}=\mathrm{JSR}+H$.</p>
<p><b>Step 2.</b> Equate available to required dynamic range and solve for bits: $6.02\,b+1.76\ge \mathrm{JSR}+H$, so $b\ge(\mathrm{JSR}+H-1.76)/6.02$. Dropping the $1.76$ offset gives the engineering rule of thumb $b\approx(\mathrm{JSR}+H)/6$ — roughly one extra bit per 6 dB of interference.</p>
<p><b>Result.</b> $b\gtrsim(\mathrm{JSR}+H)/6.02$. A receiver specified to survive a jammer $30$ dB above the signal, with, say, $10$ dB of headroom, needs $D_{\text{req}}=40$ dB, hence $b\ge(40-1.76)/6.02\approx6.4\to7$ bits — even though the signal alone would need one or two. This is why anti-jam DSSS front-ends use many more ADC bits than a naive signal-only calculation suggests: the bits are for the jammer, not the message.</p>`
      },
      {
        title: 'Chip rate to resolve multipath',
        tex: String.raw`$$ T_c\le\Delta\tau\ \Longleftrightarrow\ R_c\ge\frac{1}{\Delta\tau},\qquad L_{\text{res}}\approx\left\lfloor\frac{\tau_{\text{spread}}}{T_c}\right\rfloor=\lfloor\tau_{\text{spread}}R_c\rfloor $$`,
        derivation: String.raw`<p><b>Where we start.</b> The despread output is a correlation against the code, whose autocorrelation peak is a triangle only $\pm1$ chip wide. Two multipath echoes separated in delay by $\Delta\tau$ appear as two such triangles; they are distinguishable only if their peaks do not overlap into one blur.</p>
<p><b>Step 1.</b> Two triangles of half-width one chip are resolvable when their separation exceeds a chip duration: $\Delta\tau\ge T_c$. Equivalently, since $T_c=1/R_c$, the chip rate must satisfy $R_c\ge 1/\Delta\tau$. A narrowband signal (large $T_c$) cannot meet this and its echoes merge into fading.</p>
<p><b>Step 2.</b> Count how many resolvable paths a channel of total delay spread $\tau_{\text{spread}}$ offers: divide the spread by the chip duration, $L_{\text{res}}\approx\tau_{\text{spread}}/T_c=\tau_{\text{spread}}R_c$ (floored to an integer). Each such path can be assigned a RAKE finger.</p>
<p><b>Result.</b> $R_c\ge1/\Delta\tau$ sets the minimum chip rate to separate two paths, and $L_{\text{res}}\approx\lfloor\tau_{\text{spread}}R_c\rfloor$ sets how many RAKE fingers (hence how much diversity) the design can harvest. Range/delay resolution is $c\,T_c=c/R_c$; for GPS at $R_c=1.023$ Mcps this is about $293$ m, so paths closer than that are unresolvable. Higher chip rate buys finer resolution and more fingers, at the cost of bandwidth and ADC speed.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What are the stages of a complete DSSS receiver, in order?`, back: String.raw`RF front-end (LNA $\to$ downconvert $\to$ AGC $\to$ ADC) $\to$ acquisition $\to$ handover $\to$ concurrent DLL + FLL/Costas tracking $\to$ despread/demod $\to$ de-interleave/FEC decode.` },
      { front: String.raw`Why is a receiver more than a correlator?`, back: String.raw`The correlator only works if handed a signal aligned in code phase (fraction of a chip) and carrier phase; supplying that continuously against Doppler, drift, dynamics, multipath and jamming is the receiver's real job.` },
      { front: String.raw`What sets receiver sensitivity, and where?`, back: String.raw`The LNA (first stage) sets the system noise figure and hence $C/N_0$; by Friis' formula the first stage dominates, so front-end noise cannot be recovered later.` },
      { front: String.raw`What sizes the ADC word length in a DSSS receiver?`, back: String.raw`The largest interferer, not the signal: about 6 dB of dynamic range per bit (SQNR $=6.02\,b+1.76$ dB), so a strong jammer needs many bits of headroom even though the signal needs 1-2.` },
      { front: String.raw`What must the acquisition-to-tracking handover achieve?`, back: String.raw`Land the code phase within the DLL pull-in region ($\sim\pm\tfrac12$ chip) and the residual Doppler within the FLL range, then confirm lock before trusting data.` },
      { front: String.raw`What are the two jobs of the prompt correlator?`, back: String.raw`It closes the carrier loop (Costas/FLL discriminators from its I/Q) and, integrated over a symbol, is the data decision statistic — one correlator, two consumers.` },
      { front: String.raw`What is carrier aiding and why is it a design win?`, back: String.raw`Feeding scaled carrier-loop Doppler into the code NCO offloads dynamics from the DLL, letting it run a very narrow bandwidth for low jitter while still tracking high dynamics.` },
      { front: String.raw`Coherent vs non-coherent receiver structure?`, back: String.raw`Coherent locks carrier phase (Costas/PLL) so data lands on I: lowest BER, needs good $C/N_0$/low dynamics. Non-coherent (FLL, envelope) tolerates phase error/dynamics but pays squaring loss.` },
      { front: String.raw`Give the processing-gain and jamming-margin formulas.`, back: String.raw`$G_p=10\log_{10}(R_c/R_b)$; $M_j=G_p-(E_b/N_0)_{\text{req}}-L_{\text{sys}}$ dB.` },
      { front: String.raw`Does the receiver get AWGN BER gain from spreading?`, back: String.raw`No. In pure AWGN, despread BER equals plain BPSK at $E_b/N_0=(C/N_0)/R_b$; processing gain buys interference/jam/LPI margin only.` },
      { front: String.raw`When are two multipath echoes resolvable?`, back: String.raw`When their delay separation exceeds one chip, $T_c<\Delta\tau$ (i.e. $R_c>1/\Delta\tau$); the autocorrelation peak is only $\pm1$ chip wide, so a narrowband signal cannot resolve them.` },
      { front: String.raw`What does a RAKE receiver do?`, back: String.raw`Assigns one despread-and-integrate finger per resolvable path delay, then combines them by maximal-ratio combining to turn multipath into diversity.` },
      { front: String.raw`State the maximal-ratio combined SNR.`, back: String.raw`$\gamma_{\text{MRC}}=\sum_{l=1}^{L}\gamma_l$ with weights $w_l\propto h_l^{*}$; for $L$ equal fingers it is an $L$-fold ($10\log_{10}L$ dB) gain plus diversity.` },
      { front: String.raw`What is the near-far problem and its fix?`, back: String.raw`In CDMA, non-zero code cross-correlation lets a strong nearby user swamp a weak far one; the fix is tight closed-loop transmit power control, not processing gain.` },
      { front: String.raw`How do chip rate and code length shape the design?`, back: String.raw`Chip rate sets bandwidth, range resolution ($c/R_c$), and RAKE finger count; code length sets processing gain, cross-correlation floor, and acquisition cells; together they set acquisition time and $G_p$.` },
      { front: String.raw`Name three despreading/acquisition implementations.`, back: String.raw`Matched-filter/correlator bank (parallel, fast, more hardware), serial correlator (minimal hardware, slow), and FFT-based circular correlation (modern accelerator); in an SDR all are digital.` },
      { front: String.raw`Which effects appear only at the whole-receiver level?`, back: String.raw`Resolvable multipath (answered by RAKE + MRC) and the CDMA near-far problem (answered by power control) — a single correlator never sees either.` }
    ],
    mcqs: [
      { q: String.raw`The overall purpose of DSSS receiver design is to:`, options: [String.raw`generate the spreading code`, String.raw`integrate front-end, acquisition, tracking and despreading so a buried signal is recovered and interference rejected`, String.raw`increase the transmit power`, String.raw`replace forward error correction`], answer: 1, explain: String.raw`The receiver's value comes from the cooperation of its blocks, not any single one; design wires and balances them so the link closes.` },
      { q: String.raw`Which orders the receiver signal chain correctly?`, options: [String.raw`ADC $\to$ LNA $\to$ tracking $\to$ acquisition $\to$ FEC`, String.raw`LNA $\to$ downconvert $\to$ AGC $\to$ ADC $\to$ acquisition $\to$ tracking $\to$ despread $\to$ FEC`, String.raw`acquisition $\to$ LNA $\to$ despread $\to$ ADC $\to$ tracking`, String.raw`despread $\to$ tracking $\to$ acquisition $\to$ ADC $\to$ LNA`], answer: 1, explain: String.raw`The analog front-end (LNA, downconvert, AGC, ADC) precedes the digital acquisition, tracking, despreading, and decoding.` },
      { q: String.raw`In a DSSS front-end, the ADC word length is set primarily by:`, options: [String.raw`the wanted signal amplitude`, String.raw`the strongest interferer/jammer plus headroom (~6 dB per bit)`, String.raw`the data rate`, String.raw`the FEC code rate`], answer: 1, explain: String.raw`The signal is below the noise, so the converter is sized to span the jammer without clipping while keeping the signal above quantization noise.` },
      { q: String.raw`Acquisition differs from tracking in that acquisition is:`, options: [String.raw`a closed-loop correction`, String.raw`a coarse open-loop 2-D search over code phase and Doppler`, String.raw`the data demodulator`, String.raw`the FEC decoder`], answer: 1, explain: String.raw`Acquisition searches a grid and declares detection; tracking is the closed loop that then corrects residual error.` },
      { q: String.raw`For a clean handover, the acquisition estimate must land:`, options: [String.raw`anywhere in the code period`, String.raw`inside the tracking loops' pull-in region (about $\pm\tfrac12$ chip, within FLL range)`, String.raw`exactly on the carrier phase`, String.raw`outside the linear region`], answer: 1, explain: String.raw`Only if the loops start inside their pull-in region can the discriminators drive the error to zero.` },
      { q: String.raw`The prompt correlator in the receiver:`, options: [String.raw`is used only for the code loop`, String.raw`both closes the carrier loop and forms the data decision statistic`, String.raw`is used only for data`, String.raw`generates the local oscillator`], answer: 1, explain: String.raw`Its I/Q drives the carrier discriminators and, integrated over a symbol, is the demodulated bit.` },
      { q: String.raw`Carrier aiding of the code loop allows the DLL to:`, options: [String.raw`skip acquisition`, String.raw`use a very narrow bandwidth (low jitter) while still tracking dynamics`, String.raw`ignore the prompt correlator`, String.raw`increase the data rate`], answer: 1, explain: String.raw`The carrier loop supplies the Doppler, offloading dynamics so the code loop can run narrow-band and quiet.` },
      { q: String.raw`Over a pure AWGN channel, a DSSS receiver's BER compared with plain BPSK at the same $E_b/N_0$ is:`, options: [String.raw`better by $G_p$ dB`, String.raw`the same`, String.raw`worse by $G_p$ dB`, String.raw`always zero`], answer: 1, explain: String.raw`Spreading then despreading is lossless for white noise; processing gain buys interference/jam/LPI margin, not AWGN BER.` },
      { q: String.raw`Two multipath echoes are resolvable by a DSSS receiver when they are separated by:`, options: [String.raw`less than a chip`, String.raw`more than one chip ($T_c<\Delta\tau$)`, String.raw`exactly one symbol`, String.raw`any amount`], answer: 1, explain: String.raw`The autocorrelation peak is $\pm1$ chip wide, so echoes must be more than a chip apart to appear as separate peaks.` },
      { q: String.raw`A RAKE receiver's maximal-ratio combined SNR equals:`, options: [String.raw`the strongest finger's SNR`, String.raw`the sum of the finger SNRs $\sum_l\gamma_l$`, String.raw`the average finger SNR`, String.raw`the weakest finger's SNR`], answer: 1, explain: String.raw`With weights $w_l\propto h_l^{*}$, Cauchy-Schwarz gives combined SNR equal to the sum of per-finger SNRs.` },
      { q: String.raw`The CDMA near-far problem is best solved by:`, options: [String.raw`increasing the processing gain`, String.raw`tight transmit power control`, String.raw`a wider loop bandwidth`, String.raw`more ADC bits`], answer: 1, explain: String.raw`The interferer is another coded user whose leakage is set by code cross-correlation; equalizing received powers removes the imbalance.` },
      { q: String.raw`Roughly how many ADC bits does each additional 6 dB of jammer headroom require?`, options: [String.raw`about one bit`, String.raw`about four bits`, String.raw`about eight bits`, String.raw`none`], answer: 0, explain: String.raw`From SQNR $=6.02\,b+1.76$ dB, one bit provides about 6 dB of dynamic range.` },
      { q: String.raw`The mean serial-search acquisition time $\overline{T}_{\text{acq}}$ grows most directly with:`, options: [String.raw`the data rate`, String.raw`the number of search cells $q$ and dwell time $T_d$`, String.raw`the FEC code rate`, String.raw`the ADC bits`], answer: 1, explain: String.raw`$\overline{T}_{\text{acq}}=\tfrac{2-P_d}{2P_d}(1+KP_{fa})\,q\,T_d$, so more cells or longer dwells lengthen acquisition.` }
    ],
    numericals: [
      {
        q: String.raw`An IS-95-style DSSS link uses chip rate $R_c=1.2288$ Mcps and data rate $R_b=9.6$ kbps. The demodulator needs $(E_b/N_0)_{\text{req}}=7$ dB for the target BER and the receiver has $L_{\text{sys}}=2$ dB of losses. Find the processing gain $G_p$ and the jamming margin $M_j$.`,
        solution: String.raw`<p><b>Formula.</b> $$ N=\frac{R_c}{R_b},\quad G_p=10\log_{10}N,\quad M_j=G_p-\left(\frac{E_b}{N_0}\right)_{\text{req}}-L_{\text{sys}}. $$</p>
<p><b>Substitute.</b> $N=\dfrac{1.2288\times10^6}{9.6\times10^3}=128$; $G_p=10\log_{10}(128)$; then $M_j=G_p-7-2$.</p>
<p><b>Compute.</b> $\log_{10}128=2.107$, so $G_p=10\times2.107=\mathbf{21.07\ \text{dB}}$. Then $M_j=21.07-7-2=\mathbf{12.07\ \text{dB}}$.</p>
<p><b>Explanation.</b> Each 9.6 kbps bit is spread over 128 chips, giving about 21 dB of interference suppression. After reserving 7 dB for the demodulator and 2 dB for losses, a jammer may be up to 12.1 dB stronger than the signal at the receiver and the link still closes. That 12 dB is anti-jam margin, not any improvement against thermal noise.</p>`
      },
      {
        q: String.raw`A RAKE receiver has $L=4$ resolvable fingers, each with per-finger SNR $\gamma_l=5$ dB. Assuming maximal-ratio combining, find the combined SNR and the combining (array) gain over a single finger.`,
        solution: String.raw`<p><b>Formula.</b> $$ \gamma_{\text{MRC}}=\sum_{l=1}^{L}\gamma_l=L\,\gamma_0\ \text{(equal fingers)},\qquad \text{gain}=10\log_{10}L. $$ SNRs add in linear units, so convert from dB first.</p>
<p><b>Substitute.</b> $\gamma_0=10^{5/10}=3.162$ (linear); $\gamma_{\text{MRC}}=4\times3.162$; gain $=10\log_{10}4$.</p>
<p><b>Compute.</b> $\gamma_{\text{MRC}}=12.65$ (linear) $=10\log_{10}(12.65)=\mathbf{11.02\ \text{dB}}$; combining gain $=10\log_{10}4=\mathbf{6.02\ \text{dB}}$ (so $5+6.02=11.02$ dB).</p>
<p><b>Explanation.</b> Combining four equal echoes lifts the SNR from 5 dB to 11.0 dB — the sum of the finger SNRs in linear units, a factor-of-four (6.02 dB) array gain. Beyond the raw SNR increase, because the paths fade independently the RAKE also delivers diversity, sharply reducing the chance that all fingers fade at once.</p>`
      },
      {
        q: String.raw`A serial-search acquisition scans $q=2046$ code-phase cells with dwell $T_d=1$ ms, detection probability $P_d=0.9$, false-alarm probability $P_{fa}=0.01$, and a false-alarm penalty of $K=100$ dwells. Find the mean acquisition time.`,
        solution: String.raw`<p><b>Formula.</b> $$ \overline{T}_{\text{acq}}=\frac{2-P_d}{2P_d}\,(1+K\,P_{fa})\,q\,T_d. $$</p>
<p><b>Substitute.</b> $\dfrac{2-0.9}{2\times0.9}=\dfrac{1.1}{1.8}=0.6111$; $(1+100\times0.01)=(1+1)=2$; $q\,T_d=2046\times10^{-3}=2.046$ s.</p>
<p><b>Compute.</b> $\overline{T}_{\text{acq}}=0.6111\times2\times2.046=0.6111\times4.092=\mathbf{2.50\ \text{s}}$.</p>
<p><b>Explanation.</b> Even for a single Doppler bin, scanning 2046 half-chip cells one at a time averages about 2.5 s to acquire. Adding Doppler bins multiplies $q$ and the time proportionally, which is exactly why real receivers use parallel or FFT-based acquisition to slash $q$ and why longer codes (more cells) cost more acquisition time.</p>`
      },
      {
        q: String.raw`At the despreader input the signal sits $13$ dB below a narrowband interferer, i.e. $\mathrm{SNR}_{\text{in}}=-13$ dB. The processing gain is $G_p=30$ dB. Find the output SNR against that interferer.`,
        solution: String.raw`<p><b>Formula.</b> $$ \mathrm{SNR}_{\text{out}}[\text{dB}]=\mathrm{SNR}_{\text{in}}[\text{dB}]+G_p[\text{dB}], $$ since $\mathrm{SNR}_{\text{out}}=N\cdot\mathrm{SNR}_{\text{in}}$ and multiplication becomes addition in dB.</p>
<p><b>Substitute.</b> $\mathrm{SNR}_{\text{out}}=-13+30$.</p>
<p><b>Compute.</b> $\mathrm{SNR}_{\text{out}}=\mathbf{17\ \text{dB}}$ (equivalently, $N=10^{3}=1000$, and $10^{-1.3}\times1000=0.0501\times1000=50.1\to17.0$ dB).</p>
<p><b>Explanation.</b> Despreading lifts a signal that started 13 dB below the interferer to 17 dB above it — a 30 dB swing equal to the processing gain. This is the mechanism by which a DSSS receiver recovers a signal buried under narrowband interference; note it applies to interference, not to white thermal noise.</p>`
      },
      {
        q: String.raw`A DSSS receiver must survive a jammer $30$ dB above the signal (JSR $=30$ dB) and the designer allows $10$ dB of headroom for signal margin, noise floor, and crest factor. Using the full-scale ADC relation $D=6.02\,b+1.76$ dB, find the minimum number of ADC bits.`,
        solution: String.raw`<p><b>Formula.</b> $$ D_{\text{req}}=\mathrm{JSR}+H,\qquad 6.02\,b+1.76\ge D_{\text{req}}\ \Rightarrow\ b\ge\frac{D_{\text{req}}-1.76}{6.02}. $$</p>
<p><b>Substitute.</b> $D_{\text{req}}=30+10=40$ dB; $b\ge\dfrac{40-1.76}{6.02}=\dfrac{38.24}{6.02}$.</p>
<p><b>Compute.</b> $b\ge6.35$, so round up to $\mathbf{7\ \text{bits}}$.</p>
<p><b>Explanation.</b> A 7-bit ADC spans the 40 dB of required dynamic range (about 6 dB per bit) so the 30 dB jammer does not clip while the weak signal stays above the quantization floor. The message itself would need only one or two bits; the extra bits exist entirely to give the jammer headroom, and if the jammer clips the ADC the processing gain is lost before despreading can help.</p>`
      },
      {
        q: String.raw`An urban channel has resolvable multipath components separated by $\Delta\tau=0.8\ \mu\text{s}$. Find the minimum chip rate needed to resolve them and the corresponding range resolution.`,
        solution: String.raw`<p><b>Formula.</b> $$ R_c\ge\frac{1}{\Delta\tau}\quad(\text{since }T_c\le\Delta\tau),\qquad \Delta r=c\,T_c=\frac{c}{R_c}. $$ Use $c=3\times10^8$ m/s.</p>
<p><b>Substitute.</b> $R_c\ge\dfrac{1}{0.8\times10^{-6}}$; at that minimum, $\Delta r=c\times0.8\times10^{-6}$.</p>
<p><b>Compute.</b> $R_c\ge1.25\times10^{6}=\mathbf{1.25\ \text{Mcps}}$; $\Delta r=3\times10^8\times0.8\times10^{-6}=\mathbf{240\ \text{m}}$.</p>
<p><b>Explanation.</b> A chip rate of at least 1.25 Mcps makes each chip $0.8\ \mu$s (240 m) long, so echoes 0.8 $\mu$s apart fall on separate autocorrelation peaks and can each be assigned a RAKE finger. A higher chip rate would resolve closer paths (finer than 240 m) and yield more fingers, at the cost of more bandwidth and a faster ADC.</p>`
      },
      {
        q: String.raw`A GPS-style receiver channel delivers $C/N_0=44$ dB-Hz and carries navigation data at $R_b=50$ bps. Find the post-despread $E_b/N_0$ in dB.`,
        solution: String.raw`<p><b>Formula.</b> $$ \left(\frac{E_b}{N_0}\right)_{\text{dB}}=\left(\frac{C}{N_0}\right)_{\text{dB-Hz}}-10\log_{10}R_b, $$ from $E_b/N_0=(C/N_0)/R_b$.</p>
<p><b>Substitute.</b> $\dfrac{E_b}{N_0}=44-10\log_{10}(50)$.</p>
<p><b>Compute.</b> $10\log_{10}50=16.99$ dB, so $E_b/N_0=44-16.99=\mathbf{27.0\ \text{dB}}$.</p>
<p><b>Explanation.</b> The very low 50 bps data rate lets the integrate-and-dump accumulate enormous energy per bit, delivering a comfortable 27 dB $E_b/N_0$ from a modest 44 dB-Hz carrier. Notice the chip rate never entered: only the data rate sets the thermal-noise $E_b/N_0$, confirming that sensitivity is bought with a low data rate, not with spreading.</p>`
      }
    ],
    realWorld: String.raw`<p>Every fielded DSSS radio is an instance of exactly this architecture, differing only in its parameter choices. A GPS receiver runs, per satellite, an RF front-end that delivers 1-bit to a few-bit samples of a signal 20-30 dB below the noise, acquires the 1.023 Mcps C/A code in a 2-D code/Doppler search, hands over to a carrier-aided DLL plus FLL-to-PLL carrier loop, and despreads against the 50 bps navigation message — the code and carrier NCO rates becoming the pseudorange and Doppler the position solver consumes. An IS-95/CDMA cellular receiver uses the same skeleton at 1.2288 Mcps but adds a RAKE receiver (fingers on resolvable multipath, maximal-ratio combined) and fast closed-loop power control to defeat the near-far problem, feeding soft finger outputs to a Viterbi decoder. A tactical anti-jam datalink quotes its jamming margin $M_j=G_p-(E_b/N_0)_{\text{req}}-L_{\text{sys}}$ directly as the specification, and sizes its ADC word length to the worst-case jammer-to-signal ratio so a strong jammer is diluted by despreading rather than clipping the converter.</p>
    <p>The design discipline is always the same balancing act. The mission fixes the data rate and required BER, hence the $E_b/N_0$ budget; the anti-jam or covertness requirement fixes the processing gain, hence the chip rate; the platform dynamics and minimum $C/N_0$ fix the loop bandwidths and integration time; the interference environment fixes the ADC bits; and the acquisition-time budget picks the search architecture (serial, parallel, or FFT). Modern software-defined receivers make these choices in firmware, running acquisition, tracking, despreading, and decoding as reconfigurable multiply-accumulate arithmetic, so one radio can serve GPS, Galileo, and a CDMA waveform by swapping codes and parameters. Understanding how the blocks connect, hand off, and are jointly sized — rather than any one block in isolation — is what lets an engineer turn a pile of correlators into a receiver that actually closes the link.</p>`,
    related: ['dsss-data-extraction', 'delay-lock-tracking', 'processing-gain', 'sliding-correlator', 'gold-code']
  }
);
