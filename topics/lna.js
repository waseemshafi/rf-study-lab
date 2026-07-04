// Low-Noise Amplifier (LNA): the receiver's first active stage.
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'lna',
    title: 'Low-Noise Amplifier (LNA)',
    category: 'RF Front-End & Receivers',
    tags: ['noise figure', 'Friis', 'gain', 'linearity', 'IP3', 'cascode', 'inductive degeneration', 'stability'],
    summary: String.raw`A low-noise amplifier is the receiver's first active gain stage; by Friis' cascade formula its own noise figure and gain dominate the whole chain's noise figure, so a high-gain, low-NF LNA sets the receiver's ultimate sensitivity.`,
    diagram: [
      {
        title: String.raw`Where the LNA sits in the receive chain`,
        svg: String.raw`<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr-lna" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">The LNA is the first active stage after the antenna</text>
          <path d="M20,70 l0,-22 l18,11 z" fill="#1c232e" stroke="#9aa7b5"/><line x1="29" y1="70" x2="29" y2="92" stroke="#9aa7b5"/>
          <text x="29" y="108" fill="#9aa7b5" font-size="10" text-anchor="middle">antenna</text>
          <line x1="42" y1="59" x2="74" y2="59" stroke="#9aa7b5" marker-end="url(#arr-lna)"/>
          <rect x="76" y="40" width="78" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="115" y="58" fill="#e6edf3" text-anchor="middle" font-size="11">preselect</text><text x="115" y="72" fill="#9aa7b5" text-anchor="middle" font-size="9">BPF</text>
          <line x1="154" y1="59" x2="186" y2="59" stroke="#9aa7b5" marker-end="url(#arr-lna)"/>
          <rect x="188" y="40" width="78" height="40" rx="6" fill="#1c232e" stroke="#63e6be" stroke-width="2"/><text x="227" y="58" fill="#63e6be" text-anchor="middle" font-size="12">LNA</text><text x="227" y="72" fill="#9aa7b5" text-anchor="middle" font-size="9">G1, F1</text>
          <line x1="266" y1="59" x2="298" y2="59" stroke="#9aa7b5" marker-end="url(#arr-lna)"/>
          <rect x="300" y="40" width="78" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="339" y="58" fill="#e6edf3" text-anchor="middle" font-size="11">mixer</text><text x="339" y="72" fill="#9aa7b5" text-anchor="middle" font-size="9">G2, F2</text>
          <line x1="378" y1="59" x2="410" y2="59" stroke="#9aa7b5" marker-end="url(#arr-lna)"/>
          <rect x="412" y="40" width="90" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="457" y="58" fill="#e6edf3" text-anchor="middle" font-size="11">IF amp / ADC</text><text x="457" y="72" fill="#9aa7b5" text-anchor="middle" font-size="9">G3, F3</text>
          <text x="227" y="128" fill="#63e6be" text-anchor="middle" font-size="11">high gain here divides all later noise</text>
          <text x="270" y="148" fill="#9aa7b5" text-anchor="middle" font-size="10">only the passive BPF loss precedes it — keep that loss tiny</text>
        </svg>`,
        caption: String.raw`The LNA follows the antenna and a low-loss preselect filter and precedes the mixer. Because it is the first gain stage, its gain G1 and noise figure F1 set the tone for the whole receiver.`
      },
      {
        title: String.raw`Why F1 and G1 dominate — the Friis cascade`,
        svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr2-lna" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Friis: later-stage noise is divided by preceding gain</text>
          <rect x="30" y="46" width="120" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="90" y="66" fill="#63e6be" text-anchor="middle">LNA</text><text x="90" y="83" fill="#9aa7b5" text-anchor="middle" font-size="10">F1, G1</text>
          <rect x="210" y="46" width="120" height="46" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="270" y="66" fill="#e6edf3" text-anchor="middle">stage 2</text><text x="270" y="83" fill="#9aa7b5" text-anchor="middle" font-size="10">F2, G2</text>
          <rect x="390" y="46" width="120" height="46" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="450" y="66" fill="#e6edf3" text-anchor="middle">stage 3</text><text x="450" y="83" fill="#9aa7b5" text-anchor="middle" font-size="10">F3, G3</text>
          <line x1="150" y1="69" x2="210" y2="69" stroke="#9aa7b5" marker-end="url(#arr2-lna)"/>
          <line x1="330" y1="69" x2="390" y2="69" stroke="#9aa7b5" marker-end="url(#arr2-lna)"/>
          <text x="270" y="140" fill="#e6edf3" text-anchor="middle" font-size="13">F = F1 + (F2 − 1)/G1 + (F3 − 1)/(G1 G2) + …</text>
          <text x="270" y="170" fill="#63e6be" text-anchor="middle" font-size="11">large G1 shrinks every later term → total NF ≈ F1</text>
          <text x="270" y="188" fill="#9aa7b5" text-anchor="middle" font-size="10">so make stage 1 low-noise AND high-gain</text>
        </svg>`,
        caption: String.raw`In the Friis cascade each stage's excess noise (F−1) is divided by the total gain ahead of it. A high LNA gain G1 crushes the contribution of the mixer and everything after, so the total noise figure collapses toward F1.`
      },
      {
        title: String.raw`The gain–noise–linearity design triangle`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr3-lna" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Every LNA is a compromise between three specs</text>
          <polygon points="270,42 90,168 450,168" fill="none" stroke="#9aa7b5"/>
          <rect x="222" y="30" width="96" height="26" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="270" y="47" fill="#63e6be" text-anchor="middle" font-size="11">low NF</text>
          <rect x="34" y="158" width="112" height="26" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="90" y="175" fill="#4dabf7" text-anchor="middle" font-size="11">high gain</text>
          <rect x="392" y="158" width="128" height="26" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="456" y="175" fill="#ffa94d" text-anchor="middle" font-size="11">linearity (IP3)</text>
          <text x="150" y="105" fill="#9aa7b5" font-size="10" transform="rotate(-35 150 105)">more current</text>
          <text x="378" y="105" fill="#9aa7b5" font-size="10" transform="rotate(35 378 105)">bias vs noise</text>
          <text x="270" y="150" fill="#9aa7b5" font-size="10" text-anchor="middle">gain vs headroom</text>
          <text x="270" y="200" fill="#b197fc" font-size="10" text-anchor="middle">noise match Γopt ≠ power/return-loss match — you cannot have both perfectly</text>
        </svg>`,
        caption: String.raw`An LNA trades low noise figure, high gain, linearity (IP3/P1dB) and input match against one another. Crucially the optimum-noise source impedance Γopt generally differs from the conjugate power/return-loss match, so input matching is itself a compromise.`
      }
    ],
    prerequisites: ['noise-figure', 'noise'],
    intro: String.raw`<p><b>Why does the LNA exist and why does it matter more than any other amplifier in the receiver?</b> A radio signal arriving at an antenna may be only a few microvolts — often buried close to the thermal-noise floor. Every real component adds noise of its own, and once noise is added it can never be removed. The battle for sensitivity is therefore won or lost in the very first stage: whatever noise that stage contributes, and whatever gain it provides, fixes the noise contribution of everything downstream. The low-noise amplifier exists to add as little noise as possible while providing enough gain that the mixer, IF chain and ADC — all noisier — no longer matter. Get the LNA right and the receiver approaches the theoretical sensitivity limit; get it wrong and no amount of clever processing later can recover the lost signal-to-noise ratio.</p>
    <p>A <b>Low-Noise Amplifier (LNA)</b> is the first active gain block after the antenna and preselect filter. Its job is captured by <b>Friis' cascade formula</b>, $F=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1 G_2}+\cdots$: a low first-stage noise figure $F_1$ combined with high first-stage gain $G_1$ makes the total noise figure collapse toward $F_1$. Mastering the LNA means understanding four coupled specifications — <b>noise figure</b>, <b>gain</b>, <b>linearity</b> (IP3 and P1dB), and <b>input match</b> — plus <b>stability</b> and the key fact that the impedance for minimum noise ($\Gamma_{opt}$) is not the same as the impedance for maximum power transfer or best return loss.</p>`,
    sections: [
      {
        h: 'What an LNA is and where it sits',
        html: String.raw`<p>The receive chain begins at the antenna, passes through a low-loss <b>preselect band-pass filter</b> (to reject out-of-band interferers and the image), and then reaches the <b>LNA</b> — the first active device. After the LNA comes the mixer (down-conversion), IF filtering/amplification, and finally the ADC. The ordering is deliberate: the only thing allowed to precede the LNA is passive, low-loss filtering, because any loss there adds directly to the system noise figure with no gain to hide behind.</p>
        <p>The LNA's mandate is deceptively simple: <b>amplify the wanted signal while adding the least possible noise.</b> But that mandate collides with several others — it must present a decent input match to the antenna/filter (so the filter behaves and reflections do not cause ripple), it must be linear enough that strong nearby signals do not create intermodulation products in-band, and it must be unconditionally stable so it never oscillates. These requirements pull in different directions, which is what makes LNA design an art.</p>
        <div class="callout tip"><b>Key intuition:</b> the LNA is the receiver's "ears." Noise it adds is indistinguishable from noise that was on the signal to begin with, and no downstream processing can undo it. That is why the first stage gets a dedicated, carefully optimised amplifier rather than a general-purpose one.</div>`
      },
      {
        h: 'Noise figure and why the first stage dominates',
        html: String.raw`<p><b>Noise figure</b> (NF) quantifies how much an element degrades the signal-to-noise ratio: $F=\text{SNR}_{in}/\text{SNR}_{out}$ (linear noise factor), or $\text{NF}=10\log_{10}F$ in dB. An ideal noiseless amplifier has $F=1$ (NF = 0 dB); every real device has $F>1$.</p>
        <p>The reason the <i>first</i> stage dominates is <b>Friis' cascade formula</b>:</p>
        <p>$$F_{total}=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1 G_2}+\cdots+\frac{F_n-1}{G_1 G_2\cdots G_{n-1}}.$$</p>
        <p>Read the structure carefully. The first stage contributes its full noise factor $F_1$. Every later stage contributes only its <i>excess</i> noise $(F_k-1)$, and that excess is <b>divided by the product of all gains ahead of it</b>. So if $G_1$ is large (say 15–20 dB, i.e. 30–100 linear), the mixer's contribution $(F_2-1)/G_1$ is shrunk by that factor, and the third stage's by even more.</p>
        <div class="callout tip"><b>Consequence:</b> a good LNA wants <b>both</b> a low $F_1$ <b>and</b> a high $G_1$. Low $F_1$ minimises the leading term; high $G_1$ minimises every trailing term. This is why an LNA is specified for gain <i>and</i> noise, not noise alone — a low-NF stage with too little gain still lets the mixer dominate.</div>`
      },
      {
        h: 'Gain, linearity and the noise–linearity trade',
        html: String.raw`<p><b>Gain</b> ($G_1$) does double duty: it lifts the tiny signal above downstream noise <i>and</i> it suppresses downstream noise contributions via Friis. But gain is not free — more gain generally means the signal reaches larger swings sooner, eroding <b>linearity</b>.</p>
        <p>Linearity is characterised by two numbers:</p>
        <ul>
          <li><b>P1dB (1-dB compression point):</b> the input (or output) power at which gain has dropped 1 dB from its small-signal value — the onset of saturation.</li>
          <li><b>IP3 (third-order intercept):</b> the extrapolated point where third-order intermodulation products would equal the fundamental. Higher IP3 means two strong interferers produce weaker in-band IM3 spurs. IIP3 (input-referred) is the usual figure of merit.</li>
        </ul>
        <p>The tension: pushing for the lowest NF often means a device biased and matched for noise, not for headroom; pushing for high IP3 usually costs current (power) and sometimes noise. A receiver's <b>spurious-free dynamic range</b> is bounded below by the noise floor (set by NF) and above by IM3 (set by IIP3), so the LNA sits between two walls it partly sets itself.</p>
        <div class="callout tip"><b>Rule of thumb:</b> add just enough gain to make the mixer's Friis contribution negligible, but no more — excess LNA gain wastes linearity and dynamic range by presenting downstream stages with larger signals than necessary.</div>`
      },
      {
        h: 'Input matching: noise match vs power match',
        html: String.raw`<p>Here is the subtlety that separates textbook amplifiers from real LNAs. A transistor has a specific source reflection coefficient, $\Gamma_{opt}$ (equivalently a source impedance $Z_{opt}$), that yields the <b>minimum noise figure</b> $F_{min}$. It also has a different impedance that yields <b>maximum power transfer / best return loss</b> (the conjugate match, $\Gamma_S=\Gamma_{in}^*$). In general these two are <b>not the same point</b> on the Smith chart.</p>
        <p>The noise figure of any two-port as a function of source admittance $Y_S=G_S+jB_S$ is:</p>
        <p>$$F=F_{min}+\frac{R_n}{G_S}\left|Y_S-Y_{opt}\right|^2,$$</p>
        <p>where $R_n$ is the equivalent noise resistance (how sharply NF worsens as you move away from $Y_{opt}$). The designer must therefore choose a source impedance that is a <i>compromise</i> between $Y_{opt}$ (best noise) and the conjugate match (best return loss / power). A high $R_n$ device is unforgiving; a low $R_n$ device tolerates a match placed for return loss without much noise penalty.</p>
        <div class="callout tip"><b>Design trick:</b> <b>inductive source degeneration</b> is the classic way out. A small inductor in the source of a common-source FET creates a real input resistance (from the $g_m L_s/C_{gs}$ term) <i>without</i> adding thermal noise like a physical resistor would, letting $\Gamma_{opt}$ and the $50\,\Omega$ input match be brought close together simultaneously.</div>`
      },
      {
        h: 'Stability, reverse isolation and topologies',
        html: String.raw`<p>An amplifier that oscillates is useless. <b>Stability</b> is checked with the <b>Rollett stability factor</b> $k$ (and $|\Delta|$): the amplifier is <b>unconditionally stable</b> when $k>1$ and $|\Delta|<1$, meaning it will not oscillate for <i>any</i> passive source and load. Because the antenna/filter impedance and the mixer input can vary, LNAs are usually designed for unconditional stability, sometimes trading a little gain or NF for margin.</p>
        <p><b>Reverse isolation</b> ($S_{12}$) matters too: it keeps the LO leakage and mixer reflections from getting back to the antenna (re-radiation) and stops the LNA's input match from being pulled by the mixer. Common topologies:</p>
        <ul>
          <li><b>Inductive-degeneration common-source (CS):</b> the workhorse. A source inductor sets a real, noiseless input resistance and aligns $\Gamma_{opt}$ with $50\,\Omega$. Excellent NF; moderate reverse isolation.</li>
          <li><b>Cascode (CS + common-gate on top):</b> stacks a common-gate device above the CS device. Greatly improves <b>reverse isolation</b> and gain, reduces the Miller effect, and improves stability — at the cost of headroom (two stacked transistors need more supply voltage). This is the most common integrated LNA.</li>
          <li><b>Common-gate:</b> gives a broadband, robust input match ($1/g_m \approx 50\,\Omega$) with good linearity, but a higher noise-figure floor.</li>
        </ul>
        <div class="callout tip"><b>Why cascode wins:</b> the common-gate top device shields the input from the output, so $S_{12}$ shrinks — the input match no longer depends on the load, stability improves, and the Miller capacitance of the input device is bootstrapped away, extending bandwidth.</div>`
      },
      {
        h: 'Noise temperature: an equivalent view',
        html: String.raw`<p>An alternative, often more convenient description in low-noise systems is the <b>equivalent noise temperature</b> $T_e$. Instead of saying an amplifier has noise factor $F$, we say it adds as much noise as a resistor at temperature $T_e$ placed at its input:</p>
        <p>$$T_e=(F-1)\,T_0,\qquad T_0=290\text{ K}.$$</p>
        <p>Noise temperature makes cascades transparent — Friis in temperature form is $T_e=T_{e1}+T_{e2}/G_1+T_{e3}/(G_1 G_2)+\cdots$, with no "$-1$" clutter — and it is the natural language of radio astronomy and satellite ground stations, where a cryogenically cooled LNA might have $T_e$ of just a few kelvin (an NF far below 1 dB).</p>
        <p>The equivalence is exact: an LNA with NF = 1 dB has $F=10^{0.1}\approx1.259$, so $T_e=(1.259-1)\times290\approx75$ K. This is why a "1 dB NF" LNA and a "75 K" LNA are the same device described in two vocabularies.</p>
        <div class="callout tip"><b>When to use which:</b> use noise <b>figure</b> (dB) for terrestrial links where the antenna sees ~290 K anyway; use noise <b>temperature</b> when the antenna is cold (pointed at the sky) so that even sub-1-dB differences in NF change sensitivity dramatically.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Why the first stage rules:</b> Friis' formula $F=F_1+(F_2-1)/G_1+(F_3-1)/(G_1 G_2)+\cdots$ divides every later stage's excess noise by the preceding gain, so a low-$F_1$, high-$G_1$ LNA makes total NF collapse toward $F_1$ — and thereby sets receiver sensitivity.</li>
<li><b>The coupled specs:</b> gain, noise figure, and linearity (P1dB, IIP3) trade against one another; enough gain to bury the mixer's Friis term, but not so much that dynamic range and headroom suffer.</li>
<li><b>Match is a compromise:</b> $\Gamma_{opt}$ (minimum-noise source impedance) generally differs from the conjugate power/return-loss match; $F=F_{min}+(R_n/G_S)|Y_S-Y_{opt}|^2$ quantifies the penalty, and inductive degeneration reconciles the two noiselessly.</li>
<li><b>Stability and isolation:</b> design for $k>1,\,|\Delta|<1$ (unconditional stability); reverse isolation $S_{12}$ prevents LO re-radiation and load-pulling of the input match — the cascode is the standard fix.</li>
<li><b>Two vocabularies for the same noise:</b> $T_e=(F-1)T_0$ links noise figure and noise temperature; temperature is the natural unit for cold-antenna (satellite/radio-astronomy) links.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`The LNA is the receiver's first active stage; only passive low-loss filtering may precede it, because pre-LNA loss adds directly to system NF.`,
      String.raw`Friis: $F=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1 G_2}+\cdots$ — later stages' excess noise is divided by the gain ahead of them.`,
      String.raw`Design goal: low $F_1$ AND high $G_1$; low $F_1$ minimises the leading term, high $G_1$ crushes every trailing term so total NF $\to F_1$.`,
      String.raw`Key specs are coupled: gain, noise figure, and linearity (P1dB, IIP3) trade off — more gain often costs headroom and dynamic range.`,
      String.raw`The minimum-noise source impedance $\Gamma_{opt}$ generally differs from the conjugate power/return-loss match; input matching is a compromise.`,
      String.raw`$F=F_{min}+\frac{R_n}{G_S}|Y_S-Y_{opt}|^2$: $R_n$ sets how quickly NF worsens as the source departs from $Y_{opt}$.`,
      String.raw`Inductive source degeneration creates a real, noiseless input resistance, aligning $\Gamma_{opt}$ with $50\,\Omega$ — the classic low-NF matching trick.`,
      String.raw`Unconditional stability requires the Rollett factor $k>1$ and $|\Delta|<1$; LNAs are designed stable for any passive source/load.`,
      String.raw`Reverse isolation $S_{12}$ prevents LO re-radiation and stops the mixer from pulling the input match; the cascode topology improves it markedly.`,
      String.raw`Noise temperature $T_e=(F-1)T_0$ (with $T_0=290$ K) is the natural low-noise unit; a 1 dB NF LNA equals $T_e\approx75$ K.`,
      String.raw`Common topologies: inductive-degeneration CS (best NF), cascode (best isolation/gain/stability), common-gate (broadband robust match, higher NF).`
    ],
    equations: [
      {
        title: 'Friis cascaded noise factor',
        tex: String.raw`$$F=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1 G_2}+\cdots+\frac{F_n-1}{\prod_{k=1}^{n-1}G_k}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Noise factor is $F=\text{SNR}_{in}/\text{SNR}_{out}$. Equivalently, referred to the input, $F=N_{out}/(G\,N_{in})$ where $N_{in}=kT_0B$ is the available input noise from a source at the standard temperature $T_0=290$ K. We build a two-stage cascade, then generalise.</p>
        <p><b>Step 1 — noise added by a single stage.</b> A stage with gain $G$ and noise factor $F$, driven by input noise $N_{in}=kT_0B$, outputs total noise $N_{out}=F\,G\,kT_0B$. Of this, $G\,kT_0B$ is the amplified source noise and the remainder $N_{add}=(F-1)G\,kT_0B$ is the noise the stage <i>adds</i>, referred to its output. Referred to its input the added noise is $(F-1)kT_0B$.</p>
        <p><b>Step 2 — cascade two stages.</b> Stage 1 ($F_1,G_1$) feeds stage 2 ($F_2,G_2$). At the output of stage 2 the total noise is the source noise amplified by both stages, plus stage 1's added noise amplified by stage 2, plus stage 2's own added noise:</p>
        $$N_{out}=kT_0B\,G_1G_2+(F_1-1)kT_0B\,G_1G_2+(F_2-1)kT_0B\,G_2.$$
        <p><b>Step 3 — form the overall noise factor.</b> Divide the total output noise by the amplified source noise $G_1G_2\,kT_0B$:</p>
        $$F=\frac{N_{out}}{G_1G_2\,kT_0B}=1+(F_1-1)+\frac{F_2-1}{G_1}=F_1+\frac{F_2-1}{G_1}.$$
        <p><b>Step 4 — extend to $n$ stages.</b> Repeating the bookkeeping, each stage $k$ adds $(F_k-1)$ referred to its own input, which becomes $(F_k-1)/(G_1\cdots G_{k-1})$ referred to the system input:</p>
        $$F=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1G_2}+\cdots.$$
        <p><b>Result / sanity check.</b> With a noiseless first stage ($F_1=1$) of high gain, $F\to1$: the receiver is only as noisy as its leading stage lets it be. If $G_1$ is large, every trailing term $\to0$ and $F\approx F_1$ — the entire justification for the LNA.</p>`
      },
      {
        title: 'Noise factor to noise figure (dB)',
        tex: String.raw`$$\text{NF}=10\log_{10}F,\qquad F=10^{\text{NF}/10}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The linear <b>noise factor</b> $F$ is a power ratio ($\text{SNR}_{in}/\text{SNR}_{out}$); engineers quote the logarithmic <b>noise figure</b> $\text{NF}$ in decibels. We convert between them and show why cascades must be done in linear terms.</p>
        <p><b>Step 1 — the decibel definition for a power ratio.</b> Any dimensionless power ratio $x$ expressed in decibels is $x_{\text{dB}}=10\log_{10}x$. Since $F$ is the ratio of two SNRs (both powers), it is a power ratio, so its decibel form uses the factor 10, not 20:</p>
        $$\text{NF}=10\log_{10}F.$$
        <p><b>Step 2 — invert.</b> Solving for $F$ gives $F=10^{\text{NF}/10}$. Two anchor values: $\text{NF}=0$ dB $\Rightarrow F=1$ (noiseless); $\text{NF}=3$ dB $\Rightarrow F=10^{0.3}\approx2$ (SNR halved).</p>
        <p><b>Step 3 — why you must convert before Friis.</b> Friis' formula is a sum of <i>linear</i> factors divided by <i>linear</i> gains. Decibels do not add that way, so you convert each stage's NF and gain to linear ($F_k=10^{\text{NF}_k/10}$, $G_k=10^{G_{k,\text{dB}}/10}$), apply Friis, then convert the total back: $\text{NF}_{total}=10\log_{10}F_{total}$.</p>
        <p><b>Result / sanity check.</b> A stage with $\text{NF}=1$ dB has $F=10^{0.1}\approx1.259$; a 10 dB NF mixer has $F=10$. Feeding these into Friis with a high LNA gain confirms the mixer's contribution nearly vanishes — the reason "NF in dB" is only a display format, never the arithmetic.</p>`
      },
      {
        title: 'Effective input-referred noise temperature',
        tex: String.raw`$$T_e=(F-1)\,T_0,\qquad T_e=T_{e1}+\frac{T_{e2}}{G_1}+\frac{T_{e3}}{G_1 G_2}+\cdots$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want to describe an amplifier's added noise as if it came from a resistor at some temperature at its input. This "effective noise temperature" $T_e$ is the natural unit whenever the source is not at $290$ K (e.g. a cold sky).</p>
        <p><b>Step 1 — available noise power of a source.</b> A matched resistor at temperature $T$ delivers available noise power $N=kTB$ into a bandwidth $B$ ($k$ Boltzmann's constant). The standard reference source is at $T_0=290$ K, giving $N_0=kT_0B$.</p>
        <p><b>Step 2 — write the amplifier's added noise two ways.</b> From the noise-factor definition, the noise the amplifier adds referred to its input is $N_{add}=(F-1)kT_0B$. By definition of $T_e$, that same added noise equals a source resistor at $T_e$: $N_{add}=kT_eB$. Equating the two:</p>
        $$kT_eB=(F-1)kT_0B\ \Longrightarrow\ T_e=(F-1)T_0.$$
        <p><b>Step 3 — cascade in temperature form.</b> Substitute $F_k=1+T_{ek}/T_0$ into Friis. Each "$F_k-1$" becomes simply $T_{ek}/T_0$, and the $kT_0B$ factors cancel throughout, giving the clean cascade</p>
        $$T_e=T_{e1}+\frac{T_{e2}}{G_1}+\frac{T_{e3}}{G_1G_2}+\cdots.$$
        <p><b>Result / sanity check.</b> $\text{NF}=1$ dB $\Rightarrow F=1.259 \Rightarrow T_e=(1.259-1)\times290\approx75$ K. A cryogenic LNA with $T_e=15$ K has $F=1+15/290\approx1.052$, i.e. $\text{NF}\approx0.22$ dB — sub-dB noise figures are exactly where temperature units earn their keep, since the "$-1$" clutter disappears and small differences become visible.</p>`
      },
      {
        title: 'Noise figure vs source admittance',
        tex: String.raw`$$F=F_{min}+\frac{R_n}{G_S}\,\left|Y_S-Y_{opt}\right|^2$$`,
        derivation: String.raw`<p><b>Where we start.</b> A two-port's noise figure depends on the impedance the source presents. We want the functional form so we can see how far the noise-optimum source differs from the power-match source.</p>
        <p><b>Step 1 — represent device noise by two correlated generators.</b> Any noisy two-port can be modelled by an equivalent input voltage-noise generator $v_n$ and current-noise generator $i_n$ (correlated). The output noise, and hence the noise factor, depends on how these combine with the source admittance $Y_S=G_S+jB_S$ driving the input.</p>
        <p><b>Step 2 — minimise over the source.</b> Writing $F$ in terms of $v_n$, $i_n$ and their correlation, and completing the square in $Y_S$, the algebra collapses to a paraboloid in the admittance plane with a single minimum. Define $F_{min}$ as that minimum, $Y_{opt}=G_{opt}+jB_{opt}$ as the admittance where it occurs, and $R_n=|v_n|^2/(4kT_0B)$ as the equivalent noise resistance. The result is</p>
        $$F=F_{min}+\frac{R_n}{G_S}\left|Y_S-Y_{opt}\right|^2.$$
        <p><b>Step 3 — interpret.</b> $F$ rises quadratically as the source moves away from $Y_{opt}$; $R_n$ scales how steep that bowl is. A large $R_n$ means NF degrades fast, forcing the match near $Y_{opt}$; a small $R_n$ tolerates a match placed for return loss instead.</p>
        <p><b>Result / sanity check.</b> At $Y_S=Y_{opt}$ the last term is zero and $F=F_{min}$, as required. Because the conjugate power match sets $Y_S=Y_{in}^*$ — generally $\neq Y_{opt}$ — the equation makes precise the central LNA compromise between noise match and power/return-loss match, and motivates inductive degeneration to drag the two together.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Where does the LNA sit in a receiver, and why there?`, back: String.raw`Immediately after the antenna and low-loss preselect filter — it is the first active stage. Only passive low-loss filtering may precede it, because pre-LNA loss adds directly to system NF.` },
      { front: String.raw`State Friis' cascaded noise-factor formula.`, back: String.raw`$F=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1 G_2}+\cdots$ — each stage's excess noise is divided by the gain preceding it.` },
      { front: String.raw`Why must an LNA have high gain, not just low NF?`, back: String.raw`High $G_1$ divides down every later stage's Friis term $(F_k-1)/(G_1\cdots)$, so a low-NF but low-gain stage still lets the mixer dominate.` },
      { front: String.raw`Convert noise factor $F$ to noise figure and back.`, back: String.raw`$\text{NF}=10\log_{10}F$; $F=10^{\text{NF}/10}$. NF = 3 dB $\Rightarrow F\approx2$; NF = 0 dB $\Rightarrow F=1$.` },
      { front: String.raw`What is P1dB?`, back: String.raw`The 1-dB compression point: the input/output power where gain has dropped 1 dB from small-signal — the onset of saturation.` },
      { front: String.raw`What is IIP3 and why does it matter for an LNA?`, back: String.raw`Input third-order intercept: extrapolated point where IM3 products equal the fundamental. Higher IIP3 means strong nearby interferers create weaker in-band spurs — sets the top of dynamic range.` },
      { front: String.raw`Why is $\Gamma_{opt}$ not the same as the power/return-loss match?`, back: String.raw`The minimum-noise source impedance $\Gamma_{opt}$ generally differs from the conjugate match $\Gamma_S=\Gamma_{in}^*$. Input matching is therefore a compromise between best noise and best return loss.` },
      { front: String.raw`What does $R_n$ tell you in $F=F_{min}+\frac{R_n}{G_S}|Y_S-Y_{opt}|^2$?`, back: String.raw`How sharply NF degrades as the source departs from $Y_{opt}$. Large $R_n$ = unforgiving (match near $Y_{opt}$); small $R_n$ = tolerant.` },
      { front: String.raw`Why use inductive source degeneration?`, back: String.raw`A source inductor creates a real input resistance ($\approx g_m L_s/C_{gs}\cdot$ term) without the thermal noise of a physical resistor, aligning $\Gamma_{opt}$ with $50\,\Omega$.` },
      { front: String.raw`Condition for unconditional stability?`, back: String.raw`Rollett factor $k>1$ and $|\Delta|<1$: the amplifier will not oscillate for any passive source and load impedance.` },
      { front: String.raw`Why does reverse isolation ($S_{12}$) matter in an LNA?`, back: String.raw`It stops LO leakage/mixer reflections re-radiating from the antenna and prevents the mixer from pulling the LNA input match. The cascode improves it.` },
      { front: String.raw`Give the noise-temperature equivalent of noise factor.`, back: String.raw`$T_e=(F-1)T_0$ with $T_0=290$ K. A 1 dB NF LNA ($F\approx1.259$) has $T_e\approx75$ K.` },
      { front: String.raw`Why does the cascode topology beat a plain common-source LNA?`, back: String.raw`The common-gate top device shields input from output: better reverse isolation, higher gain, reduced Miller effect, improved stability — at the cost of headroom.` },
      { front: String.raw`When do you prefer noise temperature over noise figure?`, back: String.raw`When the antenna is cold (sky-pointing satellite/radio-astronomy links): sub-1-dB NF differences change sensitivity a lot, and $T_e$ makes them visible.` }
    ],
    mcqs: [
      { q: String.raw`In Friis' formula, the noise contribution of the second stage is:`, options: [String.raw`$F_2$`, String.raw`$(F_2-1)G_1$`, String.raw`$(F_2-1)/G_1$`, String.raw`$F_2/G_1$`], answer: 2, explain: String.raw`Each later stage contributes its excess noise $(F_2-1)$ divided by the gain ahead of it, $G_1$.` },
      { q: String.raw`Why is the LNA placed first in the receive chain?`, options: [String.raw`It is the cheapest component`, String.raw`Its gain and low NF set the system noise figure via Friis`, String.raw`It rejects the image`, String.raw`It provides the LO`], answer: 1, explain: String.raw`Friis makes the first stage's $F_1$ and $G_1$ dominate the total NF, so the low-noise stage must come first.` },
      { q: String.raw`An LNA has NF = 1 dB. Its linear noise factor is approximately:`, options: [String.raw`0.90`, String.raw`1.00`, String.raw`1.26`, String.raw`2.00`], answer: 2, explain: String.raw`$F=10^{1/10}=10^{0.1}\approx1.259$.` },
      { q: String.raw`Increasing LNA gain $G_1$ (all else equal) causes the total NF to:`, options: [String.raw`Increase toward $F_2$`, String.raw`Decrease toward $F_1$`, String.raw`Stay exactly at $F_2$`, String.raw`Become independent of $F_1$`], answer: 1, explain: String.raw`Larger $G_1$ shrinks every trailing Friis term, so $F_{total}\to F_1$.` },
      { q: String.raw`The source impedance for minimum noise figure ($\Gamma_{opt}$) is:`, options: [String.raw`Always equal to the conjugate power match`, String.raw`Always $50\,\Omega$`, String.raw`Generally different from the conjugate power/return-loss match`, String.raw`Purely reactive`], answer: 2, explain: String.raw`$\Gamma_{opt}$ generally differs from the conjugate match, so input matching is a noise-vs-return-loss compromise.` },
      { q: String.raw`In $F=F_{min}+\frac{R_n}{G_S}|Y_S-Y_{opt}|^2$, a large $R_n$ means:`, options: [String.raw`NF is insensitive to source impedance`, String.raw`NF degrades quickly away from $Y_{opt}$`, String.raw`The device is unconditionally stable`, String.raw`Gain is very high`], answer: 1, explain: String.raw`$R_n$ scales the quadratic penalty; large $R_n$ makes NF rise steeply as $Y_S$ leaves $Y_{opt}$.` },
      { q: String.raw`Inductive source degeneration is used to:`, options: [String.raw`Add a physical resistor for matching`, String.raw`Create a real input resistance without adding thermal noise`, String.raw`Increase reverse gain`, String.raw`Lower the supply voltage`], answer: 1, explain: String.raw`The source inductor synthesises a real input resistance noiselessly, aligning $\Gamma_{opt}$ with $50\,\Omega$.` },
      { q: String.raw`An amplifier is unconditionally stable when:`, options: [String.raw`$k<1$ and $|\Delta|>1$`, String.raw`$k>1$ and $|\Delta|<1$`, String.raw`$k=0$`, String.raw`$S_{12}=1$`], answer: 1, explain: String.raw`Rollett's criterion: $k>1$ and $|\Delta|<1$ guarantees no oscillation for any passive source/load.` },
      { q: String.raw`The main advantage of the cascode LNA topology is:`, options: [String.raw`Lower supply voltage`, String.raw`Higher reverse isolation and gain, better stability`, String.raw`Elimination of the need for matching`, String.raw`Zero noise figure`], answer: 1, explain: String.raw`The common-gate top device shields input from output, improving $S_{12}$, gain and stability (at a headroom cost).` },
      { q: String.raw`The equivalent noise temperature of an amplifier is:`, options: [String.raw`$T_e=F T_0$`, String.raw`$T_e=(F-1)T_0$`, String.raw`$T_e=T_0/F$`, String.raw`$T_e=(F+1)T_0$`], answer: 1, explain: String.raw`$T_e=(F-1)T_0$ with $T_0=290$ K; it is the input-referred added-noise temperature.` },
      { q: String.raw`Which best captures the LNA linearity trade-off?`, options: [String.raw`More gain always improves IIP3`, String.raw`Pushing for lowest NF and highest IIP3 usually costs current/headroom`, String.raw`Linearity is independent of bias`, String.raw`P1dB and IIP3 are the same number`], answer: 1, explain: String.raw`Low NF and high IIP3 pull against each other and against power; excess gain wastes headroom/dynamic range.` },
      { q: String.raw`Why must NF and gain be converted to linear before applying Friis?`, options: [String.raw`Decibels add in cascades`, String.raw`Friis sums linear factors divided by linear gains, and dB do not add that way`, String.raw`It is only a convention`, String.raw`To avoid negative numbers`], answer: 1, explain: String.raw`Friis is arithmetic on linear $F$ and $G$; you convert dB→linear, apply Friis, then convert back.` }
    ],
    numericals: [
      { q: String.raw`A two-stage chain: stage 1 has NF₁ = 2 dB, G₁ = 12 dB; stage 2 has NF₂ = 8 dB. Find the total noise figure.`, solution: String.raw`<p><b>Formula.</b> Friis for two stages in linear terms: $$F=F_1+\frac{F_2-1}{G_1},\qquad F_k=10^{\text{NF}_k/10},\ G_1=10^{G_{1,\text{dB}}/10},$$ then $\text{NF}_{total}=10\log_{10}F$.</p>
<p><b>Substitute.</b> $F_1=10^{0.2}=1.585$, $F_2=10^{0.8}=6.310$, $G_1=10^{1.2}=15.85$. So $$F=1.585+\frac{6.310-1}{15.85}.$$</p>
<p><b>Compute.</b> Second term $=5.310/15.85=0.335$. Thus $F=1.585+0.335=1.920$, and $\text{NF}_{total}=10\log_{10}(1.920)=2.83$ dB.</p>
<p><b>Explanation.</b> Despite stage 2's poor 8 dB NF, the 12 dB of first-stage gain divides its excess noise by ~16, so the total NF (2.83 dB) is only about 0.83 dB worse than stage 1 alone. This is the LNA principle in one number: gain buys noise immunity for everything downstream.</p>` },
      { q: String.raw`A receiver has an LNA (gain 15 dB, NF 1 dB) followed by a mixer (NF 10 dB). Find the system noise figure. Then compare to having no LNA (mixer first).`, solution: String.raw`<p><b>Formula.</b> $$F=F_1+\frac{F_2-1}{G_1},\quad F_1=10^{1/10},\ F_2=10^{10/10},\ G_1=10^{15/10},\quad \text{NF}=10\log_{10}F.$$</p>
<p><b>Substitute.</b> $F_1=10^{0.1}=1.259$, $F_2=10^{1.0}=10.0$, $G_1=10^{1.5}=31.62$. $$F=1.259+\frac{10.0-1}{31.62}.$$</p>
<p><b>Compute.</b> Second term $=9.0/31.62=0.285$. $F=1.259+0.285=1.544$, so $\text{NF}_{sys}=10\log_{10}(1.544)=1.89$ dB. Without the LNA the mixer is first, so $\text{NF}=10$ dB.</p>
<p><b>Explanation.</b> The LNA drops system NF from 10 dB to 1.89 dB — an 8.1 dB improvement — because its 15 dB gain divides the mixer's excess noise (9.0) by 31.6 down to 0.285. That 8.1 dB directly improves sensitivity by the same amount.</p>` },
      { q: String.raw`Adding the LNA above improved system NF from 10 dB to 1.89 dB. If the noise floor sets sensitivity, by how many dB does sensitivity improve, and what is the new noise floor for B = 1 MHz at 290 K?`, solution: String.raw`<p><b>Formula.</b> Sensitivity (minimum detectable signal) $=kT_0B+\text{NF}+\text{SNR}_{min}$ (all dB). Improvement in sensitivity equals the NF reduction: $\Delta=\text{NF}_{old}-\text{NF}_{new}$. Thermal floor $kT_0B(\text{dBm})=-174+10\log_{10}B$.</p>
<p><b>Substitute.</b> $\Delta=10-1.89$ dB. Noise floor $=-174+10\log_{10}(10^{6})+\text{NF}_{new}=-174+60+1.89$ dBm.</p>
<p><b>Compute.</b> $\Delta=8.11$ dB improvement. Noise floor $=-174+60+1.89=-112.1$ dBm (versus $-174+60+10=-104$ dBm without the LNA).</p>
<p><b>Explanation.</b> Because sensitivity scales one-for-one with NF, cutting NF by 8.11 dB lets the receiver detect signals 8.11 dB weaker. Concretely the effective noise floor drops from $-104$ dBm to $-112.1$ dBm in a 1 MHz bandwidth — the LNA's entire reason for existing.</p>` },
      { q: String.raw`Compare placing a 3 dB-loss cable BEFORE vs AFTER an LNA (gain 20 dB, NF 1.5 dB). Passive loss L has NF = L dB and gain = −L dB. Find system NF for both orders.`, solution: String.raw`<p><b>Formula.</b> Friis: $F=F_1+\frac{F_2-1}{G_1}$. A 3 dB attenuator has $F=10^{3/10}=2.0$ and $G=10^{-3/10}=0.501$. The LNA has $F=10^{1.5/10}=1.413$, $G=10^{20/10}=100$.</p>
<p><b>Substitute.</b> <i>Cable first:</i> $F=2.0+\frac{1.413-1}{0.501}$. <i>LNA first:</i> $F=1.413+\frac{2.0-1}{100}$.</p>
<p><b>Compute.</b> Cable first: $2.0+0.413/0.501=2.0+0.824=2.824\Rightarrow\text{NF}=4.51$ dB. LNA first: $1.413+1.0/100=1.413+0.010=1.423\Rightarrow\text{NF}=1.53$ dB.</p>
<p><b>Explanation.</b> A lossy cable before the LNA adds its full 3 dB and more (NF = 4.51 dB) because there is no gain ahead to divide its noise. Placing the LNA first buries the cable's loss (NF = 1.53 dB, barely worse than the LNA alone). Rule: never put loss ahead of the LNA — mount the LNA at the antenna.</p>` },
      { q: String.raw`A three-stage chain: LNA (NF 1.2 dB, G 14 dB), mixer (NF 9 dB, G 6 dB), IF amp (NF 15 dB). Find the total noise figure.`, solution: String.raw`<p><b>Formula.</b> $$F=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1 G_2},\qquad F_k=10^{\text{NF}_k/10},\ G_k=10^{G_{k,\text{dB}}/10}.$$</p>
<p><b>Substitute.</b> $F_1=10^{0.12}=1.318$, $F_2=10^{0.9}=7.943$, $F_3=10^{1.5}=31.62$; $G_1=10^{1.4}=25.12$, $G_2=10^{0.6}=3.981$, $G_1G_2=100.0$. $$F=1.318+\frac{7.943-1}{25.12}+\frac{31.62-1}{100.0}.$$</p>
<p><b>Compute.</b> Terms: $1.318$; $6.943/25.12=0.2764$; $30.62/100.0=0.3062$. Sum $F=1.318+0.276+0.306=1.900$, so $\text{NF}_{total}=10\log_{10}(1.900)=2.79$ dB.</p>
<p><b>Explanation.</b> Even the very noisy IF amp (15 dB NF) contributes only 0.306 to $F$ because 20 dB of combined LNA+mixer gain sits ahead of it. Note the mixer's only-6 dB gain lets the IF amp still matter; more LNA gain would shrink it further. Total 2.79 dB is dominated by the 1.2 dB LNA plus the modestly-gained mixer.</p>` }
    ],
    realWorld: String.raw`<p>Every GPS receiver, cellular handset, Wi-Fi radio, radar, radio telescope and satellite ground station lives or dies by its LNA. In a GPS front-end the signal arrives roughly 20–30 dB below the thermal-noise floor, so a sub-1-dB-NF LNA mounted right at the antenna (an "active antenna") is mandatory — any cable run is placed <i>after</i> the LNA precisely because of the Friis argument above. In cellular RFICs like the <a href="#ad9361">AD9361</a> family, integrated cascode LNAs with switchable gain feed the down-conversion <a href="#mixer">mixer</a>; their noise figure sets the receiver <a href="#sensitivity">sensitivity</a> and hence cell-edge coverage, while their <a href="#third-order-intercept">IIP3</a> sets how well the radio survives strong adjacent-channel blockers. Radio-astronomy and deep-space stations go further, cryogenically cooling the LNA to a few kelvin so that $T_e$ (not NF) becomes the meaningful spec — a handful of kelvin of added noise temperature can be the difference between detecting a distant source and not. Across all of these, the LNA is where the <a href="#noise-floor">noise floor</a> and thus the whole <a href="#link-budget">link budget</a> is set, in a <a href="#superheterodyne">superheterodyne</a> or direct-conversion architecture alike.</p>`,
    related: ['noise-figure', 'noise-floor', 'sensitivity', 'third-order-intercept', 'mixer', 'superheterodyne']
  }
);
