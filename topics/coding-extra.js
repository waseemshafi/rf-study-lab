// Spread Spectrum & Coding — Turbo Codes and LDPC Codes (capacity-approaching FEC)
CONTENT.topics.push(
{
  id: 'turbo-codes',
  title: 'Turbo Codes',
  category: 'Spread Spectrum & Coding',
  tags: ['FEC', 'iterative decoding', 'RSC', 'interleaver', 'BCJR', 'MAP', 'LLR', 'near-Shannon'],
  summary: String.raw`Turbo codes are parallel-concatenated recursive systematic convolutional codes joined by an interleaver, decoded iteratively by two soft-in soft-out decoders that exchange extrinsic log-likelihood ratios to approach the Shannon limit within a fraction of a dB.`,
  prerequisites: ['convolutional-codes', 'viterbi', 'fec', 'shannon', 'eb-no'],
  intro: String.raw`<p>In 1993 Claude <b>Berrou</b>, Alain Glavieux and Punya Thitimajshima presented a code at the IEEE ICC that seemed too good to be true: at a rate of 1/2 it reached a bit error rate of $10^{-5}$ within about <b>0.5 dB</b> of the Shannon capacity limit — a gap that decades of coding research had failed to close. The claim was met with open skepticism until independent groups reproduced the curves. Turbo codes did not introduce a fundamentally new algebraic structure; their power comes from a <b>system-level</b> idea: combine two simple, individually mediocre convolutional codes through a large pseudo-random <b>interleaver</b>, then decode not once but <b>iteratively</b>, letting two decoders trade probabilistic "advice" back and forth until they converge on a consistent answer.</p>
<p>The name "turbo" is an analogy to the turbocharger in an engine: the <b>exhaust</b> (the output) of one decoder is fed back to <b>drive</b> the other, and vice versa. The information passed between them is carefully constructed to be <b>extrinsic</b> — new evidence that a decoder did <i>not</i> already have — so that the feedback loop adds genuine information rather than merely echoing beliefs. This iterative exchange of soft information, formalized as log-likelihood ratios, launched an entire discipline of "turbo-principle" receivers (turbo equalization, turbo multiuser detection) and made near-capacity operation practical for the first time. Turbo codes went on to power 3G (UMTS), 4G (LTE), deep-space links (CCSDS), and satellite return channels (DVB-RCS).</p>`,
  sections: [
    {
      h: 'The encoder: parallel concatenation of RSC codes',
      html: String.raw`<p>A turbo encoder places <b>two</b> constituent convolutional encoders <b>side by side</b> (in parallel), not in series. The information bit stream $u$ is fed:</p>
<ul>
<li>directly into the <b>first</b> constituent encoder, producing parity stream $p_1$;</li>
<li>and, after passing through an <b>interleaver</b> $\Pi$ (a fixed permutation), into the <b>second</b> constituent encoder, producing parity stream $p_2$.</li>
</ul>
<p>The transmitted codeword is the <b>systematic</b> bits $u$ together with the two parity streams: $(u, p_1, p_2)$. Because $u$ appears verbatim, the code is <b>systematic</b>; because the same information enters both encoders (once in natural order, once permuted), the two parity streams describe the <i>same</i> data from two decorrelated viewpoints.</p>
<div class="callout"><b>Why RSC and not ordinary convolutional?</b> The constituents are <b>Recursive Systematic Convolutional (RSC)</b> encoders: systematic (they output the input bit) and recursive (they contain a feedback loop, i.e. an IIR structure with denominator polynomial). Recursion is the secret ingredient. A feed-forward (non-recursive) encoder maps a weight-1 input to a low-weight, <i>finite</i>-length output; such a light input would produce light parity in both encoders and a dangerously low-weight codeword. A <b>recursive</b> encoder responds to a weight-1 input with an <i>infinite</i> (in practice, very long) parity sequence, so a single stray bit generates heavy parity. Only specially matched input patterns can terminate the recursion and yield low weight — and the interleaver is designed so that a pattern which is "bad" (low weight) for encoder 1 is scrambled into a "good" (high weight) pattern for encoder 2.</p></div>
<p>A typical constituent is the rate-1/2, memory-3 (8-state) RSC with generator $G(D) = \left[1, \tfrac{1+D+D^3}{1+D^2+D^3}\right]$, often written in octal as feedback 13, feedforward 15. LTE uses an 8-state RSC with polynomials $(13,15)_8$; the UMTS turbo code is the same family.</p>`
    },
    {
      h: 'The interleaver: the heart of the code',
      html: String.raw`<p>The interleaver $\Pi$ is a fixed, one-to-one permutation of the $N$ information-bit positions. It performs three jobs at once:</p>
<ul>
<li><b>Decorrelation.</b> A burst of channel errors that is contiguous in the first decoder's view is spread out in the second decoder's view, so the two decoders rarely fail on the same bits simultaneously — a prerequisite for the iterative exchange to converge.</li>
<li><b>Spectral thinning ("interleaver gain").</b> The probability that a low-weight input pattern remains low-weight <i>after</i> permutation shrinks as $N$ grows, pushing rare low-weight codewords further apart. This is why turbo performance improves with block length.</li>
<li><b>Breaking correlation in the extrinsic messages.</b> For the turbo principle to work, the information a decoder receives from its partner must look like <i>independent</i> new evidence; the permutation is what makes the two LLR streams approximately uncorrelated.</li>
</ul>
<p>Interleaver design is a genuine engineering art. A poorly chosen (e.g. purely rectangular block) interleaver can leave certain short, self-terminating input patterns low-weight in <b>both</b> orders, creating a handful of low free-distance codewords that dominate performance at high SNR — the dreaded <b>error floor</b>. Practical designs (S-random interleavers, LTE's Quadratic Permutation Polynomial (QPP) interleaver) deliberately guarantee a minimum spreading distance so that near neighbours in one domain are far apart in the other. The QPP interleaver, $\Pi(i) = (f_1 i + f_2 i^2) \bmod N$, is prized because it is <b>maximum-contention-free</b>, allowing parallel hardware decoders to access memory without collisions.</p>`
    },
    {
      h: 'Log-likelihood ratios and soft information',
      html: String.raw`<p>Turbo decoding is entirely a game of <b>soft</b> (probabilistic) values, not hard bits. The natural currency is the <b>log-likelihood ratio (LLR)</b> of a bit $u$:</p>
$$ L(u) = \ln \frac{P(u = +1)}{P(u = -1)} $$
<p>(using the antipodal convention $u \in \{+1,-1\}$). The <b>sign</b> of $L(u)$ is the hard decision; the <b>magnitude</b> $|L(u)|$ is the confidence. LLRs are wonderfully additive: independent pieces of evidence about the same bit combine by <b>summation</b> of their LLRs, which is exactly why they are the right coordinate system for message passing.</p>
<p>The decoder decomposes the total a-posteriori LLR of each bit into three additive parts:</p>
$$ \underbrace{L(u \mid \mathbf{y})}_{\text{a posteriori}} = \underbrace{L_c \, y_s}_{\text{channel (systematic)}} + \underbrace{L_a(u)}_{\text{a priori}} + \underbrace{L_e(u)}_{\text{extrinsic}} $$
<p>where $L_c y_s$ is the direct channel evidence on the systematic bit, $L_a$ is the a-priori LLR handed over from the <i>other</i> decoder, and $L_e$ — the <b>extrinsic</b> LLR — is the new information this decoder infers about $u$ purely from the <b>code constraints and the other bits/parity</b>, deliberately <b>excluding</b> the systematic channel value and the a-priori input. The extrinsic value is what gets passed on:</p>
<div class="callout"><b>Extrinsic = output − channel − a-priori.</b> $L_e(u) = L(u\mid\mathbf{y}) - L_c y_s - L_a(u)$. Subtracting off what the partner already knows prevents a decoder from feeding a belief back to whoever supplied it — that would be positive feedback and would cause premature, false convergence. Only the genuinely <i>new</i> component circulates.</p></div>`
    },
    {
      h: 'The BCJR / MAP algorithm inside each SISO decoder',
      html: String.raw`<p>Each constituent decoder is a <b>Soft-In Soft-Out (SISO)</b> block that computes, for every information bit, its a-posteriori LLR given the received sequence. The optimal engine is the <b>BCJR algorithm</b> (Bahl–Cocke–Jelinek–Raviv, 1974), also called the <b>MAP</b> (maximum a posteriori) algorithm. Unlike the Viterbi algorithm, which finds the single most likely <i>path</i> (sequence), BCJR marginalizes over all paths to find the most likely <i>bit</i> — exactly the per-bit soft output turbo decoding needs.</p>
<p>BCJR runs three passes over the trellis:</p>
<ul>
<li><b>Forward recursion</b> $\alpha_k(s)$: probability of arriving in state $s$ at time $k$ given the past — computed left to right.</li>
<li><b>Backward recursion</b> $\beta_k(s)$: probability of the future given state $s$ at time $k$ — computed right to left.</li>
<li><b>Branch metrics</b> $\gamma_k(s',s)$: the local likelihood of the transition $s'\to s$, combining the a-priori LLR and the channel samples.</li>
</ul>
<p>The bit LLR follows by summing $\alpha \cdot \gamma \cdot \beta$ over all trellis edges labelled $u=+1$ versus $u=-1$. BCJR is computationally heavy (multiplications, exponentials, forward and backward storage), so practical receivers use logarithmic variants:</p>
<table class="data">
<tr><th>Variant</th><th>Key operation</th><th>Complexity</th><th>Loss vs MAP</th></tr>
<tr><td><b>Log-MAP</b></td><td>max* (max plus a correction term)</td><td>High (needs lookup for correction)</td><td>None (exact)</td></tr>
<tr><td><b>Max-Log-MAP</b></td><td>plain max (drops correction)</td><td>Moderate</td><td>~0.3–0.5 dB</td></tr>
<tr><td><b>SOVA</b></td><td>Viterbi + reliability update</td><td>Lowest</td><td>~0.7 dB, and biased</td></tr>
</table>
<p>The $\max^*$ operator is $\max^*(a,b) = \max(a,b) + \ln(1+e^{-|a-b|})$; the correction term is at most $\ln 2 \approx 0.69$. <b>Max-Log-MAP</b> simply drops it, trading a few tenths of a dB for a big reduction in complexity and, conveniently, immunity to noise-variance mis-scaling.</p>`
    },
    {
      h: 'Iterative (turbo) decoding: the feedback loop',
      html: String.raw`<p>Now assemble the loop. One full <b>iteration</b> is:</p>
<ol>
<li><b>Decoder 1</b> (natural order) runs BCJR using the channel LLRs for $u$ and $p_1$ plus the a-priori LLRs $L_{a1}$ (initially zero). It outputs extrinsic LLRs $L_{e1}$.</li>
<li>$L_{e1}$ is <b>interleaved</b> ($\Pi$) and handed to Decoder 2 as its a-priori input $L_{a2}$.</li>
<li><b>Decoder 2</b> (interleaved order) runs BCJR using the channel LLRs for the permuted $u$ and $p_2$ plus $L_{a2}$. It outputs $L_{e2}$.</li>
<li>$L_{e2}$ is <b>de-interleaved</b> ($\Pi^{-1}$) and fed back to Decoder 1 as its new a-priori input $L_{a1}$ for the next iteration.</li>
</ol>
<p>Round and round: each decoder refines the reliabilities the other decoder then exploits. Early iterations move the BER dramatically; gains diminish and typically <b>6–10 iterations</b> suffice. After the final iteration the hard decision is the sign of the total a-posteriori LLR (de-interleaved to natural order).</p>
<div class="callout"><b>Why does the loop converge?</b> Because the two decoders observe the <i>same</i> information bits through <i>statistically independent</i> parity (thanks to the interleaver), each brings genuinely new evidence. Passing only <b>extrinsic</b> LLRs keeps the exchange from becoming a self-reinforcing echo. It is a practical instance of iterative <b>belief propagation</b> on a graph with a long loop — the same principle that underlies LDPC decoding.</p></div>
<p>Convergence is <b>not</b> guaranteed for all SNRs; below a threshold the loop stalls (the BER stays high no matter how many iterations), and above it the loop "opens up" and the BER plunges — the famous <b>waterfall</b>.</p>`
    },
    {
      h: 'EXIT charts: predicting convergence',
      html: String.raw`<p>How do we know at what SNR the turbo loop will "take off"? Ten Brink's <b>EXtrinsic Information Transfer (EXIT) chart</b> gives a beautifully simple graphical answer. Model each SISO decoder as a device that takes in a-priori information with mutual-information content $I_A \in [0,1]$ and emits extrinsic information $I_E = T(I_A, E_b/N_0)$. Measure this transfer curve for each constituent decoder by simulation.</p>
<ul>
<li>Plot Decoder 1's curve $I_{E1}$ vs $I_{A1}$.</li>
<li>Plot Decoder 2's curve with axes <b>swapped</b> (because one's extrinsic output is the other's a-priori input).</li>
</ul>
<p>Iterative decoding traces a <b>staircase</b> bouncing between the two curves. If the curves do <b>not touch</b>, an open "tunnel" runs from $(0,0)$ toward $(1,1)$, the staircase climbs all the way to $I_E\to 1$ (error-free), and the loop converges. As $E_b/N_0$ falls, the curves sink until they <b>pinch shut</b>; the SNR at which the tunnel just closes is the <b>convergence (pinch-off) threshold</b> — an accurate predictor of where the waterfall begins. EXIT charts let engineers design constituent codes and choose iteration counts <i>without</i> running enormous end-to-end BER simulations.</p>`
    },
    {
      h: 'Waterfall, error floor, rate and puncturing',
      html: String.raw`<p>A turbo BER-vs-$E_b/N_0$ curve has two regimes:</p>
<ul>
<li><b>Waterfall region</b> (low-to-moderate SNR): once past the convergence threshold, BER drops almost vertically — the near-Shannon behaviour. Determined mainly by the <b>convergence threshold</b> (interleaver size, constituent codes, iteration count).</li>
<li><b>Error floor</b> (high SNR): the curve flattens to a shallow slope. Caused by a <b>small number of low-weight codewords</b> — input patterns that self-terminate the recursion in both encoders despite the interleaver. Governed by the code's effective <b>free distance</b> $d_{\text{free}}$ and the multiplicity of those minimum-weight words. A well-designed interleaver (S-random, QPP) pushes the floor down below $10^{-8}$–$10^{-10}$; it can never be fully removed, only lowered.</li>
</ul>
<p><b>Rate and puncturing.</b> With systematic bits plus two full parity streams, the natural rate is 1/3 (LTE's mother rate). Higher rates are obtained by <b>puncturing</b> — periodically deleting parity bits before transmission (the decoder inserts LLR = 0, i.e. "no information", for punctured positions). Deleting alternate parity bits from the two streams yields rate 1/2; heavier puncturing gives 2/3, 3/4, etc. Puncturing trades coding gain for throughput and is how a single mother code serves many rates via rate matching.</p>
<table class="data">
<tr><th>Property</th><th>Effect on waterfall</th><th>Effect on error floor</th></tr>
<tr><td>Larger interleaver $N$</td><td>Slightly better threshold</td><td>Much lower floor (interleaver gain)</td></tr>
<tr><td>More iterations</td><td>Sharper waterfall (up to a limit)</td><td>Minor</td></tr>
<tr><td>Higher rate (more puncturing)</td><td>Threshold moves right (worse)</td><td>Floor rises</td></tr>
<tr><td>Better interleaver (S-random/QPP)</td><td>Little change</td><td>Substantially lower floor</td></tr>
</table>`
    },
    {
      h: 'Latency, complexity and real systems',
      html: String.raw`<p>Turbo codes pay for their gain in <b>latency and complexity</b>. Each iteration requires a full forward–backward BCJR pass over both trellises; with 6–8 iterations the decoder touches the block a dozen-plus times. The whole block must be received and interleaved before decoding can finish, so latency scales with block size $N$ and iteration count — a concern for LTE's tight HARQ timing and unacceptable for ultra-low-latency use, which is one reason 5G moved its control channels away from turbo.</p>
<p>Deployment history:</p>
<ul>
<li><b>3G / UMTS (2000):</b> rate-1/3 8-state turbo for high-rate data.</li>
<li><b>4G / LTE:</b> same 8-state RSC with the QPP interleaver for parallel decoding; the data (shared) channels use turbo, and rate matching provides HARQ redundancy versions.</li>
<li><b>Deep space (CCSDS):</b> turbo codes at rates 1/6, 1/4, 1/3, 1/2 for missions where every fraction of a dB buys antenna size or data volume.</li>
<li><b>DVB-RCS</b> and <b>WiMAX (802.16):</b> a duo-binary (double-binary circular) turbo variant.</li>
</ul>
<div class="callout"><b>Turbo vs LDPC in 5G-NR.</b> 5G dropped turbo for the data channel in favour of <b>LDPC</b> (higher throughput, lower error floor, easier parallelism at multi-Gb/s) and adopted <b>Polar</b> codes for control. Turbo's legacy is enormous nonetheless: it proved capacity-approaching performance was achievable and gave the world the "turbo principle" of iterative soft-information exchange.</div>`
    }
  ],
  keyPoints: [
    String.raw`Turbo codes = two Recursive Systematic Convolutional (RSC) encoders in <b>parallel</b>, joined by an <b>interleaver</b>; transmitted codeword is $(u, p_1, p_2)$.`,
    String.raw`Recursion (feedback) is essential: a weight-1 input yields a high-weight, long parity sequence, so only rare matched patterns give low-weight codewords.`,
    String.raw`The interleaver decorrelates the two parity streams, provides <b>interleaver gain</b> (floor drops as $N$ grows), and thins the low-weight spectrum.`,
    String.raw`Decoding is <b>iterative</b>: two SISO decoders exchange <b>extrinsic</b> LLRs, interleaved / de-interleaved between them.`,
    String.raw`LLR $L(u)=\ln\frac{P(u=+1)}{P(u=-1)}$: sign = decision, magnitude = confidence; independent evidence adds by LLR summation.`,
    String.raw`<b>Extrinsic = a-posteriori LLR − channel(systematic) − a-priori</b>; only the genuinely new component is passed to prevent self-reinforcing feedback.`,
    String.raw`Each SISO uses BCJR/MAP (forward $\alpha$, backward $\beta$, branch $\gamma$) — it marginalizes per bit, unlike Viterbi which finds the best path.`,
    String.raw`Max-Log-MAP replaces $\max^*$ with plain $\max$: ~0.3–0.5 dB loss but far simpler and robust to noise-scaling errors.`,
    String.raw`The BER curve shows a near-Shannon <b>waterfall</b> then an <b>error floor</b> from a few low free-distance codewords; good interleavers lower the floor.`,
    String.raw`<b>EXIT charts</b> plot extrinsic vs a-priori mutual information; an open "tunnel" between the two decoders' curves predicts convergence and its SNR threshold.`,
    String.raw`Mother rate typically 1/3; higher rates via <b>puncturing</b> parity (decoder inserts LLR = 0 for deleted bits).`,
    String.raw`Cost is <b>latency and complexity</b> (many forward–backward passes); used in UMTS, LTE, CCSDS deep space, DVB-RCS, WiMAX — largely replaced by LDPC/Polar in 5G-NR.`
  ],
  equations: [
    {
      title: 'Log-likelihood ratio (LLR)',
      tex: String.raw`$$ L(u) = \ln \frac{P(u=+1)}{P(u=-1)} $$`,
      derivation: String.raw`<p><b>Where we start.</b> A soft decoder must combine many independent, noisy pieces of evidence about one bit $u$. We want a representation in which "combining evidence" is a simple operation. Probabilities multiply (Bayes on independent observations), which is awkward; logarithms turn multiplication into addition.</p>
<p><b>Step 1 — the ratio.</b> Instead of tracking $P(u=+1)$ and $P(u=-1)$ separately, track their <i>ratio</i>. Because they sum to 1, the ratio contains all the information:</p>
$$ \frac{P(u=+1)}{P(u=-1)} = \frac{P(u=+1)}{1 - P(u=+1)} $$
<p>This is the <b>odds</b> of the bit being $+1$. Odds $>1$ favour $+1$, odds $<1$ favour $-1$, odds $=1$ is a toss-up.</p>
<p><b>Step 2 — take the logarithm.</b> Define $L(u)=\ln(\text{odds})$. Now the ambiguous point (odds $=1$) maps to $L=0$, and the two hypotheses become symmetric about zero: $+\infty$ is certain $+1$, $-\infty$ is certain $-1$.</p>
$$ L(u) = \ln \frac{P(u=+1)}{P(u=-1)} $$
<p><b>Step 3 — why addition works.</b> Suppose two independent channels give the bit. By Bayes, the joint posterior odds is the <i>product</i> of the individual odds; taking $\ln$ turns that product into a <b>sum</b>: $L_{\text{total}} = L_1 + L_2$. This is the single most useful property in all of iterative decoding — evidence accumulates by adding LLRs.</p>
<p><b>Step 4 — inverting.</b> Given an LLR we recover the probability with the logistic (sigmoid) function: $P(u=+1)=\frac{e^{L}}{1+e^{L}}=\frac{1}{1+e^{-L}}$.</p>
<p><b>Result.</b> $$ L(u)=\ln\frac{P(u=+1)}{P(u=-1)}, \qquad P(u=\pm1)=\frac{e^{\pm L/2}}{e^{L/2}+e^{-L/2}}. $$ The <b>sign</b> of $L$ is the hard decision and $|L|$ its reliability; independent evidence simply adds. This is the coordinate system turbo (and LDPC) decoders live in.</p>`
    },
    {
      title: 'Channel LLR for BPSK over AWGN',
      tex: String.raw`$$ L_c\, y = \frac{2}{\sigma^2}\, y, \qquad L_c=\frac{2}{\sigma^2}=\frac{4E_s}{N_0}\cdot\frac{1}{a} $$`,
      derivation: String.raw`<p><b>Where we start.</b> We transmit antipodal symbols $x=\pm1$ (BPSK) over an AWGN channel and receive $y=x+n$, where $n\sim\mathcal N(0,\sigma^2)$. We want the LLR of $x$ given the received sample $y$.</p>
<p><b>Step 1 — write the two Gaussian likelihoods.</b> The density of $y$ under each hypothesis is a Gaussian centred on $\pm1$:</p>
$$ p(y\mid x=+1)=\frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{(y-1)^2}{2\sigma^2}},\qquad p(y\mid x=-1)=\frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{(y+1)^2}{2\sigma^2}} $$
<p><b>Step 2 — form the LLR (assume equal priors).</b> The a-priori term is separate, so take the ratio of likelihoods and log it. The normalizing constants cancel:</p>
$$ L(x\mid y)=\ln\frac{p(y\mid x=+1)}{p(y\mid x=-1)} = -\frac{(y-1)^2}{2\sigma^2}+\frac{(y+1)^2}{2\sigma^2} $$
<p><b>Step 3 — expand the squares.</b> $(y+1)^2-(y-1)^2 = (y^2+2y+1)-(y^2-2y+1)=4y$. Therefore</p>
$$ L(x\mid y)=\frac{4y}{2\sigma^2}=\frac{2}{\sigma^2}\,y $$
<p><b>Meaning.</b> The channel LLR is simply the received sample <b>scaled</b> by the <b>channel reliability factor</b> $L_c=2/\sigma^2$. A quieter channel (small $\sigma^2$) means large $L_c$, so the same $y$ carries more confidence. Note the LLR is <b>linear</b> in $y$ — no clipping, no thresholding — which is exactly the soft value BCJR needs.</p>
<p><b>Result.</b> $$ L_c\,y=\frac{2}{\sigma^2}\,y. $$ With $\sigma^2=N_0/2$ for unit-energy symbols, $L_c=4/N_0$ (or $4E_s/N_0$ per unit amplitude). Getting $L_c$ right matters for Log-MAP; Max-Log-MAP is invariant to a wrong scale, one reason it is popular in hardware.</p>`
    },
    {
      title: 'Extrinsic-information decomposition',
      tex: String.raw`$$ L(u\mid\mathbf{y}) = L_c\,y_s + L_a(u) + L_e(u) $$`,
      derivation: String.raw`<p><b>Where we start.</b> A SISO decoder outputs the full a-posteriori LLR $L(u\mid\mathbf y)$ for each information bit, using (i) the channel sample of the systematic bit $y_s$, (ii) an a-priori LLR $L_a$ supplied by the partner decoder, and (iii) all the parity constraints. We want to isolate the part that is <i>new</i>, so we can pass only that.</p>
<p><b>Step 1 — Bayes on the bit.</b> The posterior probability factorizes into a-priori times likelihood: $P(u\mid\mathbf y)\propto P(u)\,p(\mathbf y\mid u)$. Split the observation into the systematic sample $y_s$ (which depends on $u$ directly) and everything else $\mathbf y_{\setminus s}$ (parity + other systematic bits, which depend on $u$ only through the code):</p>
$$ P(u\mid\mathbf y)\propto \underbrace{P(u)}_{\text{prior}}\;\underbrace{p(y_s\mid u)}_{\text{direct}}\;\underbrace{p(\mathbf y_{\setminus s}\mid u)}_{\text{via code}} $$
<p><b>Step 2 — take the LLR of each factor.</b> Because these three factors <b>multiply</b>, their contributions to the LLR <b>add</b> (log of a product). The prior gives $L_a(u)$; the direct systematic likelihood gives $L_c y_s$ (from the previous derivation); and the code-mediated factor defines the extrinsic term:</p>
$$ L_e(u)\;\triangleq\;\ln\frac{p(\mathbf y_{\setminus s}\mid u=+1)}{p(\mathbf y_{\setminus s}\mid u=-1)} $$
<p><b>Step 3 — assemble.</b> Summing the three LLRs:</p>
$$ L(u\mid\mathbf y)=L_c\,y_s+L_a(u)+L_e(u) $$
<p><b>Meaning.</b> The extrinsic LLR $L_e$ is inferred <b>only</b> from the code constraints and neighbouring bits — it deliberately excludes both the bit's own channel sample and the a-priori value the partner just gave. So it is <b>genuinely new</b> information from this decoder's point of view.</p>
<p><b>Result.</b> Rearranging, $$ \boxed{L_e(u)=L(u\mid\mathbf y)-L_c\,y_s-L_a(u)}. $$ This subtraction is performed every half-iteration before passing $L_e$ (through the interleaver) to the other decoder. Passing the <i>full</i> $L(u\mid\mathbf y)$ instead would feed a decoder's own prior back to whoever produced it — positive feedback that causes false convergence. Extracting extrinsic information is the mathematical core of the "turbo principle."</p>`
    },
    {
      title: 'The max* (Jacobian) operator for Log-MAP',
      tex: String.raw`$$ \max{}^*(a,b)=\ln(e^a+e^b)=\max(a,b)+\ln\!\left(1+e^{-|a-b|}\right) $$`,
      derivation: String.raw`<p><b>Where we start.</b> BCJR accumulates probabilities by <i>summing</i> products like $\alpha\gamma\beta$ over trellis paths. In the log domain (to avoid underflow), a sum of two exponentials $e^a+e^b$ must be re-expressed. That operation is $\max^*$.</p>
<p><b>Step 1 — factor out the larger term.</b> Assume WLOG $a\ge b$. Pull $e^a$ out of the sum:</p>
$$ \ln(e^a+e^b)=\ln\!\big(e^a(1+e^{b-a})\big)=a+\ln(1+e^{b-a}) $$
<p><b>Step 2 — make it symmetric.</b> Since $a\ge b$, we have $b-a=-|a-b|\le 0$, so:</p>
$$ \ln(e^a+e^b)=\max(a,b)+\ln\!\left(1+e^{-|a-b|}\right) $$
<p><b>Meaning of the two parts.</b> The $\max(a,b)$ term is the "winner-takes-all" approximation (what Viterbi would use). The correction term $\ln(1+e^{-|a-b|})$ accounts for the fact that the runner-up path <i>also</i> contributes probability. When the two metrics are far apart the correction $\to 0$; when they are equal it is maximal, $\ln 2\approx0.693$. So the correction is always small and bounded.</p>
<p><b>Step 3 — the two algorithms.</b> <b>Log-MAP</b> keeps the correction (usually via a small lookup table), giving the exact MAP result. <b>Max-Log-MAP</b> throws it away:</p>
$$ \max{}^*(a,b)\;\approx\;\max(a,b) $$
<p><b>Result.</b> $$ \max{}^*(a,b)=\max(a,b)+\ln\!\left(1+e^{-|a-b|}\right). $$ Dropping the correction (Max-Log-MAP) costs only ~0.3–0.5 dB, removes all exponentials, and — because a constant scaling of all metrics passes straight through a $\max$ — makes the decoder insensitive to an incorrectly estimated noise variance. This robustness plus simplicity is why Max-Log-MAP dominates practical turbo hardware.</p>`
    },
    {
      title: 'BCJR bit a-posteriori LLR',
      tex: String.raw`$$ L(u_k\mid\mathbf y)=\ln\frac{\displaystyle\sum_{(s',s):u_k=+1}\alpha_{k-1}(s')\,\gamma_k(s',s)\,\beta_k(s)}{\displaystyle\sum_{(s',s):u_k=-1}\alpha_{k-1}(s')\,\gamma_k(s',s)\,\beta_k(s)} $$`,
      derivation: String.raw`<p><b>Where we start.</b> The trellis of the RSC code has states $s$; a transition $s'\to s$ at time $k$ is caused by a specific information bit $u_k$. We want $P(u_k=+1\mid\mathbf y)$ vs $P(u_k=-1\mid\mathbf y)$, i.e. the probability the true path used a $+1$-edge vs a $-1$-edge at time $k$.</p>
<p><b>Step 1 — the joint edge probability factorizes.</b> The probability that the path passes through edge $(s'\to s)$ given the whole received sequence splits, by the Markov property of the trellis, into past × present × future:</p>
$$ P(s',s,\mathbf y)=\underbrace{P(s',\mathbf y_{<k})}_{\alpha_{k-1}(s')}\cdot\underbrace{P(s,y_k\mid s')}_{\gamma_k(s',s)}\cdot\underbrace{P(\mathbf y_{>k}\mid s)}_{\beta_k(s)} $$
<p>because, conditioned on the state, the past, the current transition, and the future are independent.</p>
<p><b>Step 2 — define the three quantities.</b> <b>Forward</b> $\alpha_k(s)=\sum_{s'}\alpha_{k-1}(s')\gamma_k(s',s)$ accumulates evidence from the start; <b>backward</b> $\beta_{k-1}(s')=\sum_{s}\beta_k(s)\gamma_k(s',s)$ accumulates from the end; the <b>branch metric</b> $\gamma_k(s',s)$ combines the a-priori LLR of $u_k$ with the channel likelihood of the systematic and parity symbols on that edge.</p>
<p><b>Step 3 — marginalize over the right edges.</b> To get $P(u_k=+1\mid\mathbf y)$ we sum the joint edge probability over <i>all</i> edges whose input label is $+1$; likewise for $-1$. The unknown normalizing constant $P(\mathbf y)$ is common to both and cancels in the ratio.</p>
<p><b>Result.</b> $$ L(u_k\mid\mathbf y)=\ln\frac{\sum_{u_k=+1}\alpha_{k-1}(s')\gamma_k(s',s)\beta_k(s)}{\sum_{u_k=-1}\alpha_{k-1}(s')\gamma_k(s',s)\beta_k(s)}. $$ This is the exact per-bit soft output. Contrast with Viterbi, which keeps only the single best path; BCJR <b>sums over all paths</b>, which is why it can output a graded reliability. In the log domain every product becomes a sum and every sum a $\max^*$, giving the numerically stable Log-MAP recursion used in practice.</p>`
    },
    {
      title: 'Interleaver gain (error-floor scaling)',
      tex: String.raw`$$ P_b \;\approx\; \sum_{d} \frac{w_d}{N}\,Q\!\left(\sqrt{2 d\,\tfrac{R E_b}{N_0}}\right),\qquad \text{floor} \propto N^{-1} $$`,
      derivation: String.raw`<p><b>Where we start.</b> At high SNR the union bound on bit-error probability is dominated by the lowest-weight codewords. We want to see <i>why</i> making the interleaver larger lowers the error floor — the phenomenon called interleaver gain.</p>
<p><b>Step 1 — union bound.</b> The bit error probability is upper-bounded by a sum over codewords of the pairwise error probability weighted by how many information-bit errors that word causes:</p>
$$ P_b \le \sum_{d\ge d_{\text{free}}} \frac{\tilde w_d}{N}\,Q\!\left(\sqrt{2 d\,R\,\tfrac{E_b}{N_0}}\right) $$
<p>where $d$ is codeword (Hamming) weight, $R$ the rate, and $\tilde w_d$ the total input weight of all weight-$d$ codewords. The $Q$-function falls off fast, so the smallest $d$ dominates at high SNR.</p>
<p><b>Step 2 — count low-weight codewords.</b> Low-weight turbo codewords arise from low-weight <b>input</b> patterns that self-terminate the recursion in <b>both</b> encoders. For a random interleaver of size $N$, the chance that a weight-$w$ pattern which terminates encoder 1 also lands (after permutation) on a terminating pattern for encoder 2 scales roughly as $N^{-(w-1)}$ — the permutation "misaligns" the pattern with high probability.</p>
<p><b>Step 3 — the dominant weight-2 inputs.</b> The most dangerous inputs have weight $w=2$ (two bits that together reset the recursive shift register). Their effective multiplicity per bit therefore scales as $N^{-(2-1)}=N^{-1}$. Plugging into the bound, the height of the floor is proportional to $1/N$.</p>
<p><b>Result.</b> $$ \text{floor} \;\propto\; \frac{1}{N}. $$ <b>Meaning:</b> doubling the interleaver length roughly halves the error floor — a direct, quantitative payoff for using large blocks, and the reason turbo codes shine for long packets but lose their edge for very short ones. Structured interleavers (S-random, QPP) do even better than random by <i>guaranteeing</i> that weight-2 (and small-weight) patterns are always misaligned.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What are the two constituent encoders in a turbo code and how are they connected?`, back: String.raw`Two <b>Recursive Systematic Convolutional (RSC)</b> encoders in <b>parallel</b>, connected through an <b>interleaver</b>: the info bits feed encoder 1 directly and encoder 2 after permutation. Output = $(u, p_1, p_2)$.` },
    { front: String.raw`Why must the constituent encoders be recursive?`, back: String.raw`Recursion (feedback) makes a weight-1 input produce a long, high-weight parity sequence. Only rare matched patterns self-terminate to low weight, and the interleaver ensures a bad pattern for one encoder is scrambled to a good one for the other — raising the free distance.` },
    { front: String.raw`Define the log-likelihood ratio (LLR) of a bit.`, back: String.raw`$L(u)=\ln\frac{P(u=+1)}{P(u=-1)}$. Sign = hard decision, magnitude = confidence. Independent evidence about the same bit combines by <b>adding</b> LLRs.` },
    { front: String.raw`Give the extrinsic-information formula.`, back: String.raw`$L_e(u)=L(u\mid\mathbf y)-L_c y_s-L_a(u)$ = a-posteriori LLR minus the systematic channel term minus the a-priori term. Only $L_e$ is passed to the other decoder.` },
    { front: String.raw`Why pass extrinsic (not full a-posteriori) LLRs between decoders?`, back: String.raw`To avoid feeding a decoder's own prior back to whoever supplied it. Passing full LLRs is positive feedback and causes false/premature convergence; extrinsic info is the genuinely new evidence.` },
    { front: String.raw`BCJR/MAP vs Viterbi — key difference?`, back: String.raw`Viterbi finds the single most likely <b>path</b> (sequence). BCJR marginalizes over all paths to give each <b>bit's</b> a-posteriori probability — the graded soft output turbo decoding needs. BCJR uses forward $\alpha$, backward $\beta$, branch $\gamma$.` },
    { front: String.raw`What is the max* operator and why does it matter?`, back: String.raw`$\max^*(a,b)=\ln(e^a+e^b)=\max(a,b)+\ln(1+e^{-|a-b|})$. Log-MAP keeps the correction (exact); Max-Log-MAP drops it (~0.3–0.5 dB loss) for simplicity and robustness to noise-variance error.` },
    { front: String.raw`Describe the turbo BER curve's two regions.`, back: String.raw`<b>Waterfall</b>: steep BER drop past the convergence threshold (near-Shannon). <b>Error floor</b>: flat region at high SNR caused by a few low free-distance codewords; lowered (not removed) by good interleavers and larger $N$.` },
    { front: String.raw`What does an EXIT chart show and predict?`, back: String.raw`It plots each SISO decoder's extrinsic mutual information $I_E$ vs a-priori $I_A$. An open "tunnel" between the two curves means the iterative staircase reaches $I_E\to1$ (convergence); the SNR at which the tunnel pinches shut is the convergence threshold.` },
    { front: String.raw`How are higher code rates obtained from the mother turbo code?`, back: String.raw`By <b>puncturing</b> — periodically deleting parity bits before transmission. The decoder inserts LLR = 0 (no information) at punctured positions. Mother rate ~1/3; puncturing gives 1/2, 2/3, 3/4, etc.` },
    { front: String.raw`What is interleaver gain?`, back: String.raw`As block length $N$ grows, low-weight input patterns are less likely to stay low-weight after permutation, so the error floor drops roughly as $1/N$. Doubling $N$ roughly halves the floor.` },
    { front: String.raw`Where are turbo codes deployed, and why did 5G-NR move away?`, back: String.raw`UMTS (3G), LTE (4G, QPP interleaver), CCSDS deep space, DVB-RCS, WiMAX. 5G-NR uses LDPC for data (higher throughput, lower floor, better parallelism) and Polar for control — turbo's iterative latency and floor were less attractive at multi-Gb/s.` },
    { front: String.raw`What is the channel reliability factor $L_c$ for BPSK over AWGN?`, back: String.raw`$L_c=2/\sigma^2=4E_s/N_0$. The channel LLR is $L_c y$ — the received sample linearly scaled by reliability. Quieter channels (small $\sigma^2$) give larger $L_c$.` },
    { front: String.raw`Who invented turbo codes and when?`, back: String.raw`Berrou, Glavieux and Thitimajshima, presented at IEEE ICC in <b>1993</b>. They demonstrated BER $10^{-5}$ within ~0.5 dB of the Shannon limit at rate 1/2.` },
    { front: String.raw`What is the QPP interleaver and why is it used in LTE?`, back: String.raw`Quadratic Permutation Polynomial: $\Pi(i)=(f_1 i+f_2 i^2)\bmod N$. It is <b>maximum-contention-free</b>, letting parallel hardware decoders access memory without collisions, and gives good spreading to keep the error floor low.` },
    { front: String.raw`Roughly how many iterations does turbo decoding need?`, back: String.raw`Typically <b>6–10</b>. Early iterations give most of the gain; returns diminish. More iterations sharpen the waterfall up to a limit set by the EXIT-chart convergence.` }
  ],
  mcqs: [
    { q: String.raw`The two constituent encoders in a classical turbo code are connected in:`, options: [String.raw`series (one feeds the other)`, String.raw`parallel, via an interleaver`, String.raw`a feedback ring with a Viterbi decoder`, String.raw`parallel with no interleaver`], answer: 1, explain: String.raw`Turbo codes use <b>parallel concatenation</b>: both RSC encoders see the same info bits, one directly and one through the interleaver.` },
    { q: String.raw`Why are the constituent encoders recursive (RSC)?`, options: [String.raw`to reduce hardware cost`, String.raw`so a weight-1 input produces long, high-weight parity, raising free distance`, String.raw`to make the code non-systematic`, String.raw`recursion is required by the Viterbi algorithm`], answer: 1, explain: String.raw`A recursive encoder responds to an isolated 1 with an infinite/high-weight parity sequence; only rare matched patterns self-terminate. This, plus the interleaver, keeps low-weight codewords rare.` },
    { q: String.raw`The extrinsic LLR passed between turbo decoders equals:`, options: [String.raw`the full a-posteriori LLR`, String.raw`a-posteriori − channel(systematic) − a-priori`, String.raw`a-priori − channel`, String.raw`the hard-decision bit`], answer: 1, explain: String.raw`$L_e=L(u\mid\mathbf y)-L_c y_s-L_a$. Subtracting off what the partner already knows leaves only the genuinely new information.` },
    { q: String.raw`Passing the full a-posteriori LLR (instead of extrinsic) between decoders would:`, options: [String.raw`speed up convergence with no downside`, String.raw`create positive feedback and false convergence`, String.raw`have no effect`, String.raw`turn the code into a block code`], answer: 1, explain: String.raw`Feeding a decoder's own prior back to its source is self-reinforcing and produces premature, unreliable convergence — hence only extrinsic info is exchanged.` },
    { q: String.raw`Compared with the Viterbi algorithm, the BCJR/MAP algorithm:`, options: [String.raw`finds the single most likely path`, String.raw`marginalizes over all paths to give per-bit a-posteriori probabilities`, String.raw`is a hard-decision-only algorithm`, String.raw`cannot handle a-priori information`], answer: 1, explain: String.raw`BCJR sums over all trellis paths (forward $\alpha$, backward $\beta$, branch $\gamma$) to produce graded per-bit soft outputs, which turbo decoding requires.` },
    { q: String.raw`The Max-Log-MAP algorithm differs from Log-MAP by:`, options: [String.raw`using multiplication instead of addition`, String.raw`dropping the $\ln(1+e^{-|a-b|})$ correction term`, String.raw`using a longer interleaver`, String.raw`decoding without a-priori LLRs`], answer: 1, explain: String.raw`Max-Log-MAP approximates $\max^*$ by plain $\max$, discarding the bounded correction. Cost ~0.3–0.5 dB, but it is simpler and robust to noise-scale errors.` },
    { q: String.raw`The turbo "error floor" is caused primarily by:`, options: [String.raw`quantization noise in the ADC`, String.raw`a small number of low free-distance codewords`, String.raw`too many decoding iterations`, String.raw`the matched filter`], answer: 1, explain: String.raw`At high SNR the BER is dominated by rare low-weight codewords (input patterns that self-terminate both encoders). Good/large interleavers push the floor lower.` },
    { q: String.raw`Interleaver gain means the error floor scales approximately as:`, options: [String.raw`$N$`, String.raw`$1/N$`, String.raw`$\log N$`, String.raw`independent of $N$`], answer: 1, explain: String.raw`The dominant weight-2 input multiplicity per bit scales as $N^{-1}$, so doubling the interleaver length roughly halves the floor.` },
    { q: String.raw`An EXIT chart predicts convergence when:`, options: [String.raw`the two decoder transfer curves cross near the origin`, String.raw`an open tunnel exists between the two curves up to $(1,1)$`, String.raw`both curves are flat`, String.raw`the a-priori mutual information is 1 at the start`], answer: 1, explain: String.raw`If the curves do not touch, the iterative staircase climbs the open tunnel to $I_E\to1$ (error-free). The SNR at which the tunnel pinches shut is the convergence threshold.` },
    { q: String.raw`Higher code rates are obtained from a turbo mother code by:`, options: [String.raw`adding more parity streams`, String.raw`puncturing (deleting) parity bits`, String.raw`increasing the constraint length`, String.raw`removing the interleaver`], answer: 1, explain: String.raw`Puncturing deletes parity bits; the decoder inserts LLR = 0 for them. This trades coding gain for throughput and lets one mother code serve many rates.` },
    { q: String.raw`For BPSK over AWGN with noise variance $\sigma^2$, the channel LLR is:`, options: [String.raw`$y/\sigma$`, String.raw`$(2/\sigma^2)\,y$`, String.raw`$\sigma^2 y/2$`, String.raw`$\ln y$`], answer: 1, explain: String.raw`Taking the log-ratio of the two Gaussian likelihoods gives $L=\frac{2}{\sigma^2}y$ — the sample scaled by the reliability factor $L_c=2/\sigma^2$.` },
    { q: String.raw`The primary practical drawback of turbo decoding is:`, options: [String.raw`it cannot use soft information`, String.raw`high latency/complexity from many forward–backward passes`, String.raw`it only works at very high SNR`, String.raw`it requires a non-systematic code`], answer: 1, explain: String.raw`Each iteration runs full BCJR on both trellises; 6–10 iterations plus block interleaving impose significant latency — a reason 5G control channels avoid turbo.` },
    { q: String.raw`Turbo codes were first published in:`, options: [String.raw`1948 by Shannon`, String.raw`1993 by Berrou, Glavieux and Thitimajshima`, String.raw`1962 by Gallager`, String.raw`1967 by Viterbi`], answer: 1, explain: String.raw`The landmark ICC 1993 paper demonstrated near-Shannon performance and launched iterative decoding as a field.` },
    { q: String.raw`LTE uses a QPP interleaver mainly because it is:`, options: [String.raw`the shortest possible`, String.raw`maximum-contention-free, enabling parallel decoder memory access`, String.raw`a rectangular block interleaver`, String.raw`identical to the Gold-code generator`], answer: 1, explain: String.raw`The Quadratic Permutation Polynomial interleaver lets multiple sub-decoders access memory without collisions, essential for high-throughput parallel hardware, while giving good spreading.` },
    { q: String.raw`In an LLR, the magnitude $|L(u)|$ represents:`, options: [String.raw`the hard-decision bit value`, String.raw`the reliability/confidence of the decision`, String.raw`the code rate`, String.raw`the interleaver size`], answer: 1, explain: String.raw`Sign gives the decision ($+$ or $-$); magnitude gives how confident it is. $|L|\to\infty$ is certainty, $|L|=0$ is a toss-up.` },
    { q: String.raw`Which statement about 5G-NR channel coding is correct?`, options: [String.raw`It uses turbo for data and Reed–Solomon for control`, String.raw`It uses LDPC for data and Polar for control`, String.raw`It uses turbo for everything`, String.raw`It uses convolutional codes only`], answer: 1, explain: String.raw`5G-NR selected LDPC for the data (shared) channel and Polar for control — turbo was retained in LTE but dropped for the new radio.` }
  ],
  numericals: [
    { q: String.raw`A BPSK-AWGN channel has noise variance $\sigma^2=0.5$. A matched-filter output is $y=+0.8$. Compute the channel LLR $L_c y$ and the hard decision.`, solution: String.raw`$L_c=2/\sigma^2=2/0.5=4$. Channel LLR $=L_c y=4\times0.8=+3.2$. Sign is positive $\Rightarrow$ decide $u=+1$, with reliability $|L|=3.2$ (fairly confident). Converting: $P(u=+1)=1/(1+e^{-3.2})\approx0.961$.` },
    { q: String.raw`A turbo decoder outputs a-posteriori LLR $L(u\mid\mathbf y)=+2.4$. The channel systematic term is $L_c y_s=+1.0$ and the a-priori term from the partner is $L_a=+0.9$. Find the extrinsic LLR to pass on.`, solution: String.raw`$L_e=L(u\mid\mathbf y)-L_c y_s-L_a=2.4-1.0-0.9=+0.5$. Only this $+0.5$ (the new evidence) is interleaved and handed to the other decoder as its a-priori input.` },
    { q: String.raw`Evaluate $\max^*(3.0,\,2.5)$ exactly (Log-MAP) and compare with the Max-Log-MAP value.`, solution: String.raw`$\max^*(3.0,2.5)=\max(3.0,2.5)+\ln(1+e^{-|3.0-2.5|})=3.0+\ln(1+e^{-0.5})=3.0+\ln(1+0.6065)=3.0+\ln(1.6065)=3.0+0.4741=3.474$. Max-Log-MAP gives just $\max=3.0$. Error $\approx0.474$ (bounded by $\ln2\approx0.693$).` },
    { q: String.raw`A rate-1/3 mother turbo code transmits systematic + two parity streams. By puncturing, half of each parity stream is deleted so that on average one parity bit per info bit survives. What is the resulting code rate?`, solution: String.raw`Per info bit: 1 systematic always sent + on average 1 parity bit sent (half of the 2 parity bits). So 1 info bit $\to$ 2 transmitted bits $\Rightarrow$ rate $=1/2$. (Deleting all parity would give rate 1; deleting none gives 1/3.)` },
    { q: String.raw`An interleaver of size $N_1=1024$ gives an error floor at BER $\approx 2\times10^{-7}$. Using interleaver-gain scaling (floor $\propto 1/N$), estimate the floor for $N_2=4096$.`, solution: String.raw`Floor scales as $1/N$, so ratio $=N_1/N_2=1024/4096=1/4$. New floor $\approx (2\times10^{-7})\times(1/4)=5\times10^{-8}$. Quadrupling the block length lowers the floor about fourfold.` },
    { q: String.raw`Two independent observations of a bit give LLRs $L_1=+1.2$ and $L_2=-0.4$. What is the combined LLR and decision?`, solution: String.raw`Independent evidence adds: $L=L_1+L_2=1.2-0.4=+0.8$. Positive $\Rightarrow$ decide $u=+1$, but with modest confidence $|L|=0.8$ (the conflicting second observation reduced certainty). $P(u=+1)=1/(1+e^{-0.8})\approx0.69$.` },
    { q: String.raw`A turbo decoder runs 8 iterations, each requiring a forward and a backward BCJR pass over both constituent trellises. How many trellis sweeps in total per decoded block?`, solution: String.raw`Per iteration: 2 decoders × 2 passes (forward + backward) = 4 sweeps. Over 8 iterations: $4\times8=32$ full trellis sweeps per block. This multiplicative cost is the source of turbo's latency and power consumption.` }
  ],
  realWorld: String.raw`<p>Turbo codes went from a 1993 curiosity to the backbone of mobile data within a decade. <b>3G UMTS</b> and <b>4G LTE</b> carry their high-rate user data over rate-1/3 turbo codes; LTE's Quadratic Permutation Polynomial interleaver was chosen specifically so that dozens of parallel decoder cores can hit memory without collisions, enabling hundred-Mb/s throughput. In deep space, the <b>CCSDS</b> turbo standard (rates down to 1/6) squeezes the last fractions of a dB out of a link where every 0.5 dB can mean a smaller, cheaper spacecraft antenna or more science data returned — missions from Mars orbiters to outer-planet probes have flown turbo codes. Satellite return channels (<b>DVB-RCS</b>) and early <b>WiMAX</b> used a duo-binary turbo variant. The deeper legacy is the <b>"turbo principle"</b> itself: iterative exchange of extrinsic soft information now appears in turbo equalization (jointly undoing a channel and decoding), turbo multiuser detection, and joint source–channel decoding. When <b>5G-NR</b> chose LDPC and Polar codes instead, it was not a repudiation of turbo but a natural evolution — the very idea of iterative, capacity-approaching, soft-in soft-out decoding that turbo pioneered is what made those successors possible.</p>`,
  related: ['convolutional-codes', 'viterbi', 'ldpc', 'fec', 'shannon']
},
{
  id: 'ldpc',
  title: 'LDPC Codes',
  category: 'Spread Spectrum & Coding',
  tags: ['FEC', 'sparse', 'parity-check', 'Tanner graph', 'belief propagation', 'sum-product', 'min-sum', 'near-capacity'],
  summary: String.raw`Low-Density Parity-Check codes are linear block codes defined by a sparse parity-check matrix whose Tanner graph is decoded by iterative belief-propagation (sum-product / min-sum) message passing, achieving near-Shannon performance with a low error floor and highly parallel hardware.`,
  prerequisites: ['channel-coding', 'fec', 'shannon', 'convolutional-codes', 'eb-no'],
  intro: String.raw`<p>Robert <b>Gallager</b> invented Low-Density Parity-Check codes in his 1962 MIT PhD thesis — and the world promptly forgot them for thirty years. The hardware of the day could not run the iterative decoder Gallager himself described, and algebraic block codes (Reed–Solomon, BCH) stole the spotlight. Then, in the mid-1990s, in the wake of the turbo-code earthquake, <b>David MacKay</b> and Radford Neal (and independently others) <b>rediscovered</b> LDPC codes and showed that they too could sail within a fraction of a dB of the <b>Shannon limit</b> — in fact, carefully optimized <b>irregular</b> LDPC codes hold some of the tightest records ever, within <b>~0.04 dB</b> of capacity.</p>
<p>The defining idea is in the name: the parity-check matrix $\mathbf H$ is <b>low density</b> — almost all of its entries are 0, with only a sparse sprinkling of 1s. Sparsity is not a detail; it is the whole point. A sparse $\mathbf H$ corresponds to a sparse bipartite graph (the <b>Tanner graph</b>) on which a local, message-passing decoder — <b>belief propagation</b> — runs efficiently and, crucially, <i>converges</i> to near-optimal decisions. Where turbo codes achieve capacity through a clever concatenation and a long feedback loop, LDPC codes achieve it through the <b>structure of a sparse graph</b> and purely local computation. Today LDPC codes carry Wi-Fi (802.11n/ac/ax), the 5G-NR data channel, satellite TV (DVB-S2), and 10-gigabit Ethernet (10GBASE-T).</p>`,
  sections: [
    {
      h: 'The parity-check matrix and what "low density" means',
      html: String.raw`<p>Any linear block code can be described by a <b>parity-check matrix</b> $\mathbf H$ ($m\times n$): a length-$n$ vector $\mathbf c$ is a valid codeword iff</p>
$$ \mathbf H\,\mathbf c^{\mathsf T}=\mathbf 0 \pmod 2. $$
<p>Each <b>row</b> of $\mathbf H$ is one <b>parity check</b> — it says "these particular bits must XOR to zero." For a rate-$k/n$ code, $\mathbf H$ has $m=n-k$ rows (one per redundant bit). What makes a code <b>LDPC</b> is that $\mathbf H$ is <b>sparse</b>: the number of 1s per row and per column is a small fixed constant (say 3–6), <i>independent of the block length</i>. So as $n$ grows to thousands or tens of thousands of bits, the <b>fraction</b> of 1s in $\mathbf H$ vanishes.</p>
<div class="callout"><b>Why does sparsity buy near-capacity performance with feasible decoding?</b> Two reasons. (1) <b>Statistics:</b> Gallager showed that <i>random</i> sparse parity-check codes have excellent distance properties with overwhelming probability — good codes are plentiful, you just need a way to decode them. (2) <b>Computation:</b> optimal (maximum-likelihood) decoding of any linear code is NP-hard, but on a <b>sparse</b> graph a local message-passing algorithm is nearly optimal <i>and</i> cheap, because each check involves only a handful of bits and each bit only a handful of checks. Sparsity is precisely what makes the graph loosely connected enough for local inference to work.</div>
<p><b>Regular vs irregular.</b> A <b>regular</b> $(d_v,d_c)$ LDPC code has exactly $d_v$ ones in every column (each bit is in $d_v$ checks) and $d_c$ ones in every row (each check involves $d_c$ bits). Gallager's original codes were regular. <b>Irregular</b> LDPC codes let the degrees <b>vary</b> across nodes (some bits participate in many checks, some in few), described by degree-distribution polynomials $\lambda(x),\rho(x)$. Optimizing these distributions (via density evolution) is what pushes performance to within hundredths of a dB of capacity — irregular codes beat regular ones and even turbo codes in the waterfall.</p>`
    },
    {
      h: 'The Tanner graph: variable nodes and check nodes',
      html: String.raw`<p>The parity-check matrix has a natural picture as a <b>bipartite graph</b>, introduced by Michael Tanner in 1981. Two kinds of node:</p>
<ul>
<li><b>Variable nodes (VN)</b> — one per code bit, $n$ of them. These are the columns of $\mathbf H$.</li>
<li><b>Check nodes (CN)</b> — one per parity check, $m$ of them. These are the rows of $\mathbf H$.</li>
</ul>
<p>An <b>edge</b> connects variable node $j$ to check node $i$ <b>iff</b> $H_{ij}=1$. In words: the edge exists when bit $j$ participates in parity check $i$. Sparsity of $\mathbf H$ = sparsity of the graph (few edges). Decoding is then <b>message passing</b> along these edges: variable nodes and check nodes take turns sending each other their best current belief about each bit, iterating until the checks are satisfied.</p>
<div class="callout"><b>Girth and short cycles.</b> A <b>cycle</b> is a closed loop in the Tanner graph; the <b>girth</b> is the length of the shortest cycle (always even in a bipartite graph, minimum 4). Belief propagation is <i>exactly</i> optimal only on a <b>tree</b> (no cycles). Real finite-length LDPC graphs have cycles, so BP is only approximate — and <b>short cycles (girth 4)</b> are the worst offenders: they let a message quickly circle back and reinforce itself, correlating what should be independent evidence. Good LDPC designs deliberately <b>maximize girth</b> (avoid girth-4, i.e. no two columns of $\mathbf H$ share two 1s in the same rows). High girth $\Rightarrow$ BP stays accurate longer and the error floor drops.</p></div>`
    },
    {
      h: 'A worked syndrome / parity-check example',
      html: String.raw`<p>Take a tiny $(6,3)$ code (n=6 bits, m=3 checks) with</p>
$$ \mathbf H=\begin{bmatrix}1&1&0&1&0&0\\0&1&1&0&1&0\\1&0&1&0&0&1\end{bmatrix}. $$
<p>Each row is a check: row 1 says $c_1\oplus c_2\oplus c_4=0$; row 2 says $c_2\oplus c_3\oplus c_5=0$; row 3 says $c_1\oplus c_3\oplus c_6=0$. In the Tanner graph, variable node $c_2$ has edges to check nodes 1 and 2 (column 2 has 1s in rows 1,2); check node 1 connects to $c_1,c_2,c_4$.</p>
<p><b>Syndrome check.</b> Suppose we receive $\mathbf r=(1,0,1,1,1,0)$. Compute the <b>syndrome</b> $\mathbf s=\mathbf H\mathbf r^{\mathsf T}$:</p>
<ul>
<li>$s_1=r_1\oplus r_2\oplus r_4=1\oplus0\oplus1=0$ ✓</li>
<li>$s_2=r_2\oplus r_3\oplus r_5=0\oplus1\oplus1=0$ ✓</li>
<li>$s_3=r_1\oplus r_3\oplus r_6=1\oplus1\oplus0=0$ ✓</li>
</ul>
<p>All checks pass ($\mathbf s=\mathbf 0$) $\Rightarrow$ $\mathbf r$ is a valid codeword. Now suppose instead we received $\mathbf r'=(1,0,1,0,1,0)$ (bit 4 flipped). Then $s_1=1\oplus0\oplus0=1$, $s_2=0$, $s_3=0$: syndrome $=(1,0,0)$. A <b>nonzero syndrome flags an error</b>; the pattern of failed checks points at the culprit — here only check 1 failed, and the only bit in check 1 not shared with a passing constraint that would also fail is $c_4$. Soft BP decoding generalizes this: instead of hard XOR pass/fail, checks and bits exchange <b>probabilistic</b> (LLR) messages to locate and correct errors.</p>`
    },
    {
      h: 'Belief propagation: the sum-product algorithm',
      html: String.raw`<p>The optimal soft decoder is the <b>sum-product algorithm (SPA)</b>, also called belief propagation, run in the log-likelihood-ratio (LLR) domain. Every bit starts with its channel LLR $L_j=\ln\frac{P(c_j=0\mid y_j)}{P(c_j=1\mid y_j)}$. Then variable and check nodes iterate two message updates:</p>
<p><b>Variable-node (VN) update</b> — "collect and add." A variable node $j$ sends to a neighbouring check $i$ the sum of its channel LLR plus <b>all incoming check messages except the one from $i$</b> (extrinsic!):</p>
$$ L_{j\to i}=L_j+\sum_{i'\in N(j)\setminus i} L_{i'\to j}. $$
<p><i>Intuition:</i> a bit's belief is the accumulation of independent evidence; LLRs simply add. Excluding check $i$'s own message prevents feeding a belief back to its source.</p>
<p><b>Check-node (CN) update</b> — "enforce the XOR = 0 constraint." A check node $i$ tells bit $j$ what the parity constraint implies about $c_j$, given the <i>other</i> bits' beliefs:</p>
$$ \tanh\!\frac{L_{i\to j}}{2}=\prod_{j'\in N(i)\setminus j}\tanh\!\frac{L_{j'\to i}}{2}. $$
<p><i>Intuition:</i> for a parity (XOR) constraint, reliabilities combine multiplicatively via the $\tanh$ "soft-XOR." The result is <b>weakest-link</b>: a check can only be as confident about one bit as it is about the least-certain of the others.</p>
<p>After each full round, form the <b>total</b> LLR $L_j^{\text{tot}}=L_j+\sum_{i\in N(j)}L_{i\to j}$, make a tentative hard decision, and test $\mathbf H\hat{\mathbf c}^{\mathsf T}=\mathbf 0$. If all checks pass, <b>stop early</b>; otherwise iterate (typically up to 20–50 iterations). Because messages are extrinsic and the graph is sparse, the algorithm is both cheap and, on high-girth graphs, near-optimal.</p>`
    },
    {
      h: 'Min-sum and hardware simplification',
      html: String.raw`<p>The $\tanh/\text{atanh}$ check-node update is accurate but hardware-unfriendly (transcendental functions, sensitivity to LLR scaling). The <b>min-sum</b> approximation replaces it with two cheap operations:</p>
$$ L_{i\to j}\approx\left(\prod_{j'\ne j}\operatorname{sign}L_{j'\to i}\right)\cdot\min_{j'\ne j}\bigl|L_{j'\to i}\bigr|. $$
<p><b>Why this works.</b> The $\tanh$ product is dominated by its <b>smallest-magnitude</b> term (the least reliable neighbour), because $\tanh$ saturates: once an argument is large, $\tanh\approx\pm1$ and stops mattering. So the outgoing reliability is essentially the <b>minimum</b> incoming reliability, and the outgoing sign is the <b>XOR of signs</b> (the product of signs). This is the "weakest-link" intuition made literal.</p>
<p>Plain min-sum slightly <b>overestimates</b> reliabilities, so practical decoders apply a correction: <b>normalized min-sum</b> (multiply by a factor $\alpha\approx0.75$–$0.9$) or <b>offset min-sum</b> (subtract a small $\beta$). These recover most of the sum-product performance (within ~0.1 dB) at a fraction of the cost.</p>
<table class="data">
<tr><th>Decoder</th><th>Check-node op</th><th>Complexity</th><th>Loss vs SPA</th></tr>
<tr><td>Sum-product (SPA)</td><td>$\tanh$/atanh product</td><td>High (transcendental)</td><td>0 (optimal on trees)</td></tr>
<tr><td>Min-sum</td><td>min of magnitudes, XOR of signs</td><td>Low</td><td>~0.3–0.5 dB</td></tr>
<tr><td>Normalized/offset min-sum</td><td>min + scale/offset</td><td>Low</td><td>~0.1 dB</td></tr>
<tr><td>Layered BP</td><td>SPA/min-sum, row by row</td><td>~½ iterations</td><td>~0 (faster convergence)</td></tr>
</table>`
    },
    {
      h: 'Code rate, structure, and encoding',
      html: String.raw`<p>The <b>rate</b> of an LDPC code is $R=k/n=(n-m)/n=1-m/n$ (assuming $\mathbf H$ has full row rank). So more checks (larger $m$) $\Rightarrow$ lower rate, more protection. LDPC codes support essentially any rate by choosing the shape of $\mathbf H$.</p>
<p><b>The encoding wrinkle.</b> A sparse $\mathbf H$ makes <i>decoding</i> easy but <i>encoding</i> awkward: obtaining a generator matrix $\mathbf G$ from $\mathbf H$ via Gaussian elimination generally yields a <b>dense</b> $\mathbf G$, so naïve encoding is $O(n^2)$. Two fixes dominate practice:</p>
<ul>
<li><b>Quasi-cyclic (QC) LDPC.</b> Build $\mathbf H$ from small circulant (cyclically shifted identity) blocks. This gives structure that enables near-linear encoding <i>and</i> hugely parallel, memory-friendly decoding. 5G-NR, Wi-Fi, and DVB-S2 all use QC-LDPC (5G calls its two structured matrices "base graphs" BG1 and BG2).</li>
<li><b>Approximate-lower-triangular / IRA structure.</b> Arrange $\mathbf H$ so parity bits can be solved by back-substitution in near-linear time (Richardson–Urbanke); repeat-accumulate variants make this especially simple.</li>
</ul>
<p><b>Rate compatibility.</b> As with turbo, higher rates come from <b>puncturing</b> (transmit fewer bits, decoder inserts LLR = 0) and lower rates from <b>extending</b> the base graph with extra parity — 5G-NR's base graphs support a wide rate range and HARQ incremental redundancy this way.</p>`
    },
    {
      h: 'Density evolution, thresholds, and the error floor',
      html: String.raw`<p>How do we design a degree distribution that reaches capacity? <b>Density evolution</b> tracks the probability distribution of the messages as the iterations proceed, <i>assuming an infinitely long code with a cycle-free (tree) graph</i>. It reveals a sharp <b>decoding threshold</b>: a channel-quality boundary (e.g. an $E_b/N_0$ value) above which the message error probability $\to 0$ and below which it does not. Optimizing $\lambda(x),\rho(x)$ to push this threshold toward the Shannon limit is how the record-setting ~0.0045 dB irregular codes were built.</p>
<p>Real, finite codes deviate from this ideal in two regimes:</p>
<ul>
<li><b>Waterfall:</b> steep BER drop near the density-evolution threshold — the near-capacity behaviour.</li>
<li><b>Error floor:</b> a flattening at high SNR. For LDPC the floor is caused not by minimum distance alone but by <b>trapping sets</b> (a.k.a. near-codewords / absorbing sets): small clusters of variable nodes that, once in error, sustain each other through short cycles and defeat the iterative decoder even though they may not be true codewords. High girth and careful graph construction (avoiding small trapping sets) push the floor far down.</li>
</ul>
<div class="callout"><b>LDPC error floors are usually lower</b> than turbo's, which — together with massive decoder parallelism — is a major reason 5G-NR chose LDPC for its high-throughput data channel over turbo.</div>`
    },
    {
      h: 'LDPC vs turbo, and where LDPC is deployed',
      html: String.raw`<p>Both are capacity-approaching iterative codes born of (or revived by) the 1990s, but they differ in telling ways:</p>
<table class="data">
<tr><th>Aspect</th><th>Turbo codes</th><th>LDPC codes</th></tr>
<tr><td>Structure</td><td>2 RSC encoders + interleaver (convolutional)</td><td>Sparse parity-check matrix / Tanner graph (block)</td></tr>
<tr><td>Decoding</td><td>BCJR/MAP, two SISO decoders exchange extrinsic LLRs</td><td>Belief propagation (sum-product / min-sum) on the graph</td></tr>
<tr><td>Parallelism</td><td>Limited (serial trellis passes); QPP helps</td><td>Very high — all nodes update in parallel</td></tr>
<tr><td>Latency/throughput</td><td>Higher latency; harder at multi-Gb/s</td><td>Lower latency; excels at very high throughput</td></tr>
<tr><td>Error floor</td><td>Can be higher (low-weight codewords)</td><td>Usually lower (with good graph design)</td></tr>
<tr><td>Short blocks</td><td>Competitive</td><td>Historically weaker; improved with modern designs</td></tr>
<tr><td>Encoding</td><td>Simple (shift registers)</td><td>Trickier; solved by QC / IRA structure</td></tr>
</table>
<p><b>Deployments.</b> LDPC is everywhere high throughput meets tough channels:</p>
<ul>
<li><b>Wi-Fi</b> 802.11n/ac/ax (optional LDPC mode, near-mandatory in practice at high rates).</li>
<li><b>5G-NR data (shared) channel</b> — QC-LDPC with base graphs BG1 (high rate) and BG2 (low rate/short block), supporting HARQ incremental redundancy.</li>
<li><b>DVB-S2/S2X</b> satellite TV — long (64800-bit) LDPC concatenated with an outer BCH code to scrub the error floor.</li>
<li><b>10GBASE-T</b> (10-gigabit Ethernet over copper) — a (2048,1723) LDPC.</li>
<li>Also NAND flash storage, hard-drive read channels, and CCSDS space links.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`An LDPC code is a linear block code defined by a <b>sparse</b> parity-check matrix $\mathbf H$: a vector is a codeword iff $\mathbf H\mathbf c^{\mathsf T}=\mathbf 0\ (\mathrm{mod}\ 2)$.`,
    String.raw`"Low density" = a small, constant number of 1s per row/column regardless of block length, so the fraction of 1s $\to 0$ as $n$ grows.`,
    String.raw`The <b>Tanner graph</b> is bipartite: variable nodes (bits/columns) and check nodes (parities/rows); an edge exists iff $H_{ij}=1$.`,
    String.raw`<b>Regular</b> $(d_v,d_c)$ codes have fixed node degrees; <b>irregular</b> codes vary degrees ($\lambda,\rho$) and can reach within hundredths of a dB of capacity.`,
    String.raw`Decoding is <b>belief propagation</b> (sum-product): VN update adds LLRs (extrinsic), CN update combines via $\tanh$ soft-XOR; iterate until $\mathbf H\hat{\mathbf c}^{\mathsf T}=\mathbf 0$.`,
    String.raw`<b>Min-sum</b> approximates the check update by (XOR of signs) × (min of magnitudes) — the "weakest-link" rule; normalized/offset min-sum recovers most SPA gain cheaply.`,
    String.raw`BP is exact only on a <b>tree</b>; real graphs have cycles, so <b>girth</b> matters — avoid girth-4 (no two columns sharing two 1s) to keep messages decorrelated.`,
    String.raw`The <b>error floor</b> comes mainly from <b>trapping/absorbing sets</b> (small self-sustaining error clusters via short cycles), not just minimum distance; good graph design lowers it.`,
    String.raw`Rate $R=k/n=1-m/n$; higher rates by puncturing, lower by extending — 5G base graphs support HARQ incremental redundancy this way.`,
    String.raw`Sparse $\mathbf H$ makes decoding cheap but encoding awkward; <b>quasi-cyclic (QC)</b> and IRA/lower-triangular structures give near-linear encoding and massive decoder parallelism.`,
    String.raw`Invented by <b>Gallager (1962)</b>, forgotten, <b>rediscovered ~1996 by MacKay</b> and others; irregular LDPC holds some of the tightest capacity-gap records.`,
    String.raw`Deployed in Wi-Fi (802.11n/ac/ax), 5G-NR data channel, DVB-S2/S2X (with outer BCH), and 10GBASE-T; chosen over turbo for throughput, parallelism, and low floor.`
  ],
  equations: [
    {
      title: 'Codeword / parity-check condition',
      tex: String.raw`$$ \mathbf H\,\mathbf c^{\mathsf T}=\mathbf 0 \pmod 2 $$`,
      derivation: String.raw`<p><b>Where we start.</b> A linear block code is a $k$-dimensional subspace of the $n$-dimensional binary vector space $\mathbb F_2^n$. We need a compact test for "is this vector a codeword?"</p>
<p><b>Step 1 — the code as a null space.</b> Because the code is a linear subspace of dimension $k$, it is exactly the set of vectors annihilated by some set of $m=n-k$ linear constraints. Stack those constraints as rows of a matrix $\mathbf H$ ($m\times n$). By construction, every codeword $\mathbf c$ satisfies each constraint:</p>
$$ \mathbf H\,\mathbf c^{\mathsf T}=\mathbf 0 \pmod 2 $$
<p><b>Step 2 — read one row.</b> Row $i$ of $\mathbf H$ has 1s in the positions of the bits it checks. The $i$-th equation says the modulo-2 sum (XOR) of exactly those bits is zero — a single-parity constraint. So $\mathbf H$ is literally a list of parity checks.</p>
<p><b>Step 3 — the generator relationship.</b> The codewords are generated by $\mathbf c=\mathbf u\mathbf G$ for message $\mathbf u$, where $\mathbf G$ is $k\times n$. Consistency requires every generated word to satisfy the checks, i.e. $\mathbf G\mathbf H^{\mathsf T}=\mathbf 0$. $\mathbf G$ and $\mathbf H$ are the two dual views of the same code.</p>
<p><b>Result.</b> $$ \mathbf c \text{ is a codeword} \iff \mathbf H\,\mathbf c^{\mathsf T}=\mathbf 0. $$ For LDPC, the crucial extra property is that $\mathbf H$ is <b>sparse</b> — few 1s per row/column — so each parity check involves only a handful of bits, which is exactly what makes local message-passing decoding cheap.</p>`
    },
    {
      title: 'Syndrome detects errors',
      tex: String.raw`$$ \mathbf s=\mathbf H\,\mathbf r^{\mathsf T}=\mathbf H(\mathbf c\oplus\mathbf e)^{\mathsf T}=\mathbf H\,\mathbf e^{\mathsf T} $$`,
      derivation: String.raw`<p><b>Where we start.</b> The transmitted codeword $\mathbf c$ is corrupted by an unknown error pattern $\mathbf e$ (a 1 where a bit flipped), giving the received word $\mathbf r=\mathbf c\oplus\mathbf e$. We want a quantity that reveals the error while ignoring which codeword was sent.</p>
<p><b>Step 1 — apply the parity-check matrix.</b> Compute the <b>syndrome</b> $\mathbf s=\mathbf H\mathbf r^{\mathsf T}$. Substitute $\mathbf r=\mathbf c\oplus\mathbf e$ and use linearity over $\mathbb F_2$:</p>
$$ \mathbf s=\mathbf H(\mathbf c\oplus\mathbf e)^{\mathsf T}=\mathbf H\mathbf c^{\mathsf T}\oplus\mathbf H\mathbf e^{\mathsf T} $$
<p><b>Step 2 — kill the codeword term.</b> Since $\mathbf c$ is a valid codeword, $\mathbf H\mathbf c^{\mathsf T}=\mathbf 0$. It vanishes, leaving:</p>
$$ \mathbf s=\mathbf H\,\mathbf e^{\mathsf T} $$
<p><b>Meaning.</b> The syndrome depends <b>only on the error pattern</b>, not on the data. If $\mathbf s=\mathbf 0$, either no error occurred or the error is itself a codeword (undetectable). If $\mathbf s\ne\mathbf 0$, an error is <b>detected</b>, and the specific pattern of failed checks (which rows are 1) constrains where the error is.</p>
<p><b>Result.</b> $$ \mathbf s=\mathbf H\,\mathbf e^{\mathsf T}. $$ Hard-decision decoding tries to find the lowest-weight $\mathbf e$ consistent with the observed $\mathbf s$. Soft-decision <b>belief propagation</b> generalizes this: instead of a binary pass/fail per check, each check node passes probabilistic (LLR) messages, letting the decoder correct errors that a hard syndrome could only detect.</p>`
    },
    {
      title: 'Variable-node (bit) update',
      tex: String.raw`$$ L_{j\to i}=L_j+\!\!\sum_{i'\in N(j)\setminus i}\!\! L_{i'\to j} $$`,
      derivation: String.raw`<p><b>Where we start.</b> Variable node $j$ (a code bit) receives the channel LLR $L_j$ and messages $L_{i'\to j}$ from each check $i'$ it participates in. It must tell a particular check $i$ its best belief about the bit — but built only from <i>other</i> evidence (extrinsic).</p>
<p><b>Step 1 — assume independent messages.</b> On a tree (locally cycle-free) graph, the incoming messages from different checks come from <b>disjoint</b> parts of the graph, hence are statistically <b>independent</b> observations of the same bit $c_j$.</p>
<p><b>Step 2 — combine independent evidence.</b> Independent evidence about one bit multiplies in probability, i.e. <b>adds in the LLR domain</b> (from the LLR-additivity property). Summing the channel LLR and all incoming check messages gives the bit's total belief:</p>
$$ L_j^{\text{tot}}=L_j+\sum_{i'\in N(j)}L_{i'\to j} $$
<p><b>Step 3 — make it extrinsic.</b> The message <i>to</i> check $i$ must exclude the message that <i>came from</i> check $i$ — otherwise we would feed $i$'s own belief back to it, creating self-reinforcement around the cycle. So drop the $i$ term:</p>
$$ L_{j\to i}=L_j+\sum_{i'\in N(j)\setminus i}L_{i'\to j} $$
<p><b>Result.</b> $$ L_{j\to i}=L_j+\sum_{i'\ne i}L_{i'\to j}. $$ The variable node is simply an <b>adder</b> that accumulates independent LLR evidence, leaving out the recipient's own contribution. This "sum" is one half of the sum-<i>product</i> algorithm's name.</p>`
    },
    {
      title: 'Check-node update (tanh rule)',
      tex: String.raw`$$ \tanh\!\frac{L_{i\to j}}{2}=\!\!\prod_{j'\in N(i)\setminus j}\!\!\tanh\!\frac{L_{j'\to i}}{2} $$`,
      derivation: String.raw`<p><b>Where we start.</b> Check node $i$ enforces $c_{j}\oplus\bigoplus_{j'\ne j}c_{j'}=0$, i.e. $c_j=\bigoplus_{j'\ne j}c_{j'}$. Given the (soft) beliefs about the other bits, what does the check say about $c_j$?</p>
<p><b>Step 1 — soft-XOR of two bits.</b> For two independent bits with $P(\text{bit}=0)=p_1,p_2$, the XOR equals 0 with probability $p_1p_2+(1-p_1)(1-p_2)$. Define $\mu=P(0)-P(1)=1-2P(1)$ (the "soft value," in $[-1,1]$). A short calculation shows the XOR's soft value is the <b>product</b>: $\mu_{\oplus}=\mu_1\mu_2$.</p>
<p><b>Step 2 — connect $\mu$ to the LLR.</b> With $L=\ln\frac{P(0)}{P(1)}$, we have $P(1)=\frac{1}{1+e^{L}}$, so $\mu=1-2P(1)=\tanh(L/2)$. This is the key change of variables: the soft value of a bit is $\tanh(L/2)$.</p>
<p><b>Step 3 — extend to many bits.</b> XOR is associative, so the soft value of the XOR of all the <i>other</i> bits is the product of their soft values. Translating back through $\mu=\tanh(L/2)$:</p>
$$ \tanh\!\frac{L_{i\to j}}{2}=\prod_{j'\in N(i)\setminus j}\tanh\!\frac{L_{j'\to i}}{2} $$
<p><b>Meaning.</b> Because $|\tanh(\cdot)|\le1$, the product is dominated by the term closest to zero — the <b>least reliable</b> neighbour. A check is only as sure about $c_j$ as it is about the flimsiest of the other bits: the "weakest-link" rule.</p>
<p><b>Result.</b> $$ L_{i\to j}=2\,\operatorname{atanh}\!\Big(\prod_{j'\ne j}\tanh\tfrac{L_{j'\to i}}{2}\Big). $$ This is the "product" half of sum-product. Its domination by the smallest term is exactly what the min-sum approximation exploits.</p>`
    },
    {
      title: 'Min-sum approximation',
      tex: String.raw`$$ L_{i\to j}\approx\Big(\prod_{j'\ne j}\operatorname{sign}L_{j'\to i}\Big)\min_{j'\ne j}\bigl|L_{j'\to i}\bigr| $$`,
      derivation: String.raw`<p><b>Where we start.</b> The exact check update needs a product of $\tanh$s and an $\operatorname{atanh}$ — transcendental, scaling-sensitive, expensive in hardware. We want a cheap, near-equivalent rule.</p>
<p><b>Step 1 — separate sign and magnitude.</b> Write each incoming message as $L_{j'\to i}=\operatorname{sign}(L_{j'\to i})\,|L_{j'\to i}|$. Because $\tanh$ is odd, the <b>sign</b> of the output is just the product (XOR) of the input signs:</p>
$$ \operatorname{sign}(L_{i\to j})=\prod_{j'\ne j}\operatorname{sign}(L_{j'\to i}) $$
<p><b>Step 2 — approximate the magnitude.</b> For the magnitudes, note $\tanh|x|$ increases toward 1 and <b>saturates</b>: once $|x|$ is moderately large, $\tanh|x|\approx1$ and it barely affects the product. So the product $\prod\tanh(|L|/2)$ is controlled by its <b>smallest</b> argument. Passing back through $\operatorname{atanh}$, the output magnitude is therefore approximately the <b>minimum</b> incoming magnitude:</p>
$$ |L_{i\to j}|\approx\min_{j'\ne j}|L_{j'\to i}| $$
<p><b>Step 3 — assemble.</b> Combine the exact sign rule with the min magnitude rule:</p>
$$ L_{i\to j}\approx\Big(\prod_{j'\ne j}\operatorname{sign}L_{j'\to i}\Big)\min_{j'\ne j}\bigl|L_{j'\to i}\bigr| $$
<p><b>Result & fix-up.</b> This <b>min-sum</b> rule uses only comparisons and sign XORs. It slightly <b>overestimates</b> reliability (the true product is a bit smaller than the min), so practical decoders apply <b>normalized min-sum</b> ($\times\alpha$, $\alpha\approx0.8$) or <b>offset min-sum</b> ($|L|\to\max(|L|-\beta,0)$), recovering to within ~0.1 dB of full sum-product at a fraction of the cost. This is the workhorse check-node update in modern LDPC silicon.</p>`
    },
    {
      title: 'Channel LLR initialization (BPSK/AWGN)',
      tex: String.raw`$$ L_j=\frac{2}{\sigma^2}\,y_j $$`,
      derivation: String.raw`<p><b>Where we start.</b> Belief propagation needs an initial LLR for each bit from the channel. For BPSK over AWGN, bit $c_j$ is mapped to $x_j=1-2c_j\in\{+1,-1\}$ and received as $y_j=x_j+n_j$, $n_j\sim\mathcal N(0,\sigma^2)$.</p>
<p><b>Step 1 — two Gaussian likelihoods.</b> Under $c_j=0$ (so $x_j=+1$) and $c_j=1$ (so $x_j=-1$):</p>
$$ p(y_j\mid c_j=0)\propto e^{-\frac{(y_j-1)^2}{2\sigma^2}},\qquad p(y_j\mid c_j=1)\propto e^{-\frac{(y_j+1)^2}{2\sigma^2}} $$
<p><b>Step 2 — take the log-ratio.</b> $L_j=\ln\frac{P(c_j=0\mid y_j)}{P(c_j=1\mid y_j)}$. With equal priors the constants cancel and only the exponents remain:</p>
$$ L_j=-\frac{(y_j-1)^2}{2\sigma^2}+\frac{(y_j+1)^2}{2\sigma^2}=\frac{(y_j+1)^2-(y_j-1)^2}{2\sigma^2} $$
<p><b>Step 3 — simplify.</b> $(y_j+1)^2-(y_j-1)^2=4y_j$, so</p>
$$ L_j=\frac{4y_j}{2\sigma^2}=\frac{2}{\sigma^2}\,y_j $$
<p><b>Result.</b> $$ L_j=\frac{2}{\sigma^2}y_j. $$ Each bit's decoder starts from its received sample scaled by the channel reliability $2/\sigma^2$ (large when noise is small). These channel LLRs seed the variable nodes; message passing then refines them using the parity constraints. Getting the scale right matters for sum-product; min-sum is largely invariant to it.</p>`
    },
    {
      title: 'Code rate from H',
      tex: String.raw`$$ R=\frac{k}{n}=\frac{n-m}{n}=1-\frac{m}{n} $$`,
      derivation: String.raw`<p><b>Where we start.</b> $\mathbf H$ is $m\times n$: $n$ code bits, $m$ parity checks. We want the fraction of transmitted bits that carry <i>information</i>.</p>
<p><b>Step 1 — count degrees of freedom.</b> The codewords form the null space of $\mathbf H$. If $\mathbf H$ has full row rank $m$ (its rows are linearly independent), the rank–nullity theorem gives the code dimension:</p>
$$ k=\dim(\text{null space})=n-\operatorname{rank}(\mathbf H)=n-m $$
<p>So there are $k=n-m$ free message bits and $m$ redundant (parity) bits.</p>
<p><b>Step 2 — form the rate.</b> Rate is information bits per transmitted bit:</p>
$$ R=\frac{k}{n}=\frac{n-m}{n}=1-\frac{m}{n} $$
<p><b>Step 3 — the rank caveat.</b> If the rows of $\mathbf H$ are <i>not</i> all independent (rank $<m$), the true $k=n-\operatorname{rank}(\mathbf H)>n-m$, so the <b>design rate</b> $1-m/n$ is a lower bound on the actual rate. LDPC designers usually arrange near-full-rank $\mathbf H$ so the design rate is accurate.</p>
<p><b>Result.</b> $$ R=1-\frac{m}{n}. $$ More checks (larger $m$) $\Rightarrow$ lower rate and stronger protection. Puncturing raises the effective rate by transmitting fewer bits; extending $\mathbf H$ with extra parity rows lowers it — the mechanism behind rate-compatible LDPC and HARQ.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What defines an LDPC code?`, back: String.raw`A linear block code whose parity-check matrix $\mathbf H$ is <b>sparse</b> (low density of 1s). A vector $\mathbf c$ is a codeword iff $\mathbf H\mathbf c^{\mathsf T}=\mathbf 0\ (\mathrm{mod}\ 2)$. Sparsity = a small constant number of 1s per row/column independent of block length.` },
    { front: String.raw`What is the Tanner graph?`, back: String.raw`A bipartite graph with <b>variable nodes</b> (one per bit / column of $\mathbf H$) and <b>check nodes</b> (one per parity / row of $\mathbf H$). An edge connects VN $j$ to CN $i$ iff $H_{ij}=1$. Decoding = message passing along edges.` },
    { front: String.raw`Regular vs irregular LDPC?`, back: String.raw`<b>Regular</b> $(d_v,d_c)$: every column has $d_v$ ones and every row $d_c$ ones (fixed degrees). <b>Irregular</b>: node degrees vary (distributions $\lambda,\rho$); optimizing them reaches within hundredths of a dB of capacity, beating regular and turbo.` },
    { front: String.raw`Write the variable-node (bit) update in BP.`, back: String.raw`$L_{j\to i}=L_j+\sum_{i'\in N(j)\setminus i}L_{i'\to j}$: channel LLR plus all incoming check messages <b>except</b> the recipient's (extrinsic). A bit accumulates independent evidence by adding LLRs.` },
    { front: String.raw`Write the check-node update (tanh rule).`, back: String.raw`$\tanh\frac{L_{i\to j}}{2}=\prod_{j'\in N(i)\setminus j}\tanh\frac{L_{j'\to i}}{2}$. A soft-XOR: reliabilities multiply, so the output is dominated by the least-reliable neighbour ("weakest link").` },
    { front: String.raw`What is the min-sum approximation?`, back: String.raw`$L_{i\to j}\approx(\prod\operatorname{sign})\cdot\min|L|$: outgoing sign = XOR of incoming signs, outgoing magnitude = minimum incoming magnitude. It slightly overestimates reliability; fixed by normalized ($\times\alpha$) or offset min-sum.` },
    { front: String.raw`Why do girth and short cycles matter?`, back: String.raw`BP is exact only on trees. Cycles correlate messages that should be independent; <b>girth-4</b> cycles are worst (a message quickly reinforces itself). Good designs maximize girth — e.g. no two columns of $\mathbf H$ share two 1s.` },
    { front: String.raw`What is the syndrome and what does it tell you?`, back: String.raw`$\mathbf s=\mathbf H\mathbf r^{\mathsf T}=\mathbf H\mathbf e^{\mathsf T}$ (depends only on the error, not the data). $\mathbf s=\mathbf 0\Rightarrow$ valid codeword; $\mathbf s\ne\mathbf 0\Rightarrow$ error detected, and the failed-check pattern locates it.` },
    { front: String.raw`What causes the LDPC error floor?`, back: String.raw`Mainly <b>trapping / absorbing sets</b>: small clusters of variable nodes that, once in error, sustain each other via short cycles and defeat iterative decoding — not just minimum distance. High girth and careful construction lower the floor.` },
    { front: String.raw`Give the code rate in terms of H.`, back: String.raw`$R=k/n=(n-m)/n=1-m/n$ for full-rank $\mathbf H$ ($m$ = number of checks/rows, $n$ = block length). More checks $\Rightarrow$ lower rate, more protection.` },
    { front: String.raw`Why is LDPC encoding awkward, and how is it fixed?`, back: String.raw`Sparse $\mathbf H$ gives a <b>dense</b> generator $\mathbf G$, so naïve encoding is $O(n^2)$. Fixes: <b>quasi-cyclic (QC)</b> structure (circulant blocks) and approximate-lower-triangular / IRA structure for near-linear encoding — used in 5G, Wi-Fi, DVB-S2.` },
    { front: String.raw`Who invented and rediscovered LDPC codes?`, back: String.raw`Invented by <b>Robert Gallager</b> in his 1962 MIT PhD thesis; ignored for ~30 years; <b>rediscovered ~1996 by David MacKay</b> (and others) after the turbo-code revival showed iterative decoding was practical.` },
    { front: String.raw`How does LDPC compare with turbo for parallelism and error floor?`, back: String.raw`LDPC updates all nodes in parallel (very high throughput) and typically has a <b>lower error floor</b>; turbo's trellis passes are more serial and its floor can be higher. This drove 5G-NR to pick LDPC for data.` },
    { front: String.raw`Where are LDPC codes deployed?`, back: String.raw`Wi-Fi 802.11n/ac/ax, <b>5G-NR data channel</b> (QC-LDPC base graphs BG1/BG2), DVB-S2/S2X satellite TV (with outer BCH), 10GBASE-T Ethernet, NAND flash, and space (CCSDS).` },
    { front: String.raw`What is density evolution used for?`, back: String.raw`It tracks the message distributions over iterations (assuming an infinite cycle-free graph) to find the <b>decoding threshold</b> — the channel quality above which error probability $\to 0$. Optimizing degree distributions to push this threshold toward capacity yields record codes.` },
    { front: String.raw`How is early termination done in BP decoding?`, back: String.raw`After each iteration, form total LLRs, make a tentative hard decision $\hat{\mathbf c}$, and test $\mathbf H\hat{\mathbf c}^{\mathsf T}=\mathbf 0$. If all parity checks pass, stop immediately; otherwise iterate up to a max (typically 20–50).` }
  ],
  mcqs: [
    { q: String.raw`"Low density" in LDPC refers to:`, options: [String.raw`low code rate`, String.raw`few 1s per row/column of $\mathbf H$ regardless of block length`, String.raw`low transmit power`, String.raw`a small number of codewords`], answer: 1, explain: String.raw`The parity-check matrix is sparse — a small constant number of 1s per row/column — so the fraction of 1s vanishes as the block grows. Sparsity enables efficient graph decoding.` },
    { q: String.raw`In the Tanner graph, an edge between variable node $j$ and check node $i$ exists iff:`, options: [String.raw`$G_{ij}=1$`, String.raw`$H_{ij}=1$`, String.raw`bit $j$ equals check $i$`, String.raw`$i=j$`], answer: 1, explain: String.raw`Edges of the bipartite Tanner graph correspond exactly to the 1s of $\mathbf H$: bit $j$ participates in parity check $i$.` },
    { q: String.raw`Belief propagation is exactly optimal only when the Tanner graph is:`, options: [String.raw`fully connected`, String.raw`a tree (cycle-free)`, String.raw`regular`, String.raw`quasi-cyclic`], answer: 1, explain: String.raw`BP is exact on trees; cycles correlate messages and make it approximate. Hence designs maximize girth and avoid girth-4.` },
    { q: String.raw`The variable-node update in sum-product decoding:`, options: [String.raw`multiplies incoming check messages`, String.raw`adds the channel LLR and all incoming check messages except the recipient's`, String.raw`takes the minimum of incoming messages`, String.raw`XORs the signs`], answer: 1, explain: String.raw`Independent evidence adds in the LLR domain; the message to a check excludes that check's own message (extrinsic).` },
    { q: String.raw`The check-node (tanh) update behaves like a:`, options: [String.raw`hard majority vote`, String.raw`soft-XOR dominated by the least-reliable neighbour`, String.raw`simple LLR sum`, String.raw`matched filter`], answer: 1, explain: String.raw`$\prod\tanh(L/2)$ implements a soft parity (XOR) constraint; since $|\tanh|\le1$, the smallest-magnitude (least reliable) term dominates — the weakest-link rule.` },
    { q: String.raw`The min-sum approximation replaces the check update with:`, options: [String.raw`(sum of magnitudes) × (product of signs)`, String.raw`(XOR of signs) × (minimum of magnitudes)`, String.raw`(max of magnitudes) × (sum of signs)`, String.raw`the channel LLR unchanged`], answer: 1, explain: String.raw`Output sign = product/XOR of incoming signs; output magnitude ≈ minimum incoming magnitude, because $\tanh$ saturation makes the smallest term dominate.` },
    { q: String.raw`A girth-4 cycle in the Tanner graph is undesirable because it:`, options: [String.raw`increases the code rate`, String.raw`quickly correlates messages, hurting BP accuracy and raising the floor`, String.raw`makes encoding impossible`, String.raw`reduces the block length`], answer: 1, explain: String.raw`Short cycles let a message circle back and reinforce itself, breaking the independence BP assumes. Avoiding girth-4 (no two columns sharing two 1s) improves performance.` },
    { q: String.raw`The syndrome $\mathbf s=\mathbf H\mathbf r^{\mathsf T}$ of a received word equals:`, options: [String.raw`$\mathbf H\mathbf c^{\mathsf T}$`, String.raw`$\mathbf H\mathbf e^{\mathsf T}$ (depends only on the error)`, String.raw`always zero`, String.raw`the transmitted message`], answer: 1, explain: String.raw`With $\mathbf r=\mathbf c\oplus\mathbf e$ and $\mathbf H\mathbf c^{\mathsf T}=\mathbf 0$, the syndrome reduces to $\mathbf H\mathbf e^{\mathsf T}$ — a function of the error pattern alone.` },
    { q: String.raw`The LDPC error floor is caused primarily by:`, options: [String.raw`thermal noise in the LNA`, String.raw`trapping/absorbing sets sustained by short cycles`, String.raw`too high a code rate`, String.raw`the channel LLR scaling`], answer: 1, explain: String.raw`Small self-sustaining error clusters (trapping/absorbing sets) defeat the iterative decoder at high SNR; good graph construction and high girth push the floor down.` },
    { q: String.raw`For a full-rank $\mathbf H$ of size $m\times n$, the code rate is:`, options: [String.raw`$m/n$`, String.raw`$1-m/n$`, String.raw`$m/(n-m)$`, String.raw`$n/m$`], answer: 1, explain: String.raw`$k=n-m$ information bits, so $R=k/n=1-m/n$. More checks (larger $m$) means lower rate and more protection.` },
    { q: String.raw`LDPC encoding is awkward because a sparse $\mathbf H$ generally yields:`, options: [String.raw`a sparse generator $\mathbf G$`, String.raw`a dense generator $\mathbf G$, making naïve encoding $O(n^2)$`, String.raw`no valid codewords`, String.raw`an unstable decoder`], answer: 1, explain: String.raw`Gaussian elimination on a sparse $\mathbf H$ usually gives a dense $\mathbf G$. Quasi-cyclic and lower-triangular/IRA structures restore near-linear encoding.` },
    { q: String.raw`Who first invented LDPC codes, and when were they rediscovered?`, options: [String.raw`Berrou (1993), rediscovered 2000`, String.raw`Gallager (1962), rediscovered ~1996 by MacKay`, String.raw`Viterbi (1967), rediscovered 1980`, String.raw`Shannon (1948), rediscovered 1970`], answer: 1, explain: String.raw`Gallager's 1962 thesis introduced them; they were shelved until MacKay (and others) rediscovered them around 1996 after turbo codes revived iterative decoding.` },
    { q: String.raw`Which system uses LDPC on its high-throughput data channel?`, options: [String.raw`GSM voice`, String.raw`5G-NR (QC-LDPC, base graphs BG1/BG2)`, String.raw`Bluetooth Basic Rate`, String.raw`analog FM broadcast`], answer: 1, explain: String.raw`5G-NR uses quasi-cyclic LDPC for its shared data channel; turbo was retained in LTE but replaced for the new radio.` },
    { q: String.raw`Compared with turbo codes, LDPC codes generally offer:`, options: [String.raw`less parallelism and higher error floor`, String.raw`higher decoder parallelism and typically a lower error floor`, String.raw`no soft-decision capability`, String.raw`worse performance at all block lengths`], answer: 1, explain: String.raw`All nodes can update in parallel (great for high throughput) and good LDPC designs have lower floors — key reasons 5G-NR chose LDPC for data.` },
    { q: String.raw`DVB-S2 concatenates its long LDPC with an outer code to:`, options: [String.raw`increase the data rate`, String.raw`scrub the residual error floor (outer BCH)`, String.raw`replace the interleaver`, String.raw`perform carrier recovery`], answer: 1, explain: String.raw`An outer BCH code cleans up the rare residual errors below the LDPC error floor, giving very low output BER for broadcast video.` },
    { q: String.raw`Early termination of BP decoding is triggered when:`, options: [String.raw`a fixed 50 iterations are done`, String.raw`the tentative hard decision satisfies $\mathbf H\hat{\mathbf c}^{\mathsf T}=\mathbf 0$`, String.raw`the channel LLRs are all positive`, String.raw`the syndrome is nonzero`], answer: 1, explain: String.raw`If all parity checks pass on the current hard decision, a valid codeword has been found and decoding can stop immediately, saving power and latency.` }
  ],
  numericals: [
    { q: String.raw`A regular $(3,6)$ LDPC code has $n=1000$ variable nodes. How many check nodes $m$ are there, and what is the design rate? (Each of the $n$ columns has 3 ones; each row has 6 ones.)`, solution: String.raw`Total edges from the variable side $=n\times d_v=1000\times3=3000$. Each check node has $d_c=6$ edges, so $m=3000/6=500$ check nodes. Design rate $R=1-m/n=1-500/1000=0.5$. (Consistent: for a regular code, $R=1-d_v/d_c=1-3/6=1/2$.)` },
    { q: String.raw`Using $\mathbf H=\begin{bmatrix}1&1&0&1&0&0\\0&1&1&0&1&0\\1&0&1&0&0&1\end{bmatrix}$, compute the syndrome of $\mathbf r=(1,1,0,0,1,0)$ and state whether it is a codeword.`, solution: String.raw`$s_1=r_1\oplus r_2\oplus r_4=1\oplus1\oplus0=0$. $s_2=r_2\oplus r_3\oplus r_5=1\oplus0\oplus1=0$. $s_3=r_1\oplus r_3\oplus r_6=1\oplus0\oplus0=1$. Syndrome $=(0,0,1)\ne\mathbf 0\Rightarrow$ NOT a codeword; check 3 fails, so an error is detected (bit involved only in check 3 that could fix it is $c_6$).` },
    { q: String.raw`Two incoming variable-to-check messages to a degree-3 check are $L_1=+2.0$ and $L_2=-1.2$. Using min-sum, find the outgoing message to the third bit.`, solution: String.raw`Sign $=\operatorname{sign}(L_1)\times\operatorname{sign}(L_2)=(+)(-)=-$. Magnitude $=\min(|L_1|,|L_2|)=\min(2.0,1.2)=1.2$. Outgoing message $L_{i\to3}\approx-1.2$. (Exact tanh rule would give a slightly smaller magnitude; min-sum overestimates.)` },
    { q: String.raw`Compute the exact check-node output for the same two messages ($L_1=+2.0$, $L_2=-1.2$) using the tanh rule, and compare with min-sum.`, solution: String.raw`$\tanh(2.0/2)=\tanh(1.0)=0.7616$; $\tanh(-1.2/2)=\tanh(-0.6)=-0.5370$. Product $=0.7616\times(-0.5370)=-0.4090$. Output $=2\,\operatorname{atanh}(-0.4090)=2\times(-0.4340)=-0.868$. Min-sum gave $-1.2$, confirming min-sum <b>overestimates</b> reliability ($|{-0.868}|<|{-1.2}|$); a normalization factor $\alpha\approx0.72$ here would reconcile them.` },
    { q: String.raw`A variable node has channel LLR $L_j=+0.5$ and receives check messages $+1.0$, $-0.3$, and $+0.8$ from its three checks. Find the total LLR and the extrinsic message it sends back to the third check.`, solution: String.raw`Total $L_j^{\text{tot}}=0.5+1.0+(-0.3)+0.8=+2.0\Rightarrow$ hard decision bit = 0 (positive), confident. Extrinsic to check 3 excludes check 3's own $+0.8$: $L_{j\to3}=0.5+1.0-0.3=+1.2$.` },
    { q: String.raw`A BPSK/AWGN channel has $E_b/N_0=2$ (linear) for a rate-1/2 code, giving $\sigma^2=1/(2R\,E_b/N_0)=1/(2\times0.5\times2)=0.5$. A received sample is $y_j=-0.9$. Give the initial channel LLR and tentative bit.`, solution: String.raw`$L_j=(2/\sigma^2)y_j=(2/0.5)\times(-0.9)=4\times(-0.9)=-3.6$. Negative LLR $\Rightarrow$ tentative $c_j=1$, with high reliability $|L|=3.6$.` },
    { q: String.raw`An irregular LDPC code has variable-node edge-degree distribution meaning 40% of edges connect to degree-2 nodes and 60% to degree-3 nodes; check nodes are all degree 6. If there are $E=6000$ edges total, how many check nodes are there?`, solution: String.raw`All edges also land on check nodes; each check has degree 6, so $m=E/d_c=6000/6=1000$ check nodes. (The variable-side distribution does not change the check-node count once total edges $E$ is fixed.)` },
    { q: String.raw`A rate-1/2 mother LDPC code of length $n=2000$ is punctured to transmit only 1500 of its coded bits. What is the effective transmitted rate?`, solution: String.raw`Information bits $k=Rn=0.5\times2000=1000$ (unchanged by puncturing). Transmitted bits $=1500$. Effective rate $=k/\text{transmitted}=1000/1500=2/3\approx0.667$. Puncturing raised the rate from 1/2 to 2/3 by sending fewer parity bits (decoder inserts LLR = 0 for punctured positions).` }
  ],
  realWorld: String.raw`<p>LDPC codes are the quiet workhorses behind modern high-speed links. Every time a phone streams over <b>Wi-Fi 5/6</b> (802.11ac/ax) at hundreds of Mb/s, an LDPC decoder is correcting the channel in real time; the massively parallel Tanner-graph update is precisely what lets silicon hit those rates at low latency. <b>5G-NR</b> made LDPC the code for its data (shared) channel, using quasi-cyclic base graphs BG1 (high rate, long blocks) and BG2 (low rate, short blocks) that support HARQ incremental redundancy — retransmissions add extra parity rather than repeating the packet. <b>DVB-S2/S2X</b> beams satellite television to millions of homes using enormous length-64800 LDPC codes concatenated with an outer BCH code that scrubs the residual error floor, delivering essentially error-free video within a fraction of a dB of the Shannon limit on a power-limited transponder. <b>10GBASE-T</b> pushes 10 Gb/s over twisted-pair copper only because a (2048,1723) LDPC tames the crosstalk and echo. The same codes protect data in <b>NAND flash</b> memory and hard-disk read channels, where soft LDPC decoding wrings extra years of endurance out of wearing cells, and in <b>CCSDS</b> deep-space standards. The through-line is the 1962 insight, dormant for thirty years, that a <i>sparse</i> graph plus <i>local</i> message passing is all you need to touch the Shannon limit — an idea whose time finally came when the transistors caught up.</p>`,
  related: ['channel-coding', 'fec', 'turbo-codes', 'shannon', 'convolutional-codes']
}
);
