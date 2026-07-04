// Normal (Gaussian) Distribution — Probability & Random Signals
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'normal-distribution',
    title: 'Normal (Gaussian) Distribution',
    category: 'Probability & Random Signals',
    tags: ['gaussian', 'pdf', 'variance', 'central limit theorem', 'z-score', 'Q-function', 'thermal noise'],
    summary: String.raw`The normal distribution is the bell-shaped probability law that the sum of many independent random effects converges to, making it the default model for thermal noise, measurement error, and the decision variables at a receiver.`,
    diagram: [
    {
      title: String.raw`Anatomy of the bell curve (mean, sigma, 68-95-99.7)`,
      svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-normal-distribution" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">The Gaussian PDF and its 68-95-99.7 bands</text>
        <line x1="40" y1="185" x2="500" y2="185" stroke="#9aa7b5" marker-end="url(#arr-normal-distribution)"/>
        <line x1="270" y1="185" x2="270" y2="55" stroke="#4dabf7" stroke-dasharray="4 3"/>
        <path d="M40,185 C150,185 200,80 270,60 C340,80 390,185 500,185" fill="none" stroke="#63e6be" stroke-width="2"/>
        <text x="270" y="200" fill="#4dabf7" text-anchor="middle">mu (centre)</text>
        <line x1="200" y1="185" x2="200" y2="120" stroke="#ffa94d" stroke-dasharray="3 3"/>
        <line x1="340" y1="185" x2="340" y2="120" stroke="#ffa94d" stroke-dasharray="3 3"/>
        <text x="200" y="200" fill="#ffa94d" text-anchor="middle">mu-sigma</text>
        <text x="340" y="200" fill="#ffa94d" text-anchor="middle">mu+sigma</text>
        <text x="270" y="110" fill="#e6edf3" text-anchor="middle">68.3%</text>
        <text x="270" y="150" fill="#9aa7b5" text-anchor="middle">within +/- 1 sigma</text>
        <text x="130" y="90" fill="#b197fc">95.4% within 2 sigma</text>
        <text x="130" y="108" fill="#b197fc">99.7% within 3 sigma</text>
        <text x="215" y="95" fill="#9aa7b5" font-size="10">inflection at mu +/- sigma</text>
      </svg>`,
      caption: String.raw`The bell curve peaks at the mean mu and has its inflection points exactly one standard deviation sigma out; the area under it splits into the famous 68.3 / 95.4 / 99.7 percent bands at +/- 1, 2, 3 sigma.`
    },
    {
      title: String.raw`Central Limit Theorem: arbitrary RVs sum to a Gaussian`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-normal-distribution" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Central Limit Theorem: many arbitrary effects add to a bell</text>
        <rect x="24" y="50" width="96" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="72" y="68" fill="#e6edf3" text-anchor="middle">X1 (uniform)</text><text x="72" y="83" fill="#9aa7b5" font-size="9" text-anchor="middle">any shape</text>
        <rect x="24" y="100" width="96" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="72" y="118" fill="#e6edf3" text-anchor="middle">X2 (skewed)</text><text x="72" y="133" fill="#9aa7b5" font-size="9" text-anchor="middle">any shape</text>
        <rect x="24" y="150" width="96" height="34" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="72" y="171" fill="#e6edf3" text-anchor="middle">... Xn</text>
        <rect x="200" y="90" width="110" height="52" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="255" y="112" fill="#e6edf3" text-anchor="middle">sum</text><text x="255" y="128" fill="#9aa7b5" font-size="9" text-anchor="middle">S = X1+...+Xn</text>
        <line x1="120" y1="70" x2="198" y2="105" stroke="#9aa7b5" marker-end="url(#arr2-normal-distribution)"/>
        <line x1="120" y1="120" x2="198" y2="116" stroke="#9aa7b5" marker-end="url(#arr2-normal-distribution)"/>
        <line x1="120" y1="167" x2="198" y2="128" stroke="#9aa7b5" marker-end="url(#arr2-normal-distribution)"/>
        <line x1="310" y1="116" x2="378" y2="116" stroke="#9aa7b5" marker-end="url(#arr2-normal-distribution)"/>
        <rect x="380" y="86" width="136" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/>
        <path d="M392,138 C420,138 428,100 448,98 C468,100 476,138 504,138" fill="none" stroke="#63e6be" stroke-width="2"/>
        <text x="448" y="80" fill="#63e6be" text-anchor="middle" font-size="10">approaches Gaussian</text>
      </svg>`,
      caption: String.raw`No matter what shapes the independent contributors X1..Xn have (uniform, skewed, discrete), their sum S tends to a normal distribution as n grows — the Central Limit Theorem, and the reason noise is Gaussian.`
    },
    {
      title: String.raw`Standardization: x to z to the standard normal and Q`,
      svg: String.raw`<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-normal-distribution" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Standardize any Gaussian, then read the table</text>
        <rect x="24" y="60" width="120" height="52" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="84" y="82" fill="#e6edf3" text-anchor="middle">X ~ N(mu, sigma^2)</text><text x="84" y="99" fill="#9aa7b5" font-size="9" text-anchor="middle">raw value x</text>
        <rect x="200" y="60" width="130" height="52" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="265" y="82" fill="#e6edf3" text-anchor="middle">z = (x - mu)/sigma</text><text x="265" y="99" fill="#9aa7b5" font-size="9" text-anchor="middle">shift and scale</text>
        <rect x="386" y="60" width="130" height="52" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="451" y="82" fill="#e6edf3" text-anchor="middle">Z ~ N(0, 1)</text><text x="451" y="99" fill="#9aa7b5" font-size="9" text-anchor="middle">standard normal</text>
        <line x1="144" y1="86" x2="198" y2="86" stroke="#9aa7b5" marker-end="url(#arr3-normal-distribution)"/>
        <line x1="330" y1="86" x2="384" y2="86" stroke="#9aa7b5" marker-end="url(#arr3-normal-distribution)"/>
        <rect x="200" y="140" width="130" height="34" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="265" y="161" fill="#e6edf3" text-anchor="middle">Q(z) table / erf</text>
        <line x1="451" y1="112" x2="451" y2="157" stroke="#9aa7b5"/><line x1="451" y1="157" x2="332" y2="157" stroke="#9aa7b5" marker-end="url(#arr3-normal-distribution)"/>
        <text x="270" y="187" fill="#9aa7b5" font-size="10" text-anchor="middle">tail probability P(X &gt; x) = Q(z)</text>
      </svg>`,
      caption: String.raw`Every Gaussian collapses onto the single standard normal N(0,1) by the z-score z=(x-mu)/sigma; one table of Q(z) (or erf) then answers any tail-probability question about any normal variable.`
    }
    ],
    prerequisites: ['error-function'],
    intro: String.raw`<p><b>Why does the normal distribution exist as the default model?</b> A receiver has to decide "was a 1 or a 0 sent?" while a random voltage rides on top of the signal. That voltage is the sum of an enormous number of tiny independent kicks — the thermal agitation of electrons in every resistor, contributions from many devices, many time samples. When you add up many independent random effects, their individual shapes wash out and the total inevitably piles up into one specific bell shape. Without knowing that shape you cannot set a threshold, cannot predict a bit-error rate, cannot design a detector. The normal (Gaussian) distribution <i>is</i> that shape, and the Central Limit Theorem is the reason it appears everywhere.</p>
<p>The <b>normal distribution</b> $N(\mu,\sigma^2)$ is described by two numbers: the <b>mean</b> $\mu$ (where the bell is centred) and the <b>variance</b> $\sigma^2$ (how wide it is). Master three things and you own the topic: (1) the <b>PDF</b> $f(x)=\tfrac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/2\sigma^2}$ and why it looks like it does; (2) <b>standardization</b> $z=(x-\mu)/\sigma$, which lets one table answer every question; and (3) the <b>Central Limit Theorem</b>, which explains why so many real quantities — above all thermal noise — are Gaussian.</p>`,
    sections: [
      {
        h: String.raw`What the normal distribution is and why it is everywhere`,
        html: String.raw`<div class="callout tip"><b>Intuition first:</b> imagine flipping 1000 fair coins and counting heads. Any single flip is a boring 0-or-1, yet the <i>total</i> almost always lands near 500 and rarely near 400 or 600. Pile up enough independent little things and the total develops a smooth, symmetric hump around its average, with big deviations becoming exponentially rare. That hump is the normal distribution; the coins are a stand-in for the countless electron kicks that make circuit noise.</div>
        <p>A continuous random variable $X$ is <b>normal</b> (or <b>Gaussian</b>), written $X\sim N(\mu,\sigma^2)$, if its probability density function is</p>
        <p>$$f(x)=\frac{1}{\sigma\sqrt{2\pi}}\,\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right),\qquad -\infty<x<\infty.$$</p>
        <p>It is completely specified by two parameters: the <b>mean</b> $\mu$ (a location — the peak and the axis of symmetry) and the <b>variance</b> $\sigma^2$ (a scale — the spread), with $\sigma$ the standard deviation. The curve is symmetric about $\mu$, has a single peak (unimodal), and its two <b>inflection points sit exactly at $\mu\pm\sigma$</b> — a handy way to read $\sigma$ off a plotted bell.</p>
        <p>It appears in RF and communications for one deep reason and several practical ones: thermal noise, quantization error accumulated over many samples, fading amplitudes in-phase/quadrature components, and receiver decision variables are all sums of many small independent effects — and the Central Limit Theorem forces such sums toward a Gaussian.</p>`
      },
      {
        h: String.raw`Reading the PDF: why the exponential-of-a-square shape`,
        html: String.raw`<p>Every piece of $f(x)$ earns its place. Look at the exponent $-(x-\mu)^2/2\sigma^2$:</p>
        <ul>
          <li>The <b>$(x-\mu)^2$</b> makes the curve depend only on the <i>distance</i> from the mean and makes it symmetric — $+d$ and $-d$ from $\mu$ are equally likely.</li>
          <li>The <b>minus sign and the exponential</b> make probability fall off fast as you move away from $\mu$ — Gaussian tails decay like $e^{-x^2}$, much faster than, say, an exponential distribution's $e^{-x}$.</li>
          <li>The <b>$2\sigma^2$</b> in the denominator sets how quickly that fall-off happens: large $\sigma$ = gentle, wide bell; small $\sigma$ = sharp, narrow spike.</li>
        </ul>
        <p>The prefactor <b>$1/(\sigma\sqrt{2\pi})$</b> is a pure normalizer: it is exactly the constant that makes the total area equal 1, so that $f$ is a legitimate probability density. Notice it also scales the <i>height</i> — a narrower bell (small $\sigma$) must be taller to keep unit area.</p>
        <div class="callout"><b>Key point:</b> the value $f(x)$ is a probability <i>density</i>, not a probability. Probabilities come from <i>areas</i>: $P(a<X<b)=\int_a^b f(x)\,dx$. There is no closed-form antiderivative for the Gaussian, which is exactly why we tabulate it (via $\Phi$, $\mathrm{erf}$, or $Q$) instead of integrating by hand.</div>`
      },
      {
        h: String.raw`Standardization and the z-score: one table for all Gaussians`,
        html: String.raw`<p>There are infinitely many normal distributions (one per $\mu,\sigma$), but they are all stretched-and-shifted copies of a single master curve, the <b>standard normal</b> $Z\sim N(0,1)$. The transformation that maps any $X\sim N(\mu,\sigma^2)$ onto it is the <b>z-score</b>:</p>
        <p>$$z=\frac{x-\mu}{\sigma}.$$</p>
        <p>Subtracting $\mu$ re-centres the bell on 0; dividing by $\sigma$ rescales it to unit width. The z-score literally reads "how many standard deviations is $x$ above (or below) the mean." Because probability is preserved under this change of variable,</p>
        <p>$$P(X\le x)=P\!\left(Z\le \frac{x-\mu}{\sigma}\right)=\Phi\!\left(\frac{x-\mu}{\sigma}\right),$$</p>
        <p>where $\Phi$ is the standard normal CDF. This is why one table (or one $\mathrm{erf}$/$Q$ routine) answers every question about every Gaussian.</p>
        <p>Two closely related tabulated functions:</p>
        <ul>
          <li><b>CDF</b> $\Phi(z)=P(Z\le z)$ — area to the left.</li>
          <li><b>Q-function</b> $Q(z)=P(Z>z)=1-\Phi(z)$ — the upper-tail area, the natural quantity for "probability of exceeding a threshold" and for BER work. See <a href="#error-function">the error function</a> for the $\Phi/\mathrm{erf}/Q$ relationships.</li>
        </ul>`
      },
      {
        h: String.raw`Mean, variance, and the 68-95-99.7 rule`,
        html: String.raw`<p>The two parameters are exactly the first two central moments: $E[X]=\mu$ and $\mathrm{Var}(X)=E[(X-\mu)^2]=\sigma^2$. Higher moments add nothing new — a Gaussian is fully pinned down by $\mu$ and $\sigma^2$ (its skewness is 0 and excess kurtosis is 0).</p>
        <p>Integrating the density over symmetric bands about the mean gives the <b>empirical (68-95-99.7) rule</b>, which every engineer should know cold:</p>
        <table class="data">
          <tr><th>Interval</th><th>$P(\mu-k\sigma < X < \mu+k\sigma)$</th><th>Tail beyond (one side)</th></tr>
          <tr><td>$\pm 1\sigma$</td><td>0.6827 (68.3%)</td><td>$Q(1)=0.1587$</td></tr>
          <tr><td>$\pm 2\sigma$</td><td>0.9545 (95.4%)</td><td>$Q(2)=0.0228$</td></tr>
          <tr><td>$\pm 3\sigma$</td><td>0.9973 (99.7%)</td><td>$Q(3)=0.00135$</td></tr>
        </table>
        <p>So a $3\sigma$ event happens only about 0.27% of the time (0.135% in each tail) — this is the origin of "$6\sigma$" quality language. Two more numbers worth memorizing: $Q(1.28)\approx 0.10$ (the 90th percentile) and $Q(1.645)\approx 0.05$ (the 95th percentile).</p>
        <div class="callout"><b>Sanity anchor:</b> because the curve is symmetric, $P(X<\mu)=P(X>\mu)=0.5$ always, and $Q(0)=0.5$.</div>`
      },
      {
        h: String.raw`The Central Limit Theorem: the engine behind the bell`,
        html: String.raw`<div class="callout tip"><b>Analogy:</b> a single die roll is flat (uniform, 1-6 equally likely). Roll two dice and sum — the total is now a triangle peaked at 7. Roll ten dice and the histogram is already a beautiful bell. Nothing about a single die is Gaussian; the <i>adding</i> is what creates the bell.</div>
        <p>The <b>Central Limit Theorem (CLT)</b> makes this precise. Let $X_1,X_2,\dots,X_n$ be independent random variables, each with the same mean $\mu$ and finite variance $\sigma^2$ (they need not be normal — any shape). Then the standardized sum</p>
        <p>$$Z_n=\frac{\sum_{i=1}^{n}X_i-n\mu}{\sigma\sqrt{n}}\ \xrightarrow[n\to\infty]{}\ N(0,1).$$</p>
        <p>Equivalently, the sample sum $S_n=\sum X_i$ is approximately $N(n\mu,\,n\sigma^2)$ and the sample mean $\bar X$ is approximately $N(\mu,\,\sigma^2/n)$ for large $n$. Two consequences you will use constantly:</p>
        <ul>
          <li><b>Variances add (not standard deviations).</b> For independent variables $\mathrm{Var}(X+Y)=\sigma_X^2+\sigma_Y^2$, so the combined standard deviation is $\sqrt{\sigma_X^2+\sigma_Y^2}$ — a Pythagorean sum. This is why two independent noise sources of 3 mV and 4 mV rms combine to 5 mV rms, not 7 mV.</li>
          <li><b>Averaging shrinks noise as $1/\sqrt n$.</b> The sample mean's standard deviation is $\sigma/\sqrt n$, the basis of integrate-and-dump receivers and coherent averaging: average 100 samples and the noise drops by 10x (20 dB improvement in variance).</li>
        </ul>
        <p>The CLT is precisely why <b>thermal noise is modelled as Gaussian</b>: the terminal voltage of a resistor is the aggregate of an astronomically large number of independent electron motions, so the sum is Gaussian to extraordinary accuracy.</p>`
      },
      {
        h: String.raw`Gaussians in the receiver: noise, decisions, and BER`,
        html: String.raw`<p>Put the pieces together at a detector. The channel adds white Gaussian noise (<a href="#awgn">AWGN</a>): each noise sample is $N(0,\sigma^2)$ with $\sigma^2=N_0/2$ per real dimension. A matched filter output for a binary decision is therefore $Y=\pm A + n$, a Gaussian centred at $+A$ or $-A$. The receiver compares $Y$ to a threshold (0 by symmetry) and errs whenever noise pushes $Y$ across it.</p>
        <p>The probability of that is a tail area of a Gaussian — a Q-function:</p>
        <p>$$P_b=Q\!\left(\frac{A}{\sigma}\right)=Q\!\left(\sqrt{\tfrac{2E_b}{N_0}}\right)\ \ \text{(BPSK)}.$$</p>
        <p>Every clean bit-error-rate formula in digital comms is "a Q-function of a signal-to-noise ratio," and that Q-function exists only because the noise is Gaussian. Two useful facts for design:</p>
        <ul>
          <li>A linear system driven by Gaussian noise outputs Gaussian noise — filtering, mixing, and matched-filtering all preserve Gaussianity (they change $\mu$ and $\sigma$, not the shape).</li>
          <li>The <b>envelope</b> of narrowband Gaussian noise (two independent Gaussian quadratures) is <i>not</i> Gaussian — it is <a href="#rayleigh-distribution">Rayleigh</a> distributed. Gaussian in the I/Q components, Rayleigh in the magnitude: keep the two straight.</li>
        </ul>`
      },
      {
        h: String.raw`What you should now understand`,
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The PDF and its parameters:</b> $f(x)=\tfrac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/2\sigma^2}$, centred at the mean $\mu$, spread set by the variance $\sigma^2$, with inflection points at $\mu\pm\sigma$ and probability living in <i>areas</i>, not heights.</li>
<li><b>Standardization:</b> the z-score $z=(x-\mu)/\sigma$ collapses every Gaussian onto the single standard normal $N(0,1)$, so one table of $\Phi$ / $\mathrm{erf}$ / $Q$ answers every tail-probability question.</li>
<li><b>The 68-95-99.7 rule and key Q-values:</b> $Q(1)=0.1587$, $Q(2)=0.0228$, $Q(3)=0.00135$, plus $Q(1.28)\approx0.10$ and $Q(1.645)\approx0.05$.</li>
<li><b>The Central Limit Theorem:</b> sums of many independent finite-variance effects become Gaussian — the reason thermal noise is Gaussian — and its two rules: variances add ($\sqrt{\sigma_1^2+\sigma_2^2}$), and averaging cuts noise as $\sigma/\sqrt n$.</li>
<li><b>Why it matters at a receiver:</b> AWGN samples are $N(0,N_0/2)$, decision variables are Gaussian, and every BER is a Q-function of an SNR; linear systems keep noise Gaussian, but a narrowband envelope goes Rayleigh.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`A normal variable $X\sim N(\mu,\sigma^2)$ has PDF $f(x)=\tfrac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/2\sigma^2}$; it is fully specified by mean $\mu$ and variance $\sigma^2$.`,
      String.raw`The curve is symmetric about $\mu$, unimodal, with inflection points at $\mu\pm\sigma$; probability is area, so $P(a<X<b)=\int_a^b f\,dx$.`,
      String.raw`Standardize with the z-score $z=(x-\mu)/\sigma$: it maps any Gaussian onto $N(0,1)$ so one table ($\Phi$/$\mathrm{erf}$/$Q$) suffices.`,
      String.raw`68-95-99.7 rule: $P(|X-\mu|<\sigma)=0.6827$, $<2\sigma)=0.9545$, $<3\sigma)=0.9973$; one-sided tails $Q(1)=0.1587$, $Q(2)=0.0228$, $Q(3)=0.00135$.`,
      String.raw`Central Limit Theorem: a standardized sum of many independent finite-variance RVs tends to $N(0,1)$ regardless of their individual shapes.`,
      String.raw`For independent variables variances add, not standard deviations: $\mathrm{Var}(X+Y)=\sigma_X^2+\sigma_Y^2$, so rms combine as $\sqrt{\sigma_X^2+\sigma_Y^2}$.`,
      String.raw`The sample mean of $n$ samples is $N(\mu,\sigma^2/n)$: averaging reduces noise standard deviation as $\sigma/\sqrt n$.`,
      String.raw`Thermal noise is Gaussian because a resistor's voltage is the sum of astronomically many independent electron motions (CLT).`,
      String.raw`Any linear operation on Gaussian noise yields Gaussian noise; the shape is preserved, only $\mu$ and $\sigma$ change.`,
      String.raw`In AWGN each noise sample is $N(0,N_0/2)$ per dimension, so decision variables are Gaussian and every BER is a Q-function of an SNR.`,
      String.raw`Useful percentile z-values: $Q(1.28)\approx0.10$ (90th percentile) and $Q(1.645)\approx0.05$ (95th percentile).`
    ],
    equations: [
      {
        title: String.raw`The Gaussian probability density function`,
        tex: String.raw`$$f(x)=\frac{1}{\sigma\sqrt{2\pi}}\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want a density that (i) depends only on the distance from a centre $\mu$, (ii) decays smoothly and symmetrically, and (iii) integrates to 1. The natural symmetric decaying core is $g(x)=e^{-(x-\mu)^2/2\sigma^2}$; the whole job of the derivation is to find the constant $c$ that makes $f=c\,g$ a valid density.</p>
        <p><b>Step 1 - impose the normalization condition.</b> A density must satisfy $\int_{-\infty}^{\infty} c\,e^{-(x-\mu)^2/2\sigma^2}\,dx=1$. Substitute $u=(x-\mu)/(\sigma\sqrt2)$ so $dx=\sigma\sqrt2\,du$, turning the integral into $c\,\sigma\sqrt2\int_{-\infty}^{\infty}e^{-u^2}\,du=1$.</p>
        <p><b>Step 2 - evaluate the Gaussian integral.</b> The famous result $\int_{-\infty}^{\infty}e^{-u^2}\,du=\sqrt{\pi}$ (proved by squaring the integral and switching to polar coordinates) gives $c\,\sigma\sqrt2\,\sqrt\pi=1$.</p>
        <p><b>Step 3 - solve for the constant.</b> Therefore $c=\dfrac{1}{\sigma\sqrt2\,\sqrt\pi}=\dfrac{1}{\sigma\sqrt{2\pi}}$.</p>
        <p><b>Step 4 - assemble.</b> Multiplying the core by $c$: $$f(x)=\frac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/2\sigma^2}.$$</p>
        <p><b>Result.</b> The prefactor is exactly the normalizer that forces unit area, which is why it also controls the peak height (a narrow bell must be tall). Sanity check: setting $x=\mu$ gives the maximum height $1/(\sigma\sqrt{2\pi})$, and swapping $x\to 2\mu-x$ leaves $f$ unchanged, confirming symmetry about $\mu$.</p>`
      },
      {
        title: String.raw`Standardization (the z-score transform)`,
        tex: String.raw`$$Z=\frac{X-\mu}{\sigma}\ \sim\ N(0,1)$$`,
        derivation: String.raw`<p><b>Where we start.</b> We have $X\sim N(\mu,\sigma^2)$ and want to show the linear map $Z=(X-\mu)/\sigma$ produces the standard normal, so that one table serves all Gaussians. We use the change-of-variables rule for densities.</p>
        <p><b>Step 1 - write the transform and its inverse.</b> Let $z=(x-\mu)/\sigma$, so $x=\mu+\sigma z$ and $dx=\sigma\,dz$. The Jacobian factor is $|dx/dz|=\sigma$.</p>
        <p><b>Step 2 - apply the density transformation rule.</b> For a monotonic map, $f_Z(z)=f_X(x)\,|dx/dz|=f_X(\mu+\sigma z)\,\sigma$.</p>
        <p><b>Step 3 - substitute the Gaussian PDF.</b> With $x-\mu=\sigma z$, the exponent becomes $-(x-\mu)^2/2\sigma^2=-(\sigma z)^2/2\sigma^2=-z^2/2$, so $$f_Z(z)=\frac{1}{\sigma\sqrt{2\pi}}e^{-z^2/2}\cdot\sigma=\frac{1}{\sqrt{2\pi}}e^{-z^2/2}.$$</p>
        <p><b>Step 4 - identify the result.</b> That is precisely the density of $N(0,1)$ (set $\mu=0,\sigma=1$ in the general PDF).</p>
        <p><b>Result.</b> $Z\sim N(0,1)$, so $P(X\le x)=\Phi\big((x-\mu)/\sigma\big)$. Sanity check: $z$ measures how many standard deviations $x$ lies from the mean, so $x=\mu\Rightarrow z=0$ (the centre) and $x=\mu+\sigma\Rightarrow z=1$, matching the 68% band boundary.</p>`
      },
      {
        title: String.raw`Mean and variance from the density`,
        tex: String.raw`$$E[X]=\mu,\qquad \mathrm{Var}(X)=E[(X-\mu)^2]=\sigma^2$$`,
        derivation: String.raw`<p><b>Where we start.</b> We claim the two parameters in the PDF really are the mean and variance. We verify this by integrating against the density, using the substitution $u=(x-\mu)/\sigma$ throughout.</p>
        <p><b>Step 1 - set up the mean.</b> $E[X]=\int_{-\infty}^{\infty} x\,f(x)\,dx$. Substitute $x=\mu+\sigma u$, $dx=\sigma\,du$, giving $E[X]=\int_{-\infty}^{\infty}(\mu+\sigma u)\tfrac{1}{\sqrt{2\pi}}e^{-u^2/2}\,du.$</p>
        <p><b>Step 2 - split and use symmetry.</b> The integral separates into $\mu\int\tfrac{1}{\sqrt{2\pi}}e^{-u^2/2}\,du + \sigma\int u\,\tfrac{1}{\sqrt{2\pi}}e^{-u^2/2}\,du.$ The first integral is $\mu\cdot 1=\mu$ (total area). The second integrand is odd, so it integrates to 0. Hence $E[X]=\mu$.</p>
        <p><b>Step 3 - set up the variance.</b> $\mathrm{Var}(X)=E[(X-\mu)^2]=\int(x-\mu)^2 f(x)\,dx.$ With the same substitution, $(x-\mu)^2=\sigma^2u^2$, so $\mathrm{Var}(X)=\sigma^2\int_{-\infty}^{\infty} u^2\,\tfrac{1}{\sqrt{2\pi}}e^{-u^2/2}\,du.$</p>
        <p><b>Step 4 - evaluate the standard-normal second moment.</b> Integrate by parts with $dv=u\,e^{-u^2/2}\,du$ (so $v=-e^{-u^2/2}$) and $w=u$: the boundary term vanishes and what remains is $\int\tfrac{1}{\sqrt{2\pi}}e^{-u^2/2}\,du=1$. Thus $\int u^2\tfrac{1}{\sqrt{2\pi}}e^{-u^2/2}\,du=1$.</p>
        <p><b>Result.</b> $E[X]=\mu$ and $\mathrm{Var}(X)=\sigma^2\cdot 1=\sigma^2$. Sanity check: the parameters are named honestly — $\mu$ is the balance point and $\sigma^2$ is the mean squared spread — and the units work ($\sigma$ shares the units of $X$).</p>`
      },
      {
        title: String.raw`Central Limit Theorem (standardized-sum statement)`,
        tex: String.raw`$$\frac{\sum_{i=1}^{n}X_i-n\mu}{\sigma\sqrt{n}}\ \xrightarrow[n\to\infty]{}\ N(0,1)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Let $X_1,\dots,X_n$ be independent and identically distributed with mean $\mu$ and finite variance $\sigma^2$ (any shape). We show the standardized sum tends to the standard normal, using the moment-generating (characteristic) function, whose limit pins down the distribution.</p>
        <p><b>Step 1 - centre and define the standardized sum.</b> Let $Y_i=(X_i-\mu)/\sigma$, so each $Y_i$ has mean 0 and variance 1. Define $Z_n=\frac{1}{\sqrt n}\sum_{i=1}^n Y_i$; this is exactly the quantity in the theorem.</p>
        <p><b>Step 2 - expand the MGF of one term.</b> With independence, $M_{Z_n}(t)=\big[M_Y\!\big(t/\sqrt n\big)\big]^n$. Taylor-expand a single MGF about 0 using $E[Y]=0$ and $E[Y^2]=1$: $M_Y(s)=1+0\cdot s+\tfrac{1}{2}s^2+o(s^2)$.</p>
        <p><b>Step 3 - substitute $s=t/\sqrt n$.</b> Then $M_Y(t/\sqrt n)=1+\dfrac{t^2}{2n}+o(1/n)$, so $M_{Z_n}(t)=\left(1+\dfrac{t^2}{2n}+o(1/n)\right)^{n}.$</p>
        <p><b>Step 4 - take the limit.</b> Using $\lim_{n\to\infty}(1+a/n)^n=e^{a}$ with $a=t^2/2$, we get $M_{Z_n}(t)\to e^{t^2/2}$, which is exactly the MGF of $N(0,1)$.</p>
        <p><b>Result.</b> $Z_n\to N(0,1)$, hence $\sum X_i\approx N(n\mu,n\sigma^2)$ and the sample mean $\bar X\approx N(\mu,\sigma^2/n)$. Sanity check: the $\sqrt n$ normalizer is the fingerprint that variances (not standard deviations) add, and it directly yields the $\sigma/\sqrt n$ shrink of an average.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Write the normal PDF and name its parameters.`, back: String.raw`$f(x)=\tfrac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/2\sigma^2}$; $\mu$ is the mean (centre), $\sigma^2$ the variance (spread).` },
      { front: String.raw`Where are the inflection points of a Gaussian?`, back: String.raw`Exactly at $\mu\pm\sigma$ — one standard deviation either side of the mean.` },
      { front: String.raw`What is the z-score and what does it mean?`, back: String.raw`$z=(x-\mu)/\sigma$: how many standard deviations $x$ lies above or below the mean. It maps any Gaussian to $N(0,1)$.` },
      { front: String.raw`State the 68-95-99.7 rule.`, back: String.raw`$P(|X-\mu|<\sigma)=68.3\%$, $<2\sigma)=95.4\%$, $<3\sigma)=99.7\%$.` },
      { front: String.raw`What are $Q(1)$, $Q(2)$, and $Q(3)$?`, back: String.raw`$Q(1)=0.1587$, $Q(2)=0.0228$, $Q(3)=0.00135$ — the one-sided tail probabilities.` },
      { front: String.raw`State the Central Limit Theorem.`, back: String.raw`The standardized sum of many independent, finite-variance random variables tends to $N(0,1)$ regardless of their individual shapes.` },
      { front: String.raw`When you add two independent Gaussians, what adds?`, back: String.raw`The variances add: $\mathrm{Var}(X+Y)=\sigma_X^2+\sigma_Y^2$, so rms combine as $\sqrt{\sigma_X^2+\sigma_Y^2}$ (not the standard deviations directly).` },
      { front: String.raw`Distribution of the sample mean of $n$ samples?`, back: String.raw`Approximately $N(\mu,\sigma^2/n)$; the standard deviation shrinks as $\sigma/\sqrt n$.` },
      { front: String.raw`Why is thermal noise Gaussian?`, back: String.raw`By the CLT: a resistor's terminal voltage is the sum of astronomically many independent electron motions, so it converges to a Gaussian.` },
      { front: String.raw`What does a linear system do to Gaussian noise?`, back: String.raw`Keeps it Gaussian. Filtering/mixing/matched-filtering change $\mu$ and $\sigma$ but never the shape.` },
      { front: String.raw`Relationship between $Q(z)$ and $\Phi(z)$?`, back: String.raw`$Q(z)=1-\Phi(z)=P(Z>z)$; the upper tail. By symmetry $Q(-z)=1-Q(z)$ and $Q(0)=0.5$.` },
      { front: String.raw`Is the envelope of narrowband Gaussian noise Gaussian?`, back: String.raw`No — the two I/Q components are Gaussian, but the envelope (magnitude) is Rayleigh distributed.` },
      { front: String.raw`Which z-values give the 90th and 95th percentiles?`, back: String.raw`$Q(1.28)\approx0.10$ (90th percentile) and $Q(1.645)\approx0.05$ (95th percentile).` }
    ],
    mcqs: [
      { q: String.raw`A Gaussian $N(\mu,\sigma^2)$ has its inflection points at:`, options: [String.raw`$\mu$ only`, String.raw`$\mu\pm\sigma$`, String.raw`$\mu\pm2\sigma$`, String.raw`$\mu\pm\sigma^2$`], answer: 1, explain: String.raw`The second derivative of the Gaussian is zero exactly at $x=\mu\pm\sigma$, so the inflection points mark one standard deviation from the mean.` },
      { q: String.raw`What fraction of a normal population lies within $\pm2\sigma$ of the mean?`, options: [String.raw`68.3%`, String.raw`90.0%`, String.raw`95.4%`, String.raw`99.7%`], answer: 2, explain: String.raw`The 68-95-99.7 rule gives 95.4% within two standard deviations.` },
      { q: String.raw`The z-score $z=(x-\mu)/\sigma$ is used to:`, options: [String.raw`Change the variance`, String.raw`Map any Gaussian onto the standard normal $N(0,1)$`, String.raw`Make the distribution skewed`, String.raw`Compute the mode`], answer: 1, explain: String.raw`Subtracting $\mu$ and dividing by $\sigma$ standardizes any Gaussian to $N(0,1)$ so one table serves all cases.` },
      { q: String.raw`For a standard normal, $Q(1)$ equals approximately:`, options: [String.raw`0.5000`, String.raw`0.3413`, String.raw`0.1587`, String.raw`0.0228`], answer: 2, explain: String.raw`$Q(1)=1-\Phi(1)\approx0.1587$; the two 1-sigma tails sum to $1-0.6827=0.3173$, half of which is 0.1587.` },
      { q: String.raw`Two independent noise sources have rms values 3 mV and 4 mV. Their combined rms is:`, options: [String.raw`3.5 mV`, String.raw`5 mV`, String.raw`7 mV`, String.raw`12 mV`], answer: 1, explain: String.raw`Variances add: $\sqrt{3^2+4^2}=\sqrt{25}=5$ mV. Standard deviations do not add directly.` },
      { q: String.raw`According to the Central Limit Theorem, the sum of many independent finite-variance variables:`, options: [String.raw`Stays whatever shape they had`, String.raw`Becomes uniform`, String.raw`Tends to a normal distribution`, String.raw`Becomes Rayleigh`], answer: 2, explain: String.raw`Regardless of the individual shapes, the standardized sum converges to $N(0,1)$ — this is the CLT.` },
      { q: String.raw`Averaging $n=100$ independent samples reduces the noise standard deviation by a factor of:`, options: [String.raw`100`, String.raw`10`, String.raw`$\sqrt{2}$`, String.raw`No change`], answer: 1, explain: String.raw`The sample mean has standard deviation $\sigma/\sqrt n=\sigma/\sqrt{100}=\sigma/10$, a 10x reduction.` },
      { q: String.raw`The value $f(\mu)$ of the Gaussian density represents:`, options: [String.raw`A probability of 1`, String.raw`The peak probability density (height), not a probability`, String.raw`The variance`, String.raw`Always 0.5`], answer: 1, explain: String.raw`$f(\mu)=1/(\sigma\sqrt{2\pi})$ is the maximum density value; probabilities are areas, so a single point has probability 0.` },
      { q: String.raw`Which quantity fully specifies a normal distribution?`, options: [String.raw`Mean only`, String.raw`Mean and variance`, String.raw`Mean, variance, skewness, and kurtosis`, String.raw`The median alone`], answer: 1, explain: String.raw`A Gaussian is completely determined by $\mu$ and $\sigma^2$; its skewness and excess kurtosis are both 0, adding no information.` },
      { q: String.raw`A narrowband Gaussian noise process has an envelope that is:`, options: [String.raw`Gaussian`, String.raw`Rayleigh distributed`, String.raw`Uniform`, String.raw`Exponential in voltage`], answer: 1, explain: String.raw`The two independent Gaussian quadrature components produce a Rayleigh-distributed magnitude, even though each component is Gaussian.` },
      { q: String.raw`For BPSK in AWGN the bit-error probability is $Q(\sqrt{2E_b/N_0})$ because:`, options: [String.raw`Noise is uniform`, String.raw`The decision variable is Gaussian, so an error is a Gaussian tail area`, String.raw`The signal is Rayleigh`, String.raw`Of quantization`], answer: 1, explain: String.raw`The matched-filter output is a Gaussian centred at $\pm A$; crossing the threshold has probability equal to a Q-function of the SNR.` },
      { q: String.raw`Which z-value corresponds most nearly to a one-sided tail probability of 0.05?`, options: [String.raw`1.00`, String.raw`1.28`, String.raw`1.645`, String.raw`2.00`], answer: 2, explain: String.raw`$Q(1.645)\approx0.05$, the 95th-percentile point of the standard normal.` }
    ],
    numericals: [
      { q: String.raw`Show that $P(|X-\mu|<\sigma)=0.6827$ for a Gaussian using the standard-normal tail value $Q(1)=0.1587$.`, solution: String.raw`<p><b>Formula.</b> The central band probability is $$P(|X-\mu|<\sigma)=1-2Q(1),$$ where $Q(1)=P(Z>1)$ is the one-sided upper-tail area of the standard normal and the factor 2 accounts for both symmetric tails.</p>
<p><b>Substitute.</b> $$P(|X-\mu|<\sigma)=1-2\times0.1587.$$</p>
<p><b>Compute.</b> $2\times0.1587=0.3174$, so $P=1-0.3174=0.6826\approx0.6827$ (rounding of the tail).</p>
<p><b>Explanation.</b> Removing the two 15.87% tails from the whole leaves the familiar 68.3% inside one sigma. The sanity check is symmetry: the two tails must be equal, so subtracting twice a single tail is correct. This is the number an engineer uses to translate "1-sigma" into a coverage percentage.</p>` },
      { q: String.raw`Exam scores are $N(\mu=70,\sigma=8)$. What is the z-score of an 86, and roughly what percentile is it?`, solution: String.raw`<p><b>Formula.</b> The z-score is $$z=\frac{x-\mu}{\sigma},$$ the number of standard deviations $x$ lies from the mean; the percentile is $\Phi(z)=1-Q(z)$.</p>
<p><b>Substitute.</b> $$z=\frac{86-70}{8},\qquad \text{percentile}=1-Q(z).$$</p>
<p><b>Compute.</b> $z=16/8=2.0$. With $Q(2)=0.0228$, the percentile is $1-0.0228=0.9772$, i.e. about the 97.7th percentile.</p>
<p><b>Explanation.</b> An 86 is exactly two standard deviations above the mean, so only about 2.3% of scores exceed it — it sits near the top of the class. Sanity check: this is consistent with the 95.4% within-2-sigma rule, whose upper tail is 2.28%.</p>` },
      { q: String.raw`A threshold detector fires when noise $X\sim N(0,\sigma^2)$ with $\sigma=1$ mV exceeds $2$ mV. Find the false-alarm probability.`, solution: String.raw`<p><b>Formula.</b> The exceedance (tail) probability is $$P(X>a)=Q\!\left(\frac{a-\mu}{\sigma}\right),$$ where $Q$ is the standard-normal upper tail, $a$ the threshold, $\mu$ the mean, $\sigma$ the standard deviation.</p>
<p><b>Substitute.</b> $$P(X>2\text{ mV})=Q\!\left(\frac{2-0}{1}\right)=Q(2).$$</p>
<p><b>Compute.</b> $Q(2)=0.0228$, so the false-alarm probability is about $2.28\%$.</p>
<p><b>Explanation.</b> A threshold set at $2\sigma$ above the (zero) mean is crossed by noise only 2.28% of the time — a direct read of the 95.4% two-sigma rule. Raising the threshold to $3\sigma$ would drop false alarms to 0.135%, illustrating why detection thresholds are quoted in sigmas.</p>` },
      { q: String.raw`Two independent Gaussian noise voltages have standard deviations $\sigma_1=3$ mV and $\sigma_2=4$ mV. Find the standard deviation of their sum.`, solution: String.raw`<p><b>Formula.</b> For independent variables variances add, so $$\sigma_{sum}=\sqrt{\sigma_1^2+\sigma_2^2},$$ a Pythagorean (root-sum-square) combination of the individual standard deviations.</p>
<p><b>Substitute.</b> $$\sigma_{sum}=\sqrt{(3\text{ mV})^2+(4\text{ mV})^2}.$$</p>
<p><b>Compute.</b> $3^2+4^2=9+16=25$, so $\sigma_{sum}=\sqrt{25}=5$ mV.</p>
<p><b>Explanation.</b> The combined rms noise is 5 mV, not the naive 7 mV sum — because <i>powers</i> (variances), not amplitudes, add for independent sources. Sanity check: the result is larger than either alone but smaller than their arithmetic sum, exactly as root-sum-square requires.</p>` },
      { q: String.raw`A sensor sample has noise standard deviation $\sigma=20$ mV. How many independent samples must be averaged to bring the noise down to $5$ mV rms?`, solution: String.raw`<p><b>Formula.</b> By the CLT the sample-mean standard deviation is $$\sigma_{\bar X}=\frac{\sigma}{\sqrt n}\ \Rightarrow\ n=\left(\frac{\sigma}{\sigma_{\bar X}}\right)^2,$$ where $n$ is the number of averaged samples.</p>
<p><b>Substitute.</b> $$n=\left(\frac{20\text{ mV}}{5\text{ mV}}\right)^2.$$</p>
<p><b>Compute.</b> The ratio is 4, so $n=4^2=16$ samples.</p>
<p><b>Explanation.</b> Averaging 16 independent samples cuts the noise by $\sqrt{16}=4$, from 20 mV to 5 mV rms. Sanity check: to halve noise you need 4x the samples, so a 4x reduction needs 16x — matching the inverse-square-root law behind coherent averaging and integrate-and-dump receivers.</p>` },
      { q: String.raw`For a target one-sided tail (outage) probability of $10\%$, how many standard deviations above the mean must a threshold be set for a Gaussian?`, solution: String.raw`<p><b>Formula.</b> The threshold offset in sigmas is the z-value solving $$Q(z)=p_{target}\ \Rightarrow\ z=Q^{-1}(p_{target}),$$ where $Q^{-1}$ is the inverse standard-normal tail function.</p>
<p><b>Substitute.</b> $$z=Q^{-1}(0.10).$$</p>
<p><b>Compute.</b> From standard tables $Q(1.28)\approx0.10$, so $z\approx1.28$; the threshold is $\mu+1.28\sigma$.</p>
<p><b>Explanation.</b> Setting the threshold 1.28 standard deviations above the mean leaves exactly the desired 10% tail beyond it (the 90th percentile). Sanity check: 1.28 sits between $z=1$ ($Q=0.159$) and $z=1.645$ ($Q=0.05$), which brackets 0.10 as expected. This inverse-Q lookup is how link-margin and outage thresholds are chosen.</p>` }
    ],
    realWorld: String.raw`<p>The normal distribution is the workhorse statistical model of every RF and communications system. The Johnson-Nyquist thermal noise voltage across a resistor is Gaussian to extraordinary accuracy because it is the sum of countless independent electron motions (the Central Limit Theorem in action), which is exactly why receiver noise is modelled as additive white Gaussian noise (<a href="#awgn">AWGN</a>) and why every clean bit-error-rate curve is a Q-function of an SNR. Measurement and calibration errors — ADC noise, oscillator jitter, gain uncertainty — are treated as Gaussian so that error bars, confidence intervals, and $3\sigma$ specifications have meaning. Detection thresholds (radar CFAR, energy detectors, comparator trip points) are placed a chosen number of sigmas above the noise mean precisely because the Gaussian tail (<a href="#error-function">the Q-function</a>) converts "sigmas above the mean" into a false-alarm probability. Even fading has Gaussian roots: the in-phase and quadrature components of a scattered radio field are Gaussian, and their <a href="#rayleigh-distribution">Rayleigh</a>-distributed envelope is a direct consequence.</p>`,
    related: ['error-function', 'rayleigh-distribution', 'awgn', 'noise']
  }
);
