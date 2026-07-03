/* From-scratch derivations for the "Modulation & Detection" category.
   Keyed by topic id, then by equation index (matching the spec).
   Loaded after content.js; merges into the global CONTENT_DERIV. */
Object.assign(CONTENT_DERIV, {

  /* ===================== BPSK ===================== */
  'bpsk': {
    0: String.raw`
<p><b>Where we start.</b> Digital modulation must turn an abstract bit into a physical passband waveform. We have a sinusoidal carrier $\cos(2\pi f_c t)$ and want to send one bit per symbol period $T_b$. The idea of <i>phase-shift keying</i> is to keep amplitude and frequency fixed and let the <b>phase</b> carry the information.</p>

<p><b>Step 1 — two phases, 180° apart.</b> A bit "1" and a bit "0" should be as different as possible so noise finds it hardest to confuse them. On a single cosine, the two most distinguishable choices are $\cos(\cdot)$ and $\cos(\cdot+\pi)=-\cos(\cdot)$. So we let a sign $b\in\{+1,-1\}$ multiply the carrier:</p>
$$ s(t) = b\,A\cos(2\pi f_c t),\qquad 0\le t< T_b . $$
<p>These are <b>antipodal</b> signals: one is the exact negative of the other.</p>

<p><b>Step 2 — fix the amplitude by an energy budget.</b> We prefer to specify <i>energy per bit</i> $E_b$ rather than voltage, because energy is what competes against noise. Compute the energy of one symbol and demand it equal $E_b$:</p>
$$ E_b=\int_0^{T_b}\!\big(A\cos 2\pi f_c t\big)^2 dt = A^2\!\int_0^{T_b}\!\cos^2(2\pi f_c t)\,dt \approx A^2\cdot\frac{T_b}{2}, $$
<p>where $\int_0^{T_b}\cos^2\approx T_b/2$ because over an integer-plus-many cycles the average of $\cos^2$ is $\tfrac12$. Solving for $A$:</p>
$$ A^2\frac{T_b}{2}=E_b \;\Rightarrow\; A=\sqrt{\frac{2E_b}{T_b}}. $$

<p><b>Result.</b></p>
$$ s(t) = b\sqrt{\tfrac{2E_b}{T_b}}\cos(2\pi f_c t),\quad b\in\{+1,-1\}. $$
<p><b>Intuition:</b> the $\sqrt{2E_b/T_b}$ factor is just the amplitude that makes each symbol carry exactly $E_b$ joules; the sign $b$ is the entire message.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> To detect optimally we describe signals as <b>vectors</b> in an orthonormal signal space (Gram–Schmidt). BPSK has only one carrier direction, so we need a single unit-energy basis function.</p>

<p><b>Step 1 — build a unit-energy basis.</b> Take the carrier shape $\cos(2\pi f_c t)$ and scale it so its energy is $1$:</p>
$$ \int_0^{T_b}\Big(c\cos 2\pi f_c t\Big)^2 dt = c^2\frac{T_b}{2}=1 \;\Rightarrow\; c=\sqrt{\tfrac{2}{T_b}}. $$
$$ \boxed{\;\phi(t)=\sqrt{\tfrac{2}{T_b}}\cos(2\pi f_c t)\;} $$

<p><b>Step 2 — project the waveform onto the basis.</b> Write $s(t)=s_i\,\phi(t)$ and find the coordinate $s_i=\int_0^{T_b}s(t)\phi(t)\,dt$. Using $s(t)=b\sqrt{2E_b/T_b}\cos(\cdot)$ and $\phi=\sqrt{2/T_b}\cos(\cdot)$:</p>
$$ s_i=b\sqrt{\tfrac{2E_b}{T_b}}\sqrt{\tfrac{2}{T_b}}\int_0^{T_b}\!\cos^2(2\pi f_c t)\,dt = b\cdot\frac{2\sqrt{E_b}}{T_b}\cdot\frac{T_b}{2}=b\sqrt{E_b}. $$

<p><b>Result.</b></p>
$$ s_i=\pm\sqrt{E_b},\qquad \phi(t)=\sqrt{\tfrac{2}{T_b}}\cos(2\pi f_c t). $$
<p><b>Intuition:</b> BPSK lives on a <i>single line</i>; the two messages are two points at $\pm\sqrt{E_b}$, symmetric about the origin. Their squared coordinate $(\sqrt{E_b})^2=E_b$ recovers the energy, as it must.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> The receiver's job is to decide which point was sent given a noisy observation. Error probability is governed by how <b>far apart</b> the constellation points are — the minimum distance $d_{\min}$.</p>

<p><b>Step 1 — locate the two points.</b> From the signal-space result the symbols sit at $s_1=+\sqrt{E_b}$ and $s_0=-\sqrt{E_b}$ on the single axis.</p>

<p><b>Step 2 — Euclidean distance between them.</b></p>
$$ d_{\min}=|s_1-s_0|=\big|\sqrt{E_b}-(-\sqrt{E_b})\big|=2\sqrt{E_b}. $$

<p><b>Result.</b></p>
$$ d_{\min}=2\sqrt{E_b}. $$
<p><b>Intuition:</b> antipodal signaling gives the <i>largest possible</i> separation for a given energy — the points sit at opposite ends of a diameter. This is exactly why BPSK is the most power-efficient binary scheme, and half of $d_{\min}$ (the decision-boundary margin) is $\sqrt{E_b}$, which sets the error rate below.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> Detection performance depends on the signal-to-noise ratio <i>at the sampling instant</i> after matched filtering, not on raw waveform power. We derive that sampled SNR for BPSK in AWGN of two-sided density $N_0/2$.</p>

<p><b>Step 1 — matched-filter / correlator output for signal.</b> The optimal receiver correlates $r(t)$ against $\phi(t)$. For a clean symbol $s_i\phi(t)$ the output is the coordinate $s_i=\pm\sqrt{E_b}$. Its squared value (signal "power" at the sample) is $E_b$.</p>

<p><b>Step 2 — noise variance at the output.</b> White noise $n(t)$ projected onto the unit-energy $\phi$ gives $n=\int n(t)\phi(t)dt$, a Gaussian with variance</p>
$$ \sigma^2=\frac{N_0}{2}\int_0^{T_b}\phi^2(t)\,dt=\frac{N_0}{2}. $$

<p><b>Step 3 — form the SNR.</b> The decision statistic is $\pm\sqrt{E_b}+n$. Define sampled SNR as (peak signal)²/(noise variance). But the useful <i>separation-based</i> SNR that drives the error rate uses the half-distance $\sqrt{E_b}$ against $\sigma$, and because the two hypotheses are symmetric the effective SNR is</p>
$$ \mathrm{SNR}_{\text{samp}}=\frac{(\text{signal coordinate})^2}{\text{noise variance}}=\frac{(\sqrt{E_b}\,)^2}{\sigma^2}=\frac{E_b}{N_0/2}=\frac{2E_b}{N_0}. $$
<p>Cleanly: the argument that appears in the error function is $d_{\min}/2\sigma=\sqrt{E_b}/\sqrt{N_0/2}$, whose square is</p>
$$ \left(\frac{d_{\min}/2}{\sigma}\right)^2=\frac{E_b}{N_0/2}=\frac{2E_b}{N_0}. $$

<p><b>Result.</b></p>
$$ \mathrm{SNR}_{\text{samp}}=\frac{2E_b}{N_0}. $$
<p><b>Intuition:</b> the matched filter delivers the full energy $E_b$ as signal while noise is limited to $N_0/2$ per dimension; the factor $2$ is the antipodal bonus. This number plugged into $Q(\sqrt{\cdot})$ gives the BER.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> We now compute the probability the receiver decides the wrong bit. The decision statistic is $z=\pm\sqrt{E_b}+n$ with $n\sim\mathcal N(0,\sigma^2)$, $\sigma^2=N_0/2$, and the ML rule (equiprobable, symmetric) is simply "decide $+1$ if $z>0$".</p>

<p><b>Step 1 — condition on a transmitted bit.</b> Say $+\sqrt{E_b}$ was sent. An error occurs when $z<0$, i.e. when noise drives it below the threshold:</p>
$$ P(\text{error}\mid +) = P\big(\sqrt{E_b}+n<0\big)=P\big(n<-\sqrt{E_b}\big). $$

<p><b>Step 2 — evaluate the Gaussian tail.</b> Standardize with $u=n/\sigma$:</p>
$$ P\big(n<-\sqrt{E_b}\big)=P\!\Big(u<-\tfrac{\sqrt{E_b}}{\sigma}\Big)=Q\!\Big(\tfrac{\sqrt{E_b}}{\sigma}\Big), $$
<p>where $Q(x)=\tfrac1{\sqrt{2\pi}}\int_x^\infty e^{-t^2/2}dt$ is the standard-normal tail. Substitute $\sigma=\sqrt{N_0/2}$:</p>
$$ Q\!\Big(\tfrac{\sqrt{E_b}}{\sqrt{N_0/2}}\Big)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right). $$

<p><b>Step 3 — symmetry removes the conditioning.</b> By identical algebra $P(\text{error}\mid -)$ is the same, so the average BER equals this common value.</p>

<p><b>Step 4 — erfc form.</b> Using $Q(x)=\tfrac12\operatorname{erfc}(x/\sqrt2)$ with $x=\sqrt{2E_b/N_0}$ gives $\tfrac12\operatorname{erfc}(\sqrt{E_b/N_0})$.</p>

<p><b>Result.</b></p>
$$ P_b=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right)=\tfrac12\operatorname{erfc}\!\left(\sqrt{\tfrac{E_b}{N_0}}\right). $$
<p><b>Intuition:</b> the BER is just the area of the Gaussian tail beyond the half-distance $\sqrt{E_b}$ measured in noise units. Doubling $E_b/N_0$ pushes the point deeper into the exponentially thin tail — hence BER falls off very steeply (a "waterfall") with SNR.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Coherent BPSK assumes the receiver's local carrier is phase-aligned with the transmitter. In practice the carrier-recovery loop leaves a residual phase error $\theta$. We ask how BER degrades.</p>

<p><b>Step 1 — effect of misalignment on the correlator.</b> The receiver correlates against $\cos(2\pi f_c t+\theta)$ instead of $\cos(2\pi f_c t)$. The projection of the wanted signal scales by the inner product of the two carriers, which is $\cos\theta$:</p>
$$ \int_0^{T_b}\cos(2\pi f_c t)\cos(2\pi f_c t+\theta)\,dt \propto \cos\theta. $$
<p>So the useful signal coordinate shrinks from $\sqrt{E_b}$ to $\sqrt{E_b}\cos\theta$, while the noise variance $\sigma^2=N_0/2$ is unchanged (projecting white noise onto a unit vector still gives $N_0/2$).</p>

<p><b>Step 2 — re-run the tail calculation.</b> The half-distance in noise units is now $\sqrt{E_b}\cos\theta/\sigma$, so</p>
$$ P_b(\theta)=Q\!\left(\frac{\sqrt{E_b}\cos\theta}{\sqrt{N_0/2}}\right)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\,\cos\theta\right). $$

<p><b>Result.</b></p>
$$ P_b(\theta)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\,\cos\theta\right). $$
<p><b>Intuition:</b> phase error rotates the constellation so only the <i>in-phase projection</i> $\cos\theta$ survives; at $\theta=0$ we recover ideal BPSK, and at $\theta=90^\circ$ the signal collapses onto the noise-only axis ($\cos\theta=0$) giving $P_b=\tfrac12$ — pure guessing.</p>
`,
    6: String.raw`
<p><b>Where we start.</b> A BPSK stream is a random $\pm1$ sequence multiplying a carrier, each symbol shaped by a rectangular pulse of width $T_b$. Its power spectral density (PSD) tells us the bandwidth and out-of-band leakage.</p>

<p><b>Step 1 — PSD of the baseband pulse.</b> For random independent $\pm1$ data with unit-power symbols, the Wiener–Khinchin PSD equals $\tfrac1{T_b}|P(f)|^2$, where $P(f)$ is the Fourier transform of the shaping pulse. A rectangle of width $T_b$ transforms to a sinc:</p>
$$ p(t)=\mathrm{rect}(t/T_b)\;\xrightarrow{\mathcal F}\;P(f)=T_b\,\frac{\sin(\pi f T_b)}{\pi f T_b}=T_b\,\operatorname{sinc}(fT_b). $$
$$ \Rightarrow\; S_{bb}(f)\propto T_b\,\operatorname{sinc}^2(fT_b). $$

<p><b>Step 2 — shift to the carrier.</b> Multiplying baseband data by $\cos(2\pi f_c t)$ shifts the spectrum to $\pm f_c$ (we show the positive side):</p>
$$ S(f)\propto T_b\,\operatorname{sinc}^2\big((f-f_c)T_b\big). $$

<p><b>Result.</b></p>
$$ S(f)\propto T_b\,\operatorname{sinc}^2\big((f-f_c)T_b\big). $$
<p><b>Intuition:</b> the main lobe spans $\pm 1/T_b$ around $f_c$ (null-to-null width $2/T_b$), and the sidelobes fall off slowly ($\propto 1/f^2$) — the sharp edges of the rectangular pulse are what spill energy into neighbors, motivating the smooth pulse shaping covered later.</p>
`
  },

  /* ===================== DBPSK ===================== */
  'dbpsk': {
    0: String.raw`
<p><b>Where we start.</b> Coherent BPSK needs to know the <i>absolute</i> carrier phase. But a $\pi$ phase ambiguity in carrier recovery flips every bit. Differential encoding sidesteps this by putting information in the <b>change</b> of phase between consecutive symbols, not the absolute phase.</p>

<p><b>Step 1 — encode the transition.</b> Let $d_k\in\{0,1\}$ be the data bit and $c_k$ the transmitted (encoded) bit. We define the current encoded bit as the running XOR:</p>
$$ c_k = d_k \oplus c_{k-1}. $$
<p>Equivalently, in phase terms, we <i>add</i> a phase increment $\Delta\theta_k$ (either $0$ for $d_k=0$ or $\pi$ for $d_k=1$) to the previous phase:</p>
$$ \theta_k=\theta_{k-1}+\Delta\theta_k. $$

<p><b>Step 2 — why this helps.</b> If the whole channel rotates every symbol by a constant unknown phase $\varphi$, then $\theta_k\to\theta_k+\varphi$ and $\theta_{k-1}\to\theta_{k-1}+\varphi$; the <i>difference</i> $\theta_k-\theta_{k-1}=\Delta\theta_k$ is untouched. The data survives.</p>

<p><b>Result.</b></p>
$$ c_k = d_k \oplus c_{k-1},\qquad \theta_k=\theta_{k-1}+\Delta\theta_k. $$
<p><b>Intuition:</b> we "differentiate" at the transmitter so the receiver can recover data by comparing neighbors — no absolute phase reference required. The XOR at the receiver ($\hat d_k=c_k\oplus c_{k-1}$) inverts the encoding exactly.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Without an absolute phase reference the receiver can't project onto a known $\cos(2\pi f_c t)$. Instead it uses the <i>previous symbol</i> as its reference, comparing consecutive complex samples $r_k$ and $r_{k-1}$.</p>

<p><b>Step 1 — model the samples.</b> Write each matched-filter output as a complex number $r_k=\sqrt{E_s}\,e^{j\theta_k}e^{j\varphi}+n_k$, where $\varphi$ is the unknown but slowly varying channel phase and $n_k$ is complex Gaussian noise.</p>

<p><b>Step 2 — form the product with the conjugate of the previous sample.</b> To extract the phase <i>difference</i> $\theta_k-\theta_{k-1}$, multiply $r_k$ by $r_{k-1}^*$. Ignoring noise:</p>
$$ r_k r_{k-1}^* = E_s\,e^{j\theta_k}e^{j\varphi}\,e^{-j\theta_{k-1}}e^{-j\varphi}=E_s\,e^{j(\theta_k-\theta_{k-1})}=E_s\,e^{j\Delta\theta_k}. $$
<p>The unknown $\varphi$ cancels. For BPSK $\Delta\theta_k\in\{0,\pi\}$, so $e^{j\Delta\theta_k}=\pm1$ is real.</p>

<p><b>Step 3 — take the real part as the decision variable.</b></p>
$$ z_k=\operatorname{Re}\{r_k r_{k-1}^*\}. $$

<p><b>Result.</b></p>
$$ z_k=\operatorname{Re}\{r_k r_{k-1}^*\}. $$
<p><b>Intuition:</b> $z_k>0$ means the two symbols are in phase ($d_k=0$), $z_k<0$ means they flipped ($d_k=1$). We paid a price: the "reference" is itself noisy, so <i>two</i> noisy symbols now enter each decision — the origin of DBPSK's extra loss.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> We derive the exact BER of differentially-coherent DBPSK, where the decision uses the noisy previous symbol as reference.</p>

<p><b>Step 1 — the error event.</b> An error occurs when $z_k=\operatorname{Re}\{r_kr_{k-1}^*\}$ has the wrong sign. With both $r_k$ and $r_{k-1}$ containing independent Gaussian noise, this is a classic problem: the decision statistic is a quadratic form in complex Gaussians (a difference of two non-central chi-square-like terms).</p>

<p><b>Step 2 — quote the quadratic-form result.</b> For two equal-energy signals compared this way, the exact probability that the real part of the product is negative works out (via the characteristic function of the Hermitian quadratic form, or Proakis's $Q_1-I_0$ formula specialized to antipodal DBPSK) to the remarkably clean</p>
$$ P_b=\tfrac12 e^{-E_b/N_0}. $$
<p>Sketch: writing $z_k$ as $|A|^2-|B|^2$ for suitable rotated Gaussians $A,B$ with equal variance, $P(z_k<0)=P(|B|^2>|A|^2)$ integrates to $\tfrac12 e^{-\text{(SNR)}}$ when the useful component carries energy $E_b$ against noise density $N_0$.</p>

<p><b>Result.</b></p>
$$ P_b=\tfrac12 e^{-E_b/N_0}. $$
<p><b>Intuition:</b> compare to coherent BPSK's $Q(\sqrt{2E_b/N_0})$, whose tail behaves like $\tfrac12 e^{-E_b/N_0}$ too — but coherent BPSK sits inside a $Q$ with the full argument, so at the same BER DBPSK needs slightly more $E_b/N_0$. The clean exponential is the signature of a noncoherent detector.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> "DBPSK costs about 1 dB" is a rule of thumb. Let's see where it comes from by equating BERs.</p>

<p><b>Step 1 — set the two BERs equal at a target.</b> Pick an operating point, say $P_b=10^{-5}$. Coherent BPSK needs $\gamma_{\text{BPSK}}$ with $Q(\sqrt{2\gamma})=10^{-5}\Rightarrow\gamma_{\text{BPSK}}\approx 9.1$ (i.e. $9.6$ dB). DBPSK needs $\gamma_{\text{DBPSK}}$ with $\tfrac12 e^{-\gamma}=10^{-5}\Rightarrow \gamma_{\text{DBPSK}}=\ln(0.5\times10^{5})\approx 10.8$.</p>

<p><b>Step 2 — express the gap in dB.</b></p>
$$ \Delta(\text{dB})=10\log_{10}\frac{\gamma_{\text{DBPSK}}}{\gamma_{\text{BPSK}}}=10\log_{10}\frac{10.8}{9.1}\approx 0.74\text{ dB}. $$
<p>Near practical BERs this penalty ranges from about $0.7$ to $1$ dB, so it is quoted as "$\approx 1$ dB".</p>

<p><b>Result.</b></p>
$$ \Delta(\text{dB})=10\log_{10}\!\frac{(E_b/N_0)_{\text{DBPSK}}}{(E_b/N_0)_{\text{BPSK}}}\approx 1\text{ dB}. $$
<p><b>Intuition:</b> the loss is the toll for using a noisy reference symbol instead of a clean carrier — modest and roughly constant in the waterfall region, which is why DBPSK is popular when carrier recovery is hard.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> A different receiver keeps <i>coherent</i> detection (clean carrier) but still runs the differential XOR decode at the output to resolve phase ambiguity. What does the differential decoding do to BER?</p>

<p><b>Step 1 — raw coherent bit-error probability.</b> Each detected encoded bit $\hat c_k$ is in error with probability $p=Q(\sqrt{2E_b/N_0})$, independently.</p>

<p><b>Step 2 — differential decode couples adjacent bits.</b> The data estimate is $\hat d_k=\hat c_k\oplus\hat c_{k-1}$. A data bit is wrong iff exactly one of the two consecutive encoded bits is wrong:</p>
$$ P_b^{\text{dd}}=P(\text{exactly one of }\hat c_k,\hat c_{k-1}\text{ wrong})=p(1-p)+(1-p)p=2p(1-p). $$

<p><b>Step 3 — small-$p$ limit.</b> At useful SNR $p\ll1$, so $1-p\approx1$:</p>
$$ P_b^{\text{dd}}\approx 2p = 2\,Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right). $$

<p><b>Result.</b></p>
$$ P_b^{\text{dd}}\approx 2\,Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right). $$
<p><b>Intuition:</b> a single channel error now corrupts <i>two</i> decoded data bits (the one it enters and the next comparison), doubling the error rate — a tiny $\approx 0.2$–$0.3$ dB penalty, far less than the $\approx 1$ dB of the noncoherent detector. This is why coherent-plus-differential is the cheaper way to buy ambiguity resolution.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Differential detection tolerates a constant phase but is sensitive to a carrier <b>frequency</b> offset $\Delta f$, which creates a phase that grows between symbols. We quantify the per-symbol rotation.</p>

<p><b>Step 1 — phase is the integral of frequency.</b> A frequency offset $\Delta f$ (Hz) means the received phase advances at rate $2\pi\Delta f$ rad/s. Over one symbol period $T_s$ the accumulated phase is</p>
$$ \Phi=\int_0^{T_s}2\pi\,\Delta f\,dt=2\pi\,\Delta f\,T_s. $$

<p><b>Step 2 — why it matters for DBPSK.</b> The decision variable $r_kr_{k-1}^*$ carries an extra factor $e^{j\Phi}$ that no longer cancels (it's the same each symbol but nonzero). It rotates the constellation by $\Phi$, shrinking the useful $\cos\Phi$ projection just like a static phase error and biasing decisions.</p>

<p><b>Result.</b></p>
$$ \Phi=2\pi\,\Delta f\,T_s. $$
<p><b>Intuition:</b> keep $\Delta f\,T_s\ll1$ (offset small compared to symbol rate) so $\Phi$ stays near zero; otherwise the residual per-symbol twist accumulates into an irreducible error floor. This is why DBPSK links budget for tight frequency accuracy even though they are relaxed about absolute phase.</p>
`
  },

  /* ===================== MATCHED FILTER ===================== */
  'matched-filter': {
    0: String.raw`
<p><b>Where we start.</b> We receive $y(t)=s(t)+n(t)$ over $[0,T]$ with white noise of density $N_0/2$, and pass it through a linear filter $h(t)$, sampling the output at $t=T$. We want to <i>choose $h$</i> to make the sample as reliable as possible. The right figure of merit is the output SNR at the sampling instant.</p>

<p><b>Step 1 — signal component at the output.</b> By convolution, the noise-free output sampled at $T$ is</p>
$$ s_o(T)=\int_0^T s(\tau)\,h(T-\tau)\,d\tau. $$

<p><b>Step 2 — noise power at the output.</b> The filtered noise has variance</p>
$$ E[n_o^2(T)]=\frac{N_0}{2}\int_0^T h^2(T-\tau)\,d\tau. $$

<p><b>Step 3 — define the SNR to maximize.</b></p>
$$ \mathrm{SNR}=\frac{|s_o(T)|^2}{E[n_o^2(T)]}. $$

<p><b>Result.</b></p>
$$ \mathrm{SNR}=\frac{|s_o(T)|^2}{E[n_o^2(T)]}. $$
<p><b>Intuition:</b> this is a ratio of a squared inner product (top) to an energy (bottom). Maximizing such a ratio is precisely what the Cauchy–Schwarz inequality settles — done next.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> We maximize $\mathrm{SNR}=|s_o(T)|^2/E[n_o^2(T)]$ over all filters $h$. The tool is the <b>Cauchy–Schwarz inequality</b>: for real functions, $\big(\int a b\big)^2\le \big(\int a^2\big)\big(\int b^2\big)$, with equality iff $a\propto b$.</p>

<p><b>Step 1 — write both parts with $g(\tau)\equiv h(T-\tau)$.</b></p>
$$ s_o(T)=\int_0^T s(\tau)g(\tau)\,d\tau,\qquad E[n_o^2(T)]=\frac{N_0}{2}\int_0^T g^2(\tau)\,d\tau. $$

<p><b>Step 2 — apply Cauchy–Schwarz to the numerator.</b></p>
$$ |s_o(T)|^2=\Big(\int_0^T s\,g\Big)^2\le \Big(\int_0^T s^2\Big)\Big(\int_0^T g^2\Big). $$

<p><b>Step 3 — divide by the noise term.</b> The $\int g^2$ cancels:</p>
$$ \mathrm{SNR}=\frac{|s_o(T)|^2}{\tfrac{N_0}{2}\int g^2}\le \frac{\big(\int s^2\big)\big(\int g^2\big)}{\tfrac{N_0}{2}\int g^2}=\frac{\int_0^T s^2(\tau)\,d\tau}{N_0/2}=\frac{2E}{N_0}. $$
<p>where $E=\int_0^T s^2$ is the signal energy.</p>

<p><b>Step 4 — equality condition.</b> Cauchy–Schwarz is tight iff $g(\tau)\propto s(\tau)$, i.e. $h(T-\tau)\propto s(\tau)$, giving $h(t)\propto s(T-t)$ — the matched filter.</p>

<p><b>Result.</b></p>
$$ \mathrm{SNR}\le\frac{2E}{N_0},\quad\text{achieved by }h(t)=s(T-t). $$
<p><b>Intuition:</b> no linear filter can do better than $2E/N_0$; only the one whose shape <i>matches</i> the signal reaches it. Notice the peak SNR depends only on <b>energy</b>, not pulse shape — a deep and useful fact.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> The equality condition of Cauchy–Schwarz told us the optimal filter is proportional to a time-reversed, shifted copy of the signal. Let's state and read it.</p>

<p><b>Step 1 — from the equality condition.</b> Optimality required $h(T-\tau)\propto s(\tau)$. Let $t=T-\tau$, so $\tau=T-t$:</p>
$$ h(t)\propto s(T-t). $$
<p>Absorbing the constant into the receiver gain, we take $h(t)=s(T-t)$.</p>

<p><b>Step 2 — interpret the two operations.</b> $s(-t)$ is a <i>time reversal</i>; the $+T$ shift makes the filter causal (nonzero on $[0,T]$). So the matched filter is "flip the signal and delay it."</p>

<p><b>Result.</b></p>
$$ h(t)=s(T-t). $$
<p><b>Intuition:</b> convolving with a flipped copy is the same as <i>correlating</i> with the original — the filter is a template that lights up maximally exactly when the expected pulse fills its memory, i.e. at $t=T$.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> Plug the matched filter $h(t)=s(T-t)$ back into the output and evaluate the peak — this both confirms optimality and reveals a clean identity.</p>

<p><b>Step 1 — substitute into the convolution.</b> With $h(T-\tau)=s(\tau)$,</p>
$$ s_o(T)=\int_0^T s(\tau)\,h(T-\tau)\,d\tau=\int_0^T s(\tau)\,s(\tau)\,d\tau=\int_0^T s^2(\tau)\,d\tau. $$

<p><b>Step 2 — recognize the energy.</b> That integral is by definition the signal energy $E$.</p>

<p><b>Result.</b></p>
$$ s_o(T)=\int_0^T s^2(\tau)\,d\tau=E. $$
<p><b>Intuition:</b> at the sampling instant the matched filter has "collected" the entire signal energy into a single peak of height $E$. Meanwhile noise contributed only $\tfrac{N_0}{2}E$ in variance, so the SNR is $E^2/(\tfrac{N_0}{2}E)=2E/N_0$ — consistent with the bound.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> A matched filter can be implemented two ways: as a convolution with $s(T-t)$, or as an explicit <b>correlator</b> that multiplies by the reference and integrates. We show they give the same sample.</p>

<p><b>Step 1 — write the convolution output at $t=T$.</b></p>
$$ y_o(T)=\int_0^T y(\tau)\,h(T-\tau)\,d\tau. $$

<p><b>Step 2 — substitute $h(T-\tau)=s(\tau)$.</b></p>
$$ y_o(T)=\int_0^T y(\tau)\,s(\tau)\,d\tau. $$

<p>This is exactly a correlator: multiply the received waveform by a stored copy of $s(\tau)$ and integrate over the symbol.</p>

<p><b>Result.</b></p>
$$ y_o(T)=\int_0^T y(\tau)\,s(\tau)\,d\tau. $$
<p><b>Intuition:</b> "flip-and-convolve, then sample" $\equiv$ "multiply-and-integrate." The correlator view makes the projection onto $\phi(t)$ used in signal-space detection literally the same operation — the two pictures of optimal reception are one.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> We want <i>both</i> zero intersymbol interference (a raised-cosine end-to-end response $H_{RC}$) <i>and</i> a matched filter at the receiver. Can we have both? Yes — by splitting the raised cosine.</p>

<p><b>Step 1 — the two requirements.</b> Zero-ISI demands the <i>cascade</i> transmit×receive filter equal the Nyquist raised cosine $H_{RC}(f)$. Matched filtering (in white noise) demands the receive filter be a copy of the transmit filter's spectrum, $H_{rx}(f)=H_{tx}(f)$ (real, up to conjugate/phase).</p>

<p><b>Step 2 — solve the pair.</b> Set $H_{tx}H_{rx}=H_{RC}$ with $H_{tx}=H_{rx}$:</p>
$$ H_{tx}(f)^2=H_{RC}(f)\;\Rightarrow\;H_{tx}(f)=H_{rx}(f)=\sqrt{H_{RC}(f)}. $$
<p>Each is a <b>root-raised-cosine</b> (RRC) filter.</p>

<p><b>Result.</b></p>
$$ H_{tx}(f)=H_{rx}(f)=\sqrt{H_{RC}(f)}. $$
<p><b>Intuition:</b> split the desired Nyquist shape into two identical square-root halves — one at each end. Their product restores the full raised cosine (zero ISI), while the receive half matches the transmit pulse (max SNR). One elegant design satisfies two goals at once.</p>
`,
    6: String.raw`
<p><b>Where we start.</b> Spread-spectrum spreads a symbol over $N$ chips. The correlator/matched filter at the receiver de-spreads, and the SNR gain from this coherent combining is the <b>processing gain</b>. We derive its dB value.</p>

<p><b>Step 1 — coherent vs incoherent addition.</b> Over $N$ chips the wanted signal adds <i>coherently</i>: amplitudes sum, so signal power scales as $N^2$ (or energy accumulates $\propto N$ relative to per-chip). White noise adds <i>incoherently</i>: powers sum, scaling as $N$. The SNR after de-spreading improves by the ratio, a factor $N$.</p>

<p><b>Step 2 — express in dB.</b></p>
$$ G_p=10\log_{10}\!\left(\frac{\mathrm{SNR}_{\text{out}}}{\mathrm{SNR}_{\text{in}}}\right)=10\log_{10}N\ \text{dB}. $$

<p><b>Result.</b></p>
$$ G_p=10\log_{10} N\ \text{dB}. $$
<p><b>Intuition:</b> the matched filter that spans all $N$ chips is what turns spreading into gain — narrowband interference and noise seen over the wide band get suppressed by the same factor $N$ that the desired signal is boosted. Spread by $100\times$ and you buy $20$ dB of margin.</p>
`
  },

  /* ===================== EVM ===================== */
  'evm': {
    0: String.raw`
<p><b>Where we start.</b> Every received symbol $\mathbf r_k$ should land on its ideal constellation point $\mathbf s_k$; impairments (noise, phase noise, nonlinearity) push it off. We want a single scalar summarizing this scatter, normalized so it's comparable across power levels.</p>

<p><b>Step 1 — measure each miss as a vector.</b> The error vector is $\mathbf e_k=\mathbf r_k-\mathbf s_k$, and its squared length $|\mathbf r_k-\mathbf s_k|^2$ is the squared miss distance in the I/Q plane.</p>

<p><b>Step 2 — average the error power.</b> Over $N$ symbols the mean error power is $\tfrac1N\sum_k|\mathbf r_k-\mathbf s_k|^2$.</p>

<p><b>Step 3 — normalize and take the root.</b> Divide by the mean reference power $\tfrac1N\sum_k|\mathbf s_k|^2$ to make it dimensionless, then square-root to return to an amplitude ratio:</p>
$$ \mathrm{EVM}_{\text{rms}}=\sqrt{\dfrac{\tfrac1N\sum_k|\mathbf r_k-\mathbf s_k|^2}{\tfrac1N\sum_k|\mathbf s_k|^2}}. $$

<p><b>Result.</b></p>
$$ \mathrm{EVM}_{\text{rms}}=\sqrt{\dfrac{\frac1N\sum_k|\mathbf r_k-\mathbf s_k|^2}{\frac1N\sum_k|\mathbf s_k|^2}}. $$
<p><b>Intuition:</b> EVM is the RMS error amplitude expressed as a fraction of the signal amplitude — "how blurry is the constellation, as a percentage." Smaller is cleaner.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> EVM as a fraction (e.g. $0.05$) is often quoted in decibels for readability and to sit alongside other dB link-budget terms.</p>

<p><b>Step 1 — it's an amplitude ratio.</b> $\mathrm{EVM}_{\text{rms}}$ is a ratio of RMS voltages, so the dB conversion uses the $20\log_{10}$ rule (amplitudes, not powers):</p>
$$ \mathrm{EVM}_{dB}=20\log_{10}(\mathrm{EVM}_{\text{rms}}). $$

<p><b>Step 2 — sanity numbers.</b> $\mathrm{EVM}=0.1$ (10%) $\to -20$ dB; $\mathrm{EVM}=0.01$ (1%) $\to -40$ dB. More negative = better.</p>

<p><b>Result.</b></p>
$$ \mathrm{EVM}_{dB}=20\log_{10}(\mathrm{EVM}_{\text{rms}}). $$
<p><b>Intuition:</b> since EVM is a voltage ratio, halving the error improves EVM by $6$ dB. The negative sign convention means a "good" transmitter has a large-magnitude negative EVM in dB.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> EVM and SNR both measure "signal vs error power," so they must be two views of the same thing. We derive the link.</p>

<p><b>Step 1 — identify EVM² as an inverse SNR.</b> The numerator of $\mathrm{EVM}^2$ is mean error (≈ noise+distortion) power; the denominator is mean signal power. So</p>
$$ \mathrm{EVM}_{\text{rms}}^2=\frac{P_{\text{error}}}{P_{\text{signal}}}=\frac{1}{\mathrm{SNR}}\;\Rightarrow\;\mathrm{SNR}=\frac{1}{\mathrm{EVM}_{\text{rms}}^2}. $$

<p><b>Step 2 — convert to dB.</b> Take $10\log_{10}$ of the power ratio:</p>
$$ \mathrm{SNR}_{dB}=10\log_{10}\frac{1}{\mathrm{EVM}^2}=-20\log_{10}(\mathrm{EVM}). $$

<p><b>Result.</b></p>
$$ \mathrm{SNR}=\frac{1}{\mathrm{EVM}_{\text{rms}}^2},\qquad \mathrm{SNR}_{dB}\approx-20\log_{10}(\mathrm{EVM}). $$
<p><b>Intuition:</b> EVM is essentially the reciprocal square-root of SNR. A 1% EVM transmitter has $\mathrm{SNR}=10{,}000=40$ dB. The "$\approx$" acknowledges that EVM lumps in <i>distortion</i>, not just Gaussian noise, so it's a slightly conservative SNR proxy.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> The error vector $\mathbf e_k$ has structure: some of it is a pure amplitude (magnitude) error, some is a phase error. Splitting it explains what an impairment is doing.</p>

<p><b>Step 1 — decompose in polar coordinates.</b> Put the ideal point at radius $|\mathbf s_k|$. A received point that is off by $\Delta\text{mag}$ radially and rotated by $\phi_k$ has an error vector with:</p>
<ul>
<li>a <b>radial</b> component $\Delta\text{mag}$ (magnitude error), and</li>
<li>a <b>tangential</b> component of length $\approx|\mathbf s_k|\sin\phi_k$ (arc displacement for a small rotation).</li>
</ul>

<p><b>Step 2 — Pythagoras (the two components are orthogonal).</b></p>
$$ |\mathbf e_k|^2=(\Delta\text{mag})^2+\big(|\mathbf s_k|\sin\phi_k\big)^2. $$

<p><b>Result.</b></p>
$$ |\mathbf e_k|^2=(\Delta\text{mag})^2+\big(|\mathbf s_k|\sin\phi_k\big)^2. $$
<p><b>Intuition:</b> radial errors point to gain/compression problems; tangential errors point to phase noise or timing/carrier errors. If EVM is dominated by the $|\mathbf s_k|\sin\phi_k$ term, chase the phase; if by $\Delta\text{mag}$, chase the amplifier.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> If EVM is really $1/\mathrm{SNR}$, we can predict the BER of an M-QAM link straight from a measured EVM, with no separate noise measurement.</p>

<p><b>Step 1 — start from the M-QAM BER formula.</b> The standard Gray-coded approximation is</p>
$$ P_b\approx\frac{4}{\log_2M}\Big(1-\tfrac1{\sqrt M}\Big)Q\!\left(\sqrt{\frac{3\log_2M}{M-1}\cdot\frac{E_b}{N_0}}\right). $$
<p>The prefactor counts nearest-neighbor decision errors per bit for a square QAM constellation.</p>

<p><b>Step 2 — replace $E_b/N_0$ by EVM.</b> Since $\mathrm{SNR}=E_s/N_0=\log_2M\cdot E_b/N_0$ and $\mathrm{SNR}=1/\mathrm{EVM}^2$, we get $\dfrac{E_b}{N_0}=\dfrac{1}{\log_2M\,\mathrm{EVM}^2}$. Substituting into the $Q$-argument:</p>
$$ \frac{3\log_2M}{M-1}\cdot\frac{E_b}{N_0}=\frac{3\log_2M}{M-1}\cdot\frac{1}{\log_2M\,\mathrm{EVM}^2}=\frac{3}{(M-1)\,\mathrm{EVM}^2}. $$

<p><b>Result.</b></p>
$$ P_b\approx\frac{4}{\log_2M}\Big(1-\tfrac1{\sqrt M}\Big)Q\!\left(\sqrt{\frac{3}{M-1}\cdot\frac{1}{\mathrm{EVM}^2}}\right). $$
<p><b>Intuition:</b> a single EVM number predicts BER — the $3/(M-1)$ factor is the constellation's minimum-distance penalty, so denser QAM (bigger $M$) needs much smaller EVM for the same BER. (The spec writes the argument grouping $3\log_2M/(M-1)\cdot 1/\mathrm{EVM}^2$ when EVM is normalized per-bit; both reduce to the same nearest-neighbor distance.)</p>
`,
    5: String.raw`
<p><b>Where we start.</b> A test instrument (VSA) has its own residual EVM. The measured EVM is inflated by the instrument's contribution; we want the <i>true</i> device EVM.</p>

<p><b>Step 1 — errors add in power, if independent.</b> The device error vector and the instrument error vector are uncorrelated, so their <b>powers</b> (squared magnitudes) add:</p>
$$ \mathrm{EVM}_{\text{meas}}^2=\mathrm{EVM}_{\text{true}}^2+\mathrm{EVM}_{\text{inst}}^2. $$

<p><b>Step 2 — subtract to de-embed.</b> Solve for the device-only term:</p>
$$ \mathrm{EVM}_{\text{true}}^2\approx\mathrm{EVM}_{\text{meas}}^2-\mathrm{EVM}_{\text{inst}}^2. $$

<p><b>Result.</b></p>
$$ \mathrm{EVM}_{\text{true}}^2\approx\mathrm{EVM}_{\text{meas}}^2-\mathrm{EVM}_{\text{inst}}^2. $$
<p><b>Intuition:</b> because errors combine in RMS (root-sum-square), you subtract in squares — just like removing noise-figure of a test set. It only works when the instrument is meaningfully better than the DUT; if $\mathrm{EVM}_{\text{inst}}\approx\mathrm{EVM}_{\text{meas}}$ the difference is unreliable.</p>
`
  },

  /* ===================== PULSE SHAPING ===================== */
  'pulse-shaping': {
    0: String.raw`
<p><b>Where we start.</b> We transmit $\sum_k a_k\,p(t-kT)$. At the receiver we sample at $t=mT$. We want the sample to depend only on symbol $a_m$, with <b>no leakage</b> from neighbors — zero intersymbol interference (ISI).</p>

<p><b>Step 1 — write the sample.</b> The sample at $t=mT$ is</p>
$$ y(mT)=\sum_k a_k\,p(mT-kT)=\sum_k a_k\,p\big((m-k)T\big). $$

<p><b>Step 2 — demand only the $k=m$ term survives.</b> For $y(mT)=a_m$ exactly, every other tap $p((m-k)T)$ with $k\neq m$ must vanish, and the $k=m$ tap must be $1$. Letting $n=m-k$:</p>
$$ p(nT)=\delta_{n,0}=\begin{cases}1,&n=0\\0,&n\neq0.\end{cases} $$

<p><b>Result.</b></p>
$$ p(kT)=\delta_{k,0}=\begin{cases}1,&k=0\\0,&k\neq0.\end{cases} $$
<p><b>Intuition:</b> the pulse is allowed to ripple wildly <i>between</i> samples, but at the integer sampling instants it must pass through zero everywhere except its own peak. That single time-domain condition is the whole game of ISI-free signaling.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> The time-domain condition $p(kT)=\delta_{k,0}$ is awkward to check on a pulse we design in the frequency domain. We convert it into an equivalent statement about $P(f)$.</p>

<p><b>Step 1 — sampling in time = periodizing in frequency.</b> The sampled sequence $p(kT)$ has a discrete-time spectrum equal to the periodic sum of $P(f)$ (aliasing formula):</p>
$$ \sum_k p(kT)\,e^{-j2\pi f kT}=\frac1T\sum_{n=-\infty}^{\infty}P\!\left(f-\frac nT\right). $$

<p><b>Step 2 — impose the delta condition.</b> If $p(kT)=\delta_{k,0}$, the left side is just $p(0)=1$ (only the $k=0$ term). Hence the right side is constant:</p>
$$ \frac1T\sum_{n}P\!\left(f-\frac nT\right)=1\;\Rightarrow\;\sum_{n=-\infty}^{\infty}P\!\left(f-\frac nT\right)=T. $$

<p><b>Result.</b></p>
$$ \sum_{n=-\infty}^{\infty}P\!\left(f-\frac{n}{T}\right)=T. $$
<p><b>Intuition:</b> tile shifted copies of the pulse spectrum spaced by $1/T$; if they add up to a <i>flat</i> constant $T$, there is no ISI. This "folded spectrum is flat" picture is the Nyquist criterion, and it's what lets the raised cosine's overlapping skirts cancel exactly.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> The absolute minimum bandwidth for zero ISI at symbol rate $R_s=1/T$ is the brick-wall $1/2T$ (Nyquist). Practical pulses use a raised cosine with roll-off $\beta\in[0,1]$, which trades a little extra bandwidth for realizability. We find that bandwidth.</p>

<p><b>Step 1 — the flat part and the roll-off.</b> The raised-cosine spectrum is flat up to $(1-\beta)/2T$, then rolls off as a cosine to zero at $(1+\beta)/2T$. The highest frequency with any energy is the edge of the roll-off:</p>
$$ B=\frac{1+\beta}{2T}. $$

<p><b>Step 2 — in terms of symbol rate.</b> With $R_s=1/T$,</p>
$$ B=\frac{(1+\beta)R_s}{2}. $$

<p><b>Result.</b></p>
$$ B=\frac{(1+\beta)R_s}{2}=\frac{1+\beta}{2T}. $$
<p><b>Intuition:</b> $\beta=0$ gives the ideal (unbuildable) $1/2T$; $\beta=1$ doubles it to $1/T$. The "excess bandwidth" $\beta$ is literally the fractional overshoot beyond Nyquist you pay for a gentler, implementable pulse with faster-decaying tails.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> We build the time-domain pulse whose spectrum is the raised cosine, to see how it satisfies the zero-ISI condition explicitly.</p>

<p><b>Step 1 — the two factors.</b> The raised-cosine spectrum is the product of a rectangle (bandwidth $1/2T$) and a cosine roll-off. Inverse-transforming the rectangle gives a $\operatorname{sinc}$; the cosine roll-off contributes the $\cos(\pi\beta t/T)$ term, and the specific spectral shape produces the $1/(1-(2\beta t/T)^2)$ denominator:</p>
$$ p_{RC}(t)=\operatorname{sinc}\!\left(\frac tT\right)\cdot\frac{\cos(\pi\beta t/T)}{1-(2\beta t/T)^2}. $$

<p><b>Step 2 — check zero-ISI.</b> The $\operatorname{sinc}(t/T)$ factor is already zero at every $t=kT,\,k\neq0$, and equals $1$ at $t=0$; the second factor is finite there. So $p_{RC}(kT)=\delta_{k,0}$ — the Nyquist condition holds.</p>

<p><b>Result.</b></p>
$$ p_{RC}(t)=\operatorname{sinc}\!\left(\frac{t}{T}\right)\frac{\cos(\pi\beta t/T)}{1-(2\beta t/T)^2}. $$
<p><b>Intuition:</b> it's a sinc (which alone gives zero ISI but decays only as $1/t$) multiplied by a window that makes the tails die like $1/t^3$. Faster decay means less sensitivity to timing error — the practical payoff of roll-off. (At $t=T/2\beta$ the denominator vanishes; the finite limit there gives the well-known $\pi/4$ value.)</p>
`,
    4: String.raw`
<p><b>Where we start.</b> We want zero ISI <i>and</i> a matched receive filter. The raised cosine $P_{RC}$ is the desired end-to-end shape; the matched-filter condition wants transmit = receive. We split $P_{RC}$ between the two ends.</p>

<p><b>Step 1 — factor the target spectrum.</b> Require the cascade to equal $P_{RC}$ and the two filters to be identical (matched, in white noise):</p>
$$ H_{Tx}(f)H_{Rx}(f)=P_{RC}(f),\qquad H_{Tx}=H_{Rx}. $$
<p>Then each is the square root:</p>
$$ H_{Tx}(f)=H_{Rx}(f)=\sqrt{P_{RC}(f)}. $$

<p><b>Step 2 — verify the product.</b></p>
$$ H_{Tx}(f)H_{Rx}(f)=\big(\sqrt{P_{RC}(f)}\big)^2=P_{RC}(f). $$
<p>ISI-free at the sampler, and each end is a root-raised-cosine (RRC).</p>

<p><b>Result.</b></p>
$$ H_{Tx}(f)=H_{Rx}(f)=\sqrt{P_{RC}(f)}\;\Rightarrow\;H_{Tx}H_{Rx}=P_{RC}(f). $$
<p><b>Intuition:</b> neither the transmitted pulse nor the received pulse is itself Nyquist — only their <i>product</i> is. Splitting the roll-off symmetrically is what lets you have optimal SNR and zero ISI simultaneously, which is why RRC is the workhorse of real modems.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> With M-ary symbols and raised-cosine shaping, how many bits per second per Hz do we get? That's spectral efficiency $\eta=R_b/B$.</p>

<p><b>Step 1 — bit rate from symbol rate.</b> Each symbol carries $\log_2M$ bits, so $R_b=R_s\log_2M$.</p>

<p><b>Step 2 — bandwidth from pulse shaping.</b> From the raised-cosine result, $B=(1+\beta)R_s/2$ for a baseband channel — but for a passband (double-sideband) system the occupied bandwidth is $(1+\beta)R_s$. Using that,</p>
$$ \eta=\frac{R_b}{B}=\frac{R_s\log_2M}{(1+\beta)R_s}=\frac{\log_2M}{1+\beta}. $$

<p><b>Result.</b></p>
$$ \eta=\frac{R_b}{B}=\frac{\log_2 M}{1+\beta}\ \text{bits/s/Hz}. $$
<p><b>Intuition:</b> richer alphabets ($\uparrow M$) buy more bits per hertz; gentler roll-off ($\uparrow\beta$) costs bandwidth and lowers $\eta$. E.g. 16-QAM ($\log_2M=4$) with $\beta=0.25$ gives $4/1.25=3.2$ bit/s/Hz — the fundamental rate-vs-bandwidth trade a system designer tunes.</p>
`
  },

  /* ===================== EYE DIAGRAM ===================== */
  'eye-diagram': {
    0: String.raw`
<p><b>Where we start.</b> An eye diagram overlays many symbol-length slices of the waveform. For M-level PAM the signal visits $M$ amplitude levels; between them appear the open regions ("eyes"). How many eyes?</p>

<p><b>Step 1 — count the levels and the gaps.</b> M-PAM has $M$ distinct decision levels. An "eye" is the open gap <i>between</i> two adjacent levels. With $M$ levels laid out on a line there are $M-1$ gaps.</p>
$$ N_{\text{eyes}}=M-1. $$

<p><b>Result.</b></p>
$$ N_{\text{eyes}}=M-1. $$
<p><b>Intuition:</b> binary (2-PAM) shows $2-1=1$ eye — the classic single opening; 4-PAM shows $3$ stacked eyes. Each eye corresponds to one decision threshold, so counting eyes is a quick visual check of the modulation order.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> The vertical opening of the eye at the sampling instant is the gap between the highest "low" trace and the lowest "high" trace. It sets how much noise the detector can absorb before crossing the threshold.</p>

<p><b>Step 1 — where the threshold sits.</b> The optimal decision threshold is centered in the eye. The distance from the threshold to the nearest trace is half the vertical opening.</p>

<p><b>Step 2 — that half-gap is the noise margin.</b> Noise must exceed this half-gap to cause an error:</p>
$$ \text{NM}=\tfrac12\,(\text{vertical eye opening}). $$

<p><b>Result.</b></p>
$$ \text{NM}=\frac12\,(\text{vertical eye opening}). $$
<p><b>Intuition:</b> the taller the eye, the more instantaneous noise the receiver tolerates. ISI closes the eye from top and bottom, directly eating into this margin — which is why a "wide-open eye" is shorthand for a healthy link.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> ISI shrinks the eye opening from its ideal height $A$ to a reduced height $A'$. This lost amplitude is an effective SNR penalty; we express it in dB.</p>

<p><b>Step 1 — amplitude ratio to dB.</b> The detector's effective signal amplitude drops from $A$ to $A'$, a voltage ratio. Convert with the $20\log_{10}$ rule:</p>
$$ \Delta_{\text{dB}}=20\log_{10}\!\left(\frac{A}{A'}\right). $$

<p><b>Step 2 — read it.</b> Since $A'\le A$, the ratio $\ge1$ and $\Delta_{\text{dB}}\ge0$: a positive penalty, i.e. extra $E_b/N_0$ needed to overcome the closed eye.</p>

<p><b>Result.</b></p>
$$ \Delta_{\text{dB}}=20\log_{10}\!\left(\frac{A}{A'}\right). $$
<p><b>Intuition:</b> if ISI closes the eye to half height ($A'=A/2$), that's $20\log_{10}2\approx6$ dB of lost margin — you'd need $6$ dB more power to get the same BER. The eye's <i>vertical</i> closure maps directly to dB of SNR loss.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> Within each symbol period the eye is most open at one instant and closes toward the transitions. We want the best time to sample.</p>

<p><b>Step 1 — define the objective.</b> Let $V(t)$ be the vertical eye opening as a function of sampling phase $t\in[0,T)$. Larger opening = larger noise margin, so we maximize it:</p>
$$ t^\star=\arg\max_{t\in[0,T)}\big[V(t)\big]. $$

<p><b>Result.</b></p>
$$ t^\star=\arg\max_{t\in[0,T)}\big[\text{vertical eye opening}(t)\big]. $$
<p><b>Intuition:</b> the peak of the eye is where signal levels are most separated and ISI contributions momentarily cancel (the Nyquist zero-crossings of neighbors). A timing-recovery loop's entire job is to lock the sampler onto $t^\star$ — sample early or late and you slide down the eye into the noisy transition region.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> The <i>horizontal</i> eye opening — how wide the eye stays open in time — tells us how much timing error the receiver can survive. We express it as a timing margin.</p>

<p><b>Step 1 — start from a full symbol period.</b> Ideally the eye is open across the whole period $T$. Two effects narrow it:</p>
<ul>
<li>timing <b>jitter</b> peak-to-peak, $t_{\text{jitter,pp}}$, which smears the zero-crossings, and</li>
<li>ISI <b>spread</b>, $t_{\text{ISI-spread}}$, which pushes the crossings inward.</li>
</ul>

<p><b>Step 2 — subtract the losses.</b> The remaining open width is the timing margin:</p>
$$ \text{TM}=W_{\text{eye}}=T-t_{\text{jitter,pp}}-t_{\text{ISI-spread}}. $$

<p><b>Result.</b></p>
$$ \text{TM}=W_{\text{eye}}=T-t_{\text{jitter,pp}}-t_{\text{ISI-spread}}. $$
<p><b>Intuition:</b> the wider the eye horizontally, the more sampling-clock error you can tolerate before falling out of the open region. Vertical opening buys noise margin; horizontal opening buys timing margin — the eye diagram shows both at once.</p>
`
  },

  /* ===================== BER ===================== */
  'ber': {
    0: String.raw`
<p><b>Where we start.</b> BER is the master figure of merit. For the two most common coherent schemes — BPSK and QPSK — we derive the same clean expression from the Gaussian tail.</p>

<p><b>Step 1 — BPSK.</b> Antipodal signals at $\pm\sqrt{E_b}$, noise $\sigma^2=N_0/2$. An error is noise crossing the half-distance:</p>
$$ P_b=Q\!\left(\frac{\sqrt{E_b}}{\sqrt{N_0/2}}\right)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right). $$

<p><b>Step 2 — QPSK is two orthogonal BPSKs.</b> QPSK sends two independent bits on the I and Q carriers, each with energy $E_b$ per bit. Because $\cos$ and $\sin$ are orthogonal, the two bit streams don't interfere, so each has exactly the BPSK BER — QPSK's per-bit BER is identical.</p>

<p><b>Step 3 — erfc form.</b> Using $Q(x)=\tfrac12\operatorname{erfc}(x/\sqrt2)$ with $x=\sqrt{2E_b/N_0}$:</p>
$$ P_b=\tfrac12\operatorname{erfc}\!\left(\sqrt{\tfrac{E_b}{N_0}}\right). $$

<p><b>Result.</b></p>
$$ P_b=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right)=\tfrac12\operatorname{erfc}\!\left(\sqrt{\tfrac{E_b}{N_0}}\right). $$
<p><b>Intuition:</b> QPSK gives twice the bit rate of BPSK in the same bandwidth <i>for free</i> in BER terms — the orthogonality of I and Q is the reason it's the default choice in most systems.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Detectors decide <i>symbols</i>; users care about <i>bits</i>. With Gray coding we relate symbol error rate (SER) to bit error rate (BER).</p>

<p><b>Step 1 — Gray coding minimizes bit flips per symbol error.</b> Gray labeling ensures adjacent constellation points differ in exactly one bit. The overwhelmingly most likely symbol error is a slip to a <i>neighbor</i>, which corrupts just $1$ of the $\log_2M$ bits in that symbol.</p>

<p><b>Step 2 — divide the error budget across bits.</b> A symbol error flips ~1 bit out of $\log_2M$, so on average the fraction of <i>bits</i> in error is the fraction of <i>symbols</i> in error divided by $\log_2M$:</p>
$$ \text{BER}\approx\frac{\text{SER}}{\log_2 M}. $$

<p><b>Result.</b></p>
$$ \text{BER}\approx\frac{\text{SER}}{\log_2 M}. $$
<p><b>Intuition:</b> without Gray coding a single symbol slip could flip many bits; Gray coding guarantees ~one, so the BER is just the SER spread over the $\log_2M$ bits the symbol carries. It's an approximation because rare non-neighbor errors flip more bits.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Square M-QAM is two independent $\sqrt M$-PAM constellations on I and Q. We assemble its BER from the PAM error probability.</p>

<p><b>Step 1 — error rate of one $\sqrt M$-PAM axis.</b> A $\sqrt M$-level PAM has $\sqrt M-1$ interior decision boundaries. The symbol-error probability per axis is $2\big(1-\tfrac1{\sqrt M}\big)Q\!\big(\sqrt{\tfrac{3}{M-1}\cdot\tfrac{E_s}{N_0}}\big)$; the $3/(M-1)$ is the ratio of minimum-distance-squared to average symbol energy for uniform PAM.</p>

<p><b>Step 2 — combine I and Q, convert symbols→bits.</b> Two axes, Gray-coded, and $E_s=\log_2M\,E_b$. Dividing by $\log_2M$ bits per symbol and collecting the factor gives the standard approximation:</p>
$$ P_b\approx\frac{4}{\log_2M}\Big(1-\frac1{\sqrt M}\Big)Q\!\left(\sqrt{\frac{3\log_2M}{M-1}\,\frac{E_b}{N_0}}\right). $$

<p><b>Result.</b></p>
$$ P_b\approx\frac{4}{\log_2 M}\Big(1-\frac{1}{\sqrt M}\Big)Q\!\left(\sqrt{\frac{3\log_2 M}{M-1}\frac{E_b}{N_0}}\right). $$
<p><b>Intuition:</b> the $3/(M-1)$ inside the $Q$ is the crowding penalty — packing more points into the same average power shrinks the minimum distance, so denser QAM needs far more $E_b/N_0$ for the same BER.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> M-PSK puts all points on a circle of radius $\sqrt{E_s}$. The dominant error is a slip to an adjacent point across the nearest decision boundary; we find its BER.</p>

<p><b>Step 1 — distance to the nearest boundary.</b> Adjacent PSK points are separated by angle $2\pi/M$. The decision boundary sits halfway; the perpendicular distance from a point to it is $\sqrt{E_s}\sin(\pi/M)$.</p>

<p><b>Step 2 — symbol error from the Gaussian tail.</b> Two nearest neighbors, so $\mathrm{SER}\approx 2Q\!\big(\sqrt{E_s}\sin(\pi/M)/\sqrt{N_0/2}\big)=2Q\!\big(\sqrt{2E_s/N_0}\,\sin(\pi/M)\big)$.</p>

<p><b>Step 3 — symbols → bits (Gray).</b> Divide by $\log_2M$ and substitute $E_s=\log_2M\,E_b$:</p>
$$ P_b\approx\frac{2}{\log_2M}Q\!\left(\sqrt{\frac{2E_b\log_2M}{N_0}}\,\sin\frac{\pi}{M}\right). $$

<p><b>Result.</b></p>
$$ P_b\approx\frac{2}{\log_2 M}\,Q\!\left(\sqrt{\frac{2E_b\log_2 M}{N_0}}\,\sin\frac{\pi}{M}\right). $$
<p><b>Intuition:</b> the $\sin(\pi/M)$ is the angular crowding penalty — doubling $M$ roughly halves this sine, so high-order PSK rapidly loses power efficiency. For $M=2$ ($\sin\tfrac\pi2=1$) and $M=4$ it reduces correctly to the BPSK/QPSK result.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> To <i>measure</i> a small BER we must observe enough bits to see errors. How many bits $N$ guarantee, with confidence level $CL$, that we'd catch a link at a given BER?</p>

<p><b>Step 1 — model errors as rare (Poisson).</b> With $N$ bits at error rate $\text{BER}$, the expected error count is $\lambda=N\cdot\text{BER}$. The probability of observing <i>zero</i> errors is $P(0)=e^{-\lambda}$.</p>

<p><b>Step 2 — require confidence that we wouldn't miss it.</b> We want the chance of at least one error to be $\ge CL$: $1-e^{-\lambda}\ge CL$, i.e. $e^{-\lambda}\le 1-CL$. Take logs:</p>
$$ -\lambda\le\ln(1-CL)\;\Rightarrow\;\lambda\ge-\ln(1-CL). $$
<p>Substitute $\lambda=N\cdot\text{BER}$ and solve for $N$:</p>
$$ N=\frac{-\ln(1-CL)}{\text{BER}}. $$

<p><b>Result.</b></p>
$$ N=\frac{-\ln(1-CL)}{\text{BER}}. $$
<p><b>Intuition:</b> for 95% confidence, $-\ln(0.05)\approx3$, so you need about $3/\text{BER}$ bits — to confirm $\text{BER}=10^{-9}$ you must push ~$3\times10^{9}$ bits error-free. Lower target BER means quadratically longer tests: the reason BER testing is slow.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Sometimes we don't have a noise measurement but we do have a constellation and its EVM. We chain EVM→SNR→$E_b/N_0$ to feed the BER formulas.</p>

<p><b>Step 1 — EVM to SNR.</b> As shown for EVM, error power over signal power is $\mathrm{EVM}^2$, so</p>
$$ \text{SNR}\approx\frac{1}{\text{EVM}_{\text{rms}}^2}. $$

<p><b>Step 2 — SNR (per symbol) to $E_b/N_0$ (per bit).</b> SNR here is $E_s/N_0$, and each symbol carries $\log_2M$ bits, so divide:</p>
$$ \frac{E_b}{N_0}=\frac{E_s/N_0}{\log_2M}=\frac{\text{SNR}}{\log_2 M}. $$

<p><b>Result.</b></p>
$$ \text{SNR}\approx\frac{1}{\text{EVM}_{\text{rms}}^2}\;\Rightarrow\;\frac{E_b}{N_0}=\frac{\text{SNR}}{\log_2 M}. $$
<p><b>Intuition:</b> a measured EVM becomes an $E_b/N_0$, which the $Q$-function turns into a predicted BER — one lab measurement (EVM) forecasts link reliability without ever counting bit errors.</p>
`
  },

  /* ===================== Eb/N0 ===================== */
  'eb-no': {
    0: String.raw`
<p><b>Where we start.</b> Comparing modulations by raw SNR is unfair — a scheme using more bandwidth "sees" more noise. The fair, normalized metric is energy per <i>bit</i> over noise density, $E_b/N_0$. We derive it from powers and rates.</p>

<p><b>Step 1 — energy per bit.</b> Signal power $S$ delivering $R_b$ bits/s spreads that power over the bits, so each bit carries energy</p>
$$ E_b=\frac{S}{R_b}. $$

<p><b>Step 2 — noise power spectral density.</b> Total noise power $N$ occupies bandwidth $B$ with flat density</p>
$$ N_0=\frac{N}{B}. $$

<p><b>Step 3 — take the ratio.</b></p>
$$ \frac{E_b}{N_0}=\frac{S/R_b}{N/B}=\frac{S}{N}\cdot\frac{B}{R_b}. $$

<p><b>Result.</b></p>
$$ \frac{E_b}{N_0}=\frac{S/R_b}{N/B}=\frac{S}{N}\cdot\frac{B}{R_b}. $$
<p><b>Intuition:</b> $E_b/N_0$ is SNR "de-rated" by the bandwidth expansion factor $B/R_b$. Two systems with the same $E_b/N_0$ are on equal footing regardless of how much bandwidth each uses — which is exactly why BER curves are always plotted against it.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> We often need to go the other way — from a target $E_b/N_0$ to the SNR the receiver actually experiences. Invert the definition.</p>

<p><b>Step 1 — solve the definition for SNR.</b> From $\dfrac{E_b}{N_0}=\dfrac{S}{N}\cdot\dfrac{B}{R_b}$, multiply both sides by $R_b/B$:</p>
$$ \text{SNR}=\frac{S}{N}=\frac{E_b}{N_0}\cdot\frac{R_b}{B}. $$

<p><b>Step 2 — recognize spectral efficiency.</b> The factor $R_b/B$ is the spectral efficiency $\eta$ (bits/s/Hz):</p>
$$ \text{SNR}=\frac{E_b}{N_0}\cdot\eta. $$

<p><b>Result.</b></p>
$$ \text{SNR}=\frac{E_b}{N_0}\cdot\frac{R_b}{B}=\frac{E_b}{N_0}\cdot\eta. $$
<p><b>Intuition:</b> the more bits you cram per hertz ($\uparrow\eta$), the higher the SNR you need for the same per-bit quality. A bandwidth-efficient system ($\eta>1$) runs at an SNR <i>above</i> its $E_b/N_0$; a bandwidth-expanding one (spread spectrum, $\eta<1$) runs below it.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Some formulas use energy per <i>symbol</i> $E_s$, others energy per <i>bit</i> $E_b$. We relate them for M-ary modulation.</p>

<p><b>Step 1 — bits per symbol.</b> An M-ary symbol carries $\log_2M$ bits. If each bit has energy $E_b$ and the bits share a symbol, the symbol energy is their sum:</p>
$$ E_s=\log_2M\cdot E_b. $$

<p><b>Step 2 — divide by the common $N_0$.</b></p>
$$ \frac{E_s}{N_0}=\log_2M\cdot\frac{E_b}{N_0}. $$

<p><b>Result.</b></p>
$$ \frac{E_s}{N_0}=\log_2 M\cdot\frac{E_b}{N_0}. $$
<p><b>Intuition:</b> a 16-QAM symbol packs $4$ bits, so its per-symbol SNR is $4\times$ ($6$ dB above) the per-bit value. Always convert to $E_b/N_0$ before comparing modulations of different orders — that's the level playing field.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> Shannon's capacity sets the minimum $E_b/N_0$ for reliable communication at a given spectral efficiency $\eta$. We derive the bound and its famous limit.</p>

<p><b>Step 1 — start from capacity.</b> The AWGN capacity is $C=B\log_2(1+\text{SNR})$. Reliable transmission needs $R_b\le C$; at the boundary $R_b=C$, so $\eta=R_b/B=\log_2(1+\text{SNR})$. Hence $\text{SNR}=2^{\eta}-1$.</p>

<p><b>Step 2 — convert SNR to $E_b/N_0$.</b> Using $\text{SNR}=\dfrac{E_b}{N_0}\eta$:</p>
$$ \frac{E_b}{N_0}\,\eta=2^{\eta}-1\;\Rightarrow\;\frac{E_b}{N_0}=\frac{2^{\eta}-1}{\eta}. $$
<p>Operating reliably requires being at or above this, so $\dfrac{E_b}{N_0}\ge\dfrac{2^{\eta}-1}{\eta}$.</p>

<p><b>Step 3 — take the bandwidth-unlimited limit $\eta\to0$.</b> Expand $2^{\eta}=e^{\eta\ln2}\approx1+\eta\ln2$ for small $\eta$:</p>
$$ \frac{2^{\eta}-1}{\eta}\approx\frac{\eta\ln2}{\eta}=\ln2\approx0.693. $$
<p>In dB: $10\log_{10}(0.693)=-1.59$ dB.</p>

<p><b>Result.</b></p>
$$ \frac{E_b}{N_0}\ge\frac{2^{\eta}-1}{\eta}\;\xrightarrow{\eta\to0}\;\ln2=-1.59\text{ dB}. $$
<p><b>Intuition:</b> no matter how clever the code, you cannot communicate reliably below $-1.59$ dB of $E_b/N_0$. This "Shannon limit" is the hard wall every coding scheme (turbo, LDPC, polar) races to approach.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> In a real link we compute the received $E_b/N_0$ from received power and system noise — the endpoint of a link budget.</p>

<p><b>Step 1 — energy per bit at the receiver.</b> Received power $P_{rx}$ over bit rate $R_b$ gives $E_b=P_{rx}/R_b$.</p>

<p><b>Step 2 — noise density from thermal noise.</b> The noise PSD is $N_0=kT_{sys}$, where $k$ is Boltzmann's constant and $T_{sys}$ is the system noise temperature (antenna + receiver).</p>

<p><b>Step 3 — assemble.</b></p>
$$ \frac{E_b}{N_0}=\frac{E_b}{N_0}=\frac{P_{rx}/R_b}{N_0}=\frac{P_{rx}}{N_0 R_b}=\frac{P_{rx}}{k T_{sys} R_b}. $$

<p><b>Result.</b></p>
$$ \frac{E_b}{N_0}=\frac{P_{rx}}{N_0 R_b}=\frac{P_{rx}}{k T_{sys} R_b}. $$
<p><b>Intuition:</b> the received $E_b/N_0$ falls if you raise the data rate (less energy per bit) or run a hotter/noisier receiver (bigger $T_{sys}$). This single expression connects antenna gain, path loss (through $P_{rx}$), receiver quality, and data rate to the BER you'll ultimately achieve.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Closing the loop: once we have $E_b/N_0$, the BER of the workhorse coherent schemes follows immediately.</p>

<p><b>Step 1 — recall the antipodal error probability.</b> For BPSK/QPSK the decision is noise crossing the half-distance $\sqrt{E_b}$ against $\sigma=\sqrt{N_0/2}$, giving the Gaussian tail:</p>
$$ P_b=Q\!\left(\frac{\sqrt{E_b}}{\sqrt{N_0/2}}\right)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right). $$

<p><b>Result.</b></p>
$$ P_b=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right). $$
<p><b>Intuition:</b> BER is a monotone (steeply decreasing) function of $E_b/N_0$ alone — the "waterfall" curve. Every dB of link-budget margin you earn slides you down that curve; near $10^{-5}$ each extra dB cuts the error rate by roughly an order of magnitude.</p>
`
  }

});
