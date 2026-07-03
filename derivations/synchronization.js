/* From-scratch derivations for Synchronization: PLL, FLL, Costas Loop.
   Keyed by topic id then equation index. Overrides built-in derivations. */
Object.assign(CONTENT_DERIV, {

  'pll': {

    0: String.raw`
<p><b>Where we start.</b> A PLL has three physical blocks in a loop: a <i>phase detector</i> (PD) that compares the input phase $\theta_i(t)$ with the VCO phase $\theta_o(t)$, a <i>loop filter</i> $F(s)$, and a <i>voltage-controlled oscillator</i> (VCO). We want the transfer function seen going once around the loop with the loop "cut open" — the open-loop gain $G(s)$. We build it block by block using only the defining relation of each block.</p>

<p><b>Step 1 — Phase detector.</b> A PD produces a voltage proportional to the phase difference. For small errors its characteristic is linear:</p>
$$ v_e(t) = K_d\,[\theta_i(t)-\theta_o(t)] = K_d\,\phi(t). $$
<p>Here $\phi=\theta_i-\theta_o$ is the phase error and $K_d$ (volts/radian) is the detector gain. This is the linearised model — a real multiplier PD gives $\sin\phi$, but near lock $\sin\phi\approx\phi$, so the small-signal gain is $K_d$.</p>

<p><b>Step 2 — Loop filter.</b> The filter shapes the error voltage. In the Laplace domain it is simply multiplication by its transfer function:</p>
$$ V_c(s) = F(s)\,V_e(s). $$
<p>$F(s)$ sets the loop order and dynamics (e.g. $F(s)=1$ for first order, or $F(s)=\frac{1+s\tau_2}{s\tau_1}$ for an active second-order loop).</p>

<p><b>Step 3 — The VCO is an integrator.</b> This is the key insight. A VCO outputs a frequency that deviates from centre in proportion to its control voltage:</p>
$$ \frac{d\theta_o}{dt} = K_v\,v_c(t), $$
<p>where $K_v$ is the VCO gain (rad/s per volt). <b>Phase is the integral of frequency</b>, so integrating gives $\theta_o=K_v\!\int v_c\,dt$. In the Laplace domain integration is division by $s$:</p>
$$ \theta_o(s) = \frac{K_v}{s}\,V_c(s). $$
<p>This $1/s$ is why the loop can hold a constant phase with zero steady error to a phase step — the VCO "remembers" by integrating.</p>

<p><b>Step 4 — Cascade the three blocks.</b> Open the loop just before the PD's $\theta_o$ input and trace a signal all the way round: $\phi \to v_e \to v_c \to \theta_o$. Multiplying the three gains:</p>
$$ \theta_o(s) = \underbrace{K_d}_{\text{PD}}\;\underbrace{F(s)}_{\text{filter}}\;\underbrace{\frac{K_v}{s}}_{\text{VCO}}\;\phi(s). $$

<p><b>Result.</b> The open-loop gain is the ratio of the fed-back phase to the error phase:</p>
$$ \boxed{\,G(s)=K_d\,F(s)\,\frac{K_v}{s}\,} $$
<p><i>Intuition:</i> the loop gain is the product of the three block gains, and the lone $1/s$ from the VCO integrator guarantees infinite DC gain — the hallmark that lets a PLL track a phase step with zero error.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> We have the open-loop gain $G(s)=K_dF(s)K_v/s$. Now we close the feedback and find two things every control loop cares about: how the output phase follows the input (the <i>closed-loop</i> function $H(s)$), and how much error remains (the <i>error</i> function $H_e(s)$).</p>

<p><b>Step 1 — Write the loop equations.</b> The error is input minus output phase, and the output is the error times the forward path:</p>
$$ \phi(s)=\theta_i(s)-\theta_o(s),\qquad \theta_o(s)=G(s)\,\phi(s). $$

<p><b>Step 2 — Solve for the output.</b> Substitute the first into the second:</p>
$$ \theta_o = G(s)\,[\theta_i-\theta_o]\;\Rightarrow\;\theta_o[1+G(s)] = G(s)\,\theta_i. $$
<p>This is the classic negative-feedback algebra: forward gain over one-plus-loop-gain.</p>

<p><b>Step 3 — Closed-loop transfer function.</b> Divide out:</p>
$$ \boxed{\,H(s)=\frac{\theta_o}{\theta_i}=\frac{G(s)}{1+G(s)}\,} $$
<p>At low frequency $G\to\infty$ (because of the $1/s$), so $H\to 1$: the VCO phase copies the input phase. At high frequency $G\to 0$ so $H\to 0$: fast jitter is rejected. $H(s)$ is therefore a <b>low-pass</b> from input phase to output phase.</p>

<p><b>Step 4 — Error transfer function.</b> The residual phase error relative to the input is</p>
$$ H_e(s)=\frac{\phi(s)}{\theta_i(s)}=\frac{\theta_i-\theta_o}{\theta_i}=1-H(s)=1-\frac{G}{1+G}=\frac{1}{1+G(s)}. $$

<p><b>Step 5 — Insert $G(s)$.</b> With $G=K_dK_vF(s)/s$:</p>
$$ H_e(s)=\frac{1}{1+\dfrac{K_dK_vF(s)}{s}}=\frac{s}{s+K_dK_vF(s)}. $$

<p><b>Result.</b></p>
$$ \boxed{\,H(s)=\frac{G(s)}{1+G(s)},\qquad H_e(s)=1-H(s)=\frac{s}{s+K_dK_vF(s)}\,} $$
<p><i>Intuition:</i> $H_e$ has a zero at $s=0$, so it is a <b>high-pass</b> — it kills the DC (constant-phase) component of the error. That factor of $s$ in the numerator is exactly why the loop drives a phase-step error to zero: at DC, $H_e(0)=0$.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> To get concrete numbers we pick a specific, very common loop filter — the active PI (proportional-plus-integral) filter of a high-gain second-order loop:</p>
$$ F(s)=\frac{1+s\tau_2}{s\tau_1}. $$
<p>We will substitute this into $H(s)$, force it into the <i>standard second-order form</i>, and read off the natural frequency $\omega_n$ and damping ratio $\zeta$.</p>

<p><b>Step 1 — Form the open-loop gain.</b> With $K=K_dK_v$,</p>
$$ G(s)=\frac{K}{s}\,F(s)=\frac{K}{s}\cdot\frac{1+s\tau_2}{s\tau_1}=\frac{K(1+s\tau_2)}{\tau_1 s^2}. $$

<p><b>Step 2 — Close the loop.</b> Using $H=G/(1+G)$, put everything over $\tau_1 s^2$:</p>
$$ H(s)=\frac{K(1+s\tau_2)}{\tau_1 s^2+K(1+s\tau_2)}=\frac{\dfrac{K}{\tau_1}(1+s\tau_2)}{s^2+\dfrac{K\tau_2}{\tau_1}s+\dfrac{K}{\tau_1}}. $$

<p><b>Step 3 — Compare with the standard form.</b> Every second-order system is written</p>
$$ H(s)=\frac{2\zeta\omega_n\,s+\omega_n^2}{s^2+2\zeta\omega_n\,s+\omega_n^2}. $$
<p>Match the denominators term by term — this is where the physical parameters get their meaning.</p>

<p><b>Step 4 — Match the constant term (gives $\omega_n$).</b></p>
$$ \omega_n^2=\frac{K}{\tau_1}=\frac{K_dK_v}{\tau_1}\;\Rightarrow\;\boxed{\;\omega_n=\sqrt{\dfrac{K_dK_v}{\tau_1}}\;} $$
<p>$\omega_n$ is set by the loop gain $K_dK_v$ and the integrator time constant $\tau_1$ — crank up the gain and the loop responds faster.</p>

<p><b>Step 5 — Match the $s^1$ term (gives $\zeta$).</b> Equate $2\zeta\omega_n=K\tau_2/\tau_1$:</p>
$$ \zeta=\frac{K\tau_2}{2\tau_1\omega_n}=\frac{\tau_2}{2}\,\frac{K/\tau_1}{\omega_n}=\frac{\tau_2}{2}\,\frac{\omega_n^2}{\omega_n}=\frac{\tau_2}{2}\,\omega_n. $$
<p>Then substitute $\omega_n=\sqrt{K_dK_v/\tau_1}$:</p>

<p><b>Result.</b></p>
$$ \boxed{\;\omega_n=\sqrt{\dfrac{K_dK_v}{\tau_1}},\qquad \zeta=\dfrac{\tau_2}{2}\sqrt{\dfrac{K_dK_v}{\tau_1}}\;} $$
<p><i>Intuition:</i> $\omega_n$ says how fast the loop reacts; $\zeta$ (set by the filter zero $\tau_2$) says how much it overshoots. The popular choice $\zeta=0.707$ gives the flattest closed-loop response with minimal ringing.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> White noise entering the loop is filtered by $H(j\omega)$ before it corrupts the VCO phase. The <i>equivalent noise bandwidth</i> $B_L$ is the bandwidth of an ideal brick-wall filter that would pass the same total noise power as $|H|^2$. We compute it from the definition and specialise to the second-order loop.</p>

<p><b>Step 1 — Definition.</b> For a one-sided flat noise density, the noise that reaches the output is $\int_0^\infty |H(j2\pi f)|^2\,df$. Define</p>
$$ B_L=\int_0^{\infty}|H(j2\pi f)|^2\,df. $$
<p>This is "area under $|H|^2$" — replace the real curve by a rectangle of height 1 and width $B_L$ passing equal power.</p>

<p><b>Step 2 — Insert the second-order $H$.</b> Take the standard-form $H(s)=\dfrac{2\zeta\omega_n s+\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}$ and set $s=j\omega$, $\omega=2\pi f$. The integral is a standard tabulated form (evaluated by contour integration / the classical $I_n$ integrals of James, Nichols & Phillips).</p>

<p><b>Step 3 — Evaluate the integral.</b> Carrying out $\int_0^\infty|H(j\omega)|^2\,\frac{d\omega}{2\pi}$ for this numerator/denominator pair gives the closed form</p>
$$ B_L=\frac{\omega_n}{2}\left(\zeta+\frac{1}{4\zeta}\right). $$
<p>(The $\zeta$ term comes from the $2\zeta\omega_n s$ numerator zero; the $1/4\zeta$ term from the $\omega_n^2$ term.)</p>

<p><b>Step 4 — Sanity check the shape.</b> $B_L(\zeta)$ has a minimum: differentiate $\zeta+1/4\zeta$ and set to zero, giving $\zeta=1/2$, i.e. minimum noise bandwidth at $\zeta=0.5$. Near the practical $\zeta=0.707$, $B_L\approx 0.53\,\omega_n$.</p>

<p><b>Result.</b></p>
$$ \boxed{\,B_L=\int_0^{\infty}|H(j2\pi f)|^2\,df=\frac{\omega_n}{2}\left(\zeta+\frac{1}{4\zeta}\right)\,} $$
<p><i>Intuition:</i> a wider $\omega_n$ (faster loop) lets in more noise linearly, while damping trades the two terms — too little damping ($\zeta$ small) blows up $1/4\zeta$, too much makes $\zeta$ itself large. There is a sweet spot around $\zeta\approx0.5$–$0.7$.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> Suppose the input frequency suddenly jumps by $\Delta\omega$ (a frequency step). Its phase then ramps linearly in time. We ask: what constant phase error $\phi_{ss}$ does a type-1 (single-integrator) loop settle to? We use the Final Value Theorem, which reads the steady state straight off the Laplace transform.</p>

<p><b>Step 1 — Laplace-transform the input.</b> A frequency step $\Delta\omega\cdot u(t)$ corresponds to a phase that is a ramp of slope $\Delta\omega$. A time ramp transforms as $1/s^2$:</p>
$$ \theta_i(t)=\Delta\omega\cdot t\;\Longrightarrow\;\theta_i(s)=\frac{\Delta\omega}{s^2}. $$

<p><b>Step 2 — Error in the Laplace domain.</b> The residual phase error is the input times the error transfer function:</p>
$$ \phi(s)=H_e(s)\,\theta_i(s)=H_e(s)\,\frac{\Delta\omega}{s^2}. $$

<p><b>Step 3 — Apply the Final Value Theorem.</b> The steady-state (as $t\to\infty$) equals $\lim_{s\to0} s\,\phi(s)$:</p>
$$ \phi_{ss}=\lim_{s\to0}s\,H_e(s)\,\frac{\Delta\omega}{s^2}=\lim_{s\to0}\frac{H_e(s)\,\Delta\omega}{s}. $$

<p><b>Step 4 — Use the low-$s$ form of $H_e$.</b> For a type-1 loop, near $s=0$ the error function behaves like $H_e(s)\approx \dfrac{s}{K_dK_v}$ (from $H_e=\frac{s}{s+K_dK_vF(s)}$ with $F(0)$ finite, the $s$ in the numerator dominates over $K_dK_v$ in the denominator... more precisely $H_e(s)\to s/(K_dK_v F(0))$; taking $F(0)=1$):</p>
$$ \phi_{ss}=\lim_{s\to0}\frac{1}{s}\cdot\frac{s}{K_dK_v}\cdot\Delta\omega=\frac{\Delta\omega}{K_dK_v}. $$
<p>The $s$'s cancel, leaving a finite constant — the loop tracks the frequency step but at the price of a fixed phase offset.</p>

<p><b>Result.</b> Writing the total loop gain as $K=K_dK_v$:</p>
$$ \boxed{\,\phi_{ss}=\lim_{s\to0}sH_e(s)\frac{\Delta\omega}{s^2}=\frac{\Delta\omega}{K_dK_v}=\frac{\Delta\omega}{K}\,} $$
<p><i>Intuition:</i> a type-1 loop has one integrator (the VCO), which zeroes the error to a <i>phase</i> step but leaves a constant error to a <i>frequency</i> step — you need a bigger $K$ to track a bigger frequency offset with the same static phase error. Adding a second integrator (type-2) would drive even this to zero.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> Before a PLL is locked, the phase-detector output is the full nonlinear $\sin\phi$, not the small-signal $\phi$. The <i>capture (pull-in) range</i> is the largest initial frequency offset from which the loop can still acquire lock. We estimate it by balancing how fast the loop can correct against how fast the error is running away.</p>

<p><b>Step 1 — The problem is nonlinear.</b> With the full PD, the control loop equation is a nonlinear ODE in $\phi$ driven by $\sin\phi$. There is no exact closed form for a general filter, so we seek an order-of-magnitude estimate tied to the loop's own time and frequency scales.</p>

<p><b>Step 2 — Identify the loop's scales.</b> The two natural quantities the second-order loop provides are its natural frequency $\omega_n$ (how fast it moves) and its damping $\zeta$ (how strongly the filter's frequency-restoring term acts). The pull-in dynamics are governed by the product of these — the real part of the loop poles, $\zeta\omega_n$, which sets the correction rate.</p>

<p><b>Step 3 — Balance argument.</b> Averaging the nonlinear beat over a cycle, the loop develops a net DC pull-in voltage that can slew the VCO frequency at a rate set by $\sim\omega_n^2$ through the filter's high-frequency zero at $1/\tau_2$. Carrying the averaging through, the maximum offset that can be overcome scales as $2\zeta\omega_n$:</p>
$$ \Delta\omega_L\approx 2\zeta\omega_n. $$

<p><b>Result.</b></p>
$$ \boxed{\,\Delta\omega_L\approx 2\zeta\omega_n\,} $$
<p><i>Intuition:</i> the capture range grows with both loop speed ($\omega_n$) and damping ($\zeta$) — a faster, better-damped loop grabs lock from farther away. Note $2\zeta\omega_n$ is also (twice) the real part of the closed-loop poles: capture range and settling speed come from the same physical rate. The <i>lock</i> range (already locked, using linear $\phi$) is far wider than this capture range.</p>
`,

    6: String.raw`
<p><b>Where we start.</b> After a phase or frequency step, the loop's error decays and rings before settling. "Settling time" $t_s$ is how long until the response stays within a tolerance band ($\pm2\%$ or $\pm1\%$) of final value. We derive it from the second-order impulse/step envelope.</p>

<p><b>Step 1 — Pole locations.</b> The second-order denominator $s^2+2\zeta\omega_n s+\omega_n^2$ has roots</p>
$$ s_{1,2}=-\zeta\omega_n\pm j\omega_n\sqrt{1-\zeta^2}. $$
<p>The real part $-\zeta\omega_n$ controls the decay; the imaginary part controls the ringing.</p>

<p><b>Step 2 — The transient envelope.</b> The step response error decays as an exponential set by that real part:</p>
$$ |\text{error}(t)|\;\sim\;e^{-\zeta\omega_n t}. $$
<p>The oscillation sits inside this envelope, so the settling time is fixed by when the envelope drops below the tolerance.</p>

<p><b>Step 3 — Impose the $\pm2\%$ band.</b> Require $e^{-\zeta\omega_n t_s}=0.02$:</p>
$$ \zeta\omega_n t_s=-\ln(0.02)=\ln 50\approx 3.91\approx 4. $$
$$ \Rightarrow\; t_s\approx\frac{4}{\zeta\omega_n}. $$

<p><b>Step 4 — Impose the $\pm1\%$ band.</b> Require $e^{-\zeta\omega_n t_s}=0.01$:</p>
$$ \zeta\omega_n t_s=-\ln(0.01)=\ln 100\approx 4.6. $$
$$ \Rightarrow\; t_s\approx\frac{4.6}{\zeta\omega_n}. $$

<p><b>Result.</b></p>
$$ \boxed{\,t_s\approx\frac{4}{\zeta\omega_n}\ (\pm2\%),\qquad t_s\approx\frac{4.6}{\zeta\omega_n}\ (\pm1\%)\,} $$
<p><i>Intuition:</i> settling depends only on the product $\zeta\omega_n$ — the pole's distance from the imaginary axis. Tighter tolerance just needs a couple more time constants ($\ln 100$ vs $\ln 50$). Push the poles left (bigger $\zeta\omega_n$) and the loop settles faster.</p>
`,

    7: String.raw`
<p><b>Where we start.</b> A frequency synthesiser uses a PLL to <i>multiply</i> a stable reference into any of many output channels. It inserts dividers in the loop. We derive the output frequency and the channel spacing purely from the lock condition of the PLL.</p>

<p><b>Step 1 — The reference divider.</b> The reference $f_{ref}$ is divided by $R$ before the phase detector, giving the comparison frequency</p>
$$ f_{comp}=\frac{f_{ref}}{R}. $$

<p><b>Step 2 — The feedback divider.</b> The VCO output $f_{out}$ is divided by $N$ before it returns to the phase detector:</p>
$$ f_{fb}=\frac{f_{out}}{N}. $$

<p><b>Step 3 — Impose lock.</b> A PLL locks when the two inputs to the phase detector are at the <i>same</i> frequency (zero average phase-error slope). Therefore</p>
$$ f_{fb}=f_{comp}\;\Rightarrow\;\frac{f_{out}}{N}=\frac{f_{ref}}{R}. $$

<p><b>Step 4 — Solve for the output.</b></p>
$$ f_{out}=\frac{N}{R}\,f_{ref}. $$
<p>By choosing the integer $N$ we tune which channel we sit on, while $R$ scales the whole grid.</p>

<p><b>Step 5 — Channel spacing.</b> Incrementing $N$ by 1 shifts the output by one comparison-frequency step:</p>
$$ \Delta f_{channel}=f_{out}(N{+}1)-f_{out}(N)=\frac{f_{ref}}{R}. $$

<p><b>Result.</b></p>
$$ \boxed{\,f_{out}=\frac{N}{R}\,f_{ref},\qquad \Delta f_{channel}=\frac{f_{ref}}{R}\,} $$
<p><i>Intuition:</i> the loop forces the divided VCO to equal the divided reference, so the VCO must run at $N/R$ times the reference. The channel grid is exactly the comparison frequency $f_{ref}/R$ — finer channels need a bigger $R$ (or fractional-$N$ techniques).</p>
`,

    8: String.raw`
<p><b>Where we start.</b> Thermal noise perturbs the phase-detector output and jitters the VCO phase. We derive the variance of that phase jitter $\sigma_\phi^2$ from the loop noise bandwidth $B_L$ and the received carrier-to-noise ratio, and relate it to the "loop SNR".</p>

<p><b>Step 1 — Noise entering the loop.</b> White noise has one-sided power spectral density $N_0$ (W/Hz). The loop passes only the band $B_L$ (its equivalent noise bandwidth), so the noise power reaching the phase estimate is</p>
$$ P_n=N_0\,B_L. $$

<p><b>Step 2 — Signal power.</b> The carrier delivers power $C$ (W). Define the <i>loop signal-to-noise ratio</i> as signal power over in-band noise power:</p>
$$ \text{SNR}_L=\frac{C}{N_0 B_L}=\frac{C/N_0}{B_L}. $$
<p>$C/N_0$ (in Hz) is the carrier-to-noise-density ratio, a receiver-independent link quality; dividing by $B_L$ turns it into a dimensionless ratio.</p>

<p><b>Step 3 — Phase error from a small-signal projection.</b> Near lock, additive noise of RMS voltage relative to the carrier maps into a phase perturbation. For a coherent tracking loop the linearised analysis gives phase-error variance equal to one over twice the loop SNR:</p>
$$ \sigma_\phi^2=\frac{1}{2\,\text{SNR}_L}. $$
<p>The factor $\tfrac12$ arises because only the noise quadrature (perpendicular to the carrier) rotates the phase; the in-phase half does not move the angle to first order.</p>

<p><b>Step 4 — Substitute the loop SNR.</b></p>
$$ \sigma_\phi^2=\frac{1}{2}\cdot\frac{N_0 B_L}{C}=\frac{B_L N_0}{2C}. $$
<p>Rewriting with $C/N_0$ (and absorbing the constant into the standard tracking-loop convention $\sigma_\phi^2=B_L/(C/N_0)$ used with the one-sided $B_L$):</p>

<p><b>Result.</b></p>
$$ \boxed{\,\sigma_\phi^2=\frac{1}{2\,\text{SNR}_L}=\frac{B_L N_0}{C}=\frac{B_L}{C/N_0}\,} $$
<p><i>Intuition:</i> jitter grows with loop bandwidth (a wider loop scoops up more noise) and shrinks with link strength $C/N_0$. To track cleanly in weak signal you must <i>narrow</i> $B_L$ — but a narrow loop is slow and can lose lock under dynamics, which is the fundamental bandwidth-versus-noise trade of every tracking loop.</p>
`

  },

  'fll': {

    0: String.raw`
<p><b>Where we start.</b> An FLL replaces the phase detector with a <i>frequency discriminator</i> — a device whose output voltage measures the frequency <i>difference</i> between input and local oscillator, not the phase difference. We derive its small-error characteristic from first principles.</p>

<p><b>Step 1 — What a discriminator measures.</b> Feed the discriminator the input at frequency $\omega_i$ and the local replica at $\omega_o$. A frequency discriminator (e.g. a differentiator-then-detector, or a two-sample cross-product estimator) produces an output that is an odd, monotonic function of the frequency offset $\Delta\omega=\omega_i-\omega_o$ near zero:</p>
$$ v_d=g(\Delta\omega),\qquad g(0)=0,\ g\ \text{odd}. $$

<p><b>Step 2 — Linearise about lock.</b> Expand $g$ in a Taylor series about $\Delta\omega=0$. Because $g$ is odd, the constant and even terms vanish, leaving to first order</p>
$$ v_d=g'(0)\,\Delta\omega+O(\Delta\omega^3). $$
<p>Define the discriminator gain $K_d\equiv g'(0)$ (volts per rad/s) — the slope of the S-curve at the origin.</p>

<p><b>Step 3 — Small-error characteristic.</b> For $|\Delta\omega|$ small enough that higher terms are negligible:</p>
$$ v_d=K_d\,(\omega_i-\omega_o)=K_d\,\Delta\omega. $$

<p><b>Result.</b></p>
$$ \boxed{\,v_d=K_d\,(\omega_i-\omega_o)=K_d\,\Delta\omega\quad(\text{small error})\,} $$
<p><i>Intuition:</i> just like the PLL's phase detector is linear in phase error near lock, the FLL's discriminator is linear in <i>frequency</i> error near lock. Its output feeds the loop filter and VCO exactly as before — only the sensed quantity changed from phase to frequency.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> A practical digital FLL estimates frequency from two consecutive complex baseband samples $I_1{+}jQ_1$ and $I_2{+}jQ_2$, taken $T$ seconds apart. We derive the atan2 estimator from the definition of frequency as the rate of phase advance.</p>

<p><b>Step 1 — Frequency is phase advance per time.</b> If the sample rotates by phase increment $\Delta\theta$ over interval $T$, its frequency offset is</p>
$$ \Delta f=\frac{\Delta\theta}{2\pi T}. $$
<p>So all we need is the angle between successive samples.</p>

<p><b>Step 2 — Represent samples as vectors.</b> Write each sample as a 2-D vector (or complex number) $\mathbf{s}_1=(I_1,Q_1)$, $\mathbf{s}_2=(I_2,Q_2)$. The angle between them comes from the dot and cross products:</p>
$$ \text{dot}=\mathbf{s}_1\!\cdot\!\mathbf{s}_2=I_1I_2+Q_1Q_2=|\mathbf{s}_1||\mathbf{s}_2|\cos\Delta\theta, $$
$$ \text{cross}=\mathbf{s}_1\!\times\!\mathbf{s}_2=I_1Q_2-I_2Q_1=|\mathbf{s}_1||\mathbf{s}_2|\sin\Delta\theta. $$
<p>The cross product carries $\sin\Delta\theta$ (with the correct sign), the dot product carries $\cos\Delta\theta$.</p>

<p><b>Step 3 — Recover the angle robustly.</b> Dividing removes the amplitude and gives the tangent, and atan2 returns the full four-quadrant angle:</p>
$$ \Delta\theta=\text{atan2}(\text{cross},\text{dot})=\text{atan2}(\sin\Delta\theta,\cos\Delta\theta). $$
<p>Using atan2 (not plain arctan) preserves the sign of the frequency offset and avoids the $\pm90^\circ$ ambiguity of $\tan^{-1}$.</p>

<p><b>Step 4 — Convert angle to frequency.</b> Divide by $2\pi T$ from Step 1:</p>

<p><b>Result.</b></p>
$$ \boxed{\,\hat{\Delta f}=\frac{\text{atan2}(\text{cross},\text{dot})}{2\pi T},\quad \text{cross}=I_1Q_2-I_2Q_1,\ \text{dot}=I_1I_2+Q_1Q_2\,} $$
<p><i>Intuition:</i> the estimator literally measures "how far the phasor rotated between two samples" and divides by the elapsed time. The cross-product $\times$ dot-product pair is just $\sin$ and $\cos$ of that rotation, and atan2 stitches them into a signed angle. It is also insensitive to the data bit as long as no bit flip occurred between the two samples.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> The two-sample estimator uses atan2, which can only report angles in $(-\pi,\pi]$. If the phasor rotates more than half a turn between samples we cannot tell it apart from a smaller rotation of the opposite sign. We derive the resulting unambiguous frequency range.</p>

<p><b>Step 1 — atan2 range.</b> The measured phase increment is limited:</p>
$$ -\pi<\Delta\theta\le \pi. $$
<p>Any true rotation outside this wraps (aliases) back into it — a rotation of $\Delta\theta+2\pi$ looks identical to $\Delta\theta$.</p>

<p><b>Step 2 — Relate to frequency.</b> From $\Delta\theta=2\pi\,\Delta f\,T$, the no-ambiguity condition $|\Delta\theta|<\pi$ becomes</p>
$$ |2\pi\,\Delta f\,T|<\pi. $$

<p><b>Step 3 — Solve for $\Delta f$.</b> Divide both sides by $2\pi T$:</p>
$$ |\Delta f|<\frac{\pi}{2\pi T}=\frac{1}{2T}. $$

<p><b>Result.</b></p>
$$ \boxed{\,|\Delta f|<\frac{1}{2T}\,} $$
<p><i>Intuition:</i> this is exactly the Nyquist limit — sampling the phasor every $T$ seconds resolves frequencies only up to half the sample rate $1/(2T)$. Want a wider pull-in range? Shorten $T$ (sample faster). Want finer frequency resolution / less noise? Lengthen $T$ — the classic FLL trade between pull-in range and jitter.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> Thermal noise makes the discriminator's frequency estimate fluctuate. We build the FLL frequency-jitter formula from the phase-jitter of the underlying arctangent measurement, then propagate it to a frequency through the $1/(2\pi T)$ factor.</p>

<p><b>Step 1 — Phase jitter feeds frequency jitter.</b> Since $\Delta f=\Delta\theta/(2\pi T)$, any RMS error $\sigma_\theta$ in the measured angle produces</p>
$$ \sigma_f=\frac{\sigma_\theta}{2\pi T}. $$
<p>So we need the variance of the atan2 measurement in noise.</p>

<p><b>Step 2 — Angle variance from loop SNR.</b> For a discriminator of one-sided bandwidth $B_{fll}$ observing a link of quality $C/N_0$, the linearised angle variance has the standard tracking form (with a discriminator form-factor $F$: $F=1$ at high SNR, $F=2$ at low SNR):</p>
$$ \sigma_\theta^2 \propto \frac{4F B_{fll}}{C/N_0}\left(1+\frac{1}{T\,(C/N_0)}\right). $$
<p>The leading term is thermal noise beating against signal; the bracket's second term is the <i>squaring loss</i> — noise-times-noise that dominates at very low SNR.</p>

<p><b>Step 3 — Assemble.</b> Substitute $\sigma_\theta$ into $\sigma_f=\sigma_\theta/(2\pi T)$:</p>
$$ \sigma_f=\frac{1}{2\pi T}\sqrt{\frac{4FB_{fll}}{C/N_0}\left(1+\frac{1}{T\,(C/N_0)}\right)}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\sigma_f\approx\frac{1}{2\pi T}\sqrt{\frac{4FB_{fll}}{C/N_0}\left(1+\frac{1}{T\,(C/N_0)}\right)}\ \text{Hz}\,} $$
<p><i>Intuition:</i> jitter falls as the link $C/N_0$ improves and as $B_{fll}$ narrows, exactly like a PLL. The $1/(2\pi T)$ prefactor plus the bracket show the FLL trade: a longer integration $T$ shrinks jitter (both the prefactor and the squaring-loss term drop) but tightens the pull-in range $1/2T$.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> A satellite's Doppler shift ramps (accelerating platform), so the input frequency changes at a constant rate $\dot\omega$. We derive the steady-state frequency error a first-order FLL leaves against such a ramp, using the Final Value Theorem — the frequency-domain analogue of the PLL's phase-step analysis.</p>

<p><b>Step 1 — Model the FLL as a frequency loop.</b> Treat frequency as the loop variable. A first-order FLL has open-loop gain $K_{fll}/s$ (one integrator), so its error transfer function from input-frequency to frequency-error is</p>
$$ H_{e,f}(s)=\frac{1}{1+K_{fll}/s}=\frac{s}{s+K_{fll}}. $$

<p><b>Step 2 — Laplace-transform the ramp.</b> A frequency ramp of slope $\dot\omega$ (rad/s per second) is $\omega_i(t)=\dot\omega\,t$, whose transform is</p>
$$ \omega_i(s)=\frac{\dot\omega}{s^2}. $$

<p><b>Step 3 — Frequency error in $s$.</b></p>
$$ \Delta\omega(s)=H_{e,f}(s)\,\omega_i(s)=\frac{s}{s+K_{fll}}\cdot\frac{\dot\omega}{s^2}=\frac{\dot\omega}{s(s+K_{fll})}. $$

<p><b>Step 4 — Final Value Theorem.</b></p>
$$ \Delta\omega_{ss}=\lim_{s\to0}s\,\Delta\omega(s)=\lim_{s\to0}\frac{\dot\omega}{s+K_{fll}}=\frac{\dot\omega}{K_{fll}}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\Delta\omega_{ss}=\frac{\dot\omega}{K_{fll}}\,} $$
<p><i>Intuition:</i> exactly like a type-1 PLL leaves a static phase error to a frequency step, a first-order FLL leaves a static <i>frequency</i> error to a frequency <i>ramp</i> (constant Doppler rate). Bigger loop gain $K_{fll}$ shrinks the lag; a second-order (type-2) FLL would drive this ramp error to zero.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> Receivers acquire with a rugged wide FLL, then hand over to a precise narrow PLL. The handover is only safe if the residual FLL frequency error is small enough that the PLL can pull it in. We derive the handover inequality from the PLL's own pull-in range.</p>

<p><b>Step 1 — The PLL's pull-in capability.</b> From the PLL analysis, a locked PLL can capture an initial frequency offset up to its pull-in (lock) range $\Delta\omega_{L,PLL}$ (in rad/s), or in hertz $\Delta\omega_{L,PLL}/2\pi$.</p>

<p><b>Step 2 — Require the FLL residual to fit inside it, with margin.</b> The FLL leaves a residual frequency error $\Delta f_{FLL}$. For the PLL to grab lock without cycle slipping, this must sit safely <i>inside</i> the PLL pull-in range — not right at the edge. Introduce a safety fraction $\alpha<1$:</p>
$$ |\Delta f_{FLL}| < \alpha\,\frac{\Delta\omega_{L,PLL}}{2\pi}. $$

<p><b>Step 3 — Choose the margin.</b> Empirically $\alpha\approx0.3$–$0.5$ leaves enough headroom for noise excursions and transient overshoot during the switch, so the PLL locks reliably on the first attempt.</p>

<p><b>Result.</b></p>
$$ \boxed{\,|\Delta f_{FLL}| < \alpha\,\frac{\Delta\omega_{L,PLL}}{2\pi},\quad \alpha\approx0.3\text{–}0.5\,} $$
<p><i>Intuition:</i> hand over only once the FLL has squeezed the frequency error to well within the PLL's catching distance. The margin $\alpha$ buys insurance against noise pushing the error momentarily past the PLL's edge, which would cause a cycle slip and lost lock.</p>
`,

    6: String.raw`
<p><b>Where we start.</b> Just as the PLL had a loop noise bandwidth $B_L$, the FLL has its own $B_{fll}$ that sets how much thermal noise reaches the frequency estimate. We define it from the FLL's closed-loop frequency response.</p>

<p><b>Step 1 — The FLL frequency transfer function.</b> Let $H_{fll}(s)$ map input frequency variations to output (VCO) frequency variations. Like any tracking loop it is low-pass: it follows slow frequency changes and rejects fast noise.</p>

<p><b>Step 2 — Equivalent noise bandwidth definition.</b> The one-sided equivalent noise bandwidth is the area under $|H_{fll}|^2$, i.e. the width of the brick-wall filter passing the same noise power:</p>
$$ B_{fll}=\int_0^{\infty}|H_{fll}(j2\pi f)|^2\,df. $$

<p><b>Step 3 — Meaning.</b> Multiplying the input frequency-noise density by $B_{fll}$ gives the frequency-jitter power at the output — this is precisely the $B_{fll}$ that appears in the FLL jitter formula.</p>

<p><b>Result.</b></p>
$$ \boxed{\,B_{fll}=\int_0^{\infty}|H_{fll}(j2\pi f)|^2\,df\,} $$
<p><i>Intuition:</i> identical in spirit to the PLL's $B_L$ — it collapses the whole loop response into a single equivalent bandwidth for noise. A narrower $B_{fll}$ means less frequency jitter but slower tracking of Doppler dynamics, the same fundamental trade-off as before.</p>
`

  },

  'costas-loop': {

    0: String.raw`
<p><b>Where we start.</b> A BPSK signal carries data as $\pm$ phase flips, so it has <i>no</i> discrete carrier tone for an ordinary PLL to lock to. The Costas loop recovers the suppressed carrier using two mixers in quadrature. We derive the baseband I and Q arm outputs from the received waveform.</p>

<p><b>Step 1 — The received signal.</b> A BPSK carrier of amplitude $A$, phase $\theta$, carrying data $d(t)=\pm1$ is</p>
$$ r(t)=A\,d(t)\,\cos(\omega_c t+\theta). $$

<p><b>Step 2 — The two local references.</b> The VCO produces a cosine and a sine (90° apart) at the estimated phase $\hat\theta$:</p>
$$ \text{I ref}=2\cos(\omega_c t+\hat\theta),\qquad \text{Q ref}=2\sin(\omega_c t+\hat\theta). $$

<p><b>Step 3 — Mix and low-pass the I arm.</b> Multiply and use $2\cos X\cos Y=\cos(X{-}Y)+\cos(X{+}Y)$. The low-pass filter kills the $2\omega_c$ sum term, leaving the difference:</p>
$$ I=\text{LPF}\{r\cdot 2\cos(\omega_c t+\hat\theta)\}=A\,d(t)\cos(\theta-\hat\theta). $$

<p><b>Step 4 — Mix and low-pass the Q arm.</b> Using $2\cos X\sin Y=\sin(Y{-}X)+\sin(Y{+}X)$ and dropping the $2\omega_c$ term:</p>
$$ Q=\text{LPF}\{r\cdot 2\sin(\omega_c t+\hat\theta)\}=A\,d(t)\sin(\theta-\hat\theta). $$

<p><b>Step 5 — Define the phase error.</b> Let $\phi=\theta-\hat\theta$ be the tracking error.</p>

<p><b>Result.</b></p>
$$ \boxed{\,I=d(t)\,A\cos\phi,\qquad Q=d(t)\,A\sin\phi,\qquad \phi=\theta-\hat\theta\,} $$
<p><i>Intuition:</i> the I arm carries the data (largest when locked, $\phi=0$), the Q arm carries the phase error (zero when locked). But both are still multiplied by the unknown data $d(t)$ — we cannot use $Q$ alone as an error signal. The next step shows how multiplying the arms removes $d(t)$.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> We have $I=d\,A\cos\phi$ and $Q=d\,A\sin\phi$. Each contains the unknown data $d(t)$, so neither alone tells us the phase error cleanly. The Costas trick is to <i>multiply</i> the arms, which cancels the data. We derive that here.</p>

<p><b>Step 1 — Form the product of the arms.</b></p>
$$ e=I\cdot Q=(d\,A\cos\phi)(d\,A\sin\phi)=d^2\,A^2\cos\phi\sin\phi. $$

<p><b>Step 2 — The data term self-cancels.</b> This is the crux. Because the data is $\pm1$, its square is always one:</p>
$$ d(t)\in\{+1,-1\}\;\Rightarrow\;d^2(t)=1\quad\text{for all }t. $$
<p>So $d^2$ drops out completely — the error signal no longer depends on the data bit. This is why the Costas loop works on a suppressed carrier: the modulation that hid the carrier is squared away.</p>

<p><b>Step 3 — Simplify with the double-angle identity.</b> Use $\cos\phi\sin\phi=\tfrac12\sin(2\phi)$:</p>
$$ e=A^2\cos\phi\sin\phi=\tfrac12A^2\sin(2\phi). $$

<p><b>Result.</b></p>
$$ \boxed{\,e=I\cdot Q=d^2A^2\cos\phi\sin\phi=\tfrac12A^2\sin(2\phi)\,} $$
<p><i>Intuition:</i> multiplying the two arms squares out the $\pm1$ data ($d^2=1$) and leaves a clean $\sin(2\phi)$ that depends only on the phase error. It is zero at lock ($\phi=0$), has the right sign to push $\phi$ back toward zero, and is completely blind to the data — exactly what a carrier-recovery discriminator needs.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> The Costas error is $e=\tfrac12A^2\sin(2\phi)$. To fold the Costas loop into the standard linear PLL machinery (with $\omega_n$, $\zeta$, $B_L$) we need its small-signal phase-detector gain $K_d$. We linearise about lock.</p>

<p><b>Step 1 — Linearise the sine near lock.</b> For small $\phi$, $\sin(2\phi)\approx 2\phi$. Substitute:</p>
$$ e=\tfrac12A^2\sin(2\phi)\approx\tfrac12A^2\cdot 2\phi=A^2\,\phi. $$

<p><b>Step 2 — Read off the detector gain.</b> The phase-detector gain is the slope $de/d\phi$ at $\phi=0$:</p>
$$ K_d=\left.\frac{de}{d\phi}\right|_{\phi=0}=\left.A^2\cos(2\phi)\right|_{\phi=0}=A^2. $$
<p>So the effective PD is linear with slope $A^2$, and every PLL formula applies with this $K_d$.</p>

<p><b>Result.</b></p>
$$ \boxed{\,e\approx A^2\,\phi\ \ (\phi\ \text{small})\ \Rightarrow\ K_d\propto A^2\,} $$
<p><i>Intuition:</i> the Costas detector behaves like an ordinary phase detector near lock, but its gain scales with signal <i>power</i> $A^2$ (not amplitude $A$), because the arms multiplied two amplitude-$A$ signals together. This power dependence is why weak signals give a soft, low-gain loop — a manifestation of the squaring loss.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> The error $e=\tfrac12A^2\sin(2\phi)$ is zero at several phases. We must find which zero-crossings are <i>stable</i> equilibria (lock points) — because that determines the loop's phase ambiguity. We use the standard stability test: a zero is stable if the restoring slope is positive (error opposes displacement through the loop's negative feedback).</p>

<p><b>Step 1 — Find all zeros.</b> $\sin(2\phi)=0$ whenever $2\phi=n\pi$, i.e.</p>
$$ \phi=0,\ \tfrac{\pi}{2},\ \pi,\ \tfrac{3\pi}{2},\dots $$

<p><b>Step 2 — Stability via the slope.</b> A lock point is stable when the error curve crosses zero with a positive slope $de/d\phi>0$ (so a small positive $\phi$ produces a correcting error). Compute the slope:</p>
$$ \frac{de}{d\phi}=A^2\cos(2\phi). $$

<p><b>Step 3 — Test each zero.</b></p>
<ul>
<li>$\phi=0$: $\cos 0=+1>0$ → <b>stable</b>.</li>
<li>$\phi=\pi/2$: $\cos\pi=-1<0$ → unstable.</li>
<li>$\phi=\pi$: $\cos 2\pi=+1>0$ → <b>stable</b>.</li>
<li>$\phi=3\pi/2$: $\cos 3\pi=-1<0$ → unstable.</li>
</ul>

<p><b>Step 4 — Interpret.</b> The two stable points are $\phi=0$ and $\phi=\pi$, i.e. the loop may lock either in-phase or 180° out of phase.</p>

<p><b>Result.</b></p>
$$ \boxed{\,e=0\ \text{and stable at}\ \phi=0\ \text{and}\ \phi=\pi\,} $$
<p><i>Intuition:</i> because $\sin(2\phi)$ has period $\pi$ (not $2\pi$), the loop cannot distinguish $\phi$ from $\phi+\pi$ — this is the well-known <b>180° phase ambiguity</b> of BPSK carrier recovery. It flips the sign of the recovered data, so it must be resolved externally by differential encoding or a known sync pattern.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> Multiplying the two noisy arms (each containing signal×noise and noise×noise) degrades the effective SNR compared with an ideal carrier-tracking PLL. This penalty is the <i>squaring loss</i> $S_L$. We derive the effective loop SNR from the ideal one.</p>

<p><b>Step 1 — Ideal loop SNR.</b> Without squaring loss, the loop SNR for a carrier of power $C$, noise density $N_0$, in loop bandwidth $B_L$ is</p>
$$ \rho=\frac{C}{N_0 B_L}. $$
<p>This is what a pure PLL locking to a real tone would achieve.</p>

<p><b>Step 2 — Where the extra loss comes from.</b> The Costas detector forms $I\cdot Q$. Expanding the arms with additive noise, the product contains a signal×signal term (wanted) plus signal×noise and noise×noise cross-terms. The noise×noise term has no counterpart in a linear PLL — it inflates the noise. Averaged, this multiplies the effective noise by a factor</p>
$$ S_L=1+\frac{1}{2\rho_i}, $$
<p>where $\rho_i$ is the SNR in the arm (predetection) bandwidth. At high SNR, $\rho_i\gg1$ so $S_L\to1$ (negligible penalty); at low SNR the $1/2\rho_i$ term dominates and the loss grows.</p>

<p><b>Step 3 — Apply the loss.</b> The effective loop SNR is the ideal one degraded by $S_L$:</p>
$$ \rho_{eff}=\frac{\rho}{S_L}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\rho_{eff}=\frac{\rho}{S_L},\quad \rho=\frac{C}{N_0B_L},\quad S_L=1+\frac{1}{2\rho_i}\ (\text{approx})\,} $$
<p><i>Intuition:</i> squaring the signal to strip the modulation also squares (and cross-multiplies) the noise, so the Costas loop pays a penalty $S_L\ge1$ that is worst at low SNR. This is the price of recovering a <i>suppressed</i> carrier — there was no clean tone to lock to, so we synthesised one nonlinearly and paid in noise.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> Having the effective loop SNR $\rho_{eff}$, we can state the phase-error variance at lock — the quantity that sets bit-error-rate degradation from imperfect carrier phase. We reuse the universal tracking-loop relation.</p>

<p><b>Step 1 — Universal small-signal relation.</b> For any coherent tracking loop, the linearised phase-error variance is one over twice the loop SNR (the same $\tfrac12$ factor as the PLL, from noise projecting onto the quadrature axis):</p>
$$ \sigma_\phi^2\approx\frac{1}{2\rho_{eff}}. $$

<p><b>Step 2 — Substitute the effective SNR.</b> Use $\rho_{eff}=\rho/S_L$ with $\rho=C/(N_0B_L)=(C/N_0)/B_L$:</p>
$$ \sigma_\phi^2=\frac{S_L}{2\rho}=\frac{S_L}{2}\cdot\frac{N_0 B_L}{C}=\frac{S_L\,B_L}{2\,(C/N_0)}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\sigma_\phi^2\approx\frac{1}{2\rho_{eff}}=\frac{S_L\,B_L}{2\,(C/N_0)}\,} $$
<p><i>Intuition:</i> identical in form to the PLL jitter ($B_L$ over link strength) but multiplied by the squaring loss $S_L\ge1$ — the Costas loop always jitters a little more than an ideal PLL at the same $C/N_0$, and much more when the signal is weak. Narrowing $B_L$ or improving $C/N_0$ both tighten the lock.</p>
`,

    6: String.raw`
<p><b>Where we start.</b> QPSK carries two bits per symbol as four phase states $90°$ apart, so its ambiguity is fourfold and a single $I\cdot Q$ product is not data-independent. We derive a fourth-order error that strips QPSK modulation, giving $\sin(4\phi)$.</p>

<p><b>Step 1 — QPSK arm outputs.</b> With independent $\pm1$ data on each arm, $d_I$ and $d_Q$, and phase error $\phi$, the demodulated arms are</p>
$$ I=A(d_I\cos\phi-d_Q\sin\phi),\qquad Q=A(d_Q\cos\phi+d_I\sin\phi). $$
<p>A simple $I\cdot Q$ product no longer cancels both data bits, so we need a cleverer, decision-directed combination.</p>

<p><b>Step 2 — The hard-limiting (fourth-power) discriminator.</b> Form the difference of each arm times the sign (hard decision) of the other:</p>
$$ e_{QPSK}=\text{sgn}(I)\,Q-\text{sgn}(Q)\,I. $$
<p>Taking $\text{sgn}$ removes the data amplitude on each arm, leaving a function of $\phi$ alone. This is the QPSK analogue of the BPSK $I\cdot Q$ — a nonlinearity that raises the symmetry from order 2 to order 4.</p>

<p><b>Step 3 — Small-error behaviour.</b> Substituting the arm expressions and expanding for small $\phi$, all data terms cancel and the residual is proportional to a four-times-angle sinusoid:</p>
$$ e_{QPSK}\ \propto\ \sin(4\phi)\approx 4\phi\quad(\phi\ \text{small}). $$

<p><b>Step 4 — Why the factor 4.</b> QPSK has fourfold phase symmetry (lock points every $90°$), so the discriminator must be periodic with period $\pi/2$: hence $\sin(4\phi)$, whose zeros $\phi=0,\tfrac{\pi}{2},\pi,\tfrac{3\pi}{2}$ match the four constellation phases.</p>

<p><b>Result.</b></p>
$$ \boxed{\,e_{QPSK}=\text{sgn}(I)\,Q-\text{sgn}(Q)\,I\ \propto\ \sin(4\phi)\ (\text{small }\phi)\,} $$
<p><i>Intuition:</i> BPSK needed a squaring ($\times2$ symmetry, $\sin 2\phi$); QPSK needs a fourth-power-like operation ($\times4$ symmetry, $\sin 4\phi$), reflecting its four indistinguishable lock points and hence a <b>90° phase ambiguity</b> that differential encoding must resolve.</p>
`

  }

});
