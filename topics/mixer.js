// Mixer (Frequency Converter): the multiplying core of every superheterodyne front-end.
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'mixer',
    title: 'Mixer (Frequency Converter)',
    category: 'RF Front-End & Receivers',
    tags: ['mixer', 'frequency conversion', 'local oscillator', 'IF', 'image', 'spurs', 'conversion gain', 'Gilbert cell'],
    summary: String.raw`A mixer multiplies an RF signal by a local-oscillator tone to translate the signal to a new frequency; the trigonometric product-to-sum identity produces sum ($f_{RF}+f_{LO}$) and difference ($|f_{RF}-f_{LO}|$) terms, making it the frequency-translating heart of every superheterodyne transmitter and receiver.`,
    diagram: [
    {
      title: String.raw`The mixer as a multiplier: RF × LO → sum & difference`,
      svg: String.raw`<svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-mixer" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="14" y="60" fill="#9aa7b5">RF</text><text x="14" y="74" fill="#e6edf3" font-size="10">f<tspan baseline-shift="sub" font-size="8">RF</tspan></text>
        <line x1="40" y1="62" x2="150" y2="62" stroke="#9aa7b5" marker-end="url(#arr-mixer)"/>
        <circle cx="185" cy="80" r="34" fill="#1c232e" stroke="#4dabf7"/>
        <line x1="163" y1="58" x2="207" y2="102" stroke="#4dabf7"/><line x1="207" y1="58" x2="163" y2="102" stroke="#4dabf7"/>
        <text x="185" y="140" fill="#9aa7b5" text-anchor="middle" font-size="10">multiplier</text>
        <text x="185" y="176" fill="#ffa94d" text-anchor="middle">LO  f<tspan baseline-shift="sub" font-size="8">LO</tspan></text>
        <line x1="185" y1="160" x2="185" y2="116" stroke="#9aa7b5" marker-end="url(#arr-mixer)"/>
        <line x1="219" y1="80" x2="300" y2="80" stroke="#9aa7b5" marker-end="url(#arr-mixer)"/>
        <rect x="302" y="42" width="204" height="76" rx="6" fill="#1c232e" stroke="#63e6be"/>
        <text x="404" y="64" fill="#e6edf3" text-anchor="middle">IF output</text>
        <text x="404" y="84" fill="#63e6be" text-anchor="middle" font-size="11">f<tspan baseline-shift="sub" font-size="8">RF</tspan> − f<tspan baseline-shift="sub" font-size="8">LO</tspan>  (difference)</text>
        <text x="404" y="104" fill="#b197fc" text-anchor="middle" font-size="11">f<tspan baseline-shift="sub" font-size="8">RF</tspan> + f<tspan baseline-shift="sub" font-size="8">LO</tspan>  (sum)</text>
      </svg>`,
      caption: String.raw`A mixer multiplies RF by LO. The product-to-sum identity yields two new tones at the sum and difference frequencies; a following filter (the IF bandpass) selects one and rejects the other.`
    },
    {
      title: String.raw`Frequency-domain view: RF and image both fold to the same IF`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-mixer" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Two RF inputs map to one IF (the image problem)</text>
        <line x1="40" y1="150" x2="500" y2="150" stroke="#9aa7b5" marker-end="url(#arr2-mixer)"/>
        <text x="502" y="154" fill="#9aa7b5" font-size="10">f</text>
        <line x1="150" y1="150" x2="150" y2="70" stroke="#ffa94d"/><text x="150" y="60" fill="#ffa94d" text-anchor="middle" font-size="10">f<tspan baseline-shift="sub" font-size="8">LO</tspan></text>
        <line x1="230" y1="150" x2="230" y2="90" stroke="#4dabf7"/><text x="230" y="80" fill="#4dabf7" text-anchor="middle" font-size="10">f<tspan baseline-shift="sub" font-size="8">RF</tspan></text>
        <line x1="70" y1="150" x2="70" y2="90" stroke="#b197fc"/><text x="70" y="80" fill="#b197fc" text-anchor="middle" font-size="10">f<tspan baseline-shift="sub" font-size="8">im</tspan></text>
        <path d="M70,110 L150,110" stroke="#b197fc" stroke-dasharray="3 3"/><path d="M150,110 L230,110" stroke="#4dabf7" stroke-dasharray="3 3"/>
        <text x="110" y="104" fill="#b197fc" text-anchor="middle" font-size="9">f<tspan baseline-shift="sub" font-size="8">IF</tspan></text>
        <text x="190" y="104" fill="#4dabf7" text-anchor="middle" font-size="9">f<tspan baseline-shift="sub" font-size="8">IF</tspan></text>
        <rect x="330" y="120" width="176" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/>
        <text x="418" y="142" fill="#63e6be" text-anchor="middle" font-size="10">both land at</text>
        <text x="418" y="162" fill="#e6edf3" text-anchor="middle" font-size="11">f<tspan baseline-shift="sub" font-size="8">IF</tspan> = |f<tspan baseline-shift="sub" font-size="8">RF</tspan>−f<tspan baseline-shift="sub" font-size="8">LO</tspan>|</text>
      </svg>`,
      caption: String.raw`Both the wanted RF (at $f_{LO}+f_{IF}$) and its image (at $f_{LO}-f_{IF}$) sit one IF away from the LO on opposite sides, so both down-convert to the same IF. Nothing after the mixer can separate them — an image-reject filter or image-reject mixer must act before conversion.`
    },
    {
      title: String.raw`Double-balanced diode ring: port isolation by symmetry`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-mixer" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Double-balanced diode-ring mixer</text>
        <rect x="60" y="70" width="70" height="70" rx="6" fill="#1c232e" stroke="#4dabf7"/>
        <text x="95" y="100" fill="#e6edf3" text-anchor="middle" font-size="10">RF</text><text x="95" y="116" fill="#9aa7b5" text-anchor="middle" font-size="9">balun</text>
        <rect x="235" y="55" width="110" height="100" rx="6" fill="#1c232e" stroke="#63e6be"/>
        <text x="290" y="90" fill="#e6edf3" text-anchor="middle" font-size="10">4-diode ring</text>
        <text x="290" y="108" fill="#9aa7b5" text-anchor="middle" font-size="9">▷|  |◁</text>
        <text x="290" y="126" fill="#9aa7b5" text-anchor="middle" font-size="9">◁|  |▷</text>
        <rect x="235" y="168" width="110" height="34" rx="6" fill="#1c232e" stroke="#ffa94d"/>
        <text x="290" y="190" fill="#ffa94d" text-anchor="middle" font-size="10">LO balun</text>
        <rect x="450" y="70" width="70" height="70" rx="6" fill="#1c232e" stroke="#b197fc"/>
        <text x="485" y="100" fill="#e6edf3" text-anchor="middle" font-size="10">IF</text><text x="485" y="116" fill="#9aa7b5" text-anchor="middle" font-size="9">balun</text>
        <line x1="130" y1="105" x2="235" y2="105" stroke="#9aa7b5" marker-end="url(#arr3-mixer)"/>
        <line x1="345" y1="105" x2="450" y2="105" stroke="#9aa7b5" marker-end="url(#arr3-mixer)"/>
        <line x1="290" y1="155" x2="290" y2="168" stroke="#9aa7b5" marker-end="url(#arr3-mixer)"/>
        <text x="270" y="200" fill="#9aa7b5" text-anchor="middle" font-size="9">baluns give RF/LO/IF port isolation; LO switches the ring</text>
      </svg>`,
      caption: String.raw`A passive double-balanced mixer: the LO drives a ring of four diodes that commutate (switch) the RF signal, effectively multiplying it by a square wave. The input baluns make the structure symmetric, so RF and LO leak little into the IF port — this port-to-port isolation is the defining benefit of the balanced topology.`
    }
    ],
    prerequisites: ['frequency-spectrum', 'superheterodyne'],
    intro: String.raw`<p><b>Why does the mixer exist?</b> A radio wants to process a signal at a convenient, fixed frequency — but the signals of interest arrive scattered across the spectrum at whatever carrier the transmitter chose. Amplifiers and filters that are cheap, selective and stable can only be built well at one frequency. The mixer is the device that bridges this gap: it <i>translates</i> a signal from one frequency to another without changing the information it carries. Without frequency translation there is no superheterodyne receiver, no channel tuning by moving a local oscillator, no way to build a single high-quality IF filter that serves every channel. The mixer is what lets us choose the frequency at which we do the hard work.</p>
<p>A <b>mixer</b> (or <b>frequency converter</b>) takes an RF input and a <b>local-oscillator (LO)</b> tone and produces outputs at the <b>sum</b> and <b>difference</b> of their frequencies. It does this by <i>multiplying</i> the two signals — and the trigonometric product-to-sum identity $\cos a\cos b=\tfrac12[\cos(a-b)+\cos(a+b)]$ tells us exactly what comes out. Mastering the mixer means understanding four things deeply: (1) the <b>multiplication</b> that generates $f_{RF}\pm f_{LO}$; (2) <b>up- vs down-conversion</b> and the choice of intermediate frequency; (3) the <b>image problem</b>, where two different RF inputs collapse onto the same IF; and (4) the non-idealities — <b>conversion loss/gain, port isolation and LO leakage, spurious products, and linearity (IP3)</b> — that separate a textbook multiplier from a real component.</p>`,
    sections: [
      {
        h: 'What a mixer does: multiplication in the time domain',
        html: String.raw`<p>An ideal mixer forms the <b>product</b> of its two inputs. Feed it an RF tone $v_{RF}(t)=A\cos(2\pi f_{RF}t)$ and an LO tone $v_{LO}(t)=B\cos(2\pi f_{LO}t)$; the output is proportional to</p>
        <p>$$v_{IF}(t)\propto A B\,\cos(2\pi f_{RF}t)\cos(2\pi f_{LO}t).$$</p>
        <p>Using the product-to-sum identity $\cos a\cos b=\tfrac12[\cos(a-b)+\cos(a+b)]$,</p>
        <p>$$v_{IF}(t)\propto \tfrac{AB}{2}\Big[\cos\!\big(2\pi(f_{RF}-f_{LO})t\big)+\cos\!\big(2\pi(f_{RF}+f_{LO})t\big)\Big].$$</p>
        <p>So a single multiplication produces two brand-new tones: one at the <b>difference</b> $|f_{RF}-f_{LO}|$ and one at the <b>sum</b> $f_{RF}+f_{LO}$. Neither of these frequencies was present at the input — the mixer is a fundamentally <b>nonlinear (time-varying)</b> device, which is why a purely linear amplifier can never translate frequency.</p>
        <div class="callout tip"><b>Key intuition:</b> multiplication in time is what creates new frequencies. Anything that multiplies two signals — a switch toggled by the LO, a diode's curved I–V, a transistor whose gain is modulated by the LO — acts as a mixer. The "difference" term is what a downconverter keeps; the "sum" term is what an upconverter keeps.</div>`
      },
      {
        h: 'Up-conversion vs down-conversion, and choosing the IF',
        html: String.raw`<p>The <b>intermediate frequency (IF)</b> is whichever product you decide to keep with a filter:</p>
        <ul>
          <li><b>Down-conversion</b> keeps the <i>difference</i>, $f_{IF}=|f_{RF}-f_{LO}|$. A receiver moves an incoming high RF down to a lower, fixed IF where selective filtering and gain are easy. Tuning to a different channel just means moving the LO.</li>
          <li><b>Up-conversion</b> keeps the <i>sum</i> (or difference upward), placing a baseband/IF signal onto a high RF carrier for transmission. A transmitter up-converts from IF to RF.</li>
        </ul>
        <p>For a downconverter the LO can sit on either side of the RF:</p>
        <ul>
          <li><b>High-side LO</b> ($f_{LO}=f_{RF}+f_{IF}$): the difference is $f_{LO}-f_{RF}=f_{IF}$. The spectrum is <i>inverted</i> (mirror-imaged) at IF.</li>
          <li><b>Low-side LO</b> ($f_{LO}=f_{RF}-f_{IF}$): the difference is $f_{RF}-f_{LO}=f_{IF}$. The spectrum is <i>not</i> inverted.</li>
        </ul>
        <p>The magnitude of the IF is the same either way, but the choice sets where the <b>image</b> falls and whether the recovered spectrum is inverted. A higher IF pushes the image far away (easy to filter) but demands a higher-frequency, more expensive IF stage — the classic IF trade-off explored in the superheterodyne architecture.</p>`
      },
      {
        h: 'The image problem',
        html: String.raw`<p>Down-conversion has a built-in ambiguity. The IF selects everything a distance $f_{IF}$ from the LO — but there are <i>two</i> such places: one above the LO and one below. If the wanted signal is at $f_{RF}=f_{LO}+f_{IF}$, then a completely different signal at the <b>image frequency</b></p>
        <p>$$f_{im}=f_{LO}-f_{IF}=f_{RF}-2f_{IF}$$</p>
        <p>also produces $|f_{im}-f_{LO}|=f_{IF}$ and lands on top of the wanted signal at IF. The two are separated by $2f_{IF}$ in RF but are <b>indistinguishable after the mixer</b> — no IF filter can pull them apart, because they occupy the exact same IF band.</p>
        <p>Because the image carries its own noise and possibly its own interferer, it must be dealt with <i>before</i> conversion. Three cures:</p>
        <ul>
          <li><b>Image-reject (preselect) filter</b> in front of the mixer, attenuating the image band. Easier when $f_{IF}$ is large (image is $2f_{IF}$ away).</li>
          <li><b>Image-reject mixer</b> (Hartley/Weaver): two mixers driven by quadrature LOs cancel the image by phase.</li>
          <li><b>Zero-IF (direct conversion)</b>: with $f_{IF}=0$ the image <i>is</i> the wanted signal's own mirror, handled by I/Q processing — no external image filter needed.</li>
        </ul>
        <div class="callout tip"><b>Watch the sign:</b> the image sits on the opposite side of the LO from the wanted RF, a distance $2f_{IF}$ away. High-side and low-side LO simply swap which side the image is on.</div>`
      },
      {
        h: 'Conversion gain/loss and mixer types',
        html: String.raw`<p><b>Conversion gain</b> is the ratio of output IF power (or voltage) to input RF power — the mixer's own gain, measured between the two different frequencies. Mixers split into two families:</p>
        <ul>
          <li><b>Passive mixers</b> (diode ring, passive FET) have no gain device, so they show <b>conversion loss</b>. A single-diode mixer loses more; a well-driven <b>double-balanced diode ring</b> typically has $\approx 6$–$7$ dB conversion loss. They excel at linearity, bandwidth and dynamic range, and need a strong LO to switch the diodes hard.</li>
          <li><b>Active mixers</b> (the <b>Gilbert cell</b>) use transconductance stages and switching pairs to provide <b>conversion gain</b> (positive dB), lower LO drive and easy integration, at the cost of more added noise and usually worse large-signal linearity than a diode ring.</li>
        </ul>
        <p>A <b>double-balanced</b> topology uses baluns on both RF and LO ports so that, by symmetry, the RF and LO fundamentals cancel at the IF port — giving strong <b>port-to-port isolation</b>. This suppresses LO leakage and even-order spurs at the expense of needing baluns and more LO power. The <b>Gilbert cell</b> is the active double-balanced mixer of choice in ICs.</p>`
      },
      {
        h: 'Ports, isolation and LO leakage',
        html: String.raw`<p>Every mixer has three ports — <b>RF, LO, IF</b> — and in the real world energy leaks between them. Two figures of merit:</p>
        <ul>
          <li><b>LO-to-RF isolation:</b> LO power that leaks back out the RF (antenna) port. This re-radiates the strong LO (an emissions/regulatory problem) and, in direct-conversion receivers, the leaked LO can <b>self-mix</b> back down to a <b>DC offset</b> at baseband.</li>
          <li><b>LO-to-IF and RF-to-IF isolation:</b> LO and RF fundamentals appearing at the IF output, which the IF filter must then remove.</li>
        </ul>
        <p>Balanced and double-balanced mixers exist largely to provide this isolation by symmetry: the leaked fundamentals appear as common-mode signals that cancel in the balanced combiner. LO leakage and its self-mixing DC offset are among the dominant impairments in zero-IF receivers.</p>`
      },
      {
        h: 'Spurious products, noise and linearity (IP3)',
        html: String.raw`<p>A real mixer is not a clean multiplier. Because the LO switching is rich in harmonics and the RF path is mildly nonlinear, the output contains a whole lattice of <b>spurious mixing products</b></p>
        <p>$$f_{spur}=\lvert m\,f_{LO}\pm n\,f_{RF}\rvert,\qquad m,n=0,1,2,\dots$$</p>
        <p>The wanted term is the $(m,n)=(1,1)$ product; all other integer combinations of the LO and RF (and their harmonics) can fall in or near the IF band. Designers use a <b>spur chart</b> (an $m\times n$ table) to pick an LO/IF plan that keeps strong low-order spurs out of the IF passband.</p>
        <p>Two more real-world limits:</p>
        <ul>
          <li><b>Mixer noise</b> adds to the system noise figure; for a passive mixer the conversion loss appears almost directly as noise figure, so a mixer wants a low-noise amplifier (LNA) ahead of it to set the front-end sensitivity.</li>
          <li><b>Linearity (third-order intercept, IP3):</b> two strong tones at $f_1,f_2$ create third-order intermodulation products at $2f_1-f_2$ and $2f_2-f_1$ that can land in-band. The <b>input third-order intercept point (IIP3)</b> quantifies how much large-signal power the mixer tolerates before intermodulation dominates — a key reason diode rings are favoured for high-dynamic-range front-ends.</li>
        </ul>
        <div class="callout tip"><b>Design tension:</b> a mixer must be nonlinear enough to multiply, yet linear enough not to generate in-band intermodulation. Balanced topologies, high LO drive and generous IIP3 are how that tension is managed.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Multiplication makes new frequencies:</b> $\cos a\cos b=\tfrac12[\cos(a-b)+\cos(a+b)]$, so a mixer outputs the sum $f_{RF}+f_{LO}$ and difference $|f_{RF}-f_{LO}|$; a filter keeps one as the IF.</li>
<li><b>Up vs down and IF choice:</b> down-conversion keeps the difference (receiver), up-conversion keeps the sum (transmitter); high-side vs low-side LO gives the same $|f_{IF}|$ but sets image location and spectral inversion.</li>
<li><b>The image problem:</b> $f_{im}=f_{LO}\mp f_{IF}$ folds onto the wanted signal at IF and cannot be removed after the mixer — cured by a preselect filter, an image-reject mixer, or zero-IF I/Q.</li>
<li><b>Types and conversion gain:</b> passive diode rings show $\approx6$–$7$ dB conversion loss but high linearity; active Gilbert cells give conversion gain at higher noise; double-balanced topologies give port isolation by symmetry.</li>
<li><b>Real-world limits:</b> LO leakage/self-mixing DC offsets, spurious products $|m f_{LO}\pm n f_{RF}|$, mixer noise adding to NF, and IIP3 setting large-signal handling.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Frequency_mixer" target="_blank" rel="noopener">Wikipedia — Frequency mixer</a> — the canonical overview of sum/difference products, single- and double-balanced diode-ring topologies, conversion loss and spurious terms, with links out to every sub-topic.</li>
<li><a href="https://markimicrowave.com/technical-resources/white-papers/mixer-basics-primer/" target="_blank" rel="noopener">Marki Microwave — Mixer Basics Primer</a> — an authoritative vendor tutorial that rigorously defines conversion loss, L-R/L-I/R-I isolation, single- and two-tone intermodulation spurs, 1 dB compression and IP3 with real device data.</li>
<li><a href="https://www.minicircuits.com/app/AN00-009.pdf" target="_blank" rel="noopener">Mini-Circuits AN00-009 — Understanding Mixers, Terms Defined and Measuring Performance</a> — a concise application note fixing signal-naming conventions and the measurement methods for conversion gain/loss and two-tone third-order intermodulation.</li>
<li><a href="https://www.electronics-notes.com/articles/radio/rf-mixer/gilbert-cell-rf-mixer.php" target="_blank" rel="noopener">Electronics Notes — Gilbert cell RF mixer</a> — a focused explanation of the active double-balanced Gilbert cell: its symmetry-based port cancellation, switching vs analogue modes, and why it dominates RFIC implementations.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`A mixer multiplies RF by LO; the identity $\cos a\cos b=\tfrac12[\cos(a-b)+\cos(a+b)]$ gives outputs at $f_{RF}+f_{LO}$ and $|f_{RF}-f_{LO}|$.`,
      String.raw`Down-conversion keeps the difference ($f_{IF}=|f_{RF}-f_{LO}|$, receiver); up-conversion keeps the sum (transmitter).`,
      String.raw`High-side LO ($f_{LO}=f_{RF}+f_{IF}$) inverts the spectrum; low-side LO ($f_{LO}=f_{RF}-f_{IF}$) does not — same $|f_{IF}|$ either way.`,
      String.raw`The image at $f_{im}=f_{LO}\mp f_{IF}$ (i.e. $f_{RF}\mp 2f_{IF}$) down-converts to the same IF and cannot be separated after the mixer.`,
      String.raw`Fix the image before the mixer: preselect/image-reject filter, image-reject (Hartley/Weaver) mixer, or zero-IF I/Q processing.`,
      String.raw`Passive mixers (diode ring) have conversion loss ($\approx6$–$7$ dB for a double-balanced ring); active Gilbert cells provide conversion gain.`,
      String.raw`A mixer has RF, LO and IF ports; balanced/double-balanced topologies give port-to-port isolation by symmetry, cutting LO leakage.`,
      String.raw`LO leakage out the RF port can self-mix to a DC offset in direct-conversion (zero-IF) receivers.`,
      String.raw`Spurious products appear at $|m f_{LO}\pm n f_{RF}|$; a spur chart guides LO/IF planning to keep low-order spurs out of the IF band.`,
      String.raw`Mixer noise adds to the system NF (an LNA precedes the mixer) and IIP3 sets the large-signal/intermodulation limit.`
    ],
    equations: [
      {
        title: 'Product-to-sum: the sum and difference outputs',
        tex: String.raw`$$\cos(2\pi f_{RF}t)\cos(2\pi f_{LO}t)=\tfrac12\cos\!\big(2\pi(f_{RF}-f_{LO})t\big)+\tfrac12\cos\!\big(2\pi(f_{RF}+f_{LO})t\big)$$`,
        derivation: String.raw`<p><b>Where we start.</b> An ideal mixer forms the product of an RF tone and an LO tone. We want to know exactly which frequencies appear at the output, so we expand the product of two cosines into a sum of cosines.</p>
        <p><b>Step 1 — write the two angle-sum identities.</b> From the addition formulas for cosine,</p>
        $$\cos(a-b)=\cos a\cos b+\sin a\sin b,$$
        $$\cos(a+b)=\cos a\cos b-\sin a\sin b.$$
        <p><b>Step 2 — add them.</b> Adding these two equations cancels the $\sin a\sin b$ terms and doubles the $\cos a\cos b$ term:</p>
        $$\cos(a-b)+\cos(a+b)=2\cos a\cos b.$$
        <p><b>Step 3 — solve for the product.</b> Dividing by 2 gives the product-to-sum identity</p>
        $$\cos a\cos b=\tfrac12\big[\cos(a-b)+\cos(a+b)\big].$$
        <p><b>Step 4 — substitute the mixer's angles.</b> Let $a=2\pi f_{RF}t$ and $b=2\pi f_{LO}t$:</p>
        $$\cos(2\pi f_{RF}t)\cos(2\pi f_{LO}t)=\tfrac12\cos\!\big(2\pi(f_{RF}-f_{LO})t\big)+\tfrac12\cos\!\big(2\pi(f_{RF}+f_{LO})t\big).$$
        <p><b>Result.</b> Two tones emerge: the difference $f_{RF}-f_{LO}$ and the sum $f_{RF}+f_{LO}$, each at half the amplitude. Sanity check: no other frequencies appear from an ideal product — a single multiplication cannot create a third fundamental. This is the whole basis of frequency conversion.</p>`
      },
      {
        title: 'Intermediate frequency (down-conversion)',
        tex: String.raw`$$f_{IF}=\lvert f_{RF}-f_{LO}\rvert$$`,
        derivation: String.raw`<p><b>Where we start.</b> Of the two tones a mixer produces, a downconverter keeps only the lower one. We derive the IF a receiver actually sees.</p>
        <p><b>Step 1 — list the two products.</b> From the product-to-sum result the mixer outputs tones at $f_{RF}+f_{LO}$ (sum) and $f_{RF}-f_{LO}$ (difference). The sum is at roughly twice the RF and is far away; the following IF bandpass filter rejects it.</p>
        <p><b>Step 2 — keep the difference.</b> The filter passes the difference term, whose frequency is $f_{RF}-f_{LO}$. A physical frequency must be non-negative, and the cosine is even ($\cos(-x)=\cos x$), so a negative difference simply reflects to its magnitude.</p>
        <p><b>Step 3 — take the magnitude.</b> Whether the LO is below the RF (low-side) or above it (high-side), the observed IF is</p>
        $$f_{IF}=\lvert f_{RF}-f_{LO}\rvert.$$
        <p><b>Result.</b> Sanity check with $f_{RF}=100$ MHz and $f_{LO}=90$ MHz: $f_{IF}=|100-90|=10$ MHz. With a high-side LO of $110$ MHz the IF is again $|100-110|=10$ MHz — the same magnitude, but the sign flip means the spectrum is inverted. The magnitude is set; the sign (side) sets inversion and image placement.</p>`
      },
      {
        title: 'Image frequency',
        tex: String.raw`$$f_{im}=f_{LO}\mp f_{IF}=f_{RF}\mp 2f_{IF}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The IF selects any input a distance $f_{IF}$ from the LO. Because "a distance $f_{IF}$" has two solutions, a second RF frequency also converts to the IF. We find it.</p>
        <p><b>Step 1 — state the down-conversion condition.</b> Any input frequency $f_x$ converts to the IF provided $|f_x-f_{LO}|=f_{IF}$. Removing the absolute value gives two solutions,</p>
        $$f_x=f_{LO}+f_{IF}\quad\text{or}\quad f_x=f_{LO}-f_{IF}.$$
        <p><b>Step 2 — identify wanted vs image.</b> Suppose the wanted signal uses the upper solution (low-side LO), $f_{RF}=f_{LO}+f_{IF}$. The other solution is the unwanted <b>image</b>,</p>
        $$f_{im}=f_{LO}-f_{IF}.$$
        <p><b>Step 3 — relate the image to the RF.</b> Substitute $f_{LO}=f_{RF}-f_{IF}$ into the image expression:</p>
        $$f_{im}=(f_{RF}-f_{IF})-f_{IF}=f_{RF}-2f_{IF}.$$
        <p>For a high-side LO the roles swap and $f_{im}=f_{RF}+2f_{IF}$, hence the $\mp$ sign.</p>
        <p><b>Result.</b> The image sits on the opposite side of the LO from the wanted signal, a distance $2f_{IF}$ from the RF. Sanity check: $f_{RF}=100$ MHz, $f_{LO}=90$ MHz gives $f_{IF}=10$ MHz and $f_{im}=100-2(10)=80$ MHz; indeed $|80-90|=10$ MHz. Both 100 MHz and 80 MHz land at 10 MHz IF.</p>`
      },
      {
        title: 'Spurious mixing products',
        tex: String.raw`$$f_{spur}=\lvert m\,f_{LO}\pm n\,f_{RF}\rvert,\qquad m,n=0,1,2,\dots$$`,
        derivation: String.raw`<p><b>Where we start.</b> A real mixer is not a perfect multiplier; its transfer characteristic is a nonlinear function of the input, and (especially in switching mixers) the LO is rich in harmonics. We expand this to see every frequency that can appear.</p>
        <p><b>Step 1 — model the nonlinearity as a power series.</b> Let the combined drive be $x(t)=v_{RF}(t)+v_{LO}(t)$. A general memoryless nonlinearity gives an output $y=a_1x+a_2x^2+a_3x^3+\cdots$. Each power $x^k$ expands into products of the RF and LO terms.</p>
        <p><b>Step 2 — expand a product term.</b> A representative term $a_2\,v_{RF}v_{LO}$ contains $\cos(2\pi f_{RF}t)\cos(2\pi f_{LO}t)$, which by the product-to-sum identity yields $f_{RF}\pm f_{LO}$. Higher powers ($x^3,x^4,\dots$) and LO harmonics generate $\cos(2\pi\,n f_{RF}t)\cos(2\pi\,m f_{LO}t)$ terms.</p>
        <p><b>Step 3 — collect the general product.</b> Each such term, expanded, produces tones at every integer combination of the two fundamentals:</p>
        $$f_{spur}=\lvert m\,f_{LO}\pm n\,f_{RF}\rvert,\qquad m,n\in\{0,1,2,\dots\}.$$
        <p><b>Step 4 — identify the wanted product.</b> The desired conversion is the $(m,n)=(1,1)$ term giving $|f_{LO}\pm f_{RF}|$; every other $(m,n)$ is a spur.</p>
        <p><b>Result.</b> The output is a two-dimensional lattice of spurs. Sanity check: the half-IF spur, from $(m,n)=(2,2)$, sits at $|2f_{LO}-2f_{RF}|=2f_{IF}$ region behaviour and low-order spurs like $(2,1)$ at $|2f_{LO}-f_{RF}|$ are the ones a spur chart tracks to keep them out of the IF passband.</p>`
      },
      {
        title: 'Conversion loss of a passive mixer',
        tex: String.raw`$$L_{c}\,[\text{dB}]=10\log_{10}\!\frac{P_{RF,in}}{P_{IF,out}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A passive mixer has no gain element, so IF power is always less than the RF power that drove it. We define and quantify that conversion loss.</p>
        <p><b>Step 1 — define conversion loss.</b> Conversion loss is the ratio of input RF power (at $f_{RF}$) to the wanted output IF power (at $f_{IF}$), expressed in dB:</p>
        $$L_c=10\log_{10}\frac{P_{RF,in}}{P_{IF,out}}.$$
        <p><b>Step 2 — account for the split.</b> An ideal multiplier splits the RF into a sum and a difference term of equal amplitude; each carries a quarter of the power (half amplitude squared), so keeping only the difference term costs $10\log_{10}(4)=6.0$ dB — the theoretical floor for a single-sideband product.</p>
        <p><b>Step 3 — add real losses.</b> Diode series resistance, balun insertion loss and imperfect LO switching add roughly $0.5$–$1$ dB, giving a practical double-balanced diode-ring loss of about $6$–$7$ dB.</p>
        <p><b>Step 4 — relate to noise figure.</b> For a passive mixer the noise figure is approximately equal to the conversion loss, $NF\approx L_c$, because the lossy network attenuates signal while thermal noise stays at $kT$.</p>
        <p><b>Result.</b> Sanity check: if $P_{RF,in}=-10$ dBm and the ring has $L_c=6.5$ dB, then $P_{IF,out}=-16.5$ dBm and the mixer contributes $\approx6.5$ dB to the front-end noise figure. This is exactly why an LNA precedes the mixer to set sensitivity.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What operation does an ideal mixer perform?`, back: String.raw`Multiplication of the RF and LO signals in the time domain, producing sum and difference frequencies.` },
      { front: String.raw`Which trig identity governs mixing?`, back: String.raw`$\cos a\cos b=\tfrac12[\cos(a-b)+\cos(a+b)]$ — giving outputs at $f_{RF}-f_{LO}$ and $f_{RF}+f_{LO}$.` },
      { front: String.raw`What is the IF in down-conversion?`, back: String.raw`The difference frequency: $f_{IF}=|f_{RF}-f_{LO}|$.` },
      { front: String.raw`Difference between up- and down-conversion?`, back: String.raw`Down-conversion keeps the difference term (receiver, RF→IF); up-conversion keeps the sum term (transmitter, IF→RF).` },
      { front: String.raw`Where is the image frequency?`, back: String.raw`On the opposite side of the LO from the wanted RF: $f_{im}=f_{LO}\mp f_{IF}=f_{RF}\mp 2f_{IF}$.` },
      { front: String.raw`Why can't an IF filter remove the image?`, back: String.raw`The image down-converts to the exact same IF band as the wanted signal; they overlap after the mixer, so the image must be filtered before conversion.` },
      { front: String.raw`Typical conversion loss of a double-balanced diode ring?`, back: String.raw`About 6–7 dB (a 6 dB single-sideband floor plus diode/balun losses).` },
      { front: String.raw`What is a Gilbert cell?`, back: String.raw`An active, double-balanced transconductance mixer used in ICs; it provides conversion gain and needs low LO drive.` },
      { front: String.raw`What are the three mixer ports?`, back: String.raw`RF, LO and IF. Isolation between them limits LO leakage and RF/LO feedthrough to the IF.` },
      { front: String.raw`What problem does LO-to-RF leakage cause in zero-IF receivers?`, back: String.raw`The leaked LO self-mixes back to DC, creating a DC offset at baseband.` },
      { front: String.raw`Formula for spurious mixing products?`, back: String.raw`$f_{spur}=|m f_{LO}\pm n f_{RF}|$ for integer $m,n$; the wanted term is $(m,n)=(1,1)$.` },
      { front: String.raw`Why does a double-balanced mixer give port isolation?`, back: String.raw`Baluns make the structure symmetric so the RF and LO fundamentals appear common-mode and cancel at the IF port.` },
      { front: String.raw`How does conversion loss relate to noise figure in a passive mixer?`, back: String.raw`$NF\approx L_c$ — the loss appears almost directly as noise figure, so an LNA is placed ahead of the mixer.` },
      { front: String.raw`What does mixer IIP3 quantify?`, back: String.raw`The input power at which extrapolated third-order intermodulation products equal the wanted output — the large-signal linearity limit.` }
    ],
    mcqs: [
      { q: String.raw`An ideal mixer produces outputs at:`, options: [String.raw`Only $f_{RF}$`, String.raw`$f_{RF}+f_{LO}$ and $|f_{RF}-f_{LO}|$`, String.raw`$f_{RF}\times f_{LO}$ (a single tone)`, String.raw`Only $f_{LO}$`], answer: 1, explain: String.raw`The product-to-sum identity gives sum and difference tones: $f_{RF}+f_{LO}$ and $|f_{RF}-f_{LO}|$.` },
      { q: String.raw`For $f_{RF}=100$ MHz and $f_{LO}=90$ MHz, the down-converted IF is:`, options: [String.raw`10 MHz`, String.raw`90 MHz`, String.raw`190 MHz`, String.raw`100 MHz`], answer: 0, explain: String.raw`$f_{IF}=|f_{RF}-f_{LO}|=|100-90|=10$ MHz.` },
      { q: String.raw`With $f_{RF}=100$ MHz, $f_{LO}=90$ MHz and $f_{IF}=10$ MHz, the image frequency is:`, options: [String.raw`110 MHz`, String.raw`80 MHz`, String.raw`90 MHz`, String.raw`120 MHz`], answer: 1, explain: String.raw`$f_{im}=f_{RF}-2f_{IF}=100-20=80$ MHz; indeed $|80-90|=10$ MHz.` },
      { q: String.raw`Down-conversion in a receiver keeps which mixer product?`, options: [String.raw`The sum term`, String.raw`The difference term`, String.raw`The LO harmonic`, String.raw`The RF fundamental`], answer: 1, explain: String.raw`A downconverter keeps the difference $|f_{RF}-f_{LO}|$ as the IF; up-conversion keeps the sum.` },
      { q: String.raw`A double-balanced diode-ring mixer typically has:`, options: [String.raw`Conversion gain of +6 dB`, String.raw`Conversion loss of about 6–7 dB`, String.raw`Zero conversion loss`, String.raw`Conversion loss of 30 dB`], answer: 1, explain: String.raw`Passive rings show conversion loss, about 6–7 dB (a 6 dB SSB floor plus diode/balun loss).` },
      { q: String.raw`The image frequency cannot be removed after the mixer because:`, options: [String.raw`It is at DC`, String.raw`It down-converts to the same IF band as the wanted signal`, String.raw`It is a harmonic of the LO`, String.raw`The IF filter has infinite Q`], answer: 1, explain: String.raw`The image lands in the identical IF band, overlapping the wanted signal, so it must be filtered before conversion.` },
      { q: String.raw`Which mixer provides conversion gain and is common in ICs?`, options: [String.raw`Single-diode mixer`, String.raw`Double-balanced diode ring`, String.raw`Gilbert cell (active)`, String.raw`Resistive FET mixer`], answer: 2, explain: String.raw`The Gilbert cell is an active double-balanced mixer offering conversion gain and low LO drive.` },
      { q: String.raw`Spurious mixing products occur at frequencies:`, options: [String.raw`$m f_{LO}$ only`, String.raw`$|m f_{LO}\pm n f_{RF}|$ for integer $m,n$`, String.raw`$f_{RF}/n$`, String.raw`$f_{LO}\times f_{RF}$`], answer: 1, explain: String.raw`Nonlinearity and LO harmonics create a lattice of tones at $|m f_{LO}\pm n f_{RF}|$; the wanted one is $(1,1)$.` },
      { q: String.raw`In a direct-conversion (zero-IF) receiver, LO-to-RF leakage most directly causes:`, options: [String.raw`Image aliasing`, String.raw`A DC offset from self-mixing`, String.raw`Increased conversion gain`, String.raw`Higher IF frequency`], answer: 1, explain: String.raw`Leaked LO reflects and self-mixes to DC, producing a baseband DC offset.` },
      { q: String.raw`Using a high-side LO ($f_{LO}=f_{RF}+f_{IF}$) instead of low-side:`, options: [String.raw`Changes the IF magnitude`, String.raw`Inverts the IF spectrum and moves the image to the other side`, String.raw`Eliminates the image entirely`, String.raw`Removes all spurs`], answer: 1, explain: String.raw`The IF magnitude is unchanged, but the sign flip inverts the spectrum and places the image on the opposite side of the LO.` },
      { q: String.raw`For a passive mixer, the noise figure is approximately equal to:`, options: [String.raw`0 dB`, String.raw`The conversion loss $L_c$`, String.raw`The LO power`, String.raw`The IIP3`], answer: 1, explain: String.raw`A lossy passive mixer has $NF\approx L_c$, which is why an LNA precedes it to set sensitivity.` },
      { q: String.raw`Why is a mixer necessarily a nonlinear (time-varying) device?`, options: [String.raw`It amplifies linearly`, String.raw`A linear device cannot create new frequencies; multiplication does`, String.raw`It only filters`, String.raw`It stores charge`], answer: 1, explain: String.raw`Frequency translation requires generating tones not present at the input, which a purely linear (superposition-obeying) device cannot do.` }
    ],
    numericals: [
      { q: String.raw`A receiver has $f_{RF}=100$ MHz and a low-side LO $f_{LO}=90$ MHz. Find (a) the IF, (b) the sum term, and (c) the image frequency.`, solution: String.raw`<p><b>Formula.</b> Down-conversion keeps the difference $f_{IF}=|f_{RF}-f_{LO}|$; the mixer also produces the sum $f_{RF}+f_{LO}$; the image is $f_{im}=f_{RF}-2f_{IF}$ (opposite side of the LO for a low-side LO).</p>
<p><b>Substitute.</b> $$f_{IF}=|100-90|\text{ MHz},\quad f_{sum}=100+90\text{ MHz},\quad f_{im}=100-2(10)\text{ MHz}.$$</p>
<p><b>Compute.</b> $f_{IF}=10$ MHz; $f_{sum}=190$ MHz (removed by the IF filter); $f_{im}=80$ MHz. Check: $|80-90|=10$ MHz, so 80 MHz also lands at the 10 MHz IF.</p>
<p><b>Explanation.</b> The wanted 100 MHz and its image at 80 MHz both convert to 10 MHz; they are $2f_{IF}=20$ MHz apart in RF. A preselect filter before the mixer must reject the 80 MHz image, because after conversion the two are inseparable.</p>` },
      { q: String.raw`The same front-end ($f_{RF}=100$ MHz) is now tuned with a high-side LO to keep $f_{IF}=10$ MHz. Find the required $f_{LO}$ and the resulting image frequency, and state the spectral effect.`, solution: String.raw`<p><b>Formula.</b> For a high-side LO, $f_{LO}=f_{RF}+f_{IF}$; the down-converted IF is $f_{IF}=f_{LO}-f_{RF}$; the image sits at $f_{im}=f_{RF}+2f_{IF}$ (opposite side of the LO from the RF).</p>
<p><b>Substitute.</b> $$f_{LO}=100+10\text{ MHz},\qquad f_{im}=100+2(10)\text{ MHz}.$$</p>
<p><b>Compute.</b> $f_{LO}=110$ MHz; $f_{im}=120$ MHz. Check: $|120-110|=10$ MHz, so 120 MHz also converts to 10 MHz.</p>
<p><b>Explanation.</b> Compared with the low-side case, the same 10 MHz IF is obtained but the image moves to 120 MHz (the high side) and the recovered IF spectrum is inverted, because the difference $f_{LO}-f_{RF}$ carries the opposite sign to $f_{RF}-f_{LO}$.</p>` },
      { q: String.raw`A double-balanced diode-ring mixer is driven with $P_{RF,in}=-8$ dBm and has a conversion loss of 6.5 dB. Find the output IF power and the approximate contribution to the front-end noise figure.`, solution: String.raw`<p><b>Formula.</b> Conversion loss is $L_c=10\log_{10}(P_{RF,in}/P_{IF,out})$, so in dBm the output is $P_{IF,out}[\text{dBm}]=P_{RF,in}[\text{dBm}]-L_c[\text{dB}]$; for a passive mixer $NF\approx L_c$.</p>
<p><b>Substitute.</b> $$P_{IF,out}=-8\text{ dBm}-6.5\text{ dB},\qquad NF\approx 6.5\text{ dB}.$$</p>
<p><b>Compute.</b> $P_{IF,out}=-14.5$ dBm; the mixer adds about $6.5$ dB to the noise figure.</p>
<p><b>Explanation.</b> A passive ring only attenuates the signal while thermal noise stays at $kT$, so its 6.5 dB loss shows up almost directly as 6.5 dB of noise figure. This is why a low-noise amplifier is placed ahead of the mixer to set the receiver's sensitivity.</p>` },
      { q: String.raw`For $f_{RF}=100$ MHz and $f_{LO}=90$ MHz, locate the low-order spur from $(m,n)=(2,1)$ and the half-IF spur from $(m,n)=(2,2)$.`, solution: String.raw`<p><b>Formula.</b> Spurious products appear at $f_{spur}=|m f_{LO}\pm n f_{RF}|$. Evaluate the $(2,1)$ combination $|2f_{LO}\pm f_{RF}|$ and the $(2,2)$ combination $|2f_{LO}\pm 2f_{RF}|$.</p>
<p><b>Substitute.</b> $$|2(90)\pm100|\text{ MHz},\qquad |2(90)\pm2(100)|\text{ MHz}.$$</p>
<p><b>Compute.</b> $(2,1)$: $|180-100|=80$ MHz and $180+100=280$ MHz. $(2,2)$: $|180-200|=20$ MHz and $180+200=380$ MHz. The $(2,2)$ difference at 20 MHz is $2f_{IF}$.</p>
<p><b>Explanation.</b> The wanted IF is 10 MHz; the low-order $(2,2)$ spur at 20 MHz is the closest and is tracked on a spur chart to ensure it stays outside the IF passband. Higher-order combinations lie further out and are usually filtered easily.</p>` },
      { q: String.raw`Compare high-side and low-side LO for $f_{RF}=100$ MHz and $f_{IF}=10$ MHz: give each $f_{LO}$, each image, and the RF separation of the two images.`, solution: String.raw`<p><b>Formula.</b> Low-side: $f_{LO}=f_{RF}-f_{IF}$, image $f_{im}=f_{RF}-2f_{IF}$. High-side: $f_{LO}=f_{RF}+f_{IF}$, image $f_{im}=f_{RF}+2f_{IF}$.</p>
<p><b>Substitute.</b> $$\text{low: } f_{LO}=100-10,\ f_{im}=100-20;\qquad \text{high: } f_{LO}=100+10,\ f_{im}=100+20.$$</p>
<p><b>Compute.</b> Low-side: $f_{LO}=90$ MHz, image $=80$ MHz. High-side: $f_{LO}=110$ MHz, image $=120$ MHz. The two images (80 and 120 MHz) are $40$ MHz $=4f_{IF}$ apart.</p>
<p><b>Explanation.</b> Both choices yield the same 10 MHz IF, but the image flips from below the RF (low-side) to above it (high-side). Choosing the side that puts the image where the preselect filter and neighbouring spectrum are cleanest — plus spectral-inversion considerations — drives the LO-plan decision.</p>` }
    ],
    realWorld: String.raw`<p>Every superheterodyne radio, from an AM broadcast set to a 5G handset and a radar receiver, is built around mixers. In a modern <a href="#ad9361">RFIC</a> transceiver, active Gilbert-cell mixers driven by an on-chip synthesizer down-convert the antenna signal to baseband (I/Q) or to a low IF, while up-converting mixers place the transmit baseband onto the carrier. Test-and-measurement gear and high-dynamic-range communications front-ends favour passive double-balanced diode rings for their linearity ($\approx6$–$7$ dB conversion loss but high IIP3). The image problem drives whole architecture choices: a classic superhet uses a preselect filter plus a well-chosen IF to push the image far away, while <a href="#zero-if">zero-IF</a> and low-IF receivers use image-reject mixers and I/Q processing instead. LO leakage and self-mixing DC offsets, spurious products from the $|m f_{LO}\pm n f_{RF}|$ lattice, and mixer noise adding on top of the <a href="#lna">LNA</a> all show up directly in a receiver's sensitivity, spurious-response and EVM specifications — which is why <a href="#superheterodyne">superheterodyne</a> frequency planning is largely the art of placing mixer products where they do no harm.</p>`,
    related: ['intermediate-frequency', 'image-frequency', 'superheterodyne', 'harmonics', 'third-order-intercept', 'lna']
  }
);
