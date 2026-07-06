// Extra-E: Bandwidth, Early-Late Gate & Prompt Correlator, Polarization
CONTENT.topics.push(
  {
    id: 'bandwidth',
    title: 'Bandwidth',
    category: 'Fundamentals',
    tags: ['bandwidth', 'nyquist', 'occupied-bandwidth', 'noise-bandwidth', 'half-power', 'fractional-bandwidth', 'data-rate'],
    summary: String.raw`Bandwidth is the width of the frequency band a signal occupies (or a system passes), but the exact number depends on which of several precise definitions — null-to-null, −3 dB, occupied, noise-equivalent, or Nyquist — you apply.`,
    diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr-bandwidth" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <line x1="40" y1="170" x2="510" y2="170" stroke="#9aa7b5"/>
  <line x1="270" y1="170" x2="270" y2="35" stroke="#9aa7b5" stroke-dasharray="3 3"/>
  <text x="500" y="188" fill="#9aa7b5">f</text>
  <path d="M40,170 Q120,168 200,120 Q245,70 270,45 Q295,70 340,120 Q420,168 500,170" fill="none" stroke="#4dabf7" stroke-width="2"/>
  <path d="M200,120 Q245,70 270,45 Q295,70 340,120 Z" fill="#4dabf7" fill-opacity="0.12" stroke="none"/>
  <line x1="223" y1="90" x2="317" y2="90" stroke="#63e6be" marker-end="url(#arr-bandwidth)"/>
  <line x1="317" y1="90" x2="223" y2="90" stroke="#63e6be" marker-end="url(#arr-bandwidth)"/>
  <text x="270" y="83" fill="#63e6be" text-anchor="middle">−3 dB</text>
  <line x1="200" y1="140" x2="340" y2="140" stroke="#ffa94d" marker-end="url(#arr-bandwidth)"/>
  <line x1="340" y1="140" x2="200" y2="140" stroke="#ffa94d" marker-end="url(#arr-bandwidth)"/>
  <text x="270" y="133" fill="#ffa94d" text-anchor="middle">null-to-null</text>
  <line x1="150" y1="162" x2="390" y2="162" stroke="#b197fc" marker-end="url(#arr-bandwidth)"/>
  <line x1="390" y1="162" x2="150" y2="162" stroke="#b197fc" marker-end="url(#arr-bandwidth)"/>
  <text x="270" y="156" fill="#b197fc" text-anchor="middle">99% occupied</text>
  <text x="270" y="210" fill="#9aa7b5" text-anchor="middle">one spectrum, several labelled widths — always name the definition</text>
</svg>`,
      caption: String.raw`Bandwidth mechanism: a single PSD carries several distinct labelled widths — −3 dB, null-to-null, and 99% occupied — that differ by 2× or more.`
    },
    {
      title: String.raw`Modulation-to-bandwidth map`,
      svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr2-bandwidth" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <rect x="20" y="30" width="150" height="55" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="95" y="52" fill="#e6edf3" text-anchor="middle">Symbol rate R_s,</text>
  <text x="95" y="70" fill="#9aa7b5" text-anchor="middle">roll-off β / dev Δf</text>
  <rect x="220" y="20" width="140" height="34" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="290" y="42" fill="#e6edf3" text-anchor="middle">BPSK: (1+β)R_s</text>
  <rect x="220" y="66" width="140" height="34" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="290" y="88" fill="#e6edf3" text-anchor="middle">QPSK: (1+β)R_s</text>
  <rect x="220" y="112" width="140" height="34" rx="6" fill="#1c232e" stroke="#b197fc"/>
  <text x="290" y="134" fill="#e6edf3" text-anchor="middle">FM: 2(Δf+f_m)</text>
  <rect x="410" y="66" width="110" height="55" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="465" y="88" fill="#e6edf3" text-anchor="middle">Occupied</text>
  <text x="465" y="106" fill="#9aa7b5" text-anchor="middle">RF BW</text>
  <line x1="170" y1="57" x2="218" y2="37" stroke="#9aa7b5" marker-end="url(#arr2-bandwidth)"/>
  <line x1="170" y1="60" x2="218" y2="83" stroke="#9aa7b5" marker-end="url(#arr2-bandwidth)"/>
  <line x1="170" y1="65" x2="218" y2="129" stroke="#9aa7b5" marker-end="url(#arr2-bandwidth)"/>
  <line x1="360" y1="37" x2="408" y2="80" stroke="#9aa7b5" marker-end="url(#arr2-bandwidth)"/>
  <line x1="360" y1="83" x2="408" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-bandwidth)"/>
  <line x1="360" y1="129" x2="408" y2="105" stroke="#9aa7b5" marker-end="url(#arr2-bandwidth)"/>
  <text x="270" y="185" fill="#b197fc" text-anchor="middle">bits/symbol set data rate; R_s, β (or Δf) set the occupied width</text>
  <text x="270" y="210" fill="#9aa7b5" text-anchor="middle">BPSK & QPSK share BW; QPSK carries 2× the bits</text>
</svg>`,
      caption: String.raw`Modulation-to-bandwidth map: the symbol rate and roll-off (or FM deviation) fix the occupied RF bandwidth. BPSK and QPSK occupy the same (1+β)R_s, but QPSK packs twice the bits; FM follows Carson's rule 2(Δf+f_m).`
    },
    {
      title: String.raw`Regulatory spectral mask`,
      svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr3-bandwidth" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <line x1="40" y1="175" x2="510" y2="175" stroke="#9aa7b5" marker-end="url(#arr3-bandwidth)"/>
  <text x="505" y="192" fill="#9aa7b5">f</text>
  <line x1="60" y1="175" x2="60" y2="30" stroke="#9aa7b5"/>
  <text x="42" y="40" fill="#9aa7b5">PSD</text>
  <path d="M150,175 L150,60 L390,60 L390,175" fill="none" stroke="#ffa94d" stroke-width="2" stroke-dasharray="6 4"/>
  <path d="M60,175 L120,170 L170,90 Q270,55 370,90 L420,170 L480,175 L480,175" fill="#4dabf7" fill-opacity="0.15" stroke="#4dabf7" stroke-width="2"/>
  <text x="270" y="48" fill="#ffa94d" text-anchor="middle">mask (limit)</text>
  <text x="270" y="120" fill="#4dabf7" text-anchor="middle">emitted PSD</text>
  <line x1="150" y1="150" x2="390" y2="150" stroke="#b197fc" marker-end="url(#arr3-bandwidth)"/>
  <line x1="390" y1="150" x2="150" y2="150" stroke="#b197fc" marker-end="url(#arr3-bandwidth)"/>
  <text x="270" y="143" fill="#b197fc" text-anchor="middle">99% occupied BW</text>
  <text x="270" y="210" fill="#9aa7b5" text-anchor="middle">signal must stay under the mask; OBW is the compliance number</text>
</svg>`,
      caption: String.raw`Regulatory mask: the emitted PSD must sit entirely beneath a legally defined spectral mask. The 99% occupied bandwidth — not null-to-null — is the number measured for type approval.`
    }
    ],
    prerequisites: ['comm-basics', 'frequency-spectrum', 'sinc-function', 'psd'],
    intro: String.raw`<p><strong>Bandwidth</strong> is one of the most used and most abused words in communications. Loosely it means "how much frequency space a signal takes up," but that single phrase hides at least half a dozen different, precisely defined quantities that can differ by factors of two or more for the very same waveform. A pulse whose null-to-null bandwidth is 2 MHz might have a −3 dB bandwidth of 900 kHz, a 99% occupied bandwidth of 1.8 MHz, and a noise-equivalent bandwidth of 1 MHz. Getting exam questions and real link budgets right depends entirely on knowing <em>which</em> definition is in play.</p>
<p>Bandwidth matters because it is the currency of both <strong>capacity</strong> and <strong>cost</strong>. Shannon tells us capacity grows with bandwidth; Nyquist tells us the symbol rate we can push through a band; regulators sell it by the megahertz; and every extra hertz a receiver accepts lets in more noise power ($N_0 B$). This topic assembles all the standard definitions, shows how each is measured, works an example for each, and nails the two relationships every engineer must have reflexively: the Nyquist link between bandwidth and symbol rate, and the factor-of-two between baseband and RF (passband) bandwidth.</p>`,
    sections: [
      {
        h: 'Why "bandwidth" needs several definitions',
        html: String.raw`<p>A real signal's power is spread across frequency according to its <strong>power spectral density (PSD)</strong>. The trouble is that most practical spectra do not stop abruptly — a rectangular time pulse has a $\operatorname{sinc}^2$ spectrum with infinitely many decaying sidelobes, so strictly its bandwidth is infinite. Every usable definition is therefore a <em>convention</em> for drawing a boundary around "most" of the energy.</p>
<ul>
<li><strong>Null-to-null:</strong> width of the main spectral lobe, between the first spectral zeros. Simple, generous, ignores that sidelobes carry real power.</li>
<li><strong>−3 dB (half-power):</strong> the band over which the PSD stays within 3 dB (a factor of 2 in power) of its peak. The natural definition for filters and resonators.</li>
<li><strong>Occupied (x%):</strong> the band that contains a stated fraction (commonly 99%) of the total power. The regulator's definition.</li>
<li><strong>Noise-equivalent (NEB):</strong> the width of an ideal brick-wall filter passing the same noise power as the real response. The definition that matters for SNR.</li>
<li><strong>Nyquist / minimum:</strong> the smallest bandwidth that can carry a given symbol rate without intersymbol interference — the information-theoretic floor.</li>
</ul>
<div class="callout"><strong>Rule of thumb:</strong> if a problem says "bandwidth" without qualification, default to the one implied by context — filters and channels usually mean −3 dB; spectrum-mask/regulatory questions mean occupied; noise/SNR calculations mean noise-equivalent; and "what data rate fits?" means Nyquist.</div>`
      },
      {
        h: 'Null-to-null and −3 dB (half-power) bandwidth',
        html: String.raw`<p>For a rectangular NRZ pulse of duration $T$ (symbol rate $R_s=1/T$), the baseband voltage spectrum is $\operatorname{sinc}(fT)$ and the PSD is $\operatorname{sinc}^2(fT)$. The first nulls sit at $f=\pm 1/T=\pm R_s$, so the baseband <strong>null-to-null bandwidth is $2R_s$</strong> (one $R_s$ each side) — or, counting only the positive-frequency main lobe, $R_s$. The main lobe holds about 90% of the power; the remaining 10% leaks into the sidelobes, which is exactly why real systems pulse-shape (RRC) to tame them.</p>
<p>The <strong>−3 dB bandwidth</strong> is where the PSD falls to half its peak. For $\operatorname{sinc}^2(fT)$ the half-power point occurs at $fT\approx 0.443$, giving a one-sided value $B_{3\mathrm{dB}}\approx 0.443\,R_s$ and a two-sided value $\approx 0.886\,R_s$ — noticeably narrower than null-to-null. For a first-order RC low-pass filter the −3 dB point is simply $f_c=1/(2\pi RC)$; for an $n$-th order Butterworth it is the corner frequency $f_c$ regardless of order.</p>
<table class="data">
<tr><th>Definition (rect NRZ, rate $R_s$)</th><th>One-sided</th><th>Two-sided (baseband)</th></tr>
<tr><td>Null-to-null (main lobe)</td><td>$R_s$</td><td>$2R_s$</td></tr>
<tr><td>−3 dB half-power</td><td>$0.443R_s$</td><td>$0.886R_s$</td></tr>
<tr><td>99% occupied</td><td>$\approx 10R_s$ (slow sinc tails)</td><td>$\approx 20R_s$</td></tr>
</table>
<p>The dramatic 99% figure for a raw rectangular pulse (its tails decay only as $1/f^2$) is the headline argument for pulse shaping: an RRC-filtered symbol confines nearly all power inside $\approx (1+\alpha)R_s$.</p>`
      },
      {
        h: 'Occupied bandwidth and noise-equivalent bandwidth',
        html: String.raw`<p><strong>Occupied bandwidth (OBW)</strong> is defined by the regulator: the frequency band, centred on the carrier, outside which the emitted power is less than a specified percentage — usually $\beta=0.5\%$ on each edge, so that 99% of the total power lies inside. Formally $B_{occ}$ satisfies</p>
<p>$$\int_{f_c-B_{occ}/2}^{f_c+B_{occ}/2} S(f)\,df = 0.99\int_{-\infty}^{\infty} S(f)\,df.$$</p>
<p>It is measured directly on a spectrum analyzer using its built-in "OBW / 99% power" function, which integrates the trace and finds the two edges enclosing 99% of the area. This is the number that appears on type-approval documents and against a <em>spectral mask</em>.</p>
<p><strong>Noise-equivalent bandwidth (NEB)</strong> answers a different question: if I replace my real (curvy) frequency response $|H(f)|^2$ with an ideal rectangular filter of the same peak gain, how wide must the brick wall be to pass the same white-noise power? That width is</p>
<p>$$B_N=\frac{1}{|H(f_0)|^2}\int_0^{\infty}|H(f)|^2\,df\quad(\text{one-sided}).$$</p>
<p>NEB is the correct bandwidth to use whenever you compute noise power $N=N_0 B_N$ or an SNR, because it accounts for the noise leaking through the skirts of a non-ideal filter. For a first-order RC filter, $B_N=\tfrac{\pi}{2}f_{3\mathrm{dB}}\approx 1.57\,f_{3\mathrm{dB}}$ — the NEB is 57% wider than the −3 dB bandwidth because the gentle roll-off keeps passing noise beyond the corner.</p>
<div class="callout"><strong>Pitfall:</strong> plugging the −3 dB bandwidth into $N=N_0 B$ under-counts noise for any real filter. Use the noise-equivalent bandwidth. The two coincide only for an ideal brick-wall filter.</div>`
      },
      {
        h: 'Nyquist bandwidth, symbol rate, and data rate',
        html: String.raw`<p>Nyquist's signalling theorem sets the <em>minimum</em> bandwidth needed to send symbols without intersymbol interference (ISI). Through an ideal baseband channel of bandwidth $B$ Hz you can transmit at most $2B$ independent symbols per second — the <strong>Nyquist rate</strong>. Equivalently, a symbol rate $R_s$ needs a minimum baseband bandwidth</p>
<p>$$B_{min}=\frac{R_s}{2}\quad(\text{ideal brick-wall, }\alpha=0).$$</p>
<p>Real pulse shaping uses a raised-cosine filter with roll-off $\alpha\in(0,1]$, which widens the occupied baseband bandwidth to</p>
<p>$$B=\frac{R_s}{2}(1+\alpha),$$</p>
<p>trading a little extra spectrum for a physically realizable filter and finite pulse tails. The <strong>bit rate</strong> then follows from the modulation order $M$: each symbol carries $\log_2 M$ bits, so</p>
<p>$$R_b=R_s\log_2 M=2B\,\frac{\log_2 M}{1+\alpha}.$$</p>
<p>This is why higher-order modulation (16-QAM, 64-QAM) is the lever for pushing more bits through a fixed band — you cannot beat Nyquist's symbol ceiling, so you pack more bits per symbol. Shannon then caps how far this can go: $C=B\log_2(1+\mathrm{SNR})$, which no amount of bandwidth-per-symbol cleverness can exceed.</p>
<table class="data">
<tr><th>Quantity</th><th>Baseband</th><th>Passband (RF)</th></tr>
<tr><td>Min bandwidth for $R_s$</td><td>$R_s/2$</td><td>$R_s$</td></tr>
<tr><td>Raised-cosine bandwidth</td><td>$\tfrac{R_s}{2}(1+\alpha)$</td><td>$R_s(1+\alpha)$</td></tr>
</table>`
      },
      {
        h: 'Baseband vs RF (passband) bandwidth — the factor of two',
        html: String.raw`<p>A baseband signal occupies $[0,B]$ (its spectrum is one-sided in the useful sense, mirrored into negatives). When you mix it up to a carrier $f_c$, both the positive and negative baseband halves appear as sidebands around $\pm f_c$, so the transmitted <strong>passband bandwidth is twice the baseband bandwidth</strong> for a double-sideband signal:</p>
<p>$$B_{RF}=2B_{baseband}.$$</p>
<p>Thus a baseband message limited to $W$ Hz produces a DSB-AM signal of RF bandwidth $2W$; an FM signal follows Carson's rule $B\approx 2(\Delta f + f_m)$; and a linearly modulated (PSK/QAM) signal at symbol rate $R_s$ occupies an RF null-to-null bandwidth of $2R_s$ (baseband main lobe $R_s$, doubled). The exception is single-sideband (SSB), which discards one sideband and recovers the factor of two, giving $B_{RF}=B_{baseband}$.</p>
<div class="callout"><strong>Exam trap:</strong> "A BPSK signal at 1 Mbaud" has baseband null-to-null $\pm1$ MHz $=$ 2 MHz two-sided baseband, but as an RF signal it spans $f_c\pm1$ MHz — still 2 MHz because BPSK's baseband spectrum is already two-sided. For a message-limited analog signal of one-sided bandwidth $W$, the DSB RF width is $2W$. Always ask whether the stated baseband number is one-sided or two-sided before doubling.</div>`
      },
      {
        h: 'Fractional bandwidth: narrowband vs wideband vs ultra-wideband',
        html: String.raw`<p>Absolute bandwidth (in Hz) does not tell you whether a system is "wideband" — a 100 MHz band is enormous at 900 MHz but a sliver at 60 GHz. The scale-free measure is <strong>fractional bandwidth</strong>, the ratio of bandwidth to centre frequency:</p>
<p>$$B_f=\frac{f_H-f_L}{f_c},\qquad f_c=\frac{f_H+f_L}{2}\ \text{(arithmetic)}\ \text{or}\ \sqrt{f_Hf_L}\ \text{(geometric)}.$$</p>
<p>By the FCC convention a signal is <strong>ultra-wideband (UWB)</strong> if $B_f>0.20$ (20%) or its absolute bandwidth exceeds 500 MHz. Narrowband systems have $B_f\ll 1\%$. Fractional bandwidth governs how hard the RF front-end is to build: a 1% antenna is easy and high-Q; a 100% (multi-octave) antenna (log-periodic, spiral, Vivaldi) is a major design effort. It also sets whether the propagation channel can be treated as frequency-flat (narrowband) or frequency-selective (wideband, needing equalization).</p>
<table class="data">
<tr><th>Class</th><th>Fractional bandwidth $B_f$</th><th>Example</th></tr>
<tr><td>Narrowband</td><td>$< 1\%$</td><td>FM broadcast channel at 100 MHz (200 kHz $\to$ 0.2%)</td></tr>
<tr><td>Wideband</td><td>$1\%$–$20\%$</td><td>Wi-Fi 80 MHz at 5 GHz (1.6%)</td></tr>
<tr><td>Ultra-wideband</td><td>$> 20\%$ or $> 500$ MHz</td><td>Impulse radio, UWB ranging</td></tr>
</table>`
      },
      {
        h: 'Measuring bandwidth and common pitfalls',
        html: String.raw`<p>On a <strong>spectrum analyzer</strong>, bandwidth is read from the displayed PSD, but the reading depends on instrument settings:</p>
<ul>
<li><strong>Resolution bandwidth (RBW):</strong> the analyzer's own IF filter width. Too wide and it smears narrow features; too narrow and sweeps crawl. RBW also sets the displayed noise floor ($10\log_{10}(\mathrm{RBW})$ per decade), so always state RBW when quoting a spectrum.</li>
<li><strong>−3 dB / −xx dB markers:</strong> most analyzers have an "N dB down" function that finds the two frequencies at which the trace drops N dB from the peak — this gives −3 dB or −20 dB (mask) bandwidths directly.</li>
<li><strong>OBW function:</strong> integrates the trace power and returns the 99% (or chosen %) occupied bandwidth.</li>
<li><strong>Detector and averaging:</strong> use RMS/power averaging for noise-like signals; sample or peak detectors distort the measured width.</li>
</ul>
<p>Recurrent mistakes: (1) confusing one-sided and two-sided bandwidth (a factor of 2); (2) confusing baseband and RF bandwidth (another factor of 2 — so people are off by 4×); (3) using −3 dB bandwidth in a noise calculation instead of NEB; (4) forgetting that raised-cosine widens the ideal Nyquist band by $(1+\alpha)$; (5) quoting an absolute bandwidth as "wideband" without referencing the carrier (use fractional bandwidth). Keeping the definitions straight is more than half the battle.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>The single lesson of this topic is that <strong>"bandwidth" is never one number</strong> — always name the definition. With that discipline, everything else clicks into place:</p>
<ul>
<li><strong>Five definitions, one spectrum.</strong> Null-to-null, −3 dB, occupied (99%), noise-equivalent, and Nyquist can differ by 2× or more for the same waveform. Context picks the right one: filters/channels → −3 dB; masks/regulation → occupied; noise/SNR → NEB; "what data rate fits?" → Nyquist.</li>
<li><strong>The two must-have relationships.</strong> Nyquist: an ideal band $B$ carries $2B$ symbols/s, so $B_{min}=R_s/2$ (widened to $\tfrac{R_s}{2}(1+\alpha)$ by raised-cosine shaping). Baseband-to-RF: $B_{RF}=2B_{baseband}$ for double-sideband signals (SSB recovers the factor of two).</li>
<li><strong>Noise belongs to NEB, not −3 dB.</strong> $N=N_0B_N$ with $B_N=\frac{1}{|H(f_0)|^2}\int_0^\infty|H(f)|^2df$; for an RC filter that is $1.57\times$ the −3 dB width, because the gentle skirt keeps leaking noise past the corner.</li>
<li><strong>Bits come from packing, capped by Shannon.</strong> $R_b=R_s\log_2 M$; raise $M$ or shrink $\alpha$ to lift spectral efficiency, but $C=B\log_2(1+\mathrm{SNR})$ is the ceiling no cleverness beats.</li>
<li><strong>Scale matters.</strong> Fractional bandwidth $B_f=(f_H-f_L)/f_c$ tells you whether a band is "wide"; UWB is $B_f>20\%$ or $>500$ MHz. It also decides antenna feasibility and whether the channel is frequency-flat.</li>
<li><strong>The compounding trap.</strong> One-sided vs two-sided, and baseband vs RF, are each a factor of 2 — muddle both and you are off by 4×. Resolve both before trusting any bandwidth figure.</li>
</ul>
<div class="callout tip">If you internalize one habit: whenever someone says "the bandwidth is X," ask <em>which</em> bandwidth and whether it is one-sided/two-sided, baseband/RF. Getting the definition right is more than half of every bandwidth problem.</div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Bandwidth_(signal_processing)" target="_blank" rel="noopener">Wikipedia — Bandwidth (signal processing)</a> — canonical overview that lays out and contrasts the −3 dB, null-to-null, occupied, and noise-equivalent definitions in one place.</li>
<li><a href="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-02-introduction-to-eecs-ii-digital-communication-systems-fall-2012/lecture-videos/lecture-11-lti-channel-and-intersymbol-interference/" target="_blank" rel="noopener">MIT OCW 6.02 — LTI Channels and Intersymbol Interference</a> — university lecture connecting channel bandwidth to symbol rate, ISI, and the Nyquist limit.</li>
<li><a href="https://resources.pcb.cadence.com/blog/2020-equivalent-noise-bandwidth-its-applications-and-how-is-it-calculated" target="_blank" rel="noopener">Cadence — Equivalent Noise Bandwidth</a> — focused derivation of the brick-wall noise-equivalent bandwidth and why it, not −3 dB, belongs in noise-power calculations.</li>
<li><a href="https://www.keysight.com/used/us/en/knowledge/formulas/bandwith-formula" target="_blank" rel="noopener">Keysight — Bandwidth Formula guide</a> — vendor engineering reference tying the bandwidth definitions to instrument measurement (RBW, occupied-bandwidth function).</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`"Bandwidth" is ambiguous until you name the definition: null-to-null, −3 dB, occupied (99%), noise-equivalent, or Nyquist.`,
      String.raw`Rectangular NRZ pulse at rate $R_s$: baseband null-to-null main lobe $=R_s$ one-sided, $2R_s$ two-sided; −3 dB $\approx0.443R_s$ one-sided.`,
      String.raw`Occupied bandwidth encloses a stated fraction (99%) of total power; it is the regulator's number, measured with the analyzer's OBW function.`,
      String.raw`Noise-equivalent bandwidth $B_N=\frac{1}{|H(f_0)|^2}\int_0^\infty|H(f)|^2df$ is the width to use in $N=N_0B_N$; for RC it is $1.57\times$ the −3 dB bandwidth.`,
      String.raw`Nyquist: through an ideal baseband channel of width $B$ you can send $2B$ symbols/s; minimum baseband bandwidth $B_{min}=R_s/2$.`,
      String.raw`Raised-cosine shaping widens the band to $B=\tfrac{R_s}{2}(1+\alpha)$ baseband, $R_s(1+\alpha)$ passband.`,
      String.raw`Passband (RF) bandwidth is twice baseband bandwidth for double-sideband signals: $B_{RF}=2B_{baseband}$ (SSB recovers the factor of two).`,
      String.raw`Bit rate $R_b=R_s\log_2 M$; raising the modulation order $M$ packs more bits into a fixed band, bounded by Shannon $C=B\log_2(1+\mathrm{SNR})$.`,
      String.raw`Fractional bandwidth $B_f=(f_H-f_L)/f_c$ scales bandwidth by carrier; UWB means $B_f>20\%$ or $>500$ MHz absolute.`,
      String.raw`More bandwidth always means more accepted noise power ($N_0B$), so wider is not automatically better — match bandwidth to the signal.`,
      String.raw`Always state RBW when quoting a spectrum; the displayed noise floor and feature sharpness both depend on it.`,
      String.raw`Two classic factor-of-two errors compound into 4×: one-sided vs two-sided, and baseband vs RF — check both before trusting a number.`
    ],
    equations: [
      {
        title: String.raw`Null-to-null bandwidth of a rectangular pulse`,
        tex: String.raw`$$B_{nn}=\frac{2}{T}=2R_s\ \text{(two-sided baseband)}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A single rectangular symbol of duration $T$ and height $A$ is $p(t)=A$ for $|t|\le T/2$ and zero otherwise.</p><p><b>Step 1 — Fourier transform of the rectangle.</b> Direct integration gives $$P(f)=\int_{-T/2}^{T/2}Ae^{-j2\pi ft}dt=AT\,\frac{\sin(\pi fT)}{\pi fT}=AT\operatorname{sinc}(fT).$$ The spectrum of a rectangle is a sinc — this is the canonical transform pair.</p><p><b>Step 2 — locate the nulls.</b> The sinc is zero when its argument is a nonzero integer: $\pi fT=k\pi\Rightarrow f=k/T$ for $k=\pm1,\pm2,\dots$ The first nulls, bounding the main lobe, are at $f=\pm1/T=\pm R_s$.</p><p><b>Step 3 — measure the main lobe width.</b> The width between the first nulls on either side is $$B_{nn}=\left(\frac{1}{T}\right)-\left(-\frac{1}{T}\right)=\frac{2}{T}=2R_s.$$</p><p><b>Result.</b> $$B_{nn}=2R_s.$$ The main lobe carries about 90% of the power; the slow $1/f^2$ decay of $|\operatorname{sinc}|^2$ leaves the rest in sidelobes — the motivation for pulse shaping.</p>`
      },
      {
        title: String.raw`−3 dB (half-power) point of a $\operatorname{sinc}^2$ spectrum`,
        tex: String.raw`$$B_{3\mathrm{dB}}\approx 0.886\,R_s\ \text{(two-sided baseband)}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The PSD of the rectangular pulse is $S(f)=(AT)^2\operatorname{sinc}^2(fT)$, peaking at $f=0$ with value $(AT)^2$.</p><p><b>Step 1 — set the half-power condition.</b> Half power means the PSD falls to $1/2$ of its peak: $$\operatorname{sinc}^2(fT)=\tfrac12\ \Rightarrow\ \frac{\sin(\pi fT)}{\pi fT}=\frac{1}{\sqrt2}.$$</p><p><b>Step 2 — solve the transcendental equation.</b> Let $x=\pi fT$. We need $\sin x/x=0.7071$. Numerically the root is $x\approx1.3916$, so $$fT=\frac{x}{\pi}=\frac{1.3916}{\pi}\approx0.443.$$</p><p><b>Step 3 — two-sided width.</b> The half-power point sits at $f\approx0.443/T=0.443R_s$ on each side, so the full −3 dB width is $$B_{3\mathrm{dB}}=2\times0.443R_s\approx0.886R_s.$$</p><p><b>Result.</b> $$B_{3\mathrm{dB}}\approx0.886R_s,$$ less than half the null-to-null width — a reminder that "−3 dB" and "null-to-null" describe the same waveform with very different numbers.</p>`
      },
      {
        title: String.raw`Noise-equivalent bandwidth`,
        tex: String.raw`$$B_N=\frac{1}{|H(f_0)|^2}\int_0^{\infty}|H(f)|^2\,df$$`,
        derivation: String.raw`<p><b>Where we start.</b> White noise with one-sided PSD $N_0$ enters a filter $H(f)$. The output noise power is $$P_{out}=\int_0^{\infty}N_0\,|H(f)|^2\,df.$$</p><p><b>Step 1 — define the equivalent brick wall.</b> We want an ideal rectangular filter with the same peak gain $|H(f_0)|^2$ (usually the passband/DC gain) and width $B_N$ that passes the <em>same</em> output power: $$P_{out}^{ideal}=N_0\,|H(f_0)|^2\,B_N.$$</p><p><b>Step 2 — equate the two powers.</b> Setting $P_{out}=P_{out}^{ideal}$ and cancelling $N_0$: $$\int_0^{\infty}|H(f)|^2df=|H(f_0)|^2B_N.$$</p><p><b>Step 3 — solve for $B_N$.</b> $$B_N=\frac{1}{|H(f_0)|^2}\int_0^{\infty}|H(f)|^2\,df.$$</p><p><b>Worked case — first-order RC.</b> With $|H(f)|^2=1/[1+(f/f_c)^2]$ and $|H(0)|^2=1$, $$B_N=\int_0^{\infty}\frac{df}{1+(f/f_c)^2}=f_c\Big[\arctan(f/f_c)\Big]_0^{\infty}=f_c\cdot\frac{\pi}{2}=1.571f_c.$$</p><p><b>Result.</b> $$B_N=\frac{\pi}{2}f_{3\mathrm{dB}}\approx1.57f_{3\mathrm{dB}}.$$ The gentle RC skirt passes 57% more noise than a brick wall at the same corner — why NEB, not −3 dB, belongs in $N=N_0B_N$.</p>`
      },
      {
        title: String.raw`Nyquist minimum bandwidth and Nyquist rate`,
        tex: String.raw`$$R_s^{max}=2B\quad\Longleftrightarrow\quad B_{min}=\frac{R_s}{2}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want ISI-free signalling through an ideal baseband channel that passes $[-B,B]$. The receiver samples once per symbol at rate $R_s$.</p><p><b>Step 1 — Nyquist's zero-ISI condition.</b> ISI vanishes if the overall pulse $g(t)$ has $g(0)=1$ and $g(nT)=0$ for all nonzero integer $n$ (each symbol's tails cross zero at every other sampling instant). In frequency this is the <em>Nyquist criterion</em>: the folded spectrum must be flat, $$\sum_k G\!\left(f+\frac{k}{T}\right)=T\ \text{(constant)}.$$</p><p><b>Step 2 — the narrowest pulse that satisfies it.</b> The minimum-bandwidth spectrum meeting this is a rectangle of width $1/T$ centred at zero, i.e. an ideal low-pass of bandwidth $B=1/(2T)$. Its inverse transform is $g(t)=\operatorname{sinc}(t/T)$, which indeed has nulls at every $nT$.</p><p><b>Step 3 — read off the relationship.</b> With $B=1/(2T)$ and $R_s=1/T$, $$B=\frac{R_s}{2}\ \Longleftrightarrow\ R_s=2B.$$</p><p><b>Step 4 — practical roll-off.</b> The ideal brick wall is unrealizable, so a raised cosine of roll-off $\alpha$ is used, widening the band: $$B=\frac{R_s}{2}(1+\alpha).$$</p><p><b>Result.</b> $$B_{min}=\frac{R_s}{2},\qquad B=\frac{R_s}{2}(1+\alpha).$$ You can never send more than $2B$ symbols/s ISI-free; $\alpha$ buys realizability at the cost of a little extra spectrum.</p>`
      },
      {
        title: String.raw`Bit rate, symbol rate and bandwidth`,
        tex: String.raw`$$R_b=R_s\log_2 M=\frac{2B\log_2 M}{1+\alpha}$$`,
        derivation: String.raw`<p><b>Where we start.</b> An $M$-ary modulation maps each transmitted symbol to one of $M$ constellation points.</p><p><b>Step 1 — bits per symbol.</b> Choosing among $M$ equiprobable points conveys $\log_2 M$ bits per symbol, so the bit rate is $$R_b=R_s\log_2 M.$$</p><p><b>Step 2 — insert the Nyquist bandwidth relation.</b> From raised-cosine shaping $B=\tfrac{R_s}{2}(1+\alpha)$, hence $R_s=\dfrac{2B}{1+\alpha}$.</p><p><b>Step 3 — combine.</b> $$R_b=\frac{2B}{1+\alpha}\log_2 M.$$</p><p><b>Result.</b> $$R_b=\frac{2B\log_2 M}{1+\alpha}.$$ Spectral efficiency $R_b/B=\dfrac{2\log_2 M}{1+\alpha}$ (bits/s/Hz): to raise it in a fixed band, increase $M$ (more bits/symbol) or shrink $\alpha$ — both bounded by Shannon's $C=B\log_2(1+\mathrm{SNR})$.</p>`
      },
      {
        title: String.raw`Passband (RF) vs baseband bandwidth`,
        tex: String.raw`$$B_{RF}=2B_{baseband}\ \text{(double sideband)}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A real baseband message $m(t)$ band-limited to $[-W,W]$ has a spectrum $M(f)$ that occupies one-sided width $W$ (mirrored into negative frequencies).</p><p><b>Step 1 — mix to the carrier.</b> Multiplying by $\cos(2\pi f_c t)$ shifts the spectrum: by the modulation property, $$m(t)\cos(2\pi f_c t)\ \leftrightarrow\ \tfrac12\big[M(f-f_c)+M(f+f_c)\big].$$</p><p><b>Step 2 — inspect the passband.</b> Around $+f_c$, the copy $M(f-f_c)$ spans $[f_c-W,\ f_c+W]$ — both the positive and negative halves of the baseband spectrum now appear as an upper and lower sideband.</p><p><b>Step 3 — measure the width.</b> The occupied RF band is $$B_{RF}=(f_c+W)-(f_c-W)=2W=2B_{baseband}.$$</p><p><b>Result.</b> $$B_{RF}=2B_{baseband}.$$ Both sidebands carry the same information, so single-sideband transmission can strip one and recover the factor of two ($B_{RF}=B_{baseband}$). Note: for linear digital modulation whose baseband spectrum is <em>already</em> two-sided (e.g. BPSK's $\pm R_s$ main lobe), the "doubling" is already contained in that two-sided figure.</p>`
      },
      {
        title: String.raw`Fractional bandwidth`,
        tex: String.raw`$$B_f=\frac{f_H-f_L}{f_c}\times 100\%$$`,
        derivation: String.raw`<p><b>Where we start.</b> A band spans lower edge $f_L$ to upper edge $f_H$; we want a measure of relative width independent of the absolute frequency.</p><p><b>Step 1 — pick a centre.</b> The arithmetic centre is $f_c=(f_H+f_L)/2$; for wide (multi-octave) bands the geometric centre $f_c=\sqrt{f_Hf_L}$ is preferred because it is symmetric on a log axis.</p><p><b>Step 2 — normalize the absolute bandwidth.</b> Divide the absolute width $f_H-f_L$ by the centre: $$B_f=\frac{f_H-f_L}{f_c}.$$</p><p><b>Step 3 — express as a percentage.</b> Multiply by 100% for the conventional figure.</p><p><b>Result.</b> $$B_f=\frac{f_H-f_L}{f_c}\times100\%.$$ Example: 2.4–2.5 GHz $\Rightarrow f_c=2.45$ GHz, $B_f=100/2450=4.1\%$ (wideband). UWB requires $B_f>20\%$ or $>500$ MHz absolute — a much harder RF/antenna design.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Name five distinct definitions of bandwidth.`, back: String.raw`Null-to-null, −3 dB (half-power), occupied (99% power), noise-equivalent, and Nyquist (minimum). They can differ by 2× or more for the same signal.` },
      { front: String.raw`Null-to-null baseband bandwidth of a rectangular pulse at rate $R_s$?`, back: String.raw`$2R_s$ two-sided (main-lobe nulls at $\pm R_s=\pm1/T$); $R_s$ if counting only positive frequencies.` },
      { front: String.raw`−3 dB bandwidth of a $\operatorname{sinc}^2$ spectrum?`, back: String.raw`Half-power at $fT\approx0.443$, so $\approx0.443R_s$ one-sided, $\approx0.886R_s$ two-sided — much narrower than null-to-null.` },
      { front: String.raw`What is occupied (99%) bandwidth and who uses it?`, back: String.raw`The band containing 99% of total power; the regulator's definition, read directly from a spectrum analyzer's OBW function against a spectral mask.` },
      { front: String.raw`Define noise-equivalent bandwidth (NEB).`, back: String.raw`$B_N=\frac{1}{|H(f_0)|^2}\int_0^\infty|H(f)|^2df$ — the brick-wall width passing the same white-noise power as the real filter. Use it in $N=N_0B_N$.` },
      { front: String.raw`NEB of a first-order RC filter versus its −3 dB bandwidth?`, back: String.raw`$B_N=\tfrac{\pi}{2}f_{3\mathrm{dB}}\approx1.57f_{3\mathrm{dB}}$ — 57% wider, because the gentle skirt keeps passing noise past the corner.` },
      { front: String.raw`State the Nyquist minimum-bandwidth relation.`, back: String.raw`An ideal baseband channel of width $B$ carries at most $2B$ symbols/s; equivalently $B_{min}=R_s/2$ for ISI-free signalling.` },
      { front: String.raw`How does raised-cosine roll-off $\alpha$ change the bandwidth?`, back: String.raw`It widens it to $B=\tfrac{R_s}{2}(1+\alpha)$ baseband (or $R_s(1+\alpha)$ passband), trading spectrum for a realizable filter.` },
      { front: String.raw`Relate bit rate, symbol rate and modulation order.`, back: String.raw`$R_b=R_s\log_2 M$; each symbol carries $\log_2 M$ bits, so higher $M$ packs more bits into a fixed band (up to Shannon).` },
      { front: String.raw`Baseband-to-RF bandwidth relation for double-sideband signals?`, back: String.raw`$B_{RF}=2B_{baseband}$; both sidebands appear around $\pm f_c$. SSB discards one and recovers the factor of two.` },
      { front: String.raw`Define fractional bandwidth and the UWB threshold.`, back: String.raw`$B_f=(f_H-f_L)/f_c$; UWB means $B_f>20\%$ or absolute bandwidth $>500$ MHz.` },
      { front: String.raw`Why must you state RBW when quoting a spectrum?`, back: String.raw`The analyzer's resolution bandwidth sets the displayed noise floor and how sharply features appear; the same signal looks different at different RBW.` },
      { front: String.raw`Carson's rule for FM bandwidth?`, back: String.raw`$B\approx2(\Delta f+f_m)$, where $\Delta f$ is peak deviation and $f_m$ the highest message frequency — an occupied-bandwidth estimate for angle modulation.` },
      { front: String.raw`Which bandwidth belongs in an SNR / noise-power calculation?`, back: String.raw`Noise-equivalent bandwidth. Using −3 dB under-counts noise for any non-ideal filter; the two agree only for a brick wall.` },
      { front: String.raw`What two factor-of-two errors compound to give a 4× mistake?`, back: String.raw`One-sided vs two-sided bandwidth, and baseband vs RF bandwidth. Always resolve both before trusting a bandwidth figure.` },
      { front: String.raw`Spectral efficiency of an $M$-ary raised-cosine link?`, back: String.raw`$R_b/B=\dfrac{2\log_2 M}{1+\alpha}$ bits/s/Hz — raise $M$ or shrink $\alpha$ to improve it, bounded by $\log_2(1+\mathrm{SNR})$.` }
    ],
    mcqs: [
      { q: String.raw`For a rectangular NRZ pulse at symbol rate $R_s$, the two-sided null-to-null baseband bandwidth is:`, options: [String.raw`$R_s/2$`, String.raw`$R_s$`, String.raw`$2R_s$`, String.raw`$4R_s$`], answer: 2, explain: String.raw`The $\operatorname{sinc}$ spectrum's first nulls are at $\pm1/T=\pm R_s$, so the main lobe spans $2R_s$.` },
      { q: String.raw`The −3 dB bandwidth of a $\operatorname{sinc}^2$ PSD compared with its null-to-null bandwidth is:`, options: [String.raw`Larger`, String.raw`About the same`, String.raw`Smaller (roughly $0.886R_s$ vs $2R_s$)`, String.raw`Exactly half`], answer: 2, explain: String.raw`Half power occurs at $fT\approx0.443$, giving $\approx0.886R_s$ two-sided, well inside the $2R_s$ main lobe.` },
      { q: String.raw`Which bandwidth definition should you use to compute noise power $N=N_0B$?`, options: [String.raw`Null-to-null`, String.raw`−3 dB`, String.raw`Noise-equivalent`, String.raw`Occupied`], answer: 2, explain: String.raw`Noise-equivalent bandwidth accounts for noise leaking through the filter skirts; it is the only choice that gives the correct output noise power.` },
      { q: String.raw`The noise-equivalent bandwidth of a first-order RC filter equals:`, options: [String.raw`$f_{3\mathrm{dB}}$`, String.raw`$0.5f_{3\mathrm{dB}}$`, String.raw`$1.57f_{3\mathrm{dB}}$`, String.raw`$2f_{3\mathrm{dB}}$`], answer: 2, explain: String.raw`$B_N=\int_0^\infty df/[1+(f/f_c)^2]=\tfrac{\pi}{2}f_c\approx1.57f_{3\mathrm{dB}}$.` },
      { q: String.raw`Through an ideal baseband channel of bandwidth $B$, the maximum ISI-free symbol rate is:`, options: [String.raw`$B$`, String.raw`$2B$`, String.raw`$B/2$`, String.raw`$4B$`], answer: 1, explain: String.raw`Nyquist's theorem: $R_s^{max}=2B$, i.e. $B_{min}=R_s/2$.` },
      { q: String.raw`A raised-cosine filter with roll-off $\alpha$ gives a baseband bandwidth of:`, options: [String.raw`$R_s/2$`, String.raw`$R_s(1+\alpha)$`, String.raw`$\tfrac{R_s}{2}(1+\alpha)$`, String.raw`$\alpha R_s$`], answer: 2, explain: String.raw`Shaping widens the ideal $R_s/2$ band by the factor $(1+\alpha)$.` },
      { q: String.raw`For a double-sideband modulated signal, the RF bandwidth relative to the baseband bandwidth is:`, options: [String.raw`Equal`, String.raw`Half`, String.raw`Twice`, String.raw`Four times`], answer: 2, explain: String.raw`Both sidebands appear around $\pm f_c$, so $B_{RF}=2B_{baseband}$; SSB would make them equal.` },
      { q: String.raw`Occupied bandwidth (per the usual regulatory definition) is the band containing:`, options: [String.raw`50% of the power`, String.raw`90% of the power`, String.raw`99% of the power`, String.raw`100% of the power`], answer: 2, explain: String.raw`The standard OBW encloses 99% of total power (0.5% excluded on each edge).` },
      { q: String.raw`A signal spans 2.40–2.50 GHz. Its fractional bandwidth is about:`, options: [String.raw`0.4%`, String.raw`4.1%`, String.raw`40%`, String.raw`100%`], answer: 1, explain: String.raw`$f_c=2.45$ GHz, $B_f=0.1/2.45=4.1\%$ — wideband but not UWB.` },
      { q: String.raw`Which change increases spectral efficiency (bits/s/Hz) in a fixed band?`, options: [String.raw`Lowering the modulation order $M$`, String.raw`Raising $M$ or reducing roll-off $\alpha$`, String.raw`Increasing $\alpha$`, String.raw`Widening the RBW`], answer: 1, explain: String.raw`$R_b/B=2\log_2 M/(1+\alpha)$ rises with larger $M$ or smaller $\alpha$, up to the Shannon limit.` },
      { q: String.raw`Carson's rule estimates the bandwidth of:`, options: [String.raw`A rectangular pulse`, String.raw`An RC filter`, String.raw`An FM (angle-modulated) signal`, String.raw`A brick-wall channel`], answer: 2, explain: String.raw`$B\approx2(\Delta f+f_m)$ approximates the occupied bandwidth of frequency/phase modulation.` },
      { q: String.raw`Why does the 99% occupied bandwidth of a raw rectangular pulse become very large?`, options: [String.raw`Its main lobe is wide`, String.raw`Its sidelobes decay slowly ($1/f^2$), holding significant far-out power`, String.raw`It has no sidelobes`, String.raw`The carrier leaks`], answer: 1, explain: String.raw`The $\operatorname{sinc}^2$ tails fall only as $1/f^2$, so enclosing 99% of the power requires reaching far into the sidelobes — the case for pulse shaping.` },
      { q: String.raw`Increasing a receiver's bandwidth, all else equal, has what effect on noise power?`, options: [String.raw`Decreases it`, String.raw`No effect`, String.raw`Increases it proportionally ($N_0B$)`, String.raw`Increases it as $B^2$`], answer: 2, explain: String.raw`Thermal noise power is $N_0B$, so wider bandwidth admits proportionally more noise — wider is not automatically better.` },
      { q: String.raw`On a spectrum analyzer, which setting most directly affects the displayed noise floor?`, options: [String.raw`Span`, String.raw`Resolution bandwidth (RBW)`, String.raw`Center frequency`, String.raw`Reference level`], answer: 1, explain: String.raw`The displayed noise floor scales as $10\log_{10}(\mathrm{RBW})$; narrowing RBW lowers the floor and reveals weaker signals.` }
    ],
    numericals: [
      { q: String.raw`A system transmits rectangular NRZ symbols at 5 Mbaud. Give the one-sided and two-sided null-to-null baseband bandwidths and the −3 dB two-sided bandwidth.`, solution: String.raw`<p><b>Formula.</b> $$B_{nn,1side}=R_s,\quad B_{nn,2side}=2R_s,\quad B_{3dB,2side}\approx0.886R_s,$$ where $R_s$ is the symbol rate; the first sinc nulls sit at $\pm R_s$ and the half-power points at $\pm0.443R_s$.</p>
      <p><b>Substitute.</b> With $R_s=5$ MHz: one-sided $=5$, two-sided $=2\times5$, and −3 dB $=0.886\times5$.</p>
      <p><b>Compute.</b> Null-to-null one-sided $=5$ MHz; two-sided $=10$ MHz; −3 dB two-sided $\approx4.43$ MHz.</p>
      <p><b>Explanation.</b> Three different "bandwidths" for one waveform, spanning more than 2× — the whole point of the topic. The −3 dB width (4.43 MHz) is under half the null-to-null (10 MHz), so quoting a number without naming its definition is meaningless.</p>` },
      { q: String.raw`Find the noise-equivalent bandwidth of a first-order RC low-pass with $f_{3\mathrm{dB}}=1$ MHz, and the noise power it passes for $N_0=4\times10^{-21}$ W/Hz.`, solution: String.raw`<p><b>Formula.</b> $$B_N=\frac{\pi}{2}f_{3\mathrm{dB}},\qquad N=N_0 B_N,$$ the noise-equivalent bandwidth of an RC filter and the thermal noise power it admits.</p>
      <p><b>Substitute.</b> $B_N=\dfrac{\pi}{2}\times1$ MHz; $N=4\times10^{-21}\times B_N$.</p>
      <p><b>Compute.</b> $B_N=1.571$ MHz. $N=4\times10^{-21}\times1.571\times10^6=6.28\times10^{-15}$ W. In dBm: $10\log_{10}(6.28\times10^{-15}/10^{-3})=-112.0$ dBm. Using the −3 dB value (1 MHz) instead would under-estimate the noise by $10\log_{10}(1.571)=1.96$ dB.</p>
      <p><b>Explanation.</b> The RC skirt passes 57% more noise than a brick wall at the same corner, which is exactly why NEB — not the −3 dB bandwidth — belongs in $N=N_0B$. (This corrects a prior typo that read −141.7 dBm; the correct level is −112.0 dBm.)</p>` },
      { q: String.raw`What minimum baseband and passband bandwidth are needed to send 10 Msymbol/s with (a) an ideal Nyquist filter and (b) a raised cosine with $\alpha=0.35$?`, solution: String.raw`<p><b>Formula.</b> $$B_{bb}=\frac{R_s}{2}(1+\alpha),\qquad B_{RF}=R_s(1+\alpha),$$ reducing to $R_s/2$ and $R_s$ respectively for the ideal $\alpha=0$ case.</p>
      <p><b>Substitute.</b> (a) $\alpha=0$: $B_{bb}=10/2$, $B_{RF}=10$. (b) $\alpha=0.35$: $B_{bb}=5\times1.35$, $B_{RF}=10\times1.35$.</p>
      <p><b>Compute.</b> (a) $B_{bb}=5$ MHz, $B_{RF}=10$ MHz. (b) $B_{bb}=6.75$ MHz, $B_{RF}=13.5$ MHz.</p>
      <p><b>Explanation.</b> The 35% roll-off costs 35% extra spectrum in exchange for a realizable filter with finite pulse tails. Note the passband is always twice the baseband — the ubiquitous factor-of-two between baseband and RF.</p>` },
      { q: String.raw`A channel offers 20 MHz of RF bandwidth. Using 16-QAM with $\alpha=0.25$, find the achievable symbol and bit rates.`, solution: String.raw`<p><b>Formula.</b> $$R_s=\frac{B_{RF}}{1+\alpha},\qquad R_b=R_s\log_2 M,\qquad \eta=\frac{R_b}{B_{RF}},$$ with $M=16$ so $\log_2 M=4$ bits/symbol.</p>
      <p><b>Substitute.</b> $R_s=\dfrac{20}{1.25}$; $R_b=R_s\times4$; $\eta=R_b/20$.</p>
      <p><b>Compute.</b> $R_s=16$ Msym/s; $R_b=64$ Mbit/s; $\eta=64/20=3.2$ bits/s/Hz.</p>
      <p><b>Explanation.</b> 16-QAM's 4 bits/symbol lifts spectral efficiency to 3.2 bits/s/Hz — you cannot beat Nyquist's symbol ceiling, so packing more bits per symbol is the lever, bounded ultimately by Shannon.</p>` },
      { q: String.raw`An FM signal has peak deviation $\Delta f=75$ kHz and highest message frequency $f_m=15$ kHz. Estimate its occupied bandwidth by Carson's rule and its fractional bandwidth at a 100 MHz carrier.`, solution: String.raw`<p><b>Formula.</b> $$B\approx2(\Delta f+f_m)\ \text{(Carson)},\qquad B_f=\frac{B}{f_c},$$ giving the occupied bandwidth of angle modulation and its width relative to the carrier.</p>
      <p><b>Substitute.</b> $B=2(75+15)$ kHz; $B_f=\dfrac{0.2\text{ MHz}}{100\text{ MHz}}$.</p>
      <p><b>Compute.</b> $B\approx180$ kHz ($\approx200$ kHz channel with guard band); $B_f=0.2/100=0.2\%$.</p>
      <p><b>Explanation.</b> The 180 kHz confirms the 200 kHz FM channel spacing. At 0.2% fractional bandwidth the signal is decidedly narrowband, so the antenna is easy to build and the channel is frequency-flat (no equalization needed).</p>` },
      { q: String.raw`A baseband voice message occupies 0–4 kHz. Give the RF bandwidth for (a) DSB-AM and (b) SSB.`, solution: String.raw`<p><b>Formula.</b> $$B_{DSB}=2W,\qquad B_{SSB}=W,$$ where $W$ is the one-sided baseband message bandwidth; DSB keeps both sidebands, SSB one.</p>
      <p><b>Substitute.</b> With $W=4$ kHz: $B_{DSB}=2\times4$; $B_{SSB}=4$.</p>
      <p><b>Compute.</b> (a) $B_{DSB}=8$ kHz; (b) $B_{SSB}=4$ kHz.</p>
      <p><b>Explanation.</b> This is the baseband-to-RF doubling in action: DSB mirrors the message into two sidebands around the carrier. SSB discards the redundant one, halving the bandwidth (and, with suppressed carrier, saving power) at the cost of a harder demodulator.</p>` },
      { q: String.raw`A UWB device must have fractional bandwidth $>20\%$ around a 6 GHz centre. What is the minimum absolute bandwidth, and does 500 MHz qualify?`, solution: String.raw`<p><b>Formula.</b> $$B_{min}=0.20\,f_c\ \text{(percentage rule)},\qquad \text{UWB if }B_f>20\%\ \textbf{or}\ B>500\ \text{MHz}.$$</p>
      <p><b>Substitute.</b> $B_{min}=0.20\times6000$ MHz; check $500$ MHz against both clauses ($B_f=500/6000$).</p>
      <p><b>Compute.</b> $B_{min}=1200$ MHz by the percentage rule. A 500 MHz emission gives $B_f=8.3\%$ ($<20\%$) but still qualifies as UWB via the absolute $>500$ MHz clause.</p>
      <p><b>Explanation.</b> The FCC UWB definition is an <em>OR</em> of two conditions, so at high carriers the absolute-bandwidth clause is the easier one to satisfy. This is why "wideband" must always be judged against the carrier via fractional bandwidth, not absolute Hz alone.</p>` },
      { q: String.raw`A raised-cosine link uses QPSK, $\alpha=0.2$, over 6 MHz of baseband bandwidth. Find $R_s$, $R_b$, and spectral efficiency.`, solution: String.raw`<p><b>Formula.</b> $$R_s=\frac{2B_{bb}}{1+\alpha},\qquad R_b=R_s\log_2 M=2R_s,\qquad \eta=\frac{R_b}{B_{RF}},$$ where $B_{RF}=R_s(1+\alpha)$ and QPSK has $\log_2 M=2$.</p>
      <p><b>Substitute.</b> $R_s=\dfrac{2\times6}{1.2}$; $R_b=2R_s$; $B_{RF}=R_s\times1.2$; $\eta=R_b/B_{RF}$.</p>
      <p><b>Compute.</b> $R_s=10$ Msym/s; $R_b=20$ Mbit/s; $B_{RF}=12$ MHz; $\eta=20/12=1.67$ bits/s/Hz.</p>
      <p><b>Explanation.</b> The result matches the theoretical QPSK ceiling $2/(1+\alpha)=2/1.2=1.67$ bits/s/Hz, confirming the arithmetic. Referencing efficiency to the passband width (12 MHz), not the 6 MHz baseband, is the correct convention for a spectral-efficiency figure.</p>` }
    ],
    realWorld: String.raw`<p>Bandwidth is where communications meets economics and law. National regulators auction spectrum in megahertz-wide blocks worth billions, and every emission must fit inside a legally defined spectral mask — measured as occupied bandwidth, not null-to-null — or the device fails type approval. Wi-Fi channels (20/40/80/160 MHz), LTE/5G resource blocks, and satellite transponders are all quoted by bandwidth, and the choice trades data rate against the noise power ($N_0B$) the receiver must swallow, which is why sensitivity and bandwidth appear together in every link budget. RF engineers live by the baseband-to-RF doubling and the Nyquist symbol-rate relation when sizing filters, ADC sample rates (which must clear the two-sided occupied bandwidth), and channelizers. The noise-equivalent bandwidth is what actually sets a radiometer's or receiver's sensitivity. And fractional bandwidth decides antenna feasibility: a cellular whip at under 10% is routine, whereas a multi-octave UWB or spiral antenna is a serious design. Modern SDRs expose all of this directly — you set the sample rate, RRC roll-off, and channel filter, and the same waveform's null-to-null, occupied, and noise bandwidths must all be reconciled against the regulatory mask before you key up.</p>`,
    related: ['comm-basics', 'shannon', 'nyquist-sampling', 'sinc-function', 'pulse-shaping', 'rrc-filter', 'frequency-spectrum', 'noise']
  },
  {
    id: 'early-late-correlator',
    title: 'Early-Late Gate & Prompt Correlator',
    category: 'Synchronization',
    tags: ['early-late', 'code-tracking', 'dll', 'timing-recovery', 'correlator', 'gps', 'discriminator', 's-curve'],
    summary: String.raw`The early-late gate tracks symbol or code timing by correlating the received signal against Early, Prompt, and Late replicas and driving a delay-locked loop with the Early−Late discriminator, whose S-curve is zero exactly at perfect alignment.`,
    diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr-early-late-correlator" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <text x="18" y="115" fill="#9aa7b5">rx code</text>
  <rect x="90" y="20" width="120" height="38" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="150" y="43" fill="#e6edf3" text-anchor="middle">Early corr</text>
  <rect x="90" y="96" width="120" height="38" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="150" y="119" fill="#e6edf3" text-anchor="middle">Prompt (data)</text>
  <rect x="90" y="172" width="120" height="38" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="150" y="195" fill="#e6edf3" text-anchor="middle">Late corr</text>
  <circle cx="285" cy="39" r="16" fill="#1c232e" stroke="#b197fc"/>
  <text x="285" y="44" fill="#e6edf3" text-anchor="middle">−</text>
  <text x="285" y="18" fill="#9aa7b5" text-anchor="middle">E−L</text>
  <rect x="330" y="20" width="95" height="38" rx="6" fill="#1c232e" stroke="#b197fc"/>
  <text x="377" y="43" fill="#e6edf3" text-anchor="middle">loop filter</text>
  <rect x="450" y="20" width="75" height="38" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="487" y="38" fill="#e6edf3" text-anchor="middle">code</text>
  <text x="487" y="52" fill="#9aa7b5" text-anchor="middle">NCO</text>
  <line x1="60" y1="110" x2="88" y2="42" stroke="#9aa7b5" marker-end="url(#arr-early-late-correlator)"/>
  <line x1="60" y1="112" x2="88" y2="115" stroke="#9aa7b5" marker-end="url(#arr-early-late-correlator)"/>
  <line x1="60" y1="114" x2="88" y2="188" stroke="#9aa7b5" marker-end="url(#arr-early-late-correlator)"/>
  <line x1="210" y1="39" x2="268" y2="39" stroke="#9aa7b5" marker-end="url(#arr-early-late-correlator)"/>
  <line x1="210" y1="191" x2="285" y2="55" stroke="#9aa7b5" marker-end="url(#arr-early-late-correlator)"/>
  <line x1="301" y1="39" x2="328" y2="39" stroke="#9aa7b5" marker-end="url(#arr-early-late-correlator)"/>
  <line x1="425" y1="39" x2="448" y2="39" stroke="#9aa7b5" marker-end="url(#arr-early-late-correlator)"/>
  <path d="M487,58 L487,150 L152,150 L152,134" fill="none" stroke="#9aa7b5" stroke-dasharray="3 3" marker-end="url(#arr-early-late-correlator)"/>
  <text x="360" y="145" fill="#9aa7b5" text-anchor="middle">adjust replica timing</text>
  <text x="150" y="225" fill="#9aa7b5" text-anchor="middle">S-curve E−L = 0 at perfect alignment; Prompt despreads the data</text>
</svg>`,
      caption: String.raw`Early-late mechanism: Early, Prompt, Late correlators feed an E−L discriminator through a loop filter to a code NCO that adjusts replica timing.`
    },
    {
      title: String.raw`S-curve discriminator`,
      svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr2-early-late-correlator" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <line x1="40" y1="120" x2="510" y2="120" stroke="#9aa7b5" marker-end="url(#arr2-early-late-correlator)"/>
  <text x="500" y="138" fill="#9aa7b5">τ (timing error)</text>
  <line x1="270" y1="220" x2="270" y2="20" stroke="#9aa7b5" marker-end="url(#arr2-early-late-correlator)"/>
  <text x="282" y="28" fill="#9aa7b5">D = E−L</text>
  <path d="M120,190 Q170,185 200,150 Q245,120 270,120 Q295,120 340,90 Q370,55 420,50" fill="none" stroke="#4dabf7" stroke-width="2"/>
  <circle cx="270" cy="120" r="6" fill="#63e6be"/>
  <text x="300" y="145" fill="#63e6be">lock: D=0</text>
  <line x1="200" y1="150" x2="340" y2="90" stroke="#ffa94d" stroke-dasharray="4 3"/>
  <text x="360" y="150" fill="#ffa94d">slope K_D</text>
  <text x="150" y="180" fill="#b197fc">early (L&gt;E)</text>
  <text x="380" y="80" fill="#b197fc">late (E&gt;L)</text>
  <line x1="200" y1="205" x2="340" y2="205" stroke="#9aa7b5" marker-end="url(#arr2-early-late-correlator)"/>
  <line x1="340" y1="205" x2="200" y2="205" stroke="#9aa7b5" marker-end="url(#arr2-early-late-correlator)"/>
  <text x="270" y="225" fill="#9aa7b5" text-anchor="middle">linear pull-in ≈ ±(1−d/2) chips</text>
</svg>`,
      caption: String.raw`The Early−Late discriminator S-curve: an odd function of timing error τ that crosses zero at perfect alignment (the stable lock point). Its origin slope K_D sets the loop gain; the loop drives D→0.`
    },
    {
      title: String.raw`GPS code-tracking loop`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr3-early-late-correlator" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <rect x="15" y="80" width="80" height="45" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="55" y="100" fill="#e6edf3" text-anchor="middle">Code gen</text>
  <text x="55" y="116" fill="#9aa7b5" text-anchor="middle">C/A replica</text>
  <rect x="130" y="25" width="90" height="34" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="175" y="47" fill="#e6edf3" text-anchor="middle">Early corr</text>
  <rect x="130" y="86" width="90" height="34" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="175" y="108" fill="#e6edf3" text-anchor="middle">Prompt</text>
  <rect x="130" y="147" width="90" height="34" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="175" y="169" fill="#e6edf3" text-anchor="middle">Late corr</text>
  <rect x="255" y="60" width="95" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/>
  <text x="302" y="78" fill="#e6edf3" text-anchor="middle">Discrim.</text>
  <text x="302" y="93" fill="#9aa7b5" text-anchor="middle">E²−L²</text>
  <rect x="380" y="60" width="70" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/>
  <text x="415" y="84" fill="#e6edf3" text-anchor="middle">Loop filt</text>
  <rect x="460" y="60" width="65" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="492" y="84" fill="#e6edf3" text-anchor="middle">Code NCO</text>
  <line x1="95" y1="95" x2="128" y2="45" stroke="#9aa7b5" marker-end="url(#arr3-early-late-correlator)"/>
  <line x1="95" y1="100" x2="128" y2="103" stroke="#9aa7b5" marker-end="url(#arr3-early-late-correlator)"/>
  <line x1="95" y1="105" x2="128" y2="162" stroke="#9aa7b5" marker-end="url(#arr3-early-late-correlator)"/>
  <line x1="220" y1="42" x2="253" y2="72" stroke="#9aa7b5" marker-end="url(#arr3-early-late-correlator)"/>
  <line x1="220" y1="164" x2="253" y2="90" stroke="#9aa7b5" marker-end="url(#arr3-early-late-correlator)"/>
  <line x1="350" y1="80" x2="378" y2="80" stroke="#9aa7b5" marker-end="url(#arr3-early-late-correlator)"/>
  <line x1="450" y1="80" x2="458" y2="80" stroke="#9aa7b5" marker-end="url(#arr3-early-late-correlator)"/>
  <path d="M492,100 L492,195 L55,195 L55,125" fill="none" stroke="#9aa7b5" stroke-dasharray="3 3" marker-end="url(#arr3-early-late-correlator)"/>
  <text x="270" y="190" fill="#9aa7b5" text-anchor="middle">NCO steers the code generator; Prompt output = pseudorange + nav data</text>
</svg>`,
      caption: String.raw`GPS code-tracking chain: the code generator makes Early/Prompt/Late C/A replicas, three correlators feed a (noncoherent E²−L²) discriminator, a loop filter, and a code NCO that closes the loop by steering the generator. The Prompt code phase becomes the pseudorange.`
    }
    ],
    prerequisites: ['correlation', 'matched-filter', 'pll', 'pn-codes'],
    intro: String.raw`<p>A coherent receiver recovers <em>carrier</em> phase with a PLL/Costas loop, but it must independently recover <em>timing</em>: the precise instant to sample each symbol, or the exact code phase of a spreading sequence. Sampling even a fraction of a symbol early or late collapses the eye and destroys the matched-filter SNR. The <strong>early-late gate</strong> (and its code-tracking cousin, the <strong>delay-locked loop, DLL</strong>) is the classic feedback mechanism that finds and holds that instant.</p>
<p>The idea is beautifully symmetric. The matched-filter/correlation output as a function of timing offset is a peak — triangular for a chip/symbol, a raised-cosine-like hump for shaped pulses. You cannot measure "am I at the peak?" directly because the peak is flat to first order. Instead you probe <em>either side</em>: correlate with an <strong>Early</strong> replica advanced by half a chip and a <strong>Late</strong> replica delayed by half a chip. If Early and Late correlations are equal you are centred; if Early &gt; Late you are late and must advance; if Late &gt; Early you are early and must retard. The difference Early−Late is a <strong>discriminator</strong> whose characteristic (the S-curve) crosses zero at perfect alignment and has the right slope to close a tracking loop. The <strong>Prompt</strong> correlator sits at the centre and delivers the actual data/despread output. This structure — three correlators, a discriminator, a loop filter, and a numerically controlled oscillator (NCO) adjusting the replica timing — is exactly a PLL redrawn in the timing domain, and it is the beating heart of every GPS receiver and most symbol synchronizers.</p>`,
    sections: [
      {
        h: 'The problem: finding the peak of the correlation',
        html: String.raw`<p>Let $R(\tau)$ be the correlation between the received signal and a locally generated reference (code or pulse) as a function of timing error $\tau$ (the misalignment between local and incoming timing). For a matched filter, $R(\tau)$ is the autocorrelation of the pulse; for a PN spreading code it is the code's autocorrelation, ideally a sharp triangle of base $\pm1$ chip and peak at $\tau=0$.</p>
<p>The despread/demodulated SNR is maximized at $\tau=0$, the peak. The naive approach — hill-climb to the maximum — fails because near the peak $dR/d\tau\to0$: the signal gives you almost no gradient information about which way to move, and it cannot tell early from late (the peak is even-symmetric). We need an <strong>odd</strong> error signal: something negative on one side of the peak and positive on the other, crossing zero at $\tau=0$. The early-late construction manufactures exactly that from two symmetric samples of the same even correlation.</p>
<div class="callout"><strong>Key insight:</strong> you cannot track the top of a hill by measuring its height (even, flat at the top). You track it by measuring the <em>difference</em> in height a fixed step to each side — an odd function of position that is zero only at the summit.</div>`
      },
      {
        h: 'Early, Prompt, Late correlators',
        html: String.raw`<p>Three correlators run in parallel against three time-shifted copies of the same reference replica, separated by the <strong>early-late spacing</strong> $d$ (in chips, typically $d=1$ so each gate is $\pm\tfrac12$ chip, though narrow-correlator receivers use $d=0.1$ chip):</p>
<ul>
<li><strong>Early (E):</strong> reference advanced by $d/2$; correlation $R(\tau+d/2)$.</li>
<li><strong>Prompt (P):</strong> reference at the current estimate; correlation $R(\tau)$. This is the on-time output that carries the data and gives the peak lock-quality indicator.</li>
<li><strong>Late (L):</strong> reference delayed by $d/2$; correlation $R(\tau-d/2)$.</li>
</ul>
<p>When the loop is perfectly aligned ($\tau=0$), the correlation is symmetric about the peak, so the Early gate (on the rising side by $d/2$) and the Late gate (on the falling side by $d/2$) yield <em>equal</em> magnitudes: $E=L$. When the receiver's timing is <strong>late</strong> (its replica lags the signal, $\tau>0$ in a common convention), the Early sample climbs higher up the correlation triangle while the Late sample slides down: $E>L$. When it is <strong>early</strong>, $L>E$. Thus the sign of $E-L$ tells the loop which way to nudge the NCO, and the Prompt correlator — always at the current best estimate — is where the despread data comes out at full SNR.</p>
<table class="data">
<tr><th>Timing state</th><th>Relation</th><th>Discriminator $E-L$</th><th>Loop action</th></tr>
<tr><td>Aligned ($\tau=0$)</td><td>$E=L$</td><td>0</td><td>hold</td></tr>
<tr><td>Replica late</td><td>$E>L$</td><td>$>0$</td><td>advance replica</td></tr>
<tr><td>Replica early</td><td>$L>E$</td><td>$<0$</td><td>retard replica</td></tr>
</table>`
      },
      {
        h: 'The discriminator and the S-curve',
        html: String.raw`<p>The <strong>timing discriminator</strong> is the function that maps timing error to error voltage. In its simplest coherent form it is</p>
<p>$$D(\tau)=R(\tau+\tfrac{d}{2})-R(\tau-\tfrac{d}{2}).$$</p>
<p>Plotting $D$ against $\tau$ gives the famous <strong>S-curve</strong>: it passes through zero at $\tau=0$ with a negative-to-positive (or positive-to-negative, depending on sign convention) crossing, rises to a peak, then falls back toward zero outside the pull-in range. Two features matter:</p>
<ul>
<li><strong>Zero crossing at $\tau=0$</strong> — the stable lock point. The loop drives $D\to0$, i.e. timing error to zero.</li>
<li><strong>Slope at the origin</strong> $K_D=dD/d\tau|_0$ — this is the discriminator gain that sets the timing-loop bandwidth and jitter, exactly as $K_d$ does in a PLL. For a triangular chip autocorrelation with spacing $d$, the S-curve is linear over $|\tau|<(1-d/2)$ chips with a well-defined slope.</li>
</ul>
<p>The <strong>linear (pull-in) range</strong> of the S-curve is roughly $\pm(1-d/2)$ chips: outside it the discriminator saturates or reverses, so the loop must first be <em>acquired</em> (coarse search) to within this range before tracking can pull it to zero. A wider gate spacing $d$ gives a larger pull-in range but a shallower, noisier discriminator; a narrow correlator ($d\ll1$) gives a steep, low-noise, multipath-resistant S-curve but a tiny pull-in range that demands accurate prior acquisition.</p>
<div class="callout"><strong>Why "S"?</strong> The discriminator is the difference of two shifted even peaks. Subtracting a right-shifted hump from a left-shifted one produces an odd function that rises through zero and dips on the far side — the characteristic S (or sawtooth-ish) shape whose central zero-crossing is the lock point.</div>`
      },
      {
        h: 'Coherent vs noncoherent discriminators',
        html: String.raw`<p>The simple $E-L$ (amplitude) discriminator is <strong>coherent</strong>: it assumes carrier phase is known so the correlations are real and signed. In practice the timing loop often runs before or independently of full carrier lock, and any residual carrier phase or data-bit sign flips the sign of $E$, $P$, $L$ together — which would corrupt a coherent discriminator. The fix is to remove the sign with an even operation, giving <strong>noncoherent</strong> discriminators:</p>
<ul>
<li><strong>Early-minus-late power (E²−L²):</strong> $D=|E|^2-|L|^2$. Squaring each arm removes the carrier phase and data sign; the difference of powers is still zero at alignment and odd about it. This is the classic noncoherent DLL discriminator.</li>
<li><strong>Early-minus-late envelope:</strong> $D=|E|-|L|$ (magnitudes), similar behaviour with slightly different noise.</li>
<li><strong>Dot-product (normalized):</strong> $D=(E-L)\cdot P /|P|^2$ using the prompt correlator to normalize out signal amplitude and improve linearity — common in GPS.</li>
</ul>
<p>Noncoherent discriminators pay a small <strong>squaring loss</strong> (noise×noise self-terms, as in the Costas loop) but are robust to unknown carrier phase and to the ±1 data modulating the code. Coherent discriminators are used once carrier lock is solid and yield the best timing jitter. The choice mirrors the coherent/noncoherent split in carrier recovery: strip the unknowns with an even nonlinearity at the cost of a threshold penalty.</p>
<p>$$\text{coherent: } D=E-L\qquad\qquad \text{noncoherent: } D=E^2-L^2\ \text{or}\ |E|-|L|.$$</p>`
      },
      {
        h: 'The Delay-Locked Loop (DLL) structure',
        html: String.raw`<p>Wrapping the discriminator in feedback gives the <strong>delay-locked loop</strong>, the timing-domain twin of the PLL:</p>
<ul>
<li><strong>Discriminator</strong> (phase detector analogue): forms $D(\tau)$ from E and L correlators — gain $K_D$ (volts per chip).</li>
<li><strong>Loop filter</strong> $F(s)$: smooths the discriminator noise and sets loop order/bandwidth/damping, identical in role to a PLL loop filter. A first-order filter gives a type-1 DLL; adding an integrator makes it type-2, driving steady-state timing error to zero even under a constant code-rate (Doppler) offset.</li>
<li><strong>Code/timing NCO</strong> (VCO analogue): a numerically controlled oscillator that generates the local code clock; its rate is nudged by the loop filter output. The NCO integrates rate into phase, so it is the $1/s$ integrator of the loop — making even a first-order DLL type-1, exactly as the VCO does in a PLL.</li>
</ul>
<p>Because the block diagram is structurally identical to a PLL, all the PLL machinery transfers: closed-loop transfer $H(s)=G/(1+G)$, second-order natural frequency $\omega_n$ and damping $\zeta$, one-sided loop noise bandwidth $B_L$, and the bandwidth-versus-noise trade-off. The timing jitter variance at lock is $\sigma_\tau^2\propto B_L/(C/N_0)$ scaled by the discriminator's noise characteristics and (for noncoherent) the squaring loss. A wide DLL tracks fast code Doppler and acquires quickly but is noisy; a narrow DLL gives low jitter but is slow and vulnerable to dynamics — the same design tension as the PLL.</p>
<div class="callout"><strong>Carrier-aiding:</strong> in GNSS the (much more sensitive) carrier-tracking loop's Doppler estimate is fed forward to the code NCO, so the DLL only has to correct residual code error. This lets the code loop bandwidth be very narrow (low jitter, high sensitivity) while still following high dynamics — a standard, powerful trick.</div>`
      },
      {
        h: 'Symbol timing recovery vs GPS code tracking',
        html: String.raw`<p>The same early-late/DLL principle appears in two guises:</p>
<ul>
<li><strong>Symbol timing recovery:</strong> in a PSK/QAM modem the "code" is the transmit pulse and the correlation is the matched-filter output. An early-late gate samples the matched-filter output slightly before and after the nominal symbol instant; $E-L$ (or the Gardner/Mueller-Müller variants, which are early-late relatives) drives an interpolator/NCO to place the sampling instant on the peak of the pulse. This recovers the symbol clock without a separate pilot.</li>
<li><strong>Code tracking (DSSS/GPS):</strong> the reference is the PN spreading sequence. After acquisition places the local code within $\pm\tfrac12$ chip, the DLL's early-late correlators keep the local replica aligned to the incoming code to a small fraction of a chip. In GPS this code-phase measurement, converted to range, is the pseudorange that underlies positioning — so DLL tracking accuracy directly limits position accuracy. The Prompt correlator simultaneously despreads the signal and demodulates the navigation data.</li>
</ul>
<p><strong>Multipath and the narrow correlator:</strong> a reflected (delayed) copy adds a shifted correlation triangle that distorts the S-curve and biases the zero crossing, causing ranging error. Using a narrow early-late spacing ($d=0.1$ chip instead of 1) confines the discriminator to the sharp central peak, largely rejecting multipath whose delay exceeds $d/2$ — the reason high-precision GNSS receivers use narrow correlators, at the cost of a smaller pull-in range that leans on good acquisition and carrier aiding.</p>`
      },
      {
        h: 'Relation to matched filtering and the PLL/FLL family',
        html: String.raw`<p>The early-late gate is not a separate theory bolted on — it is the tracking layer built directly on top of the matched-filter/correlation operation. The Prompt correlator <em>is</em> the matched filter, giving the optimal decision statistic at the correct sampling instant; the Early and Late correlators are just the same matched filter evaluated at offset lags to sense the slope of the correlation peak. In that sense the early-late discriminator is a finite-difference estimate of the derivative of the correlation function, $D(\tau)\approx d\,\dfrac{dR}{d\tau}$, and pushing $D\to0$ is equivalent to finding where the correlation's derivative vanishes — the peak.</p>
<p>Structurally it belongs to the same feedback-loop family as the carrier loops:</p>
<table class="data">
<tr><th>Loop</th><th>Tracks</th><th>Detector</th><th>Actuator</th></tr>
<tr><td>PLL</td><td>carrier phase</td><td>phase detector ($\sin\phi$)</td><td>VCO/NCO (phase)</td></tr>
<tr><td>FLL</td><td>carrier frequency</td><td>frequency discriminator</td><td>VCO/NCO (frequency)</td></tr>
<tr><td>DLL / early-late</td><td>code/symbol timing</td><td>early-late discriminator (S-curve)</td><td>code NCO (timing)</td></tr>
</table>
<p>A complete GNSS or coherent-DSSS receiver runs all three concurrently: an FLL/PLL for carrier, a DLL for code, with carrier aiding the code loop. The mathematics of each is the same second-order loop with $\omega_n$, $\zeta$, and $B_L$ — only the detector's physical meaning (phase, frequency, or timing error) changes. Master the PLL and the early-late gate is the same machine measuring a different error.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>The whole mechanism grows from one obstacle and one clever fix. The obstacle: the correlation peak you want to sit on is <em>flat and even</em>, so you cannot climb it. The fix: probe both sides and subtract. Carry these away:</p>
<ul>
<li><strong>Why an odd error signal.</strong> Near the peak $dR/d\tau\to0$ and $R$ is even — no gradient, no early/late sense. The Early−Late difference manufactures an <em>odd</em> discriminator that is zero only at alignment.</li>
<li><strong>Three correlators, one job each.</strong> Early ($+d/2$) and Late ($-d/2$) sense the slope; Prompt (on-time) is the matched filter that despreads data and indicates lock. At alignment $E=L$; $E>L$ means the replica is late (advance it), $L>E$ means early (retard).</li>
<li><strong>The S-curve.</strong> $D(\tau)=R(\tau+d/2)-R(\tau-d/2)$ crosses zero at $\tau=0$ with slope $K_D$ (the loop gain) and a linear pull-in range of about $\pm(1-d/2)$ chips. It is essentially a finite-difference estimate of $dR/d\tau$, so nulling it finds the peak.</li>
<li><strong>Coherent vs noncoherent.</strong> $E-L$ needs known carrier phase; $E^2-L^2$ or $|E|-|L|$ square out unknown phase and data sign at the cost of squaring loss — used before carrier lock is firm.</li>
<li><strong>It is a PLL in disguise.</strong> Discriminator + loop filter + code NCO = the DLL, structurally identical to a PLL (the NCO is the $1/s$ integrator). All the PLL machinery transfers: $\omega_n$, $\zeta$, $B_L$, and $\sigma_\tau^2\propto B_L/(C/N_0)$.</li>
<li><strong>Why it matters.</strong> Narrow spacing ($d\approx0.1$ chip) sharpens the S-curve and rejects multipath but shrinks pull-in, leaning on good acquisition and carrier aiding. In GPS the Prompt code phase becomes the pseudorange, so DLL jitter and multipath bias directly limit position accuracy.</li>
</ul>
<div class="callout tip">One line to keep: you cannot track the top of a hill by its height — you track it by the <em>difference in height a step to each side</em>. That difference is the S-curve, and wrapping it in a loop (the DLL) is a PLL measuring timing instead of phase.</div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://gssc.esa.int/navipedia/index.php/Delay_Lock_Loop_(DLL)" target="_blank" rel="noopener">ESA Navipedia — Delay Lock Loop (DLL)</a> — authoritative GNSS reference on the early/prompt/late correlators, the early-minus-late discriminator, and the S-curve.</li>
<li><a href="https://www.mathworks.com/help/satcom/ug/gps-receiver-acquisition-and-tracking-using-ca-code.html" target="_blank" rel="noopener">MathWorks — GPS Receiver Acquisition and Tracking Using C/A-Code</a> — worked software-receiver example implementing the early-late DLL and carrier loops end to end.</li>
<li><a href="https://ocw.tudelft.nl/wp-content/uploads/Readings_lecture_3_-_GPS_receiver_Architecture_and_Measurements_01.pdf" target="_blank" rel="noopener">TU Delft OCW — GPS Receiver Architecture and Measurements</a> — lecture notes situating the code tracking loop within a full receiver and deriving the pseudorange.</li>
<li><a href="https://en.wikipedia.org/wiki/Matched_filter" target="_blank" rel="noopener">Wikipedia — Matched filter</a> — the correlation/matched-filter foundation the prompt correlator implements and the early-late gate tracks.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Timing recovery finds the peak of the correlation/matched-filter output; the peak is even (flat on top), so you cannot climb it directly — you need an odd error signal.`,
      String.raw`Three correlators run in parallel: Early (advanced $d/2$), Prompt (on-time, carries data), Late (delayed $d/2$), separated by the early-late spacing $d$.`,
      String.raw`At perfect alignment Early and Late correlations are equal ($E=L$); the sign of $E-L$ tells the loop whether it is early or late.`,
      String.raw`The discriminator $D(\tau)=R(\tau+d/2)-R(\tau-d/2)$ has an S-curve: zero at $\tau=0$, with slope $K_D$ setting the loop gain, and a linear pull-in range of about $\pm(1-d/2)$ chips.`,
      String.raw`Coherent discriminator $E-L$ needs known carrier phase; noncoherent forms $E^2-L^2$ or $|E|-|L|$ remove carrier phase and data sign at a small squaring-loss penalty.`,
      String.raw`The Delay-Locked Loop (DLL) = discriminator + loop filter + code NCO — structurally identical to a PLL, with the NCO as the $1/s$ integrator.`,
      String.raw`All PLL machinery transfers: $H(s)=G/(1+G)$, second-order $\omega_n$ and $\zeta$, one-sided noise bandwidth $B_L$; timing jitter $\sigma_\tau^2\propto B_L/(C/N_0)$.`,
      String.raw`Narrow early-late spacing ($d\approx0.1$ chip) sharpens the S-curve and rejects multipath but shrinks the pull-in range, requiring good acquisition and carrier aiding.`,
      String.raw`The Prompt correlator is the matched filter at the correct instant — it despreads/demodulates at full SNR and serves as the lock indicator.`,
      String.raw`In GPS the DLL's code-phase estimate becomes the pseudorange, so tracking jitter and multipath bias directly limit position accuracy.`,
      String.raw`Acquisition (coarse search) must place timing within the S-curve's linear range before the DLL can pull it to zero; tracking is a fine, closed-loop refinement.`,
      String.raw`Carrier aiding feeds the carrier loop's Doppler to the code NCO, letting the DLL bandwidth be very narrow (low jitter) while still following high dynamics.`
    ],
    equations: [
      {
        title: String.raw`Correlation as a function of timing error`,
        tex: String.raw`$$R(\tau)=\frac{1}{T}\int_0^{T} r(t)\,c(t-\tau)\,dt$$`,
        derivation: String.raw`<p><b>Where we start.</b> The receiver multiplies the incoming signal $r(t)$ (containing the transmitted pulse or code $c(t)$) by a locally generated reference $c(t-\tau)$ misaligned by timing error $\tau$, and integrates over one symbol/code period $T$.</p><p><b>Step 1 — write the correlator output.</b> $$R(\tau)=\frac{1}{T}\int_0^{T} r(t)\,c(t-\tau)\,dt.$$ This is exactly a matched-filter output sampled at lag $\tau$; the $1/T$ normalizes to a per-symbol average.</p><p><b>Step 2 — noise-free signal.</b> With $r(t)=A\,c(t)$ (ignoring carrier and noise), $$R(\tau)=\frac{A}{T}\int_0^{T} c(t)\,c(t-\tau)\,dt=A\,\rho(\tau),$$ where $\rho(\tau)$ is the reference's autocorrelation.</p><p><b>Step 3 — shape of $\rho$.</b> For a rectangular chip of width $T_c$, $\rho(\tau)$ is a triangle: $\rho(\tau)=1-|\tau|/T_c$ for $|\tau|\le T_c$, else 0 (for the isolated-peak part of a PN code). It peaks at $\tau=0$ and is <em>even</em>.</p><p><b>Result.</b> $$R(\tau)=A\,\rho(\tau),\ \text{peak at }\tau=0.$$ Because $\rho$ is even and flat-topped, tracking the peak requires probing its slope with offset samples — the early-late idea.</p>`
      },
      {
        title: String.raw`Early-late (coherent) discriminator`,
        tex: String.raw`$$D(\tau)=R\!\left(\tau+\tfrac{d}{2}\right)-R\!\left(\tau-\tfrac{d}{2}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> We have an even correlation peak $R(\tau)$ and want an <em>odd</em> error signal that is zero only at $\tau=0$.</p><p><b>Step 1 — sample symmetrically.</b> Take an Early sample advanced by $d/2$ and a Late sample delayed by $d/2$: $$E=R(\tau+\tfrac d2),\qquad L=R(\tau-\tfrac d2).$$</p><p><b>Step 2 — subtract.</b> Form the difference $$D(\tau)=E-L=R(\tau+\tfrac d2)-R(\tau-\tfrac d2).$$ Because $R$ is even, $D(-\tau)=R(-\tau+\tfrac d2)-R(-\tau-\tfrac d2)=R(\tau-\tfrac d2)-R(\tau+\tfrac d2)=-D(\tau)$ — so $D$ is odd, exactly what a loop needs.</p><p><b>Step 3 — zero and slope.</b> At $\tau=0$, symmetry gives $E=L\Rightarrow D=0$. For small $\tau$, Taylor-expand: $$D(\tau)\approx\Big[R(\tfrac d2)+\tau R'(\tfrac d2)\Big]-\Big[R(-\tfrac d2)-\tau R'(-\tfrac d2)... \Big]\approx 2R'(\tfrac d2)\,\tau,$$ i.e. $D\approx K_D\,\tau$ with discriminator gain $K_D=2R'(d/2)$.</p><p><b>Result.</b> $$D(\tau)=E-L\approx K_D\,\tau.$$ The discriminator is locally linear in timing error — an odd S-curve through the origin whose slope $K_D$ closes the tracking loop.</p>`
      },
      {
        title: String.raw`Noncoherent early-minus-late power discriminator`,
        tex: String.raw`$$D_{nc}(\tau)=|E|^2-|L|^2$$`,
        derivation: String.raw`<p><b>Where we start.</b> With unknown carrier phase $\theta$ and data sign $b=\pm1$, each correlator output is scaled by $b\,e^{j\theta}$: $E=b\,e^{j\theta}R(\tau+\tfrac d2)$, $L=b\,e^{j\theta}R(\tau-\tfrac d2)$. A coherent $E-L$ would flip sign with $b$ and rotate with $\theta$ — unusable.</p><p><b>Step 1 — remove the phase and sign by squaring.</b> Take the squared magnitude of each arm: $$|E|^2=|b|^2|e^{j\theta}|^2R^2(\tau+\tfrac d2)=R^2(\tau+\tfrac d2),$$ and similarly $|L|^2=R^2(\tau-\tfrac d2)$. Both $b^2=1$ and $|e^{j\theta}|=1$ vanish.</p><p><b>Step 2 — difference of powers.</b> $$D_{nc}(\tau)=|E|^2-|L|^2=R^2(\tau+\tfrac d2)-R^2(\tau-\tfrac d2).$$</p><p><b>Step 3 — check the S-curve.</b> $R^2$ is still even, so $D_{nc}$ is still odd and zero at $\tau=0$; near the origin $D_{nc}\approx 2R(\tfrac d2)R'(\tfrac d2)\cdot 2\tau$, again linear with a well-defined slope.</p><p><b>Result.</b> $$D_{nc}=|E|^2-|L|^2,$$ robust to unknown carrier phase and data modulation. The price is squaring loss — noise×noise self-terms degrade the loop SNR — so it is used when carrier phase is uncertain, and the coherent $E-L$ once carrier lock is firm.</p>`
      },
      {
        title: String.raw`Discriminator slope for a triangular chip autocorrelation`,
        tex: String.raw`$$K_D=\frac{dD}{d\tau}\Big|_{0}=\frac{2}{T_c}\quad(d=T_c,\ \text{ideal triangle})$$`,
        derivation: String.raw`<p><b>Where we start.</b> Take the ideal chip autocorrelation $R(\tau)=1-|\tau|/T_c$ for $|\tau|\le T_c$, and standard one-chip spacing $d=T_c$ (gates at $\pm T_c/2$).</p><p><b>Step 1 — evaluate Early and Late near lock.</b> For small $\tau$ (both samples on their respective slopes): $$E=R(\tau+\tfrac{T_c}{2})=1-\frac{\tfrac{T_c}{2}+\tau}{T_c}=\tfrac12-\frac{\tau}{T_c},$$ $$L=R(\tau-\tfrac{T_c}{2})=1-\frac{\tfrac{T_c}{2}-\tau}{T_c}=\tfrac12+\frac{\tau}{T_c}.$$ (Using $|\tau\pm T_c/2|=T_c/2\pm\tau$ for small $\tau$.)</p><p><b>Step 2 — form the discriminator.</b> $$D(\tau)=E-L=\Big(\tfrac12-\tfrac{\tau}{T_c}\Big)-\Big(\tfrac12+\tfrac{\tau}{T_c}\Big)=-\frac{2\tau}{T_c}.$$</p><p><b>Step 3 — read off the slope.</b> $$K_D=\frac{dD}{d\tau}=-\frac{2}{T_c},$$ magnitude $2/T_c$. (The sign just fixes the feedback polarity.)</p><p><b>Result.</b> $$|K_D|=\frac{2}{T_c}.$$ The linear S-curve runs over roughly $|\tau|<T_c/2$; a narrower spacing $d<T_c$ steepens $K_D$ (lower jitter, more multipath rejection) but shrinks the linear range.</p>`
      },
      {
        title: String.raw`DLL as a second-order loop (natural frequency and damping)`,
        tex: String.raw`$$\omega_n=\sqrt{\frac{K_D K_{NCO}}{\tau_1}},\qquad \zeta=\frac{\omega_n\tau_2}{2}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The DLL has discriminator gain $K_D$ (volts/chip), a lag-lead loop filter $F(s)=(1+s\tau_2)/(s\tau_1)$, and a code NCO of gain $K_{NCO}$ (chip-rate per volt) that integrates rate into code phase — an $1/s$ block.</p><p><b>Step 1 — open-loop gain.</b> Following the PLL template, the forward path in the timing domain is $$G(s)=K_D\,F(s)\,\frac{K_{NCO}}{s}.$$ The $1/s$ is the NCO integrator (rate$\to$phase), the timing-domain analogue of the VCO.</p><p><b>Step 2 — closed loop.</b> With unity feedback, $$H(s)=\frac{G}{1+G}=\frac{K_DK_{NCO}(1+s\tau_2)/(s\tau_1)}{s+K_DK_{NCO}(1+s\tau_2)/(s\tau_1)}.$$ Multiplying through by $s\tau_1$ gives the standard second-order denominator $s^2+2\zeta\omega_n s+\omega_n^2$.</p><p><b>Step 3 — identify parameters.</b> Matching coefficients, $$\omega_n=\sqrt{\frac{K_DK_{NCO}}{\tau_1}},\qquad 2\zeta\omega_n=\frac{K_DK_{NCO}\tau_2}{\tau_1}\Rightarrow\zeta=\frac{\omega_n\tau_2}{2}.$$</p><p><b>Result.</b> $$\omega_n=\sqrt{\frac{K_DK_{NCO}}{\tau_1}},\ \ \zeta=\frac{\omega_n\tau_2}{2}.$$ Identical in form to the PLL — the DLL is a PLL with a timing discriminator, so the noise bandwidth $B_L=\tfrac{\omega_n}{2}(\zeta+\tfrac{1}{4\zeta})$ and all trade-offs carry over.</p>`
      },
      {
        title: String.raw`Timing jitter at lock`,
        tex: String.raw`$$\sigma_\tau^2 \approx \frac{d\,B_L}{2\,(C/N_0)}\left(1+\frac{2}{(2-d)\,T_{coh}\,(C/N_0)}\right)T_c^2$$`,
        derivation: String.raw`<p><b>Where we start.</b> Thermal noise perturbs the Early and Late correlator outputs, so the discriminator zero-crossing wanders, producing a random timing error whose variance we estimate (noncoherent early-late DLL).</p><p><b>Step 1 — noise on the discriminator.</b> The loop passes noise within its one-sided bandwidth $B_L$. The error variance scales as (noise power in the loop)/(discriminator slope)$^2$: $$\sigma_\tau^2\propto\frac{N_{loop}}{K_D^2}\propto\frac{B_L}{(C/N_0)K_D^2}.$$</p><p><b>Step 2 — insert the slope.</b> With $K_D\propto 1/(d\,T_c)$-scaled sensitivity, the thermal term becomes proportional to $d\,B_L/(C/N_0)$ (narrower spacing $d$ lowers jitter through the steeper slope), giving the leading factor $\dfrac{dB_L}{2(C/N_0)}$ in units of chips$^2$.</p><p><b>Step 3 — squaring-loss correction.</b> The noncoherent $E^2-L^2$ discriminator adds a noise×noise term, the bracketed factor $\big(1+\tfrac{2}{(2-d)T_{coh}(C/N_0)}\big)$, which grows near threshold (low $C/N_0$) — this is the squaring loss, negligible at high $C/N_0$.</p><p><b>Result.</b> $$\sigma_\tau^2\approx\frac{dB_L}{2(C/N_0)}\Big(1+\frac{2}{(2-d)T_{coh}(C/N_0)}\Big)T_c^2.$$ Jitter falls with narrower spacing $d$, narrower loop bandwidth $B_L$, and higher $C/N_0$ — the same levers as PLL phase jitter, plus the multipath benefit of small $d$.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does an early-late gate track, and why can't you just hill-climb the correlation peak?`, back: String.raw`It tracks symbol/code timing. The correlation peak is even and flat on top ($dR/d\tau\to0$), giving no gradient and no early/late sense; you need an odd error signal, which E−L provides.` },
      { front: String.raw`Name the three correlators and their roles.`, back: String.raw`Early (advanced $d/2$) and Late (delayed $d/2$) sense the slope for the discriminator; Prompt (on-time) despreads/demodulates the data at full SNR and indicates lock.` },
      { front: String.raw`What is the timing discriminator and its S-curve?`, back: String.raw`$D(\tau)=R(\tau+d/2)-R(\tau-d/2)$, an odd function crossing zero at $\tau=0$ (lock) with slope $K_D$; the S-shaped plot's central zero is the stable lock point.` },
      { front: String.raw`When the receiver's replica is late, which is bigger, E or L?`, back: String.raw`Early > Late ($E>L$), so $D>0$; the loop advances the replica to reduce timing error.` },
      { front: String.raw`Coherent vs noncoherent discriminator — when and why?`, back: String.raw`Coherent $E-L$ needs known carrier phase. Noncoherent $E^2-L^2$ or $|E|-|L|$ squares out unknown phase and data sign, at the cost of squaring loss; used before/independent of carrier lock.` },
      { front: String.raw`What is the DLL and its three blocks?`, back: String.raw`Delay-Locked Loop: discriminator (phase-detector analogue) + loop filter + code NCO (VCO analogue that integrates rate into timing). Structurally identical to a PLL.` },
      { front: String.raw`Which block is the DLL's integrator, making even a first-order loop type-1?`, back: String.raw`The code/timing NCO — it integrates code rate into code phase ($1/s$), exactly as the VCO does in a PLL.` },
      { front: String.raw`What does the early-late spacing $d$ trade off?`, back: String.raw`Large $d$: wide pull-in range but shallow, noisy S-curve. Narrow $d$ (e.g. 0.1 chip): steep, low-jitter, multipath-resistant S-curve but tiny pull-in range needing good acquisition/aiding.` },
      { front: String.raw`Why do high-precision GNSS receivers use narrow correlators?`, back: String.raw`A narrow spacing confines the discriminator to the sharp central peak, rejecting multipath whose delay exceeds $d/2$ and reducing the ranging bias it causes.` },
      { front: String.raw`How does the early-late output relate to the correlation's derivative?`, back: String.raw`$D(\tau)=R(\tau+d/2)-R(\tau-d/2)\approx d\cdot dR/d\tau$ — a finite-difference estimate of the slope; driving $D\to0$ finds where the derivative (hence the peak) is zero.` },
      { front: String.raw`What is carrier aiding in a GNSS code loop?`, back: String.raw`The carrier loop's Doppler estimate is fed forward to the code NCO, so the DLL only corrects residual code error, allowing a very narrow (low-jitter) code loop that still follows high dynamics.` },
      { front: String.raw`How does DLL timing jitter depend on $B_L$ and $C/N_0$?`, back: String.raw`$\sigma_\tau^2\propto B_L/(C/N_0)$ (scaled by spacing and squaring loss) — narrower loop bandwidth and higher $C/N_0$ reduce jitter, exactly like PLL phase jitter.` },
      { front: String.raw`Where does the despread data and pseudorange come from in a GPS receiver?`, back: String.raw`The Prompt correlator despreads and demodulates the navigation data; the DLL's code-phase estimate becomes the pseudorange used for positioning.` },
      { front: String.raw`How is the early-late gate related to the PLL and FLL?`, back: String.raw`Same second-order feedback loop ($\omega_n$, $\zeta$, $B_L$); only the detector differs — PLL tracks phase, FLL frequency, DLL/early-late tracks timing.` },
      { front: String.raw`What is the linear pull-in range of a one-chip-spaced S-curve?`, back: String.raw`Roughly $\pm(1-d/2)$ chips ($\approx\pm0.5$ chip for $d=1$); outside it the discriminator saturates/reverses, so acquisition must first get within range.` },
      { front: String.raw`What is the Prompt correlator's dual role at lock?`, back: String.raw`It is the matched filter at the correct instant — delivering the optimal data decision statistic and, via its peak magnitude, serving as the lock-quality indicator.` }
    ],
    mcqs: [
      { q: String.raw`Why can't a timing loop simply climb to the top of the correlation peak?`, options: [String.raw`The peak is too sharp`, String.raw`The peak is even and flat on top, giving no slope or early/late direction`, String.raw`The correlation is always negative`, String.raw`Noise removes the peak`], answer: 1, explain: String.raw`Near the peak $dR/d\tau\to0$ and $R$ is even, so height gives neither gradient nor sense of direction; an odd $E-L$ discriminator is needed.` },
      { q: String.raw`In an early-late gate, the Prompt correlator's job is to:`, options: [String.raw`Form the discriminator`, String.raw`Despread/demodulate the data at full SNR and indicate lock`, String.raw`Advance the replica`, String.raw`Estimate carrier frequency`], answer: 1, explain: String.raw`Prompt is the on-time matched filter; Early and Late form the discriminator, Prompt carries the data and lock indication.` },
      { q: String.raw`The coherent timing discriminator is:`, options: [String.raw`$R(\tau)$`, String.raw`$R(\tau+d/2)-R(\tau-d/2)$`, String.raw`$R(\tau)^2$`, String.raw`$R(\tau+d/2)+R(\tau-d/2)$`], answer: 1, explain: String.raw`The Early minus Late difference is odd, zero at $\tau=0$, and locally linear — the S-curve.` },
      { q: String.raw`If Early correlation exceeds Late ($E>L$), the receiver timing is:`, options: [String.raw`Early; retard the replica`, String.raw`Late; advance the replica`, String.raw`Perfectly aligned`, String.raw`Lost`], answer: 1, explain: String.raw`$E>L\Rightarrow D>0$, indicating the replica lags the signal (late); the loop advances it toward alignment.` },
      { q: String.raw`The noncoherent early-late discriminator $E^2-L^2$ is preferred when:`, options: [String.raw`Carrier phase is perfectly known`, String.raw`Carrier phase/data sign are unknown, because squaring removes them`, String.raw`The SNR is infinite`, String.raw`There is no multipath`], answer: 1, explain: String.raw`Squaring each arm cancels $e^{j\theta}$ and $b=\pm1$, giving a discriminator robust to unknown phase and data, at a squaring-loss cost.` },
      { q: String.raw`In the DLL, the block acting as the loop's $1/s$ integrator is the:`, options: [String.raw`Discriminator`, String.raw`Loop filter`, String.raw`Code/timing NCO`, String.raw`Prompt correlator`], answer: 2, explain: String.raw`The NCO integrates code rate into code phase, the timing-domain analogue of the PLL's VCO.` },
      { q: String.raw`Reducing the early-late spacing from $d=1$ to $d=0.1$ chip primarily:`, options: [String.raw`Widens the pull-in range`, String.raw`Sharpens the S-curve and improves multipath rejection but shrinks pull-in range`, String.raw`Removes the need for a loop filter`, String.raw`Eliminates thermal noise`], answer: 1, explain: String.raw`A narrow correlator confines the discriminator to the sharp peak (better jitter and multipath rejection) but its linear range and pull-in shrink, demanding good acquisition/aiding.` },
      { q: String.raw`In a GPS receiver, the DLL's code-phase estimate is used to compute the:`, options: [String.raw`Carrier frequency`, String.raw`Pseudorange (hence position)`, String.raw`Bit error rate`, String.raw`Antenna gain`], answer: 1, explain: String.raw`Code phase converts to signal travel time and thus pseudorange, the basis of GNSS positioning; DLL jitter/multipath bias directly limit accuracy.` },
      { q: String.raw`The early-late discriminator can be interpreted as estimating the:`, options: [String.raw`Peak height of the correlation`, String.raw`Derivative (slope) of the correlation function`, String.raw`Carrier phase`, String.raw`Noise floor`], answer: 1, explain: String.raw`$D(\tau)=R(\tau+d/2)-R(\tau-d/2)\approx d\,dR/d\tau$ is a finite difference; nulling it locates where the slope (and thus the peak) is zero.` },
      { q: String.raw`Carrier aiding of a code (DLL) loop allows:`, options: [String.raw`A wider code-loop bandwidth only`, String.raw`A very narrow code-loop bandwidth (low jitter) while still following dynamics`, String.raw`Removal of the discriminator`, String.raw`Elimination of the carrier loop`], answer: 1, explain: String.raw`Feeding the carrier loop's Doppler to the code NCO leaves only residual error for the DLL, so its bandwidth can be narrow for low jitter/high sensitivity while dynamics are handled by the aiding.` },
      { q: String.raw`The DLL, PLL and FLL differ chiefly in their:`, options: [String.raw`Loop-filter mathematics`, String.raw`Detector (timing, phase, or frequency error) — the loop structure is the same`, String.raw`Number of integrators`, String.raw`Need for an NCO`], answer: 1, explain: String.raw`All are second-order feedback loops with $\omega_n$, $\zeta$, $B_L$; only the error detector's physical meaning changes.` },
      { q: String.raw`The S-curve's linear (pull-in) range for one-chip spacing is approximately:`, options: [String.raw`$\pm2$ chips`, String.raw`$\pm0.5$ chip`, String.raw`$\pm5$ chips`, String.raw`Unbounded`], answer: 1, explain: String.raw`For $d=1$ the linear region is about $\pm(1-d/2)=\pm0.5$ chip; acquisition must place timing within this before tracking pulls it to zero.` },
      { q: String.raw`DLL timing jitter variance is reduced by:`, options: [String.raw`Widening the loop bandwidth and lowering $C/N_0$`, String.raw`Narrowing $B_L$, using a narrower spacing $d$, and raising $C/N_0$`, String.raw`Removing the Prompt correlator`, String.raw`Increasing the data rate`], answer: 1, explain: String.raw`$\sigma_\tau^2\propto dB_L/(C/N_0)$: narrower loop bandwidth, narrower spacing, and higher carrier-to-noise density all lower jitter.` },
      { q: String.raw`The Prompt correlator at lock is equivalent to:`, options: [String.raw`A frequency discriminator`, String.raw`The matched filter sampled at the optimal instant`, String.raw`A phase detector`, String.raw`A noise generator`], answer: 1, explain: String.raw`On-time, it realizes the matched-filter output at the correct sampling instant, giving the optimal (max-SNR) decision statistic.` }
    ],
    numericals: [
      { q: String.raw`A DSSS system has chip rate 1.023 Mchip/s (GPS C/A), so $T_c=977.5$ ns. With one-chip spacing, find the discriminator slope magnitude $K_D$ (per second of timing error) for the ideal triangular autocorrelation.`, solution: String.raw`<p><b>Formula.</b> $$|K_D|=\frac{2}{T_c},$$ the origin slope of the Early−Late S-curve for an ideal triangular chip autocorrelation with one-chip spacing, where $T_c$ is the chip duration.</p>
      <p><b>Substitute.</b> $|K_D|=\dfrac{2}{977.5\times10^{-9}\text{ s}}$.</p>
      <p><b>Compute.</b> $|K_D|=2.046\times10^{6}$ per second $=2.046$ per microsecond; in chip units simply $2$ per chip.</p>
      <p><b>Explanation.</b> A 0.1-chip timing error thus produces a normalized $D=0.2$ — a strong, unambiguous correction signal. The steeper $K_D$, the lower the timing jitter, which is why narrowing the spacing (raising the effective slope) is the lever for precision tracking.</p>` },
      { q: String.raw`For a narrow correlator with spacing $d=0.1$ chip, the maximum tolerable prior timing error (linear range) is about $\pm(1-d/2)$ chip? Interpret, and give the range in nanoseconds for GPS C/A.`, solution: String.raw`<p><b>Formula.</b> $$\text{linear range}\approx\pm\left(1-\frac{d}{2}\right)\text{ chip},\qquad \text{narrow pull-in}\approx\pm\frac{d}{2}\text{ chip},$$ then convert chips to time via $\times T_c$ ($T_c=977.5$ ns for GPS C/A).</p>
      <p><b>Substitute.</b> Linear range $=\pm(1-0.05)$; useful narrow pull-in $=\pm0.05$ chip $\times977.5$ ns.</p>
      <p><b>Compute.</b> The <em>linear</em> range is $\pm0.95$ chip, but the useful <em>narrow-correlator pull-in</em> — where the two tight gates still cleanly straddle the peak — is only about $\pm0.05$ chip $=\pm48.9$ ns.</p>
      <p><b>Explanation.</b> Beyond $\pm0.05$ chip the acquisition (search) stage must already have delivered alignment. This tiny pull-in is exactly why narrow correlators buy their multipath rejection and low jitter at the price of depending on good acquisition and carrier aiding.</p>` },
      { q: String.raw`A DLL uses $K_D=2$/chip, $K_{NCO}=1$ chip/s per volt, and a loop filter with $\tau_1=0.01$ s, $\tau_2=0.02$ s. Find $\omega_n$ and $\zeta$.`, solution: String.raw`<p><b>Formula.</b> $$\omega_n=\sqrt{\frac{K_D K_{NCO}}{\tau_1}},\qquad \zeta=\frac{\omega_n\tau_2}{2},$$ the second-order natural frequency and damping of the DLL, identical in form to a PLL.</p>
      <p><b>Substitute.</b> $\omega_n=\sqrt{\dfrac{2\times1}{0.01}}=\sqrt{200}$; $\zeta=\dfrac{\omega_n\times0.02}{2}$.</p>
      <p><b>Compute.</b> $\omega_n=14.14$ rad/s; $\zeta=14.14\times0.02/2=0.141$.</p>
      <p><b>Explanation.</b> With $\zeta=0.141$ the loop is badly under-damped and will ring. Raising $\tau_2$ to $0.1$ s would give $\zeta=0.707$ — the standard critically-well-damped target — showing how the loop filter zero sets the damping.</p>` },
      { q: String.raw`A code loop has one-sided noise bandwidth $B_L=1$ Hz, $C/N_0=40$ dB-Hz, spacing $d=1$ chip. Estimate the RMS code jitter (chips), ignoring squaring loss.`, solution: String.raw`<p><b>Formula.</b> $$\sigma_\tau^2\approx\frac{d\,B_L}{2\,(C/N_0)}\ \text{chip}^2,\qquad \sigma_\tau=\sqrt{\sigma_\tau^2},$$ the thermal-noise timing-jitter variance of the DLL (squaring loss neglected).</p>
      <p><b>Substitute.</b> Convert $C/N_0=40$ dB-Hz $=10^{4.0}=10^4$ Hz. Then $\sigma_\tau^2=\dfrac{1\times1}{2\times10^4}$.</p>
      <p><b>Compute.</b> $\sigma_\tau^2=5\times10^{-5}$ chip$^2$, so $\sigma_\tau=7.07\times10^{-3}$ chip. For GPS C/A one chip $=293$ m of range, giving $0.00707\times293\approx2.1$ m RMS ranging noise from thermal jitter alone.</p>
      <p><b>Explanation.</b> A couple of metres of thermal ranging noise at a strong $40$ dB-Hz is typical, and it scales as $\sqrt{B_L/(C/N_0)}$ — narrower loop bandwidth and higher carrier-to-noise density both tighten it, exactly like PLL phase jitter.</p>` },
      { q: String.raw`Repeat the previous jitter estimate at threshold $C/N_0=25$ dB-Hz with a narrow spacing $d=0.1$ and coherent integration $T_{coh}=20$ ms, now including squaring loss.`, solution: String.raw`<p><b>Formula.</b> $$\sigma_\tau^2\approx\frac{d\,B_L}{2\,(C/N_0)}\left(1+\frac{2}{(2-d)\,T_{coh}\,(C/N_0)}\right)\text{chip}^2,$$ the noncoherent-DLL jitter with the bracketed squaring-loss correction.</p>
      <p><b>Substitute.</b> $C/N_0=10^{2.5}=316$ Hz. Thermal term $=\dfrac{0.1\times1}{2\times316}$; squaring-loss factor $=1+\dfrac{2}{1.9\times0.02\times316}$.</p>
      <p><b>Compute.</b> Thermal $=1.58\times10^{-4}$; squaring factor $=1+0.167=1.167$; so $\sigma_\tau^2=1.58\times10^{-4}\times1.167=1.84\times10^{-4}$ chip$^2$, $\sigma_\tau=0.0136$ chip.</p>
      <p><b>Explanation.</b> Even at the $25$ dB-Hz threshold the narrow $d=0.1$ spacing keeps jitter to $\sim0.014$ chip, though squaring loss now adds about 17%. This is the weak-signal regime where the noise×noise self-term of the $E^2-L^2$ discriminator starts to bite.</p>` },
      { q: String.raw`A symbol synchronizer uses an early-late gate on the matched-filter output at 10 Msym/s. If the loop must hold timing error under 2% of a symbol, what timing accuracy is that in ps?`, solution: String.raw`<p><b>Formula.</b> $$T=\frac{1}{R_s},\qquad \Delta t=0.02\,T,$$ the symbol period and the 2%-of-symbol timing budget.</p>
      <p><b>Substitute.</b> $T=\dfrac{1}{10\times10^6\text{ s}^{-1}}$; $\Delta t=0.02\times T$.</p>
      <p><b>Compute.</b> $T=100$ ns; $\Delta t=0.02\times100=2$ ns $=2000$ ps.</p>
      <p><b>Explanation.</b> The DLL loop bandwidth and $C/N_0$ must be chosen so the RMS jitter $\sigma_\tau<2$ ns; since $\sigma_\tau^2\propto B_L/(C/N_0)$, this directly caps $B_L$ for the available SNR — the concrete design constraint behind a "2% timing error" spec.</p>` },
      { q: String.raw`Multipath adds a replica delayed by 0.3 chip. Explain quantitatively why a $d=0.1$ narrow correlator is nearly immune while a $d=1$ wide correlator is biased.`, solution: String.raw`<p><b>Formula.</b> $$\text{gate reach}=\pm\frac{d}{2}\ \text{chip};\quad \text{multipath at delay }\tau_m\text{ distorts the S-curve only if }\tau_m<\frac{d}{2}+\text{(peak width)}.$$</p>
      <p><b>Substitute.</b> Wide $d=1$: gates reach $\pm0.5$ chip. Narrow $d=0.1$: gates reach $\pm0.05$ chip. Compare each to $\tau_m=0.3$ chip.</p>
      <p><b>Compute.</b> For $d=1$, the $0.3$-chip multipath triangle overlaps the Late gate (inside $\pm0.5$), shifting the S-curve zero and biasing the estimate. For $d=0.1$, the gates reach only $\pm0.05$ chip, so the $0.3$-chip multipath falls entirely outside the gated region and cannot distort the central discriminator.</p>
      <p><b>Explanation.</b> A narrow correlator is nearly immune to any multipath whose delay exceeds $\approx d/2$ plus the peak half-width — the quantitative reason high-precision GNSS receivers use $d=0.1$ chip to combat urban multipath ranging bias.</p>` },
      { q: String.raw`Show numerically that the noncoherent $E^2-L^2$ discriminator has zero output at perfect alignment. Use the triangular autocorrelation with $d=1$ chip.`, solution: String.raw`<p><b>Formula.</b> $$D_{nc}=|E|^2-|L|^2,\qquad E=R(\tau+\tfrac{d}{2}),\ L=R(\tau-\tfrac{d}{2}),\qquad R(\tau)=1-|\tau|\ (|\tau|\le1),$$ the noncoherent power discriminator on the triangular chip autocorrelation.</p>
      <p><b>Substitute.</b> At $\tau=0$, $d=1$: $E=R(+0.5)$, $L=R(-0.5)$. Then perturb to $\tau=+0.05$: $E=R(0.55)$, $L=R(-0.45)$.</p>
      <p><b>Compute.</b> At $\tau=0$: $E=1-0.5=0.5$, $L=0.5$, so $E^2-L^2=0.25-0.25=0$. At $\tau=+0.05$: $E=0.45$, $L=0.55$, so $E^2-L^2=0.2025-0.3025=-0.10\ne0$.</p>
      <p><b>Explanation.</b> The discriminator is exactly zero at alignment (the lock point) and negative for a positive timing error, i.e. it drives the loop back toward $\tau=0$ — confirming both the zero-crossing and the restoring (negative-feedback) slope that make the S-curve a stable lock.</p>` }
    ],
    realWorld: String.raw`<p>The early-late gate is one of the most widely deployed synchronization structures in existence. Every GPS/GNSS receiver runs a delay-locked loop per satellite channel: after the acquisition engine coarsely aligns the local C/A or P(Y) code, the DLL's Early/Prompt/Late correlators keep the replica locked to a small fraction of a chip, and the resulting code phase becomes the pseudorange feeding the position solution. Modern receivers use narrow correlators (0.1 chip) and multipath-estimating variants precisely because DLL timing bias from reflections is a dominant error in urban positioning. The very same principle recovers the symbol clock in cable and satellite modems, in every SDR symbol synchronizer (Gardner and Mueller-Müller timing-error detectors are early-late relatives operating on the matched-filter output), and in optical and disk read channels. In GNU Radio and similar frameworks the structure is a handful of DSP blocks — three correlators, a discriminator, a loop filter, and an NCO/interpolator — tuned by loop bandwidth and damping exactly like a PLL. In high-dynamics or weak-signal receivers (spacecraft, defense), carrier-aided narrow DLLs achieve sub-metre code tracking at carrier-to-noise densities where an unaided loop would break lock, illustrating how the timing loop, carrier loop, and matched filter operate as one tightly coupled system.</p>`,
    related: ['pll', 'fll', 'costas-loop', 'correlation', 'matched-filter', 'dsss', 'pn-codes', 'processing-gain']
  },
  {
    id: 'polarization',
    title: 'Polarization',
    category: 'Antennas & Electromagnetics',
    tags: ['polarization', 'circular-polarization', 'axial-ratio', 'faraday-rotation', 'plf', 'cross-pol', 'diversity'],
    summary: String.raw`Polarization is the time-varying orientation of a wave's electric field — linear, circular, or elliptical — and matching it between transmit and receive antennas is essential, with the polarization loss factor $\mathrm{PLF}=|\cos\psi|^2$ quantifying the penalty for a mismatch.`,
    diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr-polarization" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <line x1="120" y1="115" x2="120" y2="30" stroke="#4dabf7" stroke-width="2" marker-end="url(#arr-polarization)"/>
  <text x="120" y="22" fill="#4dabf7" text-anchor="middle">Ey</text>
  <line x1="120" y1="115" x2="205" y2="115" stroke="#63e6be" stroke-width="2" marker-end="url(#arr-polarization)"/>
  <text x="215" y="119" fill="#63e6be">Ex</text>
  <text x="120" y="150" fill="#9aa7b5" text-anchor="middle">two orthogonal E-components</text>
  <text x="120" y="168" fill="#9aa7b5" text-anchor="middle">(amplitude ratio + phase δ)</text>
  <ellipse cx="400" cy="105" rx="90" ry="45" fill="#b197fc" fill-opacity="0.10" stroke="#b197fc" stroke-width="2" transform="rotate(-25 400 105)"/>
  <line x1="335" y1="135" x2="465" y2="75" stroke="#ffa94d" stroke-dasharray="4 3"/>
  <line x1="378" y1="66" x2="422" y2="144" stroke="#ffa94d" stroke-dasharray="4 3"/>
  <path d="M470,80 A90,45 0 0 1 455,130" fill="none" stroke="#b197fc" marker-end="url(#arr-polarization)"/>
  <text x="400" y="55" fill="#ffa94d" text-anchor="middle">E_max / E_min = AR</text>
  <text x="400" y="185" fill="#e6edf3" text-anchor="middle">polarization ellipse</text>
  <line x1="240" y1="105" x2="300" y2="105" stroke="#9aa7b5" marker-end="url(#arr-polarization)"/>
  <text x="270" y="98" fill="#9aa7b5" text-anchor="middle">δ, Ey/Ex</text>
  <text x="270" y="215" fill="#9aa7b5" text-anchor="middle">δ=0→linear (V/H); Ex=Ey, δ=±90°→circular; else elliptical</text>
</svg>`,
      caption: String.raw`Polarization mechanism: two orthogonal E-components (Ex, Ey) with relative phase δ set the polarization ellipse — linear (V/H), circular, or elliptical.`
    },
    {
      title: String.raw`Mismatch-loss geometry (PLF = cos²ψ)`,
      svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr2-polarization" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <line x1="150" y1="200" x2="150" y2="40" stroke="#4dabf7" stroke-width="2" marker-end="url(#arr2-polarization)"/>
  <text x="150" y="32" fill="#4dabf7" text-anchor="middle">wave E</text>
  <line x1="150" y1="200" x2="255" y2="70" stroke="#ffa94d" stroke-width="2" marker-end="url(#arr2-polarization)"/>
  <text x="265" y="66" fill="#ffa94d">antenna ρ_a</text>
  <path d="M150,120 A80,80 0 0 1 178,133" fill="none" stroke="#9aa7b5"/>
  <text x="182" y="115" fill="#9aa7b5">ψ</text>
  <line x1="150" y1="200" x2="150" y2="115" stroke="#63e6be" stroke-width="3" stroke-dasharray="5 3"/>
  <text x="95" y="105" fill="#63e6be">E·cosψ</text>
  <text x="150" y="222" fill="#9aa7b5" text-anchor="middle">captured field = projection onto antenna axis</text>
  <rect x="330" y="55" width="185" height="120" rx="6" fill="#1c232e" stroke="#b197fc"/>
  <text x="422" y="80" fill="#e6edf3" text-anchor="middle">PLF = cos²ψ</text>
  <text x="422" y="104" fill="#9aa7b5" text-anchor="middle">ψ=0° → 1 (0 dB)</text>
  <text x="422" y="126" fill="#9aa7b5" text-anchor="middle">ψ=45° → 0.5 (−3 dB)</text>
  <text x="422" y="148" fill="#9aa7b5" text-anchor="middle">ψ=90° → 0 (isolated)</text>
  <text x="422" y="168" fill="#63e6be" text-anchor="middle">cross-pol → XPD 25–35 dB</text>
</svg>`,
      caption: String.raw`Polarization mismatch: the antenna captures only the projection E·cosψ of the wave onto its own axis, so power scales as PLF=cos²ψ — 0 dB aligned, −3 dB at 45°, complete rejection at 90°. Residual leakage between orthogonal polarizations is set by the cross-pol isolation (XPD).`
    },
    {
      title: String.raw`Dual-pol frequency reuse`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <defs><marker id="arr3-polarization" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
  <rect x="15" y="30" width="90" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="60" y="55" fill="#e6edf3" text-anchor="middle">Stream A</text>
  <rect x="15" y="140" width="90" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="60" y="165" fill="#e6edf3" text-anchor="middle">Stream B</text>
  <rect x="150" y="30" width="95" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
  <text x="197" y="50" fill="#e6edf3" text-anchor="middle">V (or RHCP)</text>
  <text x="197" y="65" fill="#9aa7b5" text-anchor="middle">same f</text>
  <rect x="150" y="140" width="95" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/>
  <text x="197" y="160" fill="#e6edf3" text-anchor="middle">H (or LHCP)</text>
  <text x="197" y="175" fill="#9aa7b5" text-anchor="middle">same f</text>
  <rect x="300" y="85" width="110" height="45" rx="6" fill="#1c232e" stroke="#b197fc"/>
  <text x="355" y="105" fill="#e6edf3" text-anchor="middle">Dual-pol</text>
  <text x="355" y="121" fill="#9aa7b5" text-anchor="middle">channel</text>
  <rect x="440" y="85" width="90" height="45" rx="6" fill="#1c232e" stroke="#ffa94d"/>
  <text x="485" y="105" fill="#e6edf3" text-anchor="middle">separate</text>
  <text x="485" y="121" fill="#9aa7b5" text-anchor="middle">by XPD</text>
  <line x1="105" y1="50" x2="148" y2="50" stroke="#9aa7b5" marker-end="url(#arr3-polarization)"/>
  <line x1="105" y1="160" x2="148" y2="160" stroke="#9aa7b5" marker-end="url(#arr3-polarization)"/>
  <line x1="245" y1="50" x2="300" y2="95" stroke="#9aa7b5" marker-end="url(#arr3-polarization)"/>
  <line x1="245" y1="160" x2="300" y2="120" stroke="#9aa7b5" marker-end="url(#arr3-polarization)"/>
  <line x1="410" y1="107" x2="438" y2="107" stroke="#9aa7b5" marker-end="url(#arr3-polarization)"/>
  <text x="270" y="200" fill="#9aa7b5" text-anchor="middle">two orthogonal polarizations carry two streams on one frequency — 2× capacity</text>
</svg>`,
      caption: String.raw`Dual-polarization frequency reuse: two independent streams share the same frequency on orthogonal polarizations (V/H or RHCP/LHCP) and are separated at the receiver, doubling spectral efficiency — limited by the cross-polarization discrimination (XPD).`
    }
    ],
    prerequisites: ['maxwell', 'antenna', 'antenna-gain', 'link-budget'],
    intro: String.raw`<p>An electromagnetic wave is a transverse oscillation: its electric field $\vec E$ points perpendicular to the direction of travel and oscillates in time. <strong>Polarization</strong> describes how the tip of that $\vec E$ vector moves as the wave passes a fixed point — whether it stays on a line (linear), traces a circle (circular), or sweeps an ellipse (elliptical). It is a property as fundamental as frequency or amplitude, and getting it wrong can cost you 3, 20, or even an infinite number of decibels of received signal.</p>
<p>Polarization matters because antennas are polarization-sensitive: a receive antenna only captures the component of the incoming field aligned with its own polarization. A vertical dipole is deaf to a horizontally polarized wave; a right-hand circular antenna rejects a left-hand circular wave. This lets engineers <em>reuse</em> the same frequency twice (vertical and horizontal, or LHCP and RHCP) to double capacity, gives satellites immunity to the random rotation their signals suffer crossing the ionosphere, and provides a diversity dimension that MIMO and dual-pol radar exploit. This topic builds polarization from Maxwell's transverse fields, shows how the relative phase and amplitude of two orthogonal components set the polarization state, defines the axial ratio and cross-pol figures engineers actually measure, derives the polarization loss factor, and explains Faraday rotation and why satellites overwhelmingly choose circular polarization.</p>`,
    sections: [
      {
        h: 'The E-field orientation: transverse waves and two components',
        html: String.raw`<p>From Maxwell's equations, a plane wave travelling in $+z$ has $\vec E$ and $\vec B$ both perpendicular to $z$ (transverse). Any such $\vec E$ can be decomposed into two orthogonal components — conventionally horizontal ($x$) and vertical ($y$):</p>
<p>$$\vec E(z,t)=\hat x\,E_x\cos(\omega t-kz)+\hat y\,E_y\cos(\omega t-kz+\delta),$$</p>
<p>where $E_x,E_y$ are the two amplitudes and $\delta$ is the phase by which the $y$-component leads the $x$-component. Remarkably, these two numbers — the amplitude ratio $E_y/E_x$ and the phase difference $\delta$ — completely determine the polarization state. Everything else is a special case:</p>
<ul>
<li>$\delta=0$ or $\pi$ (in phase or anti-phase): the two components rise and fall together, so $\vec E$ stays on a fixed line — <strong>linear polarization</strong> tilted at angle $\arctan(E_y/E_x)$.</li>
<li>$E_x=E_y$ and $\delta=\pm90^\circ$: equal amplitudes in quadrature make the tip trace a <strong>circle</strong> — circular polarization.</li>
<li>Any other combination: the tip traces an <strong>ellipse</strong> — the general elliptical polarization, of which linear and circular are the limiting cases.</li>
</ul>
<div class="callout"><strong>Core idea:</strong> polarization is entirely encoded in the relative amplitude and relative phase of two orthogonal field components. Two knobs — $E_y/E_x$ and $\delta$ — generate every possible polarization state.</div>`
      },
      {
        h: 'Linear polarization (vertical, horizontal, slant)',
        html: String.raw`<p>When the two components are in phase ($\delta=0$) or exactly out of phase ($\delta=\pi$), the resultant field oscillates along a single fixed direction. The <strong>polarization angle</strong> is $\tau=\arctan(E_y/E_x)$: purely vertical ($E_x=0$), purely horizontal ($E_y=0$), or slant (e.g. $45^\circ$ when $E_x=E_y$, $\delta=0$).</p>
<p>Two linear polarizations are <strong>orthogonal</strong> if their planes are $90^\circ$ apart (V and H, or $+45^\circ$ and $-45^\circ$). Orthogonal polarizations do not couple: a horizontally polarized wave induces no current in a vertical dipole (ideally). This orthogonality is the basis of <strong>frequency reuse by polarization</strong> — a satellite can transmit two independent data streams on the same frequency, one on V and one on H, and a dual-polarized receiver separates them, doubling spectral efficiency. The practical limit is <strong>cross-polarization discrimination (XPD)</strong>: real antennas and channels leak a little of each polarization into the other, and XPD (typically 25–35 dB for good antennas) sets how well the two streams stay separated.</p>
<table class="data">
<tr><th>Linear state</th><th>$E_x$</th><th>$E_y$</th><th>$\delta$</th><th>Angle $\tau$</th></tr>
<tr><td>Horizontal</td><td>$A$</td><td>0</td><td>—</td><td>$0^\circ$</td></tr>
<tr><td>Vertical</td><td>0</td><td>$A$</td><td>—</td><td>$90^\circ$</td></tr>
<tr><td>Slant $+45^\circ$</td><td>$A$</td><td>$A$</td><td>$0$</td><td>$45^\circ$</td></tr>
<tr><td>Slant $-45^\circ$</td><td>$A$</td><td>$A$</td><td>$\pi$</td><td>$-45^\circ$</td></tr>
</table>`
      },
      {
        h: 'Circular and elliptical polarization; handedness',
        html: String.raw`<p>Set the two components equal in amplitude and $90^\circ$ apart in phase ($E_x=E_y$, $\delta=\pm90^\circ$). Now as time advances, when $E_x$ is maximum $E_y$ is zero and vice versa, so the resultant vector has constant magnitude but rotates — the tip traces a <strong>circle</strong>. The sense of rotation defines <strong>handedness</strong>:</p>
<ul>
<li><strong>Right-hand circular polarization (RHCP):</strong> looking along the direction of propagation (away from you), $\vec E$ rotates clockwise ($\delta=-90^\circ$ in the IEEE convention). Curl the right hand's fingers in the rotation sense; the thumb points along propagation.</li>
<li><strong>Left-hand circular polarization (LHCP):</strong> counter-clockwise rotation ($\delta=+90^\circ$).</li>
</ul>
<p>RHCP and LHCP are orthogonal — an RHCP antenna rejects an LHCP wave (ideally infinite isolation), giving another frequency-reuse pair. If the amplitudes are unequal <em>or</em> the phase is not exactly $\pm90^\circ$, the circle becomes an <strong>ellipse</strong> — the general case. Linear ($\delta=0$, tip on a line — an infinitely thin ellipse) and circular ($E_x=E_y$, $\delta=\pm90^\circ$ — a perfect circle) are the two extremes of the elliptical continuum. Any polarization can be written as a sum of two orthogonal circular (or two orthogonal linear) components — a decomposition used throughout antenna analysis.</p>
<div class="callout"><strong>Handedness pitfall:</strong> the IEEE convention (used in antennas/comms) defines handedness looking <em>in the direction of propagation</em>; the optics convention looks <em>toward the source</em>, giving the opposite name for the same wave. Always state which convention you mean. In IEEE terms, GPS transmits RHCP.</div>`
      },
      {
        h: 'Axial ratio: how "circular" is circular?',
        html: String.raw`<p>Real "circularly polarized" antennas are never perfect; their polarization ellipse has a major axis $E_{max}$ and minor axis $E_{min}$. The <strong>axial ratio (AR)</strong> quantifies the deviation from a perfect circle:</p>
<p>$$\mathrm{AR}=\frac{E_{max}}{E_{min}}\ \ (\ge1),\qquad \mathrm{AR_{dB}}=20\log_{10}\frac{E_{max}}{E_{min}}.$$</p>
<ul>
<li><strong>AR = 1 (0 dB):</strong> perfect circular polarization — the ellipse is a circle.</li>
<li><strong>AR = ∞:</strong> perfect linear polarization — the ellipse collapses to a line.</li>
<li><strong>AR ≤ 3 dB</strong> is the usual engineering criterion for a "good enough" circularly polarized antenna; the AR bandwidth (frequency range over which AR stays below 3 dB) is a key CP antenna spec.</li>
</ul>
<p>Axial ratio matters because a wave with imperfect AR partly couples into the wrong-handed antenna, causing a polarization mismatch loss even between two nominally co-polarized (both RHCP) links. A transmit AR of $r_t$ and receive AR of $r_r$ produce a worst-case additional loss; when both are near 1, the loss is small, but a 3 dB AR on each side can cost around 0.5 dB, and larger ARs cost more. AR also degrades off-boresight: many CP antennas are near-perfect on axis but become increasingly elliptical toward the beam edges.</p>`
      },
      {
        h: 'Polarization loss factor (PLF) and antenna matching',
        html: String.raw`<p>The received power depends on how well the incoming wave's polarization matches the receive antenna's polarization. The <strong>polarization loss factor</strong> is the fraction of the available power actually captured. For two <em>linear</em> polarizations misaligned by angle $\psi$:</p>
<p>$$\mathrm{PLF}=|\cos\psi|^2,$$</p>
<p>so aligned ($\psi=0$) gives PLF = 1 (0 dB, no loss), $45^\circ$ gives PLF = 0.5 (−3 dB), and orthogonal ($\psi=90^\circ$) gives PLF = 0 (−∞ dB, complete rejection). The general form uses the (complex) polarization unit vectors of the wave $\hat{\rho}_w$ and antenna $\hat{\rho}_a$:</p>
<p>$$\mathrm{PLF}=|\hat{\rho}_w\cdot\hat{\rho}_a^{*}|^2.$$</p>
<p>This single expression covers every case:</p>
<table class="data">
<tr><th>Wave</th><th>Antenna</th><th>PLF</th><th>Loss</th></tr>
<tr><td>Linear V</td><td>Linear V</td><td>1</td><td>0 dB</td></tr>
<tr><td>Linear V</td><td>Linear H</td><td>0</td><td>∞ (isolated)</td></tr>
<tr><td>Linear (any)</td><td>Circular</td><td>0.5</td><td>−3 dB</td></tr>
<tr><td>RHCP</td><td>RHCP</td><td>1</td><td>0 dB</td></tr>
<tr><td>RHCP</td><td>LHCP</td><td>0</td><td>∞ (isolated)</td></tr>
</table>
<div class="callout"><strong>The universal 3 dB rule:</strong> a circularly polarized antenna receiving <em>any</em> linear wave (or a linear antenna receiving a circular wave) always captures exactly half the power — a fixed −3 dB loss regardless of the linear wave's tilt. This robustness to unknown linear orientation is precisely why circular polarization is so useful when the incoming tilt is unpredictable.</div>`
      },
      {
        h: 'Faraday rotation and why satellites use circular polarization',
        html: String.raw`<p>As a linearly polarized wave passes through the magnetized plasma of the ionosphere, its polarization plane rotates — <strong>Faraday rotation</strong>. The rotation angle scales roughly as</p>
<p>$$\Omega\propto\frac{1}{f^2}\int N_e\,B_{\parallel}\,dl,$$</p>
<p>i.e. inversely with the square of frequency and proportionally to the integrated electron density $N_e$ and the component of the geomagnetic field $B_\parallel$ along the path. At L-band (~1.5 GHz) the rotation can be several to tens of degrees and varies with time of day, solar activity, and geometry; at VHF it can exceed many full turns.</p>
<p>For a <strong>linearly polarized</strong> satellite link this is a disaster: an unpredictable rotation $\Omega$ misaligns the receive antenna by that angle, giving a polarization loss $\mathrm{PLF}=\cos^2\Omega$ that varies uncontrollably — a deep, time-varying fade, potentially to zero when $\Omega=90^\circ$. <strong>Circular polarization is immune:</strong> Faraday rotation merely rotates the ellipse of a circular wave, which (being a circle) is unchanged — an RHCP wave stays RHCP, so an RHCP receiver still captures it with no rotation-induced loss. This immunity is the primary reason GPS/GNSS, most satellite communications, and space telemetry links use circular polarization. Circular polarization also tolerates the unknown and changing orientation of a tumbling spacecraft, a handheld GPS receiver held at any angle, or a mobile terminal — the fixed −3 dB penalty against a linear ground antenna is a small, predictable price for eliminating deep, random polarization fades.</p>`
      },
      {
        h: 'Cross-pol, polarization diversity, and MIMO',
        html: String.raw`<p><strong>Cross-polarization</strong> is the unwanted field component orthogonal to the intended (co-pol) polarization. Every real antenna radiates some cross-pol; the ratio of co-pol to cross-pol power, the <strong>cross-polarization discrimination (XPD)</strong> (or cross-polar ratio, XPR, for the channel), governs how cleanly two orthogonal polarizations can be reused. Rain, especially, depolarizes signals (asymmetric raindrops rotate polarization), degrading XPD on high-frequency satellite links and setting a limit on dual-pol frequency reuse — sometimes requiring adaptive cross-polar cancellation.</p>
<p>Polarization is also a resource to <em>exploit</em>:</p>
<ul>
<li><strong>Polarization diversity:</strong> two orthogonally polarized receive antennas see partly independent fades (multipath scrambles polarization), so combining them mitigates fading — a compact alternative to spatial diversity that needs no antenna separation.</li>
<li><strong>Dual-polarized MIMO:</strong> a single physical antenna structure supports two orthogonal polarizations, providing two spatial streams in one aperture. This is why modern base-station and satellite antennas are almost always dual-polarized (±45° slant is popular) — it doubles capacity or diversity without doubling the antenna footprint.</li>
<li><strong>Polarimetric radar:</strong> transmitting/receiving on both polarizations and measuring the full scattering matrix reveals target shape and orientation (dual-pol weather radar distinguishes rain, hail, and snow by their depolarization signatures).</li>
</ul>
<div class="callout"><strong>Design takeaway:</strong> polarization is simultaneously a hazard to be matched (PLF, Faraday rotation, AR, rain depolarization) and a degree of freedom to be exploited (frequency reuse, diversity, MIMO, polarimetry). Good RF design treats it as a first-class quantity, not an afterthought.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>Everything here flows from one physical fact — a transverse $\vec E$ field has two orthogonal components — and one design consequence: antennas only capture the aligned part. Carry these away:</p>
<ul>
<li><strong>Two knobs make every state.</strong> The amplitude ratio $E_y/E_x$ and relative phase $\delta$ fully specify the polarization ellipse: $\delta=0,\pi$ → linear; $E_x=E_y,\ \delta=\pm90^\circ$ → circular; everything else → elliptical (the general case).</li>
<li><strong>Handedness and orthogonality.</strong> RHCP/LHCP (defined looking along propagation in IEEE) are orthogonal, as are V/H. Orthogonal polarizations do not couple — the basis of frequency reuse.</li>
<li><strong>Two purity/loss numbers.</strong> Axial ratio $\mathrm{AR}=E_{max}/E_{min}$ measures how circular a wave is (0 dB = perfect circle, ∞ = linear; $\le3$ dB is "good CP"). The polarization loss factor $\mathrm{PLF}=|\cos\psi|^2$ (or generally $|\hat\rho_w\cdot\hat\rho_a^*|^2$) sets the mismatch penalty: 0 dB aligned, −3 dB at 45°, −∞ orthogonal.</li>
<li><strong>The universal 3 dB rule.</strong> A circular antenna receiving any linear wave (or vice versa) always loses exactly 3 dB, independent of the linear tilt — a fixed, budgetable price that buys robustness to unknown orientation.</li>
<li><strong>Why satellites go circular.</strong> Faraday rotation ($\Omega\propto f^{-2}\int N_eB_\parallel dl$) rotates a linear wave's plane unpredictably, causing deep fades; a circular wave is immune (rotating a circle leaves it a circle). Hence GPS and most satellite links use CP.</li>
<li><strong>Polarization as a resource.</strong> Orthogonal polarizations double capacity (frequency reuse, limited by XPD ≈ 25–35 dB), and dual-polarized antennas give MIMO streams and diversity in one aperture. Rain depolarization is the main threat to XPD at high frequencies.</li>
</ul>
<div class="callout tip">One line to keep: an antenna captures only the component of $\vec E$ aligned with its own polarization. Match it and you lose nothing; mismatch by $\psi$ and you lose $\cos^2\psi$; go orthogonal and you lose everything — which is precisely why the same orthogonality that <em>hurts</em> a mismatched link is <em>exploited</em> for frequency reuse.</div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Polarization_(waves)" target="_blank" rel="noopener">Wikipedia — Polarization (waves)</a> — thorough treatment of linear, circular, and elliptical states, handedness, and the polarization ellipse.</li>
<li><a href="https://www.antenna-theory.com/basics/polarization.php" target="_blank" rel="noopener">Antenna-Theory.com — Polarization of Waves</a> — clear tutorial deriving axial ratio and the polarization loss factor from the two orthogonal field components.</li>
<li><a href="https://resources.system-analysis.cadence.com/blog/msa2021-the-polarization-loss-factor-in-antenna-communication" target="_blank" rel="noopener">Cadence — The Polarization Loss Factor in Antenna Communication</a> — focused article on PLF, mismatch penalties, and the fixed 3 dB circular-to-linear loss.</li>
<li><a href="https://gssc.esa.int/navipedia/index.php/Ionospheric_Delay" target="_blank" rel="noopener">ESA Navipedia — Ionospheric Delay</a> — GNSS reference on the ionosphere's frequency-squared effects, the backdrop to Faraday rotation and why space links use circular polarization.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Polarization is the time-varying orientation of the wave's $\vec E$ field, transverse to propagation, set entirely by the relative amplitude $E_y/E_x$ and relative phase $\delta$ of two orthogonal components.`,
      String.raw`Linear: $\delta=0$ or $\pi$ (V, H, or slant); circular: $E_x=E_y$ with $\delta=\pm90^\circ$; elliptical: everything else (the general case).`,
      String.raw`Handedness (RHCP/LHCP) is defined looking along propagation in the IEEE convention; RHCP and LHCP are orthogonal, as are V and H.`,
      String.raw`Axial ratio $\mathrm{AR}=E_{max}/E_{min}$ measures polarization purity: AR = 1 (0 dB) is perfect circular, AR = ∞ is perfect linear; AR ≤ 3 dB is the usual "good CP" criterion.`,
      String.raw`Polarization loss factor for linear misalignment $\psi$ is $\mathrm{PLF}=|\cos\psi|^2$: 0 dB aligned, −3 dB at 45°, −∞ (isolated) at 90°.`,
      String.raw`General PLF $=|\hat{\rho}_w\cdot\hat{\rho}_a^*|^2$ using complex polarization vectors covers linear, circular, and elliptical cases uniformly.`,
      String.raw`A circular antenna receiving any linear wave (or vice versa) always loses exactly 3 dB, independent of the linear tilt — robust to unknown orientation.`,
      String.raw`Faraday rotation in the ionosphere rotates a linear wave's plane by $\Omega\propto f^{-2}\int N_eB_\parallel dl$, causing deep time-varying fades on linear satellite links.`,
      String.raw`Circular polarization is immune to Faraday rotation (rotating a circle leaves it a circle), which is why GPS and most satellite links use CP.`,
      String.raw`Cross-polarization discrimination (XPD, ~25–35 dB) limits how well orthogonal polarizations can be reused; rain depolarization degrades it.`,
      String.raw`Orthogonal polarizations enable frequency reuse (V/H or RHCP/LHCP), doubling spectral efficiency with a dual-polarized antenna.`,
      String.raw`Polarization is a diversity/MIMO resource: dual-polarized antennas provide two streams in one aperture, and polarimetric radar reads target shape from depolarization.`
    ],
    equations: [
      {
        title: String.raw`General polarization from two orthogonal components`,
        tex: String.raw`$$\vec E(z,t)=\hat x\,E_x\cos(\omega t-kz)+\hat y\,E_y\cos(\omega t-kz+\delta)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Maxwell's equations for a plane wave in $+z$ force $\vec E$ into the transverse ($x$–$y$) plane. Any transverse vector is a sum of an $\hat x$ and a $\hat y$ part.</p><p><b>Step 1 — write each component as a sinusoid.</b> Each Cartesian component is a travelling cosine with its own amplitude and phase: $$E_x(z,t)=E_x\cos(\omega t-kz),\quad E_y(z,t)=E_y\cos(\omega t-kz+\delta).$$ Here $\delta$ is the phase lead of $y$ over $x$.</p><p><b>Step 2 — eliminate the common phase to get the locus.</b> Fix $z=0$ and let $\phi=\omega t$. Then $E_x/E_x^0=\cos\phi$ and $E_y/E_y^0=\cos(\phi+\delta)=\cos\phi\cos\delta-\sin\phi\sin\delta$. Substituting $\cos\phi=E_x/E_x^0$ and $\sin\phi=\pm\sqrt{1-(E_x/E_x^0)^2}$ and squaring eliminates $\phi$: $$\left(\frac{E_x}{E_x^0}\right)^2+\left(\frac{E_y}{E_y^0}\right)^2-2\frac{E_xE_y}{E_x^0E_y^0}\cos\delta=\sin^2\delta.$$</p><p><b>Step 3 — recognize the conic.</b> This is the equation of an <em>ellipse</em> in the $(E_x,E_y)$ plane — the polarization ellipse. Its shape is set entirely by $E_y^0/E_x^0$ and $\delta$.</p><p><b>Result.</b> The tip of $\vec E$ traces an ellipse; $\delta=0,\pi\Rightarrow$ a line (linear), $E_x^0=E_y^0,\ \delta=\pm90^\circ\Rightarrow$ a circle (circular). Two knobs generate every state.</p>`
      },
      {
        title: String.raw`Condition for circular polarization`,
        tex: String.raw`$$E_x=E_y\ \text{ and }\ \delta=\pm90^\circ\ \Rightarrow\ \text{circular}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Take the general components with equal amplitude $E_x=E_y=A$ and quadrature phase $\delta=-90^\circ$ (IEEE RHCP): $E_x=A\cos\phi$, $E_y=A\cos(\phi-90^\circ)=A\sin\phi$ (using $\phi=\omega t$).</p><p><b>Step 1 — compute the resultant magnitude.</b> $$|\vec E|^2=E_x^2+E_y^2=A^2\cos^2\phi+A^2\sin^2\phi=A^2.$$ The magnitude is <em>constant</em> — independent of time.</p><p><b>Step 2 — compute the direction.</b> The angle of $\vec E$ from the $x$-axis is $$\theta(t)=\arctan\frac{E_y}{E_x}=\arctan\frac{A\sin\phi}{A\cos\phi}=\phi=\omega t.$$ The direction rotates uniformly at $\omega$.</p><p><b>Step 3 — interpret.</b> Constant magnitude + uniformly rotating direction = the tip moves on a circle. The sign of $\delta$ picks the rotation sense: $\delta=-90^\circ$ gives clockwise-looking-along-$z$ (RHCP), $\delta=+90^\circ$ gives LHCP.</p><p><b>Result.</b> $$E_x=E_y,\ \delta=\pm90^\circ\Rightarrow\text{circular (RH or LH)}.$$ Break either condition (unequal amplitude or non-quadrature phase) and the circle becomes an ellipse.</p>`
      },
      {
        title: String.raw`Axial ratio`,
        tex: String.raw`$$\mathrm{AR}=\frac{E_{max}}{E_{min}},\qquad \mathrm{AR_{dB}}=20\log_{10}\mathrm{AR}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The polarization ellipse has a semi-major axis $E_{max}$ and semi-minor axis $E_{min}$; we want a single number for how close to circular it is.</p><p><b>Step 1 — define the ratio.</b> The axial ratio is the ratio of the two axes, taken $\ge1$: $$\mathrm{AR}=\frac{E_{max}}{E_{min}}\ge1.$$</p><p><b>Step 2 — express in dB (field ratio, hence the 20).</b> Because these are field amplitudes (not powers), $$\mathrm{AR_{dB}}=20\log_{10}\frac{E_{max}}{E_{min}}.$$</p><p><b>Step 3 — check the limits.</b> Perfect circle: $E_{max}=E_{min}\Rightarrow\mathrm{AR}=1$ (0 dB). Perfect line: $E_{min}=0\Rightarrow\mathrm{AR}=\infty$. So AR smoothly interpolates the whole elliptical continuum.</p><p><b>Result.</b> $$\mathrm{AR}=E_{max}/E_{min};\ \ 0\ \mathrm{dB}=\text{circular},\ \infty=\text{linear}.$$ The 3 dB criterion (AR ≤ 2 in linear terms) marks an antenna as usably circular; the frequency span meeting it is the AR bandwidth.</p>`
      },
      {
        title: String.raw`Polarization loss factor (linear misalignment)`,
        tex: String.raw`$$\mathrm{PLF}=|\cos\psi|^2$$`,
        derivation: String.raw`<p><b>Where we start.</b> A linearly polarized wave with field $\vec E_w=E\,\hat{\rho}_w$ arrives at a linearly polarized antenna whose polarization unit vector $\hat{\rho}_a$ is tilted by angle $\psi$ from $\hat{\rho}_w$.</p><p><b>Step 1 — the antenna captures only the aligned component.</b> The open-circuit voltage (and hence field the antenna responds to) is proportional to the projection of $\vec E_w$ onto $\hat{\rho}_a$: $$V\propto \vec E_w\cdot\hat{\rho}_a=E\,\hat{\rho}_w\cdot\hat{\rho}_a=E\cos\psi.$$</p><p><b>Step 2 — power is proportional to voltage squared.</b> The received power scales as $|V|^2$, while the maximum (perfectly aligned) power scales as $E^2$. Their ratio is $$\mathrm{PLF}=\frac{P_{rec}}{P_{max}}=\frac{|E\cos\psi|^2}{E^2}=|\cos\psi|^2.$$</p><p><b>Step 3 — evaluate special angles.</b> $\psi=0\Rightarrow\mathrm{PLF}=1$ (0 dB); $\psi=45^\circ\Rightarrow\mathrm{PLF}=\tfrac12$ (−3 dB); $\psi=90^\circ\Rightarrow\mathrm{PLF}=0$ (complete rejection).</p><p><b>Result.</b> $$\mathrm{PLF}=|\cos\psi|^2.$$ The general complex form $\mathrm{PLF}=|\hat{\rho}_w\cdot\hat{\rho}_a^*|^2$ reduces to this for linear-linear and gives $\tfrac12$ for any linear-vs-circular pairing.</p>`
      },
      {
        title: String.raw`General (complex) polarization loss factor`,
        tex: String.raw`$$\mathrm{PLF}=|\hat{\rho}_w\cdot\hat{\rho}_a^{*}|^2$$`,
        derivation: String.raw`<p><b>Where we start.</b> Represent each polarization by a complex unit vector: wave $\hat{\rho}_w=(\hat x+ jr_w\hat y)/\sqrt{1+r_w^2}$ and antenna $\hat{\rho}_a$ similarly, where the imaginary part encodes the quadrature (circular/elliptical) content.</p><p><b>Step 1 — matched-antenna response.</b> Antenna theory shows the received power is maximized when the antenna polarization is the complex conjugate of the wave's, and the captured fraction is the squared magnitude of their Hermitian inner product: $$\mathrm{PLF}=|\hat{\rho}_w\cdot\hat{\rho}_a^{*}|^2.$$ The conjugate is essential: an RHCP wave is optimally received by an RHCP antenna, whose $\hat{\rho}_a^{*}$ then matches $\hat{\rho}_w$.</p><p><b>Step 2 — check linear-linear.</b> Real unit vectors at angle $\psi$: $\hat{\rho}_w\cdot\hat{\rho}_a^*=\cos\psi\Rightarrow\mathrm{PLF}=\cos^2\psi$. Recovers the earlier result.</p><p><b>Step 3 — check circular-circular and linear-circular.</b> RHCP wave $\hat{\rho}_w=(\hat x-j\hat y)/\sqrt2$ into RHCP antenna gives PLF = 1; into LHCP gives 0. A linear wave $\hat x$ into any circular antenna $(\hat x\mp j\hat y)/\sqrt2$ gives $|\,1/\sqrt2\,|^2=\tfrac12$ — the universal −3 dB.</p><p><b>Result.</b> $$\mathrm{PLF}=|\hat{\rho}_w\cdot\hat{\rho}_a^{*}|^2\in[0,1]$$ — one formula for every polarization pairing, reducing to $\cos^2\psi$, 1, 0, or $\tfrac12$ in the familiar special cases.</p>`
      },
      {
        title: String.raw`Faraday rotation angle`,
        tex: String.raw`$$\Omega=\frac{K}{f^2}\int N_e\,B_{\parallel}\,dl$$`,
        derivation: String.raw`<p><b>Where we start.</b> A linear wave in a magnetized plasma splits into two circularly polarized modes (RHCP and LHCP) that travel at slightly different phase velocities — magnetized-plasma birefringence.</p><p><b>Step 1 — different refractive indices.</b> The magneto-ionic (Appleton) theory gives the two circular modes indices $n_\pm$ that differ by an amount proportional to the electron density $N_e$ and the along-path field $B_\parallel$, and inversely to frequency (through the plasma and gyro frequencies).</p><p><b>Step 2 — a linear wave is the sum of two circulars.</b> Decompose the incoming linear field into equal RHCP + LHCP. After a path length $dl$ the two accumulate different phases $\phi_\pm=n_\pm\frac{2\pi f}{c}dl$; their recombination is again linear but rotated by half the phase difference: $$d\Omega=\tfrac12(\phi_--\phi_+).$$</p><p><b>Step 3 — integrate and collect the frequency scaling.</b> Carrying the $N_e$, $B_\parallel$ dependence and the $1/f^2$ behaviour of the index difference through the integral over the path: $$\Omega=\frac{K}{f^2}\int N_e\,B_{\parallel}\,dl,\qquad K=\frac{e^3}{8\pi^2\varepsilon_0 m^2 c}.$$</p><p><b>Result.</b> $$\Omega\propto\frac{1}{f^2}\int N_e B_\parallel\,dl.$$ The $f^{-2}$ law makes rotation severe at VHF/UHF and modest at L-band and above; a circular wave is unaffected because rotating a circle leaves it circular — the immunity that drives CP on satellite links.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is polarization, physically?`, back: String.raw`The time-varying orientation of a wave's electric field vector, transverse to propagation. Its state is set by the relative amplitude ($E_y/E_x$) and relative phase ($\delta$) of two orthogonal field components.` },
      { front: String.raw`Conditions for linear, circular, and elliptical polarization?`, back: String.raw`Linear: $\delta=0$ or $\pi$. Circular: $E_x=E_y$ and $\delta=\pm90^\circ$. Elliptical: any other amplitude/phase combination (the general case).` },
      { front: String.raw`How is RHCP vs LHCP defined (IEEE)?`, back: String.raw`Looking along the propagation direction, $\vec E$ rotates clockwise for RHCP ($\delta=-90^\circ$) and counter-clockwise for LHCP ($\delta=+90^\circ$). They are orthogonal.` },
      { front: String.raw`Define axial ratio and its limiting values.`, back: String.raw`$\mathrm{AR}=E_{max}/E_{min}\ge1$; AR = 1 (0 dB) is perfect circular, AR = ∞ is perfect linear. AR ≤ 3 dB is the usual "good CP" criterion.` },
      { front: String.raw`State the polarization loss factor for two linear polarizations misaligned by $\psi$.`, back: String.raw`$\mathrm{PLF}=|\cos\psi|^2$: 0 dB at $\psi=0$, −3 dB at 45°, and complete rejection (−∞ dB) at 90°.` },
      { front: String.raw`What is the general PLF formula?`, back: String.raw`$\mathrm{PLF}=|\hat{\rho}_w\cdot\hat{\rho}_a^*|^2$ using complex polarization unit vectors; it reduces to $\cos^2\psi$ (linear), 1/0 (co/cross circular), and 1/2 (linear vs circular).` },
      { front: String.raw`How much loss when a circular antenna receives a linear wave?`, back: String.raw`Exactly 3 dB (PLF = 1/2), independent of the linear wave's tilt angle — the robustness that makes CP useful for unknown orientations.` },
      { front: String.raw`What is Faraday rotation and how does it scale with frequency?`, back: String.raw`Rotation of a linear wave's polarization plane in the magnetized ionosphere; $\Omega\propto f^{-2}\int N_eB_\parallel dl$, so it is severe at VHF and modest above L-band.` },
      { front: String.raw`Why are satellites and GPS circularly polarized?`, back: String.raw`Circular polarization is immune to Faraday rotation (rotating a circle leaves it circular) and to unknown terminal/spacecraft orientation, avoiding deep random polarization fades on linear links.` },
      { front: String.raw`What is cross-polarization discrimination (XPD)?`, back: String.raw`The ratio of co-pol to cross-pol power (typically 25–35 dB for good antennas); it limits how cleanly orthogonal polarizations can be reused. Rain depolarization degrades it.` },
      { front: String.raw`How does polarization enable frequency reuse?`, back: String.raw`Orthogonal polarizations (V/H or RHCP/LHCP) don't couple, so two independent streams can share one frequency and be separated by a dual-polarized antenna, doubling spectral efficiency (limited by XPD).` },
      { front: String.raw`What is dual-polarized MIMO?`, back: String.raw`Using two orthogonal polarizations of a single antenna aperture to carry two spatial streams, doubling capacity or diversity without doubling the antenna footprint (±45° slant is common).` },
      { front: String.raw`Why does an imperfect axial ratio cause loss even between two RHCP antennas?`, back: String.raw`A non-unity AR means part of the field is in the orthogonal (LHCP) sense, which the co-pol antenna rejects, adding a mismatch loss that grows with the transmit and receive axial ratios.` },
      { front: String.raw`What decomposition underlies all polarization analysis?`, back: String.raw`Any polarization can be written as a sum of two orthogonal components — either two orthogonal linear (V, H) or two orthogonal circular (RHCP, LHCP).` },
      { front: String.raw`What is polarization diversity and why is it compact?`, back: String.raw`Combining two orthogonally polarized receive antennas, which experience partly independent fades; it needs no physical antenna separation, unlike spatial diversity.` },
      { front: String.raw`Convention pitfall for handedness?`, back: String.raw`IEEE (antennas/comms) defines handedness looking along propagation; optics looks toward the source, naming the same wave oppositely. Always state the convention.` }
    ],
    mcqs: [
      { q: String.raw`Polarization is determined by which two properties of the orthogonal field components?`, options: [String.raw`Frequency and wavelength`, String.raw`Relative amplitude and relative phase`, String.raw`Power and bandwidth`, String.raw`Gain and directivity`], answer: 1, explain: String.raw`The amplitude ratio $E_y/E_x$ and phase difference $\delta$ fully specify the polarization ellipse and hence the state.` },
      { q: String.raw`Circular polarization requires:`, options: [String.raw`$E_x=E_y$ and $\delta=0$`, String.raw`$E_x=E_y$ and $\delta=\pm90^\circ$`, String.raw`$E_x\ne E_y$ and $\delta=180^\circ$`, String.raw`Any amplitudes with $\delta=0$`], answer: 1, explain: String.raw`Equal amplitudes in phase quadrature ($\pm90^\circ$) make the field magnitude constant while its direction rotates — a circle.` },
      { q: String.raw`An axial ratio of 0 dB corresponds to:`, options: [String.raw`Perfect linear polarization`, String.raw`Perfect circular polarization`, String.raw`45° slant linear`, String.raw`Maximum cross-pol`], answer: 1, explain: String.raw`AR = 1 (0 dB) means $E_{max}=E_{min}$, a perfect circle; AR = ∞ would be perfect linear.` },
      { q: String.raw`Two linear antennas misaligned by 45° suffer a polarization loss of:`, options: [String.raw`0 dB`, String.raw`−3 dB`, String.raw`−6 dB`, String.raw`−∞ dB`], answer: 1, explain: String.raw`$\mathrm{PLF}=\cos^2 45^\circ=0.5=-3$ dB.` },
      { q: String.raw`A circularly polarized antenna receiving a linearly polarized wave captures:`, options: [String.raw`All the power (0 dB)`, String.raw`Half the power (−3 dB), regardless of the linear tilt`, String.raw`None of the power`, String.raw`A tilt-dependent fraction`], answer: 1, explain: String.raw`Linear-into-circular always gives PLF = 1/2 (−3 dB), independent of the linear wave's orientation.` },
      { q: String.raw`A vertically polarized wave into a horizontally polarized antenna gives PLF =`, options: [String.raw`1`, String.raw`0.5`, String.raw`0`, String.raw`0.707`], answer: 2, explain: String.raw`$\psi=90^\circ\Rightarrow\mathrm{PLF}=\cos^2 90^\circ=0$: complete rejection (the basis of V/H frequency reuse).` },
      { q: String.raw`Faraday rotation angle scales with frequency as:`, options: [String.raw`$\propto f$`, String.raw`$\propto f^2$`, String.raw`$\propto 1/f^2$`, String.raw`Independent of $f$`], answer: 2, explain: String.raw`$\Omega\propto f^{-2}\int N_eB_\parallel dl$, so it is large at VHF and small at higher microwave frequencies.` },
      { q: String.raw`The main reason satellites use circular polarization is that it:`, options: [String.raw`Has higher gain`, String.raw`Is immune to Faraday rotation and unknown terminal orientation`, String.raw`Uses less bandwidth`, String.raw`Eliminates thermal noise`], answer: 1, explain: String.raw`Rotating a circular wave leaves it circular, so Faraday rotation and arbitrary antenna orientation cause no polarization fade — only a fixed 3 dB versus a linear ground antenna.` },
      { q: String.raw`RHCP and LHCP waves are:`, options: [String.raw`Identical`, String.raw`Orthogonal (an RHCP antenna rejects LHCP)`, String.raw`Always 3 dB coupled`, String.raw`The same as V and H`], answer: 1, explain: String.raw`Opposite-handed circular polarizations are orthogonal, giving another frequency-reuse pair with ideally infinite isolation.` },
      { q: String.raw`Cross-polarization discrimination (XPD) primarily limits:`, options: [String.raw`Antenna gain`, String.raw`How cleanly two orthogonal polarizations can be reused`, String.raw`The carrier frequency`, String.raw`The noise figure`], answer: 1, explain: String.raw`Finite XPD (say 30 dB) means some power leaks between polarizations, capping the isolation of dual-pol frequency reuse; rain depolarization worsens it.` },
      { q: String.raw`Dual-polarized MIMO provides two data streams by:`, options: [String.raw`Using two carrier frequencies`, String.raw`Exploiting two orthogonal polarizations in one antenna aperture`, String.raw`Doubling the transmit power`, String.raw`Widening the bandwidth`], answer: 1, explain: String.raw`Two orthogonal polarizations act as two nearly independent channels in a single physical aperture, doubling capacity/diversity without extra antenna spacing.` },
      { q: String.raw`Elliptical polarization is best described as:`, options: [String.raw`A rare special case`, String.raw`The general polarization state, with linear and circular as its extremes`, String.raw`Only produced by rain`, String.raw`Identical to circular`], answer: 1, explain: String.raw`Any amplitude/phase combination traces an ellipse; linear ($\delta=0$) and circular ($E_x=E_y,\delta=\pm90^\circ$) are the limiting cases.` },
      { q: String.raw`The general polarization loss factor is:`, options: [String.raw`$|\hat{\rho}_w+\hat{\rho}_a|^2$`, String.raw`$|\hat{\rho}_w\cdot\hat{\rho}_a^*|^2$`, String.raw`$\hat{\rho}_w\cdot\hat{\rho}_a$`, String.raw`$|\hat{\rho}_w|^2|\hat{\rho}_a|^2$`], answer: 1, explain: String.raw`The squared magnitude of the Hermitian inner product of the wave and antenna polarization vectors; the conjugate captures the handedness-matching requirement.` },
      { q: String.raw`Rain affects polarization by:`, options: [String.raw`Increasing axial ratio purity`, String.raw`Depolarizing the signal (degrading XPD) via asymmetric raindrops`, String.raw`Rotating only circular waves`, String.raw`Having no effect`], answer: 1, explain: String.raw`Oblate raindrops attenuate and phase-shift H and V differently, depolarizing the wave and lowering XPD on high-frequency links.` }
    ],
    numericals: [
      { q: String.raw`A transmit antenna is vertically polarized; the receive antenna is tilted 30° from vertical. Find the polarization loss factor in linear and dB.`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{PLF}=\cos^2\psi,\qquad \mathrm{PLF_{dB}}=10\log_{10}(\cos^2\psi),$$ where $\psi$ is the angle between the two linear polarizations.</p>
      <p><b>Substitute.</b> $\mathrm{PLF}=\cos^2 30^\circ=(0.866)^2$, then convert to dB.</p>
      <p><b>Compute.</b> $\mathrm{PLF}=0.75$; $10\log_{10}(0.75)=-1.25$ dB.</p>
      <p><b>Explanation.</b> A modest 30° tilt costs only 1.25 dB, but the $\cos^2$ law bites fast: 60° gives $-6$ dB and 90° gives complete rejection. That steep fall near 90° is exactly what makes orthogonal polarizations usable for frequency reuse.</p>` },
      { q: String.raw`A GPS satellite transmits RHCP; a user's antenna is a simple linear (vertical) whip. What polarization loss applies, and why is it acceptable?`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{PLF}_{\text{lin}\leftarrow\text{circ}}=\tfrac12\ (=-3\text{ dB}),$$ the fixed loss when a linear antenna receives a circular wave (any linear tilt captures half the circular power).</p>
      <p><b>Substitute.</b> Circular wave into linear antenna → $\mathrm{PLF}=0.5$.</p>
      <p><b>Compute.</b> $\mathrm{PLF}=0.5=-3$ dB, independent of the whip's orientation.</p>
      <p><b>Explanation.</b> The 3 dB is fixed and budgetable, whereas a <em>linear</em> satellite signal would suffer deep, unpredictable Faraday and orientation fades (down to $-\infty$ dB at a null). Trading a guaranteed 3 dB for immunity to those fades is why GPS transmits circular.</p>` },
      { q: String.raw`A "circular" antenna has axial ratio 3 dB. Express its major-to-minor field ratio and estimate the extra loss when it receives a perfectly circular co-pol wave (best relative orientation).`, solution: String.raw`<p><b>Formula.</b> $$r=10^{\mathrm{AR_{dB}}/20},\qquad \mathrm{PLF}=\frac12+\frac12\cdot\frac{4r_1 r_2}{(1+r_1^2)(1+r_2^2)},$$ the axial-ratio mismatch loss between a wave of ratio $r_1$ and an antenna of ratio $r_2$ (co-polar, aligned major axes = best case).</p>
      <p><b>Substitute.</b> $r_2=10^{3/20}=1.413$; a perfect circular wave has $r_1=1$. Then $\mathrm{PLF}=\dfrac12+\dfrac12\cdot\dfrac{4(1)(1.413)}{(1+1)(1+1.413^2)}$.</p>
      <p><b>Compute.</b> $r_2=1.413$; the fraction $=\dfrac{5.65}{2\times2.996}=0.943$, so $\mathrm{PLF}=0.5+0.5(0.943)=0.972$, i.e. about $-0.13$ dB extra loss.</p>
      <p><b>Explanation.</b> A 3 dB axial ratio costs only ~0.13 dB in the best orientation but can reach many dB at the worst relative rotation (the minus-sign branch) — which is why CP-antenna specs quote AR bandwidth, and why even two nominally co-pol CP links incur a small mismatch penalty.</p>` },
      { q: String.raw`Two dual-pol streams share a channel with XPD = 25 dB. What fraction of the interfering (cross-pol) stream leaks into the wanted one, and what is the resulting signal-to-interference ratio if both streams have equal power?`, solution: String.raw`<p><b>Formula.</b> $$\text{leaked fraction}=10^{-\mathrm{XPD_{dB}}/10},\qquad \mathrm{SIR}\approx\mathrm{XPD}\ \text{(equal powers)},$$ where XPD is the cross-polarization discrimination.</p>
      <p><b>Substitute.</b> Leaked fraction $=10^{-25/10}$; SIR set by the same 25 dB.</p>
      <p><b>Compute.</b> Leaked fraction $=3.16\times10^{-3}$ (0.316%); $\mathrm{SIR}\approx25$ dB.</p>
      <p><b>Explanation.</b> With equal transmit powers the wanted-to-cross ratio at the receiver is essentially the XPD itself. This caps the usable SNR of dual-pol frequency reuse; pushing higher-order modulation on such a link needs cross-polar cancellation to beat the 25 dB floor.</p>` },
      { q: String.raw`At 400 MHz the Faraday rotation across the ionosphere is measured as 120°. Estimate the rotation at 1600 MHz (L-band) for the same path.`, solution: String.raw`<p><b>Formula.</b> $$\Omega\propto\frac{1}{f^2}\ \Rightarrow\ \frac{\Omega_2}{\Omega_1}=\left(\frac{f_1}{f_2}\right)^2,$$ since the integrated $N_e B_\parallel$ path term is the same for both frequencies.</p>
      <p><b>Substitute.</b> Frequency ratio $f_2/f_1=1600/400=4$, so $\Omega_2=120^\circ\times(1/4)^2$.</p>
      <p><b>Compute.</b> $\Omega_2=120^\circ/16=7.5^\circ$. Linear-link loss: $\cos^2 7.5^\circ=0.983=-0.07$ dB at L-band versus $\cos^2 120^\circ=0.25=-6$ dB at 400 MHz.</p>
      <p><b>Explanation.</b> The $f^{-2}$ law makes Faraday rotation severe at UHF (120° = 6 dB loss and swinging toward nulls) but nearly negligible at L-band. This is precisely why higher frequencies and circular polarization are favoured for satellite links through the ionosphere.</p>` },
      { q: String.raw`A linear wave (tilt unknown, uniformly random 0–90°) is received by a linear antenna. What is the average PLF, and how does that compare with using a circular antenna?`, solution: String.raw`<p><b>Formula.</b> $$\langle\mathrm{PLF}\rangle=\frac{1}{\pi/2}\int_0^{\pi/2}\cos^2\psi\,d\psi=\frac12,$$ the mean of $\cos^2$ over a uniformly random tilt in $[0,90^\circ]$.</p>
      <p><b>Substitute.</b> $\langle\cos^2\psi\rangle=\tfrac12$ (average of $\cos^2$ over a quarter period).</p>
      <p><b>Compute.</b> Average PLF $=0.5=-3$ dB — but with huge variance, ranging from 0 dB (aligned) down to $-\infty$ dB (orthogonal null).</p>
      <p><b>Explanation.</b> A circular antenna gives a <em>constant</em> $-3$ dB with no nulls — the same average but a vastly better worst case. When the incoming tilt is unknown, CP trades no average performance for the elimination of catastrophic deep fades, which is why it is the default for unknown-orientation links.</p>` },
      { q: String.raw`Design check: a satellite CP downlink budgets a 3 dB linear-terminal polarization loss plus a 0.5 dB axial-ratio mismatch. If the received power at a perfectly matched CP terminal would be −110 dBm, what is it at the linear terminal?`, solution: String.raw`<p><b>Formula.</b> $$P_{rx}=P_{rx,\text{matched}}-L_{pol},\qquad L_{pol}=L_{\text{lin/circ}}+L_{AR},$$ subtracting the total polarization penalty (in dB) from the matched-case received power.</p>
      <p><b>Substitute.</b> $L_{pol}=3+0.5$ dB; $P_{rx}=-110-L_{pol}$.</p>
      <p><b>Compute.</b> $L_{pol}=3.5$ dB; $P_{rx}=-110-3.5=-113.5$ dBm.</p>
      <p><b>Explanation.</b> The link budget must ensure $-113.5$ dBm still clears the receiver sensitivity plus margin. If it does not, a proper CP terminal (avoiding the 3 dB linear penalty) is required — a concrete example of how polarization loss enters a link budget alongside path loss and noise.</p>` },
      { q: String.raw`A wave has $E_x=1$, $E_y=1$, $\delta=+90^\circ$. Identify the polarization and confirm its handedness convention, then give the axial ratio.`, solution: String.raw`<p><b>Formula.</b> $$E_x=E_y\ \text{and}\ \delta=\pm90^\circ\ \Rightarrow\ \text{circular};\qquad \mathrm{AR}=\frac{E_{max}}{E_{min}},$$ with the sign of $\delta$ fixing the handedness (IEEE, looking along $+z$).</p>
      <p><b>Substitute.</b> $E_x=E_y=1$ and $\delta=+90^\circ$ satisfy the circular condition; equal amplitudes in exact quadrature give $E_{max}=E_{min}$.</p>
      <p><b>Compute.</b> The wave is circularly polarized; $\delta=+90^\circ$ (y leads x) is LHCP in the IEEE convention (counter-clockwise looking along $+z$). Since $E_{max}=E_{min}$, $\mathrm{AR}=1$ (0 dB).</p>
      <p><b>Explanation.</b> Perfect equal amplitudes and exact $90^\circ$ phase make an ideal circle, so the axial ratio is unity. Breaking either condition (unequal amplitude or off-quadrature phase) would turn the circle into an ellipse with $\mathrm{AR}>1$ — the general elliptical case.</p>` }
    ],
    realWorld: String.raw`<p>Polarization is a daily design driver across the RF world. Satellite operators reuse every transponder frequency twice — vertical and horizontal, or RHCP and LHCP — to double capacity, relying on 30+ dB cross-polarization discrimination and, at Ku/Ka band, on adaptive cross-polar cancellers to counter rain depolarization. GPS and virtually all GNSS transmit RHCP so that a handheld receiver held at any angle, and the signal's passage through the Faraday-rotating ionosphere, incur only a fixed, budgetable loss rather than deep random fades — the same reasoning drives circular polarization on most space telemetry and TT&C links. Terrestrial cellular base stations almost universally use ±45° slant dual-polarized panels, giving two MIMO streams and polarization diversity from a single compact aperture, which is central to LTE/5G capacity. Broadcast and point-to-point microwave links specify polarization to control interference between adjacent operators. Weather services run dual-polarization radar, reading the differential reflectivity and depolarization to tell rain from hail from snow. And in every link budget an engineer must add the polarization loss factor — a benign 0 dB for matched linear, a planned 3 dB for linear-to-circular, or an unacceptable deep null for orthogonal — making polarization matching as fundamental to closing a link as gain, path loss, and noise.</p>`,
    related: ['antenna', 'antenna-gain', 'maxwell', 'link-budget', 'path-loss', 'antenna-types']
  }
);
