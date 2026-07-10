// SDR & Data Converters category topics
CONTENT.topics.push(
  {
    id: 'sdr',
    title: 'Software-Defined Radio (SDR)',
    category: 'SDR & Data Converters',
    tags: ['sdr', 'iq', 'quadrature', 'zero-if', 'baseband', 'gnu-radio', 'digitization'],
    summary: String.raw`A radio in which functions traditionally realized in analog hardware (mixing, filtering, modulation, demodulation) are moved into digital signal processing on programmable devices, with the ADC/DAC placed as close to the antenna as practical.`,
    prerequisites: ['comm-basics', 'adc', 'dac', 'pll'],
    intro: String.raw`<p><b>Why does the SDR exist?</b> A traditional radio is frozen in copper and silicon: its filters, mixers, and demodulator are soldered for one band and one waveform, so supporting a new standard means designing a new board. That is slow, expensive, and impossible to update in the field. The SDR asks a liberating question - what if we digitized the signal as early as possible and did the rest in <i>software</i>? Then the same hardware could become a GPS receiver, an LTE modem, or a radar simply by loading new code. That single idea reshaped the RF industry.</p>
    <p>A <b>Software-Defined Radio (SDR)</b> replaces fixed-function analog signal chains with a minimal RF front end followed by high-speed data converters and programmable processing (FPGA/GPU/CPU). The guiding principle is to <b>digitize as near the antenna as feasible</b>: once samples exist, everything downstream (channel selection, demodulation, equalization, decoding) becomes software that can be re-loaded to change bands, waveforms, and standards without touching hardware. This flexibility is why SDR underpins cognitive radio, multi-standard basestations, test instruments, electronic warfare, and hobbyist platforms alike.</p>
    <p>The mathematical heart of modern SDR is the <b>complex baseband (IQ) representation</b>: a real bandpass signal centered at a carrier is represented by a complex envelope sampled at a rate proportional to its bandwidth, not its carrier frequency. This decouples the processing rate from the RF frequency and lets DSP treat any modulation uniformly.</p>`,
    sections: [
      {
        h: 'SDR Architecture: Push the Boundary Toward the Antenna',
        html: String.raw`<p>The "ideal" SDR digitizes the raw antenna voltage directly with a wideband ADC and does all filtering in software. Practically, physics and converter technology force a compromise. Three canonical partitions exist:</p>
        <ul>
          <li><b>Direct RF sampling</b> - a GSPS ADC samples RF directly; only a preselect filter and LNA are analog. Enabled by RFSoC-class converters. No mixer, no analog LO.</li>
          <li><b>Direct conversion (zero-IF)</b> - an analog quadrature mixer translates the band of interest to DC (0 Hz), followed by lowpass filters and moderate-rate ADCs. Dominant in integrated transceivers such as the AD9361.</li>
          <li><b>Low-IF / superheterodyne</b> - one or more analog mixing stages bring the signal to a low or intermediate frequency before digitizing; bandpass sampling may then be used.</li>
        </ul>
        <p>The RF front end that survives in any SDR is deliberately minimal: <b>antenna, preselect/anti-alias filter, LNA, gain control, and converters</b>. Everything with tunable behavior (matched filtering, carrier/timing recovery, FEC) lives in DSP.</p>
        <div class="callout"><b>Design axiom:</b> every analog stage you delete removes a source of drift, temperature dependence, and unit-to-unit variation - but shifts dynamic-range and speed demands onto the ADC. SDR design is the art of choosing where that boundary sits.</div>`
      },
      {
        h: 'Quadrature (IQ) Sampling and Complex Baseband',
        html: String.raw`<div class="callout tip"><b>Intuition first:</b> think of a signal as a spinning arrow (a phasor). To describe where the arrow points you need two numbers - its shadow on a horizontal axis (I) and on a vertical axis (Q). One number alone is ambiguous: a shadow of "0.5" could be an arrow tilting up or down. That is exactly why one real channel cannot tell a positive frequency from a negative one, and why we always carry the I/Q <i>pair</i>. Below we make this precise.</div>
        <p>A real bandpass signal can be written as $s(t)=A(t)\cos(2\pi f_c t + \phi(t))$. Expanding gives $s(t)=I(t)\cos(2\pi f_c t)-Q(t)\sin(2\pi f_c t)$ where $I=A\cos\phi$ and $Q=A\sin\phi$ are the <b>in-phase</b> and <b>quadrature</b> components. The <b>complex envelope</b> is $\tilde s(t)=I(t)+jQ(t)=A(t)e^{j\phi(t)}$.</p>
        <p>Quadrature downconversion multiplies the incoming signal by $\cos(2\pi f_c t)$ and $-\sin(2\pi f_c t)$ in two parallel paths and lowpass-filters each, recovering $I$ and $Q$. The pair fully describes amplitude and phase, so a complex sample rate equal to the signal bandwidth suffices (versus twice the highest RF frequency for a naive real ADC).</p>
        <ul>
          <li>A single real channel cannot distinguish positive from negative frequencies; the IQ pair can, giving an unambiguous <b>two-sided</b> spectrum of width $f_s$ (complex).</li>
          <li>Complex sampling at $f_s$ carries the same information as real sampling at $2f_s$ - two real streams equal one complex stream.</li>
        </ul>`
      },
      {
        h: 'Receiver Architectures: Zero-IF vs Low-IF vs Superheterodyne',
        html: String.raw`<table class="data">
          <tr><th>Architecture</th><th>IF</th><th>Image problem</th><th>Key impairments</th><th>Filtering burden</th><th>Integration</th></tr>
          <tr><td>Superheterodyne</td><td>High, fixed</td><td>Rejected by RF image filter + IF filter</td><td>Spurs, LO planning</td><td>Sharp analog SAW filters</td><td>Poor (discrete)</td></tr>
          <tr><td>Low-IF</td><td>Small (~1 BW)</td><td>Image at $-f_{IF}$; needs IQ balance</td><td>IQ imbalance sets image reject</td><td>Complex bandpass, digital image reject</td><td>Good</td></tr>
          <tr><td>Zero-IF (direct)</td><td>0 Hz</td><td>Self-image = own signal (folds onto itself)</td><td>DC offset, LO leakage, 1/f noise, IQ imbalance, even-order distortion</td><td>Lowpass only</td><td>Excellent (SoC)</td></tr>
        </table>
        <p><b>Zero-IF</b> wins on integration and cost - no image filter, only lowpass channel filters - which is why it dominates monolithic transceivers. Its penalty is a cluster of near-DC impairments (below). <b>Low-IF</b> dodges DC offset and 1/f noise by placing the signal slightly off DC, at the cost of a manageable image that digital calibration suppresses. <b>Superheterodyne</b> gives the best selectivity and dynamic range but is bulky and inflexible.</p>`
      },
      {
        h: 'Zero-IF Impairments: DC Offset, LO Leakage, IQ Imbalance',
        html: String.raw`<p>Direct conversion puts the wanted signal on top of DC, exactly where analog circuits misbehave:</p>
        <ul>
          <li><b>DC offset</b> - self-mixing of the LO (leaking to the LNA input and back into the mixer) and device mismatch create a static DC term that lands in the center of the channel. Removed by AC coupling (loses DC info) or adaptive digital cancellation.</li>
          <li><b>LO leakage</b> - LO energy escaping to the antenna appears in transmit as a carrier feedthrough spur at the LO frequency; calibrated out by injecting a canceling DC bias.</li>
          <li><b>IQ imbalance</b> - gain mismatch $\varepsilon$ and phase error $\psi$ between the I and Q paths break the perfect $90^\circ$ relationship, producing an <b>image</b> of the signal at the mirror frequency. Image rejection ratio $\text{IRR}\approx \dfrac{1}{(\varepsilon/2)^2+(\psi/2)^2}$ (with $\psi$ in radians).</li>
          <li><b>1/f (flicker) noise</b> - baseband noise rises toward DC, degrading SNR for narrowband signals sitting at the channel center.</li>
        </ul>
        <div class="callout"><b>Numbers:</b> for $1\%$ gain mismatch ($\varepsilon=0.01$) and $1^\circ$ phase error ($\psi=0.0175$ rad), $\text{IRR}\approx 1/((0.005)^2+(0.00873)^2)=1/(1.01\times10^{-4})\approx 9.9\times10^3 \Rightarrow \approx 40$ dB. Standards needing higher image rejection require on-chip IQ calibration.</div>`
      },
      {
        h: 'Decimation, Interpolation and the Digital Front End',
        html: String.raw`<p>After digitizing a wide band, the SDR usually wants a narrow channel at a low rate. A <b>digital down-converter (DDC)</b> performs: complex mix by an NCO to shift the channel to DC, then a decimating filter chain (CIC + FIR) to reduce the rate by factor $M$. On transmit the mirror operation is a <b>digital up-converter (DUC)</b>: interpolate by $L$, then mix up with an NCO.</p>
        <ul>
          <li><b>Decimation</b> requires an anti-alias lowpass before downsampling so out-of-band content does not fold into the retained band.</li>
          <li><b>Interpolation</b> requires an anti-imaging lowpass after upsampling to remove spectral images introduced by zero-stuffing.</li>
          <li><b>CIC filters</b> (cascaded integrator-comb) give multiplier-free large rate changes; their sinc-shaped droop is compensated by a short FIR.</li>
          <li>Sample-rate conversion by a rational factor $L/M$ (polyphase resampling) matches the ADC clock to the desired symbol rate.</li>
        </ul>
        <p>Decimation delivers <b>processing gain</b>: filtering to bandwidth $B$ before decimating to $f_s'=2B$ discards out-of-band quantization noise, improving in-band SNR (oversampling gain, see the ADC topic).</p>`
      },
      {
        h: 'Processing Platforms: FPGA vs GPU vs CPU',
        html: String.raw`<table class="data">
          <tr><th>Platform</th><th>Best for</th><th>Latency</th><th>Throughput</th><th>Flexibility</th></tr>
          <tr><td>FPGA</td><td>High-rate DDC/DUC, filtering, deterministic real-time</td><td>Lowest (deterministic)</td><td>Very high</td><td>Recompile HDL</td></tr>
          <tr><td>GPU</td><td>Massively parallel batch DSP, ML, wideband FFT</td><td>Moderate (batch)</td><td>Highest (bulk)</td><td>Software (CUDA)</td></tr>
          <tr><td>CPU</td><td>Control, protocol, low-rate demod, prototyping</td><td>High/variable</td><td>Low-moderate</td><td>Highest (software)</td></tr>
        </table>
        <p>A typical partition puts the sample-rate-critical front end (DDC, resampling, coarse sync) in the <b>FPGA</b> next to the converters, streams reduced-rate IQ over PCIe/USB/Ethernet to a host, and runs demodulation/decoding on <b>CPU/GPU</b>. <b>GNU Radio</b> is the de-facto open framework: a flowgraph of blocks (sources, filters, sync, sinks) connected by streams, with hardware sources for USRP (UHD), PlutoSDR, RTL-SDR, etc.</p>`
      },
      {
        h: 'Dynamic Range, AGC and Sampling Rate Budget',
        html: String.raw`<p>Because the SDR sees many signals at once, the ADC must span the weakest wanted signal up to the strongest blocker. <b>Automatic Gain Control (AGC)</b> sets analog gain so the composite fills the ADC without clipping; the ADC's ENOB then sets the instantaneous dynamic range. Key budget items:</p>
        <ul>
          <li><b>Sample rate</b> $\geq$ (complex) signal bandwidth, with margin for filter transition bands. Wider capture eases tuning but raises data rate and processing load.</li>
          <li><b>Bit depth / ENOB</b> sets spur-free and noise dynamic range; blockers demand more bits than the wanted signal alone.</li>
          <li><b>Data throughput</b> = $f_s \times \text{bits} \times 2\,(I,Q) \times \text{channels}$; e.g. $61.44\text{ MS/s} \times 12 \times 2 \times 2 \approx 2.95$ Gb/s must reach the host.</li>
        </ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<ul>
          <li><b>The core move:</b> digitize as near the antenna as physics allows, then do filtering, mixing, demod, and decoding in reconfigurable software/logic - so one radio serves many bands and standards.</li>
          <li><b>Why IQ:</b> the complex envelope $\tilde s=I+jQ=Ae^{j\phi}$ carries all amplitude and phase, distinguishes positive from negative frequencies, and lets the sample rate track <i>bandwidth</i> instead of carrier frequency (complex $f_s$ = real $2f_s$).</li>
          <li><b>Architecture trade:</b> zero-IF integrates best but suffers DC offset, LO leakage, 1/f noise, and IQ-imbalance images; low-IF sidesteps DC problems for a calibratable image; superhet gives the best selectivity but is bulky.</li>
          <li><b>Impairment math:</b> IQ imbalance sets image rejection $\text{IRR}\approx1/((\varepsilon/2)^2+(\psi/2)^2)$ - a handle you can now compute and calibrate against.</li>
          <li><b>Digital front end:</b> DDC (NCO mix to DC + decimate) and DUC (interpolate + NCO up) reshape rate and channel; decimating to bandwidth buys oversampling processing gain.</li>
          <li><b>System budget:</b> AGC fills the ADC without clipping, and throughput $f_s\times\text{bits}\times2\times\text{channels}$ often bottlenecks the host link, forcing on-chip decimation.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://pysdr.org/content/sampling.html" target="_blank" rel="noopener">PySDR — IQ Sampling</a> — a full, worked textbook chapter on complex/quadrature sampling, negative frequencies, and the complex-baseband model with plots and code.</li>
<li><a href="https://en.wikipedia.org/wiki/Software-defined_radio" target="_blank" rel="noopener">Wikipedia — Software-defined radio</a> — the canonical overview of SDR history, receiver/transmitter architectures, and the digitize-near-the-antenna principle.</li>
<li><a href="https://www.electronics-notes.com/articles/radio/sdr-software-defined-radio-receiver/sdr-hardware-architecture.php" target="_blank" rel="noopener">Electronics Notes — SDR Hardware Architecture</a> — a focused treatment of where the analog/digital boundary sits and the RF front-end trade-offs it forces.</li>
<li><a href="https://www.mathworks.com/discovery/sdr.html" target="_blank" rel="noopener">MathWorks — Software-Defined Radio</a> — vendor overview tying SDR front ends to FPGA/SoC processing and standards (5G, LTE, WLAN) with hands-on examples.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`SDR digitizes as close to the antenna as practical and implements radio functions in reconfigurable software/logic.`,
      String.raw`Complex baseband (IQ) representation $\tilde s = I + jQ = Ae^{j\phi}$ lets a complex rate equal to bandwidth carry all information; complex $f_s$ = real $2f_s$.`,
      String.raw`Quadrature sampling distinguishes positive and negative frequencies (two-sided spectrum) - a single real channel cannot.`,
      String.raw`Zero-IF (direct conversion) is the most integrable but suffers DC offset, LO leakage, 1/f noise, IQ imbalance and even-order distortion.`,
      String.raw`Low-IF avoids DC/flicker problems at the cost of an image that digital calibration suppresses.`,
      String.raw`Superheterodyne offers the best selectivity/dynamic range but is bulky and inflexible.`,
      String.raw`IQ imbalance ($\varepsilon$ gain, $\psi$ phase) produces an image; $\text{IRR}\approx 1/((\varepsilon/2)^2+(\psi/2)^2)$.`,
      String.raw`DDC = NCO mix to DC + decimation; DUC = interpolation + NCO mix up. Decimation needs anti-alias, interpolation needs anti-image filters.`,
      String.raw`Decimating to bandwidth yields oversampling processing gain by discarding out-of-band quantization noise.`,
      String.raw`FPGAs handle deterministic high-rate front-end DSP; GPUs handle bulk parallel processing; CPUs handle control and low-rate demod.`,
      String.raw`GNU Radio is the standard flowgraph framework tying hardware sources to DSP blocks.`,
      String.raw`Data throughput scales as $f_s \times \text{bits} \times 2(I,Q) \times \text{channels}$ and often bottlenecks the host link.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr-sdr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="18" fill="#e6edf3" font-size="13">SDR Receive Chain (Zero-IF)</text>
        <polygon points="20,60 40,50 40,70" fill="#4dabf7"/><text x="16" y="88" fill="#9aa7b5" font-size="10">antenna</text>
        <rect x="55" y="48" width="46" height="26" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="60" y="65" fill="#e6edf3" font-size="9">LNA/BPF</text>
        <circle cx="140" cy="61" r="16" fill="#1c232e" stroke="#ffa94d"/><text x="131" y="65" fill="#e6edf3" font-size="10">IQ</text>
        <text x="120" y="98" fill="#9aa7b5" font-size="9">LO (PLL)</text>
        <rect x="130" y="105" width="20" height="14" rx="2" fill="#1c232e" stroke="#b197fc"/>
        <line x1="140" y1="105" x2="140" y2="77" stroke="#9aa7b5"/>
        <rect x="180" y="40" width="42" height="20" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="185" y="54" fill="#e6edf3" font-size="9">LPF I</text>
        <rect x="180" y="66" width="42" height="20" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="185" y="80" fill="#e6edf3" font-size="9">LPF Q</text>
        <rect x="240" y="40" width="40" height="20" rx="3" fill="#1c232e" stroke="#4dabf7"/><text x="246" y="54" fill="#e6edf3" font-size="9">ADC</text>
        <rect x="240" y="66" width="40" height="20" rx="3" fill="#1c232e" stroke="#4dabf7"/><text x="246" y="80" fill="#e6edf3" font-size="9">ADC</text>
        <rect x="300" y="48" width="60" height="26" rx="3" fill="#1c232e" stroke="#ffa94d"/><text x="306" y="65" fill="#e6edf3" font-size="9">DDC/dec</text>
        <rect x="380" y="48" width="70" height="26" rx="3" fill="#1c232e" stroke="#b197fc"/><text x="386" y="65" fill="#e6edf3" font-size="9">FPGA/CPU</text>
        <rect x="470" y="48" width="58" height="26" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="475" y="65" fill="#e6edf3" font-size="9">demod</text>
        <line x1="40" y1="60" x2="55" y2="60" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <line x1="101" y1="61" x2="124" y2="61" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <line x1="156" y1="55" x2="180" y2="50" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <line x1="156" y1="67" x2="180" y2="76" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <line x1="222" y1="50" x2="240" y2="50" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <line x1="222" y1="76" x2="240" y2="76" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <line x1="280" y1="61" x2="300" y2="61" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <line x1="360" y1="61" x2="380" y2="61" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <line x1="450" y1="61" x2="470" y2="61" stroke="#9aa7b5" marker-end="url(#arr-sdr)"/>
        <text x="180" y="150" fill="#9aa7b5" font-size="10">Analog front end shrinks left-to-right; DSP takes over after the ADCs.</text>
        </svg>`,
        caption: 'Zero-IF SDR receive chain: minimal RF front end, quadrature downconversion to IQ, dual ADCs, then digital down-conversion and software demodulation.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <text x="12" y="18" fill="#e6edf3" font-size="13">Quadrature (IQ) Downconversion</text>
        <line x1="30" y1="105" x2="90" y2="105" stroke="#9aa7b5"/><text x="20" y="100" fill="#9aa7b5" font-size="9">RF s(t)</text>
        <circle cx="120" cy="60" r="15" fill="#1c232e" stroke="#ffa94d"/><text x="114" y="64" fill="#e6edf3" font-size="12">x</text>
        <circle cx="120" cy="150" r="15" fill="#1c232e" stroke="#ffa94d"/><text x="114" y="154" fill="#e6edf3" font-size="12">x</text>
        <line x1="90" y1="105" x2="120" y2="75" stroke="#9aa7b5"/><line x1="90" y1="105" x2="120" y2="135" stroke="#9aa7b5"/>
        <text x="95" y="45" fill="#4dabf7" font-size="10">cos(2π f_c t)</text>
        <text x="95" y="185" fill="#4dabf7" font-size="10">-sin(2π f_c t)</text>
        <line x1="120" y1="45" x2="120" y2="75" stroke="#4dabf7"/><line x1="120" y1="135" x2="120" y2="165" stroke="#4dabf7"/>
        <rect x="160" y="48" width="50" height="24" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="168" y="64" fill="#e6edf3" font-size="10">LPF</text>
        <rect x="160" y="138" width="50" height="24" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="168" y="154" fill="#e6edf3" font-size="10">LPF</text>
        <line x1="135" y1="60" x2="160" y2="60" stroke="#9aa7b5"/><line x1="135" y1="150" x2="160" y2="150" stroke="#9aa7b5"/>
        <line x1="210" y1="60" x2="260" y2="60" stroke="#9aa7b5"/><text x="265" y="64" fill="#63e6be" font-size="12">I(t)</text>
        <line x1="210" y1="150" x2="260" y2="150" stroke="#9aa7b5"/><text x="265" y="154" fill="#63e6be" font-size="12">Q(t)</text>
        <rect x="320" y="80" width="200" height="90" rx="4" fill="#1c232e" stroke="#b197fc"/>
        <text x="330" y="100" fill="#e6edf3" font-size="11">Complex envelope</text>
        <text x="330" y="122" fill="#63e6be" font-size="13">̃s = I + jQ</text>
        <text x="330" y="145" fill="#9aa7b5" font-size="11">= A e^(jφ)</text>
        <text x="330" y="163" fill="#9aa7b5" font-size="10">rate ~ bandwidth, not f_c</text>
        </svg>`,
        caption: 'Quadrature downconversion produces I and Q; the complex envelope carries all amplitude/phase information at a rate set by bandwidth.'
      },
      {
        title: String.raw`Superheterodyne vs Zero-IF: where the IF stage lives`,
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr3-sdr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="16" fill="#e6edf3" font-size="13">Superheterodyne vs Zero-IF architectures</text>
        <text x="20" y="42" fill="#ffa94d" font-size="10">Superhet: extra IF mixing + image filter</text>
        <polygon points="20,72 36,63 36,81" fill="#4dabf7"/>
        <rect x="46" y="60" width="40" height="26" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="50" y="77" fill="#e6edf3" font-size="8">LNA/BPF</text>
        <circle cx="112" cy="73" r="13" fill="#1c232e" stroke="#ffa94d"/><text x="106" y="77" fill="#e6edf3" font-size="9">x</text>
        <rect x="140" y="60" width="46" height="26" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="144" y="72" fill="#e6edf3" font-size="8">IF SAW</text><text x="146" y="83" fill="#9aa7b5" font-size="7">image rej</text>
        <circle cx="212" cy="73" r="13" fill="#1c232e" stroke="#ffa94d"/><text x="206" y="77" fill="#e6edf3" font-size="9">x</text>
        <rect x="240" y="60" width="40" height="26" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="246" y="77" fill="#e6edf3" font-size="8">ADC</text>
        <rect x="300" y="60" width="52" height="26" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="306" y="77" fill="#e6edf3" font-size="8">DSP</text>
        <line x1="36" y1="72" x2="46" y2="72" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="86" y1="73" x2="98" y2="73" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="125" y1="73" x2="140" y2="73" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="186" y1="73" x2="198" y2="73" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="225" y1="73" x2="240" y2="73" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="280" y1="73" x2="300" y2="73" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <text x="105" y="106" fill="#9aa7b5" font-size="8">LO1</text><line x1="112" y1="98" x2="112" y2="86" stroke="#9aa7b5"/>
        <text x="205" y="106" fill="#9aa7b5" font-size="8">LO2</text><line x1="212" y1="98" x2="212" y2="86" stroke="#9aa7b5"/>
        <line x1="20" y1="120" x2="520" y2="120" stroke="#2b3440"/>
        <text x="20" y="142" fill="#63e6be" font-size="10">Zero-IF: one quadrature mixer straight to DC, no IF</text>
        <polygon points="20,178 36,169 36,187" fill="#4dabf7"/>
        <rect x="46" y="166" width="40" height="26" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="50" y="183" fill="#e6edf3" font-size="8">LNA/BPF</text>
        <circle cx="116" cy="179" r="14" fill="#1c232e" stroke="#ffa94d"/><text x="108" y="183" fill="#e6edf3" font-size="9">IQ</text>
        <rect x="150" y="152" width="42" height="22" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="156" y="167" fill="#e6edf3" font-size="8">LPF I</text>
        <rect x="150" y="182" width="42" height="22" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="156" y="197" fill="#e6edf3" font-size="8">LPF Q</text>
        <rect x="204" y="152" width="38" height="22" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="209" y="167" fill="#e6edf3" font-size="8">ADC</text>
        <rect x="204" y="182" width="38" height="22" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="209" y="197" fill="#e6edf3" font-size="8">ADC</text>
        <rect x="262" y="166" width="60" height="26" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="268" y="183" fill="#e6edf3" font-size="8">DSP demod</text>
        <line x1="36" y1="178" x2="46" y2="178" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="86" y1="178" x2="102" y2="178" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="130" y1="171" x2="150" y2="163" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="130" y1="187" x2="150" y2="193" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="192" y1="163" x2="204" y2="163" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="192" y1="193" x2="204" y2="193" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="242" y1="163" x2="262" y2="176" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <line x1="242" y1="193" x2="262" y2="182" stroke="#9aa7b5" marker-end="url(#arr3-sdr)"/>
        <text x="105" y="222" fill="#9aa7b5" font-size="8">LO = f_c</text><line x1="116" y1="207" x2="116" y2="193" stroke="#9aa7b5"/>
        <text x="330" y="180" fill="#9aa7b5" font-size="9">Zero-IF deletes the IF mixer</text>
        <text x="330" y="195" fill="#9aa7b5" font-size="9">and image SAW: one SoC,</text>
        <text x="330" y="210" fill="#9aa7b5" font-size="9">but DC/IQ impairments appear.</text>
        </svg>`,
        caption: 'Superheterodyne uses two mixing stages and a sharp IF image-reject filter; zero-IF collapses to a single quadrature mixer to DC, trading the image filter for near-DC impairments.'
      }
    ],
    equations: [
      {
        title: 'Bandpass signal in IQ form',
        tex: String.raw`$$s(t) = I(t)\cos(2\pi f_c t) - Q(t)\sin(2\pi f_c t) = \operatorname{Re}\!\left[\tilde s(t)\,e^{j2\pi f_c t}\right]$$`,
        derivation: String.raw`<p>Start from $s(t)=A(t)\cos(2\pi f_c t+\phi(t))$. Use the cosine sum identity: $A\cos(\omega_c t+\phi)=A\cos\phi\cos\omega_c t - A\sin\phi\sin\omega_c t$. Define $I=A\cos\phi$, $Q=A\sin\phi$, giving the first form. Since $\tilde s=I+jQ=Ae^{j\phi}$, we have $\tilde s e^{j\omega_c t}=Ae^{j(\omega_c t+\phi)}$, whose real part is $A\cos(\omega_c t+\phi)=s(t)$.</p>`
      },
      {
        title: 'IQ downconversion (recovering I, Q)',
        tex: String.raw`$$s(t)\cdot 2\cos(2\pi f_c t) \xrightarrow{\text{LPF}} I(t), \qquad s(t)\cdot(-2\sin(2\pi f_c t)) \xrightarrow{\text{LPF}} Q(t)$$`,
        derivation: String.raw`<p>Multiply $s=I\cos\omega_c t-Q\sin\omega_c t$ by $2\cos\omega_c t$: $2I\cos^2\omega_c t-2Q\sin\omega_c t\cos\omega_c t = I(1+\cos2\omega_c t)-Q\sin2\omega_c t$. The lowpass keeps only the DC (baseband) term $I(t)$; double-frequency terms are filtered. The $-2\sin\omega_c t$ path similarly yields $Q(t)$.</p>`
      },
      {
        title: 'Image rejection ratio from IQ imbalance',
        tex: String.raw`$$\text{IRR} \approx \frac{1}{(\varepsilon/2)^2 + (\psi/2)^2}, \quad \text{IRR}_{dB}=10\log_{10}\text{IRR}$$`,
        derivation: String.raw`<p>Model the imperfect quadrature LO as $\cos\omega t$ and $-(1+\varepsilon)\sin(\omega t+\psi)$. Decompose into the ideal complex exponential plus a small conjugate leakage term of relative amplitude $\approx \tfrac12\sqrt{\varepsilon^2+\psi^2}$. The image power relative to the desired is that amplitude squared, so image suppression $\text{IRR}=1/[(\varepsilon/2)^2+(\psi/2)^2]$. Example: $\varepsilon=0.01$, $\psi=0.0175$ rad gives IRR $\approx 40$ dB.</p>`
      },
      {
        title: 'Complex vs real sampling rate equivalence',
        tex: String.raw`$$f_{s,\text{complex}} \geq B \quad\Longleftrightarrow\quad f_{s,\text{real}} \geq 2B$$`,
        derivation: String.raw`<p>A real signal of bandwidth $B$ (one-sided) requires $f_s\ge 2B$ by Nyquist. The complex baseband occupies $[-B/2,+B/2]$, a two-sided width of $B$. Each complex sample is two real numbers, so a complex stream at rate $B$ carries $2B$ real samples/s - identical information content to real sampling at $2B$.</p>`
      },
      {
        title: 'DDC frequency shift (NCO mix)',
        tex: String.raw`$$y[n] = x[n]\,e^{-j2\pi f_0 n / f_s}$$`,
        derivation: String.raw`<p>To bring a channel centered at $f_0$ to DC, multiply the sampled complex signal by a complex exponential from a numerically controlled oscillator. In frequency this shifts $X(f)$ to $X(f+f_0)$, placing the channel at 0 Hz. A subsequent decimating lowpass isolates it and reduces the rate.</p>`
      },
      {
        title: 'Host data throughput',
        tex: String.raw`$$R_{data} = f_s \times N_{bits} \times 2_{(I,Q)} \times N_{ch}$$`,
        derivation: String.raw`<p>Each complex sample is $2N_{bits}$ bits; at $f_s$ samples/s per channel and $N_{ch}$ channels the raw rate is the product. Example: $f_s=61.44$ MS/s, $N_{bits}=12$, 2 channels $\Rightarrow 61.44\times12\times2\times2\approx 2.95$ Gb/s, near the limit of USB 3.0 and driving the choice of on-chip decimation.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the core design principle of an SDR?`, back: String.raw`Digitize as close to the antenna as practical, then implement radio functions (filtering, mixing, demod, decode) in reconfigurable software/logic.` },
      { front: String.raw`Define the complex envelope of a bandpass signal.`, back: String.raw`$\tilde s(t)=I(t)+jQ(t)=A(t)e^{j\phi(t)}$, where $I=A\cos\phi$ and $Q=A\sin\phi$.` },
      { front: String.raw`Why use IQ rather than a single real channel?`, back: String.raw`IQ distinguishes positive from negative frequencies (unambiguous two-sided spectrum) and lets the sample rate track bandwidth, not carrier frequency.` },
      { front: String.raw`Complex sample rate vs real sample rate for bandwidth B?`, back: String.raw`Complex $f_s \ge B$ equals real $f_s \ge 2B$ in information (two reals per complex sample).` },
      { front: String.raw`Main advantage of zero-IF architecture?`, back: String.raw`Highest integration/lowest cost: no image filter, only lowpass channel filters; ideal for monolithic transceivers.` },
      { front: String.raw`List the main zero-IF impairments.`, back: String.raw`DC offset, LO leakage/self-mixing, 1/f flicker noise, IQ gain/phase imbalance (image), and even-order distortion.` },
      { front: String.raw`What causes an image in a direct-conversion receiver?`, back: String.raw`IQ imbalance - gain mismatch and phase error break the 90 deg relationship, leaking a conjugate (mirror-frequency) image.` },
      { front: String.raw`IRR for 1% gain and 1 deg phase error?`, back: String.raw`IRR = 1/((0.005)^2+(0.00873)^2) approx 40 dB.` },
      { front: String.raw`What does a DDC do?`, back: String.raw`Mixes a channel to DC with an NCO, then decimates with a lowpass chain (CIC + FIR) to reduce sample rate.` },
      { front: String.raw`Why does interpolation need an anti-imaging filter?`, back: String.raw`Zero-stuffing (upsampling) creates spectral images at multiples of the old rate; the filter removes them.` },
      { front: String.raw`Where do FPGA, GPU, and CPU sit in an SDR?`, back: String.raw`FPGA: deterministic high-rate front-end DSP; GPU: bulk parallel processing; CPU: control, protocol, low-rate demod.` },
      { front: String.raw`What is GNU Radio?`, back: String.raw`An open framework building radios as flowgraphs of DSP blocks connected by sample streams, with hardware source blocks (UHD, Pluto, RTL-SDR).` },
      { front: String.raw`Role of AGC in an SDR?`, back: String.raw`Sets analog gain so the composite signal fills the ADC range without clipping, maximizing usable dynamic range.` },
      { front: String.raw`Why is low-IF sometimes preferred over zero-IF?`, back: String.raw`It moves the signal off DC to avoid DC offset and 1/f noise, trading an image that digital calibration suppresses.` },
      { front: String.raw`What does bandpass sampling exploit?`, back: String.raw`Deliberate aliasing to fold a bandpass signal into a low Nyquist zone, sampling at ~2B instead of 2f_high.` }
    ],
    mcqs: [
      { q: String.raw`The defining idea of an SDR is to:`, options: [String.raw`use only analog filters`, String.raw`digitize as close to the antenna as practical and process in software`, String.raw`avoid ADCs entirely`, String.raw`fix the modulation in hardware`], answer: 1, explain: String.raw`SDR moves radio functions into reconfigurable DSP by digitizing near the antenna.` },
      { q: String.raw`In $s=I\cos\omega_c t - Q\sin\omega_c t$, the complex envelope is:`, options: [String.raw`$I - jQ$`, String.raw`$I + jQ$`, String.raw`$Q + jI$`, String.raw`$I^2+Q^2$`], answer: 1, explain: String.raw`By definition $\tilde s = I + jQ = Ae^{j\phi}$.` },
      { q: String.raw`Complex sampling at rate $f_s$ carries the same information as real sampling at:`, options: [String.raw`$f_s/2$`, String.raw`$f_s$`, String.raw`$2f_s$`, String.raw`$4f_s$`], answer: 2, explain: String.raw`Two real values per complex sample, so complex $f_s$ = real $2f_s$.` },
      { q: String.raw`Which impairment is WORST for a signal sitting exactly at the center of a zero-IF channel?`, options: [String.raw`image rejection`, String.raw`DC offset and 1/f noise`, String.raw`anti-alias filtering`, String.raw`decimation droop`], answer: 1, explain: String.raw`Zero-IF puts the signal on DC, where DC offset and flicker noise are strongest.` },
      { q: String.raw`IQ imbalance produces primarily:`, options: [String.raw`thermal noise`, String.raw`an image at the mirror frequency`, String.raw`quantization error`, String.raw`phase noise`], answer: 1, explain: String.raw`Gain/phase mismatch leaks a conjugate image whose suppression is the IRR.` },
      { q: String.raw`A DDC consists of:`, options: [String.raw`interpolate then mix up`, String.raw`NCO mix to DC then decimate`, String.raw`only a CIC filter`, String.raw`a superheterodyne mixer`], answer: 1, explain: String.raw`Digital down-conversion mixes the channel to DC then decimates.` },
      { q: String.raw`Anti-imaging filters are required during:`, options: [String.raw`decimation`, String.raw`interpolation`, String.raw`quantization`, String.raw`AGC`], answer: 1, explain: String.raw`Upsampling creates images; anti-imaging (interpolation) filters remove them. Decimation needs anti-alias filters.` },
      { q: String.raw`Which architecture gives the best selectivity and dynamic range but poorest integration?`, options: [String.raw`zero-IF`, String.raw`low-IF`, String.raw`superheterodyne`, String.raw`direct RF sampling`], answer: 2, explain: String.raw`Superheterodyne uses sharp analog filters for excellent selectivity but is bulky/discrete.` },
      { q: String.raw`For deterministic, high-sample-rate front-end filtering, the best platform is:`, options: [String.raw`CPU`, String.raw`GPU`, String.raw`FPGA`, String.raw`microcontroller`], answer: 2, explain: String.raw`FPGAs give lowest, deterministic latency and very high throughput near the converters.` },
      { q: String.raw`GNU Radio models a radio as:`, options: [String.raw`a single monolithic C program`, String.raw`a flowgraph of connected DSP blocks`, String.raw`an analog schematic`, String.raw`a spreadsheet`], answer: 1, explain: String.raw`Blocks connected by sample streams form the flowgraph.` },
      { q: String.raw`Host throughput for 61.44 MS/s, 12-bit, 2 channels (I+Q) is about:`, options: [String.raw`0.7 Gb/s`, String.raw`1.5 Gb/s`, String.raw`2.95 Gb/s`, String.raw`12 Gb/s`], answer: 2, explain: String.raw`$61.44\times12\times2\times2\approx 2.95$ Gb/s.` },
      { q: String.raw`AGC in an SDR primarily sets analog gain to:`, options: [String.raw`increase phase noise`, String.raw`fill the ADC range without clipping`, String.raw`decimate the signal`, String.raw`generate the LO`], answer: 1, explain: String.raw`AGC maximizes usable dynamic range by scaling the composite to the ADC full scale.` },
      { q: String.raw`Bandpass (under) sampling works by:`, options: [String.raw`sampling faster than 2 f_high`, String.raw`deliberately aliasing a bandpass signal into a low Nyquist zone`, String.raw`removing the anti-alias filter`, String.raw`doubling the bit depth`], answer: 1, explain: String.raw`Controlled aliasing folds the band down; only bandwidth (not carrier) sets the minimum rate.` },
      { q: String.raw`Decimating to the signal bandwidth improves in-band SNR because it:`, options: [String.raw`adds dither`, String.raw`discards out-of-band quantization noise`, String.raw`raises the LO`, String.raw`increases IQ imbalance`], answer: 1, explain: String.raw`Oversampling processing gain: filtering before downsampling removes noise outside the retained band.` }
    ],
    numericals: [
      { q: String.raw`Compute the image rejection ratio (dB) for a zero-IF receiver with 0.5% gain mismatch and 0.5 deg phase error.`, solution: String.raw`<p><b>Formula.</b> $$\text{IRR}=\frac{1}{(\varepsilon/2)^2+(\psi/2)^2},\qquad \text{IRR}_{dB}=10\log_{10}\text{IRR}$$ where $\varepsilon$ is the fractional I/Q gain mismatch (dimensionless) and $\psi$ is the I/Q phase error in radians.</p>
      <p><b>Substitute.</b> $\varepsilon=0.005$, $\psi=0.5^\circ=0.5\times\pi/180=0.008727$ rad, so $$\text{IRR}=\frac{1}{(0.0025)^2+(0.004363)^2}.$$</p>
      <p><b>Compute.</b> $(0.0025)^2=6.25\times10^{-6}$; $(0.004363)^2=1.904\times10^{-5}$; sum $=2.529\times10^{-5}$. $\text{IRR}=1/2.529\times10^{-5}=3.95\times10^{4}$. In dB: $10\log_{10}(3.95\times10^{4})=45.97\approx 46$ dB.</p>
      <p><b>Explanation.</b> The image tone lands at the mirror frequency about 46 dB below the wanted signal - the phase error dominates here because $\psi$ in radians exceeds $\varepsilon$. This is typical of an uncalibrated direct-conversion receiver; higher-order modulation (e.g. 256-QAM) needs on-chip IQ calibration to push IRR well past this.</p>` },
      { q: String.raw`A wideband capture is 20 MHz. Give the minimum complex and equivalent real sample rates (ignore filter margin).`, solution: String.raw`<p><b>Formula.</b> $$f_{s,\text{complex}}\ge B,\qquad f_{s,\text{real}}\ge 2B$$ where $B$ is the signal bandwidth, $f_{s,\text{complex}}$ the complex (IQ) sample rate, and $f_{s,\text{real}}$ the equivalent real-sampling rate.</p>
      <p><b>Substitute.</b> $B=20$ MHz, so $f_{s,\text{complex}}\ge 20$ MHz and $f_{s,\text{real}}\ge 2\times20$ MHz.</p>
      <p><b>Compute.</b> $f_{s,\text{complex}}=20$ MS/s (complex); $f_{s,\text{real}}=40$ MS/s (real). Adding ~25% guard for the filter transition band gives about $25$ MS/s complex in practice.</p>
      <p><b>Explanation.</b> One complex sample equals two real samples, so a 20 MS/s IQ stream carries the same information as 40 MS/s real - this is why SDRs quote complex rates matched to bandwidth, not carrier. The 25% margin keeps the wanted band clear of the anti-alias filter's roll-off.</p>` },
      { q: String.raw`An SDR captures at 122.88 MS/s complex, 14-bit, single channel. What USB/link rate is needed?`, solution: String.raw`<p><b>Formula.</b> $$R=f_s\times N_{bits}\times 2_{(I,Q)}\times N_{ch}$$ where $f_s$ is the complex sample rate, $N_{bits}$ the bits per sample, the factor 2 accounts for the I and Q words, and $N_{ch}$ the number of channels.</p>
      <p><b>Substitute.</b> $f_s=122.88\times10^{6}$ S/s, $N_{bits}=14$, $N_{ch}=1$: $$R=122.88\times10^{6}\times14\times2\times1.$$</p>
      <p><b>Compute.</b> $122.88\times10^{6}\times14=1.720\times10^{9}$; $\times2=3.44\times10^{9}=3.44$ Gb/s.</p>
      <p><b>Explanation.</b> 3.44 Gb/s exceeds USB 3.0's ~3.2 Gb/s usable payload, so the raw stream cannot be shipped whole - on-chip decimation to a narrower channel, or a PCIe/10 GbE link, is required. This is the practical bottleneck that forces the digital front end to reduce rate before the host.</p>` },
      { q: String.raw`A DDC must retain a 200 kHz channel from a 20 MHz-wide capture at 20 MS/s. What decimation factor reaches a 500 kS/s output?`, solution: String.raw`<p><b>Formula.</b> $$M=\frac{f_{s,in}}{f_{s,out}}$$ where $M$ is the integer decimation factor, $f_{s,in}$ the DDC input rate, and $f_{s,out}$ the desired output rate.</p>
      <p><b>Substitute.</b> $f_{s,in}=20\times10^{6}$ S/s, $f_{s,out}=500\times10^{3}$ S/s: $$M=\frac{20\times10^{6}}{500\times10^{3}}.$$</p>
      <p><b>Compute.</b> $M=40$. Realize as a CIC of decimation 40 (or CIC 20 followed by an FIR of 2) plus a droop-compensating FIR, yielding the 500 kS/s complex channel.</p>
      <p><b>Explanation.</b> The 500 kS/s complex output has Nyquist $\pm250$ kHz, comfortably wider than the $\pm100$ kHz half-bandwidth of the 200 kHz channel, so nothing wanted is lost. Decimating discards the out-of-band 19.8 MHz of noise, delivering oversampling processing gain on top of channel isolation.</p>` },
      { q: String.raw`Oversampling by a factor of 16 relative to Nyquist gives how much SNR processing gain in dB?`, solution: String.raw`<p><b>Formula.</b> $$\Delta\text{SNR}=10\log_{10}(\text{OSR})$$ where OSR is the oversampling ratio $f_s/(2B)$ and $\Delta\text{SNR}$ the in-band SNR improvement after filtering to bandwidth $B$.</p>
      <p><b>Substitute.</b> $\text{OSR}=16$: $$\Delta\text{SNR}=10\log_{10}16.$$</p>
      <p><b>Compute.</b> $\log_{10}16=1.204$, so $\Delta\text{SNR}=12.04$ dB.</p>
      <p><b>Explanation.</b> 12.04 dB is about 2 extra ENOB ($12.04/6.02$), consistent with ~3 dB/octave over $\log_2 16=4$ octaves. Sanity check: each octave of oversampling buys half a bit, so 4 octaves buys 2 bits - oversampling is a real but expensive way to gain resolution, which motivates noise shaping.</p>` },
      { q: String.raw`A zero-IF transmitter has residual LO feedthrough of -35 dBc. Express as a linear ratio and comment.`, solution: String.raw`<p><b>Formula.</b> $$\frac{P_{spur}}{P_{carrier}}=10^{L_{dBc}/10}$$ where $L_{dBc}$ is the feedthrough level in dBc (dB relative to the carrier) and the ratio is a linear power fraction.</p>
      <p><b>Substitute.</b> $L_{dBc}=-35$ dBc: $$\frac{P_{spur}}{P_{carrier}}=10^{-35/10}=10^{-3.5}.$$</p>
      <p><b>Compute.</b> $10^{-3.5}=3.16\times10^{-4}$ of the carrier power (equivalently $\sqrt{3.16\times10^{-4}}=1.78\times10^{-2}$, i.e. 1.8% in voltage amplitude).</p>
      <p><b>Explanation.</b> This LO self-mixing spur sits right at the carrier/center frequency, exactly where a DC-centered channel is most sensitive. On-chip DC-bias (LO-leakage) calibration typically drives it below -50 dBc ($10^{-5}$), which is why zero-IF transmitters need active cancellation to meet spectral masks.</p>` }
    ],
    realWorld: String.raw`<p>SDR is now the default architecture across the RF industry. Cellular basestations use direct-conversion transceivers with digital front ends so one radio serves multiple bands and standards (2G-5G) via software. Test-and-measurement vendors build vector signal analyzers/generators on SDR platforms. In defense, wideband SDRs support electronic warfare, signal intelligence, and cognitive/anti-jam waveforms that adapt in software. Open platforms - RTL-SDR (cheap RX-only), Ettus USRP (UHD driver), and the ADALM-PLUTO (AD9361-based) - have made SDR ubiquitous in research and education, almost always programmed through GNU Radio flowgraphs or MATLAB/Simulink.</p>`,
    related: ['adc', 'dac', 'ad9361', 'rfsoc', 'comm-basics']
  },

  {
    id: 'adc',
    title: 'Analog-to-Digital Converter (ADC)',
    category: 'SDR & Data Converters',
    tags: ['adc', 'sampling', 'nyquist', 'quantization', 'snr', 'enob', 'sfdr', 'sigma-delta'],
    summary: String.raw`An ADC samples a continuous signal in time and quantizes it in amplitude; its performance is bounded by the sampling theorem, quantization noise, jitter, and linearity, summarized by SNR, ENOB, SFDR, and SINAD.`,
    prerequisites: ['comm-basics', 'noise', 'psd', 'sdr'],
    intro: String.raw`<p><b>Why does the ADC matter so much?</b> Every digital system - your phone, an SDR, an oscilloscope - lives behind an ADC, and the ADC is the gate through which the analog world must pass. Whatever information it loses at that gate can never be recovered downstream, no matter how clever the DSP. So the ADC sets the ceiling on the entire system's fidelity: its bits, its speed, and its noise decide how weak a signal you can hear and how strong a blocker you can survive. Understanding it is understanding the fundamental limit of everything after it.</p>
    <p>An <b>Analog-to-Digital Converter</b> performs two distinct operations: <b>sampling</b> (discretizing time) and <b>quantization</b> (discretizing amplitude). Sampling is governed by the Nyquist-Shannon theorem and, when violated deliberately, by aliasing/undersampling. Quantization introduces an irreducible error that, treated as noise, sets the fundamental dynamic-range limit. The famous result $\text{SNR}_{ideal}=6.02N+1.76$ dB ties bit depth to achievable signal-to-noise ratio, while real converters fall short by an amount captured in <b>ENOB</b>.</p>
    <p>Understanding an ADC means understanding where its noise and spurs come from - quantization, thermal noise, aperture jitter, and nonlinearity - and how techniques like oversampling and noise shaping (sigma-delta) trade sample rate for resolution.</p>`,
    sections: [
      {
        h: 'Sampling Theorem, Nyquist Zones and Aliasing',
        html: String.raw`<p>The <b>Nyquist-Shannon sampling theorem</b> states that a signal band-limited to $B$ Hz is fully recoverable from samples taken at $f_s > 2B$. The frequency $f_s/2$ is the <b>Nyquist frequency</b>. Any energy above $f_s/2$ folds (aliases) back into the baseband: an input at $f_{in}$ appears at $f_{alias}=|f_{in}-k f_s|$ for the integer $k$ that brings it into $[0,f_s/2]$.</p>
        <p>The spectrum repeats every $f_s$, dividing frequency into <b>Nyquist zones</b>: zone 1 is $[0,f_s/2]$, zone 2 is $[f_s/2,f_s]$ (spectrally inverted), zone 3 is $[f_s,3f_s/2]$, etc. An <b>anti-alias filter</b> before the ADC must suppress everything outside the intended zone.</p>
        <ul>
          <li><b>Nyquist sampling</b> - signal in zone 1, $f_s>2B$.</li>
          <li><b>Bandpass / undersampling</b> - signal placed in a higher Nyquist zone; controlled aliasing folds it to baseband, so $f_s$ need only exceed $2B$ (bandwidth), not $2f_{high}$. Requires a bandpass anti-alias filter and low aperture jitter (the effective input frequency is high).</li>
        </ul>`
      },
      {
        h: 'Quantization Error and Its Noise Model',
        html: String.raw`<div class="callout tip"><b>Intuition:</b> quantizing is like rounding every measurement to the nearest tick on a ruler. If the ticks are $\Delta$ apart, your worst rounding error is half a tick, and on average the error looks like a small random "hiss" added to the signal. That is the whole trick - we treat rounding as if it were noise, which lets us put a single number ($\Delta^2/12$) on it and reason about SNR.</div>
        <p>An $N$-bit ADC with full-scale range $V_{FS}$ has step size (LSB) $\Delta=V_{FS}/2^N$. Rounding to the nearest level introduces an error $e$ uniformly distributed in $[-\Delta/2,+\Delta/2]$ (valid when the signal is busy and spans many codes). The error power (variance) is</p>
        $$\sigma_q^2=\frac{1}{\Delta}\int_{-\Delta/2}^{\Delta/2} e^2\,de = \frac{\Delta^2}{12}.$$
        <p>This is the celebrated <b>quantization noise power</b>. Modeling it as additive white noise spread uniformly across the Nyquist band $[0,f_s/2]$ gives a quantization-noise PSD of $\sigma_q^2/(f_s/2)$. Two consequences follow immediately: more bits reduce $\Delta$ and hence noise; spreading fixed noise over a wider band (oversampling) reduces the in-band portion.</p>`
      },
      {
        h: 'Ideal SNR, SINAD, ENOB and SFDR',
        html: String.raw`<p>For a full-scale sinusoid of amplitude $V_{FS}/2$, signal power is $(V_{FS}/2)^2/2=V_{FS}^2/8$. With $\sigma_q^2=\Delta^2/12=V_{FS}^2/(12\cdot2^{2N})$, the ratio gives the ideal SNR (derived below): $\boxed{\text{SNR}_{ideal}=6.02N+1.76\text{ dB}}$.</p>
        <ul>
          <li><b>SINAD</b> (signal-to-noise-and-distortion) includes harmonics/spurs, so SINAD $\le$ SNR.</li>
          <li><b>ENOB</b> (effective number of bits) back-solves the ideal formula from measured SINAD: $\text{ENOB}=\dfrac{\text{SINAD}-1.76}{6.02}$.</li>
          <li><b>SFDR</b> (spurious-free dynamic range) is the ratio of the fundamental to the largest spur, regardless of frequency; it sets how weak a signal can be detected next to a strong one.</li>
          <li><b>THD</b> sums harmonic power relative to the fundamental.</li>
        </ul>
        <div class="callout"><b>Worked:</b> a 12-bit ADC has ideal SNR $=6.02\times12+1.76=74.0$ dB. If a datasheet quotes SINAD $=68$ dB, then ENOB $=(68-1.76)/6.02=11.0$ bits - it behaves like an ideal 11-bit part.</div>`
      },
      {
        h: 'Aperture Jitter and Thermal Noise',
        html: String.raw`<p>Two real-world noise floors add to quantization:</p>
        <ul>
          <li><b>Aperture jitter</b> $t_j$ - uncertainty in the sample instant. For a sinusoid of frequency $f_{in}$ and amplitude $A$, a timing error $\delta t$ produces a voltage error $A\cdot 2\pi f_{in}\cos(\cdot)\,\delta t$. The resulting jitter-limited SNR is $\text{SNR}_{jitter}=-20\log_{10}(2\pi f_{in} t_j)$. Crucially this depends on <b>input frequency</b>, not sample rate - which is why undersampling a high RF frequency demands extremely low jitter.</li>
          <li><b>Thermal noise</b> - kT/C sampling noise and amplifier noise set a floor independent of quantization. High-resolution ADCs are usually thermal-limited, not quantization-limited.</li>
        </ul>
        <p>The overall SNR combines contributions in power: $\text{SNR}^{-1}=\text{SNR}_q^{-1}+\text{SNR}_{jitter}^{-1}+\text{SNR}_{thermal}^{-1}$ (adding noise powers).</p>`
      },
      {
        h: 'Oversampling and Processing Gain',
        html: String.raw`<p>Quantization noise power $\Delta^2/12$ is (approximately) constant and spread over $[0,f_s/2]$. If the signal of interest occupies only bandwidth $B$, a lowpass keeping $[0,B]$ discards the rest of the noise. The <b>oversampling ratio</b> is $\text{OSR}=f_s/(2B)$ and the in-band noise reduction is</p>
        $$\Delta\text{SNR}=10\log_{10}(\text{OSR})\;\text{dB} \approx 3\text{ dB per octave of oversampling}.$$
        <p>Each doubling of $f_s$ adds 3 dB (half a bit) of SNR. To gain a full bit ($6.02$ dB) you must oversample by $4\times$. Pure oversampling is therefore an expensive way to buy resolution - which motivates noise shaping.</p>`
      },
      {
        h: 'Sigma-Delta Modulation: Noise Shaping',
        html: String.raw`<div class="callout tip"><b>The key idea in one sentence:</b> plain oversampling spreads quantization noise thinner everywhere; noise <i>shaping</i> actively <b>sweeps the noise out of the band you care about</b> and piles it up at high frequencies, where a digital filter can throw it away. It is the difference between diluting dirt across a whole floor versus sweeping it into one corner and removing the corner.</div>
        <p>A <b>sigma-delta (ΣΔ) ADC</b> combines heavy oversampling with a feedback loop containing an integrator and a coarse (often 1-bit) quantizer. The loop acts as a lowpass to the signal but a highpass to the quantization noise - it <b>shapes</b> the noise out of the baseband and up to high frequencies, where a digital decimation filter removes it.</p>
        <p>For an $L$-th order modulator with OSR, the in-band quantization noise and SNR improve as</p>
        $$\text{SNR} \approx 6.02N + 1.76 + (20L+10)\log_{10}(\text{OSR}) - 10\log_{10}\!\frac{\pi^{2L}}{2L+1}.$$
        <ul>
          <li>Each doubling of OSR adds $\approx 3(2L+1)$ dB, i.e. $(6L+3)$ dB per octave.</li>
          <li>A 1st-order loop gains 9 dB/octave (1.5 bits); a 2nd-order loop gains 15 dB/octave (2.5 bits).</li>
          <li>Trades speed for resolution - excellent for audio/precision (24-bit), less so for wideband RF.</li>
        </ul>`
      },
      {
        h: 'ADC Architectures Compared',
        html: String.raw`<table class="data">
          <tr><th>Architecture</th><th>Resolution</th><th>Speed</th><th>Use</th><th>Notes</th></tr>
          <tr><td>Flash</td><td>Low (6-8b)</td><td>Very high (GSPS)</td><td>RF, oscilloscopes</td><td>$2^N-1$ comparators; power/area explode with bits</td></tr>
          <tr><td>Pipeline</td><td>Medium (10-16b)</td><td>High (100s MSPS)</td><td>SDR, imaging</td><td>Stages resolve bits sequentially with latency</td></tr>
          <tr><td>SAR</td><td>Medium-high (12-18b)</td><td>Moderate (MSPS)</td><td>Sensors, DAQ</td><td>Binary search; low power</td></tr>
          <tr><td>Sigma-Delta</td><td>Very high (16-24b)</td><td>Low-moderate</td><td>Audio, precision</td><td>Oversampled, noise-shaped</td></tr>
        </table>
        <p>SDR receivers overwhelmingly use pipeline (and increasingly RF-sampling) ADCs for their balance of speed and resolution.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<ul>
          <li><b>Two operations:</b> sampling (discretize time, governed by Nyquist $f_s>2B$ and aliasing $|f_{in}-kf_s|$) and quantization (discretize amplitude, noise power $\Delta^2/12$) - each with its own limit.</li>
          <li><b>The master formula:</b> ideal $\text{SNR}=6.02N+1.76$ dB, and its inverse $\text{ENOB}=(\text{SINAD}-1.76)/6.02$ tells you the <i>real</i> resolution a converter delivers at a given frequency.</li>
          <li><b>Real noise floors:</b> aperture jitter ($\text{SNR}=-20\log_{10}(2\pi f_{in}t_j)$, worse at high input frequency) and thermal noise usually dominate over quantization in high-resolution parts.</li>
          <li><b>Buying resolution:</b> oversampling gives $10\log_{10}(\text{OSR})$ (~3 dB/octave); noise shaping of order $L$ gives a far steeper $(6L+3)$ dB/octave - the reason $\Sigma\Delta$ reaches 24 bits.</li>
          <li><b>Undersampling:</b> deliberately aliasing a bandpass signal to baseband needs only $f_s>2B$, not $2f_{high}$ - but punishes jitter because $f_{in}$ is high.</li>
          <li><b>Architecture map:</b> flash (fast/low-res), pipeline (SDR sweet spot), SAR (low-power precision), $\Sigma\Delta$ (highest resolution) - pick by the speed/resolution/power corner you need.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Analog-to-digital_converter" target="_blank" rel="noopener">Wikipedia — Analog-to-digital converter</a> — canonical survey of sampling, quantization, resolution metrics, and every major ADC architecture.</li>
<li><a href="https://www.dspguide.com/ch3/1.htm" target="_blank" rel="noopener">Smith — DSP Guide, Ch. 3: ADC and DAC</a> — Steven Smith's clear, intuition-first chapter on sampling theory, quantization noise, and dithering.</li>
<li><a href="https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/resources/lecture-22-sampling-and-quantization/" target="_blank" rel="noopener">MIT OCW 6.003 — Lecture 22: Sampling and Quantization</a> — university lecture notes/video deriving the sampling theorem and quantization from first principles.</li>
<li><a href="https://en.wikipedia.org/wiki/Effective_number_of_bits" target="_blank" rel="noopener">Wikipedia — Effective number of bits (ENOB)</a> — the SINAD/ENOB relationship and why real resolution falls below the nominal bit count.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Nyquist: recover a signal band-limited to $B$ if $f_s>2B$; energy above $f_s/2$ aliases to $|f_{in}-kf_s|$.`,
      String.raw`Nyquist zones repeat every $f_s$; even zones are spectrally inverted. Anti-alias filtering isolates the intended zone.`,
      String.raw`Quantization noise power is $\sigma_q^2=\Delta^2/12$ with $\Delta=V_{FS}/2^N$.`,
      String.raw`Ideal ADC SNR $=6.02N+1.76$ dB for a full-scale sinusoid.`,
      String.raw`ENOB $=(\text{SINAD}-1.76)/6.02$; SINAD includes distortion so ENOB < N in practice.`,
      String.raw`SFDR is fundamental-to-largest-spur ratio; sets detectability of a weak signal near a strong one.`,
      String.raw`Aperture jitter SNR $=-20\log_{10}(2\pi f_{in}t_j)$ depends on input frequency, not sample rate - critical for undersampling.`,
      String.raw`Oversampling gain $=10\log_{10}(\text{OSR})\approx$ 3 dB/octave (a full bit needs $4\times$ oversampling).`,
      String.raw`Sigma-delta noise shaping (order $L$) gives $(6L+3)$ dB/octave, trading speed for high resolution.`,
      String.raw`Total SNR is the power-sum of quantization, jitter, and thermal contributions; high-res ADCs are usually thermal-limited.`,
      String.raw`Bandpass/undersampling folds a high-frequency band to baseband, needing $f_s>2B$ (bandwidth), not $2f_{high}$.`,
      String.raw`Flash (fast/low-res), pipeline (SDR sweet spot), SAR (low-power precision), sigma-delta (highest resolution).`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <text x="12" y="18" fill="#e6edf3" font-size="13">Sampling and Aliasing (Nyquist zones)</text>
        <line x1="30" y1="180" x2="520" y2="180" stroke="#9aa7b5"/>
        <line x1="30" y1="180" x2="30" y2="40" stroke="#9aa7b5"/>
        <text x="500" y="197" fill="#9aa7b5" font-size="10">f</text>
        <line x1="150" y1="180" x2="150" y2="45" stroke="#4dabf7" stroke-dasharray="3 3"/><text x="120" y="40" fill="#4dabf7" font-size="10">f_s/2</text>
        <line x1="270" y1="180" x2="270" y2="45" stroke="#63e6be" stroke-dasharray="3 3"/><text x="255" y="40" fill="#63e6be" font-size="10">f_s</text>
        <line x1="390" y1="180" x2="390" y2="45" stroke="#63e6be" stroke-dasharray="3 3"/><text x="360" y="40" fill="#63e6be" font-size="10">3f_s/2</text>
        <text x="70" y="175" fill="#4dabf7" font-size="9">zone1</text>
        <text x="190" y="175" fill="#ffa94d" font-size="9">zone2</text>
        <text x="310" y="175" fill="#4dabf7" font-size="9">zone3</text>
        <circle cx="330" cy="90" r="6" fill="#ff6b6b"/><text x="315" y="80" fill="#ff6b6b" font-size="10">f_in</text>
        <circle cx="90" cy="90" r="6" fill="#b197fc"/><text x="60" y="80" fill="#b197fc" font-size="10">alias</text>
        <path d="M330,96 Q210,150 96,96" stroke="#b197fc" fill="none" stroke-dasharray="4 3"/>
        <text x="180" y="145" fill="#9aa7b5" font-size="9">folds by |f_in - k f_s|</text>
        </svg>`,
        caption: 'The spectrum repeats every f_s; a tone in zone 3 aliases into zone 1. Even zones are spectrally inverted.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr-adc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="18" fill="#e6edf3" font-size="13">First-order Sigma-Delta ADC</text>
        <line x1="20" y1="90" x2="55" y2="90" stroke="#9aa7b5" marker-end="url(#arr-adc)"/><text x="18" y="80" fill="#9aa7b5" font-size="10">x</text>
        <circle cx="65" cy="90" r="10" fill="#1c232e" stroke="#ffa94d"/><text x="59" y="94" fill="#e6edf3" font-size="12">+</text>
        <text x="52" y="120" fill="#ff6b6b" font-size="11">-</text>
        <rect x="90" y="78" width="60" height="24" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="96" y="94" fill="#e6edf3" font-size="10">integ 1/(1-z^-1)</text>
        <rect x="170" y="78" width="55" height="24" rx="3" fill="#1c232e" stroke="#4dabf7"/><text x="176" y="94" fill="#e6edf3" font-size="9">1-bit ADC</text>
        <line x1="75" y1="90" x2="90" y2="90" stroke="#9aa7b5" marker-end="url(#arr-adc)"/>
        <line x1="150" y1="90" x2="170" y2="90" stroke="#9aa7b5" marker-end="url(#arr-adc)"/>
        <line x1="225" y1="90" x2="270" y2="90" stroke="#9aa7b5" marker-end="url(#arr-adc)"/>
        <rect x="270" y="78" width="65" height="24" rx="3" fill="#1c232e" stroke="#b197fc"/><text x="276" y="94" fill="#e6edf3" font-size="9">decimator</text>
        <line x1="335" y1="90" x2="375" y2="90" stroke="#9aa7b5" marker-end="url(#arr-adc)"/><text x="380" y="94" fill="#63e6be" font-size="10">N-bit out</text>
        <rect x="150" y="140" width="55" height="20" rx="3" fill="#1c232e" stroke="#4dabf7"/><text x="156" y="154" fill="#e6edf3" font-size="9">1-bit DAC</text>
        <line x1="197" y1="102" x2="197" y2="140" stroke="#9aa7b5"/><line x1="150" y1="150" x2="65" y2="150" stroke="#9aa7b5"/><line x1="65" y1="150" x2="65" y2="100" stroke="#9aa7b5" marker-end="url(#arr-adc)"/>
        <text x="250" y="185" fill="#9aa7b5" font-size="9">Loop is LP to signal, HP to quantization noise (noise shaping).</text>
        </svg>`,
        caption: 'Sigma-delta modulator: integrator + coarse quantizer in feedback shapes quantization noise out of band; a decimation filter removes it.'
      },
      {
        title: String.raw`SAR successive-approximation loop`,
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr3-adc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="18" fill="#e6edf3" font-size="13">SAR ADC: binary-search loop</text>
        <line x1="20" y1="70" x2="55" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-adc)"/><text x="16" y="62" fill="#9aa7b5" font-size="10">V_in</text>
        <rect x="55" y="56" width="46" height="28" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="60" y="74" fill="#e6edf3" font-size="8">S/H</text>
        <path d="M120,50 L120,90 L152,70 Z" fill="#1c232e" stroke="#ffa94d"/><text x="123" y="74" fill="#e6edf3" font-size="9">cmp</text>
        <line x1="101" y1="70" x2="120" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-adc)"/>
        <rect x="175" y="52" width="70" height="36" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="181" y="68" fill="#e6edf3" font-size="8">SAR logic</text><text x="181" y="82" fill="#9aa7b5" font-size="7">bit register</text>
        <line x1="152" y1="70" x2="175" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-adc)"/>
        <rect x="175" y="120" width="70" height="30" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="181" y="139" fill="#e6edf3" font-size="8">N-bit DAC</text>
        <line x1="210" y1="88" x2="210" y2="120" stroke="#9aa7b5" marker-end="url(#arr3-adc)"/><text x="214" y="108" fill="#9aa7b5" font-size="7">trial code</text>
        <path d="M175,135 L110,135 L110,72" stroke="#9aa7b5" fill="none" marker-end="url(#arr3-adc)"/><text x="112" y="150" fill="#9aa7b5" font-size="7">V_dac to -in</text>
        <text x="106" y="46" fill="#ff6b6b" font-size="8">+</text><text x="106" y="98" fill="#63e6be" font-size="8">-</text>
        <line x1="245" y1="70" x2="290" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-adc)"/><text x="295" y="74" fill="#63e6be" font-size="9">N-bit code</text>
        <text x="20" y="180" fill="#9aa7b5" font-size="9">Test MSB first: set bit, compare V_in vs DAC output;</text>
        <text x="20" y="196" fill="#9aa7b5" font-size="9">keep bit if V_in larger, else clear. One bit per clock -> N cycles.</text>
        </svg>`,
        caption: 'SAR ADC: a comparator, N-bit feedback DAC, and successive-approximation register run a binary search, resolving one bit per clock (MSB to LSB) over N cycles.'
      }
    ],
    equations: [
      {
        title: 'Quantization noise power',
        tex: String.raw`$$\sigma_q^2=\frac{\Delta^2}{12}, \qquad \Delta=\frac{V_{FS}}{2^N}$$`,
        derivation: String.raw`<p>The rounding error $e$ is modeled uniform on $[-\Delta/2,\Delta/2]$ with pdf $1/\Delta$. Its mean is zero and variance $\sigma_q^2=\int_{-\Delta/2}^{\Delta/2} e^2\,(1/\Delta)\,de = (1/\Delta)\,[e^3/3]_{-\Delta/2}^{\Delta/2} = (1/\Delta)\cdot 2\cdot(\Delta^3/24)=\Delta^2/12$.</p>`
      },
      {
        title: 'Ideal SNR = 6.02N + 1.76 dB',
        tex: String.raw`$$\text{SNR}_{ideal}=6.02\,N + 1.76\ \text{dB}$$`,
        derivation: String.raw`<p>Full-scale sine amplitude $=V_{FS}/2$, signal power $P_s=(V_{FS}/2)^2/2=V_{FS}^2/8$. With $\Delta=V_{FS}/2^N$, noise $P_q=\Delta^2/12=V_{FS}^2/(12\cdot2^{2N})$. Ratio $P_s/P_q=(V_{FS}^2/8)\cdot(12\cdot2^{2N}/V_{FS}^2)=\tfrac{12}{8}2^{2N}=1.5\cdot2^{2N}$. In dB: $10\log_{10}(1.5)+20N\log_{10}2 = 1.76 + 6.02N$.</p>`
      },
      {
        title: 'ENOB from SINAD',
        tex: String.raw`$$\text{ENOB}=\frac{\text{SINAD}-1.76}{6.02}$$`,
        derivation: String.raw`<p>Invert the ideal formula, replacing SNR with the measured SINAD (which folds in distortion and all noise): $\text{SINAD}=6.02\,\text{ENOB}+1.76 \Rightarrow \text{ENOB}=(\text{SINAD}-1.76)/6.02$. This reports the resolution of an ideal ADC that would match the measured performance.</p>`
      },
      {
        title: 'Aperture-jitter-limited SNR',
        tex: String.raw`$$\text{SNR}_{jitter}=-20\log_{10}\!\left(2\pi f_{in}\,t_j\right)$$`,
        derivation: String.raw`<p>For $v(t)=A\sin(2\pi f_{in}t)$, $dv/dt=A2\pi f_{in}\cos(\cdot)$. A timing jitter $t_j$ (rms) creates voltage error $\sigma_e=A2\pi f_{in}t_j/\sqrt2$ (rms of $\cos$ gives the $\sqrt2$). Signal rms $=A/\sqrt2$. So SNR $=A/\sqrt2 \div (A2\pi f_{in}t_j/\sqrt2)=1/(2\pi f_{in}t_j)$, i.e. $-20\log_{10}(2\pi f_{in}t_j)$ dB. Note dependence on $f_{in}$, not $f_s$.</p>`
      },
      {
        title: 'Oversampling processing gain',
        tex: String.raw`$$\Delta\text{SNR}=10\log_{10}\!\left(\frac{f_s}{2B}\right)=10\log_{10}(\text{OSR})$$`,
        derivation: String.raw`<p>Quantization noise $\Delta^2/12$ is spread uniformly over $[0,f_s/2]$, so the in-band fraction retained after filtering to $B$ is $B/(f_s/2)=1/\text{OSR}$. Reducing noise by that factor raises SNR by $10\log_{10}(\text{OSR})$ dB - about 3 dB per doubling of $f_s$.</p>`
      },
      {
        title: 'Alias frequency (undersampling)',
        tex: String.raw`$$f_{alias}=\left|\,f_{in}-k f_s\,\right|,\quad k=\text{round}(f_{in}/f_s)$$`,
        derivation: String.raw`<p>Sampling replicates the spectrum at every multiple of $f_s$. The observed tone is the replica nearest baseband: pick the integer $k$ that minimizes $|f_{in}-kf_s|$; the magnitude is the alias. If $k$ is such that the band lands in an even Nyquist zone, the spectrum is additionally inverted.</p>`
      },
      {
        title: 'Sigma-delta noise-shaped SNR',
        tex: String.raw`$$\text{SNR}\approx 6.02N+1.76+(20L+10)\log_{10}(\text{OSR})-10\log_{10}\frac{\pi^{2L}}{2L+1}$$`,
        derivation: String.raw`<p>An $L$-th order loop shapes the noise transfer function as $|1-z^{-1}|^{2L}\approx (2\sin(\pi f/f_s))^{2L}$. Integrating shaped noise over the baseband $[0,B]$ and comparing to signal power yields the $ (20L+10)\log_{10}\text{OSR}$ term - i.e. $(6L+3)$ dB per octave of OSR - minus a fixed penalty $10\log_{10}[\pi^{2L}/(2L+1)]$ from the shaping constant.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`State the Nyquist-Shannon sampling theorem.`, back: String.raw`A signal band-limited to B Hz is fully recoverable from samples at $f_s>2B$; $f_s/2$ is the Nyquist frequency.` },
      { front: String.raw`Give the alias frequency formula.`, back: String.raw`$f_{alias}=|f_{in}-kf_s|$ with $k$ the integer bringing it into $[0,f_s/2]$.` },
      { front: String.raw`What is the quantization noise power?`, back: String.raw`$\sigma_q^2=\Delta^2/12$ with $\Delta=V_{FS}/2^N$ (error uniform on $\pm\Delta/2$).` },
      { front: String.raw`Ideal ADC SNR formula?`, back: String.raw`$\text{SNR}_{ideal}=6.02N+1.76$ dB for a full-scale sinusoid.` },
      { front: String.raw`Define ENOB.`, back: String.raw`Effective number of bits $=(\text{SINAD}-1.76)/6.02$; the ideal-ADC resolution matching measured performance.` },
      { front: String.raw`SNR vs SINAD vs SFDR?`, back: String.raw`SNR excludes distortion; SINAD includes noise+distortion; SFDR is fundamental-to-largest-spur ratio.` },
      { front: String.raw`Aperture-jitter SNR formula and why it matters?`, back: String.raw`$-20\log_{10}(2\pi f_{in}t_j)$; depends on input frequency, so undersampling high RF needs very low jitter.` },
      { front: String.raw`Oversampling gain per octave?`, back: String.raw`~3 dB per doubling of $f_s$ ($10\log_{10}\text{OSR}$); a full bit needs 4x oversampling.` },
      { front: String.raw`How does a sigma-delta ADC gain resolution?`, back: String.raw`Oversampling plus a feedback loop that highpass-shapes quantization noise out of band, then digital decimation removes it.` },
      { front: String.raw`Noise-shaping gain per octave for order L?`, back: String.raw`$(6L+3)$ dB/octave: 9 dB (L=1), 15 dB (L=2), etc.` },
      { front: String.raw`What is undersampling / bandpass sampling?`, back: String.raw`Placing a signal in a higher Nyquist zone so controlled aliasing folds it to baseband; $f_s>2B$ suffices.` },
      { front: String.raw`Why are high-resolution ADCs usually thermal-limited?`, back: String.raw`Beyond ~14 bits, kT/C and amplifier thermal noise exceed quantization noise, so adding bits does not help.` },
      { front: String.raw`Best ADC architecture for GSPS RF?`, back: String.raw`Flash (very fast, low resolution) or interleaved pipeline; RF-sampling converters combine speed with moderate bits.` },
      { front: String.raw`What does an anti-alias filter do?`, back: String.raw`Suppresses energy outside the intended Nyquist zone before sampling to prevent it folding onto the signal.` },
      { front: String.raw`Even Nyquist zones have what property?`, back: String.raw`They are spectrally inverted when folded to baseband.` }
    ],
    mcqs: [
      { q: String.raw`A signal band-limited to 10 MHz must be sampled at more than:`, options: [String.raw`5 MHz`, String.raw`10 MHz`, String.raw`20 MHz`, String.raw`40 MHz`], answer: 2, explain: String.raw`$f_s>2B=20$ MHz.` },
      { q: String.raw`Quantization noise power for step $\Delta$ is:`, options: [String.raw`$\Delta^2/6$`, String.raw`$\Delta^2/12$`, String.raw`$\Delta/12$`, String.raw`$\Delta^2/2$`], answer: 1, explain: String.raw`Uniform error on $\pm\Delta/2$ has variance $\Delta^2/12$.` },
      { q: String.raw`Ideal SNR of a 10-bit ADC is about:`, options: [String.raw`50 dB`, String.raw`62 dB`, String.raw`74 dB`, String.raw`86 dB`], answer: 1, explain: String.raw`$6.02\times10+1.76=61.96\approx 62$ dB.` },
      { q: String.raw`A 14-bit ADC measures SINAD = 74 dB. Its ENOB is:`, options: [String.raw`14.0`, String.raw`12.0`, String.raw`11.0`, String.raw`10.0`], answer: 1, explain: String.raw`$(74-1.76)/6.02=12.0$ bits.` },
      { q: String.raw`SFDR is the ratio of:`, options: [String.raw`signal to thermal noise`, String.raw`fundamental to the largest spur`, String.raw`signal to quantization noise`, String.raw`harmonics to noise`], answer: 1, explain: String.raw`SFDR = fundamental / largest spurious tone.` },
      { q: String.raw`Aperture-jitter-limited SNR depends on:`, options: [String.raw`sample rate only`, String.raw`input frequency and jitter`, String.raw`bit depth only`, String.raw`full-scale voltage`], answer: 1, explain: String.raw`$-20\log_{10}(2\pi f_{in}t_j)$: input frequency dominates, key for undersampling.` },
      { q: String.raw`Oversampling by 4x improves SNR by about:`, options: [String.raw`3 dB`, String.raw`6 dB`, String.raw`12 dB`, String.raw`24 dB`], answer: 1, explain: String.raw`$10\log_{10}4=6.02$ dB (one bit).` },
      { q: String.raw`A 2nd-order sigma-delta modulator gains SNR per octave of:`, options: [String.raw`3 dB`, String.raw`9 dB`, String.raw`15 dB`, String.raw`21 dB`], answer: 2, explain: String.raw`$(6L+3)=6(2)+3=15$ dB/octave.` },
      { q: String.raw`A 30 MHz tone sampled at 25 MHz aliases to:`, options: [String.raw`30 MHz`, String.raw`5 MHz`, String.raw`12.5 MHz`, String.raw`25 MHz`], answer: 1, explain: String.raw`$|30-1\times25|=5$ MHz.` },
      { q: String.raw`Undersampling requires the sample rate to exceed:`, options: [String.raw`2 f_high`, String.raw`the signal bandwidth times 2`, String.raw`f_high`, String.raw`4 f_high`], answer: 1, explain: String.raw`Only $f_s>2B$ (bandwidth) is needed, not $2f_{high}$.` },
      { q: String.raw`Which architecture reaches the highest resolution?`, options: [String.raw`flash`, String.raw`pipeline`, String.raw`SAR`, String.raw`sigma-delta`], answer: 3, explain: String.raw`Sigma-delta reaches 24 bits via oversampling and noise shaping.` },
      { q: String.raw`Even Nyquist zones fold to baseband with:`, options: [String.raw`no change`, String.raw`amplitude doubling`, String.raw`spectral inversion`, String.raw`a 3 dB loss`], answer: 2, explain: String.raw`Even zones are spectrally inverted.` },
      { q: String.raw`For a full-scale sine, the 1.76 dB term in SNR comes from:`, options: [String.raw`thermal noise`, String.raw`the 1.5 crest/loading factor (10 log 1.5)`, String.raw`jitter`, String.raw`dither`], answer: 1, explain: String.raw`$10\log_{10}(1.5)=1.76$ dB from the signal-power-to-quantization ratio constant.` },
      { q: String.raw`Increasing bit depth beyond ~14 bits often does NOT help because:`, options: [String.raw`aliasing worsens`, String.raw`thermal noise dominates`, String.raw`the Nyquist rate rises`, String.raw`SFDR is fixed`], answer: 1, explain: String.raw`kT/C and amplifier thermal noise set the floor above quantization noise.` }
    ],
    numericals: [
      { q: String.raw`A 16-bit ADC has $V_{FS}=2$ V. Find the LSB, quantization noise rms, and ideal SNR.`, solution: String.raw`<p><b>Formula.</b> $$\Delta=\frac{V_{FS}}{2^{N}},\qquad \sigma_q=\frac{\Delta}{\sqrt{12}},\qquad \text{SNR}_{ideal}=6.02N+1.76\ \text{dB}$$ where $\Delta$ is the LSB step, $\sigma_q$ the rms quantization noise (uniform error on $\pm\Delta/2$), $V_{FS}$ the full-scale range, and $N$ the bit count.</p>
      <p><b>Substitute.</b> $V_{FS}=2$ V, $N=16$: $\Delta=2/2^{16}$; $\sigma_q=\Delta/\sqrt{12}$; $\text{SNR}=6.02\times16+1.76$.</p>
      <p><b>Compute.</b> $\Delta=2/65536=30.52\ \mu$V. $\sigma_q=30.52\ \mu\text{V}/3.4641=8.81\ \mu$V. $\text{SNR}_{ideal}=96.32+1.76=98.1$ dB.</p>
      <p><b>Explanation.</b> Each extra bit halves the LSB and adds 6.02 dB; a 16-bit part reaches ~98 dB in theory. In practice thermal (kT/C) noise usually exceeds this 8.8 µV floor, so a real 16-bit converter delivers fewer ENOB than the ideal.</p>` },
      { q: String.raw`An ADC datasheet lists SINAD = 65 dB at 70 MHz input. What is the ENOB?`, solution: String.raw`<p><b>Formula.</b> $$\text{ENOB}=\frac{\text{SINAD}-1.76}{6.02}$$ where SINAD (dB) is the measured signal-to-noise-and-distortion ratio and ENOB is the effective number of bits.</p>
      <p><b>Substitute.</b> $\text{SINAD}=65$ dB: $$\text{ENOB}=\frac{65-1.76}{6.02}.$$</p>
      <p><b>Compute.</b> $65-1.76=63.24$; $63.24/6.02=10.5$ bits.</p>
      <p><b>Explanation.</b> At 70 MHz the converter behaves like an ideal 10.5-bit ADC, even if it is marketed as (say) a 12- or 14-bit part. ENOB collapses all real impairments - distortion, jitter, thermal noise - into one honest figure, and it typically falls as input frequency rises.</p>` },
      { q: String.raw`What aperture jitter is needed to achieve 70 dB SNR for a 200 MHz input tone?`, solution: String.raw`<p><b>Formula.</b> $$\text{SNR}_{jitter}=-20\log_{10}(2\pi f_{in}t_j)\;\Rightarrow\; t_j=\frac{10^{-\text{SNR}/20}}{2\pi f_{in}}$$ where $t_j$ is the rms aperture jitter, $f_{in}$ the input frequency, and SNR the jitter-limited signal-to-noise ratio in dB.</p>
      <p><b>Substitute.</b> $\text{SNR}=70$ dB, $f_{in}=200\times10^{6}$ Hz: $2\pi f_{in}t_j=10^{-70/20}=10^{-3.5}$, so $$t_j=\frac{3.16\times10^{-4}}{2\pi\times200\times10^{6}}.$$</p>
      <p><b>Compute.</b> $2\pi\times200\times10^{6}=1.257\times10^{9}$. $t_j=3.16\times10^{-4}/1.257\times10^{9}=2.52\times10^{-13}$ s $=0.25$ ps rms.</p>
      <p><b>Explanation.</b> A quarter-picosecond of clock jitter caps SNR at 70 dB for a 200 MHz tone - and the requirement tightens with $f_{in}$, not sample rate. This is why undersampling or direct-RF sampling of GHz signals demands sub-100-fs clocks.</p>` },
      { q: String.raw`A signal occupies 100 kHz and is sampled at 25.6 MHz. Find the OSR and oversampling SNR gain.`, solution: String.raw`<p><b>Formula.</b> $$\text{OSR}=\frac{f_s}{2B},\qquad \Delta\text{SNR}=10\log_{10}(\text{OSR})$$ where $f_s$ is the sample rate, $B$ the signal bandwidth, OSR the oversampling ratio, and $\Delta\text{SNR}$ the processing gain after filtering to $B$.</p>
      <p><b>Substitute.</b> $f_s=25.6\times10^{6}$ Hz, $B=100\times10^{3}$ Hz: $\text{OSR}=25.6\times10^{6}/(2\times100\times10^{3})$; then $\Delta\text{SNR}=10\log_{10}(\text{OSR})$.</p>
      <p><b>Compute.</b> $\text{OSR}=25.6\times10^{6}/200\times10^{3}=128$. $\Delta\text{SNR}=10\log_{10}128=21.07$ dB.</p>
      <p><b>Explanation.</b> Filtering to the 100 kHz band discards 127/128 of the quantization noise, adding ~21 dB (about $21.07/6.02\approx3.5$ extra bits). Sanity check: $\log_2 128=7$ octaves $\times$ 3 dB/octave $=21$ dB - consistent.</p>` },
      { q: String.raw`A 100 MHz carrier is undersampled at 40 MS/s. Find the alias (baseband) frequency and note any inversion.`, solution: String.raw`<p><b>Formula.</b> $$f_{alias}=|f_{in}-k f_s|,\quad k=\text{round}(f_{in}/f_s),\qquad \text{zone}=\left\lceil\frac{f_{in}}{f_s/2}\right\rceil$$ where $f_{in}$ is the input frequency, $f_s$ the sample rate, $k$ the nearest replica index, and the Nyquist zone (odd = upright, even = inverted).</p>
      <p><b>Substitute.</b> $f_{in}=100$ MHz, $f_s=40$ MHz: $k=\text{round}(100/40)=\text{round}(2.5)$, and $\text{zone}=\lceil 100/20\rceil$.</p>
      <p><b>Compute.</b> $k=2$ or $3$ (the 2.5 boundary): both give $|100-2\times40|=|100-3\times40|=20$ MHz, so $f_{alias}=20$ MHz $=f_s/2$ exactly (the Nyquist edge). Zone $=\lceil5\rceil=5$, an odd zone, so the spectrum is NOT inverted.</p>
      <p><b>Explanation.</b> The tone folds down to the very edge of the first Nyquist zone - a degenerate case sitting on the boundary. In practice you nudge $f_s$ (or the tuning) so the band lands comfortably inside a zone, away from the fold point where filtering and any adjacent image become problematic.</p>` },
      { q: String.raw`A 3rd-order sigma-delta runs at OSR = 64. Estimate the noise-shaping SNR gain over Nyquist (ignore the constant penalty).`, solution: String.raw`<p><b>Formula.</b> $$\Delta\text{SNR}=(6L+3)\times\log_2(\text{OSR})\ \text{dB}$$ (the shaping term), where $L$ is the modulator order and OSR the oversampling ratio; the fixed penalty is $10\log_{10}[\pi^{2L}/(2L+1)]$.</p>
      <p><b>Substitute.</b> $L=3$, $\text{OSR}=64$: per octave $6L+3=21$ dB; octaves $=\log_2 64=6$; so $\Delta\text{SNR}=21\times6$. Penalty $=10\log_{10}(\pi^{6}/7)$.</p>
      <p><b>Compute.</b> Shaping gain $=21\times6=126$ dB. Penalty: $\pi^{6}=961.4$, $/7=137.3$, $10\log_{10}137.3=21.4$ dB. Net $\approx126-21\approx105$ dB above the Nyquist-rate baseline.</p>
      <p><b>Explanation.</b> A 3rd-order loop gains 21 dB per doubling of OSR - vastly more than plain oversampling's 3 dB/octave - which is why $\Sigma\Delta$ converters reach 20+ effective bits at audio/precision rates. The enormous shaping term easily swamps the fixed penalty.</p>` },
      { q: String.raw`Compute the combined SNR when quantization-limited SNR is 74 dB and jitter-limited SNR is 70 dB.`, solution: String.raw`<p><b>Formula.</b> $$\text{SNR}_{tot}=-10\log_{10}\!\left(10^{-\text{SNR}_q/10}+10^{-\text{SNR}_j/10}\right)$$ noise powers add (reciprocal SNRs), where $\text{SNR}_q$ is the quantization-limited and $\text{SNR}_j$ the jitter-limited SNR in dB.</p>
      <p><b>Substitute.</b> $\text{SNR}_q=74$ dB, $\text{SNR}_j=70$ dB: noise fractions $10^{-74/10}$ and $10^{-70/10}$.</p>
      <p><b>Compute.</b> $10^{-7.4}=3.98\times10^{-8}$; $10^{-7.0}=1.00\times10^{-7}$; sum $=1.40\times10^{-7}$. $\text{SNR}_{tot}=-10\log_{10}(1.40\times10^{-7})=68.5$ dB.</p>
      <p><b>Explanation.</b> The combined SNR (68.5 dB) is below the worse of the two contributors, and jitter dominates because its noise power is larger. Rule of thumb: when two noise sources are within a few dB, the total sits ~1-3 dB below the smaller SNR - you must fix the dominant one to improve overall performance.</p>` }
    ],
    realWorld: String.raw`<p>Every SDR, oscilloscope, cellular receiver, and digital audio device lives or dies by its ADC. Direct-sampling receivers (RFSoC, high-speed 5G radios) push pipeline/RF ADCs to multi-GSPS while battling aperture jitter that limits high-frequency SNR. Audio and precision instrumentation exploit sigma-delta to reach 24-bit resolution cheaply. ADC vendors specify ENOB, SFDR, SINAD, and NSD (noise spectral density) as the true figures of merit; a "16-bit" part delivering 12 ENOB at the frequency you actually use is a common design trap. Undersampling is a favorite trick in IF-sampling receivers, deliberately aliasing an IF band into the first Nyquist zone to relax converter speed.</p>`,
    related: ['dac', 'sdr', 'noise', 'noise-floor', 'rfsoc']
  },

  {
    id: 'dac',
    title: 'Digital-to-Analog Converter (DAC)',
    category: 'SDR & Data Converters',
    tags: ['dac', 'zoh', 'sinc', 'images', 'reconstruction', 'nyquist-zones', 'rf-sampling'],
    summary: String.raw`A DAC converts a discrete-time sequence into a continuous waveform; the zero-order hold imposes a sinc-shaped frequency response, creates spectral images at multiples of fs, and requires reconstruction/anti-imaging filtering (or inverse-sinc pre-emphasis) for accurate output.`,
    prerequisites: ['adc', 'sdr', 'comm-basics'],
    intro: String.raw`<p><b>Why is the DAC harder than it looks?</b> It seems trivial - just turn numbers back into voltages. But a computer can only output <i>held</i> values, one per sample, producing a blocky staircase rather than a smooth wave. That staircase is not the signal you asked for: it carries copies (images) of your signal at higher frequencies and a built-in high-frequency roll-off. So every DAC is really a two-step act - generate the staircase, then <i>reconstruct</i> the smooth analog waveform hiding inside it. Understanding the staircase's spectrum is the whole game, and modern radios even weaponize it to synthesize RF directly.</p>
    <p>A <b>Digital-to-Analog Converter</b> is the transmit-side counterpart of the ADC. Given a sequence of codes at rate $f_s$, it produces a continuous voltage or current. Almost all practical DACs hold each sample constant for one sample period - a <b>zero-order hold (ZOH)</b> - which is convenient to build but has two important spectral consequences: it multiplies the desired spectrum by a $\text{sinc}$ envelope (causing high-frequency <b>droop</b>), and it leaves <b>spectral images</b> of the baseband centered at every multiple of $f_s$. Reconstructing a clean analog signal therefore requires an <b>anti-imaging (reconstruction) filter</b> and, for flat response, <b>inverse-sinc pre-emphasis</b>.</p>
    <p>Modern <b>RF-sampling DACs</b> turn the image structure into a feature: by intentionally using a higher Nyquist zone, they synthesize RF directly without an analog upconversion mixer.</p>`,
    sections: [
      {
        h: 'Zero-Order Hold and the Sinc Response',
        html: String.raw`<div class="callout tip"><b>Where the sinc comes from, intuitively:</b> holding each sample flat for one period is the same as smearing an ideal spike into a rectangle of width $T_s$. In the frequency domain, a rectangle in time <i>is</i> a sinc, and multiplying by it gently tilts down your high frequencies (droop) while leaving weakened copies of the spectrum at every multiple of $f_s$ (images). Everything else in this topic is just managing those two side-effects of the hold.</div>
        <p>Mathematically the DAC output is the ideal impulse train (samples) convolved with a rectangular pulse $h(t)$ of width $T_s=1/f_s$. Convolution in time is multiplication in frequency, and the Fourier transform of a rectangle of width $T_s$ is</p>
        $$H(f)=T_s\,\frac{\sin(\pi f T_s)}{\pi f T_s}=T_s\,\text{sinc}(f/f_s),$$
        <p>a sinc envelope with nulls at every multiple of $f_s$. The magnitude falls as frequency rises across the first Nyquist zone - this is <b>ZOH droop</b>. At the Nyquist edge $f=f_s/2$ the attenuation is $\text{sinc}(1/2)=\dfrac{\sin(\pi/2)}{\pi/2}=\dfrac{2}{\pi}=0.637$, i.e. $20\log_{10}(0.637)=-3.92$ dB.</p>
        <div class="callout"><b>Key numbers:</b> droop at $f=0.1f_s$ is $-0.14$ dB; at $0.25f_s$ it is $-0.91$ dB; at $0.4f_s$ it is $-2.42$ dB; at $0.5f_s$ (Nyquist) it is $-3.92$ dB.</div>`
      },
      {
        h: 'Spectral Images at Multiples of fs',
        html: String.raw`<p>Sampling replicates the baseband spectrum at every multiple of $f_s$. The ZOH sinc envelope attenuates but does not remove these <b>images</b>: a baseband tone at $f_0$ produces images at $nf_s\pm f_0$ for $n=1,2,\dots$, each weighted by $|H(nf_s\pm f_0)|$. Because the first image sits at $f_s-f_0$, it can be uncomfortably close to the wanted signal when $f_0$ approaches Nyquist, demanding a sharp reconstruction filter.</p>
        <ul>
          <li>Image at $f_s-f_0$ is attenuated by $\text{sinc}((f_s-f_0)/f_s)$ relative to baseband, so images near the sinc nulls (at $nf_s$) are naturally weak.</li>
          <li>The <b>reconstruction (anti-imaging) filter</b> is a lowpass that passes $[0,f_s/2]$ and rejects everything above, killing the images. Its transition band difficulty grows as the signal approaches Nyquist.</li>
        </ul>`
      },
      {
        h: 'Inverse-Sinc Pre-emphasis',
        html: String.raw`<p>To flatten the ZOH droop within the passband, the digital data is pre-shaped by a filter approximating $1/\text{sinc}(f/f_s)$ - <b>inverse-sinc pre-emphasis</b>. It boosts high-frequency content before conversion so that after the sinc roll-off the net response is flat.</p>
        <ul>
          <li>Implemented as a short digital FIR (fixed or programmable), often built into modern transmit DACs.</li>
          <li>Boosting near Nyquist consumes DAC dynamic range/headroom, so pre-emphasis is a tradeoff, not free flatness.</li>
          <li>Alternative: <b>interpolate</b> (raise $f_s$) so the signal occupies a smaller fraction of the Nyquist band where droop is negligible - the preferred modern approach.</li>
        </ul>`
      },
      {
        h: 'Interpolation Before the DAC',
        html: String.raw`<p>Just as ADCs use decimation, transmit chains use <b>interpolation (upsampling)</b> before the DAC. Raising the update rate by $L$ pushes the images far from the signal, so:</p>
        <ul>
          <li>The <b>reconstruction filter</b> becomes gentle (wide transition band), often a simple analog lowpass.</li>
          <li><b>Sinc droop</b> becomes negligible because the signal occupies a small fraction of the new Nyquist band.</li>
          <li>Digital interpolation filters (CIC + FIR, or cascaded halfbands) suppress the images that upsampling would otherwise create.</li>
        </ul>
        <p>This is why high-performance transmit DACs run at hundreds of MSPS to GSPS even for modest signal bandwidths.</p>`
      },
      {
        h: 'Nyquist Zones and RF-Sampling (Direct RF Synthesis)',
        html: String.raw`<p>The images that plague baseband reconstruction are exactly the signal an <b>RF-sampling DAC</b> exploits. By selecting a higher <b>Nyquist zone</b> (via a bandpass reconstruction filter) the DAC can output an image at RF directly, with no analog mixer or LO:</p>
        <table class="data">
          <tr><th>Mode</th><th>Zone used</th><th>Envelope</th><th>Notes</th></tr>
          <tr><td>Normal (NRZ)</td><td>Zone 1 (0 - fs/2)</td><td>sinc, strong at DC</td><td>Baseband synthesis</td></tr>
          <tr><td>Mix-mode / RZ</td><td>Zone 2-3</td><td>Envelope peak shifted up</td><td>Boosts higher-zone image for RF output</td></tr>
        </table>
        <p>Because the useful image lies where the sinc envelope is falling, <b>mix-mode / return-to-zero (RZ)</b> DAC modes reshape the envelope (e.g. a $\sin$-weighting) to peak in a higher zone, boosting the desired RF image. This underlies direct-RF transmit in RFSoC and modern radar/5G transmitters, eliminating the analog upconverter entirely.</p>`
      },
      {
        h: 'DAC Static and Dynamic Errors',
        html: String.raw`<p>Beyond the ZOH envelope, DAC quality is set by:</p>
        <ul>
          <li><b>DNL / INL</b> - differential and integral nonlinearity; missing/uneven code steps distort the waveform and raise the noise/spur floor.</li>
          <li><b>Glitch energy</b> - transient spikes at code transitions (worst at major-carry boundaries) create wideband spurs.</li>
          <li><b>Settling time</b> - limits update rate; incomplete settling smears samples.</li>
          <li><b>Quantization noise</b> - same $\Delta^2/12$ floor as ADCs, giving the same $6.02N+1.76$ dB SNR ceiling.</li>
          <li><b>Clock jitter</b> - modulates output timing, again worse at high output frequency (RF-sampling modes).</li>
        </ul>
        <p>Figures of merit mirror the ADC: SFDR, SINAD/ENOB, NSD, and IMD for two-tone tests.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<ul>
          <li><b>The hold shapes everything:</b> a ZOH imposes $H(f)=\text{sinc}(f/f_s)$ - a droop reaching $-3.92$ dB at Nyquist - and leaves spectral images at $nf_s\pm f_0$, with the first at $f_s-f_0$ being the strongest and hardest to filter.</li>
          <li><b>Two fixes for droop:</b> inverse-sinc pre-emphasis (boosts highs digitally, costs headroom) or interpolation (raise $f_s$ so the signal sits low in the band where droop is negligible) - interpolation is usually preferred.</li>
          <li><b>Interpolation's real payoff:</b> pushing images far from the signal turns a demanding sharp reconstruction filter into a trivial analog lowpass.</li>
          <li><b>Images as a feature:</b> RF-sampling DACs use a higher-Nyquist-zone image (boosted by mix-mode/RZ) to synthesize RF directly, deleting the analog upconverter.</li>
          <li><b>Same noise ceiling as the ADC:</b> quantization SNR is $6.02N+1.76$ dB; real performance is set by DNL/INL, glitch energy, settling, and jitter (worse at high output frequency).</li>
          <li><b>You can now compute droop</b> at any fraction $\alpha=f/f_s$ and locate every image - the two questions every transmit-filter design turns on.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Digital-to-analog_converter" target="_blank" rel="noopener">Wikipedia — Digital-to-analog converter</a> — canonical overview of DAC operation, architectures, and reconstruction/image behavior.</li>
<li><a href="https://www.dsprelated.com/showarticle/1627.php" target="_blank" rel="noopener">DSPRelated — DAC Zero-Order Hold Models</a> — Neil Robertson's derivation of the ZOH sinc response, droop, and spectral images with worked plots.</li>
<li><a href="https://en.wikipedia.org/wiki/Reconstruction_filter" target="_blank" rel="noopener">Wikipedia — Reconstruction filter</a> — why the DAC output needs an anti-imaging lowpass and how the ideal sinc filter relates to practical designs.</li>
<li><a href="https://www.mathworks.com/help/dsp/ug/overview-of-multirate-filters.html" target="_blank" rel="noopener">MathWorks — Overview of Multirate Filters</a> — interpolation and anti-imaging filtering that push DAC images away and ease reconstruction.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`A ZOH holds each sample for $T_s$, imposing a frequency response $H(f)=\text{sinc}(f/f_s)$ (nulls at multiples of $f_s$).`,
      String.raw`Sinc droop is $-3.92$ dB at Nyquist ($f=f_s/2$), $-0.91$ dB at $0.25f_s$.`,
      String.raw`Sampling creates spectral images at $nf_s\pm f_0$; the ZOH sinc attenuates but does not remove them.`,
      String.raw`A reconstruction (anti-imaging) lowpass removes images; its difficulty grows as the signal nears Nyquist.`,
      String.raw`Inverse-sinc pre-emphasis boosts high frequencies digitally to flatten ZOH droop, at the cost of headroom.`,
      String.raw`Interpolation before the DAC pushes images away, relaxing the reconstruction filter and making droop negligible.`,
      String.raw`RF-sampling DACs use a higher Nyquist zone image to synthesize RF directly - no analog mixer/LO.`,
      String.raw`Mix-mode / RZ DAC modes reshape the sinc envelope to peak in a higher zone, boosting the wanted RF image.`,
      String.raw`Quantization SNR ceiling is the same $6.02N+1.76$ dB as an ADC.`,
      String.raw`DNL/INL, glitch energy, settling time, and clock jitter set real DAC spur/noise performance.`,
      String.raw`Clock jitter degrades output more severely at high output frequency (relevant in RF-sampling modes).`,
      String.raw`DAC FoMs: SFDR, SINAD/ENOB, NSD, IMD - mirror the ADC's.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <text x="12" y="18" fill="#e6edf3" font-size="13">ZOH sinc envelope, images, Nyquist zones</text>
        <line x1="30" y1="180" x2="525" y2="180" stroke="#9aa7b5"/>
        <line x1="30" y1="180" x2="30" y2="40" stroke="#9aa7b5"/>
        <text x="505" y="197" fill="#9aa7b5" font-size="10">f</text>
        <path d="M30,55 Q130,55 150,180" stroke="#4dabf7" fill="none"/>
        <path d="M150,180 Q210,120 270,180" stroke="#4dabf7" fill="none" opacity="0.7"/>
        <path d="M270,180 Q340,150 390,180" stroke="#4dabf7" fill="none" opacity="0.5"/>
        <path d="M390,180 Q450,168 510,180" stroke="#4dabf7" fill="none" opacity="0.35"/>
        <text x="40" y="50" fill="#4dabf7" font-size="10">sinc envelope</text>
        <line x1="150" y1="180" x2="150" y2="45" stroke="#63e6be" stroke-dasharray="3 3"/><text x="132" y="42" fill="#63e6be" font-size="9">fs/2</text>
        <line x1="270" y1="180" x2="270" y2="45" stroke="#63e6be" stroke-dasharray="3 3"/><text x="258" y="42" fill="#63e6be" font-size="9">fs</text>
        <line x1="390" y1="180" x2="390" y2="45" stroke="#63e6be" stroke-dasharray="3 3"/><text x="375" y="42" fill="#63e6be" font-size="9">3fs/2</text>
        <rect x="70" y="120" width="10" height="60" fill="#ffa94d"/><text x="55" y="115" fill="#ffa94d" font-size="9">signal</text>
        <rect x="220" y="150" width="10" height="30" fill="#ff6b6b"/><text x="205" y="145" fill="#ff6b6b" font-size="9">image1</text>
        <rect x="340" y="163" width="10" height="17" fill="#b197fc"/><text x="325" y="158" fill="#b197fc" font-size="9">image2</text>
        <text x="60" y="205" fill="#9aa7b5" font-size="9">zone1 (baseband)</text>
        <text x="300" y="205" fill="#9aa7b5" font-size="9">higher zones (RF-sampling)</text>
        </svg>`,
        caption: 'DAC output: baseband signal plus images at multiples of fs, all shaped by the ZOH sinc envelope. RF-sampling DACs use a higher-zone image directly.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr-dac" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="18" fill="#e6edf3" font-size="13">Transmit reconstruction chain</text>
        <rect x="20" y="55" width="70" height="30" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="26" y="74" fill="#e6edf3" font-size="9">interp xL</text>
        <rect x="105" y="55" width="80" height="30" rx="3" fill="#1c232e" stroke="#b197fc"/><text x="111" y="74" fill="#e6edf3" font-size="9">inv-sinc FIR</text>
        <rect x="200" y="55" width="60" height="30" rx="3" fill="#1c232e" stroke="#4dabf7"/><text x="212" y="74" fill="#e6edf3" font-size="11">DAC</text>
        <rect x="275" y="55" width="90" height="30" rx="3" fill="#1c232e" stroke="#ffa94d"/><text x="281" y="74" fill="#e6edf3" font-size="9">recon LPF</text>
        <rect x="380" y="55" width="60" height="30" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="392" y="74" fill="#e6edf3" font-size="9">PA/ant</text>
        <line x1="90" y1="70" x2="105" y2="70" stroke="#9aa7b5" marker-end="url(#arr-dac)"/>
        <line x1="185" y1="70" x2="200" y2="70" stroke="#9aa7b5" marker-end="url(#arr-dac)"/>
        <line x1="260" y1="70" x2="275" y2="70" stroke="#9aa7b5" marker-end="url(#arr-dac)"/>
        <line x1="365" y1="70" x2="380" y2="70" stroke="#9aa7b5" marker-end="url(#arr-dac)"/>
        <text x="20" y="115" fill="#9aa7b5" font-size="9">Interpolation pushes images away; inverse-sinc flattens droop; LPF removes images.</text>
        </svg>`,
        caption: 'Digital interpolation and inverse-sinc pre-emphasis relax the analog reconstruction filter and correct ZOH droop.'
      },
      {
        title: String.raw`Current-steering reconstruction: code to smooth analog`,
        svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr3-dac" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="18" fill="#e6edf3" font-size="13">DAC reconstruction mechanism</text>
        <rect x="18" y="50" width="60" height="30" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="24" y="69" fill="#e6edf3" font-size="8">code N-bit</text>
        <rect x="96" y="50" width="78" height="30" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="102" y="66" fill="#e6edf3" font-size="8">current cells</text><text x="102" y="77" fill="#9aa7b5" font-size="7">steer to sum</text>
        <rect x="192" y="50" width="66" height="30" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="198" y="66" fill="#e6edf3" font-size="8">ZOH hold</text><text x="198" y="77" fill="#9aa7b5" font-size="7">staircase</text>
        <rect x="276" y="50" width="72" height="30" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="282" y="66" fill="#e6edf3" font-size="8">recon LPF</text><text x="282" y="77" fill="#9aa7b5" font-size="7">anti-image</text>
        <rect x="366" y="50" width="72" height="30" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="372" y="69" fill="#e6edf3" font-size="8">smooth out</text>
        <line x1="78" y1="65" x2="96" y2="65" stroke="#9aa7b5" marker-end="url(#arr3-dac)"/>
        <line x1="174" y1="65" x2="192" y2="65" stroke="#9aa7b5" marker-end="url(#arr3-dac)"/>
        <line x1="258" y1="65" x2="276" y2="65" stroke="#9aa7b5" marker-end="url(#arr3-dac)"/>
        <line x1="348" y1="65" x2="366" y2="65" stroke="#9aa7b5" marker-end="url(#arr3-dac)"/>
        <text x="20" y="112" fill="#63e6be" font-size="9">held staircase (ZOH)</text>
        <polyline points="30,175 30,150 70,150 70,130 110,130 110,120 150,120 150,140 190,140 190,165 230,165" fill="none" stroke="#4dabf7" stroke-width="1.5"/>
        <path d="M30,165 Q70,132 110,120 T190,150 Q210,160 230,162" fill="none" stroke="#ffa94d" stroke-width="1.5" stroke-dasharray="4 3"/>
        <text x="250" y="140" fill="#ffa94d" font-size="9">LPF -> smooth</text>
        <text x="250" y="156" fill="#4dabf7" font-size="9">staircase (before)</text>
        <text x="20" y="212" fill="#9aa7b5" font-size="9">Steered currents build a held staircase; the LPF removes images and the</text>
        <text x="20" y="226" fill="#9aa7b5" font-size="9">sinc(f/fs) droop of the hold is corrected by inverse-sinc / interpolation.</text>
        </svg>`,
        caption: 'Reconstruction path: the code steers weighted currents into a summing node, the ZOH forms a staircase, and the anti-image LPF smooths it to analog; the ZOH imposes a sinc(f/fs) droop.'
      }
    ],
    equations: [
      {
        title: 'Zero-order-hold frequency response',
        tex: String.raw`$$H(f)=T_s\,\frac{\sin(\pi f T_s)}{\pi f T_s}=T_s\,\operatorname{sinc}(f/f_s)$$`,
        derivation: String.raw`<p>The ZOH impulse response is a rectangle $h(t)=1$ for $0\le t<T_s$, else 0. Its Fourier transform is $H(f)=\int_0^{T_s}e^{-j2\pi ft}dt = \dfrac{1-e^{-j2\pi fT_s}}{j2\pi f}$. Factoring $e^{-j\pi fT_s}$: $H(f)=T_s e^{-j\pi fT_s}\dfrac{\sin(\pi fT_s)}{\pi fT_s}$. The magnitude is $T_s\,\text{sinc}(fT_s)=T_s\,\text{sinc}(f/f_s)$, with linear phase (half-sample delay).</p>`
      },
      {
        title: 'Sinc droop at Nyquist',
        tex: String.raw`$$\left|H(f_s/2)\right|_{dB}=20\log_{10}\!\left(\frac{\sin(\pi/2)}{\pi/2}\right)=20\log_{10}\frac{2}{\pi}=-3.92\ \text{dB}$$`,
        derivation: String.raw`<p>Set $f=f_s/2$ so $fT_s=1/2$. Then $\text{sinc}(1/2)=\sin(\pi/2)/(\pi/2)=1/(\pi/2)=2/\pi=0.6366$. In dB: $20\log_{10}(0.6366)=-3.92$ dB. This is the maximum in-band droop of a plain ZOH DAC.</p>`
      },
      {
        title: 'General droop at fraction alpha of fs',
        tex: String.raw`$$\text{droop}(\alpha)=20\log_{10}\!\left(\frac{\sin(\pi\alpha)}{\pi\alpha}\right),\quad \alpha=f/f_s$$`,
        derivation: String.raw`<p>Substitute $f=\alpha f_s$ into $\text{sinc}(f/f_s)$. Example $\alpha=0.25$: $\sin(\pi/4)/(\pi/4)=0.7071/0.7854=0.900$, so droop $=20\log_{10}0.900=-0.91$ dB. Example $\alpha=0.4$: $\sin(0.4\pi)/(0.4\pi)=0.951/1.257=0.757$, droop $=-2.42$ dB.</p>`
      },
      {
        title: 'Image frequencies',
        tex: String.raw`$$f_{image}=n f_s \pm f_0,\quad n=1,2,3,\dots$$`,
        derivation: String.raw`<p>Sampling convolves the baseband spectrum with an impulse train spaced $f_s$, replicating the spectrum at every $nf_s$. A baseband tone at $f_0$ thus appears additionally at $nf_s-f_0$ and $nf_s+f_0$. Each image amplitude is scaled by the ZOH envelope $|H(f_{image})|$, so images near $nf_s$ (sinc nulls) are strongly suppressed while the first image at $f_s-f_0$ is the strongest.</p>`
      },
      {
        title: 'Inverse-sinc pre-emphasis',
        tex: String.raw`$$G(f)=\frac{1}{\operatorname{sinc}(f/f_s)}=\frac{\pi f/f_s}{\sin(\pi f/f_s)}$$`,
        derivation: String.raw`<p>To make the cascade $G(f)\cdot H(f)$ flat over the passband, choose $G(f)=1/\text{sinc}(f/f_s)$. At $f=f_s/2$ this requires a boost of $+3.92$ dB. A short FIR approximates $G(f)$; the required boost eats DAC headroom, which is why interpolation is preferred when possible.</p>`
      },
      {
        title: 'DAC quantization SNR',
        tex: String.raw`$$\text{SNR}_{DAC}=6.02N+1.76\ \text{dB}$$`,
        derivation: String.raw`<p>Identical to the ADC derivation: full-scale sine power $V_{FS}^2/8$ over quantization noise $\Delta^2/12=V_{FS}^2/(12\cdot2^{2N})$ gives $1.5\cdot2^{2N}$, i.e. $6.02N+1.76$ dB. Real DACs fall short due to DNL/INL, glitch energy, and jitter, reported as SFDR and ENOB.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What frequency response does a ZOH impose?`, back: String.raw`$H(f)=\text{sinc}(f/f_s)$ - a sinc envelope with nulls at every multiple of $f_s$ and droop toward Nyquist.` },
      { front: String.raw`Sinc droop at the Nyquist edge?`, back: String.raw`$20\log_{10}(2/\pi)=-3.92$ dB at $f=f_s/2$.` },
      { front: String.raw`Where do DAC images appear?`, back: String.raw`At $nf_s\pm f_0$ for $n=1,2,\dots$; the first image at $f_s-f_0$ is strongest.` },
      { front: String.raw`What removes DAC images?`, back: String.raw`An analog reconstruction (anti-imaging) lowpass passing $[0,f_s/2]$ and rejecting higher frequencies.` },
      { front: String.raw`What is inverse-sinc pre-emphasis?`, back: String.raw`A digital filter approximating $1/\text{sinc}(f/f_s)$ that boosts highs to cancel ZOH droop (costs headroom).` },
      { front: String.raw`How does interpolation help a transmit DAC?`, back: String.raw`Raising $f_s$ pushes images far from the signal (gentle reconstruction filter) and makes droop negligible.` },
      { front: String.raw`What is an RF-sampling DAC?`, back: String.raw`A DAC that outputs a higher-Nyquist-zone image at RF directly, replacing the analog upconversion mixer/LO.` },
      { front: String.raw`What do mix-mode / RZ DAC modes do?`, back: String.raw`Reshape the sinc envelope to peak in a higher Nyquist zone, boosting the desired RF image.` },
      { front: String.raw`DAC quantization SNR ceiling?`, back: String.raw`$6.02N+1.76$ dB, same as the ADC.` },
      { front: String.raw`What is glitch energy in a DAC?`, back: String.raw`Transient spikes at code transitions (worst at major-carry boundaries) that create wideband spurs.` },
      { front: String.raw`Why does clock jitter matter more in RF-sampling DACs?`, back: String.raw`Timing error produces larger amplitude error at higher output frequency (dv/dt scales with frequency).` },
      { front: String.raw`Droop at 0.25 fs?`, back: String.raw`$20\log_{10}(0.900)=-0.91$ dB.` },
      { front: String.raw`Two ways to flatten ZOH droop?`, back: String.raw`Inverse-sinc pre-emphasis, or interpolate so the signal occupies a small fraction of the Nyquist band.` },
      { front: String.raw`Why is the first image the hardest to filter?`, back: String.raw`It sits at $f_s-f_0$, closest to the wanted signal, especially as $f_0$ approaches Nyquist.` }
    ],
    mcqs: [
      { q: String.raw`A zero-order hold imposes a frequency response of:`, options: [String.raw`flat`, String.raw`$\text{sinc}(f/f_s)$`, String.raw`$\text{sinc}^2$`, String.raw`a highpass`], answer: 1, explain: String.raw`The rectangular hold transforms to a sinc envelope.` },
      { q: String.raw`ZOH droop at the Nyquist frequency is about:`, options: [String.raw`-0.9 dB`, String.raw`-2.4 dB`, String.raw`-3.92 dB`, String.raw`-6 dB`], answer: 2, explain: String.raw`$20\log_{10}(2/\pi)=-3.92$ dB.` },
      { q: String.raw`DAC spectral images occur at:`, options: [String.raw`$f_0/n$`, String.raw`$nf_s\pm f_0$`, String.raw`only at $f_0$`, String.raw`$f_s/2$ only`], answer: 1, explain: String.raw`Images appear at every multiple of $f_s$ offset by $\pm f_0$.` },
      { q: String.raw`The strongest image of a baseband tone $f_0$ is at:`, options: [String.raw`$2f_s+f_0$`, String.raw`$f_s-f_0$`, String.raw`$3f_s$`, String.raw`DC`], answer: 1, explain: String.raw`The first image at $f_s-f_0$ is least attenuated and closest to the signal.` },
      { q: String.raw`Inverse-sinc pre-emphasis is used to:`, options: [String.raw`remove images`, String.raw`flatten ZOH droop`, String.raw`reduce jitter`, String.raw`increase resolution`], answer: 1, explain: String.raw`It boosts highs by $1/\text{sinc}$ to cancel the ZOH roll-off.` },
      { q: String.raw`Interpolating before the DAC primarily:`, options: [String.raw`increases droop`, String.raw`pushes images away and relaxes the reconstruction filter`, String.raw`adds quantization noise`, String.raw`inverts the spectrum`], answer: 1, explain: String.raw`Higher $f_s$ moves images out of band and shrinks the signal's fraction of Nyquist.` },
      { q: String.raw`An RF-sampling DAC synthesizes RF by:`, options: [String.raw`using an analog mixer`, String.raw`outputting a higher-Nyquist-zone image directly`, String.raw`sampling faster than the carrier`, String.raw`adding a PLL`], answer: 1, explain: String.raw`It selects a higher-zone image via a bandpass filter, removing the analog upconverter.` },
      { q: String.raw`Mix-mode / RZ DAC operation:`, options: [String.raw`flattens the sinc`, String.raw`reshapes the envelope to peak in a higher zone`, String.raw`doubles the resolution`, String.raw`removes jitter`], answer: 1, explain: String.raw`It boosts the higher-zone image for direct RF output.` },
      { q: String.raw`A DAC's quantization SNR ceiling for N bits is:`, options: [String.raw`$3.01N$`, String.raw`$6.02N+1.76$ dB`, String.raw`$6.02N$`, String.raw`$1.76N$`], answer: 1, explain: String.raw`Same as the ADC: $6.02N+1.76$ dB.` },
      { q: String.raw`Glitch energy is worst at:`, options: [String.raw`zero crossings`, String.raw`major-carry code transitions`, String.raw`DC`, String.raw`the Nyquist edge`], answer: 1, explain: String.raw`Major-carry transitions (e.g. 0111 to 1000) cause the largest glitches.` },
      { q: String.raw`Droop at 0.4 fs is approximately:`, options: [String.raw`-0.9 dB`, String.raw`-1.5 dB`, String.raw`-2.42 dB`, String.raw`-3.92 dB`], answer: 2, explain: String.raw`$20\log_{10}(\sin(0.4\pi)/(0.4\pi))=-2.42$ dB.` },
      { q: String.raw`Clock jitter degrades DAC output most at:`, options: [String.raw`DC`, String.raw`low output frequency`, String.raw`high output frequency`, String.raw`the sample clock only`], answer: 2, explain: String.raw`Error scales with dv/dt, i.e. with output frequency - critical in RF-sampling modes.` },
      { q: String.raw`The reconstruction filter's job is to:`, options: [String.raw`add droop`, String.raw`remove spectral images above Nyquist`, String.raw`interpolate`, String.raw`quantize`], answer: 1, explain: String.raw`It is an anti-imaging lowpass passing only the first Nyquist zone.` }
    ],
    numericals: [
      { q: String.raw`A DAC runs at $f_s=100$ MHz and outputs a 40 MHz tone. Find the ZOH droop at the tone and the frequency of the first image.`, solution: String.raw`<p><b>Formula.</b> $$\text{droop}=20\log_{10}\!\left(\frac{\sin(\pi\alpha)}{\pi\alpha}\right),\ \alpha=\frac{f_0}{f_s};\qquad f_{image,1}=f_s-f_0$$ where $\alpha$ is the tone's fraction of $f_s$ and $f_{image,1}$ is the first (strongest) image.</p>
      <p><b>Substitute.</b> $f_0=40$ MHz, $f_s=100$ MHz: $\alpha=0.4$, so $\text{droop}=20\log_{10}(\sin(0.4\pi)/(0.4\pi))$ and $f_{image,1}=100-40$.</p>
      <p><b>Compute.</b> $\sin(0.4\pi)=0.9511$, $0.4\pi=1.2566$, ratio $=0.7568$; $20\log_{10}0.7568=-2.42$ dB. First image at $60$ MHz.</p>
      <p><b>Explanation.</b> At $0.4f_s$ the ZOH already attenuates the wanted tone by 2.4 dB, and the first image sits only 20 MHz away at 60 MHz - a tight transition band for the reconstruction filter. Both problems ease if the signal is kept well below Nyquist (via interpolation).</p>` },
      { q: String.raw`What inverse-sinc boost (dB) is needed at $0.45f_s$ to flatten the response?`, solution: String.raw`<p><b>Formula.</b> $$\text{boost}=-\,\text{droop}(\alpha)=-20\log_{10}\!\left(\frac{\sin(\pi\alpha)}{\pi\alpha}\right),\quad \alpha=\frac{f}{f_s}$$ the inverse-sinc pre-emphasis must exactly cancel the ZOH droop, where $\alpha$ is the fraction of $f_s$.</p>
      <p><b>Substitute.</b> $\alpha=0.45$: $\text{droop}=20\log_{10}(\sin(0.45\pi)/(0.45\pi))$.</p>
      <p><b>Compute.</b> $\sin(0.45\pi)=0.9877$, $0.45\pi=1.4137$, ratio $=0.6987$; droop $=20\log_{10}0.6987=-3.11$ dB. Required boost $=+3.11$ dB.</p>
      <p><b>Explanation.</b> The pre-emphasis FIR must lift $0.45f_s$ content by 3.11 dB so the cascade is flat. That boost consumes DAC headroom (peak backoff), which is why interpolating to keep signals below ~$0.4f_s$ is preferred over aggressive inverse-sinc near Nyquist.</p>` },
      { q: String.raw`A signal of 5 MHz bandwidth is generated at $f_s=20$ MHz, then at $f_s=160$ MHz after 8x interpolation. Compare the reconstruction-filter transition needed.`, solution: String.raw`<p><b>Formula.</b> $$f_{stop}=f_s-f_{edge},\qquad \text{transition ratio}=\frac{f_{stop}}{f_{edge}}$$ where $f_{edge}$ is the signal band edge, $f_{stop}=f_s-f_{edge}$ the first image edge, and the ratio measures how gentle the analog filter can be.</p>
      <p><b>Substitute.</b> $f_{edge}=5$ MHz. Case A: $f_s=20$ MHz $\Rightarrow f_{stop}=20-5$. Case B: $f_s=160$ MHz $\Rightarrow f_{stop}=160-5$.</p>
      <p><b>Compute.</b> A: image at $15$ MHz, transition $5\to15$ MHz, ratio $3:1$ (steep, hard). B: image at $155$ MHz, transition $5\to155$ MHz, ratio $31:1$ (very gentle).</p>
      <p><b>Explanation.</b> 8x interpolation pushes the first image from 15 MHz out to 155 MHz, turning a demanding sharp reconstruction filter into a trivial analog lowpass. This is exactly why transmit DACs run far faster than the signal bandwidth requires - it trades cheap digital rate for expensive analog selectivity.</p>` },
      { q: String.raw`A 14-bit DAC: give the ideal SNR and the amplitude of an image at $f_s-f_0$ where the sinc envelope gives -8 dB relative to baseband, if baseband tone is 0 dBFS.`, solution: String.raw`<p><b>Formula.</b> $$\text{SNR}_{ideal}=6.02N+1.76\ \text{dB};\qquad P_{image}=P_{baseband}+H_{sinc,dB}$$ where $N$ is the DAC resolution, $P_{baseband}$ the wanted-tone level (dBFS), and $H_{sinc,dB}$ the (negative) ZOH envelope attenuation at the image.</p>
      <p><b>Substitute.</b> $N=14$: $\text{SNR}=6.02\times14+1.76$. Image: $P_{baseband}=0$ dBFS, $H_{sinc,dB}=-8$ dB, so $P_{image}=0+(-8)$.</p>
      <p><b>Compute.</b> $\text{SNR}_{ideal}=84.28+1.76=86.0$ dB. $P_{image}=-8$ dBFS (as presented at the DAC output, before the reconstruction filter).</p>
      <p><b>Explanation.</b> An 8 dB-down image is far too strong to leave in-band, so the anti-imaging LPF must add tens of dB of rejection to meet emission masks. The 86 dB ideal SNR is the noise ceiling; real spurs (images, glitch, INL) usually set the achievable SFDR lower.</p>` },
      { q: String.raw`An RF-sampling DAC at $f_s=6$ GSPS wants to output at 4 GHz. Which Nyquist zone and what is the equivalent baseband frequency?`, solution: String.raw`<p><b>Formula.</b> $$\text{zone}=\left\lceil\frac{f_{RF}}{f_s/2}\right\rceil,\qquad f_{base}=|f_{RF}-k f_s|$$ where $f_{RF}$ is the desired output, $f_s$ the DAC rate, and $f_{base}$ the digital tone whose image lands at $f_{RF}$.</p>
      <p><b>Substitute.</b> $f_{RF}=4$ GHz, $f_s=6$ GHz: $\text{zone}=\lceil 4/3\rceil$; $f_{base}=|4-1\times6|$ (nearest multiple $k=1$).</p>
      <p><b>Compute.</b> Zones are 1 (0-3 GHz) and 2 (3-6 GHz); $\lceil 4/3\rceil=2$, so 4 GHz is in zone 2. $f_{base}=|4-6|=2$ GHz.</p>
      <p><b>Explanation.</b> Generate the waveform digitally at 2 GHz; its zone-2 image at 4 GHz is selected by a bandpass reconstruction filter and boosted by mix-mode operation. This is direct-RF synthesis with no analog upconverter - the image structure that plagues baseband DACs becomes the feature.</p>` },
      { q: String.raw`Compute the droop difference between DC and $0.1f_s$ for a plain ZOH.`, solution: String.raw`<p><b>Formula.</b> $$\text{droop}(\alpha)=20\log_{10}\!\left(\frac{\sin(\pi\alpha)}{\pi\alpha}\right),\quad \Delta=\text{droop}(0)-\text{droop}(0.1)$$ where $\alpha=f/f_s$ and $\text{droop}(0)=0$ dB (sinc$\to1$ at DC).</p>
      <p><b>Substitute.</b> $\alpha=0.1$: $\text{droop}(0.1)=20\log_{10}(\sin(0.1\pi)/(0.1\pi))$.</p>
      <p><b>Compute.</b> $\sin(0.1\pi)=0.3090$, $0.1\pi=0.3142$, ratio $=0.9836$; droop $=20\log_{10}0.9836=-0.14$ dB. Difference $\Delta=0-(-0.14)=0.14$ dB.</p>
      <p><b>Explanation.</b> Only 0.14 dB of droop across the lowest tenth of the band - essentially negligible. This confirms the design rule: keep signals well below Nyquist (large interpolation) and the ZOH sinc roll-off needs no correction at all.</p>` }
    ],
    realWorld: String.raw`<p>Transmit DACs sit at the heart of every signal generator, cellular basestation, and radar transmitter. Traditional designs run the DAC at baseband/IF and use an analog upconverter; modern RF-sampling DACs (in RFSoC and standalone parts) generate multi-GHz RF directly using higher-Nyquist-zone images and mix-mode/RZ envelopes, collapsing the transmit chain. Vendors provide programmable inverse-sinc and interpolation filters on-chip so designers can trade headroom, filter complexity, and flatness. In audio, oversampling DACs push images to hundreds of kHz where a simple analog filter suffices. Understanding the sinc envelope and image structure is essential to meeting spectral emission masks without over-designing the analog reconstruction filter.</p>`,
    related: ['adc', 'sdr', 'ad9361', 'rfsoc', 'comm-basics']
  },

  {
    id: 'ad9361',
    title: 'AD9361 RF Transceiver',
    category: 'SDR & Data Converters',
    tags: ['ad9361', 'transceiver', 'zero-if', 'agile', 'pluto', 'usrp', 'calibration', 'lvds'],
    summary: String.raw`The AD9361 is a highly integrated 2x2 agile RF transceiver covering roughly 70 MHz to 6 GHz with up to 56 MHz channel bandwidth, combining LNAs, mixers, baseband filters, 12-bit ADCs/DACs, fractional-N synthesizers, AGC, and on-chip DC/LO/IQ calibration in a single device controlled via SPI.`,
    prerequisites: ['sdr', 'adc', 'dac', 'pll'],
    intro: String.raw`<p><b>Why learn one specific chip?</b> Because the AD9361 is where the abstract SDR ideal - "digitize near the antenna, do the rest in software" - became a single part you can buy and program. Before it, building a tunable wideband radio meant a shelf of discrete mixers, VCOs, filters, and converters, each hand-matched. The AD9361 folds that whole shelf into one SPI-controlled device that self-calibrates its own analog imperfections. It is the canonical teaching example of integrated zero-IF, and mastering it means understanding how every SDR concept lands in real silicon.</p>
    <p>The Analog Devices <b>AD9361</b> is the archetypal integrated SDR front end: a complete <b>direct-conversion (zero-IF) 2x2 MIMO transceiver</b> on one chip. It spans roughly <b>70 MHz to 6 GHz</b> in local-oscillator frequency, supports channel bandwidths from under 200 kHz to <b>56 MHz</b>, and integrates essentially everything between the antenna and the digital baseband: low-noise amplifiers, quadrature mixers, tunable analog baseband filters, <b>12-bit ADCs and DACs</b>, <b>fractional-N PLL synthesizers</b>, gain control, and a suite of <b>on-chip calibration engines</b> that tame the classic zero-IF impairments.</p>
    <p>Because it collapses an entire radio into a software-configurable part, the AD9361 powers the <b>ADALM-PLUTO</b> learning SDR and the Ettus <b>USRP B200/B210</b>, among many commercial radios. Mastery means understanding its architecture, its calibration flow, and its data/control interfaces.</p>`,
    sections: [
      {
        h: 'Integrated Architecture',
        html: String.raw`<p>The AD9361 contains two independent receive chains and two transmit chains (2x2). Each RX path is a zero-IF chain: RF input, LNA, quadrature downconversion mixer driven by the RX PLL, programmable-gain baseband amplifiers, tunable analog lowpass (anti-alias) filters, and a 12-bit ADC per I and Q. Each TX path mirrors this: 12-bit DAC per I/Q, reconstruction filter, quadrature upconversion mixer driven by the TX PLL, and a driver amplifier.</p>
        <ul>
          <li><b>Frequency range</b>: LO ~70 MHz to 6 GHz (fractional-N synthesizers with low phase noise).</li>
          <li><b>Channel bandwidth</b>: programmable from &lt;200 kHz up to 56 MHz (RX and TX baseband filters and converter rates are configurable).</li>
          <li><b>Converters</b>: 12-bit ADCs and DACs; internal decimation/interpolation (the "digital front end", including programmable FIR) reduces the data rate to the host.</li>
          <li><b>Clocking</b>: an internal reference and clock generation derive the ADC/DAC sample clocks and PLL references.</li>
        </ul>
        <div class="callout"><b>Why it matters:</b> one part replaces a shelf of discrete mixers, filters, VCOs, and converters, which is exactly the SDR goal of pushing digitization near the antenna with minimal, reconfigurable analog.</div>`
      },
      {
        h: 'Zero-IF Impairments and On-Chip Calibration',
        html: String.raw`<div class="callout tip"><b>Why calibration is the price of integration:</b> zero-IF is chosen precisely because it needs no bulky image filter - but that same choice dumps the wanted signal right on top of DC, where analog circuits misbehave most (offsets, leakage, mismatch). The bargain is: accept those near-DC gremlins, then hunt them down in silicon with automatic calibration loops. Without the calibrations below, an integrated zero-IF radio would be unusable; with them, it rivals a superhet.</div>
        <p>Being direct-conversion, the AD9361 inherits DC offset, LO leakage, and IQ imbalance - and solves them with hardware calibration engines that run at initialization and can track over temperature:</p>
        <ul>
          <li><b>DC-offset calibration</b> (RX): measures and cancels the static DC term that would otherwise sit in the channel center; separate tracking handles baseband and RF-induced offsets.</li>
          <li><b>Quadrature (IQ) calibration</b>: corrects gain/phase mismatch between I and Q on both RX and TX, maximizing image rejection.</li>
          <li><b>TX LO leakage calibration</b>: injects a canceling DC bias so the transmitted carrier feedthrough spur at the LO frequency is minimized.</li>
          <li><b>Baseband and RF filter/tuning calibrations</b>: set filter corner frequencies and correct RC variation.</li>
        </ul>
        <p>These calibrations are what make a highly integrated zero-IF part usable for real modulation; without them the image and DC spurs would dominate.</p>`
      },
      {
        h: 'Gain Control (AGC)',
        html: String.raw`<p>The AD9361 provides flexible <b>automatic gain control</b> with distributed gain elements (LNA, mixer, baseband PGA). Two AGC modes:</p>
        <ul>
          <li><b>Manual gain control (MGC)</b> - the host sets gain indices; used when the baseband processor manages levels.</li>
          <li><b>Automatic gain control</b> - <b>fast</b> (rapidly reacts to bursts/large blockers, e.g. TDD systems) and <b>slow</b> (settles for continuous signals) modes, using peak and power detectors to keep the ADC optimally loaded without clipping.</li>
        </ul>
        <p>Correct AGC configuration is essential to realize the ADC's dynamic range in the presence of fading and interferers.</p>`
      },
      {
        h: 'Control and Data Interfaces',
        html: String.raw`<table class="data">
          <tr><th>Interface</th><th>Purpose</th><th>Notes</th></tr>
          <tr><td>SPI</td><td>Register configuration, calibration, mode control</td><td>Low-speed control plane</td></tr>
          <tr><td>Data port (LVDS)</td><td>High-rate IQ sample transfer</td><td>DDR, up to high sample rates; used at wide bandwidth</td></tr>
          <tr><td>Data port (CMOS)</td><td>Lower-rate IQ transfer</td><td>Simpler, for lower bandwidth</td></tr>
          <tr><td>Control I/O (GPIO/CTRL)</td><td>TDD timing, gain, enable state machine (ENSM)</td><td>Real-time control</td></tr>
        </table>
        <p>An FPGA typically drives the AD9361: SPI for setup, LVDS/CMOS for the IQ streams, and dedicated control pins for the <b>Enable State Machine (ENSM)</b> that sequences sleep/RX/TX for TDD operation. The programmable on-chip FIR and decimation/interpolation set the sample rate delivered across the data port, keeping the FPGA/host link within budget.</p>`
      },
      {
        h: 'AD9361 vs AD9364 / AD9363 and Platforms',
        html: String.raw`<table class="data">
          <tr><th>Part</th><th>Channels</th><th>Range</th><th>Max BW</th><th>Typical use</th></tr>
          <tr><td>AD9361</td><td>2x2</td><td>70 MHz - 6 GHz</td><td>56 MHz</td><td>USRP B210, wideband MIMO</td></tr>
          <tr><td>AD9364</td><td>1x1</td><td>70 MHz - 6 GHz</td><td>56 MHz</td><td>Single-channel radios</td></tr>
          <tr><td>AD9363</td><td>2x2</td><td>325 MHz - 3.8 GHz</td><td>20 MHz</td><td>ADALM-PLUTO (cost-reduced)</td></tr>
        </table>
        <p>The <b>ADALM-PLUTO</b> pairs an AD936x with a Zynq SoC over USB - a complete learning SDR; PLUTO firmware can often unlock the wider AD9361-like range. The <b>USRP B200/B210</b> use the AD9361 with a Xilinx FPGA and UHD driver, integrating into GNU Radio and MATLAB. This ecosystem is why the AD9361 is the reference device for teaching integrated SDR front ends.</p>`
      },
      {
        h: 'Configuring for a Waveform: A Practical View',
        html: String.raw`<p>Bringing up an AD9361 link involves a repeatable sequence:</p>
        <ul>
          <li>Set the <b>LO frequency</b> (RX/TX PLLs) for the band of interest.</li>
          <li>Choose the <b>sample rate</b> and <b>baseband filter</b> bandwidth to match the signal (e.g. 61.44 MS/s for wide LTE-like signals, lower for narrowband).</li>
          <li>Program the <b>digital FIR</b> and decimation/interpolation to shape the channel and set the host data rate.</li>
          <li>Run <b>calibrations</b> (DC, IQ, TX LO leakage) and configure <b>AGC</b> mode.</li>
          <li>Configure the <b>ENSM</b> for FDD or TDD and start streaming IQ over LVDS/CMOS.</li>
        </ul>
        <p>Vendor tools (ADI's filter wizard, no-OS drivers, IIO framework) generate the register sets; the flexibility means the same silicon serves GPS-band narrowband receivers and wideband LTE/radar experiments.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<ul>
          <li><b>What it is:</b> a 2x2 direct-conversion (zero-IF) transceiver spanning ~70 MHz-6 GHz with up to 56 MHz bandwidth, folding LNAs, quadrature mixers, tunable filters, 12-bit ADCs/DACs, fractional-N PLLs, and AGC into one SPI-controlled part.</li>
          <li><b>Why calibration is central:</b> on-chip DC-offset, IQ, and TX LO-leakage engines are what make an integrated zero-IF radio usable - they turn ~40 dB image rejection into ~54 dB and null the DC/carrier spurs.</li>
          <li><b>The LO math:</b> $f_{LO}=f_{ref}(N+F/M)$ - you can now pick the integer/fractional divide for any band, and know why delta-sigma dithering tames fractional spurs.</li>
          <li><b>Data vs control:</b> SPI configures; LVDS (or CMOS) carries IQ; the ENSM sequences sleep/RX/TX for TDD/FDD - and the on-chip FIR/decimation sets the host data rate so the link stays in budget.</li>
          <li><b>Where it fits:</b> it powers the ADALM-PLUTO and USRP B200/B210, the reference platforms for GNU Radio/UHD/MATLAB; AD9364 is the 1x1 variant, AD9363 the cost/range-reduced one.</li>
          <li><b>Bring-up recipe:</b> set LO, set sample rate/filter, program FIR/decimation, run calibrations, configure AGC/ENSM, stream - a sequence you can now follow end to end.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://wiki.analog.com/resources/eval/user-guides/ad-fmcomms2-ebz/ad9361" target="_blank" rel="noopener">Analog Devices Wiki — AD9361/AD9364/AD9363</a> — the authoritative engineering wiki for the part: register maps, calibration, filter design, and driver notes.</li>
<li><a href="https://en.wikipedia.org/wiki/Direct_conversion_receiver" target="_blank" rel="noopener">Wikipedia — Direct-conversion receiver</a> — the zero-IF architecture the AD9361 implements, including DC offset, LO leakage, and IQ-imbalance impairments.</li>
<li><a href="https://wiki.analog.com/university/tools/pluto/users" target="_blank" rel="noopener">Analog Devices Wiki — ADALM-PLUTO User Guide</a> — hands-on documentation for the AD936x-based PlutoSDR: bring-up, sample rates, and GNU Radio/MATLAB use.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`The AD9361 is a 2x2 direct-conversion (zero-IF) RF transceiver, ~70 MHz to 6 GHz LO range.`,
      String.raw`Channel bandwidth is programmable up to 56 MHz (down to sub-MHz).`,
      String.raw`It integrates LNAs, quadrature mixers, tunable baseband filters, 12-bit ADCs and DACs, fractional-N PLLs, and AGC.`,
      String.raw`On-chip calibration handles DC offset, IQ imbalance, and TX LO leakage - essential for a usable zero-IF part.`,
      String.raw`A programmable digital FIR plus decimation/interpolation sets the sample rate delivered to the host.`,
      String.raw`Control is via SPI; IQ data uses LVDS (high rate) or CMOS (lower rate) data ports.`,
      String.raw`The Enable State Machine (ENSM) sequences sleep/RX/TX for TDD/FDD operation via control pins.`,
      String.raw`AGC offers manual, fast, and slow modes to keep the 12-bit ADC optimally loaded.`,
      String.raw`AD9364 is the 1x1 variant; AD9363 is a cost/range-reduced 2x2 used in the ADALM-PLUTO.`,
      String.raw`It powers the ADALM-PLUTO and Ettus USRP B200/B210, integrating with GNU Radio, UHD, and MATLAB.`,
      String.raw`Bring-up sequence: set LO, set sample rate/filter, program FIR/decimation, calibrate, configure AGC/ENSM, stream.`,
      String.raw`The AD9361 embodies the SDR ideal: an entire reconfigurable radio front end in one SPI-controlled device.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr-ad9361" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="16" fill="#e6edf3" font-size="13">AD9361 integrated transceiver (one of 2 chains)</text>
        <rect x="18" y="35" width="404" height="80" rx="4" fill="none" stroke="#4dabf7" stroke-dasharray="4 3"/>
        <text x="24" y="48" fill="#4dabf7" font-size="9">RX zero-IF path</text>
        <rect x="30" y="58" width="34" height="24" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="34" y="74" fill="#e6edf3" font-size="8">LNA</text>
        <circle cx="95" cy="70" r="13" fill="#1c232e" stroke="#ffa94d"/><text x="88" y="74" fill="#e6edf3" font-size="9">IQ</text>
        <rect x="125" y="58" width="34" height="24" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="129" y="74" fill="#e6edf3" font-size="8">LPF</text>
        <rect x="170" y="58" width="30" height="24" rx="3" fill="#1c232e" stroke="#4dabf7"/><text x="174" y="74" fill="#e6edf3" font-size="8">ADC</text>
        <rect x="210" y="58" width="46" height="24" rx="3" fill="#1c232e" stroke="#b197fc"/><text x="214" y="74" fill="#e6edf3" font-size="8">dec/FIR</text>
        <line x1="64" y1="70" x2="82" y2="70" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <line x1="108" y1="70" x2="125" y2="70" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <line x1="159" y1="70" x2="170" y2="70" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <line x1="200" y1="70" x2="210" y2="70" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <line x1="256" y1="70" x2="300" y2="70" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <rect x="18" y="130" width="404" height="80" rx="4" fill="none" stroke="#ff6b6b" stroke-dasharray="4 3"/>
        <text x="24" y="143" fill="#ff6b6b" font-size="9">TX zero-IF path</text>
        <rect x="210" y="152" width="46" height="24" rx="3" fill="#1c232e" stroke="#b197fc"/><text x="214" y="168" fill="#e6edf3" font-size="8">int/FIR</text>
        <rect x="170" y="152" width="30" height="24" rx="3" fill="#1c232e" stroke="#4dabf7"/><text x="174" y="168" fill="#e6edf3" font-size="8">DAC</text>
        <rect x="125" y="152" width="34" height="24" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="129" y="168" fill="#e6edf3" font-size="8">LPF</text>
        <circle cx="95" cy="164" r="13" fill="#1c232e" stroke="#ffa94d"/><text x="88" y="168" fill="#e6edf3" font-size="9">IQ</text>
        <rect x="30" y="152" width="34" height="24" rx="3" fill="#1c232e" stroke="#63e6be"/><text x="36" y="168" fill="#e6edf3" font-size="8">PA</text>
        <line x1="300" y1="164" x2="256" y2="164" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <line x1="210" y1="164" x2="200" y2="164" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <line x1="170" y1="164" x2="159" y2="164" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <line x1="125" y1="164" x2="108" y2="164" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <line x1="82" y1="164" x2="64" y2="164" stroke="#9aa7b5" marker-end="url(#arr-ad9361)"/>
        <rect x="60" y="215" width="90" height="22" rx="3" fill="#1c232e" stroke="#ffa94d"/><text x="66" y="230" fill="#e6edf3" font-size="8">frac-N PLL (LO)</text>
        <line x1="95" y1="215" x2="95" y2="83" stroke="#9aa7b5" stroke-dasharray="2 2"/>
        <rect x="300" y="95" width="80" height="70" rx="4" fill="#1c232e" stroke="#63e6be"/><text x="308" y="118" fill="#e6edf3" font-size="9">Data port</text><text x="308" y="134" fill="#9aa7b5" font-size="8">LVDS/CMOS</text><text x="308" y="150" fill="#9aa7b5" font-size="8">IQ to FPGA</text>
        <rect x="420" y="95" width="100" height="70" rx="4" fill="#1c232e" stroke="#b197fc"/><text x="428" y="118" fill="#e6edf3" font-size="9">Calibration</text><text x="428" y="132" fill="#9aa7b5" font-size="8">DC/IQ/LOleak</text><text x="428" y="150" fill="#9aa7b5" font-size="8">SPI control</text>
        </svg>`,
        caption: 'AD9361 block view: dual zero-IF RX/TX chains with LNAs, quadrature mixers, filters, 12-bit converters, fractional-N LO, digital FIR, LVDS/CMOS data port, SPI control, and on-chip calibration.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <text x="12" y="18" fill="#e6edf3" font-size="13">System: FPGA/host drives the AD9361</text>
        <rect x="30" y="55" width="110" height="50" rx="4" fill="#1c232e" stroke="#4dabf7"/><text x="40" y="78" fill="#e6edf3" font-size="10">AD9361</text><text x="40" y="95" fill="#9aa7b5" font-size="8">RF front end</text>
        <rect x="215" y="55" width="110" height="50" rx="4" fill="#1c232e" stroke="#b197fc"/><text x="230" y="78" fill="#e6edf3" font-size="10">FPGA/SoC</text><text x="228" y="95" fill="#9aa7b5" font-size="8">DDC/DUC, MAC</text>
        <rect x="400" y="55" width="110" height="50" rx="4" fill="#1c232e" stroke="#63e6be"/><text x="415" y="78" fill="#e6edf3" font-size="10">Host/GNU Radio</text>
        <line x1="140" y1="70" x2="215" y2="70" stroke="#63e6be"/><text x="150" y="65" fill="#63e6be" font-size="8">LVDS IQ</text>
        <line x1="140" y1="92" x2="215" y2="92" stroke="#ffa94d"/><text x="150" y="103" fill="#ffa94d" font-size="8">SPI + CTRL/ENSM</text>
        <line x1="325" y1="80" x2="400" y2="80" stroke="#9aa7b5"/><text x="335" y="75" fill="#9aa7b5" font-size="8">USB/Eth</text>
        </svg>`,
        caption: 'Typical system: an FPGA/SoC configures the AD9361 over SPI and control pins and streams IQ over LVDS, forwarding to a host running GNU Radio/UHD.'
      },
      {
        title: String.raw`AGC and calibration feedback loops`,
        svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr3-ad9361" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="16" fill="#e6edf3" font-size="13">AD9361 AGC + calibration loops</text>
        <polygon points="16,66 32,57 32,75" fill="#4dabf7"/>
        <rect x="42" y="52" width="46" height="28" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="46" y="70" fill="#e6edf3" font-size="8">LNA/PGA</text>
        <rect x="104" y="52" width="42" height="28" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="108" y="70" fill="#e6edf3" font-size="8">mixer</text>
        <rect x="162" y="52" width="40" height="28" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="167" y="70" fill="#e6edf3" font-size="8">ADC</text>
        <rect x="218" y="52" width="70" height="28" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="222" y="70" fill="#e6edf3" font-size="8">DC / IQ corr</text>
        <line x1="32" y1="66" x2="42" y2="66" stroke="#9aa7b5" marker-end="url(#arr3-ad9361)"/>
        <line x1="88" y1="66" x2="104" y2="66" stroke="#9aa7b5" marker-end="url(#arr3-ad9361)"/>
        <line x1="146" y1="66" x2="162" y2="66" stroke="#9aa7b5" marker-end="url(#arr3-ad9361)"/>
        <line x1="202" y1="66" x2="218" y2="66" stroke="#9aa7b5" marker-end="url(#arr3-ad9361)"/>
        <line x1="288" y1="66" x2="320" y2="66" stroke="#9aa7b5" marker-end="url(#arr3-ad9361)"/><text x="324" y="70" fill="#63e6be" font-size="9">IQ out</text>
        <rect x="120" y="120" width="90" height="28" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="126" y="138" fill="#e6edf3" font-size="8">peak/pwr det</text>
        <line x1="182" y1="80" x2="182" y2="120" stroke="#9aa7b5" marker-end="url(#arr3-ad9361)"/><text x="186" y="104" fill="#9aa7b5" font-size="7">measure level</text>
        <rect x="120" y="168" width="90" height="26" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="126" y="185" fill="#e6edf3" font-size="8">AGC engine</text>
        <line x1="165" y1="148" x2="165" y2="168" stroke="#9aa7b5" marker-end="url(#arr3-ad9361)"/>
        <path d="M120,181 L60,181 L60,80" stroke="#63e6be" fill="none" marker-end="url(#arr3-ad9361)"/><text x="62" y="200" fill="#63e6be" font-size="7">set gain (no clip)</text>
        <rect x="330" y="120" width="96" height="28" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="336" y="138" fill="#e6edf3" font-size="8">cal engine</text>
        <path d="M330,134 L253,134 L253,80" stroke="#b197fc" fill="none" marker-end="url(#arr3-ad9361)"/><text x="256" y="104" fill="#b197fc" font-size="7">tune DC/IQ</text>
        <text x="330" y="170" fill="#9aa7b5" font-size="8">DC-offset, IQ,</text><text x="330" y="184" fill="#9aa7b5" font-size="8">TX LO-leak cal</text>
        <text x="16" y="222" fill="#9aa7b5" font-size="9">AGC feeds gain back to keep the ADC filled; cal engines drive residual DC/IQ to zero.</text>
        </svg>`,
        caption: 'AD9361 feedback loops: peak/power detectors drive the AGC engine to set front-end gain (fill the ADC without clipping), while calibration engines measure and null DC offset, IQ imbalance, and TX LO leakage.'
      }
    ],
    equations: [
      {
        title: 'Fractional-N LO frequency',
        tex: String.raw`$$f_{LO}=f_{ref}\left(N + \frac{F}{M}\right)$$`,
        derivation: String.raw`<p>The AD9361 synthesizes its LO with a fractional-N PLL: the VCO is divided by a fractional value $N+F/M$ before the phase comparison to $f_{ref}$. Locking forces $f_{LO}/(N+F/M)=f_{ref}$, so $f_{LO}=f_{ref}(N+F/M)$. The fractional part gives fine frequency resolution across 70 MHz-6 GHz; a delta-sigma modulator dithers $F/M$ to spread fractional spurs.</p>`
      },
      {
        title: 'Host data rate over the data port',
        tex: String.raw`$$R=f_s\times 12\ \text{bits}\times 2_{(I,Q)}\times N_{ch}$$`,
        derivation: String.raw`<p>Each 12-bit converter sample is transferred as I and Q per channel. For $f_s=61.44$ MS/s and 2 channels: $R=61.44\times10^6\times12\times2\times2=2.95$ Gb/s. On-chip decimation lowers $f_s$ to fit the LVDS/CMOS port and downstream link, illustrating why the digital FIR/decimation stage matters.</p>`
      },
      {
        title: 'Image rejection after IQ calibration',
        tex: String.raw`$$\text{IRR}\approx\frac{1}{(\varepsilon/2)^2+(\psi/2)^2}$$`,
        derivation: String.raw`<p>Same relation as any zero-IF radio (see SDR topic). The AD9361's quadrature calibration drives residual gain mismatch $\varepsilon$ and phase error $\psi$ small, pushing IRR well beyond the ~40 dB of an uncalibrated part - enabling higher-order modulation with tight image specs.</p>`
      },
      {
        title: 'Baseband filter bandwidth vs sample rate',
        tex: String.raw`$$B_{BB}\lesssim \frac{f_s}{2}\quad\text{with margin for the FIR transition band}$$`,
        derivation: String.raw`<p>The analog baseband LPF corner and the ADC/DAC sample rate are chosen together: the filter must reject energy beyond $f_s/2$ (anti-alias) while passing the wanted channel. In practice $B_{BB}$ is set slightly below Nyquist and the digital FIR provides the sharp final selectivity, so the analog filter can be gentle.</p>`
      },
      {
        title: 'ADC/DAC ideal SNR (12-bit)',
        tex: String.raw`$$\text{SNR}_{ideal}=6.02\times12+1.76=74.0\ \text{dB}$$`,
        derivation: String.raw`<p>Applying $6.02N+1.76$ with $N=12$ gives the theoretical ceiling of each converter. Real in-band SNR/ENOB is lower due to jitter, calibration residue, and analog noise; oversampling plus decimation recovers processing gain, so effective dynamic range for a narrow channel exceeds the raw 74 dB.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What kind of transceiver is the AD9361?`, back: String.raw`A highly integrated 2x2 direct-conversion (zero-IF) RF transceiver, ~70 MHz to 6 GHz.` },
      { front: String.raw`Maximum channel bandwidth of the AD9361?`, back: String.raw`Up to 56 MHz (programmable down to sub-MHz).` },
      { front: String.raw`What does the AD9361 integrate?`, back: String.raw`LNAs, quadrature mixers, tunable baseband filters, 12-bit ADCs/DACs, fractional-N PLLs, AGC, and calibration engines.` },
      { front: String.raw`Which zero-IF impairments does the AD9361 calibrate?`, back: String.raw`DC offset, IQ (quadrature) imbalance, and TX LO leakage, plus filter/RC tuning.` },
      { front: String.raw`What is the AD9361 control interface?`, back: String.raw`SPI for register configuration and calibration control.` },
      { front: String.raw`How is IQ data moved off-chip?`, back: String.raw`Over the data port: LVDS (high rate) or CMOS (lower rate), typically to an FPGA.` },
      { front: String.raw`What is the ENSM?`, back: String.raw`The Enable State Machine that sequences sleep/RX/TX states for TDD/FDD via control pins.` },
      { front: String.raw`AGC modes on the AD9361?`, back: String.raw`Manual (MGC), fast AGC (bursty/TDD), and slow AGC (continuous signals).` },
      { front: String.raw`Difference between AD9361, AD9364, AD9363?`, back: String.raw`AD9361 = 2x2, 70M-6G, 56 MHz; AD9364 = 1x1 same range; AD9363 = 2x2 reduced range (325M-3.8G) and 20 MHz BW.` },
      { front: String.raw`Which SDR platforms use the AD936x?`, back: String.raw`ADALM-PLUTO (AD9363/AD9361) and Ettus USRP B200/B210 (AD9361).` },
      { front: String.raw`Converter resolution in the AD9361?`, back: String.raw`12-bit ADCs and DACs (ideal SNR 74 dB).` },
      { front: String.raw`Why does the on-chip FIR/decimation matter?`, back: String.raw`It shapes the channel and sets the data rate delivered over LVDS/CMOS, keeping the host link within budget.` },
      { front: String.raw`How is the LO frequency set?`, back: String.raw`Fractional-N PLL: $f_{LO}=f_{ref}(N+F/M)$ with delta-sigma dithering for fine steps and low spurs.` },
      { front: String.raw`Why are calibrations essential in the AD9361?`, back: String.raw`Zero-IF puts DC/image spurs in-band; calibration suppresses them so real modulation is usable.` },
      { front: String.raw`Typical AD9361 bring-up sequence?`, back: String.raw`Set LO, set sample rate/filter, program FIR/decimation, run calibrations, configure AGC/ENSM, stream IQ.` }
    ],
    mcqs: [
      { q: String.raw`The AD9361 uses which receiver architecture?`, options: [String.raw`superheterodyne`, String.raw`direct-conversion (zero-IF)`, String.raw`crystal video`, String.raw`regenerative`], answer: 1, explain: String.raw`It is a zero-IF (direct-conversion) transceiver.` },
      { q: String.raw`Its LO frequency range is approximately:`, options: [String.raw`1-30 MHz`, String.raw`70 MHz - 6 GHz`, String.raw`6-18 GHz`, String.raw`DC - 100 MHz`], answer: 1, explain: String.raw`~70 MHz to 6 GHz.` },
      { q: String.raw`Maximum channel bandwidth is about:`, options: [String.raw`5 MHz`, String.raw`20 MHz`, String.raw`56 MHz`, String.raw`200 MHz`], answer: 2, explain: String.raw`Up to 56 MHz.` },
      { q: String.raw`The converters in the AD9361 are:`, options: [String.raw`8-bit`, String.raw`10-bit`, String.raw`12-bit`, String.raw`16-bit`], answer: 2, explain: String.raw`12-bit ADCs and DACs (ideal SNR 74 dB).` },
      { q: String.raw`Which is NOT calibrated on-chip?`, options: [String.raw`DC offset`, String.raw`IQ imbalance`, String.raw`TX LO leakage`, String.raw`antenna VSWR`], answer: 3, explain: String.raw`Antenna VSWR is external; the chip calibrates DC, IQ, and LO leakage.` },
      { q: String.raw`Register configuration uses:`, options: [String.raw`LVDS`, String.raw`SPI`, String.raw`I2S`, String.raw`Ethernet`], answer: 1, explain: String.raw`SPI is the control plane.` },
      { q: String.raw`High-rate IQ samples leave the chip via:`, options: [String.raw`SPI`, String.raw`LVDS data port`, String.raw`UART`, String.raw`analog IF`], answer: 1, explain: String.raw`LVDS (or CMOS at lower rate) carries the IQ data.` },
      { q: String.raw`The ENSM controls:`, options: [String.raw`the FIR taps`, String.raw`sleep/RX/TX state sequencing`, String.raw`the SPI clock`, String.raw`the ADC bits`], answer: 1, explain: String.raw`The Enable State Machine sequences the radio states for TDD/FDD.` },
      { q: String.raw`Which AGC mode suits bursty TDD signals?`, options: [String.raw`manual`, String.raw`slow AGC`, String.raw`fast AGC`, String.raw`no AGC`], answer: 2, explain: String.raw`Fast AGC reacts quickly to bursts and blockers.` },
      { q: String.raw`The single-channel (1x1) variant is the:`, options: [String.raw`AD9363`, String.raw`AD9364`, String.raw`AD9371`, String.raw`AD9680`], answer: 1, explain: String.raw`AD9364 is the 1x1 version of the AD9361.` },
      { q: String.raw`Which learning SDR is built on an AD936x?`, options: [String.raw`RTL-SDR dongle`, String.raw`ADALM-PLUTO`, String.raw`HackRF One`, String.raw`FUNcube`], answer: 1, explain: String.raw`The ADALM-PLUTO uses an AD9363/AD9361 with a Zynq SoC.` },
      { q: String.raw`Host data rate at 61.44 MS/s, 12-bit, 2 channels is about:`, options: [String.raw`0.7 Gb/s`, String.raw`1.5 Gb/s`, String.raw`2.95 Gb/s`, String.raw`10 Gb/s`], answer: 2, explain: String.raw`$61.44\times12\times2\times2\approx 2.95$ Gb/s.` },
      { q: String.raw`On-chip decimation/FIR mainly serves to:`, options: [String.raw`increase phase noise`, String.raw`shape the channel and set the host data rate`, String.raw`generate the LO`, String.raw`amplify the RF`], answer: 1, explain: String.raw`It provides selectivity and reduces the rate over the data port.` }
    ],
    numericals: [
      { q: String.raw`An AD9361 uses $f_{ref}=40$ MHz. Find the integer/fractional divide to synthesize an LO of 2.45 GHz.`, solution: String.raw`<p><b>Formula.</b> $$f_{LO}=f_{ref}\left(N+\frac{F}{M}\right)\;\Rightarrow\; N+\frac{F}{M}=\frac{f_{LO}}{f_{ref}}$$ where $N$ is the integer divide, $F/M$ the fractional part, $f_{ref}$ the PLL reference, and $f_{LO}$ the local-oscillator frequency.</p>
      <p><b>Substitute.</b> $f_{LO}=2450$ MHz, $f_{ref}=40$ MHz: $$N+\frac{F}{M}=\frac{2450}{40}.$$</p>
      <p><b>Compute.</b> $2450/40=61.25$, so $N=61$ and $F/M=0.25=1/4$.</p>
      <p><b>Explanation.</b> The fractional-N PLL locks the VCO at exactly 2.45 GHz using a non-integer divide; the 0.25 fraction gives fine frequency resolution unreachable with integer-N. A delta-sigma modulator dithers $F/M$ so the fractional spurs are randomized rather than sitting at discrete offsets.</p>` },
      { q: String.raw`For a 20 MHz LTE-like channel, choose an AD9361 sample rate and comment on the on-chip filtering.`, solution: String.raw`<p><b>Formula.</b> $$\frac{f_s}{2}>\frac{B}{2}\quad(\text{complex baseband}),\qquad B_{BB}\gtrsim \frac{B}{2}$$ where $B$ is the channel width, $f_s/2$ the complex Nyquist edge, and $B_{BB}$ the analog baseband LPF corner (one-sided, since the zero-IF channel spans $\pm B/2$).</p>
      <p><b>Substitute.</b> $B=20$ MHz, half-bandwidth $B/2=10$ MHz. Try $f_s=30.72$ MS/s: Nyquist $=15.36$ MHz. Set $B_{BB}\approx10$-$11$ MHz.</p>
      <p><b>Compute.</b> $15.36$ MHz $>10$ MHz, so 30.72 MS/s comfortably passes the channel (61.44 MS/s with more decimation also works). Analog LPF just above 10 MHz + programmable FIR for sharp selectivity, then decimate to fit the host link.</p>
      <p><b>Explanation.</b> The zero-IF channel occupies $\pm10$ MHz around DC, so the complex Nyquist of 15.36 MHz leaves a healthy guard band. Letting the gentle analog LPF do coarse anti-alias and the digital FIR do the sharp edge is the standard division of labor - it keeps the analog simple and reconfigurable in software.</p>` },
      { q: String.raw`After IQ calibration the residual mismatch is 0.2% gain, 0.2 deg phase. Estimate IRR.`, solution: String.raw`<p><b>Formula.</b> $$\text{IRR}=\frac{1}{(\varepsilon/2)^2+(\psi/2)^2},\qquad \text{IRR}_{dB}=10\log_{10}\text{IRR}$$ where $\varepsilon$ is the residual fractional gain mismatch and $\psi$ the residual phase error (radians) after calibration.</p>
      <p><b>Substitute.</b> $\varepsilon=0.002$, $\psi=0.2^\circ=0.003491$ rad: $$\text{IRR}=\frac{1}{(0.001)^2+(0.001745)^2}.$$</p>
      <p><b>Compute.</b> $(0.001)^2=1.0\times10^{-6}$; $(0.001745)^2=3.046\times10^{-6}$; sum $=4.046\times10^{-6}$. $\text{IRR}=2.47\times10^{5}$; $10\log_{10}(2.47\times10^{5})=53.9\approx54$ dB.</p>
      <p><b>Explanation.</b> On-chip quadrature calibration cuts the residual mismatch tenfold versus the uncalibrated ~40 dB case, lifting image rejection to ~54 dB. That headroom is what lets the AD9361 carry higher-order QAM whose image specs an uncalibrated zero-IF part could not meet.</p>` },
      { q: String.raw`Give the ideal SNR of the AD9361 converters and the extra dynamic range gained by decimating a 61.44 MS/s stream to a 200 kHz channel.`, solution: String.raw`<p><b>Formula.</b> $$\text{SNR}_{ideal}=6.02N+1.76\ \text{dB};\quad \text{OSR}=\frac{f_s}{2B};\quad \text{SNR}_{eff}=\text{SNR}_{ideal}+10\log_{10}(\text{OSR})$$ where $N=12$ bits, $f_s$ the ADC rate, and $B$ the channel bandwidth.</p>
      <p><b>Substitute.</b> $N=12$: $\text{SNR}_{ideal}=6.02\times12+1.76$. $f_s=61.44\times10^{6}$, $B=200\times10^{3}$: $\text{OSR}=61.44\times10^{6}/(2\times100\times10^{3})$.</p>
      <p><b>Compute.</b> $\text{SNR}_{ideal}=72.24+1.76=74.0$ dB. $\text{OSR}=61.44\times10^{6}/200\times10^{3}=307.2$; gain $=10\log_{10}307.2=24.9$ dB. $\text{SNR}_{eff}\approx74.0+24.9\approx99$ dB.</p>
      <p><b>Explanation.</b> Decimating a wide 61.44 MS/s capture down to a 200 kHz channel discards ~99.7% of the quantization noise, lifting the in-band ceiling from 74 dB toward 99 dB. In practice analog/thermal noise, not quantization, becomes the limit well before 99 dB - a reminder that processing gain only helps when quantization is the dominant noise.</p>` },
      { q: String.raw`Two AD9361 receive channels stream at 30.72 MS/s, 12-bit. What is the total LVDS payload data rate?`, solution: String.raw`<p><b>Formula.</b> $$R=f_s\times N_{bits}\times 2_{(I,Q)}\times N_{ch}$$ where $f_s$ is the per-channel sample rate, $N_{bits}=12$, the factor 2 covers I and Q, and $N_{ch}$ the channel count.</p>
      <p><b>Substitute.</b> $f_s=30.72\times10^{6}$, $N_{bits}=12$, $N_{ch}=2$: per channel $30.72\times10^{6}\times12\times2$; total $\times2$.</p>
      <p><b>Compute.</b> Per channel $=30.72\times10^{6}\times24=737$ Mb/s. Two channels $=1.47$ Gb/s.</p>
      <p><b>Explanation.</b> 1.47 Gb/s of payload sits comfortably within an LVDS DDR data port and typical FPGA links, so no further decimation is forced here. Compare with the 2.95 Gb/s at 61.44 MS/s that approaches USB 3.0's limit - sample rate directly sets whether the link is the bottleneck.</p>` }
    ],
    realWorld: String.raw`<p>The AD9361 defined the "radio-on-a-chip" era. It is the front end of the Ettus USRP B200/B210 (paired with a Xilinx Spartan/Artix FPGA and driven by UHD/GNU Radio) and, in its AD9363 form, of the ADALM-PLUTO used in thousands of universities and by hobbyists. Commercial software radios, spectrum monitors, and small-cell prototypes lean on it because a single SPI-controlled part covers HF-to-6 GHz with wide bandwidth and self-calibration. Its successors (AD9371/9375, ADRV9009) extend bandwidth and add observation receivers/DPD for cellular power amplifiers, but the AD9361 remains the canonical teaching device for integrated zero-IF SDR front ends.</p>`,
    related: ['sdr', 'adc', 'dac', 'pll', 'rfsoc']
  },

  {
    id: 'rfsoc',
    title: 'RFSoC',
    category: 'SDR & Data Converters',
    tags: ['rfsoc', 'zynq', 'rf-sampling', 'gsps', 'direct-rf', 'phased-array', '5g', 'mimo'],
    summary: String.raw`The Xilinx/AMD RFSoC integrates gigasample-per-second RF-sampling ADCs and DACs, hardened digital up/down converters, programmable FPGA logic, and multicore Arm processors on a single Zynq UltraScale+ device, enabling direct RF sampling that eliminates analog mixers for many-channel phased-array, massive-MIMO, 5G, radar, and EW systems.`,
    prerequisites: ['sdr', 'adc', 'dac', 'ad9361'],
    intro: String.raw`<p><b>Why does the RFSoC exist?</b> The SDR dream was always to "digitize at the antenna" - but for decades converters were too slow to sample RF directly, so we needed an analog mixer to drag the signal down to a manageable frequency first. What happens when converters finally reach gigasamples per second? The mixer becomes unnecessary: you sample the RF itself, and every impairment the mixer introduced (LO leakage, IQ-imbalance images, mixer spurs) simply vanishes. Now push that further - put dozens of those fast converters, plus the FPGA to process them and the CPUs to control them, on <i>one die</i>. That is the RFSoC: the SDR ideal taken to its physical conclusion for many-channel systems.</p>
    <p>The <b>RFSoC</b> (RF System-on-Chip) is the Zynq UltraScale+ family variant from Xilinx/AMD that embeds <b>gigasample-per-second (GSPS) RF-sampling data converters</b> directly into a heterogeneous SoC alongside FPGA programmable logic and multicore Arm processors. It represents the culmination of the SDR philosophy: converters fast enough to <b>sample RF directly</b>, removing the analog mixer and its LO, IQ-imbalance, and image problems, while the on-chip FPGA and hardened DSP handle channelization at line rate.</p>
    <p>Where an AD9361 integrates one zero-IF radio, an RFSoC integrates <b>many direct-RF channels</b> plus the digital processing and control processors - ideal for <b>phased arrays, massive MIMO, multiband radar, and electronic warfare</b>, where channel count and bandwidth dominate.</p>`,
    sections: [
      {
        h: 'What Is Integrated',
        html: String.raw`<p>An RFSoC combines, on one die, the pieces that used to span an entire board or subsystem:</p>
        <ul>
          <li><b>RF-sampling ADCs</b> - multiple channels at up to several GSPS (e.g. Gen 3 parts reach ~5 GSPS ADCs, ~10 GSPS DACs, with tens of GHz analog input bandwidth in later generations).</li>
          <li><b>RF-sampling DACs</b> - many channels at up to ~10 GSPS with mix-mode for higher-Nyquist-zone direct RF synthesis.</li>
          <li><b>Hardened DDC/DUC</b> - dedicated digital down/up-converter blocks (NCO mixers + decimation/interpolation) per channel, offloading the fabric.</li>
          <li><b>FPGA programmable logic</b> - for beamforming, filtering, DSP, and custom protocols at line rate.</li>
          <li><b>Multicore Arm processors</b> (application + real-time cores) - for control, protocol stacks, and management.</li>
          <li><b>High-speed interfaces</b> - multi-gigabit transceivers, memory, and networking to move aggregate data.</li>
        </ul>
        <div class="callout"><b>Big idea:</b> the converter is now a peripheral of the SoC, not a separate chip - so a single device can host dozens of RF channels with their DSP and control, drastically shrinking phased-array and MIMO radios.</div>`
      },
      {
        h: 'Direct RF Sampling: Removing the Mixer',
        html: String.raw`<p>Because the ADC/DAC run at GSPS, the signal band can be digitized/synthesized directly at RF with no analog quadrature mixer. This removes an entire class of impairments and hardware:</p>
        <ul>
          <li><b>No analog LO or mixer</b> - eliminates LO leakage, IQ imbalance images, and mixer spurs inherent to zero-IF.</li>
          <li><b>Bandpass/undersampling and higher Nyquist zones</b> - the RFSoC deliberately uses higher zones (with mix-mode DACs) to place signals at GHz frequencies, as in the DAC topic.</li>
          <li><b>All frequency translation is digital</b> - the hardened DDC/DUC NCOs tune channels in software, so retuning is instantaneous and drift-free.</li>
        </ul>
        <p>The tradeoff is stringent converter requirements: <b>very low aperture jitter</b> (SNR $=-20\log_{10}(2\pi f_{in}t_j)$ punishes high input frequencies) and high analog input bandwidth, plus enormous raw data rates that the hardened DDC/DUC must immediately reduce.</p>`
      },
      {
        h: 'Hardened DDC/DUC and Data Reduction',
        html: String.raw`<div class="callout tip"><b>The problem in one image:</b> sampling RF directly is like drinking from a fire hose - a single converter can spew tens of gigabits per second, and you may have a dozen of them. You cannot pour that into the FPGA fabric; the wires and logic would melt. So each converter gets a dedicated, hardwired "reducer" (the DDC/DUC) sitting right next to it that keeps only the narrow channel you actually want and hands the fabric a trickle instead of a flood.</div>
        <p>A single 4 GSPS 14-bit ADC produces $4\times10^9\times14=56$ Gb/s of raw data - untenable to route in fabric for many channels. The RFSoC therefore places <b>hardened DDC (RX) and DUC (TX)</b> blocks adjacent to each converter:</p>
        <ul>
          <li>The DDC mixes the wanted band to baseband with a fine-resolution NCO and decimates it, delivering a manageable complex IQ stream to the fabric.</li>
          <li>The DUC interpolates and mixes up, feeding the DAC; mix-mode selects the RF Nyquist zone.</li>
          <li>Doing this in hardened silicon (not LUTs) saves fabric, power, and timing closure effort, and matches the converter rate exactly.</li>
        </ul>
        <p>This mirrors the SDR digital-front-end concept but at converter-adjacent, multi-GSPS scale, and is why the RFSoC can support many simultaneous channels.</p>`
      },
      {
        h: 'Why It Wins for Phased Arrays and Massive MIMO',
        html: String.raw`<table class="data">
          <tr><th>Requirement</th><th>Discrete/zero-IF approach</th><th>RFSoC approach</th></tr>
          <tr><td>Many channels</td><td>One transceiver + converters per element (bulky)</td><td>Dozens of RF-sampling ADC/DAC on one die</td></tr>
          <tr><td>Phase coherence</td><td>Match many LO paths carefully</td><td>Shared clock + digital NCOs; deterministic phase</td></tr>
          <tr><td>Beamforming</td><td>Analog phase shifters or separate FPGA</td><td>On-die FPGA does digital beamforming at line rate</td></tr>
          <tr><td>Retuning</td><td>Re-lock analog PLLs</td><td>Change NCO word instantly</td></tr>
          <tr><td>Size/power/cost per channel</td><td>High</td><td>Low (integration)</td></tr>
        </table>
        <p>Digital beamforming needs many phase-coherent channels; the RFSoC's shared clocking and digital NCOs give deterministic, calibratable phase across elements, and the on-die FPGA sums/steers beams without leaving the chip. This is transformative for <b>5G massive-MIMO basestations</b> and <b>multi-element radar/EW arrays</b>.</p>`
      },
      {
        h: 'RFSoC vs AD9361-Class Transceivers',
        html: String.raw`<table class="data">
          <tr><th>Aspect</th><th>AD9361 (integrated zero-IF)</th><th>RFSoC (direct RF)</th></tr>
          <tr><td>Architecture</td><td>Analog quadrature mixer to baseband</td><td>Direct RF sampling, digital mixing</td></tr>
          <tr><td>Converter rate</td><td>~tens of MS/s baseband</td><td>GSPS at RF</td></tr>
          <tr><td>Channels</td><td>2x2</td><td>Many (8/16+ per die)</td></tr>
          <tr><td>Impairments</td><td>DC offset, IQ imbalance (calibrated)</td><td>No mixer image; jitter-limited at high f</td></tr>
          <tr><td>Processing</td><td>External FPGA</td><td>On-die FPGA + Arm</td></tr>
          <tr><td>Best fit</td><td>Compact single/dual radios</td><td>Wideband, many-channel arrays</td></tr>
        </table>
        <p>The two are complementary: AD9361-class parts win on cost, size, and power for a couple of channels at moderate bandwidth; RFSoC wins where <b>channel count, instantaneous bandwidth, and integration of DSP+control</b> matter more than per-channel cost.</p>`
      },
      {
        h: 'Applications and Design Considerations',
        html: String.raw`<ul>
          <li><b>5G / massive MIMO</b> - many coherent TX/RX chains with digital beamforming and wide instantaneous bandwidth.</li>
          <li><b>Radar</b> - direct-RF generation and capture, digital beamforming, and pulse compression on-die.</li>
          <li><b>Electronic warfare / SIGINT</b> - wideband capture and fast retuning via NCOs across many channels.</li>
          <li><b>Satellite/ground stations and test instruments</b> - wideband multichannel processing.</li>
        </ul>
        <p><b>Design considerations:</b> converter aperture jitter and clock distribution dominate high-frequency SNR; thermal management for GSPS converters + FPGA is significant; the tool flow (Vivado, PYNQ, RFSoC data-converter IP) configures the DDC/DUC, NCOs, and calibration. Careful <b>multi-tile synchronization (MTS)</b> aligns converters across tiles for phase-coherent arrays.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<ul>
          <li><b>The integration leap:</b> GSPS RF-sampling ADCs/DACs, hardened DDC/DUC, FPGA fabric, and Arm cores on one Zynq UltraScale+ die - the converter becomes a peripheral, not a separate chip.</li>
          <li><b>Direct RF sampling:</b> sampling at RF deletes the analog mixer/LO and with it LO leakage, IQ-imbalance images, and mixer spurs; all frequency translation becomes digital (NCO), so retuning is instantaneous and drift-free.</li>
          <li><b>The data problem and its fix:</b> raw GSPS streams (tens of Gb/s each) are unroutable, so hardened DDC/DUC decimate/interpolate at the converter - reducing rate by ~$M/2$ for complex output - before data enters the fabric.</li>
          <li><b>The jitter price:</b> $\text{SNR}=-20\log_{10}(2\pi f_{in}t_j)$ forces sub-100-fs clocking at multi-GHz inputs; jitter, not bits, usually limits SNR at RF.</li>
          <li><b>Why arrays love it:</b> shared clocking + digital NCOs + MTS give deterministic phase coherence, and on-die FPGA beamforming realizes $10\log_{10}N$ dB array gain - transformative for 5G massive-MIMO, radar, and EW.</li>
          <li><b>When to choose it:</b> RFSoC wins on channel count and instantaneous bandwidth; AD9361-class parts still win on size/power/cost for one or two channels - they are complementary, not competitors.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://docs.amd.com/r/en-US/pg269-rf-data-converter/Introduction" target="_blank" rel="noopener">AMD/Xilinx PG269 — RF Data Converter Product Guide</a> — the definitive reference for the RFSoC RF-ADC/RF-DAC tiles: DDC/DUC, NCO mixers, clocking, and multi-tile synchronization.</li>
<li><a href="https://en.wikipedia.org/wiki/Digital_down_converter" target="_blank" rel="noopener">Wikipedia — Digital down converter</a> — the NCO-mix-and-decimate core that hardened RFSoC DDCs implement to tame GSPS data rates.</li>
<li><a href="https://arxiv.org/pdf/1911.09180" target="_blank" rel="noopener">arXiv — Digital Beamforming Array Receiver on Xilinx RFSoC</a> — a peer-reviewed system paper showing direct-conversion, wideband beamforming built directly on RFSoC.</li>
<li><a href="https://en.wikipedia.org/wiki/System_on_a_chip" target="_blank" rel="noopener">Wikipedia — System on a chip</a> — background on the SoC integration philosophy that turns the data converter into an on-die peripheral.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`RFSoC integrates GSPS RF-sampling ADCs/DACs, hardened DDC/DUC, FPGA logic, and Arm cores on one Zynq UltraScale+ die.`,
      String.raw`Direct RF sampling removes the analog mixer/LO, eliminating LO leakage, IQ-imbalance images, and mixer spurs.`,
      String.raw`All frequency translation is digital (NCO-based), so retuning is instantaneous and drift-free.`,
      String.raw`Hardened DDC/DUC blocks reduce the huge raw converter data to manageable IQ streams before entering the fabric.`,
      String.raw`RF sampling demands very low aperture jitter (SNR $=-20\log_{10}(2\pi f_{in}t_j)$) and high analog input bandwidth.`,
      String.raw`Mix-mode DACs use higher Nyquist zones to synthesize RF directly (see DAC topic).`,
      String.raw`Shared clocking + digital NCOs give deterministic, calibratable phase coherence across many channels.`,
      String.raw`On-die FPGA performs digital beamforming and channelization at line rate; Arm cores handle control/protocol.`,
      String.raw`Ideal for phased arrays, massive MIMO, radar, and EW where channel count and bandwidth dominate.`,
      String.raw`Complementary to AD9361-class parts: RFSoC scales channels/bandwidth; AD9361 wins on size/power/cost for a few channels.`,
      String.raw`Multi-tile synchronization (MTS) aligns converters across tiles for phase-coherent arrays.`,
      String.raw`Thermal management and clock distribution are dominant engineering challenges at GSPS.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr-rfsoc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="16" fill="#e6edf3" font-size="13">RFSoC block diagram (direct RF sampling)</text>
        <rect x="14" y="30" width="512" height="220" rx="6" fill="none" stroke="#4dabf7" stroke-dasharray="5 3"/>
        <text x="20" y="44" fill="#4dabf7" font-size="10">Zynq UltraScale+ RFSoC</text>
        <rect x="24" y="55" width="70" height="80" rx="4" fill="#1c232e" stroke="#63e6be"/><text x="30" y="72" fill="#e6edf3" font-size="9">RF-ADC</text><text x="30" y="86" fill="#9aa7b5" font-size="8">GSPS x N</text><text x="30" y="112" fill="#9aa7b5" font-size="8">+ DDC</text><text x="30" y="126" fill="#9aa7b5" font-size="8">(NCO)</text>
        <rect x="24" y="150" width="70" height="80" rx="4" fill="#1c232e" stroke="#ff6b6b"/><text x="30" y="167" fill="#e6edf3" font-size="9">RF-DAC</text><text x="30" y="181" fill="#9aa7b5" font-size="8">GSPS x N</text><text x="30" y="207" fill="#9aa7b5" font-size="8">+ DUC</text><text x="30" y="221" fill="#9aa7b5" font-size="8">mix-mode</text>
        <polygon points="8,80 22,72 22,88" fill="#4dabf7"/><polygon points="8,180 22,172 22,188" fill="#ff6b6b"/>
        <text x="2" y="105" fill="#9aa7b5" font-size="8">RF in</text><text x="2" y="205" fill="#9aa7b5" font-size="8">RF out</text>
        <rect x="130" y="70" width="150" height="140" rx="4" fill="#1c232e" stroke="#b197fc"/><text x="150" y="120" fill="#e6edf3" font-size="11">FPGA fabric</text><text x="140" y="140" fill="#9aa7b5" font-size="9">beamforming, DSP</text><text x="150" y="158" fill="#9aa7b5" font-size="9">channelization</text>
        <rect x="315" y="70" width="130" height="60" rx="4" fill="#1c232e" stroke="#ffa94d"/><text x="325" y="95" fill="#e6edf3" font-size="10">Arm cores</text><text x="325" y="112" fill="#9aa7b5" font-size="8">control/protocol</text>
        <rect x="315" y="150" width="130" height="60" rx="4" fill="#1c232e" stroke="#63e6be"/><text x="325" y="175" fill="#e6edf3" font-size="10">GT / net / mem</text><text x="325" y="192" fill="#9aa7b5" font-size="8">high-speed IO</text>
        <line x1="94" y1="95" x2="130" y2="110" stroke="#9aa7b5" marker-end="url(#arr-rfsoc)"/>
        <line x1="130" y1="170" x2="94" y2="190" stroke="#9aa7b5" marker-end="url(#arr-rfsoc)"/>
        <line x1="280" y1="110" x2="315" y2="100" stroke="#9aa7b5" marker-end="url(#arr-rfsoc)"/>
        <line x1="280" y1="170" x2="315" y2="180" stroke="#9aa7b5" marker-end="url(#arr-rfsoc)"/>
        <rect x="460" y="110" width="60" height="60" rx="4" fill="#1c232e" stroke="#4dabf7"/><text x="466" y="135" fill="#e6edf3" font-size="9">clock</text><text x="466" y="150" fill="#9aa7b5" font-size="8">low jitter</text>
        </svg>`,
        caption: 'RFSoC: many GSPS RF-sampling ADCs/DACs with hardened DDC/DUC feed on-die FPGA fabric for beamforming/DSP and Arm cores for control; a shared low-jitter clock gives phase coherence.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <text x="12" y="18" fill="#e6edf3" font-size="13">Phased array: one RFSoC drives many coherent elements</text>
        <line x1="60" y1="40" x2="60" y2="150" stroke="#4dabf7"/>
        <polygon points="52,40 68,40 60,28" fill="#4dabf7"/>
        <polygon points="52,70 68,70 60,58" fill="#4dabf7"/>
        <polygon points="52,100 68,100 60,88" fill="#4dabf7"/>
        <polygon points="52,130 68,130 60,118" fill="#4dabf7"/>
        <text x="20" y="90" fill="#9aa7b5" font-size="9">array</text>
        <rect x="140" y="55" width="90" height="80" rx="4" fill="#1c232e" stroke="#63e6be"/><text x="150" y="90" fill="#e6edf3" font-size="9">RF-ADC/DAC</text><text x="150" y="107" fill="#9aa7b5" font-size="8">per element</text>
        <rect x="270" y="55" width="110" height="80" rx="4" fill="#1c232e" stroke="#b197fc"/><text x="280" y="90" fill="#e6edf3" font-size="9">digital</text><text x="280" y="107" fill="#9aa7b5" font-size="8">beamform (FPGA)</text>
        <rect x="420" y="70" width="90" height="50" rx="4" fill="#1c232e" stroke="#ffa94d"/><text x="428" y="98" fill="#e6edf3" font-size="9">beam out</text>
        <line x1="68" y1="85" x2="140" y2="90" stroke="#9aa7b5"/>
        <line x1="230" y1="95" x2="270" y2="95" stroke="#9aa7b5"/>
        <line x1="380" y1="95" x2="420" y2="95" stroke="#9aa7b5"/>
        <text x="140" y="165" fill="#9aa7b5" font-size="9">Shared clock + digital NCOs keep all channels phase-coherent for steering.</text>
        </svg>`,
        caption: 'Digital beamforming: per-element RF-sampling converters feed on-die FPGA beamforming; phase coherence comes from shared clocking and digital NCOs.'
      },
      {
        title: String.raw`Multi-tile RX/TX datapath (converter to PL and back)`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
        <defs><marker id="arr3-rfsoc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="12" y="16" fill="#e6edf3" font-size="13">RFSoC tile datapath</text>
        <polygon points="12,54 28,45 28,63" fill="#4dabf7"/><text x="6" y="80" fill="#9aa7b5" font-size="7">RF in</text>
        <rect x="34" y="40" width="58" height="30" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="40" y="55" fill="#e6edf3" font-size="8">RF-ADC</text><text x="40" y="66" fill="#9aa7b5" font-size="7">GSPS tile</text>
        <rect x="104" y="40" width="70" height="30" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="110" y="55" fill="#e6edf3" font-size="8">DDC</text><text x="110" y="66" fill="#9aa7b5" font-size="7">NCO+decim M</text>
        <rect x="188" y="40" width="66" height="30" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="194" y="55" fill="#e6edf3" font-size="8">AXI-Stream</text><text x="194" y="66" fill="#9aa7b5" font-size="7">IQ to PL</text>
        <rect x="270" y="40" width="70" height="30" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="276" y="55" fill="#e6edf3" font-size="8">PL DSP</text><text x="276" y="66" fill="#9aa7b5" font-size="7">beamform/filt</text>
        <line x1="92" y1="55" x2="104" y2="55" stroke="#9aa7b5" marker-end="url(#arr3-rfsoc)"/>
        <line x1="174" y1="55" x2="188" y2="55" stroke="#9aa7b5" marker-end="url(#arr3-rfsoc)"/>
        <line x1="254" y1="55" x2="270" y2="55" stroke="#9aa7b5" marker-end="url(#arr3-rfsoc)"/>
        <rect x="270" y="130" width="70" height="30" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="276" y="145" fill="#e6edf3" font-size="8">PL DSP</text><text x="276" y="156" fill="#9aa7b5" font-size="7">waveform gen</text>
        <rect x="188" y="130" width="66" height="30" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="194" y="145" fill="#e6edf3" font-size="8">AXI-Stream</text><text x="194" y="156" fill="#9aa7b5" font-size="7">IQ to tile</text>
        <rect x="104" y="130" width="70" height="30" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="110" y="145" fill="#e6edf3" font-size="8">DUC</text><text x="110" y="156" fill="#9aa7b5" font-size="7">interp+NCO</text>
        <rect x="34" y="130" width="58" height="30" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="40" y="145" fill="#e6edf3" font-size="8">RF-DAC</text><text x="40" y="156" fill="#9aa7b5" font-size="7">mix-mode</text>
        <polygon points="12,136 28,145 28,127" fill="#ff6b6b" transform="translate(-6,0)"/><text x="6" y="170" fill="#9aa7b5" font-size="7">RF out</text>
        <line x1="270" y1="145" x2="254" y2="145" stroke="#9aa7b5" marker-end="url(#arr3-rfsoc)"/>
        <line x1="188" y1="145" x2="174" y2="145" stroke="#9aa7b5" marker-end="url(#arr3-rfsoc)"/>
        <line x1="104" y1="145" x2="92" y2="145" stroke="#9aa7b5" marker-end="url(#arr3-rfsoc)"/>
        <line x1="34" y1="145" x2="20" y2="145" stroke="#9aa7b5" marker-end="url(#arr3-rfsoc)"/>
        <text x="360" y="55" fill="#63e6be" font-size="9">RX: ADC tile -></text>
        <text x="360" y="70" fill="#9aa7b5" font-size="8">DDC decimates,</text>
        <text x="360" y="83" fill="#9aa7b5" font-size="8">AXI-Stream carries IQ</text>
        <text x="360" y="96" fill="#9aa7b5" font-size="8">into PL fabric.</text>
        <text x="360" y="140" fill="#ffa94d" font-size="9">TX: mirror path</text>
        <text x="360" y="155" fill="#9aa7b5" font-size="8">DUC interpolates +</text>
        <text x="360" y="168" fill="#9aa7b5" font-size="8">NCO up to RF-DAC.</text>
        </svg>`,
        caption: 'Per-tile datapath: RF-ADC to hardened DDC (NCO mix + decimate) to AXI-Stream into the PL for DSP/beamforming; the transmit mirror runs PL DSP to AXI-Stream to DUC (interpolate + NCO) to the mix-mode RF-DAC.'
      }
    ],
    equations: [
      {
        title: 'Raw converter data rate',
        tex: String.raw`$$R_{raw}=f_s\times N_{bits}\times N_{ch}$$`,
        derivation: String.raw`<p>For a single 4 GSPS 14-bit ADC: $R=4\times10^9\times14=56$ Gb/s. With, say, 8 channels the aggregate is $448$ Gb/s - far beyond fabric routing, which is precisely why hardened DDC blocks decimate at the converter before data reaches the FPGA.</p>`
      },
      {
        title: 'Jitter-limited SNR at RF',
        tex: String.raw`$$\text{SNR}_{jitter}=-20\log_{10}(2\pi f_{in}t_j)$$`,
        derivation: String.raw`<p>Same relation as the ADC topic, but now $f_{in}$ can be several GHz. For direct RF sampling at $f_{in}=3$ GHz with $t_j=100$ fs: $2\pi\times3e9\times100e-15=1.885\times10^{-3}$, SNR $=-20\log_{10}(1.885e-3)=54.5$ dB. This shows why RFSoC clocking must be sub-100-fs jitter.</p>`
      },
      {
        title: 'Nyquist zone for direct RF',
        tex: String.raw`$$\text{zone}=\left\lceil \frac{f_{RF}}{f_s/2}\right\rceil,\qquad f_{base}=|f_{RF}-k f_s|$$`,
        derivation: String.raw`<p>To sample/synthesize at $f_{RF}$ with sample rate $f_s$, the signal lives in Nyquist zone $\lceil f_{RF}/(f_s/2)\rceil$. The equivalent baseband image processed digitally is $f_{base}=|f_{RF}-kf_s|$ for the nearest multiple $k$. Mix-mode DACs boost the desired higher-zone image for direct RF output.</p>`
      },
      {
        title: 'DDC decimation and delivered rate',
        tex: String.raw`$$f_{s,out}=\frac{f_{s,ADC}}{M},\qquad R_{fabric}=f_{s,out}\times N_{bits}\times 2_{(I,Q)}$$`,
        derivation: String.raw`<p>The hardened DDC decimates by $M$ (after NCO mixing to baseband). For $f_{s,ADC}=4$ GSPS, $M=64$: $f_{s,out}=62.5$ MS/s. At 16-bit complex the fabric rate per channel is $62.5e6\times16\times2=2$ Gb/s - routable and processable in the FPGA, versus 56 Gb/s raw.</p>`
      },
      {
        title: 'Array beamforming gain',
        tex: String.raw`$$G_{array}=10\log_{10}(N)\ \text{dB (coherent combining of }N\text{ elements)}$$`,
        derivation: String.raw`<p>Summing $N$ phase-aligned element signals adds voltages coherently ($\times N$) while uncorrelated noise adds in power ($\times N$), giving SNR improvement of $N$, i.e. $10\log_{10}N$ dB. The RFSoC's phase-coherent channels and on-die digital beamformer realize this gain across the array.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does an RFSoC integrate on one die?`, back: String.raw`GSPS RF-sampling ADCs/DACs, hardened DDC/DUC, FPGA programmable logic, and multicore Arm processors (Zynq UltraScale+).` },
      { front: String.raw`What key analog block does direct RF sampling remove?`, back: String.raw`The analog quadrature mixer and its LO - all frequency translation becomes digital.` },
      { front: String.raw`Which zero-IF impairments does RF sampling avoid?`, back: String.raw`LO leakage, IQ-imbalance images, and mixer spurs.` },
      { front: String.raw`Why does the RFSoC need hardened DDC/DUC blocks?`, back: String.raw`Raw GSPS converter data is too fast for the fabric; DDC/DUC decimate/interpolate at the converter to yield manageable IQ streams.` },
      { front: String.raw`What limits high-frequency SNR in RF sampling?`, back: String.raw`Aperture (clock) jitter: SNR $=-20\log_{10}(2\pi f_{in}t_j)$, worse as $f_{in}$ rises.` },
      { front: String.raw`How do RF-sampling DACs synthesize GHz RF?`, back: String.raw`By using a higher Nyquist zone image, boosted by mix-mode/RZ operation.` },
      { front: String.raw`How does the RFSoC achieve phase coherence across channels?`, back: String.raw`Shared low-jitter clock plus digital NCOs (and multi-tile synchronization) give deterministic, calibratable phase.` },
      { front: String.raw`Where is digital beamforming done in an RFSoC?`, back: String.raw`In the on-die FPGA fabric, at line rate, without leaving the chip.` },
      { front: String.raw`Main applications of RFSoC?`, back: String.raw`5G massive MIMO, phased-array radar, electronic warfare/SIGINT, and wideband multichannel instruments.` },
      { front: String.raw`RFSoC vs AD9361 - key difference?`, back: String.raw`RFSoC does direct RF sampling with many GSPS channels + on-die DSP; AD9361 is a 2x2 zero-IF baseband transceiver with an external FPGA.` },
      { front: String.raw`What is multi-tile synchronization (MTS)?`, back: String.raw`A mechanism to align converters across tiles so all channels share a deterministic phase for coherent arrays.` },
      { front: String.raw`Array beamforming SNR gain for N elements?`, back: String.raw`$10\log_{10}N$ dB from coherent combining.` },
      { front: String.raw`Why is retuning instantaneous in an RFSoC?`, back: String.raw`Frequency is set by an NCO word; changing it retunes immediately with no analog PLL relock.` },
      { front: String.raw`Dominant engineering challenges at GSPS?`, back: String.raw`Clock distribution/jitter, thermal management, and aggregate data movement.` },
      { front: String.raw`Roughly how fast are modern RFSoC converters?`, back: String.raw`ADCs up to several GSPS (~5 GSPS in Gen 3) and DACs up to ~10 GSPS.` }
    ],
    mcqs: [
      { q: String.raw`An RFSoC is built on which platform?`, options: [String.raw`Zynq UltraScale+`, String.raw`a standalone ASIC`, String.raw`an 8-bit MCU`, String.raw`a DSP-only chip`], answer: 0, explain: String.raw`It is the RF-integrated Zynq UltraScale+ family.` },
      { q: String.raw`Direct RF sampling primarily removes:`, options: [String.raw`the ADC`, String.raw`the analog mixer and LO`, String.raw`the antenna`, String.raw`the FPGA`], answer: 1, explain: String.raw`Sampling RF directly eliminates the analog quadrature mixer/LO.` },
      { q: String.raw`Which impairment is NOT present in direct RF sampling (vs zero-IF)?`, options: [String.raw`aperture jitter`, String.raw`IQ-imbalance image`, String.raw`quantization noise`, String.raw`thermal noise`], answer: 1, explain: String.raw`No analog quadrature mixer means no IQ-imbalance image.` },
      { q: String.raw`Hardened DDC/DUC blocks exist mainly to:`, options: [String.raw`generate the LO`, String.raw`reduce the raw converter data rate before the fabric`, String.raw`amplify RF`, String.raw`replace the Arm cores`], answer: 1, explain: String.raw`They decimate/interpolate at the converter so the fabric sees manageable IQ.` },
      { q: String.raw`RF sampling at high frequency is most sensitive to:`, options: [String.raw`DC offset`, String.raw`aperture (clock) jitter`, String.raw`interpolation`, String.raw`SPI speed`], answer: 1, explain: String.raw`Jitter SNR $=-20\log_{10}(2\pi f_{in}t_j)$ worsens with input frequency.` },
      { q: String.raw`RF-sampling DACs reach GHz output using:`, options: [String.raw`analog upconversion`, String.raw`higher-Nyquist-zone images (mix-mode)`, String.raw`a superheterodyne stage`, String.raw`inverse-sinc only`], answer: 1, explain: String.raw`They select a higher-zone image, boosted by mix-mode/RZ.` },
      { q: String.raw`Phase coherence across RFSoC channels comes from:`, options: [String.raw`separate PLLs per channel`, String.raw`shared clock + digital NCOs + MTS`, String.raw`analog phase shifters only`, String.raw`software timestamps`], answer: 1, explain: String.raw`Shared clocking and digital NCOs (with multi-tile sync) give deterministic phase.` },
      { q: String.raw`Digital beamforming in an RFSoC runs in:`, options: [String.raw`the Arm cores`, String.raw`the on-die FPGA fabric`, String.raw`an external DSP`, String.raw`the ADC`], answer: 1, explain: String.raw`The FPGA sums/steers beams at line rate.` },
      { q: String.raw`RFSoC is best suited to:`, options: [String.raw`a single narrowband receiver`, String.raw`many-channel phased arrays and massive MIMO`, String.raw`audio playback`, String.raw`low-power IoT sensors`], answer: 1, explain: String.raw`Channel count and bandwidth are its strengths.` },
      { q: String.raw`Compared to an AD9361, the RFSoC:`, options: [String.raw`has fewer channels`, String.raw`samples at baseband only`, String.raw`samples RF directly at GSPS with on-die DSP`, String.raw`lacks an FPGA`], answer: 2, explain: String.raw`Direct RF, GSPS, many channels, and integrated FPGA+Arm.` },
      { q: String.raw`Coherent combining of 16 array elements gives about:`, options: [String.raw`6 dB`, String.raw`12 dB`, String.raw`16 dB`, String.raw`24 dB`], answer: 1, explain: String.raw`$10\log_{10}16=12$ dB.` },
      { q: String.raw`A dominant physical challenge in RFSoC design is:`, options: [String.raw`SPI configuration`, String.raw`clock distribution/jitter and thermal management`, String.raw`choosing the antenna color`, String.raw`baseband DC coupling`], answer: 1, explain: String.raw`GSPS converters demand low-jitter clocks and careful thermal design.` }
    ],
    numericals: [
      { q: String.raw`A single RFSoC ADC runs at 4.096 GSPS, 12-bit. Find the raw data rate and the delivered rate after a DDC decimation of 128 (complex).`, solution: String.raw`<p><b>Formula.</b> $$R_{raw}=f_{s,ADC}\times N_{bits};\qquad f_{out}=\frac{f_{s,ADC}}{M},\quad R_{fabric}=f_{out}\times N_{bits}\times 2_{(I,Q)}$$ where $M$ is the DDC decimation, and the factor 2 accounts for the complex (I,Q) output.</p>
      <p><b>Substitute.</b> $f_{s,ADC}=4.096\times10^{9}$, $N_{bits}=12$, $M=128$: $R_{raw}=4.096\times10^{9}\times12$; $f_{out}=4.096\times10^{9}/128$; $R_{fabric}=f_{out}\times12\times2$.</p>
      <p><b>Compute.</b> $R_{raw}=49.15\times10^{9}=49.2$ Gb/s. $f_{out}=32$ MS/s; $R_{fabric}=32\times10^{6}\times24=768$ Mb/s per channel.</p>
      <p><b>Explanation.</b> The hardened DDC cuts 49.2 Gb/s down to 0.77 Gb/s (~64x, since $128/2$ for the complex output), turning an unroutable raw stream into something the fabric can carry and process. Note the raw rate counts real samples while the output is complex, so the ratio is $M/2$, not $M$.</p>` },
      { q: String.raw`What clock jitter is needed for 60 dB SNR when directly sampling a 2.4 GHz signal?`, solution: String.raw`<p><b>Formula.</b> $$\text{SNR}=-20\log_{10}(2\pi f_{in}t_j)\;\Rightarrow\; t_j=\frac{10^{-\text{SNR}/20}}{2\pi f_{in}}$$ where $t_j$ is the rms aperture jitter, $f_{in}$ the RF input frequency, and SNR the jitter-limited SNR in dB.</p>
      <p><b>Substitute.</b> $\text{SNR}=60$ dB, $f_{in}=2.4\times10^{9}$ Hz: $2\pi f_{in}t_j=10^{-60/20}=10^{-3}$, so $$t_j=\frac{10^{-3}}{2\pi\times2.4\times10^{9}}.$$</p>
      <p><b>Compute.</b> $2\pi\times2.4\times10^{9}=1.508\times10^{10}$. $t_j=10^{-3}/1.508\times10^{10}=6.63\times10^{-14}$ s $=66$ fs rms.</p>
      <p><b>Explanation.</b> Even a modest 60 dB SNR at 2.4 GHz demands sub-100-fs clock jitter - orders of magnitude tighter than baseband ADCs need. This is the central clocking challenge of direct-RF sampling and drives the RFSoC's low-jitter clock-distribution design.</p>` },
      { q: String.raw`An RFSoC DAC at $f_s=6$ GSPS must output 4.5 GHz. Which Nyquist zone, and what digital baseband frequency generates it?`, solution: String.raw`<p><b>Formula.</b> $$\text{zone}=\left\lceil\frac{f_{RF}}{f_s/2}\right\rceil,\qquad f_{base}=|f_{RF}-k f_s|$$ where $f_{RF}$ is the target output, $f_s$ the DAC rate, $k$ the nearest multiple, and $f_{base}$ the digitally generated tone.</p>
      <p><b>Substitute.</b> $f_{RF}=4.5$ GHz, $f_s=6$ GHz: $\text{zone}=\lceil 4.5/3\rceil$; $f_{base}=|4.5-1\times6|$.</p>
      <p><b>Compute.</b> Zones 1 (0-3 GHz) and 2 (3-6 GHz); $\lceil 4.5/3\rceil=2$, so zone 2. $f_{base}=|4.5-6|=1.5$ GHz.</p>
      <p><b>Explanation.</b> The DAC generates the waveform digitally at 1.5 GHz; its zone-2 image at 4.5 GHz is boosted by mix-mode (RZ) operation and isolated by a bandpass reconstruction filter. Direct-RF synthesis at 4.5 GHz with no analog mixer - the hallmark of the RFSoC transmit path.</p>` },
      { q: String.raw`A 64-element digital array uses one RFSoC subsystem. What beamforming SNR gain over a single element is achievable (ideal coherent combining)?`, solution: String.raw`<p><b>Formula.</b> $$G_{array}=10\log_{10}(N)\ \text{dB}$$ where $N$ is the number of phase-coherent elements; coherent voltage summing ($\times N$) over incoherent noise power ($\times N$) yields an SNR improvement of $N$.</p>
      <p><b>Substitute.</b> $N=64$: $$G_{array}=10\log_{10}64.$$</p>
      <p><b>Compute.</b> $\log_{10}64=1.806$, so $G_{array}=18.1$ dB.</p>
      <p><b>Explanation.</b> Digitally combining 64 coherent channels buys ~18 dB of array gain - but only if phase coherence is real: shared clock, calibrated NCOs, and multi-tile synchronization. Any residual phase error between elements erodes the coherent sum and this ideal gain.</p>` },
      { q: String.raw`Eight RFSoC ADC channels each at 2.5 GSPS 14-bit feed hardened DDCs decimating by 40. Compare raw vs post-DDC aggregate rates.`, solution: String.raw`<p><b>Formula.</b> $$R_{raw}=N_{ch}\,f_{s}\,N_{bits};\quad f_{out}=\frac{f_s}{M},\quad R_{post}=N_{ch}\,f_{out}\,N_{bits}\times 2_{(I,Q)}$$ with $N_{ch}$ channels, ADC rate $f_s$, resolution $N_{bits}$, decimation $M$, and complex (I,Q) output.</p>
      <p><b>Substitute.</b> $N_{ch}=8$, $f_s=2.5\times10^{9}$, $N_{bits}=14$, $M=40$: raw per ch $=2.5\times10^{9}\times14$; $f_{out}=2.5\times10^{9}/40$; post per ch $=f_{out}\times14\times2$.</p>
      <p><b>Compute.</b> Raw per ch $=35$ Gb/s; $\times8=280$ Gb/s (impractical in fabric). $f_{out}=62.5$ MS/s; post per ch $=62.5\times10^{6}\times28=1.75$ Gb/s; $\times8=14$ Gb/s - routable/processable.</p>
      <p><b>Explanation.</b> Hardened DDCs shrink the aggregate from an impossible 280 Gb/s to a manageable 14 Gb/s (a 20x cut, = $M/2$ for complex output). This converter-adjacent decimation is exactly why one RFSoC can host eight-plus wideband channels that could never be routed at raw rate.</p>` },
      { q: String.raw`If an RFSoC ADC has SNR of 55 dB (jitter-limited) at 3 GHz and 62 dB quantization-limited, find the combined SNR.`, solution: String.raw`<p><b>Formula.</b> $$\text{SNR}_{tot}=-10\log_{10}\!\left(10^{-\text{SNR}_j/10}+10^{-\text{SNR}_q/10}\right)$$ noise powers add, where $\text{SNR}_j$ is the jitter-limited and $\text{SNR}_q$ the quantization-limited SNR in dB.</p>
      <p><b>Substitute.</b> $\text{SNR}_j=55$ dB, $\text{SNR}_q=62$ dB: noise fractions $10^{-55/10}$ and $10^{-62/10}$.</p>
      <p><b>Compute.</b> $10^{-5.5}=3.16\times10^{-6}$; $10^{-6.2}=6.31\times10^{-7}$; sum $=3.79\times10^{-6}$. $\text{SNR}_{tot}=-10\log_{10}(3.79\times10^{-6})=54.2$ dB.</p>
      <p><b>Explanation.</b> The combined 54.2 dB is dominated by jitter (the weaker 55 dB term), pulling only ~0.8 dB below it while the 62 dB quantization term barely contributes. At multi-GHz RF, jitter is almost always the limiting noise - improving the clock, not the ADC bits, is what raises SNR.</p>` }
    ],
    realWorld: String.raw`<p>RFSoC (Xilinx/AMD Zynq UltraScale+ RFSoC, spanning Gen 1 through Gen 3) is the workhorse of modern digital-beamforming systems. 5G massive-MIMO radios use it to run dozens of coherent transmit/receive chains with on-die beamforming, collapsing what once needed racks of hardware. Defense radar and electronic-warfare systems exploit its direct-RF capture and instantaneous NCO retuning across wide bands. Research platforms such as the ZCU111/ZCU216 evaluation boards and the open PYNQ framework (Python + overlays) have made RFSoC accessible for teaching direct-RF SDR. The design tradeoffs - sub-100-fs clock jitter, aggressive thermal design, and moving multi-hundred-Gb/s aggregate data - define a new class of RF engineering where converter, DSP, and processor co-design on a single die.</p>`,
    related: ['sdr', 'adc', 'dac', 'ad9361', 'antenna-gain']
  }
);
