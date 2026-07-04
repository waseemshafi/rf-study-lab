// Image Frequency & Image Rejection — RF front-end study topic.
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'image-frequency',
    title: 'Image Frequency & Image Rejection',
    category: 'RF Front-End & Receivers',
    tags: ['image', 'preselector', 'image-reject mixer', 'Hartley', 'Weaver', 'dual conversion', 'IRR', 'superheterodyne'],
    summary: String.raw`In a heterodyne downconverter the mixer maps two input frequencies — the wanted RF and its image, sitting $2f_{IF}$ away on the opposite side of the LO — onto the same IF, so an unwanted signal at the image can swamp the wanted one unless it is removed by RF preselection, a high IF, an image-reject mixer, or dual conversion.`,
    diagram: [
    {
      title: String.raw`Two frequencies fold to one IF: RF and image about the LO`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-image-frequency" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">RF and image both fold to the same IF</text>
        <line x1="30" y1="120" x2="510" y2="120" stroke="#9aa7b5" marker-end="url(#arr-image-frequency)"/>
        <text x="512" y="135" fill="#9aa7b5" font-size="10">f</text>
        <line x1="150" y1="60" x2="150" y2="120" stroke="#4dabf7" stroke-width="2"/>
        <text x="150" y="52" fill="#4dabf7" text-anchor="middle">f<tspan baseline-shift="sub" font-size="9">RF</tspan></text>
        <line x1="300" y1="45" x2="300" y2="120" stroke="#ffa94d" stroke-width="2"/>
        <text x="300" y="38" fill="#ffa94d" text-anchor="middle">f<tspan baseline-shift="sub" font-size="9">LO</tspan></text>
        <line x1="450" y1="60" x2="450" y2="120" stroke="#63e6be" stroke-width="2"/>
        <text x="450" y="52" fill="#63e6be" text-anchor="middle">f<tspan baseline-shift="sub" font-size="9">im</tspan></text>
        <path d="M150,140 Q225,175 300,140" stroke="#4dabf7" fill="none" marker-end="url(#arr-image-frequency)"/>
        <path d="M450,140 Q375,175 300,140" stroke="#63e6be" fill="none" marker-end="url(#arr-image-frequency)"/>
        <text x="225" y="190" fill="#9aa7b5" text-anchor="middle" font-size="10">|f<tspan baseline-shift="sub" font-size="8">LO</tspan>−f<tspan baseline-shift="sub" font-size="8">RF</tspan>| = f<tspan baseline-shift="sub" font-size="8">IF</tspan></text>
        <text x="375" y="190" fill="#9aa7b5" text-anchor="middle" font-size="10">|f<tspan baseline-shift="sub" font-size="8">im</tspan>−f<tspan baseline-shift="sub" font-size="8">LO</tspan>| = f<tspan baseline-shift="sub" font-size="8">IF</tspan></text>
        <text x="300" y="108" fill="#b197fc" text-anchor="middle" font-size="10">spacing f<tspan baseline-shift="sub" font-size="8">im</tspan>−f<tspan baseline-shift="sub" font-size="8">RF</tspan> = 2f<tspan baseline-shift="sub" font-size="8">IF</tspan></text>
      </svg>`,
      caption: String.raw`The wanted RF and the image sit symmetrically about the LO, each $f_{IF}$ away. The mixer's difference product $|f-f_{LO}|$ therefore lands both on the same IF, so the image is indistinguishable from the wanted signal after mixing — it must be blocked beforehand. The two are $2f_{IF}$ apart.`
    },
    {
      title: String.raw`RF preselector: attenuate the image before the mixer`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-image-frequency" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Image-reject bandpass filter ahead of the mixer</text>
        <rect x="20" y="70" width="70" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="55" y="90" fill="#e6edf3" text-anchor="middle">LNA</text><text x="55" y="105" fill="#9aa7b5" font-size="9" text-anchor="middle">gain</text>
        <line x1="90" y1="92" x2="120" y2="92" stroke="#9aa7b5" marker-end="url(#arr2-image-frequency)"/>
        <rect x="120" y="70" width="100" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="170" y="88" fill="#e6edf3" text-anchor="middle">preselector</text><text x="170" y="104" fill="#9aa7b5" font-size="9" text-anchor="middle">BPF at f<tspan baseline-shift="sub" font-size="8">RF</tspan></text>
        <line x1="220" y1="92" x2="250" y2="92" stroke="#9aa7b5" marker-end="url(#arr2-image-frequency)"/>
        <circle cx="278" cy="92" r="22" fill="#1c232e" stroke="#ffa94d"/><text x="278" y="97" fill="#ffa94d" text-anchor="middle" font-size="14">×</text>
        <line x1="278" y1="150" x2="278" y2="114" stroke="#9aa7b5" marker-end="url(#arr2-image-frequency)"/><text x="278" y="164" fill="#b197fc" text-anchor="middle" font-size="10">f<tspan baseline-shift="sub" font-size="8">LO</tspan></text>
        <line x1="300" y1="92" x2="360" y2="92" stroke="#9aa7b5" marker-end="url(#arr2-image-frequency)"/>
        <rect x="360" y="70" width="90" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="405" y="90" fill="#e6edf3" text-anchor="middle">IF</text><text x="405" y="105" fill="#9aa7b5" font-size="9" text-anchor="middle">f<tspan baseline-shift="sub" font-size="8">IF</tspan></text>
        <line x1="450" y1="92" x2="500" y2="92" stroke="#9aa7b5" marker-end="url(#arr2-image-frequency)"/>
        <text x="170" y="140" fill="#63e6be" text-anchor="middle" font-size="9">passes f<tspan baseline-shift="sub" font-size="8">RF</tspan>, rejects f<tspan baseline-shift="sub" font-size="8">im</tspan> (2f<tspan baseline-shift="sub" font-size="8">IF</tspan> away)</text>
        <text x="170" y="55" fill="#9aa7b5" text-anchor="middle" font-size="9">needs enough IF separation to roll off</text>
      </svg>`,
      caption: String.raw`A bandpass preselector centred on $f_{RF}$ is placed before the mixer so the image (which lies $2f_{IF}$ from the wanted signal) falls on the filter skirt and is attenuated. The larger $f_{IF}$ is, the further out the image sits and the easier this filter's job becomes — which is why the IF choice and image rejection are coupled.`
    },
    {
      title: String.raw`Image-reject (Hartley/Weaver) mixer: cancel the image by phasing`,
      svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-image-frequency" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Quadrature paths cancel the image (Hartley)</text>
        <line x1="20" y1="110" x2="60" y2="110" stroke="#9aa7b5" marker-end="url(#arr3-image-frequency)"/><text x="20" y="102" fill="#9aa7b5" font-size="9">RF</text>
        <circle cx="86" cy="70" r="20" fill="#1c232e" stroke="#ffa94d"/><text x="86" y="75" fill="#ffa94d" text-anchor="middle" font-size="13">×</text>
        <circle cx="86" cy="150" r="20" fill="#1c232e" stroke="#ffa94d"/><text x="86" y="155" fill="#ffa94d" text-anchor="middle" font-size="13">×</text>
        <line x1="60" y1="110" x2="86" y2="90" stroke="#9aa7b5"/><line x1="60" y1="110" x2="86" y2="130" stroke="#9aa7b5"/>
        <text x="128" y="60" fill="#b197fc" text-anchor="middle" font-size="9">cos(f<tspan baseline-shift="sub" font-size="8">LO</tspan>)</text>
        <text x="128" y="168" fill="#b197fc" text-anchor="middle" font-size="9">−sin(f<tspan baseline-shift="sub" font-size="8">LO</tspan>) (90°)</text>
        <line x1="86" y1="52" x2="86" y2="40" stroke="#b197fc" marker-end="url(#arr3-image-frequency)"/>
        <line x1="86" y1="168" x2="86" y2="180" stroke="#b197fc" marker-end="url(#arr3-image-frequency)"/>
        <line x1="106" y1="70" x2="160" y2="70" stroke="#9aa7b5" marker-end="url(#arr3-image-frequency)"/>
        <rect x="160" y="52" width="90" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="205" y="74" fill="#e6edf3" text-anchor="middle" font-size="10">I: LPF</text>
        <line x1="106" y1="150" x2="160" y2="150" stroke="#9aa7b5" marker-end="url(#arr3-image-frequency)"/>
        <rect x="160" y="132" width="90" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="205" y="154" fill="#e6edf3" text-anchor="middle" font-size="10">Q: LPF</text>
        <line x1="250" y1="150" x2="300" y2="150" stroke="#9aa7b5" marker-end="url(#arr3-image-frequency)"/>
        <rect x="300" y="132" width="70" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="335" y="154" fill="#e6edf3" text-anchor="middle" font-size="10">90° shift</text>
        <line x1="250" y1="70" x2="420" y2="70" stroke="#9aa7b5"/>
        <line x1="370" y1="150" x2="420" y2="150" stroke="#9aa7b5"/>
        <circle cx="440" cy="110" r="22" fill="#1c232e" stroke="#b197fc"/><text x="440" y="116" fill="#b197fc" text-anchor="middle" font-size="16">+</text>
        <line x1="420" y1="70" x2="440" y2="92" stroke="#9aa7b5"/><line x1="420" y1="150" x2="440" y2="128" stroke="#9aa7b5"/>
        <line x1="462" y1="110" x2="510" y2="110" stroke="#9aa7b5" marker-end="url(#arr3-image-frequency)"/><text x="486" y="102" fill="#63e6be" font-size="9">IF (image cancelled)</text>
        <text x="270" y="208" fill="#9aa7b5" text-anchor="middle" font-size="9">wanted signal adds in phase; image is 180° out and subtracts to zero</text>
      </svg>`,
      caption: String.raw`A Hartley image-reject mixer splits the RF into two quadrature-mixed paths (I and Q using $\cos$ and $-\sin$ LO). After a $90^{\circ}$ phase shift and summation the wanted sideband adds constructively while the image adds $180^{\circ}$ out of phase and cancels. The residual leakage from finite gain/phase mismatch sets the image-reject ratio.`
    }
    ],
    prerequisites: ['mixer', 'superheterodyne'],
    intro: String.raw`<p><b>Why does the image frequency matter?</b> Because a mixer is fundamentally blind. When it multiplies an incoming band by the local oscillator, the difference product $|f-f_{LO}|$ collapses <i>two</i> distinct input frequencies onto the <i>same</i> intermediate frequency: the one you want, and a mirror-image frequency on the opposite side of the LO. Once both land on the IF they are physically identical and no amount of downstream IF filtering can separate them. A strong interferer sitting on that image can therefore ride straight through and swamp the wanted channel — so image rejection is a problem that <i>must</i> be solved <b>before</b> the mixer, or by clever phasing <i>inside</i> it. Every heterodyne receiver ever built has had to answer the image question.</p>
<p>The <b>image frequency</b> $f_{im}$ is the frequency that mixes with the same LO to produce the same IF as the wanted RF, but from the other side of the LO. It sits exactly $2f_{IF}$ away from the desired RF. This topic develops the geometry ($f_{im}=f_{LO}\mp f_{IF}$, separation $2f_{IF}$), the four classical defences — <b>RF preselection</b>, a deliberately <b>high IF</b>, the <b>image-reject (Hartley/Weaver) mixer</b>, and <b>dual conversion</b> — and how to quantify the result as an <b>image-reject ratio (IRR)</b> in dB, including how filter attenuation and I/Q mismatch each set it.</p>`,
    sections: [
      {
        h: 'What the image frequency is and where it sits',
        html: String.raw`<p>A downconverting mixer forms products at $f_{RF}\pm f_{LO}$; the wanted output is the difference term at the intermediate frequency $f_{IF}=|f_{RF}-f_{LO}|$. The trouble is that this absolute value has <b>two</b> solutions. For a given $f_{LO}$ and target $f_{IF}$, two RF inputs satisfy it:</p>
        <p>$$f_{RF}=f_{LO}\pm f_{IF},\qquad f_{im}=f_{LO}\mp f_{IF}.$$</p>
        <p>One is the wanted signal; the other is the <b>image</b>, sitting on the opposite side of the LO. If the receiver uses <b>high-side injection</b> ($f_{LO}=f_{RF}+f_{IF}$), the wanted RF is below the LO and the image is above it at $f_{im}=f_{LO}+f_{IF}=f_{RF}+2f_{IF}$. With <b>low-side injection</b> the roles flip. Either way the two are separated by</p>
        <p>$$f_{im}-f_{RF}=\pm 2f_{IF}.$$</p>
        <p>Both fold to the same IF, so after the mixer they are indistinguishable. The image is not a spurious product the mixer creates — it is a real external frequency that the mixer <i>maps</i> into the passband.</p>
        <div class="callout tip"><b>Key intuition:</b> the LO is a mirror. Whatever wanted signal sits at distance $f_{IF}$ below (or above) the LO has a reflection an equal distance on the other side. That reflection is the image, and it is always $2f_{IF}$ from the signal you actually want.</div>`
      },
      {
        h: 'Why the image is dangerous and cannot be fixed at IF',
        html: String.raw`<p>Consider a receiver at $f_{RF}=100$ MHz with $f_{IF}=10.7$ MHz and high-side LO at 110.7 MHz. The image sits at $110.7+10.7=121.4$ MHz. Any energy present at 121.4 MHz — an adjacent broadcast station, a nearby transmitter, wideband noise — mixes to exactly 10.7 MHz, the same IF as the wanted 100 MHz signal.</p>
        <p>Once both are at 10.7 MHz, the IF filter sees a single overlapping spectrum. It cannot tell wanted from image because they occupy the identical band. If the image interferer is stronger than the wanted signal, it dominates the IF and the receiver locks onto garbage. This is why image rejection is a <b>front-end</b> problem:</p>
        <ul>
          <li>Downstream <b>IF selectivity</b> rejects <i>adjacent channels</i> but does nothing for the image — the image is already inside the IF passband.</li>
          <li>The only places to act are (1) <b>before</b> the mixer, removing image energy at RF, or (2) <b>inside</b> the mixer, cancelling it by phasing.</li>
        </ul>
        <div class="callout tip"><b>Exam trap:</b> "increase IF filter Q" is <i>not</i> an image-rejection technique. IF filtering cannot separate two signals that already coincide at the IF; you must attack the image at RF or with an image-reject mixer.</div>`
      },
      {
        h: 'Defence 1 — RF preselector / image-reject filter',
        html: String.raw`<p>The classic first line of defence is a <b>bandpass preselector</b> centred on $f_{RF}$ placed <i>before</i> the mixer (typically right after or around the LNA). Because the image is $2f_{IF}$ away, it falls on the filter's stopband skirt and is attenuated by whatever rejection the filter provides at that offset.</p>
        <p>The effectiveness depends on the ratio of the image offset to the filter's centre frequency. If $2f_{IF}$ is small compared with $f_{RF}$, the image is <i>fractionally</i> close to the passband and a realisable filter cannot roll off enough — the preselector needs a very high $Q$. If $2f_{IF}$ is a large fraction of $f_{RF}$, the image is far out and a modest filter kills it.</p>
        <p>This directly couples the preselector requirement to the IF choice: a low IF makes the image close and the filter hard; a high IF pushes the image out and eases the filter. Practical broadcast receivers with a 10.7 MHz IF rely on a tuned RF stage tracking the desired channel so the image (21.4 MHz away) sits well down the skirt.</p>
        <div class="callout tip"><b>Design coupling:</b> preselector difficulty $\propto f_{RF}/(2f_{IF})$. The filter and the IF plan cannot be designed independently — the image sets the link between them.</div>`
      },
      {
        h: 'Defence 2 — choose a high IF (and the selectivity tension)',
        html: String.raw`<p>Raising $f_{IF}$ moves the image to $f_{RF}+2f_{IF}$ (high-side), pushing it far from the passband so even a gentle preselector rejects it. This is the cheapest structural fix: it costs nothing but a frequency-plan choice.</p>
        <p>But a high IF has a downside — <b>channel selectivity</b>. IF filters that must isolate a narrow wanted channel need a high fractional $Q$; a high centre frequency makes narrowband selectivity harder and more expensive. So the designer faces a fundamental tension:</p>
        <ul>
          <li><b>High IF</b> ⟹ easy image rejection, hard channel selectivity.</li>
          <li><b>Low IF</b> ⟹ easy channel selectivity, hard image rejection.</li>
        </ul>
        <p>This unresolved tension is exactly what motivates the next technique — you cannot have both a high IF (for the image) and a low IF (for selectivity) in a single conversion, so you use two.</p>
        <div class="callout tip"><b>Trade-off:</b> a single conversion forces one IF to serve two conflicting goals. High-IF image rejection and low-IF selectivity pull in opposite directions — the resolution is dual conversion.</div>`
      },
      {
        h: 'Defence 3 — image-reject mixers (Hartley & Weaver)',
        html: String.raw`<p>Instead of filtering the image away, an <b>image-reject mixer</b> cancels it by <b>phasing</b>. The RF is mixed against two LO phases in quadrature ($\cos$ and $-\sin$), producing an in-phase (I) and quadrature (Q) path. The crucial fact: the wanted signal and the image produce IF phasors that <i>differ in sign of their phase</i> between the I and Q paths. After an extra $90^{\circ}$ shift on one path and summation, the wanted sideband adds constructively while the image adds $180^{\circ}$ out of phase and cancels.</p>
        <ul>
          <li><b>Hartley architecture:</b> quadrature LO mix, then a $90^{\circ}$ phase shifter (or polyphase network) on one branch, then sum. Simple but sensitive to the phase-shifter accuracy.</li>
          <li><b>Weaver architecture:</b> replaces the analogue $90^{\circ}$ RF/IF phase shifter with a <i>second</i> quadrature mixing stage, avoiding the wideband phase shifter and easing implementation at the cost of a second LO.</li>
        </ul>
        <p>Cancellation is never perfect: any <b>amplitude mismatch</b> or <b>phase error</b> between the I and Q paths leaves a residual image. This residual, relative to the wanted signal, is the image-reject ratio — no RF filter needed, which is why image-reject mixers are the enabler of low-IF and zero-IF integrated receivers.</p>
        <div class="callout tip"><b>Key intuition:</b> the mixer doesn't remove the image energy, it makes two copies of it that are $180^{\circ}$ apart and lets them destroy each other. Perfect quadrature ⟹ perfect cancellation; real mismatch ⟹ a finite IRR floor.</div>`
      },
      {
        h: 'Defence 4 — dual conversion and image-reject ratio (IRR)',
        html: String.raw`<p><b>Dual (double) conversion</b> resolves the high-IF/low-IF conflict by using <i>two</i> mixing stages. The <b>first IF is high</b>, so its image is far out and easily preselected. The <b>second IF is low</b>, where cheap high-$Q$ filters give sharp channel selectivity. Each stage has its own image, but each is manageable in its own plan. This is the workhorse architecture of communications and instrumentation receivers.</p>
        <p>The quality of image rejection is quantified by the <b>image-reject ratio (IRR)</b>, the ratio of wanted-signal gain to image gain, expressed in dB:</p>
        <p>$$\text{IRR}=10\log_{10}\!\frac{G_{signal}}{G_{image}}\ \text{dB}.$$</p>
        <p>For a filtered front-end, the IRR is simply the preselector's attenuation at $f_{im}$ (plus any mixer imbalance). For an image-reject mixer it is set by the I/Q amplitude ratio $\varepsilon$ (as a fraction) and phase error $\Delta\phi$ (radians):</p>
        <p>$$\text{IRR}\approx 10\log_{10}\!\frac{1+2(1+\varepsilon)\cos\Delta\phi+(1+\varepsilon)^2}{1-2(1+\varepsilon)\cos\Delta\phi+(1+\varepsilon)^2}.$$</p>
        <p>Typical passive image-reject mixers reach 30-40 dB without trimming; well-calibrated integrated designs reach 40-60 dB.</p>
        <div class="callout tip"><b>Rule of thumb:</b> ~35-40 dB IRR needs I/Q matched to about $1\%$ amplitude and $1^{\circ}$ phase. Every extra 10 dB roughly halves the tolerable mismatch — which is why deep image rejection usually needs calibration.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The geometry:</b> the image $f_{im}=f_{LO}\mp f_{IF}$ sits on the opposite side of the LO from the wanted RF and is exactly $2f_{IF}$ away; both fold to the same IF because the mixer's difference product is an absolute value.</li>
<li><b>Why IF filtering can't help:</b> once image and signal coincide at the IF they are identical; rejection must happen before the mixer (RF preselector) or inside it (phasing).</li>
<li><b>The four defences:</b> RF preselector (needs enough IF separation), a high IF (pushes the image out), the image-reject Hartley/Weaver mixer (quadrature cancellation), and dual conversion (high 1st IF for image, low 2nd IF for selectivity).</li>
<li><b>The core tension:</b> a single conversion cannot simultaneously give easy image rejection (wants high IF) and sharp selectivity (wants low IF) — dual conversion resolves it.</li>
<li><b>Quantifying it:</b> IRR in dB equals the preselector attenuation at $f_{im}$, or for a mixer is set by I/Q amplitude and phase mismatch; ~1% and ~1° gives roughly 40 dB.</li>
<li><b>The design coupling:</b> the image links the IF plan and the preselector — you cannot choose them independently.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`The image frequency is $f_{im}=f_{LO}\mp f_{IF}$ — the mirror of the wanted RF about the LO — and both map to the same IF via the mixer's difference product.`,
      String.raw`The image is always exactly $2f_{IF}$ away from the desired RF; a bigger IF pushes it further out.`,
      String.raw`Once image and signal coincide at the IF they are inseparable — IF selectivity cannot reject the image; you must act before or inside the mixer.`,
      String.raw`Defence 1: an RF preselector/image-reject BPF before the mixer attenuates the image, but needs enough IF separation ($2f_{IF}$) to roll off.`,
      String.raw`Defence 2: a high IF pushes the image far out (easy rejection) but makes narrowband channel selectivity harder — a fundamental single-conversion tension.`,
      String.raw`Defence 3: image-reject (Hartley/Weaver) mixers use quadrature LO mixing plus a phase shift so the wanted signal adds and the image cancels $180^{\circ}$ out of phase.`,
      String.raw`Defence 4: dual conversion uses a high 1st IF (for image rejection) and a low 2nd IF (for selectivity), resolving the tension.`,
      String.raw`Image-reject ratio (IRR) in dB is $10\log_{10}(G_{signal}/G_{image})$ — the preselector attenuation at $f_{im}$, or set by mixer I/Q mismatch.`,
      String.raw`In an image-reject mixer, residual image comes from I/Q amplitude ($\varepsilon$) and phase ($\Delta\phi$) mismatch; ~1% and ~1° gives roughly 40 dB IRR.`,
      String.raw`Preselector difficulty scales as $f_{RF}/(2f_{IF})$: a low IF makes the image fractionally close and the filter hard; a high IF makes it easy.`
    ],
    equations: [
      {
        title: 'Image frequency and 2·IF separation',
        tex: String.raw`$$f_{im}=f_{LO}\mp f_{IF},\qquad f_{im}-f_{RF}=\pm 2f_{IF}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A downconverting mixer multiplies the RF by the LO and we keep the difference term, so the intermediate frequency is $f_{IF}=|f_{RF}-f_{LO}|$. The absolute value is the whole story: it means the equation $f_{IF}=|f-f_{LO}|$ has two frequency solutions, not one, and the second solution is the image.</p>
        <p><b>Step 1 — write both solutions of the IF equation.</b> Solving $|f-f_{LO}|=f_{IF}$ for $f$ gives two roots, one on each side of the LO:</p>
        $$f=f_{LO}+f_{IF}\qquad\text{and}\qquad f=f_{LO}-f_{IF}.$$
        <p>Whichever one carries the wanted signal we call $f_{RF}$; the other is the image $f_{im}$.</p>
        <p><b>Step 2 — assign wanted and image.</b> Take high-side injection, $f_{LO}=f_{RF}+f_{IF}$, so the wanted RF is the lower root $f_{RF}=f_{LO}-f_{IF}$. Then the image is the upper root:</p>
        $$f_{im}=f_{LO}+f_{IF}.$$
        <p>For low-side injection the signs swap, which is why we write compactly $f_{im}=f_{LO}\mp f_{IF}$ (image takes the opposite sign to the wanted RF).</p>
        <p><b>Step 3 — compute the separation.</b> Subtract the wanted from the image:</p>
        $$f_{im}-f_{RF}=(f_{LO}+f_{IF})-(f_{LO}-f_{IF})=2f_{IF}.$$
        <p><b>Result.</b> $$\boxed{f_{im}=f_{LO}\mp f_{IF},\qquad |f_{im}-f_{RF}|=2f_{IF}.}$$ Sanity check: with $f_{RF}=100$ MHz, $f_{IF}=10.7$ MHz, high-side $f_{LO}=110.7$ MHz, the image is at $110.7+10.7=121.4$ MHz $=100+2(10.7)$ — exactly $2f_{IF}$ above the wanted signal.</p>`
      },
      {
        title: 'IRR from preselector attenuation at the image',
        tex: String.raw`$$\text{IRR}=10\log_{10}\!\frac{G_{sig}}{G_{im}}=A_{RF}(f_{im})\ \text{dB}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Image rejection by filtering means the front-end presents a large gain to the wanted signal and a small gain to the image. The image-reject ratio is defined as the ratio of these two gains, so we need to express it in terms of the preselector's response.</p>
        <p><b>Step 1 — define IRR as a gain ratio.</b> Let $G_{sig}$ be the total front-end voltage (or power) gain at the wanted frequency and $G_{im}$ the gain at the image. The image-reject ratio in decibels is</p>
        $$\text{IRR}=10\log_{10}\!\frac{G_{sig}}{G_{im}}\quad(\text{power ratio}).$$
        <p><b>Step 2 — split the gain into flat and frequency-selective parts.</b> Write the front-end gain as a flat block gain $G_0$ (LNA, mixer conversion gain, assumed equal at both frequencies since they are close) times the preselector response $H(f)$:</p>
        $$G(f)=G_0\,|H(f)|^2.$$
        <p>Then $G_{sig}/G_{im}=|H(f_{RF})|^2/|H(f_{im})|^2$; the flat $G_0$ cancels because the two frequencies see the same active-stage gain.</p>
        <p><b>Step 3 — recognise the filter attenuation.</b> With the preselector centred on $f_{RF}$, $|H(f_{RF})|\approx 1$ (passband) and $|H(f_{im})|\ll 1$ (stopband). Define the filter's stopband attenuation at the image as $A_{RF}(f_{im})=-20\log_{10}|H(f_{im})|$ dB. Substituting,</p>
        $$\text{IRR}=10\log_{10}\frac{1}{|H(f_{im})|^2}=-20\log_{10}|H(f_{im})|=A_{RF}(f_{im}).$$
        <p><b>Result.</b> $$\boxed{\text{IRR}=A_{RF}(f_{im})\ \text{dB}.}$$ The IRR provided by a preselector is exactly its attenuation at the image frequency. Sanity check: to achieve 60 dB of image rejection you need a filter that attenuates by 60 dB at the offset $2f_{IF}$ — driving the whole coupling between IF choice (which sets $2f_{IF}$) and preselector realisability.</p>`
      },
      {
        title: 'Image-reject mixer cancellation and IRR from I/Q mismatch',
        tex: String.raw`$$\text{IRR}\approx 10\log_{10}\!\frac{1+(1+\varepsilon)^2+2(1+\varepsilon)\cos\Delta\phi}{1+(1+\varepsilon)^2-2(1+\varepsilon)\cos\Delta\phi}$$`,
        derivation: String.raw`<p><b>Where we start.</b> An image-reject mixer creates two copies of the downconverted spectrum and sums them so that the wanted sideband reinforces while the image cancels. The cancellation is only as good as the match between the two paths, so we track the I and Q phasors and see what a gain error $\varepsilon$ and phase error $\Delta\phi$ leave behind.</p>
        <p><b>Step 1 — ideal quadrature paths.</b> Mixing the RF with $\cos\omega_{LO}t$ and $-\sin\omega_{LO}t$ produces I and Q baseband/IF terms. For a signal at $f_{LO}+f_{IF}$ the two paths' IF phasors are in a relation that, after the extra $90^{\circ}$ shift and summation, <i>add</i>; for the image at $f_{LO}-f_{IF}$ the same operations make them <i>subtract</i>. In the ideal case the image sum is exactly zero.</p>
        <p><b>Step 2 — inject the mismatch.</b> Let the Q path have amplitude $(1+\varepsilon)$ relative to I and an extra phase error $\Delta\phi$. Model the summed output as the phasor sum of a unit I contribution and a mismatched Q contribution $(1+\varepsilon)e^{j\Delta\phi}$. The <b>wanted</b> output magnitude squared is the constructive sum</p>
        $$|S|^2=1+(1+\varepsilon)^2+2(1+\varepsilon)\cos\Delta\phi,$$
        <p>and the residual <b>image</b> is the (nominally destructive) difference</p>
        $$|I|^2=1+(1+\varepsilon)^2-2(1+\varepsilon)\cos\Delta\phi.$$
        <p><b>Step 3 — form the ratio.</b> The image-reject ratio is wanted over residual image:</p>
        $$\text{IRR}=10\log_{10}\frac{|S|^2}{|I|^2}=10\log_{10}\frac{1+(1+\varepsilon)^2+2(1+\varepsilon)\cos\Delta\phi}{1+(1+\varepsilon)^2-2(1+\varepsilon)\cos\Delta\phi}.$$
        <p><b>Step 4 — small-error approximation.</b> For small $\varepsilon$ and $\Delta\phi$ (radians) this reduces to the widely used form</p>
        $$\text{IRR}\approx 10\log_{10}\frac{4}{\varepsilon^2+\Delta\phi^2}.$$
        <p><b>Result.</b> Perfect match ($\varepsilon=0,\Delta\phi=0$) gives $|I|^2=0$ and infinite IRR. Sanity check: $\varepsilon=0.01$ (1%) and $\Delta\phi=1^{\circ}=0.0175$ rad give $\text{IRR}\approx 10\log_{10}(4/(10^{-4}+3.05\times10^{-4}))\approx 40$ dB — matching the rule that ~1%/1° buys ~40 dB.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the image frequency?`, back: String.raw`The frequency $f_{im}=f_{LO}\mp f_{IF}$ on the opposite side of the LO that mixes to the same IF as the wanted RF; it is $2f_{IF}$ away from the wanted signal.` },
      { front: String.raw`How far is the image from the wanted RF?`, back: String.raw`Exactly $2f_{IF}$ (twice the intermediate frequency).` },
      { front: String.raw`Why can't the IF filter reject the image?`, back: String.raw`Because the image and the wanted signal both fold to the identical IF band — once they coincide they are physically inseparable; rejection must happen before or inside the mixer.` },
      { front: String.raw`Where is the image with high-side injection?`, back: String.raw`Above the LO at $f_{im}=f_{LO}+f_{IF}=f_{RF}+2f_{IF}$ (the wanted RF is below the LO).` },
      { front: String.raw`What is an RF preselector?`, back: String.raw`A bandpass filter centred on $f_{RF}$ placed before the mixer that attenuates the image on its stopband skirt; needs enough IF separation to roll off.` },
      { front: String.raw`How does a high IF help image rejection?`, back: String.raw`It moves the image to $f_{RF}+2f_{IF}$, far from the passband, so even a gentle preselector rejects it — at the cost of harder channel selectivity.` },
      { front: String.raw`What does an image-reject mixer do?`, back: String.raw`It mixes the RF against a quadrature LO ($\cos$, $-\sin$) and sums the paths after a $90^{\circ}$ shift so the wanted signal adds and the image cancels $180^{\circ}$ out of phase.` },
      { front: String.raw`Hartley vs Weaver image-reject mixer?`, back: String.raw`Hartley uses a quadrature LO mix plus an analogue $90^{\circ}$ phase shifter; Weaver replaces that shifter with a second quadrature mixing stage, avoiding the wideband phase shifter.` },
      { front: String.raw`What is dual conversion and why use it?`, back: String.raw`Two mixing stages: a high 1st IF (image far out, easy to preselect) and a low 2nd IF (cheap high-$Q$ selectivity), resolving the high-IF vs low-IF tension.` },
      { front: String.raw`What is the image-reject ratio (IRR)?`, back: String.raw`$\text{IRR}=10\log_{10}(G_{signal}/G_{image})$ in dB — for a filter it is the preselector attenuation at $f_{im}$; for a mixer it is set by I/Q mismatch.` },
      { front: String.raw`What sets the IRR of an image-reject mixer?`, back: String.raw`I/Q amplitude mismatch $\varepsilon$ and phase error $\Delta\phi$: $\text{IRR}\approx 10\log_{10}(4/(\varepsilon^2+\Delta\phi^2))$; ~1% and ~1° gives ~40 dB.` },
      { front: String.raw`Why is a low IF hard for image rejection?`, back: String.raw`The image is only $2f_{IF}$ away, fractionally close to the passband, so the preselector needs a very high $Q$ to attenuate it — difficulty scales as $f_{RF}/(2f_{IF})$.` },
      { front: String.raw`Is the image a mixer spurious product?`, back: String.raw`No — it is a real external frequency present at the antenna that the mixer maps into the IF passband, not a product the mixer generates internally.` },
      { front: String.raw`What IRR do practical image-reject mixers achieve?`, back: String.raw`Roughly 30-40 dB untrimmed passive designs, and 40-60 dB for well-calibrated integrated I/Q mixers.` }
    ],
    mcqs: [
      { q: String.raw`For $f_{RF}=100$ MHz, $f_{IF}=10.7$ MHz, high-side LO, the image frequency is:`, options: [String.raw`89.3 MHz`, String.raw`110.7 MHz`, String.raw`121.4 MHz`, String.raw`100 MHz`], answer: 2, explain: String.raw`High-side $f_{LO}=100+10.7=110.7$ MHz; image $=f_{LO}+f_{IF}=121.4$ MHz $=f_{RF}+2f_{IF}$.` },
      { q: String.raw`The image frequency is separated from the wanted RF by:`, options: [String.raw`$f_{IF}$`, String.raw`$2f_{IF}$`, String.raw`$f_{LO}$`, String.raw`$f_{RF}/2$`], answer: 1, explain: String.raw`The wanted RF and image sit symmetrically $f_{IF}$ each side of the LO, so they are $2f_{IF}$ apart.` },
      { q: String.raw`Which cannot reject the image frequency?`, options: [String.raw`RF preselector`, String.raw`IF channel-selectivity filter`, String.raw`Image-reject mixer`, String.raw`Higher IF`], answer: 1, explain: String.raw`Once image and signal coincide at the IF they are inseparable; the IF filter rejects adjacent channels, not the image.` },
      { q: String.raw`Raising the IF frequency:`, options: [String.raw`Moves the image closer to the passband`, String.raw`Moves the image further out, easing rejection`, String.raw`Has no effect on the image`, String.raw`Eliminates the LO`], answer: 1, explain: String.raw`Image sits at $f_{RF}+2f_{IF}$, so a higher IF pushes it further from the passband — but hurts channel selectivity.` },
      { q: String.raw`An image-reject (Hartley) mixer cancels the image by:`, options: [String.raw`A high-Q IF filter`, String.raw`Quadrature LO mixing and phase-summing so the image adds 180° out`, String.raw`Increasing LO power`, String.raw`Doubling the IF`], answer: 1, explain: String.raw`The wanted signal adds constructively while the image adds $180^{\circ}$ out of phase and cancels after the $90^{\circ}$ shift and sum.` },
      { q: String.raw`The Weaver architecture differs from Hartley by:`, options: [String.raw`Using no LO`, String.raw`Replacing the analogue 90° phase shifter with a second quadrature mixing stage`, String.raw`Removing the mixers`, String.raw`Using a low-Q preselector`], answer: 1, explain: String.raw`Weaver avoids the wideband $90^{\circ}$ phase shifter by using a second quadrature downconversion stage.` },
      { q: String.raw`Dual conversion uses a high 1st IF primarily to:`, options: [String.raw`Improve channel selectivity`, String.raw`Push the first image far out for easy preselection`, String.raw`Reduce LO power`, String.raw`Increase noise figure`], answer: 1, explain: String.raw`A high 1st IF places the first image far from the passband; the low 2nd IF then provides sharp selectivity.` },
      { q: String.raw`The image-reject ratio (IRR) for a filtered front-end equals:`, options: [String.raw`The mixer conversion gain`, String.raw`The preselector attenuation at $f_{im}$`, String.raw`The LO phase noise`, String.raw`The IF bandwidth`], answer: 1, explain: String.raw`With flat active-stage gain, IRR $=10\log_{10}(G_{sig}/G_{im})$ reduces to the preselector's stopband attenuation at the image.` },
      { q: String.raw`In an image-reject mixer, residual image leakage comes from:`, options: [String.raw`LO harmonics only`, String.raw`I/Q amplitude and phase mismatch`, String.raw`IF filter ripple`, String.raw`Antenna mismatch`], answer: 1, explain: String.raw`Finite gain error $\varepsilon$ and phase error $\Delta\phi$ between I and Q leave a residual: $\text{IRR}\approx 10\log_{10}(4/(\varepsilon^2+\Delta\phi^2))$.` },
      { q: String.raw`Approximately what I/Q match gives ~40 dB IRR?`, options: [String.raw`10% amplitude, 10°`, String.raw`1% amplitude, 1°`, String.raw`50% amplitude, 45°`, String.raw`No match needed`], answer: 1, explain: String.raw`$\varepsilon=0.01$, $\Delta\phi\approx0.0175$ rad give $\text{IRR}\approx 10\log_{10}(4/(10^{-4}+3\times10^{-4}))\approx 40$ dB.` },
      { q: String.raw`Preselector difficulty for image rejection scales as:`, options: [String.raw`$f_{RF}/(2f_{IF})$`, String.raw`$2f_{IF}/f_{RF}$`, String.raw`$f_{LO}\cdot f_{IF}$`, String.raw`Independent of IF`], answer: 0, explain: String.raw`A low IF makes the image fractionally close to $f_{RF}$, so the required filter $Q$ grows as $f_{RF}/(2f_{IF})$.` },
      { q: String.raw`The image frequency is best described as:`, options: [String.raw`A spurious product the mixer generates`, String.raw`A real external frequency the mixer maps onto the IF`, String.raw`LO leakage`, String.raw`Thermal noise`], answer: 1, explain: String.raw`The image is a genuine RF present at the antenna; the mixer merely folds it onto the same IF as the wanted signal.` }
    ],
    numericals: [
      { q: String.raw`A receiver has $f_{RF}=100$ MHz, $f_{IF}=10.7$ MHz with high-side LO injection. Find the LO frequency, the image frequency, and confirm the image–signal spacing.`, solution: String.raw`<p><b>Formula.</b> High-side injection means $f_{LO}=f_{RF}+f_{IF}$; the image is on the far side of the LO at $f_{im}=f_{LO}+f_{IF}=f_{RF}+2f_{IF}$, and the spacing is $f_{im}-f_{RF}=2f_{IF}$.</p>
<p><b>Substitute.</b> $$f_{LO}=100+10.7,\qquad f_{im}=110.7+10.7,\qquad \Delta=2\times10.7.$$</p>
<p><b>Compute.</b> $f_{LO}=110.7$ MHz; $f_{im}=121.4$ MHz; spacing $\Delta=21.4$ MHz $=2f_{IF}$. Check: $f_{RF}+2f_{IF}=100+21.4=121.4$ MHz, consistent.</p>
<p><b>Explanation.</b> The wanted 100 MHz signal sits 10.7 MHz below the 110.7 MHz LO; its mirror image sits 10.7 MHz above the LO at 121.4 MHz. Both differ from the LO by 10.7 MHz, so both mix down to the 10.7 MHz IF — which is exactly why the 121.4 MHz image must be filtered out before the mixer.</p>` },
      { q: String.raw`For the same receiver ($f_{IF}=10.7$ MHz), state the image separation and compare the preselector difficulty at $f_{RF}=100$ MHz versus $f_{RF}=1000$ MHz.`, solution: String.raw`<p><b>Formula.</b> Image separation is always $2f_{IF}$, independent of $f_{RF}$. The fractional closeness of the image, which sets preselector difficulty, is $2f_{IF}/f_{RF}$, so difficulty scales as $f_{RF}/(2f_{IF})$.</p>
<p><b>Substitute.</b> $$2f_{IF}=2\times10.7,\qquad \frac{f_{RF}}{2f_{IF}}\Big|_{100}=\frac{100}{21.4},\qquad \frac{f_{RF}}{2f_{IF}}\Big|_{1000}=\frac{1000}{21.4}.$$</p>
<p><b>Compute.</b> Separation $=21.4$ MHz in both cases. Difficulty index: at 100 MHz, $100/21.4\approx 4.7$; at 1000 MHz, $1000/21.4\approx 46.7$ — about $10\times$ harder.</p>
<p><b>Explanation.</b> Although the absolute image offset (21.4 MHz) is the same, at 1 GHz the image is only ~2% away in fractional terms, demanding a far higher-$Q$ preselector. This is precisely why higher carrier frequencies push designers toward a higher IF or an image-reject mixer rather than brute-force RF filtering.</p>` },
      { q: String.raw`A design requires 55 dB of image rejection using only the RF preselector. What stopband attenuation must the filter provide at the image, and what does this imply?`, solution: String.raw`<p><b>Formula.</b> For a filtered front-end the image-reject ratio equals the preselector attenuation at the image: $\text{IRR}=A_{RF}(f_{im})$ dB. Thus the required filter attenuation at $f_{im}$ is $A_{RF}=\text{IRR}$.</p>
<p><b>Substitute.</b> $$A_{RF}(f_{im})=\text{IRR}=55\ \text{dB}.$$</p>
<p><b>Compute.</b> The preselector must attenuate by 55 dB at the offset $2f_{IF}$ from the passband centre. In voltage terms $|H(f_{im})|=10^{-55/20}\approx 1.78\times10^{-3}$, i.e. the image is passed at about 0.18% of the passband amplitude.</p>
<p><b>Explanation.</b> 55 dB is demanding for a single tuned stage when the image is fractionally close, so the plan likely needs a multi-pole filter, a higher IF to move the image out, or an image-reject mixer to supplement the filter. This ties the IF frequency plan directly to the achievable filter order.</p>` },
      { q: String.raw`Explain quantitatively why raising the IF from 10.7 MHz to 45 MHz (with $f_{RF}=100$ MHz) eases image rejection.`, solution: String.raw`<p><b>Formula.</b> The image offset is $2f_{IF}$ and its fractional distance from the passband is $2f_{IF}/f_{RF}$; a larger fraction lets a lower-order filter reach a given attenuation. Compare the two IF choices.</p>
<p><b>Substitute.</b> $$\frac{2f_{IF}}{f_{RF}}\Big|_{10.7}=\frac{21.4}{100},\qquad \frac{2f_{IF}}{f_{RF}}\Big|_{45}=\frac{90}{100}.$$</p>
<p><b>Compute.</b> At 10.7 MHz IF the image is 21.4% away (image at 121.4 MHz); at 45 MHz IF it is 90% away (image at 190 MHz). The image moves from 21.4 MHz to 90 MHz above the wanted signal — over $4\times$ further out fractionally.</p>
<p><b>Explanation.</b> Filter attenuation grows with the fractional offset from the passband, so pushing the image from 21% to 90% away means a much gentler, lower-$Q$, lower-order preselector achieves the same rejection. The cost is that a 45 MHz IF makes narrowband channel selectivity harder — the classic high-IF/low-IF trade that dual conversion resolves.</p>` },
      { q: String.raw`An image-reject mixer has I/Q amplitude mismatch of 2% ($\varepsilon=0.02$) and phase error $\Delta\phi=2^{\circ}$. Estimate the achievable IRR.`, solution: String.raw`<p><b>Formula.</b> For small mismatch the image-reject ratio is $\text{IRR}\approx 10\log_{10}\!\big(4/(\varepsilon^2+\Delta\phi^2)\big)$ dB, with $\varepsilon$ the fractional amplitude error and $\Delta\phi$ the phase error in radians.</p>
<p><b>Substitute.</b> $$\Delta\phi=2^{\circ}=2\times\frac{\pi}{180}=0.0349\ \text{rad},\qquad \text{IRR}\approx 10\log_{10}\frac{4}{(0.02)^2+(0.0349)^2}.$$</p>
<p><b>Compute.</b> $\varepsilon^2=4.0\times10^{-4}$, $\Delta\phi^2=1.22\times10^{-3}$; sum $=1.62\times10^{-3}$. Ratio $=4/1.62\times10^{-3}=2469$. $\text{IRR}=10\log_{10}(2469)\approx 33.9$ dB.</p>
<p><b>Explanation.</b> About 34 dB of rejection results — respectable but limited by the 2° phase error, which dominates over the 2% amplitude error here (phase term is ~3× larger). To reach 45-50 dB the I/Q paths would need trimming/calibration to well under 1° and 1%, which is why high-IRR integrated receivers rely on background calibration.</p>` }
    ],
    realWorld: String.raw`<p>Image rejection shaped the architecture of nearly every radio ever mass-produced. The classic FM broadcast <a href="#superheterodyne">superheterodyne</a> receiver uses a 10.7 MHz IF and a tuned RF front-end that tracks the desired station, so the image (21.4 MHz away) always lands on the preselector skirt. Communications and radar receivers overwhelmingly use <b>dual conversion</b>: a high first IF (often above the whole receive band) makes the first image trivial to filter, and a low second IF hosts a sharp crystal or SAW channel filter. Modern integrated transceivers — Wi-Fi, cellular, GPS, and SDR RFICs such as the <a href="#mixer">quadrature mixer</a>-based front-ends — abandon bulky RF preselectors in favour of on-chip <b>image-reject (Hartley/Weaver) mixers</b> or move to a <a href="#zero-if">zero-IF</a>/low-IF plan where the image is a co-channel or nearby-channel problem handled by I/Q matching and digital calibration. In all of these the image-reject ratio (IRR) is a headline spec: it caps how strong an adjacent-band interferer the receiver can tolerate before the image swamps the wanted channel, and it is why the <a href="#bpf">preselector BPF</a>, the IF plan, and the I/Q balance are co-designed rather than chosen independently.</p>`,
    related: ['mixer', 'intermediate-frequency', 'superheterodyne', 'bpf', 'zero-if']
  }
);
