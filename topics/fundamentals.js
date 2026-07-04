// Fundamentals category topics
CONTENT.topics.push(
{
  id: 'comm-basics',
  title: 'Communication Basics',
  category: 'Fundamentals',
  tags: [ 'communication', 'signals', 'bandwidth', 'snr', 'shannon', 'modulation' ],
  summary: String.raw`A digital communication system trades bandwidth, power, and complexity to move information reliably through a noisy channel, bounded ultimately by the Shannon capacity limit.`,
  prerequisites: [ 'maxwell' ],
  intro: String.raw`<p>Why does this topic exist? Because moving information across the real world is never free: the medium is noisy, the spectrum is finite, and power is limited. Without a common framework, every link — radio, fiber, cable — would be designed by trial and error with no way to know how close it comes to the best possible performance. This topic supplies that framework and the hard limit (Shannon capacity) that tells you when to stop optimizing.</p>
<p>Communication engineering is the discipline of transporting information from a source to a destination across an imperfect physical medium. Every link — a deep-space probe, a Wi-Fi router, a fiber backbone — can be reduced to the same canonical chain: a <em>source</em> produces information, a <em>transmitter</em> maps it onto a physical waveform, a <em>channel</em> distorts and corrupts that waveform, and a <em>receiver</em> attempts to recover the original message with minimum error.</p>
<p>The central tension of the field is that the channel is finite: it offers only so much bandwidth, tolerates only so much power, and injects unavoidable noise. The engineer's job is to spend bandwidth, power, and processing complexity wisely so that the delivered information rate and reliability meet the application's needs. This topic frames the vocabulary and the fundamental limits — signal-to-noise ratio, bandwidth, and the Shannon capacity — that every later topic refines.</p>`,
  sections: [
    {
      h: 'The canonical communication system model',
      html: String.raw`<p>Claude Shannon's 1948 model decomposes any communication system into functional blocks. Understanding each block, and where noise and distortion enter, is the foundation for everything that follows.</p>
<ul>
<li><strong>Source:</strong> Generates the message — analog (voice, video) or already digital (a file). An <em>source encoder</em> removes redundancy (compression) to minimize the bits that must be sent.</li>
<li><strong>Channel encoder:</strong> Deliberately <em>adds</em> structured redundancy (forward error correction) so the receiver can detect and correct errors introduced by the channel.</li>
<li><strong>Modulator:</strong> Maps bits onto a physical carrier waveform — varying its amplitude, phase, or frequency — so the signal occupies a band suited to the channel.</li>
<li><strong>Channel:</strong> The physical medium (free space, cable, fiber). It attenuates the signal, adds noise, and may introduce fading, multipath, and interference.</li>
<li><strong>Demodulator and channel decoder:</strong> Recover the transmitted symbols and undo the FEC, correcting residual errors.</li>
<li><strong>Source decoder / sink:</strong> Decompresses and delivers the message to the destination.</li>
</ul>
<div class="callout"><strong>Key insight:</strong> Shannon proved source coding and channel coding can be treated separately (the <em>separation theorem</em>) without loss of optimality for a point-to-point memoryless channel. This is why real systems have distinct compression and error-correction stages.</div>`
    },
    {
      h: 'Analog vs digital, baseband vs passband',
      html: String.raw`<p>A <strong>baseband</strong> signal occupies frequencies from near DC up to some maximum $W$. A <strong>passband</strong> signal has been shifted (by modulation onto a carrier $f_c$) to occupy a band centered at $f_c$. Passband transmission lets many users share the spectrum via frequency-division and permits antennas of practical size (antenna dimensions scale with wavelength).</p>
<p><strong>Digital</strong> communication sends one of a finite set of waveforms (symbols) per interval, rather than a continuously varying analog waveform. Digital dominates because it enables regeneration (a repeater can restore a clean symbol rather than amplify accumulated noise), error correction, encryption, and easy multiplexing.</p>
<table class="data">
<tr><th>Property</th><th>Analog</th><th>Digital</th></tr>
<tr><td>Noise handling</td><td>Degrades gracefully but irreversibly</td><td>Regenerable; error correction possible</td></tr>
<tr><td>Bandwidth efficiency</td><td>Can be high (e.g. SSB)</td><td>Depends on modulation order</td></tr>
<tr><td>Security</td><td>Hard to encrypt</td><td>Strong encryption straightforward</td></tr>
<tr><td>Repeaters</td><td>Amplify noise too</td><td>Regenerate clean symbols</td></tr>
</table>`
    },
    {
      h: 'Signal-to-noise ratio and Eb/N0',
      html: String.raw`<p>The single most important link-quality metric is the <strong>signal-to-noise ratio</strong> (SNR): the ratio of signal power $S$ to noise power $N$ within the bandwidth of interest, $\mathrm{SNR} = S/N$. In decibels, $\mathrm{SNR_{dB}} = 10\log_{10}(S/N)$.</p>
<p>For digital systems a more fundamental quantity is $E_b/N_0$ — energy per bit divided by noise power spectral density. Unlike SNR, it is independent of bandwidth and normalizes out the data rate, letting us compare modulation schemes fairly. They are related by</p>
$$ \frac{E_b}{N_0} = \frac{S}{N}\cdot\frac{B}{R_b} $$
<p>where $B$ is the noise bandwidth and $R_b$ the bit rate. Bit error rate (BER) curves are almost always plotted against $E_b/N_0$ because that is what determines error performance regardless of how the bits are packed into bandwidth.</p>
<div class="callout"><strong>Pitfall:</strong> Reporting SNR without stating the reference bandwidth is meaningless — noise power scales with bandwidth. Always tie SNR to a defined bandwidth, or use the bandwidth-independent $E_b/N_0$.</div>`
    },
    {
      h: 'Bandwidth, symbol rate and spectral efficiency',
      html: String.raw`<p><strong>Bandwidth</strong> $B$ is the span of frequencies a signal occupies. The <strong>symbol rate</strong> $R_s$ (baud) is how many symbols per second are transmitted. The Nyquist criterion sets the minimum bandwidth for intersymbol-interference-free signaling: $B_{min} = R_s/2$ (baseband) or $B_{min}=R_s$ (passband, double-sideband). Real systems add excess bandwidth via a roll-off factor $\alpha$ (raised-cosine), giving $B = R_s(1+\alpha)$.</p>
<p>Each symbol carries $\log_2 M$ bits when drawn from an alphabet of $M$ symbols, so the bit rate is $R_b = R_s\log_2 M$. <strong>Spectral efficiency</strong> $\eta = R_b/B$ (bits/s/Hz) measures how efficiently bandwidth is used. Higher-order modulation (e.g. 256-QAM) raises $\eta$ but demands higher SNR to keep the constellation points distinguishable.</p>`
    },
    {
      h: 'The Shannon capacity limit',
      html: String.raw`<div class="callout tip"><strong>Intuition first:</strong> Think of the channel as a noisy ruler. Bandwidth sets how many independent measurements per second you can take (Nyquist); SNR sets how many distinct marks you can reliably read on each measurement. Multiply "measurements per second" by "bits per measurement" and you get a rate ceiling — that is exactly what the capacity formula below counts.</div>
<p>Now that we have SNR and bandwidth as the two resources, the crowning result of information theory is the <strong>Shannon–Hartley capacity</strong> for an additive white Gaussian noise (AWGN) channel:</p>
$$ C = B\log_2\!\left(1+\frac{S}{N}\right) \quad \text{bits/s} $$
<p>$C$ is the maximum error-free information rate. Shannon proved that <em>for any rate $R < C$</em>, codes exist that drive the error probability arbitrarily close to zero; for $R > C$, reliable communication is impossible. This is an existence theorem — it promises the limit exists but not how to reach it. Modern LDPC and turbo codes operate within a fraction of a dB of it.</p>
<p>Two regimes matter. <strong>Bandwidth-limited:</strong> with plenty of power, doubling bandwidth roughly doubles capacity. <strong>Power-limited:</strong> at low SNR, capacity grows only logarithmically with power, and the fundamental limit emerges: $E_b/N_0 \ge \ln 2 \approx -1.59$ dB, the Shannon limit below which no reliable communication is possible at any rate.</p>
<div class="callout"><strong>Intuition:</strong> Capacity counts distinguishable signal levels. More bandwidth gives more independent samples per second (Nyquist); more SNR gives more distinguishable amplitude levels per sample. The log reflects diminishing returns from piling on power.</div>`
    },
    {
      h: 'Distortion, fading and the real channel',
      html: String.raw`<p>Beyond additive noise, real channels impose <strong>linear distortion</strong> (frequency-selective attenuation and phase, causing intersymbol interference), <strong>multipath</strong> (delayed echoes that fade in and out as they combine), <strong>Doppler shift</strong> (frequency offset from relative motion), and <strong>nonlinearity</strong> (amplifier compression creating spectral regrowth).</p>
<p>These are combated with equalization (undoing linear distortion), diversity and MIMO (exploiting multiple independent paths), and error-correcting codes (recovering from fades). The AWGN model is the idealized baseline; deviations from it define the difficulty of a given link.</p>`
    },
    {
      h: 'Duplexing and multiple access',
      html: String.raw`<p>Sharing a channel among two-way traffic and many users requires organizing the resource. <strong>Duplexing</strong> separates uplink and downlink: FDD uses different frequencies, TDD different time slots. <strong>Multiple access</strong> shares the medium among users: FDMA (frequency slots), TDMA (time slots), CDMA (orthogonal spreading codes), and OFDMA (subcarrier groups). Each partitions the fundamental resources — time, frequency, code, or space — that the capacity theorem quantifies.</p>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<ul>
<li><strong>The chain and where noise enters.</strong> Every link is source → encode → modulate → channel (noise here) → demodulate → decode → sink; source and channel coding can be designed separately.</li>
<li><strong>The two quality metrics.</strong> SNR is bandwidth-dependent; $E_b/N_0 = (S/N)(B/R_b)$ is the bandwidth-independent metric you actually compare modulations against.</li>
<li><strong>How bits map to bandwidth.</strong> $R_b = R_s\log_2 M$ packs more bits per symbol with higher-order modulation, while Nyquist plus roll-off $(1+\alpha)$ sets the bandwidth those symbols occupy.</li>
<li><strong>The hard ceiling.</strong> $C = B\log_2(1+S/N)$ bounds error-free rate; more bandwidth helps linearly, more power only logarithmically, and $E_b/N_0$ can never fall below $-1.59$ dB.</li>
<li><strong>Why it all connects.</strong> Bandwidth, power, and complexity are the three currencies you spend, and the capacity limit is the exchange rate — knowing it tells you which lever to pull for a given link.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`The Shannon model separates any link into source coding (remove redundancy) and channel coding (add structured redundancy).`,
    String.raw`SNR must always be referenced to a bandwidth; $E_b/N_0$ is the bandwidth-independent, rate-normalized quality metric for digital links.`,
    String.raw`$E_b/N_0 = (S/N)(B/R_b)$ links the two metrics.`,
    String.raw`Bit rate $R_b = R_s \log_2 M$: higher-order modulation packs more bits per symbol but needs more SNR.`,
    String.raw`Nyquist minimum bandwidth for ISI-free signaling is $R_s/2$ baseband; raised-cosine adds a factor $(1+\alpha)$.`,
    String.raw`Shannon capacity $C = B\log_2(1+S/N)$ is the hard limit on error-free rate over AWGN.`,
    String.raw`The absolute Shannon limit is $E_b/N_0 \ge \ln 2 = -1.59$ dB.`,
    String.raw`Bandwidth-limited regime: capacity scales ~linearly with bandwidth; power-limited: only logarithmically with power.`,
    String.raw`Digital signaling enables regeneration, error correction, and encryption — its decisive advantages over analog.`,
    String.raw`Real channels add multipath, fading, Doppler and nonlinearity on top of AWGN; equalization, diversity and coding combat them.`,
    String.raw`Spectral efficiency $\eta = R_b/B$ (bits/s/Hz) is the currency of bandwidth usage.`,
    String.raw`Passband modulation enables practical antenna sizes and frequency-division sharing of spectrum.`
  ],
  diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr-comm-basics" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<g text-anchor="middle" font-size="10" fill="#e6edf3">
<rect x="6" y="55" width="70" height="40" rx="4" fill="#1c232e" stroke="#4dabf7"/><text x="41" y="72">Source +</text><text x="41" y="85">encoder</text>
<rect x="96" y="55" width="70" height="40" rx="4" fill="#1c232e" stroke="#63e6be"/><text x="131" y="72">Channel</text><text x="131" y="85">encoder</text>
<rect x="186" y="55" width="70" height="40" rx="4" fill="#1c232e" stroke="#ffa94d"/><text x="221" y="78">Modulator</text>
<rect x="276" y="55" width="70" height="40" rx="4" fill="#1c232e" stroke="#ff6b6b"/><text x="311" y="72">Channel</text><text x="311" y="85">(noise)</text>
<rect x="366" y="55" width="80" height="40" rx="4" fill="#1c232e" stroke="#ffa94d"/><text x="406" y="72">Demod +</text><text x="406" y="85">decoder</text>
<rect x="466" y="55" width="68" height="40" rx="4" fill="#1c232e" stroke="#4dabf7"/><text x="500" y="78">Sink</text>
<line x1="76" y1="75" x2="94" y2="75" stroke="#9aa7b5" marker-end="url(#arr-comm-basics)"/>
<line x1="166" y1="75" x2="184" y2="75" stroke="#9aa7b5" marker-end="url(#arr-comm-basics)"/>
<line x1="256" y1="75" x2="274" y2="75" stroke="#9aa7b5" marker-end="url(#arr-comm-basics)"/>
<line x1="346" y1="75" x2="364" y2="75" stroke="#9aa7b5" marker-end="url(#arr-comm-basics)"/>
<line x1="446" y1="75" x2="464" y2="75" stroke="#9aa7b5" marker-end="url(#arr-comm-basics)"/>
<text x="311" y="40" fill="#ff6b6b" font-size="18">&#8615;</text>
<text x="270" y="30" fill="#9aa7b5" font-size="9">noise n(t)</text>
</g></svg>`,
      caption: 'The canonical Shannon communication chain; noise enters at the channel.'
    },
    {
      svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<line x1="50" y1="190" x2="520" y2="190" stroke="#9aa7b5"/>
<line x1="50" y1="190" x2="50" y2="20" stroke="#9aa7b5"/>
<text x="285" y="212" text-anchor="middle" fill="#9aa7b5">SNR (dB)</text>
<text x="18" y="105" transform="rotate(-90 18 105)" text-anchor="middle" fill="#9aa7b5">Capacity C/B (bits/s/Hz)</text>
<path d="M50,183 C120,150 200,110 300,80 C400,58 470,45 520,38" fill="none" stroke="#4dabf7" stroke-width="2"/>
<text x="360" y="70" fill="#4dabf7">C = B log2(1+S/N)</text>
<line x1="50" y1="190" x2="520" y2="45" stroke="#63e6be" stroke-dasharray="4 3"/>
<text x="410" y="120" fill="#63e6be">high-SNR: ~linear in dB</text>
</g></svg>`,
      caption: 'Shannon capacity per unit bandwidth versus SNR — diminishing returns from added power.'
    }
  ],
  equations: [
    {
      title: 'Shannon–Hartley capacity',
      tex: String.raw`$$ C = B\log_2\!\left(1+\frac{S}{N}\right) $$`,
      derivation: String.raw`<p>Over an interval $T$ with bandwidth $B$, the Nyquist rate gives $2BT$ independent samples. Each noisy sample can be reliably distinguished into $\sqrt{1+S/N}$ amplitude levels (signal spreads over $\sqrt{S+N}$, noise blurs over $\sqrt N$). The number of distinguishable sequences is $(1+S/N)^{BT}$, so the information is $\log_2$ of that: $BT\log_2(1+S/N)$ bits in time $T$. Dividing by $T$ gives $C = B\log_2(1+S/N)$.</p>`
    },
    {
      title: 'Eb/N0 to SNR relation',
      tex: String.raw`$$ \frac{E_b}{N_0} = \frac{S}{N}\cdot\frac{B}{R_b} $$`,
      derivation: String.raw`<p>Signal power $S = E_b R_b$ (energy per bit times bits per second). Noise power in bandwidth $B$ is $N = N_0 B$. Hence $S/N = E_b R_b/(N_0 B)$, which rearranges to $E_b/N_0 = (S/N)(B/R_b)$.</p>`
    },
    {
      title: 'Absolute Shannon limit',
      tex: String.raw`$$ \frac{E_b}{N_0}\bigg|_{min} = \ln 2 \approx -1.59\ \text{dB} $$`,
      derivation: String.raw`<p>Write capacity with $S = E_b C$ (operating at $R_b=C$) and $N=N_0 B$: $C = B\log_2(1+ E_b C/(N_0 B))$. Let spectral efficiency $\eta = C/B$. Then $\eta = \log_2(1+\eta E_b/N_0)$, so $E_b/N_0 = (2^\eta - 1)/\eta$. Taking $\eta \to 0$ (infinite bandwidth) gives the limit $\lim_{\eta\to 0}(2^\eta-1)/\eta = \ln 2 = 0.693 = -1.59$ dB.</p>`
    },
    {
      title: 'Bit rate from symbol rate',
      tex: String.raw`$$ R_b = R_s\log_2 M $$`,
      derivation: String.raw`<p>An alphabet of $M$ equally likely symbols carries $\log_2 M$ bits of information per symbol. Transmitting $R_s$ symbols per second yields $R_b = R_s\log_2 M$ bits per second.</p>`
    },
    {
      title: 'Nyquist bandwidth with roll-off',
      tex: String.raw`$$ B = \frac{R_s}{2}(1+\alpha) $$`,
      derivation: String.raw`<p>The Nyquist ISI criterion allows ISI-free signaling at symbol rate $R_s$ using minimum baseband bandwidth $R_s/2$ (the brick-wall filter). Practical pulses use a raised-cosine spectrum with excess bandwidth fraction $\alpha\in[0,1]$, widening the band to $\tfrac{R_s}{2}(1+\alpha)$.</p>`
    },
    {
      title: 'Spectral efficiency',
      tex: String.raw`$$ \eta = \frac{R_b}{B} \quad \text{(bits/s/Hz)} $$`,
      derivation: String.raw`<p>By definition, spectral efficiency is delivered bit rate divided by occupied bandwidth. Combining with the capacity theorem, the maximum achievable is $\eta_{max}=\log_2(1+S/N)$.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What does the Shannon capacity formula state?`, back: String.raw`$C = B\log_2(1+S/N)$ — the maximum error-free bit rate over an AWGN channel of bandwidth $B$ and signal-to-noise ratio $S/N$.` },
    { front: String.raw`Why is $E_b/N_0$ preferred over SNR for digital links?`, back: String.raw`It is independent of bandwidth and data rate, so BER performance of different modulations can be compared fairly.` },
    { front: String.raw`What is the absolute Shannon limit on $E_b/N_0$?`, back: String.raw`$\ln 2 \approx -1.59$ dB; below this, no reliable communication is possible at any rate.` },
    { front: String.raw`Relate bit rate, symbol rate and modulation order.`, back: String.raw`$R_b = R_s\log_2 M$, where $M$ is the number of symbols in the alphabet.` },
    { front: String.raw`State the Separation Theorem.`, back: String.raw`For a point-to-point memoryless channel, source coding and channel coding can be designed independently without loss of optimality.` },
    { front: String.raw`Nyquist minimum baseband bandwidth for ISI-free signaling?`, back: String.raw`$R_s/2$; with raised-cosine roll-off $\alpha$ it becomes $\tfrac{R_s}{2}(1+\alpha)$.` },
    { front: String.raw`Bandwidth-limited vs power-limited regime?`, back: String.raw`Bandwidth-limited: capacity ~linear in bandwidth (high SNR). Power-limited: capacity grows only logarithmically with power (low SNR).` },
    { front: String.raw`Why does digital beat analog for repeaters?`, back: String.raw`Digital repeaters regenerate clean symbols; analog amplifiers boost accumulated noise along with the signal.` },
    { front: String.raw`Define spectral efficiency.`, back: String.raw`$\eta = R_b/B$ in bits/s/Hz; the theoretical maximum is $\log_2(1+S/N)$.` },
    { front: String.raw`What is the role of the channel encoder?`, back: String.raw`It adds structured redundancy (FEC) so the receiver can detect and correct channel-induced errors.` },
    { front: String.raw`Why use passband instead of baseband transmission?`, back: String.raw`To enable practical antenna sizes and frequency-division sharing of the spectrum among users.` },
    { front: String.raw`What is multipath fading?`, back: String.raw`Delayed reflected copies of the signal combine constructively/destructively, causing amplitude to fade in and out over time or frequency.` },
    { front: String.raw`What quantity does BER curve up against?`, back: String.raw`$E_b/N_0$, because it isolates error performance from bandwidth and rate choices.` },
    { front: String.raw`Is Shannon's capacity theorem constructive?`, back: String.raw`No — it proves capacity-achieving codes exist but does not construct them; LDPC/turbo codes approach it in practice.` }
  ],
  mcqs: [
    { q: String.raw`A channel has $B=1$ MHz and $S/N=15$ (linear). What is its Shannon capacity?`, options: [ String.raw`about 1 Mbit/s`, String.raw`about 4 Mbit/s`, String.raw`about 15 Mbit/s`, String.raw`about 30 Mbit/s` ], answer: 1, explain: String.raw`$C = 10^6\log_2(1+15) = 10^6\log_2 16 = 4\times10^6$ bits/s.` },
    { q: String.raw`Which metric is independent of bandwidth?`, options: [ String.raw`SNR`, String.raw`Noise power`, String.raw`$E_b/N_0$`, String.raw`Signal power` ], answer: 2, explain: String.raw`$E_b/N_0$ normalizes energy per bit against noise PSD, removing bandwidth dependence.` },
    { q: String.raw`For 16-QAM, how many bits does each symbol carry?`, options: [ String.raw`2`, String.raw`3`, String.raw`4`, String.raw`16` ], answer: 2, explain: String.raw`$\log_2 16 = 4$ bits per symbol.` },
    { q: String.raw`The absolute Shannon limit on $E_b/N_0$ is:`, options: [ String.raw`0 dB`, String.raw`-1.59 dB`, String.raw`+3 dB`, String.raw`-10 dB` ], answer: 1, explain: String.raw`$\ln 2 = 0.693 \Rightarrow -1.59$ dB, the infinite-bandwidth limit.` },
    { q: String.raw`Doubling bandwidth in a high-SNR link approximately:`, options: [ String.raw`doubles capacity`, String.raw`halves capacity`, String.raw`leaves capacity unchanged`, String.raw`squares capacity` ], answer: 0, explain: String.raw`In the bandwidth-limited regime capacity scales roughly linearly with $B$ (SNR per Hz stays high).` },
    { q: String.raw`Raised-cosine pulse shaping with $\alpha=0.25$ and $R_s=10$ Mbaud occupies what passband bandwidth (DSB)?`, options: [ String.raw`5 MHz`, String.raw`10 MHz`, String.raw`12.5 MHz`, String.raw`20 MHz` ], answer: 2, explain: String.raw`Passband DSB bandwidth $=R_s(1+\alpha)=10(1.25)=12.5$ MHz.` },
    { q: String.raw`The separation theorem allows independent design of:`, options: [ String.raw`modulator and antenna`, String.raw`source coding and channel coding`, String.raw`transmitter and receiver clocks`, String.raw`amplifier and mixer` ], answer: 1, explain: String.raw`Shannon showed compression and error correction can be optimized separately for a memoryless point-to-point channel.` },
    { q: String.raw`Which is NOT a benefit of digital over analog transmission?`, options: [ String.raw`Error correction`, String.raw`Signal regeneration`, String.raw`Guaranteed lower bandwidth`, String.raw`Strong encryption` ], answer: 2, explain: String.raw`Digital does not inherently use less bandwidth; high-order modulation can, but that is a design choice, not intrinsic.` },
    { q: String.raw`If $S/N$ increases from 7 to 15 (linear), capacity per Hz rises from:`, options: [ String.raw`2 to 3 bits/s/Hz`, String.raw`3 to 4 bits/s/Hz`, String.raw`3 to 5 bits/s/Hz`, String.raw`4 to 5 bits/s/Hz` ], answer: 1, explain: String.raw`$\log_2 8 = 3$, $\log_2 16 = 4$.` },
    { q: String.raw`Intersymbol interference is primarily caused by:`, options: [ String.raw`thermal noise`, String.raw`band-limiting / channel dispersion`, String.raw`carrier phase noise`, String.raw`quantization` ], answer: 1, explain: String.raw`Limiting bandwidth or dispersive channels spread pulses so they overlap neighboring symbols.` },
    { q: String.raw`Which regime does deep-space communication typically operate in?`, options: [ String.raw`Bandwidth-limited`, String.raw`Power-limited`, String.raw`Interference-limited`, String.raw`Distortion-limited` ], answer: 1, explain: String.raw`Deep-space links have huge path loss and scarce power, so they are power-limited and use low-rate powerful codes.` },
    { q: String.raw`Spectral efficiency has units of:`, options: [ String.raw`bits/s`, String.raw`Hz`, String.raw`bits/s/Hz`, String.raw`dB` ], answer: 2, explain: String.raw`$\eta = R_b/B$ is bits per second per hertz.` }
  ],
  numericals: [
    { q: String.raw`A link uses QPSK at 5 Mbaud with raised-cosine roll-off $\alpha=0.2$. Find the bit rate, occupied passband bandwidth, and spectral efficiency.`, solution: String.raw`<p><b>Formula.</b> $$ R_b = R_s\log_2 M, \qquad B = R_s(1+\alpha), \qquad \eta = \frac{R_b}{B} $$ where $R_s$ is the symbol (baud) rate, $M$ the constellation size, $\alpha$ the roll-off factor, $B$ the occupied passband (double-sideband) bandwidth, and $\eta$ the spectral efficiency.</p>
<p><b>Substitute.</b> QPSK has $M=4$, so $\log_2 4 = 2$. $$ R_b = (5\times10^6)(2), \qquad B = (5\times10^6)(1+0.2), \qquad \eta = \frac{10\times10^6}{6\times10^6} $$</p>
<p><b>Compute.</b> $R_b = 10$ Mbit/s; $B = 5\times10^6 \times 1.2 = 6$ MHz; $\eta = 10/6 \approx 1.67$ bits/s/Hz.</p>
<p><b>Explanation.</b> Each QPSK symbol carries 2 bits, doubling the bit rate above the baud rate; the 20% excess bandwidth is the price of a realizable pulse shape. An $\eta$ of 1.67 bits/s/Hz is modest and robust — exactly what you expect from a low-order modulation chosen for reliability over raw throughput.</p>` },
    { q: String.raw`Compute the Shannon capacity of a 20 MHz Wi-Fi channel at an SNR of 25 dB.`, solution: String.raw`<p><b>Formula.</b> $$ C = B\log_2\!\left(1+\frac{S}{N}\right) $$ where $C$ is the channel capacity (bits/s), $B$ the bandwidth (Hz), and $S/N$ the linear signal-to-noise ratio. The SNR must first be converted from dB via $S/N = 10^{\mathrm{SNR_{dB}}/10}$.</p>
<p><b>Substitute.</b> $25$ dB $= 10^{2.5} \approx 316$ (linear). $$ C = 20\times10^6 \cdot \log_2(1+316) = 20\times10^6 \cdot \log_2(317) $$</p>
<p><b>Compute.</b> $\log_2(317) = \ln 317/\ln 2 = 5.759/0.693 \approx 8.31$, so $C \approx 20\times10^6 \times 8.31 \approx 166$ Mbit/s.</p>
<p><b>Explanation.</b> This is the theoretical ceiling — no code can beat it on this channel. Real Wi-Fi throughput on a 20 MHz channel tops out well below this (around 100 Mbit/s at best) because of framing overhead, guard intervals, and practical modulation-and-coding limits, but the capacity tells you how much headroom the physics still allows.</p>` },
    { q: String.raw`A system requires $E_b/N_0 = 10$ dB, transmits at $R_b = 2$ Mbit/s in a noise bandwidth of 3 MHz. What SNR (dB) is needed?`, solution: String.raw`<p><b>Formula.</b> Starting from $\dfrac{E_b}{N_0} = \dfrac{S}{N}\cdot\dfrac{B}{R_b}$, rearrange for the SNR: $$ \frac{S}{N} = \frac{E_b}{N_0}\cdot\frac{R_b}{B} $$ where $E_b/N_0$ is the energy-per-bit to noise-density ratio, $R_b$ the bit rate, and $B$ the noise bandwidth.</p>
<p><b>Substitute.</b> $E_b/N_0 = 10$ dB $= 10$ (linear); $R_b/B = 2/3 = 0.667$. $$ \frac{S}{N} = 10 \times 0.667 $$</p>
<p><b>Compute.</b> $S/N = 6.67$ (linear) $= 10\log_{10}(6.67) = 8.24$ dB.</p>
<p><b>Explanation.</b> The required SNR is lower than $E_b/N_0$ because the signal is spread over a bandwidth (3 MHz) wider than its bit rate (2 Mbit/s), so noise power is collected over more hertz than each bit "needs." When $B > R_b$ the SNR requirement drops; this is the same bandwidth-spreading effect that lets spread-spectrum systems tolerate very low SNR.</p>` },
    { q: String.raw`How much bandwidth is needed to achieve 100 Mbit/s error-free at an SNR of 10 dB?`, solution: String.raw`<p><b>Formula.</b> Invert the Shannon capacity, using the maximum spectral efficiency $\eta_{max} = \log_2(1+S/N)$: $$ B = \frac{C}{\eta_{max}} = \frac{C}{\log_2(1+S/N)} $$ where $C$ is the target error-free rate and $S/N$ the linear SNR.</p>
<p><b>Substitute.</b> SNR $=10$ dB $=10$ (linear), so $\eta_{max} = \log_2(1+10) = \log_2 11$. $$ B = \frac{100\times10^6}{\log_2 11} $$</p>
<p><b>Compute.</b> $\log_2 11 = 3.46$ bits/s/Hz, so $B = 100\times10^6/3.46 \approx 28.9$ MHz (minimum).</p>
<p><b>Explanation.</b> This is the least bandwidth that could carry 100 Mbit/s at this SNR; a real system needs more because it cannot reach the Shannon bound. The result shows the trade you can always make — if bandwidth is scarce, raise the SNR (more power or gain) to shrink the required band, and vice versa.</p>` },
    { q: String.raw`At the absolute Shannon limit, what SNR corresponds to a spectral efficiency approaching zero over 1 GHz of bandwidth carrying 10 Mbit/s?`, solution: String.raw`<p><b>Formula.</b> $$ \eta = \frac{R_b}{B}, \qquad \frac{E_b}{N_0} = \frac{2^\eta - 1}{\eta} $$ where $\eta$ is the spectral efficiency and $E_b/N_0$ the minimum energy-per-bit ratio needed to support it (from $\eta = \log_2(1+\eta\,E_b/N_0)$).</p>
<p><b>Substitute.</b> $$ \eta = \frac{10\times10^6}{1\times10^9} = 0.01, \qquad \frac{E_b}{N_0} = \frac{2^{0.01}-1}{0.01} $$</p>
<p><b>Compute.</b> $2^{0.01} = 1.00696$, so $E_b/N_0 = 0.00696/0.01 = 0.696 = 10\log_{10}(0.696) = -1.57$ dB — essentially the $\ln 2 = -1.59$ dB limit.</p>
<p><b>Explanation.</b> Spreading a low rate over enormous bandwidth drives $\eta\to 0$, which is exactly the regime where the required $E_b/N_0$ bottoms out at $\ln 2$. This is why bandwidth-rich, power-starved links (deep space) operate near the absolute Shannon floor: they buy the last dB of power efficiency by spending bandwidth.</p>` }
  ],
  realWorld: String.raw`<p>Deep-space missions live at the Shannon limit: the Mars rovers and Voyager probes use powerful concatenated and turbo codes to communicate at just a fraction of a dB above the theoretical $E_b/N_0$ floor, trading enormous bandwidth and time for reliability under crushing path loss. Every fraction of a dB of coding gain translates directly into more science data returned or a smaller, cheaper dish.</p>
<p>Terrestrially, the same theory governs why your phone drops from 256-QAM to QPSK as you walk away from a cell tower: the modulation order is dynamically reduced to keep the constellation points separable as SNR falls, trading throughput for reliability — an explicit walk along the capacity curve. Wi-Fi 6 and 5G NR both implement dozens of such modulation-and-coding-scheme (MCS) steps to track the instantaneous channel.</p>`,
  related: [ 'noise', 'noise-floor', 'link-budget', 'bpsk', 'fec' ]
},
{
  id: 'noise',
  title: 'Noise',
  category: 'Fundamentals',
  tags: [ 'thermal-noise', 'shot-noise', 'awgn', 'ktb', 'gaussian', 'random-process' ],
  summary: String.raw`Noise is the unavoidable random fluctuation — dominated by thermal (Johnson–Nyquist) noise of power $kTB$ — that sets the ultimate floor on how weak a signal a receiver can detect.`,
  prerequisites: [ 'comm-basics' ],
  intro: String.raw`<p>Noise is the fundamental adversary of every communication and instrumentation system. Unlike interference (which comes from other transmitters and can in principle be avoided) or distortion (a deterministic corruption that can be equalized), noise is an intrinsic, random, and largely irreducible fluctuation arising from the discrete and thermal nature of matter itself. It sets the absolute floor beneath which a signal cannot be recovered no matter how clever the receiver.</p>
<p>The dominant contributor in most RF systems is <strong>thermal noise</strong>, generated by the random thermal motion of charge carriers in any resistive element. Its power in a bandwidth $B$ is the celebrated $kTB$. Understanding its statistics (Gaussian), its spectrum (white), and its power ($kTB$) is the bedrock for noise figure, noise floor, sensitivity, and link-budget analysis.</p>`,
  sections: [
    {
      h: 'Sources of electronic noise',
      html: String.raw`<p>Several physical mechanisms generate noise; each has a distinct origin and spectral signature.</p>
<ul>
<li><strong>Thermal (Johnson–Nyquist) noise:</strong> Random thermal agitation of electrons in any resistor. White (flat spectrum) up to terahertz frequencies, Gaussian-distributed, and unavoidable at any temperature above absolute zero. Available power is $kTB$, independent of the resistance value.</li>
<li><strong>Shot noise:</strong> Arises from the discreteness of charge crossing a potential barrier (a PN junction, a photodiode). Current fluctuation has variance $\overline{i_n^2} = 2qI_{DC}B$. Also white and Poisson-derived, becoming Gaussian for large counts.</li>
<li><strong>Flicker (1/f) noise:</strong> Low-frequency noise with a power spectral density that rises as $1/f$. Dominant below a corner frequency (kHz–MHz depending on device); critical for oscillator phase noise and DC-coupled amplifiers.</li>
<li><strong>Generation–recombination and burst (popcorn) noise:</strong> Trap-related fluctuations in semiconductors.</li>
</ul>
<div class="callout"><strong>Why thermal noise dominates RF:</strong> At typical RF frequencies (well above the 1/f corner) and in passive/matched systems, thermal noise is the ever-present white background. Shot noise matters where DC current flows across junctions; flicker noise matters near DC and in oscillators.</div>`
    },
    {
      h: 'Thermal noise and the kTB result',
      html: String.raw`<div class="callout tip"><strong>Intuition first:</strong> Heat is jiggling motion. In a resistor, that jiggle randomly pushes electrons back and forth, and a randomly moving charge is a tiny random current — noise. The hotter the resistor and the wider the band you listen over, the more of this random power you collect. That single sentence is the whole story; the algebra below just makes it exact and, surprisingly, shows the resistance value drops out entirely.</div>
<p>A resistor $R$ at temperature $T$ (kelvin) produces an open-circuit noise voltage with mean-square value (Nyquist's theorem):</p>
$$ \overline{v_n^2} = 4kTRB $$
<p>where $k = 1.38\times10^{-23}$ J/K is Boltzmann's constant and $B$ is the bandwidth. When this noisy resistor is connected to a matched load $R$, the voltage across the load is $v_n/2$, so the delivered power is $\overline{v_n^2}/(4R)$:</p>
$$ N = \frac{\overline{v_n^2}}{4R} = \frac{4kTRB}{4R}\ \Rightarrow\ N = kTB $$
<p>The available noise power — the maximum power a noise source can deliver to a matched load — is simply</p>
$$ N = kTB $$
<p>Strikingly, it is independent of $R$: doubling the resistance doubles the noise voltage's mean-square but halves the current delivered to the matched load. At room temperature ($T_0 = 290$ K), the noise power spectral density is $kT_0 = 4\times10^{-21}$ W/Hz, which in dBm is the famous <strong>$-174$ dBm/Hz</strong>.</p>`
    },
    {
      h: 'The -174 dBm/Hz reference',
      html: String.raw`<p>This number is worth committing to memory because it anchors every noise-floor and sensitivity calculation.</p>
$$ N_0 = kT_0 = (1.38\times10^{-23})(290) = 4.00\times10^{-21}\ \text{W/Hz} $$
<p>Converting to dBm: $10\log_{10}(4.00\times10^{-21}/10^{-3}) = 10\log_{10}(4.00\times10^{-18}) = -173.98 \approx -174$ dBm/Hz.</p>
<p>To find the thermal noise floor in any bandwidth, add $10\log_{10}(B)$:</p>
$$ N_{dBm} = -174 + 10\log_{10}(B_{Hz}) $$
<table class="data">
<tr><th>Bandwidth</th><th>$10\log_{10} B$</th><th>Thermal noise floor</th></tr>
<tr><td>1 Hz</td><td>0 dB</td><td>-174 dBm</td></tr>
<tr><td>1 kHz</td><td>30 dB</td><td>-144 dBm</td></tr>
<tr><td>1 MHz</td><td>60 dB</td><td>-114 dBm</td></tr>
<tr><td>20 MHz</td><td>73 dB</td><td>-101 dBm</td></tr>
<tr><td>1 GHz</td><td>90 dB</td><td>-84 dBm</td></tr>
</table>`
    },
    {
      h: 'Statistics: why noise is Gaussian and white',
      html: String.raw`<p><strong>Gaussian:</strong> Thermal noise is the sum of contributions from an enormous number of independent electrons. By the Central Limit Theorem, such a sum tends to a Gaussian (normal) distribution regardless of the individual statistics. Hence thermal noise amplitude follows $n \sim \mathcal{N}(0,\sigma^2)$ with $\sigma^2$ equal to the noise power.</p>
<p><strong>White:</strong> The autocorrelation of thermal noise is essentially a delta function on communication timescales — successive samples (spaced beyond the correlation time, ~picoseconds) are uncorrelated. By the Wiener–Khinchin theorem, a delta autocorrelation gives a flat (white) power spectral density $S_n(f) = N_0/2$ (two-sided) or $N_0$ (one-sided). "White" is an idealization valid up to frequencies where quantum effects ($hf \sim kT$, i.e. terahertz at room temperature) roll it off.</p>
<div class="callout"><strong>AWGN model:</strong> The combination — <em>Additive</em> (adds to the signal), <em>White</em> (flat spectrum), <em>Gaussian</em> (normal amplitude) <em>Noise</em> — is the workhorse channel model. It is both physically justified (thermal noise) and mathematically tractable (leads to matched-filter optimality and clean BER formulas).</div>`
    },
    {
      h: 'Two-sided vs one-sided PSD, N0 and N0/2',
      html: String.raw`<p>A frequent source of confusion. The <strong>one-sided</strong> PSD $N_0$ (W/Hz) counts only positive frequencies and equals $kT$ for thermal noise. The <strong>two-sided</strong> PSD is $N_0/2$, defined over both positive and negative frequencies. Total noise power in bandwidth $B$ is $N_0 B$ either way — the two-sided version integrates $N_0/2$ over $[-B, B]$ (width $2B$), the one-sided integrates $N_0$ over $[0,B]$.</p>
<p>Matched-filter and BER derivations conventionally use the two-sided $N_0/2$; measurement instruments report the one-sided $N_0$. Keep track of the factor of two — it is the difference between a correct and a 3 dB-wrong answer.</p>`
    },
    {
      h: 'Noise temperature and equivalent representations',
      html: String.raw`<p>Because $N = kTB$, any noise power can be expressed as an equivalent <strong>noise temperature</strong> $T_e = N/(kB)$ — the physical temperature a resistor would need to produce that much noise. This is especially convenient for cascaded systems and for very low-noise front ends (LNAs, cryogenic radio-astronomy receivers) where noise figures near 0 dB are awkward but noise temperatures (e.g. 30 K) are natural.</p>
<p>The link to noise figure is $T_e = T_0(F-1)$, where $F$ is the noise factor and $T_0 = 290$ K. A device with $F = 2$ (3 dB) has $T_e = 290$ K; a superb LNA with $T_e = 50$ K has $F = 1.17$ (0.69 dB).</p>`
    },
    {
      h: 'Engineering implications',
      html: String.raw`<p>Noise dictates the receiver <strong>sensitivity</strong> — the weakest signal that yields an acceptable SNR or BER. Since the thermal floor is fixed by physics, the only levers are (1) reduce bandwidth to the minimum the signal needs, (2) minimize added noise (low noise figure front-end), (3) increase signal energy via coding gain, processing gain, or antenna gain, and (4) cool the front end (cryogenic receivers). Every dB of noise you fail to control costs a dB of link margin — equivalently, range, data rate, or transmit power.</p>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<ul>
<li><strong>Why noise is irreducible.</strong> Unlike interference or distortion, thermal noise comes from the heat of matter itself — you can lower it but never remove it.</li>
<li><strong>The one formula to know.</strong> Available thermal noise power is $N = kTB$, independent of resistance, giving the reference $-174$ dBm/Hz at 290 K and the floor $-174 + 10\log_{10}B$ in any band.</li>
<li><strong>Why the AWGN model is legitimate.</strong> Many independent electrons make the amplitude Gaussian (Central Limit Theorem), and a delta-like autocorrelation makes the spectrum white (Wiener–Khinchin).</li>
<li><strong>The factor-of-two discipline.</strong> One-sided $N_0 = kT$ versus two-sided $N_0/2$ both integrate to $N_0 B$ — mixing them up is a 3 dB error.</li>
<li><strong>Other noise types and their place.</strong> Shot noise $2qI_{DC}B$ where DC current crosses junctions; flicker $1/f$ near DC and in oscillators; thermal dominates the RF background.</li>
<li><strong>How to fight it.</strong> Narrow $B$, lower NF, add gain/coding, or cool the front end — every uncontrolled dB of noise is a dB of lost range or rate.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`Thermal (Johnson-Nyquist) noise power into a matched load: $N = kTB$ — independent of the resistance $R$.`,
    String.raw`Nyquist open-circuit voltage: $\overline{v_n^2} = 4kTRB$, with $k = 1.38\times10^{-23}$ J/K.`,
    String.raw`Room-temperature reference density: $kT_0 = -174$ dBm/Hz at $T_0 = 290$ K.`,
    String.raw`Noise floor in bandwidth $B$: $N_{dBm} = -174 + 10\log_{10}(B_{Hz})$.`,
    String.raw`Thermal noise is Gaussian (Central Limit Theorem) and white (delta autocorrelation) — the AWGN model.`,
    String.raw`One-sided PSD is $N_0 = kT$; two-sided is $N_0/2$ — both integrate to $N_0 B$ (mind the 3 dB factor of two).`,
    String.raw`Shot noise from discrete charge crossing a barrier: $\overline{i_n^2} = 2qI_{DC}B$ (white, Poisson).`,
    String.raw`Flicker (1/f) noise rises toward DC below a corner frequency; dominates oscillator close-in phase noise.`,
    String.raw`Any noise maps to an equivalent temperature: $T_e = N/(kB) = T_0(F-1)$.`,
    String.raw`Lower the floor only by narrowing $B$, cutting added noise (NF), adding gain/coding, or cooling the front end.`
  ],
  diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<line x1="50" y1="150" x2="520" y2="150" stroke="#9aa7b5"/>
<line x1="50" y1="150" x2="50" y2="20" stroke="#9aa7b5"/>
<text x="285" y="175" text-anchor="middle" fill="#9aa7b5">frequency</text>
<text x="20" y="90" transform="rotate(-90 20 90)" text-anchor="middle" fill="#9aa7b5">PSD</text>
<line x1="50" y1="70" x2="520" y2="70" stroke="#4dabf7" stroke-width="2"/>
<text x="300" y="62" fill="#4dabf7">thermal (white): N0 = kT</text>
<path d="M50,30 C70,50 85,62 110,68 L520,70" fill="none" stroke="#ffa94d" stroke-width="2"/>
<text x="120" y="45" fill="#ffa94d">flicker 1/f</text>
<line x1="110" y1="150" x2="110" y2="68" stroke="#9aa7b5" stroke-dasharray="3 3"/>
<text x="112" y="163" fill="#9aa7b5" font-size="9">1/f corner</text>
</g></svg>`,
      caption: 'Flicker (1/f) noise dominates at low frequency; thermal noise forms the flat white floor above the corner.'
    },
    {
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<line x1="40" y1="170" x2="300" y2="170" stroke="#9aa7b5"/>
<line x1="170" y1="170" x2="170" y2="20" stroke="#9aa7b5"/>
<text x="170" y="188" text-anchor="middle" fill="#9aa7b5">amplitude</text>
<path d="M40,170 C90,170 130,40 170,40 C210,40 250,170 300,170" fill="none" stroke="#63e6be" stroke-width="2"/>
<text x="200" y="60" fill="#63e6be">Gaussian PDF</text>
<text x="170" y="30" text-anchor="middle" fill="#9aa7b5" font-size="9">mean 0</text>
<line x1="340" y1="95" x2="520" y2="95" stroke="#9aa7b5"/>
<text x="430" y="115" text-anchor="middle" fill="#9aa7b5" font-size="9">time</text>
<path d="M340,95 L350,70 L358,120 L366,80 L374,110 L382,60 L390,105 L398,85 L406,125 L414,72 L422,100 L430,88 L438,118 L446,68 L454,108 L462,82 L470,112 L478,75 L486,102 L494,90 L502,120 L510,70 L520,95" fill="none" stroke="#ff6b6b" stroke-width="1.2"/>
<text x="430" y="45" text-anchor="middle" fill="#ff6b6b">white noise waveform</text>
</g></svg>`,
      caption: 'AWGN: Gaussian amplitude distribution (left) and a broadband, uncorrelated time waveform (right).'
    },
    {
      title: String.raw`noise sources into receiver`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-noise" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<g fill="#e6edf3" font-size="10" text-anchor="middle">
<rect x="10" y="20" width="120" height="34" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="70" y="34">Thermal kTB</text><text x="70" y="48" font-size="8" fill="#9aa7b5">resistors, antenna</text>
<rect x="10" y="70" width="120" height="34" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="70" y="84">Shot 2qI_DC B</text><text x="70" y="98" font-size="8" fill="#9aa7b5">junctions</text>
<rect x="10" y="120" width="120" height="34" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="70" y="134">Flicker 1/f</text><text x="70" y="148" font-size="8" fill="#9aa7b5">devices near DC</text>
<circle cx="250" cy="87" r="22" fill="#1c232e" stroke="#b197fc"/><text x="250" y="91" font-size="16">&#931;</text>
<rect x="330" y="68" width="90" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="375" y="86">Receiver</text><text x="375" y="99" font-size="8" fill="#9aa7b5">(adds NF)</text>
<rect x="450" y="68" width="80" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="490" y="86">Detect</text><text x="490" y="99" font-size="8" fill="#9aa7b5">SNR out</text>
<line x1="130" y1="37" x2="228" y2="78" stroke="#9aa7b5" marker-end="url(#arr3-noise)"/>
<line x1="130" y1="87" x2="226" y2="87" stroke="#9aa7b5" marker-end="url(#arr3-noise)"/>
<line x1="130" y1="137" x2="228" y2="97" stroke="#9aa7b5" marker-end="url(#arr3-noise)"/>
<line x1="272" y1="87" x2="328" y2="87" stroke="#9aa7b5" marker-end="url(#arr3-noise)"/>
<line x1="420" y1="88" x2="448" y2="88" stroke="#9aa7b5" marker-end="url(#arr3-noise)"/>
<text x="250" y="130" font-size="8" fill="#9aa7b5">powers add (linear)</text>
</g></svg>`,
      caption: String.raw`Independent noise sources add in power at the receiver input, setting the SNR the detector must work with.`
    }
  ],
  equations: [
    {
      title: 'Nyquist thermal noise voltage',
      tex: String.raw`$$ \overline{v_n^2} = 4kTRB $$`,
      derivation: String.raw`<p>Nyquist derived this by treating a resistor connected to a matched transmission line and applying the equipartition theorem to the modes of the line. Each mode carries average energy $kT$; counting modes in bandwidth $B$ and relating them to the resistor's terminal voltage gives the open-circuit mean-square voltage $\overline{v_n^2} = 4kTRB$. The factor 4 combines the 2 from mode counting and the 2 from open-circuit (unloaded) voltage.</p>`
    },
    {
      title: 'Available thermal noise power',
      tex: String.raw`$$ N = kTB $$`,
      derivation: String.raw`<p>Model the noisy resistor as an EMF source $v_n$ in series with $R$. Connect a matched load $R$. The voltage across the load is $v_n/2$, so the load power is $(v_n/2)^2/R = \overline{v_n^2}/(4R)$. Substituting $\overline{v_n^2}=4kTRB$ gives $N = 4kTRB/(4R) = kTB$. The resistance cancels — available noise power depends only on $T$ and $B$.</p>`
    },
    {
      title: 'Thermal noise PSD in dBm/Hz',
      tex: String.raw`$$ N_0\big|_{dBm/Hz} = 10\log_{10}\!\left(\frac{kT_0}{10^{-3}}\right) = -174 $$`,
      derivation: String.raw`<p>At $T_0=290$ K, $kT_0 = 1.38\times10^{-23}\times290 = 4.00\times10^{-21}$ W/Hz. In milliwatts: $4.00\times10^{-18}$ mW/Hz. $10\log_{10}(4.00\times10^{-18}) = 10(\log_{10}4 - 18) = 10(0.602-18) = -173.98 \approx -174$ dBm/Hz.</p>`
    },
    {
      title: 'Noise floor in bandwidth B',
      tex: String.raw`$$ N_{dBm} = -174 + 10\log_{10}(B_{Hz}) $$`,
      derivation: String.raw`<p>Total noise power is $N = N_0 B$. In dB, multiplication becomes addition: $N_{dBm} = (N_0)_{dBm/Hz} + 10\log_{10}(B) = -174 + 10\log_{10}(B_{Hz})$.</p>`
    },
    {
      title: 'Shot noise current',
      tex: String.raw`$$ \overline{i_n^2} = 2qI_{DC}B $$`,
      derivation: String.raw`<p>Charge crosses a barrier in discrete quanta $q$ at random Poisson-distributed times. For a mean current $I_{DC}$, the Poisson variance of the arrival process translates to a white current-noise PSD of $2qI_{DC}$ (A²/Hz). Over bandwidth $B$ the mean-square fluctuation is $2qI_{DC}B$.</p>`
    },
    {
      title: 'Noise temperature',
      tex: String.raw`$$ T_e = \frac{N}{kB} = T_0(F-1) $$`,
      derivation: String.raw`<p>Any noise power $N$ maps to an equivalent temperature via $N = kT_eB$. For a two-port with noise factor $F$, the added noise (referred to input) corresponds to $T_e = T_0(F-1)$: at $F=1$ (ideal) no noise is added, so $T_e=0$; the excess above unity scales the reference $T_0=290$ K.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What is the available thermal noise power?`, back: String.raw`$N = kTB$ — independent of resistance; only temperature and bandwidth matter.` },
    { front: String.raw`State the thermal noise PSD at room temperature in dBm/Hz.`, back: String.raw`$-174$ dBm/Hz ($kT_0 = 4\times10^{-21}$ W/Hz at $T_0=290$ K).` },
    { front: String.raw`Why is thermal noise Gaussian?`, back: String.raw`It is the sum of contributions from a huge number of independent electrons; the Central Limit Theorem makes the sum normal.` },
    { front: String.raw`Why is thermal noise "white"?`, back: String.raw`Its autocorrelation is nearly a delta function; by Wiener–Khinchin that gives a flat PSD across all communication-relevant frequencies.` },
    { front: String.raw`Nyquist open-circuit noise voltage?`, back: String.raw`$\overline{v_n^2} = 4kTRB$.` },
    { front: String.raw`Difference between one-sided and two-sided noise PSD?`, back: String.raw`One-sided is $N_0$ over positive $f$; two-sided is $N_0/2$ over all $f$. Both give total power $N_0 B$.` },
    { front: String.raw`What is shot noise and its magnitude?`, back: String.raw`Noise from discrete charge crossing a barrier; $\overline{i_n^2} = 2qI_{DC}B$.` },
    { front: String.raw`What is 1/f (flicker) noise?`, back: String.raw`Low-frequency noise with PSD rising as $1/f$; dominant below a corner frequency and critical for oscillator phase noise.` },
    { front: String.raw`Convert noise power to noise temperature.`, back: String.raw`$T_e = N/(kB)$; relates to noise factor by $T_e = T_0(F-1)$.` },
    { front: String.raw`Noise floor in 1 MHz bandwidth at room temperature?`, back: String.raw`$-174 + 10\log_{10}(10^6) = -174 + 60 = -114$ dBm.` },
    { front: String.raw`How does thermal noise depend on resistance?`, back: String.raw`Available power does NOT depend on R; noise voltage does ($\propto\sqrt R$), but matched-load power cancels R.` },
    { front: String.raw`Distinguish noise from interference and distortion.`, back: String.raw`Noise is intrinsic random fluctuation; interference is unwanted signals from other sources; distortion is deterministic and can be equalized.` },
    { front: String.raw`What does AWGN stand for and imply?`, back: String.raw`Additive White Gaussian Noise — adds to the signal, flat spectrum, normal amplitude; the standard tractable channel model.` },
    { front: String.raw`Why cool a receiver front end?`, back: String.raw`$N=kTB$: lowering $T$ lowers the noise floor, improving sensitivity — used in radio astronomy and deep-space ground stations.` }
  ],
  mcqs: [
    { q: String.raw`The available thermal noise power of a resistor depends on:`, options: [ String.raw`R and T only`, String.raw`T and B only`, String.raw`R, T and B`, String.raw`R and B only` ], answer: 1, explain: String.raw`$N=kTB$ — resistance cancels for a matched load.` },
    { q: String.raw`The thermal noise floor in a 1 GHz bandwidth at 290 K is about:`, options: [ String.raw`-174 dBm`, String.raw`-114 dBm`, String.raw`-84 dBm`, String.raw`-54 dBm` ], answer: 2, explain: String.raw`$-174 + 10\log_{10}(10^9) = -174 + 90 = -84$ dBm.` },
    { q: String.raw`Which noise type has a PSD that increases at low frequencies?`, options: [ String.raw`Thermal`, String.raw`Shot`, String.raw`Flicker (1/f)`, String.raw`White Gaussian` ], answer: 2, explain: String.raw`Flicker noise PSD rises as $1/f$ toward DC.` },
    { q: String.raw`The two-sided PSD of white noise is:`, options: [ String.raw`$N_0$`, String.raw`$N_0/2$`, String.raw`$2N_0$`, String.raw`$kT/2$` ], answer: 1, explain: String.raw`Two-sided PSD is $N_0/2$; integrated over $[-B,B]$ it gives total power $N_0 B$.` },
    { q: String.raw`Shot noise mean-square current is:`, options: [ String.raw`$4kTRB$`, String.raw`$2qI_{DC}B$`, String.raw`$kTB$`, String.raw`$qI_{DC}^2 B$` ], answer: 1, explain: String.raw`$\overline{i_n^2}=2qI_{DC}B$ from Poisson charge crossing.` },
    { q: String.raw`A device with noise factor F = 2 has an equivalent noise temperature of:`, options: [ String.raw`145 K`, String.raw`290 K`, String.raw`580 K`, String.raw`0 K` ], answer: 1, explain: String.raw`$T_e = T_0(F-1) = 290(2-1) = 290$ K.` },
    { q: String.raw`Thermal noise voltage across a 50 Ω resistor is proportional to:`, options: [ String.raw`R`, String.raw`$\sqrt{R}$`, String.raw`$1/R$`, String.raw`independent of R` ], answer: 1, explain: String.raw`$\overline{v_n^2}=4kTRB \Rightarrow v_n \propto \sqrt R$.` },
    { q: String.raw`Why is the AWGN model so widely used?`, options: [ String.raw`It matches all real channels exactly`, String.raw`It is both physically justified and mathematically tractable`, String.raw`It ignores thermal noise`, String.raw`It only applies to fiber` ], answer: 1, explain: String.raw`Thermal noise is genuinely Gaussian/white, and the model yields clean, optimal-receiver results.` },
    { q: String.raw`Doubling the bandwidth of a receiver changes the thermal noise floor by:`, options: [ String.raw`+3 dB`, String.raw`+6 dB`, String.raw`0 dB`, String.raw`-3 dB` ], answer: 0, explain: String.raw`$N\propto B$; doubling gives $10\log_{10}2 = 3$ dB more noise.` },
    { q: String.raw`At what frequency scale does thermal noise stop being white (room temp)?`, options: [ String.raw`kHz`, String.raw`MHz`, String.raw`GHz`, String.raw`THz (where $hf \sim kT$)` ], answer: 3, explain: String.raw`Quantum roll-off occurs when photon energy $hf$ approaches $kT$, i.e. terahertz at 290 K.` },
    { q: String.raw`Which is TRUE of thermal noise?`, options: [ String.raw`It vanishes at high resistance`, String.raw`Its available power is $kTB$ regardless of R`, String.raw`It is deterministic`, String.raw`It only occurs in semiconductors` ], answer: 1, explain: String.raw`Available power $kTB$ is resistance-independent and occurs in any resistive element.` },
    { q: String.raw`A cryogenically cooled LNA improves sensitivity because:`, options: [ String.raw`It increases bandwidth`, String.raw`Lower T lowers $kTB$ noise`, String.raw`It removes shot noise entirely`, String.raw`It increases gain to infinity` ], answer: 1, explain: String.raw`Since $N=kTB$, reducing physical temperature directly reduces the thermal noise floor.` }
  ],
  numericals: [
    { q: String.raw`Find the RMS thermal noise voltage across a 1 MΩ resistor at 300 K over a 10 kHz bandwidth.`, solution: String.raw`<p><b>Formula.</b> Nyquist's open-circuit thermal-noise voltage: $$ \overline{v_n^2} = 4kTRB, \qquad v_{rms} = \sqrt{\overline{v_n^2}} $$ where $k = 1.38\times10^{-23}$ J/K is Boltzmann's constant, $T$ the temperature (K), $R$ the resistance ($\Omega$), and $B$ the bandwidth (Hz).</p>
<p><b>Substitute.</b> $$ \overline{v_n^2} = 4(1.38\times10^{-23})(300)(10^6)(10^4) $$</p>
<p><b>Compute.</b> $4\times1.38\times3 = 16.56$ and the exponents sum to $-23+2+6+4 = -13$, giving $\overline{v_n^2} = 16.56\times10^{-13} = 1.656\times10^{-10}\ \text{V}^2$. Then $v_{rms} = \sqrt{1.656\times10^{-10}} = 1.29\times10^{-5}$ V $= 12.9\ \mu$V.</p>
<p><b>Explanation.</b> Even a passive resistor sitting on the bench generates microvolts of noise — this is the fundamental floor a high-impedance sensor front-end must beat. Note the noise voltage scales as $\sqrt{R}$, which is why high-value resistors (megohms) are noisy and low-impedance nodes are quieter.</p>` },
    { q: String.raw`What is the thermal noise power (dBm) in a 20 MHz Wi-Fi channel at 290 K?`, solution: String.raw`<p><b>Formula.</b> $$ N_{dBm} = -174 + 10\log_{10}(B_{Hz}) $$ where $-174$ dBm/Hz is the room-temperature ($T_0 = 290$ K) thermal noise density $kT_0$ and $B$ is the bandwidth in Hz.</p>
<p><b>Substitute.</b> $$ N = -174 + 10\log_{10}(20\times10^6) $$</p>
<p><b>Compute.</b> $10\log_{10}(2\times10^7) = 10(7.301) = 73.0$ dB, so $N = -174 + 73 = -101$ dBm.</p>
<p><b>Explanation.</b> This $-101$ dBm is the noiseless-receiver floor for a 20 MHz channel; a real Wi-Fi front-end adds its noise figure (a few dB) on top. It anchors the sensitivity budget — any received signal must sit a required SNR above this to be demodulated.</p>` },
    { q: String.raw`A photodiode carries 1 mA DC. Find the shot-noise current in a 1 MHz bandwidth ($q=1.6\times10^{-19}$ C).`, solution: String.raw`<p><b>Formula.</b> $$ \overline{i_n^2} = 2qI_{DC}B, \qquad i_{rms} = \sqrt{\overline{i_n^2}} $$ where $q = 1.6\times10^{-19}$ C is the electron charge, $I_{DC}$ the mean current, and $B$ the bandwidth.</p>
<p><b>Substitute.</b> $$ \overline{i_n^2} = 2(1.6\times10^{-19})(10^{-3})(10^6) $$</p>
<p><b>Compute.</b> $\overline{i_n^2} = 3.2\times10^{-16}\ \text{A}^2$, so $i_{rms} = \sqrt{3.2\times10^{-16}} = 1.79\times10^{-8}$ A $= 17.9$ nA.</p>
<p><b>Explanation.</b> Shot noise grows with the DC current, so unlike thermal noise you cannot beat it by cooling — you must reduce the current or increase the signal. In photodetectors this sets the shot-noise-limited sensitivity that defines the best achievable SNR at a given optical power.</p>` },
    { q: String.raw`Convert a noise temperature of 75 K to a noise factor and noise figure.`, solution: String.raw`<p><b>Formula.</b> $$ F = 1 + \frac{T_e}{T_0}, \qquad NF = 10\log_{10}F $$ where $T_e$ is the equivalent noise temperature, $T_0 = 290$ K the reference, $F$ the noise factor (linear), and $NF$ the noise figure (dB).</p>
<p><b>Substitute.</b> $$ F = 1 + \frac{75}{290}, \qquad NF = 10\log_{10}(1.259) $$</p>
<p><b>Compute.</b> $F = 1 + 0.259 = 1.259$; $NF = 10\log_{10}(1.259) = 1.0$ dB.</p>
<p><b>Explanation.</b> A 75 K noise temperature corresponds to a very good 1.0 dB noise figure — the kind of number a decent LNA achieves. Engineers prefer $T_e$ for low-noise parts because "75 K" resolves differences that "1.0 dB" blurs; both describe the same added noise.</p>` },
    { q: String.raw`A receiver has a 3 MHz bandwidth. If its input SNR must be at least 12 dB for the required BER, what is the minimum signal power at the antenna assuming a noiseless receiver at 290 K?`, solution: String.raw`<p><b>Formula.</b> $$ N = -174 + 10\log_{10}(B_{Hz}), \qquad S_{min} = N + \mathrm{SNR}_{min} $$ where $N$ is the thermal noise floor in the band, and $S_{min}$ the weakest signal that still meets the required SNR.</p>
<p><b>Substitute.</b> $$ N = -174 + 10\log_{10}(3\times10^6), \qquad S_{min} = N + 12 $$</p>
<p><b>Compute.</b> $10\log_{10}(3\times10^6) = 64.77$ dB, so $N = -174 + 64.77 = -109.2$ dBm; then $S_{min} = -109.2 + 12 = -97.2$ dBm.</p>
<p><b>Explanation.</b> This is the best-case sensitivity — a perfect, noiseless receiver. A real receiver adds its noise figure directly to the $-109.2$ dBm floor, so every dB of NF costs a dB of sensitivity. The calculation shows why bandwidth discipline matters: halving $B$ would lower the floor by 3 dB and improve sensitivity by the same.</p>` }
  ],
  realWorld: String.raw`<p>Radio astronomy pushes noise engineering to its limit: receivers for facilities like ALMA and the Square Kilometre Array are cooled to a few kelvin so that $kTB$ shrinks enough to detect signals from galaxies billions of light-years away — signals whose total collected energy over decades of observation is less than that of a falling snowflake. Every kelvin of physical temperature in the front end is a measurable loss of scientific reach.</p>
<p>In consumer electronics, the $-174$ dBm/Hz floor sets the hard limit on smartphone receiver sensitivity. Cellular standards specify reference sensitivity levels (e.g. around $-100$ dBm for LTE) computed directly from $kTB$ plus the modem's noise figure plus the required SNR. When you see a "bars" indicator, it is ultimately reporting how far your received signal sits above this thermodynamic floor.</p>`,
  related: [ 'noise-floor', 'noise-figure', 'psd', 'comm-basics', 'phase-noise' ]
},
{
  id: 'psd',
  title: 'Power Spectral Density',
  category: 'Fundamentals',
  tags: [ 'psd', 'wiener-khinchin', 'autocorrelation', 'fourier', 'spectrum', 'random-process' ],
  summary: String.raw`Power spectral density describes how the power of a signal or random process is distributed across frequency, linked to the autocorrelation by the Wiener–Khinchin theorem.`,
  prerequisites: [ 'comm-basics', 'noise' ],
  intro: String.raw`<p>Many important signals — thermal noise, digital data streams, speech — are not deterministic waveforms with a well-defined Fourier transform, yet they clearly occupy some band of frequencies and carry power in each part of that band. <strong>Power spectral density</strong> (PSD) is the tool that makes this precise: it tells us how much power per unit bandwidth a signal contains at each frequency, with units of watts per hertz (W/Hz), or in log form dBm/Hz.</p>
<p>PSD is central to every RF discipline. It defines the shape of a transmitted spectrum (and thus regulatory compliance), quantifies noise ($N_0 = kT$ is a PSD), underlies filter and matched-filter design, and — through the Wiener–Khinchin theorem — connects the frequency domain to the time-domain autocorrelation of a random process. Mastering PSD means being able to move fluidly between "how the signal looks over time" and "where its power lives in frequency."</p>`,
  sections: [
    {
      h: 'From energy signals to power signals',
      html: String.raw`<p>Signals divide into two classes. An <strong>energy signal</strong> has finite total energy $E = \int_{-\infty}^{\infty}|x(t)|^2\,dt < \infty$ (e.g. a single pulse); it has a well-defined Fourier transform $X(f)$ and an <em>energy</em> spectral density $|X(f)|^2$. A <strong>power signal</strong> has infinite energy but finite average power (e.g. a periodic wave, or noise that never turns off); it does not have an ordinary Fourier transform, so we describe it by its <em>power</em> spectral density instead.</p>
<p>The PSD $S_x(f)$ is defined so that integrating it over all frequency returns the total average power:</p>
$$ P = \int_{-\infty}^{\infty} S_x(f)\,df $$
<p>and integrating over a band $[f_1,f_2]$ gives the power contained in that band. This is exactly the quantity a spectrum analyzer estimates.</p>`
    },
    {
      h: 'Formal definition via a limit',
      html: String.raw`<div class="callout tip"><strong>Intuition first:</strong> A never-ending noise signal has infinite total energy, so its ordinary Fourier transform blows up. The fix is common sense: look at a finite window, measure the power in each frequency bin over that window, then let the window grow. Averaging over many such windows steadies the estimate. The limit below is just this "window, measure, average, repeat" recipe written formally.</div>
<p>For a power signal we cannot Fourier-transform $x(t)$ directly, so we truncate it to a window of length $T$, transform that, normalize by $T$, and take the limit (and, for random signals, the expectation):</p>
$$ S_x(f) = \lim_{T\to\infty} \frac{1}{T}\, E\big[\,|X_T(f)|^2\,\big] $$
<p>where $X_T(f)$ is the Fourier transform of the windowed segment $x_T(t)$. The $1/T$ normalization converts energy in the window to power; the expectation averages over the ensemble of the random process. This is the periodogram in the limit — the theoretical basis for practical Welch/averaged-periodogram estimators.</p>`
    },
    {
      h: 'The Wiener–Khinchin theorem',
      html: String.raw`<p>The cornerstone result: for a wide-sense-stationary (WSS) random process, the power spectral density is the Fourier transform of the autocorrelation function $R_x(\tau) = E[x(t)x(t+\tau)]$:</p>
$$ S_x(f) = \int_{-\infty}^{\infty} R_x(\tau)\,e^{-j2\pi f\tau}\,d\tau $$
<p>and inversely $R_x(\tau) = \int S_x(f)e^{j2\pi f\tau}df$. This is profound: it means the second-order time-domain statistics (how correlated the signal is with a shifted copy of itself) completely determine the frequency-domain power distribution, and vice versa.</p>
<div class="callout"><strong>Immediate consequences:</strong> (1) White noise has $R_x(\tau) = \tfrac{N_0}{2}\delta(\tau)$, whose transform is a flat $S_x(f)=N_0/2$ — hence "white." (2) The total power $P = R_x(0) = \int S_x(f)df$, recovering the definition. (3) A slowly-varying (highly correlated) signal has a broad $R_x$ and thus a narrow, low-frequency spectrum.</div>`
    },
    {
      h: 'PSD of common signals',
      html: String.raw`<table class="data">
<tr><th>Signal</th><th>Autocorrelation</th><th>PSD</th></tr>
<tr><td>White noise</td><td>$\tfrac{N_0}{2}\delta(\tau)$</td><td>$\tfrac{N_0}{2}$ (flat)</td></tr>
<tr><td>Sinusoid $A\cos(2\pi f_0 t)$</td><td>$\tfrac{A^2}{2}\cos(2\pi f_0\tau)$</td><td>$\tfrac{A^2}{4}[\delta(f-f_0)+\delta(f+f_0)]$</td></tr>
<tr><td>Random NRZ (bit period $T_b$)</td><td>triangular</td><td>$T_b\,\mathrm{sinc}^2(fT_b)$</td></tr>
<tr><td>Band-limited noise</td><td>$\mathrm{sinc}$-shaped</td><td>flat over $[-B,B]$</td></tr>
</table>
<p>The NRZ result is especially important in digital comms: a random binary sequence of rectangular pulses has a $\mathrm{sinc}^2$ PSD, with nulls at multiples of the bit rate $1/T_b$. This is why unfiltered digital signals have wide sidelobes, and why pulse shaping (raised-cosine) is used to confine the spectrum.</p>`
    },
    {
      h: 'PSD through LTI systems',
      html: String.raw`<p>When a WSS process with PSD $S_x(f)$ passes through a linear time-invariant system with frequency response $H(f)$, the output PSD is scaled by the squared magnitude:</p>
$$ S_y(f) = |H(f)|^2\, S_x(f) $$
<p>This single relation underlies filtering analysis, noise-bandwidth calculations, and matched-filter design. For example, white noise $N_0/2$ through a filter of magnitude response $|H(f)|$ produces output noise power $\int |H(f)|^2 (N_0/2)\,df$, which defines the filter's <strong>equivalent noise bandwidth</strong> $B_N = \frac{1}{|H(f_0)|^2}\int_0^\infty |H(f)|^2 df$.</p>`
    },
    {
      h: 'Estimating PSD in practice',
      html: String.raw`<p>Real instruments estimate PSD from finite data. The naive <strong>periodogram</strong> $\tfrac{1}{N}|X(f)|^2$ is unbiased in the mean but has high variance that does not decrease with more samples. Practical estimators reduce variance by averaging: <strong>Bartlett</strong> (average periodograms of non-overlapping segments), <strong>Welch</strong> (overlapping windowed segments — the standard), and <strong>Blackman–Tukey</strong> (windowed autocorrelation, then transform). All trade frequency resolution against variance: shorter segments give more averaging (lower variance) but coarser resolution.</p>
<p>A swept superheterodyne <strong>spectrum analyzer</strong> measures PSD directly by scanning a narrow resolution-bandwidth (RBW) filter across frequency and reporting power in each RBW; results depend on the RBW setting, which is why noise-floor readings on an analyzer must be normalized to 1 Hz to compare with $-174$ dBm/Hz.</p>
<div class="callout"><strong>Pitfall:</strong> A spectrum analyzer with RBW = 100 kHz shows a thermal noise floor 50 dB ($10\log_{10} 10^5$) higher than the per-Hz value. Always ask "in what bandwidth?" before comparing PSD numbers.</div>`
    },
    {
      h: 'One-sided vs two-sided and dB conventions',
      html: String.raw`<p>As with noise, PSD comes in two-sided ($S_x(f)$ over all $f$, symmetric for real signals) and one-sided ($G_x(f) = 2S_x(f)$ for $f\ge0$) forms. Total power is the same. Engineering practice uses one-sided when reporting instrument data (positive frequencies only) and two-sided in theoretical derivations. Log conventions: dBm/Hz for absolute power density, dBc/Hz for density relative to a carrier (used for phase noise), and dB/Hz generically.</p>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<ul>
<li><strong>What PSD is for.</strong> It describes how power is spread over frequency (W/Hz) for signals that have no ordinary Fourier transform; integrating it recovers total power.</li>
<li><strong>The central bridge.</strong> Wiener–Khinchin makes PSD and autocorrelation a Fourier pair, so you can work in whichever domain — time or frequency — is easier and translate freely.</li>
<li><strong>Two workhorse rules.</strong> White noise ↔ flat PSD (delta autocorrelation), and through an LTI filter the PSD scales by $|H(f)|^2$ — the basis of noise-bandwidth and matched-filter analysis.</li>
<li><strong>Digital signal spectra.</strong> Random NRZ has a $\mathrm{sinc}^2$ PSD with nulls at multiples of the bit rate, explaining why raw data is wideband and why pulse shaping is needed.</li>
<li><strong>Estimation in practice.</strong> The raw periodogram is too noisy; Welch/Bartlett averaging trades resolution for variance, and any instrument reading must be normalized to 1 Hz (mind the RBW) before comparing.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`PSD $S_x(f)$ shows how average power is distributed over frequency (W/Hz); integrating it gives total power.`,
    String.raw`Wiener-Khinchin: $S_x(f) = \mathcal{F}\{R_x(\tau)\}$ — PSD and autocorrelation are a Fourier-transform pair.`,
    String.raw`Total power equals $R_x(0) = \int_{-\infty}^{\infty} S_x(f)\,df$ (Parseval).`,
    String.raw`White noise has $R_x(\tau) = \tfrac{N_0}{2}\delta(\tau)$, giving a flat PSD — hence "white."`,
    String.raw`Through an LTI system the PSD scales by the squared magnitude: $S_y(f) = |H(f)|^2 S_x(f)$.`,
    String.raw`Random polar NRZ has PSD $A^2 T_b\,\mathrm{sinc}^2(fT_b)$, with nulls at multiples of the bit rate $1/T_b$.`,
    String.raw`Equivalent noise bandwidth: $B_N = \frac{1}{|H(f_0)|^2}\int_0^{\infty}|H(f)|^2\,df$ (one-pole RC gives $\tfrac{\pi}{2}f_c$).`,
    String.raw`Energy signals have finite energy and an ordinary FT; power signals need the PSD (limit of the periodogram).`,
    String.raw`The raw periodogram has variance that never shrinks — average (Welch/Bartlett) trading resolution for variance.`,
    String.raw`One-sided $G_x(f) = 2S_x(f)$; instrument readings scale with RBW, so normalize to 1 Hz to compare to $-174$ dBm/Hz.`
  ],
  diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr-psd" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<g fill="#e6edf3" font-size="10">
<text x="120" y="20" text-anchor="middle" fill="#63e6be">Autocorrelation R(τ)</text>
<line x1="30" y1="120" x2="230" y2="120" stroke="#9aa7b5"/>
<line x1="130" y1="120" x2="130" y2="35" stroke="#9aa7b5"/>
<path d="M30,118 C90,116 115,50 130,45 C145,50 170,116 230,118" fill="none" stroke="#63e6be" stroke-width="2"/>
<text x="132" y="135" fill="#9aa7b5" font-size="9">τ</text>
<line x1="245" y1="80" x2="300" y2="80" stroke="#9aa7b5" marker-end="url(#arr-psd)"/>
<text x="272" y="72" text-anchor="middle" fill="#4dabf7" font-size="9">FT</text>
<text x="270" y="95" text-anchor="middle" fill="#9aa7b5" font-size="8">Wiener–Khinchin</text>
<text x="410" y="20" text-anchor="middle" fill="#4dabf7">PSD S(f)</text>
<line x1="315" y1="120" x2="520" y2="120" stroke="#9aa7b5"/>
<line x1="417" y1="120" x2="417" y2="35" stroke="#9aa7b5"/>
<path d="M315,118 C380,116 405,45 417,42 C429,45 454,116 520,118" fill="none" stroke="#4dabf7" stroke-width="2"/>
<text x="420" y="135" fill="#9aa7b5" font-size="9">f</text>
</g></svg>`,
      caption: 'Wiener–Khinchin: PSD is the Fourier transform of the autocorrelation function.'
    },
    {
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<line x1="40" y1="160" x2="520" y2="160" stroke="#9aa7b5"/>
<line x1="280" y1="160" x2="280" y2="20" stroke="#9aa7b5"/>
<text x="490" y="175" fill="#9aa7b5">f</text>
<path d="M280,30 C300,30 305,150 320,158 C335,150 340,60 355,58 C365,60 368,152 378,158 C388,152 390,90 400,88 C408,90 410,155 418,158 L520,159" fill="none" stroke="#ffa94d" stroke-width="2"/>
<path d="M280,30 C260,30 255,150 240,158 C225,150 220,60 205,58 C195,60 192,152 182,158 C172,152 170,90 160,88 C152,90 150,155 142,158 L40,159" fill="none" stroke="#ffa94d" stroke-width="2"/>
<text x="200" y="45" text-anchor="middle" fill="#ffa94d">sinc² main lobe</text>
<line x1="355" y1="160" x2="355" y2="165" stroke="#9aa7b5"/><text x="355" y="178" text-anchor="middle" fill="#9aa7b5" font-size="9">1/Tb</text>
<line x1="400" y1="160" x2="400" y2="165" stroke="#9aa7b5"/><text x="405" y="178" text-anchor="middle" fill="#9aa7b5" font-size="9">2/Tb</text>
</g></svg>`,
      caption: 'PSD of a random NRZ binary stream: a sinc² shape with spectral nulls at integer multiples of the bit rate.'
    },
    {
      title: String.raw`Welch PSD estimator chain`,
      svg: String.raw`<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-psd" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<g fill="#e6edf3" font-size="10" text-anchor="middle">
<rect x="8" y="55" width="86" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="51" y="74">Signal x(t)</text><text x="51" y="88" font-size="8" fill="#9aa7b5">segment</text>
<rect x="118" y="55" width="86" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="161" y="74">Window</text><text x="161" y="88" font-size="8" fill="#9aa7b5">Hann, overlap</text>
<rect x="228" y="55" width="86" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="271" y="78">FFT</text>
<rect x="338" y="55" width="86" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="381" y="74">|X(f)|&#178;/T</text><text x="381" y="88" font-size="8" fill="#9aa7b5">periodogram</text>
<rect x="448" y="55" width="86" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="491" y="74">Average</text><text x="491" y="88" font-size="8" fill="#9aa7b5">S_x(f) est.</text>
<line x1="94" y1="77" x2="116" y2="77" stroke="#9aa7b5" marker-end="url(#arr3-psd)"/>
<line x1="204" y1="77" x2="226" y2="77" stroke="#9aa7b5" marker-end="url(#arr3-psd)"/>
<line x1="314" y1="77" x2="336" y2="77" stroke="#9aa7b5" marker-end="url(#arr3-psd)"/>
<line x1="424" y1="77" x2="446" y2="77" stroke="#9aa7b5" marker-end="url(#arr3-psd)"/>
<path d="M491,99 C491,125 271,125 271,101" fill="none" stroke="#9aa7b5" stroke-dasharray="3 3" marker-end="url(#arr3-psd)"/>
<text x="381" y="140" font-size="8" fill="#9aa7b5">loop over segments &#8594; lower variance</text>
</g></svg>`,
      caption: String.raw`Welch estimator: window overlapping segments, square each FFT, then average periodograms to cut variance.`
    }
  ],
  equations: [
    {
      title: 'PSD as a limit (periodogram)',
      tex: String.raw`$$ S_x(f) = \lim_{T\to\infty}\frac{1}{T}E\big[|X_T(f)|^2\big] $$`,
      derivation: String.raw`<p>Windowing $x(t)$ to $[-T/2,T/2]$ gives a finite-energy segment with transform $X_T(f)$ and energy spectral density $|X_T(f)|^2$. Dividing by the window length $T$ converts energy to average power. Taking the expectation averages over the random ensemble, and $T\to\infty$ removes the windowing bias. The result is the true PSD.</p>`
    },
    {
      title: 'Wiener–Khinchin theorem',
      tex: String.raw`$$ S_x(f) = \int_{-\infty}^{\infty} R_x(\tau)e^{-j2\pi f\tau}d\tau $$`,
      derivation: String.raw`<p>Start from $S_x(f)=\lim \tfrac1T E|X_T(f)|^2 = \lim\tfrac1T E[X_T(f)X_T^*(f)]$. Writing each transform as an integral and using stationarity $E[x(t_1)x(t_2)]=R_x(t_2-t_1)$, the double integral collapses (change of variables $\tau=t_2-t_1$) to a single Fourier integral of $R_x(\tau)$. Hence PSD and autocorrelation are a Fourier transform pair.</p>`
    },
    {
      title: 'Total power from PSD',
      tex: String.raw`$$ P = \int_{-\infty}^{\infty} S_x(f)\,df = R_x(0) $$`,
      derivation: String.raw`<p>Set $\tau=0$ in the inverse transform $R_x(\tau)=\int S_x(f)e^{j2\pi f\tau}df$: $R_x(0)=\int S_x(f)df$. But $R_x(0)=E[x^2(t)]$ is precisely the average power. So integrating the PSD over all frequency yields total power (a form of Parseval's theorem).</p>`
    },
    {
      title: 'PSD through an LTI system',
      tex: String.raw`$$ S_y(f) = |H(f)|^2 S_x(f) $$`,
      derivation: String.raw`<p>The output autocorrelation is $R_y(\tau) = R_x(\tau)*h(\tau)*h(-\tau)$. Fourier-transforming and using the convolution theorem, the transform of $h(\tau)*h(-\tau)$ is $H(f)H^*(f)=|H(f)|^2$. Therefore $S_y(f)=|H(f)|^2 S_x(f)$.</p>`
    },
    {
      title: 'Equivalent noise bandwidth',
      tex: String.raw`$$ B_N = \frac{1}{|H(f_0)|^2}\int_0^{\infty}|H(f)|^2\,df $$`,
      derivation: String.raw`<p>The output noise power for white input is $\tfrac{N_0}{2}\int_{-\infty}^{\infty}|H(f)|^2 df = N_0\int_0^\infty |H(f)|^2 df$. Define $B_N$ as the width of an ideal brick-wall filter with the same peak gain $|H(f_0)|^2$ passing the same noise power. Equating gives $B_N = \tfrac{1}{|H(f_0)|^2}\int_0^\infty|H(f)|^2 df$.</p>`
    },
    {
      title: 'PSD of random NRZ',
      tex: String.raw`$$ S_x(f) = A^2 T_b\,\mathrm{sinc}^2(fT_b) $$`,
      derivation: String.raw`<p>For polar NRZ with equally likely $\pm A$ over bit period $T_b$, the pulse is rectangular with transform $A T_b\,\mathrm{sinc}(fT_b)$. Since bits are independent, the PSD is the single-pulse energy spectral density divided by the symbol period: $S_x(f)=\tfrac{1}{T_b}|P(f)|^2 = \tfrac{1}{T_b}(AT_b)^2\mathrm{sinc}^2(fT_b)=A^2T_b\,\mathrm{sinc}^2(fT_b)$, with nulls at $f=n/T_b$.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What does PSD represent?`, back: String.raw`How a signal's average power is distributed over frequency; units W/Hz. Integrating it gives total power.` },
    { front: String.raw`State the Wiener–Khinchin theorem.`, back: String.raw`For a WSS process, PSD is the Fourier transform of the autocorrelation: $S_x(f)=\mathcal{F}\{R_x(\tau)\}$.` },
    { front: String.raw`Why is white noise called "white"?`, back: String.raw`Its autocorrelation is a delta function, whose Fourier transform is a flat (constant) PSD across all frequencies.` },
    { front: String.raw`How does PSD transform through an LTI system?`, back: String.raw`$S_y(f)=|H(f)|^2 S_x(f)$ — scaled by the squared magnitude of the frequency response.` },
    { front: String.raw`Difference between energy and power signals?`, back: String.raw`Energy signals have finite total energy and an ordinary FT; power signals have infinite energy but finite average power, described by PSD.` },
    { front: String.raw`How do you get total power from PSD?`, back: String.raw`Integrate the PSD over all frequency; equals $R_x(0)$, the mean-square value (Parseval).` },
    { front: String.raw`PSD of a random NRZ binary stream?`, back: String.raw`$A^2 T_b\,\mathrm{sinc}^2(fT_b)$, with nulls at multiples of the bit rate $1/T_b$.` },
    { front: String.raw`What is equivalent noise bandwidth?`, back: String.raw`The width of an ideal brick-wall filter passing the same noise power at the same peak gain: $B_N=\frac{1}{|H(f_0)|^2}\int_0^\infty|H(f)|^2df$.` },
    { front: String.raw`Why does the raw periodogram have high variance?`, back: String.raw`Its variance does not decrease with more samples; averaging (Welch/Bartlett) is needed to reduce it, trading frequency resolution.` },
    { front: String.raw`What is dBc/Hz?`, back: String.raw`Power spectral density relative to the carrier power, per hertz — the standard unit for phase noise.` },
    { front: String.raw`Relate one-sided and two-sided PSD.`, back: String.raw`$G_x(f)=2S_x(f)$ for $f\ge0$; both integrate to the same total power.` },
    { front: String.raw`Why must spectrum-analyzer noise be normalized to 1 Hz?`, back: String.raw`The reading scales with resolution bandwidth (RBW); subtract $10\log_{10}(\text{RBW})$ to compare with per-Hz values like $-174$ dBm/Hz.` },
    { front: String.raw`What does a broad autocorrelation imply about the spectrum?`, back: String.raw`A highly correlated (slowly varying) signal has a broad $R_x(\tau)$ and therefore a narrow, low-frequency PSD.` },
    { front: String.raw`PSD of a pure sinusoid?`, back: String.raw`Delta functions at $\pm f_0$: $\tfrac{A^2}{4}[\delta(f-f_0)+\delta(f+f_0)]$.` }
  ],
  mcqs: [
    { q: String.raw`The Wiener–Khinchin theorem relates PSD to:`, options: [ String.raw`the signal's mean`, String.raw`the autocorrelation function`, String.raw`the phase spectrum`, String.raw`the bandwidth only` ], answer: 1, explain: String.raw`PSD is the Fourier transform of the autocorrelation.` },
    { q: String.raw`Integrating a PSD over all frequency gives:`, options: [ String.raw`the peak amplitude`, String.raw`the total average power`, String.raw`the bandwidth`, String.raw`the phase` ], answer: 1, explain: String.raw`$\int S_x(f)df = R_x(0) = $ average power.` },
    { q: String.raw`White noise has an autocorrelation that is:`, options: [ String.raw`a constant`, String.raw`a sinusoid`, String.raw`a delta function`, String.raw`a ramp` ], answer: 2, explain: String.raw`$R_x(\tau)=\tfrac{N_0}{2}\delta(\tau)$, transforming to a flat PSD.` },
    { q: String.raw`Passing a process through an LTI filter multiplies its PSD by:`, options: [ String.raw`$H(f)$`, String.raw`$|H(f)|$`, String.raw`$|H(f)|^2$`, String.raw`$H(f)^2$` ], answer: 2, explain: String.raw`$S_y(f)=|H(f)|^2 S_x(f)$.` },
    { q: String.raw`The PSD of random polar NRZ data has nulls at:`, options: [ String.raw`$1/(2T_b)$`, String.raw`multiples of $1/T_b$`, String.raw`$f_c$`, String.raw`no nulls` ], answer: 1, explain: String.raw`$\mathrm{sinc}^2(fT_b)$ nulls occur at $f=n/T_b$.` },
    { q: String.raw`A power signal differs from an energy signal in that it has:`, options: [ String.raw`finite energy`, String.raw`infinite energy, finite average power`, String.raw`no frequency content`, String.raw`zero power` ], answer: 1, explain: String.raw`Power signals (e.g. ongoing noise) have infinite energy but finite average power.` },
    { q: String.raw`The unit dBc/Hz expresses PSD relative to:`, options: [ String.raw`1 mW`, String.raw`the carrier power`, String.raw`1 W`, String.raw`the noise floor` ], answer: 1, explain: String.raw`dBc means decibels relative to carrier; per Hz for density.` },
    { q: String.raw`The raw periodogram estimator is problematic because:`, options: [ String.raw`it is biased and low-variance`, String.raw`its variance does not decrease with sample count`, String.raw`it cannot be computed via FFT`, String.raw`it requires the autocorrelation` ], answer: 1, explain: String.raw`Periodogram variance stays roughly constant; averaging (Welch) is needed.` },
    { q: String.raw`On a spectrum analyzer with RBW = 1 kHz, the displayed thermal noise floor is higher than the per-Hz value by:`, options: [ String.raw`10 dB`, String.raw`30 dB`, String.raw`60 dB`, String.raw`3 dB` ], answer: 1, explain: String.raw`$10\log_{10}(1000)=30$ dB.` },
    { q: String.raw`The PSD of a pure sinusoid consists of:`, options: [ String.raw`a flat band`, String.raw`a sinc shape`, String.raw`delta functions at $\pm f_0$`, String.raw`a 1/f slope` ], answer: 2, explain: String.raw`All power is concentrated at the discrete frequency $f_0$.` },
    { q: String.raw`Equivalent noise bandwidth depends on:`, options: [ String.raw`only the peak gain`, String.raw`the integral of $|H(f)|^2$ normalized by peak gain`, String.raw`the phase response`, String.raw`the input power` ], answer: 1, explain: String.raw`$B_N=\frac{1}{|H(f_0)|^2}\int_0^\infty|H(f)|^2df$.` },
    { q: String.raw`Which time-domain feature corresponds to a narrow (low-frequency) PSD?`, options: [ String.raw`rapid decorrelation`, String.raw`a broad autocorrelation`, String.raw`a delta autocorrelation`, String.raw`high amplitude` ], answer: 1, explain: String.raw`Slowly varying, highly correlated signals have broad $R_x$ and narrow spectra.` }
  ],
  numericals: [
    { q: String.raw`White noise with two-sided PSD $N_0/2 = 10^{-20}$ W/Hz passes through an ideal bandpass filter of bandwidth 5 MHz (unity gain). Find the output noise power.`, solution: String.raw`<p><b>Formula.</b> $$ N = N_0 B $$ where $N$ is the noise power in the passband, $N_0$ the one-sided PSD, and $B$ the filter bandwidth. The two-sided value $N_0/2$ must be doubled to get the one-sided $N_0$.</p>
<p><b>Substitute.</b> One-sided $N_0 = 2\times(N_0/2) = 2\times10^{-20}$ W/Hz. $$ N = (2\times10^{-20})(5\times10^6) $$</p>
<p><b>Compute.</b> $N = 10^{-13}$ W. In dBm: $10\log_{10}(10^{-13}/10^{-3}) = 10\log_{10}(10^{-10}) = -100$ dBm.</p>
<p><b>Explanation.</b> The factor-of-two between one-sided and two-sided PSD is the classic 3 dB trap: forgetting it here would give $-103$ dBm, a real error in a link budget. Because the filter is white-noise-limited, output noise scales directly with bandwidth — narrow the filter and the floor drops proportionally.</p>` },
    { q: String.raw`A first-order RC lowpass has $|H(f)|^2 = 1/(1+(f/f_c)^2)$ with $f_c = 1$ MHz. Find its equivalent noise bandwidth.`, solution: String.raw`<p><b>Formula.</b> With unity peak gain ($|H(0)|^2 = 1$), the equivalent noise bandwidth is $$ B_N = \int_0^\infty |H(f)|^2\,df = \int_0^\infty \frac{df}{1+(f/f_c)^2} $$ the width of a brick-wall filter passing the same white-noise power.</p>
<p><b>Substitute.</b> Let $x = f/f_c$ so $df = f_c\,dx$: $$ B_N = f_c\int_0^\infty \frac{dx}{1+x^2} $$</p>
<p><b>Compute.</b> $\int_0^\infty dx/(1+x^2) = [\arctan x]_0^\infty = \pi/2$, so $B_N = f_c\cdot\pi/2 = \frac{\pi}{2}\times 1\ \text{MHz} = 1.571$ MHz.</p>
<p><b>Explanation.</b> A one-pole filter leaks noise through its gentle skirt, so it passes $\pi/2 \approx 1.57$ times more noise than its $-3$ dB bandwidth suggests. Using the 3 dB bandwidth instead of $B_N$ in a noise calculation would underestimate the noise power by about 2 dB.</p>` },
    { q: String.raw`A 2 Mbit/s polar NRZ signal has amplitude $A=1$ V over $50\,\Omega$. At what frequencies do the first two spectral nulls occur?`, solution: String.raw`<p><b>Formula.</b> Polar NRZ has PSD $S_x(f) = A^2 T_b\,\mathrm{sinc}^2(fT_b)$, whose nulls fall where the sinc argument is an integer: $$ f_n = \frac{n}{T_b} = n R_b, \qquad T_b = \frac{1}{R_b} $$ where $T_b$ is the bit period and $R_b$ the bit rate.</p>
<p><b>Substitute.</b> $$ T_b = \frac{1}{2\times10^6} = 0.5\ \mu\text{s}, \qquad f_n = n\times(2\times10^6) $$</p>
<p><b>Compute.</b> First null ($n=1$): 2 MHz; second null ($n=2$): 4 MHz.</p>
<p><b>Explanation.</b> The nulls sit at multiples of the bit rate, so the main lobe (0 to $R_b$) holds most of the energy but the sidelobes spill well beyond 2 MHz. This wide, slowly decaying spectrum is exactly why raw NRZ is bandwidth-hungry and why pulse shaping is applied to confine it. The $A=1$ V and $50\,\Omega$ set the absolute power level but do not move the null frequencies.</p>` },
    { q: String.raw`A spectrum analyzer set to RBW = 100 kHz reads a noise floor of $-90$ dBm. What is the noise PSD in dBm/Hz?`, solution: String.raw`<p><b>Formula.</b> $$ \text{PSD}_{dBm/Hz} = P_{read} - 10\log_{10}(\text{RBW}_{Hz}) $$ normalizing the power measured in the resolution bandwidth down to a 1 Hz reference.</p>
<p><b>Substitute.</b> $$ \text{PSD} = -90 - 10\log_{10}(100\times10^3) = -90 - 10\log_{10}(10^5) $$</p>
<p><b>Compute.</b> $10\log_{10}(10^5) = 50$ dB, so PSD $= -90 - 50 = -140$ dBm/Hz.</p>
<p><b>Explanation.</b> Normalizing to 1 Hz lets you compare against the ideal $-174$ dBm/Hz thermal floor; this reading sits 34 dB above it, revealing the analyzer's own front-end noise. Always ask "in what RBW?" before comparing noise numbers — the raw reading is meaningless without it.</p>` },
    { q: String.raw`A WSS process has autocorrelation $R_x(\tau) = 4e^{-2|\tau|}$. Find its PSD and total power.`, solution: String.raw`<p><b>Formula.</b> By Wiener–Khinchin, $S_x(f) = \mathcal{F}\{R_x(\tau)\}$, and the standard pair is $$ \mathcal{F}\{e^{-a|\tau|}\} = \frac{2a}{a^2+(2\pi f)^2}, \qquad P = R_x(0) $$ where $P$ is the total power (the autocorrelation at zero lag).</p>
<p><b>Substitute.</b> Here $R_x(\tau) = 4e^{-2|\tau|}$, so $a=2$: $$ S_x(f) = 4\cdot\frac{2(2)}{2^2+(2\pi f)^2}, \qquad P = 4e^{0} $$</p>
<p><b>Compute.</b> $S_x(f) = \dfrac{16}{4+(2\pi f)^2}$ W/Hz (a Lorentzian), and total power $P = R_x(0) = 4$ W.</p>
<p><b>Explanation.</b> The exponential autocorrelation means the signal decorrelates over a time scale $\sim 1/a$; its spectrum is a Lorentzian whose width is set by that same $a$. This exact shape describes RC-filtered noise and the line shape of many physical resonances — a slower decay (smaller $a$) gives a narrower spectrum, embodying the time–frequency duality of Wiener–Khinchin.</p>` }
  ],
  realWorld: String.raw`<p>Regulatory spectrum masks are specified entirely in PSD terms: the FCC and ETSI define maximum allowed power density (dBm/Hz or dBm in a reference bandwidth) at frequency offsets from a transmitter's center frequency. A Wi-Fi or 5G transmitter that fails its spectral emission mask — its measured PSD exceeding the template in the guard bands — cannot be certified, which is why pulse shaping and digital pre-distortion are essential to squeeze energy into the assigned channel.</p>
<p>In vibration analysis, radar, and biomedical signal processing, the Welch PSD estimate is the everyday workhorse for finding hidden periodicities in noisy data — from detecting a failing bearing's characteristic frequency in an accelerometer trace to identifying brainwave bands in an EEG. The Wiener–Khinchin bridge lets engineers work in whichever domain — autocorrelation or spectrum — is more convenient for the problem at hand.</p>`,
  related: [ 'noise', 'noise-floor', 'phase-noise', 'matched-filter', 'comm-basics' ]
},
{
  id: 'noise-floor',
  title: 'Noise Floor',
  category: 'Fundamentals',
  tags: [ 'noise-floor', 'sensitivity', 'ktb', 'snr', 'sfdr', 'link-budget' ],
  summary: String.raw`The noise floor is the total noise power a receiver presents at its output, referenced to the input, setting the minimum detectable signal and thus receiver sensitivity.`,
  prerequisites: [ 'noise', 'psd', 'comm-basics' ],
  intro: String.raw`<p>Why does this topic exist? Because before you can ask "will my receiver hear this signal?" you need a single number for how loud the background hiss is. The noise floor is that number. Without it, sensitivity, link budgets, and range are guesswork; with it, they become arithmetic. It turns the physics of noise into the one line every receiver design starts from.</p>
<p>The <strong>noise floor</strong> is the aggregate power of all noise present in a system within a given bandwidth — the "grass" on a spectrum analyzer beneath which no signal can be seen. It begins with the irreducible thermal floor $kTB$ ($-174$ dBm/Hz) and rises by the receiver's own added noise (its noise figure) and any external noise entering the antenna. Any signal must poke above this floor by the required signal-to-noise ratio to be usefully recovered.</p>
<p>Noise floor is the practical anchor of every sensitivity and link-budget calculation. It answers the question every RF engineer must answer: "What is the weakest signal my receiver can hear?" This topic assembles the pieces — thermal floor, bandwidth, noise figure, and required SNR — into the sensitivity equation, and distinguishes the true noise floor from related but different quantities like the analyzer's displayed average noise level and a converter's SFDR.</p>`,
  sections: [
    {
      h: 'Composition of the noise floor',
      html: String.raw`<p>The noise floor at a receiver input is the sum (in linear power) of several contributions, then translated by the receiver's gain and its own noise:</p>
<ul>
<li><strong>Thermal floor:</strong> $kTB$, the unavoidable baseline set by temperature and bandwidth ($-174$ dBm/Hz at 290 K).</li>
<li><strong>Receiver excess noise:</strong> quantified by the noise figure $NF$; the receiver raises the effective floor by $NF$ dB above thermal.</li>
<li><strong>External / antenna noise:</strong> galactic, atmospheric, man-made, and thermal noise picked up by the antenna, captured by an antenna noise temperature $T_A$.</li>
<li><strong>Phase noise and spurs (for some measurements):</strong> local-oscillator phase noise can raise the effective floor near a strong carrier.</li>
</ul>
<p>Combining the fixed thermal floor, the bandwidth, and the receiver noise figure gives the standard <strong>effective noise floor</strong> expression:</p>
$$ N_{floor}\ [\text{dBm}] = -174 + 10\log_{10}(B) + NF $$`
    },
    {
      h: 'Sensitivity: the minimum detectable signal',
      html: String.raw`<div class="callout tip"><strong>Intuition first:</strong> Picture the noise floor as the water level in a pool and your signal as a swimmer's head. To be "seen" (demodulated) the head must stick out of the water by a required margin — that margin is $\mathrm{SNR}_{min}$. Sensitivity is simply the water level plus that margin: lower the water (narrower band, better NF) or accept a smaller margin (coding gain) and you can hear fainter swimmers.</div>
<p>Now that you have the effective floor, receiver <strong>sensitivity</strong> is the weakest input signal that produces the minimum acceptable output SNR (or, equivalently, the required BER). It is the noise floor plus the required SNR:</p>
$$ S_{min}\ [\text{dBm}] = -174 + 10\log_{10}(B) + NF + \mathrm{SNR}_{min} $$
<p>Each term is a lever. Reducing bandwidth to the signal's minimum, lowering the noise figure with a good LNA, and reducing the required SNR through coding gain all improve (lower) sensitivity. This four-term equation is arguably the most-used formula in receiver engineering.</p>
<div class="callout"><strong>Worked intuition:</strong> A GPS receiver with $B\approx2$ MHz, $NF\approx2$ dB, needing $\mathrm{SNR}_{min}\approx-20$ dB (yes, negative — thanks to 43 dB of spreading processing gain) has $S_{min} = -174 + 63 + 2 - 20 = -129$ dBm. GPS signals arrive around $-130$ dBm, below the thermal floor in the occupied band — recoverable only because despreading collapses the bandwidth and lifts the signal.</div>`
    },
    {
      h: 'The minimum detectable signal vs the noise floor',
      html: String.raw`<p>It is a common misconception that a signal must exceed the noise floor to be detected. With sufficient processing gain (spread spectrum, long coherent integration) or powerful coding, signals <em>below</em> the in-band noise floor are routinely recovered — GPS and deep-space telemetry being prime examples. The correct statement is that the signal must exceed the floor <em>after</em> processing gain is applied, i.e. the post-correlation SNR must meet the demodulator's requirement.</p>`
    },
    {
      h: 'External and antenna noise',
      html: String.raw`<p>At lower frequencies (below ~1 GHz), external noise — galactic background, atmospheric, and man-made — often dominates the internal receiver noise, making an ultra-low-NF front end pointless. The <strong>system noise temperature</strong> referred to the antenna is</p>
$$ T_{sys} = T_A + T_e $$
<p>where $T_A$ is the antenna noise temperature (what the antenna "sees" — cold sky is a few K, warm ground/urban environment hundreds of K) and $T_e = T_0(F-1)$ is the receiver's equivalent noise temperature. Above a few GHz and pointing at cold sky, $T_A$ can be tiny, so receiver NF dominates; near the horizon or in cities, $T_A$ dominates.</p>`
    },
    {
      h: 'Displayed Average Noise Level (DANL) and instrument floors',
      html: String.raw`<p>On a spectrum analyzer, the <strong>DANL</strong> is the instrument's own noise floor with no signal applied, normalized to 1 Hz RBW. It combines the analyzer's front-end thermal floor and its noise figure. To measure a device's true noise floor you must ensure the DANL is well below it (typically 10+ dB), otherwise you measure the instrument, not the device. Narrowing RBW lowers the displayed floor (less bandwidth, less integrated noise) at the cost of slower sweeps.</p>
<div class="callout"><strong>Pitfall:</strong> The displayed noise floor drops 10 dB for every decade you reduce RBW — but this does not change the device's PSD. It is the same $-174$ dBm/Hz reality viewed through a narrower window.</div>`
    },
    {
      h: 'Noise floor in ADCs and digital receivers',
      html: String.raw`<p>In sampled systems the noise floor also includes <strong>quantization noise</strong>. An ideal $N$-bit ADC has SNR $=6.02N + 1.76$ dB across the Nyquist band. Because quantization noise (total power $\Delta^2/12$) spreads across the whole Nyquist bandwidth $f_s/2$, <strong>oversampling</strong> lowers the in-band noise floor by $10\log_{10}(\text{OSR})$ — the basis of the processing/oversampling gain that sigma-delta converters exploit heavily.</p>
<p>The digital noise floor thus combines analog thermal noise, converter thermal noise, quantization noise, and clock jitter. Jitter-induced noise grows with input frequency ($\sigma_{jitter}\cdot 2\pi f_{in}$), often dominating the floor for high-IF sampling.</p>`
    },
    {
      h: 'SFDR and dynamic range',
      html: String.raw`<p>The <strong>spurious-free dynamic range</strong> (SFDR) is the ratio between a full-scale signal and the largest spur (harmonic or intermod product) — distinct from the noise floor, which is the random background. Together they bound the usable dynamic range: the noise floor limits how weak a signal you can detect; SFDR limits how strong an interferer you can tolerate before its spurs masquerade as signals. A receiver's total dynamic range is the span from the noise floor up to the compression/intermod ceiling.</p>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<ul>
<li><strong>How the floor is built.</strong> Start at thermal $-174$ dBm/Hz, add the bandwidth term $10\log_{10}B$, add the noise figure $NF$ — that sum is the effective noise floor.</li>
<li><strong>The most-used receiver formula.</strong> Sensitivity $S_{min} = -174 + 10\log_{10}B + NF + \mathrm{SNR}_{min}$; each term is a lever you can pull.</li>
<li><strong>Below-the-floor is not undetectable.</strong> Processing gain (spreading, integration) lets signals like GPS at $-130$ dBm be recovered because post-correlation SNR is what must meet the requirement.</li>
<li><strong>External vs internal noise.</strong> Referred to the antenna, $T_{sys} = T_A + T_e$; below ~1 GHz or in cities the antenna's $T_A$ can dominate, making an ultra-low-NF LNA pointless.</li>
<li><strong>Instrument and digital floors.</strong> DANL scales with RBW (normalize to 1 Hz); in ADCs, quantization gives $6.02N+1.76$ dB, oversampling adds $10\log_{10}(\mathrm{OSR})$, and jitter dominates at high IF.</li>
<li><strong>Floor vs SFDR.</strong> The floor bounds weak-signal detection; SFDR bounds strong-interferer tolerance — together they set the usable dynamic range.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`Effective noise floor: $N_{floor} = -174 + 10\log_{10}(B) + NF$ dBm (thermal + bandwidth + noise figure).`,
    String.raw`Receiver sensitivity: $S_{min} = -174 + 10\log_{10}(B) + NF + \mathrm{SNR}_{min}$ dBm.`,
    String.raw`The four levers on sensitivity: narrow $B$, low $NF$ (good LNA), lower required SNR (coding gain), and cool the front end.`,
    String.raw`Signals below the in-band floor are still recoverable if processing gain lifts post-correlation SNR (e.g. GPS at $-130$ dBm).`,
    String.raw`System noise temperature referred to the antenna: $T_{sys} = T_A + T_e = T_A + T_0(F-1)$.`,
    String.raw`Below ~1 GHz and near the horizon/cities, external antenna noise $T_A$ dominates the receiver's own noise.`,
    String.raw`DANL is the analyzer's own floor (normalized to 1 Hz); reducing RBW lowers the displayed floor by $10\log_{10}$ without changing PSD.`,
    String.raw`Ideal $N$-bit ADC quantization SNR: $6.02N + 1.76$ dB over the Nyquist band.`,
    String.raw`Oversampling spreads quantization noise, improving in-band SNR by $10\log_{10}(\mathrm{OSR})$; clock jitter dominates at high IF.`,
    String.raw`Noise floor limits weak-signal detection; SFDR limits tolerance of strong interferers — together they set dynamic range.`
  ],
  diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<line x1="60" y1="210" x2="520" y2="210" stroke="#9aa7b5"/>
<line x1="60" y1="210" x2="60" y2="20" stroke="#9aa7b5"/>
<text x="30" y="115" transform="rotate(-90 30 115)" text-anchor="middle" fill="#9aa7b5">power (dBm)</text>
<line x1="60" y1="180" x2="520" y2="180" stroke="#4dabf7" stroke-dasharray="4 3"/>
<text x="330" y="174" fill="#4dabf7" font-size="9">thermal floor -174+10logB</text>
<line x1="60" y1="150" x2="520" y2="150" stroke="#ffa94d" stroke-dasharray="4 3"/>
<text x="330" y="144" fill="#ffa94d" font-size="9">+ NF = effective noise floor</text>
<line x1="60" y1="110" x2="520" y2="110" stroke="#63e6be" stroke-dasharray="4 3"/>
<text x="330" y="104" fill="#63e6be" font-size="9">Smin = floor + SNRmin (sensitivity)</text>
<rect x="150" y="60" width="16" height="150" fill="#b197fc"/>
<text x="158" y="52" text-anchor="middle" fill="#b197fc" font-size="9">signal</text>
<path d="M60,205 L90,203 L110,206 L130,202 L145,207 L170,204 L200,206 L240,203 L300,205 L360,204 L420,206 L480,203 L520,205" fill="none" stroke="#9aa7b5" stroke-width="1"/>
<text x="470" y="200" fill="#9aa7b5" font-size="8">noise "grass"</text>
<line x1="200" y1="110" x2="200" y2="150" stroke="#63e6be"/><text x="205" y="132" fill="#63e6be" font-size="8">SNRmin</text>
</g></svg>`,
      caption: 'Building the noise floor: thermal + NF sets the effective floor; sensitivity sits SNRmin above it.'
    },
    {
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<line x1="70" y1="175" x2="470" y2="175" stroke="#9aa7b5"/>
<line x1="70" y1="175" x2="70" y2="15" stroke="#9aa7b5"/>
<rect x="90" y="20" width="30" height="155" fill="#1c232e" stroke="#63e6be"/><text x="105" y="12" text-anchor="middle" fill="#63e6be" font-size="9">full scale</text>
<line x1="70" y1="140" x2="470" y2="140" stroke="#ffa94d" stroke-dasharray="4 3"/><text x="360" y="134" fill="#ffa94d" font-size="9">largest spur</text>
<line x1="70" y1="160" x2="470" y2="160" stroke="#4dabf7" stroke-dasharray="4 3"/><text x="360" y="155" fill="#4dabf7" font-size="9">noise floor</text>
<line x1="200" y1="20" x2="200" y2="140" stroke="#ffa94d"/><text x="205" y="80" fill="#ffa94d" font-size="9">SFDR</text>
<line x1="260" y1="20" x2="260" y2="160" stroke="#b197fc"/><text x="265" y="95" fill="#b197fc" font-size="9">dynamic range</text>
</g></svg>`,
      caption: 'Noise floor vs SFDR: the floor limits weak-signal detection, SFDR limits tolerance of strong signals.'
    }
  ],
  equations: [
    {
      title: 'Effective noise floor',
      tex: String.raw`$$ N_{floor} = -174 + 10\log_{10}(B) + NF \ [\text{dBm}] $$`,
      derivation: String.raw`<p>Start from the thermal PSD $kT_0 = -174$ dBm/Hz. Multiply by bandwidth (add $10\log_{10}B$ in dB) to get thermal power in band. The receiver adds noise, raising the floor by its noise figure $NF$ (dB). The sum is the effective noise floor referred to the input.</p>`
    },
    {
      title: 'Receiver sensitivity',
      tex: String.raw`$$ S_{min} = -174 + 10\log_{10}(B) + NF + \mathrm{SNR}_{min} $$`,
      derivation: String.raw`<p>A signal is detectable when its power exceeds the noise floor by the demodulator's required SNR. Adding $\mathrm{SNR}_{min}$ (dB) to the effective noise floor gives the minimum input signal power — the sensitivity.</p>`
    },
    {
      title: 'System noise temperature',
      tex: String.raw`$$ T_{sys} = T_A + T_e = T_A + T_0(F-1) $$`,
      derivation: String.raw`<p>Total system noise referred to the antenna terminals is the sum of what the antenna collects ($T_A$) and the receiver's added noise expressed as an equivalent temperature ($T_e = T_0(F-1)$). The system noise power is then $N = kT_{sys}B$.</p>`
    },
    {
      title: 'ADC quantization SNR',
      tex: String.raw`$$ \mathrm{SNR} = 6.02N + 1.76 \ \text{dB} $$`,
      derivation: String.raw`<p>An ideal $N$-bit ADC with full-scale range $V_{FS}$ has step $\Delta = V_{FS}/2^N$ and quantization-noise power $\Delta^2/12$ (uniform error). A full-scale sinusoid has power $V_{FS}^2/8$. The ratio is $\tfrac{V_{FS}^2/8}{\Delta^2/12} = \tfrac{3}{2}\cdot 2^{2N}$; in dB, $10\log_{10}(1.5) + 20N\log_{10}2 = 1.76 + 6.02N$.</p>`
    },
    {
      title: 'Oversampling processing gain',
      tex: String.raw`$$ \Delta\mathrm{SNR} = 10\log_{10}(\mathrm{OSR}) $$`,
      derivation: String.raw`<p>Quantization noise power $\Delta^2/12$ is fixed but spreads uniformly across the Nyquist band $f_s/2$. Sampling faster spreads the same noise over a wider band, so the in-band (signal-band) noise fraction is $B/(f_s/2) = 1/\mathrm{OSR}$. The in-band noise drops by $10\log_{10}(\mathrm{OSR})$, improving effective SNR/resolution.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`Write the effective noise floor formula.`, back: String.raw`$N_{floor} = -174 + 10\log_{10}(B) + NF$ dBm.` },
    { front: String.raw`Write the receiver sensitivity formula.`, back: String.raw`$S_{min} = -174 + 10\log_{10}(B) + NF + \mathrm{SNR}_{min}$ dBm.` },
    { front: String.raw`Can a signal below the noise floor be recovered?`, back: String.raw`Yes — with processing gain (spread spectrum, coherent integration) or coding, the post-processing SNR can exceed the requirement even when the raw in-band signal is below the floor (e.g. GPS).` },
    { front: String.raw`What is the system noise temperature?`, back: String.raw`$T_{sys} = T_A + T_e$: antenna noise temperature plus receiver equivalent noise temperature.` },
    { front: String.raw`When does external (antenna) noise dominate?`, back: String.raw`At lower frequencies (below ~1 GHz) and near the horizon/urban environments, where galactic and man-made noise exceed the receiver's internal noise.` },
    { front: String.raw`What is DANL?`, back: String.raw`Displayed Average Noise Level — a spectrum analyzer's own noise floor normalized to 1 Hz; must sit well below the device under test.` },
    { front: String.raw`How does reducing RBW affect the displayed noise floor?`, back: String.raw`It lowers it by $10\log_{10}$ of the bandwidth reduction, without changing the underlying PSD.` },
    { front: String.raw`Ideal N-bit ADC SNR?`, back: String.raw`$6.02N + 1.76$ dB over the Nyquist band.` },
    { front: String.raw`How does oversampling improve the noise floor?`, back: String.raw`Quantization noise spreads over a wider band; in-band noise drops by $10\log_{10}(\mathrm{OSR})$.` },
    { front: String.raw`Difference between noise floor and SFDR?`, back: String.raw`Noise floor is the random background limiting weak-signal detection; SFDR is the distance to the largest spur, limiting tolerance of strong signals.` },
    { front: String.raw`How to improve (lower) sensitivity?`, back: String.raw`Reduce bandwidth to the minimum needed, lower noise figure (good LNA), and reduce required SNR via coding gain.` },
    { front: String.raw`Why can't NF alone reduce the floor below thermal?`, back: String.raw`$NF \ge 0$ dB; the $-174$ dBm/Hz thermal term is a hard physical floor at 290 K, only reducible by cooling.` },
    { front: String.raw`What raises the ADC noise floor at high input frequency?`, back: String.raw`Clock jitter: jitter noise scales with $2\pi f_{in}\sigma_{jitter}$, often dominating for high-IF sampling.` },
    { front: String.raw`GPS signals arrive at roughly what power?`, back: String.raw`About $-130$ dBm, below the in-band thermal floor; recovered via ~43 dB of despreading processing gain.` }
  ],
  mcqs: [
    { q: String.raw`The effective noise floor of a receiver is:`, options: [ String.raw`$-174 + 10\log B$`, String.raw`$-174 + 10\log B + NF$`, String.raw`$-174 + NF$`, String.raw`$kTB$ only` ], answer: 1, explain: String.raw`Thermal floor plus bandwidth term plus the receiver noise figure.` },
    { q: String.raw`A receiver has B = 1 MHz, NF = 5 dB. Its noise floor is:`, options: [ String.raw`-114 dBm`, String.raw`-109 dBm`, String.raw`-119 dBm`, String.raw`-174 dBm` ], answer: 1, explain: String.raw`$-174 + 60 + 5 = -109$ dBm.` },
    { q: String.raw`Sensitivity is the noise floor plus:`, options: [ String.raw`the antenna gain`, String.raw`the required minimum SNR`, String.raw`the transmit power`, String.raw`the path loss` ], answer: 1, explain: String.raw`$S_{min} = N_{floor} + \mathrm{SNR}_{min}$.` },
    { q: String.raw`A signal below the in-band noise floor:`, options: [ String.raw`can never be detected`, String.raw`can be detected with sufficient processing gain`, String.raw`violates thermodynamics`, String.raw`requires a higher NF` ], answer: 1, explain: String.raw`Processing gain (e.g. GPS despreading) lifts post-correlation SNR above the requirement.` },
    { q: String.raw`Reducing RBW from 1 MHz to 1 kHz lowers the displayed noise floor by:`, options: [ String.raw`10 dB`, String.raw`30 dB`, String.raw`60 dB`, String.raw`3 dB` ], answer: 1, explain: String.raw`$10\log_{10}(10^6/10^3) = 30$ dB.` },
    { q: String.raw`An ideal 12-bit ADC has a Nyquist-band SNR of about:`, options: [ String.raw`62 dB`, String.raw`74 dB`, String.raw`50 dB`, String.raw`86 dB` ], answer: 1, explain: String.raw`$6.02(12)+1.76 = 74$ dB.` },
    { q: String.raw`Oversampling by a factor of 4 improves in-band SNR by:`, options: [ String.raw`3 dB`, String.raw`6 dB`, String.raw`12 dB`, String.raw`0 dB` ], answer: 1, explain: String.raw`$10\log_{10}(4) = 6$ dB.` },
    { q: String.raw`SFDR primarily limits:`, options: [ String.raw`weak-signal detection`, String.raw`tolerance of strong interferers`, String.raw`the thermal floor`, String.raw`the antenna temperature` ], answer: 1, explain: String.raw`SFDR sets how strong a signal can be before spurs mimic real signals.` },
    { q: String.raw`System noise temperature $T_{sys}$ equals:`, options: [ String.raw`$T_A - T_e$`, String.raw`$T_A + T_e$`, String.raw`$T_0 F$`, String.raw`$T_e$ only` ], answer: 1, explain: String.raw`Antenna plus receiver equivalent noise temperatures add.` },
    { q: String.raw`Below ~1 GHz near a city, the noise floor is often set by:`, options: [ String.raw`quantization noise`, String.raw`external/man-made noise`, String.raw`the LNA alone`, String.raw`clock jitter` ], answer: 1, explain: String.raw`External noise ($T_A$) dominates over receiver internal noise at low frequencies in noisy environments.` },
    { q: String.raw`The thermal floor at 290 K in a 1 Hz bandwidth is:`, options: [ String.raw`-114 dBm`, String.raw`-174 dBm`, String.raw`-84 dBm`, String.raw`0 dBm` ], answer: 1, explain: String.raw`$kT_0 = -174$ dBm/Hz.` },
    { q: String.raw`For high-IF sampling, the ADC noise floor is often dominated by:`, options: [ String.raw`quantization noise`, String.raw`clock jitter`, String.raw`thermal noise`, String.raw`DANL` ], answer: 1, explain: String.raw`Jitter noise scales with input frequency ($2\pi f_{in}\sigma_j$), dominating at high IF.` }
  ],
  numericals: [
    { q: String.raw`An LTE receiver has B = 10 MHz, NF = 7 dB, and needs SNR_min = 2 dB. Compute its sensitivity.`, solution: String.raw`<p><b>Formula.</b> $$ S_{min} = -174 + 10\log_{10}(B_{Hz}) + NF + \mathrm{SNR}_{min} $$ the four-term sensitivity equation: thermal density, bandwidth, receiver noise figure, and required SNR.</p>
<p><b>Substitute.</b> $$ S_{min} = -174 + 10\log_{10}(10^7) + 7 + 2 $$</p>
<p><b>Compute.</b> $10\log_{10}(10^7) = 70$ dB, so the noise floor is $-174 + 70 + 7 = -97$ dBm, and $S_{min} = -97 + 2 = -95$ dBm.</p>
<p><b>Explanation.</b> $-95$ dBm is roughly the reference sensitivity a real LTE handset must meet. Each term is a design lever: shrinking the band, improving the LNA's NF, or adding coding gain to relax $\mathrm{SNR}_{min}$ all push sensitivity lower and extend cell range.</p>` },
    { q: String.raw`A GPS receiver: B = 2 MHz, NF = 2 dB, processing gain 43 dB, demod needs 6 dB post-correlation SNR. Find the minimum detectable signal.`, solution: String.raw`<p><b>Formula.</b> $$ N_{floor} = -174 + 10\log_{10}(B) + NF, \qquad S_{min} = N_{floor} + (\mathrm{SNR}_{demod} - G_p) $$ where $G_p$ is the despreading processing gain, which relaxes the raw SNR the front-end must deliver.</p>
<p><b>Substitute.</b> $$ N_{floor} = -174 + 10\log_{10}(2\times10^6) + 2, \qquad S_{min} = N_{floor} + (6 - 43) $$</p>
<p><b>Compute.</b> $10\log_{10}(2\times10^6) = 63$ dB, so $N_{floor} = -174 + 63 + 2 = -109$ dBm. Required raw SNR $= 6 - 43 = -37$ dB, giving $S_{min} = -109 + (-37) = -146$ dBm.</p>
<p><b>Explanation.</b> The signal is allowed to sit 37 dB below the in-band noise floor because 43 dB of despreading gain lifts the post-correlation SNR to the 6 dB the demodulator needs. This is exactly why GPS works with signals near $-130$ dBm — well beneath the raw floor — and illustrates that "below the noise floor" is not the same as "undetectable."</p>` },
    { q: String.raw`A satellite ground station has antenna noise temperature $T_A = 30$ K and receiver noise temperature $T_e = 45$ K. Find $T_{sys}$ and the noise power in 36 MHz.`, solution: String.raw`<p><b>Formula.</b> $$ T_{sys} = T_A + T_e, \qquad N = kT_{sys}B $$ where $T_A$ is what the antenna "sees," $T_e$ the receiver's equivalent noise temperature, $k = 1.38\times10^{-23}$ J/K, and $B$ the bandwidth.</p>
<p><b>Substitute.</b> $$ T_{sys} = 30 + 45 = 75\ \text{K}, \qquad N = (1.38\times10^{-23})(75)(36\times10^6) $$</p>
<p><b>Compute.</b> $N = 3.73\times10^{-14}$ W. In dBm: $10\log_{10}(3.73\times10^{-14}/10^{-3}) = 10\log_{10}(3.73\times10^{-11}) = -104.3$ dBm.</p>
<p><b>Explanation.</b> Referring both contributions to the antenna via noise temperature makes them simply add, which is far cleaner than juggling noise figures here. A cold-sky $T_A$ of 30 K is what makes satellite downlinks viable — pointed at the warm ground, $T_A$ would be hundreds of kelvin and the floor much higher.</p>` },
    { q: String.raw`An ideal 14-bit ADC sampling at 100 MSPS is used to digitize a 1 MHz-wide signal. Find the effective in-band SNR including oversampling gain.`, solution: String.raw`<p><b>Formula.</b> $$ \mathrm{SNR}_{Nyq} = 6.02N + 1.76\ \text{dB}, \quad \mathrm{OSR} = \frac{f_s/2}{B}, \quad \mathrm{SNR}_{eff} = \mathrm{SNR}_{Nyq} + 10\log_{10}(\mathrm{OSR}) $$ where $N$ is the bit depth, $\mathrm{OSR}$ the oversampling ratio, and the last term the oversampling processing gain.</p>
<p><b>Substitute.</b> $$ \mathrm{SNR}_{Nyq} = 6.02(14)+1.76, \quad \mathrm{OSR} = \frac{50\ \text{MHz}}{1\ \text{MHz}} = 50, \quad \mathrm{SNR}_{eff} = 86.04 + 10\log_{10}(50) $$</p>
<p><b>Compute.</b> $\mathrm{SNR}_{Nyq} = 86.04$ dB; $10\log_{10}(50) = 17.0$ dB; $\mathrm{SNR}_{eff} = 86.04 + 17.0 = 103$ dB.</p>
<p><b>Explanation.</b> Sampling far faster than the signal needs spreads the fixed quantization noise across the whole 50 MHz Nyquist band, so only $1/50$ of it lands in the 1 MHz signal band — a free 17 dB of SNR. This oversampling gain is the principle sigma-delta converters push to the extreme to reach very high resolution.</p>` },
    { q: String.raw`A spectrum analyzer shows a device noise floor of $-95$ dBm at RBW = 30 kHz. Express the device PSD in dBm/Hz and compare to thermal.`, solution: String.raw`<p><b>Formula.</b> $$ \text{PSD}_{dBm/Hz} = P_{read} - 10\log_{10}(\text{RBW}_{Hz}) $$ normalizing the measured power down to a 1 Hz reference so it can be compared to the $-174$ dBm/Hz thermal density.</p>
<p><b>Substitute.</b> $$ \text{PSD} = -95 - 10\log_{10}(30\times10^3) $$</p>
<p><b>Compute.</b> $10\log_{10}(30\times10^3) = 44.77$ dB, so PSD $= -95 - 44.77 = -139.8$ dBm/Hz. This is $-139.8 - (-174) = 34.2$ dB above the thermal floor.</p>
<p><b>Explanation.</b> A device floor 34 dB above thermal implies a large effective noise figure or added noise somewhere in the measurement path — likely the analyzer's own front-end unless a preamp is used. This is why you check that the instrument's DANL sits well below the device under test before trusting the reading.</p>` }
  ],
  realWorld: String.raw`<p>Cellular base-station and handset compliance testing revolves around the noise floor. 3GPP reference-sensitivity tests inject a signal at the theoretical $S_{min}$ (computed from $kTB$ + NF + required SNR) and verify the throughput. A modem that fails by even 1 dB shrinks the effective cell radius by several percent, so RF teams fight for every fraction of a dB of noise figure in the LNA and every bit of bandwidth discipline in the filtering.</p>
<p>In radar and electronic warfare, the noise floor and SFDR together define the receiver's ability to see a small target return in the presence of a huge nearby clutter or jammer signal. A wideband digital receiver may have a superb thermal noise floor but be limited by ADC spurs (SFDR), so designers dither, calibrate, and select converters specifically to push spurs below the noise floor across the operating band.</p>`,
  related: [ 'noise', 'noise-figure', 'link-budget', 'adc', 'dsss' ]
},
{
  id: 'noise-figure',
  title: 'Noise Figure',
  category: 'Fundamentals',
  tags: [ 'noise-figure', 'noise-factor', 'friis', 'cascade', 'lna', 'noise-temperature' ],
  summary: String.raw`Noise figure quantifies how much a component degrades the signal-to-noise ratio; the Friis formula shows the first stage dominates a cascade, which is why the LNA comes first.`,
  prerequisites: [ 'noise', 'noise-floor' ],
  intro: String.raw`<p>Every real amplifier, mixer, or cable adds noise of its own, degrading the signal-to-noise ratio of whatever passes through it. <strong>Noise figure</strong> (NF) is the standardized measure of this degradation: it is the factor by which a component worsens the SNR, referenced to a source at the standard temperature $T_0 = 290$ K. A perfect noiseless component has NF = 0 dB; every real one is worse.</p>
<p>Noise figure is the currency of receiver front-end design. Through the <strong>Friis cascade formula</strong> it reveals a design principle of enormous practical importance: in a chain of components, the first stage's noise figure dominates the whole system, because later stages' noise is divided by the accumulated gain ahead of them. This is why the very first thing a signal meets after the antenna is a low-noise amplifier (LNA) — get the noise figure right there, and the rest of the receiver matters far less.</p>`,
  sections: [
    {
      h: 'Definition: noise factor and noise figure',
      html: String.raw`<p>The <strong>noise factor</strong> $F$ (linear) is defined as the ratio of input SNR to output SNR, with the input noise set to the thermal level at $T_0 = 290$ K:</p>
$$ F = \frac{\mathrm{SNR}_{in}}{\mathrm{SNR}_{out}} = \frac{S_{in}/N_{in}}{S_{out}/N_{out}} $$
<p>The <strong>noise figure</strong> is simply this in decibels: $NF = 10\log_{10}F$. Because any real device adds noise, $F \ge 1$ and $NF \ge 0$ dB. An equivalent view: $F$ measures the total output noise relative to the output noise that would arise from the amplified input (source) noise alone:</p>
$$ F = \frac{N_{out}}{G\,N_{in}} = \frac{G\,kT_0 B + N_{added}}{G\,kT_0 B} = 1 + \frac{N_{added}}{G\,kT_0 B} $$
<div class="callout"><strong>Key subtlety:</strong> The definition fixes the source temperature at $T_0 = 290$ K. If the actual source is colder or hotter, the observed SNR degradation differs, but the device's NF (a property of the device) is still quoted at 290 K. This standardization lets NF values be compared across the industry.</div>`
    },
    {
      h: 'Noise figure and noise temperature',
      html: String.raw`<p>Noise figure and equivalent noise temperature $T_e$ are two languages for the same thing — the extra noise a device adds, referred to its input:</p>
$$ F = 1 + \frac{T_e}{T_0}, \qquad T_e = T_0(F-1) $$
<p>Noise temperature is preferred for very-low-noise devices: a superb LNA of NF = 0.5 dB has $F = 1.122$, $T_e = 35$ K — a small, intuitive number, whereas comparing "0.5 dB vs 0.6 dB" hides how much difference (7 K) that really is. Cryogenic and radio-astronomy receivers are always specified in noise temperature.</p>`
    },
    {
      h: 'Noise figure of passive (lossy) components',
      html: String.raw`<p>A passive attenuator, cable, or filter at physical temperature $T_0$ has the elegant result that its noise figure equals its loss:</p>
$$ F = L \quad\Rightarrow\quad NF\ [\text{dB}] = L\ [\text{dB}] $$
<p>A 3 dB cable loss means a 3 dB noise figure. Intuitively, the attenuator drops the signal but the thermal noise reappears at its output at the same $kTB$ level, so SNR degrades exactly by the loss. This has a critical consequence: <strong>loss ahead of the LNA is catastrophic</strong> — a 2 dB feed cable before the amplifier adds 2 dB directly to the system noise figure, one-for-one.</p>`
    },
    {
      h: 'The Friis cascade formula',
      html: String.raw`<div class="callout tip"><strong>Intuition first:</strong> Imagine each stage shouting its own noise into the chain. A later stage's shout has to compete with the signal already amplified by everything before it — so the more gain sits in front of a stage, the quieter its shout sounds by comparison. That is the entire idea of the formula below: divide each stage's excess noise by the gain ahead of it, and the first stage, with nothing ahead of it, wins.</div>
<p>For a cascade of stages with individual noise factors $F_1, F_2, F_3, \dots$ and available power gains $G_1, G_2, \dots$ (linear), the total noise factor is</p>
$$ F_{total} = F_1 + \frac{F_2 - 1}{G_1} + \frac{F_3 - 1}{G_1 G_2} + \frac{F_4 - 1}{G_1 G_2 G_3} + \cdots $$
<p>The structure is the whole lesson: each stage's <em>excess</em> noise ($F_i - 1$) is divided by the product of all gains preceding it. If the first stage has high gain, the second term shrinks, the third shrinks even more, and so on. The first stage therefore dominates the total.</p>
<div class="callout"><strong>Design rule:</strong> Put a high-gain, low-NF amplifier first. Then $F_{total} \approx F_1$, and everything downstream — mixers, IF amps, filters, even a lossy ADC driver — contributes negligibly. This single principle shapes essentially every receiver architecture.</div>`
    },
    {
      h: 'Derivation of Friis for two stages',
      html: String.raw`<p>Consider two stages. Input noise is $N_{in} = kT_0B$. Stage 1 (gain $G_1$, factor $F_1$) outputs noise $N_1 = F_1 G_1 kT_0 B$ (by the definition $F=N_{out}/(G N_{in})$). Stage 2 amplifies that by $G_2$ and adds its own excess noise $(F_2-1)G_2 kT_0 B$:</p>
$$ N_{out} = G_2\,F_1 G_1 kT_0B + (F_2-1)G_2 kT_0 B $$
<p>The reference output noise (source noise amplified by both stages) is $G_1 G_2 kT_0 B$. Dividing:</p>
$$ F_{total} = \frac{N_{out}}{G_1 G_2 kT_0 B} = F_1 + \frac{F_2 - 1}{G_1} $$
<p>Extending stage by stage yields the full Friis formula.</p>`
    },
    {
      h: 'Measuring noise figure',
      html: String.raw`<p>The classic <strong>Y-factor method</strong> uses a calibrated noise source that switches between a "hot" ($T_h$) and "cold" ($T_c$) output. Measuring the output power ratio $Y = P_{hot}/P_{cold}$ lets you solve for the device's noise temperature:</p>
$$ T_e = \frac{T_h - Y\,T_c}{Y - 1} $$
<p>The noise source's <strong>Excess Noise Ratio</strong> (ENR) characterizes its hot/cold difference. Modern noise-figure analyzers automate this, but the Y-factor principle underlies them all. The <strong>gain method</strong> (cold-source) and <strong>direct-noise</strong> methods are alternatives, each with accuracy trade-offs; mismatch and instrument NF are the dominant error sources.</p>`
    },
    {
      h: 'Common pitfalls and edge cases',
      html: String.raw`<ul>
<li><strong>Loss before the LNA adds 1:1 to NF.</strong> Minimize connector and cable loss ahead of the first amplifier; use tower-top LNAs in base stations.</li>
<li><strong>Mixers have high NF (often ~= conversion loss).</strong> Passive mixers can have 6–8 dB NF, so an LNA must precede them.</li>
<li><strong>NF is defined at 290 K source.</strong> Antenna-referenced sensitivity uses $T_{sys}=T_A+T_e$, not NF directly, when $T_A \neq T_0$.</li>
<li><strong>Cascade order matters for both NF and linearity.</strong> High front-end gain helps NF but hurts dynamic range (drives later stages into compression) — a fundamental trade-off.</li>
<li><strong>NF applies to the whole bandwidth</strong>; spot-frequency NF can vary across the band.</li>
</ul>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<ul>
<li><strong>What NF measures.</strong> $F = \mathrm{SNR}_{in}/\mathrm{SNR}_{out}$ at a 290 K source; it is how much a stage degrades SNR, and $NF = 10\log_{10}F \ge 0$ dB.</li>
<li><strong>Two languages, one thing.</strong> $F = 1 + T_e/T_0$ links noise factor and noise temperature; use temperature for very-low-noise parts where fractional dB hides big differences.</li>
<li><strong>Passive loss is pure NF.</strong> A lossy component at $T_0$ has $NF = $ its loss in dB, so loss ahead of the LNA adds 1:1 to the system NF.</li>
<li><strong>The Friis lesson.</strong> $F_{tot} = F_1 + (F_2-1)/G_1 + \cdots$: each stage's excess noise is divided by preceding gain, so a high-gain low-NF first stage sets the whole system.</li>
<li><strong>The governing design rule.</strong> Put the LNA first and minimize everything before it — this single principle explains tower-top amplifiers and cryogenic front-ends.</li>
<li><strong>Measuring it.</strong> The Y-factor method turns a hot/cold power ratio into $T_e$ and hence NF; mismatch and instrument noise are the main error sources.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`Noise factor: $F = \mathrm{SNR}_{in}/\mathrm{SNR}_{out}$ with source at $T_0 = 290$ K; noise figure $NF = 10\log_{10}F$, so $F \ge 1$, $NF \ge 0$ dB.`,
    String.raw`Noise factor and temperature are interchangeable: $F = 1 + T_e/T_0$, $T_e = T_0(F-1)$.`,
    String.raw`A passive lossy component at $T_0$ has NF equal to its loss: 3 dB loss = 3 dB NF.`,
    String.raw`Friis cascade: $F_{total} = F_1 + \frac{F_2-1}{G_1} + \frac{F_3-1}{G_1 G_2} + \cdots$ (linear gains).`,
    String.raw`Each stage's excess noise is divided by the gain preceding it, so the first stage dominates — put a high-gain, low-NF LNA first.`,
    String.raw`Loss ahead of the LNA adds 1:1 (in dB) to system NF, since no gain protects it — minimize feed-cable loss.`,
    String.raw`Very-low-noise devices are quoted in noise temperature (e.g. $NF = 0.5$ dB gives $T_e \approx 35$ K).`,
    String.raw`Passive mixers have high NF (~conversion loss, 6-8 dB), so an LNA must precede them.`,
    String.raw`Y-factor method: $Y = P_{hot}/P_{cold}$ gives $T_e = (T_h - Y T_c)/(Y-1)$; the noise source's ENR sets the hot/cold difference.`,
    String.raw`High front-end gain lowers NF but hurts dynamic range by driving later stages toward compression.`
  ],
  diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr-noise-figure" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<g fill="#e6edf3" font-size="10" text-anchor="middle">
<path d="M20,70 l0,-20 l25,0 l0,40 l-25,0 z" fill="#1c232e" stroke="#63e6be"/><text x="10" y="95" font-size="8" fill="#63e6be">ant</text>
<rect x="70" y="50" width="70" height="40" rx="4" fill="#1c232e" stroke="#4dabf7"/><text x="105" y="66">LNA</text><text x="105" y="80" font-size="8">F1,G1 hi</text>
<rect x="170" y="50" width="70" height="40" rx="4" fill="#1c232e" stroke="#ffa94d"/><text x="205" y="66">Mixer</text><text x="205" y="80" font-size="8">F2,G2</text>
<rect x="270" y="50" width="70" height="40" rx="4" fill="#1c232e" stroke="#b197fc"/><text x="305" y="66">IF amp</text><text x="305" y="80" font-size="8">F3,G3</text>
<rect x="370" y="50" width="70" height="40" rx="4" fill="#1c232e" stroke="#ff6b6b"/><text x="405" y="66">ADC</text><text x="405" y="80" font-size="8">F4,G4</text>
<line x1="45" y1="70" x2="68" y2="70" stroke="#9aa7b5" marker-end="url(#arr-noise-figure)"/>
<line x1="140" y1="70" x2="168" y2="70" stroke="#9aa7b5" marker-end="url(#arr-noise-figure)"/>
<line x1="240" y1="70" x2="268" y2="70" stroke="#9aa7b5" marker-end="url(#arr-noise-figure)"/>
<line x1="340" y1="70" x2="368" y2="70" stroke="#9aa7b5" marker-end="url(#arr-noise-figure)"/>
<text x="270" y="130" fill="#9aa7b5" font-size="9">Ftot = F1 + (F2-1)/G1 + (F3-1)/G1G2 + ...</text>
<text x="270" y="148" fill="#63e6be" font-size="9">first stage dominates &#8594; put LNA first</text>
</g></svg>`,
      caption: 'Friis cascade: excess noise of each stage is divided by the gain preceding it, so the LNA dominates.'
    },
    {
      svg: String.raw`<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<text x="270" y="18" text-anchor="middle" fill="#e6edf3">SNR degradation through a noisy stage</text>
<line x1="60" y1="160" x2="240" y2="160" stroke="#9aa7b5"/>
<rect x="90" y="40" width="30" height="120" fill="#63e6be"/><text x="105" y="34" text-anchor="middle" fill="#63e6be" font-size="9">Sin</text>
<rect x="140" y="130" width="30" height="30" fill="#ff6b6b"/><text x="155" y="124" text-anchor="middle" fill="#ff6b6b" font-size="8">Nin</text>
<text x="150" y="178" text-anchor="middle" fill="#9aa7b5" font-size="9">input: high SNR</text>
<line x1="300" y1="160" x2="480" y2="160" stroke="#9aa7b5"/>
<rect x="330" y="50" width="30" height="110" fill="#63e6be"/><text x="345" y="44" text-anchor="middle" fill="#63e6be" font-size="9">Sout</text>
<rect x="380" y="110" width="30" height="50" fill="#ff6b6b"/><text x="395" y="104" text-anchor="middle" fill="#ff6b6b" font-size="8">Nout</text>
<text x="390" y="178" text-anchor="middle" fill="#9aa7b5" font-size="9">output: lower SNR</text>
<text x="270" y="90" text-anchor="middle" fill="#ffa94d" font-size="9">F = SNRin/SNRout</text>
</g></svg>`,
      caption: 'Noise figure measures how a stage worsens SNR by adding its own noise on top of the amplified input noise.'
    }
  ],
  equations: [
    {
      title: 'Noise factor definition',
      tex: String.raw`$$ F = \frac{\mathrm{SNR}_{in}}{\mathrm{SNR}_{out}} \Big|_{T_{src}=290\,\text{K}} $$`,
      derivation: String.raw`<p>By definition, noise factor is how much the SNR drops across the device, with the source noise standardized to $kT_0B$ at $T_0=290$ K. Writing SNR = signal/noise and noting the signal is scaled by gain $G$ while noise goes from $kT_0B$ to $N_{out}$, the signal cancels and $F = N_{out}/(G\,kT_0B)$.</p>`
    },
    {
      title: 'Noise factor to noise temperature',
      tex: String.raw`$$ F = 1 + \frac{T_e}{T_0} $$`,
      derivation: String.raw`<p>The added noise power referred to input is $N_{added}/G = kT_eB$. From $F = 1 + N_{added}/(G\,kT_0B) = 1 + kT_eB/(kT_0B) = 1 + T_e/T_0$. Rearranged, $T_e = T_0(F-1)$.</p>`
    },
    {
      title: 'Passive component noise figure',
      tex: String.raw`$$ F = L\ (\text{linear}), \quad NF_{dB} = \text{Loss}_{dB} $$`,
      derivation: String.raw`<p>A matched attenuator with loss $L$ at temperature $T_0$ outputs thermal noise $kT_0B$ (a resistor at $T_0$). The signal is reduced by $L$, but the output noise remains $kT_0B$. So $\mathrm{SNR}_{out} = \mathrm{SNR}_{in}/L$, giving $F=L$. In dB, noise figure equals the loss.</p>`
    },
    {
      title: 'Friis cascade formula',
      tex: String.raw`$$ F_{total} = F_1 + \frac{F_2-1}{G_1} + \frac{F_3-1}{G_1G_2} + \cdots $$`,
      derivation: String.raw`<p>Track noise through the chain: stage 1 outputs $F_1 G_1 kT_0B$; stage 2 adds excess $(F_2-1)kT_0B$ referred to its own input, i.e. divided by $G_1$ when referred to the system input. Summing all excess-noise contributions referred to the input and dividing by $kT_0B$ gives each term $(F_i-1)/\prod_{j<i}G_j$. Adding $F_1$ yields the formula.</p>`
    },
    {
      title: 'Y-factor noise temperature',
      tex: String.raw`$$ T_e = \frac{T_h - Y\,T_c}{Y-1}, \quad Y=\frac{P_{hot}}{P_{cold}} $$`,
      derivation: String.raw`<p>Output power is proportional to (source temp + device temp): $P_{hot}\propto (T_h + T_e)$, $P_{cold}\propto (T_c + T_e)$. Their ratio $Y = (T_h+T_e)/(T_c+T_e)$. Solving for $T_e$: $Y(T_c+T_e)=T_h+T_e \Rightarrow T_e(Y-1)=T_h-YT_c \Rightarrow T_e=(T_h-YT_c)/(Y-1)$.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`Define noise factor.`, back: String.raw`$F = \mathrm{SNR}_{in}/\mathrm{SNR}_{out}$ with source noise at $T_0=290$ K; noise figure is $10\log_{10}F$ dB.` },
    { front: String.raw`Relate noise factor and noise temperature.`, back: String.raw`$F = 1 + T_e/T_0$, so $T_e = T_0(F-1)$ with $T_0 = 290$ K.` },
    { front: String.raw`Noise figure of a lossy passive component at $T_0$?`, back: String.raw`Equal to its loss: 3 dB loss = 3 dB NF.` },
    { front: String.raw`State the Friis cascade formula.`, back: String.raw`$F_{tot} = F_1 + \frac{F_2-1}{G_1} + \frac{F_3-1}{G_1G_2} + \cdots$.` },
    { front: String.raw`Why does the first stage dominate the cascade NF?`, back: String.raw`Later stages' excess noise is divided by the gain preceding them; high first-stage gain suppresses their contribution.` },
    { front: String.raw`Why is loss before the LNA so damaging?`, back: String.raw`It adds directly (1:1 in dB) to the system noise figure since it has no gain to protect it.` },
    { front: String.raw`What is a minimum possible noise figure?`, back: String.raw`0 dB ($F=1$, $T_e=0$) — a perfectly noiseless component; real ones are always higher.` },
    { front: String.raw`Why quote LNAs in noise temperature?`, back: String.raw`For very low NF, temperature (e.g. 35 K) is more intuitive and resolves small differences hidden in fractional dB.` },
    { front: String.raw`What is the Y-factor method?`, back: String.raw`Measure output power with hot/cold calibrated noise source; $Y=P_h/P_c$ gives $T_e=(T_h-YT_c)/(Y-1)$.` },
    { front: String.raw`Typical NF of a passive mixer?`, back: String.raw`Roughly equal to its conversion loss, often 6–8 dB — hence an LNA precedes it.` },
    { front: String.raw`What temperature standardizes NF?`, back: String.raw`$T_0 = 290$ K (the IEEE reference source temperature).` },
    { front: String.raw`Trade-off of high front-end gain?`, back: String.raw`Improves NF but reduces dynamic range by driving later stages toward compression/intermod.` },
    { front: String.raw`Convert $T_e = 100$ K to noise figure.`, back: String.raw`$F = 1 + 100/290 = 1.345$; $NF = 10\log_{10}(1.345) = 1.29$ dB.` },
    { front: String.raw`What is ENR?`, back: String.raw`Excess Noise Ratio — characterizes a calibrated noise source's hot/cold output difference, used in Y-factor measurements.` }
  ],
  mcqs: [
    { q: String.raw`Noise figure is defined with the source at:`, options: [ String.raw`0 K`, String.raw`290 K`, String.raw`300 K`, String.raw`the device temperature` ], answer: 1, explain: String.raw`The IEEE standard reference source temperature is $T_0=290$ K.` },
    { q: String.raw`A 6 dB attenuator at room temperature has a noise figure of:`, options: [ String.raw`0 dB`, String.raw`3 dB`, String.raw`6 dB`, String.raw`depends on frequency` ], answer: 2, explain: String.raw`For passive matched loss, NF equals the loss in dB.` },
    { q: String.raw`In a cascade, which stage dominates the total noise figure?`, options: [ String.raw`the last`, String.raw`the first`, String.raw`the highest-gain`, String.raw`the mixer` ], answer: 1, explain: String.raw`Friis: later stages' noise is divided by preceding gain, so the first stage dominates.` },
    { q: String.raw`$T_e$ for a device with $F = 1.5$ is:`, options: [ String.raw`145 K`, String.raw`290 K`, String.raw`435 K`, String.raw`75 K` ], answer: 0, explain: String.raw`$T_e = T_0(F-1) = 290(0.5) = 145$ K.` },
    { q: String.raw`Loss placed ahead of the LNA:`, options: [ String.raw`is divided by later gain`, String.raw`adds 1:1 to system NF`, String.raw`has no effect`, String.raw`reduces NF` ], answer: 1, explain: String.raw`With no gain before it, its loss adds directly to the noise figure.` },
    { q: String.raw`Given F1=2, G1=100, F2=10: the second stage contributes to $F_{tot}$:`, options: [ String.raw`0.09`, String.raw`10`, String.raw`0.9`, String.raw`9` ], answer: 0, explain: String.raw`$(F_2-1)/G_1 = 9/100 = 0.09$.` },
    { q: String.raw`A noiseless ideal component has:`, options: [ String.raw`NF = 3 dB`, String.raw`NF = 0 dB, $T_e = 0$`, String.raw`$F = 0$`, String.raw`NF = -3 dB` ], answer: 1, explain: String.raw`$F=1 \Rightarrow NF = 0$ dB and $T_e = 0$ K.` },
    { q: String.raw`The Y-factor in noise-figure measurement is:`, options: [ String.raw`$P_{cold}/P_{hot}$`, String.raw`$P_{hot}/P_{cold}$`, String.raw`$T_h/T_c$`, String.raw`$F_1 G_1$` ], answer: 1, explain: String.raw`$Y = P_{hot}/P_{cold}$, the output power ratio for hot vs cold source.` },
    { q: String.raw`Why quote cryogenic LNAs in noise temperature rather than NF?`, options: [ String.raw`It is required by law`, String.raw`Small NF differences map to meaningful temperature differences`, String.raw`Temperature is dimensionless`, String.raw`NF cannot be negative` ], answer: 1, explain: String.raw`Fractions of a dB near 0 dB hide large fractional changes in added noise; $T_e$ makes them explicit.` },
    { q: String.raw`A passive mixer typically requires an LNA before it because:`, options: [ String.raw`it has negative gain and high NF`, String.raw`it is too linear`, String.raw`it adds no noise`, String.raw`its gain is infinite` ], answer: 0, explain: String.raw`Conversion loss gives it a high NF; preceding LNA gain suppresses its contribution.` },
    { q: String.raw`Increasing first-stage gain generally:`, options: [ String.raw`worsens NF, improves linearity`, String.raw`improves NF, worsens dynamic range`, String.raw`improves both`, String.raw`has no trade-off` ], answer: 1, explain: String.raw`More front-end gain suppresses downstream noise (better NF) but pushes later stages toward compression (worse dynamic range).` },
    { q: String.raw`Total NF of two identical 3 dB, 20 dB-gain stages is approximately:`, options: [ String.raw`3.0 dB`, String.raw`3.04 dB`, String.raw`6 dB`, String.raw`3.5 dB` ], answer: 1, explain: String.raw`$F=2$, $G=100$: $F_{tot}=2+(2-1)/100=2.01 \Rightarrow 10\log_{10}(2.01)=3.03$ dB.` }
  ],
  numericals: [
    { q: String.raw`A receiver front end: LNA (NF=1.5 dB, G=20 dB), mixer (NF=8 dB, G=-6 dB), IF amp (NF=4 dB, G=30 dB). Find the total noise figure.`, solution: String.raw`<p><b>Formula.</b> Friis cascade in linear terms: $$ F_{tot} = F_1 + \frac{F_2-1}{G_1} + \frac{F_3-1}{G_1 G_2}, \qquad NF_{tot} = 10\log_{10}F_{tot} $$ where each $F_i = 10^{NF_i/10}$ and $G_i = 10^{G_{i,dB}/10}$.</p>
<p><b>Substitute.</b> $F_1=10^{0.15}=1.413$, $G_1=100$; $F_2=10^{0.8}=6.31$, $G_2=10^{-0.6}=0.251$; $F_3=10^{0.4}=2.512$. $$ F_{tot} = 1.413 + \frac{6.31-1}{100} + \frac{2.512-1}{100\times0.251} $$</p>
<p><b>Compute.</b> $= 1.413 + 0.0531 + \dfrac{1.512}{25.1} = 1.413 + 0.0531 + 0.0602 = 1.526$, so $NF_{tot} = 10\log_{10}(1.526) = 1.84$ dB.</p>
<p><b>Explanation.</b> Despite the mixer's poor 8 dB NF, the 20 dB of LNA gain ahead of it divides its excess noise by 100, so the system NF lands just 0.34 dB above the LNA alone. This is the Friis lesson in action: get the first stage right and everything downstream is nearly irrelevant.</p>` },
    { q: String.raw`The same chain but with a 2 dB feed cable BEFORE the LNA. Find the new total NF.`, solution: String.raw`<p><b>Formula.</b> A passive lossy stage has $F_0 = L$ and gain $G_0 = 1/L$. Prepending it via Friis: $$ F_{tot} = F_0 + \frac{F_{rest}-1}{G_0} $$ where $F_{rest}$ is the noise factor of the rest of the chain from the previous problem.</p>
<p><b>Substitute.</b> Cable: $F_0 = 10^{0.2}=1.585$, $G_0 = 10^{-0.2}=0.631$; $F_{rest}=1.526$. $$ F_{tot} = 1.585 + \frac{1.526-1}{0.631} $$</p>
<p><b>Compute.</b> $= 1.585 + 0.834 = 2.419$, so $NF = 10\log_{10}(2.419) = 3.84$ dB.</p>
<p><b>Explanation.</b> The 1.84 dB chain became 3.84 dB — exactly 2 dB worse, matching the cable loss one-for-one. With no gain ahead of it to protect it, loss before the LNA adds directly to the system NF, which is precisely why base stations mount the LNA at the antenna and keep the feeder run behind it.</p>` },
    { q: String.raw`Convert a noise figure of 0.35 dB to noise temperature.`, solution: String.raw`<p><b>Formula.</b> $$ F = 10^{NF/10}, \qquad T_e = T_0(F-1) $$ where $NF$ is the noise figure (dB), $F$ the noise factor (linear), $T_0 = 290$ K the reference, and $T_e$ the equivalent noise temperature.</p>
<p><b>Substitute.</b> $$ F = 10^{0.35/10} = 10^{0.035}, \qquad T_e = 290(F-1) $$</p>
<p><b>Compute.</b> $F = 1.0839$; $T_e = 290(0.0839) = 24.3$ K.</p>
<p><b>Explanation.</b> A 0.35 dB NF is an excellent low-noise amplifier, and 24 K makes that concrete. Near 0 dB, fractions of a dB hide large fractional changes in added noise, so cryogenic and radio-astronomy front-ends are always specified in kelvin rather than dB.</p>` },
    { q: String.raw`A Y-factor measurement gives Y = 6 dB using a noise source with $T_h = 10000$ K, $T_c = 290$ K. Find $T_e$ and NF.`, solution: String.raw`<p><b>Formula.</b> $$ T_e = \frac{T_h - Y\,T_c}{Y-1}, \qquad F = 1 + \frac{T_e}{T_0}, \qquad NF = 10\log_{10}F $$ where $Y = P_{hot}/P_{cold}$ (linear) is the measured power ratio and $T_h, T_c$ are the source hot/cold temperatures.</p>
<p><b>Substitute.</b> $Y = 10^{6/10} = 3.981$. $$ T_e = \frac{10000 - 3.981(290)}{3.981-1} $$</p>
<p><b>Compute.</b> $T_e = \dfrac{10000-1154.5}{2.981} = \dfrac{8845.5}{2.981} = 2967$ K; then $F = 1 + 2967/290 = 11.23$ and $NF = 10\log_{10}(11.23) = 10.5$ dB.</p>
<p><b>Explanation.</b> The Y-factor turns two power readings (hot vs cold source) into the device's noise temperature. A larger $Y$ means a quieter device; this modest 6 dB $Y$ with a hot 10000 K source yields a fairly noisy 10.5 dB NF — sensible for something like a bare mixer. A higher-ENR source improves measurement resolution on low-noise devices.</p>` },
    { q: String.raw`A system needs total NF ≤ 2 dB. The LNA has NF = 1.2 dB. What minimum LNA gain keeps a following 12 dB-NF stage within budget?`, solution: String.raw`<p><b>Formula.</b> Solve Friis for the first-stage gain: $$ F_{tot} = F_1 + \frac{F_2-1}{G_1} \ \Rightarrow\ G_1 = \frac{F_2-1}{F_{tot}-F_1} $$ with all quantities linear.</p>
<p><b>Substitute.</b> $F_{tot}=10^{0.2}=1.585$; $F_1=10^{0.12}=1.318$; $F_2=10^{1.2}=15.85$. $$ 1.585 = 1.318 + \frac{15.85-1}{G_1} \ \Rightarrow\ G_1 = \frac{14.85}{1.585-1.318} $$</p>
<p><b>Compute.</b> $\dfrac{14.85}{0.267} = 55.6$ (linear) $= 10\log_{10}(55.6) = 17.4$ dB minimum LNA gain.</p>
<p><b>Explanation.</b> The LNA needs at least 17.4 dB of gain so its 100× division shrinks the noisy 12 dB stage's contribution to fit the 2 dB budget. This is the design flip-side of Friis: the first stage must supply enough gain, not just low noise, to shield the rest of the chain — the reason LNAs are specified with both.</p>` }
  ],
  realWorld: String.raw`<p>Cellular base stations place a tower-mounted amplifier (TMA/LNA) at the top of the mast, right at the antenna, precisely because of Friis: the long, lossy coaxial feeder run down the tower would otherwise add its several dB of loss directly to the system noise figure. By amplifying with a low-NF LNA before the cable, the feeder loss is divided by the LNA gain and becomes almost irrelevant — recovering coverage worth many decibels of link budget.</p>
<p>Radio telescopes and deep-space ground stations (like NASA's Deep Space Network 70 m dishes) use cryogenically cooled HEMT LNAs with noise temperatures of just a few kelvin, reaching system noise figures a small fraction of a dB. At these levels every component ahead of the LNA — even the feed horn and window — is engineered and sometimes cooled to avoid adding noise, because the received signals from spacecraft billions of kilometres away leave zero margin to spare.</p>`,
  related: [ 'noise', 'noise-floor', 'link-budget', 'sdr', 'phase-noise' ]
},
{
  id: 'phase-noise',
  title: 'Phase Noise',
  category: 'Fundamentals',
  tags: [ 'phase-noise', 'leeson', 'jitter', 'oscillator', 'dbc', 'reciprocal-mixing' ],
  summary: String.raw`Phase noise is the short-term random fluctuation of an oscillator's phase, described by Leeson's model and quantified as $\mathcal{L}(f)$ in dBc/Hz; it limits sensitivity, EVM, and adjacent-channel performance.`,
  prerequisites: [ 'psd', 'noise', 'comm-basics' ],
  intro: String.raw`<p>No oscillator produces a perfectly pure tone. A real signal source generates $v(t) = A\cos(2\pi f_0 t + \phi(t))$ where the phase $\phi(t)$ jitters randomly around its ideal value. This random phase fluctuation is <strong>phase noise</strong>. In the frequency domain it appears as "skirts" of power spreading out on either side of the carrier, rather than a clean spectral line. Its time-domain equivalent — the random variation of zero-crossing timing — is <strong>jitter</strong>.</p>
<p>Phase noise is one of the most consequential impairments in modern RF and high-speed digital systems. It degrades receiver sensitivity through reciprocal mixing, blurs constellation points (raising EVM) and thus caps the usable modulation order, corrupts Doppler measurements in radar, and limits the timing accuracy of clocks and data converters. Understanding its origin (Leeson's model), its metric ($\mathcal{L}(f)$ in dBc/Hz), and its relationship to jitter is essential for any oscillator, synthesizer, or converter design.</p>`,
  sections: [
    {
      h: 'Defining L(f) in dBc/Hz',
      html: String.raw`<p>The standard single-sideband phase-noise metric $\mathcal{L}(f)$ is the ratio of noise power in a 1 Hz bandwidth at an offset $f$ from the carrier, to the total carrier power, expressed in <strong>dBc/Hz</strong> (decibels relative to carrier, per hertz):</p>
$$ \mathcal{L}(f) = 10\log_{10}\!\left(\frac{P_{SSB}(f_0+f,\ 1\,\text{Hz})}{P_{carrier}}\right) $$
<p>For example, $\mathcal{L}(10\,\text{kHz}) = -100$ dBc/Hz means that 10 kHz away from the carrier, the noise power in each 1 Hz slice is 100 dB below the carrier. Phase noise is always plotted as $\mathcal{L}(f)$ versus offset frequency $f$ (log-log), sloping downward from the carrier and flattening into the far-out noise floor.</p>
<div class="callout"><strong>Relation to phase PSD:</strong> Under the small-angle approximation, $\mathcal{L}(f) = \tfrac{1}{2}S_\phi(f)$, where $S_\phi(f)$ is the one-sided PSD of the phase fluctuation in rad²/Hz. The factor $\tfrac12$ accounts for splitting phase-modulation power between the two sidebands.</div>`
    },
    {
      h: "Leeson's model and the spectrum slopes",
      html: String.raw`<div class="callout tip"><strong>Intuition first:</strong> An oscillator is an amplifier with noise, wrapped in a feedback loop tuned by a resonator. Near the carrier, the resonator strongly reacts to phase perturbations, amplifying close-in noise; far from the carrier it stops helping and you just see the flat amplifier noise floor. Add the device's own $1/f$ flicker noise near DC and you get the characteristic staircase of slopes. Leeson's formula below is exactly this picture — resonator term times flicker term times a thermal floor.</div>
<p>Leeson's semi-empirical model captures the characteristic shape of an oscillator's phase-noise spectrum by combining the resonator's filtering, the amplifier noise figure, and the device's flicker noise:</p>
$$ \mathcal{L}(f) = 10\log_{10}\!\left[\frac{FkT}{2P_s}\left(1+\left(\frac{f_0}{2Q_L f}\right)^2\right)\left(1+\frac{f_c}{f}\right)\right] $$
<p>where $F$ is the amplifier noise factor, $P_s$ the signal power at the sustaining stage, $Q_L$ the loaded quality factor, $f_0$ the carrier, and $f_c$ the flicker (1/f) corner. This produces the classic slope regions:</p>
<table class="data">
<tr><th>Region</th><th>Slope</th><th>Cause</th></tr>
<tr><td>Close-in (below $f_c$, inside $f_0/2Q$)</td><td>$-30$ dB/decade ($1/f^3$)</td><td>flicker noise up-converted by resonator</td></tr>
<tr><td>$1/f^2$ region</td><td>$-20$ dB/decade</td><td>white noise inside resonator bandwidth</td></tr>
<tr><td>$1/f$ region</td><td>$-10$ dB/decade</td><td>flicker noise outside resonator BW</td></tr>
<tr><td>Far-out floor</td><td>flat (0)</td><td>thermal (white) noise floor</td></tr>
</table>`
    },
    {
      h: 'Why high Q matters',
      html: String.raw`<p>The Leeson term $\left(\frac{f_0}{2Q_L f}\right)^2$ shows that phase noise inside the resonator half-bandwidth improves as $1/Q^2$ — a factor-of-10 higher $Q$ lowers close-in phase noise by 20 dB. This is why crystal (Q~$10^4$–$10^6$), SAW, dielectric-resonator, and cavity oscillators vastly outperform simple LC oscillators (Q~10–100). The eternal design tension: high-Q resonators are physically large and not easily tunable, so wideband synthesizers must build agility around an inherently high-Q, low-noise reference.</p>`
    },
    {
      h: 'Phase noise and jitter (time domain)',
      html: String.raw`<p>Phase noise and jitter are the same phenomenon in different domains. Integrating the phase-noise spectrum over an offset range gives the <strong>integrated phase jitter</strong> in radians (RMS), which converts to time jitter:</p>
$$ \phi_{rms} = \sqrt{2\int_{f_1}^{f_2}\mathcal{L}(f)\,df}\ \ (\text{rad}), \qquad t_{jitter} = \frac{\phi_{rms}}{2\pi f_0} $$
<p>The factor 2 converts single-sideband $\mathcal{L}$ to double-sideband phase power. This integrated jitter is what matters for data converters (aperture jitter), serial links (timing margin), and OFDM systems (common phase error and intercarrier interference). A clock with $-100$ dBc/Hz that looks "good" may still have unacceptable integrated jitter if its spectrum is broad.</p>`
    },
    {
      h: 'System impact: reciprocal mixing',
      html: String.raw`<p>The most insidious effect in receivers is <strong>reciprocal mixing</strong>. When a strong interferer sits near the desired weak signal, the local oscillator's phase-noise skirt mixes the interferer down onto the same IF as the wanted signal. Even a perfectly linear mixer cannot avoid this — the noise is on the LO itself. The interferer is effectively convolved with the LO phase-noise profile, raising the noise floor at the desired channel and degrading sensitivity in exactly the scenario (strong adjacent signals) where it hurts most.</p>
<div class="callout"><strong>Rule of thumb:</strong> The blocking dynamic range of a receiver is often set not by the mixer's linearity but by the synthesizer's phase noise at the interferer's offset. This drives stringent LO phase-noise specs in cellular and radar receivers.</div>`
    },
    {
      h: 'System impact: EVM and modulation order',
      html: String.raw`<p>Phase noise rotates each received constellation symbol by a random angle, spreading the points tangentially and increasing <strong>error vector magnitude</strong> (EVM). For an integrated RMS phase error $\phi_{rms}$ (radians), the phase-noise-induced EVM is approximately $\mathrm{EVM} \approx \phi_{rms}$ (for small angles). High-order QAM (256-QAM, 1024-QAM) packs points closely, so the tolerable phase error is tiny — 1024-QAM demands roughly $\phi_{rms} < 0.5^\circ$. Phase noise therefore places a hard ceiling on achievable spectral efficiency, independent of SNR.</p>
<p>In OFDM, phase noise causes two effects: a <strong>common phase error</strong> (a bulk rotation of all subcarriers, correctable with pilots) and <strong>intercarrier interference</strong> (ICI, the loss of subcarrier orthogonality, largely uncorrectable). The close-in phase noise causes CPE; the wider-offset phase noise causes ICI. This is why 5G mmWave, with its wide subcarriers and high frequencies, has demanding phase-noise requirements.</p>`
    },
    {
      h: 'Measurement and mitigation',
      html: String.raw`<p><strong>Measurement:</strong> Direct spectrum-analyzer measurement works for moderate phase noise but is limited by the analyzer's own LO. Better methods use a phase-detector/PLL cross-correlation technique (two independent references, correlate to cancel instrument noise) — the basis of dedicated phase-noise analyzers reaching very low floors.</p>
<p><strong>Mitigation:</strong> (1) Use the highest-Q resonator affordable; (2) maximize signal power $P_s$ in the sustaining stage (lowers the $FkT/2P_s$ term); (3) select low-flicker devices (SiGe, low $f_c$); (4) in a PLL, optimize the loop bandwidth — a wide loop lets the clean crystal reference suppress the noisy VCO close-in, while a narrow loop lets the VCO dominate far-out, so the crossover is chosen where reference and VCO noise are equal; (5) divide down from a low-noise high-frequency source (division reduces phase noise by $20\log_{10}N$ dB).</p>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<ul>
<li><strong>What phase noise is.</strong> Random short-term phase jitter of $v(t)=A\cos(2\pi f_0 t + \phi(t))$, seen as skirts around the carrier and, in time, as jitter.</li>
<li><strong>The metric.</strong> $\mathcal{L}(f)$ in dBc/Hz — noise in 1 Hz at offset $f$ relative to the carrier; small-angle, $\mathcal{L}(f) = \tfrac12 S_\phi(f)$.</li>
<li><strong>The spectrum's shape.</strong> Leeson gives the $1/f^3$, $1/f^2$, $1/f$, flat slope regions, and close-in noise improves as $1/Q^2$ — why high-Q crystals win.</li>
<li><strong>Time-domain equivalent.</strong> Integrate to $\phi_{rms} = \sqrt{2\int\mathcal{L}\,df}$, then $t_{jitter} = \phi_{rms}/(2\pi f_0)$; a good spot value can still hide bad integrated jitter.</li>
<li><strong>Why systems care.</strong> Reciprocal mixing raises the floor near blockers, EVM $\approx\phi_{rms}$ caps modulation order, and OFDM suffers common phase error plus intercarrier interference.</li>
<li><strong>Scaling and control.</strong> Multiplication degrades and division improves phase noise by $20\log_{10}N$; mitigate with high $Q$, high $P_s$, low flicker, and an optimized PLL loop bandwidth.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`Phase noise is random short-term phase fluctuation of $v(t) = A\cos(2\pi f_0 t + \phi(t))$, appearing as skirts around the carrier.`,
    String.raw`Metric $\mathcal{L}(f)$ in dBc/Hz: noise power in 1 Hz at offset $f$, relative to carrier power.`,
    String.raw`Small-angle relation to phase PSD: $\mathcal{L}(f) = \tfrac{1}{2}S_\phi(f)$ (power split between two sidebands).`,
    String.raw`Leeson slopes: $-30$ dB/dec ($1/f^3$) close-in, $-20$ dB/dec ($1/f^2$), $-10$ dB/dec ($1/f$), then flat far-out floor.`,
    String.raw`Close-in phase noise improves as $1/Q^2$: doubling loaded $Q$ gains 6 dB, tenfold gains 20 dB — hence high-Q crystals.`,
    String.raw`Integrated jitter: $\phi_{rms} = \sqrt{2\int_{f_1}^{f_2}\mathcal{L}(f)\,df}$ rad, then $t_{jitter} = \phi_{rms}/(2\pi f_0)$.`,
    String.raw`Reciprocal mixing: a strong interferer mixes with the LO phase-noise skirt onto the desired IF, raising the floor.`,
    String.raw`Phase noise rotates constellation points (EVM $\approx \phi_{rms}$), capping modulation order (1024-QAM needs $\phi_{rms} < 0.5^\circ$).`,
    String.raw`In OFDM it causes common phase error (pilot-correctable) and intercarrier interference (largely uncorrectable).`,
    String.raw`Frequency division by $N$ improves phase noise by $20\log_{10}N$ dB; multiplication degrades it by the same.`
  ],
  diagram: [
    {
      svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<line x1="60" y1="200" x2="520" y2="200" stroke="#9aa7b5"/>
<line x1="60" y1="200" x2="60" y2="20" stroke="#9aa7b5"/>
<text x="285" y="225" text-anchor="middle" fill="#9aa7b5">log offset frequency f</text>
<text x="28" y="110" transform="rotate(-90 28 110)" text-anchor="middle" fill="#9aa7b5">L(f) dBc/Hz</text>
<polyline points="80,40 180,100 320,150 430,175 520,178" fill="none" stroke="#4dabf7" stroke-width="2"/>
<text x="120" y="60" fill="#ff6b6b" font-size="9">-30 dB/dec (1/f³)</text>
<text x="230" y="118" fill="#ffa94d" font-size="9">-20 dB/dec (1/f²)</text>
<text x="360" y="165" fill="#b197fc" font-size="9">-10 dB/dec</text>
<text x="450" y="170" fill="#63e6be" font-size="9">flat floor</text>
<line x1="180" y1="200" x2="180" y2="100" stroke="#9aa7b5" stroke-dasharray="2 3"/><text x="180" y="213" text-anchor="middle" fill="#9aa7b5" font-size="8">fc</text>
<line x1="320" y1="200" x2="320" y2="150" stroke="#9aa7b5" stroke-dasharray="2 3"/><text x="320" y="213" text-anchor="middle" fill="#9aa7b5" font-size="8">f0/2Q</text>
</g></svg>`,
      caption: 'Leeson phase-noise spectrum: distinct slope regions from close-in flicker to the far-out thermal floor.'
    },
    {
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g fill="#e6edf3" font-size="10">
<text x="130" y="18" text-anchor="middle" fill="#63e6be">ideal carrier</text>
<line x1="40" y1="150" x2="230" y2="150" stroke="#9aa7b5"/>
<line x1="135" y1="150" x2="135" y2="35" stroke="#63e6be" stroke-width="2"/>
<text x="135" y="30" text-anchor="middle" fill="#9aa7b5" font-size="8">delta at f0</text>
<text x="410" y="18" text-anchor="middle" fill="#4dabf7">real oscillator</text>
<line x1="310" y1="150" x2="510" y2="150" stroke="#9aa7b5"/>
<path d="M320,150 C380,148 400,60 410,42 C420,60 440,148 500,150" fill="none" stroke="#4dabf7" stroke-width="2"/>
<line x1="410" y1="150" x2="410" y2="42" stroke="#4dabf7" stroke-width="2"/>
<text x="460" y="110" fill="#ffa94d" font-size="9">phase-noise skirts</text>
<text x="410" y="175" text-anchor="middle" fill="#9aa7b5" font-size="8">f0</text>
</g></svg>`,
      caption: 'Phase noise broadens the ideal spectral line into skirts of power around the carrier.'
    },
    {
      title: String.raw`phase-noise measurement chain`,
      svg: String.raw`<svg viewBox="0 0 540 175" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-phase-noise" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<g fill="#e6edf3" font-size="10" text-anchor="middle">
<rect x="8" y="60" width="96" height="46" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="56" y="80">DUT osc.</text><text x="56" y="94" font-size="8" fill="#9aa7b5">f0 + noise</text>
<rect x="128" y="60" width="96" height="46" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="176" y="80">Phase det.</text><text x="176" y="94" font-size="8" fill="#9aa7b5">vs ref (90&#176;)</text>
<rect x="248" y="60" width="96" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="296" y="80">Cross-corr</text><text x="296" y="94" font-size="8" fill="#9aa7b5">2 refs, avg</text>
<rect x="368" y="60" width="96" height="46" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="416" y="80">FFT / PSD</text><text x="416" y="94" font-size="8" fill="#9aa7b5">S_phi(f)</text>
<rect x="468" y="60" width="64" height="46" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="500" y="80">L(f)</text><text x="500" y="94" font-size="8" fill="#9aa7b5">dBc/Hz</text>
<line x1="104" y1="83" x2="126" y2="83" stroke="#9aa7b5" marker-end="url(#arr3-phase-noise)"/>
<line x1="224" y1="83" x2="246" y2="83" stroke="#9aa7b5" marker-end="url(#arr3-phase-noise)"/>
<line x1="344" y1="83" x2="366" y2="83" stroke="#9aa7b5" marker-end="url(#arr3-phase-noise)"/>
<line x1="464" y1="83" x2="466" y2="83" stroke="#9aa7b5" marker-end="url(#arr3-phase-noise)"/>
<rect x="128" y="20" width="96" height="26" rx="6" fill="#1c232e" stroke="#9aa7b5"/><text x="176" y="37" font-size="8" fill="#9aa7b5">clean reference</text>
<line x1="176" y1="46" x2="176" y2="58" stroke="#9aa7b5" marker-end="url(#arr3-phase-noise)"/>
<text x="270" y="140" font-size="8" fill="#9aa7b5">phase fluctuation &#8594; PSD &#8594; L(f) vs offset</text>
</g></svg>`,
      caption: String.raw`Measurement chain: mix the oscillator against a reference at quadrature, cross-correlate, and read L(f) versus offset.`
    }
  ],
  equations: [
    {
      title: 'Single-sideband phase noise',
      tex: String.raw`$$ \mathcal{L}(f) = 10\log_{10}\!\left(\frac{P_{SSB}(f_0+f,\,1\text{Hz})}{P_{carrier}}\right) $$`,
      derivation: String.raw`<p>Measure the noise power in a 1 Hz bandwidth at offset $f$ on one side of the carrier, and normalize to total carrier power. Taking $10\log_{10}$ gives dBc/Hz. It is a per-Hz power spectral density expressed relative to the carrier.</p>`
    },
    {
      title: 'Phase noise to phase PSD',
      tex: String.raw`$$ \mathcal{L}(f) = \tfrac{1}{2}\,S_\phi(f) $$`,
      derivation: String.raw`<p>Write $v(t)=A\cos(\omega_0 t+\phi(t))$. For small $\phi$, $v(t)\approx A\cos\omega_0 t - A\phi(t)\sin\omega_0 t$: the phase modulation appears as sidebands with power proportional to $S_\phi(f)$. Since the total phase-noise power splits equally into upper and lower sidebands, the single-sideband density is half the total: $\mathcal{L}(f)=\tfrac12 S_\phi(f)$.</p>`
    },
    {
      title: "Leeson's equation",
      tex: String.raw`$$ \mathcal{L}(f) = 10\log_{10}\!\left[\frac{FkT}{2P_s}\!\left(1+\!\left(\frac{f_0}{2Q_L f}\right)^{\!2}\right)\!\left(1+\frac{f_c}{f}\right)\right] $$`,
      derivation: String.raw`<p>The far-out thermal floor is set by amplifier noise $FkT$ relative to signal power $P_s$ (the $FkT/2P_s$ term, analogous to a noise figure). The resonator acts as a bandpass filter of half-bandwidth $f_0/2Q_L$; phase perturbations inside it are enhanced by the factor $(f_0/2Q_L f)^2$ (the $1/f^2$ slope). The device flicker noise adds the $(1+f_c/f)$ factor, steepening the close-in slope to $1/f^3$. Multiplying these gives Leeson's composite model.</p>`
    },
    {
      title: 'Integrated RMS phase jitter',
      tex: String.raw`$$ \phi_{rms} = \sqrt{2\int_{f_1}^{f_2}\mathcal{L}(f)\,df}\ \ \text{(rad)} $$`,
      derivation: String.raw`<p>The mean-square phase fluctuation is the integral of the phase PSD $S_\phi(f)=2\mathcal{L}(f)$ over the offset band of interest: $\phi_{rms}^2 = \int_{f_1}^{f_2} S_\phi df = 2\int_{f_1}^{f_2}\mathcal{L}(f)df$. Taking the square root gives the RMS phase in radians. ($\mathcal{L}(f)$ here is the linear ratio, not dB.)</p>`
    },
    {
      title: 'Phase jitter to time jitter',
      tex: String.raw`$$ t_{jitter} = \frac{\phi_{rms}}{2\pi f_0} $$`,
      derivation: String.raw`<p>A phase error $\phi$ corresponds to a timing error $\Delta t$ via $\phi = 2\pi f_0 \Delta t$ (one full cycle $2\pi$ takes period $1/f_0$). Solving, $\Delta t = \phi/(2\pi f_0)$; applying to the RMS phase gives the RMS time jitter.</p>`
    },
    {
      title: 'Phase noise reduction by frequency division',
      tex: String.raw`$$ \Delta\mathcal{L} = 20\log_{10}(N)\ \text{dB (improvement)} $$`,
      derivation: String.raw`<p>Dividing a signal's frequency by $N$ divides its phase by $N$ as well ($\phi_{out}=\phi_{in}/N$). Phase-noise power scales as phase squared, so it drops by $N^2$, i.e. $20\log_{10}N$ dB. (Conversely, multiplication by $N$ degrades phase noise by $20\log_{10}N$ dB.)</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What is phase noise?`, back: String.raw`Random short-term fluctuation of an oscillator's phase, appearing as noise skirts around the carrier; its time-domain form is jitter.` },
    { front: String.raw`What are the units of $\mathcal{L}(f)$?`, back: String.raw`dBc/Hz — noise power in a 1 Hz bandwidth at offset $f$, relative to carrier power.` },
    { front: String.raw`Relate $\mathcal{L}(f)$ to phase PSD.`, back: String.raw`$\mathcal{L}(f)=\tfrac12 S_\phi(f)$ (small-angle), splitting phase power between the two sidebands.` },
    { front: String.raw`State Leeson's key dependencies.`, back: String.raw`Phase noise falls with higher $Q_L$ (as $1/Q^2$ inside the resonator BW), higher signal power $P_s$, and lower amplifier NF $F$ and flicker corner $f_c$.` },
    { front: String.raw`Slope of the close-in phase noise region?`, back: String.raw`$-30$ dB/decade ($1/f^3$), from flicker noise up-converted through the resonator.` },
    { front: String.raw`Why do high-Q oscillators have low phase noise?`, back: String.raw`The Leeson $(f_0/2Q f)^2$ term makes phase noise improve as $1/Q^2$ inside the resonator half-bandwidth.` },
    { front: String.raw`What is reciprocal mixing?`, back: String.raw`A strong interferer mixes with the LO's phase-noise skirt, landing on the desired IF and raising the effective noise floor — degrading sensitivity in the presence of blockers.` },
    { front: String.raw`How does phase noise affect QAM?`, back: String.raw`It rotates constellation points, raising EVM; high-order QAM tolerates only tiny RMS phase error, capping spectral efficiency.` },
    { front: String.raw`Two OFDM effects of phase noise?`, back: String.raw`Common phase error (bulk rotation, pilot-correctable) and intercarrier interference (loss of orthogonality, largely uncorrectable).` },
    { front: String.raw`How to compute time jitter from phase noise?`, back: String.raw`Integrate to get $\phi_{rms}=\sqrt{2\int\mathcal{L}df}$, then $t_{jitter}=\phi_{rms}/(2\pi f_0)$.` },
    { front: String.raw`Effect of frequency division by N on phase noise?`, back: String.raw`Improves it by $20\log_{10}N$ dB (multiplication degrades by the same).` },
    { front: String.raw`Best measurement technique for very low phase noise?`, back: String.raw`Cross-correlation with two independent references, which averages away the instruments' own uncorrelated noise.` },
    { front: String.raw`How does PLL loop bandwidth shape phase noise?`, back: String.raw`Inside the loop BW the clean reference dominates (suppresses VCO); outside it the VCO dominates. Optimum crossover is where reference and VCO noise are equal.` },
    { front: String.raw`Why is 5G mmWave sensitive to phase noise?`, back: String.raw`High carrier frequencies multiply up reference phase noise, and wide subcarriers plus high-order modulation make ICI and EVM effects severe.` }
  ],
  mcqs: [
    { q: String.raw`Phase noise $\mathcal{L}(f)$ is expressed in:`, options: [ String.raw`dBm`, String.raw`dBc/Hz`, String.raw`dB`, String.raw`rad` ], answer: 1, explain: String.raw`It is noise power per Hz relative to the carrier — dBc/Hz.` },
    { q: String.raw`The close-in ($1/f^3$) region of an oscillator spectrum slopes at:`, options: [ String.raw`-10 dB/decade`, String.raw`-20 dB/decade`, String.raw`-30 dB/decade`, String.raw`0 dB/decade` ], answer: 2, explain: String.raw`$1/f^3$ corresponds to $-30$ dB/decade, from up-converted flicker noise.` },
    { q: String.raw`Doubling resonator Q lowers close-in phase noise by about:`, options: [ String.raw`3 dB`, String.raw`6 dB`, String.raw`12 dB`, String.raw`20 dB` ], answer: 1, explain: String.raw`Phase noise scales as $1/Q^2$: doubling Q gives $20\log_{10}(2)=6$ dB.` },
    { q: String.raw`Reciprocal mixing degrades sensitivity when:`, options: [ String.raw`the signal is very strong`, String.raw`a strong interferer sits near the desired signal`, String.raw`the LO is perfectly clean`, String.raw`bandwidth is reduced` ], answer: 1, explain: String.raw`The interferer mixes with the LO phase-noise skirt onto the desired IF.` },
    { q: String.raw`Relation between $\mathcal{L}(f)$ and phase PSD $S_\phi(f)$:`, options: [ String.raw`$\mathcal{L}=2S_\phi$`, String.raw`$\mathcal{L}=S_\phi$`, String.raw`$\mathcal{L}=\tfrac12 S_\phi$`, String.raw`$\mathcal{L}=S_\phi^2$` ], answer: 2, explain: String.raw`Single-sideband $\mathcal{L}$ is half the two-sided phase power density.` },
    { q: String.raw`Multiplying a source frequency by 10 changes phase noise by:`, options: [ String.raw`+10 dB`, String.raw`+20 dB`, String.raw`-20 dB`, String.raw`0 dB` ], answer: 1, explain: String.raw`Multiplication by N degrades phase noise by $20\log_{10}N = 20$ dB for N=10.` },
    { q: String.raw`Which most limits achievable modulation order (e.g. 1024-QAM)?`, options: [ String.raw`thermal noise only`, String.raw`integrated phase noise (EVM)`, String.raw`antenna gain`, String.raw`cable loss` ], answer: 1, explain: String.raw`Tightly packed constellations demand very low RMS phase error; phase noise caps the order regardless of SNR.` },
    { q: String.raw`Time jitter relates to RMS phase by:`, options: [ String.raw`$t = \phi_{rms} f_0$`, String.raw`$t = \phi_{rms}/(2\pi f_0)$`, String.raw`$t = 2\pi f_0/\phi_{rms}$`, String.raw`$t = \phi_{rms}^2$` ], answer: 1, explain: String.raw`$\phi = 2\pi f_0 t \Rightarrow t = \phi/(2\pi f_0)$.` },
    { q: String.raw`In a PLL, inside the loop bandwidth the dominant phase-noise source is:`, options: [ String.raw`the VCO`, String.raw`the reference`, String.raw`thermal only`, String.raw`the divider spurs` ], answer: 1, explain: String.raw`The loop tracks and cleans the VCO to the reference inside the loop BW, so the reference dominates there.` },
    { q: String.raw`Cross-correlation phase-noise measurement helps by:`, options: [ String.raw`increasing carrier power`, String.raw`averaging out the instruments' uncorrelated noise`, String.raw`narrowing the resonator`, String.raw`removing flicker noise from the DUT` ], answer: 1, explain: String.raw`Two independent references correlate; their uncorrelated noise averages toward zero, lowering the measurement floor.` },
    { q: String.raw`The far-out phase-noise floor is set primarily by:`, options: [ String.raw`flicker noise`, String.raw`resonator Q`, String.raw`thermal/white noise ($FkT/2P_s$)`, String.raw`the tuning voltage` ], answer: 2, explain: String.raw`Beyond the resonator bandwidth and flicker corner, the spectrum flattens at the thermal noise floor.` },
    { q: String.raw`In OFDM, intercarrier interference from phase noise is caused mainly by:`, options: [ String.raw`close-in phase noise`, String.raw`wider-offset phase noise breaking subcarrier orthogonality`, String.raw`the cyclic prefix`, String.raw`the FFT size only` ], answer: 1, explain: String.raw`Phase noise at offsets comparable to subcarrier spacing spreads energy into neighboring subcarriers (ICI).` }
  ],
  numericals: [
    { q: String.raw`An oscillator has $\mathcal{L}(f) = -80$ dBc/Hz flat from 1 kHz to 100 kHz (approximating). Estimate the integrated RMS phase jitter over that band.`, solution: String.raw`<p><b>Formula.</b> $$ \phi_{rms} = \sqrt{2\int_{f_1}^{f_2}\mathcal{L}(f)\,df} $$ where $\mathcal{L}(f)$ is the linear (not dB) single-sideband phase noise; the factor 2 converts single-sideband to total phase power. For flat $\mathcal{L}$ the integral is just $\mathcal{L}\,(f_2-f_1)$.</p>
<p><b>Substitute.</b> $\mathcal{L} = 10^{-80/10} = 10^{-8}$ /Hz. $$ \phi_{rms}^2 = 2(10^{-8})(10^5 - 10^3) = 2(10^{-8})(9.9\times10^4) $$</p>
<p><b>Compute.</b> $\phi_{rms}^2 = 1.98\times10^{-3}\ \text{rad}^2$, so $\phi_{rms} = \sqrt{1.98\times10^{-3}} = 0.0445$ rad $= 2.55^\circ$.</p>
<p><b>Explanation.</b> A single spot value like $-80$ dBc/Hz tells you little on its own; integrating over the offset band gives the RMS phase error that actually degrades a modulated link. At 2.55° RMS this oscillator is fine for low-order modulation but far too noisy for dense QAM, where budgets are a fraction of a degree.</p>` },
    { q: String.raw`Using the result above at a 10 GHz carrier, find the RMS time jitter.`, solution: String.raw`<p><b>Formula.</b> $$ t_{jitter} = \frac{\phi_{rms}}{2\pi f_0} $$ where $\phi_{rms}$ is the integrated RMS phase (radians) and $f_0$ the carrier frequency, since one full cycle of $2\pi$ radians spans a period $1/f_0$.</p>
<p><b>Substitute.</b> $$ t_{jitter} = \frac{0.0445}{2\pi\times10^{10}} = \frac{0.0445}{6.283\times10^{10}} $$</p>
<p><b>Compute.</b> $t_{jitter} = 7.08\times10^{-13}$ s $= 0.71$ ps RMS.</p>
<p><b>Explanation.</b> Sub-picosecond jitter is the natural currency for clocking high-speed data converters and serial links, where this timing uncertainty directly eats into the sampling aperture and timing margin. The same phase noise converts to smaller time jitter at higher carrier frequencies, which is why the relationship always carries $f_0$.</p>` },
    { q: String.raw`A 100 MHz reference has $\mathcal{L} = -150$ dBc/Hz at 10 kHz offset. It is multiplied to 10 GHz. What is the phase noise at 10 kHz offset (ideal multiplier)?`, solution: String.raw`<p><b>Formula.</b> $$ N = \frac{f_{out}}{f_{in}}, \qquad \mathcal{L}_{out} = \mathcal{L}_{in} + 20\log_{10}(N) $$ where frequency multiplication by $N$ multiplies the phase by $N$, so phase-noise power rises by $N^2$, i.e. $20\log_{10}N$ dB.</p>
<p><b>Substitute.</b> $$ N = \frac{10\ \text{GHz}}{100\ \text{MHz}} = 100, \qquad \mathcal{L}_{out} = -150 + 20\log_{10}(100) $$</p>
<p><b>Compute.</b> $20\log_{10}(100) = 40$ dB, so $\mathcal{L}_{out} = -150 + 40 = -110$ dBc/Hz at 10 kHz offset (ideal multiplier).</p>
<p><b>Explanation.</b> Multiplying up to reach high carrier frequencies inevitably raises phase noise by $20\log_{10}N$ — 40 dB here. This is the fundamental reason mmWave synthesizers struggle: a superb reference is degraded by large multiplication ratios, so the reference must be exceptionally clean to leave usable margin at the output.</p>` },
    { q: String.raw`A receiver sees a desired signal at -100 dBm and an interferer at -30 dBm offset 1 MHz away. If the LO phase noise at 1 MHz offset is -130 dBc/Hz and the channel bandwidth is 200 kHz, find the reciprocal-mixing noise power in the desired channel.`, solution: String.raw`<p><b>Formula.</b> $$ P_{RM} = P_{int} + \mathcal{L}(f) + 10\log_{10}(B) $$ where $P_{int}$ is the interferer power (dBm), $\mathcal{L}(f)$ the LO phase noise at that offset (dBc/Hz), and $B$ the channel bandwidth — the interferer's power is convolved with the LO's per-Hz noise skirt and integrated over the channel.</p>
<p><b>Substitute.</b> $$ P_{RM} = -30 + (-130) + 10\log_{10}(200\times10^3) $$</p>
<p><b>Compute.</b> $10\log_{10}(2\times10^5) = 53.0$ dB, so $P_{RM} = -30 - 130 + 53.0 = -107$ dBm.</p>
<p><b>Explanation.</b> This reciprocal-mixed noise sits only 7 dB below the $-100$ dBm wanted signal, so it dominates the thermal floor and cripples SNR. The link is phase-noise limited, not thermal limited — no amount of LNA improvement helps; only cleaner LO phase noise at the interferer's offset does. This is why blocking specs drive synthesizer phase-noise requirements.</p>` },
    { q: String.raw`A 1024-QAM link requires total RMS EVM below 1.5%. If thermal noise already contributes 1.0% EVM, what is the maximum allowable phase-noise-induced RMS phase error (degrees)?`, solution: String.raw`<p><b>Formula.</b> Independent error sources add in power (RMS): $$ \mathrm{EVM}_{tot}^2 = \mathrm{EVM}_{th}^2 + \mathrm{EVM}_{pn}^2 \ \Rightarrow\ \mathrm{EVM}_{pn} = \sqrt{\mathrm{EVM}_{tot}^2 - \mathrm{EVM}_{th}^2} $$ and for small angles the phase-noise EVM equals the RMS phase error: $\mathrm{EVM}_{pn} \approx \phi_{rms}$ (radians).</p>
<p><b>Substitute.</b> $$ \mathrm{EVM}_{pn} = \sqrt{1.5^2 - 1.0^2} = \sqrt{2.25 - 1.0} $$</p>
<p><b>Compute.</b> $\mathrm{EVM}_{pn} = \sqrt{1.25} = 1.118\% = 0.01118$ rad. Converting: $\phi_{rms} = 0.01118\times(180/\pi) = 0.64^\circ$.</p>
<p><b>Explanation.</b> The synthesizer's integrated phase jitter must stay below about $0.64^\circ$ RMS — an extremely tight budget that dense 1024-QAM demands. Because thermal noise already spends most of the EVM allowance, phase noise, not SNR, becomes the binding constraint that decides whether the top modulation order is usable at all.</p>` }
  ],
  realWorld: String.raw`<p>In modern cellular and Wi-Fi radios, phase noise is often the gatekeeper for the highest modulation orders. When 5G NR or Wi-Fi 7 advertise 1024-QAM or 4096-QAM, achieving them in practice hinges on synthesizer phase noise: the constellation points are so tightly packed that even a fraction of a degree of RMS phase error collapses the link. RF vendors publish integrated phase-jitter specs precisely because they, not thermal SNR, determine whether the top MCS levels are usable — especially at mmWave, where reference phase noise is multiplied up by large factors.</p>
<p>In radar and electronic warfare, phase noise limits the detection of slow-moving targets. A target's Doppler return sits close to the huge stationary-clutter return; if the transmitter/LO phase-noise skirt at that Doppler offset exceeds the target return, the target is buried. This is why coherent radars use ultra-low-phase-noise sources (often oven-controlled crystal oscillators multiplied with careful filtering, or sapphire-loaded cavity oscillators) — the achievable sub-clutter visibility is set directly by $\mathcal{L}(f)$ at the Doppler offsets of interest.</p>`,
  related: [ 'psd', 'noise', 'pll', 'evm', 'sdr' ]
}
);
