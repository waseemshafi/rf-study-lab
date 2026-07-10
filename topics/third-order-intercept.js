// Third-Order Intercept (IP3 / TOI): two-tone intermodulation, IIP3/OIP3,
// P1dB relation, cascade IP3, SFDR. Deep exam-mastery study content.
// CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'third-order-intercept',
    title: 'Third-Order Intercept (IP3 / TOI)',
    category: 'RF Front-End & Receivers',
    tags: ['IP3', 'IIP3', 'OIP3', 'intermodulation', 'IM3', 'linearity', 'SFDR', 'two-tone'],
    summary: String.raw`The third-order intercept point is a fictitious extrapolated power level where a nonlinear device's third-order intermodulation products would equal its fundamental output; it is the single figure of merit for large-signal linearity, because IM3 products from two in-band tones fall in-band and cannot be filtered away.`,
    diagram: [
      {
        title: String.raw`Two-tone test: IM3 products land in-band`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr-third-order-intercept" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Two closely-spaced tones through a nonlinearity</text>
          <line x1="40" y1="170" x2="510" y2="170" stroke="#9aa7b5" marker-end="url(#arr-third-order-intercept)"/>
          <line x1="40" y1="170" x2="40" y2="40" stroke="#9aa7b5" marker-end="url(#arr-third-order-intercept)"/>
          <text x="500" y="188" fill="#9aa7b5">freq</text>
          <text x="20" y="46" fill="#9aa7b5">P</text>
          <line x1="200" y1="60" x2="200" y2="170" stroke="#4dabf7" stroke-width="2"/>
          <line x1="270" y1="60" x2="270" y2="170" stroke="#4dabf7" stroke-width="2"/>
          <text x="200" y="52" fill="#4dabf7" text-anchor="middle">f1</text>
          <text x="270" y="52" fill="#4dabf7" text-anchor="middle">f2</text>
          <line x1="130" y1="132" x2="130" y2="170" stroke="#ffa94d" stroke-width="2"/>
          <line x1="340" y1="132" x2="340" y2="170" stroke="#ffa94d" stroke-width="2"/>
          <text x="130" y="124" fill="#ffa94d" text-anchor="middle" font-size="10">2f1-f2</text>
          <text x="340" y="124" fill="#ffa94d" text-anchor="middle" font-size="10">2f2-f1</text>
          <rect x="115" y="60" width="240" height="110" rx="6" fill="none" stroke="#63e6be" stroke-dasharray="4 3"/>
          <text x="235" y="200" fill="#63e6be" text-anchor="middle" font-size="10">in-band: IM3 unfilterable, same spacing as tones</text>
        </svg>`,
        caption: String.raw`Two equal tones f1,f2 through a nonlinearity generate third-order intermodulation products at 2f1-f2 and 2f2-f1. These sit just outside the tone pair but still inside the channel passband — a filter cannot remove them, which is why IM3 (not harmonics at 2f, 3f) sets in-band linearity.`
      },
      {
        title: String.raw`The IP3 plot: 1:1 fundamental and 3:1 IM3 extrapolated`,
        svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr2-third-order-intercept" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Output power vs input power (log-log)</text>
          <line x1="55" y1="205" x2="510" y2="205" stroke="#9aa7b5" marker-end="url(#arr2-third-order-intercept)"/>
          <line x1="55" y1="205" x2="55" y2="35" stroke="#9aa7b5" marker-end="url(#arr2-third-order-intercept)"/>
          <text x="500" y="223" fill="#9aa7b5">Pin (dBm)</text>
          <text x="30" y="42" fill="#9aa7b5">Pout</text>
          <line x1="70" y1="195" x2="330" y2="70" stroke="#4dabf7" stroke-width="2"/>
          <line x1="330" y1="70" x2="410" y2="55" stroke="#4dabf7" stroke-width="1" stroke-dasharray="4 3"/>
          <text x="150" y="150" fill="#4dabf7" font-size="10">fundamental 1:1</text>
          <line x1="120" y1="200" x2="330" y2="70" stroke="#ffa94d" stroke-width="2"/>
          <line x1="330" y1="70" x2="410" y2="22" stroke="#ffa94d" stroke-width="1" stroke-dasharray="4 3"/>
          <text x="250" y="180" fill="#ffa94d" font-size="10">IM3 slope 3:1</text>
          <circle cx="330" cy="70" r="5" fill="#b197fc"/>
          <text x="360" y="70" fill="#b197fc" font-size="11">IP3 (intercept)</text>
          <line x1="330" y1="70" x2="330" y2="205" stroke="#9aa7b5" stroke-dasharray="2 2"/>
          <line x1="55" y1="70" x2="330" y2="70" stroke="#9aa7b5" stroke-dasharray="2 2"/>
          <text x="330" y="222" fill="#b197fc" text-anchor="middle" font-size="10">IIP3</text>
          <text x="52" y="66" fill="#b197fc" text-anchor="end" font-size="10">OIP3</text>
        </svg>`,
        caption: String.raw`The classic IP3 chart. Each fundamental tone rises 1 dB per 1 dB of input (slope 1); each IM3 product rises 3 dB per 1 dB of input (slope 3). Extended past compression (dashed), the two lines meet at the fictitious Third-Order Intercept Point. Its input coordinate is IIP3, its output coordinate is OIP3 = IIP3 + gain.`
      },
      {
        title: String.raw`Cascade IP3 and spurious-free dynamic range`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr3-third-order-intercept" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Cascade linearity and SFDR window</text>
          <rect x="40" y="40" width="90" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="85" y="58" fill="#e6edf3" text-anchor="middle">Stage 1</text><text x="85" y="73" fill="#9aa7b5" font-size="9" text-anchor="middle">G1, IIP3_1</text>
          <rect x="180" y="40" width="90" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="225" y="58" fill="#e6edf3" text-anchor="middle">Stage 2</text><text x="225" y="73" fill="#9aa7b5" font-size="9" text-anchor="middle">G2, IIP3_2</text>
          <line x1="130" y1="60" x2="180" y2="60" stroke="#9aa7b5" marker-end="url(#arr3-third-order-intercept)"/>
          <line x1="270" y1="60" x2="320" y2="60" stroke="#9aa7b5" marker-end="url(#arr3-third-order-intercept)"/>
          <text x="405" y="64" fill="#ffa94d" font-size="10">1/IIP3 = 1/IIP3_1 + G1/IIP3_2</text>
          <line x1="55" y1="180" x2="510" y2="180" stroke="#9aa7b5"/>
          <line x1="90" y1="180" x2="90" y2="120" stroke="#9aa7b5"/>
          <text x="90" y="112" fill="#9aa7b5" font-size="9" text-anchor="middle">noise floor N</text>
          <line x1="420" y1="180" x2="420" y2="110" stroke="#b197fc"/>
          <text x="420" y="102" fill="#b197fc" font-size="9" text-anchor="middle">IIP3</text>
          <line x1="90" y1="150" x2="300" y2="150" stroke="#63e6be" stroke-width="2"/>
          <text x="195" y="143" fill="#63e6be" font-size="10" text-anchor="middle">SFDR = 2/3 (IIP3 - N)</text>
        </svg>`,
        caption: String.raw`Referring each later stage's IIP3 back to the input (dividing by preceding gain) shows the last high-gain stage usually dominates cascade nonlinearity: 1/IIP3_tot = 1/IIP3_1 + G1/IIP3_2 + ... . The spurious-free dynamic range is the input window between the noise floor and the point where IM3 rises to that floor, SFDR = (2/3)(IIP3 - N).`
      }
    ],
    prerequisites: ['harmonics', 'sensitivity'],
    intro: String.raw`<p><b>Why does IP3 matter?</b> A receiver never sees just its wanted signal. Two strong out-of-channel or in-band interferers, beating through the unavoidable nonlinearity of every amplifier and mixer, create <i>new</i> tones that a filter cannot remove — because the worst of them, the third-order intermodulation products, land right on top of or immediately beside the wanted channel. Gain compression (P1dB) tells you when a device saturates on a single big signal, but it says nothing about these in-band spurs. The third-order intercept point is the one number that predicts, for any input level, how large those spurs will be. It sets the top of the dynamic range just as the noise floor sets the bottom, and it is the reason a "hot" front-end with too much gain can be <i>worse</i> than a modest one.</p>
<p>The <b>third-order intercept point (IP3 or TOI)</b> is a fictitious, extrapolated power level at which a device's third-order IM products would, if the lines held, equal its fundamental output. It is fictitious because the device compresses long before reaching it — but because the fundamental rises with slope 1 and IM3 with slope 3 on a log-log plot, two straight lines are enough to define an intercept, and that intercept is a clean, level-independent linearity metric. We refer it either to the input (<b>IIP3</b>) or the output (<b>OIP3 = IIP3 + gain</b>), and the workhorse relation $\text{IIP3}=P_{in}+\tfrac12\Delta_{IM3}$ lets you read it off a single two-tone spectrum.</p>`,
    sections: [
      {
        h: 'The two-tone test and where IM3 lands',
        html: String.raw`<p>Linearity is characterised with a <b>two-tone test</b>: two equal-amplitude, closely spaced sinusoids at $f_1$ and $f_2$ (say a few kHz to a few MHz apart) are applied to the device. A memoryless nonlinearity can be written as a power series</p>
        <p>$$y = a_1 x + a_2 x^2 + a_3 x^3 + \cdots$$</p>
        <p>With $x=A\cos\omega_1 t + A\cos\omega_2 t$, the <b>cubic term</b> $a_3 x^3$ generates, among many products, tones at $2f_1-f_2$ and $2f_2-f_1$. These are the <b>third-order intermodulation (IM3)</b> products. Crucially, if $f_1$ and $f_2$ are close, then $2f_1-f_2$ and $2f_2-f_1$ are <i>also</i> close to the original pair — they fall <b>in-band</b>.</p>
        <p>Contrast this with harmonics ($2f_1$, $3f_1$, ...) and the second-order products ($f_1\pm f_2$): those are far from the carrier and a bandpass filter removes them. The IM3 tones cannot be filtered because they sit inside the very channel you are trying to receive. That is why third-order behaviour, not second-order or harmonic distortion, dominates the linearity budget of a narrowband receiver.</p>
        <div class="callout tip"><b>Key intuition:</b> harmonics tell you a device is nonlinear; IM3 tells you it <i>matters</i>, because IM3 is the distortion that lands where you cannot filter it. IP3 is simply the compact way to quote how bad that IM3 will be at any drive level.</div>`
      },
      {
        h: 'Why IM3 rises 3:1 and the intercept is well-defined',
        html: String.raw`<p>The amplitude of the fundamental output tone is proportional to the input amplitude $A$ (from the $a_1 x$ term), so its <b>power</b> rises 1 dB for every 1 dB of input — <b>slope 1</b> on a log-log (dB-dB) plot. The IM3 amplitude comes from the cubic term and is proportional to $A^3$; its power therefore rises 3 dB for every 1 dB of input — <b>slope 3</b>.</p>
        <p>Two straight lines of different slope must cross. Extended (extrapolated) beyond the region where the device actually compresses, the slope-1 fundamental line and the slope-3 IM3 line meet at a single point: the <b>third-order intercept point</b>. Because the point is defined by extrapolation of two clean straight-line regions, it is <i>independent of the exact drive level</i> — that is what makes IP3 a device constant rather than a measurement that changes every time you turn the knob.</p>
        <p>The intercept is <b>fictitious</b>: real devices saturate 10-15 dB below it, so you never actually observe the fundamental and IM3 being equal. It is a bookkeeping construct — but a powerful one, because from that single number you can predict the IM3 level at any (backed-off) input.</p>
        <div class="callout tip"><b>Watch the slopes:</b> a common lab mistake is to read IM3 at a level where the device is already compressing — then the IM3 line is no longer slope 3 and the extrapolated intercept is wrong. Always measure IP3 well below P1dB, in the true small-signal region.</div>`
      },
      {
        h: 'IIP3, OIP3, and the workhorse formula',
        html: String.raw`<p>The intercept has two coordinates. Its <b>input</b>-referred value is <b>IIP3</b>; its <b>output</b>-referred value is <b>OIP3</b>. Since both the fundamental and IM3 lines pass through the intercept and the fundamental has gain $G$,</p>
        <p>$$\boxed{\text{OIP3} = \text{IIP3} + G}$$</p>
        <p>(all in dB / dBm). To measure it you do not need to reach the intercept. At a backed-off input $P_{in}$ (per tone, in dBm) you read the fundamental output $P_{fund}$ and the IM3 output $P_{IM3}$, and define the <b>IM3 ratio</b> (in dBc, decibels below the carrier)</p>
        <p>$$\Delta_{IM3} = P_{fund} - P_{IM3}.$$</p>
        <p>Because the gap between the slope-1 and slope-3 lines closes at 2 dB per dB of input, the input distance to the intercept is $\Delta_{IM3}/2$. Hence the <b>workhorse relations</b></p>
        <p>$$\text{IIP3} = P_{in} + \tfrac12\,\Delta_{IM3}, \qquad \text{OIP3} = P_{out} + \tfrac12\,\Delta_{IM3}.$$</p>
        <p>where $P_{in}$ and $P_{out}=P_{fund}$ are the per-tone input and output powers at which you took the measurement.</p>
        <div class="callout tip"><b>Practical tip:</b> always quote whether an IP3 number is input- or output-referred and per-tone. Mixing IIP3 with OIP3, or per-tone with total two-tone power, is the most common source of 3-6 dB errors in linearity budgets.</div>`
      },
      {
        h: 'Relation to the 1 dB compression point',
        html: String.raw`<p>P1dB and IP3 both measure large-signal behaviour, so they are correlated. For an ideal third-order-limited nonlinearity, theory gives</p>
        <p>$$\text{IIP3} \approx P_{1dB,in} + 9.6\ \text{dB}.$$</p>
        <p>In practice, real devices show a spread and the commonly quoted rule of thumb is</p>
        <p>$$\text{IP3} \approx \text{P1dB} + (10\ \text{to}\ 15)\ \text{dB}.$$</p>
        <p>The value of this relation is that P1dB is trivial to measure (sweep one tone until the gain drops 1 dB) while IP3 needs a two-tone setup; the rule lets you estimate one from the other for a sanity check. Do not treat the 9.6 dB as exact for a real device — it assumes a pure cubic and ignores fifth- and higher-order terms and AM-PM effects, which is why the practical spread is 10-15 dB.</p>
        <div class="callout tip"><b>Sanity check:</b> if a datasheet's OIP3 is only a few dB above its P1dB, be suspicious — the numbers are inconsistent with cubic theory and one may be mis-referenced (input vs output) or measured too close to compression.</div>`
      },
      {
        h: 'Cascade IP3: why the last stage usually wins',
        html: String.raw`<p>In a receive chain, each stage's nonlinearity must be referred to a common point — the input. A later stage sees signals already amplified by the gain ahead of it, so a given stage-2 IIP3 is <i>effectively worse</i> when referred to the input, by the preceding gain. Adding IM3 contributions in power (linear, not dB) gives the standard cascade formula</p>
        <p>$$\frac{1}{\text{IIP3}_{tot}} = \frac{1}{\text{IIP3}_1} + \frac{G_1}{\text{IIP3}_2} + \frac{G_1 G_2}{\text{IIP3}_3} + \cdots$$</p>
        <p>where all IIP3 values and gains $G_i$ are <b>linear</b> ratios (convert from dBm/dB first). Because the later terms are multiplied by the accumulated gain in front of them, a high-gain front-end pushes strong signals into the back-end and the <b>last high-gain stage frequently dominates</b> the total nonlinearity — the mirror image of the noise-figure cascade, where the <i>first</i> stage dominates. This is the fundamental gain-vs-linearity tension: adding front-end gain helps noise figure but hurts cascade IIP3.</p>
        <div class="callout tip"><b>Design consequence:</b> you cannot simultaneously maximise sensitivity (wants high early gain) and maximise linearity (wants low early gain). Real receivers place the gain carefully, often with a switchable-gain LNA and attenuators, to balance the noise floor against IIP3.</div>`
      },
      {
        h: 'Spurious-free dynamic range (SFDR)',
        html: String.raw`<p>IP3 sets the <i>top</i> of the usable range; the <b>noise floor</b> $N$ (in dBm, = $-174 + 10\log_{10}B + NF$) sets the bottom. The <b>spurious-free dynamic range</b> is the input window over which the signal is above the noise floor <i>and</i> the IM3 products are still below it:</p>
        <p>$$\boxed{\text{SFDR} = \tfrac{2}{3}\big(\text{IIP3} - N\big)}$$</p>
        <p>with all quantities in dB / dBm, and $N$ the input-referred noise floor. The factor $2/3$ is the direct consequence of the slope-3 IM3 line: as input rises, IM3 climbs three times faster than the noise-limited headroom, so only two-thirds of the raw $(\text{IIP3}-N)$ gap is usable. SFDR is the honest, single-number measure of a receiver's ability to detect a weak signal in the presence of strong interferers.</p>
        <div class="callout tip"><b>The whole picture:</b> lower the noise floor (better NF, narrower B) or raise IIP3 and SFDR improves — but the $2/3$ factor means a 3 dB IIP3 gain buys only 2 dB of SFDR. Dynamic range is expensive, which is why front-end linearity is a first-class design constraint.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Why IM3 matters:</b> two close tones through a cubic nonlinearity make products at $2f_1-f_2$ and $2f_2-f_1$ that fall <i>in-band</i> and cannot be filtered, unlike harmonics or second-order products.</li>
<li><b>The intercept construction:</b> the fundamental rises 1:1 and IM3 rises 3:1, so their extrapolated lines cross at the fictitious IP3 — a level-independent linearity constant, with $\text{OIP3}=\text{IIP3}+G$.</li>
<li><b>The workhorse formula:</b> $\text{IIP3}=P_{in}+\tfrac12\Delta_{IM3}$ with $\Delta_{IM3}=P_{fund}-P_{IM3}$ in dBc, lets you read IP3 from one backed-off two-tone measurement.</li>
<li><b>P1dB link and cascade:</b> $\text{IIP3}\approx\text{P1dB}+9.6$ dB (rule 10-15 dB); and $1/\text{IIP3}_{tot}=1/\text{IIP3}_1+G_1/\text{IIP3}_2+\cdots$ (linear), so the last high-gain stage often dominates.</li>
<li><b>Dynamic range:</b> $\text{SFDR}=\tfrac23(\text{IIP3}-N)$ ties the linearity top to the noise floor bottom, and the $2/3$ factor is exactly the slope-3 IM3 penalty.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Third-order_intercept_point" target="_blank" rel="noopener">Wikipedia — Third-order intercept point</a> — the canonical reference, with the power-series derivation, the slope-1/slope-3 construction, and the IIP3/OIP3 definitions.</li>
<li><a href="https://pages.hmc.edu/mspencer/e157/fa24/slides/20.pdf" target="_blank" rel="noopener">Harvey Mudd E157 — Lecture 20: Linearity and Distortion</a> — university course slides deriving IM3, the two-tone test and intercept extrapolation from a cubic nonlinearity.</li>
<li><a href="https://coppermountaintech.com/wp-content/uploads/2022/04/Third-Order-Intercept.pdf" target="_blank" rel="noopener">Copper Mountain Technologies — Third Order Intercept</a> — a practical application note on measuring TOI with a two-tone setup and reading IIP3/OIP3 off the spectrum.</li>
<li><a href="https://www.qorvo.com/design-hub/blog/the-importance-of-input-linearity-for-optimizing-rf-receiver-designs" target="_blank" rel="noopener">Qorvo — The Importance of Input Linearity for RF Receiver Designs</a> — connects IIP3 to cascade linearity, the gain-vs-linearity trade, and $\text{SFDR}=\tfrac23(\text{IIP3}-N)$ at the system level.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Two equal tones $f_1,f_2$ through a nonlinearity create third-order IM products at $2f_1-f_2$ and $2f_2-f_1$ that fall in-band and cannot be filtered.`,
      String.raw`The fundamental output rises 1 dB/dB (slope 1); IM3 rises 3 dB/dB (slope 3). Extrapolated, the two lines meet at the fictitious third-order intercept point.`,
      String.raw`IIP3 is the input-referred intercept, OIP3 the output-referred; $\text{OIP3}=\text{IIP3}+G$ (dB).`,
      String.raw`Workhorse relation: $\text{IIP3}=P_{in}+\tfrac12\Delta_{IM3}$, where $\Delta_{IM3}=P_{fund}-P_{IM3}$ in dBc — read from one two-tone spectrum.`,
      String.raw`Measure IP3 well below P1dB; if the device is compressing, the IM3 line is no longer slope 3 and the extrapolation is wrong.`,
      String.raw`Rule of thumb: $\text{IIP3}\approx\text{P1dB}+9.6$ dB (practical spread $\text{P1dB}+10$ to $15$ dB).`,
      String.raw`Cascade: $1/\text{IIP3}_{tot}=1/\text{IIP3}_1+G_1/\text{IIP3}_2+\cdots$ in linear units — the last high-gain stage usually dominates nonlinearity.`,
      String.raw`Noise figure cascade favours the first stage; IP3 cascade is penalised by preceding gain — the fundamental gain-vs-linearity tension.`,
      String.raw`Spurious-free dynamic range: $\text{SFDR}=\tfrac23(\text{IIP3}-N)$, with $N$ the input-referred noise floor.`,
      String.raw`The $2/3$ factor means a 3 dB improvement in IIP3 yields only 2 dB of SFDR — dynamic range is bought slowly.`
    ],
    equations: [
      {
        title: 'IIP3 from a two-tone measurement',
        tex: String.raw`$$\text{IIP3}=P_{in}+\tfrac12\,\Delta_{IM3},\qquad \Delta_{IM3}=P_{fund}-P_{IM3}$$`,
        derivation: String.raw`<p><b>Where we start.</b> On the IP3 plot both the fundamental and IM3 output powers are straight lines versus input power. We only need their slopes and one measured point to locate where they cross.</p>
        <p><b>Step 1 — write the two lines.</b> Let $p$ be the per-tone input power in dBm. The fundamental output has unit slope, $P_{fund}(p)=p+G$, where $G$ is the small-signal gain in dB. The IM3 output has slope 3 (its amplitude $\propto A^3$, so its power grows three times as fast in dB), $P_{IM3}(p)=3p+c$ for some constant intercept $c$ set by the cubic coefficient. These are the two extrapolated straight lines of the plot.</p>
        <p><b>Step 2 — impose the intercept.</b> By definition the third-order intercept is the input power $\text{IIP3}$ at which the two lines meet: $P_{fund}(\text{IIP3})=P_{IM3}(\text{IIP3})$, i.e. $\text{IIP3}+G = 3\,\text{IIP3}+c$.</p>
        <p><b>Step 3 — measure at a backed-off point.</b> At an actual input $p=P_{in}$ (below compression) the gap between the lines is $\Delta_{IM3}=P_{fund}(P_{in})-P_{IM3}(P_{in})=(P_{in}+G)-(3P_{in}+c)= -2P_{in}+G-c$.</p>
        <p><b>Step 4 — solve for the intercept.</b> From Step 2, $G-c = 2\,\text{IIP3}$. Substitute into Step 3: $\Delta_{IM3}=-2P_{in}+2\,\text{IIP3}$, hence $\text{IIP3}=P_{in}+\tfrac12\Delta_{IM3}$.</p>
        <p><b>Result.</b> $$\text{IIP3}=P_{in}+\tfrac12\Delta_{IM3}.$$ Sanity check: the gap closes at 2 dB per dB of input (slope 3 minus slope 1), so the input distance to closure is $\Delta_{IM3}/2$ — exactly the half-factor. Referring to the output ($+G$ on both sides) gives $\text{OIP3}=P_{out}+\tfrac12\Delta_{IM3}$.</p>`
      },
      {
        title: 'OIP3 to IIP3 and the P1dB relation',
        tex: String.raw`$$\text{OIP3}=\text{IIP3}+G,\qquad \text{IIP3}\approx P_{1dB,in}+9.6\ \text{dB}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want to relate the input- and output-referred intercepts, and then connect IP3 to the far-easier-to-measure 1 dB compression point, both from the same cubic model $y=a_1 x+a_3 x^3$.</p>
        <p><b>Step 1 — OIP3 = IIP3 + G.</b> The fundamental line passes through the intercept with gain $G$: an input of $\text{IIP3}$ produces an output of $\text{IIP3}+G$ by the slope-1 law $P_{fund}=p+G$. That output <i>is</i> the output-referred intercept, so $\text{OIP3}=\text{IIP3}+G$.</p>
        <p><b>Step 2 — fundamental gain compression.</b> For a single tone $x=A\cos\omega t$, the cubic term feeds the fundamental: the effective fundamental amplitude is $a_1 A+\tfrac34 a_3 A^3$. Compression needs $a_3$ opposite in sign to $a_1$; the gain drops by 1 dB when $\big|1+\tfrac34\frac{a_3}{a_1}A^2\big|=10^{-1/20}=0.891$, i.e. $\tfrac34\frac{|a_3|}{a_1}A_{1dB}^2=0.109$.</p>
        <p><b>Step 3 — IM3 growth.</b> In the two-tone case the IM3 amplitude at $2f_1-f_2$ is $\tfrac34 a_3 A^3$. The intercept is where fundamental $a_1 A_{IP3}$ equals IM3 $\tfrac34|a_3|A_{IP3}^3$, giving $A_{IP3}^2=\tfrac{4a_1}{3|a_3|}$.</p>
        <p><b>Step 4 — take the ratio.</b> Dividing the two amplitude-squared results, $\dfrac{A_{IP3}^2}{A_{1dB}^2}=\dfrac{4a_1/(3|a_3|)}{0.109\cdot 4a_1/(3|a_3|)}=\dfrac{1}{0.109}=9.17$ in power, i.e. $10\log_{10}(9.17)=9.6$ dB.</p>
        <p><b>Result.</b> $$\text{IIP3}\approx P_{1dB,in}+9.6\ \text{dB}.$$ Sanity check: the 9.6 dB assumes a pure cubic; real fifth-order terms and AM-PM widen this to the practical 10-15 dB rule of thumb.</p>`
      },
      {
        title: 'Cascade IIP3',
        tex: String.raw`$$\frac{1}{\text{IIP3}_{tot}}=\frac{1}{\text{IIP3}_1}+\frac{G_1}{\text{IIP3}_2}+\frac{G_1 G_2}{\text{IIP3}_3}+\cdots$$`,
        derivation: String.raw`<p><b>Where we start.</b> Each stage produces IM3 that, referred to the system input, adds. We assume the IM3 voltages combine in worst-case (coherent) fashion so their equivalent input-referred distortion powers add, then refer everything to the input.</p>
        <p><b>Step 1 — single-stage IM3 vs input.</b> For one stage the input-referred third-order distortion, expressed as an effective input intercept, obeys IM3 power $\propto P_{in}^3/\text{IIP3}^2$ (linear units). A convenient bookkeeping quantity is $1/\text{IIP3}$, proportional to that stage's distortion generation per unit input.</p>
        <p><b>Step 2 — refer stage 2 to the input.</b> Stage 2 sees an input already amplified by $G_1$ (linear power gain). A distortion it would generate for a unit <i>system</i> input is worse by the gain in front of it: its contribution referred to the system input scales as $G_1/\text{IIP3}_2$. Likewise stage 3 sees gain $G_1 G_2$ ahead of it, contributing $G_1 G_2/\text{IIP3}_3$.</p>
        <p><b>Step 3 — add the contributions.</b> Treating the input-referred third-order distortion terms as additive, the total distortion metric is the sum: $\dfrac{1}{\text{IIP3}_{tot}}=\dfrac{1}{\text{IIP3}_1}+\dfrac{G_1}{\text{IIP3}_2}+\dfrac{G_1 G_2}{\text{IIP3}_3}+\cdots$, with all IIP3 and $G_i$ as linear ratios.</p>
        <p><b>Step 4 — read the physics.</b> The accumulated gain multiplies every later term, so if the front-end gain $G_1$ is large the second term dominates and the back-end sets the linearity — the reverse of the Friis noise cascade, where the first stage dominates.</p>
        <p><b>Result.</b> $$\frac{1}{\text{IIP3}_{tot}}=\frac{1}{\text{IIP3}_1}+\frac{G_1}{\text{IIP3}_2}+\cdots$$ Sanity check: if stage 2 were infinitely linear ($\text{IIP3}_2\to\infty$) its term vanishes and $\text{IIP3}_{tot}=\text{IIP3}_1$, as expected.</p>`
      },
      {
        title: 'Spurious-free dynamic range (SFDR)',
        tex: String.raw`$$\text{SFDR}=\tfrac{2}{3}\big(\text{IIP3}-N\big)$$`,
        derivation: String.raw`<p><b>Where we start.</b> The usable range runs from where the signal clears the noise floor to where its IM3 products rise to that same floor. We express both edges on the input-power axis and subtract.</p>
        <p><b>Step 1 — output IM3 vs input.</b> Reference all powers to the output. The fundamental output is $P_{o}=P_{in}+G$ (slope 1). The IM3 output, from the two-line construction, is $P_{IM3,o}=3P_{in}+(G-2\,\text{IIP3}) = 3(P_{in}-\text{IIP3})+ (\text{IIP3}+G)$; equivalently the IM3-to-carrier gap is $\Delta_{IM3}=2(\text{IIP3}-P_{in})$ from the previous equation.</p>
        <p><b>Step 2 — SFDR condition.</b> SFDR is the fundamental-to-noise ratio at the special input where the IM3 products just reach the noise floor, i.e. where $P_{IM3,o}=N_o$ (output noise floor). At that input the IM3-to-carrier gap equals the carrier-to-noise ratio: $\text{SFDR}=\Delta_{IM3}$ at the crossover.</p>
        <p><b>Step 3 — set IM3 equal to the noise floor.</b> Referring to the input, the carrier is $P_{in}$ above nothing and the noise floor is $N$. The IM3 reaches $N$ when the gap $\Delta_{IM3}=2(\text{IIP3}-P_{in})$ has grown so that $P_{in}-\tfrac32(P_{in}-\ldots)$... more directly: at crossover the signal is $\text{SFDR}$ above $N$ and $\Delta_{IM3}=\text{SFDR}$, while $\Delta_{IM3}=2(\text{IIP3}-P_{in})$ and $P_{in}=N+\text{SFDR}$.</p>
        <p><b>Step 4 — solve.</b> Substitute $P_{in}=N+\text{SFDR}$ into $\text{SFDR}=2(\text{IIP3}-P_{in})=2(\text{IIP3}-N-\text{SFDR})$. Then $\text{SFDR}+2\,\text{SFDR}=2(\text{IIP3}-N)$, so $3\,\text{SFDR}=2(\text{IIP3}-N)$.</p>
        <p><b>Result.</b> $$\text{SFDR}=\tfrac{2}{3}(\text{IIP3}-N).$$ Sanity check: the $2/3$ is the slope penalty — because IM3 climbs three times faster than the carrier, only two-thirds of the raw $(\text{IIP3}-N)$ headroom is spur-free.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the third-order intercept point?`, back: String.raw`A fictitious extrapolated power level where a device's third-order IM3 output would equal its fundamental output. IIP3 is input-referred, OIP3 output-referred.` },
      { front: String.raw`At what frequencies do IM3 products appear for tones $f_1,f_2$?`, back: String.raw`At $2f_1-f_2$ and $2f_2-f_1$ — close to the tones (in-band), so they cannot be filtered.` },
      { front: String.raw`What are the slopes of the fundamental and IM3 lines?`, back: String.raw`Fundamental rises 1 dB/dB (slope 1); IM3 rises 3 dB/dB (slope 3).` },
      { front: String.raw`State the IIP3 workhorse formula.`, back: String.raw`$\text{IIP3}=P_{in}+\tfrac12\Delta_{IM3}$, where $\Delta_{IM3}=P_{fund}-P_{IM3}$ in dBc.` },
      { front: String.raw`How are OIP3 and IIP3 related?`, back: String.raw`$\text{OIP3}=\text{IIP3}+G$ (gain in dB).` },
      { front: String.raw`Why is IP3 called fictitious?`, back: String.raw`The device compresses (saturates) 10-15 dB below it, so the fundamental and IM3 are never actually equal — the intercept is an extrapolation.` },
      { front: String.raw`Rule of thumb linking IP3 and P1dB?`, back: String.raw`$\text{IIP3}\approx\text{P1dB}+9.6$ dB from cubic theory; practically P1dB + 10 to 15 dB.` },
      { front: String.raw`Write the cascade IIP3 formula.`, back: String.raw`$1/\text{IIP3}_{tot}=1/\text{IIP3}_1+G_1/\text{IIP3}_2+G_1 G_2/\text{IIP3}_3+\cdots$, all in linear units.` },
      { front: String.raw`Which stage tends to dominate cascade nonlinearity?`, back: String.raw`The last high-gain stage, because preceding gain multiplies its input-referred contribution — opposite of the noise-figure cascade.` },
      { front: String.raw`Define spurious-free dynamic range.`, back: String.raw`$\text{SFDR}=\tfrac23(\text{IIP3}-N)$, the input window where the signal is above the noise floor and IM3 is still below it.` },
      { front: String.raw`Why the $2/3$ factor in SFDR?`, back: String.raw`IM3 rises three times faster than the carrier (slope 3 vs 1), so only two-thirds of the raw $(\text{IIP3}-N)$ gap is spur-free.` },
      { front: String.raw`Why does IM3 matter more than harmonics in a receiver?`, back: String.raw`Harmonics and second-order products are far from the carrier and filterable; IM3 at $2f_1-f_2$ lands in-band and cannot be removed.` },
      { front: String.raw`What must you avoid when measuring IP3 in the lab?`, back: String.raw`Measuring near compression — there the IM3 line is no longer slope 3 and the extrapolated intercept is wrong. Stay well below P1dB.` }
    ],
    mcqs: [
      { q: String.raw`Two tones at $f_1$ and $f_2$ pass through a nonlinearity. The third-order intermodulation products appear at:`, options: [String.raw`$2f_1$ and $2f_2$`, String.raw`$f_1+f_2$ and $f_1-f_2$`, String.raw`$2f_1-f_2$ and $2f_2-f_1$`, String.raw`$3f_1$ and $3f_2$`], answer: 2, explain: String.raw`The cubic term produces IM3 at $2f_1-f_2$ and $2f_2-f_1$, which fall in-band. The others are harmonics or second-order products.` },
      { q: String.raw`On the IP3 plot, the IM3 output power rises at what rate versus input power?`, options: [String.raw`1 dB per dB`, String.raw`2 dB per dB`, String.raw`3 dB per dB`, String.raw`0.5 dB per dB`], answer: 2, explain: String.raw`IM3 amplitude $\propto A^3$, so its power rises 3 dB for every 1 dB of input — slope 3.` },
      { q: String.raw`A device has gain 15 dB and IIP3 = 0 dBm. Its OIP3 is:`, options: [String.raw`$-15$ dBm`, String.raw`$0$ dBm`, String.raw`$15$ dBm`, String.raw`$30$ dBm`], answer: 2, explain: String.raw`$\text{OIP3}=\text{IIP3}+G=0+15=15$ dBm.` },
      { q: String.raw`At $P_{in}=-20$ dBm per tone, $\Delta_{IM3}=30$ dBc. The IIP3 is:`, options: [String.raw`$-35$ dBm`, String.raw`$-5$ dBm`, String.raw`$+10$ dBm`, String.raw`$-20$ dBm`], answer: 1, explain: String.raw`$\text{IIP3}=P_{in}+\tfrac12\Delta_{IM3}=-20+15=-5$ dBm.` },
      { q: String.raw`Why is the third-order intercept point described as fictitious?`, options: [String.raw`It only exists at DC`, String.raw`The device compresses before reaching it, so IM3 never actually equals the fundamental`, String.raw`It depends on temperature`, String.raw`It is a measurement error`], answer: 1, explain: String.raw`Real devices saturate 10-15 dB below the intercept; it is defined by extrapolating two straight lines, not observed directly.` },
      { q: String.raw`The approximate rule linking IIP3 and the input 1 dB compression point is:`, options: [String.raw`$\text{IIP3}\approx\text{P1dB}-9.6$ dB`, String.raw`$\text{IIP3}\approx\text{P1dB}+9.6$ dB`, String.raw`$\text{IIP3}\approx 2\,\text{P1dB}$`, String.raw`$\text{IIP3}=\text{P1dB}$`], answer: 1, explain: String.raw`Cubic theory gives $\text{IIP3}\approx\text{P1dB}+9.6$ dB (practical spread 10-15 dB).` },
      { q: String.raw`In the cascade IIP3 formula, a later stage's contribution is:`, options: [String.raw`Divided by the following gain`, String.raw`Multiplied by the preceding gain`, String.raw`Independent of gain`, String.raw`Divided by the noise figure`], answer: 1, explain: String.raw`$1/\text{IIP3}_{tot}=1/\text{IIP3}_1+G_1/\text{IIP3}_2+\cdots$: stage 2's term is multiplied by the gain $G_1$ ahead of it.` },
      { q: String.raw`Compared with the noise-figure cascade, the IP3 cascade is dominated by:`, options: [String.raw`The first stage, same as noise figure`, String.raw`The last high-gain stage, opposite to noise figure`, String.raw`Only the mixer`, String.raw`Neither; all stages contribute equally`], answer: 1, explain: String.raw`Preceding gain penalises later stages, so the back-end usually dominates nonlinearity — the mirror image of the Friis noise cascade.` },
      { q: String.raw`The spurious-free dynamic range is given by:`, options: [String.raw`$\text{IIP3}-N$`, String.raw`$\tfrac12(\text{IIP3}-N)$`, String.raw`$\tfrac23(\text{IIP3}-N)$`, String.raw`$3(\text{IIP3}-N)$`], answer: 2, explain: String.raw`$\text{SFDR}=\tfrac23(\text{IIP3}-N)$; the $2/3$ comes from the slope-3 IM3 growth.` },
      { q: String.raw`Improving IIP3 by 3 dB improves SFDR by about:`, options: [String.raw`3 dB`, String.raw`2 dB`, String.raw`4.5 dB`, String.raw`1 dB`], answer: 1, explain: String.raw`SFDR $=\tfrac23(\text{IIP3}-N)$, so a 3 dB IIP3 gain yields $\tfrac23\times3=2$ dB of SFDR.` },
      { q: String.raw`Which distortion product is hardest to remove in a narrowband receiver?`, options: [String.raw`The second harmonic $2f_1$`, String.raw`The IM3 product $2f_1-f_2$`, String.raw`The sum tone $f_1+f_2$`, String.raw`The third harmonic $3f_1$`], answer: 1, explain: String.raw`IM3 at $2f_1-f_2$ lands in-band next to the tones; harmonics and the sum tone are far off and filterable.` },
      { q: String.raw`When measuring IP3, you must ensure the device is:`, options: [String.raw`Operating near saturation`, String.raw`Well below P1dB (small-signal)`, String.raw`At exactly P1dB`, String.raw`Above the intercept`], answer: 1, explain: String.raw`Near compression the IM3 line deviates from slope 3, so the extrapolated intercept is wrong; measure in the true small-signal region.` }
    ],
    numericals: [
      { q: String.raw`In a two-tone test with per-tone input $P_{in}=-30$ dBm, the fundamental output is $-20$ dBm and the IM3 product is $-60$ dBm (so $\Delta_{IM3}=40$ dB). The stage gain is 10 dB. Find IIP3 and OIP3.`, solution: String.raw`<p><b>Formula.</b> From the two-line construction, $$\text{IIP3}=P_{in}+\tfrac12\Delta_{IM3},\qquad \Delta_{IM3}=P_{fund}-P_{IM3},\qquad \text{OIP3}=\text{IIP3}+G,$$ with all powers in dBm and gain $G$ in dB.</p>
<p><b>Substitute.</b> $$\Delta_{IM3}=(-20)-(-60)=40\text{ dB},\qquad \text{IIP3}=-30+\tfrac12(40),\qquad \text{OIP3}=\text{IIP3}+10.$$</p>
<p><b>Compute.</b> $\tfrac12(40)=20$, so $\text{IIP3}=-30+20=-10$ dBm. Then $\text{OIP3}=-10+10=0$ dBm. (Check: $\text{OIP3}=P_{out}+\tfrac12\Delta_{IM3}=-20+20=0$ dBm — consistent.)</p>
<p><b>Explanation.</b> IIP3 sits 20 dB above the drive level because the fundamental-to-IM3 gap of 40 dBc closes at 2 dB per dB. The device compresses long before $-10$ dBm input, so this intercept is an extrapolation, not an operating point.</p>` },
      { q: String.raw`An amplifier has IIP3 = $-5$ dBm and gain 18 dB. A datasheet quotes its input P1dB. Estimate OIP3 and the input P1dB using the standard rule.`, solution: String.raw`<p><b>Formula.</b> $$\text{OIP3}=\text{IIP3}+G,\qquad \text{IIP3}\approx P_{1dB,in}+9.6\text{ dB}\ \Rightarrow\ P_{1dB,in}\approx\text{IIP3}-9.6\text{ dB}.$$</p>
<p><b>Substitute.</b> $$\text{OIP3}=-5+18,\qquad P_{1dB,in}=-5-9.6.$$</p>
<p><b>Compute.</b> $\text{OIP3}=13$ dBm; $P_{1dB,in}=-14.6$ dBm.</p>
<p><b>Explanation.</b> The 9.6 dB offset is the ideal cubic-model gap between IP3 and P1dB. A real device would show P1dB roughly 10-15 dB below IIP3, so $-14.6$ dBm is an optimistic (upper-bound) estimate of where 1 dB of gain compression sets in.</p>` },
      { q: String.raw`Two cascaded stages: Stage 1 has $G_1=15$ dB and $\text{IIP3}_1=+5$ dBm; Stage 2 has $\text{IIP3}_2=+10$ dBm. Find the cascade IIP3.`, solution: String.raw`<p><b>Formula.</b> Convert to linear ratios and use $$\frac{1}{\text{IIP3}_{tot}}=\frac{1}{\text{IIP3}_1}+\frac{G_1}{\text{IIP3}_2},$$ where IIP3 values are linear powers (mW) and $G_1$ is a linear power gain.</p>
<p><b>Substitute.</b> $\text{IIP3}_1=10^{5/10}=3.162$ mW, $\text{IIP3}_2=10^{10/10}=10$ mW, $G_1=10^{15/10}=31.62$. $$\frac{1}{\text{IIP3}_{tot}}=\frac{1}{3.162}+\frac{31.62}{10}.$$</p>
<p><b>Compute.</b> $1/3.162=0.3162$ and $31.62/10=3.162$; sum $=3.478\ \text{mW}^{-1}$. So $\text{IIP3}_{tot}=1/3.478=0.2875$ mW $=10\log_{10}(0.2875)=-5.4$ dBm.</p>
<p><b>Explanation.</b> The second term ($3.162$) is ten times the first ($0.3162$), so the back-end dominates: the 15 dB of front-end gain drags the effective input intercept down to $-5.4$ dBm, well below either stage alone. This is the classic penalty of putting gain ahead of a nonlinear stage.</p>` },
      { q: String.raw`A receiver has IIP3 = $-10$ dBm, bandwidth $B=1$ MHz, and noise figure $NF=4$ dB. Find the input noise floor $N$ and the SFDR.`, solution: String.raw`<p><b>Formula.</b> $$N=-174+10\log_{10}B+NF\ \text{(dBm)},\qquad \text{SFDR}=\tfrac23(\text{IIP3}-N).$$</p>
<p><b>Substitute.</b> $$N=-174+10\log_{10}(10^{6})+4,\qquad \text{SFDR}=\tfrac23\big(-10-N\big).$$</p>
<p><b>Compute.</b> $10\log_{10}(10^{6})=60$, so $N=-174+60+4=-110$ dBm. Then $\text{IIP3}-N=-10-(-110)=100$ dB, and $\text{SFDR}=\tfrac23(100)=66.7$ dB.</p>
<p><b>Explanation.</b> The noise floor sets the bottom of the range at $-110$ dBm; IIP3 sets the top. The $2/3$ factor turns the 100 dB raw span into 66.7 dB of spur-free range — the price paid because IM3 grows three times faster than the carrier.</p>` },
      { q: String.raw`A two-tone test uses $f_1=100.0$ MHz and $f_2=100.1$ MHz. Find the two IM3 product frequencies and their spacing to the nearest tone.`, solution: String.raw`<p><b>Formula.</b> The lower and upper IM3 products lie at $$f_{L}=2f_1-f_2,\qquad f_{U}=2f_2-f_1.$$</p>
<p><b>Substitute.</b> $$f_{L}=2(100.0)-100.1,\qquad f_{U}=2(100.1)-100.0\ \ \text{(MHz)}.$$</p>
<p><b>Compute.</b> $f_{L}=200.0-100.1=99.9$ MHz; $f_{U}=200.2-100.0=100.2$ MHz. The tone spacing is $f_2-f_1=0.1$ MHz, and each IM3 product sits exactly $0.1$ MHz beyond its nearest tone ($99.9$ is $0.1$ below $f_1$; $100.2$ is $0.1$ above $f_2$).</p>
<p><b>Explanation.</b> The IM3 products straddle the tone pair at the same $0.1$ MHz spacing, spanning $99.9$-$100.2$ MHz — all inside a typical channel passband. A filter that admits the wanted tones necessarily admits these spurs, which is exactly why IM3 sets in-band linearity.</p>` }
    ],
    realWorld: String.raw`<p>IP3 is one of the first numbers an RF system engineer writes down for any receiver. In a crowded band a nearby transmitter pair — two strong adjacent-channel carriers, or a blocker plus the wanted signal — beats through the <a href="#lna">LNA</a> and <a href="#mixer">mixer</a> to create IM3 that lands on the desired channel and raises the effective noise floor, degrading sensitivity even though the wanted signal itself is untouched. Cellular base stations, GPS receivers next to cellular transmitters, and cable/CATV plants all specify IIP3 tightly for this reason. The gain-vs-linearity tension drives real architecture choices: front-ends use switchable-gain LNAs and step attenuators so that, when a strong blocker appears, gain is backed off to protect IIP3 at the cost of a slightly higher <a href="#sensitivity">noise floor</a>. Designers trade IIP3 against noise figure and <a href="#link-budget">link budget</a> continuously, and modern transceiver ICs expose both an AGC loop and digital IM3-cancellation to stretch the spurious-free dynamic range. The same two-tone intermodulation physics underlies the harmonic distortion captured by the related <a href="#harmonics">harmonics</a> topic — IM3 is simply the in-band, unfilterable cousin that ends up mattering most.</p>`,
    related: ['harmonics', 'lna', 'mixer', 'sensitivity', 'noise-floor']
  }
);
