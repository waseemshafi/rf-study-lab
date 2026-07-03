/* From-scratch derivations for the "RF Link & Metrics" category.
   Loaded after content.js; merges into the global CONTENT_DERIV registry.
   Keyed by topic id, then by equation index (matching the spec order).
   Every value is HTML with MathJax ($...$ inline, $$...$$ display). */
Object.assign(CONTENT_DERIV, {

  /* ================= RECEIVER SENSITIVITY ================= */
  'sensitivity': {

    0: String.raw`
<p><b>Where we start.</b> A receiver can only decode a signal if that signal is loud enough to stand out against the noise the receiver itself carries. So "sensitivity" is the <i>smallest antenna-port power</i> for which the signal-to-noise ratio (SNR) at the detector just reaches the value the demodulator needs. We build it from three physical pieces: (1) how much noise nature puts in, (2) how much extra noise the hardware adds, and (3) how much SNR the modulation demands.</p>

<p><b>Step 1 — Nature's noise floor.</b> Any resistor at absolute temperature $T$ delivers, into a matched load, an available noise power density</p>
$$ \frac{N}{B}=kT \quad\Longrightarrow\quad N = kTB, $$
<p>where $k=1.38\times10^{-23}\ \mathrm{J/K}$ is Boltzmann's constant and $B$ is the noise bandwidth in Hz. This is the irreducible thermal-noise power that reaches an ideal receiver's input.</p>

<p><b>Step 2 — Put the floor in dBm.</b> Reference to $1\ \mathrm{mW}$ and take $10\log_{10}$. At the standard reference temperature $T_0=290\ \mathrm{K}$ the <i>density</i> $kT_0$ works out to</p>
$$ 10\log_{10}\!\frac{kT_0}{1\,\mathrm{mW}} = -174\ \mathrm{dBm/Hz}. $$
<p>Spreading that density over the bandwidth $B$ adds $10\log_{10}B$, so the ideal noise floor is $-174+10\log_{10}B$ dBm.</p>

<p><b>Step 3 — Real hardware is noisier: the noise figure.</b> No amplifier is ideal; it adds its own noise. The <i>noise figure</i> $NF$ (in dB) is defined as the factor by which the input SNR degrades. Equivalently it raises the effective noise floor by $NF$ dB:</p>
$$ N_{\text{floor}} = -174 + 10\log_{10}B + NF \quad[\mathrm{dBm}]. $$

<p><b>Step 4 — Demand enough SNR.</b> The demodulator needs the received signal to sit at least $(S/N)_{req}$ dB above this floor to hit its target error rate. The smallest signal that satisfies this is exactly the floor pushed up by $(S/N)_{req}$:</p>
$$ S_{min} = N_{\text{floor}} + (S/N)_{req}. $$

<p><b>Result.</b></p>
$$ \boxed{\,S_{min}[\mathrm{dBm}]=-174+10\log_{10}B+NF+\left(\tfrac{S}{N}\right)_{req}\,} $$
<p><b>Intuition / sanity check.</b> Every term is a penalty that raises the minimum power: wider bandwidth ($+10\log_{10}B$) lets in more noise, worse hardware ($+NF$) adds more, and a fussier modulation ($+SNR_{req}$) needs more headroom. A 1 MHz receiver with $NF=6$ dB needing $10$ dB SNR gives $-174+60+6+10=-98$ dBm — a believable radio sensitivity.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> We want the numerical value of the famous constant $-174\ \mathrm{dBm/Hz}$, and to see that it is nothing more than $kT_0$ written in decibels. This is the anchor of every sensitivity and noise-floor calculation.</p>

<p><b>Step 1 — Thermal noise as a power.</b> Nyquist's theorem says the available noise power a resistor at temperature $T$ delivers into a matched load in bandwidth $B$ is</p>
$$ N = kT B. $$
<p>Here $k=1.380649\times10^{-23}\ \mathrm{J/K}$ and $T_0=290\ \mathrm{K}$ (the IEEE reference temperature, roughly 17 °C).</p>

<p><b>Step 2 — Form the density and multiply out.</b> Divide by $B$ to get power per hertz, then insert numbers:</p>
$$ kT_0 = (1.380649\times10^{-23})(290) = 4.004\times10^{-21}\ \mathrm{W/Hz}. $$

<p><b>Step 3 — Convert watts to milliwatts.</b> Since $1\ \mathrm{mW}=10^{-3}\ \mathrm{W}$,</p>
$$ \frac{kT_0}{1\,\mathrm{mW}} = \frac{4.004\times10^{-21}}{10^{-3}} = 4.004\times10^{-18}\ \ (\text{dimensionless ratio per Hz}). $$

<p><b>Step 4 — Take decibels.</b></p>
$$ 10\log_{10}\!\left(4.004\times10^{-18}\right) = 10\,(\log_{10}4.004 - 18) = 10(0.6025-18) = -173.97 \approx -174. $$

<p><b>Result.</b></p>
$$ \boxed{\,N=kT_0B,\qquad 10\log_{10}\!\frac{kT_0}{1\,\mathrm{mW}}=-174\ \mathrm{dBm/Hz}\,} $$
<p><b>Intuition / sanity check.</b> The whole noise floor of every receiver on Earth starts from one number set by Boltzmann's constant and room temperature. Cooling the front end (lower $T$) is the only way to beat it — which is exactly why radio-astronomy receivers are cryogenically chilled.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> Often the datasheet quality target is not an SNR but a bit-energy-to-noise-density ratio $E_b/N_0$, because that is the fundamental measure that fixes bit-error rate. We rebuild sensitivity around $E_b/N_0$ and the bit rate $R_b$ instead of $B$ and SNR.</p>

<p><b>Step 1 — Noise density, not noise power.</b> The receiver noise <i>power spectral density</i> referenced to a real front end is</p>
$$ N_0 = kT_0\cdot F \;\Longrightarrow\; N_0[\mathrm{dBm/Hz}] = -174 + NF. $$
<p>This is the per-hertz floor before we choose any bandwidth.</p>

<p><b>Step 2 — Energy per bit.</b> A received signal of power $S$ delivering $R_b$ bits per second carries energy per bit $E_b = S/R_b$. In dB:</p>
$$ S[\mathrm{dBm}] = E_b[\mathrm{dBm\cdot s}] + 10\log_{10}R_b. $$

<p><b>Step 3 — The quality condition.</b> The demodulator hits its target error rate when $E_b/N_0 \ge (E_b/N_0)_{req}$. At the sensitivity limit it is equality, so $E_b = N_0 + (E_b/N_0)_{req}$ in dB.</p>

<p><b>Step 4 — Assemble.</b> Substitute $N_0$ and $E_b$:</p>
$$ S_{min} = \underbrace{(-174+NF)}_{N_0} + \left(\tfrac{E_b}{N_0}\right)_{req} + 10\log_{10}R_b. $$

<p><b>Result.</b></p>
$$ \boxed{\,S_{min}[\mathrm{dBm}]=-174+NF+10\log_{10}R_b+\left(\tfrac{E_b}{N_0}\right)_{req}\,} $$
<p><b>Intuition / sanity check.</b> Notice bandwidth $B$ has vanished — it is replaced by the <i>bit rate</i> $R_b$. This form is bandwidth-agnostic: two systems with the same bit rate and same $E_b/N_0$ requirement have the same sensitivity even if one uses a wider (spread) bandwidth. It cleanly separates "how fast" ($R_b$) from "how good" ($E_b/N_0$).</p>
`,

    3: String.raw`
<p><b>Where we start.</b> The two sensitivity forms above must agree, so there has to be a bridge between the SNR the detector sees and the $E_b/N_0$ the theory uses. That bridge is the topic here.</p>

<p><b>Step 1 — Write both as power ratios.</b> By definition</p>
$$ \frac{S}{N} = \frac{S}{N_0 B}, \qquad \frac{E_b}{N_0} = \frac{S/R_b}{N_0} = \frac{S}{N_0 R_b}, $$
<p>using $S = E_b R_b$ (signal power = energy per bit × bits per second) and $N = N_0 B$ (noise power = density × bandwidth).</p>

<p><b>Step 2 — Divide one by the other.</b></p>
$$ \frac{S/N}{E_b/N_0} = \frac{S/(N_0 B)}{S/(N_0 R_b)} = \frac{R_b}{B}. $$

<p><b>Step 3 — Rearrange.</b></p>
$$ \frac{S}{N} = \frac{E_b}{N_0}\cdot\frac{R_b}{B}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\dfrac{S}{N}=\dfrac{E_b}{N_0}\cdot\dfrac{R_b}{B}\,} $$
<p><b>Intuition / sanity check.</b> The ratio $R_b/B$ is the <i>spectral efficiency</i> (bits/s per Hz). If you transmit at exactly one bit per second per hertz ($R_b=B$), then SNR $=E_b/N_0$ exactly. Spreading a signal over a bandwidth much larger than its bit rate ($B\gg R_b$) makes the in-band SNR drop below $E_b/N_0$ — the hallmark of spread spectrum, where the signal can hide below the noise floor yet still be decoded.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> Sometimes we ask a simpler question: what is the weakest signal a receiver can even <i>register</i>, ignoring the extra headroom a real modulation needs? That is the Minimum Detectable Signal — sensitivity evaluated at the special case of $0$ dB SNR.</p>

<p><b>Step 1 — Recall full sensitivity.</b> From the SNR form,</p>
$$ S_{min}=-174+10\log_{10}B+NF+(S/N)_{req}. $$

<p><b>Step 2 — Set the required SNR to zero.</b> "Detectable" here means the signal power equals the noise power, i.e. the required SNR is $0$ dB. Dropping that last term:</p>
$$ \text{MDS} = -174+10\log_{10}B+NF. $$

<p><b>Step 3 — Interpret.</b> The MDS is simply the receiver's <i>effective noise floor</i> — the noise power referred to its input, with $NF$ folded in. Any real link needs $S_{min}=\text{MDS}+(S/N)_{req}$ above this.</p>

<p><b>Result.</b></p>
$$ \boxed{\,\text{MDS}[\mathrm{dBm}]=-174+10\log_{10}B+NF\quad(0\ \mathrm{dB\ SNR})\,} $$
<p><b>Intuition / sanity check.</b> MDS is the "sea level" of the receiver; sensitivity is sea level plus the wave height ($SNR_{req}$) your boat needs to stay afloat. For a 1 MHz, $NF=6$ dB receiver, $\text{MDS}=-174+60+6=-108$ dBm — exactly the floor from which we earlier built the $-98$ dBm sensitivity by adding $10$ dB.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> Sensitivity tells us the weakest signal the receiver tolerates; the transmitter and antennas tell us how much power we can put into the channel. The difference is the largest path loss the link can survive — which fixes the maximum range. We derive that budget cap.</p>

<p><b>Step 1 — Received power along the chain.</b> Start at the transmitter and walk to the detector in dB, adding gains, subtracting losses:</p>
$$ P_{rx} = P_{tx} + G_{tx} + G_{rx} - L_{misc} - L_{path}. $$

<p><b>Step 2 — Reserve a fade margin.</b> Real channels fade, so we insist on extra headroom $M_{fade}$ that is <i>not</i> spent on average signal. The usable received power is therefore $P_{rx}-M_{fade}$.</p>

<p><b>Step 3 — Impose the sensitivity limit.</b> The link works as long as this usable power stays at or above sensitivity:</p>
$$ P_{tx}+G_{tx}+G_{rx}-L_{misc}-L_{path}-M_{fade}\;\ge\;S_{min}. $$

<p><b>Step 4 — Solve for the largest tolerable path loss.</b> Push $L_{path}$ to the boundary (equality) and rearrange:</p>
$$ L_{path,max} = P_{tx}+G_{tx}+G_{rx}-L_{misc}-M_{fade}-S_{min}. $$

<p><b>Result.</b></p>
$$ \boxed{\,L_{path,max}=P_{tx}+G_{tx}+G_{rx}-L_{misc}-M_{fade}-S_{min}\,} $$
<p><b>Intuition / sanity check.</b> Everything that <i>helps</i> the link (Tx power, both antenna gains) adds to the loss you can afford; everything that <i>hurts</i> (cable/misc losses, fade reserve, and a demanding sensitivity, which is a negative dBm so $-S_{min}$ is positive) subtracts. Feed $L_{path,max}$ into a propagation model (Friis or log-distance) and invert for $d$ to get maximum range.</p>
`
  },

  /* ================= RSSI ================= */
  'rssi': {

    0: String.raw`
<p><b>Where we start.</b> RSSI is what a receiver's power detector reports. A detector cannot separate "wanted signal" from "everything else" — it simply integrates all the power landing in the channel. We show why RSSI is a sum of three contributions.</p>

<p><b>Step 1 — What the detector measures.</b> The voltage at the detector is the superposition of the wanted signal $s(t)$, thermal/receiver noise $n(t)$, and any co-channel interference $i(t)$:</p>
$$ r(t) = s(t) + n(t) + i(t). $$

<p><b>Step 2 — Power of a sum of uncorrelated terms.</b> These three processes are statistically independent, so cross-terms average to zero and the mean powers simply add:</p>
$$ \mathbb{E}[r^2] = \mathbb{E}[s^2] + \mathbb{E}[n^2] + \mathbb{E}[i^2]. $$
<p>That is, $P_{RSSI}=P_{signal}+P_{noise}+P_{interference}$ in <i>linear</i> (watt) units.</p>

<p><b>Step 3 — Read it in dBm.</b> Instruments report $10\log_{10}(P_{RSSI}/1\,\mathrm{mW})$. The addition happens in linear units first; you cannot add the dBm values directly.</p>

<p><b>Result.</b></p>
$$ \boxed{\,P_{RSSI} = P_{signal} + P_{noise} + P_{interference}\,} $$
<p><b>Intuition / sanity check.</b> This is why a high RSSI does not guarantee a good link: a strong interferer or a noisy band inflates RSSI while the wanted-signal SNR stays poor. RSSI is a <i>power</i> indicator, not a <i>quality</i> indicator — quality lives in the ratio $P_{signal}/(P_{noise}+P_{interference})$.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> To turn RSSI into a quality metric we must know how much of it is just noise. That reference level is the noise floor, which we rebuild from thermal physics exactly as for receiver sensitivity.</p>

<p><b>Step 1 — Thermal noise power.</b> A matched front end at reference temperature $T_0=290$ K delivers $N=kT_0B$ watts of noise in bandwidth $B$, whose density in dBm is the universal constant $-174\ \mathrm{dBm/Hz}$.</p>

<p><b>Step 2 — Spread the density over the channel.</b> Multiplying the density by $B$ Hz adds $10\log_{10}B$:</p>
$$ N_{thermal}[\mathrm{dBm}] = -174 + 10\log_{10}(B). $$

<p><b>Step 3 — Add the receiver's own noise.</b> The front-end electronics raise this by the noise figure $NF$:</p>
$$ N_{dBm} = -174 + 10\log_{10}(B) + NF. $$

<p><b>Result.</b></p>
$$ \boxed{\,N_{dBm} = -174 + 10\log_{10}(B) + NF\,} $$
<p><b>Intuition / sanity check.</b> This is the baseline RSSI you would read with <i>no signal present</i> — pure noise. Any RSSI reading only becomes meaningful when compared against this floor. Doubling the bandwidth raises the floor by $3$ dB; a $3$ dB noisier front end raises it by $3$ dB too.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> A cheap RSSI reading includes the noise power. To recover the true SNR we must <i>subtract</i> the noise contribution — and because RSSI is total power, that subtraction has to happen in linear units, not in dB. This gives the exact conversion.</p>

<p><b>Step 1 — Split RSSI.</b> Ignoring interference, the total measured power is signal plus noise (linear watts):</p>
$$ P_{RSSI}^{\,\text{lin}} = P_{signal}^{\,\text{lin}} + P_{noise}^{\,\text{lin}}. $$

<p><b>Step 2 — Convert both readings from dBm to linear.</b> If $P_{RSSI}$ and $N$ are the dBm values,</p>
$$ P_{RSSI}^{\,\text{lin}} = 10^{P_{RSSI}/10},\qquad P_{noise}^{\,\text{lin}} = 10^{N/10}. $$

<p><b>Step 3 — Isolate the signal power.</b> Subtract the noise floor from the total:</p>
$$ P_{signal}^{\,\text{lin}} = 10^{P_{RSSI}/10} - 10^{N/10}. $$

<p><b>Step 4 — Form the ratio and take dB.</b> SNR is signal over noise:</p>
$$ \text{SNR}_{dB} = 10\log_{10}\!\frac{P_{signal}^{\,\text{lin}}}{P_{noise}^{\,\text{lin}}} = 10\log_{10}\!\left(\frac{10^{P_{RSSI}/10}-10^{N/10}}{10^{N/10}}\right). $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{SNR}_{dB} = 10\log_{10}\!\left(\dfrac{10^{P_{RSSI}/10} - 10^{N/10}}{10^{N/10}}\right)\,} $$
<p><b>Intuition / sanity check.</b> When the signal dominates ($P_{RSSI}\gg N$) the subtracted noise is negligible and this reduces to the naive $\text{SNR}\approx P_{RSSI}-N$. But when RSSI is only a hair above the floor, the exact form correctly reports a near-zero SNR, whereas the naive difference would over-estimate quality. The subtraction is what prevents counting the noise floor twice.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> To predict RSSI versus distance we need a propagation law. Free space loses power as $1/d^2$, but cluttered environments lose it faster. We generalize the exponent and add a random shadowing term, then express the whole thing in received-power (RSSI) form.</p>

<p><b>Step 1 — Power-law spreading.</b> In free space, received power falls as $d^{-2}$. In real environments (walls, ground reflections, foliage) it falls as $d^{-n}$ where $n$ is the <i>path-loss exponent</i>:</p>
$$ P_r(d) \propto d^{-n}. $$

<p><b>Step 2 — Reference to a known close-in point.</b> Measure RSSI at a reference distance $d_0$, then take the ratio:</p>
$$ \frac{P_r(d)}{P_r(d_0)} = \left(\frac{d}{d_0}\right)^{-n}. $$

<p><b>Step 3 — Convert to dB.</b> Apply $10\log_{10}$:</p>
$$ \text{RSSI}(d) = \text{RSSI}(d_0) - 10\,n\log_{10}\!\left(\frac{d}{d_0}\right). $$

<p><b>Step 4 — Add shadowing.</b> Obstructions cause slow, random fluctuations that are Gaussian in dB. Add a zero-mean term $X_\sigma \sim \mathcal{N}(0,\sigma^2)$:</p>
$$ \text{RSSI}(d) = \text{RSSI}(d_0) - 10\,n\log_{10}\!\left(\frac{d}{d_0}\right) + X_\sigma. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{RSSI}(d) = \text{RSSI}(d_0) - 10\,n\log_{10}\!\left(\dfrac{d}{d_0}\right) + X_\sigma\,} $$
<p><b>Intuition / sanity check.</b> Set $n=2$ and $X_\sigma=0$ and you recover free-space behavior: every doubling of distance costs $10\cdot2\cdot\log_{10}2\approx6$ dB. Indoors $n$ can reach $3$–$4$, so range collapses fast. The $X_\sigma$ term is why two spots the same distance away can read very different RSSI.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> In LTE, RSSI mixes wanted reference-signal power with noise and interference, so on its own it is a poor quality gauge. RSRQ was defined to normalize the clean per-resource-element signal (RSRP) against the total measured RSSI, giving a quality-aware ratio. We assemble that definition.</p>

<p><b>Step 1 — The two ingredients.</b> RSRP is the average power of a single resource element carrying the reference signal (a clean, per-RE measure). RSSI is the total wideband power across all $N$ resource blocks in the measurement bandwidth — signal + noise + interference.</p>

<p><b>Step 2 — Put them on the same footing.</b> RSSI spans $N$ resource blocks worth of subcarriers, whereas RSRP is per-RE. To compare like with like, scale RSRP up by the number of resource blocks $N$ so numerator and denominator cover the same bandwidth:</p>
$$ \text{(comparable signal power)} = N\cdot\text{RSRP}. $$

<p><b>Step 3 — Form the normalized ratio.</b> Divide the bandwidth-matched signal by the total power actually measured:</p>
$$ \text{RSRQ} = \frac{N\cdot\text{RSRP}}{\text{RSSI}}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{RSRQ} = \dfrac{N \cdot \text{RSRP}}{\text{RSSI}}\,} $$
<p><b>Intuition / sanity check.</b> If the band were noise- and interference-free, RSSI would equal $N\cdot\text{RSRP}$ and RSRQ would be $1$ (its ceiling). As interference and load grow, RSSI inflates, the ratio drops, and RSRQ correctly signals degraded quality even when raw RSRP (bare signal strength) still looks fine.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> If a beacon's RSSI follows a known distance law, then reading RSSI lets us <i>invert</i> the law to estimate distance — the basis of RSSI ranging in indoor positioning and BLE proximity. We solve the log-distance model for $d$.</p>

<p><b>Step 1 — Start from the (mean) model.</b> Drop the random shadowing term (its expectation is zero) and write</p>
$$ \text{RSSI}(d) = \text{RSSI}(d_0) - 10\,n\log_{10}\!\left(\frac{d}{d_0}\right). $$

<p><b>Step 2 — Isolate the log term.</b> Move the measured RSSI across:</p>
$$ 10\,n\log_{10}\!\left(\frac{d}{d_0}\right) = \text{RSSI}(d_0) - \text{RSSI}(d). $$

<p><b>Step 3 — Divide, then exponentiate.</b> Solve for $\log_{10}(d/d_0)$ and undo the log with base 10:</p>
$$ \log_{10}\!\left(\frac{d}{d_0}\right) = \frac{\text{RSSI}(d_0)-\text{RSSI}(d)}{10\,n} \;\Longrightarrow\; \frac{d}{d_0} = 10^{\frac{\text{RSSI}(d_0)-\text{RSSI}(d)}{10\,n}}. $$

<p><b>Step 4 — Restore the reference distance.</b></p>
$$ \hat{d} = d_0\cdot 10^{\frac{\text{RSSI}(d_0)-\text{RSSI}(d)}{10\,n}}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\hat{d} = d_0 \cdot 10^{\frac{\text{RSSI}(d_0) - \text{RSSI}(d)}{10\,n}}\,} $$
<p><b>Intuition / sanity check.</b> If the current RSSI equals the reference RSSI, the exponent is $0$ and $\hat d=d_0$ — you are at the reference point. Each time RSSI drops by $10n$ dB, $\hat d$ multiplies by $10$. The estimate is only as good as your knowledge of $n$; because real $X_\sigma$ shadowing is ignored, RSSI ranging typically carries several-meter error indoors.</p>
`
  },

  /* ================= PATH LOSS ================= */
  'path-loss': {

    0: String.raw`
<p><b>Where we start.</b> We want the received power for two antennas separated by distance $d$ in free space. We build it in three physical moves: spread the transmit power over a sphere, weight it by the transmit antenna's directivity, then collect it with the receive antenna's effective area.</p>

<p><b>Step 1 — Isotropic spreading over a sphere.</b> An isotropic transmitter of power $P_t$ spreads it uniformly over the surface of a sphere of radius $d$ (area $4\pi d^2$). The power density (W/m²) at distance $d$ is</p>
$$ S_{iso} = \frac{P_t}{4\pi d^2}. $$

<p><b>Step 2 — Point the energy: transmit gain.</b> A real antenna concentrates power in a direction; its gain $G_t$ multiplies the density on boresight:</p>
$$ S = \frac{P_t G_t}{4\pi d^2}. $$

<p><b>Step 3 — Collect with an effective area.</b> The receive antenna captures power equal to density times its effective aperture $A_e$: $P_r = S\,A_e$. From antenna theory the aperture of a gain-$G_r$ antenna is $A_e = G_r\lambda^2/4\pi$ (derived in the "Effective aperture" equation). So</p>
$$ P_r = \frac{P_t G_t}{4\pi d^2}\cdot\frac{G_r\lambda^2}{4\pi}. $$

<p><b>Step 4 — Group the geometry.</b> Combine the two $4\pi$'s and the $d^2$ under a single squared factor:</p>
$$ P_r = P_t G_t G_r\left(\frac{\lambda}{4\pi d}\right)^2. $$

<p><b>Result.</b></p>
$$ \boxed{\,P_r = P_t\, G_t\, G_r \left(\dfrac{\lambda}{4\pi d}\right)^2\,} $$
<p><b>Intuition / sanity check.</b> Received power falls as $1/d^2$ (spherical spreading) and, at fixed frequency, as $\lambda^2$ — lower frequencies (longer $\lambda$) travel "for free" farther because their apertures are electrically larger. Doubling distance costs a factor of 4 (6 dB); this is the free-space benchmark every real link is measured against.</p>
`,

    1: String.raw`
<p><b>Where we start.</b> Path loss is the inverse of the Friis gain factor: how many dB the free-space geometry steals. We take the Friis $(\lambda/4\pi d)^2$ term, invert it, express it in frequency, and collapse the constant into the famous $32.44$ (or $20\log_{10}(4\pi/c)$) form.</p>

<p><b>Step 1 — Define path loss.</b> With unity antenna gains, FSPL is the ratio of transmitted to received power:</p>
$$ \text{FSPL} = \frac{P_t}{P_r} = \left(\frac{4\pi d}{\lambda}\right)^2. $$

<p><b>Step 2 — Replace wavelength by frequency.</b> Since $\lambda = c/f$,</p>
$$ \text{FSPL} = \left(\frac{4\pi d f}{c}\right)^2. $$

<p><b>Step 3 — Take decibels.</b> Apply $10\log_{10}$; the square becomes a factor of $2$:</p>
$$ \text{FSPL}_{dB} = 20\log_{10}(d) + 20\log_{10}(f) + 20\log_{10}\!\left(\frac{4\pi}{c}\right). $$

<p><b>Step 4 — Evaluate the constant.</b> With $c=3\times10^8$ m/s and $d$ in metres, $f$ in Hz, $20\log_{10}(4\pi/c)\approx -147.55$ dB. If instead $d$ is in km and $f$ in MHz, the unit conversions ($+60$ for km, $+120$ for MHz) fold in to give the well-known $+32.44$:</p>
$$ \text{FSPL}_{dB} = 20\log_{10}(d_{km}) + 20\log_{10}(f_{MHz}) + 32.44. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{FSPL}_{dB} = 20\log_{10}(d) + 20\log_{10}(f) + 20\log_{10}\!\left(\dfrac{4\pi}{c}\right)\,} $$
<p><b>Intuition / sanity check.</b> Both distance and frequency cost $20\log_{10}$: doubling either adds $6$ dB of loss. That is why higher-frequency (5G mmWave) links suffer far more free-space loss than sub-GHz links over the same distance. The lone constant just carries the unit system and the $4\pi/c$ geometry.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> Free-space loss assumes a clean $1/d^2$ world. Real channels lose power faster and randomly. We generalize by (1) letting the loss exponent depart from 2 and (2) adding a Gaussian-in-dB shadowing term, anchored to a measured reference distance.</p>

<p><b>Step 1 — Generalize the exponent.</b> Empirically, mean path loss grows with distance as $d^{\,n}$ rather than $d^2$, where $n$ is the environment-dependent path-loss exponent. So</p>
$$ PL(d) \propto d^{\,n}. $$

<p><b>Step 2 — Reference to a close-in point.</b> Rather than compute the absolute constant, tie the model to a measured loss $PL(d_0)$ at a near distance $d_0$ (often 1 m):</p>
$$ \frac{PL(d)}{PL(d_0)} \;\to\; PL(d)_{dB} = PL(d_0) + 10\,n\log_{10}\!\left(\frac{d}{d_0}\right), $$
<p>where the $10\,n\log_{10}$ comes from taking $10\log_{10}$ of $(d/d_0)^n$.</p>

<p><b>Step 3 — Add log-normal shadowing.</b> Large obstacles make the loss fluctuate about this mean. Those fluctuations are Gaussian in dB, so add $X_\sigma\sim\mathcal N(0,\sigma^2)$:</p>
$$ PL(d)_{dB} = PL(d_0) + 10\,n\log_{10}\!\left(\frac{d}{d_0}\right) + X_\sigma. $$

<p><b>Result.</b></p>
$$ \boxed{\,PL(d)_{dB} = PL(d_0) + 10\,n\log_{10}\!\left(\dfrac{d}{d_0}\right) + X_\sigma\,} $$
<p><b>Intuition / sanity check.</b> Put $n=2$, $X_\sigma=0$ and the reference-anchored model reproduces free-space loss. Real values ($n\approx2.7$–$3.5$ urban, $4$–$6$ indoors through walls) capture how clutter accelerates decay, while $X_\sigma$ (typically $\sigma=4$–$8$ dB) captures the spot-to-spot randomness a single equation cannot predict deterministically.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> The Friis equation quietly used $A_e = G_r\lambda^2/4\pi$ to turn a receive antenna's gain into a collecting area. We derive that fundamental relation between gain and effective aperture — it is what lets an antenna be treated as a "bucket" catching a power density.</p>

<p><b>Step 1 — Aperture as a collecting area.</b> Define the effective aperture $A_e$ so that the power a receive antenna extracts equals the incident power density times $A_e$: $P_r = S\,A_e$. This makes $A_e$ the antenna's electrical "catch area."</p>

<p><b>Step 2 — Use the reciprocity result.</b> A cornerstone of antenna theory (from reciprocity and the properties of an isotropic radiator's fields) is that <i>every</i> antenna obeys the universal ratio</p>
$$ \frac{G}{A_e} = \frac{4\pi}{\lambda^2}. $$
<p>This is fixed by electromagnetics and holds regardless of antenna type — a fundamental link between how well an antenna transmits (gain) and how well it receives (aperture).</p>

<p><b>Step 3 — Solve for the aperture.</b> Rearranging for the receive antenna of gain $G_r$:</p>
$$ A_e = \frac{G_r\lambda^2}{4\pi}. $$

<p><b>Result.</b></p>
$$ \boxed{\,A_e = \dfrac{G_r\lambda^2}{4\pi}\,} $$
<p><b>Intuition / sanity check.</b> At fixed gain, a lower frequency (larger $\lambda$) has a larger effective aperture — the antenna "reaches out" farther — which is exactly the $\lambda^2$ that appears in Friis. A dish's physical area times its aperture efficiency also equals $A_e$, tying this abstract quantity back to something you can measure with a tape measure.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> Because shadowing $X_\sigma$ is random, a link designed only for the <i>mean</i> path loss fails half the time at the cell edge. To guarantee coverage with probability $p$, we must reserve extra margin. We derive how large that reserve must be from the Gaussian statistics of $X_\sigma$.</p>

<p><b>Step 1 — Model the randomness.</b> The excess loss $X_\sigma$ is zero-mean Gaussian with standard deviation $\sigma$ (in dB). The received power exceeds the required threshold only when the fade is not too deep.</p>

<p><b>Step 2 — Coverage condition.</b> We want the probability that the signal stays above threshold to be at least $p$. Equivalently, the shadow fade must not exceed the margin $M_{fade}$ we set aside. For a Gaussian, the probability that a $\mathcal N(0,\sigma^2)$ variable stays within $M_{fade}$ of the mean is governed by the $Q$-function tail.</p>

<p><b>Step 3 — Invert the tail probability.</b> The margin equals the number of standard deviations that leaves only $(1-p)$ probability in the tail, times $\sigma$. That number of standard deviations is the inverse-$Q$ (or equivalently the standard-normal quantile) evaluated at $1-p$:</p>
$$ M_{fade} = Q^{-1}(1-p)\cdot\sigma. $$

<p><b>Result.</b></p>
$$ \boxed{\,M_{fade} = Q^{-1}(1-p)\cdot\sigma\,} $$
<p><b>Intuition / sanity check.</b> More reliability (larger $p$) or a rougher environment (larger $\sigma$) demands more margin. For $p=90\%$, $Q^{-1}(0.1)\approx1.28$, so $M_{fade}\approx1.28\sigma$; for $\sigma=6$ dB that is about $7.7$ dB of reserve you must subtract from your link budget just to beat the shadowing.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> Above ~150 MHz in cluttered cities, neither Friis nor a bare exponent model fits well. Okumura measured propagation across Tokyo; Hata fit closed-form curves to those measurements. The result is an empirical formula, and we assemble it term by term to see the physics each piece encodes.</p>

<p><b>Step 1 — Frequency dependence.</b> Loss rises with frequency. Hata's fit contributes a constant $69.55$ plus $26.16\log_{10}f$ (with $f$ in MHz), steeper than free-space's $20\log_{10}f$ because clutter interaction grows with frequency.</p>

<p><b>Step 2 — Base-station height helps.</b> A taller base antenna clears obstructions, so loss falls with $h_b$: subtract $13.82\log_{10}h_b$.</p>

<p><b>Step 3 — Mobile-height correction.</b> A terrain/city-size-dependent function $a(h_m)$ corrects for the mobile antenna height; subtract it.</p>

<p><b>Step 4 — Distance dependence, height-coupled.</b> The distance slope is not a fixed $20\log_{10}d$; Okumura found it depends on base height, giving the coupled term $(44.9-6.55\log_{10}h_b)\log_{10}d$. A taller base flattens the distance decay.</p>

<p><b>Step 5 — Sum the pieces.</b></p>
$$ L = 69.55 + 26.16\log_{10}f - 13.82\log_{10}h_b - a(h_m) + (44.9 - 6.55\log_{10}h_b)\log_{10}d. $$

<p><b>Result.</b></p>
$$ \boxed{\,L = 69.55 + 26.16\log_{10}f - 13.82\log_{10}h_b - a(h_m) + (44.9 - 6.55\log_{10}h_b)\log_{10}d\,} $$
<p><b>Intuition / sanity check.</b> Every sign matches physics: $+$ for frequency (more loss), $-$ for both antenna heights (less loss), and a distance slope that eases as the base gets taller. It is valid over roughly $150$–$1500$ MHz, $1$–$20$ km, so it is an <i>interpolation</i> of real measurements, not a first-principles law — use it inside its range only.</p>
`
  },

  /* ================= LINK BUDGET ================= */
  'link-budget': {

    0: String.raw`
<p><b>Where we start.</b> A link budget is bookkeeping: track a signal in dB from the transmitter's power amplifier to the receiver's detector, adding every gain and subtracting every loss. We build the master equation stage by stage.</p>

<p><b>Step 1 — Leave the transmitter.</b> Start with the PA output $P_{tx}$ (dBm). The antenna adds gain $G_{tx}$, but the feed line/connectors before it cost $L_{tx}$:</p>
$$ P_{\text{radiated}} = P_{tx} + G_{tx} - L_{tx}. $$

<p><b>Step 2 — Cross the channel.</b> Propagation removes the path loss $PL$, and assorted extras (polarization mismatch, pointing error, rain, body loss) remove $L_{misc}$:</p>
$$ P_{\text{at Rx antenna}} = (P_{tx}+G_{tx}-L_{tx}) - PL - L_{misc}. $$

<p><b>Step 3 — Enter the receiver.</b> The receive antenna adds $G_{rx}$, and its feed line costs $L_{rx}$:</p>
$$ P_{rx} = (P_{tx}+G_{tx}-L_{tx}) - PL - L_{misc} + G_{rx} - L_{rx}. $$

<p><b>Result.</b></p>
$$ \boxed{\,P_{rx} = P_{tx} + G_{tx} - L_{tx} - PL - L_{misc} + G_{rx} - L_{rx}\,} $$
<p><b>Intuition / sanity check.</b> Every antenna gain enters with a $+$, every loss with a $-$; because we work in dB the whole chain is one running sum. Because Friis says $PL$ dominates and grows with distance, $P_{rx}$ falls steadily with range — and the link lives only while $P_{rx}$ stays above sensitivity (the "link margin" equation).</p>
`,

    1: String.raw`
<p><b>Where we start.</b> Before the wave even leaves the antenna we can bundle the transmitter side into one number — the Effective Isotropic Radiated Power. It answers: "How much power would an ideal isotropic radiator need to match this antenna on boresight?" We extract it from the link-budget chain.</p>

<p><b>Step 1 — Isolate the transmit terms.</b> From the master equation, the part before propagation is the transmitter's contribution to radiated power:</p>
$$ \text{(radiated)} = P_{tx} + G_{tx} - L_{tx}. $$

<p><b>Step 2 — Name it EIRP.</b> Define this bundle as EIRP because, on boresight, a real antenna of gain $G_{tx}$ fed with $P_{tx}-L_{tx}$ produces the same power density as an isotropic antenna fed with the whole EIRP:</p>
$$ \text{EIRP} = P_{tx} + G_{tx} - L_{tx}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{EIRP} = P_{tx} + G_{tx} - L_{tx}\,} $$
<p><b>Intuition / sanity check.</b> EIRP is the single figure regulators cap, because it captures how "loud" a transmitter really is in its best direction. A $30$ dBm PA behind a $2$ dB feed loss and a $15$ dBi antenna yields $30-2+15=43$ dBm EIRP — as if $20$ W were radiated equally in all directions. It lets you compare very different Tx setups with one number.</p>
`,

    2: String.raw`
<p><b>Where we start.</b> The link budget needs a threshold to compare $P_{rx}$ against: the receiver sensitivity. We rebuild it from the thermal noise floor, exactly as in the sensitivity topic, so the link-budget spreadsheet is self-contained.</p>

<p><b>Step 1 — Thermal floor.</b> A matched front end at $T_0=290$ K has noise density $-174\ \mathrm{dBm/Hz}$; over bandwidth $B$ that is $-174+10\log_{10}B$ dBm.</p>

<p><b>Step 2 — Add hardware noise.</b> The noise figure $NF$ raises the floor:</p>
$$ N_{floor} = -174 + 10\log_{10}(B) + NF. $$

<p><b>Step 3 — Add the required SNR.</b> The demodulator needs $\text{SNR}_{req}$ dB above the floor for its target error rate, so the smallest usable signal is</p>
$$ P_{sens} = N_{floor} + \text{SNR}_{req}. $$

<p><b>Result.</b></p>
$$ \boxed{\,P_{sens} = -174 + 10\log_{10}(B) + NF + \text{SNR}_{req}\,} $$
<p><b>Intuition / sanity check.</b> This is the "goal line" of the whole budget: the link works only if $P_{rx}\ge P_{sens}$. Narrower bandwidth, a quieter front end, or a more forgiving modulation all lower this line and make the link easier to close.</p>
`,

    3: String.raw`
<p><b>Where we start.</b> Datasheets specify the demodulator by $E_b/N_0$, but the link budget wants an SNR to plug into $P_{sens}$. We derive the conversion from the definitions of signal and noise power.</p>

<p><b>Step 1 — Express signal and noise.</b> Signal power is energy per bit times bit rate, $S=E_b R_b$. Noise power is density times bandwidth, $N=N_0 B$.</p>

<p><b>Step 2 — Form the ratio.</b></p>
$$ \text{SNR} = \frac{S}{N} = \frac{E_b R_b}{N_0 B} = \frac{E_b}{N_0}\cdot\frac{R_b}{B}. $$

<p><b>Result.</b></p>
$$ \boxed{\,\text{SNR} = \dfrac{E_b}{N_0}\cdot\dfrac{R_b}{B}\,} $$
<p><b>Intuition / sanity check.</b> The multiplier $R_b/B$ is spectral efficiency. When bandwidth equals bit rate ($B=R_b$), SNR and $E_b/N_0$ coincide. Spread-spectrum links use $B\gg R_b$, so their in-band SNR is far below $E_b/N_0$ — they trade bandwidth for the ability to operate below the noise floor.</p>
`,

    4: String.raw`
<p><b>Where we start.</b> With received power ($P_{rx}$) and the sensitivity threshold ($P_{sens}$) both in hand, the single most important number in the whole budget is how much slack remains. That slack is the link margin.</p>

<p><b>Step 1 — Define slack.</b> Margin is simply how far the received power sits above the minimum usable level:</p>
$$ M = P_{rx} - P_{sens}. $$

<p><b>Step 2 — Interpret the sign.</b> If $M>0$ the link closes with room to spare; if $M<0$ the received signal is below sensitivity and the link fails. $M$ is measured in dB.</p>

<p><b>Result.</b></p>
$$ \boxed{\,M = P_{rx} - P_{sens}\,} $$
<p><b>Intuition / sanity check.</b> Positive margin is your safety cushion against fades, rain, aging, and pointing errors. Designers typically insist on several dB of margin (often equal to a computed fade margin) rather than a bare $M=0$, because a link with zero margin drops the instant anything goes slightly wrong.</p>
`,

    5: String.raw`
<p><b>Where we start.</b> Part of the link margin must be deliberately reserved to survive random fading, so the link stays up a target fraction $p$ of the time. We derive the size of that fade reserve from the Gaussian statistics of shadow fading.</p>

<p><b>Step 1 — Model the fade.</b> Shadow fading (in dB) is zero-mean Gaussian with standard deviation $\sigma$. An outage occurs when a fade deeper than our reserve $M_{fade}$ drops the signal below sensitivity.</p>

<p><b>Step 2 — Set the availability target.</b> We require the signal to stay above threshold with probability $p$; equivalently the probability of a fade exceeding $M_{fade}$ is only $1-p$. For a Gaussian, the depth that leaves tail probability $1-p$ is $Q^{-1}(1-p)$ standard deviations.</p>

<p><b>Step 3 — Scale by $\sigma$.</b> Convert "number of standard deviations" into dB by multiplying by $\sigma$:</p>
$$ M_{fade} = Q^{-1}(1-p)\cdot\sigma. $$

<p><b>Result.</b></p>
$$ \boxed{\,M_{fade} = Q^{-1}(1-p)\cdot\sigma\,} $$
<p><b>Intuition / sanity check.</b> Demanding higher availability (larger $p$) or facing rougher fading (larger $\sigma$) both grow the reserve. For $99\%$ availability, $Q^{-1}(0.01)\approx2.33$, so with $\sigma=8$ dB you must set aside $\approx18.6$ dB — a big chunk of budget bought purely to ride out the fades.</p>
`,

    6: String.raw`
<p><b>Where we start.</b> The link budget delivers an SNR; Shannon's theorem tells us the absolute ceiling on error-free data rate that SNR permits. We sketch why capacity takes its $\log_2(1+\text{SNR})$ form.</p>

<p><b>Step 1 — Bandwidth sets the sample rate.</b> By Nyquist, a channel of bandwidth $B$ supports $2B$ independent real samples per second — the raw number of "slots" available to carry information.</p>

<p><b>Step 2 — SNR sets the levels per slot.</b> Noise blurs each sample; the number of reliably distinguishable amplitude levels is set by how far signal power stands above noise power. Shannon's analysis of a Gaussian channel shows each sample can carry $\tfrac12\log_2(1+\text{SNR})$ bits, where the $1+$ accounts for signal-plus-noise power relative to noise.</p>

<p><b>Step 3 — Combine rate and bits-per-sample.</b> Multiply $2B$ samples/s by $\tfrac12\log_2(1+\text{SNR})$ bits/sample; the factors of 2 cancel:</p>
$$ C = 2B\cdot\tfrac12\log_2(1+\text{SNR}) = B\log_2(1 + \text{SNR}). $$

<p><b>Result.</b></p>
$$ \boxed{\,C = B\log_2(1 + \text{SNR})\,} $$
<p><b>Intuition / sanity check.</b> Capacity grows only <i>logarithmically</i> with SNR (each doubling of SNR buys about one more bit/s/Hz) but <i>linearly</i> with bandwidth — which is why chasing capacity favors more spectrum over more power. No modulation, however clever, can beat $C$; the link budget's SNR therefore caps the achievable data rate.</p>
`
  }

});
