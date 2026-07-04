// Modulation & Detection: BPSK, DBPSK, Matched Filter, EVM
CONTENT.topics.push(
  {
    id: 'bpsk',
    title: 'BPSK',
    category: 'Modulation & Detection',
    tags: ['modulation', 'psk', 'coherent-detection', 'ber', 'digital-comm', 'constellation'],
    summary: String.raw`Binary Phase-Shift Keying maps one bit per symbol to antipodal signals separated by 180 degrees, achieving the optimal BER of $Q(\sqrt{2E_b/N_0})$ for coherent detection over the AWGN channel.`,
    prerequisites: ['comm-basics', 'noise', 'matched-filter'],
    intro: String.raw`<p><strong>Why does BPSK exist?</strong> Every digital link faces one non-negotiable question: given a fixed amount of energy per bit and a noisy channel, how reliably can we tell a "1" from a "0"? BPSK is the answer that squeezes the maximum possible reliability out of a single bit. By placing the two possible signals as far apart as physics allows for a given energy, it minimizes the chance that noise flips one into the other — so when a link is starved for power (a satellite whisper from Saturn, a GPS signal below the noise floor), BPSK is the modulation you reach for first. Everything more sophisticated is built by stacking or subdividing this one idea.</p>
<p>Binary Phase-Shift Keying (BPSK) is the simplest and most robust member of the phase-modulation family. Each transmitted symbol carries a single bit, encoded as one of two carrier phases separated by 180 degrees. Because the two signal points are <em>antipodal</em> (maximally separated for a given energy), BPSK is the most power-efficient binary signaling scheme in additive white Gaussian noise (AWGN): no binary scheme achieves a lower bit-error rate at the same $E_b/N_0$.</p>
<p>BPSK is the workhorse of low-SNR, robustness-critical links: satellite command channels, deep-space telemetry, GPS/GNSS spreading, IEEE 802.11 lowest-rate modes, and the acquisition preambles of countless systems. Understanding BPSK deeply — its signal geometry, its matched-filter receiver, its exact BER, and its sensitivity to carrier phase — is the foundation for every higher-order modulation (QPSK, 16-QAM) and for spread spectrum.</p>`,
    sections: [
      {
        h: 'Signal Model and Waveforms',
        html: String.raw`<p>BPSK modulates the phase of a sinusoidal carrier by $0$ or $\pi$ radians depending on the data bit. Over one symbol interval $0 \le t < T_b$ the transmitted waveform is</p>
<p>$$s_i(t) = \sqrt{\tfrac{2E_b}{T_b}}\,\cos\!\big(2\pi f_c t + \pi(1-i)\big),\quad i \in \{0,1\}$$</p>
<p>which reduces to two antipodal waveforms $s_1(t) = +\sqrt{2E_b/T_b}\cos(2\pi f_c t)$ for bit "1" and $s_0(t) = -\sqrt{2E_b/T_b}\cos(2\pi f_c t)$ for bit "0". Equivalently, we write $s(t) = b\,g(t)\cos(2\pi f_c t)$ where $b \in \{+1,-1\}$ is the antipodal symbol and $g(t)$ is the baseband pulse shape.</p>
<p>The two waveforms differ only by a sign — a $180^\circ$ phase flip. Each carries energy $E_b = \int_0^{T_b} s_i^2(t)\,dt$. The information lives entirely in the polarity of the in-phase component; the quadrature component is unused, which is why BPSK occupies only <em>one</em> signal-space dimension.</p>
<div class="callout"><strong>Key intuition:</strong> BPSK is amplitude signaling on a single carrier axis. The "phase modulation" viewpoint and the "antipodal $\pm 1$ amplitude" viewpoint are identical — a sign change is a $180^\circ$ phase change.</div>`
      },
      {
        h: 'Signal-Space Geometry and Constellation',
        html: String.raw`<p>Using the single orthonormal basis function $\phi(t) = \sqrt{2/T_b}\cos(2\pi f_c t)$ (unit energy over $T_b$), each BPSK waveform collapses to a scalar coordinate:</p>
<p>$$s_1 = +\sqrt{E_b},\qquad s_0 = -\sqrt{E_b}.$$</p>
<p>The constellation is therefore two points on the real line at $\pm\sqrt{E_b}$. The Euclidean distance between them is the <em>decision distance</em></p>
<p>$$d = |s_1 - s_0| = 2\sqrt{E_b}.$$</p>
<p>This distance is what governs error performance: the larger $d$ relative to the noise standard deviation, the lower the error probability. For a fixed symbol energy, antipodal placement maximizes $d$ — no other two-point constellation on a fixed energy circle can be farther apart. This is the geometric reason BPSK is the optimal binary scheme.</p>
<table class="data">
<tr><th>Quantity</th><th>Value</th></tr>
<tr><td>Signal-space dimension</td><td>1 (in-phase only)</td></tr>
<tr><td>Constellation points</td><td>$\pm\sqrt{E_b}$</td></tr>
<tr><td>Minimum distance $d_{\min}$</td><td>$2\sqrt{E_b}$</td></tr>
<tr><td>Bits per symbol</td><td>1</td></tr>
<tr><td>Symbol = bit</td><td>$E_s = E_b$</td></tr>
</table>`
      },
      {
        h: 'Optimal (Matched-Filter / Correlator) Receiver',
        html: String.raw`<p>The maximum-likelihood receiver in AWGN correlates the received signal against the basis function (or, equivalently, passes it through a filter matched to the pulse) and samples once per symbol:</p>
<p>$$r = \int_0^{T_b} y(t)\,\phi(t)\,dt = \pm\sqrt{E_b} + n,\qquad n \sim \mathcal{N}(0, N_0/2).$$</p>
<p>The correlator output $r$ is a Gaussian random variable centered at $+\sqrt{E_b}$ (bit 1) or $-\sqrt{E_b}$ (bit 0) with variance $\sigma^2 = N_0/2$. Because the two constellation points are symmetric about the origin and equally likely, the optimal decision threshold is exactly zero:</p>
<ul>
<li>Decide "1" if $r > 0$</li>
<li>Decide "0" if $r < 0$</li>
</ul>
<p>The matched filter maximizes the sampled SNR to $2E_b/N_0$, which is the best any linear receiver can achieve (proved via Cauchy-Schwarz — see the Matched Filter topic). No information is discarded: the single scalar $r$ is a sufficient statistic.</p>
<div class="callout"><strong>Pitfall:</strong> The threshold is zero only because the points are antipodal and equiprobable. Any DC offset in the receiver chain shifts the effective threshold and directly costs BER.</div>`
      },
      {
        h: 'Bit-Error Rate Derivation',
        html: String.raw`<p>An error occurs when noise pushes $r$ across the threshold. Suppose "1" was sent, so $r = \sqrt{E_b} + n$. An error occurs if $r < 0$, i.e. $n < -\sqrt{E_b}$. With $n \sim \mathcal{N}(0, N_0/2)$,</p>
<p>$$P(\text{error} \mid 1) = P\!\left(n < -\sqrt{E_b}\right) = Q\!\left(\frac{\sqrt{E_b}}{\sqrt{N_0/2}}\right) = Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right).$$</p>
<p>By symmetry the same holds for "0", so the overall bit-error rate is</p>
<p>$$\boxed{P_b = Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)}$$</p>
<p>where $Q(x) = \tfrac{1}{2}\operatorname{erfc}(x/\sqrt{2})$ is the Gaussian tail integral. This is identical to QPSK's BER (when Gray-coded) because QPSK is two orthogonal BPSK channels. The waterfall curve is steep: BER falls by roughly a decade for each ~1 dB increase in $E_b/N_0$ in the operating region.</p>
<table class="data">
<tr><th>$E_b/N_0$ (dB)</th><th>$P_b$ (BPSK)</th></tr>
<tr><td>0</td><td>$7.9\times10^{-2}$</td></tr>
<tr><td>4</td><td>$1.3\times10^{-2}$</td></tr>
<tr><td>7</td><td>$8.0\times10^{-4}$</td></tr>
<tr><td>9.6</td><td>$1.0\times10^{-5}$</td></tr>
<tr><td>10.5</td><td>$\approx 4\times10^{-6}$</td></tr>
</table>`
      },
      {
        h: 'Carrier and Symbol Synchronization',
        html: String.raw`<p>BPSK is <em>coherent</em>: the receiver must reproduce the carrier phase to project onto the correct axis. If the recovered carrier has phase error $\theta$, the correlator output becomes $r = \pm\sqrt{E_b}\cos\theta + n$. The effective signal amplitude scales by $\cos\theta$, degrading SNR by $\cos^2\theta$ and raising BER to</p>
<p>$$P_b(\theta) = Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\,\cos\theta\right).$$</p>
<p>A $30^\circ$ error costs $20\log_{10}(\cos 30^\circ) \approx 1.25$ dB; at $90^\circ$ the signal vanishes entirely. Carrier recovery is complicated by the fact that BPSK has a $180^\circ$ phase ambiguity — squaring the signal (or a Costas loop) removes the modulation but locks with equal probability to $0$ or $\pi$, causing bit inversion. This is precisely why <strong>differential encoding (DBPSK)</strong> or a known preamble/UW is used to resolve the ambiguity.</p>
<p>Symbol timing must also be recovered so the matched-filter output is sampled at the peak. Early-late gate or Gardner detectors are common. Poor timing widens the effective noise and reduces the sampled SNR.</p>`
      },
      {
        h: 'Spectral Properties and Bandwidth',
        html: String.raw`<p>With rectangular pulses, BPSK's baseband power spectral density is a $\operatorname{sinc}^2$ shape centered at $f_c$:</p>
<p>$$S(f) \propto \left(\frac{\sin \pi (f-f_c) T_b}{\pi (f-f_c) T_b}\right)^2.$$</p>
<p>The main-lobe (null-to-null) bandwidth is $2R_b = 2/T_b$; the first sidelobe is only 13.5 dB down, so rectangular BPSK is spectrally wasteful. Practical systems apply <strong>root-raised-cosine (RRC)</strong> pulse shaping with roll-off $\alpha$, giving an occupied bandwidth of $R_b(1+\alpha)$ (typically $\alpha = 0.2$–$0.5$) and matched-filter-compatible ISI-free sampling.</p>
<p>BPSK's spectral efficiency is nominally $1$ bit/s/Hz (Nyquist), lower than QPSK's $2$ bit/s/Hz — the price paid for its single-dimension simplicity. It carries no DC component and has a constant envelope (with unshaped pulses), making it friendly to nonlinear power amplifiers.</p>
<div class="callout"><strong>Note:</strong> Constant-envelope BPSK tolerates PA saturation well; RRC shaping introduces amplitude variation (nonzero PAPR), so pulse-shaped BPSK needs some PA back-off.</div>`
      },
      {
        h: 'Comparison, Advantages, and Limitations',
        html: String.raw`<p>BPSK's strengths and weaknesses follow directly from its geometry:</p>
<ul>
<li><strong>Best binary power efficiency:</strong> lowest possible $E_b/N_0$ for a given BER among binary schemes; ~3 dB better than coherent binary FSK/OOK and better than DBPSK by ~1 dB.</li>
<li><strong>Robust at low SNR:</strong> ideal for acquisition, command links, and heavily faded channels.</li>
<li><strong>Constant envelope</strong> (unshaped): amplifier-friendly.</li>
<li><strong>Low spectral efficiency:</strong> only 1 bit/symbol; QPSK doubles the throughput at identical BER.</li>
<li><strong>Requires coherent carrier recovery</strong> with $180^\circ$ ambiguity resolution.</li>
</ul>
<table class="data">
<tr><th>Scheme</th><th>Bits/sym</th><th>BER</th><th>$E_b/N_0$ @ $10^{-5}$</th></tr>
<tr><td>BPSK</td><td>1</td><td>$Q(\sqrt{2E_b/N_0})$</td><td>9.6 dB</td></tr>
<tr><td>QPSK (Gray)</td><td>2</td><td>$Q(\sqrt{2E_b/N_0})$</td><td>9.6 dB</td></tr>
<tr><td>DBPSK</td><td>1</td><td>$\tfrac12 e^{-E_b/N_0}$</td><td>~10.5 dB</td></tr>
<tr><td>Coherent BFSK</td><td>1</td><td>$Q(\sqrt{E_b/N_0})$</td><td>12.6 dB</td></tr>
</table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>Pulling the pieces together, after this topic you should be able to explain and use the following:</p>
<ul>
<li><strong>The geometry:</strong> BPSK is two antipodal points at $\pm\sqrt{E_b}$ on a single axis; the $2\sqrt{E_b}$ separation is the largest possible for that energy, which is <em>why</em> it is the optimal binary scheme.</li>
<li><strong>The receiver:</strong> a matched filter / correlator followed by a zero-threshold decision is optimal, and its single scalar output is a sufficient statistic — nothing better exists in AWGN.</li>
<li><strong>The performance law:</strong> $P_b=Q(\sqrt{2E_b/N_0})$, reaching $10^{-5}$ near $9.6$ dB, with the steep waterfall meaning ~1 dB buys about a decade of BER.</li>
<li><strong>The fragilities:</strong> a phase error $\theta$ scales amplitude by $\cos\theta$, and carrier recovery carries an inherent $180^\circ$ ambiguity resolved by differential encoding or a known preamble.</li>
<li><strong>The context:</strong> QPSK matches BPSK's BER at twice the spectral efficiency; unshaped BPSK is constant-envelope and PA-friendly, while RRC shaping trims bandwidth to $R_b(1+\alpha)$.</li>
<li><strong>The engineering takeaway:</strong> choose BPSK when link margin is scarce and robustness matters more than throughput.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`BPSK sends one bit/symbol as antipodal signals $\pm\sqrt{E_b}$ separated by $180^\circ$; it uses a single signal-space dimension.`,
      String.raw`The exact coherent BER is $P_b = Q(\sqrt{2E_b/N_0})$ — the optimum for any binary scheme in AWGN.`,
      String.raw`Minimum distance is $d_{\min} = 2\sqrt{E_b}$; error probability depends on $d_{\min}/(2\sigma)$ with $\sigma^2 = N_0/2$.`,
      String.raw`Optimal receiver = matched filter/correlator + zero-threshold decision; the correlator output is a sufficient statistic.`,
      String.raw`Reaching BER $=10^{-5}$ requires $E_b/N_0 \approx 9.6$ dB.`,
      String.raw`A carrier phase error $\theta$ scales amplitude by $\cos\theta$, degrading SNR by $\cos^2\theta$.`,
      String.raw`BPSK carrier recovery has an inherent $180^\circ$ phase ambiguity, resolved by differential encoding or a known preamble.`,
      String.raw`QPSK achieves the same BER at twice the spectral efficiency; QPSK = two orthogonal BPSK channels.`,
      String.raw`Rectangular-pulse BPSK has a $\operatorname{sinc}^2$ spectrum with null-to-null bandwidth $2R_b$; RRC shaping gives $R_b(1+\alpha)$.`,
      String.raw`Unshaped BPSK is constant-envelope and PA-friendly; DBPSK trades ~1 dB of $E_b/N_0$ for no coherent carrier.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr-bpsk" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="200" fill="#1c232e"/>
<line x1="40" y1="100" x2="500" y2="100" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr-bpsk)"/>
<line x1="270" y1="30" x2="270" y2="170" stroke="#9aa7b5" stroke-width="1" stroke-dasharray="4 3"/>
<text x="505" y="104" fill="#9aa7b5" font-size="12">I ($\phi$)</text>
<circle cx="130" cy="100" r="8" fill="#ff6b6b"/>
<circle cx="410" cy="100" r="8" fill="#4dabf7"/>
<text x="112" y="130" fill="#ff6b6b" font-size="13">"0" = $-\sqrt{E_b}$</text>
<text x="392" y="130" fill="#4dabf7" font-size="13">"1" = $+\sqrt{E_b}$</text>
<line x1="130" y1="80" x2="410" y2="80" stroke="#63e6be" stroke-width="1.5"/>
<text x="235" y="72" fill="#63e6be" font-size="12">$d = 2\sqrt{E_b}$</text>
<text x="255" y="185" fill="#9aa7b5" font-size="11">threshold = 0</text>
</svg>`,
        caption: 'BPSK constellation: two antipodal points on the in-phase axis, decision threshold at the origin.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<line x1="60" y1="20" x2="60" y2="220" stroke="#9aa7b5" stroke-width="1.5"/>
<line x1="60" y1="220" x2="510" y2="220" stroke="#9aa7b5" stroke-width="1.5"/>
<text x="20" y="30" fill="#e6edf3" font-size="12">BER</text>
<text x="440" y="245" fill="#e6edf3" font-size="12">$E_b/N_0$ (dB)</text>
<text x="30" y="55" fill="#9aa7b5" font-size="10">1e-1</text>
<text x="30" y="115" fill="#9aa7b5" font-size="10">1e-3</text>
<text x="30" y="180" fill="#9aa7b5" font-size="10">1e-5</text>
<text x="70" y="235" fill="#9aa7b5" font-size="10">0</text>
<text x="250" y="235" fill="#9aa7b5" font-size="10">6</text>
<text x="420" y="235" fill="#9aa7b5" font-size="10">12</text>
<path d="M70,50 C150,70 240,105 320,150 C380,182 430,205 470,215" fill="none" stroke="#4dabf7" stroke-width="2.5"/>
<path d="M70,55 C160,80 260,120 340,160 C400,190 450,208 480,216" fill="none" stroke="#ffa94d" stroke-width="2" stroke-dasharray="5 4"/>
<text x="330" y="120" fill="#4dabf7" font-size="12">BPSK</text>
<text x="360" y="150" fill="#ffa94d" font-size="12">DBPSK (~1 dB worse)</text>
</svg>`,
        caption: 'BER waterfall: BPSK vs DBPSK. The ~1 dB horizontal gap is the price of non-coherent differential detection.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr2-bpsk" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="190" fill="#1c232e"/>
<text x="20" y="24" fill="#e6edf3" font-size="13">Coherent BPSK receiver chain</text>
<text x="15" y="86" fill="#9aa7b5" font-size="11">$y(t)$</text>
<line x1="45" y1="90" x2="80" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-bpsk)"/>
<circle cx="100" cy="90" r="18" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/>
<text x="93" y="95" fill="#e6edf3" font-size="15">$\times$</text>
<rect x="55" y="135" width="90" height="32" fill="#1c232e" stroke="#63e6be" stroke-width="1.5"/>
<text x="66" y="155" fill="#e6edf3" font-size="10">$\cos 2\pi f_c t$</text>
<line x1="100" y1="135" x2="100" y2="108" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-bpsk)"/>
<line x1="118" y1="90" x2="185" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-bpsk)"/>
<rect x="185" y="68" width="95" height="44" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/>
<text x="198" y="88" fill="#e6edf3" font-size="12">$\int_0^{T_b}dt$</text>
<text x="205" y="104" fill="#9aa7b5" font-size="10">integrate</text>
<line x1="280" y1="90" x2="330" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-bpsk)"/>
<circle cx="350" cy="90" r="4" fill="#b197fc"/>
<text x="315" y="74" fill="#9aa7b5" font-size="10">sample $t=T_b$</text>
<line x1="354" y1="90" x2="410" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-bpsk)"/>
<rect x="410" y="68" width="110" height="44" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.5"/>
<text x="424" y="84" fill="#e6edf3" font-size="11">decide $r\gtrless 0$</text>
<text x="440" y="102" fill="#63e6be" font-size="11">bit out</text>
</svg>`,
        caption: 'Coherent BPSK receiver: multiply by the recovered carrier, integrate over the symbol, sample, then threshold at zero. Carrier recovery must supply the reference phase.'
      }
    ],
    equations: [
      {
        title: 'BPSK Waveform',
        tex: String.raw`$$s(t) = b\sqrt{\tfrac{2E_b}{T_b}}\cos(2\pi f_c t),\quad b\in\{+1,-1\}$$`,
        derivation: String.raw`<p>Bit "1" maps to $b=+1$ (phase $0$), bit "0" to $b=-1$ (phase $\pi$). The amplitude $\sqrt{2E_b/T_b}$ is chosen so the energy per bit is $\int_0^{T_b}s^2\,dt = \tfrac{2E_b}{T_b}\int_0^{T_b}\cos^2(2\pi f_c t)\,dt = \tfrac{2E_b}{T_b}\cdot\tfrac{T_b}{2} = E_b$.</p>`
      },
      {
        title: 'Signal-Space Coordinates',
        tex: String.raw`$$s_i = \pm\sqrt{E_b},\qquad \phi(t)=\sqrt{\tfrac{2}{T_b}}\cos(2\pi f_c t)$$`,
        derivation: String.raw`<p>Project $s(t)$ onto the unit-energy basis: $s_i = \int_0^{T_b} s(t)\phi(t)\,dt = b\sqrt{\tfrac{2E_b}{T_b}}\sqrt{\tfrac{2}{T_b}}\int_0^{T_b}\cos^2\,dt = b\sqrt{\tfrac{2E_b}{T_b}}\sqrt{\tfrac{2}{T_b}}\cdot\tfrac{T_b}{2} = b\sqrt{E_b}$.</p>`
      },
      {
        title: 'Minimum Distance',
        tex: String.raw`$$d_{\min} = |s_1 - s_0| = 2\sqrt{E_b}$$`,
        derivation: String.raw`<p>The two points sit at $+\sqrt{E_b}$ and $-\sqrt{E_b}$ on the same axis, so their separation is $2\sqrt{E_b}$. This is the largest possible separation for two points of energy $E_b$, hence antipodal signaling is optimal.</p>`
      },
      {
        title: 'Matched-Filter Output SNR',
        tex: String.raw`$$\mathrm{SNR}_{\text{samp}} = \frac{2E_b}{N_0}$$`,
        derivation: String.raw`<p>The correlator output signal is $\pm\sqrt{E_b}$ (power $E_b$) and noise variance is $N_0/2$. The sampled SNR is $E_b/(N_0/2) = 2E_b/N_0$, the maximum achievable (Cauchy-Schwarz bound for the matched filter).</p>`
      },
      {
        title: 'BPSK Bit-Error Rate',
        tex: String.raw`$$P_b = Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right) = \tfrac12\operatorname{erfc}\!\left(\sqrt{\tfrac{E_b}{N_0}}\right)$$`,
        derivation: String.raw`<p>Given "1" sent, $r=\sqrt{E_b}+n$, $n\sim\mathcal N(0,N_0/2)$. Error when $r<0 \Rightarrow n<-\sqrt{E_b}$. Standardize: $P = P(Z < -\sqrt{E_b}/\sqrt{N_0/2}) = Q(\sqrt{2E_b/N_0})$ where $Z$ is standard normal. Symmetry gives the same for "0", so $P_b = Q(\sqrt{2E_b/N_0})$. Using $Q(x)=\tfrac12\operatorname{erfc}(x/\sqrt2)$ yields the erfc form.</p>`
      },
      {
        title: 'BER with Phase Error',
        tex: String.raw`$$P_b(\theta) = Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\,\cos\theta\right)$$`,
        derivation: String.raw`<p>A carrier phase error $\theta$ projects the signal onto the recovered axis with factor $\cos\theta$: $r=\pm\sqrt{E_b}\cos\theta+n$. The effective amplitude is $\sqrt{E_b}\cos\theta$, so replace $\sqrt{E_b}\to\sqrt{E_b}\cos\theta$ in the BER, giving the $\cos\theta$ factor. Loss in dB $= -20\log_{10}(\cos\theta)$.</p>`
      },
      {
        title: 'Power Spectral Density (rectangular pulse)',
        tex: String.raw`$$S(f)\propto T_b\,\operatorname{sinc}^2\big((f-f_c)T_b\big)$$`,
        derivation: String.raw`<p>The PSD of a random antipodal sequence equals $|G(f)|^2/T_b$ where $G(f)$ is the pulse Fourier transform. A rectangular pulse of width $T_b$ transforms to $T_b\operatorname{sinc}(fT_b)$, so $|G(f)|^2/T_b = T_b\operatorname{sinc}^2(fT_b)$; shifting to $f_c$ gives the passband result. Null-to-null main lobe width $=2/T_b=2R_b$.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the exact coherent BER of BPSK in AWGN?`, back: String.raw`$P_b = Q(\sqrt{2E_b/N_0}) = \tfrac12\operatorname{erfc}(\sqrt{E_b/N_0})$.` },
      { front: String.raw`Where are BPSK constellation points located?`, back: String.raw`At $\pm\sqrt{E_b}$ on the single in-phase axis; $180^\circ$ apart.` },
      { front: String.raw`What is the minimum distance of BPSK?`, back: String.raw`$d_{\min} = 2\sqrt{E_b}$.` },
      { front: String.raw`How many signal-space dimensions does BPSK use?`, back: String.raw`One (in-phase only); quadrature is unused.` },
      { front: String.raw`What $E_b/N_0$ gives BER $=10^{-5}$ for BPSK?`, back: String.raw`Approximately 9.6 dB.` },
      { front: String.raw`Why is BPSK the optimal binary scheme?`, back: String.raw`Antipodal signals maximize $d_{\min}$ for a given energy, minimizing error probability.` },
      { front: String.raw`What is the optimal decision threshold and why?`, back: String.raw`Zero, because the two points are symmetric about the origin and equiprobable.` },
      { front: String.raw`How does a phase error $\theta$ affect BPSK?`, back: String.raw`Amplitude scales by $\cos\theta$; SNR drops by $\cos^2\theta$; loss $=-20\log_{10}\cos\theta$ dB.` },
      { front: String.raw`What ambiguity does BPSK carrier recovery have?`, back: String.raw`A $180^\circ$ phase ambiguity (squaring/Costas locks to $0$ or $\pi$), inverting bits.` },
      { front: String.raw`How is the $180^\circ$ ambiguity resolved?`, back: String.raw`Differential encoding (DBPSK) or a known preamble/unique word.` },
      { front: String.raw`Compare BPSK and QPSK BER.`, back: String.raw`Identical: $Q(\sqrt{2E_b/N_0})$; QPSK doubles spectral efficiency (QPSK = 2 orthogonal BPSK channels).` },
      { front: String.raw`What is BPSK's null-to-null bandwidth with rectangular pulses?`, back: String.raw`$2R_b = 2/T_b$ (a $\operatorname{sinc}^2$ spectrum).` },
      { front: String.raw`Is unshaped BPSK constant envelope?`, back: String.raw`Yes — only the sign flips, so amplitude is constant; PA-friendly.` },
      { front: String.raw`Why is BPSK common for acquisition/preambles?`, back: String.raw`Its power efficiency makes it the most robust at low SNR.` }
    ],
    mcqs: [
      { q: String.raw`The coherent BER of BPSK in AWGN is:`, options: [String.raw`$Q(\sqrt{E_b/N_0})$`, String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$Q(2E_b/N_0)$`], answer: 1, explain: String.raw`The antipodal decision distance gives argument $\sqrt{2E_b/N_0}$.` },
      { q: String.raw`BPSK occupies how many signal-space dimensions?`, options: [String.raw`0`, String.raw`1`, String.raw`2`, String.raw`4`], answer: 1, explain: String.raw`Only the in-phase axis is used.` },
      { q: String.raw`The minimum distance between BPSK constellation points is:`, options: [String.raw`$\sqrt{E_b}$`, String.raw`$\sqrt{2E_b}$`, String.raw`$2\sqrt{E_b}$`, String.raw`$4E_b$`], answer: 2, explain: String.raw`Points at $\pm\sqrt{E_b}$ are $2\sqrt{E_b}$ apart.` },
      { q: String.raw`Approximate $E_b/N_0$ for BER $=10^{-5}$ (BPSK):`, options: [String.raw`6.8 dB`, String.raw`9.6 dB`, String.raw`12.6 dB`, String.raw`15 dB`], answer: 1, explain: String.raw`Standard BPSK/QPSK figure is ~9.6 dB.` },
      { q: String.raw`A $60^\circ$ carrier phase error scales the sampled signal amplitude by:`, options: [String.raw`$0.5$`, String.raw`$0.707$`, String.raw`$0.866$`, String.raw`$1.0$`], answer: 0, explain: String.raw`$\cos 60^\circ = 0.5$.` },
      { q: String.raw`Compared with BPSK, Gray-coded QPSK at the same $E_b/N_0$ has:`, options: [String.raw`3 dB worse BER`, String.raw`Identical BER, double the spectral efficiency`, String.raw`Half the throughput`, String.raw`Higher BER but same bandwidth`], answer: 1, explain: String.raw`QPSK = two orthogonal BPSK channels; same BER, 2 bits/symbol.` },
      { q: String.raw`The optimal BPSK decision threshold on the correlator output is:`, options: [String.raw`$+\sqrt{E_b}$`, String.raw`$-\sqrt{E_b}$`, String.raw`$0$`, String.raw`$N_0/2$`], answer: 2, explain: String.raw`Symmetric, equiprobable points make zero optimal.` },
      { q: String.raw`Rectangular-pulse BPSK has a spectrum shaped like:`, options: [String.raw`Impulse`, String.raw`$\operatorname{sinc}^2$`, String.raw`Gaussian`, String.raw`Flat (white)`], answer: 1, explain: String.raw`A rectangular pulse transforms to a sinc; power spectrum is sinc-squared.` },
      { q: String.raw`The BPSK carrier-recovery phase ambiguity is:`, options: [String.raw`$45^\circ$`, String.raw`$90^\circ$`, String.raw`$180^\circ$`, String.raw`$360^\circ$`], answer: 2, explain: String.raw`Squaring the $\pm$ signal removes the sign, leaving a $180^\circ$ ambiguity.` },
      { q: String.raw`The matched-filter output SNR for BPSK is:`, options: [String.raw`$E_b/N_0$`, String.raw`$2E_b/N_0$`, String.raw`$E_b/(2N_0)$`, String.raw`$4E_b/N_0$`], answer: 1, explain: String.raw`Signal power $E_b$ over noise variance $N_0/2$ gives $2E_b/N_0$.` },
      { q: String.raw`For unshaped BPSK the transmitted envelope is:`, options: [String.raw`Constant`, String.raw`Two-level`, String.raw`Gaussian`, String.raw`Randomly varying`], answer: 0, explain: String.raw`Only the phase (sign) changes; amplitude stays fixed.` },
      { q: String.raw`Which scheme resolves the BPSK phase ambiguity without a preamble?`, options: [String.raw`Higher-order QAM`, String.raw`Differential encoding (DBPSK)`, String.raw`Increasing $E_b$`, String.raw`Wider filter`], answer: 1, explain: String.raw`DBPSK encodes data in phase transitions, immune to a constant $180^\circ$ offset.` },
      { q: String.raw`Doubling $E_b$ (adding 3 dB) in the BPSK BER argument does what to the Q-function argument?`, options: [String.raw`Doubles it`, String.raw`Multiplies by $\sqrt2$`, String.raw`Leaves it unchanged`, String.raw`Squares it`], answer: 1, explain: String.raw`Argument is $\sqrt{2E_b/N_0}$, so a factor-2 energy change gives $\sqrt2$ in the argument.` },
      { q: String.raw`The nominal spectral efficiency of BPSK (Nyquist) is:`, options: [String.raw`0.5 bit/s/Hz`, String.raw`1 bit/s/Hz`, String.raw`2 bit/s/Hz`, String.raw`4 bit/s/Hz`], answer: 1, explain: String.raw`One bit per symbol at Nyquist rate = 1 bit/s/Hz.` }
    ],
    numericals: [
      {
        q: String.raw`A coherent BPSK link operates at $E_b/N_0 = 7$ dB. Estimate the BER.`,
        solution: String.raw`<p><b>Formula.</b> $$P_b = Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right)$$ where $P_b$ is the bit-error probability, $E_b/N_0$ the energy-per-bit to noise-density ratio, and $Q(\cdot)$ the Gaussian tail.</p>
<p><b>Substitute.</b> Convert dB to linear: $E_b/N_0 = 10^{7/10}=10^{0.7}\approx 5.01$. Then $P_b = Q\!\left(\sqrt{2\times5.01}\right)=Q\!\left(\sqrt{10.02}\right)$.</p>
<p><b>Compute.</b> $\sqrt{10.02}=3.166$, so $P_b = Q(3.166)$. From the Gaussian tail, $Q(3.17)\approx 7.7\times10^{-4}$, giving <strong>BER $\approx 8\times10^{-4}$</strong> (dimensionless).</p>
<p><b>Explanation.</b> At 7 dB the link sits on the steep part of the waterfall, well above the $\sim9.6$ dB needed for $10^{-5}$; an engineer reads this as "usable but marginal", typically requiring coding to reach a service-grade BER.</p>`
      },
      {
        q: String.raw`What $E_b/N_0$ (in dB) is required for BPSK to achieve BER $=10^{-6}$?`,
        solution: String.raw`<p><b>Formula.</b> Invert $$P_b = Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right)\;\Rightarrow\;\frac{E_b}{N_0}=\frac{\big[Q^{-1}(P_b)\big]^2}{2}$$ with $Q^{-1}$ the inverse Gaussian tail.</p>
<p><b>Substitute.</b> For $P_b=10^{-6}$, $Q^{-1}(10^{-6})\approx 4.75$, so $E_b/N_0 = (4.75)^2/2 = 22.56/2$.</p>
<p><b>Compute.</b> $E_b/N_0 = 11.28$ (linear) $=10\log_{10}(11.28)=\mathbf{10.5\ dB}$.</p>
<p><b>Explanation.</b> Each decade lower in target BER costs only about a decibel more $E_b/N_0$ here — the hallmark of the Q-function's steep tail — which is why tightening a spec from $10^{-5}$ to $10^{-6}$ is cheap in link margin.</p>`
      },
      {
        q: String.raw`A BPSK receiver has a residual carrier phase error of $25^\circ$. By how many dB does the effective $E_b/N_0$ drop?`,
        solution: String.raw`<p><b>Formula.</b> A phase error $\theta$ scales the correlator amplitude by $\cos\theta$, so the SNR loss is $$L_{\text{dB}} = -20\log_{10}(\cos\theta).$$</p>
<p><b>Substitute.</b> $L_{\text{dB}} = -20\log_{10}(\cos 25^\circ) = -20\log_{10}(0.9063)$.</p>
<p><b>Compute.</b> $\log_{10}(0.9063)=-0.0427$, so $L_{\text{dB}} = -20(-0.0427)=\mathbf{0.85\ dB}$.</p>
<p><b>Explanation.</b> Under a degree of imperfect carrier recovery the penalty is small, but near the BER threshold even 0.85 dB visibly worsens the error rate — hence the value of tight carrier-tracking loops in coherent receivers.</p>`
      },
      {
        q: String.raw`A BPSK signal has bit rate $R_b = 2$ Mbit/s. Find the null-to-null RF bandwidth with rectangular pulses, and the occupied bandwidth with RRC roll-off $\alpha=0.35$.`,
        solution: String.raw`<p><b>Formula.</b> Rectangular BPSK has null-to-null bandwidth $B_{\text{null}} = 2R_b$; RRC-shaped BPSK occupies $B_{\text{RRC}} = R_b(1+\alpha)$, where $R_b$ is the bit rate and $\alpha$ the roll-off.</p>
<p><b>Substitute.</b> $B_{\text{null}} = 2\times 2\ \text{MHz}$ and $B_{\text{RRC}} = 2\times(1+0.35)\ \text{MHz}$.</p>
<p><b>Compute.</b> $B_{\text{null}} = \mathbf{4\ MHz}$; $B_{\text{RRC}} = 2\times1.35 = \mathbf{2.7\ MHz}$.</p>
<p><b>Explanation.</b> Shaping cuts the occupied bandwidth from 4 MHz to 2.7 MHz — about a third narrower — which is exactly why real systems never send raw rectangular pulses: spectrum is scarce and neighbouring channels must be protected.</p>`
      },
      {
        q: String.raw`Given noise PSD $N_0/2 = 10^{-10}$ W/Hz and required BER $=10^{-5}$ (so $E_b/N_0=9.6$ dB $=9.12$ linear), find the minimum $E_b$.`,
        solution: String.raw`<p><b>Formula.</b> $$E_b = \left(\frac{E_b}{N_0}\right)_{\text{lin}}\! \cdot N_0,\qquad N_0 = 2\times\frac{N_0}{2}$$ with $E_b$ the energy per bit and $N_0$ the one-sided noise density.</p>
<p><b>Substitute.</b> $N_0 = 2\times10^{-10}$ W/Hz. $E_b = 9.12\times(2\times10^{-10})$.</p>
<p><b>Compute.</b> $E_b = 18.24\times10^{-10} = \mathbf{1.82\times10^{-9}}$ J/bit.</p>
<p><b>Explanation.</b> This is the minimum received energy each bit must carry to hit $10^{-5}$; multiplied by the bit rate it sets the required received power, tying the abstract $E_b/N_0$ spec directly into a link budget.</p>`
      },
      {
        q: String.raw`Two systems: BPSK and coherent BFSK, both at BER $=10^{-5}$. What is the BPSK power advantage?`,
        solution: String.raw`<p><b>Formula.</b> BPSK needs the $E_b/N_0$ solving $Q(\sqrt{2E_b/N_0})=10^{-5}$; coherent BFSK (orthogonal) needs $Q(\sqrt{E_b/N_0})=10^{-5}$. The advantage is the dB difference of the two required ratios.</p>
<p><b>Substitute.</b> BPSK requires $E_b/N_0 = 9.6$ dB; coherent BFSK requires $12.6$ dB. Advantage $= 12.6 - 9.6$.</p>
<p><b>Compute.</b> Advantage $=\mathbf{3\ dB}$.</p>
<p><b>Explanation.</b> The 3 dB is exactly the factor-2 inside BPSK's Q-argument ($2E_b/N_0$ vs $E_b/N_0$): antipodal signalling doubles the effective decision distance, so BPSK reaches the same BER at half the energy per bit.</p>`
      }
    ],
    realWorld: String.raw`<p>BPSK dominates wherever link margin is scarce. GPS L1 C/A code is BPSK-spread at 1.023 Mchip/s; the very low received SNR (below the noise floor) is why BPSK's power efficiency matters. Deep-space missions (Voyager, Mars landers) use BPSK/QPSK with strong FEC because every dB of $E_b/N_0$ translates into antenna size or transmit power at planetary distances.</p>
<p>IEEE 802.11a/g uses BPSK for its lowest, most robust data rate (6 Mbit/s), falling back to it when SNR is poor. Satellite TT&C (telemetry, tracking, command) links favor BPSK for command uplinks where reliability trumps throughput. In all these systems the $180^\circ$ ambiguity is handled by differential encoding or by a known synchronization word so the demodulator can correct a potential polarity inversion.</p>`,
    related: ['dbpsk', 'matched-filter', 'costas-loop', 'evm', 'comm-basics']
  },
  {
    id: 'dbpsk',
    title: 'Differential BPSK',
    category: 'Modulation & Detection',
    tags: ['modulation', 'psk', 'differential', 'non-coherent', 'ber', 'phase-ambiguity'],
    summary: String.raw`Differential BPSK encodes bits in the phase transition between consecutive symbols, enabling differentially-coherent detection without absolute carrier phase, at the cost of about 1 dB in $E_b/N_0$ versus coherent BPSK.`,
    prerequisites: ['bpsk', 'comm-basics', 'noise'],
    intro: String.raw`<p>Differential BPSK (DBPSK) solves the two biggest practical headaches of coherent BPSK: the need for absolute carrier-phase recovery and the $180^\circ$ phase ambiguity. Instead of encoding a bit in the <em>absolute</em> phase of each symbol, DBPSK encodes it in the <em>change</em> of phase between consecutive symbols. A "no change" (0 or $180^\circ$ depending on convention) means one bit value; a "change" means the other.</p>
<p>Because information rides on phase differences, a constant unknown phase offset — including a $180^\circ$ inversion — cancels between adjacent symbols. The receiver can therefore demodulate by comparing each symbol to the previous one, either after coherent detection (differential decoding) or, more importantly, with a differentially-coherent detector that needs no carrier phase-locked loop at all. The price is a modest ~1 dB penalty in required $E_b/N_0$ and a doubling of the error probability due to correlated noise across the two compared symbols.</p>`,
    sections: [
      {
        h: 'Differential Encoding Rule',
        html: String.raw`<p>Let the input data bits be $d_k \in \{0,1\}$ and the transmitted (differentially encoded) bits be $c_k$. The standard encoding rule is</p>
<p>$$c_k = d_k \oplus \overline{c_{k-1}}\quad\text{or, common convention,}\quad c_k = d_k \oplus c_{k-1}$$</p>
<p>with an initial reference symbol $c_0$. In phase terms, a data "1" causes <em>no phase change</em> (transmit same phase as previous) and a data "0" causes a $180^\circ$ <em>phase change</em> — or the opposite convention. The transmitted carrier phase is then $\theta_k = \theta_{k-1} + \Delta\theta_k$ where $\Delta\theta_k\in\{0,\pi\}$.</p>
<p>The key: the receiver never needs to know the absolute phase. It only compares $\theta_k$ with $\theta_{k-1}$. Any constant channel phase $\phi$ appears in both and cancels in the difference.</p>
<table class="data">
<tr><th>Data $d_k$</th><th>Phase change $\Delta\theta$</th><th>Meaning</th></tr>
<tr><td>1</td><td>$0$</td><td>same phase as previous</td></tr>
<tr><td>0</td><td>$\pi$</td><td>flip phase</td></tr>
</table>
<div class="callout"><strong>Note:</strong> Conventions differ (some map "1" to a transition). What matters is that data lives in the transition, not the absolute phase.</div>`
      },
      {
        h: 'Differentially-Coherent Detection',
        html: String.raw`<p><em>Intuition first:</em> if you cannot measure phase against an absolute reference, measure it against something you already have — the previous symbol. Whatever unknown phase the channel added is (almost) the same on both symbols, so comparing them cancels it out, the way two clocks running equally fast can still measure elapsed time even if neither shows the true hour. The math below just makes "compare to the previous symbol" precise.</p>
<p>The optimum non-coherent DBPSK receiver correlates the current symbol with the <em>previous</em> symbol and examines the sign of the real part:</p>
<p>$$z_k = \operatorname{Re}\{\,r_k\, r_{k-1}^{*}\,\}.$$</p>
<p>Write the received complex baseband symbols as $r_k = \sqrt{E_b}\,e^{j\theta_k}e^{j\phi}+n_k$, where $\phi$ is the unknown constant channel phase. Then</p>
<p>$$r_k r_{k-1}^* \approx E_b\,e^{j(\theta_k-\theta_{k-1})} + (\text{noise terms}).$$</p>
<p>The unknown $\phi$ cancels. If $\Delta\theta = \theta_k-\theta_{k-1}=0$, $\operatorname{Re}\{z_k\}>0$; if $\Delta\theta=\pi$, $\operatorname{Re}\{z_k\}<0$. A simple sign test recovers the data. No carrier PLL is needed — only a one-symbol delay and a complex multiply. This robustness is why DBPSK is popular in fast-fading, frequency-hopping, and low-cost systems.</p>
<div class="callout"><strong>Why the ~1 dB penalty:</strong> the decision uses two noisy symbols ($r_k$ and $r_{k-1}$), so noise enters twice and the reference is itself noisy — unlike coherent BPSK whose reference is a clean local oscillator.</div>`
      },
      {
        h: 'Alternative: Differential Decoding After Coherent Detection',
        html: String.raw`<p>DBPSK can also be received with a coherent BPSK demodulator followed by a differential decoder: detect each symbol's polarity, then XOR consecutive decisions to undo the differential encoding. This variant keeps most of coherent BPSK's power efficiency but suffers <strong>error doubling</strong>: a single channel error corrupts two decoded bits (the erroneous symbol and its neighbor). The resulting BER is</p>
<p>$$P_b^{\text{diff-dec}} \approx 2\,Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right)\,[1 - Q(\cdot)] \approx 2\,Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right).$$</p>
<p>This is only about 0.3 dB worse than coherent BPSK at high SNR — far better than the ~1 dB of true differentially-coherent detection. The distinction is important: "DBPSK" without qualification usually means the non-coherent (differentially-coherent) detector with the $\tfrac12 e^{-E_b/N_0}$ BER.</p>`
      },
      {
        h: 'Bit-Error-Rate Performance',
        html: String.raw`<p>For differentially-coherent DBPSK over AWGN the exact bit-error probability is beautifully simple:</p>
<p>$$\boxed{P_b = \tfrac12\,e^{-E_b/N_0}}.$$</p>
<p>This arises from the statistics of the product $r_k r_{k-1}^*$; the decision variable is a difference of noncentral chi-square terms whose error integral collapses to a single exponential. At a target BER of $10^{-5}$, DBPSK needs $E_b/N_0 \approx 10.5$ dB versus $9.6$ dB for coherent BPSK — the celebrated <strong>~1 dB penalty</strong> (it narrows slightly at very high SNR and widens near threshold).</p>
<table class="data">
<tr><th>$E_b/N_0$ (dB)</th><th>DBPSK $P_b$</th><th>Coherent BPSK $P_b$</th></tr>
<tr><td>7</td><td>$3.3\times10^{-3}$</td><td>$7.7\times10^{-4}$</td></tr>
<tr><td>9.6</td><td>$5.5\times10^{-5}$</td><td>$1.0\times10^{-5}$</td></tr>
<tr><td>10.5</td><td>$6.7\times10^{-6}$</td><td>$1.1\times10^{-6}$</td></tr>
<tr><td>12</td><td>$6.5\times10^{-8}$</td><td>$9\times10^{-9}$</td></tr>
</table>
<p>Note the penalty grows at very high SNR (the exponential vs Q-function tails diverge), but in the practical $10^{-3}$–$10^{-6}$ region the ~1 dB rule holds well.</p>`
      },
      {
        h: 'Advantages, Trade-offs, and When to Use',
        html: String.raw`<p>DBPSK's appeal is operational simplicity and robustness:</p>
<ul>
<li><strong>No carrier PLL / Costas loop:</strong> the differential detector needs only a symbol delay and multiplier, dramatically simplifying acquisition and reducing lock-in time.</li>
<li><strong>Immune to phase ambiguity:</strong> the $180^\circ$ (and any constant) phase offset cancels — no preamble is required to resolve polarity.</li>
<li><strong>Robust to slow phase drift and frequency-hopping:</strong> as long as phase is roughly constant over two symbols, detection works; ideal for FH systems that re-acquire each hop.</li>
<li><strong>Fast fading tolerant:</strong> tracks a phase that changes slowly relative to the symbol rate.</li>
</ul>
<p>The costs: ~1 dB more power for the same BER, error propagation over pairs of symbols, and sensitivity to residual <em>frequency</em> offset $\Delta f$ (which rotates phase by $2\pi\Delta f T_s$ between symbols and does <em>not</em> cancel). A frequency offset $\Delta f$ introduces a fixed rotation $\Phi=2\pi\Delta f T_s$ in the decision variable, degrading margin unless $\Delta f T_s \ll 1$.</p>`
      },
      {
        h: 'Frequency Offset Sensitivity and Practical Notes',
        html: String.raw`<p>Because differential detection multiplies $r_k$ by $r_{k-1}^*$, a constant carrier <em>frequency</em> error $\Delta f$ produces a phase rotation $2\pi\Delta f T_s$ per symbol that appears directly on the decision axis. Unlike a static phase, this does not cancel. The decision variable rotates, and BER degrades roughly as if the effective SNR were scaled by $\cos^2(2\pi\Delta f T_s)$. Systems therefore still need coarse frequency correction (an AFC/FLL) even though they skip fine phase recovery.</p>
<p>Practical DBPSK also spreads a single deep fade or click into two bit errors; concatenation with FEC (which sees paired errors) benefits from interleaving. DBPSK's spectrum, envelope, and bandwidth are essentially identical to BPSK's — the difference is entirely in the encoder/decoder, not the RF waveform.</p>
<div class="callout"><strong>Rule of thumb:</strong> keep $|\Delta f|\,T_s < 0.01$ for negligible differential-detection loss.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>By the end of this topic the following should feel natural:</p>
<ul>
<li><strong>The core trick:</strong> data lives in the phase <em>transition</em> ($c_k=d_k\oplus c_{k-1}$), so any constant channel phase — including a $180^\circ$ inversion — cancels between adjacent symbols.</li>
<li><strong>The receiver:</strong> $z_k=\operatorname{Re}\{r_k r_{k-1}^*\}$ needs only a one-symbol delay and a complex multiply, with no carrier PLL — the whole appeal of DBPSK.</li>
<li><strong>The cost:</strong> a closed-form BER of $\tfrac12 e^{-E_b/N_0}$, about 1 dB worse than coherent BPSK because the phase reference is a noisy symbol, plus error propagation over symbol pairs.</li>
<li><strong>The blind spot:</strong> a <em>frequency</em> offset rotates the decision by $2\pi\Delta f T_s$ and does NOT cancel, so coarse AFC is still required (keep $|\Delta f|T_s<0.01$).</li>
<li><strong>The choice:</strong> prefer DBPSK for frequency-hopping, fast-fading, or low-cost radios; prefer coherent BPSK when a stable reference is available and every dB counts.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`DBPSK encodes data in the phase <em>transition</em> between consecutive symbols, not the absolute phase.`,
      String.raw`Differentially-coherent BER is $P_b = \tfrac12 e^{-E_b/N_0}$ — a closed-form exponential.`,
      String.raw`The penalty vs coherent BPSK is about 1 dB at typical BERs (widens at very high SNR).`,
      String.raw`Non-coherent detection uses $z_k=\operatorname{Re}\{r_k r_{k-1}^*\}$ — a one-symbol delay and complex multiply; no PLL.`,
      String.raw`A constant channel phase (including $180^\circ$) cancels in the difference, eliminating phase ambiguity.`,
      String.raw`Differential decoding after coherent detection instead gives ~$2Q(\sqrt{2E_b/N_0})$ (error doubling, only ~0.3 dB penalty).`,
      String.raw`A single symbol error typically corrupts two decoded data bits (error propagation).`,
      String.raw`DBPSK is sensitive to frequency offset $\Delta f$: it rotates the decision by $2\pi\Delta f T_s$ and does NOT cancel.`,
      String.raw`The RF waveform/spectrum is identical to BPSK; only the encoder/decoder differ.`,
      String.raw`Ideal for frequency-hopping, fast-changing channels, and low-cost radios where carrier recovery is impractical.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="210" fill="#1c232e"/>
<text x="20" y="25" fill="#e6edf3" font-size="13">Differentially-coherent DBPSK detector</text>
<rect x="30" y="70" width="70" height="40" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/>
<text x="42" y="94" fill="#e6edf3" font-size="11">$r_k$ in</text>
<line x1="100" y1="90" x2="180" y2="90" stroke="#9aa7b5" stroke-width="1.5"/>
<rect x="180" y="70" width="70" height="40" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/>
<text x="192" y="94" fill="#e6edf3" font-size="11">$\times$ conj</text>
<line x1="140" y1="90" x2="140" y2="150" stroke="#9aa7b5" stroke-width="1.5"/>
<rect x="105" y="150" width="70" height="35" fill="#1c232e" stroke="#63e6be" stroke-width="1.5"/>
<text x="118" y="172" fill="#e6edf3" font-size="11">delay $T_s$</text>
<line x1="175" y1="167" x2="215" y2="167" stroke="#9aa7b5" stroke-width="1.5"/>
<line x1="215" y1="167" x2="215" y2="110" stroke="#9aa7b5" stroke-width="1.5"/>
<text x="180" y="163" fill="#9aa7b5" font-size="10">$r_{k-1}^*$</text>
<line x1="250" y1="90" x2="330" y2="90" stroke="#9aa7b5" stroke-width="1.5"/>
<rect x="330" y="70" width="80" height="40" fill="#1c232e" stroke="#b197fc" stroke-width="1.5"/>
<text x="342" y="88" fill="#e6edf3" font-size="10">$\operatorname{Re}\{\cdot\}$</text>
<text x="342" y="103" fill="#9aa7b5" font-size="10">sign</text>
<line x1="410" y1="90" x2="500" y2="90" stroke="#9aa7b5" stroke-width="1.5"/>
<text x="440" y="84" fill="#63e6be" font-size="11">bit out</text>
</svg>`,
        caption: 'Differentially-coherent DBPSK receiver: multiply current symbol by the conjugate of the delayed one and take the sign of the real part. No carrier PLL.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="150" fill="#1c232e"/>
<text x="20" y="25" fill="#e6edf3" font-size="12">Phase trajectory (data in transitions)</text>
<line x1="30" y1="90" x2="510" y2="90" stroke="#9aa7b5" stroke-width="1"/>
<text x="35" y="120" fill="#9aa7b5" font-size="10">$d$:  1    0    0    1    0</text>
<circle cx="70" cy="70" r="6" fill="#4dabf7"/>
<circle cx="150" cy="70" r="6" fill="#4dabf7"/>
<circle cx="230" cy="110" r="6" fill="#ff6b6b"/>
<circle cx="310" cy="70" r="6" fill="#4dabf7"/>
<circle cx="390" cy="70" r="6" fill="#4dabf7"/>
<circle cx="470" cy="110" r="6" fill="#ff6b6b"/>
<line x1="70" y1="70" x2="150" y2="70" stroke="#63e6be" stroke-width="1.5"/>
<line x1="150" y1="70" x2="230" y2="110" stroke="#ffa94d" stroke-width="1.5"/>
<line x1="230" y1="110" x2="310" y2="70" stroke="#ffa94d" stroke-width="1.5"/>
<line x1="310" y1="70" x2="390" y2="70" stroke="#63e6be" stroke-width="1.5"/>
<line x1="390" y1="70" x2="470" y2="110" stroke="#ffa94d" stroke-width="1.5"/>
<text x="55" y="62" fill="#9aa7b5" font-size="9">phase 0</text>
<text x="205" y="130" fill="#9aa7b5" font-size="9">phase $\pi$</text>
</svg>`,
        caption: 'Data "1" keeps the phase (green, no transition); data "0" flips it by 180 degrees (orange transition). The receiver reads transitions, immune to a constant offset.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr2-dbpsk" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="180" fill="#1c232e"/>
<text x="20" y="24" fill="#e6edf3" font-size="13">Differential encoder (transmitter)</text>
<text x="20" y="86" fill="#9aa7b5" font-size="11">$d_k$ in</text>
<line x1="55" y1="90" x2="110" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-dbpsk)"/>
<circle cx="130" cy="90" r="18" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/>
<text x="122" y="95" fill="#e6edf3" font-size="14">$\oplus$</text>
<line x1="148" y1="90" x2="255" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-dbpsk)"/>
<text x="180" y="82" fill="#9aa7b5" font-size="10">$c_k$</text>
<rect x="255" y="70" width="95" height="40" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/>
<text x="266" y="88" fill="#e6edf3" font-size="10">BPSK map</text>
<text x="270" y="103" fill="#9aa7b5" font-size="10">$\theta_k$</text>
<line x1="350" y1="90" x2="420" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-dbpsk)"/>
<text x="430" y="94" fill="#63e6be" font-size="11">to channel</text>
<rect x="90" y="140" width="80" height="30" fill="#1c232e" stroke="#63e6be" stroke-width="1.5"/>
<text x="103" y="160" fill="#e6edf3" font-size="10">delay $T_s$</text>
<line x1="200" y1="90" x2="200" y2="155" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="200" y1="155" x2="170" y2="155" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#arr2-dbpsk)"/>
<line x1="90" y1="155" x2="60" y2="155" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="60" y1="155" x2="60" y2="98" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#arr2-dbpsk)"/>
<text x="205" y="150" fill="#9aa7b5" font-size="10">$c_{k-1}$</text>
</svg>`,
        caption: 'Differential encoder: XOR the data bit with the previous encoded bit ($c_k=d_k\\oplus c_{k-1}$) via a one-symbol feedback delay, then BPSK-map. Data now lives in phase transitions.'
      }
    ],
    equations: [
      {
        title: 'Differential Encoding',
        tex: String.raw`$$c_k = d_k \oplus c_{k-1},\qquad \theta_k=\theta_{k-1}+\Delta\theta_k$$`,
        derivation: String.raw`<p>Each output symbol depends on the input bit and the previous output. In phase terms $\Delta\theta_k=0$ for one data value and $\pi$ for the other. Starting from a reference $c_0$, the sequence propagates. Decoding inverts this: $\hat d_k=\hat c_k\oplus\hat c_{k-1}$.</p>`
      },
      {
        title: 'Non-coherent Decision Variable',
        tex: String.raw`$$z_k=\operatorname{Re}\{r_k r_{k-1}^*\}$$`,
        derivation: String.raw`<p>With $r_k=\sqrt{E_b}e^{j\theta_k}e^{j\phi}+n_k$, the product $r_k r_{k-1}^* = E_b e^{j(\theta_k-\theta_{k-1})} + (\text{noise})$. The unknown $\phi$ cancels because it appears as $e^{j\phi}e^{-j\phi}=1$. Sign of $\operatorname{Re}\{z_k\}$ reveals whether $\Delta\theta=0$ or $\pi$.</p>`
      },
      {
        title: 'DBPSK Bit-Error Rate',
        tex: String.raw`$$P_b=\tfrac12 e^{-E_b/N_0}$$`,
        derivation: String.raw`<p>The decision statistic for differentially-coherent detection is a quadratic form in complex Gaussians. Analyzing the pairwise error event (adjacent symbols) yields the classic result $P_b=\tfrac12\exp(-E_b/N_0)$ — a standard result for differentially-coherent PSK (equivalently, the two-symbol observation collapses the error integral to a single exponential).</p>`
      },
      {
        title: 'Approximate ~1 dB Penalty',
        tex: String.raw`$$\Delta(\text{dB}) = 10\log_{10}\!\frac{(E_b/N_0)_{\text{DBPSK}}}{(E_b/N_0)_{\text{BPSK}}}\approx 1\text{ dB}$$`,
        derivation: String.raw`<p>Solve $\tfrac12 e^{-\gamma_D}=Q(\sqrt{2\gamma_B})=10^{-5}$. For DBPSK $\gamma_D=\ln(1/(2\times10^{-5}))=10.82$ (10.34 dB). For BPSK $\gamma_B=9.12$ (9.6 dB). Difference $\approx 0.9$–$1$ dB.</p>`
      },
      {
        title: 'Differential-Decoding BER (coherent + XOR)',
        tex: String.raw`$$P_b^{\text{dd}}\approx 2\,Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right)$$`,
        derivation: String.raw`<p>A coherent symbol error rate $p=Q(\sqrt{2E_b/N_0})$ propagates: XOR-decoding makes an error whenever exactly one of two consecutive symbols is wrong, giving $2p(1-p)\approx 2p$ for small $p$. Factor of 2 = ~0.3 dB penalty, much less than differentially-coherent's ~1 dB.</p>`
      },
      {
        title: 'Frequency-Offset Rotation',
        tex: String.raw`$$\Phi=2\pi\,\Delta f\,T_s$$`,
        derivation: String.raw`<p>Between adjacent symbols, a carrier frequency error $\Delta f$ advances the phase by $2\pi\Delta f T_s$. In $r_k r_{k-1}^*$ the two phases are $2\pi f(t_k)$ and $2\pi f(t_{k-1})$; their difference is $2\pi\Delta f T_s$, which does not cancel and rotates the decision variable, requiring AFC.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does DBPSK encode data in?`, back: String.raw`The phase transition (change) between consecutive symbols, not the absolute phase.` },
      { front: String.raw`Differentially-coherent DBPSK BER?`, back: String.raw`$P_b=\tfrac12 e^{-E_b/N_0}$.` },
      { front: String.raw`How large is the DBPSK penalty vs coherent BPSK?`, back: String.raw`About 1 dB at typical BERs; grows slightly at very high SNR.` },
      { front: String.raw`What is the non-coherent DBPSK decision variable?`, back: String.raw`$z_k=\operatorname{Re}\{r_k r_{k-1}^*\}$ — sign gives the bit.` },
      { front: String.raw`Why is DBPSK immune to phase ambiguity?`, back: String.raw`A constant channel phase (including $180^\circ$) cancels in the symbol-to-symbol difference.` },
      { front: String.raw`Does DBPSK need a carrier PLL?`, back: String.raw`No — only a one-symbol delay and complex multiplier for differentially-coherent detection.` },
      { front: String.raw`What is the main hardware for DBPSK detection?`, back: String.raw`A symbol delay, a conjugate multiplier, and a sign/real-part decision.` },
      { front: String.raw`What is error propagation in DBPSK?`, back: String.raw`One symbol error typically corrupts two decoded data bits.` },
      { front: String.raw`BER of differential decoding after coherent detection?`, back: String.raw`$\approx 2Q(\sqrt{2E_b/N_0})$ (~0.3 dB penalty from error doubling).` },
      { front: String.raw`Is DBPSK sensitive to frequency offset?`, back: String.raw`Yes — $\Delta f$ rotates the decision by $2\pi\Delta f T_s$ and does not cancel; needs AFC.` },
      { front: String.raw`$E_b/N_0$ for DBPSK at BER $=10^{-5}$?`, back: String.raw`About 10.5 dB (vs 9.6 dB for coherent BPSK).` },
      { front: String.raw`Is the DBPSK RF waveform different from BPSK?`, back: String.raw`No — identical spectrum/envelope; only encoding/decoding differ.` },
      { front: String.raw`When is DBPSK preferred?`, back: String.raw`Frequency-hopping, fast-fading, or low-cost systems where carrier recovery is hard.` },
      { front: String.raw`Why the ~1 dB penalty specifically?`, back: String.raw`The decision uses two noisy symbols; the phase reference is itself noisy.` }
    ],
    mcqs: [
      { q: String.raw`DBPSK encodes information in:`, options: [String.raw`Absolute carrier phase`, String.raw`Phase transition between symbols`, String.raw`Carrier amplitude`, String.raw`Symbol duration`], answer: 1, explain: String.raw`Data rides on the change of phase, which cancels a constant offset.` },
      { q: String.raw`The differentially-coherent DBPSK BER is:`, options: [String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$e^{-2E_b/N_0}$`, String.raw`$Q(\sqrt{E_b/N_0})$`], answer: 1, explain: String.raw`Standard result for differentially-coherent PSK.` },
      { q: String.raw`Approximate penalty of DBPSK vs coherent BPSK at $10^{-5}$:`, options: [String.raw`0.1 dB`, String.raw`1 dB`, String.raw`3 dB`, String.raw`6 dB`], answer: 1, explain: String.raw`~9.6 dB vs ~10.5 dB.` },
      { q: String.raw`The DBPSK non-coherent decision variable is:`, options: [String.raw`$\operatorname{Re}\{r_k r_{k-1}^*\}$`, String.raw`$|r_k|^2$`, String.raw`$\arg r_k$`, String.raw`$r_k+r_{k-1}$`], answer: 0, explain: String.raw`Correlating with the delayed conjugate cancels the unknown phase.` },
      { q: String.raw`Which impairment does DBPSK inherently tolerate without correction?`, options: [String.raw`Constant carrier phase offset`, String.raw`Large frequency offset`, String.raw`Timing jitter`, String.raw`Thermal noise`], answer: 0, explain: String.raw`A constant phase (incl. $180^\circ$) cancels in the difference.` },
      { q: String.raw`Which impairment does DBPSK NOT cancel?`, options: [String.raw`$180^\circ$ ambiguity`, String.raw`Constant phase offset`, String.raw`Carrier frequency offset`, String.raw`DC in the LO phase`], answer: 2, explain: String.raw`Frequency offset rotates by $2\pi\Delta f T_s$ per symbol and accumulates in the difference.` },
      { q: String.raw`A single symbol error in DBPSK typically produces:`, options: [String.raw`No bit errors`, String.raw`One bit error`, String.raw`Two bit errors`, String.raw`Half a bit error`], answer: 2, explain: String.raw`Differential decoding couples adjacent decisions (error propagation).` },
      { q: String.raw`Differential decoding after coherent BPSK detection gives BER:`, options: [String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$\approx 2Q(\sqrt{2E_b/N_0})$`, String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$Q(\sqrt{E_b/N_0})$`], answer: 1, explain: String.raw`Error doubling from XOR decoding, ~0.3 dB penalty.` },
      { q: String.raw`The main hardware simplification of DBPSK is:`, options: [String.raw`No matched filter`, String.raw`No carrier PLL/Costas loop`, String.raw`No ADC`, String.raw`No antenna`], answer: 1, explain: String.raw`Differentially-coherent detection needs only a delay and multiplier.` },
      { q: String.raw`DBPSK's RF spectrum compared with BPSK is:`, options: [String.raw`Twice as wide`, String.raw`Half as wide`, String.raw`Essentially identical`, String.raw`Flat`], answer: 2, explain: String.raw`Only the encoder/decoder differ; the transmitted waveform is the same.` },
      { q: String.raw`For negligible differential-detection loss, keep:`, options: [String.raw`$|\Delta f|T_s < 0.01$`, String.raw`$|\Delta f|T_s > 1$`, String.raw`$E_b/N_0 < 0$`, String.raw`$T_s \to 0$`], answer: 0, explain: String.raw`Small per-symbol phase rotation keeps the decision axis aligned.` },
      { q: String.raw`Why does DBPSK cost ~1 dB more than BPSK?`, options: [String.raw`Wider bandwidth`, String.raw`Noisy two-symbol reference`, String.raw`Lower symbol rate`, String.raw`Higher PAPR`], answer: 1, explain: String.raw`The phase reference is a noisy previous symbol, not a clean LO.` },
      { q: String.raw`DBPSK is especially attractive in:`, options: [String.raw`Deep-space with huge antennas`, String.raw`Frequency-hopping and fast-fading channels`, String.raw`Fiber optics`, String.raw`Static point-to-point microwave only`], answer: 1, explain: String.raw`It re-acquires each hop without needing a carrier lock.` }
    ],
    numericals: [
      {
        q: String.raw`Compute DBPSK BER at $E_b/N_0 = 8$ dB.`,
        solution: String.raw`<p><b>Formula.</b> $$P_b = \tfrac12\,e^{-E_b/N_0}$$ the differentially-coherent DBPSK bit-error probability, with $E_b/N_0$ in linear units.</p>
<p><b>Substitute.</b> $E_b/N_0 = 10^{8/10}=10^{0.8}=6.31$, so $P_b = \tfrac12\,e^{-6.31}$.</p>
<p><b>Compute.</b> $e^{-6.31}=1.81\times10^{-3}$, hence $P_b = \tfrac12(1.81\times10^{-3}) = \mathbf{9.0\times10^{-4}}$.</p>
<p><b>Explanation.</b> Sanity check: coherent BPSK at the same 8 dB gives $\approx 1.9\times10^{-4}$, so DBPSK is a few times worse — the expected ~1 dB penalty for using a noisy previous symbol as the phase reference instead of a clean carrier.</p>`
      },
      {
        q: String.raw`What $E_b/N_0$ (dB) does DBPSK need for BER $=10^{-4}$?`,
        solution: String.raw`<p><b>Formula.</b> Invert $P_b=\tfrac12 e^{-\gamma}$: $$\gamma = \ln\!\left(\frac{1}{2P_b}\right),\qquad \gamma_{\text{dB}}=10\log_{10}\gamma$$ with $\gamma=E_b/N_0$.</p>
<p><b>Substitute.</b> $\gamma = \ln\!\left(\frac{1}{2\times10^{-4}}\right)=\ln(5000)$.</p>
<p><b>Compute.</b> $\gamma = 8.52$ (linear) $=10\log_{10}(8.52)=\mathbf{9.3\ dB}$.</p>
<p><b>Explanation.</b> This is the DBPSK operating point for a $10^{-4}$ service; comparing it to the BPSK requirement (next problem) quantifies the cost of dropping the carrier PLL.</p>`
      },
      {
        q: String.raw`Coherent BPSK needs $E_b/N_0=8.4$ dB for BER $=10^{-4}$. Find the DBPSK penalty at this target using the previous result.`,
        solution: String.raw`<p><b>Formula.</b> $$\Delta_{\text{dB}} = \left(\frac{E_b}{N_0}\right)_{\text{DBPSK,dB}} - \left(\frac{E_b}{N_0}\right)_{\text{BPSK,dB}}$$ the horizontal gap between the two BER curves at a fixed target.</p>
<p><b>Substitute.</b> $\Delta_{\text{dB}} = 9.3 - 8.4$.</p>
<p><b>Compute.</b> $\Delta_{\text{dB}} = \mathbf{0.9\ dB}$.</p>
<p><b>Explanation.</b> Just under 1 dB, matching the celebrated "~1 dB DBPSK penalty" rule of thumb; an engineer trades this modest margin for a receiver that needs only a delay-and-multiply, no carrier recovery.</p>`
      },
      {
        q: String.raw`A DBPSK system runs at symbol rate $R_s=1$ Msym/s with a carrier frequency offset $\Delta f = 2$ kHz. Find the per-symbol phase rotation and comment.`,
        solution: String.raw`<p><b>Formula.</b> $$\Phi = 2\pi\,\Delta f\,T_s,\qquad T_s = 1/R_s$$ the phase the offset accumulates between adjacent symbols, which does NOT cancel in differential detection.</p>
<p><b>Substitute.</b> $T_s = 1/(1\times10^6)=1\ \mu\text{s}$. $\Phi = 2\pi(2000)(10^{-6})$.</p>
<p><b>Compute.</b> $\Phi = 0.01257$ rad $= 0.72^\circ$; the normalized offset $\Delta f\,T_s = 0.002$.</p>
<p><b>Explanation.</b> Since $\Delta f\,T_s = 0.002 < 0.01$ (the rule-of-thumb threshold), the rotation is tiny and the detection loss is negligible — this link has comfortable frequency-offset margin.</p>`
      },
      {
        q: String.raw`If the offset rose to $\Delta f=20$ kHz at the same rate, what is the rotation, and the approximate SNR scaling?`,
        solution: String.raw`<p><b>Formula.</b> $$\Phi = 2\pi\,\Delta f\,T_s,\qquad \text{SNR scale} \approx \cos^2\Phi$$ the rotation and its effective SNR degradation on the decision axis.</p>
<p><b>Substitute.</b> $\Phi = 2\pi(20000)(10^{-6})$; then evaluate $\cos^2\Phi$.</p>
<p><b>Compute.</b> $\Phi = 0.1257$ rad $= 7.2^\circ$; $\cos^2(7.2^\circ)=0.984$, i.e. a loss of $10\log_{10}(0.984)=\mathbf{-0.07\ dB}$.</p>
<p><b>Explanation.</b> A tenfold larger offset still costs only ~0.07 dB, but the loss grows with $\Delta f\,T_s$; beyond this an automatic frequency control (AFC/FLL) loop becomes necessary to keep the decision axis aligned.</p>`
      },
      {
        q: String.raw`Compare DBPSK ($\tfrac12 e^{-\gamma}$) and BPSK ($Q(\sqrt{2\gamma})$) at $\gamma=12$ dB (linear 15.85). Which penalty do you observe?`,
        solution: String.raw`<p><b>Formula.</b> $$P_b^{\text{DBPSK}}=\tfrac12 e^{-\gamma},\qquad P_b^{\text{BPSK}}=Q\!\left(\sqrt{2\gamma}\right),\qquad \gamma=E_b/N_0.$$</p>
<p><b>Substitute.</b> $\gamma = 10^{12/10}=15.85$. DBPSK: $\tfrac12 e^{-15.85}$; BPSK: $Q(\sqrt{31.7})=Q(5.63)$.</p>
<p><b>Compute.</b> DBPSK $=\tfrac12(1.31\times10^{-7})=6.5\times10^{-8}$; BPSK $\approx 9\times10^{-9}$. Ratio $\approx 7$.</p>
<p><b>Explanation.</b> At high SNR the DBPSK/BPSK gap exceeds 1 dB because the exponential tail decays more slowly than the Gaussian $Q$ tail; the ~1 dB rule is a mid-SNR approximation and pessimistic to quote at very low BER.</p>`
      }
    ],
    realWorld: String.raw`<p>DBPSK is widely used where carrier recovery is impractical or wasteful. IEEE 802.11 (legacy 1 Mbit/s) uses DBPSK with Barker spreading precisely so cheap receivers avoid a full carrier PLL. Bluetooth's Enhanced Data Rate (EDR) uses $\pi/4$-DQPSK and 8-DPSK — differential variants for the same reason. Many frequency-hopping military and IoT radios adopt differential PSK because each hop lands on a new frequency with unknown phase; differential detection works immediately without re-locking a carrier loop.</p>
<p>The trade is deliberate: designers accept ~1 dB of link margin (and paired-error propagation, usually mitigated by interleaving before FEC) in exchange for fast acquisition, immunity to $180^\circ$ inversion, and lower-cost hardware. When link budget is tight and a stable coherent reference is available, coherent BPSK is chosen instead.</p>`,
    related: ['bpsk', 'costas-loop', 'frequency-hopping', 'matched-filter', 'fll']
  },
  {
    id: 'matched-filter',
    title: 'Matched Filter',
    category: 'Modulation & Detection',
    tags: ['detection', 'matched-filter', 'correlator', 'snr', 'cauchy-schwarz', 'pulse-shaping'],
    summary: String.raw`The matched filter $h(t)=s(T-t)$ maximizes the sampled signal-to-noise ratio in AWGN to $2E/N_0$, provably optimal by the Cauchy-Schwarz inequality, and is realized identically by a correlator.`,
    prerequisites: ['comm-basics', 'noise', 'psd'],
    intro: String.raw`<p><strong>Why does the matched filter exist?</strong> A receiver knows the <em>shape</em> of the pulse it is looking for — it just doesn't know whether a "1" or a "0" was sent, and noise is smearing everything. The natural question is: of all possible ways to process the received waveform before deciding, which one gives the cleanest look at the signal? The matched filter is the provably best answer. It is what you get when you ask "how do I weight the incoming samples to line them up perfectly with the pulse I expect, so the signal adds up coherently while noise partly cancels?" Because error probability is set entirely by the SNR at the decision instant, winning this one optimization wins the whole detection problem.</p>
<p>The matched filter is the single most important structure in digital receiver design. Given a known signal pulse $s(t)$ buried in additive white Gaussian noise, it is the linear time-invariant filter that maximizes the signal-to-noise ratio at a specific sampling instant. Because SNR at the decision point dictates error probability, the matched filter minimizes the bit-error rate for every linear modulation — BPSK, QPSK, PAM, QAM — over the AWGN channel.</p>
<p>Its impulse response is simply the time-reversed, delayed copy of the pulse: $h(t)=s(T-t)$. Equivalently, the matched filter is a <em>correlator</em> that computes $\int_0^T y(t)s(t)\,dt$. Understanding why this maximizes SNR (via Cauchy-Schwarz), how it whitens the decision, why it produces a sufficient statistic, and how it connects to pulse shaping (RRC) and to spread-spectrum despreading is essential exam material and everyday engineering.</p>`,
    sections: [
      {
        h: 'Problem Setup: Detecting a Known Pulse in Noise',
        html: String.raw`<p>Consider a received signal $y(t)=s(t)+w(t)$ over $0\le t\le T$, where $s(t)$ is a known deterministic pulse of energy $E=\int_0^T s^2(t)\,dt$ and $w(t)$ is white Gaussian noise with two-sided PSD $N_0/2$. We pass $y(t)$ through an LTI filter $h(t)$ and sample the output at $t=T$:</p>
<p>$$y_o(T)=\underbrace{\int_0^T h(T-\tau)s(\tau)\,d\tau}_{s_o(T)} + \underbrace{\int_0^T h(T-\tau)w(\tau)\,d\tau}_{n_o(T)}.$$</p>
<p>We want to choose $h$ to maximize the output SNR at the sample instant:</p>
<p>$$\mathrm{SNR}=\frac{|s_o(T)|^2}{E[n_o^2(T)]}.$$</p>
<p>The numerator is the squared signal sample; the denominator is the output noise power. The filter that maximizes this ratio is the matched filter — and remarkably, the answer depends only on the pulse <em>shape</em> and its energy, not on where the pulse sits in a larger signal.</p>`
      },
      {
        h: 'Derivation via Cauchy-Schwarz',
        html: String.raw`<p><em>The idea before the algebra:</em> Cauchy-Schwarz is the mathematical statement of "two vectors give the biggest dot product when they point the same way." Here the two "vectors" are the filter's frequency response and the signal's spectrum; the SNR is maximized precisely when the filter is aligned with (proportional to the conjugate of) the signal. So the optimal filter is the one shaped like the signal itself — which is exactly what "matched" means. The steps below turn that geometric intuition into the bound $2E/N_0$.</p>
<p>Work in the frequency domain. Let $S(f)$ and $H(f)$ be the transforms of $s$ and $h$. The signal sample is $s_o(T)=\int H(f)S(f)e^{j2\pi fT}\,df$ and the output noise power is $E[n_o^2]=\tfrac{N_0}{2}\int|H(f)|^2\,df$. Thus</p>
<p>$$\mathrm{SNR}=\frac{\left|\int H(f)S(f)e^{j2\pi fT}\,df\right|^2}{\tfrac{N_0}{2}\int|H(f)|^2\,df}.$$</p>
<p>Apply the Cauchy-Schwarz inequality to the numerator: $\left|\int H\cdot (Se^{j2\pi fT})\,df\right|^2 \le \int|H|^2\,df\cdot\int|S|^2\,df$. Substituting,</p>
<p>$$\mathrm{SNR}\le\frac{\int|H|^2\,df\cdot\int|S|^2\,df}{\tfrac{N_0}{2}\int|H|^2\,df}=\frac{\int|S(f)|^2\,df}{N_0/2}=\frac{2E}{N_0}.$$</p>
<p>Equality — the maximum — holds iff $H(f)=k\,S^*(f)e^{-j2\pi fT}$ for a constant $k$. Inverse-transforming gives the time-domain matched filter.</p>
<div class="callout"><strong>The punchline:</strong> $\mathrm{SNR}_{\max}=2E/N_0$ depends ONLY on pulse energy $E$ and noise density $N_0$ — not on pulse shape, bandwidth, or duration.</div>`
      },
      {
        h: 'The Matched-Filter Impulse Response',
        html: String.raw`<p>Inverse-transforming $H(f)=S^*(f)e^{-j2\pi fT}$ (set $k=1$) uses the property that conjugation in frequency is time-reversal, and the exponential is a delay:</p>
<p>$$\boxed{h(t)=s(T-t)}\quad\text{for }0\le t\le T,\ \ 0\text{ otherwise}.$$</p>
<p>The impulse response is the pulse flipped in time and shifted so it is causal (nonzero on $[0,T]$). At the sampling instant $t=T$ the convolution becomes the autocorrelation of $s$ at lag zero:</p>
<p>$$s_o(T)=\int_0^T s(\tau)h(T-\tau)\,d\tau=\int_0^T s^2(\tau)\,d\tau=E.$$</p>
<p>So the matched filter output at $t=T$ equals the pulse energy $E$ — the peak of the autocorrelation function. Sampling anywhere else gives a smaller value, which is why symbol timing must align the sample to $t=T$.</p>`
      },
      {
        h: 'Correlator Equivalence',
        html: String.raw`<p>Convolving $y(t)$ with $h(t)=s(T-t)$ and sampling at $T$ is algebraically identical to correlating $y$ with $s$ over the symbol:</p>
<p>$$y_o(T)=\int_0^T y(\tau)\,s(\tau)\,d\tau.$$</p>
<p>This <em>correlator</em> realization multiplies the received signal by a stored replica of the pulse and integrates over the symbol ("integrate-and-dump"). Both implementations produce the same sufficient statistic. Practical trade-offs:</p>
<ul>
<li><strong>Correlator:</strong> multiply-and-integrate; needs a reset each symbol; natural in DSP/software radios and for spread-spectrum despreading.</li>
<li><strong>Matched filter:</strong> a fixed FIR/analog filter whose output is continuously sampled; convenient in hardware and when multiple hypotheses/timing offsets are tested.</li>
</ul>
<div class="callout"><strong>Sufficient statistic:</strong> the single scalar $y_o(T)$ preserves all information about which symbol was sent — no optimal receiver can do better than deciding on it.</div>`
      },
      {
        h: 'Why It Minimizes Error Probability',
        html: String.raw`<p>Maximizing SNR at the decision instant is equivalent to maximizing the ratio of signal separation to noise spread. For antipodal signaling (BPSK), the matched filter output is $\pm E$ (after scaling, $\pm\sqrt{E}$ in normalized coordinates) with noise variance $N_0/2$, so the decision distance in standard deviations is maximized. This directly yields the optimal BER $Q(\sqrt{2E_b/N_0})$. Because Gaussian error probability is monotonically decreasing in SNR, the SNR-maximizing filter is also the BER-minimizing filter for AWGN.</p>
<p>The matched filter also <em>colors</em> its own output noise to be correlated with the signal in exactly the way that maximizes the peak — it is not a whitening filter. When noise is colored, the optimal receiver first whitens then matches (the "whitened matched filter"); for white noise the two steps collapse into the plain matched filter.</p>`
      },
      {
        h: 'Matched Filter, Pulse Shaping, and RRC',
        html: String.raw`<p>Real systems must also control bandwidth and inter-symbol interference (ISI). The Nyquist criterion says the <em>combined</em> transmit-plus-receive response should be a Nyquist pulse (e.g., raised cosine) with zero ISI at symbol-spaced samples. To be simultaneously matched-filtered AND ISI-free, the transmit and receive filters each take the <strong>square root</strong> of the raised-cosine response:</p>
<p>$$H_{tx}(f)=H_{rx}(f)=\sqrt{H_{RC}(f)}\quad(\text{root-raised-cosine, RRC}).$$</p>
<p>The cascade $H_{tx}H_{rx}=H_{RC}$ is the full raised cosine (zero ISI), while the receive RRC is matched to the transmit RRC (max SNR). This is why RRC filtering appears at both ends of almost every modern modem. Roll-off $\alpha$ trades excess bandwidth $R_s(1+\alpha)$ against time-domain sidelobe suppression and timing sensitivity.</p>
<table class="data">
<tr><th>Filter</th><th>Role</th></tr>
<tr><td>Full raised cosine</td><td>Nyquist (zero ISI) — split between tx and rx</td></tr>
<tr><td>RRC at transmitter</td><td>Shapes/limits spectrum</td></tr>
<tr><td>RRC at receiver</td><td>Matched filter — maximizes SNR</td></tr>
</table>`
      },
      {
        h: 'Practical Impairments and Extensions',
        html: String.raw`<p>Matched filtering assumes perfect knowledge of the pulse and of the sampling instant. Real impairments include:</p>
<ul>
<li><strong>Timing error:</strong> sampling off the autocorrelation peak reduces the effective signal amplitude and introduces ISI; loss $\propto$ the autocorrelation curvature near the peak.</li>
<li><strong>Frequency/phase offset:</strong> rotates the complex correlator output; must be corrected before or during matched filtering in coherent systems.</li>
<li><strong>Colored noise / interference:</strong> requires a whitened matched filter or an MMSE receiver rather than the plain matched filter.</li>
<li><strong>Multipath:</strong> the channel convolves the pulse; the RAKE receiver in spread spectrum is a bank of matched filters (fingers) aligned to each multipath delay, coherently combining energy.</li>
</ul>
<p>In spread spectrum, correlating against the PN code is exactly matched filtering to the spreading waveform, producing processing gain $=10\log_{10}(N)$ dB for a length-$N$ code — the despread SNR gain is a direct consequence of the $2E/N_0$ result applied to the long chip sequence.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>This topic gives you the receiver backbone that every other modulation topic assumes. You should now be able to say:</p>
<ul>
<li><strong>The filter:</strong> $h(t)=s(T-t)$ is the pulse flipped and delayed; sampling its output at $t=T$ reads off the autocorrelation peak, equal to the energy $E$.</li>
<li><strong>The guarantee:</strong> it maximizes sampled SNR to $2E/N_0$ (Cauchy-Schwarz), depending only on energy and $N_0$ — <em>not</em> pulse shape — and its output is a sufficient statistic.</li>
<li><strong>The two faces:</strong> matched filter and correlator ($\int_0^T y\,s\,dt$) are the same operation; pick whichever suits the hardware.</li>
<li><strong>The link to shaping:</strong> splitting a raised cosine into RRC at both ends achieves matched reception <em>and</em> zero ISI simultaneously — the reason RRC appears in nearly every modem.</li>
<li><strong>The extensions:</strong> whiten-then-match for colored noise, a RAKE (bank of matched filters) for multipath, and PN-code correlation for spread-spectrum processing gain $10\log_{10}N$.</li>
<li><strong>Why it minimizes BER:</strong> maximizing decision-instant SNR directly minimizes the Gaussian error probability.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`The matched filter impulse response is $h(t)=s(T-t)$ — the time-reversed, delayed pulse.`,
      String.raw`It maximizes sampled SNR to $\mathrm{SNR}_{\max}=2E/N_0$, depending ONLY on energy $E$ and $N_0$, not pulse shape.`,
      String.raw`Optimality is proved by the Cauchy-Schwarz inequality; equality requires $H(f)=k\,S^*(f)e^{-j2\pi fT}$.`,
      String.raw`The matched filter and the correlator $\int_0^T y(t)s(t)\,dt$ are exactly equivalent.`,
      String.raw`Its output at $t=T$ equals the pulse autocorrelation peak = energy $E$.`,
      String.raw`The output is a sufficient statistic; no receiver can outperform a decision made on it (AWGN).`,
      String.raw`Maximizing SNR minimizes BER in AWGN, giving BPSK's $Q(\sqrt{2E_b/N_0})$.`,
      String.raw`For ISI-free + matched operation, split raised cosine into RRC at both transmitter and receiver.`,
      String.raw`For colored noise, whiten first then match (whitened matched filter).`,
      String.raw`Timing error costs SNR by moving the sample off the autocorrelation peak; a RAKE receiver is a bank of matched filters for multipath.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="220" fill="#1c232e"/>
<text x="20" y="24" fill="#e6edf3" font-size="13">Correlator (matched-filter) receiver</text>
<line x1="20" y1="80" x2="90" y2="80" stroke="#9aa7b5" stroke-width="1.5"/>
<text x="20" y="72" fill="#9aa7b5" font-size="11">$y(t)$</text>
<circle cx="110" cy="80" r="18" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/>
<text x="103" y="85" fill="#e6edf3" font-size="15">$\times$</text>
<line x1="110" y1="130" x2="110" y2="98" stroke="#9aa7b5" stroke-width="1.5"/>
<rect x="65" y="130" width="90" height="30" fill="#1c232e" stroke="#63e6be" stroke-width="1.5"/>
<text x="80" y="150" fill="#e6edf3" font-size="11">replica $s(t)$</text>
<line x1="128" y1="80" x2="200" y2="80" stroke="#9aa7b5" stroke-width="1.5"/>
<rect x="200" y="60" width="90" height="40" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/>
<text x="212" y="78" fill="#e6edf3" font-size="12">$\int_0^T dt$</text>
<text x="222" y="93" fill="#9aa7b5" font-size="10">dump</text>
<line x1="290" y1="80" x2="360" y2="80" stroke="#9aa7b5" stroke-width="1.5"/>
<circle cx="380" cy="80" r="4" fill="#b197fc"/>
<text x="345" y="66" fill="#9aa7b5" font-size="10">sample $t=T$</text>
<line x1="384" y1="80" x2="450" y2="80" stroke="#9aa7b5" stroke-width="1.5"/>
<rect x="450" y="60" width="70" height="40" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.5"/>
<text x="462" y="84" fill="#e6edf3" font-size="11">decide</text>
</svg>`,
        caption: 'Correlator form: multiply the received signal by a stored replica, integrate over the symbol, sample at t=T, then decide. Equivalent to filtering by h(t)=s(T-t).'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="200" fill="#1c232e"/>
<text x="20" y="22" fill="#e6edf3" font-size="12">Pulse s(t), matched h(t)=s(T-t), and output autocorrelation</text>
<line x1="30" y1="90" x2="170" y2="90" stroke="#9aa7b5" stroke-width="1"/>
<rect x="60" y="55" width="50" height="35" fill="#4dabf7" opacity="0.5"/>
<text x="70" y="110" fill="#4dabf7" font-size="10">$s(t)$</text>
<line x1="200" y1="90" x2="340" y2="90" stroke="#9aa7b5" stroke-width="1"/>
<rect x="255" y="55" width="50" height="35" fill="#ffa94d" opacity="0.5"/>
<text x="240" y="110" fill="#ffa94d" font-size="10">$h(t)=s(T-t)$</text>
<line x1="370" y1="130" x2="520" y2="130" stroke="#9aa7b5" stroke-width="1"/>
<path d="M375,130 L445,60 L515,130" fill="none" stroke="#63e6be" stroke-width="2"/>
<circle cx="445" cy="60" r="4" fill="#ff6b6b"/>
<text x="450" y="55" fill="#ff6b6b" font-size="10">peak = E at $t=T$</text>
<text x="400" y="150" fill="#63e6be" font-size="10">output = autocorrelation</text>
</svg>`,
        caption: 'The matched filter output is the pulse autocorrelation; its peak (value E) occurs exactly at the sampling instant t=T.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr2-matched-filter" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="210" fill="#1c232e"/>
<text x="20" y="22" fill="#e6edf3" font-size="13">Two equivalent implementations</text>
<text x="20" y="52" fill="#4dabf7" font-size="11">(a) Correlator</text>
<line x1="20" y1="80" x2="55" y2="80" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-matched-filter)"/>
<circle cx="72" cy="80" r="15" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/>
<text x="66" y="85" fill="#e6edf3" font-size="13">$\times$</text>
<rect x="45" y="105" width="60" height="26" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/>
<text x="54" y="122" fill="#e6edf3" font-size="9">$s(t)$</text>
<line x1="72" y1="105" x2="72" y2="95" stroke="#9aa7b5" stroke-width="1.3" marker-end="url(#arr2-matched-filter)"/>
<line x1="88" y1="80" x2="130" y2="80" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-matched-filter)"/>
<rect x="130" y="62" width="70" height="36" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/>
<text x="140" y="84" fill="#e6edf3" font-size="11">$\int_0^T dt$</text>
<line x1="200" y1="80" x2="240" y2="80" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-matched-filter)"/>
<text x="245" y="84" fill="#b197fc" font-size="10">sample @T</text>
<text x="20" y="152" fill="#4dabf7" font-size="11">(b) Matched filter</text>
<line x1="20" y1="178" x2="70" y2="178" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-matched-filter)"/>
<rect x="70" y="160" width="120" height="36" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.5"/>
<text x="82" y="182" fill="#e6edf3" font-size="10">$h(t)=s(T-t)$</text>
<line x1="190" y1="178" x2="240" y2="178" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-matched-filter)"/>
<text x="245" y="182" fill="#b197fc" font-size="10">sample @T</text>
<line x1="330" y1="40" x2="330" y2="200" stroke="#9aa7b5" stroke-width="1" stroke-dasharray="4 3"/>
<text x="355" y="110" fill="#63e6be" font-size="12">Identical</text>
<text x="355" y="128" fill="#63e6be" font-size="12">output at</text>
<text x="355" y="146" fill="#63e6be" font-size="12">$t=T$:</text>
<text x="355" y="168" fill="#e6edf3" font-size="12">$\int_0^T y\,s\,dt$</text>
<text x="360" y="188" fill="#9aa7b5" font-size="10">(sufficient stat.)</text>
</svg>`,
        caption: 'Correlator (multiply-by-replica then integrate) and matched filter (LTI filter h(t)=s(T-t)) produce the identical sampled statistic at t=T. They are two realisations of the same optimal receiver.'
      }
    ],
    equations: [
      {
        title: 'Output SNR',
        tex: String.raw`$$\mathrm{SNR}=\frac{|s_o(T)|^2}{E[n_o^2(T)]}$$`,
        derivation: String.raw`<p>Signal sample $s_o(T)=(h*s)(T)$; output noise power for white input is $E[n_o^2]=\tfrac{N_0}{2}\int|H(f)|^2df=\tfrac{N_0}{2}\int h^2(t)dt$. Their ratio is the quantity to maximize.</p>`
      },
      {
        title: 'Cauchy-Schwarz Bound',
        tex: String.raw`$$\mathrm{SNR}\le\frac{2E}{N_0}$$`,
        derivation: String.raw`<p>By Cauchy-Schwarz, $|\int H S^{*'}df|^2\le \int|H|^2df\int|S|^2df$. Dividing by $\tfrac{N_0}{2}\int|H|^2df$ cancels the $\int|H|^2$ factor, leaving $\int|S|^2df/(N_0/2)=2E/N_0$. Equality when $H\propto S^*e^{-j2\pi fT}$.</p>`
      },
      {
        title: 'Matched-Filter Impulse Response',
        tex: String.raw`$$h(t)=s(T-t)$$`,
        derivation: String.raw`<p>Inverse-transform $H(f)=S^*(f)e^{-j2\pi fT}$. Conjugation $S^*(f)\leftrightarrow s(-t)$ (time reversal); the linear-phase factor $e^{-j2\pi fT}$ delays by $T$: combined, $s(-(t-T))=s(T-t)$, nonzero on $[0,T]$ for causality.</p>`
      },
      {
        title: 'Peak Output = Energy',
        tex: String.raw`$$s_o(T)=\int_0^T s^2(\tau)\,d\tau=E$$`,
        derivation: String.raw`<p>$s_o(T)=\int s(\tau)h(T-\tau)d\tau=\int s(\tau)s(T-(T-\tau))d\tau=\int s(\tau)s(\tau)d\tau=E$. The filter output at $t=T$ is the zero-lag autocorrelation, the peak.</p>`
      },
      {
        title: 'Correlator Equivalence',
        tex: String.raw`$$y_o(T)=\int_0^T y(\tau)s(\tau)\,d\tau$$`,
        derivation: String.raw`<p>Convolution at $T$: $y_o(T)=\int y(\tau)h(T-\tau)d\tau=\int y(\tau)s(T-(T-\tau))d\tau=\int y(\tau)s(\tau)d\tau$, which is correlation of $y$ with the replica $s$.</p>`
      },
      {
        title: 'RRC Split for Zero-ISI + Matched',
        tex: String.raw`$$H_{tx}(f)=H_{rx}(f)=\sqrt{H_{RC}(f)}$$`,
        derivation: String.raw`<p>Zero ISI needs cascade $=H_{RC}$ (Nyquist). Matched needs $H_{rx}=H_{tx}^*$. Both hold if each is $\sqrt{H_{RC}}$ (real, even), because $\sqrt{H_{RC}}\cdot\sqrt{H_{RC}}=H_{RC}$ and $H_{rx}=H_{tx}$ is its own match.</p>`
      },
      {
        title: 'Spread-Spectrum Processing Gain',
        tex: String.raw`$$G_p=10\log_{10} N\ \text{dB}$$`,
        derivation: String.raw`<p>Correlating (matched filtering) against a length-$N$ PN code coherently sums $N$ chips of signal while noise adds incoherently, giving an SNR gain of $N$ in power, i.e. $10\log_{10}N$ dB — a direct application of the $2E/N_0$ result to the full code energy.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the matched-filter impulse response?`, back: String.raw`$h(t)=s(T-t)$ — the time-reversed, delayed pulse.` },
      { front: String.raw`What SNR does the matched filter achieve?`, back: String.raw`$\mathrm{SNR}_{\max}=2E/N_0$, depending only on pulse energy and $N_0$.` },
      { front: String.raw`What inequality proves matched-filter optimality?`, back: String.raw`The Cauchy-Schwarz inequality.` },
      { front: String.raw`When does the Cauchy-Schwarz bound hold with equality?`, back: String.raw`When $H(f)=k\,S^*(f)e^{-j2\pi fT}$, i.e. $h(t)=k\,s(T-t)$.` },
      { front: String.raw`What is the correlator form of the matched filter?`, back: String.raw`$y_o(T)=\int_0^T y(t)s(t)\,dt$ (multiply by replica, integrate, sample).` },
      { front: String.raw`What is the matched-filter output at $t=T$?`, back: String.raw`The autocorrelation peak, equal to the pulse energy $E$.` },
      { front: String.raw`Does SNR-max depend on pulse shape?`, back: String.raw`No — only on energy $E$ and noise density $N_0$.` },
      { front: String.raw`Why does the matched filter minimize BER in AWGN?`, back: String.raw`Max SNR at the decision point and monotonic Gaussian error probability.` },
      { front: String.raw`What is a sufficient statistic here?`, back: String.raw`The single sampled output $y_o(T)$ retains all decision-relevant information.` },
      { front: String.raw`Why use RRC at both ends?`, back: String.raw`$\sqrt{H_{RC}}$ at tx and rx gives zero ISI (cascade = raised cosine) AND matched reception.` },
      { front: String.raw`What receiver handles colored noise?`, back: String.raw`The whitened matched filter (whiten, then match).` },
      { front: String.raw`How does timing error hurt the matched filter?`, back: String.raw`Sampling off the autocorrelation peak lowers signal amplitude and adds ISI.` },
      { front: String.raw`What is a RAKE receiver?`, back: String.raw`A bank of matched filters aligned to each multipath delay, combined coherently.` },
      { front: String.raw`Spread-spectrum processing gain for length-$N$ code?`, back: String.raw`$10\log_{10}N$ dB — matched filtering to the PN code.` }
    ],
    mcqs: [
      { q: String.raw`The matched-filter impulse response for pulse $s(t)$ on $[0,T]$ is:`, options: [String.raw`$s(t)$`, String.raw`$s(T-t)$`, String.raw`$s(t)/T$`, String.raw`$s'(t)$`], answer: 1, explain: String.raw`Time-reversed and delayed by $T$ for causality.` },
      { q: String.raw`The maximum sampled SNR of a matched filter is:`, options: [String.raw`$E/N_0$`, String.raw`$2E/N_0$`, String.raw`$E/(2N_0)$`, String.raw`$N_0/2E$`], answer: 1, explain: String.raw`Cauchy-Schwarz bound: $2E/N_0$.` },
      { q: String.raw`The matched filter's max SNR depends on:`, options: [String.raw`Pulse shape only`, String.raw`Pulse energy and $N_0$ only`, String.raw`Bandwidth only`, String.raw`Pulse duration only`], answer: 1, explain: String.raw`$2E/N_0$ is shape-independent.` },
      { q: String.raw`The optimality of the matched filter is proved using:`, options: [String.raw`Parseval only`, String.raw`Cauchy-Schwarz inequality`, String.raw`Central limit theorem`, String.raw`Nyquist criterion`], answer: 1, explain: String.raw`Cauchy-Schwarz bounds the numerator.` },
      { q: String.raw`The matched-filter output at $t=T$ equals:`, options: [String.raw`Zero`, String.raw`Pulse energy $E$`, String.raw`$N_0/2$`, String.raw`$\sqrt{E}$ always`], answer: 1, explain: String.raw`Zero-lag autocorrelation = energy.` },
      { q: String.raw`The correlator computes:`, options: [String.raw`$\int_0^T y(t)\,dt$`, String.raw`$\int_0^T y(t)s(t)\,dt$`, String.raw`$\max_t y(t)$`, String.raw`$dy/dt$`], answer: 1, explain: String.raw`Multiply by replica and integrate = matched filtering.` },
      { q: String.raw`For zero ISI AND matched reception, each of tx/rx uses:`, options: [String.raw`Full raised cosine`, String.raw`Root-raised cosine $\sqrt{H_{RC}}$`, String.raw`Rectangular`, String.raw`Gaussian`], answer: 1, explain: String.raw`Cascade of two RRCs = raised cosine (Nyquist); each RRC matches the other.` },
      { q: String.raw`Under colored noise the optimal receiver is:`, options: [String.raw`Plain matched filter`, String.raw`Whitened matched filter`, String.raw`Integrator`, String.raw`Differentiator`], answer: 1, explain: String.raw`Whiten first, then match.` },
      { q: String.raw`The sampled matched-filter output is a:`, options: [String.raw`Biased estimate`, String.raw`Sufficient statistic`, String.raw`Random guess`, String.raw`Noise-only sample`], answer: 1, explain: String.raw`It retains all information needed for the optimal decision.` },
      { q: String.raw`A RAKE receiver is best described as:`, options: [String.raw`A single matched filter`, String.raw`A bank of matched filters aligned to multipath delays`, String.raw`An equalizer only`, String.raw`A frequency synthesizer`], answer: 1, explain: String.raw`Each finger matches one path; outputs combined coherently.` },
      { q: String.raw`Processing gain of a length-1023 PN code (matched filter) is about:`, options: [String.raw`10 dB`, String.raw`20 dB`, String.raw`30 dB`, String.raw`60 dB`], answer: 2, explain: String.raw`$10\log_{10}1023\approx 30.1$ dB.` },
      { q: String.raw`Sampling the matched filter off the peak (timing error) causes:`, options: [String.raw`Higher SNR`, String.raw`Lower signal amplitude and ISI`, String.raw`No effect`, String.raw`Whitened noise`], answer: 1, explain: String.raw`The autocorrelation is below its peak away from $t=T$.` }
    ],
    numericals: [
      {
        q: String.raw`A rectangular pulse has amplitude $A=2$ V over $T=1$ ms. Find its energy $E$ and the matched-filter max SNR if $N_0/2=10^{-3}$ V$^2$/Hz.`,
        solution: String.raw`<p><b>Formula.</b> $$E = A^2 T,\qquad \mathrm{SNR}_{\max} = \frac{2E}{N_0}$$ with $E$ the pulse energy, $A$ its amplitude, $T$ its duration, and $N_0$ the one-sided noise density.</p>
<p><b>Substitute.</b> $E = (2)^2(1\times10^{-3})$; $N_0 = 2\times(N_0/2)=2\times10^{-3}$. $\mathrm{SNR}_{\max}=\dfrac{2(4\times10^{-3})}{2\times10^{-3}}$.</p>
<p><b>Compute.</b> $E = 4\times10^{-3}$ J (V$^2\cdot$s); $\mathrm{SNR}_{\max}=\mathbf{4}$, i.e. $10\log_{10}4 = 6.0$ dB.</p>
<p><b>Explanation.</b> The matched filter extracts the full $2E/N_0$; a 6 dB output SNR is what sets the achievable BER, and it depends only on the energy $A^2T$ — trading amplitude for duration at constant energy leaves it unchanged.</p>`
      },
      {
        q: String.raw`Two pulses have the same energy but different shapes (one rectangular, one triangular). Compare their matched-filter output SNR.`,
        solution: String.raw`<p><b>Formula.</b> $$\mathrm{SNR}_{\max} = \frac{2E}{N_0}$$ — a function of pulse energy $E$ and noise density $N_0$ only, with no dependence on pulse shape.</p>
<p><b>Substitute.</b> Both pulses have identical $E$ and see the same $N_0$, so each yields $2E/N_0$.</p>
<p><b>Compute.</b> The two output SNRs are <strong>equal</strong>.</p>
<p><b>Explanation.</b> This is the key result of matched-filter theory: shape governs bandwidth and ISI behaviour but not peak detection SNR. An engineer picks the shape for spectral/timing reasons, confident the noise immunity at the sampler is fixed by energy alone.</p>`
      },
      {
        q: String.raw`An RRC filter has roll-off $\alpha=0.25$ and symbol rate $R_s=5$ MSym/s. Find the occupied bandwidth.`,
        solution: String.raw`<p><b>Formula.</b> $$B = R_s(1+\alpha)$$ the occupied (passband) bandwidth of an RRC-shaped signal, with $R_s$ the symbol rate and $\alpha$ the roll-off.</p>
<p><b>Substitute.</b> $B = (5\ \text{MSym/s})(1+0.25)$.</p>
<p><b>Compute.</b> $B = 5\times1.25 = \mathbf{6.25\ MHz}$.</p>
<p><b>Explanation.</b> The receiver's matched RRC has the same passband, so it adds no bandwidth; the 25% excess over the $R_s=5$ MHz Nyquist minimum is the price paid for realizable filters and timing robustness.</p>`
      },
      {
        q: String.raw`A DSSS system uses a length $N=127$ code. What processing gain (dB) does the correlator (matched filter) provide?`,
        solution: String.raw`<p><b>Formula.</b> $$G_p = 10\log_{10} N$$ the spread-spectrum processing gain for a length-$N$ PN code, obtained by matched-filtering (despreading) against the code.</p>
<p><b>Substitute.</b> $G_p = 10\log_{10}(127)$.</p>
<p><b>Compute.</b> $G_p = \mathbf{21.0\ dB}$.</p>
<p><b>Explanation.</b> Correlating over 127 chips sums the signal coherently while noise adds incoherently, lifting the despread SNR by 21 dB — the mechanism that lets DSSS signals be recovered from beneath the noise floor.</p>`
      },
      {
        q: String.raw`A pulse of energy $E=5\times10^{-9}$ J is received in noise with $N_0=10^{-9}$ W/Hz. Find the matched-filter output SNR in dB.`,
        solution: String.raw`<p><b>Formula.</b> $$\mathrm{SNR}_{\max} = \frac{2E}{N_0}$$ with $E$ the received pulse energy and $N_0$ the one-sided noise density.</p>
<p><b>Substitute.</b> $\mathrm{SNR}_{\max} = \dfrac{2(5\times10^{-9})}{10^{-9}}$.</p>
<p><b>Compute.</b> $\mathrm{SNR}_{\max} = 10$; in dB, $10\log_{10}10 = \mathbf{10\ dB}$.</p>
<p><b>Explanation.</b> A 10 dB sampled SNR comfortably supports low-BER BPSK detection; because the result is $2E/N_0$, raising the energy per symbol (e.g. by longer integration) is the direct lever on detection reliability.</p>`
      },
      {
        q: String.raw`If timing is off such that the sample sits where the triangular autocorrelation has fallen to 80% of its peak, estimate the SNR loss in dB.`,
        solution: String.raw`<p><b>Formula.</b> A timing offset scales the signal amplitude by the normalized autocorrelation $\rho$, so power scales by $\rho^2$ and the loss is $$L_{\text{dB}} = 10\log_{10}(\rho^2)=20\log_{10}\rho.$$</p>
<p><b>Substitute.</b> $\rho = 0.8$, so $L_{\text{dB}} = 20\log_{10}(0.8)=10\log_{10}(0.64)$.</p>
<p><b>Compute.</b> $L_{\text{dB}} = \mathbf{-1.94\ dB}$ (plus additional ISI not counted here).</p>
<p><b>Explanation.</b> Sampling only slightly off the autocorrelation peak already costs ~2 dB, showing why symbol-timing recovery is as critical as carrier recovery — the matched-filter advantage is realized only at the exact peak instant.</p>`
      }
    ],
    realWorld: String.raw`<p>Every practical digital receiver — from a Wi-Fi chipset to a GPS front end to a 5G modem — contains matched filtering, usually as a root-raised-cosine receive filter that is the mirror of the transmitter's RRC. This single structure simultaneously limits bandwidth, enforces zero ISI at the sampler, and maximizes SNR, which is why it is nearly universal.</p>
<p>In GPS and CDMA, the correlator that despreads the PN code is a matched filter to the spreading waveform; its coherent gain over the long code is exactly the $2E/N_0$ result applied to thousands of chips, producing the tens of dB of processing gain that let GPS signals be recovered from below the thermal noise floor. In multipath channels, the RAKE receiver deploys several matched-filter fingers to capture and combine energy arriving at different delays, turning a fading impairment into a diversity advantage.</p>`,
    related: ['bpsk', 'comm-basics', 'noise', 'dsss', 'pn-codes']
  },
  {
    id: 'evm',
    title: 'Error Vector Magnitude (EVM)',
    category: 'Modulation & Detection',
    tags: ['evm', 'modulation-quality', 'iq', 'snr', 'impairments', 'transmitter-test'],
    summary: String.raw`EVM measures the RMS distance between received and ideal constellation symbols normalized to reference power, quantifying total modulation impairment and mapping directly to SNR via $\mathrm{SNR}_{dB}\approx -20\log_{10}(\mathrm{EVM})$.`,
    prerequisites: ['bpsk', 'noise', 'comm-basics'],
    intro: String.raw`<p><strong>Why does EVM exist?</strong> A modern transmitter can fail in a dozen subtle ways at once — a little phase noise here, some amplifier compression there, a touch of I/Q imbalance — and BER alone won't tell you a signal is degrading until it is nearly broken, and even then it takes billions of bits to measure. Engineers needed a single, fast, sensitive number that answers "how clean is this modulation, really?" and points toward <em>what</em> is wrong. EVM is that number: it looks at where each symbol actually landed versus where it should have, and the size <em>and direction</em> of that miss both diagnoses the impairment and predicts the BER — long before the link fails.</p>
<p>Error Vector Magnitude (EVM) is the standard figure of merit for the quality of a digitally modulated signal. It captures, in a single number, how far the received (or transmitted) constellation symbols deviate from their ideal locations. Because that deviation aggregates every impairment — thermal noise, phase noise, I/Q imbalance, carrier leakage, power-amplifier nonlinearity, quantization — EVM is the go-to metric for transmitter conformance tests, receiver characterization, and end-to-end link diagnosis.</p>
<p>EVM is powerful because it is both intuitive (a picture of a fuzzy constellation) and rigorously tied to performance: under the assumption that the residual error is Gaussian and noise-like, EVM maps directly to an effective SNR, which in turn bounds the achievable BER for a given modulation order. Higher-order constellations (64-QAM, 256-QAM) pack points closer together and therefore demand much smaller EVM than robust schemes like BPSK.</p>`,
    sections: [
      {
        h: 'Definition and the Error Vector',
        html: String.raw`<p>For each received symbol, plot its measured I/Q coordinate and the ideal reference coordinate. The <strong>error vector</strong> is the complex difference between them: $\mathbf{e}_k=\mathbf{r}_k-\mathbf{s}_k$, where $\mathbf{r}_k$ is the measured symbol and $\mathbf{s}_k$ the ideal. EVM is the RMS magnitude of these error vectors over $N$ symbols, normalized to a reference power:</p>
<p>$$\mathrm{EVM}_{\text{rms}}=\sqrt{\frac{\frac{1}{N}\sum_{k=1}^{N}|\mathbf{r}_k-\mathbf{s}_k|^2}{\frac{1}{N}\sum_{k=1}^{N}|\mathbf{s}_k|^2}}.$$</p>
<p>The numerator is the average error power; the denominator is a reference power — most commonly the average symbol power, though some standards normalize to the <em>peak</em> constellation power (which yields a smaller percentage for the same signal, so always state the reference). EVM is reported as a percentage (multiply by 100) or in dB: $\mathrm{EVM}_{dB}=20\log_{10}(\mathrm{EVM}_{\text{rms}})$.</p>
<div class="callout"><strong>Watch the reference:</strong> average-power vs peak-power normalization changes the number. For QPSK the two agree; for QAM the peak-normalized EVM is smaller. Always specify.</div>`
      },
      {
        h: 'I/Q Geometry: Magnitude and Phase Error',
        html: String.raw`<p>The error vector decomposes into components aligned with and perpendicular to the ideal symbol. Along the reference vector it appears as a <strong>magnitude error</strong>; perpendicular to it, as a <strong>phase error</strong>. For a symbol of reference magnitude $|\mathbf{s}_k|$ and small phase error $\phi_k$, the perpendicular error is $\approx|\mathbf{s}_k|\sin\phi_k$. Averaging gives useful diagnostic sub-metrics:</p>
<ul>
<li><strong>Magnitude error (%):</strong> radial component — dominated by amplitude/gain errors, compression, AGC drift.</li>
<li><strong>Phase error (deg):</strong> tangential component — dominated by phase noise, residual carrier frequency/phase error, and I/Q quadrature (orthogonality) error.</li>
</ul>
<p>These directional components tell you <em>which</em> impairment dominates. A cloud stretched radially points to amplitude problems; a cloud smeared tangentially (rotational blur) points to phase noise or sync error. A constellation rotated as a whole indicates a static phase offset; one that grows worse toward the outer points indicates PA compression.</p>`
      },
      {
        h: 'EVM ↔ SNR Relationship',
        html: String.raw`<p>When the error vector behaves like additive noise (uncorrelated with the signal, zero-mean, Gaussian), the error power is exactly the noise power and the reference power is the signal power. Then EVM squared is the inverse SNR:</p>
<p>$$\mathrm{EVM}_{\text{rms}}^2=\frac{P_{\text{error}}}{P_{\text{ref}}}=\frac{1}{\mathrm{SNR}}\ \Longrightarrow\ \mathrm{SNR}=\frac{1}{\mathrm{EVM}_{\text{rms}}^2}.$$</p>
<p>In decibels this becomes the famous rule of thumb:</p>
<p>$$\boxed{\mathrm{SNR}_{dB}\approx -20\log_{10}(\mathrm{EVM}_{\text{rms}})=-\mathrm{EVM}_{dB}.}$$</p>
<p>So 10% EVM ($-20$ dB) corresponds to ~20 dB SNR; 1% EVM ($-40$ dB) to ~40 dB SNR. Two caveats: (1) this assumes average-power normalization and that the residual is truly noise-like; correlated/deterministic errors (like static I/Q imbalance or spurs) violate the mapping. (2) EVM also folds in the receiver-measurement noise, so measured EVM is a floor on the transmitter's true quality.</p>
<table class="data">
<tr><th>EVM (%)</th><th>EVM (dB)</th><th>≈ SNR (dB)</th></tr>
<tr><td>31.6</td><td>-10</td><td>10</td></tr>
<tr><td>10</td><td>-20</td><td>20</td></tr>
<tr><td>3.16</td><td>-30</td><td>30</td></tr>
<tr><td>1</td><td>-40</td><td>40</td></tr>
<tr><td>0.5</td><td>-46</td><td>46</td></tr>
</table>`
      },
      {
        h: 'EVM, Constellation Order, and BER',
        html: String.raw`<p>Denser constellations demand lower EVM because their minimum distance shrinks. For an $M$-QAM/PSK, the effective SNR from EVM feeds the usual BER formulas. A practical link between EVM and error rate for square $M$-QAM is</p>
<p>$$\mathrm{SNR}\approx\frac{1}{\mathrm{EVM}_{\text{rms}}^2},\qquad P_b\approx\frac{4}{\log_2 M}\Big(1-\tfrac{1}{\sqrt M}\Big)Q\!\left(\sqrt{\frac{3\log_2 M}{M-1}\,\mathrm{SNR}}\right).$$</p>
<p>The consequence is a hierarchy of EVM requirements set by standards:</p>
<table class="data">
<tr><th>Modulation</th><th>Approx EVM limit</th><th>Rationale</th></tr>
<tr><td>BPSK/QPSK</td><td>~17.5% ($-15$ dB)</td><td>Widely spaced points; tolerant</td></tr>
<tr><td>16-QAM</td><td>~12.5% ($-18$ dB)</td><td>Closer spacing</td></tr>
<tr><td>64-QAM</td><td>~8% ($-22$ dB)</td><td>Dense grid</td></tr>
<tr><td>256-QAM</td><td>~3.5% ($-29$ dB)</td><td>Very dense; demanding</td></tr>
<tr><td>1024-QAM (Wi-Fi 6/5G)</td><td>~1.8% ($-35$ dB)</td><td>Extremely demanding</td></tr>
</table>
<p>(Exact limits vary by standard — LTE, 5G NR, 802.11 each specify their own.) The pattern is clear: every step up in constellation order roughly halves the tolerable EVM.</p>`
      },
      {
        h: 'Impairment Mapping: What Distorts the Constellation',
        html: String.raw`<p>EVM's diagnostic value comes from the distinctive signature each impairment leaves on the constellation:</p>
<ul>
<li><strong>I/Q gain imbalance:</strong> unequal I and Q amplitudes stretch the constellation into an ellipse (wider in one axis).</li>
<li><strong>I/Q quadrature (phase) imbalance:</strong> the I and Q axes are not exactly $90^\circ$; the constellation shears into a rhombus.</li>
<li><strong>Carrier/LO leakage (DC offset):</strong> the whole constellation shifts off-center; adds an image at DC.</li>
<li><strong>Phase noise:</strong> smears each point tangentially (rotational blur), worse for outer points; caps EVM regardless of SNR.</li>
<li><strong>Residual carrier frequency error:</strong> spins the entire constellation; over a burst it appears as a spiral/smear.</li>
<li><strong>PA nonlinearity (AM/AM, AM/PM):</strong> compresses and rotates outer (high-power) points inward — a "warped" constellation and spectral regrowth.</li>
<li><strong>Additive noise:</strong> uniform Gaussian cloud around every point, the "clean" case where EVM↔SNR holds.</li>
</ul>
<div class="callout"><strong>Diagnostic tip:</strong> A round symmetric cloud = noise. An ellipse = gain imbalance. A sheared grid = quadrature error. Off-center = LO leakage. Rotational smear = phase noise. Warped outer points = PA compression.</div>`
      },
      {
        h: 'Measurement Practice and Pitfalls',
        html: String.raw`<p>Measuring EVM correctly requires care. The analyzer must first estimate and remove reference impairments it is <em>allowed</em> to remove (per the standard): a fixed frequency offset, a static phase, sometimes a fixed gain and even a fixed I/Q imbalance are typically equalized out before computing EVM, because these are considered synchronization tasks a real receiver performs. What remains — the un-correctable, symbol-varying error — is the reported EVM.</p>
<ul>
<li><strong>Symbol vs pilot EVM:</strong> some standards compute EVM only on data symbols after channel equalization using pilots.</li>
<li><strong>RMS vs peak EVM:</strong> RMS is standard; peak EVM flags worst-case symbols (PA clipping).</li>
<li><strong>Measurement floor:</strong> the test instrument's own EVM (residual) limits how good a DUT you can verify; use $\mathrm{EVM}_{\text{true}}^2\approx \mathrm{EVM}_{\text{meas}}^2-\mathrm{EVM}_{\text{inst}}^2$ to de-embed.</li>
<li><strong>Averaging length:</strong> too few symbols gives a noisy EVM estimate; standards specify minimum symbol counts.</li>
<li><strong>Filtering/reference:</strong> use the correct measurement (matched) filter and constellation reference, or EVM is meaningless.</li>
</ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>After this topic, EVM should be both a number you can compute and a diagnostic you can read:</p>
<ul>
<li><strong>The definition:</strong> EVM is the RMS error vector $\mathbf e=\mathbf r-\mathbf s$ normalized to reference power — always state whether that reference is average or peak.</li>
<li><strong>The SNR bridge:</strong> for noise-like errors $\mathrm{EVM}^2=1/\mathrm{SNR}$, so $\mathrm{SNR}_{dB}\approx-20\log_{10}(\mathrm{EVM})$; 10% ↔ 20 dB, 1% ↔ 40 dB.</li>
<li><strong>The BER link:</strong> that effective SNR feeds the standard $M$-QAM/PSK Q-function, making EVM a fast proxy for a BER measurement.</li>
<li><strong>The order hierarchy:</strong> each step up in constellation density roughly halves the tolerable EVM, which is why 256-QAM demands ~2% where QPSK tolerates ~17.5%.</li>
<li><strong>The fingerprints:</strong> round cloud = noise, ellipse = gain imbalance, sheared grid = quadrature error, off-center = LO leakage, tangential smear = phase noise, warped outer points = PA compression.</li>
<li><strong>The measurement caveats:</strong> analyzers remove allowed impairments first, and instrument noise adds in power ($\mathrm{EVM}_{\text{true}}^2\approx\mathrm{EVM}_{\text{meas}}^2-\mathrm{EVM}_{\text{inst}}^2$).</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`EVM is the RMS error-vector magnitude normalized to reference power: $\sqrt{\overline{|\mathbf r-\mathbf s|^2}/\overline{|\mathbf s|^2}}$.`,
      String.raw`The error vector $\mathbf e=\mathbf r-\mathbf s$ splits into a radial (magnitude) and tangential (phase) component.`,
      String.raw`For noise-like errors, $\mathrm{EVM}^2=1/\mathrm{SNR}$, so $\mathrm{SNR}_{dB}\approx -20\log_{10}(\mathrm{EVM})=-\mathrm{EVM}_{dB}$.`,
      String.raw`10% EVM ≈ 20 dB SNR; 1% EVM ≈ 40 dB SNR (average-power normalization).`,
      String.raw`Higher-order constellations require lower EVM; each step up roughly halves the tolerable EVM.`,
      String.raw`I/Q gain imbalance → ellipse; quadrature error → sheared grid; LO leakage → off-center constellation.`,
      String.raw`Phase noise → tangential (rotational) smear that caps EVM independent of SNR; PA compression warps outer points.`,
      String.raw`Always state the normalization reference (average vs peak power) — it changes the reported number.`,
      String.raw`Analyzers remove allowed reference impairments (frequency, static phase) before computing EVM.`,
      String.raw`Measured EVM includes instrument noise; de-embed via $\mathrm{EVM}_{\text{true}}^2\approx\mathrm{EVM}_{\text{meas}}^2-\mathrm{EVM}_{\text{inst}}^2$.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr-evm" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ff6b6b"/></marker></defs>
<rect x="0" y="0" width="400" height="300" fill="#1c232e"/>
<line x1="30" y1="150" x2="370" y2="150" stroke="#9aa7b5" stroke-width="1"/>
<line x1="200" y1="20" x2="200" y2="280" stroke="#9aa7b5" stroke-width="1"/>
<text x="356" y="145" fill="#9aa7b5" font-size="12">I</text>
<text x="206" y="30" fill="#9aa7b5" font-size="12">Q</text>
<line x1="200" y1="150" x2="300" y2="80" stroke="#4dabf7" stroke-width="2"/>
<circle cx="300" cy="80" r="6" fill="#4dabf7"/>
<text x="305" y="76" fill="#4dabf7" font-size="11">ideal $\mathbf{s}_k$</text>
<line x1="200" y1="150" x2="330" y2="105" stroke="#63e6be" stroke-width="1.5" stroke-dasharray="4 3"/>
<circle cx="330" cy="105" r="6" fill="#ffa94d"/>
<text x="332" y="100" fill="#ffa94d" font-size="11">measured $\mathbf{r}_k$</text>
<line x1="300" y1="80" x2="330" y2="105" stroke="#ff6b6b" stroke-width="2.5" marker-end="url(#arr-evm)"/>
<text x="300" y="130" fill="#ff6b6b" font-size="12">error vector $\mathbf{e}_k$</text>
<text x="40" y="260" fill="#9aa7b5" font-size="11">$\mathrm{EVM}=|\mathbf{e}|_{rms}/|\mathbf{s}|_{ref}$</text>
</svg>`,
        caption: 'The error vector is the difference between the measured and ideal symbol points. EVM is its RMS magnitude normalized to reference power.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="200" fill="#1c232e"/>
<text x="20" y="20" fill="#e6edf3" font-size="12">Impairment signatures on the constellation</text>
<g transform="translate(70,110)">
<circle cx="0" cy="0" r="3" fill="#4dabf7"/><circle cx="2" cy="-2" r="10" fill="none" stroke="#63e6be" stroke-width="1"/>
<text x="-45" y="55" fill="#9aa7b5" font-size="10">noise (round)</text></g>
<g transform="translate(200,110)">
<ellipse cx="0" cy="0" rx="16" ry="7" fill="none" stroke="#ffa94d" stroke-width="1.5"/>
<text x="-45" y="55" fill="#9aa7b5" font-size="10">gain imbalance</text></g>
<g transform="translate(330,110)">
<path d="M-14,-8 L18,-8 L14,8 L-18,8 Z" fill="none" stroke="#b197fc" stroke-width="1.5"/>
<text x="-42" y="55" fill="#9aa7b5" font-size="10">quadrature err</text></g>
<g transform="translate(460,110)">
<path d="M0,0 A 12 12 0 0 1 10 -7" fill="none" stroke="#ff6b6b" stroke-width="2"/>
<circle cx="10" cy="-7" r="3" fill="#ff6b6b"/>
<text x="-45" y="55" fill="#9aa7b5" font-size="10">phase noise smear</text></g>
</svg>`,
        caption: 'Distinct impairment fingerprints: additive noise (round cloud), I/Q gain imbalance (ellipse), quadrature error (sheared grid), phase noise (tangential arc smear).'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr2-evm" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="170" fill="#1c232e"/>
<text x="20" y="24" fill="#e6edf3" font-size="13">EVM measurement chain</text>
<rect x="15" y="55" width="90" height="44" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/>
<text x="28" y="75" fill="#e6edf3" font-size="10">demod rx</text>
<text x="30" y="90" fill="#9aa7b5" font-size="10">$\mathbf r_k$</text>
<line x1="105" y1="77" x2="150" y2="77" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-evm)"/>
<rect x="150" y="55" width="95" height="44" fill="#1c232e" stroke="#63e6be" stroke-width="1.5"/>
<text x="160" y="72" fill="#e6edf3" font-size="10">ideal ref</text>
<text x="163" y="90" fill="#9aa7b5" font-size="10">$\mathbf s_k$ (slice)</text>
<line x1="245" y1="77" x2="290" y2="77" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-evm)"/>
<rect x="290" y="55" width="100" height="44" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/>
<text x="300" y="72" fill="#e6edf3" font-size="10">error vector</text>
<text x="300" y="90" fill="#9aa7b5" font-size="10">$\mathbf e_k=\mathbf r_k-\mathbf s_k$</text>
<line x1="390" y1="77" x2="435" y2="77" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#arr2-evm)"/>
<rect x="435" y="55" width="95" height="44" fill="#1c232e" stroke="#b197fc" stroke-width="1.5"/>
<text x="448" y="72" fill="#e6edf3" font-size="10">RMS / norm</text>
<text x="452" y="90" fill="#63e6be" font-size="10">EVM %</text>
<text x="270" y="135" fill="#9aa7b5" font-size="11">$\mathrm{EVM}=\sqrt{\overline{|\mathbf e_k|^2}/\overline{|\mathbf s_k|^2}}$</text>
</svg>`,
        caption: 'EVM measurement chain: demodulate to recover measured symbols, find the ideal reference for each, form the error vector, then RMS-average and normalise to reference power.'
      }
    ],
    equations: [
      {
        title: 'EVM (RMS)',
        tex: String.raw`$$\mathrm{EVM}_{\text{rms}}=\sqrt{\dfrac{\frac1N\sum_k|\mathbf r_k-\mathbf s_k|^2}{\frac1N\sum_k|\mathbf s_k|^2}}$$`,
        derivation: String.raw`<p>Take the error vector $\mathbf e_k=\mathbf r_k-\mathbf s_k$ for each of $N$ symbols. Average its squared magnitude (error power), divide by the average reference power $\frac1N\sum|\mathbf s_k|^2$, take the square root. The result is dimensionless; ×100 gives percent.</p>`
      },
      {
        title: 'EVM in dB',
        tex: String.raw`$$\mathrm{EVM}_{dB}=20\log_{10}(\mathrm{EVM}_{\text{rms}})$$`,
        derivation: String.raw`<p>Since EVM is an amplitude (voltage-like) ratio, convert with $20\log_{10}$. Example: EVM $=0.05$ (5%) $\Rightarrow 20\log_{10}0.05=-26$ dB.</p>`
      },
      {
        title: 'EVM ↔ SNR',
        tex: String.raw`$$\mathrm{SNR}=\frac{1}{\mathrm{EVM}_{\text{rms}}^2},\qquad \mathrm{SNR}_{dB}\approx-20\log_{10}(\mathrm{EVM})$$`,
        derivation: String.raw`<p>If the error is noise-like, error power $=P_N$ and reference power $=P_S$, so $\mathrm{EVM}^2=P_N/P_S=1/\mathrm{SNR}$. Inverting and taking dB: $\mathrm{SNR}_{dB}=-10\log_{10}\mathrm{EVM}^2=-20\log_{10}\mathrm{EVM}$.</p>`
      },
      {
        title: 'Error-Vector Components',
        tex: String.raw`$$|\mathbf e_k|^2=(\Delta\text{mag})^2+\big(|\mathbf s_k|\sin\phi_k\big)^2$$`,
        derivation: String.raw`<p>Resolve $\mathbf e_k$ into a component along $\mathbf s_k$ (magnitude error $\Delta$mag) and perpendicular to it (phase error). For small $\phi_k$, the perpendicular length is $|\mathbf s_k|\sin\phi_k\approx|\mathbf s_k|\phi_k$. The total error power is the sum of squares.</p>`
      },
      {
        title: 'M-QAM BER from EVM',
        tex: String.raw`$$P_b\approx\frac{4}{\log_2M}\Big(1-\tfrac1{\sqrt M}\Big)Q\!\left(\sqrt{\tfrac{3\log_2M}{M-1}\cdot\tfrac{1}{\mathrm{EVM}^2}}\right)$$`,
        derivation: String.raw`<p>Substitute the EVM-derived SNR $=1/\mathrm{EVM}^2$ into the standard square-$M$-QAM BER expression, which is $\frac{4}{\log_2M}(1-1/\sqrt M)Q(\sqrt{\frac{3\log_2M}{M-1}\gamma_b})$ with $\gamma_b=\mathrm{SNR}/\log_2M$... (here written with total SNR). This gives error rate directly from measured EVM for AWGN-like impairments.</p>`
      },
      {
        title: 'Instrument De-embedding',
        tex: String.raw`$$\mathrm{EVM}_{\text{true}}^2\approx\mathrm{EVM}_{\text{meas}}^2-\mathrm{EVM}_{\text{inst}}^2$$`,
        derivation: String.raw`<p>Assuming DUT and instrument errors are uncorrelated, their error powers add: $\mathrm{EVM}_{\text{meas}}^2=\mathrm{EVM}_{\text{true}}^2+\mathrm{EVM}_{\text{inst}}^2$. Subtract the known instrument residual to recover the true device EVM.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Define EVM.`, back: String.raw`RMS magnitude of the error vector $\mathbf r-\mathbf s$ normalized to reference (usually average symbol) power.` },
      { front: String.raw`What is the error vector?`, back: String.raw`$\mathbf e_k=\mathbf r_k-\mathbf s_k$: measured symbol minus ideal symbol.` },
      { front: String.raw`EVM-to-SNR relationship?`, back: String.raw`$\mathrm{SNR}=1/\mathrm{EVM}^2$; $\mathrm{SNR}_{dB}\approx -20\log_{10}(\mathrm{EVM})=-\mathrm{EVM}_{dB}$.` },
      { front: String.raw`What SNR does 1% EVM imply?`, back: String.raw`$-20\log_{10}(0.01)=40$ dB.` },
      { front: String.raw`How is EVM converted to dB?`, back: String.raw`$\mathrm{EVM}_{dB}=20\log_{10}(\mathrm{EVM}_{\text{rms}})$ (it's an amplitude ratio).` },
      { front: String.raw`Two directional components of the error vector?`, back: String.raw`Radial = magnitude error; tangential = phase error.` },
      { front: String.raw`What constellation signature does I/Q gain imbalance give?`, back: String.raw`An elliptical (stretched-in-one-axis) constellation.` },
      { front: String.raw`What does I/Q quadrature error do to the constellation?`, back: String.raw`Shears it into a rhombus (axes not $90^\circ$).` },
      { front: String.raw`What does LO/carrier leakage cause?`, back: String.raw`A DC offset — the whole constellation shifts off-center.` },
      { front: String.raw`What is the phase-noise signature?`, back: String.raw`Tangential (rotational) smear, worse on outer points; caps EVM regardless of SNR.` },
      { front: String.raw`What does PA nonlinearity do?`, back: String.raw`Compresses/rotates outer high-power points inward (AM/AM, AM/PM) plus spectral regrowth.` },
      { front: String.raw`Why do higher-order constellations need lower EVM?`, back: String.raw`Points are closer together, so smaller errors cause decision errors.` },
      { front: String.raw`Why state the EVM normalization reference?`, back: String.raw`Average- vs peak-power normalization give different numbers for the same signal.` },
      { front: String.raw`How to remove instrument EVM contribution?`, back: String.raw`$\mathrm{EVM}_{\text{true}}^2\approx\mathrm{EVM}_{\text{meas}}^2-\mathrm{EVM}_{\text{inst}}^2$ (uncorrelated powers subtract).` }
    ],
    mcqs: [
      { q: String.raw`EVM is best described as:`, options: [String.raw`Peak power of the signal`, String.raw`RMS error-vector magnitude normalized to reference power`, String.raw`Carrier frequency error`, String.raw`Occupied bandwidth`], answer: 1, explain: String.raw`It is the normalized RMS distance from ideal symbols.` },
      { q: String.raw`For noise-like errors, EVM relates to SNR by:`, options: [String.raw`$\mathrm{SNR}=\mathrm{EVM}^2$`, String.raw`$\mathrm{SNR}=1/\mathrm{EVM}^2$`, String.raw`$\mathrm{SNR}=\mathrm{EVM}$`, String.raw`$\mathrm{SNR}=10\,\mathrm{EVM}$`], answer: 1, explain: String.raw`$\mathrm{EVM}^2=1/\mathrm{SNR}$.` },
      { q: String.raw`An EVM of 10% corresponds to about:`, options: [String.raw`10 dB SNR`, String.raw`20 dB SNR`, String.raw`30 dB SNR`, String.raw`40 dB SNR`], answer: 1, explain: String.raw`$-20\log_{10}(0.1)=20$ dB.` },
      { q: String.raw`EVM in dB is computed with:`, options: [String.raw`$10\log_{10}$`, String.raw`$20\log_{10}$`, String.raw`$\ln$`, String.raw`$\log_2$`], answer: 1, explain: String.raw`EVM is an amplitude ratio, so use $20\log_{10}$.` },
      { q: String.raw`An elliptical constellation most likely indicates:`, options: [String.raw`Phase noise`, String.raw`I/Q gain imbalance`, String.raw`LO leakage`, String.raw`Timing error`], answer: 1, explain: String.raw`Unequal I and Q gains stretch one axis.` },
      { q: String.raw`A constellation sheared into a rhombus indicates:`, options: [String.raw`I/Q quadrature (phase) imbalance`, String.raw`Additive noise`, String.raw`DC offset`, String.raw`Frequency offset`], answer: 0, explain: String.raw`Non-orthogonal I/Q axes shear the grid.` },
      { q: String.raw`A constellation shifted off-center points to:`, options: [String.raw`Phase noise`, String.raw`Carrier/LO leakage (DC offset)`, String.raw`PA compression`, String.raw`Thermal noise`], answer: 1, explain: String.raw`LO leakage adds a DC component that offsets all points.` },
      { q: String.raw`Rotational (tangential) smearing of points is the signature of:`, options: [String.raw`Gain imbalance`, String.raw`Phase noise`, String.raw`DC offset`, String.raw`Quantization`], answer: 1, explain: String.raw`Phase noise randomizes the angle, worse for outer points.` },
      { q: String.raw`Compared with QPSK, 256-QAM requires EVM that is:`, options: [String.raw`Larger`, String.raw`The same`, String.raw`Much smaller`, String.raw`Irrelevant`], answer: 2, explain: String.raw`Denser constellations need far lower EVM (~3.5% vs ~17.5%).` },
      { q: String.raw`Warped/compressed outer constellation points indicate:`, options: [String.raw`PA nonlinearity (AM/AM, AM/PM)`, String.raw`Additive noise`, String.raw`Perfect linearity`, String.raw`Timing jitter`], answer: 0, explain: String.raw`High-power outer symbols saturate the amplifier.` },
      { q: String.raw`Which normalization gives a smaller EVM number for the same QAM signal?`, options: [String.raw`Average-power`, String.raw`Peak-power`, String.raw`They are identical`, String.raw`Neither`], answer: 1, explain: String.raw`Dividing by the larger peak power yields a smaller percentage.` },
      { q: String.raw`To remove the analyzer's own error contribution from EVM:`, options: [String.raw`Add the two EVMs`, String.raw`Subtract in power: $\mathrm{EVM}_{true}^2=\mathrm{EVM}_{meas}^2-\mathrm{EVM}_{inst}^2$`, String.raw`Multiply them`, String.raw`Ignore it`], answer: 1, explain: String.raw`Uncorrelated error powers subtract.` }
    ],
    numericals: [
      {
        q: String.raw`A 64-QAM transmitter measures EVM = 2.5%. Estimate the equivalent SNR in dB.`,
        solution: String.raw`<p><b>Formula.</b> $$\mathrm{SNR}_{dB} \approx -20\log_{10}(\mathrm{EVM}_{\text{rms}})$$ valid when the error vector is noise-like; $\mathrm{EVM}_{\text{rms}}$ is a fraction (not percent).</p>
<p><b>Substitute.</b> $\mathrm{EVM}_{\text{rms}} = 0.025$, so $\mathrm{SNR}_{dB} = -20\log_{10}(0.025)$.</p>
<p><b>Compute.</b> $\log_{10}(0.025)=-1.602$, giving $\mathrm{SNR}_{dB} = -20(-1.602) = \mathbf{32.0\ dB}$.</p>
<p><b>Explanation.</b> This sits comfortably above the ~22 dB (8% EVM) a 64-QAM signal needs, so the transmitter has healthy modulation-quality margin — an engineer reads it as "passing with room to spare".</p>`
      },
      {
        q: String.raw`A link needs 30 dB SNR. What maximum EVM (%) is allowed (noise-like errors)?`,
        solution: String.raw`<p><b>Formula.</b> Invert the EVM–SNR rule: $$\mathrm{EVM}_{\text{rms}} = 10^{-\mathrm{SNR}_{dB}/20}.$$</p>
<p><b>Substitute.</b> $\mathrm{EVM}_{\text{rms}} = 10^{-30/20}=10^{-1.5}$.</p>
<p><b>Compute.</b> $\mathrm{EVM}_{\text{rms}} = 0.0316 = \mathbf{3.16\%}$.</p>
<p><b>Explanation.</b> To keep 30 dB of effective SNR the total residual error must stay under 3.16% RMS; this is how a standards body turns an SNR/BER target into a concrete transmitter EVM limit.</p>`
      },
      {
        q: String.raw`Instrument residual EVM is 1.0%; measured DUT EVM is 2.2%. Find the true DUT EVM.`,
        solution: String.raw`<p><b>Formula.</b> Uncorrelated error powers add, so they subtract when de-embedding: $$\mathrm{EVM}_{\text{true}} = \sqrt{\mathrm{EVM}_{\text{meas}}^2 - \mathrm{EVM}_{\text{inst}}^2}.$$</p>
<p><b>Substitute.</b> $\mathrm{EVM}_{\text{true}} = \sqrt{(2.2)^2 - (1.0)^2}=\sqrt{4.84 - 1.0}$.</p>
<p><b>Compute.</b> $\mathrm{EVM}_{\text{true}} = \sqrt{3.84} = \mathbf{1.96\%}$.</p>
<p><b>Explanation.</b> The analyzer's own 1% noise inflated the reading from 1.96% to 2.2%; de-embedding matters most when the DUT approaches the instrument's residual, otherwise you fail good parts.</p>`
      },
      {
        q: String.raw`Given error vectors with RMS magnitude 0.08 V and reference RMS symbol magnitude 1.0 V, compute EVM (%) and dB.`,
        solution: String.raw`<p><b>Formula.</b> $$\mathrm{EVM}_{\text{rms}} = \frac{|\mathbf e|_{\text{rms}}}{|\mathbf s|_{\text{ref}}},\qquad \mathrm{EVM}_{dB}=20\log_{10}(\mathrm{EVM}_{\text{rms}}).$$</p>
<p><b>Substitute.</b> $\mathrm{EVM}_{\text{rms}} = 0.08/1.0$; then $\mathrm{EVM}_{dB}=20\log_{10}(0.08)$.</p>
<p><b>Compute.</b> $\mathrm{EVM}_{\text{rms}} = 0.08 = \mathbf{8\%}$; $\mathrm{EVM}_{dB} = \mathbf{-21.9\ dB}$.</p>
<p><b>Explanation.</b> 8% EVM is right at the typical 64-QAM limit (~22 dB effective SNR), so this signal would just barely qualify for 64-QAM but not for anything denser.</p>`
      },
      {
        q: String.raw`A symbol has ideal magnitude 1.0 and a phase error of $3^\circ$ with negligible magnitude error. What is that symbol's error-vector magnitude and its EVM contribution?`,
        solution: String.raw`<p><b>Formula.</b> With negligible magnitude error, the error vector is the tangential (phase) component: $$|\mathbf e| = |\mathbf s|\sin\phi$$ for reference magnitude $|\mathbf s|$ and phase error $\phi$.</p>
<p><b>Substitute.</b> $|\mathbf e| = 1.0\times\sin 3^\circ$.</p>
<p><b>Compute.</b> $|\mathbf e| = 1.0\times 0.0523 = \mathbf{0.0523}$ ($\approx 5.2\%$ of the reference).</p>
<p><b>Explanation.</b> A mere $3^\circ$ of phase error already produces ~5% EVM, illustrating why phase noise and residual carrier error dominate the EVM budget of high-order QAM far more than amplitude errors do.</p>`
      },
      {
        q: String.raw`A 256-QAM standard allows -34 dB EVM. Convert to percent and to an equivalent SNR.`,
        solution: String.raw`<p><b>Formula.</b> $$\mathrm{EVM}_{\text{rms}} = 10^{\mathrm{EVM}_{dB}/20},\qquad \mathrm{SNR}_{dB} \approx -\mathrm{EVM}_{dB}.$$</p>
<p><b>Substitute.</b> $\mathrm{EVM}_{\text{rms}} = 10^{-34/20}=10^{-1.7}$; $\mathrm{SNR}_{dB} = -(-34)$.</p>
<p><b>Compute.</b> $\mathrm{EVM}_{\text{rms}} = 0.0200 = \mathbf{2.0\%}$; $\mathrm{SNR}_{dB} = \mathbf{34\ dB}$.</p>
<p><b>Explanation.</b> 256-QAM's dense grid demands ~2% EVM / 34 dB SNR — roughly halving the tolerable EVM of 64-QAM — which is why it forces stringent phase-noise and PA-linearity budgets in the transmitter.</p>`
      }
    ],
    realWorld: String.raw`<p>EVM is the primary transmitter-conformance metric in essentially every modern wireless standard. 3GPP LTE and 5G NR specify maximum EVM per modulation (e.g., ~17.5% for QPSK down to ~3.5% for 256-QAM), and a base station or handset that exceeds the limit fails certification. IEEE 802.11ax/be push to 1024-QAM and 4096-QAM, demanding EVM below ~1.8% and ~1%, which in turn forces stringent phase-noise, I/Q-calibration, and PA-linearization budgets.</p>
<p>Because EVM aggregates all impairments, engineers use its directional decomposition as a diagnostic: a lab spectrum/vector-signal analyzer displays the constellation and reports magnitude error, phase error, I/Q imbalance, LO leakage, and frequency error separately, letting a designer pinpoint whether the culprit is the synthesizer's phase noise, the modulator's quadrature calibration, or the power amplifier's compression. Digital pre-distortion (DPD) is often tuned specifically to minimize EVM (and adjacent-channel leakage) under real signal statistics.</p>`,
    related: ['bpsk', 'phase-noise', 'noise', 'ad9361', 'dbpsk']
  }
);
