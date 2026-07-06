// Intermediate Frequency (IF): the fixed frequency a superheterodyne receiver
// translates every channel to before filtering, gain and demodulation.
// Deep exam-mastery study content. CONTENT is a global object.
CONTENT.topics.push({
  id: 'intermediate-frequency',
  title: 'Intermediate Frequency (IF)',
  category: 'RF Front-End & Receivers',
  tags: ['IF', 'superheterodyne', 'IF strip', 'channel-select filter', 'AGC', 'frequency plan'],
  summary: String.raw`The intermediate frequency is the single fixed frequency to which a superheterodyne receiver down-converts every incoming channel, so that one high-Q channel-select filter and most of the receiver gain can be built once at that frequency instead of being retuned across the whole band.`,
  diagram: [
    {
      title: String.raw`The superhet chain — where the IF stage sits`,
      svg: String.raw`<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr-intermediate-frequency" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Superheterodyne receiver: the IF strip does the heavy lifting</text>
        <rect x="14" y="52" width="70" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="49" y="70" fill="#e6edf3" text-anchor="middle">LNA</text><text x="49" y="85" fill="#9aa7b5" font-size="9" text-anchor="middle">RF, f_RF</text>
        <line x1="84" y1="72" x2="112" y2="72" stroke="#9aa7b5" marker-end="url(#arr-intermediate-frequency)"/>
        <circle cx="128" cy="72" r="14" fill="#1c232e" stroke="#ffa94d"/><text x="128" y="77" fill="#e6edf3" text-anchor="middle">×</text>
        <text x="128" y="112" fill="#9aa7b5" font-size="9" text-anchor="middle">LO f_LO</text>
        <line x1="128" y1="100" x2="128" y2="86" stroke="#9aa7b5" marker-end="url(#arr-intermediate-frequency)"/>
        <line x1="142" y1="72" x2="170" y2="72" stroke="#9aa7b5" marker-end="url(#arr-intermediate-frequency)"/>
        <rect x="172" y="46" width="78" height="52" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="211" y="66" fill="#e6edf3" text-anchor="middle">IF BPF</text><text x="211" y="82" fill="#9aa7b5" font-size="9" text-anchor="middle">high-Q select</text>
        <line x1="250" y1="72" x2="278" y2="72" stroke="#9aa7b5" marker-end="url(#arr-intermediate-frequency)"/>
        <rect x="280" y="46" width="86" height="52" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="323" y="66" fill="#e6edf3" text-anchor="middle">IF amp</text><text x="323" y="82" fill="#9aa7b5" font-size="9" text-anchor="middle">+ AGC</text>
        <line x1="366" y1="72" x2="394" y2="72" stroke="#9aa7b5" marker-end="url(#arr-intermediate-frequency)"/>
        <rect x="396" y="52" width="76" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="434" y="76" fill="#e6edf3" text-anchor="middle">demod</text>
        <line x1="472" y1="72" x2="500" y2="72" stroke="#9aa7b5" marker-end="url(#arr-intermediate-frequency)"/>
        <text x="200" y="132" fill="#ffa94d" font-size="11" text-anchor="middle">f_IF = |f_RF − f_LO|  (fixed for every channel)</text>
        <text x="200" y="150" fill="#9aa7b5" font-size="10" text-anchor="middle">the boxed IF strip is what "IF" refers to</text>
      </svg>`,
      caption: String.raw`The mixer translates the wanted channel from a tunable RF down to the fixed IF; the IF strip — BPF (channel select) + IF amp + AGC + demod — is built once at that single frequency, which is the whole point of the superhet.`
    },
    {
      title: String.raw`Why a fixed IF helps — the LO slides any channel onto one filter`,
      svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr2-intermediate-frequency" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Tune the LO, not the channel filter</text>
        <rect x="24" y="44" width="150" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="99" y="63" fill="#e6edf3" text-anchor="middle">channel A @ f_RF,A</text><text x="99" y="78" fill="#9aa7b5" font-size="9" text-anchor="middle">f_LO,A = f_RF,A − f_IF</text>
        <rect x="24" y="100" width="150" height="40" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="99" y="119" fill="#e6edf3" text-anchor="middle">channel B @ f_RF,B</text><text x="99" y="134" fill="#9aa7b5" font-size="9" text-anchor="middle">f_LO,B = f_RF,B − f_IF</text>
        <line x1="174" y1="64" x2="250" y2="88" stroke="#9aa7b5" marker-end="url(#arr2-intermediate-frequency)"/>
        <line x1="174" y1="120" x2="250" y2="96" stroke="#9aa7b5" marker-end="url(#arr2-intermediate-frequency)"/>
        <rect x="252" y="66" width="120" height="52" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="312" y="88" fill="#e6edf3" text-anchor="middle">ONE IF BPF</text><text x="312" y="104" fill="#ffa94d" font-size="10" text-anchor="middle">fixed @ f_IF</text>
        <line x1="372" y1="92" x2="440" y2="92" stroke="#9aa7b5" marker-end="url(#arr2-intermediate-frequency)"/>
        <rect x="442" y="66" width="80" height="52" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="482" y="88" fill="#e6edf3" text-anchor="middle">gain +</text><text x="482" y="104" fill="#9aa7b5" font-size="9" text-anchor="middle">demod</text>
        <text x="270" y="172" fill="#9aa7b5" font-size="10" text-anchor="middle">Any RF channel maps to the same f_IF, so the hard filtering and gain are designed once.</text>
        <text x="270" y="190" fill="#63e6be" font-size="10" text-anchor="middle">Selectivity no longer depends on tuning position.</text>
      </svg>`,
      caption: String.raw`Because f_LO is tuned to track the desired channel (f_LO = f_RF − f_IF), every channel lands on the same fixed IF. One fixed high-Q filter and one gain block serve the whole band — you retune only the LO, never the selective filtering.`
    },
    {
      title: String.raw`The frequency plan: f_RF, f_LO, IF and the image on one axis`,
      svg: String.raw`<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
        <defs><marker id="arr3-intermediate-frequency" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
        <text x="270" y="16" fill="#e6edf3" font-size="13" text-anchor="middle">Frequency plan (high-side LO): image sits 2·IF from the wanted RF</text>
        <line x1="30" y1="120" x2="520" y2="120" stroke="#9aa7b5" marker-end="url(#arr3-intermediate-frequency)"/>
        <text x="514" y="140" fill="#9aa7b5" font-size="10" text-anchor="end">frequency</text>
        <line x1="120" y1="112" x2="120" y2="72" stroke="#4dabf7"/><text x="120" y="64" fill="#4dabf7" text-anchor="middle" font-size="10">f_RF</text><text x="120" y="136" fill="#9aa7b5" font-size="9" text-anchor="middle">wanted</text>
        <line x1="300" y1="112" x2="300" y2="60" stroke="#ffa94d"/><text x="300" y="52" fill="#ffa94d" text-anchor="middle" font-size="10">f_LO</text>
        <line x1="480" y1="112" x2="480" y2="72" stroke="#b197fc"/><text x="480" y="64" fill="#b197fc" text-anchor="middle" font-size="10">f_image</text><text x="480" y="136" fill="#9aa7b5" font-size="9" text-anchor="middle">= f_LO + IF</text>
        <line x1="120" y1="96" x2="300" y2="96" stroke="#63e6be"/><text x="210" y="90" fill="#63e6be" text-anchor="middle" font-size="10">IF</text>
        <line x1="300" y1="96" x2="480" y2="96" stroke="#63e6be"/><text x="390" y="90" fill="#63e6be" text-anchor="middle" font-size="10">IF</text>
        <text x="300" y="168" fill="#9aa7b5" font-size="10" text-anchor="middle">Both f_RF and f_image are IF away from f_LO, so both mix to f_IF.</text>
        <text x="300" y="184" fill="#e6edf3" font-size="10" text-anchor="middle">Image separation = 2·IF → higher IF pushes the image further out (easier to reject).</text>
      </svg>`,
      caption: String.raw`The frequency plan on an axis: the wanted signal is at f_LO − IF, the image at f_LO + IF, so both mix to the same f_IF. The wanted-to-image spacing is exactly 2·IF, which is why a higher IF makes image rejection easier (image far away) while a lower IF makes the channel filter easier (small fractional bandwidth).`
    }
  ],
  prerequisites: ['superheterodyne', 'mixer'],
  intro: String.raw`<p><b>Why does an intermediate frequency exist at all?</b> Because selectivity and gain are hard to do while <i>tuning</i>. Imagine building the receiver's sharp channel-select filter directly at the radio frequency: to hop from one channel to the next you would have to physically retune a high-Q filter, keeping its shape and centre exact across the whole band — mechanically and electrically impractical, and the fractional bandwidth (and hence the required Q) changes as you tune. The superheterodyne trick sidesteps all of this: translate <i>every</i> channel down to one <b>fixed</b> intermediate frequency, and build the one hard, high-Q channel filter and almost all of the gain there, just once. Nothing selective ever has to tune — only the local oscillator moves.</p>
<p>The <b>intermediate frequency (IF)</b> is that fixed landing frequency. A mixer multiplies the incoming RF by a local-oscillator tone, producing $f_{IF}=|f_{RF}-f_{LO}|$; the LO is tuned so that whichever channel you want always arrives at the same $f_{IF}$. Downstream sits the <b>IF strip</b>: the channel-select bandpass filter, the bulk of the gain (an IF amplifier with AGC), and the demodulator. Classic IFs — 455&nbsp;kHz for AM broadcast, 10.7&nbsp;MHz for FM, 21.4&nbsp;MHz, and 70/140&nbsp;MHz in microwave and satellite links — became de-facto standards precisely so filters could be mass-produced. Understanding IF means understanding two ideas: <b>why fixed beats tunable</b>, and the <b>high-IF vs low-IF trade</b> that governs image rejection versus channel selectivity, which is exactly what pushes designers toward dual-conversion.</p>`,
  sections: [
    {
      h: 'What the IF is and why it is fixed',
      html: String.raw`<p>The single reason the intermediate frequency exists is that <b>a fixed frequency lets you build the hard parts once.</b> A receiver must do two difficult jobs: reject everything except the wanted channel (<i>selectivity</i>), and amplify a microvolt-level signal up to something a demodulator can use (<i>gain</i>). Doing either while continuously retuning across a wide RF band is brutal. So instead of moving the filter and gain to the signal, the superheterodyne receiver <b>moves the signal to the filter</b>: a mixer translates the wanted channel down to a single fixed frequency $f_{IF}$.</p>
        <p>The defining relation is the mixer difference product</p>
        <p>$$f_{IF}=\lvert f_{RF}-f_{LO}\rvert,$$</p>
        <p>and the local oscillator is <b>tuned to track</b> the desired channel: to receive $f_{RF}$ you set $f_{LO}=f_{RF}\mp f_{IF}$ (low-side or high-side injection). As $f_{RF}$ changes from channel to channel, $f_{LO}$ moves with it so that $f_{IF}$ stays put.</p>
        <div class="callout tip"><b>Key intuition:</b> only the LO tunes. The channel-select filter, the gain, the AGC and the demodulator all live at one unchanging frequency — that is what makes them buildable, repeatable and cheap.</div>`
    },
    {
      h: 'The IF strip: filter, gain and AGC in one place',
      html: String.raw`<p>Everything the receiver does after the first mixer, before the demodulator hands off baseband, is the <b>IF strip</b>. It contains three functional blocks:</p>
        <ul>
          <li><b>IF bandpass filter (channel select):</b> a narrow, high-Q filter centred on $f_{IF}$ that passes the wanted channel and rejects adjacent channels. This is the receiver's dominant selectivity — historically a crystal, ceramic or SAW filter mass-produced at a standard IF.</li>
          <li><b>IF amplifier (bulk gain):</b> most of the receiver's gain is applied here. Gain at IF is far easier and more stable than the same gain at RF (lower frequency, better-behaved devices, easier to keep stable).</li>
          <li><b>AGC (automatic gain control):</b> the IF amp gain is servo-controlled so the demodulator sees a roughly constant level despite a signal that may vary over 80–100&nbsp;dB from fade to fade.</li>
        </ul>
        <p>Because these blocks never move in frequency, they can be optimised once. The IF filter sets the noise-equivalent bandwidth; the IF amp sets the gain distribution; the AGC sets the dynamic range.</p>
        <div class="callout tip"><b>Why not all the gain at RF?</b> High gain at RF invites instability (feedback, oscillation) and is expensive at microwave frequencies. Splitting a little gain into the LNA and most of it into the IF strip is the classic gain-distribution that keeps noise figure low while staying stable.</div>`
    },
    {
      h: 'Choosing the IF: the high-IF vs low-IF trade',
      html: String.raw`<p>Picking $f_{IF}$ is a genuine engineering trade, and it turns on two competing filters:</p>
        <ul>
          <li><b>The image filter (before the mixer):</b> the mixer maps <i>two</i> RF frequencies to the same IF — the wanted $f_{RF}$ and the <b>image</b> at $f_{img}=f_{RF}\pm 2f_{IF}$. These are separated by exactly $2f_{IF}$. A <b>higher IF</b> pushes the image further from the wanted channel, so the pre-mixer RF filter has an easier job rejecting it.</li>
          <li><b>The channel-select filter (at the IF):</b> a channel of bandwidth $BW$ at a centre $f_{IF}$ needs a fractional bandwidth $BW/f_{IF}$ and hence a filter quality factor $Q=f_{IF}/BW$. A <b>higher IF</b> demands a <i>higher</i>-Q (harder) channel filter; a <b>lower IF</b> makes selectivity easy.</li>
        </ul>
        <p>So the two pulls are opposite:</p>
        <ul>
          <li><b>High IF:</b> image far away and easy to reject, but the channel-select filter is hard (needs high Q).</li>
          <li><b>Low IF:</b> channel filter easy (low Q, cheap, sharp), but the image is close to the wanted signal and hard to reject.</li>
        </ul>
        <div class="callout tip"><b>The resolution:</b> you cannot win both at one IF, so you use two. Convert first to a <i>high</i> first IF (kill the image), then to a <i>low</i> second IF (get the selectivity). That is exactly why the trade leads to <b>dual-conversion</b>.</div>`
    },
    {
      h: 'Classic IF values and why they became standards',
      html: String.raw`<p>A handful of IFs are used everywhere, because standardising the frequency let filter makers mass-produce parts:</p>
        <table class="data">
          <tr><th>IF</th><th>Where</th><th>Why that value</th></tr>
          <tr><td>455 kHz</td><td>AM broadcast</td><td>Low IF → cheap, sharp ceramic channel filter for ~10 kHz channels; image at $\pm 910$ kHz is tolerable in the MW band.</td></tr>
          <tr><td>10.7 MHz</td><td>FM broadcast</td><td>Higher IF to reject the image of a 200 kHz-wide channel over the 88–108 MHz band; ceramic/crystal filters standard.</td></tr>
          <tr><td>21.4 MHz</td><td>Comms / scanners</td><td>A compromise IF widely available as off-the-shelf crystal filters.</td></tr>
          <tr><td>70 / 140 MHz</td><td>Microwave &amp; satellite links</td><td>High first IF where wide signal bandwidths and distant images demand a high IF; SAW filters common.</td></tr>
        </table>
        <p>The pattern is consistent: <b>narrowband, low-carrier</b> systems (AM) use a low IF because the channel filter dominates the problem; <b>wideband or high-carrier</b> systems (FM, microwave) use a high IF because the image dominates. The 455 kHz and 10.7 MHz pair is the canonical example — and a broadcast FM tuner uses <i>both</i> in a dual-conversion design.</p>
        <div class="callout tip"><b>Why standard numbers matter:</b> a fixed, common IF means one filter part serves millions of radios. Standardisation is half the economic reason the superhet won.</div>`
    },
    {
      h: 'Image frequency and the role of IF in rejecting it',
      html: String.raw`<p>The mixer's blessing (translating any channel to a fixed IF) is also its curse: it translates a <i>second</i> input, the image, to the same IF. For high-side injection ($f_{LO}=f_{RF}+f_{IF}$) the wanted signal sits at $f_{LO}-f_{IF}$ and the image at $f_{LO}+f_{IF}$; both are $f_{IF}$ away from the LO, so both produce $|f-f_{LO}|=f_{IF}$.</p>
        <p>The wanted-to-image separation is</p>
        <p>$$\Delta f=\lvert f_{RF}-f_{img}\rvert = 2f_{IF}.$$</p>
        <p>Since the image is $2f_{IF}$ away from the wanted channel, the <b>pre-mixer RF/image filter</b> must attenuate it. That filter cannot be too sharp (it must pass the whole band you tune over), so its rejection at a given offset improves the larger that offset is — i.e. the larger $f_{IF}$ is. This is the direct link between the choice of IF and image rejection.</p>
        <div class="callout tip"><b>Remember:</b> the IF filter (after the mixer) does <i>nothing</i> about the image — image and wanted are on top of each other at IF. The image must be killed <i>before</i> the mixer, by the RF filter, and a bigger IF makes that job easier.</div>`
    },
    {
      h: 'From single IF to dual-conversion',
      html: String.raw`<p>The high-IF vs low-IF trade has no single winner, so high-performance receivers <b>convert twice</b>:</p>
        <ol>
          <li><b>First conversion to a high IF</b> (e.g. 70 MHz): a high first IF puts the image far out, so the RF/image filter easily rejects it.</li>
          <li><b>Second conversion to a low IF</b> (e.g. 455 kHz or 10.7 MHz): now the low IF lets a cheap, sharp channel-select filter do the selectivity.</li>
        </ol>
        <p>Each conversion is a mixer + LO. The first LO tunes to select the channel; the second LO is usually fixed (converting a fixed first IF to a fixed second IF). Dual-conversion thus gets the best of both worlds: a distant, easily rejected image <i>and</i> a low-Q, sharp channel filter.</p>
        <p>The modern alternative removes the IF entirely: the <a href="#zero-if">zero-IF (direct-conversion)</a> receiver mixes straight to baseband ($f_{IF}=0$), trading the image problem for I/Q imbalance and DC-offset problems. But whenever a fixed, well-behaved selectivity-and-gain stage is wanted, an IF — often two — is still the answer.</p>
        <div class="callout tip"><b>The through-line:</b> a fixed IF exists so selectivity and gain never tune; the IF value trades image rejection against channel selectivity; and when one IF cannot serve both, dual-conversion uses a high IF then a low IF.</div>`
    },
    {
      h: 'What you should now understand',
      html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>Why a fixed IF exists:</b> it lets you build one high-Q channel-select filter and most of the gain at a single frequency instead of retuning selective circuits across the band — only the LO tunes, via $f_{IF}=|f_{RF}-f_{LO}|$ with $f_{LO}$ tracking the wanted channel.</li>
<li><b>The IF strip:</b> IF bandpass (channel select) + IF amplifier (bulk gain) + AGC (dynamic range) + demodulator, all built once at $f_{IF}$.</li>
<li><b>The high-IF vs low-IF trade:</b> high IF → image far away ($2f_{IF}$ separation) and easy to reject but a harder (higher-Q) channel filter; low IF → easy selectivity but a close, hard-to-reject image.</li>
<li><b>Image and the IF's job:</b> the image sits $2f_{IF}$ from the wanted signal and must be killed by the <i>pre-mixer</i> RF filter; a higher IF makes that easier. The IF filter itself cannot separate image from signal.</li>
<li><b>Classic IFs and dual-conversion:</b> 455 kHz (AM), 10.7 MHz (FM), 21.4 MHz, 70/140 MHz; and why the unresolved trade drives receivers to convert to a high IF first (kill image) then a low IF (get selectivity).</li>
</ul></div>`
    },
    {
      h: String.raw`Further reading`,
      html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Superheterodyne_receiver" target="_blank" rel="noopener">Wikipedia — Superheterodyne receiver</a> — the canonical overview: fixed-IF principle, the IF strip, classic IF values, image response and multiple-conversion designs in one thorough article.</li>
<li><a href="https://www.electronics-notes.com/articles/radio/superheterodyne-receiver/image.php" target="_blank" rel="noopener">Electronics Notes — Superheterodyne receiver image response</a> — a focused, worked explanation of why the image sits 2·IF from the wanted signal and how the IF choice sets image-rejection difficulty.</li>
<li><a href="https://www.site.uottawa.ca/~sloyka/elg3175/Lec_9_ELG3175.pdf" target="_blank" rel="noopener">University of Ottawa ELG3175 — Superheterodyne receiver (Lecture 9 PDF)</a> — university lecture notes deriving the mixer relation, IF selection and image rejection with the underlying math.</li>
<li><a href="https://www.mathworks.com/help/rf/ug/superheterodyne-receiver-using-rf-budget-analyzer-app.html" target="_blank" rel="noopener">MathWorks — Superheterodyne receiver using RF Budget Analyzer</a> — a hands-on design example building the full RF/mixer/IF cascade and computing gain, noise figure, SNR and IP3 stage by stage.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`The IF is the single fixed frequency every channel is down-converted to, so one high-Q channel filter and most of the gain are built once, not retuned across the band.`,
    String.raw`Mixer relation: $f_{IF}=|f_{RF}-f_{LO}|$; the LO is tuned so $f_{LO}=f_{RF}\mp f_{IF}$ tracks the wanted channel and keeps $f_{IF}$ fixed.`,
    String.raw`The IF strip = IF bandpass filter (channel select) + IF amplifier (bulk gain) + AGC + demodulator, all at the fixed $f_{IF}$.`,
    String.raw`Image lands $2f_{IF}$ away from the wanted signal and must be rejected by the pre-mixer RF filter — the IF filter cannot separate image from signal.`,
    String.raw`High-IF vs low-IF trade: high IF puts the image far out (easy to reject) but needs a higher-Q channel filter; low IF eases selectivity but leaves the image close.`,
    String.raw`Channel filter difficulty scales as $Q=f_{IF}/BW$: a lower IF gives a larger fractional bandwidth and an easier filter.`,
    String.raw`Classic standard IFs: 455 kHz (AM), 10.7 MHz (FM), 21.4 MHz, 70/140 MHz — standardised so filters could be mass-produced.`,
    String.raw`Because no single IF wins both trades, high-performance receivers use dual-conversion: a high first IF (kill the image) then a low second IF (get selectivity).`,
    String.raw`Gain distribution: a little gain in the LNA plus most gain in the IF strip keeps noise figure low while avoiding RF instability.`,
    String.raw`Zero-IF (direct conversion) sets $f_{IF}=0$, removing the image but introducing DC-offset and I/Q imbalance instead.`
  ],
  equations: [
    {
      title: 'The IF relation and LO tracking',
      tex: String.raw`$$f_{IF}=\lvert f_{RF}-f_{LO}\rvert,\qquad f_{LO}=f_{RF}\mp f_{IF}$$`,
      derivation: String.raw`<p><b>Where we start.</b> A mixer is a multiplier: it forms the product of the incoming RF signal and a local-oscillator tone. We want to see which output frequency carries the wanted channel and how to keep it fixed.</p>
        <p><b>Step 1 — multiply two tones.</b> Represent the wanted RF as $\cos(2\pi f_{RF}t)$ and the LO as $\cos(2\pi f_{LO}t)$. The product identity gives $$\cos(2\pi f_{RF}t)\cos(2\pi f_{LO}t)=\tfrac12\cos\!\big(2\pi(f_{RF}-f_{LO})t\big)+\tfrac12\cos\!\big(2\pi(f_{RF}+f_{LO})t\big).$$ Two new tones appear: the difference and the sum.</p>
        <p><b>Step 2 — keep the difference.</b> The IF bandpass filter after the mixer passes the low (difference) product and rejects the sum, so the intermediate frequency is $$f_{IF}=\lvert f_{RF}-f_{LO}\rvert,$$ the absolute value because frequency is positive whether the LO is above or below the RF.</p>
        <p><b>Step 3 — make $f_{IF}$ fixed by tuning the LO.</b> Solve for the LO that lands a chosen channel $f_{RF}$ exactly on the fixed $f_{IF}$: $$f_{LO}=f_{RF}\mp f_{IF},$$ where the minus sign is low-side injection ($f_{LO}<f_{RF}$) and the plus is high-side ($f_{LO}>f_{RF}$). As the wanted channel moves, the LO moves with it.</p>
        <p><b>Result.</b> $$f_{IF}=\lvert f_{RF}-f_{LO}\rvert,\qquad f_{LO}=f_{RF}\mp f_{IF}.$$ Sanity check: for FM at $f_{RF}=98.1$ MHz with high-side injection to $f_{IF}=10.7$ MHz, $f_{LO}=98.1+10.7=108.8$ MHz, and indeed $|98.1-108.8|=10.7$ MHz. Only the LO changed; the IF is unchanged.</p>`
    },
    {
      title: 'Image frequency and 2·IF separation',
      tex: String.raw`$$f_{img}=f_{RF}\pm 2f_{IF},\qquad \Delta f=\lvert f_{RF}-f_{img}\rvert=2f_{IF}$$`,
      derivation: String.raw`<p><b>Where we start.</b> The IF relation uses an absolute value, which means <i>two</i> RF frequencies can produce the same $f_{IF}$. We find the unwanted one — the image — and its distance from the wanted signal.</p>
        <p><b>Step 1 — fix the LO for the wanted channel.</b> Take high-side injection: to receive $f_{RF}$ we set $f_{LO}=f_{RF}+f_{IF}$. The wanted signal satisfies $f_{LO}-f_{RF}=f_{IF}$.</p>
        <p><b>Step 2 — find the other frequency at the same IF.</b> Any input $f$ with $\lvert f-f_{LO}\rvert=f_{IF}$ also lands at the IF. Besides $f=f_{LO}-f_{IF}=f_{RF}$, the other solution is $$f_{img}=f_{LO}+f_{IF}=(f_{RF}+f_{IF})+f_{IF}=f_{RF}+2f_{IF}.$$ (For low-side injection the image is at $f_{RF}-2f_{IF}$, hence the $\pm$.)</p>
        <p><b>Step 3 — compute the separation.</b> The distance between the wanted signal and its image is $$\Delta f=\lvert f_{RF}-f_{img}\rvert=\lvert f_{RF}-(f_{RF}\pm 2f_{IF})\rvert=2f_{IF}.$$</p>
        <p><b>Result.</b> $$f_{img}=f_{RF}\pm 2f_{IF},\qquad \Delta f=2f_{IF}.$$ Sanity check: the image is always exactly two IFs from the wanted channel, so raising the IF pushes the image further out — directly easing the pre-mixer image filter's rejection task. The IF filter after the mixer cannot help, because image and signal coincide at $f_{IF}$.</p>`
    },
    {
      title: 'Channel-filter Q at RF versus at IF',
      tex: String.raw`$$Q=\frac{f_{0}}{BW}\;\Longrightarrow\; \frac{Q_{RF}}{Q_{IF}}=\frac{f_{RF}}{f_{IF}}$$`,
      derivation: String.raw`<p><b>Where we start.</b> The whole motive for an IF is that a channel filter is easier to build at a lower centre frequency. We quantify "easier" with the required quality factor $Q$ and compare doing the filtering at RF versus at IF.</p>
        <p><b>Step 1 — define Q for a bandpass channel filter.</b> A bandpass filter of centre frequency $f_0$ that must pass a channel of bandwidth $BW$ has fractional bandwidth $BW/f_0$, and its quality factor is the reciprocal of that: $$Q=\frac{f_0}{BW}.$$ A higher $Q$ means a sharper, harder-to-build, more temperature-sensitive filter.</p>
        <p><b>Step 2 — evaluate at each centre frequency.</b> Filtering the same channel (same $BW$) directly at the radio frequency needs $$Q_{RF}=\frac{f_{RF}}{BW},$$ while filtering it at the intermediate frequency needs $$Q_{IF}=\frac{f_{IF}}{BW}.$$</p>
        <p><b>Step 3 — take the ratio.</b> Dividing, the common $BW$ cancels: $$\frac{Q_{RF}}{Q_{IF}}=\frac{f_{RF}/BW}{f_{IF}/BW}=\frac{f_{RF}}{f_{IF}}.$$</p>
        <p><b>Result.</b> $$\frac{Q_{RF}}{Q_{IF}}=\frac{f_{RF}}{f_{IF}}.$$ Sanity check: for a 200 kHz FM channel at $f_{RF}=100$ MHz, $Q_{RF}=500$, but at $f_{IF}=10.7$ MHz, $Q_{IF}\approx53.5$ — nearly ten times easier, and it never has to tune. This is the quantitative core of why the IF is fixed and low: lower $f_{IF}$ shrinks the required $Q$.</p>`
    },
    {
      title: 'Image rejection from the RF filter',
      tex: String.raw`$$IRR(\text{dB})\approx \big|H_{RF}(f_{RF})\big|_{dB}-\big|H_{RF}(f_{RF}\pm 2f_{IF})\big|_{dB}$$`,
      derivation: String.raw`<p><b>Where we start.</b> We have shown the image is $2f_{IF}$ from the wanted signal and must be attenuated before the mixer. Now we relate the achievable image-rejection ratio (IRR) to the pre-mixer RF filter response and the IF choice.</p>
        <p><b>Step 1 — the image reaches the IF at full mixer conversion.</b> After the mixer, both the wanted signal and the image land on $f_{IF}$ with the same conversion gain, so their ratio at IF equals their ratio at the mixer input. Only pre-mixer filtering distinguishes them.</p>
        <p><b>Step 2 — express the ratio through the RF filter.</b> Let $H_{RF}(f)$ be the RF/image filter response. The wanted signal passes at $H_{RF}(f_{RF})$ (near the passband peak) and the image passes at $H_{RF}(f_{RF}\pm 2f_{IF})$. The image-rejection ratio is the difference in decibels: $$IRR=\big|H_{RF}(f_{RF})\big|_{dB}-\big|H_{RF}(f_{RF}\pm 2f_{IF})\big|_{dB}.$$</p>
        <p><b>Step 3 — tie it to the IF choice.</b> For a filter with a fixed roll-off (dB per octave beyond its edge), the attenuation at the image grows as the image offset $2f_{IF}$ grows. Hence a larger $f_{IF}$ moves the image deeper into the RF filter's stopband, increasing $IRR$.</p>
        <p><b>Result.</b> $$IRR\approx \big|H_{RF}(f_{RF})\big|_{dB}-\big|H_{RF}(f_{RF}\pm 2f_{IF})\big|_{dB}.$$ Sanity check: doubling $f_{IF}$ doubles the image offset ($2f_{IF}$), pushing it roughly one extra octave into the stopband and adding the filter's per-octave rejection — the concrete payoff of choosing a high IF.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What is the intermediate frequency (IF)?`, back: String.raw`The single fixed frequency to which a superheterodyne receiver down-converts every channel, so one channel-select filter and most of the gain can be built once at that frequency.` },
    { front: String.raw`Give the mixer relation for the IF.`, back: String.raw`$f_{IF}=|f_{RF}-f_{LO}|$: the mixer's difference product, selected by the IF bandpass filter.` },
    { front: String.raw`How is the IF kept fixed as you change channels?`, back: String.raw`The LO is tuned to track the wanted channel: $f_{LO}=f_{RF}\mp f_{IF}$. Only the LO moves; $f_{IF}$ stays put.` },
    { front: String.raw`What is the IF strip?`, back: String.raw`The fixed-frequency block after the first mixer: IF bandpass (channel select) + IF amplifier (bulk gain) + AGC + demodulator.` },
    { front: String.raw`Why put most gain at IF rather than RF?`, back: String.raw`Gain at the lower, fixed IF is easier and more stable; high gain at RF risks instability and is expensive at microwave.` },
    { front: String.raw`Where is the image frequency relative to the wanted signal?`, back: String.raw`Exactly $2f_{IF}$ away: $f_{img}=f_{RF}\pm 2f_{IF}$. Both mix to the same $f_{IF}$.` },
    { front: String.raw`Which filter rejects the image, and why not the IF filter?`, back: String.raw`The pre-mixer RF filter. The IF filter cannot, because image and wanted signal coincide at $f_{IF}$ after mixing.` },
    { front: String.raw`State the high-IF vs low-IF trade.`, back: String.raw`High IF: image far away (easy to reject) but a higher-Q channel filter. Low IF: easy selectivity but the image is close and hard to reject.` },
    { front: String.raw`What quality factor does an IF channel filter need?`, back: String.raw`$Q=f_{IF}/BW$. A lower IF means a larger fractional bandwidth and an easier (lower-Q) filter.` },
    { front: String.raw`Name the classic IFs and their systems.`, back: String.raw`455 kHz (AM broadcast), 10.7 MHz (FM broadcast), 21.4 MHz (comms), 70/140 MHz (microwave/satellite).` },
    { front: String.raw`Why does the high-IF/low-IF trade lead to dual-conversion?`, back: String.raw`No single IF wins both: convert first to a high IF (kill the image), then to a low IF (get selectivity).` },
    { front: String.raw`How does zero-IF differ from a conventional IF receiver?`, back: String.raw`It sets $f_{IF}=0$ (direct to baseband), removing the image but adding DC-offset and I/Q imbalance problems instead.` }
  ],
  mcqs: [
    { q: String.raw`The main reason a superheterodyne receiver uses a fixed intermediate frequency is to:`, options: [String.raw`Increase the transmit power`, String.raw`Build one high-Q channel filter and most of the gain at a single frequency instead of retuning across the band`, String.raw`Eliminate the local oscillator`, String.raw`Remove the need for an antenna`], answer: 1, explain: String.raw`A fixed IF lets the hard, selective filtering and the bulk gain be built once at one frequency; only the LO tunes.` },
    { q: String.raw`The IF produced by a mixer is:`, options: [String.raw`$f_{RF}+f_{LO}$ only`, String.raw`$|f_{RF}-f_{LO}|$`, String.raw`$f_{RF}\cdot f_{LO}$`, String.raw`$f_{LO}/f_{RF}$`], answer: 1, explain: String.raw`The IF bandpass filter selects the mixer's difference product, $f_{IF}=|f_{RF}-f_{LO}|$.` },
    { q: String.raw`To keep the IF fixed while receiving different channels, the receiver tunes the:`, options: [String.raw`IF filter centre frequency`, String.raw`Local oscillator`, String.raw`Demodulator`, String.raw`Antenna length`], answer: 1, explain: String.raw`Only the LO is tuned, $f_{LO}=f_{RF}\mp f_{IF}$; the selective IF circuits never move.` },
    { q: String.raw`For an FM signal at 98.1 MHz down-converted to a 10.7 MHz IF with high-side injection, the LO is:`, options: [String.raw`87.4 MHz`, String.raw`98.1 MHz`, String.raw`108.8 MHz`, String.raw`10.7 MHz`], answer: 2, explain: String.raw`High-side: $f_{LO}=f_{RF}+f_{IF}=98.1+10.7=108.8$ MHz, and $|98.1-108.8|=10.7$ MHz.` },
    { q: String.raw`The image frequency is separated from the wanted signal by:`, options: [String.raw`$f_{IF}$`, String.raw`$2f_{IF}$`, String.raw`$f_{IF}/2$`, String.raw`$f_{LO}$`], answer: 1, explain: String.raw`$f_{img}=f_{RF}\pm 2f_{IF}$, so the separation is exactly $2f_{IF}$.` },
    { q: String.raw`Which stage is responsible for rejecting the image frequency?`, options: [String.raw`The IF bandpass filter after the mixer`, String.raw`The pre-mixer RF/image filter`, String.raw`The AGC loop`, String.raw`The demodulator`], answer: 1, explain: String.raw`Image and wanted signal coincide at $f_{IF}$, so only the pre-mixer RF filter can separate them.` },
    { q: String.raw`Choosing a higher IF primarily:`, options: [String.raw`Makes the channel-select filter easier but the image harder to reject`, String.raw`Makes the image easier to reject but the channel-select filter harder (higher Q)`, String.raw`Has no effect on either`, String.raw`Removes the need for a mixer`], answer: 1, explain: String.raw`Higher IF pushes the image $2f_{IF}$ further out (easy to reject) but raises the required channel-filter $Q=f_{IF}/BW$.` },
    { q: String.raw`A channel-select filter's required quality factor is:`, options: [String.raw`$Q=BW/f_{IF}$`, String.raw`$Q=f_{IF}/BW$`, String.raw`$Q=f_{IF}\cdot BW$`, String.raw`$Q=f_{LO}/f_{IF}$`], answer: 1, explain: String.raw`$Q=f_{IF}/BW$; a lower IF gives a larger fractional bandwidth and an easier filter.` },
    { q: String.raw`455 kHz is the classic IF for:`, options: [String.raw`FM broadcast`, String.raw`AM broadcast`, String.raw`Satellite downlinks`, String.raw`Radar`], answer: 1, explain: String.raw`455 kHz (AM) is a low IF chosen so a cheap, sharp ceramic channel filter handles the narrow AM channel.` },
    { q: String.raw`Dual-conversion receivers exist because:`, options: [String.raw`One IF cannot simultaneously give easy image rejection and easy channel selectivity`, String.raw`Two mixers are cheaper than one`, String.raw`The antenna requires two feeds`, String.raw`AGC needs two loops`], answer: 0, explain: String.raw`A high first IF kills the image; a low second IF gives selectivity — the two-IF cascade resolves the single-IF trade.` },
    { q: String.raw`Compared with an IF strip receiver, a zero-IF (direct-conversion) receiver:`, options: [String.raw`Has a worse image problem`, String.raw`Sets $f_{IF}=0$, removing the image but adding DC-offset and I/Q imbalance issues`, String.raw`Cannot demodulate FM`, String.raw`Requires a higher LO than the RF`], answer: 1, explain: String.raw`Zero-IF mixes straight to baseband; there is no image, but DC offset and I/Q mismatch become the dominant impairments.` },
    { q: String.raw`In the IF strip, the AGC's job is to:`, options: [String.raw`Tune the LO`, String.raw`Hold the level into the demodulator roughly constant despite large signal fades`, String.raw`Reject the image`, String.raw`Set the IF centre frequency`], answer: 1, explain: String.raw`AGC servo-controls the IF amplifier gain so the demodulator sees a near-constant level over an 80–100 dB signal range.` }
  ],
  numericals: [
    { q: String.raw`An FM tuner must receive $f_{RF}=98.1$ MHz at a $10.7$ MHz IF. (a) Find the high-side LO. (b) Find the low-side LO. (c) Verify each gives the correct IF. (d) Which choice moves the image further from the FM band?`, solution: String.raw`<p><b>Formula.</b> The IF relation is $f_{IF}=|f_{RF}-f_{LO}|$, so the LO that lands $f_{RF}$ on $f_{IF}$ is $f_{LO}=f_{RF}\pm f_{IF}$ (high-side $+$, low-side $-$), and the image is $f_{img}=f_{RF}\pm 2f_{IF}$.</p>
<p><b>Substitute.</b> High-side: $f_{LO}=98.1+10.7$. Low-side: $f_{LO}=98.1-10.7$. Images: high-side $f_{img}=98.1+21.4$; low-side $f_{img}=98.1-21.4$.</p>
<p><b>Compute.</b> (a) High-side $f_{LO}=108.8$ MHz. (b) Low-side $f_{LO}=87.4$ MHz. (c) High-side $|98.1-108.8|=10.7$ MHz ✓; low-side $|98.1-87.4|=10.7$ MHz ✓. (d) High-side image $=119.5$ MHz (well above the 88–108 MHz FM band); low-side image $=76.7$ MHz (below the band).</p>
<p><b>Explanation.</b> Both injection choices produce the same 10.7 MHz IF, confirming the IF relation's $\pm$. High-side injection places the image at 119.5 MHz, comfortably outside the crowded FM band, which is why broadcast tuners use high-side LO; the image is $2f_{IF}=21.4$ MHz from the wanted signal either way.</p>` },
    { q: String.raw`A receiver tunes $f_{RF}=100$ MHz with a $70$ MHz IF and high-side injection. (a) Find the LO. (b) Find the image frequency. (c) Find the wanted-to-image separation. (d) If the IF were dropped to $10.7$ MHz, how does the image separation change?`, solution: String.raw`<p><b>Formula.</b> High-side LO: $f_{LO}=f_{RF}+f_{IF}$; image (high-side): $f_{img}=f_{RF}+2f_{IF}$; separation $\Delta f=|f_{RF}-f_{img}|=2f_{IF}$.</p>
<p><b>Substitute.</b> $f_{LO}=100+70$; $f_{img}=100+2(70)$; $\Delta f=2(70)$; and for the low IF $\Delta f'=2(10.7)$.</p>
<p><b>Compute.</b> (a) $f_{LO}=170$ MHz. (b) $f_{img}=240$ MHz. (c) $\Delta f=140$ MHz. (d) At 10.7 MHz IF, $\Delta f'=21.4$ MHz — the image moves from 140 MHz away to only 21.4 MHz away.</p>
<p><b>Explanation.</b> The separation is exactly $2f_{IF}$, so the 70 MHz IF puts the image a huge 140 MHz out where the RF filter rejects it easily; dropping to 10.7 MHz brings the image nearly seven times closer, making image rejection much harder. This is the high-IF advantage that motivates a high first IF in dual-conversion.</p>` },
    { q: String.raw`A 200 kHz FM channel at $f_{RF}=100$ MHz is to be selected. (a) Find the filter Q if done at RF. (b) Find the Q at a $10.7$ MHz IF. (c) Find the ratio. (d) Comment on feasibility.`, solution: String.raw`<p><b>Formula.</b> A bandpass channel filter needs quality factor $Q=f_0/BW$, so $Q_{RF}=f_{RF}/BW$, $Q_{IF}=f_{IF}/BW$, and the ratio $Q_{RF}/Q_{IF}=f_{RF}/f_{IF}$.</p>
<p><b>Substitute.</b> $Q_{RF}=\dfrac{100\times10^6}{200\times10^3}$; $Q_{IF}=\dfrac{10.7\times10^6}{200\times10^3}$; ratio $=\dfrac{100}{10.7}$.</p>
<p><b>Compute.</b> (a) $Q_{RF}=500$. (b) $Q_{IF}=53.5$. (c) Ratio $\approx 9.35$. (d) A tunable $Q=500$ filter at RF is impractical; a fixed $Q\approx 53$ ceramic/crystal filter at 10.7 MHz is routine mass production.</p>
<p><b>Explanation.</b> Selecting the channel at IF needs a filter roughly nine times less demanding, and it never has to tune, whereas the RF filter would have to hold $Q=500$ while sweeping the band. This is the quantitative heart of why the channel-select job is moved to a low, fixed IF.</p>` },
    { q: String.raw`A receiver has $f_{RF}=1.5$ GHz. Compare a $f_{IF}=250$ MHz plan against a $f_{IF}=45$ MHz plan for a 5 MHz channel. (a) Image separation each. (b) Channel-filter Q each. (c) Which eases image rejection? (d) Which eases selectivity, and what does this imply?`, solution: String.raw`<p><b>Formula.</b> Image separation $\Delta f=2f_{IF}$; channel-filter quality factor $Q=f_{IF}/BW$.</p>
<p><b>Substitute.</b> High IF: $\Delta f=2(250)$ MHz, $Q=\dfrac{250}{5}$. Low IF: $\Delta f=2(45)$ MHz, $Q=\dfrac{45}{5}$.</p>
<p><b>Compute.</b> (a) High-IF separation $=500$ MHz; low-IF separation $=90$ MHz. (b) High-IF $Q=50$; low-IF $Q=9$. (c) The 250 MHz IF eases image rejection (image 500 MHz out). (d) The 45 MHz IF eases selectivity ($Q=9$ vs 50), implying you want the high IF first (kill image) then a low IF (get selectivity) — i.e. dual-conversion.</p>
<p><b>Explanation.</b> The two plans pull in opposite directions exactly as the high-IF/low-IF trade predicts: the 250 MHz IF wins image rejection while the 45 MHz IF wins channel selectivity. Since neither wins both, cascading them — high first IF then low second IF — is the standard dual-conversion resolution.</p>` },
    { q: String.raw`With low-side injection, a receiver has $f_{LO}=810$ kHz and $f_{IF}=455$ kHz (AM band). (a) Find the wanted $f_{RF}$. (b) Find the image. (c) Find the separation. (d) Verify both mix to the IF.`, solution: String.raw`<p><b>Formula.</b> Low-side injection means $f_{LO}=f_{RF}-f_{IF}$, so $f_{RF}=f_{LO}+f_{IF}$; the image is the other frequency $f_{IF}$ from the LO, $f_{img}=f_{LO}-f_{IF}$; separation $\Delta f=2f_{IF}$.</p>
<p><b>Substitute.</b> $f_{RF}=810+455$; $f_{img}=810-455$; $\Delta f=2(455)$.</p>
<p><b>Compute.</b> (a) $f_{RF}=1265$ kHz. (b) $f_{img}=355$ kHz. (c) $\Delta f=910$ kHz $=2f_{IF}$ ✓. (d) Wanted: $|1265-810|=455$ kHz ✓; image: $|355-810|=455$ kHz ✓ — both mix to the 455 kHz IF.</p>
<p><b>Explanation.</b> Both the wanted 1265 kHz station and the 355 kHz image are 455 kHz from the LO, so both land on the IF; only the pre-mixer RF filter can suppress the 355 kHz image, which sits $2f_{IF}=910$ kHz below the wanted station. The low 455 kHz IF makes the channel filter easy at the cost of this fairly close image — the classic AM-band compromise.</p>` }
  ],
  realWorld: String.raw`<p>The intermediate frequency is the organising idea behind almost every classic radio you have used. An AM pocket radio down-converts the whole 530–1700 kHz band to a fixed <b>455 kHz</b> IF where one cheap ceramic filter does the channel selection; an FM tuner uses <b>10.7 MHz</b>, and better FM front-ends are dual-conversion — a high first IF to throw the image out of the crowded band, then a low second IF for selectivity. Microwave and satellite links standardise on <b>70 MHz</b> and <b>140 MHz</b> IFs so that modems, filters and test gear interoperate; a satellite ground station's block down-converter (LNB) hands the indoor receiver a fixed IF over a coax run. In test instruments, a spectrum analyser is a swept superhet: it sweeps its LO and measures power at a fixed IF through a selectable resolution-bandwidth filter — the IF filter <i>is</i> the resolution bandwidth. Even modern software-defined radios keep the idea: many SDR front-ends down-convert to a low IF for the ADC, and where they go all the way to baseband they adopt <a href="#zero-if">zero-IF</a> and pay for it with DC-offset and I/Q-imbalance correction. Understanding IF explains why receivers have the block structure they do — a tunable <a href="#mixer">mixer</a>/LO up front and a fixed, filter-and-gain <a href="#superheterodyne">superheterodyne</a> IF strip behind it.</p>`,
  related: ['superheterodyne', 'mixer', 'image-frequency', 'bpf', 'zero-if']
});
