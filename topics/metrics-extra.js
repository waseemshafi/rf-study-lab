// Spread-spectrum & RF-metrics deep topics: processing gain, jamming margin, receiver sensitivity.
CONTENT.topics.push(
{
  id: 'processing-gain',
  title: 'Processing Gain',
  category: 'Spread Spectrum & Coding',
  tags: [ String.raw`spread spectrum`, String.raw`DSSS`, String.raw`correlation`, String.raw`SNR`, String.raw`pulse compression`, String.raw`GPS` ],
  summary: String.raw`Processing gain is the ratio of spread (transmitted) bandwidth to information bandwidth, quantifying how much despreading correlation raises the post-correlator SNR of a spread-spectrum or matched-filter receiver.`,
  prerequisites: [ 'dsss', 'correlation', 'matched-filter', 'eb-no' ],
  intro: String.raw`<p>Spread-spectrum systems deliberately occupy a bandwidth far larger than the information rate requires. That seems wasteful until you see what the receiver gets for it: <strong>processing gain</strong> $G_p$. When the receiver correlates the wideband received signal against a synchronized replica of the spreading code, the wanted signal collapses (despreads) back to its narrow information bandwidth and adds up <em>coherently</em>, while noise, interference and jamming — uncorrelated with the code — spread out and add up <em>incoherently</em>. The result is that the signal-to-noise ratio at the correlator output is higher than at its input by the factor $G_p$.</p>
<p>Processing gain is the single number that underpins the three headline benefits of spread spectrum: interference (and jam) rejection, low probability of intercept, and multiple access (CDMA). It is also, mathematically, the same integration/correlation gain that a matched filter delivers and that a radar earns from pulse compression. Master $G_p$ and a large part of spread-spectrum, radar and communications theory becomes one idea seen from different angles.</p>`,
  sections: [
    {
      h: 'Definition: bandwidth ratio and rate ratio',
      html: String.raw`<p>Processing gain is defined as the ratio of the <strong>spread bandwidth</strong> $W$ (the RF bandwidth actually transmitted) to the <strong>information bandwidth</strong> $R$ (roughly the data rate, or the bandwidth the message would occupy unspread):</p>
      <p>$$G_p = \frac{W}{R} = \frac{B_{ss}}{B_{info}}.$$</p>
      <p>For a <strong>direct-sequence</strong> (DSSS) system where each data bit of duration $T_b$ is multiplied by $N$ chips of duration $T_c$, the spread bandwidth is set by the chip rate $R_c = 1/T_c$ and the information bandwidth by the bit rate $R_b = 1/T_b$, so the equivalent forms are:</p>
      <p>$$G_p = \frac{R_c}{R_b} = \frac{T_b}{T_c} = N,$$</p>
      <p>where $N$ is the number of chips per bit — the <em>spreading factor</em>. In decibels:</p>
      <p>$$G_p\,[\mathrm{dB}] = 10\log_{10}\!\left(\frac{W}{R}\right).$$</p>
      <div class="callout"><strong>Watch the definitions.</strong> Some texts use null-to-null bandwidth ($W = R_c$ for BPSK chips), some use the 3 dB bandwidth, some the two-sided bandwidth. The chip-rate-to-bit-rate ratio $R_c/R_b$ is the cleanest, least ambiguous form and is what you should default to unless a problem specifies otherwise.</div>`
    },
    {
      h: 'Why despreading raises SNR: coherent vs incoherent addition',
      html: String.raw`<p>Consider a DSSS BPSK link. The transmitter sends $s(t)=d(t)c(t)$ where $d(t)\in\{\pm1\}$ is data and $c(t)\in\{\pm1\}$ is the spreading (PN) code at the chip rate. The channel adds noise/interference $n(t)$. The receiver multiplies by a synchronized code replica $c(t)$ and integrates over one bit:</p>
      <p>$$y = \int_0^{T_b} r(t)\,c(t)\,dt = \int_0^{T_b} d(t)\,\underbrace{c^2(t)}_{=1}\,dt + \int_0^{T_b} n(t)\,c(t)\,dt.$$</p>
      <p>Because $c^2(t)=1$, the <strong>signal term despreads perfectly</strong> and integrates coherently to $\pm T_b$ (amplitude grows linearly with integration time). The <strong>noise/interference term</strong> is multiplied by the pseudo-random $\pm1$ code, which whitens/spreads it; its integral grows only as $\sqrt{T_b}$ (random-walk / incoherent addition). Signal power therefore grows as $T_b^2$ while noise power grows as $T_b$, so the SNR grows linearly with the integration time — i.e. with the number of chips $N$. That factor is exactly $G_p$:</p>
      <p>$$\left(\frac{S}{N}\right)_{\text{out}} = G_p \left(\frac{S}{N}\right)_{\text{in}}.$$</p>
      <div class="callout"><strong>Key intuition.</strong> Processing gain does not create energy from nothing. Despreading concentrates the wanted signal's energy into a narrow band while forcing interference to stay wide; a narrowband post-correlation filter then keeps the signal and rejects most of the interference power. It is a redistribution — coherent vs incoherent — not a free lunch on $E_b/N_0$.</div>`
    },
    {
      h: 'Processing gain as a time-bandwidth product',
      html: String.raw`<p>A deeper and more general way to see $G_p$ is as a <strong>time-bandwidth product</strong> $TW$: the product of the coherent integration time $T$ and the signal bandwidth $W$. Any receiver that coherently integrates a signal of bandwidth $W$ for a time $T$ earns gain $TW$ over a matched-noise reference.</p>
      <ul>
        <li><strong>DSSS:</strong> $T=T_b$ (one bit), $W=R_c$, so $TW=T_b R_c = R_c/R_b = N = G_p$.</li>
        <li><strong>Radar pulse compression:</strong> a chirp of duration $\tau$ and swept bandwidth $B$ has compression gain $G_p=\tau B$; matched filtering compresses it to width $\approx1/B$ and raises peak SNR by $\tau B$.</li>
        <li><strong>Coherent integration:</strong> integrating $M$ pulses coherently gives gain $M$; over time $T=M T_{PRI}$ this again reads as a $TW$ product.</li>
      </ul>
      <p>The unifying statement: <em>processing gain = matched-filter integration gain = the time-bandwidth product of the coherent processing window.</em></p>`
    },
    {
      h: 'Relationship to the matched filter and correlation',
      html: String.raw`<p>Despreading with a code replica and integrating <em>is</em> a matched filter for the spread waveform. The matched filter maximizes output SNR, achieving $\mathrm{SNR}_{out}=2E/N_0$ regardless of waveform shape. Spreading changes the <em>shape</em> of the waveform (spreads its bandwidth) but not its energy $E=P_s T_b$; the matched filter recovers all of that energy. So:</p>
      <ul>
        <li>The <strong>despreader is a correlator</strong>: it computes $\int r(t)c(t)\,dt$, the cross-correlation of received signal with the code at zero lag.</li>
        <li>Good spreading codes have a sharp autocorrelation peak and low off-peak / cross-correlation (see <em>PN codes</em>, <em>Gold codes</em>), so the despreader locks a narrow correlation spike for the wanted user and near-zero for others.</li>
        <li>Processing gain sets the <strong>height of the correlation peak relative to the floor</strong> — the code-length $N$ determines how far the peak stands above self-noise and multi-access interference.</li>
      </ul>`
    },
    {
      h: 'What processing gain does — and does NOT — give you',
      html: String.raw`<p>A crucial exam trap: processing gain improves your resilience to interference and your ability to operate below the noise floor, but against <strong>white Gaussian noise it does not change your required $E_b/N_0$</strong>. The energy per bit and the noise density are unchanged by spreading — the matched filter already extracts full energy — so BER-vs-$E_b/N_0$ is identical to an unspread BPSK link.</p>
      <table class="data">
        <tr><th>Quantity</th><th>Effect of spreading with gain $G_p$</th></tr>
        <tr><td>$E_b/N_0$ needed for target BER</td><td>Unchanged (spreading is not coding gain)</td></tr>
        <tr><td>Tolerance to narrowband interference / jamming</td><td>Improved by $G_p$</td></tr>
        <tr><td>Tolerance to another CDMA user</td><td>Interference suppressed by $\approx G_p$</td></tr>
        <tr><td>Power spectral density transmitted</td><td>Reduced by $G_p$ (LPI / LPD)</td></tr>
        <tr><td>Occupied RF bandwidth</td><td>Increased by $G_p$</td></tr>
      </table>
      <div class="callout"><strong>Coding gain vs processing gain.</strong> FEC (see <em>fec</em>, <em>viterbi</em>) reduces the $E_b/N_0$ you need for a target BER — that is coding gain. Spreading does not; it buys interference rejection. They are complementary and multiply in a link/anti-jam budget.</div>`
    },
    {
      h: 'CDMA capacity and near-far: processing gain in a shared band',
      html: String.raw`<p>In a CDMA cell, $K$ users share the band; each user's despreader suppresses the other $K-1$ by $G_p$. With equal received powers, the interference-limited $E_b/N_0$ is approximately</p>
      <p>$$\frac{E_b}{N_0} \approx \frac{G_p}{K-1}\quad\Rightarrow\quad K \approx 1 + \frac{G_p}{(E_b/N_0)_{req}},$$</p>
      <p>so a larger processing gain directly buys more simultaneous users. This is why practical CDMA (IS-95, WCDMA) uses tight <strong>power control</strong>: if one user arrives far too strong (the <em>near-far problem</em>), its residual after despreading (power $/G_p$) can still swamp a weak user. Processing gain alone cannot fix a 40 dB power imbalance if $G_p$ is only 21 dB.</p>`
    },
    {
      h: 'Engineering practice: choosing and budgeting Gp',
      html: String.raw`<p>In system design, $G_p$ is chosen to meet the required anti-jam or multiple-access margin, then it is realized by picking a chip rate. Practical considerations:</p>
      <ul>
        <li><strong>Chip rate ceiling:</strong> $R_c$ is limited by available spectrum, ADC/DAC sample rate and correlator complexity. GPS C/A uses 1.023 Mcps; the encrypted P(Y) code uses 10.23 Mcps for ~10 dB more gain.</li>
        <li><strong>Synchronization cost:</strong> full $G_p$ requires code and carrier sync. Acquisition searches over code phase (and Doppler) — larger $N$ means a longer search but higher steady-state gain.</li>
        <li><strong>Only against uncorrelated interference:</strong> a repeater/relay jammer that captures and re-emits your code can appear correlated and rob you of $G_p$; this drives code security and hopping.</li>
        <li><strong>Frequency hopping analogue:</strong> for FH, the effective processing gain is the ratio of hop bandwidth to instantaneous bandwidth, $G_p\approx N_{hop}$ (number of hop channels) against a partial-band or follower jammer.</li>
      </ul>`
    },
    {
      h: 'Worked reference: GPS C/A processing gain',
      html: String.raw`<p>GPS C/A code: chip rate $R_c=1.023\times10^6$ chips/s, navigation data rate $R_b=50$ bits/s.</p>
      <p>$$G_p=\frac{R_c}{R_b}=\frac{1.023\times10^6}{50}=20460 \;\Rightarrow\; 10\log_{10}(20460)\approx 43.1\ \text{dB}.$$</p>
      <p>That 43 dB is why a GPS signal that arrives about 20&ndash;30 dB <em>below</em> the thermal noise floor at the antenna can still be demodulated after despreading. It also explains GPS's vulnerability: a relatively modest jammer that overcomes 43 dB of gain can deny the signal, which is why P(Y) (10× longer effective code / higher chip rate) and M-code exist.</p>`
    }
  ],
  keyPoints: [
    String.raw`$G_p = W/R = R_c/R_b = T_b/T_c = N$ for DSSS; in dB it is $10\log_{10}(W/R)$.`,
    String.raw`Despreading adds the wanted signal coherently (grows as $T$) and interference incoherently (grows as $\sqrt{T}$), lifting SNR by $G_p$.`,
    String.raw`$(S/N)_{out}=G_p\,(S/N)_{in}$ — processing gain multiplies the input SNR at the correlator output.`,
    String.raw`Processing gain is the time-bandwidth product $TW$ of the coherent processing window — the same quantity as matched-filter and radar pulse-compression gain.`,
    String.raw`Processing gain does NOT reduce the $E_b/N_0$ needed against white noise; that is coding gain. Spreading buys interference/jam rejection and LPI.`,
    String.raw`Against white Gaussian noise, a spread and unspread BPSK link have identical BER-vs-$E_b/N_0$.`,
    String.raw`In CDMA, $G_p$ suppresses each interfering user, giving capacity $K\approx 1 + G_p/(E_b/N_0)_{req}$.`,
    String.raw`Larger $N$ (longer code / higher chip rate) means more gain but longer acquisition and higher processing load.`,
    String.raw`GPS C/A: $1.023\,\text{Mcps}/50\,\text{bps}=20460\approx43\ \text{dB}$ of processing gain, enabling below-noise reception.`,
    String.raw`Processing gain only helps against interference that is uncorrelated with your code; a code-matched (repeater) jammer defeats it.`,
    String.raw`For frequency hopping, effective processing gain against a partial-band jammer is roughly the number of hop channels $N_{hop}$.`,
    String.raw`Lower transmitted PSD (reduced by $G_p$) is what gives spread spectrum its low probability of intercept/detection.`
  ],
  equations: [
    {
      title: String.raw`Processing gain (ratio and dB)`,
      tex: String.raw`$$G_p=\frac{W}{R}=\frac{R_c}{R_b}=N,\qquad G_p[\mathrm{dB}]=10\log_{10}\frac{W}{R}$$`,
      derivation: String.raw`<p>Spread bandwidth is set by the chip rate $W\approx R_c$; unspread information bandwidth is $R\approx R_b$. Their ratio is the number of chips per bit $N=T_b/T_c=R_c/R_b$. Taking $10\log_{10}$ converts to dB. This is the working definition for DSSS.</p>`
    },
    {
      title: String.raw`SNR improvement through the correlator`,
      tex: String.raw`$$\left(\frac{S}{N}\right)_{out}=G_p\left(\frac{S}{N}\right)_{in}$$`,
      derivation: String.raw`<p>Despreading multiplies the wanted signal by $c^2(t)=1$, so it integrates coherently; its amplitude over one bit scales with $T_b$ and its power with $T_b^2$. Interference multiplied by the random $\pm1$ code integrates incoherently, power scaling with $T_b$. The output SNR is thus the input SNR times $T_b R_c = G_p$.</p>`
    },
    {
      title: String.raw`Time-bandwidth product`,
      tex: String.raw`$$G_p = T\,W$$`,
      derivation: String.raw`<p>Coherent integration for time $T$ of a signal occupying bandwidth $W$ gives gain equal to the number of independent samples processed, $TW$. For DSSS $T=T_b$, $W=R_c$, giving $T_bR_c=N$. For a radar chirp $T=\tau$, $W=B$, giving $\tau B$.</p>`
    },
    {
      title: String.raw`Post-despread SNR from received power and jammer`,
      tex: String.raw`$$\left(\frac{S}{J}\right)_{out}=G_p\,\frac{S}{J}=G_p\,\frac{P_s}{P_j}$$`,
      derivation: String.raw`<p>Before despreading the signal-to-jammer ratio is $P_s/P_j$. The correlator concentrates $P_s$ and spreads $P_j$ across $W$, of which only $\approx R$ falls in the post-correlation bandwidth, keeping a fraction $R/W=1/G_p$. Hence the ratio improves by $G_p$.</p>`
    },
    {
      title: String.raw`CDMA interference-limited capacity`,
      tex: String.raw`$$\frac{E_b}{N_0}\approx\frac{G_p}{K-1}\quad\Rightarrow\quad K\approx 1+\frac{G_p}{(E_b/N_0)_{req}}$$`,
      derivation: String.raw`<p>With $K$ equal-power users, each despreader treats the other $K-1$ as noise reduced by $G_p$. Setting the resulting $E_b/N_0$ equal to the required value and solving for $K$ gives the interference-limited user count. Voice-activity and sectorization multiply this further in practice.</p>`
    },
    {
      title: String.raw`Radar pulse-compression gain`,
      tex: String.raw`$$G_p=\tau B=\frac{\tau}{1/B}=\frac{\text{pulse width}}{\text{compressed width}}$$`,
      derivation: String.raw`<p>A linear-FM (chirp) pulse of duration $\tau$ and swept bandwidth $B$ has time-bandwidth product $\tau B$. The matched filter compresses it to width $\approx 1/B$, raising the peak SNR by $\tau B$ — the same processing-gain formula as spread spectrum.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`Define processing gain in three equivalent ways.`, back: String.raw`$G_p=W/R$ (bandwidth ratio) $=R_c/R_b$ (chip-to-bit rate) $=T_b/T_c=N$ (chips per bit / spreading factor).` },
    { front: String.raw`What is processing gain in dB?`, back: String.raw`$G_p[\text{dB}]=10\log_{10}(W/R)=10\log_{10}N$.` },
    { front: String.raw`How does despreading raise SNR?`, back: String.raw`Signal correlates with the code and adds coherently ($\propto T$); interference is uncorrelated and adds incoherently ($\propto\sqrt{T}$). Net SNR gain $=G_p$.` },
    { front: String.raw`Does processing gain reduce required $E_b/N_0$ vs white noise?`, back: String.raw`No. Spreading preserves energy and noise density; the matched filter already extracts full energy. BER-vs-$E_b/N_0$ is unchanged. That improvement is coding gain, a different thing.` },
    { front: String.raw`Processing gain as a time-bandwidth product?`, back: String.raw`$G_p=TW$: coherent integration time $T$ times signal bandwidth $W$. Same quantity as matched-filter integration and radar pulse-compression gain.` },
    { front: String.raw`GPS C/A processing gain?`, back: String.raw`$1.023\text{ Mcps}/50\text{ bps}=20460\approx43\text{ dB}$ — lets the signal be received ~20-30 dB below the noise floor.` },
    { front: String.raw`What kind of interference does $G_p$ NOT help against?`, back: String.raw`Interference correlated with your spreading code — e.g. a repeater/follower jammer that captures and re-emits the code.` },
    { front: String.raw`CDMA user capacity formula.`, back: String.raw`$K\approx 1+G_p/(E_b/N_0)_{req}$ — larger processing gain buys more simultaneous users.` },
    { front: String.raw`Relate despreader to matched filter.`, back: String.raw`Despreading + integration is the matched filter (correlator) for the spread waveform, maximizing output SNR at $2E/N_0$.` },
    { front: String.raw`Effective processing gain of frequency hopping?`, back: String.raw`Roughly the number of hop channels $N_{hop}$ = (hop bandwidth)/(instantaneous bandwidth), against a partial-band jammer.` },
    { front: String.raw`Why does spread spectrum have LPI/LPD?`, back: String.raw`Spreading lowers transmitted PSD by $G_p$; the signal can sit below the noise floor of an unintended receiver, making detection hard.` },
    { front: String.raw`If chip rate doubles at fixed data rate, what happens to $G_p$?`, back: String.raw`$G_p$ doubles (+3 dB), because $G_p=R_c/R_b$. Occupied bandwidth also doubles.` },
    { front: String.raw`Signal-to-jammer ratio after despreading?`, back: String.raw`$(S/J)_{out}=G_p\,(S/J)_{in}$ — the correlator concentrates signal and spreads the jammer.` },
    { front: String.raw`What determines correlation-peak sharpness in DSSS?`, back: String.raw`Code length $N$ (=$G_p$) and code autocorrelation quality set peak height above the multi-access / self-noise floor.` }
  ],
  mcqs: [
    { q: String.raw`A DSSS system uses a 10.23 Mcps chip rate to carry 100 kbps of data. Its processing gain is closest to:`, options: [ String.raw`10 dB`, String.raw`20 dB`, String.raw`30 dB`, String.raw`43 dB` ], answer: 1, explain: String.raw`$G_p=R_c/R_b=10.23\text{ M}/100\text{ k}=102.3\approx20.1$ dB.` },
    { q: String.raw`Processing gain against additive white Gaussian noise:`, options: [ String.raw`Reduces the required $E_b/N_0$ for a target BER`, String.raw`Leaves the required $E_b/N_0$ for a target BER unchanged`, String.raw`Increases BER for the same $E_b/N_0$`, String.raw`Converts noise into signal energy` ], answer: 1, explain: String.raw`Spreading preserves energy and noise density; the matched filter recovers full energy, so BER-vs-$E_b/N_0$ is unchanged. Gain against noise is not what processing gain provides.` },
    { q: String.raw`The despreading correlator in DSSS is functionally equivalent to:`, options: [ String.raw`A phase-locked loop`, String.raw`A matched filter for the spread waveform`, String.raw`An automatic gain control`, String.raw`A frequency multiplier` ], answer: 1, explain: String.raw`Multiplying by the code replica and integrating computes the correlation that a matched filter for the spread waveform performs, maximizing output SNR.` },
    { q: String.raw`Which is NOT improved by processing gain?`, options: [ String.raw`Rejection of a narrowband jammer`, String.raw`Rejection of another CDMA user's code`, String.raw`Rejection of a repeater jammer echoing your own code`, String.raw`Low probability of intercept` ], answer: 2, explain: String.raw`A repeater/follower jammer re-emits your code, so it is correlated with your despreader and is NOT suppressed by $G_p$.` },
    { q: String.raw`Processing gain expressed as a time-bandwidth product is:`, options: [ String.raw`$T/W$`, String.raw`$TW$`, String.raw`$W/T$`, String.raw`$T+W$` ], answer: 1, explain: String.raw`Coherent integration time $T$ times bandwidth $W$ gives the number of independent samples processed, i.e. the gain $TW$.` },
    { q: String.raw`GPS C/A code has $R_c=1.023$ Mcps and $R_b=50$ bps. Its processing gain is about:`, options: [ String.raw`23 dB`, String.raw`33 dB`, String.raw`43 dB`, String.raw`53 dB` ], answer: 2, explain: String.raw`$1.023\text{M}/50=20460\Rightarrow 10\log_{10}(20460)\approx43.1$ dB.` },
    { q: String.raw`If the input signal-to-jammer ratio is $-15$ dB and $G_p=30$ dB, the post-correlation $S/J$ is:`, options: [ String.raw`$-45$ dB`, String.raw`$+15$ dB`, String.raw`$+45$ dB`, String.raw`$0$ dB` ], answer: 1, explain: String.raw`$(S/J)_{out}=(S/J)_{in}+G_p=-15+30=+15$ dB.` },
    { q: String.raw`For a CDMA system with $G_p=128$ and required $E_b/N_0=6$ dB ($\approx4$), the approximate user capacity is:`, options: [ String.raw`~9 users`, String.raw`~33 users`, String.raw`~64 users`, String.raw`~128 users` ], answer: 1, explain: String.raw`$K\approx 1+G_p/(E_b/N_0)=1+128/4=33$ users (before voice-activity/sectorization gains).` },
    { q: String.raw`Doubling the chip rate at fixed data rate changes $G_p$ by:`, options: [ String.raw`$-3$ dB`, String.raw`$0$ dB`, String.raw`$+3$ dB`, String.raw`$+6$ dB` ], answer: 2, explain: String.raw`$G_p=R_c/R_b$; doubling $R_c$ doubles $G_p$, i.e. $+3$ dB. Bandwidth also doubles.` },
    { q: String.raw`In radar, the pulse-compression gain of a chirp of duration $\tau$ and bandwidth $B$ is:`, options: [ String.raw`$B/\tau$`, String.raw`$\tau B$`, String.raw`$1/(\tau B)$`, String.raw`$\tau + B$` ], answer: 1, explain: String.raw`Compression gain equals the time-bandwidth product $\tau B$ — the same processing-gain formula as spread spectrum.` },
    { q: String.raw`Why can a GPS signal be demodulated below the noise floor?`, options: [ String.raw`Because the antenna has very high gain`, String.raw`Because ~43 dB of processing gain lifts post-correlation SNR above threshold`, String.raw`Because thermal noise is negligible at L-band`, String.raw`Because the data rate is high` ], answer: 1, explain: String.raw`The 43 dB processing gain raises the despread SNR by that amount, so even a signal 20-30 dB below the noise floor clears the demod threshold.` },
    { q: String.raw`The reduced transmitted power spectral density of a spread signal primarily provides:`, options: [ String.raw`Higher data rate`, String.raw`Low probability of intercept/detection`, String.raw`Lower required $E_b/N_0$`, String.raw`Immunity to multipath` ], answer: 1, explain: String.raw`Spreading lowers PSD by $G_p$, letting the signal hide under the noise floor of unintended receivers — LPI/LPD.` }
  ],
  numericals: [
    { q: String.raw`A DSSS link uses a PN code of length $N=1023$ chips per data bit. (a) What is the processing gain in dB? (b) If the input $S/N$ at the correlator is $-8$ dB, what is the output $S/N$?`, solution: String.raw`(a) $G_p=N=1023 \Rightarrow 10\log_{10}(1023)=30.1$ dB. (b) $(S/N)_{out}=(S/N)_{in}+G_p=-8+30.1=+22.1$ dB. The signal starts below its own noise and ends comfortably above threshold.` },
    { q: String.raw`A system must transmit 9600 bps and needs at least 25 dB of processing gain. What minimum chip rate is required?`, solution: String.raw`$G_p=25\text{ dB}=10^{2.5}=316.2$. Required $R_c=G_p\cdot R_b=316.2\times9600\approx3.04\times10^6$ chips/s. So a chip rate of at least $\approx3.04$ Mcps is needed (occupying $\approx3$ MHz for BPSK chips).` },
    { q: String.raw`GPS P(Y) uses a chip rate of 10.23 Mcps carrying 50 bps navigation data. Compare its processing gain to C/A (1.023 Mcps, 50 bps).`, solution: String.raw`P(Y): $G_p=10.23\text{M}/50=204600\Rightarrow 10\log_{10}(204600)=53.1$ dB. C/A: $20460\Rightarrow43.1$ dB. P(Y) has exactly 10 dB more processing gain (the chip rate is 10×), giving it correspondingly greater jam resistance.` },
    { q: String.raw`A CDMA system has processing gain 21 dB and each user requires $E_b/N_0=7$ dB. Estimate the single-cell user capacity.`, solution: String.raw`$G_p=10^{2.1}=125.9$; $(E_b/N_0)_{req}=10^{0.7}=5.01$. $K\approx1+G_p/(E_b/N_0)=1+125.9/5.01=1+25.1\approx26$ users. Voice-activity ($\times\sim2$) and sectorization would raise this in practice.` },
    { q: String.raw`A chirp radar pulse is 50 µs long and sweeps 2 MHz. (a) Find the pulse-compression (processing) gain. (b) What is the compressed pulse width and range resolution?`, solution: String.raw`(a) $G_p=\tau B=(50\times10^{-6})(2\times10^6)=100\Rightarrow20$ dB. (b) Compressed width $\approx1/B=0.5$ µs; range resolution $\Delta R=c/(2B)=3\times10^8/(4\times10^6)=75$ m. The 50 µs uncompressed pulse would give 7.5 km resolution — pulse compression improves it 100×.` },
    { q: String.raw`A jammer produces $-10$ dB signal-to-jammer ratio at the receiver input. The demodulator needs $+10$ dB $S/N$ to work. What processing gain is required, and what chip rate if the data rate is 1 Mbps?`, solution: String.raw`Required $G_p=(S/N)_{req}-(S/J)_{in}=10-(-10)=20$ dB $=100$. Chip rate $R_c=G_p\cdot R_b=100\times1\times10^6=100$ Mcps. (In practice you would also subtract implementation losses, reducing usable margin.)` },
    { q: String.raw`A DSSS receiver integrates for $T_b=1$ ms over a signal of bandwidth $W=5$ MHz. What is the processing gain, and how many chips per bit does that imply if chips fill the bandwidth?`, solution: String.raw`$G_p=TW=(1\times10^{-3})(5\times10^6)=5000\Rightarrow37$ dB. With chip rate $\approx W=5$ Mcps, chips per bit $N=R_c T_b=5\times10^6\times1\times10^3^{-1}$... i.e. $N=5\times10^6\times10^{-3}=5000$, matching $G_p$.` }
  ],
  realWorld: String.raw`<p>Processing gain is the design lever behind GPS/GNSS (43 dB for C/A lets receivers work below the noise floor), CDMA cellular (IS-95, CDMA2000, WCDMA) where it sets capacity and enables soft handover, Wi-Fi's original 802.11 DSSS/11b Barker and CCK modes, Bluetooth and military SINCGARS/Have Quick (via frequency hopping), and virtually all radar through pulse compression. In defence systems it is the first line of anti-jam defence, quantified downstream as jamming margin. Engineers trade it against spectrum, sample-rate and correlator complexity — every extra 3 dB of gain doubles the chip rate and the bandwidth you must digitize.</p>`,
  related: [ 'dsss', 'jamming-margin', 'frequency-hopping', 'matched-filter', 'correlation', 'pn-codes', 'gold-code', 'eb-no' ]
},
{
  id: 'jamming-margin',
  title: 'Jamming Margin',
  category: 'Spread Spectrum & Coding',
  tags: [ String.raw`anti-jam`, String.raw`spread spectrum`, String.raw`processing gain`, String.raw`electronic warfare`, String.raw`J/S`, String.raw`frequency hopping` ],
  summary: String.raw`Jamming margin is the amount by which a jammer can exceed the wanted signal at the receiver input before a spread-spectrum link fails, equal to the processing gain minus implementation losses minus the demodulator's required SNR.`,
  prerequisites: [ 'processing-gain', 'dsss', 'eb-no', 'frequency-hopping' ],
  intro: String.raw`<p>Processing gain tells you how much a spread-spectrum receiver suppresses interference. <strong>Jamming margin</strong> $M_j$ turns that into an operational number: how much stronger than your signal can a jammer be at the antenna and still leave the link working? It is the anti-jam <em>headroom</em> — the difference between the interference rejection you bought (processing gain, less real-world losses) and the signal quality your demodulator actually demands.</p>
<p>Jamming margin is the currency of electronic-warfare link design. A radio might advertise 30 dB of processing gain, but after subtracting a couple of dB of implementation loss and the 10 dB of SNR the modem needs, the jammer can only be about 18 dB stronger than the signal before the link breaks. Understanding exactly what goes into $M_j$ — and how the jammer-to-signal ratio at the receiver is set by transmit powers, ranges and antenna gains — lets you predict burn-through, size a jammer, or specify an anti-jam waveform.</p>`,
  sections: [
    {
      h: 'Definition and the core equation',
      html: String.raw`<p>Jamming margin is defined as the processing gain reduced by the implementation (system) loss $L_{sys}$ and the signal-to-noise ratio the demodulator requires at its output:</p>
      <p>$$\boxed{M_j\,[\mathrm{dB}] = G_p\,[\mathrm{dB}] - L_{sys}\,[\mathrm{dB}] - \left(\frac{S}{N}\right)_{req}[\mathrm{dB}]}$$</p>
      <p>Every term is in dB:</p>
      <ul>
        <li>$G_p$ — processing gain $=10\log_{10}(W/R)=10\log_{10}(R_c/R_b)$.</li>
        <li>$L_{sys}$ — implementation loss: imperfect code/carrier sync, quantization, filtering, non-ideal correlation. Typically 1&ndash;3 dB.</li>
        <li>$(S/N)_{req}$ — the SNR (or equivalent $E_b/N_0$ mapped through the rate) the demodulator needs for the target BER after any FEC.</li>
      </ul>
      <p>The result $M_j$ is the maximum tolerable <strong>jammer-to-signal ratio</strong> $(J/S)_{max}$ at the receiver input. If the actual $J/S$ exceeds $M_j$, the link fails; if it is below $M_j$, the link survives — this crossover is called <strong>burn-through</strong> (from the jammer's viewpoint) or the anti-jam threshold.</p>`
    },
    {
      h: 'Deriving jamming margin from processing gain',
      html: String.raw`<p>Start from what processing gain does to the jammer-to-signal ratio. Before despreading the input ratio is $(J/S)_{in}$. After despreading, the signal is concentrated and the jammer spread, improving the effective signal-to-jammer by $G_p$:</p>
      <p>$$\left(\frac{S}{J}\right)_{out}=G_p-\left(\frac{J}{S}\right)_{in}\quad[\mathrm{dB}].$$</p>
      <p>The link works as long as this output ratio (allowing for background noise, folded into $(S/N)_{req}$) meets the demodulator requirement, and after paying implementation loss:</p>
      <p>$$G_p-\left(\frac{J}{S}\right)_{in}-L_{sys}\;\ge\;\left(\frac{S}{N}\right)_{req}.$$</p>
      <p>Rearranging for the largest jammer the link can tolerate:</p>
      <p>$$\left(\frac{J}{S}\right)_{max}=G_p-L_{sys}-\left(\frac{S}{N}\right)_{req}=M_j.$$</p>
      <div class="callout"><strong>One-line takeaway.</strong> Jamming margin is simply "processing gain you paid full price for, minus the SNR the modem insists on keeping." It is the leftover anti-jam headroom.</div>`
    },
    {
      h: 'Where the jammer-to-signal ratio comes from',
      html: String.raw`<p>$M_j$ is the tolerable $J/S$; whether you exceed it depends on the physical geometry. Using the link equations (see <em>link-budget</em>, <em>path-loss</em>), the $J/S$ at the victim receiver is:</p>
      <p>$$\frac{J}{S}=\frac{P_J G_J G_{RJ}\,L_S\,R_S^{n}}{P_S G_S G_{RS}\,L_J\,R_J^{n}},$$</p>
      <p>where $P$ are transmit powers, $G$ antenna gains (transmit and receive-toward each source), $R$ ranges, and $n$ the path-loss exponent (2 in free space). In dB, the jammer wins when its EIRP, path advantage and antenna coupling outweigh the signal's. Key drivers:</p>
      <ul>
        <li><strong>Range:</strong> a jammer close to the victim (small $R_J$) has a large geometric advantage — free-space loss scales as $R^2$, so halving jammer range adds 6 dB to $J/S$.</li>
        <li><strong>Antenna discrimination:</strong> if the victim's receive antenna nulls the jammer direction, $G_{RJ}$ drops and $J/S$ falls — directive/adaptive antennas are a huge anti-jam multiplier on top of $M_j$.</li>
        <li><strong>Jammer type:</strong> barrage (wideband) jammers spread power over the whole band; partial-band and follower jammers concentrate power for a higher effective $J/S$ but are countered by hopping/coding.</li>
      </ul>
      <p>The link survives iff $\;(J/S)_{actual} < M_j.\;$ The margin between them (in dB) is your safety headroom.</p>`
    },
    {
      h: 'Jammer types and how margin behaves against each',
      html: String.raw`<table class="data">
        <tr><th>Jammer</th><th>Strategy</th><th>Effect on effective $J/S$ / margin</th></tr>
        <tr><td>Barrage / broadband noise</td><td>Fill the whole spread band with noise</td><td>Full $G_p$ applies; margin as computed. Least efficient for the jammer.</td></tr>
        <tr><td>Partial-band noise</td><td>Concentrate power in a fraction $\rho$ of the band</td><td>For FH, worst-case optimized $\rho$ can convert the exponential BER curve to an inverse-linear one — much more damaging; drives interleaving + FEC.</td></tr>
        <tr><td>Tone / multitone</td><td>CW tones inside the band</td><td>Spread by despreading like any narrowband signal; full $G_p$ against a single tone.</td></tr>
        <tr><td>Pulsed</td><td>High-power short bursts, low duty cycle</td><td>Beats average-power limits; erasures handled by FEC + interleaving rather than raw margin.</td></tr>
        <tr><td>Follower / repeater</td><td>Detect the hop/code and re-emit</td><td>Can appear correlated, eroding $G_p$; countered by fast hopping so the jammer arrives after the dwell.</td></tr>
      </table>
      <div class="callout"><strong>Margin is a first-order figure.</strong> $M_j$ assumes a broadband, uncorrelated jammer. Smart jammers force you to add FEC coding gain, interleaving, adaptive nulling, and fast frequency hopping to restore effective margin.</div>`
    },
    {
      h: 'Frequency hopping and jamming margin',
      html: String.raw`<p>Frequency-hopping spread spectrum (FHSS, see <em>frequency-hopping</em>) earns processing gain from the number of hop channels rather than a chip rate. Against a jammer that must cover the whole hop band, the processing gain is roughly $G_p\approx N_{hop}$ (total hop bandwidth / instantaneous bandwidth), and jamming margin follows the same formula. Two important cases:</p>
      <ul>
        <li><strong>Full-band jammer:</strong> jammer power divided among $N_{hop}$ channels; margin $\approx 10\log_{10}N_{hop}-L-(S/N)_{req}$.</li>
        <li><strong>Partial-band jammer:</strong> jammer covers a fraction $\rho$ of channels at high power; a fraction $\rho$ of hops are hit hard. Without coding this is very effective, so FH systems always pair with FEC + interleaving so that occasional jammed hops become correctable erasures — this restores effective margin.</li>
        <li><strong>Follower jammer:</strong> defeated by making the hop dwell shorter than the jammer's detect-tune-transmit-plus-propagation loop; fast hopping (multiple hops per bit) leaves the jammer chasing stale frequencies.</li>
      </ul>`
    },
    {
      h: 'Improving jamming margin: the design levers',
      html: String.raw`<p>To raise $M_j$ you can increase $G_p$ or decrease the losses/required SNR:</p>
      <ul>
        <li><strong>More processing gain:</strong> higher chip rate or longer code (+3 dB per doubling of $R_c$). Costs bandwidth, ADC rate and correlator load.</li>
        <li><strong>FEC coding gain:</strong> lowers $(S/N)_{req}$ / required $E_b/N_0$ (see <em>fec</em>, <em>viterbi</em>) — every dB of coding gain is a dB more jamming margin, at the price of data throughput or extra bandwidth.</li>
        <li><strong>Antenna nulling / directivity:</strong> steer nulls onto the jammer (adaptive arrays) to cut $J/S$ directly — often the biggest single win, effectively adding tens of dB.</li>
        <li><strong>Lower implementation loss:</strong> better sync, tighter correlation, cleaner filtering recover the last 1&ndash;3 dB.</li>
        <li><strong>Interleaving + hopping:</strong> spread jammed bursts across the codeword so FEC can correct them, restoring effective margin against partial-band and pulsed jammers.</li>
      </ul>`
    },
    {
      h: 'Common pitfalls and exam traps',
      html: String.raw`<ul>
        <li><strong>Don't forget the two subtractions.</strong> $M_j\ne G_p$. You must subtract both implementation loss and required SNR. A 30 dB $G_p$ radio might only have ~18 dB of margin.</li>
        <li><strong>$(S/N)_{req}$ is post-FEC.</strong> Use the SNR the demodulator needs after coding gain, mapped through the code rate if you are working in $E_b/N_0$.</li>
        <li><strong>Margin is a $J/S$ threshold, not a $J/N$ threshold.</strong> It compares jammer to <em>signal</em>, then geometry decides whether the threshold is exceeded.</li>
        <li><strong>Processing gain vanishes against correlated jamming.</strong> A repeater jammer that reproduces your code is not suppressed; $M_j$ overstates protection unless you hop faster than the jammer can respond.</li>
        <li><strong>Bandwidth definitions matter.</strong> Use the same bandwidth convention for $G_p$ as your reference; $R_c/R_b$ is safest.</li>
      </ul>`
    }
  ],
  keyPoints: [
    String.raw`$M_j[\text{dB}] = G_p - L_{sys} - (S/N)_{req}$ — anti-jam headroom in dB.`,
    String.raw`$M_j$ equals the maximum tolerable jammer-to-signal ratio $(J/S)_{max}$ at the receiver input.`,
    String.raw`The link survives iff the actual $J/S$ (set by powers, ranges, antenna gains) is below $M_j$; crossing it is burn-through.`,
    String.raw`Jamming margin is derived directly from processing gain: $(S/J)_{out}=G_p-(J/S)_{in}$.`,
    String.raw`$M_j\ne G_p$: you must subtract both implementation loss (~1-3 dB) and the demodulator's required SNR (~post-FEC).`,
    String.raw`Every dB of FEC coding gain lowers $(S/N)_{req}$ and thus adds a dB of jamming margin.`,
    String.raw`Antenna nulling/directivity cuts $J/S$ directly and often adds more effective margin than any waveform change.`,
    String.raw`Doubling chip rate (or hop-channel count) adds ~3 dB of $G_p$ and hence ~3 dB of margin, at the cost of bandwidth.`,
    String.raw`Partial-band and pulsed jammers beat raw margin; interleaving + FEC turn jammed bursts into correctable erasures.`,
    String.raw`Follower/repeater jammers erode processing gain unless you hop faster than their detect-tune-transmit loop.`,
    String.raw`For FHSS, effective $G_p\approx N_{hop}$ (total hop BW / instantaneous BW).`,
    String.raw`Halving jammer range adds ~6 dB to $J/S$ (free-space $R^2$), directly eating into your margin.`
  ],
  equations: [
    {
      title: String.raw`Jamming margin`,
      tex: String.raw`$$M_j = G_p - L_{sys} - \left(\frac{S}{N}\right)_{req}\quad[\mathrm{dB}]$$`,
      derivation: String.raw`<p>Processing gain improves the signal-to-jammer ratio by $G_p$. Subtract implementation losses (imperfect sync, filtering, quantization) and the SNR the demodulator must retain to hit target BER. What remains is the extra jammer power, relative to signal, the link can absorb — the jamming margin.</p>`
    },
    {
      title: String.raw`Maximum tolerable jammer-to-signal ratio`,
      tex: String.raw`$$\left(\frac{J}{S}\right)_{max}=M_j=G_p-L_{sys}-\left(\frac{S}{N}\right)_{req}$$`,
      derivation: String.raw`<p>Set the post-despread output SNR equal to the requirement: $G_p-(J/S)_{in}-L_{sys}=(S/N)_{req}$. Solve for $(J/S)_{in}$ to get the largest input $J/S$ the link tolerates — numerically identical to $M_j$.</p>`
    },
    {
      title: String.raw`Post-despread signal-to-jammer ratio`,
      tex: String.raw`$$\left(\frac{S}{J}\right)_{out}=G_p-\left(\frac{J}{S}\right)_{in}\quad[\mathrm{dB}]$$`,
      derivation: String.raw`<p>The correlator concentrates the signal into bandwidth $R$ and spreads the jammer over $W$; only a fraction $R/W=1/G_p$ of jammer power survives the post-correlation filter. Thus the signal-to-jammer ratio rises by $G_p$.</p>`
    },
    {
      title: String.raw`Jammer-to-signal ratio from geometry`,
      tex: String.raw`$$\frac{J}{S}=\frac{P_J G_J G_{RJ}}{P_S G_S G_{RS}}\left(\frac{R_S}{R_J}\right)^{n}$$`,
      derivation: String.raw`<p>Apply the range equation to jammer and signal paths separately (received power $\propto P\,G_{tx}\,G_{rx}/R^{n}$) and take the ratio. Common terms cancel, leaving the EIRP ratio, the antenna-coupling ratio, and the range ratio raised to the path-loss exponent $n$ (2 in free space).</p>`
    },
    {
      title: String.raw`Required SNR from Eb/N0 and rate`,
      tex: String.raw`$$\left(\frac{S}{N}\right)_{req}=\frac{E_b}{N_0}\cdot\frac{R_b}{B}\;\Rightarrow\;\left(\frac{S}{N}\right)_{req}[\mathrm{dB}]=\frac{E_b}{N_0}[\mathrm{dB}]+10\log_{10}\frac{R_b}{B}$$`,
      derivation: String.raw`<p>Signal-to-noise ratio in bandwidth $B$ relates to energy-per-bit-to-noise-density by the ratio of data rate to bandwidth, $S/N=(E_b/N_0)(R_b/B)$. Use this to insert the correct post-FEC $(S/N)_{req}$ into the margin equation when the modem spec is given as $E_b/N_0$.</p>`
    },
    {
      title: String.raw`Effective margin with coding gain`,
      tex: String.raw`$$M_j^{coded}=G_p+G_{coding}-L_{sys}-\left(\frac{S}{N}\right)_{req,\,uncoded}$$`,
      derivation: String.raw`<p>FEC reduces the required uncoded SNR by the coding gain $G_{coding}$. Equivalently, add $G_{coding}$ to the processing gain term. Coding gain and processing gain simply sum in the anti-jam budget.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`State the jamming-margin equation.`, back: String.raw`$M_j[\text{dB}] = G_p - L_{sys} - (S/N)_{req}$ — processing gain minus implementation loss minus required demodulator SNR.` },
    { front: String.raw`What does jamming margin physically represent?`, back: String.raw`The maximum jammer-to-signal ratio $(J/S)_{max}$ at the receiver input that the link can tolerate before it fails.` },
    { front: String.raw`Is $M_j$ equal to processing gain?`, back: String.raw`No. $M_j=G_p$ minus implementation loss (1-3 dB) minus the required SNR. A 30 dB $G_p$ radio may only have ~18 dB of margin.` },
    { front: String.raw`What is burn-through?`, back: String.raw`The condition where the actual $J/S$ (from geometry/power) exceeds the jamming margin, so the link fails. It is the anti-jam threshold crossing.` },
    { front: String.raw`How does FEC affect jamming margin?`, back: String.raw`Coding gain lowers $(S/N)_{req}$, so each dB of coding gain adds a dB of jamming margin: $M_j=G_p+G_{coding}-L-(S/N)_{req,uncoded}$.` },
    { front: String.raw`What sets the actual $J/S$ at the victim receiver?`, back: String.raw`Transmit powers, antenna gains toward each source, and range ratio raised to the path-loss exponent: $J/S=(P_JG_JG_{RJ}/P_SG_SG_{RS})(R_S/R_J)^n$.` },
    { front: String.raw`Effect of halving the jammer's range on $J/S$?`, back: String.raw`Free-space loss $\propto R^2$, so halving jammer range adds ~6 dB to $J/S$, eating 6 dB of margin.` },
    { front: String.raw`Which jammer defeats raw processing gain?`, back: String.raw`A follower/repeater jammer that reproduces your code appears correlated; counter it by hopping faster than its detect-tune-transmit loop.` },
    { front: String.raw`Why pair FH with FEC + interleaving?`, back: String.raw`Partial-band/pulsed jammers hit some hops hard; interleaving spreads the damage across a codeword so FEC corrects it, restoring effective margin.` },
    { front: String.raw`Effective $G_p$ for frequency hopping?`, back: String.raw`Roughly the number of hop channels $N_{hop}$ = total hop bandwidth / instantaneous bandwidth.` },
    { front: String.raw`Biggest single lever besides waveform to reduce $J/S$?`, back: String.raw`Antenna nulling/directivity — steer a null onto the jammer to cut $G_{RJ}$, often adding tens of dB of effective margin.` },
    { front: String.raw`Convert $E_b/N_0$ to the required SNR in bandwidth B.`, back: String.raw`$(S/N)_{req}=(E_b/N_0)(R_b/B)$, i.e. add $10\log_{10}(R_b/B)$ in dB.` },
    { front: String.raw`Typical value of implementation loss $L_{sys}$?`, back: String.raw`About 1-3 dB, from imperfect code/carrier sync, filtering, and quantization.` },
    { front: String.raw`Adding 3 dB of processing gain requires what?`, back: String.raw`Doubling the chip rate (DSSS) or doubling the hop-channel count (FHSS), at the cost of double the bandwidth.` }
  ],
  mcqs: [
    { q: String.raw`A DSSS radio has $G_p=30$ dB, implementation loss 2 dB, and needs $(S/N)_{req}=10$ dB. Its jamming margin is:`, options: [ String.raw`42 dB`, String.raw`22 dB`, String.raw`18 dB`, String.raw`30 dB` ], answer: 2, explain: String.raw`$M_j=30-2-10=18$ dB. Note it is well below the raw processing gain.` },
    { q: String.raw`Jamming margin numerically equals:`, options: [ String.raw`The processing gain`, String.raw`The maximum tolerable jammer-to-signal ratio at the input`, String.raw`The receiver noise figure`, String.raw`The required $E_b/N_0$` ], answer: 1, explain: String.raw`$M_j=(J/S)_{max}$: the largest input $J/S$ the link can absorb before failing.` },
    { q: String.raw`Adding 5 dB of FEC coding gain to an anti-jam link:`, options: [ String.raw`Reduces jamming margin by 5 dB`, String.raw`Leaves jamming margin unchanged`, String.raw`Increases jamming margin by 5 dB`, String.raw`Doubles the processing gain` ], answer: 2, explain: String.raw`Coding gain lowers $(S/N)_{req}$ by 5 dB, so $M_j$ increases by 5 dB.` },
    { q: String.raw`Halving the distance from jammer to victim (free space) changes $J/S$ by about:`, options: [ String.raw`$+3$ dB`, String.raw`$+6$ dB`, String.raw`$-6$ dB`, String.raw`No change` ], answer: 1, explain: String.raw`Free-space loss $\propto R^2$; halving $R_J$ adds $20\log_{10}2\approx6$ dB to $J/S$.` },
    { q: String.raw`Which jammer most directly defeats processing gain by appearing correlated with the code?`, options: [ String.raw`Barrage noise jammer`, String.raw`Single-tone jammer`, String.raw`Repeater/follower jammer`, String.raw`Thermal noise` ], answer: 2, explain: String.raw`A repeater/follower jammer captures and re-emits the code/hop, correlating with the despreader and eroding $G_p$.` },
    { q: String.raw`A link needs a jamming margin of 20 dB and its modem needs 8 dB SNR with 2 dB implementation loss. Required processing gain is:`, options: [ String.raw`10 dB`, String.raw`26 dB`, String.raw`30 dB`, String.raw`16 dB` ], answer: 2, explain: String.raw`$G_p=M_j+L_{sys}+(S/N)_{req}=20+2+8=30$ dB.` },
    { q: String.raw`For FHSS, the effective processing gain against a full-band jammer is roughly:`, options: [ String.raw`The chip-to-bit ratio`, String.raw`The number of hop channels $N_{hop}$`, String.raw`The code length`, String.raw`The symbol rate` ], answer: 1, explain: String.raw`FH earns gain from hopping over $N_{hop}$ channels: $G_p\approx$ total hop bandwidth / instantaneous bandwidth.` },
    { q: String.raw`Why are interleaving and FEC essential against a partial-band jammer?`, options: [ String.raw`They increase transmit power`, String.raw`They spread jammed bursts across a codeword so errors become correctable`, String.raw`They increase the chip rate`, String.raw`They lower the noise figure` ], answer: 1, explain: String.raw`Partial-band jammers hit some hops hard; interleaving disperses those errors and FEC corrects them, restoring effective margin.` },
    { q: String.raw`If actual $J/S=25$ dB and $M_j=18$ dB, the link:`, options: [ String.raw`Works with 7 dB to spare`, String.raw`Fails (burn-through) by 7 dB`, String.raw`Works exactly at threshold`, String.raw`Is unaffected by the jammer` ], answer: 1, explain: String.raw`Actual $J/S$ exceeds the margin by $25-18=7$ dB, so the jammer burns through and the link fails.` },
    { q: String.raw`The single most effective addition on top of $M_j$ to reduce $J/S$ from a known-direction jammer is:`, options: [ String.raw`Raising the data rate`, String.raw`Adaptive antenna nulling toward the jammer`, String.raw`Lowering the chip rate`, String.raw`Increasing implementation loss` ], answer: 1, explain: String.raw`An adaptive null cuts $G_{RJ}$ and thus $J/S$ directly, often adding tens of dB of effective protection.` },
    { q: String.raw`A GPS receiver has $G_p=43$ dB, 3 dB implementation loss and needs 4 dB $(S/N)_{req}$. Approximate jamming margin:`, options: [ String.raw`36 dB`, String.raw`43 dB`, String.raw`50 dB`, String.raw`30 dB` ], answer: 0, explain: String.raw`$M_j=43-3-4=36$ dB — the maximum $J/S$ before GPS jamming succeeds, explaining GPS's known vulnerability to modest jammers.` },
    { q: String.raw`Doubling the chip rate at fixed data rate changes jamming margin (all else equal) by:`, options: [ String.raw`$-3$ dB`, String.raw`$0$ dB`, String.raw`$+3$ dB`, String.raw`$+6$ dB` ], answer: 2, explain: String.raw`$G_p$ rises 3 dB, so $M_j$ rises 3 dB — at the cost of doubling occupied bandwidth.` }
  ],
  numericals: [
    { q: String.raw`A DSSS link has chip rate 10 Mcps and data rate 10 kbps. Implementation loss is 2 dB and the demodulator needs 9 dB SNR. Find (a) $G_p$ and (b) the jamming margin.`, solution: String.raw`(a) $G_p=R_c/R_b=10\times10^6/10\times10^3=1000\Rightarrow30$ dB. (b) $M_j=G_p-L_{sys}-(S/N)_{req}=30-2-9=19$ dB. The link tolerates a jammer up to 19 dB stronger than the signal at the input.` },
    { q: String.raw`A jammer transmits 100 W into an omni antenna at 5 km from a receiver; the wanted transmitter sends 10 W into a 10 dBi antenna at 20 km. Both links are free space at the same frequency; receive antenna is omni toward both. (a) Compute $J/S$. (b) If $M_j=25$ dB, does the link survive?`, solution: String.raw`EIRP jammer $=10\log_{10}(100)+0=20$ dBW. EIRP signal $=10\log_{10}(10)+10=20$ dBW. Equal EIRP, so the difference is only geometry: $(R_S/R_J)^2=(20/5)^2=16\Rightarrow 10\log_{10}16=12$ dB in the jammer's favour. So $J/S=+12$ dB. (b) $12\ \text{dB}<25\ \text{dB}=M_j$, so the link survives with 13 dB of headroom.` },
    { q: String.raw`Required jamming margin is 30 dB. The modem needs $E_b/N_0=6$ dB with a rate-1/2 code giving 5 dB coding gain, and there is 2 dB implementation loss. What raw (uncoded) processing gain must the waveform provide? (Take $(S/N)_{req}$ as the coded requirement.)`, solution: String.raw`Coded requirement $(S/N)_{req}=E_b/N_0-G_{coding}=6-5=1$ dB (effective). $G_p=M_j+L_{sys}+(S/N)_{req}=30+2+1=33$ dB. So the spreading waveform needs 33 dB of processing gain ($\approx2000\times$).` },
    { q: String.raw`A frequency-hopping radio hops over 1000 channels each 25 kHz wide (25 MHz total) carrying 16 kbps. Implementation loss 2 dB, required SNR 10 dB. Find $G_p$ and $M_j$ against a full-band jammer.`, solution: String.raw`$G_p\approx N_{hop}=$ total hop BW / channel BW $=25\text{ MHz}/25\text{ kHz}=1000\Rightarrow30$ dB (equivalently the jammer's power is split 1000 ways). $M_j=30-2-10=18$ dB against a jammer forced to cover the whole band.` },
    { q: String.raw`A GPS C/A receiver ($G_p=43$ dB) has 3 dB implementation loss and needs 6 dB $(S/N)_{req}$. A jammer produces $J/S=40$ dB at the antenna. Does GPS survive, and by how much?`, solution: String.raw`$M_j=43-3-6=34$ dB. Actual $J/S=40$ dB $>34$ dB, so the jammer burns through by $40-34=6$ dB — GPS is denied. This is why anti-jam adaptive antennas (CRPA) and higher-gain military codes are used.` },
    { q: String.raw`You must raise a link's jamming margin from 15 dB to 24 dB. You can add processing gain (bandwidth cost) or FEC (throughput cost). If FEC provides 6 dB of coding gain, how much extra processing gain (and chip-rate factor) is still needed?`, solution: String.raw`Need $+9$ dB total. FEC supplies 6 dB, leaving $+3$ dB from processing gain. $+3$ dB means doubling the chip rate ($\times2$), doubling occupied bandwidth. Combined: FEC (6 dB) + 2× chip rate (3 dB) = 9 dB, reaching 24 dB.` },
    { q: String.raw`A partial-band jammer concentrates its power into 10% of a 20 MHz spread band. Compared with barrage jamming, by how many dB is its in-band power spectral density higher, and what is the qualitative effect on margin?`, solution: String.raw`Concentrating the same power into $\rho=0.1$ of the band raises in-band PSD by $10\log_{10}(1/0.1)=10$ dB. Qualitatively it defeats 10 dB of the raw margin for the hops it hits; without FEC + interleaving the effective margin drops sharply, which is why anti-jam FH always uses coding.` },
    { q: String.raw`A link has $G_p=27$ dB and 2 dB implementation loss. Two candidate modems need $(S/N)_{req}$ of 12 dB (uncoded) and 4 dB (with FEC). Compare their jamming margins and the tolerable jammer-power ratio.`, solution: String.raw`Uncoded: $M_j=27-2-12=13$ dB $\Rightarrow$ tolerates $J/S$ up to $\times20$. Coded: $M_j=27-2-4=21$ dB $\Rightarrow$ tolerates $J/S$ up to $\times126$. The FEC modem withstands a jammer roughly $6.3\times$ (8 dB) more powerful, at the cost of throughput/bandwidth.` }
  ],
  realWorld: String.raw`<p>Jamming margin is the headline anti-jam spec of tactical and satellite communications: military SATCOM (protected waveforms like the Advanced EHF / MILSTAR MDR), Link-16 (frequency-hopped, error-coded), SINCGARS and HAVE QUICK combat radios, and GPS M-code all quote or engineer to a jamming margin. It explains why civilian GPS (~34-36 dB margin) is jammed by cheap handheld devices while military M-code and controlled-reception-pattern antennas add tens of dB more. In commercial spread spectrum (Bluetooth adaptive hopping, LoRa chirp spread spectrum, CDMA cellular) the same equation governs coexistence and interference robustness rather than deliberate jamming. Whenever a system must survive hostile or crowded spectrum, its designers trade chip rate, hop count, FEC and antenna nulling to hit a target $M_j$.</p>`,
  related: [ 'processing-gain', 'dsss', 'frequency-hopping', 'fec', 'viterbi', 'eb-no', 'link-budget' ]
},
{
  id: 'sensitivity',
  title: 'Receiver Sensitivity',
  category: 'RF Link & Metrics',
  tags: [ String.raw`sensitivity`, String.raw`noise floor`, String.raw`noise figure`, String.raw`MDS`, String.raw`link budget`, String.raw`Eb/N0` ],
  summary: String.raw`Receiver sensitivity is the minimum input signal power (in dBm) that delivers the required signal quality, equal to the thermal noise floor plus noise figure plus the required SNR in the signal bandwidth.`,
  prerequisites: [ 'noise-floor', 'noise-figure', 'eb-no', 'ber' ],
  intro: String.raw`<p><strong>Receiver sensitivity</strong> answers the most practical question in radio: how weak a signal can this receiver still decode? Expressed as a power in dBm, it is the input level at which the demodulator just meets its target performance — a specified BER, packet error rate, or SNR. Everything above sensitivity works; everything below it fails. Sensitivity, together with transmit power and antenna gains, sets the maximum range of a link through the link budget.</p>
<p>The beauty of the sensitivity equation is that it decomposes cleanly into three physically meaningful pieces: the <em>thermal noise floor</em> (set by temperature and bandwidth, an inescapable floor from physics), the <em>noise figure</em> (how much the receiver's own electronics degrade that floor), and the <em>required SNR or $E_b/N_0$</em> (how much cleaner than noise the signal must be for your modulation and coding). Master these three and you can compute, compare and improve the sensitivity of any receiver — and explain why LoRa reaches kilometres where Wi-Fi reaches metres.</p>`,
  sections: [
    {
      h: 'The sensitivity equation',
      html: String.raw`<p>Receiver sensitivity in dBm is the sum of the noise floor, the noise figure, and the required signal-to-noise ratio:</p>
      <p>$$\boxed{S_{min}\,[\mathrm{dBm}] = \underbrace{-174 + 10\log_{10}B}_{\text{thermal noise floor}} + \underbrace{NF}_{\text{noise figure}} + \underbrace{(S/N)_{req}}_{\text{demod requirement}}}$$</p>
      <p>Term by term:</p>
      <ul>
        <li><strong>$-174$ dBm/Hz</strong> is the thermal noise power spectral density $kT_0$ at the reference temperature $T_0=290$ K: $10\log_{10}(kT_0/1\text{ mW})=-174$ dBm/Hz.</li>
        <li><strong>$10\log_{10}B$</strong> converts that density into total noise power in the noise bandwidth $B$ (Hz). Together the first two terms are the <em>noise floor</em> $N=kT_0B$.</li>
        <li><strong>$NF$</strong> (dB) is the receiver noise figure — the SNR degradation from the antenna terminal through to the detector, dominated by the first LNA (see <em>noise-figure</em>).</li>
        <li><strong>$(S/N)_{req}$</strong> (dB) is the SNR the demodulator needs at its input to achieve the target BER for the chosen modulation and FEC.</li>
      </ul>
      <div class="callout"><strong>Mnemonic.</strong> Sensitivity = "physics floor (−174 + BW) + your hardware's penalty (NF) + what the modem demands (SNR)." Improve any of the three and sensitivity gets more negative (better).</div>`
    },
    {
      h: 'The thermal noise floor: where −174 comes from',
      html: String.raw`<p>Available thermal noise power in bandwidth $B$ is $N=kT_0B$, where $k=1.38\times10^{-23}$ J/K and $T_0=290$ K. The density is</p>
      <p>$$kT_0 = 1.38\times10^{-23}\times290 = 4.0\times10^{-21}\ \text{W/Hz}.$$</p>
      <p>Converting to dBm/Hz: $10\log_{10}(4.0\times10^{-21}/10^{-3})=-174\ \text{dBm/Hz}$. So the noise floor in a bandwidth $B$ is</p>
      <p>$$N\,[\mathrm{dBm}]=-174+10\log_{10}B.$$</p>
      <table class="data">
        <tr><th>Bandwidth $B$</th><th>$10\log_{10}B$</th><th>Noise floor $N$ (NF = 0)</th></tr>
        <tr><td>1 Hz</td><td>0 dB</td><td>$-174$ dBm</td></tr>
        <tr><td>1 kHz</td><td>30 dB</td><td>$-144$ dBm</td></tr>
        <tr><td>200 kHz (GSM)</td><td>53 dB</td><td>$-121$ dBm</td></tr>
        <tr><td>1 MHz</td><td>60 dB</td><td>$-114$ dBm</td></tr>
        <tr><td>20 MHz (Wi-Fi)</td><td>73 dB</td><td>$-101$ dBm</td></tr>
      </table>
      <div class="callout"><strong>Bandwidth is a double-edged sword.</strong> Every 10× more bandwidth raises the noise floor by 10 dB, hurting sensitivity — but it also lets you carry 10× the rate. This is why narrowband systems (LoRa, GSM) are far more sensitive than wideband ones (Wi-Fi), at the cost of throughput.</div>`
    },
    {
      h: 'Noise figure: the receiver\'s own penalty',
      html: String.raw`<p>Noise figure $NF$ (in dB; noise factor $F$ linear) quantifies how much the receiver degrades SNR relative to the ideal $kT_0B$ floor. The equivalent input noise temperature is $T_e=(F-1)T_0$, and the effective system noise floor becomes $N=kT_0BF=k(T_0+T_e)B$. Key facts:</p>
      <ul>
        <li>By Friis's formula the <strong>first-stage LNA dominates</strong>: a low-noise, high-gain first amplifier sets the system NF; later stages are divided down by preceding gain. Put the LNA as close to the antenna as possible (minimize lossy cable before it — every dB of front-end loss adds ~1 dB of NF).</li>
        <li>Typical NFs: a good cellular/GNSS front end 1&ndash;3 dB, a general receiver 5&ndash;8 dB, a modest one 10&ndash;15 dB.</li>
        <li>Every dB reduction in NF improves sensitivity by exactly 1 dB — often the cheapest sensitivity win after fixing the antenna.</li>
      </ul>`
    },
    {
      h: 'Required SNR: from BER through Eb/N0',
      html: String.raw`<p>The last term, $(S/N)_{req}$, is where modulation and coding enter. Modem specs are usually given as the $E_b/N_0$ needed for a target BER. Convert to SNR in bandwidth $B$ using the relation between energy-per-bit and noise density:</p>
      <p>$$\frac{S}{N}=\frac{E_b}{N_0}\cdot\frac{R_b}{B}\quad\Rightarrow\quad \left(\frac{S}{N}\right)_{req}[\mathrm{dB}]=\frac{E_b}{N_0}[\mathrm{dB}]+10\log_{10}\!\frac{R_b}{B}.$$</p>
      <p>Substituting into the sensitivity equation and using $N_0=kT_0F$ gives the elegant <strong>$E_b/N_0$ form</strong>:</p>
      <p>$$S_{min}[\mathrm{dBm}]=-174+NF+10\log_{10}R_b+\left(\frac{E_b}{N_0}\right)_{req}[\mathrm{dB}].$$</p>
      <p>Notice the bandwidth $B$ has been replaced by the <em>bit rate</em> $R_b$: sensitivity fundamentally depends on the rate of information you push, not the occupied bandwidth. This form makes the sensitivity-vs-rate trade explicit and is the cleanest way to compare systems with different bandwidths and spreading.</p>
      <div class="callout"><strong>Two equivalent forms.</strong> Use $-174+10\log_{10}B+NF+(S/N)_{req}$ when you know the noise bandwidth and required SNR; use $-174+10\log_{10}R_b+NF+(E_b/N_0)_{req}$ when you know the bit rate and required $E_b/N_0$. They give the same number if $S/N$ and $E_b/N_0$ are consistent through $R_b/B$.</div>`
    },
    {
      h: 'Minimum detectable signal (MDS) and how sensitivity relates to it',
      html: String.raw`<p>The <strong>minimum detectable signal</strong> (MDS) is often defined as the input power giving a 0 dB output SNR — i.e. signal equal to the noise floor:</p>
      <p>$$\text{MDS}[\mathrm{dBm}]=-174+10\log_{10}B+NF.$$</p>
      <p>Sensitivity is then MDS plus the required SNR: $S_{min}=\text{MDS}+(S/N)_{req}$. Sometimes an <em>MDS with a stated SNR</em> (e.g. 3 dB, 10 dB) is quoted, in which case it is identical to sensitivity for that SNR. Always check whether a "sensitivity" figure includes a specified BER/SNR (it usually does) or is a bare noise-floor MDS.</p>`
    },
    {
      h: 'Levers: how bandwidth, NF, coding and integration move sensitivity',
      html: String.raw`<table class="data">
        <tr><th>Change</th><th>Effect on sensitivity</th></tr>
        <tr><td>Narrow the bandwidth 10× (lower rate)</td><td>Noise floor $-10$ dB $\Rightarrow$ sensitivity improves 10 dB</td></tr>
        <tr><td>Reduce NF by 1 dB</td><td>Sensitivity improves 1 dB</td></tr>
        <tr><td>Add FEC coding gain of $G_c$ dB</td><td>$(S/N)_{req}$ (or $E_b/N_0$) drops $G_c$ dB $\Rightarrow$ sensitivity improves $G_c$ dB</td></tr>
        <tr><td>Use spread spectrum / longer integration</td><td>Lowers effective required SNR by processing gain; e.g. LoRa CSS reaches $\sim-137$ dBm</td></tr>
        <tr><td>Switch to a more robust modulation (BPSK vs 64-QAM)</td><td>Lower $(S/N)_{req}$ $\Rightarrow$ better sensitivity, lower rate</td></tr>
        <tr><td>Halve the data rate</td><td>$10\log_{10}R_b$ drops 3 dB $\Rightarrow$ sensitivity improves 3 dB</td></tr>
      </table>
      <p>This table is the engineer's toolkit: sensitivity is improved by narrowing bandwidth/rate, quieting the front end, and demanding less SNR (via coding, spreading, or robust modulation). Every improvement is a straightforward dB you can add up.</p>`
    },
    {
      h: 'From sensitivity to range: closing the link budget',
      html: String.raw`<p>Sensitivity is the receive end of the link budget (see <em>link-budget</em>). The received power must exceed sensitivity by the <em>fade/link margin</em>:</p>
      <p>$$P_{rx}=P_{tx}+G_{tx}+G_{rx}-L_{path}-L_{misc}\;\ge\;S_{min}+M_{fade}.$$</p>
      <p>Rearranging gives the maximum allowable path loss $L_{path,max}=P_{tx}+G_{tx}+G_{rx}-L_{misc}-M_{fade}-S_{min}$, which through the path-loss model (see <em>path-loss</em>) sets the maximum range. A 10 dB improvement in sensitivity (e.g. narrowing bandwidth or adding coding) buys 10 dB more allowable path loss — which in free space roughly <strong>triples</strong> the range ($20\log_{10}3\approx9.5$ dB), and even more in cluttered environments with higher path-loss exponents.</p>`
    },
    {
      h: 'Real systems compared',
      html: String.raw`<table class="data">
        <tr><th>System</th><th>Bandwidth</th><th>Typical sensitivity</th><th>Why</th></tr>
        <tr><td>GSM</td><td>200 kHz</td><td>$\approx-102$ dBm</td><td>Narrow BW, GMSK, ~9 dB required $C/N$, ~8 dB NF</td></tr>
        <tr><td>GPS C/A</td><td>2 MHz RF</td><td>$\approx-130$ dBm</td><td>Below noise floor; 43 dB processing gain recovers it</td></tr>
        <tr><td>Wi-Fi (11n, MCS0)</td><td>20 MHz</td><td>$\approx-92$ dBm</td><td>Wide BW raises floor; robust BPSK rate-1/2 at low MCS</td></tr>
        <tr><td>Wi-Fi (11n, 64-QAM)</td><td>20 MHz</td><td>$\approx-70$ dBm</td><td>High-order modulation needs ~25 dB SNR</td></tr>
        <tr><td>LoRa (SF12)</td><td>125 kHz</td><td>$\approx-137$ dBm</td><td>Narrow BW + chirp spread spectrum processing gain</td></tr>
        <tr><td>Bluetooth LE</td><td>1 MHz</td><td>$\approx-95$ dBm</td><td>1 MHz BW, GFSK, moderate required SNR</td></tr>
      </table>
      <p>The spread from $-70$ to $-137$ dBm — a factor of nearly $5\times10^6$ in power — is entirely explained by bandwidth, noise figure, required SNR and processing gain. Nothing magical: just the three terms of the sensitivity equation, plus spreading.</p>`
    }
  ],
  keyPoints: [
    String.raw`$S_{min}[\text{dBm}] = -174 + 10\log_{10}B + NF + (S/N)_{req}$ — noise floor + noise figure + required SNR.`,
    String.raw`$-174$ dBm/Hz is $kT_0$ at 290 K; multiply by bandwidth ($+10\log_{10}B$) to get the noise floor $kT_0B$.`,
    String.raw`Equivalent $E_b/N_0$ form: $S_{min}=-174+NF+10\log_{10}R_b+(E_b/N_0)_{req}$ — depends on bit rate, not occupied bandwidth.`,
    String.raw`Convert between forms with $S/N=(E_b/N_0)(R_b/B)$.`,
    String.raw`Every 10× wider bandwidth worsens sensitivity by 10 dB; every halving of data rate improves it 3 dB.`,
    String.raw`Every 1 dB reduction in noise figure improves sensitivity by exactly 1 dB; the first LNA dominates NF (Friis).`,
    String.raw`Every dB of FEC coding gain or processing gain lowers the required SNR/$E_b/N_0$ and improves sensitivity by the same dB.`,
    String.raw`MDS (minimum detectable signal) $=-174+10\log_{10}B+NF$ (0 dB SNR); sensitivity $=$ MDS $+ (S/N)_{req}$.`,
    String.raw`More negative sensitivity (dBm) means a more sensitive receiver — it can hear weaker signals.`,
    String.raw`A 10 dB sensitivity gain buys 10 dB more allowable path loss, roughly tripling free-space range.`,
    String.raw`Robust modulation (BPSK) needs low SNR (better sensitivity, low rate); high-order QAM needs high SNR (worse sensitivity, high rate).`,
    String.raw`GPS/LoRa reach far below the noise floor because spreading adds processing gain, effectively lowering the required SNR.`
  ],
  equations: [
    {
      title: String.raw`Sensitivity (SNR form)`,
      tex: String.raw`$$S_{min}[\mathrm{dBm}]=-174+10\log_{10}B+NF+\left(\frac{S}{N}\right)_{req}$$`,
      derivation: String.raw`<p>Noise floor is $N=kT_0BF$; in dBm that is $-174+10\log_{10}B+NF$. To meet the required SNR at the detector, the signal must exceed the floor by $(S/N)_{req}$. Adding it gives the minimum input signal power — the sensitivity.</p>`
    },
    {
      title: String.raw`Thermal noise floor / kT0`,
      tex: String.raw`$$N=kT_0B,\qquad 10\log_{10}\frac{kT_0}{1\,\mathrm{mW}}=-174\ \mathrm{dBm/Hz}$$`,
      derivation: String.raw`<p>$kT_0=(1.38\times10^{-23})(290)=4.0\times10^{-21}$ W/Hz. Dividing by 1 mW ($10^{-3}$ W) and taking $10\log_{10}$ gives $-174$ dBm/Hz. Multiply by $B$ (add $10\log_{10}B$) for total noise power.</p>`
    },
    {
      title: String.raw`Sensitivity (Eb/N0 form)`,
      tex: String.raw`$$S_{min}[\mathrm{dBm}]=-174+NF+10\log_{10}R_b+\left(\frac{E_b}{N_0}\right)_{req}$$`,
      derivation: String.raw`<p>Signal power $S=E_b R_b$ and noise density $N_0=kT_0F$. Required SNR is $E_b/N_0\cdot R_b/B$; substituting into the SNR-form sensitivity, the bandwidth cancels against $R_b/B$, leaving the bit rate $R_b$ and $E_b/N_0$. This shows sensitivity depends on information rate, not raw bandwidth.</p>`
    },
    {
      title: String.raw`SNR–Eb/N0 conversion`,
      tex: String.raw`$$\frac{S}{N}=\frac{E_b}{N_0}\cdot\frac{R_b}{B}$$`,
      derivation: String.raw`<p>$S=E_b R_b$ and $N=N_0 B$, so $S/N=(E_bR_b)/(N_0B)=(E_b/N_0)(R_b/B)$. In dB, add $10\log_{10}(R_b/B)$. For $R_b=B$ (e.g. BPSK at Nyquist) they coincide.</p>`
    },
    {
      title: String.raw`Minimum detectable signal (MDS)`,
      tex: String.raw`$$\text{MDS}[\mathrm{dBm}]=-174+10\log_{10}B+NF\quad(\text{0 dB SNR})$$`,
      derivation: String.raw`<p>Set $(S/N)_{req}=0$ dB in the sensitivity equation: the signal equals the noise floor. This is the bare detection limit; sensitivity for real demodulation adds the required SNR on top.</p>`
    },
    {
      title: String.raw`Sensitivity-limited maximum path loss`,
      tex: String.raw`$$L_{path,max}=P_{tx}+G_{tx}+G_{rx}-L_{misc}-M_{fade}-S_{min}$$`,
      derivation: String.raw`<p>Received power must satisfy $P_{rx}\ge S_{min}+M_{fade}$. Substitute $P_{rx}=EIRP+G_{rx}-L_{path}-L_{misc}$ and solve for $L_{path}$ to get the maximum tolerable path loss, which sets range via the path-loss model.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`Give the receiver sensitivity equation.`, back: String.raw`$S_{min}[\text{dBm}]=-174+10\log_{10}B+NF+(S/N)_{req}$ — thermal floor + noise figure + required SNR.` },
    { front: String.raw`Where does −174 dBm/Hz come from?`, back: String.raw`$kT_0$ at $T_0=290$ K: $(1.38\times10^{-23})(290)=4\times10^{-21}$ W/Hz $= -174$ dBm/Hz.` },
    { front: String.raw`State the $E_b/N_0$ form of sensitivity.`, back: String.raw`$S_{min}=-174+NF+10\log_{10}R_b+(E_b/N_0)_{req}$ — depends on bit rate, not occupied bandwidth.` },
    { front: String.raw`Convert required $E_b/N_0$ to required SNR.`, back: String.raw`$S/N=(E_b/N_0)(R_b/B)$; in dB add $10\log_{10}(R_b/B)$.` },
    { front: String.raw`Effect of 10× wider bandwidth on sensitivity?`, back: String.raw`Noise floor rises 10 dB, so sensitivity worsens (becomes 10 dB less negative).` },
    { front: String.raw`Effect of halving the data rate?`, back: String.raw`$10\log_{10}R_b$ drops 3 dB, so sensitivity improves by 3 dB.` },
    { front: String.raw`Effect of reducing NF by 1 dB?`, back: String.raw`Sensitivity improves by exactly 1 dB.` },
    { front: String.raw`What dominates a receiver's noise figure?`, back: String.raw`The first stage (LNA) by Friis's formula; minimize front-end loss before it, since each dB of loss adds ~1 dB NF.` },
    { front: String.raw`Define MDS.`, back: String.raw`Minimum detectable signal = input power for 0 dB output SNR $=-174+10\log_{10}B+NF$; sensitivity = MDS + required SNR.` },
    { front: String.raw`Why is LoRa (~−137 dBm) so much more sensitive than Wi-Fi (~−92 dBm)?`, back: String.raw`Narrow bandwidth (125 kHz vs 20 MHz lowers the floor) plus chirp spread-spectrum processing gain lowering the required SNR.` },
    { front: String.raw`How does FEC coding gain affect sensitivity?`, back: String.raw`It lowers required $E_b/N_0$/SNR by the coding gain, improving sensitivity dB-for-dB.` },
    { front: String.raw`Does a more negative dBm sensitivity mean better or worse?`, back: String.raw`Better — a more negative number means the receiver can decode weaker signals.` },
    { front: String.raw`How does 10 dB better sensitivity affect free-space range?`, back: String.raw`It allows 10 dB more path loss; since free-space loss $\propto R^2$, range roughly triples ($20\log_{10}3\approx9.5$ dB).` },
    { front: String.raw`Why can GPS be received below the noise floor?`, back: String.raw`43 dB of processing gain effectively lowers the required SNR, so the raw signal can sit ~20-30 dB under the floor.` }
  ],
  mcqs: [
    { q: String.raw`A receiver has 200 kHz bandwidth, 8 dB NF, and needs 9 dB SNR. Its sensitivity is closest to:`, options: [ String.raw`$-121$ dBm`, String.raw`$-104$ dBm`, String.raw`$-113$ dBm`, String.raw`$-95$ dBm` ], answer: 1, explain: String.raw`$S_{min}=-174+10\log_{10}(2\times10^5)+8+9=-174+53+8+9=-104$ dBm.` },
    { q: String.raw`The value $-174$ dBm/Hz is:`, options: [ String.raw`The receiver noise figure`, String.raw`Thermal noise density $kT_0$ at 290 K`, String.raw`The required $E_b/N_0$`, String.raw`The antenna gain` ], answer: 1, explain: String.raw`$kT_0$ at 290 K is $4\times10^{-21}$ W/Hz $=-174$ dBm/Hz — the thermal noise power spectral density.` },
    { q: String.raw`Halving the receiver's data rate (Eb/N0 form) changes sensitivity by:`, options: [ String.raw`$+3$ dB (worse)`, String.raw`$-3$ dB (better)`, String.raw`No change`, String.raw`$-6$ dB (better)` ], answer: 1, explain: String.raw`$10\log_{10}R_b$ drops 3 dB, so $S_{min}$ becomes 3 dB more negative — sensitivity improves by 3 dB.` },
    { q: String.raw`Which change does NOT improve sensitivity?`, options: [ String.raw`Reducing noise figure`, String.raw`Narrowing the bandwidth`, String.raw`Adding FEC coding gain`, String.raw`Increasing the data rate` ], answer: 3, explain: String.raw`Increasing $R_b$ raises $10\log_{10}R_b$, worsening sensitivity. The other three all reduce a term in the equation.` },
    { q: String.raw`MDS (minimum detectable signal) is defined at:`, options: [ String.raw`10 dB output SNR`, String.raw`0 dB output SNR (signal = noise floor)`, String.raw`3 dB below the noise floor`, String.raw`The 1 dB compression point` ], answer: 1, explain: String.raw`MDS is the input giving 0 dB output SNR: $-174+10\log_{10}B+NF$. Sensitivity adds the required SNR.` },
    { q: String.raw`A 20 MHz Wi-Fi receiver with 5 dB NF needs 20 dB SNR for 64-QAM. Sensitivity is about:`, options: [ String.raw`$-101$ dBm`, String.raw`$-76$ dBm`, String.raw`$-92$ dBm`, String.raw`$-70$ dBm` ], answer: 1, explain: String.raw`$-174+10\log_{10}(2\times10^7)+5+20=-174+73+5+20=-76$ dBm.` },
    { q: String.raw`Compared with the SNR form, the $E_b/N_0$ form of sensitivity replaces $10\log_{10}B$ with:`, options: [ String.raw`$10\log_{10}R_b$`, String.raw`$10\log_{10}(NF)$`, String.raw`$20\log_{10}B$`, String.raw`$10\log_{10}(B/R_b)$` ], answer: 0, explain: String.raw`Because $S/N=(E_b/N_0)(R_b/B)$, the bandwidth cancels and the bit rate $R_b$ appears: $S_{min}=-174+NF+10\log_{10}R_b+(E_b/N_0)_{req}$.` },
    { q: String.raw`Reducing NF from 8 dB to 3 dB improves sensitivity by:`, options: [ String.raw`2.5 dB`, String.raw`5 dB`, String.raw`10 dB`, String.raw`No change` ], answer: 1, explain: String.raw`Sensitivity improves 1 dB per dB of NF reduction, so $8-3=5$ dB better.` },
    { q: String.raw`Why is LoRa far more sensitive than Wi-Fi?`, options: [ String.raw`Higher transmit power`, String.raw`Narrow bandwidth plus chirp-spread processing gain lowering required SNR`, String.raw`Lower carrier frequency`, String.raw`Larger antenna` ], answer: 1, explain: String.raw`LoRa uses ~125 kHz (low floor) and CSS spreading (processing gain lowers required SNR), reaching ~$-137$ dBm.` },
    { q: String.raw`Improving sensitivity by 6 dB (free space) changes the achievable range by roughly:`, options: [ String.raw`$\times1.4$`, String.raw`$\times2$`, String.raw`$\times4$`, String.raw`$\times10$` ], answer: 1, explain: String.raw`6 dB extra path loss with free-space $R^2$ loss doubles range ($20\log_{10}2\approx6$ dB).` },
    { q: String.raw`A GPS signal arrives ~25 dB below the noise floor yet is decoded because:`, options: [ String.raw`The noise figure is negative`, String.raw`Processing gain (~43 dB) lowers the effective required SNR`, String.raw`GPS uses very high transmit power`, String.raw`Thermal noise is zero at L-band` ], answer: 1, explain: String.raw`Despreading provides ~43 dB of processing gain, effectively reducing the required input SNR so a below-floor signal clears threshold.` },
    { q: String.raw`Which term makes sensitivity depend on modulation and coding choice?`, options: [ String.raw`$-174$`, String.raw`$10\log_{10}B$`, String.raw`$(S/N)_{req}$ or $(E_b/N_0)_{req}$`, String.raw`The noise figure` ], answer: 2, explain: String.raw`The required SNR / $E_b/N_0$ is set by the modulation order and FEC; robust modulation and strong coding reduce it, improving sensitivity.` }
  ],
  numericals: [
    { q: String.raw`A receiver has bandwidth $B=1$ MHz, noise figure $NF=6$ dB, and requires $(S/N)_{req}=12$ dB. Compute (a) the noise floor, (b) the MDS, and (c) the sensitivity.`, solution: String.raw`(a) Noise floor $=-174+10\log_{10}(10^6)+NF=-174+60+6=-108$ dBm. (b) MDS (0 dB SNR) $=-108$ dBm (noise floor with NF). (c) $S_{min}=\text{MDS}+(S/N)_{req}=-108+12=-96$ dBm.` },
    { q: String.raw`A GSM receiver: $B=200$ kHz, $NF=8$ dB, required carrier-to-noise 9 dB. Find sensitivity and comment.`, solution: String.raw`$10\log_{10}(2\times10^5)=53$ dB. $S_{min}=-174+53+8+9=-104$ dBm. This is close to the GSM spec (~$-102$ dBm reference sensitivity for a mobile), confirming the model. Narrow BW is what keeps it so sensitive.` },
    { q: String.raw`A modem runs at $R_b=1$ Mbps and needs $E_b/N_0=10$ dB after FEC. The front-end NF is 4 dB. Use the $E_b/N_0$ form to find sensitivity.`, solution: String.raw`$S_{min}=-174+NF+10\log_{10}R_b+(E_b/N_0)_{req}=-174+4+10\log_{10}(10^6)+10=-174+4+60+10=-100$ dBm.` },
    { q: String.raw`Wi-Fi 20 MHz channel, $NF=5$ dB. For MCS0 (BPSK, rate 1/2) the required SNR is ~4 dB; for 64-QAM (rate 5/6) it is ~25 dB. Compute both sensitivities and the dynamic-range implication.`, solution: String.raw`$10\log_{10}(2\times10^7)=73$ dB. MCS0: $-174+73+5+4=-92$ dBm. 64-QAM: $-174+73+5+25=-71$ dBm. The 21 dB gap means the robust rate reaches ~11× farther (in free space, $10^{21/20}\approx11$ in path-loss terms), illustrating rate-vs-range adaptation.` },
    { q: String.raw`A LoRa link uses $B=125$ kHz, $NF=6$ dB, and SF12 gives an effective required SNR of about $-20$ dB (thanks to processing gain). Find the sensitivity.`, solution: String.raw`$10\log_{10}(1.25\times10^5)=51$ dB. $S_{min}=-174+51+6+(-20)=-137$ dBm. The negative required SNR (the signal can be 20 dB below noise, recovered by chirp spreading) is what pushes LoRa to ~$-137$ dBm.` },
    { q: String.raw`Compare noise figure vs bandwidth as sensitivity levers: a receiver at $B=2$ MHz, $NF=10$ dB, $(S/N)_{req}=10$ dB. You can either drop NF to 4 dB or narrow B to 500 kHz. Which helps more?`, solution: String.raw`Baseline: $-174+63+10+10=-91$ dBm. Option A (NF 10→4): improves 6 dB $\to -97$ dBm. Option B (B 2 MHz→500 kHz, $-6$ dB floor): $-174+57+10+10=-97$ dBm. Both give 6 dB, reaching $-97$ dBm — but narrowing B also cuts your data rate 4×, while lowering NF keeps the rate. If throughput matters, fix the NF.` },
    { q: String.raw`A link has $P_{tx}=20$ dBm, $G_{tx}=G_{rx}=6$ dBi, receiver sensitivity $-100$ dBm, fade margin 10 dB, miscellaneous losses 3 dB. What is the maximum allowable free-space path loss and range at 2.4 GHz?`, solution: String.raw`Max path loss $L=P_{tx}+G_{tx}+G_{rx}-L_{misc}-M_{fade}-S_{min}=20+6+6-3-10-(-100)=119$ dB. FSPL$=32.44+20\log_{10}(f_{MHz})+20\log_{10}(d_{km})$. $32.44+20\log_{10}(2400)=32.44+67.6=100.0$ dB at 1 km. Remaining $119-100=19$ dB $\Rightarrow 20\log_{10}d=19\Rightarrow d=10^{0.95}\approx8.9$ km.` },
    { q: String.raw`A designer adds a rate-1/2 convolutional code with 5 dB of coding gain to a receiver whose sensitivity was $-95$ dBm. Assuming bandwidth is held constant, what is the new sensitivity, and what range improvement (free space) does it give?`, solution: String.raw`Coding gain lowers the required SNR by 5 dB, so $S_{min}$ improves to $-95-5=-100$ dBm. Free-space range scales as $10^{5/20}\approx1.78\times$ — roughly a 78% range increase for the same link margin (ignoring the bandwidth expansion the code needs).` }
  ],
  realWorld: String.raw`<p>Receiver sensitivity is the headline spec on every radio datasheet — cellular handsets (3GPP reference sensitivity), Wi-Fi chipsets (per-MCS sensitivity tables), GPS/GNSS front ends (tracking sensitivity below $-160$ dBm with processing gain), LoRa and other LPWAN modules ($-137$ dBm enabling multi-kilometre IoT links), and satellite/deep-space receivers where cryogenically cooled LNAs push noise figure toward a fraction of a dB. It drives coverage planning (how many base stations to cover a city), battery life (a more sensitive receiver lets the transmitter use less power), and regulatory link design. The same three-term equation lets an engineer trade bandwidth, front-end quality and coding to hit a coverage target, and it is the receive-side anchor of every link budget.</p>`,
  related: [ 'noise-floor', 'noise-figure', 'eb-no', 'ber', 'link-budget', 'path-loss', 'processing-gain' ]
}
);
