// Band-Pass Filter (BPF) — deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'bpf',
    title: 'Band-Pass Filter (BPF)',
    category: 'Filters',
    tags: ['band-pass', 'center frequency', 'bandwidth', 'quality factor', 'resonance', 'selectivity'],
    summary: String.raw`A band-pass filter passes a band of frequencies centred on $f_0$ and rejects energy on both sides of it; its sharpness is set by the quality factor $Q=f_0/\text{BW}$, making it the workhorse of RF preselection, IF filtering and channel selection.`,
    diagram: [
    {
      title: String.raw`Magnitude response: f0, BW, −3 dB points and Q`,
      svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-bpf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Band-pass magnitude response</text>
        <line x1="60" y1="200" x2="510" y2="200" stroke="#9aa7b5" marker-end="url(#arr-bpf)"/>
        <line x1="60" y1="200" x2="60" y2="40" stroke="#9aa7b5" marker-end="url(#arr-bpf)"/>
        <text x="505" y="220" fill="#9aa7b5" font-size="10">f</text>
        <text x="30" y="46" fill="#9aa7b5" font-size="10">|H|</text>
        <path d="M70,196 C170,190 240,70 285,60 C330,70 400,190 500,196" fill="none" stroke="#4dabf7" stroke-width="2"/>
        <line x1="60" y1="60" x2="285" y2="60" stroke="#63e6be" stroke-dasharray="3,3"/>
        <text x="66" y="56" fill="#63e6be" font-size="10">peak</text>
        <line x1="60" y1="95" x2="360" y2="95" stroke="#ffa94d" stroke-dasharray="3,3"/>
        <text x="66" y="91" fill="#ffa94d" font-size="10">−3 dB (0.707)</text>
        <line x1="215" y1="95" x2="215" y2="200" stroke="#b197fc" stroke-dasharray="2,2"/>
        <line x1="355" y1="95" x2="355" y2="200" stroke="#b197fc" stroke-dasharray="2,2"/>
        <line x1="285" y1="60" x2="285" y2="200" stroke="#9aa7b5" stroke-dasharray="2,2"/>
        <text x="285" y="216" fill="#e6edf3" font-size="11" text-anchor="middle">f₀</text>
        <text x="215" y="216" fill="#b197fc" font-size="10" text-anchor="middle">f<tspan baseline-shift="sub" font-size="8">L</tspan></text>
        <text x="355" y="216" fill="#b197fc" font-size="10" text-anchor="middle">f<tspan baseline-shift="sub" font-size="8">H</tspan></text>
        <line x1="215" y1="130" x2="355" y2="130" stroke="#e6edf3" marker-start="url(#arr-bpf)" marker-end="url(#arr-bpf)"/>
        <text x="285" y="146" fill="#e6edf3" font-size="10" text-anchor="middle">BW = f<tspan baseline-shift="sub" font-size="8">H</tspan> − f<tspan baseline-shift="sub" font-size="8">L</tspan></text>
        <text x="285" y="182" fill="#63e6be" font-size="11" text-anchor="middle">Q = f₀ / BW</text>
      </svg>`,
      caption: String.raw`The passband is the span between the two −3 dB (half-power, 0.707 voltage) points fL and fH. Their separation is the bandwidth BW, the peak sits at the centre frequency f0, and Q = f0/BW quantifies how sharply the band is defined.`
    },
    {
      title: String.raw`How a BPF is built: LPF ∩ HPF cascade vs LC resonant tank`,
      svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-bpf" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Two ways to make a band-pass</text>
        <text x="135" y="42" fill="#9aa7b5" font-size="11" text-anchor="middle">(a) LPF ∩ HPF cascade</text>
        <line x1="14" y1="72" x2="44" y2="72" stroke="#9aa7b5" marker-end="url(#arr2-bpf)"/>
        <rect x="46" y="52" width="80" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/>
        <text x="86" y="70" fill="#e6edf3" text-anchor="middle" font-size="11">HPF</text>
        <text x="86" y="85" fill="#9aa7b5" text-anchor="middle" font-size="9">sets f<tspan baseline-shift="sub" font-size="8">L</tspan></text>
        <line x1="126" y1="72" x2="150" y2="72" stroke="#9aa7b5" marker-end="url(#arr2-bpf)"/>
        <rect x="152" y="52" width="80" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/>
        <text x="192" y="70" fill="#e6edf3" text-anchor="middle" font-size="11">LPF</text>
        <text x="192" y="85" fill="#9aa7b5" text-anchor="middle" font-size="9">sets f<tspan baseline-shift="sub" font-size="8">H</tspan></text>
        <line x1="232" y1="72" x2="262" y2="72" stroke="#9aa7b5" marker-end="url(#arr2-bpf)"/>
        <text x="150" y="112" fill="#63e6be" font-size="9" text-anchor="middle">overlap = passband (wideband, low Q)</text>
        <text x="405" y="42" fill="#9aa7b5" font-size="11" text-anchor="middle">(b) LC resonant tank</text>
        <line x1="300" y1="150" x2="330" y2="150" stroke="#9aa7b5" marker-end="url(#arr2-bpf)"/>
        <rect x="332" y="120" width="150" height="70" rx="6" fill="#1c232e" stroke="#b197fc"/>
        <text x="407" y="145" fill="#e6edf3" text-anchor="middle" font-size="11">L ‖ C tank</text>
        <text x="407" y="163" fill="#9aa7b5" text-anchor="middle" font-size="9">resonates at f₀=1/2π√(LC)</text>
        <text x="407" y="179" fill="#63e6be" text-anchor="middle" font-size="9">Q from R; sharp, narrowband</text>
        <line x1="482" y1="150" x2="512" y2="150" stroke="#9aa7b5" marker-end="url(#arr2-bpf)"/>
      </svg>`,
      caption: String.raw`(a) A wide band-pass is an HPF (which sets the lower edge fL) cascaded with an LPF (which sets the upper edge fH); the overlap of their passbands is the transmitted band. (b) A narrow, high-Q band-pass is a resonant LC tank that peaks at f0=1/(2π√(LC)), with Q governed by the tank loss resistance.`
    },
    {
      title: String.raw`Narrowband (high-Q) vs wideband (low-Q) selectivity`,
      svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-bpf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Same f₀, different Q</text>
        <line x1="60" y1="190" x2="510" y2="190" stroke="#9aa7b5" marker-end="url(#arr3-bpf)"/>
        <line x1="60" y1="190" x2="60" y2="40" stroke="#9aa7b5" marker-end="url(#arr3-bpf)"/>
        <text x="505" y="210" fill="#9aa7b5" font-size="10">f</text>
        <line x1="285" y1="50" x2="285" y2="190" stroke="#9aa7b5" stroke-dasharray="2,2"/>
        <text x="285" y="206" fill="#e6edf3" font-size="11" text-anchor="middle">f₀</text>
        <path d="M110,186 C240,182 275,55 285,52 C295,55 330,182 460,186" fill="none" stroke="#63e6be" stroke-width="2"/>
        <path d="M70,186 C200,175 255,95 285,90 C315,95 370,175 500,186" fill="none" stroke="#ffa94d" stroke-width="2"/>
        <rect x="360" y="60" width="150" height="20" rx="4" fill="#1c232e" stroke="#63e6be"/>
        <text x="435" y="74" fill="#63e6be" font-size="10" text-anchor="middle">high Q: narrow, sharp</text>
        <rect x="360" y="86" width="150" height="20" rx="4" fill="#1c232e" stroke="#ffa94d"/>
        <text x="435" y="100" fill="#ffa94d" font-size="10" text-anchor="middle">low Q: broad, gentle</text>
        <text x="270" y="222" fill="#9aa7b5" font-size="10" text-anchor="middle">receiver preselector wants high Q to reject the image; wideband IF wants controlled low Q</text>
      </svg>`,
      caption: String.raw`Both curves share the same centre f0 but differ in Q. The high-Q (green) response is narrow with steep skirts — strong selectivity, ideal for a preselector that must reject an image or an adjacent channel. The low-Q (orange) response is broad and gentle — used where the whole signal bandwidth must pass, as in a wideband IF stage.`
    }
    ],
    prerequisites: ['filters', 'bandwidth'],
    intro: String.raw`<p><b>Why does the band-pass filter exist?</b> A receiver is drowning in energy — every transmitter on earth, thermal noise, and its own spurious mixing products all arrive at the antenna at once. To recover one channel you must throw away everything that is not near your frequency of interest, on <i>both</i> sides of it. A low-pass filter only removes what is above a cutoff; a high-pass only removes what is below. Neither can isolate a band sitting in the middle of the spectrum. The band-pass filter is the tool that keeps a window of frequencies around a chosen centre and rejects the rest — it is why a radio can select one station out of hundreds, why a superheterodyne can reject its image, and why an IF strip can define the receiver's noise bandwidth.</p>
<p>A <b>band-pass filter (BPF)</b> is defined by three numbers: its <b>centre frequency</b> $f_0$, its <b>bandwidth</b> $\text{BW}$ (the width of the passband between the two $-3$ dB points), and its <b>quality factor</b> $Q=f_0/\text{BW}$, which measures how sharply the band is defined. Mastering the BPF means understanding how these three relate, how the response is realised (as an LPF+HPF cascade for wide bands, or an LC/coupled-resonator structure for narrow ones), and the fundamental trade-off between selectivity ($Q$) and insertion loss.</p>`,
    sections: [
      {
        h: 'What a band-pass filter is: f0, BW, Q',
        html: String.raw`<p>A band-pass filter has a transfer magnitude $|H(f)|$ that is small at both low and high frequencies and peaks over a band centred on the <b>centre frequency</b> $f_0$. The <b>passband</b> is conventionally the range of frequencies over which $|H|$ stays within 3 dB of its peak — i.e. above $1/\sqrt{2}\approx0.707$ of the peak voltage (half the peak power). The two edges of this range are the <b>lower and upper $-3$ dB frequencies</b> $f_L$ and $f_H$.</p>
        <p>The three defining quantities are:</p>
        <ul>
          <li><b>Centre frequency</b> $f_0$: for a symmetric (geometric) response, $f_0=\sqrt{f_L f_H}$; for narrowband filters this is very close to the arithmetic mean.</li>
          <li><b>Bandwidth</b> $\text{BW}=f_H-f_L$: the width of the passband in Hz (also called the $-3$ dB or half-power bandwidth).</li>
          <li><b>Quality factor</b> $Q=f_0/\text{BW}$: a dimensionless number. A large $Q$ means a narrow passband relative to $f_0$ — high selectivity.</li>
        </ul>
        <p>The <b>fractional bandwidth</b> is $\text{FBW}=\text{BW}/f_0=1/Q$, usually quoted as a percentage. A filter with FBW below roughly 1% is "narrowband"; above ~20% is "wideband" — the distinction dictates which realisation technique is practical.</p>
        <div class="callout tip"><b>Key intuition:</b> $Q$ ties selectivity to centre frequency. A 10 kHz bandwidth is razor-sharp at 1 MHz ($Q=100$) but hopelessly broad at 10 GHz ($Q=10^6$, essentially unrealisable). Always think in <i>fractional</i> bandwidth when judging whether a filter is achievable.</div>`
      },
      {
        h: 'How a band-pass is built: cascade vs resonator',
        html: String.raw`<p>There are two conceptually distinct ways to synthesise a band-pass response, chosen by the fractional bandwidth.</p>
        <p><b>1. LPF + HPF cascade (wideband).</b> Put a high-pass filter (whose cutoff sets the lower edge $f_L$) in series with a low-pass filter (whose cutoff sets the upper edge $f_H$). Frequencies below $f_L$ are killed by the HPF; frequencies above $f_H$ are killed by the LPF; the <i>overlap</i> of the two passbands is transmitted. This is intuitive and works well when $f_H/f_L$ is large (a wide band), because the two cutoffs are well separated. It becomes impractical for narrow bands, where $f_L$ and $f_H$ are so close that component tolerances swamp the design.</p>
        <p><b>2. Resonant / coupled-resonator (narrowband).</b> A single <b>LC tank</b> (inductor in parallel or series with a capacitor) presents a sharp impedance peak/null at its resonance $f_0=1/(2\pi\sqrt{LC})$, forming a natural band-pass around $f_0$. Its $Q$ is set by the tank's loss resistance. To get sharper skirts and a flat top, several resonators are <b>coupled</b> together (coupled-resonator filters, cavity filters, ceramic/SAW/crystal filters) — each added resonator increases the order and steepens the roll-off.</p>
        <div class="callout tip"><b>Rule of thumb:</b> use an LPF+HPF cascade when the fractional bandwidth is large (tens of percent); switch to LC/coupled-resonator (or SAW/crystal for very high $Q$) when you need a narrow, sharply-defined band.</div>`
      },
      {
        h: 'The RLC resonator and where Q comes from',
        html: String.raw`<p>The canonical second-order band-pass is a series (or parallel) <b>RLC</b> circuit. Taking the voltage across the resistor of a series RLC driven by $V_{in}$, the transfer function is</p>
        <p>$$H(s)=\frac{(R/L)\,s}{s^2+(R/L)\,s+1/(LC)}.$$</p>
        <p>This has a zero at DC and at infinity (so it rejects both extremes) and a peak at $\omega_0=1/\sqrt{LC}$. Comparing to the standard band-pass form $H(s)=\dfrac{(\omega_0/Q)\,s}{s^2+(\omega_0/Q)\,s+\omega_0^2}$ identifies</p>
        <p>$$\omega_0=\frac{1}{\sqrt{LC}},\qquad Q=\frac{\omega_0 L}{R}=\frac{1}{R}\sqrt{\frac{L}{C}}.$$</p>
        <p>The two poles have a real part $-\omega_0/(2Q)$: a higher $Q$ pushes the poles toward the $j\omega$ axis, giving a taller, narrower peak that rings longer in time. The $-3$ dB bandwidth of this response is exactly $\text{BW}=\omega_0/Q$ (in rad/s), i.e. $\text{BW}=f_0/Q$ in Hz — the defining $Q=f_0/\text{BW}$ relation.</p>
        <div class="callout tip"><b>Key intuition:</b> $Q$ is "energy stored per cycle ÷ energy lost per cycle." Lower loss $R$ ⇒ higher $Q$ ⇒ narrower band and sharper skirts — but a real inductor's finite $Q$ ($=\omega L/R_{series}$) caps how sharp you can make it, and pushing $Q$ up increases insertion loss.</div>`
      },
      {
        h: 'Shape factor, skirt selectivity and filter order',
        html: String.raw`<p>The $-3$ dB bandwidth tells you the passband width, but not how <i>fast</i> the response falls outside it. Two extra measures capture the skirts:</p>
        <ul>
          <li><b>Shape factor:</b> the ratio of a wider rejection bandwidth to the $-3$ dB bandwidth, e.g. $\text{SF}=\text{BW}_{-60\,\text{dB}}/\text{BW}_{-3\,\text{dB}}$. An ideal "brick-wall" filter has SF $=1$; a single resonator has a large SF (gentle skirts). Smaller is better.</li>
          <li><b>Skirt selectivity / roll-off:</b> the slope of the stopband edge in dB/octave, set by the <b>filter order</b> $n$ — asymptotically $\pm6n$ dB/octave far from the band (a band-pass has $+6n$ on the low side and $-6n$ on the high side for an $n$-th order design).</li>
        </ul>
        <p>A single LC tank ($n=2$) has soft shoulders. Cascading/coupling more resonators raises $n$, steepening the skirts and lowering the shape factor at the cost of complexity, size and insertion loss. Filter <b>approximations</b> trade these differently: Butterworth gives a maximally flat passband, Chebyshev trades passband ripple for steeper skirts, and elliptic (Cauer) adds stopband zeros for the sharpest transition of all. Crystal and SAW filters achieve shape factors near 1 that lumped LC never can.</p>`
      },
      {
        h: 'Insertion loss and the Q trade-off',
        html: String.raw`<p>An ideal BPF passes the wanted band with 0 dB loss. A real one dissipates some signal even at $f_0$ — its <b>insertion loss</b> (IL), the power lost relative to a through connection, in dB. The dominant cause is the finite <b>unloaded $Q$</b> ($Q_u$) of the resonators (mainly the inductor's series resistance and dielectric/conductor loss).</p>
        <p>For a single resonator, the mid-band insertion loss depends on the ratio of the <b>loaded $Q$</b> ($Q_L$, set by the desired bandwidth) to the unloaded $Q$:</p>
        <p>$$\text{IL}\approx-20\log_{10}\!\left(1-\frac{Q_L}{Q_u}\right)\ \text{dB}.$$</p>
        <p>The tension is fundamental: making the filter <i>sharper</i> means raising $Q_L$ toward $Q_u$, which drives the insertion loss up. You cannot have arbitrarily narrow bandwidth <i>and</i> low loss from a given resonator technology — you need higher-$Q_u$ resonators (bigger cavities, crystals, superconductors). This is why very narrow, low-loss filters are physically large or use exotic materials.</p>
        <div class="callout tip"><b>Key intuition:</b> insertion loss and selectivity pull in opposite directions for fixed resonator quality. Doubling $Q_u$ lets you keep the same bandwidth at half the loss, or halve the bandwidth at the same loss — resonator $Q_u$ is the currency you spend on sharpness.</div>`
      },
      {
        h: 'Where BPFs are used in a receiver',
        html: String.raw`<p>Band-pass filters appear at several places in a classic superheterodyne receiver, each with a different job:</p>
        <ul>
          <li><b>RF preselector:</b> a BPF right after the antenna/LNA that passes the wanted RF band and, crucially, <b>rejects the image frequency</b> before the mixer. Without it the image (at $f_{RF}\pm2f_{IF}$) folds onto the wanted signal. Needs enough $Q$ to reject an image $2f_{IF}$ away.</li>
          <li><b>IF filter:</b> the main channel-defining filter at the fixed intermediate frequency. Because $f_0$ is fixed and modest, a very high-$Q$ (crystal, ceramic or SAW) filter can define the exact channel bandwidth and set the receiver's noise bandwidth and adjacent-channel rejection.</li>
          <li><b>Channel select:</b> in multi-channel systems, a tunable or switched BPF isolates one channel from its neighbours.</li>
          <li><b>Image rejection:</b> either the preselector or a dedicated image-reject filter/architecture keeps the unwanted mixer sideband out.</li>
        </ul>
        <p>The recurring design theme: put the sharp, high-$Q$ selectivity at a <i>fixed, low</i> IF (where high $Q$ is cheap), and use a broader, tunable preselector at RF only to knock down the image and out-of-band energy.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The three defining numbers:</b> centre frequency $f_0$, $-3$ dB bandwidth $\text{BW}=f_H-f_L$, and quality factor $Q=f_0/\text{BW}$ (with fractional bandwidth $=1/Q$) — and why selectivity must be judged fractionally.</li>
<li><b>The two realisations:</b> an LPF+HPF cascade for wide bands (HPF sets $f_L$, LPF sets $f_H$, overlap is the passband) versus an LC / coupled-resonator structure for narrow, sharp bands with $f_0=1/(2\pi\sqrt{LC})$.</li>
<li><b>Where $Q$ comes from:</b> the RLC resonator, $\omega_0=1/\sqrt{LC}$ and $Q=(1/R)\sqrt{L/C}$, and how higher $Q$ pushes the poles toward the axis to narrow and sharpen the response.</li>
<li><b>Shape factor and order:</b> that skirt steepness ($\pm6n$ dB/octave) and shape factor improve with filter order, and how Butterworth/Chebyshev/elliptic trade flatness for sharpness.</li>
<li><b>The insertion-loss trade:</b> sharper (higher $Q_L$) filters cost more insertion loss for a given resonator $Q_u$ — you buy selectivity with resonator quality.</li>
<li><b>The receiver roles:</b> RF preselector for image rejection, high-$Q$ IF filter for channel definition, and channel-select — and why sharp selectivity lives at a fixed low IF.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`A BPF passes a band around $f_0$ and rejects energy on both sides; defined by $f_0$, bandwidth $\text{BW}$ and quality factor $Q$.`,
      String.raw`Passband edges are the two $-3$ dB (half-power, $0.707$ voltage) points $f_L$ and $f_H$; $\text{BW}=f_H-f_L$ and $f_0=\sqrt{f_L f_H}$.`,
      String.raw`Quality factor $Q=f_0/\text{BW}$; fractional bandwidth $=\text{BW}/f_0=1/Q$. Judge selectivity fractionally, not in absolute Hz.`,
      String.raw`Wide bands: cascade an HPF (sets $f_L$) with an LPF (sets $f_H$) — the overlap is the passband.`,
      String.raw`Narrow bands: use an LC tank ($f_0=1/(2\pi\sqrt{LC})$) or coupled resonators; $Q=(1/R)\sqrt{L/C}$ from the RLC.`,
      String.raw`Higher $Q$ pushes poles toward the $j\omega$ axis → taller, narrower peak, steeper skirts, longer time-domain ringing.`,
      String.raw`Shape factor $=\text{BW}_{-60}/\text{BW}_{-3}$ measures skirt sharpness (ideal $=1$); roll-off is $\pm6n$ dB/octave for order $n$.`,
      String.raw`Insertion loss rises as loaded $Q_L$ approaches unloaded $Q_u$: $\text{IL}\approx-20\log_{10}(1-Q_L/Q_u)$ — selectivity costs loss.`,
      String.raw`Receiver uses: RF preselector (image rejection), fixed high-$Q$ IF filter (channel definition), channel-select, image rejection.`,
      String.raw`Put sharp high-$Q$ selectivity at a fixed low IF where $Q$ is cheap; keep the tunable RF preselector broader.`
    ],
    equations: [
      {
        title: 'Quality factor from centre frequency and bandwidth',
        tex: String.raw`$$Q=\frac{f_0}{\text{BW}}=\frac{f_0}{f_H-f_L}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want a single dimensionless number that captures how sharply a band-pass response is defined relative to its centre. The natural choice compares the centre frequency to the width of the passband.</p>
        <p><b>Step 1 — define the passband edges.</b> The passband is the set of frequencies where the transmitted power is at least half the peak, i.e. where $|H(f)|\ge |H(f_0)|/\sqrt{2}$. Call the lower and upper crossings of this $-3$ dB level $f_L$ and $f_H$. The width of the passband is then the half-power bandwidth $\text{BW}=f_H-f_L$.</p>
        <p><b>Step 2 — normalise the width by the centre.</b> A 10 kHz band is "sharp" at 1 MHz but "broad" at 1 kHz, so absolute width is not a good selectivity measure. Dividing the centre by the width removes the frequency scale and yields a pure ratio.</p>
        <p><b>Step 3 — define Q.</b> $$Q\equiv\frac{f_0}{\text{BW}}=\frac{f_0}{f_H-f_L}.$$</p>
        <p><b>Result / sanity check.</b> $$Q=\frac{f_0}{\text{BW}}.$$ Large $Q$ means a narrow band relative to $f_0$ (high selectivity); the fractional bandwidth is its reciprocal, $\text{FBW}=\text{BW}/f_0=1/Q$. Units cancel, as required for a quality factor. This same $Q$ equals the resonator's stored-energy/dissipated-energy ratio, tying the frequency-domain shape to the physical loss.</p>`
      },
      {
        title: 'Resonant centre frequency of an LC tank',
        tex: String.raw`$$f_0=\frac{1}{2\pi\sqrt{LC}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A band-pass peaks where an inductor and capacitor exchange energy resonantly. We find that frequency by asking where their reactances cancel.</p>
        <p><b>Step 1 — write the two reactances.</b> An inductor has reactance $X_L=\omega L$ (rising with frequency); a capacitor has $X_C=1/(\omega C)$ (falling with frequency), where $\omega=2\pi f$ is the angular frequency.</p>
        <p><b>Step 2 — impose the resonance condition.</b> At resonance the inductive and capacitive reactances are equal in magnitude and cancel, so the tank presents a purely resistive (peak or null) impedance: $$\omega_0 L=\frac{1}{\omega_0 C}.$$</p>
        <p><b>Step 3 — solve for the angular frequency.</b> Multiplying both sides by $\omega_0$ gives $\omega_0^2 LC=1$, hence $$\omega_0=\frac{1}{\sqrt{LC}}.$$</p>
        <p><b>Step 4 — convert to hertz.</b> Since $\omega_0=2\pi f_0$, $$f_0=\frac{\omega_0}{2\pi}=\frac{1}{2\pi\sqrt{LC}}.$$</p>
        <p><b>Result / sanity check.</b> $$f_0=\frac{1}{2\pi\sqrt{LC}}.$$ Dimensions: $\sqrt{LC}$ has units of seconds, so $1/\sqrt{LC}$ is rad/s and dividing by $2\pi$ gives Hz. Increasing either $L$ or $C$ lowers $f_0$, as expected — a bigger tank resonates more slowly.</p>`
      },
      {
        title: 'Second-order RLC band-pass and its bandwidth',
        tex: String.raw`$$H(s)=\frac{(\omega_0/Q)\,s}{s^2+(\omega_0/Q)\,s+\omega_0^2},\qquad \text{BW}=\frac{\omega_0}{Q}$$`,
        derivation: String.raw`<p><b>Where we start.</b> We take the simplest circuit that rejects both DC and high frequencies — a series RLC with the output across $R$ — and extract its bandwidth to prove $Q=f_0/\text{BW}$.</p>
        <p><b>Step 1 — derive the transfer function.</b> In a series RLC driven by $V_{in}$ with output $V_R$ across the resistor, the voltage divider gives $$H(s)=\frac{R}{R+sL+1/(sC)}=\frac{(R/L)\,s}{s^2+(R/L)\,s+1/(LC)}.$$ This has a zero at $s=0$ (blocks DC) and rolls off at high $s$ (blocks high frequencies) — a band-pass.</p>
        <p><b>Step 2 — match to the standard form.</b> Comparing with $H(s)=\dfrac{(\omega_0/Q)s}{s^2+(\omega_0/Q)s+\omega_0^2}$ identifies $\omega_0^2=1/(LC)$ and $\omega_0/Q=R/L$, so $\omega_0=1/\sqrt{LC}$ and $Q=\omega_0 L/R=(1/R)\sqrt{L/C}$.</p>
        <p><b>Step 3 — find the $-3$ dB frequencies.</b> On the $j\omega$ axis the magnitude is $|H(j\omega)|=\dfrac{(\omega_0/Q)\omega}{\sqrt{(\omega_0^2-\omega^2)^2+(\omega_0\omega/Q)^2}}$, which peaks to 1 at $\omega=\omega_0$. Setting $|H|^2=1/2$ requires $|\omega_0^2-\omega^2|=\omega_0\omega/Q$. Solving the two resulting quadratics gives the edge frequencies $\omega_{H,L}=\omega_0\left(\sqrt{1+1/(2Q)^2}\pm 1/(2Q)\right)$.</p>
        <p><b>Step 4 — subtract to get bandwidth.</b> The two edges differ only in the sign of the $\pm 1/(2Q)$ term, so $$\text{BW}=\omega_H-\omega_L=\omega_0\cdot\frac{1}{Q}=\frac{\omega_0}{Q}.$$</p>
        <p><b>Result / sanity check.</b> $$\text{BW}=\frac{\omega_0}{Q}\ \Longleftrightarrow\ Q=\frac{\omega_0}{\text{BW}}=\frac{f_0}{\text{BW}},$$ exactly the definition of $Q$. The product $\omega_L\omega_H=\omega_0^2$ also confirms the geometric-mean centre $f_0=\sqrt{f_L f_H}$.</p>`
      },
      {
        title: 'Insertion loss vs loaded/unloaded Q',
        tex: String.raw`$$\text{IL}\approx-20\log_{10}\!\left(1-\frac{Q_L}{Q_u}\right)\ \text{dB}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A real resonator dissipates energy, so even at $f_0$ not all the input power reaches the output. We relate the mid-band loss to the resonator's own quality factor and the bandwidth we demand of it.</p>
        <p><b>Step 1 — separate the two Q's.</b> The <i>unloaded</i> quality factor $Q_u$ counts only the resonator's internal losses (finite inductor/dielectric $R$). The <i>loaded</i> quality factor $Q_L$ counts internal loss <i>plus</i> the external source/load loading that sets the passband: $\dfrac{1}{Q_L}=\dfrac{1}{Q_u}+\dfrac{1}{Q_e}$, where $Q_e$ is the external (coupling) $Q$.</p>
        <p><b>Step 2 — fraction of energy lost internally.</b> At resonance the power split follows the conductances. The fraction of loss going to the <i>internal</i> (wasted) path rather than the useful external path is $\dfrac{1/Q_u}{1/Q_L}=\dfrac{Q_L}{Q_u}$. The fraction that survives to the output is therefore $1-Q_L/Q_u$ in voltage terms.</p>
        <p><b>Step 3 — express in decibels.</b> Insertion loss is the negative of the transmitted-voltage ratio in dB: $$\text{IL}=-20\log_{10}\!\left(1-\frac{Q_L}{Q_u}\right)\ \text{dB}.$$</p>
        <p><b>Result / sanity check.</b> $$\text{IL}\approx-20\log_{10}\!\left(1-\frac{Q_L}{Q_u}\right).$$ If the resonator were lossless ($Q_u\to\infty$) the argument $\to1$ and $\text{IL}\to0$ dB, as it must. As $Q_L\to Q_u$ (demanding a bandwidth as narrow as the resonator allows) the argument $\to0$ and $\text{IL}\to\infty$ — proving selectivity and low loss are in direct tension for a given $Q_u$.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does a band-pass filter do?`, back: String.raw`Passes a band of frequencies centred on $f_0$ and rejects energy on both the low and high sides of that band.` },
      { front: String.raw`Define the quality factor of a BPF.`, back: String.raw`$Q=f_0/\text{BW}$, where $\text{BW}=f_H-f_L$ is the $-3$ dB (half-power) bandwidth. Larger $Q$ = narrower, more selective band.` },
      { front: String.raw`What are the passband edges of a BPF?`, back: String.raw`The two $-3$ dB (half-power) points $f_L$ and $f_H$, where $|H|$ falls to $1/\sqrt{2}\approx0.707$ of its peak voltage.` },
      { front: String.raw`What is fractional bandwidth?`, back: String.raw`$\text{FBW}=\text{BW}/f_0=1/Q$, the passband width normalised to the centre frequency (often as a percentage).` },
      { front: String.raw`Give the centre frequency of an LC tank.`, back: String.raw`$f_0=1/(2\pi\sqrt{LC})$ — the frequency where inductive and capacitive reactances cancel.` },
      { front: String.raw`How do you build a wideband band-pass from LPF and HPF?`, back: String.raw`Cascade an HPF (its cutoff sets the lower edge $f_L$) with an LPF (its cutoff sets the upper edge $f_H$); the overlap of the two passbands is the transmitted band.` },
      { front: String.raw`What is $Q$ for a series RLC band-pass?`, back: String.raw`$Q=\omega_0 L/R=(1/R)\sqrt{L/C}$; lower loss $R$ gives higher $Q$ and a narrower, sharper band.` },
      { front: String.raw`What is the shape factor of a filter?`, back: String.raw`The ratio of a deep-rejection bandwidth to the $-3$ dB bandwidth, e.g. $\text{BW}_{-60}/\text{BW}_{-3}$. Ideal (brick-wall) $=1$; smaller is sharper.` },
      { front: String.raw`How does filter order affect the skirts?`, back: String.raw`Roll-off far from the band is asymptotically $\pm6n$ dB/octave for order $n$; higher order = steeper skirts and lower shape factor.` },
      { front: String.raw`Why does a sharper BPF have more insertion loss?`, back: String.raw`Narrower bandwidth means a higher loaded $Q_L$ closer to the resonator's unloaded $Q_u$; $\text{IL}\approx-20\log_{10}(1-Q_L/Q_u)$ grows as $Q_L\to Q_u$.` },
      { front: String.raw`What is the job of an RF preselector BPF?`, back: String.raw`It passes the wanted RF band and rejects the image frequency (at $f_{RF}\pm2f_{IF}$) before the mixer, plus out-of-band interferers.` },
      { front: String.raw`Why put the sharp channel filter at the IF, not at RF?`, back: String.raw`The IF is fixed and low, so a very high-$Q$ crystal/ceramic/SAW filter can define the exact channel bandwidth cheaply; high $Q$ is far harder at a high, tunable RF.` },
      { front: String.raw`What is the geometric-mean relation for centre frequency?`, back: String.raw`$f_0=\sqrt{f_L f_H}$ (exact for the RLC band-pass, since $\omega_L\omega_H=\omega_0^2$); for narrowband it is nearly the arithmetic mean.` },
      { front: String.raw`How does raising $Q$ move the poles of an RLC band-pass?`, back: String.raw`It pushes the pole pair toward the $j\omega$ axis (real part $-\omega_0/2Q$), giving a taller, narrower peak that rings longer in time.` }
    ],
    mcqs: [
      { q: String.raw`A BPF has $f_0=100$ MHz and $\text{BW}=2$ MHz. What is its $Q$?`, options: [String.raw`2`, String.raw`50`, String.raw`100`, String.raw`200`], answer: 1, explain: String.raw`$Q=f_0/\text{BW}=100/2=50$.` },
      { q: String.raw`The passband edges of a band-pass filter are defined at the point where the response falls to:`, options: [String.raw`Half the peak voltage (−6 dB)`, String.raw`$1/\sqrt{2}$ of peak voltage (−3 dB)`, String.raw`One tenth of peak (−20 dB)`, String.raw`Zero`], answer: 1, explain: String.raw`The $-3$ dB points are where $|H|=1/\sqrt{2}\approx0.707$ of peak voltage, i.e. half the peak power.` },
      { q: String.raw`To build a wide band-pass from two simpler filters you cascade:`, options: [String.raw`Two low-pass filters`, String.raw`Two high-pass filters`, String.raw`A high-pass (sets $f_L$) and a low-pass (sets $f_H$)`, String.raw`A notch and an all-pass`], answer: 2, explain: String.raw`The HPF cutoff sets the lower edge and the LPF cutoff sets the upper edge; their overlap is the passband.` },
      { q: String.raw`For an LC tank, the centre (resonant) frequency is:`, options: [String.raw`$f_0=1/(2\pi LC)$`, String.raw`$f_0=1/(2\pi\sqrt{LC})$`, String.raw`$f_0=2\pi\sqrt{LC}$`, String.raw`$f_0=\sqrt{LC}/2\pi$`], answer: 1, explain: String.raw`Resonance is where $\omega L=1/(\omega C)$, giving $\omega_0=1/\sqrt{LC}$ and $f_0=1/(2\pi\sqrt{LC})$.` },
      { q: String.raw`Increasing $Q$ of a band-pass filter (same $f_0$):`, options: [String.raw`Widens the passband`, String.raw`Narrows the passband and sharpens the skirts`, String.raw`Has no effect on bandwidth`, String.raw`Moves the centre frequency up`], answer: 1, explain: String.raw`Since $\text{BW}=f_0/Q$, higher $Q$ means smaller BW — a narrower, sharper response.` },
      { q: String.raw`The fractional bandwidth of a BPF equals:`, options: [String.raw`$Q$`, String.raw`$Q^2$`, String.raw`$1/Q$`, String.raw`$f_0\cdot Q$`], answer: 2, explain: String.raw`$\text{FBW}=\text{BW}/f_0=1/Q$.` },
      { q: String.raw`Which measure best describes how steeply a filter rejects just outside the passband?`, options: [String.raw`Insertion loss`, String.raw`Shape factor / skirt selectivity`, String.raw`Centre frequency`, String.raw`Group delay at DC`], answer: 1, explain: String.raw`Shape factor (e.g. $\text{BW}_{-60}/\text{BW}_{-3}$) and skirt roll-off describe how fast the response falls outside the passband.` },
      { q: String.raw`For a fixed resonator unloaded $Q_u$, making the filter narrower (higher $Q_L$):`, options: [String.raw`Reduces insertion loss`, String.raw`Increases insertion loss`, String.raw`Leaves insertion loss unchanged`, String.raw`Removes the passband entirely`], answer: 1, explain: String.raw`$\text{IL}\approx-20\log_{10}(1-Q_L/Q_u)$ grows as $Q_L\to Q_u$; sharper filters lose more.` },
      { q: String.raw`The main purpose of an RF preselector filter in a superheterodyne receiver is to:`, options: [String.raw`Amplify the signal`, String.raw`Reject the image frequency before the mixer`, String.raw`Generate the local oscillator`, String.raw`Set the IF gain`], answer: 1, explain: String.raw`The preselector passes the wanted band and rejects the image at $f_{RF}\pm2f_{IF}$ so it cannot fold onto the signal.` },
      { q: String.raw`Which realisation is best for a very narrow, sharply-defined band-pass?`, options: [String.raw`A single RC network`, String.raw`An LPF+HPF cascade with widely separated cutoffs`, String.raw`A high-$Q$ coupled-resonator / crystal / SAW filter`, String.raw`An all-pass filter`], answer: 2, explain: String.raw`Narrow, high-$Q$ bands need resonant/coupled-resonator or crystal/SAW structures; a wide LPF+HPF cascade cannot make a sharp narrow band.` },
      { q: String.raw`A series RLC band-pass has $\text{BW}=\omega_0/Q$. If $Q$ is doubled at the same $f_0$, the bandwidth:`, options: [String.raw`Doubles`, String.raw`Halves`, String.raw`Is unchanged`, String.raw`Quadruples`], answer: 1, explain: String.raw`$\text{BW}=\omega_0/Q$, so doubling $Q$ halves the bandwidth.` },
      { q: String.raw`For the RLC band-pass, the centre frequency relates to the edges by:`, options: [String.raw`$f_0=(f_L+f_H)/2$ exactly`, String.raw`$f_0=\sqrt{f_L f_H}$`, String.raw`$f_0=f_H-f_L$`, String.raw`$f_0=f_H\cdot f_L$`], answer: 1, explain: String.raw`Because $\omega_L\omega_H=\omega_0^2$, the centre is the geometric mean $f_0=\sqrt{f_L f_H}$ (nearly the arithmetic mean for narrowband).` }
    ],
    numericals: [
      { q: String.raw`A band-pass filter has centre frequency $f_0=455$ kHz and $-3$ dB edges $f_L=450$ kHz, $f_H=460$ kHz. Find the bandwidth and the quality factor.`, solution: String.raw`<p><b>Formula.</b> The half-power bandwidth is $\text{BW}=f_H-f_L$ and the quality factor is $$Q=\frac{f_0}{\text{BW}},$$ where $f_0$ is the centre frequency and $f_L,f_H$ are the lower and upper $-3$ dB frequencies.</p>
<p><b>Substitute.</b> $$\text{BW}=460\text{ kHz}-450\text{ kHz},\qquad Q=\frac{455\text{ kHz}}{\text{BW}}.$$</p>
<p><b>Compute.</b> $\text{BW}=10$ kHz. Then $Q=455/10=45.5$.</p>
<p><b>Explanation.</b> This is a classic 455 kHz IF filter: a $Q$ of about 45 gives a 10 kHz passband, appropriate for an AM channel. Note the centre is very close to the arithmetic mean $(450+460)/2=455$ kHz because the fractional bandwidth ($1/Q\approx2.2\%$) is small, so the geometric and arithmetic means nearly coincide.</p>` },
      { q: String.raw`A BPF is specified with $f_0=2.4$ GHz and $Q=80$. What is its $-3$ dB bandwidth, and what are the approximate band edges?`, solution: String.raw`<p><b>Formula.</b> Rearranging $Q=f_0/\text{BW}$ gives the bandwidth $$\text{BW}=\frac{f_0}{Q},$$ and for a narrowband filter the edges are approximately $f_{L,H}\approx f_0\mp \text{BW}/2$.</p>
<p><b>Substitute.</b> $$\text{BW}=\frac{2.4\text{ GHz}}{80},\qquad f_{L,H}\approx 2.4\text{ GHz}\mp\frac{\text{BW}}{2}.$$</p>
<p><b>Compute.</b> $\text{BW}=2.4\times10^{9}/80=30\times10^{6}=30$ MHz. Half-bandwidth is 15 MHz, so $f_L\approx2.385$ GHz and $f_H\approx2.415$ GHz.</p>
<p><b>Explanation.</b> A $Q$ of 80 at 2.4 GHz yields a 30 MHz passband — a fractional bandwidth of $1/80=1.25\%$, typical of a ceramic/SAW band-select filter for a 2.4 GHz radio. The narrow FBW justifies using the simple $\pm\text{BW}/2$ edge approximation instead of the exact geometric formula.</p>` },
      { q: String.raw`Design an LC tank to resonate at $f_0=10.7$ MHz using $L=1\ \mu\text{H}$. What capacitance $C$ is required?`, solution: String.raw`<p><b>Formula.</b> The resonance condition $f_0=1/(2\pi\sqrt{LC})$ inverts to $$C=\frac{1}{(2\pi f_0)^2 L},$$ where $L$ is the tank inductance and $f_0$ the desired centre frequency.</p>
<p><b>Substitute.</b> $$C=\frac{1}{(2\pi\times10.7\times10^{6})^2\times(1\times10^{-6})}.$$</p>
<p><b>Compute.</b> $2\pi f_0=2\pi\times1.07\times10^{7}\approx6.723\times10^{7}$ rad/s; squaring gives $4.52\times10^{15}$. Multiplying by $L=10^{-6}$ gives $4.52\times10^{9}$, so $C=1/(4.52\times10^{9})\approx2.21\times10^{-10}$ F $=221$ pF.`
      + String.raw`</p><p><b>Explanation.</b> About 221 pF resonates a 1 µH coil at the 10.7 MHz FM IF. Because $f_0\propto1/\sqrt{LC}$, halving $C$ to 110 pF would raise $f_0$ by $\sqrt2$ to about 15.1 MHz — a useful sanity check on the inverse-square-root dependence.</p>` },
      { q: String.raw`A receiver channel is 200 kHz wide at $f_0=900$ MHz. What loaded $Q$ must the channel-select filter have, and comment on realisability at RF vs at a 45 MHz IF.`, solution: String.raw`<p><b>Formula.</b> The required loaded quality factor for a channel of width $\text{BW}$ at centre $f_0$ is $$Q_L=\frac{f_0}{\text{BW}}.$$ The same absolute bandwidth at a lower IF needs a proportionally lower $Q$.</p>
<p><b>Substitute.</b> $$Q_{L,\text{RF}}=\frac{900\times10^{6}}{200\times10^{3}},\qquad Q_{L,\text{IF}}=\frac{45\times10^{6}}{200\times10^{3}}.$$</p>
<p><b>Compute.</b> At 900 MHz: $Q_{L}=900\times10^{6}/2\times10^{5}=4500$. At the 45 MHz IF: $Q_L=45\times10^{6}/2\times10^{5}=225$.</p>
<p><b>Explanation.</b> A $Q$ of 4500 at 900 MHz is extremely hard for a lumped/LC filter (and would carry high insertion loss), whereas a $Q$ of 225 at 45 MHz is readily met by a crystal or SAW filter. This is exactly why receivers down-convert first and do the sharp channel selection at a fixed, lower IF where the required $Q$ is 20× smaller.</p>` },
      { q: String.raw`A single-resonator BPF has unloaded $Q_u=200$ and is loaded to $Q_L=100$ to set its bandwidth. Estimate the mid-band insertion loss.`, solution: String.raw`<p><b>Formula.</b> The mid-band insertion loss of a single resonator is $$\text{IL}\approx-20\log_{10}\!\left(1-\frac{Q_L}{Q_u}\right)\ \text{dB},$$ where $Q_L$ is the loaded (bandwidth-setting) $Q$ and $Q_u$ the resonator's unloaded $Q$.</p>
<p><b>Substitute.</b> $$\text{IL}\approx-20\log_{10}\!\left(1-\frac{100}{200}\right).$$</p>
<p><b>Compute.</b> $Q_L/Q_u=0.5$, so the argument is $1-0.5=0.5$; $\text{IL}=-20\log_{10}(0.5)=-20\times(-0.301)=6.0$ dB.</p>
<p><b>Explanation.</b> Loading the resonator to half its unloaded $Q$ costs about 6 dB of insertion loss — the fundamental selectivity-vs-loss trade. If we demanded a narrower band ($Q_L$ closer to 200) the loss would climb sharply; to keep the same bandwidth at lower loss we would need a higher-$Q_u$ resonator (e.g. a cavity or crystal), which is why sharp low-loss filters are physically large or use special materials.</p>` }
    ],
    realWorld: String.raw`<p>Band-pass filters are everywhere in radio hardware. The classic 455 kHz and 10.7 MHz <a href="#intermediate-frequency">IF</a> filters in AM/FM receivers, the SAW filters that define the channel in a phone's cellular front-end, and the cavity/ceramic filters bolted to a base-station duplexer are all BPFs. In a <a href="#superheterodyne">superheterodyne</a> receiver a broad tunable RF preselector knocks down the <a href="#image-frequency">image</a> before the <a href="#mixer">mixer</a>, then a fixed high-$Q$ crystal or SAW filter at the IF defines the exact channel bandwidth and sets adjacent-channel rejection — putting the sharp selectivity where high $Q$ is cheap. Test-and-measurement gear uses tunable YIG band-pass filters spanning octaves, and in software-defined radios a digital band-pass (FIR/IIR) does the same job after the ADC. The universal design tension — narrow bandwidth demands high $Q$, high $Q$ costs insertion loss and physical size — drives the whole architecture: down-convert first, filter sharply at a low IF, and reserve the wideband RF filter for gross image and out-of-band rejection.</p>`,
    related: ['filters', 'lpf', 'hpf', 'image-frequency', 'intermediate-frequency']
  }
);
