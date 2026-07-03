/* From-scratch derivations for the "Signals & Systems" category.
   Keyed by topic id, then by equation index (matching eqspec/signals-systems.json).
   Each value is an HTML string with MathJax ($...$ inline, $$...$$ display). */
Object.assign(CONTENT_DERIV, {

  'fourier-transform': {

    0: String.raw`
<p><b>Where we start.</b> A periodic signal of period $T_0$ can be written as a Fourier <i>series</i> — a sum of complex exponentials $e^{j2\pi k t/T_0}$ spaced $\Delta f = 1/T_0$ apart in frequency. We want the transform for a general (aperiodic) signal, so we let the period grow without bound and watch the discrete sum become an integral.</p>

<p><b>Step 1 — start from the Fourier series.</b> Any $T_0$-periodic $x_{T_0}(t)$ is a weighted sum of harmonics. This is the definition of the exponential Fourier series.</p>
$$ x_{T_0}(t)=\sum_{k=-\infty}^{\infty} c_k\, e^{\,j2\pi k t/T_0}, \qquad c_k=\frac{1}{T_0}\int_{-T_0/2}^{T_0/2} x_{T_0}(t)\,e^{-j2\pi k t/T_0}\,dt. $$

<p><b>Step 2 — name the harmonic frequencies.</b> The $k$-th harmonic sits at frequency $f_k=k/T_0$, and neighbouring harmonics are separated by $\Delta f = 1/T_0$. We define a "spectral sample" that strips out the $1/T_0$ factor.</p>
$$ f_k=\frac{k}{T_0},\qquad \Delta f=\frac{1}{T_0},\qquad X(f_k)\;\equiv\;T_0\,c_k=\int_{-T_0/2}^{T_0/2} x_{T_0}(t)\,e^{-j2\pi f_k t}\,dt. $$

<p><b>Step 3 — rewrite the series using $X(f_k)$.</b> Substituting $c_k = X(f_k)/T_0 = X(f_k)\,\Delta f$ turns the synthesis sum into a Riemann sum over frequency.</p>
$$ x_{T_0}(t)=\sum_{k=-\infty}^{\infty} X(f_k)\,e^{\,j2\pi f_k t}\,\Delta f. $$

<p><b>Step 4 — let the period go to infinity.</b> As $T_0\to\infty$ the signal stops repeating (it becomes aperiodic), the spacing $\Delta f\to df$ shrinks to a differential, and the discrete frequencies $f_k$ fill the whole real line into a continuous variable $f$. The Riemann sum becomes an integral (the synthesis / inverse transform).</p>
$$ x(t)=\int_{-\infty}^{\infty} X(f)\,e^{\,j2\pi f t}\,df. $$

<p><b>Step 5 — read off the analysis integral.</b> In the same limit the finite integral for $X(f_k)$ extends over all time, giving the coefficient that multiplies each exponential. This is the forward transform.</p>

<p><b>Result.</b> $$ \boxed{\,X(f)=\int_{-\infty}^{\infty} x(t)\,e^{-j2\pi f t}\,dt\,} $$ Intuition: $X(f)$ is the correlation of $x(t)$ with a probe tone $e^{-j2\pi f t}$ — it measures "how much" of frequency $f$ is present. Sanity check: at $f=0$ the exponential is $1$, so $X(0)=\int x(t)\,dt$, the DC area of the signal.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> We know the forward transform $X(f)=\int x(t)e^{-j2\pi ft}\,dt$. We want the spectrum of a delayed copy $x(t-t_0)$.</p>

<p><b>Step 1 — write the transform of the shifted signal.</b> Just plug $x(t-t_0)$ into the definition.</p>
$$ \mathcal{F}\{x(t-t_0)\}=\int_{-\infty}^{\infty} x(t-t_0)\,e^{-j2\pi f t}\,dt. $$

<p><b>Step 2 — substitute to line up the argument.</b> Let $\tau=t-t_0$, so $t=\tau+t_0$ and $dt=d\tau$. The limits stay $-\infty$ to $\infty$. This makes the signal depend only on $\tau$.</p>
$$ =\int_{-\infty}^{\infty} x(\tau)\,e^{-j2\pi f (\tau+t_0)}\,d\tau. $$

<p><b>Step 3 — split the exponential.</b> Because $e^{-j2\pi f(\tau+t_0)}=e^{-j2\pi f\tau}\,e^{-j2\pi f t_0}$, and the second factor does not depend on $\tau$, we pull it outside the integral.</p>
$$ =e^{-j2\pi f t_0}\int_{-\infty}^{\infty} x(\tau)\,e^{-j2\pi f\tau}\,d\tau = e^{-j2\pi f t_0}\,X(f). $$

<p><b>Result.</b> $$ \boxed{\,x(t-t_0)\;\leftrightarrow\; X(f)\,e^{-j2\pi f t_0}\,} $$ Intuition: delaying a signal doesn't change how much of each frequency it contains ($|X(f)|$ is unchanged) — it only adds a linear phase ramp $-2\pi f t_0$. Sanity check: a bigger delay $t_0$ twists the phase faster with $f$, exactly what a time offset should do.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> Convolution in time is $y(t)=\int x(\tau)h(t-\tau)\,d\tau$. We want to show its Fourier transform is the plain product $X(f)H(f)$.</p>

<p><b>Step 1 — transform the convolution.</b> Insert $y(t)$ into the forward transform, writing the convolution integral explicitly.</p>
$$ Y(f)=\int_{-\infty}^{\infty}\!\left[\int_{-\infty}^{\infty} x(\tau)\,h(t-\tau)\,d\tau\right] e^{-j2\pi f t}\,dt. $$

<p><b>Step 2 — swap the order of integration.</b> Both integrals are over all of $\mathbb{R}$ and (for well-behaved signals) absolutely integrable, so Fubini's theorem lets us integrate over $t$ first for each fixed $\tau$.</p>
$$ Y(f)=\int_{-\infty}^{\infty} x(\tau)\left[\int_{-\infty}^{\infty} h(t-\tau)\,e^{-j2\pi f t}\,dt\right]d\tau. $$

<p><b>Step 3 — evaluate the inner integral with the shift property.</b> The bracket is the transform of $h$ shifted by $\tau$, which equals $H(f)e^{-j2\pi f\tau}$ (proved in the time-shift derivation).</p>
$$ Y(f)=\int_{-\infty}^{\infty} x(\tau)\,H(f)\,e^{-j2\pi f\tau}\,d\tau. $$

<p><b>Step 4 — factor out $H(f)$.</b> $H(f)$ doesn't depend on $\tau$, so it comes out, leaving exactly the transform of $x$.</p>
$$ Y(f)=H(f)\int_{-\infty}^{\infty} x(\tau)\,e^{-j2\pi f\tau}\,d\tau = H(f)\,X(f). $$

<p><b>Result.</b> $$ \boxed{\,x(t)*h(t)\;\leftrightarrow\; X(f)\,H(f)\,} $$ Intuition: an LTI system just scales each frequency component by $H(f)$; the messy time-domain smearing becomes simple multiplication in frequency. Sanity check: convolving with $\delta(t)$ (whose transform is $1$) leaves $X(f)$ unchanged, as it must.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> Define the unit rectangle $\mathrm{rect}(t/T)=1$ for $|t|<T/2$ and $0$ otherwise — a pulse of width $T$ centred at the origin. We transform it directly.</p>

<p><b>Step 1 — apply the definition over the support.</b> The pulse is zero outside $[-T/2,T/2]$, so the infinite integral collapses to a finite one.</p>
$$ X(f)=\int_{-T/2}^{T/2} 1\cdot e^{-j2\pi f t}\,dt. $$

<p><b>Step 2 — integrate the exponential.</b> The antiderivative of $e^{-j2\pi f t}$ is $e^{-j2\pi f t}/(-j2\pi f)$.</p>
$$ X(f)=\left[\frac{e^{-j2\pi f t}}{-j2\pi f}\right]_{-T/2}^{T/2}=\frac{e^{-j\pi f T}-e^{\,j\pi f T}}{-j2\pi f}. $$

<p><b>Step 3 — turn exponentials into a sine.</b> Use $e^{j\theta}-e^{-j\theta}=2j\sin\theta$ with $\theta=\pi fT$; the numerator becomes $-2j\sin(\pi fT)$.</p>
$$ X(f)=\frac{-2j\sin(\pi fT)}{-j2\pi f}=\frac{\sin(\pi fT)}{\pi f}. $$

<p><b>Step 4 — write it as a normalized sinc.</b> Multiply top and bottom by $T$ so the argument matches $\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$.</p>
$$ X(f)=T\,\frac{\sin(\pi fT)}{\pi fT}=T\,\mathrm{sinc}(fT). $$

<p><b>Result.</b> $$ \boxed{\,\mathrm{rect}(t/T)\;\leftrightarrow\; T\,\mathrm{sinc}(fT)\,} $$ Intuition: a sharp-edged pulse spreads its energy over many frequencies (a sinc). Sanity check: at $f=0$, $\mathrm{sinc}(0)=1$ so $X(0)=T$, which equals the pulse's area — exactly the DC value predicted by $X(0)=\int x\,dt$.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> We want to show energy is the same whether measured in time or in frequency. Begin from the total energy $\int |x(t)|^2 dt = \int x(t)\,x^*(t)\,dt$.</p>

<p><b>Step 1 — replace one factor by its inverse transform.</b> Write $x(t)=\int X(f)e^{j2\pi ft}\,df$; take the complex conjugate for the $x^*(t)$ factor.</p>
$$ \int_{-\infty}^{\infty}|x(t)|^2 dt=\int_{-\infty}^{\infty} x(t)\left[\int_{-\infty}^{\infty} X^*(f)\,e^{-j2\pi f t}\,df\right]dt. $$

<p><b>Step 2 — swap the order of integration.</b> Integrate over $t$ first for each fixed $f$ (Fubini).</p>
$$ =\int_{-\infty}^{\infty} X^*(f)\left[\int_{-\infty}^{\infty} x(t)\,e^{-j2\pi f t}\,dt\right]df. $$

<p><b>Step 3 — recognize the inner integral.</b> The bracket is precisely the forward transform $X(f)$.</p>
$$ =\int_{-\infty}^{\infty} X^*(f)\,X(f)\,df=\int_{-\infty}^{\infty}|X(f)|^2 df. $$

<p><b>Result.</b> $$ \boxed{\,\int_{-\infty}^{\infty}|x(t)|^2 dt=\int_{-\infty}^{\infty}|X(f)|^2 df\,} $$ Intuition: the Fourier transform just re-books the same energy into frequency bins; nothing is created or lost. Sanity check: $|X(f)|^2$ is the energy spectral density — integrating it must return the total time-domain energy.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> We need one preliminary fact: the transform of a constant is a spike. Since $\int e^{-j2\pi ft}\,dt=\delta(f)$ (the standard integral representation of the delta), we have $1\leftrightarrow\delta(f)$, and by the shift-in-frequency (modulation) rule $e^{\,j2\pi f_0 t}\leftrightarrow\delta(f-f_0)$.</p>

<p><b>Step 1 — write cosine with Euler's formula.</b> A real cosine is the average of two counter-rotating phasors.</p>
$$ \cos(2\pi f_0 t)=\tfrac12 e^{\,j2\pi f_0 t}+\tfrac12 e^{-j2\pi f_0 t}. $$

<p><b>Step 2 — transform term by term.</b> The Fourier transform is linear, so we transform each exponential separately using $e^{\,j2\pi f_0 t}\leftrightarrow\delta(f-f_0)$ and $e^{-j2\pi f_0 t}\leftrightarrow\delta(f+f_0)$.</p>
$$ \mathcal{F}\{\cos(2\pi f_0 t)\}=\tfrac12\,\delta(f-f_0)+\tfrac12\,\delta(f+f_0). $$

<p><b>Result.</b> $$ \boxed{\,\cos(2\pi f_0 t)\;\leftrightarrow\;\tfrac12\delta(f-f_0)+\tfrac12\delta(f+f_0)\,} $$ Intuition: a pure tone is infinitely sharp in frequency — two impulses, one at $+f_0$ and one at $-f_0$. Sanity check: the transform is real and even, exactly as required for a real, even signal like the cosine.</p>
`,

    6: String.raw`
<p><b>Where we start.</b> Represent $x(t)$ by its inverse transform and differentiate. Begin with the synthesis integral.</p>
$$ x(t)=\int_{-\infty}^{\infty} X(f)\,e^{\,j2\pi f t}\,df. $$

<p><b>Step 1 — differentiate under the integral sign.</b> The frequency variable $f$ is independent of $t$, so $d/dt$ acts only on the exponential.</p>
$$ \frac{d}{dt}x(t)=\int_{-\infty}^{\infty} X(f)\,\frac{d}{dt}e^{\,j2\pi f t}\,df. $$

<p><b>Step 2 — differentiate the exponential.</b> $\dfrac{d}{dt}e^{\,j2\pi f t}=j2\pi f\,e^{\,j2\pi f t}$, which brings down a factor $j2\pi f$.</p>
$$ \frac{d}{dt}x(t)=\int_{-\infty}^{\infty}\big[j2\pi f\,X(f)\big]\,e^{\,j2\pi f t}\,df. $$

<p><b>Step 3 — read off the spectrum.</b> This is the inverse transform of the bracketed quantity, so that bracket <i>is</i> the transform of $x'(t)$.</p>

<p><b>Result.</b> $$ \boxed{\,\frac{d}{dt}x(t)\;\leftrightarrow\; j2\pi f\,X(f)\,} $$ Intuition: differentiation multiplies each frequency by $j2\pi f$, so it amplifies high frequencies and rotates their phase by $90^\circ$. Sanity check: DC ($f=0$) is killed — the derivative of a constant is zero.</p>
`,

    7: String.raw`
<p><b>Where we start.</b> We have $N$ samples $x[n]$, $n=0,\dots,N-1$, taken uniformly with spacing $T_s$. We want a finite, discrete version of the analysis integral $X(f)=\int x(t)e^{-j2\pi ft}\,dt$.</p>

<p><b>Step 1 — discretize the integral.</b> Replace $t\to nT_s$, the differential $dt\to T_s$, and the integral by a sum over the $N$ samples. This is a Riemann-sum approximation of the transform.</p>
$$ X(f)\approx \sum_{n=0}^{N-1} x[n]\,e^{-j2\pi f\,nT_s}\,T_s. $$

<p><b>Step 2 — evaluate only at the natural frequency grid.</b> With $N$ samples the resolvable frequencies are $f_k=k/(NT_s)$ for $k=0,\dots,N-1$. Substituting removes $T_s$ from the exponent's product $f_k\,nT_s = kn/N$.</p>
$$ X(f_k)\;\propto\;\sum_{n=0}^{N-1} x[n]\,e^{-j2\pi (k/(NT_s))\,nT_s}=\sum_{n=0}^{N-1} x[n]\,e^{-j2\pi kn/N}. $$

<p><b>Step 3 — drop the constant $T_s$ and define the DFT.</b> The scale factor $T_s$ is a convention; the standard DFT omits it, leaving the coefficient $X[k]$.</p>

<p><b>Result.</b> $$ \boxed{\,X[k]=\sum_{n=0}^{N-1} x[n]\,e^{-j2\pi kn/N}\,} $$ Intuition: the DFT correlates the sample block against $N$ discrete complex tones $e^{j2\pi kn/N}$ — one full turn of bin $k=1$ over the block, $k$ turns for bin $k$. Sanity check: $X[0]=\sum_n x[n]$, the sum (DC) of the samples, mirroring $X(0)=\int x\,dt$.</p>
`
  },

  'laplace-transform': {

    0: String.raw`
<p><b>Where we start.</b> The Fourier transform $\int x(t)e^{-j2\pi ft}dt$ fails to converge for signals that grow or don't decay (like $u(t)$ or $e^{2t}u(t)$). The fix is to multiply by a real decaying "convergence factor" $e^{-\sigma t}$ before transforming.</p>

<p><b>Step 1 — insert the convergence factor.</b> Fourier-transform the tamed signal $x(t)e^{-\sigma t}$ (using angular frequency $\omega$).</p>
$$ \int_{-\infty}^{\infty}\big[x(t)e^{-\sigma t}\big]e^{-j\omega t}\,dt=\int_{-\infty}^{\infty} x(t)\,e^{-(\sigma+j\omega)t}\,dt. $$

<p><b>Step 2 — combine into one complex frequency.</b> Define $s=\sigma+j\omega$. The two real and imaginary exponents merge into a single complex exponent.</p>
$$ X(s)=\int_{-\infty}^{\infty} x(t)\,e^{-st}\,dt. $$

<p><b>Step 3 — restrict to causal signals.</b> For systems that start at $t=0$, $x(t)=0$ for $t<0$. We take the lower limit as $0^-$ so any impulse or jump exactly at the origin is captured. This gives the unilateral (one-sided) Laplace transform.</p>

<p><b>Result.</b> $$ \boxed{\,X(s)=\int_{0^-}^{\infty} x(t)\,e^{-st}\,dt\,} $$ Intuition: Laplace is the Fourier transform of $x(t)$ pre-multiplied by $e^{-\sigma t}$, so tuning $\sigma$ can force convergence. Sanity check: set $\sigma=0$ ($s=j\omega$) and it reduces to the Fourier transform whenever that already converges.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> Transform the causal decaying exponential $x(t)=e^{-at}u(t)$ straight from the definition. The step $u(t)$ just sets the lower limit to $0$.</p>

<p><b>Step 1 — write the integral.</b> Combine the two exponentials in the integrand.</p>
$$ X(s)=\int_{0}^{\infty} e^{-at}\,e^{-st}\,dt=\int_{0}^{\infty} e^{-(s+a)t}\,dt. $$

<p><b>Step 2 — integrate.</b> The antiderivative of $e^{-(s+a)t}$ is $-\frac{1}{s+a}e^{-(s+a)t}$.</p>
$$ X(s)=\left[\frac{-1}{s+a}e^{-(s+a)t}\right]_{0}^{\infty}. $$

<p><b>Step 3 — evaluate the limits and demand convergence.</b> At the upper limit $e^{-(s+a)t}\to 0$ <i>only if</i> the real part $\mathrm{Re}(s+a)>0$, i.e. $\mathrm{Re}(s)>-a$. This inequality is the Region of Convergence. At the lower limit the term is $1$.</p>
$$ X(s)=0-\left(\frac{-1}{s+a}\right)=\frac{1}{s+a}. $$

<p><b>Result.</b> $$ \boxed{\,e^{-at}u(t)\;\leftrightarrow\;\frac{1}{s+a},\quad \mathrm{Re}(s)>-a\,} $$ Intuition: a decay rate $a$ in time becomes a single pole at $s=-a$ in the $s$-plane. Sanity check: on the imaginary axis $s=j\omega$ this becomes $1/(a+j\omega)$, the familiar first-order low-pass frequency response.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> We want the transform of a derivative $x'(t)$ in terms of $X(s)$. Start from the definition and use integration by parts.</p>
$$ \mathcal{L}\{x'(t)\}=\int_{0^-}^{\infty} x'(t)\,e^{-st}\,dt. $$

<p><b>Step 1 — integrate by parts.</b> Choose $u=e^{-st}$ (so $du=-s\,e^{-st}dt$) and $dv=x'(t)\,dt$ (so $v=x(t)$). Then $\int u\,dv=uv-\int v\,du$.</p>
$$ =\Big[x(t)e^{-st}\Big]_{0^-}^{\infty}+s\int_{0^-}^{\infty} x(t)\,e^{-st}\,dt. $$

<p><b>Step 2 — evaluate the boundary term.</b> Assuming convergence, $x(t)e^{-st}\to 0$ as $t\to\infty$; at the lower limit it equals $x(0^-)$. So the bracket contributes $0-x(0^-)$.</p>
$$ =-x(0^-)+s\int_{0^-}^{\infty} x(t)\,e^{-st}\,dt. $$

<p><b>Step 3 — recognize the remaining integral.</b> It is exactly $X(s)$.</p>
$$ =sX(s)-x(0^-). $$

<p><b>Result.</b> $$ \boxed{\,\mathcal{L}\{x'(t)\}=sX(s)-x(0^-)\,} $$ Intuition: differentiation becomes multiplication by $s$, and the initial condition $x(0^-)$ enters automatically — which is why Laplace solves initial-value ODEs so cleanly. Sanity check: if $x(0^-)=0$ this reduces to the pure $j\omega$-style factor from the Fourier differentiation rule.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> Let $y=x*h$ be the causal convolution $y(t)=\int_{0}^{t} x(\tau)h(t-\tau)\,d\tau$. We want its Laplace transform.</p>

<p><b>Step 1 — transform the convolution.</b> Insert $y(t)$ into the definition; extend the inner limit with the causal factor $h(t-\tau)=0$ for $t<\tau$.</p>
$$ Y(s)=\int_{0}^{\infty}\!\left[\int_{0}^{\infty} x(\tau)\,h(t-\tau)\,d\tau\right]e^{-st}\,dt. $$

<p><b>Step 2 — swap the integration order.</b> By Fubini, integrate over $t$ first for each fixed $\tau$.</p>
$$ Y(s)=\int_{0}^{\infty} x(\tau)\left[\int_{0}^{\infty} h(t-\tau)\,e^{-st}\,dt\right]d\tau. $$

<p><b>Step 3 — shift the inner integral.</b> Let $u=t-\tau$; then $e^{-st}=e^{-s(u+\tau)}=e^{-s\tau}e^{-su}$, and the inner integral becomes $e^{-s\tau}H(s)$.</p>
$$ Y(s)=\int_{0}^{\infty} x(\tau)\,e^{-s\tau}\,H(s)\,d\tau. $$

<p><b>Step 4 — factor out $H(s)$.</b> It is independent of $\tau$, leaving $X(s)$.</p>
$$ Y(s)=H(s)\int_{0}^{\infty} x(\tau)e^{-s\tau}d\tau=H(s)X(s). $$

<p><b>Result.</b> $$ \boxed{\,y=x*h\;\Rightarrow\; Y(s)=X(s)H(s)\,} $$ Intuition: the transfer function $H(s)$ multiplies the input spectrum, so cascaded systems simply multiply. Sanity check: matches the Fourier convolution theorem when $s=j\omega$.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> Consider the canonical second-order system: a mass–spring–damper or an RLC circuit whose output $y$ obeys a second-order linear ODE driven by input $x$.</p>
$$ \ddot{y}+2\zeta\omega_n\dot{y}+\omega_n^2\,y=\omega_n^2\,x. $$

<p><b>Step 1 — Laplace-transform with zero initial conditions.</b> Using $\mathcal{L}\{y'\}=sY$ and $\mathcal{L}\{y''\}=s^2Y$ (initial conditions zero for the transfer function), each derivative becomes a power of $s$.</p>
$$ s^2 Y(s)+2\zeta\omega_n\,sY(s)+\omega_n^2\,Y(s)=\omega_n^2\,X(s). $$

<p><b>Step 2 — factor $Y(s)$.</b> Collect the output on the left.</p>
$$ \big(s^2+2\zeta\omega_n s+\omega_n^2\big)Y(s)=\omega_n^2 X(s). $$

<p><b>Step 3 — form the transfer function.</b> Divide to get $H(s)=Y(s)/X(s)$.</p>
$$ H(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}. $$

<p><b>Result.</b> $$ \boxed{\,H(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}\,} $$ Intuition: $\omega_n$ sets the natural frequency (pole distance from the origin) and $\zeta$ the damping (how far poles sit into the left half-plane). Sanity check: at DC ($s=0$), $H(0)=1$ — unity steady-state gain, as the $\omega_n^2$ numerator was chosen to guarantee. Poles $s=-\zeta\omega_n\pm\omega_n\sqrt{\zeta^2-1}$ lie in the left half-plane (stable) for $\zeta>0$.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> We want the eventual steady value $x(\infty)$ directly from $X(s)$, without inverting. Start from the derivative rule $\mathcal{L}\{x'(t)\}=sX(s)-x(0^-)$.</p>

<p><b>Step 1 — write the derivative transform as an integral and take $s\to0$.</b> The left side is $\int_{0^-}^{\infty}x'(t)e^{-st}dt$; let $s\to0$ so $e^{-st}\to1$.</p>
$$ \lim_{s\to0}\int_{0^-}^{\infty} x'(t)\,e^{-st}\,dt=\int_{0^-}^{\infty} x'(t)\,dt. $$

<p><b>Step 2 — evaluate the plain integral of the derivative.</b> By the fundamental theorem of calculus, this telescopes to the net change in $x$.</p>
$$ \int_{0^-}^{\infty} x'(t)\,dt=\lim_{t\to\infty}x(t)-x(0^-). $$

<p><b>Step 3 — take the same limit on the algebraic side.</b> From $\mathcal{L}\{x'\}=sX(s)-x(0^-)$, letting $s\to0$ gives $\lim_{s\to0}sX(s)-x(0^-)$.</p>

<p><b>Step 4 — equate the two expressions and cancel $x(0^-)$.</b></p>
$$ \lim_{t\to\infty}x(t)-x(0^-)=\lim_{s\to0}sX(s)-x(0^-). $$

<p><b>Result.</b> $$ \boxed{\,\lim_{t\to\infty}x(t)=\lim_{s\to0}sX(s)\,} $$ Intuition: multiplying by $s$ cancels the pole of a step-like final value, and $s\to0$ isolates DC — the long-run average. Caveat / sanity check: valid only when the limit exists, i.e. all poles of $sX(s)$ are in the open left half-plane (no growth or sustained oscillation).</p>
`,

    6: String.raw`
<p><b>Where we start.</b> Both transforms integrate $x(t)$ against a complex exponential; the only difference is the exponent. Compare the two definitions side by side.</p>
$$ X(s)=\int_{0^-}^{\infty} x(t)\,e^{-st}\,dt,\qquad X(j\omega)=\int_{-\infty}^{\infty} x(t)\,e^{-j\omega t}\,dt. $$

<p><b>Step 1 — set $s=j\omega$.</b> Put $\sigma=0$ so the complex frequency lies on the imaginary axis. Then $e^{-st}=e^{-j\omega t}$, and the integrands coincide (for causal $x$).</p>
$$ X(s)\big|_{s=j\omega}=\int_{0^-}^{\infty} x(t)\,e^{-j\omega t}\,dt = X(j\omega). $$

<p><b>Step 2 — note the convergence caveat.</b> This substitution is valid only when the $j\omega$-axis lies inside the Region of Convergence, i.e. the system is stable (all poles strictly in the left half-plane).</p>

<p><b>Result.</b> $$ \boxed{\,X(j\omega)=X(s)\big|_{s=j\omega}\,} $$ Intuition: the Fourier transform is just the Laplace transform read off along the vertical imaginary axis of the $s$-plane. Sanity check: for $e^{-at}u(t)$, $X(s)=1/(s+a)$ gives $X(j\omega)=1/(a+j\omega)$, the correct frequency response — and only because the pole $s=-a$ ($a>0$) keeps the axis inside the ROC.</p>
`,

    7: String.raw`
<p><b>Where we start.</b> Transform the causal cosine $x(t)=\cos(\omega_0 t)u(t)$. First write the cosine as two phasors via Euler's formula.</p>
$$ \cos(\omega_0 t)=\tfrac12\big(e^{\,j\omega_0 t}+e^{-j\omega_0 t}\big). $$

<p><b>Step 1 — use the known exponential transform on each term.</b> We showed $e^{-at}u(t)\leftrightarrow 1/(s+a)$. Here $a=-j\omega_0$ and $a=+j\omega_0$ respectively.</p>
$$ X(s)=\tfrac12\cdot\frac{1}{s-j\omega_0}+\tfrac12\cdot\frac{1}{s+j\omega_0}. $$

<p><b>Step 2 — combine over a common denominator.</b> Add the fractions; the denominator is $(s-j\omega_0)(s+j\omega_0)=s^2+\omega_0^2$.</p>
$$ X(s)=\frac12\cdot\frac{(s+j\omega_0)+(s-j\omega_0)}{(s-j\omega_0)(s+j\omega_0)}=\frac12\cdot\frac{2s}{s^2+\omega_0^2}. $$

<p><b>Step 3 — simplify.</b> The $2$'s cancel.</p>
$$ X(s)=\frac{s}{s^2+\omega_0^2}. $$

<p><b>Result.</b> $$ \boxed{\,\cos(\omega_0 t)u(t)\;\leftrightarrow\;\frac{s}{s^2+\omega_0^2}\,} $$ Intuition: an undamped oscillation gives a pair of poles right on the imaginary axis at $s=\pm j\omega_0$ — marginally stable, ringing forever. Sanity check: at $t=0$, $x(0)=1$; the initial-value theorem $\lim_{s\to\infty}sX(s)=\lim s\cdot s/(s^2+\omega_0^2)=1$ agrees.</p>
`
  },

  'z-transform': {

    0: String.raw`
<p><b>Where we start.</b> We want the discrete-time analogue of the Laplace transform. A sampled signal is a train of impulses $x_s(t)=\sum_n x[n]\,\delta(t-nT_s)$; we'll Laplace-transform it and rename the variable.</p>

<p><b>Step 1 — Laplace-transform the impulse train.</b> Using $\mathcal{L}\{\delta(t-nT_s)\}=e^{-snT_s}$ and linearity, each sample contributes one term.</p>
$$ X_s(s)=\sum_{n=-\infty}^{\infty} x[n]\,e^{-s n T_s}. $$

<p><b>Step 2 — define the new variable.</b> The combination $e^{sT_s}$ appears raised to the power $n$. Define $z=e^{sT_s}$, so $e^{-snT_s}=z^{-n}$. This single substitution converts the transcendental exponentials into powers of $z$.</p>
$$ X(z)=\sum_{n=-\infty}^{\infty} x[n]\,z^{-n}. $$

<p><b>Result.</b> $$ \boxed{\,X(z)=\sum_{n=-\infty}^{\infty} x[n]\,z^{-n}\,} $$ Intuition: $z^{-1}$ is the unit-delay operator, so $X(z)$ is a polynomial (or power series) whose coefficients are the samples. Sanity check: the two-sided sum converges only for $z$ in an annulus — the Region of Convergence — which we track separately.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> We want the transform of a delayed sequence $x[n-k]$ in terms of $X(z)$. Start from the definition.</p>
$$ \mathcal{Z}\{x[n-k]\}=\sum_{n=-\infty}^{\infty} x[n-k]\,z^{-n}. $$

<p><b>Step 1 — reindex.</b> Let $m=n-k$, so $n=m+k$ and $z^{-n}=z^{-(m+k)}=z^{-k}z^{-m}$. The sum limits stay $\pm\infty$.</p>
$$ =\sum_{m=-\infty}^{\infty} x[m]\,z^{-k}z^{-m}. $$

<p><b>Step 2 — pull out the delay factor.</b> $z^{-k}$ is independent of $m$, so it factors out, leaving exactly $X(z)$.</p>
$$ =z^{-k}\sum_{m=-\infty}^{\infty} x[m]\,z^{-m}=z^{-k}X(z). $$

<p><b>Result.</b> $$ \boxed{\,x[n-k]\;\leftrightarrow\; z^{-k}X(z)\,} $$ Intuition: each unit of delay multiplies by $z^{-1}$ — this is exactly why $z^{-1}$ is drawn as a delay block in filter diagrams. Sanity check: $k=0$ gives $X(z)$ unchanged.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> Transform the causal geometric sequence $x[n]=a^n u[n]$, which is nonzero only for $n\ge0$.</p>

<p><b>Step 1 — apply the definition over $n\ge0$.</b> The step $u[n]$ truncates the sum to start at $n=0$.</p>
$$ X(z)=\sum_{n=0}^{\infty} a^n z^{-n}=\sum_{n=0}^{\infty}\big(az^{-1}\big)^{n}. $$

<p><b>Step 2 — sum the geometric series.</b> A geometric series $\sum_{n=0}^\infty r^n$ equals $1/(1-r)$ provided $|r|<1$. Here $r=az^{-1}$, so convergence requires $|az^{-1}|<1$, i.e. $|z|>|a|$ — the Region of Convergence.</p>
$$ X(z)=\frac{1}{1-az^{-1}},\qquad |z|>|a|. $$

<p><b>Result.</b> $$ \boxed{\,a^n u[n]\;\leftrightarrow\;\frac{1}{1-az^{-1}},\quad |z|>|a|\,} $$ Intuition: the sequence's growth rate $a$ becomes a pole at $z=a$; the ROC is everything outside that pole (typical of causal signals). Sanity check: the system is stable iff the ROC contains the unit circle, i.e. $|a|<1$ — a decaying sequence, exactly as expected.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> Let $y[n]=(x*h)[n]=\sum_k x[k]h[n-k]$. We want $Y(z)$.</p>

<p><b>Step 1 — transform the convolution.</b> Insert $y[n]$ into the definition.</p>
$$ Y(z)=\sum_{n}\left[\sum_{k} x[k]\,h[n-k]\right]z^{-n}. $$

<p><b>Step 2 — swap the sums.</b> Both sums are over all integers; interchange them to sum over $n$ first for each fixed $k$.</p>
$$ Y(z)=\sum_{k} x[k]\left[\sum_{n} h[n-k]\,z^{-n}\right]. $$

<p><b>Step 3 — apply the delay property to the inner sum.</b> The bracket is the transform of $h$ shifted by $k$, namely $z^{-k}H(z)$.</p>
$$ Y(z)=\sum_{k} x[k]\,z^{-k}H(z). $$

<p><b>Step 4 — factor out $H(z)$.</b> It is independent of $k$, leaving $X(z)$.</p>
$$ Y(z)=H(z)\sum_{k} x[k]z^{-k}=H(z)X(z). $$

<p><b>Result.</b> $$ \boxed{\,x[n]*h[n]\;\leftrightarrow\; X(z)H(z)\,} $$ Intuition: filtering is multiplication in the $z$-domain, so cascaded filters multiply their transfer functions. Sanity check: convolving with the unit sample $\delta[n]$ (whose transform is $1$) leaves $X(z)$ unchanged.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> A digital filter is described by a linear constant-coefficient difference equation relating output $y$ and input $x$ with delayed taps.</p>
$$ \sum_{k} a_k\,y[n-k]=\sum_{m} b_m\,x[n-m]. $$

<p><b>Step 1 — take the Z-transform of both sides.</b> Using linearity and the delay property $y[n-k]\leftrightarrow z^{-k}Y(z)$ (and likewise for $x$), each delayed tap becomes a power of $z^{-1}$.</p>
$$ \sum_{k} a_k\,z^{-k}\,Y(z)=\sum_{m} b_m\,z^{-m}\,X(z). $$

<p><b>Step 2 — factor $Y(z)$ and $X(z)$ out of their sums.</b> They don't depend on the summation index.</p>
$$ Y(z)\sum_{k} a_k z^{-k}=X(z)\sum_{m} b_m z^{-m}. $$

<p><b>Step 3 — solve for the transfer function.</b> Divide to isolate $H(z)=Y(z)/X(z)$.</p>
$$ H(z)=\frac{Y(z)}{X(z)}=\frac{\sum_{m} b_m z^{-m}}{\sum_{k} a_k z^{-k}}. $$

<p><b>Result.</b> $$ \boxed{\,H(z)=\frac{\sum_{m} b_m z^{-m}}{\sum_{k} a_k z^{-k}}\,} $$ Intuition: the feed-forward ($b$) taps place zeros, the feedback ($a$) taps place poles; the difference equation and $H(z)$ are two views of the same filter. Sanity check: with only $b_0$ (no feedback, $a_0=1$) the filter is FIR and $H(z)$ is a polynomial in $z^{-1}$ — all zeros, no poles.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> The DTFT is $X(e^{j\omega})=\sum_n x[n]e^{-j\omega n}$; the Z-transform is $X(z)=\sum_n x[n]z^{-n}$. Compare them.</p>

<p><b>Step 1 — set $z=e^{j\omega}$.</b> Write $z=re^{j\omega}$ and put $r=1$, placing $z$ on the unit circle. Then $z^{-n}=e^{-j\omega n}$, and the two sums become identical.</p>
$$ X(z)\big|_{z=e^{j\omega}}=\sum_{n} x[n]\,e^{-j\omega n}=X(e^{j\omega}). $$

<p><b>Step 2 — note the validity condition.</b> This holds only if the unit circle lies inside the Region of Convergence — i.e. the sequence is (BIBO) stable.</p>

<p><b>Result.</b> $$ \boxed{\,X(e^{j\omega})=X(z)\big|_{z=e^{j\omega}}\,} $$ Intuition: just as Fourier is Laplace on the imaginary axis, the DTFT is the Z-transform read off along the unit circle; the angle $\omega$ around the circle is digital frequency. Sanity check: $\omega=0$ ($z=1$) gives $\sum_n x[n]$, the DC sum.</p>
`,

    6: String.raw`
<p><b>Where we start.</b> When we derived the Z-transform from sampling, we introduced $z=e^{sT_s}$. Let's make the meaning of this map explicit by tracking where the stability boundary goes.</p>

<p><b>Step 1 — write $s$ in real/imaginary parts.</b> Let $s=\sigma+j\omega$. Then the map factors into magnitude and phase.</p>
$$ z=e^{sT_s}=e^{(\sigma+j\omega)T_s}=e^{\sigma T_s}\,e^{\,j\omega T_s}. $$

<p><b>Step 2 — read off magnitude and angle.</b> The modulus is $|z|=e^{\sigma T_s}$ and the argument is $\angle z=\omega T_s$.</p>

<p><b>Step 3 — map the key regions.</b> The imaginary axis $\sigma=0$ gives $|z|=1$ (the unit circle); the left half-plane $\sigma<0$ gives $|z|<1$ (inside the circle); the right half-plane $\sigma>0$ gives $|z|>1$ (outside). Continuous stability (LHP) maps to discrete stability (inside the unit circle).</p>

<p><b>Result.</b> $$ \boxed{\,z=e^{sT_s}\,} $$ Intuition: this is the exact bridge between analog and digital worlds — poles in the stable LHP land inside the unit circle. Sanity check: increasing $\omega$ by $2\pi/T_s$ leaves $z$ unchanged (adds $2\pi$ to the angle), which is exactly the spectral periodicity that sampling introduces.</p>
`,

    7: String.raw`
<p><b>Where we start.</b> Given the first-order IIR transfer function, find its impulse response $h[n]$ by inverting the Z-transform.</p>
$$ H(z)=\frac{1}{1-az^{-1}}. $$

<p><b>Step 1 — expand as a power series.</b> Recognize the closed form of a geometric series: $\frac{1}{1-r}=\sum_{n=0}^\infty r^n$ with $r=az^{-1}$, valid for $|az^{-1}|<1$ i.e. $|z|>|a|$ (the causal ROC).</p>
$$ H(z)=\sum_{n=0}^{\infty}\big(az^{-1}\big)^{n}=\sum_{n=0}^{\infty} a^n\,z^{-n}. $$

<p><b>Step 2 — match coefficients to the definition.</b> By definition $H(z)=\sum_n h[n]z^{-n}$, so the coefficient of $z^{-n}$ is $h[n]$. Reading off: $h[n]=a^n$ for $n\ge0$ and $0$ otherwise, i.e. $h[n]=a^n u[n]$.</p>

<p><b>Result.</b> $$ \boxed{\,H(z)=\frac{1}{1-az^{-1}}\;\Rightarrow\; h[n]=a^n u[n]\,} $$ Intuition: a single pole at $z=a$ produces a geometrically decaying (if $|a|<1$) impulse response — the feedback tap $a$ multiplies the previous output each step. Sanity check: this is exactly the inverse of the forward pair $a^n u[n]\leftrightarrow 1/(1-az^{-1})$ derived earlier.</p>
`
  },

  'convolution': {

    0: String.raw`
<p><b>Where we start.</b> We build the LTI output from two properties only: <i>linearity</i> (superposition scales and adds) and <i>time-invariance</i> (a shifted input produces an equally shifted output). Let $h(t)$ be the response to the impulse $\delta(t)$.</p>

<p><b>Step 1 — represent the input by sifting.</b> Any input is a continuous "sum" of shifted, scaled impulses — this is the sifting property of the delta.</p>
$$ x(t)=\int_{-\infty}^{\infty} x(\tau)\,\delta(t-\tau)\,d\tau. $$

<p><b>Step 2 — apply time-invariance to the impulse response.</b> The system's response to $\delta(t-\tau)$ is the impulse response shifted by $\tau$: $h(t-\tau)$.</p>
$$ \delta(t-\tau)\;\longrightarrow\; h(t-\tau). $$

<p><b>Step 3 — apply linearity (superposition).</b> The input is a weighted superposition of impulses $\delta(t-\tau)$ with weights $x(\tau)$; by linearity the output is the same superposition of the individual responses $h(t-\tau)$.</p>
$$ y(t)=\int_{-\infty}^{\infty} x(\tau)\,h(t-\tau)\,d\tau. $$

<p><b>Result.</b> $$ \boxed{\,y(t)=\int_{-\infty}^{\infty} x(\tau)\,h(t-\tau)\,d\tau\,} $$ Intuition: every LTI system is completely described by its impulse response; the output is the input "smeared" by a flipped, slid copy of $h$. Sanity check: if $h(t)=\delta(t)$ the sifting property returns $y(t)=x(t)$ — a system that does nothing.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> The convolution integral is $y(t)=(x*h)(t)=\int_{-\infty}^{\infty} x(\tau)h(t-\tau)\,d\tau$. We show swapping the roles of $x$ and $h$ gives the same result.</p>

<p><b>Step 1 — substitute to flip the integration variable.</b> Let $u=t-\tau$, so $\tau=t-u$ and $d\tau=-du$. As $\tau$ runs $-\infty\to\infty$, $u$ runs $\infty\to-\infty$; the sign from $du$ flips the limits back.</p>
$$ (x*h)(t)=\int_{\infty}^{-\infty} x(t-u)\,h(u)\,(-du)=\int_{-\infty}^{\infty} h(u)\,x(t-u)\,du. $$

<p><b>Step 2 — recognize the result.</b> The last integral is by definition $(h*x)(t)$.</p>
$$ =\int_{-\infty}^{\infty} h(u)\,x(t-u)\,du=(h*x)(t). $$

<p><b>Result.</b> $$ \boxed{\,x*h=h*x\,} $$ Intuition: it doesn't matter which signal you flip-and-slide; the overlap area is symmetric. Sanity check: for an LTI system this means "input through system" and "impulse response through the input" compute the same output.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> We prove convolution in time becomes multiplication in frequency, starting from the transform of $y=x*h$.</p>

<p><b>Step 1 — transform the convolution.</b> Insert the convolution integral into the Fourier definition.</p>
$$ \mathcal{F}\{x*h\}=\int_{-\infty}^{\infty}\!\left[\int_{-\infty}^{\infty} x(\tau)h(t-\tau)\,d\tau\right]e^{-j2\pi ft}\,dt. $$

<p><b>Step 2 — swap the order of integration.</b> By Fubini, integrate over $t$ first for fixed $\tau$.</p>
$$ =\int_{-\infty}^{\infty} x(\tau)\left[\int_{-\infty}^{\infty} h(t-\tau)e^{-j2\pi ft}\,dt\right]d\tau. $$

<p><b>Step 3 — use the time-shift property on the inner integral.</b> A shift by $\tau$ multiplies $H(f)$ by $e^{-j2\pi f\tau}$.</p>
$$ =\int_{-\infty}^{\infty} x(\tau)\,H(f)\,e^{-j2\pi f\tau}\,d\tau = H(f)\int_{-\infty}^{\infty} x(\tau)e^{-j2\pi f\tau}\,d\tau=X(f)H(f). $$

<p><b>Result.</b> $$ \boxed{\,\mathcal{F}\{x*h\}=X(f)H(f)\,} $$ Intuition: this is why filtering is analysed in the frequency domain — a hard convolution turns into a simple multiply. Sanity check: matches the Fourier-transform topic's convolution theorem exactly.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> We prove the delta is the identity element of convolution. Convolve $x(t)$ with $\delta(t)$ using the definition.</p>
$$ (x*\delta)(t)=\int_{-\infty}^{\infty} x(\tau)\,\delta(t-\tau)\,d\tau. $$

<p><b>Step 1 — apply the sifting property.</b> The delta $\delta(t-\tau)$ is zero everywhere except at $\tau=t$, where it "samples" the integrand. The sifting property states $\int x(\tau)\delta(t-\tau)\,d\tau=x(t)$.</p>
$$ (x*\delta)(t)=x(t). $$

<p><b>Result.</b> $$ \boxed{\,x(t)*\delta(t)=x(t)\,} $$ Intuition: the impulse is the "do-nothing" system — passing a signal through it returns the signal untouched. Sanity check: in frequency, $\Delta(f)=1$, so $X(f)\cdot 1=X(f)$, consistent with the convolution theorem.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> Convolve two identical unit-height pulses of width $T$: $g(t)=\mathrm{rect}(t/T)$, each equal to $1$ on $|t|<T/2$. Compute $y(t)=(g*g)(t)=\int g(\tau)g(t-\tau)\,d\tau$.</p>

<p><b>Step 1 — interpret the integral as overlap area.</b> The integrand is $1$ only where both pulses are $1$: where $|\tau|<T/2$ <i>and</i> $|t-\tau|<T/2$. So $y(t)$ is the length of the overlap of a fixed window with a sliding window.</p>

<p><b>Step 2 — find the overlap limits.</b> The two conditions give $\max(-T/2,\;t-T/2)\le\tau\le\min(T/2,\;t+T/2)$. The overlap length is the upper minus lower limit when positive.</p>
$$ y(t)=\big[\min(T/2,t+T/2)-\max(-T/2,t-T/2)\big]_{+}. $$

<p><b>Step 3 — evaluate for $0\le t\le T$.</b> Here the limits are $t-T/2$ and $T/2$, so the overlap is $T/2-(t-T/2)=T-t$. By symmetry, for $-T\le t\le0$ it is $T+t=T-|t|$. Outside $|t|>T$ there is no overlap.</p>
$$ y(t)=\begin{cases} T-|t|, & |t|\le T\\ 0,& |t|>T.\end{cases} $$

<p><b>Step 4 — write as a triangle.</b> Define $\mathrm{tri}(t/T)=1-|t|/T$ for $|t|\le T$. Then $y(t)=T\big(1-|t|/T\big)=T\,\mathrm{tri}(t/T)$.</p>

<p><b>Result.</b> $$ \boxed{\,\mathrm{rect}(t/T)*\mathrm{rect}(t/T)=T\,\mathrm{tri}(t/T)\,} $$ Intuition: sliding one box across an identical box grows then shrinks the overlap linearly — a triangle. Sanity check (frequency): $\mathcal{F}\{\mathrm{rect}(t/T)\}=T\mathrm{sinc}(fT)$, and squaring gives $T^2\mathrm{sinc}^2(fT)$, which is indeed the transform of $T\,\mathrm{tri}(t/T)$. The peak $y(0)=T$ equals the pulse area, as expected.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> Let $x(t)$ be nonzero only on an interval of length $D_x$ (its duration) and $h(t)$ nonzero only on an interval of length $D_h$. We ask over what range $y=x*h$ can be nonzero.</p>

<p><b>Step 1 — find the support edges of each signal.</b> Say $x$ is supported on $[a_x,b_x]$ with $D_x=b_x-a_x$, and $h$ on $[a_h,b_h]$ with $D_h=b_h-a_h$.</p>

<p><b>Step 2 — locate where the convolution integrand can be nonzero.</b> $y(t)=\int x(\tau)h(t-\tau)\,d\tau$ is nonzero only if there is a $\tau$ with $\tau\in[a_x,b_x]$ <i>and</i> $t-\tau\in[a_h,b_h]$. Adding these ranges, $t=\tau+(t-\tau)$ can span from the smallest to largest sum.</p>
$$ a_x+a_h\;\le\; t\;\le\; b_x+b_h. $$

<p><b>Step 3 — compute the output duration.</b> Subtract the endpoints.</p>
$$ \mathrm{dur}(y)=(b_x+b_h)-(a_x+a_h)=(b_x-a_x)+(b_h-a_h)=D_x+D_h. $$

<p><b>Result.</b> $$ \boxed{\,\mathrm{dur}(x*h)=\mathrm{dur}(x)+\mathrm{dur}(h)\,} $$ Intuition: sliding one finite signal fully across the other stretches the region of overlap to the sum of the two lengths. Sanity check: the rect$*$rect case has $D_x=D_h=T$ and yields a triangle of total width $2T$ — exactly $T+T$.</p>
`,

    6: String.raw`
<p><b>Where we start.</b> Repeat the LTI superposition argument in discrete time. Let $h[n]$ be the response to the unit sample $\delta[n]$; assume linearity and time-invariance.</p>

<p><b>Step 1 — represent the input by the sampling property.</b> Any sequence is a sum of shifted, scaled unit samples.</p>
$$ x[n]=\sum_{k=-\infty}^{\infty} x[k]\,\delta[n-k]. $$

<p><b>Step 2 — time-invariance gives the shifted response.</b> The response to $\delta[n-k]$ is $h[n-k]$.</p>
$$ \delta[n-k]\;\longrightarrow\; h[n-k]. $$

<p><b>Step 3 — linearity superposes the responses.</b> Weight each shifted response by $x[k]$ and sum.</p>
$$ y[n]=\sum_{k=-\infty}^{\infty} x[k]\,h[n-k]. $$

<p><b>Result.</b> $$ \boxed{\,y[n]=\sum_{k} x[k]\,h[n-k]\,} $$ Intuition: the discrete output is a running weighted sum of past and future inputs, weighted by the flipped impulse response. Sanity check: with $h[n]=\delta[n]$ the sum collapses to $y[n]=x[n]$.</p>
`,

    7: String.raw`
<p><b>Where we start.</b> The convolution theorem says convolution in time $\leftrightarrow$ multiplication in frequency. By the symmetry (duality) of the Fourier transform, the reverse must hold: multiplication in time $\leftrightarrow$ convolution in frequency. Let's prove it directly.</p>

<p><b>Step 1 — transform the product.</b> Write the Fourier transform of $x(t)y(t)$ and expand one factor by its inverse transform, $x(t)=\int X(\nu)e^{j2\pi\nu t}\,d\nu$.</p>
$$ \mathcal{F}\{x(t)y(t)\}=\int_{-\infty}^{\infty}\!\left[\int_{-\infty}^{\infty} X(\nu)e^{\,j2\pi\nu t}d\nu\right]y(t)\,e^{-j2\pi ft}\,dt. $$

<p><b>Step 2 — swap the order of integration.</b> Integrate over $t$ first for each fixed $\nu$.</p>
$$ =\int_{-\infty}^{\infty} X(\nu)\left[\int_{-\infty}^{\infty} y(t)\,e^{-j2\pi (f-\nu)t}\,dt\right]d\nu. $$

<p><b>Step 3 — recognize the inner integral as $Y$ evaluated at $f-\nu$.</b></p>
$$ =\int_{-\infty}^{\infty} X(\nu)\,Y(f-\nu)\,d\nu=(X*Y)(f). $$

<p><b>Result.</b> $$ \boxed{\,x(t)\,y(t)\;\leftrightarrow\; X(f)*Y(f)\,} $$ Intuition: modulating (multiplying) two signals smears their spectra together — the basis of AM and mixing. Sanity check: multiplying by $\cos(2\pi f_0 t)$ convolves the spectrum with two impulses at $\pm f_0$, i.e. shifts it up and down — exactly frequency translation.</p>
`
  },

  'correlation': {

    0: String.raw`
<p><b>Where we start.</b> We want a number that quantifies how similar two signals $x$ and $y$ are when one is slid by a lag $\tau$. The natural similarity measure is the inner product $\int x^*(t)\,y(t)\,dt$; we generalize by shifting $y$.</p>

<p><b>Step 1 — form the inner product of $x$ with a shifted $y$.</b> Slide $y$ earlier by $\tau$ (i.e. use $y(t+\tau)$) and take the overlap. The conjugate on $x$ keeps the measure well-defined for complex signals.</p>
$$ R_{xy}(\tau)=\int_{-\infty}^{\infty} x^*(t)\,y(t+\tau)\,dt. $$

<p><b>Step 2 — interpret each lag.</b> For each $\tau$ this integral accumulates the product of $x$ and a time-advanced copy of $y$; large positive values mean the two line up well at that lag.</p>

<p><b>Result.</b> $$ \boxed{\,R_{xy}(\tau)=\int_{-\infty}^{\infty} x^*(t)\,y(t+\tau)\,dt\,} $$ Intuition: cross-correlation is a "matching score" versus shift — it peaks at the lag where the signals best align, which is how receivers find timing. Sanity check: if $y=x$, the peak occurs at $\tau=0$ (a signal matches itself best with no shift).</p>
`,

    1: String.raw`
<p><b>Where we start.</b> Correlation slides <i>without</i> flipping; convolution slides <i>with</i> a flip. We show correlation is a convolution of $y$ with a time-reversed, conjugated $x$. Start from the definition.</p>
$$ R_{xy}(\tau)=\int_{-\infty}^{\infty} x^*(t)\,y(t+\tau)\,dt. $$

<p><b>Step 1 — substitute to expose a convolution form.</b> Let $u=t$, and rewrite the shift so the free variable sits like a convolution. Set $t=\sigma$; we want the integrand as $[\text{function of }\sigma]\cdot[\text{function of }\tau-\sigma]$. Replace $t\to -\sigma$ is cleaner: let $\sigma=-t$, so $t=-\sigma$, $dt=-d\sigma$, and $y(t+\tau)=y(\tau-\sigma)$.</p>
$$ R_{xy}(\tau)=\int_{-\infty}^{\infty} x^*(-\sigma)\,y(\tau-\sigma)\,d\sigma. $$

<p><b>Step 2 — recognize the convolution.</b> Define $\tilde{x}(\sigma)=x^*(-\sigma)$. The integral is exactly $\int \tilde{x}(\sigma)\,y(\tau-\sigma)\,d\sigma=(\tilde{x}*y)(\tau)$.</p>
$$ R_{xy}(\tau)=\big(x^*(-\cdot)\big)*y\,(\tau). $$

<p><b>Result.</b> $$ \boxed{\,R_{xy}(\tau)=x^*(-\tau)*y(\tau)\,} $$ Intuition: correlation = convolution after flipping and conjugating one signal; the flip cancels convolution's built-in flip, so nothing is reversed net. Sanity check (frequency): this gives $R_{xy}\leftrightarrow X^*(f)Y(f)$, the cross-spectrum — the foundation of the Wiener–Khinchin theorem.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> Autocorrelation is cross-correlation of a signal with itself: $R_{xx}(\tau)=\int x^*(t)x(t+\tau)\,dt$. Evaluate it at zero lag.</p>

<p><b>Step 1 — set $\tau=0$.</b> With no shift the two copies coincide, so the integrand is $x^*(t)x(t)=|x(t)|^2$.</p>
$$ R_{xx}(0)=\int_{-\infty}^{\infty} x^*(t)\,x(t)\,dt=\int_{-\infty}^{\infty} |x(t)|^2\,dt. $$

<p><b>Step 2 — identify the energy.</b> The integral of $|x(t)|^2$ over all time is by definition the total signal energy $E$.</p>
$$ R_{xx}(0)=E. $$

<p><b>Result.</b> $$ \boxed{\,R_{xx}(0)=\int_{-\infty}^{\infty}|x(t)|^2 dt=E\,} $$ Intuition: a signal is most correlated with itself at zero shift, and that peak value is exactly its energy. Sanity check: $R_{xx}(\tau)\le R_{xx}(0)$ for all $\tau$ (Cauchy–Schwarz) — the autocorrelation peaks at the origin.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> We prove the power/energy spectrum is the Fourier transform of the autocorrelation. Start from $R_{xx}(\tau)=\int x^*(t)x(t+\tau)\,dt$ and transform it in $\tau$.</p>

<p><b>Step 1 — Fourier-transform $R_{xx}(\tau)$.</b> Write the transform and substitute the definition of $R_{xx}$.</p>
$$ S_x(f)=\int_{-\infty}^{\infty} R_{xx}(\tau)e^{-j2\pi f\tau}d\tau=\int_{-\infty}^{\infty}\!\left[\int_{-\infty}^{\infty} x^*(t)x(t+\tau)\,dt\right]e^{-j2\pi f\tau}\,d\tau. $$

<p><b>Step 2 — swap the order and substitute $u=t+\tau$.</b> Integrate over $\tau$ first (with $t$ fixed), using $\tau=u-t$, $d\tau=du$, so $e^{-j2\pi f\tau}=e^{-j2\pi f(u-t)}=e^{-j2\pi fu}e^{\,j2\pi ft}$.</p>
$$ S_x(f)=\int_{-\infty}^{\infty} x^*(t)e^{\,j2\pi ft}\left[\int_{-\infty}^{\infty} x(u)e^{-j2\pi fu}\,du\right]dt. $$

<p><b>Step 3 — factor into two transforms.</b> The inner integral is $X(f)$; the outer $\int x^*(t)e^{j2\pi ft}dt$ is $X^*(f)$. Their product is $|X(f)|^2$.</p>
$$ S_x(f)=X^*(f)\,X(f)=|X(f)|^2. $$

<p><b>Result.</b> $$ \boxed{\,S_x(f)=\int_{-\infty}^{\infty} R_{xx}(\tau)e^{-j2\pi f\tau}\,d\tau=|X(f)|^2\,} $$ Intuition (Wiener–Khinchin): the spectral density and the autocorrelation are a Fourier pair — the "shape of correlation" and the "distribution of power over frequency" carry the same information. Sanity check: at $\tau=0$ the inverse transform gives $R_{xx}(0)=\int S_x(f)df=E$, matching the energy result.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> A known pulse $s(t)$ (duration $0$ to $T$) arrives buried in white noise of two-sided PSD $N_0/2$. We seek the linear filter $h(t)$ whose output at sampling time $T$ has the largest possible signal-to-noise ratio.</p>

<p><b>Step 1 — write signal and noise at the output.</b> Let $y(t)=(s*h)(t)$. The signal component at $t=T$ is $y_s(T)=\int_{-\infty}^{\infty} H(f)S(f)e^{\,j2\pi fT}df$; the output noise power is $\sigma^2=\tfrac{N_0}{2}\int_{-\infty}^{\infty}|H(f)|^2df$.</p>

<p><b>Step 2 — form the SNR and bound it by Cauchy–Schwarz.</b> The SNR is $|y_s(T)|^2/\sigma^2$. The Cauchy–Schwarz inequality $\big|\int H\,G\big|^2\le \int|H|^2\int|G|^2$ (with $G(f)=S(f)e^{j2\pi fT}$) bounds the numerator.</p>
$$ \mathrm{SNR}=\frac{\left|\int H(f)S(f)e^{j2\pi fT}df\right|^2}{\frac{N_0}{2}\int|H(f)|^2df}\;\le\;\frac{\int|H|^2df\;\int|S(f)|^2df}{\frac{N_0}{2}\int|H|^2df}=\frac{2}{N_0}\int|S(f)|^2df. $$

<p><b>Step 3 — apply Parseval and read off the equality condition.</b> By Parseval $\int|S(f)|^2df=\int|s(t)|^2dt=E$. Equality in Cauchy–Schwarz holds when $H(f)\propto S^*(f)e^{-j2\pi fT}$, whose inverse transform is $h(t)=s^*(T-t)$ — a time-reversed, conjugated, delayed copy of the pulse.</p>
$$ h(t)=s^*(T-t),\qquad \mathrm{SNR}_{\max}=\frac{2E}{N_0}. $$

<p><b>Result.</b> $$ \boxed{\,h(t)=s^*(T-t),\qquad \mathrm{SNR}_{\max}=\dfrac{2E}{N_0}\,} $$ Intuition: the optimal receiver correlates the input against a stored copy of the expected pulse — the matched filter <i>is</i> a correlator. Sanity check: the peak SNR depends only on pulse energy $E$ and noise density $N_0$, not on pulse shape — spread the same energy any way and detection is equally good.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> We connect total power to the power spectral density. Start from the Wiener–Khinchin pair: $S_x(f)$ is the Fourier transform of $R_{xx}(\tau)$, so $R_{xx}(\tau)$ is the inverse transform of $S_x(f)$.</p>
$$ R_{xx}(\tau)=\int_{-\infty}^{\infty} S_x(f)\,e^{\,j2\pi f\tau}\,df. $$

<p><b>Step 1 — evaluate at zero lag.</b> Set $\tau=0$; the exponential becomes $1$, leaving the integral of the PSD.</p>
$$ R_{xx}(0)=\int_{-\infty}^{\infty} S_x(f)\,df. $$

<p><b>Step 2 — identify $R_{xx}(0)$ as power.</b> We showed $R_{xx}(0)$ is the total energy/power of the signal, $P$.</p>
$$ P=R_{xx}(0)=\int_{-\infty}^{\infty} S_x(f)\,df. $$

<p><b>Result.</b> $$ \boxed{\,P=R_{xx}(0)=\int_{-\infty}^{\infty} S_x(f)\,df\,} $$ Intuition: total power is the area under the power spectral density — $S_x(f)$ literally tells you how power is distributed across frequency. Sanity check: integrating a PSD over a sub-band gives the power in that band, the basis of band-power measurements.</p>
`,

    6: String.raw`
<p><b>Where we start.</b> We relate $R_{yx}$ (correlate $y$ against shifted $x$) to $R_{xy}$. Begin from the definitions.</p>
$$ R_{yx}(\tau)=\int_{-\infty}^{\infty} y^*(t)\,x(t+\tau)\,dt,\qquad R_{xy}(\tau)=\int_{-\infty}^{\infty} x^*(t)\,y(t+\tau)\,dt. $$

<p><b>Step 1 — substitute in $R_{yx}$ to line up with $R_{xy}$.</b> In $R_{yx}$ let $u=t+\tau$, so $t=u-\tau$, $dt=du$. Then $y^*(t)=y^*(u-\tau)$ and $x(t+\tau)=x(u)$.</p>
$$ R_{yx}(\tau)=\int_{-\infty}^{\infty} y^*(u-\tau)\,x(u)\,du. $$

<p><b>Step 2 — take the conjugate of $R_{xy}(-\tau)$ and compare.</b> Write $R_{xy}(-\tau)=\int x^*(t)y(t-\tau)\,dt$, then conjugate: $R_{xy}^*(-\tau)=\int x(t)\,y^*(t-\tau)\,dt$. Rename $t\to u$ — this is identical to the expression above.</p>
$$ R_{xy}^*(-\tau)=\int_{-\infty}^{\infty} x(u)\,y^*(u-\tau)\,du=R_{yx}(\tau). $$

<p><b>Result.</b> $$ \boxed{\,R_{yx}(\tau)=R_{xy}^*(-\tau)\,} $$ Intuition: swapping which signal is "reference" reflects the lag axis and conjugates — the same alignment information viewed from the other side. Sanity check: for autocorrelation ($y=x$) this gives $R_{xx}(\tau)=R_{xx}^*(-\tau)$, the Hermitian symmetry of autocorrelation.</p>
`
  },

  'nyquist-sampling': {

    0: String.raw`
<p><b>Where we start.</b> A signal is bandlimited to $B$ if $X(f)=0$ for $|f|>B$. Sampling at rate $f_s$ creates spectral copies of $X(f)$ centred at every multiple of $f_s$ (proved in the "sampled spectrum" derivation). We need these copies not to overlap.</p>

<p><b>Step 1 — locate adjacent copies.</b> The baseband copy occupies $[-B,B]$. The next copy is centred at $f_s$, occupying $[f_s-B,\;f_s+B]$. Its lower edge is at $f_s-B$.</p>

<p><b>Step 2 — demand no overlap.</b> The baseband copy ends at $+B$; the next copy must begin above it, so its lower edge $f_s-B$ must exceed $B$.</p>
$$ f_s-B>B. $$

<p><b>Step 3 — solve for the rate.</b> Add $B$ to both sides.</p>
$$ f_s>2B. $$

<p><b>Result.</b> $$ \boxed{\,f_s>2B\,} $$ Intuition: you must sample faster than twice the highest frequency so the spectral replicas leave a gap and an ideal low-pass filter can isolate the original. Sanity check: at exactly $f_s=2B$ the copies just touch — the borderline case; anything slower makes them overlap (aliasing).</p>
`,

    1: String.raw`
<p><b>Where we start.</b> Ideal sampling multiplies $x(t)$ by a Dirac comb $\mathrm{III}_{T_s}(t)=\sum_n \delta(t-nT_s)$ of period $T_s=1/f_s$. We find the spectrum of the product.</p>

<p><b>Step 1 — write the sampled signal.</b> Multiplication in time picks out the sample values.</p>
$$ x_s(t)=x(t)\sum_{n=-\infty}^{\infty}\delta(t-nT_s). $$

<p><b>Step 2 — use the Fourier series of the comb.</b> The Dirac comb is periodic, so it expands as $\mathrm{III}_{T_s}(t)=\frac{1}{T_s}\sum_{k}e^{\,j2\pi k f_s t}$ (all its Fourier coefficients equal $1/T_s$). Substitute.</p>
$$ x_s(t)=\frac{1}{T_s}\sum_{k=-\infty}^{\infty} x(t)\,e^{\,j2\pi k f_s t}. $$

<p><b>Step 3 — transform term by term using the modulation property.</b> Multiplying $x(t)$ by $e^{j2\pi kf_s t}$ shifts its spectrum to $X(f-kf_s)$. With $1/T_s=f_s$.</p>
$$ X_s(f)=f_s\sum_{k=-\infty}^{\infty} X(f-kf_s). $$

<p><b>Result.</b> $$ \boxed{\,X_s(f)=f_s\sum_{k=-\infty}^{\infty} X(f-kf_s)\,} $$ Intuition: sampling in time replicates the spectrum in frequency, spaced by $f_s$ and scaled by $f_s$. Sanity check: if the replicas don't overlap (i.e. $f_s>2B$), the $k=0$ term is a clean copy of $X(f)$ — recoverable by low-pass filtering.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> Assume $f_s>2B$ so the baseband replica in $X_s(f)$ is undistorted. Recover $x(t)$ by isolating that replica with an ideal low-pass filter and inverse-transforming.</p>

<p><b>Step 1 — apply the ideal reconstruction filter.</b> Multiply $X_s(f)$ by a brick-wall filter $H(f)=T_s$ for $|f|<f_s/2$ and $0$ outside. This keeps only the $k=0$ copy and undoes the $f_s$ scaling ($f_s\cdot T_s=1$).</p>
$$ X(f)=H(f)X_s(f),\qquad H(f)=T_s\,\mathrm{rect}(f/f_s). $$

<p><b>Step 2 — identify the filter's impulse response.</b> The inverse transform of $T_s\,\mathrm{rect}(f/f_s)$ is a sinc: $h(t)=\mathrm{sinc}(t/T_s)$ (using $\mathrm{rect}\leftrightarrow\mathrm{sinc}$ from the FT topic, with the $T_s,f_s$ scaling cancelling the height).</p>
$$ h(t)=\mathrm{sinc}\!\left(\frac{t}{T_s}\right). $$

<p><b>Step 3 — convolve the samples with the sinc.</b> In time, reconstruction is $x(t)=x_s(t)*h(t)$. Since $x_s(t)=\sum_n x(nT_s)\delta(t-nT_s)$, convolving with $h$ replaces each impulse by a shifted sinc weighted by the sample.</p>
$$ x(t)=\sum_{n} x(nT_s)\,\mathrm{sinc}\!\left(\frac{t-nT_s}{T_s}\right). $$

<p><b>Result.</b> $$ \boxed{\,x(t)=\sum_{n} x(nT_s)\,\mathrm{sinc}\!\left(\dfrac{t-nT_s}{T_s}\right)\,} $$ Intuition: perfect reconstruction interpolates the samples with sincs — each sinc is $1$ at its own sample and $0$ at every other sample instant. Sanity check: at $t=mT_s$ only the $n=m$ sinc is nonzero (equals $1$), so $x(mT_s)$ is reproduced exactly.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> Sampling replicates the spectrum every $f_s$. We locate the frequency at which adjacent replicas meet — the boundary of the usable band.</p>

<p><b>Step 1 — find the midpoint between replica centres.</b> The baseband copy is centred at $0$ and the next at $f_s$. The point equidistant from both — where they would first collide — is the midpoint.</p>
$$ f_N=\frac{0+f_s}{2}=\frac{f_s}{2}. $$

<p><b>Step 2 — interpret it.</b> Any signal content below $f_N$ maps into the clean baseband slot $[-f_N,f_N]$; content above $f_N$ folds back (aliases). So $f_N=f_s/2$ is the highest frequency the sampling rate can represent unambiguously.</p>

<p><b>Result.</b> $$ \boxed{\,f_N=\frac{f_s}{2}\,} $$ Intuition: the Nyquist frequency is the halfway line between spectral copies — the ceiling of the representable band. Sanity check: the Nyquist criterion $f_s>2B$ is equivalent to $B<f_N$, i.e. the signal fits below the fold line.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> A bandpass signal occupies $[f_L,f_H]$ with bandwidth $B=f_H-f_L$, sitting far from DC. We can sample below $2f_H$ if we let a <i>higher-order</i> replica land cleanly in baseband. We find the allowed rates for integer replica index $n$.</p>

<p><b>Step 1 — place the $n$-th replica so its top edge fits at or below baseband's top.</b> The replica of the upper edge $f_H$ shifted down by $n$ copies is $f_H-nf_s$; for it not to fold over the top of the baseband slot we need it to reach down to (at most) the mirror boundary — the tightest packing occurs when $n f_s$ brings $f_H$ down to the band's own width. The upper constraint on the family is that $n$ full copies do not exceed twice $f_H$.</p>
$$ n f_s\le 2f_H\quad\Rightarrow\quad f_s\ge \frac{2f_H}{n}. $$

<p><b>Step 2 — keep the lower edge from folding into the previous replica.</b> The lower edge $f_L$, shifted by $(n-1)$ copies, must not cross below the baseband floor; packing $(n-1)$ copies must not exceed $2f_L$.</p>
$$ (n-1)f_s\ge 2f_L\quad\Rightarrow\quad f_s\le \frac{2f_L}{n-1}. $$

<p><b>Step 3 — combine into one admissible window.</b> Both must hold simultaneously for the chosen integer $n$ (with $1\le n\le \lfloor f_H/B\rfloor$).</p>
$$ \frac{2f_H}{n}\le f_s\le \frac{2f_L}{n-1}. $$

<p><b>Result.</b> $$ \boxed{\,\frac{2f_H}{n}\le f_s\le \frac{2f_L}{n-1}\,} $$ Intuition: undersampling deliberately aliases a passband down to baseband without overlap — you only need to sample faster than twice the <i>bandwidth</i>, not twice the highest frequency. Sanity check: for a baseband signal $f_L=0$, $f_H=B$, take $n=1$: the window becomes $2B\le f_s\le\infty$, recovering ordinary Nyquist.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> We restate the Nyquist condition in terms of the sampling <i>interval</i> $T_s$ instead of the rate $f_s$. The two are reciprocals.</p>
$$ f_s=\frac{1}{T_s}. $$

<p><b>Step 1 — substitute into the rate condition.</b> Start from $f_s>2B$ and replace $f_s$ by $1/T_s$.</p>
$$ \frac{1}{T_s}>2B. $$

<p><b>Step 2 — solve for $T_s$.</b> Since $T_s>0$, invert both sides (which reverses the inequality).</p>
$$ T_s<\frac{1}{2B}. $$

<p><b>Result.</b> $$ \boxed{\,T_s<\frac{1}{2B}\;\Leftrightarrow\; f_s>2B\,} $$ Intuition: the highest-frequency sinusoid has period $1/B$; taking $T_s<1/(2B)$ guarantees more than two samples per cycle of it, enough to pin down its amplitude and phase. Sanity check: exactly two samples per cycle ($T_s=1/(2B)$) can land on the zero crossings of a sine and miss it entirely — hence the strict inequality.</p>
`
  },

  'aliasing': {

    0: String.raw`
<p><b>Where we start.</b> Sampling makes the spectrum periodic with period $f_s$, and any input tone $f_{in}$ appears at every $f_{in}+kf_s$. The observed (baseband) frequency is whichever replica lands in $[-f_s/2,\,f_s/2]$. We find that value.</p>

<p><b>Step 1 — reduce $f_{in}$ to the nearest replica.</b> Subtract the integer number of full sampling rates closest to $f_{in}$. Rounding $f_{in}/f_s$ to the nearest integer picks that closest multiple.</p>
$$ f_{in}-f_s\,\mathrm{round}\!\left(\frac{f_{in}}{f_s}\right). $$

<p><b>Step 2 — take the magnitude.</b> The result lies in $[-f_s/2,f_s/2]$; a physical (observed) frequency is reported as a positive number, so take the absolute value.</p>
$$ f_{alias}=\left|f_{in}-f_s\,\mathrm{round}\!\left(\frac{f_{in}}{f_s}\right)\right|. $$

<p><b>Result.</b> $$ \boxed{\,f_{alias}=\left|f_{in}-f_s\,\mathrm{round}\!\left(\dfrac{f_{in}}{f_s}\right)\right|\,} $$ Intuition: sampling "wraps" the frequency axis onto a segment of width $f_s$; the alias is where $f_{in}$ lands after wrapping and folding. Sanity check: if $f_{in}<f_s/2$, the round is $0$ and $f_{alias}=f_{in}$ — no aliasing, as expected.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> We show two continuous tones differing by a multiple of $f_s$ produce identical samples. Sample $\cos(2\pi(f_0+kf_s)t)$ at $t=nT_s$, with $T_s=1/f_s$ and integer $k,n$.</p>

<p><b>Step 1 — write the sampled cosine and expand the phase.</b> Substitute $t=nT_s$ and split the argument.</p>
$$ \cos\big(2\pi(f_0+kf_s)nT_s\big)=\cos\big(2\pi f_0 nT_s+2\pi k f_s nT_s\big). $$

<p><b>Step 2 — simplify the extra term.</b> Since $f_s T_s=1$, the added phase is $2\pi k f_s nT_s=2\pi kn$, an integer multiple of $2\pi$.</p>
$$ =\cos\big(2\pi f_0 nT_s+2\pi kn\big). $$

<p><b>Step 3 — drop the $2\pi kn$.</b> Cosine has period $2\pi$, so adding $2\pi kn$ (an integer number of full turns) changes nothing.</p>
$$ =\cos\big(2\pi f_0 nT_s\big). $$

<p><b>Result.</b> $$ \boxed{\,\cos\big(2\pi(f_0+kf_s)nT_s\big)=\cos\big(2\pi f_0 nT_s\big)\,} $$ Intuition: at the sampling instants, tones separated by $f_s$ are literally the same sequence of numbers — sampling cannot tell them apart. Sanity check: this is the root cause of aliasing; the whole family $f_0+kf_s$ collapses to one observable tone.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> Consider an input tone in the second Nyquist zone, $f_s/2<f_{in}<f_s$, sampled at rate $f_s$. We find where it appears.</p>

<p><b>Step 1 — apply the general alias formula with $k=1$.</b> Here $f_{in}/f_s$ is between $0.5$ and $1$, so $\mathrm{round}(f_{in}/f_s)=1$. The nearest replica is at $f_{in}-f_s$.</p>
$$ f_{in}-f_s\,(1)=f_{in}-f_s. $$

<p><b>Step 2 — take the magnitude.</b> Since $f_{in}<f_s$, the quantity $f_{in}-f_s$ is negative; its absolute value is $f_s-f_{in}$.</p>
$$ f_{alias}=|f_{in}-f_s|=f_s-f_{in}. $$

<p><b>Result.</b> $$ \boxed{\,f_{alias}=f_s-f_{in},\quad \frac{f_s}{2}<f_{in}<f_s\,} $$ Intuition: tones in the second zone fold down and appear <i>reversed</i> — as $f_{in}$ rises toward $f_s$, the alias falls toward $0$. Sanity check: at $f_{in}=f_s/2$ we get $f_{alias}=f_s/2$ (the fold point); at $f_{in}\to f_s$ the alias $\to 0$ (DC), exactly the mirror behaviour.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> We give the general "folding" rule. First wrap $f_{in}$ into one period, then reflect about the Nyquist line $f_s/2$. Define the wrapped frequency $f_{mod}=f_{in}\bmod f_s$, so $0\le f_{mod}<f_s$.</p>

<p><b>Step 1 — case A: already below Nyquist.</b> If $f_{mod}\le f_s/2$, it lies in the clean baseband slot and needs no reflection — it <i>is</i> the alias.</p>
$$ f_{alias}=f_{mod},\qquad f_{mod}\le f_s/2. $$

<p><b>Step 2 — case B: above Nyquist, so fold.</b> If $f_{mod}>f_s/2$, it lies in the upper (second) zone and reflects about $f_s/2$. The reflection of $f_{mod}$ about $f_s/2$ is $f_s/2-(f_{mod}-f_s/2)=f_s-f_{mod}$.</p>
$$ f_{alias}=f_s-f_{mod},\qquad f_{mod}>f_s/2. $$

<p><b>Step 3 — assemble the piecewise rule.</b></p>
$$ f_{alias}=\begin{cases} f_{mod}, & f_{mod}\le f_s/2\\[2pt] f_s-f_{mod}, & f_{mod}>f_s/2.\end{cases} $$

<p><b>Result.</b> $$ \boxed{\,f_{alias}=\begin{cases} f_{mod}, & f_{mod}\le f_s/2\\ f_s-f_{mod}, & f_{mod}>f_s/2\end{cases}\,} $$ Intuition: the frequency axis "accordion-folds" at every multiple of $f_s/2$; a tone bounces off the Nyquist wall back into baseband. Sanity check: this piecewise form is exactly equivalent to the round-based magnitude formula $\big|f_{in}-f_s\,\mathrm{round}(f_{in}/f_s)\big|$.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> We show aliasing happens precisely when the sampled spectral replicas overlap. Recall the replicas of a signal bandlimited to $B$ are centred at multiples of $f_s$, each spanning width $B$ on each side.</p>

<p><b>Step 1 — write the no-overlap condition.</b> The baseband copy ends at $+B$; the next replica (centred at $f_s$) starts at $f_s-B$. They stay separate iff $f_s-B>B$, i.e. $f_s>2B$.</p>

<p><b>Step 2 — negate it.</b> Aliasing is exactly the failure of that condition — the replicas overlap when the inequality is reversed.</p>
$$ \text{overlap}\iff \neg(f_s>2B)\iff f_s<2B. $$

<p><b>Step 3 — connect overlap to aliasing.</b> Where replicas overlap, their contributions add and can no longer be separated by any filter; high frequencies masquerade as low ones. That irreversible mixing is aliasing.</p>

<p><b>Result.</b> $$ \boxed{\,\text{aliasing}\iff f_s<2B\,} $$ Intuition: too slow a sample rate lets neighbouring spectral copies collide, and the overlap can't be undone. Sanity check: the boundary $f_s=2B$ is the Nyquist rate; below it, aliasing; above it, clean separation.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> A wheel spins at $f_{rot}$ revolutions/sec and is filmed at $f_{frame}$ frames/sec. Each frame samples the wheel's angular position, so the apparent rotation is an aliased version of $f_{rot}$ — the temporal analogue of frequency aliasing.</p>

<p><b>Step 1 — recognize frames as samples.</b> Filming at $f_{frame}$ is sampling the periodic angular motion at rate $f_{frame}$. The observable rotation rate is $f_{rot}$ wrapped into $[-f_{frame}/2,\,f_{frame}/2]$, exactly like the alias formula.</p>

<p><b>Step 2 — subtract the nearest multiple of the frame rate.</b> Round $f_{rot}/f_{frame}$ to the nearest integer to find the closest multiple of $f_{frame}$, and subtract it. Keeping the sign preserves apparent direction.</p>
$$ f_{app}=f_{rot}-f_{frame}\,\mathrm{round}\!\left(\frac{f_{rot}}{f_{frame}}\right). $$

<p><b>Result.</b> $$ \boxed{\,f_{app}=f_{rot}-f_{frame}\,\mathrm{round}\!\left(\dfrac{f_{rot}}{f_{frame}}\right)\,} $$ Intuition: when $f_{rot}$ is just under a multiple of $f_{frame}$, $f_{app}$ is small and negative — the wheel appears to creep <i>backwards</i>. Sanity check: if $f_{rot}=f_{frame}$ exactly, the round is $1$ and $f_{app}=0$ — the wheel looks frozen, the classic stroboscopic effect. This is the signed version of the aliasing formula (no absolute value, so direction is retained).</p>
`
  }

});
