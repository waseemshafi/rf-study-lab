/* bpsk-vs-dbpsk.js — "BPSK vs DBPSK" topic (Modulation & Detection).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no dollar-then-brace sequence.
   Every SVG marker/def id is prefixed "bpsk-vs-dbpsk-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'bpsk-vs-dbpsk',
    title: 'BPSK vs DBPSK',
    category: 'Modulation & Detection',
    tags: ['BPSK', 'DBPSK', 'DPSK', 'differential encoding', 'phase ambiguity', 'carrier recovery', 'error propagation', 'coherent', 'differentially coherent'],
    summary: String.raw`BPSK carries one bit per symbol on antipodal phases (0/180 deg) and needs an absolute carrier-phase reference (Costas/squaring loop), achieving the optimal AWGN bit-error rate $P_b=Q(\sqrt{2E_b/N_0})$. DBPSK encodes each bit in the phase CHANGE between consecutive symbols via differential encoding $d_k=b_k\oplus d_{k-1}$ and detects it by comparing successive symbol phases, so it needs no absolute phase reference, inherently resolves the 180-deg ambiguity, but pays about 0.8 to 1 dB and suffers paired bit errors.`,
    prerequisites: ['bpsk', 'dbpsk', 'matched-filter'],
    intro: String.raw`<p><strong>Why does DBPSK exist at all when BPSK is already the most power-efficient binary scheme?</strong> BPSK is provably optimal in additive white Gaussian noise: antipodal signalling puts the two constellation points as far apart as a fixed energy allows, so no binary modulation beats its bit-error rate. But that optimality comes with a hidden bill. To tell a $0^\circ$ symbol from a $180^\circ$ symbol you must know, absolutely, which way is "$0^\circ$" — you need a carrier-phase reference locked to the transmitter. Recovering that reference from a suppressed-carrier signal (a Costas or squaring loop) is hardware, it takes time to acquire, and it comes with a nasty twist: the recovered phase is ambiguous by exactly $180^\circ$. Lock onto the wrong one and every bit inverts. DBPSK is the engineering answer to "what if I do not want to pay for, or cannot afford to wait for, an absolute phase reference?"</p>
<p>The trick is to stop caring about absolute phase and encode information in the <em>change</em> of phase between one symbol and the next. If two consecutive symbols have the same phase, that is one bit value; if they differ by $180^\circ$, that is the other. Now the receiver never needs to know which absolute phase is "$0^\circ$" — it only needs the phase to stay roughly constant across two adjacent symbols so it can compare them. This is <strong>differential encoding</strong>, $d_k=b_k\oplus d_{k-1}$, and its <strong>differentially coherent</strong> detection. The $180^\circ$ ambiguity that plagues BPSK simply vanishes, because a global phase flip changes both compared symbols equally and cancels.</p>
<p>Nothing is free. Using the <em>previous, noisy</em> symbol as your phase reference means noise enters twice, so DBPSK's bit-error rate $P_b=\tfrac12 e^{-E_b/N_0}$ sits about $0.8$ to $1$ dB worse than BPSK at useful SNR, and a single symbol error tends to corrupt <em>two</em> bits (error pairing). This topic derives both BER curves from scratch, works the differential encoder and decoder truth tables, quantifies the $\sim1$ dB penalty and the error-doubling factor, and lays out exactly when you trade that decibel for a simpler, faster-acquiring, ambiguity-immune receiver — the reason DBPSK shows up in 802.11 1 Mbps, Bluetooth, and countless low-cost links.</p>`,
    sections: [
      {
        h: 'Why compare them: absolute versus relative phase',
        html: String.raw`<p><strong>Why put these two side by side?</strong> Because they are the same constellation used two completely different ways, and the choice between them is one of the most common real design decisions in a binary link. Both transmit exactly one bit per symbol on the two antipodal phases $0^\circ$ and $180^\circ$; the waveforms on the wire can be bit-for-bit identical. What differs is the <em>meaning</em> assigned to a phase and therefore what the receiver must know.</p>
<ul>
<li><strong>BPSK reads absolute phase.</strong> The bit is the phase itself: $0^\circ\to$ bit $0$, $180^\circ\to$ bit $1$ (or the reverse). The receiver must possess a phase reference that agrees with the transmitter, and it must resolve which of the two locked phases is the true $0^\circ$.</li>
<li><strong>DBPSK reads relative phase.</strong> The bit is the transition: "no change" $\to$ one value, "$180^\circ$ change" $\to$ the other. The receiver compares each symbol to the one before it and never needs an absolute reference.</li>
</ul>
<p>That single distinction — absolute versus relative — propagates into everything: carrier-recovery hardware, acquisition speed, phase-ambiguity behaviour, bit-error rate, and how errors cluster. The rest of this topic follows each consequence in turn.</p>
<div class="callout"><strong>Intuition:</strong> BPSK is like reading a compass — you need to know where true north is. DBPSK is like giving directions as "turn or go straight" — you never need north, only what changed since the last step.</div>`
      },
      {
        h: 'BPSK: antipodal signalling and its optimal BER',
        html: String.raw`<p>BPSK maps a bit onto one of two antipodal waveforms, $s_0(t)=+\sqrt{2E_b/T_b}\cos(2\pi f_c t)$ and $s_1(t)=-\sqrt{2E_b/T_b}\cos(2\pi f_c t)$, i.e. a $180^\circ$ phase flip. In signal space these are two points at $\pm\sqrt{E_b}$ on a single axis, separated by the maximum possible distance $d=2\sqrt{E_b}$ for energy $E_b$. The optimal (matched-filter, minimum-distance) receiver correlates the received waveform against the carrier, samples once per symbol, and compares to a threshold at zero.</p>
<p>Because the error distance is maximal, BPSK attains the best binary BER in AWGN:</p>
<p>$$P_b^{\text{BPSK}}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)=\tfrac12\,\mathrm{erfc}\!\left(\sqrt{\frac{E_b}{N_0}}\right).$$</p>
<p>The catch is <strong>coherent detection</strong>: the correlation reference $\cos(2\pi f_c t)$ must be phase-aligned to the incoming carrier. BPSK is a <em>suppressed-carrier</em> signal (the $\pm1$ data removes any discrete carrier line to lock onto), so the phase must be regenerated by a nonlinear carrier-recovery loop. That recovery is the entire cost that DBPSK sets out to avoid.</p>
<div class="callout tip"><strong>Tip:</strong> whenever you see $Q(\sqrt{2E_b/N_0})$, read it as "antipodal / maximum-distance / best-possible binary." Every other binary scheme is measured as a decibel penalty against this line.</div>`
      },
      {
        h: 'The 180-degree phase ambiguity problem',
        html: String.raw`<p>Carrier recovery for a suppressed-carrier BPSK signal works by removing the data modulation nonlinearly — a squaring loop squares the signal (turning $\pm\cos$ into $\cos^2$, whose double-frequency term has a recoverable line), and a Costas loop locks using the $I\!\cdot\!Q$ product. Both share an unavoidable defect: the operation is <em>insensitive to a global $180^\circ$ flip</em> of the carrier. Squaring maps both $+\cos$ and $-\cos$ to the same thing; the Costas error signal is unchanged if you add $\pi$ to the reference. So the loop locks happily to <em>either</em> the true phase <em>or</em> its $180^\circ$ inverse, with no way to tell which.</p>
<p>If it locks to the inverse, the demodulator interprets every $0^\circ$ symbol as $180^\circ$ and vice versa — <strong>every decoded bit is inverted</strong>. Worse, a momentary phase slip can flip the lock mid-stream, inverting the data from that point on. A raw BPSK link therefore cannot be trusted until the ambiguity is resolved. The two standard fixes are:</p>
<ul>
<li><strong>Unique word / preamble:</strong> transmit a known synchronisation pattern; if it comes out inverted, flip the whole stream.</li>
<li><strong>Differential encoding on top of BPSK:</strong> encode data in transitions so a global inversion leaves the decoded bits unchanged — the same idea that defines DBPSK, here used purely to kill the ambiguity while still detecting coherently.</li>
</ul>
<div class="callout"><strong>Key point:</strong> the $180^\circ$ ambiguity is not a bug you can design away in the loop — it is fundamental to any data-driven suppressed-carrier recovery. You either resolve it with side information (unique word) or sidestep it with differential coding.</div>`
      },
      {
        h: 'DBPSK: differential encoding and differentially coherent detection',
        html: String.raw`<p>DBPSK removes the need for an absolute reference by encoding each data bit in the phase <em>transition</em>. The <strong>differential encoder</strong> keeps a running reference bit and forms the transmitted symbol bit as</p>
<p>$$d_k=b_k\oplus d_{k-1},$$</p>
<p>where $b_k$ is the data bit, $d_{k-1}$ the previous transmitted bit, $\oplus$ exclusive-OR, and $d_{-1}$ a chosen initial reference (commonly $0$ or $1$). The bit $d_k$ then drives an ordinary BPSK modulator: $d_k=0\to0^\circ$, $d_k=1\to180^\circ$ (a convention). Equivalently, a data $1$ forces a $180^\circ$ phase change from the previous symbol, and a data $0$ forces "no change."</p>
<p>The <strong>differentially coherent receiver</strong> never estimates absolute phase. It multiplies each received symbol by the (conjugate of the) <em>previous</em> received symbol and looks at the sign of the result: same phase $\to$ positive $\to$ decoded data $0$; opposite phase $\to$ negative $\to$ decoded data $1$. Algebraically the decision is</p>
<p>$$\hat b_k=\hat d_k\oplus\hat d_{k-1},$$</p>
<p>the differential decoder, which exactly inverts the encoder. Because the reference for symbol $k$ is symbol $k-1$ of the <em>same</em> received signal, any slowly varying channel phase (and any global $180^\circ$ flip) is common to both and cancels in the comparison.</p>
<table class="data">
<tr><th>$b_k$ (data)</th><th>$d_{k-1}$ (prev)</th><th>$d_k=b_k\oplus d_{k-1}$</th><th>Phase change</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>none (0 deg)</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>none (0 deg)</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>180 deg flip</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>180 deg flip</td></tr>
</table>
<div class="callout tip"><strong>Tip:</strong> read the table by phase change, not by $d_k$: whenever the data bit is $1$ the phase flips, whenever it is $0$ the phase holds — regardless of the previous state. That is the whole point of differential encoding.</div>`
      },
      {
        h: 'DBPSK bit-error rate and the ~1 dB penalty',
        html: String.raw`<p>Differentially coherent DBPSK has a famously clean closed-form BER in AWGN:</p>
<p>$$P_b^{\text{DBPSK}}=\tfrac12\,e^{-E_b/N_0}.$$</p>
<p>Compare it to BPSK's $Q(\sqrt{2E_b/N_0})$. Both fall off roughly as $e^{-E_b/N_0}$ at high SNR, but the DBPSK curve is shifted right — it needs a bit more energy for the same BER. The gap is small and <em>shrinks</em> with SNR: about $1.1$ dB at $P_b=10^{-3}$, <strong>$0.9$ dB at $10^{-4}$</strong>, and $0.65$ dB by $10^{-6}$ — hence the usual quoted figure of <strong>$0.8$ to $1$ dB</strong> at practical error rates. The physical reason is that the differentially coherent decision uses a <em>noisy</em> symbol (the previous one) as its phase reference instead of a clean regenerated carrier, so noise effectively enters the decision twice; the reference degradation costs that fraction of a decibel.</p>
<p>It is worth distinguishing two "differential" flavours often conflated:</p>
<ul>
<li><strong>Differentially coherent DBPSK</strong> (no carrier recovery, previous-symbol reference): $P_b=\tfrac12 e^{-E_b/N_0}$, the $\sim1$ dB story above.</li>
<li><strong>Coherently detected, differentially encoded BPSK</strong> (full carrier recovery, differential coding used only to kill the $180^\circ$ ambiguity): BER is roughly $2Q(\sqrt{2E_b/N_0})$ — essentially BPSK but with errors doubled by the differential decoder, a much smaller penalty than the $1$ dB.</li>
</ul>
<table class="data">
<tr><th>Scheme</th><th>Detection</th><th>Approx. BER</th><th>Penalty vs BPSK</th></tr>
<tr><td>BPSK</td><td>coherent</td><td>$Q(\sqrt{2E_b/N_0})$</td><td>0 dB (reference)</td></tr>
<tr><td>Diff-encoded BPSK</td><td>coherent</td><td>$\approx 2Q(\sqrt{2E_b/N_0})$</td><td>small (error doubling)</td></tr>
<tr><td>DBPSK</td><td>differentially coherent</td><td>$\tfrac12 e^{-E_b/N_0}$</td><td>$\sim0.8$ to $1$ dB</td></tr>
</table>`
      },
      {
        h: 'Error propagation: why DBPSK errors come in pairs',
        html: String.raw`<p>The differential decoder $\hat b_k=\hat d_k\oplus\hat d_{k-1}$ combines <em>two</em> received symbols. So a single wrong received symbol $\hat d_j$ enters two adjacent decoded bits: $\hat b_j=\hat d_j\oplus\hat d_{j-1}$ and $\hat b_{j+1}=\hat d_{j+1}\oplus\hat d_j$. Flip $\hat d_j$ and both of those XORs flip — <strong>one symbol error produces two bit errors</strong>, an adjacent pair. This is <em>error propagation</em>, but it is mercifully limited: because each decoded bit depends only on the current and immediately previous symbol, the damage does not cascade forever; it is bounded to the pair straddling the corrupted symbol.</p>
<p>The practical effect is an <strong>error-multiplication factor of about 2</strong> in the decoded bit stream relative to the raw symbol-decision error rate. That doubling is already baked into the $\tfrac12 e^{-E_b/N_0}$ figure for differentially coherent DBPSK, but it becomes explicit and separable in the coherently-detected differentially-encoded case, where $\text{BER}\approx 2\,P_{\text{sym}}$ with $P_{\text{sym}}=Q(\sqrt{2E_b/N_0})$ (the factor tends to exactly $2$ at high SNR, when isolated single-symbol errors dominate).</p>
<div class="callout"><strong>Consequence for coding:</strong> because DBPSK errors arrive in adjacent pairs rather than independently, a downstream FEC or interleaver should not assume memoryless bit errors. Bit interleaving before the code, or codes tolerant of double-error bursts, restores the independence the decoder assumes.</div>`
      },
      {
        h: 'Carrier recovery, acquisition speed, and complexity trade',
        html: String.raw`<p>The deepest practical difference is in the receiver front end. <strong>BPSK demands a carrier-recovery loop</strong> — a Costas or squaring loop that regenerates carrier phase from the suppressed-carrier signal, plus an ambiguity-resolution mechanism. That loop must <em>acquire</em> (pull in and lock) before any data is valid, which takes time proportional to the loop bandwidth and adds settling latency; it can lose lock and cycle-slip under phase noise or dynamics; and it is real silicon and power.</p>
<p><strong>DBPSK needs none of it.</strong> The reference for each symbol is simply the previous symbol, available instantly — there is no loop to acquire, no lock to lose, no ambiguity to resolve. This buys three things: (1) <em>fast acquisition</em> — the receiver is "locked" from the first pair of symbols, ideal for short bursts and packet radios; (2) <em>robustness to phase slips and phase noise</em> — a slow phase drift cancels in the symbol-to-symbol comparison; and (3) <em>lower complexity, cost, and power</em>. The price, as established, is $\sim1$ dB of $E_b/N_0$ and paired errors.</p>
<table class="data">
<tr><th>Property</th><th>BPSK (coherent)</th><th>DBPSK (differentially coherent)</th></tr>
<tr><td>Carrier phase reference</td><td>absolute, recovered by loop</td><td>none (previous symbol)</td></tr>
<tr><td>Receiver complexity</td><td>higher (Costas/squaring loop)</td><td>lower (one-symbol delay + multiply)</td></tr>
<tr><td>Acquisition speed</td><td>slower (loop must lock)</td><td>fast (instant, per-symbol)</td></tr>
<tr><td>180 deg phase ambiguity</td><td>present; needs unique word / diff coding</td><td>inherently resolved</td></tr>
<tr><td>BER in AWGN</td><td>$Q(\sqrt{2E_b/N_0})$ (optimal)</td><td>$\tfrac12 e^{-E_b/N_0}$ ($\sim1$ dB worse)</td></tr>
<tr><td>Error pattern</td><td>independent bit errors</td><td>errors in adjacent pairs</td></tr>
<tr><td>Phase-noise / slip tolerance</td><td>sensitive; can invert on slip</td><td>tolerant; drift cancels</td></tr>
</table>`
      },
      {
        h: 'When to choose which',
        html: String.raw`<p>The decision reduces to what you value more: the last decibel of power efficiency, or a simpler, faster, more forgiving receiver.</p>
<ul>
<li><strong>Choose BPSK</strong> when link budget is tight and every decibel counts (deep-space, satellite, long-haul), when a carrier loop is affordable and the connection is long-lived so acquisition time amortises, and when you can resolve the $180^\circ$ ambiguity with a preamble or light differential coding. BPSK is the power-optimal choice.</li>
<li><strong>Choose DBPSK</strong> for short bursts and packets where acquisition latency dominates (you cannot spend symbols locking a loop), for low-cost / low-power radios where the carrier-recovery hardware is unwelcome, for channels with significant phase noise or rapid phase perturbation where an absolute reference is hard to hold, and whenever the $\sim1$ dB penalty is affordable. This is why <strong>802.11 1 Mbps (DBPSK)</strong> and <strong>Bluetooth</strong>-class links lean differential.</li>
</ul>
<p>A common hybrid captures the best of both: <em>coherently detect</em> for the full $Q(\sqrt{2E_b/N_0})$ BER but <em>differentially encode</em> so the receiver's inevitable $180^\circ$ ambiguity is resolved automatically — paying only the small error-doubling penalty rather than the full $1$ dB.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>BPSK and DBPSK are one constellation used two ways — absolute-phase versus relative-phase. You should now be able to say:</p>
<ul>
<li><strong>The signalling:</strong> both send one bit per symbol on antipodal $0^\circ/180^\circ$ phases; BPSK's bit is the absolute phase, DBPSK's bit is the phase <em>change</em> between consecutive symbols via $d_k=b_k\oplus d_{k-1}$.</li>
<li><strong>The reference:</strong> BPSK needs an absolute carrier-phase reference from a Costas/squaring loop; DBPSK uses the previous received symbol and needs no carrier recovery.</li>
<li><strong>The ambiguity:</strong> suppressed-carrier recovery is inherently ambiguous by $180^\circ$, inverting all BPSK bits; DBPSK cancels a global flip in its symbol-to-symbol comparison, resolving it for free.</li>
<li><strong>The performance:</strong> BPSK achieves the optimal $P_b=Q(\sqrt{2E_b/N_0})$; DBPSK gives $P_b=\tfrac12 e^{-E_b/N_0}$, about $0.8$ to $1$ dB worse because its reference is a noisy symbol.</li>
<li><strong>The error pattern:</strong> the differential decoder XORs two symbols, so one symbol error yields a pair of adjacent bit errors (error-multiplication factor $\approx2$), which downstream coding must anticipate.</li>
<li><strong>The choice:</strong> BPSK for maximum power efficiency on long-lived, link-budget-limited connections; DBPSK for fast-acquiring, low-cost, phase-noise-tolerant burst/packet links where $\sim1$ dB is affordable.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Phase-shift_keying" target="_blank" rel="noopener">Wikipedia — Phase-shift keying</a> — canonical reference with dedicated BPSK and differential PSK (DPSK/DBPSK) sections, the differential encoding rule, demodulation structures, and the BER formulas $Q(\sqrt{2E_b/N_0})$ and $\tfrac12 e^{-E_b/N_0}$ side by side.</li>
<li><a href="https://ocw.mit.edu/courses/6-450-principles-of-digital-communication-i-fall-2009/pages/lecture-notes/" target="_blank" rel="noopener">MIT OCW 6.450 — Principles of Digital Communication I (lecture notes, Gallager)</a> — graduate lecture slides deriving passband modulation, matched-filter/optimal detection, and the signal-space geometry behind antipodal BPSK's optimality and differential detection's penalty.</li>
<li><a href="https://www.gaussianwaves.com/2017/11/coherent-detection-of-differentially-encoded-bpsk-debpsk/" target="_blank" rel="noopener">GaussianWaves — Differentially encoded BPSK: coherent detection</a> — a hands-on tutorial with MATLAB/Python that shows differential encoding resolving the $180^\circ$ phase ambiguity, the error-doubling effect, and simulated-vs-theoretical BER against conventional BPSK.</li>
<li><a href="https://dsplog.com/2007/09/30/coherent-demodulation-of-dbpsk/" target="_blank" rel="noopener">dsplog — Coherent demodulation of DBPSK</a> — a rigorous walkthrough deriving the differential encode/decode, the exact BER expression, and the reason each symbol error causes two bit errors, backed by runnable simulation.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`BPSK and DBPSK use the same antipodal $0^\circ/180^\circ$ constellation, one bit per symbol; BPSK encodes the bit in the ABSOLUTE phase, DBPSK in the phase CHANGE between consecutive symbols.`,
      String.raw`BPSK is coherent: it needs an absolute carrier-phase reference regenerated by a Costas or squaring loop.`,
      String.raw`BPSK achieves the optimal binary AWGN BER $P_b=Q(\sqrt{2E_b/N_0})=\tfrac12\mathrm{erfc}(\sqrt{E_b/N_0})$ because antipodal points have the maximum distance $d=2\sqrt{E_b}$.`,
      String.raw`Suppressed-carrier recovery is ambiguous by exactly $180^\circ$; locking to the inverse phase inverts every BPSK bit, and a mid-stream slip inverts the data from that point on.`,
      String.raw`BPSK resolves the ambiguity with a unique-word/preamble or by differential encoding; DBPSK resolves it inherently.`,
      String.raw`DBPSK differential encoder: $d_k=b_k\oplus d_{k-1}$ (XOR with the previous transmitted bit); a data $1$ flips the phase $180^\circ$, a data $0$ holds it.`,
      String.raw`DBPSK differentially coherent detection compares each symbol to the previous received symbol (multiply by its conjugate, take the sign); decoder $\hat b_k=\hat d_k\oplus\hat d_{k-1}$.`,
      String.raw`DBPSK BER in AWGN is $P_b=\tfrac12 e^{-E_b/N_0}$, about $0.8$ to $1$ dB worse than BPSK at practical error rates ($0.9$ dB at $P_b=10^{-4}$), because a noisy previous symbol serves as the phase reference.`,
      String.raw`The DBPSK penalty shrinks with SNR: both curves decay near $e^{-E_b/N_0}$, so the horizontal gap narrows steadily — about $1.1$ dB at $10^{-3}$, $0.9$ dB at $10^{-4}$, $0.65$ dB at $10^{-6}$ — tending to zero asymptotically.`,
      String.raw`Because the decoder XORs two symbols, one symbol error corrupts two adjacent bits — an error-multiplication factor of about 2 (paired errors), but bounded, not cascading.`,
      String.raw`DBPSK needs no carrier loop, so it acquires fast (locked from the first symbol pair), tolerates phase noise and slips, and is cheaper and lower power.`,
      String.raw`Coherently-detected differentially-encoded BPSK keeps the $Q(\sqrt{2E_b/N_0})$ BER (times $\approx2$ for error doubling) while still resolving the $180^\circ$ ambiguity — the best of both when a carrier loop is available.`,
      String.raw`Choose BPSK when link budget is tight and the connection is long-lived; choose DBPSK for bursts/packets, low-cost radios, and phase-noisy channels where $\sim1$ dB is affordable.`,
      String.raw`DBPSK detection assumes the channel phase is approximately constant across two adjacent symbols; if it drifts too fast between symbols the comparison degrades.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="bpsk-vs-dbpsk-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="260" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">DBPSK encoder (Tx) and differential decoder (Rx)</text>
<!-- encoder -->
<text x="16" y="48" fill="#63e6be" font-size="11">Transmitter: differential encoder</text>
<line x1="20" y1="90" x2="70" y2="90" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#bpsk-vs-dbpsk-a1)"/>
<text x="18" y="82" fill="#9aa7b5" font-size="10">$b_k$</text>
<circle cx="90" cy="90" r="16" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/><text x="82" y="95" fill="#e6edf3" font-size="13">$\oplus$</text>
<line x1="106" y1="90" x2="150" y2="90" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#bpsk-vs-dbpsk-a1)"/>
<text x="112" y="82" fill="#9aa7b5" font-size="10">$d_k$</text>
<rect x="150" y="76" width="66" height="28" fill="#1c232e" stroke="#ffa94d" stroke-width="1.3"/><text x="160" y="94" fill="#e6edf3" font-size="9">BPSK mod</text>
<line x1="216" y1="90" x2="256" y2="90" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#bpsk-vs-dbpsk-a1)"/>
<text x="222" y="82" fill="#b197fc" font-size="9">to Tx</text>
<!-- delay feedback -->
<rect x="120" y="132" width="52" height="24" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/><text x="128" y="148" fill="#e6edf3" font-size="9">$T_b$ delay</text>
<line x1="130" y1="90" x2="130" y2="132" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="120" y1="144" x2="90" y2="144" stroke="#9aa7b5" stroke-width="1.1"/><line x1="90" y1="144" x2="90" y2="106" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#bpsk-vs-dbpsk-a1)"/>
<text x="60" y="160" fill="#9aa7b5" font-size="9">$d_{k-1}$</text>
<!-- decoder -->
<text x="300" y="48" fill="#63e6be" font-size="11">Receiver: differential decoder</text>
<line x1="300" y1="90" x2="344" y2="90" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#bpsk-vs-dbpsk-a1)"/>
<text x="298" y="82" fill="#9aa7b5" font-size="10">$\hat d_k$</text>
<circle cx="364" cy="90" r="16" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/><text x="356" y="95" fill="#e6edf3" font-size="13">$\oplus$</text>
<line x1="380" y1="90" x2="430" y2="90" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#bpsk-vs-dbpsk-a1)"/>
<text x="434" y="94" fill="#b197fc" font-size="10">$\hat b_k$</text>
<rect x="394" y="132" width="52" height="24" fill="#1c232e" stroke="#63e6be" stroke-width="1.3"/><text x="402" y="148" fill="#e6edf3" font-size="9">$T_b$ delay</text>
<line x1="404" y1="90" x2="404" y2="132" stroke="#9aa7b5" stroke-width="1.1"/>
<line x1="394" y1="144" x2="364" y2="144" stroke="#9aa7b5" stroke-width="1.1"/><line x1="364" y1="144" x2="364" y2="106" stroke="#9aa7b5" stroke-width="1.1" marker-end="url(#bpsk-vs-dbpsk-a1)"/>
<text x="330" y="160" fill="#9aa7b5" font-size="9">$\hat d_{k-1}$</text>
<text x="16" y="200" fill="#9aa7b5" font-size="10">Encoder: $d_k=b_k\oplus d_{k-1}$. Decoder inverts it: $\hat b_k=\hat d_k\oplus\hat d_{k-1}$.</text>
<text x="16" y="220" fill="#9aa7b5" font-size="10">One $T_b$-delayed feedback tap in each block — no carrier-recovery loop anywhere.</text>
<text x="16" y="240" fill="#ff6b6b" font-size="10">A single wrong $\hat d_k$ enters two decoder XORs, so it flips two adjacent $\hat b$ (error pairing).</text>
</svg>`,
        caption: 'DBPSK signal chain: the transmitter differentially encodes d_k = b_k XOR d_{k-1} with a one-symbol delay, then BPSK-modulates. The receiver decodes b_hat_k = d_hat_k XOR d_hat_{k-1}, again with a one-symbol delay and no carrier-recovery loop. Because each decoded bit uses two received symbols, one symbol error corrupts two adjacent bits.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 270" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="270" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Phase-transition view: BPSK reads phase, DBPSK reads change</text>
<!-- constellation -->
<line x1="60" y1="150" x2="230" y2="150" stroke="#9aa7b5" stroke-width="1"/>
<line x1="145" y1="90" x2="145" y2="210" stroke="#9aa7b5" stroke-width="1" stroke-dasharray="4 3"/>
<circle cx="90" cy="150" r="6" fill="#4dabf7"/><text x="70" y="140" fill="#4dabf7" font-size="10">$180^\circ$</text>
<circle cx="200" cy="150" r="6" fill="#ffa94d"/><text x="188" y="140" fill="#ffa94d" font-size="10">$0^\circ$</text>
<text x="72" y="230" fill="#e6edf3" font-size="10">two antipodal points, both schemes</text>
<text x="72" y="246" fill="#9aa7b5" font-size="9">$d=2\sqrt{E_b}$ apart</text>
<!-- symbol stream with transitions -->
<text x="300" y="90" fill="#63e6be" font-size="11">data 1 = flip, data 0 = hold</text>
<!-- baseline phases -->
<line x1="300" y1="150" x2="330" y2="150" stroke="#ffa94d" stroke-width="3"/>
<line x1="335" y1="150" x2="365" y2="150" stroke="#4dabf7" stroke-width="3"/>
<line x1="370" y1="150" x2="400" y2="150" stroke="#4dabf7" stroke-width="3"/>
<line x1="405" y1="150" x2="435" y2="150" stroke="#ffa94d" stroke-width="3"/>
<line x1="440" y1="150" x2="470" y2="150" stroke="#ffa94d" stroke-width="3"/>
<text x="300" y="172" fill="#9aa7b5" font-size="9">$0^\circ$</text>
<text x="335" y="172" fill="#9aa7b5" font-size="9">$180$</text>
<text x="372" y="172" fill="#9aa7b5" font-size="9">$180$</text>
<text x="407" y="172" fill="#9aa7b5" font-size="9">$0^\circ$</text>
<text x="442" y="172" fill="#9aa7b5" font-size="9">$0^\circ$</text>
<!-- transition arrows -->
<text x="330" y="120" fill="#ff6b6b" font-size="11">1</text>
<text x="367" y="120" fill="#63e6be" font-size="11">0</text>
<text x="402" y="120" fill="#ff6b6b" font-size="11">1</text>
<text x="437" y="120" fill="#63e6be" font-size="11">0</text>
<text x="300" y="122" fill="#9aa7b5" font-size="9">data:</text>
<text x="300" y="210" fill="#9aa7b5" font-size="9">A global $180^\circ$ flip of all symbols leaves every</text>
<text x="300" y="224" fill="#9aa7b5" font-size="9">transition unchanged — so DBPSK is immune to it,</text>
<text x="300" y="238" fill="#9aa7b5" font-size="9">while BPSK would decode every bit inverted.</text>
</svg>`,
        caption: 'Both schemes use the same two antipodal points (distance 2*sqrt(Eb) apart). BPSK assigns a bit to each absolute phase; DBPSK assigns a bit to each transition (data 1 flips phase, data 0 holds). A global 180-degree flip of the whole stream changes no transition, so DBPSK is immune to the ambiguity that would invert every BPSK bit.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 280" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="bpsk-vs-dbpsk-a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ff6b6b"/></marker></defs>
<rect x="0" y="0" width="540" height="280" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">BER vs $E_b/N_0$: BPSK optimal, DBPSK ~1 dB to its right</text>
<!-- axes -->
<line x1="60" y1="40" x2="60" y2="235" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="60" y1="235" x2="510" y2="235" stroke="#9aa7b5" stroke-width="1.2"/>
<text x="20" y="130" fill="#9aa7b5" font-size="10" transform="rotate(-90 20,130)">$\log_{10}P_b$</text>
<text x="440" y="255" fill="#9aa7b5" font-size="10">$E_b/N_0$ (dB)</text>
<!-- gridlines -->
<line x1="60" y1="70" x2="510" y2="70" stroke="#2c3644" stroke-width="0.8"/>
<line x1="60" y1="120" x2="510" y2="120" stroke="#2c3644" stroke-width="0.8"/>
<line x1="60" y1="170" x2="510" y2="170" stroke="#2c3644" stroke-width="0.8"/>
<text x="34" y="74" fill="#9aa7b5" font-size="8">$10^{-2}$</text>
<text x="34" y="124" fill="#9aa7b5" font-size="8">$10^{-4}$</text>
<text x="34" y="174" fill="#9aa7b5" font-size="8">$10^{-6}$</text>
<!-- BPSK curve (steeper, left) -->
<path d="M80,55 C160,70 230,110 300,160 C350,195 400,220 470,232" fill="none" stroke="#4dabf7" stroke-width="2.2"/>
<text x="300" y="150" fill="#4dabf7" font-size="10">BPSK $Q(\sqrt{2E_b/N_0})$</text>
<!-- DBPSK curve (shifted right ~1 dB) -->
<path d="M100,55 C185,70 258,110 328,160 C378,195 428,220 495,232" fill="none" stroke="#ffa94d" stroke-width="2.2"/>
<text x="360" y="120" fill="#ffa94d" font-size="10">DBPSK $\tfrac12 e^{-E_b/N_0}$</text>
<!-- gap arrow at BER 1e-4 -->
<line x1="300" y1="120" x2="328" y2="120" stroke="#ff6b6b" stroke-width="1.6" marker-end="url(#bpsk-vs-dbpsk-a2)"/>
<text x="300" y="112" fill="#ff6b6b" font-size="9">$\sim0.9$ dB gap at $10^{-4}$</text>
<text x="70" y="270" fill="#9aa7b5" font-size="9">Both decay near $e^{-E_b/N_0}$; the DBPSK curve sits a fraction of a dB to the right, and the gap narrows as SNR grows.</text>
</svg>`,
        caption: 'Schematic BER curves: BPSK follows the optimal Q(sqrt(2*Eb/N0)); DBPSK follows (1/2)exp(-Eb/N0) and lies about 0.8 to 1 dB to its right at practical error rates. Both fall off roughly as exp(-Eb/N0), so the horizontal penalty shrinks as Eb/N0 increases: about 1.1 dB at BER 1e-3, 0.9 dB at 1e-4, 0.65 dB at 1e-6.'
      }
    ],
    equations: [
      {
        title: 'BPSK Optimal Bit-Error Rate',
        tex: String.raw`$$P_b^{\text{BPSK}}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)=\tfrac12\,\mathrm{erfc}\!\left(\sqrt{\frac{E_b}{N_0}}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> BPSK sends one of two antipodal signal points $s_0=+\sqrt{E_b}$ and $s_1=-\sqrt{E_b}$ on a single signal-space axis, in AWGN whose projected noise is Gaussian with variance $\sigma^2=N_0/2$. The optimal receiver is the matched filter followed by a threshold at $0$; an error occurs when noise carries the received point across that threshold.</p>
<p><b>Step 1.</b> The distance between the two points is $d=\lVert s_0-s_1\rVert=2\sqrt{E_b}$. By the minimum-distance error result, mistaking one for the other requires the noise component along the join to exceed half the distance, i.e. $n>d/2=\sqrt{E_b}$.</p>
<p><b>Step 2.</b> That component is zero-mean Gaussian with std $\sigma=\sqrt{N_0/2}$, so $P_b=\Pr\{n>\sqrt{E_b}\}=Q\!\big(\sqrt{E_b}/\sigma\big)=Q\!\big(\sqrt{E_b}/\sqrt{N_0/2}\big)$.</p>
<p><b>Result.</b> Simplifying the argument, $\sqrt{E_b}/\sqrt{N_0/2}=\sqrt{2E_b/N_0}$, giving $P_b=Q(\sqrt{2E_b/N_0})$. Using $Q(x)=\tfrac12\mathrm{erfc}(x/\sqrt2)$ turns this into $\tfrac12\mathrm{erfc}(\sqrt{E_b/N_0})$. Because $d=2\sqrt{E_b}$ is the largest distance any binary scheme can achieve at energy $E_b$, this is the optimal binary BER in AWGN — the benchmark DBPSK is measured against.</p>`
      },
      {
        title: 'Differential Encoding Rule',
        tex: String.raw`$$d_k=b_k\oplus d_{k-1}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want to encode data so the information lives in the phase <em>change</em> between consecutive symbols, not in the absolute phase. Let $b_k\in\{0,1\}$ be the data bit, $d_k\in\{0,1\}$ the transmitted symbol bit (which maps $0\to0^\circ$, $1\to180^\circ$), and $d_{k-1}$ the previous transmitted bit, with a chosen initial reference $d_{-1}$.</p>
<p><b>Step 1.</b> Require that a data $1$ produce a $180^\circ$ phase change and a data $0$ produce "no change." A phase change happens exactly when $d_k\ne d_{k-1}$, i.e. when $d_k\oplus d_{k-1}=1$. So we must set $d_k\oplus d_{k-1}=b_k$.</p>
<p><b>Step 2.</b> Solve for the new symbol bit. XOR both sides by $d_{k-1}$ and use $x\oplus x=0$: $d_k\oplus d_{k-1}\oplus d_{k-1}=b_k\oplus d_{k-1}$, hence $d_k=b_k\oplus d_{k-1}$.</p>
<p><b>Result.</b> The encoder is a running XOR with its own previous output, $d_k=b_k\oplus d_{k-1}$ — a one-symbol feedback loop. Checking the table: $b_k=0$ leaves $d_k=d_{k-1}$ (phase holds); $b_k=1$ forces $d_k=\overline{d_{k-1}}$ (phase flips), independent of the absolute state. The absolute phase is now irrelevant to the data; only transitions carry information.</p>`
      },
      {
        title: 'Differential Decoding Rule',
        tex: String.raw`$$\hat b_k=\hat d_k\oplus\hat d_{k-1}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The receiver recovers the symbol bits $\hat d_k$ (from the sign of each symbol, or from a symbol-to-symbol phase comparison) and must invert the encoder $d_k=b_k\oplus d_{k-1}$ to get the data $\hat b_k$.</p>
<p><b>Step 1.</b> From the encoder relation, XOR both sides by $d_{k-1}$: $d_k\oplus d_{k-1}=b_k\oplus d_{k-1}\oplus d_{k-1}=b_k$. So exactly $b_k=d_k\oplus d_{k-1}$.</p>
<p><b>Step 2.</b> Replace the true symbol bits with the received estimates: $\hat b_k=\hat d_k\oplus\hat d_{k-1}$. Notice this uses only the current and immediately previous received symbols — no absolute phase reference appears anywhere.</p>
<p><b>Result.</b> Decoding is the same XOR structure as encoding, run on the received symbol stream. Crucially, if the whole received stream is inverted by a $180^\circ$ ambiguity, every $\hat d$ flips, but $\hat d_k\oplus\hat d_{k-1}$ is unchanged (both terms flip and cancel) — so the decoded data is immune to a global phase flip. This is the mechanism that resolves the $180^\circ$ ambiguity for free.</p>`
      },
      {
        title: 'DBPSK Bit-Error Rate',
        tex: String.raw`$$P_b^{\text{DBPSK}}=\tfrac12\,e^{-E_b/N_0}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Differentially coherent DBPSK decides bit $k$ by comparing two consecutive received symbols, $r_k$ and $r_{k-1}$, each equal to the transmitted symbol plus independent complex Gaussian noise. The decision statistic is the real part of $r_k\,r_{k-1}^{*}$: positive means "same phase" (data $0$), negative means "opposite phase" (data $1$).</p>
<p><b>Step 1.</b> This is a classic binary decision between two equally likely hypotheses using a product of two noisy phasors. Form the sum and difference variables $u=r_k+r_{k-1}$ and $v=r_k-r_{k-1}$; then $\mathrm{Re}(r_k r_{k-1}^{*})=\tfrac14(\lvert u\rvert^2-\lvert v\rvert^2)$, so the decision compares two independent chi-square (squared-Gaussian) energies.</p>
<p><b>Step 2.</b> For that comparison of two independent quadratic forms in Gaussian noise, the error probability is the standard result $P_b=\tfrac12\exp(-\gamma)$, where $\gamma$ is the per-bit signal-to-noise ratio $E_b/N_0$ carried by the pair. The one noisy symbol used as reference is exactly what turns the coherent $Q$-function into this simpler exponential.</p>
<p><b>Result.</b> $P_b^{\text{DBPSK}}=\tfrac12 e^{-E_b/N_0}$. At high SNR $Q(\sqrt{2E_b/N_0})\approx\tfrac{1}{2\sqrt{\pi E_b/N_0}}e^{-E_b/N_0}$, so DBPSK and BPSK share the dominant $e^{-E_b/N_0}$ decay; DBPSK lacks the extra $1/\sqrt{\cdot}$ shrink, which is precisely the fraction-of-a-dB penalty derived next.</p>`
      },
      {
        title: 'The ~1 dB DBPSK Penalty',
        tex: String.raw`$$\Delta_{\text{dB}}(P_b)=10\log_{10}\!\frac{(E_b/N_0)_{\text{DBPSK}}}{(E_b/N_0)_{\text{BPSK}}}\ \xrightarrow{\ \text{high SNR}\ }\ \approx 0.8\text{ to }1\text{ dB}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Fix a target BER $P_b$ and ask how much more $E_b/N_0$ DBPSK needs than BPSK to reach it. Set the two BER expressions equal to the same $P_b$ and compare the required $E_b/N_0$.</p>
<p><b>Step 1.</b> For DBPSK, $P_b=\tfrac12 e^{-\gamma_D}$ gives $\gamma_D=\ln(1/(2P_b))$. For BPSK, $P_b=Q(\sqrt{2\gamma_B})$; using the high-SNR tail $Q(x)\approx\tfrac{1}{x\sqrt{2\pi}}e^{-x^2/2}$ with $x=\sqrt{2\gamma_B}$ gives $P_b\approx\tfrac{1}{2\sqrt{\pi\gamma_B}}e^{-\gamma_B}$, so $\gamma_B\approx\ln(1/(2P_b))-\tfrac12\ln(\pi\gamma_B)$.</p>
<p><b>Step 2.</b> Take a concrete target, $P_b=10^{-4}$. DBPSK: $\gamma_D=\ln(1/(2\times10^{-4}))=\ln(5000)=8.517$, i.e. $9.30$ dB. BPSK numerically needs $\gamma_B\approx6.92$ (using $Q(\sqrt{2\gamma_B})=10^{-4}\Rightarrow\sqrt{2\gamma_B}=3.719$), i.e. $8.40$ dB.</p>
<p><b>Result.</b> The gap is $9.30-8.40\approx0.90$ dB at $10^{-4}$; repeating at $10^{-6}$ ($\gamma_D=\ln(5\times10^{5})=13.12\to11.18$ dB versus $\gamma_B=4.753^2/2=11.30\to10.53$ dB) gives about $0.65$ dB, and at $10^{-3}$ about $1.1$ dB. So the DBPSK penalty is $\approx0.8$ to $1$ dB at practical error rates and slowly shrinks with SNR, because the missing $1/\sqrt{\gamma}$ factor in the DBPSK BER contributes a vanishing fraction of a decibel as $\gamma$ grows. This is the price of using a noisy previous symbol as the phase reference instead of a clean recovered carrier.</p>`
      },
      {
        title: 'Error-Pairing (Doubling) Factor',
        tex: String.raw`$$\text{BER}_{\text{decoded}}\approx 2\,P_{\text{sym}}\quad(\text{high SNR, isolated errors})$$`,
        derivation: String.raw`<p><b>Where we start.</b> Consider coherently-detected, differentially-encoded BPSK, where the receiver first makes hard symbol decisions $\hat d_k$ with symbol-error probability $P_{\text{sym}}=Q(\sqrt{2E_b/N_0})$, then differentially decodes $\hat b_k=\hat d_k\oplus\hat d_{k-1}$. We want the decoded bit-error rate.</p>
<p><b>Step 1.</b> A decoded bit $\hat b_k$ is wrong iff exactly one of the two symbols $\hat d_k,\hat d_{k-1}$ it XORs is in error (if both or neither are wrong, the XOR is correct). At high SNR symbol errors are rare and effectively independent, so an isolated single symbol error at position $j$ is the dominant event.</p>
<p><b>Step 2.</b> That one wrong symbol $\hat d_j$ appears in two decoded bits: $\hat b_j=\hat d_j\oplus\hat d_{j-1}$ and $\hat b_{j+1}=\hat d_{j+1}\oplus\hat d_j$. Both flip, so a single symbol error yields two adjacent bit errors. Averaging, each symbol error contributes about $2$ bit errors.</p>
<p><b>Result.</b> $\text{BER}_{\text{decoded}}\approx 2P_{\text{sym}}=2Q(\sqrt{2E_b/N_0})$ at high SNR. The factor $2$ is the error-multiplication (pairing) penalty of differential decoding; because the paired errors are adjacent, they form short bursts rather than cascading — but a following FEC that assumes independent errors should interleave to break the pairs. In pure differentially-coherent DBPSK this doubling is already folded into the $\tfrac12 e^{-E_b/N_0}$ figure.</p>`
      },
      {
        title: 'Signal-Space Distance and Why Antipodal Wins',
        tex: String.raw`$$d_{\text{antipodal}}=2\sqrt{E_b}\quad>\quad d_{\text{orthogonal}}=\sqrt{2E_b}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Binary error probability in AWGN is $Q(d/2\sigma)$ with $\sigma^2=N_0/2$, so for a fixed energy budget the scheme with the largest inter-point distance $d$ has the lowest BER. Compare antipodal (BPSK) points to orthogonal points, both with energy $E_b$ per symbol.</p>
<p><b>Step 1.</b> Antipodal points sit at $+\sqrt{E_b}$ and $-\sqrt{E_b}$ on one axis. Their separation is $d_{\text{antipodal}}=\lvert{+}\sqrt{E_b}-({-}\sqrt{E_b})\rvert=2\sqrt{E_b}$.</p>
<p><b>Step 2.</b> Orthogonal points sit on perpendicular axes at $(\sqrt{E_b},0)$ and $(0,\sqrt{E_b})$. Their separation is $d_{\text{orthogonal}}=\sqrt{(\sqrt{E_b})^2+(\sqrt{E_b})^2}=\sqrt{2E_b}$.</p>
<p><b>Result.</b> Antipodal distance exceeds orthogonal by a factor $\sqrt2$, which in $Q(d/2\sigma)$ is a $3$ dB SNR advantage; antipodal is the maximum-distance binary arrangement, so BPSK is provably optimal. DBPSK reuses these same antipodal points but pays a much smaller $\sim1$ dB — not from distance loss, but from a noisy detection reference — which is why it remains close to optimal while shedding the carrier-recovery hardware.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the single conceptual difference between BPSK and DBPSK?`, back: String.raw`BPSK encodes the bit in the ABSOLUTE phase ($0^\circ$ or $180^\circ$); DBPSK encodes it in the phase CHANGE between consecutive symbols. Same constellation, absolute vs relative reading.` },
      { front: String.raw`Write the BPSK optimal BER.`, back: String.raw`$P_b=Q(\sqrt{2E_b/N_0})=\tfrac12\mathrm{erfc}(\sqrt{E_b/N_0})$ — the best possible binary BER in AWGN, from the maximum antipodal distance $d=2\sqrt{E_b}$.` },
      { front: String.raw`Write the DBPSK (differentially coherent) BER.`, back: String.raw`$P_b=\tfrac12 e^{-E_b/N_0}$.` },
      { front: String.raw`How large is the DBPSK penalty over BPSK, and why?`, back: String.raw`About $0.8$ to $1$ dB at practical error rates ($0.9$ dB at $10^{-4}$, shrinking to $0.65$ dB by $10^{-6}$), because DBPSK uses a noisy previous symbol as its phase reference instead of a clean recovered carrier. The gap shrinks slowly with SNR.` },
      { front: String.raw`State the differential encoding rule.`, back: String.raw`$d_k=b_k\oplus d_{k-1}$: XOR the data bit with the previous transmitted bit. Data $1$ flips the phase $180^\circ$; data $0$ holds it.` },
      { front: String.raw`State the differential decoding rule.`, back: String.raw`$\hat b_k=\hat d_k\oplus\hat d_{k-1}$: XOR the current and previous received symbol bits. It exactly inverts the encoder.` },
      { front: String.raw`Why does DBPSK inherently resolve the $180^\circ$ ambiguity?`, back: String.raw`A global phase flip inverts every $\hat d_k$, but $\hat d_k\oplus\hat d_{k-1}$ is unchanged because both terms flip and cancel — so the decoded data is unaffected.` },
      { front: String.raw`What causes the $180^\circ$ ambiguity in BPSK carrier recovery?`, back: String.raw`Suppressed-carrier recovery (squaring/Costas) is insensitive to a global $180^\circ$ flip: squaring maps $\pm\cos$ to the same signal, and the Costas error is unchanged by adding $\pi$. The loop can lock to either phase.` },
      { front: String.raw`What happens if a BPSK carrier loop locks to the inverse phase?`, back: String.raw`Every decoded bit is inverted; a mid-stream slip inverts the data from that point on. It must be fixed by a unique word/preamble or by differential coding.` },
      { front: String.raw`Why do DBPSK bit errors come in pairs?`, back: String.raw`The decoder XORs two symbols, so one wrong symbol $\hat d_j$ enters two adjacent decoded bits ($\hat b_j$ and $\hat b_{j+1}$), flipping both — an error-multiplication factor of about 2, but bounded (not cascading).` },
      { front: String.raw`What carrier-recovery hardware does DBPSK need?`, back: String.raw`None. Its reference is simply the previous received symbol (a one-symbol delay and a multiply), so there is no Costas/squaring loop to acquire or lose lock.` },
      { front: String.raw`Compare acquisition speed of BPSK vs DBPSK.`, back: String.raw`BPSK must wait for its carrier loop to pull in and lock; DBPSK is effectively locked from the first pair of symbols, making it far faster to acquire — ideal for short bursts and packets.` },
      { front: String.raw`Distinguish DBPSK from coherently-detected differentially-encoded BPSK.`, back: String.raw`DBPSK: no carrier recovery, previous-symbol reference, $\tfrac12 e^{-E_b/N_0}$ ($\sim1$ dB penalty). Diff-encoded coherent BPSK: full carrier recovery, $\approx 2Q(\sqrt{2E_b/N_0})$ — near-BPSK, differential coding only kills the ambiguity.` },
      { front: String.raw`Why is antipodal (BPSK) optimal among binary schemes?`, back: String.raw`Antipodal distance $2\sqrt{E_b}$ is the largest achievable at energy $E_b$; since binary BER is $Q(d/2\sigma)$, maximum distance means minimum error. Orthogonal is $\sqrt2$ closer, i.e. $3$ dB worse.` },
      { front: String.raw`Give two systems that use DBPSK and say why.`, back: String.raw`802.11 1 Mbps and Bluetooth-class links — they favour fast acquisition, low-cost/low-power receivers, and robustness to phase noise, and can afford the $\sim1$ dB penalty.` },
      { front: String.raw`What assumption does DBPSK detection make about the channel phase?`, back: String.raw`That the channel phase is approximately constant across two adjacent symbols, so the previous symbol is a valid phase reference. Fast phase drift between symbols degrades the comparison.` }
    ],
    mcqs: [
      { q: String.raw`The essential difference between BPSK and DBPSK is that DBPSK encodes the bit in:`, options: [String.raw`the absolute carrier phase`, String.raw`the phase change between consecutive symbols`, String.raw`the carrier amplitude`, String.raw`the symbol duration`], answer: 1, explain: String.raw`DBPSK carries information in the transition (relative phase); BPSK uses the absolute phase.` },
      { q: String.raw`The optimal BPSK bit-error rate in AWGN is:`, options: [String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$Q(\sqrt{E_b/N_0})$`, String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$e^{-2E_b/N_0}$`], answer: 2, explain: String.raw`Antipodal distance $2\sqrt{E_b}$ gives $P_b=Q(d/2\sigma)=Q(\sqrt{2E_b/N_0})$, the optimal binary result.` },
      { q: String.raw`The differentially coherent DBPSK bit-error rate is:`, options: [String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$\tfrac12\mathrm{erfc}(\sqrt{E_b/N_0})$`, String.raw`$e^{-E_b/N_0}$`], answer: 1, explain: String.raw`The two-symbol quadratic-form decision yields the closed form $\tfrac12 e^{-E_b/N_0}$.` },
      { q: String.raw`At a BER of about $10^{-4}$, DBPSK is worse than BPSK by about:`, options: [String.raw`0 dB`, String.raw`0.8 to 1 dB`, String.raw`3 dB`, String.raw`6 dB`], answer: 1, explain: String.raw`Using a noisy previous symbol as reference costs roughly $0.8$ to $1$ dB, and the gap shrinks with SNR.` },
      { q: String.raw`The differential encoder rule is:`, options: [String.raw`$d_k=b_k\oplus d_{k-1}$`, String.raw`$d_k=b_k\cdot d_{k-1}$`, String.raw`$d_k=b_k+b_{k-1}$`, String.raw`$d_k=\overline{b_k}$`], answer: 0, explain: String.raw`The transmitted bit is the XOR of the data bit with the previous transmitted bit.` },
      { q: String.raw`The differential decoder recovers the data as:`, options: [String.raw`$\hat b_k=\hat d_k\cdot\hat d_{k-1}$`, String.raw`$\hat b_k=\hat d_k\oplus\hat d_{k-1}$`, String.raw`$\hat b_k=\hat d_k$`, String.raw`$\hat b_k=\hat d_k\oplus\hat b_{k-1}$`], answer: 1, explain: String.raw`XORing consecutive received symbol bits inverts the encoder, using no absolute phase.` },
      { q: String.raw`DBPSK is immune to the $180^\circ$ carrier ambiguity because:`, options: [String.raw`it uses a stronger carrier`, String.raw`a global phase flip cancels in the symbol-to-symbol XOR`, String.raw`it doubles the symbol rate`, String.raw`it transmits a pilot tone`], answer: 1, explain: String.raw`Both terms of $\hat d_k\oplus\hat d_{k-1}$ flip under a global inversion, leaving the decoded bit unchanged.` },
      { q: String.raw`The $180^\circ$ ambiguity in BPSK arises because suppressed-carrier recovery is:`, options: [String.raw`too narrowband`, String.raw`insensitive to a global $180^\circ$ phase flip`, String.raw`unable to track frequency`, String.raw`limited by the ADC`], answer: 1, explain: String.raw`Squaring maps $\pm\cos$ to the same signal and the Costas error is unchanged by adding $\pi$, so either phase can lock.` },
      { q: String.raw`In DBPSK, a single received-symbol error typically corrupts:`, options: [String.raw`no bits`, String.raw`exactly one bit`, String.raw`two adjacent bits`, String.raw`the entire rest of the stream`], answer: 2, explain: String.raw`The decoder XORs two symbols, so one wrong symbol flips two adjacent decoded bits — bounded error pairing.` },
      { q: String.raw`Which receiver hardware does DBPSK avoid that BPSK requires?`, options: [String.raw`the matched filter`, String.raw`the carrier-recovery (Costas/squaring) loop`, String.raw`the ADC`, String.raw`the antenna`], answer: 1, explain: String.raw`DBPSK uses the previous symbol as reference, so no carrier phase loop is needed.` },
      { q: String.raw`A key acquisition advantage of DBPSK over BPSK is that it:`, options: [String.raw`has higher data rate`, String.raw`locks essentially instantly (no loop to pull in)`, String.raw`needs no antenna`, String.raw`has lower BER`], answer: 1, explain: String.raw`With no carrier loop to acquire, DBPSK is effectively locked from the first symbol pair — ideal for bursts.` },
      { q: String.raw`Coherently-detected, differentially-encoded BPSK (full carrier recovery + differential coding) has BER approximately:`, options: [String.raw`$\tfrac12 e^{-E_b/N_0}$`, String.raw`$2Q(\sqrt{2E_b/N_0})$`, String.raw`$Q(\sqrt{E_b/N_0})$`, String.raw`$\tfrac14 e^{-2E_b/N_0}$`], answer: 1, explain: String.raw`It keeps BPSK's coherent symbol-error rate but doubles the bit errors via differential decoding, so $\approx 2Q(\sqrt{2E_b/N_0})$.` },
      { q: String.raw`Antipodal signalling (BPSK) beats orthogonal binary signalling by about 3 dB because:`, options: [String.raw`it uses twice the bandwidth`, String.raw`its inter-point distance $2\sqrt{E_b}$ is $\sqrt2$ larger than orthogonal $\sqrt{2E_b}$`, String.raw`it has no noise`, String.raw`it doubles the energy`], answer: 1, explain: String.raw`Larger distance in $Q(d/2\sigma)$ means lower BER; the $\sqrt2$ distance ratio is a $3$ dB SNR advantage.` },
      { q: String.raw`DBPSK detection assumes that the channel phase between two adjacent symbols is:`, options: [String.raw`randomly changing`, String.raw`approximately constant`, String.raw`exactly $90^\circ$`, String.raw`unknown and unbounded`], answer: 1, explain: String.raw`The previous symbol is only a valid reference if the phase is roughly constant across the pair.` },
      { q: String.raw`For a tight link budget on a long-lived connection where every decibel matters, the better choice is generally:`, options: [String.raw`DBPSK, for its simplicity`, String.raw`BPSK, for its optimal power efficiency`, String.raw`neither works`, String.raw`always DBPSK`], answer: 1, explain: String.raw`BPSK is power-optimal; the carrier loop cost is amortised over a long connection.` },
      { q: String.raw`Because DBPSK errors arrive in adjacent pairs, a following FEC that assumes independent errors should:`, options: [String.raw`increase the symbol rate`, String.raw`interleave the bits to break the pairs`, String.raw`remove the matched filter`, String.raw`switch to orthogonal signalling`], answer: 1, explain: String.raw`Interleaving spreads the paired errors so the decoder again sees approximately independent errors.` }
    ],
    numericals: [
      {
        q: String.raw`A BPSK link operates at $E_b/N_0=10$ dB. Find the optimal bit-error rate.`,
        solution: String.raw`<p><b>Formula.</b> $$P_b^{\text{BPSK}}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right),$$ with $E_b/N_0$ converted to a linear ratio first.</p>
<p><b>Substitute.</b> $E_b/N_0=10^{10/10}=10$. Argument $=\sqrt{2\times10}=\sqrt{20}=4.472$. So $P_b=Q(4.472)$.</p>
<p><b>Compute.</b> $Q(4.472)\approx 3.87\times10^{-6}$, so $P_b\approx\mathbf{3.9\times10^{-6}}$.</p>
<p><b>Explanation.</b> At $10$ dB the optimal BPSK receiver already reaches about $4\times10^{-6}$ BER. This is the best any binary scheme can do in AWGN at this energy, and the benchmark against which DBPSK's penalty is measured in the next problem.</p>`
      },
      {
        q: String.raw`For the same $E_b/N_0=10$ dB, find the DBPSK bit-error rate and compare it to the BPSK result above.`,
        solution: String.raw`<p><b>Formula.</b> $$P_b^{\text{DBPSK}}=\tfrac12 e^{-E_b/N_0},$$ with $E_b/N_0$ a linear ratio.</p>
<p><b>Substitute.</b> $E_b/N_0=10$, so $P_b=\tfrac12 e^{-10}$.</p>
<p><b>Compute.</b> $e^{-10}=4.54\times10^{-5}$; $P_b=\tfrac12\times4.54\times10^{-5}=\mathbf{2.27\times10^{-5}}$.</p>
<p><b>Explanation.</b> DBPSK gives $2.3\times10^{-5}$ versus BPSK's $3.9\times10^{-6}$ — about $5.9\times$ more errors at the same energy. Equivalently, to match BPSK's $3.9\times10^{-6}$ DBPSK would need $\gamma=\ln(1/(2\times3.87\times10^{-6}))=11.77$, i.e. $10.7$ dB — roughly $0.7$ dB more $E_b/N_0$ at this operating point (the gap is $\sim0.9$ dB at $10^{-4}$), confirming the sub-1-dB penalty from using a noisy previous-symbol reference.</p>`
      },
      {
        q: String.raw`Find the exact $E_b/N_0$ (in dB) that DBPSK needs to reach a BER of $10^{-4}$, and compare to the BPSK requirement of $8.4$ dB.`,
        solution: String.raw`<p><b>Formula.</b> Invert the DBPSK BER: from $P_b=\tfrac12 e^{-\gamma}$, $$\gamma=\ln\!\left(\frac{1}{2P_b}\right),\qquad (E_b/N_0)_{\text{dB}}=10\log_{10}\gamma.$$</p>
<p><b>Substitute.</b> $P_b=10^{-4}$, so $\dfrac{1}{2P_b}=\dfrac{1}{2\times10^{-4}}=5000$; $\gamma=\ln(5000)$.</p>
<p><b>Compute.</b> $\ln(5000)=8.517$; $(E_b/N_0)_{\text{dB}}=10\log_{10}(8.517)=10\times0.9303=\mathbf{9.30}$ dB.</p>
<p><b>Explanation.</b> DBPSK needs $9.30$ dB while BPSK needs $8.4$ dB for the same $10^{-4}$ BER — a gap of $0.90$ dB. This is the concrete $\sim1$ dB penalty; at lower BER (e.g. $10^{-6}$) the gap narrows to about $0.65$ dB because both curves share the $e^{-E_b/N_0}$ decay.</p>`
      },
      {
        q: String.raw`Differentially encode the data sequence $b=1\,0\,1\,1\,0$ using $d_k=b_k\oplus d_{k-1}$ with initial reference $d_{-1}=0$. Give the transmitted symbol-bit sequence and the phase pattern.`,
        solution: String.raw`<p><b>Formula.</b> $$d_k=b_k\oplus d_{k-1},\quad d_{-1}=0,\quad 0\to0^\circ,\ 1\to180^\circ.$$</p>
<p><b>Substitute.</b> Apply the XOR left to right: $d_0=b_0\oplus d_{-1}=1\oplus0$; $d_1=b_1\oplus d_0=0\oplus d_0$; $d_2=b_2\oplus d_1$; $d_3=b_3\oplus d_2$; $d_4=b_4\oplus d_3$.</p>
<p><b>Compute.</b> $d_0=1\oplus0=1$; $d_1=0\oplus1=1$; $d_2=1\oplus1=0$; $d_3=1\oplus0=1$; $d_4=0\oplus1=1$. Transmitted bits $d=1\,1\,0\,1\,1$; phases $=180^\circ,\,180^\circ,\,0^\circ,\,180^\circ,\,180^\circ$.</p>
<p><b>Explanation.</b> Check against the rule "data $1$ flips, data $0$ holds": the data $1,0,1,1,0$ should give flip, hold, flip, flip, hold. Starting from the $d_{-1}=0$ reference: flip$\to$1, hold$\to$1, flip$\to$0, flip$\to$1, hold$\to$1 — matching $d=1\,1\,0\,1\,1$. Information lives entirely in the transitions, not the absolute phases.</p>`
      },
      {
        q: String.raw`Decode the received symbol-bit sequence $\hat d=1\,1\,0\,1\,1$ (from the previous problem) with $\hat d_{-1}=0$ using $\hat b_k=\hat d_k\oplus\hat d_{k-1}$, and verify it recovers the original data.`,
        solution: String.raw`<p><b>Formula.</b> $$\hat b_k=\hat d_k\oplus\hat d_{k-1},\qquad \hat d_{-1}=0.$$</p>
<p><b>Substitute.</b> $\hat b_0=\hat d_0\oplus\hat d_{-1}=1\oplus0$; $\hat b_1=\hat d_1\oplus\hat d_0=1\oplus1$; $\hat b_2=\hat d_2\oplus\hat d_1=0\oplus1$; $\hat b_3=\hat d_3\oplus\hat d_2=1\oplus0$; $\hat b_4=\hat d_4\oplus\hat d_3=1\oplus1$.</p>
<p><b>Compute.</b> $\hat b_0=1$; $\hat b_1=0$; $\hat b_2=1$; $\hat b_3=1$; $\hat b_4=0$. Decoded data $=1\,0\,1\,1\,0$.</p>
<p><b>Explanation.</b> The decoded stream $1\,0\,1\,1\,0$ exactly equals the original data — the decoder inverts the encoder. The immunity to a $180^\circ$ ambiguity is a transition property: since $\hat b_k=\hat d_k\oplus\hat d_{k-1}$ depends only on whether adjacent symbols <em>differ</em>, inverting the whole received stream (including its reference symbol) flips both terms of every XOR and leaves each decoded bit unchanged — the data is recovered regardless of which absolute phase the receiver locked to.</p>`
      },
      {
        q: String.raw`A DBPSK-style differential decoder makes 8 isolated received-symbol errors over a $10^{5}$-bit block, each an isolated single-symbol error. Estimate the decoded bit-error count and the error-multiplication factor.`,
        solution: String.raw`<p><b>Formula.</b> Each isolated symbol error flips two adjacent decoded bits, so $$N_{\text{bit errors}}\approx 2\times N_{\text{symbol errors}},\qquad \text{factor}=\frac{N_{\text{bit errors}}}{N_{\text{symbol errors}}}.$$</p>
<p><b>Substitute.</b> $N_{\text{symbol errors}}=8$ isolated errors; $N_{\text{bit errors}}\approx2\times8$.</p>
<p><b>Compute.</b> $N_{\text{bit errors}}\approx16$, so the decoded BER $\approx16/10^{5}=\mathbf{1.6\times10^{-4}}$ and the error-multiplication factor $=16/8=\mathbf{2}$.</p>
<p><b>Explanation.</b> The differential decoder XORs two symbols, so each isolated symbol error corrupts an adjacent pair of bits, doubling the error count. The doubling is bounded (it does not cascade), and because the two errors are adjacent, an interleaver ahead of any FEC restores the independent-error assumption the code needs.</p>`
      }
    ],
    realWorld: String.raw`<p>The BPSK-versus-DBPSK trade shows up wherever a designer weighs the last decibel of power efficiency against receiver simplicity and speed. Deep-space and satellite links, where the link budget is brutal and connections are long-lived, use coherent BPSK (often with light differential encoding just to resolve the $180^\circ$ ambiguity) to squeeze out the optimal $Q(\sqrt{2E_b/N_0})$ BER — the Costas-loop hardware and its acquisition time are affordable when every fraction of a decibel buys antenna size or transmit power. By contrast, the original $802.11$ physical layer specifies DBPSK for its $1$ Mbps mode and DQPSK for $2$ Mbps precisely because Wi-Fi is bursty and packet-oriented: a receiver cannot spend symbols pulling in a carrier loop at the start of every short frame, so the instant, per-symbol reference of differential detection wins even at a $\sim1$ dB cost.</p>
<p>Low-power and low-cost radios lean the same way. Bluetooth-class and many ISM-band links favour differential detection to shed the carrier-recovery silicon and to ride out the phase noise of cheap oscillators, since a slow phase drift cancels in the symbol-to-symbol comparison that would otherwise break a coherent loop. The error-pairing behaviour matters in system design too: because differential decoding turns each symbol error into an adjacent bit-error pair, standards that place FEC after a differential demodulator interleave the bits first, so the convolutional or block decoder still sees approximately independent errors. Understanding the BER formulas, the $\sim1$ dB gap, the ambiguity mechanism, and the error doubling is exactly what lets an engineer decide, for a given link budget, oscillator quality, and burst structure, whether to pay for a coherent BPSK receiver or accept the small penalty of DBPSK.</p>`,
    related: ['bpsk', 'dbpsk', 'costas-loop', 'ber', 'coherent-carrier-tracking']
  }
);
