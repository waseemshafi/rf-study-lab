/* dsss-receiver-implementation.js — "DSSS Receiver Implementation" topic (Spread Spectrum & Coding).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   This is the IMPLEMENTATION / physical-realization companion to "DSSS Receiver Design":
   how the architecture becomes gates, samples, and code on FPGA / ASIC / DSP / GPU / SDR.
   It cross-references dsss-receiver-design rather than re-deriving the architecture.
   All text in String.raw; no literal backticks, no dollar-then-curly-brace sequence.
   Every SVG marker/def id is prefixed "dsss-receiver-implementation-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'dsss-receiver-implementation',
    title: 'DSSS Receiver Implementation',
    category: 'Spread Spectrum & Coding',
    tags: ['DSSS', 'implementation', 'DDC', 'NCO', 'DDS', 'correlator', 'matched filter', 'FFT acquisition', 'fixed-point', 'bit growth', 'FPGA', 'RFSoC', 'ASIC', 'SDR', 'real-time'],
    summary: String.raw`DSSS receiver implementation is the physical realization of the receiver architecture: turning the RF-front-end / acquisition / tracking / despread block diagram into ADC samples, numerically-controlled oscillators, correlators, and fixed-point arithmetic that run in real time on an FPGA, ASIC, DSP, GPU, or software-defined radio. It covers the digital front-end (ADC, digital downconversion with an NCO mixer plus CIC and FIR decimation to a few samples per chip), numeric timing and resampling, the three ways to build the correlator (time-domain integrate-and-dump, a matched-filter FIR, and FFT-based parallel code-phase search), direct digital synthesis of the code and carrier NCOs, discretized fixed-point loop filters, quantization and accumulator bit-growth, and the resource, latency, and verification trade-offs that decide whether the design closes timing at the sample rate.`,
    prerequisites: ['dsss-receiver-design', 'sdr', 'dsss-tracking'],
    intro: String.raw`<p><strong>Why does a working DSSS receiver need a whole second topic once we already have the architecture?</strong> Because a block diagram is not a radio. The companion topic <em>DSSS Receiver Design</em> tells you <em>what</em> blocks exist — front-end, acquisition, tracking, despreading — and how they hand off. This topic tells you how each block becomes real: how a mixer becomes a numerically-controlled oscillator and a complex multiply, how a correlator becomes a multiply-accumulate that must retire one result every clock, how a loop filter becomes two fixed-point coefficients, and how an "integrate over a symbol" becomes an accumulator that must be wide enough not to overflow. The architecture is a promise; the implementation is whether the promise can be kept inside a real ADC's bits and a real device's timing budget.</p>
<p>The defining constraint of the whole subject is <strong>real time</strong>. The samples arrive at the ADC rate — tens of millions per second — and never stop, so every operation must complete before the next sample lands. That single fact reshapes every design choice. It is why the digital front-end immediately <em>decimates</em>: the ADC may run at 40-60 Msps to satisfy Nyquist and give jammer headroom, but the correlators only need two-to-four samples per chip, so an NCO mixer plus a cascaded-integrator-comb (CIC) filter and a short FIR throw away the excess rate before the expensive arithmetic begins. It is why acquisition, which must test thousands of code phases, is reformulated as an FFT: a serial search costs on the order of <em>N</em>-squared multiplies while the FFT costs on the order of <em>N</em> log <em>N</em>, and only the second fits in the time available. And it is why fixed-point bit-widths are budgeted to the last bit — every extra bit of accumulator or coefficient is silicon, power, and routing that must still close timing.</p>
<p>Three implementation primitives carry most of the weight, and this topic derives each from scratch. The <strong>numerically-controlled oscillator (direct digital synthesis)</strong> — a B-bit phase accumulator that adds a frequency control word every clock — synthesizes both the carrier used for downconversion and the code clock used for chip timing, with an output frequency and a frequency resolution set entirely by the accumulator width. The <strong>correlator</strong> — realized as a time-domain integrate-and-dump, a matched-filter FIR, or an FFT-based circular correlation — is where the despreading actually happens and where the arithmetic cost lives. And <strong>fixed-point quantization</strong> — the ADC's own signal-to-quantization-noise ratio of about 6 dB per bit, and the accumulator bit-growth of one extra bit per doubling of the integration length — sets both the sensitivity and the width of every register. Master these three and you can turn any DSSS receiver architecture into gates, samples, and code.</p>`,
    sections: [
      {
        h: 'Why realize the receiver in gates and samples',
        html: String.raw`<p><strong>Why is implementation a distinct discipline from design?</strong> Because the questions change. Design asks "which blocks, in what order, sized how?" Implementation asks "at what sample rate, with how many bits, in how many DSP slices, and will it close timing?" The same delay-locked loop that the design topic draws as a single box becomes, in implementation, a specific arithmetic pipeline: three complex correlators, a discriminator, a two-coefficient fixed-point loop filter, and a code NCO, every one of which must produce a result inside the sample clock. The architecture is correct or incorrect; the implementation additionally is <em>feasible</em> or <em>infeasible</em>.</p>
        <p>The governing reality is that samples arrive continuously at the converter rate and cannot be paused. A receiver processing a 10 Mcps signal at four samples per chip must consume 40 million complex samples every second, forever. This <strong>real-time constraint</strong> forces three implementation strategies that recur throughout the topic:</p>
        <ul>
          <li><strong>Decimate early.</strong> Do the wideband work (mixing, filtering) at the high ADC rate only briefly, then drop to the lowest rate the correlators can tolerate (two-to-four samples per chip) so the bulk of the arithmetic runs slow.</li>
          <li><strong>Reformulate for cost.</strong> Replace an O(N-squared) serial code search with an O(N log N) FFT correlation; replace a floating-point loop filter with two fixed-point constants; replace an analog VCO with a phase-accumulator NCO.</li>
          <li><strong>Budget every bit.</strong> Choose ADC word length for jammer headroom, accumulator width for integration length, and coefficient width for loop stability — no wider, because width costs silicon and power and can break timing.</li>
        </ul>
        <div class="callout"><strong>Framing:</strong> this topic is the physical-layer complement of <em>DSSS Receiver Design</em>. Where that topic wires and sizes the blocks, this one turns each block into a numerically-controlled oscillator, a multiply-accumulate, a decimating filter, and a fixed-point register that together must run at the sample rate. The architecture chooses the parameters; the implementation makes them run.</div>`
      },
      {
        h: 'The digital front-end: ADC, digital downconversion, and decimation',
        html: String.raw`<p>The first job after the antenna and analog conditioning is to get the signal into numbers and down to a manageable rate. A modern receiver samples at RF or a low IF with a fast ADC and does <em>everything</em> else digitally — the <strong>digital front-end</strong>.</p>
        <p><strong>Sampling.</strong> The ADC must satisfy Nyquist for the occupied spread bandwidth. A DSSS signal of chip rate $R_c$ occupies roughly $2R_c$ null-to-null, so real bandpass sampling needs $f_s\gtrsim 2B$; complex (I/Q) baseband sampling needs $f_s$ above the one-sided bandwidth. <strong>Bandpass / IF sampling</strong> deliberately undersamples a signal centered at an IF, aliasing it down to baseband so the ADC clock, not a second analog mixer, does the last downconversion — cheaper and more repeatable, at the cost of folding in more noise and demanding a sharp anti-alias filter.</p>
        <p><strong>Digital downconversion (DDC).</strong> To translate the sampled IF to complex baseband, multiply by a complex exponential from a <strong>carrier NCO</strong> (a direct-digital-synthesis mixer): $x_{bb}[n]=x[n]\,e^{-j2\pi f_{IF} n/f_s}$, producing I and Q arms. This is a numerically exact, drift-free mixer — no analog LO error. The mixer output still sits at the full ADC rate, far more than the correlators need, so a <strong>decimation chain</strong> follows: a <strong>CIC (cascaded integrator-comb)</strong> filter does the bulk rate reduction with only adders (no multipliers), and a short <strong>FIR</strong> flattens the CIC droop and sets the final band, landing at two-to-four samples per chip.</p>
        <p><strong>Conditioning.</strong> A <strong>digital AGC</strong> holds the correlator input level against fades and jammers; <strong>DC-offset removal</strong> subtracts the mean (killing the LO-leakage spur at baseband); and <strong>I/Q-imbalance correction</strong> fixes the gain and phase mismatch between the I and Q paths that would otherwise create an image. All of this is arithmetic on samples, tuned in firmware.</p>
        <div class="callout tip"><strong>Why decimate at all?</strong> Correlation cost scales with sample rate. Doing the wideband mix at 40-60 Msps for a few cheap operations, then decimating to a few Msps before the expensive per-chip and per-phase arithmetic, can cut the correlator workload by an order of magnitude — the single biggest lever for fitting the receiver into a real device.</div>`
      },
      {
        h: 'Sampling and timing: samples per chip and numeric resampling',
        html: String.raw`<p>Once digital, the receiver's notion of "time" is the sample index, and chip timing is enforced <em>numerically</em>, not by nudging an analog clock. Two rates matter: the sample rate $f_s$ and the chip rate $R_c$. Their ratio is the <strong>samples per chip</strong> $k=f_s/R_c$, typically $k=2$ to $4$. Two samples per chip is the practical minimum (enough to place an Early and a Late half a chip apart); three-to-four sharpen the correlation triangle and the discriminator.</p>
        <p>The subtlety is that $f_s$ and $R_c$ are set by <em>independent</em> oscillators, so an integer number of samples rarely lands exactly on each chip boundary, and the incoming code phase drifts continuously with Doppler. The receiver cannot retune the ADC clock per satellite; instead it performs <strong>numeric resampling</strong>. The <strong>code NCO</strong> — a second phase accumulator — runs at the desired chipping rate and, on each sample, reports the fractional chip phase; an <strong>interpolator</strong> (linear, or a polyphase/Farrow filter) computes the signal value at the exact sub-sample instant the code wants. The DLL steers this code NCO, so "moving the replica" is just changing the NCO's frequency word — the sample clock never moves.</p>
        <p>This is the implementation face of the tracking topic's "code NCO": the loop filter output becomes a rate correction to the code NCO's frequency word; the accumulator's high bits index the local PN generator (which chip), and its low bits drive the interpolator (where within the chip). <strong>Early / Prompt / Late</strong> replicas are then just three taps of that accumulator separated by half a chip in the fractional phase — no extra clocks, only offset reads.</p>
        <table class="data">
          <tr><th>Quantity</th><th>Symbol</th><th>Typical value</th><th>Set by</th></tr>
          <tr><td>Sample rate</td><td>$f_s$</td><td>tens of Msps</td><td>ADC clock (fixed)</td></tr>
          <tr><td>Chip rate</td><td>$R_c$</td><td>1-10 Mcps</td><td>the waveform</td></tr>
          <tr><td>Samples per chip</td><td>$k=f_s/R_c$</td><td>2-4</td><td>after decimation</td></tr>
          <tr><td>Sub-chip timing</td><td>fractional NCO phase</td><td>continuous</td><td>code NCO + interpolator</td></tr>
        </table>`
      },
      {
        h: 'The correlator three ways: integrate-and-dump, matched-filter FIR, and FFT',
        html: String.raw`<p>The correlator is the heart of the receiver and the place the arithmetic cost lives. There are three canonical ways to build it, and choosing among them is the central implementation decision.</p>
        <p><strong>1. Time-domain integrate-and-dump (serial correlator).</strong> Multiply the incoming samples by one aligned code replica and accumulate over the symbol, then dump: $z=\sum_{n} r[n]\,c[n]$. This is a single multiply-accumulate (MAC) per sample — minimal hardware, one code phase at a time. It is exactly what tracking uses (Early, Prompt, Late are three of these), but for <em>acquisition</em>, where all code phases must be searched, testing them one at a time costs on the order of $N^2$ operations.</p>
        <p><strong>2. Matched filter (FIR whose taps are the code).</strong> Load the sampled PN code as the coefficients of an FIR filter; its output at each instant is the sliding correlation of the input with the code, so every code phase appears in turn as the data streams through. A length-$N$ matched filter evaluates a new full correlation every sample — parallel in code phase, but $N$ multipliers of hardware.</p>
        <p><strong>3. FFT-based parallel correlation (circular correlation).</strong> By the correlation theorem, correlating a block with the code equals an inverse transform of the product of their spectra: $\;r\star c=\mathcal{F}^{-1}\{\mathcal{F}\{r\}\cdot\mathcal{F}\{c\}^{*}\}$. One forward FFT of the data block, a pointwise multiply by the pre-computed conjugate code spectrum, and one inverse FFT evaluate <em>all</em> $N$ code phases at once, at a cost on the order of $N\log N$. This is the standard acquisition accelerator: it collapses the entire code-phase dimension of the 2-D search into a single transform.</p>
        <div class="callout"><strong>The cost story in one line:</strong> serial search of all $N$ phases is $O(N^2)$; the FFT is $O(N\log N)$; the speedup is roughly $N/\log_2 N$ — about a hundredfold for a 1023-chip code. That is why real acquisition engines are FFT-based and real tracking (which needs only three phases) stays time-domain.</div>
        <p><strong>Correlator banks.</strong> A real receiver instantiates many correlators: three per tracking channel (E/P/L), one bank per RAKE finger, one channel per satellite or user. A RAKE with $L$ fingers over $M$ satellites needs on the order of $L\times M\times 3$ complex correlators — a number that directly sizes the DSP-slice budget and forces the parallel-versus-time-multiplexed choice discussed later.</p>`
      },
      {
        h: 'Direct digital synthesis: the phase accumulator and the code and carrier NCOs',
        html: String.raw`<p>Both the carrier mixer and the code clock are built the same way — by <strong>direct digital synthesis (DDS)</strong> using a <strong>numerically-controlled oscillator (NCO)</strong>. The NCO is startlingly simple: a $B$-bit register (the <strong>phase accumulator</strong>) to which a fixed <strong>frequency control word</strong> (FCW, or tuning word) is added every clock. The accumulator counts upward, wrapping around modulo $2^B$ — a perfect digital sawtooth whose slope is the frequency.</p>
        <p>Adding FCW each clock at rate $f_s$ makes the accumulator complete one full turn ($2^B$ counts) every $2^B/\text{FCW}$ clocks, so the synthesized frequency is</p>
        <p>$$ f_{out}=\frac{\text{FCW}}{2^{B}}\,f_s, $$</p>
        <p>and the smallest possible frequency step — the <strong>frequency resolution</strong> — comes from changing FCW by one:</p>
        <p>$$ \Delta f=\frac{f_s}{2^{B}}. $$</p>
        <p>With a 32-bit accumulator at $f_s=100$ MHz this is $0.023$ Hz — micro-hertz-class tuning from an integer add. The high bits of the accumulator are a <strong>phase</strong>; a <strong>phase-to-amplitude converter</strong> (a sine look-up table, or a <strong>CORDIC</strong> rotator that needs no table) turns that phase into the cosine and sine used by the carrier mixer.</p>
        <p><strong>The code NCO</strong> uses the same accumulator differently: its overflow (or its high bits crossing a chip boundary) <em>clocks the LFSR PN-code generator</em> — advancing the local code one chip — while its fractional phase drives the interpolator for sub-chip timing. Steering the code NCO's FCW is precisely how the DLL advances or retards the replica; the <strong>Early / Prompt / Late</strong> replicas are read at accumulator phases offset by $\pm d/2$ chip. One primitive — the phase accumulator — thus synthesizes the carrier, clocks the code, sets the sub-chip timing, and generates the tracking taps.</p>
        <div class="callout tip"><strong>Why DDS instead of an analog oscillator?</strong> It is exactly repeatable (no drift), instantly retunable (write a new FCW), and its resolution is set by a register width you choose, not by component tolerances. The same block, with a different FCW, is the carrier LO, the code clock, and the Doppler-removal rotator.</div>`
      },
      {
        h: 'Fixed-point arithmetic: quantization SNR and accumulator bit growth',
        html: String.raw`<p>Everything above runs in <strong>fixed-point</strong>, and the bit-widths are as much a part of the design as the block diagram. Two numbers dominate.</p>
        <p><strong>ADC quantization SNR.</strong> An ideal $b$-bit converter driven by a full-scale sinusoid has a signal-to-quantization-noise ratio</p>
        <p>$$ \mathrm{SNR}_q=6.02\,b+1.76\ \text{dB}, $$</p>
        <p>about 6 dB per bit. In a DSSS receiver the wanted signal sits below the noise, so — exactly as in the design topic — the converter is sized to the strongest <em>jammer</em> plus headroom, not to the signal; each 6 dB of jammer-to-signal ratio buys roughly one more bit.</p>
        <p><strong>Accumulator bit growth.</strong> The integrate-and-dump sums $N$ samples. Summing $N$ numbers can grow the magnitude by a factor of up to $N$, so the accumulator must be wider than the input by</p>
        <p>$$ \Delta b=\lceil \log_2 N\rceil\ \text{bits} $$</p>
        <p>to guarantee no overflow — one extra bit per doubling of the integration length. A 1023-chip coherent sum of 8-bit samples therefore needs $8+\lceil\log_2 1023\rceil=8+10=18$-bit accumulators. The <strong>CIC</strong> decimator grows even faster: its DC gain is $(RM)^{N_{stages}}$, so its registers must grow by $N_{stages}\log_2(RM)$ bits — which is why CIC internal word lengths are large.</p>
        <p><strong>Rounding, truncation, saturation.</strong> After each stage the extra bits are shed by <em>truncation</em> (cheap, adds a small DC bias), <em>rounding</em> (unbiased, one more adder), or <em>saturation</em> (clamps instead of wrapping — essential at the ADC and after gain stages, because a wrapped overflow is catastrophic while a saturated one merely clips). With adequate bits the total <strong>quantization loss</strong> of the receiver is a small fraction of a decibel; with too few bits, a strong jammer that clips or a coarse code replica that dithers can cost several dB before despreading ever runs.</p>
        <table class="data">
          <tr><th>Stage</th><th>Width driver</th><th>Rule</th></tr>
          <tr><td>ADC</td><td>jammer headroom</td><td>$b\approx(\mathrm{JSR}+H)/6.02$</td></tr>
          <tr><td>Integrate-and-dump</td><td>integration length $N$</td><td>$+\lceil\log_2 N\rceil$ bits</td></tr>
          <tr><td>CIC decimator</td><td>rate change $R$, order</td><td>$+N_{stages}\log_2(RM)$ bits</td></tr>
          <tr><td>NCO phase</td><td>frequency resolution</td><td>$\Delta f=f_s/2^{B}$</td></tr>
        </table>`
      },
      {
        h: 'Implementing the loop filter: discretizing the analog design',
        html: String.raw`<p>The tracking topic derives the loop filters as continuous-time transfer functions with a chosen noise bandwidth $B_L$. Implementation must turn each into a <em>discrete</em>, fixed-point recursion that updates once per integrate-and-dump and drives an NCO.</p>
        <p><strong>Discretization.</strong> The analog filter $F(s)$ becomes a digital $F(z)$ by the <strong>bilinear transform</strong> $s\to\frac{2}{T}\frac{z-1}{z+1}$ (maps the whole $s$ left-half-plane inside the unit circle, guaranteeing stability, with a mild frequency warp) or by <strong>impulse invariance</strong> (matches the impulse response, simpler for low bandwidths). The update period $T$ is the predetection integration time — the loops run at the dump rate, not the sample rate, which is why they are cheap.</p>
        <p><strong>Fixed-point coefficients.</strong> A second-order loop reduces to two constants (a proportional and an integral gain) computed from $B_L$, the damping, and $T$. These are quantized to a chosen fractional word length; too few bits and the integral term cannot represent the tiny per-update Doppler correction (the loop develops a limit cycle or a bias), so the integral accumulator is deliberately made wide and its coefficient carefully scaled.</p>
        <p><strong>Driving the NCO.</strong> The filter output is a frequency correction added to the NCO's FCW: for the carrier NCO it removes residual Doppler; for the code NCO it advances or retards the replica. <strong>Carrier aiding</strong> is implemented literally as an adder — a scaled copy of the carrier-NCO frequency word is added into the code-NCO frequency word, offloading the dynamics so the code loop can run a very narrow $B_L$. The elegant loop-filter mathematics of the tracking topic thus lands as a handful of adds, two multiplies, and one accumulator per loop, updated at the slow dump rate.</p>`
      },
      {
        h: 'Resources, real time, and verification: FPGA, ASIC, DSP, GPU, SDR',
        html: String.raw`<p>The last implementation question is <em>where</em> the arithmetic runs and whether it fits. The same receiver maps very differently onto different fabrics.</p>
        <ul>
          <li><strong>FPGA / RFSoC.</strong> Correlators become <strong>DSP slices</strong> (hardware multiply-accumulate), codes and coefficients live in <strong>block RAM</strong>, and the fabric's <strong>LUTs</strong> glue it together. The design is deeply <strong>pipelined</strong> so a result retires every clock, and it must <strong>close timing</strong> at the sample rate. A device like an RFSoC integrates the ADC and the fabric on one chip. The core trade is <strong>parallel</strong> (one physical correlator per channel/finger — fast, uses many slices) versus <strong>time-multiplexed</strong> (one fast correlator reused across many channels — fewer slices, needs clock headroom).</li>
          <li><strong>ASIC.</strong> The same architecture hardened for volume: lowest power and cost per unit (a GPS chip in every phone), highest non-recurring engineering cost, and no post-fabrication flexibility.</li>
          <li><strong>DSP / CPU / GPU (software-defined radio).</strong> Everything after the ADC is C or CUDA. GNSS-SDR on a CPU/GPU trades raw efficiency for total reconfigurability — the FFT acquisition and the correlator loops are just code, and a GPU parallelizes the many correlations across its cores. This is the most flexible and the least power-efficient point.</li>
        </ul>
        <p><strong>Latency versus throughput.</strong> Pipelining raises throughput (results per second) but adds latency (delay from input to output); a tracking loop tolerates some latency but not too much, or its phase margin erodes. The hard wall is the <strong>real-time constraint</strong>: the design must process $f_s$ samples every second indefinitely — if it cannot, no cleverness elsewhere saves it.</p>
        <p><strong>Verification.</strong> Because the arithmetic is exact, DSSS receivers are validated by <strong>bit-true (bit-exact) simulation</strong> — a software model that matches the hardware sample-for-sample — followed by <strong>hardware-in-the-loop</strong> testing against a signal simulator and <strong>known-signal injection</strong> (feeding a synthesized satellite whose truth is known) to confirm the fixed-point pipeline acquires, tracks, and demodulates correctly under Doppler, dynamics, and jamming.</p>
        <div class="callout"><strong>One architecture, many realizations:</strong> GPS in a phone is an ASIC; a laboratory or research receiver is GNSS-SDR on a CPU/GPU; a reconfigurable multi-band front-end is an RFSoC. The block diagram is identical — only the mapping of correlators, NCOs, and filters onto slices, cores, or gates changes.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>DSSS receiver implementation is the physical realization that turns the receiver architecture into samples, oscillators, and fixed-point arithmetic that run in real time. You should now be able to say:</p>
        <ul>
          <li><strong>The governing constraint:</strong> samples arrive at the ADC rate and never stop, so the design must decimate early, reformulate expensive operations (FFT instead of serial search), and budget every bit — the real-time constraint reshapes every choice.</li>
          <li><strong>The digital front-end:</strong> ADC (bandpass/IF sampling for Nyquist and jammer headroom) $\to$ NCO complex-mixer downconversion $\to$ CIC + FIR decimation to $k=f_s/R_c\approx2$-$4$ samples per chip, with digital AGC, DC-offset, and I/Q-imbalance correction.</li>
          <li><strong>Numeric timing:</strong> chip timing is enforced by a code NCO and an interpolator, not by moving the ADC clock; Early/Prompt/Late are accumulator taps offset by half a chip.</li>
          <li><strong>The correlator three ways:</strong> time-domain integrate-and-dump (one phase, $O(N^2)$ to search all), matched-filter FIR (all phases, $N$ multipliers), and FFT circular correlation (all phases at once, $O(N\log N)$) — speedup roughly $N/\log_2 N$.</li>
          <li><strong>Direct digital synthesis:</strong> a $B$-bit phase accumulator plus a frequency control word gives $f_{out}=\mathrm{FCW}\,f_s/2^{B}$ with resolution $\Delta f=f_s/2^{B}$; the same block is the carrier LO, the code clock, and the sub-chip timing source.</li>
          <li><strong>Fixed-point:</strong> ADC $\mathrm{SNR}_q=6.02\,b+1.76$ dB (sized to the jammer), and an $N$-sample integrate-and-dump needs $\lceil\log_2 N\rceil$ extra accumulator bits; loop filters are discretized (bilinear/impulse-invariant) into a few fixed-point coefficients, and the whole thing is verified bit-true, hardware-in-the-loop, with known-signal injection, on FPGA/RFSoC, ASIC, or SDR.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Numerically-controlled_oscillator" target="_blank" rel="noopener">Wikipedia — Numerically-controlled oscillator</a> — the clearest concise reference for the DDS phase accumulator, frequency control word, output-frequency and resolution equations, and the phase-to-amplitude LUT/CORDIC, exactly the code and carrier NCO built in this topic.</li>
<li><a href="https://en.wikipedia.org/wiki/Cascaded_integrator%E2%80%93comb_filter" target="_blank" rel="noopener">Wikipedia — Cascaded integrator-comb (CIC) filter</a> — the multiplier-free decimator at the core of the digital downconverter, with the DC-gain and internal bit-growth results that govern the front-end word lengths derived here.</li>
<li><a href="https://gnss-sdr.org/docs/sp-blocks/acquisition/" target="_blank" rel="noopener">GNSS-SDR — Acquisition signal-processing blocks</a> — real, open-source implementation of FFT-based (parallel code-phase search) acquisition, showing the $O(N\log N)$ correlator reformulation running in production code.</li>
<li><a href="https://gnss-sdr.org/docs/sp-blocks/tracking/" target="_blank" rel="noopener">GNSS-SDR — Tracking signal-processing blocks</a> — the companion implementation of the DLL/PLL code and carrier tracking loops, with correlators, discriminators, loop filters, and code/carrier NCOs realized as software blocks — the implementation view of the tracking topic.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Implementation is a distinct discipline from architecture: it asks sample rate, bit-widths, DSP-slice count, and timing closure — not just which blocks in what order.`,
      String.raw`The real-time constraint dominates everything: $f_s$ samples arrive per second forever, forcing decimate-early, reformulate-for-cost, and budget-every-bit strategies.`,
      String.raw`The digital front-end samples at RF/IF, does a numerically exact NCO complex-mixer downconversion, then CIC + FIR decimation to a few samples per chip; all mixing/filtering is arithmetic on samples.`,
      String.raw`Bandpass / IF sampling lets the ADC clock perform the last downconversion by aliasing, avoiding a second analog mixer at the cost of folded noise and a sharp anti-alias filter.`,
      String.raw`Samples per chip $k=f_s/R_c$ is typically 2-4; two is the minimum to place Early and Late half a chip apart, more sharpens the discriminator.`,
      String.raw`Chip timing is enforced numerically: a code NCO plus an interpolator (linear/Farrow) resample to the wanted sub-chip phase; the ADC clock never moves and E/P/L are accumulator taps offset $\pm d/2$ chip.`,
      String.raw`The correlator has three realizations: time-domain integrate-and-dump (one code phase), matched-filter FIR (all phases, $N$ taps), and FFT circular correlation (all phases at once).`,
      String.raw`Searching all $N$ code phases costs $O(N^2)$ serially versus $O(N\log N)$ by FFT; the speedup is about $N/\log_2 N$, roughly $100\times$ for a 1023-chip code.`,
      String.raw`Direct digital synthesis: a $B$-bit phase accumulator adds a frequency control word each clock, giving $f_{out}=\mathrm{FCW}\,f_s/2^{B}$.`,
      String.raw`NCO frequency resolution is $\Delta f=f_s/2^{B}$ — one FCW least-significant-bit; a 32-bit accumulator at 100 MHz resolves about 0.023 Hz.`,
      String.raw`The same phase-accumulator primitive synthesizes the carrier LO, clocks the LFSR code generator, sets sub-chip timing, and produces the Early/Prompt/Late taps; phase-to-amplitude is a LUT or a CORDIC.`,
      String.raw`ADC quantization SNR is $6.02\,b+1.76$ dB (about 6 dB/bit); the converter is sized to the jammer-to-signal ratio plus headroom, not to the buried signal.`,
      String.raw`An $N$-sample integrate-and-dump needs $\lceil\log_2 N\rceil$ extra accumulator bits to avoid overflow; a CIC decimator grows by $N_{stages}\log_2(RM)$ bits.`,
      String.raw`Word length is shed by truncation (biased, cheap), rounding (unbiased), or saturation (clamps overflow — mandatory at the ADC and gain stages); adequate bits keep quantization loss to a fraction of a dB.`,
      String.raw`Loop filters are discretized (bilinear transform or impulse invariance), updated at the dump rate, and reduced to a few fixed-point coefficients that drive the NCO frequency words; carrier aiding is literally an adder between the two NCOs.`,
      String.raw`The architecture maps to FPGA/RFSoC (DSP slices, block RAM, pipelining, timing closure; parallel vs time-multiplexed), ASIC (low power, no flexibility), or SDR (GNSS-SDR on CPU/GPU); verification is bit-true simulation, hardware-in-the-loop, and known-signal injection.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-receiver-implementation-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="300" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">Digital front-end: ADC, NCO downconversion, CIC + FIR decimation</text>
<!-- RF/IF in -->
<line x1="12" y1="90" x2="40" y2="90" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#dsss-receiver-implementation-a1)"/>
<text x="8" y="82" fill="#9aa7b5" font-size="10">IF in</text>
<!-- ADC -->
<rect x="40" y="74" width="46" height="32" fill="#1c232e" stroke="#63e6be" stroke-width="1.6"/><text x="50" y="94" fill="#e6edf3" font-size="11">ADC</text>
<text x="34" y="122" fill="#9aa7b5" font-size="8">$f_s$ (Msps)</text>
<line x1="86" y1="90" x2="104" y2="90" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a1)"/>
<circle cx="106" cy="90" r="4" fill="#9aa7b5"/>
<!-- split to I and Q mixers -->
<line x1="106" y1="90" x2="106" y2="56" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="106" y1="90" x2="106" y2="124" stroke="#9aa7b5" stroke-width="1.1"/>
<circle cx="128" cy="56" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="122" y="61" fill="#ffa94d" font-size="12">$\times$</text>
<circle cx="128" cy="124" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="122" y="129" fill="#ffa94d" font-size="12">$\times$</text>
<line x1="106" y1="56" x2="116" y2="56" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-implementation-a1)"/>
<line x1="106" y1="124" x2="116" y2="124" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-implementation-a1)"/>
<!-- carrier NCO feeding both mixers -->
<rect x="96" y="160" width="72" height="28" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/><text x="104" y="178" fill="#e6edf3" font-size="9">carrier NCO</text>
<line x1="132" y1="160" x2="132" y2="140" stroke="#9aa7b5" stroke-width="1.0"/>
<line x1="132" y1="140" x2="128" y2="136" stroke="#9aa7b5" stroke-width="1.0" marker-end="url(#dsss-receiver-implementation-a1)"/>
<line x1="150" y1="160" x2="150" y2="70" stroke="#9aa7b5" stroke-width="1.0"/>
<line x1="150" y1="70" x2="140" y2="62" stroke="#9aa7b5" stroke-width="1.0" marker-end="url(#dsss-receiver-implementation-a1)"/>
<text x="128" y="200" fill="#9aa7b5" font-size="8">$\cos$ / $-\sin$ (DDS)</text>
<!-- merge I/Q into CIC -->
<line x1="140" y1="56" x2="196" y2="72" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-implementation-a1)"/>
<line x1="140" y1="124" x2="196" y2="108" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-implementation-a1)"/>
<text x="150" y="46" fill="#63e6be" font-size="9">I</text>
<text x="150" y="140" fill="#63e6be" font-size="9">Q</text>
<!-- CIC -->
<rect x="196" y="72" width="70" height="36" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/><text x="206" y="90" fill="#e6edf3" font-size="10">CIC</text><text x="202" y="103" fill="#9aa7b5" font-size="8">$\downarrow R$ (adders)</text>
<line x1="266" y1="90" x2="286" y2="90" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a1)"/>
<!-- FIR -->
<rect x="286" y="72" width="70" height="36" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/><text x="296" y="90" fill="#e6edf3" font-size="10">FIR</text><text x="292" y="103" fill="#9aa7b5" font-size="8">$\downarrow$ droop fix</text>
<line x1="356" y1="90" x2="376" y2="90" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a1)"/>
<!-- AGC / correction -->
<rect x="376" y="72" width="80" height="36" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.4"/><text x="384" y="88" fill="#e6edf3" font-size="9">AGC, DC,</text><text x="384" y="101" fill="#e6edf3" font-size="9">I/Q corr.</text>
<line x1="456" y1="90" x2="478" y2="90" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a1)"/>
<text x="462" y="84" fill="#63e6be" font-size="9">to</text><text x="450" y="126" fill="#63e6be" font-size="9">correlators</text>
<text x="200" y="128" fill="#9aa7b5" font-size="8">$k=f_s/R_c\approx2$-$4$ samples/chip</text>
<text x="14" y="238" fill="#9aa7b5" font-size="9">The ADC runs fast (Nyquist + jammer headroom); the NCO mixer translates to complex baseband;</text>
<text x="14" y="252" fill="#9aa7b5" font-size="9">CIC does the bulk rate reduction with only adders, and a short FIR flattens the CIC droop, landing at</text>
<text x="14" y="266" fill="#9aa7b5" font-size="9">a few samples per chip so the expensive per-chip correlator arithmetic runs at the lowest rate.</text>
<text x="14" y="286" fill="#9aa7b5" font-size="9">Everything shown is arithmetic on samples: a drift-free, exactly-repeatable digital downconverter.</text>
</svg>`,
        caption: 'The digital front-end (digital downconverter). The fast ADC samples at RF/IF; a carrier NCO (direct digital synthesis) forms a complex I/Q mixer that translates to baseband with no analog-LO drift; a CIC filter does the bulk multiplier-free decimation and a short FIR corrects its passband droop, landing at two-to-four samples per chip. Digital AGC, DC-offset removal, and I/Q-imbalance correction condition the stream before the correlators.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-receiver-implementation-a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="300" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">Direct digital synthesis: the B-bit phase accumulator NCO</text>
<!-- FCW input -->
<text x="14" y="70" fill="#b197fc" font-size="10">FCW</text>
<line x1="42" y1="66" x2="70" y2="66" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#dsss-receiver-implementation-a2)"/>
<!-- adder -->
<circle cx="86" cy="66" r="14" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/><text x="80" y="71" fill="#e6edf3" font-size="14">+</text>
<line x1="100" y1="66" x2="128" y2="66" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#dsss-receiver-implementation-a2)"/>
<!-- accumulator register -->
<rect x="128" y="50" width="84" height="32" fill="#1c232e" stroke="#63e6be" stroke-width="1.6"/><text x="134" y="63" fill="#e6edf3" font-size="9">phase accum.</text><text x="150" y="76" fill="#9aa7b5" font-size="8">$B$ bits</text>
<!-- feedback z^-1 -->
<line x1="170" y1="82" x2="170" y2="112" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="170" y1="112" x2="86" y2="112" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="86" y1="112" x2="86" y2="82" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#dsss-receiver-implementation-a2)"/>
<text x="104" y="108" fill="#9aa7b5" font-size="8">$z^{-1}$ (clocked at $f_s$)</text>
<!-- high bits to LUT -->
<line x1="212" y1="66" x2="240" y2="66" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#dsss-receiver-implementation-a2)"/>
<text x="212" y="42" fill="#9aa7b5" font-size="8">high bits = phase</text>
<rect x="240" y="50" width="76" height="32" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/><text x="248" y="63" fill="#e6edf3" font-size="9">LUT / CORDIC</text><text x="250" y="76" fill="#9aa7b5" font-size="8">phase$\to$ampl.</text>
<line x1="316" y1="66" x2="344" y2="66" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#dsss-receiver-implementation-a2)"/>
<text x="346" y="62" fill="#63e6be" font-size="9">$\cos,\sin$</text>
<text x="346" y="76" fill="#9aa7b5" font-size="8">(carrier)</text>
<!-- equations -->
<rect x="360" y="96" width="168" height="60" fill="#1c232e" stroke="#9aa7b5" stroke-width="1" opacity="0.9"/>
<text x="370" y="118" fill="#e6edf3" font-size="11">$f_{out}=\dfrac{\text{FCW}}{2^{B}}f_s$</text>
<text x="370" y="146" fill="#e6edf3" font-size="11">$\Delta f=\dfrac{f_s}{2^{B}}$</text>
<!-- sawtooth phase ramp -->
<text x="30" y="150" fill="#9aa7b5" font-size="10">accumulated phase (sawtooth), slope = frequency:</text>
<line x1="30" y1="250" x2="330" y2="250" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="30" y1="250" x2="30" y2="170" stroke="#9aa7b5" stroke-width="1.1"/>
<text x="12" y="176" fill="#9aa7b5" font-size="8">$2^{B}$</text>
<path d="M30,250 L90,175 L90,250 L150,175 L150,250 L210,175 L210,250 L270,175 L270,250" fill="none" stroke="#63e6be" stroke-width="1.8"/>
<text x="120" y="268" fill="#9aa7b5" font-size="8">each wrap = one output cycle; add FCW per clock</text>
<text x="360" y="182" fill="#b197fc" font-size="9">code NCO: same block,</text>
<text x="360" y="196" fill="#9aa7b5" font-size="8">overflow clocks the LFSR</text>
<text x="360" y="208" fill="#9aa7b5" font-size="8">(one chip); fraction drives</text>
<text x="360" y="220" fill="#9aa7b5" font-size="8">the sub-chip interpolator;</text>
<text x="360" y="232" fill="#9aa7b5" font-size="8">E/P/L = taps at $\pm d/2$.</text>
<text x="14" y="290" fill="#9aa7b5" font-size="9">One integer adder plus a register synthesizes any frequency; resolution is set by the register width $B$.</text>
</svg>`,
        caption: 'The numerically-controlled oscillator (direct digital synthesis). A B-bit phase accumulator adds a frequency control word every clock, producing a digital sawtooth whose slope is the output frequency f_out = FCW*fs/2^B with resolution Delta f = fs/2^B. The high bits index a sine LUT or a CORDIC for the carrier. The identical block is reused as the code NCO: its overflow clocks the LFSR one chip while its fractional phase drives the interpolator and provides the Early/Prompt/Late taps.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-receiver-implementation-a3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="320" fill="#1c232e"/>
<text x="14" y="20" fill="#e6edf3" font-size="13">Three ways to build the correlator (and their cost)</text>
<!-- Row 1: serial integrate-and-dump -->
<text x="14" y="44" fill="#ffa94d" font-size="11">1. Serial integrate-and-dump</text>
<line x1="20" y1="70" x2="44" y2="70" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<text x="12" y="64" fill="#9aa7b5" font-size="8">$r[n]$</text>
<circle cx="58" cy="70" r="12" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="52" y="75" fill="#ffa94d" font-size="12">$\times$</text>
<line x1="58" y1="92" x2="58" y2="82" stroke="#9aa7b5" stroke-width="1.0" marker-end="url(#dsss-receiver-implementation-a3)"/>
<text x="40" y="104" fill="#9aa7b5" font-size="8">$c[n]$ (one phase)</text>
<line x1="70" y1="70" x2="92" y2="70" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<rect x="92" y="56" width="60" height="28" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/><text x="100" y="74" fill="#e6edf3" font-size="10">$\sum$ dump</text>
<line x1="152" y1="70" x2="176" y2="70" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<text x="178" y="74" fill="#63e6be" font-size="9">$z$ (1 phase)</text>
<text x="270" y="74" fill="#9aa7b5" font-size="9">repeat for all $N$ phases $\Rightarrow O(N^2)$</text>
<!-- Row 2: matched filter FIR -->
<text x="14" y="128" fill="#4dabf7" font-size="11">2. Matched-filter FIR (taps = code)</text>
<line x1="20" y1="152" x2="44" y2="152" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<rect x="44" y="140" width="28" height="24" fill="#1c232e" stroke="#9aa7b5" stroke-width="1"/><text x="50" y="156" fill="#9aa7b5" font-size="9">$z^{-1}$</text>
<rect x="80" y="140" width="28" height="24" fill="#1c232e" stroke="#9aa7b5" stroke-width="1"/><text x="86" y="156" fill="#9aa7b5" font-size="9">$z^{-1}$</text>
<rect x="116" y="140" width="28" height="24" fill="#1c232e" stroke="#9aa7b5" stroke-width="1"/><text x="122" y="156" fill="#9aa7b5" font-size="9">$z^{-1}$</text>
<text x="150" y="156" fill="#9aa7b5" font-size="10">...</text>
<line x1="58" y1="164" x2="58" y2="182" stroke="#9aa7b5" stroke-width="1.0"/>
<line x1="94" y1="164" x2="94" y2="182" stroke="#9aa7b5" stroke-width="1.0"/>
<line x1="130" y1="164" x2="130" y2="182" stroke="#9aa7b5" stroke-width="1.0"/>
<text x="46" y="196" fill="#9aa7b5" font-size="8">$c_0$</text><text x="82" y="196" fill="#9aa7b5" font-size="8">$c_1$</text><text x="118" y="196" fill="#9aa7b5" font-size="8">$c_2$</text>
<circle cx="176" cy="188" r="12" fill="#1c232e" stroke="#63e6be" stroke-width="1.4"/><text x="170" y="193" fill="#e6edf3" font-size="12">$\sum$</text>
<line x1="150" y1="188" x2="164" y2="188" stroke="#9aa7b5" stroke-width="1.0" marker-end="url(#dsss-receiver-implementation-a3)"/>
<line x1="188" y1="188" x2="210" y2="188" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<text x="212" y="192" fill="#63e6be" font-size="9">all phases stream out; $N$ taps</text>
<!-- Row 3: FFT parallel -->
<text x="14" y="234" fill="#63e6be" font-size="11">3. FFT parallel (circular correlation)</text>
<line x1="20" y1="258" x2="40" y2="258" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<text x="10" y="252" fill="#9aa7b5" font-size="8">$r$</text>
<rect x="40" y="244" width="48" height="28" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="52" y="262" fill="#e6edf3" font-size="10">FFT</text>
<line x1="88" y1="258" x2="108" y2="258" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<circle cx="122" cy="258" r="12" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/><text x="116" y="263" fill="#ffa94d" font-size="12">$\times$</text>
<line x1="122" y1="290" x2="122" y2="270" stroke="#9aa7b5" stroke-width="1.0" marker-end="url(#dsss-receiver-implementation-a3)"/>
<text x="96" y="304" fill="#9aa7b5" font-size="8">$\mathcal{F}\{c\}^{*}$ (precomputed)</text>
<line x1="134" y1="258" x2="154" y2="258" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<rect x="154" y="244" width="52" height="28" fill="#1c232e" stroke="#4dabf7" stroke-width="1.4"/><text x="162" y="262" fill="#e6edf3" font-size="10">IFFT</text>
<line x1="206" y1="258" x2="228" y2="258" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-receiver-implementation-a3)"/>
<text x="230" y="262" fill="#63e6be" font-size="9">all $N$ phases at once; $O(N\log N)$</text>
<!-- cost box -->
<rect x="360" y="238" width="168" height="60" fill="#1c232e" stroke="#b197fc" stroke-width="1.2" opacity="0.95"/>
<text x="368" y="258" fill="#e6edf3" font-size="10">serial: $\sim N^2$ mults</text>
<text x="368" y="274" fill="#e6edf3" font-size="10">FFT: $\sim N\log_2 N$ mults</text>
<text x="368" y="290" fill="#63e6be" font-size="10">speedup $\approx N/\log_2 N$</text>
</svg>`,
        caption: 'The correlator, three ways. A serial time-domain integrate-and-dump tests one code phase per pass, so searching all N phases costs on the order of N-squared multiplies. A matched-filter FIR whose taps are the sampled code streams out every code phase in turn, at the cost of N multipliers. An FFT-based circular correlation (forward FFT, pointwise multiply by the conjugate code spectrum, inverse FFT) evaluates all N code phases at once for on the order of N log N operations, giving roughly an N/log2(N) speedup and making it the standard acquisition accelerator.'
      }
    ],
    equations: [
      {
        title: 'Sample Rate from Chip Rate (samples per chip)',
        tex: String.raw`$$ f_s=k\,R_c,\qquad k=\frac{f_s}{R_c}\ \ (\text{typ. }2\text{-}4),\qquad f_s\ge 2B_{ss} $$`,
        derivation: String.raw`<p><b>Where we start.</b> After downconversion and decimation the receiver holds a stream of complex samples at rate $f_s$, while the spreading code chips arrive at rate $R_c$. To place an Early and a Late replica half a chip on either side of the Prompt, and to reconstruct the correlation triangle, the receiver needs several samples spanning each chip. Define the samples per chip $k=f_s/R_c$.</p>
<p><b>Step 1.</b> Nyquist first. The DSSS signal occupies roughly $B_{ss}\approx 2R_c$ null-to-null; sampling must satisfy $f_s\ge 2B_{ss}$ for real bandpass sampling, or exceed the one-sided bandwidth for complex baseband sampling, so the spread spectrum is captured without aliasing before any decimation reduces the rate.</p>
<p><b>Step 2.</b> Timing next. To separate Early and Late by $d/2$ chip on each side, at least two samples must fall inside one chip, so $k\ge 2$; three or four samples per chip sharpen the sampled autocorrelation triangle and the discriminator slope. Hence after decimation the receiver targets $f_s=k\,R_c$ with $k=2$ to $4$.</p>
<p><b>Result.</b> The final sample rate is $f_s=k\,R_c$ with $k$ a small integer, obtained by decimating the fast ADC stream down until only a few samples straddle each chip. For $R_c=1.023$ Mcps and $k=4$, $f_s=4.092$ Msps; the chip duration $T_c=1/R_c=978$ ns then spans four $244$ ns samples. This ratio is the hinge between the ADC rate (set by Nyquist and jammer headroom) and the correlator rate (set by timing), and choosing it wrongly either aliases the signal or wastes arithmetic.</p>`
      },
      {
        title: 'DDS / NCO Output Frequency',
        tex: String.raw`$$ f_{out}=\frac{\text{FCW}}{2^{B}}\,f_s $$`,
        derivation: String.raw`<p><b>Where we start.</b> A numerically-controlled oscillator is a $B$-bit register (the phase accumulator) clocked at $f_s$, to which a constant frequency control word FCW is added every clock. The register represents phase on a circle of $2^{B}$ counts, wrapping around modulo $2^{B}$; one full wrap corresponds to one complete output cycle.</p>
<p><b>Step 1.</b> Each clock the accumulated phase advances by FCW counts. Starting from zero, after $m$ clocks the phase is $m\cdot\text{FCW}\ (\bmod\ 2^{B})$. The accumulator completes one full revolution of $2^{B}$ counts when $m\cdot\text{FCW}=2^{B}$, i.e. after $m=2^{B}/\text{FCW}$ clocks.</p>
<p><b>Step 2.</b> Those $m$ clocks occupy a time $m/f_s=2^{B}/(\text{FCW}\,f_s)$ seconds, which is exactly one output period $T_{out}$. The output frequency is the reciprocal, $f_{out}=1/T_{out}=\text{FCW}\,f_s/2^{B}$.</p>
<p><b>Result.</b> $f_{out}=(\text{FCW}/2^{B})\,f_s$: the synthesized frequency is the clock scaled by the fraction of the accumulator the FCW represents. It is exactly repeatable and retuned by simply writing a new integer FCW, which is why the same block serves as the carrier local oscillator and the code clock. For $B=32$, $f_s=100$ MHz, a target of $2.5$ MHz needs $\text{FCW}=\text{round}(2.5\times10^{6}\cdot 2^{32}/10^{8})=107{,}374{,}182$, giving back $f_{out}\approx 2.499\,999\,99$ MHz.</p>`
      },
      {
        title: 'DDS / NCO Frequency Resolution',
        tex: String.raw`$$ \Delta f=\frac{f_s}{2^{B}} $$`,
        derivation: String.raw`<p><b>Where we start.</b> The output frequency of the NCO is $f_{out}=(\text{FCW}/2^{B})\,f_s$, and FCW is an <em>integer</em>. The finest possible frequency change is therefore obtained by incrementing FCW by its least significant bit, from FCW to FCW$+1$.</p>
<p><b>Step 1.</b> Compute the frequency for FCW$+1$: $f_{out}'=(\text{FCW}+1)f_s/2^{B}$. The change relative to the original is $\Delta f=f_{out}'-f_{out}=[(\text{FCW}+1)-\text{FCW}]\,f_s/2^{B}$.</p>
<p><b>Step 2.</b> The bracket is exactly $1$, independent of the current FCW, so the step size is the same everywhere in the tuning range: $\Delta f=f_s/2^{B}$. Doubling the accumulator width $B$ halves the step twice over (a factor $2$ per bit), so resolution improves exponentially with $B$ while cost grows only linearly.</p>
<p><b>Result.</b> $\Delta f=f_s/2^{B}$ — the frequency resolution is set purely by the accumulator width, not by any analog tolerance. A 32-bit accumulator at $f_s=100$ MHz resolves $10^{8}/2^{32}=0.0233$ Hz; a 48-bit accumulator would reach sub-micro-hertz. This is why DSSS receivers use wide accumulators for the carrier and code NCOs: fine Doppler and sub-chip timing corrections require frequency steps far smaller than any crystal could provide, and here they cost only register bits.</p>`
      },
      {
        title: 'Integrate-and-Dump Accumulator Bit Growth',
        tex: String.raw`$$ \Delta b=\lceil \log_2 N\rceil,\qquad b_{acc}=b_{in}+\lceil \log_2 N\rceil $$`,
        derivation: String.raw`<p><b>Where we start.</b> The despreading integrate-and-dump forms $z=\sum_{n=1}^{N} r[n]$, summing $N$ samples (the $N$ chips of a symbol, after multiplying by the code). Each input sample is a $b_{in}$-bit signed number with magnitude up to $2^{b_{in}-1}$. We need the accumulator width $b_{acc}$ that can never overflow.</p>
<p><b>Step 1.</b> Bound the worst case. The largest possible sum occurs when every term has the maximum magnitude and the same sign: $|z|_{max}=N\cdot 2^{b_{in}-1}$. The number of bits needed to represent a magnitude $M$ is $\lceil\log_2 M\rceil$ (plus a sign bit), so $|z|_{max}$ needs $\lceil\log_2(N\cdot 2^{b_{in}-1})\rceil$ magnitude bits.</p>
<p><b>Step 2.</b> Split the logarithm: $\log_2(N\cdot 2^{b_{in}-1})=\log_2 N+(b_{in}-1)$. The input already carries $(b_{in}-1)$ magnitude bits plus its sign, so the <em>extra</em> width required is just $\Delta b=\lceil\log_2 N\rceil$ — one additional bit for every doubling of the sum length $N$.</p>
<p><b>Result.</b> $b_{acc}=b_{in}+\lceil\log_2 N\rceil$: an $N$-sample sum needs $\lceil\log_2 N\rceil$ more bits than its inputs. Summing $N=1023$ chips of 8-bit samples needs $8+\lceil\log_2 1023\rceil=8+10=18$-bit accumulators (worst-case magnitude $1023\times128=130{,}944<2^{17}$). Under-sizing the accumulator wraps the sum and destroys the correlation peak, so bit-growth is a mandatory, exact calculation, not a safety guess — and the same reasoning, applied to a CIC's cascaded integrators, forces their much larger internal word lengths.</p>`
      },
      {
        title: 'ADC Quantization Signal-to-Noise Ratio',
        tex: String.raw`$$ \mathrm{SNR}_q=6.02\,b+1.76\ \text{dB}\ \Longrightarrow\ b\gtrsim\frac{\mathrm{JSR}+H}{6.02} $$`,
        derivation: String.raw`<p><b>Where we start.</b> An ideal $b$-bit ADC with full-scale range $V_{FS}$ has quantization step $\Delta=V_{FS}/2^{b}$. Rounding error is modeled as uniform on $[-\Delta/2,\Delta/2]$, giving quantization-noise power $\sigma_q^2=\Delta^2/12$. A full-scale sinusoid of amplitude $V_{FS}/2$ has signal power $S=(V_{FS}/2)^2/2=V_{FS}^2/8$.</p>
<p><b>Step 1.</b> Form the ratio: $\mathrm{SNR}_q=S/\sigma_q^2=(V_{FS}^2/8)/(\Delta^2/12)$. Substitute $\Delta=V_{FS}/2^{b}$ so $\Delta^2=V_{FS}^2/2^{2b}$: $\mathrm{SNR}_q=(V_{FS}^2/8)\cdot(12\,2^{2b}/V_{FS}^2)=\tfrac{12}{8}\,2^{2b}=1.5\cdot 2^{2b}$.</p>
<p><b>Step 2.</b> Convert to decibels: $10\log_{10}(1.5\cdot 2^{2b})=10\log_{10}1.5+2b\cdot 10\log_{10}2=1.76+2b(3.01)=6.02\,b+1.76$ dB.</p>
<p><b>Result.</b> $\mathrm{SNR}_q=6.02\,b+1.76$ dB, the famous "6 dB per bit." In a DSSS receiver the signal is below the noise, so the converter must instead span the jammer-to-signal ratio JSR plus headroom $H$ (signal margin above quantization noise plus crest factor): $6.02\,b+1.76\ge \mathrm{JSR}+H$, hence $b\gtrsim(\mathrm{JSR}+H)/6.02$. A 30 dB jammer with 12 dB headroom needs about $7$ bits, even though the message alone would need one or two — the extra bits exist entirely to keep the jammer from clipping the ADC before despreading can dilute it.</p>`
      },
      {
        title: 'Correlation Cost: Serial vs FFT',
        tex: String.raw`$$ C_{serial}\sim N^{2},\qquad C_{FFT}\sim N\log_2 N,\qquad \text{speedup}\approx\frac{N}{\log_2 N} $$`,
        derivation: String.raw`<p><b>Where we start.</b> Acquisition must evaluate the correlation of an $N$-sample data block against the length-$N$ code at <em>all</em> $N$ possible code phases (the code-phase axis of the 2-D search). Count the complex multiplies each method needs.</p>
<p><b>Step 1.</b> Serial (time-domain) search. Testing one code phase is a full correlation, $N$ complex multiply-accumulates. There are $N$ phases to test, so the serial cost is $C_{serial}=N\cdot N=N^{2}$ multiplies — quadratic in the code length.</p>
<p><b>Step 2.</b> FFT (frequency-domain) search. By the circular-correlation theorem, the correlation at all phases equals $\mathcal{F}^{-1}\{\mathcal{F}\{r\}\cdot\mathcal{F}\{c\}^{*}\}$. The code spectrum $\mathcal{F}\{c\}^{*}$ is precomputed once; the online work is one length-$N$ FFT of the data ($\tfrac{N}{2}\log_2 N$ multiplies), $N$ pointwise multiplies, and one IFFT ($\tfrac{N}{2}\log_2 N$), so $C_{FFT}\sim N\log_2 N$ — the dominant term of two transforms.</p>
<p><b>Result.</b> The speedup is $C_{serial}/C_{FFT}\approx N^{2}/(N\log_2 N)=N/\log_2 N$. For a GPS C/A code, $N=1023$, this is about $1023/10\approx 102\times$: the serial method needs roughly a million multiplies, the FFT roughly ten thousand. That two-orders-of-magnitude saving is the whole reason acquisition is built on the FFT, while tracking — which needs only three phases (Early, Prompt, Late) — stays in the cheap time domain.</p>`
      },
      {
        title: 'Decimation Ratio of the Digital Downconverter',
        tex: String.raw`$$ D=\frac{f_{s,\mathrm{ADC}}}{f_{s,\mathrm{bb}}}=\frac{f_{s,\mathrm{ADC}}}{k\,R_c} $$`,
        derivation: String.raw`<p><b>Where we start.</b> The ADC samples at $f_{s,\mathrm{ADC}}$ (high, set by Nyquist and jammer headroom), but the correlators want the far lower baseband rate $f_{s,\mathrm{bb}}=k\,R_c$ (a few samples per chip). The decimation chain must reduce the rate by the integer factor $D$ that bridges them.</p>
<p><b>Step 1.</b> By definition, decimating by $D$ keeps every $D$-th sample, so the output rate is $f_{s,\mathrm{ADC}}/D$. Setting this equal to the wanted baseband rate: $f_{s,\mathrm{ADC}}/D=f_{s,\mathrm{bb}}$, hence $D=f_{s,\mathrm{ADC}}/f_{s,\mathrm{bb}}$.</p>
<p><b>Step 2.</b> Substitute the target $f_{s,\mathrm{bb}}=k\,R_c$: $D=f_{s,\mathrm{ADC}}/(k\,R_c)$. Because $D$ must be an integer (or a ratio of integers for a fractional resampler), the ADC clock and the chip rate are usually chosen so this comes out clean; when it does not, a fractional-rate (Farrow) resampler makes up the non-integer part. The decimation is normally split — a CIC of ratio $R$ followed by an FIR of ratio $2$ — so $D=R\cdot 2$, with the CIC doing the bulk cheaply and the FIR fixing its droop.</p>
<p><b>Result.</b> $D=f_{s,\mathrm{ADC}}/(k\,R_c)$. For a WCDMA-style front-end sampling at $f_{s,\mathrm{ADC}}=61.44$ Msps with $R_c=3.84$ Mcps and $k=2$, the baseband rate is $7.68$ Msps and $D=61.44/7.68=8$ — for example a CIC by $4$ then an FIR by $2$. Getting $D$ right is what lets the expensive per-chip correlator arithmetic run at $7.68$ Msps instead of $61.44$ Msps, an eight-fold reduction in correlator workload.</p>`
      },
      {
        title: 'CIC Decimator Gain and Register Bit Growth',
        tex: String.raw`$$ G=(R\,M)^{N_s},\qquad W_{out}=\big\lceil N_s\log_2(R\,M)\big\rceil+B_{in} $$`,
        derivation: String.raw`<p><b>Where we start.</b> A cascaded integrator-comb (CIC) decimator that changes rate by $R$ uses $N_s$ integrator-comb stages with differential delay $M$ (usually $1$ or $2$). Each integrator is a running accumulator with, at DC, unbounded-looking gain that the comb later cancels; we need the internal word length that never overflows.</p>
<p><b>Step 1.</b> Find the DC gain. One integrator-comb pair with rate change $R$ and differential delay $M$ has a maximum (DC) gain of $R\,M$ — the comb differences samples $RM$ apart, and the integrator between decimation sums up to $RM$ inputs. Cascading $N_s$ such stages multiplies the gains: $G=(R\,M)^{N_s}$.</p>
<p><b>Step 2.</b> Convert gain to bits. A gain of $G$ multiplies the signal magnitude by $G$, requiring $\log_2 G$ additional bits above the input width to hold the largest internal value without wrapping: extra bits $=\log_2 G=\log_2(R\,M)^{N_s}=N_s\log_2(R\,M)$. Adding the input width $B_{in}$ gives the register width $W_{out}=\lceil N_s\log_2(RM)\rceil+B_{in}$.</p>
<p><b>Result.</b> $W_{out}=\lceil N_s\log_2(RM)\rceil+B_{in}$: CIC internal registers grow with the number of stages times $\log_2(RM)$. A $3$-stage CIC with $M=1$ decimating by $R=32$ needs $\lceil 3\log_2 32\rceil=\lceil 3\cdot 5\rceil=15$ extra bits, so 8-bit inputs demand 23-bit accumulators. This large but exactly-computable growth — the multi-sample analogue of the integrate-and-dump's $\lceil\log_2 N\rceil$ — is why CIC stages are the widest registers in the digital front-end, and why the comb sections must never be pruned below this width.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`How does implementation differ from architecture for a DSSS receiver?`, back: String.raw`Architecture asks which blocks in what order, sized how; implementation asks at what sample rate, with how many bits, in how many DSP slices, and whether it closes timing at $f_s$ — feasibility, not just correctness.` },
      { front: String.raw`What is the single governing constraint of the implementation?`, back: String.raw`Real time: $f_s$ samples arrive every second and never stop, so every operation must finish before the next sample — this forces decimate-early, reformulate-for-cost, and budget-every-bit.` },
      { front: String.raw`What is a digital downconverter (DDC)?`, back: String.raw`An NCO complex mixer $x[n]e^{-j2\pi f_{IF}n/f_s}$ that translates the sampled IF to complex baseband, followed by CIC + FIR decimation to a few samples per chip — a drift-free, exactly-repeatable digital mixer.` },
      { front: String.raw`What is bandpass (IF) sampling and its trade?`, back: String.raw`Deliberately undersampling a signal at an IF so aliasing folds it to baseband, letting the ADC clock do the last downconversion instead of an analog mixer; cost is folded noise and a demanding anti-alias filter.` },
      { front: String.raw`Why is a CIC filter used for the bulk decimation?`, back: String.raw`It needs only adders and delays (no multipliers), so it cheaply does large rate reductions; a short FIR afterward flattens its passband droop and sets the final band.` },
      { front: String.raw`What is "samples per chip" and its typical value?`, back: String.raw`$k=f_s/R_c$, the number of samples spanning one chip; typically 2-4. Two is the minimum to place Early and Late half a chip apart; more sharpens the correlation triangle.` },
      { front: String.raw`How is chip timing enforced if the ADC clock is fixed?`, back: String.raw`Numerically: a code NCO runs at the wanted chip rate and an interpolator (linear/Farrow) resamples to the exact sub-chip instant; the DLL steers the NCO's frequency word, never the ADC clock.` },
      { front: String.raw`Name the three ways to build the correlator.`, back: String.raw`Time-domain integrate-and-dump (one code phase), matched-filter FIR whose taps are the code (all phases, $N$ multipliers), and FFT circular correlation (all phases at once, $O(N\log N)$).` },
      { front: String.raw`Why is acquisition FFT-based but tracking time-domain?`, back: String.raw`Acquisition searches all $N$ code phases ($O(N^2)$ serial vs $O(N\log N)$ by FFT, ~100x speedup for $N=1023$); tracking needs only three phases (E/P/L), so cheap time-domain MACs suffice.` },
      { front: String.raw`What is a numerically-controlled oscillator (NCO)?`, back: String.raw`A $B$-bit phase accumulator that adds a frequency control word (FCW) every clock, producing a digital sawtooth; its high bits address a sine LUT or CORDIC. It is direct digital synthesis.` },
      { front: String.raw`Give the NCO output-frequency and resolution formulas.`, back: String.raw`$f_{out}=\mathrm{FCW}\,f_s/2^{B}$ and $\Delta f=f_s/2^{B}$ (one FCW least-significant bit). A 32-bit accumulator at 100 MHz resolves about 0.023 Hz.` },
      { front: String.raw`How is the code NCO different from the carrier NCO?`, back: String.raw`Same phase-accumulator block, but its overflow clocks the LFSR one chip and its fractional phase drives the sub-chip interpolator; Early/Prompt/Late are taps read at $\pm d/2$ chip offsets.` },
      { front: String.raw`State the ADC quantization SNR and what sets ADC bits.`, back: String.raw`$\mathrm{SNR}_q=6.02\,b+1.76$ dB (about 6 dB/bit). The word length is sized to the jammer-to-signal ratio plus headroom, $b\approx(\mathrm{JSR}+H)/6.02$, not to the buried signal.` },
      { front: String.raw`How much wider must an $N$-sample integrate-and-dump accumulator be?`, back: String.raw`$\lceil\log_2 N\rceil$ extra bits above the input width — one more bit per doubling of $N$ — to guarantee no overflow. For $N=1023$, that is 10 extra bits.` },
      { front: String.raw`Truncation vs rounding vs saturation?`, back: String.raw`Truncation is cheap but adds a DC bias; rounding is unbiased at one adder's cost; saturation clamps overflow instead of wrapping and is mandatory at the ADC and gain stages, where a wrapped overflow is catastrophic.` },
      { front: String.raw`How is a loop filter implemented, and what is carrier aiding in hardware?`, back: String.raw`Discretize the analog $F(s)$ (bilinear transform / impulse invariance) to a few fixed-point coefficients updated at the dump rate, driving the NCO's frequency word; carrier aiding is literally an adder injecting a scaled carrier-NCO word into the code-NCO word.` },
      { front: String.raw`How does the same architecture map to FPGA, ASIC, and SDR?`, back: String.raw`FPGA/RFSoC: correlators as DSP slices, codes in block RAM, pipelined to close timing, parallel vs time-multiplexed. ASIC: lowest power, no flexibility. SDR: GNSS-SDR on CPU/GPU, fully reconfigurable, least efficient.` },
      { front: String.raw`How is a fixed-point DSSS receiver verified?`, back: String.raw`Bit-true (bit-exact) simulation matching the hardware sample-for-sample, then hardware-in-the-loop against a signal simulator, and known-signal injection of a synthesized satellite with known truth.` }
    ],
    mcqs: [
      { q: String.raw`The defining constraint that shapes every DSSS receiver implementation choice is:`, options: [String.raw`minimizing the transmit power`, String.raw`processing $f_s$ samples per second in real time, without pause`, String.raw`maximizing the code length`, String.raw`using floating-point arithmetic`], answer: 1, explain: String.raw`Samples arrive continuously at the ADC rate and cannot be paused, forcing decimate-early, reformulate-for-cost, and budget-every-bit strategies.` },
      { q: String.raw`In a digital downconverter, the complex mixer that translates IF to baseband is implemented as:`, options: [String.raw`an analog local oscillator and diode mixer`, String.raw`a multiply by a carrier-NCO complex exponential`, String.raw`a CIC filter`, String.raw`an FFT`], answer: 1, explain: String.raw`Multiplying the samples by $e^{-j2\pi f_{IF}n/f_s}$ from a carrier NCO is a numerically exact, drift-free mixer producing I and Q.` },
      { q: String.raw`A CIC filter is favored for bulk decimation because it:`, options: [String.raw`has a perfectly flat passband`, String.raw`needs only adders and delays (no multipliers)`, String.raw`requires no bit growth`, String.raw`removes Doppler`], answer: 1, explain: String.raw`The multiplier-free integrator-comb structure cheaply achieves large rate reductions; a short FIR then corrects its passband droop.` },
      { q: String.raw`The samples-per-chip ratio $k=f_s/R_c$ is typically chosen as:`, options: [String.raw`2 to 4`, String.raw`exactly 1`, String.raw`100 or more`, String.raw`less than 1`], answer: 0, explain: String.raw`Two samples per chip is the minimum to place Early and Late half a chip apart; three-to-four sharpen the discriminator, and more just wastes arithmetic.` },
      { q: String.raw`Sub-chip code timing in an all-digital receiver is achieved by:`, options: [String.raw`retuning the ADC sample clock per satellite`, String.raw`a code NCO plus an interpolator that resamples to the wanted fractional phase`, String.raw`changing the antenna`, String.raw`increasing the transmit power`], answer: 1, explain: String.raw`The ADC clock is fixed; the code NCO and a linear/Farrow interpolator supply the exact sub-sample instant the code wants, and the DLL steers the NCO.` },
      { q: String.raw`Searching all $N$ code phases with a serial time-domain correlator costs on the order of:`, options: [String.raw`$N\log N$`, String.raw`$N$`, String.raw`$N^2$`, String.raw`$\log N$`], answer: 2, explain: String.raw`Each phase is a length-$N$ correlation and there are $N$ phases, giving $N\times N=N^2$ multiply-accumulates.` },
      { q: String.raw`FFT-based parallel acquisition evaluates all code phases at a cost on the order of $N\log N$ by computing:`, options: [String.raw`the sum of the samples`, String.raw`$\mathcal{F}^{-1}\{\mathcal{F}\{r\}\cdot\mathcal{F}\{c\}^{*}\}$ (circular correlation)`, String.raw`the ADC quantization noise`, String.raw`the CIC droop`], answer: 1, explain: String.raw`By the correlation theorem, one FFT of the data, a pointwise multiply by the conjugate code spectrum, and one IFFT give every code phase at once.` },
      { q: String.raw`In an NCO, the output frequency is:`, options: [String.raw`$f_{out}=2^{B}/(\mathrm{FCW}\,f_s)$`, String.raw`$f_{out}=\mathrm{FCW}\,f_s/2^{B}$`, String.raw`$f_{out}=f_s/\mathrm{FCW}$`, String.raw`$f_{out}=\mathrm{FCW}+f_s$`], answer: 1, explain: String.raw`Adding FCW to a $B$-bit accumulator each clock at rate $f_s$ makes it wrap every $2^{B}/\mathrm{FCW}$ clocks, so $f_{out}=\mathrm{FCW}\,f_s/2^{B}$.` },
      { q: String.raw`The frequency resolution of a $B$-bit NCO clocked at $f_s$ is:`, options: [String.raw`$f_s/2^{B}$`, String.raw`$f_s\cdot 2^{B}$`, String.raw`$2^{B}/f_s$`, String.raw`$f_s/B$`], answer: 0, explain: String.raw`Incrementing FCW by one least-significant bit changes $f_{out}$ by exactly $f_s/2^{B}$, independent of the current setting.` },
      { q: String.raw`An ideal $b$-bit ADC on a full-scale sine has a quantization SNR of:`, options: [String.raw`$3.01\,b$ dB`, String.raw`$6.02\,b+1.76$ dB`, String.raw`$1.76\,b$ dB`, String.raw`$10\log_{10}b$ dB`], answer: 1, explain: String.raw`From $\mathrm{SNR}_q=1.5\cdot 2^{2b}$, in dB this is $6.02\,b+1.76$ — about 6 dB per bit.` },
      { q: String.raw`An $N$-sample integrate-and-dump accumulator must be wider than its inputs by:`, options: [String.raw`$N$ bits`, String.raw`$\lceil\log_2 N\rceil$ bits`, String.raw`1 bit regardless of $N$`, String.raw`$2N$ bits`], answer: 1, explain: String.raw`The worst-case sum grows by a factor $N$, needing $\lceil\log_2 N\rceil$ extra bits to avoid overflow — one more per doubling of $N$.` },
      { q: String.raw`In a DSSS front-end, the ADC word length is chosen primarily to accommodate:`, options: [String.raw`the wanted signal amplitude`, String.raw`the jammer-to-signal ratio plus headroom (~6 dB/bit)`, String.raw`the data rate`, String.raw`the FEC code rate`], answer: 1, explain: String.raw`The signal sits below the noise, so the converter is sized to span the strongest jammer without clipping while keeping the signal above the quantization floor.` },
      { q: String.raw`On an FPGA/RFSoC, the core resource trade for the correlator bank is:`, options: [String.raw`analog vs digital`, String.raw`parallel (one correlator per channel) vs time-multiplexed (one fast correlator reused)`, String.raw`AM vs FM`, String.raw`copper vs fiber`], answer: 1, explain: String.raw`Parallel correlators are fast but consume many DSP slices; time-multiplexing reuses one fast correlator across channels, saving slices at the cost of clock headroom.` }
    ],
    numericals: [
      {
        q: String.raw`A DSSS waveform has chip rate $R_c=10$ Mcps. The designer wants $k=4$ samples per chip at the correlator. Find the baseband sample rate $f_s$, the chip duration $T_c$, and the sample interval $T_s$.`,
        solution: String.raw`<p><b>Formula.</b> $$ f_s=k\,R_c,\qquad T_c=\frac{1}{R_c},\qquad T_s=\frac{1}{f_s}=\frac{T_c}{k}. $$</p>
<p><b>Substitute.</b> $f_s=4\times 10\times10^{6}$; $T_c=\dfrac{1}{10\times10^{6}}$; $T_s=\dfrac{1}{f_s}$.</p>
<p><b>Compute.</b> $f_s=40\times10^{6}=\mathbf{40\ \text{Msps}}$; $T_c=1.0\times10^{-7}=\mathbf{100\ \text{ns}}$; $T_s=\dfrac{1}{40\times10^{6}}=2.5\times10^{-8}=\mathbf{25\ \text{ns}}=T_c/4$.</p>
<p><b>Explanation.</b> Four samples per chip means the correlator sees a new sample every 25 ns, four spanning each 100 ns chip — enough to place Early and Late half a chip ($50$ ns) apart and to reconstruct the correlation triangle. The ADC itself may run faster (for Nyquist and jammer headroom); this $40$ Msps is the decimated rate at which the expensive per-chip arithmetic actually runs.</p>`
      },
      {
        q: String.raw`A carrier NCO has a $B=32$-bit phase accumulator clocked at $f_s=100$ MHz. Find the frequency control word for a target output of $2.5$ MHz, the actual synthesized frequency, and the frequency resolution.`,
        solution: String.raw`<p><b>Formula.</b> $$ \text{FCW}=\text{round}\!\left(\frac{f_{out}\,2^{B}}{f_s}\right),\quad f_{out,\text{act}}=\frac{\text{FCW}}{2^{B}}f_s,\quad \Delta f=\frac{f_s}{2^{B}}. $$</p>
<p><b>Substitute.</b> $\text{FCW}=\text{round}\!\left(\dfrac{2.5\times10^{6}\cdot 2^{32}}{100\times10^{6}}\right)=\text{round}(0.025\cdot 4{,}294{,}967{,}296)$; $\Delta f=\dfrac{100\times10^{6}}{2^{32}}$.</p>
<p><b>Compute.</b> $0.025\times4{,}294{,}967{,}296=107{,}374{,}182.4\Rightarrow \text{FCW}=\mathbf{107{,}374{,}182}$. Then $f_{out,\text{act}}=\dfrac{107{,}374{,}182}{4{,}294{,}967{,}296}\times10^{8}=\mathbf{2{,}499{,}999.99\ \text{Hz}}$ (error $\approx0.009$ Hz). $\Delta f=\dfrac{10^{8}}{4{,}294{,}967{,}296}=\mathbf{0.0233\ \text{Hz}}$.</p>
<p><b>Explanation.</b> The integer FCW forces a tiny $0.009$ Hz rounding error, bounded by the $0.0233$ Hz resolution — one FCW least-significant bit. This micro-hertz-class tuning from a 32-bit register is exactly why NCOs, not analog oscillators, generate the carrier and code clocks: Doppler and sub-chip corrections need steps far finer than any crystal, and here they cost only accumulator bits.</p>`
      },
      {
        q: String.raw`A GPS-style integrate-and-dump coherently sums $N=1023$ chips, each sample an 8-bit signed number (magnitude up to $128$). Find the extra accumulator bits needed, the total accumulator width, and verify the worst-case sum fits.`,
        solution: String.raw`<p><b>Formula.</b> $$ \Delta b=\lceil\log_2 N\rceil,\qquad b_{acc}=b_{in}+\Delta b,\qquad |z|_{max}=N\cdot 2^{b_{in}-1}. $$</p>
<p><b>Substitute.</b> $\Delta b=\lceil\log_2 1023\rceil$; $b_{acc}=8+\Delta b$; $|z|_{max}=1023\times128$.</p>
<p><b>Compute.</b> $\log_2 1023=9.999\Rightarrow \Delta b=\mathbf{10\ \text{bits}}$; $b_{acc}=8+10=\mathbf{18\text{-bit signed}}$; $|z|_{max}=1023\times128=130{,}944$, and $2^{17}=131{,}072>130{,}944$, so a 17-bit magnitude plus sign (18 bits) holds it. $\checkmark$</p>
<p><b>Explanation.</b> Coherently summing 1023 chips can grow the magnitude by up to $1023\times$, so the accumulator needs 10 more bits than its 8-bit inputs. Under-sizing it would wrap the sum and annihilate the correlation peak — the very quantity the receiver exists to build. The exactness matters: 17 magnitude bits just fit $130{,}944$, with no wasted width.</p>`
      },
      {
        q: String.raw`Acquisition must search all $N=1023$ code phases. Compare the complex-multiply count for a serial time-domain search versus an FFT-based search (two length-$N$ transforms), and give the speedup.`,
        solution: String.raw`<p><b>Formula.</b> $$ C_{serial}=N^{2},\qquad C_{FFT}\approx N\log_2 N,\qquad \text{speedup}=\frac{C_{serial}}{C_{FFT}}=\frac{N}{\log_2 N}. $$</p>
<p><b>Substitute.</b> $C_{serial}=1023^{2}$; $\log_2 1023=9.999$; $C_{FFT}\approx 1023\times9.999$; speedup $=\dfrac{1023}{9.999}$.</p>
<p><b>Compute.</b> $C_{serial}=1{,}046{,}529\approx\mathbf{1.05\times10^{6}}$ mults; $C_{FFT}\approx 10{,}229\approx\mathbf{1.02\times10^{4}}$ mults; speedup $=\mathbf{102\times}$.</p>
<p><b>Explanation.</b> The FFT does the same all-phase search with about ten thousand multiplies instead of a million — a hundred-fold saving that is decisive under the real-time budget. This is why every practical acquisition engine is FFT-based, while tracking, needing only three phases (Early, Prompt, Late), stays in the cheap time domain where $3N\ll N^2$.</p>`
      },
      {
        q: String.raw`A RAKE receiver runs $L=4$ fingers per channel across $M=12$ satellites, each finger using Early, Prompt, and Late (3 complex correlators). Find the number of complex correlators and, at 4 real multipliers per complex multiply, the DSP-slice count.`,
        solution: String.raw`<p><b>Formula.</b> $$ N_{corr}=L\times M\times 3,\qquad N_{DSP}=N_{corr}\times 4\ \text{(real mults per complex mult)}. $$</p>
<p><b>Substitute.</b> $N_{corr}=4\times12\times3$; $N_{DSP}=N_{corr}\times4$.</p>
<p><b>Compute.</b> $N_{corr}=\mathbf{144\ \text{complex correlators}}$; $N_{DSP}=144\times4=\mathbf{576\ \text{DSP slices}}$ (or $144\times3=432$ using the 3-multiplier complex-multiply trick).</p>
<p><b>Explanation.</b> A full 12-channel, 4-finger RAKE needs 144 complex correlators, mapping to roughly 576 hardware multipliers if built fully parallel. That is a large fraction of a mid-range FPGA's DSP slices, which is exactly why designers time-multiplex — reusing one fast correlator across several fingers when clock headroom allows — trading slices for sample-rate margin.</p>`
      },
      {
        q: String.raw`An ADC front-end must give a quantization SNR of $40$ dB for the signal path, and additionally survive a jammer $36$ dB above the signal. Find the bits for the $40$ dB requirement, the extra bits for the jammer, and the total.`,
        solution: String.raw`<p><b>Formula.</b> $$ b\ge\frac{\mathrm{SNR}_q-1.76}{6.02},\qquad \Delta b_{jam}=\left\lceil\frac{\mathrm{JSR}}{6.02}\right\rceil,\qquad b_{tot}=b+\Delta b_{jam}. $$</p>
<p><b>Substitute.</b> $b\ge\dfrac{40-1.76}{6.02}=\dfrac{38.24}{6.02}$; $\Delta b_{jam}=\left\lceil\dfrac{36}{6.02}\right\rceil$.</p>
<p><b>Compute.</b> $b\ge6.35\Rightarrow \mathbf{7\ \text{bits}}$; $\Delta b_{jam}=\lceil5.98\rceil=\mathbf{6\ \text{bits}}$; $b_{tot}=7+6=\mathbf{13\ \text{bits}}$.</p>
<p><b>Explanation.</b> The message path needs only 7 bits for a $40$ dB quantization SNR, but the ADC must not clip on a jammer $36$ dB stronger, which costs $\lceil 36/6.02\rceil=6$ more bits of range at roughly 6 dB per bit. The resulting 13-bit converter spends most of its dynamic range on the jammer, not the signal — the hallmark of an anti-jam DSSS front-end.</p>`
      },
      {
        q: String.raw`A WCDMA-style front-end samples at $f_{s,\mathrm{ADC}}=61.44$ Msps and needs $k=2$ samples per chip at $R_c=3.84$ Mcps. Find the baseband rate and the decimation ratio, and give a two-stage split.`,
        solution: String.raw`<p><b>Formula.</b> $$ f_{s,\mathrm{bb}}=k\,R_c,\qquad D=\frac{f_{s,\mathrm{ADC}}}{f_{s,\mathrm{bb}}},\qquad D=R_{CIC}\times R_{FIR}. $$</p>
<p><b>Substitute.</b> $f_{s,\mathrm{bb}}=2\times3.84\times10^{6}$; $D=\dfrac{61.44\times10^{6}}{f_{s,\mathrm{bb}}}$.</p>
<p><b>Compute.</b> $f_{s,\mathrm{bb}}=7.68\times10^{6}=\mathbf{7.68\ \text{Msps}}$; $D=\dfrac{61.44}{7.68}=\mathbf{8}$; a natural split is $R_{CIC}=4$ then $R_{FIR}=2$ (since $4\times2=8$).</p>
<p><b>Explanation.</b> Decimating by 8 lets the expensive per-chip correlator arithmetic run at $7.68$ Msps instead of the full $61.44$ Msps — an eight-fold cut in correlator workload. Splitting the decimation as a CIC-by-4 (adders only) followed by an FIR-by-2 (which also flattens the CIC droop) does the bulk rate reduction cheaply and the final band-shaping precisely, the standard DDC arrangement.</p>`
      }
    ],
    realWorld: String.raw`<p>Every DSSS receiver you can hold is this implementation made concrete. A GPS chip in a phone is an ASIC digital front-end: a fast ADC on a low IF, an NCO complex mixer and CIC+FIR decimation to a couple of samples per chip, an FFT-based acquisition engine that tests all 1023 C/A code phases in one transform, and per-satellite tracking channels that are three time-domain correlators (Early, Prompt, Late) feeding a fixed-point discretized loop filter and a code NCO whose running frequency word <em>is</em> the pseudorange-rate measurement. The accumulators are sized by the exact $\lceil\log_2 N\rceil$ bit-growth rule, the ADC word length is set by the interference environment rather than the (deeply buried) signal, and the whole pipeline is bit-true so the silicon matches the reference model sample-for-sample. A research or laboratory receiver runs the identical block diagram as GNSS-SDR software on a CPU or GPU, where the FFT acquisition and the correlator loops are just C or CUDA and a GPU parallelizes hundreds of correlations across its cores — maximum flexibility, minimum power efficiency.</p>
    <p>The reconfigurable, wideband, or multi-band systems increasingly land on an RFSoC, which fuses the data converters and the FPGA fabric on one die: correlators become DSP slices, PN codes and FIR coefficients live in block RAM, the datapath is pipelined to retire a result every clock, and the design must close timing at the sample rate or it simply does not run. Here the engineer confronts the parallel-versus-time-multiplexed decision head-on — a full multi-satellite RAKE can demand hundreds of hardware multipliers, so fingers are time-shared against clock headroom, and latency is traded against throughput without eroding the tracking loops' phase margin. Whether the target is an ASIC, an SDR, or an RFSoC, the same three primitives recur: the phase-accumulator NCO that synthesizes carrier and code, the correlator (time-domain for tracking, FFT for acquisition) where the despreading arithmetic lives, and the fixed-point bit budget that keeps quantization loss to a fraction of a dB. Verification always ends the same way too — bit-true simulation, then hardware-in-the-loop against a constellation simulator, then known-signal injection — because in a receiver built from exact arithmetic, "correct" means bit-for-bit correct.</p>`,
    related: ['dsss-receiver-design', 'sdr', 'adc', 'rfsoc', 'nco']
  }
);
