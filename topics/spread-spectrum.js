// Spread Spectrum & Coding — deep exam-mastery study content
CONTENT.topics.push(
  {
    id: 'dsss',
    title: 'Direct-Sequence Spread Spectrum',
    category: 'Spread Spectrum & Coding',
    tags: ['DSSS', 'CDMA', 'processing gain', 'spreading', 'GPS', 'RAKE', 'jamming'],
    summary: String.raw`Direct-sequence spread spectrum multiplies the data by a high-rate pseudorandom chip sequence, widening the bandwidth to trade spectral occupancy for processing gain, low probability of intercept, and multiple-access capability.`,
    prerequisites: ['bpsk', 'psd', 'noise-floor', 'matched-filter'],
    intro: String.raw`<p><strong>Why DSSS exists.</strong> Ordinary narrowband radio has three chronic problems: it is easy to detect, easy to jam, and it lets only one user occupy a channel at a time. DSSS was invented to attack all three at once. The trick is counter-intuitive — you deliberately make the signal <em>wider</em> in bandwidth than the data needs, seemingly wasting spectrum. But that same widening is what buries the signal below the noise (hard to detect), dilutes any jammer (hard to jam), and lets many coded users overlap in the same band (multiple access). The rest of this topic is really one idea seen from these different angles.</p>
    <p>Direct-Sequence Spread Spectrum (DSSS) deliberately spreads a narrowband data signal over a much wider bandwidth by modulating each data symbol with a fast pseudo-noise (PN) <em>chip</em> sequence. The receiver, knowing the same PN code, <em>despreads</em> the signal, collapsing the wanted signal back to its original narrow bandwidth while simultaneously spreading any interferer that was not coded the same way. This asymmetry is the origin of DSSS's celebrated properties: <strong>processing gain</strong>, <strong>low probability of intercept/detection (LPI/LPD)</strong>, <strong>anti-jam (AJ) margin</strong>, and <strong>code-division multiple access (CDMA)</strong>. GPS, IS-95/CDMA2000, WCDMA, and Zigbee are all DSSS systems, and GPS famously arrives roughly 20-30 dB <em>below</em> the thermal noise floor yet is recovered by despreading.</p>`,
    sections: [
      {
        h: 'Chips versus bits: the two clocks',
        html: String.raw`<p>DSSS runs two distinct clocks. The <strong>data rate</strong> $R_b$ (bits/s) carries information; the <strong>chip rate</strong> $R_c$ (chips/s) is the PN sequence rate and is much higher, $R_c \gg R_b$. Each data bit is overlaid by an integer number of chips called the <em>spreading factor</em> or code length $N = R_c / R_b$.</p>
        <ul>
          <li><strong>Chip:</strong> one element of the PN sequence, value $\pm 1$, duration $T_c = 1/R_c$.</li>
          <li><strong>Bit:</strong> one data symbol, duration $T_b = 1/R_b = N T_c$.</li>
          <li>The transmitted bandwidth is set by the <em>chip</em> rate (roughly $R_c$ for BPSK chips), not the data rate. Spreading the same energy over $N\times$ more bandwidth lowers the power spectral density by $N$.</li>
        </ul>
        <div class="callout">A chip carries no information of its own — chips are known to both ends. Information lives only in the sign the data bit imposes on the whole chip block.</div>`
      },
      {
        h: 'Spreading and despreading mathematics',
        html: String.raw`<p>Let the data be a bipolar stream $d(t) \in \{ +1,-1\}$ at rate $R_b$ and the PN code $c(t) \in \{ +1,-1\}$ at rate $R_c$. The baseband transmit signal is the product</p>
        <p>$$ s(t) = d(t)\,c(t). $$</p>
        <p>Over the air with a carrier this becomes BPSK: $s_{RF}(t) = \sqrt{2P}\,d(t)c(t)\cos(2\pi f_c t)$. At the receiver, multiply by a synchronized local replica $c(t)$:</p>
        <p>$$ r(t)\,c(t) = d(t)\,c(t)\,c(t) + n(t)c(t) = d(t)\underbrace{c^2(t)}_{=1} + n(t)c(t) = d(t) + n(t)c(t). $$</p>
        <p>Because $c(t)=\pm1$, $c^2(t)=1$ and the data pops back out at rate $R_b$. Crucially, an interferer $j(t)$ that is <em>not</em> multiplied by the same code gets multiplied by $c(t)$ and is <strong>spread</strong> to bandwidth $R_c$; the integrate-and-dump matched filter over $T_b$ then rejects most of its energy.</p>
        <div class="callout">Despreading is correlation: it exploits that $c(t)c(t)=1$ for the aligned code but yields a near-zero average for anything else (interference, other users' codes, misaligned replicas).</div>`
      },
      {
        h: 'Processing gain and the PSD picture',
        html: String.raw`<p><strong>Processing gain</strong> quantifies the bandwidth expansion:</p>
        <p>$$ G_p = \frac{B_{ss}}{B_{data}} \approx \frac{R_c}{R_b} = N \quad\Longrightarrow\quad G_p[\text{dB}] = 10\log_{10}(N). $$</p>
        <p>Spreading holds total power $P$ constant but distributes it over $N\times$ the bandwidth, so the transmitted power spectral density drops by $10\log_{10}N$ dB. This is the LPI property — the signal can be hidden below the noise floor. On despreading, the wanted signal re-concentrates to $B_{data}$ while noise and interference stay spread, so the post-correlation SNR improves by $G_p$.</p>
        <table class="data">
          <tr><th>Quantity</th><th>Before despread</th><th>After despread</th></tr>
          <tr><td>Signal bandwidth</td><td>$R_c$</td><td>$R_b$</td></tr>
          <tr><td>Signal PSD</td><td>$P/R_c$</td><td>$P/R_b$</td></tr>
          <tr><td>Interference bandwidth</td><td>$B_j$</td><td>$R_c$ (spread)</td></tr>
          <tr><td>SNR / SINR</td><td>low</td><td>$+G_p$ dB</td></tr>
        </table>`
      },
      {
        h: 'Jamming margin and anti-jam',
        html: String.raw`<p>Processing gain is not free SNR — the receiver still needs a minimum $E_b/N_0$ to demodulate. The usable margin against a jammer is</p>
        <p>$$ M_j[\text{dB}] = G_p[\text{dB}] - \Big(\tfrac{E_b}{N_0}\Big)_{req}[\text{dB}] - L_{sys}[\text{dB}], $$</p>
        <p>where $L_{sys}$ lumps implementation losses. Example: $G_p = 30$ dB, required $E_b/N_0 = 10$ dB, losses 2 dB $\Rightarrow M_j = 18$ dB, meaning the jammer can be up to 18 dB stronger than the signal at the receiver and the link still closes.</p>
        <ul>
          <li><strong>Broadband (barrage) jamming</strong> is spread by despreading — DSSS is strong here.</li>
          <li><strong>Narrowband/tone jamming</strong> is spread across $R_c$ and looks like added noise — DSSS is strong here too.</li>
          <li><strong>Matched (repeat/follower) jamming</strong> or capturing the code defeats the gain; hence code secrecy and long codes matter.</li>
        </ul>`
      },
      {
        h: 'CDMA, the near-far problem, and RAKE',
        html: String.raw`<p><strong>CDMA</strong> lets many users share the same band simultaneously by assigning each a different (ideally orthogonal or low cross-correlation) code. User $k$'s receiver correlates against code $c_k$; other users' signals correlate poorly and appear as <em>multiple-access interference</em> (MAI), suppressed by roughly $G_p$.</p>
        <p><strong>Near-far problem:</strong> a nearby strong user can swamp a distant weak user because code isolation is finite (cross-correlation is not exactly zero). If user B is 30 dB stronger and cross-correlation suppression is only $G_p=21$ dB, user A is buried. The cure is tight, fast <strong>power control</strong> (as in IS-95, ~800 Hz closed loop) that equalizes received powers.</p>
        <p><strong>RAKE receiver:</strong> a wideband DSSS signal resolves multipath components separated by more than one chip ($>T_c$). A RAKE has several correlator "fingers," each aligned to a distinct multipath delay, then combines them (maximal-ratio combining). This turns delay spread from a foe into diversity gain.</p>
        <div class="callout">Wider chip rate = finer multipath resolution. This is why WCDMA (3.84 Mcps) resolves paths GPS or Zigbee can, but a narrowband system cannot.</div>`
      },
      {
        h: 'Case study: GPS below the noise floor',
        html: String.raw`<p>The GPS C/A code runs at $R_c = 1.023$ Mcps spreading a $R_b = 50$ bps navigation message, but the useful spreading for a 1 ms code period against a 50 Hz data bandwidth gives enormous gain. For the C/A signal the received power is around $-160$ dBW while the noise in the ~2 MHz null-to-null band is far higher; the C/A code (1023 chips, repeating every 1 ms) provides $10\log_{10}(1023)\approx 30.1$ dB of processing gain, lifting a signal that sits ~20-30 dB below the noise floor up to a demodulable SNR.</p>
        <ul>
          <li>Signal is undetectable to a narrowband spectrum analyzer — pure LPI.</li>
          <li>Different satellites use different Gold codes (CDMA), so all transmit on the same L1 carrier.</li>
          <li>Acquisition = 2-D search over code phase (1023 chips) and Doppler; despreading is a correlation peak search.</li>
        </ul>`
      },
      {
        h: 'Pitfalls and practical limits',
        html: String.raw`<ul>
          <li><strong>Code synchronization is everything.</strong> A half-chip misalignment collapses the correlation; acquisition (coarse) then tracking (DLL/early-late, Costas for carrier) is mandatory.</li>
          <li><strong>Processing gain does not beat thermal noise per bit.</strong> It buys margin against interference, not free $E_b/N_0$; you still integrate $N$ chips to accumulate bit energy.</li>
          <li><strong>Finite code cross-correlation</strong> sets the CDMA capacity and the near-far sensitivity.</li>
          <li><strong>Bandwidth cost:</strong> DSSS demands wide RF front ends, fast ADCs, and precise chip timing — expensive versus narrowband for the same data rate.</li>
        </ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">Tie it together: one operation — multiply by a fast known code — buys hiding, anti-jam, and multiple access simultaneously.</div>
        <ul>
          <li><strong>Two clocks, one signal:</strong> the fast chip rate $R_c$ sets the bandwidth and the slow bit rate $R_b$ carries the information; their ratio $N=R_c/R_b$ is the spreading factor.</li>
          <li><strong>Despreading is correlation:</strong> multiplying by the aligned replica works because $c(t)c(t)=1$; anything uncoded (noise, jammer, other users) instead gets spread and averaged away.</li>
          <li><strong>Processing gain $G_p=10\log_{10}N$</strong> lowers transmitted PSD (LPI) and, after despreading, raises SINR by $N$ — but it is interference margin, not free thermal-noise $E_b/N_0$.</li>
          <li><strong>Jam margin</strong> $M_j=G_p-(E_b/N_0)_{req}-L_{sys}$ tells you how much stronger a jammer can be and still lose.</li>
          <li><strong>CDMA and its cost:</strong> distinct codes let many users overlap, limited by cross-correlation, the near-far problem (needs power control), and cured/enhanced by RAKE combining and long codes.</li>
          <li><strong>GPS is the extreme case:</strong> a 1023-chip code recovers a signal 20–30 dB below the noise floor — pure correlation gain.</li>
        </ul>`
      }
    ],
    keyPoints: [
      String.raw`DSSS multiplies data by a fast $\pm1$ PN chip sequence; the receiver despreads with a synchronized replica since $c(t)c(t)=1$.`,
      String.raw`Spreading factor $N = R_c/R_b$; processing gain $G_p = 10\log_{10}N$ dB.`,
      String.raw`Bandwidth is set by chip rate; PSD falls by $N$, giving LPI/LPD (hiding below the noise floor).`,
      String.raw`Despreading spreads any uncoded interferer to $R_c$, then the matched filter rejects it — this is the anti-jam mechanism.`,
      String.raw`Jam margin $M_j = G_p - (E_b/N_0)_{req} - L_{sys}$ in dB.`,
      String.raw`CDMA assigns distinct codes; residual multiple-access interference is limited by code cross-correlation.`,
      String.raw`Near-far problem: a strong close user swamps a weak far user; fast power control is the fix.`,
      String.raw`RAKE receiver resolves multipath separated by more than a chip and combines fingers for diversity.`,
      String.raw`GPS C/A: 1023-chip code at 1.023 Mcps yields ~30 dB gain, recovering a signal 20-30 dB below noise.`,
      String.raw`Chips carry no information; the data bit imposes its sign on an entire block of known chips.`,
      String.raw`Processing gain gives interference margin, not free thermal-noise $E_b/N_0$.`,
      String.raw`Chip/half-chip synchronization is essential; acquisition then tracking (DLL early-late + Costas).`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">DSSS spreading and despreading (bipolar)</text>
          <text x="10" y="55" fill="#9aa7b5" font-size="11">data d(t)</text>
          <path d="M60 60 H180 V90 H300 V60 H420" fill="none" stroke="#4dabf7" stroke-width="2"/>
          <text x="10" y="120" fill="#9aa7b5" font-size="11">chips c(t)</text>
          <path d="M60 110 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15" fill="none" stroke="#ffa94d" stroke-width="1.5"/>
          <text x="10" y="185" fill="#9aa7b5" font-size="11">s=d·c</text>
          <path d="M60 175 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h30 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15 v20 h15 v-20 h15" fill="none" stroke="#63e6be" stroke-width="1.5"/>
          <text x="60" y="235" fill="#b197fc" font-size="11">Rb (slow)</text>
          <text x="220" y="235" fill="#b197fc" font-size="11">Rc = N·Rb (fast chips)</text>
        </svg>`,
        caption: 'A data bit (blue) is multiplied by the fast chip sequence (orange) to form the spread signal (green). Despreading multiplies by the same chips again to recover the data.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="240" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">PSD before vs after despreading</text>
          <line x1="40" y1="200" x2="520" y2="200" stroke="#9aa7b5" stroke-width="1"/>
          <line x1="40" y1="200" x2="40" y2="40" stroke="#9aa7b5" stroke-width="1"/>
          <text x="500" y="216" fill="#9aa7b5" font-size="10">freq</text>
          <text x="8" y="60" fill="#9aa7b5" font-size="10">PSD</text>
          <rect x="80" y="150" width="360" height="50" fill="#4dabf7" opacity="0.35"/>
          <text x="180" y="140" fill="#4dabf7" font-size="10">spread signal (low PSD, wide)</text>
          <rect x="250" y="70" width="30" height="130" fill="#63e6be" opacity="0.7"/>
          <text x="290" y="80" fill="#63e6be" font-size="10">after despread (narrow, high)</text>
          <rect x="300" y="120" width="20" height="80" fill="#ff6b6b" opacity="0.6"/>
          <text x="325" y="115" fill="#ff6b6b" font-size="10">tone jammer</text>
          <path d="M300 120 q60 -10 120 -5" fill="none" stroke="#ff6b6b" stroke-width="1" stroke-dasharray="3 3"/>
          <text x="400" y="112" fill="#ff6b6b" font-size="9">jammer spread out</text>
        </svg>`,
        caption: 'Spreading lowers signal PSD (LPI). Despreading re-concentrates the wanted signal while a narrowband jammer is spread across the chip bandwidth and rejected.'
      },
      {
        title: String.raw`Full DSSS transmit/receive chain`,
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="250" fill="#1c232e"/>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">DSSS tx/rx chain: spread, channel, despread, integrate</text>
          <text x="20" y="55" fill="#9aa7b5" font-size="10">data d(t)</text>
          <circle cx="90" cy="70" r="11" fill="none" stroke="#ffa94d" stroke-width="1.5"/><text x="90" y="75" fill="#ffa94d" font-size="13" text-anchor="middle">×</text>
          <rect x="30" y="95" width="70" height="26" fill="none" stroke="#b197fc" stroke-width="1.5"/><text x="65" y="112" fill="#e6edf3" font-size="9" text-anchor="middle">PN c(t)</text>
          <rect x="140" y="57" width="66" height="28" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="173" y="75" fill="#e6edf3" font-size="9" text-anchor="middle">BPSK mod</text>
          <rect x="238" y="57" width="70" height="28" fill="none" stroke="#9aa7b5" stroke-width="1.5"/><text x="273" y="71" fill="#e6edf3" font-size="9" text-anchor="middle">channel</text><text x="273" y="82" fill="#9aa7b5" font-size="8" text-anchor="middle">+noise/jam</text>
          <rect x="340" y="57" width="66" height="28" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="373" y="75" fill="#e6edf3" font-size="9" text-anchor="middle">BPSK demod</text>
          <circle cx="452" cy="71" r="11" fill="none" stroke="#ffa94d" stroke-width="1.5"/><text x="452" y="76" fill="#ffa94d" font-size="13" text-anchor="middle">×</text>
          <rect x="392" y="150" width="120" height="28" fill="none" stroke="#b197fc" stroke-width="1.5"/><text x="452" y="168" fill="#e6edf3" font-size="9" text-anchor="middle">aligned PN c(t)</text>
          <rect x="330" y="180" width="120" height="30" fill="none" stroke="#63e6be" stroke-width="1.5"/><text x="390" y="199" fill="#e6edf3" font-size="9" text-anchor="middle">integrate over Tb</text>
          <text x="290" y="205" fill="#9aa7b5" font-size="10" text-anchor="end">d&#770;</text>
          <line x1="70" y1="55" x2="79" y2="63" stroke="#9aa7b5" marker-end="url(#arr3-dsss)"/>
          <line x1="65" y1="95" x2="87" y2="82" stroke="#9aa7b5" marker-end="url(#arr3-dsss)"/>
          <line x1="101" y1="70" x2="140" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-dsss)"/>
          <line x1="206" y1="71" x2="238" y2="71" stroke="#9aa7b5" marker-end="url(#arr3-dsss)"/>
          <line x1="308" y1="71" x2="340" y2="71" stroke="#9aa7b5" marker-end="url(#arr3-dsss)"/>
          <line x1="406" y1="71" x2="441" y2="71" stroke="#9aa7b5" marker-end="url(#arr3-dsss)"/>
          <line x1="452" y1="150" x2="452" y2="83" stroke="#9aa7b5" marker-end="url(#arr3-dsss)"/>
          <line x1="452" y1="82" x2="452" y2="180" stroke="#9aa7b5"/>
          <line x1="452" y1="195" x2="290" y2="195" stroke="#9aa7b5" marker-end="url(#arr3-dsss)"/>
          <text x="115" y="52" fill="#63e6be" font-size="8">spread s=d·c</text>
          <text x="410" y="52" fill="#63e6be" font-size="8">despread</text>
          <defs><marker id="arr3-dsss" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#9aa7b5"/></marker></defs>
        </svg>`,
        caption: 'End-to-end DSSS: data is multiplied by the PN code and BPSK-modulated; after the noisy/jammed channel the receiver despreads with the time-aligned PN replica and integrates over each bit period to recover the estimate.'
      }
    ],
    equations: [
      {
        title: 'Spreading factor / code length',
        tex: String.raw`$$ N = \frac{R_c}{R_b} = \frac{T_b}{T_c} $$`,
        derivation: String.raw`<p>Each data bit of duration $T_b$ spans an integer number of chips of duration $T_c$. Dividing, $N = T_b/T_c = R_c/R_b$. For GPS C/A, $N=1{,}023{,}000/1000$ per 1 ms code = 1023 chips per code period.</p>`
      },
      {
        title: 'Processing gain (dB)',
        tex: String.raw`$$ G_p = 10\log_{10}\!\left(\frac{B_{ss}}{B_{data}}\right) \approx 10\log_{10} N $$`,
        derivation: String.raw`<p>Total power $P$ is fixed but occupies bandwidth expanded by factor $N$, so PSD $\propto 1/N$. Despreading recovers signal to $B_{data}$ while noise/interference remain over $B_{ss}$, improving SINR by the ratio $B_{ss}/B_{data}=N$. In dB, $G_p=10\log_{10}N$. For $N=1023$, $G_p=10\log_{10}1023\approx 30.1$ dB.</p>`
      },
      {
        title: 'Despreading identity',
        tex: String.raw`$$ r(t)c(t) = d(t)c^2(t) + n(t)c(t) = d(t) + n(t)c(t) $$`,
        derivation: String.raw`<p>Transmit $s=d\,c$ with $c=\pm1$. The receiver multiplies the received $r=s+n$ by the aligned replica $c$. Since $c^2=1$, the data term collapses to $d(t)$ at rate $R_b$; the noise term $n\,c$ stays wideband and is averaged down by the integrate-and-dump over $T_b$.</p>`
      },
      {
        title: 'Jamming margin',
        tex: String.raw`$$ M_j = G_p - \left(\frac{E_b}{N_0}\right)_{req} - L_{sys}\ \ [\text{dB}] $$`,
        derivation: String.raw`<p>The receiver needs $(E_b/N_0)_{req}$ to hit the target BER. Processing gain provides $G_p$ dB of interference suppression. Subtract the required demod margin and implementation loss $L_{sys}$ to get the tolerable jammer-to-signal ratio. Example: $30-10-2=18$ dB.</p>`
      },
      {
        title: 'Post-despread SINR improvement',
        tex: String.raw`$$ \mathrm{SINR}_{out} = G_p \cdot \mathrm{SINR}_{in} \quad\Rightarrow\quad \Delta\ \text{dB} = 10\log_{10}N $$`,
        derivation: String.raw`<p>Wanted signal power is preserved through correlation; uncoded interference power is reduced by $N$ because it is spread to $B_{ss}$ and only a fraction $B_{data}/B_{ss}=1/N$ falls in the post-correlation bandwidth. Hence output SINR = $N\times$ input SINR.</p>`
      },
      {
        title: 'CDMA capacity (interference-limited, single cell)',
        tex: String.raw`$$ \frac{E_b}{N_0} \approx \frac{G_p}{K-1} \quad\Rightarrow\quad K \approx 1 + \frac{G_p}{(E_b/N_0)_{req}} $$`,
        derivation: String.raw`<p>With $K$ equal-power users, one desired user sees $K-1$ interferers each suppressed by $G_p$. Setting the resulting $E_b/N_0$ to the requirement and solving for $K$ gives the pole capacity. Voice activity and sectorization multiply this in practice; $G_p$ here is the numeric spreading factor $N$.</p>`
      },
      {
        title: 'GPS C/A processing gain',
        tex: String.raw`$$ G_p = 10\log_{10}\!\left(\frac{1.023\times10^6}{50}\right) \approx 43\ \text{dB} $$`,
        derivation: String.raw`<p>With chip rate 1.023 Mcps and 50 bps nav data, the raw spreading ratio is $1.023\times10^6/50 = 20460$, giving $10\log_{10}(20460)\approx43$ dB of ideal despreading gain, which is why GPS is recoverable tens of dB below the noise floor. (Per 1 ms code period the code length is 1023 chips = ~30 dB.)</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What distinguishes a chip from a bit in DSSS?`, back: String.raw`A bit carries information at rate $R_b$; a chip is a known PN element at the faster rate $R_c$. Each bit spans $N=R_c/R_b$ chips.` },
      { front: String.raw`Define processing gain and its dB form.`, back: String.raw`$G_p = B_{ss}/B_{data} \approx R_c/R_b = N$; $G_p[\text{dB}]=10\log_{10}N$.` },
      { front: String.raw`Why does despreading work mathematically?`, back: String.raw`The local replica $c(t)=\pm1$ satisfies $c^2(t)=1$, so multiplying returns $d(t)$; uncoded interference gets multiplied by $c(t)$ and is spread.` },
      { front: String.raw`What is the LPI property of DSSS?`, back: String.raw`Spreading lowers PSD by $10\log_{10}N$ dB, letting the signal hide below the noise floor (low probability of intercept/detection).` },
      { front: String.raw`Write the jamming margin equation.`, back: String.raw`$M_j = G_p - (E_b/N_0)_{req} - L_{sys}$ (dB).` },
      { front: String.raw`What is the near-far problem?`, back: String.raw`A strong nearby user overwhelms a weak distant user because code cross-correlation isolation is finite; fixed by fast power control.` },
      { front: String.raw`What does a RAKE receiver do?`, back: String.raw`Assigns correlator fingers to distinct multipath delays (separated by $>T_c$) and combines them (MRC) for diversity gain.` },
      { front: String.raw`Does processing gain improve thermal-noise $E_b/N_0$?`, back: String.raw`No. It provides interference/jamming margin; you still integrate $N$ chips to accumulate the required bit energy.` },
      { front: String.raw`GPS C/A code length and chip rate?`, back: String.raw`1023 chips repeating every 1 ms at 1.023 Mcps; ~30 dB gain per code period.` },
      { front: String.raw`What sets DSSS transmitted bandwidth?`, back: String.raw`The chip rate $R_c$, not the data rate.` },
      { front: String.raw`How does DSSS handle a narrowband tone jammer?`, back: String.raw`Despreading multiplies the tone by $c(t)$, spreading it over $R_c$; the matched filter then rejects most of its power.` },
      { front: String.raw`Single-cell CDMA pole capacity formula?`, back: String.raw`$K \approx 1 + G_p/(E_b/N_0)_{req}$ with equal-power users.` },
      { front: String.raw`Why must code sync be within a fraction of a chip?`, back: String.raw`The autocorrelation peak is only $\sim T_c$ wide; a half-chip offset collapses the correlation output.` }
    ],
    mcqs: [
      { q: String.raw`In DSSS, the transmitted RF bandwidth is primarily determined by:`, options: [String.raw`the data rate $R_b$`, String.raw`the chip rate $R_c$`, String.raw`the carrier frequency`, String.raw`the FEC code rate`], answer: 1, explain: String.raw`Bandwidth $\approx R_c$; chips are much faster than bits.` },
      { q: String.raw`A DSSS system uses $R_c=10$ Mcps and $R_b=10$ kbps. Processing gain is:`, options: [String.raw`10 dB`, String.raw`20 dB`, String.raw`30 dB`, String.raw`60 dB`], answer: 2, explain: String.raw`$N=10^7/10^4=1000$; $10\log_{10}1000=30$ dB.` },
      { q: String.raw`Despreading relies on the identity:`, options: [String.raw`$c(t)+c(t)=2c(t)$`, String.raw`$c^2(t)=1$ for $c=\pm1$`, String.raw`$c(t)=0$ on average`, String.raw`$d(t)c(t)=0$`], answer: 1, explain: String.raw`Squaring a bipolar $\pm1$ code gives 1, returning the data.` },
      { q: String.raw`Processing gain of 25 dB, required $E_b/N_0$ of 9 dB, losses 2 dB. Jam margin is:`, options: [String.raw`14 dB`, String.raw`16 dB`, String.raw`18 dB`, String.raw`36 dB`], answer: 0, explain: String.raw`$25-9-2=14$ dB.` },
      { q: String.raw`The near-far problem in CDMA is best mitigated by:`, options: [String.raw`longer traceback`, String.raw`fast transmit power control`, String.raw`higher carrier frequency`, String.raw`interleaving`], answer: 1, explain: String.raw`Equalizing received powers keeps a strong user from swamping a weak one.` },
      { q: String.raw`A RAKE receiver requires that resolvable multipath be separated by more than:`, options: [String.raw`one bit period $T_b$`, String.raw`one chip period $T_c$`, String.raw`one symbol of FEC`, String.raw`the coherence time`], answer: 1, explain: String.raw`DSSS resolves paths spaced by more than a chip.` },
      { q: String.raw`Processing gain provides:`, options: [String.raw`free thermal-noise $E_b/N_0$`, String.raw`margin against interference/jamming`, String.raw`carrier phase recovery`, String.raw`lower data latency`], answer: 1, explain: String.raw`It suppresses uncoded interference, not thermal noise per bit.` },
      { q: String.raw`GPS C/A signals from different satellites share L1 by using:`, options: [String.raw`FDMA`, String.raw`TDMA`, String.raw`different Gold codes (CDMA)`, String.raw`polarization`], answer: 2, explain: String.raw`Each SV has a distinct PRN Gold code.` },
      { q: String.raw`Spreading a fixed-power signal over $N\times$ bandwidth changes its PSD by:`, options: [String.raw`$+10\log_{10}N$ dB`, String.raw`$-10\log_{10}N$ dB`, String.raw`no change`, String.raw`$-20\log_{10}N$ dB`], answer: 1, explain: String.raw`Same power over more bandwidth means lower PSD by $10\log_{10}N$.` },
      { q: String.raw`Which jammer type is DSSS LEAST able to defeat with processing gain alone?`, options: [String.raw`broadband barrage`, String.raw`single CW tone`, String.raw`a follower jammer that captures the code`, String.raw`partial-band noise`], answer: 2, explain: String.raw`If the code is known/repeated, the correlation advantage is lost.` },
      { q: String.raw`Post-despread SINR relative to pre-despread SINR improves by a factor of about:`, options: [String.raw`$\sqrt N$`, String.raw`$N$`, String.raw`$N^2$`, String.raw`$\log N$`], answer: 1, explain: String.raw`Interference is reduced by the spreading factor $N$.` },
      { q: String.raw`Single-cell CDMA capacity is approximately:`, options: [String.raw`$K\approx N$`, String.raw`$K\approx 1+G_p/(E_b/N_0)_{req}$`, String.raw`$K\approx 2^{n}-1$`, String.raw`$K\approx R_c/R_b^2$`], answer: 1, explain: String.raw`Interference-limited pole capacity with equal-power users.` },
      { q: String.raw`If code timing is off by half a chip, the correlator output:`, options: [String.raw`is unchanged`, String.raw`doubles`, String.raw`collapses toward zero`, String.raw`increases by 3 dB`], answer: 2, explain: String.raw`The autocorrelation triangle is only $\pm T_c$ wide.` }
    ],
    numericals: [
      { q: String.raw`A DSSS link has $R_c = 4.096$ Mcps and $R_b = 16$ kbps. Find $N$ and $G_p$ in dB.`, solution: String.raw`<p><b>Formula.</b> $$ N = \frac{R_c}{R_b}, \qquad G_p[\text{dB}] = 10\log_{10} N, $$ where $R_c$ is the chip rate (chips/s), $R_b$ the data rate (bits/s), $N$ the spreading factor, and $G_p$ the processing gain.</p>
        <p><b>Substitute.</b> $$ N = \frac{4.096\times10^6}{16\times10^3}, \qquad G_p = 10\log_{10}(256). $$</p>
        <p><b>Compute.</b> $N = 256$; $G_p = 10\times 2.408 = 24.1$ dB.</p>
        <p><b>Explanation.</b> Each data bit is spread over 256 chips, so the transmitted bandwidth is 256 times the data bandwidth and the receiver gains 24.1 dB of interference suppression on despreading. Sanity check: $256 = 2^8$, and $10\log_{10}2\approx3$ dB, so $8\times3\approx24$ dB — consistent.</p>` },
      { q: String.raw`Required $E_b/N_0 = 8$ dB, $G_p = 27$ dB, implementation loss 3 dB. What is the jam margin, and by how much can a jammer exceed the signal?`, solution: String.raw`<p><b>Formula.</b> $$ M_j = G_p - \left(\frac{E_b}{N_0}\right)_{req} - L_{sys}\ \ [\text{dB}], $$ where $M_j$ is the jamming margin, $G_p$ the processing gain, $(E_b/N_0)_{req}$ the demod requirement, and $L_{sys}$ implementation loss (all dB).</p>
        <p><b>Substitute.</b> $$ M_j = 27 - 8 - 3. $$</p>
        <p><b>Compute.</b> $M_j = 16$ dB.</p>
        <p><b>Explanation.</b> A jammer can be up to 16 dB stronger than the signal at the receiver and the link still closes. This is the usable slice of processing gain left after paying the demod requirement and losses — it quantifies anti-jam robustness directly.</p>` },
      { q: String.raw`A CDMA cell needs $E_b/N_0 = 7$ dB (numeric 5.01) and uses spreading factor $N=128$. Estimate single-cell pole capacity.`, solution: String.raw`<p><b>Formula.</b> $$ K \approx 1 + \frac{G_p}{(E_b/N_0)_{req}}, $$ where $K$ is the number of equal-power users, $G_p=N$ the numeric spreading factor, and $(E_b/N_0)_{req}$ the numeric (linear) demod requirement.</p>
        <p><b>Substitute.</b> $$ K \approx 1 + \frac{128}{5.01}. $$</p>
        <p><b>Compute.</b> $128/5.01 = 25.5$, so $K \approx 1 + 25.5 = 26.5 \approx 26$ users.</p>
        <p><b>Explanation.</b> The desired user tolerates about 25 equal-power interferers, each suppressed by the spreading factor, before its $E_b/N_0$ falls below requirement. This is the interference-limited pole capacity; voice activity and sectorization multiply it further in real systems.</p>` },
      { q: String.raw`GPS C/A: chip rate 1.023 Mcps, code period 1 ms. How many chips per period and what is the per-period processing gain in dB?`, solution: String.raw`<p><b>Formula.</b> $$ L = R_c\,T_{code}, \qquad G_p[\text{dB}] = 10\log_{10} L, $$ where $L$ is chips per code period, $R_c$ the chip rate, and $T_{code}$ the code period.</p>
        <p><b>Substitute.</b> $$ L = 1.023\times10^6 \times 10^{-3}, \qquad G_p = 10\log_{10}(1023). $$</p>
        <p><b>Compute.</b> $L = 1023$ chips; $G_p = 10\times 3.010 = 30.1$ dB.</p>
        <p><b>Explanation.</b> Correlating over the full 1023-chip code period yields about 30 dB of gain, which is why a GPS C/A signal buried 20–30 dB below the noise floor becomes demodulable. Note $1023 = 2^{10}-1$, the length of a degree-10 m-sequence.</p>` },
      { q: String.raw`A tone jammer has power 20 dB above the DSSS signal at the antenna. With $G_p = 30$ dB and required $E_b/N_0 = 10$ dB, does the link close (ignore losses)?`, solution: String.raw`<p><b>Formula.</b> $$ \left(\frac{E_b}{N_0}\right)_{avail} = G_p - (J/S), \qquad \text{link closes if } \left(\frac{E_b}{N_0}\right)_{avail} \ge \left(\frac{E_b}{N_0}\right)_{req}, $$ where $J/S$ is the jammer-to-signal ratio at the antenna (dB).</p>
        <p><b>Substitute.</b> $$ \left(\frac{E_b}{N_0}\right)_{avail} = 30 - 20 = 10\ \text{dB}, \qquad \text{compare with } 10\ \text{dB}. $$</p>
        <p><b>Compute.</b> Available $= 10$ dB, required $= 10$ dB, so margin $= 10 - 10 = 0$ dB.</p>
        <p><b>Explanation.</b> The link just closes with exactly zero margin: the 30 dB of gain covers the 20 dB jammer and leaves precisely the 10 dB the demodulator needs. Any implementation loss or fade would break it, so in practice you would want headroom.</p>` },
      { q: String.raw`Resolve multipath: chip rate 3.84 Mcps. What path delay difference can a RAKE resolve, and what distance does that correspond to?`, solution: String.raw`<p><b>Formula.</b> $$ T_c = \frac{1}{R_c}, \qquad d = c\,T_c, $$ where $T_c$ is the chip duration, $R_c$ the chip rate, $c=3\times10^8$ m/s, and $d$ the resolvable path-length difference.</p>
        <p><b>Substitute.</b> $$ T_c = \frac{1}{3.84\times10^6}, \qquad d = 3\times10^8 \times 260\times10^{-9}. $$</p>
        <p><b>Compute.</b> $T_c = 260$ ns; $d = 78$ m.</p>
        <p><b>Explanation.</b> A RAKE finger can separate multipath components whose arrival times differ by more than one chip (~260 ns), i.e. path lengths differing by more than ~78 m. Wider chip rates give finer resolution, turning delay spread into diversity rather than fading.</p>` }
    ],
    realWorld: String.raw`<p>DSSS underpins GPS (Gold-coded CDMA below the noise floor), IS-95/CDMA2000 and WCDMA cellular (soft handoff and RAKE combining), IEEE 802.15.4/Zigbee (11-chip Barker-like spreading), and military tactical links needing LPI/AJ. The RAKE receiver and fast closed-loop power control were the enabling innovations that let CDMA cellular scale. GPS demonstrates the extreme: recovering a signal 20-30 dB beneath thermal noise purely through correlation gain.</p>`,
    related: ['pn-codes', 'gold-code', 'frequency-hopping', 'bpsk', 'matched-filter']
  },
  {
    id: 'frequency-hopping',
    title: 'Frequency Hopping',
    category: 'Spread Spectrum & Coding',
    tags: ['FHSS', 'dwell', 'hop set', 'fast hopping', 'slow hopping', 'anti-jam', 'Bluetooth'],
    summary: String.raw`Frequency-hopping spread spectrum rapidly changes the carrier frequency according to a pseudorandom hop pattern, spreading energy over a wide band in time and evading narrowband and partial-band jammers.`,
    prerequisites: ['dsss', 'pn-codes', 'psd', 'bpsk'],
    intro: String.raw`<p><strong>Why frequency hopping exists.</strong> DSSS spreads a signal by making it instantaneously wide, which demands a wide, fast, expensive receiver and razor-sharp chip timing. Frequency hopping reaches a similar goal by a completely different route: stay narrowband at every instant, but keep <em>moving</em> the narrow signal around a wide band on a secret schedule. A jammer that does not know the schedule cannot follow you; a listener sees only brief flashes scattered across the band. Because only one narrow channel is used at a time, the radio hardware stays simple and the timing tolerance is loose — you only have to agree on <em>which channel next</em>, not on individual chips. That trade — agility and simplicity instead of instantaneous width — is the reason FHSS exists.</p>
    <p>Frequency-Hopping Spread Spectrum (FHSS) achieves bandwidth expansion not by continuous multiplication (as in DSSS) but by hopping the carrier among many frequencies in a pseudorandom sequence known to both transmitter and receiver. At any instant the signal is narrowband, but averaged over time it occupies the whole hop band. FHSS is prized for anti-jam robustness (a jammer must cover many channels or predict the hops), for graceful coexistence (Bluetooth's adaptive hopping dodges Wi-Fi), and for avoiding the strict chip-level synchronization DSSS demands. This topic covers fast vs slow hopping, dwell time, the hop set, processing gain, partial-band jamming, adaptive hopping, and a head-to-head comparison with DSSS.</p>`,
    sections: [
      {
        h: 'The hopping mechanism and hop set',
        html: String.raw`<p>A PN generator drives a frequency synthesizer, selecting one of $M$ carrier frequencies (the <strong>hop set</strong>) each hop interval. The instantaneous transmission is ordinary narrowband modulation (often FSK or GFSK, sometimes MPSK) at the current carrier. Both ends step through the same hop sequence in lockstep.</p>
        <ul>
          <li><strong>Hop set size</strong> $M$: number of available channels (e.g. Bluetooth classic uses 79 channels of 1 MHz).</li>
          <li><strong>Hop rate</strong> $R_h$: hops per second (Bluetooth: 1600 hops/s).</li>
          <li><strong>Dwell time</strong> $T_d = 1/R_h$: time spent on each frequency.</li>
          <li><strong>Total spread bandwidth</strong> $W_{ss} \approx M \cdot \Delta f$ where $\Delta f$ is the channel spacing.</li>
        </ul>
        <div class="callout">FHSS spreads in the time-frequency plane: narrowband at any instant, wideband on average. A spectrum analyzer with slow sweep sees a smear across all channels.</div>`
      },
      {
        h: 'Fast versus slow hopping',
        html: String.raw`<p>The classification depends on how the hop rate $R_h$ compares to the symbol rate $R_s$:</p>
        <table class="data">
          <tr><th>Type</th><th>Condition</th><th>Meaning</th></tr>
          <tr><td>Slow hopping</td><td>$R_h < R_s$</td><td>Multiple symbols per hop (one or more bits on each frequency)</td></tr>
          <tr><td>Fast hopping</td><td>$R_h > R_s$</td><td>Multiple hops per symbol (each symbol is split across several frequencies)</td></tr>
        </table>
        <p><strong>Fast hopping</strong> gives frequency diversity within a symbol and superior anti-jam (a jammer cannot reliably corrupt a whole symbol), but demands a fast, agile synthesizer and non-coherent detection (carrier phase cannot be maintained across hops). <strong>Slow hopping</strong> is simpler and can be more spectrally efficient but a hit on one hop can corrupt a whole burst of symbols — hence it leans on FEC and interleaving.</p>`
      },
      {
        h: 'Processing gain in FHSS',
        html: String.raw`<p>The FHSS processing gain equals the ratio of the total hopped bandwidth to the instantaneous (per-hop) bandwidth:</p>
        <p>$$ G_p \approx \frac{W_{ss}}{B_{inst}} \approx M \quad\Rightarrow\quad G_p[\text{dB}] = 10\log_{10} M. $$</p>
        <p>Roughly, $G_p$ equals the number of hop channels $M$. If a jammer occupies only one channel, on average it corrupts a fraction $1/M$ of hops. This is why increasing the hop set improves anti-jam — but it also stresses the synthesizer's tuning range and settling time.</p>
        <div class="callout">Unlike DSSS where $G_p=R_c/R_b$, FHSS gain is set by the number of channels $M$, decoupled from the hop rate itself.</div>`
      },
      {
        h: 'Partial-band and follower jamming',
        html: String.raw`<p>A smart jammer will not waste power across the whole band. In <strong>partial-band jamming</strong> it concentrates power on a fraction $\rho$ of the band, raising the jam PSD there and forcing more hops into corrupted channels. The optimal $\rho$ trades hit probability against per-hit severity; without coding, partial-band noise can be far more damaging than full-band barrage of equal total power.</p>
        <ul>
          <li><strong>Countermeasure:</strong> FEC + interleaving so that a small fraction of corrupted hops is recoverable — this is essential for FHSS, more so than for DSSS.</li>
          <li><strong>Follower (repeat) jamming:</strong> the jammer detects the current hop and jams it before the dwell ends. Fast hopping and short dwell defeat it because by the time the jammer retunes, the signal has moved on. Requirement: $T_d < $ jammer detect-plus-retune latency plus propagation.</li>
        </ul>`
      },
      {
        h: 'Adaptive frequency hopping (AFH)',
        html: String.raw`<p>Modern FHSS (Bluetooth since v1.2) uses <strong>Adaptive Frequency Hopping</strong>: channels found to be persistently bad (e.g. occupied by Wi-Fi or a microwave oven) are removed from the active hop set, and hops are remapped onto good channels. This preserves the pseudorandomness while avoiding known interference.</p>
        <ul>
          <li>Improves coexistence with Wi-Fi in the crowded 2.4 GHz ISM band.</li>
          <li>Reduces retransmissions and latency without abandoning the LPI/AJ benefits of hopping.</li>
          <li>Regulatory minimum (e.g. FCC) may require a minimum number of usable channels to still qualify as spread spectrum.</li>
        </ul>`
      },
      {
        h: 'FHSS versus DSSS: a comparison',
        html: String.raw`<table class="data">
          <tr><th>Attribute</th><th>DSSS</th><th>FHSS</th></tr>
          <tr><td>Spreading method</td><td>multiply by fast PN chips</td><td>hop carrier over $M$ channels</td></tr>
          <tr><td>Instantaneous BW</td><td>wide (full $R_c$)</td><td>narrow (one channel)</td></tr>
          <tr><td>Processing gain</td><td>$R_c/R_b$</td><td>$M$ (number of channels)</td></tr>
          <tr><td>Sync requirement</td><td>chip-level (tight)</td><td>hop-timing (looser)</td></tr>
          <tr><td>Near-far</td><td>severe (needs power control)</td><td>mild (only co-channel hops collide)</td></tr>
          <tr><td>Multipath</td><td>RAKE resolves it</td><td>frequency diversity across hops</td></tr>
          <tr><td>Best against</td><td>broadband + tone</td><td>partial-band + follower</td></tr>
          <tr><td>Examples</td><td>GPS, WCDMA, Zigbee</td><td>Bluetooth, military SINCGARS</td></tr>
        </table>
        <div class="callout">Hybrid FH/DSSS systems exist (e.g. some military waveforms) to combine both gains.</div>`
      },
      {
        h: 'Pitfalls',
        html: String.raw`<ul>
          <li><strong>Synthesizer settling time</strong> wastes part of each dwell as guard time; at high hop rates this overhead dominates.</li>
          <li><strong>Non-coherent detection</strong> is usually mandatory (phase is lost across hops), costing a few dB versus coherent DSSS.</li>
          <li><strong>Collisions</strong> in unslotted FH networks (two users hop to the same channel) require FEC/retransmission.</li>
          <li><strong>Hop sequence secrecy</strong> is the AJ foundation — a predicted sequence is fully jammable.</li>
        </ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">Core idea: narrowband at every instant, wideband over time — spreading is done by motion, not by width.</div>
        <ul>
          <li><strong>The hop machine:</strong> a PN sequence drives a synthesizer through a hop set of $M$ channels, spending a dwell $T_d=1/R_h$ on each.</li>
          <li><strong>Fast vs slow</strong> is set by $R_h$ versus the symbol rate $R_s$: fast hopping ($R_h>R_s$) spreads one symbol over $L=R_h/R_s$ hops for diversity; slow hopping ($R_h<R_s$) sends several symbols per hop and leans on FEC.</li>
          <li><strong>Processing gain $\approx M$</strong>, the number of channels — decoupled from the hop rate, unlike DSSS.</li>
          <li><strong>The real threats are partial-band and follower jamming;</strong> FEC + interleaving handles the former, and short dwells (fast hopping) outrun the latter.</li>
          <li><strong>Practical wins:</strong> looser (hop-timing) synchronization, mild near-far behavior, and adaptive hopping (AFH) for coexistence — at the cost of non-coherent detection and synthesizer settling overhead.</li>
        </ul>`
      }
    ],
    keyPoints: [
      String.raw`FHSS hops the carrier through $M$ channels per a PN hop sequence; instantaneously narrowband, wideband on average.`,
      String.raw`Dwell time $T_d = 1/R_h$ is the time per frequency; hop set size is $M$.`,
      String.raw`Slow hopping: $R_h<R_s$ (many symbols per hop). Fast hopping: $R_h>R_s$ (many hops per symbol).`,
      String.raw`FHSS processing gain $\approx M = $ number of channels; $G_p[\text{dB}]=10\log_{10}M$.`,
      String.raw`Partial-band jamming is the worst-case threat; FEC + interleaving are the essential countermeasure.`,
      String.raw`Fast hopping and short dwell defeat follower (repeat) jamming.`,
      String.raw`Adaptive Frequency Hopping (AFH) removes bad channels for coexistence (Bluetooth v1.2+).`,
      String.raw`FHSS sync is looser (hop timing) than DSSS (chip level) and near-far is milder.`,
      String.raw`Detection is typically non-coherent because carrier phase is not preserved across hops.`,
      String.raw`Bluetooth classic: 79 channels of 1 MHz, 1600 hops/s (625 us slots).`,
      String.raw`Synthesizer settling time is dead time that limits practical hop rate.`,
      String.raw`Hop sequence secrecy is the anti-jam foundation.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Frequency-hopping pattern (time-frequency)</text>
          <line x1="50" y1="230" x2="520" y2="230" stroke="#9aa7b5"/>
          <line x1="50" y1="230" x2="50" y2="40" stroke="#9aa7b5"/>
          <text x="500" y="248" fill="#9aa7b5" font-size="10">time</text>
          <text x="8" y="45" fill="#9aa7b5" font-size="10">freq (channels)</text>
          <rect x="60" y="70" width="45" height="18" fill="#4dabf7"/>
          <rect x="110" y="170" width="45" height="18" fill="#63e6be"/>
          <rect x="160" y="110" width="45" height="18" fill="#ffa94d"/>
          <rect x="210" y="50" width="45" height="18" fill="#b197fc"/>
          <rect x="260" y="150" width="45" height="18" fill="#4dabf7"/>
          <rect x="310" y="90" width="45" height="18" fill="#63e6be"/>
          <rect x="360" y="190" width="45" height="18" fill="#ffa94d"/>
          <rect x="410" y="60" width="45" height="18" fill="#b197fc"/>
          <rect x="130" y="118" width="360" height="9" fill="#ff6b6b" opacity="0.5"/>
          <text x="300" y="115" fill="#ff6b6b" font-size="9">partial-band jammer (hits only channels in this band)</text>
          <text x="60" y="255" fill="#9aa7b5" font-size="9">dwell Td = 1/Rh</text>
        </svg>`,
        caption: 'The carrier hops pseudorandomly among channels each dwell. A partial-band jammer only corrupts hops that land in its band; FEC + interleaving recover the rest.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="200" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">FHSS transmitter</text>
          <rect x="30" y="70" width="90" height="40" fill="none" stroke="#4dabf7" stroke-width="1.5"/>
          <text x="75" y="94" fill="#e6edf3" font-size="10" text-anchor="middle">Data mod</text>
          <rect x="180" y="70" width="100" height="40" fill="none" stroke="#63e6be" stroke-width="1.5"/>
          <text x="230" y="88" fill="#e6edf3" font-size="10" text-anchor="middle">Freq</text>
          <text x="230" y="102" fill="#e6edf3" font-size="10" text-anchor="middle">synthesizer</text>
          <rect x="180" y="140" width="100" height="35" fill="none" stroke="#b197fc" stroke-width="1.5"/>
          <text x="230" y="162" fill="#e6edf3" font-size="10" text-anchor="middle">PN hop code</text>
          <rect x="340" y="70" width="70" height="40" fill="none" stroke="#ffa94d" stroke-width="1.5"/>
          <text x="375" y="94" fill="#e6edf3" font-size="10" text-anchor="middle">Mixer</text>
          <line x1="120" y1="90" x2="340" y2="90" stroke="#9aa7b5" marker-end="url(#arr-fh)"/>
          <line x1="280" y1="90" x2="340" y2="90" stroke="#9aa7b5"/>
          <line x1="230" y1="140" x2="230" y2="110" stroke="#9aa7b5" marker-end="url(#arr-fh)"/>
          <line x1="410" y1="90" x2="500" y2="90" stroke="#9aa7b5" marker-end="url(#arr-fh)"/>
          <text x="470" y="82" fill="#9aa7b5" font-size="10">RF out</text>
          <defs><marker id="arr-fh" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#9aa7b5"/></marker></defs>
        </svg>`,
        caption: 'The PN code steps the synthesizer through the hop set; the modulated data is mixed onto the current hop frequency.'
      },
      {
        title: String.raw`Partial-band jammer hit probability`,
        svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="230" fill="#1c232e"/>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Jammer hit probability and its recovery path</text>
          <rect x="20" y="50" width="96" height="34" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="68" y="64" fill="#e6edf3" font-size="9" text-anchor="middle">M hop</text><text x="68" y="76" fill="#e6edf3" font-size="9" text-anchor="middle">channels</text>
          <rect x="150" y="50" width="110" height="34" fill="none" stroke="#ff6b6b" stroke-width="1.5"/><text x="205" y="64" fill="#e6edf3" font-size="9" text-anchor="middle">jammer covers</text><text x="205" y="76" fill="#e6edf3" font-size="9" text-anchor="middle">Wj = ρ·Wss</text>
          <circle cx="320" cy="67" r="18" fill="none" stroke="#ffa94d" stroke-width="1.5"/><text x="320" y="65" fill="#ffa94d" font-size="9" text-anchor="middle">Phit</text><text x="320" y="76" fill="#ffa94d" font-size="9" text-anchor="middle">= ρ</text>
          <rect x="380" y="50" width="130" height="34" fill="none" stroke="#b197fc" stroke-width="1.5"/><text x="445" y="64" fill="#e6edf3" font-size="9" text-anchor="middle">fraction ρ of hops</text><text x="445" y="76" fill="#e6edf3" font-size="9" text-anchor="middle">corrupted</text>
          <rect x="200" y="140" width="140" height="34" fill="none" stroke="#63e6be" stroke-width="1.5"/><text x="270" y="154" fill="#e6edf3" font-size="9" text-anchor="middle">FEC + interleaving</text><text x="270" y="166" fill="#e6edf3" font-size="9" text-anchor="middle">recovers hits</text>
          <rect x="380" y="140" width="130" height="34" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="445" y="161" fill="#e6edf3" font-size="9" text-anchor="middle">clean data out</text>
          <line x1="116" y1="67" x2="150" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-fh)"/>
          <line x1="260" y1="67" x2="302" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-fh)"/>
          <line x1="338" y1="67" x2="380" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-fh)"/>
          <line x1="445" y1="84" x2="445" y2="140" stroke="#9aa7b5" marker-end="url(#arr3-fh)"/>
          <line x1="380" y1="157" x2="340" y2="157" stroke="#9aa7b5" marker-end="url(#arr3-fh)"/>
          <line x1="270" y1="140" x2="270" y2="115" stroke="#9aa7b5"/><line x1="270" y1="115" x2="445" y2="115" stroke="#9aa7b5"/>
          <text x="60" y="205" fill="#9aa7b5" font-size="9">Random hop lands in the jammed band with probability ρ = Wj / Wss; the rest of the block survives.</text>
          <defs><marker id="arr3-fh" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#9aa7b5"/></marker></defs>
        </svg>`,
        caption: 'A partial-band jammer occupying a fraction ρ of the hop band corrupts each random hop with probability Phit = ρ; FEC plus interleaving repairs that fraction of hits so the recovered data stays clean.'
      }
    ],
    equations: [
      {
        title: 'Dwell time',
        tex: String.raw`$$ T_d = \frac{1}{R_h} $$`,
        derivation: String.raw`<p>The hop rate $R_h$ (hops/s) is the reciprocal of the time spent per frequency. Bluetooth: $R_h=1600$ hops/s gives $T_d=625$ us per slot.</p>`
      },
      {
        title: 'FHSS processing gain',
        tex: String.raw`$$ G_p \approx \frac{W_{ss}}{B_{inst}} \approx M,\qquad G_p[\text{dB}]=10\log_{10}M $$`,
        derivation: String.raw`<p>The hopped bandwidth is $W_{ss}\approx M\,\Delta f$ and the instantaneous bandwidth is one channel $B_{inst}\approx\Delta f$. The ratio is the number of channels $M$. For $M=79$, $G_p=10\log_{10}79\approx19$ dB.</p>`
      },
      {
        title: 'Fast/slow hopping boundary',
        tex: String.raw`$$ \text{fast: } R_h > R_s,\qquad \text{slow: } R_h < R_s $$`,
        derivation: String.raw`<p>Compare hop rate to symbol rate. If more than one hop occurs per symbol ($R_h>R_s$) it is fast hopping (frequency diversity within a symbol); if several symbols share a hop ($R_h<R_s$) it is slow hopping. The ratio $L=R_h/R_s$ is the number of hops per symbol in fast hopping.</p>`
      },
      {
        title: 'Partial-band jammer hit probability',
        tex: String.raw`$$ P_{hit} = \rho = \frac{W_j}{W_{ss}} $$`,
        derivation: String.raw`<p>If the jammer covers a fraction $\rho$ of the total hop band, the probability a random hop lands in the jammed portion is $\rho$. With fixed jammer power, concentrating on smaller $\rho$ raises per-hit severity but lowers hit rate; the jammer optimizes $\rho$ to maximize damage, which is why coding is essential.</p>`
      },
      {
        title: 'Follower-jamming timing constraint',
        tex: String.raw`$$ T_d < \tau_{detect} + \tau_{retune} + \tau_{prop} $$`,
        derivation: String.raw`<p>A follower jammer must detect the current hop, retune, and have its energy propagate before the dwell ends. Making the dwell shorter than the total jammer latency means the signal has already hopped away, defeating the attack — hence fast hopping is inherently AJ-robust.</p>`
      },
      {
        title: 'Number of hops per symbol (fast hopping diversity)',
        tex: String.raw`$$ L = \frac{R_h}{R_s} $$`,
        derivation: String.raw`<p>In fast hopping, each symbol is spread over $L$ hops. Non-coherent combining of $L$ chips gives frequency diversity; a jammer must hit multiple of the $L$ hops to corrupt one symbol, improving robustness at the cost of a diversity/combining loss.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the hop set?`, back: String.raw`The set of $M$ carrier frequencies the transmitter hops among, selected by the PN sequence.` },
      { front: String.raw`Define dwell time.`, back: String.raw`$T_d = 1/R_h$, the time spent transmitting on each hop frequency.` },
      { front: String.raw`Fast vs slow hopping condition?`, back: String.raw`Fast: $R_h>R_s$ (multiple hops per symbol). Slow: $R_h<R_s$ (multiple symbols per hop).` },
      { front: String.raw`FHSS processing gain?`, back: String.raw`$G_p\approx M$, the number of hop channels; $10\log_{10}M$ dB.` },
      { front: String.raw`Why is partial-band jamming dangerous to FHSS?`, back: String.raw`Concentrating power on a fraction $\rho$ of the band raises per-hit severity; without coding it beats equal-power barrage.` },
      { front: String.raw`How does fast hopping defeat follower jamming?`, back: String.raw`If dwell $T_d$ is shorter than the jammer's detect+retune+propagation delay, the signal moves on before the jammer arrives.` },
      { front: String.raw`What is Adaptive Frequency Hopping?`, back: String.raw`Removing persistently bad channels from the hop set to coexist with interferers (Bluetooth v1.2+).` },
      { front: String.raw`Why is FHSS detection usually non-coherent?`, back: String.raw`Carrier phase is not maintained across hops, so coherent tracking is impractical; FSK/GFSK with non-coherent detection is common.` },
      { front: String.raw`Bluetooth classic hop parameters?`, back: String.raw`79 channels of 1 MHz, 1600 hops/s (625 us slots).` },
      { front: String.raw`How does FHSS handle multipath differently from DSSS?`, back: String.raw`It gains frequency diversity across hops rather than resolving paths with a RAKE.` },
      { front: String.raw`Why is near-far milder in FHSS than DSSS?`, back: String.raw`Users only interfere when they hop to the same channel at the same time; otherwise they are frequency-separated.` },
      { front: String.raw`What limits practical hop rate?`, back: String.raw`Synthesizer settling/guard time, which becomes dead overhead as $T_d$ shrinks.` }
    ],
    mcqs: [
      { q: String.raw`FHSS is instantaneously:`, options: [String.raw`wideband`, String.raw`narrowband`, String.raw`baseband only`, String.raw`silent`], answer: 1, explain: String.raw`Only one channel is used at a time; wideband is the time-average.` },
      { q: String.raw`Dwell time for 1600 hops/s is:`, options: [String.raw`625 us`, String.raw`1.6 ms`, String.raw`160 us`, String.raw`16 us`], answer: 0, explain: String.raw`$1/1600=625$ us.` },
      { q: String.raw`Fast hopping is defined by:`, options: [String.raw`$R_h<R_s$`, String.raw`$R_h>R_s$`, String.raw`$R_h=R_c$`, String.raw`$R_h=0$`], answer: 1, explain: String.raw`More than one hop per symbol.` },
      { q: String.raw`FHSS processing gain with 100 channels is about:`, options: [String.raw`10 dB`, String.raw`20 dB`, String.raw`30 dB`, String.raw`40 dB`], answer: 1, explain: String.raw`$10\log_{10}100=20$ dB.` },
      { q: String.raw`The most effective countermeasure to partial-band jamming in FHSS is:`, options: [String.raw`higher carrier`, String.raw`FEC with interleaving`, String.raw`longer dwell`, String.raw`coherent detection`], answer: 1, explain: String.raw`Coding recovers the fraction of hops that are hit.` },
      { q: String.raw`Follower jamming is best defeated by:`, options: [String.raw`slow hopping`, String.raw`shorter dwell / fast hopping`, String.raw`bigger antenna`, String.raw`more FEC only`], answer: 1, explain: String.raw`The signal hops away before the jammer retunes.` },
      { q: String.raw`Adaptive Frequency Hopping primarily improves:`, options: [String.raw`carrier recovery`, String.raw`coexistence with known interferers`, String.raw`ADC resolution`, String.raw`antenna gain`], answer: 1, explain: String.raw`Bad channels are removed from the hop set.` },
      { q: String.raw`Compared to DSSS, FHSS synchronization is:`, options: [String.raw`tighter (chip level)`, String.raw`looser (hop timing)`, String.raw`identical`, String.raw`not required`], answer: 1, explain: String.raw`Only hop timing must align, not individual chips.` },
      { q: String.raw`FHSS detection is usually non-coherent because:`, options: [String.raw`ADCs are slow`, String.raw`carrier phase is lost across hops`, String.raw`FEC forbids it`, String.raw`the data rate is too high`], answer: 1, explain: String.raw`Retuning the synthesizer breaks phase continuity.` },
      { q: String.raw`In FHSS, processing gain is set by:`, options: [String.raw`chip rate`, String.raw`the number of channels $M$`, String.raw`the hop rate alone`, String.raw`the symbol rate`], answer: 1, explain: String.raw`$G_p\approx M$, decoupled from hop rate.` },
      { q: String.raw`Two unslotted FH users colliding on the same channel is resolved by:`, options: [String.raw`increasing carrier`, String.raw`FEC/retransmission`, String.raw`power control only`, String.raw`nothing needed`], answer: 1, explain: String.raw`Occasional collisions are handled by coding or retransmission.` },
      { q: String.raw`Which system is a classic FHSS example?`, options: [String.raw`GPS`, String.raw`WCDMA`, String.raw`Bluetooth`, String.raw`Zigbee`], answer: 2, explain: String.raw`Bluetooth hops; GPS/WCDMA/Zigbee are DSSS.` }
    ],
    numericals: [
      { q: String.raw`A FHSS system has 512 channels of 25 kHz each. Find total spread bandwidth and processing gain in dB.`, solution: String.raw`<p><b>Formula.</b> $$ W_{ss} = M\,\Delta f, \qquad G_p[\text{dB}] = 10\log_{10} M, $$ where $M$ is the number of hop channels, $\Delta f$ the channel spacing, $W_{ss}$ the total hopped bandwidth, and $G_p$ the processing gain.</p>
        <p><b>Substitute.</b> $$ W_{ss} = 512 \times 25\ \text{kHz}, \qquad G_p = 10\log_{10}(512). $$</p>
        <p><b>Compute.</b> $W_{ss} = 12800$ kHz $= 12.8$ MHz; $G_p = 10\times 2.709 = 27.1$ dB.</p>
        <p><b>Explanation.</b> The signal is narrowband (25 kHz) at any instant but averages over 12.8 MHz, giving 27.1 dB of anti-jam gain equal to the number of channels. Sanity check: $512 = 2^9$, so $G_p \approx 9\times3 = 27$ dB.</p>` },
      { q: String.raw`Hop rate 5000 hops/s. Symbol rate 1000 sym/s. Is this fast or slow hopping, and how many hops per symbol?`, solution: String.raw`<p><b>Formula.</b> $$ L = \frac{R_h}{R_s}, \qquad \text{fast if } R_h > R_s,\ \text{slow if } R_h < R_s, $$ where $R_h$ is the hop rate, $R_s$ the symbol rate, and $L$ the number of hops per symbol.</p>
        <p><b>Substitute.</b> $$ L = \frac{5000}{1000}. $$</p>
        <p><b>Compute.</b> $L = 5$ hops per symbol; since $R_h > R_s$ this is fast hopping.</p>
        <p><b>Explanation.</b> Each symbol is spread across 5 different frequencies, giving frequency diversity within one symbol so a jammer must corrupt several hops to destroy it. The cost is a fast, agile synthesizer and non-coherent combining.</p>` },
      { q: String.raw`A follower jammer needs 300 us to detect and 200 us to retune; propagation adds 50 us. What maximum dwell defeats it?`, solution: String.raw`<p><b>Formula.</b> $$ T_d < \tau_{detect} + \tau_{retune} + \tau_{prop}, $$ where $T_d$ is the dwell time and the right side is the follower jammer's total detect-plus-retune-plus-propagation latency.</p>
        <p><b>Substitute.</b> $$ T_d < 300 + 200 + 50\ \ [\mu s]. $$</p>
        <p><b>Compute.</b> Total latency $= 550$ $\mu$s, so choose $T_d < 550$ $\mu$s (e.g. 500 $\mu$s).</p>
        <p><b>Explanation.</b> If the dwell is shorter than the jammer's reaction time, the signal has already hopped to a new frequency before the jammer's energy arrives, defeating the attack. This is why fast hopping with short dwells is inherently anti-jam against follower (repeat) jammers.</p>` },
      { q: String.raw`Bluetooth classic: 79 channels, 1600 hops/s. Processing gain and dwell?`, solution: String.raw`<p><b>Formula.</b> $$ G_p[\text{dB}] = 10\log_{10} M, \qquad T_d = \frac{1}{R_h}, $$ where $M$ is the channel count, $R_h$ the hop rate, and $T_d$ the dwell (time per hop).</p>
        <p><b>Substitute.</b> $$ G_p = 10\log_{10}(79), \qquad T_d = \frac{1}{1600}. $$</p>
        <p><b>Compute.</b> $G_p = 10\times 1.898 = 19.0$ dB; $T_d = 625\times10^{-6}$ s $= 625$ $\mu$s.</p>
        <p><b>Explanation.</b> The 79-channel hop set yields a modest 19 dB of gain and a 625 $\mu$s slot — the familiar Bluetooth timing. This gain is smaller than typical DSSS, so Bluetooth leans on adaptive hopping and coding rather than raw processing gain.</p>` },
      { q: String.raw`A partial-band jammer covers 8 of 64 channels. What is the per-hop hit probability?`, solution: String.raw`<p><b>Formula.</b> $$ P_{hit} = \rho = \frac{W_j}{W_{ss}} = \frac{M_j}{M}, $$ where $\rho$ is the jammed fraction of the band, $M_j$ the number of jammed channels, and $M$ the total channels.</p>
        <p><b>Substitute.</b> $$ P_{hit} = \frac{8}{64}. $$</p>
        <p><b>Compute.</b> $P_{hit} = 0.125$ (12.5%).</p>
        <p><b>Explanation.</b> On average one hop in eight lands in the jammed sub-band and is corrupted; FEC with interleaving is then relied upon to recover that 12.5% of hits. A smart jammer chooses $\rho$ to maximize damage, which is exactly why coding is essential in FHSS.</p>` },
      { q: String.raw`Synthesizer settles in 50 us. At 2000 hops/s, what fraction of each dwell is wasted as guard time?`, solution: String.raw`<p><b>Formula.</b> $$ T_d = \frac{1}{R_h}, \qquad \text{waste fraction} = \frac{\tau_{settle}}{T_d}, $$ where $\tau_{settle}$ is the synthesizer settling time, $R_h$ the hop rate, and $T_d$ the dwell.</p>
        <p><b>Substitute.</b> $$ T_d = \frac{1}{2000}, \qquad \text{waste} = \frac{50\ \mu s}{500\ \mu s}. $$</p>
        <p><b>Compute.</b> $T_d = 500$ $\mu$s; waste fraction $= 0.10 = 10\%$.</p>
        <p><b>Explanation.</b> One tenth of each dwell is dead guard time while the synthesizer retunes. As hop rate rises the dwell shrinks toward the fixed settling time, so this overhead grows and ultimately caps the practical hop rate.</p>` }
    ],
    realWorld: String.raw`<p>FHSS is the heart of Bluetooth (79 channels, adaptive hopping to dodge Wi-Fi), military tactical radios such as SINCGARS and HAVE QUICK (anti-jam voice/data), and legacy 802.11 FHSS. Its resistance to follower and partial-band jamming, plus looser synchronization and mild near-far behavior, make it attractive where agility and coexistence matter more than raw multipath resolution. Adaptive hopping is a key enabler of Bluetooth's survival in the congested 2.4 GHz ISM band.</p>`,
    related: ['dsss', 'pn-codes', 'fec', 'bpsk', 'psd']
  },
  {
    id: 'pn-codes',
    title: 'PN Codes (m-sequences)',
    category: 'Spread Spectrum & Coding',
    tags: ['PN', 'm-sequence', 'LFSR', 'primitive polynomial', 'autocorrelation', 'maximal length'],
    summary: String.raw`Maximal-length sequences (m-sequences) are pseudorandom binary codes generated by a linear-feedback shift register with a primitive polynomial, achieving period $2^n-1$ and near-ideal two-valued autocorrelation.`,
    prerequisites: ['dsss', 'comm-basics'],
    intro: String.raw`<p><strong>Why PN codes exist.</strong> Spread spectrum needs a spreading sequence with two properties that seem to conflict: it must look as random as noise (so it spreads energy evenly and hides the signal), yet it must be exactly reproducible at the receiver (so the receiver can despread it). True random noise fails the second test — you could never regenerate it. PN codes resolve the paradox: they are generated by a tiny deterministic circuit, so both ends produce the identical sequence, while statistically they mimic a coin-flip stream. This topic is about the most important such code, the m-sequence, and why its razor-sharp autocorrelation makes it the natural choice for synchronization.</p>
    <p>Pseudo-noise (PN) codes are deterministic binary sequences that <em>look</em> random (flat spectrum, balanced, noise-like autocorrelation) yet are reproducible at both transmitter and receiver — exactly what spread spectrum needs. The workhorse PN code is the <strong>maximal-length sequence</strong> ("m-sequence"), produced by a linear-feedback shift register (LFSR) whose feedback taps correspond to a <strong>primitive polynomial</strong>. m-sequences have period $2^n-1$ for an $n$-stage register, satisfy Golomb's randomness postulates (balance, run, and two-valued autocorrelation), and are the building blocks of Gold and Kasami code families. Their one weakness — poor mutual cross-correlation — motivates Gold codes for CDMA.</p>`,
    sections: [
      {
        h: 'The LFSR and maximal length',
        html: String.raw`<p>An $n$-stage LFSR is a shift register whose input is the XOR (modulo-2 sum) of selected tap outputs. It cycles through a sequence of states; because there are only $2^n$ possible states and the all-zero state is a fixed point (it produces only zeros), the maximum reachable period is $2^n-1$.</p>
        <ul>
          <li>An LFSR reaches the full period $2^n-1$ if and only if its feedback taps correspond to a <strong>primitive polynomial</strong> of degree $n$ over GF(2).</li>
          <li>The <strong>all-zero state is excluded</strong> — it is an absorbing state; entering it kills the sequence forever. This is why the period is $2^n-1$, not $2^n$.</li>
          <li>The output is one bit per clock; over one period every nonzero $n$-bit state appears exactly once.</li>
        </ul>
        <div class="callout">Rule of thumb: an $n$-stage LFSR with the right taps gives a code of length $2^n-1$. For a period of at least 1000, need $2^n-1\ge1000\Rightarrow n\ge10$ (giving 1023).</div>`
      },
      {
        h: 'Primitive polynomials and tap selection',
        html: String.raw`<p>The feedback connections are described by a polynomial $g(x)=x^n + c_{n-1}x^{n-1}+\cdots+c_1 x + 1$ over GF(2), where $c_i\in\{0,1\}$ indicates whether stage $i$ is tapped. For the LFSR to be maximal length, $g(x)$ must be <strong>primitive</strong>: irreducible and with $x$ having order $2^n-1$ in the field $\mathrm{GF}(2^n)$.</p>
        <table class="data">
          <tr><th>n</th><th>Period $2^n-1$</th><th>Example primitive polynomial</th></tr>
          <tr><td>3</td><td>7</td><td>$x^3+x+1$</td></tr>
          <tr><td>4</td><td>15</td><td>$x^4+x+1$</td></tr>
          <tr><td>5</td><td>31</td><td>$x^5+x^2+1$</td></tr>
          <tr><td>7</td><td>127</td><td>$x^7+x^3+1$</td></tr>
          <tr><td>10</td><td>1023</td><td>$x^{10}+x^3+1$</td></tr>
        </table>
        <p>The number of distinct m-sequences of degree $n$ is $\phi(2^n-1)/n$ where $\phi$ is Euler's totient — these correspond to the number of primitive polynomials.</p>`
      },
      {
        h: "Golomb's randomness properties",
        html: String.raw`<p>Over one full period an m-sequence obeys three postulates that make it "pseudo-random":</p>
        <ol>
          <li><strong>Balance:</strong> the number of 1s exceeds the number of 0s by exactly one. In a period of $2^n-1$ there are $2^{n-1}$ ones and $2^{n-1}-1$ zeros.</li>
          <li><strong>Run property:</strong> of all runs of consecutive identical symbols, one-half have length 1, one-quarter length 2, one-eighth length 3, and so on (geometric distribution), matching a fair coin. The longest run of 1s has length $n$; the longest run of 0s has length $n-1$.</li>
          <li><strong>Two-valued autocorrelation:</strong> the periodic autocorrelation takes only two values (see next section).</li>
        </ol>
        <div class="callout">These are why an m-sequence looks like noise on a spectrum analyzer: nearly flat PSD, balanced, with runs statistically like random data.</div>`
      },
      {
        h: 'Two-valued autocorrelation',
        html: String.raw`<p>Map the binary sequence to bipolar $\pm1$ ($0\to+1,\ 1\to-1$). The normalized periodic autocorrelation over period $L=2^n-1$ is exactly two-valued:</p>
        <p>$$ R(\tau) = \begin{cases} 1, & \tau \equiv 0 \pmod L \\[4pt] -\dfrac{1}{L}, & \tau \not\equiv 0 \pmod L. \end{cases} $$</p>
        <p>A sharp peak of 1 at zero shift and a tiny, constant $-1/L$ everywhere else. This "thumbtack" autocorrelation is ideal for synchronization: the correlator produces one unambiguous peak, so acquisition/tracking (early-late DLL) locks the code phase to within a fraction of a chip.</p>
        <p>Un-normalized (counting agreements minus disagreements), the off-peak value is $-1$ and the peak is $L$; hence the phrase "two-valued autocorrelation of $L$ and $-1$."</p>`
      },
      {
        h: 'Spectral flatness and the shift-and-add property',
        html: String.raw`<p>Because the autocorrelation is nearly a delta, the power spectrum is nearly flat (white-like) with a $\mathrm{sinc}^2$ envelope from the chip shape, and discrete lines spaced at $1/(L T_c)$. Two structural facts:</p>
        <ul>
          <li><strong>Shift-and-add:</strong> the XOR of an m-sequence with a cyclically shifted copy of itself is another shift of the same m-sequence. This algebraic closure underlies Gold-code construction.</li>
          <li><strong>Cycle-and-add / window property:</strong> every nonzero $n$-tuple appears exactly once per period, giving the pseudorandom feel.</li>
        </ul>`
      },
      {
        h: 'The cross-correlation weakness',
        html: String.raw`<p>m-sequences have superb <em>auto</em>correlation but their mutual <strong>cross-correlation</strong> is generally large and not bounded to small values. Different m-sequences of the same length can exhibit high cross-correlation peaks, causing severe multiple-access interference if used directly for CDMA.</p>
        <ul>
          <li>This is precisely why CDMA systems do not assign raw m-sequences to different users.</li>
          <li><strong>Gold codes</strong> and <strong>Kasami codes</strong> are engineered from m-sequences to bound cross-correlation to small three-valued (Gold) or few-valued (Kasami) sets — trading a slightly worse autocorrelation for controlled, low cross-correlation and large family sizes.</li>
        </ul>
        <div class="callout">m-sequence: best autocorrelation, worst cross-correlation. Gold code: slightly worse autocorrelation, bounded low cross-correlation and huge family. Pick per application.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">One-line summary: a small LFSR with the right taps manufactures a noise-like yet reproducible code with a thumbtack autocorrelation.</div>
        <ul>
          <li><strong>Generation:</strong> an $n$-stage LFSR with feedback taps forming a <em>primitive</em> polynomial cycles through all $2^n-1$ nonzero states, giving period $L=2^n-1$ (the all-zero state is excluded because it is absorbing).</li>
          <li><strong>Randomness (Golomb):</strong> balance ($2^{n-1}$ ones, one more than zeros), the run distribution, and two-valued autocorrelation are what make it look like noise.</li>
          <li><strong>Two-valued autocorrelation:</strong> peak 1 at zero shift, $-1/L$ everywhere else — the sharp peak is why m-sequences are ideal for synchronization and ranging.</li>
          <li><strong>Counting and sizing:</strong> there are $\phi(2^n-1)/n$ distinct m-sequences, and a target period needs $n\ge\lceil\log_2(L_{req}+1)\rceil$ stages.</li>
          <li><strong>The catch:</strong> mutual cross-correlation is large and unbounded, so raw m-sequences are poor CDMA address codes — motivating Gold and Kasami families.</li>
        </ul>`
      }
    ],
    keyPoints: [
      String.raw`An $n$-stage LFSR with a primitive polynomial produces an m-sequence of period $L=2^n-1$.`,
      String.raw`The all-zero state is an absorbing fixed point and is excluded, hence period $2^n-1$ not $2^n$.`,
      String.raw`Maximal length requires the feedback taps to form a primitive polynomial over GF(2).`,
      String.raw`Balance: $2^{n-1}$ ones and $2^{n-1}-1$ zeros per period (one more 1 than 0).`,
      String.raw`Run property: half of runs length 1, quarter length 2, etc.; longest run of 1s is $n$, of 0s is $n-1$.`,
      String.raw`Two-valued autocorrelation: peak 1 at zero shift, $-1/L$ elsewhere (or $L$ and $-1$ un-normalized).`,
      String.raw`Thumbtack autocorrelation gives clean synchronization / acquisition.`,
      String.raw`Number of distinct m-sequences of degree $n$ is $\phi(2^n-1)/n$.`,
      String.raw`Shift-and-add: XOR with a shifted copy yields another shift of the same sequence.`,
      String.raw`m-sequences have poor mutual cross-correlation, making them bad for direct CDMA.`,
      String.raw`Gold and Kasami families are built from m-sequences to bound cross-correlation.`,
      String.raw`For period $\ge1000$, need $n\ge10$ (giving 1023, the GPS C/A length).`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="200" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">4-stage LFSR, g(x)=x^4+x+1 (period 15)</text>
          <rect x="60" y="70" width="60" height="40" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="90" y="94" fill="#e6edf3" font-size="12" text-anchor="middle">D1</text>
          <rect x="140" y="70" width="60" height="40" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="170" y="94" fill="#e6edf3" font-size="12" text-anchor="middle">D2</text>
          <rect x="220" y="70" width="60" height="40" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="250" y="94" fill="#e6edf3" font-size="12" text-anchor="middle">D3</text>
          <rect x="300" y="70" width="60" height="40" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="330" y="94" fill="#e6edf3" font-size="12" text-anchor="middle">D4</text>
          <line x1="120" y1="90" x2="140" y2="90" stroke="#9aa7b5" marker-end="url(#arr-pn)"/>
          <line x1="200" y1="90" x2="220" y2="90" stroke="#9aa7b5" marker-end="url(#arr-pn)"/>
          <line x1="280" y1="90" x2="300" y2="90" stroke="#9aa7b5" marker-end="url(#arr-pn)"/>
          <line x1="360" y1="90" x2="420" y2="90" stroke="#63e6be" marker-end="url(#arr-pn)"/>
          <text x="430" y="94" fill="#63e6be" font-size="11">output</text>
          <circle cx="410" cy="150" r="14" fill="none" stroke="#ffa94d" stroke-width="1.5"/><text x="410" y="155" fill="#ffa94d" font-size="14" text-anchor="middle">+</text>
          <text x="410" y="182" fill="#9aa7b5" font-size="9">XOR (mod 2)</text>
          <path d="M410 136 V50 H90 V70" fill="none" stroke="#b197fc" stroke-width="1.5" marker-end="url(#arr-pn)"/>
          <path d="M170 110 V150 H396" fill="none" stroke="#ffa94d" stroke-width="1.5" marker-end="url(#arr-pn)"/>
          <path d="M410 110 V136" fill="none" stroke="#ffa94d" stroke-width="1.5"/>
          <text x="240" y="45" fill="#b197fc" font-size="9">feedback to D1</text>
          <defs><marker id="arr-pn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#9aa7b5"/></marker></defs>
        </svg>`,
        caption: 'A 4-stage LFSR taps stages 4 and 1 (per x^4+x+1); the XOR feeds back to D1, cycling through all 15 nonzero states.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="220" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">m-sequence two-valued autocorrelation</text>
          <line x1="40" y1="150" x2="520" y2="150" stroke="#9aa7b5"/>
          <line x1="280" y1="180" x2="280" y2="40" stroke="#9aa7b5"/>
          <text x="500" y="168" fill="#9aa7b5" font-size="10">shift τ</text>
          <text x="290" y="50" fill="#9aa7b5" font-size="10">R(τ)</text>
          <line x1="280" y1="150" x2="280" y2="55" stroke="#63e6be" stroke-width="3"/>
          <text x="290" y="70" fill="#63e6be" font-size="10">peak = 1</text>
          <line x1="80" y1="150" x2="520" y2="162" stroke="#ff6b6b" stroke-width="1" stroke-dasharray="2 2"/>
          <line x1="60" y1="162" x2="500" y2="162" stroke="#ffa94d" stroke-width="2"/>
          <text x="120" y="185" fill="#ffa94d" font-size="10">off-peak = -1/L (near zero)</text>
        </svg>`,
        caption: 'The periodic autocorrelation is a thumbtack: 1 at zero shift, a constant -1/L everywhere else — ideal for synchronization.'
      }
    ],
    equations: [
      {
        title: 'Maximal-length period',
        tex: String.raw`$$ L = 2^n - 1 $$`,
        derivation: String.raw`<p>An $n$-bit register has $2^n$ states. The all-zero state is absorbing (it only produces zeros), so it cannot be part of a nontrivial cycle; the remaining $2^n-1$ nonzero states are visited exactly once each per period when the taps form a primitive polynomial.</p>`
      },
      {
        title: 'Balance property',
        tex: String.raw`$$ N_1 = 2^{n-1},\qquad N_0 = 2^{n-1}-1,\qquad N_1 - N_0 = 1 $$`,
        derivation: String.raw`<p>Every nonzero $n$-tuple appears once per period. Counting output bits, exactly half of the $2^n$ tuples have a 1 in the observed position; excluding the all-zero tuple removes one 0, giving one more 1 than 0.</p>`
      },
      {
        title: 'Two-valued periodic autocorrelation',
        tex: String.raw`$$ R(\tau)=\frac{1}{L}\sum_{k=0}^{L-1}a_k a_{k+\tau}=\begin{cases}1,&\tau=0\\ -\tfrac{1}{L},&\tau\neq0\end{cases} $$`,
        derivation: String.raw`<p>With $a_k=\pm1$, the sum counts agreements minus disagreements. By the shift-and-add property, $a_k a_{k+\tau}$ is itself an m-sequence for $\tau\neq0$, whose balance gives (agreements $-$ disagreements) $=-1$; dividing by $L$ yields $-1/L$. At $\tau=0$ every product is $+1$, giving $L/L=1$.</p>`
      },
      {
        title: 'Number of distinct m-sequences',
        tex: String.raw`$$ N_{seq} = \frac{\phi(2^n-1)}{n} $$`,
        derivation: String.raw`<p>Each maximal-length sequence corresponds to a primitive polynomial of degree $n$. The count of primitive polynomials equals $\phi(2^n-1)/n$, where $\phi$ is Euler's totient function. For $n=5$: $\phi(31)/5=30/5=6$ sequences.</p>`
      },
      {
        title: 'Longest run lengths',
        tex: String.raw`$$ \text{max run of 1s}=n,\qquad \text{max run of 0s}=n-1 $$`,
        derivation: String.raw`<p>A run of $n$ ones corresponds to the register holding the all-ones state once per period; a run of $n$ zeros would require the excluded all-zero state, so the longest zero run is $n-1$.</p>`
      },
      {
        title: 'Minimum register length for a target period',
        tex: String.raw`$$ n \ge \left\lceil \log_2(L_{req}+1) \right\rceil $$`,
        derivation: String.raw`<p>Solve $2^n-1\ge L_{req}$ for $n$: $2^n\ge L_{req}+1\Rightarrow n\ge\log_2(L_{req}+1)$, then round up. For $L_{req}=1000$, $n\ge\log_2(1001)=9.97\Rightarrow n=10$, giving 1023.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Period of an $n$-stage m-sequence?`, back: String.raw`$L=2^n-1$.` },
      { front: String.raw`Why is the period $2^n-1$ and not $2^n$?`, back: String.raw`The all-zero state is absorbing and excluded, leaving $2^n-1$ nonzero states.` },
      { front: String.raw`Condition for maximal length?`, back: String.raw`Feedback taps must correspond to a primitive polynomial of degree $n$ over GF(2).` },
      { front: String.raw`State the balance property.`, back: String.raw`Per period there are $2^{n-1}$ ones and $2^{n-1}-1$ zeros — one more 1 than 0.` },
      { front: String.raw`Two-valued autocorrelation values?`, back: String.raw`Normalized: 1 at zero shift, $-1/L$ elsewhere (un-normalized: $L$ and $-1$).` },
      { front: String.raw`What is the run property?`, back: String.raw`Half the runs have length 1, a quarter length 2, an eighth length 3, etc.` },
      { front: String.raw`Longest runs of 1s and 0s?`, back: String.raw`Longest run of 1s is $n$; longest run of 0s is $n-1$.` },
      { front: String.raw`What is the shift-and-add property?`, back: String.raw`XOR of an m-sequence with a shifted copy of itself is another shift of the same sequence.` },
      { front: String.raw`Number of distinct m-sequences of degree $n$?`, back: String.raw`$\phi(2^n-1)/n$ where $\phi$ is Euler's totient.` },
      { front: String.raw`Main weakness of m-sequences?`, back: String.raw`Large, poorly bounded mutual cross-correlation — bad for direct CDMA.` },
      { front: String.raw`Minimum $n$ for period $\ge1000$?`, back: String.raw`$n=10$ (gives 1023).` },
      { front: String.raw`Why do m-sequences look like noise?`, back: String.raw`Balance, random-like runs, and thumbtack autocorrelation give a nearly flat spectrum.` }
    ],
    mcqs: [
      { q: String.raw`An 8-stage LFSR with primitive taps has period:`, options: [String.raw`128`, String.raw`255`, String.raw`256`, String.raw`511`], answer: 1, explain: String.raw`$2^8-1=255$.` },
      { q: String.raw`The all-zero LFSR state is excluded because it is:`, options: [String.raw`too short`, String.raw`an absorbing fixed point`, String.raw`non-primitive`, String.raw`unbalanced`], answer: 1, explain: String.raw`It only produces zeros forever.` },
      { q: String.raw`Maximal length requires the tap polynomial to be:`, options: [String.raw`even degree`, String.raw`reducible`, String.raw`primitive`, String.raw`monic only`], answer: 2, explain: String.raw`Primitive polynomials give full period.` },
      { q: String.raw`In a period of a degree-6 m-sequence, the number of 1s is:`, options: [String.raw`31`, String.raw`32`, String.raw`63`, String.raw`64`], answer: 1, explain: String.raw`$2^{n-1}=2^5=32$ ones.` },
      { q: String.raw`The off-peak normalized autocorrelation of an m-sequence of length $L$ is:`, options: [String.raw`0`, String.raw`$-1/L$`, String.raw`$1/L$`, String.raw`$-1$`], answer: 1, explain: String.raw`Constant $-1/L$ for all nonzero shifts.` },
      { q: String.raw`The longest run of zeros in a degree-$n$ m-sequence is:`, options: [String.raw`$n$`, String.raw`$n-1$`, String.raw`$n+1$`, String.raw`$2n$`], answer: 1, explain: String.raw`A run of $n$ zeros needs the excluded all-zero state.` },
      { q: String.raw`The shift-and-add property states that XOR with a shifted copy gives:`, options: [String.raw`all zeros`, String.raw`another shift of the same m-sequence`, String.raw`a Gold code`, String.raw`a constant`], answer: 1, explain: String.raw`Closure under cyclic shift plus XOR.` },
      { q: String.raw`Number of distinct m-sequences for $n=5$:`, options: [String.raw`3`, String.raw`6`, String.raw`10`, String.raw`31`], answer: 1, explain: String.raw`$\phi(31)/5=30/5=6$.` },
      { q: String.raw`The chief weakness of m-sequences for CDMA is:`, options: [String.raw`poor autocorrelation`, String.raw`high mutual cross-correlation`, String.raw`short period`, String.raw`unbalanced spectrum`], answer: 1, explain: String.raw`Cross-correlation is not bounded to small values.` },
      { q: String.raw`Minimum register length for period at least 500 is:`, options: [String.raw`8`, String.raw`9`, String.raw`10`, String.raw`11`], answer: 1, explain: String.raw`$2^9-1=511\ge500$, so $n=9$.` },
      { q: String.raw`Which family fixes the cross-correlation weakness?`, options: [String.raw`Barker`, String.raw`Gold/Kasami`, String.raw`Hamming`, String.raw`Reed-Solomon`], answer: 1, explain: String.raw`Gold and Kasami bound cross-correlation.` },
      { q: String.raw`The autocorrelation "thumbtack" is valuable because it enables:`, options: [String.raw`higher data rate`, String.raw`clean synchronization/acquisition`, String.raw`coherent combining`, String.raw`lower power`], answer: 1, explain: String.raw`A single sharp peak locks code phase.` }
    ],
    numericals: [
      { q: String.raw`For $n=10$, find the period, the number of 1s and 0s per period.`, solution: String.raw`<p><b>Formula.</b> $$ L = 2^n - 1, \qquad N_1 = 2^{n-1}, \qquad N_0 = 2^{n-1} - 1, $$ where $L$ is the m-sequence period, $N_1$ the number of ones and $N_0$ the number of zeros per period.</p>
        <p><b>Substitute.</b> $$ L = 2^{10} - 1, \qquad N_1 = 2^9, \qquad N_0 = 2^9 - 1. $$</p>
        <p><b>Compute.</b> $L = 1023$; $N_1 = 512$; $N_0 = 511$.</p>
        <p><b>Explanation.</b> There is exactly one more 1 than 0 (the balance property), because every nonzero 10-bit state appears once and the excluded all-zero state would have contributed the missing 0. This near-balance is why the sequence looks noise-like with a nearly flat spectrum.</p>` },
      { q: String.raw`What is the smallest LFSR that gives a period of at least 65000?`, solution: String.raw`<p><b>Formula.</b> $$ n \ge \lceil \log_2(L_{req} + 1) \rceil, \qquad L = 2^n - 1, $$ where $L_{req}$ is the required period and $n$ the register length.</p>
        <p><b>Substitute.</b> $$ n \ge \log_2(65000 + 1) = \log_2(65001). $$</p>
        <p><b>Compute.</b> $\log_2(65001) = 15.99$, so round up to $n = 16$, giving $L = 2^{16} - 1 = 65535$.</p>
        <p><b>Explanation.</b> A 15-stage register only reaches $2^{15}-1 = 32767 < 65000$, so 16 stages are needed; 16 stages comfortably exceed the target at 65535. The ceiling reflects that register length is an integer.</p>` },
      { q: String.raw`Give the normalized off-peak autocorrelation for a degree-7 m-sequence.`, solution: String.raw`<p><b>Formula.</b> $$ L = 2^n - 1, \qquad R(\tau\neq 0) = -\frac{1}{L}, $$ where $L$ is the period and $R$ the normalized periodic autocorrelation at any nonzero shift.</p>
        <p><b>Substitute.</b> $$ L = 2^7 - 1, \qquad R = -\frac{1}{127}. $$</p>
        <p><b>Compute.</b> $L = 127$; $R = -0.0079$.</p>
        <p><b>Explanation.</b> The off-peak level of $-0.0079$ is essentially zero next to the peak of 1, giving the thumbtack autocorrelation prized for synchronization. Longer sequences push this even closer to zero.</p>` },
      { q: String.raw`How many distinct m-sequences exist for $n=6$?`, solution: String.raw`<p><b>Formula.</b> $$ N_{seq} = \frac{\phi(2^n - 1)}{n}, \qquad \phi(N) = N\prod_{p\mid N}\left(1 - \tfrac1p\right), $$ where $\phi$ is Euler's totient and $N_{seq}$ the number of distinct m-sequences (equal to the number of degree-$n$ primitive polynomials).</p>
        <p><b>Substitute.</b> $$ L = 2^6 - 1 = 63 = 3^2\cdot 7, \qquad \phi(63) = 63\left(1-\tfrac13\right)\left(1-\tfrac17\right), \qquad N_{seq} = \frac{\phi(63)}{6}. $$</p>
        <p><b>Compute.</b> $\phi(63) = 63\cdot\tfrac23\cdot\tfrac67 = 36$; $N_{seq} = 36/6 = 6$ sequences.</p>
        <p><b>Explanation.</b> Only 6 maximal-length codes of period 63 exist — far too few to serve as distinct CDMA user addresses, which is exactly the shortage that motivates Gold codes.</p>` },
      { q: String.raw`An m-sequence chips at 5 Mcps with $n=10$. What is the code period in time?`, solution: String.raw`<p><b>Formula.</b> $$ L = 2^n - 1, \qquad T_{period} = \frac{L}{R_c}, $$ where $L$ is the code length in chips, $R_c$ the chip rate, and $T_{period}$ the time to run one full period.</p>
        <p><b>Substitute.</b> $$ L = 2^{10} - 1 = 1023, \qquad T_{period} = \frac{1023}{5\times10^6}. $$</p>
        <p><b>Compute.</b> $T_{period} = 2.046\times10^{-4}$ s $= 204.6$ $\mu$s.</p>
        <p><b>Explanation.</b> The code repeats every 204.6 $\mu$s, which sets how often the correlator sees a fresh full-period peak and bounds the acquisition search window. Faster chipping shortens this period proportionally.</p>` },
      { q: String.raw`For a degree-12 m-sequence, give the longest runs of 1s and 0s.`, solution: String.raw`<p><b>Formula.</b> $$ \text{max run of 1s} = n, \qquad \text{max run of 0s} = n - 1, $$ where $n$ is the register length.</p>
        <p><b>Substitute.</b> $$ \text{max run of 1s} = 12, \qquad \text{max run of 0s} = 12 - 1. $$</p>
        <p><b>Compute.</b> Longest run of 1s $= 12$; longest run of 0s $= 11$.</p>
        <p><b>Explanation.</b> A run of twelve 1s corresponds to the all-ones state occurring once per period, but a run of twelve 0s would require the forbidden all-zero state, so zero-runs top out one shorter. This asymmetry is a fingerprint of maximal-length sequences.</p>` }
    ],
    realWorld: String.raw`<p>m-sequences appear everywhere: GPS uses degree-10 LFSRs (period 1023) to build the C/A Gold codes; scramblers and BER test patterns (PRBS-7, PRBS-15, PRBS-23, PRBS-31) are m-sequences used to stress serial links; radar and channel-sounding use their thumbtack autocorrelation for ranging. Their linear structure (predictable from $2n$ output bits via Berlekamp-Massey) means they are not cryptographically secure — a caution for secure systems, which layer nonlinear combiners on top.</p>`,
    related: ['gold-code', 'dsss', 'frequency-hopping', 'comm-basics']
  },
  {
    id: 'gold-code',
    title: 'Gold Codes',
    category: 'Spread Spectrum & Coding',
    tags: ['Gold code', 'preferred pair', 'cross-correlation', 'CDMA', 'GPS PRN', 'code family'],
    summary: String.raw`Gold codes are large families of spreading sequences formed by XOR-ing shifted preferred pairs of m-sequences, offering a huge code set with bounded three-valued cross-correlation ideal for CDMA.`,
    prerequisites: ['pn-codes', 'dsss'],
    intro: String.raw`<p><strong>Why Gold codes exist.</strong> CDMA hands every user a different code and lets them all transmit at once; the receiver picks out its user by correlating against that user's code. This only works if any two codes are nearly "invisible" to each other — low cross-correlation — and if there are enough distinct codes to go around. m-sequences ace the first job for a single user (their autocorrelation is ideal) but flunk the multi-user test: there are very few of them and pairs can correlate strongly. Gold codes are the engineered answer that trades a touch of autocorrelation quality for a huge family of mutually quiet codes.</p>
    <p>m-sequences have superb autocorrelation but too few members and unbounded cross-correlation to serve as CDMA address codes. <strong>Gold codes</strong> solve this: by XOR-ing two carefully chosen ("preferred pair") m-sequences at every relative shift, Robert Gold showed one obtains a family of $2^n+1$ sequences whose mutual cross-correlation is bounded to just three values. This large, well-behaved family is exactly what CDMA and GPS need to keep many users mutually distinguishable. The trade is slightly degraded autocorrelation (Gold codes are not maximal-length so their autocorrelation is no longer strictly two-valued), accepted in exchange for controlled cross-correlation and family size.</p>`,
    sections: [
      {
        h: 'Construction from a preferred pair',
        html: String.raw`<p>Take two m-sequences $u$ and $v$ of the same length $L=2^n-1$ that form a <strong>preferred pair</strong>. A Gold code family is generated as:</p>
        <p>$$ \{\,u,\ v,\ u\oplus T^0 v,\ u\oplus T^1 v,\ \dots,\ u\oplus T^{L-1}v\,\} $$</p>
        <p>where $T^k v$ is $v$ cyclically shifted by $k$ chips and $\oplus$ is chip-wise XOR. Each of the $L=2^n-1$ relative shifts produces one Gold sequence, and the two parent m-sequences themselves are usually counted, giving a family of size $L+2 = 2^n+1$.</p>
        <div class="callout">One preferred pair plus a phase shifter yields $2^n+1$ distinct spreading codes — far more than the handful of m-sequences of the same length.</div>`
      },
      {
        h: 'What makes a pair "preferred"',
        html: String.raw`<p>Not any two m-sequences work. A <strong>preferred pair</strong> must satisfy specific conditions so that the resulting cross-correlation is bounded three-valued:</p>
        <ul>
          <li>$n$ is not divisible by 4 (i.e. $n$ odd, or $n\equiv2\bmod4$).</li>
          <li>The two m-sequences are related by a decimation $v=u[q]$ where $q=2^k+1$ or $q=2^{2k}-2^k+1$ with $\gcd(n,k)$ chosen so that $\gcd(n,k)=1$ (n odd) or $=2$ ($n\equiv2\bmod4$).</li>
          <li>Their cross-correlation takes only the values from the three-valued set below.</li>
        </ul>
        <p>The point is that preferred pairs guarantee the small, predictable cross-correlation spectrum — the whole reason Gold codes are used.</p>`
      },
      {
        h: 'The three-valued cross-correlation',
        html: String.raw`<p>For a preferred pair, the (un-normalized) cross-correlation between any two members of the Gold family takes exactly one of three values:</p>
        <p>$$ \{\,-1,\ -t(n),\ t(n)-2\,\},\qquad t(n)=1+2^{\lfloor (n+2)/2\rfloor}. $$</p>
        <table class="data">
          <tr><th>$n$</th><th>$t(n)=1+2^{\lfloor(n+2)/2\rfloor}$</th><th>Three values $\{-1,-t,t-2\}$</th></tr>
          <tr><td>5</td><td>$1+2^3=9$</td><td>$\{-1,-9,7\}$</td></tr>
          <tr><td>7</td><td>$1+2^4=17$</td><td>$\{-1,-17,15\}$</td></tr>
          <tr><td>9</td><td>$1+2^5=33$</td><td>$\{-1,-33,31\}$</td></tr>
          <tr><td>10</td><td>$1+2^6=65$</td><td>$\{-1,-65,63\}$</td></tr>
        </table>
        <p>The peak magnitude $t(n)$ grows like $\sqrt{2L}$, so the normalized cross-correlation $t(n)/L$ shrinks as $n$ grows — larger codes are cleaner for CDMA.</p>`
      },
      {
        h: 'Autocorrelation trade-off',
        html: String.raw`<p>Because a Gold code (other than the two parents) is generally <em>not</em> a maximal-length sequence, its autocorrelation is no longer strictly two-valued; sidelobes appear at the same three levels $\{-1,-t(n),t(n)-2\}$. This is the price paid for bounding cross-correlation.</p>
        <ul>
          <li><strong>m-sequence:</strong> ideal 2-valued autocorrelation, unbounded cross-correlation, tiny family.</li>
          <li><strong>Gold code:</strong> 3-valued autocorrelation sidelobes, bounded 3-valued cross-correlation, family of $2^n+1$.</li>
        </ul>
        <div class="callout">For a single link where only sync matters, use an m-sequence. For many simultaneous users (CDMA), use Gold codes — bounded mutual interference beats perfect autocorrelation.</div>`
      },
      {
        h: 'Family size and CDMA capacity',
        html: String.raw`<p>The family size $2^n+1$ sets how many mutually low-correlated codes are available (hence how many CDMA users/addresses). For GPS with $n=10$, the family has $2^{10}+1=1025$ possible codes, of which a curated subset (37 PRNs for C/A) is used. Larger $n$ gives both more codes and lower normalized cross-correlation — a double benefit for capacity and near-far tolerance.</p>`
      },
      {
        h: 'GPS PRNs: the flagship example',
        html: String.raw`<p>The GPS C/A code is a Gold code of length 1023 ($n=10$). Two 10-stage LFSRs — <strong>G1</strong> with polynomial $x^{10}+x^3+1$ and <strong>G2</strong> with $x^{10}+x^9+x^8+x^6+x^3+x^2+1$ — produce the parent m-sequences. Each satellite's <strong>PRN</strong> is obtained by XOR-ing G1 with a specifically <em>delayed</em> version of G2; in practice the delay is realized by tapping two specified stages of G2 and XOR-ing them, which is equivalent to a phase shift $T^k v$.</p>
        <ul>
          <li>Each of the ~32 active satellites uses a distinct PRN (different G2 tap pair / shift).</li>
          <li>Bounded cross-correlation lets all satellites share the L1 carrier (CDMA) without mutual capture.</li>
          <li>The code repeats every 1 ms (1023 chips at 1.023 Mcps), which sets acquisition search granularity.</li>
        </ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">Big picture: Gold codes buy CDMA a large family of codes with a hard, predictable ceiling on mutual interference.</div>
        <ul>
          <li><strong>Construction:</strong> XOR one m-sequence $u$ with every cyclic shift of a preferred-pair partner $v$; picking the shift $k$ selects one of $2^n+1$ codes.</li>
          <li><strong>Preferred pairs matter:</strong> only pairs satisfying the conditions on $n$ (not divisible by 4) and a specific decimation give the bounded three-valued cross-correlation.</li>
          <li><strong>Three-valued cross-correlation</strong> $\{-1,-t(n),t(n)-2\}$ with $t(n)=1+2^{\lfloor(n+2)/2\rfloor}$ caps how much one user can interfere with another.</li>
          <li><strong>The trade:</strong> non-parent Gold codes are not maximal-length, so autocorrelation gains sidelobes — a small price for family size and bounded cross-correlation.</li>
          <li><strong>Bigger is cleaner:</strong> normalized cross-correlation $t(n)/L\sim\sqrt{2/L}$ shrinks with length, so longer codes serve more users with less mutual interference.</li>
          <li><strong>GPS is the flagship:</strong> a length-1023 ($n=10$) Gold code with $t=65$ gives each satellite a distinct PRN sharing one L1 carrier.</li>
        </ul>`
      }
    ],
    keyPoints: [
      String.raw`A Gold code family is generated by XOR-ing one m-sequence with all cyclic shifts of a second (preferred pair).`,
      String.raw`Family size is $2^n+1$ (the $L=2^n-1$ shifts plus the two parent m-sequences).`,
      String.raw`Cross-correlation is bounded to three values $\{-1,-t(n),t(n)-2\}$.`,
      String.raw`$t(n)=1+2^{\lfloor(n+2)/2\rfloor}$ sets the peak cross-correlation magnitude.`,
      String.raw`Preferred pairs require conditions on $n$ (not divisible by 4) and a specific decimation relationship.`,
      String.raw`Gold codes (except parents) are not maximal-length, so autocorrelation gains three-valued sidelobes.`,
      String.raw`Trade: slightly worse autocorrelation for bounded cross-correlation and a huge family.`,
      String.raw`Normalized cross-correlation $t(n)/L\sim\sqrt{2/L}$ shrinks with $n$, so bigger codes are cleaner.`,
      String.raw`GPS C/A is a length-1023 Gold code ($n=10$) built from LFSRs G1 and G2.`,
      String.raw`Different satellite PRNs are different G2 phase shifts (tap pairs), enabling CDMA on one carrier.`,
      String.raw`For $n=10$, $t=65$ and the three values are $\{-1,-65,63\}$.`,
      String.raw`Use m-sequences for single-link sync; Gold codes for multi-user CDMA.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="220" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Gold code generation (GPS-style)</text>
          <rect x="40" y="60" width="150" height="34" fill="none" stroke="#4dabf7" stroke-width="1.5"/>
          <text x="115" y="82" fill="#e6edf3" font-size="11" text-anchor="middle">G1 LFSR (m-seq u)</text>
          <rect x="40" y="140" width="150" height="34" fill="none" stroke="#63e6be" stroke-width="1.5"/>
          <text x="115" y="162" fill="#e6edf3" font-size="11" text-anchor="middle">G2 LFSR (m-seq v)</text>
          <rect x="240" y="140" width="120" height="34" fill="none" stroke="#b197fc" stroke-width="1.5"/>
          <text x="300" y="162" fill="#e6edf3" font-size="11" text-anchor="middle">shift T^k (PRN sel)</text>
          <circle cx="430" cy="100" r="16" fill="none" stroke="#ffa94d" stroke-width="1.5"/>
          <text x="430" y="106" fill="#ffa94d" font-size="16" text-anchor="middle">+</text>
          <line x1="190" y1="77" x2="414" y2="95" stroke="#9aa7b5" marker-end="url(#arr-gold)"/>
          <line x1="190" y1="157" x2="240" y2="157" stroke="#9aa7b5" marker-end="url(#arr-gold)"/>
          <line x1="360" y1="157" x2="430" y2="157" stroke="#9aa7b5"/>
          <line x1="430" y1="157" x2="430" y2="116" stroke="#9aa7b5" marker-end="url(#arr-gold)"/>
          <line x1="446" y1="100" x2="510" y2="100" stroke="#ffa94d" marker-end="url(#arr-gold)"/>
          <text x="470" y="92" fill="#ffa94d" font-size="10">Gold PRN</text>
          <text x="240" y="205" fill="#9aa7b5" font-size="10">choose shift k -> one of 2^n+1 codes</text>
          <defs><marker id="arr-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#9aa7b5"/></marker></defs>
        </svg>`,
        caption: 'Two m-sequences from a preferred pair are XOR-ed; selecting the shift k of the second picks one of 2^n+1 Gold codes (one GPS PRN per satellite).'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="210" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="13" text-anchor="middle">Three-valued cross-correlation vs shift</text>
          <line x1="40" y1="120" x2="520" y2="120" stroke="#9aa7b5"/>
          <text x="500" y="138" fill="#9aa7b5" font-size="10">shift</text>
          <line x1="40" y1="60" x2="520" y2="60" stroke="#ffa94d" stroke-dasharray="4 3"/><text x="45" y="55" fill="#ffa94d" font-size="10">t(n)-2</text>
          <line x1="40" y1="118" x2="520" y2="118" stroke="#63e6be" stroke-dasharray="4 3"/><text x="45" y="114" fill="#63e6be" font-size="10">-1</text>
          <line x1="40" y1="175" x2="520" y2="175" stroke="#ff6b6b" stroke-dasharray="4 3"/><text x="45" y="190" fill="#ff6b6b" font-size="10">-t(n)</text>
          <circle cx="120" cy="118" r="3" fill="#63e6be"/><circle cx="180" cy="60" r="3" fill="#ffa94d"/><circle cx="240" cy="118" r="3" fill="#63e6be"/><circle cx="300" cy="175" r="3" fill="#ff6b6b"/><circle cx="360" cy="118" r="3" fill="#63e6be"/><circle cx="420" cy="60" r="3" fill="#ffa94d"/><circle cx="470" cy="118" r="3" fill="#63e6be"/>
        </svg>`,
        caption: 'Gold cross-correlation only ever lands on the three levels -1, -t(n), and t(n)-2, keeping multi-user interference bounded.'
      }
    ],
    equations: [
      {
        title: 'Gold family size',
        tex: String.raw`$$ N_{Gold} = 2^n + 1 = (2^n-1) + 2 = L + 2 $$`,
        derivation: String.raw`<p>There are $L=2^n-1$ distinct relative shifts of $v$, each producing $u\oplus T^k v$, plus the two parent sequences $u$ and $v$, giving $L+2=2^n+1$ codes.</p>`
      },
      {
        title: 'Cross-correlation peak parameter',
        tex: String.raw`$$ t(n) = 1 + 2^{\lfloor (n+2)/2 \rfloor} $$`,
        derivation: String.raw`<p>Gold's theorem gives the three-valued cross-correlation set $\{-1,-t(n),t(n)-2\}$. The parameter follows the floor of $(n+2)/2$: for odd $n$, $t(n)=1+2^{(n+1)/2}$; for even $n$ (not divisible by 4), $t(n)=1+2^{(n+2)/2}$. Example $n=5$: $\lfloor7/2\rfloor=3$, $t=1+8=9$.</p>`
      },
      {
        title: 'Three cross-correlation values',
        tex: String.raw`$$ \theta_{cross} \in \{\,-1,\ -t(n),\ t(n)-2\,\} $$`,
        derivation: String.raw`<p>For a preferred pair, every pairwise cross-correlation (and Gold-code autocorrelation sidelobe) equals one of these three integers, guaranteeing a hard upper bound $|\theta|\le t(n)$ on mutual interference.</p>`
      },
      {
        title: 'Normalized cross-correlation bound',
        tex: String.raw`$$ \frac{t(n)}{L} \approx \frac{2^{(n+1)/2}}{2^n} = 2^{-(n-1)/2} \sim \sqrt{\frac{2}{L}} $$`,
        derivation: String.raw`<p>Dividing the peak $t(n)\approx2^{(n+1)/2}$ by $L=2^n-1\approx2^n$ shows the normalized interference decays roughly as $\sqrt{2/L}$; longer Gold codes give proportionally cleaner separation between users.</p>`
      },
      {
        title: 'GPS C/A code length',
        tex: String.raw`$$ L = 2^{10} - 1 = 1023,\qquad t(10)=1+2^6=65 $$`,
        derivation: String.raw`<p>GPS uses $n=10$, so the code period is 1023 chips and the three-valued cross-correlation set is $\{-1,-65,63\}$; normalized, $65/1023\approx0.064$, low enough for all satellites to share L1.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`How is a Gold code family constructed?`, back: String.raw`XOR one m-sequence $u$ with every cyclic shift $T^k v$ of a second preferred-pair m-sequence $v$, plus $u$ and $v$ themselves.` },
      { front: String.raw`Gold family size?`, back: String.raw`$2^n+1$.` },
      { front: String.raw`What is the cross-correlation value set?`, back: String.raw`Three values: $\{-1,-t(n),t(n)-2\}$.` },
      { front: String.raw`Formula for $t(n)$?`, back: String.raw`$t(n)=1+2^{\lfloor(n+2)/2\rfloor}$.` },
      { front: String.raw`What is a preferred pair?`, back: String.raw`Two m-sequences (with $n$ not divisible by 4 and a specific decimation relation) whose cross-correlation is bounded three-valued.` },
      { front: String.raw`Why not just use m-sequences for CDMA?`, back: String.raw`Too few of them and their mutual cross-correlation is large/unbounded.` },
      { front: String.raw`What is the autocorrelation trade-off?`, back: String.raw`Gold codes (non-parents) are not maximal length, so autocorrelation gains three-valued sidelobes.` },
      { front: String.raw`$t(n)$ for GPS ($n=10$)?`, back: String.raw`$t=1+2^6=65$; three values $\{-1,-65,63\}$.` },
      { front: String.raw`Which two LFSRs generate GPS C/A?`, back: String.raw`G1 ($x^{10}+x^3+1$) and G2 ($x^{10}+x^9+x^8+x^6+x^3+x^2+1$).` },
      { front: String.raw`How are different GPS PRNs distinguished?`, back: String.raw`Different shifts of G2 (different tap pairs), giving each satellite a unique Gold code.` },
      { front: String.raw`Does normalized cross-correlation improve with $n$?`, back: String.raw`Yes; $t(n)/L\sim\sqrt{2/L}$ decreases as codes get longer.` },
      { front: String.raw`GPS C/A code period and length?`, back: String.raw`1023 chips, repeating every 1 ms at 1.023 Mcps.` }
    ],
    mcqs: [
      { q: String.raw`A Gold code family for $n=7$ has size:`, options: [String.raw`127`, String.raw`128`, String.raw`129`, String.raw`254`], answer: 2, explain: String.raw`$2^7+1=129$.` },
      { q: String.raw`Gold codes are formed by:`, options: [String.raw`concatenating m-sequences`, String.raw`XOR of a preferred pair at each shift`, String.raw`interleaving Barker codes`, String.raw`puncturing convolutional codes`], answer: 1, explain: String.raw`XOR of shifted preferred-pair m-sequences.` },
      { q: String.raw`For $n=5$, $t(n)$ equals:`, options: [String.raw`7`, String.raw`9`, String.raw`11`, String.raw`17`], answer: 1, explain: String.raw`$1+2^{\lfloor7/2\rfloor}=1+2^3=9$.` },
      { q: String.raw`The Gold cross-correlation takes how many distinct values?`, options: [String.raw`1`, String.raw`2`, String.raw`3`, String.raw`unbounded`], answer: 2, explain: String.raw`Three: $\{-1,-t,t-2\}$.` },
      { q: String.raw`GPS C/A codes have length:`, options: [String.raw`511`, String.raw`1023`, String.raw`2047`, String.raw`4095`], answer: 1, explain: String.raw`$n=10\Rightarrow 2^{10}-1=1023$.` },
      { q: String.raw`Compared to m-sequences, Gold codes trade away:`, options: [String.raw`family size`, String.raw`ideal two-valued autocorrelation`, String.raw`code length`, String.raw`bandwidth`], answer: 1, explain: String.raw`Autocorrelation sidelobes appear (three-valued).` },
      { q: String.raw`Different GPS satellites are distinguished by:`, options: [String.raw`carrier frequency`, String.raw`different Gold code (G2 shift)`, String.raw`time slot`, String.raw`polarization`], answer: 1, explain: String.raw`Each PRN is a distinct Gold code.` },
      { q: String.raw`A preferred pair requires $n$ to be:`, options: [String.raw`even`, String.raw`a prime`, String.raw`not divisible by 4`, String.raw`a power of 2`], answer: 2, explain: String.raw`$n$ odd or $n\equiv2\bmod4$.` },
      { q: String.raw`For $n=10$, the three cross-correlation values are:`, options: [String.raw`$\{-1,-33,31\}$`, String.raw`$\{-1,-65,63\}$`, String.raw`$\{-1,-17,15\}$`, String.raw`$\{0,-64,64\}$`], answer: 1, explain: String.raw`$t=65$, so $\{-1,-65,63\}$.` },
      { q: String.raw`Normalized Gold cross-correlation scales roughly as:`, options: [String.raw`$1/L$`, String.raw`$\sqrt{2/L}$`, String.raw`$L$`, String.raw`constant`], answer: 1, explain: String.raw`$t(n)/L\sim\sqrt{2/L}$.` },
      { q: String.raw`Why are Gold codes preferred over m-sequences in CDMA?`, options: [String.raw`better autocorrelation`, String.raw`larger family + bounded cross-correlation`, String.raw`shorter codes`, String.raw`no synchronization needed`], answer: 1, explain: String.raw`Many users need many low-cross-correlation codes.` },
      { q: String.raw`The two parent m-sequences of a Gold family:`, options: [String.raw`are excluded`, String.raw`are usually counted in the $2^n+1$`, String.raw`have zero autocorrelation`, String.raw`must be identical`], answer: 1, explain: String.raw`Family size $2^n-1$ shifts $+2$ parents.` }
    ],
    numericals: [
      { q: String.raw`Compute the Gold family size and $t(n)$ for $n=9$.`, solution: String.raw`<p><b>Formula.</b> $$ N_{Gold} = 2^n + 1, \qquad t(n) = 1 + 2^{\lfloor (n+2)/2 \rfloor}, $$ where $N_{Gold}$ is the family size and $t(n)$ sets the peak of the three-valued cross-correlation set $\{-1,-t,t-2\}$.</p>
        <p><b>Substitute.</b> $$ N_{Gold} = 2^9 + 1, \qquad t(9) = 1 + 2^{\lfloor 11/2 \rfloor} = 1 + 2^5. $$</p>
        <p><b>Compute.</b> $N_{Gold} = 513$; $t(9) = 1 + 32 = 33$, giving values $\{-1, -33, 31\}$.</p>
        <p><b>Explanation.</b> A single preferred pair yields 513 usable spreading codes — vastly more than the handful of length-511 m-sequences — with cross-correlation capped at magnitude 33. That combination of large family and bounded interference is precisely what CDMA needs.</p>` },
      { q: String.raw`For GPS ($n=10$), give the normalized worst-case cross-correlation.`, solution: String.raw`<p><b>Formula.</b> $$ t(n) = 1 + 2^{\lfloor (n+2)/2 \rfloor}, \qquad \theta_{norm} = \frac{t(n)}{L}, \qquad \theta_{dB} = 20\log_{10}\theta_{norm}, $$ where $L = 2^n - 1$ and $\theta_{norm}$ is the peak cross-correlation relative to the autopeak.</p>
        <p><b>Substitute.</b> $$ t(10) = 1 + 2^6 = 65, \qquad L = 1023, \qquad \theta_{norm} = \frac{65}{1023}. $$</p>
        <p><b>Compute.</b> $\theta_{norm} = 0.0635$; $\theta_{dB} = 20\log_{10}(0.0635) \approx -24$ dB.</p>
        <p><b>Explanation.</b> The worst mutual interference between two GPS PRNs is about 24 dB below their own correlation peak — low enough that dozens of satellites share the L1 carrier without one capturing another. Longer codes would push this even lower.</p>` },
      { q: String.raw`How many Gold codes of length 31 exist, and what is their peak cross-correlation?`, solution: String.raw`<p><b>Formula.</b> $$ L = 2^n - 1, \qquad N_{Gold} = 2^n + 1, \qquad t(n) = 1 + 2^{\lfloor (n+2)/2 \rfloor}, $$ with normalized peak $t(n)/L$.</p>
        <p><b>Substitute.</b> $$ L = 31 \Rightarrow n = 5, \qquad N_{Gold} = 2^5 + 1, \qquad t(5) = 1 + 2^{\lfloor 7/2 \rfloor} = 1 + 2^3. $$</p>
        <p><b>Compute.</b> $N_{Gold} = 33$ codes; $t(5) = 9$; normalized peak $= 9/31 \approx 0.29$.</p>
        <p><b>Explanation.</b> Short Gold codes have relatively high cross-correlation (0.29, only about $-11$ dB), so few-user or short-code systems suffer more multiple-access interference. This is why practical CDMA uses long codes where $t(n)/L$ is small.</p>` },
      { q: String.raw`A CDMA system needs at least 200 distinct address codes. What minimum $n$ gives enough Gold codes?`, solution: String.raw`<p><b>Formula.</b> $$ N_{Gold} = 2^n + 1 \ge N_{req} \quad\Rightarrow\quad n \ge \log_2(N_{req} - 1), $$ where $N_{req}$ is the number of required codes.</p>
        <p><b>Substitute.</b> $$ 2^n + 1 \ge 200 \quad\Rightarrow\quad 2^n \ge 199 \quad\Rightarrow\quad n \ge \log_2(199) = 7.64. $$</p>
        <p><b>Compute.</b> Round up to $n = 8$, giving $N_{Gold} = 2^8 + 1 = 257 \ge 200$.</p>
        <p><b>Explanation.</b> A degree-7 family provides only $129 < 200$ codes, so 8 stages are required; degree 8 comfortably supplies 257 addresses. Larger $n$ also lowers normalized cross-correlation, a double benefit for capacity.</p>` },
      { q: String.raw`For $n=11$, find $t(n)$ and the three cross-correlation values.`, solution: String.raw`<p><b>Formula.</b> $$ t(n) = 1 + 2^{\lfloor (n+2)/2 \rfloor}, \qquad \theta_{cross} \in \{-1,\ -t(n),\ t(n)-2\}, $$ where $\theta_{cross}$ is the (un-normalized) cross-correlation.</p>
        <p><b>Substitute.</b> $$ t(11) = 1 + 2^{\lfloor 13/2 \rfloor} = 1 + 2^6. $$</p>
        <p><b>Compute.</b> $t(11) = 65$; the three values are $\{-1, -65, 63\}$.</p>
        <p><b>Explanation.</b> Note $n=11$ (odd) and $n=10$ (even) both give $t=65$ because the floor of $(n+2)/2$ lands on 6 in each case. So the length-2047 and length-1023 families share the same peak magnitude, but the longer code has smaller normalized cross-correlation.</p>` },
      { q: String.raw`Two Gold codes of length 1023 are correlated; the result reads $-65$. Is this expected, and what does it mean?`, solution: String.raw`<p><b>Formula.</b> $$ L = 1023 \Rightarrow n = 10, \qquad t(10) = 1 + 2^6 = 65, \qquad \theta_{cross} \in \{-1,\ -t,\ t-2\} = \{-1,\ -65,\ 63\}. $$</p>
        <p><b>Substitute.</b> Check whether $-65$ is a member of $\{-1, -65, 63\}$.</p>
        <p><b>Compute.</b> Yes — $-65 = -t(10)$ is exactly the negative-peak member of the three-valued set.</p>
        <p><b>Explanation.</b> The reading is expected and represents the worst-case bounded interference between these two users; the guarantee that cross-correlation can never exceed magnitude 65 is the whole reason Gold codes are used for CDMA. Relative to the autopeak of 1023 it is about $-24$ dB down.</p>` }
    ],
    realWorld: String.raw`<p>Gold codes are the address scheme of GPS (37 C/A PRNs of length 1023) and appear in WCDMA scrambling (18-bit Gold codes truncated to a 38400-chip radio frame) and other CDMA systems. Their bounded three-valued cross-correlation is what lets dozens of satellites or users share one carrier without one signal capturing another. Kasami sequences push cross-correlation even lower (the Welch/Sidelnikov bound) at the cost of smaller families, and are used where the tightest isolation is required.</p>`,
    related: ['pn-codes', 'dsss', 'frequency-hopping']
  },
  {
    id: 'fec',
    title: 'Forward Error Correction (FEC)',
    category: 'Spread Spectrum & Coding',
    tags: ['FEC', 'code rate', 'Hamming distance', 'coding gain', 'block code', 'convolutional', 'LDPC', 'Turbo', 'interleaving'],
    summary: String.raw`Forward error correction adds structured redundancy so the receiver can detect and correct errors without retransmission, trading bandwidth/rate for coding gain that pushes performance toward the Shannon limit.`,
    prerequisites: ['bpsk', 'noise', 'comm-basics'],
    intro: String.raw`<p><strong>Why FEC exists.</strong> Every real channel corrupts bits, and the naive fix — ask the sender to retransmit whatever arrived wrong — fails whenever feedback is slow, unavailable, or the link is one-way. A deep-space probe cannot wait an hour for a "please repeat"; a broadcast has no back-channel at all. FEC solves this by sending the redundancy <em>up front</em>: extra structured bits travel alongside the data so the receiver can reconstruct the original entirely on its own. You pay in rate or bandwidth, but you gain "coding gain" — the same reliability at far less transmit power, which in a link budget is worth its weight in gold.</p>
    <p>Forward Error Correction (FEC) adds carefully structured redundant bits at the transmitter so the receiver can correct channel errors on its own, with no feedback or retransmission. The cost is a lower information rate (or more bandwidth) — the code rate $R=k/n<1$; the reward is <strong>coding gain</strong>: the same bit-error rate at a lower $E_b/N_0$, sometimes several dB, worth enormous power or range in a link budget. FEC ranges from simple block codes (Hamming, BCH, Reed-Solomon) through convolutional codes (Viterbi-decoded) to capacity-approaching Turbo and LDPC codes that operate within a fraction of a dB of the Shannon limit. This topic develops code rate, Hamming/minimum distance, error-correcting capability, the code families, coding gain, interleaving, and concatenation.</p>`,
    sections: [
      {
        h: 'Code rate and redundancy',
        html: String.raw`<p>An $(n,k)$ code maps $k$ information bits to $n$ coded bits ($n>k$). The <strong>code rate</strong> is</p>
        <p>$$ R = \frac{k}{n} \le 1, $$</p>
        <p>and the added redundancy is $n-k$ parity bits. A rate-$1/2$ code doubles the transmitted bits; a rate-$3/4$ code adds one parity bit per three data bits. Lower rate = more protection but more overhead. The <strong>bandwidth expansion</strong> for a fixed data rate is $1/R$.</p>
        <div class="callout">Rate is a lever: strong codes (low $R$) buy more coding gain at the cost of throughput/bandwidth. Adaptive systems switch rate to match channel quality (link adaptation).</div>`
      },
      {
        h: 'Hamming distance and minimum distance',
        html: String.raw`<p>The <strong>Hamming distance</strong> $d(\mathbf{c}_1,\mathbf{c}_2)$ between two codewords is the number of bit positions in which they differ. The code's <strong>minimum distance</strong> is the smallest such distance over all codeword pairs:</p>
        <p>$$ d_{min} = \min_{\mathbf{c}_i \neq \mathbf{c}_j} d(\mathbf{c}_i,\mathbf{c}_j). $$</p>
        <p>$d_{min}$ is the single most important parameter of a block code — it determines how many errors the code can detect and correct. Geometrically, codewords are points in an $n$-dimensional binary space; $d_{min}$ is the closest spacing, so decoding = finding the nearest codeword.</p>`
      },
      {
        h: 'Detection and correction capability',
        html: String.raw`<p>From $d_{min}$:</p>
        <ul>
          <li><strong>Error detection:</strong> can detect up to $d_{min}-1$ errors.</li>
          <li><strong>Error correction:</strong> can correct up to $$ t = \left\lfloor \frac{d_{min}-1}{2} \right\rfloor $$ errors.</li>
          <li><strong>Combined:</strong> can simultaneously correct $t$ and detect $e$ errors if $t+e < d_{min}$ (with $e\ge t$).</li>
        </ul>
        <p>Intuition: to correct $t$ errors, spheres of radius $t$ around each codeword must not overlap, which needs $d_{min}\ge2t+1$. Example: $d_{min}=7\Rightarrow t=\lfloor6/2\rfloor=3$ correctable errors; can detect up to 6.</p>
        <div class="callout">A single-error-correcting Hamming code has $d_{min}=3$: $t=1$. A code with $d_{min}=5$ corrects 2 errors.</div>`
      },
      {
        h: 'Code families: block, convolutional, modern',
        html: String.raw`<table class="data">
          <tr><th>Family</th><th>Examples</th><th>Traits</th></tr>
          <tr><td>Block</td><td>Hamming, BCH, Reed-Solomon</td><td>Fixed $(n,k)$ blocks; RS is symbol-based, great for bursts</td></tr>
          <tr><td>Convolutional</td><td>rate 1/2, K=7 (industry standard)</td><td>Continuous, memory via shift register; Viterbi/BCJR decoded</td></tr>
          <tr><td>Turbo</td><td>3GPP, deep space</td><td>Parallel concatenated + iterative (BCJR) decoding; near Shannon</td></tr>
          <tr><td>LDPC</td><td>Wi-Fi, DVB-S2, 5G data</td><td>Sparse parity-check + belief propagation; near Shannon, low floor</td></tr>
        </table>
        <ul>
          <li><strong>Block vs convolutional:</strong> block codes act on independent blocks; convolutional codes have memory, each output depends on current and past inputs (constraint length $K$).</li>
          <li><strong>Reed-Solomon</strong> operates on symbols, correcting whole erroneous symbols — ideal against burst errors (CDs, DVB, QR codes).</li>
          <li><strong>Turbo/LDPC</strong> use iterative soft-decision decoding to approach capacity.</li>
        </ul>`
      },
      {
        h: 'Coding gain and the Shannon limit',
        html: String.raw`<p><strong>Coding gain</strong> is the reduction in required $E_b/N_0$ (dB) to achieve a target BER, compared with uncoded transmission:</p>
        <p>$$ G_{code}[\text{dB}] = \Big(\tfrac{E_b}{N_0}\Big)_{uncoded} - \Big(\tfrac{E_b}{N_0}\Big)_{coded}\ \text{at the same BER}. $$</p>
        <p>Typical numbers: a rate-1/2, K=7 convolutional code with soft-decision Viterbi delivers ~5-6 dB at BER $10^{-5}$; concatenated RS+convolutional gives ~7-8 dB; Turbo/LDPC reach within ~0.5-1 dB of the <strong>Shannon limit</strong>. Shannon's channel-coding theorem says error-free communication is possible for any rate below capacity $C=B\log_2(1+\mathrm{SNR})$; the absolute floor for reliable comms is $E_b/N_0 = \ln 2 = -1.59$ dB.</p>
        <div class="callout">Coding gain is "free" power in the link budget — a 6 dB code can quadruple range or let you shrink the antenna/PA.</div>`
      },
      {
        h: 'Interleaving and burst errors',
        html: String.raw`<p>Most FEC codes are designed for <em>random</em> errors and fail on <em>bursts</em> (fades, scratches, impulse noise). <strong>Interleaving</strong> permutes coded bits before transmission and de-interleaves at the receiver, so a channel burst is scattered into isolated single errors that the code can handle.</p>
        <ul>
          <li><strong>Block interleaver:</strong> write by rows, read by columns; depth chosen to exceed the longest expected burst.</li>
          <li><strong>Convolutional interleaver:</strong> lower memory/latency for the same spreading.</li>
          <li>Interleaving adds latency and memory — a real cost in delay-sensitive links, so depth is a design trade.</li>
        </ul>
        <p>This is essential in fading wireless channels and in FHSS/DSSS against partial-band or pulsed jamming.</p>`
      },
      {
        h: 'Concatenation and hard vs soft decisions',
        html: String.raw`<p><strong>Concatenation</strong> cascades two codes for combined strength: classically an outer Reed-Solomon code (burst/symbol correction) around an inner convolutional code (random-error correction), with an interleaver between. The inner decoder's occasional error bursts are cleaned up by the outer RS. This scheme (used in Voyager, DVB) predates Turbo/LDPC and still delivers excellent gain.</p>
        <ul>
          <li><strong>Hard-decision</strong> decoding uses only the demodulator's 1/0 output.</li>
          <li><strong>Soft-decision</strong> decoding uses the analog confidence (log-likelihood) of each bit, gaining roughly <strong>2 dB</strong> over hard decisions — the reason modern decoders (Viterbi soft, Turbo, LDPC) are soft-input.</li>
        </ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">Essence: spend rate to buy distance between codewords; that distance becomes coding gain in the link budget.</div>
        <ul>
          <li><strong>Rate $R=k/n$</strong> is the throughput lever; bandwidth expansion for fixed data rate is $1/R$. Lower rate means more protection but more overhead.</li>
          <li><strong>Minimum distance $d_{min}$ is king:</strong> it corrects $t=\lfloor(d_{min}-1)/2\rfloor$ errors and detects up to $d_{min}-1$, because non-overlapping decoding spheres need $d_{min}\ge2t+1$.</li>
          <li><strong>Three families:</strong> block (fixed blocks; RS excels on bursts), convolutional (memory, Viterbi-decoded), and iterative Turbo/LDPC (soft, near-Shannon).</li>
          <li><strong>Coding gain</strong> is the dB reduction in required $E_b/N_0$ at a target BER; the absolute floor is the Shannon limit $E_b/N_0=\ln2=-1.59$ dB.</li>
          <li><strong>Two force-multipliers:</strong> interleaving turns bursts into scattered errors, and soft-decision decoding adds about 2 dB over hard decisions.</li>
          <li><strong>Concatenation</strong> (outer RS + interleaver + inner convolutional) combines burst and random-error strength — the classic deep-space and broadcast scheme.</li>
        </ul>`
      }
    ],
    keyPoints: [
      String.raw`An $(n,k)$ code has rate $R=k/n$; bandwidth expansion for fixed data rate is $1/R$.`,
      String.raw`Minimum distance $d_{min}$ is the smallest Hamming distance between codewords and governs performance.`,
      String.raw`Error correction: $t=\lfloor(d_{min}-1)/2\rfloor$; detection up to $d_{min}-1$ errors.`,
      String.raw`To correct $t$ errors needs $d_{min}\ge2t+1$ (non-overlapping decoding spheres).`,
      String.raw`Block codes act on independent blocks; convolutional codes have memory (constraint length $K$).`,
      String.raw`Reed-Solomon is symbol-based and excels against burst errors.`,
      String.raw`Turbo and LDPC use iterative soft decoding to approach the Shannon limit.`,
      String.raw`Coding gain = reduction in required $E_b/N_0$ for a target BER (dB).`,
      String.raw`The Shannon limit sets the absolute floor $E_b/N_0=\ln2=-1.59$ dB for reliable comms.`,
      String.raw`Interleaving scatters burst errors into isolated errors the code can fix (at a latency cost).`,
      String.raw`Soft-decision decoding gains ~2 dB over hard-decision.`,
      String.raw`Concatenation (outer RS + inner convolutional + interleaver) combines burst and random-error strengths.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="170" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Concatenated FEC chain</text>
          <rect x="20" y="60" width="90" height="40" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="65" y="76" fill="#e6edf3" font-size="10" text-anchor="middle">Outer</text><text x="65" y="90" fill="#e6edf3" font-size="10" text-anchor="middle">RS enc</text>
          <rect x="130" y="60" width="90" height="40" fill="none" stroke="#63e6be" stroke-width="1.5"/><text x="175" y="76" fill="#e6edf3" font-size="10" text-anchor="middle">Inter-</text><text x="175" y="90" fill="#e6edf3" font-size="10" text-anchor="middle">leaver</text>
          <rect x="240" y="60" width="90" height="40" fill="none" stroke="#ffa94d" stroke-width="1.5"/><text x="285" y="76" fill="#e6edf3" font-size="10" text-anchor="middle">Inner conv</text><text x="285" y="90" fill="#e6edf3" font-size="10" text-anchor="middle">enc (R=1/2)</text>
          <rect x="350" y="60" width="80" height="40" fill="none" stroke="#b197fc" stroke-width="1.5"/><text x="390" y="84" fill="#e6edf3" font-size="10" text-anchor="middle">Modulator</text>
          <line x1="110" y1="80" x2="130" y2="80" stroke="#9aa7b5" marker-end="url(#arr-fec)"/>
          <line x1="220" y1="80" x2="240" y2="80" stroke="#9aa7b5" marker-end="url(#arr-fec)"/>
          <line x1="330" y1="80" x2="350" y2="80" stroke="#9aa7b5" marker-end="url(#arr-fec)"/>
          <line x1="430" y1="80" x2="510" y2="80" stroke="#9aa7b5" marker-end="url(#arr-fec)"/>
          <text x="470" y="72" fill="#9aa7b5" font-size="10">channel</text>
          <text x="20" y="130" fill="#9aa7b5" font-size="10">Receiver mirrors in reverse: demod -> Viterbi -> deinterleave -> RS decode</text>
          <defs><marker id="arr-fec" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#9aa7b5"/></marker></defs>
        </svg>`,
        caption: 'Classic concatenation: outer Reed-Solomon corrects residual bursts from the inner Viterbi-decoded convolutional code; the interleaver de-correlates errors.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="210" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="13" text-anchor="middle">BER vs Eb/N0: coding gain</text>
          <line x1="50" y1="180" x2="510" y2="180" stroke="#9aa7b5"/><text x="480" y="198" fill="#9aa7b5" font-size="10">Eb/N0 (dB)</text>
          <line x1="50" y1="180" x2="50" y2="40" stroke="#9aa7b5"/><text x="10" y="50" fill="#9aa7b5" font-size="10">BER</text>
          <path d="M120 50 C200 90 260 150 340 175" fill="none" stroke="#ff6b6b" stroke-width="2"/><text x="330" y="60" fill="#ff6b6b" font-size="10">uncoded</text>
          <path d="M70 50 C140 90 200 150 280 175" fill="none" stroke="#63e6be" stroke-width="2"/><text x="90" y="60" fill="#63e6be" font-size="10">coded</text>
          <line x1="290" y1="140" x2="345" y2="140" stroke="#ffa94d" stroke-width="1.5" stroke-dasharray="3 3"/>
          <text x="300" y="132" fill="#ffa94d" font-size="10">coding gain (dB)</text>
        </svg>`,
        caption: 'At a fixed BER the coded curve sits to the left of the uncoded curve; the horizontal gap is the coding gain in dB.'
      },
      {
        title: String.raw`FEC code taxonomy`,
        svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="240" fill="#1c232e"/>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">FEC code families</text>
          <rect x="205" y="34" width="130" height="30" fill="none" stroke="#e6edf3" stroke-width="1.5"/><text x="270" y="53" fill="#e6edf3" font-size="10" text-anchor="middle">FEC codes</text>
          <rect x="20" y="110" width="150" height="46" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="95" y="128" fill="#4dabf7" font-size="10" text-anchor="middle">Block</text><text x="95" y="143" fill="#9aa7b5" font-size="8" text-anchor="middle">Hamming, BCH, RS</text>
          <rect x="195" y="110" width="150" height="46" fill="none" stroke="#63e6be" stroke-width="1.5"/><text x="270" y="128" fill="#63e6be" font-size="10" text-anchor="middle">Convolutional</text><text x="270" y="143" fill="#9aa7b5" font-size="8" text-anchor="middle">R=1/2 K=7, Viterbi</text>
          <rect x="370" y="110" width="150" height="46" fill="none" stroke="#b197fc" stroke-width="1.5"/><text x="445" y="128" fill="#b197fc" font-size="10" text-anchor="middle">Iterative</text><text x="445" y="143" fill="#9aa7b5" font-size="8" text-anchor="middle">Turbo, LDPC</text>
          <line x1="270" y1="64" x2="95" y2="110" stroke="#9aa7b5" marker-end="url(#arr3-fec)"/>
          <line x1="270" y1="64" x2="270" y2="110" stroke="#9aa7b5" marker-end="url(#arr3-fec)"/>
          <line x1="270" y1="64" x2="445" y2="110" stroke="#9aa7b5" marker-end="url(#arr3-fec)"/>
          <text x="95" y="180" fill="#9aa7b5" font-size="8" text-anchor="middle">fixed (n,k) blocks</text>
          <text x="270" y="180" fill="#9aa7b5" font-size="8" text-anchor="middle">memory, constraint length K</text>
          <text x="445" y="180" fill="#9aa7b5" font-size="8" text-anchor="middle">soft iterative, near Shannon</text>
          <text x="270" y="215" fill="#9aa7b5" font-size="9" text-anchor="middle">Left to right: rising complexity and coding gain (toward the −1.59 dB limit).</text>
          <defs><marker id="arr3-fec" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#9aa7b5"/></marker></defs>
        </svg>`,
        caption: 'The three FEC families: block codes on fixed (n,k) blocks, convolutional codes with shift-register memory (Viterbi-decoded), and iterative Turbo/LDPC codes whose soft belief-propagation decoding approaches the Shannon limit.'
      }
    ],
    equations: [
      {
        title: 'Code rate',
        tex: String.raw`$$ R = \frac{k}{n},\qquad 0 < R \le 1 $$`,
        derivation: String.raw`<p>An $(n,k)$ code carries $k$ information bits in $n$ transmitted bits. The fraction of useful bits is $k/n$; the overhead is $(n-k)/n=1-R$ and bandwidth expansion is $1/R$.</p>`
      },
      {
        title: 'Error-correcting capability',
        tex: String.raw`$$ t = \left\lfloor \frac{d_{min}-1}{2} \right\rfloor $$`,
        derivation: String.raw`<p>Decoding spheres of radius $t$ around each codeword must be disjoint, so the minimum separation must satisfy $d_{min}\ge2t+1$. Solving, $t\le(d_{min}-1)/2$; the largest integer $t$ is the floor. Example $d_{min}=5\Rightarrow t=2$.</p>`
      },
      {
        title: 'Error-detection capability',
        tex: String.raw`$$ e_{detect} = d_{min} - 1 $$`,
        derivation: String.raw`<p>Any error pattern of weight up to $d_{min}-1$ cannot turn one codeword into another (they differ by at least $d_{min}$), so it is detectable. A weight-$d_{min}$ error could map onto a valid codeword and go undetected.</p>`
      },
      {
        title: 'Coding gain',
        tex: String.raw`$$ G_{code} = \left(\frac{E_b}{N_0}\right)_{uncoded} - \left(\frac{E_b}{N_0}\right)_{coded}\ \text{(dB, at equal BER)} $$`,
        derivation: String.raw`<p>Plot BER vs $E_b/N_0$ for coded and uncoded systems. At a chosen BER the coded curve requires less $E_b/N_0$; the horizontal difference in dB is the coding gain — directly usable as extra margin in a link budget.</p>`
      },
      {
        title: 'Asymptotic coding gain (block code)',
        tex: String.raw`$$ G_{a} \approx 10\log_{10}\!\big(R\,d_{min}\big)\ \text{dB} $$`,
        derivation: String.raw`<p>For hard-decision at high SNR the gain grows with the product of rate and minimum distance; soft-decision roughly doubles the effective distance, adding about $10\log_{10}2\approx3$ dB in the ideal limit (about 2 dB realized). This shows why both $R$ (keep it up) and $d_{min}$ (make it large) matter.</p>`
      },
      {
        title: 'Shannon limit',
        tex: String.raw`$$ C = B\log_2\!\left(1+\frac{S}{N}\right),\qquad \left(\frac{E_b}{N_0}\right)_{min}=\ln 2 = -1.59\ \text{dB} $$`,
        derivation: String.raw`<p>Shannon's capacity gives the maximum error-free rate. Taking $R=C/B\to0$ (spectral efficiency to zero) yields the absolute minimum energy per bit, $E_b/N_0=\ln2$, i.e. $-1.59$ dB. No code can do better; Turbo/LDPC get within a fraction of a dB.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Define code rate.`, back: String.raw`$R=k/n$ for an $(n,k)$ code; bandwidth expansion is $1/R$.` },
      { front: String.raw`What is minimum distance $d_{min}$?`, back: String.raw`The smallest Hamming distance between any two codewords; it governs detection/correction power.` },
      { front: String.raw`Error-correcting capability formula?`, back: String.raw`$t=\lfloor(d_{min}-1)/2\rfloor$.` },
      { front: String.raw`Condition to correct $t$ errors?`, back: String.raw`$d_{min}\ge2t+1$.` },
      { front: String.raw`How many errors can a code detect?`, back: String.raw`Up to $d_{min}-1$.` },
      { front: String.raw`Block vs convolutional code?`, back: String.raw`Block: independent $(n,k)$ blocks. Convolutional: memory via shift register, output depends on current+past inputs.` },
      { front: String.raw`Which code excels at burst errors?`, back: String.raw`Reed-Solomon (symbol-based).` },
      { front: String.raw`Define coding gain.`, back: String.raw`Reduction in required $E_b/N_0$ (dB) for a target BER versus uncoded.` },
      { front: String.raw`Shannon absolute limit on $E_b/N_0$?`, back: String.raw`$\ln2=-1.59$ dB.` },
      { front: String.raw`Why interleave?`, back: String.raw`To scatter burst errors into isolated errors the random-error code can correct.` },
      { front: String.raw`Soft vs hard decision gain?`, back: String.raw`Soft-decision decoding gains about 2 dB over hard-decision.` },
      { front: String.raw`Classic concatenation scheme?`, back: String.raw`Outer Reed-Solomon + interleaver + inner convolutional (Viterbi) code.` }
    ],
    mcqs: [
      { q: String.raw`A (7,4) code has rate:`, options: [String.raw`4/7`, String.raw`7/4`, String.raw`3/7`, String.raw`1/2`], answer: 0, explain: String.raw`$R=k/n=4/7$.` },
      { q: String.raw`A code with $d_{min}=7$ can correct:`, options: [String.raw`2 errors`, String.raw`3 errors`, String.raw`6 errors`, String.raw`7 errors`], answer: 1, explain: String.raw`$t=\lfloor6/2\rfloor=3$.` },
      { q: String.raw`To guarantee correction of 2 errors, $d_{min}$ must be at least:`, options: [String.raw`3`, String.raw`4`, String.raw`5`, String.raw`6`], answer: 2, explain: String.raw`$d_{min}\ge2t+1=5$.` },
      { q: String.raw`Reed-Solomon codes are especially good against:`, options: [String.raw`random single-bit errors`, String.raw`burst errors`, String.raw`phase noise`, String.raw`Doppler`], answer: 1, explain: String.raw`Symbol-based correction handles bursts.` },
      { q: String.raw`Soft-decision decoding typically gains about:`, options: [String.raw`0.5 dB`, String.raw`2 dB`, String.raw`6 dB`, String.raw`10 dB`], answer: 1, explain: String.raw`~2 dB over hard-decision.` },
      { q: String.raw`The Shannon minimum $E_b/N_0$ for reliable communication is:`, options: [String.raw`0 dB`, String.raw`$-1.59$ dB`, String.raw`$-3$ dB`, String.raw`$+1.59$ dB`], answer: 1, explain: String.raw`$\ln2=-1.59$ dB.` },
      { q: String.raw`Interleaving primarily helps by:`, options: [String.raw`increasing rate`, String.raw`converting bursts to scattered errors`, String.raw`reducing latency`, String.raw`raising $d_{min}$`], answer: 1, explain: String.raw`De-correlates burst errors.` },
      { q: String.raw`A code that can detect up to 4 errors has $d_{min}$ of at least:`, options: [String.raw`4`, String.raw`5`, String.raw`8`, String.raw`9`], answer: 1, explain: String.raw`Detection $=d_{min}-1\Rightarrow d_{min}\ge5$.` },
      { q: String.raw`Turbo and LDPC codes are notable for:`, options: [String.raw`no redundancy`, String.raw`approaching the Shannon limit via iterative decoding`, String.raw`only detecting errors`, String.raw`working without SNR`], answer: 1, explain: String.raw`Iterative soft decoding near capacity.` },
      { q: String.raw`Bandwidth expansion for a rate-1/3 code (fixed data rate) is:`, options: [String.raw`1.5x`, String.raw`2x`, String.raw`3x`, String.raw`1/3x`], answer: 2, explain: String.raw`$1/R=3$.` },
      { q: String.raw`In concatenation, the outer code is usually:`, options: [String.raw`convolutional`, String.raw`Reed-Solomon`, String.raw`repetition`, String.raw`Hamming(3,1)`], answer: 1, explain: String.raw`RS outer cleans inner decoder bursts.` },
      { q: String.raw`A single-error-correcting Hamming code has $d_{min}$:`, options: [String.raw`2`, String.raw`3`, String.raw`4`, String.raw`5`], answer: 1, explain: String.raw`$d_{min}=3\Rightarrow t=1$.` }
    ],
    numericals: [
      { q: String.raw`A (255,223) Reed-Solomon code (bytes). Find the code rate and number of correctable symbol errors.`, solution: String.raw`<p><b>Formula.</b> $$ R = \frac{k}{n}, \qquad t = \frac{n-k}{2}, $$ where $(n,k)$ are the coded and information symbol counts, $R$ the code rate, and $t$ the number of correctable symbol errors (RS is maximum-distance-separable, so $d_{min}=n-k+1$).</p>
        <p><b>Substitute.</b> $$ R = \frac{223}{255}, \qquad t = \frac{255-223}{2}. $$</p>
        <p><b>Compute.</b> $R = 0.875$; parity symbols $n-k = 32$; $t = 16$ symbol errors.</p>
        <p><b>Explanation.</b> This classic code spends 32 parity bytes to correct any 16 corrupted bytes per 255-byte block while keeping 87.5% throughput. Because it works on whole symbols, a single burst that damages many bits within one byte still costs only one symbol — ideal against bursts.</p>` },
      { q: String.raw`A block code has $d_{min}=9$. How many errors can it correct and detect?`, solution: String.raw`<p><b>Formula.</b> $$ t = \left\lfloor \frac{d_{min}-1}{2} \right\rfloor, \qquad e_{detect} = d_{min} - 1, $$ where $t$ is the correctable and $e_{detect}$ the detectable error count.</p>
        <p><b>Substitute.</b> $$ t = \left\lfloor \frac{9-1}{2} \right\rfloor, \qquad e_{detect} = 9 - 1. $$</p>
        <p><b>Compute.</b> $t = \lfloor 4 \rfloor = 4$ correctable; $e_{detect} = 8$ detectable.</p>
        <p><b>Explanation.</b> Decoding spheres of radius 4 around each codeword stay disjoint since $d_{min}=9\ge 2\cdot4+1$. If used purely for detection the code catches any pattern of up to 8 errors; correction is the more demanding task, hence the smaller number.</p>` },
      { q: String.raw`Uncoded BPSK needs 9.6 dB $E_b/N_0$ for BER $10^{-5}$; a coded system needs 4.4 dB. What is the coding gain?`, solution: String.raw`<p><b>Formula.</b> $$ G_{code} = \left(\frac{E_b}{N_0}\right)_{uncoded} - \left(\frac{E_b}{N_0}\right)_{coded}\ \ [\text{dB, at equal BER}], $$ the horizontal gap between the coded and uncoded BER curves.</p>
        <p><b>Substitute.</b> $$ G_{code} = 9.6 - 4.4. $$</p>
        <p><b>Compute.</b> $G_{code} = 5.2$ dB.</p>
        <p><b>Explanation.</b> The code buys 5.2 dB of "free" power in the link budget for the same error rate — enough to nearly quadruple range or shrink the amplifier. This is a typical figure for a good convolutional code with soft-decision decoding.</p>` },
      { q: String.raw`Estimate asymptotic hard-decision gain of a rate-1/2 code with $d_{min}=10$.`, solution: String.raw`<p><b>Formula.</b> $$ G_a \approx 10\log_{10}(R\,d_{min})\ \ [\text{dB}], $$ where $R$ is the code rate and $d_{min}$ the minimum distance; soft decision adds roughly 2 dB more.</p>
        <p><b>Substitute.</b> $$ G_a \approx 10\log_{10}(0.5 \times 10) = 10\log_{10}(5). $$</p>
        <p><b>Compute.</b> $G_a = 10 \times 0.699 = 7.0$ dB (hard decision); soft decision $\approx 9$ dB.</p>
        <p><b>Explanation.</b> The gain rises with the product $R\,d_{min}$, so both keeping the rate up and pushing $d_{min}$ large matter. This asymptotic value is optimistic — realized gain at practical BER is a bit lower — but it captures the right scaling.</p>` },
      { q: String.raw`A channel has bursts up to 200 bits. Design a block interleaver depth for a code correcting isolated errors only.`, solution: String.raw`<p><b>Formula.</b> $$ D > B_{max}, \qquad \text{latency} \propto D \times (\text{block length}), $$ where $D$ is the interleaver depth (number of rows) and $B_{max}$ the longest expected burst.</p>
        <p><b>Substitute.</b> $$ D > 200 \quad\Rightarrow\quad \text{choose } D = 256. $$</p>
        <p><b>Compute.</b> With $D = 256$ rows, a 200-bit burst is spread so that no codeword receives more than one erroneous bit.</p>
        <p><b>Explanation.</b> Writing by rows and reading by columns scatters consecutive channel errors across many codewords, converting an uncorrectable burst into isolated single errors the code can fix. The price is latency proportional to the interleaver span, so depth is a delay-versus-robustness trade.</p>` },
      { q: String.raw`Shannon capacity of a 20 MHz channel at SNR 30 dB (1000 linear).`, solution: String.raw`<p><b>Formula.</b> $$ C = B\log_2\!\left(1 + \frac{S}{N}\right), $$ where $C$ is the capacity (bits/s), $B$ the bandwidth, and $S/N$ the linear signal-to-noise ratio.</p>
        <p><b>Substitute.</b> $$ C = 20\times10^6 \times \log_2(1 + 1000) = 20\times10^6 \times \log_2(1001). $$</p>
        <p><b>Compute.</b> $\log_2(1001) = 9.97$; $C = 20\times10^6 \times 9.97 \approx 1.99\times10^8 \approx 199$ Mbps.</p>
        <p><b>Explanation.</b> No code can reliably exceed 199 Mbps on this channel; real systems reach a fraction of it. The 30 dB SNR contributes almost 10 bits/s per Hz, illustrating how capacity grows only logarithmically with SNR but linearly with bandwidth.</p>` }
    ],
    realWorld: String.raw`<p>FEC is universal: Reed-Solomon protects CDs, DVDs, QR codes, and DVB; convolutional + Viterbi ran GSM, satellite, and deep-space links (Voyager used RS+convolutional concatenation); Turbo codes power 3G/4G data; LDPC dominates Wi-Fi 6, DVB-S2, and 5G data channels, operating within ~0.5 dB of Shannon. In spread spectrum, FEC + interleaving is the standard defense against partial-band and pulsed jamming, and the coding gain is a headline term in every modern link budget.</p>`,
    related: ['viterbi', 'bpsk', 'noise', 'link-budget']
  },
  {
    id: 'viterbi',
    title: 'Viterbi Decoder',
    category: 'Spread Spectrum & Coding',
    tags: ['Viterbi', 'trellis', 'MLSE', 'ACS', 'soft decision', 'traceback', 'convolutional'],
    summary: String.raw`The Viterbi algorithm performs maximum-likelihood sequence estimation of a convolutional code by walking a trellis with add-compare-select operations and traceback, giving optimal decoding at complexity exponential in constraint length.`,
    prerequisites: ['fec', 'bpsk', 'matched-filter'],
    intro: String.raw`<p><strong>Why the Viterbi algorithm exists.</strong> A convolutional code has memory, so the "best guess" for the transmitted message is the whole <em>sequence</em> of bits that is jointly most likely — not each bit decided in isolation. But checking every candidate sequence is hopeless: for a length-$N$ message there are $2^N$ possibilities, astronomically many. Viterbi's insight is that the code's finite memory lets you throw away most candidates early without ever losing the winner. By keeping just one best path into each state, the impossible $2^N$ search collapses to a modest, repeatable per-step computation. That is why a genuinely optimal decoder became practical enough to sit in billions of phones and satellites.</p>
    <p>The Viterbi algorithm is the optimal (maximum-likelihood) decoder for convolutional codes and, more generally, for any finite-state Markov process observed in noise — it solves the Maximum-Likelihood Sequence Estimation (MLSE) problem efficiently. Instead of enumerating all $2^{kL}$ possible transmitted sequences, it exploits the trellis structure so that at each step only one survivor path per state need be retained, via the <strong>add-compare-select (ACS)</strong> recursion. This makes decoding cost <em>linear in sequence length</em> and only exponential in the (small) constraint length. Viterbi decoding underlies GSM, satellite, Wi-Fi legacy modes, and deep-space telemetry, and its soft-decision form buys about 2 dB over hard decisions. This topic covers the trellis, state count, branch/path metrics, ACS, hard vs soft decisions, traceback depth, optimality, and complexity.</p>`,
    sections: [
      {
        h: 'Convolutional encoder and state',
        html: String.raw`<p>A rate-$k/n$ convolutional encoder has a shift register of constraint length $K$ (total $K$ stages including the current input). The encoder is a finite-state machine: its <strong>state</strong> is the content of the $K-1$ memory bits (the current input is the transition trigger). Hence the number of states is</p>
        <p>$$ N_{states} = 2^{K-1}. $$</p>
        <p>Each output $n$-bit symbol depends on the current input and the state; feeding one input bit moves the machine to a new state and emits $n$ coded bits. The classic industry code is rate-1/2, $K=7$ (64 states), generator polynomials $(133,171)_8$.</p>
        <div class="callout">Constraint length $K$ counts the register span; memory is $K-1$; states $=2^{K-1}$; each state has 2 outgoing branches (for input 0 or 1) in a rate-1/n code.</div>`
      },
      {
        h: 'The trellis',
        html: String.raw`<p>Unrolling the state machine over time gives the <strong>trellis</strong>: a lattice with $2^{K-1}$ state nodes at each time step and branches connecting states allowed by the encoder. Every valid coded sequence is a unique path through the trellis; decoding is finding the path closest (most likely) to the received sequence.</p>
        <ul>
          <li>At each time step, each state has exactly 2 incoming branches (rate-1/n), from the two predecessor states.</li>
          <li>Each branch is labeled with the $n$ output bits the encoder would produce on that transition.</li>
          <li>The trellis is <em>time-invariant</em> after the initial transient, so the same butterfly structure repeats every step.</li>
        </ul>`
      },
      {
        h: 'Branch and path metrics',
        html: String.raw`<p>The decoder assigns a <strong>branch metric</strong> to each trellis branch: a measure of disagreement between the received symbol and the branch's expected output.</p>
        <ul>
          <li><strong>Hard decision:</strong> branch metric = Hamming distance between received hard bits and the branch label.</li>
          <li><strong>Soft decision:</strong> branch metric = Euclidean distance (or correlation / log-likelihood) using the demodulator's analog confidences.</li>
        </ul>
        <p>A <strong>path metric</strong> is the accumulated branch metric along a path from the start to a given state. The most likely (ML) path is the one with the <em>smallest</em> total metric (distance) — equivalently the largest likelihood.</p>
        <p>$$ PM_{new}(s') = PM_{old}(s) + BM(s\to s'). $$</p>`
      },
      {
        h: 'Add-Compare-Select (ACS)',
        html: String.raw`<p>The algorithm's engine is the <strong>ACS</strong> recursion, executed for every state at every time step:</p>
        <ol>
          <li><strong>Add:</strong> for each of the 2 branches entering a state, add the branch metric to the predecessor's path metric.</li>
          <li><strong>Compare:</strong> compare the 2 candidate path metrics.</li>
          <li><strong>Select:</strong> keep the smaller (the <em>survivor</em>) and discard the other; store the surviving predecessor (traceback pointer).</li>
        </ol>
        <p>Key insight: any optimal path passing through a state must use that state's survivor prefix, so only <strong>one survivor per state</strong> need be stored — this is what tames the exponential path count. Work per step is proportional to the number of states, so total ACS operations $\approx 2\cdot 2^{K-1}$ per decoded bit (two adds + one compare per state).</p>`
      },
      {
        h: 'Traceback and decision depth',
        html: String.raw`<p>Survivors converge: after enough steps, all survivor paths share a common history. The decoder therefore delays its decision by a <strong>traceback depth</strong> $L_{tb}$ and reads off the oldest bit of the best survivor. The rule of thumb is</p>
        <p>$$ L_{tb} \approx 5K \quad\text{(often 4-6 }K\text{)}. $$</p>
        <p>For $K=7$ this is ~35 bits (commonly 32-48). Too shallow a traceback costs performance (paths not yet merged); too deep wastes memory and latency. Two implementation styles: <em>register-exchange</em> (fast, more logic) and <em>traceback-memory</em> (less logic, more latency).</p>
        <div class="callout">Traceback depth is a latency/performance knob: $\sim5K$ balances near-optimal BER against memory and delay.</div>`
      },
      {
        h: 'Hard vs soft decision and MLSE optimality',
        html: String.raw`<p>Because ACS only depends on the branch metric definition, switching from Hamming (hard) to Euclidean (soft) metrics converts a hard-decision Viterbi decoder into a soft-decision one, gaining about <strong>2 dB</strong> at typical BER. Soft metrics are usually quantized to 3 bits (8 levels), which recovers most of the ideal gain.</p>
        <p>The Viterbi algorithm is <strong>MLSE-optimal</strong>: for a memoryless channel it finds the transmitted sequence that maximizes the likelihood of the whole received sequence (not per-bit) — no decoder can do better on sequence error probability. The related <strong>BCJR</strong> algorithm is bit-optimal (MAP) and is used inside Turbo decoders where soft outputs are needed.</p>`
      },
      {
        h: 'Complexity and scaling',
        html: String.raw`<p>Per decoded bit, the decoder performs ACS at each of $2^{K-1}$ states, so complexity is</p>
        <p>$$ \mathcal{O}\big(2^{K-1}\big)\ \text{per bit} \Rightarrow \mathcal{O}\big(N\cdot 2^{K-1}\big)\ \text{for length } N. $$</p>
        <ul>
          <li>Linear in sequence length $N$ — a huge win over the naive $2^N$ path search.</li>
          <li>Exponential in constraint length $K$ — this caps practical $K$ (rarely above 7-9 for hardware Viterbi; larger $K$ moves to sequential decoding or Turbo/LDPC).</li>
          <li>Memory scales as (states) $\times$ (traceback depth): $2^{K-1}\times L_{tb}$.</li>
        </ul>
        <div class="callout">Doubling $K$ squares the state count; going from $K=7$ (64 states) to $K=9$ (256 states) is a 4x hardware jump for ~1 dB more gain — diminishing returns drive the choice of $K=7$ as the sweet spot.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">In one sentence: keep the single best path into each state, and an impossible $2^N$ search becomes a cheap repeated ACS step.</div>
        <ul>
          <li><strong>The trellis</strong> unrolls the encoder's $2^{K-1}$ states over time; every valid coded sequence is one path, and decoding is finding the most likely path.</li>
          <li><strong>Metrics:</strong> branch metrics measure disagreement with the received symbol (Hamming for hard, Euclidean/correlation for soft); path metrics accumulate them, and the ML path minimizes the total.</li>
          <li><strong>ACS is the engine:</strong> Add-Compare-Select keeps exactly one survivor per state, which is what tames the exponential path count — the key idea of the whole algorithm.</li>
          <li><strong>Traceback depth $\approx5K$</strong> delays the decision until survivors merge, trading a little latency for near-optimal BER.</li>
          <li><strong>Optimality and cost:</strong> Viterbi is MLSE-optimal; complexity is $\mathcal{O}(N\,2^{K-1})$ — linear in length, exponential in $K$ — which caps practical $K$ around 7–9.</li>
          <li><strong>Soft decision adds ~2 dB</strong>, and the related BCJR/MAP algorithm supplies the soft outputs used inside Turbo decoders.</li>
        </ul>`
      }
    ],
    keyPoints: [
      String.raw`Viterbi is the maximum-likelihood (MLSE) decoder for convolutional codes.`,
      String.raw`Number of trellis states is $2^{K-1}$ for constraint length $K$.`,
      String.raw`Branch metric = Hamming distance (hard) or Euclidean distance / correlation (soft).`,
      String.raw`Path metric = accumulated branch metrics; the ML path minimizes total distance.`,
      String.raw`ACS = Add-Compare-Select: keep one survivor per state, discarding the rest.`,
      String.raw`Keeping one survivor per state is what avoids the exponential $2^N$ path explosion.`,
      String.raw`Traceback depth $\approx5K$ (typically 4-6K) trades latency/memory for near-optimal BER.`,
      String.raw`Soft-decision Viterbi gains about 2 dB over hard-decision.`,
      String.raw`Complexity is linear in sequence length, exponential in constraint length: $\mathcal{O}(N\,2^{K-1})$.`,
      String.raw`Each decoded bit costs about $2\cdot2^{K-1}$ ACS add/compare operations (rate-1/n).`,
      String.raw`The standard code is rate-1/2, $K=7$, 64 states, generators $(133,171)_8$.`,
      String.raw`BCJR (MAP) is the bit-optimal soft-output cousin used inside Turbo decoders.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="240" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Trellis (4 states, K=3) with survivors</text>
          <text x="30" y="55" fill="#9aa7b5" font-size="10">00</text>
          <text x="30" y="105" fill="#9aa7b5" font-size="10">01</text>
          <text x="30" y="155" fill="#9aa7b5" font-size="10">10</text>
          <text x="30" y="205" fill="#9aa7b5" font-size="10">11</text>
          <g stroke-width="1.2" fill="none">
            <line x1="70" y1="50" x2="200" y2="50" stroke="#63e6be"/>
            <line x1="70" y1="50" x2="200" y2="150" stroke="#9aa7b5"/>
            <line x1="70" y1="100" x2="200" y2="50" stroke="#9aa7b5"/>
            <line x1="70" y1="100" x2="200" y2="150" stroke="#9aa7b5"/>
            <line x1="70" y1="150" x2="200" y2="100" stroke="#9aa7b5"/>
            <line x1="70" y1="200" x2="200" y2="100" stroke="#9aa7b5"/>
            <line x1="200" y1="50" x2="330" y2="50" stroke="#63e6be"/>
            <line x1="200" y1="150" x2="330" y2="100" stroke="#4dabf7"/>
            <line x1="200" y1="50" x2="330" y2="150" stroke="#9aa7b5"/>
            <line x1="200" y1="100" x2="330" y2="50" stroke="#9aa7b5"/>
            <line x1="330" y1="50" x2="460" y2="50" stroke="#63e6be"/>
            <line x1="330" y1="100" x2="460" y2="150" stroke="#4dabf7"/>
          </g>
          <g fill="#ffa94d">
            <circle cx="70" cy="50" r="4"/><circle cx="70" cy="100" r="4"/><circle cx="70" cy="150" r="4"/><circle cx="70" cy="200" r="4"/>
            <circle cx="200" cy="50" r="4"/><circle cx="200" cy="100" r="4"/><circle cx="200" cy="150" r="4"/><circle cx="200" cy="200" r="4"/>
            <circle cx="330" cy="50" r="4"/><circle cx="330" cy="100" r="4"/><circle cx="330" cy="150" r="4"/>
            <circle cx="460" cy="50" r="4"/><circle cx="460" cy="150" r="4"/>
          </g>
          <text x="120" y="230" fill="#63e6be" font-size="10">green = surviving ML path</text>
          <text x="330" y="230" fill="#4dabf7" font-size="10">blue = alternate survivor</text>
        </svg>`,
        caption: 'A 4-state trellis (K=3). Each state keeps one survivor via ACS; the green path is the maximum-likelihood sequence read out by traceback.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect x="0" y="0" width="540" height="200" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Add-Compare-Select unit</text>
          <rect x="30" y="50" width="90" height="30" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="75" y="70" fill="#e6edf3" font-size="10" text-anchor="middle">PM(s0)+BM0</text>
          <rect x="30" y="120" width="90" height="30" fill="none" stroke="#4dabf7" stroke-width="1.5"/><text x="75" y="140" fill="#e6edf3" font-size="10" text-anchor="middle">PM(s1)+BM1</text>
          <rect x="180" y="85" width="110" height="34" fill="none" stroke="#ffa94d" stroke-width="1.5"/><text x="235" y="106" fill="#e6edf3" font-size="11" text-anchor="middle">Compare (min)</text>
          <rect x="350" y="85" width="120" height="34" fill="none" stroke="#63e6be" stroke-width="1.5"/><text x="410" y="102" fill="#e6edf3" font-size="10" text-anchor="middle">Select survivor</text><text x="410" y="115" fill="#e6edf3" font-size="10" text-anchor="middle">+ store pointer</text>
          <line x1="120" y1="65" x2="180" y2="95" stroke="#9aa7b5" marker-end="url(#arr-vit)"/>
          <line x1="120" y1="135" x2="180" y2="108" stroke="#9aa7b5" marker-end="url(#arr-vit)"/>
          <line x1="290" y1="102" x2="350" y2="102" stroke="#9aa7b5" marker-end="url(#arr-vit)"/>
          <line x1="470" y1="102" x2="520" y2="102" stroke="#9aa7b5" marker-end="url(#arr-vit)"/>
          <text x="490" y="94" fill="#9aa7b5" font-size="9">PM(s')</text>
          <defs><marker id="arr-vit" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#9aa7b5"/></marker></defs>
        </svg>`,
        caption: 'Per state: add each incoming branch metric to its predecessor path metric, compare the two candidates, and select the smaller as the survivor.'
      }
    ],
    equations: [
      {
        title: 'Number of trellis states',
        tex: String.raw`$$ N_{states} = 2^{K-1} $$`,
        derivation: String.raw`<p>The encoder state is the contents of the $K-1$ memory bits (constraint length $K$ minus the current input). With binary memory, there are $2^{K-1}$ distinct states. $K=7\Rightarrow64$ states.</p>`
      },
      {
        title: 'Path-metric recursion (ACS)',
        tex: String.raw`$$ PM_t(s') = \min_{s\to s'}\big[\,PM_{t-1}(s) + BM_t(s\to s')\,\big] $$`,
        derivation: String.raw`<p>The path metric of a state at time $t$ is the smaller of the two candidate sums (predecessor path metric plus branch metric). The minimizing predecessor is stored as the survivor pointer; the other candidate is discarded. This is the add (sum), compare (min over two), select (store argmin) operation.</p>`
      },
      {
        title: 'Hard-decision branch metric',
        tex: String.raw`$$ BM = d_H(\mathbf{r},\mathbf{c}_{branch}) = \sum_i r_i \oplus c_i $$`,
        derivation: String.raw`<p>With hard bits, the branch metric is the Hamming distance between the received $n$-bit symbol and the branch's expected output — the count of differing bits, computed by XOR and popcount.</p>`
      },
      {
        title: 'Soft-decision branch metric',
        tex: String.raw`$$ BM = \sum_i \big(r_i - c_i\big)^2 \quad\text{or}\quad BM = -\sum_i r_i\,c_i $$`,
        derivation: String.raw`<p>Using analog demodulator outputs $r_i$, the ML metric is Euclidean distance to the branch symbol; for equal-energy symbols this reduces to a correlation term $-\sum r_i c_i$ (maximize correlation = minimize distance). Soft metrics preserve confidence, yielding ~2 dB gain.</p>`
      },
      {
        title: 'Traceback depth rule',
        tex: String.raw`$$ L_{tb} \approx 5K $$`,
        derivation: String.raw`<p>Survivor paths merge to a common history after a few constraint lengths. Empirically ~5K (range 4-6K) is enough for the merged decision to be effectively optimal; deeper only adds latency/memory. $K=7\Rightarrow L_{tb}\approx35$ bits.</p>`
      },
      {
        title: 'Decoding complexity',
        tex: String.raw`$$ \text{ops/bit} \approx 2\cdot 2^{K-1} = 2^{K},\qquad \text{total} = \mathcal{O}\!\big(N\,2^{K-1}\big) $$`,
        derivation: String.raw`<p>Each of $2^{K-1}$ states needs 2 adds and 1 compare per bit (rate-1/n), so ~$2^K$ ACS operations per bit. Over a length-$N$ sequence the cost is $N\,2^{K-1}$: linear in $N$, exponential in $K$. $K=7$: ~128 ACS ops per bit.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`How many trellis states for constraint length $K$?`, back: String.raw`$2^{K-1}$.` },
      { front: String.raw`What does ACS stand for and do?`, back: String.raw`Add-Compare-Select: add branch metrics to predecessor path metrics, compare candidates, select the smaller survivor per state.` },
      { front: String.raw`Hard vs soft branch metric?`, back: String.raw`Hard: Hamming distance. Soft: Euclidean distance / correlation using analog confidences (~2 dB better).` },
      { front: String.raw`Why keep only one survivor per state?`, back: String.raw`Any optimal path through a state must use that state's best prefix, so alternatives can be discarded — avoids $2^N$ paths.` },
      { front: String.raw`Traceback depth rule of thumb?`, back: String.raw`$L_{tb}\approx5K$ (4-6K).` },
      { front: String.raw`Is Viterbi optimal?`, back: String.raw`Yes — it is the maximum-likelihood sequence estimator (MLSE) for the observed sequence.` },
      { front: String.raw`Decoding complexity scaling?`, back: String.raw`$\mathcal{O}(N\,2^{K-1})$: linear in length $N$, exponential in constraint length $K$.` },
      { front: String.raw`ACS operations per decoded bit (rate-1/n)?`, back: String.raw`About $2\cdot2^{K-1}=2^K$ (two adds + one compare per state).` },
      { front: String.raw`What is the path metric?`, back: String.raw`The accumulated branch metric along a path; the ML path minimizes it.` },
      { front: String.raw`Standard industry convolutional code?`, back: String.raw`Rate-1/2, $K=7$, 64 states, generators $(133,171)_8$.` },
      { front: String.raw`What is BCJR and how does it differ from Viterbi?`, back: String.raw`BCJR is the bit-optimal MAP algorithm with soft outputs, used in Turbo decoders; Viterbi is sequence-optimal (MLSE).` },
      { front: String.raw`Why is $K$ rarely above ~9 for hardware Viterbi?`, back: String.raw`Complexity/memory grow as $2^{K-1}$; each +1 in $K$ doubles cost for diminishing gain.` }
    ],
    mcqs: [
      { q: String.raw`A $K=7$ convolutional code has how many trellis states?`, options: [String.raw`32`, String.raw`64`, String.raw`128`, String.raw`7`], answer: 1, explain: String.raw`$2^{K-1}=2^6=64$.` },
      { q: String.raw`The Viterbi algorithm finds:`, options: [String.raw`the shortest codeword`, String.raw`the maximum-likelihood sequence`, String.raw`the lowest code rate`, String.raw`the interleaver depth`], answer: 1, explain: String.raw`It is MLSE-optimal.` },
      { q: String.raw`In ACS, "select" means:`, options: [String.raw`pick the higher path metric`, String.raw`keep the smaller-metric survivor per state`, String.raw`choose the code rate`, String.raw`select the modulation`], answer: 1, explain: String.raw`Smaller distance = more likely.` },
      { q: String.raw`Soft-decision Viterbi over hard-decision gains about:`, options: [String.raw`0.5 dB`, String.raw`2 dB`, String.raw`5 dB`, String.raw`10 dB`], answer: 1, explain: String.raw`~2 dB from using analog confidences.` },
      { q: String.raw`Recommended traceback depth for $K=7$:`, options: [String.raw`~7 bits`, String.raw`~14 bits`, String.raw`~35 bits`, String.raw`~128 bits`], answer: 2, explain: String.raw`$5K=35$ bits.` },
      { q: String.raw`Hard-decision branch metric is the:`, options: [String.raw`Euclidean distance`, String.raw`Hamming distance`, String.raw`code rate`, String.raw`SNR`], answer: 1, explain: String.raw`Count of differing bits.` },
      { q: String.raw`Viterbi complexity scales as:`, options: [String.raw`$2^N$`, String.raw`$N\,2^{K-1}$`, String.raw`$N^2$`, String.raw`$\log N$`], answer: 1, explain: String.raw`Linear in $N$, exponential in $K$.` },
      { q: String.raw`Keeping one survivor per state is justified because:`, options: [String.raw`memory is cheap`, String.raw`an optimal path uses each state's best prefix`, String.raw`the channel is noiseless`, String.raw`the code is systematic`], answer: 1, explain: String.raw`Optimal substructure of the shortest path.` },
      { q: String.raw`Approx ACS operations per decoded bit for $K=7$ (rate-1/n):`, options: [String.raw`14`, String.raw`64`, String.raw`128`, String.raw`256`], answer: 2, explain: String.raw`$2\cdot2^{6}=128$.` },
      { q: String.raw`The soft-output bit-optimal cousin used in Turbo decoding is:`, options: [String.raw`BCJR/MAP`, String.raw`Reed-Solomon`, String.raw`Berlekamp-Massey`, String.raw`Barker`], answer: 0, explain: String.raw`BCJR gives per-bit MAP soft outputs.` },
      { q: String.raw`Going from $K=7$ to $K=9$ multiplies the state count by:`, options: [String.raw`2`, String.raw`4`, String.raw`8`, String.raw`16`], answer: 1, explain: String.raw`$2^{8}/2^{6}=4$.` },
      { q: String.raw`Each state in a rate-1/n trellis has how many incoming branches?`, options: [String.raw`1`, String.raw`2`, String.raw`4`, String.raw`$2^{K-1}$`], answer: 1, explain: String.raw`Two predecessors (input 0 or 1).` }
    ],
    numericals: [
      { q: String.raw`A convolutional code has constraint length $K=9$. How many trellis states and ACS operations per bit (rate-1/n)?`, solution: String.raw`<p><b>Formula.</b> $$ N_{states} = 2^{K-1}, \qquad \text{ops/bit} \approx 2\cdot 2^{K-1} = 2^K, $$ where $K$ is the constraint length; each state needs two adds and one compare per bit.</p>
        <p><b>Substitute.</b> $$ N_{states} = 2^{9-1} = 2^8, \qquad \text{ops/bit} \approx 2\times 256. $$</p>
        <p><b>Compute.</b> $N_{states} = 256$; ACS ops/bit $\approx 512$.</p>
        <p><b>Explanation.</b> Each of the 256 states runs one add-compare-select per decoded bit. Note this is exponential in $K$: raising $K$ from 7 to 9 quadruples the states, which is why hardware Viterbi rarely goes much beyond $K=9$.</p>` },
      { q: String.raw`Choose a traceback depth for a $K=5$ code.`, solution: String.raw`<p><b>Formula.</b> $$ L_{tb} \approx 5K \quad (\text{range } 4\text{–}6K), $$ where $L_{tb}$ is the traceback (decision) depth in bits and $K$ the constraint length.</p>
        <p><b>Substitute.</b> $$ L_{tb} \approx 5 \times 5. $$</p>
        <p><b>Compute.</b> $L_{tb} \approx 25$ bits (commonly rounded to ~24–32).</p>
        <p><b>Explanation.</b> Survivor paths merge to a common history after a few constraint lengths, so delaying the decision by about 25 bits makes it effectively optimal. Deeper traceback only adds latency and memory without meaningful BER improvement.</p>` },
      { q: String.raw`A $K=7$ Viterbi decoder runs at 10 Mbit/s output. Estimate ACS operations per second.`, solution: String.raw`<p><b>Formula.</b> $$ \text{ACS/s} = (\text{ops/bit}) \times R_b, \qquad \text{ops/bit} \approx 2\cdot 2^{K-1} = 2^K, $$ where $R_b$ is the decoded bit rate.</p>
        <p><b>Substitute.</b> $$ \text{ops/bit} = 2\cdot 2^6 = 128, \qquad \text{ACS/s} = 128 \times 10\times10^6. $$</p>
        <p><b>Compute.</b> $\text{ACS/s} = 1.28\times10^9$ (1.28 GACS/s).</p>
        <p><b>Explanation.</b> Even a modest 10 Mbit/s $K=7$ decoder demands over a billion add-compare-select operations per second, showing why these are pipelined in dedicated hardware. Throughput scales linearly with bit rate but jumps with $2^K$ if $K$ grows.</p>` },
      { q: String.raw`Compare the state count and memory (states x traceback) for $K=5$ vs $K=7$ (use $L_{tb}=5K$).`, solution: String.raw`<p><b>Formula.</b> $$ N_{states} = 2^{K-1}, \qquad \text{memory} \propto N_{states}\times L_{tb} = 2^{K-1}\times 5K. $$</p>
        <p><b>Substitute.</b> $$ K=5:\ 2^4 \times 25, \qquad K=7:\ 2^6 \times 35. $$</p>
        <p><b>Compute.</b> $K=5$: 16 states, memory $\propto 16\times 25 = 400$. $K=7$: 64 states, memory $\propto 64\times 35 = 2240$. Ratio $= 2240/400 = 5.6\times$.</p>
        <p><b>Explanation.</b> Going from $K=5$ to $K=7$ costs about 5.6 times the survivor memory (4x from states, 1.4x from deeper traceback) in exchange for a couple of dB more coding gain. This diminishing-returns trade is why $K=7$ is the industry sweet spot.</p>` },
      { q: String.raw`A soft-decision decoder quantizes to 3 bits. How many soft levels, and roughly what fraction of the ideal 2 dB soft gain is retained?`, solution: String.raw`<p><b>Formula.</b> $$ \text{levels} = 2^q, $$ where $q$ is the number of soft-decision quantization bits; soft decision gains about 2 dB over hard decision in the ideal (infinite-level) limit.</p>
        <p><b>Substitute.</b> $$ \text{levels} = 2^3. $$</p>
        <p><b>Compute.</b> $2^3 = 8$ levels; 8-level quantization falls only ~0.25 dB short of ideal, retaining most of the ~2 dB gain.</p>
        <p><b>Explanation.</b> Three bits of soft information capture nearly all the benefit of full analog confidences, which is why 8-level (3-bit) soft metrics are a standard, cost-effective choice. Hard decision (1 bit) would forfeit the full ~2 dB.</p>` },
      { q: String.raw`For a rate-1/2, $K=7$ code, how many output bits and branch labels exist per trellis stage, and how many total branches?`, solution: String.raw`<p><b>Formula.</b> $$ n_{out} = n\ (\text{for rate } k/n), \qquad N_{branches} = N_{states}\times 2 = 2^{K-1}\times 2, $$ where each state has two outgoing branches (input 0 or 1) in a rate-$1/n$ code.</p>
        <p><b>Substitute.</b> $$ n_{out} = 2, \qquad N_{states} = 2^{7-1} = 64, \qquad N_{branches} = 64\times 2. $$</p>
        <p><b>Compute.</b> Each branch emits $n = 2$ output bits; $N_{branches} = 128$ branches per stage.</p>
        <p><b>Explanation.</b> The 128 branches per stage carry the four possible 2-bit labels (00, 01, 10, 11), and the ACS engine evaluates all of them once per decoded bit. This branch count, not the sequence length, is what sets the decoder's per-step workload.</p>` }
    ],
    realWorld: String.raw`<p>Viterbi decoding is one of the most widely deployed algorithms in engineering: GSM voice, IS-95/CDMA, satellite and deep-space telemetry (often as the inner decoder in an RS-concatenated scheme), legacy 802.11a/g, and disk read channels (as MLSE equalizers) all rely on it. Its soft-decision form is standard, and its trellis/ACS structure generalizes to equalization (MLSE against ISI) and to the BCJR component of Turbo decoders. The rate-1/2, K=7 (133,171) code remains a de facto reference. Modern high-throughput links have largely shifted the heaviest lifting to LDPC/Turbo, but Viterbi endures wherever moderate gain, low latency, and simple hardware are the priority.</p>`,
    related: ['fec', 'bpsk', 'matched-filter', 'dsss']
  }
);
