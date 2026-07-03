/* From-scratch, fully explained derivations for the Fundamentals category.
   Keyed by topic id, then by the equation index from the spec. */
Object.assign(CONTENT_DERIV, {

  'comm-basics': {
    0: String.raw`
<p><b>Where we start.</b> We want to know the maximum error-free bit rate a channel can carry when the only impairment is additive white Gaussian noise (AWGN). We begin from the idea that <i>information equals the number of distinguishable signal states</i>, and that noise blurs those states into overlapping clouds.</p>

<p><b>Step 1 — Count distinguishable levels.</b> Suppose the transmitter uses average signal power $S$ over a channel of bandwidth $B$. The received signal has average power $S$ and is corrupted by noise of average power $N$. A single sample can be thought of as a point on a line; noise spreads each point into a fuzzy blob whose "radius" scales with $\sqrt{N}$. The whole received signal-plus-noise occupies a range whose "radius" scales with $\sqrt{S+N}$. The number of reliably distinguishable levels is the ratio of these two radii.</p>
$$ M = \frac{\sqrt{S+N}}{\sqrt{N}} = \sqrt{1+\frac{S}{N}} $$
<p>Each distinguishable level is a symbol we can tell apart despite the noise.</p>

<p><b>Step 2 — Bits per sample.</b> If one sample can take $M$ distinguishable values, it carries $\log_2 M$ bits of information (that is the definition of a bit: $\log_2$ of the number of equally likely outcomes).</p>
$$ \text{bits per sample} = \log_2 M = \log_2\!\sqrt{1+\frac{S}{N}} = \tfrac{1}{2}\log_2\!\left(1+\frac{S}{N}\right) $$

<p><b>Step 3 — Samples per second.</b> The Nyquist sampling theorem says a channel of bandwidth $B$ supports $2B$ independent samples per second. Multiplying the bits carried by each sample by the number of samples per second gives the information rate.</p>
$$ C = (2B)\times\tfrac{1}{2}\log_2\!\left(1+\frac{S}{N}\right) $$
<p>The factor $2B$ and the factor $\tfrac{1}{2}$ cancel, leaving the clean result.</p>

<p><b>Result.</b> $$ C = B\log_2\!\left(1+\frac{S}{N}\right) $$ Capacity grows only <i>logarithmically</i> with power (doubling $S/N$ adds one bit per sample), but <i>linearly</i> with bandwidth. That is why, when signal power is cheap and bandwidth is scarce, we push toward higher-order modulation; and when bandwidth is cheap, we spread out instead. Sanity check: if $S/N \to 0$, $\log_2(1)=0$ and capacity vanishes — no signal, no information.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Engineers compare links using $E_b/N_0$ — energy per bit divided by noise power spectral density — because it is independent of bandwidth and bit rate, making it a fair "quality per bit" metric. We want to connect it to the ordinary signal-to-noise ratio $S/N$, which is what a spectrum analyzer measures in a given bandwidth.</p>

<p><b>Step 1 — Write signal power as energy times rate.</b> The received signal power $S$ is the energy delivered per second. If each bit carries energy $E_b$ and bits arrive at rate $R_b$ (bits/s), then</p>
$$ S = E_b R_b $$
<p>This is just "power = energy per bit $\times$ bits per second."</p>

<p><b>Step 2 — Write noise power as PSD times bandwidth.</b> White noise has a flat power spectral density $N_0$ (watts per hertz). The total noise power captured in the receiver bandwidth $B$ is the density times the bandwidth.</p>
$$ N = N_0 B $$

<p><b>Step 3 — Form the ratio.</b> Divide the two expressions.</p>
$$ \frac{S}{N} = \frac{E_b R_b}{N_0 B} $$

<p><b>Step 4 — Solve for the per-bit quantity.</b> Rearrange to isolate $E_b/N_0$.</p>
$$ \frac{E_b}{N_0} = \frac{S}{N}\cdot\frac{B}{R_b} $$

<p><b>Result.</b> $$ \frac{E_b}{N_0} = \frac{S}{N}\cdot\frac{B}{R_b} $$ The factor $B/R_b$ is the inverse of spectral efficiency. A system that spreads its signal over much more bandwidth than its bit rate (like DSSS, $B\gg R_b$) enjoys a large $E_b/N_0$ even when the in-band $S/N$ is below unity — the origin of "processing gain." Sanity check: at $B=R_b$ (one bit per hertz) the two ratios coincide.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> There is a hard floor on how little energy per bit any communication system can use, no matter how clever the coding. We find it by pushing the Shannon capacity formula to its infinite-bandwidth limit.</p>

<p><b>Step 1 — Set capacity equal to the bit rate.</b> To operate reliably we need the bit rate $R_b$ to be no more than capacity $C$. At the ultimate limit we run right at capacity, $R_b = C$.</p>
$$ R_b = B\log_2\!\left(1+\frac{S}{N}\right) $$

<p><b>Step 2 — Substitute $S/N$ in terms of $E_b/N_0$.</b> From the previous relation, $S/N = (E_b/N_0)(R_b/B)$. Insert it.</p>
$$ R_b = B\log_2\!\left(1+\frac{E_b}{N_0}\frac{R_b}{B}\right) $$

<p><b>Step 3 — Introduce spectral efficiency.</b> Let $\eta = R_b/B$ (bits/s/Hz). Divide both sides by $B$.</p>
$$ \eta = \log_2\!\left(1+\frac{E_b}{N_0}\,\eta\right) $$
<p>Solve for $E_b/N_0$: exponentiate and rearrange.</p>
$$ \frac{E_b}{N_0} = \frac{2^{\eta}-1}{\eta} $$

<p><b>Step 4 — Take the infinite-bandwidth limit.</b> Using unlimited bandwidth means $\eta\to 0$. We evaluate the limit of $(2^\eta-1)/\eta$ as $\eta\to0$. Write $2^\eta = e^{\eta\ln 2}$ and expand for small $\eta$: $e^{\eta\ln2}\approx 1+\eta\ln2$.</p>
$$ \lim_{\eta\to 0}\frac{2^{\eta}-1}{\eta} = \lim_{\eta\to 0}\frac{(1+\eta\ln 2)-1}{\eta} = \ln 2 $$

<p><b>Step 5 — Convert to decibels.</b> $10\log_{10}(\ln 2) = 10\log_{10}(0.6931) \approx -1.59\ \text{dB}$.</p>

<p><b>Result.</b> $$ \frac{E_b}{N_0}\bigg|_{min} = \ln 2 \approx -1.59\ \text{dB} $$ Below this energy-per-bit, reliable communication is impossible at any rate — this is the famous "Shannon limit." Sanity check: it is a pure number ($\ln 2$), independent of temperature, frequency, or hardware, exactly as a fundamental limit should be.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> Modulation packs several bits onto each transmitted symbol (waveform). We want the bit rate given how fast we send symbols and how many bits each symbol represents.</p>

<p><b>Step 1 — Count the bits a symbol can encode.</b> If a modulation scheme has $M$ distinct symbols (e.g. $M=4$ for QPSK, $M=16$ for 16-QAM), then choosing one symbol out of $M$ equally likely possibilities conveys $\log_2 M$ bits — the definition of information content.</p>
$$ \text{bits per symbol} = \log_2 M $$

<p><b>Step 2 — Multiply by the symbol rate.</b> Symbols leave the transmitter at rate $R_s$ (symbols/second, the baud rate). Each carries $\log_2 M$ bits, so the bits per second is the product.</p>
$$ R_b = R_s \times (\text{bits per symbol}) $$

<p><b>Result.</b> $$ R_b = R_s\log_2 M $$ Higher-order modulation ($M$ larger) raises the bit rate without needing more symbols per second — but those symbols sit closer together and demand a higher $S/N$ to keep them distinguishable. Sanity check: for BPSK ($M=2$), $\log_2 2 = 1$, so $R_b = R_s$ — one bit per symbol, as expected.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> We need to know how much bandwidth a stream of symbols actually occupies. The theoretical minimum comes from Nyquist; real filters add a controlled excess set by the roll-off factor $\alpha$.</p>

<p><b>Step 1 — Nyquist's minimum bandwidth.</b> To send $R_s$ symbols per second without inter-symbol interference, Nyquist showed the ideal (brick-wall) baseband bandwidth needed is half the symbol rate.</p>
$$ B_{min} = \frac{R_s}{2} $$
<p>This is the dual of sampling: $R_s$ independent symbols per second require exactly $R_s/2$ hertz of baseband spectrum.</p>

<p><b>Step 2 — Brick-wall filters are unrealizable.</b> An ideal rectangular spectrum corresponds to a sinc pulse of infinite duration. Practical systems use a raised-cosine filter that smoothly tapers the band edges. The taper widens the band by a fractional excess $\alpha$ (the roll-off factor, $0\le\alpha\le1$).</p>
$$ B = B_{min}(1+\alpha) $$

<p><b>Step 3 — Combine.</b> Substitute $B_{min}=R_s/2$.</p>
$$ B = \frac{R_s}{2}(1+\alpha) $$

<p><b>Result.</b> $$ B = \frac{R_s}{2}(1+\alpha) $$ At $\alpha=0$ we recover Nyquist's absolute minimum $R_s/2$; at $\alpha=1$ the bandwidth doubles to $R_s$. The roll-off buys gentler, realizable filters and more forgiving timing at the cost of spectrum. Sanity check: a QPSK link at $1$ Mbaud with $\alpha=0.35$ occupies $\tfrac{1}{2}(1.35)=0.675$ MHz — the familiar "35% excess bandwidth."</p>
`,
    5: String.raw`
<p><b>Where we start.</b> To compare how efficiently different systems use their spectrum, we normalize the delivered bit rate by the bandwidth consumed. This single number tells us how many bits per second we squeeze out of each hertz.</p>

<p><b>Step 1 — Define the quantity of interest.</b> "Spectral efficiency" is literally bits per second per hertz. We form it directly as the ratio of what we get ($R_b$, bits/s) to what we pay ($B$, Hz).</p>
$$ \eta = \frac{R_b}{B} $$

<p><b>Step 2 — Interpret the units.</b> $R_b$ has units bits/s and $B$ has units Hz = 1/s, so the ratio has units (bits/s)/(1/s) = bits — but by convention we keep it as bits/s/Hz to remind us it is a rate density.</p>

<p><b>Result.</b> $$ \eta = \frac{R_b}{B} \quad \text{(bits/s/Hz)} $$ Combining with the earlier results, $\eta = \log_2 M / (\tfrac{1}{2}(1+\alpha))$ for an ideal link, and Shannon caps it at $\log_2(1+S/N)$. Sanity check: a system delivering 2 Mbit/s in 1 MHz has $\eta = 2$ bits/s/Hz — roughly what QPSK with modest roll-off achieves.</p>
`
  },

  'noise': {
    0: String.raw`
<p><b>Where we start.</b> Any resistor at temperature $T$ produces a fluctuating voltage across its terminals even with no applied source, because its charge carriers jitter with thermal energy. We derive the mean-square of this Johnson–Nyquist noise voltage.</p>

<p><b>Step 1 — Thermal energy per mode.</b> Statistical mechanics (equipartition) assigns an average energy of $kT$ to each electromagnetic mode in thermal equilibrium in the classical (low-frequency) limit, where $k=1.38\times10^{-23}$ J/K is Boltzmann's constant. Nyquist modeled the resistor as a source feeding a transmission line and counted the modes in bandwidth $B$.</p>

<p><b>Step 2 — Available noise power.</b> Nyquist's mode-counting gives the maximum noise power a resistor can deliver to a matched load, in bandwidth $B$:</p>
$$ N = kTB $$
<p>This is the power actually transferred when the load resistance equals the source resistance $R$ (the matched, "available power" condition).</p>

<p><b>Step 3 — Relate available power to the open-circuit voltage.</b> Model the noisy resistor as an ideal (noiseless) resistor $R$ in series with an rms noise voltage source $v_n$. Feeding a matched load $R$, the circuit is a voltage divider that halves the voltage, so the load sees $v_n/2$. The average power delivered to the load is</p>
$$ N = \frac{(v_{n}/2)^2_{\text{rms}}}{R} = \frac{\overline{v_n^2}}{4R} $$
<p>Here $\overline{v_n^2}$ is the mean-square open-circuit noise voltage.</p>

<p><b>Step 4 — Set the two expressions for $N$ equal.</b> Nyquist's power $kTB$ must equal the delivered power.</p>
$$ \frac{\overline{v_n^2}}{4R} = kTB $$
<p>Solve for the mean-square voltage.</p>

<p><b>Result.</b> $$ \overline{v_n^2} = 4kTRB $$ The noise voltage grows with temperature, resistance, and bandwidth — hotter, larger resistors measured over wider bands are noisier. The rms voltage is $\sqrt{4kTRB}$; for a $50\,\Omega$ resistor at $290$ K over $1$ Hz this is about $0.9$ nV, the classic "nanovolt-per-root-hertz" figure. Sanity check: a superconductor ($R\to0$) or absolute zero ($T\to0$) produces no thermal noise, as it must.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> We want the actual noise power a source resistor delivers to a receiver — the "available" thermal noise power — because this sets the receiver's input noise floor. We build it from the noise voltage just derived and the maximum-power-transfer condition.</p>

<p><b>Step 1 — Model the noisy resistor.</b> Represent the resistor as a noiseless resistance $R$ in series with an open-circuit noise voltage of mean-square value $\overline{v_n^2}=4kTRB$ (from Nyquist).</p>

<p><b>Step 2 — Match the load for maximum power transfer.</b> The most power any source can deliver goes to a load equal to its source resistance, $R_L=R$. The two equal resistors form a divider, so the load voltage is half the source voltage; its mean-square value is $\overline{v_n^2}/4$.</p>

<p><b>Step 3 — Compute the delivered power.</b> Power into $R_L=R$ is mean-square voltage across the load divided by $R$.</p>
$$ N = \frac{\overline{v_n^2}/4}{R} = \frac{4kTRB/4}{R} = \frac{kTRB}{R} $$
<p>The resistance $R$ cancels — the available noise power does not depend on the resistor's value, only on temperature and bandwidth.</p>

<p><b>Result.</b> $$ N = kTB $$ This is one of the most important numbers in RF engineering: the irreducible noise power a matched source dumps into a receiver. It is independent of $R$, which is why we can speak of a universal noise floor. Sanity check: at $T_0=290$ K over $1$ Hz, $N = 4\times10^{-21}$ W $= -174$ dBm — the value we use everywhere.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Engineers memorize "$-174$ dBm/Hz" as the thermal noise floor at room temperature. We derive that number from $N=kTB$ evaluated per hertz and referenced to a milliwatt.</p>

<p><b>Step 1 — Noise power spectral density.</b> Set the bandwidth to $1$ Hz in $N=kTB$. The noise power per hertz is</p>
$$ N_0 = kT_0 $$
<p>with $k=1.38\times10^{-23}$ J/K and the IEEE reference temperature $T_0=290$ K.</p>

<p><b>Step 2 — Evaluate the number in watts/Hz.</b></p>
$$ N_0 = (1.38\times10^{-23})(290) = 4.00\times10^{-21}\ \text{W/Hz} $$

<p><b>Step 3 — Convert to dBm/Hz.</b> "dBm" is decibels relative to $1$ mW $=10^{-3}$ W. We divide by $10^{-3}$ and take $10\log_{10}$.</p>
$$ N_0\big|_{dBm/Hz} = 10\log_{10}\!\left(\frac{kT_0}{10^{-3}}\right) = 10\log_{10}\!\left(\frac{4.00\times10^{-21}}{10^{-3}}\right) $$
<p>Simplify the argument: $4.00\times10^{-21}/10^{-3} = 4.00\times10^{-18}$.</p>
$$ = 10\log_{10}(4.00\times10^{-18}) = 10\,(\log_{10}4.00 - 18) = 10\,(0.602 - 18) = -173.98 $$

<p><b>Result.</b> $$ N_0\big|_{dBm/Hz} = 10\log_{10}\!\left(\frac{kT_0}{10^{-3}}\right) = -174\ \text{dBm/Hz} $$ Every receiver on Earth at room temperature starts from this floor. Sanity check: the value is negative and large in magnitude because a milliwatt is enormous compared with the $4\times10^{-21}$ W of thermal noise in a single hertz.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> The $-174$ dBm/Hz figure is per hertz. A real receiver has finite bandwidth $B$, so it collects noise from every hertz in the band. We scale the density up to the full bandwidth.</p>

<p><b>Step 1 — Total noise is density times bandwidth.</b> Because thermal noise is white (flat across frequency), the total noise power in bandwidth $B$ is the per-hertz density multiplied by the number of hertz.</p>
$$ N = N_0 \cdot B $$

<p><b>Step 2 — Convert the product to decibels.</b> A product becomes a sum of logs: $10\log_{10}(N_0 B) = 10\log_{10}N_0 + 10\log_{10}B$. The first term is the $-174$ dBm/Hz floor; the second is the "bandwidth penalty."</p>
$$ N_{dBm} = \underbrace{10\log_{10}\!\left(\tfrac{N_0}{10^{-3}}\right)}_{-174} + 10\log_{10}(B_{Hz}) $$

<p><b>Result.</b> $$ N_{dBm} = -174 + 10\log_{10}(B_{Hz}) $$ Every tenfold increase in bandwidth raises the noise floor by $10$ dB; doubling it raises the floor by $3$ dB. Sanity check: a $1$ MHz receiver has a floor of $-174 + 10\log_{10}(10^6) = -174 + 60 = -114$ dBm — the familiar sensitivity anchor for a 1 MHz channel.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> Besides thermal noise, current flowing across a potential barrier (a diode or transistor junction) is grainy: charge arrives in discrete electrons at random times. This is shot noise. We derive its mean-square current from the statistics of independent, random arrivals.</p>

<p><b>Step 1 — Model arrivals as a Poisson process.</b> Electrons crossing the junction arrive independently and randomly, so the number arriving in a time window follows Poisson statistics. A key property of a Poisson process is that the variance of the count equals its mean.</p>

<p><b>Step 2 — Relate current to arrival rate.</b> If electrons arrive at average rate $r$ (electrons/second), the DC current is charge per electron times rate, $I_{DC}=qr$, where $q=1.6\times10^{-19}$ C.</p>

<p><b>Step 3 — Fluctuation power spectral density.</b> For a Poisson stream of charge pulses, the current fluctuations are white, and Schottky's theorem gives a one-sided current-noise power spectral density that is flat.</p>
$$ S_i = 2qI_{DC}\quad(\text{A}^2/\text{Hz}) $$
<p>The factor of $2$ comes from converting the double-sided spectral density of the shot process to the one-sided density used for physical bandwidths (and equivalently from the variance-equals-mean property carried through the Fourier analysis of the pulse train).</p>

<p><b>Step 4 — Integrate over the measurement bandwidth.</b> The mean-square noise current measured in bandwidth $B$ is the flat density times $B$.</p>
$$ \overline{i_n^2} = S_i\,B = 2qI_{DC}B $$

<p><b>Result.</b> $$ \overline{i_n^2} = 2qI_{DC}B $$ Shot noise grows with the DC current itself — more current means more independent electrons and larger absolute fluctuations. Note it depends on $q$ (the discreteness of charge) but not on temperature. Sanity check: with no DC current ($I_{DC}=0$) there are no crossing electrons and hence no shot noise, as expected.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> It is often convenient to express a device's added noise as an <i>equivalent temperature</i>: the temperature a resistor would need in order to produce that much noise. We derive $T_e$ two ways — from a measured noise power, and from the noise factor $F$.</p>

<p><b>Step 1 — Noise power as an equivalent temperature.</b> Recall available thermal noise power is $N=kTB$. If a device adds noise power $N$ (referred to its input) in bandwidth $B$, we define the temperature that would generate exactly that power by inverting the relation.</p>
$$ N = kT_e B \;\Rightarrow\; T_e = \frac{N}{kB} $$

<p><b>Step 2 — Connect to the noise factor.</b> The noise factor $F$ is defined so that a device with source at reference temperature $T_0$ produces an output noise equal to the amplified input noise ($T_0$ worth) plus the device's own contribution ($T_e$ worth). Referred to the input, total effective input noise temperature is $T_0 + T_e$, and by definition $F$ is the ratio of total to source noise.</p>
$$ F = \frac{T_0 + T_e}{T_0} = 1 + \frac{T_e}{T_0} $$

<p><b>Step 3 — Solve for $T_e$.</b> Rearrange the last relation.</p>
$$ T_e = T_0(F-1) $$

<p><b>Result.</b> $$ T_e = \frac{N}{kB} = T_0(F-1) $$ Both faces of the same idea: the left expresses added noise directly from measured power; the right converts a catalog noise factor into an equivalent temperature. Sanity check: a noiseless device has $F=1$, giving $T_e=0$ — it adds no noise, so its equivalent temperature is absolute zero.</p>
`
  },

  'psd': {
    0: String.raw`
<p><b>Where we start.</b> A random signal like noise has infinite total energy but finite average <i>power</i>. We cannot Fourier-transform it directly (the integral diverges), so we define its power spectral density (PSD) as the average power per hertz, built from a truncated, finite piece of the signal.</p>

<p><b>Step 1 — Truncate the signal.</b> Take a window of length $T$ and define $x_T(t)$ equal to $x(t)$ for $|t|<T/2$ and zero elsewhere. This finite-energy piece has a well-defined Fourier transform $X_T(f)$.</p>

<p><b>Step 2 — Energy of the truncated piece (Parseval).</b> Parseval's theorem says the total energy equals the integral of $|X_T(f)|^2$ over frequency, so $|X_T(f)|^2$ is the <i>energy spectral density</i> of the window.</p>
$$ \int_{-\infty}^{\infty}|x_T(t)|^2\,dt = \int_{-\infty}^{\infty}|X_T(f)|^2\,df $$

<p><b>Step 3 — Convert energy to power.</b> Power is energy divided by the observation time. Dividing the energy spectral density by $T$ gives a power-per-hertz for the window.</p>
$$ \frac{1}{T}|X_T(f)|^2 $$

<p><b>Step 4 — Average and take the limit.</b> For a random process we average over the ensemble (the expectation $E[\cdot]$), then let the window grow without bound so the estimate settles to its true value.</p>

<p><b>Result.</b> $$ S_x(f) = \lim_{T\to\infty}\frac{1}{T}E\big[|X_T(f)|^2\big] $$ This "periodogram" definition says the PSD is the long-run average power in each hertz. Sanity check: it is real and non-negative (it is an averaged magnitude-squared), exactly as any density of power must be.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> The Wiener–Khinchin theorem is the bridge between the time domain and the frequency domain for random signals: it says the PSD is the Fourier transform of the autocorrelation function $R_x(\tau)=E[x(t)x(t+\tau)]$. We derive it from the periodogram definition.</p>

<p><b>Step 1 — Write the periodogram out.</b> Start from $S_x(f)=\lim_{T\to\infty}\frac{1}{T}E[|X_T(f)|^2]$. Expand $|X_T(f)|^2 = X_T(f)X_T^*(f)$ as a double integral over two time variables $t_1,t_2$.</p>
$$ |X_T(f)|^2 = \int\!\!\int x_T(t_1)x_T(t_2)\,e^{-j2\pi f(t_1-t_2)}\,dt_1\,dt_2 $$

<p><b>Step 2 — Take the expectation inside.</b> Expectation and integration exchange, and $E[x(t_1)x(t_2)]=R_x(t_1-t_2)$ for a stationary process — it depends only on the time difference.</p>
$$ E[|X_T(f)|^2] = \int\!\!\int R_x(t_1-t_2)\,e^{-j2\pi f(t_1-t_2)}\,dt_1\,dt_2 $$

<p><b>Step 3 — Change variables.</b> Let $\tau=t_1-t_2$. Holding $\tau$ fixed and integrating over the remaining time variable contributes a factor of the overlap length, which over a window of length $T$ gives approximately $T$ for each $\tau$ (the triangular window factor $\to 1$ as $T\to\infty$).</p>
$$ E[|X_T(f)|^2] \approx T\int_{-\infty}^{\infty} R_x(\tau)\,e^{-j2\pi f\tau}\,d\tau $$

<p><b>Step 4 — Divide by $T$ and take the limit.</b> The factor $T$ cancels the $1/T$ in the periodogram, leaving a single Fourier integral.</p>

<p><b>Result.</b> $$ S_x(f) = \int_{-\infty}^{\infty} R_x(\tau)e^{-j2\pi f\tau}d\tau $$ The PSD and the autocorrelation are a Fourier-transform pair. Sanity check: a rapidly decorrelating (narrow $R_x$) process has a broad spectrum, while a slowly decorrelating (wide $R_x$) process is narrowband — the classic time–frequency reciprocity.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> We want the total average power of a random signal. There are two natural routes — integrate the PSD over all frequency, or evaluate the autocorrelation at zero lag — and Wiener–Khinchin guarantees they agree.</p>

<p><b>Step 1 — Invert the Wiener–Khinchin transform.</b> Since $S_x(f)$ is the Fourier transform of $R_x(\tau)$, the inverse transform recovers the autocorrelation.</p>
$$ R_x(\tau) = \int_{-\infty}^{\infty} S_x(f)\,e^{+j2\pi f\tau}\,df $$

<p><b>Step 2 — Evaluate at zero lag.</b> Set $\tau=0$, so the exponential becomes $e^0=1$.</p>
$$ R_x(0) = \int_{-\infty}^{\infty} S_x(f)\,df $$

<p><b>Step 3 — Interpret $R_x(0)$ as power.</b> By definition $R_x(\tau)=E[x(t)x(t+\tau)]$, so at zero lag $R_x(0)=E[x^2(t)]$ — the mean-square value, which for a zero-mean signal is precisely its average power.</p>

<p><b>Result.</b> $$ P = \int_{-\infty}^{\infty} S_x(f)\,df = R_x(0) $$ Total power is the area under the PSD, and equivalently the signal's mean-square value. Sanity check: since $S_x(f)\ge0$ everywhere, the integral (total power) is non-negative — power can never be negative.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> When a random signal passes through a linear time-invariant (LTI) filter with transfer function $H(f)$, we want the output PSD. We derive it from how the filter reshapes each frequency component.</p>

<p><b>Step 1 — The filter scales each frequency component.</b> An LTI system multiplies the input spectrum by $H(f)$: a sinusoid at frequency $f$ comes out scaled in amplitude by $|H(f)|$ and shifted in phase by $\angle H(f)$.</p>

<p><b>Step 2 — Power scales as amplitude squared.</b> Power (and hence power spectral density) depends on amplitude squared. Since the amplitude at frequency $f$ is multiplied by $|H(f)|$, the power per hertz at that frequency is multiplied by $|H(f)|^2$. Phase does not affect power.</p>
$$ S_y(f) = |H(f)|^2\,S_x(f) $$

<p><b>Step 3 — Confirm with the periodogram.</b> The output truncated transform is $Y_T(f)=H(f)X_T(f)$, so $|Y_T(f)|^2=|H(f)|^2|X_T(f)|^2$. Taking expectations, dividing by $T$, and letting $T\to\infty$ reproduces the same relation.</p>

<p><b>Result.</b> $$ S_y(f) = |H(f)|^2 S_x(f) $$ The filter shapes the noise spectrum by its magnitude-squared response. Sanity check: feeding white noise ($S_x=N_0/2$, flat) through a filter gives an output whose spectrum simply traces $|H(f)|^2$ — which is exactly how we measure a filter's response using a noise source.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> Real filters have gentle, sloping edges, so "the bandwidth" is ambiguous. The <i>equivalent noise bandwidth</i> $B_N$ is the width of an ideal brick-wall filter — with the same peak gain — that would pass exactly the same amount of white noise power. We derive it by matching noise powers.</p>

<p><b>Step 1 — Noise through the real filter.</b> Pass white noise of flat PSD $S_0$ through a filter $H(f)$. Using the LTI rule, the output PSD is $S_0|H(f)|^2$, and the total output noise power is its integral. Using one-sided (positive) frequencies:</p>
$$ N_{real} = S_0\int_0^{\infty}|H(f)|^2\,df $$

<p><b>Step 2 — Noise through the equivalent brick-wall filter.</b> Define an ideal filter with constant gain equal to the real filter's peak $|H(f_0)|$ over a band of width $B_N$, and zero elsewhere. Its output noise power is the flat density times peak-gain-squared times the bandwidth.</p>
$$ N_{ideal} = S_0\,|H(f_0)|^2\,B_N $$

<p><b>Step 3 — Match the two powers.</b> Require $N_{ideal}=N_{real}$ so the brick-wall filter passes the same noise.</p>
$$ S_0\,|H(f_0)|^2\,B_N = S_0\int_0^{\infty}|H(f)|^2\,df $$
<p>Cancel $S_0$ and solve for $B_N$.</p>

<p><b>Result.</b> $$ B_N = \frac{1}{|H(f_0)|^2}\int_0^{\infty}|H(f)|^2\,df $$ $B_N$ lets us use the simple formula $N=S_0 B_N$ even for filters with curved skirts. Sanity check: for a first-order RC low-pass with $-3$ dB bandwidth $f_c$, this integral gives $B_N=\tfrac{\pi}{2}f_c\approx 1.57 f_c$ — the noise bandwidth is a bit wider than the $-3$ dB bandwidth because the skirts still pass noise.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> A random binary (NRZ) data stream — independent $\pm A$ levels each lasting $T_b$ seconds — is the workhorse baseband signal. We derive its PSD from the pulse shape and the randomness of the bits, via Wiener–Khinchin.</p>

<p><b>Step 1 — Autocorrelation of the random NRZ waveform.</b> For independent, equiprobable $\pm A$ bits held for $T_b$ each, the waveform correlates with itself only within one bit interval; beyond a lag of $T_b$ the bits are independent and (zero-mean) the correlation vanishes. The result is a triangular autocorrelation of height $A^2$ and base $\pm T_b$.</p>
$$ R_x(\tau) = A^2\left(1-\frac{|\tau|}{T_b}\right),\quad |\tau|\le T_b,\ \text{else }0 $$

<p><b>Step 2 — Fourier transform the triangle.</b> Wiener–Khinchin says $S_x(f)$ is the Fourier transform of $R_x(\tau)$. A triangular function of base $\pm T_b$ and height $A^2$ transforms to a squared-sinc.</p>
$$ S_x(f) = \int_{-T_b}^{T_b} A^2\left(1-\frac{|\tau|}{T_b}\right)e^{-j2\pi f\tau}\,d\tau $$

<p><b>Step 3 — Evaluate the integral.</b> The transform of a unit-height triangle of half-width $T_b$ is $T_b\,\mathrm{sinc}^2(fT_b)$ (with $\mathrm{sinc}(x)=\sin(\pi x)/(\pi x)$). Carrying the amplitude $A^2$ through gives</p>
$$ S_x(f) = A^2 T_b\,\mathrm{sinc}^2(fT_b) $$

<p><b>Result.</b> $$ S_x(f) = A^2 T_b\,\mathrm{sinc}^2(fT_b) $$ The spectrum is a $\mathrm{sinc}^2$ lobe with first nulls at $f=\pm1/T_b$; most power sits in the main lobe of width $1/T_b$, which is why faster data (smaller $T_b$) needs proportionally more bandwidth. Sanity check: integrating $S_x(f)$ over all $f$ returns $A^2$, the mean-square value of a $\pm A$ signal — total power is conserved.</p>
`
  },

  'noise-floor': {
    0: String.raw`
<p><b>Where we start.</b> The <i>effective</i> noise floor is the total noise a receiver presents, referred to its input: the fundamental thermal floor raised by the receiver's own added noise. We assemble it from the thermal floor plus the noise figure.</p>

<p><b>Step 1 — Thermal floor in the band.</b> From thermal-noise theory, the noise power in bandwidth $B$ at room temperature is $-174 + 10\log_{10}(B)$ dBm. This is what an ideal (noiseless) receiver would see.</p>
$$ N_{thermal} = -174 + 10\log_{10}(B)\ [\text{dBm}] $$

<p><b>Step 2 — Add the receiver's own noise.</b> A real receiver degrades the signal-to-noise ratio; its noise figure $NF$ (in dB) is exactly the amount, in dB, by which it raises the effective input noise above the thermal floor. Adding noise in dB terms is a simple sum.</p>
$$ N_{floor} = N_{thermal} + NF $$

<p><b>Result.</b> $$ N_{floor} = -174 + 10\log_{10}(B) + NF \ [\text{dBm}] $$ Three ingredients: the universal thermal floor, the bandwidth penalty, and the hardware's added noise. Sanity check: a $1$ MHz receiver with a $3$ dB noise figure has a floor of $-174 + 60 + 3 = -111$ dBm — the reference against which we judge weak signals.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Sensitivity is the weakest signal a receiver can demodulate acceptably. A signal is usable only if it stands a required amount above the noise floor. We add that required margin to the effective noise floor.</p>

<p><b>Step 1 — Start from the noise floor.</b> The effective noise floor referred to the input is $-174 + 10\log_{10}(B) + NF$ dBm (from the previous result).</p>

<p><b>Step 2 — Demand a minimum SNR.</b> Reliable demodulation of a given modulation and coding scheme requires the signal to exceed the noise by some minimum signal-to-noise ratio $\mathrm{SNR}_{min}$ (dB). The minimum detectable signal is therefore the floor plus this margin.</p>
$$ S_{min} = N_{floor} + \mathrm{SNR}_{min} $$

<p><b>Step 3 — Substitute the floor.</b></p>
$$ S_{min} = -174 + 10\log_{10}(B) + NF + \mathrm{SNR}_{min} $$

<p><b>Result.</b> $$ S_{min} = -174 + 10\log_{10}(B) + NF + \mathrm{SNR}_{min} $$ To improve sensitivity (make $S_{min}$ more negative) you reduce bandwidth, lower the noise figure, or use a modulation/coding scheme that needs less SNR. Sanity check: a $1$ MHz, $3$ dB-NF receiver needing $10$ dB SNR has $S_{min} = -174+60+3+10 = -101$ dBm — a typical narrowband sensitivity figure.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> For a full receiving system (e.g. an antenna pointed at the sky feeding a receiver), the total noise temperature combines what the antenna picks up from the environment with the electronics' own added noise. We add the two contributions.</p>

<p><b>Step 1 — Antenna noise temperature.</b> The antenna delivers noise power from whatever it "sees" — sky, ground, atmosphere — characterized by an antenna noise temperature $T_A$, defined so the delivered noise power is $kT_A B$.</p>

<p><b>Step 2 — Receiver's equivalent noise temperature.</b> The receiver electronics add their own noise, expressed as an equivalent input noise temperature $T_e = T_0(F-1)$, where $F$ is the receiver noise factor and $T_0=290$ K (from noise-temperature theory).</p>

<p><b>Step 3 — Add the independent noise sources.</b> Antenna noise and receiver noise are physically independent, so their powers (and hence their equivalent temperatures at the same reference point) add directly.</p>
$$ T_{sys} = T_A + T_e $$

<p><b>Step 4 — Substitute $T_e$.</b></p>
$$ T_{sys} = T_A + T_0(F-1) $$

<p><b>Result.</b> $$ T_{sys} = T_A + T_e = T_A + T_0(F-1) $$ The system noise power is then $N=kT_{sys}B$, and the figure of merit for a receiving system is $G/T_{sys}$. Sanity check: a very cold sky ($T_A$ small) reveals the receiver's own noise, which is why deep-space and radio-astronomy front-ends are cryogenically cooled to shrink $T_e$.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> An ideal analog-to-digital converter rounds each sample to the nearest of $2^N$ levels, injecting a small quantization error. We derive the best-case signal-to-quantization-noise ratio for a full-scale sinusoid.</p>

<p><b>Step 1 — Quantization step size.</b> An $N$-bit ADC with full-scale range $V_{FS}$ divides that range into $2^N$ equal steps, each of width</p>
$$ \Delta = \frac{V_{FS}}{2^N} $$

<p><b>Step 2 — Quantization noise power.</b> The rounding error is uniformly distributed over $\pm\Delta/2$. The mean-square (power) of a uniform distribution of width $\Delta$ is $\Delta^2/12$.</p>
$$ N_q = \frac{\Delta^2}{12} $$

<p><b>Step 3 — Signal power of a full-scale sinusoid.</b> A sine wave filling the full scale has amplitude $V_{FS}/2$, so its power is $\tfrac{1}{2}(V_{FS}/2)^2 = V_{FS}^2/8$.</p>
$$ S = \frac{V_{FS}^2}{8} = \frac{(2^N\Delta)^2}{8} = \frac{2^{2N}\Delta^2}{8} $$

<p><b>Step 4 — Form the SNR.</b> Divide signal power by quantization-noise power.</p>
$$ \mathrm{SNR} = \frac{S}{N_q} = \frac{2^{2N}\Delta^2/8}{\Delta^2/12} = \frac{12}{8}\,2^{2N} = \frac{3}{2}\,2^{2N} $$

<p><b>Step 5 — Convert to decibels.</b></p>
$$ \mathrm{SNR}_{dB} = 10\log_{10}\!\left(\tfrac{3}{2}\right) + 10\log_{10}(2^{2N}) = 1.76 + 2N(10\log_{10}2) = 1.76 + 6.02N $$

<p><b>Result.</b> $$ \mathrm{SNR} = 6.02N + 1.76 \ \text{dB} $$ Every extra bit buys $6.02$ dB of dynamic range — the cornerstone rule of data-converter design. Sanity check: a $12$-bit ADC gives $6.02(12)+1.76 \approx 74$ dB, matching datasheet ideal SNR figures.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> Sampling much faster than strictly necessary ("oversampling") spreads the fixed quantization noise over a wider frequency span; after digital filtering back to the signal band, most of that noise is thrown away, improving in-band SNR. We derive the processing gain.</p>

<p><b>Step 1 — Total quantization noise is fixed.</b> An ADC's total quantization noise power $N_q=\Delta^2/12$ is set by the bit depth alone. Crucially, it is spread <i>uniformly</i> across the entire Nyquist band, from $0$ to $f_s/2$.</p>

<p><b>Step 2 — Noise density falls as sampling rate rises.</b> Spread over a wider band $f_s/2$, the quantization-noise power spectral density is</p>
$$ \text{noise density} = \frac{N_q}{f_s/2} $$
<p>Doubling $f_s$ halves the density — same total noise, thinner spread.</p>

<p><b>Step 3 — Keep only the in-band noise.</b> A digital low-pass filter keeps the signal band of width $B$ and discards the rest. The surviving in-band noise is the density times $B$.</p>
$$ N_{in} = \frac{N_q}{f_s/2}\,B = \frac{N_q}{\mathrm{OSR}} $$
<p>where the oversampling ratio is $\mathrm{OSR}=\dfrac{f_s/2}{B}$.</p>

<p><b>Step 4 — Improvement in SNR.</b> The in-band noise is reduced by the factor $\mathrm{OSR}$, so the SNR improves by the same factor. In decibels:</p>
$$ \Delta\mathrm{SNR} = 10\log_{10}(\mathrm{OSR}) $$

<p><b>Result.</b> $$ \Delta\mathrm{SNR} = 10\log_{10}(\mathrm{OSR}) $$ Every 4× in oversampling recovers about $6$ dB — one extra effective bit — without changing the hardware bit depth. Sanity check: oversampling by $4\times$ gives $10\log_{10}4 \approx 6$ dB, i.e. one bit; this is the (unshaped) basis that delta-sigma modulators amplify further with noise shaping.</p>
`
  },

  'noise-figure': {
    0: String.raw`
<p><b>Where we start.</b> We need a single number that captures how much a component corrupts a signal by adding its own noise. The noise factor $F$ is defined as the degradation in signal-to-noise ratio from input to output, with the source at the standard temperature $T_0=290$ K.</p>

<p><b>Step 1 — Compare SNR in and out.</b> A perfect (noiseless) amplifier scales signal and noise together, leaving SNR unchanged. A real device adds noise, so the output SNR is worse than the input SNR. The ratio of the two quantifies the damage.</p>
$$ F = \frac{\mathrm{SNR}_{in}}{\mathrm{SNR}_{out}} $$

<p><b>Step 2 — Fix the source temperature.</b> The input noise itself depends on the source temperature, so $F$ is only well-defined once we fix it. The IEEE convention pins the source at $T_{src}=T_0=290$ K, standardizing the comparison across all devices.</p>
$$ F = \frac{\mathrm{SNR}_{in}}{\mathrm{SNR}_{out}}\bigg|_{T_{src}=290\,\text{K}} $$

<p><b>Result.</b> $$ F = \frac{\mathrm{SNR}_{in}}{\mathrm{SNR}_{out}} \Big|_{T_{src}=290\,\text{K}} $$ Because the output SNR is always $\le$ input SNR, $F\ge1$; in decibels the noise figure is $NF=10\log_{10}F \ge 0$. Sanity check: a hypothetical noiseless device leaves SNR untouched, giving $F=1$ ($NF=0$ dB) — the ideal floor no real component can beat.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Noise factor $F$ and equivalent noise temperature $T_e$ are two languages for the same added noise. We derive the conversion by writing the output SNR explicitly in terms of the noise the device adds.</p>

<p><b>Step 1 — Input SNR.</b> With the source at $T_0$, the input noise power is $kT_0B$. For signal power $S_{in}$,</p>
$$ \mathrm{SNR}_{in} = \frac{S_{in}}{kT_0 B} $$

<p><b>Step 2 — Output SNR.</b> The device has gain $G$. It amplifies the input noise to $GkT_0B$ and adds its own noise, which we model as $GkT_eB$ (its input-referred noise $kT_eB$ amplified by $G$). The signal becomes $GS_{in}$.</p>
$$ \mathrm{SNR}_{out} = \frac{GS_{in}}{GkT_0B + GkT_eB} = \frac{S_{in}}{k(T_0+T_e)B} $$
<p>The gain $G$ cancels — SNR degradation is independent of gain.</p>

<p><b>Step 3 — Form the noise factor.</b> Divide input SNR by output SNR.</p>
$$ F = \frac{\mathrm{SNR}_{in}}{\mathrm{SNR}_{out}} = \frac{S_{in}/(kT_0B)}{S_{in}/(k(T_0+T_e)B)} = \frac{T_0+T_e}{T_0} $$

<p><b>Step 4 — Simplify.</b></p>
$$ F = 1 + \frac{T_e}{T_0} $$

<p><b>Result.</b> $$ F = 1 + \frac{T_e}{T_0} $$ Add noise temperature to the reference and normalize — that is all a noise factor is. Sanity check: $T_e=0$ (noiseless) gives $F=1$; and $T_e=T_0$ gives $F=2$, i.e. $NF=3$ dB, the classic "device as noisy as the source."</p>
`,
    2: String.raw`
<p><b>Where we start.</b> A passive lossy element — a cable, attenuator, or filter — at physical temperature $T_0$ has a beautifully simple noise figure: it equals its loss. We derive this from thermodynamic equilibrium.</p>

<p><b>Step 1 — Define loss.</b> A passive component with loss factor $L>1$ attenuates power by $L$, so its gain is $G=1/L$. Both signal and incoming noise are attenuated by this same factor.</p>

<p><b>Step 2 — The output must be in thermal equilibrium.</b> Here is the key physical insight: a passive attenuator sitting at temperature $T_0$, fed by a matched source at $T_0$, is a closed system in thermal equilibrium. By the second law, its output noise power must still correspond to temperature $T_0$ — it cannot spontaneously become hotter or colder. So the output noise is $kT_0B$.</p>

<p><b>Step 3 — Track signal and noise through the loss.</b> The input SNR is $\mathrm{SNR}_{in}=S_{in}/(kT_0B)$. The output signal is $S_{in}/L$, while the output noise remains $kT_0B$ (from equilibrium). Hence</p>
$$ \mathrm{SNR}_{out} = \frac{S_{in}/L}{kT_0B} = \frac{1}{L}\,\mathrm{SNR}_{in} $$

<p><b>Step 4 — Form the noise factor.</b></p>
$$ F = \frac{\mathrm{SNR}_{in}}{\mathrm{SNR}_{out}} = L $$
<p>In decibels, $NF_{dB} = 10\log_{10}L = \text{Loss}_{dB}$.</p>

<p><b>Result.</b> $$ F = L\ (\text{linear}), \quad NF_{dB} = \text{Loss}_{dB} $$ A $3$ dB attenuator has a $3$ dB noise figure; $6$ dB of cable loss is $6$ dB of noise figure. Sanity check: this is why lossy cable <i>before</i> the LNA is so damaging — every dB of front-end loss adds directly to the system noise figure.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> A receiver is a chain of stages. We want the overall noise factor of the cascade. The Friis formula shows that later stages matter less because the first stage's gain "lifts" the signal above their noise. We derive it by referring every stage's added noise back to the input.</p>

<p><b>Step 1 — Referring noise to the input.</b> Each stage $i$ adds input-referred noise $ (F_i-1)kT_0B$ (its noise beyond the source). When we refer a later stage's added noise all the way back to the system input, we must divide by the total gain of all stages preceding it, because that gain amplifies the signal (and any noise added at the input) on its way to that stage.</p>

<p><b>Step 2 — Total input-referred noise.</b> Stage 1 contributes its full added noise $(F_1-1)kT_0B$. Stage 2's added noise, referred to the input, is divided by $G_1$. Stage 3's is divided by $G_1G_2$, and so on. Add the source noise $kT_0B$ to get the total effective input noise:</p>
$$ N_{in,eff} = kT_0B\left[1 + (F_1-1) + \frac{F_2-1}{G_1} + \frac{F_3-1}{G_1G_2} + \cdots\right] $$

<p><b>Step 3 — Divide by source noise to get $F_{total}$.</b> By definition $F_{total} = N_{in,eff}/(kT_0B)$, so we divide the bracket by the $1$ from the source.</p>
$$ F_{total} = 1 + (F_1-1) + \frac{F_2-1}{G_1} + \frac{F_3-1}{G_1G_2} + \cdots $$
<p>Combine the leading $1+(F_1-1)=F_1$.</p>

<p><b>Result.</b> $$ F_{total} = F_1 + \frac{F_2-1}{G_1} + \frac{F_3-1}{G_1G_2} + \cdots $$ The first stage's noise factor enters undiminished; every later stage is suppressed by the cumulative gain ahead of it. Sanity check: this is precisely why a low-noise amplifier goes <i>first</i> with high gain $G_1$ — it makes the $F_2,F_3,\dots$ terms negligible, so the whole receiver inherits the LNA's low noise figure.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> The Y-factor method measures a device's noise temperature by observing its output with a calibrated noise source switched between a "hot" and a "cold" state. We derive $T_e$ from the ratio of the two output powers.</p>

<p><b>Step 1 — Output power in each state.</b> With the source at temperature $T$, the device (gain $G$, bandwidth $B$, own noise temperature $T_e$) outputs noise power $P = Gk(T+T_e)B$. Write this for the hot source ($T_h$) and the cold source ($T_c$).</p>
$$ P_{hot} = Gk(T_h+T_e)B, \qquad P_{cold} = Gk(T_c+T_e)B $$

<p><b>Step 2 — Take the ratio (the Y-factor).</b> Divide the two. The common factor $GkB$ cancels — a great advantage, since we never need to know the absolute gain.</p>
$$ Y = \frac{P_{hot}}{P_{cold}} = \frac{T_h + T_e}{T_c + T_e} $$

<p><b>Step 3 — Solve for $T_e$.</b> Cross-multiply: $Y(T_c+T_e) = T_h+T_e$. Expand and gather the $T_e$ terms.</p>
$$ YT_c + YT_e = T_h + T_e \;\Rightarrow\; T_e(Y-1) = T_h - YT_c $$
<p>Divide by $(Y-1)$.</p>

<p><b>Result.</b> $$ T_e = \frac{T_h - Y\,T_c}{Y-1}, \quad Y=\frac{P_{hot}}{P_{cold}} $$ A purely relative power measurement (a ratio) yields the absolute noise temperature — no gain calibration required. Sanity check: a noiseless device ($T_e=0$) gives $Y=T_h/T_c$, the largest possible ratio; a very noisy device ($T_e\to\infty$) drives $Y\to1$, since its own huge noise swamps the small hot/cold difference.</p>
`
  },

  'phase-noise': {
    0: String.raw`
<p><b>Where we start.</b> A real oscillator is not a pure tone; its spectrum has "skirts" of noise around the carrier. Single-sideband phase noise $\mathcal{L}(f)$ measures how far down those skirts sit, per hertz, at an offset $f$ from the carrier. We define it as a normalized power ratio.</p>

<p><b>Step 1 — Measure the noise power in a 1 Hz slice.</b> At an offset frequency $f$ from the carrier $f_0$, measure the noise power contained in a $1$ Hz bandwidth on one side (single sideband) of the carrier: $P_{SSB}(f_0+f,\,1\text{Hz})$.</p>

<p><b>Step 2 — Normalize by the carrier power.</b> To make the figure independent of absolute power level, divide the sideband noise density by the total carrier power $P_{carrier}$. This ratio says "how big is the noise, relative to the carrier."</p>
$$ \frac{P_{SSB}(f_0+f,\,1\text{Hz})}{P_{carrier}} $$

<p><b>Step 3 — Express in decibels relative to the carrier.</b> The ratio is tiny, so we take $10\log_{10}$; the resulting units are dBc/Hz ("decibels relative to carrier, per hertz").</p>

<p><b>Result.</b> $$ \mathcal{L}(f) = 10\log_{10}\!\left(\frac{P_{SSB}(f_0+f,\,1\text{Hz})}{P_{carrier}}\right) $$ A good oscillator might show $\mathcal{L}(10\text{kHz}) = -110$ dBc/Hz — the noise $10$ kHz away is $110$ dB below the carrier in each hertz. Sanity check: it is always negative (noise is far below the carrier) and grows more negative as $f$ increases, since the skirts fall off away from the carrier.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Phase noise $\mathcal{L}(f)$ (from the sideband power) and the phase-fluctuation PSD $S_\phi(f)$ (the spectrum of the phase jitter itself) are closely related. We derive the factor of one-half connecting them, valid in the small-angle regime.</p>

<p><b>Step 1 — Model the phase-modulated carrier.</b> A carrier with small random phase fluctuation $\phi(t)$ is $v(t)=A\cos(2\pi f_0 t + \phi(t))$. For small $\phi$, use $\cos(x+\phi)\approx\cos x - \phi\sin x$.</p>
$$ v(t) \approx A\cos(2\pi f_0 t) - A\phi(t)\sin(2\pi f_0 t) $$
<p>The first term is the pure carrier; the second is the noise, a copy of $\phi(t)$ riding on a quadrature carrier.</p>

<p><b>Step 2 — Spectrum of the noise term.</b> Multiplying $\phi(t)$ by $\sin(2\pi f_0 t)$ shifts $\phi$'s spectrum up to the carrier. The resulting noise spectrum around $f_0$ has total (double-sideband) PSD $S_\phi(f)$ scaled by the carrier — split symmetrically into an upper and a lower sideband.</p>

<p><b>Step 3 — Take just one sideband.</b> $\mathcal{L}(f)$ is defined on a <i>single</i> sideband, so it captures half of the symmetric phase-noise power. Hence the single-sideband quantity is half the total phase PSD.</p>
$$ \mathcal{L}(f) = \tfrac{1}{2}\,S_\phi(f) $$

<p><b>Result.</b> $$ \mathcal{L}(f) = \tfrac{1}{2}\,S_\phi(f) $$ (a ratio here, before taking logs). The factor $\tfrac{1}{2}$ is simply because $\mathcal{L}$ counts one of the two symmetric sidebands. Sanity check: this holds only while $\phi_{rms}\ll1$ rad (the small-angle approximation); for large phase excursions the simple linear split breaks down.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Leeson's equation is the engineer's model for an oscillator's phase-noise spectrum. We build it from three physical ingredients: the thermal noise floor of the sustaining amplifier, the resonator's filtering action, and the up-converted flicker (1/f) noise.</p>

<p><b>Step 1 — Amplifier noise floor.</b> The sustaining amplifier (noise factor $F$, at temperature $T$) injects noise into a signal of power $P_s$. The noise-to-signal density at the amplifier input is $FkT/P_s$. Split into two sidebands, the single-sideband phase-noise floor is half of this.</p>
$$ \mathcal{L}_{floor} = \frac{FkT}{2P_s} $$

<p><b>Step 2 — The resonator converts amplitude noise into phase noise near the carrier.</b> Inside the feedback loop, the resonator (loaded quality factor $Q_L$) has a phase slope that transforms the flat noise floor into a $1/f^2$ rise close to the carrier. The half-bandwidth of the resonator is $f_0/(2Q_L)$, and the transfer gives a multiplicative factor</p>
$$ 1 + \left(\frac{f_0}{2Q_L f}\right)^{2} $$
<p>For offsets $f$ inside the resonator half-bandwidth, this term dominates and produces the characteristic $1/f^2$ slope; outside it, the term $\to1$ and we are left with the flat floor.</p>

<p><b>Step 3 — Flicker (1/f) noise up-conversion.</b> Device flicker noise, with corner frequency $f_c$, modulates the oscillator and adds a $1/f$ contribution close in. This multiplies the spectrum by</p>
$$ 1 + \frac{f_c}{f} $$

<p><b>Step 4 — Combine and take the log.</b> Multiply the floor by both shaping factors and express in dBc/Hz.</p>

<p><b>Result.</b> $$ \mathcal{L}(f) = 10\log_{10}\!\left[\frac{FkT}{2P_s}\!\left(1+\!\left(\frac{f_0}{2Q_L f}\right)^{\!2}\right)\!\left(1+\frac{f_c}{f}\right)\right] $$ The spectrum shows regions of slope $1/f^3$ (flicker $\times$ resonator), then $1/f^2$ (resonator), then flat (thermal floor) as $f$ increases. Sanity check: raising the loaded $Q_L$ or the signal power $P_s$ lowers phase noise everywhere — which is exactly why high-$Q$ resonators and high drive levels make quiet oscillators.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> We often need a single number — the total rms phase error in radians — rather than a whole spectrum. We get it by integrating the phase-noise density over the offset band of interest.</p>

<p><b>Step 1 — Relate $\mathcal{L}(f)$ to the phase PSD.</b> From the earlier relation, the (single-sideband) $\mathcal{L}(f)$ is half of the phase PSD $S_\phi(f)$, so $S_\phi(f) = 2\mathcal{L}(f)$ (both as linear ratios per hertz).</p>

<p><b>Step 2 — Integrate the PSD to get variance.</b> The total phase variance is the area under the (one-sided) phase PSD over the band from $f_1$ to $f_2$.</p>
$$ \phi_{rms}^2 = \int_{f_1}^{f_2} S_\phi(f)\,df = \int_{f_1}^{f_2} 2\mathcal{L}(f)\,df = 2\int_{f_1}^{f_2}\mathcal{L}(f)\,df $$
<p>Here $\mathcal{L}(f)$ must be the linear ratio (not the dB value) inside the integral.</p>

<p><b>Step 3 — Take the square root.</b> The rms is the square root of the variance.</p>

<p><b>Result.</b> $$ \phi_{rms} = \sqrt{2\int_{f_1}^{f_2}\mathcal{L}(f)\,df}\ \ \text{(rad)} $$ Widening the integration limits (or a higher noise floor) increases the accumulated jitter. Sanity check: the factor of $2$ is exactly the "two sidebands" bookkeeping — integrating both sides of the carrier — reversing the $\tfrac{1}{2}$ that defined $\mathcal{L}$.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> Phase jitter and timing jitter are the same physical error viewed differently: an uncertainty in phase is an uncertainty in <i>when</i> the waveform crosses zero. We convert rms phase (radians) to rms time (seconds).</p>

<p><b>Step 1 — Phase advances linearly with time.</b> For a tone at frequency $f_0$, the phase is $\theta(t)=2\pi f_0 t$. One full cycle ($2\pi$ radians) takes one period $1/f_0$ seconds, so the phase-to-time conversion rate is $2\pi f_0$ radians per second.</p>

<p><b>Step 2 — Convert a phase error to a time error.</b> A small phase error $\phi_{rms}$ corresponds to the time shift that would produce it. Divide the phase error by the rate at which phase accumulates.</p>
$$ t_{jitter} = \frac{\phi_{rms}\ (\text{rad})}{2\pi f_0\ (\text{rad/s})} $$

<p><b>Result.</b> $$ t_{jitter} = \frac{\phi_{rms}}{2\pi f_0} $$ For a fixed phase error, higher carrier frequency means smaller timing jitter, because each radian of phase spans less time. Sanity check: $\phi_{rms}=0.01$ rad on a $1$ GHz clock gives $t_{jitter} = 0.01/(2\pi\times10^9) \approx 1.6$ ps; a much smaller phase error of $\phi_{rms}=10^{-5}$ rad would give $\approx 1.6$ fs — the femtosecond jitter figures quoted for good clock sources.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Dividing an oscillator's frequency by $N$ (a common step in synthesizers) also divides its phase, which reduces phase noise. We derive the $20\log_{10}(N)$ improvement from how division scales phase.</p>

<p><b>Step 1 — Division scales phase by $1/N$.</b> A frequency divider by $N$ produces one output cycle for every $N$ input cycles. The instantaneous output phase is the input phase divided by $N$, so any phase fluctuation is also scaled by $1/N$.</p>
$$ \phi_{out}(t) = \frac{\phi_{in}(t)}{N} $$

<p><b>Step 2 — Power scales as the square of the phase.</b> Phase-noise power spectral density is proportional to the mean-square phase, $S_\phi \propto \phi^2$. Since phase is scaled by $1/N$, its power is scaled by $1/N^2$.</p>
$$ S_{\phi,out}(f) = \frac{1}{N^2}\,S_{\phi,in}(f) $$

<p><b>Step 3 — Express the reduction in decibels.</b> A factor $1/N^2$ in power is $10\log_{10}(1/N^2) = -20\log_{10}(N)$ dB — a reduction of $20\log_{10}(N)$ dB.</p>

<p><b>Result.</b> $$ \Delta\mathcal{L} = 20\log_{10}(N)\ \text{dB (improvement)} $$ Dividing by $2$ improves phase noise by $6$ dB; by $10$, a full $20$ dB. Sanity check: the mirror image is frequency <i>multiplication</i> by $N$, which <i>degrades</i> phase noise by the same $20\log_{10}(N)$ — multiplying a signal's frequency also multiplies its phase excursions.</p>
`
  }

});
