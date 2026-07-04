// Signals & Systems study topics — deep exam-mastery content
CONTENT.topics.push(
{
  id: 'fourier-transform',
  title: 'Fourier Transform',
  category: 'Signals & Systems',
  tags: ['fourier', 'spectrum', 'frequency-domain', 'dft', 'fft', 'parseval'],
  summary: String.raw`The Fourier Transform decomposes a signal into its constituent sinusoids, mapping between the time domain and the frequency domain.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-fourier-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="55" width="96" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="60" y="72" fill="#e6edf3" text-anchor="middle">x(t)</text>
<text x="60" y="88" fill="#9aa7b5" text-anchor="middle">time signal</text>
<rect x="170" y="45" width="200" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="270" y="68" fill="#e6edf3" text-anchor="middle">analysis integral</text>
<text x="270" y="90" fill="#9aa7b5" text-anchor="middle">&#8747; x(t) e^(&#8722;j2&#960;ft) dt</text>
<rect x="432" y="55" width="96" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="480" y="72" fill="#e6edf3" text-anchor="middle">X(f)</text>
<text x="480" y="88" fill="#9aa7b5" text-anchor="middle">spectrum</text>
<line x1="108" y1="75" x2="168" y2="75" stroke="#9aa7b5" marker-end="url(#arr-fourier-transform)"/>
<line x1="370" y1="75" x2="430" y2="75" stroke="#9aa7b5" marker-end="url(#arr-fourier-transform)"/>
<text x="270" y="130" fill="#9aa7b5" text-anchor="middle">correlate x(t) with every complex sinusoid &#8594; magnitude &amp; phase per frequency</text>
</svg>`,
    caption: String.raw`x(t) is correlated with every complex exponential by the analysis integral to yield the spectrum X(f).`
  },
  {
    title: String.raw`Inverse (synthesis) path`,
    svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-fourier-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="55" width="96" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="60" y="72" fill="#e6edf3" text-anchor="middle">X(f)</text>
<text x="60" y="88" fill="#9aa7b5" text-anchor="middle">spectrum</text>
<rect x="170" y="45" width="200" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="270" y="68" fill="#e6edf3" text-anchor="middle">synthesis integral</text>
<text x="270" y="90" fill="#9aa7b5" text-anchor="middle">&#8747; X(f) e^(+j2&#960;ft) df</text>
<rect x="432" y="55" width="96" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="480" y="72" fill="#e6edf3" text-anchor="middle">x(t)</text>
<text x="480" y="88" fill="#9aa7b5" text-anchor="middle">rebuilt signal</text>
<line x1="108" y1="75" x2="168" y2="75" stroke="#9aa7b5" marker-end="url(#arr2-fourier-transform)"/>
<line x1="370" y1="75" x2="430" y2="75" stroke="#9aa7b5" marker-end="url(#arr2-fourier-transform)"/>
<text x="270" y="130" fill="#9aa7b5" text-anchor="middle">stack every sinusoid back up (weighted by X(f)) to rebuild x(t)</text>
</svg>`,
    caption: String.raw`The inverse transform sums (synthesizes) all weighted complex exponentials to reconstruct the time signal x(t).`
  },
  {
    title: String.raw`Property map`,
    svg: String.raw`<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-fourier-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="16" y="20" width="180" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="106" y="37" fill="#e6edf3" text-anchor="middle">time shift x(t&#8722;t&#8320;)</text>
<text x="106" y="52" fill="#9aa7b5" text-anchor="middle">delay in time</text>
<rect x="344" y="20" width="180" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="434" y="37" fill="#e6edf3" text-anchor="middle">phase ramp e^(&#8722;j2&#960;ft&#8320;)</text>
<text x="434" y="52" fill="#9aa7b5" text-anchor="middle">|X| unchanged</text>
<rect x="16" y="100" width="180" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="106" y="117" fill="#e6edf3" text-anchor="middle">convolution x&#8727;h</text>
<text x="106" y="132" fill="#9aa7b5" text-anchor="middle">in time</text>
<rect x="344" y="100" width="180" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="434" y="117" fill="#e6edf3" text-anchor="middle">multiply X(f)H(f)</text>
<text x="434" y="132" fill="#9aa7b5" text-anchor="middle">in frequency</text>
<line x1="196" y1="40" x2="342" y2="40" stroke="#9aa7b5" marker-end="url(#arr3-fourier-transform)"/>
<line x1="196" y1="120" x2="342" y2="120" stroke="#9aa7b5" marker-end="url(#arr3-fourier-transform)"/>
<text x="270" y="80" fill="#b197fc" text-anchor="middle">FT</text>
</svg>`,
    caption: String.raw`Two workhorse properties: a time shift becomes a linear phase ramp; time-domain convolution becomes a frequency-domain product.`
  }
  ],
  prerequisites: ['comm-basics', 'convolution'],
  intro: String.raw`<p><em>Why it exists:</em> a raw signal in time hides the one thing we most often need — which frequencies (tones, hums, carriers, noise bands) it is actually made of. You cannot read a chord off a pressure waveform or spot a $60\text{ Hz}$ hum by staring at a voltage trace. The Fourier Transform solves exactly this problem: it re-expresses a signal as its recipe of pure sinusoids, so questions about pitch, bandwidth, filtering, and interference become obvious.</p>
<p>The Fourier Transform (FT) is the single most important analytical tool in signal processing. It expresses an arbitrary time-domain signal $x(t)$ as a continuous superposition of complex exponentials $e^{j2\pi ft}$, revealing exactly which frequencies are present and with what amplitude and phase. Whereas the time domain answers <em>what happens when</em>, the frequency domain answers <em>what frequencies are present</em>.</p>
<p>Because convolution in time becomes multiplication in frequency, the FT turns the messy business of filtering, modulation, and system analysis into simple algebra. Nearly every downstream topic — spectra, sampling, aliasing, PSD, modulation — is a special case or consequence of Fourier theory.</p>`,
  sections: [
    { h: 'Definition and inverse', html: String.raw`<p>The continuous-time Fourier Transform of $x(t)$ and its inverse are</p>
<p>$$X(f)=\int_{-\infty}^{\infty} x(t)\,e^{-j2\pi ft}\,dt, \qquad x(t)=\int_{-\infty}^{\infty} X(f)\,e^{+j2\pi ft}\,df.$$</p>
<p>$X(f)$ is generally complex: $|X(f)|$ is the <strong>magnitude spectrum</strong> and $\angle X(f)$ is the <strong>phase spectrum</strong>. The transform exists (in the ordinary sense) when $x(t)$ is absolutely integrable, $\int|x(t)|\,dt<\infty$ (a Dirichlet condition); using distributions (Dirac deltas) we extend it to eternal sinusoids and constants.</p>
<p>An equivalent radian-frequency form uses $\omega=2\pi f$: $X(\omega)=\int x(t)e^{-j\omega t}dt$ with inverse $x(t)=\frac{1}{2\pi}\int X(\omega)e^{j\omega t}d\omega$. The $2\pi$ bookkeeping differs; the $f$-form is symmetric and avoids the $1/2\pi$ factor, which is why communications engineers prefer it.</p>` },
    { h: 'Core properties', html: String.raw`<p>These properties are the workhorses of exam problems. Let $x(t)\leftrightarrow X(f)$ and $y(t)\leftrightarrow Y(f)$.</p>
<table class="data">
<tr><th>Property</th><th>Time domain</th><th>Frequency domain</th></tr>
<tr><td>Linearity</td><td>$ax(t)+by(t)$</td><td>$aX(f)+bY(f)$</td></tr>
<tr><td>Time shift</td><td>$x(t-t_0)$</td><td>$X(f)e^{-j2\pi ft_0}$</td></tr>
<tr><td>Frequency shift (modulation)</td><td>$x(t)e^{j2\pi f_0 t}$</td><td>$X(f-f_0)$</td></tr>
<tr><td>Time scaling</td><td>$x(at)$</td><td>$\frac{1}{|a|}X(f/a)$</td></tr>
<tr><td>Duality</td><td>$X(t)$</td><td>$x(-f)$</td></tr>
<tr><td>Convolution</td><td>$x(t)*h(t)$</td><td>$X(f)H(f)$</td></tr>
<tr><td>Multiplication</td><td>$x(t)y(t)$</td><td>$X(f)*Y(f)$</td></tr>
<tr><td>Differentiation</td><td>$\frac{d}{dt}x(t)$</td><td>$j2\pi f\,X(f)$</td></tr>
<tr><td>Integration</td><td>$\int_{-\infty}^{t}x(\tau)d\tau$</td><td>$\frac{X(f)}{j2\pi f}+\frac{1}{2}X(0)\delta(f)$</td></tr>
</table>
<p>The <strong>time-shift</strong> property shows a delay is pure phase (linear in $f$) with no magnitude change — the basis of the linear-phase / group-delay concept. The <strong>scaling</strong> property encodes the reciprocal-spreading principle: compressing a pulse in time stretches its spectrum, so short pulses are inherently wideband.</p>` },
    { h: 'Duality', html: String.raw`<p>Duality is the symmetry between the forward and inverse transforms. If $x(t)\leftrightarrow X(f)$, then feeding the <em>shape</em> $X$ back in as a time function gives $X(t)\leftrightarrow x(-f)$. This lets you double your table for free: from rect $\leftrightarrow$ sinc you immediately get sinc $\leftrightarrow$ rect. It also explains why an ideal (brick-wall) frequency filter has a sinc-shaped, infinitely long, non-causal impulse response — the reason ideal filters cannot be built exactly.</p>` },
    { h: 'Transforms of common signals', html: String.raw`<table class="data">
<tr><th>$x(t)$</th><th>$X(f)$</th></tr>
<tr><td>$\delta(t)$</td><td>$1$</td></tr>
<tr><td>$1$</td><td>$\delta(f)$</td></tr>
<tr><td>$e^{j2\pi f_0 t}$</td><td>$\delta(f-f_0)$</td></tr>
<tr><td>$\cos(2\pi f_0 t)$</td><td>$\tfrac12[\delta(f-f_0)+\delta(f+f_0)]$</td></tr>
<tr><td>$\sin(2\pi f_0 t)$</td><td>$\tfrac{1}{2j}[\delta(f-f_0)-\delta(f+f_0)]$</td></tr>
<tr><td>$\mathrm{rect}(t/T)$</td><td>$T\,\mathrm{sinc}(fT)$</td></tr>
<tr><td>$\mathrm{sinc}(2Bt)$</td><td>$\frac{1}{2B}\mathrm{rect}(f/2B)$</td></tr>
<tr><td>$e^{-at}u(t),\,a>0$</td><td>$\frac{1}{a+j2\pi f}$</td></tr>
<tr><td>$e^{-\pi t^2}$ (Gaussian)</td><td>$e^{-\pi f^2}$ (self-dual)</td></tr>
<tr><td>$\sum_n\delta(t-nT)$</td><td>$\frac{1}{T}\sum_k\delta(f-k/T)$</td></tr>
</table>
<p>Here $\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$. The impulse train (Dirac comb) transforming into another comb is the mathematical heart of sampling. The Gaussian being its own transform is why it achieves the minimum time-bandwidth product.</p>` },
    { h: 'Parseval / Rayleigh energy theorem', html: String.raw`<p>Energy is conserved between domains:</p>
<p>$$E=\int_{-\infty}^{\infty}|x(t)|^2\,dt=\int_{-\infty}^{\infty}|X(f)|^2\,df.$$</p>
<p>$|X(f)|^2$ is the <strong>energy spectral density (ESD)</strong> — energy per hertz. For power signals the analogous quantity is the power spectral density (PSD). Parseval lets you compute energy in whichever domain is easier and underlies matched-filter SNR arguments.</p>` },
    { h: 'From FT to DFT and FFT', html: String.raw`<p>Computers cannot evaluate a continuous integral over infinite time. The <strong>Discrete Fourier Transform (DFT)</strong> operates on $N$ samples $x[n]$:</p>
<p>$$X[k]=\sum_{n=0}^{N-1}x[n]\,e^{-j2\pi kn/N},\qquad x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]\,e^{+j2\pi kn/N}.$$</p>
<p>Bin $k$ corresponds to frequency $f_k=k f_s/N$, so the bin spacing (resolution) is $\Delta f=f_s/N=1/(NT_s)$ — set by the total record length, not the sample rate. The DFT implicitly assumes the block repeats periodically; a non-integer number of cycles in the window causes <strong>spectral leakage</strong>, mitigated by windowing (Hann, Hamming, Blackman).</p>
<p>The <strong>Fast Fourier Transform (FFT)</strong> is any $O(N\log N)$ algorithm computing the DFT (Cooley–Tukey factorizes $N=2^m$), versus $O(N^2)$ for the direct sum. For $N=1024$ that is ~100x fewer operations; for a million points it is ~50000x. The FFT is what makes real-time spectrum analysis, OFDM, and fast convolution practical.</p>` },
    { h: 'Relation to spectrum and PSD', html: String.raw`<p>A <strong>spectrum analyzer</strong> displays $|X(f)|$ (or its square) of the input. For deterministic energy signals this is the ESD $|X(f)|^2$. For random/noise-like signals the FT does not converge, so we use the <strong>power spectral density</strong>, defined via the Wiener–Khinchin theorem as the FT of the autocorrelation, $S_x(f)=\mathcal{F}\{R_x(\tau)\}$. Practical estimators (periodogram, Welch's method) average FFTs of windowed segments to reduce variance. See <a href="#psd">PSD</a>.</p>` },
    { h: 'Common pitfalls', html: String.raw`<div class="callout"><strong>Watch out:</strong>
<ul>
<li><strong>$f$ vs $\omega$:</strong> mixing conventions drops or adds $2\pi$ factors. Pick one and stay consistent.</li>
<li><strong>Resolution vs. sample rate:</strong> more samples at the same rate give finer $\Delta f$ but do NOT extend the frequency range; a higher rate extends range but not resolution.</li>
<li><strong>Leakage:</strong> a pure tone smears across bins unless it lands exactly on a bin; window before FFT.</li>
<li><strong>Zero-padding</strong> interpolates the spectrum (smoother plot) but adds NO real resolution — resolution needs longer real data.</li>
<li><strong>Negative frequencies</strong> are physical for complex signals; for real signals $X(-f)=X^*(f)$ (Hermitian symmetry), so the two-sided spectrum is redundant.</li>
</ul></div>` },
    { h: 'What you should now understand', html: String.raw`<ul>
<li><strong>The core idea:</strong> the FT rewrites any signal as a sum of complex sinusoids, exposing its frequency content — the analysis integral measures each frequency, the synthesis integral rebuilds the signal.</li>
<li><strong>Magnitude and phase:</strong> $X(f)$ is complex; $|X(f)|$ tells you how much of each frequency is present and $\angle X(f)$ its timing.</li>
<li><strong>The property toolkit:</strong> a delay is a linear phase ramp, scaling spreads reciprocally (short pulse $\Rightarrow$ wide band), and — the headline result — convolution in time becomes multiplication in frequency.</li>
<li><strong>Energy is conserved:</strong> Parseval says total energy is the same in either domain, and $|X(f)|^2$ is the energy spectral density.</li>
<li><strong>Symmetry:</strong> real signals have Hermitian spectra, so the negative-frequency half is redundant.</li>
<li><strong>From theory to computation:</strong> the DFT samples this on $N$ points with resolution $\Delta f=f_s/N$ (set by record length), the FFT computes it in $O(N\log N)$, and windowing tames leakage.</li>
</ul>` }
  ],
  keyPoints: [
    String.raw`FT: $X(f)=\int x(t)e^{-j2\pi ft}dt$; inverse reconstructs $x(t)$ from its spectrum.`,
    String.raw`Convolution in time $\leftrightarrow$ multiplication in frequency — the reason FT dominates filtering theory.`,
    String.raw`Time shift $\to$ linear phase $e^{-j2\pi ft_0}$; magnitude unchanged.`,
    String.raw`Scaling: narrow in time $\Rightarrow$ wide in frequency (reciprocal spreading).`,
    String.raw`Parseval: energy is identical in both domains; $|X(f)|^2$ is energy spectral density.`,
    String.raw`For real $x(t)$: $X(-f)=X^*(f)$ (Hermitian), so magnitude is even, phase is odd.`,
    String.raw`rect $\leftrightarrow$ sinc; Gaussian is self-dual; impulse train $\leftrightarrow$ impulse train.`,
    String.raw`DFT bin spacing $\Delta f=f_s/N$ is set by record length $NT_s$, not sample rate.`,
    String.raw`FFT computes the DFT in $O(N\log N)$ instead of $O(N^2)$.`,
    String.raw`Spectral leakage arises from non-integer cycles in the window; fix with windowing.`,
    String.raw`Zero-padding interpolates but adds no true resolution.`,
    String.raw`Duality: $X(t)\leftrightarrow x(-f)$ doubles every transform pair you know.`
  ],
  equations: [
    { title: String.raw`Forward transform`, tex: String.raw`$$X(f)=\int_{-\infty}^{\infty} x(t)\,e^{-j2\pi ft}\,dt$$`, derivation: String.raw`<p>Start from the Fourier series of a periodic signal of period $T_0$: $x(t)=\sum_k c_k e^{j2\pi k t/T_0}$ with $c_k=\frac{1}{T_0}\int_{-T_0/2}^{T_0/2}x(t)e^{-j2\pi kt/T_0}dt$. Let $f_k=k/T_0$ and $\Delta f=1/T_0$. Then $T_0 c_k = \int x(t)e^{-j2\pi f_k t}dt \equiv X(f_k)$. As $T_0\to\infty$, $\Delta f\to df$, the discrete lines $f_k$ merge into a continuum, and the series sum $\sum_k (X(f_k)/T_0)e^{j2\pi f_k t}=\sum_k X(f_k)e^{j2\pi f_k t}\Delta f$ becomes the inverse integral $\int X(f)e^{j2\pi ft}df$, while $X(f_k)$ becomes the forward integral above.</p>` },
    { title: String.raw`Time-shift property`, tex: String.raw`$$x(t-t_0)\;\leftrightarrow\; X(f)\,e^{-j2\pi f t_0}$$`, derivation: String.raw`<p>$\int x(t-t_0)e^{-j2\pi ft}dt$. Substitute $\tau=t-t_0$, $dt=d\tau$, $t=\tau+t_0$: $=\int x(\tau)e^{-j2\pi f(\tau+t_0)}d\tau=e^{-j2\pi ft_0}\int x(\tau)e^{-j2\pi f\tau}d\tau=e^{-j2\pi ft_0}X(f)$. A pure delay multiplies the spectrum by a unit-magnitude, linear-in-$f$ phase.</p>` },
    { title: String.raw`Convolution theorem`, tex: String.raw`$$x(t)*h(t)\;\leftrightarrow\; X(f)H(f)$$`, derivation: String.raw`<p>$\mathcal{F}\{x*h\}=\int\!\!\left[\int x(\tau)h(t-\tau)d\tau\right]e^{-j2\pi ft}dt$. Swap order: $=\int x(\tau)\left[\int h(t-\tau)e^{-j2\pi ft}dt\right]d\tau$. The inner integral is $H(f)e^{-j2\pi f\tau}$ (time-shift property). So $=\int x(\tau)H(f)e^{-j2\pi f\tau}d\tau=H(f)X(f)$.</p>` },
    { title: String.raw`FT of a rectangular pulse`, tex: String.raw`$$\mathrm{rect}(t/T)\;\leftrightarrow\; T\,\mathrm{sinc}(fT)$$`, derivation: String.raw`<p>$X(f)=\int_{-T/2}^{T/2}1\cdot e^{-j2\pi ft}dt=\left[\frac{e^{-j2\pi ft}}{-j2\pi f}\right]_{-T/2}^{T/2}=\frac{e^{j\pi fT}-e^{-j\pi fT}}{j2\pi f}=\frac{\sin(\pi fT)}{\pi f}=T\,\frac{\sin(\pi fT)}{\pi fT}=T\,\mathrm{sinc}(fT).$</p>` },
    { title: String.raw`Parseval's theorem`, tex: String.raw`$$\int|x(t)|^2dt=\int|X(f)|^2df$$`, derivation: String.raw`<p>$\int x(t)x^*(t)dt=\int x(t)\left[\int X^*(f)e^{-j2\pi ft}df\right]dt$. Swap: $=\int X^*(f)\left[\int x(t)e^{-j2\pi ft}dt\right]df=\int X^*(f)X(f)df=\int|X(f)|^2df$.</p>` },
    { title: String.raw`FT of cosine`, tex: String.raw`$$\cos(2\pi f_0 t)\;\leftrightarrow\;\tfrac12\delta(f-f_0)+\tfrac12\delta(f+f_0)$$`, derivation: String.raw`<p>Write $\cos(2\pi f_0 t)=\tfrac12 e^{j2\pi f_0 t}+\tfrac12 e^{-j2\pi f_0 t}$. Since $e^{j2\pi f_0 t}\leftrightarrow\delta(f-f_0)$ (frequency-shift of the constant $1\leftrightarrow\delta(f)$), linearity gives two half-height impulses at $\pm f_0$. A real sinusoid thus has a two-sided line spectrum.</p>` },
    { title: String.raw`Differentiation property`, tex: String.raw`$$\frac{d}{dt}x(t)\;\leftrightarrow\; j2\pi f\,X(f)$$`, derivation: String.raw`<p>Differentiate the inverse transform under the integral: $\frac{d}{dt}\int X(f)e^{j2\pi ft}df=\int X(f)(j2\pi f)e^{j2\pi ft}df$. The integrand is the inverse transform of $j2\pi f X(f)$, so $x'(t)\leftrightarrow j2\pi f X(f)$. Differentiation boosts high frequencies (a $\times f$ tilt).</p>` },
    { title: String.raw`DFT`, tex: String.raw`$$X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N}$$`, derivation: String.raw`<p>Sample $x(t)$ at $t=nT_s$ and approximate the FT integral over one record of $N$ samples by a Riemann sum, evaluating only at the discrete frequencies $f_k=k/(NT_s)$ that make the block periodic: $X(f_k)\approx T_s\sum_{n}x[n]e^{-j2\pi f_k nT_s}=T_s\sum_n x[n]e^{-j2\pi kn/N}$. Dropping the constant $T_s$ scale gives the standard DFT.</p>` }
  ],
  flashcards: [
    { front: String.raw`State the forward and inverse Fourier Transform.`, back: String.raw`$X(f)=\int x(t)e^{-j2\pi ft}dt$ and $x(t)=\int X(f)e^{j2\pi ft}df$.` },
    { front: String.raw`What does convolution in time become in frequency?`, back: String.raw`Multiplication: $x*h\leftrightarrow X(f)H(f)$.` },
    { front: String.raw`FT of a rectangular pulse of width $T$?`, back: String.raw`$T\,\mathrm{sinc}(fT)$ — a sinc whose first nulls are at $f=\pm1/T$.` },
    { front: String.raw`Effect of a time delay $t_0$ on the spectrum?`, back: String.raw`Multiplies by $e^{-j2\pi ft_0}$: linear phase, magnitude unchanged.` },
    { front: String.raw`State Parseval's theorem.`, back: String.raw`$\int|x(t)|^2dt=\int|X(f)|^2df$; energy is preserved across domains.` },
    { front: String.raw`Symmetry of $X(f)$ for a real signal?`, back: String.raw`Hermitian: $X(-f)=X^*(f)$; magnitude even, phase odd.` },
    { front: String.raw`What sets DFT frequency resolution?`, back: String.raw`$\Delta f=f_s/N=1/(NT_s)$ — the total record length, not the sample rate.` },
    { front: String.raw`What is spectral leakage and its cure?`, back: String.raw`Smearing of a tone across bins from non-integer cycles in the window; reduced by windowing (Hann/Hamming).` },
    { front: String.raw`FFT complexity vs direct DFT?`, back: String.raw`$O(N\log N)$ vs $O(N^2)$.` },
    { front: String.raw`Does zero-padding improve resolution?`, back: String.raw`No — it only interpolates/smooths the spectrum; real resolution needs longer data.` },
    { front: String.raw`Time-scaling property?`, back: String.raw`$x(at)\leftrightarrow \frac{1}{|a|}X(f/a)$; compress in time = expand in frequency.` },
    { front: String.raw`What is the FT of an impulse train (period $T$)?`, back: String.raw`Another impulse train, spacing $1/T$, height $1/T$ — the basis of sampling.` },
    { front: String.raw`Which signal is its own Fourier Transform?`, back: String.raw`The Gaussian $e^{-\pi t^2}\leftrightarrow e^{-\pi f^2}$ (minimum time-bandwidth product).` },
    { front: String.raw`State duality.`, back: String.raw`If $x(t)\leftrightarrow X(f)$ then $X(t)\leftrightarrow x(-f)$.` }
  ],
  mcqs: [
    { q: String.raw`Convolution in the time domain corresponds to what in the frequency domain?`, options: [String.raw`Convolution`, String.raw`Multiplication`, String.raw`Addition`, String.raw`Differentiation`], answer: 1, explain: String.raw`The convolution theorem: $x*h\leftrightarrow X(f)H(f)$.` },
    { q: String.raw`The Fourier Transform of a rectangular pulse is a:`, options: [String.raw`Another rectangle`, String.raw`Gaussian`, String.raw`Sinc function`, String.raw`Impulse`], answer: 2, explain: String.raw`$\mathrm{rect}(t/T)\leftrightarrow T\,\mathrm{sinc}(fT)$.` },
    { q: String.raw`A pure time delay affects the spectrum by:`, options: [String.raw`Scaling the magnitude`, String.raw`Adding a linear phase term`, String.raw`Shifting it in frequency`, String.raw`Nothing`], answer: 1, explain: String.raw`$x(t-t_0)\leftrightarrow X(f)e^{-j2\pi ft_0}$: linear phase, magnitude unchanged.` },
    { q: String.raw`DFT frequency resolution $\Delta f$ equals:`, options: [String.raw`$f_s$`, String.raw`$f_s/2$`, String.raw`$f_s/N$`, String.raw`$N f_s$`], answer: 2, explain: String.raw`$\Delta f=f_s/N=1/(NT_s)$, set by record length.` },
    { q: String.raw`Zero-padding a signal before the FFT:`, options: [String.raw`Improves true resolution`, String.raw`Interpolates the spectrum but adds no resolution`, String.raw`Removes leakage`, String.raw`Increases the sample rate`], answer: 1, explain: String.raw`It smooths/interpolates; real resolution needs longer real data.` },
    { q: String.raw`For a real signal, $X(f)$ satisfies:`, options: [String.raw`$X(-f)=X(f)$`, String.raw`$X(-f)=X^*(f)$`, String.raw`$X(-f)=-X(f)$`, String.raw`$X(f)$ is purely real`], answer: 1, explain: String.raw`Hermitian symmetry: magnitude even, phase odd.` },
    { q: String.raw`The FFT reduces DFT computation to:`, options: [String.raw`$O(N)$`, String.raw`$O(N\log N)$`, String.raw`$O(N^2)$`, String.raw`$O(N^3)$`], answer: 1, explain: String.raw`Cooley–Tukey achieves $O(N\log N)$.` },
    { q: String.raw`$|X(f)|^2$ for an energy signal represents:`, options: [String.raw`Power spectral density`, String.raw`Energy spectral density`, String.raw`Phase spectrum`, String.raw`Autocorrelation`], answer: 1, explain: String.raw`It is energy per hertz; its integral gives total energy (Parseval).` },
    { q: String.raw`Compressing a pulse in time by factor $a>1$ makes its spectrum:`, options: [String.raw`Narrower`, String.raw`Wider`, String.raw`Unchanged`, String.raw`Shifted`], answer: 1, explain: String.raw`Scaling: $x(at)\leftrightarrow\frac1{|a|}X(f/a)$ — wider spectrum.` },
    { q: String.raw`Spectral leakage in a DFT is caused by:`, options: [String.raw`Too high a sample rate`, String.raw`A non-integer number of cycles in the window`, String.raw`Quantization`, String.raw`Aliasing`], answer: 1, explain: String.raw`Discontinuity at the block edges spreads energy; windowing reduces it.` },
    { q: String.raw`Which signal is its own Fourier Transform?`, options: [String.raw`Rectangle`, String.raw`Sinc`, String.raw`Gaussian`, String.raw`Triangle`], answer: 2, explain: String.raw`$e^{-\pi t^2}\leftrightarrow e^{-\pi f^2}$.` },
    { q: String.raw`The FT of $\cos(2\pi f_0 t)$ is:`, options: [String.raw`A single impulse at $f_0$`, String.raw`Two impulses at $\pm f_0$, each height $1/2$`, String.raw`A sinc at $f_0$`, String.raw`A constant`], answer: 1, explain: String.raw`Real cosine has a symmetric two-sided line spectrum.` },
    { q: String.raw`Duality states that if $x(t)\leftrightarrow X(f)$ then:`, options: [String.raw`$X(t)\leftrightarrow x(-f)$`, String.raw`$x(-t)\leftrightarrow X(f)$`, String.raw`$X(t)\leftrightarrow x(f)$`, String.raw`$x(t)\leftrightarrow -X(f)$`], answer: 0, explain: String.raw`Swapping time/frequency roles gives $X(t)\leftrightarrow x(-f)$.` }
  ],
  numericals: [
    { q: String.raw`A rectangular pulse has width $T=1\text{ ms}$. Where is the first spectral null, and what is the approximate mainlobe (null-to-null) bandwidth?`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{rect}(t/T)\;\leftrightarrow\;T\,\mathrm{sinc}(fT),\qquad f_{\text{null}}=\frac{1}{T}$$ where $T$ is the pulse width and $f_{\text{null}}$ is the first zero of the sinc (where $fT=1$).</p>
<p><b>Substitute.</b> $$f_{\text{null}}=\frac{1}{1\text{ ms}}=\frac{1}{10^{-3}\text{ s}}.$$</p>
<p><b>Compute.</b> $f_{\text{null}}=1000\text{ Hz}=1\text{ kHz}$. The mainlobe runs from $-1\text{ kHz}$ to $+1\text{ kHz}$, so the null-to-null width is $2\text{ kHz}$.</p>
<p><b>Explanation.</b> A shorter pulse pushes the first null higher, so its spectrum is wider — the reciprocal-spreading rule (bandwidth $\approx 1/T$). This is why brief pulses inherently occupy a large bandwidth.</p>` },
    { q: String.raw`An FFT uses $N=1024$ samples at $f_s=48\text{ kHz}$. Find the bin spacing and the highest resolvable frequency.`, solution: String.raw`<p><b>Formula.</b> $$\Delta f=\frac{f_s}{N},\qquad f_{\max}=\frac{f_s}{2}$$ where $f_s$ is the sample rate, $N$ the FFT length, $\Delta f$ the bin spacing (resolution), and $f_{\max}$ the Nyquist limit.</p>
<p><b>Substitute.</b> $$\Delta f=\frac{48000\text{ Hz}}{1024},\qquad f_{\max}=\frac{48000\text{ Hz}}{2}.$$</p>
<p><b>Compute.</b> $\Delta f=46.875\approx46.9\text{ Hz}$; $f_{\max}=24\text{ kHz}$ (Nyquist bin $N/2=512$). The record duration is $N/f_s=1024/48000\approx21.3\text{ ms}$.</p>
<p><b>Explanation.</b> Resolution is set by the record length ($1/\Delta f=21.3\text{ ms}$), while the top frequency is fixed by the sample rate — two independent knobs. Doubling $N$ halves $\Delta f$ but leaves $f_{\max}$ unchanged.</p>` },
    { q: String.raw`A signal is $x(t)=e^{-2t}u(t)$. Find $X(f)$ and $|X(0)|$.`, solution: String.raw`<p><b>Formula.</b> $$e^{-at}u(t)\;\leftrightarrow\;X(f)=\frac{1}{a+j2\pi f}$$ where $a$ is the decay rate ($a=2\text{ s}^{-1}$ here), $f$ the frequency, and $u(t)$ the unit step making the signal one-sided.</p>
<p><b>Substitute.</b> $$X(f)=\int_0^\infty e^{-2t}e^{-j2\pi ft}dt=\frac{1}{2+j2\pi f};\qquad X(0)=\frac{1}{2+0}.$$</p>
<p><b>Compute.</b> $X(0)=\tfrac12$, so $|X(0)|=0.5$. The magnitude is $|X(f)|=1/\sqrt{4+4\pi^2 f^2}$; the $-3\text{ dB}$ point is where $2\pi f=2$, i.e. $f=1/\pi\approx0.318\text{ Hz}$.</p>
<p><b>Explanation.</b> This is a first-order low-pass shape: DC gain $0.5$ set by $1/a$, rolling off at $-20\text{ dB/decade}$. Faster decay (larger $a$) lowers the DC value but widens the bandwidth.</p>` },
    { q: String.raw`Verify Parseval for $x(t)=e^{-2t}u(t)$: compute total energy in the time domain.`, solution: String.raw`<p><b>Formula.</b> $$E=\int_{-\infty}^{\infty}|x(t)|^2\,dt=\int_{-\infty}^{\infty}|X(f)|^2\,df$$ where $E$ is total energy (Parseval's theorem equates the two domains); $|X(f)|^2$ is the energy spectral density.</p>
<p><b>Substitute.</b> $$E=\int_0^\infty\left(e^{-2t}\right)^2 dt=\int_0^\infty e^{-4t}\,dt.$$</p>
<p><b>Compute.</b> $E=\left[-\tfrac14 e^{-4t}\right]_0^\infty=\tfrac14=0.25\text{ J}$. Frequency-domain check: $\int\frac{df}{4+4\pi^2 f^2}=\frac{1}{4\pi}\big[\arctan(\pi f)\big]_{-\infty}^{\infty}=\frac{1}{4\pi}\cdot\pi=0.25\text{ J}$ — identical.</p>
<p><b>Explanation.</b> Both domains yield the same $0.25\text{ J}$, confirming energy is conserved by the transform. Parseval lets you pick whichever integral is easier; here the time-domain one is trivial.</p>` },
    { q: String.raw`A tone at exactly $f_s/4$ is captured in a 256-point window. Which bin holds it and will there be leakage?`, solution: String.raw`<p><b>Formula.</b> $$k=\frac{f\,N}{f_s}$$ where $f$ is the tone frequency, $N$ the window length, $f_s$ the sample rate, and $k$ the (ideally integer) bin index.</p>
<p><b>Substitute.</b> $$k=\frac{(f_s/4)\cdot 256}{f_s}=\frac{256}{4}.$$</p>
<p><b>Compute.</b> $k=64$, an exact integer, so the tone completes exactly $64$ whole cycles in the window and lands entirely in bin $64$ — <em>no</em> leakage.</p>
<p><b>Explanation.</b> Leakage arises only when the tone falls between bins (e.g. $63.5$ cycles), spreading energy into neighbours. An integer-cycle fit gives a clean single-bin spike, which is why coherent test tones are chosen to land on bins.</p>` },
    { q: String.raw`Two tones are $50\text{ Hz}$ apart. What minimum FFT record length resolves them?`, solution: String.raw`<p><b>Formula.</b> $$\Delta f=\frac{1}{T_{\text{record}}}=\frac{1}{N T_s}$$ where $\Delta f$ is the bin spacing (must be $\le$ the tone separation to resolve them), $T_{\text{record}}$ the record duration, $N$ the sample count, and $T_s=1/f_s$.</p>
<p><b>Substitute.</b> Require $\Delta f\le 50\text{ Hz}$: $$T_{\text{record}}\ge\frac{1}{50\text{ Hz}};\qquad N=f_s T_{\text{record}}=10000\times T_{\text{record}}.$$</p>
<p><b>Compute.</b> $T_{\text{record}}\ge 20\text{ ms}$; at $f_s=10\text{ kHz}$, $N\ge 10000\times 0.02=200$ samples (round up to a power of two, $N=256$).</p>
<p><b>Explanation.</b> Resolving closely spaced tones needs a long observation, not a fast one — $\Delta f$ depends only on record length. Rounding $N$ up to $256$ suits a radix-2 FFT and gives a little margin.</p>` }
  ],
  realWorld: String.raw`<p>The Fourier Transform underpins nearly all modern DSP hardware. Spectrum analyzers, OFDM systems (Wi-Fi, LTE, 5G, DVB) that literally transmit data on FFT bins, MP3/AAC audio and JPEG image compression (which discard perceptually weak frequency components), radar Doppler processing, MRI image reconstruction, and vibration/fault analysis in rotating machinery all rest on the FFT. In an SDR, the FFT is usually the first block after the ADC, turning a raw sample stream into a live waterfall display.</p>`,
  related: ['laplace-transform', 'z-transform', 'convolution', 'psd', 'nyquist-sampling']
},
{
  id: 'laplace-transform',
  title: 'Laplace Transform',
  category: 'Signals & Systems',
  tags: ['laplace', 's-plane', 'transfer-function', 'poles-zeros', 'stability', 'roc'],
  summary: String.raw`The Laplace Transform generalizes the Fourier Transform to a complex frequency $s=\sigma+j\omega$, enabling analysis of stability, transients, and LTI systems via poles and zeros.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-laplace-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="50" width="90" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="57" y="67" fill="#e6edf3" text-anchor="middle">X(s)</text>
<text x="57" y="83" fill="#9aa7b5" text-anchor="middle">input</text>
<rect x="160" y="40" width="210" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="265" y="63" fill="#e6edf3" text-anchor="middle">system H(s) = N(s)/D(s)</text>
<text x="265" y="85" fill="#9aa7b5" text-anchor="middle">poles &#215; and zeros &#9675; in s-plane</text>
<rect x="428" y="50" width="100" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="478" y="67" fill="#e6edf3" text-anchor="middle">Y(s)=H(s)X(s)</text>
<text x="478" y="83" fill="#9aa7b5" text-anchor="middle">output</text>
<line x1="102" y1="70" x2="158" y2="70" stroke="#9aa7b5" marker-end="url(#arr-laplace-transform)"/>
<line x1="370" y1="70" x2="426" y2="70" stroke="#9aa7b5" marker-end="url(#arr-laplace-transform)"/>
<text x="265" y="135" fill="#b197fc" text-anchor="middle">stable &#8660; all poles in left half-plane (Re s &lt; 0)</text>
</svg>`,
    caption: String.raw`H(s) maps input to output; pole locations in the s-plane set stability (all poles in the LHP means stable).`
  },
  {
    title: String.raw`s-plane stability & ROC`,
    svg: String.raw`<svg viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-laplace-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="30" y="20" width="180" height="170" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="120" y="38" fill="#63e6be" text-anchor="middle">LHP: stable (Re s &lt; 0)</text>
<rect x="250" y="20" width="180" height="170" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="340" y="38" fill="#ffa94d" text-anchor="middle">RHP: unstable</text>
<line x1="230" y1="20" x2="230" y2="190" stroke="#b197fc" stroke-dasharray="4 3"/>
<text x="230" y="208" fill="#b197fc" text-anchor="middle">j&#969;-axis</text>
<text x="120" y="90" fill="#e6edf3" text-anchor="middle">&#215; poles here</text>
<text x="120" y="110" fill="#9aa7b5" text-anchor="middle">e^(&#963;t) decays</text>
<text x="120" y="150" fill="#9aa7b5" text-anchor="middle">ROC = right of</text>
<text x="120" y="166" fill="#9aa7b5" text-anchor="middle">rightmost pole</text>
<text x="340" y="90" fill="#e6edf3" text-anchor="middle">&#215; pole here</text>
<text x="340" y="110" fill="#9aa7b5" text-anchor="middle">e^(&#963;t) grows</text>
</svg>`,
    caption: String.raw`Pole real part sets fate: left half-plane poles decay (stable) and the ROC lies right of the rightmost pole; a right half-plane pole grows (unstable).`
  },
  {
    title: String.raw`ODE-solving flow`,
    svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-laplace-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="20" width="120" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="72" y="37" fill="#e6edf3" text-anchor="middle">ODE + IC</text>
<text x="72" y="52" fill="#9aa7b5" text-anchor="middle">in t</text>
<rect x="196" y="20" width="148" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="270" y="37" fill="#e6edf3" text-anchor="middle">algebra in s</text>
<text x="270" y="52" fill="#9aa7b5" text-anchor="middle">solve for Y(s)</text>
<rect x="408" y="20" width="120" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="468" y="37" fill="#e6edf3" text-anchor="middle">partial</text>
<text x="468" y="52" fill="#9aa7b5" text-anchor="middle">fractions</text>
<rect x="196" y="110" width="148" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="270" y="127" fill="#e6edf3" text-anchor="middle">y(t)</text>
<text x="270" y="142" fill="#9aa7b5" text-anchor="middle">solution in t</text>
<rect x="408" y="110" width="120" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="468" y="127" fill="#e6edf3" text-anchor="middle">L&#8315;&#185; table</text>
<text x="468" y="142" fill="#9aa7b5" text-anchor="middle">term by term</text>
<line x1="132" y1="40" x2="194" y2="40" stroke="#9aa7b5" marker-end="url(#arr3-laplace-transform)"/>
<text x="163" y="34" fill="#9aa7b5" text-anchor="middle">L</text>
<line x1="344" y1="40" x2="406" y2="40" stroke="#9aa7b5" marker-end="url(#arr3-laplace-transform)"/>
<line x1="468" y1="60" x2="468" y2="108" stroke="#9aa7b5" marker-end="url(#arr3-laplace-transform)"/>
<line x1="406" y1="130" x2="346" y2="130" stroke="#9aa7b5" marker-end="url(#arr3-laplace-transform)"/>
</svg>`,
    caption: String.raw`Laplace turns an ODE (with initial conditions) into algebra in s; partial fractions plus an inverse-transform table return y(t).`
  }
  ],
  prerequisites: ['fourier-transform', 'convolution'],
  intro: String.raw`<p><em>Why it exists:</em> the Fourier Transform is blind to signals that grow and gives no direct handle on <em>stability</em> or on the transient that follows switching a circuit on. Engineers needed one object that answers "will this system blow up, how fast does it settle, and how do I solve its differential equation without drudgery?" The Laplace Transform is that object: by weighting the signal with $e^{-\sigma t}$ it converges for growing signals, turns calculus into algebra, and reduces the whole stability question to where a few poles sit.</p>
<p>The Laplace Transform extends the Fourier Transform by adding an exponential weighting $e^{-\sigma t}$, so it can handle signals that grow, and — crucially — it lets us describe a linear time-invariant (LTI) system by a single rational function $H(s)$, the <strong>transfer function</strong>. The locations of its <strong>poles</strong> and <strong>zeros</strong> in the complex $s$-plane tell us at a glance whether the system is stable, how fast it responds, and how it resonates.</p>
<p>Control engineers and circuit designers live in the $s$-plane. Solving differential equations becomes algebra; cascading systems becomes multiplication; and the boundary between stability and instability is simply the imaginary ($j\omega$) axis.</p>`,
  sections: [
    { h: 'Definition and region of convergence', html: String.raw`<p>The (unilateral) Laplace Transform is</p>
<p>$$X(s)=\int_{0^-}^{\infty}x(t)\,e^{-st}\,dt,\qquad s=\sigma+j\omega.$$</p>
<p>The bilateral version integrates from $-\infty$. The transform converges only for those $s$ whose real part $\sigma$ makes the integrand decay — this set is the <strong>Region of Convergence (ROC)</strong>. For $x(t)=e^{at}u(t)$, $X(s)=1/(s-a)$ with ROC $\mathrm{Re}(s)>a$: a right-sided signal has an ROC to the <em>right</em> of its rightmost pole. The same algebraic $X(s)$ can correspond to different time signals depending on the ROC, so <strong>the ROC is part of the answer</strong>.</p>
<p>The ROC never contains poles, is a vertical strip/half-plane, and for a causal system extends rightward from the rightmost pole to $+\infty$.</p>` },
    { h: 'Poles, zeros and the s-plane', html: String.raw`<div class="callout tip"><strong>Intuition:</strong> think of $H(s)$ as a landscape over the complex plane. <em>Poles</em> are mountains where the response shoots to infinity (the system's natural resonances); <em>zeros</em> are valleys where it vanishes (frequencies the system blocks). Where these mountains sit — left or right, near or far from the vertical axis — is the entire personality of the system: its stability, speed, and ringiness.</div>
<p>Most useful transforms are rational: $X(s)=\dfrac{N(s)}{D(s)}=K\dfrac{\prod_i(s-z_i)}{\prod_k(s-p_k)}$. The <strong>zeros</strong> $z_i$ are roots of the numerator (where $X=0$); the <strong>poles</strong> $p_k$ are roots of the denominator (where $X\to\infty$). Plotting them on the complex plane (zeros as $\circ$, poles as $\times$) gives the <strong>pole-zero map</strong>, a complete fingerprint of the system up to the gain $K$.</p>
<ul>
<li>Real part $\sigma$ of a pole sets the <strong>decay/growth rate</strong> ($e^{\sigma t}$): left half $\Rightarrow$ decay, right half $\Rightarrow$ growth.</li>
<li>Imaginary part $\omega$ sets the <strong>oscillation frequency</strong>.</li>
<li>Poles near the $j\omega$-axis are lightly damped (ringy); poles far left are heavily damped (fast, smooth).</li>
<li>Complex poles occur in conjugate pairs for real systems.</li>
</ul>` },
    { h: 'Key properties', html: String.raw`<table class="data">
<tr><th>Property</th><th>Time</th><th>$s$-domain</th></tr>
<tr><td>Linearity</td><td>$ax+by$</td><td>$aX+bY$</td></tr>
<tr><td>Time shift ($t_0>0$)</td><td>$x(t-t_0)u(t-t_0)$</td><td>$e^{-st_0}X(s)$</td></tr>
<tr><td>$s$-shift</td><td>$e^{at}x(t)$</td><td>$X(s-a)$</td></tr>
<tr><td>Differentiation</td><td>$x'(t)$</td><td>$sX(s)-x(0^-)$</td></tr>
<tr><td>Integration</td><td>$\int_0^t x\,d\tau$</td><td>$X(s)/s$</td></tr>
<tr><td>Convolution</td><td>$x*h$</td><td>$X(s)H(s)$</td></tr>
<tr><td>Initial value</td><td>$x(0^+)$</td><td>$\lim_{s\to\infty}sX(s)$</td></tr>
<tr><td>Final value</td><td>$x(\infty)$</td><td>$\lim_{s\to0}sX(s)$</td></tr>
</table>
<p>The differentiation rule carries <strong>initial conditions</strong> ($x(0^-)$), which is exactly why the Laplace method solves ODEs with given initial states directly — no homogeneous/particular bookkeeping. The final-value theorem is valid only if all poles of $sX(s)$ lie strictly in the left half-plane (i.e., the limit exists).</p>` },
    { h: 'Transfer functions and LTI systems', html: String.raw`<p>An LTI system with impulse response $h(t)$ obeys $y(t)=x(t)*h(t)$. Transforming: $Y(s)=H(s)X(s)$, where $H(s)=Y(s)/X(s)$ is the <strong>transfer function</strong> — the Laplace transform of the impulse response. For a system described by a differential equation</p>
<p>$$a_n y^{(n)}+\cdots+a_0 y=b_m x^{(m)}+\cdots+b_0 x,$$</p>
<p>transforming (zero initial conditions) gives $H(s)=\dfrac{b_m s^m+\cdots+b_0}{a_n s^n+\cdots+a_0}$. Cascaded systems multiply ($H_1H_2$); feedback with loop gain $G(s)$ and feedback $F(s)$ gives the classic $\dfrac{G}{1+GF}$. The step response is $\mathcal{L}^{-1}\{H(s)/s\}$.</p>` },
    { h: 'Stability from pole locations', html: String.raw`<p>A causal LTI system is <strong>BIBO stable</strong> (bounded input $\Rightarrow$ bounded output) if and only if <em>all poles of $H(s)$ lie strictly in the left half of the $s$-plane</em> ($\mathrm{Re}(p_k)<0$), equivalently the ROC includes the $j\omega$-axis.</p>
<div class="callout"><strong>Stability rule (continuous time):</strong>
<ul>
<li>All poles in LHP ($\sigma<0$) $\Rightarrow$ stable, impulse response decays.</li>
<li>Any pole in RHP ($\sigma>0$) $\Rightarrow$ unstable, response grows without bound.</li>
<li>Simple poles exactly on $j\omega$-axis $\Rightarrow$ marginally stable (sustained oscillation, e.g. an ideal oscillator); repeated $j\omega$ poles $\Rightarrow$ unstable.</li>
</ul></div>
<p>The Routh–Hurwitz criterion checks LHP-only poles without factoring the denominator — useful for symbolic gain design.</p>` },
    { h: 'Relation to the Fourier Transform', html: String.raw`<p>Set $\sigma=0$, i.e. evaluate $X(s)$ on the imaginary axis $s=j\omega$: then $X(s)|_{s=j\omega}=\int x(t)e^{-j\omega t}dt=X(\omega)$, the Fourier Transform. So <strong>the Fourier Transform is the Laplace Transform restricted to the $j\omega$-axis</strong> — provided that axis lies in the ROC (i.e., the system is stable). This is why you get the frequency response $H(j\omega)$ by substituting $s\to j\omega$ into $H(s)$, and why an unstable system has no ordinary Fourier transform.</p>` },
    { h: 'Solving ODEs with Laplace', html: String.raw`<p>The recipe: (1) Laplace-transform the ODE, substituting the derivative rule with initial conditions; (2) solve the resulting <em>algebraic</em> equation for $Y(s)$; (3) perform partial-fraction expansion; (4) inverse-transform term by term using a table. Initial conditions enter automatically in step 1, so the transient (natural) and forced responses fall out together.</p>` },
    { h: 'Common transform pairs', html: String.raw`<table class="data">
<tr><th>$x(t)$ (for $t\ge0$)</th><th>$X(s)$</th><th>ROC</th></tr>
<tr><td>$\delta(t)$</td><td>$1$</td><td>all $s$</td></tr>
<tr><td>$u(t)$</td><td>$1/s$</td><td>$\mathrm{Re}(s)>0$</td></tr>
<tr><td>$e^{-at}u(t)$</td><td>$\frac{1}{s+a}$</td><td>$\mathrm{Re}(s)>-a$</td></tr>
<tr><td>$t\,u(t)$</td><td>$1/s^2$</td><td>$\mathrm{Re}(s)>0$</td></tr>
<tr><td>$\cos(\omega_0 t)u(t)$</td><td>$\frac{s}{s^2+\omega_0^2}$</td><td>$\mathrm{Re}(s)>0$</td></tr>
<tr><td>$\sin(\omega_0 t)u(t)$</td><td>$\frac{\omega_0}{s^2+\omega_0^2}$</td><td>$\mathrm{Re}(s)>0$</td></tr>
<tr><td>$e^{-at}\cos(\omega_0 t)u(t)$</td><td>$\frac{s+a}{(s+a)^2+\omega_0^2}$</td><td>$\mathrm{Re}(s)>-a$</td></tr>
</table>` },
    { h: 'What you should now understand', html: String.raw`<ul>
<li><strong>Complex frequency:</strong> $s=\sigma+j\omega$ adds a real "decay/growth" axis to Fourier's frequency axis, so Laplace handles signals Fourier cannot.</li>
<li><strong>The ROC matters:</strong> the same algebraic $X(s)$ describes different time signals depending on its region of convergence — always state it.</li>
<li><strong>Poles are the system's personality:</strong> real part = decay rate, imaginary part = oscillation frequency; conjugate pairs give ringing.</li>
<li><strong>Stability is geometry:</strong> a causal system is BIBO stable iff every pole lies strictly in the left half-plane (equivalently, the ROC includes the $j\omega$-axis).</li>
<li><strong>Systems become algebra:</strong> $H(s)=Y/X=\mathcal{L}\{h\}$, cascades multiply, feedback gives $G/(1+GF)$, and the derivative rule injects initial conditions to solve ODEs directly.</li>
<li><strong>Fourier is a slice:</strong> evaluating $H(s)$ on $s=j\omega$ recovers the frequency response — valid only when the system is stable.</li>
</ul>` }
  ],
  keyPoints: [
    String.raw`$X(s)=\int_{0^-}^\infty x(t)e^{-st}dt$ with $s=\sigma+j\omega$; the ROC is part of the answer.`,
    String.raw`Poles ($\times$) are denominator roots; zeros ($\circ$) are numerator roots.`,
    String.raw`Pole real part = decay rate; imaginary part = oscillation frequency.`,
    String.raw`Transfer function $H(s)=Y(s)/X(s)=\mathcal{L}\{h(t)\}$; convolution becomes multiplication.`,
    String.raw`BIBO stable $\iff$ all poles strictly in the left half-plane.`,
    String.raw`Poles on the $j\omega$-axis (simple) = marginal (oscillator); RHP = unstable.`,
    String.raw`Fourier Transform = Laplace on $s=j\omega$, valid only if that axis is in the ROC.`,
    String.raw`Differentiation rule $sX(s)-x(0^-)$ injects initial conditions — solves ODEs directly.`,
    String.raw`Final-value theorem $x(\infty)=\lim_{s\to0}sX(s)$ valid only if the limit exists (stable poles).`,
    String.raw`Cascade $\Rightarrow$ multiply $H$; feedback $\Rightarrow$ $G/(1+GF)$.`,
    String.raw`Right-sided signal $\Rightarrow$ ROC is a right half-plane past the rightmost pole.`,
    String.raw`Routh–Hurwitz tests LHP-only poles without factoring the denominator.`
  ],
  equations: [
    { title: String.raw`Definition`, tex: String.raw`$$X(s)=\int_{0^-}^{\infty}x(t)e^{-st}\,dt$$`, derivation: String.raw`<p>Take the Fourier Transform of a damped version of $x$: multiply by $e^{-\sigma t}$ to force convergence, $\int [x(t)e^{-\sigma t}]e^{-j\omega t}dt=\int x(t)e^{-(\sigma+j\omega)t}dt$. Define $s=\sigma+j\omega$ and the integral becomes $X(s)$. The Laplace transform is thus the Fourier transform of an exponentially weighted signal, which is why it converges for a wider class of functions.</p>` },
    { title: String.raw`Transform of $e^{-at}u(t)$`, tex: String.raw`$$e^{-at}u(t)\;\leftrightarrow\;\frac{1}{s+a},\;\;\mathrm{Re}(s)>-a$$`, derivation: String.raw`<p>$X(s)=\int_0^\infty e^{-at}e^{-st}dt=\int_0^\infty e^{-(s+a)t}dt=\left[\frac{e^{-(s+a)t}}{-(s+a)}\right]_0^\infty$. For convergence the exponent must decay: $\mathrm{Re}(s+a)>0\Rightarrow\mathrm{Re}(s)>-a$. Then the upper limit vanishes and $X(s)=\frac{1}{s+a}$. Pole at $s=-a$.</p>` },
    { title: String.raw`Differentiation with initial condition`, tex: String.raw`$$\mathcal{L}\{x'(t)\}=sX(s)-x(0^-)$$`, derivation: String.raw`<p>$\int_{0^-}^\infty x'(t)e^{-st}dt$. Integrate by parts with $u=e^{-st}$, $dv=x'dt$: $=[x(t)e^{-st}]_{0^-}^\infty+s\int x(t)e^{-st}dt$. The boundary term at $\infty$ is $0$ (within ROC) and at $0^-$ gives $-x(0^-)$. Hence $=sX(s)-x(0^-)$. This is the mechanism by which initial conditions enter ODE solutions.</p>` },
    { title: String.raw`Convolution property`, tex: String.raw`$$y=x*h\;\Rightarrow\;Y(s)=X(s)H(s)$$`, derivation: String.raw`<p>$Y(s)=\int e^{-st}\!\int x(\tau)h(t-\tau)d\tau\,dt$. Swap order and substitute $t'=t-\tau$: $=\int x(\tau)\!\int h(t')e^{-s(t'+\tau)}dt'\,d\tau=\int x(\tau)e^{-s\tau}d\tau\cdot\int h(t')e^{-st'}dt'=X(s)H(s)$. Convolution becomes multiplication, defining the transfer function.</p>` },
    { title: String.raw`Second-order system standard form`, tex: String.raw`$$H(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}$$`, derivation: String.raw`<p>Poles: $s=-\zeta\omega_n\pm\omega_n\sqrt{\zeta^2-1}$. For $0<\zeta<1$ they are complex conjugates $-\zeta\omega_n\pm j\omega_n\sqrt{1-\zeta^2}$ (underdamped): real part $-\zeta\omega_n$ sets decay, imaginary part is the damped frequency $\omega_d$. $\zeta=0$ puts poles on the $j\omega$-axis (pure oscillation); $\zeta\ge1$ gives real poles (over/critically damped). This maps damping ratio directly to pole geometry.</p>` },
    { title: String.raw`Final-value theorem`, tex: String.raw`$$\lim_{t\to\infty}x(t)=\lim_{s\to0}sX(s)$$`, derivation: String.raw`<p>From $\mathcal{L}\{x'\}=sX(s)-x(0^-)$, take $\lim_{s\to0}$: LHS $=\int_0^\infty x'(t)dt=x(\infty)-x(0^-)$. So $x(\infty)-x(0^-)=\lim_{s\to0}sX(s)-x(0^-)$, giving $x(\infty)=\lim_{s\to0}sX(s)$. Valid only when $x(\infty)$ actually exists, i.e. $sX(s)$ has no poles in the RHP or on the axis (except a single one at origin).</p>` },
    { title: String.raw`Fourier as a slice of Laplace`, tex: String.raw`$$X(j\omega)=X(s)\big|_{s=j\omega}$$`, derivation: String.raw`<p>Setting $\sigma=0$ in $s=\sigma+j\omega$ makes the exponential weighting $e^{-\sigma t}=1$, so $X(s)|_{s=j\omega}=\int x(t)e^{-j\omega t}dt$, which is the Fourier transform. This substitution is legitimate only if the $j\omega$-axis is inside the ROC — i.e. the system is stable.</p>` },
    { title: String.raw`Transform of $\cos(\omega_0 t)u(t)$`, tex: String.raw`$$\cos(\omega_0 t)u(t)\leftrightarrow\frac{s}{s^2+\omega_0^2}$$`, derivation: String.raw`<p>Write $\cos\omega_0 t=\tfrac12(e^{j\omega_0 t}+e^{-j\omega_0 t})$. Each term transforms as $\frac{1}{s\mp j\omega_0}$. Sum: $\tfrac12\left(\frac{1}{s-j\omega_0}+\frac{1}{s+j\omega_0}\right)=\tfrac12\cdot\frac{2s}{s^2+\omega_0^2}=\frac{s}{s^2+\omega_0^2}$. Poles on the $j\omega$-axis at $\pm j\omega_0$ — marginally stable, as expected for an undamped oscillation.</p>` }
  ],
  flashcards: [
    { front: String.raw`Define the (unilateral) Laplace Transform.`, back: String.raw`$X(s)=\int_{0^-}^\infty x(t)e^{-st}dt$, $s=\sigma+j\omega$.` },
    { front: String.raw`What is the ROC and why does it matter?`, back: String.raw`The set of $s$ for which the integral converges. Different ROCs with the same $X(s)$ give different time signals, so it must be stated.` },
    { front: String.raw`Condition for BIBO stability in $s$?`, back: String.raw`All poles strictly in the left half-plane; equivalently the ROC includes the $j\omega$-axis.` },
    { front: String.raw`What does the real part of a pole control?`, back: String.raw`Decay rate ($e^{\sigma t}$): negative = decays, positive = grows.` },
    { front: String.raw`What does the imaginary part of a pole control?`, back: String.raw`Oscillation frequency of the response.` },
    { front: String.raw`Relation between Laplace and Fourier?`, back: String.raw`Fourier = Laplace evaluated on $s=j\omega$, valid if that axis is in the ROC.` },
    { front: String.raw`Define the transfer function.`, back: String.raw`$H(s)=Y(s)/X(s)=\mathcal{L}\{h(t)\}$; poles/zeros describe the system.` },
    { front: String.raw`Laplace of a derivative?`, back: String.raw`$sX(s)-x(0^-)$; the initial condition appears explicitly.` },
    { front: String.raw`State the final-value theorem and its caveat.`, back: String.raw`$x(\infty)=\lim_{s\to0}sX(s)$, valid only if $sX(s)$ has all poles in the LHP.` },
    { front: String.raw`Poles of the standard 2nd-order system for $0<\zeta<1$?`, back: String.raw`$-\zeta\omega_n\pm j\omega_n\sqrt{1-\zeta^2}$ (complex conjugate, underdamped).` },
    { front: String.raw`Marginally stable pole location?`, back: String.raw`Simple poles exactly on the $j\omega$-axis (sustained oscillation).` },
    { front: String.raw`How do cascaded systems combine in $s$?`, back: String.raw`Their transfer functions multiply: $H(s)=H_1(s)H_2(s)$.` },
    { front: String.raw`Closed-loop transfer function with forward $G$, feedback $F$?`, back: String.raw`$\dfrac{G}{1+GF}$.` },
    { front: String.raw`Laplace of $u(t)$?`, back: String.raw`$1/s$, ROC $\mathrm{Re}(s)>0$.` }
  ],
  mcqs: [
    { q: String.raw`A causal LTI system is BIBO stable if and only if all poles of $H(s)$ lie:`, options: [String.raw`On the $j\omega$-axis`, String.raw`In the right half-plane`, String.raw`In the left half-plane`, String.raw`At the origin`], answer: 2, explain: String.raw`Left-half-plane poles give a decaying impulse response.` },
    { q: String.raw`The Fourier Transform is the Laplace Transform evaluated at:`, options: [String.raw`$s=0$`, String.raw`$s=j\omega$`, String.raw`$s=\sigma$`, String.raw`$s=\infty$`], answer: 1, explain: String.raw`Setting $\sigma=0$ (the $j\omega$-axis) recovers the FT, if in the ROC.` },
    { q: String.raw`Poles of $H(s)$ are the values of $s$ where:`, options: [String.raw`$H(s)=0$`, String.raw`$H(s)\to\infty$`, String.raw`$H(s)=1$`, String.raw`the phase is zero`], answer: 1, explain: String.raw`Poles are denominator roots where $H$ blows up; zeros are where $H=0$.` },
    { q: String.raw`The real part of a pole determines:`, options: [String.raw`Oscillation frequency`, String.raw`Decay/growth rate`, String.raw`DC gain`, String.raw`Phase`], answer: 1, explain: String.raw`$\mathrm{Re}(p)=\sigma$ gives the $e^{\sigma t}$ envelope.` },
    { q: String.raw`For $x(t)=e^{-3t}u(t)$, the ROC is:`, options: [String.raw`$\mathrm{Re}(s)>3$`, String.raw`$\mathrm{Re}(s)>-3$`, String.raw`$\mathrm{Re}(s)<-3$`, String.raw`all $s$`], answer: 1, explain: String.raw`Right-sided signal: ROC is right of the pole at $s=-3$.` },
    { q: String.raw`The Laplace differentiation property $\mathcal{L}\{x'\}$ equals:`, options: [String.raw`$sX(s)$`, String.raw`$sX(s)-x(0^-)$`, String.raw`$X(s)/s$`, String.raw`$X(s)-x(0)$`], answer: 1, explain: String.raw`Initial condition $x(0^-)$ appears, enabling ODE solutions.` },
    { q: String.raw`Simple poles exactly on the $j\omega$-axis correspond to:`, options: [String.raw`Stable, decaying response`, String.raw`Marginal stability (sustained oscillation)`, String.raw`Unbounded growth`, String.raw`No response`], answer: 1, explain: String.raw`e.g. $\pm j\omega_0$ gives a constant-amplitude sinusoid.` },
    { q: String.raw`Cascading two LTI blocks means their transfer functions:`, options: [String.raw`Add`, String.raw`Multiply`, String.raw`Convolve`, String.raw`Subtract`], answer: 1, explain: String.raw`$Y=H_2H_1X$, so overall $H=H_1H_2$.` },
    { q: String.raw`The final-value theorem is valid only when:`, options: [String.raw`$X(s)$ is rational`, String.raw`$sX(s)$ has all poles in the LHP (limit exists)`, String.raw`The system is causal`, String.raw`There are no zeros`], answer: 1, explain: String.raw`Otherwise $x(\infty)$ does not exist and the theorem gives a wrong number.` },
    { q: String.raw`For the standard second-order system, decreasing $\zeta$ toward 0 moves the poles:`, options: [String.raw`Deeper into the LHP`, String.raw`Toward the $j\omega$-axis`, String.raw`Into the RHP`, String.raw`To the origin`], answer: 1, explain: String.raw`Less damping $\Rightarrow$ poles approach the axis $\Rightarrow$ more ringing.` },
    { q: String.raw`The transfer function $H(s)$ is the Laplace transform of:`, options: [String.raw`The step response`, String.raw`The impulse response $h(t)$`, String.raw`The input`, String.raw`The output`], answer: 1, explain: String.raw`$H(s)=\mathcal{L}\{h(t)\}$ since $Y=HX$ and impulse has $X=1$.` },
    { q: String.raw`A pole in the right half-plane implies the system is:`, options: [String.raw`Stable`, String.raw`Marginally stable`, String.raw`Unstable`, String.raw`Lossless`], answer: 2, explain: String.raw`$\mathrm{Re}(p)>0$ gives a growing $e^{\sigma t}$ term.` }
  ],
  numericals: [
    { q: String.raw`Find $H(s)$ for the RC low-pass circuit governed by $RC\,y'(t)+y(t)=x(t)$, and give its pole and $-3\text{ dB}$ frequency for $R=1\text{ k}\Omega$, $C=1\,\mu\text{F}$.`, solution: String.raw`<p><b>Formula.</b> $$H(s)=\frac{1}{RCs+1}=\frac{1/RC}{s+1/RC},\qquad f_c=\frac{1}{2\pi RC}$$ where $R$ is resistance, $C$ capacitance, $RC$ the time constant, and $f_c$ the $-3\text{ dB}$ cutoff. The pole sits at $s=-1/RC$.</p>
<p><b>Substitute.</b> $RC=(10^3\,\Omega)(10^{-6}\text{ F})=10^{-3}\text{ s}$, so $$s_{\text{pole}}=-\frac{1}{10^{-3}},\qquad f_c=\frac{1}{2\pi\cdot 10^{-3}}.$$</p>
<p><b>Compute.</b> Pole at $s=-1000\text{ s}^{-1}$; $\omega_c=1/RC=1000\text{ rad/s}$, hence $f_c=1000/2\pi\approx159\text{ Hz}$. The pole is in the LHP, so the circuit is stable.</p>
<p><b>Explanation.</b> A single real LHP pole gives a stable first-order low-pass whose bandwidth is set by $1/RC$. Larger $R$ or $C$ slows the circuit (lower $f_c$), matching the intuition of a bigger time constant.</p>` },
    { q: String.raw`Solve $y'+3y=0$, $y(0)=2$ using Laplace.`, solution: String.raw`<p><b>Formula.</b> $$\mathcal{L}\{y'\}=sY(s)-y(0)$$ where $Y(s)$ is the transform of $y(t)$ and $y(0)$ is the initial condition, which the Laplace derivative rule injects automatically.</p>
<p><b>Substitute.</b> Transform the ODE: $$sY-y(0)+3Y=0\;\Rightarrow\;(s+3)Y=2\;\Rightarrow\;Y(s)=\frac{2}{s+3}.$$</p>
<p><b>Compute.</b> Inverse-transform: $y(t)=2e^{-3t}u(t)$. The single pole at $s=-3$ (LHP) gives a decaying exponential.</p>
<p><b>Explanation.</b> The solution starts at $y(0)=2$ and decays with time constant $1/3\text{ s}$, consistent with the LHP pole. Laplace folds the initial condition straight into the algebra — no separate homogeneous/particular split needed.</p>` },
    { q: String.raw`A system has $H(s)=\frac{10}{s^2+2s+10}$. Find $\omega_n$, $\zeta$, and state stability.`, solution: String.raw`<p><b>Formula.</b> $$H(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}$$ where $\omega_n$ is the natural frequency (from the constant term) and $\zeta$ the damping ratio (from the $s$ coefficient $2\zeta\omega_n$).</p>
<p><b>Substitute.</b> Match coefficients: $$\omega_n^2=10,\qquad 2\zeta\omega_n=2.$$</p>
<p><b>Compute.</b> $\omega_n=\sqrt{10}\approx3.16\text{ rad/s}$; $\zeta=1/\omega_n\approx0.316$ (underdamped). Poles $s=-\zeta\omega_n\pm j\omega_n\sqrt{1-\zeta^2}=-1\pm j3$ — both in the LHP, so <strong>stable</strong>, ringing at $\omega_d=3\text{ rad/s}$.</p>
<p><b>Explanation.</b> With $0<\zeta<1$ the response is underdamped: it overshoots and rings before settling. The real part $-1$ sets the decay envelope and the imaginary part $\pm3$ the oscillation, so stability and ring frequency are read straight off the poles.</p>` },
    { q: String.raw`Use the final-value theorem to find the steady-state step response of $H(s)=\frac{5}{s+5}$.`, solution: String.raw`<p><b>Formula.</b> $$y(\infty)=\lim_{s\to0}sY(s),\qquad Y(s)=H(s)X(s)$$ where $Y(s)$ is the output transform and $X(s)=1/s$ is the unit-step input. The theorem is valid only if $sY(s)$ has all poles in the LHP.</p>
<p><b>Substitute.</b> $$Y(s)=\frac{5}{s+5}\cdot\frac{1}{s}=\frac{5}{s(s+5)};\qquad y(\infty)=\lim_{s\to0}\frac{5}{s+5}.$$</p>
<p><b>Compute.</b> $y(\infty)=5/5=1$. This matches the DC gain $H(0)=5/5=1$. (The pole of $sY(s)$ at $s=-5$ is in the LHP, so the theorem applies.)</p>
<p><b>Explanation.</b> The steady-state step response equals the DC gain because at $t\to\infty$ only the $s=0$ (DC) behaviour survives. The final-value theorem is a shortcut that skips the full inverse transform.</p>` },
    { q: String.raw`Find the inverse Laplace of $X(s)=\frac{s+3}{(s+1)(s+2)}$.`, solution: String.raw`<p><b>Formula.</b> $$X(s)=\frac{A}{s+1}+\frac{B}{s+2},\qquad \frac{1}{s+a}\;\leftrightarrow\;e^{-at}u(t)$$ where $A,B$ are the partial-fraction residues found by the cover-up method (evaluate the remaining factor at the pole).</p>
<p><b>Substitute.</b> $$A=\left.\frac{s+3}{s+2}\right|_{s=-1}=\frac{2}{1},\qquad B=\left.\frac{s+3}{s+1}\right|_{s=-2}=\frac{1}{-1}.$$</p>
<p><b>Compute.</b> $A=2$, $B=-1$, so $X(s)=\frac{2}{s+1}-\frac{1}{s+2}$ and $x(t)=(2e^{-t}-e^{-2t})u(t)$.</p>
<p><b>Explanation.</b> Each pole contributes one decaying mode; the residue sets its weight. The faster $e^{-2t}$ term ($p=-2$) dies out first, leaving the slower $2e^{-t}$ to dominate the tail.</p>` },
    { q: String.raw`Determine stability of $H(s)=\frac{1}{s^2-s+2}$.`, solution: String.raw`<p><b>Formula.</b> $$s=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$$ for denominator $as^2+bs+c$; stability requires every pole to have $\mathrm{Re}(s)<0$ (all in the LHP). Here $a=1,\,b=-1,\,c=2$.</p>
<p><b>Substitute.</b> $$s=\frac{1\pm\sqrt{1-8}}{2}=\frac{1\pm\sqrt{-7}}{2}.$$</p>
<p><b>Compute.</b> $s=\tfrac12\pm j\tfrac{\sqrt7}{2}$; the real part is $+\tfrac12>0$, placing both poles in the RHP $\Rightarrow$ <strong>unstable</strong>.</p>
<p><b>Explanation.</b> The negative $s$ coefficient is the tell-tale: for a real 2nd-order system, any missing or sign-flipped denominator coefficient forces an RHP pole, so the impulse response grows without bound.</p>` }
  ],
  realWorld: String.raw`<p>The Laplace Transform is the language of control systems and analog circuit design. PID controllers, op-amp filters, motor servo loops, phase-locked loops, and power-supply feedback compensators are all designed in the $s$-plane, where the engineer places poles and zeros to hit a target bandwidth, overshoot, and phase margin. SPICE simulators compute $H(s)$ internally; root-locus and Bode tools visualize how pole positions move as a gain is tuned. See <a href="#pll">PLL</a>.</p>`,
  related: ['fourier-transform', 'z-transform', 'convolution', 'pll']
},
{
  id: 'z-transform',
  title: 'Z-Transform',
  category: 'Signals & Systems',
  tags: ['z-transform', 'z-plane', 'unit-circle', 'digital-filters', 'dtft', 'difference-equation'],
  summary: String.raw`The Z-Transform is the discrete-time counterpart of the Laplace Transform, mapping sample sequences to a complex variable $z$ for the design and stability analysis of digital filters.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-z-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="50" width="90" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="57" y="67" fill="#e6edf3" text-anchor="middle">X(z)</text>
<text x="57" y="83" fill="#9aa7b5" text-anchor="middle">x[n] input</text>
<rect x="160" y="40" width="210" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="265" y="62" fill="#e6edf3" text-anchor="middle">digital filter H(z)</text>
<text x="265" y="85" fill="#9aa7b5" text-anchor="middle">z&#8315;&#185; delays, poles/zeros in z-plane</text>
<rect x="428" y="50" width="100" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="478" y="67" fill="#e6edf3" text-anchor="middle">Y(z)=H(z)X(z)</text>
<text x="478" y="83" fill="#9aa7b5" text-anchor="middle">y[n] output</text>
<line x1="102" y1="70" x2="158" y2="70" stroke="#9aa7b5" marker-end="url(#arr-z-transform)"/>
<line x1="370" y1="70" x2="426" y2="70" stroke="#9aa7b5" marker-end="url(#arr-z-transform)"/>
<text x="265" y="135" fill="#b197fc" text-anchor="middle">stable &#8660; all poles inside the unit circle (|z| &lt; 1)</text>
</svg>`,
    caption: String.raw`A difference equation becomes H(z); poles inside the unit circle (|z| < 1) mean the digital filter is stable.`
  },
  {
    title: String.raw`Direct-form II structure`,
    svg: String.raw`<svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-z-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="90" width="70" height="34" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="47" y="111" fill="#e6edf3" text-anchor="middle">x[n]</text>
<circle cx="150" cy="107" r="16" fill="#1c232e" stroke="#63e6be"/>
<text x="150" y="112" fill="#e6edf3" text-anchor="middle">+</text>
<rect x="210" y="30" width="60" height="34" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="240" y="51" fill="#e6edf3" text-anchor="middle">z&#8315;&#185;</text>
<rect x="210" y="150" width="60" height="34" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="240" y="171" fill="#e6edf3" text-anchor="middle">z&#8315;&#185;</text>
<circle cx="330" cy="107" r="16" fill="#1c232e" stroke="#63e6be"/>
<text x="330" y="112" fill="#e6edf3" text-anchor="middle">+</text>
<rect x="388" y="90" width="60" height="34" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="418" y="111" fill="#e6edf3" text-anchor="middle">y[n]</text>
<line x1="82" y1="107" x2="132" y2="107" stroke="#9aa7b5" marker-end="url(#arr2-z-transform)"/>
<line x1="166" y1="107" x2="314" y2="107" stroke="#9aa7b5" marker-end="url(#arr2-z-transform)"/>
<line x1="346" y1="107" x2="386" y2="107" stroke="#9aa7b5" marker-end="url(#arr2-z-transform)"/>
<line x1="240" y1="64" x2="240" y2="99" stroke="#b197fc" marker-end="url(#arr2-z-transform)"/>
<line x1="240" y1="99" x2="164" y2="99" stroke="#b197fc"/>
<line x1="240" y1="150" x2="240" y2="120" stroke="#b197fc"/>
<text x="150" y="150" fill="#9aa7b5" text-anchor="middle">feedback a&#8342;</text>
<text x="330" y="55" fill="#9aa7b5" text-anchor="middle">feedforward b&#8344;</text>
</svg>`,
    caption: String.raw`Direct-form realisation of H(z): unit-delay (z&#8315;&#185;) blocks feed the shared delay line, with feedback taps a&#8342; and feedforward taps b&#8344; summed into the output.`
  },
  {
    title: String.raw`s-plane &#8594; z-plane map`,
    svg: String.raw`<svg viewBox="0 0 500 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-z-transform" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="20" width="180" height="170" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="102" y="16" fill="#9aa7b5" text-anchor="middle">s-plane</text>
<line x1="102" y1="30" x2="102" y2="180" stroke="#4dabf7"/>
<text x="102" y="200" fill="#4dabf7" text-anchor="middle">LHP | RHP</text>
<text x="60" y="110" fill="#63e6be" text-anchor="middle">Re s&lt;0</text>
<text x="150" y="110" fill="#ffa94d" text-anchor="middle">Re s&gt;0</text>
<rect x="308" y="20" width="180" height="170" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="398" y="16" fill="#9aa7b5" text-anchor="middle">z-plane</text>
<circle cx="398" cy="105" r="55" fill="none" stroke="#4dabf7"/>
<text x="398" y="108" fill="#63e6be" text-anchor="middle">|z|&lt;1</text>
<text x="398" y="200" fill="#4dabf7" text-anchor="middle">unit circle |z|=1</text>
<line x1="192" y1="105" x2="306" y2="105" stroke="#9aa7b5" marker-end="url(#arr3-z-transform)"/>
<text x="249" y="98" fill="#b197fc" text-anchor="middle">z=e^(sT)</text>
</svg>`,
    caption: String.raw`Under z=e^(sT) the Laplace left half-plane maps inside the unit circle and the j&#969;-axis maps onto |z|=1 — so LHP stability becomes inside-the-circle stability.`
  }
  ],
  prerequisites: ['laplace-transform', 'fourier-transform', 'nyquist-sampling'],
  intro: String.raw`<p><em>Why it exists:</em> once a signal lives inside a computer as a stream of samples, it obeys difference equations, not differential equations, and Laplace no longer fits. We still need to ask the same questions — is this digital filter stable, what is its frequency response, how do I design it? The Z-Transform is the tool built for sampled data: it turns a recursion into algebra and moves the stability question onto a circle you can draw.</p>
<p>The Z-Transform does for discrete-time (sampled) systems what Laplace does for continuous ones. It turns a sequence $x[n]$ into a function $X(z)$ of a complex variable $z$, converting linear difference equations into algebra and representing any digital filter by a rational transfer function $H(z)$ with poles and zeros in the <strong>z-plane</strong>.</p>
<p>The pivotal geometry is the <strong>unit circle</strong> $|z|=1$: it plays the role the $j\omega$-axis played in Laplace. Poles inside it mean a stable filter; the DTFT lives on it; and the whole discrete frequency axis wraps around it once per sample rate.</p>`,
  sections: [
    { h: 'Definition and ROC', html: String.raw`<div class="callout tip"><strong>Intuition:</strong> read $z^{-1}$ as "delay by one sample." The Z-Transform just tags every sample with how many delays deep it is ($x[0]$ gets $z^0$, $x[1]$ gets $z^{-1}$, and so on) and adds them up. That single bookkeeping trick converts a filter's feedback recursion into ordinary algebra in $z$.</div>
<p>The bilateral Z-Transform of a sequence $x[n]$ is</p>
<p>$$X(z)=\sum_{n=-\infty}^{\infty}x[n]\,z^{-n},\qquad z=re^{j\omega}\in\mathbb{C}.$$</p>
<p>As with Laplace, it converges only for certain $|z|$ — the <strong>Region of Convergence</strong>, always an annulus (ring) centred on the origin, bounded by poles. A <em>right-sided (causal)</em> sequence has an ROC <em>outside</em> the outermost pole ($|z|>r_\max$); a left-sided one, inside the innermost pole; a two-sided one, a ring between poles. The ROC never contains a pole and, as before, is essential to invert $X(z)$ uniquely.</p>` },
    { h: 'The z-plane and the unit circle', html: String.raw`<p>Poles and zeros are plotted in the complex $z$-plane. The <strong>unit circle</strong> $|z|=1$ is the discrete analogue of the Laplace $j\omega$-axis. Mapping $z=e^{sT_s}$ links the two planes:</p>
<ul>
<li>The Laplace left half-plane ($\sigma<0$) maps to the <strong>inside</strong> of the unit circle ($|z|<1$).</li>
<li>The $j\omega$-axis maps to the unit circle itself.</li>
<li>The right half-plane maps <strong>outside</strong> the unit circle.</li>
</ul>
<p>Angle around the circle is discrete frequency $\omega=2\pi f/f_s$ (radians/sample): $z=1$ ($\omega=0$) is DC, $z=-1$ ($\omega=\pi$) is Nyquist ($f_s/2$), $z=\pm j$ is $f_s/4$. Because the frequency axis is a circle, digital spectra are inherently <strong>periodic</strong> with period $f_s$ — the analytic root of aliasing.</p>` },
    { h: 'Stability from pole locations', html: String.raw`<div class="callout"><strong>Stability rule (discrete time):</strong> a causal LTI digital system is BIBO stable if and only if <em>all poles of $H(z)$ lie strictly inside the unit circle</em> ($|p_k|<1$), equivalently the ROC includes the unit circle.
<ul>
<li>Poles inside $\Rightarrow$ impulse response decays $\Rightarrow$ stable.</li>
<li>Poles on the unit circle (simple) $\Rightarrow$ marginal (e.g. a digital oscillator/resonator).</li>
<li>Any pole outside $\Rightarrow$ unstable, response grows.</li>
</ul></div>
<p>Contrast with continuous time: the boundary is a <em>circle</em> (radius 1), not a vertical axis. FIR filters have all their poles at the origin, so they are always stable — a key reason FIR designs are favoured when guaranteed stability and linear phase matter.</p>` },
    { h: 'Relation to the DTFT', html: String.raw`<p>Evaluating $X(z)$ on the unit circle ($z=e^{j\omega}$) gives the <strong>Discrete-Time Fourier Transform</strong>:</p>
<p>$$X(e^{j\omega})=\sum_n x[n]e^{-j\omega n}=X(z)\big|_{z=e^{j\omega}}.$$</p>
<p>So the DTFT is the Z-Transform on the unit circle — exactly parallel to "Fourier is Laplace on the $j\omega$-axis." This substitution is valid only if the unit circle is in the ROC (a stable system). The filter's <strong>frequency response</strong> $H(e^{j\omega})$ comes from putting $z=e^{j\omega}$ into $H(z)$; magnitude and phase are read directly from pole/zero distances to the point on the circle.</p>` },
    { h: 'Key properties', html: String.raw`<table class="data">
<tr><th>Property</th><th>Sequence</th><th>$z$-domain</th></tr>
<tr><td>Linearity</td><td>$ax[n]+by[n]$</td><td>$aX(z)+bY(z)$</td></tr>
<tr><td>Time shift (delay)</td><td>$x[n-k]$</td><td>$z^{-k}X(z)$</td></tr>
<tr><td>Scaling in $z$</td><td>$a^n x[n]$</td><td>$X(z/a)$</td></tr>
<tr><td>Convolution</td><td>$x[n]*h[n]$</td><td>$X(z)H(z)$</td></tr>
<tr><td>Differencing</td><td>$x[n]-x[n-1]$</td><td>$(1-z^{-1})X(z)$</td></tr>
<tr><td>Accumulation</td><td>$\sum_{k\le n}x[k]$</td><td>$\frac{1}{1-z^{-1}}X(z)$</td></tr>
<tr><td>Initial value</td><td>$x[0]$</td><td>$\lim_{z\to\infty}X(z)$</td></tr>
</table>
<p>The single most-used rule is the <strong>unit delay</strong> $x[n-1]\leftrightarrow z^{-1}X(z)$: $z^{-1}$ literally means "delay by one sample," which is why filter block diagrams label their memory elements $z^{-1}$.</p>` },
    { h: 'Difference equations and digital filters', html: String.raw`<p>A causal LTI digital filter obeys a linear constant-coefficient difference equation</p>
<p>$$\sum_{k=0}^{N}a_k\,y[n-k]=\sum_{m=0}^{M}b_m\,x[n-m].$$</p>
<p>Transforming with the delay rule (each $y[n-k]\to z^{-k}Y(z)$) and solving:</p>
<p>$$H(z)=\frac{Y(z)}{X(z)}=\frac{\sum_{m=0}^{M}b_m z^{-m}}{\sum_{k=0}^{N}a_k z^{-k}}=\frac{b_0+b_1z^{-1}+\cdots}{a_0+a_1z^{-1}+\cdots}.$$</p>
<ul>
<li><strong>FIR</strong> (finite impulse response): denominator is just $a_0$ (no feedback); $H(z)$ is a polynomial in $z^{-1}$; all poles at origin; always stable; can be exactly linear phase.</li>
<li><strong>IIR</strong> (infinite impulse response): has feedback ($N>0$), poles away from origin; cheaper for sharp responses but stability must be checked and phase is generally nonlinear.</li>
</ul>` },
    { h: 'Inversion methods', html: String.raw`<p>To recover $x[n]$ from $X(z)$: (1) <strong>partial fractions</strong> then table lookup (most common), remembering to respect the ROC when choosing causal vs anti-causal forms; (2) <strong>long division</strong> (power series) to read off $x[n]$ as coefficients of $z^{-n}$ — good for a few initial samples; (3) the formal contour-integral / residue formula $x[n]=\frac{1}{2\pi j}\oint X(z)z^{n-1}dz$.</p>` },
    { h: 'Common transform pairs', html: String.raw`<table class="data">
<tr><th>$x[n]$</th><th>$X(z)$</th><th>ROC</th></tr>
<tr><td>$\delta[n]$</td><td>$1$</td><td>all $z$</td></tr>
<tr><td>$u[n]$</td><td>$\frac{1}{1-z^{-1}}=\frac{z}{z-1}$</td><td>$|z|>1$</td></tr>
<tr><td>$a^n u[n]$</td><td>$\frac{1}{1-az^{-1}}=\frac{z}{z-a}$</td><td>$|z|>|a|$</td></tr>
<tr><td>$-a^n u[-n-1]$</td><td>$\frac{1}{1-az^{-1}}$</td><td>$|z|<|a|$</td></tr>
<tr><td>$n a^n u[n]$</td><td>$\frac{az^{-1}}{(1-az^{-1})^2}$</td><td>$|z|>|a|$</td></tr>
<tr><td>$\cos(\omega_0 n)u[n]$</td><td>$\frac{1-\cos\omega_0\,z^{-1}}{1-2\cos\omega_0\,z^{-1}+z^{-2}}$</td><td>$|z|>1$</td></tr>
</table>
<p>Note rows 2 and 4: the <em>same</em> $X(z)$ gives a causal decaying sequence or an anti-causal one depending solely on the ROC — the clearest illustration of why the ROC is indispensable.</p>` },
    { h: 'What you should now understand', html: String.raw`<ul>
<li><strong>The core idea:</strong> $X(z)=\sum_n x[n]z^{-n}$ maps a sample sequence to a function of $z$, with $z^{-1}$ meaning a one-sample delay — the memory element in every filter diagram.</li>
<li><strong>The unit circle is the boundary:</strong> $|z|=1$ is the discrete analogue of the Laplace $j\omega$-axis, and angle around it is discrete frequency ($z=-1$ is Nyquist).</li>
<li><strong>Stability is inside the circle:</strong> a causal filter is stable iff all poles satisfy $|p|<1$; the map $z=e^{sT}$ sends the LHP inside and the $j\omega$-axis onto the circle.</li>
<li><strong>The DTFT is a slice:</strong> evaluating $X(z)$ on the unit circle gives the frequency response, and because the axis is a circle, digital spectra are periodic in $f_s$.</li>
<li><strong>Filters from difference equations:</strong> the delay rule turns a recursion into $H(z)=\frac{\sum b_m z^{-m}}{\sum a_k z^{-k}}$; FIR (no feedback) is always stable and can be linear phase, IIR (feedback) is efficient but must be checked.</li>
<li><strong>The ROC is part of the answer:</strong> one $X(z)$ can be a causal or anti-causal sequence — the ROC decides which.</li>
</ul>` }
  ],
  keyPoints: [
    String.raw`$X(z)=\sum_n x[n]z^{-n}$; the ROC is an annulus and must be specified.`,
    String.raw`Unit circle $|z|=1$ is the discrete analogue of the Laplace $j\omega$-axis.`,
    String.raw`Stable causal filter $\iff$ all poles strictly inside the unit circle ($|p|<1$).`,
    String.raw`LHP $\to$ inside unit circle; $j\omega$-axis $\to$ unit circle; RHP $\to$ outside (via $z=e^{sT_s}$).`,
    String.raw`DTFT = Z-Transform on the unit circle: $X(e^{j\omega})=X(z)|_{z=e^{j\omega}}$.`,
    String.raw`$z^{-1}$ = one-sample delay — the memory element in filter diagrams.`,
    String.raw`Difference equation $\to$ $H(z)=\frac{\sum b_m z^{-m}}{\sum a_k z^{-k}}$.`,
    String.raw`FIR: no feedback, poles at origin, always stable, can be linear phase.`,
    String.raw`IIR: has feedback, poles off origin, efficient but must check stability.`,
    String.raw`Angle around unit circle = $\omega=2\pi f/f_s$; $z=-1$ is Nyquist $f_s/2$.`,
    String.raw`Same $X(z)$ with different ROC = different (causal vs anti-causal) sequence.`,
    String.raw`Digital spectra are periodic in $f_s$ because the frequency axis is a circle.`
  ],
  equations: [
    { title: String.raw`Definition`, tex: String.raw`$$X(z)=\sum_{n=-\infty}^{\infty}x[n]z^{-n}$$`, derivation: String.raw`<p>Start from the Laplace transform of a sampled signal $x_s(t)=\sum_n x[n]\delta(t-nT_s)$: $X_s(s)=\int\sum_n x[n]\delta(t-nT_s)e^{-st}dt=\sum_n x[n]e^{-snT_s}$. Define $z=e^{sT_s}$; then $e^{-snT_s}=z^{-n}$ and $X(z)=\sum_n x[n]z^{-n}$. The substitution $z=e^{sT_s}$ is exactly what maps the $s$-plane onto the $z$-plane.</p>` },
    { title: String.raw`Delay property`, tex: String.raw`$$x[n-k]\;\leftrightarrow\; z^{-k}X(z)$$`, derivation: String.raw`<p>$\sum_n x[n-k]z^{-n}$. Let $m=n-k$: $=\sum_m x[m]z^{-(m+k)}=z^{-k}\sum_m x[m]z^{-m}=z^{-k}X(z)$. Each unit delay contributes one factor of $z^{-1}$, matching the physical shift register.</p>` },
    { title: String.raw`Transform of $a^n u[n]$`, tex: String.raw`$$a^n u[n]\;\leftrightarrow\;\frac{1}{1-az^{-1}},\;|z|>|a|$$`, derivation: String.raw`<p>$X(z)=\sum_{n=0}^\infty a^n z^{-n}=\sum_{n=0}^\infty (az^{-1})^n$. This geometric series converges when $|az^{-1}|<1\Leftrightarrow|z|>|a|$, summing to $\frac{1}{1-az^{-1}}=\frac{z}{z-a}$. Pole at $z=a$; ROC is outside it (causal), consistent with the stability rule if $|a|<1$.</p>` },
    { title: String.raw`Convolution property`, tex: String.raw`$$x[n]*h[n]\;\leftrightarrow\;X(z)H(z)$$`, derivation: String.raw`<p>$\sum_n\left(\sum_k x[k]h[n-k]\right)z^{-n}$. Swap sums, let $m=n-k$: $=\sum_k x[k]\sum_m h[m]z^{-(m+k)}=\sum_k x[k]z^{-k}\sum_m h[m]z^{-m}=X(z)H(z)$. Hence $H(z)=Y(z)/X(z)$ is the filter transfer function.</p>` },
    { title: String.raw`Transfer function from a difference equation`, tex: String.raw`$$H(z)=\frac{\sum_{m}b_m z^{-m}}{\sum_{k}a_k z^{-k}}$$`, derivation: String.raw`<p>Take $\sum_k a_k y[n-k]=\sum_m b_m x[n-m]$ and apply the delay rule to every term: $\sum_k a_k z^{-k}Y(z)=\sum_m b_m z^{-m}X(z)$. Factor: $Y(z)\sum_k a_k z^{-k}=X(z)\sum_m b_m z^{-m}$. Divide to get $H(z)=Y/X$ as the ratio of the two polynomials in $z^{-1}$.</p>` },
    { title: String.raw`DTFT as the unit-circle slice`, tex: String.raw`$$X(e^{j\omega})=X(z)\big|_{z=e^{j\omega}}$$`, derivation: String.raw`<p>Put $z=re^{j\omega}$ with $r=1$: $X(e^{j\omega})=\sum_n x[n]e^{-j\omega n}$, which is the DTFT. Because $e^{j\omega}$ is periodic in $\omega$ with period $2\pi$, the DTFT — and every digital spectrum — is periodic, reflecting sampling. Valid only when the unit circle lies in the ROC.</p>` },
    { title: String.raw`s-plane to z-plane map`, tex: String.raw`$$z=e^{sT_s}$$`, derivation: String.raw`<p>With $s=\sigma+j\omega$, $z=e^{\sigma T_s}e^{j\omega T_s}$, so $|z|=e^{\sigma T_s}$ and $\angle z=\omega T_s$. $\sigma<0\Rightarrow|z|<1$ (LHP $\to$ inside circle); $\sigma=0\Rightarrow|z|=1$ ($j\omega$-axis $\to$ circle); $\sigma>0\Rightarrow|z|>1$. Because $\angle z$ wraps every $\omega T_s=2\pi$, infinitely many $s$-values map to each $z$ — the mathematical statement of aliasing.</p>` },
    { title: String.raw`First-order IIR pole`, tex: String.raw`$$H(z)=\frac{1}{1-az^{-1}}\Rightarrow h[n]=a^n u[n]$$`, derivation: String.raw`<p>The recursion $y[n]=x[n]+a\,y[n-1]$ transforms to $Y=X+az^{-1}Y\Rightarrow H=\frac{1}{1-az^{-1}}$. Pole at $z=a$. Stable iff $|a|<1$: then $h[n]=a^n u[n]$ decays. This single-pole "leaky integrator" is the simplest digital low-pass filter.</p>` }
  ],
  flashcards: [
    { front: String.raw`Define the Z-Transform.`, back: String.raw`$X(z)=\sum_{n=-\infty}^\infty x[n]z^{-n}$, $z\in\mathbb{C}$.` },
    { front: String.raw`Discrete-time stability condition?`, back: String.raw`All poles of $H(z)$ strictly inside the unit circle ($|p|<1$); ROC includes $|z|=1$.` },
    { front: String.raw`What is the discrete analogue of the $j\omega$-axis?`, back: String.raw`The unit circle $|z|=1$.` },
    { front: String.raw`What does $z^{-1}$ represent?`, back: String.raw`A one-sample delay (the memory element in filter diagrams).` },
    { front: String.raw`How do the s-plane and z-plane relate?`, back: String.raw`$z=e^{sT_s}$: LHP$\to$inside circle, $j\omega$-axis$\to$circle, RHP$\to$outside.` },
    { front: String.raw`DTFT in terms of the Z-Transform?`, back: String.raw`$X(e^{j\omega})=X(z)|_{z=e^{j\omega}}$ — the Z-Transform on the unit circle.` },
    { front: String.raw`Why are FIR filters always stable?`, back: String.raw`No feedback; all poles sit at the origin ($|z|=0<1$).` },
    { front: String.raw`FIR vs IIR in one line?`, back: String.raw`FIR: no feedback, linear phase possible, always stable. IIR: feedback, efficient/sharp, must check stability.` },
    { front: String.raw`Why must the ROC be stated?`, back: String.raw`The same $X(z)$ maps to a causal or anti-causal sequence depending on the ROC.` },
    { front: String.raw`What frequency does $z=-1$ correspond to?`, back: String.raw`$\omega=\pi$, i.e. the Nyquist frequency $f_s/2$.` },
    { front: String.raw`Z-Transform of $a^n u[n]$ and its ROC?`, back: String.raw`$\frac{1}{1-az^{-1}}$, ROC $|z|>|a|$.` },
    { front: String.raw`Transfer function from a difference equation?`, back: String.raw`$H(z)=\frac{\sum b_m z^{-m}}{\sum a_k z^{-k}}$.` },
    { front: String.raw`Why are digital spectra periodic?`, back: String.raw`The frequency axis is the unit circle; $e^{j\omega}$ repeats every $2\pi$, so spectra repeat every $f_s$.` },
    { front: String.raw`ROC shape for a causal sequence?`, back: String.raw`Outside the outermost pole: $|z|>r_\max$.` }
  ],
  mcqs: [
    { q: String.raw`A causal digital filter is stable iff all poles of $H(z)$ lie:`, options: [String.raw`Inside the unit circle`, String.raw`On the unit circle`, String.raw`Outside the unit circle`, String.raw`In the left half-plane`], answer: 0, explain: String.raw`$|p|<1$ makes the impulse response decay.` },
    { q: String.raw`The DTFT is the Z-Transform evaluated on:`, options: [String.raw`The real axis`, String.raw`The unit circle $z=e^{j\omega}$`, String.raw`The origin`, String.raw`$z=1$ only`], answer: 1, explain: String.raw`Setting $|z|=1$ gives $\sum x[n]e^{-j\omega n}$.` },
    { q: String.raw`$z^{-1}$ in a filter diagram represents:`, options: [String.raw`A gain of $1/z$`, String.raw`A one-sample delay`, String.raw`An integrator`, String.raw`A multiplier`], answer: 1, explain: String.raw`Delay property: $x[n-1]\leftrightarrow z^{-1}X(z)$.` },
    { q: String.raw`The Laplace left half-plane maps under $z=e^{sT_s}$ to:`, options: [String.raw`Outside the unit circle`, String.raw`The unit circle`, String.raw`Inside the unit circle`, String.raw`The origin`], answer: 2, explain: String.raw`$\sigma<0\Rightarrow|z|=e^{\sigma T_s}<1$.` },
    { q: String.raw`FIR filters are always stable because:`, options: [String.raw`They have no zeros`, String.raw`All their poles are at the origin`, String.raw`They use feedback`, String.raw`They are linear phase`], answer: 1, explain: String.raw`No feedback means the only poles sit at $z=0$.` },
    { q: String.raw`The point $z=-1$ on the unit circle corresponds to:`, options: [String.raw`DC`, String.raw`$f_s/4$`, String.raw`$f_s/2$ (Nyquist)`, String.raw`$f_s$`], answer: 2, explain: String.raw`$\omega=\pi$ radians/sample is the Nyquist frequency.` },
    { q: String.raw`The Z-Transform of $a^n u[n]$ has ROC:`, options: [String.raw`$|z|<|a|$`, String.raw`$|z|>|a|$`, String.raw`$|z|=|a|$`, String.raw`all $z$`], answer: 1, explain: String.raw`Right-sided sequence: ROC outside the pole at $z=a$.` },
    { q: String.raw`The ROC of a Z-Transform is always:`, options: [String.raw`A half-plane`, String.raw`An annulus centred at the origin`, String.raw`A single point`, String.raw`The whole plane`], answer: 1, explain: String.raw`It is a ring bounded by poles.` },
    { q: String.raw`An IIR filter differs from an FIR filter in that it:`, options: [String.raw`Has feedback (recursive)`, String.raw`Cannot be unstable`, String.raw`Has no poles`, String.raw`Is always linear phase`], answer: 0, explain: String.raw`Feedback creates poles off the origin; stability must be checked.` },
    { q: String.raw`Two different sequences can share the same $X(z)$ because:`, options: [String.raw`Poles are ambiguous`, String.raw`They differ only in ROC`, String.raw`The transform is nonlinear`, String.raw`Zeros are ignored`], answer: 1, explain: String.raw`Causal vs anti-causal choices give the same algebra, different ROC.` },
    { q: String.raw`Digital spectra are periodic with period:`, options: [String.raw`$f_s/2$`, String.raw`$f_s$`, String.raw`$2f_s$`, String.raw`They are not periodic`], answer: 1, explain: String.raw`The unit-circle frequency axis repeats every $f_s$.` },
    { q: String.raw`A pole exactly on the unit circle (simple) gives a system that is:`, options: [String.raw`Stable`, String.raw`Marginally stable (e.g. resonator)`, String.raw`Always unstable`, String.raw`Non-causal`], answer: 1, explain: String.raw`Sustained, undamped oscillation — a digital oscillator.` }
  ],
  numericals: [
    { q: String.raw`A filter is $y[n]=0.5\,y[n-1]+x[n]$. Find $H(z)$, its pole, and state stability.`, solution: String.raw`<p><b>Formula.</b> $$x[n-k]\;\leftrightarrow\;z^{-k}X(z),\qquad H(z)=\frac{Y(z)}{X(z)}$$ where $z^{-1}$ is a one-sample delay; a causal filter is stable iff every pole satisfies $|p|<1$.</p>
<p><b>Substitute.</b> Transform the difference equation: $$Y=0.5z^{-1}Y+X\;\Rightarrow\;H(z)=\frac{1}{1-0.5z^{-1}}=\frac{z}{z-0.5}.$$</p>
<p><b>Compute.</b> Pole at $z=0.5$. Since $|0.5|<1$ (inside the unit circle) the filter is <strong>stable</strong>, with impulse response $h[n]=(0.5)^n u[n]$ that decays.</p>
<p><b>Explanation.</b> This single-pole "leaky integrator" is the simplest digital low-pass. The pole radius $0.5$ sets the decay rate — nearer the circle means slower decay and a narrower passband.</p>` },
    { q: String.raw`Find the impulse response of $H(z)=\frac{1}{1-2z^{-1}}$ for a causal system and comment on stability.`, solution: String.raw`<p><b>Formula.</b> $$\frac{1}{1-az^{-1}}\;\leftrightarrow\;a^n u[n]\;\;(\text{ROC }|z|>|a|)$$ where $a$ is the pole location; a causal sequence has ROC outside the outermost pole.</p>
<p><b>Substitute.</b> Here $a=2$, so the pole is at $z=2$ and the causal ROC is $|z|>2$: $$h[n]=2^n u[n].$$</p>
<p><b>Compute.</b> Since $|2|>1$ the pole lies outside the unit circle $\Rightarrow$ <strong>unstable</strong> — $h[n]$ doubles every sample and grows without bound.</p>
<p><b>Explanation.</b> The same algebra with an anti-causal ROC $|z|<2$ gives $h[n]=-2^n u[-n-1]$, which <em>does</em> include the unit circle. This is the clearest reminder that the ROC, not just $H(z)$, decides stability.</p>` },
    { q: String.raw`A 3-tap FIR filter has $h[n]=\{1,\,2,\,1\}$ for $n=0,1,2$. Write $H(z)$ and its frequency response at DC and Nyquist.`, solution: String.raw`<p><b>Formula.</b> $$H(z)=\sum_{n} h[n]z^{-n},\qquad H(e^{j\omega})=H(z)\big|_{z=e^{j\omega}}$$ where the frequency response is read on the unit circle: $z=1$ is DC ($\omega=0$) and $z=-1$ is Nyquist ($\omega=\pi$).</p>
<p><b>Substitute.</b> $$H(z)=1+2z^{-1}+z^{-2};\quad H(1)=1+2+1,\quad H(-1)=1-2+1.$$</p>
<p><b>Compute.</b> $H(1)=4$ at DC, $H(-1)=0$ at Nyquist. So it is a low-pass filter with a null at $f_s/2$; with only zeros (poles fixed at the origin) it is <strong>always stable</strong>.</p>
<p><b>Explanation.</b> The symmetric taps $\{1,2,1\}$ give exact linear phase and a smooth low-pass shape — this is the standard 2-sample averaging (Hann-like) filter. FIR designs trade taps for guaranteed stability and constant group delay.</p>` },
    { q: String.raw`For $x[n]=(0.8)^n u[n]$, find $X(z)$ and evaluate $|X(e^{j\omega})|$ at DC.`, solution: String.raw`<p><b>Formula.</b> $$a^n u[n]\;\leftrightarrow\;X(z)=\frac{1}{1-az^{-1}}\;\;(|z|>|a|)$$ where the DTFT $X(e^{j\omega})$ exists only if the unit circle lies in the ROC; DC is the point $z=1$.</p>
<p><b>Substitute.</b> With $a=0.8$: $$X(z)=\frac{1}{1-0.8z^{-1}},\quad \text{ROC }|z|>0.8;\qquad X(1)=\frac{1}{1-0.8}.$$</p>
<p><b>Compute.</b> $X(1)=1/0.2=5$, so $|X(e^{j0})|=5$. The ROC includes $|z|=1$, so the DTFT is well defined.</p>
<p><b>Explanation.</b> The pole at $0.8$ sits just inside the unit circle, boosting low frequencies — a low-pass emphasis. The closer the pole creeps to $z=1$, the sharper and taller the DC peak.</p>` },
    { q: String.raw`Invert $X(z)=\frac{1}{(1-0.5z^{-1})(1-0.25z^{-1})}$ (causal).`, solution: String.raw`<p><b>Formula.</b> $$X(z)=\frac{A}{1-0.5z^{-1}}+\frac{B}{1-0.25z^{-1}},\qquad \frac{1}{1-az^{-1}}\;\leftrightarrow\;a^n u[n]$$ where $A,B$ are residues found by clearing denominators.</p>
<p><b>Substitute.</b> $A(1-0.25z^{-1})+B(1-0.5z^{-1})=1$. Set $z^{-1}=2$ (kills the $A$ denominator's partner): $A(1-0.5)=1$. Set $z^{-1}=4$: $B(1-2)=1$.</p>
<p><b>Compute.</b> $A=2$, $B=-1$, so $$x[n]=\left[2(0.5)^n-(0.25)^n\right]u[n].$$</p>
<p><b>Explanation.</b> Two real poles inside the circle give two decaying modes; both being $<1$ confirms a stable causal sequence. The $0.5$-mode decays slower and dominates the tail, weighted twice as heavily.</p>` },
    { q: String.raw`A digital resonator has poles at $z=e^{\pm j\pi/4}$. Where is its resonant frequency and is it stable?`, solution: String.raw`<p><b>Formula.</b> $$\omega=\angle z\;(\text{rad/sample}),\qquad f=\frac{\omega f_s}{2\pi}$$ where $\angle z$ is the pole angle; stability needs $|z|<1$, and $|z|=1$ is only marginal.</p>
<p><b>Substitute.</b> Pole angle $\pm\pi/4$, radius $|z|=1$: $$\omega=\frac{\pi}{4}\text{ rad/sample},\qquad f=\frac{(\pi/4)f_s}{2\pi}.$$</p>
<p><b>Compute.</b> $f=f_s/8$. Because the poles sit exactly on the unit circle, the system is <em>marginally</em> stable — a pure, undamped oscillator.</p>
<p><b>Explanation.</b> The pole angle picks the resonant frequency; the radius sets the damping. Practical resonators pull the poles just inside ($r=0.99$) so the ring decays and stays bounded.</p>` }
  ],
  realWorld: String.raw`<p>Every digital filter in a phone, audio interface, modem, or SDR is designed and analysed with the Z-Transform. Graphic equalizers, DC-blocking filters, decimators, PLL loop filters, and the FIR pulse-shaping filters in a transmitter are all specified by their $H(z)$ pole-zero maps. Fixed-point DSP and FPGA implementations directly realise the $z^{-1}$ delays as registers, so the block diagram <em>is</em> the hardware. See <a href="#pulse-shaping">pulse shaping</a> and <a href="#sdr">SDR</a>.</p>`,
  related: ['laplace-transform', 'fourier-transform', 'nyquist-sampling', 'pulse-shaping', 'sdr']
},
{
  id: 'convolution',
  title: 'Convolution',
  category: 'Signals & Systems',
  tags: ['convolution', 'lti', 'impulse-response', 'filtering', 'convolution-theorem'],
  summary: String.raw`Convolution is the operation that computes the output of an LTI system from its input and impulse response, and equals multiplication in the frequency domain.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 175" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-convolution" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="35" width="96" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="60" y="58" fill="#e6edf3" text-anchor="middle">x(t) input</text>
<rect x="12" y="100" width="96" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="60" y="123" fill="#e6edf3" text-anchor="middle">h(t) impulse resp.</text>
<rect x="176" y="55" width="196" height="62" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="274" y="79" fill="#e6edf3" text-anchor="middle">flip h &#8594; slide by t &#8594;</text>
<text x="274" y="99" fill="#9aa7b5" text-anchor="middle">multiply &#8594; integrate</text>
<rect x="432" y="68" width="96" height="36" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="480" y="85" fill="#e6edf3" text-anchor="middle">y(t)=x&#8727;h</text>
<text x="480" y="100" fill="#9aa7b5" text-anchor="middle">output</text>
<line x1="108" y1="53" x2="174" y2="72" stroke="#9aa7b5" marker-end="url(#arr-convolution)"/>
<line x1="108" y1="118" x2="174" y2="100" stroke="#9aa7b5" marker-end="url(#arr-convolution)"/>
<line x1="372" y1="86" x2="430" y2="86" stroke="#9aa7b5" marker-end="url(#arr-convolution)"/>
<text x="270" y="155" fill="#b197fc" text-anchor="middle">in frequency this is a product: X(f) H(f)</text>
</svg>`,
    caption: String.raw`Flip h, slide it across x, multiply and integrate at each shift to build y = x*h (a product X(f)H(f) in frequency).`
  },
  {
    title: String.raw`FFT fast-convolution shortcut`,
    svg: String.raw`<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-convolution" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="20" width="80" height="34" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="52" y="41" fill="#e6edf3" text-anchor="middle">x[n]</text>
<rect x="12" y="130" width="80" height="34" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="52" y="151" fill="#e6edf3" text-anchor="middle">h[n]</text>
<rect x="130" y="20" width="80" height="34" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="170" y="41" fill="#e6edf3" text-anchor="middle">FFT</text>
<rect x="130" y="130" width="80" height="34" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="170" y="151" fill="#e6edf3" text-anchor="middle">FFT</text>
<circle cx="290" cy="90" r="18" fill="#1c232e" stroke="#b197fc"/>
<text x="290" y="95" fill="#e6edf3" text-anchor="middle">&#215;</text>
<rect x="350" y="72" width="90" height="34" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="395" y="93" fill="#e6edf3" text-anchor="middle">IFFT</text>
<rect x="470" y="72" width="60" height="34" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="500" y="93" fill="#e6edf3" text-anchor="middle">y[n]</text>
<line x1="92" y1="37" x2="128" y2="37" stroke="#9aa7b5" marker-end="url(#arr2-convolution)"/>
<line x1="92" y1="147" x2="128" y2="147" stroke="#9aa7b5" marker-end="url(#arr2-convolution)"/>
<line x1="210" y1="37" x2="278" y2="80" stroke="#9aa7b5" marker-end="url(#arr2-convolution)"/>
<line x1="210" y1="147" x2="278" y2="100" stroke="#9aa7b5" marker-end="url(#arr2-convolution)"/>
<line x1="308" y1="90" x2="348" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-convolution)"/>
<line x1="440" y1="89" x2="468" y2="89" stroke="#9aa7b5" marker-end="url(#arr2-convolution)"/>
<text x="270" y="184" fill="#b197fc" text-anchor="middle">O(N log N) vs direct-sum O(N&#178;)</text>
</svg>`,
    caption: String.raw`Fast convolution: FFT both signals, multiply the spectra, then inverse-FFT — O(N log N) instead of the direct-sum O(N&#178;).`
  },
  {
    title: String.raw`System identification (&#948;&#8594;h)`,
    svg: String.raw`<svg viewBox="0 0 520 130" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-convolution" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="45" width="110" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="67" y="62" fill="#e6edf3" text-anchor="middle">impulse &#948;(t)</text>
<text x="67" y="78" fill="#9aa7b5" text-anchor="middle">test input</text>
<rect x="196" y="40" width="140" height="50" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="266" y="62" fill="#e6edf3" text-anchor="middle">unknown LTI</text>
<text x="266" y="80" fill="#9aa7b5" text-anchor="middle">black box</text>
<rect x="410" y="45" width="100" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="460" y="62" fill="#e6edf3" text-anchor="middle">h(t)</text>
<text x="460" y="78" fill="#9aa7b5" text-anchor="middle">impulse resp.</text>
<line x1="122" y1="65" x2="194" y2="65" stroke="#9aa7b5" marker-end="url(#arr3-convolution)"/>
<line x1="336" y1="65" x2="408" y2="65" stroke="#9aa7b5" marker-end="url(#arr3-convolution)"/>
<text x="266" y="118" fill="#b197fc" text-anchor="middle">y=&#948;&#8727;h=h : one impulse reveals the whole system</text>
</svg>`,
    caption: String.raw`Feeding an impulse identifies the system: since &#948;&#8727;h = h, the output is the impulse response that then convolves with any future input.`
  }
  ],
  prerequisites: ['fourier-transform', 'comm-basics'],
  intro: String.raw`<p><em>Why it exists:</em> we want to predict what a system (a filter, a room, a radio channel) does to <em>any</em> input without re-measuring it every time. The key realization is that if you know the system's response to one sharp poke — its impulse response — you can predict its response to everything, because every signal is just a dense series of scaled, delayed pokes. Convolution is the operation that stitches those individual responses back together.</p>
<p>Convolution is the mathematical heart of linear time-invariant (LTI) systems. If you know how a system responds to a single impulse — its <strong>impulse response</strong> $h(t)$ — then convolution tells you its response to <em>any</em> input, because every input is a superposition of shifted, scaled impulses. Filtering, echo, blur, smoothing, and channel distortion are all convolutions.</p>
<p>Its companion fact — the <strong>convolution theorem</strong>, that convolution in time equals multiplication in frequency — is why the Fourier Transform is so powerful: it converts an awkward integral into a simple product, and is the basis of fast (FFT-based) filtering.</p>`,
  sections: [
    { h: 'Definition: continuous and discrete', html: String.raw`<p>Continuous-time convolution of $x(t)$ and $h(t)$:</p>
<p>$$y(t)=(x*h)(t)=\int_{-\infty}^{\infty}x(\tau)\,h(t-\tau)\,d\tau.$$</p>
<p>Discrete-time convolution of sequences:</p>
<p>$$y[n]=(x*h)[n]=\sum_{k=-\infty}^{\infty}x[k]\,h[n-k].$$</p>
<p>The variable $\tau$ (or $k$) is integrated/summed out; $t$ (or $n$) indexes the output. The kernel $h(t-\tau)$ is the impulse response <em>flipped</em> ($\tau\to-\tau$) and <em>shifted</em> by $t$. Convolution measures, at each output time, how much of the past input still "echoes" through the system's memory $h$.</p>` },
    { h: 'Why LTI systems convolve', html: String.raw`<p>Any input can be written as a sum of scaled, shifted impulses: $x(t)=\int x(\tau)\delta(t-\tau)d\tau$ (the sifting property). By <strong>time-invariance</strong>, the response to $\delta(t-\tau)$ is $h(t-\tau)$. By <strong>linearity</strong>, the total response is the superposition of these individual responses, weighted by $x(\tau)$:</p>
<p>$$y(t)=\int x(\tau)\,h(t-\tau)\,d\tau = (x*h)(t).$$</p>
<p>So <strong>$y=x*h$ is not a definition we impose — it is forced by linearity + time-invariance</strong>. This is the single most important structural fact in signals and systems: the impulse response completely characterises an LTI system.</p>` },
    { h: 'The flip–shift–multiply–integrate recipe', html: String.raw`<p>To evaluate $y(t)=(x*h)(t)$ graphically at a chosen $t$:</p>
<ol>
<li><strong>Flip</strong> one signal about the vertical axis: $h(\tau)\to h(-\tau)$.</li>
<li><strong>Shift</strong> it by $t$: $h(-(\tau-t))=h(t-\tau)$.</li>
<li><strong>Multiply</strong> point-by-point with $x(\tau)$.</li>
<li><strong>Integrate</strong> (or sum) the product to get the single number $y(t)$.</li>
</ol>
<p>Sweep $t$ from $-\infty$ to $+\infty$ (slide the flipped $h$ across $x$) to trace the whole output. The output is non-zero only while the two supports overlap, so if $x$ has duration $T_1$ and $h$ duration $T_2$, the convolution lasts $T_1+T_2$ (durations add) — a handy check.</p>` },
    { h: 'Properties', html: String.raw`<table class="data">
<tr><th>Property</th><th>Statement</th></tr>
<tr><td>Commutative</td><td>$x*h=h*x$</td></tr>
<tr><td>Associative</td><td>$(x*h_1)*h_2=x*(h_1*h_2)$</td></tr>
<tr><td>Distributive</td><td>$x*(h_1+h_2)=x*h_1+x*h_2$</td></tr>
<tr><td>Identity</td><td>$x*\delta=x$</td></tr>
<tr><td>Shift</td><td>$x(t)*\delta(t-t_0)=x(t-t_0)$</td></tr>
<tr><td>Width</td><td>$\mathrm{dur}(x*h)=\mathrm{dur}(x)+\mathrm{dur}(h)$</td></tr>
</table>
<p><strong>Associativity + commutativity</strong> mean cascaded LTI filters can be reordered and merged into a single equivalent $h_{eq}=h_1*h_2$. Convolving with $\delta(t-t_0)$ simply delays — a delta is the identity of convolution.</p>` },
    { h: 'The convolution theorem', html: String.raw`<div class="callout"><strong>Convolution theorem:</strong> convolution in time $\leftrightarrow$ multiplication in frequency, and vice-versa.
<p>$$x(t)*h(t)\;\leftrightarrow\;X(f)\,H(f),\qquad x(t)\,y(t)\;\leftrightarrow\;X(f)*Y(f).$$</p></div>
<p>This is why a filter is described interchangeably by its impulse response $h(t)$ (time) or its frequency response $H(f)=\mathcal{F}\{h\}$ (frequency). To filter, you can either convolve in time or — often faster — FFT the signal, multiply by $H(f)$, and inverse-FFT. For long signals, <strong>fast convolution</strong> (overlap-add / overlap-save with the FFT) beats direct convolution's $O(N^2)$ cost with $O(N\log N)$.</p>` },
    { h: 'Convolution vs. multiplication (modulation)', html: String.raw`<p>The dual is equally useful: multiplying two signals in time <em>convolves</em> their spectra. Multiplying by a carrier $\cos(2\pi f_c t)$ convolves the baseband spectrum with two impulses at $\pm f_c$, shifting it up to the carrier — this is amplitude modulation. Windowing (multiplying a signal by a finite window) convolves the true spectrum with the window's transform, which is exactly why windowing smears spectral lines (leakage).</p>` },
    { h: 'Worked graphical example', html: String.raw`<p>Convolve two identical unit-height rectangular pulses of width $T$ ($x=h=\mathrm{rect}(t/T)$). Sliding one flipped rectangle across the other, the overlap area grows linearly from $0$ (first touch at $t=-T$) to a peak of $T$ (full overlap at $t=0$) and back to $0$ (last touch at $t=+T$). The result is a <strong>triangular pulse</strong> of base $2T$ and height $T$: $\mathrm{tri}(t/T)\cdot T$. Note the width $2T=T+T$, confirming the duration-addition rule, and the smoothing (a rectangle becomes a smoother triangle).</p>` },
    { h: 'Common pitfalls', html: String.raw`<div class="callout"><strong>Watch out:</strong>
<ul>
<li><strong>Forgetting to flip:</strong> convolution flips one signal; correlation does not. Confusing them gives a time-reversed answer.</li>
<li><strong>Overlap limits:</strong> in graphical convolution the integration limits change as the shift $t$ moves through different overlap regions — solve piecewise.</li>
<li><strong>Circular vs linear:</strong> the DFT/FFT computes <em>circular</em> convolution; zero-pad to $N\ge N_x+N_h-1$ to get the correct <em>linear</em> convolution and avoid time-domain wraparound.</li>
<li><strong>Causality:</strong> a real-time (causal) filter has $h(t)=0$ for $t<0$, so the output cannot depend on future input.</li>
</ul></div>` },
    { h: 'What you should now understand', html: String.raw`<ul>
<li><strong>Why it appears:</strong> linearity plus time-invariance force an LTI system's output to be $y=x*h$ — the impulse response $h$ completely characterises the system.</li>
<li><strong>The mechanics:</strong> flip one signal, slide it, multiply, and integrate at each shift; the output lasts as long as the two durations added together.</li>
<li><strong>The key theorem:</strong> convolution in time equals multiplication in frequency, $x*h\leftrightarrow X(f)H(f)$ — so a filter is described equally by $h(t)$ or $H(f)$.</li>
<li><strong>The dual:</strong> multiplication in time is convolution in frequency, which is exactly why modulation shifts spectra and windowing smears them.</li>
<li><strong>Algebraic structure:</strong> convolution is commutative, associative, and distributive, with $\delta$ as its identity, so cascaded filters merge into $h_{eq}=h_1*h_2$.</li>
<li><strong>Doing it fast:</strong> FFT-based convolution costs $O(N\log N)$ versus direct $O(N^2)$ — but the DFT gives circular convolution, so zero-pad to $N_x+N_h-1$ for the linear result.</li>
</ul>` }
  ],
  keyPoints: [
    String.raw`Continuous: $y(t)=\int x(\tau)h(t-\tau)d\tau$; discrete: $y[n]=\sum_k x[k]h[n-k]$.`,
    String.raw`LTI output = input convolved with impulse response: $y=x*h$ (forced by linearity + time-invariance).`,
    String.raw`Recipe: flip, shift, multiply, integrate; sweep the shift to trace the output.`,
    String.raw`Convolution theorem: $x*h\leftrightarrow X(f)H(f)$ (time convolution = frequency product).`,
    String.raw`Multiplication in time $\leftrightarrow$ convolution in frequency (the dual).`,
    String.raw`Commutative, associative, distributive; $\delta$ is the identity.`,
    String.raw`Convolving with $\delta(t-t_0)$ just delays by $t_0$.`,
    String.raw`Output duration = sum of the two input durations.`,
    String.raw`rect $*$ rect = triangle (smoothing, width doubles).`,
    String.raw`Cascaded LTI filters merge: $h_{eq}=h_1*h_2$.`,
    String.raw`FFT-based fast convolution is $O(N\log N)$ vs direct $O(N^2)$.`,
    String.raw`DFT gives circular convolution; zero-pad to $N_x+N_h-1$ for linear convolution.`
  ],
  equations: [
    { title: String.raw`Continuous-time convolution`, tex: String.raw`$$y(t)=\int_{-\infty}^{\infty}x(\tau)h(t-\tau)\,d\tau$$`, derivation: String.raw`<p>Represent the input via the sifting property: $x(t)=\int x(\tau)\delta(t-\tau)d\tau$. Let $\mathcal{S}\{\cdot\}$ be the LTI operator with $\mathcal{S}\{\delta(t)\}=h(t)$. By time-invariance $\mathcal{S}\{\delta(t-\tau)\}=h(t-\tau)$. By linearity, $\mathcal{S}$ passes through the integral (a continuous sum): $y(t)=\mathcal{S}\{x(t)\}=\int x(\tau)\,\mathcal{S}\{\delta(t-\tau)\}d\tau=\int x(\tau)h(t-\tau)d\tau$.</p>` },
    { title: String.raw`Commutativity`, tex: String.raw`$$x*h=h*x$$`, derivation: String.raw`<p>$y(t)=\int x(\tau)h(t-\tau)d\tau$. Substitute $\lambda=t-\tau$, $d\tau=-d\lambda$, limits flip: $=\int x(t-\lambda)h(\lambda)d\lambda=\int h(\lambda)x(t-\lambda)d\lambda=(h*x)(t)$. So it does not matter which signal you flip.</p>` },
    { title: String.raw`Convolution theorem`, tex: String.raw`$$\mathcal{F}\{x*h\}=X(f)H(f)$$`, derivation: String.raw`<p>$\mathcal{F}\{x*h\}=\int\!\left[\int x(\tau)h(t-\tau)d\tau\right]e^{-j2\pi ft}dt$. Swap order: $=\int x(\tau)\left[\int h(t-\tau)e^{-j2\pi ft}dt\right]d\tau$. Inner integral is $H(f)e^{-j2\pi f\tau}$ (time-shift). So $=\int x(\tau)H(f)e^{-j2\pi f\tau}d\tau=H(f)X(f)$.</p>` },
    { title: String.raw`Sifting / identity`, tex: String.raw`$$x(t)*\delta(t)=x(t)$$`, derivation: String.raw`<p>$\int x(\tau)\delta(t-\tau)d\tau$. The delta is non-zero only at $\tau=t$, where it picks out $x(t)$ and integrates to $1$: $=x(t)$. Hence $\delta$ is the convolution identity; $x*\delta(t-t_0)=x(t-t_0)$ (pure delay).</p>` },
    { title: String.raw`rect $*$ rect = triangle`, tex: String.raw`$$\mathrm{rect}(t/T)*\mathrm{rect}(t/T)=T\,\mathrm{tri}(t/T)$$`, derivation: String.raw`<p>For $0\le t\le T$ the two unit rectangles overlap over an interval of length $(T-t)$, so the integral of $1\times1$ equals $T-t$; by symmetry for $-T\le t\le0$ it is $T-|t|$. Thus $y(t)=T-|t|$ for $|t|\le T$ and $0$ otherwise — a triangle of height $T$, base $2T$. Frequency check: $(\mathrm{sinc})^2$, since multiplication of $T\,\mathrm{sinc}(fT)$ by itself.</p>` },
    { title: String.raw`Duration addition`, tex: String.raw`$$\mathrm{dur}(x*h)=\mathrm{dur}(x)+\mathrm{dur}(h)$$`, derivation: String.raw`<p>The product $x(\tau)h(t-\tau)$ is non-zero only where both supports overlap. If $x$ is supported on $[a_1,b_1]$ and $h$ on $[a_2,b_2]$, overlap first occurs at $t=a_1+a_2$ and last at $t=b_1+b_2$, giving total length $(b_1-a_1)+(b_2-a_2)$.</p>` },
    { title: String.raw`Discrete convolution`, tex: String.raw`$$y[n]=\sum_{k}x[k]h[n-k]$$`, derivation: String.raw`<p>Same superposition argument with the discrete unit impulse $\delta[n]$: $x[n]=\sum_k x[k]\delta[n-k]$, and $\mathcal{S}\{\delta[n-k]\}=h[n-k]$ by time-invariance. Linearity gives $y[n]=\sum_k x[k]h[n-k]$. For finite sequences of lengths $N_x,N_h$ the result has length $N_x+N_h-1$.</p>` },
    { title: String.raw`Multiplication $\leftrightarrow$ convolution (dual)`, tex: String.raw`$$x(t)y(t)\leftrightarrow X(f)*Y(f)$$`, derivation: String.raw`<p>By duality of the convolution theorem: writing $x(t)y(t)=\mathcal{F}^{-1}\{X\}\,\mathcal{F}^{-1}\{Y\}$ and applying the forward transform, the product integral rearranges (same swap-and-shift steps) into the convolution $\int X(\nu)Y(f-\nu)d\nu=X*Y$. This is why AM (multiply by carrier) shifts/copies the spectrum.</p>` }
  ],
  flashcards: [
    { front: String.raw`Write the continuous convolution integral.`, back: String.raw`$y(t)=\int_{-\infty}^\infty x(\tau)h(t-\tau)d\tau$.` },
    { front: String.raw`Why does an LTI system convolve its input with $h$?`, back: String.raw`Superposition of shifted impulses (time-invariance) plus linearity forces $y=x*h$.` },
    { front: String.raw`State the convolution theorem.`, back: String.raw`$x*h\leftrightarrow X(f)H(f)$: time convolution = frequency multiplication.` },
    { front: String.raw`What is the identity element of convolution?`, back: String.raw`The Dirac delta $\delta(t)$: $x*\delta=x$.` },
    { front: String.raw`Result of convolving two identical rectangles?`, back: String.raw`A triangle of double the width (rect$*$rect = tri).` },
    { front: String.raw`Steps of graphical convolution?`, back: String.raw`Flip, shift, multiply, integrate — then sweep the shift.` },
    { front: String.raw`How long is $x*h$ if durations are $T_1$ and $T_2$?`, back: String.raw`$T_1+T_2$ (durations add).` },
    { front: String.raw`Effect of $x(t)*\delta(t-t_0)$?`, back: String.raw`Pure delay: $x(t-t_0)$.` },
    { front: String.raw`Multiplication in time corresponds to what in frequency?`, back: String.raw`Convolution of the spectra $X(f)*Y(f)$.` },
    { front: String.raw`How do cascaded LTI filters combine?`, back: String.raw`Convolve their impulse responses: $h_{eq}=h_1*h_2$ (equivalently $H_1H_2$).` },
    { front: String.raw`Circular vs linear convolution in the DFT?`, back: String.raw`DFT gives circular; zero-pad to $N_x+N_h-1$ to recover linear.` },
    { front: String.raw`Convolution vs correlation — key difference?`, back: String.raw`Convolution flips one signal; correlation does not.` },
    { front: String.raw`Cost of FFT-based fast convolution?`, back: String.raw`$O(N\log N)$ vs direct $O(N^2)$.` },
    { front: String.raw`What does a causal impulse response satisfy?`, back: String.raw`$h(t)=0$ for $t<0$ (output cannot depend on future input).` }
  ],
  mcqs: [
    { q: String.raw`The output of an LTI system equals the input:`, options: [String.raw`Multiplied by $h(t)$`, String.raw`Convolved with $h(t)$`, String.raw`Correlated with $h(t)$`, String.raw`Added to $h(t)$`], answer: 1, explain: String.raw`$y=x*h$ follows from linearity and time-invariance.` },
    { q: String.raw`Convolution in the time domain corresponds to what in frequency?`, options: [String.raw`Convolution`, String.raw`Multiplication`, String.raw`Correlation`, String.raw`Division`], answer: 1, explain: String.raw`Convolution theorem: $x*h\leftrightarrow X(f)H(f)$.` },
    { q: String.raw`Convolving two identical rectangular pulses gives:`, options: [String.raw`A wider rectangle`, String.raw`A triangle`, String.raw`A sinc`, String.raw`An impulse`], answer: 1, explain: String.raw`Overlap area rises then falls linearly — a triangle of double width.` },
    { q: String.raw`The identity element of convolution is:`, options: [String.raw`$1$`, String.raw`$u(t)$`, String.raw`$\delta(t)$`, String.raw`$0$`], answer: 2, explain: String.raw`$x*\delta=x$.` },
    { q: String.raw`Which step distinguishes convolution from correlation?`, options: [String.raw`Shifting`, String.raw`Multiplying`, String.raw`Flipping one signal`, String.raw`Integrating`], answer: 2, explain: String.raw`Convolution time-reverses (flips) one signal; correlation does not.` },
    { q: String.raw`If $x$ lasts $3\text{ ms}$ and $h$ lasts $2\text{ ms}$, $x*h$ lasts:`, options: [String.raw`$2\text{ ms}$`, String.raw`$3\text{ ms}$`, String.raw`$5\text{ ms}$`, String.raw`$6\text{ ms}$`], answer: 2, explain: String.raw`Durations add: $3+2=5\text{ ms}$.` },
    { q: String.raw`Convolution is NOT:`, options: [String.raw`Commutative`, String.raw`Associative`, String.raw`Distributive`, String.raw`Non-linear`], answer: 3, explain: String.raw`It is linear; the other three properties hold.` },
    { q: String.raw`$x(t)*\delta(t-5)$ equals:`, options: [String.raw`$x(t)$`, String.raw`$x(t-5)$`, String.raw`$x(t+5)$`, String.raw`$5x(t)$`], answer: 1, explain: String.raw`Convolving with a shifted delta delays by 5.` },
    { q: String.raw`Multiplying a signal by a carrier $\cos(2\pi f_c t)$ in time:`, options: [String.raw`Convolves its spectrum with impulses at $\pm f_c$`, String.raw`Multiplies its spectrum`, String.raw`Leaves the spectrum unchanged`, String.raw`Removes the spectrum`], answer: 0, explain: String.raw`Multiplication in time = convolution in frequency (AM).` },
    { q: String.raw`The DFT computes which kind of convolution?`, options: [String.raw`Linear`, String.raw`Circular`, String.raw`Partial`, String.raw`Fractional`], answer: 1, explain: String.raw`Circular; zero-pad to $N_x+N_h-1$ for linear.` },
    { q: String.raw`Cascaded LTI filters $h_1$ then $h_2$ are equivalent to a single:`, options: [String.raw`$h_1+h_2$`, String.raw`$h_1*h_2$`, String.raw`$h_1\cdot h_2$`, String.raw`$h_1/h_2$`], answer: 1, explain: String.raw`Equivalent impulse response is the convolution $h_1*h_2$.` },
    { q: String.raw`FFT-based fast convolution reduces cost from $O(N^2)$ to:`, options: [String.raw`$O(N)$`, String.raw`$O(N\log N)$`, String.raw`$O(\log N)$`, String.raw`$O(N^{1.5})$`], answer: 1, explain: String.raw`Multiply spectra then inverse-FFT.` }
  ],
  numericals: [
    { q: String.raw`Convolve $x[n]=\{1,2,3\}$ with $h[n]=\{1,1\}$ (both starting at $n=0$).`, solution: String.raw`<p><b>Formula.</b> $$y[n]=\sum_{k}x[k]\,h[n-k],\qquad \text{length}=N_x+N_h-1$$ where $N_x,N_h$ are the input lengths; each output sample is a sum of products of overlapping taps.</p>
<p><b>Substitute.</b> Length $=3+2-1=4$: $$y[0]=1\cdot1,\;\; y[1]=1\cdot1+2\cdot1,\;\; y[2]=2\cdot1+3\cdot1,\;\; y[3]=3\cdot1.$$</p>
<p><b>Compute.</b> $y=\{1,\,3,\,5,\,3\}$. Check: $\sum y=12=(\sum x)(\sum h)=6\times2$.</p>
<p><b>Explanation.</b> Convolving with $\{1,1\}$ is a running sum of adjacent samples — a simple smoother. The sum-of-products check ($\sum y=\sum x\cdot\sum h$) follows from evaluating both transforms at DC.</p>` },
    { q: String.raw`An LTI system has $h(t)=e^{-t}u(t)$. Find its step response.`, solution: String.raw`<p><b>Formula.</b> $$y(t)=(u*h)(t)=\int_{-\infty}^{\infty}u(\tau)h(t-\tau)\,d\tau$$ where $u$ is the unit-step input and $h$ the impulse response; the step response is the running integral of $h$.</p>
<p><b>Substitute.</b> For $t\ge0$ the supports overlap on $[0,t]$: $$y(t)=\int_0^t e^{-\tau}\,d\tau.$$</p>
<p><b>Compute.</b> $y(t)=\left[-e^{-\tau}\right]_0^t=1-e^{-t}$, so $y(t)=(1-e^{-t})u(t)$.</p>
<p><b>Explanation.</b> This is the classic first-order rise: it starts at $0$, climbs with time constant $1\text{ s}$, and settles at the DC gain of $1$. The step response is just the integral of the impulse response.</p>` },
    { q: String.raw`Convolve $x(t)=\mathrm{rect}(t)$ (width 1, centred at 0) with itself. Give $y(0)$ and the total width.`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{rect}(t)*\mathrm{rect}(t)=\mathrm{tri}(t),\qquad \text{dur}(x*h)=\text{dur}(x)+\text{dur}(h)$$ where the peak equals the full-overlap area and durations add.</p>
<p><b>Substitute.</b> Two unit-height, width-$1$ rectangles: peak overlap area at $t=0$ is $1\times1$ over length $1$; total width $=1+1$.</p>
<p><b>Compute.</b> $y(0)=1$ and the result spans width $2$, i.e. $y(t)=1-|t|$ for $|t|\le1$ (a triangle).</p>
<p><b>Explanation.</b> Convolution smooths: a sharp-edged rectangle becomes a gentler triangle of double the width. The peak sits where the two pulses overlap completely.</p>` },
    { q: String.raw`Two pulses have durations $10\,\mu\text{s}$ and $4\,\mu\text{s}$. Over what time span is the convolution non-zero?`, solution: String.raw`<p><b>Formula.</b> $$\text{dur}(x*h)=\text{dur}(x)+\text{dur}(h)$$ where the output is non-zero only while the two supports overlap, so total durations add.</p>
<p><b>Substitute.</b> $$\text{dur}(x*h)=10\,\mu\text{s}+4\,\mu\text{s}.$$</p>
<p><b>Compute.</b> $14\,\mu\text{s}$. If both pulses start at $t=0$, the output occupies $[0,\,14\,\mu\text{s}]$.</p>
<p><b>Explanation.</b> Overlap begins the instant the leading edges meet and ends when the trailing edges part, giving the sum of durations — a quick sanity check for any convolution's extent.</p>` },
    { q: String.raw`Use the convolution theorem to filter: input spectrum $X(f)$ is flat from $0$–$10\text{ kHz}$; filter $H(f)$ is an ideal low-pass with cutoff $3\text{ kHz}$. Describe the output.`, solution: String.raw`<p><b>Formula.</b> $$x(t)*h(t)\;\leftrightarrow\;Y(f)=X(f)H(f)$$ where convolution in time is a simple product in frequency; $H(f)=1$ below cutoff and $0$ above it.</p>
<p><b>Substitute.</b> $$Y(f)=X(f)\cdot H(f)=\begin{cases}X(f), & f\le 3\text{ kHz}\\ 0, & f>3\text{ kHz}.\end{cases}$$</p>
<p><b>Compute.</b> The output is flat from $0$–$3\text{ kHz}$ and zero above; everything from $3$–$10\text{ kHz}$ is removed.</p>
<p><b>Explanation.</b> In time this equals convolving the input with the filter's sinc impulse response (a smoother), but a single frequency-domain multiply is far cheaper — the whole point of the convolution theorem.</p>` },
    { q: String.raw`For circular convolution, what zero-padded length is needed to linearly convolve a $200$-tap FIR with a $1024$-sample block?`, solution: String.raw`<p><b>Formula.</b> $$L=N_x+N_h-1$$ where $L$ is the linear-convolution length; the FFT (circular) length must be $\ge L$ to avoid time-domain wraparound.</p>
<p><b>Substitute.</b> $$L=1024+200-1.$$</p>
<p><b>Compute.</b> $L=1223$ samples. Pad both to the next convenient FFT size, e.g. $N=2048$, FFT, multiply, inverse-FFT, and keep the first $1223$ samples.</p>
<p><b>Explanation.</b> Circular convolution wraps energy past the block end; padding to at least $N_x+N_h-1$ leaves room so the wrapped tail lands in the zeros. Overlap-add/overlap-save stitch consecutive blocks for streaming.</p>` }
  ],
  realWorld: String.raw`<p>Convolution is everywhere: audio reverb convolves a dry signal with a room's measured impulse response; image blur and sharpening convolve pixels with a 2-D kernel (the same operation a convolutional neural network learns); a multipath radio channel convolves the transmitted waveform with the channel impulse response, which the receiver's equalizer must undo. Pulse-shaping filters, matched filters, and moving-average smoothers are all convolutions. See <a href="#matched-filter">matched filter</a> and <a href="#pulse-shaping">pulse shaping</a>.</p>`,
  related: ['fourier-transform', 'correlation', 'matched-filter', 'pulse-shaping', 'z-transform']
},
{
  id: 'correlation',
  title: 'Correlation',
  category: 'Signals & Systems',
  tags: ['correlation', 'autocorrelation', 'cross-correlation', 'matched-filter', 'wiener-khinchin'],
  summary: String.raw`Correlation measures the similarity between two signals as a function of relative lag, underlying matched filtering, timing/synchronization, and the link between autocorrelation and power spectrum.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 175" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-correlation" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="35" width="96" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="60" y="58" fill="#e6edf3" text-anchor="middle">signal y(t)</text>
<rect x="12" y="100" width="96" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="60" y="123" fill="#e6edf3" text-anchor="middle">template x(t)</text>
<rect x="176" y="55" width="196" height="62" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="274" y="79" fill="#e6edf3" text-anchor="middle">slide by lag &#964; &#8594;</text>
<text x="274" y="99" fill="#9aa7b5" text-anchor="middle">multiply-accumulate (no flip)</text>
<rect x="424" y="60" width="104" height="52" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="476" y="82" fill="#e6edf3" text-anchor="middle">R_xy(&#964;)</text>
<text x="476" y="100" fill="#9aa7b5" text-anchor="middle">peak at best lag</text>
<line x1="108" y1="53" x2="174" y2="72" stroke="#9aa7b5" marker-end="url(#arr-correlation)"/>
<line x1="108" y1="118" x2="174" y2="100" stroke="#9aa7b5" marker-end="url(#arr-correlation)"/>
<line x1="372" y1="86" x2="422" y2="86" stroke="#9aa7b5" marker-end="url(#arr-correlation)"/>
<text x="270" y="155" fill="#b197fc" text-anchor="middle">the lag of the peak = time offset / delay between the signals</text>
</svg>`,
    caption: String.raw`Slide the template past the signal and multiply-accumulate at each lag; the correlation peak locates the best-match offset.`
  },
  {
    title: String.raw`Matched-filter equivalence`,
    svg: String.raw`<svg viewBox="0 0 520 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-correlation" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="50" width="90" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="57" y="67" fill="#e6edf3" text-anchor="middle">received</text>
<text x="57" y="83" fill="#9aa7b5" text-anchor="middle">r(t)</text>
<rect x="150" y="42" width="150" height="56" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="225" y="63" fill="#e6edf3" text-anchor="middle">flip template</text>
<text x="225" y="82" fill="#9aa7b5" text-anchor="middle">h(t)=s*(T&#8722;t)</text>
<rect x="348" y="42" width="150" height="56" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="423" y="63" fill="#e6edf3" text-anchor="middle">convolve</text>
<text x="423" y="82" fill="#9aa7b5" text-anchor="middle">= correlate with s</text>
<line x1="102" y1="70" x2="148" y2="70" stroke="#9aa7b5" marker-end="url(#arr2-correlation)"/>
<line x1="300" y1="70" x2="346" y2="70" stroke="#9aa7b5" marker-end="url(#arr2-correlation)"/>
<text x="255" y="128" fill="#b197fc" text-anchor="middle">correlating with s &#8801; convolving with the flipped template &#8594; max SNR</text>
</svg>`,
    caption: String.raw`Correlating a received signal with template s equals convolving it with the time-reversed template h(t)=s*(T&#8722;t) — the matched filter that maximises SNR.`
  },
  {
    title: String.raw`Auto- vs cross-correlation`,
    svg: String.raw`<svg viewBox="0 0 520 175" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-correlation" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="20" width="150" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="87" y="40" fill="#e6edf3" text-anchor="middle">autocorr R_xx(&#964;)</text>
<text x="87" y="56" fill="#9aa7b5" text-anchor="middle">x with itself</text>
<rect x="230" y="20" width="270" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="365" y="40" fill="#e6edf3" text-anchor="middle">find period / clean sync template</text>
<text x="365" y="56" fill="#9aa7b5" text-anchor="middle">peak at &#964;=0</text>
<rect x="12" y="105" width="150" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="87" y="125" fill="#e6edf3" text-anchor="middle">crosscorr R_xy(&#964;)</text>
<text x="87" y="141" fill="#9aa7b5" text-anchor="middle">x against y</text>
<rect x="230" y="105" width="270" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="365" y="125" fill="#e6edf3" text-anchor="middle">radar ranging / GPS code phase</text>
<text x="365" y="141" fill="#9aa7b5" text-anchor="middle">peak lag = delay</text>
<line x1="162" y1="42" x2="228" y2="42" stroke="#9aa7b5" marker-end="url(#arr3-correlation)"/>
<line x1="162" y1="127" x2="228" y2="127" stroke="#9aa7b5" marker-end="url(#arr3-correlation)"/>
</svg>`,
    caption: String.raw`Autocorrelation (a signal with itself) exposes periodicity; cross-correlation (against another signal) locates delay — the basis of sync, radar ranging and GPS code acquisition.`
  }
  ],
  prerequisites: ['convolution', 'fourier-transform', 'psd'],
  intro: String.raw`<p>Correlation asks "how similar are these two signals, and at what time offset are they most alike?" It slides one signal past another and, at each lag, sums the product. The lag giving the largest value tells you <em>where</em> the match is — the basis of radar ranging, GPS code acquisition, timing synchronization, and pattern detection.</p>
<p>Correlation looks almost identical to convolution but omits the flip. Its self-version, <strong>autocorrelation</strong>, reveals a signal's periodicities and, via the Wiener–Khinchin theorem, is the Fourier partner of the power spectral density.</p>`,
  sections: [
    { h: 'Cross-correlation and autocorrelation', html: String.raw`<p><strong>Cross-correlation</strong> of $x$ and $y$ at lag $\tau$:</p>
<p>$$R_{xy}(\tau)=\int_{-\infty}^{\infty}x^*(t)\,y(t+\tau)\,dt \qquad(\text{discrete: } R_{xy}[m]=\sum_n x^*[n]\,y[n+m]).$$</p>
<p><strong>Autocorrelation</strong> is a signal correlated with itself, $R_{xx}(\tau)=\int x^*(t)x(t+\tau)dt$. It is maximal at zero lag (a signal is most like itself), where $R_{xx}(0)=\int|x(t)|^2dt$ equals the signal's <strong>energy</strong> (or power, for power signals). For real signals autocorrelation is even, $R_{xx}(-\tau)=R_{xx}(\tau)$.</p>` },
    { h: 'Correlation vs. convolution', html: String.raw`<p>They differ by a single flip:</p>
<table class="data">
<tr><th></th><th>Convolution</th><th>Correlation</th></tr>
<tr><td>Formula</td><td>$\int x(\tau)h(t-\tau)d\tau$</td><td>$\int x^*(\tau)y(\tau+t)d\tau$</td></tr>
<tr><td>Flip?</td><td>Yes (one signal reversed)</td><td>No</td></tr>
<tr><td>Commutative?</td><td>Yes</td><td>No ($R_{xy}\ne R_{yx}$ in general; $R_{yx}(\tau)=R_{xy}^*(-\tau)$)</td></tr>
<tr><td>Purpose</td><td>System output / filtering</td><td>Similarity / detection</td></tr>
</table>
<p>Formally, $R_{xy}(\tau)=x^*(-\tau)*y(\tau)$: correlation is convolution with one signal <em>time-reversed and conjugated</em>. So a correlator can be built from a convolver by pre-flipping — exactly what a matched filter does.</p>` },
    { h: 'Matched filtering', html: String.raw`<p>To detect a known template $s(t)$ buried in white noise, the filter that <strong>maximizes output SNR</strong> at the decision instant is the <strong>matched filter</strong> $h(t)=s^*(T-t)$ — the template time-reversed and conjugated. Its output is precisely the cross-correlation of the received signal with $s$. At the correct alignment the correlation peaks, giving the best possible detection.</p>
<div class="callout"><strong>Key result:</strong> the matched filter's peak SNR is $\mathrm{SNR}_{\max}=2E/N_0$, where $E$ is the signal energy and $N_0/2$ the noise PSD — it depends only on energy, not on pulse shape. This is why digital receivers correlate against the known symbol pulse. See <a href="#matched-filter">matched filter</a>.</div>` },
    { h: 'Lag detection and timing', html: String.raw`<p>The lag $\hat\tau$ at which $R_{xy}$ peaks estimates the <strong>time delay</strong> between two versions of a signal. Radar transmits a pulse and cross-correlates the echo with a copy; the peak lag $\times$ (speed of light / 2) is range. GPS receivers correlate the incoming signal against a locally generated PN code, sweeping code phase (lag) until the correlation spikes — this "acquisition" both detects the satellite and yields the pseudorange. The sharper the autocorrelation peak, the finer the timing resolution, which is why spread-spectrum systems use codes with impulse-like autocorrelation.</p>` },
    { h: 'Autocorrelation properties', html: String.raw`<ul>
<li>$R_{xx}(0)\ge|R_{xx}(\tau)|$ for all $\tau$ — the peak is always at zero lag.</li>
<li>$R_{xx}(0)=$ energy (energy signals) or average power (power signals).</li>
<li>Even symmetry for real signals: $R_{xx}(-\tau)=R_{xx}(\tau)$.</li>
<li>A periodic signal has a periodic autocorrelation with the <em>same period</em> — a robust way to detect pitch/period even in noise (noise decorrelates and vanishes off-peak).</li>
<li>White noise has $R_{xx}(\tau)\propto\delta(\tau)$: uncorrelated except at zero lag.</li>
</ul>` },
    { h: 'Wiener–Khinchin theorem', html: String.raw`<div class="callout"><strong>Wiener–Khinchin:</strong> the power spectral density is the Fourier Transform of the autocorrelation.
<p>$$S_x(f)=\int_{-\infty}^{\infty}R_{xx}(\tau)\,e^{-j2\pi f\tau}\,d\tau,\qquad R_{xx}(\tau)=\int_{-\infty}^{\infty}S_x(f)\,e^{j2\pi f\tau}\,df.$$</p></div>
<p>This is the rigorous route to the PSD of random signals, whose FT does not converge directly. Setting $\tau=0$ gives $R_{xx}(0)=\int S_x(f)df$ — total power equals the area under the PSD (Parseval for power). It also explains matched filtering in the frequency domain and links directly to <a href="#psd">PSD</a> and <a href="#noise">noise</a> analysis.</p>` },
    { h: 'Normalized correlation coefficient', html: String.raw`<p>To compare shape independent of amplitude, normalise:</p>
<p>$$\rho_{xy}(\tau)=\frac{R_{xy}(\tau)}{\sqrt{R_{xx}(0)R_{yy}(0)}},\qquad -1\le\rho\le1.$$</p>
<p>$\rho=+1$ means identical up to a positive scale, $\rho=-1$ perfectly anti-correlated, $\rho=0$ uncorrelated (orthogonal at that lag). This is the correlation coefficient familiar from statistics and the standard figure of merit for template matching.</p>` },
    { h: 'Common pitfalls', html: String.raw`<div class="callout"><strong>Watch out:</strong>
<ul>
<li><strong>No flip:</strong> do not accidentally time-reverse — that turns correlation into convolution and shifts the peak.</li>
<li><strong>Order matters:</strong> $R_{xy}\ne R_{yx}$; swapping the signals reflects the lag axis.</li>
<li><strong>Correlation $\ne$ causation:</strong> a high $\rho$ shows similarity, not a physical cause.</li>
<li><strong>Bias in short records:</strong> estimated autocorrelation at large lags uses few samples and is noisy; use biased/unbiased estimators appropriately.</li>
<li><strong>DC offset</strong> inflates correlation; remove the mean before correlating for a meaningful $\rho$.</li>
</ul></div>` },
    { h: 'What you should now understand', html: String.raw`<ul>
<li><strong>The core idea:</strong> correlation slides one signal past another and sums the product at each lag, measuring similarity versus offset — the peak lag is the best alignment.</li>
<li><strong>Versus convolution:</strong> it is the same machinery <em>without the flip</em>; equivalently, correlation is convolution with one signal time-reversed and conjugated.</li>
<li><strong>Autocorrelation:</strong> peaks at zero lag where it equals the energy/power, is even for real signals, and stays periodic for periodic signals — a robust period detector in noise.</li>
<li><strong>Matched filtering:</strong> $h(t)=s^*(T-t)$ maximises output SNR at $2E/N_0$ (shape-independent); its output <em>is</em> the cross-correlation with the template.</li>
<li><strong>Timing and ranging:</strong> the peak lag of a cross-correlation gives time delay — radar range, GPS code phase, frame sync.</li>
<li><strong>Wiener–Khinchin:</strong> the PSD is the Fourier Transform of the autocorrelation, and $R_{xx}(0)=\int S_x(f)df$ is the total power.</li>
</ul>` }
  ],
  keyPoints: [
    String.raw`Cross-correlation $R_{xy}(\tau)=\int x^*(t)y(t+\tau)dt$ measures similarity vs lag.`,
    String.raw`Correlation = convolution with one signal flipped (and conjugated); no flip in correlation itself.`,
    String.raw`Autocorrelation peaks at zero lag: $R_{xx}(0)=$ energy/power.`,
    String.raw`Autocorrelation is even (real signals); periodic signals have periodic autocorrelation.`,
    String.raw`Matched filter $h(t)=s^*(T-t)$ maximizes output SNR; output = cross-correlation with the template.`,
    String.raw`Matched-filter peak SNR $=2E/N_0$, independent of pulse shape.`,
    String.raw`Peak-lag of cross-correlation estimates time delay (radar range, GPS code phase).`,
    String.raw`Wiener–Khinchin: $S_x(f)=\mathcal{F}\{R_{xx}(\tau)\}$ — PSD is the FT of autocorrelation.`,
    String.raw`$R_{xx}(0)=\int S_x(f)df$ = total power (area under PSD).`,
    String.raw`White noise: $R_{xx}(\tau)\propto\delta(\tau)$ (uncorrelated except at zero lag).`,
    String.raw`Normalized coefficient $\rho\in[-1,1]$: $+1$ identical, $0$ orthogonal, $-1$ anti-correlated.`,
    String.raw`Correlation is generally not commutative: $R_{yx}(\tau)=R_{xy}^*(-\tau)$.`
  ],
  equations: [
    { title: String.raw`Cross-correlation`, tex: String.raw`$$R_{xy}(\tau)=\int_{-\infty}^{\infty}x^*(t)\,y(t+\tau)\,dt$$`, derivation: String.raw`<p>Fix a lag $\tau$: shift $y$ left by $\tau$ so it aligns with $x$, multiply pointwise (conjugating $x$ to handle complex signals so the product measures phase agreement), and integrate to collapse the overlap into a single similarity number. Sweeping $\tau$ traces how similarity varies with offset; the argmax locates the best alignment.</p>` },
    { title: String.raw`Correlation as flipped convolution`, tex: String.raw`$$R_{xy}(\tau)=x^*(-\tau)*y(\tau)$$`, derivation: String.raw`<p>Convolution: $(g*y)(\tau)=\int g(\lambda)y(\tau-\lambda)d\lambda$. Choose $g(\lambda)=x^*(-\lambda)$: $=\int x^*(-\lambda)y(\tau-\lambda)d\lambda$. Substitute $t=-\lambda$: $=\int x^*(t)y(\tau+t)dt=R_{xy}(\tau)$. Thus correlation is convolution with one signal time-reversed and conjugated — the matched-filter identity.</p>` },
    { title: String.raw`Autocorrelation at zero lag`, tex: String.raw`$$R_{xx}(0)=\int_{-\infty}^{\infty}|x(t)|^2dt=E$$`, derivation: String.raw`<p>Put $\tau=0$ in $R_{xx}(\tau)=\int x^*(t)x(t+\tau)dt$: $R_{xx}(0)=\int x^*(t)x(t)dt=\int|x(t)|^2dt$, which is total energy (Parseval). Since $|R_{xx}(\tau)|\le R_{xx}(0)$ (Cauchy–Schwarz), the autocorrelation always peaks at zero lag.</p>` },
    { title: String.raw`Wiener–Khinchin theorem`, tex: String.raw`$$S_x(f)=\int_{-\infty}^{\infty}R_{xx}(\tau)e^{-j2\pi f\tau}d\tau$$`, derivation: String.raw`<p>For an energy signal, $R_{xx}(\tau)=x^*(-\tau)*x(\tau)$. Transforming and using the convolution theorem with $\mathcal{F}\{x^*(-\tau)\}=X^*(f)$: $\mathcal{F}\{R_{xx}\}=X^*(f)X(f)=|X(f)|^2$, the energy spectral density. Extending to power/random signals (time-averaging) gives $S_x(f)=\mathcal{F}\{R_{xx}\}$, the PSD.</p>` },
    { title: String.raw`Matched filter maximizes SNR`, tex: String.raw`$$h(t)=s^*(T-t),\qquad \mathrm{SNR}_{\max}=\frac{2E}{N_0}$$`, derivation: String.raw`<p>Output at $T$ is $y(T)=\int h(\lambda)r(T-\lambda)d\lambda$. By Cauchy–Schwarz, $|\int H(f)S(f)e^{j2\pi fT}df|^2\le \int|H|^2df\cdot\int|S|^2df$, with equality when $H(f)=k\,S^*(f)e^{-j2\pi fT}$, i.e. $h(t)=s^*(T-t)$. The resulting SNR is $\frac{|\int|S|^2df|^2}{(N_0/2)\int|S|^2df}=\frac{2}{N_0}\int|S|^2df=\frac{2E}{N_0}$, depending only on energy $E$.</p>` },
    { title: String.raw`Power from PSD`, tex: String.raw`$$P=R_{xx}(0)=\int_{-\infty}^{\infty}S_x(f)df$$`, derivation: String.raw`<p>Invert Wiener–Khinchin: $R_{xx}(\tau)=\int S_x(f)e^{j2\pi f\tau}df$. Set $\tau=0$: $R_{xx}(0)=\int S_x(f)df$. Since $R_{xx}(0)$ is the average power, total power equals the area under the PSD.</p>` },
    { title: String.raw`Order-swap relation`, tex: String.raw`$$R_{yx}(\tau)=R_{xy}^*(-\tau)$$`, derivation: String.raw`<p>$R_{yx}(\tau)=\int y^*(t)x(t+\tau)dt$. Substitute $u=t+\tau$: $=\int y^*(u-\tau)x(u)du=\left[\int x^*(u)y(u-\tau)du\right]^*=R_{xy}^*(-\tau)$. So swapping the signals reflects and conjugates the lag axis — correlation is not commutative.</p>` }
  ],
  flashcards: [
    { front: String.raw`Define cross-correlation.`, back: String.raw`$R_{xy}(\tau)=\int x^*(t)y(t+\tau)dt$ — similarity of $x$ and $y$ vs lag $\tau$.` },
    { front: String.raw`How does correlation differ from convolution?`, back: String.raw`Correlation does not flip either signal; convolution reverses one.` },
    { front: String.raw`Where does autocorrelation peak and what is its value there?`, back: String.raw`At zero lag; $R_{xx}(0)=$ energy (or power).` },
    { front: String.raw`State the Wiener–Khinchin theorem.`, back: String.raw`PSD is the Fourier Transform of autocorrelation: $S_x(f)=\mathcal{F}\{R_{xx}(\tau)\}$.` },
    { front: String.raw`What is the matched filter for template $s(t)$?`, back: String.raw`$h(t)=s^*(T-t)$; its output is the cross-correlation with $s$, maximizing SNR.` },
    { front: String.raw`Matched-filter peak SNR?`, back: String.raw`$2E/N_0$ — depends only on signal energy, not pulse shape.` },
    { front: String.raw`How is time delay estimated by correlation?`, back: String.raw`It is the lag at which the cross-correlation peaks.` },
    { front: String.raw`Autocorrelation of white noise?`, back: String.raw`$R_{xx}(\tau)\propto\delta(\tau)$ — uncorrelated except at zero lag.` },
    { front: String.raw`Is correlation commutative?`, back: String.raw`No: $R_{yx}(\tau)=R_{xy}^*(-\tau)$.` },
    { front: String.raw`What is the normalized correlation coefficient range?`, back: String.raw`$-1\le\rho\le1$: $+1$ identical, $0$ orthogonal, $-1$ anti-correlated.` },
    { front: String.raw`Autocorrelation symmetry for a real signal?`, back: String.raw`Even: $R_{xx}(-\tau)=R_{xx}(\tau)$.` },
    { front: String.raw`Autocorrelation of a periodic signal?`, back: String.raw`Also periodic with the same period — used to detect period in noise.` },
    { front: String.raw`Correlation as convolution — the identity?`, back: String.raw`$R_{xy}(\tau)=x^*(-\tau)*y(\tau)$.` },
    { front: String.raw`Total power from the PSD?`, back: String.raw`$R_{xx}(0)=\int S_x(f)df$ (area under the PSD).` }
  ],
  mcqs: [
    { q: String.raw`Correlation differs from convolution in that correlation:`, options: [String.raw`Multiplies spectra`, String.raw`Does not flip either signal`, String.raw`Is always zero`, String.raw`Adds the signals`], answer: 1, explain: String.raw`Convolution reverses one signal; correlation does not.` },
    { q: String.raw`Autocorrelation is maximum at:`, options: [String.raw`Large lag`, String.raw`Zero lag`, String.raw`Infinite lag`, String.raw`Negative lag only`], answer: 1, explain: String.raw`A signal is most similar to itself; $R_{xx}(0)\ge|R_{xx}(\tau)|$.` },
    { q: String.raw`The Wiener–Khinchin theorem relates autocorrelation to:`, options: [String.raw`The impulse response`, String.raw`The power spectral density`, String.raw`The transfer function`, String.raw`The step response`], answer: 1, explain: String.raw`$S_x(f)=\mathcal{F}\{R_{xx}(\tau)\}$.` },
    { q: String.raw`A matched filter for template $s(t)$ has impulse response:`, options: [String.raw`$s(t)$`, String.raw`$s^*(T-t)$`, String.raw`$s(t-T)$`, String.raw`$-s(t)$`], answer: 1, explain: String.raw`Time-reversed, conjugated template; output is the correlation.` },
    { q: String.raw`The matched-filter peak SNR equals:`, options: [String.raw`$E/N_0$`, String.raw`$2E/N_0$`, String.raw`$N_0/2E$`, String.raw`$E^2/N_0$`], answer: 1, explain: String.raw`$2E/N_0$, independent of pulse shape.` },
    { q: String.raw`Cross-correlation is used to estimate:`, options: [String.raw`Signal power only`, String.raw`Time delay between signals`, String.raw`The DC value`, String.raw`The sample rate`], answer: 1, explain: String.raw`The peak lag gives the delay (radar range, GPS acquisition).` },
    { q: String.raw`The autocorrelation of white noise is:`, options: [String.raw`Constant`, String.raw`A delta function at zero lag`, String.raw`A sinusoid`, String.raw`A ramp`], answer: 1, explain: String.raw`$R_{xx}(\tau)\propto\delta(\tau)$ — flat PSD.` },
    { q: String.raw`Correlation is:`, options: [String.raw`Always commutative`, String.raw`Generally not commutative`, String.raw`Never defined`, String.raw`Only for periodic signals`], answer: 1, explain: String.raw`$R_{yx}(\tau)=R_{xy}^*(-\tau)$.` },
    { q: String.raw`The normalized correlation coefficient $\rho$ ranges over:`, options: [String.raw`$[0,1]$`, String.raw`$[-1,1]$`, String.raw`$[0,\infty)$`, String.raw`$(-\infty,\infty)$`], answer: 1, explain: String.raw`$-1$ (anti) to $+1$ (identical), $0$ = orthogonal.` },
    { q: String.raw`$R_{xx}(0)$ equals:`, options: [String.raw`Zero`, String.raw`The signal energy (or power)`, String.raw`The bandwidth`, String.raw`The mean`], answer: 1, explain: String.raw`$\int|x|^2$ — energy for energy signals, power for power signals.` },
    { q: String.raw`Autocorrelation of a periodic signal is:`, options: [String.raw`A single impulse`, String.raw`Periodic with the same period`, String.raw`Always zero`, String.raw`A decaying exponential`], answer: 1, explain: String.raw`Periodicity is preserved — useful for pitch/period detection.` },
    { q: String.raw`Correlation can be implemented with a convolver by first:`, options: [String.raw`Scaling one signal`, String.raw`Time-reversing (and conjugating) one signal`, String.raw`Differentiating`, String.raw`Adding noise`], answer: 1, explain: String.raw`$R_{xy}(\tau)=x^*(-\tau)*y(\tau)$.` }
  ],
  numericals: [
    { q: String.raw`Compute the autocorrelation at zero lag of $x[n]=\{1,2,2,1\}$.`, solution: String.raw`<p><b>Formula.</b> $$R_{xx}[0]=\sum_n x[n]^2$$ where the zero-lag autocorrelation equals the signal energy (the sum of squared samples).</p>
<p><b>Substitute.</b> $$R_{xx}[0]=1^2+2^2+2^2+1^2.$$</p>
<p><b>Compute.</b> $R_{xx}[0]=1+4+4+1=10$. For comparison, lag 1 gives $R_{xx}[1]=1\cdot2+2\cdot2+2\cdot1=8<10$.</p>
<p><b>Explanation.</b> A signal is always most similar to itself, so autocorrelation peaks at zero lag, where it equals the energy. Every other lag is necessarily smaller — the Cauchy–Schwarz bound in action.</p>` },
    { q: String.raw`A radar echo is delayed relative to the transmitted pulse; cross-correlation peaks at lag $60\,\mu\text{s}$. Find the target range.`, solution: String.raw`<p><b>Formula.</b> $$R=\frac{c\,t}{2}$$ where $c=3\times10^8\text{ m/s}$ is the speed of light, $t$ the round-trip delay (the correlation peak lag), and the factor $2$ accounts for the there-and-back path.</p>
<p><b>Substitute.</b> $$R=\frac{(3\times10^8)(60\times10^{-6})}{2}.$$</p>
<p><b>Compute.</b> $R=(3\times10^8)(3\times10^{-5})=9000\text{ m}=9\text{ km}$.</p>
<p><b>Explanation.</b> Cross-correlating the echo with a copy of the transmitted pulse pinpoints the delay; converting that delay to distance (halved for the round trip) gives the range. This is the core of pulse radar and sonar.</p>` },
    { q: String.raw`A rectangular pulse of width $T$ and amplitude $A$ has what autocorrelation shape and peak value?`, solution: String.raw`<p><b>Formula.</b> $$R_{xx}(\tau)=\int x(t)x(t+\tau)\,dt,\qquad R_{xx}(0)=\int|x(t)|^2dt=E$$ where a rectangle's autocorrelation is a triangle and the zero-lag value is the energy.</p>
<p><b>Substitute.</b> For a width-$T$, amplitude-$A$ pulse: $$R_{xx}(0)=\int_0^T A^2\,dt,\qquad R_{xx}(\tau)=A^2(T-|\tau|)\;\;(|\tau|\le T).$$</p>
<p><b>Compute.</b> Peak $R_{xx}(0)=A^2T$ (the energy), falling linearly to $0$ at lag $\pm T$ — a triangle of base $2T$.</p>
<p><b>Explanation.</b> Overlap between the pulse and its shifted copy shrinks linearly as the lag grows, so the autocorrelation is triangular. Its peak, the energy $A^2T$, is the maximum possible correlation.</p>` },
    { q: String.raw`White noise has two-sided PSD $S_x(f)=N_0/2$. Find its autocorrelation.`, solution: String.raw`<p><b>Formula.</b> $$R_{xx}(\tau)=\mathcal{F}^{-1}\{S_x(f)\}$$ (inverse Wiener–Khinchin), where $S_x(f)$ is the two-sided PSD; the inverse transform of a constant is a scaled impulse.</p>
<p><b>Substitute.</b> $$R_{xx}(\tau)=\mathcal{F}^{-1}\left\{\frac{N_0}{2}\right\}.$$</p>
<p><b>Compute.</b> $R_{xx}(\tau)=\dfrac{N_0}{2}\,\delta(\tau)$ — zero for every non-zero lag.</p>
<p><b>Explanation.</b> A flat PSD means every frequency carries equal power, which in time means samples at different instants are uncorrelated. That impulsive autocorrelation is the defining signature of white noise.</p>` },
    { q: String.raw`A signal with energy $E=2\times10^{-9}\text{ J}$ passes a matched filter with $N_0=10^{-9}\text{ W/Hz}$. Find the peak output SNR (dB).`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{SNR}_{\max}=\frac{2E}{N_0},\qquad \mathrm{SNR}_{\text{dB}}=10\log_{10}(\mathrm{SNR})$$ where $E$ is the signal energy, $N_0$ the one-sided noise PSD; the matched-filter peak SNR depends only on energy, not pulse shape.</p>
<p><b>Substitute.</b> $$\mathrm{SNR}=\frac{2(2\times10^{-9}\text{ J})}{10^{-9}\text{ W/Hz}}.$$</p>
<p><b>Compute.</b> $\mathrm{SNR}=4$ (linear) $=10\log_{10}4=6.0\text{ dB}$.</p>
<p><b>Explanation.</b> The matched filter extracts the maximum possible SNR from a known pulse in white noise. Doubling the energy, or halving $N_0$, each buys $3\text{ dB}$ — which is why receivers integrate energy over the whole symbol.</p>` },
    { q: String.raw`Two zero-mean signals give $R_{xy}(0)=6$, $R_{xx}(0)=9$, $R_{yy}(0)=16$. Find the correlation coefficient $\rho_{xy}(0)$.`, solution: String.raw`<p><b>Formula.</b> $$\rho_{xy}(0)=\frac{R_{xy}(0)}{\sqrt{R_{xx}(0)\,R_{yy}(0)}},\qquad -1\le\rho\le1$$ where the denominator normalises by the geometric mean of the two signals' energies, removing any amplitude dependence.</p>
<p><b>Substitute.</b> $$\rho=\frac{6}{\sqrt{9\cdot16}}=\frac{6}{\sqrt{144}}.$$</p>
<p><b>Compute.</b> $\rho=6/12=0.5$ — a moderate positive correlation.</p>
<p><b>Explanation.</b> Normalising strips out amplitude so only shape similarity remains: $\rho=0.5$ means the signals share about half their variation. Zero-mean removal (done here) prevents a DC offset from inflating the value.</p>` }
  ],
  realWorld: String.raw`<p>Correlation drives synchronization and detection across communications and sensing. GPS and CDMA receivers correlate against PN/Gold codes to acquire and separate signals; radar and sonar correlate echoes to measure range and Doppler; digital modems correlate against known preambles/pilots for timing and frame sync; and audio systems use autocorrelation for pitch detection. The matched filter — a correlator — sets the fundamental detection limit in every digital receiver. See <a href="#pn-codes">PN codes</a>, <a href="#dsss">DSSS</a>, and <a href="#matched-filter">matched filter</a>.</p>`,
  related: ['convolution', 'matched-filter', 'psd', 'pn-codes', 'dsss']
},
{
  id: 'nyquist-sampling',
  title: 'Nyquist Sampling Theorem',
  category: 'Signals & Systems',
  tags: ['sampling', 'nyquist', 'reconstruction', 'sinc-interpolation', 'bandpass-sampling', 'adc'],
  summary: String.raw`The Nyquist theorem states that a bandlimited signal is perfectly recoverable from samples taken at more than twice its highest frequency.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-nyquist-sampling" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="52" width="78" height="42" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="47" y="70" fill="#e6edf3" text-anchor="middle">x(t)</text>
<text x="47" y="86" fill="#9aa7b5" text-anchor="middle">band B</text>
<rect x="130" y="52" width="110" height="42" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="185" y="70" fill="#e6edf3" text-anchor="middle">sample @ fs</text>
<text x="185" y="86" fill="#9aa7b5" text-anchor="middle">fs &gt; 2B</text>
<rect x="286" y="52" width="86" height="42" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="329" y="70" fill="#e6edf3" text-anchor="middle">x[n]</text>
<text x="329" y="86" fill="#9aa7b5" text-anchor="middle">samples</text>
<rect x="416" y="52" width="116" height="42" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="474" y="70" fill="#e6edf3" text-anchor="middle">sinc interp.</text>
<text x="474" y="86" fill="#9aa7b5" text-anchor="middle">ideal LPF</text>
<line x1="86" y1="73" x2="128" y2="73" stroke="#9aa7b5" marker-end="url(#arr-nyquist-sampling)"/>
<line x1="240" y1="73" x2="284" y2="73" stroke="#9aa7b5" marker-end="url(#arr-nyquist-sampling)"/>
<line x1="372" y1="73" x2="414" y2="73" stroke="#9aa7b5" marker-end="url(#arr-nyquist-sampling)"/>
<text x="474" y="128" fill="#b197fc" text-anchor="middle">&#8594; exact x(t)</text>
</svg>`,
    caption: String.raw`Sampling at fs > 2B keeps the spectral copies apart, so sinc interpolation reconstructs x(t) exactly.`
  },
  {
    title: String.raw`Spectral replication`,
    svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-nyquist-sampling" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<line x1="20" y1="110" x2="520" y2="110" stroke="#9aa7b5"/>
<polygon points="70,110 100,55 130,110" fill="#1c232e" stroke="#4dabf7"/>
<text x="100" y="128" fill="#4dabf7" text-anchor="middle">baseband</text>
<polygon points="230,110 260,70 290,110" fill="#1c232e" stroke="#63e6be"/>
<text x="260" y="128" fill="#63e6be" text-anchor="middle">image @ fs</text>
<polygon points="390,110 420,70 450,110" fill="#1c232e" stroke="#63e6be"/>
<text x="420" y="128" fill="#63e6be" text-anchor="middle">image @ 2fs</text>
<line x1="165" y1="48" x2="195" y2="48" stroke="#ffa94d"/>
<text x="180" y="42" fill="#ffa94d" text-anchor="middle">guard band</text>
<text x="180" y="105" fill="#9aa7b5" text-anchor="middle">gap</text>
<text x="270" y="20" fill="#b197fc" text-anchor="middle">Xs(f) = fs &#931;&#8342; X(f &#8722; k&#183;fs) : copies at every k&#183;fs</text>
</svg>`,
    caption: String.raw`Sampling copies the baseband spectrum to every multiple of fs; when fs &gt; 2B a guard band separates the replicas so none overlap.`
  },
  {
    title: String.raw`Complete ADC chain`,
    svg: String.raw`<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-nyquist-sampling" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="45" width="96" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="56" y="63" fill="#e6edf3" text-anchor="middle">anti-alias</text>
<text x="56" y="79" fill="#9aa7b5" text-anchor="middle">LPF (analog)</text>
<rect x="148" y="45" width="96" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="196" y="63" fill="#e6edf3" text-anchor="middle">S/H</text>
<text x="196" y="79" fill="#9aa7b5" text-anchor="middle">sample+hold</text>
<rect x="288" y="45" width="96" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="336" y="63" fill="#e6edf3" text-anchor="middle">quantize</text>
<text x="336" y="79" fill="#9aa7b5" text-anchor="middle">N-bit levels</text>
<rect x="428" y="45" width="104" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="480" y="63" fill="#e6edf3" text-anchor="middle">x[n] code</text>
<text x="480" y="79" fill="#9aa7b5" text-anchor="middle">digital out</text>
<line x1="104" y1="67" x2="146" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-nyquist-sampling)"/>
<line x1="244" y1="67" x2="286" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-nyquist-sampling)"/>
<line x1="384" y1="67" x2="426" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-nyquist-sampling)"/>
<text x="270" y="118" fill="#b197fc" text-anchor="middle">band-limit &#8594; sample &#8594; quantize : the full analog-to-digital path</text>
</svg>`,
    caption: String.raw`The full ADC chain: an analog anti-alias LPF bandlimits below fs/2, a sample-and-hold captures instants, and the quantizer maps each to an N-bit code.`
  }
  ],
  prerequisites: ['fourier-transform', 'aliasing', 'comm-basics'],
  intro: String.raw`<p>Sampling turns a continuous signal into a sequence of numbers a computer can process. The <strong>Nyquist–Shannon sampling theorem</strong> answers the crucial question: how fast must we sample to lose nothing? The answer — sample faster than twice the highest frequency — is the foundation of all digital audio, communications, and instrumentation.</p>
<p>Get it right and reconstruction is <em>exact</em>; get it wrong and high frequencies masquerade as low ones (aliasing), an error no later processing can undo. This single inequality, $f_s>2B$, governs the design of every ADC and anti-alias filter.</p>`,
  sections: [
    { h: 'Statement of the theorem', html: String.raw`<div class="callout"><strong>Nyquist–Shannon theorem:</strong> a signal $x(t)$ bandlimited to $|f|\le B$ (i.e. $X(f)=0$ for $|f|>B$) is <em>completely determined</em> by its samples $x(nT_s)$ taken at a rate</p>
<p>$$f_s=\frac{1}{T_s}>2B,$$</p>
<p>and can be reconstructed <em>exactly</em> by ideal low-pass (sinc) interpolation.</div>
<p>Two named quantities are easy to confuse:</p>
<ul>
<li><strong>Nyquist rate</strong> $=2B$: the <em>minimum sampling rate</em> for a signal of bandwidth $B$.</li>
<li><strong>Nyquist frequency</strong> $=f_s/2$: the <em>highest frequency representable</em> at a given sampling rate $f_s$ (also called the folding frequency).</li>
</ul>
<p>To capture without loss, the signal's highest frequency must stay below the Nyquist frequency: $B<f_s/2$.</p>` },
    { h: 'Sampling in the frequency domain', html: String.raw`<p>Ideal sampling multiplies $x(t)$ by an impulse train $\sum_n\delta(t-nT_s)$. Since multiplication in time is convolution in frequency, and the impulse train transforms to another impulse train of spacing $f_s$, the sampled spectrum is</p>
<p>$$X_s(f)=f_s\sum_{k=-\infty}^{\infty}X(f-kf_s).$$</p>
<p>Sampling <strong>replicates</strong> the baseband spectrum at every multiple of $f_s$ (spectral images). If $f_s>2B$ the copies do not overlap and a low-pass filter can isolate the original. If $f_s<2B$ the copies overlap — <strong>aliasing</strong> — and the original is corrupted beyond recovery. This picture <em>is</em> the sampling theorem.</p>` },
    { h: 'Ideal reconstruction (sinc interpolation)', html: String.raw`<p>To recover $x(t)$, pass the samples through an ideal low-pass filter of cutoff $f_s/2$. Its impulse response is a sinc, so reconstruction is a sum of shifted, scaled sincs:</p>
<p>$$x(t)=\sum_{n=-\infty}^{\infty}x(nT_s)\,\mathrm{sinc}\!\left(\frac{t-nT_s}{T_s}\right),\qquad \mathrm{sinc}(u)=\frac{\sin(\pi u)}{\pi u}.$$</p>
<p>Each sinc is $1$ at its own sample instant and $0$ at every <em>other</em> sample instant, so the interpolation passes exactly through the samples yet fills the gaps with the unique bandlimited curve. The ideal sinc is infinitely long and non-causal, so practical DACs approximate it (zero-order hold + reconstruction filter, or oversampling + digital interpolation).</p>` },
    { h: 'Why exactly $2B$', html: String.raw`<p>The factor of two comes from needing at least two samples per cycle of the highest-frequency component to capture both its amplitude and phase. A sinusoid at exactly $f_s/2$ sampled at $f_s$ hits two points per cycle, but if those land on the zero crossings the sinusoid vanishes — hence the <em>strict</em> inequality $f_s>2B$, not $\ge$. Equivalently, in the frequency picture, the images just touch at $f_s=2B$ and overlap for anything less.</p>` },
    { h: 'Bandpass sampling', html: String.raw`<p>A signal confined to a <em>band</em> $[f_L,f_H]$ of width $B=f_H-f_L$ but centred at a high carrier need not be sampled at $2f_H$. Because sampling folds spectra, a rate as low as $\approx2B$ can suffice if chosen so the images land in unused spectral gaps. The allowable rates satisfy</p>
<p>$$\frac{2f_H}{n}\le f_s\le\frac{2f_L}{n-1},\qquad n=1,2,\dots,\left\lfloor\frac{f_H}{B}\right\rfloor.$$</p>
<p>This <strong>bandpass (sub-Nyquist) sampling</strong> lets an SDR digitize a $10\text{ MHz}$-wide signal at a $70\text{ MHz}$ carrier with a $\sim25\text{ MHz}$ ADC instead of $140\text{ MHz}$ — deliberately using aliasing to downconvert. The band must be well-defined by a bandpass filter first.</p>` },
    { h: 'Anti-alias filtering and oversampling', html: String.raw`<p>Real signals are rarely perfectly bandlimited, so an <strong>anti-alias filter</strong> (analog low-pass before the ADC) must attenuate everything above $f_s/2$. Since ideal brick-wall filters do not exist, engineers <strong>oversample</strong> — run $f_s$ well above $2B$ — to leave a transition band the filter can roll off in, then decimate digitally. Oversampling also spreads quantization noise over a wider band, improving in-band SNR (the basis of sigma-delta ADCs). See <a href="#adc">ADC</a>.</p>` },
    { h: 'Common pitfalls', html: String.raw`<div class="callout"><strong>Watch out:</strong>
<ul>
<li><strong>Rate vs frequency:</strong> Nyquist <em>rate</em> is $2B$ (a sampling speed); Nyquist <em>frequency</em> is $f_s/2$ (a signal-frequency ceiling). Do not swap them.</li>
<li><strong>Strict inequality:</strong> sampling <em>at</em> exactly $2B$ can fail (phase-dependent nulls); design margin above.</li>
<li><strong>Bandwidth $B$ is the highest frequency</strong> for a baseband signal, but the <em>band width</em> for a bandpass signal — the theorem uses whichever is relevant.</li>
<li><strong>No cure after the fact:</strong> aliasing must be prevented by the anti-alias filter; once folded, frequencies are irreversibly mixed.</li>
<li><strong>Reconstruction filter</strong> is as important as the anti-alias filter — a poor DAC filter lets images through.</li>
</ul></div>` },
    { h: 'What you should now understand', html: String.raw`<ul>
<li><strong>The theorem:</strong> a signal bandlimited to $B$ is perfectly recoverable from samples if $f_s>2B$ — lose nothing, provided you sample fast enough.</li>
<li><strong>Two "Nyquists":</strong> the Nyquist <em>rate</em> $2B$ is a minimum sampling speed; the Nyquist <em>frequency</em> $f_s/2$ is the highest frequency a given rate can represent.</li>
<li><strong>Why it works (frequency view):</strong> sampling replicates the spectrum every $f_s$; if $f_s>2B$ the copies stay apart and a low-pass filter isolates the original.</li>
<li><strong>Perfect reconstruction:</strong> ideal recovery is sinc interpolation — each sinc is 1 at its sample and 0 at all others, so it threads exactly through the samples.</li>
<li><strong>Why strictly greater:</strong> two samples per cycle are needed to fix amplitude and phase; at exactly $2B$ a sinusoid can vanish on its zero crossings.</li>
<li><strong>Practice:</strong> oversample to relax the anti-alias filter, use bandpass sampling to digitize high-carrier bands near $2B$, and remember aliasing is irreversible — prevent it before the ADC.</li>
</ul>` }
  ],
  keyPoints: [
    String.raw`Sampling theorem: bandlimited to $B$ $\Rightarrow$ sample at $f_s>2B$ for lossless capture.`,
    String.raw`Nyquist rate $=2B$ (minimum sample rate); Nyquist frequency $=f_s/2$ (max representable frequency).`,
    String.raw`Sampling replicates the spectrum every $f_s$: $X_s(f)=f_s\sum_k X(f-kf_s)$.`,
    String.raw`If $f_s>2B$ images don't overlap and a low-pass recovers the signal; if $f_s<2B$ aliasing corrupts it.`,
    String.raw`Ideal reconstruction is sinc interpolation: $x(t)=\sum_n x(nT_s)\,\mathrm{sinc}((t-nT_s)/T_s)$.`,
    String.raw`Each reconstruction sinc is 1 at its sample and 0 at all others, so it passes through the samples.`,
    String.raw`The factor 2 = two samples per cycle needed to fix amplitude and phase.`,
    String.raw`Inequality is strict ($>$): sampling exactly at $2B$ can null out a sinusoid.`,
    String.raw`Bandpass sampling: a band of width $B$ can be sampled near $2B$, not $2f_H$, using controlled aliasing.`,
    String.raw`Anti-alias filter (analog LPF) must precede the ADC; oversampling eases its roll-off.`,
    String.raw`Aliasing is irreversible — prevent it, you cannot fix it later.`,
    String.raw`The ideal reconstruction filter is non-causal (infinite sinc); real DACs approximate it.`
  ],
  equations: [
    { title: String.raw`Sampling condition`, tex: String.raw`$$f_s>2B$$`, derivation: String.raw`<p>Sampled spectrum $X_s(f)=f_s\sum_k X(f-kf_s)$ places a copy of the baseband spectrum (occupying $[-B,B]$) at each $kf_s$. The $k=0$ copy ends at $+B$; the $k=1$ copy begins at $f_s-B$. They avoid overlap only if $f_s-B>B$, i.e. $f_s>2B$. Below this the copies collide and aliasing occurs.</p>` },
    { title: String.raw`Sampled spectrum (impulse-train sampling)`, tex: String.raw`$$X_s(f)=f_s\sum_{k=-\infty}^{\infty}X(f-kf_s)$$`, derivation: String.raw`<p>Sampling is $x_s(t)=x(t)\sum_n\delta(t-nT_s)$. The Dirac comb transforms to $\frac{1}{T_s}\sum_k\delta(f-kf_s)=f_s\sum_k\delta(f-kf_s)$. Multiplication in time is convolution in frequency: $X_s(f)=X(f)*f_s\sum_k\delta(f-kf_s)=f_s\sum_k X(f-kf_s)$. Convolving with a shifted delta shifts $X$, giving the spectral replicas.</p>` },
    { title: String.raw`Sinc reconstruction`, tex: String.raw`$$x(t)=\sum_n x(nT_s)\,\mathrm{sinc}\!\left(\tfrac{t-nT_s}{T_s}\right)$$`, derivation: String.raw`<p>Recover by low-pass filtering $x_s(t)$ with cutoff $f_s/2$ and gain $T_s$. The ideal LPF has impulse response $h(t)=\mathrm{sinc}(t/T_s)$. Since $x_s$ is a train of weighted impulses $x(nT_s)\delta(t-nT_s)$, convolving with $h$ replaces each impulse by a shifted sinc: $x(t)=\sum_n x(nT_s)h(t-nT_s)=\sum_n x(nT_s)\mathrm{sinc}((t-nT_s)/T_s)$.</p>` },
    { title: String.raw`Nyquist frequency`, tex: String.raw`$$f_N=\frac{f_s}{2}$$`, derivation: String.raw`<p>The spectral replicas are centred every $f_s$, so the baseband copy owns the interval $[-f_s/2,+f_s/2]$ before it meets its neighbour. The boundary $f_s/2$ is the highest frequency that can be represented without folding — the Nyquist (folding) frequency. Any input above it maps back into this interval.</p>` },
    { title: String.raw`Bandpass sampling bound`, tex: String.raw`$$\frac{2f_H}{n}\le f_s\le\frac{2f_L}{n-1}$$`, derivation: String.raw`<p>For a band $[f_L,f_H]$, choosing integer $n$ folds the $n$-th image down to baseband without overlap. The lower limit prevents the upper edge $f_H$'s image from overrunning; the upper limit keeps the lower edge $f_L$'s image from colliding with the previous replica. Feasible $n$ run up to $\lfloor f_H/B\rfloor$; the smallest usable $f_s$ approaches $2B$.</p>` },
    { title: String.raw`Two-samples-per-cycle criterion`, tex: String.raw`$$T_s<\frac{1}{2B}\;\Leftrightarrow\;f_s>2B$$`, derivation: String.raw`<p>A sinusoid $\cos(2\pi B t+\phi)$ has period $1/B$. To resolve both its unknown amplitude and phase you need at least two independent samples per period: $T_s<\frac{1/B}{2}=\frac{1}{2B}$, i.e. $f_s>2B$. One sample per cycle is ambiguous (a sinusoid and a constant can fit the same points).</p>` }
  ],
  flashcards: [
    { front: String.raw`State the Nyquist sampling theorem.`, back: String.raw`A signal bandlimited to $B$ is perfectly recoverable if sampled at $f_s>2B$.` },
    { front: String.raw`Nyquist rate vs Nyquist frequency?`, back: String.raw`Rate $=2B$ (min sample rate); frequency $=f_s/2$ (max representable frequency).` },
    { front: String.raw`What happens to the spectrum when you sample?`, back: String.raw`It is replicated every $f_s$: $X_s(f)=f_s\sum_k X(f-kf_s)$.` },
    { front: String.raw`How is a signal ideally reconstructed from samples?`, back: String.raw`Sinc interpolation: $x(t)=\sum_n x(nT_s)\mathrm{sinc}((t-nT_s)/T_s)$.` },
    { front: String.raw`Why the factor of 2 in $2B$?`, back: String.raw`Need at least two samples per cycle to fix amplitude and phase.` },
    { front: String.raw`Why is the inequality strict ($f_s>2B$)?`, back: String.raw`At exactly $2B$ a sinusoid can land on its zero crossings and disappear.` },
    { front: String.raw`What is an anti-alias filter?`, back: String.raw`An analog low-pass before the ADC that removes energy above $f_s/2$.` },
    { front: String.raw`Can aliasing be removed after sampling?`, back: String.raw`No — it must be prevented; folded frequencies are irreversibly mixed.` },
    { front: String.raw`What is bandpass sampling?`, back: String.raw`Sampling a band of width $B$ near $2B$ (not $2f_H$) using controlled aliasing to downconvert.` },
    { front: String.raw`Property that makes sinc interpolation pass through samples?`, back: String.raw`Each sinc is 1 at its own sample instant and 0 at all others.` },
    { front: String.raw`Why is the ideal reconstruction filter impractical?`, back: String.raw`Its sinc impulse response is infinitely long and non-causal.` },
    { front: String.raw`What does oversampling buy you?`, back: String.raw`A relaxed anti-alias filter transition band and lower in-band quantization noise.` },
    { front: String.raw`CD audio uses $f_s=44.1\text{ kHz}$ — why?`, back: String.raw`To capture the $\sim20\text{ kHz}$ audible band ($2\times20=40\text{ kHz}$) with margin for the anti-alias filter.` },
    { front: String.raw`Highest frequency capturable at $f_s=1\text{ MHz}$?`, back: String.raw`Just under the Nyquist frequency $f_s/2=500\text{ kHz}$.` }
  ],
  mcqs: [
    { q: String.raw`To sample a signal bandlimited to $B$ without loss, the sample rate must satisfy:`, options: [String.raw`$f_s>B$`, String.raw`$f_s>2B$`, String.raw`$f_s>B/2$`, String.raw`$f_s>4B$`], answer: 1, explain: String.raw`The Nyquist criterion: $f_s>2B$.` },
    { q: String.raw`The Nyquist frequency is:`, options: [String.raw`$2B$`, String.raw`$f_s/2$`, String.raw`$f_s$`, String.raw`$B$`], answer: 1, explain: String.raw`$f_s/2$ is the highest representable frequency (folding frequency).` },
    { q: String.raw`Sampling replicates the spectrum at intervals of:`, options: [String.raw`$B$`, String.raw`$f_s/2$`, String.raw`$f_s$`, String.raw`$2f_s$`], answer: 2, explain: String.raw`$X_s(f)=f_s\sum_k X(f-kf_s)$ — copies every $f_s$.` },
    { q: String.raw`Ideal reconstruction from samples uses:`, options: [String.raw`Linear interpolation`, String.raw`Sinc interpolation`, String.raw`Zero-order hold`, String.raw`Nearest neighbour`], answer: 1, explain: String.raw`A sum of shifted sincs from the ideal low-pass filter.` },
    { q: String.raw`The Nyquist rate for a $4\text{ kHz}$ bandlimited signal is:`, options: [String.raw`$2\text{ kHz}$`, String.raw`$4\text{ kHz}$`, String.raw`$8\text{ kHz}$`, String.raw`$16\text{ kHz}$`], answer: 2, explain: String.raw`$2B=2\times4=8\text{ kHz}$.` },
    { q: String.raw`An anti-alias filter is placed:`, options: [String.raw`After the ADC`, String.raw`Before the ADC (analog)`, String.raw`In the DAC only`, String.raw`Nowhere needed`], answer: 1, explain: String.raw`It must remove above-Nyquist energy before sampling.` },
    { q: String.raw`Aliasing, once it has occurred in the samples, can be:`, options: [String.raw`Removed by a digital filter`, String.raw`Removed by resampling`, String.raw`Not removed — it is irreversible`, String.raw`Removed by averaging`], answer: 2, explain: String.raw`Overlapped frequencies are permanently mixed.` },
    { q: String.raw`Bandpass sampling lets you sample a narrow band at a carrier using a rate near:`, options: [String.raw`$2f_H$`, String.raw`$2B$ (the bandwidth)`, String.raw`$f_H/2$`, String.raw`$f_L$`], answer: 1, explain: String.raw`Controlled aliasing folds the band down; $f_s\approx2B$ can suffice.` },
    { q: String.raw`The sampling inequality is strict ($>$ not $\ge$) because:`, options: [String.raw`Filters are imperfect`, String.raw`A sinusoid at $f_s/2$ can be nulled by sampling on its zero crossings`, String.raw`Quantization adds noise`, String.raw`Of jitter`], answer: 1, explain: String.raw`Phase-dependent loss at exactly $2B$.` },
    { q: String.raw`CD audio samples at $44.1\text{ kHz}$ mainly to:`, options: [String.raw`Reduce file size`, String.raw`Capture $\sim20\text{ kHz}$ audio with anti-alias margin`, String.raw`Match video rates`, String.raw`Increase dynamic range`], answer: 1, explain: String.raw`$2\times20=40\text{ kHz}$ plus transition-band margin.` },
    { q: String.raw`Each sinc in the reconstruction is zero at:`, options: [String.raw`Its own sample instant`, String.raw`All other sample instants`, String.raw`No points`, String.raw`Every point`], answer: 1, explain: String.raw`Value 1 at its sample, 0 at all others — so interpolation passes through samples.` },
    { q: String.raw`Oversampling primarily helps by:`, options: [String.raw`Removing the need for any filter`, String.raw`Relaxing the anti-alias filter and lowering in-band quantization noise`, String.raw`Eliminating aliasing entirely for any signal`, String.raw`Increasing bandwidth of the signal`], answer: 1, explain: String.raw`More room for filter roll-off; noise spread over a wider band.` }
  ],
  numericals: [
    { q: String.raw`A signal has components up to $15\text{ kHz}$. Find the Nyquist rate and a practical sample rate with 25% margin.`, solution: String.raw`<p><b>Formula.</b> $$f_{\text{Nyq}}=2B,\qquad f_s=1.25\times f_{\text{Nyq}}$$ where $B$ is the highest signal frequency, $f_{\text{Nyq}}$ the minimum (Nyquist) rate, and the $1.25$ factor adds 25% guard-band margin.</p>
<p><b>Substitute.</b> $$f_{\text{Nyq}}=2\times15\text{ kHz},\qquad f_s=1.25\times30\text{ kHz}.$$</p>
<p><b>Compute.</b> $f_{\text{Nyq}}=30\text{ kHz}$; $f_s\approx37.5\text{ kHz}$ — round up to a standard rate such as $44.1$ or $48\text{ kHz}$.</p>
<p><b>Explanation.</b> The extra margin leaves a transition band for a real (non-brick-wall) anti-alias filter to roll off in before $f_s/2$. Standard audio rates already build in this headroom above the $\sim20\text{ kHz}$ audible band.</p>` },
    { q: String.raw`A system samples at $f_s=10\text{ kHz}$. What is the highest input frequency it can represent, and what happens to a $7\text{ kHz}$ tone?`, solution: String.raw`<p><b>Formula.</b> $$f_{\text{Nyq}}=\frac{f_s}{2},\qquad f_{\text{alias}}=|f_{in}-k f_s|$$ where $f_{\text{Nyq}}$ is the highest representable frequency and any tone above it folds to an alias in $[0,f_s/2]$.</p>
<p><b>Substitute.</b> $$f_{\text{Nyq}}=\frac{10\text{ kHz}}{2};\qquad f_{\text{alias}}=|7-10|\text{ kHz}.$$</p>
<p><b>Compute.</b> $f_{\text{Nyq}}=5\text{ kHz}$; the $7\text{ kHz}$ tone exceeds it and aliases to $3\text{ kHz}$. Capturing $7\text{ kHz}$ cleanly needs $f_s>14\text{ kHz}$.</p>
<p><b>Explanation.</b> Anything above $f_s/2$ is irreversibly folded down, so a $7\text{ kHz}$ input masquerades as $3\text{ kHz}$. This is why an anti-alias filter must remove content above the Nyquist frequency before sampling.</p>` },
    { q: String.raw`A bandpass signal spans $[70,80]\text{ MHz}$ ($B=10\text{ MHz}$). Find a valid bandpass sampling rate.`, solution: String.raw`<p><b>Formula.</b> $$\frac{2f_H}{n}\le f_s\le\frac{2f_L}{n-1},\qquad n\le\left\lfloor\frac{f_H}{B}\right\rfloor$$ where $[f_L,f_H]$ is the band, $B=f_H-f_L$, and integer $n$ selects which image folds to baseband.</p>
<p><b>Substitute.</b> $f_H=80$, $f_L=70$, $B=10\text{ MHz}$. Try $n=\lfloor80/10\rfloor=8$: $$\frac{2\cdot80}{8}\le f_s\le\frac{2\cdot70}{7}.$$</p>
<p><b>Compute.</b> Both bounds equal $20\text{ MHz}$, so $f_s=20\text{ MHz}$ works (exactly $2B$) and folds the band cleanly to baseband.</p>
<p><b>Explanation.</b> A naive $2f_H$ rate would demand $160\text{ MHz}$; bandpass sampling exploits controlled aliasing to digitize the same band with an $8\times$ slower ADC — provided a bandpass filter first isolates the wanted band.</p>` },
    { q: String.raw`How many samples describe a $2\text{ ms}$ segment of a signal sampled at $48\text{ kHz}$?`, solution: String.raw`<p><b>Formula.</b> $$N=f_s\,t,\qquad T_s=\frac{1}{f_s}$$ where $f_s$ is the sample rate, $t$ the segment duration, $N$ the sample count, and $T_s$ the spacing between samples.</p>
<p><b>Substitute.</b> $$N=48000\text{ Hz}\times0.002\text{ s},\qquad T_s=\frac{1}{48000\text{ Hz}}.$$</p>
<p><b>Compute.</b> $N=96$ samples; $T_s\approx20.8\,\mu\text{s}$.</p>
<p><b>Explanation.</b> Sample count scales with both rate and duration — a faster clock or a longer window yields more points. The $20.8\,\mu\text{s}$ spacing is simply the reciprocal of the $48\text{ kHz}$ rate.</p>` },
    { q: String.raw`A $3\text{ kHz}$ sinusoid is sampled at exactly $6\text{ kHz}$. Why is this risky?`, solution: String.raw`<p><b>Formula.</b> $$f_s>2B\quad(\text{strict})$$ where $B$ is the highest frequency; sampling exactly at $2B$ can null a sinusoid, so the inequality must be strict.</p>
<p><b>Substitute.</b> $$f_s=6\text{ kHz},\qquad 2B=2\times3=6\text{ kHz}\;\Rightarrow\;f_s=2B\text{ exactly}.$$</p>
<p><b>Compute.</b> With $f_s=2B$ the two samples per cycle can land on the sinusoid's zero crossings (phase $=0$), making every sample $0$ and losing the tone. A slightly higher rate (e.g. $6.5\text{ kHz}$) removes the ambiguity.</p>
<p><b>Explanation.</b> At exactly two samples per period the result depends on phase — a worst-case alignment erases the signal. The strict inequality guarantees the amplitude and phase are always captured, which is why real designs sample above $2B$.</p>` },
    { q: String.raw`An ADC oversamples an audio band ($B=20\text{ kHz}$) at $f_s=192\text{ kHz}$. What is the oversampling ratio, and how much transition band does the anti-alias filter get?`, solution: String.raw`<p><b>Formula.</b> $$\text{OSR}=\frac{f_s}{2B},\qquad \Delta f_{\text{trans}}=\frac{f_s}{2}-B$$ where OSR is the oversampling ratio and $\Delta f_{\text{trans}}$ is the transition band the anti-alias filter gets between passband edge $B$ and Nyquist $f_s/2$.</p>
<p><b>Substitute.</b> $$\text{OSR}=\frac{192}{2\times20},\qquad \Delta f_{\text{trans}}=\frac{192}{2}-20\text{ kHz}.$$</p>
<p><b>Compute.</b> OSR $=192/40=4.8$; $\Delta f_{\text{trans}}=96-20=76\text{ kHz}$.</p>
<p><b>Explanation.</b> A $76\text{ kHz}$ transition band is trivially easy for a gentle analog filter, versus the $\sim2\text{ kHz}$ a $44.1\text{ kHz}$ rate would allow. Oversampling also spreads quantization noise over a wider band, improving in-band SNR — the basis of sigma-delta ADCs.</p>` }
  ],
  realWorld: String.raw`<p>The sampling theorem sets the clock rate of every ADC and DAC. Telephone audio samples voice at $8\text{ kHz}$ (band $\le4\text{ kHz}$); CD audio at $44.1\text{ kHz}$; professional audio at $48$/$96/192\text{ kHz}$; SDR front-ends at tens or hundreds of MHz, often using bandpass sampling to digitize an IF directly. Choosing $f_s$ and the anti-alias filter is the first and most consequential decision in any digital signal chain. See <a href="#adc">ADC</a> and <a href="#aliasing">aliasing</a>.</p>`,
  related: ['aliasing', 'fourier-transform', 'adc', 'z-transform', 'dac']
},
{
  id: 'aliasing',
  title: 'Aliasing',
  category: 'Signals & Systems',
  tags: ['aliasing', 'folding', 'undersampling', 'anti-alias', 'wagon-wheel', 'sampling'],
  summary: String.raw`Aliasing is the irreversible mixing that occurs when a signal is sampled too slowly, causing frequencies above the Nyquist limit to masquerade as lower ones.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-aliasing" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="12" y="52" width="120" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="72" y="70" fill="#e6edf3" text-anchor="middle">high-f tone</text>
<text x="72" y="86" fill="#9aa7b5" text-anchor="middle">f_in &gt; fs/2</text>
<rect x="196" y="46" width="148" height="56" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="270" y="69" fill="#e6edf3" text-anchor="middle">under-sampler fs</text>
<text x="270" y="90" fill="#9aa7b5" text-anchor="middle">fold about fs/2</text>
<rect x="408" y="52" width="120" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="468" y="70" fill="#e6edf3" text-anchor="middle">low-f alias</text>
<text x="468" y="86" fill="#9aa7b5" text-anchor="middle">|f_in &#8722; k&#183;fs|</text>
<line x1="132" y1="74" x2="194" y2="74" stroke="#9aa7b5" marker-end="url(#arr-aliasing)"/>
<line x1="344" y1="74" x2="406" y2="74" stroke="#9aa7b5" marker-end="url(#arr-aliasing)"/>
<text x="270" y="132" fill="#b197fc" text-anchor="middle">irreversible: the alias is indistinguishable from a real low-f tone</text>
</svg>`,
    caption: String.raw`An under-sampler folds a tone above fs/2 down to a lower alias frequency that can never be separated afterward.`
  },
  {
    title: String.raw`Anti-alias defence chain`,
    svg: String.raw`<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-aliasing" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="45" width="110" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="63" y="63" fill="#e6edf3" text-anchor="middle">wideband in</text>
<text x="63" y="79" fill="#9aa7b5" text-anchor="middle">signal+junk</text>
<rect x="158" y="45" width="120" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="218" y="63" fill="#e6edf3" text-anchor="middle">anti-alias LPF</text>
<text x="218" y="79" fill="#9aa7b5" text-anchor="middle">cut above fs/2</text>
<rect x="318" y="45" width="96" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="366" y="63" fill="#e6edf3" text-anchor="middle">sample fs</text>
<text x="366" y="79" fill="#9aa7b5" text-anchor="middle">ADC</text>
<rect x="454" y="45" width="78" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="493" y="63" fill="#e6edf3" text-anchor="middle">clean x[n]</text>
<text x="493" y="79" fill="#9aa7b5" text-anchor="middle">no fold-in</text>
<line x1="118" y1="67" x2="156" y2="67" stroke="#9aa7b5" marker-end="url(#arr2-aliasing)"/>
<line x1="278" y1="67" x2="316" y2="67" stroke="#9aa7b5" marker-end="url(#arr2-aliasing)"/>
<line x1="414" y1="67" x2="452" y2="67" stroke="#9aa7b5" marker-end="url(#arr2-aliasing)"/>
<text x="270" y="118" fill="#b197fc" text-anchor="middle">filter BEFORE sampling: strip above-Nyquist energy so nothing folds in</text>
</svg>`,
    caption: String.raw`Defence: an analog anti-alias low-pass filter removes energy above fs/2 before the ADC, so no out-of-band component can fold into the digital signal.`
  },
  {
    title: String.raw`Deliberate undersampling`,
    svg: String.raw`<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-aliasing" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="45" width="120" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="68" y="63" fill="#e6edf3" text-anchor="middle">bandpass sig</text>
<text x="68" y="79" fill="#9aa7b5" text-anchor="middle">[fL,fH] @ IF</text>
<rect x="168" y="45" width="120" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="228" y="63" fill="#e6edf3" text-anchor="middle">bandpass filter</text>
<text x="228" y="79" fill="#9aa7b5" text-anchor="middle">isolate band B</text>
<rect x="328" y="45" width="110" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="383" y="63" fill="#e6edf3" text-anchor="middle">sample fs&#8776;2B</text>
<text x="383" y="79" fill="#9aa7b5" text-anchor="middle">under-Nyquist</text>
<rect x="470" y="45" width="62" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="501" y="63" fill="#e6edf3" text-anchor="middle">baseband</text>
<text x="501" y="79" fill="#9aa7b5" text-anchor="middle">alias down</text>
<line x1="128" y1="67" x2="166" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-aliasing)"/>
<line x1="288" y1="67" x2="326" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-aliasing)"/>
<line x1="438" y1="67" x2="468" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-aliasing)"/>
<text x="270" y="118" fill="#b197fc" text-anchor="middle">aliasing used on purpose: fold a pre-filtered IF band down to baseband</text>
</svg>`,
    caption: String.raw`Bandpass (deliberate-alias) sampling: pre-filter a band of width B, then sample near 2B so the wanted band folds cleanly down to baseband — aliasing as a downconverter.`
  }
  ],
  prerequisites: ['nyquist-sampling', 'fourier-transform'],
  intro: String.raw`<p>Aliasing is the dark side of sampling. When a signal contains frequencies above the Nyquist frequency $f_s/2$, those components do not simply disappear — they <em>fold</em> back and impersonate lower frequencies, corrupting the samples permanently. The name comes from the fact that a high frequency acquires a false "alias" identity at a lower frequency.</p>
<p>Understanding exactly which frequency a given input aliases to, and how to prevent it, is essential for anyone designing a sampled system. Unlike most errors, aliasing cannot be undone after sampling — so it must be stopped before the ADC.</p>`,
  sections: [
    { h: 'What aliasing is', html: String.raw`<p>Sampling replicates a signal's spectrum at every multiple of $f_s$. If the original spectrum extends beyond $f_s/2$, the replicas <strong>overlap</strong> the baseband copy. In the overlap region you can no longer tell which frequencies were real and which are spectral images — they add together. After reconstruction, a high-frequency input emerges as a spurious low-frequency tone that was never present. Two different continuous signals can produce <em>identical</em> samples; this ambiguity is aliasing.</p>
<p>The classic demonstration: sample $\cos(2\pi f_0 t)$ and $\cos(2\pi(f_0+f_s)t)$ — at the sample instants $t=nT_s$ they give exactly the same numbers, because $\cos(2\pi(f_0+f_s)nT_s)=\cos(2\pi f_0 nT_s+2\pi n)=\cos(2\pi f_0 nT_s)$. The higher tone is indistinguishable from the lower.</p>` },
    { h: 'Folding: how high frequencies map to low', html: String.raw`<p>Think of the frequency axis as folded like an accordion at every multiple of $f_s/2$. Any input frequency $f_{in}$ maps to an <strong>apparent (alias) frequency</strong> in $[0,f_s/2]$ given by</p>
<p>$$f_{alias}=\left|f_{in}-f_s\cdot\mathrm{round}\!\left(\frac{f_{in}}{f_s}\right)\right|.$$</p>
<p>Equivalently, repeatedly reflect $f_{in}$ about $0$ and $f_s/2$ until it lands in the first Nyquist zone. The Nyquist frequency $f_s/2$ is the <strong>folding frequency</strong> — the crease of the fold. Frequencies just above it come back down just below it; a frequency at $f_s$ aliases to DC (0 Hz).</p>` },
    { h: 'Nyquist zones', html: String.raw`<p>The frequency axis divides into <strong>Nyquist zones</strong>, each $f_s/2$ wide:</p>
<table class="data">
<tr><th>Zone</th><th>Range</th><th>Folds to baseband as</th></tr>
<tr><td>1st</td><td>$0$ to $f_s/2$</td><td>itself (no folding)</td></tr>
<tr><td>2nd</td><td>$f_s/2$ to $f_s$</td><td>$f_s-f_{in}$ (reversed)</td></tr>
<tr><td>3rd</td><td>$f_s$ to $3f_s/2$</td><td>$f_{in}-f_s$ (upright)</td></tr>
<tr><td>4th</td><td>$3f_s/2$ to $2f_s$</td><td>$2f_s-f_{in}$ (reversed)</td></tr>
</table>
<p>Odd zones map upright, even zones map reversed (spectrally flipped). Bandpass sampling exploits this deliberately by placing the wanted signal in a chosen higher zone and letting it fold cleanly to baseband.</p>` },
    { h: 'Anti-alias filtering', html: String.raw`<p>The cure is prevention: an analog <strong>anti-alias low-pass filter</strong> before the ADC removes all energy above $f_s/2$ so nothing can fold. Because ideal brick-wall filters are impossible, you either (a) leave a guard band by sampling above $2B$ (oversampling) so the filter's gradual roll-off is complete before $f_s/2$, or (b) use a steep (high-order) filter. Sigma-delta ADCs oversample heavily so a gentle analog filter plus sharp digital decimation filter does the job.</p>
<div class="callout"><strong>Golden rule:</strong> filter <em>before</em> you sample. No amount of digital processing after the ADC can separate an alias from a genuine low-frequency component — they are numerically identical.</div>` },
    { h: 'The wagon-wheel effect', html: String.raw`<p>The most familiar everyday alias is the <strong>wagon-wheel (stroboscopic) effect</strong>: on film or under strobe lighting, a rotating wheel appears to slow, stop, or spin backward. The camera samples the scene at, say, $24$ or $30\text{ frames/s}$; if the wheel's spoke frequency exceeds half the frame rate, the sampled positions alias to a low or negative apparent rotation. Helicopter rotors and car rims filmed on video show the same illusion. It is temporal aliasing of a spatial pattern.</p>` },
    { h: 'The alias-frequency formula in practice', html: String.raw`<p>To find where a tone lands, reduce modulo $f_s$ then fold about $f_s/2$:</p>
<ol>
<li>Compute $f_{mod}=f_{in}\bmod f_s$ (remainder in $[0,f_s)$).</li>
<li>If $f_{mod}\le f_s/2$, the alias is $f_{mod}$.</li>
<li>If $f_{mod}>f_s/2$, the alias is $f_s-f_{mod}$.</li>
</ol>
<p>Example: $f_{in}=1300\text{ Hz}$, $f_s=1000\text{ Hz}$. $f_{mod}=300\text{ Hz}\le500$, so alias $=300\text{ Hz}$. Example: $f_{in}=700\text{ Hz}$, $f_s=1000$. $f_{mod}=700>500$, so alias $=1000-700=300\text{ Hz}$. Both a $700$ and a $1300\text{ Hz}$ tone appear at $300\text{ Hz}$ — indistinguishable.</p>` },
    { h: 'Common pitfalls', html: String.raw`<div class="callout"><strong>Watch out:</strong>
<ul>
<li><strong>Digital resampling/decimation</strong> aliases too: down-sampling by $M$ needs a digital anti-alias (decimation) filter first, exactly like the analog case.</li>
<li><strong>Imaging</strong> is the DAC dual: a DAC without a reconstruction (anti-imaging) filter emits spectral images above $f_s/2$.</li>
<li><strong>Harmonics of an in-band tone</strong> can exceed $f_s/2$ and alias back in-band, faking distortion products (watch for this in ADC testing).</li>
<li><strong>Undersampling on purpose</strong> (bandpass sampling) is fine <em>only</em> if the band is pre-filtered; stray out-of-band signals will alias onto it.</li>
<li><strong>Jitter</strong> and wideband noise fold into the band just like signals — clean, bandlimited inputs matter.</li>
</ul></div>` },
    { h: 'What you should now understand', html: String.raw`<ul>
<li><strong>What it is:</strong> frequencies above $f_s/2$ fold back and impersonate lower ones; it happens whenever $f_s<2B$ and is irreversible.</li>
<li><strong>The folding picture:</strong> the frequency axis creases like an accordion at every multiple of $f_s/2$; tones separated by $kf_s$ produce identical samples.</li>
<li><strong>Finding the alias:</strong> take $f_{in}\bmod f_s$, then fold about $f_s/2$; odd Nyquist zones map upright, even zones map spectrally reversed.</li>
<li><strong>The cure is prevention:</strong> an analog anti-alias low-pass filter <em>before</em> the ADC removes above-Nyquist energy — no post-processing can undo a fold.</li>
<li><strong>Everyday and digital forms:</strong> the wagon-wheel effect is visible temporal aliasing; downsampling and DAC imaging are its digital and output-side duals.</li>
<li><strong>Used on purpose:</strong> bandpass sampling deliberately folds a pre-filtered band down to baseband — aliasing as a downconverter.</li>
</ul>` }
  ],
  keyPoints: [
    String.raw`Aliasing = high frequencies ($>f_s/2$) folding back to appear as lower frequencies after sampling.`,
    String.raw`It happens when $f_s<2B$ (undersampling); it is irreversible.`,
    String.raw`Folding frequency = Nyquist frequency $f_s/2$; the spectrum folds like an accordion there.`,
    String.raw`Alias frequency: take $f_{in}\bmod f_s$, then fold about $f_s/2$.`,
    String.raw`Tones at $f_0$ and $f_0+kf_s$ produce identical samples — indistinguishable.`,
    String.raw`Odd Nyquist zones map upright; even zones map spectrally reversed.`,
    String.raw`A frequency at exactly $f_s$ aliases to DC (0 Hz).`,
    String.raw`Prevent with an analog anti-alias low-pass filter BEFORE the ADC.`,
    String.raw`Oversampling relaxes the anti-alias filter's required steepness.`,
    String.raw`The wagon-wheel/strobe effect is temporal aliasing you can see.`,
    String.raw`Downsampling and DAC imaging are the digital and output duals of aliasing.`,
    String.raw`Bandpass sampling uses aliasing deliberately — but only with a pre-filtered band.`
  ],
  equations: [
    { title: String.raw`Alias frequency (folding)`, tex: String.raw`$$f_{alias}=\left|f_{in}-f_s\,\mathrm{round}\!\left(\frac{f_{in}}{f_s}\right)\right|$$`, derivation: String.raw`<p>Sampled spectra repeat every $f_s$, so $f_{in}$ is equivalent to $f_{in}-kf_s$ for any integer $k$. The perceived tone is the representative nearest $0$, i.e. $k=\mathrm{round}(f_{in}/f_s)$, and magnitude (a real signal cannot show negative frequency) gives the absolute value. This lands the result in $[0,f_s/2]$.</p>` },
    { title: String.raw`Indistinguishable tones`, tex: String.raw`$$\cos(2\pi(f_0+kf_s)nT_s)=\cos(2\pi f_0 nT_s)$$`, derivation: String.raw`<p>Expand the phase: $2\pi(f_0+kf_s)nT_s=2\pi f_0 nT_s+2\pi k f_s nT_s$. Since $f_sT_s=1$, the second term is $2\pi kn$, an integer multiple of $2\pi$, which cosine ignores. Hence tones separated by any multiple of $f_s$ give identical sample values — the algebraic core of aliasing.</p>` },
    { title: String.raw`Second-zone (reversed) fold`, tex: String.raw`$$f_{alias}=f_s-f_{in},\quad \tfrac{f_s}{2}<f_{in}<f_s$$`, derivation: String.raw`<p>For $f_{in}$ in the second Nyquist zone, $\mathrm{round}(f_{in}/f_s)=1$, so $f_{alias}=|f_{in}-f_s|=f_s-f_{in}$. As $f_{in}$ rises from $f_s/2$ to $f_s$, the alias falls from $f_s/2$ to $0$ — the spectrum is mirror-imaged (reversed), which is why even zones invert.</p>` },
    { title: String.raw`Fold-about-$f_s/2$ rule`, tex: String.raw`$$f_{alias}=\begin{cases}f_{mod}, & f_{mod}\le f_s/2\\ f_s-f_{mod}, & f_{mod}>f_s/2\end{cases}$$`, derivation: String.raw`<p>First reduce modulo $f_s$: $f_{mod}=f_{in}-f_s\lfloor f_{in}/f_s\rfloor\in[0,f_s)$. If it already sits in the first half it is the alias; if in the upper half it reflects about the folding frequency $f_s/2$, giving $f_s-f_{mod}$. This is the accordion fold applied twice (about $0$ and $f_s/2$).</p>` },
    { title: String.raw`Overlap condition`, tex: String.raw`$$\text{aliasing} \iff f_s<2B$$`, derivation: String.raw`<p>Replicas sit at $kf_s$; the baseband copy spans $[-B,B]$. The nearest replica's lower edge is at $f_s-B$. Overlap (aliasing) occurs when $f_s-B<B$, i.e. $f_s<2B$ — the exact negation of the Nyquist condition. At $f_s=2B$ the copies just touch; below it they intrude.</p>` },
    { title: String.raw`Wagon-wheel apparent rate`, tex: String.raw`$$f_{app}=f_{rot}-f_{frame}\,\mathrm{round}\!\left(\frac{f_{rot}}{f_{frame}}\right)$$`, derivation: String.raw`<p>A wheel spinning at $f_{rot}$ (spoke passes/s) filmed at $f_{frame}$ frames/s is sampled temporally. By the same folding formula, the apparent rotation is $f_{rot}$ reduced modulo $f_{frame}$ and taken about zero. When $f_{rot}$ slightly exceeds $f_{frame}$ the result is small and positive (slow forward); when slightly less, small and negative (apparent reverse).</p>` }
  ],
  flashcards: [
    { front: String.raw`What is aliasing?`, back: String.raw`High frequencies ($>f_s/2$) folding back to appear as lower frequencies when a signal is undersampled.` },
    { front: String.raw`When does aliasing occur?`, back: String.raw`When $f_s<2B$ — the signal contains energy above the Nyquist frequency $f_s/2$.` },
    { front: String.raw`What is the folding frequency?`, back: String.raw`The Nyquist frequency $f_s/2$, about which the spectrum folds.` },
    { front: String.raw`Alias-frequency procedure?`, back: String.raw`Take $f_{in}\bmod f_s$; if $>f_s/2$, use $f_s-$that; else use it directly.` },
    { front: String.raw`Why can't aliasing be fixed after sampling?`, back: String.raw`Aliased and genuine low frequencies are numerically identical in the samples.` },
    { front: String.raw`Two tones that give identical samples?`, back: String.raw`$f_0$ and $f_0+kf_s$ for any integer $k$.` },
    { front: String.raw`Where does a tone at exactly $f_s$ alias to?`, back: String.raw`DC (0 Hz).` },
    { front: String.raw`How is aliasing prevented?`, back: String.raw`An analog anti-alias low-pass filter before the ADC removes energy above $f_s/2$.` },
    { front: String.raw`What is the wagon-wheel effect?`, back: String.raw`Temporal aliasing: a rotating wheel appears to slow, stop, or spin backward on film/strobe.` },
    { front: String.raw`How do even vs odd Nyquist zones fold?`, back: String.raw`Odd zones map upright; even zones map spectrally reversed.` },
    { front: String.raw`$700\text{ Hz}$ sampled at $1000\text{ Hz}$ aliases to?`, back: String.raw`$1000-700=300\text{ Hz}$.` },
    { front: String.raw`Digital dual of aliasing when downsampling?`, back: String.raw`Decimation needs a digital anti-alias filter first, or it aliases.` },
    { front: String.raw`DAC output dual of aliasing?`, back: String.raw`Imaging — spectral images above $f_s/2$; removed by a reconstruction (anti-imaging) filter.` },
    { front: String.raw`Does bandpass sampling use aliasing?`, back: String.raw`Yes — deliberately, folding a pre-filtered band down to baseband.` }
  ],
  mcqs: [
    { q: String.raw`Aliasing occurs when:`, options: [String.raw`$f_s>2B$`, String.raw`$f_s<2B$`, String.raw`$f_s=\infty$`, String.raw`The signal is bandlimited`], answer: 1, explain: String.raw`Undersampling ($f_s<2B$) makes spectral replicas overlap.` },
    { q: String.raw`A $700\text{ Hz}$ tone sampled at $1000\text{ Hz}$ appears at:`, options: [String.raw`$700\text{ Hz}$`, String.raw`$300\text{ Hz}$`, String.raw`$500\text{ Hz}$`, String.raw`$1000\text{ Hz}$`], answer: 1, explain: String.raw`$f_{mod}=700>500$, so alias $=1000-700=300\text{ Hz}$.` },
    { q: String.raw`The folding frequency equals:`, options: [String.raw`$f_s$`, String.raw`$f_s/2$`, String.raw`$2f_s$`, String.raw`$B$`], answer: 1, explain: String.raw`The Nyquist frequency $f_s/2$ is the crease of the fold.` },
    { q: String.raw`Aliasing after sampling can be removed by:`, options: [String.raw`A digital low-pass filter`, String.raw`Resampling`, String.raw`Nothing — it is irreversible`, String.raw`Averaging frames`], answer: 2, explain: String.raw`Aliased and true low frequencies are identical in the data.` },
    { q: String.raw`A tone at exactly $f_s$ aliases to:`, options: [String.raw`$f_s/2$`, String.raw`DC (0 Hz)`, String.raw`$f_s/4$`, String.raw`It does not alias`], answer: 1, explain: String.raw`$f_{mod}=0$, so it appears at 0 Hz.` },
    { q: String.raw`The wagon-wheel effect is an example of:`, options: [String.raw`Quantization`, String.raw`Temporal aliasing`, String.raw`Jitter`, String.raw`Clipping`], answer: 1, explain: String.raw`Frames sample the rotation too slowly, aliasing the spin rate.` },
    { q: String.raw`An anti-alias filter must be placed:`, options: [String.raw`After the ADC`, String.raw`Before the ADC`, String.raw`In software only`, String.raw`After the DAC`], answer: 1, explain: String.raw`Above-Nyquist energy must be removed before sampling.` },
    { q: String.raw`Tones separated by exactly $f_s$ produce:`, options: [String.raw`Different samples`, String.raw`Identical samples`, String.raw`Zero samples`, String.raw`Doubled samples`], answer: 1, explain: String.raw`$\cos(2\pi(f_0+f_s)nT_s)=\cos(2\pi f_0 nT_s)$.` },
    { q: String.raw`Signals in even Nyquist zones fold to baseband:`, options: [String.raw`Upright`, String.raw`Spectrally reversed`, String.raw`Doubled`, String.raw`Attenuated only`], answer: 1, explain: String.raw`Even zones invert the spectrum; odd zones stay upright.` },
    { q: String.raw`Downsampling a digital signal by $M$ without a filter causes:`, options: [String.raw`No effect`, String.raw`Digital aliasing`, String.raw`Imaging`, String.raw`Quantization`], answer: 1, explain: String.raw`Decimation needs a digital anti-alias filter first.` },
    { q: String.raw`A DAC without a reconstruction filter produces:`, options: [String.raw`Aliasing`, String.raw`Spectral images above $f_s/2$`, String.raw`Clipping`, String.raw`Nothing wrong`], answer: 1, explain: String.raw`Imaging is the output-side dual; an anti-imaging filter removes it.` },
    { q: String.raw`Oversampling helps combat aliasing by:`, options: [String.raw`Removing the need for any filter`, String.raw`Widening the guard band so a gentler anti-alias filter suffices`, String.raw`Increasing signal bandwidth`, String.raw`Adding aliases`], answer: 1, explain: String.raw`More space between $B$ and $f_s/2$ eases filter roll-off.` }
  ],
  numericals: [
    { q: String.raw`A $1300\text{ Hz}$ sinusoid is sampled at $f_s=1000\text{ Hz}$. What frequency appears?`, solution: String.raw`<p><b>Formula.</b> $$f_{mod}=f_{in}\bmod f_s,\qquad f_{alias}=\begin{cases}f_{mod}, & f_{mod}\le f_s/2\\ f_s-f_{mod}, & f_{mod}>f_s/2\end{cases}$$ where $f_{in}$ is the input, $f_s$ the sample rate, and the fold is about $f_s/2$.</p>
<p><b>Substitute.</b> $$f_{mod}=1300\bmod1000=300\text{ Hz};\qquad 300\le\frac{1000}{2}=500.$$</p>
<p><b>Compute.</b> Since $300\le500$, the alias is $300\text{ Hz}$. The $1300\text{ Hz}$ tone masquerades as $300\text{ Hz}$.</p>
<p><b>Explanation.</b> Sampling repeats the spectrum every $f_s$, so $1300\text{ Hz}$ is indistinguishable from $300\text{ Hz}$ in the samples. No later processing can separate them — the alias is permanent.</p>` },
    { q: String.raw`An ADC runs at $f_s=48\text{ kHz}$. A $30\text{ kHz}$ interferer leaks in. Where does it alias?`, solution: String.raw`<p><b>Formula.</b> $$f_{mod}=f_{in}\bmod f_s,\qquad f_{alias}=f_s-f_{mod}\;\;(f_{mod}>f_s/2)$$ where the interferer folds about the Nyquist frequency $f_s/2$.</p>
<p><b>Substitute.</b> $$f_s/2=24\text{ kHz};\qquad f_{mod}=30\bmod48=30\text{ kHz}>24;\qquad f_{alias}=48-30.$$</p>
<p><b>Compute.</b> $f_{alias}=18\text{ kHz}$ — squarely in the audio band, corrupting it.</p>
<p><b>Explanation.</b> A $30\text{ kHz}$ interferer sits in the 2nd Nyquist zone and folds down to $18\text{ kHz}$, right where the ear is sensitive. The analog anti-alias filter must reject it before the ADC, since it cannot be removed afterward.</p>` },
    { q: String.raw`A wheel spins at $26\text{ rev/s}$ and is filmed at $24\text{ frames/s}$. What apparent rotation results?`, solution: String.raw`<p><b>Formula.</b> $$f_{app}=f_{rot}-f_{frame}\,\mathrm{round}\!\left(\frac{f_{rot}}{f_{frame}}\right)$$ where $f_{rot}$ is the true spin rate, $f_{frame}$ the film's sampling (frame) rate, and $f_{app}$ the apparent (aliased) rotation.</p>
<p><b>Substitute.</b> $$f_{app}=26-24\cdot\mathrm{round}\!\left(\frac{26}{24}\right)=26-24\cdot1.$$</p>
<p><b>Compute.</b> $f_{app}=+2\text{ rev/s}$ — the wheel appears to creep <em>forward</em> slowly. At $22\text{ rev/s}$: $22-24=-2\text{ rev/s}$, an apparent <em>backward</em> spin.</p>
<p><b>Explanation.</b> Filming is temporal sampling of the rotation; spin rates near a multiple of the frame rate alias to a small apparent rate. That is exactly the wagon-wheel effect seen on screen.</p>` },
    { q: String.raw`A signal band is $0$–$5\text{ kHz}$ but a $12\text{ kHz}$ harmonic is present. Sampling at $20\text{ kHz}$, does the harmonic alias into band?`, solution: String.raw`<p><b>Formula.</b> $$f_{alias}=f_s-f_{mod}\;\;(f_{mod}>f_s/2)$$ where the harmonic folds about $f_s/2$; compare the result to the wanted $0$–$5\text{ kHz}$ band.</p>
<p><b>Substitute.</b> $$f_s/2=10\text{ kHz};\qquad f_{mod}=12\bmod20=12>10;\qquad f_{alias}=20-12.$$</p>
<p><b>Compute.</b> $f_{alias}=8\text{ kHz}$. That lands above the $5\text{ kHz}$ signal band, so it does not overlap the wanted signal — but it still occupies the $0$–$10\text{ kHz}$ digital range.</p>
<p><b>Explanation.</b> The $12\text{ kHz}$ harmonic aliases to $8\text{ kHz}$: harmless if only $0$–$5\text{ kHz}$ is used, but a spurious tone if the full Nyquist band matters. When in doubt, filter it before sampling.</p>` },
    { q: String.raw`Which input frequencies alias to $2\text{ kHz}$ when $f_s=10\text{ kHz}$?`, solution: String.raw`<p><b>Formula.</b> $$f_{in}=k f_s\pm f_{alias},\qquad k=0,1,2,\dots$$ where every input in this family folds to the same alias $f_{alias}$; here $f_s=10\text{ kHz}$ and $f_{alias}=2\text{ kHz}$.</p>
<p><b>Substitute.</b> $$f_{in}=k\cdot10\pm2\text{ kHz}.$$</p>
<p><b>Compute.</b> $f_{in}=2,\,8,\,12,\,18,\,22,\dots\text{ kHz}$ — all alias to $2\text{ kHz}$.</p>
<p><b>Explanation.</b> An infinite ladder of input frequencies collapses onto one alias, so a single digital observation cannot say which was present. This is precisely why the anti-alias filter must reject everything above $f_s/2=5\text{ kHz}$.</p>` },
    { q: String.raw`A $4.5\text{ kHz}$ tone is sampled at $6\text{ kHz}$. Find the alias and note the zone.`, solution: String.raw`<p><b>Formula.</b> $$f_{alias}=f_s-f_{mod}\;\;(f_{mod}>f_s/2)$$ where a tone in the 2nd Nyquist zone ($f_s/2$ to $f_s$) folds reversed about $f_s/2$.</p>
<p><b>Substitute.</b> $$f_s/2=3\text{ kHz};\qquad f_{mod}=4.5\bmod6=4.5>3;\qquad f_{alias}=6-4.5.$$</p>
<p><b>Compute.</b> $f_{alias}=1.5\text{ kHz}$. The $4.5\text{ kHz}$ tone lies in the 2nd Nyquist zone ($3$–$6\text{ kHz}$), so it folds <em>reversed</em> to $1.5\text{ kHz}$.</p>
<p><b>Explanation.</b> Even Nyquist zones map spectrally flipped, so as the input rises the alias falls. Here $4.5\text{ kHz}$ appears as $1.5\text{ kHz}$ with an inverted spectrum — an easy trap in undersampled measurements.</p>` }
  ],
  realWorld: String.raw`<p>Aliasing explains real artifacts everywhere: moire patterns in digital photos (spatial aliasing of fine textures beyond the sensor's resolution), jagged/shimmering edges in 3D graphics (fixed by anti-aliasing / supersampling), false tones in undersampled test instruments, and the backward-spinning wheels in films. In RF, engineers turn it to advantage with bandpass sampling to digitize signals above the ADC's Nyquist frequency. The universal lesson: bandlimit before you sample. See <a href="#nyquist-sampling">Nyquist sampling</a> and <a href="#adc">ADC</a>.</p>`,
  related: ['nyquist-sampling', 'fourier-transform', 'adc', 'dac', 'sdr']
}
);
