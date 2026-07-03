// From-scratch derivations for the "SDR & Data Converters" category.
// Loaded after content.js; merges into the global CONTENT_DERIV registry.
Object.assign(CONTENT_DERIV, {

  // ============================================================
  // Software-Defined Radio (SDR)
  // ============================================================
  'sdr': {

    // 0 — Bandpass signal in IQ form
    0: String.raw`
<p><b>Where we start.</b> Any real, narrowband bandpass signal has energy clustered around some carrier frequency $f_c$. We want to show that it can always be written as two slowly varying "baseband" signals $I(t)$ and $Q(t)$ riding on a cosine and a sine. This is the foundation of every SDR: it lets us push all the information into two low-rate streams.</p>

<p><b>Step 1 — write the most general narrowband bandpass signal.</b> A bandpass signal is an amplitude- and phase-modulated carrier:</p>
$$ s(t) = a(t)\cos\!\big(2\pi f_c t + \phi(t)\big), $$
<p>where $a(t)\ge 0$ is a slowly varying envelope and $\phi(t)$ a slowly varying phase (both change far more slowly than $\cos 2\pi f_c t$). Every real narrowband signal fits this template.</p>

<p><b>Step 2 — expand the cosine of a sum.</b> Use $\cos(A+B)=\cos A\cos B-\sin A\sin B$ with $A=2\pi f_c t$, $B=\phi(t)$:</p>
$$ s(t) = a(t)\cos\phi(t)\,\cos(2\pi f_c t) - a(t)\sin\phi(t)\,\sin(2\pi f_c t). $$

<p><b>Step 3 — name the two baseband quadratures.</b> Define</p>
$$ I(t) \equiv a(t)\cos\phi(t), \qquad Q(t) \equiv a(t)\sin\phi(t). $$
<p>$I$ ("in-phase") multiplies the cosine; $Q$ ("quadrature") multiplies the sine. Both are slow because $a$ and $\phi$ are slow. Substituting:</p>
$$ s(t) = I(t)\cos(2\pi f_c t) - Q(t)\sin(2\pi f_c t). $$

<p><b>Step 4 — collapse into a single complex phasor.</b> Define the complex baseband (complex envelope) $\tilde s(t) \equiv I(t)+jQ(t)$. Recall Euler's formula $e^{j\theta}=\cos\theta+j\sin\theta$. Then</p>
$$ \tilde s(t)\,e^{j2\pi f_c t} = (I+jQ)(\cos 2\pi f_c t + j\sin 2\pi f_c t). $$
<p>Multiply out and take the real part:</p>
$$ \operatorname{Re}\!\big[\tilde s\,e^{j2\pi f_c t}\big] = I\cos 2\pi f_c t - Q\sin 2\pi f_c t. $$
<p>This is exactly $s(t)$ from Step 3.</p>

<p><b>Result.</b></p>
$$ \boxed{\,s(t) = I(t)\cos(2\pi f_c t) - Q(t)\sin(2\pi f_c t) = \operatorname{Re}\!\left[\tilde s(t)\,e^{j2\pi f_c t}\right]\,} $$
<p><b>Intuition.</b> The carrier is just a spinning unit phasor $e^{j2\pi f_c t}$; all the information lives in the slow complex number $\tilde s(t)=I+jQ$ that scales and rotates it. SDR keeps $\tilde s$ and throws the fast carrier away.</p>
`,

    // 1 — IQ downconversion
    1: String.raw`
<p><b>Where we start.</b> Given the real received signal $s(t)=I\cos\omega_c t - Q\sin\omega_c t$ (with $\omega_c=2\pi f_c$), we want to <em>recover</em> $I(t)$ and $Q(t)$ separately using only multipliers and lowpass filters. The trick is that multiplying two sinusoids creates a sum (high) and a difference (low) frequency; we keep the low one.</p>

<p><b>Step 1 — mix down the I branch.</b> Multiply $s(t)$ by $2\cos\omega_c t$:</p>
$$ 2s(t)\cos\omega_c t = 2I\cos^2\omega_c t - 2Q\sin\omega_c t\cos\omega_c t. $$

<p><b>Step 2 — apply the product-to-sum identities.</b> Use $\cos^2\theta=\tfrac12(1+\cos 2\theta)$ and $\sin\theta\cos\theta=\tfrac12\sin 2\theta$:</p>
$$ 2s(t)\cos\omega_c t = I\big(1+\cos 2\omega_c t\big) - Q\sin 2\omega_c t. $$
<p>Regroup into a baseband term plus terms centered at $2f_c$:</p>
$$ = \underbrace{I(t)}_{\text{baseband}} + \underbrace{I\cos 2\omega_c t - Q\sin 2\omega_c t}_{\text{around } 2f_c}. $$

<p><b>Step 3 — lowpass filter.</b> $I(t)$ and $Q(t)$ are slow (near DC); the leftover terms sit near $2f_c$. A lowpass filter with cutoff between the signal bandwidth and $2f_c$ removes them:</p>
$$ 2s(t)\cos\omega_c t \xrightarrow{\text{LPF}} I(t). $$

<p><b>Step 4 — mix down the Q branch.</b> Now multiply by $-2\sin\omega_c t$:</p>
$$ -2s(t)\sin\omega_c t = -2I\cos\omega_c t\sin\omega_c t + 2Q\sin^2\omega_c t. $$
<p>Using $\sin^2\theta=\tfrac12(1-\cos 2\theta)$ and $\cos\theta\sin\theta=\tfrac12\sin 2\theta$:</p>
$$ = -I\sin 2\omega_c t + Q\big(1-\cos 2\omega_c t\big) = \underbrace{Q(t)}_{\text{baseband}} - I\sin 2\omega_c t - Q\cos 2\omega_c t. $$
<p>Lowpass-filter to drop the $2f_c$ terms.</p>

<p><b>Result.</b></p>
$$ \boxed{\,s(t)\cdot 2\cos\omega_c t \xrightarrow{\text{LPF}} I(t), \qquad s(t)\cdot(-2\sin\omega_c t) \xrightarrow{\text{LPF}} Q(t)\,} $$
<p><b>Intuition.</b> Multiplying by cosine "un-spins" the I part back to DC while flinging its clone to $2f_c$; the LPF is the sieve that keeps DC. The factor of 2 exactly cancels the $\tfrac12$ from the trig identities so amplitudes come out right. Because $\cos$ and $-\sin$ are orthogonal over a cycle, the I mixer sees zero average from the Q term and vice versa — that orthogonality is why two real channels carry independent information.</p>
`,

    // 2 — Image rejection ratio from IQ imbalance
    2: String.raw`
<p><b>Where we start.</b> An ideal IQ mixer uses two branches with exactly equal gain and exactly $90^\circ$ apart. Real hardware has a small gain mismatch $\varepsilon$ and a small phase error $\psi$. These imperfections let a signal at $-f$ leak into $+f$ (a mirror "image"). We derive how much the desired tone dominates its image — the Image Rejection Ratio (IRR).</p>

<p><b>Step 1 — model the imperfect complex LO.</b> The ideal downconversion multiplies by $e^{-j\omega t}=\cos\omega t - j\sin\omega t$. With gain error $\varepsilon$ split between branches and phase error $\psi$, the local oscillator becomes</p>
$$ \text{LO}(t) = \Big(1+\tfrac{\varepsilon}{2}\Big)\cos\omega t \;-\; j\Big(1-\tfrac{\varepsilon}{2}\Big)\sin(\omega t+\psi). $$

<p><b>Step 2 — split into ideal part + error part.</b> Any distorted complex exponential can be written as a strong copy of the wanted phasor plus a weak copy of its conjugate:</p>
$$ \text{LO}(t) = \alpha\,e^{-j\omega t} + \beta\,e^{+j\omega t}. $$
<p>The $e^{-j\omega t}$ term selects the desired sideband; the $e^{+j\omega t}$ term is the <em>image leakage</em>. Matching coefficients (using $\cos,\sin$ in exponential form) gives, to first order in small $\varepsilon,\psi$:</p>
$$ \alpha \approx 1, \qquad \beta \approx \tfrac{\varepsilon}{2} + j\tfrac{\psi}{2}. $$

<p><b>Step 3 — form the power ratio.</b> The IRR is the desired power over the image power:</p>
$$ \text{IRR} = \frac{|\alpha|^2}{|\beta|^2} = \frac{1}{\big|\tfrac{\varepsilon}{2}+j\tfrac{\psi}{2}\big|^2}. $$

<p><b>Step 4 — take the squared magnitude.</b> For a complex number $x+jy$, $|x+jy|^2=x^2+y^2$:</p>
$$ \text{IRR} \approx \frac{1}{(\varepsilon/2)^2+(\psi/2)^2}. $$

<p><b>Step 5 — express in decibels.</b> Since IRR is a power ratio, convert with $10\log_{10}$:</p>
$$ \text{IRR}_{dB} = 10\log_{10}\text{IRR}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{IRR} \approx \frac{1}{(\varepsilon/2)^2+(\psi/2)^2}, \qquad \text{IRR}_{dB}=10\log_{10}\text{IRR}\,} $$
<p><b>Intuition.</b> Perfect balance ($\varepsilon=\psi=0$) gives infinite rejection. A $1\%$ gain error ($\varepsilon=0.01$) or $\sim0.57^\circ$ phase error ($\psi=0.01$ rad) alone gives $\text{IRR}\approx(0.005)^{-2}=4\times10^4\approx 46$ dB. On-chip IQ calibration (as in the AD9361) shrinks $\varepsilon,\psi$ to push this even higher.</p>
`,

    // 3 — Complex vs real sampling rate equivalence
    3: String.raw`
<p><b>Where we start.</b> We want to prove that sampling a signal as one complex stream at rate $B$ carries the same information as sampling it as one real stream at $2B$. This is why SDR loves complex baseband: it halves the apparent sample rate.</p>

<p><b>Step 1 — the Nyquist theorem for real signals.</b> A real signal with content up to frequency $f_{\max}$ needs $f_{s,\text{real}}\ge 2f_{\max}$. The factor 2 comes from real spectra being symmetric: a real signal always has both $+f$ and $-f$ components (because $s(t)$ real $\Rightarrow S(-f)=S^*(f)$). To avoid aliasing you must fit that full $\pm f_{\max}$ two-sided span, of total width $2f_{\max}$, into the sample rate. For a bandpass channel of bandwidth $B$ that puts $f_{s,\text{real}}\ge 2B$.</p>

<p><b>Step 2 — what a complex sample contains.</b> A complex baseband sample is $I+jQ$: two real numbers per sample. Its spectrum is <em>not</em> forced to be symmetric, so it can occupy a one-sided band of width $B$ (say from $0$ to $B$, or $-B/2$ to $+B/2$) with no wasted mirror image.</p>

<p><b>Step 3 — Nyquist for complex signals.</b> Because there is no conjugate-symmetry constraint, a complex signal only needs the sample rate to cover its actual bandwidth $B$:</p>
$$ f_{s,\text{complex}} \ge B. $$

<p><b>Step 4 — count the real numbers per second (the bookkeeping check).</b> Complex path: $f_{s,\text{complex}}$ samples/s $\times\,2$ reals each $= 2B$ reals/s. Real path: $f_{s,\text{real}}=2B$ samples/s $\times\,1$ real each $=2B$ reals/s. Identical — no information is created or destroyed, only repackaged.</p>

<p><b>Result.</b></p>
$$ \boxed{\,f_{s,\text{complex}} \ge B \quad\Longleftrightarrow\quad f_{s,\text{real}} \ge 2B\,} $$
<p><b>Intuition.</b> Real sampling "wastes" half the spectrum on a mirror image; complex sampling keeps I and Q, which encodes sign of frequency and removes the mirror — so you can run the converter at half the clock for the same bandwidth. The total data rate (reals/second) is unchanged.</p>
`,

    // 4 — DDC frequency shift (NCO mix)
    4: String.raw`
<p><b>Where we start.</b> A Digital Down-Converter (DDC) needs to slide a channel sitting at $f_0$ down to DC entirely in the digital domain, using a numerically controlled oscillator (NCO). We derive the multiply that does it.</p>

<p><b>Step 1 — the frequency-shift (modulation) property.</b> In continuous time, multiplying by $e^{-j2\pi f_0 t}$ shifts a spectrum down by $f_0$: if $x(t)\leftrightarrow X(f)$, then $x(t)e^{-j2\pi f_0 t}\leftrightarrow X(f+f_0)$. A component at $f_0$ moves to $0$.</p>

<p><b>Step 2 — discretize the time axis.</b> Sampling at rate $f_s$ means $t = nT_s = n/f_s$ for integer sample index $n$. Substitute into the continuous shift phasor:</p>
$$ e^{-j2\pi f_0 t}\Big|_{t=n/f_s} = e^{-j2\pi f_0 n / f_s}. $$
<p>This is the NCO: a discrete complex exponential whose phase advances by $2\pi f_0/f_s$ radians each sample.</p>

<p><b>Step 3 — apply it to the sampled signal.</b> With $x[n]=x(nT_s)$, the down-converted stream is the sample-by-sample product:</p>
$$ y[n] = x[n]\,e^{-j2\pi f_0 n/f_s}. $$

<p><b>Step 4 — confirm the shift in the DTFT.</b> The discrete-time Fourier transform obeys the same modulation rule: multiplying by $e^{-j2\pi f_0 n/f_s}$ maps $X(e^{j2\pi f/f_s})$ to $X(e^{j2\pi (f+f_0)/f_s})$, i.e. the channel at $f_0$ lands at $0$. After this shift a lowpass/decimating filter isolates it.</p>

<p><b>Result.</b></p>
$$ \boxed{\,y[n] = x[n]\,e^{-j2\pi f_0 n / f_s}\,} $$
<p><b>Intuition.</b> The NCO is a discrete phasor spinning at $-f_0$; multiplying "un-spins" the target channel to DC. The normalized phase step $2\pi f_0/f_s$ is just how many radians per sample the carrier turns — this is the whole idea behind tuning an SDR in software.</p>
`,

    // 5 — Host data throughput
    5: String.raw`
<p><b>Where we start.</b> After the ADC, the SDR must ship samples to a host over USB/Ethernet/PCIe. We build the raw bit-rate from the ground up by counting where every bit comes from.</p>

<p><b>Step 1 — bits per real sample.</b> Each real sample is quantized to $N_{bits}$ bits, so it costs $N_{bits}$ bits.</p>

<p><b>Step 2 — account for I and Q.</b> Complex baseband delivers two reals per complex sample (in-phase and quadrature), so a complex sample costs $2\times N_{bits}$ bits. The factor $2_{(I,Q)}$ is exactly this pair.</p>

<p><b>Step 3 — multiply by the sample rate.</b> With $f_s$ complex samples per second, one channel produces</p>
$$ f_s \times N_{bits} \times 2 \quad \text{bits/second}. $$

<p><b>Step 4 — scale by the number of channels.</b> With $N_{ch}$ independent RX (or TX) channels running in parallel, multiply once more:</p>
$$ R_{data} = f_s \times N_{bits} \times 2_{(I,Q)} \times N_{ch}. $$

<p><b>Result.</b></p>
$$ \boxed{\,R_{data} = f_s \times N_{bits} \times 2_{(I,Q)} \times N_{ch}\,} $$
<p><b>Sanity check.</b> $f_s=61.44$ MSPS, $16$-bit, $2$ channels: $R=61.44\text{e}6\times16\times2\times2 \approx 3.93$ Gbit/s — already beyond USB 3.0's practical throughput, which is why SDRs decimate on-device before sending. The formula is pure bookkeeping: samples/s $\times$ bits/sample.</p>
`
  },

  // ============================================================
  // Analog-to-Digital Converter (ADC)
  // ============================================================
  'adc': {

    // 0 — Quantization noise power
    0: String.raw`
<p><b>Where we start.</b> An ADC rounds each sample to the nearest of $2^N$ levels. The rounding error is what we hear as "quantization noise." We derive its average power $\sigma_q^2$ from the statistics of that error, assuming nothing more than "the error is equally likely to be anywhere within one step."</p>

<p><b>Step 1 — define the step size.</b> A full-scale range $V_{FS}$ split into $2^N$ equal levels gives a least-significant-step (LSB)</p>
$$ \Delta = \frac{V_{FS}}{2^N}. $$

<p><b>Step 2 — model the error as uniform.</b> When you round to the nearest level, the error $e = x_{\text{quantized}} - x$ lies within half a step on either side: $-\tfrac{\Delta}{2}\le e\le \tfrac{\Delta}{2}$. For a busy signal spanning many codes, $e$ is well modeled as <em>uniformly</em> distributed over that width $\Delta$. A uniform density that integrates to 1 over width $\Delta$ has height $1/\Delta$:</p>
$$ p(e) = \frac{1}{\Delta}, \quad -\frac{\Delta}{2}\le e \le \frac{\Delta}{2}. $$

<p><b>Step 3 — average power is the variance.</b> The error has zero mean, so its power equals its variance, the expected value of $e^2$:</p>
$$ \sigma_q^2 = \mathbb{E}[e^2] = \int_{-\Delta/2}^{\Delta/2} e^2\,p(e)\,de = \frac{1}{\Delta}\int_{-\Delta/2}^{\Delta/2} e^2\,de. $$

<p><b>Step 4 — do the integral.</b> $\int e^2\,de = e^3/3$:</p>
$$ \sigma_q^2 = \frac{1}{\Delta}\left[\frac{e^3}{3}\right]_{-\Delta/2}^{\Delta/2} = \frac{1}{\Delta}\cdot\frac{1}{3}\left(\frac{\Delta^3}{8}-\Big(\!-\frac{\Delta^3}{8}\Big)\right) = \frac{1}{\Delta}\cdot\frac{1}{3}\cdot\frac{\Delta^3}{4} = \frac{\Delta^2}{12}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\sigma_q^2=\frac{\Delta^2}{12}, \qquad \Delta=\frac{V_{FS}}{2^N}\,} $$
<p><b>Intuition.</b> The "$12$" is the variance of a unit-width uniform distribution ($1/12$); scaling the width to $\Delta$ scales the variance by $\Delta^2$. Every extra bit halves $\Delta$, cutting noise power by $4\times$ — that's the $6$ dB/bit we see next.</p>
`,

    // 1 — Ideal SNR = 6.02N + 1.76 dB
    1: String.raw`
<p><b>Where we start.</b> We now compare the largest signal an $N$-bit ADC can hold (a full-scale sine wave) against the quantization noise just derived. The ratio, in dB, is the famous $6.02N+1.76$.</p>

<p><b>Step 1 — signal power of a full-scale sinusoid.</b> A sine using the whole range swings $\pm V_{FS}/2$, so its amplitude is $A=V_{FS}/2$. The average power of a sinusoid is $A^2/2$:</p>
$$ P_{sig} = \frac{A^2}{2} = \frac{(V_{FS}/2)^2}{2} = \frac{V_{FS}^2}{8}. $$

<p><b>Step 2 — recall the noise power.</b> From the previous result, $\sigma_q^2=\Delta^2/12$ with $\Delta=V_{FS}/2^N$, so</p>
$$ P_{noise} = \frac{\Delta^2}{12} = \frac{V_{FS}^2}{12\cdot 2^{2N}}. $$

<p><b>Step 3 — take the ratio.</b></p>
$$ \text{SNR} = \frac{P_{sig}}{P_{noise}} = \frac{V_{FS}^2/8}{V_{FS}^2/(12\cdot 2^{2N})} = \frac{12\cdot 2^{2N}}{8} = \frac{3}{2}\,2^{2N}. $$

<p><b>Step 4 — convert to decibels.</b> Power ratio $\Rightarrow 10\log_{10}$:</p>
$$ \text{SNR}_{dB} = 10\log_{10}\!\Big(\frac{3}{2}\,2^{2N}\Big) = 10\log_{10} 2^{2N} + 10\log_{10}\frac{3}{2}. $$

<p><b>Step 5 — evaluate each piece.</b> $10\log_{10}2^{2N}=2N\cdot 10\log_{10}2 = 2N(3.0103)=6.02\,N$, and $10\log_{10}(1.5)=1.76$:</p>
$$ \text{SNR}_{dB} = 6.02\,N + 1.76\ \text{dB}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{SNR}_{ideal}=6.02\,N + 1.76\ \text{dB}\,} $$
<p><b>Intuition.</b> The $6.02\,N$ is "$6$ dB per bit" — each bit doubles the number of levels, halving the step, quartering noise power. The $+1.76$ is the little bonus $10\log_{10}(3/2)$ that comes specifically from comparing a <em>sine</em> (peak-to-rms crest factor) against uniform noise.</p>
`,

    // 2 — ENOB from SINAD
    2: String.raw`
<p><b>Where we start.</b> Real ADCs add distortion and circuit noise on top of quantization. We measure their combined effect as SINAD (Signal to Noise-And-Distortion) and ask: how many "perfect" bits would give this same SINAD? That number is the Effective Number Of Bits (ENOB).</p>

<p><b>Step 1 — start from the ideal law.</b> The best possible SINAD for an $N$-bit converter is the ideal SNR just derived:</p>
$$ \text{SINAD}_{ideal} = 6.02\,N + 1.76\ \text{dB}. $$

<p><b>Step 2 — define ENOB by inversion.</b> ENOB is <em>defined</em> as the bit count that a perfect converter would need to achieve the measured SINAD. So replace $N$ by ENOB and the ideal SINAD by the measured one:</p>
$$ \text{SINAD}_{measured} = 6.02\,\text{ENOB} + 1.76. $$

<p><b>Step 3 — solve for ENOB.</b> Subtract 1.76 and divide by 6.02:</p>
$$ \text{ENOB} = \frac{\text{SINAD} - 1.76}{6.02}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{ENOB}=\frac{\text{SINAD}-1.76}{6.02}\,} $$
<p><b>Intuition.</b> ENOB just runs the $6.02N+1.76$ formula backwards. A 12-bit ADC advertised at $68$ dB SINAD has $\text{ENOB}=(68-1.76)/6.02\approx 11.0$ bits — it behaves like a perfect 11-bit part, the "lost" bit swallowed by noise and distortion.</p>
`,

    // 3 — Aperture-jitter-limited SNR
    3: String.raw`
<p><b>Where we start.</b> The sampling clock never fires at perfectly even instants; it trembles by a random amount $t_j$ (RMS aperture jitter). If you sample a fast-slewing signal at a slightly wrong time, you capture a slightly wrong value — an amplitude error. We derive the SNR this sets, independent of resolution.</p>

<p><b>Step 1 — timing error becomes amplitude error.</b> For an input $x(t)$, sampling $\delta t$ late gives an error $\delta x \approx \dfrac{dx}{dt}\,\delta t$. The error is largest where the signal moves fastest — its slew rate.</p>

<p><b>Step 2 — worst case is a full-scale sine.</b> Let $x(t)=A\sin(2\pi f_{in}t)$. Its derivative is $\dot x(t)=A\,2\pi f_{in}\cos(2\pi f_{in}t)$, whose RMS value is</p>
$$ \dot x_{rms} = \frac{A\,2\pi f_{in}}{\sqrt{2}}. $$
<p>Higher input frequency $\Rightarrow$ steeper slopes $\Rightarrow$ more sensitivity to jitter.</p>

<p><b>Step 3 — RMS amplitude error from RMS jitter.</b> With RMS timing jitter $t_j$ (uncorrelated with the signal),</p>
$$ \delta x_{rms} = \dot x_{rms}\,t_j = \frac{A\,2\pi f_{in}}{\sqrt2}\,t_j. $$

<p><b>Step 4 — form the SNR (signal RMS over noise RMS).</b> The signal's RMS is $A/\sqrt2$:</p>
$$ \text{SNR} = \frac{x_{rms}}{\delta x_{rms}} = \frac{A/\sqrt2}{(A\,2\pi f_{in}/\sqrt2)\,t_j} = \frac{1}{2\pi f_{in}\,t_j}. $$
<p>The amplitude $A$ and the $\sqrt2$ cancel — jitter SNR depends only on frequency and jitter.</p>

<p><b>Step 5 — convert to decibels.</b> This is an amplitude (voltage) ratio, so use $20\log_{10}$:</p>
$$ \text{SNR}_{jitter} = 20\log_{10}\!\left(\frac{1}{2\pi f_{in}t_j}\right) = -20\log_{10}\!\big(2\pi f_{in}t_j\big). $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{SNR}_{jitter}=-20\log_{10}\!\left(2\pi f_{in}\,t_j\right)\,} $$
<p><b>Intuition.</b> Doubling either input frequency or jitter doubles the timing-induced error and costs $6$ dB. At high RF this, not the bit count, is what limits a converter — which is exactly why RFSoC-class direct-RF ADCs obsess over femtosecond clock jitter.</p>
`,

    // 4 — Oversampling processing gain
    4: String.raw`
<p><b>Where we start.</b> Quantization noise power is fixed ($\Delta^2/12$), but sampling faster spreads it over a wider band. If your signal only occupies a slice of that band, filtering keeps the signal but throws away most of the noise. We derive the SNR bonus.</p>

<p><b>Step 1 — total noise is fixed and spread flat.</b> The total quantization noise power $\sigma_q^2=\Delta^2/12$ is (modeled as) white — spread uniformly over the digital band from $0$ to the Nyquist frequency $f_s/2$. So the noise power spectral density is</p>
$$ \text{PSD}_{noise} = \frac{\sigma_q^2}{f_s/2}. $$
<p>Faster sampling ($\uparrow f_s$) spreads the same noise thinner (lower PSD).</p>

<p><b>Step 2 — keep only the signal band.</b> The signal occupies bandwidth $B$. After a digital lowpass/decimation filter of width $B$, the in-band noise is the PSD times $B$:</p>
$$ \sigma_{q,\text{in-band}}^2 = \text{PSD}_{noise}\times B = \sigma_q^2\,\frac{B}{f_s/2} = \sigma_q^2\,\frac{2B}{f_s}. $$

<p><b>Step 3 — form the improvement ratio.</b> Signal power is unchanged, so the SNR improves by the factor by which in-band noise dropped:</p>
$$ \frac{\sigma_q^2}{\sigma_{q,\text{in-band}}^2} = \frac{f_s}{2B}. $$
<p>Define the oversampling ratio $\text{OSR} = \dfrac{f_s}{2B}$.</p>

<p><b>Step 4 — convert to dB.</b> Power ratio $\Rightarrow 10\log_{10}$:</p>
$$ \Delta\text{SNR} = 10\log_{10}\!\left(\frac{f_s}{2B}\right) = 10\log_{10}(\text{OSR}). $$

<p><b>Result.</b></p>
$$ \boxed{\,\Delta\text{SNR}=10\log_{10}\!\left(\frac{f_s}{2B}\right)=10\log_{10}(\text{OSR})\,} $$
<p><b>Intuition.</b> Every $4\times$ oversampling buys $10\log_{10}4\approx 6$ dB $=1$ effective bit. It's a straight trade of speed for resolution: sample $4\times$ faster and filter, gain a bit. (Sigma-delta modulators do far better by also <em>shaping</em> the noise out of band — next.)</p>
`,

    // 5 — Alias frequency (undersampling)
    5: String.raw`
<p><b>Where we start.</b> Sampling at $f_s$ makes the spectrum repeat every $f_s$. A tone at $f_{in}$ that is above Nyquist doesn't vanish — it "folds" back into the baseband $[0, f_s/2]$ at an alias frequency. We derive where it lands (this is deliberate in bandpass/undersampling receivers).</p>

<p><b>Step 1 — sampling replicates the spectrum.</b> Multiplying by an impulse train at rate $f_s$ convolves the spectrum with impulses at every multiple of $f_s$. So a tone at $f_{in}$ appears as an infinite comb of copies at</p>
$$ f_{in} + k f_s, \qquad k = \dots,-2,-1,0,1,2,\dots $$

<p><b>Step 2 — find the copy nearest DC.</b> One of these copies falls inside the observable band $[-f_s/2,\,f_s/2]$. It is the one where $k$ is chosen to cancel most of $f_{in}$ — i.e. $k$ closest to $f_{in}/f_s$:</p>
$$ k = \text{round}\!\left(\frac{f_{in}}{f_s}\right). $$

<p><b>Step 3 — the observed (alias) frequency.</b> The baseband copy sits at $f_{in}-k f_s$; a real sampler shows its absolute value (magnitude of frequency), since $-f$ and $+f$ are indistinguishable for real samples:</p>
$$ f_{alias} = \big|\,f_{in} - k f_s\,\big|. $$

<p><b>Result.</b></p>
$$ \boxed{\,f_{alias}=\left|\,f_{in}-k f_s\,\right|,\quad k=\text{round}(f_{in}/f_s)\,} $$
<p><b>Intuition.</b> Aliasing is the spectrum wrapping around like a clock face of circumference $f_s$. Rounding picks the nearest replica. A $1.9$ GHz tone sampled at $500$ MHz: $k=\text{round}(3.8)=4$, $f_{alias}=|1900-2000|=100$ MHz — the RF appears at $100$ MHz, which is how RFSoC "direct RF sampling" grabs high bands without a mixer.</p>
`,

    // 6 — Sigma-delta noise-shaped SNR
    6: String.raw`
<p><b>Where we start.</b> A $\Sigma\Delta$ modulator oversamples <em>and</em> uses feedback to push quantization noise up to high frequencies where the decimation filter kills it. We derive its SNR: the plain $6.02N+1.76$ plus a much steeper oversampling term set by the loop order $L$.</p>

<p><b>Step 1 — the noise transfer function.</b> An $L$th-order modulator differentiates the quantization noise $L$ times before it reaches the output. In the frequency domain, one differentiation is a factor $(1-z^{-1})$; the noise transfer function is $\text{NTF}(z)=(1-z^{-1})^L$. On the unit circle its magnitude is</p>
$$ |\text{NTF}(f)| = \left|2\sin\!\Big(\frac{\pi f}{f_s}\Big)\right|^{L}. $$
<p>This is tiny near DC (signal band) and large near $f_s/2$ — noise is "shaped" out of band.</p>

<p><b>Step 2 — integrate the shaped noise over the signal band.</b> With white quantization PSD $\sigma_q^2/(f_s/2)$, the in-band noise power is</p>
$$ \sigma_{n}^2 = \frac{\sigma_q^2}{f_s/2}\int_{0}^{B} \Big(2\sin\tfrac{\pi f}{f_s}\Big)^{2L} df. $$

<p><b>Step 3 — small-angle approximation in-band.</b> Over the narrow signal band ($f \ll f_s$ at high OSR), $\sin(\pi f/f_s)\approx \pi f/f_s$, so the integrand is $(2\pi f/f_s)^{2L}$:</p>
$$ \sigma_n^2 \approx \frac{\sigma_q^2}{f_s/2}\Big(\frac{2\pi}{f_s}\Big)^{2L}\int_0^B f^{2L}\,df = \frac{\sigma_q^2}{f_s/2}\Big(\frac{2\pi}{f_s}\Big)^{2L}\frac{B^{2L+1}}{2L+1}. $$

<p><b>Step 4 — collect into $\pi$ and OSR.</b> Substitute $\text{OSR}=f_s/(2B)$, so $B=f_s/(2\,\text{OSR})$. After simplification the in-band noise becomes</p>
$$ \sigma_n^2 = \sigma_q^2\,\frac{\pi^{2L}}{2L+1}\,\frac{1}{\text{OSR}^{2L+1}}. $$

<p><b>Step 5 — form SNR and take dB.</b> Signal is a full-scale sine as before, so its ratio to $\sigma_q^2$ contributes $6.02N+1.76$. The rest gives</p>
$$ \text{SNR} = \big(6.02N+1.76\big) + 10\log_{10}\text{OSR}^{2L+1} - 10\log_{10}\frac{\pi^{2L}}{2L+1}. $$
<p>and $10\log_{10}\text{OSR}^{2L+1}=(20L+10)\log_{10}\text{OSR}$.</p>

<p><b>Result.</b></p>
$$ \boxed{\,\text{SNR}\approx 6.02N+1.76+(20L+10)\log_{10}(\text{OSR})-10\log_{10}\frac{\pi^{2L}}{2L+1}\,} $$
<p><b>Intuition.</b> Plain oversampling gave $10\log_{10}\text{OSR}$ per doubling; each modulator order $L$ adds $20L\log_{10}\text{OSR}$ on top — roughly $6L+3$ dB (i.e. $L+0.5$ bits) per octave of OSR. The last term is a small fixed penalty for the noise the shaping leaves behind. This is how 1-bit converters reach 20-bit audio quality.</p>
`
  },

  // ============================================================
  // Digital-to-Analog Converter (DAC)
  // ============================================================
  'dac': {

    // 0 — Zero-order-hold frequency response
    0: String.raw`
<p><b>Where we start.</b> A DAC doesn't emit ideal impulses; it <em>holds</em> each sample value flat for one sample period $T_s$ (a "zero-order hold," ZOH). We find the frequency response this hold imposes by Fourier-transforming a single rectangular hold pulse.</p>

<p><b>Step 1 — the hold is convolution with a rectangle.</b> Reconstructing with a ZOH is equivalent to taking the sample impulses and convolving with a rectangular pulse $h(t)$ of height 1 and width $T_s$:</p>
$$ h(t) = \begin{cases} 1, & 0 \le t < T_s \\ 0, & \text{otherwise.} \end{cases} $$
<p>The DAC's frequency response is just $H(f)$, the Fourier transform of this pulse.</p>

<p><b>Step 2 — Fourier transform the rectangle.</b></p>
$$ H(f) = \int_{0}^{T_s} 1\cdot e^{-j2\pi f t}\,dt = \left[\frac{e^{-j2\pi f t}}{-j2\pi f}\right]_0^{T_s} = \frac{1 - e^{-j2\pi f T_s}}{j2\pi f}. $$

<p><b>Step 3 — factor out the mid-point phase.</b> Pull $e^{-j\pi f T_s}$ from the numerator to expose a sine (using $e^{j\theta}-e^{-j\theta}=2j\sin\theta$):</p>
$$ 1 - e^{-j2\pi f T_s} = e^{-j\pi f T_s}\big(e^{j\pi f T_s}-e^{-j\pi f T_s}\big) = e^{-j\pi f T_s}\,2j\sin(\pi f T_s). $$
<p>Substitute back:</p>
$$ H(f) = \frac{e^{-j\pi f T_s}\,2j\sin(\pi f T_s)}{j2\pi f} = e^{-j\pi f T_s}\,\frac{\sin(\pi f T_s)}{\pi f}. $$

<p><b>Step 4 — magnitude and sinc form.</b> The exponential is pure phase (a half-sample delay), magnitude 1. Multiply top and bottom by $T_s$ to get the normalized sinc, $\operatorname{sinc}(x)=\sin(\pi x)/(\pi x)$:</p>
$$ |H(f)| = T_s\,\frac{\sin(\pi f T_s)}{\pi f T_s} = T_s\,\operatorname{sinc}(f T_s) = T_s\,\operatorname{sinc}(f/f_s). $$

<p><b>Result.</b></p>
$$ \boxed{\,H(f)=T_s\,\frac{\sin(\pi f T_s)}{\pi f T_s}=T_s\,\operatorname{sinc}(f/f_s)\,} $$
<p><b>Intuition.</b> Holding a value flat is a rectangle in time; a rectangle transforms to a sinc in frequency. The sinc gently rolls off across the band (causing "droop") and its nulls at multiples of $f_s$ partly suppress the images the sampler creates.</p>
`,

    // 1 — Sinc droop at Nyquist
    1: String.raw`
<p><b>Where we start.</b> The ZOH sinc response is flat only at DC; by the edge of the band ($f_s/2$, the Nyquist frequency) it has drooped. We compute exactly how much.</p>

<p><b>Step 1 — evaluate the sinc at Nyquist.</b> Take the normalized response $|H(f)|/T_s = \operatorname{sinc}(f/f_s)$ and set $f=f_s/2$, so $f/f_s=1/2$:</p>
$$ \operatorname{sinc}\!\Big(\tfrac12\Big) = \frac{\sin(\pi/2)}{\pi/2} = \frac{1}{\pi/2} = \frac{2}{\pi}. $$
<p>(Since $\sin(\pi/2)=1$.)</p>

<p><b>Step 2 — convert to dB relative to DC.</b> At DC the sinc is 1 (0 dB). The droop is the amplitude ratio in dB ($20\log_{10}$ because it's a voltage/amplitude ratio):</p>
$$ |H(f_s/2)|_{dB} = 20\log_{10}\!\Big(\frac{2}{\pi}\Big). $$

<p><b>Step 3 — evaluate.</b> $2/\pi \approx 0.6366$, and $20\log_{10}(0.6366) \approx -3.92$:</p>
$$ |H(f_s/2)|_{dB} \approx -3.92\ \text{dB}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\left|H(f_s/2)\right|_{dB}=20\log_{10}\!\left(\frac{\sin(\pi/2)}{\pi/2}\right)=20\log_{10}\frac{2}{\pi}=-3.92\ \text{dB}\,} $$
<p><b>Intuition.</b> A tone right at the band edge comes out almost $4$ dB weaker than one at DC — a real, fixed loss baked into every ZOH DAC. Systems that must be flat to the band edge apply inverse-sinc pre-emphasis to lift the high end back up.</p>
`,

    // 2 — General droop at fraction alpha of fs
    2: String.raw`
<p><b>Where we start.</b> We generalize the Nyquist-droop result to any output frequency $f$, expressed as a fraction $\alpha=f/f_s$ of the sample rate, so a designer can predict the loss anywhere in the band.</p>

<p><b>Step 1 — normalized sinc response.</b> From the ZOH derivation, the amplitude response relative to DC is</p>
$$ \frac{|H(f)|}{|H(0)|} = \operatorname{sinc}(f/f_s) = \frac{\sin(\pi f/f_s)}{\pi f/f_s}. $$

<p><b>Step 2 — substitute the fractional frequency.</b> Let $\alpha=f/f_s$:</p>
$$ \frac{|H|}{|H(0)|} = \frac{\sin(\pi\alpha)}{\pi\alpha}. $$

<p><b>Step 3 — express as droop in dB.</b> Amplitude ratio $\Rightarrow 20\log_{10}$:</p>
$$ \text{droop}(\alpha) = 20\log_{10}\!\left(\frac{\sin(\pi\alpha)}{\pi\alpha}\right). $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{droop}(\alpha)=20\log_{10}\!\left(\frac{\sin(\pi\alpha)}{\pi\alpha}\right),\quad \alpha=f/f_s\,} $$
<p><b>Sanity checks.</b> $\alpha\to 0$ gives $\sin(\pi\alpha)/(\pi\alpha)\to 1 \Rightarrow 0$ dB (flat at DC). $\alpha=0.5$ gives $-3.92$ dB, matching the Nyquist result. $\alpha=1$ (at $f_s$) gives a null ($-\infty$ dB) — the sinc's first zero, which is exactly why images get attenuated there.</p>
`,

    // 3 — Image frequencies
    3: String.raw`
<p><b>Where we start.</b> Because the DAC works from discrete samples, its output spectrum is periodic: the desired tone at $f_0$ is accompanied by "images" (copies) around every multiple of $f_s$. We derive their exact locations.</p>

<p><b>Step 1 — sampling makes the spectrum periodic.</b> A sampled signal's spectrum is the baseband spectrum replicated every $f_s$ (the sampling process convolves with an impulse train at spacing $f_s$). So a baseband tone at $f_0$ is copied to</p>
$$ n f_s + f_0, \qquad n = 0, \pm1, \pm2, \dots $$

<p><b>Step 2 — include the negative-frequency mirror.</b> A real tone at $f_0$ also has a component at $-f_0$; replicating <em>that</em> around $nf_s$ gives $nf_s - f_0$. Combining both signs:</p>
$$ f_{image} = n f_s \pm f_0. $$

<p><b>Step 3 — keep the physical images.</b> $n=0$ is the wanted baseband tone. The reconstruction filter must remove the first image pair at $n=1$ ($f_s\pm f_0$), then $n=2$, etc.:</p>
$$ f_{image} = n f_s \pm f_0, \quad n=1,2,3,\dots $$

<p><b>Result.</b></p>
$$ \boxed{\,f_{image}=n f_s \pm f_0,\quad n=1,2,3,\dots\,} $$
<p><b>Intuition.</b> Every image is the wanted tone reflected around a multiple of $f_s$. Example: $f_0=10$ MHz, $f_s=100$ MHz $\Rightarrow$ images at $90,110,\,190,210,\dots$ MHz. The ZOH sinc already dents these (nulls at $nf_s$), but an analog reconstruction filter finishes the job.</p>
`,

    // 4 — Inverse-sinc pre-emphasis
    4: String.raw`
<p><b>Where we start.</b> To cancel the ZOH droop, we pre-distort the digital signal with a filter whose response is the <em>reciprocal</em> of the sinc, so the cascade is flat. We derive that inverse-sinc gain.</p>

<p><b>Step 1 — the droop we must undo.</b> The ZOH imposes $\operatorname{sinc}(f/f_s)$ on amplitude. To flatten the total response, the pre-emphasis $G(f)$ must satisfy</p>
$$ G(f)\cdot \operatorname{sinc}(f/f_s) = 1. $$

<p><b>Step 2 — invert.</b></p>
$$ G(f) = \frac{1}{\operatorname{sinc}(f/f_s)}. $$

<p><b>Step 3 — expand the sinc.</b> With $\operatorname{sinc}(x)=\sin(\pi x)/(\pi x)$ and $x=f/f_s$:</p>
$$ G(f) = \frac{1}{\dfrac{\sin(\pi f/f_s)}{\pi f/f_s}} = \frac{\pi f/f_s}{\sin(\pi f/f_s)}. $$

<p><b>Result.</b></p>
$$ \boxed{\,G(f)=\frac{1}{\operatorname{sinc}(f/f_s)}=\frac{\pi f/f_s}{\sin(\pi f/f_s)}\,} $$
<p><b>Intuition.</b> Where the sinc dips (high frequencies), $G$ rises to compensate — it boosts $\approx +3.92$ dB at Nyquist, exactly cancelling the $-3.92$ dB droop. Implemented as a short digital FIR/IIR "inverse-sinc" filter ahead of the DAC, it delivers a flat passband right to the band edge.</p>
`,

    // 5 — DAC quantization SNR
    5: String.raw`
<p><b>Where we start.</b> A DAC also has finite resolution $N$: its output can only take $2^N$ levels, so it too injects quantization noise. The SNR derivation mirrors the ADC's exactly.</p>

<p><b>Step 1 — step size and noise power.</b> With full-scale range $V_{FS}$ and $N$ bits, the step is $\Delta=V_{FS}/2^N$. The rounding error is uniform over one step, so (as derived for the ADC) its power is</p>
$$ \sigma_q^2 = \frac{\Delta^2}{12} = \frac{V_{FS}^2}{12\cdot 2^{2N}}. $$

<p><b>Step 2 — full-scale sine power.</b> A sine using the whole range has amplitude $A=V_{FS}/2$ and power $A^2/2=V_{FS}^2/8$.</p>

<p><b>Step 3 — ratio and dB.</b></p>
$$ \text{SNR} = \frac{V_{FS}^2/8}{V_{FS}^2/(12\cdot 2^{2N})} = \frac{3}{2}\,2^{2N} \;\Rightarrow\; 10\log_{10}\!\Big(\tfrac{3}{2}2^{2N}\Big) = 6.02N + 1.76\ \text{dB}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{SNR}_{DAC}=6.02N+1.76\ \text{dB}\,} $$
<p><b>Intuition.</b> Quantization is symmetric between conversion directions: rounding a value to a level (ADC) and generating a value from a level (DAC) produce the same $\Delta^2/12$ noise, so the same $6$ dB/bit law holds. The DAC just adds the sinc droop and images on top.</p>
`
  },

  // ============================================================
  // AD9361 RF Transceiver
  // ============================================================
  'ad9361': {

    // 0 — Fractional-N LO frequency
    0: String.raw`
<p><b>Where we start.</b> The AD9361 tunes its local oscillator with a fractional-N PLL. We derive how a reference clock $f_{ref}$ is multiplied by a possibly non-integer factor to land on an arbitrary $f_{LO}$.</p>

<p><b>Step 1 — the PLL locks phases.</b> A phase-locked loop forces its feedback-divided output to equal the reference at the phase detector: $f_{VCO}/D = f_{ref}$, where $D$ is the feedback divide ratio. Hence $f_{VCO}=D\,f_{ref}$.</p>

<p><b>Step 2 — integer-N limitation.</b> If $D$ can only be an integer $N$, then $f_{LO}=N f_{ref}$ — output steps are coarse, only $f_{ref}$ apart. That is too coarse for fine RF tuning.</p>

<p><b>Step 3 — make the divider fractional.</b> A sigma-delta modulator dithers the divider between $N$ and $N+1$ so its <em>average</em> value is a fraction: $D = N + \dfrac{F}{M}$, where $F$ is the fractional numerator and $M$ the modulus (denominator). The effective divide is now continuous in steps of $f_{ref}/M$.</p>

<p><b>Step 4 — substitute.</b></p>
$$ f_{LO} = D\,f_{ref} = f_{ref}\Big(N + \frac{F}{M}\Big). $$

<p><b>Result.</b></p>
$$ \boxed{\,f_{LO}=f_{ref}\left(N + \frac{F}{M}\right)\,} $$
<p><b>Intuition.</b> The integer $N$ sets the coarse band; the fraction $F/M$ interpolates finely between integer multiples. With $f_{ref}=40$ MHz and a large modulus $M$, the AD9361 tunes anywhere from $70$ MHz to $6$ GHz with sub-hertz resolution.</p>
`,

    // 1 — Host data rate over the data port
    1: String.raw`
<p><b>Where we start.</b> The AD9361 streams 12-bit I/Q samples to the baseband processor. We count the bit rate the same way as the generic SDR throughput, now with the chip's fixed 12-bit converters.</p>

<p><b>Step 1 — bits per real sample.</b> The on-chip ADC/DAC resolution is $12$ bits, so each real sample carries $12$ bits.</p>

<p><b>Step 2 — I and Q.</b> Complex baseband sends two reals per complex sample, giving $12\times 2$ bits per complex sample.</p>

<p><b>Step 3 — sample rate and channels.</b> At $f_s$ complex samples/s over $N_{ch}$ channels (the AD9361 is 2×2):</p>
$$ R = f_s \times 12\ \text{bits} \times 2_{(I,Q)} \times N_{ch}. $$

<p><b>Result.</b></p>
$$ \boxed{\,R=f_s\times 12\ \text{bits}\times 2_{(I,Q)}\times N_{ch}\,} $$
<p><b>Sanity check.</b> $f_s=61.44$ MSPS, $N_{ch}=2$: $R=61.44\text{e}6\times12\times2\times2\approx 2.95$ Gbit/s across the LVDS/CMOS port — which is why the AD9361 uses a fast DDR data interface and on-chip decimation.</p>
`,

    // 2 — Image rejection after IQ calibration
    2: String.raw`
<p><b>Where we start.</b> Like any direct-conversion transceiver, the AD9361 has residual IQ gain error $\varepsilon$ and phase error $\psi$ after its on-chip calibration. The image rejection follows the same derivation as the general SDR case.</p>

<p><b>Step 1 — desired vs image amplitude.</b> An imperfect quadrature mix produces the wanted sideband with amplitude $\approx 1$ and a leaked image with amplitude $\approx \tfrac{\varepsilon}{2}+j\tfrac{\psi}{2}$ (first-order in the small errors).</p>

<p><b>Step 2 — power ratio.</b> IRR is desired power over image power:</p>
$$ \text{IRR} = \frac{1}{\big|\tfrac{\varepsilon}{2}+j\tfrac{\psi}{2}\big|^2} = \frac{1}{(\varepsilon/2)^2+(\psi/2)^2}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{IRR}\approx\frac{1}{(\varepsilon/2)^2+(\psi/2)^2}\,} $$
<p><b>Intuition.</b> The AD9361's built-in quadrature calibration continuously drives $\varepsilon$ and $\psi$ toward zero, so the denominator shrinks and IRR climbs — typically to the $50$–$70$ dB range, good enough for wideband LTE/5G channels without external image-reject filters.</p>
`,

    // 3 — Baseband filter bandwidth vs sample rate
    3: String.raw`
<p><b>Where we start.</b> The AD9361's programmable baseband filters must pass the wanted channel but stop everything that would alias when sampled at $f_s$. We derive the practical bandwidth limit.</p>

<p><b>Step 1 — Nyquist for complex baseband.</b> A complex-sampled channel spans $[-f_s/2, +f_s/2]$, a two-sided width of $f_s$. Anything beyond $\pm f_s/2$ folds back (aliases), so the analog baseband bandwidth must not exceed the one-sided Nyquist limit:</p>
$$ B_{BB} \le \frac{f_s}{2}. $$

<p><b>Step 2 — leave room for the transition band.</b> A real anti-alias filter cannot cut off infinitely sharply; it needs a finite transition region between passband and stopband. The digital decimation FIRs downstream also need guard band. So the usable bandwidth is strictly below Nyquist:</p>
$$ B_{BB} \lesssim \frac{f_s}{2}\quad\text{(with margin for the FIR transition band).} $$

<p><b>Result.</b></p>
$$ \boxed{\,B_{BB}\lesssim \frac{f_s}{2}\quad\text{with margin for the FIR transition band}\,} $$
<p><b>Intuition.</b> Nyquist gives the hard ceiling $f_s/2$; the "$\lesssim$" acknowledges that real filters roll off gradually, so designers typically use $\sim70$–$80\%$ of Nyquist. That is why the AD9361's $56$ MHz max channel bandwidth pairs with sample rates well above $56$ MSPS.</p>
`,

    // 4 — ADC/DAC ideal SNR (12-bit)
    4: String.raw`
<p><b>Where we start.</b> We plug the AD9361's specific 12-bit resolution into the ideal SNR law to get its best-case dynamic range.</p>

<p><b>Step 1 — the ideal law.</b> From the ADC derivation, an $N$-bit converter with a full-scale sine achieves</p>
$$ \text{SNR}_{ideal} = 6.02\,N + 1.76\ \text{dB}. $$

<p><b>Step 2 — substitute $N=12$.</b></p>
$$ \text{SNR}_{ideal} = 6.02\times 12 + 1.76. $$

<p><b>Step 3 — arithmetic.</b> $6.02\times 12 = 72.24$; add $1.76$:</p>
$$ \text{SNR}_{ideal} = 72.24 + 1.76 = 74.0\ \text{dB}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{SNR}_{ideal}=6.02\times12+1.76=74.0\ \text{dB}\,} $$
<p><b>Intuition.</b> $74$ dB is the theoretical ceiling of a perfect 12-bit converter. Real-world ENOB is lower (jitter, distortion, thermal noise), but on-chip processing gain from oversampling/decimation recovers much of the difference over a narrow channel.</p>
`
  },

  // ============================================================
  // RFSoC
  // ============================================================
  'rfsoc': {

    // 0 — Raw converter data rate
    0: String.raw`
<p><b>Where we start.</b> RFSoC converters run at gigasamples per second and there are many of them. Before any decimation, the raw firehose of bits is enormous. We count it from first principles.</p>

<p><b>Step 1 — bits per sample.</b> Each real sample from a converter is $N_{bits}$ wide.</p>

<p><b>Step 2 — samples per second.</b> The converter clocks at $f_s$ samples/s, so one converter produces $f_s\times N_{bits}$ bits/s.</p>

<p><b>Step 3 — many converters.</b> With $N_{ch}$ converter channels running in parallel:</p>
$$ R_{raw} = f_s \times N_{bits} \times N_{ch}. $$
<p>(Note: no $\times2$ here — this is the <em>raw real-sample</em> rate straight off the RF-ADC, before any digital down-conversion produces I/Q pairs.)</p>

<p><b>Result.</b></p>
$$ \boxed{\,R_{raw}=f_s\times N_{bits}\times N_{ch}\,} $$
<p><b>Sanity check.</b> $f_s=4$ GSPS, $12$ bits, $8$ ADCs: $R_{raw}=4\text{e}9\times12\times8\approx 384$ Gbit/s. No external bus can carry this, which is exactly why RFSoC hardens the DDCs on-chip to decimate before the data reaches the FPGA fabric.</p>
`,

    // 1 — Jitter-limited SNR at RF
    1: String.raw`
<p><b>Where we start.</b> RFSoC samples RF directly, so input frequencies are very high and clock jitter dominates. We re-derive the jitter SNR (same physics as the ADC case) to stress its role at RF.</p>

<p><b>Step 1 — timing error to amplitude error.</b> Sampling a signal $\delta t$ off gives $\delta x \approx \dot x\,\delta t$; error scales with slew rate.</p>

<p><b>Step 2 — full-scale sine slew.</b> For $x(t)=A\sin(2\pi f_{in}t)$, the RMS slew is $\dot x_{rms}=A\,2\pi f_{in}/\sqrt2$.</p>

<p><b>Step 3 — RMS error from RMS jitter $t_j$.</b> $\delta x_{rms}=\dot x_{rms}\,t_j = A\,2\pi f_{in}t_j/\sqrt2$.</p>

<p><b>Step 4 — SNR and dB.</b> Divide signal RMS $A/\sqrt2$ by error RMS; $A$ and $\sqrt2$ cancel, leaving $1/(2\pi f_{in}t_j)$. As a voltage ratio, take $20\log_{10}$:</p>
$$ \text{SNR}_{jitter} = -20\log_{10}(2\pi f_{in}t_j). $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{SNR}_{jitter}=-20\log_{10}(2\pi f_{in}t_j)\,} $$
<p><b>Intuition.</b> At $f_{in}=3$ GHz, even $t_j=50$ fs gives $\text{SNR}=-20\log_{10}(2\pi\cdot3\text{e}9\cdot50\text{e-}15)\approx 60.5$ dB — the clock, not the 12–14 bit resolution, caps performance. That is why RFSoC systems distribute ultra-low-jitter sampling clocks.</p>
`,

    // 2 — Nyquist zone for direct RF
    2: String.raw`
<p><b>Where we start.</b> Direct RF sampling deliberately places signals in higher Nyquist zones (above $f_s/2$) and lets aliasing fold them down. We derive which zone a given $f_{RF}$ lands in and where it appears in baseband.</p>

<p><b>Step 1 — divide the spectrum into zones.</b> Sampling at $f_s$ makes the spectrum repeat every $f_s$; each strip of width $f_s/2$ is a "Nyquist zone." Zone 1 is $[0, f_s/2]$, zone 2 is $[f_s/2, f_s]$, and so on. The zone number counts how many half-rates fit below $f_{RF}$, rounded up:</p>
$$ \text{zone} = \left\lceil \frac{f_{RF}}{f_s/2}\right\rceil. $$

<p><b>Step 2 — where it folds to.</b> The sampled tone appears at the aliased baseband frequency — the nearest replica to DC. With $k$ the integer nearest $f_{RF}/f_s$,</p>
$$ f_{base} = |f_{RF} - k f_s|. $$
<p>This is the same folding rule as ADC undersampling: subtract the closest multiple of $f_s$.</p>

<p><b>Result.</b></p>
$$ \boxed{\,\text{zone}=\left\lceil \frac{f_{RF}}{f_s/2}\right\rceil,\qquad f_{base}=|f_{RF}-k f_s|\,} $$
<p><b>Intuition.</b> Odd zones map "right-side up," even zones spectrally invert. Example: $f_{RF}=2.8$ GHz, $f_s=2$ GSPS $\Rightarrow$ zone $=\lceil2.8\rceil=3$; $k=\text{round}(1.4)=1$, $f_{base}=|2.8-2|=0.8$ GHz. RFSoC grabs the 2.8 GHz signal without any analog mixer — the sampler does the down-conversion.</p>
`,

    // 3 — DDC decimation and delivered rate
    3: String.raw`
<p><b>Where we start.</b> The on-chip Digital Down-Converter mixes a channel to baseband and decimates by $M$, drastically cutting the data the FPGA fabric must handle. We derive the output sample rate and the resulting fabric data rate.</p>

<p><b>Step 1 — decimation lowers the rate.</b> Decimating by $M$ keeps every $M$th sample after lowpass filtering, so the output sample rate is the ADC rate divided by $M$:</p>
$$ f_{s,out} = \frac{f_{s,ADC}}{M}. $$
<p>This is legitimate because the DDC first filters the channel down to a bandwidth $\le f_{s,out}/2$, satisfying Nyquist.</p>

<p><b>Step 2 — the DDC output is complex.</b> After the NCO mix, samples are complex I/Q: two reals per sample. So bits per output sample $= N_{bits}\times 2$.</p>

<p><b>Step 3 — fabric data rate.</b> Multiply output rate by bits/sample:</p>
$$ R_{fabric} = f_{s,out}\times N_{bits}\times 2_{(I,Q)}. $$

<p><b>Result.</b></p>
$$ \boxed{\,f_{s,out}=\frac{f_{s,ADC}}{M},\qquad R_{fabric}=f_{s,out}\times N_{bits}\times 2_{(I,Q)}\,} $$
<p><b>Sanity check.</b> $f_{s,ADC}=4$ GSPS, $M=16$, $16$-bit: $f_{s,out}=250$ MSPS, $R_{fabric}=250\text{e}6\times16\times2=8$ Gbit/s per channel — a huge reduction from the raw $\sim64$ Gbit/s that single converter would otherwise dump into the fabric. The DDC is what makes many-channel RFSoC feasible.</p>
`,

    // 4 — Array beamforming gain
    4: String.raw`
<p><b>Where we start.</b> A phased array combines $N$ element signals coherently. We derive why this yields $10\log_{10}(N)$ dB of SNR gain — the payoff for having many synchronized RFSoC channels.</p>

<p><b>Step 1 — coherent signal addition.</b> After aligning phases, the $N$ element signals are identical copies that add in <em>amplitude</em>. If each has voltage $s$, the summed signal voltage is $Ns$, so signal power is</p>
$$ P_{sig} = (Ns)^2 = N^2 s^2. $$

<p><b>Step 2 — incoherent noise addition.</b> Each element's thermal noise is independent (random, uncorrelated). Uncorrelated powers add, not amplitudes. With per-element noise power $\sigma^2$, total noise power is</p>
$$ P_{noise} = N\sigma^2. $$

<p><b>Step 3 — form the array SNR.</b></p>
$$ \text{SNR}_{array} = \frac{N^2 s^2}{N\sigma^2} = N\,\frac{s^2}{\sigma^2} = N\cdot \text{SNR}_{element}. $$
<p>The SNR improves by a factor of $N$.</p>

<p><b>Step 4 — convert to dB.</b> Power ratio $\Rightarrow 10\log_{10}$:</p>
$$ G_{array} = 10\log_{10}(N)\ \text{dB}. $$

<p><b>Result.</b></p>
$$ \boxed{\,G_{array}=10\log_{10}(N)\ \text{dB (coherent combining of }N\text{ elements)}\,} $$
<p><b>Intuition.</b> Signals add coherently ($N^2$ in power) while noise adds incoherently ($N$ in power); the $N^2/N=N$ ratio is the array gain. $64$ elements give $10\log_{10}64\approx 18$ dB — the reason RFSoC-based phased arrays see faint targets and support massive-MIMO beamforming.</p>
`
  }

});
