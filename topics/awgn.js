// AWGN: Additive White Gaussian Noise
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'awgn',
    title: 'AWGN: Additive White Gaussian Noise',
    category: 'Probability & Random Signals',
    tags: ['AWGN', 'noise', 'Gaussian', 'PSD', 'channel model', 'BER', 'capacity', 'matched filter'],
    summary: String.raw`AWGN is the canonical channel model in which the received signal is the transmitted signal plus a noise process that is additive, white (flat power spectral density $N_0/2$) and Gaussian — the baseline against which every BER, capacity and link-budget result is quoted.`,
    diagram: [
    {
      title: String.raw`The AWGN channel model`,
      svg: String.raw`<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-awgn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Additive White Gaussian Noise channel</text>
        <text x="14" y="80" fill="#e6edf3">s(t)</text>
        <line x1="46" y1="76" x2="150" y2="76" stroke="#9aa7b5" marker-end="url(#arr-awgn)"/>
        <circle cx="176" cy="76" r="22" fill="#1c232e" stroke="#4dabf7"/>
        <text x="176" y="81" fill="#e6edf3" text-anchor="middle" font-size="16">+</text>
        <line x1="198" y1="76" x2="300" y2="76" stroke="#9aa7b5" marker-end="url(#arr-awgn)"/>
        <text x="330" y="80" fill="#63e6be">r(t) = s(t) + n(t)</text>
        <line x1="176" y1="150" x2="176" y2="102" stroke="#9aa7b5" marker-end="url(#arr-awgn)"/>
        <rect x="118" y="150" width="116" height="30" rx="6" fill="#1c232e" stroke="#ffa94d"/>
        <text x="176" y="169" fill="#e6edf3" text-anchor="middle">n(t)</text>
        <text x="270" y="169" fill="#9aa7b5" font-size="10">Gaussian, mean 0, flat PSD N<tspan baseline-shift="sub" font-size="8">0</tspan>/2</text>
      </svg>`,
      caption: String.raw`The AWGN model: the receiver observes $r(t)=s(t)+n(t)$, where $n(t)$ is a zero-mean Gaussian process, added to (not multiplied by) the signal, with a flat two-sided power spectral density $N_0/2$.`
    },
    {
      title: String.raw`"White" means flat PSD and impulsive autocorrelation`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-awgn" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="135" y="18" fill="#e6edf3" font-size="12" text-anchor="middle">PSD S(f)</text>
        <line x1="30" y1="150" x2="250" y2="150" stroke="#9aa7b5" marker-end="url(#arr2-awgn)"/>
        <line x1="140" y1="160" x2="140" y2="40" stroke="#9aa7b5" marker-end="url(#arr2-awgn)"/>
        <line x1="40" y1="90" x2="240" y2="90" stroke="#4dabf7" stroke-width="2"/>
        <text x="248" y="154" fill="#9aa7b5" font-size="10">f</text>
        <text x="150" y="86" fill="#4dabf7" font-size="10">N<tspan baseline-shift="sub" font-size="8">0</tspan>/2</text>
        <text x="135" y="188" fill="#9aa7b5" font-size="10" text-anchor="middle">flat: equal power at every frequency</text>
        <text x="410" y="18" fill="#e6edf3" font-size="12" text-anchor="middle">autocorr R(&#964;)</text>
        <line x1="300" y1="150" x2="520" y2="150" stroke="#9aa7b5" marker-end="url(#arr2-awgn)"/>
        <line x1="410" y1="160" x2="410" y2="40" stroke="#9aa7b5" marker-end="url(#arr2-awgn)"/>
        <line x1="410" y1="150" x2="410" y2="50" stroke="#ffa94d" stroke-width="2" marker-end="url(#arr2-awgn)"/>
        <text x="420" y="54" fill="#ffa94d" font-size="10">(N<tspan baseline-shift="sub" font-size="8">0</tspan>/2)&#948;(&#964;)</text>
        <text x="518" y="154" fill="#9aa7b5" font-size="10">&#964;</text>
        <text x="410" y="188" fill="#9aa7b5" font-size="10" text-anchor="middle">impulse: samples &#964;&#8800;0 apart are uncorrelated</text>
      </svg>`,
      caption: String.raw`"White" is a spectral statement: the PSD is flat at $N_0/2$ for all $f$ (like white light containing all colours equally). Its Fourier pair, the autocorrelation, is an impulse $(N_0/2)\delta(\tau)$ — any two distinct time samples are uncorrelated.`
    },
    {
      title: String.raw`AWGN on a constellation: clean points blur into Gaussian clouds`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs>
          <marker id="arr3-awgn" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker>
          <radialGradient id="cloud-awgn"><stop offset="0%" stop-color="#b197fc" stop-opacity="0.7"/><stop offset="100%" stop-color="#b197fc" stop-opacity="0"/></radialGradient>
        </defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">BPSK points &#8594; add AWGN &#8594; decision at 0</text>
        <line x1="30" y1="110" x2="510" y2="110" stroke="#9aa7b5" marker-end="url(#arr3-awgn)"/>
        <text x="505" y="128" fill="#9aa7b5" font-size="10">I</text>
        <line x1="270" y1="180" x2="270" y2="60" stroke="#4dabf7" stroke-dasharray="4 3"/>
        <text x="270" y="196" fill="#4dabf7" font-size="10" text-anchor="middle">decision boundary</text>
        <circle cx="150" cy="110" r="46" fill="url(#cloud-awgn)"/>
        <circle cx="390" cy="110" r="46" fill="url(#cloud-awgn)"/>
        <circle cx="150" cy="110" r="5" fill="#63e6be"/>
        <circle cx="390" cy="110" r="5" fill="#63e6be"/>
        <text x="150" y="150" fill="#e6edf3" font-size="10" text-anchor="middle">&#8722;&#8730;E<tspan baseline-shift="sub" font-size="8">b</tspan> (bit 0)</text>
        <text x="390" y="150" fill="#e6edf3" font-size="10" text-anchor="middle">+&#8730;E<tspan baseline-shift="sub" font-size="8">b</tspan> (bit 1)</text>
        <path d="M330 90 Q300 70 272 92" stroke="#ffa94d" fill="none" marker-end="url(#arr3-awgn)"/>
        <text x="300" y="66" fill="#ffa94d" font-size="10" text-anchor="middle">tail crossing 0 &#8594; bit error</text>
      </svg>`,
      caption: String.raw`Each ideal symbol becomes a Gaussian cloud of standard deviation $\sqrt{N_0/2}$ per dimension. A bit error occurs when noise pushes the received point across the decision boundary; the probability of that tail is the $Q$-function, giving the BPSK BER.`
    }
    ],
    prerequisites: ['normal-distribution', 'noise'],
    related: ['noise', 'psd', 'ber', 'matched-filter', 'shannon'],
    intro: String.raw`<p><b>Why AWGN?</b> Before you can quote a modulation's BER, a channel's capacity, or a receiver's sensitivity, you must first agree on a channel. AWGN is that agreed baseline — the simplest non-trivial channel, and the one against which every result in digital communications is calibrated. When a datasheet says "BER $=10^{-6}$ at $E_b/N_0 = 10.5$ dB", it silently means <i>in AWGN</i>. When Shannon's capacity theorem gives $C=B\log_2(1+S/N)$, it is the <i>AWGN</i> capacity. When you simulate a modem, the first curve you plot is the AWGN curve, and only then do you add fading. AWGN matters because it is both physically motivated (thermal noise really is additive, white and Gaussian) and mathematically the worst-case noise for a given power, so its results are meaningful lower bounds.</p>
<p>The name is three independent claims about the noise $n(t)$ in $r(t)=s(t)+n(t)$: it is <b>Additive</b> (added to the signal, not multiplying or convolving it), <b>White</b> (a flat power spectral density $N_0/2$, so equal power at every frequency), and <b>Gaussian</b> (its amplitude at any instant is a zero-mean normal random variable). Understanding AWGN means understanding each of these three properties, why they hold physically, and what each one buys you analytically — flat PSD gives a simple noise-power formula $N=N_0 B$, additivity keeps the algebra linear, and Gaussianity makes the matched filter optimal and the error probability a clean $Q$-function.</p>`,
    sections: [
      {
        h: 'The model: r(t) = s(t) + n(t)',
        html: String.raw`<p>The AWGN channel is defined by a single equation. If $s(t)$ is the transmitted signal, the receiver observes</p>
        <p>$$r(t) = s(t) + n(t),$$</p>
        <p>where $n(t)$ is the noise. The channel does nothing to the signal except add noise: there is no filtering (no convolution), no multiplicative fading, no delay spread. This is a deliberate idealisation — real channels distort, fade and delay — but it isolates the single most fundamental impairment, thermal noise, so it can be studied cleanly.</p>
        <p>The name unpacks into three properties of $n(t)$, each treated in its own section:</p>
        <ul>
          <li><b>Additive</b> — the noise is added to the signal (this section's equation), independent of $s(t)$.</li>
          <li><b>White</b> — the noise power spectral density is flat: $S_n(f)=N_0/2$ for all $f$.</li>
          <li><b>Gaussian</b> — the amplitude $n(t_0)$ at any instant is a zero-mean Gaussian random variable.</li>
        </ul>
        <p>Because the channel is linear and memoryless, the received signal energy and noise add independently, which is exactly why the signal-to-noise ratio (SNR) is such a clean and dominant figure of merit for AWGN links.</p>`
      },
      {
        h: 'Additive: why "plus" and not "times"',
        html: String.raw`<p>"Additive" says the corruption enters as $s(t)+n(t)$, in contrast to <b>multiplicative</b> noise $s(t)\cdot n(t)$ (as in fading, where the channel gain fluctuates) or <b>convolutional</b> distortion $s(t)*h(t)$ (as in a dispersive channel with intersymbol interference). Additivity has three consequences that make the analysis tractable:</p>
        <ul>
          <li><b>Independence of the signal.</b> The noise statistics do not depend on what was sent. The same $n(t)$ would be present with the transmitter off, so it is a property of the receiver/environment, not the message.</li>
          <li><b>Linearity is preserved.</b> Any linear receiver operation (filtering, correlation) acts on signal and noise separately: $\mathcal{L}\{s+n\}=\mathcal{L}\{s\}+\mathcal{L}\{n\}$. This is why we can compute the output SNR by tracking signal and noise through the receiver independently.</li>
          <li><b>Physical origin.</b> Thermal (Johnson-Nyquist) noise from the receiver's resistive front-end and the antenna's radiation resistance genuinely adds a voltage to the incoming signal, so additivity is not just convenient — it is what happens.</li>
        </ul>
        <div class="callout tip"><b>Intuition:</b> think of the noise as a faint hiss mixed into the audio, present whether or not anyone is speaking. It piles on top of the signal; it does not stretch or squeeze it. That "piling on top" is exactly the "additive" in AWGN.</div>`
      },
      {
        h: 'White: flat PSD N0/2 and impulsive autocorrelation',
        html: String.raw`<p>"White" is a statement about the <b>power spectral density (PSD)</b>. By analogy with white light, which contains all visible colours in equal measure, white noise contains equal power at every frequency. Formally, the two-sided PSD is constant:</p>
        <p>$$S_n(f) = \frac{N_0}{2}\quad\text{for all }f\ (-\infty<f<\infty).$$</p>
        <p>The factor $N_0/2$ (rather than $N_0$) is the <b>two-sided</b> convention: the height of the density when negative frequencies are counted separately. Integrating over both positive and negative frequencies within a positive-frequency bandwidth $B$ (i.e. total width $2B$) recovers the familiar one-sided noise power $N=N_0 B$, which is why datasheets quote $N_0$ (one-sided) while textbooks derive with $N_0/2$ (two-sided).</p>
        <p>The Wiener-Khinchin theorem ties the PSD to the <b>autocorrelation</b> $R_n(\tau)$ as a Fourier pair. The transform of a constant is an impulse, so</p>
        <p>$$R_n(\tau)=\frac{N_0}{2}\,\delta(\tau).$$</p>
        <p>This says the noise is <b>uncorrelated at any nonzero time lag</b>: $n(t_1)$ and $n(t_2)$ share nothing whenever $t_1\ne t_2$. It also reveals that ideal white noise has <i>infinite</i> total power ($R_n(0)\to\infty$), which is why it is a mathematical idealisation. In practice noise is white only over the receiver's finite bandwidth; beyond that, filtering rolls it off. Within the band of interest, though, the flat-PSD model is excellent.</p>`
      },
      {
        h: 'Gaussian: the amplitude statistics',
        html: String.raw`<p>"Gaussian" describes the <b>first-order amplitude distribution</b>. At any fixed instant $t_0$, the noise sample $n(t_0)$ is a zero-mean Gaussian (normal) random variable with variance $\sigma^2$:</p>
        <p>$$p(n)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\!\left(-\frac{n^2}{2\sigma^2}\right).$$</p>
        <p>Two facts make this the right model. First, thermal noise is the sum of contributions from an enormous number of independent charge carriers; by the <b>Central Limit Theorem</b>, such a sum tends to Gaussian regardless of the individual distributions. Second, the Gaussian is the <b>maximum-entropy</b> distribution for a given variance — it is the "most random", worst-case noise for a fixed power, so its performance bounds are conservative and universal.</p>
        <p>Note that "white" and "Gaussian" are <i>independent</i> properties. "White" is about the spectrum (frequency correlation); "Gaussian" is about the amplitude histogram. A process can be Gaussian but coloured (correlated), or white but non-Gaussian. AWGN asserts both. For a <i>Gaussian white</i> process there is a special bonus: uncorrelated implies independent, so the noise samples $\{n(t_k)\}$ taken at distinct times are not just uncorrelated but statistically independent — which is what lets us multiply per-sample likelihoods and derive the matched filter cleanly.</p>
        <div class="callout tip"><b>Intuition:</b> "white" tells you the noise wiggles equally fast at all rates (no preferred frequency); "Gaussian" tells you how big the wiggles tend to be at each instant (bell-curve amplitudes, small ones common, huge ones exponentially rare). You need both to fully specify AWGN.</div>`
      },
      {
        h: 'Noise power, N0 and the kTB connection',
        html: String.raw`<p>Where does $N_0$ come from physically? The available thermal noise power spectral density from a source at temperature $T$ is</p>
        <p>$$N_0 = k T,$$</p>
        <p>where $k=1.38\times10^{-23}$ J/K is Boltzmann's constant. This is the <b>one-sided</b> density in W/Hz. At the standard reference temperature $T_0=290$ K,</p>
        <p>$$N_0 = kT_0 = 4.00\times10^{-21}\ \text{W/Hz} = -174\ \text{dBm/Hz},$$</p>
        <p>the number every RF engineer memorises. The total noise power delivered into a receiver of noise bandwidth $B$ is then</p>
        <p>$$N = N_0 B = k T B,$$</p>
        <p>the celebrated $kTB$. In decibels this is simply $-174\ \text{dBm/Hz} + 10\log_{10}(B/\text{Hz})$: for $B=1$ MHz the noise floor is $-174+60=-114$ dBm. A real receiver adds its own noise, captured by the <a href="#noise-figure">noise figure</a> $F$, giving $N=FkTB$ and an effective floor $-174+10\log_{10}B+NF_{\text{dB}}$. AWGN is thus not an abstract convenience — its $N_0$ is literally $kT$, tying the model to thermodynamics.</p>`
      },
      {
        h: 'Why AWGN makes the matched filter optimal',
        html: String.raw`<p>The AWGN model is not just simple — it makes the <b>optimal receiver</b> take a beautifully specific form. When the noise is white and Gaussian, the receiver that minimises error probability correlates the received signal against each candidate waveform, which is implemented by a <a href="#matched-filter">matched filter</a> $h(t)=s(T-t)$ sampled at $t=T$.</p>
        <p>The reason is two-fold, and each half needs one of AWGN's properties:</p>
        <ul>
          <li><b>Gaussian</b> $\Rightarrow$ the maximum-likelihood decision reduces to minimising Euclidean distance (the log-likelihood contains the squared error $\|r-s\|^2$). Minimising distance to $s_i$ is equivalent to maximising the correlation $\int r(t)s_i(t)\,dt$.</li>
          <li><b>White</b> $\Rightarrow$ there is no need to "whiten" the noise first; the noise is already uncorrelated across the signal space, so plain correlation (not a pre-filtered version) is already optimal, and it <b>maximises the output SNR</b> to the value $2E/N_0$.</li>
        </ul>
        <p>If the noise were coloured, you would first pass it through a whitening filter; if it were non-Gaussian, minimum-distance would no longer be maximum-likelihood. AWGN is precisely the case where the elegant matched-filter/correlator receiver is exactly optimal — which is a large part of why the model is so central.</p>`
      },
      {
        h: 'Capacity and BER on the AWGN channel',
        html: String.raw`<p>Two headline results live on the AWGN channel. The first is <b>Shannon capacity</b> — the maximum error-free rate for a band-limited AWGN channel:</p>
        <p>$$C = B\log_2\!\left(1+\frac{S}{N}\right)\quad\text{bits/s},$$</p>
        <p>with $S$ the signal power, $N=N_0 B$ the noise power, and $B$ the bandwidth. Every capacity claim you see quotes this AWGN result (or a fading extension of it). The second is the <b>bit error rate</b> of a modulation. For <a href="#bpsk">BPSK</a> (and, per bit, <a href="#qpsk">QPSK</a>) in AWGN,</p>
        <p>$$P_b = Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right),$$</p>
        <p>where $Q(x)$ is the Gaussian tail probability and $E_b/N_0$ is the energy-per-bit to noise-density ratio. The $Q$-function appears precisely because the decision statistic is Gaussian (from AWGN) and an error is the probability its tail crosses the decision boundary — the constellation-cloud picture in the third diagram.</p>
        <table class="data">
          <tr><th>Quantity</th><th>AWGN expression</th><th>Set by which property</th></tr>
          <tr><td>Noise power</td><td>$N=N_0 B$</td><td>White (flat PSD)</td></tr>
          <tr><td>Optimal receiver</td><td>Matched filter / correlator</td><td>White + Gaussian</td></tr>
          <tr><td>BPSK/QPSK BER</td><td>$Q\!\big(\sqrt{2E_b/N_0}\big)$</td><td>Gaussian tail</td></tr>
          <tr><td>Capacity</td><td>$B\log_2(1+S/N)$</td><td>Gaussian (worst-case) noise</td></tr>
        </table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The model:</b> $r(t)=s(t)+n(t)$ with $n(t)$ additive, white and Gaussian — the baseline channel every BER, capacity and sensitivity result is quoted against.</li>
<li><b>Additive:</b> noise adds ($+$) rather than multiplies or convolves, so it is signal-independent and keeps linear receiver analysis exact; physically it is thermal noise added at the front end.</li>
<li><b>White:</b> flat two-sided PSD $S_n(f)=N_0/2$, whose Fourier pair is the impulsive autocorrelation $(N_0/2)\delta(\tau)$ — distinct samples are uncorrelated, and one-sided noise power is $N=N_0 B$.</li>
<li><b>Gaussian:</b> zero-mean normal amplitudes (Central Limit Theorem, maximum entropy); combined with white, samples are independent, giving the $Q$-function BER and making the matched filter optimal.</li>
<li><b>The kTB link:</b> $N_0=kT$, so $-174$ dBm/Hz at 290 K and $N=kTB$ (e.g. $-114$ dBm in 1 MHz); with receiver noise $N=FkTB$.</li>
<li><b>The headline results:</b> capacity $C=B\log_2(1+S/N)$ and BPSK/QPSK BER $Q(\sqrt{2E_b/N_0})$ both live on the AWGN channel.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`AWGN channel: $r(t)=s(t)+n(t)$ with $n(t)$ <b>A</b>dditive (added, not multiplied), <b>W</b>hite (flat PSD), <b>G</b>aussian (normal amplitudes).`,
      String.raw`It is the baseline channel: every quoted BER curve, Shannon capacity and receiver sensitivity assumes AWGN unless stated otherwise.`,
      String.raw`White = flat two-sided PSD $S_n(f)=N_0/2$ for all $f$; its Fourier pair is the impulse autocorrelation $R_n(\tau)=(N_0/2)\delta(\tau)$, so distinct samples are uncorrelated.`,
      String.raw`Gaussian = zero-mean normal amplitude at each instant (Central Limit Theorem; maximum-entropy, i.e. worst-case, noise for a given power).`,
      String.raw`White + Gaussian together $\Rightarrow$ samples are independent, which is what lets the matched filter/correlator be the optimal receiver.`,
      String.raw`One-sided noise power is $N=N_0 B$; physically $N_0=kT$, so $N=kTB$ ($-174$ dBm/Hz at 290 K; $-114$ dBm in 1 MHz).`,
      String.raw`Two-sided $N_0/2$ vs one-sided $N_0$: integrating $N_0/2$ over width $2B$ (both signs of $f$) gives $N_0 B$ — same power, different bookkeeping.`,
      String.raw`AWGN capacity: $C=B\log_2(1+S/N)$ bits/s, the ceiling on error-free rate for a band-limited AWGN channel.`,
      String.raw`BPSK (and per-bit QPSK) BER in AWGN: $P_b=Q\!\big(\sqrt{2E_b/N_0}\big)$; the $Q$-function comes directly from the Gaussian noise tail.`,
      String.raw`AWGN isolates thermal noise alone (no fading, no ISI); real-channel results are obtained by adding fading/dispersion on top of the AWGN baseline.`
    ],
    equations: [
      {
        title: 'Noise power from the two-sided PSD: N = N0·B',
        tex: String.raw`$$N = N_0 B,\qquad N_0 = kT$$`,
        derivation: String.raw`<p><b>Where we start.</b> White noise has a flat two-sided power spectral density $S_n(f)=N_0/2$ for all frequencies. We want the total noise power a real receiver actually collects in its bandwidth, and to connect $N_0$ to physical temperature.</p>
        <p><b>Step 1 — power is the integral of the PSD.</b> By definition, the average power of a random process equals the integral of its power spectral density over all frequency: $$N=\int_{-\infty}^{\infty} S_n(f)\,df.$$ Ideal white noise gives infinite power, so we must restrict to the receiver's finite passband.</p>
        <p><b>Step 2 — integrate over the receiver band.</b> An ideal receiver of one-sided noise bandwidth $B$ passes frequencies in $[-B,+B]$ (both signs, total width $2B$). Integrating the flat density over that width: $$N=\int_{-B}^{+B}\frac{N_0}{2}\,df=\frac{N_0}{2}\times 2B = N_0 B.$$</p>
        <p><b>Step 3 — identify $N_0$ physically.</b> Thermal (Johnson-Nyquist) noise from a source at temperature $T$ has available one-sided density $N_0=kT$, with $k=1.38\times10^{-23}$ J/K. Substituting, $$N=kTB.$$</p>
        <p><b>Result / sanity check.</b> $$N=N_0 B=kTB.$$ At $T_0=290$ K, $N_0=kT_0=4.00\times10^{-21}$ W/Hz $=-174$ dBm/Hz. In $B=1$ MHz this is $-174+10\log_{10}(10^6)=-174+60=-114$ dBm — the standard thermal noise floor. The two-sided $N_0/2$ and the one-sided $N_0 B$ agree because the factor $\tfrac12$ is cancelled by counting both $\pm f$.</p>`
      },
      {
        title: 'BPSK bit error rate in AWGN',
        tex: String.raw`$$P_b = Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Transmit BPSK: one of two antipodal symbols $\pm\sqrt{E_b}$ over an AWGN channel, then pass the received waveform through a matched filter and sample. We want the probability of a bit error.</p>
        <p><b>Step 1 — the decision statistic.</b> Correlating (matched-filtering) the received signal against the unit-energy pulse gives a scalar $y=\pm\sqrt{E_b}+n$, where the signal component is $\pm\sqrt{E_b}$ and $n$ is the projected noise. The two signal points are separated by $2\sqrt{E_b}$ along one dimension.</p>
        <p><b>Step 2 — noise variance after the matched filter.</b> For AWGN with two-sided density $N_0/2$, the matched filter output noise is Gaussian with variance $\sigma^2=N_0/2$. So $y\sim\mathcal{N}(\pm\sqrt{E_b},\,N_0/2)$.</p>
        <p><b>Step 3 — error when noise crosses the boundary.</b> The optimal threshold is $0$. Given $+\sqrt{E_b}$ was sent, an error occurs if $y<0$, i.e. if $n<-\sqrt{E_b}$: $$P_b=\Pr\!\big(n<-\sqrt{E_b}\big)=Q\!\left(\frac{\sqrt{E_b}}{\sigma}\right)=Q\!\left(\frac{\sqrt{E_b}}{\sqrt{N_0/2}}\right).$$ Here $Q(x)=\tfrac12\operatorname{erfc}(x/\sqrt2)$ is the Gaussian tail.</p>
        <p><b>Step 4 — simplify the argument.</b> $$\frac{\sqrt{E_b}}{\sqrt{N_0/2}}=\sqrt{\frac{E_b}{N_0/2}}=\sqrt{\frac{2E_b}{N_0}}.$$</p>
        <p><b>Result / sanity check.</b> $$P_b=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right).$$ Sanity check: at $E_b/N_0=8$ dB ($\approx 6.31$), the argument is $\sqrt{12.6}\approx 3.55$ and $P_b\approx 2\times10^{-4}$; to reach $P_b=10^{-5}$ needs $E_b/N_0\approx 9.6$ dB. QPSK has the same per-bit BER because its two quadrature BPSK streams are orthogonal.</p>`
      },
      {
        title: 'Shannon capacity of the AWGN channel',
        tex: String.raw`$$C = B\log_2\!\left(1+\frac{S}{N}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want the maximum error-free bit rate over a band-limited channel of bandwidth $B$ corrupted only by additive white Gaussian noise of power $N=N_0 B$, with average signal power $S$.</p>
        <p><b>Step 1 — capacity is maximised mutual information.</b> Shannon's channel capacity is $C=\max_{p(x)} I(X;Y)$ per channel use, where for an additive-noise channel $Y=X+Z$ the mutual information is $I(X;Y)=h(Y)-h(Z)$, the difference of differential entropies.</p>
        <p><b>Step 2 — Gaussian noise entropy.</b> The AWGN sample $Z$ has variance $N$; a Gaussian's differential entropy is $h(Z)=\tfrac12\log_2(2\pi e\,N)$ bits.</p>
        <p><b>Step 3 — maximise the output entropy.</b> With signal power $S$, the output $Y$ has variance at most $S+N$. Entropy is maximised (for fixed variance) by a Gaussian, so choosing Gaussian input gives $h(Y)=\tfrac12\log_2\!\big(2\pi e\,(S+N)\big)$.</p>
        <p><b>Step 4 — mutual information per use.</b> $$I=h(Y)-h(Z)=\tfrac12\log_2\!\frac{2\pi e(S+N)}{2\pi e\,N}=\tfrac12\log_2\!\left(1+\frac{S}{N}\right)\ \text{bits/use}.$$</p>
        <p><b>Step 5 — convert to bits/second.</b> A channel of bandwidth $B$ supports $2B$ independent real dimensions (Nyquist) per second, i.e. $2B$ uses/s. Multiplying: $$C=2B\times\tfrac12\log_2\!\left(1+\frac{S}{N}\right)=B\log_2\!\left(1+\frac{S}{N}\right).$$</p>
        <p><b>Result / sanity check.</b> $$C=B\log_2\!\left(1+\frac{S}{N}\right)\ \text{bits/s}.$$ For $B=1$ MHz and SNR $=20$ dB ($S/N=100$): $C=10^6\log_2(101)=10^6\times 6.658\approx 6.66$ Mb/s. As $S/N\to\infty$, $C\to\infty$; as $B\to\infty$ with fixed $S$, $C\to S/(N_0\ln 2)$ — the power-limited bound.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What do the three letters A, W, G in AWGN stand for?`, back: String.raw`<b>A</b>dditive (noise added to signal), <b>W</b>hite (flat PSD $N_0/2$), <b>G</b>aussian (zero-mean normal amplitudes).` },
      { front: String.raw`Write the AWGN channel model equation.`, back: String.raw`$r(t)=s(t)+n(t)$, where $n(t)$ is additive, white, Gaussian noise independent of $s(t)$.` },
      { front: String.raw`What is the two-sided PSD of white noise?`, back: String.raw`$S_n(f)=N_0/2$, constant for all $f$ (equal power at every frequency, like white light).` },
      { front: String.raw`What is the autocorrelation of white noise?`, back: String.raw`$R_n(\tau)=(N_0/2)\,\delta(\tau)$ — an impulse, so samples at distinct times are uncorrelated.` },
      { front: String.raw`Why "additive" and not "multiplicative"?`, back: String.raw`Noise adds to the signal ($s+n$) rather than scaling it ($s\cdot n$); it is signal-independent thermal noise and keeps receiver analysis linear.` },
      { front: String.raw`Why is the noise Gaussian?`, back: String.raw`It is the sum of many independent carrier contributions (Central Limit Theorem); the Gaussian is also the maximum-entropy (worst-case) distribution for a given power.` },
      { front: String.raw`Relate $N_0$ to temperature.`, back: String.raw`$N_0=kT$ (one-sided). At 290 K, $N_0=kT_0=4.0\times10^{-21}$ W/Hz $=-174$ dBm/Hz.` },
      { front: String.raw`What is the total noise power in bandwidth $B$?`, back: String.raw`$N=N_0 B=kTB$ (with receiver noise, $N=FkTB$). In 1 MHz at 290 K it is $-114$ dBm.` },
      { front: String.raw`What is the BPSK BER in AWGN?`, back: String.raw`$P_b=Q\!\big(\sqrt{2E_b/N_0}\big)$; QPSK has the same per-bit BER.` },
      { front: String.raw`State the AWGN channel capacity.`, back: String.raw`$C=B\log_2(1+S/N)$ bits/s, with $N=N_0 B$ — the Shannon-Hartley limit.` },
      { front: String.raw`Why is the matched filter optimal in AWGN?`, back: String.raw`Gaussian makes ML equal to minimum-distance (maximise correlation); white means no whitening is needed, so plain correlation already maximises output SNR to $2E/N_0$.` },
      { front: String.raw`Are "white" and "Gaussian" the same property?`, back: String.raw`No. White is about the spectrum (flat PSD / uncorrelated in time); Gaussian is about the amplitude histogram. A process can be one without the other; AWGN is both.` },
      { front: String.raw`For white Gaussian noise, what do uncorrelated samples imply?`, back: String.raw`For jointly Gaussian variables, uncorrelated implies independent — so distinct-time samples are statistically independent.` },
      { front: String.raw`What $E_b/N_0$ gives BER $=10^{-5}$ for BPSK?`, back: String.raw`About $9.6$ dB (from $Q(\sqrt{2E_b/N_0})=10^{-5}$).` }
    ],
    mcqs: [
      { q: String.raw`In the AWGN channel $r(t)=s(t)+n(t)$, the word "additive" means the noise is:`, options: [String.raw`Multiplied by the signal`, String.raw`Added to the signal, independent of it`, String.raw`Convolved with the signal`, String.raw`Subtracted after detection`], answer: 1, explain: String.raw`Additive means $r=s+n$ — the noise adds to, and is independent of, the transmitted signal (not multiplicative fading or convolutional ISI).` },
      { q: String.raw`The two-sided power spectral density of white noise is:`, options: [String.raw`$N_0$`, String.raw`$N_0/2$`, String.raw`$kT/2$ only at DC`, String.raw`Proportional to $f$`], answer: 1, explain: String.raw`By convention the two-sided (both $\pm f$) PSD is the flat value $N_0/2$; integrating over width $2B$ returns the one-sided power $N_0 B$.` },
      { q: String.raw`The autocorrelation of ideal white noise is:`, options: [String.raw`A constant $N_0/2$`, String.raw`An impulse $(N_0/2)\delta(\tau)$`, String.raw`A sinc function`, String.raw`An exponential decay`], answer: 1, explain: String.raw`The Fourier pair of a flat PSD is an impulse: $R_n(\tau)=(N_0/2)\delta(\tau)$, so distinct-time samples are uncorrelated.` },
      { q: String.raw`Which property makes samples of white Gaussian noise statistically independent?`, options: [String.raw`Whiteness alone`, String.raw`Gaussianity alone`, String.raw`White and Gaussian together`, String.raw`Additivity`], answer: 2, explain: String.raw`White gives uncorrelated samples; for jointly Gaussian variables uncorrelated implies independent — so both properties are needed.` },
      { q: String.raw`The thermal noise density $N_0=kT$ at 290 K equals approximately:`, options: [String.raw`$-114$ dBm/Hz`, String.raw`$-174$ dBm/Hz`, String.raw`$-204$ dBm/Hz`, String.raw`$-90$ dBm/Hz`], answer: 1, explain: String.raw`$kT_0=4.0\times10^{-21}$ W/Hz $=-174$ dBm/Hz. ($-114$ dBm is the noise power in 1 MHz, not the density.)` },
      { q: String.raw`The noise power in a bandwidth $B$ for AWGN is:`, options: [String.raw`$N_0/B$`, String.raw`$N_0 B$`, String.raw`$N_0 B^2$`, String.raw`$N_0/2$`], answer: 1, explain: String.raw`$N=N_0 B=kTB$: integrating the flat density over the receiver bandwidth gives power proportional to $B$.` },
      { q: String.raw`Why is the Gaussian assumption physically justified for thermal noise?`, options: [String.raw`Noise is deterministic`, String.raw`Central Limit Theorem: sum of many independent contributions`, String.raw`Noise is band-limited`, String.raw`It maximises SNR`], answer: 1, explain: String.raw`Thermal noise sums contributions from a huge number of independent carriers; by the Central Limit Theorem the sum tends to Gaussian.` },
      { q: String.raw`The BPSK bit error rate in AWGN is:`, options: [String.raw`$Q\!\big(\sqrt{E_b/N_0}\big)$`, String.raw`$Q\!\big(\sqrt{2E_b/N_0}\big)$`, String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$Q\!\big(2E_b/N_0\big)$`], answer: 1, explain: String.raw`For antipodal BPSK the matched-filter output gives $P_b=Q(\sqrt{2E_b/N_0})$; the factor 2 comes from the antipodal distance $2\sqrt{E_b}$ and noise variance $N_0/2$.` },
      { q: String.raw`The Shannon capacity of a band-limited AWGN channel is:`, options: [String.raw`$B\log_2(S/N)$`, String.raw`$B\log_2(1+S/N)$`, String.raw`$2B\log_2(1+S/N)$`, String.raw`$B\ln(1+S/N)$`], answer: 1, explain: String.raw`The Shannon-Hartley result is $C=B\log_2(1+S/N)$ bits/s, with $N=N_0 B$.` },
      { q: String.raw`Why is the matched filter the optimal receiver in AWGN?`, options: [String.raw`Because the noise is coloured`, String.raw`Gaussian makes ML = minimum-distance and white needs no whitening`, String.raw`Because the signal is Gaussian`, String.raw`It removes the DC term`], answer: 1, explain: String.raw`Gaussianity reduces ML detection to maximising correlation (minimum distance), and whiteness means plain correlation already maximises output SNR — no whitening filter needed.` },
      { q: String.raw`"White" noise is best described as noise with:`, options: [String.raw`A Gaussian amplitude histogram`, String.raw`Equal power at all frequencies (flat PSD)`, String.raw`Zero mean only`, String.raw`Power concentrated at DC`], answer: 1, explain: String.raw`White refers to the spectrum: a flat PSD, equal power at every frequency, by analogy with white light. Amplitude statistics are a separate (Gaussian) property.` },
      { q: String.raw`Compared with a real fading channel, the AWGN model omits:`, options: [String.raw`Thermal noise`, String.raw`Multiplicative fading and dispersion (ISI)`, String.raw`The transmitted signal`, String.raw`The receiver bandwidth`], answer: 1, explain: String.raw`AWGN keeps only additive thermal noise; it deliberately omits multiplicative fading and convolutional (dispersive) distortion, which are added on top for real channels.` }
    ],
    numericals: [
      { q: String.raw`Compute the thermal noise density $N_0=kT$ at $T=290$ K, in W/Hz and dBm/Hz.`, solution: String.raw`<p><b>Formula.</b> The one-sided thermal noise power spectral density is $$N_0=kT,$$ with $k=1.38\times10^{-23}$ J/K Boltzmann's constant and $T$ the absolute temperature; convert to dBm/Hz via $10\log_{10}(N_0/1\text{ mW}) = 10\log_{10}(N_0/10^{-3})$.</p>
<p><b>Substitute.</b> $$N_0=(1.38\times10^{-23})(290),\qquad N_{0,\text{dBm/Hz}}=10\log_{10}\!\left(\frac{N_0}{10^{-3}}\right).$$</p>
<p><b>Compute.</b> $N_0=1.38\times290\times10^{-23}=4.00\times10^{-21}$ W/Hz. In dBm/Hz: $10\log_{10}(4.00\times10^{-21}/10^{-3})=10\log_{10}(4.00\times10^{-18})=10\times(-17.40)=-174.0$ dBm/Hz.</p>
<p><b>Explanation.</b> This is the universal thermal noise floor density: about $4\times10^{-21}$ W in every 1 Hz of bandwidth at room temperature, i.e. $-174$ dBm/Hz. Every RF link budget starts from this number and adds bandwidth and noise figure to it.</p>` },
      { q: String.raw`Find the thermal noise power in a bandwidth $B=1$ MHz at 290 K, in watts and dBm.`, solution: String.raw`<p><b>Formula.</b> The AWGN noise power in bandwidth $B$ is $$N=N_0 B=kTB,$$ or in decibels $N_{\text{dBm}}=-174\ \text{dBm/Hz}+10\log_{10}(B/\text{Hz})$.</p>
<p><b>Substitute.</b> $$N=(4.00\times10^{-21}\ \text{W/Hz})(10^{6}\ \text{Hz}),\qquad N_{\text{dBm}}=-174+10\log_{10}(10^{6}).$$</p>
<p><b>Compute.</b> $N=4.00\times10^{-15}$ W. In dBm: $-174+60=-114$ dBm.</p>
<p><b>Explanation.</b> Every decade of bandwidth adds 10 dB to the noise power, so 1 MHz ($10^6$ Hz) adds 60 dB above the $-174$ dBm/Hz density, giving the well-known $-114$ dBm floor. A real receiver with noise figure $NF$ dB would sit at $-114+NF$ dBm.</p>` },
      { q: String.raw`Compute the BPSK BER in AWGN at $E_b/N_0=8$ dB.`, solution: String.raw`<p><b>Formula.</b> The BPSK bit error rate is $$P_b=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right),$$ where $Q(x)$ is the Gaussian tail probability; first convert $E_b/N_0$ from dB to a linear ratio via $10^{(\text{dB})/10}$.</p>
<p><b>Substitute.</b> $$\frac{E_b}{N_0}=10^{8/10}=6.31,\qquad P_b=Q\!\left(\sqrt{2\times 6.31}\right).$$</p>
<p><b>Compute.</b> $2\times6.31=12.62$, so the argument is $\sqrt{12.62}=3.55$. Then $P_b=Q(3.55)\approx 1.9\times10^{-4}$.</p>
<p><b>Explanation.</b> At $E_b/N_0=8$ dB the received bits are wrong about twice in every ten thousand. This point lies on the standard BPSK/QPSK AWGN BER curve; raising $E_b/N_0$ toward $9.6$ dB would drop the BER to $10^{-5}$.</p>` },
      { q: String.raw`Find the AWGN channel capacity for $B=1$ MHz and SNR $=20$ dB.`, solution: String.raw`<p><b>Formula.</b> The Shannon-Hartley capacity is $$C=B\log_2\!\left(1+\frac{S}{N}\right)\ \text{bits/s},$$ with $B$ the bandwidth and $S/N$ the linear signal-to-noise ratio (convert from dB via $10^{(\text{dB})/10}$).</p>
<p><b>Substitute.</b> $$\frac{S}{N}=10^{20/10}=100,\qquad C=10^{6}\log_2(1+100).$$</p>
<p><b>Compute.</b> $\log_2(101)=\ln(101)/\ln 2=4.615/0.693=6.658$. Thus $C=10^{6}\times 6.658\approx 6.66\times10^{6}$ bits/s $=6.66$ Mb/s.</p>
<p><b>Explanation.</b> With 1 MHz of bandwidth and a 20 dB SNR, no scheme can exceed about 6.66 Mb/s error-free. Doubling bandwidth would roughly double capacity, while every extra 3 dB of SNR (at high SNR) buys about $B$ more bits/s — capacity grows linearly in bandwidth but only logarithmically in SNR.</p>` },
      { q: String.raw`QPSK is used with $E_b/N_0$ known. Express the symbol energy $E_s$ and $E_s/N_0$ in terms of $E_b/N_0$.`, solution: String.raw`<p><b>Formula.</b> Energy per symbol relates to energy per bit through the number of bits per symbol, $$E_s=(\log_2 M)\,E_b,$$ so for the SNR-like ratio $E_s/N_0=(\log_2 M)\,(E_b/N_0)$. QPSK has $M=4$, hence $\log_2 M=2$.</p>
<p><b>Substitute.</b> $$E_s=2E_b,\qquad \frac{E_s}{N_0}=2\,\frac{E_b}{N_0}.$$</p>
<p><b>Compute.</b> For example, if $E_b/N_0=8$ dB $=6.31$, then $E_s/N_0=2\times6.31=12.62$, i.e. $8+10\log_{10}2=8+3.01=11.0$ dB.</p>
<p><b>Explanation.</b> QPSK carries 2 bits per symbol, so each symbol has twice the energy of a bit and $E_s/N_0$ is 3 dB above $E_b/N_0$. Crucially, the per-bit BER is still $Q(\sqrt{2E_b/N_0})$ — the two orthogonal quadrature streams each behave like independent BPSK, so QPSK matches BPSK bit-for-bit in AWGN.</p>` },
      { q: String.raw`What $E_b/N_0$ (in dB) does BPSK need in AWGN to reach BER $=10^{-5}$?`, solution: String.raw`<p><b>Formula.</b> Set the BPSK BER equal to the target and invert the $Q$-function: $$P_b=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)=10^{-5}\ \Rightarrow\ \sqrt{\frac{2E_b}{N_0}}=Q^{-1}(10^{-5}).$$</p>
<p><b>Substitute.</b> $$Q^{-1}(10^{-5})\approx 4.265,\qquad \frac{2E_b}{N_0}=(4.265)^2.$$</p>
<p><b>Compute.</b> $(4.265)^2=18.19$, so $E_b/N_0=18.19/2=9.09$ (linear) $=10\log_{10}(9.09)=9.59$ dB $\approx 9.6$ dB.</p>
<p><b>Explanation.</b> The familiar "$9.6$ dB for $10^{-5}$" BPSK figure falls straight out of inverting the $Q$-function. Because the $Q$-function is so steep, a further $\sim 1$ dB would push the BER down to about $10^{-6}$ — coding is used to buy back these dB as coding gain.</p>` }
    ],
    realWorld: String.raw`<p>AWGN is the reference channel that quietly underpins nearly every performance number in the field. Radio <a href="#link-budget">link budgets</a> compute the noise floor as $kTB$ (that $-174$ dBm/Hz $+\,10\log_{10}B+NF$ chain), then derive <a href="#sensitivity">receiver sensitivity</a> from the required AWGN $E_b/N_0$. Modem and radio datasheets specify "BER $=10^{-6}$ at such-and-such $E_b/N_0$" — always the AWGN figure, because that is the repeatable, apparatus-independent benchmark. Every communications simulation starts by validating its <a href="#ber">BER</a> curve against the closed-form AWGN result before fading, interference or hardware impairments are layered on. Even Shannon's famous <a href="#shannon">capacity</a> bound, quoted for everything from Wi-Fi to deep-space links, is the AWGN capacity $B\log_2(1+S/N)$. When engineers say a scheme is "$2$ dB from capacity", they mean from the AWGN capacity. In short, AWGN is not one channel among many — it is the yardstick against which all the others are measured.</p>`
  }
);
