// extra-a.js — Fundamentals & Signals topics: Shannon capacity, source coding, sinc, spectrum
CONTENT.topics.push(
{
  id: 'shannon',
  title: 'Shannon Capacity & Channel Model',
  category: 'Fundamentals',
  tags: ['information theory', 'capacity', 'entropy', 'SNR', 'Shannon-Hartley', 'spectral efficiency'],
  summary: String.raw`Shannon's channel model and capacity theorem set the ultimate limit on error-free data rate, given by $C = B\log_2(1+\mathrm{SNR})$ bits per second.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-shannon" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="55" width="70" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="43" y="79" fill="#e6edf3" text-anchor="middle">Source</text>
<rect x="108" y="55" width="86" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="151" y="74" fill="#e6edf3" text-anchor="middle">Encoder</text><text x="151" y="88" fill="#9aa7b5" text-anchor="middle" font-size="10">compress+FEC</text>
<rect x="224" y="45" width="110" height="60" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="279" y="66" fill="#e6edf3" text-anchor="middle">Noisy channel</text><text x="279" y="88" fill="#ffa94d" text-anchor="middle" font-size="11">C=B·log₂(1+SNR)</text>
<rect x="364" y="55" width="86" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="407" y="79" fill="#e6edf3" text-anchor="middle">Decoder</text>
<rect x="480" y="55" width="52" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="506" y="79" fill="#e6edf3" text-anchor="middle">Sink</text>
<text x="279" y="34" fill="#b197fc" text-anchor="middle" font-size="11">+ noise (N₀B)</text>
<line x1="78" y1="75" x2="106" y2="75" stroke="#9aa7b5" marker-end="url(#arr-shannon)"/>
<line x1="194" y1="75" x2="222" y2="75" stroke="#9aa7b5" marker-end="url(#arr-shannon)"/>
<line x1="334" y1="75" x2="362" y2="75" stroke="#9aa7b5" marker-end="url(#arr-shannon)"/>
<line x1="450" y1="75" x2="478" y2="75" stroke="#9aa7b5" marker-end="url(#arr-shannon)"/>
<line x1="279" y1="45" x2="279" y2="40" stroke="#b197fc" marker-end="url(#arr-shannon)"/>
</svg>`,
    caption: String.raw`Shannon's channel model: source coded and protected, sent through a noisy channel of capacity $C=B\log_2(1+\mathrm{SNR})$, then decoded to the sink.`,
  },
  {
    title: String.raw`Two levers on capacity: widen B vs raise SNR`,
    svg: String.raw`<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-shannon" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="200" y="12" width="140" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="270" y="30" fill="#e6edf3" text-anchor="middle">C = B·log₂(1+SNR)</text><text x="270" y="45" fill="#9aa7b5" text-anchor="middle" font-size="10">bits/s to raise</text>
<rect x="20" y="78" width="200" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="120" y="97" fill="#e6edf3" text-anchor="middle" font-size="11">Path A — widen B</text><text x="120" y="112" fill="#9aa7b5" text-anchor="middle" font-size="10">C ∝ B linear (strong)</text>
<rect x="320" y="78" width="200" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="420" y="97" fill="#e6edf3" text-anchor="middle" font-size="11">Path B — raise SNR</text><text x="420" y="112" fill="#9aa7b5" text-anchor="middle" font-size="10">C ∝ log₂SNR (weak)</text>
<rect x="20" y="140" width="200" height="30" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="120" y="159" fill="#9aa7b5" text-anchor="middle" font-size="10">but N=N₀B rises too</text>
<rect x="320" y="140" width="200" height="30" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="420" y="159" fill="#9aa7b5" text-anchor="middle" font-size="10">+3 dB ≈ +B bits/s only</text>
<line x1="240" y1="52" x2="150" y2="76" stroke="#9aa7b5" marker-end="url(#arr2-shannon)"/>
<line x1="300" y1="52" x2="390" y2="76" stroke="#9aa7b5" marker-end="url(#arr2-shannon)"/>
<line x1="120" y1="122" x2="120" y2="138" stroke="#9aa7b5" marker-end="url(#arr2-shannon)"/>
<line x1="420" y1="122" x2="420" y2="138" stroke="#9aa7b5" marker-end="url(#arr2-shannon)"/>
</svg>`,
    caption: String.raw`Two ways to raise capacity: widening bandwidth $B$ is a linear (strong) lever, while raising SNR only helps logarithmically — and adding bandwidth also admits more noise ($N=N_0B$).`,
  },
  {
    title: String.raw`Operating regions: R<C reliable, R>C impossible`,
    svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-shannon" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<line x1="60" y1="130" x2="500" y2="130" stroke="#9aa7b5"/><text x="500" y="148" fill="#9aa7b5" text-anchor="middle" font-size="10">rate R →</text>
<line x1="280" y1="20" x2="280" y2="130" stroke="#ffa94d" stroke-dasharray="4 3"/><text x="280" y="15" fill="#ffa94d" text-anchor="middle" font-size="11">R = C</text>
<rect x="70" y="45" width="190" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="165" y="70" fill="#e6edf3" text-anchor="middle" font-size="11">R &lt; C</text><text x="165" y="88" fill="#9aa7b5" text-anchor="middle" font-size="10">reliable: error → 0</text><text x="165" y="100" fill="#9aa7b5" text-anchor="middle" font-size="10">with long codes</text>
<rect x="300" y="45" width="190" height="60" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="395" y="70" fill="#e6edf3" text-anchor="middle" font-size="11">R &gt; C</text><text x="395" y="88" fill="#9aa7b5" text-anchor="middle" font-size="10">impossible: error</text><text x="395" y="100" fill="#9aa7b5" text-anchor="middle" font-size="10">bounded away from 0</text>
<line x1="165" y1="105" x2="165" y2="128" stroke="#9aa7b5" marker-end="url(#arr3-shannon)"/>
<line x1="395" y1="105" x2="395" y2="128" stroke="#9aa7b5" marker-end="url(#arr3-shannon)"/>
</svg>`,
    caption: String.raw`The coding theorem's sharp threshold at $R=C$: below capacity, arbitrarily reliable communication is achievable; above it, no code can drive the error probability to zero.`,
  }
  ],
  prerequisites: ['comm-basics', 'noise', 'psd'],
  intro: String.raw`<p>In 1948 Claude Shannon founded information theory with a single, astonishing claim: every noisy channel has a finite number — its <b>capacity</b> $C$ — such that reliable (arbitrarily low error) communication is possible at any rate below $C$ and impossible above it. Before Shannon, engineers believed that noise forced an unavoidable trade: to get fewer errors you had to slow down without bound. Shannon proved instead that as long as you stay under $C$, you can drive the error probability to zero by clever coding. This page builds the channel model, defines information and entropy, and derives the celebrated <b>Shannon–Hartley</b> formula $C=B\log_2(1+\mathrm{SNR})$ from first principles.</p>`,
  sections: [
    {
      h: 'The end-to-end channel model',
      html: String.raw`<p>Shannon abstracted every communication system into the same block chain, no matter whether it carries voice, images, or telemetry:</p>
      <p><b>Source → Source encoder → Channel encoder → Modulator → Channel (+ noise) → Demodulator → Channel decoder → Source decoder → Sink.</b></p>
      <ul>
        <li><b>Source</b> produces messages (symbols, samples, bits) with some statistical structure.</li>
        <li><b>Source encoder</b> removes redundancy — compression — squeezing the message toward its entropy $H$ (see <a href="#source-coding">source coding</a>).</li>
        <li><b>Channel encoder</b> deliberately <i>adds</i> structured redundancy (parity, coding) so errors can later be corrected.</li>
        <li><b>Modulator</b> maps bits onto physical waveforms suited to the channel (e.g. <a href="#bpsk">BPSK</a>).</li>
        <li><b>Channel</b> corrupts the waveform with attenuation, distortion and, above all, additive noise.</li>
        <li>The receiver mirrors the transmitter, undoing each stage.</li>
      </ul>
      <p>The two encoders do <i>opposite</i> jobs — one strips redundancy, the other injects it. Shannon's <b>source–channel separation theorem</b> proves that (for a stationary source over a memoryless channel) you lose nothing by designing them independently: compress fully, then protect. This is why real systems have a distinct zip/JPEG/MP3 stage and a distinct FEC stage.</p>
      <div class="callout"><b>Key abstraction.</b> The channel is fully described by a conditional probability law $p(y\mid x)$ — the chance of receiving $y$ given you sent $x$. Everything about capacity follows from this law alone.</div>`
    },
    {
      h: 'Information and entropy',
      html: String.raw`<p>Shannon measured information by <b>surprise</b>. A certain event carries no information; a rare event carries a lot. The information content of an outcome of probability $p$ is $I=-\log_2 p$ bits — halving the probability adds exactly one bit. Averaging over a source gives its <b>entropy</b>:</p>
      $$ H(X) = -\sum_i p_i \log_2 p_i \quad\text{bits/symbol.} $$
      <p>$H$ is maximised (equal to $\log_2 M$ for an $M$-symbol alphabet) when all symbols are equally likely, and it drops toward zero as the source becomes predictable. Entropy is the <b>irreducible</b> average number of bits needed to describe the source — the floor that compression cannot beat.</p>
      <p>For a channel we need <b>mutual information</b> $I(X;Y)=H(Y)-H(Y\mid X)$: how much the received symbol $Y$ tells you about the transmitted symbol $X$. $H(Y\mid X)$ is the leftover uncertainty caused by noise. Capacity is the best mutual information achievable by choosing the input distribution:</p>
      $$ C = \max_{p(x)} I(X;Y). $$
      <div class="callout"><b>Why bits?</b> Base-2 logs give the answer in bits. Use $\ln$ and you get <i>nats</i>; the physics is identical, only the unit changes.</div>`
    },
    {
      h: 'Channel capacity: the noisy-channel coding theorem',
      html: String.raw`<p>Shannon's <b>noisy-channel coding theorem</b> is the heart of it all. It has two halves:</p>
      <ul>
        <li><b>Achievability.</b> For any rate $R<C$ there exist codes of increasing block length whose error probability $\to 0$. The proof uses <i>random coding</i>: pick codewords at random, and typical-set decoding almost always succeeds because random codewords are spread far apart in signal space.</li>
        <li><b>Converse.</b> For any rate $R>C$ the error probability is bounded <i>away</i> from zero no matter how clever the code. You cannot cheat the limit.</li>
      </ul>
      <p>The result is counter-intuitive: reliability does not require slowing down, only staying below $C$ and paying with longer codewords (hence latency and complexity). Modern turbo and LDPC codes operate within a fraction of a dB of $C$, vindicating Shannon after fifty years.</p>
      <p>For the <b>binary symmetric channel</b> that flips each bit with probability $p$, capacity is $C = 1 - H_b(p)$ bits/use, where $H_b(p)=-p\log_2 p-(1-p)\log_2(1-p)$. At $p=0.5$ the channel is useless ($C=0$); at $p=0$ or $1$ it is perfect ($C=1$).</p>`
    },
    {
      h: 'The Shannon–Hartley formula for the AWGN channel',
      html: String.raw`<p>The most-used result specialises capacity to the <b>band-limited additive white Gaussian noise (AWGN)</b> channel — bandwidth $B$ hertz, signal power $S$, noise power $N=N_0 B$:</p>
      $$ \boxed{\,C = B\,\log_2\!\left(1+\frac{S}{N}\right)\ \text{bits/s}.} $$
      <p>Two knobs raise capacity — <b>bandwidth</b> $B$ and <b>signal-to-noise ratio</b> $S/N$ — but they behave very differently. Because SNR sits inside a logarithm, doubling power adds only a fixed increment (about $B$ bits/s at high SNR), whereas capacity grows <i>linearly</i> in $B$. Bandwidth is the more powerful lever, which is why wideband systems (spread spectrum, mmWave, UWB) chase raw capacity.</p>
      <table class="data">
        <tr><th>Regime</th><th>Behaviour</th><th>Consequence</th></tr>
        <tr><td>Power-limited (low SNR)</td><td>$C \approx \dfrac{B}{\ln 2}\cdot\dfrac{S}{N}$, linear in power</td><td>Deep space, spread spectrum — spend bandwidth, save power</td></tr>
        <tr><td>Bandwidth-limited (high SNR)</td><td>$C \approx B\log_2(S/N)$, log in power</td><td>Cable, fibre, dense modulation (QAM)</td></tr>
      </table>`
    },
    {
      h: 'Spectral efficiency and the −1.59 dB limit',
      html: String.raw`<p>Divide capacity by bandwidth to get <b>spectral efficiency</b> $\eta = C/B$ in bits/s/Hz — how many bits you cram into each hertz. Shannon–Hartley says $\eta = \log_2(1+\mathrm{SNR})$. This is the yardstick for every modulation: BPSK reaches $\sim 1$ bit/s/Hz, 64-QAM $\sim 6$, and no scheme can exceed the Shannon curve for its SNR.</p>
      <p>Rewriting capacity in terms of energy-per-bit $E_b$ (with $S=E_b C$ and $N_0$ the noise density) yields a hard floor. As you spend unlimited bandwidth ($B\to\infty$, $\eta\to 0$), the required $E_b/N_0$ approaches</p>
      $$ \frac{E_b}{N_0}\bigg|_{\min} = \ln 2 \approx 0.693 \equiv -1.59\ \text{dB}. $$
      <p>This is the <b>Shannon limit</b>: no matter how good your code, you cannot communicate reliably with less than −1.59 dB of $E_b/N_0$. It is the reference against which every FEC scheme (see <a href="#eb-no">Eb/N0</a>, <a href="#channel-coding">channel coding</a>) is judged — "within 1 dB of Shannon" is the modern badge of honour.</p>
      <div class="callout"><b>Trade-off in one line.</b> More bandwidth buys you a lower power floor (down to −1.59 dB) but lower $\eta$; less bandwidth demands more power per bit. Capacity fixes the exchange rate.</div>`
    },
    {
      h: 'Worked intuition and common pitfalls',
      html: String.raw`<p>A 3 kHz telephone channel at 30 dB SNR gives $C=3000\log_2(1+1000)\approx 3000\times 9.97 \approx 29.9$ kbit/s — remarkably close to the 33.6/56k modem ceiling that real hardware chased. This is the classic sanity check that Shannon's bound is not academic; it predicted the modem plateau.</p>
      <ul>
        <li><b>SNR is a ratio, not dB.</b> Always convert $\mathrm{SNR}_{dB}$ back to linear ($10^{dB/10}$) before putting it in the log.</li>
        <li><b>Capacity is a ceiling, not a promise.</b> It tells you what is <i>possible</i>, not what a given modem achieves.</li>
        <li><b>Bandwidth $\neq$ data rate.</b> A 1 MHz channel can carry far more or far less than 1 Mbit/s depending on SNR and coding.</li>
        <li><b>Zero SNR ⇒ zero capacity? No.</b> $C\to 0$ only as $S\to 0$; even tiny SNR gives positive capacity if bandwidth is large.</li>
      </ul>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<div class="callout tip"><p>Pulling the whole page together, you should now be able to say:</p>
      <ul>
        <li><b>Capacity is a threshold, not a suggestion.</b> There exists a number $C$ below which error can be driven to zero and above which reliable communication is flatly impossible — that is Shannon's central result.</li>
        <li><b>Information is measured by surprise.</b> $H=-\sum p_i\log_2 p_i$ is the average bits per symbol, maximised when symbols are equiprobable, and capacity is the best mutual information $C=\max_{p(x)}I(X;Y)$.</li>
        <li><b>The Shannon–Hartley formula $C=B\log_2(1+\mathrm{SNR})$</b> ties capacity to two knobs, and bandwidth (linear) is a stronger lever than power (logarithmic).</li>
        <li><b>Spectral efficiency $\eta=\log_2(1+\mathrm{SNR})$</b> bounds every modulation, and the energy floor $E_b/N_0\ge\ln2=-1.59$ dB is the deepest limit in communications.</li>
        <li><b>Source and channel coding are separable opposites:</b> compress to $H$, then protect up to $C$; reliable transmission needs $H\le C$.</li>
        <li><b>Why it matters:</b> from the 56k modem plateau to LTE's adaptive QAM and Voyager's near-limit FEC, every real link is engineered against this single ceiling.</li>
      </ul></div>`
    }
  ],
  keyPoints: [
    String.raw`Shannon capacity $C$ is the maximum rate for arbitrarily reliable communication; below $C$ error $\to 0$, above $C$ error is bounded away from zero.`,
    String.raw`The universal channel model is Source → source encoder → channel encoder → modulator → channel → demodulator → channel decoder → sink.`,
    String.raw`Entropy $H=-\sum p_i\log_2 p_i$ measures average information per symbol and is maximised for equiprobable symbols.`,
    String.raw`Capacity is the maximum mutual information: $C=\max_{p(x)} I(X;Y)$.`,
    String.raw`Shannon–Hartley for AWGN: $C=B\log_2(1+\mathrm{SNR})$ bits/s.`,
    String.raw`Capacity is linear in bandwidth but logarithmic in power — bandwidth is the stronger lever.`,
    String.raw`Spectral efficiency $\eta=C/B=\log_2(1+\mathrm{SNR})$ bits/s/Hz bounds every modulation scheme.`,
    String.raw`The absolute Shannon limit on energy is $E_b/N_0 \ge \ln 2 = -1.59$ dB as $B\to\infty$.`,
    String.raw`Source–channel separation: optimal to compress fully, then protect with coding, as two independent stages.`,
    String.raw`Modern LDPC/turbo codes operate within ~1 dB of the Shannon limit.`
  ],
  equations: [
    {
      title: 'Entropy of a source',
      tex: String.raw`$$ H(X) = -\sum_i p_i \log_2 p_i $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want a number that measures the average "surprise" of a source that emits symbol $i$ with probability $p_i$. Whatever measure $I(p)$ we choose for a single outcome must satisfy three sensible axioms.</p>
      <p><b>Step 1 — surprise is a decreasing function of probability.</b> A sure event ($p=1$) should carry zero information, and rarer events should carry more.</p>
      <p><b>Step 2 — independent events add.</b> If two independent things happen, their joint probability multiplies but their information should sum: $I(p_1 p_2)=I(p_1)+I(p_2)$. The only continuous function turning products into sums is the logarithm.</p>
      $$ I(p) = -\log_b p $$
      <p>The minus sign makes $I$ positive (since $p\le 1$), and base $b=2$ gives the unit "bit". Halving $p$ adds exactly one bit — the meaning of a bit.</p>
      <p><b>Step 3 — average over the source.</b> Entropy is the expected information per symbol, weighting each outcome by how often it occurs:</p>
      $$ H(X)=\mathbb{E}[I]=\sum_i p_i\,(-\log_2 p_i). $$
      <p><b>Result.</b> $$ H(X)=-\sum_i p_i\log_2 p_i. $$ Sanity check: for a fair coin $H=-(0.5\log_2 0.5)\times 2 = 1$ bit — exactly one bit per flip, as expected.</p>`
    },
    {
      title: 'Capacity as maximum mutual information',
      tex: String.raw`$$ C=\max_{p(x)} I(X;Y),\quad I(X;Y)=H(Y)-H(Y\mid X) $$`,
      derivation: String.raw`<p><b>Where we start.</b> The channel is a probabilistic map $p(y\mid x)$. We want the most information about the input that the output can convey.</p>
      <p><b>Step 1 — uncertainty before and after.</b> Before observing $Y$, our uncertainty about it is $H(Y)$. After the noise has done its work but knowing what was sent, the residual uncertainty is $H(Y\mid X)$ — this is pure noise.</p>
      <p><b>Step 2 — information is the reduction in uncertainty.</b> The knowledge $Y$ gives us about $X$ is the difference:</p>
      $$ I(X;Y)=H(Y)-H(Y\mid X). $$
      <p>If the channel were noiseless, $H(Y\mid X)=0$ and $I=H(Y)$ — the output tells you everything. If it were pure noise, $H(Y\mid X)=H(Y)$ and $I=0$.</p>
      <p><b>Step 3 — pick the best input.</b> We are free to choose how often we send each input symbol. Capacity is the mutual information under the <i>best</i> input distribution:</p>
      $$ C=\max_{p(x)} I(X;Y). $$
      <p><b>Result.</b> Capacity depends only on the channel law $p(y\mid x)$, not on any particular code — it is a property of the channel itself.</p>`
    },
    {
      title: 'Shannon–Hartley capacity',
      tex: String.raw`$$ C=B\log_2\!\left(1+\frac{S}{N}\right) $$`,
      derivation: String.raw`<p><b>Where we start.</b> Specialise the mutual-information capacity to a band-limited AWGN channel: bandwidth $B$, signal power $S$, additive Gaussian noise of power $N$.</p>
      <p><b>Step 1 — dimensions of the signal space.</b> By the Nyquist sampling theorem a signal of bandwidth $B$ observed for time $T$ has $2BT$ independent real degrees of freedom (samples). Each is one "use" of the channel.</p>
      <p><b>Step 2 — capacity of one Gaussian use.</b> For a single real sample with signal variance $S$ and noise variance $N$, the input that maximises mutual information is Gaussian, and the differential-entropy calculation gives</p>
      $$ C_{\text{use}}=\tfrac12\log_2\!\left(1+\frac{S}{N}\right)\ \text{bits/use.} $$
      <p>Intuition: a Gaussian of variance $S+N$ can be reliably resolved into $\sqrt{(S+N)/N}$ distinguishable levels; taking $\log_2$ of that many levels and the $\tfrac12$ from "per real dimension" yields the formula.</p>
      <p><b>Step 3 — multiply by the number of uses per second.</b> There are $2B$ independent uses per second, so</p>
      $$ C = 2B\times \tfrac12\log_2\!\left(1+\frac{S}{N}\right). $$
      <p><b>Result.</b> $$ C=B\log_2\!\left(1+\frac{S}{N}\right)\ \text{bits/s}. $$ The two factors of $\tfrac12$ and $2$ cancel — a tidy reminder that the "half" in per-dimension capacity and the "two" in $2BT$ are the same fact seen twice.</p>`
    },
    {
      title: 'Spectral efficiency',
      tex: String.raw`$$ \eta=\frac{C}{B}=\log_2(1+\mathrm{SNR}) $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want bits per second <i>per hertz</i>, the fair way to compare a wideband and a narrowband system.</p>
      <p><b>Step 1 — divide capacity by bandwidth.</b> Take Shannon–Hartley and divide both sides by $B$:</p>
      $$ \frac{C}{B}=\log_2(1+\mathrm{SNR}). $$
      <p><b>Step 2 — interpret.</b> $\eta$ tells you the ceiling on modulation order for a given SNR. To reach $\eta=6$ bits/s/Hz (64-QAM) you need $\mathrm{SNR}\ge 2^6-1=63 \approx 18$ dB.</p>
      <p><b>Result.</b> $$ \eta=\log_2(1+\mathrm{SNR}). $$ Every real modulation lives <i>below</i> this curve; the gap to it (in dB) is the coding "implementation loss".</p>`
    },
    {
      title: 'The −1.59 dB Shannon limit',
      tex: String.raw`$$ \left.\frac{E_b}{N_0}\right|_{\min}=\ln 2=-1.59\ \text{dB} $$`,
      derivation: String.raw`<p><b>Where we start.</b> We ask: what is the least energy per bit needed for reliable communication, in the limit of infinite bandwidth?</p>
      <p><b>Step 1 — write SNR in terms of $E_b/N_0$.</b> Signal power is energy-per-bit times bit-rate; at the limit $R=C$: $S=E_b C$. Noise power is density times bandwidth, $N=N_0 B$. So $\mathrm{SNR}=\dfrac{E_b C}{N_0 B}=\dfrac{E_b}{N_0}\,\eta$.</p>
      <p><b>Step 2 — substitute and solve for $E_b/N_0$.</b> From $\eta=\log_2(1+\eta\,E_b/N_0)$, invert:</p>
      $$ \frac{E_b}{N_0}=\frac{2^{\eta}-1}{\eta}. $$
      <p><b>Step 3 — take the wideband limit $\eta\to 0$.</b> Expand $2^{\eta}=e^{\eta\ln 2}\approx 1+\eta\ln 2$, so the numerator $\to \eta\ln 2$ and</p>
      $$ \lim_{\eta\to 0}\frac{E_b}{N_0}=\ln 2 \approx 0.693. $$
      <p><b>Result.</b> $$ 10\log_{10}(\ln 2)=-1.59\ \text{dB}. $$ Below this you literally cannot communicate reliably at any rate — the deepest floor in all of communications.</p>`
    },
    {
      title: 'Binary symmetric channel capacity',
      tex: String.raw`$$ C=1-H_b(p),\quad H_b(p)=-p\log_2 p-(1-p)\log_2(1-p) $$`,
      derivation: String.raw`<p><b>Where we start.</b> The BSC sends a bit and flips it with probability $p$. We use $C=\max_{p(x)}[H(Y)-H(Y\mid X)]$.</p>
      <p><b>Step 1 — the noise term is fixed.</b> Given the input, the output equals the input except for a flip of probability $p$, so the conditional entropy is just the entropy of the flip event, independent of $x$:</p>
      $$ H(Y\mid X)=H_b(p). $$
      <p><b>Step 2 — maximise the output entropy.</b> $H(Y)\le 1$ bit, achieved when the output is equiprobable. Choosing equiprobable inputs makes $Y$ equiprobable, so $\max H(Y)=1$.</p>
      <p><b>Step 3 — combine.</b> $$ C=\max H(Y)-H(Y\mid X)=1-H_b(p). $$</p>
      <p><b>Result.</b> At $p=0.5$, $H_b=1$ so $C=0$ (channel useless); at $p=0$, $C=1$ (perfect). The channel is symmetric in $p\leftrightarrow 1-p$ because a guaranteed flip is as good as no flip.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`State Shannon's capacity theorem in one sentence.`, back: String.raw`Reliable communication is possible for any rate below capacity $C$ and impossible above it.` },
    { front: String.raw`Write the Shannon–Hartley formula.`, back: String.raw`$C=B\log_2(1+\mathrm{SNR})$ bits/s.` },
    { front: String.raw`Define entropy.`, back: String.raw`$H=-\sum_i p_i\log_2 p_i$, the average information (bits) per source symbol.` },
    { front: String.raw`What is capacity in information-theory terms?`, back: String.raw`The maximum mutual information over all input distributions: $C=\max_{p(x)} I(X;Y)$.` },
    { front: String.raw`Is capacity more sensitive to bandwidth or power?`, back: String.raw`Bandwidth — capacity is linear in $B$ but only logarithmic in $S/N$.` },
    { front: String.raw`What is the −1.59 dB limit?`, back: String.raw`The minimum $E_b/N_0=\ln 2$ for reliable communication as bandwidth $\to\infty$.` },
    { front: String.raw`Define spectral efficiency.`, back: String.raw`$\eta=C/B=\log_2(1+\mathrm{SNR})$ in bits/s/Hz.` },
    { front: String.raw`What does the source encoder do vs the channel encoder?`, back: String.raw`Source encoder removes redundancy (compresses); channel encoder adds structured redundancy (protects).` },
    { front: String.raw`State the source–channel separation theorem.`, back: String.raw`For a stationary source over a memoryless channel, compressing then coding separately is optimal.` },
    { front: String.raw`Capacity of a binary symmetric channel with flip probability $p$?`, back: String.raw`$C=1-H_b(p)$, zero at $p=0.5$, one at $p=0$ or $1$.` },
    { front: String.raw`What is mutual information?`, back: String.raw`$I(X;Y)=H(Y)-H(Y\mid X)$ — the reduction in uncertainty about $X$ from observing $Y$.` },
    { front: String.raw`Why does noise not force you to slow down without bound?`, back: String.raw`Shannon proved coding drives error to zero at any rate below $C$; noise sets a rate limit, not a reliability trade.` },
    { front: String.raw`What is the information content of a probability-$p$ event?`, back: String.raw`$I=-\log_2 p$ bits.` },
    { front: String.raw`How close do modern codes get to capacity?`, back: String.raw`LDPC and turbo codes operate within about 1 dB of the Shannon limit.` }
  ],
  mcqs: [
    { q: String.raw`In $C=B\log_2(1+\mathrm{SNR})$, doubling the bandwidth (fixed noise density, fixed power) roughly does what to $C$?`, options: [String.raw`Doubles it exactly`, String.raw`Adds a fixed increment`, String.raw`Increases it, but less than double because SNR per Hz drops`, String.raw`Leaves it unchanged`], answer: 2, explain: String.raw`More bandwidth admits more noise ($N=N_0B$), lowering SNR, so capacity rises but sub-linearly.` },
    { q: String.raw`Entropy $H=-\sum p_i\log_2 p_i$ is maximised when:`, options: [String.raw`One symbol dominates`, String.raw`Symbols are equiprobable`, String.raw`There are only two symbols`, String.raw`The source is periodic`], answer: 1, explain: String.raw`Uniform distribution gives maximum uncertainty, $H=\log_2 M$.` },
    { q: String.raw`The −1.59 dB Shannon limit is the minimum value of:`, options: [String.raw`SNR`, String.raw`$E_b/N_0$`, String.raw`Spectral efficiency`, String.raw`Bandwidth`], answer: 1, explain: String.raw`It is the floor on energy-per-bit to noise-density as bandwidth $\to\infty$.` },
    { q: String.raw`A 3 kHz channel at 30 dB SNR has capacity closest to:`, options: [String.raw`3 kbit/s`, String.raw`10 kbit/s`, String.raw`30 kbit/s`, String.raw`300 kbit/s`], answer: 2, explain: String.raw`$3000\log_2(1001)\approx 3000\times 9.97\approx 30$ kbit/s.` },
    { q: String.raw`Capacity is formally defined as:`, options: [String.raw`$\min I(X;Y)$`, String.raw`$\max_{p(x)} I(X;Y)$`, String.raw`$H(X)-H(Y)$`, String.raw`$B\cdot\mathrm{SNR}$`], answer: 1, explain: String.raw`Maximise mutual information over the input distribution.` },
    { q: String.raw`For a binary symmetric channel with $p=0.5$, capacity is:`, options: [String.raw`1 bit/use`, String.raw`0.5 bit/use`, String.raw`0 bit/use`, String.raw`Infinite`], answer: 2, explain: String.raw`$C=1-H_b(0.5)=1-1=0$; the output is independent of the input.` },
    { q: String.raw`The channel encoder in Shannon's model:`, options: [String.raw`Compresses the source`, String.raw`Adds structured redundancy for error correction`, String.raw`Modulates the carrier`, String.raw`Filters noise`], answer: 1, explain: String.raw`It injects parity/coding so the decoder can correct errors.` },
    { q: String.raw`Which statement about spectral efficiency is correct?`, options: [String.raw`It can exceed $\log_2(1+\mathrm{SNR})$ with good coding`, String.raw`It equals $\log_2(1+\mathrm{SNR})$ at capacity`, String.raw`It is independent of SNR`, String.raw`It is measured in watts`], answer: 1, explain: String.raw`$\eta=C/B=\log_2(1+\mathrm{SNR})$; no scheme exceeds it.` },
    { q: String.raw`Source–channel separation says you may design compression and error-protection:`, options: [String.raw`Only jointly`, String.raw`Independently, with no loss of optimality (under its conditions)`, String.raw`Never together`, String.raw`Only for analog signals`], answer: 1, explain: String.raw`For a stationary source and memoryless channel the two stages can be optimised separately.` },
    { q: String.raw`Information content of an event with probability $1/8$ is:`, options: [String.raw`1 bit`, String.raw`3 bits`, String.raw`8 bits`, String.raw`0 bits`], answer: 1, explain: String.raw`$-\log_2(1/8)=3$ bits.` },
    { q: String.raw`At very low SNR, capacity is approximately:`, options: [String.raw`Independent of SNR`, String.raw`Linear in SNR (and power)`, String.raw`Logarithmic in SNR`, String.raw`Zero for all SNR`], answer: 1, explain: String.raw`$\log_2(1+x)\approx x/\ln 2$ for small $x$, so $C\propto$ power — the power-limited regime.` },
    { q: String.raw`Which is TRUE of the noisy-channel coding theorem's converse?`, options: [String.raw`Above $C$, error can still be made arbitrarily small`, String.raw`Above $C$, error is bounded away from zero for any code`, String.raw`It applies only to noiseless channels`, String.raw`It requires infinite bandwidth`], answer: 1, explain: String.raw`No code can achieve reliability above capacity — that is the converse.` }
  ],
  numericals: [
    { q: String.raw`A channel has $B=1$ MHz and SNR = 20 dB. Find capacity.`, solution: String.raw`<p><b>Formula.</b> $$ C=B\log_2\!\left(1+\mathrm{SNR}\right) $$ where $C$ is capacity (bits/s), $B$ the bandwidth (Hz), and $\mathrm{SNR}$ the <i>linear</i> signal-to-noise ratio.</p>
<p><b>Substitute.</b> First convert the SNR from dB: $\mathrm{SNR}=10^{20/10}=100$. Then $$ C=10^6\times\log_2\!\left(1+100\right)=10^6\times\log_2(101). $$</p>
<p><b>Compute.</b> $\log_2(101)=6.658$, so $C=10^6\times6.658=6.658\times10^6\approx 6.66$ Mbit/s.</p>
<p><b>Explanation.</b> This is the ceiling on error-free throughput for a 1 MHz link at a fairly clean 20 dB SNR. Sanity check: at high SNR each doubling of power (+3 dB) adds only about $B=1$ Mbit/s, confirming the log-law's diminishing returns.</p>` },
    { q: String.raw`What SNR (dB) is needed to reach 8 bits/s/Hz?`, solution: String.raw`<p><b>Formula.</b> $$ \eta=\log_2\!\left(1+\mathrm{SNR}\right)\ \Rightarrow\ \mathrm{SNR}=2^{\eta}-1 $$ where $\eta$ is spectral efficiency (bits/s/Hz) and $\mathrm{SNR}$ is linear.</p>
<p><b>Substitute.</b> $$ \mathrm{SNR}=2^{8}-1=256-1=255. $$</p>
<p><b>Compute.</b> In decibels, $10\log_{10}(255)=10\times2.407=24.07\approx 24.1$ dB.</p>
<p><b>Explanation.</b> Cramming 8 bits into every hertz (roughly 256-QAM territory) demands about 24 dB of SNR — a clean, wired-quality channel. It shows why high-order modulation is reserved for strong links.</p>` },
    { q: String.raw`A source has symbols with probabilities 0.5, 0.25, 0.25. Find its entropy.`, solution: String.raw`<p><b>Formula.</b> $$ H=-\sum_i p_i\log_2 p_i $$ where $p_i$ is the probability of symbol $i$ and $H$ is entropy in bits/symbol.</p>
<p><b>Substitute.</b> $$ H=-\left(0.5\log_2 0.5+0.25\log_2 0.25+0.25\log_2 0.25\right). $$</p>
<p><b>Compute.</b> $\log_2 0.5=-1$ and $\log_2 0.25=-2$, so $H=-(0.5(-1)+0.25(-2)+0.25(-2))=0.5+0.5+0.5=1.5$ bits/symbol.</p>
<p><b>Explanation.</b> The source carries 1.5 bits of information per symbol on average — less than the 2 bits a naïve fixed-length code would spend, so lossless compression can save 25%. Sanity check: $H$ lies below $\log_2 3\approx1.58$, the maximum for three symbols.</p>` },
    { q: String.raw`A BSC has bit-flip probability $p=0.1$. Find its capacity.`, solution: String.raw`<p><b>Formula.</b> $$ C=1-H_b(p),\qquad H_b(p)=-p\log_2 p-(1-p)\log_2(1-p) $$ where $C$ is capacity in bits/use and $H_b$ is the binary entropy of the flip probability $p$.</p>
<p><b>Substitute.</b> $$ H_b(0.1)=-0.1\log_2 0.1-0.9\log_2 0.9. $$</p>
<p><b>Compute.</b> $-0.1\log_2 0.1=0.1\times3.322=0.332$ and $-0.9\log_2 0.9=0.9\times0.152=0.137$, so $H_b=0.469$ and $C=1-0.469=0.531$ bit/use.</p>
<p><b>Explanation.</b> A 10% error rate destroys almost half the channel's information-carrying ability (0.531 of a possible 1 bit/use). Sanity check: at $p=0$ we'd get $C=1$, at $p=0.5$ we'd get $C=0$ — 0.531 sits correctly in between.</p>` },
    { q: String.raw`To send 100 Mbit/s reliably over a 20 MHz channel, what minimum SNR (dB) is required?`, solution: String.raw`<p><b>Formula.</b> $$ \eta=\frac{R}{B},\qquad \mathrm{SNR}=2^{\eta}-1 $$ where $R$ is the required rate, $B$ the bandwidth, and $\eta$ the spectral efficiency that must not exceed $\log_2(1+\mathrm{SNR})$.</p>
<p><b>Substitute.</b> $$ \eta=\frac{100\ \text{Mbit/s}}{20\ \text{MHz}}=5\ \text{bits/s/Hz},\qquad \mathrm{SNR}=2^{5}-1=31. $$</p>
<p><b>Compute.</b> $10\log_{10}(31)=10\times1.491=14.91\approx 14.9$ dB.</p>
<p><b>Explanation.</b> Any real modem needs at least this SNR (plus a coding-gap margin) to run 100 Mbit/s in 20 MHz. It quantifies the direct trade: to fit more bits per hertz you must buy more SNR.</p>` },
    { q: String.raw`Confirm the Shannon limit: compute $E_b/N_0$ at $\eta=1$ bit/s/Hz and compare to $\eta\to 0$.`, solution: String.raw`<p><b>Formula.</b> $$ \frac{E_b}{N_0}=\frac{2^{\eta}-1}{\eta} $$ where $E_b/N_0$ is the energy-per-bit to noise-density ratio and $\eta$ is spectral efficiency.</p>
<p><b>Substitute.</b> At $\eta=1$: $\dfrac{E_b}{N_0}=\dfrac{2^{1}-1}{1}$. In the wideband limit $\eta\to0$: expand $2^{\eta}\approx1+\eta\ln2$ so $\dfrac{E_b}{N_0}\to\ln2$.</p>
<p><b>Compute.</b> At $\eta=1$: $E_b/N_0=1=0$ dB. As $\eta\to0$: $E_b/N_0=\ln2=0.693$, i.e. $10\log_{10}(0.693)=-1.59$ dB.</p>
<p><b>Explanation.</b> The absolute floor of $-1.59$ dB sits exactly 1.59 dB below the $\eta=1$ value, and no coding can beat it. This is why spending unlimited bandwidth (spread spectrum, deep space) buys the lowest possible power per bit.</p>` }
  ],
  realWorld: String.raw`<p>Shannon capacity governs every modern link. Deep-space probes (Voyager, Mars rovers) run at extremely low SNR and enormous bandwidth to sit near the −1.59 dB power-limited corner, leaning on powerful <a href="#channel-coding">FEC</a> to approach capacity. Terrestrial cellular (LTE, 5G) instead operates in the bandwidth-limited regime, packing 64/256-QAM into each hertz and adapting the modulation to the measured SNR — a direct application of $\eta=\log_2(1+\mathrm{SNR})$. Wi-Fi's rate-adaptation, DOCSIS cable modems, and fibre coherent optics all pick the highest constellation their SNR allows without crossing the Shannon curve. The dial-up modem plateau at ~56 kbit/s over a 3–4 kHz phone line was a textbook confirmation that Shannon's ceiling is real and reachable.</p>`,
  related: ['source-coding', 'channel-coding', 'eb-no', 'noise', 'comm-basics']
},
{
  id: 'source-coding',
  title: 'Source Coding (Compression)',
  category: 'Fundamentals',
  tags: ['compression', 'entropy', 'Huffman', 'prefix code', 'lossless', 'lossy', 'redundancy'],
  summary: String.raw`Source coding compresses data by removing redundancy; the entropy $H=-\sum p\log_2 p$ is the hard limit on average bits per symbol for lossless compression.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-source-coding" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="50" width="120" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="68" y="70" fill="#e6edf3" text-anchor="middle">Symbols</text><text x="68" y="86" fill="#9aa7b5" text-anchor="middle" font-size="10">fixed 8 bits each</text>
<rect x="176" y="45" width="150" height="56" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="251" y="66" fill="#e6edf3" text-anchor="middle">Entropy coder</text><text x="251" y="82" fill="#9aa7b5" text-anchor="middle" font-size="10">Huffman: freq→short</text><text x="251" y="95" fill="#ffa94d" text-anchor="middle" font-size="10">L̄ ≥ H</text>
<rect x="374" y="50" width="120" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="434" y="70" fill="#e6edf3" text-anchor="middle">Fewer bits</text><text x="434" y="86" fill="#9aa7b5" text-anchor="middle" font-size="10">→ toward H bits</text>
<text x="251" y="130" fill="#b197fc" text-anchor="middle" font-size="11">compression ratio CR = 8 / H̄</text>
<line x1="128" y1="73" x2="174" y2="73" stroke="#9aa7b5" marker-end="url(#arr-source-coding)"/>
<line x1="326" y1="73" x2="372" y2="73" stroke="#9aa7b5" marker-end="url(#arr-source-coding)"/>
</svg>`,
    caption: String.raw`Source coding: redundant symbols pass through an entropy (Huffman) coder that assigns short codes to frequent symbols, shrinking the stream toward the entropy floor $H$.`,
  },
  {
    title: String.raw`Huffman-tree build: merge lowest two until one root`,
    svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-source-coding" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="82" width="120" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="68" y="100" fill="#e6edf3" text-anchor="middle" font-size="11">probabilities</text><text x="68" y="114" fill="#9aa7b5" text-anchor="middle" font-size="10">A .5 B .25 C .125 D .125</text>
<rect x="152" y="82" width="120" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="212" y="100" fill="#e6edf3" text-anchor="middle" font-size="11">merge lowest two</text><text x="212" y="114" fill="#9aa7b5" text-anchor="middle" font-size="10">C+D → .25 node</text>
<rect x="296" y="82" width="110" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="351" y="100" fill="#e6edf3" text-anchor="middle" font-size="11">repeat → tree</text><text x="351" y="114" fill="#9aa7b5" text-anchor="middle" font-size="10">label edges 0/1</text>
<rect x="430" y="82" width="102" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="481" y="100" fill="#e6edf3" text-anchor="middle" font-size="11">codewords</text><text x="481" y="114" fill="#9aa7b5" text-anchor="middle" font-size="9">0,10,110,111</text>
<line x1="128" y1="102" x2="150" y2="102" stroke="#9aa7b5" marker-end="url(#arr2-source-coding)"/>
<line x1="272" y1="102" x2="294" y2="102" stroke="#9aa7b5" marker-end="url(#arr2-source-coding)"/>
<line x1="406" y1="102" x2="428" y2="102" stroke="#9aa7b5" marker-end="url(#arr2-source-coding)"/>
<text x="270" y="165" fill="#9aa7b5" text-anchor="middle" font-size="10">greedy: frequent symbols end up nearest the root ⇒ shortest codes</text>
</svg>`,
    caption: String.raw`Huffman construction: start from the symbol probabilities, repeatedly merge the two least-probable nodes into a parent, and read root-to-leaf edge labels to get an optimal prefix code (here $\bar{L}=H=1.75$ bits).`,
  },
  {
    title: String.raw`Compress / decompress chain`,
    svg: String.raw`<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-source-coding" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="28" width="96" height="38" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="56" y="45" fill="#e6edf3" text-anchor="middle" font-size="11">source</text><text x="56" y="59" fill="#9aa7b5" text-anchor="middle" font-size="10">8 bits/sym</text>
<rect x="134" y="28" width="110" height="38" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="189" y="45" fill="#e6edf3" text-anchor="middle" font-size="11">encoder (model</text><text x="189" y="59" fill="#9aa7b5" text-anchor="middle" font-size="10">+ Huffman)</text>
<rect x="274" y="28" width="96" height="38" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="322" y="45" fill="#e6edf3" text-anchor="middle" font-size="11">bitstream</text><text x="322" y="59" fill="#9aa7b5" text-anchor="middle" font-size="10">≈ H bits/sym</text>
<rect x="400" y="28" width="110" height="38" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="455" y="45" fill="#e6edf3" text-anchor="middle" font-size="11">decoder</text><text x="455" y="59" fill="#9aa7b5" text-anchor="middle" font-size="10">walk the tree</text>
<rect x="400" y="104" width="110" height="38" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="455" y="121" fill="#e6edf3" text-anchor="middle" font-size="11">exact copy</text><text x="455" y="135" fill="#9aa7b5" text-anchor="middle" font-size="10">lossless</text>
<line x1="104" y1="47" x2="132" y2="47" stroke="#9aa7b5" marker-end="url(#arr3-source-coding)"/>
<line x1="244" y1="47" x2="272" y2="47" stroke="#9aa7b5" marker-end="url(#arr3-source-coding)"/>
<line x1="370" y1="47" x2="398" y2="47" stroke="#9aa7b5" marker-end="url(#arr3-source-coding)"/>
<line x1="455" y1="66" x2="455" y2="102" stroke="#9aa7b5" marker-end="url(#arr3-source-coding)"/>
</svg>`,
    caption: String.raw`The lossless pipeline: a model plus entropy coder compress the source toward $H$ bits/symbol; the decoder walks the same code tree to reconstruct an exact copy — no information is lost.`,
  }
  ],
  prerequisites: ['comm-basics', 'shannon'],
  intro: String.raw`<p><b>Source coding</b> — data compression — is the first processing stage in Shannon's model. Its job is to represent a message with as few bits as possible by stripping out <b>redundancy</b>: the predictable, repetitive, or perceptually irrelevant parts. Shannon's source-coding theorem sets a precise floor — the <b>entropy</b> $H$ — that no lossless coder can beat on average, and Huffman coding gets essentially all the way there. This page builds entropy as the compression limit, constructs prefix and Huffman codes, and separates lossless from lossy compression, with ZIP, JPEG, and MP3 as running examples.</p>`,
  sections: [
    {
      h: 'Why compression is possible: redundancy',
      html: String.raw`<p>Real sources are not random. English text repeats "the", images have smooth regions, audio is dominated by a few tones. This statistical <b>redundancy</b> means the naïve fixed-length representation wastes bits. Source coding exploits three kinds of redundancy:</p>
      <ul>
        <li><b>Statistical / coding redundancy</b> — some symbols are far more common than others, so they deserve shorter codewords (the Morse-code insight: 'E' is one dot).</li>
        <li><b>Inter-symbol redundancy</b> — neighbouring samples are correlated (predictive coding, run-length).</li>
        <li><b>Perceptual redundancy</b> — parts the human eye/ear cannot detect (only exploitable by <i>lossy</i> coders).</li>
      </ul>
      <p>Compression = modelling the source well, then coding the residual efficiently. The better your probability model, the closer you get to the entropy limit.</p>`
    },
    {
      h: 'Entropy: the compression limit',
      html: String.raw`<p>Shannon's <b>source-coding theorem</b> states that a source of entropy $H$ bits/symbol can be losslessly compressed to an average of $H$ bits/symbol, and no lower — you can approach $H$ as closely as you like with long-enough blocks, but never beat it. Entropy is therefore the fundamental yardstick:</p>
      $$ H(X)=-\sum_i p_i\log_2 p_i \quad\text{bits/symbol.} $$
      <p>If a coder uses average length $\bar{L}$ bits/symbol, then $\bar{L}\ge H$ always, and the gap</p>
      $$ \text{redundancy} = \bar{L}-H \ge 0 $$
      <p>measures inefficiency. A source with low entropy (predictable) compresses a lot; a maximum-entropy source (equiprobable, uncorrelated) cannot be compressed at all — its $H=\log_2 M$ already equals the fixed-length cost.</p>
      <div class="callout"><b>Key insight.</b> Compression cannot create information; it can only remove the bits you were spending on redundancy. Once you hit $H$, every remaining bit is essential.</div>`
    },
    {
      h: 'Prefix codes and the Kraft inequality',
      html: String.raw`<p>To be uniquely decodable without markers, variable-length codes are usually <b>prefix (instantaneous) codes</b>: no codeword is a prefix of another, so the decoder knows exactly where each symbol ends. Prefix codes correspond to leaves of a binary tree.</p>
      <p>A set of codeword lengths $\{\ell_i\}$ is realisable as a prefix code if and only if it satisfies the <b>Kraft inequality</b>:</p>
      $$ \sum_i 2^{-\ell_i} \le 1. $$
      <p>This is the mathematical budget: short codewords are "expensive" because they consume more of the tree. Combining Kraft with entropy proves the source-coding bound $\bar{L}\ge H$, achieved when $\ell_i = -\log_2 p_i$ (which is why frequent symbols get short codes).</p>`
    },
    {
      h: 'Huffman coding',
      html: String.raw`<p><b>Huffman coding</b> builds the optimal prefix code for a known symbol distribution with a beautifully simple greedy rule:</p>
      <ol>
        <li>List all symbols with their probabilities.</li>
        <li>Repeatedly merge the two <i>least</i>-probable nodes into a parent whose probability is their sum.</li>
        <li>Continue until one root remains; label edges 0/1.</li>
        <li>Read each symbol's codeword from root to leaf.</li>
      </ol>
      <p>The result is provably optimal among all prefix codes: its average length is within one bit of entropy, $H\le \bar{L}_{\text{Huffman}} < H+1$. Coding blocks of symbols shrinks that gap toward zero.</p>
      <table class="data">
        <tr><th>Symbol</th><th>Prob</th><th>Huffman code</th><th>Length</th></tr>
        <tr><td>A</td><td>0.5</td><td>0</td><td>1</td></tr>
        <tr><td>B</td><td>0.25</td><td>10</td><td>2</td></tr>
        <tr><td>C</td><td>0.125</td><td>110</td><td>3</td></tr>
        <tr><td>D</td><td>0.125</td><td>111</td><td>3</td></tr>
      </table>
      <p>Here $\bar{L}=0.5(1)+0.25(2)+0.125(3)+0.125(3)=1.75$ bits, exactly equal to $H=1.75$ — a perfect match because all probabilities are powers of two. <b>Arithmetic coding</b> and range coding go further, escaping the one-bit-per-symbol granularity of Huffman.</p>`
    },
    {
      h: 'Lossless vs lossy compression',
      html: String.raw`<p>Two families with different guarantees:</p>
      <ul>
        <li><b>Lossless</b> — perfect reconstruction, bounded by entropy. Used where every bit matters: text (ZIP/gzip/DEFLATE = LZ77 + Huffman), PNG images, FLAC audio, executables. Typical ratios 2:1–4:1.</li>
        <li><b>Lossy</b> — discards perceptually irrelevant detail; NOT reversible, but ratios of 10:1–100:1. Used for media: JPEG (DCT + quantisation + Huffman), MP3/AAC (psychoacoustic masking), H.264/H.265 video. Governed by <b>rate–distortion theory</b>, $R(D)$: the minimum bits to achieve distortion $\le D$.</li>
      </ul>
      <p>Lossy coders combine a <i>transform</i> (DCT, wavelet, or MDCT) that concentrates energy into few coefficients, <i>quantisation</i> that throws away precision where the ear/eye won't notice, and a final <i>lossless entropy coder</i> on the survivors. The entropy coder at the end is where classical source coding still lives inside every JPEG and MP3.</p>`
    },
    {
      h: 'Relation to channel coding and the big picture',
      html: String.raw`<p>Source coding and <a href="#channel-coding">channel coding</a> are complementary opposites. Source coding <b>removes</b> redundancy to hit the entropy floor; channel coding <b>adds</b> calculated redundancy to survive noise. Shannon's <b>source–channel separation theorem</b> proves that, for a stationary source over a memoryless channel, you can design the two independently and still be optimal — first compress to $H$, then protect up to capacity $C$. Reliable end-to-end transmission is possible exactly when</p>
      $$ H \le C. $$
      <p>This is why the file on your disk is compressed (JPEG) yet still transmits with error-correction (Wi-Fi FEC): the two stages coexist without stepping on each other. In practice the separation is not perfect for finite blocks or fading channels, which motivates <i>joint source–channel coding</i>, but the clean textbook split remains the design default.</p>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<div class="callout tip"><p>After this page you should be comfortable with the following:</p>
      <ul>
        <li><b>Compression removes redundancy, it never invents information.</b> The floor is the entropy $H$, and $\bar{L}\ge H$ always holds.</li>
        <li><b>Prefix codes are decodable without markers</b> because no codeword prefixes another, and the Kraft inequality $\sum 2^{-\ell_i}\le1$ decides which length sets are realisable.</li>
        <li><b>Huffman coding is the optimal prefix code</b> — greedily merge the two least-probable nodes — with $H\le\bar{L}<H+1$; blocking symbols or arithmetic coding closes the gap.</li>
        <li><b>Lossless (ZIP, PNG, FLAC) reconstructs exactly; lossy (JPEG, MP3, H.264) discards perceptual detail</b> for far higher ratios, governed by rate–distortion $R(D)$.</li>
        <li><b>Ideal codeword length is $\ell_i=-\log_2 p_i$:</b> frequent symbols deserve short codes (the Morse-code insight made rigorous).</li>
        <li><b>Why it matters:</b> every gzip transfer, photo, and streamed song ends in an entropy coder, so this theory runs billions of times a second worldwide.</li>
      </ul></div>`
    }
  ],
  keyPoints: [
    String.raw`Entropy $H=-\sum p_i\log_2 p_i$ is the lossless compression limit: average length $\bar{L}\ge H$ always.`,
    String.raw`Redundancy $=\bar{L}-H\ge 0$ measures how far a code is from optimal.`,
    String.raw`Compression works by modelling and removing statistical, inter-symbol, and (lossy only) perceptual redundancy.`,
    String.raw`Prefix codes are uniquely and instantaneously decodable; no codeword prefixes another.`,
    String.raw`The Kraft inequality $\sum 2^{-\ell_i}\le 1$ decides which length sets are realisable as prefix codes.`,
    String.raw`Huffman coding is the optimal prefix code; $H\le \bar{L}<H+1$.`,
    String.raw`Ideal codeword length is $\ell_i=-\log_2 p_i$ — frequent symbols get short codes.`,
    String.raw`Lossless (ZIP, PNG, FLAC) is reversible; lossy (JPEG, MP3, H.264) trades fidelity for far higher ratios.`,
    String.raw`Lossy coders = transform + quantise + entropy-code; governed by rate–distortion $R(D)$.`,
    String.raw`Source–channel separation: compress to $H$, then protect up to $C$; reliable transmission needs $H\le C$.`
  ],
  equations: [
    {
      title: 'Entropy as the compression limit',
      tex: String.raw`$$ \bar{L} \ge H(X) = -\sum_i p_i\log_2 p_i $$`,
      derivation: String.raw`<p><b>Where we start.</b> We encode each symbol $i$ (probability $p_i$) with a codeword of length $\ell_i$. The average length is $\bar{L}=\sum_i p_i \ell_i$. We want to show it can never fall below entropy.</p>
      <p><b>Step 1 — treat lengths as an implied distribution.</b> Define $q_i = 2^{-\ell_i}/Z$ where $Z=\sum_i 2^{-\ell_i}\le 1$ by the Kraft inequality. Then $\ell_i = -\log_2(q_i Z)= -\log_2 q_i - \log_2 Z$.</p>
      <p><b>Step 2 — write the difference $\bar{L}-H$.</b> Substitute:</p>
      $$ \bar{L}-H=\sum_i p_i\ell_i + \sum_i p_i\log_2 p_i = \sum_i p_i\log_2\frac{p_i}{q_i} - \log_2 Z. $$
      <p><b>Step 3 — apply non-negativity of relative entropy.</b> The sum $\sum p_i\log_2(p_i/q_i)$ is the Kullback–Leibler divergence, which is $\ge 0$ (Gibbs' inequality). And $-\log_2 Z\ge 0$ because $Z\le 1$.</p>
      <p><b>Result.</b> Both terms are non-negative, so $$ \bar{L}\ge H. $$ Equality holds when $q_i=p_i$ and $Z=1$, i.e. $\ell_i=-\log_2 p_i$ — the code matches the source perfectly.</p>`
    },
    {
      title: 'Kraft inequality',
      tex: String.raw`$$ \sum_i 2^{-\ell_i}\le 1 $$`,
      derivation: String.raw`<p><b>Where we start.</b> A prefix code is a set of leaves in a binary tree of depth $L_{\max}=\max_i \ell_i$. Each codeword of length $\ell_i$ is a node at depth $\ell_i$.</p>
      <p><b>Step 1 — count descendants.</b> A node at depth $\ell_i$ owns $2^{L_{\max}-\ell_i}$ of the $2^{L_{\max}}$ leaves at the bottom level.</p>
      <p><b>Step 2 — prefix condition = disjoint subtrees.</b> Because no codeword is a prefix of another, the subtrees rooted at the codeword nodes do not overlap, so their leaf-counts sum to at most the total:</p>
      $$ \sum_i 2^{L_{\max}-\ell_i} \le 2^{L_{\max}}. $$
      <p><b>Step 3 — divide by $2^{L_{\max}}$.</b></p>
      $$ \sum_i 2^{-\ell_i}\le 1. $$
      <p><b>Result.</b> Any realisable prefix code obeys this budget, and conversely any lengths satisfying it can be arranged into a prefix code — short codewords cost exponentially more of the tree.</p>`
    },
    {
      title: 'Huffman bound',
      tex: String.raw`$$ H \le \bar{L}_{\text{Huffman}} < H+1 $$`,
      derivation: String.raw`<p><b>Where we start.</b> Huffman produces the minimum-$\bar{L}$ prefix code. The lower bound $\bar{L}\ge H$ we already proved; we now bound it from above.</p>
      <p><b>Step 1 — choose Shannon lengths.</b> Pick $\ell_i=\lceil -\log_2 p_i\rceil$. These satisfy Kraft (each rounds up), so a prefix code with these lengths exists.</p>
      <p><b>Step 2 — bound its average length.</b> Since $\lceil x\rceil < x+1$:</p>
      $$ \bar{L}_{\text{Shannon}}=\sum_i p_i\lceil -\log_2 p_i\rceil < \sum_i p_i(-\log_2 p_i +1)=H+1. $$
      <p><b>Step 3 — Huffman is no worse.</b> Huffman is optimal, so $\bar{L}_{\text{Huffman}}\le \bar{L}_{\text{Shannon}}<H+1$.</p>
      <p><b>Result.</b> $$ H\le \bar{L}_{\text{Huffman}}<H+1. $$ Encoding blocks of $n$ symbols divides the "+1" penalty by $n$, so per-symbol length $\to H$.</p>`
    },
    {
      title: 'Redundancy of a code',
      tex: String.raw`$$ \rho = \bar{L}-H = \sum_i p_i\ell_i + \sum_i p_i\log_2 p_i $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want a single number for how wasteful a code is.</p>
      <p><b>Step 1 — average length minus the floor.</b> The best any code can do is $H$; the code actually spends $\bar{L}=\sum p_i\ell_i$. The waste is the difference.</p>
      $$ \rho=\bar{L}-H. $$
      <p><b>Step 2 — interpret.</b> $\rho\ge 0$ by the source-coding theorem; $\rho=0$ only for a perfectly matched code ($\ell_i=-\log_2 p_i$).</p>
      <p><b>Result.</b> Efficiency is often quoted as $\eta=H/\bar{L}\le 1$. A code with $H=1.75$, $\bar{L}=1.75$ has $\rho=0$, $\eta=100\%$.</p>`
    },
    {
      title: 'Compression ratio and rate–distortion',
      tex: String.raw`$$ \text{CR}=\frac{\text{original size}}{\text{compressed size}},\qquad R(D)=\min_{\,\mathbb{E}[d]\le D} I(X;\hat{X}) $$`,
      derivation: String.raw`<p><b>Where we start.</b> For lossless coding we measure success by compression ratio; for lossy we need the minimum bits per symbol at a given allowed distortion $D$.</p>
      <p><b>Step 1 — lossless ratio.</b> If a fixed-length source used $b$ bits/symbol and entropy coding uses $\bar{L}\approx H$, the ratio is $\text{CR}=b/H$. A uniform 8-bit source with $H=2$ compresses 4:1.</p>
      <p><b>Step 2 — lossy: allow error.</b> Let $d(x,\hat{x})$ measure distortion. Among all reproductions with average distortion $\le D$, the rate–distortion function is the smallest mutual information (bits/symbol) needed:</p>
      $$ R(D)=\min_{p(\hat{x}\mid x):\,\mathbb{E}[d]\le D} I(X;\hat{X}). $$
      <p><b>Step 3 — behaviour.</b> $R(D)$ decreases from $H$ (at $D=0$, lossless) to $0$ (at maximum tolerable distortion). It is the lossy analogue of entropy.</p>
      <p><b>Result.</b> For a Gaussian source of variance $\sigma^2$ with squared-error distortion, $R(D)=\tfrac12\log_2(\sigma^2/D)$ — every extra bit halves the distortion (6 dB/bit), the rule behind JPEG/MP3 quality knobs.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What is the fundamental limit of lossless compression?`, back: String.raw`The source entropy $H=-\sum p_i\log_2 p_i$; average length $\bar{L}\ge H$.` },
    { front: String.raw`State the Kraft inequality.`, back: String.raw`$\sum_i 2^{-\ell_i}\le 1$ — the condition for codeword lengths to form a prefix code.` },
    { front: String.raw`What makes a code a prefix (instantaneous) code?`, back: String.raw`No codeword is a prefix of any other, so it decodes without lookahead.` },
    { front: String.raw`How does Huffman coding build its tree?`, back: String.raw`Greedily merge the two least-probable nodes until one root remains, then label edges 0/1.` },
    { front: String.raw`How close is Huffman to entropy?`, back: String.raw`$H\le \bar{L}<H+1$; blocking symbols shrinks the gap.` },
    { front: String.raw`Ideal codeword length for a symbol of probability $p$?`, back: String.raw`$\ell=-\log_2 p$ bits.` },
    { front: String.raw`Lossless vs lossy — one-line difference.`, back: String.raw`Lossless reconstructs exactly (bounded by $H$); lossy discards perceptual detail for far higher ratios.` },
    { front: String.raw`Name a lossless and a lossy real codec.`, back: String.raw`Lossless: ZIP/DEFLATE, PNG, FLAC. Lossy: JPEG, MP3, H.264.` },
    { front: String.raw`What three stages make up a typical lossy coder?`, back: String.raw`Transform (DCT/wavelet), quantisation, then entropy coding of the survivors.` },
    { front: String.raw`Define redundancy of a code.`, back: String.raw`$\rho=\bar{L}-H\ge 0$; zero for a perfectly matched code.` },
    { front: String.raw`What does source–channel separation state?`, back: String.raw`Compress to $H$ and protect to $C$ separately; reliable transmission needs $H\le C$.` },
    { front: String.raw`What is rate–distortion $R(D)$?`, back: String.raw`The minimum bits/symbol to reproduce a source within distortion $D$; the lossy analogue of entropy.` },
    { front: String.raw`Why can equiprobable, uncorrelated sources not be compressed?`, back: String.raw`Their entropy already equals the fixed-length cost $\log_2 M$; there is no redundancy to remove.` },
    { front: String.raw`What algorithm beats Huffman's one-bit granularity?`, back: String.raw`Arithmetic (range) coding, which codes fractional bits per symbol.` }
  ],
  mcqs: [
    { q: String.raw`The minimum average number of bits per symbol for lossless coding equals:`, options: [String.raw`The alphabet size`, String.raw`The source entropy $H$`, String.raw`Twice the entropy`, String.raw`Always 8`], answer: 1, explain: String.raw`Shannon's source-coding theorem: $\bar{L}\ge H$.` },
    { q: String.raw`A prefix code guarantees:`, options: [String.raw`Fixed-length codewords`, String.raw`No codeword is a prefix of another`, String.raw`Lossy compression`, String.raw`Maximum entropy`], answer: 1, explain: String.raw`That is the definition, enabling instantaneous decoding.` },
    { q: String.raw`Huffman coding is optimal among:`, options: [String.raw`All possible codes`, String.raw`Prefix codes for a known distribution`, String.raw`Lossy codes`, String.raw`Fixed-length codes`], answer: 1, explain: String.raw`It gives the minimum-$\bar{L}$ prefix code for a given symbol distribution.` },
    { q: String.raw`The Kraft inequality is:`, options: [String.raw`$\sum 2^{-\ell_i}\le 1$`, String.raw`$\sum \ell_i=1$`, String.raw`$\sum p_i=1$`, String.raw`$\prod p_i\le 1$`], answer: 0, explain: String.raw`It bounds realisable prefix-code lengths.` },
    { q: String.raw`Which is a lossy compression standard?`, options: [String.raw`PNG`, String.raw`FLAC`, String.raw`JPEG`, String.raw`ZIP`], answer: 2, explain: String.raw`JPEG discards perceptual detail via DCT quantisation; the others are lossless.` },
    { q: String.raw`The ideal codeword length for a symbol of probability $0.25$ is:`, options: [String.raw`1 bit`, String.raw`2 bits`, String.raw`4 bits`, String.raw`0.25 bits`], answer: 1, explain: String.raw`$-\log_2 0.25=2$ bits.` },
    { q: String.raw`Redundancy of a code is defined as:`, options: [String.raw`$H-\bar{L}$`, String.raw`$\bar{L}-H$`, String.raw`$\bar{L}\times H$`, String.raw`$H/\bar{L}$`], answer: 1, explain: String.raw`Excess average length over entropy, always $\ge 0$.` },
    { q: String.raw`A source with maximum entropy (equiprobable, uncorrelated) can be compressed by:`, options: [String.raw`A factor of 2`, String.raw`A factor of 10`, String.raw`Essentially not at all`, String.raw`An infinite factor`], answer: 2, explain: String.raw`No redundancy remains to remove.` },
    { q: String.raw`The three stages of a typical lossy coder are:`, options: [String.raw`Modulate, filter, amplify`, String.raw`Transform, quantise, entropy-code`, String.raw`Encrypt, interleave, transmit`, String.raw`Sample, hold, convert`], answer: 1, explain: String.raw`e.g. DCT → quantise → Huffman in JPEG.` },
    { q: String.raw`Source–channel separation implies reliable transmission is possible when:`, options: [String.raw`$H\ge C$`, String.raw`$H\le C$`, String.raw`$H=0$`, String.raw`$C=0$`], answer: 1, explain: String.raw`The compressed rate $H$ must fit within the channel capacity $C$.` },
    { q: String.raw`Arithmetic coding improves on Huffman by:`, options: [String.raw`Being lossy`, String.raw`Coding fractional bits per symbol`, String.raw`Requiring no probability model`, String.raw`Using fixed-length codes`], answer: 1, explain: String.raw`It escapes Huffman's integer-bit-per-symbol granularity.` },
    { q: String.raw`For a Gaussian source, each extra bit of rate reduces distortion by about:`, options: [String.raw`1 dB`, String.raw`3 dB`, String.raw`6 dB`, String.raw`20 dB`], answer: 2, explain: String.raw`$R(D)=\tfrac12\log_2(\sigma^2/D)$ gives 6 dB/bit.` }
  ],
  numericals: [
    { q: String.raw`A source has 4 symbols with probabilities 0.5, 0.25, 0.125, 0.125. Find $H$ and design a Huffman code; compute $\bar{L}$.`, solution: String.raw`<p><b>Formula.</b> $$ H=-\sum_i p_i\log_2 p_i,\qquad \bar{L}=\sum_i p_i\ell_i $$ where $p_i$ is a symbol's probability, $\ell_i$ its codeword length, $H$ the entropy and $\bar{L}$ the average code length (bits/symbol).</p>
<p><b>Substitute.</b> $$ H=-\left[0.5\log_2 0.5+0.25\log_2 0.25+0.125\log_2 0.125+0.125\log_2 0.125\right]. $$</p>
<p><b>Compute.</b> Using $\log_2 0.5=-1,\ \log_2 0.25=-2,\ \log_2 0.125=-3$: $H=0.5(1)+0.25(2)+0.125(3)+0.125(3)=0.5+0.5+0.375+0.375=1.75$ bits. Huffman (merge the two 0.125's, then the 0.25's, then the 0.5) gives A=0, B=10, C=110, D=111, so $\bar{L}=0.5(1)+0.25(2)+0.125(3)+0.125(3)=1.75$ bits.</p>
<p><b>Explanation.</b> $\bar{L}=H$ exactly, so redundancy $\rho=0$ and efficiency is 100%. This perfect match happens because every probability is a power of two, letting $\ell_i=-\log_2 p_i$ be an integer.</p>` },
    { q: String.raw`A file of 1000 8-bit symbols has entropy $H=3$ bits/symbol. What is the best possible compressed size and the compression ratio?`, solution: String.raw`<p><b>Formula.</b> $$ S_{\min}=n\,H,\qquad \text{CR}=\frac{b}{H} $$ where $n$ is the number of symbols, $H$ the entropy (bits/symbol), $b$ the original bits/symbol, $S_{\min}$ the smallest lossless size and CR the compression ratio.</p>
<p><b>Substitute.</b> $$ S_{\min}=1000\times3=3000\ \text{bits},\qquad \text{CR}=\frac{8}{3}. $$</p>
<p><b>Compute.</b> $S_{\min}=3000$ bits $=375$ bytes (versus the original $1000\times8=8000$ bits $=1000$ bytes), and $\text{CR}=8/3\approx 2.67:1$.</p>
<p><b>Explanation.</b> Entropy caps the compression: no lossless coder can beat 375 bytes on average. Sanity check: the file used 8 bits but needed only 3, so we discard 5 bits of pure redundancy per symbol.</p>` },
    { q: String.raw`Two symbols have probabilities 0.9 and 0.1. Find the entropy and comment on Huffman efficiency.`, solution: String.raw`<p><b>Formula.</b> $$ H=-\sum_i p_i\log_2 p_i,\qquad \eta=\frac{H}{\bar{L}} $$ where $\eta$ is the code efficiency and $\bar{L}$ the average Huffman length.</p>
<p><b>Substitute.</b> $$ H=-0.9\log_2 0.9-0.1\log_2 0.1. $$</p>
<p><b>Compute.</b> $-0.9\log_2 0.9=0.9\times0.152=0.137$ and $-0.1\log_2 0.1=0.1\times3.322=0.332$, so $H=0.469$ bits. A two-symbol Huffman code must assign 1 bit to each, giving $\bar{L}=1$, hence $\eta=0.469/1=0.469$ (47%).</p>
<p><b>Explanation.</b> Huffman's one-bit-per-symbol granularity wastes over half the potential here because the source is highly skewed. Coding blocks of symbols (or using arithmetic coding) recovers most of the lost 0.531 bits.</p>` },
    { q: String.raw`Do the lengths $\{1,2,2,3\}$ satisfy the Kraft inequality?`, solution: String.raw`<p><b>Formula.</b> $$ \sum_i 2^{-\ell_i}\le 1 $$ where $\ell_i$ are the codeword lengths; a prefix code with these lengths exists iff the sum is $\le 1$.</p>
<p><b>Substitute.</b> $$ \sum_i 2^{-\ell_i}=2^{-1}+2^{-2}+2^{-2}+2^{-3}. $$</p>
<p><b>Compute.</b> $=0.5+0.25+0.25+0.125=1.125$, which is $>1$.</p>
<p><b>Explanation.</b> The budget is exceeded, so these lengths <b>cannot</b> form a prefix (uniquely decodable) code — the short codewords consume too much of the tree. You would need to lengthen at least one codeword to satisfy Kraft.</p>` },
    { q: String.raw`A Gaussian source has variance $\sigma^2=100$. What rate $R$ achieves distortion $D=1$ (MSE)?`, solution: String.raw`<p><b>Formula.</b> $$ R(D)=\tfrac12\log_2\!\left(\frac{\sigma^2}{D}\right) $$ the rate–distortion function of a Gaussian source, where $\sigma^2$ is the source variance and $D$ the allowed mean-squared distortion (bits/sample).</p>
<p><b>Substitute.</b> $$ R=\tfrac12\log_2\!\left(\frac{100}{1}\right)=\tfrac12\log_2(100). $$</p>
<p><b>Compute.</b> $\log_2(100)=6.644$, so $R=\tfrac12(6.644)=3.32$ bits/sample.</p>
<p><b>Explanation.</b> About 3.3 bits per sample suffice to hold the error to $D=1$. Sanity check: each extra bit multiplies $\sigma^2/D$ by 4 (halves the RMS error), the familiar 6 dB-per-bit rule behind quality sliders in JPEG/MP3.</p>` },
    { q: String.raw`A source alphabet of 8 equiprobable symbols is coded. What is $H$, and can any lossless coder do better than 3 bits/symbol?`, solution: String.raw`<p><b>Formula.</b> $$ H=\log_2 M $$ the entropy of an $M$-symbol equiprobable (maximum-entropy) source, in bits/symbol.</p>
<p><b>Substitute.</b> $$ H=\log_2 8. $$</p>
<p><b>Compute.</b> $\log_2 8=3$ bits/symbol.</p>
<p><b>Explanation.</b> With every symbol equally likely and uncorrelated there is no redundancy to remove, so 3 bits/symbol is already optimal ($\bar{L}\ge H=3$). No lossless coder can do better — the fixed-length code is entropy-optimal here.</p>` }
  ],
  realWorld: String.raw`<p>Source coding is everywhere on the machine you're reading this on. Text and code files travel as gzip/DEFLATE (LZ77 dictionary matching followed by Huffman) inside HTTP; your photos are JPEG (block DCT, perceptual quantisation, Huffman on the coefficients); music streams as MP3/AAC using psychoacoustic masking to drop sounds the ear can't hear; video calls use H.264/H.265 motion compensation and transform coding to hit 100:1 ratios. Every one of these ends in a classical entropy coder, so the Huffman and arithmetic-coding theory here is running billions of times per second worldwide. The entropy limit even shows up in benchmarks: a text compressor quoting "1.8 bits/character" on English is implicitly claiming the language's entropy is around that value.</p>`,
  related: ['shannon', 'channel-coding', 'comm-basics', 'fec']
},
{
  id: 'sinc-function',
  title: 'The Sinc Function',
  category: 'Signals & Systems',
  tags: ['sinc', 'Fourier transform', 'sampling', 'reconstruction', 'pulse shaping', 'Gibbs'],
  summary: String.raw`The sinc function $\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$ is the Fourier transform of a rectangle and the ideal interpolation kernel for reconstructing sampled signals.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-sinc-function" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#b197fc"/></marker></defs>
<text x="120" y="24" fill="#9aa7b5" text-anchor="middle" font-size="11">frequency domain</text>
<rect x="40" y="80" width="70" height="50" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="120" y="112" fill="#e6edf3" text-anchor="middle" font-size="11">rect (box)</text>
<line x1="40" y1="130" x2="200" y2="130" stroke="#9aa7b5"/>
<text x="420" y="24" fill="#9aa7b5" text-anchor="middle" font-size="11">time domain</text>
<path d="M330,130 Q345,130 352,110 Q360,60 370,60 Q380,60 388,110 Q395,130 410,130 Q425,130 432,118 Q440,105 448,118 Q455,130 470,130 Q485,130 492,122 Q498,116 505,122" fill="none" stroke="#63e6be" stroke-width="1.5"/>
<line x1="330" y1="130" x2="510" y2="130" stroke="#9aa7b5"/>
<text x="420" y="150" fill="#e6edf3" text-anchor="middle" font-size="11">sinc</text>
<line x1="215" y1="105" x2="320" y2="105" stroke="#b197fc" marker-end="url(#arr-sinc-function)"/>
<line x1="320" y1="115" x2="215" y2="115" stroke="#b197fc" marker-end="url(#arr-sinc-function)"/>
<text x="267" y="95" fill="#ffa94d" text-anchor="middle" font-size="14">↔</text>
<text x="267" y="135" fill="#9aa7b5" text-anchor="middle" font-size="10">Fourier dual</text>
</svg>`,
    caption: String.raw`Fourier duality: a rectangle (brick-wall box) in one domain transforms to a sinc in the other — the rect$\leftrightarrow$sinc pair.`,
  },
  {
    title: String.raw`Ideal reconstruction: samples → summed sinc kernels`,
    svg: String.raw`<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-sinc-function" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="70" width="104" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="60" y="88" fill="#e6edf3" text-anchor="middle" font-size="11">samples</text><text x="60" y="103" fill="#9aa7b5" text-anchor="middle" font-size="10">x(nTₛ)</text>
<rect x="150" y="65" width="130" height="54" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="215" y="86" fill="#e6edf3" text-anchor="middle" font-size="11">plant a sinc kernel</text><text x="215" y="101" fill="#9aa7b5" text-anchor="middle" font-size="10">scaled &amp; shifted</text><text x="215" y="113" fill="#9aa7b5" text-anchor="middle" font-size="10">zero at other samples</text>
<rect x="318" y="65" width="120" height="54" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="378" y="86" fill="#e6edf3" text-anchor="middle" font-size="11">superpose (Σ)</text><text x="378" y="101" fill="#9aa7b5" text-anchor="middle" font-size="10">ideal LPF in freq</text>
<rect x="470" y="70" width="62" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="501" y="88" fill="#e6edf3" text-anchor="middle" font-size="11">x(t)</text><text x="501" y="103" fill="#9aa7b5" text-anchor="middle" font-size="9">exact</text>
<line x1="112" y1="92" x2="148" y2="92" stroke="#9aa7b5" marker-end="url(#arr2-sinc-function)"/>
<line x1="280" y1="92" x2="316" y2="92" stroke="#9aa7b5" marker-end="url(#arr2-sinc-function)"/>
<line x1="438" y1="92" x2="468" y2="92" stroke="#9aa7b5" marker-end="url(#arr2-sinc-function)"/>
<text x="270" y="150" fill="#9aa7b5" text-anchor="middle" font-size="10">Whittaker–Shannon: each sinc = 1 at its own sample, 0 at all others</text>
</svg>`,
    caption: String.raw`Ideal interpolation mechanism: each sample plants a scaled, shifted $\mathrm{sinc}$; because every kernel is zero at all other sample instants, their sum passes through every sample and fills the gaps — equivalent to an ideal low-pass filter that deletes the spectral images.`,
  },
  {
    title: String.raw`Time–frequency duality map`,
    svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-sinc-function" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#b197fc"/></marker></defs>
<rect x="20" y="30" width="190" height="42" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="115" y="49" fill="#e6edf3" text-anchor="middle" font-size="11">narrow rect (time)</text><text x="115" y="63" fill="#9aa7b5" text-anchor="middle" font-size="10">short pulse</text>
<rect x="330" y="30" width="190" height="42" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="425" y="49" fill="#e6edf3" text-anchor="middle" font-size="11">wide sinc (freq)</text><text x="425" y="63" fill="#9aa7b5" text-anchor="middle" font-size="10">broad spectrum</text>
<rect x="20" y="104" width="190" height="42" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="115" y="123" fill="#e6edf3" text-anchor="middle" font-size="11">wide rect (freq)</text><text x="115" y="137" fill="#9aa7b5" text-anchor="middle" font-size="10">brick-wall LPF</text>
<rect x="330" y="104" width="190" height="42" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="425" y="123" fill="#e6edf3" text-anchor="middle" font-size="11">narrow sinc (time)</text><text x="425" y="137" fill="#9aa7b5" text-anchor="middle" font-size="10">long impulse response</text>
<line x1="210" y1="51" x2="328" y2="51" stroke="#b197fc" marker-end="url(#arr3-sinc-function)"/>
<line x1="210" y1="125" x2="328" y2="125" stroke="#b197fc" marker-end="url(#arr3-sinc-function)"/>
<text x="270" y="46" fill="#ffa94d" text-anchor="middle" font-size="12">ℱ</text>
<text x="270" y="120" fill="#ffa94d" text-anchor="middle" font-size="12">ℱ</text>
</svg>`,
    caption: String.raw`Time–bandwidth duality: narrowing a rectangle in one domain widens its sinc in the other, so you can never localise a signal tightly in both time and frequency at once.`,
  }
  ],
  prerequisites: ['fourier-transform', 'nyquist-sampling', 'convolution'],
  intro: String.raw`<p>The <b>sinc function</b> is the single most important shape in signal processing. It is the Fourier transform of a rectangular pulse, the impulse response of an ideal low-pass filter, and the interpolation kernel that perfectly reconstructs a band-limited signal from its samples. Wherever a signal is band-limited or a spectrum is brick-wall flat, a sinc appears in the other domain. This page defines it, maps its zeros and lobes, proves the rectangle↔sinc transform pair, and shows its central role in sampling, reconstruction, pulse shaping, and the Gibbs phenomenon.</p>`,
  sections: [
    {
      h: 'Definition and two conventions',
      html: String.raw`<p>The <b>normalised sinc</b> (signal-processing convention) is</p>
      $$ \mathrm{sinc}(x)=\frac{\sin(\pi x)}{\pi x}, \qquad \mathrm{sinc}(0)=1. $$
      <p>The value at $x=0$ is $1$ by the limit $\sin(\pi x)/(\pi x)\to 1$ (l'Hôpital or the small-angle expansion). The <b>unnormalised sinc</b> used in mathematics is $\sin(x)/x$; the $\pi$ in the normalised version places the zeros at the integers, which is exactly what sampling theory wants. Unless stated otherwise we use the normalised form throughout.</p>
      <div class="callout"><b>Watch the convention.</b> MATLAB/NumPy <code>sinc</code> is normalised ($\sin \pi x/\pi x$); many math texts and calculators use $\sin x/x$. Zeros land at integers vs at multiples of $\pi$ — always check.</div>`
    },
    {
      h: 'Zeros, lobes, and decay',
      html: String.raw`<p>The normalised sinc has these landmarks:</p>
      <ul>
        <li><b>Peak</b> of $1$ at $x=0$.</li>
        <li><b>Zeros</b> at every non-zero integer $x=\pm 1,\pm 2,\dots$ (wherever $\sin(\pi x)=0$ except the origin).</li>
        <li><b>Main lobe</b> spans $x\in(-1,1)$, width $2$ between the first zeros — this is where most of the energy sits.</li>
        <li><b>Side lobes</b> alternate in sign and decay as $1/x$ (envelope $1/(\pi|x|)$). The first side-lobe peak is about $-13.3$ dB relative to the main lobe.</li>
      </ul>
      <p>The slow $1/x$ decay is a double-edged sword: it means a single rectangle in one domain produces long-lasting ripple in the other, which is the root cause of spectral leakage and the need for windowing.</p>`
    },
    {
      h: 'The rectangle ↔ sinc Fourier pair',
      html: String.raw`<p>The defining fact: the Fourier transform of a rectangular pulse is a sinc, and (by duality) the transform of a sinc is a rectangle. For a rectangle of width $T$ and height 1:</p>
      $$ \mathrm{rect}(t/T) \;\overset{\mathcal F}{\longleftrightarrow}\; T\,\mathrm{sinc}(fT). $$
      <p>This one pair explains a huge amount:</p>
      <ul>
        <li>A <b>time-limited</b> pulse (finite rectangle) has an <b>infinite-bandwidth</b> sinc spectrum — you cannot be both time- and band-limited.</li>
        <li>An <b>ideal low-pass filter</b> (rectangle in frequency) has a <b>sinc impulse response</b> in time — infinitely long and non-causal, hence only approximable.</li>
        <li>Narrowing the rectangle widens the sinc: <b>time–bandwidth duality</b>. A short pulse needs a wide band; a narrow band gives a long pulse.</li>
      </ul>`
    },
    {
      h: 'Sinc in sampling and reconstruction',
      html: String.raw`<p>The <b>Whittaker–Shannon interpolation formula</b> reconstructs a band-limited signal exactly from its samples using shifted sincs as building blocks:</p>
      $$ x(t)=\sum_{n=-\infty}^{\infty} x(nT_s)\,\mathrm{sinc}\!\left(\frac{t-nT_s}{T_s}\right). $$
      <p>Each sample "plants" a sinc centred on its instant, scaled by the sample value. Because every sinc is <i>zero</i> at all other sample instants (its zeros land on the integers/other samples), the sum passes exactly through every sample and fills the gaps perfectly — provided sampling obeyed <a href="#nyquist-sampling">Nyquist</a>. In the frequency domain this is just multiplying the sampled spectrum by an ideal rectangular low-pass filter (whose impulse response is the sinc), removing the spectral images. The sinc is therefore the <b>ideal reconstruction filter</b> — theoretically perfect but physically unrealisable (infinite, non-causal), so real DACs use approximations (zero-order hold plus analog smoothing).</p>`
    },
    {
      h: 'Sinc in pulse shaping',
      html: String.raw`<p>In digital communications, the sinc is the pulse that achieves the <b>Nyquist zero-ISI</b> criterion: because it is zero at all other symbol instants $\pm T,\pm 2T,\dots$, symbols placed one per period do not interfere at the sampling points. A sinc-shaped pulse occupies exactly the minimum bandwidth $1/(2T)$ (the Nyquist bandwidth), making it spectrally maximally efficient.</p>
      <p>But the ideal sinc has two fatal practical flaws: its $1/x$ tails decay too slowly (so timing jitter causes large ISI) and it is non-causal/infinite. The fix is the <b>raised-cosine</b> (and root-raised-cosine) pulse — a "softened" sinc that trades a little excess bandwidth (the roll-off factor $\beta$) for tails that decay as $1/x^3$, giving robust, realisable filters. See <a href="#pulse-shaping">pulse shaping</a>.</p>`
    },
    {
      h: 'Gibbs phenomenon and time–bandwidth duality',
      html: String.raw`<p>Truncating an ideal (rectangular) frequency response to a finite length — equivalently, keeping only part of the infinite sinc impulse response — produces the <b>Gibbs phenomenon</b>: a persistent ~9% overshoot near sharp edges that never disappears as you add terms; it only narrows. This is the sinc's $1/x$ side lobes showing up as ripple. Windowing (Hamming, Hann, Blackman) tapers the sinc to suppress the overshoot at the cost of a wider transition band.</p>
      <p>The whole story is one manifestation of <b>time–bandwidth duality</b>: sharpness (a brick wall) in one domain forces spreading (long sinc tails) in the other. You cannot localise a signal arbitrarily in both time and frequency — the sinc/rect pair is the extreme illustration of this fundamental limit.</p>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<div class="callout tip"><p>You should now be able to explain, without looking anything up:</p>
      <ul>
        <li><b>The sinc is the rect's Fourier partner:</b> $\mathrm{rect}(t/T)\leftrightarrow T\,\mathrm{sinc}(fT)$, and $\mathrm{sinc}(0)=1$ with zeros at every non-zero integer.</li>
        <li><b>Its zeros landing on the integers is the whole point:</b> shifted sincs at sample instants don't interfere, giving both exact Whittaker–Shannon reconstruction and zero-ISI signalling.</li>
        <li><b>It is the ideal low-pass impulse response</b> — perfect but infinite and non-causal, so real DACs and modems only approximate it (zero-order hold, raised-cosine).</li>
        <li><b>The slow $1/x$ side lobes</b> (first one at $-13.3$ dB) are the root of spectral leakage, poor jitter tolerance, and the Gibbs overshoot — all fixed by windowing or softening the pulse.</li>
        <li><b>Time–bandwidth duality</b> means you cannot be sharp in both domains: a short pulse always has a wide spectrum, and a brick-wall filter always has a long impulse response.</li>
        <li><b>Why it matters:</b> the sinc lives inside every DAC reconstruction filter, every root-raised-cosine transmit pulse, and every window you apply to fight FFT leakage.</li>
      </ul></div>`
    }
  ],
  keyPoints: [
    String.raw`Normalised sinc: $\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$, with $\mathrm{sinc}(0)=1$.`,
    String.raw`Zeros at every non-zero integer; main lobe of width 2; side lobes decay as $1/x$.`,
    String.raw`First side lobe is about $-13.3$ dB below the main lobe.`,
    String.raw`Fourier pair: $\mathrm{rect}(t/T)\leftrightarrow T\,\mathrm{sinc}(fT)$ — rectangle and sinc are transforms of each other.`,
    String.raw`Time-limited $\Rightarrow$ infinite bandwidth (and vice versa); you cannot be both.`,
    String.raw`The sinc is the impulse response of an ideal low-pass filter — infinite and non-causal, hence unrealisable.`,
    String.raw`Whittaker–Shannon: a band-limited signal is exactly a sum of sample-weighted shifted sincs.`,
    String.raw`Sinc pulses achieve minimum-bandwidth zero-ISI signalling but have poor jitter tolerance ($1/x$ tails).`,
    String.raw`Raised-cosine pulses soften the sinc, trading excess bandwidth for $1/x^3$ tails.`,
    String.raw`Truncating a sinc causes the Gibbs ~9% overshoot; windowing tapers it away.`
  ],
  equations: [
    {
      title: 'Value at the origin',
      tex: String.raw`$$ \mathrm{sinc}(0)=\lim_{x\to 0}\frac{\sin(\pi x)}{\pi x}=1 $$`,
      derivation: String.raw`<p><b>Where we start.</b> At $x=0$ the definition $\sin(\pi x)/(\pi x)$ is the indeterminate form $0/0$. We resolve the limit.</p>
      <p><b>Step 1 — expand the sine.</b> The Taylor series is $\sin(\pi x)=\pi x - \dfrac{(\pi x)^3}{6}+\cdots$</p>
      <p><b>Step 2 — divide by $\pi x$.</b></p>
      $$ \frac{\sin(\pi x)}{\pi x}=1-\frac{(\pi x)^2}{6}+\cdots $$
      <p><b>Step 3 — take $x\to 0$.</b> All higher terms vanish, leaving $1$.</p>
      <p><b>Result.</b> $\mathrm{sinc}(0)=1$. This is why the sinc is a well-behaved, continuous function everywhere despite the $x$ in the denominator.</p>`
    },
    {
      title: 'Fourier transform of a rectangle is a sinc',
      tex: String.raw`$$ \mathcal{F}\{\mathrm{rect}(t/T)\}=T\,\mathrm{sinc}(fT) $$`,
      derivation: String.raw`<p><b>Where we start.</b> The rectangle $\mathrm{rect}(t/T)$ equals 1 for $|t|<T/2$ and 0 elsewhere. Compute its Fourier transform directly.</p>
      <p><b>Step 1 — write the integral over the support.</b> Outside $[-T/2,T/2]$ the function is zero, so</p>
      $$ X(f)=\int_{-T/2}^{T/2} e^{-j2\pi f t}\,dt. $$
      <p><b>Step 2 — integrate the exponential.</b></p>
      $$ X(f)=\left[\frac{e^{-j2\pi f t}}{-j2\pi f}\right]_{-T/2}^{T/2}=\frac{e^{-j\pi f T}-e^{j\pi f T}}{-j2\pi f}. $$
      <p><b>Step 3 — use $e^{j\theta}-e^{-j\theta}=2j\sin\theta$.</b> The numerator becomes $-2j\sin(\pi f T)$:</p>
      $$ X(f)=\frac{-2j\sin(\pi f T)}{-j2\pi f}=\frac{\sin(\pi f T)}{\pi f}. $$
      <p><b>Step 4 — factor out $T$.</b> Multiply top and bottom by $T$: $\dfrac{\sin(\pi f T)}{\pi f T}\cdot T$.</p>
      <p><b>Result.</b> $$ X(f)=T\,\frac{\sin(\pi f T)}{\pi f T}=T\,\mathrm{sinc}(fT). $$ A finite rectangle in time gives an infinitely-wide sinc in frequency — time-limited means not band-limited.</p>`
    },
    {
      title: 'Zeros of the sinc',
      tex: String.raw`$$ \mathrm{sinc}(x)=0 \iff x\in\{\pm1,\pm2,\dots\} $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want every $x$ where $\sin(\pi x)/(\pi x)=0$.</p>
      <p><b>Step 1 — the numerator controls the zeros.</b> The fraction is zero exactly when $\sin(\pi x)=0$ and the denominator is non-zero.</p>
      <p><b>Step 2 — solve the sine.</b> $\sin(\pi x)=0$ when $\pi x=k\pi$, i.e. $x=k$ for integer $k$.</p>
      <p><b>Step 3 — exclude the origin.</b> At $x=0$ the denominator is also zero, and we showed the value is $1$, not $0$. So drop $k=0$.</p>
      <p><b>Result.</b> Zeros at $x=\pm1,\pm2,\dots$ — the integers. This regular spacing is precisely why shifted sincs at integer sample points don't interfere: each is zero at every other sample.</p>`
    },
    {
      title: 'Whittaker–Shannon interpolation',
      tex: String.raw`$$ x(t)=\sum_{n} x(nT_s)\,\mathrm{sinc}\!\left(\frac{t-nT_s}{T_s}\right) $$`,
      derivation: String.raw`<p><b>Where we start.</b> Sampling multiplies $x(t)$ by an impulse train, which in frequency <i>replicates</i> the spectrum at multiples of $f_s=1/T_s$. If $x$ is band-limited below $f_s/2$, the copies don't overlap.</p>
      <p><b>Step 1 — isolate the baseband copy.</b> Multiply the replicated spectrum by an ideal rectangular low-pass filter of width $f_s$, height $T_s$ — it keeps the original copy and deletes the images.</p>
      $$ X_r(f)=X_s(f)\cdot T_s\,\mathrm{rect}(f/f_s). $$
      <p><b>Step 2 — multiplication in frequency is convolution in time.</b> The filter's impulse response is the transform of the rectangle: a sinc, $\mathrm{sinc}(t/T_s)$.</p>
      <p><b>Step 3 — convolve the samples with the sinc.</b> The sampled signal is $\sum_n x(nT_s)\delta(t-nT_s)$; convolving each impulse with the sinc shifts a sinc to that instant:</p>
      $$ x(t)=\sum_n x(nT_s)\,\mathrm{sinc}\!\left(\frac{t-nT_s}{T_s}\right). $$
      <p><b>Result.</b> Because each sinc is 1 at its own sample and 0 at all others, the sum reproduces every sample exactly and interpolates perfectly in between — the ideal reconstruction.</p>`
    },
    {
      title: 'First side-lobe level',
      tex: String.raw`$$ 20\log_{10}\!\left|\frac{\sin(\pi x)}{\pi x}\right|_{x\approx 1.43} \approx -13.3\ \text{dB} $$`,
      derivation: String.raw`<p><b>Where we start.</b> The side lobes sit between the zeros; the first one lies between $x=1$ and $x=2$. We locate its peak.</p>
      <p><b>Step 1 — differentiate and set to zero.</b> The extrema of $\sin(\pi x)/(\pi x)$ satisfy $\tan(\pi x)=\pi x$. The first non-trivial root beyond the main lobe is $x\approx 1.4303$.</p>
      <p><b>Step 2 — evaluate the amplitude there.</b> $\left|\dfrac{\sin(\pi\cdot1.4303)}{\pi\cdot1.4303}\right|\approx 0.2172$.</p>
      <p><b>Step 3 — convert to dB relative to the main lobe (value 1).</b></p>
      $$ 20\log_{10}(0.2172)\approx -13.3\ \text{dB}. $$
      <p><b>Result.</b> The first side lobe is 13.3 dB down — high enough to cause noticeable spectral leakage, which is exactly why windowing is used to push side lobes lower.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`Define the normalised sinc function.`, back: String.raw`$\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$, with $\mathrm{sinc}(0)=1$.` },
    { front: String.raw`Where are the zeros of the normalised sinc?`, back: String.raw`At every non-zero integer, $x=\pm1,\pm2,\dots$` },
    { front: String.raw`What is the Fourier transform of a rectangular pulse?`, back: String.raw`A sinc: $\mathrm{rect}(t/T)\leftrightarrow T\,\mathrm{sinc}(fT)$.` },
    { front: String.raw`What is the impulse response of an ideal low-pass filter?`, back: String.raw`A sinc function — infinite in extent and non-causal.` },
    { front: String.raw`How wide is the sinc's main lobe?`, back: String.raw`Width 2 (between the first zeros at $x=\pm1$).` },
    { front: String.raw`How fast do sinc side lobes decay?`, back: String.raw`As $1/x$ (envelope $1/(\pi|x|)$).` },
    { front: String.raw`What is the first side-lobe level of a sinc?`, back: String.raw`About $-13.3$ dB relative to the main lobe.` },
    { front: String.raw`State the Whittaker–Shannon interpolation formula's idea.`, back: String.raw`Reconstruct $x(t)=\sum_n x(nT_s)\,\mathrm{sinc}((t-nT_s)/T_s)$ — sample-weighted shifted sincs.` },
    { front: String.raw`Why can a sinc pulse give zero ISI?`, back: String.raw`Its zeros land on all other symbol instants, so symbols don't interfere at the sampling points.` },
    { front: String.raw`Why is the ideal sinc pulse impractical for comms?`, back: String.raw`Non-causal, infinite, and $1/x$ tails give poor timing-jitter tolerance.` },
    { front: String.raw`What replaces the sinc in real pulse shaping?`, back: String.raw`Raised-cosine / root-raised-cosine pulses with $1/x^3$ tails.` },
    { front: String.raw`What is the Gibbs phenomenon?`, back: String.raw`~9% overshoot near sharp edges when a sinc/ideal response is truncated; it narrows but never vanishes.` },
    { front: String.raw`State time–bandwidth duality via the sinc.`, back: String.raw`A brick wall in one domain forces long sinc tails in the other; you cannot localise in both.` },
    { front: String.raw`Difference between normalised and unnormalised sinc?`, back: String.raw`Normalised $\sin(\pi x)/(\pi x)$ (zeros at integers); unnormalised $\sin(x)/x$ (zeros at multiples of $\pi$).` }
  ],
  mcqs: [
    { q: String.raw`The Fourier transform of a rectangular pulse is:`, options: [String.raw`Another rectangle`, String.raw`A sinc function`, String.raw`A Gaussian`, String.raw`An impulse`], answer: 1, explain: String.raw`$\mathrm{rect}\leftrightarrow \mathrm{sinc}$; a finite pulse has an infinite sinc spectrum.` },
    { q: String.raw`$\mathrm{sinc}(0)$ equals:`, options: [String.raw`0`, String.raw`1`, String.raw`$\infty$`, String.raw`Undefined`], answer: 1, explain: String.raw`The $0/0$ limit resolves to 1.` },
    { q: String.raw`The zeros of the normalised sinc are at:`, options: [String.raw`Multiples of $\pi$`, String.raw`Non-zero integers`, String.raw`Half-integers`, String.raw`Only at $x=1$`], answer: 1, explain: String.raw`$\sin(\pi x)=0$ at integers; $x=0$ excluded.` },
    { q: String.raw`The sinc is the impulse response of a(n):`, options: [String.raw`Ideal high-pass filter`, String.raw`Ideal low-pass filter`, String.raw`Differentiator`, String.raw`All-pass filter`], answer: 1, explain: String.raw`A rectangle in frequency transforms to a sinc in time.` },
    { q: String.raw`Sinc side lobes decay as:`, options: [String.raw`$1/x^2$`, String.raw`$1/x$`, String.raw`Exponentially`, String.raw`They don't decay`], answer: 1, explain: String.raw`The envelope is $1/(\pi|x|)$, slow $1/x$ decay.` },
    { q: String.raw`In Whittaker–Shannon reconstruction, each sample contributes:`, options: [String.raw`A rectangle`, String.raw`A shifted, scaled sinc`, String.raw`A Gaussian`, String.raw`A step`], answer: 1, explain: String.raw`$x(t)=\sum x(nT_s)\mathrm{sinc}((t-nT_s)/T_s)$.` },
    { q: String.raw`A time-limited pulse necessarily has:`, options: [String.raw`Finite bandwidth`, String.raw`Infinite bandwidth`, String.raw`Zero bandwidth`, String.raw`Negative bandwidth`], answer: 1, explain: String.raw`Its spectrum is a sinc, which extends forever.` },
    { q: String.raw`The main lobe of the normalised sinc has width:`, options: [String.raw`1`, String.raw`2`, String.raw`$\pi$`, String.raw`$2\pi$`], answer: 1, explain: String.raw`Between first zeros at $\pm1$, width is 2.` },
    { q: String.raw`Why is a sinc pulse impractical in real modems?`, options: [String.raw`It has no zeros`, String.raw`Its $1/x$ tails give poor jitter tolerance and it is non-causal`, String.raw`It uses too little bandwidth`, String.raw`It cannot be sampled`], answer: 1, explain: String.raw`Slowly decaying tails and non-causality force the use of raised-cosine pulses.` },
    { q: String.raw`The Gibbs phenomenon is caused by:`, options: [String.raw`Aliasing`, String.raw`Truncating an ideal (sinc) response`, String.raw`Quantisation`, String.raw`Thermal noise`], answer: 1, explain: String.raw`Cutting off the infinite sinc leaves a persistent ~9% overshoot.` },
    { q: String.raw`The first side lobe of a sinc is about how far below the main lobe?`, options: [String.raw`3 dB`, String.raw`6 dB`, String.raw`13 dB`, String.raw`40 dB`], answer: 2, explain: String.raw`Approximately $-13.3$ dB.` },
    { q: String.raw`Narrowing a rectangle in time does what to its sinc spectrum?`, options: [String.raw`Narrows it`, String.raw`Widens it`, String.raw`Leaves it unchanged`, String.raw`Shifts it up`], answer: 1, explain: String.raw`Time–bandwidth duality: a shorter pulse spreads its spectrum.` }
  ],
  numericals: [
    { q: String.raw`A rectangular pulse has width $T=1$ ms. At what frequencies does its sinc spectrum first hit zero?`, solution: String.raw`<p><b>Formula.</b> $$ X(f)\propto \mathrm{sinc}(fT),\qquad \mathrm{sinc}(fT)=0\iff fT=\pm1,\pm2,\dots $$ where $T$ is the pulse width and $f$ the frequency.</p>
<p><b>Substitute.</b> Set $fT=\pm1$ (the first null): $$ f=\pm\frac{1}{T}=\pm\frac{1}{1\times10^{-3}\ \text{s}}. $$</p>
<p><b>Compute.</b> $f=\pm1000$ Hz $=\pm1$ kHz; further nulls at $\pm2$ kHz, $\pm3$ kHz, and so on.</p>
<p><b>Explanation.</b> The first null at $\pm1$ kHz sets the main-lobe (null-to-null) width of $2/T=2$ kHz. A shorter pulse would push the nulls out — the time–bandwidth trade in action.</p>` },
    { q: String.raw`Compute $\mathrm{sinc}(0.5)$.`, solution: String.raw`<p><b>Formula.</b> $$ \mathrm{sinc}(x)=\frac{\sin(\pi x)}{\pi x} $$ the normalised sinc, with $x$ dimensionless.</p>
<p><b>Substitute.</b> $$ \mathrm{sinc}(0.5)=\frac{\sin(0.5\pi)}{0.5\pi}=\frac{\sin(\pi/2)}{\pi/2}. $$</p>
<p><b>Compute.</b> $\sin(\pi/2)=1$ and $\pi/2=1.5708$, so $\mathrm{sinc}(0.5)=1/1.5708=0.6366=2/\pi$.</p>
<p><b>Explanation.</b> Halfway to the first zero the sinc has already fallen to about 64% of its peak. Sanity check: $2/\pi$ is the exact value, confirming the rapid initial roll-off of the main lobe.</p>` },
    { q: String.raw`A signal is sampled at $f_s=8$ kHz. What is the spacing of the zeros of the reconstruction sinc kernel in time?`, solution: String.raw`<p><b>Formula.</b> $$ T_s=\frac{1}{f_s},\qquad \mathrm{sinc}\!\left(\frac{t}{T_s}\right)=0\iff t=\pm T_s,\pm 2T_s,\dots $$ where $T_s$ is the sample period and $f_s$ the sample rate.</p>
<p><b>Substitute.</b> $$ T_s=\frac{1}{8000\ \text{Hz}}. $$</p>
<p><b>Compute.</b> $T_s=125\ \mu\text{s}$, so the kernel's zeros fall at every multiple of $125\ \mu\text{s}$.</p>
<p><b>Explanation.</b> The zeros land exactly on the neighbouring sample instants, which is precisely why the interpolation kernel from one sample never disturbs any other sample's value — the basis of exact reconstruction.</p>` },
    { q: String.raw`What is the amplitude (linear) of the sinc at its first side-lobe peak ($x\approx1.43$)?`, solution: String.raw`<p><b>Formula.</b> $$ \mathrm{sinc}(x)=\frac{\sin(\pi x)}{\pi x},\qquad \text{dB}=20\log_{10}\!\left|\mathrm{sinc}(x)\right| $$ evaluated at the first side-lobe extremum $x\approx1.4303$ (root of $\tan\pi x=\pi x$).</p>
<p><b>Substitute.</b> $$ \mathrm{sinc}(1.43)=\frac{\sin(1.43\pi)}{1.43\pi}. $$</p>
<p><b>Compute.</b> $1.43\pi=4.49$ rad and $\sin(1.43\pi)\approx-0.976$, so $\mathrm{sinc}(1.43)\approx-0.976/4.49\approx-0.217$; magnitude $0.217$, i.e. $20\log_{10}(0.217)\approx-13.3$ dB.</p>
<p><b>Explanation.</b> The first side lobe sits only 13.3 dB below the main lobe — high enough to cause noticeable spectral leakage, which is exactly why windows are applied to push side lobes lower.</p>` },
    { q: String.raw`A sinc pulse is used for zero-ISI signalling at symbol rate $1/T=2400$ Bd. What is its minimum (Nyquist) bandwidth?`, solution: String.raw`<p><b>Formula.</b> $$ B_{\min}=\frac{1}{2T}=\frac{R_s}{2} $$ where $R_s=1/T$ is the symbol rate and $B_{\min}$ the one-sided (baseband) Nyquist bandwidth.</p>
<p><b>Substitute.</b> $$ B_{\min}=\frac{2400\ \text{Bd}}{2}. $$</p>
<p><b>Compute.</b> $B_{\min}=1200$ Hz.</p>
<p><b>Explanation.</b> The ideal sinc packs symbols into the absolute minimum bandwidth — half the symbol rate — with no inter-symbol interference. Real systems widen this slightly (raised-cosine roll-off) to gain practical, causal filters.</p>` },
    { q: String.raw`Verify that $\mathrm{sinc}(2)=0$ and explain its significance for sampling.`, solution: String.raw`<p><b>Formula.</b> $$ \mathrm{sinc}(x)=\frac{\sin(\pi x)}{\pi x} $$ which is zero wherever $\sin(\pi x)=0$ with $x\ne0$.</p>
<p><b>Substitute.</b> $$ \mathrm{sinc}(2)=\frac{\sin(2\pi)}{2\pi}. $$</p>
<p><b>Compute.</b> $\sin(2\pi)=0$, so $\mathrm{sinc}(2)=0/(2\pi)=0$.</p>
<p><b>Explanation.</b> A reconstruction sinc centred on one sample is exactly zero at the sample two positions away, so it contributes nothing there. This zero-at-every-integer property is what lets shifted sincs reconstruct a signal without corrupting each other's samples.</p>` }
  ],
  realWorld: String.raw`<p>The sinc is baked into every digital-to-analog converter and every modem. A DAC's ideal reconstruction filter is a sinc; because that's unrealisable, real converters use a zero-order hold (which imposes its own $\mathrm{sinc}(f/f_s)$ droop across the band, corrected by a digital "sinc compensation" filter) followed by an analog low-pass. In communications, root-raised-cosine filters — tamed sincs — shape virtually every QAM/PSK transmit pulse in Wi-Fi, LTE, and satellite links to pack symbols into minimum bandwidth without inter-symbol interference. And every time an engineer applies a Hamming or Blackman window to an FFT to fight spectral leakage, they are fighting the sinc's $1/x$ side lobes head-on. The sinc/rect duality is also why a spectrum analyzer's resolution bandwidth and sweep time trade off — sharper frequency resolution demands longer time-domain observation.</p>`,
  related: ['fourier-transform', 'nyquist-sampling', 'pulse-shaping', 'frequency-spectrum', 'aliasing']
},
{
  id: 'frequency-spectrum',
  title: 'Frequency Spectrum',
  category: 'Signals & Systems',
  tags: ['spectrum', 'Fourier', 'amplitude', 'phase', 'PSD', 'bandwidth', 'spectrum analyzer'],
  summary: String.raw`A frequency spectrum shows how a signal's energy is distributed over frequency — its amplitude and phase versus frequency — and is the Fourier-domain view of a time signal.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-frequency-spectrum" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="70" width="90" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="53" y="90" fill="#e6edf3" text-anchor="middle">Signal</text><text x="53" y="105" fill="#9aa7b5" text-anchor="middle" font-size="10">x(t)</text>
<path d="M18,93 Q28,78 38,93 Q48,108 58,93 Q68,78 78,93 Q83,101 88,93" fill="none" stroke="#63e6be" stroke-width="1.2"/>
<rect x="150" y="65" width="140" height="56" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="220" y="88" fill="#e6edf3" text-anchor="middle">Fourier analyzer</text><text x="220" y="104" fill="#9aa7b5" text-anchor="middle" font-size="10">X(f)=∫x(t)e^{−j2πft}dt</text>
<rect x="342" y="55" width="190" height="90" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="437" y="72" fill="#e6edf3" text-anchor="middle" font-size="11">amplitude vs frequency</text>
<line x1="360" y1="130" x2="520" y2="130" stroke="#9aa7b5"/>
<line x1="360" y1="130" x2="360" y2="82" stroke="#9aa7b5"/>
<line x1="390" y1="130" x2="390" y2="95" stroke="#ffa94d" stroke-width="2"/>
<line x1="430" y1="130" x2="430" y2="82" stroke="#ffa94d" stroke-width="2"/>
<line x1="470" y1="130" x2="470" y2="110" stroke="#ffa94d" stroke-width="2"/>
<line x1="500" y1="130" x2="500" y2="118" stroke="#ffa94d" stroke-width="2"/>
<text x="437" y="142" fill="#9aa7b5" text-anchor="middle" font-size="9">f →</text>
<line x1="98" y1="93" x2="148" y2="93" stroke="#9aa7b5" marker-end="url(#arr-frequency-spectrum)"/>
<line x1="290" y1="93" x2="340" y2="93" stroke="#9aa7b5" marker-end="url(#arr-frequency-spectrum)"/>
</svg>`,
    caption: String.raw`A time signal passes through a Fourier analyzer to reveal its spectrum — amplitude (and phase) plotted against frequency as spectral lines.`,
  },
  {
    title: String.raw`Spectrum-analyzer chain: sweep/FFT → detect → display`,
    svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-frequency-spectrum" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="55" width="88" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="52" y="73" fill="#e6edf3" text-anchor="middle" font-size="11">RF input</text><text x="52" y="88" fill="#9aa7b5" text-anchor="middle" font-size="10">x(t)</text>
<rect x="118" y="50" width="104" height="54" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="170" y="70" fill="#e6edf3" text-anchor="middle" font-size="11">mixer sweep</text><text x="170" y="84" fill="#9aa7b5" text-anchor="middle" font-size="10">or FFT (RBW</text><text x="170" y="96" fill="#9aa7b5" text-anchor="middle" font-size="10">filter)</text>
<rect x="244" y="55" width="96" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="292" y="73" fill="#e6edf3" text-anchor="middle" font-size="11">detector</text><text x="292" y="88" fill="#9aa7b5" text-anchor="middle" font-size="10">|·|, log, VBW</text>
<rect x="362" y="50" width="170" height="60" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="447" y="66" fill="#e6edf3" text-anchor="middle" font-size="10">display dBm vs f</text>
<line x1="378" y1="100" x2="524" y2="100" stroke="#9aa7b5"/>
<line x1="400" y1="100" x2="400" y2="78" stroke="#ffa94d" stroke-width="2"/>
<line x1="440" y1="100" x2="440" y2="72" stroke="#ffa94d" stroke-width="2"/>
<line x1="485" y1="100" x2="485" y2="90" stroke="#ffa94d" stroke-width="2"/>
<line x1="96" y1="77" x2="116" y2="77" stroke="#9aa7b5" marker-end="url(#arr2-frequency-spectrum)"/>
<line x1="222" y1="77" x2="242" y2="77" stroke="#9aa7b5" marker-end="url(#arr2-frequency-spectrum)"/>
<line x1="340" y1="77" x2="360" y2="77" stroke="#9aa7b5" marker-end="url(#arr2-frequency-spectrum)"/>
</svg>`,
    caption: String.raw`Spectrum-analyzer signal chain: the input is swept past a narrow RBW filter (or transformed by an FFT), envelope-detected and log-scaled (with VBW smoothing), then plotted as power versus frequency — carrier, harmonics, spurs and noise floor.`,
  },
  {
    title: String.raw`One signal, three views: time ↔ magnitude ↔ phase`,
    svg: String.raw`<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-frequency-spectrum" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#b197fc"/></marker></defs>
<rect x="200" y="12" width="140" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="270" y="34" fill="#e6edf3" text-anchor="middle" font-size="11">one signal x(t)</text>
<rect x="8" y="90" width="150" height="50" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="83" y="110" fill="#e6edf3" text-anchor="middle" font-size="11">time view</text><text x="83" y="125" fill="#9aa7b5" text-anchor="middle" font-size="10">amplitude vs t</text>
<rect x="195" y="90" width="150" height="50" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="270" y="110" fill="#e6edf3" text-anchor="middle" font-size="11">magnitude |X(f)|</text><text x="270" y="125" fill="#9aa7b5" text-anchor="middle" font-size="10">strength vs f</text>
<rect x="382" y="90" width="150" height="50" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="457" y="110" fill="#e6edf3" text-anchor="middle" font-size="11">phase ∠X(f)</text><text x="457" y="125" fill="#9aa7b5" text-anchor="middle" font-size="10">timing vs f</text>
<line x1="240" y1="48" x2="110" y2="88" stroke="#b197fc" marker-end="url(#arr3-frequency-spectrum)"/>
<line x1="270" y1="48" x2="270" y2="88" stroke="#b197fc" marker-end="url(#arr3-frequency-spectrum)"/>
<line x1="300" y1="48" x2="430" y2="88" stroke="#b197fc" marker-end="url(#arr3-frequency-spectrum)"/>
</svg>`,
    caption: String.raw`One signal, three equivalent views: the time waveform, the magnitude spectrum $|X(f)|$, and the phase spectrum $\angle X(f)$. Magnitude and phase together lose nothing; discarding phase (a power spectrum) keeps strength but forfeits exact reconstruction.`,
  }
  ],
  prerequisites: ['fourier-transform', 'sinc-function', 'psd'],
  intro: String.raw`<p>A signal can be viewed two ways: as a <b>waveform</b> (amplitude versus time) or as a <b>spectrum</b> (content versus frequency). The spectrum answers "which frequencies are present, how strong, and in what phase?" It is the Fourier transform made visible, and it is how engineers read bandwidth, harmonics, noise, and interference. This page defines amplitude and phase spectra, distinguishes line from continuous and one-sided from two-sided spectra, connects the spectrum to the Fourier transform and power spectral density, and explains how to read a spectrum analyzer display.</p>`,
  sections: [
    {
      h: 'What a spectrum is: amplitude and phase versus frequency',
      html: String.raw`<p>Any well-behaved signal can be written as a sum (or integral) of sinusoids. The <b>spectrum</b> specifies, for each frequency, the <b>amplitude</b> (how much of that sinusoid is present) and the <b>phase</b> (its timing offset). A complete spectrum therefore has two parts:</p>
      <ul>
        <li><b>Amplitude (magnitude) spectrum</b> $|X(f)|$ — the strength of each frequency component. This is what most displays show.</li>
        <li><b>Phase spectrum</b> $\angle X(f)$ — the relative phase of each component, essential for reconstructing the waveform and for group-delay/distortion analysis.</li>
      </ul>
      <p>Because $X(f)=|X(f)|e^{j\angle X(f)}$ is complex, both parts are needed to fully describe the signal; discarding phase (as a power spectrum does) loses the ability to reconstruct the exact waveform. The amplitude spectrum alone still reveals bandwidth, tones, and noise floor — which is usually what you want.</p>`
    },
    {
      h: 'Line spectra vs continuous spectra',
      html: String.raw`<p>The shape of a spectrum depends on the nature of the signal:</p>
      <table class="data">
        <tr><th>Signal type</th><th>Spectrum</th><th>Example</th></tr>
        <tr><td>Periodic</td><td><b>Line spectrum</b> — discrete spikes at the fundamental and its harmonics (Fourier <i>series</i>)</td><td>Square wave: odd harmonics at $f_0,3f_0,5f_0,\dots$</td></tr>
        <tr><td>Aperiodic / finite-energy</td><td><b>Continuous spectrum</b> — energy spread smoothly over a band (Fourier <i>transform</i>)</td><td>A single pulse → sinc spectrum</td></tr>
        <tr><td>Random / noise</td><td><b>Continuous power spectrum</b> (PSD) — statistical distribution of power</td><td>White noise: flat PSD</td></tr>
      </table>
      <p>A pure sinusoid is the extreme line spectrum: a single spike. As a tone is switched on for only a finite time, that spike broadens into a sinc (see <a href="#sinc-function">sinc function</a>) — the finite observation window smears the line. This is the same effect that limits a spectrum analyzer's resolution.</p>`
    },
    {
      h: 'One-sided vs two-sided spectra',
      html: String.raw`<p>The Fourier transform naturally produces a <b>two-sided</b> spectrum spanning positive <i>and</i> negative frequencies. For a real signal the spectrum is <b>conjugate-symmetric</b>: $X(-f)=X^*(f)$, so the magnitude is even and the phase is odd. The negative-frequency half is redundant.</p>
      <ul>
        <li><b>Two-sided</b> ($-\infty<f<\infty$): mathematically natural; each real sinusoid appears as two half-amplitude spikes at $\pm f$. Used in analysis and I/Q processing.</li>
        <li><b>One-sided</b> ($f\ge 0$): folds the negative half onto the positive, <i>doubling</i> the amplitudes (except DC). This matches physical intuition — a 1 V, 1 kHz tone shows as a single 1 V line at 1 kHz. Used by most spectrum analyzers and engineers.</li>
      </ul>
      <div class="callout"><b>Factor-of-two trap.</b> When converting two-sided to one-sided, multiply amplitudes by 2 (power by 2) for all $f>0$, but leave the DC (and Nyquist) term alone. Forgetting this is the classic 3 dB error.</div>`
    },
    {
      h: 'Bandwidth: measuring the width of a spectrum',
      html: String.raw`<p><b>Bandwidth</b> is the width of the frequency band a signal occupies, but "occupies" needs a definition. Common measures:</p>
      <ul>
        <li><b>−3 dB (half-power) bandwidth</b> — width between points where power falls to half (amplitude to $1/\sqrt2$). The default for filters.</li>
        <li><b>Null-to-null bandwidth</b> — main-lobe width between the first spectral nulls (e.g. $2/T$ for a rectangular pulse).</li>
        <li><b>Occupied bandwidth</b> — band containing a specified fraction (e.g. 99%) of the total power; used in regulatory specs.</li>
        <li><b>Equivalent noise bandwidth</b> — width of an ideal brick-wall filter passing the same noise power.</li>
      </ul>
      <p>These differ numerically, so a stated "bandwidth" is only meaningful with its definition attached. Bandwidth ties directly to <a href="#shannon">Shannon capacity</a> ($C=B\log_2(1+\mathrm{SNR})$) and to time–bandwidth duality: a shorter pulse or faster data rate occupies a wider spectrum.</p>`
    },
    {
      h: 'Spectrum, Fourier transform, and PSD',
      html: String.raw`<p>Three closely-related but distinct objects:</p>
      <ul>
        <li><b>Fourier transform</b> $X(f)$ — the complex spectrum (amplitude and phase) of a deterministic, finite-energy signal. See <a href="#fourier-transform">Fourier transform</a>.</li>
        <li><b>Energy spectral density</b> $|X(f)|^2$ — energy per hertz for finite-energy signals.</li>
        <li><b>Power spectral density (PSD)</b> — power per hertz for infinite-energy (power) signals like noise or ongoing transmissions; it is the Fourier transform of the autocorrelation (Wiener–Khinchin). See <a href="#psd">PSD</a>.</li>
      </ul>
      <p>The rule of thumb: use the Fourier transform (amplitude/phase) for deterministic pulses, and the PSD (power only, phase discarded) for random signals and noise. A spectrum analyzer measuring a live signal effectively estimates a PSD. The <a href="#noise-floor">noise floor</a> you see on the display is the PSD of the receiver/instrument noise.</p>`
    },
    {
      h: 'Reading a spectrum analyzer',
      html: String.raw`<p>A spectrum analyzer plots amplitude (usually dBm on a log axis) versus frequency. Key controls and what they mean:</p>
      <ul>
        <li><b>Center frequency & span</b> — where you look and how wide.</li>
        <li><b>Resolution bandwidth (RBW)</b> — the width of the analyzer's internal filter; narrower RBW resolves closely-spaced tones and lowers the displayed noise floor (by ~10 dB per decade of RBW), but slows the sweep. This is the sinc/time-bandwidth trade-off again.</li>
        <li><b>Video bandwidth (VBW)</b> — smooths the trace by averaging, revealing signals near the noise floor.</li>
        <li><b>Reference level & scale</b> — top of the screen and dB/division.</li>
      </ul>
      <p>What you read off the screen: the <b>carrier</b> and its power, <b>harmonics</b> and <b>spurs</b> (unwanted discrete tones), <b>occupied bandwidth</b>, the <b>noise floor</b>, and intermodulation products. A clean transmitter shows a single dominant line with harmonics far below; a distorted or overdriven one sprouts spurious lines. Because the display is a PSD, absolute power depends on RBW for noise-like signals but not for discrete tones — a crucial distinction when quoting numbers.</p>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<div class="callout tip"><p>By now the spectrum should feel like a second native language for signals:</p>
      <ul>
        <li><b>A spectrum is amplitude and phase versus frequency</b> — the Fourier view $X(f)=|X(f)|e^{j\angle X(f)}$ — and it loses nothing that the waveform contains.</li>
        <li><b>Signal type sets spectrum type:</b> periodic → line spectra, aperiodic → continuous spectra, random → a continuous PSD.</li>
        <li><b>Real signals are conjugate-symmetric</b> ($X(-f)=X^*(f)$), so the one-sided spectrum doubles positive amplitudes — but never DC or Nyquist (the 3 dB trap).</li>
        <li><b>"Bandwidth" needs a definition:</b> −3 dB, null-to-null, occupied, or equivalent-noise — they give different numbers.</li>
        <li><b>Deterministic pulses use the Fourier transform; noise uses the PSD</b> (Wiener–Khinchin), and a live analyzer estimates a PSD whose noise floor scales with RBW.</li>
        <li><b>Why it matters:</b> regulators, EMC labs, and every SDR waterfall read exactly these amplitude/phase and power spectra to police channels, hunt spurs, and diagnose distortion.</li>
      </ul></div>`
    }
  ],
  keyPoints: [
    String.raw`A spectrum is the frequency-domain view of a signal: amplitude $|X(f)|$ and phase $\angle X(f)$ versus frequency.`,
    String.raw`Periodic signals have line (discrete) spectra; aperiodic signals have continuous spectra; noise has a continuous PSD.`,
    String.raw`For real signals the spectrum is conjugate-symmetric: $X(-f)=X^*(f)$ (even magnitude, odd phase).`,
    String.raw`Two-sided spectra span $\pm f$; one-sided fold the negative half over, doubling amplitudes (except DC).`,
    String.raw`Bandwidth has several definitions (−3 dB, null-to-null, occupied, equivalent noise) — always state which.`,
    String.raw`Energy spectral density is $|X(f)|^2$; PSD is power/Hz for random/power signals (Wiener–Khinchin).`,
    String.raw`Use Fourier transform for deterministic pulses, PSD for noise and ongoing signals.`,
    String.raw`A finite observation window smears a spectral line into a sinc — the resolution limit.`,
    String.raw`On a spectrum analyzer, narrower RBW improves resolution and lowers the displayed noise floor but slows the sweep.`,
    String.raw`Displayed noise power depends on RBW; discrete-tone power does not.`
  ],
  equations: [
    {
      title: 'Spectrum as a Fourier transform',
      tex: String.raw`$$ X(f)=\int_{-\infty}^{\infty} x(t)\,e^{-j2\pi f t}\,dt $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want to know "how much of frequency $f$" is inside a time signal $x(t)$. The trick is to correlate the signal with a test sinusoid of that frequency.</p>
      <p><b>Step 1 — build a probe.</b> The complex sinusoid $e^{j2\pi f t}$ is a pure tone at frequency $f$. To ask how much of it $x(t)$ contains, multiply by its conjugate $e^{-j2\pi f t}$ and see if they line up.</p>
      <p><b>Step 2 — integrate to measure overlap.</b> Summing (integrating) the product over all time isolates the amount of that frequency, because any other frequency averages out to zero over the full axis:</p>
      $$ X(f)=\int_{-\infty}^{\infty} x(t)\,e^{-j2\pi f t}\,dt. $$
      <p><b>Step 3 — read off amplitude and phase.</b> $X(f)$ is complex; $|X(f)|$ is the amplitude spectrum and $\angle X(f)$ the phase spectrum.</p>
      <p><b>Result.</b> $X(f)$ <i>is</i> the spectrum. The inverse transform rebuilds $x(t)$ by summing all these frequency components back up — proof that the spectrum loses nothing.</p>`
    },
    {
      title: 'Conjugate symmetry of real signals',
      tex: String.raw`$$ x(t)\ \text{real}\ \Rightarrow\ X(-f)=X^*(f) $$`,
      derivation: String.raw`<p><b>Where we start.</b> We show why the negative-frequency half of a real signal's spectrum is redundant.</p>
      <p><b>Step 1 — evaluate the transform at $-f$.</b></p>
      $$ X(-f)=\int x(t)\,e^{+j2\pi f t}\,dt. $$
      <p><b>Step 2 — take the conjugate of $X(f)$.</b> Since $x(t)$ is real, $x^*(t)=x(t)$, so</p>
      $$ X^*(f)=\int x(t)\,e^{+j2\pi f t}\,dt. $$
      <p><b>Step 3 — compare.</b> The two integrals are identical.</p>
      <p><b>Result.</b> $$ X(-f)=X^*(f). $$ Hence $|X(-f)|=|X(f)|$ (even magnitude) and $\angle X(-f)=-\angle X(f)$ (odd phase) — the reason a one-sided spectrum captures everything for real signals.</p>`
    },
    {
      title: 'One-sided from two-sided amplitude',
      tex: String.raw`$$ A_1(f)=2|X(f)|\ (f>0),\quad A_1(0)=|X(0)| $$`,
      derivation: String.raw`<p><b>Where we start.</b> A real cosine $A\cos(2\pi f_0 t)$ has a two-sided spectrum with two spikes of height $A/2$ at $\pm f_0$. We want the single physical line of height $A$.</p>
      <p><b>Step 1 — recall Euler.</b> $A\cos(2\pi f_0 t)=\tfrac{A}{2}e^{j2\pi f_0 t}+\tfrac{A}{2}e^{-j2\pi f_0 t}$ — half the amplitude sits at $+f_0$, half at $-f_0$.</p>
      <p><b>Step 2 — fold and add.</b> Because of conjugate symmetry, the negative spike carries the same magnitude. Reflecting it onto the positive axis and adding gives $\tfrac{A}{2}+\tfrac{A}{2}=A$.</p>
      $$ A_1(f)=2|X(f)|\quad(f>0). $$
      <p><b>Step 3 — leave DC alone.</b> The $f=0$ component has no mirror partner, so it is <i>not</i> doubled: $A_1(0)=|X(0)|$.</p>
      <p><b>Result.</b> The one-sided amplitude matches the physical peak of each sinusoid; forgetting to exempt DC (and the Nyquist bin) is the classic 3 dB blunder.</p>`
    },
    {
      title: 'Power spectral density (Wiener–Khinchin)',
      tex: String.raw`$$ S_x(f)=\int_{-\infty}^{\infty} R_x(\tau)\,e^{-j2\pi f\tau}\,d\tau $$`,
      derivation: String.raw`<p><b>Where we start.</b> Random signals (noise) have infinite energy, so their plain Fourier transform doesn't converge. We need a power-based spectrum via the autocorrelation.</p>
      <p><b>Step 1 — define autocorrelation.</b> $R_x(\tau)=\mathbb{E}[x(t)x(t+\tau)]$ measures how similar the signal is to a shifted copy of itself — its "memory".</p>
      <p><b>Step 2 — state the Wiener–Khinchin theorem.</b> For a wide-sense-stationary process the PSD is the Fourier transform of the autocorrelation:</p>
      $$ S_x(f)=\int R_x(\tau) e^{-j2\pi f\tau}\,d\tau. $$
      <p><b>Step 3 — interpret.</b> $S_x(f)$ is power per hertz; integrating it over all $f$ gives total power $R_x(0)=\mathbb{E}[x^2]$. Phase information is gone — only power remains.</p>
      <p><b>Result.</b> White noise has $R_x(\tau)=\tfrac{N_0}{2}\delta(\tau)$ (uncorrelated), whose transform is the flat PSD $S_x(f)=N_0/2$ — the "white" spectrum. This is the object a spectrum analyzer estimates for noise.</p>`
    },
    {
      title: 'Null-to-null bandwidth of a rectangular pulse',
      tex: String.raw`$$ B_{\text{null}}=\frac{2}{T} $$`,
      derivation: String.raw`<p><b>Where we start.</b> A data pulse of duration $T$ (a rectangle) has a sinc spectrum. We find the width of its main lobe — the usual "bandwidth" of the pulse.</p>
      <p><b>Step 1 — the spectrum is a sinc.</b> From the rect↔sinc pair, $X(f)\propto \mathrm{sinc}(fT)$.</p>
      <p><b>Step 2 — locate the first nulls.</b> $\mathrm{sinc}(fT)=0$ when $fT=\pm1$, i.e. at $f=\pm1/T$.</p>
      <p><b>Step 3 — measure the main-lobe width.</b> From $-1/T$ to $+1/T$ is a two-sided width of $2/T$.</p>
      <p><b>Result.</b> $$ B_{\text{null}}=\frac{2}{T}. $$ Faster signalling (smaller $T$) means a proportionally wider spectrum — the direct spectral cost of higher data rate.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What does a frequency spectrum show?`, back: String.raw`Amplitude $|X(f)|$ and phase $\angle X(f)$ of each frequency component versus frequency.` },
    { front: String.raw`Line spectrum vs continuous spectrum — which signals?`, back: String.raw`Periodic signals give line spectra (harmonics); aperiodic signals give continuous spectra.` },
    { front: String.raw`What symmetry does a real signal's spectrum have?`, back: String.raw`Conjugate symmetry $X(-f)=X^*(f)$: even magnitude, odd phase.` },
    { front: String.raw`Two-sided vs one-sided spectrum?`, back: String.raw`Two-sided spans $\pm f$; one-sided folds the negative half over, doubling amplitudes (except DC).` },
    { front: String.raw`Why is DC not doubled when going one-sided?`, back: String.raw`It has no negative-frequency mirror partner to fold in.` },
    { front: String.raw`Name three bandwidth definitions.`, back: String.raw`−3 dB (half-power), null-to-null, occupied (e.g. 99%) — also equivalent noise bandwidth.` },
    { front: String.raw`What is the PSD and what theorem defines it?`, back: String.raw`Power per hertz; the Fourier transform of the autocorrelation (Wiener–Khinchin).` },
    { front: String.raw`When use Fourier transform vs PSD?`, back: String.raw`Fourier transform for deterministic finite-energy pulses; PSD for random/power signals and noise.` },
    { front: String.raw`What does resolution bandwidth (RBW) control on a spectrum analyzer?`, back: String.raw`Filter width — narrower RBW resolves closer tones and lowers displayed noise floor but slows the sweep.` },
    { front: String.raw`Does displayed noise power depend on RBW?`, back: String.raw`Yes — noise power scales with RBW; discrete-tone power does not.` },
    { front: String.raw`Null-to-null bandwidth of a duration-$T$ rectangular pulse?`, back: String.raw`$2/T$.` },
    { front: String.raw`Why does a finite observation window smear a spectral line?`, back: String.raw`Windowing multiplies in time = convolving with a sinc in frequency, broadening the line.` },
    { front: String.raw`What is the amplitude spectrum vs phase spectrum?`, back: String.raw`Amplitude is $|X(f)|$ (strength of each component); phase is $\angle X(f)$ (timing).` },
    { front: String.raw`What does the noise floor on an analyzer represent?`, back: String.raw`The PSD of the instrument/receiver noise.` }
  ],
  mcqs: [
    { q: String.raw`A periodic signal has what kind of spectrum?`, options: [String.raw`Continuous`, String.raw`A line (discrete harmonic) spectrum`, String.raw`Flat`, String.raw`Random`], answer: 1, explain: String.raw`Fourier series → spikes at the fundamental and harmonics.` },
    { q: String.raw`For a real signal, the spectrum satisfies:`, options: [String.raw`$X(-f)=X(f)$`, String.raw`$X(-f)=X^*(f)$`, String.raw`$X(-f)=-X(f)$`, String.raw`$X(f)=0$ for $f<0$`], answer: 1, explain: String.raw`Conjugate symmetry — even magnitude, odd phase.` },
    { q: String.raw`Converting a two-sided amplitude spectrum to one-sided, you multiply positive-frequency amplitudes by:`, options: [String.raw`1 (no change)`, String.raw`2, except DC`, String.raw`0.5`, String.raw`$\pi$`], answer: 1, explain: String.raw`Fold negative half over; DC has no partner so is unchanged.` },
    { q: String.raw`The PSD is the Fourier transform of:`, options: [String.raw`The signal`, String.raw`The autocorrelation`, String.raw`The phase`, String.raw`The impulse response`], answer: 1, explain: String.raw`Wiener–Khinchin theorem.` },
    { q: String.raw`Which quantity discards phase information?`, options: [String.raw`The Fourier transform`, String.raw`The power spectrum / PSD`, String.raw`The inverse transform`, String.raw`The waveform`], answer: 1, explain: String.raw`Power spectra keep magnitude-squared only.` },
    { q: String.raw`A single pure sinusoid has a spectrum that is:`, options: [String.raw`A flat band`, String.raw`A single spectral line (per side)`, String.raw`A sinc`, String.raw`Continuous`], answer: 1, explain: String.raw`An ideal, infinitely-long tone is one line (two-sided: two).` },
    { q: String.raw`Narrowing the resolution bandwidth on a spectrum analyzer:`, options: [String.raw`Raises the noise floor`, String.raw`Lowers the displayed noise floor and improves resolution`, String.raw`Has no effect`, String.raw`Speeds up the sweep`], answer: 1, explain: String.raw`Less noise passes the narrower filter; but the sweep slows.` },
    { q: String.raw`Null-to-null bandwidth of a rectangular pulse of width $T$ is:`, options: [String.raw`$1/T$`, String.raw`$2/T$`, String.raw`$T/2$`, String.raw`$1/(2T)$`], answer: 1, explain: String.raw`Sinc spectrum with first nulls at $\pm1/T$, width $2/T$.` },
    { q: String.raw`A finite-duration observation of a tone produces:`, options: [String.raw`A perfect line`, String.raw`A sinc-broadened line`, String.raw`Zero spectrum`, String.raw`White noise`], answer: 1, explain: String.raw`Time windowing convolves the line with a sinc, smearing it.` },
    { q: String.raw`For random noise, the appropriate spectral description is:`, options: [String.raw`The Fourier transform`, String.raw`The power spectral density`, String.raw`The phase spectrum`, String.raw`The Laplace transform`], answer: 1, explain: String.raw`Noise has infinite energy; use PSD (power/Hz).` },
    { q: String.raw`On a spectrum analyzer, the power of a discrete tone (unlike noise) is:`, options: [String.raw`Dependent on RBW`, String.raw`Independent of RBW`, String.raw`Always at the noise floor`, String.raw`Negative`], answer: 1, explain: String.raw`A tone's power is concentrated, so RBW doesn't change its reading; noise power does scale with RBW.` },
    { q: String.raw`The −3 dB bandwidth is the width between points where power falls to:`, options: [String.raw`One-tenth`, String.raw`One-half`, String.raw`One-quarter`, String.raw`Zero`], answer: 1, explain: String.raw`Half power = −3 dB = amplitude $1/\sqrt2$.` }
  ],
  numericals: [
    { q: String.raw`A 2 V peak, 1 kHz cosine is analyzed. What amplitude appears at 1 kHz on a two-sided vs a one-sided spectrum?`, solution: String.raw`<p><b>Formula.</b> $$ A\cos(2\pi f_0 t)=\tfrac{A}{2}e^{j2\pi f_0 t}+\tfrac{A}{2}e^{-j2\pi f_0 t},\qquad A_1=2\cdot\tfrac{A}{2}=A\ (f>0) $$ where $A$ is the peak amplitude, the two-sided spectrum splits it into $A/2$ at $\pm f_0$, and the one-sided folds the negative half over.</p>
<p><b>Substitute.</b> With $A=2$ V and $f_0=1$ kHz, the two-sided spikes are $A/2=1$ V each; folding gives $A_1=1+1$ V.</p>
<p><b>Compute.</b> Two-sided: two 1 V lines at $\pm1$ kHz. One-sided: a single 2 V line at 1 kHz.</p>
<p><b>Explanation.</b> The one-sided line matches the physical peak (2 V), which is why analyzers use it. Sanity check: total is conserved — $1+1=2$ V of the same tone, just displayed on one axis instead of two.</p>` },
    { q: String.raw`A rectangular data pulse lasts $T=0.5\ \mu s$. Find its null-to-null bandwidth.`, solution: String.raw`<p><b>Formula.</b> $$ B_{\text{null}}=\frac{2}{T} $$ the main-lobe width of a duration-$T$ rectangular pulse's sinc spectrum (first nulls at $\pm1/T$).</p>
<p><b>Substitute.</b> $$ B_{\text{null}}=\frac{2}{0.5\times10^{-6}\ \text{s}}. $$</p>
<p><b>Compute.</b> $B_{\text{null}}=4\times10^{6}$ Hz $=4$ MHz.</p>
<p><b>Explanation.</b> A half-microsecond pulse spreads its energy across a 4 MHz main lobe. Sanity check: halving the pulse duration would double the bandwidth — the direct spectral cost of faster signalling.</p>` },
    { q: String.raw`A spectrum analyzer shows a noise floor of $-90$ dBm at RBW = 10 kHz. What noise floor would you expect at RBW = 1 kHz?`, solution: String.raw`<p><b>Formula.</b> $$ \Delta P_{\text{dB}}=10\log_{10}\!\left(\frac{\text{RBW}_2}{\text{RBW}_1}\right) $$ because displayed noise power is proportional to the resolution-bandwidth filter width.</p>
<p><b>Substitute.</b> $$ \Delta P_{\text{dB}}=10\log_{10}\!\left(\frac{1\ \text{kHz}}{10\ \text{kHz}}\right)=10\log_{10}(0.1). $$</p>
<p><b>Compute.</b> $\Delta P_{\text{dB}}=-10$ dB, so the new floor is $-90-10=-100$ dBm.</p>
<p><b>Explanation.</b> Narrowing the RBW tenfold passes ten times less noise, lowering the floor by 10 dB and exposing weaker signals. Note a discrete tone's reading would <i>not</i> change — only noise power scales with RBW.</p>` },
    { q: String.raw`A square wave has fundamental 1 kHz. List the frequencies of its first three spectral lines.`, solution: String.raw`<p><b>Formula.</b> $$ f_n=(2m-1)f_0,\quad m=1,2,3,\dots $$ an ideal square wave contains only odd harmonics of the fundamental $f_0$, with amplitudes $\propto 1/(2m-1)$.</p>
<p><b>Substitute.</b> With $f_0=1$ kHz: $f_1=1\cdot f_0$, $f_2=3\cdot f_0$, $f_3=5\cdot f_0$.</p>
<p><b>Compute.</b> The first three lines are at 1 kHz, 3 kHz, and 5 kHz (amplitudes $\propto 1,\tfrac13,\tfrac15$).</p>
<p><b>Explanation.</b> The absence of even harmonics is the half-wave symmetry of a square wave. Sanity check: the $1/n$ amplitude fall-off is what makes the reconstructed edges sharp yet shows Gibbs overshoot when truncated.</p>` },
    { q: String.raw`White noise has PSD $N_0/2 = 10^{-20}$ W/Hz. What noise power falls in a 1 MHz bandwidth?`, solution: String.raw`<p><b>Formula.</b> $$ P=N_0 B $$ where $N_0$ is the <i>one-sided</i> noise density and $B$ the one-sided bandwidth; the given two-sided level is $N_0/2$.</p>
<p><b>Substitute.</b> Convert to one-sided: $N_0=2\times10^{-20}$ W/Hz. Then $$ P=2\times10^{-20}\times10^{6}. $$</p>
<p><b>Compute.</b> $P=2\times10^{-14}$ W. In dBm: $10\log_{10}(2\times10^{-14}/10^{-3})=10\log_{10}(2\times10^{-11})=-107$ dBm.</p>
<p><b>Explanation.</b> A 1 MHz band collects a very small $2\times10^{-14}$ W of thermal-like noise. The factor-of-two conversion from the two-sided $N_0/2$ to the one-sided $N_0$ is the classic 3 dB trap — omitting it halves the answer.</p>` },
    { q: String.raw`A signal occupies from 100.0 to 100.2 MHz. State its bandwidth and the analyzer center frequency to display it centered.`, solution: String.raw`<p><b>Formula.</b> $$ B=f_{\text{high}}-f_{\text{low}},\qquad f_c=\frac{f_{\text{high}}+f_{\text{low}}}{2} $$ where $B$ is the occupied bandwidth and $f_c$ the centre frequency.</p>
<p><b>Substitute.</b> $$ B=100.2-100.0\ \text{MHz},\qquad f_c=\frac{100.0+100.2}{2}\ \text{MHz}. $$</p>
<p><b>Compute.</b> $B=0.2$ MHz $=200$ kHz and $f_c=100.1$ MHz.</p>
<p><b>Explanation.</b> Setting centre 100.1 MHz with a span slightly above 200 kHz frames the whole signal. This is the routine setup for measuring a channel's occupied bandwidth against a regulatory mask.</p>` }
  ],
  realWorld: String.raw`<p>The frequency spectrum is the working language of RF engineering. Regulators (FCC, ITU) allocate and police spectrum by occupied bandwidth and spurious-emission masks read directly off a spectrum analyzer. Cellular and Wi-Fi radios must keep their power within an assigned channel and their out-of-band emissions below a spectral mask — verified by the amplitude spectrum. EMC/EMI compliance testing hunts for harmonics and spurs. In diagnostics, a spectrum reveals oscillator <a href="#phase-noise">phase noise</a> as a skirt around the carrier, intermodulation as extra tones, and interference as unexpected lines. Audio engineers read the same displays to spot hum (50/60 Hz lines) and distortion harmonics. Every SDR waterfall display, every satellite-link power-flux-density check, and every radar Doppler measurement is fundamentally a frequency-spectrum reading.</p>`,
  related: ['fourier-transform', 'psd', 'sinc-function', 'shannon', 'noise-floor']
}
);
