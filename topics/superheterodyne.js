// Superheterodyne (double-heterodyne) receiver — Armstrong's architecture.
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'superheterodyne',
    title: 'Superheterodyne (Double-Heterodyne) Receiver',
    category: 'RF Front-End & Receivers',
    tags: ['superheterodyne', 'IF', 'image', 'mixer', 'local oscillator', 'dual conversion', 'AGC', 'selectivity'],
    summary: String.raw`The superheterodyne receiver translates every received channel down to one FIXED intermediate frequency, where high-Q filtering and most of the gain are performed once, delivering uniform selectivity and sensitivity across the whole tuning band — the architecture behind almost every radio built since Armstrong.`,
    diagram: [
    {
      title: String.raw`Single-conversion superheterodyne signal path`,
      svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">
        <defs><marker id="arr-superheterodyne" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Antenna to demodulator via one fixed IF</text>
        <text x="20" y="70" fill="#e6edf3" text-anchor="middle">ant</text>
        <line x1="20" y1="78" x2="20" y2="96" stroke="#9aa7b5"/>
        <line x1="30" y1="96" x2="52" y2="96" stroke="#9aa7b5" marker-end="url(#arr-superheterodyne)"/>
        <rect x="54" y="78" width="70" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="89" y="94" fill="#e6edf3" text-anchor="middle">RF BPF</text><text x="89" y="108" fill="#9aa7b5" font-size="9" text-anchor="middle">preselect</text>
        <line x1="124" y1="96" x2="146" y2="96" stroke="#9aa7b5" marker-end="url(#arr-superheterodyne)"/>
        <rect x="148" y="78" width="58" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="177" y="100" fill="#e6edf3" text-anchor="middle">LNA</text>
        <line x1="206" y1="96" x2="228" y2="96" stroke="#9aa7b5" marker-end="url(#arr-superheterodyne)"/>
        <rect x="230" y="78" width="58" height="36" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="259" y="100" fill="#e6edf3" text-anchor="middle">mixer</text>
        <rect x="230" y="150" width="58" height="34" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="259" y="171" fill="#e6edf3" text-anchor="middle">LO</text><text x="259" y="182" fill="#9aa7b5" font-size="9" text-anchor="middle">tunable</text>
        <line x1="259" y1="150" x2="259" y2="114" stroke="#9aa7b5" marker-end="url(#arr-superheterodyne)"/>
        <line x1="288" y1="96" x2="310" y2="96" stroke="#9aa7b5" marker-end="url(#arr-superheterodyne)"/>
        <rect x="312" y="78" width="70" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="347" y="94" fill="#e6edf3" text-anchor="middle">IF BPF</text><text x="347" y="108" fill="#9aa7b5" font-size="9" text-anchor="middle">fixed hi-Q</text>
        <line x1="382" y1="96" x2="404" y2="96" stroke="#9aa7b5" marker-end="url(#arr-superheterodyne)"/>
        <rect x="406" y="78" width="60" height="36" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="436" y="94" fill="#e6edf3" text-anchor="middle">IF amp</text><text x="436" y="108" fill="#9aa7b5" font-size="9" text-anchor="middle">AGC</text>
        <line x1="466" y1="96" x2="488" y2="96" stroke="#9aa7b5" marker-end="url(#arr-superheterodyne)"/>
        <rect x="410" y="150" width="90" height="34" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="455" y="171" fill="#e6edf3" text-anchor="middle">demod</text>
        <line x1="490" y1="96" x2="490" y2="150" stroke="#9aa7b5"/><line x1="490" y1="150" x2="500" y2="150" stroke="#9aa7b5"/>
        <text x="259" y="132" fill="#9aa7b5" font-size="9" text-anchor="middle">fIF = |fRF - fLO|</text>
      </svg>`,
      caption: String.raw`Full single-conversion superhet: antenna, RF preselect BPF, LNA, mixer driven by a TUNABLE LO, a FIXED high-Q IF BPF, an IF amplifier with AGC, then the demodulator. Only the LO tunes — everything after the mixer runs at one fixed IF, so the sharp filtering and most gain are done once.`
    },
    {
      title: String.raw`Double (dual) conversion — why two IFs`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">
        <defs><marker id="arr2-superheterodyne" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">High 1st IF kills the image; low 2nd IF gives selectivity</text>
        <rect x="18" y="70" width="60" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="48" y="86" fill="#e6edf3" text-anchor="middle">RF</text><text x="48" y="102" fill="#9aa7b5" font-size="9" text-anchor="middle">preselect</text>
        <line x1="78" y1="90" x2="100" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-superheterodyne)"/>
        <rect x="102" y="70" width="66" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="135" y="86" fill="#e6edf3" text-anchor="middle">mixer 1</text><text x="135" y="102" fill="#9aa7b5" font-size="9" text-anchor="middle">LO1 tune</text>
        <line x1="168" y1="90" x2="190" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-superheterodyne)"/>
        <rect x="192" y="70" width="70" height="40" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="227" y="86" fill="#e6edf3" text-anchor="middle">1st IF</text><text x="227" y="102" fill="#9aa7b5" font-size="9" text-anchor="middle">HIGH</text>
        <line x1="262" y1="90" x2="284" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-superheterodyne)"/>
        <rect x="286" y="70" width="66" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="319" y="86" fill="#e6edf3" text-anchor="middle">mixer 2</text><text x="319" y="102" fill="#9aa7b5" font-size="9" text-anchor="middle">LO2 fixed</text>
        <line x1="352" y1="90" x2="374" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-superheterodyne)"/>
        <rect x="376" y="70" width="70" height="40" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="411" y="86" fill="#e6edf3" text-anchor="middle">2nd IF</text><text x="411" y="102" fill="#9aa7b5" font-size="9" text-anchor="middle">LOW</text>
        <line x1="446" y1="90" x2="468" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-superheterodyne)"/>
        <rect x="470" y="70" width="58" height="40" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="499" y="94" fill="#e6edf3" text-anchor="middle">demod</text>
        <text x="227" y="150" fill="#4dabf7" font-size="10" text-anchor="middle">image ~ 2·(high IF) far away</text>
        <text x="411" y="150" fill="#b197fc" font-size="10" text-anchor="middle">narrow filtering easy at low f</text>
        <text x="270" y="176" fill="#9aa7b5" font-size="9" text-anchor="middle">two conversions resolve the image-vs-selectivity conflict</text>
      </svg>`,
      caption: String.raw`Double-conversion path: RF preselect, first mixer with a tunable LO1 up/down to a HIGH first IF (pushes the image far away so the preselector rejects it), then a second mixer with a fixed LO2 to a LOW second IF where cheap high-Q filters give sharp channel selectivity. Two conversions resolve the single conflict a lone IF cannot.`
    },
    {
      title: String.raw`The frequency-plan trade: image vs selectivity`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">
        <defs><marker id="arr3-superheterodyne" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Choosing the IF pulls in opposite directions</text>
        <line x1="40" y1="120" x2="500" y2="120" stroke="#9aa7b5" marker-end="url(#arr3-superheterodyne)"/>
        <text x="500" y="140" fill="#9aa7b5" font-size="9" text-anchor="end">frequency</text>
        <line x1="150" y1="70" x2="150" y2="120" stroke="#63e6be"/><text x="150" y="62" fill="#63e6be" text-anchor="middle">fRF</text>
        <line x1="230" y1="80" x2="230" y2="120" stroke="#b197fc"/><text x="230" y="72" fill="#b197fc" text-anchor="middle">fLO</text>
        <line x1="310" y1="70" x2="310" y2="120" stroke="#ffa94d"/><text x="310" y="62" fill="#ffa94d" text-anchor="middle">fimg</text>
        <path d="M150,120 Q190,100 230,120" stroke="#4dabf7" fill="none"/><text x="190" y="98" fill="#4dabf7" font-size="9" text-anchor="middle">IF</text>
        <path d="M230,120 Q270,100 310,120" stroke="#4dabf7" fill="none" stroke-dasharray="3 3"/><text x="270" y="98" fill="#4dabf7" font-size="9" text-anchor="middle">IF</text>
        <rect x="40" y="150" width="220" height="36" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="150" y="166" fill="#e6edf3" font-size="9" text-anchor="middle">HIGH IF: image far off</text><text x="150" y="179" fill="#9aa7b5" font-size="9" text-anchor="middle">easy image reject, hard selectivity</text>
        <rect x="290" y="150" width="220" height="36" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="400" y="166" fill="#e6edf3" font-size="9" text-anchor="middle">LOW IF: image close</text><text x="400" y="179" fill="#9aa7b5" font-size="9" text-anchor="middle">easy selectivity, hard image reject</text>
        <text x="270" y="140" fill="#ffa94d" font-size="9" text-anchor="middle">fimg = fRF + 2·fIF (high-side LO)</text>
      </svg>`,
      caption: String.raw`The frequency plan is a tug-of-war: image rejection wants a HIGH IF (the image sits 2·IF away, easy for the preselector to reject) while channel selectivity wants a LOW IF (narrow high-Q filters are cheap at low frequency). Dual conversion satisfies both — a high first IF, then a low second IF.`
    }
    ],
    prerequisites: ['comm-basics'],
    intro: String.raw`<p><b>Why does the superheterodyne exist?</b> Building a receiver that tunes across a whole band while still rejecting adjacent channels seems to demand a filter whose sharp, high-Q shape somehow slides in frequency as you tune — something no fixed LC or crystal filter can do, because a filter's fractional bandwidth (and thus its selectivity) worsens as you move it up in frequency. Edwin <b>Armstrong</b> resolved this in 1918 with a single idea that still underlies almost every radio: don't move the filter, <i>move the signal</i>. Translate every channel you tune to down to <b>one fixed intermediate frequency (IF)</b>, and do the hard, sharp filtering and most of the amplification there — once, at a frequency you choose. Only the local oscillator has to tune; the expensive high-Q filtering and the bulk of the gain are performed at a single fixed spot, so selectivity and sensitivity are uniform right across the band.</p>
<p>The <b>superheterodyne</b> (super-audible heterodyne) receiver mixes the incoming RF with a tunable <b>local oscillator (LO)</b> to produce a difference frequency, the IF, given by $f_{IF}=|f_{RF}-f_{LO}|$. The LO tracks the tuning so that the wanted channel always lands on the same IF: $f_{LO}=f_{RF}\pm f_{IF}$. The one great flaw of the trick is the <b>image</b>: a second RF frequency $2f_{IF}$ away also converts to the same IF, and the whole receiver design revolves around a central conflict — <b>image rejection wants a high IF, while channel selectivity wants a low IF</b>. The elegant resolution is <b>double (dual) conversion</b>: a high first IF to throw the image far enough away that the preselector kills it, followed by a low second IF where cheap high-Q filters deliver razor-sharp selectivity.</p>`,
    sections: [
      {
        h: 'The core idea: translate every channel to one fixed IF',
        html: String.raw`<p>A receiver has two hard jobs: <b>sensitivity</b> (pull weak signals out of noise, needing lots of gain) and <b>selectivity</b> (reject everything except the wanted channel, needing a sharp filter). The trouble is that a sharp, high-Q filter is only sharp at one frequency — you cannot make an LC or crystal filter slide across a whole band while keeping its shape. Armstrong's superheterodyne sidesteps this: instead of tuning the filter, it <b>tunes the local oscillator</b> and mixes the wanted RF down to a single <b>fixed intermediate frequency</b>.</p>
        <p>The mixer multiplies the RF signal by the LO. For inputs at $f_{RF}$ and $f_{LO}$ the product contains sum and difference terms; the IF filter keeps the difference:</p>
        <p>$$f_{IF}=\left|f_{RF}-f_{LO}\right|.$$</p>
        <p>Because the LO tunes together with the wanted channel, every channel is translated to the <i>same</i> IF. All the fixed high-Q filtering and most of the gain now happen at that one frequency, once — giving uniform performance across the entire band.</p>
        <div class="callout tip"><b>One-line intuition:</b> don't move the filter, move the signal. Tune the LO so the wanted channel always lands on the same fixed IF, and do the sharp filtering and heavy amplification there.</div>`
      },
      {
        h: 'The signal path, stage by stage',
        html: String.raw`<p>The canonical single-conversion chain is:</p>
        <p style="text-align:center"><b>antenna &rarr; RF preselect BPF &rarr; LNA &rarr; mixer (&larr; tunable LO) &rarr; IF BPF &rarr; IF amp / AGC &rarr; demodulator</b></p>
        <ul>
          <li><b>RF preselect BPF:</b> a broad bandpass before the active stages. It does not select the channel (it is far too wide) — its job is to pass the wanted band while rejecting out-of-band energy and, crucially, the <b>image</b>.</li>
          <li><b>LNA:</b> the low-noise amplifier sets the receiver noise figure. Placed first (after only a low-loss filter) so that, by Friis, its noise dominates and later stages contribute little.</li>
          <li><b>Mixer + tunable LO:</b> the frequency-translating heart. The LO tunes; the mixer produces $f_{IF}=|f_{RF}-f_{LO}|$.</li>
          <li><b>IF BPF:</b> the <b>fixed high-Q</b> filter that actually selects the channel and rejects adjacent channels. Being fixed, it can be a sharp crystal, ceramic or SAW filter.</li>
          <li><b>IF amplifier / AGC:</b> the bulk of the gain, at a convenient fixed frequency where high stable gain is cheap. <b>Automatic gain control</b> holds the output level constant over a huge input dynamic range.</li>
          <li><b>Demodulator:</b> recovers the message (envelope/AM, discriminator/FM, or I&mdash;Q for digital).</li>
        </ul>`
      },
      {
        h: 'LO tracking and the choice of high-side vs low-side',
        html: String.raw`<p>To keep a channel at $f_{RF}$ landing on the fixed IF, the LO must satisfy</p>
        <p>$$f_{LO}=f_{RF}\pm f_{IF}.$$</p>
        <p><b>High-side injection</b> uses $f_{LO}=f_{RF}+f_{IF}$; <b>low-side injection</b> uses $f_{LO}=f_{RF}-f_{IF}$. High-side is common because the LO's fractional tuning range is smaller (the LO frequencies are bunched closer together relative to their absolute value), which eases oscillator design. As the user tunes across the band, only the LO moves; the IF filter and IF amplifiers never change.</p>
        <p>The tuning that once used mechanically ganged variable capacitors is today a <b>frequency synthesizer</b> (a PLL locked to a crystal), so the LO is both agile and accurate.</p>
        <div class="callout tip"><b>Remember:</b> the LO tracks the RF by exactly one IF. Pick the injection side (high or low) to minimise the LO's fractional tuning range and to place spurs and the image conveniently.</div>`
      },
      {
        h: 'The image problem and its rejection',
        html: String.raw`<p>Mixing is symmetric about the LO: two RF frequencies, one on each side of the LO by exactly $f_{IF}$, both convert to the same IF. The wanted one is at $f_{RF}$; the unwanted one, the <b>image</b>, sits at</p>
        <p>$$f_{img}=f_{RF}\pm 2f_{IF},$$</p>
        <p>on the opposite side of the LO from the wanted channel (sign set by the injection side). Any signal or noise at the image falls straight on top of the wanted channel at the IF and cannot be removed afterwards — so it must be rejected <b>before</b> the mixer.</p>
        <p>The <b>RF preselect filter</b> does this. Its job is easy only if the image is far away, i.e. if $2f_{IF}$ is large compared with the preselector's bandwidth. That is the whole reason a designer wants a <b>high IF</b>: the image moves $2f_{IF}$ away, so a modest preselector rejects it. An <b>image-reject mixer</b> (Hartley/Weaver) can also cancel the image by phasing, at the cost of matching accuracy.</p>
        <div class="callout tip"><b>Key point:</b> the image lives $2f_{IF}$ away from the wanted channel. Raising the IF pushes the image out to where the preselector can kill it — but that same high IF makes channel selectivity hard.</div>`
      },
      {
        h: 'The central trade and its resolution by dual conversion',
        html: String.raw`<p>Here is the tension at the heart of superhet design:</p>
        <ul>
          <li><b>Image rejection wants a HIGH IF:</b> the image is $2f_{IF}$ away, so a big IF puts it out of the preselector's passband.</li>
          <li><b>Channel selectivity wants a LOW IF:</b> a filter's selectivity is set by its <i>fractional</i> bandwidth $Q=f_0/\Delta f$. For a fixed channel width $\Delta f$, a low centre frequency $f_0$ needs a much smaller (achievable) $Q$. Sharp filters are cheap at low frequency, hard at high frequency.</li>
        </ul>
        <p>A single IF cannot be both high and low. <b>Double (dual) conversion</b> resolves it by using two:</p>
        <ol>
          <li><b>First conversion to a HIGH first IF</b> with a tunable LO1. This throws the image far away, and the preselector rejects it easily.</li>
          <li><b>Second conversion to a LOW second IF</b> with a fixed LO2. At this low frequency, a cheap high-Q crystal/ceramic filter delivers the sharp channel selectivity.</li>
        </ol>
        <p>Each stage does the job it is good at. The price is complexity — an extra mixer, LO and set of filters, plus new spurious and second-image concerns to plan around.</p>
        <div class="callout tip"><b>The resolution in one line:</b> use a high first IF to kill the image, then a low second IF to get selectivity — dual conversion lets the receiver have both.</div>`
      },
      {
        h: 'Gain, noise and AGC down the chain',
        html: String.raw`<p>Sensitivity is a cascade problem. By <b>Friis' formula</b>, the total noise factor is</p>
        <p>$$F_{tot}=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1G_2}+\cdots,$$</p>
        <p>so early gain (the LNA) divides down the noise of every later stage. This is why the LNA comes first, after only a low-loss preselect filter — a lossy filter or mixer placed ahead of it would add directly to the noise figure. The mixer, which often has conversion <i>loss</i> and a poor noise figure, is deliberately placed <i>after</i> the LNA's gain.</p>
        <p>Most of the receiver's gain lives in the <b>IF amplifier</b>, where high, stable gain at a fixed frequency is cheap and there is no risk of RF instability from tuning. <b>AGC</b> then senses the output level and feeds back to control IF (and sometimes RF) gain, holding a constant output as the input varies over many tens of dB — essential so a strong local station and a weak distant one both demodulate cleanly.</p>
        <div class="callout tip"><b>Design order:</b> put gain early (LNA) so Friis works for you, put the bulk of the gain at the IF where it is cheap and stable, and wrap AGC around it to tame dynamic range.</div>`
      },
      {
        h: 'Advantages, drawbacks, and the zero-IF alternative',
        html: String.raw`<p><b>Advantages:</b> excellent, <i>uniform</i> selectivity and sensitivity across the whole band (all done at a fixed IF); high stable gain; a mature, cheap architecture with off-the-shelf fixed IF filters.</p>
        <p><b>Drawbacks:</b> the image (needs a preselector or image-reject mixer); LO spurs and mixer spurious products; and, for dual conversion, real complexity, cost and power. Half-IF and other spurious responses need careful frequency planning.</p>
        <table class="data">
          <tr><th>Aspect</th><th>Superheterodyne</th><th>Zero-IF (direct conversion)</th></tr>
          <tr><td>IF</td><td>One (or two) fixed non-zero IFs</td><td>IF = 0 (baseband)</td></tr>
          <tr><td>Image</td><td>Present at $2f_{IF}$; needs rejection</td><td>Own image is the signal's mirror; solved by I&mdash;Q</td></tr>
          <tr><td>Channel filter</td><td>Fixed high-Q analog IF filter</td><td>Low-pass at baseband (easy to integrate)</td></tr>
          <tr><td>Main impairments</td><td>Image, LO spurs, complexity</td><td>DC offset, I&mdash;Q imbalance, $1/f$ noise, LO leakage</td></tr>
          <tr><td>Integration</td><td>Needs external IF filters</td><td>Highly integrable (single chip)</td></tr>
        </table>
        <p><b>Zero-IF</b> (direct conversion) mixes straight to baseband, avoiding the image frequency and external IF filters — ideal for integrated <a href="#sdr">SDR</a> transceivers — but pays for it with DC offset, LO self-mixing and I&mdash;Q imbalance. The superhet remains unbeaten where the very best selectivity and spurious performance are needed.</p>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The core idea (Armstrong):</b> tune the LO, not the filter — translate every channel to one fixed IF where high-Q filtering and most gain happen once, giving uniform selectivity and sensitivity across the band.</li>
<li><b>The signal path:</b> antenna &rarr; RF preselect BPF &rarr; LNA &rarr; mixer (tunable LO) &rarr; fixed IF BPF &rarr; IF amp/AGC &rarr; demodulator, with $f_{IF}=|f_{RF}-f_{LO}|$ and LO tracking $f_{LO}=f_{RF}\pm f_{IF}$.</li>
<li><b>The image:</b> a second RF at $f_{RF}\pm 2f_{IF}$ converts to the same IF and must be rejected before the mixer by the preselector or an image-reject mixer.</li>
<li><b>The central trade and its fix:</b> image rejection wants a HIGH IF while selectivity wants a LOW IF, resolved by DUAL conversion — a high first IF to kill the image, a low second IF for selectivity.</li>
<li><b>Gain/noise budgeting:</b> LNA first so Friis divides later-stage noise; bulk gain at the IF; AGC to tame dynamic range — versus zero-IF, which trades the image away for DC-offset and I&mdash;Q impairments.</li>
</ul></div>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Superheterodyne_receiver" target="_blank" rel="noopener">Wikipedia — Superheterodyne receiver</a> — the canonical deep reference: Armstrong history, single/double conversion, image and spurious responses, LO phase noise, with 99+ sourced references.</li>
<li><a href="https://www.site.uottawa.ca/~sloyka/elg3175/Lec_9_ELG3175.pdf" target="_blank" rel="noopener">University of Ottawa ELG3175 — Lecture 9: Superheterodyne receiver</a> — university lecture notes deriving mixing, IF choice, image rejection and IF selectivity from first principles.</li>
<li><a href="https://www.electronics-notes.com/articles/radio/superheterodyne-receiver/image.php" target="_blank" rel="noopener">Electronics Notes — Superheterodyne image response</a> — focused treatment of the image frequency (LO±IF), why a high IF eases rejection, and typical image-rejection specifications.</li>
<li><a href="https://www.keysight.com/us/en/assets/7018-06714/application-notes/5952-0292.pdf" target="_blank" rel="noopener">Keysight — Spectrum Analysis Basics (AN 150)</a> — industry application note showing the swept-tuned superheterodyne in a real instrument: mixer, tunable LO, IF filter and resolution bandwidth.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Armstrong's idea: translate every channel to one FIXED IF and do the sharp high-Q filtering and most gain there — only the LO tunes.`,
      String.raw`Mixing gives $f_{IF}=|f_{RF}-f_{LO}|$, and LO tracking keeps the wanted channel on the fixed IF: $f_{LO}=f_{RF}\pm f_{IF}$.`,
      String.raw`Signal path: antenna → RF preselect BPF → LNA → mixer (← tunable LO) → fixed IF BPF → IF amp/AGC → demodulator.`,
      String.raw`The image sits $2f_{IF}$ away ($f_{img}=f_{RF}\pm 2f_{IF}$) and converts onto the same IF; it must be rejected BEFORE the mixer by the preselector.`,
      String.raw`Central trade: image rejection wants a HIGH IF (image far off) but channel selectivity wants a LOW IF (small fractional bandwidth, cheap high-Q).`,
      String.raw`Dual (double) conversion resolves it: a high 1st IF kills the image, then a low 2nd IF gives selectivity.`,
      String.raw`LNA goes first (after only a low-loss filter) so Friis divides down every later stage's noise; the lossy mixer sits after the LNA's gain.`,
      String.raw`Most gain lives at the IF where high stable gain is cheap; AGC holds a constant output across a huge input dynamic range.`,
      String.raw`Advantages: uniform selectivity and sensitivity across the band, high gain, mature/cheap. Drawbacks: image, LO spurs, complexity.`,
      String.raw`Zero-IF trades the image and external IF filters for DC offset, I—Q imbalance and LO leakage — better for integration, worse for ultimate selectivity.`
    ],
    equations: [
      {
        title: 'IF and LO tracking law',
        tex: String.raw`$$f_{IF}=\left|f_{RF}-f_{LO}\right|\quad\Rightarrow\quad f_{LO}=f_{RF}\pm f_{IF}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A mixer is a multiplier. Feed it the wanted RF carrier and the local oscillator and expand the product with a trig identity; the receiver's IF filter then decides which term survives.</p>
        <p><b>Step 1 — multiply the two tones.</b> Model the RF as $\cos(2\pi f_{RF}t)$ and the LO as $\cos(2\pi f_{LO}t)$. The mixer forms their product, and the product-to-sum identity gives</p>
        $$\cos(2\pi f_{RF}t)\cos(2\pi f_{LO}t)=\tfrac12\cos\!\big(2\pi(f_{RF}-f_{LO})t\big)+\tfrac12\cos\!\big(2\pi(f_{RF}+f_{LO})t\big).$$
        <p><b>Step 2 — keep the difference.</b> The IF bandpass filter passes the low <i>difference</i> term and rejects the high sum term. A real frequency is positive, so the surviving IF is</p>
        $$f_{IF}=\left|f_{RF}-f_{LO}\right|.$$
        <p><b>Step 3 — invert for the LO.</b> To hold a wanted channel at a chosen fixed $f_{IF}$ as we tune, solve for the LO. Removing the absolute value gives two injection choices:</p>
        $$f_{LO}=f_{RF}-f_{IF}\ (\text{low-side})\qquad\text{or}\qquad f_{LO}=f_{RF}+f_{IF}\ (\text{high-side}).$$
        <p><b>Result.</b> $$f_{LO}=f_{RF}\pm f_{IF}.$$ Sanity check: pick $f_{RF}=100$ MHz, $f_{IF}=10.7$ MHz; high-side LO is $110.7$ MHz and $|100-110.7|=10.7$ MHz lands on the IF, exactly as required. Tuning to a new channel simply shifts the LO by the same amount — the IF filter never moves.</p>`
      },
      {
        title: 'Image frequency and why a high IF helps',
        tex: String.raw`$$f_{img}=f_{RF}\pm 2f_{IF}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Mixing folds the spectrum about the LO, so two RF inputs symmetric around $f_{LO}$ produce the same difference frequency. We locate the unwanted one (the image) and see why raising the IF pushes it out of harm's way.</p>
        <p><b>Step 1 — the wanted channel.</b> Take high-side injection, $f_{LO}=f_{RF}+f_{IF}$. The wanted RF sits one IF below the LO: $f_{LO}-f_{RF}=f_{IF}$, which converts to the IF as intended.</p>
        <p><b>Step 2 — find the other frequency that maps to the same IF.</b> Any input $f_x$ with $|f_x-f_{LO}|=f_{IF}$ produces the same IF. The wanted one is $f_{LO}-f_{IF}=f_{RF}$; the other lies one IF <i>above</i> the LO:</p>
        $$f_{img}=f_{LO}+f_{IF}=(f_{RF}+f_{IF})+f_{IF}=f_{RF}+2f_{IF}.$$
        <p><b>Step 3 — the general spacing.</b> For low-side injection the image lands below instead, so in general</p>
        $$f_{img}=f_{RF}\pm 2f_{IF},\qquad\text{i.e. the image is }2f_{IF}\text{ away from the wanted channel.}$$
        <p><b>Result.</b> $$f_{img}=f_{RF}\pm 2f_{IF}.$$ The image cannot be removed after mixing — it lands on top of the signal at the IF — so the preselector must reject it first. That is easy only when $2f_{IF}$ is large: a <b>high IF</b> throws the image far outside the preselector's passband. But a high IF hurts selectivity, which is exactly why dual conversion (high 1st IF, low 2nd IF) is used — the first IF distances the image, the second IF restores selectivity.</p>`
      },
      {
        title: 'Selectivity as fractional bandwidth (Q at the IF)',
        tex: String.raw`$$Q=\frac{f_0}{\Delta f}$$`,
        derivation: String.raw`<p><b>Where we start.</b> To justify why selectivity wants a LOW IF, we express a channel filter's difficulty through its required quality factor for a fixed channel width $\Delta f$ at a centre frequency $f_0$.</p>
        <p><b>Step 1 — define the filter's job.</b> A channel-select filter must pass a band of width $\Delta f$ (the channel) centred at $f_0$ and reject neighbours just outside. The sharpness needed is set by the <i>fractional</i> bandwidth $\Delta f/f_0$.</p>
        <p><b>Step 2 — relate to quality factor.</b> The loaded quality factor of a bandpass filter is defined as the ratio of centre frequency to $-3$ dB bandwidth,</p>
        $$Q=\frac{f_0}{\Delta f}.$$
        <p><b>Step 3 — read off the consequence.</b> Hold the channel width $\Delta f$ fixed (it is set by the modulation, not the receiver). Then $Q$ grows in direct proportion to $f_0$. A 10 kHz channel at $f_0=455$ kHz needs $Q\approx45$ (easy, cheap ceramic/crystal); the same channel at $f_0=45$ MHz needs $Q\approx4500$ (hard, expensive).</p>
        <p><b>Result.</b> $$Q=\frac{f_0}{\Delta f}.$$ Sanity check: for a fixed $\Delta f$, halving the IF halves the required $Q$. This is the quantitative reason channel selectivity wants a LOW IF — and, paired with the image argument (which wants a HIGH IF), the reason dual conversion places selectivity at the low second IF.</p>`
      },
      {
        title: 'Cascade noise figure down the chain (Friis)',
        tex: String.raw`$$F_{tot}=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1G_2}+\cdots$$`,
        derivation: String.raw`<p><b>Where we start.</b> Sensitivity is set by the receiver's overall noise factor. We build it up stage by stage to show why the LNA must lead and the lossy mixer must follow it.</p>
        <p><b>Step 1 — noise factor of one stage.</b> Noise factor is defined as input SNR divided by output SNR, $F=\mathrm{SNR_{in}}/\mathrm{SNR_{out}}$. Equivalently a stage of gain $G$ and factor $F$ adds input-referred excess noise proportional to $(F-1)$ on top of the source thermal noise $kT_0B$.</p>
        <p><b>Step 2 — refer stage 2's noise to the input.</b> Stage 2 adds its own excess noise $(F_2-1)kT_0B$ at its input. Seen from the receiver input, that noise has NOT enjoyed stage 1's gain, so relative to the amplified signal it is divided by $G_1$: its input-referred contribution is $(F_2-1)/G_1$.</p>
        <p><b>Step 3 — extend to the whole chain.</b> Repeating for each later stage, its excess noise is divided by the product of all preceding gains:</p>
        $$F_{tot}=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1G_2}+\cdots.$$
        <p><b>Result.</b> $$F_{tot}=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1G_2}+\cdots.$$ Interpretation: the first stage's noise appears in full, but every later stage is suppressed by the gain ahead of it. So a low-noise, high-gain LNA goes first (after only a low-loss preselect filter), and the mixer — which typically has conversion loss and a high noise figure — is placed after the LNA where its $(F-1)$ is divided by $G_{LNA}$.</p>`
      },
      {
        title: 'Two-stage frequency plan for dual conversion',
        tex: String.raw`$$f_{IF1}=|f_{RF}-f_{LO1}|,\qquad f_{IF2}=|f_{IF1}-f_{LO2}|$$`,
        derivation: String.raw`<p><b>Where we start.</b> Dual conversion applies the single-conversion law twice. We chain the two mixers and see how the high first IF and low second IF each earn their place.</p>
        <p><b>Step 1 — first conversion (image control).</b> The tunable LO1 mixes the wanted RF to a deliberately HIGH first IF:</p>
        $$f_{IF1}=|f_{RF}-f_{LO1}|.$$
        <p>Because $f_{IF1}$ is large, the first image at $f_{RF}\pm 2f_{IF1}$ is far from the wanted channel, so the RF preselector rejects it with ease.</p>
        <p><b>Step 2 — second conversion (selectivity).</b> A FIXED LO2 mixes the first IF down to a LOW second IF:</p>
        $$f_{IF2}=|f_{IF1}-f_{LO2}|.$$
        <p>At this low frequency a cheap high-Q filter has the small $Q=f_{IF2}/\Delta f$ needed for sharp channel selection.</p>
        <p><b>Step 3 — mind the second image.</b> The second mixer has its own image at $f_{IF1}\pm 2f_{IF2}$. Because $f_{IF2}$ is low and the first IF filter is already fairly selective, this second image is easily rejected by the first-IF filter — completing the plan.</p>
        <p><b>Result.</b> $$f_{IF1}=|f_{RF}-f_{LO1}|,\qquad f_{IF2}=|f_{IF1}-f_{LO2}|.$$ Sanity check: with $f_{RF}=100$ MHz, choose a high first IF $f_{IF1}=45$ MHz (so LO1 = 145 MHz, first image 190 MHz — far off), then $f_{LO2}=44.545$ MHz gives $f_{IF2}=455$ kHz, low enough for a sharp ceramic channel filter. Each conversion does exactly the job it is good at.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What is the core idea of the superheterodyne receiver?`, back: String.raw`Tune the LO (not the filter) to translate every channel to one FIXED intermediate frequency, where the high-Q channel filtering and most of the gain are done once — giving uniform selectivity and sensitivity across the band. Due to Armstrong.` },
      { front: String.raw`Give the mixing (IF) relation.`, back: String.raw`$f_{IF}=|f_{RF}-f_{LO}|$ — the IF filter keeps the difference of the RF and LO frequencies.` },
      { front: String.raw`State the LO tracking law.`, back: String.raw`$f_{LO}=f_{RF}\pm f_{IF}$; high-side injection uses $+$, low-side uses $-$. Only the LO tunes; the IF stays fixed.` },
      { front: String.raw`List the superhet signal path.`, back: String.raw`antenna → RF preselect BPF → LNA → mixer (← tunable LO) → fixed IF BPF → IF amp/AGC → demodulator.` },
      { front: String.raw`Where is the image frequency?`, back: String.raw`$f_{img}=f_{RF}\pm 2f_{IF}$ — one IF on the other side of the LO, i.e. $2f_{IF}$ away from the wanted channel.` },
      { front: String.raw`Why must the image be rejected before the mixer?`, back: String.raw`It converts to the same IF as the wanted signal and lands on top of it, so no later filter can separate them; the preselector (or an image-reject mixer) must remove it first.` },
      { front: String.raw`What is the central IF trade?`, back: String.raw`Image rejection wants a HIGH IF (image far away, easy to reject); channel selectivity wants a LOW IF (small fractional bandwidth, cheap high-Q filter). A single IF cannot be both.` },
      { front: String.raw`How does dual conversion resolve the trade?`, back: String.raw`Use a HIGH first IF to throw the image far off (preselector kills it), then a LOW second IF where a cheap high-Q filter gives sharp channel selectivity.` },
      { front: String.raw`Why does the LNA come first (before the mixer)?`, back: String.raw`By Friis, $F_{tot}=F_1+(F_2-1)/G_1+\cdots$; early gain divides down every later stage's noise, so a low-noise high-gain LNA first sets the noise figure. The lossy mixer sits after its gain.` },
      { front: String.raw`What does AGC do in the IF chain?`, back: String.raw`Automatic gain control senses output level and feeds back to control IF (and sometimes RF) gain, holding a constant output over a wide input dynamic range so strong and weak signals both demodulate cleanly.` },
      { front: String.raw`Why is most gain placed at the IF?`, back: String.raw`At a fixed IF, high stable gain is cheap and there is no risk of RF instability from tuning; fixed high-Q IF filters (crystal/ceramic/SAW) are also readily available.` },
      { front: String.raw`How does zero-IF differ from superhet?`, back: String.raw`Zero-IF mixes straight to baseband (IF=0), avoiding the image and external IF filters (great for integration) but suffering DC offset, LO self-mixing/leakage and I—Q imbalance instead.` },
      { front: String.raw`Why does a low IF need a smaller filter Q for the same channel?`, back: String.raw`$Q=f_0/\Delta f$ for a fixed channel width $\Delta f$; a lower centre frequency $f_0$ needs a smaller, achievable $Q$, so sharp filters are cheap at low frequency.` }
    ],
    mcqs: [
      { q: String.raw`The defining principle of the superheterodyne receiver is to:`, options: [String.raw`Tune a sharp filter across the whole band`, String.raw`Translate every channel to one fixed IF and filter there`, String.raw`Amplify at RF only, never at IF`, String.raw`Demodulate directly at the antenna`], answer: 1, explain: String.raw`Armstrong's idea is to move the signal, not the filter: mix each channel down to a single fixed IF where the sharp filtering and most gain are done once.` },
      { q: String.raw`A receiver has $f_{RF}=98.0$ MHz and a fixed IF of $10.7$ MHz using high-side injection. What is $f_{LO}$?`, options: [String.raw`87.3 MHz`, String.raw`98.0 MHz`, String.raw`108.7 MHz`, String.raw`119.4 MHz`], answer: 2, explain: String.raw`High-side: $f_{LO}=f_{RF}+f_{IF}=98.0+10.7=108.7$ MHz.` },
      { q: String.raw`For $f_{RF}=100$ MHz, $f_{IF}=10$ MHz, high-side LO, the image frequency is:`, options: [String.raw`80 MHz`, String.raw`90 MHz`, String.raw`110 MHz`, String.raw`120 MHz`], answer: 3, explain: String.raw`$f_{img}=f_{RF}+2f_{IF}=100+20=120$ MHz — it sits one IF above the LO (110 MHz).` },
      { q: String.raw`The image frequency must be rejected by the:`, options: [String.raw`IF filter after the mixer`, String.raw`RF preselect filter before the mixer`, String.raw`AGC loop`, String.raw`Demodulator`], answer: 1, explain: String.raw`The image converts onto the same IF as the signal, so it cannot be removed afterward; the preselector (or an image-reject mixer) must reject it before the mixer.` },
      { q: String.raw`Image rejection is easiest when the IF is:`, options: [String.raw`As low as possible`, String.raw`Zero`, String.raw`High, so the image is far from the passband`, String.raw`Equal to the channel bandwidth`], answer: 2, explain: String.raw`The image is $2f_{IF}$ away; a high IF pushes it far outside the preselector's passband, making rejection easy.` },
      { q: String.raw`Channel selectivity favors a:`, options: [String.raw`High IF, for a smaller filter Q`, String.raw`Low IF, for a smaller required filter Q`, String.raw`Very high LO frequency`, String.raw`Wider channel bandwidth`], answer: 1, explain: String.raw`With $Q=f_0/\Delta f$ for a fixed channel width, a low IF needs a smaller, cheaper Q for the same sharpness.` },
      { q: String.raw`Dual (double) conversion is used because:`, options: [String.raw`It removes the need for any LO`, String.raw`A high 1st IF rejects the image while a low 2nd IF gives selectivity`, String.raw`It eliminates all spurious products`, String.raw`It lowers the LNA noise figure`], answer: 1, explain: String.raw`One IF cannot be both high (image) and low (selectivity); dual conversion uses a high first IF then a low second IF to get both.` },
      { q: String.raw`In the cascade $F_{tot}=F_1+(F_2-1)/G_1+\cdots$, the LNA is placed first to:`, options: [String.raw`Increase the image frequency`, String.raw`Divide down the noise of later stages via its gain`, String.raw`Provide the channel selectivity`, String.raw`Set the LO frequency`], answer: 1, explain: String.raw`Early gain $G_1$ divides every later stage's excess noise, so a low-noise high-gain LNA first sets the overall noise figure.` },
      { q: String.raw`Most of a superhet's gain is placed at the IF because:`, options: [String.raw`RF gain is impossible`, String.raw`High stable gain is cheap at a fixed frequency`, String.raw`The IF has no filter`, String.raw`It removes the image`], answer: 1, explain: String.raw`At a fixed IF, high stable gain and sharp fixed filters are cheap, with no tuning-related RF instability.` },
      { q: String.raw`The purpose of AGC in the IF chain is to:`, options: [String.raw`Shift the LO frequency`, String.raw`Hold a constant output over a wide input dynamic range`, String.raw`Reject the image`, String.raw`Generate the IF`], answer: 1, explain: String.raw`AGC senses output level and controls IF/RF gain so strong and weak signals both produce a usable, constant output.` },
      { q: String.raw`Compared with the superhet, a zero-IF (direct-conversion) receiver:`, options: [String.raw`Has a worse image problem`, String.raw`Avoids the image and external IF filters but suffers DC offset and I—Q imbalance`, String.raw`Cannot be integrated`, String.raw`Needs a higher IF filter Q`], answer: 1, explain: String.raw`Direct conversion mixes to baseband (IF=0), removing the image and IF filters (good for integration) but introducing DC offset, LO self-mixing and I—Q imbalance.` },
      { q: String.raw`Which element actually selects the wanted channel and rejects adjacent channels?`, options: [String.raw`The RF preselect BPF`, String.raw`The LNA`, String.raw`The fixed high-Q IF BPF`, String.raw`The tunable LO`], answer: 2, explain: String.raw`The preselector is too broad; the fixed high-Q IF filter provides the sharp channel selectivity.` }
    ],
    numericals: [
      { q: String.raw`An FM receiver tunes $f_{RF}=95.5$ MHz to a fixed IF of $10.7$ MHz using high-side injection. Find the LO frequency, and the LO for the top of the band at $107.9$ MHz. (a) LO at 95.5 MHz; (b) LO at 107.9 MHz; (c) the LO tuning span; (d) comment on why the IF filter never changes.`, solution: String.raw`<p><b>Formula.</b> The LO tracking law keeps the wanted channel on the fixed IF: $$f_{LO}=f_{RF}+f_{IF}\quad(\text{high-side}),$$ where $f_{IF}=10.7$ MHz is fixed and $f_{RF}$ is the tuned channel.</p>
<p><b>Substitute.</b> $$f_{LO}(95.5)=95.5+10.7,\qquad f_{LO}(107.9)=107.9+10.7.$$</p>
<p><b>Compute.</b> (a) $f_{LO}=106.2$ MHz. (b) $f_{LO}=118.6$ MHz. (c) LO span $=118.6-106.2=12.4$ MHz (equal to the RF band span $107.9-95.5=12.4$ MHz).</p>
<p><b>Explanation.</b> (d) Because the LO always sits exactly $f_{IF}$ above the wanted RF, every channel converts to the SAME 10.7 MHz IF, so the sharp IF filter is fixed and never retuned — only the LO moves. The LO span equals the RF band span, confirming one-to-one tracking.</p>` },
      { q: String.raw`A receiver at $f_{RF}=100$ MHz uses high-side injection. Compare a low IF of $455$ kHz with a high IF of $45$ MHz. (a) image for the 455 kHz IF; (b) image for the 45 MHz IF; (c) which image is easier for a preselector to reject; (d) state the resulting trade.`, solution: String.raw`<p><b>Formula.</b> With high-side injection the image lies one IF above the LO, i.e. $$f_{img}=f_{RF}+2f_{IF}.$$</p>
<p><b>Substitute.</b> $$f_{img}(455\text{ kHz})=100\text{ MHz}+2(0.455\text{ MHz}),\qquad f_{img}(45\text{ MHz})=100+2(45)\text{ MHz}.$$</p>
<p><b>Compute.</b> (a) $f_{img}=100.91$ MHz (only 0.91 MHz away). (b) $f_{img}=190$ MHz (90 MHz away). (c) The 45 MHz-IF image at 190 MHz is far outside any reasonable preselector passband, so it is much easier to reject; the 455 kHz-IF image at 100.91 MHz is almost on top of the channel and nearly impossible to filter.</p>
<p><b>Explanation.</b> (d) A HIGH IF makes image rejection easy but a LOW IF makes channel selectivity easy — the two pull in opposite directions, which is exactly why dual conversion uses a high first IF (image) then a low second IF (selectivity).</p>` },
      { q: String.raw`Design a dual-conversion plan for $f_{RF}=100$ MHz with a first IF of $45$ MHz (high-side) and a second IF of $455$ kHz. (a) find LO1; (b) find the first image; (c) find LO2 (high-side into the 2nd mixer); (d) find the second image and confirm the first-IF filter can reject it.`, solution: String.raw`<p><b>Formula.</b> Apply the conversion law at each stage: $$f_{LO1}=f_{RF}+f_{IF1},\quad f_{img1}=f_{RF}+2f_{IF1},\quad f_{LO2}=f_{IF1}+f_{IF2},\quad f_{img2}=f_{IF1}+2f_{IF2}.$$</p>
<p><b>Substitute.</b> $$f_{LO1}=100+45,\quad f_{img1}=100+90,\quad f_{LO2}=45+0.455,\quad f_{img2}=45+2(0.455)\ \text{MHz}.$$</p>
<p><b>Compute.</b> (a) $f_{LO1}=145$ MHz. (b) $f_{img1}=190$ MHz — 90 MHz from the wanted channel, rejected easily by the RF preselector. (c) $f_{LO2}=45.455$ MHz. (d) $f_{img2}=45.91$ MHz, i.e. 0.91 MHz above the 45 MHz first IF.</p>
<p><b>Explanation.</b> The second image at 45.91 MHz sits just outside the (moderately selective) first-IF filter centred at 45 MHz, so that filter rejects it. Meanwhile the sharp channel selectivity is done cheaply at the low 455 kHz second IF ($Q=455\text{ kHz}/\Delta f$). Each conversion does its own job — image at the high first IF, selectivity at the low second IF.</p>` },
      { q: String.raw`A front end has: preselect filter loss $F_1=1.6$ dB ($G_1=-1.6$ dB); LNA $F_2=1.5$ dB, $G_2=15$ dB; mixer $F_3=8$ dB, $G_3=-6$ dB. Find the cascade noise figure. (a) convert to linear; (b) apply Friis; (c) result in dB; (d) comment on placing the LNA first.`, solution: String.raw`<p><b>Formula.</b> Friis (referring passive loss as $F=1/G$): $$F_{tot}=F_1+\frac{F_2-1}{G_1}+\frac{F_3-1}{G_1G_2}.$$ Convert dB via $x_{lin}=10^{x/10}$.</p>
<p><b>Substitute.</b> $F_1=10^{0.16}=1.445$, $G_1=10^{-0.16}=0.692$; $F_2=10^{0.15}=1.413$, $G_2=10^{1.5}=31.6$; $F_3=10^{0.8}=6.31$. Then $$F_{tot}=1.445+\frac{1.413-1}{0.692}+\frac{6.31-1}{0.692\times31.6}.$$</p>
<p><b>Compute.</b> Second term $=0.413/0.692=0.597$; third term $=5.31/21.87=0.243$. So $F_{tot}=1.445+0.597+0.243=2.285$, and $NF=10\log_{10}(2.285)=3.59$ dB.</p>
<p><b>Explanation.</b> (d) The mixer's large 8 dB noise figure is divided by the LNA's gain ($G_1G_2\approx21.9$), so it adds only 0.24 to the noise factor — a bit over 0.4 dB. Had the mixer come before the LNA, its full noise would appear and the NF would balloon. This is why the LNA is placed first, after only the low-loss preselector.</p>` },
      { q: String.raw`A 10 kHz-wide channel must be selected. (a) required filter $Q$ at a 45 MHz IF; (b) required $Q$ at a 455 kHz IF; (c) the ratio; (d) which IF is practical and why.`, solution: String.raw`<p><b>Formula.</b> Selectivity is set by the fractional bandwidth: $$Q=\frac{f_0}{\Delta f},$$ with channel width $\Delta f=10$ kHz and $f_0$ the IF centre frequency.</p>
<p><b>Substitute.</b> $$Q_{high}=\frac{45\text{ MHz}}{10\text{ kHz}},\qquad Q_{low}=\frac{455\text{ kHz}}{10\text{ kHz}}.$$</p>
<p><b>Compute.</b> (a) $Q_{high}=45\times10^{6}/10^{4}=4500$. (b) $Q_{low}=455\times10^{3}/10^{4}=45.5$. (c) Ratio $=4500/45.5\approx99$.</p>
<p><b>Explanation.</b> (d) A $Q$ of $\sim45$ is trivial for a cheap ceramic/crystal filter, while $Q\approx4500$ at 45 MHz is very hard and expensive. So the sharp channel selectivity is done at the LOW 455 kHz second IF — exactly why dual conversion pairs a high first IF (for the image) with a low second IF (for selectivity).</p>` }
    ],
    realWorld: String.raw`<p>The superheterodyne has been the workhorse of radio for a century, from the classic AM broadcast receiver (455 kHz IF) and FM tuner (10.7 MHz IF) to television, radar, cellular basestations, GPS front ends and test instruments like spectrum analyzers, which are literally swept superhets. The <a href="#am">AM</a> and <a href="#fm">FM</a> demodulators sit at the end of exactly this chain. Dual and even triple conversion appear in high-performance HF/communications receivers and spectrum analyzers, where a high first IF (often above the tuned band) banishes the image while a low final IF provides the crystal-filter selectivity. In modern integrated transceivers the pendulum has swung toward <a href="#sdr">zero-IF / low-IF SDR</a> architectures — direct conversion to baseband followed by high-speed ADCs and digital channelization — because it removes the bulky external IF filters, at the cost of managing DC offset, LO leakage and I—Q imbalance in the digital domain. Even there, the superhet's core lesson endures: translate the signal to a convenient frequency and do the hard work once.</p>`,
    related: ['sdr', 'am', 'fm']
  }
);
