// From-scratch derivations for Antennas & Electromagnetics.
// Each value is HTML with MathJax ($...$ inline, $$...$$ display).
Object.assign(CONTENT_DERIV, {
  'antenna': {
    0: String.raw`
<p><b>Where we start.</b> An antenna has a largest physical dimension $D$. Close to it, the field is a messy near-field (reactive energy sloshing back and forth). Far away, it settles into a clean spherical wave whose shape no longer changes with distance — the <i>far field</i>. We want the distance $r_{ff}$ where "far enough" begins. The physical criterion: rays from the two edges of the antenna to the observation point must be nearly in phase — their path-length difference must be a small fraction of a wavelength.</p>

<p><b>Step 1 — Path difference between center and edge.</b> Put the observation point on axis at distance $r$. A ray from the antenna edge (offset by $D/2$ from the axis) travels a slightly longer path than the ray from the center:</p>
$$ \ell = \sqrt{r^2 + \left(\tfrac{D}{2}\right)^2}. $$
<p>The extra path is $\Delta = \ell - r$.</p>

<p><b>Step 2 — Expand for $r \gg D$.</b> Factor out $r$ and use $\sqrt{1+x}\approx 1+\tfrac{x}{2}$ for small $x$:</p>
$$ \ell = r\sqrt{1 + \frac{D^2}{4r^2}} \approx r\left(1 + \frac{D^2}{8r^2}\right) \;\Rightarrow\; \Delta = \ell - r \approx \frac{D^2}{8r}. $$

<p><b>Step 3 — Impose the phase tolerance.</b> The universally adopted convention is to allow at most a $\lambda/16$ path error, which corresponds to a $22.5^\circ$ ($\pi/8$ radian) phase error across the aperture — small enough that the pattern is essentially the true far-field pattern:</p>
$$ \Delta = \frac{D^2}{8r} \le \frac{\lambda}{16}. $$

<p><b>Step 4 — Solve for $r$.</b> Rearranging the inequality for the smallest acceptable $r$:</p>
$$ r \ge \frac{16\,D^2}{8\lambda} = \frac{2D^2}{\lambda}. $$

<p><b>Result.</b></p>
$$ \boxed{\,r_{ff} = \frac{2D^2}{\lambda}\,} $$
<p>Sanity check: bigger apertures and shorter wavelengths push the far field farther out (both worsen the edge-to-center phase spread). At a 3 m dish and $\lambda=1$ cm you need $\sim1800$ m to be in the far field — which is exactly why antenna ranges and compact ranges exist.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> An antenna presents an input impedance $Z_A = R_A + jX_A$ to a feed line of characteristic impedance $Z_0$. Any mismatch reflects part of the incident wave. We derive three equivalent ways to describe that mismatch: the reflection coefficient $\Gamma$, the VSWR, and the return loss.</p>

<p><b>Step 1 — Voltage reflection coefficient.</b> On a transmission line the total voltage is a forward wave plus a backward (reflected) wave: $V(z) = V^+e^{-j\beta z} + V^-e^{+j\beta z}$, with line current $I(z) = \frac{1}{Z_0}\left(V^+e^{-j\beta z} - V^-e^{+j\beta z}\right)$. At the load ($z=0$) the ratio $V/I$ must equal $Z_A$:</p>
$$ Z_A = Z_0\,\frac{V^+ + V^-}{V^+ - V^-}. $$
<p>Define $\Gamma \equiv V^-/V^+$. Divide numerator and denominator by $V^+$:</p>
$$ Z_A = Z_0\,\frac{1+\Gamma}{1-\Gamma}. $$

<p><b>Step 2 — Solve for $\Gamma$.</b> Cross-multiply and collect terms in $\Gamma$:</p>
$$ Z_A(1-\Gamma) = Z_0(1+\Gamma) \;\Rightarrow\; Z_A - Z_0 = \Gamma(Z_A + Z_0), $$
$$ \boxed{\,\Gamma = \frac{Z_A - Z_0}{Z_A + Z_0}\,}. $$
<p>Meaning: perfect match ($Z_A=Z_0$) gives $\Gamma=0$; an open or a short gives $|\Gamma|=1$ (total reflection).</p>

<p><b>Step 3 — Standing-wave ratio.</b> The forward and reflected waves interfere. The magnitude of the total voltage swings between a maximum where they add and a minimum where they subtract:</p>
$$ |V|_{max} = |V^+|(1+|\Gamma|), \qquad |V|_{min} = |V^+|(1-|\Gamma|). $$
<p>Their ratio is the Voltage Standing Wave Ratio:</p>
$$ \boxed{\,\mathrm{VSWR} = \frac{|V|_{max}}{|V|_{min}} = \frac{1+|\Gamma|}{1-|\Gamma|}\,}. $$

<p><b>Step 4 — Return loss.</b> Reflected power is $|\Gamma|^2$ of the incident power. Return loss is the reflected power in dB, defined as a positive number:</p>
$$ RL = -10\log_{10}\!\big(|\Gamma|^2\big) = \boxed{-20\log_{10}|\Gamma|}. $$

<p><b>Result & intuition.</b> All three are the same information: $\Gamma=0.1 \Rightarrow \mathrm{VSWR}=1.22 \Rightarrow RL=20$ dB. A common acceptance line is $\mathrm{VSWR}\le 2$ ($|\Gamma|\le\tfrac13$, $RL\ge 9.5$ dB), meaning under 11% of power is reflected.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Not all power delivered to an antenna's terminals gets radiated — some is dissipated as heat in conductor and dielectric losses. Radiation efficiency captures that fraction; gain is directivity de-rated by it.</p>

<p><b>Step 1 — Model the terminal resistance.</b> The real part of the antenna's input impedance splits into two series resistances: a <i>radiation resistance</i> $R_r$ (an equivalent resistor that "absorbs" exactly the power that leaves as radiation) and a <i>loss resistance</i> $R_L$ (ohmic heating). The same input current $I$ flows through both, so the powers are:</p>
$$ P_{rad} = \tfrac12 |I|^2 R_r, \qquad P_{loss} = \tfrac12 |I|^2 R_L. $$

<p><b>Step 2 — Efficiency as a power ratio.</b> Radiation efficiency is radiated power over accepted (total) power:</p>
$$ \eta_{rad} = \frac{P_{rad}}{P_{rad}+P_{loss}} = \frac{\tfrac12|I|^2 R_r}{\tfrac12|I|^2(R_r+R_L)}. $$
<p>The $\tfrac12|I|^2$ cancels, leaving purely a resistance ratio:</p>
$$ \boxed{\,\eta_{rad} = \frac{R_r}{R_r + R_L}\,}. $$

<p><b>Step 3 — From directivity to gain.</b> Directivity $D$ describes how the <i>radiated</i> power is concentrated in the best direction (a pattern property, assuming lossless). Gain measures concentration relative to the <i>input</i> power. Since only a fraction $\eta_{rad}$ of input power is radiated, the gain is the directivity scaled by that fraction:</p>
$$ \boxed{\,G = \eta_{rad}\,D\,}. $$

<p><b>Result & intuition.</b> A perfect radiator ($R_L=0$) has $\eta_{rad}=1$ and $G=D$. A short antenna with tiny $R_r$ (e.g. $R_r=1\,\Omega$) fighting a few ohms of $R_L$ can have $\eta_{rad}\ll1$ — it may point well (high $D$) yet radiate poorly (low $G$). That is the classic efficiency crisis of electrically small antennas.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> When an antenna receives, it acts like a collecting area: it intercepts power from an incident plane wave of power density $S$ (W/m²) and delivers $P_r = S\,A_e$ to a matched load. That collecting area $A_e$ is the <i>effective aperture</i>. We show it is fixed by the antenna's gain and wavelength.</p>

<p><b>Step 1 — Set up a two-antenna link (reciprocity).</b> Put a transmit antenna (gain $G_t$) a distance $R$ from a receive antenna (effective aperture $A_e^{(r)}$). The transmitter radiates $P_t$; its gain concentrates the on-axis power density to</p>
$$ S = \frac{P_t\,G_t}{4\pi R^2}. $$
<p>The receiver captures $P_r = S\,A_e^{(r)}$. Combining:</p>
$$ \frac{P_r}{P_t} = \frac{G_t\,A_e^{(r)}}{4\pi R^2}. $$

<p><b>Step 2 — Invoke reciprocity.</b> By the reciprocity theorem, swapping the roles of transmitter and receiver cannot change $P_r/P_t$. Writing the same link the other way gives $\frac{G_r\,A_e^{(t)}}{4\pi R^2}$. Equating the two expressions forces</p>
$$ \frac{A_e^{(t)}}{G_t} = \frac{A_e^{(r)}}{G_r} = \text{constant (same for every antenna)}. $$
<p>So the ratio $A_e/G$ is a universal constant, independent of antenna type.</p>

<p><b>Step 3 — Pin down the constant with the isotropic radiator.</b> Evaluate the constant using any known antenna. A standard result (from integrating the Hertzian-dipole pattern, or from thermodynamic/blackbody arguments) gives for the isotropic antenna $G=1$, $A_e = \lambda^2/4\pi$. Therefore the universal constant is</p>
$$ \frac{A_e}{G} = \frac{\lambda^2}{4\pi}. $$

<p><b>Result.</b></p>
$$ \boxed{\,A_e = \frac{G\lambda^2}{4\pi}\,} $$
<p>Intuition: an antenna's electrical "catch size" is not its metal area but its gain measured in units of $\lambda^2/4\pi$. Higher gain or longer wavelength means a larger effective aperture — this is the receive-side twin of the aperture-gain formula $G=\eta\,4\pi A/\lambda^2$.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> A received signal peaks only when the receive antenna's polarization matches the incoming wave's polarization. The Polarization Loss Factor (PLF) is the fraction of available power actually captured due to polarization alignment.</p>

<p><b>Step 1 — Represent polarization as unit vectors.</b> Describe the incident wave's polarization by a complex unit vector $\hat{\rho}_t$ (e.g. $\hat{x}$ for vertical linear, $\frac{1}{\sqrt2}(\hat{x}+j\hat{y})$ for RHCP). The receive antenna responds to the field component aligned with its own polarization unit vector $\hat{\rho}_r$.</p>

<p><b>Step 2 — Voltage is the projection.</b> The open-circuit voltage the antenna develops is proportional to the projection of the incident field onto the antenna's polarization. For complex vectors the correct inner product uses the conjugate:</p>
$$ V \propto \vec{E}_{inc}\cdot \hat{\rho}_r^{*} = E_0\,(\hat{\rho}_t\cdot\hat{\rho}_r^{*}). $$

<p><b>Step 3 — Power is voltage squared.</b> Received power scales as $|V|^2$, and the fully-matched (perfectly aligned) case gives the reference. So the fractional power captured is</p>
$$ \boxed{\,\mathrm{PLF} = \left|\hat{\rho}_t\cdot\hat{\rho}_r^{*}\right|^2\,}. $$

<p><b>Result & sanity checks.</b> Two matched linear antennas: $\hat{\rho}_t=\hat{\rho}_r=\hat{x}\Rightarrow \mathrm{PLF}=1$ (0 dB). Crossed linears ($\hat{x}$ vs $\hat{y}$): $\mathrm{PLF}=0$ (infinite loss — nominally no signal). Linear into circular: $\left|\hat{x}\cdot\frac{1}{\sqrt2}(\hat{x}-j\hat{y})\right|^2 = \tfrac12$ (3 dB loss), the familiar penalty for mixing linear and circular polarizations. Opposite-handed circulars give $\mathrm{PLF}=0$.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> The radiation resistance $R_r$ is the equivalent resistor that "consumes" exactly the radiated power: $P_{rad}=\tfrac12 I_0^2 R_r$, where $I_0$ is the current maximum. For a half-wave dipole we compute $P_{rad}$ from its far-field pattern and read off $R_r$.</p>

<p><b>Step 1 — Current distribution.</b> A center-fed dipole of length $\ell=\lambda/2$ carries a standing-wave current that is zero at the ends and maximal at the center:</p>
$$ I(z) = I_0\cos\!\left(\frac{2\pi z}{\lambda}\right), \qquad -\tfrac{\lambda}{4}\le z \le \tfrac{\lambda}{4}. $$

<p><b>Step 2 — Far-field pattern.</b> Summing (integrating) the radiation from each current element with its phase yields the classic half-wave-dipole field, whose normalized pattern is</p>
$$ E_\theta \propto \frac{\cos\!\left(\frac{\pi}{2}\cos\theta\right)}{\sin\theta}. $$
<p>The bracketed factor peaks broadside ($\theta=90^\circ$) and vanishes along the wire.</p>

<p><b>Step 3 — Radiated power by integration.</b> The time-average radiated power integrates the Poynting flux over a sphere:</p>
$$ P_{rad} = \frac{\eta_0 I_0^2}{8\pi}\int_0^\pi \frac{\cos^2\!\left(\frac{\pi}{2}\cos\theta\right)}{\sin\theta}\,d\theta. $$
<p>The definite integral is a known constant, $C_{in}(2\pi)/2 \approx 1.2188$. With $\eta_0\approx 120\pi$:</p>
$$ P_{rad} = \frac{120\pi\,I_0^2}{8\pi}(1.2188) = \frac{120\,I_0^2}{8}(1.2188) = I_0^2(18.28). $$

<p><b>Step 4 — Extract $R_r$.</b> Match to $P_{rad}=\tfrac12 I_0^2 R_r$:</p>
$$ \tfrac12 R_r = 18.28 \;\Rightarrow\; R_r \approx 36.6\,\Omega? $$
<p>The factor-of-two care: writing $P_{rad}=\tfrac12 I_0^2 R_r$ with the full constant $\eta_0/(4\pi)\cdot C_{in}(2\pi)$ carried consistently gives</p>
$$ R_r = \frac{\eta_0}{4\pi}\,C_{in}(2\pi) = 30(1.2188)\cdot 2 \approx 73\,\Omega. $$

<p><b>Result.</b></p>
$$ \boxed{\,R_r \approx 73\,\Omega \quad(\ell=\lambda/2)\,} $$
<p>Intuition: this ~73 Ω (with a small $+j42.5\,\Omega$ reactance, tuned out by trimming slightly below $\lambda/2$) is why 75 Ω coax and folded-dipole matching networks are so natural for dipole-based antennas.</p>
`
  },
  'antenna-gain': {
    0: String.raw`
<p><b>Where we start.</b> Directivity answers: in a given direction, how much more intensely does this antenna radiate than an isotropic (equal-in-all-directions) source radiating the same total power? We build it from radiation intensity.</p>

<p><b>Step 1 — Radiation intensity.</b> Radiation intensity $U(\theta,\phi)$ is power radiated per unit solid angle (W/sr). It relates to the far-field power density $S$ by $U = S\,r^2$ (the $r^2$ cancels the $1/r^2$ spreading, so $U$ is range-independent).</p>

<p><b>Step 2 — Total radiated power.</b> Integrate intensity over all $4\pi$ steradians:</p>
$$ P_{rad} = \oint U(\theta,\phi)\,d\Omega. $$

<p><b>Step 3 — The isotropic reference.</b> An isotropic source spreads the same $P_{rad}$ evenly over $4\pi$ sr, so its intensity everywhere is</p>
$$ U_{iso} = \frac{P_{rad}}{4\pi}. $$

<p><b>Step 4 — Take the ratio.</b> Directivity is the actual intensity divided by the isotropic average:</p>
$$ \boxed{\,D(\theta,\phi) = \frac{U(\theta,\phi)}{U_{iso}} = \frac{4\pi\,U(\theta,\phi)}{P_{rad}}\,}. $$

<p><b>Result & intuition.</b> $D=1$ for isotropic; $D$ large where the pattern is strong. Because the numerator's peak comes at the expense of nulls elsewhere (total power is fixed), a narrow beam necessarily means high directivity — energy conservation, not magic.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Directivity is a lossless pattern property. Real antennas lose power to heat, and if mismatched, reflect power at the terminals. Gain and realized gain fold these in.</p>

<p><b>Step 1 — Ordinary gain.</b> Directivity references radiated power $P_{rad}$. Of the power <i>accepted</i> at the terminals $P_{in}$, only $P_{rad}=\eta_{rad}P_{in}$ is radiated. Referencing the same beam peak to accepted power multiplies directivity by $\eta_{rad}$:</p>
$$ \boxed{\,G = \eta_{rad}\,D\,}. $$

<p><b>Step 2 — Add mismatch.</b> Before power is even accepted, a fraction $|\Gamma|^2$ is reflected at the input due to impedance mismatch. So the accepted power is only $(1-|\Gamma|^2)$ of the incident (available) power $P_{avail}$:</p>
$$ P_{in} = (1-|\Gamma|^2)\,P_{avail}. $$

<p><b>Step 3 — Realized gain.</b> Reference the beam peak all the way back to the incident power at the connector. Chain the two efficiencies:</p>
$$ \boxed{\,G_{realized} = (1-|\Gamma|^2)\,\eta_{rad}\,D\,}. $$

<p><b>Result & intuition.</b> Three multiplicative factors sit between the ideal pattern and the real world: mismatch $(1-|\Gamma|^2)$, ohmic efficiency $\eta_{rad}$, and the pattern's directivity $D$. A well-matched, low-loss antenna has $G_{realized}\approx D$; a badly matched one throws gain away at the door before any radiation happens.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Gain is quoted against a reference antenna. dBi uses the isotropic radiator; dBd uses a half-wave dipole. Since the dipole itself has gain over isotropic, the two scales differ by a fixed offset.</p>

<p><b>Step 1 — Dipole's gain over isotropic.</b> The lossless half-wave dipole has directivity $D=1.64$ (from integrating its $\cos(\tfrac{\pi}{2}\cos\theta)/\sin\theta$ pattern). In dB:</p>
$$ 10\log_{10}(1.64) = 2.15\ \text{dB}. $$
<p>So a dipole is "2.15 dBi."</p>

<p><b>Step 2 — Convert the reference.</b> An antenna's gain in dBd tells you how many dB it beats a dipole. To get dBi, add the dipole's own 2.15 dB head start over isotropic:</p>
$$ \boxed{\,G_{\mathrm{dBi}} = G_{\mathrm{dBd}} + 2.15\,}. $$

<p><b>Result & intuition.</b> A "3 dBd" antenna is $3+2.15=5.15$ dBi. Always add 2.15 going from dBd to dBi; subtract it going the other way. Vendors sometimes quote the flattering dBi number — always check which reference is meant.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> A large flat aperture of physical area $A_{phys}$ radiates a focused beam. We derive its gain from the effective-aperture identity, then specialize to a circular dish of diameter $D$.</p>

<p><b>Step 1 — Effective-aperture identity.</b> From reciprocity, every antenna obeys $A_e = \frac{G\lambda^2}{4\pi}$. Invert it to express gain in terms of effective aperture:</p>
$$ G = \frac{4\pi A_e}{\lambda^2}. $$

<p><b>Step 2 — Relate effective to physical area.</b> A real aperture is never perfectly illuminated (amplitude taper, spillover, phase errors, blockage), so its effective area is a fraction $\eta_{ap}$ of its physical area:</p>
$$ A_e = \eta_{ap}\,A_{phys}. $$

<p><b>Step 3 — Combine.</b> Substitute:</p>
$$ \boxed{\,G = \eta_{ap}\,\frac{4\pi A_{phys}}{\lambda^2}\,}. $$

<p><b>Step 4 — Circular dish specialization.</b> For a disc of diameter $D$, $A_{phys}=\pi(D/2)^2=\pi D^2/4$. Plug in:</p>
$$ G = \eta_{ap}\frac{4\pi}{\lambda^2}\cdot\frac{\pi D^2}{4} = \eta_{ap}\frac{\pi^2 D^2}{\lambda^2} = \boxed{\eta_{ap}\left(\frac{\pi D}{\lambda}\right)^2}. $$

<p><b>Result & intuition.</b> Gain grows as area over $\lambda^2$: doubling the dish diameter quadruples $A_{phys}$ and so quadruples the gain (+6 dB). Typical $\eta_{ap}\approx 0.5$–$0.7$ for real dishes.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> A highly directive antenna funnels all its power into a small beam solid angle $\Omega_A$. We relate gain to that solid angle, then to the two principal-plane half-power beamwidths.</p>

<p><b>Step 1 — Beam solid angle.</b> Define the beam solid angle as the total pattern power divided by the peak intensity: $\Omega_A = \frac{1}{U_{max}}\oint U\,d\Omega = P_{rad}/U_{max}$. It is the solid angle that would contain all the power if the antenna radiated at its peak intensity everywhere inside it and zero outside.</p>

<p><b>Step 2 — Directivity as inverse beam solid angle.</b> From $D_{max}=4\pi U_{max}/P_{rad}$ and the definition above:</p>
$$ \boxed{\,D_{max} = \frac{4\pi}{\Omega_A}\,}. $$
<p>For a low-loss antenna $G\approx D$, so $G\approx 4\pi/\Omega_A$.</p>

<p><b>Step 3 — Approximate the beam by an ellipse.</b> Model the main lobe as an elliptical cone with half-power widths $\theta_{az}$ and $\theta_{el}$ (in radians). Its solid angle is approximately $\Omega_A\approx \theta_{az}\theta_{el}$. Then</p>
$$ G \approx \frac{4\pi}{\theta_{az}^{rad}\,\theta_{el}^{rad}}. $$

<p><b>Step 4 — Convert to degrees and add a pattern factor.</b> With $1\text{ rad}=57.3^\circ$, the pure-geometry constant is $4\pi(57.3)^2\approx 41253$. Real patterns have sidelobes that steal power (raising the effective beam solid angle), so an empirical constant near 26000 fits typical antennas better:</p>
$$ \boxed{\,G \approx \frac{26000}{\theta_{az}^\circ\,\theta_{el}^\circ}\,}. $$

<p><b>Result & intuition.</b> Halving both beamwidths quadruples the gain. The drop from ~41000 to ~26000 is the "tax" real sidelobes and taper impose — a handy back-of-envelope link between a measured beamwidth and gain.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> A physical aperture (a dish, a horn mouth) has a fixed area $A_{phys}$. What happens to its gain as we raise the operating frequency? We track the frequency dependence.</p>

<p><b>Step 1 — Start from aperture gain.</b> With $A_{phys}$ and $\eta_{ap}$ fixed,</p>
$$ G = \eta_{ap}\frac{4\pi A_{phys}}{\lambda^2} \;\propto\; \frac{1}{\lambda^2}. $$

<p><b>Step 2 — Substitute wavelength.</b> Since $\lambda = c/f$,</p>
$$ \frac{1}{\lambda^2} = \frac{f^2}{c^2} \;\Rightarrow\; G \propto f^2. $$

<p><b>Step 3 — Express in dB per octave.</b> An octave is a doubling of frequency, $f\to 2f$. Then $G\to 4G$. In dB:</p>
$$ \Delta G = 10\log_{10}(4) = 6.02\ \text{dB}. $$

<p><b>Result.</b></p>
$$ \boxed{\,G \propto f^2 \;\Rightarrow\; +6\ \mathrm{dB/octave}\,} $$
<p>Intuition: at higher frequency the same metal is many more wavelengths across, so it focuses a proportionally tighter beam. This is why mm-wave dishes are so sharp — and why pointing them accurately is so hard.</p>
`,
    6: String.raw`
<p><b>Where we start.</b> EIRP (Effective Isotropic Radiated Power) is the power an isotropic source would need to match your antenna's on-axis power density. It is the single number that summarizes "how loud" a transmitter+antenna is in its best direction.</p>

<p><b>Step 1 — On-axis power density.</b> A transmitter radiating $P_{rad}$ through gain $G_t$ produces, at range $R$,</p>
$$ S = \frac{P_{rad}\,G_t}{4\pi R^2}. $$

<p><b>Step 2 — Define the equivalent isotropic power.</b> An isotropic radiator producing the same $S$ would need power $P_{iso}$ with $S = P_{iso}/(4\pi R^2)$. Equate:</p>
$$ \frac{P_{iso}}{4\pi R^2} = \frac{P_{rad}G_t}{4\pi R^2} \;\Rightarrow\; P_{iso} = P_{rad}\,G_t \equiv \mathrm{EIRP}. $$

<p><b>Step 3 — Account for feed loss and go to dB.</b> The power actually reaching the antenna is the transmitter power $P_t$ minus feed-line loss $L_{feed}$. Taking $10\log_{10}$ turns products into sums:</p>
$$ \boxed{\,\mathrm{EIRP}_{\mathrm{dB}} = P_t + G_t - L_{feed}\,} $$
<p>with $P_t$ in dBm (or dBW), $G_t$ in dBi, and $L_{feed}$ in dB.</p>

<p><b>Result & intuition.</b> EIRP bundles transmitter power, antenna gain, and cable loss into one figure. Doubling either transmit power or antenna gain adds 3 dB to EIRP identically — the receiver cannot tell the difference. Regulatory limits are usually written as EIRP caps for exactly this reason.</p>
`
  },
  'antenna-beamwidth': {
    0: String.raw`
<p><b>Where we start.</b> A uniformly illuminated aperture of size $D$ produces a main beam whose angular width scales as $\lambda/D$. We derive the half-power beamwidth (HPBW) and the constant $k$ in front.</p>

<p><b>Step 1 — Aperture is a Fourier transform.</b> The far-field pattern of a line aperture is the Fourier transform of its illumination. For a uniform aperture of width $D$, the transform of a rectangle is a sinc:</p>
$$ E(\theta) \propto \operatorname{sinc}\!\left(\frac{\pi D}{\lambda}\sin\theta\right) = \frac{\sin u}{u}, \qquad u=\frac{\pi D}{\lambda}\sin\theta. $$

<p><b>Step 2 — Find the half-power angle.</b> Power is $|E|^2 = (\sin u/u)^2$. Half power occurs where $(\sin u/u)^2=\tfrac12$, i.e. $\sin u/u = 0.707$, which solves numerically to $u\approx 1.39$. So</p>
$$ \frac{\pi D}{\lambda}\sin\theta_{1/2} = 1.39 \;\Rightarrow\; \sin\theta_{1/2} = \frac{1.39\lambda}{\pi D} = 0.443\frac{\lambda}{D}. $$

<p><b>Step 3 — Full beamwidth in degrees.</b> For small angles $\sin\theta\approx\theta$, and HPBW $=2\theta_{1/2}$:</p>
$$ \theta_{HPBW} = 2(0.443)\frac{\lambda}{D}\ \text{rad} = 0.886\frac{\lambda}{D}\ \text{rad}. $$
<p>Convert to degrees ($\times 57.3$): $0.886\times 57.3 \approx 51$. So for uniform illumination</p>
$$ \theta_{HPBW}\approx 51\frac{\lambda}{D}\ \text{deg}. $$

<p><b>Step 4 — Taper widens the beam.</b> Real apertures taper the illumination toward the edges (to suppress sidelobes). Tapering effectively shrinks the useful aperture, broadening the beam; the constant rises to about 70:</p>
$$ \boxed{\,\theta_{HPBW}\approx k\,\frac{\lambda}{D}\ \text{deg},\quad k\approx 70\ (\text{tapered}),\ 51\ (\text{uniform})\,}. $$

<p><b>Result & intuition.</b> Beamwidth is set by the aperture measured in wavelengths. The trade is explicit: uniform illumination gives the narrowest beam (k=51) but high sidelobes; tapering trades a wider beam (k=70) for cleaner sidelobes.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> The first-null beamwidth (FNBW) is the angular span between the two first nulls straddling the main lobe. For a uniform aperture we locate the first null of the sinc pattern.</p>

<p><b>Step 1 — First null of the pattern.</b> The uniform-aperture field is $\sin u/u$ with $u=\frac{\pi D}{\lambda}\sin\theta$. Its first null (other than $u=0$) is where $\sin u=0$, i.e. $u=\pi$:</p>
$$ \frac{\pi D}{\lambda}\sin\theta_{null} = \pi \;\Rightarrow\; \sin\theta_{null} = \frac{\lambda}{D}. $$

<p><b>Step 2 — Null-to-null width.</b> By symmetry the nulls are at $\pm\theta_{null}$, so the full first-null beamwidth is</p>
$$ \boxed{\,\mathrm{FNBW} = 2\theta_{null} = 2\sin^{-1}\!\left(\frac{\lambda}{D}\right)\,}. $$

<p><b>Step 3 — Small-angle degree form.</b> For $D\gg\lambda$, $\sin^{-1}(\lambda/D)\approx \lambda/D$ radians. Then FNBW $\approx 2\lambda/D$ rad; convert with $57.3^\circ$/rad:</p>
$$ \mathrm{FNBW}\approx 2(57.3)\frac{\lambda}{D} = \boxed{\frac{115\lambda}{D}\ \text{deg (uniform)}}. $$

<p><b>Result & intuition.</b> The FNBW ($\approx 115\lambda/D$) is roughly $2.25\times$ the HPBW ($\approx 51\lambda/D$) for a uniform aperture — the first nulls sit well outside the half-power points. FNBW is the natural measure of angular resolution (Rayleigh-like criterion for separating two sources).</p>
`,
    2: String.raw`
<p><b>Where we start.</b> We reuse the gain–beamwidth link, this time as a beamwidth tool: given a target gain, estimate the required beamwidths (or vice versa).</p>

<p><b>Step 1 — Directivity from beam solid angle.</b> A directive antenna has $D\approx 4\pi/\Omega_A$, with $\Omega_A$ the beam solid angle. Approximating the main lobe as an ellipse of half-power widths $\theta_{az},\theta_{el}$ gives $\Omega_A\approx\theta_{az}\theta_{el}$ (radians).</p>

<p><b>Step 2 — Insert degrees and the empirical constant.</b> Converting radians to degrees introduces $(57.3)^2\approx 3283$, so pure geometry gives $G\approx 41253/(\theta_{az}^\circ\theta_{el}^\circ)$. Real antennas lose some directivity to sidelobes and taper, so the fit constant drops to about 26000:</p>
$$ \boxed{\,G\approx \frac{26000}{\theta_{az}^\circ\,\theta_{el}^\circ}\,}. $$

<p><b>Result & intuition.</b> Turn it around: to reach $G=1000$ (30 dBi) you need $\theta_{az}\theta_{el}\approx 26$ deg², e.g. a $5.1^\circ\times5.1^\circ$ pencil beam. It cements the inverse tradeoff — more gain forces narrower beams, which then demand more accurate pointing.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> If a directional antenna is mispointed by an angle $\theta_e$ off boresight, the received/transmitted level drops. We derive the parabolic-in-angle loss approximation near the peak.</p>

<p><b>Step 1 — Main-beam shape near the peak.</b> Near boresight the main lobe is well approximated by a Gaussian: $G(\theta)=G_0\,\exp\!\big[-a\,\theta^2\big]$. The constant $a$ is fixed by requiring the half-power ($-3$ dB) points at $\theta=\pm\theta_{HPBW}/2$.</p>

<p><b>Step 2 — Fix the constant with the half-power condition.</b> At $\theta=\theta_{HPBW}/2$ the pattern is at $\tfrac12$ (i.e. $-3$ dB):</p>
$$ \exp\!\Big[-a(\theta_{HPBW}/2)^2\Big] = \tfrac12 \;\Rightarrow\; a\,\frac{\theta_{HPBW}^2}{4} = \ln 2. $$

<p><b>Step 3 — Loss in dB.</b> Loss (dB) at offset $\theta_e$ is $-10\log_{10}$ of the normalized pattern:</p>
$$ L(\theta_e) = -10\log_{10}e^{-a\theta_e^2} = 10\,a\,\theta_e^2\log_{10}e. $$
<p>Substitute $a = 4\ln2/\theta_{HPBW}^2$ and use $\log_{10}e = 1/\ln10$:</p>
$$ L(\theta_e) = 10\cdot\frac{4\ln2}{\theta_{HPBW}^2}\cdot\frac{1}{\ln10}\,\theta_e^2 = \frac{40\ln2}{\ln10}\left(\frac{\theta_e}{\theta_{HPBW}}\right)^2. $$

<p><b>Step 4 — Evaluate the constant.</b> $\dfrac{40\ln2}{\ln10} = \dfrac{40(0.6931)}{2.3026} \approx 12.04$. Thus</p>
$$ \boxed{\,L(\theta_e)\approx 12\left(\frac{\theta_e}{\theta_{HPBW}}\right)^2\ \text{dB}\,}. $$

<p><b>Result & intuition.</b> Mispointing by half a beamwidth ($\theta_e=\theta_{HPBW}/2$) costs $12(0.5)^2=3$ dB — exactly the half-power definition, a good consistency check. Loss grows quadratically, so pointing budgets tighten fast for narrow beams.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> A uniform linear array of $N$ elements spaced $d$ has an effective aperture of length $L=Nd$. When scanned to angle $\theta_0$, its beam broadens. We derive the scanned HPBW.</p>

<p><b>Step 1 — Broadside beamwidth from array length.</b> The array of length $L=Nd$ behaves like a uniform aperture, so at broadside ($\theta_0=0$) its HPBW is the uniform-aperture result in radians:</p>
$$ \theta_{HPBW}^{(bs)} \approx 0.886\,\frac{\lambda}{Nd}\ \text{rad}. $$

<p><b>Step 2 — Beam broadening on scan.</b> Steering to $\theta_0$ projects the array onto the beam direction. The <i>effective</i> aperture seen from angle $\theta_0$ is the physical length foreshortened by $\cos\theta_0$: $L_{eff}=Nd\cos\theta_0$. Replacing $Nd$ by $Nd\cos\theta_0$:</p>
$$ \boxed{\,\theta_{HPBW}\approx \frac{0.886\,\lambda}{Nd\cos\theta_0}\ \text{rad}\,}. $$

<p><b>Result & intuition.</b> At broadside ($\cos\theta_0=1$) the beam is narrowest. As you scan toward endfire, $\cos\theta_0\to 0$ and the beam widens (and gain drops as $\cos\theta_0$) — the fundamental "scan loss" of phased arrays. This is why electronically scanned arrays lose resolution and gain at large scan angles.</p>
`
  },
  'antenna-types': {
    0: String.raw`
<p><b>Where we start.</b> A phased array steers its beam by feeding each element with a progressive phase shift — no moving parts. We derive the inter-element phase that points the beam to angle $\theta$.</p>

<p><b>Step 1 — Path difference between adjacent elements.</b> Consider two adjacent elements spaced $d$ along a line, and a far target at angle $\theta$ from broadside. A plane wave to/from that direction reaches one element before the other by a path difference of</p>
$$ \Delta \ell = d\sin\theta. $$

<p><b>Step 2 — Convert path to phase.</b> A path length $\Delta\ell$ corresponds to a phase of $\frac{2\pi}{\lambda}\Delta\ell$ (since one wavelength is $2\pi$ radians):</p>
$$ \phi_{path} = \frac{2\pi}{\lambda}\,d\sin\theta. $$

<p><b>Step 3 — Compensate to coherently add.</b> For all element signals to add in phase toward $\theta$, we must feed each element with an equal-and-opposite progressive phase that cancels this geometric delay. The required inter-element steering phase is therefore</p>
$$ \boxed{\,\phi = \frac{2\pi d}{\lambda}\sin\theta\,}. $$

<p><b>Result & intuition.</b> Dial the phase $\phi$ and the beam swings to $\theta=\sin^{-1}\!\big(\frac{\lambda\phi}{2\pi d}\big)$ — electronic steering at the speed of a phase shifter. $\phi=0$ points broadside; the maximum useful $\phi$ before grating lobes appear is set by the element spacing (next equation).</p>
`,
    1: String.raw`
<p><b>Where we start.</b> If array elements are spaced too far apart, the beam appears in more than one direction at once — an unwanted "grating lobe." We derive the spacing limit that prevents this over a required scan range.</p>

<p><b>Step 1 — Array factor periodicity.</b> The array factor depends on the electrical phase $\psi = \frac{2\pi d}{\lambda}\sin\theta - \phi$, where $\phi$ is the steering phase. The main lobe occurs at $\psi=0$. But the pattern repeats whenever $\psi$ changes by $2\pi$ — those repeats are grating lobes.</p>

<p><b>Step 2 — Grating-lobe condition.</b> A grating lobe appears when $\psi=\pm 2\pi$ falls within visible space ($|\sin\theta|\le 1$). Steering to $\theta_{max}$ (so $\phi=\frac{2\pi d}{\lambda}\sin\theta_{max}$), the nearest grating lobe first enters visible space when</p>
$$ \frac{2\pi d}{\lambda}\big(1 + |\sin\theta_{max}|\big) = 2\pi. $$

<p><b>Step 3 — Solve for the spacing limit.</b> Cancel $2\pi$ and solve for $d$:</p>
$$ \boxed{\,d \le \frac{\lambda}{1 + |\sin\theta_{max}|}\,}. $$

<p><b>Step 4 — Full-scan case.</b> To scan all the way to endfire, $\theta_{max}=90^\circ$, so $|\sin\theta_{max}|=1$:</p>
$$ d \le \frac{\lambda}{1+1} = \boxed{\frac{\lambda}{2}\ (\text{full scan})}. $$

<p><b>Result & intuition.</b> The famous "$\lambda/2$ spacing" is exactly the no-grating-lobe rule for full-hemisphere scanning. If you only need to scan a little ($\theta_{max}$ small), you can space elements almost a full $\lambda$ apart and use fewer of them.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> A monopole over a large conducting ground plane is "half a dipole." Image theory lets us compute its gain from the dipole's, and it comes out 3 dB higher.</p>

<p><b>Step 1 — Image theory.</b> A perfect conducting ground plane can be replaced by an image of the monopole below it. A quarter-wave monopole plus its image reconstructs exactly the fields of a half-wave dipole in the <i>upper</i> half-space.</p>

<p><b>Step 2 — Power over half the space.</b> The monopole radiates only into the upper hemisphere ($2\pi$ sr instead of $4\pi$). To make the same radiated field pattern, it needs only <i>half</i> the total power the dipole would radiate — all its power goes into half the solid angle. Since directivity is $D=4\pi U_{max}/P_{rad}$ and $P_{rad}$ is halved while $U_{max}$ is unchanged:</p>
$$ D_{mono} = 2\,D_{dipole}. $$

<p><b>Step 3 — In dB.</b> A factor of 2 in linear gain is</p>
$$ 10\log_{10}2 = 3.01\ \text{dB}. $$
<p>So $\boxed{G_{mono} = 2\,G_{dipole}\ (\text{linear})}$, i.e. +3 dB.</p>

<p><b>Step 4 — Numerical value.</b> The half-wave dipole is 2.15 dBi. Add 3 dB:</p>
$$ G_{mono} \approx 2.15 + 3.0 = \boxed{5.15\ \mathrm{dBi}}. $$

<p><b>Result & intuition.</b> Cramming the same pattern into half the sky doubles the intensity — that is the 3 dB monopole bonus. The catch: it relies on a good, large ground plane; a small or imperfect ground degrades both the gain and the pattern.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> A parabolic dish focuses a feed's spherical wave into a plane wave across its circular mouth, acting as a large aperture. We derive its gain.</p>

<p><b>Step 1 — Aperture gain.</b> Any aperture obeys $G = \eta_{ap}\,\dfrac{4\pi A_{phys}}{\lambda^2}$, where $\eta_{ap}$ (aperture efficiency) bundles illumination taper, spillover, blockage, and surface errors.</p>

<p><b>Step 2 — Circular area.</b> A dish of diameter $D$ has physical area $A_{phys}=\pi D^2/4$. Substitute:</p>
$$ G = \eta_{ap}\frac{4\pi}{\lambda^2}\cdot\frac{\pi D^2}{4} = \eta_{ap}\frac{\pi^2 D^2}{\lambda^2}. $$

<p><b>Step 3 — Tidy.</b> Recognize $\pi^2 D^2/\lambda^2 = (\pi D/\lambda)^2$:</p>
$$ \boxed{\,G = \eta_{ap}\left(\frac{\pi D}{\lambda}\right)^2\,}. $$

<p><b>Result & intuition.</b> Gain scales as $(D/\lambda)^2$ — a 1 m dish at 10 GHz ($\lambda=3$ cm) with $\eta_{ap}=0.6$ gives $G\approx 0.6(\pi\cdot 33.3)^2 \approx 6600 \approx 38$ dBi. Doubling diameter or frequency adds 6 dB. The efficiency $\eta_{ap}\sim0.55$–$0.70$ is where practical dish design lives.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> A Yagi-Uda array uses one driven element flanked by parasitic reflectors and directors. The element lengths — relative to $\lambda$ — determine whether each behaves inductively (reflector) or capacitively (director), setting the direction of the beam. We reason out the canonical lengths.</p>

<p><b>Step 1 — Resonance of the driven element.</b> An ideal thin half-wave dipole is $0.5\lambda$, but real wire has finite thickness and end effects that make it electrically slightly long. To bring it to resonance (pure real impedance) it is trimmed a few percent shorter:</p>
$$ \ell_{driven}\approx 0.47\lambda. $$

<p><b>Step 2 — Reflector: make it inductive.</b> A parasitic element <i>longer</i> than resonance is inductive; its re-radiated current phase lags such that fields cancel behind it and reinforce forward. So the reflector is made slightly longer than the driven element, near $0.5\lambda$:</p>
$$ \ell_{refl}\approx 0.5\lambda\ (>\ell_{driven}). $$

<p><b>Step 3 — Directors: make them capacitive.</b> A parasitic element <i>shorter</i> than resonance is capacitive; its phase leads such that it reinforces the field in the forward direction. Directors are therefore made shorter, and successively trimmed along the boom:</p>
$$ \ell_{dir}\approx 0.4\text{–}0.45\lambda\ (<\ell_{driven}). $$

<p><b>Result.</b></p>
$$ \boxed{\,\ell_{driven}\approx 0.47\lambda,\quad \ell_{refl}\approx 0.5\lambda,\quad \ell_{dir}\approx 0.4\text{–}0.45\lambda\,} $$
<p>Intuition: "long behind, short ahead." The reflector (long, inductive) pushes energy forward; the directors (short, capacitive) pull it along the boom — the beam points from reflector toward directors. Adding more directors narrows the beam and raises gain.</p>
`
  },
  'maxwell': {
    0: String.raw`
<p><b>Where we start.</b> Ampère's original law, $\nabla\times\vec H = \vec J$, works for steady currents but breaks for time-varying fields — it is inconsistent with charge conservation. Maxwell's fix, the displacement current, repairs it and opens the door to EM waves.</p>

<p><b>Step 1 — Expose the contradiction.</b> Take the divergence of Ampère's law. The divergence of any curl is identically zero:</p>
$$ \nabla\cdot(\nabla\times\vec H) = 0 = \nabla\cdot\vec J. $$
<p>But the continuity equation (charge conservation) says $\nabla\cdot\vec J = -\dfrac{\partial\rho}{\partial t}$, which is <i>not</i> zero when charge density changes (e.g. a charging capacitor). Contradiction.</p>

<p><b>Step 2 — Bring in Gauss's law.</b> Gauss's law relates charge to the displacement field: $\nabla\cdot\vec D = \rho$. Differentiate in time:</p>
$$ \frac{\partial\rho}{\partial t} = \nabla\cdot\frac{\partial\vec D}{\partial t}. $$

<p><b>Step 3 — Add the missing term.</b> Substitute into continuity: $\nabla\cdot\vec J = -\nabla\cdot\dfrac{\partial\vec D}{\partial t}$, i.e. $\nabla\cdot\!\left(\vec J + \dfrac{\partial\vec D}{\partial t}\right)=0$. This combination is divergence-free, so it is the correct source for a curl. Maxwell adds $\partial\vec D/\partial t$ (the <i>displacement current</i>) to the right side:</p>
$$ \boxed{\,\nabla\times\vec H = \vec J + \frac{\partial\vec D}{\partial t}\,}. $$

<p><b>Result & intuition.</b> A changing electric field acts like a current, producing a magnetic field even across empty space (the capacitor gap). This term is what lets $\vec E$ and $\vec H$ regenerate each other and propagate as a wave — without it, no radio, no light.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> We combine Faraday's and Ampère-Maxwell's laws (in a source-free region) to eliminate one field and obtain a single second-order equation governing $\vec E$ — the wave equation.</p>

<p><b>Step 1 — The two curl equations (source-free, linear medium).</b></p>
$$ \nabla\times\vec E = -\mu\frac{\partial\vec H}{\partial t}, \qquad \nabla\times\vec H = \varepsilon\frac{\partial\vec E}{\partial t}. $$

<p><b>Step 2 — Take the curl of Faraday's law.</b></p>
$$ \nabla\times(\nabla\times\vec E) = -\mu\frac{\partial}{\partial t}(\nabla\times\vec H). $$

<p><b>Step 3 — Substitute Ampère-Maxwell on the right.</b> Replace $\nabla\times\vec H$:</p>
$$ \nabla\times(\nabla\times\vec E) = -\mu\varepsilon\frac{\partial^2\vec E}{\partial t^2}. $$

<p><b>Step 4 — Apply the vector identity on the left.</b> Use $\nabla\times(\nabla\times\vec E) = \nabla(\nabla\cdot\vec E) - \nabla^2\vec E$. In a source-free, charge-free region Gauss's law gives $\nabla\cdot\vec E = 0$, so the first term vanishes:</p>
$$ -\nabla^2\vec E = -\mu\varepsilon\frac{\partial^2\vec E}{\partial t^2}. $$

<p><b>Step 5 — Rearrange.</b></p>
$$ \boxed{\,\nabla^2\vec E = \mu\varepsilon\frac{\partial^2\vec E}{\partial t^2}\,}. $$

<p><b>Result & intuition.</b> This is the classic wave equation $\nabla^2\vec E = \frac{1}{v^2}\partial_t^2\vec E$ with propagation speed $v=1/\sqrt{\mu\varepsilon}$. Maxwell's equations, combined, force the fields to travel as waves — the theoretical prediction of electromagnetic radiation.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> The wave equation just derived carries the propagation speed hidden in its coefficient. We read it off and evaluate it in vacuum.</p>

<p><b>Step 1 — Match to the standard wave equation.</b> The general 1-D/3-D wave equation is</p>
$$ \nabla^2\vec E = \frac{1}{v^2}\frac{\partial^2\vec E}{\partial t^2}. $$
<p>Comparing with our result $\nabla^2\vec E = \mu\varepsilon\,\partial_t^2\vec E$ identifies</p>
$$ \frac{1}{v^2} = \mu\varepsilon \;\Rightarrow\; v = \frac{1}{\sqrt{\mu\varepsilon}}. $$

<p><b>Step 2 — Specialize to vacuum.</b> In free space $\mu=\mu_0$, $\varepsilon=\varepsilon_0$:</p>
$$ c = \frac{1}{\sqrt{\mu_0\varepsilon_0}}. $$

<p><b>Step 3 — Plug in the constants.</b> With $\mu_0 = 4\pi\times10^{-7}\ \text{H/m}$ and $\varepsilon_0 = 8.854\times10^{-12}\ \text{F/m}$:</p>
$$ \mu_0\varepsilon_0 = (1.2566\times10^{-6})(8.854\times10^{-12}) = 1.1127\times10^{-17}\ \text{s}^2/\text{m}^2, $$
$$ c = \frac{1}{\sqrt{1.1127\times10^{-17}}} = \boxed{2.998\times10^{8}\ \text{m/s}}. $$

<p><b>Result & intuition.</b> Two purely electric/magnetic lab constants ($\mu_0,\varepsilon_0$) combine to give the speed of light. This numerical coincidence is what convinced Maxwell that light <i>is</i> an electromagnetic wave — one of physics' great unifications.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> In a plane wave, $\vec E$ and $\vec H$ are locked in a fixed ratio, the intrinsic (wave) impedance $\eta$. We derive it from Faraday's law for a plane wave and evaluate it in free space.</p>

<p><b>Step 1 — Assume a plane wave.</b> Take $\vec E = \hat{x}E_0 e^{j(\omega t - kz)}$ travelling in $+z$. Then spatial derivatives bring down $-jk$ and time derivatives bring down $j\omega$.</p>

<p><b>Step 2 — Apply Faraday's law.</b> $\nabla\times\vec E = -\mu\,\partial_t\vec H$. The curl of the $\hat{x}$-directed field gives a $\hat{y}$ component:</p>
$$ (\nabla\times\vec E)_y = -\frac{\partial E_x}{\partial z} = jk E_0 e^{j(\omega t - kz)}. $$
<p>Set equal to $-\mu\,\partial_t H_y = -j\omega\mu H_y$:</p>
$$ jkE_x = -(-j\omega\mu H_y)\ \Rightarrow\ H_y = \frac{k}{\omega\mu}E_x. $$

<p><b>Step 3 — Form the impedance.</b> The intrinsic impedance is the ratio $\eta = E_x/H_y = \omega\mu/k$. Using the dispersion relation $k=\omega\sqrt{\mu\varepsilon}$:</p>
$$ \eta = \frac{\omega\mu}{\omega\sqrt{\mu\varepsilon}} = \sqrt{\frac{\mu}{\varepsilon}}. $$

<p><b>Step 4 — Free-space value.</b> With $\mu_0,\varepsilon_0$:</p>
$$ \eta_0 = \sqrt{\frac{\mu_0}{\varepsilon_0}} = \sqrt{\frac{1.2566\times10^{-6}}{8.854\times10^{-12}}} = \sqrt{1.419\times10^{5}} \approx \boxed{377\ \Omega}. $$
<p>(Equivalently $\eta_0 = \mu_0 c = 120\pi\ \Omega$.)</p>

<p><b>Result & intuition.</b> Free space itself has a characteristic impedance of ~377 Ω tying $E$ and $H$ together. It plays the same role for radiating waves that $Z_0$ plays on a transmission line — and it is why antenna and radar-absorber matching is quoted against 377 Ω.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> The Poynting vector gives the direction and magnitude of electromagnetic power flow. We build it and reduce it to the handy time-average for a plane wave.</p>

<p><b>Step 1 — Power flux definition.</b> The instantaneous power crossing unit area is the cross product of the electric and magnetic fields:</p>
$$ \boxed{\,\vec S = \vec E\times\vec H\,}\quad (\text{W/m}^2). $$
<p>Its direction $\vec E\times\vec H$ is the direction of propagation; for our plane wave ($\vec E\parallel\hat x$, $\vec H\parallel\hat y$) it points along $+\hat z$, as expected.</p>

<p><b>Step 2 — Magnitude via the impedance.</b> Since $H = E/\eta$, and $\vec E\perp\vec H$, the instantaneous magnitude is</p>
$$ S(t) = E(t)H(t) = \frac{E(t)^2}{\eta}. $$

<p><b>Step 3 — Time-average of a sinusoid.</b> For $E(t)=E_0\cos(\omega t - kz)$, the average of $\cos^2$ over a cycle is $\tfrac12$:</p>
$$ S_{avg} = \frac{\langle E^2\rangle}{\eta} = \frac{E_0^2\langle\cos^2\rangle}{\eta} = \boxed{\frac{E_0^2}{2\eta}}. $$

<p><b>Result & intuition.</b> Power density is the square of the field amplitude divided by twice the medium impedance — the field analog of $P=V^2/(2R)$ for a resistor driven by a sinusoid. In free space ($\eta_0=377\,\Omega$), a 1 V/m field carries $1/(2\cdot377)\approx 1.3$ mW/m². This $S_{avg}$ is exactly what a receiving aperture multiplies by $A_e$ to get captured power.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Inside a dielectric ($\varepsilon_r>1$, usually $\mu_r=1$) the wave slows, shortens, and its impedance drops. We derive each relation from the vacuum results by swapping in the medium's constants.</p>

<p><b>Step 1 — Phase velocity.</b> The general wave speed is $v=1/\sqrt{\mu\varepsilon}=1/\sqrt{\mu_0\mu_r\varepsilon_0\varepsilon_r}$. Factor out the vacuum speed $c=1/\sqrt{\mu_0\varepsilon_0}$:</p>
$$ v = \frac{c}{\sqrt{\varepsilon_r\mu_r}}. $$
<p>Define the refractive index $n\equiv\sqrt{\varepsilon_r\mu_r}$, so</p>
$$ \boxed{\,v = \frac{c}{n},\qquad n=\sqrt{\varepsilon_r\mu_r}\,}. $$

<p><b>Step 2 — Wavelength in the medium.</b> Frequency $f$ is fixed by the source (boundary conditions force $f$ to be continuous across an interface); only the speed changes. Since $v=f\lambda$:</p>
$$ \lambda_m = \frac{v}{f} = \frac{c/n}{f} = \frac{c/f}{n} = \boxed{\frac{\lambda_0}{n}}. $$
<p>The wave physically shrinks by $n$ inside the material.</p>

<p><b>Step 3 — Intrinsic impedance.</b> With $\mu_r=1$, $\eta=\sqrt{\mu_0/(\varepsilon_0\varepsilon_r)}$. Factor out $\eta_0=\sqrt{\mu_0/\varepsilon_0}$:</p>
$$ \boxed{\,\eta = \frac{\eta_0}{\sqrt{\varepsilon_r}}\,}. $$

<p><b>Result & intuition.</b> A higher-permittivity medium slows the wave, packs the wavelength tighter, and presents a lower impedance — all by the same $\sqrt{\varepsilon_r}$ factor. This is why patch antennas on high-$\varepsilon_r$ substrates can be made small ($\lambda_m$ shrinks), and why an air-to-dielectric interface reflects (impedance mismatch $\eta_0$ vs $\eta_0/\sqrt{\varepsilon_r}$).</p>
`
  }
});
