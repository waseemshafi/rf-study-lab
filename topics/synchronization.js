// Synchronization category: PLL, FLL, Costas Loop
CONTENT.topics.push(
  {
    id: 'pll',
    title: 'Phase-Locked Loop (PLL)',
    category: 'Synchronization',
    tags: ['pll', 'synchronization', 'vco', 'loop-filter', 'phase-detector', 'frequency-synthesis', 'carrier-recovery'],
    summary: String.raw`A feedback control loop that forces a local VCO to track the phase (and hence frequency) of an input reference by driving the phase error to a constant through a phase detector, loop filter, and voltage-controlled oscillator.`,
    prerequisites: ['comm-basics', 'noise', 'phase-noise'],
    intro: String.raw`<p>The <strong>Phase-Locked Loop (PLL)</strong> is the workhorse of synchronization. It is a negative-feedback system whose job is to make a locally generated oscillator match the <em>phase</em> of an incoming signal. Because the time-derivative of phase is frequency, matching phase automatically forces the two signals to the same frequency, but with the far stronger constraint that the phase error stays bounded and, in the steady state, constant. This single idea underlies carrier recovery in coherent receivers, clock recovery, frequency synthesis, FM/PM demodulation, and clean-up of noisy references.</p>
<p>The PLL contains three canonical blocks in a loop: a <strong>phase detector (PD)</strong> that produces a voltage proportional to the phase difference between input and VCO, a <strong>loop filter (LF)</strong> that smooths this error and sets the dynamics, and a <strong>voltage-controlled oscillator (VCO)</strong> whose instantaneous frequency is proportional to its control voltage. The crucial insight for analysis is that the VCO integrates control voltage into phase, so the VCO acts as a $1/s$ integrator in the phase domain. This makes even a "first-order" phase-detector-plus-VCO loop a type-1 system, and it is why steady-state phase error to a frequency step can be driven to zero.</p>`,
    sections: [
      {
        h: 'Motivation and the three building blocks',
        html: String.raw`<p>A coherent receiver must multiply the incoming signal by a locally generated carrier that is aligned in both frequency and phase; any residual offset rotates the constellation and destroys the matched-filter SNR advantage. Generating a free-running local oscillator that happens to match a transmitter thousands of kilometres away is impossible, so we instead <em>lock</em> the local oscillator to a recovered reference. The PLL is the mechanism.</p>
<ul>
<li><strong>Phase detector (PD):</strong> outputs a voltage $v_d = K_d\,(\theta_i - \theta_o)$ for small errors, where $K_d$ has units of volts per radian. Implementations range from an analog multiplier (mixer), through XOR gates for digital signals, to a phase-frequency detector (PFD) with a charge pump for synthesizers.</li>
<li><strong>Loop filter (LF):</strong> a low-pass filter $F(s)$ that rejects the double-frequency term and high-frequency noise, and — critically — shapes the loop's order, bandwidth, and damping. A simple lag-lead filter $F(s)=(1+s\tau_2)/(s\tau_1)$ adds a pole at the origin (an integrator) that raises the loop to type 2.</li>
<li><strong>Voltage-controlled oscillator (VCO):</strong> instantaneous frequency $\omega_{out}=\omega_0 + K_v\,v_c$, so the excess phase is $\theta_o = K_v\int v_c\,dt$. In the Laplace domain $\theta_o(s) = (K_v/s)\,V_c(s)$: the VCO is a pure integrator with gain $K_v$ (rad/s per volt).</li>
</ul>
<div class="callout"><strong>Key mental model:</strong> Everything in a PLL is analysed in terms of <em>phase</em>, not the RF waveform itself. The PD compares phases, the LF filters the phase-error voltage, and the VCO integrates voltage back into phase. Frequency lock is a by-product of phase lock.</div>`
      },
      {
        h: 'Linearized phase model and loop gain',
        html: String.raw`<p>Once the loop is near lock, the phase error $\phi=\theta_i-\theta_o$ is small and the PD is linear. We replace the nonlinear multiplier by its slope $K_d$ and draw the loop entirely in the phase domain. The forward path from phase error to output phase is</p>
<p>$$G(s)=K_d\,F(s)\,\frac{K_v}{s}.$$</p>
<p>The factor $1/s$ is the VCO integrator. The product $K = K_d K_v$ (units rad/s per rad, i.e. s$^{-1}$) is the <strong>loop gain</strong> or DC loop gain, and it directly sets bandwidth and error performance. With unity feedback (VCO phase is fed straight back into the PD), the closed-loop phase transfer function is</p>
<p>$$H(s)=\frac{\theta_o(s)}{\theta_i(s)}=\frac{G(s)}{1+G(s)}=\frac{K_d K_v F(s)}{s+K_d K_v F(s)}.$$</p>
<p>The <strong>error transfer function</strong> (how much phase error survives) is the complement</p>
<p>$$H_e(s)=\frac{\phi(s)}{\theta_i(s)}=1-H(s)=\frac{s}{s+K_d K_v F(s)}.$$</p>
<table class="data">
<tr><th>Block</th><th>Phase-domain transfer</th><th>Role</th></tr>
<tr><td>Phase detector</td><td>$K_d$ (V/rad)</td><td>compare phases</td></tr>
<tr><td>Loop filter</td><td>$F(s)$</td><td>set dynamics, reject $2\omega$</td></tr>
<tr><td>VCO</td><td>$K_v/s$ (rad/s/V $\times$ integrator)</td><td>voltage to phase</td></tr>
</table>`
      },
      {
        h: 'Second-order standard form: natural frequency and damping',
        html: String.raw`<p>The most common practical PLL uses a passive or active lag-lead filter $F(s)=(1+s\tau_2)/(s\tau_1)$, which puts a pole at the origin. Substituting into $H(s)$ gives the textbook second-order form</p>
<p>$$H(s)=\frac{2\zeta\omega_n s+\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2},$$</p>
<p>with</p>
<p>$$\omega_n=\sqrt{\frac{K_d K_v}{\tau_1}},\qquad \zeta=\frac{\omega_n\tau_2}{2}=\frac{\tau_2}{2}\sqrt{\frac{K_d K_v}{\tau_1}}.$$</p>
<p>Here $\omega_n$ is the <strong>natural frequency</strong> (rad/s) and $\zeta$ is the <strong>damping ratio</strong>. These are exactly the parameters of a mass-spring-damper, so all the intuition from classical control transfers:</p>
<ul>
<li>$\zeta<1$ underdamped: fast but rings, with overshoot $\approx e^{-\pi\zeta/\sqrt{1-\zeta^2}}$.</li>
<li>$\zeta=0.707$ (the popular "Butterworth"/maximally-flat choice) gives a good compromise: peaking of about 1 dB and fast settling.</li>
<li>$\zeta\ge 1$ overdamped: no overshoot but sluggish.</li>
</ul>
<div class="callout"><strong>Bandwidth vs. tracking trade-off:</strong> A wide loop (large $\omega_n$) acquires quickly and tracks fast dynamics/Doppler, but passes more input phase noise and thermal noise. A narrow loop cleans up noise beautifully but is slow to acquire and can lose lock under fast dynamics. This tension governs every PLL design decision.</div>`
      },
      {
        h: 'Loop bandwidth, type, order, and steady-state error',
        html: String.raw`<p>Two properties are often confused. <strong>Order</strong> is the degree of the closed-loop denominator polynomial (number of poles). <strong>Type</strong> is the number of pure integrators (poles at $s=0$) in the open loop. The VCO always contributes one integrator, so the simplest loop is type 1; adding an integrator in the loop filter makes it type 2.</p>
<p>The <strong>one-sided noise bandwidth</strong> $B_L$ (Hz) determines how much noise power the loop passes:</p>
<p>$$B_L=\int_0^{\infty}|H(j2\pi f)|^2\,df=\frac{\omega_n}{2}\left(\zeta+\frac{1}{4\zeta}\right)\ \text{(in Hz, with }\omega_n\text{ in rad/s)}.$$</p>
<p>Steady-state phase error follows from the final value theorem $\phi_{ss}=\lim_{s\to0}sH_e(s)\Theta_i(s)$:</p>
<table class="data">
<tr><th>Input</th><th>$\theta_i(t)$</th><th>Type-1 loop</th><th>Type-2 loop</th></tr>
<tr><td>Phase step $\Delta\theta$</td><td>$\Delta\theta\,u(t)$</td><td>0</td><td>0</td></tr>
<tr><td>Frequency step $\Delta\omega$</td><td>$\Delta\omega\,t$</td><td>$\Delta\omega/K$ (finite)</td><td>0</td></tr>
<tr><td>Frequency ramp $\dot\omega$ (Doppler rate)</td><td>$\tfrac12\dot\omega t^2$</td><td>$\infty$ (loses lock)</td><td>$\dot\omega/\omega_n^2$ (finite)</td></tr>
</table>
<p>This is why GPS and satellite receivers use type-2 (or type-3) loops: a constant frequency offset (a steady Doppler) produces zero static phase error, and a constant Doppler rate produces only a finite bias.</p>`
      },
      {
        h: 'Acquisition: capture range, lock range, and pull-in',
        html: String.raw`<p>The linear model is only valid once the loop is locked. Getting there involves nonlinear dynamics. Several ranges characterise acquisition, in increasing order of difficulty:</p>
<ul>
<li><strong>Hold-in (lock) range $\Delta\omega_H$:</strong> the maximum static frequency offset the loop can <em>maintain</em> lock against once locked. Limited by PD range and available control voltage; for a sinusoidal PD, $\Delta\omega_H\approx K_d K_v = K$ (the DC loop gain).</li>
<li><strong>Pull-in range $\Delta\omega_P$:</strong> the offset from which the loop will <em>eventually</em> acquire lock, possibly after a slow, cycle-slipping "beat-note" pull-in transient. For a high-gain type-2 loop $\Delta\omega_P$ can be very large.</li>
<li><strong>Capture (lock-in) range $\Delta\omega_L$:</strong> the offset from which the loop locks <em>quickly</em>, within roughly one beat cycle, without slips. Approximately $\Delta\omega_L\approx 2\zeta\omega_n$ for a second-order loop. Always $\Delta\omega_L \le \Delta\omega_P \le \Delta\omega_H$.</li>
</ul>
<div class="callout"><strong>The acquisition dilemma:</strong> The capture range is roughly proportional to the loop bandwidth, but low noise wants a narrow loop. A narrow PLL therefore has a tiny capture range and may never lock onto a large initial offset — motivating a wider acquisition aid such as an FLL or a frequency sweep before handing over to a narrow tracking PLL.</div>`
      },
      {
        h: 'Impairments: noise, phase noise, and cycle slips',
        html: String.raw`<p>The loop must live with three main impairments:</p>
<ul>
<li><strong>Reference phase noise (inside $B_L$)</strong> is passed to the output because $|H(j\omega)|\approx1$ at low frequency — the PLL <em>tracks</em> low-offset phase noise of the input.</li>
<li><strong>VCO phase noise (high offset)</strong> is <em>suppressed</em> inside the loop because $H_e\approx1$ there; the loop acts as a high-pass on VCO noise. Thus the closed-loop output takes the reference at low offsets and the VCO at high offsets, crossing over near $\omega_n$. Designers place $\omega_n$ where the reference and free-running VCO phase-noise curves cross.</li>
<li><strong>Thermal noise</strong> produces an output phase-error variance $\sigma_\phi^2=1/(2\,\text{SNR}_L)=B_L\,N_0/C$ where $C/N_0$ is the carrier-to-noise density. When $\sigma_\phi$ grows to roughly a quarter-cycle the loop suffers a <strong>cycle slip</strong>: the phase error jumps by $2\pi$, momentarily losing lock. Mean time between slips falls exponentially as loop SNR drops.</li>
</ul>
<p>The design tension is explicit: $\sigma_\phi^2=B_L N_0/C$ wants a small $B_L$, but dynamic stress error (Doppler-rate bias) $\propto 1/\omega_n^2$ wants a large $B_L$. The rule of thumb is to keep the total $3\sigma_\phi$ plus dynamic error below about $45^{\circ}$ for a Costas/PLL to hold lock.</p>`
      },
      {
        h: 'Frequency synthesis with divide-by-N',
        html: String.raw`<p>The PLL's most widespread use is the <strong>frequency synthesizer</strong>. A stable crystal reference $f_{ref}$ is divided by $R$, compared in a PFD to a divided-down version of the VCO, and the VCO output is divided by $N$ in the feedback path. In lock the two PFD inputs are equal in frequency, so</p>
<p>$$\frac{f_{ref}}{R}=\frac{f_{out}}{N}\quad\Longrightarrow\quad f_{out}=\frac{N}{R}\,f_{ref}.$$</p>
<p>Changing the integer $N$ steps the output in units of the <strong>channel spacing</strong> $f_{ref}/R$. Because the feedback divider divides phase, the VCO/PD loop gain is scaled by $1/N$, so $\omega_n\propto1/\sqrt{N}$ — the loop bandwidth changes as you tune, a real design concern in wideband synthesizers.</p>
<p><strong>Fractional-N</strong> synthesizers dither $N$ between integers (typically with a delta-sigma modulator) to achieve an effective non-integer average $N$, giving fine frequency resolution without a tiny comparison frequency, at the cost of quantization spurs that the modulator shapes to high offsets.</p>
<div class="callout"><strong>Worked synth:</strong> With $f_{ref}=10$ MHz and $R=100$, the comparison frequency is 100 kHz, so channels are spaced 100 kHz. To synthesize 2.400 GHz set $N=f_{out}R/f_{ref}=24000$. For 2.4001 GHz set $N=24001$.</div>`
      },
      {
        h: 'Applications and design summary',
        html: String.raw`<p>PLLs appear wherever a clean, aligned oscillator is needed: coherent carrier recovery (often via a Costas loop, a PLL variant), symbol/clock recovery, FM and PM demodulation (the control voltage <em>is</em> the demodulated message for FM), frequency synthesis in every radio and CPU clock, jitter clean-up, and de-skewing / clock distribution.</p>
<table class="data">
<tr><th>Design lever</th><th>Increase it to...</th><th>Cost</th></tr>
<tr><td>Loop bandwidth $B_L$ / $\omega_n$</td><td>acquire faster, track more Doppler, wider capture</td><td>more noise, more reference phase noise passed</td></tr>
<tr><td>Damping $\zeta$</td><td>reduce overshoot/ringing</td><td>near 0.707 is optimal; too high is slow</td></tr>
<tr><td>Loop type</td><td>kill steady-state error to freq step/ramp</td><td>added integrator can threaten stability</td></tr>
</table>
<p>A canonical starting point: choose $\zeta=0.707$, set $\omega_n$ at the reference/VCO phase-noise crossover, verify capture range $\approx2\zeta\omega_n$ exceeds the expected initial offset, and check settling time $t_s\approx4/(\zeta\omega_n)$ against the acquisition budget.</p>`
      }
    ],
    keyPoints: [
      String.raw`A PLL drives phase error to a constant; frequency lock is a by-product of phase lock.`,
      String.raw`The VCO is a $1/s$ integrator in the phase domain — it converts control voltage into phase, giving every PLL at least type-1 behaviour.`,
      String.raw`Closed-loop phase transfer $H(s)=G/(1+G)$ with $G(s)=K_dK_vF(s)/s$; the error transfer is $H_e(s)=1-H(s)=s/(s+K_dK_vF(s))$.`,
      String.raw`Second-order standard form: $\omega_n=\sqrt{K_dK_v/\tau_1}$, $\zeta=(\tau_2/2)\sqrt{K_dK_v/\tau_1}$; $\zeta\approx0.707$ is the usual sweet spot.`,
      String.raw`One-sided noise bandwidth $B_L=(\omega_n/2)(\zeta+1/4\zeta)$ Hz sets passed noise; thermal phase-error variance $\sigma_\phi^2=B_LN_0/C$.`,
      String.raw`Type-1 loop has finite phase error $\Delta\omega/K$ to a frequency step; type-2 has zero error to a step and finite error to a Doppler ramp.`,
      String.raw`Lock hierarchy: capture (lock-in) $\le$ pull-in $\le$ hold-in; capture range $\approx2\zeta\omega_n$.`,
      String.raw`Loop is low-pass to reference phase noise and high-pass to VCO phase noise, crossing over near $\omega_n$.`,
      String.raw`Cycle slips occur when RMS phase error approaches a quarter-cycle; keep total error under about $45^{\circ}$.`,
      String.raw`Synthesizer: $f_{out}=(N/R)f_{ref}$; channel spacing is $f_{ref}/R$ and loop bandwidth scales as $1/\sqrt{N}$.`,
      String.raw`Settling time rule of thumb $t_s\approx4/(\zeta\omega_n)$ (to 2% band).`,
      String.raw`Wide loops acquire fast but are noisy; narrow loops are clean but slow — the central PLL trade-off.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr-pll" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<circle cx="70" cy="70" r="18" fill="#1c232e" stroke="#4dabf7"/><text x="70" y="75" fill="#e6edf3" font-size="16" text-anchor="middle">PD</text>
<rect x="150" y="52" width="90" height="36" fill="#1c232e" stroke="#63e6be"/><text x="195" y="75" fill="#e6edf3" font-size="12" text-anchor="middle">Loop filter</text>
<text x="195" y="45" fill="#9aa7b5" font-size="11" text-anchor="middle">F(s)</text>
<rect x="330" y="52" width="80" height="36" fill="#1c232e" stroke="#ffa94d"/><text x="370" y="70" fill="#e6edf3" font-size="12" text-anchor="middle">VCO</text><text x="370" y="83" fill="#9aa7b5" font-size="10" text-anchor="middle">Kv/s</text>
<line x1="10" y1="70" x2="52" y2="70" stroke="#9aa7b5" marker-end="url(#arr-pll)"/><text x="20" y="62" fill="#9aa7b5" font-size="11">θi</text>
<line x1="88" y1="70" x2="150" y2="70" stroke="#9aa7b5" marker-end="url(#arr-pll)"/><text x="118" y="62" fill="#9aa7b5" font-size="10">vd=Kdφ</text>
<line x1="240" y1="70" x2="330" y2="70" stroke="#9aa7b5" marker-end="url(#arr-pll)"/><text x="285" y="62" fill="#9aa7b5" font-size="10">vc</text>
<line x1="410" y1="70" x2="480" y2="70" stroke="#9aa7b5" marker-end="url(#arr-pll)"/><text x="450" y="62" fill="#9aa7b5" font-size="11">θo</text>
<line x1="440" y1="70" x2="440" y2="150" stroke="#9aa7b5"/><line x1="440" y1="150" x2="70" y2="150" stroke="#9aa7b5"/><line x1="70" y1="150" x2="70" y2="88" stroke="#9aa7b5" marker-end="url(#arr-pll)"/>
<text x="250" y="145" fill="#9aa7b5" font-size="10" text-anchor="middle">feedback (θo)</text>
</svg>`,
        caption: 'Classic PLL block diagram: phase detector compares input and VCO phase, loop filter shapes the error, VCO integrates control voltage into output phase, and the output phase feeds back.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<text x="270" y="20" fill="#e6edf3" font-size="13" text-anchor="middle">Second-order closed-loop magnitude |H(jω)| vs offset</text>
<line x1="50" y1="170" x2="510" y2="170" stroke="#9aa7b5"/><line x1="50" y1="30" x2="50" y2="170" stroke="#9aa7b5"/>
<text x="280" y="200" fill="#9aa7b5" font-size="11" text-anchor="middle">frequency offset (log)</text>
<text x="20" y="100" fill="#9aa7b5" font-size="11" transform="rotate(-90 20 100)">|H| dB</text>
<path d="M60,90 C160,88 220,72 250,72 C290,72 320,110 380,140 C430,162 480,168 505,169" fill="none" stroke="#4dabf7" stroke-width="2"/>
<path d="M60,92 L250,90 C320,88 360,118 400,142 C440,160 480,167 505,169" fill="none" stroke="#63e6be" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="250" y1="30" x2="250" y2="170" stroke="#ff6b6b" stroke-dasharray="3 3"/><text x="250" y="42" fill="#ff6b6b" font-size="11" text-anchor="middle">ωn</text>
<text x="130" y="60" fill="#4dabf7" font-size="11">ζ=0.4 (peaking)</text>
<text x="120" y="105" fill="#63e6be" font-size="11">ζ=0.707 (flat)</text>
</svg>`,
        caption: 'Closed-loop response: low damping produces gain peaking near the natural frequency, while ζ≈0.707 gives a maximally flat low-pass shape. The loop tracks reference phase below ωn and rolls off above it.'
      }
    ],
    equations: [
      {
        title: 'Open-loop gain of the phase model',
        tex: String.raw`$$G(s)=K_d\,F(s)\,\frac{K_v}{s}$$`,
        derivation: String.raw`<p>The PD gives $v_d=K_d\phi$. The loop filter multiplies by $F(s)$. The VCO frequency deviation is $K_v v_c$, and phase is the integral of frequency, so $\theta_o=K_v\int v_c\,dt \Rightarrow \theta_o(s)=(K_v/s)V_c(s)$. Cascading the three gives $G(s)=K_dF(s)K_v/s$. The $1/s$ is the VCO integrator, the source of type-1 behaviour.</p>`
      },
      {
        title: 'Closed-loop and error transfer functions',
        tex: String.raw`$$H(s)=\frac{G(s)}{1+G(s)},\qquad H_e(s)=1-H(s)=\frac{s}{s+K_dK_vF(s)}$$`,
        derivation: String.raw`<p>With unity feedback, $\theta_o=G(s)(\theta_i-\theta_o)$, so $\theta_o(1+G)=G\theta_i$ giving $H=G/(1+G)$. The error is $\phi=\theta_i-\theta_o=\theta_i(1-H)$, hence $H_e=1-H=1/(1+G)$. Substituting $G=K_dK_vF(s)/s$ and clearing $s$ yields $H_e=s/(s+K_dK_vF(s))$.</p>`
      },
      {
        title: 'Second-order natural frequency and damping',
        tex: String.raw`$$\omega_n=\sqrt{\frac{K_dK_v}{\tau_1}},\qquad \zeta=\frac{\tau_2}{2}\sqrt{\frac{K_dK_v}{\tau_1}}$$`,
        derivation: String.raw`<p>Take $F(s)=(1+s\tau_2)/(s\tau_1)$. Then $G(s)=K_dK_v(1+s\tau_2)/(s^2\tau_1)$ and $H(s)=G/(1+G)=[K_dK_v(1+s\tau_2)/\tau_1]/[s^2+(K_dK_v\tau_2/\tau_1)s+K_dK_v/\tau_1]$. Matching the denominator to $s^2+2\zeta\omega_n s+\omega_n^2$: the constant term gives $\omega_n^2=K_dK_v/\tau_1$, and the $s$-term gives $2\zeta\omega_n=K_dK_v\tau_2/\tau_1=\omega_n^2\tau_2$, so $\zeta=\omega_n\tau_2/2=(\tau_2/2)\sqrt{K_dK_v/\tau_1}$.</p>`
      },
      {
        title: 'One-sided loop noise bandwidth',
        tex: String.raw`$$B_L=\int_0^{\infty}|H(j2\pi f)|^2\,df=\frac{\omega_n}{2}\left(\zeta+\frac{1}{4\zeta}\right)$$`,
        derivation: String.raw`<p>$B_L$ is defined so that a white input phase-noise density passed through $|H|^2$ produces the same output variance as an ideal brick-wall of width $B_L$. Evaluating the integral of $|H(j\omega)|^2$ for the standard second-order $H$ gives the closed form. Note it is minimised near $\zeta=0.5$ but $\zeta=0.707$ is preferred for transient behaviour; there $B_L\approx0.53\,\omega_n$ (in Hz with $\omega_n$ in rad/s).</p>`
      },
      {
        title: 'Steady-state error to a frequency step (type-1)',
        tex: String.raw`$$\phi_{ss}=\lim_{s\to0}sH_e(s)\frac{\Delta\omega}{s^2}=\frac{\Delta\omega}{K_dK_v}=\frac{\Delta\omega}{K}$$`,
        derivation: String.raw`<p>A frequency step $\Delta\omega$ is a phase ramp: $\theta_i(t)=\Delta\omega\,t \Rightarrow \Theta_i(s)=\Delta\omega/s^2$. For a type-1 loop $F(s)=$ constant so $H_e(s)=s/(s+K)$. Final value theorem: $\phi_{ss}=\lim_{s\to0}s\cdot\frac{s}{s+K}\cdot\frac{\Delta\omega}{s^2}=\lim_{s\to0}\frac{\Delta\omega}{s+K}=\Delta\omega/K$. A type-2 loop has an extra $1/s$ in $F$, making the limit zero.</p>`
      },
      {
        title: 'Capture range (approximate)',
        tex: String.raw`$$\Delta\omega_L\approx 2\zeta\omega_n$$`,
        derivation: String.raw`<p>Fast (lock-in) capture requires the beat-note transient to be pulled in within about one cycle. Analysis of the nonlinear pull-in for a high-gain second-order loop shows the lock-in range scales with the loop's response speed, giving $\Delta\omega_L\approx2\zeta\omega_n$. This is much smaller than the pull-in range (which grows with loop gain), so a large initial offset may lock only slowly.</p>`
      },
      {
        title: 'Settling time to a phase/frequency step',
        tex: String.raw`$$t_s\approx\frac{4}{\zeta\omega_n}\ (\pm2\%),\qquad t_s\approx\frac{4.6}{\zeta\omega_n}\ (\pm1\%)$$`,
        derivation: String.raw`<p>The transient decays as $e^{-\zeta\omega_n t}$ (the real part of the complex poles $-\zeta\omega_n\pm j\omega_n\sqrt{1-\zeta^2}$). The envelope reaches 2% when $\zeta\omega_n t=\ln(1/0.02)\approx3.9\approx4$, giving $t_s\approx4/(\zeta\omega_n)$.</p>`
      },
      {
        title: 'Synthesizer output frequency',
        tex: String.raw`$$f_{out}=\frac{N}{R}\,f_{ref},\qquad \Delta f_{channel}=\frac{f_{ref}}{R}$$`,
        derivation: String.raw`<p>In lock the PFD inputs match: the reference divided by $R$ equals the VCO divided by $N$, i.e. $f_{ref}/R=f_{out}/N$. Solving gives $f_{out}=(N/R)f_{ref}$. Incrementing the integer $N$ by one shifts $f_{out}$ by $f_{ref}/R$, which is therefore the channel spacing.</p>`
      },
      {
        title: 'Thermal phase-error variance and loop SNR',
        tex: String.raw`$$\sigma_\phi^2=\frac{1}{2\,\text{SNR}_L}=\frac{B_L N_0}{C}=\frac{B_L}{C/N_0}$$`,
        derivation: String.raw`<p>Only noise within the loop bandwidth $B_L$ disturbs the phase estimate. The effective loop SNR is $\text{SNR}_L=C/(N_0 B_L)$ where $C/N_0$ is carrier-to-noise density. The output phase-error variance is $\sigma_\phi^2=1/(2\,\text{SNR}_L)=B_LN_0/C$. Smaller $B_L$ lowers $\sigma_\phi$ but slows the loop and shrinks capture range.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Why is the VCO modelled as $1/s$ in the phase domain?`, back: String.raw`Its instantaneous frequency is proportional to control voltage, and phase is the time-integral of frequency, so $\theta_o=K_v\int v_c\,dt \Rightarrow \theta_o(s)=(K_v/s)V_c(s)$ — a pure integrator.` },
      { front: String.raw`Write the closed-loop and error transfer functions.`, back: String.raw`$H(s)=G/(1+G)$ and $H_e(s)=1-H(s)=1/(1+G)=s/(s+K_dK_vF(s))$ with $G=K_dK_vF(s)/s$.` },
      { front: String.raw`Give $\omega_n$ and $\zeta$ for the standard lag-lead loop.`, back: String.raw`$\omega_n=\sqrt{K_dK_v/\tau_1}$ and $\zeta=(\tau_2/2)\sqrt{K_dK_v/\tau_1}=\omega_n\tau_2/2$.` },
      { front: String.raw`Difference between loop order and loop type?`, back: String.raw`Order = number of closed-loop poles (denominator degree). Type = number of pure integrators (poles at $s=0$) in the open loop. The VCO always gives one, so minimum type is 1.` },
      { front: String.raw`Steady-state phase error of a type-1 loop to a frequency step $\Delta\omega$?`, back: String.raw`$\phi_{ss}=\Delta\omega/K$ where $K=K_dK_v$ is the DC loop gain — finite and nonzero. A type-2 loop gives zero.` },
      { front: String.raw`Order the acquisition ranges from smallest to largest.`, back: String.raw`Capture (lock-in) $\le$ pull-in $\le$ hold-in. Capture $\approx2\zeta\omega_n$; hold-in $\approx K$.` },
      { front: String.raw`One-sided loop noise bandwidth formula?`, back: String.raw`$B_L=(\omega_n/2)(\zeta+1/4\zeta)$ Hz (with $\omega_n$ in rad/s); minimised near $\zeta=0.5$, but $\zeta=0.707$ is used for good transients.` },
      { front: String.raw`How does the loop treat reference vs VCO phase noise?`, back: String.raw`Low-pass to reference phase noise (tracks it inside $B_L$), high-pass to VCO phase noise (suppresses it inside the loop). Crossover near $\omega_n$.` },
      { front: String.raw`What causes a cycle slip?`, back: String.raw`Phase error growing near a quarter-cycle (thermal noise + dynamics), causing a $2\pi$ jump and momentary loss of lock. Mean time between slips falls exponentially with loop SNR.` },
      { front: String.raw`Synthesizer output frequency and channel spacing?`, back: String.raw`$f_{out}=(N/R)f_{ref}$; channel spacing $=f_{ref}/R$. Loop bandwidth scales as $1/\sqrt{N}$.` },
      { front: String.raw`Settling-time rule of thumb?`, back: String.raw`$t_s\approx4/(\zeta\omega_n)$ to the $\pm2\%$ band, since the transient envelope decays as $e^{-\zeta\omega_n t}$.` },
      { front: String.raw`Why does a narrow-bandwidth PLL struggle to acquire a large offset?`, back: String.raw`Capture range $\approx2\zeta\omega_n$ shrinks with bandwidth, so a large initial offset falls outside the fast-capture region and locks only slowly (if at all) — motivating an FLL aid.` },
      { front: String.raw`What does the PLL control voltage represent in an FM demodulator?`, back: String.raw`It is proportional to the input's instantaneous frequency deviation, i.e. the demodulated message itself.` },
      { front: String.raw`Thermal phase-error variance in terms of $C/N_0$?`, back: String.raw`$\sigma_\phi^2=B_LN_0/C=B_L/(C/N_0)$; halving $B_L$ halves the variance.` },
      { front: String.raw`What is the recommended maximum total tracking error before losing lock?`, back: String.raw`Roughly $45^{\circ}$ (rule of thumb: keep $3\sigma_\phi$ plus dynamic stress error below $\sim45^{\circ}$).` }
    ],
    mcqs: [
      { q: String.raw`In the linearized phase model, the VCO contributes which transfer function?`, options: [String.raw`$K_v$ (a constant gain)`, String.raw`$K_v/s$ (an integrator)`, String.raw`$K_v s$ (a differentiator)`, String.raw`$K_v/(1+s\tau)$ (a low-pass)`], answer: 1, explain: String.raw`Frequency is proportional to voltage and phase is its integral, so the VCO is $K_v/s$ — the loop's fundamental integrator and the reason it is at least type 1.` },
      { q: String.raw`A type-1 PLL sees a constant frequency offset $\Delta\omega$. The steady-state phase error is:`, options: [String.raw`0`, String.raw`$\Delta\omega/K$`, String.raw`$\infty$`, String.raw`$\Delta\omega\tau_2$`], answer: 1, explain: String.raw`Final value theorem on $H_e(s)=s/(s+K)$ with a phase-ramp input gives $\phi_{ss}=\Delta\omega/K$, finite and nonzero. A type-2 loop would give zero.` },
      { q: String.raw`Which damping ratio gives a maximally flat (Butterworth) closed-loop magnitude?`, options: [String.raw`$\zeta=0.3$`, String.raw`$\zeta=0.5$`, String.raw`$\zeta=0.707$`, String.raw`$\zeta=2.0$`], answer: 2, explain: String.raw`$\zeta=1/\sqrt2\approx0.707$ yields the maximally flat response with modest peaking and fast settling, the usual design choice.` },
      { q: String.raw`Ordering the acquisition ranges from smallest to largest gives:`, options: [String.raw`hold-in $\le$ pull-in $\le$ capture`, String.raw`capture $\le$ pull-in $\le$ hold-in`, String.raw`pull-in $\le$ capture $\le$ hold-in`, String.raw`they are all equal`], answer: 1, explain: String.raw`Fast capture is the hardest (smallest range), eventual pull-in is larger, and simply holding an already-acquired lock spans the widest range.` },
      { q: String.raw`In a PLL frequency synthesizer with feedback divider $N$ and reference divider $R$, the output frequency is:`, options: [String.raw`$f_{ref}/(NR)$`, String.raw`$(N/R)f_{ref}$`, String.raw`$(R/N)f_{ref}$`, String.raw`$NRf_{ref}$`], answer: 1, explain: String.raw`In lock $f_{ref}/R=f_{out}/N$, so $f_{out}=(N/R)f_{ref}$; channel spacing is $f_{ref}/R$.` },
      { q: String.raw`How does the loop treat VCO phase noise?`, options: [String.raw`Low-pass (passes low-offset VCO noise)`, String.raw`High-pass (suppresses VCO noise inside the loop)`, String.raw`Band-pass around $\omega_n$`, String.raw`It has no effect on VCO noise`], answer: 1, explain: String.raw`The error transfer $H_e=1-H$ is high-pass, so the loop corrects (suppresses) low-offset VCO noise and lets high-offset VCO noise through; the crossover is near $\omega_n$.` },
      { q: String.raw`Thermal phase-error variance of a tracking loop is proportional to:`, options: [String.raw`$1/B_L$`, String.raw`$B_L$`, String.raw`$B_L^2$`, String.raw`$\omega_n^2$`], answer: 1, explain: String.raw`$\sigma_\phi^2=B_LN_0/C$: only noise within the loop bandwidth disturbs the estimate, so variance grows linearly with $B_L$.` },
      { q: String.raw`Increasing the feedback divider $N$ in a synthesizer has what effect on loop bandwidth?`, options: [String.raw`Increases $\omega_n$ as $\sqrt N$`, String.raw`Decreases $\omega_n$ as $1/\sqrt N$`, String.raw`No effect`, String.raw`Doubles $\omega_n$`], answer: 1, explain: String.raw`Dividing the VCO phase by $N$ scales the loop gain by $1/N$, so $\omega_n=\sqrt{K_dK_v/(N\tau_1)}\propto1/\sqrt N$.` },
      { q: String.raw`A cycle slip is best described as:`, options: [String.raw`A permanent loss of the reference signal`, String.raw`A $2\pi$ jump in phase error when noise/dynamics push the error near a quarter-cycle`, String.raw`The VCO ceasing to oscillate`, String.raw`The loop filter saturating permanently`], answer: 1, explain: String.raw`When RMS phase error approaches a quarter-cycle, the loop can momentarily slip by a full $2\pi$ before re-locking; mean time between slips drops exponentially with loop SNR.` },
      { q: String.raw`Which change most directly widens the fast-capture range?`, options: [String.raw`Reducing $\omega_n$`, String.raw`Increasing $\omega_n$ (wider loop)`, String.raw`Increasing $N$`, String.raw`Adding more thermal noise`], answer: 1, explain: String.raw`Capture range $\approx2\zeta\omega_n$, so a wider loop (larger $\omega_n$) captures larger offsets quickly — at the cost of more noise.` },
      { q: String.raw`The settling time of a second-order PLL to a step scales approximately as:`, options: [String.raw`$1/(\zeta\omega_n)$`, String.raw`$\zeta\omega_n$`, String.raw`$1/\omega_n^2$`, String.raw`$\zeta/\omega_n^2$`], answer: 0, explain: String.raw`The transient envelope decays as $e^{-\zeta\omega_n t}$, so $t_s\approx4/(\zeta\omega_n)$ to the 2% band.` },
      { q: String.raw`Which input drives a type-1 PLL out of lock (unbounded error) but only biases a type-2 loop?`, options: [String.raw`A phase step`, String.raw`A frequency step`, String.raw`A frequency ramp (constant Doppler rate)`, String.raw`A DC offset`], answer: 2, explain: String.raw`A frequency ramp produces infinite steady-state error in a type-1 loop (loss of lock) but only a finite bias $\dot\omega/\omega_n^2$ in a type-2 loop.` },
      { q: String.raw`The DC loop gain $K=K_dK_v$ has units of:`, options: [String.raw`volts`, String.raw`radians`, String.raw`s$^{-1}$ (rad/s per rad)`, String.raw`hertz per volt`], answer: 2, explain: String.raw`$K_d$ is V/rad and $K_v$ is (rad/s)/V, so the product is rad/s per rad $=$ s$^{-1}$; it sets both hold-in range and static error.` },
      { q: String.raw`In a fractional-N synthesizer, dithering $N$ with a delta-sigma modulator primarily:`, options: [String.raw`Eliminates all spurs`, String.raw`Achieves fine resolution while shaping quantization spurs to high offsets`, String.raw`Lowers the reference frequency permanently`, String.raw`Removes the need for a loop filter`], answer: 1, explain: String.raw`Averaging a dithered integer $N$ gives a non-integer effective divide ratio for fine resolution; the modulator noise-shapes the resulting quantization spurs to high offsets where the loop filters them.` },
      { q: String.raw`A good rule of thumb for placing the loop natural frequency $\omega_n$ in a clean-up PLL is:`, options: [String.raw`As high as possible always`, String.raw`At the crossover of the reference and free-running VCO phase-noise curves`, String.raw`Exactly at the carrier frequency`, String.raw`At the symbol rate`], answer: 1, explain: String.raw`Below $\omega_n$ the output follows the (cleaner) reference; above it the output follows the VCO. Placing $\omega_n$ at their phase-noise crossover minimises the composite output phase noise.` }
    ],
    numericals: [
      { q: String.raw`A second-order PLL has $K_d=0.5$ V/rad, $K_v=2\pi\times10^6$ rad/s/V, and $\tau_1=10^{-3}$ s. Find $\omega_n$.`, solution: String.raw`$K_dK_v=0.5\times2\pi\times10^6=\pi\times10^6\approx3.14\times10^6$ s$^{-1}$. $\omega_n=\sqrt{K_dK_v/\tau_1}=\sqrt{3.14\times10^6/10^{-3}}=\sqrt{3.14\times10^9}\approx5.6\times10^4$ rad/s $\approx8.9$ kHz.` },
      { q: String.raw`For the loop above with $\tau_2=2.5\times10^{-5}$ s, find the damping ratio $\zeta$.`, solution: String.raw`$\zeta=\omega_n\tau_2/2=(5.6\times10^4)(2.5\times10^{-5})/2=1.40/2=0.70$. This is essentially the maximally-flat design point.` },
      { q: String.raw`Using $\omega_n=5.6\times10^4$ rad/s and $\zeta=0.7$, estimate the one-sided noise bandwidth $B_L$ and the settling time.`, solution: String.raw`$B_L=(\omega_n/2)(\zeta+1/4\zeta)=(5.6\times10^4/2)(0.7+1/2.8)=(2.8\times10^4)(0.7+0.357)=2.8\times10^4\times1.057\approx2.96\times10^4$ Hz $\approx29.6$ kHz. Settling: $t_s\approx4/(\zeta\omega_n)=4/(0.7\times5.6\times10^4)=4/3.92\times10^4\approx1.02\times10^{-4}$ s $\approx102\ \mu$s.` },
      { q: String.raw`A type-1 PLL has $K=K_dK_v=3.14\times10^6$ s$^{-1}$. If the input frequency is offset by $\Delta f=5$ kHz, find the steady-state phase error.`, solution: String.raw`$\Delta\omega=2\pi\times5000=3.14\times10^4$ rad/s. $\phi_{ss}=\Delta\omega/K=3.14\times10^4/3.14\times10^6=0.01$ rad $\approx0.57^{\circ}$. Small because loop gain is high.` },
      { q: String.raw`Design a synthesizer for the 2.4 GHz band with 200 kHz channel spacing from a 20 MHz reference. Find $R$ and the $N$ for 2.402 GHz.`, solution: String.raw`Channel spacing $=f_{ref}/R \Rightarrow R=f_{ref}/\Delta f=20\text{ MHz}/200\text{ kHz}=100$, so comparison frequency $=200$ kHz. $N=f_{out}R/f_{ref}=f_{out}/\Delta f=2.402\times10^9/2\times10^5=12010$. Each unit increment of $N$ moves the output by 200 kHz.` },
      { q: String.raw`A tracking loop has $B_L=20$ Hz and receives $C/N_0=40$ dB-Hz. Find the RMS phase-error (thermal only).`, solution: String.raw`$C/N_0=10^{4.0}=10^4$ Hz. $\sigma_\phi^2=B_L/(C/N_0)=20/10^4=2\times10^{-3}$ rad$^2$. $\sigma_\phi=\sqrt{2\times10^{-3}}=0.0447$ rad $\approx2.6^{\circ}$. Comfortably below the $\sim45^{\circ}$ lock threshold, so lock is robust.` },
      { q: String.raw`Estimate the fast-capture range of a loop with $\omega_n=6.28\times10^4$ rad/s and $\zeta=0.707$.`, solution: String.raw`$\Delta\omega_L\approx2\zeta\omega_n=2\times0.707\times6.28\times10^4=8.88\times10^4$ rad/s. In Hz: $\Delta f_L=\Delta\omega_L/2\pi\approx1.41\times10^4$ Hz $\approx14.1$ kHz. Offsets beyond this lock only slowly via pull-in.` }
    ],
    realWorld: String.raw`<p>PLLs are everywhere in modern radios and computers. Every smartphone contains multiple fractional-N synthesizers that generate the exact LO frequencies for each cellular, Wi-Fi, GPS, and Bluetooth band from a single crystal. In GPS receivers, a type-2 or type-3 carrier-tracking PLL (usually a Costas variant) recovers the Doppler-shifted L1/L5 carrier so the navigation data and precise carrier-phase measurements can be extracted — a frequency ramp from satellite motion produces only a bounded bias in a type-2 loop, which is essential. Clock-and-data-recovery (CDR) PLLs in SerDes links (PCIe, Ethernet, USB) lock a VCO to embedded data transitions to regenerate a clean sampling clock. FM broadcast receivers demodulate audio directly from the PLL control voltage. And laboratory frequency references (e.g. GPS-disciplined oscillators) use a very narrow PLL to slave a clean local oscillator to a noisy but accurate long-term reference, taking the reference's accuracy at DC and the oscillator's low phase noise at high offsets.</p>`,
    related: ['costas-loop', 'fll', 'phase-noise', 'bpsk', 'adc']
  },
  {
    id: 'fll',
    title: 'Frequency-Locked Loop (FLL)',
    category: 'Synchronization',
    tags: ['fll', 'synchronization', 'frequency-discriminator', 'doppler', 'acquisition', 'fll-assisted-pll', 'gnss'],
    summary: String.raw`A feedback loop that drives the frequency error (not the phase error) to zero using a frequency discriminator, giving a much wider pull-in range and superior tolerance to high dynamics and low SNR at the cost of leaving a residual phase offset.`,
    prerequisites: ['comm-basics', 'pll', 'phase-noise'],
    intro: String.raw`<p>A <strong>Frequency-Locked Loop (FLL)</strong> is the frequency-domain sibling of the PLL. Instead of forcing the local oscillator's <em>phase</em> to match the input, it forces the local oscillator's <em>frequency</em> to match, driving the frequency error to zero and leaving phase free to drift. This apparently weaker goal is exactly what makes the FLL powerful: because it does not have to resolve phase, it tolerates far larger initial frequency uncertainty, much higher dynamics (Doppler and Doppler rate), and lower carrier-to-noise density than a PLL of comparable bandwidth.</p>
<p>The heart of an FLL is a <strong>frequency discriminator</strong> — a device whose output is proportional to the frequency difference between the input and the local replica. A common digital implementation compares the phase of the correlator output across two successive intervals: the change in phase over a known time is, by definition, a frequency estimate. The FLL is the acquisition workhorse in GNSS receivers and any high-dynamics link, usually handing over to a PLL once frequency is roughly aligned. This division of labour — wide, robust FLL first, then narrow, accurate PLL — is formalised in the <strong>FLL-assisted-PLL</strong> architecture.</p>`,
    sections: [
      {
        h: 'Why lock frequency instead of phase?',
        html: String.raw`<p>A PLL's fast-capture range is only about $2\zeta\omega_n$; a narrow (low-noise) PLL therefore cannot acquire a large initial frequency offset. Under high dynamics — a satellite fly-over, a fast-moving vehicle, or a jamming/vibration environment — the frequency can also change rapidly, stressing the loop. The FLL sidesteps both problems:</p>
<ul>
<li><strong>Wide pull-in:</strong> a frequency discriminator gives a usable (monotonic) error over a much broader offset than a phase detector's linear region, so the FLL can pull in from tens of kHz where a narrow PLL cannot.</li>
<li><strong>Dynamic robustness:</strong> the FLL cares only about matching frequency, so a fast-changing but well-defined Doppler is tracked without the phase-error blow-up that unlocks a PLL.</li>
<li><strong>Low-SNR tolerance:</strong> frequency (a first difference of phase) can be estimated reliably even when the instantaneous phase is too noisy for a PLL to hold, because the discriminator averages over an interval.</li>
</ul>
<div class="callout"><strong>The cost:</strong> An FLL leaves a residual, slowly drifting phase error. For coherent demodulation you ultimately need phase lock, so the FLL is an <em>acquisition and coarse-tracking</em> tool that precedes or assists a PLL/Costas loop rather than replacing it.</div>`
      },
      {
        h: 'Block-by-block operation',
        html: String.raw`<p>An FLL replaces the PLL's phase detector with a frequency discriminator; the loop filter and NCO/VCO are analogous, but the loop filter integrates a frequency error, so an FLL of a given "order" is one integration lower in phase terms than a PLL of the same name.</p>
<ul>
<li><strong>Frequency discriminator:</strong> produces $v_d=K_d(\omega_i-\omega_o)$ near zero error. In a digital receiver a popular discriminator uses two consecutive prompt correlator samples $P_1,P_2$ separated by $T$: the <em>cross</em> and <em>dot</em> products give $\text{cross}=I_1Q_2-I_2Q_1$ and $\text{dot}=I_1I_2+Q_1Q_2$, and the frequency estimate is $\hat{\Delta f}=\text{atan2}(\text{cross},\text{dot})/(2\pi T)$. The atan2 form is data-independent and works to $\pm1/(2T)$ Hz.</li>
<li><strong>Loop filter:</strong> smooths the frequency error and sets bandwidth. Because the discriminator output is already a frequency, a first-order filter yields a loop that zeroes a constant frequency offset; a second-order (integrating) filter zeroes a constant Doppler rate.</li>
<li><strong>NCO/VCO:</strong> the controlled oscillator's frequency is adjusted directly by the filtered error, closing the loop.</li>
</ul>`
      },
      {
        h: 'The frequency discriminator and its pull-in range',
        html: String.raw`<p>The discriminator characteristic $v_d=f(\Delta\omega)$ is typically a sine-like or arctangent S-curve that is monotonic (and therefore usable as an error signal) over a wide range around zero. The usable pull-in range is set by where this curve remains monotonic and single-valued.</p>
<p>For the two-sample atan2 discriminator, the unambiguous range is $|\Delta f|<1/(2T)$, where $T$ is the correlation/integration time. This exposes the core FLL trade-off:</p>
<ul>
<li><strong>Short $T$</strong> gives a wide unambiguous pull-in range $\pm1/(2T)$ but noisier frequency estimates (less averaging).</li>
<li><strong>Long $T$</strong> gives a low-noise estimate but a narrow pull-in range and cannot tolerate large offsets or fast dynamics (the phase can rotate more than half a cycle within $T$, aliasing the estimate).</li>
</ul>
<div class="callout"><strong>Rule:</strong> the maximum tolerable frequency offset for an atan2 FLL is roughly $1/(2T)$; e.g. with $T=1$ ms the pull-in range is $\pm500$ Hz, far wider than a comparable narrow PLL's capture range.</div>`
      },
      {
        h: 'Loop dynamics, bandwidth, and steady-state error',
        html: String.raw`<p>Because the discriminator measures frequency, the FLL's steady-state analysis differs from the PLL by one integration. Consider the frequency error $\Delta\omega$ as the tracked quantity:</p>
<table class="data">
<tr><th>Stress</th><th>First-order FLL</th><th>Second-order FLL</th></tr>
<tr><td>Constant frequency offset (step)</td><td>0 error</td><td>0 error</td></tr>
<tr><td>Constant Doppler rate (freq ramp)</td><td>finite frequency error</td><td>0 error</td></tr>
<tr><td>Constant Doppler acceleration</td><td>diverges</td><td>finite frequency error</td></tr>
</table>
<p>The one-sided FLL noise bandwidth $B_{fll}$ trades noise against dynamics just like a PLL. The thermal frequency-error variance for the atan2 discriminator is approximately</p>
<p>$$\sigma_f^2\approx\frac{B_{fll}}{2\pi^2 T^2\,(C/N_0)}\left(1+\frac{1}{T\,(C/N_0)}\right)\ \text{Hz}^2,$$</p>
<p>showing that longer $T$ and higher $C/N_0$ sharply reduce frequency jitter — the opposite pull relative to pull-in range.</p>`
      },
      {
        h: 'FLL-assisted-PLL and handover',
        html: String.raw`<p>The practical architecture combines both loops. During acquisition the wide FLL pulls the NCO frequency to within the PLL's fast-capture range; then the loop switches (or blends) into PLL mode for coherent, low-jitter tracking. Two common realisations:</p>
<ul>
<li><strong>Sequential handover:</strong> run the FLL until $|\Delta f|$ drops below a threshold (e.g. a fraction of the PLL capture range), then disable the discriminator and enable the phase detector. Simple, but a hard switch can cause a transient.</li>
<li><strong>FLL-assisted-PLL (blended):</strong> both discriminators run continuously and feed a shared loop filter; the FLL error dominates the higher-order (frequency/rate) integrators while the PLL error controls phase. This gives PLL-level phase accuracy with FLL-level dynamic robustness and is standard in high-performance GNSS receivers.</li>
</ul>
<div class="callout"><strong>Design intuition:</strong> Widen the FLL for acquisition and high dynamics; narrow it (and the assisting PLL) once locked to minimise jitter. The blended loop lets you keep FLL robustness in the outer (frequency-rate) integrators while the PLL cleans up phase in the inner loop.</div>`
      },
      {
        h: 'High-Doppler robustness and comparison with the PLL',
        html: String.raw`<p>Under high dynamics the deciding factor is how the loop's residual error grows with acceleration/jerk and how it degrades at low $C/N_0$. The FLL wins on robustness; the PLL wins on accuracy.</p>
<table class="data">
<tr><th>Property</th><th>PLL</th><th>FLL</th></tr>
<tr><td>Quantity locked</td><td>phase (and hence frequency)</td><td>frequency only</td></tr>
<tr><td>Residual error</td><td>phase $\to$ constant</td><td>frequency $\to$ 0, phase drifts</td></tr>
<tr><td>Pull-in / capture range</td><td>narrow ($\sim2\zeta\omega_n$)</td><td>wide ($\sim\pm1/2T$)</td></tr>
<tr><td>Dynamic (Doppler) tolerance</td><td>lower — loses lock under high jerk</td><td>higher — robust</td></tr>
<tr><td>Minimum usable $C/N_0$</td><td>higher</td><td>lower (works several dB lower)</td></tr>
<tr><td>Suitability for coherent demod</td><td>required</td><td>insufficient alone</td></tr>
</table>
<p>The takeaway: use the FLL to <em>acquire and survive dynamics</em>, then the PLL to <em>refine and demodulate</em>. Neither alone is optimal across the whole operating envelope, which is precisely why the FLL-assisted-PLL exists.</p>`
      },
      {
        h: 'Applications',
        html: String.raw`<p>FLLs dominate wherever acquisition speed, wide frequency uncertainty, or high dynamics matter: GNSS receivers (GPS/Galileo) for initial Doppler search and high-dynamics tracking (aircraft, launch vehicles, missiles), satellite communications with large and time-varying Doppler, frequency acquisition in burst modems and frequency-hopping systems (fast re-acquisition per hop), and Doppler radar processing. In many SDR carrier-recovery chains an AFC (automatic frequency control) block — essentially a coarse FLL — precedes the fine PLL/Costas loop to remove the bulk of the LO offset before phase tracking begins.</p>`
      }
    ],
    keyPoints: [
      String.raw`An FLL drives frequency error to zero and lets phase drift; a PLL drives phase error to a constant. Frequency, not phase, is the controlled quantity.`,
      String.raw`FLLs have a much wider pull-in range than PLLs of comparable bandwidth, making them the acquisition and high-dynamics workhorse.`,
      String.raw`The frequency discriminator error is proportional to $\omega_i-\omega_o$; a common digital form is $\hat{\Delta f}=\text{atan2}(\text{cross},\text{dot})/(2\pi T)$ using two consecutive correlator samples.`,
      String.raw`atan2 discriminator unambiguous pull-in range is $\pm1/(2T)$ — short integration widens range but adds jitter; long integration lowers jitter but narrows range.`,
      String.raw`Because the discriminator measures frequency, an FLL is effectively one integration lower than a same-order PLL in phase terms.`,
      String.raw`Steady-state: first-order FLL zeroes a frequency step; second-order FLL zeroes a Doppler rate (frequency ramp).`,
      String.raw`FLLs tolerate lower $C/N_0$ and higher dynamics than PLLs because estimating frequency (a phase difference) is more robust than resolving absolute phase.`,
      String.raw`An FLL alone cannot support coherent demodulation — it leaves a residual phase offset — so it precedes or assists a PLL.`,
      String.raw`FLL-assisted-PLL blends both discriminators into one loop filter: FLL robustness in the frequency/rate integrators, PLL accuracy in phase.`,
      String.raw`Handover strategy: wide FLL to acquire, then narrow the loop / switch to PLL to minimise jitter once locked.`,
      String.raw`Thermal frequency jitter falls with longer $T$ and higher $C/N_0$, the opposite pull to pull-in range.`,
      String.raw`Typical use: GNSS Doppler acquisition and high-dynamics tracking, SATCOM, burst/frequency-hopping re-acquisition, and AFC front-ends in SDR.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr-fll" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="30" y="52" width="90" height="40" fill="#1c232e" stroke="#4dabf7"/><text x="75" y="70" fill="#e6edf3" font-size="11" text-anchor="middle">Frequency</text><text x="75" y="84" fill="#e6edf3" font-size="11" text-anchor="middle">discriminator</text>
<rect x="170" y="52" width="90" height="40" fill="#1c232e" stroke="#63e6be"/><text x="215" y="76" fill="#e6edf3" font-size="12" text-anchor="middle">Loop filter</text>
<rect x="330" y="52" width="80" height="40" fill="#1c232e" stroke="#ffa94d"/><text x="370" y="76" fill="#e6edf3" font-size="12" text-anchor="middle">NCO/VCO</text>
<line x1="5" y1="72" x2="30" y2="72" stroke="#9aa7b5" marker-end="url(#arr-fll)"/><text x="10" y="64" fill="#9aa7b5" font-size="10">in</text>
<line x1="120" y1="72" x2="170" y2="72" stroke="#9aa7b5" marker-end="url(#arr-fll)"/><text x="145" y="64" fill="#9aa7b5" font-size="9">Kd·Δω</text>
<line x1="260" y1="72" x2="330" y2="72" stroke="#9aa7b5" marker-end="url(#arr-fll)"/>
<line x1="410" y1="72" x2="490" y2="72" stroke="#9aa7b5" marker-end="url(#arr-fll)"/><text x="450" y="64" fill="#9aa7b5" font-size="10">replica</text>
<line x1="450" y1="72" x2="450" y2="150" stroke="#9aa7b5"/><line x1="450" y1="150" x2="75" y2="150" stroke="#9aa7b5"/><line x1="75" y1="150" x2="75" y2="92" stroke="#9aa7b5" marker-end="url(#arr-fll)"/>
<text x="260" y="145" fill="#9aa7b5" font-size="10" text-anchor="middle">feedback (frequency)</text>
</svg>`,
        caption: 'FLL block diagram: the phase detector of a PLL is replaced by a frequency discriminator that outputs a voltage proportional to the frequency error; the loop filter and NCO/VCO close the loop on frequency.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Discriminator S-curves: FLL vs PLL usable range</text>
<line x1="60" y1="115" x2="510" y2="115" stroke="#9aa7b5"/><line x1="285" y1="30" x2="285" y2="195" stroke="#9aa7b5"/>
<text x="500" y="130" fill="#9aa7b5" font-size="11">Δf</text><text x="295" y="42" fill="#9aa7b5" font-size="11">error out</text>
<path d="M100,175 C170,150 240,120 285,115 C330,110 400,80 470,55" fill="none" stroke="#4dabf7" stroke-width="2"/>
<path d="M235,150 C260,140 275,120 285,115 C295,110 310,90 335,80" fill="none" stroke="#ff6b6b" stroke-width="2"/>
<text x="120" y="60" fill="#4dabf7" font-size="11">FLL discriminator</text><text x="120" y="76" fill="#4dabf7" font-size="10">(wide monotonic ±1/2T)</text>
<text x="330" y="165" fill="#ff6b6b" font-size="11">PLL detector</text><text x="330" y="180" fill="#ff6b6b" font-size="10">(narrow linear region)</text>
</svg>`,
        caption: 'The frequency discriminator stays usable (monotonic) over a much wider offset than a phase detector, giving the FLL its broad pull-in advantage. Longer integration T narrows the FLL curve to ±1/2T.'
      }
    ],
    equations: [
      {
        title: 'Frequency discriminator characteristic',
        tex: String.raw`$$v_d=K_d\,(\omega_i-\omega_o)=K_d\,\Delta\omega\quad(\text{small error})$$`,
        derivation: String.raw`<p>By definition the discriminator's output is proportional to the frequency difference between input and local replica. Near zero error the S-curve is linear with slope $K_d$ (V per rad/s). Away from zero the curve saturates/folds; the loop is usable only where the curve is monotonic, which sets the pull-in range.</p>`
      },
      {
        title: 'Two-sample atan2 frequency estimate',
        tex: String.raw`$$\hat{\Delta f}=\frac{\text{atan2}(\text{cross},\text{dot})}{2\pi T},\quad \text{cross}=I_1Q_2-I_2Q_1,\ \text{dot}=I_1I_2+Q_1Q_2$$`,
        derivation: String.raw`<p>Let two consecutive prompt correlator outputs be phasors $P_1=I_1+jQ_1$ and $P_2=I_2+jQ_2$ separated by $T$. Their product $P_2P_1^*=(\text{dot})+j(\text{cross})$ has argument equal to the phase advance $\Delta\phi=2\pi\,\Delta f\,T$ over the interval. Thus $\Delta\phi=\text{atan2}(\text{cross},\text{dot})$ and $\hat{\Delta f}=\Delta\phi/(2\pi T)$. Because both samples carry the same data symbol, the data phase cancels in the product, making the estimator data-independent.</p>`
      },
      {
        title: 'Unambiguous pull-in range',
        tex: String.raw`$$|\Delta f|<\frac{1}{2T}$$`,
        derivation: String.raw`<p>The atan2 output is unique only for $|\Delta\phi|<\pi$. Since $\Delta\phi=2\pi\,\Delta f\,T$, the condition $|\Delta\phi|<\pi$ gives $|\Delta f|<1/(2T)$. Beyond this the phase rotates more than half a cycle per interval and the estimate aliases (wraps), so the loop can pull in reliably only within $\pm1/(2T)$.</p>`
      },
      {
        title: 'FLL thermal frequency jitter',
        tex: String.raw`$$\sigma_f\approx\frac{1}{2\pi T}\sqrt{\frac{4FB_{fll}}{C/N_0}\left(1+\frac{1}{T\,(C/N_0)}\right)}\ \text{Hz}$$`,
        derivation: String.raw`<p>Starting from the variance of the phase-advance estimate at loop SNR $C/(N_0B_{fll})$, and dividing by $2\pi T$ (since frequency is phase advance per unit time), gives the frequency jitter. $F$ is a discriminator form factor (1 at high SNR, 2 near threshold). Key dependence: $\sigma_f\propto1/T$ and $\propto\sqrt{B_{fll}}$ — long integration and narrow bandwidth reduce jitter, opposing the wide-pull-in requirement.</p>`
      },
      {
        title: 'Steady-state frequency error to a Doppler ramp (first-order FLL)',
        tex: String.raw`$$\Delta\omega_{ss}=\frac{\dot\omega}{K_{fll}}$$`,
        derivation: String.raw`<p>A constant Doppler rate $\dot\omega$ (frequency ramp) applied to a first-order FLL of DC gain $K_{fll}$ produces, by the final value theorem on the frequency-error transfer function $\Delta\omega(s)/\dot\omega$-input, a finite residual $\Delta\omega_{ss}=\dot\omega/K_{fll}$. A second-order (integrating) FLL drives this to zero, leaving only a residual against Doppler acceleration.</p>`
      },
      {
        title: 'FLL-to-PLL handover condition',
        tex: String.raw`$$|\Delta f_{FLL}| < \alpha\,\frac{\Delta\omega_{L,PLL}}{2\pi},\quad \alpha\approx0.3\text{–}0.5$$`,
        derivation: String.raw`<p>Handover is safe once the FLL has reduced the residual frequency error to a fraction $\alpha$ of the assisting PLL's fast-capture range $\Delta\omega_{L,PLL}\approx2\zeta\omega_n$. Choosing $\alpha\approx0.3$ leaves margin for noise so the PLL locks within roughly one beat cycle without cycle slips at switchover.</p>`
      },
      {
        title: 'FLL noise bandwidth (one-sided)',
        tex: String.raw`$$B_{fll}=\int_0^{\infty}|H_{fll}(j2\pi f)|^2\,df$$`,
        derivation: String.raw`<p>As with the PLL, the FLL's closed-loop transfer $H_{fll}$ from input frequency to output frequency defines a one-sided noise bandwidth by integrating $|H_{fll}|^2$. It plays the same role: larger $B_{fll}$ tracks faster dynamics and acquires sooner but passes more noise; smaller $B_{fll}$ is quieter but slower.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What quantity does an FLL drive to zero, and what happens to phase?`, back: String.raw`It drives the frequency error to zero; the phase is left free to drift. Contrast with the PLL, which drives phase error to a constant.` },
      { front: String.raw`Why does an FLL have a wider pull-in range than a comparable PLL?`, back: String.raw`Its frequency discriminator remains a usable (monotonic) error signal over a much broader offset than a phase detector's narrow linear region, so it can acquire large offsets a narrow PLL cannot.` },
      { front: String.raw`Give the two-sample atan2 frequency discriminator.`, back: String.raw`$\hat{\Delta f}=\text{atan2}(\text{cross},\text{dot})/(2\pi T)$ with $\text{cross}=I_1Q_2-I_2Q_1$ and $\text{dot}=I_1I_2+Q_1Q_2$ from two consecutive correlator samples spaced $T$.` },
      { front: String.raw`Unambiguous pull-in range of the atan2 discriminator?`, back: String.raw`$|\Delta f|<1/(2T)$, because atan2 is unique only for $|\Delta\phi|<\pi$ and $\Delta\phi=2\pi\Delta fT$.` },
      { front: String.raw`Trade-off in choosing integration time $T$?`, back: String.raw`Short $T$: wide pull-in ($\pm1/2T$) but noisy. Long $T$: low jitter but narrow pull-in and poor dynamics tolerance.` },
      { front: String.raw`Why is the FLL discriminator data-independent?`, back: String.raw`The two consecutive samples carry the same data symbol, so the data phase cancels when forming the product $P_2P_1^*$; only the frequency-induced phase advance remains.` },
      { front: String.raw`How does FLL order relate to PLL order in phase terms?`, back: String.raw`The discriminator already measures frequency (a phase derivative), so an FLL is effectively one integration lower than a same-named PLL. A first-order FLL zeroes a frequency step.` },
      { front: String.raw`Steady-state error of a second-order FLL to a Doppler rate?`, back: String.raw`Zero — a second-order (integrating) FLL fully tracks a constant frequency ramp; only Doppler acceleration leaves a residual.` },
      { front: String.raw`What is an FLL-assisted-PLL?`, back: String.raw`A blended loop where both a frequency discriminator and a phase detector feed a shared loop filter: FLL error dominates the frequency/rate integrators for robustness, PLL error controls phase for accuracy.` },
      { front: String.raw`Why can't an FLL alone support coherent demodulation?`, back: String.raw`It leaves a residual, drifting phase offset. Coherent demodulation needs phase lock, so a PLL/Costas loop must follow the FLL.` },
      { front: String.raw`When is handover from FLL to PLL safe?`, back: String.raw`When the residual frequency error falls below roughly 30–50% of the PLL's fast-capture range $\approx2\zeta\omega_n$, leaving noise margin so the PLL locks without cycle slips.` },
      { front: String.raw`How does thermal frequency jitter depend on $T$ and $C/N_0$?`, back: String.raw`$\sigma_f\propto1/T$ and decreases with higher $C/N_0$; both push toward long integration, opposing the wide-pull-in requirement.` },
      { front: String.raw`Name three application domains where FLLs are essential.`, back: String.raw`GNSS Doppler acquisition/high-dynamics tracking, satellite communications with large time-varying Doppler, and fast re-acquisition in burst/frequency-hopping systems.` },
      { front: String.raw`Which loop tolerates lower $C/N_0$, and why?`, back: String.raw`The FLL. Estimating frequency (a difference of phases averaged over $T$) is more robust to noise than resolving absolute instantaneous phase, so it holds several dB lower.` }
    ],
    mcqs: [
      { q: String.raw`The primary quantity an FLL forces to zero is:`, options: [String.raw`Phase error`, String.raw`Frequency error`, String.raw`Amplitude error`, String.raw`Timing error`], answer: 1, explain: String.raw`An FLL locks frequency, driving $\omega_i-\omega_o\to0$ while leaving phase free to drift. That is the defining difference from a PLL.` },
      { q: String.raw`Compared with a narrow PLL of similar bandwidth, an FLL offers:`, options: [String.raw`Better phase accuracy`, String.raw`A wider pull-in range and better dynamic tolerance`, String.raw`Lower frequency jitter`, String.raw`Direct coherent demodulation`], answer: 1, explain: String.raw`The discriminator is monotonic over a broad offset, giving wide pull-in and robustness to high dynamics — at the cost of a residual phase offset.` },
      { q: String.raw`For the two-sample atan2 discriminator with integration time $T$, the unambiguous frequency range is:`, options: [String.raw`$\pm1/T$`, String.raw`$\pm1/(2T)$`, String.raw`$\pm1/(4T)$`, String.raw`$\pm2/T$`], answer: 1, explain: String.raw`atan2 is unique only for $|\Delta\phi|<\pi$; with $\Delta\phi=2\pi\Delta fT$ this gives $|\Delta f|<1/(2T)$.` },
      { q: String.raw`Increasing the integration time $T$ in an FLL:`, options: [String.raw`Widens pull-in and lowers jitter`, String.raw`Narrows pull-in but lowers jitter`, String.raw`Widens pull-in but raises jitter`, String.raw`Has no effect on either`], answer: 1, explain: String.raw`Longer $T$ averages more (lower jitter) but shrinks the unambiguous range to $\pm1/2T$ and reduces dynamics tolerance.` },
      { q: String.raw`Why is the FLL cross/dot discriminator insensitive to the data symbols?`, options: [String.raw`The symbols are removed by a matched filter first`, String.raw`Two consecutive samples share the same symbol, so data phase cancels in $P_2P_1^*$`, String.raw`It uses only the amplitude`, String.raw`Data is always zero during acquisition`], answer: 1, explain: String.raw`Because both correlator outputs carry the same data symbol, the product $P_2P_1^*$ cancels the data-dependent phase, leaving only the frequency-induced advance.` },
      { q: String.raw`A first-order FLL subjected to a constant Doppler rate (frequency ramp) exhibits:`, options: [String.raw`Zero steady-state frequency error`, String.raw`A finite steady-state frequency error`, String.raw`Immediate loss of lock`, String.raw`Oscillation at $\omega_n$`], answer: 1, explain: String.raw`Like a type-1 system to a ramp, a first-order FLL leaves a finite residual $\dot\omega/K_{fll}$; a second-order FLL drives it to zero.` },
      { q: String.raw`The FLL-assisted-PLL architecture:`, options: [String.raw`Replaces the PLL entirely`, String.raw`Feeds both a frequency discriminator and a phase detector into a shared loop filter`, String.raw`Uses two independent oscillators`, String.raw`Only runs during power-up`], answer: 1, explain: String.raw`Both errors drive one loop filter: the FLL provides dynamic robustness in the frequency/rate integrators while the PLL delivers phase accuracy.` },
      { q: String.raw`An FLL alone is insufficient for coherent BPSK demodulation because:`, options: [String.raw`It cannot track frequency`, String.raw`It leaves a residual, drifting phase offset`, String.raw`It is too noisy`, String.raw`It only works at high SNR`], answer: 1, explain: String.raw`Coherent detection needs the local carrier phase-aligned; the FLL matches only frequency, leaving an unresolved phase, so a PLL/Costas loop must finish the job.` },
      { q: String.raw`In high-dynamics (high-jerk) environments, the FLL is preferred over the PLL because:`, options: [String.raw`It has lower jitter`, String.raw`Its residual error stays bounded and it does not require resolving fast-changing absolute phase`, String.raw`It needs no oscillator`, String.raw`It has infinite bandwidth`], answer: 1, explain: String.raw`Tracking frequency is inherently more robust to rapid dynamics than tracking absolute phase, so the FLL holds where a PLL would slip.` },
      { q: String.raw`A safe FLL-to-PLL handover threshold is a residual frequency error below about:`, options: [String.raw`Twice the PLL capture range`, String.raw`30–50% of the PLL fast-capture range`, String.raw`The full hold-in range`, String.raw`Any value; handover is always safe`], answer: 1, explain: String.raw`Reducing residual error to ~30–50% of $2\zeta\omega_n$ leaves noise margin so the PLL locks within one beat cycle without slipping at switchover.` },
      { q: String.raw`With $T=2$ ms, the atan2 FLL can unambiguously track offsets up to:`, options: [String.raw`$\pm125$ Hz`, String.raw`$\pm250$ Hz`, String.raw`$\pm500$ Hz`, String.raw`$\pm1000$ Hz`], answer: 1, explain: String.raw`$1/(2T)=1/(2\times0.002)=250$ Hz, so the range is $\pm250$ Hz.` },
      { q: String.raw`Relative to the PLL, the FLL's minimum usable $C/N_0$ is generally:`, options: [String.raw`Higher (needs more SNR)`, String.raw`Lower (works at reduced SNR)`, String.raw`Identical`, String.raw`Undefined`], answer: 1, explain: String.raw`Because frequency estimation averages phase differences over $T$, the FLL holds several dB lower in $C/N_0$ than a PLL that must resolve absolute phase.` },
      { q: String.raw`The FLL loop filter's job differs from a PLL's mainly because its input is:`, options: [String.raw`A phase error`, String.raw`A frequency error`, String.raw`An amplitude error`, String.raw`A timing error`], answer: 1, explain: String.raw`The discriminator delivers a frequency error, so a given filter order corresponds to one less integration in phase terms than the same-named PLL.` },
      { q: String.raw`Which best captures the FLL/PLL division of labour in a GNSS receiver?`, options: [String.raw`PLL acquires, FLL demodulates`, String.raw`FLL acquires and survives dynamics, PLL refines and demodulates`, String.raw`Both do identical work redundantly`, String.raw`Neither is used; only correlators`], answer: 1, explain: String.raw`The wide, robust FLL pulls frequency into range under dynamics; the narrow, accurate PLL then refines phase for coherent processing.` }
    ],
    numericals: [
      { q: String.raw`An atan2 FLL uses $T=1$ ms integration. What is its unambiguous pull-in range in Hz?`, solution: String.raw`Range $=\pm1/(2T)=\pm1/(2\times10^{-3})=\pm500$ Hz. Any offset within $\pm500$ Hz is tracked without aliasing; beyond it the estimate wraps.` },
      { q: String.raw`Two consecutive prompt samples are $P_1=(1.0,\,0.0)$ and $P_2=(0.0,\,1.0)$ (as $(I,Q)$), $T=1$ ms. Estimate $\Delta f$.`, solution: String.raw`cross $=I_1Q_2-I_2Q_1=1\cdot1-0\cdot0=1$. dot $=I_1I_2+Q_1Q_2=1\cdot0+0\cdot1=0$. $\Delta\phi=\text{atan2}(1,0)=\pi/2$ rad. $\Delta f=\Delta\phi/(2\pi T)=(\pi/2)/(2\pi\times10^{-3})=0.25/10^{-3}=250$ Hz.` },
      { q: String.raw`A first-order FLL with DC gain $K_{fll}=100$ s$^{-1}$ sees a Doppler rate $\dot f=50$ Hz/s. Find the steady-state frequency error.`, solution: String.raw`$\dot\omega=2\pi\times50=314$ rad/s$^2$. $\Delta\omega_{ss}=\dot\omega/K_{fll}=314/100=3.14$ rad/s. In Hz: $\Delta f_{ss}=3.14/2\pi=0.5$ Hz. A second-order FLL would reduce this to zero.` },
      { q: String.raw`A PLL to be assisted has $\zeta=0.707$ and $\omega_n=2\pi\times50$ rad/s. If handover requires the residual below 40% of the PLL fast-capture range, find the threshold in Hz.`, solution: String.raw`Fast-capture $\Delta\omega_L\approx2\zeta\omega_n=2\times0.707\times2\pi\times50=444$ rad/s $\Rightarrow \Delta f_L=444/2\pi=70.7$ Hz. Threshold $=0.4\times70.7\approx28$ Hz. The FLL must bring residual below ~28 Hz before switching.` },
      { q: String.raw`For a receiver expecting up to $\pm900$ Hz Doppler uncertainty, what is the maximum integration time $T$ that keeps the atan2 FLL unambiguous?`, solution: String.raw`Need $1/(2T)\ge900 \Rightarrow T\le1/(2\times900)=5.56\times10^{-4}$ s $\approx0.56$ ms. Choose $T\le0.5$ ms to leave margin; the price is higher frequency jitter than a longer $T$ would give.` },
      { q: String.raw`An FLL and PLL of equal loop bandwidth face a jerk-induced stress. Qualitatively, which loses lock first and why?`, solution: String.raw`The PLL loses lock first. Under high dynamics the PLL's phase error grows toward a quarter-cycle and it cycle-slips, whereas the FLL only needs to keep frequency matched, so its bounded residual keeps it locked. This is exactly why acquisition/high-dynamics stages use an FLL (or FLL-assisted-PLL).` },
      { q: String.raw`Comparison frequency effect: if $T$ is halved from 2 ms to 1 ms, how do pull-in range and (roughly) frequency jitter change?`, solution: String.raw`Pull-in doubles: from $\pm250$ Hz to $\pm500$ Hz. Frequency jitter roughly doubles too, since $\sigma_f\propto1/T$ (with weaker additional dependence). So halving $T$ buys 2$\times$ pull-in at about 2$\times$ jitter — the fundamental FLL trade.` }
    ],
    realWorld: String.raw`<p>The FLL is indispensable in GNSS. When a GPS receiver first acquires a satellite it may face several kHz of Doppler (from satellite motion and the receiver's own reference offset); a wide FLL pulls the numerically-controlled oscillator to within a few tens of Hz, then hands over to a Costas-type PLL for coherent carrier-phase tracking and data demodulation. In high-dynamics platforms — launch vehicles, fighter aircraft, guided munitions — an FLL-assisted-PLL keeps lock through accelerations that would cycle-slip a bare PLL, because the FLL's frequency/rate integrators absorb the dynamics while the PLL cleans up phase. Frequency-hopping radios use fast FLL/AFC re-acquisition on each hop, and satellite modems facing large, time-varying Doppler (LEO passes) rely on FLL acquisition before PLL tracking. In SDR carrier-recovery chains it is standard practice to place a coarse AFC (a simple FLL) ahead of the fine PLL/Costas loop so the bulk of the LO offset is removed before phase tracking begins.</p>`,
    related: ['pll', 'costas-loop', 'phase-noise', 'sdr', 'bpsk']
  },
  {
    id: 'costas-loop',
    title: 'Costas Loop',
    category: 'Synchronization',
    tags: ['costas-loop', 'carrier-recovery', 'bpsk', 'qpsk', 'coherent-demodulation', 'phase-ambiguity', 'synchronization'],
    summary: String.raw`A PLL variant with quadrature (I/Q) arms that recovers a suppressed carrier directly from a modulated signal by forming a data-independent phase error, enabling coherent demodulation of BPSK/QPSK despite the absence of a discrete carrier tone.`,
    prerequisites: ['pll', 'bpsk', 'matched-filter'],
    intro: String.raw`<p>Coherent demodulation of PSK requires a local carrier that is phase-aligned with the received carrier. But suppressed-carrier modulations such as BPSK have <em>no</em> discrete carrier component to lock onto — the modulation spreads the carrier's power into the sidebands, and a plain PLL would try (and fail) to track the data-flipping phase. The <strong>Costas loop</strong>, invented by John Costas in 1956, solves this elegantly by using two quadrature correlator arms and multiplying their outputs to produce a phase-error signal from which the data modulation cancels.</p>
<p>The structure is a PLL whose phase detector is replaced by an <strong>in-phase (I) arm</strong> and a <strong>quadrature (Q) arm</strong>, each driven by the VCO in quadrature. For BPSK the product $I\times Q$ is proportional to $\sin(2\phi)$ (with $\phi$ the phase error) and — crucially — proportional to $d^2$, where $d=\pm1$ is the data symbol. Since $d^2=1$ regardless of the transmitted bit, the data disappears from the error signal, leaving a clean $\sin(2\phi)$ that the loop nulls. The by-product is coherent demodulation for free: once locked, the I arm carries the recovered data. The chief subtlety is a $180^{\circ}$ phase ambiguity, addressed by differential encoding.</p>`,
    sections: [
      {
        h: 'The suppressed-carrier problem',
        html: String.raw`<p>A BPSK signal is $s(t)=d(t)\,A\cos(\omega_c t+\theta)$ with $d(t)=\pm1$. Because $d(t)$ multiplies the carrier by $\pm1$, the carrier phase flips $180^{\circ}$ at every data transition. There is no steady spectral line at $\omega_c$ to lock a PLL to — the power sits entirely in the modulation sidebands. Feeding this to an ordinary PLL fails: the phase detector output flips sign with the data, and the loop cannot form a consistent error.</p>
<p>Two classic solutions exist. A <strong>squaring loop</strong> squares the signal, producing a term at $2\omega_c$ that is data-independent (since $(\pm1)^2=1$), which a PLL then tracks before dividing by two. The <strong>Costas loop</strong> achieves the same data cancellation but does so within a quadrature feedback structure that <em>also</em> delivers the demodulated data at its I arm — a more integrated and generally lower-noise solution.</p>
<div class="callout"><strong>Core trick:</strong> Any operation that squares the data ($d^2$) removes it because $d^2=1$ for antipodal symbols. The squaring loop squares the whole signal; the Costas loop squares implicitly by multiplying the I and Q arm outputs, each of which contains a factor of $d$.</div>`
      },
      {
        h: 'I/Q arm structure and operation',
        html: String.raw`<p>The VCO produces two references in quadrature: $2\cos(\omega_c t+\hat\theta)$ for the I arm and $-2\sin(\omega_c t+\hat\theta)$ for the Q arm, where $\hat\theta$ is the loop's phase estimate and $\phi=\theta-\hat\theta$ is the residual phase error. Each arm mixes the input down and low-pass filters (a matched/integrate-and-dump filter) to remove the $2\omega_c$ term:</p>
<ul>
<li><strong>I arm:</strong> $I=d(t)\,A\cos\phi$ — the in-phase baseband, which is the recovered data when $\phi\approx0$.</li>
<li><strong>Q arm:</strong> $Q=d(t)\,A\sin\phi$ — the quadrature baseband, proportional to the phase error and modulated by data.</li>
<li><strong>Error former:</strong> multiply the arms, $e=I\times Q=d^2A^2\cos\phi\sin\phi=\tfrac12A^2\sin(2\phi)$. Because $d^2=1$, the data vanishes.</li>
</ul>
<p>The error $e=\tfrac12A^2\sin(2\phi)$ is fed to the loop filter and VCO exactly as in a PLL. When the loop drives $e\to0$, it drives $\phi\to0$ (or $\pi$), so $\cos\phi\to\pm1$ and the I arm delivers clean $\pm d$. The Q arm goes to zero at lock — a useful lock indicator.</p>`
      },
      {
        h: 'Why d-squared removes the data',
        html: String.raw`<p>This is the crux of the Costas loop. Each arm output carries a single factor of the data symbol $d=\pm1$: $I\propto d\cos\phi$ and $Q\propto d\sin\phi$. Forming the error as the product multiplies these together:</p>
<p>$$e=I\cdot Q\propto (d\cos\phi)(d\sin\phi)=d^2\cos\phi\sin\phi=d^2\cdot\tfrac12\sin(2\phi).$$</p>
<p>For antipodal (BPSK) symbols $d\in\{+1,-1\}$, so $d^2=1$ <em>always</em>, whatever bit was sent. The data dependence cancels and the error becomes purely $\tfrac12\sin(2\phi)$, a smooth odd function of the phase error that the loop can null. This is mathematically identical to what the squaring loop achieves by squaring the whole signal, but the Costas loop performs the squaring on the recovered baseband arms and simultaneously produces the demodulated I data.</p>
<div class="callout"><strong>Consequence — the factor of 2:</strong> The error is $\sin(2\phi)$, not $\sin(\phi)$. The loop therefore has two stable lock points per $2\pi$ (at $\phi=0$ and $\phi=\pi$), which is the origin of the $180^{\circ}$ ambiguity, and the effective phase-detector gain is doubled near lock.</div>`
      },
      {
        h: 'The 180-degree phase ambiguity',
        html: String.raw`<p>Because the error depends on $\sin(2\phi)$, it is zero and stable at both $\phi=0$ and $\phi=\pi$. The loop cannot distinguish these two states: at $\phi=\pi$ the I arm delivers $-d$ (all bits inverted) yet the loop is perfectly "locked." A BPSK Costas loop thus has an inherent $180^{\circ}$ ambiguity; the receiver may recover the data with every bit flipped.</p>
<p>Standard remedies:</p>
<ul>
<li><strong>Differential encoding (DBPSK-style):</strong> encode information in phase <em>transitions</em> rather than absolute phase. A constant $180^{\circ}$ offset then affects both the reference and current symbols equally and cancels in the differential decoder, resolving the ambiguity without knowing the absolute phase.</li>
<li><strong>Known preamble / unique word:</strong> a known training sequence lets the receiver detect and correct a global inversion.</li>
<li><strong>Pilot or syndrome checks:</strong> some FEC frame structures reveal a global inversion by failing consistently in a way that a flip fixes.</li>
</ul>
<p>QPSK Costas loops have a four-fold ($90^{\circ}$) ambiguity for the same reason (fourth-power operation), similarly resolved by differential encoding.</p>`
      },
      {
        h: 'Loop dynamics, SNR, and squaring loss',
        html: String.raw`<p>Near lock the Costas loop behaves like a PLL with phase-detector characteristic $\sin(2\phi)$; linearising, $e\approx A^2\phi$, so the effective PD gain is $K_d\propto A^2$ and the standard second-order machinery applies ($\omega_n$, $\zeta$, $B_L$, settling time all as for a PLL). The key difference is a noise penalty:</p>
<ul>
<li><strong>Squaring loss:</strong> because the error is formed by multiplying two noisy arms, noise-times-noise (self-noise) terms appear alongside the signal-times-noise terms. This degrades the effective loop SNR relative to a residual-carrier PLL, especially at low $C/N_0$. The loss is small at high SNR and grows near threshold.</li>
<li><strong>Effective loop SNR:</strong> $\rho_{eff}=\rho/S_L$ where $\rho=C/(N_0B_L)$ and $S_L\ge1$ is the squaring loss; the resulting phase jitter is $\sigma_\phi^2\approx1/(2\rho_{eff})$.</li>
<li><strong>Arm filters matter:</strong> matched (integrate-and-dump) arm filters minimise squaring loss and also deliver the matched-filter data output on the I arm, which is why the arm low-pass is usually the symbol matched filter.</li>
</ul>
<div class="callout"><strong>Design note:</strong> All PLL loop-design rules carry over — choose $\zeta\approx0.707$, place $\omega_n$/$B_L$ to balance jitter against dynamics — but budget an extra squaring-loss margin in the phase-error variance, and note the $\sin(2\phi)$ characteristic halves the pull-in in phase and creates the $180^{\circ}$ lock points.</div>`
      },
      {
        h: 'QPSK and the fourth-power variant',
        html: String.raw`<p>QPSK carries two bits per symbol at phases $\{45^{\circ},135^{\circ},225^{\circ},315^{\circ}\}$, so the constellation has four-fold symmetry. A QPSK Costas loop uses four arms (or an equivalent I/Q structure) and forms an error that involves the <em>fourth</em> power of the data phase, removing the four-fold data modulation just as $d^2$ removed BPSK's two-fold modulation. A common QPSK phase detector is</p>
<p>$$e_{QPSK}=\text{sgn}(I)\cdot Q-\text{sgn}(Q)\cdot I,$$</p>
<p>which near lock is proportional to $\sin(4\phi)$ (approximately) after the fourth-power symmetry is accounted for. This produces four stable lock points spaced $90^{\circ}$, hence a four-fold ($90^{\circ}$) ambiguity resolved by differential quadrant encoding. The alternative <strong>fourth-power (times-four) loop</strong> raises the whole signal to the fourth power to create a data-free tone at $4\omega_c$, tracked by a PLL and divided by four — the QPSK analogue of the BPSK squaring loop.</p>
<table class="data">
<tr><th>Scheme</th><th>Data-removal operation</th><th>Error near lock</th><th>Ambiguity</th></tr>
<tr><td>BPSK Costas</td><td>$d^2$ (product of I,Q)</td><td>$\propto\sin(2\phi)$</td><td>$180^{\circ}$ (2-fold)</td></tr>
<tr><td>QPSK Costas</td><td>4th-power symmetry</td><td>$\propto\sin(4\phi)$</td><td>$90^{\circ}$ (4-fold)</td></tr>
</table>`
      },
      {
        h: 'Comparison and applications',
        html: String.raw`<p>The Costas loop vs. the squaring loop: both remove data by an even power, but the Costas loop operates at baseband on the arm signals and directly yields the demodulated data, avoiding the wideband squarer and the divide-by-two at RF. At equal loop bandwidth their tracking performance is essentially equivalent, and the Costas loop is generally preferred in practice for its integration and lower implementation SNR loss.</p>
<ul>
<li><strong>Carrier recovery for coherent PSK:</strong> the dominant use — BPSK/QPSK/OQPSK demodulators in satellite, deep-space, cellular, cable, and telemetry links.</li>
<li><strong>Combined carrier + data recovery:</strong> the I arm is the data; the Q arm is a lock indicator (near zero at lock).</li>
<li><strong>Software-defined radio:</strong> the Costas loop is a standard DSP block, trivially implemented with digital multipliers, an NCO, and an integrate-and-dump matched filter per arm.</li>
</ul>
<p>Always pair a BPSK Costas loop with differential encoding (or a known preamble) to defeat the $180^{\circ}$ ambiguity, and QPSK with differential quadrant encoding for the $90^{\circ}$ ambiguity.</p>`
      }
    ],
    keyPoints: [
      String.raw`A Costas loop is a PLL whose phase detector is a pair of quadrature (I/Q) arms, enabling carrier recovery from a suppressed-carrier signal that has no discrete carrier tone.`,
      String.raw`I arm $=dA\cos\phi$, Q arm $=dA\sin\phi$; the error $e=I\times Q=\tfrac12A^2 d^2\sin(2\phi)$.`,
      String.raw`Data cancels because $d^2=1$ for antipodal BPSK symbols — the essential trick, identical in effect to a squaring loop.`,
      String.raw`The error is $\sin(2\phi)$, giving two stable lock points ($\phi=0,\pi$) and hence an inherent $180^{\circ}$ phase ambiguity.`,
      String.raw`Resolve the $180^{\circ}$ ambiguity with differential encoding or a known preamble/unique word.`,
      String.raw`Once locked, the I arm is the coherently demodulated data and the Q arm (near zero) serves as a lock indicator.`,
      String.raw`Near lock the loop linearises to a standard second-order PLL: $\omega_n$, $\zeta\approx0.707$, $B_L$, and $t_s\approx4/(\zeta\omega_n)$ all apply.`,
      String.raw`Squaring loss degrades the effective loop SNR because noise-times-noise terms appear when multiplying the two arms; worst near threshold.`,
      String.raw`Effective loop SNR $\rho_{eff}=\rho/S_L$ with squaring loss $S_L\ge1$; phase jitter $\sigma_\phi^2\approx1/(2\rho_{eff})$.`,
      String.raw`Arm filters should be the symbol matched (integrate-and-dump) filters to minimise squaring loss and provide the matched-filter data output.`,
      String.raw`QPSK uses a fourth-power Costas variant with error $\propto\sin(4\phi)$, giving four lock points and a $90^{\circ}$ ambiguity resolved by differential quadrant encoding.`,
      String.raw`Costas vs. squaring loop: equivalent tracking at equal bandwidth, but the Costas loop works at baseband and yields the demodulated data directly.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="arr-costas" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<line x1="10" y1="130" x2="60" y2="130" stroke="#9aa7b5" marker-end="url(#arr-costas)"/><text x="12" y="122" fill="#9aa7b5" font-size="10">s(t)</text>
<circle cx="80" cy="70" r="14" fill="#1c232e" stroke="#4dabf7"/><text x="80" y="75" fill="#e6edf3" font-size="12" text-anchor="middle">×</text>
<circle cx="80" cy="190" r="14" fill="#1c232e" stroke="#4dabf7"/><text x="80" y="195" fill="#e6edf3" font-size="12" text-anchor="middle">×</text>
<line x1="60" y1="130" x2="80" y2="84" stroke="#9aa7b5"/><line x1="60" y1="130" x2="80" y2="176" stroke="#9aa7b5"/>
<rect x="120" y="55" width="60" height="30" fill="#1c232e" stroke="#63e6be"/><text x="150" y="74" fill="#e6edf3" font-size="10" text-anchor="middle">LPF</text>
<rect x="120" y="175" width="60" height="30" fill="#1c232e" stroke="#63e6be"/><text x="150" y="194" fill="#e6edf3" font-size="10" text-anchor="middle">LPF</text>
<line x1="94" y1="70" x2="120" y2="70" stroke="#9aa7b5" marker-end="url(#arr-costas)"/>
<line x1="94" y1="190" x2="120" y2="190" stroke="#9aa7b5" marker-end="url(#arr-costas)"/>
<line x1="180" y1="70" x2="240" y2="70" stroke="#9aa7b5" marker-end="url(#arr-costas)"/><text x="200" y="62" fill="#4dabf7" font-size="10">I=dAcosφ</text>
<line x1="180" y1="190" x2="240" y2="190" stroke="#9aa7b5" marker-end="url(#arr-costas)"/><text x="200" y="182" fill="#4dabf7" font-size="10">Q=dAsinφ</text>
<text x="250" y="55" fill="#63e6be" font-size="10">data out (I)</text>
<circle cx="270" cy="130" r="16" fill="#1c232e" stroke="#b197fc"/><text x="270" y="135" fill="#e6edf3" font-size="12" text-anchor="middle">×</text>
<line x1="240" y1="70" x2="270" y2="114" stroke="#9aa7b5"/><line x1="240" y1="190" x2="270" y2="146" stroke="#9aa7b5"/>
<text x="300" y="108" fill="#b197fc" font-size="9">e∝sin(2φ)</text>
<rect x="300" y="118" width="70" height="26" fill="#1c232e" stroke="#63e6be"/><text x="335" y="135" fill="#e6edf3" font-size="10" text-anchor="middle">Loop filt</text>
<line x1="286" y1="130" x2="300" y2="130" stroke="#9aa7b5" marker-end="url(#arr-costas)"/>
<rect x="400" y="116" width="60" height="30" fill="#1c232e" stroke="#ffa94d"/><text x="430" y="135" fill="#e6edf3" font-size="10" text-anchor="middle">VCO</text>
<line x1="370" y1="130" x2="400" y2="130" stroke="#9aa7b5" marker-end="url(#arr-costas)"/>
<line x1="430" y1="116" x2="430" y2="70" stroke="#9aa7b5"/><line x1="430" y1="70" x2="94" y2="70" stroke="#9aa7b5"/>
<text x="300" y="64" fill="#9aa7b5" font-size="9">cos ref</text>
<line x1="430" y1="146" x2="430" y2="230" stroke="#9aa7b5"/><line x1="430" y1="230" x2="94" y2="230" stroke="#9aa7b5"/><line x1="94" y1="230" x2="94" y2="196" stroke="#9aa7b5" marker-end="url(#arr-costas)"/>
<text x="250" y="245" fill="#9aa7b5" font-size="9">-sin ref (90° shifted)</text>
</svg>`,
        caption: 'BPSK Costas loop: the input is mixed with quadrature VCO references, each arm low-pass filtered. I=dAcosφ (the data), Q=dAsinφ. Their product gives e∝d²sin(2φ)=sin(2φ), driving the loop filter and VCO.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Error characteristic e ∝ sin(2φ): two stable lock points</text>
<line x1="40" y1="110" x2="500" y2="110" stroke="#9aa7b5"/><line x1="270" y1="35" x2="270" y2="185" stroke="#9aa7b5"/>
<text x="490" y="125" fill="#9aa7b5" font-size="11">φ</text>
<path d="M60,110 C110,50 160,50 210,110 C260,170 320,170 370,110 C420,50 460,50 480,80" fill="none" stroke="#4dabf7" stroke-width="2"/>
<circle cx="270" cy="110" r="4" fill="#63e6be"/><text x="255" y="130" fill="#63e6be" font-size="10">φ=0</text>
<circle cx="130" cy="110" r="4" fill="#ff6b6b"/>
<circle cx="410" cy="110" r="4" fill="#63e6be"/><text x="395" y="130" fill="#63e6be" font-size="10">φ=π</text>
<text x="70" y="55" fill="#9aa7b5" font-size="10">-π</text><text x="470" y="70" fill="#9aa7b5" font-size="10">π</text>
<text x="120" y="150" fill="#ff6b6b" font-size="9">unstable</text>
</svg>`,
        caption: 'The sin(2φ) S-curve has stable zeros at φ=0 and φ=π (green) with unstable points between. The loop locks equally to either, producing the 180° ambiguity that differential encoding resolves.'
      }
    ],
    equations: [
      {
        title: 'I and Q arm baseband outputs',
        tex: String.raw`$$I=d(t)\,A\cos\phi,\qquad Q=d(t)\,A\sin\phi,\qquad \phi=\theta-\hat\theta$$`,
        derivation: String.raw`<p>Input $s(t)=dA\cos(\omega_c t+\theta)$. I arm multiplies by $2\cos(\omega_c t+\hat\theta)$: product $=dA[\cos(\phi)+\cos(2\omega_c t+\theta+\hat\theta)]$; the LPF removes the $2\omega_c$ term leaving $I=dA\cos\phi$. Q arm multiplies by $-2\sin(\omega_c t+\hat\theta)$: after the same LPF, $Q=dA\sin\phi$. Thus each arm carries one factor of the data and a quadrature phase-error factor.</p>`
      },
      {
        title: 'Costas error signal (data-independent)',
        tex: String.raw`$$e=I\cdot Q=d^2A^2\cos\phi\sin\phi=\tfrac12A^2\sin(2\phi)$$`,
        derivation: String.raw`<p>Multiply the arms: $e=(dA\cos\phi)(dA\sin\phi)=d^2A^2\cos\phi\sin\phi$. Use $\cos\phi\sin\phi=\tfrac12\sin(2\phi)$ and $d^2=1$ for $d=\pm1$: $e=\tfrac12A^2\sin(2\phi)$. The data has cancelled, leaving a smooth odd function of $\phi$ suitable as a loop error.</p>`
      },
      {
        title: 'Linearised phase-detector gain',
        tex: String.raw`$$e\approx A^2\,\phi\ \ (\phi\ \text{small})\ \Rightarrow\ K_d\propto A^2$$`,
        derivation: String.raw`<p>For small $\phi$, $\sin(2\phi)\approx2\phi$, so $e\approx\tfrac12A^2\cdot2\phi=A^2\phi$. The effective phase-detector gain is $K_d=A^2$ (proportional to signal power), and the loop reduces to a standard second-order PLL with all the usual $\omega_n$, $\zeta$, $B_L$ relations. Note the factor-of-2 from $\sin(2\phi)$ doubles the slope relative to a plain $\sin\phi$ detector.</p>`
      },
      {
        title: 'Lock points and 180-degree ambiguity',
        tex: String.raw`$$e=0\ \text{and stable at}\ \phi=0\ \text{and}\ \phi=\pi$$`,
        derivation: String.raw`<p>$\sin(2\phi)=0$ at $\phi=0,\pi/2,\pi,\dots$. Stability requires negative slope of $e$ vs $\phi$ (restoring): the slope of $\tfrac12\sin(2\phi)$ is positive at $\phi=0$ and $\phi=\pi$ (stable in a negative-feedback loop) and negative at $\phi=\pi/2$ (unstable). Hence two stable states $2\pi$-apart-in-$2\phi$: $\phi=0$ (I$=+d$) and $\phi=\pi$ (I$=-d$), giving the $180^{\circ}$ data-inversion ambiguity.</p>`
      },
      {
        title: 'Effective loop SNR with squaring loss',
        tex: String.raw`$$\rho_{eff}=\frac{\rho}{S_L},\quad \rho=\frac{C}{N_0B_L},\quad S_L=1+\frac{1}{2\rho_i}\ (\text{approx})$$`,
        derivation: String.raw`<p>Forming $e=I\cdot Q$ multiplies two noisy arm signals, generating signal$\times$noise and noise$\times$noise cross terms. The latter (self-noise) inflate the effective noise, degrading the loop SNR by a factor $S_L\ge1$ called squaring loss. $S_L$ depends on the arm (input) SNR $\rho_i$; at high SNR $S_L\to1$, but near threshold $S_L$ grows, so $\rho_{eff}=\rho/S_L$ falls faster than $\rho$.</p>`
      },
      {
        title: 'Phase-error variance at lock',
        tex: String.raw`$$\sigma_\phi^2\approx\frac{1}{2\rho_{eff}}=\frac{S_L\,B_L}{2\,(C/N_0)}$$`,
        derivation: String.raw`<p>As in any PLL, the tracking phase-error variance is inversely proportional to the effective loop SNR: $\sigma_\phi^2=1/(2\rho_{eff})$. Substituting $\rho_{eff}=\rho/S_L=C/(N_0B_LS_L)$ gives $\sigma_\phi^2=S_LB_L/[2(C/N_0)]$. The squaring loss $S_L$ is the Costas penalty relative to a residual-carrier PLL.</p>`
      },
      {
        title: 'QPSK Costas error (fourth-power)',
        tex: String.raw`$$e_{QPSK}=\text{sgn}(I)\,Q-\text{sgn}(Q)\,I\ \propto\ \sin(4\phi)\ (\text{small }\phi)$$`,
        derivation: String.raw`<p>QPSK data has four-fold symmetry, so the modulation is removed by a fourth-power-equivalent operation. The decision-directed detector $\text{sgn}(I)Q-\text{sgn}(Q)I$ removes the two-bit data and yields an error that, near lock, is proportional to $\sin(4\phi)$. Its four stable zeros ($\phi=0,\pi/2,\pi,3\pi/2$) create the four-fold ($90^{\circ}$) ambiguity, resolved by differential quadrant encoding.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Why can't a plain PLL lock a BPSK signal?`, back: String.raw`BPSK is suppressed-carrier: the $\pm1$ data flips the carrier phase $180^{\circ}$ at transitions, so there is no discrete carrier tone and the PLL's phase-detector output changes sign with the data.` },
      { front: String.raw`What are the I and Q arm outputs of a BPSK Costas loop?`, back: String.raw`$I=dA\cos\phi$ (the recovered data) and $Q=dA\sin\phi$ (proportional to phase error), where $\phi$ is the residual carrier phase error and $d=\pm1$.` },
      { front: String.raw`Write the Costas error signal and explain why data cancels.`, back: String.raw`$e=I\cdot Q=d^2A^2\cos\phi\sin\phi=\tfrac12A^2\sin(2\phi)$. Since $d^2=1$ for antipodal symbols, the data disappears, leaving pure $\sin(2\phi)$.` },
      { front: String.raw`Why does the Costas loop have a 180° ambiguity?`, back: String.raw`Its error $\propto\sin(2\phi)$ is zero and stable at both $\phi=0$ and $\phi=\pi$. At $\phi=\pi$ the I arm gives $-d$ (all bits inverted), yet the loop is 'locked'.` },
      { front: String.raw`How is the 180° ambiguity resolved?`, back: String.raw`Differential encoding (information in phase transitions) or a known preamble/unique word; a constant inversion cancels in the differential decoder.` },
      { front: String.raw`What is the effective phase-detector gain of a Costas loop near lock?`, back: String.raw`$e\approx A^2\phi$, so $K_d\propto A^2$ (signal power). Near lock it linearises to a standard second-order PLL.` },
      { front: String.raw`What is squaring loss?`, back: String.raw`Extra loop-SNR degradation because multiplying the two noisy arms creates noise$\times$noise (self-noise) terms; $\rho_{eff}=\rho/S_L$ with $S_L\ge1$, worst near threshold.` },
      { front: String.raw`Where does the demodulated data come out, and what indicates lock?`, back: String.raw`The I arm carries the coherently demodulated data; the Q arm goes to zero at lock, so it serves as a lock indicator.` },
      { front: String.raw`Why should the arm low-pass filters be matched (integrate-and-dump) filters?`, back: String.raw`They minimise squaring loss and simultaneously produce the matched-filter data output on the I arm, maximising SNR.` },
      { front: String.raw`How does the Costas loop compare to a squaring loop?`, back: String.raw`Both remove data by an even power; the squaring loop squares the whole RF signal (tracking at $2\omega_c$, then divide by 2), while the Costas loop squares at baseband via the I×Q product and directly yields demodulated data.` },
      { front: String.raw`How is QPSK carrier recovery different in a Costas loop?`, back: String.raw`It uses a fourth-power-equivalent error (e.g. $\text{sgn}(I)Q-\text{sgn}(Q)I\propto\sin(4\phi)$), giving four lock points and a $90^{\circ}$ ambiguity resolved by differential quadrant encoding.` },
      { front: String.raw`What is the phase-error variance at lock for a Costas loop?`, back: String.raw`$\sigma_\phi^2\approx1/(2\rho_{eff})=S_LB_L/[2(C/N_0)]$; the squaring loss $S_L$ is the penalty versus a residual-carrier PLL.` },
      { front: String.raw`Why is the error $\sin(2\phi)$ rather than $\sin\phi$?`, back: String.raw`The product of $\cos\phi$ (I) and $\sin\phi$ (Q) gives $\tfrac12\sin(2\phi)$; the doubling comes from the trig identity and is what creates two lock points per $2\pi$.` },
      { front: String.raw`Who invented the Costas loop and when?`, back: String.raw`John P. Costas, in 1956, as a means of coherent carrier recovery for suppressed-carrier signals.` }
    ],
    mcqs: [
      { q: String.raw`Why is a plain PLL unable to lock onto a BPSK signal?`, options: [String.raw`The signal has too much power`, String.raw`BPSK is suppressed-carrier: the data flips the phase 180° so there is no discrete carrier tone`, String.raw`The PLL bandwidth is always too small`, String.raw`BPSK has no phase information`], answer: 1, explain: String.raw`The $\pm1$ modulation spreads the carrier into sidebands and flips the phase at transitions, so the PD output changes sign with the data and no consistent error forms.` },
      { q: String.raw`In a BPSK Costas loop, the I and Q arm outputs are (with phase error $\phi$, data $d$):`, options: [String.raw`$I=dA\sin\phi$, $Q=dA\cos\phi$`, String.raw`$I=dA\cos\phi$, $Q=dA\sin\phi$`, String.raw`$I=A\cos\phi$, $Q=A\sin\phi$`, String.raw`$I=d\cos\phi$, $Q=\cos\phi$`], answer: 1, explain: String.raw`Mixing with the in-phase VCO reference and low-pass filtering gives $I=dA\cos\phi$; the quadrature reference gives $Q=dA\sin\phi$.` },
      { q: String.raw`The Costas error signal $e=I\times Q$ equals:`, options: [String.raw`$dA^2\sin\phi$`, String.raw`$\tfrac12A^2\sin(2\phi)$`, String.raw`$A^2\cos(2\phi)$`, String.raw`$d^2A\sin\phi$`], answer: 1, explain: String.raw`$e=(dA\cos\phi)(dA\sin\phi)=d^2A^2\cos\phi\sin\phi=\tfrac12A^2\sin(2\phi)$ since $d^2=1$.` },
      { q: String.raw`The data modulation cancels in the Costas error because:`, options: [String.raw`The loop filter removes it`, String.raw`$d^2=1$ for antipodal symbols`, String.raw`The VCO subtracts it`, String.raw`Noise averages it out`], answer: 1, explain: String.raw`Each arm carries one factor of $d$; their product yields $d^2$, which equals 1 for $d=\pm1$ regardless of the bit sent.` },
      { q: String.raw`The Costas loop's inherent phase ambiguity for BPSK is:`, options: [String.raw`$45^{\circ}$`, String.raw`$90^{\circ}$`, String.raw`$180^{\circ}$`, String.raw`$360^{\circ}$`], answer: 2, explain: String.raw`Because the error is $\sin(2\phi)$, it is stable at both $\phi=0$ and $\phi=\pi$; locking at $\phi=\pi$ inverts every bit — a $180^{\circ}$ ambiguity.` },
      { q: String.raw`The standard remedy for the 180° ambiguity is:`, options: [String.raw`Increasing loop bandwidth`, String.raw`Differential encoding (or a known preamble)`, String.raw`Using a larger VCO gain`, String.raw`Lowering the symbol rate`], answer: 1, explain: String.raw`Differential encoding places information in phase transitions, so a constant global inversion cancels in the differential decoder.` },
      { q: String.raw`In a locked BPSK Costas loop, the demodulated data appears on the:`, options: [String.raw`Q arm`, String.raw`I arm`, String.raw`VCO control line`, String.raw`Loop filter output`], answer: 1, explain: String.raw`At lock $\phi\approx0$ so $I=dA\cos\phi\approx\pm dA$ (the data) while $Q\approx0$ (a lock indicator).` },
      { q: String.raw`Squaring loss in a Costas loop arises because:`, options: [String.raw`The VCO is nonlinear`, String.raw`Multiplying the two noisy arms creates noise×noise self-noise terms`, String.raw`The loop filter attenuates the signal`, String.raw`The carrier is too weak`], answer: 1, explain: String.raw`Forming $I\times Q$ multiplies noise on both arms, producing self-noise that degrades the effective loop SNR by a factor $S_L\ge1$, worst near threshold.` },
      { q: String.raw`Near lock, the Costas loop's effective phase-detector gain is proportional to:`, options: [String.raw`$A$`, String.raw`$A^2$ (signal power)`, String.raw`$1/A$`, String.raw`$d$`], answer: 1, explain: String.raw`$e\approx A^2\phi$ for small $\phi$, so $K_d\propto A^2$; the loop then behaves as a standard second-order PLL.` },
      { q: String.raw`A QPSK Costas loop removes data using an operation equivalent to:`, options: [String.raw`Squaring ($d^2$)`, String.raw`A fourth power (four-fold symmetry)`, String.raw`Differentiation`, String.raw`Envelope detection`], answer: 1, explain: String.raw`QPSK has four-fold symmetry, so a fourth-power-equivalent error (e.g. $\text{sgn}(I)Q-\text{sgn}(Q)I\propto\sin(4\phi)$) cancels the two-bit modulation.` },
      { q: String.raw`The QPSK Costas loop's phase ambiguity is:`, options: [String.raw`$180^{\circ}$`, String.raw`$90^{\circ}$ (four-fold)`, String.raw`$45^{\circ}$`, String.raw`none`], answer: 1, explain: String.raw`Four stable lock points spaced $90^{\circ}$ produce a four-fold ambiguity, resolved by differential quadrant encoding.` },
      { q: String.raw`Compared with a squaring loop, the Costas loop's practical advantage is that it:`, options: [String.raw`Needs no VCO`, String.raw`Operates at baseband and directly yields the demodulated data`, String.raw`Has zero phase jitter`, String.raw`Cannot lose lock`], answer: 1, explain: String.raw`The Costas loop squares implicitly on the baseband arms, so it avoids a wideband RF squarer and divide-by-two and provides the data on the I arm.` },
      { q: String.raw`The Q arm of a locked BPSK Costas loop is useful as a:`, options: [String.raw`Second data output`, String.raw`Lock indicator (near zero at lock)`, String.raw`Clock recovery signal`, String.raw`Noise reference only`], answer: 1, explain: String.raw`At lock $Q=dA\sin\phi\approx0$; monitoring Q toward zero indicates the loop has acquired phase lock.` },
      { q: String.raw`Choosing the arm low-pass filters to be the symbol matched filters:`, options: [String.raw`Increases squaring loss`, String.raw`Minimises squaring loss and provides the matched-filter data output`, String.raw`Removes the 180° ambiguity`, String.raw`Eliminates the need for the loop filter`], answer: 1, explain: String.raw`Matched (integrate-and-dump) arm filters maximise per-symbol SNR, minimising squaring loss while delivering the optimal data decision statistic on the I arm.` }
    ],
    numericals: [
      { q: String.raw`A BPSK Costas loop has residual phase error $\phi=10^{\circ}$. By what factor is the I-arm (data) amplitude reduced versus perfect lock, and what is the Q-arm relative amplitude?`, solution: String.raw`I $\propto\cos\phi=\cos10^{\circ}=0.985$, a loss of only 1.5% (about 0.13 dB in amplitude). Q $\propto\sin\phi=\sin10^{\circ}=0.174$. So a small phase error barely hurts the data but leaves a clear Q signal that the loop uses to null $\phi$.` },
      { q: String.raw`For $\phi=30^{\circ}$, compute the normalized Costas error $e/(\tfrac12A^2)=\sin(2\phi)$ and the I-arm amplitude loss in dB.`, solution: String.raw`$\sin(2\times30^{\circ})=\sin60^{\circ}=0.866$. I amplitude $\propto\cos30^{\circ}=0.866\Rightarrow$ power loss $=20\log_{10}(0.866)=-1.25$ dB. The error is near its maximum at $\phi=45^{\circ}$ where $\sin(2\phi)=1$.` },
      { q: String.raw`A Costas loop has $B_L=100$ Hz, $C/N_0=45$ dB-Hz, and squaring loss $S_L=1.5$ (1.76 dB). Find the RMS phase jitter.`, solution: String.raw`$C/N_0=10^{4.5}=3.16\times10^4$ Hz. $\sigma_\phi^2=S_LB_L/[2(C/N_0)]=1.5\times100/(2\times3.16\times10^4)=150/6.32\times10^4=2.37\times10^{-3}$ rad$^2$. $\sigma_\phi=0.0487$ rad $\approx2.8^{\circ}$, well below the $\sim45^{\circ}$ lock limit.` },
      { q: String.raw`The Costas loop linearises to $e\approx A^2\phi$. With $A=1$ V and a loop filter/VCO giving $\omega_n=2\pi\times40$ rad/s at $\zeta=0.707$, estimate the settling time.`, solution: String.raw`$\omega_n=2\pi\times40=251$ rad/s. $t_s\approx4/(\zeta\omega_n)=4/(0.707\times251)=4/177.5=0.0225$ s $\approx22.5$ ms to the 2% band. Standard PLL relations apply because the loop is linear near lock.` },
      { q: String.raw`Explain quantitatively why differential encoding fully removes the 180° ambiguity for BPSK.`, solution: String.raw`Suppose the loop locks at $\phi=\pi$, inverting every recovered bit: $\hat b_k'=\overline{\hat b_k}$. A differential decoder outputs the XOR of consecutive symbols: $\hat b_k'\oplus\hat b_{k-1}'=\overline{\hat b_k}\oplus\overline{\hat b_{k-1}}=\hat b_k\oplus\hat b_{k-1}$ (inverting both inputs of an XOR leaves it unchanged). Thus the decoded transition is identical whether or not a global inversion occurred, eliminating the ambiguity.` },
      { q: String.raw`A QPSK Costas loop has a $90^{\circ}$ ambiguity. How many bits of information are unresolved, and how is it fixed?`, solution: String.raw`Four possible lock states (0°, 90°, 180°, 270°) correspond to $\log_2 4=2$ unresolved bits (the mapping of the two data bits per symbol is rotated). Differential quadrant encoding — encoding data in the change of quadrant rather than absolute quadrant — makes a constant rotation cancel between successive symbols, resolving all four states.` },
      { q: String.raw`Compare the phase-detector slope of a Costas loop ($\sin 2\phi$) with a residual-carrier PLL ($\sin\phi$) near $\phi=0$.`, solution: String.raw`$d/d\phi[\sin 2\phi]|_0=2$ versus $d/d\phi[\sin\phi]|_0=1$. The Costas characteristic has twice the slope near lock, doubling the effective phase-detector gain (before accounting for squaring loss and the $\tfrac12A^2$ scaling). This is why the factor of 2 appears in the pull-in and lock-point spacing analysis.` }
    ],
    realWorld: String.raw`<p>The Costas loop is the standard carrier-recovery block for coherent PSK. In satellite and deep-space telemetry (BPSK/QPSK), Costas loops recover the suppressed carrier and deliver demodulated symbols on the I arm; the Q arm doubles as a lock detector for automatic re-acquisition. Cellular and cable modems, QPSK/OQPSK downlinks, and DVB-style links all rely on Costas or fourth-power carrier recovery, invariably paired with differential encoding to defeat the phase ambiguity. In modern software-defined radios the Costas loop is a handful of DSP operations — two mixers against an NCO, integrate-and-dump matched filters, a multiplier, a loop filter — making it trivial to implement and tune in firmware; GNU Radio, for example, ships a configurable Costas-loop block. In GNSS, once an FLL has coarsely aligned frequency, a Costas-type carrier-tracking loop (chosen precisely because the navigation data modulates the carrier and must be stripped by the $d^2$ operation) takes over for precise carrier-phase tracking and data demodulation. The persistent practical caution is the $180^{\circ}$ (BPSK) or $90^{\circ}$ (QPSK) ambiguity: every deployed system must include differential encoding, a known unique word, or an FEC frame structure that detects and corrects a global inversion.</p>`,
    related: ['pll', 'fll', 'bpsk', 'dbpsk', 'matched-filter', 'sdr']
  }
);
