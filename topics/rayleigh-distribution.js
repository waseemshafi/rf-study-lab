// Rayleigh Distribution & Fading — Probability & Random Signals.
// Deep exam-mastery study content. CONTENT is a global object.
// Also populates CONTENT_CODE and CONTENT_DUMMIES for this id so the
// topic ships complete (MATLAB + Python + For-Dummies), mirroring the
// pattern used by /code and /dummies files elsewhere in the app.
CONTENT.topics.push(
  {
    id: 'rayleigh-distribution',
    title: 'Rayleigh Distribution & Fading',
    category: 'Probability & Random Signals',
    tags: ['fading', 'multipath', 'envelope', 'NLOS', 'Rician', 'outage', 'diversity', 'PDF'],
    summary: String.raw`The Rayleigh distribution describes the envelope of a signal that is the sum of many independent scattered multipath components; it is the canonical model for the random amplitude of a narrowband non-line-of-sight fading channel, and it explains the deep fades that intermittently wreck a wireless link.`,
    diagram: [
    {
      title: String.raw`Two Gaussians in quadrature form a Rayleigh envelope`,
      svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-rayleigh-distribution" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Envelope of two independent Gaussians</text>
        <rect x="24" y="46" width="120" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
        <text x="84" y="66" fill="#e6edf3" text-anchor="middle">I ~ N(0,&#963;&#178;)</text>
        <text x="84" y="82" fill="#9aa7b5" font-size="10" text-anchor="middle">in-phase</text>
        <rect x="24" y="118" width="120" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
        <text x="84" y="138" fill="#e6edf3" text-anchor="middle">Q ~ N(0,&#963;&#178;)</text>
        <text x="84" y="154" fill="#9aa7b5" font-size="10" text-anchor="middle">quadrature</text>
        <line x1="144" y1="68" x2="212" y2="96" stroke="#9aa7b5" marker-end="url(#arr-rayleigh-distribution)"/>
        <line x1="144" y1="140" x2="212" y2="112" stroke="#9aa7b5" marker-end="url(#arr-rayleigh-distribution)"/>
        <rect x="214" y="82" width="120" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/>
        <text x="274" y="102" fill="#e6edf3" text-anchor="middle">R = &#8730;(I&#178;+Q&#178;)</text>
        <text x="274" y="118" fill="#9aa7b5" font-size="10" text-anchor="middle">envelope</text>
        <line x1="334" y1="104" x2="392" y2="104" stroke="#9aa7b5" marker-end="url(#arr-rayleigh-distribution)"/>
        <path d="M400 170 L400 52 M400 170 L520 170" stroke="#9aa7b5" fill="none"/>
        <path d="M400 170 Q430 60 470 120 T520 168" stroke="#ffa94d" fill="none" stroke-width="2"/>
        <line x1="430" y1="170" x2="430" y2="70" stroke="#b197fc" stroke-dasharray="3 3"/>
        <text x="430" y="188" fill="#b197fc" font-size="10" text-anchor="middle">mode = &#963;</text>
        <text x="484" y="60" fill="#ffa94d" font-size="10" text-anchor="middle">f(r)</text>
        <text x="460" y="204" fill="#9aa7b5" font-size="10" text-anchor="middle">skewed, r &#8805; 0</text>
      </svg>`,
      caption: String.raw`Two independent zero-mean Gaussian components I and Q (the in-phase and quadrature parts of the received phasor) combine into an envelope R = sqrt(I^2 + Q^2) whose PDF is Rayleigh: a right-skewed curve that starts at zero, peaks at the mode r = sigma, and has a long tail.`
    },
    {
      title: String.raw`Multipath mechanism: scattered rays sum to a random phasor`,
      svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-rayleigh-distribution" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Many scattered rays add as random phasors</text>
        <circle cx="70" cy="120" r="16" fill="#1c232e" stroke="#4dabf7"/>
        <text x="70" y="124" fill="#e6edf3" font-size="10" text-anchor="middle">Tx</text>
        <circle cx="470" cy="120" r="16" fill="#1c232e" stroke="#63e6be"/>
        <text x="470" y="124" fill="#e6edf3" font-size="10" text-anchor="middle">Rx</text>
        <rect x="210" y="40" width="40" height="20" rx="4" fill="#1c232e" stroke="#9aa7b5"/>
        <rect x="300" y="150" width="40" height="20" rx="4" fill="#1c232e" stroke="#9aa7b5"/>
        <rect x="180" y="170" width="40" height="20" rx="4" fill="#1c232e" stroke="#9aa7b5"/>
        <path d="M86 118 Q230 50 456 116" stroke="#ffa94d" fill="none" marker-end="url(#arr2-rayleigh-distribution)"/>
        <path d="M86 122 Q320 160 456 122" stroke="#ffa94d" fill="none" marker-end="url(#arr2-rayleigh-distribution)"/>
        <path d="M86 126 Q200 190 456 128" stroke="#ffa94d" fill="none" marker-end="url(#arr2-rayleigh-distribution)"/>
        <text x="270" y="206" fill="#9aa7b5" font-size="10" text-anchor="middle">each path: random amplitude and phase</text>
        <g transform="translate(392,150)">
          <line x1="0" y1="0" x2="34" y2="-10" stroke="#4dabf7" marker-end="url(#arr2-rayleigh-distribution)"/>
          <line x1="34" y1="-10" x2="52" y2="14" stroke="#4dabf7" marker-end="url(#arr2-rayleigh-distribution)"/>
          <line x1="52" y1="14" x2="72" y2="2" stroke="#4dabf7" marker-end="url(#arr2-rayleigh-distribution)"/>
          <line x1="0" y1="0" x2="72" y2="2" stroke="#b197fc" stroke-width="2" marker-end="url(#arr2-rayleigh-distribution)"/>
          <text x="36" y="34" fill="#b197fc" font-size="10" text-anchor="middle">sum = R e^(j&#966;)</text>
        </g>
      </svg>`,
      caption: String.raw`With no dominant line-of-sight path, many scattered rays arrive with independent amplitudes and phases. Their vector sum is a random phasor whose I and Q components are, by the central limit theorem, approximately Gaussian; the resulting envelope R is Rayleigh distributed.`
    },
    {
      title: String.raw`Received envelope vs time: deep fades cross a threshold`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-rayleigh-distribution" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Envelope vs time with deep fades (outage)</text>
        <line x1="40" y1="40" x2="40" y2="170" stroke="#9aa7b5" marker-end="url(#arr3-rayleigh-distribution)"/>
        <line x1="40" y1="170" x2="512" y2="170" stroke="#9aa7b5" marker-end="url(#arr3-rayleigh-distribution)"/>
        <text x="20" y="50" fill="#9aa7b5" font-size="10">R</text>
        <text x="506" y="188" fill="#9aa7b5" font-size="10">t</text>
        <line x1="40" y1="140" x2="500" y2="140" stroke="#ffa94d" stroke-dasharray="4 3"/>
        <text x="470" y="134" fill="#ffa94d" font-size="10">threshold r_th</text>
        <path d="M40 90 C70 60 90 120 110 100 S150 150 175 148 S210 55 235 80 S270 158 300 156 S340 70 365 95 S400 150 430 152 S470 80 500 100" stroke="#4dabf7" fill="none" stroke-width="2"/>
        <rect x="160" y="140" width="30" height="30" fill="#b197fc" opacity="0.25"/>
        <rect x="285" y="140" width="30" height="30" fill="#b197fc" opacity="0.25"/>
        <rect x="418" y="140" width="26" height="30" fill="#b197fc" opacity="0.25"/>
        <text x="270" y="200" fill="#9aa7b5" font-size="10" text-anchor="middle">shaded = outage (R &lt; r_th). Add a strong LOS ray and the envelope becomes Rician (fades shallower).</text>
      </svg>`,
      caption: String.raw`The Rayleigh envelope wanders in time; when it dips below the receiver's usable threshold r_th the link is in outage (shaded intervals). A fade margin is added to keep these events rare. If a strong line-of-sight component is present the envelope follows the Rician distribution instead, and the deep fades become shallower.`
    }
    ],
    prerequisites: ['normal-distribution'],
    intro: String.raw`<p><b>Why does the Rayleigh distribution matter?</b> A radio signal rarely reaches the receiver by a single clean path. It bounces off buildings, walls, the ground and moving vehicles, and dozens of copies arrive together with different delays and phases. Sometimes those copies add up; sometimes they cancel. The <i>received envelope</i> — the amplitude the receiver actually sees — therefore becomes a <b>random variable</b>, and it can momentarily collapse into a deep <b>fade</b> that drops the signal below the noise floor and wrecks the link. To design a link that survives, you must know the statistics of that envelope: how often it fades, how deep, and how much margin to budget. For the common non-line-of-sight case, those statistics are exactly the Rayleigh distribution.</p>
<p>The <b>Rayleigh distribution</b> is the probability law of the magnitude $R=\sqrt{I^2+Q^2}$ of a two-dimensional vector whose components $I$ and $Q$ are independent, zero-mean Gaussians of equal variance $\sigma^2$. Physically, $I$ and $Q$ are the in-phase and quadrature parts of the sum of many scattered multipath rays; the central limit theorem makes them Gaussian, so the envelope is Rayleigh. Its density is $f(r)=\dfrac{r}{\sigma^2}e^{-r^2/2\sigma^2}$ for $r\ge 0$. Mastering this topic means understanding where that shape comes from, its mean $\sigma\sqrt{\pi/2}$, mode $\sigma$ and median $\sigma\sqrt{2\ln 2}$, why the <i>power</i> $R^2$ is exponentially distributed, and how the outage probability $1-e^{-r_{th}^2/2\sigma^2}$ sets the fade margin every wireless link must carry.</p>`,
    sections: [
      {
        h: 'From multipath to a random envelope',
        html: String.raw`<p>Consider a narrowband signal reaching a receiver over many paths. The received passband signal can be written in terms of two <b>baseband quadrature components</b>, the in-phase $I$ and quadrature $Q$: the complex baseband received phasor is $g=I+jQ$, and the physical envelope the receiver measures is its magnitude</p>
        <p>$$R=|g|=\sqrt{I^2+Q^2}.$$</p>
        <p>Each multipath ray contributes a small phasor $a_k e^{j\phi_k}$. When there is <b>no dominant line-of-sight (LOS)</b> component, no single ray dominates and the phases $\phi_k$ are effectively uniform and independent. Summing many such independent contributions,</p>
        <p>$$I=\sum_k a_k\cos\phi_k,\qquad Q=\sum_k a_k\sin\phi_k,$$</p>
        <p>the <b>central limit theorem</b> makes $I$ and $Q$ approximately <b>zero-mean Gaussian</b>, independent, with equal variance $\sigma^2$. The envelope of two such Gaussians is, as the next section derives, Rayleigh distributed. This is the model of a <b>non-line-of-sight (NLOS) narrowband fading channel</b>.</p>
        <div class="callout tip"><b>Key intuition:</b> Rayleigh fading is just the length of a two-dimensional "dart throw." Throw a dart at a bullseye where horizontal and vertical errors are independent Gaussians; the distance from the centre is Rayleigh. In radio, the two axes are $I$ and $Q$, and "distance from centre" is the signal envelope.</div>`
      },
      {
        h: 'The Rayleigh PDF and CDF',
        html: String.raw`<p>The probability density function (PDF) of a Rayleigh random variable with scale parameter $\sigma$ is</p>
        <p>$$f_R(r)=\frac{r}{\sigma^2}\,e^{-r^2/2\sigma^2},\qquad r\ge 0,$$</p>
        <p>and $f_R(r)=0$ for $r<0$ (an envelope cannot be negative). Two features define its shape. Near the origin the factor $r$ pulls the density to <b>zero at $r=0$</b> — a magnitude of exactly zero requires both $I$ and $Q$ to vanish simultaneously, which is vanishingly unlikely. Far out, the Gaussian factor $e^{-r^2/2\sigma^2}$ forces an exponentially decaying tail. Between them the density rises, peaks, and falls: the distribution is <b>right-skewed</b> with a single mode.</p>
        <p>The cumulative distribution function (CDF) integrates cleanly:</p>
        <p>$$F_R(r)=P(R\le r)=1-e^{-r^2/2\sigma^2},\qquad r\ge 0.$$</p>
        <p>This CDF is the single most useful formula for link design: $F_R(r_{th})$ is the probability that the envelope falls <i>below</i> a threshold $r_{th}$ — the <b>outage probability</b>. Because the CDF has a closed form, Rayleigh outage and fade-margin calculations need no tables, unlike the Gaussian.</p>`
      },
      {
        h: 'Mean, mode, median and spread',
        html: String.raw`<p>The Rayleigh distribution has clean closed-form summary statistics, all proportional to $\sigma$:</p>
        <ul>
          <li><b>Mode</b> (the peak of the PDF): $r_{mode}=\sigma$. Setting $df_R/dr=0$ gives $r=\sigma$ directly.</li>
          <li><b>Mean</b> (the average envelope): $E[R]=\sigma\sqrt{\pi/2}\approx 1.2533\,\sigma$.</li>
          <li><b>Median</b> (equal probability above/below): solve $F_R(r)=1/2$ to get $r_{med}=\sigma\sqrt{2\ln 2}\approx 1.1774\,\sigma$.</li>
          <li><b>Mean square (mean power)</b>: $E[R^2]=2\sigma^2$. This is the average <i>power</i> of the envelope and is the natural normalisation constant.</li>
          <li><b>Variance</b>: $\operatorname{Var}(R)=\left(2-\pi/2\right)\sigma^2\approx 0.4292\,\sigma^2$.</li>
        </ul>
        <p>Notice the ordering $r_{mode}<r_{med}<E[R]$ ($\sigma<1.177\sigma<1.253\sigma$), the signature of a right-skewed distribution — the long upper tail drags the mean above both the median and the mode. Everything scales linearly with $\sigma$, so $\sigma$ is a pure <b>scale parameter</b>; doubling $\sigma$ doubles every length statistic and quadruples the mean power.</p>`
      },
      {
        h: 'Envelope, power, and the exponential connection',
        html: String.raw`<p>A crucial companion fact: while the <b>envelope</b> $R$ is Rayleigh, the <b>instantaneous power</b> $P=R^2=I^2+Q^2$ is <b>exponentially distributed</b>. Transforming variables from $R$ to $P=R^2$ gives</p>
        <p>$$f_P(p)=\frac{1}{2\sigma^2}\,e^{-p/2\sigma^2},\qquad p\ge 0,$$</p>
        <p>an exponential distribution with mean $E[P]=2\sigma^2$ — consistent with $E[R^2]=2\sigma^2$. This is enormously convenient: many link and diversity calculations are done in power (SNR) rather than amplitude, and the memoryless exponential makes those integrals trivial. For example, the outage probability written in power is</p>
        <p>$$P\!\left(P<p_{th}\right)=1-e^{-p_{th}/2\sigma^2},$$</p>
        <p>identical in form to the amplitude CDF with $r_{th}^2\leftrightarrow p_{th}$. In terms of average SNR $\bar{\gamma}=2\sigma^2/N_0$-style normalisations, the instantaneous SNR $\gamma$ of a Rayleigh channel is exponential with mean $\bar\gamma$, giving the famous result that Rayleigh outage below a target SNR $\gamma_{th}$ is $1-e^{-\gamma_{th}/\bar\gamma}$.</p>
        <div class="callout tip"><b>Remember the pair:</b> Rayleigh <i>amplitude</i> $\Leftrightarrow$ exponential <i>power</i>. If you ever see an exponential SNR distribution in a fading problem, the underlying channel is Rayleigh.</div>`
      },
      {
        h: 'Rician: adding a line-of-sight component',
        html: String.raw`<p>Rayleigh assumes <b>no</b> dominant path. If a strong <b>line-of-sight (LOS)</b> ray is present, one component acquires a nonzero mean: say $I=A+n_I$ with $A$ the LOS amplitude, while $Q=n_Q$ stays zero-mean. The envelope is then <b>Rician</b> (Rice) distributed:</p>
        <p>$$f_R(r)=\frac{r}{\sigma^2}\exp\!\left(-\frac{r^2+A^2}{2\sigma^2}\right)I_0\!\left(\frac{rA}{\sigma^2}\right),\qquad r\ge 0,$$</p>
        <p>where $I_0(\cdot)$ is the modified Bessel function of the first kind, order zero. The strength of the LOS relative to the scatter is captured by the <b>Rician K-factor</b> $K=A^2/2\sigma^2$ (often in dB).</p>
        <ul>
          <li><b>$K=0$ (no LOS):</b> $A=0$, $I_0(0)=1$, and the Rician PDF collapses back to Rayleigh. Rayleigh is the $K\to 0$ limit.</li>
          <li><b>$K\to\infty$ (strong LOS):</b> the envelope concentrates near $A$ and approaches a constant — fading becomes negligible.</li>
        </ul>
        <p>Practically, an open rural line-of-sight link is high-$K$ (near-Gaussian, shallow fades), while a dense urban NLOS environment is $K\approx 0$ (Rayleigh, deep fades). Rayleigh is therefore the <b>worst-case fading benchmark</b> engineers design against.</p>`
      },
      {
        h: 'Outage, fade margin and diversity',
        html: String.raw`<p>The whole reason to model fading is to keep the link up. Define an <b>outage</b> as the envelope dropping below the threshold $r_{th}$ the receiver needs. The outage probability is the Rayleigh CDF:</p>
        <p>$$P_{out}=P(R<r_{th})=1-e^{-r_{th}^2/2\sigma^2}.$$</p>
        <p>To meet a target outage (say 1%), the designer picks $r_{th}$ well below the mean envelope and budgets the difference as <b>fade margin</b> — extra transmit power or antenna gain held in reserve for the fades. Because the Rayleigh tail near zero is roughly linear ($P_{out}\approx r_{th}^2/2\sigma^2$ for small $r_{th}$), <b>each factor-of-ten reduction in target outage costs about 10 dB of margin</b> — an expensive proposition, which motivates smarter fixes.</p>
        <p>The most powerful fix is <b>diversity</b>: provide $L$ independently-fading copies of the signal (multiple antennas, frequencies, or time slots) and combine them. All $L$ branches must fade simultaneously for an outage, so</p>
        <p>$$P_{out,\,L}\approx\left(\frac{r_{th}^2}{2\sigma^2}\right)^{L}$$</p>
        <p>for small thresholds — the outage now falls as the $L$-th power. Two-branch diversity turns a 10% single-branch outage into roughly 1%, dramatically cheaper than 10 dB of raw power. This is exactly why MIMO, RAKE receivers and frequency hopping exist.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Origin:</b> Rayleigh is the envelope $R=\sqrt{I^2+Q^2}$ of two independent zero-mean Gaussians $I,Q\sim N(0,\sigma^2)$, which arise by the central limit theorem from summing many independent NLOS multipath rays.</li>
<li><b>The density and CDF:</b> $f_R(r)=\frac{r}{\sigma^2}e^{-r^2/2\sigma^2}$ (zero at the origin, exponential tail, right-skewed) and $F_R(r)=1-e^{-r^2/2\sigma^2}$, the outage formula.</li>
<li><b>The statistics:</b> mode $=\sigma$, median $=\sigma\sqrt{2\ln 2}\approx1.177\sigma$, mean $=\sigma\sqrt{\pi/2}\approx1.253\sigma$, and mean power $E[R^2]=2\sigma^2$ — ordered mode $<$ median $<$ mean.</li>
<li><b>The power link:</b> the envelope is Rayleigh while the power $R^2$ (and the SNR) is exponential with mean $2\sigma^2$ — the shortcut for SNR-domain fading maths.</li>
<li><b>Rician and the K-factor:</b> adding a LOS component gives the Rician distribution; Rayleigh is the $K\to0$ (no-LOS, worst-case) limit and fading vanishes as $K\to\infty$.</li>
<li><b>Why it matters:</b> deep fades force a fade margin ($P_{out}=1-e^{-r_{th}^2/2\sigma^2}$), and diversity beats the expensive margin by making outage fall as the $L$-th power of the branch count.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`Rayleigh models the envelope $R=\sqrt{I^2+Q^2}$ of two independent zero-mean Gaussians $I,Q\sim N(0,\sigma^2)$ — the NLOS narrowband fading amplitude.`,
      String.raw`PDF: $f_R(r)=\dfrac{r}{\sigma^2}e^{-r^2/2\sigma^2}$, $r\ge0$; it is zero at the origin, right-skewed, with an exponential tail.`,
      String.raw`CDF: $F_R(r)=1-e^{-r^2/2\sigma^2}$ — the closed-form outage probability that the envelope drops below a threshold.`,
      String.raw`Mode $=\sigma$; median $=\sigma\sqrt{2\ln 2}\approx1.177\sigma$; mean $=\sigma\sqrt{\pi/2}\approx1.253\sigma$ (ordering mode $<$ median $<$ mean).`,
      String.raw`Mean power $E[R^2]=2\sigma^2$; variance $=(2-\pi/2)\sigma^2\approx0.429\sigma^2$; $\sigma$ is a pure scale parameter.`,
      String.raw`The envelope is Rayleigh while the instantaneous power $R^2$ (and SNR) is exponentially distributed with mean $2\sigma^2$.`,
      String.raw`Rayleigh is the $K\to0$ (no line-of-sight) limit of the Rician distribution; a strong LOS ray gives Rician with $K=A^2/2\sigma^2$.`,
      String.raw`Outage $P_{out}=1-e^{-r_{th}^2/2\sigma^2}$; near zero $P_{out}\approx r_{th}^2/2\sigma^2$, so each 10x lower outage costs ~10 dB of fade margin.`,
      String.raw`Deep fades, not average path loss, dominate wireless reliability — hence every link carries a fade margin.`,
      String.raw`Diversity ($L$ independent branches) makes outage fall as the $L$-th power of the branch outage, far cheaper than raw margin — the basis of MIMO and RAKE.`
    ],
    equations: [
      {
        title: 'Rayleigh PDF from two Gaussians',
        tex: String.raw`$$f_R(r)=\frac{r}{\sigma^2}\,e^{-r^2/2\sigma^2},\qquad r\ge 0$$`,
        derivation: String.raw`<p><b>Where we start.</b> The envelope is $R=\sqrt{I^2+Q^2}$ where $I$ and $Q$ are independent, zero-mean Gaussians with equal variance $\sigma^2$. We want the density of $R$.</p>
        <p><b>Step 1 — write the joint density of $(I,Q)$.</b> Independence multiplies the two Gaussian densities:</p>
        $$f_{I,Q}(x,y)=\frac{1}{2\pi\sigma^2}\exp\!\left(-\frac{x^2+y^2}{2\sigma^2}\right).$$
        <p>Because it depends only on $x^2+y^2$, the joint density is circularly symmetric — a fact that makes polar coordinates natural.</p>
        <p><b>Step 2 — change to polar coordinates.</b> Let $x=r\cos\theta$, $y=r\sin\theta$, so $x^2+y^2=r^2$. The area element transforms as $dx\,dy=r\,dr\,d\theta$ (the Jacobian of the polar map is $r$). Then</p>
        $$f_{R,\Theta}(r,\theta)=\frac{1}{2\pi\sigma^2}e^{-r^2/2\sigma^2}\,r,\qquad r\ge 0,\ 0\le\theta<2\pi.$$
        <p><b>Step 3 — integrate out the phase $\theta$.</b> The phase is uniform on $[0,2\pi)$ and independent of the magnitude, so integrate over $\theta$:</p>
        $$f_R(r)=\int_0^{2\pi}\frac{r}{2\pi\sigma^2}e^{-r^2/2\sigma^2}\,d\theta=\frac{r}{\sigma^2}e^{-r^2/2\sigma^2}.$$
        <p><b>Result.</b> $$f_R(r)=\frac{r}{\sigma^2}e^{-r^2/2\sigma^2},\quad r\ge0.$$ Sanity check: it is zero at $r=0$ (the $r$ factor), non-negative, and integrates to 1 — substitute $u=r^2/2\sigma^2$, $du=(r/\sigma^2)dr$, giving $\int_0^\infty e^{-u}\,du=1$. The extracted uniform phase confirms the received phasor's angle carries no envelope information.</p>`
      },
      {
        title: 'Rayleigh CDF and outage probability',
        tex: String.raw`$$F_R(r)=1-e^{-r^2/2\sigma^2},\qquad r\ge 0$$`,
        derivation: String.raw`<p><b>Where we start.</b> The CDF $F_R(r)=P(R\le r)$ is the integral of the PDF from $0$ to $r$; it is what link designers actually evaluate to get outage.</p>
        <p><b>Step 1 — set up the integral.</b> Using the PDF just derived,</p>
        $$F_R(r)=\int_0^{r}\frac{t}{\sigma^2}e^{-t^2/2\sigma^2}\,dt.$$
        <p><b>Step 2 — substitute to remove the $t$ factor.</b> Let $u=t^2/2\sigma^2$, so $du=(t/\sigma^2)\,dt$. The limits map $t=0\to u=0$ and $t=r\to u=r^2/2\sigma^2$. The integral becomes a plain exponential:</p>
        $$F_R(r)=\int_0^{r^2/2\sigma^2}e^{-u}\,du.$$
        <p><b>Step 3 — evaluate.</b></p>
        $$F_R(r)=\big[-e^{-u}\big]_0^{r^2/2\sigma^2}=1-e^{-r^2/2\sigma^2}.$$
        <p><b>Step 4 — interpret as outage.</b> An outage occurs when the envelope falls below the usable threshold $r_{th}$, so</p>
        $$P_{out}=P(R<r_{th})=F_R(r_{th})=1-e^{-r_{th}^2/2\sigma^2}.$$
        <p><b>Result.</b> $$F_R(r)=1-e^{-r^2/2\sigma^2}.$$ Sanity check: $F_R(0)=0$ and $F_R(\infty)=1$, as any CDF must satisfy. For small $r_{th}$, $P_{out}\approx r_{th}^2/2\sigma^2$, showing outage grows quadratically with the threshold — the basis of the fade-margin trade.</p>`
      },
      {
        title: 'Mean and mode of the Rayleigh distribution',
        tex: String.raw`$$E[R]=\sigma\sqrt{\tfrac{\pi}{2}},\qquad r_{mode}=\sigma$$`,
        derivation: String.raw`<p><b>Where we start.</b> We need two summary numbers: the mode (peak location of the PDF) and the mean (its expected value). Both follow directly from the density $f_R(r)=\frac{r}{\sigma^2}e^{-r^2/2\sigma^2}$.</p>
        <p><b>Step 1 — mode by differentiating the PDF.</b> Set $\frac{d}{dr}f_R(r)=0$. Using the product rule,</p>
        $$\frac{d}{dr}\!\left(\frac{r}{\sigma^2}e^{-r^2/2\sigma^2}\right)=\frac{1}{\sigma^2}e^{-r^2/2\sigma^2}\left(1-\frac{r^2}{\sigma^2}\right).$$
        <p>The exponential never vanishes, so the bracket must: $1-r^2/\sigma^2=0\Rightarrow r=\sigma$. Hence the mode is $r_{mode}=\sigma$.</p>
        <p><b>Step 2 — set up the mean integral.</b> By definition,</p>
        $$E[R]=\int_0^\infty r\,f_R(r)\,dr=\int_0^\infty \frac{r^2}{\sigma^2}e^{-r^2/2\sigma^2}\,dr.$$
        <p><b>Step 3 — use the Gaussian moment integral.</b> The standard result $\int_0^\infty x^2 e^{-x^2/2\sigma^2}\,dx=\sigma^3\sqrt{\pi/2}$ (half of the full-line second moment $\sigma^2\cdot\sigma\sqrt{2\pi}$). Substituting,</p>
        $$E[R]=\frac{1}{\sigma^2}\cdot\sigma^3\sqrt{\frac{\pi}{2}}=\sigma\sqrt{\frac{\pi}{2}}.$$
        <p><b>Result.</b> $$E[R]=\sigma\sqrt{\pi/2}\approx1.2533\,\sigma,\qquad r_{mode}=\sigma.$$ Sanity check: the mean exceeds the mode, consistent with the right-skew of the distribution, and both are proportional to the scale $\sigma$ as expected.</p>`
      },
      {
        title: 'Power is exponential: the envelope-power transform',
        tex: String.raw`$$f_P(p)=\frac{1}{2\sigma^2}\,e^{-p/2\sigma^2},\qquad p=R^2\ge 0$$`,
        derivation: String.raw`<p><b>Where we start.</b> Many fading calculations use power $P=R^2$ (proportional to SNR) rather than amplitude. We transform the Rayleigh density of $R$ into the density of $P$.</p>
        <p><b>Step 1 — the change-of-variable rule.</b> For a monotonic map $p=r^2$ on $r\ge0$, the densities relate by $f_P(p)=f_R(r)\left|\dfrac{dr}{dp}\right|$ with $r=\sqrt{p}$.</p>
        <p><b>Step 2 — compute the Jacobian.</b> From $p=r^2$, $\dfrac{dp}{dr}=2r$, so $\left|\dfrac{dr}{dp}\right|=\dfrac{1}{2r}=\dfrac{1}{2\sqrt{p}}$.</p>
        <p><b>Step 3 — substitute the Rayleigh PDF.</b> With $r=\sqrt{p}$, $f_R(\sqrt p)=\dfrac{\sqrt p}{\sigma^2}e^{-p/2\sigma^2}$. Multiply by the Jacobian:</p>
        $$f_P(p)=\frac{\sqrt p}{\sigma^2}e^{-p/2\sigma^2}\cdot\frac{1}{2\sqrt p}=\frac{1}{2\sigma^2}e^{-p/2\sigma^2}.$$
        <p><b>Step 4 — identify the distribution.</b> This is an exponential density with rate $\lambda=1/2\sigma^2$, hence mean $E[P]=1/\lambda=2\sigma^2$.</p>
        <p><b>Result.</b> $$f_P(p)=\frac{1}{2\sigma^2}e^{-p/2\sigma^2}.$$ Sanity check: $E[P]=2\sigma^2$ matches $E[R^2]=2\sigma^2$ computed directly, and the memoryless exponential form is exactly why Rayleigh SNR problems collapse to simple $1-e^{-\gamma_{th}/\bar\gamma}$ outage expressions.</p>`
      },
      {
        title: 'Median of the Rayleigh distribution',
        tex: String.raw`$$r_{med}=\sigma\sqrt{2\ln 2}\approx 1.1774\,\sigma$$`,
        derivation: String.raw`<p><b>Where we start.</b> The median $r_{med}$ splits the distribution in half: $P(R\le r_{med})=\tfrac12$. We solve the CDF for this point.</p>
        <p><b>Step 1 — set the CDF equal to one half.</b> Using $F_R(r)=1-e^{-r^2/2\sigma^2}$,</p>
        $$1-e^{-r_{med}^2/2\sigma^2}=\frac12.$$
        <p><b>Step 2 — isolate the exponential.</b></p>
        $$e^{-r_{med}^2/2\sigma^2}=\frac12.$$
        <p><b>Step 3 — take natural logs.</b> $-\dfrac{r_{med}^2}{2\sigma^2}=\ln\tfrac12=-\ln 2$, so</p>
        $$r_{med}^2=2\sigma^2\ln 2.$$
        <p><b>Step 4 — solve for $r_{med}$.</b> Taking the positive root,</p>
        $$r_{med}=\sigma\sqrt{2\ln 2}.$$
        <p><b>Result.</b> $$r_{med}=\sigma\sqrt{2\ln 2}\approx 1.1774\,\sigma.$$ Sanity check: the median lies between the mode ($\sigma$) and the mean ($1.2533\sigma$), the correct ordering for a right-skewed distribution, and like every Rayleigh statistic it scales linearly with $\sigma$.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the Rayleigh PDF?`, back: String.raw`$f_R(r)=\dfrac{r}{\sigma^2}e^{-r^2/2\sigma^2}$ for $r\ge0$ (zero otherwise). It is right-skewed, zero at the origin, with an exponential tail.` },
      { front: String.raw`Where does a Rayleigh random variable come from physically?`, back: String.raw`The envelope $R=\sqrt{I^2+Q^2}$ of two independent zero-mean Gaussians $I,Q\sim N(0,\sigma^2)$ — the sum of many independent NLOS multipath rays.` },
      { front: String.raw`What is the Rayleigh CDF?`, back: String.raw`$F_R(r)=1-e^{-r^2/2\sigma^2}$, $r\ge0$. It is also the outage probability that the envelope drops below $r$.` },
      { front: String.raw`What is the mode of a Rayleigh distribution?`, back: String.raw`$r_{mode}=\sigma$ — found by setting the PDF derivative to zero.` },
      { front: String.raw`What is the mean of a Rayleigh distribution?`, back: String.raw`$E[R]=\sigma\sqrt{\pi/2}\approx1.2533\,\sigma$.` },
      { front: String.raw`What is the median of a Rayleigh distribution?`, back: String.raw`$r_{med}=\sigma\sqrt{2\ln 2}\approx1.1774\,\sigma$, from solving $F_R(r)=1/2$.` },
      { front: String.raw`What is $E[R^2]$ (the mean power)?`, back: String.raw`$E[R^2]=2\sigma^2$. The instantaneous power $R^2$ is exponentially distributed with this mean.` },
      { front: String.raw`How is the power of a Rayleigh envelope distributed?`, back: String.raw`Exponentially: $f_P(p)=\dfrac{1}{2\sigma^2}e^{-p/2\sigma^2}$, mean $2\sigma^2$. Rayleigh amplitude $\Leftrightarrow$ exponential power/SNR.` },
      { front: String.raw`How does Rayleigh relate to the Rician distribution?`, back: String.raw`Rayleigh is the $K\to0$ (no line-of-sight) limit of Rician. Adding a LOS component of amplitude $A$ gives Rician with K-factor $K=A^2/2\sigma^2$.` },
      { front: String.raw`What is the outage probability for a Rayleigh channel?`, back: String.raw`$P_{out}=P(R<r_{th})=1-e^{-r_{th}^2/2\sigma^2}$; for small thresholds $P_{out}\approx r_{th}^2/2\sigma^2$.` },
      { front: String.raw`Why is the Rayleigh PDF zero at $r=0$?`, back: String.raw`The $r$ factor forces it to zero: a zero envelope needs both $I$ and $Q$ to vanish at once, which is essentially impossible.` },
      { front: String.raw`What is the variance of a Rayleigh distribution?`, back: String.raw`$\operatorname{Var}(R)=(2-\pi/2)\sigma^2\approx0.4292\,\sigma^2$.` },
      { front: String.raw`Why is Rayleigh the worst-case fading model?`, back: String.raw`It assumes no dominant (LOS) path, so the deepest fades occur; any LOS component ($K>0$) makes fading shallower (Rician).` },
      { front: String.raw`How does diversity help against Rayleigh fading?`, back: String.raw`With $L$ independent branches, all must fade at once for an outage, so $P_{out}\propto(r_{th}^2/2\sigma^2)^L$ — outage falls as the $L$-th power.` }
    ],
    mcqs: [
      { q: String.raw`The Rayleigh distribution describes the ___ of the sum of many independent scattered multipath components.`, options: [String.raw`phase`, String.raw`envelope (magnitude)`, String.raw`Doppler shift`, String.raw`delay spread`], answer: 1, explain: String.raw`Rayleigh is the distribution of the envelope $R=\sqrt{I^2+Q^2}$; the phase is separately uniform.` },
      { q: String.raw`For $R=\sqrt{I^2+Q^2}$ to be Rayleigh, $I$ and $Q$ must be:`, options: [String.raw`Dependent and uniform`, String.raw`Independent zero-mean Gaussians of equal variance`, String.raw`Independent exponentials`, String.raw`Constant with random phase`], answer: 1, explain: String.raw`The envelope of two independent equal-variance zero-mean Gaussians is Rayleigh.` },
      { q: String.raw`The mode (peak) of a Rayleigh PDF is at:`, options: [String.raw`$r=0$`, String.raw`$r=\sigma$`, String.raw`$r=\sigma\sqrt{\pi/2}$`, String.raw`$r=2\sigma^2$`], answer: 1, explain: String.raw`Setting $df_R/dr=0$ gives $1-r^2/\sigma^2=0$, so $r=\sigma$.` },
      { q: String.raw`The mean of a Rayleigh random variable is:`, options: [String.raw`$\sigma$`, String.raw`$2\sigma^2$`, String.raw`$\sigma\sqrt{\pi/2}\approx1.253\sigma$`, String.raw`$\sigma\sqrt{2\ln2}$`], answer: 2, explain: String.raw`$E[R]=\sigma\sqrt{\pi/2}\approx1.2533\sigma$.` },
      { q: String.raw`The instantaneous power $R^2$ of a Rayleigh envelope is distributed as:`, options: [String.raw`Rayleigh`, String.raw`Gaussian`, String.raw`Exponential`, String.raw`Uniform`], answer: 2, explain: String.raw`Transforming $P=R^2$ gives an exponential density with mean $2\sigma^2$.` },
      { q: String.raw`The Rayleigh CDF $F_R(r)$ equals:`, options: [String.raw`$e^{-r^2/2\sigma^2}$`, String.raw`$1-e^{-r^2/2\sigma^2}$`, String.raw`$1-e^{-r/\sigma}$`, String.raw`$r/\sigma^2$`], answer: 1, explain: String.raw`Integrating the PDF gives $F_R(r)=1-e^{-r^2/2\sigma^2}$.` },
      { q: String.raw`Adding a strong line-of-sight component to a Rayleigh channel makes the envelope:`, options: [String.raw`Uniform`, String.raw`Rician`, String.raw`Exponential`, String.raw`Still exactly Rayleigh`], answer: 1, explain: String.raw`A nonzero-mean component gives a Rician distribution; Rayleigh is the $K\to0$ limit.` },
      { q: String.raw`The Rician K-factor is defined as:`, options: [String.raw`$K=\sigma^2/A^2$`, String.raw`$K=A^2/2\sigma^2$`, String.raw`$K=2\sigma^2/A$`, String.raw`$K=A/\sigma$`], answer: 1, explain: String.raw`$K=A^2/2\sigma^2$ is the ratio of LOS power to scattered power; $K=0$ recovers Rayleigh.` },
      { q: String.raw`The outage probability that a Rayleigh envelope falls below $r_{th}$ is:`, options: [String.raw`$e^{-r_{th}^2/2\sigma^2}$`, String.raw`$1-e^{-r_{th}^2/2\sigma^2}$`, String.raw`$r_{th}/\sigma$`, String.raw`$1-r_{th}^2/2\sigma^2$ exactly`], answer: 1, explain: String.raw`Outage is the CDF at the threshold: $1-e^{-r_{th}^2/2\sigma^2}$.` },
      { q: String.raw`Why is the Rayleigh PDF equal to zero at $r=0$?`, options: [String.raw`Because the exponential is zero there`, String.raw`Because of the multiplying factor $r$`, String.raw`Because the variance is infinite`, String.raw`It is not — it peaks at zero`], answer: 1, explain: String.raw`The $r$ prefactor forces $f_R(0)=0$; both $I$ and $Q$ would have to be exactly zero.` },
      { q: String.raw`For the same $\sigma$, order the mode, median and mean of a Rayleigh distribution:`, options: [String.raw`mean < median < mode`, String.raw`mode < median < mean`, String.raw`all equal`, String.raw`median < mode < mean`], answer: 1, explain: String.raw`$\sigma<1.177\sigma<1.253\sigma$: mode $<$ median $<$ mean, the signature of right-skew.` },
      { q: String.raw`Using diversity with $L$ independent Rayleigh branches, the outage probability roughly:`, options: [String.raw`Stays the same`, String.raw`Falls as the $L$-th power of the single-branch outage`, String.raw`Grows linearly with $L$`, String.raw`Becomes Gaussian`], answer: 1, explain: String.raw`All $L$ branches must fade at once, so $P_{out}\propto(r_{th}^2/2\sigma^2)^L$.` }
    ],
    numericals: [
      { q: String.raw`A Rayleigh-fading envelope has scale parameter $\sigma=2$. Find the mean envelope $E[R]$.`, solution: String.raw`<p><b>Formula.</b> The mean of a Rayleigh distribution is $$E[R]=\sigma\sqrt{\frac{\pi}{2}},$$ where $\sigma$ is the scale parameter (the standard deviation of each Gaussian quadrature component).</p>
<p><b>Substitute.</b> $$E[R]=2\times\sqrt{\frac{\pi}{2}}.$$</p>
<p><b>Compute.</b> $\sqrt{\pi/2}=\sqrt{1.5708}=1.2533$, so $E[R]=2\times1.2533=2.507$.</p>
<p><b>Explanation.</b> The average received amplitude is about $2.51$, a little above the mode ($\sigma=2$) because the distribution is right-skewed. Every Rayleigh statistic scales linearly with $\sigma$, so doubling $\sigma$ would double this mean.</p>` },
      { q: String.raw`For the same channel ($\sigma=2$), find the mode and the median of the envelope.`, solution: String.raw`<p><b>Formula.</b> The mode of a Rayleigh distribution is $r_{mode}=\sigma$ and the median is $r_{med}=\sigma\sqrt{2\ln 2}$, both obtained from the PDF peak and from solving $F_R(r)=1/2$ respectively.</p>
<p><b>Substitute.</b> $$r_{mode}=2,\qquad r_{med}=2\sqrt{2\ln 2}.$$</p>
<p><b>Compute.</b> $\ln 2=0.6931$, so $2\ln2=1.3863$ and $\sqrt{1.3863}=1.1774$; thus $r_{med}=2\times1.1774=2.355$. The mode is $2.000$.</p>
<p><b>Explanation.</b> Mode $=2.00 <$ median $=2.355 <$ mean $=2.507$, the correct right-skew ordering. The median tells us the envelope is below $2.355$ exactly half the time.</p>` },
      { q: String.raw`A receiver needs envelope $R\ge r_{th}=1.0$ to work. With $\sigma=2$, find the outage probability $P(R<1.0)$.`, solution: String.raw`<p><b>Formula.</b> The outage probability is the Rayleigh CDF evaluated at the threshold: $$P_{out}=P(R<r_{th})=1-e^{-r_{th}^2/2\sigma^2}.$$</p>
<p><b>Substitute.</b> $$P_{out}=1-\exp\!\left(-\frac{(1.0)^2}{2\times(2)^2}\right)=1-\exp\!\left(-\frac{1}{8}\right).$$</p>
<p><b>Compute.</b> $-1/8=-0.125$, $e^{-0.125}=0.8825$, so $P_{out}=1-0.8825=0.1175$, about $11.8\%$.</p>
<p><b>Explanation.</b> Even though the threshold $1.0$ is well below the mean envelope $2.51$, the link is in outage nearly 12% of the time — deep fades are common. This is exactly why a fade margin (or diversity) is required in fading channels.</p>` },
      { q: String.raw`What fade margin (below the mean-square envelope) is needed for a 1% outage on a Rayleigh channel? Take $\sigma=1$ so $E[R^2]=2\sigma^2=2$.`, solution: String.raw`<p><b>Formula.</b> From $P_{out}=1-e^{-r_{th}^2/2\sigma^2}$, solve for the power threshold $p_{th}=r_{th}^2$: $$p_{th}=-2\sigma^2\ln(1-P_{out}).$$ The fade margin in dB is $M=10\log_{10}\!\dfrac{E[R^2]}{p_{th}}=10\log_{10}\dfrac{2\sigma^2}{p_{th}}$.</p>
<p><b>Substitute.</b> With $P_{out}=0.01$ and $\sigma=1$: $$p_{th}=-2(1)\ln(0.99),\qquad M=10\log_{10}\frac{2}{p_{th}}.$$</p>
<p><b>Compute.</b> $\ln(0.99)=-0.01005$, so $p_{th}=-2\times(-0.01005)=0.02010$. Then $2/p_{th}=99.5$, and $M=10\log_{10}(99.5)=19.98\approx20.0$ dB.</p>
<p><b>Explanation.</b> Guaranteeing only 1% outage against Rayleigh fading costs about 20 dB of fade margin relative to the average power — an enormous penalty. This steep cost (roughly 10 dB per decade of outage improvement) is precisely why engineers turn to diversity instead of brute-force power.</p>` },
      { q: String.raw`A Rayleigh channel has mean power $E[R^2]=2\sigma^2=8$ mW. Find $\sigma$ and the probability the instantaneous power exceeds 8 mW.`, solution: String.raw`<p><b>Formula.</b> The mean power is $E[R^2]=2\sigma^2$, so $\sigma=\sqrt{E[R^2]/2}$. The power $P=R^2$ is exponential with mean $2\sigma^2$, so $P(P>p)=e^{-p/2\sigma^2}$.</p>
<p><b>Substitute.</b> $$\sigma=\sqrt{8/2}=\sqrt{4},\qquad P(P>8)=\exp\!\left(-\frac{8}{8}\right).$$</p>
<p><b>Compute.</b> $\sigma=2$. And $P(P>8)=e^{-1}=0.3679$, about $36.8\%$.</p>
<p><b>Explanation.</b> Because the power is exponential, the chance of exceeding the mean power is $e^{-1}\approx37\%$ — the envelope spends most of its time <i>below</i> the average power, another view of why fades dominate reliability. Here $\sigma=2$ mW$^{1/2}$ sets the whole distribution.</p>` }
    ],
    realWorld: String.raw`<p>Rayleigh fading is the default statistical model for a mobile radio channel with no clear line of sight — a phone deep inside a city, a handset in a building, or a receiver behind terrain. As the user moves even a fraction of a wavelength, the multipath phasors realign and the envelope can drop 20-30 dB into a <b>deep fade</b>, momentarily severing the link. This is why raw <a href="#path-loss">path loss</a> alone never predicts coverage: the average may be fine while instantaneous fades still break the connection. Designers respond in two ways. First, they add a <b>fade margin</b> to the <a href="#link-budget">link budget</a> — extra decibels held in reserve so the outage probability $1-e^{-r_{th}^2/2\sigma^2}$ meets a target such as 1% or 0.1%. Second, and far more efficiently, they use <b>diversity</b>: multiple antennas (MIMO), multiple frequencies (frequency hopping / OFDM subcarriers), or RAKE fingers on resolvable multipath — providing independently-fading copies so that all must fade at once for an outage. Because Rayleigh assumes the worst case (no LOS), real links with some line of sight follow the gentler <b>Rician</b> law and need less margin; measured K-factors let engineers interpolate between the two. Understanding the Rayleigh envelope — its mean, its deep-fade tail, and its exponential power — is the foundation for reasoning about <a href="#rssi">RSSI</a> variability, <a href="#ber">BER</a> in fading, and receiver <a href="#sensitivity">sensitivity</a> budgets in any real wireless system.</p>`,
    related: ['normal-distribution', 'awgn', 'path-loss', 'link-budget']
  }
);
