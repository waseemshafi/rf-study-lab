// Antennas & Electromagnetics — deep exam-mastery study content
CONTENT.topics.push(
  {
    id: 'antenna',
    title: 'Antenna Fundamentals',
    category: 'Antennas & Electromagnetics',
    tags: ['antenna', 'radiation', 'impedance', 'polarization', 'far-field', 'VSWR', 'aperture'],
    summary: String.raw`An antenna is a reciprocal transducer that converts guided currents into radiated electromagnetic waves (and vice-versa) by virtue of accelerating charges.`,
    prerequisites: ['maxwell', 'comm-basics', 'path-loss'],
    intro: String.raw`<p>An <strong>antenna</strong> is the interface between a transmission line and free space: it transforms a bounded, guided wave (voltages and currents on a conductor) into an unbounded, radiating electromagnetic wave, and by reciprocity does the reverse when receiving. Radiation is not free — it arises because <em>charges are accelerated</em>. A steady DC current radiates nothing; a time-varying (AC) current produces time-varying fields whose far-field components decay only as $1/r$ and therefore carry power to infinity. This page builds the core intuition (radiation from acceleration, near/far fields, reciprocity) and the engineering machinery you must command in exams: input impedance and matching, VSWR and return loss, polarization and polarization loss, bandwidth, efficiency, resonance of the half-wave dipole, and effective aperture $A_e = G\lambda^2/(4\pi)$.</p>`,
    sections: [
      {
        h: 'Radiation from accelerating charges',
        html: String.raw`<p>The physical origin of all radiation is <strong>charge acceleration</strong>. A charge moving at constant velocity carries its field lines rigidly with it; when it accelerates, a "kink" propagates outward along the field lines at speed $c$. That kink is the radiated wave. Quantitatively, the far-field (radiation) term of the electric field of a point charge scales with the transverse acceleration:</p>
        <p>$$E_{rad} \propto \frac{q\,a_\perp}{4\pi\varepsilon_0 c^2 r}$$</p>
        <p>Two consequences follow immediately: (1) the field falls as $1/r$ (not $1/r^2$), so radiated <em>power density</em> falls as $1/r^2$ and total power through any enclosing sphere is constant — energy has genuinely left the source; (2) only the component of acceleration <em>transverse</em> to the line of sight radiates, which is why a linear current element produces a doughnut (toroidal) pattern with a null along its own axis.</p>
        <div class="callout"><strong>Intuition:</strong> A current element $I\,dl$ is just charge times acceleration in disguise: $\dot{I}\,dl = \dot{q}\,dl$ and the time-varying current is equivalent to accelerating charge. Antennas are shaped conductors that arrange for the currents to add constructively in the desired directions.</div>`
      },
      {
        h: 'Reciprocity',
        html: String.raw`<p>The <strong>reciprocity theorem</strong> (a consequence of the symmetry of Maxwell's equations in linear, isotropic media) guarantees that an antenna's transmit and receive properties are identical. Its <em>radiation pattern</em>, <em>gain</em>, <em>polarization</em>, <em>beamwidth</em>, and <em>impedance</em> are the same whether it transmits or receives. This is enormously useful: you can measure a pattern on receive and use it on transmit, and you can design a single antenna for a bidirectional link.</p>
        <ul>
          <li><strong>Same pattern:</strong> $G_{tx}(\theta,\phi) = G_{rx}(\theta,\phi)$.</li>
          <li><strong>Effective aperture link:</strong> reciprocity is what forces the universal relation $A_e = G\lambda^2/(4\pi)$ (derived below), tying the receive-side capture area to the transmit-side gain.</li>
          <li><strong>Caveat:</strong> reciprocity fails in <em>non-reciprocal</em> media (ferrites/magnetized plasma with a DC magnetic field, as in circulators/isolators).</li>
        </ul>`
      },
      {
        h: 'Near field vs far field (Fraunhofer distance)',
        html: String.raw`<p>The space around an antenna divides into regions by how the fields behave with distance $r$:</p>
        <table class="data">
          <tr><th>Region</th><th>Range</th><th>Character</th></tr>
          <tr><td>Reactive near field</td><td>$r < 0.62\sqrt{D^3/\lambda}$</td><td>Stored (reactive) energy dominates; fields ~$1/r^2$, $1/r^3$</td></tr>
          <tr><td>Radiating near field (Fresnel)</td><td>$0.62\sqrt{D^3/\lambda} < r < 2D^2/\lambda$</td><td>Pattern still changing with $r$</td></tr>
          <tr><td>Far field (Fraunhofer)</td><td>$r > 2D^2/\lambda$</td><td>Pattern shape fixed; fields ~$1/r$; wave locally planar</td></tr>
        </table>
        <p>The classic boundary is the <strong>Fraunhofer distance</strong> $r_{ff} = 2D^2/\lambda$, where $D$ is the largest antenna dimension. It is derived by requiring that the maximum phase error across the aperture, caused by treating a spherical wavefront as planar, be less than $\pi/8$ (equivalently a path difference of $\lambda/16$). Measurements and gain definitions assume far-field conditions.</p>
        <div class="callout"><strong>Why it matters:</strong> Antenna-range measurements, EIRP/RSSI predictions, and the Friis equation are only valid in the far field. For a 1 m dish at 10 GHz ($\lambda = 3$ cm), $r_{ff} = 2(1)^2/0.03 \approx 67$ m — you cannot characterise it across a lab bench.</div>`
      },
      {
        h: 'Input impedance & matching',
        html: String.raw`<p>Looking into the antenna terminals you see a complex <strong>input impedance</strong> $Z_A = R_A + jX_A$, where $R_A = R_r + R_L$ combines the <em>radiation resistance</em> $R_r$ (models power that leaves as radiation) and the <em>loss resistance</em> $R_L$ (ohmic/dielectric heating). At resonance $X_A = 0$. Maximum power transfer from a source of impedance $Z_0$ requires a <strong>conjugate match</strong> $Z_A = Z_0^*$.</p>
        <ul>
          <li>A resonant <strong>half-wave dipole</strong> has $Z_A \approx 73 + j42.5\ \Omega$ at exactly $\ell = \lambda/2$; trimming slightly shorter (to $\approx 0.47\lambda$) drives $X_A \to 0$, leaving $\approx 73\ \Omega$ — a good match to $75\ \Omega$ coax.</li>
          <li>A quarter-wave <strong>monopole</strong> over a ground plane has half the dipole's radiation resistance, $\approx 36.5\ \Omega$.</li>
          <li>Matching networks (stubs, L/T/pi networks, quarter-wave transformers, baluns) transform $Z_A$ to the line impedance and cancel reactance.</li>
        </ul>`
      },
      {
        h: 'VSWR & return loss',
        html: String.raw`<p>Mismatch reflects power. The <strong>reflection coefficient</strong> at the antenna is $\Gamma = (Z_A - Z_0)/(Z_A + Z_0)$. Derived quantities:</p>
        <ul>
          <li><strong>VSWR</strong> (voltage standing-wave ratio): $\mathrm{VSWR} = \dfrac{1+|\Gamma|}{1-|\Gamma|}$, ranging $1$ (perfect) to $\infty$ (total reflection).</li>
          <li><strong>Return loss:</strong> $RL = -20\log_{10}|\Gamma|$ dB (larger is better).</li>
          <li><strong>Mismatch loss:</strong> fraction of incident power reflected $= |\Gamma|^2$; transmitted fraction $= 1-|\Gamma|^2$.</li>
        </ul>
        <table class="data">
          <tr><th>VSWR</th><th>$|\Gamma|$</th><th>Return loss</th><th>Power reflected</th></tr>
          <tr><td>1.0</td><td>0</td><td>$\infty$</td><td>0%</td></tr>
          <tr><td>1.5</td><td>0.20</td><td>14.0 dB</td><td>4.0%</td></tr>
          <tr><td>2.0</td><td>0.33</td><td>9.5 dB</td><td>11.1%</td></tr>
          <tr><td>3.0</td><td>0.50</td><td>6.0 dB</td><td>25.0%</td></tr>
        </table>
        <p>A common acceptance spec is $\mathrm{VSWR} \le 2$ (RL $\ge 9.5$ dB), meaning under 11% of power is reflected.</p>`
      },
      {
        h: 'Polarization & polarization loss',
        html: String.raw`<p><strong>Polarization</strong> describes the orientation of the $\vec{E}$-field vector tip as the wave propagates. It can be <em>linear</em> (vertical/horizontal), <em>circular</em> (RHCP/LHCP, when two orthogonal linear components are equal in magnitude and $90°$ out of phase), or <em>elliptical</em> (the general case). A mismatch between transmit and receive polarization causes <strong>polarization loss factor</strong> (PLF):</p>
        <p>$$\mathrm{PLF} = |\hat{\rho}_t \cdot \hat{\rho}_r^*|^2 = \cos^2\psi$$</p>
        <ul>
          <li>Aligned linear ($\psi = 0$): PLF $=1$ (0 dB).</li>
          <li>Cross-polarized linear ($\psi = 90°$): PLF $=0$ (theoretically infinite loss).</li>
          <li>Linear received on circular (or vice-versa): PLF $=0.5$ ($-3$ dB) — inherent penalty.</li>
          <li>RHCP received on LHCP: PLF $=0$ — completely rejected (used to reject reflections/multipath).</li>
        </ul>
        <div class="callout"><strong>Design tip:</strong> Circular polarization tolerates unknown/tumbling orientation (satellites, GPS) at a fixed 3 dB cost against a linear counterpart; linear maximises gain when orientation is controlled.</div>`
      },
      {
        h: 'Bandwidth, efficiency & resonance',
        html: String.raw`<p><strong>Bandwidth</strong> is the frequency span over which a parameter (VSWR, gain, axial ratio, or pattern) stays within spec — often expressed as a percentage $BW\% = (f_H - f_L)/f_0 \times 100$. Electrically small antennas are high-$Q$ and narrowband (Chu limit); broadband types (spiral, log-periodic, bow-tie) trade size for bandwidth.</p>
        <p><strong>Radiation efficiency</strong> is the fraction of accepted power that is actually radiated:</p>
        <p>$$\eta_{rad} = \frac{R_r}{R_r + R_L} = \frac{P_{rad}}{P_{in}}$$</p>
        <p>This is the factor linking <em>directivity</em> $D$ to <em>gain</em> $G = \eta_{rad} D$. <strong>Total efficiency</strong> additionally folds in the mismatch: $\eta_{tot} = \eta_{rad}(1-|\Gamma|^2)$.</p>
        <p><strong>Resonance</strong> occurs where $X_A = 0$; for a wire antenna this happens near lengths that are integer multiples of $\lambda/2$. The half-wave dipole is the canonical resonant radiator because a $\lambda/2$ conductor supports a standing current with a maximum at the center feed and nulls at the ends.</p>`
      },
      {
        h: 'Effective aperture Ae = G lambda^2/(4 pi)',
        html: String.raw`<p>On receive, an antenna behaves as if it captures power from an area — its <strong>effective aperture</strong> $A_e$. If the incident power density is $S$ (W/m$^2$), the delivered power is $P_r = S\,A_e$. The universal link between aperture and gain (proved via reciprocity + thermodynamic equilibrium) is:</p>
        <p>$$\boxed{A_e = \frac{G\lambda^2}{4\pi}}$$</p>
        <ul>
          <li>For a physical aperture of area $A_{phys}$, $A_e = \eta_{ap} A_{phys}$ where $\eta_{ap}$ is aperture efficiency (0.5–0.7 typical for dishes). Inverting gives the aperture gain formula $G = \eta_{ap}\,4\pi A_{phys}/\lambda^2$ (see the Antenna Gain topic).</li>
          <li>An isotropic radiator ($G=1$) has $A_e = \lambda^2/(4\pi)$ — even a "point" receiver has finite capture area set by wavelength.</li>
          <li>This is the receive term in the Friis equation $P_r = P_t G_t G_r (\lambda/4\pi R)^2$.</li>
        </ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>Pulling the page together, you should now be able to explain:</p>
        <ul>
          <li><strong>Why antennas radiate at all:</strong> accelerating (time-varying) charge produces a detaching far field that falls as $1/r$, so real power leaves the source — a steady current cannot do this.</li>
          <li><strong>Reciprocity:</strong> the same pattern, gain, impedance and polarization apply on transmit and receive in linear media, so you can measure one and use the other.</li>
          <li><strong>Where measurements are valid:</strong> only beyond the Fraunhofer distance $r_{ff}=2D^2/\lambda$, where the wave is locally planar and the pattern has settled.</li>
          <li><strong>Matching:</strong> $Z_A=R_A+jX_A$, resonance zeroes $X_A$, and $\Gamma$, VSWR and return loss quantify how well the antenna matches the line (conjugate match $Z_A=Z_0^*$ for maximum transfer).</li>
          <li><strong>Polarization loss:</strong> $\mathrm{PLF}=\cos^2\psi$ — including the fixed $-3$ dB for linear-to-circular and total rejection for opposite-sense circular.</li>
          <li><strong>Efficiency and aperture:</strong> $\eta_{rad}=R_r/(R_r+R_L)$ links directivity to gain, and $A_e=G\lambda^2/(4\pi)$ turns a receive antenna's gain into a capture area for the link budget.</li>
        </ul></div>`
      }
    ],
    keyPoints: [
      String.raw`Radiation originates from <strong>accelerating charge</strong>; far field $\propto a_\perp/r$, so power density $\propto 1/r^2$.`,
      String.raw`<strong>Reciprocity:</strong> pattern, gain, impedance, and polarization are identical on transmit and receive (linear media).`,
      String.raw`<strong>Fraunhofer (far-field) distance</strong> $r_{ff} = 2D^2/\lambda$; patterns and Friis only valid beyond it.`,
      String.raw`Half-wave dipole: $Z_A \approx 73 + j42.5\ \Omega$ at $\lambda/2$; quarter-wave monopole $\approx 36.5\ \Omega$.`,
      String.raw`$\Gamma = (Z_A-Z_0)/(Z_A+Z_0)$; $\mathrm{VSWR}=(1+|\Gamma|)/(1-|\Gamma|)$; $RL=-20\log_{10}|\Gamma|$.`,
      String.raw`VSWR $\le 2$ reflects $<11\%$ of power (RL $\ge 9.5$ dB) — common acceptance spec.`,
      String.raw`Conjugate match $Z_A = Z_0^*$ maximises delivered power.`,
      String.raw`Polarization loss $\mathrm{PLF}=\cos^2\psi$; linear-to-circular is $-3$ dB; RHCP-to-LHCP is total rejection.`,
      String.raw`Radiation efficiency $\eta_{rad}=R_r/(R_r+R_L)$; gain $G=\eta_{rad}D$.`,
      String.raw`Effective aperture $A_e = G\lambda^2/(4\pi)$; isotropic $A_e = \lambda^2/(4\pi)$.`,
      String.raw`Electrically small antennas are inherently high-$Q$ / narrowband (Chu limit).`,
      String.raw`Total efficiency $\eta_{tot} = \eta_{rad}(1-|\Gamma|^2)$ combines heating and mismatch.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="240" fill="#1c232e"/>
          <text x="270" y="22" fill="#e6edf3" font-size="15" text-anchor="middle">Half-wave dipole: current &amp; voltage standing waves</text>
          <line x1="270" y1="60" x2="270" y2="200" stroke="#9aa7b5" stroke-width="1" stroke-dasharray="3 3"/>
          <!-- two arms -->
          <rect x="262" y="70" width="16" height="55" fill="#4dabf7"/>
          <rect x="262" y="135" width="16" height="55" fill="#4dabf7"/>
          <text x="290" y="66" fill="#9aa7b5" font-size="11">top arm (&#955;/4)</text>
          <text x="290" y="200" fill="#9aa7b5" font-size="11">bottom arm (&#955;/4)</text>
          <!-- feed -->
          <circle cx="270" cy="130" r="4" fill="#ffa94d"/>
          <text x="278" y="134" fill="#ffa94d" font-size="11">feed</text>
          <!-- current profile (sinusoid, max at center) -->
          <path d="M120,70 Q90,130 120,190" fill="none" stroke="#63e6be" stroke-width="2.5"/>
          <text x="70" y="130" fill="#63e6be" font-size="12">I(z)</text>
          <text x="60" y="150" fill="#63e6be" font-size="10">max@center</text>
          <!-- voltage profile (max at ends) -->
          <path d="M420,70 Q450,130 420,190" fill="none" stroke="#ff6b6b" stroke-width="2.5" transform="scale(-1,1) translate(-840,0)"/>
          <path d="M420,70 Q392,100 420,130 Q392,160 420,190" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
          <text x="432" y="130" fill="#ff6b6b" font-size="12">V(z)</text>
          <text x="432" y="150" fill="#ff6b6b" font-size="10">max@ends</text>
        </svg>`,
        caption: 'Half-wave dipole standing waves: current maximum at the center feed (low impedance ~73 ohm), voltage maxima at the ends.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="220" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Field regions vs distance r</text>
          <line x1="30" y1="150" x2="510" y2="150" stroke="#9aa7b5" stroke-width="1.5"/>
          <circle cx="60" cy="150" r="8" fill="#ffa94d"/>
          <text x="60" y="180" fill="#9aa7b5" font-size="10" text-anchor="middle">antenna</text>
          <line x1="180" y1="120" x2="180" y2="150" stroke="#b197fc" stroke-width="1.5" stroke-dasharray="3 3"/>
          <line x1="340" y1="110" x2="340" y2="150" stroke="#4dabf7" stroke-width="1.5" stroke-dasharray="3 3"/>
          <text x="115" y="140" fill="#ff6b6b" font-size="11" text-anchor="middle">reactive</text>
          <text x="260" y="105" fill="#b197fc" font-size="11" text-anchor="middle">radiating near (Fresnel)</text>
          <text x="425" y="105" fill="#4dabf7" font-size="11" text-anchor="middle">far field (Fraunhofer)</text>
          <text x="180" y="205" fill="#9aa7b5" font-size="10" text-anchor="middle">0.62&#8730;(D&#179;/&#955;)</text>
          <text x="340" y="205" fill="#9aa7b5" font-size="10" text-anchor="middle">2D&#178;/&#955;</text>
          <path d="M500,150 l8,-4 l0,8 z" fill="#9aa7b5"/>
          <text x="500" y="140" fill="#9aa7b5" font-size="10" text-anchor="middle">r</text>
        </svg>`,
        caption: 'Near/far field zoning. The far-field pattern is established beyond the Fraunhofer distance 2D^2/lambda.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <defs>
            <marker id="arr3-antenna" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#63e6be"/></marker>
          </defs>
          <rect width="540" height="250" fill="#1c232e"/>
          <text x="270" y="22" fill="#e6edf3" font-size="14" text-anchor="middle">Radiation mechanism: acceleration detaches field lines</text>
          <rect x="20" y="80" width="150" height="70" rx="6" fill="#1c232e" stroke="#4dabf7" stroke-width="1.8"/>
          <text x="95" y="108" fill="#e6edf3" font-size="12" text-anchor="middle">Accelerating</text>
          <text x="95" y="126" fill="#9aa7b5" font-size="11" text-anchor="middle">charge (I&#775; dl)</text>
          <rect x="200" y="80" width="150" height="70" rx="6" fill="#1c232e" stroke="#ffa94d" stroke-width="1.8"/>
          <text x="275" y="108" fill="#e6edf3" font-size="12" text-anchor="middle">Field-line "kink"</text>
          <text x="275" y="126" fill="#9aa7b5" font-size="11" text-anchor="middle">detaches, closes on itself</text>
          <rect x="380" y="80" width="150" height="70" rx="6" fill="#1c232e" stroke="#63e6be" stroke-width="1.8"/>
          <text x="455" y="108" fill="#e6edf3" font-size="12" text-anchor="middle">Propagating wave</text>
          <text x="455" y="126" fill="#9aa7b5" font-size="11" text-anchor="middle">far field &#8733; a&#8869;/r</text>
          <line x1="170" y1="115" x2="198" y2="115" stroke="#63e6be" stroke-width="2" marker-end="url(#arr3-antenna)"/>
          <line x1="350" y1="115" x2="378" y2="115" stroke="#63e6be" stroke-width="2" marker-end="url(#arr3-antenna)"/>
          <rect x="120" y="185" width="300" height="46" rx="6" fill="#1c232e" stroke="#b197fc" stroke-width="1.5"/>
          <text x="270" y="205" fill="#b197fc" font-size="12" text-anchor="middle">DC (constant v) &#8594; no kink &#8594; no radiation</text>
          <text x="270" y="222" fill="#9aa7b5" font-size="10.5" text-anchor="middle">only time-varying (accelerated) current radiates</text>
        </svg>`,
        caption: 'Radiation chain: a time-varying (accelerating) current produces a kink that detaches from the near-field lines and propagates outward as the 1/r far field; steady DC current radiates nothing.'
      }
    ],
    equations: [
      {
        title: 'Fraunhofer (far-field) distance',
        tex: String.raw`$$r_{ff} = \frac{2D^2}{\lambda}$$`,
        derivation: String.raw`<p>Consider an aperture of size $D$. A ray from the far edge travels a slightly longer path than one from the center to a distant point $r$. The extra path is $\Delta \approx (D/2)^2/(2r) = D^2/(8r)$ by the binomial expansion of $\sqrt{r^2+(D/2)^2}$. Requiring the phase error $k\Delta = (2\pi/\lambda)\Delta \le \pi/8$ (a $\lambda/16$ path tolerance) gives $D^2/(8r) \le \lambda/16$, i.e. $r \ge 2D^2/\lambda$.</p>`
      },
      {
        title: 'Reflection coefficient, VSWR and return loss',
        tex: String.raw`$$\Gamma = \frac{Z_A - Z_0}{Z_A + Z_0},\quad \mathrm{VSWR} = \frac{1+|\Gamma|}{1-|\Gamma|},\quad RL = -20\log_{10}|\Gamma|$$`,
        derivation: String.raw`<p>On a mismatched line the forward and reflected voltages superpose to form a standing wave with maxima $|V^+|(1+|\Gamma|)$ and minima $|V^+|(1-|\Gamma|)$. Their ratio is the VSWR. Return loss expresses the reflected power ratio $|\Gamma|^2$ in dB: $RL = -10\log_{10}|\Gamma|^2 = -20\log_{10}|\Gamma|$.</p>`
      },
      {
        title: 'Radiation efficiency and gain',
        tex: String.raw`$$\eta_{rad} = \frac{R_r}{R_r + R_L}, \qquad G = \eta_{rad}\,D$$`,
        derivation: String.raw`<p>The terminal current $I$ dissipates $\tfrac12 I^2 R_r$ as radiation and $\tfrac12 I^2 R_L$ as heat. Efficiency is the radiated fraction $R_r/(R_r+R_L)$. Gain is directivity reduced by this efficiency, since directivity assumes all accepted power radiates.</p>`
      },
      {
        title: 'Effective aperture from gain',
        tex: String.raw`$$A_e = \frac{G\lambda^2}{4\pi}$$`,
        derivation: String.raw`<p>Place two antennas in a matched, isothermal blackbody cavity at temperature $T$. In equilibrium each must absorb and re-radiate equal power in every direction and frequency band. Equating the Johnson-Nyquist power $kT\,B$ delivered to a resistor with the power an antenna captures from isotropic radiation of spectral brightness $2kT/\lambda^2$ per polarization, integrated over its pattern, forces $A_e/G$ to be a universal constant $\lambda^2/(4\pi)$, independent of antenna type. Hence $A_e = G\lambda^2/(4\pi)$.</p>`
      },
      {
        title: 'Polarization loss factor',
        tex: String.raw`$$\mathrm{PLF} = |\hat{\rho}_t \cdot \hat{\rho}_r^*|^2$$`,
        derivation: String.raw`<p>The received voltage is proportional to the projection of the incoming field's polarization unit vector $\hat{\rho}_t$ onto the antenna's polarization $\hat{\rho}_r$. Power scales with the magnitude squared of that complex inner product. For two linear polarizations at angle $\psi$, $\hat{\rho}_t\cdot\hat{\rho}_r = \cos\psi$, giving $\mathrm{PLF}=\cos^2\psi$.</p>`
      },
      {
        title: 'Half-wave dipole radiation resistance',
        tex: String.raw`$$R_r \approx 73\ \Omega \quad (\ell = \lambda/2)$$`,
        derivation: String.raw`<p>Integrating the far-field of the assumed sinusoidal current $I(z)=I_0\cos(kz)$ over a sphere yields $P_{rad} = \tfrac{\eta_0 I_0^2}{4\pi}\,C_{in}(2\pi)/2$ where $C_{in}$ is the cosine integral. With $\eta_0 = 377\ \Omega$ this evaluates to $R_r = 2P_{rad}/I_0^2 \approx 73.1\ \Omega$; the reactance is $+42.5\ \Omega$, cancelled by shortening to $\approx 0.47\lambda$.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What physically causes radiation?`, back: String.raw`Accelerating (time-varying) charge/current; the far field $\propto a_\perp$ and decays as $1/r$.` },
      { front: String.raw`State the far-field (Fraunhofer) distance.`, back: String.raw`$r_{ff}=2D^2/\lambda$, from a $\le\pi/8$ phase-error criterion across the aperture.` },
      { front: String.raw`Input impedance of a resonant half-wave dipole?`, back: String.raw`$\approx 73 + j42.5\ \Omega$; trimming to $\approx 0.47\lambda$ zeroes the reactance.` },
      { front: String.raw`Quarter-wave monopole impedance?`, back: String.raw`$\approx 36.5\ \Omega$ — half the dipole's radiation resistance (over ground plane).` },
      { front: String.raw`Define VSWR in terms of $|\Gamma|$.`, back: String.raw`$\mathrm{VSWR}=(1+|\Gamma|)/(1-|\Gamma|)$.` },
      { front: String.raw`Return loss for VSWR = 2?`, back: String.raw`$|\Gamma|=0.33$, RL $\approx 9.5$ dB, $\approx 11\%$ power reflected.` },
      { front: String.raw`What does reciprocity guarantee?`, back: String.raw`Identical pattern, gain, impedance and polarization on TX and RX (in linear media).` },
      { front: String.raw`Polarization loss: linear received on circular?`, back: String.raw`PLF $=0.5$, i.e. a fixed $-3$ dB penalty.` },
      { front: String.raw`Radiation efficiency formula?`, back: String.raw`$\eta_{rad}=R_r/(R_r+R_L)$; then $G=\eta_{rad}D$.` },
      { front: String.raw`Effective aperture of an isotropic antenna?`, back: String.raw`$A_e=\lambda^2/(4\pi)$ (set $G=1$ in $A_e=G\lambda^2/4\pi$).` },
      { front: String.raw`Condition for maximum power transfer at terminals?`, back: String.raw`Conjugate match $Z_A=Z_0^*$.` },
      { front: String.raw`Why use circular polarization for satellites?`, back: String.raw`Tolerates unknown/rotating orientation and Faraday rotation; only a 3 dB cost vs matched linear.` },
      { front: String.raw`What limits electrically small antenna bandwidth?`, back: String.raw`High $Q$ (Chu limit): small radiators store large reactive energy relative to radiated power.` },
      { front: String.raw`Total efficiency including mismatch?`, back: String.raw`$\eta_{tot}=\eta_{rad}(1-|\Gamma|^2)$.` }
    ],
    mcqs: [
      { q: String.raw`Radiated far-field amplitude of an accelerating charge varies with distance as:`, options: [String.raw`$1/r$`, String.raw`$1/r^2$`, String.raw`$1/r^3$`, String.raw`constant`], answer: 0, explain: String.raw`The radiation term $\propto a_\perp/r$; power density then $\propto 1/r^2$, conserving total radiated power.` },
      { q: String.raw`The Fraunhofer distance for an aperture of size $D$ is:`, options: [String.raw`$D^2/\lambda$`, String.raw`$2D^2/\lambda$`, String.raw`$\lambda/2D$`, String.raw`$0.62\sqrt{D^3/\lambda}$`], answer: 1, explain: String.raw`$r_{ff}=2D^2/\lambda$; the $0.62\sqrt{D^3/\lambda}$ expression is the reactive/near boundary.` },
      { q: String.raw`A resonant half-wave dipole (trimmed) presents approximately:`, options: [String.raw`$36\ \Omega$`, String.raw`$50\ \Omega$`, String.raw`$73\ \Omega$`, String.raw`$377\ \Omega$`], answer: 2, explain: String.raw`Radiation resistance $\approx 73\ \Omega$; reactance nulled by shortening to $\approx 0.47\lambda$.` },
      { q: String.raw`For VSWR = 3, the fraction of incident power reflected is:`, options: [String.raw`4%`, String.raw`11%`, String.raw`25%`, String.raw`50%`], answer: 2, explain: String.raw`$|\Gamma|=(3-1)/(3+1)=0.5$, so $|\Gamma|^2=0.25=25\%$.` },
      { q: String.raw`Reciprocity fails in:`, options: [String.raw`free space`, String.raw`a magnetized ferrite`, String.raw`a copper dipole`, String.raw`a dielectric lens`], answer: 1, explain: String.raw`Magnetized ferrites/plasmas are non-reciprocal (basis of circulators/isolators).` },
      { q: String.raw`Receiving a linearly polarized wave on a circularly polarized antenna gives a loss of:`, options: [String.raw`0 dB`, String.raw`3 dB`, String.raw`6 dB`, String.raw`total (infinite)`], answer: 1, explain: String.raw`PLF $=0.5 \Rightarrow -3$ dB inherent polarization mismatch.` },
      { q: String.raw`Antenna gain relates to directivity by:`, options: [String.raw`$G=D+\eta$`, String.raw`$G=\eta_{rad}D$`, String.raw`$G=D/\eta_{rad}$`, String.raw`$G=D^2$`], answer: 1, explain: String.raw`Gain is directivity scaled by radiation efficiency.` },
      { q: String.raw`Effective aperture of an isotropic radiator is:`, options: [String.raw`$\lambda^2/4\pi$`, String.raw`$4\pi/\lambda^2$`, String.raw`$\lambda^2$`, String.raw`$\lambda/2$`], answer: 0, explain: String.raw`$A_e=G\lambda^2/4\pi$ with $G=1$.` },
      { q: String.raw`A quarter-wave monopole over a perfect ground has impedance about:`, options: [String.raw`$73\ \Omega$`, String.raw`$50\ \Omega$`, String.raw`$36.5\ \Omega$`, String.raw`$300\ \Omega$`], answer: 2, explain: String.raw`Image theory halves the dipole's radiation resistance: $\approx 36.5\ \Omega$.` },
      { q: String.raw`Maximum power transfer from source $Z_0$ to antenna $Z_A$ requires:`, options: [String.raw`$Z_A=Z_0$`, String.raw`$Z_A=Z_0^*$`, String.raw`$Z_A=0$`, String.raw`$Z_A\to\infty$`], answer: 1, explain: String.raw`Conjugate matching cancels reactance and equalises resistances.` },
      { q: String.raw`Which best characterizes the reactive near field?`, options: [String.raw`fields ~$1/r$`, String.raw`stored (non-radiating) energy dominates`, String.raw`plane-wave region`, String.raw`fixed pattern`], answer: 1, explain: String.raw`Reactive energy (stored, ~$1/r^2$, $1/r^3$) dominates close to the antenna.` },
      { q: String.raw`Two cross-polarized linear antennas ($\psi=90°$) have PLF:`, options: [String.raw`1`, String.raw`0.5`, String.raw`0`, String.raw`2`], answer: 2, explain: String.raw`$\cos^2 90°=0$ — theoretically no coupling.` }
    ],
    numericals: [
      { q: String.raw`Find the length of a resonant half-wave dipole for $f=900$ MHz (use free-space $\lambda$, then apply the $0.95$ shortening factor).`, solution: String.raw`<p><b>Formula.</b> $$\ell = 0.95\,\frac{\lambda}{2},\qquad \lambda=\frac{c}{f}$$ where $\ell$ = practical dipole length (m), $\lambda$ = free-space wavelength (m), $c=3\times10^8$ m/s, $f$ = frequency (Hz), and $0.95$ is the velocity/end-effect shortening factor.</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{9\times10^8},\qquad \ell = 0.95\times\frac{\lambda}{2}$$</p>
      <p><b>Compute.</b> $\lambda = 0.333$ m, so the ideal $\lambda/2 = 0.167$ m. Applying the factor: $\ell = 0.95\times0.167 = 0.158$ m $\approx 15.8$ cm.</p>
      <p><b>Explanation.</b> The dipole is trimmed a few percent short of a physical half-wavelength so end-effects zero the reactance at resonance. A $\sim16$ cm rod is a sensible size for a 900 MHz whip, confirming the answer.</p>` },
      { q: String.raw`A 2.4 m dish operates at 12 GHz. Compute the Fraunhofer distance.`, solution: String.raw`<p><b>Formula.</b> $$r_{ff}=\frac{2D^2}{\lambda},\qquad \lambda=\frac{c}{f}$$ where $r_{ff}$ = far-field distance (m), $D$ = largest aperture dimension (m), $\lambda$ = wavelength (m).</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{1.2\times10^{10}},\qquad r_{ff}=\frac{2(2.4)^2}{\lambda}$$</p>
      <p><b>Compute.</b> $\lambda=0.025$ m. $r_{ff}=\dfrac{2\times5.76}{0.025}=\dfrac{11.52}{0.025}=460.8$ m.</p>
      <p><b>Explanation.</b> The far field only begins nearly half a kilometre away, so this dish cannot be characterised across a room — antenna ranges must be long, or use compact-range/near-field techniques.</p>` },
      { q: String.raw`An antenna has $Z_A=73\ \Omega$ on a $50\ \Omega$ line. Find $\Gamma$, VSWR, and return loss.`, solution: String.raw`<p><b>Formula.</b> $$\Gamma=\frac{Z_A-Z_0}{Z_A+Z_0},\quad \mathrm{VSWR}=\frac{1+|\Gamma|}{1-|\Gamma|},\quad RL=-20\log_{10}|\Gamma|$$ where $Z_A$ = antenna impedance, $Z_0$ = line impedance, $\Gamma$ = reflection coefficient, $RL$ = return loss (dB).</p>
      <p><b>Substitute.</b> $$\Gamma=\frac{73-50}{73+50}=\frac{23}{123},\quad \mathrm{VSWR}=\frac{1+0.187}{1-0.187},\quad RL=-20\log_{10}(0.187)$$</p>
      <p><b>Compute.</b> $\Gamma=0.187$; VSWR$=\dfrac{1.187}{0.813}=1.46$; $RL=-20\log_{10}(0.187)=14.6$ dB.</p>
      <p><b>Explanation.</b> A raw $73\ \Omega$ dipole on $50\ \Omega$ coax gives VSWR $1.46$ (well under the usual $\le 2$ spec) and reflects only $|\Gamma|^2\approx3.5\%$ of power — an acceptable match even without a network.</p>` },
      { q: String.raw`A GPS antenna at 1.575 GHz has $G=3$ dBi. Find its effective aperture.`, solution: String.raw`<p><b>Formula.</b> $$A_e=\frac{G\lambda^2}{4\pi},\qquad \lambda=\frac{c}{f},\qquad G=10^{G_{\mathrm{dBi}}/10}$$ where $A_e$ = effective aperture (m$^2$), $G$ = linear gain, $\lambda$ = wavelength (m).</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{1.575\times10^9},\quad G=10^{3/10}=10^{0.3},\quad A_e=\frac{G\lambda^2}{4\pi}$$</p>
      <p><b>Compute.</b> $\lambda=0.1905$ m, $G=2.0$ (linear). $A_e=\dfrac{2.0\times(0.1905)^2}{4\pi}=\dfrac{2.0\times0.0363}{12.57}=\dfrac{0.0726}{12.57}=5.78\times10^{-3}$ m$^2\approx57.8$ cm$^2$.</p>
      <p><b>Explanation.</b> Even a modest-gain patch presents about the area of a small coaster to the incoming wave. Capture area scales with $\lambda^2$, so lower-frequency antennas of the same gain are physically larger.</p>` },
      { q: String.raw`A dipole has $R_r=73\ \Omega$ and $R_L=7\ \Omega$. Find radiation efficiency and, if directivity is 2.15 dBi, its gain in dBi.`, solution: String.raw`<p><b>Formula.</b> $$\eta_{rad}=\frac{R_r}{R_r+R_L},\qquad G_{\mathrm{dBi}}=D_{\mathrm{dBi}}+10\log_{10}\eta_{rad}$$ where $R_r$ = radiation resistance, $R_L$ = loss resistance, $\eta_{rad}$ = radiation efficiency, $D$ = directivity.</p>
      <p><b>Substitute.</b> $$\eta_{rad}=\frac{73}{73+7}=\frac{73}{80},\qquad G=2.15+10\log_{10}(0.9125)$$</p>
      <p><b>Compute.</b> $\eta_{rad}=0.9125$, i.e. $10\log_{10}(0.9125)=-0.40$ dB. $G=2.15-0.40=1.75$ dBi.</p>
      <p><b>Explanation.</b> Ohmic loss of $7\ \Omega$ costs only $0.4$ dB because it is small next to the $73\ \Omega$ radiation resistance — efficient antennas are ones whose radiation resistance dominates their loss resistance.</p>` },
      { q: String.raw`A transmit antenna is vertically polarized; the receive dipole is tilted $30°$. Compute the polarization loss.`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{PLF}=\cos^2\psi,\qquad L_{\mathrm{dB}}=10\log_{10}(\mathrm{PLF})$$ where $\mathrm{PLF}$ = polarization loss factor and $\psi$ = angle between the two linear polarizations.</p>
      <p><b>Substitute.</b> $$\mathrm{PLF}=\cos^2(30°),\qquad L_{\mathrm{dB}}=10\log_{10}(\cos^2 30°)$$</p>
      <p><b>Compute.</b> $\cos30°=0.866$, so $\mathrm{PLF}=(0.866)^2=0.75$; $L_{\mathrm{dB}}=10\log_{10}(0.75)=-1.25$ dB.</p>
      <p><b>Explanation.</b> A $30°$ tilt costs only $1.25$ dB, but the loss grows steeply as $\psi\to90°$ (cross-pol), where it becomes total — which is why alignment matters far more near orthogonality.</p>` }
    ],
    realWorld: String.raw`<p>Every wireless device is a study in these fundamentals. A phone's PCB antenna is deliberately made physically small and therefore high-$Q$, so designers fight the Chu limit with clever matching networks to hit VSWR $\le 2$ across LTE/5G bands. GPS and satellite links use RHCP to survive Faraday rotation in the ionosphere and tumbling geometry, accepting the 3 dB polarization penalty. Broadcast and cellular base stations trim dipoles to $0.47\lambda$ for a clean $\approx 73\ \Omega$ resonance and use baluns to feed them from coax. Antenna test ranges and anechoic chambers are built long enough to reach $2D^2/\lambda$ so that measured gain and pattern are genuinely far-field. And the $A_e=G\lambda^2/4\pi$ relation is what lets link-budget engineers convert a receive antenna's gain directly into captured signal power in the Friis equation.</p>`,
    related: ['maxwell', 'antenna-gain', 'antenna-types', 'path-loss', 'link-budget']
  },

  {
    id: 'antenna-gain',
    title: 'Antenna Gain',
    category: 'Antennas & Electromagnetics',
    tags: ['gain', 'directivity', 'dBi', 'dBd', 'aperture', 'EIRP', 'efficiency'],
    summary: String.raw`Antenna gain measures how strongly an antenna concentrates radiated power in its best direction relative to an isotropic reference, folding in efficiency losses.`,
    prerequisites: ['antenna', 'maxwell', 'link-budget'],
    intro: String.raw`<p><strong>Gain</strong> is the single most quoted antenna figure of merit. It answers: "how much stronger is the signal in the peak direction than it would be from a lossless isotropic radiator emitting the same total power?" Gain combines two ideas — <em>directivity</em> (how tightly the pattern focuses energy) and <em>efficiency</em> (how much accepted power is actually radiated). This page defines the isotropic reference, distinguishes $\mathrm{dBi}$ from $\mathrm{dBd}$ (the fixed $2.15$ dB offset), derives the aperture gain formula $G = \eta\,4\pi A/\lambda^2$, presents the practical gain–beamwidth relation $G \approx 26000/(\theta_{az}\theta_{el})$, and explains the crucial frequency-scaling rule: a fixed-size aperture gains $+6$ dB per octave.</p>`,
    sections: [
      {
        h: 'The isotropic reference and directivity',
        html: String.raw`<p>An <strong>isotropic radiator</strong> is a fictional lossless point source that radiates equally in all $4\pi$ steradians. It is the reference against which gain in $\mathrm{dBi}$ is measured. <strong>Directivity</strong> is the ratio of the radiation intensity $U(\theta,\phi)$ in a given direction to the average intensity over all directions:</p>
        <p>$$D(\theta,\phi) = \frac{U(\theta,\phi)}{U_{avg}} = \frac{4\pi\,U(\theta,\phi)}{P_{rad}}$$</p>
        <p>The peak (maximum) directivity $D_0$ is what people usually mean by "directivity." It is purely a pattern property — a lossless quantity describing shape, not loss.</p>
        <ul>
          <li>Isotropic: $D_0 = 1$ (0 dBi).</li>
          <li>Short (Hertzian) dipole: $D_0 = 1.5$ (1.76 dBi).</li>
          <li>Half-wave dipole: $D_0 = 1.64$ (2.15 dBi).</li>
        </ul>`
      },
      {
        h: 'Gain vs directivity: the efficiency link',
        html: String.raw`<p><strong>Gain</strong> is directivity discounted by <em>radiation efficiency</em> $\eta_{rad}$ (which accounts for ohmic and dielectric heating in the antenna, but <em>not</em> impedance mismatch by the IEEE definition):</p>
        <p>$$G = \eta_{rad}\,D$$</p>
        <p>A perfectly efficient antenna ($\eta_{rad}=1$) has $G=D$. Real antennas have $\eta_{rad}<1$, so gain is always $\le$ directivity. <strong>Realized gain</strong> further multiplies by the mismatch factor $(1-|\Gamma|^2)$ to describe what actually appears from the terminals.</p>
        <div class="callout"><strong>Watch the definition:</strong> "Gain" (IEEE) excludes mismatch; "realized gain" includes it; "directivity" excludes both loss and mismatch. Exams and datasheets sometimes blur these — read carefully.</div>`
      },
      {
        h: 'dBi vs dBd — the 2.15 dB offset',
        html: String.raw`<p>Two reference antennas are in common use:</p>
        <ul>
          <li><strong>dBi</strong>: gain relative to an <em>isotropic</em> radiator.</li>
          <li><strong>dBd</strong>: gain relative to a <em>half-wave dipole</em>.</li>
        </ul>
        <p>Because the half-wave dipole itself has $D_0 = 1.64 = 2.15$ dBi over isotropic, the conversion is a fixed offset:</p>
        <p>$$G_{\mathrm{dBi}} = G_{\mathrm{dBd}} + 2.15\ \mathrm{dB}$$</p>
        <p>So a "6 dBd" Yagi is "8.15 dBi." Marketing frequently quotes dBi to make numbers look bigger — always confirm the reference.</p>`
      },
      {
        h: 'Aperture gain: G = eta 4 pi A / lambda^2',
        html: String.raw`<p>For aperture antennas (dishes, horns, arrays) gain is set by how many wavelengths across the aperture is. Starting from the effective-aperture relation $A_e = G\lambda^2/4\pi$ and writing $A_e = \eta_{ap} A_{phys}$:</p>
        <p>$$\boxed{G = \eta_{ap}\,\frac{4\pi A_{phys}}{\lambda^2}}$$</p>
        <p>For a circular dish of diameter $D$, $A_{phys}=\pi D^2/4$, so:</p>
        <p>$$G = \eta_{ap}\left(\frac{\pi D}{\lambda}\right)^2$$</p>
        <ul>
          <li>Aperture efficiency $\eta_{ap}$ is typically $0.5$–$0.7$ (illumination taper, spillover, blockage, surface error).</li>
          <li>Gain grows as the <em>square</em> of the electrical size $D/\lambda$: doubling the diameter adds 6 dB; doubling the frequency also adds 6 dB.</li>
        </ul>`
      },
      {
        h: 'Gain–beamwidth relation',
        html: String.raw`<p>Focusing energy into a narrow beam is exactly what raises gain, so gain and beamwidth are inversely coupled. Approximating the main beam as a rectangular solid angle $\Omega_A \approx \theta_{az}\theta_{el}$ (in radians) gives $G \approx 4\pi/\Omega_A$. Converting to degrees and folding in typical efficiency yields the practical engineering rule:</p>
        <p>$$G \approx \frac{26000}{\theta_{az}^\circ\,\theta_{el}^\circ}$$</p>
        <p>Values of $27000$–$41000$ appear in different texts depending on the assumed efficiency and pattern; $\approx 26000$–$30000$ is common for real antennas, $41253$ for the ideal lossless case ($4\pi$ sr in square degrees).</p>
        <div class="callout"><strong>Sanity check:</strong> A dish with $\theta_{az}=\theta_{el}=2°$ gives $G\approx 26000/4 = 6500 \approx 38.1$ dBi — right for a large microwave dish.</div>`
      },
      {
        h: 'Frequency scaling: +6 dB per octave',
        html: String.raw`<p>For a <em>fixed physical aperture</em>, gain rises with frequency because the aperture becomes electrically larger:</p>
        <p>$$G \propto \frac{A_{phys}}{\lambda^2} \propto f^2$$</p>
        <p>Doubling frequency (one octave) multiplies gain by 4, i.e. <strong>+6 dB</strong>. This is why the same dish gives far more gain at Ka-band than at C-band. But note the trade in the Friis link: free-space path loss also rises as $f^2$, so a <em>fixed-aperture</em> dish at both ends can actually improve the link with frequency, whereas <em>fixed-gain</em> antennas suffer the full $f^2$ path-loss penalty.</p>
        <table class="data">
          <tr><th>Scenario</th><th>Gain vs $f$</th><th>Net Friis (both fixed aperture)</th></tr>
          <tr><td>Fixed gain antennas</td><td>constant</td><td>worsens as $f^2$</td></tr>
          <tr><td>Fixed aperture antennas</td><td>$+6$ dB/oct each</td><td>improves as $f^2$</td></tr>
        </table>`
      },
      {
        h: 'EIRP and system context',
        html: String.raw`<p>Gain enters system budgets through <strong>EIRP</strong> (Effective Isotropic Radiated Power):</p>
        <p>$$\mathrm{EIRP\,(dBW)} = P_t\,(\mathrm{dBW}) + G_t\,(\mathrm{dBi}) - L_{feed}\,(\mathrm{dB})$$</p>
        <p>EIRP is the power an isotropic antenna would need to produce the same field in the boresight direction. On the receive side, gain contributes to $G/T$ (gain-to-noise-temperature), the key figure of merit for sensitive links. Both feed directly into the Friis and link-budget equations.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to reason about gain from several angles:</p>
        <ul>
          <li><strong>What gain is:</strong> the boresight intensity relative to a lossless isotropic source radiating the same power — a redistribution of power, never a creation of it.</li>
          <li><strong>Directivity vs gain vs realized gain:</strong> $D$ is pure pattern shape; $G=\eta_{rad}D$ folds in heating loss; realized gain adds the mismatch factor $(1-|\Gamma|^2)$.</li>
          <li><strong>References:</strong> $G_{\mathrm{dBi}}=G_{\mathrm{dBd}}+2.15$ — always check whether a datasheet quotes dBi or dBd.</li>
          <li><strong>Aperture antennas:</strong> $G=\eta_{ap}(\pi D/\lambda)^2$, so gain rises as electrical size squared — $+6$ dB per doubling of diameter or of frequency.</li>
          <li><strong>Gain-beamwidth link:</strong> $G\approx26000/(\theta_{az}\theta_{el})$ ties high gain to narrow beams and tight pointing.</li>
          <li><strong>System context:</strong> gain enters transmit budgets through $\mathrm{EIRP}=P_t+G_t-L_{feed}$ and receive budgets through $G/T$.</li>
        </ul></div>`
      }
    ],
    keyPoints: [
      String.raw`Directivity $D_0=4\pi U_{max}/P_{rad}$ is a lossless pattern property; half-wave dipole $D_0=1.64=2.15$ dBi.`,
      String.raw`Gain $G=\eta_{rad}D$; realized gain adds mismatch factor $(1-|\Gamma|^2)$.`,
      String.raw`$G_{\mathrm{dBi}} = G_{\mathrm{dBd}} + 2.15$ dB (dipole reference is 2.15 dBi over isotropic).`,
      String.raw`Aperture gain $G=\eta_{ap}\,4\pi A/\lambda^2$; for a dish $G=\eta_{ap}(\pi D/\lambda)^2$.`,
      String.raw`Gain $\propto (D/\lambda)^2$: doubling diameter or frequency adds 6 dB.`,
      String.raw`Practical gain–beamwidth rule: $G\approx 26000/(\theta_{az}\theta_{el})$ (degrees); ideal $41253$.`,
      String.raw`Fixed aperture: gain rises $+6$ dB/octave with frequency.`,
      String.raw`Aperture efficiency $\eta_{ap}\approx 0.5$–$0.7$ (taper, spillover, blockage, surface error).`,
      String.raw`$\mathrm{EIRP}=P_t+G_t-L_{feed}$ (dB) feeds the link budget.`,
      String.raw`Gain is a ratio (dimensionless / dBi); it does not create power, only redistributes it directionally.`,
      String.raw`High gain $\Leftrightarrow$ narrow beam $\Leftrightarrow$ tighter pointing tolerance.`,
      String.raw`Short dipole $D_0=1.5$ (1.76 dBi); isotropic $D_0=1$ (0 dBi).`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="260" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Isotropic vs directional: same power, concentrated</text>
          <!-- isotropic -->
          <circle cx="140" cy="150" r="70" fill="none" stroke="#9aa7b5" stroke-width="2" stroke-dasharray="4 4"/>
          <circle cx="140" cy="150" r="4" fill="#ffa94d"/>
          <text x="140" y="240" fill="#9aa7b5" font-size="12" text-anchor="middle">isotropic (G = 1)</text>
          <!-- directional beam -->
          <path d="M400,150 C420,90 460,80 500,70 C470,110 470,190 500,230 C460,220 420,210 400,150 Z" fill="#4dabf7" opacity="0.35" stroke="#4dabf7" stroke-width="2"/>
          <circle cx="400" cy="150" r="4" fill="#ffa94d"/>
          <text x="440" y="245" fill="#4dabf7" font-size="12" text-anchor="middle">high gain (narrow beam)</text>
          <line x1="400" y1="150" x2="510" y2="150" stroke="#63e6be" stroke-width="1.5" stroke-dasharray="3 3"/>
          <text x="470" y="140" fill="#63e6be" font-size="11">boresight</text>
        </svg>`,
        caption: 'Gain redistributes a fixed radiated power into a narrower solid angle, raising boresight intensity relative to isotropic.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="220" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Dish gain vs diameter (fixed frequency, +6 dB per doubling)</text>
          <line x1="60" y1="180" x2="510" y2="180" stroke="#9aa7b5" stroke-width="1.5"/>
          <line x1="60" y1="180" x2="60" y2="40" stroke="#9aa7b5" stroke-width="1.5"/>
          <text x="285" y="210" fill="#9aa7b5" font-size="11" text-anchor="middle">diameter D (log)</text>
          <text x="24" y="110" fill="#9aa7b5" font-size="11" transform="rotate(-90 24 110)">Gain (dBi)</text>
          <polyline points="70,170 180,140 290,110 400,80 500,50" fill="none" stroke="#63e6be" stroke-width="2.5"/>
          <circle cx="180" cy="140" r="4" fill="#4dabf7"/><text x="180" y="132" fill="#4dabf7" font-size="10" text-anchor="middle">D</text>
          <circle cx="290" cy="110" r="4" fill="#4dabf7"/><text x="290" y="102" fill="#4dabf7" font-size="10" text-anchor="middle">2D (+6dB)</text>
          <circle cx="400" cy="80" r="4" fill="#4dabf7"/><text x="405" y="72" fill="#4dabf7" font-size="10" text-anchor="middle">4D (+12dB)</text>
        </svg>`,
        caption: 'Gain scales as (D/lambda)^2 — each doubling of diameter (or frequency) adds 6 dB.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <defs>
            <marker id="arr3-antenna-gain" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#63e6be"/></marker>
          </defs>
          <rect width="540" height="210" fill="#1c232e"/>
          <text x="270" y="22" fill="#e6edf3" font-size="14" text-anchor="middle">Anatomy of gain &amp; EIRP</text>
          <rect x="12" y="55" width="118" height="66" rx="6" fill="#1c232e" stroke="#4dabf7" stroke-width="1.8"/>
          <text x="71" y="82" fill="#e6edf3" font-size="12" text-anchor="middle">Input power</text>
          <text x="71" y="100" fill="#9aa7b5" font-size="11" text-anchor="middle">P&#8348; (accepted)</text>
          <rect x="150" y="55" width="118" height="66" rx="6" fill="#1c232e" stroke="#ffa94d" stroke-width="1.8"/>
          <text x="209" y="78" fill="#e6edf3" font-size="12" text-anchor="middle">Efficiency</text>
          <text x="209" y="95" fill="#9aa7b5" font-size="10.5" text-anchor="middle">&#215;&#951;&#7523;&#7488;&#7496; (heat loss)</text>
          <text x="209" y="111" fill="#9aa7b5" font-size="10.5" text-anchor="middle">G = &#951;&#7523;&#7488;&#7496; D</text>
          <rect x="288" y="55" width="118" height="66" rx="6" fill="#1c232e" stroke="#b197fc" stroke-width="1.8"/>
          <text x="347" y="78" fill="#e6edf3" font-size="12" text-anchor="middle">Directivity</text>
          <text x="347" y="95" fill="#9aa7b5" font-size="10.5" text-anchor="middle">focus into &#937;&#7488;</text>
          <text x="347" y="111" fill="#9aa7b5" font-size="10.5" text-anchor="middle">&#215; gain factor</text>
          <rect x="426" y="55" width="102" height="66" rx="6" fill="#1c232e" stroke="#63e6be" stroke-width="1.8"/>
          <text x="477" y="82" fill="#e6edf3" font-size="12" text-anchor="middle">EIRP</text>
          <text x="477" y="100" fill="#9aa7b5" font-size="10.5" text-anchor="middle">P&#8348;+G&#8348;&#8722;L</text>
          <line x1="130" y1="88" x2="148" y2="88" stroke="#63e6be" stroke-width="2" marker-end="url(#arr3-antenna-gain)"/>
          <line x1="268" y1="88" x2="286" y2="88" stroke="#63e6be" stroke-width="2" marker-end="url(#arr3-antenna-gain)"/>
          <line x1="406" y1="88" x2="424" y2="88" stroke="#63e6be" stroke-width="2" marker-end="url(#arr3-antenna-gain)"/>
          <text x="270" y="155" fill="#9aa7b5" font-size="11" text-anchor="middle">Realized gain also multiplies by mismatch (1&#8722;|&#915;|&#178;)</text>
          <text x="270" y="180" fill="#b197fc" font-size="11" text-anchor="middle">Gain redistributes power; it never creates it.</text>
        </svg>`,
        caption: 'From accepted input power to EIRP: radiation efficiency turns directivity into gain, then transmit power and feed loss set the isotropic-equivalent radiated power.'
      }
    ],
    equations: [
      {
        title: 'Directivity',
        tex: String.raw`$$D(\theta,\phi) = \frac{4\pi\,U(\theta,\phi)}{P_{rad}}$$`,
        derivation: String.raw`<p>Average intensity over the sphere is $U_{avg}=P_{rad}/4\pi$ (total power spread over $4\pi$ sr). Directivity is the ratio of intensity in a direction to this average, hence the $4\pi$ factor.</p>`
      },
      {
        title: 'Gain from directivity',
        tex: String.raw`$$G = \eta_{rad}\,D, \qquad G_{realized} = (1-|\Gamma|^2)\,\eta_{rad}\,D$$`,
        derivation: String.raw`<p>Directivity assumes all accepted power is radiated. Real antennas radiate only a fraction $\eta_{rad}=R_r/(R_r+R_L)$, and mismatch reflects $|\Gamma|^2$ before it is even accepted, giving realized gain.</p>`
      },
      {
        title: 'dBi to dBd conversion',
        tex: String.raw`$$G_{\mathrm{dBi}} = G_{\mathrm{dBd}} + 2.15$$`,
        derivation: String.raw`<p>The reference half-wave dipole has directivity $1.64$; $10\log_{10}(1.64)=2.15$ dB. Since dBd is referenced to this dipole, adding 2.15 dB converts to the isotropic reference.</p>`
      },
      {
        title: 'Aperture gain',
        tex: String.raw`$$G = \eta_{ap}\frac{4\pi A_{phys}}{\lambda^2} = \eta_{ap}\left(\frac{\pi D}{\lambda}\right)^2$$`,
        derivation: String.raw`<p>From $A_e=G\lambda^2/4\pi$ solve $G=4\pi A_e/\lambda^2$, then substitute $A_e=\eta_{ap}A_{phys}$. For a circular dish $A_{phys}=\pi D^2/4$, giving $G=\eta_{ap}\pi^2 D^2/\lambda^2=\eta_{ap}(\pi D/\lambda)^2$.</p>`
      },
      {
        title: 'Gain–beamwidth relation',
        tex: String.raw`$$G \approx \frac{4\pi}{\Omega_A} \approx \frac{26000}{\theta_{az}^\circ\,\theta_{el}^\circ}$$`,
        derivation: String.raw`<p>If nearly all power lies in a beam of solid angle $\Omega_A\approx\theta_{az}\theta_{el}$ (radians), $G\approx 4\pi/\Omega_A$. Converting radians to degrees ($1\ \mathrm{rad}=57.3°$): $4\pi\times57.3^2\approx41253$. Multiplying by a real-antenna efficiency $\approx0.6$–$0.65$ gives the practical $\approx 26000$.</p>`
      },
      {
        title: 'Frequency scaling of a fixed aperture',
        tex: String.raw`$$G \propto \frac{A_{phys}}{\lambda^2} \propto f^2 \;\Rightarrow\; +6\ \mathrm{dB/octave}$$`,
        derivation: String.raw`<p>With $A_{phys}$ constant and $\lambda=c/f$, $G\propto f^2$. Doubling $f$ multiplies $G$ by 4; $10\log_{10}4=6.02$ dB.</p>`
      },
      {
        title: 'EIRP',
        tex: String.raw`$$\mathrm{EIRP} = P_t + G_t - L_{feed}\quad(\mathrm{dB})$$`,
        derivation: String.raw`<p>EIRP is the isotropic-equivalent transmit power in boresight: transmitter power plus antenna gain, minus feed/cable losses, all in dB.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Directivity of a half-wave dipole (linear and dBi)?`, back: String.raw`$1.64$, i.e. $2.15$ dBi.` },
      { front: String.raw`Relation between gain and directivity?`, back: String.raw`$G=\eta_{rad}D$; equal only for a lossless antenna.` },
      { front: String.raw`Convert dBd to dBi.`, back: String.raw`Add 2.15 dB: $G_{dBi}=G_{dBd}+2.15$.` },
      { front: String.raw`Aperture gain formula for a dish?`, back: String.raw`$G=\eta_{ap}(\pi D/\lambda)^2$.` },
      { front: String.raw`How does gain scale with aperture size?`, back: String.raw`$G\propto(D/\lambda)^2$; doubling $D$ adds 6 dB.` },
      { front: String.raw`Fixed aperture: gain change per octave of frequency?`, back: String.raw`$+6$ dB per octave (gain $\propto f^2$).` },
      { front: String.raw`Practical gain–beamwidth rule.`, back: String.raw`$G\approx 26000/(\theta_{az}\theta_{el})$ with beamwidths in degrees.` },
      { front: String.raw`Ideal (lossless) constant in the beamwidth rule?`, back: String.raw`$41253$ (= $4\pi$ steradians in square degrees).` },
      { front: String.raw`Typical aperture efficiency of a dish?`, back: String.raw`$0.5$–$0.7$ (taper, spillover, blockage, surface tolerance).` },
      { front: String.raw`Define EIRP.`, back: String.raw`$P_t+G_t-L_{feed}$ (dB): isotropic-equivalent boresight power.` },
      { front: String.raw`Does high gain add power?`, back: String.raw`No — it redistributes fixed radiated power into a narrower solid angle.` },
      { front: String.raw`Directivity of a short (Hertzian) dipole?`, back: String.raw`$1.5$ (1.76 dBi).` },
      { front: String.raw`Difference between gain and realized gain?`, back: String.raw`Realized gain multiplies gain by the mismatch factor $(1-|\Gamma|^2)$.` }
    ],
    mcqs: [
      { q: String.raw`The directivity of a half-wave dipole is:`, options: [String.raw`1.0`, String.raw`1.5`, String.raw`1.64`, String.raw`2.0`], answer: 2, explain: String.raw`$1.64 = 2.15$ dBi; a short dipole is $1.5$.` },
      { q: String.raw`A 10 dBd antenna equals how many dBi?`, options: [String.raw`7.85`, String.raw`10`, String.raw`12.15`, String.raw`14.3`], answer: 2, explain: String.raw`Add 2.15: $10+2.15=12.15$ dBi.` },
      { q: String.raw`Doubling a dish diameter (fixed $f$) changes gain by:`, options: [String.raw`+3 dB`, String.raw`+6 dB`, String.raw`+12 dB`, String.raw`no change`], answer: 1, explain: String.raw`$G\propto D^2$, so $\times4 = +6$ dB.` },
      { q: String.raw`For a fixed physical aperture, gain scales with frequency as:`, options: [String.raw`$f$`, String.raw`$f^2$`, String.raw`$1/f$`, String.raw`$1/f^2$`], answer: 1, explain: String.raw`$G\propto A/\lambda^2\propto f^2$ (+6 dB/octave).` },
      { q: String.raw`Gain differs from directivity because of:`, options: [String.raw`beamwidth`, String.raw`radiation efficiency`, String.raw`polarization`, String.raw`frequency`], answer: 1, explain: String.raw`$G=\eta_{rad}D$; losses reduce gain below directivity.` },
      { q: String.raw`Using $G\approx26000/(\theta_{az}\theta_{el})$, a $2°\times2°$ beam gives about:`, options: [String.raw`28 dBi`, String.raw`33 dBi`, String.raw`38 dBi`, String.raw`45 dBi`], answer: 2, explain: String.raw`$26000/4=6500\Rightarrow10\log6500\approx38.1$ dBi.` },
      { q: String.raw`Aperture efficiency of a well-designed dish is typically:`, options: [String.raw`0.1–0.2`, String.raw`0.5–0.7`, String.raw`0.9–1.0`, String.raw`>1`], answer: 1, explain: String.raw`Illumination taper, spillover, blockage and surface error keep it around 55–70%.` },
      { q: String.raw`EIRP equals:`, options: [String.raw`$P_t-G_t$`, String.raw`$P_t+G_t-L_{feed}$`, String.raw`$G_t/T$`, String.raw`$P_t\cdot\lambda^2$`], answer: 1, explain: String.raw`Transmit power plus gain minus feed loss (all dB).` },
      { q: String.raw`An isotropic radiator has gain:`, options: [String.raw`0 dBi`, String.raw`2.15 dBi`, String.raw`3 dB`, String.raw`unity dBd`], answer: 0, explain: String.raw`By definition $G=1=0$ dBi.` },
      { q: String.raw`"Realized gain" additionally accounts for:`, options: [String.raw`sidelobe level`, String.raw`impedance mismatch $(1-|\Gamma|^2)$`, String.raw`polarization`, String.raw`temperature`], answer: 1, explain: String.raw`It folds the reflection loss into gain.` },
      { q: String.raw`The ideal lossless constant in the gain-beamwidth relation is:`, options: [String.raw`26000`, String.raw`30000`, String.raw`41253`, String.raw`57296`], answer: 2, explain: String.raw`$4\pi$ sr expressed in square degrees $=41253$.` },
      { q: String.raw`Which grows the same way with frequency as fixed-aperture gain?`, options: [String.raw`thermal noise`, String.raw`free-space path loss`, String.raw`antenna length`, String.raw`VSWR`], answer: 1, explain: String.raw`Both path loss and fixed-aperture gain scale as $f^2$.` }
    ],
    numericals: [
      { q: String.raw`A 3 m parabolic dish at 6 GHz has aperture efficiency 0.6. Find its gain in dBi.`, solution: String.raw`<p><b>Formula.</b> $$G=\eta_{ap}\left(\frac{\pi D}{\lambda}\right)^2,\qquad \lambda=\frac{c}{f}$$ where $G$ = gain (linear), $\eta_{ap}$ = aperture efficiency, $D$ = dish diameter (m), $\lambda$ = wavelength (m).</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{6\times10^9},\qquad G=0.6\left(\frac{\pi\times3}{0.05}\right)^2$$</p>
      <p><b>Compute.</b> $\lambda=0.05$ m; $\pi D/\lambda=188.5$; $G=0.6\times(188.5)^2=0.6\times35530=21318$. In dB: $10\log_{10}(21318)=43.3$ dBi.</p>
      <p><b>Explanation.</b> Gain grows as the square of the aperture in wavelengths ($D/\lambda=60$ here), so a 3 m dish at C-band easily exceeds 40 dBi — the workhorse figure for satellite ground stations.</p>` },
      { q: String.raw`Estimate the half-power beamwidth of a 40 dBi antenna assuming a symmetric beam and constant 26000.`, solution: String.raw`<p><b>Formula.</b> $$G\approx\frac{26000}{\theta^2}\;\Rightarrow\;\theta\approx\sqrt{\frac{26000}{G}}$$ where $G$ = linear gain, $\theta$ = HPBW per plane (degrees), symmetric beam $\theta_{az}=\theta_{el}=\theta$.</p>
      <p><b>Substitute.</b> $$G=10^{40/10}=10^4=10000,\qquad \theta=\sqrt{\frac{26000}{10000}}$$</p>
      <p><b>Compute.</b> $\theta=\sqrt{2.6}=1.61°$ per plane.</p>
      <p><b>Explanation.</b> A 40 dBi antenna has a pencil beam roughly $1.6°$ wide — this inverse gain-beamwidth link is why high gain always demands accurate pointing.</p>` },
      { q: String.raw`A dish gives 30 dBi at 4 GHz. What is its gain at 8 GHz (same dish)?`, solution: String.raw`<p><b>Formula.</b> $$G\propto\frac{A_{phys}}{\lambda^2}\propto f^2\;\Rightarrow\;\Delta G_{\mathrm{dB}}=20\log_{10}\!\frac{f_2}{f_1}$$ where the physical aperture $A_{phys}$ is fixed, so gain scales with $f^2$.</p>
      <p><b>Substitute.</b> $$\Delta G=20\log_{10}\!\frac{8}{4}=20\log_{10}2$$</p>
      <p><b>Compute.</b> $\Delta G=20\times0.301=6.0$ dB, so $G=30+6=36$ dBi.</p>
      <p><b>Explanation.</b> Doubling frequency is one octave and adds $+6$ dB to a fixed aperture because it becomes electrically larger; the same dish is markedly more directive at the higher band.</p>` },
      { q: String.raw`An antenna has directivity 25 dBi and radiation efficiency 80%. Find its gain in dBi.`, solution: String.raw`<p><b>Formula.</b> $$G_{\mathrm{dBi}}=D_{\mathrm{dBi}}+10\log_{10}\eta_{rad}$$ where $D$ = directivity, $\eta_{rad}$ = radiation efficiency, $G$ = gain.</p>
      <p><b>Substitute.</b> $$G=25+10\log_{10}(0.8)$$</p>
      <p><b>Compute.</b> $10\log_{10}(0.8)=-0.97$ dB, so $G=25-0.97\approx24.0$ dBi.</p>
      <p><b>Explanation.</b> $80\%$ efficiency costs about $1$ dB; gain is always at or below directivity, and the gap is exactly the efficiency loss in dB.</p>` },
      { q: String.raw`Transmitter delivers 20 W into an antenna of 18 dBi through a cable with 2 dB loss. Find EIRP in dBW and W.`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{EIRP}=P_t+G_t-L_{feed}\ (\mathrm{dB}),\qquad P_t(\mathrm{dBW})=10\log_{10}P_t(\mathrm{W})$$ where $P_t$ = transmit power, $G_t$ = antenna gain, $L_{feed}$ = feed loss.</p>
      <p><b>Substitute.</b> $$P_t=10\log_{10}(20)=13.0\ \mathrm{dBW},\qquad \mathrm{EIRP}=13.0+18-2$$</p>
      <p><b>Compute.</b> $\mathrm{EIRP}=29.0$ dBW $=10^{29.0/10}=10^{2.9}=794$ W.</p>
      <p><b>Explanation.</b> The 18 dBi antenna multiplies the effective boresight power roughly 40-fold even after the 2 dB cable loss — EIRP, not raw wattage, is what regulators cap and what the link budget uses.</p>` },
      { q: String.raw`Convert a 14 dBd Yagi to dBi, then find its effective aperture at 435 MHz.`, solution: String.raw`<p><b>Formula.</b> $$G_{\mathrm{dBi}}=G_{\mathrm{dBd}}+2.15,\qquad A_e=\frac{G\lambda^2}{4\pi},\qquad \lambda=\frac{c}{f}$$ where the $2.15$ dB offset is the dipole reference's gain over isotropic.</p>
      <p><b>Substitute.</b> $$G_{\mathrm{dBi}}=14+2.15=16.15,\quad G=10^{1.615},\quad \lambda=\frac{3\times10^8}{4.35\times10^8},\quad A_e=\frac{G\lambda^2}{4\pi}$$</p>
      <p><b>Compute.</b> $G=41.2$ (linear); $\lambda=0.690$ m; $A_e=\dfrac{41.2\times(0.690)^2}{4\pi}=\dfrac{41.2\times0.476}{12.57}=\dfrac{19.6}{12.57}=1.56$ m$^2$.</p>
      <p><b>Explanation.</b> Always check the reference: quoting dBi inflates the number by 2.15 dB over dBd. At UHF the long wavelength makes even a modest Yagi's capture area over a square metre.</p>` }
    ],
    realWorld: String.raw`<p>Gain is the lever every RF system pulls. Satellite ground stations use large dishes precisely because $G\propto(D/\lambda)^2$ turns metal into link margin — a VSAT terminal trades a smaller dish for a bigger amplifier. Cellular sector antennas quote around 15–18 dBi and are engineered so that gain-beamwidth gives roughly a $65°$ azimuth sector with narrow elevation, packing capacity per cell. Radar range depends on $G^2$ (used twice, TX and RX), so gain enters to the fourth power in the radar equation. And regulators cap <em>EIRP</em> rather than raw transmit power, precisely because gain, not just power, sets the field strength that can interfere with or expose others — Wi-Fi's 36 dBm EIRP limit in some bands is a gain-plus-power ceiling.</p>`,
    related: ['antenna', 'antenna-beamwidth', 'antenna-types', 'link-budget', 'path-loss']
  },

  {
    id: 'antenna-beamwidth',
    title: 'Antenna Beamwidth',
    category: 'Antennas & Electromagnetics',
    tags: ['beamwidth', 'HPBW', 'sidelobes', 'nulls', 'radiation pattern', 'arrays', 'pointing'],
    summary: String.raw`Beamwidth quantifies how narrowly an antenna concentrates its main beam, most commonly the half-power (-3 dB) angular width of the main lobe.`,
    prerequisites: ['antenna', 'antenna-gain', 'maxwell'],
    intro: String.raw`<p><strong>Beamwidth</strong> is the angular sharpness of an antenna's main beam. The dominant metric is the <strong>Half-Power Beamwidth (HPBW)</strong> — the angle between the two directions on either side of the peak where radiated power falls to half (−3 dB). A narrower beam means higher gain but tighter pointing requirements and less coverage. This topic covers the anatomy of a radiation pattern (main lobe, side lobes, nulls, back lobe), the aperture rule of thumb $\theta \approx 70\lambda/D$, side-lobe level (SLL) and its trade with beamwidth via illumination taper, first-null beamwidth, pointing tolerance, and how arrays multiply elements to narrow the beam.</p>`,
    sections: [
      {
        h: 'Anatomy of a radiation pattern',
        html: String.raw`<p>Plotting radiated power versus angle reveals a structured pattern:</p>
        <ul>
          <li><strong>Main lobe (main beam):</strong> the lobe containing the peak radiation direction (boresight).</li>
          <li><strong>Side lobes:</strong> smaller lobes on either side of the main beam; the largest is the <em>first side lobe</em>. Their level relative to the peak is the <strong>side-lobe level (SLL)</strong>, in dB (negative).</li>
          <li><strong>Nulls:</strong> directions of (near) zero radiation separating lobes.</li>
          <li><strong>Back lobe:</strong> the lobe near $180°$ from boresight. <strong>Front-to-back ratio (F/B)</strong> compares main-lobe peak to back-lobe level.</li>
        </ul>
        <p>Side lobes waste power and are pathways for interference (transmit) and jamming/clutter (receive), so low-SLL designs are prized in radar and secure links.</p>`
      },
      {
        h: 'Half-power beamwidth (HPBW)',
        html: String.raw`<p><strong>HPBW</strong> is measured between the two −3 dB points of the main lobe. Since −3 dB = half power = $0.707$ in field amplitude, HPBW is sometimes called the "3 dB beamwidth." Antennas generally have two HPBWs — one in the <em>azimuth</em> (H-plane) and one in the <em>elevation</em> (E-plane) — which together set the gain via $G\approx 26000/(\theta_{az}\theta_{el})$.</p>
        <div class="callout"><strong>Field vs power confusion:</strong> −3 dB corresponds to $0.5$ in <em>power</em> but $1/\sqrt{2}=0.707$ in <em>field/voltage</em>. The half-power point is the standard beamwidth reference.</div>`
      },
      {
        h: 'Aperture rule: theta ≈ 70 lambda / D',
        html: String.raw`<p>For a uniformly illuminated aperture of size $D$, the HPBW (in degrees) follows:</p>
        <p>$$\theta_{HPBW} \approx k\,\frac{\lambda}{D}\quad\text{(degrees)}$$</p>
        <p>The constant $k$ depends on illumination taper: $k\approx 51$ for uniform illumination, but real tapered dishes give $k\approx 65$–$70$. The commonly memorised engineering value is:</p>
        <p>$$\theta_{HPBW}\approx \frac{70\lambda}{D}\ \text{degrees}$$</p>
        <ul>
          <li>Bigger aperture (in wavelengths) $\Rightarrow$ narrower beam — the same physics that raises gain.</li>
          <li>Halving $\lambda$ (doubling $f$) halves the beamwidth.</li>
        </ul>`
      },
      {
        h: 'First-null beamwidth (FNBW)',
        html: String.raw`<p>The <strong>first-null beamwidth (FNBW)</strong> is the angular width between the first nulls straddling the main lobe. For a uniform linear aperture the first null occurs where the pattern factor $\mathrm{sinc}$ first zeroes:</p>
        <p>$$\theta_{null}\approx \sin^{-1}\!\left(\frac{\lambda}{D}\right),\qquad \mathrm{FNBW}\approx 2\theta_{null}$$</p>
        <p>For uniform illumination FNBW $\approx 115\lambda/D$ degrees — roughly twice the HPBW. FNBW matters for resolving two closely spaced sources (angular resolution) and for placing nulls on interferers.</p>`
      },
      {
        h: 'Side-lobe level and taper trade-off',
        html: String.raw`<p>A <strong>uniformly illuminated</strong> aperture gives the highest gain and narrowest beam but a poor first side lobe at <strong>−13.3 dB</strong>. Tapering the illumination (feeding the aperture edges less strongly — Taylor, Chebyshev, cosine, Hamming tapers) suppresses side lobes at the cost of a wider main beam and slightly lower gain:</p>
        <table class="data">
          <tr><th>Illumination</th><th>First SLL</th><th>HPBW (rel.)</th><th>Aperture eff.</th></tr>
          <tr><td>Uniform</td><td>−13.3 dB</td><td>narrowest</td><td>1.00</td></tr>
          <tr><td>Cosine taper</td><td>−23 dB</td><td>+30%</td><td>0.81</td></tr>
          <tr><td>Cosine$^2$</td><td>−32 dB</td><td>+50%</td><td>0.67</td></tr>
          <tr><td>Dolph-Chebyshev</td><td>chosen (e.g. −40 dB)</td><td>optimal for SLL</td><td>varies</td></tr>
        </table>
        <p>This is a fundamental beamwidth-vs-SLL-vs-gain trilemma: you cannot have narrow beam, low side lobes, and maximum gain simultaneously.</p>`
      },
      {
        h: 'Pointing tolerance & coverage',
        html: String.raw`<p>A narrow beam demands accurate pointing. A common rule is to keep pointing error within about a tenth of the HPBW to hold gain loss under ~0.5 dB; the boresight loss for a Gaussian-like main beam is approximately:</p>
        <p>$$L(\theta_e)\approx 12\left(\frac{\theta_e}{\theta_{HPBW}}\right)^2\ \text{dB}$$</p>
        <ul>
          <li>Half-HPBW error ($\theta_e=\theta_{HPBW}/2$) loses $\approx 3$ dB (the edge of the beam, by definition).</li>
          <li>Satellite dishes with $<1°$ HPBW need sub-degree tracking; wind/thermal flexure matters.</li>
          <li>Wide-beam antennas (whips, patches) tolerate large orientation errors — good for mobile/handheld.</li>
        </ul>`
      },
      {
        h: 'Arrays narrow the beam',
        html: String.raw`<p>An <strong>array</strong> of $N$ elements spaced $d$ has an <em>array factor</em> whose main lobe narrows as $N$ grows — the effective aperture is $\approx Nd$. For a uniform broadside array:</p>
        <p>$$\theta_{HPBW}\approx \frac{0.886\,\lambda}{Nd\cos\theta_0}\ \text{rad}$$</p>
        <p>Doubling $N$ (hence aperture) roughly halves the beamwidth and adds ~3 dB of array gain. Phased arrays additionally <em>scan</em> the beam by inter-element phase, at the cost of beam broadening as $1/\cos\theta_0$ off boresight (scan loss). Arrays are how radar and 5G achieve narrow, steerable beams without moving parts.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>By now the beamwidth story should hang together:</p>
        <ul>
          <li><strong>HPBW:</strong> the $-3$ dB (half-power) angular width of the main lobe — half power, but $0.707$ in field amplitude.</li>
          <li><strong>Pattern anatomy:</strong> main lobe, side lobes (SLL), nulls, and back lobe (front-to-back ratio) — side lobes waste power and admit interference.</li>
          <li><strong>Aperture rule:</strong> $\theta_{HPBW}\approx70\lambda/D$ deg (tapered), $\approx51\lambda/D$ uniform; FNBW $\approx115\lambda/D$ is about twice the HPBW and sets angular resolution.</li>
          <li><strong>The taper trilemma:</strong> you cannot maximise narrow beam, low side lobes, and gain at once — the uniform aperture's first side lobe is fixed at $-13.3$ dB, and tapering trades beamwidth/gain for lower SLL.</li>
          <li><strong>Pointing:</strong> boresight loss $\approx12(\theta_e/\theta_{HPBW})^2$ dB, so narrow beams demand accurate tracking.</li>
          <li><strong>Arrays:</strong> $N$ elements narrow the beam $\propto1/(Nd)$ and scan-broaden as $1/\cos\theta_0$ off boresight.</li>
        </ul></div>`
      }
    ],
    keyPoints: [
      String.raw`HPBW = angular width between the −3 dB (half-power) points of the main lobe.`,
      String.raw`−3 dB is half power but $0.707$ in field amplitude.`,
      String.raw`Aperture rule: $\theta_{HPBW}\approx 70\lambda/D$ degrees (tapered); $\approx 51\lambda/D$ uniform.`,
      String.raw`FNBW (uniform aperture) $\approx 115\lambda/D$ deg, about twice HPBW.`,
      String.raw`Uniform illumination first side lobe is fixed at −13.3 dB.`,
      String.raw`Tapering lowers side lobes but widens the beam and cuts gain — a fundamental trade.`,
      String.raw`Pattern parts: main lobe, side lobes (SLL), nulls, back lobe (front-to-back ratio).`,
      String.raw`Boresight pointing loss $\approx 12(\theta_e/\theta_{HPBW})^2$ dB.`,
      String.raw`Narrower beam $\Rightarrow$ higher gain but tighter pointing and less coverage.`,
      String.raw`An $N$-element array narrows the beam $\propto 1/(Nd)$ and scan-broadens as $1/\cos\theta_0$.`,
      String.raw`Halving wavelength (doubling frequency) halves the beamwidth for a fixed aperture.`,
      String.raw`FNBW sets angular resolution (ability to separate two sources).`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="300" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Radiation pattern: main lobe, side lobes, nulls, HPBW</text>
          <!-- origin -->
          <circle cx="270" cy="250" r="4" fill="#ffa94d"/>
          <!-- main lobe -->
          <path d="M270,250 C230,120 250,60 270,50 C290,60 310,120 270,250 Z" fill="#4dabf7" opacity="0.35" stroke="#4dabf7" stroke-width="2"/>
          <text x="270" y="45" fill="#4dabf7" font-size="12" text-anchor="middle">main lobe</text>
          <!-- HPBW markers -->
          <line x1="270" y1="250" x2="215" y2="120" stroke="#63e6be" stroke-width="1.5" stroke-dasharray="4 3"/>
          <line x1="270" y1="250" x2="325" y2="120" stroke="#63e6be" stroke-width="1.5" stroke-dasharray="4 3"/>
          <path d="M232,150 A70 70 0 0 1 308,150" fill="none" stroke="#63e6be" stroke-width="1.5"/>
          <text x="270" y="145" fill="#63e6be" font-size="12" text-anchor="middle">HPBW (-3 dB)</text>
          <!-- left side lobe -->
          <path d="M270,250 C175,235 150,205 148,195 C165,200 220,225 270,250 Z" fill="#ff6b6b" opacity="0.35" stroke="#ff6b6b" stroke-width="1.5"/>
          <text x="150" y="185" fill="#ff6b6b" font-size="11">side lobe</text>
          <!-- right side lobe -->
          <path d="M270,250 C365,235 390,205 392,195 C375,200 320,225 270,250 Z" fill="#ff6b6b" opacity="0.35" stroke="#ff6b6b" stroke-width="1.5"/>
          <text x="360" y="185" fill="#ff6b6b" font-size="11">side lobe (SLL)</text>
          <!-- nulls -->
          <line x1="270" y1="250" x2="200" y2="228" stroke="#b197fc" stroke-width="1" stroke-dasharray="2 2"/>
          <line x1="270" y1="250" x2="340" y2="228" stroke="#b197fc" stroke-width="1" stroke-dasharray="2 2"/>
          <text x="180" y="248" fill="#b197fc" font-size="10">null</text>
          <text x="345" y="248" fill="#b197fc" font-size="10">null</text>
          <text x="270" y="285" fill="#9aa7b5" font-size="11" text-anchor="middle">boresight up; angle off-axis increases outward</text>
        </svg>`,
        caption: 'Main lobe with the HPBW marked at -3 dB, flanked by nulls and side lobes. SLL is the side-lobe peak relative to the main-lobe peak.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="220" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="13" text-anchor="middle">Cartesian pattern: HPBW, FNBW, SLL (uniform aperture, first SLL -13.3 dB)</text>
          <line x1="50" y1="180" x2="510" y2="180" stroke="#9aa7b5" stroke-width="1.2"/>
          <line x1="280" y1="180" x2="280" y2="40" stroke="#9aa7b5" stroke-width="1.2"/>
          <text x="500" y="196" fill="#9aa7b5" font-size="10">angle</text>
          <text x="286" y="50" fill="#9aa7b5" font-size="10">dB</text>
          <!-- sinc-like curve -->
          <path d="M60,178 C120,176 170,160 200,120 C230,60 260,45 280,45 C300,45 330,60 360,120 C390,160 440,176 500,178" fill="none" stroke="#4dabf7" stroke-width="2.2"/>
          <!-- side lobe bumps -->
          <path d="M200,120 C185,150 165,150 150,140 C140,150 125,165 110,172" fill="none" stroke="#ff6b6b" stroke-width="1.6"/>
          <path d="M360,120 C375,150 395,150 410,140 C420,150 435,165 450,172" fill="none" stroke="#ff6b6b" stroke-width="1.6"/>
          <!-- -3 dB line -->
          <line x1="230" y1="70" x2="330" y2="70" stroke="#63e6be" stroke-width="1.3" stroke-dasharray="4 3"/>
          <text x="360" y="74" fill="#63e6be" font-size="10">-3 dB (HPBW)</text>
          <!-- SLL level -->
          <line x1="130" y1="140" x2="430" y2="140" stroke="#ffa94d" stroke-width="1" stroke-dasharray="3 3"/>
          <text x="60" y="136" fill="#ffa94d" font-size="10">-13.3 dB SLL</text>
        </svg>`,
        caption: 'Cartesian (dB) pattern showing the -3 dB HPBW near the peak and the -13.3 dB first side lobe of a uniformly illuminated aperture.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="250" fill="#1c232e"/>
          <text x="270" y="22" fill="#e6edf3" font-size="14" text-anchor="middle">Larger aperture &#8594; narrower beam &#8594; higher gain</text>
          <!-- small aperture -->
          <rect x="40" y="80" width="10" height="60" rx="3" fill="#4dabf7"/>
          <text x="45" y="160" fill="#9aa7b5" font-size="10" text-anchor="middle">small D</text>
          <path d="M50,110 L200,55 M50,110 L200,165" stroke="#ffa94d" stroke-width="1.5"/>
          <path d="M170,72 A130 130 0 0 1 170,148" fill="none" stroke="#ffa94d" stroke-width="1.3"/>
          <text x="150" y="112" fill="#ffa94d" font-size="11" text-anchor="middle">wide &#952;</text>
          <!-- large aperture -->
          <rect x="300" y="60" width="10" height="100" rx="3" fill="#4dabf7"/>
          <text x="305" y="178" fill="#9aa7b5" font-size="10" text-anchor="middle">large D</text>
          <path d="M310,110 L470,92 M310,110 L470,128" stroke="#63e6be" stroke-width="1.5"/>
          <path d="M452,98 A160 160 0 0 1 452,122" fill="none" stroke="#63e6be" stroke-width="1.3"/>
          <text x="440" y="112" fill="#63e6be" font-size="11" text-anchor="middle">narrow &#952;</text>
          <text x="270" y="215" fill="#e6edf3" font-size="12" text-anchor="middle">&#952;&#8323;&#8340;&#8341;&#8342; &#8776; 70&#955;/D deg &#160;&#8660;&#160; G &#8776; 26000/(&#952;&#8331;&#7511;&#952;&#7473;&#8343;)</text>
          <text x="270" y="235" fill="#b197fc" font-size="10.5" text-anchor="middle">the same electrical size that narrows the beam raises the gain</text>
        </svg>`,
        caption: 'Aperture-beamwidth-gain link: a larger electrical aperture D/lambda narrows the HPBW (approx 70 lambda/D) and, because the beam packs into a smaller solid angle, simultaneously raises the gain.'
      }
    ],
    equations: [
      {
        title: 'Aperture HPBW rule',
        tex: String.raw`$$\theta_{HPBW}\approx k\,\frac{\lambda}{D}\ \text{deg},\quad k\approx 70\ (\text{tapered}),\ 51\ (\text{uniform})$$`,
        derivation: String.raw`<p>The far-field of a uniform aperture is a $\mathrm{sinc}$; its −3 dB points occur at $\sin\theta\approx 0.44\lambda/D$. For small angles $\theta\approx 0.44\lambda/D$ rad $=0.44\times57.3\,\lambda/D = 25.2\lambda/D$ per side, i.e. HPBW $\approx 50.4\lambda/D\approx 51\lambda/D$ deg. Edge taper widens this to $\approx 65$–$70\lambda/D$.</p>`
      },
      {
        title: 'First-null beamwidth',
        tex: String.raw`$$\mathrm{FNBW}\approx 2\sin^{-1}\!\left(\frac{\lambda}{D}\right)\approx \frac{115\lambda}{D}\ \text{deg (uniform)}$$`,
        derivation: String.raw`<p>The first null of the aperture $\mathrm{sinc}$ is at $\sin\theta=\lambda/D$. For small angles $\theta_{null}\approx\lambda/D$ rad $=57.3\lambda/D$ deg; doubling for both sides gives $\approx 115\lambda/D$ deg.</p>`
      },
      {
        title: 'Gain–beamwidth link',
        tex: String.raw`$$G\approx \frac{26000}{\theta_{az}^\circ\,\theta_{el}^\circ}$$`,
        derivation: String.raw`<p>Approximating the beam as a rectangular solid angle $\Omega_A\approx\theta_{az}\theta_{el}$ and $G\approx4\pi/\Omega_A$; converting to degrees and applying real-antenna efficiency gives $\approx26000$ (see Antenna Gain).</p>`
      },
      {
        title: 'Pointing (boresight) loss',
        tex: String.raw`$$L(\theta_e)\approx 12\left(\frac{\theta_e}{\theta_{HPBW}}\right)^2\ \text{dB}$$`,
        derivation: String.raw`<p>Model the main beam as Gaussian: gain $\propto e^{-a\theta_e^2}$. Setting the loss to 3 dB at $\theta_e=\theta_{HPBW}/2$ fixes $a$, giving $L=3(2\theta_e/\theta_{HPBW})^2=12(\theta_e/\theta_{HPBW})^2$ dB.</p>`
      },
      {
        title: 'Array beamwidth',
        tex: String.raw`$$\theta_{HPBW}\approx \frac{0.886\,\lambda}{Nd\cos\theta_0}\ \text{rad}$$`,
        derivation: String.raw`<p>The array factor of $N$ uniform elements spaced $d$ has its −3 dB points determined by the electrical aperture $L=Nd$. For broadside ($\theta_0=0$) the beamwidth is $\approx 0.886\lambda/L$; scanning to $\theta_0$ projects the aperture to $L\cos\theta_0$, widening the beam by $1/\cos\theta_0$.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Define HPBW.`, back: String.raw`Angle between the two −3 dB (half-power) points of the main lobe.` },
      { front: String.raw`−3 dB in field amplitude?`, back: String.raw`$1/\sqrt2 = 0.707$ (half power).` },
      { front: String.raw`HPBW rule of thumb for a dish.`, back: String.raw`$\theta\approx 70\lambda/D$ degrees (tapered); $\approx51\lambda/D$ uniform.` },
      { front: String.raw`First side-lobe level of a uniform aperture?`, back: String.raw`−13.3 dB (fixed).` },
      { front: String.raw`Effect of illumination taper?`, back: String.raw`Lowers side lobes, but widens the main beam and reduces gain.` },
      { front: String.raw`FNBW of a uniform aperture (approx)?`, back: String.raw`$\approx 115\lambda/D$ deg, roughly $2\times$ HPBW.` },
      { front: String.raw`What sets angular resolution?`, back: String.raw`Beamwidth (roughly FNBW / Rayleigh criterion) — narrower beam resolves closer sources.` },
      { front: String.raw`Pointing loss at half-HPBW error?`, back: String.raw`$\approx 3$ dB (by definition of the −3 dB edge).` },
      { front: String.raw`Front-to-back ratio?`, back: String.raw`Main-lobe peak level minus back-lobe level (dB).` },
      { front: String.raw`How does adding array elements affect the beam?`, back: String.raw`Narrows it $\propto 1/(Nd)$ and adds ~3 dB per doubling of $N$.` },
      { front: String.raw`Scan loss in a phased array?`, back: String.raw`Beam broadens as $1/\cos\theta_0$ and gain drops off boresight.` },
      { front: String.raw`Doubling frequency does what to beamwidth (fixed aperture)?`, back: String.raw`Halves it ($\theta\propto\lambda$).` },
      { front: String.raw`Why suppress side lobes?`, back: String.raw`They waste power and admit interference/clutter/jamming off-axis.` }
    ],
    mcqs: [
      { q: String.raw`HPBW is measured at what level relative to the peak?`, options: [String.raw`−1 dB`, String.raw`−3 dB`, String.raw`−10 dB`, String.raw`first null`], answer: 1, explain: String.raw`Half power = −3 dB defines HPBW.` },
      { q: String.raw`A −3 dB point corresponds to a field amplitude of:`, options: [String.raw`0.5`, String.raw`0.707`, String.raw`0.9`, String.raw`0.316`], answer: 1, explain: String.raw`Half power is $1/\sqrt2=0.707$ in field.` },
      { q: String.raw`The commonly used HPBW rule for a dish is:`, options: [String.raw`$\theta\approx\lambda/D$`, String.raw`$\theta\approx70\lambda/D$ deg`, String.raw`$\theta\approx D/\lambda$`, String.raw`$\theta\approx115\lambda/D$ deg`], answer: 1, explain: String.raw`$\approx70\lambda/D$ deg for tapered illumination; $115\lambda/D$ is the FNBW.` },
      { q: String.raw`First side-lobe level of a uniformly illuminated aperture:`, options: [String.raw`−3 dB`, String.raw`−13.3 dB`, String.raw`−23 dB`, String.raw`−40 dB`], answer: 1, explain: String.raw`The $\mathrm{sinc}$ first side lobe is fixed at −13.3 dB.` },
      { q: String.raw`Tapering the aperture illumination:`, options: [String.raw`raises side lobes`, String.raw`narrows the beam`, String.raw`lowers side lobes and widens the beam`, String.raw`increases gain`], answer: 2, explain: String.raw`Taper trades beamwidth and gain for lower SLL.` },
      { q: String.raw`Doubling the frequency (fixed aperture) changes HPBW by:`, options: [String.raw`doubles it`, String.raw`halves it`, String.raw`no change`, String.raw`quadruples it`], answer: 1, explain: String.raw`$\theta\propto\lambda\propto1/f$.` },
      { q: String.raw`FNBW of a uniform aperture is about:`, options: [String.raw`half the HPBW`, String.raw`equal to HPBW`, String.raw`twice the HPBW`, String.raw`ten times HPBW`], answer: 2, explain: String.raw`$\approx115\lambda/D$ vs $\approx51\lambda/D$: about $2\times$.` },
      { q: String.raw`Pointing loss for a Gaussian beam at error $\theta_e$ is approximately:`, options: [String.raw`$3(\theta_e/\theta_{HPBW})$`, String.raw`$12(\theta_e/\theta_{HPBW})^2$`, String.raw`$6\theta_e$`, String.raw`$\theta_e^2$`], answer: 1, explain: String.raw`$L\approx12(\theta_e/\theta_{HPBW})^2$ dB.` },
      { q: String.raw`Adding elements to a linear array (fixed spacing) makes the beam:`, options: [String.raw`wider`, String.raw`narrower`, String.raw`unchanged`, String.raw`omnidirectional`], answer: 1, explain: String.raw`Larger electrical aperture $Nd$ narrows the beam.` },
      { q: String.raw`Scanning a phased array off boresight causes the beam to:`, options: [String.raw`narrow`, String.raw`broaden as $1/\cos\theta_0$`, String.raw`vanish`, String.raw`split`], answer: 1, explain: String.raw`Projected aperture shrinks by $\cos\theta_0$, broadening the beam.` },
      { q: String.raw`Which best resolves two closely spaced sources?`, options: [String.raw`wide beam`, String.raw`narrow beam / small FNBW`, String.raw`high side lobes`, String.raw`low gain`], answer: 1, explain: String.raw`Angular resolution improves with narrower beamwidth.` },
      { q: String.raw`Front-to-back ratio compares:`, options: [String.raw`two side lobes`, String.raw`main lobe to back lobe`, String.raw`HPBW to FNBW`, String.raw`gain to directivity`], answer: 1, explain: String.raw`It is the main-beam-to-back-lobe level in dB.` }
    ],
    numericals: [
      { q: String.raw`A 1.8 m dish operates at 4 GHz. Estimate the HPBW using the $70\lambda/D$ rule.`, solution: String.raw`<p><b>Formula.</b> $$\theta_{HPBW}\approx\frac{70\lambda}{D}\ \text{deg},\qquad \lambda=\frac{c}{f}$$ where $\theta_{HPBW}$ = half-power beamwidth (degrees), $D$ = aperture diameter (m), $\lambda$ = wavelength (m).</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{4\times10^9},\qquad \theta_{HPBW}=\frac{70\times0.075}{1.8}$$</p>
      <p><b>Compute.</b> $\lambda=0.075$ m; $\theta_{HPBW}=\dfrac{5.25}{1.8}=2.9°$.</p>
      <p><b>Explanation.</b> A near-3-degree beam is typical for a metre-class C-band dish. The beamwidth follows the aperture in wavelengths ($D/\lambda=24$), the same electrical size that fixes the gain.</p>` },
      { q: String.raw`For the same dish, estimate gain from the beamwidth (symmetric beam, constant 26000).`, solution: String.raw`<p><b>Formula.</b> $$G\approx\frac{26000}{\theta_{az}\theta_{el}}$$ where $\theta_{az},\theta_{el}$ = HPBWs (degrees); for a symmetric beam $\theta_{az}=\theta_{el}=2.9°$.</p>
      <p><b>Substitute.</b> $$G\approx\frac{26000}{2.9\times2.9}$$</p>
      <p><b>Compute.</b> $G=\dfrac{26000}{8.41}=3092$; in dB: $10\log_{10}(3092)=34.9$ dBi.</p>
      <p><b>Explanation.</b> Deriving gain straight from beamwidth gives $\approx35$ dBi, consistent with the aperture formula for this dish — beamwidth and gain are two views of the same focusing.</p>` },
      { q: String.raw`A dish has HPBW = 2°. What pointing error gives 1 dB loss?`, solution: String.raw`<p><b>Formula.</b> $$L(\theta_e)\approx 12\left(\frac{\theta_e}{\theta_{HPBW}}\right)^2\ \text{dB}\;\Rightarrow\;\theta_e=\theta_{HPBW}\sqrt{\frac{L}{12}}$$ where $L$ = boresight loss (dB), $\theta_e$ = pointing error, $\theta_{HPBW}$ = half-power beamwidth.</p>
      <p><b>Substitute.</b> $$1=12\left(\frac{\theta_e}{2}\right)^2\;\Rightarrow\;\left(\frac{\theta_e}{2}\right)^2=\frac{1}{12}=0.0833$$</p>
      <p><b>Compute.</b> $\dfrac{\theta_e}{2}=\sqrt{0.0833}=0.289$, so $\theta_e=0.58°$.</p>
      <p><b>Explanation.</b> Only about a quarter of the HPBW of error already costs 1 dB, so narrow-beam dishes need tracking accurate to a fraction of a degree.</p>` },
      { q: String.raw`Estimate the FNBW of a 30 wavelength aperture (uniform).`, solution: String.raw`<p><b>Formula.</b> $$\mathrm{FNBW}\approx\frac{115\lambda}{D}\ \text{deg}\quad(\text{uniform});\qquad \theta_{HPBW}\approx\frac{51\lambda}{D}$$ where $D/\lambda$ = aperture size in wavelengths.</p>
      <p><b>Substitute.</b> $$\frac{D}{\lambda}=30\;\Rightarrow\;\mathrm{FNBW}=\frac{115}{30},\qquad \theta_{HPBW}=\frac{51}{30}$$</p>
      <p><b>Compute.</b> $\mathrm{FNBW}=3.83°$; $\theta_{HPBW}=1.7°$.</p>
      <p><b>Explanation.</b> The first-null width is about twice the HPBW, as expected for a uniform aperture. FNBW sets angular resolution — the ability to separate two closely spaced sources.</p>` },
      { q: String.raw`A 16-element array has half-wavelength spacing at broadside. Estimate the HPBW.`, solution: String.raw`<p><b>Formula.</b> $$\theta_{HPBW}\approx\frac{0.886\lambda}{Nd}\ \text{rad},\qquad L=Nd$$ where $N$ = number of elements, $d$ = element spacing, $L$ = electrical aperture; broadside ($\theta_0=0$).</p>
      <p><b>Substitute.</b> $$Nd=16\times0.5\lambda=8\lambda,\qquad \theta_{HPBW}=\frac{0.886\lambda}{8\lambda}$$</p>
      <p><b>Compute.</b> $\theta_{HPBW}=0.1108$ rad $=0.1108\times57.3=6.35°$.</p>
      <p><b>Explanation.</b> Sixteen elements over $8\lambda$ give a $\sim6°$ beam; doubling $N$ (hence aperture) would roughly halve it and add about 3 dB of array gain.</p>` },
      { q: String.raw`The array above is scanned to $60°$. Find the broadened beamwidth.`, solution: String.raw`<p><b>Formula.</b> $$\theta_{scan}\approx\frac{\theta_{HPBW}}{\cos\theta_0}$$ where $\theta_0$ = scan angle off boresight; the projected aperture shrinks by $\cos\theta_0$.</p>
      <p><b>Substitute.</b> $$\theta_{scan}=\frac{6.35°}{\cos 60°}=\frac{6.35°}{0.5}$$</p>
      <p><b>Compute.</b> Broadening factor $1/\cos60°=2$, so $\theta_{scan}=6.35°\times2=12.7°$.</p>
      <p><b>Explanation.</b> Scanning to $60°$ doubles the beamwidth (and drops gain) because the array presents only half its aperture in that direction — the fundamental scan-loss penalty of phased arrays.</p>` }
    ],
    realWorld: String.raw`<p>Beamwidth is where physics meets operations. Weather and air-traffic radars use narrow beams (small FNBW) for angular resolution, then apply Chebyshev/Taylor tapers to push side lobes below −30 dB so ground clutter and out-of-beam targets do not masquerade as signals. Satellite dishes with sub-degree HPBW require motorised trackers because the pointing-loss law $12(\theta_e/\theta_{HPBW})^2$ turns a fraction of a degree of wind sway into dropped links. 5G mmWave base stations use large phased arrays precisely to synthesise pencil beams that both boost gain and spatially multiplex users, accepting scan-broadening near the array edges. And the humble Wi-Fi/handset antenna is deliberately wide-beam so it works regardless of how you hold it — the opposite end of the same trade-off.</p>`,
    related: ['antenna', 'antenna-gain', 'antenna-types', 'maxwell', 'link-budget']
  },

  {
    id: 'antenna-types',
    title: 'Types of Antennas',
    category: 'Antennas & Electromagnetics',
    tags: ['dipole', 'monopole', 'yagi', 'patch', 'horn', 'parabolic', 'helical', 'phased array', 'loop'],
    summary: String.raw`Antennas span wire, aperture, printed, and array families, each with characteristic gain, bandwidth, pattern, polarization, and application niche.`,
    prerequisites: ['antenna', 'antenna-gain', 'antenna-beamwidth'],
    intro: String.raw`<p>There is no universal antenna — each type is a purpose-built compromise among <em>gain</em>, <em>bandwidth</em>, <em>pattern</em>, <em>polarization</em>, <em>size</em>, and <em>cost</em>. This page surveys the essential families you must recognise and compare: the dipole and monopole (wire), the Yagi-Uda (parasitic array), the microstrip patch (printed), the horn and parabolic dish (aperture), the helix (circular polarization), the phased array (electronic steering), and the loop/ferrite (magnetic, small). A comparison table ties them together, and the phased-array section derives the steering phase $\phi = 2\pi d\sin\theta/\lambda$.</p>`,
    sections: [
      {
        h: 'Dipole and monopole (wire antennas)',
        html: String.raw`<p>The <strong>half-wave dipole</strong> is the reference wire antenna: two $\lambda/4$ arms fed at the center, resonant with $Z_A\approx73+j42.5\ \Omega$, gain $2.15$ dBi, and a doughnut (omnidirectional in azimuth, null along the wire axis) pattern. The <strong>monopole</strong> is half a dipole worked against a ground plane; image theory makes a $\lambda/4$ monopole radiate like a dipole into the upper half-space, with $Z_A\approx36.5\ \Omega$ and $\approx5.15$ dBi (extra 3 dB because power is confined to a hemisphere).</p>
        <ul>
          <li><strong>Pattern:</strong> omnidirectional in the plane perpendicular to the wire.</li>
          <li><strong>Polarization:</strong> linear, along the wire.</li>
          <li><strong>Use:</strong> broadcast, whips, base stations, the building block of arrays.</li>
        </ul>`
      },
      {
        h: 'Yagi-Uda (parasitic array)',
        html: String.raw`<p>The <strong>Yagi-Uda</strong> adds passive (parasitic) elements to one driven dipole: a slightly longer <em>reflector</em> behind and several shorter <em>directors</em> in front. Mutual coupling and phasing make radiation add up in the director direction, producing an end-fire beam. Gain grows with the number of directors — roughly 7 dBi for a few elements up to 15+ dBi for long booms.</p>
        <ul>
          <li><strong>Gain:</strong> ~7–16 dBi; <strong>bandwidth:</strong> narrow (5–10%).</li>
          <li><strong>Pattern:</strong> directional end-fire, good front-to-back ratio.</li>
          <li><strong>Use:</strong> TV reception, point-to-point VHF/UHF, amateur radio.</li>
        </ul>`
      },
      {
        h: 'Microstrip patch (printed)',
        html: String.raw`<p>A <strong>patch antenna</strong> is a metal rectangle (typically $\approx\lambda/2$ on a side, in the dielectric) printed on a grounded substrate. It is low-profile, cheap, conformal, and easily arrayed, but inherently <em>narrowband</em> (1–5%) and moderate gain (~6–8 dBi per element). Feeding two edges in phase quadrature yields circular polarization.</p>
        <ul>
          <li><strong>Gain:</strong> ~6–9 dBi; <strong>bandwidth:</strong> narrow (thin substrate) unless stacked/aperture-coupled.</li>
          <li><strong>Pattern:</strong> broadside (hemispherical), radiates away from the ground plane.</li>
          <li><strong>Use:</strong> GPS, phones, satellite terminals, radar/5G array elements.</li>
        </ul>`
      },
      {
        h: 'Horn and parabolic dish (aperture)',
        html: String.raw`<p>A <strong>horn</strong> flares a waveguide to match to free space, giving 10–25 dBi, broad bandwidth, and clean low-side-lobe patterns — the standard gain reference and dish feed. A <strong>parabolic dish</strong> uses a reflector to collimate a feed's spherical wave into a plane wave, achieving very high gain $G=\eta_{ap}(\pi D/\lambda)^2$ (30–60+ dBi) and pencil beams.</p>
        <ul>
          <li><strong>Horn gain:</strong> ~10–25 dBi, wide bandwidth; <strong>dish gain:</strong> up to 60+ dBi.</li>
          <li><strong>Pattern:</strong> highly directional; dish HPBW $\approx70\lambda/D$.</li>
          <li><strong>Use:</strong> microwave links, satellite/deep-space, radio astronomy, radar.</li>
        </ul>`
      },
      {
        h: 'Helical antenna (circular polarization)',
        html: String.raw`<p>A <strong>helix</strong> in <em>axial (end-fire) mode</em> (circumference $\approx\lambda$) radiates a <strong>circularly polarized</strong> beam along its axis with ~10–15 dBi. Its sense (RHCP/LHCP) follows the winding. In <em>normal mode</em> (small helix) it radiates broadside like a short dipole.</p>
        <ul>
          <li><strong>Polarization:</strong> circular (axial mode) — its defining feature.</li>
          <li><strong>Bandwidth:</strong> relatively wide in axial mode.</li>
          <li><strong>Use:</strong> satellite uplinks/downlinks, GPS, telemetry where orientation is uncontrolled.</li>
        </ul>`
      },
      {
        h: 'Phased array (electronic steering)',
        html: String.raw`<p>A <strong>phased array</strong> feeds many elements with controlled relative phase so the beam points where the phases add constructively — <em>without moving parts</em>. For a linear array of spacing $d$, steering the beam to angle $\theta$ requires a progressive inter-element phase shift:</p>
        <p>$$\phi = \frac{2\pi d}{\lambda}\sin\theta$$</p>
        <ul>
          <li><strong>Steering:</strong> electronic, instantaneous; enables multi-beam and beamforming.</li>
          <li><strong>Grating lobes:</strong> avoided by keeping $d\le\lambda/2$ for full scan.</li>
          <li><strong>Use:</strong> radar (AESA), 5G mmWave, satellite comms, Starlink terminals.</li>
        </ul>
        <div class="callout"><strong>Key insight:</strong> A physical delay $d\sin\theta$ across the aperture is compensated by an electrical phase $2\pi d\sin\theta/\lambda$, so all elements' contributions arrive in phase at the steered angle.</div>`
      },
      {
        h: 'Loop and ferrite (magnetic, electrically small)',
        html: String.raw`<p>A small <strong>loop antenna</strong> responds to the magnetic field; its pattern has a null broadside to the loop plane (a maximum in-plane), making it excellent for <em>direction finding</em>. Wrapping the loop on a <strong>ferrite rod</strong> boosts effective aperture in a tiny package — the classic AM radio antenna. Small loops are low-efficiency and narrowband but robust and compact.</p>
        <ul>
          <li><strong>Pattern:</strong> figure-eight (sharp nulls) — used for DF and nulling.</li>
          <li><strong>Polarization:</strong> responds to $\vec H$; sensitive to loop orientation.</li>
          <li><strong>Use:</strong> AM receivers, RFID, direction finding, near-field/NFC.</li>
        </ul>`
      },
      {
        h: 'Comparison table',
        html: String.raw`<table class="data">
          <tr><th>Type</th><th>Typ. Gain</th><th>Bandwidth</th><th>Pattern</th><th>Polarization</th><th>Typical Use</th></tr>
          <tr><td>Half-wave dipole</td><td>2.15 dBi</td><td>moderate (~10%)</td><td>omni (doughnut)</td><td>linear</td><td>broadcast, array element</td></tr>
          <tr><td>Monopole ($\lambda/4$)</td><td>~5.15 dBi</td><td>moderate</td><td>omni over ground</td><td>linear (vertical)</td><td>whips, mobile</td></tr>
          <tr><td>Yagi-Uda</td><td>7–16 dBi</td><td>narrow</td><td>directional end-fire</td><td>linear</td><td>TV, P2P VHF/UHF</td></tr>
          <tr><td>Patch (microstrip)</td><td>6–9 dBi</td><td>narrow (1–5%)</td><td>broadside</td><td>linear or circular</td><td>GPS, phones, arrays</td></tr>
          <tr><td>Horn</td><td>10–25 dBi</td><td>wide</td><td>directional</td><td>linear</td><td>gain standard, feed</td></tr>
          <tr><td>Parabolic dish</td><td>30–60+ dBi</td><td>wide (feed-limited)</td><td>pencil beam</td><td>feed-dependent</td><td>satellite, radar, astronomy</td></tr>
          <tr><td>Helix (axial)</td><td>10–15 dBi</td><td>wide</td><td>axial beam</td><td>circular</td><td>satellite, GPS, telemetry</td></tr>
          <tr><td>Phased array</td><td>scalable/high</td><td>element-limited</td><td>steerable beam</td><td>configurable</td><td>AESA radar, 5G, SatCom</td></tr>
          <tr><td>Loop / ferrite</td><td>low (< 0 dBi)</td><td>narrow</td><td>figure-eight</td><td>magnetic (H-field)</td><td>AM, RFID, DF</td></tr>
        </table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to pick and compare antenna types on their merits:</p>
        <ul>
          <li><strong>Wire (dipole/monopole):</strong> the omnidirectional building blocks — dipole $2.15$ dBi at $73\ \Omega$; $\lambda/4$ monopole $\approx5.15$ dBi at $\approx36.5\ \Omega$ from image theory.</li>
          <li><strong>Directional wire (Yagi):</strong> a driven element plus reflector and directors gives cheap end-fire gain (7–16 dBi), narrowband.</li>
          <li><strong>Printed (patch):</strong> low-profile, cheap, arrayable, but narrowband; readily made circularly polarized.</li>
          <li><strong>Aperture (horn, dish):</strong> the high-gain family — horns as wideband references/feeds, dishes for the highest gain $G=\eta_{ap}(\pi D/\lambda)^2$.</li>
          <li><strong>Circular polarization (helix, CP patch):</strong> tolerates unknown orientation and Faraday rotation.</li>
          <li><strong>Steerable (phased array):</strong> electronic beam pointing via $\phi=2\pi d\sin\theta/\lambda$, keeping $d\le\lambda/2$ to avoid grating lobes.</li>
          <li><strong>Small magnetic (loop/ferrite):</strong> figure-eight pattern with sharp nulls for direction finding.</li>
          <li><strong>The overarching lesson:</strong> every choice trades gain, bandwidth, pattern, polarization, size and steering against cost — there is no universal antenna.</li>
        </ul></div>`
      }
    ],
    keyPoints: [
      String.raw`Half-wave dipole: 2.15 dBi, $73\ \Omega$, omnidirectional (doughnut), linear.`,
      String.raw`$\lambda/4$ monopole over ground: $\approx36.5\ \Omega$, $\approx5.15$ dBi (hemisphere confinement adds 3 dB).`,
      String.raw`Yagi-Uda: one driven element + reflector + directors; directional end-fire, narrowband, 7–16 dBi.`,
      String.raw`Patch: printed, low-profile, cheap, narrowband; broadside pattern; easily made circular and arrayed.`,
      String.raw`Horn: waveguide-to-space taper; wideband, clean low-SLL, the standard gain reference and dish feed.`,
      String.raw`Parabolic dish: highest gain $G=\eta_{ap}(\pi D/\lambda)^2$, pencil beam, HPBW $\approx70\lambda/D$.`,
      String.raw`Helix (axial mode, circumference $\approx\lambda$): circular polarization, 10–15 dBi.`,
      String.raw`Phased array steering phase: $\phi=2\pi d\sin\theta/\lambda$; keep $d\le\lambda/2$ to avoid grating lobes.`,
      String.raw`Loop/ferrite: magnetic, small, figure-eight pattern with sharp nulls for direction finding.`,
      String.raw`Circular polarization (helix, CP patch) tolerates unknown orientation and rejects opposite-sense multipath.`,
      String.raw`Bandwidth vs size: small printed/loop antennas are narrowband; horns/dishes are wideband.`,
      String.raw`Phased arrays steer electronically with no moving parts — enabling multi-beam radar and 5G beamforming.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="300" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Antenna zoo</text>
          <!-- dipole -->
          <rect x="40" y="45" width="8" height="35" fill="#4dabf7"/><rect x="40" y="90" width="8" height="35" fill="#4dabf7"/>
          <text x="44" y="140" fill="#9aa7b5" font-size="10" text-anchor="middle">dipole</text>
          <!-- yagi -->
          <line x1="150" y1="45" x2="150" y2="125" stroke="#9aa7b5" stroke-width="1.5"/>
          <line x1="150" y1="50" x2="150" y2="50" stroke="#4dabf7"/>
          <rect x="146" y="48" width="8" height="4" fill="#ff6b6b"/>
          <rect x="146" y="70" width="8" height="4" fill="#4dabf7"/>
          <rect x="146" y="88" width="8" height="4" fill="#63e6be"/>
          <rect x="146" y="104" width="8" height="4" fill="#63e6be"/>
          <text x="150" y="140" fill="#9aa7b5" font-size="10" text-anchor="middle">Yagi</text>
          <!-- patch -->
          <rect x="230" y="55" width="60" height="45" fill="none" stroke="#9aa7b5" stroke-width="1.5"/>
          <rect x="242" y="65" width="36" height="25" fill="#4dabf7" opacity="0.7"/>
          <text x="260" y="140" fill="#9aa7b5" font-size="10" text-anchor="middle">patch</text>
          <!-- horn -->
          <path d="M350,60 L390,45 L390,110 L350,95 Z" fill="#ffa94d" opacity="0.5" stroke="#ffa94d" stroke-width="1.5"/>
          <rect x="335" y="72" width="15" height="12" fill="#ffa94d"/>
          <text x="365" y="140" fill="#9aa7b5" font-size="10" text-anchor="middle">horn</text>
          <!-- dish -->
          <path d="M450,45 A40 40 0 0 0 450,125" fill="none" stroke="#b197fc" stroke-width="2.5"/>
          <circle cx="480" cy="85" r="4" fill="#ffa94d"/>
          <line x1="460" y1="85" x2="480" y2="85" stroke="#9aa7b5" stroke-width="1"/>
          <text x="470" y="140" fill="#9aa7b5" font-size="10" text-anchor="middle">dish</text>
          <!-- helix -->
          <path d="M60,180 q20,-12 0,-24 q-20,-12 0,-24 q20,-12 0,-24 q-20,-12 0,-24" fill="none" stroke="#63e6be" stroke-width="2" transform="translate(0,90)"/>
          <text x="60" y="290" fill="#9aa7b5" font-size="10" text-anchor="middle">helix (CP)</text>
          <!-- phased array -->
          <g>
            <rect x="180" y="200" width="10" height="24" fill="#4dabf7"/>
            <rect x="200" y="200" width="10" height="24" fill="#4dabf7"/>
            <rect x="220" y="200" width="10" height="24" fill="#4dabf7"/>
            <rect x="240" y="200" width="10" height="24" fill="#4dabf7"/>
            <line x1="215" y1="200" x2="270" y2="165" stroke="#63e6be" stroke-width="2" stroke-dasharray="4 3"/>
            <text x="215" y="290" fill="#9aa7b5" font-size="10" text-anchor="middle">phased array (steered)</text>
          </g>
          <!-- loop -->
          <circle cx="400" cy="215" r="24" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
          <text x="400" y="290" fill="#9aa7b5" font-size="10" text-anchor="middle">loop / ferrite</text>
        </svg>`,
        caption: 'The antenna zoo: dipole, Yagi, patch, horn, dish, helix, phased array (with steered beam), and loop.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="240" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">Phased-array steering: progressive phase = 2&#960;d sin&#952;/&#955;</text>
          <line x1="60" y1="190" x2="480" y2="190" stroke="#9aa7b5" stroke-width="1.5"/>
          <!-- elements -->
          <circle cx="100" cy="190" r="6" fill="#4dabf7"/><circle cx="180" cy="190" r="6" fill="#4dabf7"/>
          <circle cx="260" cy="190" r="6" fill="#4dabf7"/><circle cx="340" cy="190" r="6" fill="#4dabf7"/>
          <circle cx="420" cy="190" r="6" fill="#4dabf7"/>
          <text x="140" y="210" fill="#9aa7b5" font-size="11" text-anchor="middle">d</text>
          <line x1="100" y1="200" x2="180" y2="200" stroke="#9aa7b5" stroke-width="1"/>
          <!-- steered wavefront -->
          <line x1="100" y1="190" x2="280" y2="70" stroke="#63e6be" stroke-width="2"/>
          <text x="290" y="65" fill="#63e6be" font-size="12">beam @ &#952;</text>
          <!-- tilted wavefront lines -->
          <line x1="120" y1="150" x2="240" y2="150" stroke="#b197fc" stroke-width="1.2" stroke-dasharray="4 3" transform="rotate(-33 180 150)"/>
          <text x="300" y="150" fill="#b197fc" font-size="11">equiphase front</text>
          <!-- phase increments -->
          <text x="100" y="230" fill="#ffa94d" font-size="10" text-anchor="middle">0</text>
          <text x="180" y="230" fill="#ffa94d" font-size="10" text-anchor="middle">&#966;</text>
          <text x="260" y="230" fill="#ffa94d" font-size="10" text-anchor="middle">2&#966;</text>
          <text x="340" y="230" fill="#ffa94d" font-size="10" text-anchor="middle">3&#966;</text>
          <text x="420" y="230" fill="#ffa94d" font-size="10" text-anchor="middle">4&#966;</text>
        </svg>`,
        caption: 'Applying a progressive phase phi across equally spaced elements tilts the equiphase wavefront, steering the beam to angle theta.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <defs>
            <marker id="arr3-antenna-types" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#63e6be"/></marker>
          </defs>
          <rect width="540" height="300" fill="#1c232e"/>
          <text x="270" y="22" fill="#e6edf3" font-size="14" text-anchor="middle">Selection flow: pick the antenna from the requirement</text>
          <rect x="180" y="38" width="180" height="40" rx="6" fill="#1c232e" stroke="#b197fc" stroke-width="1.8"/>
          <text x="270" y="63" fill="#e6edf3" font-size="12" text-anchor="middle">Requirements</text>
          <!-- branch: gain -->
          <rect x="20" y="110" width="150" height="46" rx="6" fill="#1c232e" stroke="#4dabf7" stroke-width="1.6"/>
          <text x="95" y="130" fill="#e6edf3" font-size="11.5" text-anchor="middle">Very high gain?</text>
          <text x="95" y="147" fill="#9aa7b5" font-size="10" text-anchor="middle">dish / horn / array</text>
          <!-- branch: omni -->
          <rect x="195" y="110" width="150" height="46" rx="6" fill="#1c232e" stroke="#ffa94d" stroke-width="1.6"/>
          <text x="270" y="130" fill="#e6edf3" font-size="11.5" text-anchor="middle">Omni coverage?</text>
          <text x="270" y="147" fill="#9aa7b5" font-size="10" text-anchor="middle">dipole / monopole</text>
          <!-- branch: CP -->
          <rect x="370" y="110" width="150" height="46" rx="6" fill="#1c232e" stroke="#63e6be" stroke-width="1.6"/>
          <text x="445" y="130" fill="#e6edf3" font-size="11.5" text-anchor="middle">Circular pol.?</text>
          <text x="445" y="147" fill="#9aa7b5" font-size="10" text-anchor="middle">helix / CP patch</text>
          <line x1="230" y1="78" x2="110" y2="108" stroke="#63e6be" stroke-width="1.6" marker-end="url(#arr3-antenna-types)"/>
          <line x1="270" y1="78" x2="270" y2="108" stroke="#63e6be" stroke-width="1.6" marker-end="url(#arr3-antenna-types)"/>
          <line x1="310" y1="78" x2="430" y2="108" stroke="#63e6be" stroke-width="1.6" marker-end="url(#arr3-antenna-types)"/>
          <!-- second row -->
          <rect x="20" y="190" width="150" height="46" rx="6" fill="#1c232e" stroke="#4dabf7" stroke-width="1.6"/>
          <text x="95" y="210" fill="#e6edf3" font-size="11.5" text-anchor="middle">Low-profile / printed?</text>
          <text x="95" y="227" fill="#9aa7b5" font-size="10" text-anchor="middle">patch (microstrip)</text>
          <rect x="195" y="190" width="150" height="46" rx="6" fill="#1c232e" stroke="#ffa94d" stroke-width="1.6"/>
          <text x="270" y="210" fill="#e6edf3" font-size="11.5" text-anchor="middle">Steer w/o motor?</text>
          <text x="270" y="227" fill="#9aa7b5" font-size="10" text-anchor="middle">phased array</text>
          <rect x="370" y="190" width="150" height="46" rx="6" fill="#1c232e" stroke="#63e6be" stroke-width="1.6"/>
          <text x="445" y="210" fill="#e6edf3" font-size="11.5" text-anchor="middle">Direction finding?</text>
          <text x="445" y="227" fill="#9aa7b5" font-size="10" text-anchor="middle">loop / ferrite</text>
          <text x="270" y="270" fill="#b197fc" font-size="11" text-anchor="middle">Every choice trades gain, bandwidth, size, polarization &amp; steering vs cost.</text>
        </svg>`,
        caption: 'A requirement-driven chooser: gain, coverage, polarization, profile, steering and direction-finding needs each funnel toward a specific antenna family.'
      }
    ],
    equations: [
      {
        title: 'Phased-array steering phase',
        tex: String.raw`$$\phi = \frac{2\pi d}{\lambda}\sin\theta$$`,
        derivation: String.raw`<p>To point the beam at $\theta$, wavefronts from adjacent elements must arrive in phase in that direction. The geometric path difference between neighbours is $d\sin\theta$. Converting length to phase ($\times 2\pi/\lambda$) gives the required progressive electrical phase $\phi=2\pi d\sin\theta/\lambda$ applied element-to-element to compensate it.</p>`
      },
      {
        title: 'Grating-lobe condition',
        tex: String.raw`$$d \le \frac{\lambda}{1+|\sin\theta_{max}|} \;\Rightarrow\; d\le \frac{\lambda}{2}\ (\text{full scan})$$`,
        derivation: String.raw`<p>Grating lobes appear when the array factor repeats: $ (d/\lambda)(\sin\theta-\sin\theta_0)=\pm1$. Avoiding a grating lobe for scan up to $\theta_{max}$ requires $d\le\lambda/(1+|\sin\theta_{max}|)$; for $\pm90°$ scan this is $d\le\lambda/2$.</p>`
      },
      {
        title: 'Monopole gain from image theory',
        tex: String.raw`$$G_{mono} = 2\,G_{dipole}\ (\text{linear}) \Rightarrow \approx 5.15\ \mathrm{dBi}$$`,
        derivation: String.raw`<p>The ground-plane image completes the missing arm, so the monopole radiates the dipole pattern but only into the upper hemisphere. With the same input power confined to half the solid angle, the peak intensity — and thus gain — doubles ($+3$ dB): $2.15+3=5.15$ dBi. Its radiation resistance is halved to $\approx36.5\ \Omega$.</p>`
      },
      {
        title: 'Parabolic dish gain',
        tex: String.raw`$$G = \eta_{ap}\left(\frac{\pi D}{\lambda}\right)^2$$`,
        derivation: String.raw`<p>From $G=4\pi A_e/\lambda^2$ with $A_e=\eta_{ap}\pi D^2/4$, giving $G=\eta_{ap}\pi^2D^2/\lambda^2=\eta_{ap}(\pi D/\lambda)^2$ (see Antenna Gain).</p>`
      },
      {
        title: 'Yagi resonant element length',
        tex: String.raw`$$\ell_{driven}\approx 0.47\lambda,\quad \ell_{refl}\approx 0.5\lambda,\quad \ell_{dir}\approx 0.4\text{–}0.45\lambda$$`,
        derivation: String.raw`<p>The reflector is made electrically longer (inductive) so its induced current lags, reinforcing radiation forward; directors are shorter (capacitive) so their current leads — the phasing steers the pattern end-fire toward the directors.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Gain and impedance of a half-wave dipole?`, back: String.raw`2.15 dBi, $Z_A\approx73+j42.5\ \Omega$.` },
      { front: String.raw`Why is a $\lambda/4$ monopole ~5.15 dBi?`, back: String.raw`Image theory confines the dipole pattern to a hemisphere: +3 dB over the dipole.` },
      { front: String.raw`Elements of a Yagi-Uda?`, back: String.raw`One driven dipole, a longer reflector behind, and shorter directors in front.` },
      { front: String.raw`Key weakness of a patch antenna?`, back: String.raw`Narrow bandwidth (1–5%) unless stacked/aperture-coupled.` },
      { front: String.raw`What is a horn used for besides comms?`, back: String.raw`As a gain standard and as the feed for parabolic dishes; wideband, low SLL.` },
      { front: String.raw`Parabolic dish gain formula?`, back: String.raw`$G=\eta_{ap}(\pi D/\lambda)^2$.` },
      { front: String.raw`Defining feature of an axial-mode helix?`, back: String.raw`Circular polarization along its axis (~10–15 dBi).` },
      { front: String.raw`Phased-array steering phase?`, back: String.raw`$\phi=2\pi d\sin\theta/\lambda$ per element.` },
      { front: String.raw`How to avoid grating lobes for full scan?`, back: String.raw`Keep element spacing $d\le\lambda/2$.` },
      { front: String.raw`Pattern of a small loop antenna?`, back: String.raw`Figure-eight with sharp nulls; used for direction finding.` },
      { front: String.raw`Which antenna suits GPS orientation-agnostic reception?`, back: String.raw`Circularly polarized (CP patch or helix).` },
      { front: String.raw`Which antenna gives the highest gain?`, back: String.raw`The parabolic dish (30–60+ dBi), scaling as $(D/\lambda)^2$.` },
      { front: String.raw`Advantage of phased arrays over dishes?`, back: String.raw`Electronic, inertialess beam steering and multi-beam operation — no moving parts.` }
    ],
    mcqs: [
      { q: String.raw`A quarter-wave monopole over a ground plane has impedance about:`, options: [String.raw`73 Ω`, String.raw`36.5 Ω`, String.raw`50 Ω`, String.raw`300 Ω`], answer: 1, explain: String.raw`Half the dipole radiation resistance by image theory.` },
      { q: String.raw`In a Yagi-Uda, the reflector element is:`, options: [String.raw`shorter than driven`, String.raw`longer than driven`, String.raw`same length`, String.raw`fed directly`], answer: 1, explain: String.raw`Longer/inductive reflector steers radiation forward toward the directors.` },
      { q: String.raw`Which antenna is inherently narrowband and low-profile?`, options: [String.raw`horn`, String.raw`microstrip patch`, String.raw`parabolic dish`, String.raw`helix`], answer: 1, explain: String.raw`Patches are thin, printed, and narrowband (1–5%).` },
      { q: String.raw`Which produces circular polarization by its geometry?`, options: [String.raw`dipole`, String.raw`axial-mode helix`, String.raw`horn`, String.raw`monopole`], answer: 1, explain: String.raw`An axial-mode helix radiates CP along its axis.` },
      { q: String.raw`Phased-array inter-element steering phase for angle θ:`, options: [String.raw`$2\pi d/\lambda$`, String.raw`$2\pi d\sin\theta/\lambda$`, String.raw`$\pi d\cos\theta$`, String.raw`$\lambda/2d$`], answer: 1, explain: String.raw`Compensates the $d\sin\theta$ path difference.` },
      { q: String.raw`To avoid grating lobes over full ±90° scan, spacing must satisfy:`, options: [String.raw`$d\ge\lambda$`, String.raw`$d\le\lambda/2$`, String.raw`$d=\lambda$`, String.raw`$d\le2\lambda$`], answer: 1, explain: String.raw`$d\le\lambda/(1+|\sin\theta_{max}|)=\lambda/2$ for $90°$.` },
      { q: String.raw`Highest-gain antenna among these:`, options: [String.raw`dipole`, String.raw`Yagi`, String.raw`parabolic dish`, String.raw`patch`], answer: 2, explain: String.raw`Dishes reach 30–60+ dBi via large $(D/\lambda)^2$.` },
      { q: String.raw`A small loop's pattern is:`, options: [String.raw`omnidirectional`, String.raw`pencil beam`, String.raw`figure-eight with nulls`, String.raw`end-fire`], answer: 2, explain: String.raw`Figure-eight (H-field) — good for direction finding.` },
      { q: String.raw`Standard gain reference antenna in a microwave lab:`, options: [String.raw`patch`, String.raw`horn`, String.raw`loop`, String.raw`monopole`], answer: 1, explain: String.raw`Horns have well-known, stable gain and wide bandwidth.` },
      { q: String.raw`The main advantage of a phased array over a mechanically steered dish:`, options: [String.raw`lower cost`, String.raw`electronic inertialess steering`, String.raw`higher single-element gain`, String.raw`wider bandwidth`], answer: 1, explain: String.raw`No moving parts; instantaneous, multi-beam steering.` },
      { q: String.raw`A dipole's radiation pattern is:`, options: [String.raw`pencil beam`, String.raw`toroidal (doughnut)`, String.raw`figure-eight in azimuth`, String.raw`isotropic`], answer: 1, explain: String.raw`Omnidirectional in azimuth with a null along the wire axis.` },
      { q: String.raw`Circular polarization is preferred for satellites mainly to:`, options: [String.raw`increase gain by 3 dB`, String.raw`tolerate orientation and Faraday rotation`, String.raw`reduce cost`, String.raw`widen bandwidth`], answer: 1, explain: String.raw`CP works regardless of relative orientation and survives ionospheric rotation.` }
    ],
    numericals: [
      { q: String.raw`A phased array has elements spaced $d=0.5\lambda$. Find the steering phase to point the beam at $30°$.`, solution: String.raw`<p><b>Formula.</b> $$\phi=\frac{2\pi d}{\lambda}\sin\theta$$ where $\phi$ = progressive inter-element phase (rad), $d$ = element spacing, $\theta$ = steering angle off boresight.</p>
      <p><b>Substitute.</b> $$\phi=2\pi\left(\frac{0.5\lambda}{\lambda}\right)\sin 30°=2\pi(0.5)(0.5)$$</p>
      <p><b>Compute.</b> $\phi=\pi/2$ rad $=90°$ per element.</p>
      <p><b>Explanation.</b> Each element leads its neighbour by $90°$ so their contributions add in phase at $30°$. This electrical phase compensates the physical path difference $d\sin\theta$ across the array.</p>` },
      { q: String.raw`For $d=0.6\lambda$, what maximum scan angle avoids grating lobes?`, solution: String.raw`<p><b>Formula.</b> $$d\le\frac{\lambda}{1+|\sin\theta_{max}|}\;\Rightarrow\;\sin\theta_{max}\le\frac{\lambda}{d}-1$$ where $\theta_{max}$ = largest grating-lobe-free scan angle, $d$ = spacing.</p>
      <p><b>Substitute.</b> $$0.6\le\frac{1}{1+\sin\theta_{max}}\;\Rightarrow\;1+\sin\theta_{max}\le\frac{1}{0.6}=1.667$$</p>
      <p><b>Compute.</b> $\sin\theta_{max}\le0.667$, so $\theta_{max}=\sin^{-1}(0.667)=41.8°$.</p>
      <p><b>Explanation.</b> Spacing above $\lambda/2$ limits the grating-lobe-free scan: at $0.6\lambda$ the array can only scan to about $\pm42°$ before a false beam appears. Keeping $d\le\lambda/2$ permits full $\pm90°$ scan.</p>` },
      { q: String.raw`A 2.4 m dish at 11 GHz has $\eta_{ap}=0.65$. Find the gain in dBi.`, solution: String.raw`<p><b>Formula.</b> $$G=\eta_{ap}\left(\frac{\pi D}{\lambda}\right)^2,\qquad \lambda=\frac{c}{f}$$ where $G$ = gain (linear), $\eta_{ap}$ = aperture efficiency, $D$ = diameter (m).</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{1.1\times10^{10}},\qquad G=0.65\left(\frac{\pi\times2.4}{0.0273}\right)^2$$</p>
      <p><b>Compute.</b> $\lambda=0.0273$ m; $\pi D/\lambda=276.2$; $G=0.65\times(276.2)^2=0.65\times76290=49588$; $10\log_{10}(49588)=47.0$ dBi.</p>
      <p><b>Explanation.</b> A 2.4 m Ku-band dish reaches 47 dBi — the very high directivity that makes VSAT and satellite links close over 36 000 km.</p>` },
      { q: String.raw`Find the length of a Yagi driven element (0.47λ) and reflector (0.5λ) at 145 MHz.`, solution: String.raw`<p><b>Formula.</b> $$\ell_{driven}=0.47\lambda,\quad \ell_{refl}=0.5\lambda,\qquad \lambda=\frac{c}{f}$$ where $\ell$ = element length (m); the reflector is made longer (inductive) than the driven element.</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{1.45\times10^8},\qquad \ell_{driven}=0.47\lambda,\quad \ell_{refl}=0.5\lambda$$</p>
      <p><b>Compute.</b> $\lambda=2.069$ m; $\ell_{driven}=0.47\times2.069=0.972$ m; $\ell_{refl}=0.5\times2.069=1.035$ m.</p>
      <p><b>Explanation.</b> At 2 m (VHF) the elements are around a metre long — hence rooftop TV/ham Yagis are large. The slightly longer reflector phases the pattern forward toward the directors.</p>` },
      { q: String.raw`A helix in axial mode has circumference $C=\lambda$ at 1.5 GHz. Find its diameter.`, solution: String.raw`<p><b>Formula.</b> $$C=\pi D=\lambda\;\Rightarrow\;D=\frac{\lambda}{\pi},\qquad \lambda=\frac{c}{f}$$ where $C$ = coil circumference, $D$ = helix diameter (m).</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{1.5\times10^9},\qquad D=\frac{\lambda}{\pi}$$</p>
      <p><b>Compute.</b> $\lambda=0.2$ m; $D=\dfrac{0.2}{3.1416}=0.0637$ m $=6.37$ cm.</p>
      <p><b>Explanation.</b> Axial (end-fire) mode requires a circumference near one wavelength, giving a $\sim6$ cm coil at L-band that radiates circular polarization — ideal for GPS and satellite telemetry.</p>` },
      { q: String.raw`Compare capture area of a 2.15 dBi dipole and a 25 dBi dish at 3 GHz.`, solution: String.raw`<p><b>Formula.</b> $$A_e=\frac{G\lambda^2}{4\pi},\qquad G=10^{G_{\mathrm{dBi}}/10},\qquad \lambda=\frac{c}{f}$$ where $A_e$ = effective aperture (m$^2$).</p>
      <p><b>Substitute.</b> $$\lambda=\frac{3\times10^8}{3\times10^9}=0.1\ \text{m};\quad A_e^{dipole}=\frac{10^{0.215}(0.1)^2}{4\pi},\quad A_e^{dish}=\frac{10^{2.5}(0.1)^2}{4\pi}$$</p>
      <p><b>Compute.</b> Dipole $G=1.64$: $A_e=\dfrac{1.64\times0.01}{12.57}=1.30\times10^{-3}$ m$^2$. Dish $G=316$: $A_e=\dfrac{316\times0.01}{12.57}=0.251$ m$^2$. Ratio $=316/1.64\approx193\times$ (= $22.85$ dB gain difference).</p>
      <p><b>Explanation.</b> The dish captures nearly 200 times more power from the same wave — the capture-area ratio equals the gain ratio exactly, since $A_e\propto G$ at a fixed frequency.</p>` }
    ],
    realWorld: String.raw`<p>The right antenna is a systems decision. Your phone stacks several types at once: a patch or PIFA for cellular, a CP patch for GPS, and a chip antenna for Bluetooth/Wi-Fi. Rooftop TV still uses Yagis for their cheap directional gain. Satellite ground stations use dishes fed by horns, while modern flat-panel terminals (Starlink, aircraft SatCom) replace them with electronically steered phased arrays that track moving satellites without a motor. AESA radars point beams in microseconds by phase alone, and AM radios still tune tiny ferrite loops. Each choice is the comparison table in action — trading gain, bandwidth, size, polarization, and steering against cost.</p>`,
    related: ['antenna', 'antenna-gain', 'antenna-beamwidth', 'maxwell', 'link-budget']
  },

  {
    id: 'maxwell',
    title: "Maxwell's Equations",
    category: 'Antennas & Electromagnetics',
    tags: ['Maxwell', 'wave equation', 'displacement current', 'impedance of free space', 'plane wave', 'electromagnetics'],
    summary: String.raw`Maxwell's four equations unify electricity and magnetism and predict self-propagating electromagnetic waves travelling at c = 1/sqrt(mu0 eps0).`,
    prerequisites: ['antenna', 'comm-basics'],
    intro: String.raw`<p><strong>Maxwell's equations</strong> are the four laws governing all classical electromagnetism, and thus every antenna, transmission line, and radio wave. Their crowning achievement is the prediction — from adding the <em>displacement current</em> — that time-varying electric and magnetic fields regenerate one another and propagate as a wave at speed $c=1/\sqrt{\mu_0\varepsilon_0}$, which matched the measured speed of light and revealed light itself as an electromagnetic wave. This page states the four laws in differential form, explains displacement current, derives the wave equation and $c$, obtains the free-space impedance $\eta_0=\sqrt{\mu_0/\varepsilon_0}\approx377\ \Omega$, treats plane-wave $E$/$H$ relations and waves in media ($v=c/n$), and notes boundary conditions.</p>`,
    sections: [
      {
        h: 'The four equations (differential form)',
        html: String.raw`<p>In differential form, in a medium with permittivity $\varepsilon$ and permeability $\mu$:</p>
        <table class="data">
          <tr><th>Law</th><th>Differential form</th><th>Meaning</th></tr>
          <tr><td>Gauss (E)</td><td>$\nabla\cdot\vec D = \rho$</td><td>Charges are sources of $\vec E$ (flux $\propto$ enclosed charge)</td></tr>
          <tr><td>Gauss (B)</td><td>$\nabla\cdot\vec B = 0$</td><td>No magnetic monopoles; $\vec B$ lines close on themselves</td></tr>
          <tr><td>Faraday</td><td>$\nabla\times\vec E = -\dfrac{\partial\vec B}{\partial t}$</td><td>A changing $\vec B$ induces a circulating $\vec E$</td></tr>
          <tr><td>Ampère-Maxwell</td><td>$\nabla\times\vec H = \vec J + \dfrac{\partial\vec D}{\partial t}$</td><td>Current <em>and</em> changing $\vec E$ induce $\vec H$</td></tr>
        </table>
        <p>with the constitutive relations $\vec D=\varepsilon\vec E$ and $\vec B=\mu\vec H$. The symmetry between Faraday's and Ampère-Maxwell's laws — each curl driven by the other field's time derivative — is exactly what allows self-sustaining waves.</p>`
      },
      {
        h: 'Displacement current',
        html: String.raw`<p>Maxwell's decisive addition was the <strong>displacement current</strong> term $\partial\vec D/\partial t$ in Ampère's law. The original $\nabla\times\vec H=\vec J$ is inconsistent for time-varying fields: taking the divergence gives $\nabla\cdot\vec J=0$, which contradicts charge conservation $\nabla\cdot\vec J=-\partial\rho/\partial t$. Adding $\partial\vec D/\partial t$ fixes this because $\nabla\cdot(\partial\vec D/\partial t)=\partial\rho/\partial t$.</p>
        <p>Physically, between the plates of a charging capacitor there is no conduction current, yet a magnetic field still circulates — created by the changing $\vec E$-field (the displacement current). This term is what lets a changing $\vec E$ create $\vec H$ in empty space, closing the loop with Faraday's law to make a propagating wave.</p>
        <div class="callout"><strong>Key:</strong> Without displacement current there is no radiation and no light. It is the term that makes electromagnetism <em>dynamic</em>.</div>`
      },
      {
        h: 'Deriving the wave equation',
        html: String.raw`<div class="callout tip"><strong>The idea before the algebra:</strong> Faraday says a changing $\vec H$ makes $\vec E$, and Ampère-Maxwell says a changing $\vec E$ makes $\vec H$. Feed one into the other and each field ends up driven by its own second time-derivative — the signature of a wave. The curl manipulation below is just the formal way of substituting one law into the other.</div>
        <p>In a source-free region ($\rho=0$, $\vec J=0$), take the curl of Faraday's law:</p>
        <p>$$\nabla\times(\nabla\times\vec E)=-\mu\varepsilon\frac{\partial^2\vec E}{\partial t^2}$$</p>
        <p>Using the identity $\nabla\times(\nabla\times\vec E)=\nabla(\nabla\cdot\vec E)-\nabla^2\vec E$ and $\nabla\cdot\vec E=0$ (no charge), we obtain the <strong>vector wave equation</strong>:</p>
        <p>$$\nabla^2\vec E = \mu\varepsilon\frac{\partial^2\vec E}{\partial t^2}$$</p>
        <p>This is the standard wave equation $\nabla^2\vec E=(1/v^2)\partial^2\vec E/\partial t^2$ with propagation speed $v=1/\sqrt{\mu\varepsilon}$. An identical equation holds for $\vec H$. Solutions are travelling waves — electromagnetic radiation.</p>`
      },
      {
        h: 'Speed of light: c = 1/sqrt(mu0 eps0)',
        html: String.raw`<p>In vacuum, $\mu=\mu_0=4\pi\times10^{-7}$ H/m and $\varepsilon=\varepsilon_0=8.854\times10^{-12}$ F/m, so:</p>
        <p>$$c=\frac{1}{\sqrt{\mu_0\varepsilon_0}}$$</p>
        <p>Numerically $\mu_0\varepsilon_0=(4\pi\times10^{-7})(8.854\times10^{-12})=1.1127\times10^{-17}$, and $c=1/\sqrt{1.1127\times10^{-17}}=2.998\times10^8$ m/s. This coincidence with the measured speed of light was Maxwell's triumph — it proved that light <em>is</em> an electromagnetic wave.</p>`
      },
      {
        h: 'Impedance of free space',
        html: String.raw`<p>In a plane wave, $\vec E$ and $\vec H$ are locked in a fixed ratio called the <strong>intrinsic (wave) impedance</strong>:</p>
        <p>$$\eta=\frac{E}{H}=\sqrt{\frac{\mu}{\varepsilon}}$$</p>
        <p>For vacuum, $\eta_0=\sqrt{\mu_0/\varepsilon_0}=\sqrt{(4\pi\times10^{-7})/(8.854\times10^{-12})}=376.7\approx377\ \Omega$. This value appears everywhere in antenna theory — radiation resistance, power density $S=E^2/\eta_0$, and matching to free space all reference $377\ \Omega$.</p>`
      },
      {
        h: 'Plane waves: E and H relationship',
        html: String.raw`<p>A uniform plane wave propagating in $+z$ has $\vec E$ and $\vec H$ that are: (1) <strong>transverse</strong> to propagation (TEM), (2) <strong>mutually perpendicular</strong>, (3) <strong>in phase</strong> (in a lossless medium), and (4) related by $|E|=\eta|H|$. The direction of propagation is given by the <strong>Poynting vector</strong>:</p>
        <p>$$\vec S=\vec E\times\vec H\quad(\text{W/m}^2)$$</p>
        <ul>
          <li>Power density $S=EH=E^2/\eta$ points along $\hat k=\hat E\times\hat H$.</li>
          <li>Right-hand rule: rotate $\vec E$ into $\vec H$; thumb gives propagation direction.</li>
          <li>The far field of any antenna locally looks like such a TEM plane wave.</li>
        </ul>`
      },
      {
        h: 'Waves in media (v = c/n) and boundary conditions',
        html: String.raw`<p>In a dielectric with relative permittivity $\varepsilon_r$ (and usually $\mu_r=1$), the wave slows:</p>
        <p>$$v=\frac{1}{\sqrt{\mu\varepsilon}}=\frac{c}{\sqrt{\varepsilon_r\mu_r}}=\frac{c}{n},\qquad n=\sqrt{\varepsilon_r\mu_r}$$</p>
        <p>The wavelength shrinks to $\lambda_m=\lambda_0/n$ while frequency is unchanged — why patch antennas printed on $\varepsilon_r=4$ substrate are physically smaller. The intrinsic impedance becomes $\eta=\eta_0/\sqrt{\varepsilon_r}$ (for $\mu_r=1$).</p>
        <p><strong>Boundary conditions</strong> (derived from the integral forms) govern fields at interfaces:</p>
        <ul>
          <li>Tangential $\vec E$ is continuous; tangential $\vec H$ jumps by any surface current $\vec K$.</li>
          <li>Normal $\vec D$ jumps by any surface charge $\sigma$; normal $\vec B$ is continuous.</li>
          <li>At a perfect conductor: tangential $\vec E=0$ and normal $\vec B=0$ at the surface (why currents flow on the skin and antennas can be fed against ground planes).</li>
        </ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>These four laws are the foundation for everything else on this site — you should now grasp:</p>
        <ul>
          <li><strong>The four laws:</strong> Gauss(E) ($\nabla\cdot\vec D=\rho$) and Gauss(B) ($\nabla\cdot\vec B=0$) fix the sources; Faraday and Ampère-Maxwell couple $\vec E$ and $\vec H$ through their time derivatives.</li>
          <li><strong>Displacement current:</strong> the $\partial\vec D/\partial t$ term restores charge conservation and lets a changing $\vec E$ create $\vec H$ in empty space — without it there is no radiation.</li>
          <li><strong>Why waves exist:</strong> the two curl laws regenerate one another, yielding $\nabla^2\vec E=\mu\varepsilon\,\partial^2\vec E/\partial t^2$ with speed $v=1/\sqrt{\mu\varepsilon}$.</li>
          <li><strong>Two vacuum constants:</strong> $c=1/\sqrt{\mu_0\varepsilon_0}\approx3\times10^8$ m/s and $\eta_0=\sqrt{\mu_0/\varepsilon_0}\approx377\ \Omega$.</li>
          <li><strong>Plane-wave picture:</strong> $\vec E\perp\vec H\perp\hat k$, in phase, $E=\eta H$, with power flow $\vec S=\vec E\times\vec H$ — the local form of every antenna's far field.</li>
          <li><strong>Media and boundaries:</strong> $v=c/n$, $\lambda_m=\lambda_0/n$, $\eta=\eta_0/\sqrt{\varepsilon_r}$; tangential $\vec E$ is continuous and vanishes at a perfect conductor.</li>
        </ul></div>`
      }
    ],
    keyPoints: [
      String.raw`Gauss (E): $\nabla\cdot\vec D=\rho$ — charges source the electric field.`,
      String.raw`Gauss (B): $\nabla\cdot\vec B=0$ — no magnetic monopoles.`,
      String.raw`Faraday: $\nabla\times\vec E=-\partial\vec B/\partial t$ — changing $\vec B$ makes $\vec E$.`,
      String.raw`Ampère-Maxwell: $\nabla\times\vec H=\vec J+\partial\vec D/\partial t$ — current and changing $\vec E$ make $\vec H$.`,
      String.raw`Displacement current $\partial\vec D/\partial t$ restores charge conservation and enables radiation.`,
      String.raw`Wave equation $\nabla^2\vec E=\mu\varepsilon\,\partial^2\vec E/\partial t^2$; speed $v=1/\sqrt{\mu\varepsilon}$.`,
      String.raw`$c=1/\sqrt{\mu_0\varepsilon_0}=2.998\times10^8$ m/s — proving light is an EM wave.`,
      String.raw`Free-space impedance $\eta_0=\sqrt{\mu_0/\varepsilon_0}\approx377\ \Omega$.`,
      String.raw`Plane wave: $\vec E\perp\vec H\perp\hat k$ (TEM), in phase, $E=\eta H$.`,
      String.raw`Poynting vector $\vec S=\vec E\times\vec H$ gives power flow direction and density $E^2/\eta$.`,
      String.raw`In media $v=c/n$, $\lambda_m=\lambda_0/n$, $\eta=\eta_0/\sqrt{\varepsilon_r}$ (with $n=\sqrt{\varepsilon_r\mu_r}$).`,
      String.raw`Boundaries: tangential $\vec E$ continuous; at a PEC surface tangential $\vec E=0$.`
    ],
    diagram: [
      {
        svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="260" fill="#1c232e"/>
          <text x="270" y="20" fill="#e6edf3" font-size="14" text-anchor="middle">TEM plane wave: E &#8869; H &#8869; propagation</text>
          <!-- propagation axis -->
          <line x1="40" y1="140" x2="500" y2="140" stroke="#9aa7b5" stroke-width="1.5"/>
          <path d="M500,140 l-8,-4 l0,8 z" fill="#9aa7b5"/>
          <text x="505" y="135" fill="#9aa7b5" font-size="11">z (k)</text>
          <!-- E field (vertical sinusoid) -->
          <path d="M40,140 C80,60 120,60 160,140 C200,220 240,220 280,140 C320,60 360,60 400,140 C440,220 480,220 500,140" fill="none" stroke="#4dabf7" stroke-width="2.2"/>
          <text x="150" y="55" fill="#4dabf7" font-size="12">E (x)</text>
          <!-- H field (horizontal-ish, drawn as smaller amplitude offset) -->
          <path d="M40,140 C80,110 120,110 160,140 C200,170 240,170 280,140 C320,110 360,110 400,140 C440,170 480,170 500,140" fill="none" stroke="#ff6b6b" stroke-width="2.2" stroke-dasharray="5 3"/>
          <text x="150" y="185" fill="#ff6b6b" font-size="12">H (y)</text>
          <text x="270" y="245" fill="#9aa7b5" font-size="11" text-anchor="middle">E and H in phase; ratio E/H = &#951; = 377 &#937; in vacuum</text>
        </svg>`,
        caption: 'A uniform plane wave: E and H are orthogonal, in phase, and transverse to the propagation direction; their ratio is the intrinsic impedance.'
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <rect width="540" height="250" fill="#1c232e"/>
          <text x="270" y="22" fill="#e6edf3" font-size="14" text-anchor="middle">Self-sustaining wave: Faraday and Ampere-Maxwell feed each other</text>
          <!-- E loop -->
          <ellipse cx="170" cy="130" rx="70" ry="45" fill="none" stroke="#4dabf7" stroke-width="2"/>
          <text x="170" y="135" fill="#4dabf7" font-size="13" text-anchor="middle">changing E</text>
          <!-- H loop -->
          <ellipse cx="370" cy="130" rx="70" ry="45" fill="none" stroke="#ff6b6b" stroke-width="2"/>
          <text x="370" y="135" fill="#ff6b6b" font-size="13" text-anchor="middle">changing H</text>
          <!-- arrows between -->
          <path d="M240,110 C280,90 300,90 300,110" fill="none" stroke="#63e6be" stroke-width="2" marker-end="url(#mx-arrow)"/>
          <path d="M300,150 C300,170 280,170 240,150" fill="none" stroke="#ffa94d" stroke-width="2" marker-end="url(#mx-arrow2)"/>
          <defs>
            <marker id="mx-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#63e6be"/></marker>
            <marker id="mx-arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#ffa94d"/></marker>
          </defs>
          <text x="300" y="80" fill="#63e6be" font-size="11" text-anchor="middle">Ampere-Maxwell: dE/dt &#8594; H</text>
          <text x="270" y="200" fill="#ffa94d" font-size="11" text-anchor="middle">Faraday: dH/dt &#8594; E</text>
          <text x="270" y="230" fill="#9aa7b5" font-size="11" text-anchor="middle">the loop closes &#8594; wave propagates at c = 1/&#8730;(&#956;&#8320;&#949;&#8320;)</text>
        </svg>`,
        caption: "Faraday's and Ampere-Maxwell's laws regenerate one another, so an EM disturbance propagates as a wave at c."
      },
      {
        svg: String.raw`<svg viewBox="0 0 540 270" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
          <defs>
            <marker id="arr3-maxwell" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#63e6be"/></marker>
          </defs>
          <rect width="540" height="270" fill="#1c232e"/>
          <text x="270" y="22" fill="#e6edf3" font-size="14" text-anchor="middle">Source &#8594; field map: which law links what</text>
          <!-- sources -->
          <rect x="20" y="55" width="130" height="46" rx="6" fill="#1c232e" stroke="#ffa94d" stroke-width="1.8"/>
          <text x="85" y="82" fill="#e6edf3" font-size="12" text-anchor="middle">Charge &#961;</text>
          <rect x="20" y="165" width="130" height="46" rx="6" fill="#1c232e" stroke="#b197fc" stroke-width="1.8"/>
          <text x="85" y="185" fill="#e6edf3" font-size="12" text-anchor="middle">Current J</text>
          <text x="85" y="202" fill="#9aa7b5" font-size="10" text-anchor="middle">(and &#8706;D/&#8706;t)</text>
          <!-- fields -->
          <rect x="360" y="55" width="160" height="46" rx="6" fill="#1c232e" stroke="#4dabf7" stroke-width="1.8"/>
          <text x="440" y="82" fill="#4dabf7" font-size="13" text-anchor="middle">E field</text>
          <rect x="360" y="165" width="160" height="46" rx="6" fill="#1c232e" stroke="#ff6b6b" stroke-width="1.8"/>
          <text x="440" y="192" fill="#ff6b6b" font-size="13" text-anchor="middle">H / B field</text>
          <!-- links -->
          <line x1="150" y1="78" x2="358" y2="78" stroke="#63e6be" stroke-width="1.8" marker-end="url(#arr3-maxwell)"/>
          <text x="255" y="70" fill="#9aa7b5" font-size="10.5" text-anchor="middle">Gauss(E): &#8711;&#183;D=&#961;</text>
          <line x1="150" y1="188" x2="358" y2="188" stroke="#63e6be" stroke-width="1.8" marker-end="url(#arr3-maxwell)"/>
          <text x="255" y="180" fill="#9aa7b5" font-size="10.5" text-anchor="middle">Amp&#232;re-Maxwell: &#8711;&#215;H=J+&#8706;D/&#8706;t</text>
          <!-- cross coupling -->
          <line x1="440" y1="101" x2="440" y2="163" stroke="#ffa94d" stroke-width="1.8" marker-end="url(#arr3-maxwell)"/>
          <text x="530" y="135" fill="#9aa7b5" font-size="10" text-anchor="end">Amp&#232;re</text>
          <line x1="420" y1="163" x2="420" y2="103" stroke="#63e6be" stroke-width="1.8" marker-end="url(#arr3-maxwell)"/>
          <text x="352" y="135" fill="#9aa7b5" font-size="10" text-anchor="end">Faraday</text>
          <text x="270" y="245" fill="#b197fc" font-size="11" text-anchor="middle">&#8711;&#183;B=0: no magnetic charge &#8594; H has no isolated source</text>
        </svg>`,
        caption: 'Source-to-field map: charge sources E (Gauss), current and displacement current source H (Ampere-Maxwell), and the two curl laws cross-couple E and H; B has no source because there are no magnetic monopoles.'
      }
    ],
    equations: [
      {
        title: 'Ampère-Maxwell law with displacement current',
        tex: String.raw`$$\nabla\times\vec H=\vec J+\frac{\partial\vec D}{\partial t}$$`,
        derivation: String.raw`<p>Taking the divergence of the original $\nabla\times\vec H=\vec J$ gives $0=\nabla\cdot\vec J$, contradicting continuity $\nabla\cdot\vec J=-\partial\rho/\partial t$. Adding $\partial\vec D/\partial t$ and using Gauss $\nabla\cdot\vec D=\rho$ gives $\nabla\cdot(\vec J+\partial\vec D/\partial t)=-\partial\rho/\partial t+\partial\rho/\partial t=0$, consistent with charge conservation.</p>`
      },
      {
        title: 'Vector wave equation',
        tex: String.raw`$$\nabla^2\vec E=\mu\varepsilon\frac{\partial^2\vec E}{\partial t^2}$$`,
        derivation: String.raw`<p>Curl Faraday: $\nabla\times(\nabla\times\vec E)=-\partial(\nabla\times\vec B)/\partial t=-\mu\,\partial(\nabla\times\vec H)/\partial t$. In source-free space $\nabla\times\vec H=\varepsilon\,\partial\vec E/\partial t$, giving $-\mu\varepsilon\,\partial^2\vec E/\partial t^2$. Using $\nabla\times(\nabla\times\vec E)=\nabla(\nabla\cdot\vec E)-\nabla^2\vec E$ with $\nabla\cdot\vec E=0$ yields the wave equation.</p>`
      },
      {
        title: 'Speed of an EM wave',
        tex: String.raw`$$c=\frac{1}{\sqrt{\mu_0\varepsilon_0}}=2.998\times10^8\ \text{m/s}$$`,
        derivation: String.raw`<p>Matching $\nabla^2\vec E=\mu\varepsilon\,\partial^2\vec E/\partial t^2$ to the canonical wave form $\nabla^2\vec E=(1/v^2)\partial^2\vec E/\partial t^2$ gives $v=1/\sqrt{\mu\varepsilon}$. In vacuum $\mu_0\varepsilon_0=(4\pi\times10^{-7})(8.854\times10^{-12})=1.1127\times10^{-17}$, so $c=1/\sqrt{1.1127\times10^{-17}}=2.998\times10^8$ m/s.</p>`
      },
      {
        title: 'Intrinsic impedance of free space',
        tex: String.raw`$$\eta_0=\sqrt{\frac{\mu_0}{\varepsilon_0}}\approx 377\ \Omega$$`,
        derivation: String.raw`<p>For a plane wave, Faraday's law relates $E$ and $H$: $kE=\omega\mu H$, so $E/H=\omega\mu/k=\mu v=\mu/\sqrt{\mu\varepsilon}=\sqrt{\mu/\varepsilon}$. In vacuum $\sqrt{(4\pi\times10^{-7})/(8.854\times10^{-12})}=376.7\ \Omega$.</p>`
      },
      {
        title: 'Poynting vector',
        tex: String.raw`$$\vec S=\vec E\times\vec H,\qquad S_{avg}=\frac{E_0^2}{2\eta}$$`,
        derivation: String.raw`<p>The instantaneous power flux per area is $\vec S=\vec E\times\vec H$. For a sinusoidal plane wave with peak field $E_0$, time-averaging over a cycle and using $H=E/\eta$ gives $S_{avg}=\tfrac12 E_0 H_0=E_0^2/(2\eta)$.</p>`
      },
      {
        title: 'Wave in a dielectric medium',
        tex: String.raw`$$v=\frac{c}{n},\quad n=\sqrt{\varepsilon_r\mu_r},\quad \lambda_m=\frac{\lambda_0}{n},\quad \eta=\frac{\eta_0}{\sqrt{\varepsilon_r}}$$`,
        derivation: String.raw`<p>Replacing $\varepsilon_0\to\varepsilon_r\varepsilon_0$ and $\mu_0\to\mu_r\mu_0$ in $v=1/\sqrt{\mu\varepsilon}$ gives $v=c/\sqrt{\varepsilon_r\mu_r}=c/n$. Frequency is fixed, so $\lambda_m=v/f=\lambda_0/n$. The impedance $\sqrt{\mu/\varepsilon}$ becomes $\eta_0\sqrt{\mu_r/\varepsilon_r}=\eta_0/\sqrt{\varepsilon_r}$ for $\mu_r=1$.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`State Gauss's law for E (differential).`, back: String.raw`$\nabla\cdot\vec D=\rho$ — electric flux diverges from charge.` },
      { front: String.raw`State Gauss's law for B.`, back: String.raw`$\nabla\cdot\vec B=0$ — no magnetic monopoles.` },
      { front: String.raw`State Faraday's law.`, back: String.raw`$\nabla\times\vec E=-\partial\vec B/\partial t$.` },
      { front: String.raw`State the Ampère-Maxwell law.`, back: String.raw`$\nabla\times\vec H=\vec J+\partial\vec D/\partial t$.` },
      { front: String.raw`What is displacement current and why needed?`, back: String.raw`$\partial\vec D/\partial t$; restores charge conservation and lets a changing $\vec E$ create $\vec H$ (enables radiation).` },
      { front: String.raw`Speed of an EM wave in vacuum?`, back: String.raw`$c=1/\sqrt{\mu_0\varepsilon_0}=2.998\times10^8$ m/s.` },
      { front: String.raw`Intrinsic impedance of free space?`, back: String.raw`$\eta_0=\sqrt{\mu_0/\varepsilon_0}\approx377\ \Omega$.` },
      { front: String.raw`Relationship of E and H in a plane wave?`, back: String.raw`Perpendicular, in phase, $E=\eta H$; both transverse to $\hat k$ (TEM).` },
      { front: String.raw`What does the Poynting vector give?`, back: String.raw`$\vec S=\vec E\times\vec H$: direction and density of power flow (W/m$^2$).` },
      { front: String.raw`Wave speed in a medium of index $n$?`, back: String.raw`$v=c/n$, with $n=\sqrt{\varepsilon_r\mu_r}$; $\lambda_m=\lambda_0/n$.` },
      { front: String.raw`Why are patch antennas smaller on high-$\varepsilon_r$ substrate?`, back: String.raw`Wavelength shrinks as $\lambda_0/\sqrt{\varepsilon_r}$, so $\lambda/2$ is physically shorter.` },
      { front: String.raw`Boundary condition at a perfect conductor?`, back: String.raw`Tangential $\vec E=0$ and normal $\vec B=0$ at the surface.` },
      { front: String.raw`How did Maxwell prove light is EM?`, back: String.raw`$1/\sqrt{\mu_0\varepsilon_0}$ equalled the measured speed of light.` },
      { front: String.raw`Average power density of a plane wave (peak $E_0$)?`, back: String.raw`$S_{avg}=E_0^2/(2\eta)$.` }
    ],
    mcqs: [
      { q: String.raw`Which equation states there are no magnetic monopoles?`, options: [String.raw`$\nabla\cdot\vec D=\rho$`, String.raw`$\nabla\cdot\vec B=0$`, String.raw`$\nabla\times\vec E=-\partial\vec B/\partial t$`, String.raw`$\nabla\times\vec H=\vec J+\partial\vec D/\partial t$`], answer: 1, explain: String.raw`$\nabla\cdot\vec B=0$: magnetic field lines have no sources or sinks.` },
      { q: String.raw`The displacement current term is:`, options: [String.raw`$\vec J$`, String.raw`$\partial\vec B/\partial t$`, String.raw`$\partial\vec D/\partial t$`, String.raw`$\nabla\cdot\vec D$`], answer: 2, explain: String.raw`$\partial\vec D/\partial t$ was Maxwell's addition to Ampère's law.` },
      { q: String.raw`The speed of light equals:`, options: [String.raw`$\sqrt{\mu_0\varepsilon_0}$`, String.raw`$1/\sqrt{\mu_0\varepsilon_0}$`, String.raw`$\mu_0\varepsilon_0$`, String.raw`$\sqrt{\mu_0/\varepsilon_0}$`], answer: 1, explain: String.raw`$c=1/\sqrt{\mu_0\varepsilon_0}$; $\sqrt{\mu_0/\varepsilon_0}$ is the impedance.` },
      { q: String.raw`The intrinsic impedance of free space is about:`, options: [String.raw`50 Ω`, String.raw`73 Ω`, String.raw`377 Ω`, String.raw`120 Ω`], answer: 2, explain: String.raw`$\eta_0=\sqrt{\mu_0/\varepsilon_0}\approx377\ \Omega$ (often written $120\pi$).` },
      { q: String.raw`In a plane wave, E and H are:`, options: [String.raw`parallel`, String.raw`perpendicular and in phase`, String.raw`perpendicular and 90° out of phase`, String.raw`randomly oriented`], answer: 1, explain: String.raw`Orthogonal, in phase (lossless), and transverse (TEM).` },
      { q: String.raw`The Poynting vector direction gives:`, options: [String.raw`E field direction`, String.raw`power flow direction`, String.raw`polarization`, String.raw`current direction`], answer: 1, explain: String.raw`$\vec S=\vec E\times\vec H$ points along propagation/power flow.` },
      { q: String.raw`In a dielectric with $\varepsilon_r=4$ ($\mu_r=1$), the wave speed is:`, options: [String.raw`$c$`, String.raw`$c/2$`, String.raw`$c/4$`, String.raw`$2c$`], answer: 1, explain: String.raw`$v=c/\sqrt{\varepsilon_r}=c/2$.` },
      { q: String.raw`Faraday's law says a changing magnetic field produces:`, options: [String.raw`charge`, String.raw`a circulating electric field`, String.raw`a static field`, String.raw`heat`], answer: 1, explain: String.raw`$\nabla\times\vec E=-\partial\vec B/\partial t$: induced EMF/circulating $\vec E$.` },
      { q: String.raw`Without the displacement current, Maxwell's equations would violate:`, options: [String.raw`energy conservation`, String.raw`charge conservation`, String.raw`momentum conservation`, String.raw`Lenz's law`], answer: 1, explain: String.raw`$\nabla\cdot\vec J\ne0$ for time-varying charge; the term restores continuity.` },
      { q: String.raw`At a perfect conductor surface, the tangential E field is:`, options: [String.raw`maximum`, String.raw`zero`, String.raw`equal to H`, String.raw`377 V/m`], answer: 1, explain: String.raw`Tangential $\vec E=0$ at a PEC; only normal E and tangential H (surface current) survive.` },
      { q: String.raw`The wavelength in a medium of index $n$ is:`, options: [String.raw`$n\lambda_0$`, String.raw`$\lambda_0/n$`, String.raw`$\lambda_0$`, String.raw`$\lambda_0/n^2$`], answer: 1, explain: String.raw`$\lambda_m=\lambda_0/n$ since $f$ is fixed and $v=c/n$.` },
      { q: String.raw`Which pair of laws directly enables wave propagation?`, options: [String.raw`the two Gauss laws`, String.raw`Faraday and Ampère-Maxwell`, String.raw`Gauss(E) and Faraday`, String.raw`Gauss(B) and Ampère`], answer: 1, explain: String.raw`Their mutual time-derivative coupling regenerates the fields as a wave.` }
    ],
    numericals: [
      { q: String.raw`Verify $c$ from $\mu_0=4\pi\times10^{-7}$ H/m and $\varepsilon_0=8.854\times10^{-12}$ F/m.`, solution: String.raw`<p><b>Formula.</b> $$c=\frac{1}{\sqrt{\mu_0\varepsilon_0}}$$ where $c$ = speed of light (m/s), $\mu_0$ = permeability of free space (H/m), $\varepsilon_0$ = permittivity of free space (F/m).</p>
      <p><b>Substitute.</b> $$\mu_0\varepsilon_0=(1.2566\times10^{-6})(8.854\times10^{-12}),\qquad c=\frac{1}{\sqrt{\mu_0\varepsilon_0}}$$</p>
      <p><b>Compute.</b> $\mu_0\varepsilon_0=1.1127\times10^{-17}$; $\sqrt{\mu_0\varepsilon_0}=3.336\times10^{-9}$; $c=\dfrac{1}{3.336\times10^{-9}}=2.998\times10^8$ m/s.</p>
      <p><b>Explanation.</b> The result matches the measured speed of light — Maxwell's proof that light is an electromagnetic wave, built purely from two electrostatic/magnetostatic constants.</p>` },
      { q: String.raw`Compute the intrinsic impedance of free space.`, solution: String.raw`<p><b>Formula.</b> $$\eta_0=\sqrt{\frac{\mu_0}{\varepsilon_0}}$$ where $\eta_0$ = intrinsic (wave) impedance of vacuum ($\Omega$), equal to the $E/H$ ratio in a plane wave.</p>
      <p><b>Substitute.</b> $$\eta_0=\sqrt{\frac{1.2566\times10^{-6}}{8.854\times10^{-12}}}$$</p>
      <p><b>Compute.</b> The ratio is $1.4194\times10^{5}$; $\eta_0=\sqrt{1.4194\times10^{5}}=376.7\ \Omega\approx377\ \Omega$ (exactly $120\pi\ \Omega$).</p>
      <p><b>Explanation.</b> This $377\ \Omega$ sets how strongly $E$ and $H$ couple in a wave and underlies radiation resistance, power-density formulas, and absorber/anechoic design.</p>` },
      { q: String.raw`A plane wave has peak E-field $E_0=10$ V/m in free space. Find peak H and average power density.`, solution: String.raw`<p><b>Formula.</b> $$H_0=\frac{E_0}{\eta_0},\qquad S_{avg}=\frac{E_0^2}{2\eta_0}$$ where $E_0,H_0$ = peak field amplitudes, $S_{avg}$ = time-averaged Poynting power density (W/m$^2$).</p>
      <p><b>Substitute.</b> $$H_0=\frac{10}{377},\qquad S_{avg}=\frac{(10)^2}{2\times377}$$</p>
      <p><b>Compute.</b> $H_0=0.0265$ A/m; $S_{avg}=\dfrac{100}{754}=0.1326$ W/m$^2$.</p>
      <p><b>Explanation.</b> $E$ and $H$ are locked by $\eta_0$, and the factor of 2 comes from time-averaging a sinusoid — this is the everyday link between measured field strength and power flux.</p>` },
      { q: String.raw`A signal at 2.4 GHz enters a dielectric with $\varepsilon_r=4$. Find the wavelength inside.`, solution: String.raw`<p><b>Formula.</b> $$\lambda_m=\frac{\lambda_0}{n},\qquad n=\sqrt{\varepsilon_r\mu_r},\qquad \lambda_0=\frac{c}{f}$$ where $\lambda_m$ = wavelength in the medium, $\lambda_0$ = free-space wavelength, $n$ = refractive index ($\mu_r=1$).</p>
      <p><b>Substitute.</b> $$\lambda_0=\frac{3\times10^8}{2.4\times10^9},\qquad n=\sqrt{4}=2,\qquad \lambda_m=\frac{\lambda_0}{2}$$</p>
      <p><b>Compute.</b> $\lambda_0=0.125$ m; $\lambda_m=\dfrac{0.125}{2}=0.0625$ m $=6.25$ cm.</p>
      <p><b>Explanation.</b> Frequency is unchanged but the wave slows and shortens by $n$ inside the dielectric — exactly why patch antennas printed on high-$\varepsilon_r$ substrate are physically smaller.</p>` },
      { q: String.raw`Find the intrinsic impedance of a medium with $\varepsilon_r=2.2$, $\mu_r=1$.`, solution: String.raw`<p><b>Formula.</b> $$\eta=\frac{\eta_0}{\sqrt{\varepsilon_r}}\quad(\mu_r=1)$$ where $\eta$ = intrinsic impedance of the medium, $\eta_0=377\ \Omega$, $\varepsilon_r$ = relative permittivity.</p>
      <p><b>Substitute.</b> $$\eta=\frac{377}{\sqrt{2.2}}$$</p>
      <p><b>Compute.</b> $\sqrt{2.2}=1.483$; $\eta=\dfrac{377}{1.483}=254.2\ \Omega$.</p>
      <p><b>Explanation.</b> A denser dielectric lowers the wave impedance below the free-space $377\ \Omega$; PTFE-like substrates ($\varepsilon_r\approx2.2$) are common in microwave PCBs, and this impedance governs reflections at their surfaces.</p>` },
      { q: String.raw`A wave carries $S=1$ W/m$^2$ in vacuum. Find the peak E-field.`, solution: String.raw`<p><b>Formula.</b> $$S_{avg}=\frac{E_0^2}{2\eta_0}\;\Rightarrow\;E_0=\sqrt{2\eta_0 S_{avg}}$$ where $E_0$ = peak E-field (V/m), $S_{avg}$ = power density (W/m$^2$), $\eta_0=377\ \Omega$.</p>
      <p><b>Substitute.</b> $$E_0=\sqrt{2\times377\times1}$$</p>
      <p><b>Compute.</b> $E_0=\sqrt{754}=27.5$ V/m.</p>
      <p><b>Explanation.</b> Inverting the Poynting relation converts an incident power density into a field strength — the routine step for EMC/exposure limits and for sizing detector sensitivity.</p>` }
    ],
    realWorld: String.raw`<p>Maxwell's equations are not abstract — they are the design equations for the entire radio world. Every antenna's radiation, every transmission line's impedance, and every wave's propagation is a boundary-value problem in these four laws; full-wave solvers (HFSS, CST, FEKO) simply solve them numerically. The $377\ \Omega$ free-space impedance sets how efficiently an aperture couples to space and underlies absorber/anechoic-chamber design. The $v=c/n$ relation is why fiber optics, GPS ionospheric delay, and PCB microstrip all differ from free space, and why high-$\varepsilon_r$ substrates miniaturise antennas. Displacement current is literally what lets a capacitor-fed antenna radiate. Understanding these laws is the difference between memorising formulas and knowing why they are true.</p>`,
    related: ['antenna', 'antenna-gain', 'antenna-types', 'comm-basics', 'path-loss']
  }
);
