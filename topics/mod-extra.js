// Modulation & Detection — extra topics: Pulse Shaping, Eye Diagram, BER, Eb/N0
CONTENT.topics.push(
{
  id: 'pulse-shaping',
  title: 'Pulse Shaping',
  category: 'Modulation & Detection',
  tags: ['ISI', 'Nyquist', 'raised cosine', 'RRC', 'roll-off', 'bandwidth'],
  summary: String.raw`Pulse shaping designs the transmitted symbol waveform so the signal fits a bandwidth mask while producing zero intersymbol interference at the sampling instants.`,
  prerequisites: ['comm-basics', 'nyquist-sampling', 'fourier-transform', 'convolution'],
  intro: String.raw`<p>Digital symbols are abstract numbers, but a radio must send continuous waveforms of finite bandwidth. If we naively transmit rectangular pulses of duration $T$, their spectrum is a $\text{sinc}$ that spreads energy across an infinite band — unacceptable when channels are packed side by side. If instead we brick-wall filter to a narrow band, the pulses smear in time and each symbol bleeds into its neighbours, producing <em>intersymbol interference (ISI)</em>. Pulse shaping resolves this tension: it band-limits the signal <strong>and</strong> guarantees that, at the correct sampling instants, every symbol except the current one contributes exactly zero. This is the practical embodiment of Nyquist's ISI criterion, realised most often by the raised-cosine and root-raised-cosine families.</p>`,
  sections: [
    {
      h: 'Why shape pulses at all?',
      html: String.raw`<p>Two forces are in conflict. Spectral regulators and neighbouring channels demand a <strong>compact spectrum</strong>; the detector demands <strong>no ISI</strong> so that each decision reflects one symbol only. A rectangular pulse of width $T$ has spectrum $T\,\text{sinc}(fT)$, whose sidelobes decay only as $1/f$ — spectrally wasteful and a source of adjacent-channel interference. Hard-limiting the bandwidth to fix that would, by the time–frequency duality, stretch the pulse in time and cause overlap.</p>
      <ul>
        <li><strong>Bandlimiting:</strong> keep transmitted energy inside an assigned mask so channels can be stacked at spacing $\approx R_s$.</li>
        <li><strong>ISI control:</strong> arrange that the composite pulse crosses zero at every other symbol's sampling instant.</li>
        <li><strong>Noise robustness:</strong> pair the transmit filter with a matched receive filter to maximise SNR at the sampling point.</li>
      </ul>
      <div class="callout">Pulse shaping is a <em>filtering</em> operation: the symbol impulse train $\sum_k a_k\,\delta(t-kT)$ is convolved with a shaping filter $p(t)$ to form the baseband waveform $s(t)=\sum_k a_k\,p(t-kT)$.</div></p>`
    },
    {
      h: 'The Nyquist ISI criterion',
      html: String.raw`<p>Zero ISI means the overall pulse $p(t)$ — the cascade of transmit filter, channel and receive filter — must satisfy the <strong>Nyquist criterion</strong> in the time domain:</p>
      <p>$$p(kT)=\begin{cases}1, & k=0\\[2pt] 0, & k\neq 0\end{cases}$$</p>
      <p>The pulse may ring wildly between symbols, but at each sampling instant $t=kT$ all interfering symbols vanish. Equivalently, in the frequency domain, folding the spectrum in slices of width $1/T$ must produce a flat sum:</p>
      <p>$$\sum_{n=-\infty}^{\infty} P\!\left(f-\frac{n}{T}\right)=T \quad\text{(constant, for all } f).$$</p>
      <p>The ideal $\text{sinc}$ pulse $p(t)=\text{sinc}(t/T)$ meets this with the minimum possible (brick-wall) bandwidth $1/(2T)$, but it is unrealisable and, worse, its $1/t$ tails make it extremely sensitive to timing error — a tiny sampling offset lets a huge tail of distant symbols contribute. Practical shapes trade a little excess bandwidth for far gentler tails.</p></p>`
    },
    {
      h: 'The raised-cosine pulse',
      html: String.raw`<p>The raised-cosine (RC) pulse is the standard Nyquist pulse. Its frequency response has a flat passband, a cosine-shaped roll-off, and a stopband, parameterised by the <strong>roll-off factor</strong> $\beta\in[0,1]$:</p>
      <p>$$P_{RC}(f)=\begin{cases}T, & |f|\le \dfrac{1-\beta}{2T}\\[6pt] \dfrac{T}{2}\!\left[1+\cos\!\dfrac{\pi T}{\beta}\!\left(|f|-\dfrac{1-\beta}{2T}\right)\right], & \dfrac{1-\beta}{2T}<|f|\le \dfrac{1+\beta}{2T}\\[6pt] 0, & |f|>\dfrac{1+\beta}{2T}\end{cases}$$</p>
      <p>Its time-domain impulse response is</p>
      <p>$$p_{RC}(t)=\text{sinc}\!\left(\frac{t}{T}\right)\frac{\cos(\pi\beta t/T)}{1-(2\beta t/T)^2}.$$</p>
      <p>The extra $\cos/(1-\cdots)$ factor accelerates the tail decay to $1/t^3$, so timing sensitivity and truncation error are dramatically reduced compared with the raw $\text{sinc}$.</p>
      <ul>
        <li>$\beta=0$: reduces to the ideal $\text{sinc}$; minimum bandwidth, slowest tails.</li>
        <li>$\beta=1$: bandwidth doubled to $1/T$; fastest tails, most benign timing behaviour.</li>
      </ul></p>`
    },
    {
      h: 'Roll-off factor and excess bandwidth',
      html: String.raw`<p>The absolute (single-sided) bandwidth of a raised-cosine signal carrying symbol rate $R_s=1/T$ is</p>
      <p>$$B=\frac{1+\beta}{2T}=\frac{(1+\beta)R_s}{2}.$$</p>
      <p>The minimum (Nyquist) bandwidth is $R_s/2$, so $\beta$ directly measures the <strong>excess bandwidth</strong>: a fraction $\beta$ above the theoretical floor. A double-sided (passband) bandwidth is twice this, $(1+\beta)R_s$.</p>
      <table class="data">
        <tr><th>$\beta$</th><th>Excess BW</th><th>Occupied BW (baseband)</th><th>Character</th></tr>
        <tr><td>0.0</td><td>0%</td><td>$0.5\,R_s$</td><td>Ideal sinc — impractical</td></tr>
        <tr><td>0.22</td><td>22%</td><td>$0.61\,R_s$</td><td>UMTS/WCDMA choice</td></tr>
        <tr><td>0.35</td><td>35%</td><td>$0.675\,R_s$</td><td>DVB-S, common default</td></tr>
        <tr><td>0.5</td><td>50%</td><td>$0.75\,R_s$</td><td>Relaxed, easy timing</td></tr>
        <tr><td>1.0</td><td>100%</td><td>$1.0\,R_s$</td><td>Widest, most robust</td></tr>
      </table>
      <div class="callout"><strong>Trade-off:</strong> small $\beta$ buys spectral efficiency but demands tight symbol-timing recovery and longer filters; large $\beta$ wastes bandwidth but tolerates jitter and truncation. Systems tune $\beta$ to their timing-recovery budget.</div></p>`
    },
    {
      h: 'Root-raised-cosine and the matched-filter split',
      html: String.raw`<p>The Nyquist property must hold for the <em>end-to-end</em> pulse. To also maximise SNR, the receiver should use a filter matched to the transmit pulse. Both goals are met by splitting the raised cosine into two identical <strong>root-raised-cosine (RRC)</strong> filters, one at the transmitter and one at the receiver:</p>
      <p>$$H_{RRC}(f)=\sqrt{P_{RC}(f)},\qquad H_{RRC}(f)\cdot H_{RRC}(f)=P_{RC}(f).$$</p>
      <p>Individually, an RRC filter is <em>not</em> Nyquist — a single RRC pulse does <em>not</em> have zero crossings at multiples of $T$. Only the cascade of the two RRCs (their product in frequency, i.e. convolution in time) forms the raised cosine and delivers zero ISI. The RRC pair is simultaneously:</p>
      <ul>
        <li><strong>Matched:</strong> receive filter = time-reverse of transmit filter, maximising output SNR (see matched-filter theory).</li>
        <li><strong>Nyquist (as a cascade):</strong> zero ISI at the detector's sampling instants.</li>
      </ul>
      <p>The RRC time response is</p>
      <p>$$h_{RRC}(t)=\frac{\sin\!\big(\pi \tfrac{t}{T}(1-\beta)\big)+4\beta\tfrac{t}{T}\cos\!\big(\pi \tfrac{t}{T}(1+\beta)\big)}{\pi \tfrac{t}{T}\big(1-(4\beta t/T)^2\big)}\cdot\frac{1}{\sqrt{T}}.$$</p>
      <div class="callout"><strong>Common pitfall:</strong> testing an RRC transmit filter in isolation and worrying that its impulse response has ISI. That is expected — matching the receive RRC restores the Nyquist zero crossings.</div></p>`
    },
    {
      h: 'Implementation: oversampling, truncation, spectral efficiency',
      html: String.raw`<p>RRC filters are realised as FIR filters running at an integer <strong>oversampling factor</strong> (samples-per-symbol, typically 4–16). The continuous impulse response is truncated to a span of a few symbols each side (commonly $\pm 4T$ to $\pm 8T$); truncation and windowing leak a little energy into the stopband and reintroduce tiny ISI, so filter length is a design compromise.</p>
      <ul>
        <li><strong>Spectral efficiency:</strong> with RC/RRC shaping, an $M$-ary scheme achieves roughly $\dfrac{\log_2 M}{1+\beta}$ bits/s/Hz. Lower $\beta$ and higher $M$ raise efficiency.</li>
        <li><strong>Symbol packing:</strong> channels can be spaced at $(1+\beta)R_s$ with negligible adjacent-channel interference.</li>
        <li><strong>PAPR note:</strong> pulse shaping introduces amplitude variation between symbols (the pulses ring), so a shaped QPSK signal no longer has constant envelope. This raises the <em>peak-to-average power ratio (PAPR)</em>, forcing power-amplifier back-off. Smaller $\beta$ generally worsens PAPR because sharper filtering causes larger overshoot; offset-QPSK and $\pi/4$-QPSK are used to tame envelope excursions.</li>
      </ul>
      <div class="callout">Rule of thumb: a shaped signal's occupied bandwidth is $\approx (1+\beta)R_s$; to fit rate $R_b$ bits/s of an $M$-ary scheme, $R_s=R_b/\log_2 M$.</div></p>`
    }
  ],
  keyPoints: [
    String.raw`Pulse shaping simultaneously band-limits the signal and eliminates ISI at the sampling instants.`,
    String.raw`Nyquist ISI criterion (time domain): the composite pulse equals 1 at $t=0$ and 0 at every other symbol instant $t=kT$.`,
    String.raw`Nyquist criterion (frequency domain): spectral copies spaced by $1/T$ must sum to a constant.`,
    String.raw`Raised-cosine bandwidth is $B=(1+\beta)R_s/2$ (single-sided); minimum Nyquist bandwidth is $R_s/2$.`,
    String.raw`Roll-off $\beta$ measures excess bandwidth: $\beta=0$ is the ideal sinc, $\beta=1$ doubles bandwidth.`,
    String.raw`Small $\beta$ = spectrally efficient but timing-sensitive; large $\beta$ = robust but wasteful.`,
    String.raw`Split the raised cosine into two RRC filters (Tx and Rx) so the receiver is matched AND the cascade is Nyquist.`,
    String.raw`A single RRC pulse is NOT ISI-free by itself; only the Tx+Rx RRC cascade forms the raised cosine.`,
    String.raw`The ideal sinc has the smallest bandwidth but $1/t$ tails, making it hopelessly sensitive to timing error.`,
    String.raw`Pulse shaping increases PAPR because the shaped envelope is no longer constant, forcing PA back-off.`,
    String.raw`Spectral efficiency $\approx \log_2 M/(1+\beta)$ bits/s/Hz for $M$-ary shaped modulation.`
  ],
  equations: [
    {
      title: 'Nyquist zero-ISI condition (time domain)',
      tex: String.raw`$$p(kT)=\delta_{k,0}=\begin{cases}1,&k=0\\0,&k\neq0\end{cases}$$`,
      derivation: String.raw`<p>The detector samples $y(t)=\sum_k a_k\,p(t-kT)$ at $t=mT$, giving $y(mT)=\sum_k a_k\,p((m-k)T)$. For this to equal the wanted symbol $a_m$ alone, we require $p((m-k)T)=0$ for all $k\neq m$ and $p(0)=1$. Substituting $n=m-k$ yields the stated condition.</p>`
    },
    {
      title: 'Nyquist criterion (frequency domain)',
      tex: String.raw`$$\sum_{n=-\infty}^{\infty}P\!\left(f-\frac{n}{T}\right)=T$$`,
      derivation: String.raw`<p>Sampling $p(t)$ at rate $1/T$ multiplies it by an impulse train, which in frequency convolves $P(f)$ with an impulse train of spacing $1/T$, producing the sum of shifted copies. The sampled sequence $p(kT)=\delta_{k,0}$ has a flat spectrum equal to $p(0)T=T$. Hence the folded sum of spectral copies must be the constant $T$.</p>`
    },
    {
      title: 'Raised-cosine bandwidth',
      tex: String.raw`$$B=\frac{(1+\beta)R_s}{2}=\frac{1+\beta}{2T}$$`,
      derivation: String.raw`<p>The RC spectrum is flat out to $(1-\beta)/2T$, then rolls off symmetrically over a band of width $\beta/T$ centred on $1/2T$, reaching zero at $(1+\beta)/2T$. The single-sided occupied bandwidth is therefore the upper edge $(1+\beta)/2T$. With $R_s=1/T$, this is $(1+\beta)R_s/2$.</p>`
    },
    {
      title: 'Raised-cosine impulse response',
      tex: String.raw`$$p_{RC}(t)=\text{sinc}\!\left(\frac{t}{T}\right)\frac{\cos(\pi\beta t/T)}{1-(2\beta t/T)^2}$$`,
      derivation: String.raw`<p>Taking the inverse Fourier transform of the piecewise RC spectrum yields the $\text{sinc}$ (from the ideal brick-wall part) multiplied by a cosine correction from the raised-cosine roll-off. The denominator $1-(2\beta t/T)^2$ is a removable singularity handled by L'Hopital at $t=\pm T/(2\beta)$. The product tail decays as $1/t^3$, far faster than the sinc's $1/t$.</p>`
    },
    {
      title: 'RRC split for matched filtering',
      tex: String.raw`$$H_{Tx}(f)=H_{Rx}(f)=\sqrt{P_{RC}(f)}\;\Rightarrow\;H_{Tx}H_{Rx}=P_{RC}(f)$$`,
      derivation: String.raw`<p>To be matched, $H_{Rx}(f)=H_{Tx}^*(f)$ (up to delay); for real symmetric filters $H_{Rx}=H_{Tx}$. To be Nyquist, the product must equal a raised cosine. Setting each equal to $\sqrt{P_{RC}}$ satisfies both: the product is $P_{RC}$ (Nyquist) and the receive filter is the matched conjugate of the transmit filter (max SNR).</p>`
    },
    {
      title: 'Spectral efficiency of shaped M-ary modulation',
      tex: String.raw`$$\eta=\frac{R_b}{B}=\frac{\log_2 M}{1+\beta}\ \text{bits/s/Hz}$$`,
      derivation: String.raw`<p>Bit rate $R_b=R_s\log_2 M$. Passband bandwidth for shaped modulation is $B=(1+\beta)R_s$. Dividing gives $\eta=\log_2 M/(1+\beta)$. As $\beta\to0$ and $M$ grows, efficiency rises toward $\log_2 M$.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What two competing requirements does pulse shaping reconcile?`, back: String.raw`Compact (band-limited) spectrum versus zero intersymbol interference at the sampling instants.` },
    { front: String.raw`State the Nyquist zero-ISI criterion in the time domain.`, back: String.raw`The composite pulse must equal 1 at $t=0$ and 0 at every other symbol instant $t=kT$, $k\neq0$.` },
    { front: String.raw`What is the frequency-domain Nyquist criterion?`, back: String.raw`Spectral copies spaced by $1/T$ must sum to a constant: $\sum_n P(f-n/T)=T$.` },
    { front: String.raw`Formula for raised-cosine single-sided bandwidth?`, back: String.raw`$B=(1+\beta)R_s/2$, where $\beta$ is the roll-off and $R_s$ the symbol rate.` },
    { front: String.raw`What does the roll-off factor $\beta$ represent?`, back: String.raw`Excess bandwidth above the Nyquist minimum $R_s/2$; $\beta=0$ is ideal sinc, $\beta=1$ doubles the bandwidth.` },
    { front: String.raw`Why is the ideal sinc pulse impractical?`, back: String.raw`It is non-causal, infinitely long, and its $1/t$ tails make it hypersensitive to timing errors.` },
    { front: String.raw`Why split the raised cosine into two RRC filters?`, back: String.raw`So the receive filter is matched to the transmit filter (max SNR) while the Tx+Rx cascade remains Nyquist (zero ISI).` },
    { front: String.raw`Is a single RRC pulse ISI-free?`, back: String.raw`No. Only the cascade of Tx-RRC and Rx-RRC forms the raised cosine with zero crossings at $kT$.` },
    { front: String.raw`What happens to timing sensitivity as $\beta$ decreases?`, back: String.raw`It worsens: narrower roll-off means slower-decaying tails, so small sampling offsets cause more ISI.` },
    { front: String.raw`Effect of pulse shaping on PAPR?`, back: String.raw`It raises PAPR — the shaped envelope varies (pulses ring), forcing power-amplifier back-off.` },
    { front: String.raw`Typical roll-off used in WCDMA?`, back: String.raw`$\beta=0.22$ (about 22% excess bandwidth).` },
    { front: String.raw`Spectral efficiency of shaped $M$-ary modulation?`, back: String.raw`$\eta=\log_2 M/(1+\beta)$ bits/s/Hz.` },
    { front: String.raw`What is samples-per-symbol (oversampling factor)?`, back: String.raw`The integer number of digital samples generated per symbol by the shaping FIR filter, typically 4–16.` },
    { front: String.raw`How fast do raised-cosine tails decay vs sinc?`, back: String.raw`RC tails decay as $1/t^3$; sinc tails only as $1/t$.` }
  ],
  mcqs: [
    { q: String.raw`The Nyquist ISI criterion requires the composite pulse to be:`, options: [String.raw`Zero everywhere except its peak`, String.raw`One at $t=0$ and zero at all other multiples of the symbol period`, String.raw`Rectangular in time`, String.raw`Constant in the time domain`], answer: 1, explain: String.raw`Zero ISI means $p(0)=1$ and $p(kT)=0$ for $k\neq0$, so neighbouring symbols contribute nothing at the sampling instant.` },
    { q: String.raw`A raised-cosine signal has symbol rate $R_s$ and roll-off $\beta$. Its single-sided bandwidth is:`, options: [String.raw`$R_s/2$`, String.raw`$(1+\beta)R_s/2$`, String.raw`$(1+\beta)R_s$`, String.raw`$\beta R_s$`], answer: 1, explain: String.raw`$B=(1+\beta)R_s/2$; the minimum Nyquist bandwidth $R_s/2$ is inflated by the excess-bandwidth factor $(1+\beta)$.` },
    { q: String.raw`Setting $\beta=0$ in a raised-cosine filter yields:`, options: [String.raw`A rectangular pulse`, String.raw`The ideal sinc / brick-wall filter`, String.raw`A Gaussian pulse`, String.raw`Infinite bandwidth`], answer: 1, explain: String.raw`$\beta=0$ removes the roll-off, leaving a brick-wall spectrum whose time response is the ideal sinc.` },
    { q: String.raw`Why is the raised cosine usually split into two root-raised-cosine filters?`, options: [String.raw`To halve the transmit power`, String.raw`So the receiver is matched while the cascade stays Nyquist`, String.raw`To increase the roll-off factor`, String.raw`To remove the need for timing recovery`], answer: 1, explain: String.raw`Each RRC is $\sqrt{P_{RC}}$; their product is the raised cosine (zero ISI) and the receive RRC is matched to the transmit RRC (max SNR).` },
    { q: String.raw`A single RRC transmit pulse examined alone:`, options: [String.raw`Has zero ISI by itself`, String.raw`Does not have zero crossings at all $kT$`, String.raw`Is identical to the raised cosine`, String.raw`Has infinite bandwidth`], answer: 1, explain: String.raw`Only the Tx+Rx RRC cascade forms the Nyquist raised cosine; a lone RRC pulse is not ISI-free.` },
    { q: String.raw`Decreasing the roll-off factor $\beta$ tends to:`, options: [String.raw`Reduce spectral efficiency`, String.raw`Make symbol-timing recovery more demanding`, String.raw`Speed up the pulse tails`, String.raw`Lower the PAPR`], answer: 1, explain: String.raw`Smaller $\beta$ saves bandwidth but the slower-decaying tails make the system far more sensitive to sampling-time error.` },
    { q: String.raw`The ideal sinc pulse is rarely used in practice mainly because:`, options: [String.raw`It has too much bandwidth`, String.raw`Its $1/t$ tails make it extremely timing-sensitive and it is unrealisable`, String.raw`It creates constant ISI`, String.raw`It has no zero crossings`], answer: 1, explain: String.raw`The sinc is non-causal and infinite, and its slowly decaying tails cause large ISI under any timing offset.` },
    { q: String.raw`Pulse shaping affects a QPSK signal's envelope by:`, options: [String.raw`Keeping it perfectly constant`, String.raw`Introducing amplitude variation that raises PAPR`, String.raw`Eliminating all amplitude variation`, String.raw`Doubling the carrier frequency`], answer: 1, explain: String.raw`Shaped pulses ring between symbols, so the envelope is no longer constant, increasing PAPR and requiring PA back-off.` },
    { q: String.raw`In the frequency domain, the Nyquist criterion states that copies of $P(f)$ spaced by $1/T$ must:`, options: [String.raw`Sum to zero`, String.raw`Sum to a constant`, String.raw`Never overlap`, String.raw`Have equal phase`], answer: 1, explain: String.raw`$\sum_n P(f-n/T)=T$ — the folded spectrum must be flat for zero ISI.` },
    { q: String.raw`For $M$-QAM with roll-off $\beta$, the spectral efficiency is approximately:`, options: [String.raw`$\log_2 M \cdot (1+\beta)$`, String.raw`$\log_2 M/(1+\beta)$`, String.raw`$M/(1+\beta)$`, String.raw`$1/(1+\beta)$`], answer: 1, explain: String.raw`$\eta=R_b/B=\log_2 M/(1+\beta)$ bits/s/Hz.` },
    { q: String.raw`Raised-cosine tails decay as:`, options: [String.raw`$1/t$`, String.raw`$1/t^2$`, String.raw`$1/t^3$`, String.raw`Exponentially`], answer: 2, explain: String.raw`The cosine correction factor makes RC tails fall as $1/t^3$, far faster than the sinc's $1/t$.` },
    { q: String.raw`A shaping FIR filter running at 8 samples-per-symbol is:`, options: [String.raw`Undersampling the pulse`, String.raw`Oversampling with factor 8`, String.raw`Operating at the Nyquist symbol rate`, String.raw`Aliasing the spectrum`], answer: 1, explain: String.raw`Samples-per-symbol of 8 means the filter is oversampled 8x relative to the symbol rate, giving smooth waveforms and headroom for the RC spectrum.` }
  ],
  numericals: [
    { q: String.raw`A system uses raised-cosine shaping with roll-off $\beta=0.25$ and symbol rate $R_s=10$ Msym/s. Find the single-sided occupied bandwidth and the passband (double-sided) bandwidth.`, solution: String.raw`<p>Single-sided: $B=(1+\beta)R_s/2=(1.25)(10\times10^6)/2=6.25$ MHz.</p><p>Passband (double-sided) bandwidth $=2B=(1+\beta)R_s=12.5$ MHz.</p>` },
    { q: String.raw`A channel bandwidth of 20 MHz (passband) is available. Using RRC with $\beta=0.35$, what maximum symbol rate fits, and what bit rate does 64-QAM achieve?`, solution: String.raw`<p>Passband BW $=(1+\beta)R_s\Rightarrow R_s=B/(1+\beta)=20\times10^6/1.35\approx14.8$ Msym/s.</p><p>64-QAM carries $\log_2 64=6$ bits/symbol, so $R_b=6\times14.8\approx88.9$ Mb/s.</p>` },
    { q: String.raw`Compute the excess bandwidth (in MHz and %) for $R_s=5$ Msym/s with $\beta=0.5$.`, solution: String.raw`<p>Nyquist minimum single-sided BW $=R_s/2=2.5$ MHz. Actual $=(1+0.5)(5)/2=3.75$ MHz. Excess $=3.75-2.5=1.25$ MHz $=50\%$ of the minimum — consistent with $\beta=0.5$.</p>` },
    { q: String.raw`What roll-off is needed to transmit 100 Msym/s within a 130 MHz passband allocation?`, solution: String.raw`<p>$(1+\beta)R_s\le130\Rightarrow 1+\beta\le130/100=1.30\Rightarrow \beta\le0.30$. Choose $\beta=0.30$ (or slightly less for margin).</p>` },
    { q: String.raw`A QPSK link must deliver 40 Mb/s. With $\beta=0.2$ RRC shaping, find the symbol rate and occupied passband bandwidth.`, solution: String.raw`<p>QPSK: $\log_2 4=2$ bits/symbol $\Rightarrow R_s=40/2=20$ Msym/s. Passband BW $=(1+0.2)(20)=24$ MHz.</p>` },
    { q: String.raw`Compare the spectral efficiency of 16-QAM at $\beta=0.35$ versus $\beta=0.1$.`, solution: String.raw`<p>$\eta=\log_2 16/(1+\beta)=4/(1+\beta)$. At $\beta=0.35$: $4/1.35=2.96$ bits/s/Hz. At $\beta=0.1$: $4/1.1=3.64$ bits/s/Hz — about 23% higher, at the cost of tighter timing recovery.</p>` }
  ],
  realWorld: String.raw`<p>Root-raised-cosine shaping is ubiquitous: WCDMA/UMTS uses RRC with $\beta=0.22$, DVB-S satellite uses $\beta=0.35$ (and DVB-S2 offers 0.20/0.25/0.35), and countless SDR waveforms (built on chips such as the AD9361) apply RRC FIR filters in the digital front-end. When you configure a modem's "alpha" or "roll-off", you are trading spectral occupancy against timing-loop robustness and PA back-off. Getting the Tx/Rx RRC pair matched is also what lets the receiver's matched filter and symbol-timing recovery hit their theoretical BER — a mismatched or truncated filter shows up as an eye that never fully opens and as EVM that plateaus above the noise floor.</p>`,
  related: ['eye-diagram', 'matched-filter', 'nyquist-sampling', 'bpsk', 'evm']
},
{
  id: 'eye-diagram',
  title: 'Eye Diagram',
  category: 'Modulation & Detection',
  tags: ['eye', 'ISI', 'jitter', 'timing margin', 'PAM', 'diagnostics'],
  summary: String.raw`An eye diagram overlays many symbol-period traces of a received signal to reveal ISI, noise margin, timing jitter and the optimal sampling instant at a glance.`,
  prerequisites: ['pulse-shaping', 'comm-basics', 'noise'],
  intro: String.raw`<p>The eye diagram is the oscilloscope of digital communications. Take the recovered baseband waveform, slice it into segments one (or two) symbol periods long, and overlay them all on the same time axis. Random data means every possible symbol transition is superimposed, and the persistence forms a shape with a central open region — the "eye". A wide-open eye means clean, easily-detected symbols; a closing eye means ISI, noise and jitter are eating the margins. Because it collapses timing, amplitude and distortion information into one picture, the eye diagram is the fastest qualitative diagnostic a communications engineer has.</p>`,
  sections: [
    {
      h: 'What the eye diagram is',
      html: String.raw`<p>Formally, the eye diagram is the received waveform $y(t)$ chopped at symbol boundaries and plotted modulo the symbol period $T$ (usually spanning $2T$ so full transitions are visible), with all segments overlaid using infinite or decaying persistence. Each trace is one realisation of the pulse train for some random data sequence; together they trace out the envelope of all achievable signal excursions.</p>
      <ul>
        <li>Horizontal axis: time within one or two symbol periods.</li>
        <li>Vertical axis: instantaneous signal amplitude.</li>
        <li>The bright central open region is the "eye"; its opening reflects how confidently a slicer can decide.</li>
      </ul>
      <div class="callout">For binary (2-level) signalling there is <strong>one</strong> eye. For $M$-level PAM there are <strong>$M-1$</strong> stacked eyes, one between each pair of adjacent amplitude levels.</div></p>`
    },
    {
      h: 'How to read the eye — the four measurements',
      html: String.raw`<p>Every feature of the eye maps to a specific impairment:</p>
      <table class="data">
        <tr><th>Feature</th><th>Measures</th><th>Degraded by</th></tr>
        <tr><td>Vertical eye <strong>opening</strong> (height)</td><td>Noise margin / SNR</td><td>Noise, ISI, amplitude distortion</td></tr>
        <tr><td>Horizontal eye <strong>width</strong></td><td>Timing margin</td><td>Jitter, ISI, timing error</td></tr>
        <tr><td><strong>Crossing thickness</strong> (at zero-level crossings)</td><td>Timing jitter</td><td>Phase noise, clock jitter, ISI</td></tr>
        <tr><td><strong>Slope</strong> at crossings</td><td>Sensitivity to timing error</td><td>Bandlimiting, roll-off, ringing</td></tr>
      </table>
      <p>The <strong>optimal sampling instant</strong> is the horizontal position where the eye is tallest — the moment of maximum vertical opening. The receiver's clock-recovery loop must lock the sampling clock to this instant.</p>
      <ul>
        <li><strong>Noise margin</strong> = half the vertical eye opening: the amount of noise the slicer can tolerate before a wrong decision.</li>
        <li><strong>Timing margin</strong> = horizontal eye width: how far the sampling instant can drift before the eye closes.</li>
      </ul></p>`
    },
    {
      h: 'Vertical opening and noise margin',
      html: String.raw`<p>At the optimal instant, the distance from the top of the eye to the decision threshold (and threshold to bottom) is the noise margin. A larger vertical opening means a larger separation between signal levels relative to the noise, i.e. higher effective SNR at the detector. Noise "fuzzes" the traces vertically, thinning the opening; strong ISI pulls individual traces toward the centre, reducing the worst-case opening even in the absence of noise.</p>
      <p>Quantitatively, the <strong>eye-opening penalty</strong> compares the achieved opening with the ideal (no-ISI) opening. If ISI reduces the vertical opening from $A$ to $A'$, the SNR penalty is $20\log_{10}(A/A')$ dB — directly costing you BER.</p>
      <div class="callout"><strong>Fully closed eye:</strong> when ISI or noise closes the eye completely, no threshold can separate the levels and the BER floors out; equalisation or better pulse shaping is required.</div></p>`
    },
    {
      h: 'Horizontal width, jitter and crossing thickness',
      html: String.raw`<p>The horizontal opening is bounded on each side by the zero-crossing regions where traces converge. <strong>Timing jitter</strong> — random variation in when transitions occur — spreads these crossings horizontally, thickening them and narrowing the eye. Sources include clock-recovery noise, phase noise in oscillators, and data-dependent jitter from ISI (pattern-dependent transition timing).</p>
      <ul>
        <li><strong>Crossing thickness</strong> ≈ peak-to-peak timing jitter; a thin crossing means a clean recovered clock.</li>
        <li><strong>Width</strong> tells you how much sampling-phase error you can tolerate; a narrow eye demands a very accurate clock-recovery loop.</li>
        <li><strong>Steep crossing slope</strong> means a small timing error translates into a large amplitude error — bandlimited/low-roll-off pulses have steeper, more timing-sensitive eyes.</li>
      </ul></p>`
    },
    {
      h: 'Effects of ISI, noise and roll-off on eye shape',
      html: String.raw`<p>The eye is a visual summary of everything pulse shaping is trying to control:</p>
      <ul>
        <li><strong>ISI</strong> spreads each trace, so the collection of overlaid traces no longer passes cleanly through the ideal levels; the eye narrows both vertically and horizontally. A perfectly Nyquist (zero-ISI) system produces the maximum opening at the sampling instant.</li>
        <li><strong>Noise</strong> adds vertical fuzz, thinning the opening without necessarily narrowing the width.</li>
        <li><strong>Roll-off $\beta$</strong>: larger $\beta$ (raised-cosine) gives a <em>wider, more open</em> eye with gentler crossing slopes — easier timing recovery. Smaller $\beta$ gives a narrower eye with steep crossings and more overshoot, i.e. tighter timing tolerance. This is the eye-diagram view of the pulse-shaping bandwidth/robustness trade-off.</li>
        <li><strong>Filtering/truncation</strong>: an under-designed or mismatched RRC filter leaves residual ISI, visibly reducing the opening even before any noise is added.</li>
      </ul>
      <div class="callout">A quick sanity check: with an ideal RRC-matched, noise-free link, a $2T$-span binary eye should be crisply open with two thin crossing points; anything less signals filter, timing or channel problems.</div></p>`
    },
    {
      h: 'Multilevel (PAM/QAM) eyes and practical use',
      html: String.raw`<p>For $M$-PAM there are $M-1$ eyes stacked vertically (e.g. PAM-4 shows 3 eyes). Each eye is smaller than the binary case because the same peak amplitude is divided among more levels, so multilevel signalling is inherently more sensitive to noise and ISI — the eyes are the visual reason higher-order modulation needs higher SNR. For QAM, the in-phase (I) and quadrature (Q) rails each produce their own eye, and a well-behaved QAM link shows two clean multilevel eyes plus a tight constellation.</p>
      <ul>
        <li><strong>Bathtub curve</strong>: sweeping the sampling instant across the eye and plotting BER traces out a "bathtub", whose flat bottom width is the usable timing margin at a target BER.</li>
        <li><strong>Mask testing</strong>: standards define a forbidden polygon inside the eye; traces must not intrude, guaranteeing minimum openings.</li>
        <li><strong>Relation to constellation/EVM</strong>: a closing eye corresponds to a smeared constellation and elevated EVM; the eye is the time-domain twin of the constellation's amplitude-domain view.</li>
      </ul></p>`
    }
  ],
  keyPoints: [
    String.raw`An eye diagram overlays many symbol-period traces of the received waveform to visualise signal quality.`,
    String.raw`Binary signalling has one eye; $M$-level PAM has $M-1$ vertically stacked eyes.`,
    String.raw`Vertical eye opening = noise margin (SNR); horizontal width = timing margin.`,
    String.raw`Crossing thickness measures timing jitter; a thin crossing means a clean recovered clock.`,
    String.raw`The optimal sampling instant is where the eye is tallest (maximum vertical opening).`,
    String.raw`ISI narrows the eye both vertically and horizontally; noise adds vertical fuzz.`,
    String.raw`Larger raised-cosine roll-off $\beta$ gives a wider, more open eye with gentler crossing slopes.`,
    String.raw`Steep crossing slopes mean small timing errors cause large amplitude errors — more timing-sensitive.`,
    String.raw`A fully closed eye means no threshold can separate symbols; equalisation or better shaping is needed.`,
    String.raw`Multilevel eyes are smaller, which is why higher-order modulation needs higher SNR.`,
    String.raw`Sweeping the sample point produces a BER "bathtub" whose flat bottom is the usable timing margin.`,
    String.raw`The eye is the time-domain counterpart of the constellation; a closing eye means elevated EVM.`
  ],
  equations: [
    {
      title: 'Number of eyes for M-PAM',
      tex: String.raw`$$N_{\text{eyes}}=M-1$$`,
      derivation: String.raw`<p>$M$-level PAM has $M$ amplitude levels. An eye opens between each pair of adjacent levels; with $M$ levels there are $M-1$ adjacent pairs, hence $M-1$ stacked eyes.</p>`
    },
    {
      title: 'Noise margin',
      tex: String.raw`$$\text{NM}=\frac{1}{2}\,(\text{vertical eye opening})$$`,
      derivation: String.raw`<p>The decision threshold sits at the eye centre. The distance from threshold to the nearest signal level equals half the total vertical opening; noise smaller than this margin cannot flip the decision. Hence the noise margin is half the opening.</p>`
    },
    {
      title: 'Eye-opening (ISI) SNR penalty',
      tex: String.raw`$$\Delta_{\text{dB}}=20\log_{10}\!\left(\frac{A}{A'}\right)$$`,
      derivation: String.raw`<p>If ISI reduces the vertical opening from the ideal $A$ to $A'$, the effective signal amplitude at the detector shrinks by $A'/A$. Since SNR scales with amplitude squared but the margin scales with amplitude, the equivalent SNR loss in dB is $20\log_{10}(A/A')$.</p>`
    },
    {
      title: 'Optimal sampling instant',
      tex: String.raw`$$t^\star=\arg\max_{t\in[0,T)}\big[\text{vertical eye opening}(t)\big]$$`,
      derivation: String.raw`<p>The best decision is made where the separation between levels is largest, i.e. where the eye is tallest. The clock-recovery loop drives the sampling phase to this maximum-opening instant, typically the midpoint between crossings for symmetric pulses.</p>`
    },
    {
      title: 'Timing margin from eye width',
      tex: String.raw`$$\text{TM}=W_{\text{eye}}=T-t_{\text{jitter,pp}}-t_{\text{ISI-spread}}$$`,
      derivation: String.raw`<p>The full symbol period $T$ would be the ideal horizontal opening; peak-to-peak jitter and ISI-induced crossing spread eat into it from both sides. The residual clear width is the timing margin — how far the sampling clock may drift before hitting a crossing.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What is an eye diagram?`, back: String.raw`An overlay of many symbol-period segments of the received waveform, revealing ISI, noise margin, jitter and the best sampling instant.` },
    { front: String.raw`How many eyes appear for $M$-level PAM?`, back: String.raw`$M-1$ vertically stacked eyes (one between each adjacent level pair).` },
    { front: String.raw`What does the vertical eye opening measure?`, back: String.raw`Noise margin / effective SNR — how much noise the slicer can tolerate.` },
    { front: String.raw`What does the horizontal eye width measure?`, back: String.raw`Timing margin — how far the sampling instant can drift before the eye closes.` },
    { front: String.raw`What does crossing thickness indicate?`, back: String.raw`Timing jitter; a thin crossing means a clean recovered clock.` },
    { front: String.raw`Where is the optimal sampling instant?`, back: String.raw`Where the eye is tallest — the point of maximum vertical opening.` },
    { front: String.raw`How does ISI change the eye?`, back: String.raw`It spreads the traces, narrowing the eye both vertically and horizontally.` },
    { front: String.raw`How does noise change the eye?`, back: String.raw`It adds vertical fuzz, thinning the opening without necessarily narrowing the width.` },
    { front: String.raw`Effect of larger roll-off $\beta$ on the eye?`, back: String.raw`Wider, more open eye with gentler crossing slopes — easier timing recovery.` },
    { front: String.raw`What does a fully closed eye mean?`, back: String.raw`No threshold can separate symbols; BER floors out and equalisation or better shaping is needed.` },
    { front: String.raw`Why are multilevel eyes smaller?`, back: String.raw`The same peak amplitude is split among more levels, so each eye is smaller and more noise-sensitive.` },
    { front: String.raw`What is a BER bathtub curve?`, back: String.raw`BER plotted against sampling instant across the eye; its flat bottom width is the usable timing margin at a target BER.` },
    { front: String.raw`How does the eye relate to the constellation/EVM?`, back: String.raw`The eye is the time-domain twin of the constellation; a closing eye corresponds to a smeared constellation and higher EVM.` },
    { front: String.raw`What does a steep crossing slope imply?`, back: String.raw`High sensitivity to timing error — small timing offsets cause large amplitude errors.` }
  ],
  mcqs: [
    { q: String.raw`In an eye diagram, the vertical eye opening primarily measures:`, options: [String.raw`Timing jitter`, String.raw`Noise margin / SNR`, String.raw`Carrier frequency`, String.raw`Symbol rate`], answer: 1, explain: String.raw`The vertical opening is the amplitude separation available to the slicer; its half is the noise margin.` },
    { q: String.raw`How many eyes does a PAM-4 signal show?`, options: [String.raw`1`, String.raw`2`, String.raw`3`, String.raw`4`], answer: 2, explain: String.raw`PAM-4 has 4 levels, giving $M-1=3$ stacked eyes.` },
    { q: String.raw`The optimal sampling instant corresponds to:`, options: [String.raw`The zero crossings`, String.raw`The point of maximum vertical eye opening`, String.raw`The steepest slope`, String.raw`The thickest crossing`], answer: 1, explain: String.raw`Sampling where the eye is tallest maximises the separation between levels and minimises error probability.` },
    { q: String.raw`Thick zero-crossings in an eye diagram indicate:`, options: [String.raw`Low noise`, String.raw`High timing jitter`, String.raw`Zero ISI`, String.raw`Perfect clock recovery`], answer: 1, explain: String.raw`Jitter spreads the transition instants horizontally, thickening the crossings.` },
    { q: String.raw`Increasing the raised-cosine roll-off $\beta$ generally:`, options: [String.raw`Closes the eye`, String.raw`Opens the eye wider with gentler crossings`, String.raw`Adds noise`, String.raw`Reduces the number of eyes`], answer: 1, explain: String.raw`Larger $\beta$ gives a wider eye and smoother crossings, easing timing recovery at the cost of bandwidth.` },
    { q: String.raw`A completely closed eye implies:`, options: [String.raw`The link is error-free`, String.raw`No threshold can reliably separate symbols`, String.raw`The SNR is infinite`, String.raw`The eye has $M-1$ openings`], answer: 1, explain: String.raw`When ISI/noise close the eye, no decision threshold works and BER floors out; equalisation is needed.` },
    { q: String.raw`The horizontal eye width represents:`, options: [String.raw`Noise margin`, String.raw`Timing margin`, String.raw`Modulation order`, String.raw`Bandwidth`], answer: 1, explain: String.raw`The horizontal opening is how far the sampling instant may move before hitting a crossing — the timing margin.` },
    { q: String.raw`Multilevel eyes are smaller than binary eyes because:`, options: [String.raw`They use less power`, String.raw`The peak amplitude is divided among more levels`, String.raw`They have no ISI`, String.raw`Noise is lower`], answer: 1, explain: String.raw`With more levels in the same amplitude range, each individual eye is smaller and thus more noise-sensitive.` },
    { q: String.raw`ISI in an eye diagram is seen as:`, options: [String.raw`Vertical fuzz only`, String.raw`Traces spreading so the eye narrows vertically and horizontally`, String.raw`A shift of carrier frequency`, String.raw`More stacked eyes`], answer: 1, explain: String.raw`ISI causes each trace to depend on neighbouring symbols, spreading the traces and shrinking the opening.` },
    { q: String.raw`A BER "bathtub" curve is obtained by:`, options: [String.raw`Sweeping the decision threshold only`, String.raw`Sweeping the sampling instant across the eye and plotting BER`, String.raw`Changing the carrier frequency`, String.raw`Varying the roll-off`], answer: 1, explain: String.raw`Moving the sample point horizontally and measuring BER traces out a bathtub whose flat bottom is the timing margin.` },
    { q: String.raw`A steep slope at the eye crossings means the receiver is:`, options: [String.raw`Insensitive to timing error`, String.raw`Highly sensitive to timing error`, String.raw`Immune to noise`, String.raw`Using a large roll-off`], answer: 1, explain: String.raw`Steep crossings convert small timing offsets into large amplitude errors, increasing timing sensitivity.` },
    { q: String.raw`The eye diagram is best described as the time-domain counterpart of:`, options: [String.raw`The power spectral density`, String.raw`The constellation diagram`, String.raw`The autocorrelation`, String.raw`The link budget`], answer: 1, explain: String.raw`A closing eye corresponds to a smeared constellation and elevated EVM — they view the same impairments from time and amplitude domains.` }
  ],
  numericals: [
    { q: String.raw`A binary eye has an ideal vertical opening of 1.0 V. Measured with ISI, the opening drops to 0.7 V. What is the eye-opening SNR penalty in dB?`, solution: String.raw`<p>$\Delta=20\log_{10}(1.0/0.7)=20\log_{10}(1.429)=20\times0.155=3.1$ dB penalty.</p>` },
    { q: String.raw`A PAM-8 signal is transmitted. How many eyes appear, and if the total peak-to-peak amplitude is 7 V split evenly, what is the nominal spacing between adjacent levels?`, solution: String.raw`<p>Eyes $=M-1=7$. With 8 levels spanning 7 V, adjacent spacing $=7/(8-1)=1$ V between levels.</p>` },
    { q: String.raw`The recovered symbol period is $T=1$ ns. Peak-to-peak jitter thickens each crossing by 0.15 ns and ISI eats 0.10 ns of opening on each side. Estimate the timing margin.`, solution: String.raw`<p>Total horizontal loss $\approx$ jitter (0.15 ns) plus ISI spread (0.10+0.10 = 0.20 ns) $=0.35$ ns. Timing margin $\approx T-0.35=1.0-0.35=0.65$ ns.</p>` },
    { q: String.raw`An eye's vertical opening is 0.8 V and the decision threshold is centred. What Gaussian noise RMS keeps errors rare, roughly using a $\pm 3\sigma$ margin rule?`, solution: String.raw`<p>Noise margin $=0.8/2=0.4$ V. For a $3\sigma$ margin, $3\sigma\le0.4\Rightarrow\sigma\le0.133$ V RMS. Keeping the noise RMS below ~0.13 V makes threshold crossings (errors) rare.</p>` },
    { q: String.raw`Two systems use $\beta=0.2$ and $\beta=0.5$. Qualitatively and via eye width, which is easier for timing recovery, and why?`, solution: String.raw`<p>$\beta=0.5$ produces a wider, more open eye with gentler crossing slopes, so the sampling clock has more timing margin and small phase errors cause less amplitude error. $\beta=0.2$ gives a narrow eye with steep crossings — spectrally efficient but far more demanding on the clock-recovery loop.</p>` },
    { q: String.raw`The ideal eye opening is 1.2 V; after adding a channel that closes it to 0.3 V, is the link usable, and what does this imply?`, solution: String.raw`<p>Penalty $=20\log_{10}(1.2/0.3)=20\log_{10}(4)=12$ dB — a severe reduction. The eye is nearly closed; the link needs equalisation (or a stronger signal / better shaping) to restore an acceptable opening and BER.</p>` }
  ],
  realWorld: String.raw`<p>Eye diagrams are the first thing engineers pull up on a sampling scope or in SDR analysis software when a link misbehaves. High-speed serial standards (PCIe, USB, Ethernet SerDes, DDR) mandate eye <em>mask tests</em>: the trace must clear a forbidden polygon to guarantee margin. In wireless SDR bring-up, plotting the eye after the RRC matched filter instantly reveals whether the receive filter is matched, whether symbol timing is locked, and whether the channel is adding ISI — long before you trust a BER number. Because it fuses timing, amplitude and jitter into one persistence display, the eye remains the fastest go/no-go diagnostic in the digital-comms toolbox, and it ties directly to the BER and EVM you will later measure.</p>`,
  related: ['pulse-shaping', 'ber', 'evm', 'matched-filter']
},
{
  id: 'ber',
  title: 'Bit Error Rate (BER)',
  category: 'Modulation & Detection',
  tags: ['BER', 'SER', 'Q-function', 'waterfall', 'coding', 'EVM'],
  summary: String.raw`Bit error rate is the fraction of received bits that are wrong, the fundamental figure of merit that ties modulation choice, Eb/N0, coding and channel together.`,
  prerequisites: ['bpsk', 'noise', 'eb-no', 'comm-basics'],
  intro: String.raw`<p>Bit error rate (BER) is the single most important performance number in digital communications: of all the bits sent, what fraction arrive wrong? It is the currency in which every design decision is paid — modulation order, transmit power, coding, bandwidth, and receiver quality all ultimately show up as a point on a BER-versus-$E_b/N_0$ curve. A well-designed link targets a BER low enough (e.g. $10^{-6}$ raw, or $10^{-12}$ after coding) that the application sees essentially error-free data. Understanding BER means understanding the Q-function relationships for each modulation, the "waterfall" shape of the curves, how coding shifts them, and how many bits you must actually observe to measure a small BER with confidence.</p>`,
  sections: [
    {
      h: 'Definition, BER vs SER',
      html: String.raw`<p><strong>Bit error rate</strong> is the probability that a received bit differs from the transmitted bit, estimated as</p>
      <p>$$\text{BER}=\frac{\text{number of bit errors}}{\text{total bits transmitted}}.$$</p>
      <p><strong>Symbol error rate (SER)</strong> is the probability that a whole symbol (which may carry several bits) is wrong. The two differ because one symbol error may corrupt several bits — or, with good bit mapping, only one.</p>
      <ul>
        <li>For binary schemes (BPSK), one symbol = one bit, so BER = SER.</li>
        <li>For $M$-ary schemes with $k=\log_2 M$ bits/symbol, a symbol error usually flips a subset of those $k$ bits.</li>
        <li>With <strong>Gray coding</strong>, adjacent constellation points differ by exactly one bit, so a (most-likely) nearest-neighbour symbol error causes just one bit error, giving the useful approximation</li>
      </ul>
      <p>$$\text{BER}\approx\frac{\text{SER}}{\log_2 M}\quad(\text{Gray-coded, high SNR}).$$</p>
      <div class="callout">Always state whether a "%error" figure is per bit or per symbol — confusing them mis-estimates link margin by a factor of $\log_2 M$.</div></p>`
    },
    {
      h: 'BER of BPSK and QPSK',
      html: String.raw`<p>For coherent <strong>BPSK</strong> over an AWGN channel with matched filtering, the exact bit error probability is</p>
      <p>$$P_b^{\text{BPSK}}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right),$$</p>
      <p>where $Q(x)=\tfrac12\,\text{erfc}(x/\sqrt2)$ is the tail probability of the standard normal. The argument $\sqrt{2E_b/N_0}$ is the ratio of the distance between the two signal points to the noise standard deviation.</p>
      <p><strong>QPSK</strong> is two orthogonal BPSK channels (I and Q) each carrying half the bits at the same $E_b/N_0$. Consequently its <em>bit</em> error rate is identical to BPSK:</p>
      <p>$$P_b^{\text{QPSK}}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right).$$</p>
      <p>QPSK delivers twice the spectral efficiency of BPSK for the <em>same</em> BER-vs-$E_b/N_0$ — the classic "free lunch" of QPSK. (Its <em>symbol</em> error rate is roughly twice the bit error rate.)</p></p>`
    },
    {
      h: 'BER of M-PSK and M-QAM',
      html: String.raw`<p>Higher-order modulations pack more bits per symbol but crowd the constellation, so they need more $E_b/N_0$ for the same BER. Useful Gray-coded AWGN approximations:</p>
      <p><strong>$M$-PSK</strong> (for $M\ge4$):</p>
      <p>$$P_b^{M\text{-PSK}}\approx\frac{2}{\log_2 M}\,Q\!\left(\sqrt{\frac{2E_b\log_2 M}{N_0}}\,\sin\frac{\pi}{M}\right).$$</p>
      <p><strong>Square $M$-QAM</strong>:</p>
      <p>$$P_b^{M\text{-QAM}}\approx\frac{4}{\log_2 M}\left(1-\frac{1}{\sqrt M}\right)Q\!\left(\sqrt{\frac{3\log_2 M}{M-1}\cdot\frac{E_b}{N_0}}\right).$$</p>
      <table class="data">
        <tr><th>Scheme</th><th>Bits/symbol</th><th>$E_b/N_0$ for BER $=10^{-6}$ (approx)</th></tr>
        <tr><td>BPSK / QPSK</td><td>1 / 2</td><td>$\approx 10.5$ dB</td></tr>
        <tr><td>8-PSK</td><td>3</td><td>$\approx 14$ dB</td></tr>
        <tr><td>16-QAM</td><td>4</td><td>$\approx 14.5$ dB</td></tr>
        <tr><td>64-QAM</td><td>6</td><td>$\approx 18.8$ dB</td></tr>
        <tr><td>256-QAM</td><td>8</td><td>$\approx 24$ dB</td></tr>
      </table>
      <div class="callout">Each step up in QAM order buys $\sim2$ bits/symbol but costs several dB of required $E_b/N_0$ — the fundamental spectral-efficiency-versus-power trade.</div></p>`
    },
    {
      h: 'The waterfall curve',
      html: String.raw`<p>Plotting $\log_{10}(\text{BER})$ against $E_b/N_0$ in dB gives the characteristic <strong>waterfall curve</strong>: nearly flat at low SNR, then plunging steeply once $E_b/N_0$ crosses a threshold. The steepness comes from the exponential tail of the Q-function — a 1–2 dB increase in $E_b/N_0$ can drop BER by an order of magnitude in the steep region.</p>
      <ul>
        <li>Curves for higher-order modulation sit to the <strong>right</strong> (need more $E_b/N_0$) but enable higher throughput.</li>
        <li>A curve that flattens into an <strong>error floor</strong> (stops dropping) signals a non-noise impairment: residual ISI, phase noise, quantisation, or an imperfect receiver — noise alone never floors.</li>
        <li>The horizontal gap between two curves at a fixed BER is the <strong>SNR penalty/gain</strong> of one scheme over another.</li>
      </ul></p>`
    },
    {
      h: 'Coded vs uncoded BER and coding gain',
      html: String.raw`<p>Forward error correction (FEC) adds redundancy so the decoder can correct some errors, shifting the waterfall curve <strong>left</strong>. The horizontal distance (in dB) between the coded and uncoded curves at a target BER is the <strong>coding gain</strong>.</p>
      <ul>
        <li><strong>Uncoded</strong> BER follows the raw Q-function laws above.</li>
        <li><strong>Coded</strong> BER can be several dB better at useful BERs; e.g. a good convolutional + Viterbi code yields ~5 dB of coding gain, modern LDPC/turbo codes approach the Shannon limit.</li>
        <li>Coding costs <strong>rate</strong>: a rate-$1/2$ code doubles the channel bits, so you compare at equal information rate. At very high SNR a weak code can even lose (crossover), but in the operating region coding wins decisively.</li>
      </ul>
      <div class="callout">Coding gain is "free" transmit power: 5 dB of coding gain is worth the same BER improvement as tripling the transmit power, without more watts.</div></p>`
    },
    {
      h: 'Measuring BER: confidence and bit count',
      html: String.raw`<p>BER is a probability, so measuring a <em>small</em> BER needs many bits. To observe even a handful of errors at BER $=10^{-9}$ you must send billions of bits. The number of bits required for a given <strong>confidence level</strong> $CL$ with zero observed errors is</p>
      <p>$$N=\frac{-\ln(1-CL)}{\text{BER}}.$$</p>
      <p>For 95% confidence ($CL=0.95$, $-\ln 0.05\approx3.0$): $N\approx3/\text{BER}$. So confirming BER $\le10^{-9}$ at 95% confidence with no errors needs $\approx3\times10^{9}$ bits.</p>
      <ul>
        <li>Rule of thumb: to <em>measure</em> (not just bound) a BER you want at least ~100 error events, so $N\approx100/\text{BER}$.</li>
        <li>Test time explodes at low BER — hence extrapolation from higher-BER measurements along the theoretical curve, and use of accelerated/stressed-eye methods.</li>
        <li><strong>Relation to EVM:</strong> for AWGN-limited links, error-vector magnitude and BER are two views of the same SNR. Approximately $\text{SNR}\approx1/\text{EVM}_{\text{rms}}^2$, so EVM feeds directly into the Q-function BER prediction — a fast proxy when you cannot run enough bits to measure BER directly.</li>
      </ul></p>`
    }
  ],
  keyPoints: [
    String.raw`BER = (bit errors)/(total bits); it is the master figure of merit for a digital link.`,
    String.raw`SER counts symbol errors; with Gray coding at high SNR, BER $\approx$ SER$/\log_2 M$.`,
    String.raw`For BPSK and QPSK, $P_b=Q(\sqrt{2E_b/N_0})$ — identical BER, but QPSK is twice as spectrally efficient.`,
    String.raw`Higher-order M-QAM/M-PSK need more $E_b/N_0$ for the same BER (constellation points crowd together).`,
    String.raw`$Q(x)=\tfrac12\,\text{erfc}(x/\sqrt2)$ is the tail of the normal distribution; its exponential tail makes BER curves steep.`,
    String.raw`The waterfall curve is flat at low SNR then plunges; higher-order modulations sit to the right.`,
    String.raw`An error floor (BER stops dropping) indicates a non-noise impairment: ISI, phase noise, or receiver limits.`,
    String.raw`FEC shifts the waterfall left; the dB gap at a target BER is the coding gain (typically several dB).`,
    String.raw`Coding gain trades bandwidth/rate for effective transmit power without extra watts.`,
    String.raw`Measuring BER needs many bits: $N\approx-\ln(1-CL)/\text{BER}$ for confidence $CL$ with no errors.`,
    String.raw`Rule of thumb: ~100 error events ($N\approx100/\text{BER}$) to reliably measure a BER.`,
    String.raw`EVM and BER are two views of the same SNR; $\text{SNR}\approx1/\text{EVM}^2$ lets EVM predict BER.`
  ],
  equations: [
    {
      title: 'BPSK/QPSK bit error probability',
      tex: String.raw`$$P_b=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)=\tfrac12\,\text{erfc}\!\left(\sqrt{\frac{E_b}{N_0}}\right)$$`,
      derivation: String.raw`<p>Antipodal BPSK signals sit at $\pm\sqrt{E_b}$ with matched-filter noise variance $N_0/2$. The decision threshold is 0, so an error occurs when noise exceeds $\sqrt{E_b}$ in the wrong direction: $P_b=Q(\sqrt{E_b}/\sqrt{N_0/2})=Q(\sqrt{2E_b/N_0})$. Using $Q(x)=\tfrac12\text{erfc}(x/\sqrt2)$ gives the erfc form. QPSK is two independent such BPSK rails, so its per-bit probability is the same.</p>`
    },
    {
      title: 'BER–SER relation (Gray coding)',
      tex: String.raw`$$\text{BER}\approx\frac{\text{SER}}{\log_2 M}$$`,
      derivation: String.raw`<p>At useful SNR the dominant symbol errors are to nearest neighbours. Gray coding assigns adjacent symbols labels differing in exactly one bit, so each such symbol error flips one of the $\log_2 M$ bits. Averaging one wrong bit per erroneous symbol over $\log_2 M$ bits gives $\text{BER}\approx\text{SER}/\log_2 M$.</p>`
    },
    {
      title: 'M-QAM approximate BER',
      tex: String.raw`$$P_b\approx\frac{4}{\log_2 M}\Big(1-\frac{1}{\sqrt M}\Big)Q\!\left(\sqrt{\frac{3\log_2 M}{M-1}\frac{E_b}{N_0}}\right)$$`,
      derivation: String.raw`<p>Square $M$-QAM factors into two independent $\sqrt M$-PAM rails. The nearest-neighbour distance sets the Q-function argument; the average symbol energy for square QAM gives the $3/(M-1)$ scaling of $E_s/N_0$, and converting $E_s=\log_2 M\,E_b$ yields the $3\log_2 M/(M-1)$ factor. The prefactor counts average nearest neighbours per bit under Gray mapping.</p>`
    },
    {
      title: 'M-PSK approximate BER',
      tex: String.raw`$$P_b\approx\frac{2}{\log_2 M}\,Q\!\left(\sqrt{\frac{2E_b\log_2 M}{N_0}}\,\sin\frac{\pi}{M}\right)$$`,
      derivation: String.raw`<p>For $M$-PSK the points lie on a circle of radius $\sqrt{E_s}$; the minimum distance between adjacent points is $2\sqrt{E_s}\sin(\pi/M)$. Halving for the decision boundary and dividing by noise $\sigma=\sqrt{N_0/2}$ gives the Q-argument $\sqrt{2E_s/N_0}\sin(\pi/M)$. Substituting $E_s=\log_2 M\,E_b$ and dividing by $\log_2 M$ (Gray coding) yields the per-bit form.</p>`
    },
    {
      title: 'Bits needed for a confident BER measurement',
      tex: String.raw`$$N=\frac{-\ln(1-CL)}{\text{BER}}$$`,
      derivation: String.raw`<p>With independent bits, the number of errors is Poisson with mean $\lambda=N\cdot\text{BER}$. The probability of observing zero errors is $e^{-\lambda}$. To claim BER at confidence $CL$ having seen no errors, require $e^{-\lambda}\le1-CL$, i.e. $\lambda\ge-\ln(1-CL)$, giving $N\ge-\ln(1-CL)/\text{BER}$. For 95% confidence, $-\ln0.05\approx3$, so $N\approx3/\text{BER}$.</p>`
    },
    {
      title: 'EVM to SNR (BER proxy)',
      tex: String.raw`$$\text{SNR}\approx\frac{1}{\text{EVM}_{\text{rms}}^2}\;\Rightarrow\;\frac{E_b}{N_0}=\frac{\text{SNR}}{\log_2 M}$$`,
      derivation: String.raw`<p>EVM (rms) is the ratio of the error-vector RMS to the reference constellation RMS amplitude. In an AWGN-limited system the error vector is the noise, so the noise-to-signal power ratio is $\text{EVM}^2$, hence $\text{SNR}\approx1/\text{EVM}^2$. Converting SNR to $E_b/N_0$ via $E_b/N_0=\text{SNR}/\log_2 M$ feeds the Q-function BER formulas, letting a quick EVM measurement predict BER.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`Define bit error rate.`, back: String.raw`The fraction of received bits that are in error: (bit errors)/(total bits transmitted).` },
    { front: String.raw`How do BER and SER relate for Gray-coded $M$-ary at high SNR?`, back: String.raw`BER $\approx$ SER$/\log_2 M$, since a nearest-neighbour symbol error flips one bit.` },
    { front: String.raw`BER of BPSK in AWGN?`, back: String.raw`$P_b=Q(\sqrt{2E_b/N_0})$.` },
    { front: String.raw`How does QPSK's BER compare to BPSK's?`, back: String.raw`Identical per-bit BER, $Q(\sqrt{2E_b/N_0})$, but QPSK carries twice the bits per Hz.` },
    { front: String.raw`Why do higher-order QAM/PSK need more $E_b/N_0$?`, back: String.raw`More constellation points crowd together, shrinking the minimum distance, so more energy is needed for the same error probability.` },
    { front: String.raw`What is the Q-function?`, back: String.raw`$Q(x)=\tfrac12\text{erfc}(x/\sqrt2)$, the tail probability that a standard normal exceeds $x$.` },
    { front: String.raw`What is the waterfall curve?`, back: String.raw`BER (log scale) vs $E_b/N_0$ (dB): flat at low SNR then plunging steeply due to the Q-function's exponential tail.` },
    { front: String.raw`What does an error floor indicate?`, back: String.raw`A non-noise impairment (residual ISI, phase noise, quantisation, receiver imperfection); noise alone never floors.` },
    { front: String.raw`What is coding gain?`, back: String.raw`The dB shift left of the BER curve at a target BER when FEC is added — effectively free transmit power.` },
    { front: String.raw`How many bits to confirm BER $\le10^{-9}$ at 95% confidence with no errors?`, back: String.raw`$N\approx3/\text{BER}=3\times10^{9}$ bits.` },
    { front: String.raw`Rule of thumb for reliably measuring a BER?`, back: String.raw`Observe about 100 error events, i.e. $N\approx100/\text{BER}$ bits.` },
    { front: String.raw`How does EVM relate to BER?`, back: String.raw`In AWGN, $\text{SNR}\approx1/\text{EVM}^2$; converting to $E_b/N_0$ feeds the Q-function to predict BER.` },
    { front: String.raw`For BPSK, how do BER and SER compare?`, back: String.raw`They are equal — one symbol equals one bit.` },
    { front: String.raw`What does a rate-1/2 FEC code cost?`, back: String.raw`It doubles the channel bits (halves the information rate for a fixed channel rate); compare coded vs uncoded at equal information rate.` }
  ],
  mcqs: [
    { q: String.raw`The bit error rate of coherent BPSK in AWGN is:`, options: [String.raw`$Q(\sqrt{E_b/N_0})$`, String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$Q(E_b/N_0)$`], answer: 1, explain: String.raw`Antipodal BPSK gives $P_b=Q(\sqrt{2E_b/N_0})$ with matched filtering.` },
    { q: String.raw`Compared with BPSK, coherent QPSK has:`, options: [String.raw`Twice the BER`, String.raw`The same BER but twice the spectral efficiency`, String.raw`Half the BER`, String.raw`Four times the BER`], answer: 1, explain: String.raw`QPSK is two orthogonal BPSK rails: same per-bit BER, double the bits per Hz.` },
    { q: String.raw`For a Gray-coded 16-QAM system at high SNR, BER is approximately:`, options: [String.raw`Equal to SER`, String.raw`SER divided by 4`, String.raw`SER times 4`, String.raw`SER squared`], answer: 1, explain: String.raw`$\log_2 16=4$, so a nearest-neighbour symbol error flips ~1 of 4 bits, giving BER $\approx$ SER/4.` },
    { q: String.raw`A BER curve that flattens and stops dropping as $E_b/N_0$ increases indicates:`, options: [String.raw`Perfect performance`, String.raw`An error floor from a non-noise impairment`, String.raw`Thermal noise dominance`, String.raw`Ideal matched filtering`], answer: 1, explain: String.raw`Pure AWGN never floors; a floor means ISI, phase noise, quantisation, or a receiver imperfection dominates.` },
    { q: String.raw`Coding gain is:`, options: [String.raw`The extra bandwidth used by FEC`, String.raw`The dB shift left of the BER curve at a target BER`, String.raw`The symbol rate increase`, String.raw`The number of parity bits`], answer: 1, explain: String.raw`Coding gain is the horizontal (dB) distance between coded and uncoded curves at the same BER.` },
    { q: String.raw`To confirm BER $\le10^{-6}$ at 95% confidence with zero observed errors, roughly how many bits are needed?`, options: [String.raw`$10^{6}$`, String.raw`$3\times10^{6}$`, String.raw`$100$`, String.raw`$10^{12}$`], answer: 1, explain: String.raw`$N\approx-\ln(0.05)/\text{BER}\approx3/10^{-6}=3\times10^{6}$ bits.` },
    { q: String.raw`Why do higher-order modulations sit to the right on the BER waterfall plot?`, options: [String.raw`They use less power`, String.raw`They need more $E_b/N_0$ for the same BER`, String.raw`They have lower spectral efficiency`, String.raw`They avoid noise`], answer: 1, explain: String.raw`Denser constellations have smaller minimum distance, so they require more $E_b/N_0$ to hit the same BER.` },
    { q: String.raw`The steepness of the BER waterfall comes from:`, options: [String.raw`The linear part of the channel`, String.raw`The exponential tail of the Q-function`, String.raw`The sampling theorem`, String.raw`The roll-off factor`], answer: 1, explain: String.raw`$Q(x)$ decays roughly as $e^{-x^2/2}$, so a small $E_b/N_0$ increase drops BER by orders of magnitude.` },
    { q: String.raw`For BPSK, the relationship between BER and SER is:`, options: [String.raw`BER = SER/2`, String.raw`BER = SER`, String.raw`BER = 2·SER`, String.raw`Unrelated`], answer: 1, explain: String.raw`One BPSK symbol carries one bit, so a symbol error is exactly a bit error.` },
    { q: String.raw`Approximately how does EVM relate to SNR in an AWGN-limited link?`, options: [String.raw`$\text{SNR}\approx\text{EVM}^2$`, String.raw`$\text{SNR}\approx1/\text{EVM}^2$`, String.raw`$\text{SNR}\approx\text{EVM}$`, String.raw`$\text{SNR}\approx1/\text{EVM}$`], answer: 1, explain: String.raw`The error vector is the noise, so noise-to-signal power is $\text{EVM}^2$ and SNR $\approx1/\text{EVM}^2$.` },
    { q: String.raw`A rate-1/2 FEC code, compared uncoded at equal information rate, mainly:`, options: [String.raw`Reduces bandwidth`, String.raw`Shifts the BER curve left (coding gain) at the cost of channel bandwidth/rate`, String.raw`Increases BER`, String.raw`Removes the need for modulation`], answer: 1, explain: String.raw`FEC corrects errors, moving the waterfall left; the price is redundancy (more channel bits).` },
    { q: String.raw`The Q-function $Q(x)$ equals:`, options: [String.raw`$\text{erfc}(x)$`, String.raw`$\tfrac12\text{erfc}(x/\sqrt2)$`, String.raw`$1-\text{erf}(x)$`, String.raw`$e^{-x}$`], answer: 1, explain: String.raw`$Q(x)=\tfrac12\text{erfc}(x/\sqrt2)$ is the standard-normal tail probability.` }
  ],
  numericals: [
    { q: String.raw`A BPSK link operates at $E_b/N_0=9$ dB. Estimate the BER. (Use $Q(x)\approx\tfrac12 e^{-x^2/2}$ for a quick estimate.)`, solution: String.raw`<p>$E_b/N_0=10^{0.9}=7.94$ (linear). Argument $x=\sqrt{2\times7.94}=\sqrt{15.9}=3.99$. $Q(3.99)\approx\tfrac12 e^{-3.99^2/2}=\tfrac12 e^{-7.96}=\tfrac12(3.5\times10^{-4})\approx1.7\times10^{-4}$. (Exact tables give $\approx3.4\times10^{-5}$; the exponential approximation overestimates but shows the order.) A more precise $Q(3.99)\approx3.3\times10^{-5}$.</p>` },
    { q: String.raw`What $E_b/N_0$ (dB) does BPSK need for BER $=10^{-6}$? ($Q^{-1}(10^{-6})\approx4.75$.)`, solution: String.raw`<p>$Q(\sqrt{2E_b/N_0})=10^{-6}\Rightarrow\sqrt{2E_b/N_0}=4.75\Rightarrow2E_b/N_0=22.56\Rightarrow E_b/N_0=11.28$ (linear) $=10\log_{10}(11.28)=10.5$ dB.</p>` },
    { q: String.raw`A 16-QAM system measures SER $=4\times10^{-4}$ with Gray coding. Estimate the BER.`, solution: String.raw`<p>BER $\approx$ SER$/\log_2 16=4\times10^{-4}/4=1\times10^{-4}$.</p>` },
    { q: String.raw`How many bits must be transmitted to confirm BER $\le10^{-8}$ at 99% confidence with no errors observed?`, solution: String.raw`<p>$N=-\ln(1-0.99)/\text{BER}=-\ln(0.01)/10^{-8}=4.605/10^{-8}=4.6\times10^{8}$ bits.</p>` },
    { q: String.raw`A receiver measures rms EVM of 5% on a QPSK signal. Estimate the effective $E_b/N_0$ and comment on link health.`, solution: String.raw`<p>$\text{SNR}\approx1/\text{EVM}^2=1/(0.05)^2=1/0.0025=400=26$ dB. For QPSK, $E_b/N_0=\text{SNR}/\log_2 4=400/2=200=23$ dB. This is far above the ~10.5 dB needed for $10^{-6}$ BER, so the link is very healthy.</p>` },
    { q: String.raw`A code provides 5 dB of coding gain. If the uncoded link needs 10.5 dB $E_b/N_0$ for BER $10^{-6}$, what coded $E_b/N_0$ achieves the same BER, and what transmit-power saving does that represent?`, solution: String.raw`<p>Coded requirement $=10.5-5=5.5$ dB. The 5 dB saving corresponds to a power reduction factor of $10^{5/10}=3.16\times$ — the same BER at less than one-third the transmit power.</p>` },
    { q: String.raw`Convert: a QPSK link has SNR $=13$ dB in a bandwidth equal to its symbol rate. What is $E_b/N_0$?`, solution: String.raw`<p>SNR $=13$ dB $=20$ (linear). $E_b/N_0=\text{SNR}\cdot B/R_b$. With $B=R_s$ and QPSK $R_b=2R_s$, $E_b/N_0=20\cdot R_s/(2R_s)=10=10$ dB. Just below the ~10.5 dB for $10^{-6}$, so BER will be slightly worse than $10^{-6}$.</p>` }
  ],
  realWorld: String.raw`<p>BER is the acceptance criterion baked into every communications standard: a cellular receiver's sensitivity is specified as the lowest signal power that still meets a reference BER/BLER, and satellite links are dimensioned so that after FEC the BER is $10^{-10}$ or better. Bit-error-rate testers (BERTs) drive high-speed serial links with known pseudo-random sequences and count errors; because measuring $10^{-12}$ directly takes hours, engineers extrapolate along the theoretical waterfall or use EVM as a fast proxy. In SDR development on platforms like the AD9361 or RFSoC, plotting measured BER against $E_b/N_0$ and comparing with the $Q(\sqrt{2E_b/N_0})$ curve is the definitive check that the whole chain — pulse shaping, matched filter, synchronisation, and detection — is working to theory rather than leaving implementation loss on the table.</p>`,
  related: ['eb-no', 'bpsk', 'evm', 'fec', 'matched-filter']
},
{
  id: 'eb-no',
  title: 'Eb/N0',
  category: 'Modulation & Detection',
  tags: ['Eb/N0', 'SNR', 'Shannon', 'spectral efficiency', 'link budget'],
  summary: String.raw`Eb/N0 is the energy per information bit divided by the noise power spectral density, the normalized, modulation-fair metric against which BER performance is measured.`,
  prerequisites: ['noise', 'ber', 'comm-basics', 'psd'],
  intro: String.raw`<p>$E_b/N_0$ ("ebno") is the great equaliser of digital communications. Raw signal-to-noise ratio (SNR) mixes together the effects of bandwidth, symbol rate and modulation order, making it impossible to compare, say, BPSK against 64-QAM fairly. $E_b/N_0$ strips those out by normalising to the <em>energy carried by one information bit</em> against the <em>noise density per hertz</em>. The result is a dimensionless ratio that lets every modulation be plotted on the same axis, that reveals the ultimate Shannon limit of $-1.59$ dB, and that ties directly to the BER waterfall curves. If SNR is what a spectrum analyser shows, $E_b/N_0$ is what the theory is written in.</p>`,
  sections: [
    {
      h: 'Definition and units',
      html: String.raw`<p>$E_b$ is the received signal energy expended per <strong>information bit</strong> (joules); $N_0$ is the one-sided noise <strong>power spectral density</strong> (watts per hertz, i.e. joules). Their ratio is dimensionless:</p>
      <p>$$\frac{E_b}{N_0}=\frac{\text{energy per bit (J)}}{\text{noise PSD (J)}}\quad[\text{dimensionless}].$$</p>
      <p>Because both are energies, the units cancel — $E_b/N_0$ is a pure number, almost always quoted in dB. It answers: "for each bit I send, how much signal energy do I have relative to the noise floor per unit bandwidth?" That is precisely the quantity the matched-filter detector cares about, which is why BER formulas are written in terms of $E_b/N_0$ rather than SNR.</p>
      <div class="callout">Related normalisations: $E_s/N_0$ uses energy per <em>symbol</em> ($E_s=\log_2 M\cdot E_b$), and $E_b/N_0=(E_s/N_0)/\log_2 M$. For BPSK the two coincide.</div></p>`
    },
    {
      h: 'Relation to SNR',
      html: String.raw`<p>The bridge between the theorist's $E_b/N_0$ and the instrument's SNR is:</p>
      <p>$$\frac{E_b}{N_0}=\text{SNR}\cdot\frac{B}{R_b},$$</p>
      <p>where $B$ is the noise bandwidth and $R_b$ is the information bit rate. Equivalently $\text{SNR}=\dfrac{E_b}{N_0}\cdot\dfrac{R_b}{B}=\dfrac{E_b}{N_0}\cdot\eta$, with $\eta=R_b/B$ the spectral efficiency in bits/s/Hz.</p>
      <ul>
        <li>Signal power $S=E_b\cdot R_b$ (energy/bit times bits/s).</li>
        <li>Noise power $N=N_0\cdot B$ (PSD times bandwidth).</li>
        <li>So $\text{SNR}=S/N=(E_b R_b)/(N_0 B)=(E_b/N_0)(R_b/B)$.</li>
      </ul>
      <p>The key insight: at a given $E_b/N_0$, cramming more bits into the same bandwidth (higher $\eta$) demands a proportionally higher SNR. This is why 64-QAM "looks" much noisier-sensitive than BPSK on a spectrum analyser even though, per bit, the comparison is what $E_b/N_0$ makes fair.</p></p>`
    },
    {
      h: 'Why Eb/N0 is the fair modulation comparison',
      html: String.raw`<p>SNR alone is ambiguous: two systems with the same SNR can have wildly different bit rates and therefore different energy per bit. $E_b/N_0$ removes bandwidth and rate from the comparison, isolating the <em>modulation and coding efficiency</em>. Plotting BER against $E_b/N_0$:</p>
      <ul>
        <li>Puts BPSK, QPSK, 16-QAM, coded and uncoded systems on one graph.</li>
        <li>Shows the true "power efficiency" of a scheme — how little energy per bit it needs for a target BER.</li>
        <li>Separates <strong>power efficiency</strong> (position on the $E_b/N_0$ axis) from <strong>bandwidth efficiency</strong> (the $\eta$ it achieves).</li>
      </ul>
      <div class="callout">BPSK and QPSK have <em>identical</em> BER-vs-$E_b/N_0$ curves — equally power-efficient — but QPSK is twice as bandwidth-efficient. $E_b/N_0$ is exactly the axis on which this equivalence is visible.</div></p>`
    },
    {
      h: 'The Shannon limit and −1.59 dB',
      html: String.raw`<p>Shannon's capacity theorem, $C=B\log_2(1+\text{SNR})$, sets the absolute ceiling. Rewriting in terms of $E_b/N_0$ and spectral efficiency $\eta=R_b/B$ (setting $R_b=C$ for capacity-achieving operation):</p>
      <p>$$\frac{E_b}{N_0}=\frac{2^{\eta}-1}{\eta}.$$</p>
      <p>As spectral efficiency $\eta\to0$ (infinite bandwidth, vanishingly few bits per Hz), this approaches the fundamental minimum:</p>
      <p>$$\lim_{\eta\to0}\frac{E_b}{N_0}=\ln 2=0.693=-1.59\ \text{dB}.$$</p>
      <p>This <strong>Shannon limit of $-1.59$ dB</strong> is the least energy per bit at which <em>any</em> reliable (arbitrarily low BER) communication is possible. No modulation or code, however clever, can operate below it. Practical systems sit some distance to the right; the "gap to Shannon" is a headline figure of merit — modern LDPC/turbo codes close it to within a fraction of a dB.</p></p>`
    },
    {
      h: 'The spectral-efficiency (bandwidth vs power) plane',
      html: String.raw`<p>Plotting achievable spectral efficiency $\eta$ (bits/s/Hz) against required $E_b/N_0$ (dB) gives the <strong>bandwidth-efficiency plane</strong>, the master map of digital communications:</p>
      <ul>
        <li>The Shannon bound $\eta=\log_2(1+\eta\,E_b/N_0)$ is a curve; every real system lives to its right/below.</li>
        <li>The <strong>power-limited region</strong> ($\eta<1$, e.g. deep-space, spread spectrum): bandwidth is plentiful, energy is scarce; you trade bandwidth for lower $E_b/N_0$, approaching $-1.59$ dB.</li>
        <li>The <strong>bandwidth-limited region</strong> ($\eta>1$, e.g. cable, dense wireless): spectrum is scarce; high-order QAM pushes $\eta$ up at the cost of much higher required $E_b/N_0$.</li>
        <li>Moving up the plane (more bits/Hz) always costs more energy per bit — the fundamental power/bandwidth trade.</li>
      </ul>
      <table class="data">
        <tr><th>Regime</th><th>$\eta$</th><th>Strategy</th><th>Example</th></tr>
        <tr><td>Power-limited</td><td>$<1$</td><td>Spread bandwidth, strong FEC</td><td>Deep space, DSSS</td></tr>
        <tr><td>Balanced</td><td>$\approx1$-$2$</td><td>QPSK/8-PSK + coding</td><td>Satellite, WiFi lower rates</td></tr>
        <tr><td>Bandwidth-limited</td><td>$>2$</td><td>High-order QAM</td><td>Cable modems, LTE/5G peak</td></tr>
      </table></p>`
    },
    {
      h: 'Link to BER curves and link budgets',
      html: String.raw`<p>$E_b/N_0$ is the input axis of every BER waterfall curve. For BPSK/QPSK, $P_b=Q(\sqrt{2E_b/N_0})$ — the BER is a direct function of $E_b/N_0$ alone. This makes $E_b/N_0$ the natural bridge between a <strong>link budget</strong> (which computes received power, noise density, and hence available $E_b/N_0$) and a <strong>BER requirement</strong> (which specifies the needed $E_b/N_0$):</p>
      <ul>
        <li>Received $E_b/N_0 = \dfrac{P_{rx}}{N_0 R_b}$ where $P_{rx}$ is received power and $N_0=kT_{sys}$ (thermal noise density).</li>
        <li>The <strong>link margin</strong> is the difference (in dB) between available $E_b/N_0$ and the $E_b/N_0$ the modulation+coding needs for the target BER.</li>
        <li>Adding coding lowers the <em>required</em> $E_b/N_0$ (coding gain), directly increasing margin without more transmit power.</li>
      </ul>
      <div class="callout"><strong>Design loop:</strong> pick a BER target &rarr; read required $E_b/N_0$ from the modulation's curve &rarr; add coding gain and implementation loss &rarr; check the link budget delivers that $E_b/N_0$ with positive margin.</div></p>`
    }
  ],
  keyPoints: [
    String.raw`$E_b/N_0$ is energy per information bit divided by noise PSD — a dimensionless ratio, usually in dB.`,
    String.raw`It normalises away bandwidth and rate, making modulations directly comparable on one BER axis.`,
    String.raw`$E_b/N_0=\text{SNR}\cdot B/R_b$; equivalently $\text{SNR}=(E_b/N_0)\cdot\eta$ with $\eta=R_b/B$.`,
    String.raw`$E_s/N_0=\log_2 M\cdot E_b/N_0$; for BPSK the two are equal.`,
    String.raw`BPSK and QPSK share identical BER-vs-$E_b/N_0$ curves — equally power-efficient, QPSK twice as bandwidth-efficient.`,
    String.raw`The Shannon limit is $E_b/N_0=\ln 2=-1.59$ dB — the minimum for any reliable communication.`,
    String.raw`As spectral efficiency $\eta\to0$, required $E_b/N_0\to-1.59$ dB (power-limited, infinite-bandwidth regime).`,
    String.raw`Higher spectral efficiency always demands more $E_b/N_0$: the fundamental bandwidth-vs-power trade.`,
    String.raw`The bandwidth-efficiency plane maps $\eta$ vs required $E_b/N_0$; real systems live to the right of the Shannon bound.`,
    String.raw`For BPSK/QPSK, BER $=Q(\sqrt{2E_b/N_0})$ — BER is a function of $E_b/N_0$ alone.`,
    String.raw`Link margin = available $E_b/N_0$ minus required $E_b/N_0$; coding gain raises margin for free.`,
    String.raw`Received $E_b/N_0=P_{rx}/(N_0 R_b)$ ties the link budget to the BER requirement.`
  ],
  equations: [
    {
      title: 'Definition',
      tex: String.raw`$$\frac{E_b}{N_0}=\frac{S/R_b}{N/B}=\frac{S}{N}\cdot\frac{B}{R_b}$$`,
      derivation: String.raw`<p>Energy per bit is signal power divided by bit rate, $E_b=S/R_b$. Noise PSD is noise power divided by bandwidth, $N_0=N/B$. Dividing, $E_b/N_0=(S/R_b)/(N/B)=(S/N)(B/R_b)$, i.e. SNR scaled by bandwidth-to-bit-rate.</p>`
    },
    {
      title: 'Eb/N0 to SNR conversion',
      tex: String.raw`$$\text{SNR}=\frac{E_b}{N_0}\cdot\frac{R_b}{B}=\frac{E_b}{N_0}\cdot\eta$$`,
      derivation: String.raw`<p>Rearranging the definition, $\text{SNR}=(E_b/N_0)(R_b/B)$. Since spectral efficiency $\eta=R_b/B$, we get $\text{SNR}=(E_b/N_0)\eta$. In dB: $\text{SNR}_{dB}=(E_b/N_0)_{dB}+10\log_{10}\eta$.</p>`
    },
    {
      title: 'Es/N0 relation',
      tex: String.raw`$$\frac{E_s}{N_0}=\log_2 M\cdot\frac{E_b}{N_0}$$`,
      derivation: String.raw`<p>Each symbol carries $k=\log_2 M$ bits and thus $k$ times the energy of one bit: $E_s=kE_b$. Dividing both by $N_0$ gives $E_s/N_0=k\,E_b/N_0$. In dB, add $10\log_{10}(\log_2 M)$.</p>`
    },
    {
      title: 'Shannon limit on Eb/N0',
      tex: String.raw`$$\frac{E_b}{N_0}\ge\frac{2^{\eta}-1}{\eta}\;\xrightarrow{\eta\to0}\;\ln 2=-1.59\text{ dB}$$`,
      derivation: String.raw`<p>Shannon capacity $C=B\log_2(1+\text{SNR})$. Set $R_b=C$ and $\eta=C/B$, so $\eta=\log_2(1+\text{SNR})\Rightarrow\text{SNR}=2^{\eta}-1$. Substitute $\text{SNR}=(E_b/N_0)\eta$: $(E_b/N_0)\eta=2^{\eta}-1\Rightarrow E_b/N_0=(2^{\eta}-1)/\eta$. Taking $\eta\to0$ and using $2^{\eta}-1\approx\eta\ln2$ gives the limit $\ln2=0.693=-1.59$ dB.</p>`
    },
    {
      title: 'Received Eb/N0 (link budget)',
      tex: String.raw`$$\frac{E_b}{N_0}=\frac{P_{rx}}{N_0 R_b}=\frac{P_{rx}}{k T_{sys} R_b}$$`,
      derivation: String.raw`<p>Received energy per bit is received power over bit rate, $E_b=P_{rx}/R_b$. Thermal noise density $N_0=kT_{sys}$ (Boltzmann constant times system noise temperature). Dividing gives $E_b/N_0=P_{rx}/(kT_{sys}R_b)$, the link-budget form connecting received power to available $E_b/N_0$.</p>`
    },
    {
      title: 'BER as a function of Eb/N0 (BPSK/QPSK)',
      tex: String.raw`$$P_b=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)$$`,
      derivation: String.raw`<p>The matched-filter output for antipodal signalling separates the two symbols by a distance proportional to $\sqrt{E_b}$ against noise $\sigma=\sqrt{N_0/2}$. The error probability is the Gaussian tail $Q(\text{distance}/\sigma)=Q(\sqrt{2E_b/N_0})$, showing BER depends on $E_b/N_0$ alone.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What is $E_b/N_0$?`, back: String.raw`Energy per information bit divided by noise power spectral density — a dimensionless ratio, usually in dB.` },
    { front: String.raw`Why is $E_b/N_0$ preferred over SNR for comparing modulations?`, back: String.raw`It normalises out bandwidth and bit rate, isolating modulation/coding efficiency so schemes plot on one BER axis.` },
    { front: String.raw`How are $E_b/N_0$ and SNR related?`, back: String.raw`$E_b/N_0=\text{SNR}\cdot B/R_b$; equivalently $\text{SNR}=(E_b/N_0)\cdot\eta$ with $\eta=R_b/B$.` },
    { front: String.raw`Relation between $E_s/N_0$ and $E_b/N_0$?`, back: String.raw`$E_s/N_0=\log_2 M\cdot E_b/N_0$; for BPSK they are equal.` },
    { front: String.raw`What is the Shannon limit on $E_b/N_0$?`, back: String.raw`$\ln 2=0.693=-1.59$ dB — the minimum for any reliable communication.` },
    { front: String.raw`When is the $-1.59$ dB limit approached?`, back: String.raw`As spectral efficiency $\eta\to0$ (infinite bandwidth, very few bits per Hz — the power-limited regime).` },
    { front: String.raw`Do BPSK and QPSK differ in $E_b/N_0$ performance?`, back: String.raw`No — identical BER-vs-$E_b/N_0$ curves; QPSK just packs twice the bits per Hz.` },
    { front: String.raw`What is the bandwidth-efficiency plane?`, back: String.raw`A plot of spectral efficiency $\eta$ vs required $E_b/N_0$; real systems lie to the right of the Shannon bound.` },
    { front: String.raw`Power-limited vs bandwidth-limited regime?`, back: String.raw`Power-limited: $\eta<1$, trade bandwidth for low $E_b/N_0$ (deep space). Bandwidth-limited: $\eta>1$, high-order QAM at high $E_b/N_0$.` },
    { front: String.raw`How is received $E_b/N_0$ computed in a link budget?`, back: String.raw`$E_b/N_0=P_{rx}/(N_0 R_b)=P_{rx}/(kT_{sys}R_b)$.` },
    { front: String.raw`What is link margin in $E_b/N_0$ terms?`, back: String.raw`Available $E_b/N_0$ minus the $E_b/N_0$ required by the modulation+coding for the target BER.` },
    { front: String.raw`How does coding affect required $E_b/N_0$?`, back: String.raw`It lowers it (coding gain), increasing link margin without extra transmit power.` },
    { front: String.raw`Is $E_b/N_0$ dimensioned?`, back: String.raw`No — both $E_b$ and $N_0$ are energies (J), so the ratio is dimensionless, quoted in dB.` },
    { front: String.raw`For BPSK, how does BER depend on $E_b/N_0$?`, back: String.raw`$P_b=Q(\sqrt{2E_b/N_0})$ — BER is a function of $E_b/N_0$ alone.` }
  ],
  mcqs: [
    { q: String.raw`$E_b/N_0$ is the ratio of:`, options: [String.raw`Signal power to noise power`, String.raw`Energy per bit to noise power spectral density`, String.raw`Bandwidth to bit rate`, String.raw`Carrier to interference`], answer: 1, explain: String.raw`$E_b$ is energy per information bit; $N_0$ is noise PSD — their ratio is dimensionless.` },
    { q: String.raw`The relation between $E_b/N_0$ and SNR is:`, options: [String.raw`$E_b/N_0=\text{SNR}\cdot R_b/B$`, String.raw`$E_b/N_0=\text{SNR}\cdot B/R_b$`, String.raw`$E_b/N_0=\text{SNR}$`, String.raw`$E_b/N_0=\text{SNR}^2$`], answer: 1, explain: String.raw`$E_b/N_0=\text{SNR}\cdot B/R_b$; SNR is scaled by bandwidth over bit rate.` },
    { q: String.raw`The Shannon limit on $E_b/N_0$ for reliable communication is:`, options: [String.raw`0 dB`, String.raw`$-1.59$ dB`, String.raw`$+3$ dB`, String.raw`$-10$ dB`], answer: 1, explain: String.raw`As $\eta\to0$, $E_b/N_0\to\ln2=-1.59$ dB — the absolute minimum.` },
    { q: String.raw`Why do BPSK and QPSK have the same BER-vs-$E_b/N_0$ curve?`, options: [String.raw`They use the same bandwidth`, String.raw`QPSK is two orthogonal BPSK channels, equally power-efficient per bit`, String.raw`They have the same symbol rate`, String.raw`They both avoid noise`], answer: 1, explain: String.raw`QPSK's I and Q rails each behave like BPSK, so per-bit energy efficiency is identical; only bandwidth efficiency differs.` },
    { q: String.raw`For 16-QAM, $E_s/N_0$ equals $E_b/N_0$ times:`, options: [String.raw`2`, String.raw`4`, String.raw`8`, String.raw`16`], answer: 1, explain: String.raw`$\log_2 16=4$, so $E_s/N_0=4\cdot E_b/N_0$.` },
    { q: String.raw`In the power-limited regime ($\eta<1$), a designer typically:`, options: [String.raw`Uses high-order QAM`, String.raw`Spreads bandwidth and uses strong FEC to lower required $E_b/N_0$`, String.raw`Reduces bandwidth`, String.raw`Ignores coding`], answer: 1, explain: String.raw`With plentiful bandwidth but scarce energy, spreading and coding push $E_b/N_0$ toward the Shannon limit.` },
    { q: String.raw`At a fixed $E_b/N_0$, increasing spectral efficiency $\eta$:`, options: [String.raw`Lowers the required SNR`, String.raw`Raises the required SNR proportionally`, String.raw`Has no effect on SNR`, String.raw`Reduces bit rate`], answer: 1, explain: String.raw`$\text{SNR}=(E_b/N_0)\eta$, so higher $\eta$ needs proportionally higher SNR.` },
    { q: String.raw`Received $E_b/N_0$ in a link budget is:`, options: [String.raw`$P_{rx}\cdot R_b/N_0$`, String.raw`$P_{rx}/(N_0 R_b)$`, String.raw`$N_0 R_b/P_{rx}$`, String.raw`$P_{rx} N_0/R_b$`], answer: 1, explain: String.raw`$E_b=P_{rx}/R_b$ and dividing by $N_0$ gives $E_b/N_0=P_{rx}/(N_0 R_b)$.` },
    { q: String.raw`$E_b/N_0$ is preferred over SNR for modulation comparison because it:`, options: [String.raw`Is always larger`, String.raw`Normalises out bandwidth and bit rate`, String.raw`Ignores the noise`, String.raw`Depends on carrier frequency`], answer: 1, explain: String.raw`By referencing energy per bit and noise density, it removes bandwidth/rate, isolating modulation efficiency.` },
    { q: String.raw`Adding FEC to a link mainly:`, options: [String.raw`Raises the required $E_b/N_0$`, String.raw`Lowers the required $E_b/N_0$ (coding gain), raising margin`, String.raw`Increases the noise density`, String.raw`Reduces the received power`], answer: 1, explain: String.raw`Coding corrects errors, so a lower $E_b/N_0$ meets the same BER — that dB reduction is the coding gain.` },
    { q: String.raw`The bandwidth-efficiency plane plots:`, options: [String.raw`BER vs bit rate`, String.raw`Spectral efficiency $\eta$ vs required $E_b/N_0$`, String.raw`Power vs frequency`, String.raw`SNR vs bandwidth`], answer: 1, explain: String.raw`It maps achievable $\eta$ (bits/s/Hz) against the $E_b/N_0$ needed, bounded by the Shannon curve.` },
    { q: String.raw`$E_b/N_0$ is dimensionless because:`, options: [String.raw`It is measured in dB`, String.raw`Both $E_b$ and $N_0$ have units of energy (joules)`, String.raw`It ignores bandwidth`, String.raw`It is a power ratio`], answer: 1, explain: String.raw`$N_0$ in W/Hz equals J, and $E_b$ is in J, so the ratio cancels to a pure number.` }
  ],
  numericals: [
    { q: String.raw`A QPSK link has SNR $=13$ dB measured in a bandwidth equal to the symbol rate ($B=R_s$). Find $E_b/N_0$ in dB.`, solution: String.raw`<p>QPSK: $R_b=2R_s$, so $R_b/B=2$. $E_b/N_0=\text{SNR}\cdot B/R_b=\text{SNR}/2$. In dB: $13-10\log_{10}2=13-3.01=9.99\approx10$ dB.</p>` },
    { q: String.raw`A system needs $E_b/N_0=10.5$ dB for BER $10^{-6}$ using 16-QAM ($\eta=4$ b/s/Hz). What SNR does the receiver require?`, solution: String.raw`<p>$\text{SNR}=(E_b/N_0)\cdot\eta$. In dB: $10.5+10\log_{10}4=10.5+6.02=16.5$ dB.</p>` },
    { q: String.raw`Convert $E_b/N_0=8$ dB to $E_s/N_0$ for 64-QAM.`, solution: String.raw`<p>$\log_2 64=6$. $E_s/N_0=E_b/N_0+10\log_{10}6=8+7.78=15.8$ dB.</p>` },
    { q: String.raw`A deep-space link operates at spectral efficiency $\eta=0.1$ b/s/Hz. What is the theoretical minimum $E_b/N_0$ (Shannon) for this $\eta$?`, solution: String.raw`<p>$E_b/N_0=(2^{\eta}-1)/\eta=(2^{0.1}-1)/0.1=(1.0718-1)/0.1=0.718=10\log_{10}(0.718)=-1.44$ dB. Close to the $-1.59$ dB ultimate limit, as expected for small $\eta$.</p>` },
    { q: String.raw`A receiver gets $P_{rx}=-120$ dBm, has $R_b=1$ Mbps, and noise density $N_0=-174$ dBm/Hz. Compute available $E_b/N_0$.`, solution: String.raw`<p>$E_b/N_0=P_{rx}-10\log_{10}R_b-N_0$ (all in dB). $10\log_{10}(10^6)=60$ dB. $E_b/N_0=-120-60-(-174)=-120-60+174=-6$... wait: $=-180+174=-6$ dB. Hmm, that is below threshold — this link cannot support the rate without coding or more power. (If $R_b=1$ kbps instead: $-120-30+174=+24$ dB, comfortable.)</p>` },
    { q: String.raw`A modulation needs 9.6 dB $E_b/N_0$ for the target BER; the link budget delivers 12.0 dB. What is the link margin, and what does 5 dB of added coding gain do?`, solution: String.raw`<p>Margin $=12.0-9.6=2.4$ dB. With 5 dB coding gain the required $E_b/N_0$ drops to $9.6-5=4.6$ dB, so margin becomes $12.0-4.6=7.4$ dB — much more robust, at the cost of coding overhead.</p>` },
    { q: String.raw`At what spectral efficiency does the Shannon-required $E_b/N_0$ equal 0 dB (unity)?`, solution: String.raw`<p>Set $(2^{\eta}-1)/\eta=1\Rightarrow 2^{\eta}-1=\eta$. Solve numerically: at $\eta=1$, $2^1-1=1=\eta$ exactly. So $\eta=1$ b/s/Hz requires $E_b/N_0=1=0$ dB at the Shannon bound.</p>` }
  ],
  realWorld: String.raw`<p>$E_b/N_0$ is the language of link design. Satellite and deep-space engineers (NASA's DSN operates within a dB or so of the Shannon limit using powerful LDPC/turbo codes) quote required $E_b/N_0$ for each modulation-and-coding mode, then build a link budget that must deliver it with margin. Cellular and WiFi adaptive-modulation schemes pick the highest-order constellation whose required $E_b/N_0$ the measured channel can support, walking up and down the bandwidth-efficiency plane in real time. In SDR work, computing available $E_b/N_0=P_{rx}/(kT_{sys}R_b)$ and comparing it against the modulation's BER curve is the sanity check that a link will close — and the $-1.59$ dB Shannon floor is the reminder that no amount of cleverness gets something for nothing.</p>`,
  related: ['ber', 'noise', 'link-budget', 'bpsk', 'fec']
}
);
