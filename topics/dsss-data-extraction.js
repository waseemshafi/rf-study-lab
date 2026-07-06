/* dsss-data-extraction.js — "DSSS Data Extraction" topic (Spread Spectrum & Coding).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no "$"+"{" sequence.
   Every SVG marker/def id is prefixed "dsss-data-extraction-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'dsss-data-extraction',
    title: 'DSSS Data Extraction',
    category: 'Spread Spectrum & Coding',
    tags: ['DSSS', 'despreading', 'integrate-and-dump', 'processing gain', 'BER', 'jamming margin', 'coherent demod'],
    summary: String.raw`Once code and carrier are locked, DSSS data extraction despreads with the aligned PN replica, integrates over each bit (matched filter), decides by the sign of the statistic, and decodes — collapsing the wideband signal back to the data bandwidth so that output SNR is boosted by the processing gain against interference while AWGN BER stays that of plain BPSK.`,
    prerequisites: ['dsss-tracking', 'matched-filter', 'processing-gain'],
    intro: String.raw`<p><strong>Why does data extraction deserve its own topic?</strong> Acquisition finds the code phase and tracking keeps the local replica and carrier locked — but neither of those recovers a single information bit. All the receiver has after tracking is a signal that is <em>aligned</em>, not <em>demodulated</em>. The actual payoff of the entire spread-spectrum chain — recovering the message that was buried below the noise floor and diluting any jammer that tried to drown it — happens right here, in the despread-integrate-decide-decode pipeline. This is where processing gain finally turns from a promise into recovered bits.</p>
    <p>DSSS data extraction is the sequence that runs <em>after</em> lock: multiply the received signal by the phase-aligned PN replica supplied by the tracking loop (<strong>despread</strong>), integrate the product over one bit interval $T_b$ (an integrate-and-dump <strong>matched filter</strong>), take the <strong>sign</strong> of the resulting decision statistic to recover the bit (coherent BPSK <strong>decision</strong>), then hand the bit stream to <strong>FEC decode</strong>, descrambling, and frame sync. The despreading step is the crucial one: because the local code $c(t)=\pm1$ satisfies $c^2(t)=1$, it collapses the wideband signal back to a narrowband data-modulated carrier while simultaneously spreading any uncoded interferer across the whole chip bandwidth.</p>
    <p>The single most important — and most tested — fact in this topic is a subtle one: over a <em>pure AWGN</em> channel, spreading then despreading does <strong>not</strong> improve the bit-error rate compared with plain BPSK at the same $E_b/N_0$. Processing gain buys resistance to <em>interference</em>, <em>jamming</em>, and <em>interception</em> — not free thermal-noise performance. Understanding exactly why is the spine of this topic.</p>`,
    sections: [
      {
        h: 'Why extraction is the point of the whole chain',
        html: String.raw`<p><strong>Why start here?</strong> A DSSS receiver spends most of its silicon on acquisition (a 2-D search over code phase and Doppler) and tracking (a delay-locked loop plus a carrier loop). Yet all of that machinery exists only to make one thing possible: presenting the demodulator with a signal whose code phase and carrier phase are known to within a small fraction of a chip and a few degrees. <strong>Extraction is the only stage that produces information.</strong> Everything upstream is overhead paid so that this stage can succeed.</p>
        <p>The transmit model is the anchor for the entire discussion. A DSSS BPSK waveform is</p>
        <p>$$ s(t) = \sqrt{2P}\,d(t)\,c(t)\,\cos(2\pi f_c t), $$</p>
        <p>where $P$ is the average power, $d(t)\in\{+1,-1\}$ is the data at rate $R_b$ (bit duration $T_b=1/R_b$), $c(t)\in\{+1,-1\}$ is the PN chip sequence at rate $R_c$ (chip duration $T_c=1/R_c$), and $f_c$ is the carrier. The number of chips per bit</p>
        <p>$$ N = \frac{T_b}{T_c} = \frac{R_c}{R_b} $$</p>
        <p>equals the <strong>processing gain</strong>. The receiver's job is to undo all three modulations in the right order: strip the code, strip the carrier, and then read the sign of $d(t)$.</p>
        <div class="callout"><strong>Intuition:</strong> think of the signal as wrapped in two layers — a fast "scrambling" layer (the code) and a carrier layer. Tracking hands you the two keys (aligned code, aligned phase). Extraction is turning both keys and reading the message inside.</div>`
      },
      {
        h: 'Despreading: collapsing the bandwidth back to the data',
        html: String.raw`<p>Let the received signal (after the front end, with the carrier already handled coherently, so we work at baseband on the in-phase arm) be $r(t)=\sqrt{2P}\,d(t)\,c(t)+n(t)+j(t)$, where $n(t)$ is AWGN and $j(t)$ is any interference/jammer. Multiply by the <em>time-aligned</em> local replica $c(t)$ supplied by the tracking loop:</p>
        <p>$$ r(t)\,c(t) = \sqrt{2P}\,d(t)\,\underbrace{c^2(t)}_{=1} + n(t)c(t) + j(t)c(t) = \sqrt{2P}\,d(t) + n(t)c(t) + j(t)c(t). $$</p>
        <p>Because $c(t)=\pm1$ implies $c^2(t)=1$, the <strong>wanted term collapses</strong> from a wideband ($\sim R_c$) waveform back to the narrowband ($\sim R_b$) data-modulated signal. This is bandwidth collapse: the signal energy that was smeared across the chip bandwidth is re-concentrated into the data bandwidth. Meanwhile any uncoded interferer $j(t)$ is <em>multiplied</em> by the fast code and is thereby <strong>spread</strong> to bandwidth $\sim R_c$ — the exact opposite of what happens to the signal.</p>
        <p>White noise $n(t)$ is a special case: multiplying white noise by a $\pm1$ waveform leaves it statistically white (same PSD), so despreading does not change the noise. This asymmetry — signal re-concentrated, interferer spread, noise unchanged — is the mathematical heart of every DSSS benefit.</p>
        <div class="callout"><strong>One-line summary:</strong> despreading is a correlation. It rewards the one waveform that matches the local code and dilutes everything that does not.</div>`
      },
      {
        h: 'Integrate-and-dump: the matched filter that forms the decision statistic',
        html: String.raw`<p>After despreading, the narrowband data-modulated signal is passed through an <strong>integrate-and-dump</strong> filter over one bit interval. This is the matched filter for a rectangular data pulse: integrating over $T_b$ and resetting ("dumping") each bit boundary maximizes the signal-to-noise ratio at the sampling instant. The decision statistic for the bit spanning $[0,T_b]$ is</p>
        <p>$$ z = \int_0^{T_b} r(t)\,c(t)\,dt. $$</p>
        <p>Substituting the despread form, the signal part integrates to $\sqrt{2P}\,d\,T_b$ (a clean $\pm$ value proportional to the bit), while the noise part $\int_0^{T_b} n(t)c(t)\,dt$ is a zero-mean Gaussian random variable whose variance grows only linearly with $T_b$. Because the signal contribution grows as $T_b$ but the noise standard deviation grows as $\sqrt{T_b}$, the accumulated statistic separates the two hypotheses ever more cleanly as $N$ chips are summed — this coherent accumulation over $N$ chips is exactly where the bit energy $E_b = P\,T_b$ is built up.</p>
        <p>Equivalently the integral is a coherent sum of $N$ chip correlations: each chip contributes a small in-phase vote, and the $N$ votes add <em>coherently</em> (in amplitude, $\propto N$) while their noise adds <em>incoherently</em> (in power, $\propto N$). That $N$-vs-$\sqrt{N}$ split is the same processing-gain mechanism written at chip granularity.</p>`
      },
      {
        h: 'The decision and the decode: sign, then FEC',
        html: String.raw`<p>For coherent BPSK the bit decision is simply the <strong>sign</strong> of the prompt in-phase statistic:</p>
        <p>$$ \hat d = \operatorname{sgn}(z). $$</p>
        <p>Coherence matters: the carrier tracking loop (a Costas loop for a suppressed-carrier BPSK DSSS signal) supplies the <em>prompt in-phase</em> ($I$) arm phase-aligned to the incoming carrier, so the data lands entirely on $I$ and the quadrature ($Q$) arm carries only noise. The sign of the $I$ accumulation is the recovered bit.</p>
        <ul>
          <li><strong>Coherent</strong> demodulation (Costas prompt $I$) is the standard high-performance path and is assumed for the BER formulas below.</li>
          <li><strong>Differential / non-coherent</strong> options (DBPSK) are used when the carrier phase cannot be tracked cleanly — they cost roughly 1&ndash;3 dB but tolerate residual phase error, useful right after acquisition or under fast dynamics.</li>
        </ul>
        <p>The recovered hard (or soft) bits are then passed to the outer processing: <strong>FEC decode</strong> (Viterbi, turbo, or LDPC), <strong>descrambling</strong>, and <strong>frame synchronization</strong>. Soft outputs (the value of $z$, not just its sign) preserve reliability information and let a soft-decision decoder recover roughly 2 dB more than a hard slice — so a good extractor forwards $z$, not merely $\hat d$.</p>`
      },
      {
        h: 'Bandwidth collapse and the output-SNR gain',
        html: String.raw`<p>Despreading re-concentrates the signal power into the data bandwidth $R_b$ while spreading any narrowband interferer of power $J$ over the chip bandwidth $R_c$. Only the fraction $R_b/R_c = 1/N$ of the interferer's power now falls inside the post-correlation data bandwidth. Consequently the output signal-to-interference ratio improves by exactly the processing gain:</p>
        <p>$$ \mathrm{SNR}_{out} = N \cdot \mathrm{SNR}_{in}, \qquad G_p[\text{dB}] = 10\log_{10} N = 10\log_{10}\!\left(\frac{R_c}{R_b}\right). $$</p>
        <p>Note the deliberate distinction: this SNR boost applies to <em>interference</em> (anything narrowband relative to the chip rate). For truly white thermal noise, despreading changes nothing, because white noise remains white under multiplication by $\pm1$. That is the crux of the AWGN result in the next section.</p>
        <table class="data">
          <tr><th>Quantity</th><th>Before despread</th><th>After despread</th></tr>
          <tr><td>Signal bandwidth</td><td>$\sim R_c$</td><td>$\sim R_b$</td></tr>
          <tr><td>Signal power</td><td>$P$</td><td>$P$ (preserved)</td></tr>
          <tr><td>Narrowband interferer bandwidth</td><td>$\ll R_c$</td><td>$\sim R_c$ (spread)</td></tr>
          <tr><td>Interferer power in data band</td><td>$J$</td><td>$\approx J/N$</td></tr>
          <tr><td>White-noise PSD</td><td>$N_0$</td><td>$N_0$ (unchanged)</td></tr>
        </table>`
      },
      {
        h: 'AWGN performance: the crucial "no free lunch" result',
        html: String.raw`<p>After despreading and integrate-and-dump the bit energy is $E_b = P\,T_b = C/R_b$ (with $C$ the received carrier power), and the noise is still white Gaussian with two-sided density $N_0/2$. The relation to the carrier-to-noise-density ratio is</p>
        <p>$$ \frac{E_b}{N_0} = \frac{C/N_0}{R_b} = \left(\frac{C}{N_0}\right)\!\Big/\,R_b, $$</p>
        <p>and for coherent BPSK the bit-error rate is the familiar</p>
        <p>$$ \mathrm{BER} = Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right). $$</p>
        <p><strong>The crucial point:</strong> spreading raises the transmit bandwidth from $R_b$ to $R_c$, and despreading brings it back — but the pair is a lossless round trip for the signal <em>and</em> for white noise. The $E_b/N_0$ delivered to the decision device is exactly what a plain BPSK link at the same received power and data rate would deliver. So over a pure AWGN channel, <strong>the DSSS BER equals the plain-BPSK BER at the same $E_b/N_0$</strong>. Processing gain does not buy AWGN performance; it buys interference/jamming resistance and low probability of intercept (LPI).</p>
        <div class="callout tip"><strong>Exam trap:</strong> "A DSSS system with $G_p=30$ dB has 30 dB better BER in AWGN." False. In AWGN it has the <em>same</em> BER as BPSK at equal $E_b/N_0$. The 30 dB is margin against a jammer, not thermal-noise gain.</div>`
      },
      {
        h: 'Interference, jamming margin, and the practical payoff',
        html: String.raw`<p>Now the payoff of the whole chain becomes concrete. A continuous-wave (CW) or narrowband jammer of received power $J$ is spread by despreading over the chip bandwidth $R_c$, so its effective PSD in the data band is $\approx J/R_c$ and only a fraction $\sim 1/N$ of its power lands where the bit decision is made. The jammer therefore behaves like added noise diluted by the processing gain. The usable robustness is captured by the <strong>jamming margin</strong>:</p>
        <p>$$ M_j[\text{dB}] = G_p[\text{dB}] - \left(\frac{E_b}{N_0}\right)_{req}[\text{dB}] - L_{sys}[\text{dB}], $$</p>
        <p>where $(E_b/N_0)_{req}$ is the demodulator requirement for the target BER and $L_{sys}$ lumps implementation losses. Example: $G_p=30$ dB, required $E_b/N_0=10$ dB, losses 2 dB give $M_j=18$ dB — the jammer can be 18 dB stronger than the signal at the receiver and the link still closes.</p>
        <p>This is the entire economic case for DSSS data extraction: the despread-integrate stage is what converts the transmit-side bandwidth expansion into a real, quantifiable margin against a hostile transmitter. Broadband barrage and narrowband tone jammers are both diluted; only a jammer that captures or repeats the exact code (a follower jammer) defeats the gain, which is why code secrecy and long codes matter.</p>`
      },
      {
        h: 'Beyond one code per bit: coherent accumulation and RAKE',
        html: String.raw`<p>Real systems generalize the single despread-integrate in two directions.</p>
        <p><strong>Multiple codes / longer accumulation:</strong> when the code period is shorter than a bit, several code periods are coherently accumulated per bit; when data rate is very low (as in GPS nav data at 50 bps), thousands of chips and many code repetitions are summed to build enough bit energy. Coherent accumulation multiplies amplitude by the number of samples while noise power grows linearly — the same $N$-vs-$\sqrt N$ advantage extended over longer integration, limited only by carrier-phase coherence time and residual Doppler.</p>
        <p><strong>RAKE receiver:</strong> in a multipath channel the wideband DSSS signal resolves echoes separated by more than one chip ($>T_c$). A RAKE assigns a despread-integrate "finger" to each resolvable path delay, then combines the finger outputs (maximal-ratio combining) before the decision. Each finger is an independent DSSS data extractor locked to a different delay; combining them turns delay spread from a source of fading into a source of diversity gain. The decision statistic becomes a weighted sum of per-finger despread integrals, but the underlying operation in every finger is exactly the despread-and-dump described here.</p>
        <div class="callout"><strong>Same primitive, repeated:</strong> whether it is one code per bit, many code periods accumulated, or several RAKE fingers combined, the atomic operation is always "multiply by the aligned replica and integrate." Extraction is that primitive, applied and summed.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>This topic is where the DSSS chain finally delivers bits. You should now be able to say:</p>
        <ul>
          <li><strong>The pipeline:</strong> after lock, data extraction is despread &rarr; integrate-and-dump &rarr; decide (sign) &rarr; FEC decode; each stage undoes one modulation or cleans up the statistic.</li>
          <li><strong>Despreading is correlation:</strong> multiplying by the aligned $c(t)$ works because $c^2(t)=1$, collapsing the signal to $R_b$ while spreading any uncoded interferer to $R_c$ and leaving white noise white.</li>
          <li><strong>The decision statistic</strong> $z=\int_0^{T_b} r(t)c(t)\,dt$ is a matched filter / coherent sum of $N$ chips; signal adds as $N$, noise as $\sqrt N$, building $E_b=P T_b$.</li>
          <li><strong>The output-SNR gain</strong> $\mathrm{SNR}_{out}=N\,\mathrm{SNR}_{in}$, $G_p=10\log_{10}N$, applies to interference — not to white noise.</li>
          <li><strong>The no-free-lunch rule:</strong> in pure AWGN, $E_b/N_0=(C/N_0)/R_b$ and $\mathrm{BER}=Q(\sqrt{2E_b/N_0})$ — identical to plain BPSK; processing gain buys jam/interference/LPI margin, not AWGN gain.</li>
          <li><strong>The payoff:</strong> jamming margin $M_j=G_p-(E_b/N_0)_{req}-L_{sys}$ quantifies how much stronger a jammer can be and still lose, and RAKE combining applies the same despread-and-dump primitive per multipath finger.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Direct-sequence_spread_spectrum" target="_blank" rel="noopener">Wikipedia — Direct-sequence spread spectrum</a> — canonical overview that frames despreading as a correlation of the received signal with the aligned code and states the SNR-by-spreading-factor result.</li>
<li><a href="https://www.dspguide.com/ch7/3.htm" target="_blank" rel="noopener">The Scientist and Engineer's Guide to DSP (Smith) — Correlation as optimal detection</a> — clearest first-principles treatment of why correlation / matched filtering is the optimal way to pull a known waveform out of noise, exactly the integrate-and-dump statistic used here.</li>
<li><a href="https://gssc.esa.int/navipedia/index.php/CDMA_FDMA_Techniques" target="_blank" rel="noopener">ESA Navipedia — CDMA/FDMA Techniques</a> — authoritative GNSS reference on PRN-code correlation and despreading in real receivers, tying the primitive to GPS-style data recovery below the noise floor.</li>
<li><a href="https://www.qsl.net/n9zia/AN9633.pdf" target="_blank" rel="noopener">Intersil AN9633 — Processing Gain for DSSS Communication Systems</a> — vendor application note that works the processing-gain and jamming-margin budget in engineering dB terms, matching this topic's anti-jam payoff.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Data extraction runs only after lock: despread with the aligned PN replica, integrate over $T_b$, decide by sign, then FEC-decode.`,
      String.raw`Transmit model $s(t)=\sqrt{2P}\,d(t)c(t)\cos(2\pi f_c t)$; chips per bit $N=T_b/T_c=R_c/R_b$ equals the processing gain.`,
      String.raw`Despreading uses $c^2(t)=1$: the signal collapses to bandwidth $R_b$ while uncoded interference is spread to $R_c$.`,
      String.raw`Decision statistic $z=\int_0^{T_b} r(t)c(t)\,dt$ is an integrate-and-dump matched filter forming the bit metric.`,
      String.raw`Over $N$ chips the coherent signal adds $\propto N$ while noise adds $\propto\sqrt N$, building bit energy $E_b=P\,T_b$.`,
      String.raw`Coherent BPSK bit decision is $\hat d=\operatorname{sgn}(z)$ using the Costas prompt in-phase arm.`,
      String.raw`Output SNR $=N\times$ input SNR against interference; $G_p[\text{dB}]=10\log_{10}(R_c/R_b)$.`,
      String.raw`White noise stays white under $\pm1$ multiplication, so despreading gives no SNR gain against thermal noise.`,
      String.raw`In AWGN, $E_b/N_0=(C/N_0)/R_b$ and $\mathrm{BER}=Q(\sqrt{2E_b/N_0})$ — identical to plain BPSK at the same $E_b/N_0$.`,
      String.raw`CRUCIAL: processing gain buys interference/jamming resistance and LPI, NOT AWGN BER improvement.`,
      String.raw`A CW jammer of power $J$ is diluted to $\approx J/N$ in the data band after despreading.`,
      String.raw`Jamming margin $M_j=G_p-(E_b/N_0)_{req}-L_{sys}$ (dB) is the practical anti-jam payoff.`,
      String.raw`Soft outputs (the value of $z$) feed soft-decision FEC for roughly 2 dB extra over hard slicing.`,
      String.raw`A RAKE receiver runs one despread-and-dump finger per resolvable multipath ($>T_c$) and combines them (MRC).`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="dsss-data-extraction-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Data-extraction pipeline: despread, integrate, decide, decode</text>
<line x1="12" y1="90" x2="60" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#dsss-data-extraction-a1)"/>
<text x="10" y="82" fill="#9aa7b5" font-size="10">$r(t)$</text>
<circle cx="80" cy="90" r="15" fill="#1c232e" stroke="#4dabf7" stroke-width="1.6"/>
<text x="73" y="95" fill="#ffa94d" font-size="15">$\times$</text>
<rect x="52" y="140" width="120" height="26" fill="#1c232e" stroke="#b197fc" stroke-width="1.4"/>
<text x="62" y="157" fill="#e6edf3" font-size="9">aligned PN $c(t)$</text>
<line x1="80" y1="140" x2="80" y2="106" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#dsss-data-extraction-a1)"/>
<text x="30" y="180" fill="#9aa7b5" font-size="8">from tracking</text>
<line x1="95" y1="90" x2="150" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#dsss-data-extraction-a1)"/>
<text x="98" y="82" fill="#63e6be" font-size="8">despread</text>
<rect x="150" y="70" width="72" height="40" fill="#1c232e" stroke="#ffa94d" stroke-width="1.5"/>
<text x="160" y="88" fill="#e6edf3" font-size="10">$\int_0^{T_b}$</text>
<text x="158" y="103" fill="#9aa7b5" font-size="8">dump</text>
<line x1="222" y1="90" x2="278" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#dsss-data-extraction-a1)"/>
<text x="230" y="82" fill="#9aa7b5" font-size="9">$z$</text>
<rect x="278" y="70" width="70" height="40" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.5"/>
<text x="288" y="88" fill="#e6edf3" font-size="10">sgn(z)</text>
<text x="288" y="103" fill="#9aa7b5" font-size="8">decide</text>
<line x1="348" y1="90" x2="404" y2="90" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#dsss-data-extraction-a1)"/>
<text x="356" y="82" fill="#9aa7b5" font-size="9">$\hat d$</text>
<rect x="404" y="70" width="120" height="40" fill="#1c232e" stroke="#63e6be" stroke-width="1.5"/>
<text x="414" y="88" fill="#e6edf3" font-size="9">FEC decode /</text>
<text x="414" y="103" fill="#e6edf3" font-size="9">descramble</text>
<line x1="464" y1="130" x2="464" y2="112" stroke="#9aa7b5" stroke-width="1.1"/>
<text x="360" y="235" fill="#9aa7b5" font-size="10">Signal collapses to $R_b$; interference spreads to $R_c$; sign of $z$ is the bit.</text>
<rect x="60" y="205" width="14" height="14" fill="#4dabf7" opacity="0.7"/><text x="80" y="216" fill="#9aa7b5" font-size="9">multiply</text>
<rect x="150" y="205" width="14" height="14" fill="#ffa94d" opacity="0.7"/><text x="170" y="216" fill="#9aa7b5" font-size="9">integrate</text>
<rect x="250" y="205" width="14" height="14" fill="#ff6b6b" opacity="0.7"/><text x="270" y="216" fill="#9aa7b5" font-size="9">decide</text>
</svg>`,
        caption: 'The data-extraction pipeline after lock: the received signal is multiplied by the phase-aligned PN replica (despreading), integrated and dumped over each bit period Tb (matched filter), sign-detected to recover the bit, and passed to FEC decode and descrambling.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="250" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Bandwidth collapse: signal re-concentrates, jammer spreads</text>
<line x1="40" y1="210" x2="520" y2="210" stroke="#9aa7b5" stroke-width="1"/>
<line x1="40" y1="210" x2="40" y2="45" stroke="#9aa7b5" stroke-width="1"/>
<text x="500" y="226" fill="#9aa7b5" font-size="10">freq</text>
<text x="8" y="60" fill="#9aa7b5" font-size="10">PSD</text>
<text x="120" y="40" fill="#4dabf7" font-size="11">before despread</text>
<rect x="70" y="160" width="380" height="50" fill="#4dabf7" opacity="0.30"/>
<text x="150" y="152" fill="#4dabf7" font-size="9">spread signal (wide, low PSD, $\sim R_c$)</text>
<rect x="250" y="90" width="22" height="120" fill="#ff6b6b" opacity="0.75"/>
<text x="276" y="98" fill="#ff6b6b" font-size="9">CW jammer (narrow, high)</text>
<text x="330" y="40" fill="#63e6be" font-size="11">after despread</text>
<rect x="255" y="70" width="26" height="140" fill="#63e6be" opacity="0.75"/>
<text x="286" y="70" fill="#63e6be" font-size="9">signal to $R_b$ (narrow, high)</text>
<rect x="70" y="188" width="380" height="22" fill="#ff6b6b" opacity="0.30"/>
<text x="300" y="182" fill="#ff6b6b" font-size="9">jammer spread to $R_c$ ($\times 1/N$ in band)</text>
<text x="60" y="240" fill="#9aa7b5" font-size="10">Despreading swaps the roles: the coded signal narrows, the uncoded jammer widens and is diluted by N.</text>
</svg>`,
        caption: 'Bandwidth collapse. Before despreading the signal is wide with low PSD and a CW jammer is a tall narrow spike. After despreading the signal re-concentrates into the data bandwidth Rb while the jammer is spread across Rc, so only about 1/N of its power lands in the decision band.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="250" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">AWGN BER: DSSS despread output equals plain BPSK</text>
<line x1="60" y1="200" x2="510" y2="200" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="60" y1="200" x2="60" y2="45" stroke="#9aa7b5" stroke-width="1.2"/>
<text x="470" y="218" fill="#9aa7b5" font-size="10">$E_b/N_0$ (dB)</text>
<text x="16" y="55" fill="#9aa7b5" font-size="10">BER</text>
<text x="70" y="60" fill="#9aa7b5" font-size="9">$10^{-1}$</text>
<text x="70" y="120" fill="#9aa7b5" font-size="9">$10^{-3}$</text>
<text x="70" y="185" fill="#9aa7b5" font-size="9">$10^{-6}$</text>
<path d="M100,60 C180,72 260,110 340,160 C380,182 420,192 490,197" fill="none" stroke="#63e6be" stroke-width="2.4"/>
<path d="M100,64 C180,76 260,114 340,164 C380,186 424,195 490,199" fill="none" stroke="#4dabf7" stroke-width="1.6" stroke-dasharray="6 4"/>
<circle cx="330" cy="152" r="4" fill="#ffa94d"/>
<text x="336" y="148" fill="#ffa94d" font-size="9">same curve</text>
<text x="140" y="95" fill="#63e6be" font-size="10">DSSS after despread</text>
<text x="140" y="112" fill="#4dabf7" font-size="10">plain BPSK (dashed, coincident)</text>
<text x="200" y="238" fill="#9aa7b5" font-size="10">Processing gain gives NO AWGN gain — the two curves lie on top of each other.</text>
</svg>`,
        caption: 'Over a pure AWGN channel the despread DSSS BER curve lies exactly on top of the plain-BPSK curve at the same Eb/N0. Processing gain buys jamming, interference, and LPI margin — not thermal-noise performance — so the two curves are indistinguishable.'
      }
    ],
    equations: [
      {
        title: 'Despread decision statistic',
        tex: String.raw`$$ z=\int_0^{T_b} r(t)\,c(t)\,dt = \sqrt{2P}\,d\,T_b + \int_0^{T_b} n(t)c(t)\,dt $$`,
        derivation: String.raw`<p><b>Where we start.</b> After lock the in-phase received signal over one bit is $r(t)=\sqrt{2P}\,d\,c(t)+n(t)$, with $d\in\{+1,-1\}$ constant over $[0,T_b]$, $c(t)=\pm1$ the aligned PN code, and $n(t)$ AWGN. The optimal statistic for a rectangular data pulse is the matched filter = correlate against the despreading code and integrate over the bit.</p>
<p><b>Step 1.</b> Multiply the received signal by the time-aligned replica $c(t)$ (despreading): $r(t)c(t)=\sqrt{2P}\,d\,c^2(t)+n(t)c(t)$. Since $c(t)=\pm1$, $c^2(t)=1$, so the signal term becomes $\sqrt{2P}\,d$ — the code has been stripped and the bandwidth collapsed to the data rate.</p>
<p><b>Step 2.</b> Integrate over the bit interval: $z=\int_0^{T_b}[\sqrt{2P}\,d+n(t)c(t)]\,dt=\sqrt{2P}\,d\int_0^{T_b}dt+\int_0^{T_b}n(t)c(t)\,dt$. The deterministic signal integral is simply $\sqrt{2P}\,d\,T_b$.</p>
<p><b>Result.</b> $z=\sqrt{2P}\,d\,T_b+\nu$, where $\nu=\int_0^{T_b}n(t)c(t)\,dt$ is zero-mean Gaussian. The signal part is a clean $\pm\sqrt{2P}\,T_b$ proportional to the bit, so the sign of $z$ recovers $d$. This integrate-and-dump is the matched filter that maximizes SNR at the sampling instant.</p>`
      },
      {
        title: 'Chips per bit / processing gain',
        tex: String.raw`$$ N=\frac{T_b}{T_c}=\frac{R_c}{R_b} $$`,
        derivation: String.raw`<p><b>Where we start.</b> One data bit occupies duration $T_b=1/R_b$; one PN chip occupies duration $T_c=1/R_c$. The code runs much faster than the data, $R_c\gg R_b$, so an integer number of whole chips fits inside each bit.</p>
<p><b>Step 1.</b> Count the chips inside a bit by dividing the bit duration by the chip duration: $N=T_b/T_c$. This is the number of $\pm1$ chips the despreader coherently sums for one bit decision.</p>
<p><b>Step 2.</b> Convert durations to rates using $T_b=1/R_b$ and $T_c=1/R_c$: $N=(1/R_b)/(1/R_c)=R_c/R_b$. So chips-per-bit equals the chip-rate-to-bit-rate ratio.</p>
<p><b>Result.</b> $N=T_b/T_c=R_c/R_b$ is simultaneously the spreading factor and the processing gain. It sets both how many chips are accumulated per bit and, in dB, how much interference suppression despreading delivers — one number governs the whole extraction budget.</p>`
      },
      {
        title: 'Output SNR gain from despreading',
        tex: String.raw`$$ \mathrm{SNR}_{out}=N\cdot \mathrm{SNR}_{in} $$`,
        derivation: String.raw`<p><b>Where we start.</b> Before despreading the wanted signal has power $S$ spread over the chip bandwidth $\sim R_c$, and a narrowband interferer has power $J$ concentrated in a bandwidth $\ll R_c$. The input signal-to-interference ratio is $\mathrm{SNR}_{in}=S/J$ measured over the wide band.</p>
<p><b>Step 1.</b> Despreading multiplies everything by the aligned code $c(t)$. The signal, being coded identically, re-concentrates into the data bandwidth $R_b$ with its power $S$ preserved (correlation of a waveform with itself).</p>
<p><b>Step 2.</b> The uncoded interferer is multiplied by the fast code and thereby spread across $\sim R_c$. Only the fraction of its power falling in the post-correlation data band $R_b$ affects the decision: $J_{eff}\approx J\,(R_b/R_c)=J/N$.</p>
<p><b>Result.</b> The output ratio is $\mathrm{SNR}_{out}=S/J_{eff}=S/(J/N)=N\,(S/J)=N\cdot\mathrm{SNR}_{in}$. The signal is preserved while the interferer is diluted by $N$, so the ratio improves by exactly the processing gain — the mechanism applies to interference, not to white noise.</p>`
      },
      {
        title: 'Processing gain in dB',
        tex: String.raw`$$ G_p[\text{dB}]=10\log_{10} N=10\log_{10}\!\left(\frac{R_c}{R_b}\right) $$`,
        derivation: String.raw`<p><b>Where we start.</b> From the output-SNR result, despreading multiplies the signal-to-interference ratio by the linear factor $N=R_c/R_b$. Engineering budgets are done in decibels, so we express this factor logarithmically.</p>
<p><b>Step 1.</b> The decibel value of any power ratio $X$ is $10\log_{10}X$. Apply this to the SNR-improvement factor $N$: $G_p[\text{dB}]=10\log_{10}N$.</p>
<p><b>Step 2.</b> Substitute $N=R_c/R_b$ to express the gain directly from the two clock rates: $G_p[\text{dB}]=10\log_{10}(R_c/R_b)$. For example $R_c=10$ Mcps, $R_b=10$ kbps gives $N=1000$ and $G_p=30$ dB.</p>
<p><b>Result.</b> $G_p[\text{dB}]=10\log_{10}(R_c/R_b)$ converts the chip-to-bit rate ratio into a decibel margin. This is the number quoted in link and jamming budgets, and it is the interference-suppression figure, not an AWGN improvement.</p>`
      },
      {
        title: 'Post-despread Eb/N0 from C/N0',
        tex: String.raw`$$ \frac{E_b}{N_0}=\frac{C/N_0}{R_b} $$`,
        derivation: String.raw`<p><b>Where we start.</b> The received carrier power is $C$ and the one-sided noise power spectral density is $N_0$ (watts/Hz). The energy per bit is the received power multiplied by the time spent per bit, $E_b=C\,T_b$.</p>
<p><b>Step 1.</b> Substitute $T_b=1/R_b$: $E_b=C/R_b$. This is the coherent accumulation the integrate-and-dump performs — collecting the carrier power for a bit duration builds the bit energy.</p>
<p><b>Step 2.</b> Divide by the noise density $N_0$ to form the normalized ratio the demodulator cares about: $E_b/N_0=(C/R_b)/N_0=(C/N_0)/R_b$. Note $C/N_0$ is a rate (dB-Hz) and dividing by $R_b$ (Hz) yields a dimensionless ratio.</p>
<p><b>Result.</b> $E_b/N_0=(C/N_0)/R_b$. Crucially the chip rate $R_c$ does not appear: spreading and despreading cancel for white noise, so only the data rate $R_b$ sets the thermal-noise $E_b/N_0$ — the basis of the "no AWGN gain" result.</p>`
      },
      {
        title: 'Coherent BPSK bit-error rate',
        tex: String.raw`$$ \mathrm{BER}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right) $$`,
        derivation: String.raw`<p><b>Where we start.</b> The passband signal over one bit is $s(t)=\sqrt{2P}\,d\,\cos(2\pi f_c t)$ (code already stripped, $d=\pm1$), in AWGN of two-sided density $N_0/2$. Coherent demodulation multiplies by the reference $\cos(2\pi f_c t)$ and integrates over $[0,T_b]$; the decision is $\hat d=\operatorname{sgn}(z)$.</p>
<p><b>Step 1: signal at the sampler.</b> Multiplying the signal by $\cos(2\pi f_c t)$ and integrating uses $\cos^2(2\pi f_c t)=\tfrac12(1+\cos 4\pi f_c t)$; the double-frequency term averages to zero, leaving mean $a=\sqrt{2P}\,d\cdot\tfrac12 T_b=\tfrac{1}{\sqrt2}\sqrt{P}\,T_b$ in magnitude. An error occurs when noise crosses zero, so $\mathrm{BER}=Q(a/\sigma)$.</p>
<p><b>Step 2: noise at the sampler.</b> The demodulated noise is $\nu=\int_0^{T_b} n(t)\cos(2\pi f_c t)\,dt$, zero-mean Gaussian with variance $\sigma^2=(N_0/2)\int_0^{T_b}\cos^2(2\pi f_c t)\,dt=(N_0/2)(T_b/2)=N_0 T_b/4$. Form the ratio with $E_b=P\,T_b$: $$ \frac{a^2}{\sigma^2}=\frac{\tfrac12 P\,T_b^2}{N_0 T_b/4}=\frac{2P\,T_b}{N_0}=\frac{2E_b}{N_0}. $$</p>
<p><b>Result.</b> $a/\sigma=\sqrt{2E_b/N_0}$, hence $\mathrm{BER}=Q(\sqrt{2E_b/N_0})$. This is exactly the plain-BPSK expression: after despreading, DSSS in AWGN performs identically to BPSK at the same $E_b/N_0$, confirming processing gain gives no thermal-noise advantage.</p>`
      },
      {
        title: 'Jamming margin',
        tex: String.raw`$$ M_j[\text{dB}]=G_p[\text{dB}]-\left(\frac{E_b}{N_0}\right)_{req}[\text{dB}]-L_{sys}[\text{dB}] $$`,
        derivation: String.raw`<p><b>Where we start.</b> A jammer of received power $J$ competes with signal power $S$. Despreading spreads the uncoded jammer over the chip bandwidth so only $\sim 1/N$ of its power reaches the decision, while the demodulator still needs a minimum $(E_b/N_0)_{req}$ to hit the target BER.</p>
<p><b>Step 1.</b> After despreading the effective jammer-to-signal ratio at the decision is reduced by the processing gain $G_p$. Written in dB, the suppression available to fight the jammer is $G_p[\text{dB}]$ decibels of headroom.</p>
<p><b>Step 2.</b> From that headroom, subtract what the demodulator must keep to close the link, $(E_b/N_0)_{req}$, and subtract implementation/system losses $L_{sys}$ (filtering, quantization, imperfect sync). What remains is the tolerable jammer-to-signal excess.</p>
<p><b>Result.</b> $M_j=G_p-(E_b/N_0)_{req}-L_{sys}$ (dB) is the jamming margin: the number of dB by which the jammer may exceed the signal at the receiver while the link still closes. Example $30-10-2=18$ dB. This is the concrete payoff of the whole DSSS extraction chain.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What are the four stages of DSSS data extraction after lock?`, back: String.raw`Despread (multiply by aligned PN), integrate-and-dump over $T_b$ (matched filter), decide (sign of $z$), then FEC decode / descramble.` },
      { front: String.raw`Write the DSSS BPSK transmit model.`, back: String.raw`$s(t)=\sqrt{2P}\,d(t)\,c(t)\cos(2\pi f_c t)$, with $d=\pm1$ data at $R_b$ and $c=\pm1$ chips at $R_c$.` },
      { front: String.raw`Why does multiplying by the local code despread the signal?`, back: String.raw`Because $c(t)=\pm1$ so $c^2(t)=1$; the code term cancels and the wideband signal collapses back to the narrowband data.` },
      { front: String.raw`Give the despread decision statistic.`, back: String.raw`$z=\int_0^{T_b} r(t)\,c(t)\,dt$ — an integrate-and-dump matched filter over one bit.` },
      { front: String.raw`How is the coherent BPSK bit decided?`, back: String.raw`$\hat d=\operatorname{sgn}(z)$, using the Costas prompt in-phase arm phase-aligned to the carrier.` },
      { front: String.raw`How does signal vs noise accumulate over $N$ chips?`, back: String.raw`Signal amplitude adds coherently ($\propto N$); noise adds in power ($\propto\sqrt N$), so the statistic separates and $E_b=P T_b$ builds up.` },
      { front: String.raw`Chips per bit $N$ in terms of rates and times?`, back: String.raw`$N=T_b/T_c=R_c/R_b$; it equals the processing gain.` },
      { front: String.raw`What is the output-SNR gain of despreading against interference?`, back: String.raw`$\mathrm{SNR}_{out}=N\cdot\mathrm{SNR}_{in}$; in dB $G_p=10\log_{10}N$.` },
      { front: String.raw`Does despreading improve SNR against white thermal noise?`, back: String.raw`No. White noise stays white under $\pm1$ multiplication, so there is no AWGN gain — only interference/jamming suppression.` },
      { front: String.raw`Relate $E_b/N_0$ to $C/N_0$ and $R_b$.`, back: String.raw`$E_b/N_0=(C/N_0)/R_b$; the chip rate does not appear.` },
      { front: String.raw`What is the coherent BPSK BER after despreading?`, back: String.raw`$\mathrm{BER}=Q(\sqrt{2E_b/N_0})$ — identical to plain BPSK.` },
      { front: String.raw`The single most-tested DSSS fact about AWGN?`, back: String.raw`In pure AWGN, spread-then-despread gives the SAME BER as plain BPSK at equal $E_b/N_0$; gain is against interference, not noise.` },
      { front: String.raw`How much of a CW jammer's power survives despreading in the data band?`, back: String.raw`About $1/N$ of it; the jammer is spread over $R_c$ so only the fraction $R_b/R_c$ lands in the decision band.` },
      { front: String.raw`State the jamming-margin formula.`, back: String.raw`$M_j=G_p-(E_b/N_0)_{req}-L_{sys}$ (dB).` },
      { front: String.raw`Why forward soft $z$ instead of just the hard bit?`, back: String.raw`Soft outputs preserve reliability for soft-decision FEC, buying roughly 2 dB over hard slicing.` },
      { front: String.raw`What does each RAKE finger do?`, back: String.raw`Runs an independent despread-and-dump locked to one resolvable multipath delay ($>T_c$); the fingers are combined by maximal-ratio combining.` }
    ],
    mcqs: [
      { q: String.raw`In DSSS data extraction, despreading is performed by:`, options: [String.raw`filtering out the carrier only`, String.raw`multiplying the received signal by the time-aligned local PN replica`, String.raw`squaring the received signal`, String.raw`dividing by the data rate`], answer: 1, explain: String.raw`Despreading multiplies $r(t)$ by the aligned code $c(t)$; since $c^2(t)=1$ the signal collapses back to the data bandwidth.` },
      { q: String.raw`The despread decision statistic is:`, options: [String.raw`$z=\int_0^{T_b} r(t)\,c(t)\,dt$`, String.raw`$z=\int_0^{T_c} r(t)\,dt$`, String.raw`$z=r(T_b)$`, String.raw`$z=\max_t r(t)$`], answer: 0, explain: String.raw`It is an integrate-and-dump matched filter: correlate against the code and integrate over one bit.` },
      { q: String.raw`Chips per bit $N$ equals:`, options: [String.raw`$R_b/R_c$`, String.raw`$R_c/R_b=T_b/T_c$`, String.raw`$R_c R_b$`, String.raw`$T_c/T_b$`], answer: 1, explain: String.raw`$N=T_b/T_c=R_c/R_b$, which also equals the processing gain.` },
      { q: String.raw`After despreading, the wanted signal bandwidth is approximately:`, options: [String.raw`$R_c$`, String.raw`$R_b$`, String.raw`$R_c+R_b$`, String.raw`zero`], answer: 1, explain: String.raw`Despreading re-concentrates the signal from the chip bandwidth $R_c$ back to the data bandwidth $R_b$.` },
      { q: String.raw`Over a pure AWGN channel, DSSS with processing gain $G_p$ has a BER that is:`, options: [String.raw`$G_p$ dB better than plain BPSK`, String.raw`the same as plain BPSK at the same $E_b/N_0$`, String.raw`$G_p$ dB worse than plain BPSK`, String.raw`always zero`], answer: 1, explain: String.raw`White noise stays white under despreading, so AWGN BER equals plain BPSK; $G_p$ buys interference/jam margin, not noise gain.` },
      { q: String.raw`The output SNR against a narrowband interferer after despreading is:`, options: [String.raw`$\mathrm{SNR}_{in}/N$`, String.raw`$N\cdot\mathrm{SNR}_{in}$`, String.raw`$\sqrt N\cdot\mathrm{SNR}_{in}$`, String.raw`unchanged`], answer: 1, explain: String.raw`The signal is preserved while the interferer is diluted by $N$, so the ratio improves by the processing gain $N$.` },
      { q: String.raw`Which relation gives $E_b/N_0$ from the carrier-to-noise-density ratio?`, options: [String.raw`$E_b/N_0=(C/N_0)\cdot R_b$`, String.raw`$E_b/N_0=(C/N_0)/R_b$`, String.raw`$E_b/N_0=(C/N_0)/R_c$`, String.raw`$E_b/N_0=C/N_0$`], answer: 1, explain: String.raw`$E_b=C T_b=C/R_b$, so $E_b/N_0=(C/N_0)/R_b$; the chip rate does not appear.` },
      { q: String.raw`The coherent BPSK bit-error rate is:`, options: [String.raw`$Q(\sqrt{E_b/N_0})$`, String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$Q(2E_b/N_0)$`], answer: 1, explain: String.raw`Antipodal BPSK gives $\mathrm{BER}=Q(\sqrt{2E_b/N_0})$, unchanged by despreading in AWGN.` },
      { q: String.raw`A CW jammer of power $J$ after despreading contributes to the data band approximately:`, options: [String.raw`$J$`, String.raw`$J/N$`, String.raw`$N J$`, String.raw`$\sqrt{J}$`], answer: 1, explain: String.raw`The jammer is spread over $R_c$, so only the fraction $R_b/R_c=1/N$ lands in the decision band.` },
      { q: String.raw`The jamming margin is given by:`, options: [String.raw`$M_j=G_p+(E_b/N_0)_{req}+L_{sys}$`, String.raw`$M_j=G_p-(E_b/N_0)_{req}-L_{sys}$`, String.raw`$M_j=(E_b/N_0)_{req}-G_p$`, String.raw`$M_j=G_p\cdot(E_b/N_0)_{req}$`], answer: 1, explain: String.raw`Available suppression $G_p$ minus the demod requirement and system losses gives the tolerable jammer excess.` },
      { q: String.raw`Coherent DSSS demodulation typically uses the:`, options: [String.raw`Costas-loop prompt in-phase (I) arm`, String.raw`quadrature (Q) arm only`, String.raw`envelope detector`, String.raw`early-late gate output`], answer: 0, explain: String.raw`The Costas loop aligns the carrier phase so the data lands on I; the sign of the I accumulation is the bit.` },
      { q: String.raw`Forwarding the soft value of $z$ (not just its sign) to the decoder:`, options: [String.raw`has no benefit`, String.raw`enables soft-decision FEC for roughly 2 dB gain`, String.raw`increases the BER`, String.raw`removes the need for tracking`], answer: 1, explain: String.raw`Soft decisions preserve reliability information, letting a soft-decision decoder recover about 2 dB over hard slicing.` },
      { q: String.raw`When the carrier phase cannot be tracked cleanly, extraction may instead use:`, options: [String.raw`differential (non-coherent) DBPSK detection`, String.raw`a longer chip period`, String.raw`no integration`, String.raw`frequency hopping`], answer: 0, explain: String.raw`DBPSK tolerates residual phase error at a cost of roughly 1-3 dB versus coherent detection.` },
      { q: String.raw`A RAKE receiver improves multipath performance by:`, options: [String.raw`ignoring all but the strongest path`, String.raw`running a despread-and-dump finger per resolvable path and combining them`, String.raw`increasing the data rate`, String.raw`removing the PN code`], answer: 1, explain: String.raw`Each finger despreads a distinct delay ($>T_c$) and the outputs are combined (MRC) for diversity gain.` }
    ],
    numericals: [
      {
        q: String.raw`A DSSS link uses chip rate $R_c=5$ Mcps and data rate $R_b=20$ kbps. Find the chips per bit $N$ and the processing gain $G_p$ in dB.`,
        solution: String.raw`<p><b>Formula.</b> $$ N=\frac{R_c}{R_b},\qquad G_p[\text{dB}]=10\log_{10} N, $$ where $R_c$ is the chip rate (chips/s), $R_b$ the data rate (bits/s), $N$ the chips per bit, and $G_p$ the processing gain.</p>
<p><b>Substitute.</b> $$ N=\frac{5\times10^6}{20\times10^3},\qquad G_p=10\log_{10}(250). $$</p>
<p><b>Compute.</b> $N=250$; $\log_{10}250=2.398$, so $G_p=10\times2.398=\mathbf{24.0\ \text{dB}}$.</p>
<p><b>Explanation.</b> Each data bit is spread over 250 chips, so the despreader coherently sums 250 chip votes per bit and delivers 24.0 dB of interference suppression. This 24 dB is anti-jam/interference margin, not an improvement against thermal noise.</p>`
      },
      {
        q: String.raw`The input signal-to-interference ratio at the despreader input is $-8$ dB. With a processing gain $G_p=24$ dB, find the output SNR against that interferer.`,
        solution: String.raw`<p><b>Formula.</b> $$ \mathrm{SNR}_{out}[\text{dB}]=\mathrm{SNR}_{in}[\text{dB}]+G_p[\text{dB}], $$ since $\mathrm{SNR}_{out}=N\cdot\mathrm{SNR}_{in}$ and multiplication becomes addition in dB.</p>
<p><b>Substitute.</b> $$ \mathrm{SNR}_{out}=-8+24. $$</p>
<p><b>Compute.</b> $\mathrm{SNR}_{out}=\mathbf{16\ \text{dB}}$.</p>
<p><b>Explanation.</b> Despreading lifts a signal that sat 8 dB below the interferer to 16 dB above it — a 24 dB swing equal to the processing gain. This is exactly how DSSS recovers a signal buried under narrowband interference, and it is why the signal can start below the interferer yet still be demodulated.</p>`
      },
      {
        q: String.raw`A DSSS receiver has $C/N_0=57$ dB-Hz and data rate $R_b=20$ kbps. Find $E_b/N_0$ in dB.`,
        solution: String.raw`<p><b>Formula.</b> $$ \frac{E_b}{N_0}[\text{dB}]=\frac{C}{N_0}[\text{dB-Hz}]-10\log_{10}R_b, $$ from $E_b/N_0=(C/N_0)/R_b$ expressed in decibels.</p>
<p><b>Substitute.</b> $$ \frac{E_b}{N_0}=57-10\log_{10}(20\,000). $$</p>
<p><b>Compute.</b> $\log_{10}(20\,000)=4.301$, so $10\log_{10}R_b=43.0$ dB-Hz; $E_b/N_0=57-43.0=\mathbf{14.0\ \text{dB}}$.</p>
<p><b>Explanation.</b> The receiver delivers 14.0 dB of $E_b/N_0$ to the decision device. Note the chip rate never entered the calculation: despreading is a lossless round trip for white noise, so only the data rate sets the thermal-noise $E_b/N_0$.</p>`
      },
      {
        q: String.raw`Continuing the previous link, with $E_b/N_0=14.0$ dB find the coherent BPSK bit-error rate.`,
        solution: String.raw`<p><b>Formula.</b> $$ \mathrm{BER}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right), $$ where $E_b/N_0$ is used as a linear ratio and $Q$ is the Gaussian tail probability.</p>
<p><b>Substitute.</b> Convert to linear: $E_b/N_0=10^{14.0/10}=25.1$. Argument $=\sqrt{2\times25.1}=\sqrt{50.2}=7.09$; so $\mathrm{BER}=Q(7.09)$.</p>
<p><b>Compute.</b> $Q(7.09)\approx\mathbf{6.8\times10^{-13}}$.</p>
<p><b>Explanation.</b> At 14 dB the coherent BPSK link is essentially error-free (well below $10^{-12}$). This is identical to what plain BPSK would give at the same $E_b/N_0$: the processing gain has not changed the AWGN BER at all, only the interference robustness.</p>`
      },
      {
        q: String.raw`A DSSS system has processing gain $G_p=27$ dB, required $E_b/N_0=9$ dB for the target BER, and system losses $L_{sys}=2$ dB. Find the jamming margin.`,
        solution: String.raw`<p><b>Formula.</b> $$ M_j[\text{dB}]=G_p-\left(\frac{E_b}{N_0}\right)_{req}-L_{sys}, $$ the processing gain left over after paying the demod requirement and implementation losses.</p>
<p><b>Substitute.</b> $$ M_j=27-9-2. $$</p>
<p><b>Compute.</b> $M_j=\mathbf{16\ \text{dB}}$.</p>
<p><b>Explanation.</b> A jammer may be up to 16 dB stronger than the signal at the receiver and the link still closes. This margin is the concrete, quantified payoff of the despread-and-integrate extraction stage — the reason the transmit-side bandwidth expansion was worth its cost.</p>`
      },
      {
        q: String.raw`A DSSS transmitter runs at chip rate $R_c=8$ Mcps and must guarantee a processing gain of at least $G_p=30$ dB. What is the maximum usable data rate $R_b$?`,
        solution: String.raw`<p><b>Formula.</b> $$ N=10^{G_p/10},\qquad R_b=\frac{R_c}{N}, $$ where $N$ is the required linear processing gain and $R_b$ the largest data rate that still meets it.</p>
<p><b>Substitute.</b> $$ N=10^{30/10}=1000,\qquad R_b=\frac{8\times10^6}{1000}. $$</p>
<p><b>Compute.</b> $R_b=\mathbf{8\,000\ \text{bps}=8\ \text{kbps}}$.</p>
<p><b>Explanation.</b> To keep at least 30 dB (a factor of 1000) of processing gain at a fixed 8 Mcps chip rate, the data rate cannot exceed 8 kbps. Faster data would spread each bit over fewer chips, shrinking $N$ and the anti-jam margin — a direct rate-versus-robustness trade set entirely by $N=R_c/R_b$.</p>`
      }
    ],
    realWorld: String.raw`<p>Every fielded DSSS receiver ends in exactly this extraction stage. In GPS, once a channel has acquired a satellite's PRN code and the carrier/DLL loops are locked, the receiver despreads the 1.023 Mcps C/A code against a 50 bps navigation message, integrates over the code period and across many periods, and slices the prompt in-phase accumulation to read each nav-data bit — recovering a signal that arrives 20-30 dB below the thermal-noise floor purely through this coherent despread-and-dump. IS-95 and WCDMA cellular do the same per-user despreading with a RAKE receiver: several fingers each run an independent despread-and-integrate on a different resolvable multipath, then combine the results by maximal-ratio combining, and the soft finger outputs feed a Viterbi or turbo decoder for the final bits.</p>
    <p>The extraction stage is also where the "no free lunch in AWGN" principle bites in system design. Engineers do not size a DSSS link for AWGN gain from spreading — they size the data-rate/$E_b/N_0$ budget as if it were plain BPSK, then spend the processing gain entirely on jamming margin, low probability of intercept, and multiple-access capacity. Military tactical waveforms quote the jamming margin $M_j=G_p-(E_b/N_0)_{req}-L_{sys}$ directly as the anti-jam specification; a link that closes at 18 dB of margin tolerates a jammer 18 dB above the signal. That single number, produced by the despread-integrate-decide chain, is the practical reason the entire spread-spectrum apparatus exists.</p>`,
    related: ['dsss-acquisition', 'dsss-tracking', 'dsss', 'processing-gain', 'ber']
  }
);
