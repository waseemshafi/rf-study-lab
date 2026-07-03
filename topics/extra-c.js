// Spread Spectrum & Coding — deep exam-mastery study content (convolutional codes, channel coding)
CONTENT.topics.push(
  {
    id: 'convolutional-codes',
    title: 'Convolutional Codes',
    category: 'Spread Spectrum & Coding',
    tags: ['convolutional', 'FEC', 'trellis', 'Viterbi', 'constraint length', 'free distance', 'puncturing', 'generator polynomials'],
    summary: String.raw`A convolutional code encodes a continuous data stream by sliding it through a shift register and forming output bits as modulo-2 sums tapped off by generator polynomials, producing structured redundancy whose memory is decoded on a trellis by the Viterbi or BCJR algorithm.`,
    prerequisites: ['channel-coding', 'fec', 'convolution', 'ber'],
    intro: String.raw`<p>A <strong>convolutional code</strong> is a forward-error-correction code with <em>memory</em>: unlike a block code that maps each independent $k$-bit block to an $n$-bit codeword, a convolutional encoder feeds a continuous stream of information bits through a shift register and produces output bits that depend not only on the current input but on a window of past inputs. The name comes directly from the operation performed — each output stream is the <strong>convolution</strong> (modulo 2) of the input sequence with a fixed impulse response, the <em>generator sequence</em>. This memory is what gives the code its power: errors are corrected by exploiting correlations that span many bits, and the maximum-likelihood decoder (the Viterbi algorithm) searches a trellis of encoder states rather than a table of isolated codewords.</p>
    <p>Convolutional codes dominated point-to-point digital communications for decades — deep-space links (the Voyager and Galileo missions), GSM, IS-95, 802.11a/g, DVB, and satellite modems all used them, most famously the rate-1/2, constraint-length-7 code with generators $(171,133)_8$. Even in the modern era of Turbo and LDPC codes, convolutional codes live on as the constituent encoders inside Turbo codes and as tail-biting codes in LTE/5G control channels. This topic builds the encoder from the shift register up, develops the tree, state, and trellis pictures, defines the all-important <strong>free distance</strong> $d_{free}$, and connects the structure to Viterbi/BCJR decoding, puncturing, and coding gain.</p>`,
    sections: [
      {
        h: 'The encoder: shift register, taps, and generator polynomials',
        html: String.raw`<p>A rate $k/n$ convolutional encoder takes in $k$ bits and emits $n$ bits per time step, with $n > k$ so that redundancy is added. The simplest and most common case is $k=1$. The encoder is a shift register of $m$ memory stages (flip-flops); at each clock the new input bit enters, and $n$ modulo-2 adders (XOR gates) tap selected stages to produce the $n$ output bits, which are then serialized.</p>
        <p>Consider the canonical rate-1/2 encoder with $m=2$ memory elements. Let $u$ be the current input and $s_1, s_2$ the two stored past bits. Two generators tap the register:</p>
        <ul>
          <li>$v^{(1)} = u \oplus s_1 \oplus s_2$ &nbsp; (taps on input and both memory cells)</li>
          <li>$v^{(2)} = u \oplus s_2$ &nbsp; (taps on input and the second cell)</li>
        </ul>
        <p>Each tap pattern is written as a <strong>generator polynomial</strong> in the delay operator $D$ (equivalently as a binary or octal number). Here $g^{(1)}(D) = 1 + D + D^2$ and $g^{(2)}(D) = 1 + D^2$. In binary the tap masks are $111$ and $101$, and in octal $7$ and $5$. So this is the famous $(7,5)_8$ code.</p>
        <div class="callout"><b>Reading generator octals.</b> Group the tap bits (MSB = current input tap) in threes from the left and convert: $111\,{\to}\,7$, $101\,{\to}\,5$. The industry-standard $K=7$ code has generators $1111001$ and $1011011$, i.e. $(171,133)_8$.</div>`
      },
      {
        h: 'Constraint length, rate, memory, and code parameters',
        html: String.raw`<p>Several parameters describe a convolutional code, and exam questions love to test the (often confusing) definitions:</p>
        <table class="data">
          <tr><th>Symbol</th><th>Name</th><th>Meaning</th></tr>
          <tr><td>$k$</td><td>input bits/step</td><td>bits shifted in per clock (usually 1)</td></tr>
          <tr><td>$n$</td><td>output bits/step</td><td>coded bits emitted per clock</td></tr>
          <tr><td>$R_c = k/n$</td><td>code rate</td><td>fraction of stream that is information</td></tr>
          <tr><td>$m$</td><td>memory order</td><td>number of delay elements (register length)</td></tr>
          <tr><td>$K = m+1$</td><td>constraint length</td><td>input bits influencing each output (most common convention)</td></tr>
          <tr><td>$2^m$</td><td>number of states</td><td>distinct shift-register contents</td></tr>
        </table>
        <p>The <strong>constraint length</strong> $K$ is the span of input bits that affects a given output bit; with a single-input register of $m$ stages, the current output depends on the present bit and the $m$ stored bits, so $K = m+1$. (Beware: some texts define $K=m$, and multi-input codes generalize this — always check the convention.) The <strong>number of trellis states</strong> is $2^m = 2^{K-1}$: for the $K=7$ code that is $2^6 = 64$ states, and this exponential growth is exactly what sets Viterbi decoding complexity.</p>
        <p>Decoding effort per bit scales as the number of states times the number of branches, $\propto 2^{K-1}\cdot 2^k$. Larger $K$ yields stronger codes (greater free distance) but exponentially more expensive decoding — the fundamental trade of the family.</p>`
      },
      {
        h: 'Impulse response and the convolution view',
        html: String.raw`<p>Why "convolutional"? Drive the encoder with a single $1$ followed by zeros (an impulse). Each output stream then traces out the tap pattern of its generator — that is the encoder's <em>impulse response</em>. For $g^{(1)}=(1+D+D^2)$ the response to $u=(1,0,0,\dots)$ is $v^{(1)}=(1,1,1,0,0,\dots)$; for $g^{(2)}=(1+D^2)$ it is $(1,0,1,0,\dots)$. For an arbitrary input sequence, each output is the modulo-2 <strong>convolution</strong> of the input with that generator sequence:</p>
        <p>$$ v^{(j)}_\ell = \sum_{i} u_{\ell-i}\, g^{(j)}_i \pmod 2. $$</p>
        <p>In the transform domain this is a polynomial product: $\mathbf{v}^{(j)}(D) = u(D)\,g^{(j)}(D)$. The whole encoder is a linear time-invariant system over GF(2), which is precisely why the code is linear (the all-zero sequence is a codeword, and the distance structure can be studied relative to it).</p>
        <div class="callout">Because the code is linear over GF(2), analyzing error performance reduces to counting codewords by their <em>weight</em> relative to the all-zero path — the origin of the distance spectrum and $d_{free}$.</div>`
      },
      {
        h: 'Tree, state diagram, and trellis representations',
        html: String.raw`<p>The same encoder can be drawn three ways, each illuminating a different aspect:</p>
        <ul>
          <li><strong>Tree diagram.</strong> Starting from the initial state, each input bit branches the tree (up for 0, down for 1), and each branch is labeled with the $n$ output bits. The tree grows as $2^{L}$ for $L$ input bits — it captures every possible input sequence but explodes exponentially and repeats structure.</li>
          <li><strong>State diagram.</strong> The register contents $(s_1 s_2)$ form the state; there are $2^m$ of them. Directed edges show, for each input, the next state and the emitted $n$ bits. This is compact ($2^m$ nodes) but hides the time axis.</li>
          <li><strong>Trellis diagram.</strong> The state diagram <em>unrolled in time</em>: a column of $2^m$ states at each step, with branches to the next column. The trellis is the workhorse — it merges the tree's redundant branches back together (paths that reach the same state at the same time are indistinguishable going forward), which is exactly what makes efficient dynamic-programming decoding possible.</li>
        </ul>
        <p>For the $(7,5)$ code the four states are $00,01,10,11$. From state $00$: input $0$ emits $00$ and stays in $00$; input $1$ emits $11$ and moves to $10$. Every state has two outgoing branches (input 0 / input 1) and two incoming branches — the butterfly structure that Viterbi exploits.</p>`
      },
      {
        h: 'Free distance and the distance spectrum',
        html: String.raw`<p>For a block code the error-correcting power is set by the minimum Hamming distance $d_{min}$. For a convolutional code the analogous, decisive quantity is the <strong>free distance</strong> $d_{free}$: the minimum Hamming weight of any nonzero codeword, equivalently the minimum Hamming distance between any two distinct code sequences. Because the code is linear, this equals the smallest weight of any path that leaves the all-zero state and later re-merges with it.</p>
        <p>The number of random errors a Viterbi decoder can correct is</p>
        <p>$$ t = \left\lfloor \frac{d_{free}-1}{2} \right\rfloor. $$</p>
        <p>Larger $d_{free}$ means the correct path stays farther (in Hamming distance) from wrong paths, so more channel errors are needed to fool the decoder. Values for standard rate-1/2 codes: $(7,5)_8$, $K=3 \Rightarrow d_{free}=5$; $K=5 \Rightarrow d_{free}=7$; the $(171,133)_8$, $K=7$ code $\Rightarrow d_{free}=10$. The <strong>distance spectrum</strong> $\{A_d\}$ (number of paths of each weight $d$) and the information-weight spectrum feed the union bound on bit error rate.</p>
        <div class="callout">$d_{free}$ is to convolutional codes what $d_{min}$ is to block codes. A good code maximizes $d_{free}$ for a given $K$ and rate; catastrophic generators (where finite input weight maps to finite output weight yet infinite errors) must be avoided.</div>`
      },
      {
        h: 'Puncturing: trading redundancy for rate',
        html: String.raw`<p>A rate-1/2 mother code can be converted to higher rates ($2/3$, $3/4$, $5/6$, $7/8$) by <strong>puncturing</strong> — periodically deleting selected coded bits according to a puncturing matrix and simply <em>not transmitting</em> them. The decoder inserts erasures (neutral metrics) at the punctured positions and runs the same Viterbi trellis of the mother code.</p>
        <ul>
          <li><strong>Advantage:</strong> one encoder/decoder pair supports a whole family of rates (rate-compatible puncturing enables adaptive coding and hybrid-ARQ, where extra bits are sent incrementally).</li>
          <li><strong>Cost:</strong> puncturing removes redundancy, so $d_{free}$ falls and coding gain drops as the rate rises. A punctured rate-3/4 code is weaker than a natively designed rate-3/4 code but far simpler to implement.</li>
        </ul>
        <p>Example puncturing matrix for rate 3/4 from a rate-1/2 mother: keep pattern $\begin{smallmatrix}1&1&0\\1&0&1\end{smallmatrix}$ deletes 2 of every 6 coded bits, mapping 3 input bits to 4 output bits.</p>`
      },
      {
        h: 'Decoding: Viterbi (hard/soft) and BCJR',
        html: String.raw`<p>Two maximum-likelihood-style decoders operate on the trellis:</p>
        <ul>
          <li><strong>Viterbi algorithm (MLSE).</strong> Finds the single most-likely <em>sequence</em>. At each state it keeps only the surviving path with the best accumulated metric (add–compare–select), so complexity is linear in sequence length and $\propto 2^{K-1}$ per step. With <strong>hard decisions</strong> the branch metric is Hamming distance; with <strong>soft decisions</strong> (using the analog demodulator output) it is Euclidean/correlation distance, buying roughly <strong>2 dB</strong> of extra coding gain.</li>
          <li><strong>BCJR / MAP algorithm.</strong> A forward–backward algorithm that computes the a-posteriori probability of <em>each bit</em>, producing soft (probabilistic) outputs. It is more complex than Viterbi but is essential inside iterative decoders — Turbo codes exchange BCJR soft information between two convolutional constituent decoders.</li>
        </ul>
        <p>Practical Viterbi decoders use a finite <strong>traceback depth</strong> of about $5K$ to $6K$ branches, after which the surviving paths have almost surely merged, allowing streaming (non-terminated) decoding with negligible loss. Termination options: <em>zero-flushing</em> (append $m$ zeros to force the encoder back to state $00$) or <em>tail-biting</em> (start and end in the same state, wasting no tail bits — used in LTE/5G control channels).</p>`
      },
      {
        h: 'Convolutional versus block codes',
        html: String.raw`<p>The two great families of FEC differ structurally:</p>
        <table class="data">
          <tr><th>Aspect</th><th>Block code</th><th>Convolutional code</th></tr>
          <tr><td>Data handling</td><td>fixed $k$-bit blocks $\to$ $n$-bit codewords</td><td>continuous stream through a register</td></tr>
          <tr><td>Memory</td><td>memoryless between blocks</td><td>output depends on last $K$ inputs</td></tr>
          <tr><td>Key distance</td><td>$d_{min}$</td><td>$d_{free}$</td></tr>
          <tr><td>Decoding</td><td>syndrome / algebraic (BM, etc.)</td><td>trellis (Viterbi, BCJR)</td></tr>
          <tr><td>Soft decision</td><td>harder to exploit</td><td>natural, ~2 dB gain</td></tr>
          <tr><td>Best at</td><td>burst errors (with RS), high code rates</td><td>random errors, streaming, low latency</td></tr>
        </table>
        <p>They are complementary and were classically <strong>concatenated</strong>: an inner convolutional code (Viterbi-decoded, good against random errors) followed by an outer Reed–Solomon block code (good against the residual bursts the Viterbi decoder emits), with an interleaver between them. The Voyager deep-space standard used exactly this — RS(255,223) over convolutional $(171,133)$ — a scheme that ruled until Turbo and LDPC codes arrived.</p>`
      }
    ],
    keyPoints: [
      String.raw`A convolutional encoder is a shift register with $n$ XOR taps; each output is the mod-2 convolution of the input with a generator sequence $g^{(j)}(D)$.`,
      String.raw`Rate $R_c = k/n$; memory $m$; constraint length $K = m+1$; number of trellis states $= 2^m = 2^{K-1}$.`,
      String.raw`Generator polynomials are written as tap masks in octal, e.g. the standard $K=7$ rate-1/2 code is $(171,133)_8$.`,
      String.raw`Three representations: tree (exhaustive, exponential), state diagram (compact, $2^m$ nodes), trellis (unrolled in time — the decoding workhorse).`,
      String.raw`Free distance $d_{free}$ is the minimum weight of any nonzero code path; it plays the role $d_{min}$ plays for block codes.`,
      String.raw`Random-error correction capability $t = \lfloor (d_{free}-1)/2 \rfloor$; the $(171,133)$ code has $d_{free}=10$.`,
      String.raw`Viterbi decoding is maximum-likelihood sequence estimation via add–compare–select; complexity $\propto 2^{K-1}$ per step.`,
      String.raw`Soft-decision Viterbi (Euclidean metrics) beats hard-decision (Hamming metrics) by about 2 dB of coding gain.`,
      String.raw`Traceback depth $\approx 5K$–$6K$ lets the decoder run on a continuous stream with negligible loss.`,
      String.raw`Puncturing deletes coded bits to raise the rate (2/3, 3/4, ...); it lowers $d_{free}$ but reuses one mother encoder/decoder.`,
      String.raw`BCJR (MAP) gives per-bit soft outputs and is the constituent decoder inside Turbo codes.`,
      String.raw`Convolutional codes have memory and suit random errors/streaming; they were concatenated with an outer Reed–Solomon block code for deep space.`
    ],
    equations: [
      {
        title: 'Encoder output as modulo-2 convolution',
        tex: String.raw`$$ v^{(j)}_\ell = \sum_{i=0}^{m} g^{(j)}_i\, u_{\ell-i} \pmod 2, \qquad v^{(j)}(D) = u(D)\,g^{(j)}(D) $$`,
        derivation: String.raw`<p><b>Where we start.</b> The encoder is a shift register of $m$ stages. At time $\ell$ the register holds the current input $u_\ell$ and the $m$ previous inputs $u_{\ell-1},\dots,u_{\ell-m}$. Output stream $j$ is formed by XOR-ing together a fixed subset of these cells; the fixed subset is described by the tap vector $g^{(j)} = (g^{(j)}_0, g^{(j)}_1, \dots, g^{(j)}_m)$, where $g^{(j)}_i = 1$ if stage $i$ is tapped.</p>
        <p><b>Step 1 — write the XOR as a sum.</b> Modulo-2 addition (XOR) of the tapped cells is</p>
        $$ v^{(j)}_\ell = g^{(j)}_0 u_\ell \oplus g^{(j)}_1 u_{\ell-1} \oplus \cdots \oplus g^{(j)}_m u_{\ell-m}. $$
        <p>Because each term is a product $g^{(j)}_i u_{\ell-i}$ and the operation is addition mod 2, we can collapse it into a single summation.</p>
        <p><b>Step 2 — recognize the convolution.</b> The expression $\sum_i g^{(j)}_i u_{\ell-i}$ is, by definition, the discrete convolution of the input sequence $u$ with the tap (impulse-response) sequence $g^{(j)}$, evaluated at index $\ell$, all reduced mod 2. This is literally why the code is called <em>convolutional</em>.</p>
        <p><b>Step 3 — transform-domain form.</b> Introduce the delay operator $D$ (a one-step shift) and represent sequences as polynomials, e.g. $u(D)=\sum_\ell u_\ell D^\ell$. Convolution of sequences becomes multiplication of polynomials:</p>
        $$ v^{(j)}(D) = u(D)\, g^{(j)}(D) \pmod 2. $$
        <p><b>Result.</b> $$ v^{(j)}(D) = u(D)\,g^{(j)}(D). $$ The encoder is a linear time-invariant filter over GF(2). Each generator polynomial is one column of the encoder's transfer function; the full rate-$k/n$ encoder is a $k\times n$ polynomial generator matrix $G(D)$.</p>`
      },
      {
        title: 'Constraint length and state count',
        tex: String.raw`$$ K = m+1, \qquad N_{states} = 2^{m} = 2^{K-1} $$`,
        derivation: String.raw`<p><b>Where we start.</b> A single-input encoder has $m$ memory cells plus the current input line. An output bit is a function of the present input and the $m$ stored past inputs.</p>
        <p><b>Step 1 — count influencing inputs.</b> The number of input bits that can affect a given output bit is the present bit plus the $m$ remembered bits, i.e. $m+1$. This span is the definition of constraint length, so $K = m+1$.</p>
        <p><b>Step 2 — count states.</b> The encoder's future behavior depends only on the current register contents (the $m$ stored bits), not on how they arrived — this is the Markov (state) property. Each of the $m$ cells is one bit, so the number of distinct contents is $2^m$.</p>
        <p><b>Result.</b> $$ N_{states} = 2^m = 2^{K-1}. $$ For $K=7$, $N_{states}=2^6=64$. Viterbi decoding stores one survivor per state, so both memory and computation grow as $2^{K-1}$ — the exponential wall that caps practical constraint lengths near $K=9$.</p>`
      },
      {
        title: 'Error-correcting capability from free distance',
        tex: String.raw`$$ t = \left\lfloor \frac{d_{free}-1}{2} \right\rfloor $$`,
        derivation: String.raw`<p><b>Where we start.</b> The code is linear, so distances between codewords can be measured relative to the all-zero codeword. The smallest nonzero codeword weight is the free distance $d_{free}$; hence any two distinct code sequences differ in at least $d_{free}$ positions.</p>
        <p><b>Step 1 — geometry of decoding spheres.</b> Place a Hamming sphere of radius $t$ around each valid code sequence. A maximum-likelihood decoder picks the code sequence closest (fewest differing bits) to the received sequence. Decoding is guaranteed correct if the received sequence stays inside the correct sequence's sphere.</p>
        <p><b>Step 2 — non-overlap condition.</b> For spheres of radius $t$ around two sequences at distance $d_{free}$ to not overlap, we need $2t < d_{free}$, i.e. $2t \le d_{free}-1$.</p>
        $$ 2t \le d_{free} - 1 \;\Rightarrow\; t \le \frac{d_{free}-1}{2}. $$
        <p><b>Step 3 — take the integer part.</b> $t$ counts whole errors, so take the floor.</p>
        <p><b>Result.</b> $$ t = \left\lfloor \frac{d_{free}-1}{2} \right\rfloor. $$ For $d_{free}=10$ (the $K=7$ code), $t=\lfloor 9/2 \rfloor = 4$ random errors per constraint span. This is identical in form to the block-code rule $t=\lfloor (d_{min}-1)/2\rfloor$, with $d_{free}$ replacing $d_{min}$.</p>`
      },
      {
        title: 'Union bound on bit error probability',
        tex: String.raw`$$ P_b \le \frac{1}{k}\sum_{d = d_{free}}^{\infty} B_d\, P_2(d), \qquad P_2(d)=Q\!\left(\sqrt{2 d\, R_c\, \tfrac{E_b}{N_0}}\right) $$`,
        derivation: String.raw`<p><b>Where we start.</b> By linearity, assume the all-zero sequence was sent. A decoding error toward a wrong path of weight $d$ is a pairwise event whose probability is $P_2(d)$, the chance the wrong path accumulates a better metric.</p>
        <p><b>Step 1 — pairwise error for antipodal signaling on AWGN.</b> A weight-$d$ competing path differs in $d$ coded bits, each carrying energy $E_c = R_c E_b$. The distance-$d$ error probability with coherent BPSK/soft decoding is</p>
        $$ P_2(d) = Q\!\left(\sqrt{2 d\, R_c\, \tfrac{E_b}{N_0}}\right). $$
        <p><b>Step 2 — sum over all competing paths.</b> There are many wrong paths; let $A_d$ be the number of weight-$d$ paths and $B_d$ the total number of nonzero information bits on all weight-$d$ paths. Applying the union bound (probability of a union $\le$ sum of probabilities):</p>
        $$ P_b \le \frac{1}{k}\sum_{d=d_{free}}^{\infty} B_d\, P_2(d). $$
        <p>The $1/k$ converts codeword errors to bit errors (here $k=1$ per step for a rate-$1/n$ code).</p>
        <p><b>Step 3 — dominance of $d_{free}$.</b> $Q(\cdot)$ falls off super-exponentially, so at reasonable SNR the very first term ($d=d_{free}$) dominates. Thus $d_{free}$ sets the asymptotic slope of the BER curve and the coding gain.</p>
        <p><b>Result.</b> $$ P_b \approx \frac{B_{d_{free}}}{k}\, Q\!\left(\sqrt{2 d_{free} R_c \tfrac{E_b}{N_0}}\right). $$ The exponent contains $d_{free} R_c$, quantifying how free distance and rate together buy coding gain.</p>`
      },
      {
        title: 'Asymptotic coding gain',
        tex: String.raw`$$ G_{coding} \approx 10\log_{10}\!\left(R_c\, d_{free}\right)\ \text{dB (soft decision)} $$`,
        derivation: String.raw`<p><b>Where we start.</b> Uncoded coherent BPSK has $P_b = Q(\sqrt{2E_b/N_0})$. The coded system's dominant term is $\approx Q(\sqrt{2 d_{free} R_c\, E_b/N_0})$ from the union bound.</p>
        <p><b>Step 1 — equate the arguments.</b> Two systems achieve the same BER when the arguments of their $Q$-functions match. Comparing exponents, the coded scheme behaves like an uncoded scheme with an <em>effective</em> $E_b/N_0$ scaled by the factor $d_{free} R_c$.</p>
        $$ 2\,\frac{E_b}{N_0}\Big|_{eff} = 2\, d_{free} R_c \frac{E_b}{N_0}\Big|_{actual} \;\Rightarrow\; \frac{E_b/N_0|_{eff}}{E_b/N_0|_{actual}} = d_{free}R_c. $$
        <p><b>Step 2 — express in dB.</b> A power ratio in dB is $10\log_{10}$ of that ratio.</p>
        <p><b>Result.</b> $$ G_{coding} \approx 10\log_{10}(R_c\, d_{free})\ \text{dB}. $$ For the $K=7$, rate-1/2 code: $10\log_{10}(0.5\times 10) = 10\log_{10}5 \approx 7\ \text{dB}$ of asymptotic gain. Hard-decision decoding loses ~2 dB relative to this soft-decision bound, and real (non-asymptotic) gains at BER $10^{-5}$ are a bit lower, around 5–6 dB.</p>`
      },
      {
        title: 'Viterbi complexity and traceback depth',
        tex: String.raw`$$ C_{ACS} \propto 2^{K-1}\cdot 2^{k}\ \text{per step}, \qquad L_{tb} \approx 5K\text{–}6K $$`,
        derivation: String.raw`<p><b>Where we start.</b> The Viterbi algorithm processes the trellis one time step at a time, holding one survivor path per state.</p>
        <p><b>Step 1 — count add–compare–select operations.</b> There are $2^{K-1}$ states. Each state receives $2^k$ incoming branches (one per possible $k$-bit input). For every state the decoder adds the branch metric to each incoming survivor metric, compares them, and selects the best. So per time step the ACS count is $2^{K-1}\times 2^k$.</p>
        <p><b>Step 2 — why complexity is linear in length.</b> This per-step cost is constant in the sequence length $L$, so total work is $O(L\cdot 2^{K-1}2^k)$ — linear in $L$, exponential only in $K$.</p>
        <p><b>Step 3 — traceback depth.</b> Surviving paths from all states tend to merge into a common history after roughly $5$–$6$ constraint lengths; beyond that point the oldest decided bit is stable. Choosing $L_{tb}\approx 5K$–$6K$ makes truncation loss negligible while bounding decoder latency and memory.</p>
        <p><b>Result.</b> $$ C_{ACS}\propto 2^{K-1}2^{k},\quad L_{tb}\approx 5K\text{–}6K. $$ This pairing — cheap per step, exponential in $K$, small fixed latency — is why Viterbi decoding of moderate-$K$ codes is cheap enough for hardware yet powerful.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What makes a code "convolutional" rather than block?`, back: String.raw`It has memory: outputs are the mod-2 convolution of the input stream with fixed generator sequences, so each output depends on the last $K$ inputs — not just an isolated $k$-bit block.` },
      { front: String.raw`Define code rate, memory, and constraint length.`, back: String.raw`Rate $R_c=k/n$; memory $m$ = number of register stages; constraint length $K=m+1$ = input bits influencing an output.` },
      { front: String.raw`How many trellis states does a rate-1/$n$ code have?`, back: String.raw`$2^m = 2^{K-1}$ states. For $K=7$ that is 64 states.` },
      { front: String.raw`What are the generators of the standard $K=7$ rate-1/2 code?`, back: String.raw`$(171,133)_8$, i.e. binary $1111001$ and $1011011$, with $d_{free}=10$.` },
      { front: String.raw`What is $d_{free}$ and why does it matter?`, back: String.raw`The minimum Hamming weight of any nonzero code path. It sets error-correction power ($t=\lfloor(d_{free}-1)/2\rfloor$) and the asymptotic slope/coding gain of the BER curve — the convolutional analog of $d_{min}$.` },
      { front: String.raw`Name the three encoder representations and their roles.`, back: String.raw`Tree (exhaustive, exponential), state diagram (compact, $2^m$ nodes), trellis (state diagram unrolled in time — used for decoding).` },
      { front: String.raw`How do you convert generator taps to octal?`, back: String.raw`Group the tap-mask bits (MSB = input tap) in threes and convert each group: $111\to7$, $101\to5$, so $(7,5)_8$.` },
      { front: String.raw`What does the Viterbi algorithm compute, and how?`, back: String.raw`The maximum-likelihood transmitted <em>sequence</em>, via add–compare–select keeping one survivor per state; complexity $\propto 2^{K-1}$ per step.` },
      { front: String.raw`Soft vs hard decision Viterbi — the gain?`, back: String.raw`Soft decision uses Euclidean/correlation metrics from the demodulator and gains about 2 dB over hard-decision (Hamming) metrics.` },
      { front: String.raw`What is puncturing and its trade-off?`, back: String.raw`Periodically deleting coded bits to raise the rate (e.g. 1/2 $\to$ 3/4) using one mother code; it reduces $d_{free}$ and coding gain but reuses one encoder/decoder.` },
      { front: String.raw`What is the BCJR algorithm used for?`, back: String.raw`A forward–backward MAP algorithm giving per-bit a-posteriori soft outputs; it is the constituent decoder inside Turbo codes.` },
      { front: String.raw`Typical Viterbi traceback depth?`, back: String.raw`About $5K$ to $6K$ branches, after which survivors have merged, allowing streaming decoding with negligible loss.` },
      { front: String.raw`What is a catastrophic encoder?`, back: String.raw`One where a finite number of input errors can cause an infinite number of output (decoded) errors; occurs when generator polynomials share a common factor — must be avoided.` },
      { front: String.raw`How were convolutional and block codes combined for deep space?`, back: String.raw`Concatenation: inner convolutional code (Viterbi, good vs random errors) + interleaver + outer Reed–Solomon block code (good vs residual bursts), e.g. RS(255,223) over $(171,133)$.` }
    ],
    mcqs: [
      { q: String.raw`A convolutional encoder differs from a block encoder chiefly because it:`, options: [String.raw`uses larger alphabets`, String.raw`has memory — outputs depend on past inputs`, String.raw`is nonlinear`, String.raw`cannot be soft-decoded`], answer: 1, explain: String.raw`The defining feature is memory: each output is a convolution over the last $K$ inputs.` },
      { q: String.raw`For a rate-1/2 code with 6 memory elements, the constraint length and number of states are:`, options: [String.raw`$K=6$, 32 states`, String.raw`$K=7$, 64 states`, String.raw`$K=6$, 64 states`, String.raw`$K=7$, 128 states`], answer: 1, explain: String.raw`$K=m+1=7$; states $=2^m=2^6=64$.` },
      { q: String.raw`The generators $(7,5)_8$ correspond to the tap masks:`, options: [String.raw`$110$ and $100$`, String.raw`$111$ and $101$`, String.raw`$011$ and $001$`, String.raw`$101$ and $111$`], answer: 1, explain: String.raw`$7=111_2$, $5=101_2$; i.e. $1+D+D^2$ and $1+D^2$.` },
      { q: String.raw`Which representation is unrolled in time and used directly by the Viterbi decoder?`, options: [String.raw`tree diagram`, String.raw`state diagram`, String.raw`trellis diagram`, String.raw`Tanner graph`], answer: 2, explain: String.raw`The trellis is the time-indexed state diagram; Viterbi runs on it.` },
      { q: String.raw`For a convolutional code, the quantity that plays the role of $d_{min}$ is:`, options: [String.raw`the constraint length`, String.raw`the free distance $d_{free}$`, String.raw`the code rate`, String.raw`the traceback depth`], answer: 1, explain: String.raw`$d_{free}$ is the minimum weight of nonzero paths and governs correction power.` },
      { q: String.raw`A code has $d_{free}=7$. The guaranteed number of correctable random errors is:`, options: [String.raw`2`, String.raw`3`, String.raw`4`, String.raw`7`], answer: 1, explain: String.raw`$t=\lfloor(7-1)/2\rfloor=3$.` },
      { q: String.raw`Soft-decision Viterbi decoding over hard-decision gains approximately:`, options: [String.raw`0.5 dB`, String.raw`2 dB`, String.raw`6 dB`, String.raw`10 dB`], answer: 1, explain: String.raw`Euclidean metrics recover roughly 2 dB relative to Hamming metrics.` },
      { q: String.raw`Puncturing a rate-1/2 code to rate 3/4:`, options: [String.raw`increases $d_{free}$`, String.raw`deletes coded bits, lowering $d_{free}$`, String.raw`adds new memory stages`, String.raw`requires a new trellis`], answer: 1, explain: String.raw`Puncturing removes redundancy (raising rate) and reduces free distance while reusing the mother trellis.` },
      { q: String.raw`Viterbi decoder computation per time step scales as:`, options: [String.raw`$O(L^2)$`, String.raw`$\propto 2^{K-1}$`, String.raw`$\propto K$`, String.raw`$\propto n!$`], answer: 1, explain: String.raw`One survivor per state; there are $2^{K-1}$ states.` },
      { q: String.raw`The BCJR algorithm is preferred over Viterbi when you need:`, options: [String.raw`lowest complexity`, String.raw`per-bit soft (APP) outputs for iterative decoding`, String.raw`hard decisions only`, String.raw`no traceback`], answer: 1, explain: String.raw`BCJR gives bit-wise a-posteriori probabilities used inside Turbo decoders.` },
      { q: String.raw`A recommended Viterbi traceback depth for a $K=7$ code is roughly:`, options: [String.raw`7 branches`, String.raw`14 branches`, String.raw`35–42 branches`, String.raw`256 branches`], answer: 2, explain: String.raw`About $5K$–$6K = 35$–$42$ branches ensures survivor merging.` },
      { q: String.raw`In the classic deep-space concatenated scheme, the outer code was:`, options: [String.raw`another convolutional code`, String.raw`a Reed–Solomon block code`, String.raw`an LDPC code`, String.raw`a repetition code`], answer: 1, explain: String.raw`RS(255,223) outer + convolutional inner, with an interleaver between.` },
      { q: String.raw`Asymptotic soft-decision coding gain is approximately:`, options: [String.raw`$10\log_{10}(d_{free}/R_c)$`, String.raw`$10\log_{10}(R_c\,d_{free})$`, String.raw`$10\log_{10}(2^{K-1})$`, String.raw`$10\log_{10} n$`], answer: 1, explain: String.raw`Gain $\approx 10\log_{10}(R_c d_{free})$; for the $K=7$ rate-1/2 code, ~7 dB.` },
      { q: String.raw`A catastrophic convolutional encoder is one where:`, options: [String.raw`the rate exceeds 1`, String.raw`finite input errors can cause infinite output errors`, String.raw`$d_{free}=0$ always`, String.raw`the trellis has one state`], answer: 1, explain: String.raw`It arises when the generator polynomials share a common factor and must be avoided.` }
    ],
    numericals: [
      { q: String.raw`A rate-1/2 convolutional encoder has generators $g_1=(1+D+D^2)$ and $g_2=(1+D^2)$. Encode the input $u=1\,0\,1\,1$ (assume the register starts at 0 and flush with two zeros).`, solution: String.raw`Process bit by bit with state $(s_1 s_2)$ initially $00$. Outputs $v_1=u\oplus s_1\oplus s_2$, $v_2=u\oplus s_2$.\n\n1) $u=1$, state $00$: $v_1=1\oplus0\oplus0=1$, $v_2=1\oplus0=1$ → $11$; new state $10$.\n2) $u=0$, state $10$: $v_1=0\oplus1\oplus0=1$, $v_2=0\oplus0=0$ → $10$; new state $01$.\n3) $u=1$, state $01$: $v_1=1\oplus0\oplus1=0$, $v_2=1\oplus1=0$ → $00$; new state $10$.\n4) $u=1$, state $10$: $v_1=1\oplus1\oplus0=0$, $v_2=1\oplus0=1$ → $01$; new state $11$.\nFlush $u=0$, state $11$: $v_1=0\oplus1\oplus1=0$, $v_2=0\oplus1=1$ → $01$; state $01$.\nFlush $u=0$, state $01$: $v_1=0\oplus0\oplus1=1$, $v_2=0\oplus1=1$ → $11$; state $00$.\n\nCodeword: $11\ 10\ 00\ 01\ 01\ 11$.` },
      { q: String.raw`A code has $d_{free}=10$. Find the number of correctable random errors $t$.`, solution: String.raw`$t=\lfloor(d_{free}-1)/2\rfloor=\lfloor 9/2\rfloor = 4$ errors.` },
      { q: String.raw`Estimate the asymptotic soft-decision coding gain of a rate-1/2 code with $d_{free}=10$.`, solution: String.raw`$G\approx 10\log_{10}(R_c\,d_{free}) = 10\log_{10}(0.5\times 10)=10\log_{10}5 \approx 6.99\approx 7$ dB.` },
      { q: String.raw`A rate-1/3 encoder with constraint length $K=9$ is Viterbi-decoded. How many states, and roughly what traceback depth?`, solution: String.raw`States $=2^{K-1}=2^8=256$. Traceback depth $\approx 5K$ to $6K = 45$ to $54$ branches.` },
      { q: String.raw`A rate-1/2 mother code is punctured to rate 3/4. Out of every 6 coded bits, how many are transmitted?`, solution: String.raw`Rate $3/4$ means 3 information bits produce 4 transmitted bits. The mother code produces $3\times 2 = 6$ coded bits; $6-4=2$ are punctured (deleted). So 4 of every 6 coded bits are sent.` },
      { q: String.raw`For a $(3,1,2)$ code (rate 1/3, $m=2$) each input bit produces how many coded bits, and what is the overhead ratio?`, solution: String.raw`Each input bit yields $n=3$ coded bits. Overhead $=(n-k)/k=(3-1)/1=2$, i.e. 200% redundancy; useful throughput is $R_c=1/3$ of the channel bit rate.` },
      { q: String.raw`Compute the free distance of the $(7,5)_8$, $K=3$ code by finding the lowest-weight path that leaves and re-merges with state $00$.`, solution: String.raw`Input $1$ then $0,0$ traces states $00\to10\to01\to00$ emitting $11,10,11$ = weight $2+1+2=5$. No lower-weight nonzero path re-merges sooner, so $d_{free}=5$ (correcting $t=\lfloor4/2\rfloor=2$ errors).` }
    ],
    realWorld: String.raw`<p>Convolutional codes with Viterbi decoding were the workhorse of practical FEC for half a century. NASA's Voyager, Galileo, and Cassini deep-space links used the $(171,133)_8$, $K=7$ code (often concatenated with an outer Reed–Solomon block code and interleaving); GSM, IS-95 CDMA, DVB-S, and 802.11a/g/n all specify punctured convolutional codes for rate adaptation. Soft-decision Viterbi in silicon (add–compare–select units running at hundreds of Mb/s) made ~5 dB of coding gain nearly free. In modern systems the family persists as tail-biting convolutional codes for short 5G/LTE control channels (where Turbo/LDPC block sizes are too large) and, crucially, as the constituent BCJR-decoded encoders inside Turbo codes — the bridge from classical to capacity-approaching coding.</p>`,
    related: ['channel-coding', 'fec', 'viterbi', 'ber', 'eb-no']
  },
  {
    id: 'channel-coding',
    title: 'Channel Coding',
    category: 'Spread Spectrum & Coding',
    tags: ['channel coding', 'FEC', 'ARQ', 'Hamming distance', 'coding gain', 'Shannon', 'interleaving', 'code rate'],
    summary: String.raw`Channel coding adds structured, deliberate redundancy to a bit stream so that the receiver can detect and correct errors introduced by a noisy channel, trading bandwidth or rate for reliability up to the Shannon limit.`,
    prerequisites: ['comm-basics', 'shannon', 'ber', 'noise'],
    intro: String.raw`<p><strong>Channel coding</strong> is the deliberate addition of <em>structured redundancy</em> to transmitted data so that a receiver can detect and correct the errors a noisy channel inevitably causes. It is the mirror image of <a href="#source-coding">source coding</a>: source coding <em>removes</em> redundancy to compress data toward its entropy, while channel coding <em>adds back</em> carefully engineered redundancy to protect data on the way to the receiver. Both are justified — and separated — by Shannon's theorems: source coding down to the entropy $H$, channel coding up to the capacity $C$.</p>
    <p>The promise is profound. Shannon's 1948 noisy-channel coding theorem proved that as long as the information rate $R < C$, codes exist that drive the error probability arbitrarily close to zero — reliability without shouting louder, purely by clever structure. Channel coding is why a mobile phone works at the cell edge, why a scratched Blu-ray still plays, why a spacecraft billions of kilometres away sends back crisp images, and why QR codes survive coffee stains. This umbrella topic frames the whole field: the redundancy idea, Hamming distance and minimum distance, detection versus correction, code rate and overhead, the block/convolutional/Turbo/LDPC families, coding gain, the Shannon limit, FEC versus ARQ, and interleaving against bursts. It cross-links the deeper dives — <a href="#fec">FEC</a>, <a href="#convolutional-codes">convolutional codes</a>, <a href="#viterbi">Viterbi decoding</a>, and <a href="#gold-code">Gold codes</a>.</p>`,
    sections: [
      {
        h: 'The core idea: structured redundancy vs source coding',
        html: String.raw`<p>A channel corrupts bits: noise, fading, and interference flip 0s to 1s and vice versa. Naively, you could just send every bit three times (a repetition code) and vote — but that is enormously wasteful. Channel coding instead adds redundancy with <em>algebraic structure</em>, so that valid transmitted sequences (codewords) are spread far apart in the space of all bit patterns. Errors that nudge a received word are then likely to leave it closer to the original codeword than to any other, and can be corrected.</p>
        <table class="data">
          <tr><th></th><th>Source coding</th><th>Channel coding</th></tr>
          <tr><td>Goal</td><td>compress</td><td>protect</td></tr>
          <tr><td>Redundancy</td><td>removed</td><td>added (structured)</td></tr>
          <tr><td>Bounded by</td><td>entropy $H$</td><td>capacity $C$</td></tr>
          <tr><td>Example</td><td>Huffman, LZ, JPEG</td><td>Hamming, RS, LDPC, Turbo</td></tr>
        </table>
        <div class="callout">Shannon's <strong>separation theorem</strong> says (for a point-to-point memoryless channel) you lose nothing by optimizing source coding and channel coding independently — compress to $H$, then protect up to $C$.</div>`
      },
      {
        h: 'Hamming distance and minimum distance',
        html: String.raw`<p>The <strong>Hamming distance</strong> $d_H(\mathbf{x},\mathbf{y})$ between two equal-length binary words is the number of positions in which they differ (equivalently the weight of their XOR). The single most important property of a code is its <strong>minimum distance</strong>:</p>
        <p>$$ d_{min} = \min_{\mathbf{c}_i \ne \mathbf{c}_j} d_H(\mathbf{c}_i, \mathbf{c}_j). $$</p>
        <p>For a <em>linear</em> code, the difference of two codewords is itself a codeword, so $d_{min}$ equals the minimum <em>weight</em> (number of 1s) of any nonzero codeword — a huge computational simplification. Geometrically, codewords are points in an $n$-dimensional cube; $d_{min}$ is the closest spacing between any two. The larger $d_{min}$, the more errors can occur before a received word is closer to the wrong codeword.</p>
        <div class="callout">Everything about a code's error power flows from $d_{min}$: detection reaches $d_{min}-1$ errors, correction reaches $\lfloor(d_{min}-1)/2\rfloor$. Convolutional codes use the analogous free distance $d_{free}$.</div>`
      },
      {
        h: 'Error detection versus correction',
        html: String.raw`<p>A code can be used in two modes, and the same $d_{min}$ buys different amounts of each:</p>
        <ul>
          <li><strong>Detection.</strong> If up to $d_{min}-1$ errors occur, the received word cannot land exactly on another valid codeword, so the error is <em>detected</em> (though not located). A code can detect $d_{min}-1$ errors.</li>
          <li><strong>Correction.</strong> To correct, the received word must stay strictly inside the decoding sphere of the true codeword. With spheres of radius $t$, non-overlap requires $2t < d_{min}$, giving $t = \lfloor (d_{min}-1)/2 \rfloor$.</li>
          <li><strong>Combined.</strong> A code can simultaneously correct $t$ and detect $e$ errors provided $t + e < d_{min}$ with $e \ge t$ — trading some correction for extra detection.</li>
        </ul>
        <p>Simple detection-only schemes include the <strong>parity bit</strong> ($d_{min}=2$, detects any single error) and the <strong>CRC</strong> (cyclic redundancy check — a powerful, cheap burst-error detector used with ARQ). Correction requires richer structure: Hamming codes ($d_{min}=3$, correct 1), BCH/Reed–Solomon (configurable $t$), and the modern capacity-approaching codes.</p>`
      },
      {
        h: 'Code rate, overhead, and the bandwidth cost',
        html: String.raw`<p>A code that maps $k$ information bits to $n$ transmitted bits has <strong>code rate</strong></p>
        <p>$$ R_c = \frac{k}{n}, \qquad 0 < R_c \le 1. $$</p>
        <p>The added <strong>redundancy/overhead</strong> is $(n-k)$ parity bits, a fractional overhead of $(n-k)/k = (1-R_c)/R_c$. A rate-1/2 code doubles the transmitted bit count (100% overhead); a rate-7/8 code adds only ~14%. Lower rate = more protection but either more bandwidth (if symbol rate rises) or lower throughput (if bandwidth is fixed).</p>
        <p>Crucially, adding a code with rate $R_c$ multiplies the <em>coded</em> symbol energy relationship: for fixed information energy $E_b$, each coded bit carries $E_c = R_c E_b$. The code must return more than it costs — the net benefit is the <strong>coding gain</strong> (next section). There is no free lunch: you spend rate/bandwidth to buy reliability, and a well-designed code makes that trade hugely favourable near the Shannon limit.</p>
        <table class="data">
          <tr><th>Code rate $R_c$</th><th>Overhead</th><th>Use case</th></tr>
          <tr><td>1/3</td><td>200%</td><td>deep space, very low SNR</td></tr>
          <tr><td>1/2</td><td>100%</td><td>general robust links (Wi-Fi, DVB)</td></tr>
          <tr><td>3/4</td><td>33%</td><td>good-SNR high-throughput modes</td></tr>
          <tr><td>7/8</td><td>~14%</td><td>near-clean channels, efficiency-critical</td></tr>
        </table>`
      },
      {
        h: 'The families: block, convolutional, Turbo, LDPC',
        html: String.raw`<p>Channel codes divide into two structural families and two modern capacity-approaching classes:</p>
        <ul>
          <li><strong>Block codes.</strong> Encode independent $k$-bit blocks into $n$-bit codewords with algebraic (syndrome) decoding. Examples: Hamming, BCH, and <strong>Reed–Solomon</strong> (symbol-level, superb against <em>bursts</em>, used in CDs, DVDs, QR codes, DVB). Memoryless between blocks; strong at high rates and burst errors.</li>
          <li><strong>Convolutional codes.</strong> Encode a continuous stream through a shift register with memory; decoded on a trellis by <a href="#viterbi">Viterbi</a> or BCJR. Excellent for random errors and streaming with low latency and natural soft-decision decoding. See <a href="#convolutional-codes">convolutional codes</a>.</li>
          <li><strong>Turbo codes (1993).</strong> Two convolutional encoders separated by an interleaver, decoded iteratively by exchanging soft (BCJR) information. First practical codes within ~1 dB of the Shannon limit; used in 3G/4G data channels.</li>
          <li><strong>LDPC codes.</strong> Sparse parity-check matrices decoded by iterative belief propagation on a Tanner graph. Also within a fraction of a dB of capacity; used in Wi-Fi (802.11n/ac/ax), DVB-S2, 10GBASE-T, and 5G data channels.</li>
        </ul>
        <div class="callout">Classical practice <strong>concatenated</strong> an inner convolutional code (fights random errors) with an outer Reed–Solomon block code (fights the residual bursts), joined by an interleaver — the deep-space standard before Turbo/LDPC.</div>`
      },
      {
        h: 'Coding gain: quantifying the benefit',
        html: String.raw`<p><strong>Coding gain</strong> is the reduction in required $E_b/N_0$ to reach a target BER when a code is added, versus the uncoded system — read horizontally between the two BER curves at, say, $10^{-5}$.</p>
        <p>$$ G_{coding}\,[\text{dB}] = \left(\frac{E_b}{N_0}\right)_{uncoded}[\text{dB}] - \left(\frac{E_b}{N_0}\right)_{coded}[\text{dB}]\bigg|_{\text{same BER}}. $$</p>
        <p>A good rate-1/2 convolutional code buys ~5–6 dB at BER $10^{-5}$; concatenated and Turbo/LDPC systems buy 7–10 dB or more. That gain translates directly into <strong>link budget</strong>: it can be spent on longer range (more path loss), a smaller antenna, lower transmit power, or higher data rate. The <em>asymptotic</em> coding gain relates to distance and rate as $\approx 10\log_{10}(R_c\, d)$ (with $d=d_{min}$ or $d_{free}$), but real gains at finite BER fall short of the asymptote and are limited by the code's error floor.</p>
        <div class="callout">Watch the <strong>crossover</strong>: at very low SNR a weak code can perform <em>worse</em> than uncoded because the rate loss ($E_c=R_cE_b$) outweighs the correction benefit before the code "kicks in."</div>`
      },
      {
        h: "Shannon's noisy-channel coding theorem and the limit",
        html: String.raw`<p>Shannon's 1948 theorem is the North Star of channel coding. It states that every channel has a <strong>capacity</strong> $C$ (bits per channel use, or bits/s), and:</p>
        <ul>
          <li>If the transmission rate $R < C$, there exist codes making the error probability arbitrarily small (as block length $\to\infty$).</li>
          <li>If $R > C$, no code can achieve reliable communication — error probability is bounded away from zero.</li>
        </ul>
        <p>For the band-limited AWGN channel, capacity is the Shannon–Hartley formula $C = B\log_2(1+\mathrm{SNR})$. A key corollary is the absolute <strong>Shannon limit</strong> on $E_b/N_0$: as spectral efficiency $\to 0$, reliable communication is impossible below</p>
        <p>$$ \frac{E_b}{N_0} \ge \ln 2 \approx -1.59\ \text{dB}. $$</p>
        <p>No code, however clever, can operate reliably below $-1.59$ dB. Modern Turbo and LDPC codes come within a fraction of a dB of this floor at low rates — an achievement that took 45 years after Shannon proved such codes must exist. The theorem is famously <em>non-constructive</em>: it guarantees good codes exist but does not build them; the entire history of coding theory is the search for practical codes that approach $C$.</p>`
      },
      {
        h: 'FEC vs ARQ, hybrid ARQ, and interleaving',
        html: String.raw`<p>There are two strategies for using coding, plus a tool for burst channels:</p>
        <ul>
          <li><strong>FEC (Forward Error Correction).</strong> Send enough redundancy to <em>correct</em> errors at the receiver with no feedback — essential for one-way links (broadcast, deep space) and low-latency/real-time traffic. Costs fixed overhead whether or not errors occur.</li>
          <li><strong>ARQ (Automatic Repeat reQuest).</strong> Use a strong error-<em>detecting</em> code (CRC); if an error is detected, the receiver requests retransmission. Variants: stop-and-wait, go-back-N, selective-repeat. Efficient on good channels, but needs a feedback path and adds latency; throughput collapses on bad channels.</li>
          <li><strong>Hybrid ARQ (HARQ).</strong> Combine FEC + ARQ: try to correct with FEC first, request a retransmission (often incremental redundancy) only if that fails. The backbone of LTE/5G data reliability.</li>
        </ul>
        <p><strong>Interleaving.</strong> Most codes assume errors are <em>random</em> (independent), but real channels produce <em>bursts</em> (deep fades, scratches). An interleaver permutes the coded bits before transmission and de-interleaves at the receiver, so a burst on the channel is scattered into isolated errors across many codewords — exactly what the code is designed to handle. Depth must exceed the expected burst length; the cost is latency (a full interleaver block must buffer).</p>
        <div class="callout">FEC + interleaving turns a bursty channel into an effectively random one; RS codes (which handle bursts natively at the symbol level) plus interleaving is why CDs survive scratches.</div>`
      }
    ],
    keyPoints: [
      String.raw`Channel coding adds structured redundancy to correct/detect channel errors; source coding removes redundancy to compress — mirror images, separated by Shannon's theorems.`,
      String.raw`Minimum distance $d_{min}$ is the smallest Hamming distance between codewords (= min nonzero weight for linear codes) and governs all error power.`,
      String.raw`Detection reaches $d_{min}-1$ errors; correction reaches $t=\lfloor(d_{min}-1)/2\rfloor$; combined needs $t+e<d_{min}$.`,
      String.raw`Code rate $R_c=k/n$; overhead $(1-R_c)/R_c$; each coded bit carries $E_c=R_c E_b$.`,
      String.raw`Families: block (Hamming/BCH/Reed–Solomon), convolutional (trellis/Viterbi), Turbo and LDPC (iterative, near-capacity).`,
      String.raw`Coding gain is the $E_b/N_0$ saved at a target BER; ~5–6 dB for good convolutional codes, up to ~10 dB for Turbo/LDPC.`,
      String.raw`Shannon's noisy-channel theorem: reliable communication is possible iff rate $R<C$; capacity $C=B\log_2(1+\mathrm{SNR})$.`,
      String.raw`Absolute Shannon limit on energy per bit: $E_b/N_0 \ge \ln 2 \approx -1.59$ dB; Turbo/LDPC approach it within a fraction of a dB.`,
      String.raw`FEC corrects with no feedback (broadcast, deep space); ARQ detects (CRC) and retransmits; HARQ combines both.`,
      String.raw`Interleaving scatters channel bursts into isolated random errors so a random-error code can handle them; costs latency.`,
      String.raw`Reed–Solomon operates on symbols and is natively burst-resistant (CDs, QR codes, DVB); concatenation pairs an inner convolutional code with an outer RS code.`,
      String.raw`Shannon's theorem is non-constructive — it proves good codes exist; approaching $C$ took 45 years of coding-theory effort.`
    ],
    equations: [
      {
        title: 'Minimum distance of a linear code',
        tex: String.raw`$$ d_{min} = \min_{\mathbf{c} \ne \mathbf{0}} w_H(\mathbf{c}) = \min_{\mathbf{c}_i \ne \mathbf{c}_j} d_H(\mathbf{c}_i,\mathbf{c}_j) $$`,
        derivation: String.raw`<p><b>Where we start.</b> A binary code is a set of codewords $\{\mathbf{c}\}$ of length $n$. The Hamming distance $d_H(\mathbf{x},\mathbf{y})$ counts differing positions, and the Hamming weight $w_H(\mathbf{c})$ counts the 1s in $\mathbf{c}$. Note $d_H(\mathbf{x},\mathbf{y}) = w_H(\mathbf{x}\oplus\mathbf{y})$.</p>
        <p><b>Step 1 — define minimum distance.</b> The code's minimum distance is the smallest distance between any two distinct codewords: $d_{min} = \min_{i\ne j} d_H(\mathbf{c}_i,\mathbf{c}_j)$.</p>
        <p><b>Step 2 — use linearity.</b> A linear code is closed under XOR: if $\mathbf{c}_i$ and $\mathbf{c}_j$ are codewords, so is $\mathbf{c}_k = \mathbf{c}_i \oplus \mathbf{c}_j$. Then</p>
        $$ d_H(\mathbf{c}_i,\mathbf{c}_j) = w_H(\mathbf{c}_i \oplus \mathbf{c}_j) = w_H(\mathbf{c}_k). $$
        <p>As $(i,j)$ range over all distinct pairs, $\mathbf{c}_k$ ranges over all nonzero codewords.</p>
        <p><b>Step 3 — reduce to weights.</b> Therefore minimizing pairwise distance is the same as minimizing the weight of nonzero codewords.</p>
        <p><b>Result.</b> $$ d_{min} = \min_{\mathbf{c}\ne\mathbf{0}} w_H(\mathbf{c}). $$ Instead of checking $\binom{2^k}{2}$ pairs we only inspect $2^k-1$ nonzero codewords — the practical reason linear codes are analyzable.</p>`
      },
      {
        title: 'Error detection and correction capability',
        tex: String.raw`$$ e_{det} = d_{min}-1, \qquad t_{corr} = \left\lfloor \frac{d_{min}-1}{2} \right\rfloor $$`,
        derivation: String.raw`<p><b>Where we start.</b> Codewords sit at mutual distance $\ge d_{min}$ in the Hamming cube. A channel error moves the received word away from the true codeword by the number of flipped bits.</p>
        <p><b>Step 1 — detection.</b> If fewer than $d_{min}$ bits flip, the received word cannot coincide with another codeword (they are all $\ge d_{min}$ away). So any error of weight $1$ to $d_{min}-1$ is guaranteed detectable: $e_{det}=d_{min}-1$.</p>
        <p><b>Step 2 — correction geometry.</b> To <em>correct</em>, decode to the nearest codeword. Draw a sphere of radius $t$ around each codeword. Correct decoding is guaranteed while the received word stays inside the true sphere and outside all others — which requires the spheres to be disjoint.</p>
        <p><b>Step 3 — non-overlap condition.</b> Two codewords are $\ge d_{min}$ apart; their radius-$t$ spheres are disjoint iff $2t < d_{min}$, i.e. $2t \le d_{min}-1$.</p>
        $$ 2t \le d_{min}-1 \;\Rightarrow\; t \le \frac{d_{min}-1}{2}. $$
        <p><b>Result.</b> $$ t_{corr} = \left\lfloor \frac{d_{min}-1}{2}\right\rfloor. $$ Example: a Hamming code with $d_{min}=3$ detects 2 and corrects 1; Reed–Solomon RS(255,223) has $d_{min}=33$, correcting 16 symbol errors.</p>`
      },
      {
        title: 'Code rate, overhead, and coded bit energy',
        tex: String.raw`$$ R_c = \frac{k}{n}, \quad \text{overhead}=\frac{1-R_c}{R_c}, \quad E_c = R_c\,E_b $$`,
        derivation: String.raw`<p><b>Where we start.</b> The encoder maps $k$ information bits to $n$ channel bits ($n>k$).</p>
        <p><b>Step 1 — rate.</b> The fraction of transmitted bits that carry information is $R_c=k/n$.</p>
        <p><b>Step 2 — overhead.</b> The added bits number $n-k$. Expressed relative to the information they protect, the fractional overhead is $(n-k)/k$. Dividing numerator and denominator by $n$: $(1-k/n)/(k/n)=(1-R_c)/R_c$.</p>
        <p><b>Step 3 — energy per coded bit.</b> Suppose the information rate and hence the energy per information bit $E_b$ is fixed. Encoding stretches the stream by $1/R_c$, so the same energy is spread over more channel bits. If total power is fixed, each coded bit gets</p>
        $$ E_c = R_c\,E_b. $$
        <p><b>Result.</b> $$ R_c=\tfrac{k}{n},\ \ \text{overhead}=\tfrac{1-R_c}{R_c},\ \ E_c=R_c E_b. $$ The $E_c=R_cE_b$ relation is why a code must give back more than the $10\log_{10}(1/R_c)$ dB energy penalty it imposes per channel bit — the balance is the net coding gain.</p>`
      },
      {
        title: 'Shannon–Hartley capacity',
        tex: String.raw`$$ C = B\,\log_2\!\left(1 + \frac{S}{N}\right)\ \text{bits/s} $$`,
        derivation: String.raw`<p><b>Where we start.</b> Consider a band-limited channel of bandwidth $B$ with additive white Gaussian noise, average signal power $S$ and noise power $N=N_0 B$. We want the maximum reliable information rate.</p>
        <p><b>Step 1 — degrees of freedom.</b> By the sampling theorem a signal of bandwidth $B$ has $2B$ independent real samples per second — the channel's "dimensions" per second.</p>
        <p><b>Step 2 — information per sample.</b> For a Gaussian channel the capacity per sample (maximized by a Gaussian input) is $\tfrac12\log_2(1+S/N)$ bits. This comes from the mutual information of a Gaussian input with Gaussian noise; the "$1+$" is the signal-plus-noise to noise power ratio that sets how many distinguishable levels fit.</p>
        <p><b>Step 3 — combine.</b> Multiply information per sample by samples per second:</p>
        $$ C = 2B \cdot \tfrac12\log_2\!\left(1+\tfrac{S}{N}\right) = B\log_2\!\left(1+\tfrac{S}{N}\right). $$
        <p><b>Result.</b> $$ C = B\log_2(1+S/N). $$ Reliable communication is possible for any rate below $C$ and impossible above it — the ceiling channel coding forever chases.</p>`
      },
      {
        title: 'Absolute Shannon limit on Eb/N0',
        tex: String.raw`$$ \frac{E_b}{N_0}\Big|_{min} = \frac{2^{\eta}-1}{\eta}\ \xrightarrow{\eta\to 0}\ \ln 2 \approx -1.59\ \text{dB} $$`,
        derivation: String.raw`<p><b>Where we start.</b> Take Shannon–Hartley and push to the reliability boundary $R=C$. Let the spectral efficiency be $\eta = C/B$ (bits/s per Hz).</p>
        <p><b>Step 1 — express SNR via $E_b/N_0$.</b> Signal power $S = E_b\,C$ (energy per bit times bit rate), and noise power $N = N_0 B$. So $S/N = (E_b C)/(N_0 B) = (E_b/N_0)\,\eta$.</p>
        <p><b>Step 2 — substitute into capacity.</b> At $R=C$, $\eta = \log_2(1 + (E_b/N_0)\eta)$. Invert: $2^{\eta} = 1 + (E_b/N_0)\eta$, hence</p>
        $$ \frac{E_b}{N_0} = \frac{2^{\eta}-1}{\eta}. $$
        <p><b>Step 3 — take the low-efficiency limit.</b> Let $\eta\to 0$ (spend unlimited bandwidth per bit). Using $2^\eta = e^{\eta\ln 2} \approx 1 + \eta\ln 2$ for small $\eta$:</p>
        $$ \frac{E_b}{N_0} \to \frac{(1+\eta\ln2)-1}{\eta} = \ln 2. $$
        <p><b>Result.</b> $$ \frac{E_b}{N_0}\Big|_{min} = \ln 2 \approx 0.693 \equiv -1.59\ \text{dB}. $$ No system can communicate reliably below $-1.59$ dB of $E_b/N_0$; capacity-approaching codes at low rate operate a fraction of a dB above it.</p>`
      },
      {
        title: 'Asymptotic coding gain',
        tex: String.raw`$$ G_{coding}\approx 10\log_{10}\!\left(R_c\, d\right)\ \text{dB}, \quad d=d_{min}\ \text{or}\ d_{free} $$`,
        derivation: String.raw`<p><b>Where we start.</b> Uncoded coherent BPSK gives $P_b=Q(\sqrt{2E_b/N_0})$. With soft-decision decoding, a good code's dominant error term behaves like $Q(\sqrt{2 d R_c\, E_b/N_0})$, where $d$ is the minimum (free) distance — a weight-$d$ competitor differs in $d$ coded bits each carrying $E_c=R_cE_b$.</p>
        <p><b>Step 1 — match the $Q$-function arguments.</b> Two systems reach the same BER when their $Q$ arguments are equal. The coded system therefore mimics an uncoded one with an effective $E_b/N_0$ larger by the factor $R_c d$:</p>
        $$ \frac{(E_b/N_0)_{eff}}{(E_b/N_0)_{actual}} = R_c\, d. $$
        <p><b>Step 2 — convert to dB.</b> Coding gain is this power ratio in decibels.</p>
        <p><b>Result.</b> $$ G_{coding}\approx 10\log_{10}(R_c\,d). $$ For a rate-1/2 code with $d=10$: $10\log_{10}5\approx 7$ dB (soft). Hard-decision loses ~2 dB; real gains at BER $10^{-5}$ are somewhat below the asymptote and bounded by the error floor.</p>`
      },
      {
        title: 'ARQ throughput efficiency (stop-and-wait)',
        tex: String.raw`$$ \eta_{ARQ} = \frac{(1-P_b)^{L}}{1 + \dfrac{t_{rt}}{t_{frame}}} $$`,
        derivation: String.raw`<p><b>Where we start.</b> In stop-and-wait ARQ the transmitter sends one frame of $L$ bits, then waits for an acknowledgement before sending the next. Let the round-trip idle time be $t_{rt}$ and the frame transmission time be $t_{frame}$.</p>
        <p><b>Step 1 — success probability.</b> A frame is accepted only if all $L$ bits are correct (detection is assumed perfect). For independent bit errors of probability $P_b$, the frame success probability is $(1-P_b)^{L}$.</p>
        <p><b>Step 2 — protocol (idle) overhead.</b> Even with no errors, the link is busy for $t_{frame}$ but idle for $t_{rt}$ each cycle, so only a fraction $t_{frame}/(t_{frame}+t_{rt}) = 1/(1+t_{rt}/t_{frame})$ of time carries data.</p>
        <p><b>Step 3 — combine.</b> Multiply the error-free acceptance rate by the protocol efficiency:</p>
        $$ \eta_{ARQ} = \frac{(1-P_b)^{L}}{1+ t_{rt}/t_{frame}}. $$
        <p><b>Result.</b> Throughput collapses when either $P_b L$ is large (frequent retransmissions) or $t_{rt}\gg t_{frame}$ (long links) — the reasons FEC or windowed ARQ (go-back-N, selective-repeat) is preferred on noisy or high-latency channels.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`How does channel coding differ from source coding?`, back: String.raw`Source coding removes redundancy to compress toward entropy $H$; channel coding adds structured redundancy to correct errors up to capacity $C$. Shannon's separation theorem says they can be optimized independently.` },
      { front: String.raw`Define Hamming distance and minimum distance.`, back: String.raw`Hamming distance = number of differing bit positions between two words. Minimum distance $d_{min}$ = smallest Hamming distance between any two codewords (= minimum nonzero weight for a linear code).` },
      { front: String.raw`Give the detection and correction capabilities in terms of $d_{min}$.`, back: String.raw`Detect up to $d_{min}-1$ errors; correct up to $t=\lfloor(d_{min}-1)/2\rfloor$. Combined: $t+e<d_{min}$.` },
      { front: String.raw`Define code rate and overhead.`, back: String.raw`$R_c=k/n$ (information fraction). Overhead $=(n-k)/k=(1-R_c)/R_c$. Each coded bit carries $E_c=R_c E_b$.` },
      { front: String.raw`Name the four main code families and one example each.`, back: String.raw`Block (Reed–Solomon), convolutional (Viterbi-decoded), Turbo (iterative BCJR), LDPC (belief propagation on a Tanner graph).` },
      { front: String.raw`What is coding gain?`, back: String.raw`The $E_b/N_0$ saved to reach a target BER versus uncoded; ~5–6 dB for good convolutional codes, up to ~10 dB for Turbo/LDPC. It is spendable in the link budget.` },
      { front: String.raw`State Shannon's noisy-channel coding theorem.`, back: String.raw`If rate $R<C$, codes exist making error probability arbitrarily small; if $R>C$, reliable communication is impossible. It is non-constructive.` },
      { front: String.raw`What is the absolute Shannon limit on $E_b/N_0$?`, back: String.raw`$E_b/N_0 \ge \ln 2 \approx -1.59$ dB (as spectral efficiency $\to 0$). Turbo/LDPC operate within a fraction of a dB of it.` },
      { front: String.raw`FEC vs ARQ?`, back: String.raw`FEC corrects errors with no feedback (broadcast, real-time, deep space); ARQ detects with a CRC and requests retransmission (needs feedback, adds latency). HARQ combines both.` },
      { front: String.raw`Why interleave?`, back: String.raw`To scatter channel error bursts into isolated random errors across many codewords, so a random-error code can correct them. Depth must exceed burst length; cost is latency.` },
      { front: String.raw`Why is Reed–Solomon good against bursts?`, back: String.raw`It operates on multi-bit symbols, so a burst that corrupts several adjacent bits counts as only one (or few) symbol errors — used in CDs, DVDs, QR codes, DVB.` },
      { front: String.raw`What is concatenated coding?`, back: String.raw`An inner code (e.g. convolutional, good vs random errors) plus an outer code (e.g. Reed–Solomon, good vs residual bursts) with an interleaver between — the classic deep-space scheme.` },
      { front: String.raw`Why can a code perform worse than uncoded at very low SNR?`, back: String.raw`Because $E_c=R_cE_b$ imposes an energy penalty per channel bit; below the code's crossover SNR this loss outweighs the correction benefit.` },
      { front: String.raw`What quantity replaces $d_{min}$ for convolutional codes?`, back: String.raw`The free distance $d_{free}$ — the minimum weight of any nonzero code path. Same correction rule $t=\lfloor(d_{free}-1)/2\rfloor$.` }
    ],
    mcqs: [
      { q: String.raw`Channel coding, relative to source coding, generally:`, options: [String.raw`removes redundancy`, String.raw`adds structured redundancy`, String.raw`leaves the bit count unchanged`, String.raw`always increases entropy`], answer: 1, explain: String.raw`It adds engineered redundancy for protection; source coding removes it for compression.` },
      { q: String.raw`For a linear code, $d_{min}$ equals:`, options: [String.raw`the code length $n$`, String.raw`the minimum nonzero codeword weight`, String.raw`the number of parity bits`, String.raw`$k/n$`], answer: 1, explain: String.raw`Because differences of codewords are codewords, min distance = min nonzero weight.` },
      { q: String.raw`A code with $d_{min}=5$ can correct up to:`, options: [String.raw`1 error`, String.raw`2 errors`, String.raw`4 errors`, String.raw`5 errors`], answer: 1, explain: String.raw`$t=\lfloor(5-1)/2\rfloor=2$.` },
      { q: String.raw`A code with $d_{min}=4$ used purely for detection can detect:`, options: [String.raw`1 error`, String.raw`2 errors`, String.raw`3 errors`, String.raw`4 errors`], answer: 2, explain: String.raw`Detection reaches $d_{min}-1=3$ errors.` },
      { q: String.raw`A rate-3/4 code has an overhead of:`, options: [String.raw`75%`, String.raw`33%`, String.raw`25%`, String.raw`133%`], answer: 1, explain: String.raw`$(1-R_c)/R_c=(1-0.75)/0.75=0.25/0.75\approx 33\%$.` },
      { q: String.raw`Which code family is decoded with the Viterbi algorithm?`, options: [String.raw`Reed–Solomon`, String.raw`convolutional`, String.raw`Hamming`, String.raw`LDPC`], answer: 1, explain: String.raw`Viterbi is the maximum-likelihood trellis decoder for convolutional codes.` },
      { q: String.raw`Reed–Solomon codes are especially strong against:`, options: [String.raw`random single-bit errors`, String.raw`burst errors`, String.raw`carrier phase noise`, String.raw`Doppler`], answer: 1, explain: String.raw`Symbol-level operation makes an adjacent-bit burst count as one symbol error.` },
      { q: String.raw`Shannon's theorem guarantees reliable communication provided:`, options: [String.raw`$R>C$`, String.raw`$R<C$`, String.raw`SNR $=0$`, String.raw`the code is nonlinear`], answer: 1, explain: String.raw`Reliable communication is possible iff the rate is below capacity.` },
      { q: String.raw`The absolute minimum $E_b/N_0$ for reliable communication is approximately:`, options: [String.raw`0 dB`, String.raw`$-1.59$ dB`, String.raw`$-3$ dB`, String.raw`$+3$ dB`], answer: 1, explain: String.raw`$\ln 2 \approx -1.59$ dB is the Shannon limit as spectral efficiency $\to 0$.` },
      { q: String.raw`ARQ requires, that FEC does not:`, options: [String.raw`a feedback/return channel`, String.raw`a longer codeword`, String.raw`soft decisions`, String.raw`an interleaver`], answer: 0, explain: String.raw`ARQ requests retransmissions, needing a feedback path; FEC is one-way.` },
      { q: String.raw`Interleaving is used to combat:`, options: [String.raw`thermal noise floor`, String.raw`burst errors`, String.raw`frequency offset`, String.raw`quantization`], answer: 1, explain: String.raw`It spreads a burst into isolated errors the code can correct.` },
      { q: String.raw`Turbo and LDPC codes are notable because they:`, options: [String.raw`need no decoding`, String.raw`approach the Shannon limit within a fraction of a dB`, String.raw`have $d_{min}=1$`, String.raw`work only for erasure channels`], answer: 1, explain: String.raw`Iterative (soft) decoding brings them within ~1 dB or less of capacity.` },
      { q: String.raw`Coding gain is best described as:`, options: [String.raw`the bandwidth expansion factor`, String.raw`the $E_b/N_0$ saved at a fixed BER versus uncoded`, String.raw`the number of parity bits`, String.raw`the interleaver depth`], answer: 1, explain: String.raw`Read horizontally between coded and uncoded BER curves at the target BER.` },
      { q: String.raw`Hybrid ARQ (HARQ):`, options: [String.raw`uses neither FEC nor detection`, String.raw`tries FEC first, then retransmits (often incremental redundancy) on failure`, String.raw`is only for broadcast`, String.raw`disables coding at high SNR`], answer: 1, explain: String.raw`HARQ combines FEC and ARQ, the basis of LTE/5G data reliability.` }
    ],
    numericals: [
      { q: String.raw`A block code has $d_{min}=7$. How many errors can it correct, and how many can it detect (in detection-only mode)?`, solution: String.raw`Correct: $t=\lfloor(7-1)/2\rfloor=3$. Detect: $d_{min}-1=6$ errors.` },
      { q: String.raw`A $(7,4)$ Hamming code: give its rate, overhead, and correction capability ($d_{min}=3$).`, solution: String.raw`Rate $R_c=4/7\approx 0.571$. Overhead $=(7-4)/4=0.75=75\%$. Correction $t=\lfloor(3-1)/2\rfloor=1$ error.` },
      { q: String.raw`Compute the Shannon capacity of a channel with $B=1$ MHz and SNR = 30 dB.`, solution: String.raw`SNR (linear) $=10^{30/10}=1000$. $C=10^6\log_2(1+1000)=10^6\log_2(1001)\approx 10^6\times 9.97 \approx 9.97$ Mbit/s.` },
      { q: String.raw`RS(255,223) over 8-bit symbols: how many symbol errors can it correct, and what is $d_{min}$?`, solution: String.raw`Parity symbols $=255-223=32$. RS corrects $t=(n-k)/2=16$ symbol errors, with $d_{min}=n-k+1=33$ (MDS code).` },
      { q: String.raw`Estimate the soft-decision asymptotic coding gain of a rate-1/2 code with $d_{free}=6$.`, solution: String.raw`$G\approx 10\log_{10}(R_c\,d_{free})=10\log_{10}(0.5\times 6)=10\log_{10}3\approx 4.77$ dB.` },
      { q: String.raw`A rate-1/2 code needs $E_b/N_0=5$ dB for BER $10^{-5}$; uncoded BPSK needs $9.6$ dB. Find the coding gain and how much extra path loss it allows.`, solution: String.raw`Coding gain $=9.6-5=4.6$ dB. Since link budget margin scales dB-for-dB, it permits 4.6 dB more path loss (e.g. longer range or a smaller antenna).` },
      { q: String.raw`Stop-and-wait ARQ: frame $L=1000$ bits, $P_b=10^{-4}$, and $t_{rt}=t_{frame}$. Estimate throughput efficiency.`, solution: String.raw`Frame success $=(1-10^{-4})^{1000}\approx e^{-0.1}\approx 0.905$. Protocol factor $=1/(1+1)=0.5$. $\eta\approx 0.905\times 0.5 \approx 0.45$ (45%).` }
    ],
    realWorld: String.raw`<p>Channel coding is everywhere in modern life. QR codes and DataMatrix use Reed–Solomon so they scan despite smudges and damage; CDs, DVDs, and Blu-ray layer RS with interleaving (CIRC) to survive scratches; hard drives and SSDs use LDPC/BCH to correct raw media errors. Wireless standards each pick a code to match their channel: GSM and early Wi-Fi used punctured convolutional codes; 3G/4G data used Turbo codes with HARQ; Wi-Fi 802.11n/ac/ax, DVB-S2, and 5G data channels use LDPC, while 5G control channels use polar and tail-biting convolutional codes. Deep-space missions historically concatenated convolutional + Reed–Solomon codes and now use Turbo/LDPC to squeeze every fraction of a dB toward the Shannon limit — the reason a probe running on a few watts, billions of kilometres away, can still return usable data.</p>`,
    related: ['fec', 'convolutional-codes', 'viterbi', 'shannon', 'source-coding']
  }
);
