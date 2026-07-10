/* optimal-receiver.js — "Optimal Receiver" topic (Modulation & Detection).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   All text in String.raw; no literal backticks, no "$"+"{" sequence. */
CONTENT.topics.push(
  {
    id: 'optimal-receiver',
    title: 'Optimal Receiver',
    category: 'Modulation & Detection',
    tags: ['detection', 'map', 'ml', 'decision-regions', 'signal-space', 'sufficient-statistic', 'union-bound'],
    summary: String.raw`The optimal receiver minimizes error probability by reducing the received waveform to sufficient statistics (a bank of correlators / matched filters) and picking the hypothesis with the largest posterior — the MAP rule, which collapses to minimum-distance ML detection for equiprobable, equal-energy signals in AWGN.`,
    prerequisites: ['matched-filter', 'awgn', 'comm-basics'],
    intro: String.raw`<p><strong>Why does an "optimal" receiver exist at all?</strong> Once a pulse leaves the transmitter and crosses a noisy channel, the receiver faces a decision problem: given a smeared, noise-corrupted waveform, which of the possible messages was actually sent? There are infinitely many ways to process that waveform before deciding — so is there a single processing rule that is provably better than every other? The answer is yes, and it is remarkably clean: compute how likely each candidate message is given what you received, weight by how likely each message was to begin with, and choose the winner. Everything else — matched filters, correlators, decision thresholds, minimum-distance rules — falls out of that one principle.</p>
<p>The optimal receiver is the structure that <em>minimizes the probability of a wrong decision</em>. Its criterion is <strong>maximum a posteriori (MAP)</strong> detection: choose the message with the largest posterior probability $P(s_m\mid r)$. When all messages are equally likely, MAP reduces to <strong>maximum likelihood (ML)</strong>; and in additive white Gaussian noise (AWGN), ML reduces to the intuitive <strong>minimum-distance</strong> rule — pick the constellation point closest to the received point in signal space.</p>
<p>This topic ties the matched filter, signal-space geometry, decision regions, and the $Q$-function error formulas into one framework. Understanding it lets you predict the error rate of <em>any</em> signal set from a single picture (the constellation and its distances) rather than memorizing a separate BER formula per modulation.</p>`,
    sections: [
      {
        h: 'What "Optimal" Means: the MAP Criterion',
        html: String.raw`<p>The receiver observes $r$ (a waveform, or equivalently a vector of numbers derived from it) and must decide which of $M$ possible signals $s_1,\dots,s_M$ was transmitted. "Optimal" means the decision rule that minimizes the average probability of error $P(e)$. Equivalently it <em>maximizes</em> the probability of being correct, $P(c)=\int P(\text{correct}\mid r)\,p(r)\,dr$. Because $p(r)\ge 0$, we maximize $P(c)$ by maximizing $P(\text{correct}\mid r)$ pointwise for every observed $r$ — i.e., for each $r$ we should announce the message that is most probable given that $r$.</p>
<p>That is the <strong>MAP rule</strong>:</p>
<p>$$\hat m=\arg\max_{m}\ P(s_m\mid r).$$</p>
<p>Using Bayes' theorem, $P(s_m\mid r)=\dfrac{p(r\mid s_m)\,P(s_m)}{p(r)}$. The denominator $p(r)$ does not depend on $m$, so it drops out of the maximization:</p>
<p>$$\hat m=\arg\max_{m}\ \underbrace{p(r\mid s_m)}_{\text{likelihood}}\,\underbrace{P(s_m)}_{\text{prior}}.$$</p>
<div class="callout"><strong>The whole subject in one line:</strong> pick the hypothesis with the biggest (likelihood × prior). Everything below is just evaluating this for AWGN.</div>`
      },
      {
        h: 'From Waveforms to Numbers: Sufficient Statistics',
        html: String.raw`<p>A continuous waveform lives in an infinite-dimensional space, but the $M$ signals span only a finite-dimensional subspace. Choose an orthonormal basis $\{\phi_1,\dots,\phi_K\}$ ($K\le M$) for that signal space (Gram–Schmidt). Projecting the received signal onto the basis,</p>
<p>$$r_k=\int_0^T r(t)\,\phi_k(t)\,dt,\qquad k=1,\dots,K,$$</p>
<p>gives a finite vector $\mathbf r=(r_1,\dots,r_K)$. These projections are computed by a <strong>bank of correlators</strong> (or equivalently matched filters $\phi_k(T-t)$ sampled at $T$).</p>
<p><strong>Irrelevance theorem:</strong> the part of $r(t)$ orthogonal to the signal space is noise-only and statistically independent of which $s_m$ was sent; discarding it loses nothing. Hence $\mathbf r$ is a <em>sufficient statistic</em> — the optimal decision based on the full waveform equals the optimal decision based on $\mathbf r$. This is the deep reason the matched-filter / correlator front end is not a heuristic but a provably lossless data reduction.</p>
<div class="callout"><strong>Consequence:</strong> detection becomes geometry. Each $s_m$ is a point $\mathbf s_m$ in $K$-dimensional space; the received point is $\mathbf r=\mathbf s_m+\mathbf n$ with $\mathbf n$ an isotropic Gaussian cloud of variance $N_0/2$ per axis.</p></div>`
      },
      {
        h: 'MAP → ML → Minimum Distance',
        html: String.raw`<p>In AWGN the projected noise components are i.i.d. Gaussian with variance $\sigma^2=N_0/2$, so the likelihood is</p>
<p>$$p(\mathbf r\mid \mathbf s_m)=\frac{1}{(2\pi\sigma^2)^{K/2}}\exp\!\left(-\frac{\lVert \mathbf r-\mathbf s_m\rVert^2}{2\sigma^2}\right).$$</p>
<p>Taking logarithms turns the MAP rule into an additive metric. Choose $m$ maximizing</p>
<p>$$\ln P(s_m)-\frac{\lVert \mathbf r-\mathbf s_m\rVert^2}{2\sigma^2}.$$</p>
<p>When the priors are equal, the $\ln P(s_m)$ term is a constant and drops out — MAP becomes <strong>ML</strong>, and maximizing the exponent means <em>minimizing the Euclidean distance</em>:</p>
<p>$$\hat m=\arg\min_m\ \lVert \mathbf r-\mathbf s_m\rVert^2.$$</p>
<p>Expanding $\lVert \mathbf r-\mathbf s_m\rVert^2=\lVert\mathbf r\rVert^2-2\langle \mathbf r,\mathbf s_m\rangle+E_m$ and dropping the common $\lVert\mathbf r\rVert^2$ gives the <strong>correlation metric</strong>: choose $m$ maximizing $\langle \mathbf r,\mathbf s_m\rangle-\tfrac12 E_m$. If all signals have equal energy $E_m=E$, even that term vanishes and the rule is simply "largest correlation with the received signal" — which is exactly a bank of matched filters followed by "pick the largest".</p>`
      },
      {
        h: 'Decision Regions and Boundaries',
        html: String.raw`<p>The minimum-distance rule partitions signal space into <strong>decision regions</strong> $Z_1,\dots,Z_M$: $Z_m$ is the set of received points closer to $\mathbf s_m$ than to any other signal. With equal priors and energies these are the <em>Voronoi cells</em> of the constellation, and each boundary between two neighbouring points is the <strong>perpendicular bisector</strong> of the segment joining them.</p>
<p>For binary antipodal signalling ($\pm\sqrt{E_b}$ on one axis) the boundary is a single threshold at the origin: decide "1" if $r>0$, "0" if $r<0$. For QPSK the two axes decouple into two independent binary decisions (the four quadrants are the regions). For unequal priors the boundary shifts toward the <em>less</em> likely signal by</p>
<p>$$\gamma=\frac{\sigma^2}{d}\ln\frac{P(s_0)}{P(s_1)},$$</p>
<p>so a rarely-sent symbol is given a smaller region — the receiver demands stronger evidence before announcing it.</p>
<table class="data">
<tr><th>Situation</th><th>Optimal rule</th><th>Boundary</th></tr>
<tr><td>Equal priors + equal energy</td><td>Minimum distance (ML)</td><td>Perpendicular bisector</td></tr>
<tr><td>Equal priors, unequal energy</td><td>Max $\langle r,s_m\rangle-\tfrac12E_m$</td><td>Shifted by energy term</td></tr>
<tr><td>Unequal priors</td><td>MAP</td><td>Shifted toward less-likely signal</td></tr>
</table>`
      },
      {
        h: 'Error Probability: Pairwise Q and the Union Bound',
        html: String.raw`<p>Because the noise is isotropic Gaussian, the probability of mistaking $\mathbf s_i$ for a specific neighbour $\mathbf s_j$ depends only on their separation $d_{ij}=\lVert\mathbf s_i-\mathbf s_j\rVert$. The error occurs when the noise component along the line joining them exceeds half the distance:</p>
<p>$$P(\mathbf s_i\to\mathbf s_j)=Q\!\left(\frac{d_{ij}}{2\sigma}\right)=Q\!\left(\frac{d_{ij}}{\sqrt{2N_0}}\right).$$</p>
<p>For a whole constellation the exact region integrals are messy, but the <strong>union bound</strong> gives a tight, simple estimate by summing pairwise errors:</p>
<p>$$P(e)\le\frac1M\sum_{i=1}^{M}\sum_{j\ne i}Q\!\left(\frac{d_{ij}}{2\sigma}\right).$$</p>
<p>At useful SNR the smallest distance dominates (the $Q$-function falls off super-exponentially), giving the <strong>nearest-neighbour approximation</strong></p>
<p>$$P(e)\approx N_{\min}\,Q\!\left(\frac{d_{\min}}{2\sigma}\right),$$</p>
<p>where $d_{\min}$ is the minimum distance and $N_{\min}$ the average number of nearest neighbours. This is why constellation design is a fight to <em>maximize $d_{\min}$ for a given average energy</em> — it directly sets the error floor.</p>`
      },
      {
        h: 'The Binary Case, and the Link Back to the Matched Filter',
        html: String.raw`<p>For two equiprobable signals the optimal receiver forms one sufficient statistic and compares it to a threshold. The error probability is $P(e)=Q(d/2\sigma)$ with $\sigma^2=N_0/2$, so everything hinges on the distance $d$ between the two signal points:</p>
<ul>
<li><strong>Antipodal</strong> (BPSK): $\mathbf s_{0,1}=\pm\sqrt{E_b}$, so $d=2\sqrt{E_b}$ and $P(e)=Q\!\big(\sqrt{2E_b/N_0}\big)$.</li>
<li><strong>Orthogonal</strong> (e.g. BFSK): $d=\sqrt{2E_b}$ and $P(e)=Q\!\big(\sqrt{E_b/N_0}\big)$ — 3 dB worse, because orthogonal points are $\sqrt2$ closer than antipodal for the same energy.</li>
</ul>
<p>The single sufficient statistic here is produced by correlating against the signal difference $s_1(t)-s_0(t)$ — a <em>matched filter</em>. So the optimal receiver <em>is</em> the matched filter for the binary case; the matched-filter topic is the SNR-maximizing view of the very same structure, and this topic is the error-probability / decision-theoretic view. They agree because maximizing decision-instant SNR is equivalent to maximizing $d/\sigma$, which minimizes $Q(d/2\sigma)$.</p>
<div class="callout"><strong>Two lenses, one receiver:</strong> matched filter = "maximize SNR"; optimal receiver = "minimize $P(e)$". In AWGN they specify the identical hardware.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>This topic is the decision-theory backbone under every modulation. You should now be able to say:</p>
<ul>
<li><strong>The principle:</strong> the optimal (minimum-error) rule is MAP — maximize $p(r\mid s_m)P(s_m)$; with equal priors this is ML.</li>
<li><strong>The reduction:</strong> a correlator / matched-filter bank projects the waveform onto signal space, producing a sufficient statistic; noise outside that space is irrelevant.</li>
<li><strong>The geometry:</strong> in AWGN, ML = minimum Euclidean distance; decision regions are Voronoi cells with perpendicular-bisector boundaries.</li>
<li><strong>The metric algebra:</strong> minimum-distance ⇔ maximize $\langle r,s_m\rangle-\tfrac12E_m$ ⇔ (equal energy) maximize correlation.</li>
<li><strong>The error rule:</strong> pairwise error is $Q(d_{ij}/2\sigma)$; the union bound and $N_{\min}Q(d_{\min}/2\sigma)$ predict $P(e)$, so design maximizes $d_{\min}$.</li>
<li><strong>The connection:</strong> for binary signalling the optimal receiver is exactly the matched filter, and antipodal beats orthogonal by 3 dB purely because of distance.</li>
</ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Matched_filter" target="_blank" rel="noopener">Wikipedia — Matched filter</a> — canonical article deriving the SNR-maximizing filter two ways and tying it to maximum-likelihood detection in Gaussian noise.</li>
<li><a href="https://ocw.mit.edu/courses/6-450-principles-of-digital-communications-i-fall-2006/1e8d60eb6c0a68cc48e81af039fd4af6_book_6.pdf" target="_blank" rel="noopener">MIT OCW 6.450 — Channels, modulation, and demodulation (Gallager)</a> — graduate chapter building the correlator/matched-filter front end and MAP/ML detection from signal-space first principles.</li>
<li><a href="https://cioffi-group.stanford.edu/ee379a/Lectures/L2.pdf" target="_blank" rel="noopener">Stanford EE379A (Cioffi) — Lecture 2: The AWGN channel</a> — rigorous notes on optimal (MAP/ML) detection, minimum-distance decision regions, and error probability on the vector AWGN channel.</li>
<li><a href="http://barry.ece.gatech.edu/ee6057/lectures/lec5.html" target="_blank" rel="noopener">Georgia Tech ECE6057 — Lecture 5: signal space and the minimum-distance receiver</a> — concise walkthrough of projecting the waveform onto signal space and reducing detection to a Voronoi minimum-distance decision.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`The optimal receiver minimizes $P(e)$ via the MAP rule: $\hat m=\arg\max_m p(r\mid s_m)P(s_m)$.`,
      String.raw`With equal priors MAP becomes ML ($\arg\max_m p(r\mid s_m)$); in AWGN, ML becomes minimum-distance $\arg\min_m\lVert r-s_m\rVert^2$.`,
      String.raw`A bank of correlators / matched filters yields a sufficient statistic; noise orthogonal to the signal space is irrelevant.`,
      String.raw`Minimum-distance is equivalent to maximizing the correlation metric $\langle r,s_m\rangle-\tfrac12E_m$; for equal energy, just the largest correlation.`,
      String.raw`Decision regions are Voronoi cells; equal-energy/equal-prior boundaries are perpendicular bisectors.`,
      String.raw`Unequal priors shift the threshold by $\gamma=(\sigma^2/d)\ln\!\big(P(s_0)/P(s_1)\big)$ toward the less likely signal.`,
      String.raw`Pairwise error probability is $Q(d_{ij}/2\sigma)$ with $\sigma^2=N_0/2$.`,
      String.raw`Union bound: $P(e)\le\frac1M\sum_i\sum_{j\ne i}Q(d_{ij}/2\sigma)$; nearest-neighbour: $P(e)\approx N_{\min}Q(d_{\min}/2\sigma)$.`,
      String.raw`Antipodal binary gives $Q(\sqrt{2E_b/N_0})$; orthogonal gives $Q(\sqrt{E_b/N_0})$ — a 3 dB penalty from smaller distance.`,
      String.raw`Good constellation design maximizes $d_{\min}$ for a fixed average energy, since $d_{\min}$ sets the error floor.`,
      String.raw`For binary signalling the optimal receiver is exactly the matched filter matched to $s_1(t)-s_0(t)$.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="optrx-a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="250" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Optimal (correlator-bank) receiver — pick the largest metric</text>
<line x1="12" y1="120" x2="60" y2="120" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#optrx-a1)"/>
<text x="14" y="112" fill="#9aa7b5" font-size="11">$r(t)$</text>
<!-- branch 1 -->
<circle cx="86" cy="70" r="14" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/>
<text x="80" y="75" fill="#e6edf3" font-size="13">$\times$</text>
<rect x="60" y="92" width="52" height="22" fill="#1c232e" stroke="#63e6be" stroke-width="1.2"/>
<text x="66" y="107" fill="#e6edf3" font-size="9">$s_1(t)$</text>
<line x1="86" y1="92" x2="86" y2="84" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#optrx-a1)"/>
<line x1="60" y1="120" x2="60" y2="70" stroke="#9aa7b5" stroke-width="1.2"/><line x1="60" y1="70" x2="72" y2="70" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#optrx-a1)"/>
<line x1="100" y1="70" x2="150" y2="70" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#optrx-a1)"/>
<rect x="150" y="52" width="66" height="34" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/>
<text x="160" y="73" fill="#e6edf3" font-size="11">$\int_0^T$</text>
<line x1="216" y1="70" x2="300" y2="70" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#optrx-a1)"/>
<text x="228" y="63" fill="#9aa7b5" font-size="9">metric $z_1$</text>
<!-- branch M -->
<circle cx="86" cy="170" r="14" fill="#1c232e" stroke="#4dabf7" stroke-width="1.5"/>
<text x="80" y="175" fill="#e6edf3" font-size="13">$\times$</text>
<rect x="60" y="192" width="52" height="22" fill="#1c232e" stroke="#63e6be" stroke-width="1.2"/>
<text x="64" y="207" fill="#e6edf3" font-size="9">$s_M(t)$</text>
<line x1="86" y1="192" x2="86" y2="184" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#optrx-a1)"/>
<line x1="60" y1="120" x2="60" y2="170" stroke="#9aa7b5" stroke-width="1.2"/><line x1="60" y1="170" x2="72" y2="170" stroke="#9aa7b5" stroke-width="1.2" marker-end="url(#optrx-a1)"/>
<line x1="100" y1="170" x2="150" y2="170" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#optrx-a1)"/>
<rect x="150" y="152" width="66" height="34" fill="#1c232e" stroke="#ffa94d" stroke-width="1.4"/>
<text x="160" y="173" fill="#e6edf3" font-size="11">$\int_0^T$</text>
<line x1="216" y1="170" x2="300" y2="170" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#optrx-a1)"/>
<text x="226" y="163" fill="#9aa7b5" font-size="9">metric $z_M$</text>
<text x="150" y="128" fill="#9aa7b5" font-size="16">$\vdots$</text>
<rect x="300" y="60" width="120" height="120" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.6"/>
<text x="312" y="112" fill="#e6edf3" font-size="12">select</text>
<text x="312" y="130" fill="#e6edf3" font-size="12">largest</text>
<text x="312" y="148" fill="#9aa7b5" font-size="10">(min-dist)</text>
<line x1="420" y1="120" x2="470" y2="120" stroke="#9aa7b5" stroke-width="1.5" marker-end="url(#optrx-a1)"/>
<text x="462" y="112" fill="#b197fc" font-size="11">$\hat m$</text>
</svg>`,
        caption: 'The optimal receiver: correlate the input against each candidate signal (a matched-filter bank), sample the metrics at t=T, and announce the hypothesis with the largest metric — the minimum-distance / maximum-correlation decision.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="250" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Signal-space decision regions (QPSK) — Voronoi cells</text>
<line x1="270" y1="40" x2="270" y2="230" stroke="#9aa7b5" stroke-width="1" stroke-dasharray="5 4"/>
<line x1="90" y1="135" x2="450" y2="135" stroke="#9aa7b5" stroke-width="1" stroke-dasharray="5 4"/>
<text x="452" y="139" fill="#9aa7b5" font-size="11">I</text>
<text x="276" y="52" fill="#9aa7b5" font-size="11">Q</text>
<circle cx="350" cy="80" r="5" fill="#ffa94d"/><text x="358" y="76" fill="#e6edf3" font-size="10">$s_1$ (11)</text>
<circle cx="190" cy="80" r="5" fill="#ffa94d"/><text x="150" y="76" fill="#e6edf3" font-size="10">$s_2$ (01)</text>
<circle cx="190" cy="190" r="5" fill="#ffa94d"/><text x="150" y="205" fill="#e6edf3" font-size="10">$s_3$ (00)</text>
<circle cx="350" cy="190" r="5" fill="#ffa94d"/><text x="358" y="205" fill="#e6edf3" font-size="10">$s_4$ (10)</text>
<text x="300" y="70" fill="#63e6be" font-size="11">$Z_1$</text>
<text x="228" y="70" fill="#63e6be" font-size="11">$Z_2$</text>
<text x="228" y="205" fill="#63e6be" font-size="11">$Z_3$</text>
<text x="300" y="205" fill="#63e6be" font-size="11">$Z_4$</text>
<!-- received point + noise -->
<circle cx="322" cy="108" r="4" fill="#4dabf7"/>
<line x1="350" y1="80" x2="322" y2="108" stroke="#4dabf7" stroke-width="1.2" stroke-dasharray="3 2"/>
<text x="326" y="120" fill="#4dabf7" font-size="10">$r=s_1+n$</text>
<text x="70" y="240" fill="#9aa7b5" font-size="10">Boundaries are the perpendicular bisectors (here the I and Q axes); decide by which cell r lands in.</text>
</svg>`,
        caption: 'Decision regions for QPSK: each region Z_m holds the points closest to signal s_m. The boundaries are perpendicular bisectors (the I/Q axes here), so the received point r is decoded to whichever cell it falls in.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="230" fill="#1c232e"/>
<text x="16" y="22" fill="#e6edf3" font-size="13">Binary decision: two likelihoods, one threshold, shaded error tails</text>
<line x1="40" y1="180" x2="510" y2="180" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="275" y1="45" x2="275" y2="190" stroke="#b197fc" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="250" y="40" fill="#b197fc" font-size="11">threshold $\gamma$</text>
<!-- pdf s0 centered left -->
<path d="M60,180 C120,180 150,60 190,60 C230,60 260,180 320,180" fill="none" stroke="#4dabf7" stroke-width="2"/>
<text x="150" y="90" fill="#4dabf7" font-size="11">$p(r\mid s_0)$</text>
<!-- pdf s1 centered right -->
<path d="M230,180 C290,180 320,60 360,60 C400,60 430,180 490,180" fill="none" stroke="#ffa94d" stroke-width="2"/>
<text x="392" y="90" fill="#ffa94d" font-size="11">$p(r\mid s_1)$</text>
<!-- error tails -->
<path d="M275,180 C295,178 305,150 320,180 Z" fill="#ff6b6b" opacity="0.5"/>
<path d="M230,180 C260,178 268,150 275,180 Z" fill="#ff6b6b" opacity="0.5"/>
<text x="300" y="205" fill="#ff6b6b" font-size="10">$P(e)=Q(d/2\sigma)$</text>
<line x1="190" y1="185" x2="360" y2="185" stroke="#63e6be" stroke-width="1.2"/>
<text x="255" y="222" fill="#63e6be" font-size="10">separation $d$</text>
<circle cx="190" cy="180" r="3" fill="#4dabf7"/><circle cx="360" cy="180" r="3" fill="#ffa94d"/>
</svg>`,
        caption: 'Binary detection: the two conditional densities overlap; the optimal threshold (midpoint for equal priors/energy) splits them, and the shaded overlap tails are the error probability Q(d/2σ).'
      }
    ],
    equations: [
      {
        title: 'MAP Decision Rule',
        tex: String.raw`$$\hat m=\arg\max_{m}\ p(r\mid s_m)\,P(s_m)$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want the rule that minimizes the average error probability $P(e)$, equivalently maximizes $P(c)=\int P(\text{correct}\mid r)\,p(r)\,dr$.</p>
<p><b>Step 1.</b> Since $p(r)\ge 0$, the integral is maximized by maximizing the integrand $P(\text{correct}\mid r)$ separately for every observed $r$. Announcing message $m$ is correct precisely when $s_m$ was sent, so $P(\text{correct}\mid r)=P(s_m\mid r)$ for that choice.</p>
<p><b>Step 2.</b> Therefore, for each $r$, choose $\hat m=\arg\max_m P(s_m\mid r)$. Apply Bayes: $P(s_m\mid r)=p(r\mid s_m)P(s_m)/p(r)$.</p>
<p><b>Result.</b> The denominator $p(r)$ is common to all hypotheses and cannot change the argmax, so it drops out, leaving $\hat m=\arg\max_m p(r\mid s_m)P(s_m)$ — the MAP rule, which is exactly optimal (minimum error).</p>`
      },
      {
        title: 'ML Rule (Equal Priors)',
        tex: String.raw`$$\hat m=\arg\max_{m}\ p(r\mid s_m)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Begin from the MAP rule $\hat m=\arg\max_m p(r\mid s_m)P(s_m)$.</p>
<p><b>Step 1.</b> Assume all messages are equally likely: $P(s_m)=1/M$ for every $m$. This factor is now a constant independent of $m$.</p>
<p><b>Step 2.</b> A constant positive multiplier does not affect which term is largest, so it can be removed from the maximization.</p>
<p><b>Result.</b> MAP collapses to maximum likelihood, $\hat m=\arg\max_m p(r\mid s_m)$ — pick the hypothesis under which the observation is most probable. Equal priors are the standard assumption for uncoded, balanced data, which is why ML is the everyday rule.</p>`
      },
      {
        title: 'Minimum-Distance Detection (AWGN)',
        tex: String.raw`$$\hat m=\arg\min_{m}\ \lVert \mathbf r-\mathbf s_m\rVert^2$$`,
        derivation: String.raw`<p><b>Where we start.</b> In AWGN the sufficient-statistic vector has i.i.d. Gaussian components of variance $\sigma^2=N_0/2$, so $p(\mathbf r\mid \mathbf s_m)=(2\pi\sigma^2)^{-K/2}\exp(-\lVert \mathbf r-\mathbf s_m\rVert^2/2\sigma^2)$.</p>
<p><b>Step 1.</b> Under equal priors we use the ML rule; maximizing the likelihood is the same as maximizing its logarithm because $\ln$ is monotonic.</p>
<p><b>Step 2.</b> $\ln p(\mathbf r\mid \mathbf s_m)=\text{const}-\lVert \mathbf r-\mathbf s_m\rVert^2/2\sigma^2$. The constant and the positive factor $1/2\sigma^2$ do not depend on $m$.</p>
<p><b>Result.</b> Maximizing the log-likelihood is equivalent to minimizing $\lVert \mathbf r-\mathbf s_m\rVert^2$ — choose the signal point nearest the received point. ML detection in AWGN is literally "pick the closest constellation point."</p>`
      },
      {
        title: 'Correlation Metric',
        tex: String.raw`$$\hat m=\arg\max_{m}\ \Big(\langle \mathbf r,\mathbf s_m\rangle-\tfrac12 E_m\Big)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Take the minimum-distance rule $\hat m=\arg\min_m\lVert \mathbf r-\mathbf s_m\rVert^2$.</p>
<p><b>Step 1.</b> Expand the squared norm: $\lVert \mathbf r-\mathbf s_m\rVert^2=\lVert\mathbf r\rVert^2-2\langle \mathbf r,\mathbf s_m\rangle+\lVert\mathbf s_m\rVert^2$, with $\lVert\mathbf s_m\rVert^2=E_m$ the signal energy.</p>
<p><b>Step 2.</b> The term $\lVert\mathbf r\rVert^2$ is identical for all hypotheses, so it drops out of the argmin. Minimizing $-2\langle \mathbf r,\mathbf s_m\rangle+E_m$ is the same as maximizing $\langle \mathbf r,\mathbf s_m\rangle-\tfrac12E_m$.</p>
<p><b>Result.</b> The optimal receiver computes each correlation $\langle \mathbf r,\mathbf s_m\rangle$ (a matched-filter bank), subtracts an energy bias $\tfrac12E_m$, and picks the largest. For equal-energy signals the bias is common and the rule is simply the largest correlation.</p>`
      },
      {
        title: 'Pairwise Error Probability',
        tex: String.raw`$$P(\mathbf s_i\to\mathbf s_j)=Q\!\left(\frac{d_{ij}}{2\sigma}\right),\quad \sigma^2=\frac{N_0}{2}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Consider only two signals $\mathbf s_i,\mathbf s_j$ separated by $d_{ij}=\lVert\mathbf s_i-\mathbf s_j\rVert$; the ML boundary is the perpendicular bisector of the segment joining them.</p>
<p><b>Step 1.</b> Project the received vector onto the unit direction $\mathbf u=(\mathbf s_j-\mathbf s_i)/d_{ij}$. Sent $\mathbf s_i$, the projection has mean $0$ measured from $\mathbf s_i$ and the boundary sits at distance $d_{ij}/2$.</p>
<p><b>Step 2.</b> The projected noise $n_u=\langle \mathbf n,\mathbf u\rangle$ is Gaussian with zero mean and variance $\sigma^2=N_0/2$ (projection of white noise onto a unit vector). An error to $\mathbf s_j$ needs $n_u>d_{ij}/2$.</p>
<p><b>Result.</b> $P=\Pr\{n_u>d_{ij}/2\}=Q\big((d_{ij}/2)/\sigma\big)=Q(d_{ij}/2\sigma)=Q\big(d_{ij}/\sqrt{2N_0}\big)$. Error depends only on distance-to-noise, not on where the pair sits.</p>`
      },
      {
        title: 'Union Bound / Nearest-Neighbour',
        tex: String.raw`$$P(e)\le\frac1M\sum_{i}\sum_{j\ne i}Q\!\left(\frac{d_{ij}}{2\sigma}\right)\approx N_{\min}Q\!\left(\frac{d_{\min}}{2\sigma}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Given $\mathbf s_i$ was sent, the error event is the union of pairwise events "$\mathbf r$ is closer to some $\mathbf s_j$ than to $\mathbf s_i$" over $j\ne i$.</p>
<p><b>Step 1.</b> The union bound states $P(\bigcup_j A_j)\le\sum_j P(A_j)$. Each $P(A_j)$ is upper-bounded by the pairwise error $Q(d_{ij}/2\sigma)$ (the two-signal problem ignores the other regions, which only helps).</p>
<p><b>Step 2.</b> Average over equally likely transmitted signals with weight $1/M$: $P(e)\le\frac1M\sum_i\sum_{j\ne i}Q(d_{ij}/2\sigma)$.</p>
<p><b>Result.</b> Because $Q(\cdot)$ decays faster than exponentially, at moderate/high SNR the smallest distance dominates the sum; keeping only those terms gives $P(e)\approx N_{\min}Q(d_{\min}/2\sigma)$, with $N_{\min}$ the average number of minimum-distance neighbours. This is why maximizing $d_{\min}$ is the goal of constellation design.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What criterion defines the optimal receiver?`, back: String.raw`MAP — maximize the posterior $P(s_m\mid r)\propto p(r\mid s_m)P(s_m)$; it minimizes $P(e)$.` },
      { front: String.raw`When does MAP reduce to ML?`, back: String.raw`When all messages are equally likely — the prior $P(s_m)$ becomes a constant and drops out.` },
      { front: String.raw`In AWGN, what does ML detection become?`, back: String.raw`Minimum-distance detection: $\hat m=\arg\min_m\lVert r-s_m\rVert^2$ — pick the nearest constellation point.` },
      { front: String.raw`What is a sufficient statistic here?`, back: String.raw`The correlator/matched-filter outputs (projections onto the signal-space basis); noise outside that space is irrelevant.` },
      { front: String.raw`State the irrelevance theorem.`, back: String.raw`The received component orthogonal to the signal space is noise-only and independent of $s_m$, so discarding it loses no information.` },
      { front: String.raw`What is the correlation metric?`, back: String.raw`$\langle r,s_m\rangle-\tfrac12E_m$; maximize it. For equal energy, just maximize $\langle r,s_m\rangle$.` },
      { front: String.raw`What are decision regions with equal priors/energy?`, back: String.raw`Voronoi cells of the constellation; boundaries are perpendicular bisectors.` },
      { front: String.raw`How do unequal priors move the binary threshold?`, back: String.raw`By $\gamma=(\sigma^2/d)\ln\!\big(P(s_0)/P(s_1)\big)$, shifting toward the less-likely signal.` },
      { front: String.raw`What is the pairwise error probability?`, back: String.raw`$Q(d_{ij}/2\sigma)$ with $\sigma^2=N_0/2$ — depends only on the distance between the two signals.` },
      { front: String.raw`State the union bound on $P(e)$.`, back: String.raw`$P(e)\le\frac1M\sum_i\sum_{j\ne i}Q(d_{ij}/2\sigma)$.` },
      { front: String.raw`What is the nearest-neighbour approximation?`, back: String.raw`$P(e)\approx N_{\min}Q(d_{\min}/2\sigma)$ — the minimum distance dominates at useful SNR.` },
      { front: String.raw`Antipodal vs orthogonal binary error probability?`, back: String.raw`Antipodal: $Q(\sqrt{2E_b/N_0})$; orthogonal: $Q(\sqrt{E_b/N_0})$ — orthogonal is 3 dB worse.` },
      { front: String.raw`Why is antipodal 3 dB better than orthogonal?`, back: String.raw`For equal energy, antipodal distance $2\sqrt{E_b}$ exceeds orthogonal $\sqrt{2E_b}$ by $\sqrt2$, i.e. 3 dB in SNR.` },
      { front: String.raw`How does the optimal receiver relate to the matched filter?`, back: String.raw`For binary signalling it IS the matched filter (to $s_1-s_0$); max-SNR and min-$P(e)$ specify the same hardware in AWGN.` }
    ],
    mcqs: [
      { q: String.raw`The optimal receiver that minimizes error probability uses which rule?`, options: [String.raw`Maximum a posteriori (MAP)`, String.raw`Maximum SNR only`, String.raw`Least mean squares`, String.raw`Zero-forcing`], answer: 0, explain: String.raw`Minimizing $P(e)$ pointwise gives $\arg\max_m P(s_m\mid r)$ — the MAP rule.` },
      { q: String.raw`MAP reduces to maximum-likelihood (ML) detection when:`, options: [String.raw`Noise is coloured`, String.raw`All messages are equally likely`, String.raw`The channel has ISI`, String.raw`Energy is unequal`], answer: 1, explain: String.raw`Equal priors make $P(s_m)$ a constant that drops out of the argmax.` },
      { q: String.raw`In AWGN with equal priors, ML detection is equivalent to:`, options: [String.raw`Maximum-energy detection`, String.raw`Minimum Euclidean distance`, String.raw`Maximum-phase detection`, String.raw`Envelope detection`], answer: 1, explain: String.raw`The Gaussian log-likelihood is maximized by minimizing $\lVert r-s_m\rVert^2$.` },
      { q: String.raw`The correlator/matched-filter outputs form a:`, options: [String.raw`Biased estimate`, String.raw`Sufficient statistic`, String.raw`Whitening filter`, String.raw`Random dither`], answer: 1, explain: String.raw`Projections onto the signal space retain all decision-relevant information.` },
      { q: String.raw`The component of $r(t)$ orthogonal to the signal space is:`, options: [String.raw`The most informative part`, String.raw`Irrelevant to the optimal decision`, String.raw`The signal itself`, String.raw`Always zero`], answer: 1, explain: String.raw`Irrelevance theorem: it is noise-only and independent of which signal was sent.` },
      { q: String.raw`The correlation metric to be maximized is:`, options: [String.raw`$\langle r,s_m\rangle-\tfrac12E_m$`, String.raw`$\langle r,s_m\rangle+E_m$`, String.raw`$\lVert r\rVert^2$`, String.raw`$E_m/2$`], answer: 0, explain: String.raw`From expanding the min-distance metric and dropping the common $\lVert r\rVert^2$.` },
      { q: String.raw`For equal-energy, equal-prior signals, the decision boundaries are:`, options: [String.raw`Circles`, String.raw`Perpendicular bisectors (Voronoi cells)`, String.raw`Parabolas`, String.raw`Random`], answer: 1, explain: String.raw`Minimum-distance partitions space into Voronoi regions.` },
      { q: String.raw`The pairwise error probability between two signals distance $d$ apart is:`, options: [String.raw`$Q(d/\sigma)$`, String.raw`$Q(d/2\sigma)$`, String.raw`$Q(2d/\sigma)$`, String.raw`$Q(\sigma/d)$`], answer: 1, explain: String.raw`Noise along the join has std $\sigma$; error needs it to exceed $d/2$.` },
      { q: String.raw`The union bound on symbol error probability is:`, options: [String.raw`A lower bound only`, String.raw`$P(e)\le\frac1M\sum_i\sum_{j\ne i}Q(d_{ij}/2\sigma)$`, String.raw`Exact for all M`, String.raw`Independent of distances`], answer: 1, explain: String.raw`Sum of pairwise errors upper-bounds the union of error events.` },
      { q: String.raw`For equal energy $E_b$, antipodal signalling gives error probability:`, options: [String.raw`$Q(\sqrt{E_b/N_0})$`, String.raw`$Q(\sqrt{2E_b/N_0})$`, String.raw`$Q(2E_b/N_0)$`, String.raw`$\tfrac12e^{-E_b/N_0}$`], answer: 1, explain: String.raw`Distance $d=2\sqrt{E_b}$, so $Q(d/2\sigma)=Q(\sqrt{2E_b/N_0})$.` },
      { q: String.raw`Orthogonal binary signalling is worse than antipodal by about:`, options: [String.raw`0 dB`, String.raw`3 dB`, String.raw`6 dB`, String.raw`10 dB`], answer: 1, explain: String.raw`Orthogonal distance is $\sqrt2$ smaller, i.e. a 3 dB SNR penalty.` },
      { q: String.raw`With unequal priors, the optimal binary threshold shifts:`, options: [String.raw`Toward the more-likely signal`, String.raw`Toward the less-likely signal`, String.raw`Never moves`, String.raw`To infinity`], answer: 1, explain: String.raw`$\gamma=(\sigma^2/d)\ln(P(s_0)/P(s_1))$ enlarges the more-likely signal's region.` }
    ],
    numericals: [
      {
        q: String.raw`A binary antipodal system has $E_b/N_0 = 9$ dB. Find the optimal-receiver bit-error probability.`,
        solution: String.raw`<p><b>Formula.</b> For antipodal signalling the optimal (minimum-distance) receiver gives $$P(e)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right),$$ with $E_b$ the energy per bit and $N_0$ the one-sided noise density.</p>
<p><b>Substitute.</b> $E_b/N_0 = 10^{9/10}=7.94$, so the argument is $\sqrt{2\times7.94}=\sqrt{15.9}=3.98$.</p>
<p><b>Compute.</b> $P(e)=Q(3.98)\approx \mathbf{3.4\times10^{-5}}$.</p>
<p><b>Explanation.</b> At 9 dB the antipodal receiver already reaches a $\sim3\times10^{-5}$ BER — the benchmark every practical BPSK link is measured against, and the best any receiver can do in AWGN at this energy.</p>`
      },
      {
        q: String.raw`Compare the error probability of orthogonal binary signalling to antipodal at the same $E_b/N_0=9$ dB.`,
        solution: String.raw`<p><b>Formula.</b> Orthogonal signals are $\sqrt2$ closer than antipodal for equal energy, so $$P(e)_{\text{orth}}=Q\!\left(\sqrt{\tfrac{E_b}{N_0}}\right).$$</p>
<p><b>Substitute.</b> $E_b/N_0=7.94$, argument $=\sqrt{7.94}=2.82$.</p>
<p><b>Compute.</b> $P(e)_{\text{orth}}=Q(2.82)\approx \mathbf{2.4\times10^{-3}}$, versus $3.4\times10^{-5}$ for antipodal — about $70\times$ more errors.</p>
<p><b>Explanation.</b> The single $\sqrt2$ shrink in distance costs a factor of ~70 in BER, i.e. the receiver would need ~3 dB more $E_b/N_0$ to match antipodal — a concrete illustration that distance, not scheme name, sets performance.</p>`
      },
      {
        q: String.raw`Two equal-energy signals in signal space are $\mathbf s_1=(2,0)$ and $\mathbf s_2=(0,2)$ (volts on orthonormal axes). Noise variance per axis is $\sigma^2=N_0/2=0.5$. Find the pairwise error probability.`,
        solution: String.raw`<p><b>Formula.</b> $$P=Q\!\left(\frac{d}{2\sigma}\right),\qquad d=\lVert\mathbf s_1-\mathbf s_2\rVert.$$</p>
<p><b>Substitute.</b> $d=\sqrt{(2-0)^2+(0-2)^2}=\sqrt{8}=2.83$; $\sigma=\sqrt{0.5}=0.707$; argument $=2.83/(2\times0.707)=2.0$.</p>
<p><b>Compute.</b> $P=Q(2.0)\approx \mathbf{0.0228}$.</p>
<p><b>Explanation.</b> These signals are orthogonal (distance $\sqrt{2E}$ with $E=4$), giving a ~2.3% error — the geometry alone, via $d/2\sigma$, determines the answer without reference to waveforms.</p>`
      },
      {
        q: String.raw`A QPSK constellation has minimum distance $d_{\min}=2\sqrt{E_s/2}$ and each symbol has 2 nearest neighbours. Using the nearest-neighbour bound with $E_s/N_0=13$ dB, estimate the symbol error probability.`,
        solution: String.raw`<p><b>Formula.</b> $$P(e)\approx N_{\min}\,Q\!\left(\frac{d_{\min}}{2\sigma}\right),\quad \frac{d_{\min}}{2\sigma}=\sqrt{\frac{E_s}{N_0}},\ \ N_{\min}=2.$$ (QPSK: $d_{\min}=\sqrt{2E_s}$, $\sigma^2=N_0/2$, so $d_{\min}/2\sigma=\sqrt{E_s/N_0}$.)</p>
<p><b>Substitute.</b> $E_s/N_0=10^{13/10}=20.0$; argument $=\sqrt{20.0}=4.47$; $Q(4.47)\approx3.9\times10^{-6}$.</p>
<p><b>Compute.</b> $P(e)\approx 2\times3.9\times10^{-6}=\mathbf{7.8\times10^{-6}}$.</p>
<p><b>Explanation.</b> The nearest-neighbour term captures almost all the error; the diagonal symbol (distance $2\sqrt{E_s}$) contributes negligibly, confirming $d_{\min}$ dominates. This matches the exact QPSK symbol-error formula to two significant figures.</p>`
      },
      {
        q: String.raw`In a binary system the prior probabilities are $P(s_0)=0.8$, $P(s_1)=0.2$, with signals at $\pm1$ ($d=2$) and $\sigma^2=0.25$. Find the optimal MAP threshold offset from the midpoint.`,
        solution: String.raw`<p><b>Formula.</b> The MAP threshold shifts from the midpoint by $$\gamma=\frac{\sigma^2}{d}\,\ln\frac{P(s_0)}{P(s_1)},$$ moving toward the less-likely signal ($s_1$).</p>
<p><b>Substitute.</b> $\sigma^2=0.25$, $d=2$, ratio $=0.8/0.2=4$: $\gamma=\dfrac{0.25}{2}\ln 4 = 0.125\times1.386$.</p>
<p><b>Compute.</b> $\gamma=\mathbf{0.173}$ (toward $s_1$, i.e. threshold at $r=+0.173$ instead of $0$).</p>
<p><b>Explanation.</b> Because $s_0$ is four times more likely, the receiver enlarges $s_0$'s decision region, demanding stronger evidence before declaring the rare $s_1$ — lowering overall error below what a fixed midpoint threshold would give.</p>`
      }
    ],
    realWorld: String.raw`<p>Every digital demodulator is an approximation to this optimal structure. A BPSK/QPSK slicer that "picks the nearest point" is literally minimum-distance ML detection; a soft-decision decoder that passes correlation metrics (log-likelihood ratios) to a Viterbi or LDPC stage is preserving the sufficient statistic instead of throwing it away with a hard decision — which is exactly why soft-decision decoding buys ~2 dB over hard decisions.</p>
<p>The framework also tells hardware designers where to spend effort: since $P(e)\approx N_{\min}Q(d_{\min}/2\sigma)$, modem performance is set by minimum distance, so constellation shaping, Gray mapping, and coded-modulation all aim to grow $d_{\min}$ (or the coded equivalent) per unit energy. In receivers with known unequal priors — for example, a channel that is idle most of the time, or protocol fields with skewed symbol statistics — implementing the MAP threshold shift $\gamma$ instead of a fixed midpoint measurably reduces errors for free.</p>`,
    related: ['matched-filter', 'bpsk', 'ber', 'awgn', 'eb-no']
  }
);
