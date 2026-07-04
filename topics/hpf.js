// High-Pass Filter (HPF) topic. CONTENT is a global object.
CONTENT.topics.push(
  {
    id: 'hpf',
    title: 'High-Pass Filter (HPF)',
    category: 'Filters',
    tags: ['high-pass', 'RC', 'CR', 'DC-block', 'coupling', 'cutoff', 'phase lead'],
    summary: String.raw`A high-pass filter passes signals above its cutoff frequency $f_c$ and attenuates DC and low frequencies; the simplest CR realization blocks DC while its magnitude rises at +20 dB/decade up to $f_c=1/(2\pi RC)$ and then flattens.`,
    diagram: [
      {
        title: String.raw`CR high-pass filter and its magnitude response`,
        svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr-hpf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">CR high-pass filter: capacitor in series, resistor to ground</text>
          <line x1="20" y1="70" x2="60" y2="70" stroke="#9aa7b5"/>
          <text x="30" y="62" fill="#9aa7b5" font-size="10">Vin</text>
          <rect x="60" y="62" width="34" height="16" rx="6" fill="#1c232e" stroke="#4dabf7"/>
          <text x="77" y="74" fill="#e6edf3" text-anchor="middle" font-size="10">C</text>
          <line x1="94" y1="70" x2="160" y2="70" stroke="#9aa7b5"/>
          <line x1="160" y1="70" x2="160" y2="120" stroke="#9aa7b5"/>
          <rect x="146" y="90" width="28" height="34" rx="6" fill="#1c232e" stroke="#63e6be"/>
          <text x="160" y="112" fill="#e6edf3" text-anchor="middle" font-size="10">R</text>
          <line x1="160" y1="124" x2="160" y2="150" stroke="#9aa7b5"/>
          <line x1="146" y1="150" x2="174" y2="150" stroke="#9aa7b5"/>
          <line x1="152" y1="156" x2="168" y2="156" stroke="#9aa7b5"/>
          <line x1="160" y1="70" x2="220" y2="70" stroke="#9aa7b5" marker-end="url(#arr-hpf)"/>
          <text x="205" y="62" fill="#63e6be" font-size="10">Vout</text>
          <rect x="260" y="40" width="260" height="120" rx="6" fill="#1c232e" stroke="#9aa7b5"/>
          <line x1="290" y1="150" x2="500" y2="150" stroke="#9aa7b5" marker-end="url(#arr-hpf)"/>
          <line x1="290" y1="150" x2="290" y2="50" stroke="#9aa7b5" marker-end="url(#arr-hpf)"/>
          <text x="510" y="163" fill="#9aa7b5" font-size="9">f (log)</text>
          <text x="298" y="52" fill="#9aa7b5" font-size="9">|H| dB</text>
          <path d="M300,140 L390,80 L500,74" fill="none" stroke="#ffa94d" stroke-width="2"/>
          <line x1="390" y1="50" x2="390" y2="150" stroke="#b197fc" stroke-dasharray="4 3"/>
          <text x="390" y="170" fill="#b197fc" font-size="9" text-anchor="middle">fc</text>
          <text x="330" y="118" fill="#ffa94d" font-size="9">+20 dB/dec</text>
          <text x="455" y="66" fill="#ffa94d" font-size="9">flat (pass)</text>
        </svg>`,
        caption: String.raw`A CR high-pass: the series capacitor blocks DC and passes high frequencies. Below $f_c$ the response rises at +20 dB/decade; above $f_c$ it flattens into the passband. The knee sits at $f_c=1/(2\pi RC)$, where the gain is $-3$ dB.`
      },
      {
        title: String.raw`DC-blocking / AC-coupling use of an HPF`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr2-hpf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">Coupling capacitor: removes the DC offset, passes the signal</text>
          <rect x="30" y="60" width="150" height="90" rx="6" fill="#1c232e" stroke="#4dabf7"/>
          <text x="105" y="52" fill="#9aa7b5" font-size="10" text-anchor="middle">input: signal + DC offset</text>
          <line x1="45" y1="130" x2="165" y2="130" stroke="#9aa7b5" stroke-dasharray="3 3"/>
          <text x="172" y="133" fill="#9aa7b5" font-size="8">offset</text>
          <path d="M45,110 Q60,85 75,110 T105,110 T135,110 T165,110" fill="none" stroke="#ffa94d" stroke-width="1.6"/>
          <line x1="180" y1="105" x2="240" y2="105" stroke="#9aa7b5" marker-end="url(#arr2-hpf)"/>
          <rect x="240" y="88" width="60" height="34" rx="6" fill="#1c232e" stroke="#63e6be"/>
          <text x="270" y="103" fill="#e6edf3" text-anchor="middle" font-size="10">HPF</text>
          <text x="270" y="116" fill="#9aa7b5" text-anchor="middle" font-size="8">C series</text>
          <line x1="300" y1="105" x2="360" y2="105" stroke="#9aa7b5" marker-end="url(#arr2-hpf)"/>
          <rect x="360" y="60" width="150" height="90" rx="6" fill="#1c232e" stroke="#b197fc"/>
          <text x="435" y="52" fill="#9aa7b5" font-size="10" text-anchor="middle">output: signal centred on 0</text>
          <line x1="375" y1="105" x2="495" y2="105" stroke="#9aa7b5" stroke-dasharray="3 3"/>
          <text x="500" y="108" fill="#9aa7b5" font-size="8">0 V</text>
          <path d="M375,90 Q390,65 405,90 T435,90 T465,90 T495,90" fill="none" stroke="#63e6be" stroke-width="1.6"/>
        </svg>`,
        caption: String.raw`As a DC block / AC-coupling stage, a series capacitor (an HPF with $f_c$ well below the signal band) strips the DC bias so the AC signal can be re-referenced by the next stage. The wanted signal passes unchanged; only the constant offset and very low drift are removed.`
      },
      {
        title: String.raw`HPF as the complement of an LPF`,
        svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
          <defs><marker id="arr3-hpf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
          <text x="270" y="18" fill="#e6edf3" font-size="13" text-anchor="middle">HPF + LPF split the spectrum at the same fc (complementary)</text>
          <line x1="60" y1="180" x2="500" y2="180" stroke="#9aa7b5" marker-end="url(#arr3-hpf)"/>
          <line x1="60" y1="180" x2="60" y2="40" stroke="#9aa7b5" marker-end="url(#arr3-hpf)"/>
          <text x="508" y="183" fill="#9aa7b5" font-size="9">f</text>
          <text x="66" y="42" fill="#9aa7b5" font-size="9">|H|</text>
          <line x1="280" y1="40" x2="280" y2="180" stroke="#b197fc" stroke-dasharray="4 3"/>
          <text x="280" y="196" fill="#b197fc" font-size="9" text-anchor="middle">fc</text>
          <path d="M70,60 L270,64 L360,120 L500,172" fill="none" stroke="#4dabf7" stroke-width="2"/>
          <text x="120" y="54" fill="#4dabf7" font-size="10">LPF (keeps lows)</text>
          <path d="M70,172 L200,120 L290,64 L500,60" fill="none" stroke="#ffa94d" stroke-width="2"/>
          <text x="380" y="54" fill="#ffa94d" font-size="10">HPF (keeps highs)</text>
          <line x1="280" y1="112" x2="280" y2="112" stroke="#63e6be"/>
          <text x="270" y="128" fill="#63e6be" font-size="9" text-anchor="middle">cross at -3 dB</text>
        </svg>`,
        caption: String.raw`An HPF is the mirror image of an LPF about the same cutoff: they cross at $-3$ dB at $f_c$. A first-order LPF and HPF placed in parallel and summed approximate an all-pass split — one branch keeps the lows, the other keeps the highs.`
      }
    ],
    prerequisites: ['filters', 'frequency-spectrum'],
    intro: String.raw`<p><b>Why does a high-pass filter matter?</b> Real signals almost always ride on unwanted low-frequency junk — a DC bias from a previous amplifier stage, slow baseline drift from temperature or electrode potentials, or mains hum leaking in at the very bottom of the band. If you feed that straight into the next stage, the DC offset can saturate an amplifier and the drift wanders your measurement off-scale. A high-pass filter is the tool that strips those slow components away while letting the information-bearing high-frequency content through untouched. Without it, AC coupling between stages, baseline restoration, and offset removal would be impossible.</p>
<p>A <b>high-pass filter (HPF)</b> passes frequencies <i>above</i> a cutoff $f_c$ and attenuates everything below it, including DC. The simplest passive form is the <b>CR</b> network: a series capacitor followed by a shunt resistor. The capacitor is an open circuit at DC (blocking it entirely) and a short at high frequency (passing the signal), so the output rises from zero at DC to the full input in the passband. Understanding the HPF means grasping three things: its transfer function $H(j\omega)=j\omega/(\omega_c+j\omega)$ and the $-3$ dB cutoff $f_c=1/(2\pi RC)$; the $+20$ dB/decade rising skirt below cutoff followed by a flat passband; and its dual role as a <b>DC-blocking / coupling</b> element with a characteristic <b>phase lead</b>.</p>`,
    sections: [
      {
        h: 'What a high-pass filter does',
        html: String.raw`<p>A high-pass filter allows frequency components <b>above</b> its cutoff $f_c$ to pass while attenuating those below it. At DC ($f=0$) an ideal first-order HPF has zero gain; as frequency rises the gain climbs, reaches $-3$ dB (about 0.707 of full amplitude) exactly at $f_c$, and asymptotes to unity (0 dB) deep in the passband.</p>
        <p>The simplest realization is the <b>CR</b> network — a series capacitor $C$ with a shunt resistor $R$ to ground, output taken across $R$. The capacitor's impedance $Z_C=1/(j\omega C)$ is huge at low frequency (blocking the signal) and small at high frequency (passing it):</p>
        <ul>
          <li><b>At DC:</b> $Z_C\to\infty$, the capacitor is an open circuit, $V_{out}=0$ — DC is completely blocked.</li>
          <li><b>At high $f$:</b> $Z_C\to 0$, the capacitor is a short, $V_{out}\to V_{in}$ — the signal passes.</li>
        </ul>
        <div class="callout tip"><b>Key intuition:</b> think of the series capacitor as a frequency-dependent gate. Slow (low-frequency) changes cannot push charge through it fast enough, so they are held back; fast (high-frequency) changes sail through. That is why the same circuit that "high-passes" is also called a <i>DC block</i> or <i>coupling capacitor</i>.</div>`
      },
      {
        h: 'The transfer function and the cutoff frequency',
        html: String.raw`<p>Using the voltage divider between $Z_C$ and $R$ with output across $R$:</p>
        <p>$$H(j\omega)=\frac{R}{R+\frac{1}{j\omega C}}=\frac{j\omega RC}{1+j\omega RC}.$$</p>
        <p>Defining the cutoff angular frequency $\omega_c=1/(RC)$, this becomes the canonical first-order high-pass form</p>
        <p>$$H(j\omega)=\frac{j\omega}{\omega_c+j\omega}=\frac{j\omega/\omega_c}{1+j\omega/\omega_c}.$$</p>
        <p>The <b>numerator zero at the origin</b> ($j\omega$) is what kills DC; the pole at $\omega_c$ flattens the response in the passband. The magnitude is</p>
        <p>$$|H(j\omega)|=\frac{\omega/\omega_c}{\sqrt{1+(\omega/\omega_c)^2}}.$$</p>
        <p>At $\omega=\omega_c$ this equals $1/\sqrt{2}\approx0.707$, i.e. $-3$ dB — the defining half-power point. The cutoff in hertz is</p>
        <p>$$f_c=\frac{1}{2\pi RC}.$$</p>
        <div class="callout tip"><b>Remember:</b> the $-3$ dB point is where the resistive and reactive impedances are equal ($R=1/(\omega C)$). This equal-impedance condition is the physical origin of every RC cutoff, high-pass or low-pass alike.</div>`
      },
      {
        h: 'Frequency response: rising skirt then flat passband',
        html: String.raw`<p>On a Bode magnitude plot (log frequency, dB gain) the first-order HPF has two asymptotes:</p>
        <ul>
          <li><b>Below $f_c$ (stopband):</b> $|H|\approx\omega/\omega_c$, so the gain rises at <b>+20 dB/decade</b> (a factor of 10 in frequency gives a factor of 10 in amplitude). Every octave below cutoff loses 6 dB.</li>
          <li><b>Above $f_c$ (passband):</b> $|H|\to 1$, a flat 0 dB response.</li>
        </ul>
        <p>The two asymptotes meet at $f_c$, and the true curve sits $3$ dB below the corner there. Contrast this with the low-pass filter, whose skirt <i>falls</i> at $-20$ dB/decade above cutoff — the HPF is its mirror image.</p>
        <div class="callout tip"><b>Slope check:</b> "+20 dB/decade" and "first-order" are two names for the same thing. An $n$-th order high-pass has a $+20n$ dB/decade rising skirt. Cascade two first-order sections (or use an active 2-pole design) to get $+40$ dB/decade for sharper rejection of low-frequency junk.</div>`
      },
      {
        h: 'DC blocking, AC coupling and drift removal',
        html: String.raw`<p>The most common everyday use of a high-pass is not "filtering a band" but <b>coupling</b>. A single series capacitor between two stages is a high-pass whose $f_c$ is deliberately placed <i>well below</i> the lowest signal frequency of interest. Then:</p>
        <ul>
          <li><b>DC blocking:</b> the constant bias/offset of the previous stage (which sits at $f=0$) is fully rejected, so it cannot saturate or mis-bias the next amplifier.</li>
          <li><b>Baseline / drift removal:</b> very slow wander (thermal drift, electrode offset in biomedical signals) lies below $f_c$ and is attenuated, keeping the signal centred.</li>
          <li><b>Hum rejection (partial):</b> placing $f_c$ above mains frequency removes 50/60 Hz hum, though a notch filter is better when the wanted band overlaps the hum.</li>
        </ul>
        <p>The design rule is to choose $C$ (and the load $R$ it sees) so that $f_c=1/(2\pi RC)$ is a decade or more below the lowest wanted frequency — that keeps in-band attenuation and phase distortion negligible while still killing DC and drift.</p>
        <div class="callout tip"><b>Practical warning:</b> a coupling cap forms an HPF with whatever resistance loads it. If the next stage's input impedance is low, $f_c$ rises and you may unintentionally attenuate low-frequency signal. Always compute $f_c$ from the <i>actual</i> load, not just the nominal resistor.</div>`
      },
      {
        h: 'Phase response: the high-pass phase lead',
        html: String.raw`<p>The transfer function $H(j\omega)=j\omega/(\omega_c+j\omega)$ carries a $+90^\circ$ from the numerator $j\omega$ and a lagging term from the denominator pole. The net phase is</p>
        <p>$$\angle H(j\omega)=90^\circ-\arctan\!\left(\frac{\omega}{\omega_c}\right).$$</p>
        <ul>
          <li><b>At DC:</b> phase $\to +90^\circ$ (pure differentiator-like lead — the output leads the input by a quarter cycle).</li>
          <li><b>At $f_c$:</b> phase $=+45^\circ$.</li>
          <li><b>Deep in passband:</b> phase $\to 0^\circ$ (signal passes with no phase shift).</li>
        </ul>
        <p>So a first-order HPF always <b>leads</b> in phase (output ahead of input), the opposite sign of the low-pass, which lags. This phase lead matters in feedback loops and audio, and it is why a differentiator (an extreme high-pass) produces a $+90^\circ$ leading output.</p>
        <div class="callout tip"><b>Symmetry:</b> LPF and HPF phases are mirror images. Where the LPF lags $-45^\circ$ at cutoff, the HPF leads $+45^\circ$. Summing a matched LPF and HPF recovers a phase-coherent (all-pass-like) reconstruction only if their cutoffs align.</div>`
      },
      {
        h: 'Active high-pass filters',
        html: String.raw`<p>Passive CR filters cannot provide gain and their $f_c$ depends on the load. An <b>active high-pass</b> uses an op-amp to fix both. The simplest inverting active HPF places a series capacitor at the input of an inverting amplifier:</p>
        <p>$$H(j\omega)=-\frac{R_f}{R_1+\frac{1}{j\omega C}}=-\frac{j\omega R_f C}{1+j\omega R_1 C},$$</p>
        <p>giving passband gain $-R_f/R_1$ and cutoff $f_c=1/(2\pi R_1 C)$. For steeper skirts, the <b>Sallen–Key</b> and <b>multiple-feedback</b> topologies build second-order high-pass sections ($+40$ dB/decade) with a controllable $Q$, letting you set Butterworth (maximally flat), Chebyshev (steeper but rippled), or Bessel (linear phase) responses.</p>
        <table class="data">
          <tr><th>Aspect</th><th>Passive CR HPF</th><th>Active HPF</th></tr>
          <tr><td>Gain</td><td>$\le 1$ (attenuates)</td><td>Can amplify ($-R_f/R_1$)</td></tr>
          <tr><td>Load sensitivity</td><td>$f_c$ shifts with load</td><td>Buffered, load-independent</td></tr>
          <tr><td>Order</td><td>First (per section)</td><td>Second-order easy (Sallen–Key)</td></tr>
          <tr><td>Power</td><td>None needed</td><td>Needs op-amp supply</td></tr>
        </table>
        <div class="callout tip"><b>When to go active:</b> reach for an active HPF when you need gain, a load-independent cutoff, or a sharp ($\ge$ 2nd-order) roll-off. For a simple DC block between low-impedance stages, a single coupling capacitor is enough.</div>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip"><p>You should now be able to explain:</p>
<ul>
<li><b>The transfer function and cutoff:</b> $H(j\omega)=j\omega/(\omega_c+j\omega)=(j\omega/\omega_c)/(1+j\omega/\omega_c)$, with the DC-killing zero at the origin, and the $-3$ dB cutoff $f_c=1/(2\pi RC)$ where $R=1/(\omega C)$.</li>
<li><b>The magnitude shape:</b> a $+20$ dB/decade rising skirt below $f_c$ (first-order), flattening to a 0 dB passband above it — the mirror image of a low-pass.</li>
<li><b>DC blocking / AC coupling:</b> a series capacitor placed with $f_c$ a decade below the signal band removes DC offset, baseline drift and (partially) hum, without disturbing the wanted signal.</li>
<li><b>The phase lead:</b> $\angle H=90^\circ-\arctan(\omega/\omega_c)$, giving $+90^\circ$ at DC, $+45^\circ$ at $f_c$, and $0^\circ$ deep in the passband — always leading, opposite to the LPF.</li>
<li><b>Active vs passive and higher order:</b> op-amp (Sallen–Key/MFB) HPFs add gain, a load-independent cutoff, and steeper $+40n$ dB/decade skirts, and the HPF is the complement of the LPF about a shared $f_c$.</li>
</ul></div>`
      }
    ],
    keyPoints: [
      String.raw`A high-pass filter passes frequencies above $f_c$ and blocks DC and low frequencies; the CR network (series $C$, shunt $R$) is the simplest form.`,
      String.raw`Transfer function: $H(j\omega)=\dfrac{j\omega}{\omega_c+j\omega}=\dfrac{j\omega/\omega_c}{1+j\omega/\omega_c}$, with a DC-killing zero at the origin.`,
      String.raw`Cutoff (half-power, $-3$ dB) frequency: $f_c=\dfrac{1}{2\pi RC}$, where $R=1/(\omega C)$ (equal resistive and reactive impedance).`,
      String.raw`Magnitude $|H|=\dfrac{\omega/\omega_c}{\sqrt{1+(\omega/\omega_c)^2}}$: it rises at $+20$ dB/decade below $f_c$ then flattens to 0 dB above it.`,
      String.raw`A first-order HPF gives $+20$ dB/decade; an $n$-th order HPF gives $+20n$ dB/decade for sharper low-frequency rejection.`,
      String.raw`As a DC-block / coupling capacitor, a series $C$ (with $f_c$ below the band) removes offset, baseline drift and partial hum.`,
      String.raw`Phase: $\angle H=90^\circ-\arctan(\omega/\omega_c)$ — a phase lead: $+90^\circ$ at DC, $+45^\circ$ at $f_c$, $0^\circ$ in passband.`,
      String.raw`The HPF is the mirror image (complement) of the LPF about the same cutoff; they cross at $-3$ dB at $f_c$.`,
      String.raw`Active (Sallen–Key / multiple-feedback) HPFs add gain, a load-independent cutoff, and easy second-order roll-off.`,
      String.raw`A coupling cap's $f_c$ depends on the actual load resistance it drives — always compute $f_c$ from the real load, not the nominal resistor.`
    ],
    equations: [
      {
        title: 'CR high-pass transfer function',
        tex: String.raw`$$H(j\omega)=\frac{j\omega}{\omega_c+j\omega}=\frac{j\omega/\omega_c}{1+j\omega/\omega_c}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The CR high-pass is a series capacitor $C$ feeding a shunt resistor $R$, with the output taken across $R$. It is a frequency-dependent voltage divider, so we compute the divider ratio using the capacitor's complex impedance.</p>
        <p><b>Step 1 — write the impedances.</b> The capacitor's impedance is $Z_C=\dfrac{1}{j\omega C}$ and the resistor's is $Z_R=R$. The output voltage is the fraction of the input that appears across $R$:</p>
        $$H(j\omega)=\frac{V_{out}}{V_{in}}=\frac{Z_R}{Z_R+Z_C}=\frac{R}{R+\dfrac{1}{j\omega C}}.$$
        <p><b>Step 2 — clear the compound fraction.</b> Multiply numerator and denominator by $j\omega C$:</p>
        $$H(j\omega)=\frac{j\omega RC}{j\omega RC+1}=\frac{j\omega RC}{1+j\omega RC}.$$
        <p><b>Step 3 — introduce the cutoff.</b> Define $\omega_c\equiv 1/(RC)$, so $RC=1/\omega_c$ and $j\omega RC=j\omega/\omega_c$. Substituting,</p>
        $$H(j\omega)=\frac{j\omega/\omega_c}{1+j\omega/\omega_c}=\frac{j\omega}{\omega_c+j\omega}.$$
        <p><b>Result.</b> $$H(j\omega)=\frac{j\omega}{\omega_c+j\omega}.$$ Sanity check: at $\omega\to0$ (DC) $H\to0$ (DC blocked); at $\omega\to\infty$ $H\to1$ (passband); the numerator zero at the origin is what removes DC, exactly what a high-pass must do.</p>`
      },
      {
        title: 'Cutoff (−3 dB) frequency',
        tex: String.raw`$$f_c=\frac{1}{2\pi RC}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The cutoff is defined as the frequency where the output power is half the passband power, i.e. the magnitude drops to $1/\sqrt2$ of its passband value ($-3$ dB). We find that frequency from the transfer-function magnitude.</p>
        <p><b>Step 1 — magnitude of the transfer function.</b> From $H=\dfrac{j\omega/\omega_c}{1+j\omega/\omega_c}$, take the modulus of numerator over modulus of denominator:</p>
        $$|H(j\omega)|=\frac{\omega/\omega_c}{\sqrt{1+(\omega/\omega_c)^2}}.$$
        <p><b>Step 2 — impose the half-power condition.</b> Set $|H|=1/\sqrt2$ and let $x=\omega/\omega_c$:</p>
        $$\frac{x}{\sqrt{1+x^2}}=\frac{1}{\sqrt2}\ \Rightarrow\ \frac{x^2}{1+x^2}=\frac12\ \Rightarrow\ 2x^2=1+x^2\ \Rightarrow\ x^2=1.$$
        <p>So $x=1$, i.e. $\omega=\omega_c$. Equivalently the resistive and reactive impedances are equal, $R=1/(\omega C)$.</p>
        <p><b>Step 3 — convert to hertz.</b> With $\omega_c=1/(RC)$ and $\omega_c=2\pi f_c$,</p>
        $$2\pi f_c=\frac{1}{RC}\ \Rightarrow\ f_c=\frac{1}{2\pi RC}.$$
        <p><b>Result.</b> $$f_c=\frac{1}{2\pi RC}.$$ Sanity check: larger $R$ or $C$ lowers $f_c$, letting more low frequency through — a bigger coupling capacitor blocks less of the low band, exactly as expected.</p>`
      },
      {
        title: 'Rising skirt: +20 dB/decade below cutoff',
        tex: String.raw`$$|H|_{\text{dB}}\approx 20\log_{10}\!\left(\frac{f}{f_c}\right)\quad(f\ll f_c)$$`,
        derivation: String.raw`<p><b>Where we start.</b> We want the low-frequency (stopband) asymptote of the magnitude to prove the $+20$ dB/decade rising slope that characterises a first-order high-pass and its single pole/zero pair.</p>
        <p><b>Step 1 — the exact magnitude.</b> Again with $x=\omega/\omega_c=f/f_c$,</p>
        $$|H|=\frac{x}{\sqrt{1+x^2}}.$$
        <p><b>Step 2 — take the low-frequency limit.</b> For $f\ll f_c$ we have $x\ll1$, so $\sqrt{1+x^2}\approx1$ and the magnitude reduces to</p>
        $$|H|\approx x=\frac{f}{f_c}.$$
        <p>The magnitude is directly proportional to frequency in the stopband — the signature of the numerator zero at the origin.</p>
        <p><b>Step 3 — express in decibels.</b> Convert to dB:</p>
        $$|H|_{\text{dB}}=20\log_{10}\!\left(\frac{f}{f_c}\right).$$
        <p>Now evaluate the change over one decade: replace $f$ by $10f$. Then $20\log_{10}(10f/f_c)=20\log_{10}(f/f_c)+20\log_{10}(10)=|H|_{\text{dB}}+20$ dB. The gain rises by exactly $20$ dB per decade of frequency.</p>
        <p><b>Result.</b> Below cutoff the skirt rises at $+20$ dB/decade ($+6$ dB/octave). Above cutoff $x\gg1$ makes $|H|\to1$ (0 dB, flat). An $n$-th order high-pass simply multiplies the slope to $+20n$ dB/decade.</p>`
      },
      {
        title: 'High-pass phase response',
        tex: String.raw`$$\angle H(j\omega)=90^\circ-\arctan\!\left(\frac{\omega}{\omega_c}\right)$$`,
        derivation: String.raw`<p><b>Where we start.</b> Phase determines the delay/lead a filter imposes. We extract the phase of $H(j\omega)=\dfrac{j\omega/\omega_c}{1+j\omega/\omega_c}$ by treating numerator and denominator as complex numbers and subtracting their angles.</p>
        <p><b>Step 1 — angle of the numerator.</b> The numerator $j\omega/\omega_c$ is a purely imaginary positive quantity, so its angle is $+90^\circ$ (it points straight up in the complex plane).</p>
        <p><b>Step 2 — angle of the denominator.</b> The denominator $1+j\omega/\omega_c$ has real part $1$ and imaginary part $\omega/\omega_c$, so its angle is $\arctan(\omega/\omega_c)$.</p>
        <p><b>Step 3 — subtract (division subtracts angles).</b> For a ratio of complex numbers the phase is the numerator angle minus the denominator angle:</p>
        $$\angle H=90^\circ-\arctan\!\left(\frac{\omega}{\omega_c}\right).$$
        <p><b>Result / sanity check.</b> $$\angle H(j\omega)=90^\circ-\arctan\!\left(\frac{\omega}{\omega_c}\right).$$ At DC ($\omega\to0$): $\arctan(0)=0$, so $\angle H\to+90^\circ$ (maximum lead, differentiator-like). At $\omega=\omega_c$: $\arctan(1)=45^\circ$, so $\angle H=+45^\circ$. Deep in the passband ($\omega\to\infty$): $\arctan\to90^\circ$, so $\angle H\to0^\circ$. The phase is always positive (a lead), the exact mirror of the low-pass filter's lag.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does a high-pass filter do?`, back: String.raw`It passes frequencies above the cutoff $f_c$ and attenuates DC and low frequencies. Simplest form: a series capacitor with a shunt resistor (CR network).` },
      { front: String.raw`Write the first-order high-pass transfer function.`, back: String.raw`$H(j\omega)=\dfrac{j\omega}{\omega_c+j\omega}=\dfrac{j\omega/\omega_c}{1+j\omega/\omega_c}$, with a zero at the origin (kills DC) and a pole at $\omega_c$.` },
      { front: String.raw`What is the cutoff frequency of an RC high-pass?`, back: String.raw`$f_c=\dfrac{1}{2\pi RC}$, the $-3$ dB (half-power) point where the gain is $1/\sqrt2\approx0.707$ of passband.` },
      { front: String.raw`What is the slope of a first-order HPF below cutoff?`, back: String.raw`$+20$ dB/decade (equivalently $+6$ dB/octave); above cutoff the response is flat at 0 dB.` },
      { front: String.raw`Why does a series capacitor block DC?`, back: String.raw`At DC its impedance $1/(j\omega C)\to\infty$, so it is an open circuit and no DC passes — the output is zero at $f=0$.` },
      { front: String.raw`What is the HPF magnitude at exactly $f_c$?`, back: String.raw`$1/\sqrt2\approx0.707$, i.e. $-3$ dB, because at $f_c$ the resistive and reactive impedances are equal ($R=1/(\omega C)$).` },
      { front: String.raw`What is the phase of a first-order HPF?`, back: String.raw`$\angle H=90^\circ-\arctan(\omega/\omega_c)$: $+90^\circ$ at DC, $+45^\circ$ at $f_c$, $0^\circ$ in the passband — a phase lead.` },
      { front: String.raw`How is an HPF used as a coupling capacitor?`, back: String.raw`A series cap with $f_c$ set below the signal band blocks the DC offset/bias of the previous stage while passing the AC signal (AC coupling).` },
      { front: String.raw`How does the HPF relate to the LPF?`, back: String.raw`It is the mirror image (complement) about the same cutoff; the HPF skirt rises at $+20$ dB/dec where the LPF falls at $-20$ dB/dec, and they cross at $-3$ dB.` },
      { front: String.raw`What does a coupling cap's cutoff depend on?`, back: String.raw`On the actual load resistance it drives: $f_c=1/(2\pi R_{load}C)$. A low input impedance raises $f_c$ and can attenuate low-frequency signal.` },
      { front: String.raw`How do you get a steeper high-pass roll-off?`, back: String.raw`Cascade sections or use a second-order active design (Sallen–Key / multiple-feedback): an $n$-th order HPF gives $+20n$ dB/decade.` },
      { front: String.raw`Why does an active HPF beat a passive CR HPF?`, back: String.raw`The op-amp provides gain and a buffered, load-independent cutoff, and makes higher-order (steeper) responses like Butterworth/Chebyshev easy.` },
      { front: String.raw`What removes baseline drift from a signal?`, back: String.raw`A high-pass filter with $f_c$ above the drift rate: slow wander lies below cutoff and is attenuated, keeping the signal centred on zero.` }
    ],
    mcqs: [
      { q: String.raw`A first-order high-pass filter attenuates which components?`, options: [String.raw`High frequencies`, String.raw`DC and low frequencies`, String.raw`A single mid-band tone`, String.raw`Only the frequency at $f_c$`], answer: 1, explain: String.raw`An HPF passes frequencies above $f_c$ and attenuates DC and low frequencies; its series capacitor is an open at DC.` },
      { q: String.raw`The cutoff frequency of an RC high-pass filter is:`, options: [String.raw`$f_c=2\pi RC$`, String.raw`$f_c=\dfrac{1}{2\pi RC}$`, String.raw`$f_c=\dfrac{RC}{2\pi}$`, String.raw`$f_c=\dfrac{1}{RC}$`], answer: 1, explain: String.raw`$f_c=1/(2\pi RC)$; it is the $-3$ dB point where $R=1/(\omega C)$.` },
      { q: String.raw`At the cutoff frequency, the HPF magnitude is:`, options: [String.raw`0 dB (unity)`, String.raw`$-3$ dB ($\approx0.707$)`, String.raw`$-6$ dB`, String.raw`$-20$ dB`], answer: 1, explain: String.raw`By definition of cutoff, $|H(f_c)|=1/\sqrt2\approx0.707$, i.e. $-3$ dB (half power).` },
      { q: String.raw`Below cutoff, a first-order HPF magnitude rises at:`, options: [String.raw`$-20$ dB/decade`, String.raw`$+20$ dB/decade`, String.raw`$+40$ dB/decade`, String.raw`0 dB/decade (flat)`], answer: 1, explain: String.raw`A first-order (one-pole/one-zero) high-pass has a $+20$ dB/decade rising skirt below $f_c$, then flattens.` },
      { q: String.raw`Which numerator feature of $H(j\omega)$ makes an HPF block DC?`, options: [String.raw`A pole at $\omega_c$`, String.raw`A zero at the origin ($j\omega$)`, String.raw`A constant gain`, String.raw`A pole at the origin`], answer: 1, explain: String.raw`The zero at the origin ($H\propto j\omega$) forces $H\to0$ as $\omega\to0$, killing DC.` },
      { q: String.raw`A single series coupling capacitor between two stages acts as:`, options: [String.raw`A low-pass filter`, String.raw`A high-pass (DC-blocking) filter`, String.raw`A band-stop filter`, String.raw`An all-pass filter`], answer: 1, explain: String.raw`A series cap forms a high-pass with the load resistance, blocking DC/offset while passing the AC signal.` },
      { q: String.raw`The phase of a first-order HPF at DC approaches:`, options: [String.raw`$0^\circ$`, String.raw`$+90^\circ$`, String.raw`$-90^\circ$`, String.raw`$+45^\circ$`], answer: 1, explain: String.raw`$\angle H=90^\circ-\arctan(\omega/\omega_c)$; as $\omega\to0$ this tends to $+90^\circ$ (maximum lead).` },
      { q: String.raw`Compared with a low-pass filter of the same cutoff, an HPF phase:`, options: [String.raw`Lags (negative)`, String.raw`Leads (positive)`, String.raw`Is always zero`, String.raw`Is always $180^\circ$`], answer: 1, explain: String.raw`The HPF leads: $+90^\circ$ at DC down to $0^\circ$ in passband — the mirror of the LPF's lag.` },
      { q: String.raw`An RC high-pass has $R=10\ \text{k}\Omega$ and $C=15.9\ \text{nF}$. Its $f_c$ is about:`, options: [String.raw`100 Hz`, String.raw`1 kHz`, String.raw`10 kHz`, String.raw`16 kHz`], answer: 1, explain: String.raw`$f_c=1/(2\pi\cdot10^4\cdot15.9\times10^{-9})\approx1/(10^{-3})=1$ kHz.` },
      { q: String.raw`To make a high-pass roll-off steeper (sharper low-frequency rejection):`, options: [String.raw`Increase $R$ only`, String.raw`Use a higher-order (e.g. 2nd-order) filter`, String.raw`Increase $C$ only`, String.raw`Lower the supply voltage`], answer: 1, explain: String.raw`An $n$-th order HPF gives $+20n$ dB/decade; a second-order Sallen–Key gives $+40$ dB/decade.` },
      { q: String.raw`The cutoff of a coupling capacitor depends on:`, options: [String.raw`Only the capacitor value`, String.raw`The capacitor and the actual load resistance`, String.raw`Only the supply voltage`, String.raw`Neither R nor C`], answer: 1, explain: String.raw`$f_c=1/(2\pi R_{load}C)$; a low load impedance raises $f_c$ and can attenuate wanted low frequencies.` },
      { q: String.raw`A high-pass filter is best described as the complement of:`, options: [String.raw`A band-pass filter`, String.raw`A low-pass filter about the same $f_c$`, String.raw`A notch filter`, String.raw`An oscillator`], answer: 1, explain: String.raw`HPF and LPF are mirror images about a shared cutoff, crossing at $-3$ dB at $f_c$.` }
    ],
    numericals: [
      { q: String.raw`An RC high-pass filter uses $R=15.9\ \text{k}\Omega$ and $C=10\ \text{nF}$. Find the cutoff frequency $f_c$, the cutoff angular frequency $\omega_c$, and state the passband gain and the gain (in dB) exactly at $f_c$.`, solution: String.raw`<p><b>Formula.</b> For a first-order RC high-pass the cutoff is $f_c=\dfrac{1}{2\pi RC}$ and $\omega_c=2\pi f_c=1/(RC)$. The passband gain is unity (0 dB) and at cutoff the gain is $1/\sqrt2$, i.e. $-3$ dB.</p>
<p><b>Substitute.</b> $$f_c=\frac{1}{2\pi\,(15.9\times10^{3})(10\times10^{-9})},\qquad \omega_c=\frac{1}{(15.9\times10^{3})(10\times10^{-9})}.$$</p>
<p><b>Compute.</b> $RC=15.9\times10^{3}\times10\times10^{-9}=1.59\times10^{-4}$ s. Then $\omega_c=1/1.59\times10^{-4}=6.29\times10^{3}$ rad/s and $f_c=\omega_c/2\pi\approx1.00\times10^{3}=1.0$ kHz. Passband gain $=1$ (0 dB); at $f_c$ the gain is $1/\sqrt2\approx0.707$, i.e. $-3$ dB.</p>
<p><b>Explanation.</b> The $R$ and $C$ were chosen so $RC\approx159\ \mu$s, placing the knee at 1 kHz. Above 1 kHz the signal passes essentially unchanged; below it the response falls off at $-20$ dB/decade (equivalently rises at $+20$ dB/decade toward the knee). The $-3$ dB at $f_c$ is the universal half-power definition of cutoff.</p>` },
      { q: String.raw`For the same filter ($f_c=1\ \text{kHz}$), estimate the attenuation at a frequency one decade below cutoff, at $f=100\ \text{Hz}$, using the first-order asymptote. Give the linear gain and the value in dB.`, solution: String.raw`<p><b>Formula.</b> Well below cutoff the first-order high-pass magnitude follows the asymptote $|H|\approx f/f_c$, so in decibels $|H|_{\text{dB}}\approx20\log_{10}(f/f_c)$.</p>
<p><b>Substitute.</b> $$|H|\approx\frac{100\ \text{Hz}}{1000\ \text{Hz}},\qquad |H|_{\text{dB}}\approx20\log_{10}\!\left(\frac{100}{1000}\right).$$</p>
<p><b>Compute.</b> $|H|\approx0.1$ (a factor of ten down). In dB: $20\log_{10}(0.1)=20\times(-1)=-20$ dB. (The exact value with $\sqrt{1+x^2}$ is $0.0995$, i.e. $-20.04$ dB — negligibly different.)</p>
<p><b>Explanation.</b> One decade below cutoff the gain is down by exactly 20 dB, confirming the $+20$ dB/decade rising skirt of a first-order high-pass. A signal at 100 Hz emerges at one-tenth amplitude, so this filter substantially removes anything a decade below the knee while leaving the passband intact.</p>` },
      { q: String.raw`You need a DC-blocking coupling capacitor whose high-pass cutoff is $f_c=20\ \text{Hz}$ into a load of $R_{load}=10\ \text{k}\Omega$. Find the required capacitance $C$, then find the new $f_c$ if the load is actually $2\ \text{k}\Omega$.`, solution: String.raw`<p><b>Formula.</b> A coupling capacitor forms a high-pass with the load it drives, $f_c=\dfrac{1}{2\pi R_{load}C}$; solving for the capacitor gives $C=\dfrac{1}{2\pi R_{load} f_c}$.</p>
<p><b>Substitute.</b> $$C=\frac{1}{2\pi\,(10\times10^{3})(20)},\qquad f_{c,\text{new}}=\frac{1}{2\pi\,(2\times10^{3})\,C}.$$</p>
<p><b>Compute.</b> $C=\dfrac{1}{2\pi\times10^{4}\times20}=\dfrac{1}{1.2566\times10^{6}}\approx7.96\times10^{-7}$ F $\approx0.80\ \mu$F. With the same $C$ but $R_{load}=2\ \text{k}\Omega$: $f_{c,\text{new}}=\dfrac{1}{2\pi\times2000\times7.96\times10^{-7}}\approx100$ Hz.</p>
<p><b>Explanation.</b> A $0.8\ \mu$F cap gives a 20 Hz knee into 10 k$\Omega$, safely below the audio band. But because $f_c\propto 1/R_{load}$, dropping the load to 2 k$\Omega$ (one-fifth) raises the cutoff five-fold to 100 Hz — now inside the band, attenuating bass. This is the practical warning: always compute $f_c$ from the real load impedance.</p>` },
      { q: String.raw`For a first-order high-pass with $f_c=1\ \text{kHz}$, find the phase shift at $f=1\ \text{kHz}$, at $f=100\ \text{Hz}$, and at $f=10\ \text{kHz}$, and state the sign (lead or lag).`, solution: String.raw`<p><b>Formula.</b> The first-order high-pass phase is $\angle H=90^\circ-\arctan(f/f_c)$, always positive (a lead), decreasing from $+90^\circ$ at DC toward $0^\circ$ in the passband.</p>
<p><b>Substitute.</b> $$\angle H(1\text{k})=90^\circ-\arctan(1),\quad \angle H(100)=90^\circ-\arctan(0.1),\quad \angle H(10\text{k})=90^\circ-\arctan(10).$$</p>
<p><b>Compute.</b> At $f_c$: $\arctan(1)=45^\circ$, so $\angle H=+45^\circ$. At 100 Hz: $\arctan(0.1)=5.7^\circ$, so $\angle H=+84.3^\circ$. At 10 kHz: $\arctan(10)=84.3^\circ$, so $\angle H=+5.7^\circ$.</p>
<p><b>Explanation.</b> All three phases are positive — the high-pass always <i>leads</i>. Far below cutoff the lead approaches $+90^\circ$ (differentiator-like), it is $+45^\circ$ exactly at $f_c$, and it decays toward $0^\circ$ deep in the passband where the signal passes cleanly. This is the exact mirror of the low-pass filter's phase lag.</p>` },
      { q: String.raw`A CR high-pass has $R=4.7\ \text{k}\Omega$ and $C=100\ \text{nF}$. Find $f_c$, the magnitude at $f=f_c$, and the magnitude at $f=10 f_c$ (well into the passband).`, solution: String.raw`<p><b>Formula.</b> Cutoff $f_c=\dfrac{1}{2\pi RC}$; magnitude $|H|=\dfrac{x}{\sqrt{1+x^2}}$ with $x=f/f_c$. At $x=1$, $|H|=1/\sqrt2$; for large $x$, $|H|\to1$.</p>
<p><b>Substitute.</b> $$f_c=\frac{1}{2\pi\,(4.7\times10^{3})(100\times10^{-9})},\qquad |H|(x=1)=\frac{1}{\sqrt{1+1}},\qquad |H|(x=10)=\frac{10}{\sqrt{1+100}}.$$</p>
<p><b>Compute.</b> $RC=4.7\times10^{3}\times100\times10^{-9}=4.7\times10^{-4}$ s, so $f_c=1/(2\pi\times4.7\times10^{-4})\approx338.6$ Hz. At $f_c$: $|H|=1/\sqrt2\approx0.707$ ($-3$ dB). At $10f_c$: $|H|=10/\sqrt{101}\approx0.995$ (about $-0.04$ dB).</p>
<p><b>Explanation.</b> The knee lands near 339 Hz. One decade above it the gain is already 0.995, essentially unity — confirming the flat passband above cutoff. A high-pass therefore transmits high frequencies almost perfectly while progressively removing everything below the knee, exactly as a DC-block/coupling stage requires.</p>` }
    ],
    realWorld: String.raw`<p>High-pass filters are everywhere a signal must be separated from slow-moving junk. Every <a href="#mixer">audio</a> and RF stage uses a series <b>coupling capacitor</b> — a deliberate high-pass placed below the band — to block the DC bias of one stage from upsetting the next; get the cap too small and you roll off the bass. In biomedical instrumentation (ECG, EEG) a high-pass removes the huge slow <b>electrode-offset drift and baseline wander</b> so the tiny AC waveform can be amplified without saturating. Loudspeaker <b>crossovers</b> pair a high-pass (feeding the tweeter) with a <a href="#lpf">low-pass</a> (feeding the woofer) about a shared cutoff, splitting the spectrum. In sensor and control chains a high-pass performs <b>offset removal and AC coupling</b>; combined with a <a href="#lpf">low-pass</a> it forms a <a href="#bpf">band-pass</a>, and with a shared notch it becomes a <a href="#notch-filter">band-stop</a>. In the digital domain the same idea appears as high-pass <a href="#fir-filters">FIR</a>/<a href="#iir-filters">IIR</a> sections used for DC removal and detrending before <a href="#frequency-spectrum">spectral</a> analysis.</p>`,
    related: ['lpf', 'bpf', 'notch-filter', 'filters']
  }
);
