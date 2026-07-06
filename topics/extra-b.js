// Signals & Systems — FFT, FIR filters, IIR filters (exam-mastery study content)
CONTENT.topics.push(
{
  id: 'fft',
  title: 'Fast Fourier Transform (FFT)',
  category: 'Signals & Systems',
  tags: ['DFT', 'FFT', 'Cooley-Tukey', 'spectrum', 'butterfly', 'twiddle', 'windowing'],
  summary: String.raw`The FFT is a family of fast algorithms that compute the Discrete Fourier Transform in $O(N\log N)$ operations instead of the direct $O(N^2)$, by recursively splitting the sum into even- and odd-indexed subsequences.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 175" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-fft" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="60" width="86" height="50" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="51" y="82" fill="#e6edf3" text-anchor="middle">N samples</text><text x="51" y="97" fill="#9aa7b5" text-anchor="middle" font-size="10">x[n]</text>
<rect x="126" y="55" width="96" height="60" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="174" y="78" fill="#e6edf3" text-anchor="middle" font-size="11">split even/odd</text><text x="174" y="94" fill="#9aa7b5" text-anchor="middle" font-size="10">E[k], O[k]</text><text x="174" y="107" fill="#9aa7b5" text-anchor="middle" font-size="10">log₂N stages</text>
<rect x="254" y="55" width="110" height="60" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="309" y="78" fill="#e6edf3" text-anchor="middle" font-size="11">butterflies</text><text x="309" y="93" fill="#9aa7b5" text-anchor="middle" font-size="10">E ± Wₙᵏ·O</text><text x="309" y="106" fill="#ffa94d" text-anchor="middle" font-size="10">N/2 · log₂N</text>
<rect x="396" y="60" width="96" height="50" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="444" y="82" fill="#e6edf3" text-anchor="middle" font-size="11">N bins</text><text x="444" y="97" fill="#9aa7b5" text-anchor="middle" font-size="10">X[k]</text>
<text x="270" y="150" fill="#b197fc" text-anchor="middle" font-size="11">O(N log N) vs direct O(N²)</text>
<line x1="94" y1="85" x2="124" y2="85" stroke="#9aa7b5" marker-end="url(#arr-fft)"/>
<line x1="222" y1="85" x2="252" y2="85" stroke="#9aa7b5" marker-end="url(#arr-fft)"/>
<line x1="364" y1="85" x2="394" y2="85" stroke="#9aa7b5" marker-end="url(#arr-fft)"/>
</svg>`,
    caption: String.raw`FFT mechanism: $N$ samples are recursively split into even/odd subsequences and recombined by radix-2 butterflies ($E\pm W_N^k O$), yielding $N$ frequency bins in $O(N\log N)$.`,
  },
  {
    title: String.raw`8-point DIT: bit-reverse in → 3 butterfly stages → in-order out`,
    svg: String.raw`<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-fft" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="8" y="60" width="92" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="54" y="82" fill="#e6edf3" text-anchor="middle" font-size="11">bit-reverse</text><text x="54" y="98" fill="#9aa7b5" text-anchor="middle" font-size="10">x[0,4,2,6,</text><text x="54" y="110" fill="#9aa7b5" text-anchor="middle" font-size="10">1,5,3,7]</text>
<rect x="126" y="60" width="80" height="60" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="166" y="86" fill="#e6edf3" text-anchor="middle" font-size="11">stage 1</text><text x="166" y="102" fill="#9aa7b5" text-anchor="middle" font-size="10">2-pt DFTs</text>
<rect x="232" y="60" width="80" height="60" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="272" y="86" fill="#e6edf3" text-anchor="middle" font-size="11">stage 2</text><text x="272" y="102" fill="#9aa7b5" text-anchor="middle" font-size="10">4-pt combine</text>
<rect x="338" y="60" width="80" height="60" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="378" y="86" fill="#e6edf3" text-anchor="middle" font-size="11">stage 3</text><text x="378" y="102" fill="#9aa7b5" text-anchor="middle" font-size="10">8-pt combine</text>
<rect x="444" y="60" width="88" height="60" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="488" y="82" fill="#e6edf3" text-anchor="middle" font-size="11">X[0..7]</text><text x="488" y="98" fill="#9aa7b5" text-anchor="middle" font-size="10">natural</text><text x="488" y="110" fill="#9aa7b5" text-anchor="middle" font-size="10">order</text>
<text x="270" y="40" fill="#ffa94d" text-anchor="middle" font-size="11">log₂8 = 3 stages, N/2 = 4 butterflies each</text>
<line x1="100" y1="90" x2="124" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-fft)"/>
<line x1="206" y1="90" x2="230" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-fft)"/>
<line x1="312" y1="90" x2="336" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-fft)"/>
<line x1="418" y1="90" x2="442" y2="90" stroke="#9aa7b5" marker-end="url(#arr2-fft)"/>
<text x="270" y="150" fill="#b197fc" text-anchor="middle" font-size="10">each stage doubles the transform size until all 8 bins are combined</text>
</svg>`,
    caption: String.raw`Radix-2 DIT flow for $N=8$: reorder the input into bit-reversed order, then apply $\log_2 8=3$ butterfly stages (2-point, then 4-point, then 8-point combines) of $N/2=4$ butterflies each, producing the spectrum in natural order.`,
  },
  {
    title: String.raw`Real-time spectrum chain: window → FFT → |·|² → average → display`,
    svg: String.raw`<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-fft" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="6" y="45" width="86" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="49" y="64" fill="#e6edf3" text-anchor="middle" font-size="11">window</text><text x="49" y="79" fill="#9aa7b5" text-anchor="middle" font-size="10">w[n]·x[n]</text>
<rect x="112" y="45" width="70" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="147" y="70" fill="#e6edf3" text-anchor="middle" font-size="11">FFT</text>
<rect x="202" y="45" width="76" height="44" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="240" y="64" fill="#e6edf3" text-anchor="middle" font-size="11">|·|²</text><text x="240" y="79" fill="#9aa7b5" text-anchor="middle" font-size="10">power</text>
<rect x="298" y="45" width="96" height="44" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="346" y="64" fill="#e6edf3" text-anchor="middle" font-size="11">average</text><text x="346" y="79" fill="#9aa7b5" text-anchor="middle" font-size="10">Welch</text>
<rect x="414" y="45" width="118" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="473" y="64" fill="#e6edf3" text-anchor="middle" font-size="11">display</text><text x="473" y="79" fill="#9aa7b5" text-anchor="middle" font-size="10">PSD vs f</text>
<line x1="92" y1="67" x2="110" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-fft)"/>
<line x1="182" y1="67" x2="200" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-fft)"/>
<line x1="278" y1="67" x2="296" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-fft)"/>
<line x1="394" y1="67" x2="412" y2="67" stroke="#9aa7b5" marker-end="url(#arr3-fft)"/>
</svg>`,
    caption: String.raw`Real-time spectral estimation: each block is windowed to suppress leakage, FFT'd, converted to power $|X[k]|^2$, and averaged over overlapping segments (Welch's method) for a stable noise floor before display.`,
  }
  ],
  prerequisites: ['fourier-transform', 'convolution', 'nyquist-sampling', 'frequency-spectrum'],
  intro: String.raw`<p>The <b>Discrete Fourier Transform (DFT)</b> takes $N$ samples of a signal in time and produces $N$ complex numbers describing the amplitude and phase of $N$ evenly-spaced frequency bins. It is the workhorse of digital spectral analysis: every spectrum analyzer display, every OFDM modem, every audio equalizer, and every fast convolution engine rests on it.</p>
<p>The problem is that the DFT, computed straight from its definition, costs on the order of $N^2$ complex multiply-adds. For $N=1024$ that is about a million operations; for $N=10^6$ it is $10^{12}$ — hopelessly slow in real time. The <b>Fast Fourier Transform (FFT)</b> is not a different transform; it computes <i>exactly</i> the same DFT, but exploits deep symmetry in the twiddle factors to reduce the cost to $O(N\log N)$. For $N=1024$ that is roughly $10^4$ operations — a hundredfold speed-up, and the gap widens without bound as $N$ grows. This single algorithmic insight, popularized by Cooley and Tukey in 1965, is arguably the most important numerical algorithm of the 20th century.</p>`,
  sections: [
    { h: 'The DFT definition', html: String.raw`<p>For a length-$N$ complex sequence $x[n]$, the DFT is</p>
$$ X[k] = \sum_{n=0}^{N-1} x[n]\,e^{-j 2\pi k n / N}, \qquad k=0,1,\dots,N-1. $$
<p>Each output $X[k]$ is the correlation of the input with a complex sinusoid at frequency bin $k$. The inverse DFT (IDFT) recovers the samples:</p>
$$ x[n] = \frac{1}{N}\sum_{k=0}^{N-1} X[k]\,e^{+j 2\pi k n / N}. $$
<p>The two differ only by the sign of the exponent and a $1/N$ scale, so <b>any FFT algorithm also computes the inverse</b> with trivial modification. Bin $k$ corresponds to the physical frequency $f_k = k\,f_s/N$, where $f_s$ is the sample rate; the spacing between bins is the <b>frequency resolution</b> $\Delta f = f_s/N = 1/(N T_s) = 1/T_{\text{record}}$.</p>
<div class="callout"><b>Key fact:</b> resolution is set by the <i>total record length in seconds</i>, not by the sample rate. To resolve two tones 1 Hz apart you need at least 1 second of data, regardless of how fast you sample.</div>` },
    { h: 'Twiddle factors and their symmetries', html: String.raw`<p>Define the primitive $N$-th root of unity, the <b>twiddle factor</b>:</p>
$$ W_N = e^{-j 2\pi / N}, \qquad X[k]=\sum_{n=0}^{N-1} x[n]\,W_N^{kn}. $$
<p>The whole FFT lives or dies on three properties of $W_N$:</p>
<ul>
<li><b>Periodicity:</b> $W_N^{k+N}=W_N^{k}$ — the exponents wrap around modulo $N$.</li>
<li><b>Symmetry:</b> $W_N^{k+N/2}=-W_N^{k}$ — halfway around the circle flips the sign.</li>
<li><b>Halving:</b> $W_N^{2}=W_{N/2}$ — squaring a root of unity gives a root of unity of half the order.</li>
</ul>
<p>The halving identity is the crucial one: it lets a length-$N$ DFT be written in terms of two length-$N/2$ DFTs that use the <i>same</i> smaller twiddle table. The sign-flip symmetry lets each pair of outputs share one multiplication. Together they collapse redundant arithmetic.</p>` },
    { h: 'Why the direct DFT is O(N²)', html: String.raw`<p>Look at the sum for a single $X[k]$: it has $N$ terms, each a complex multiply $x[n]\cdot W_N^{kn}$ followed by an accumulate. That is $N$ complex multiplications per output. There are $N$ outputs, so the direct DFT needs $N^2$ complex multiplications and $N(N-1)$ complex additions.</p>
<table class="data">
<tr><th>$N$</th><th>Direct DFT ($N^2$)</th><th>Radix-2 FFT ($\tfrac{N}{2}\log_2 N$)</th><th>Speed-up</th></tr>
<tr><td>64</td><td>4,096</td><td>192</td><td>21×</td></tr>
<tr><td>1,024</td><td>1,048,576</td><td>5,120</td><td>205×</td></tr>
<tr><td>65,536</td><td>4.3×10⁹</td><td>524,288</td><td>8,192×</td></tr>
<tr><td>1,048,576</td><td>1.1×10¹²</td><td>10,485,760</td><td>10⁵×</td></tr>
</table>
<p>The direct cost grows quadratically while the FFT grows almost linearly, so the ratio $N/\log_2 N$ diverges. This is why real-time DSP on megasample transforms is only possible with an FFT.</p>` },
    { h: 'Radix-2 Cooley–Tukey: divide and conquer', html: String.raw`<p>Assume $N$ is a power of two. Split the DFT sum into <b>even-indexed</b> and <b>odd-indexed</b> input samples:</p>
$$ X[k]=\underbrace{\sum_{m=0}^{N/2-1} x[2m]\,W_N^{2mk}}_{\text{evens}} + \underbrace{\sum_{m=0}^{N/2-1} x[2m+1]\,W_N^{(2m+1)k}}_{\text{odds}}. $$
<p>Using $W_N^{2}=W_{N/2}$ and factoring $W_N^{k}$ out of the odd sum:</p>
$$ X[k]=E[k]+W_N^{k}\,O[k], $$
<p>where $E[k]$ is the length-$N/2$ DFT of the even samples and $O[k]$ is the length-$N/2$ DFT of the odd samples. By the symmetry $W_N^{k+N/2}=-W_N^{k}$, the upper half of the spectrum comes for free:</p>
$$ X[k+\tfrac{N}{2}]=E[k]-W_N^{k}\,O[k], \qquad k=0,\dots,\tfrac{N}{2}-1. $$
<p>So one length-$N$ transform becomes two length-$N/2$ transforms plus $N/2$ twiddle multiplications and $N$ additions. Recurse: each half splits into quarters, and so on for $\log_2 N$ stages. This is <b>decimation in time (DIT)</b> — we split by the time index. The dual, splitting the <i>output</i> index, gives <b>decimation in frequency (DIF)</b>.</p>` },
    { h: 'The butterfly', html: String.raw`<p>The atomic operation combining $E[k]$ and $O[k]$ is the <b>butterfly</b>, so named for the crossing lines in its signal-flow graph:</p>
$$ \begin{aligned} X[k] &= E[k] + W_N^{k}\,O[k] \\ X[k+\tfrac{N}{2}] &= E[k] - W_N^{k}\,O[k]. \end{aligned} $$
<p>Each butterfly costs exactly <b>one complex multiply and two complex adds</b> (multiply $O[k]$ by the twiddle once, then add and subtract). A full FFT has $\log_2 N$ stages, and each stage contains $N/2$ butterflies, giving</p>
$$ \tfrac{N}{2}\log_2 N \text{ complex multiplies}, \qquad N\log_2 N \text{ complex adds}. $$
<div class="callout"><b>In-place computation:</b> a butterfly reads two array locations and writes back to those same two locations. So the entire FFT can run <i>in place</i>, overwriting the input array with the output — no extra memory beyond a twiddle table. This is why the FFT is so hardware-friendly.</div>` },
    { h: 'Bit-reversal', html: String.raw`<p>Repeatedly separating evens from odds permutes the input order. After $\log_2 N$ splits, sample $x[n]$ ends up at the index whose binary digits are the <b>reverse</b> of $n$'s. For $N=8$: index $1=001_2$ swaps with $4=100_2$; index $3=011_2$ swaps with $6=110_2$; indices $0,2,5,7$ (palindromes) stay put.</p>
<table class="data">
<tr><th>$n$</th><th>binary</th><th>reversed</th><th>goes to</th></tr>
<tr><td>0</td><td>000</td><td>000</td><td>0</td></tr>
<tr><td>1</td><td>001</td><td>100</td><td>4</td></tr>
<tr><td>2</td><td>010</td><td>010</td><td>2</td></tr>
<tr><td>3</td><td>011</td><td>110</td><td>6</td></tr>
<tr><td>4</td><td>100</td><td>001</td><td>1</td></tr>
</table>
<p>A DIT FFT takes <b>bit-reversed input</b> and produces <b>natural-order output</b>; a DIF FFT does the reverse. The reordering is a cheap $O(N)$ index permutation done once, before or after the butterflies.</p>` },
    { h: 'Spectral leakage and windowing', html: String.raw`<p>The DFT implicitly assumes the $N$-sample record repeats forever. If a tone does not complete an integer number of cycles in the window, the periodic extension has a discontinuity at the seam. That discontinuity smears the tone's energy across many bins — <b>spectral leakage</b> — and can bury a weak nearby signal under the skirts of a strong one.</p>
<p>The cure is a <b>window</b>: multiply the record by a taper $w[n]$ that goes smoothly to zero at both ends, removing the discontinuity. This trades a wider main lobe (worse resolution) for lower side lobes (less leakage).</p>
<table class="data">
<tr><th>Window</th><th>Main-lobe width</th><th>Peak side lobe</th><th>Use</th></tr>
<tr><td>Rectangular (none)</td><td>narrowest</td><td>−13 dB</td><td>max resolution, equal-amplitude tones</td></tr>
<tr><td>Hann</td><td>2×</td><td>−31 dB</td><td>general purpose</td></tr>
<tr><td>Hamming</td><td>2×</td><td>−43 dB</td><td>close tones</td></tr>
<tr><td>Blackman</td><td>3×</td><td>−58 dB</td><td>large dynamic range</td></tr>
</table>
<div class="callout"><b>Scalloping loss:</b> a tone falling between two bins is attenuated by up to 3.9 dB (rectangular). <b>Zero-padding</b> the record before the FFT interpolates the spectrum to more bins — it makes the display smoother but does <i>not</i> improve true resolution, which is still set by the record length.</div>` },
    { h: 'Fast convolution and practical use', html: String.raw`<p>Because convolution in time is multiplication in frequency, filtering a long signal with a filter of $M$ taps is often faster via the FFT: transform, multiply, inverse-transform. Using <b>overlap-add</b> or <b>overlap-save</b> block methods, the cost drops from $O(NM)$ direct to $O(N\log M)$ — a huge win when $M$ is large. The FFT also underpins <b>OFDM</b> (each symbol is an IFFT of the subcarrier data), <b>power spectral density</b> estimation (Welch's method averages FFTs of overlapping windowed segments), correlation/matched filtering, and image processing.</p>` },
    { h: 'What you should now understand', html: String.raw`<div class="callout tip"><p>Stepping back, the FFT story reduces to a few durable ideas:</p>
<ul>
<li><b>The FFT is not a new transform</b> — it computes the exact same DFT, just in $O(N\log N)$ instead of $O(N^2)$ by exploiting twiddle-factor symmetry.</li>
<li><b>Divide and conquer:</b> split into even/odd samples, combine two half-length DFTs with $X[k]=E[k]+W_N^k O[k]$; the sign flip $W_N^{k+N/2}=-W_N^k$ gives the upper half for free.</li>
<li><b>The butterfly is the atom</b> — one complex multiply, two adds — with $N/2$ per stage across $\log_2 N$ stages, and the whole thing runs in place.</li>
<li><b>Bit-reversal</b> reorders the data once; frequency resolution $\Delta f=1/T_{\text{record}}$ depends on record length, and zero-padding only interpolates the display.</li>
<li><b>Non-integer cycles cause leakage;</b> windows (Hann, Hamming, Blackman) trade a wider main lobe for lower side lobes.</li>
<li><b>Why it matters:</b> every spectrum display, OFDM modem, and fast-convolution filter in modern comms rests on this single algorithm.</li>
</ul></div>` },
    {
      h: String.raw`Further reading`,
      html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Fast_Fourier_transform" target="_blank" rel="noopener">Wikipedia — Fast Fourier transform</a> — the canonical survey of FFT algorithms, complexity, Cooley–Tukey and mixed-radix variants, and applications.</li>
<li><a href="https://www.dspguide.com/ch12.htm" target="_blank" rel="noopener">DSP Guide (Steven Smith) — Ch. 12: The Fast Fourier Transform</a> — an intuitive, code-level walkthrough of how the FFT actually works, with speed and precision comparisons.</li>
<li><a href="https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/resources/lecture-3-divide-conquer-fft/" target="_blank" rel="noopener">MIT OCW 6.046J — Lecture 3: Divide &amp; Conquer, FFT</a> — Demaine's rigorous derivation of the FFT as a divide-and-conquer algorithm, with video, notes, and transcript.</li>
<li><a href="https://www.mathworks.com/help/matlab/ref/fft.html" target="_blank" rel="noopener">MathWorks — fft function reference</a> — practical usage, zero-padding, windowing and worked spectral-analysis examples backed by the FFTW library.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`The FFT computes the <i>exact same</i> DFT as the direct sum — it is an efficient algorithm, not an approximation.`,
    String.raw`Direct DFT: $N^2$ complex multiplies. Radix-2 FFT: $\tfrac{N}{2}\log_2 N$ multiplies and $N\log_2 N$ adds.`,
    String.raw`Divide-and-conquer: split into even/odd samples, combine two half-length DFTs with $X[k]=E[k]+W_N^k O[k]$.`,
    String.raw`The sign-flip symmetry $W_N^{k+N/2}=-W_N^k$ gives the upper half of the spectrum for free: $X[k+N/2]=E[k]-W_N^k O[k]$.`,
    String.raw`One butterfly = one complex multiply + two complex adds; $N/2$ butterflies per stage, $\log_2 N$ stages.`,
    String.raw`FFTs run <b>in place</b>; only input/output ordering is bit-reversed (natural on the other end).`,
    String.raw`Frequency resolution $\Delta f = f_s/N = 1/T_{\text{record}}$ depends on record length, not sample rate.`,
    String.raw`Zero-padding interpolates the displayed spectrum but does not improve real resolution.`,
    String.raw`Non-integer cycles cause spectral leakage; windows (Hann, Hamming, Blackman) suppress side lobes at the cost of a wider main lobe.`,
    String.raw`Fast convolution (FFT–multiply–IFFT with overlap-add/save) beats direct convolution for long filters.`,
    String.raw`The IFFT is the same algorithm with a conjugated twiddle and a $1/N$ scale.`,
    String.raw`Radix-2 needs $N=2^p$; mixed-radix and Bluestein/chirp-z handle arbitrary $N$.`
  ],
  equations: [
    { title: 'DFT and IDFT', tex: String.raw`$$ X[k]=\sum_{n=0}^{N-1}x[n]W_N^{kn}, \quad x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]W_N^{-kn} $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want to represent $N$ time samples $x[n]$ as a sum of $N$ complex sinusoids whose frequencies are exact multiples of $f_s/N$, so that the representation is periodic with period $N$ and reversible.</p>
<p><b>Step 1 — choose the basis.</b> The natural periodic building blocks are the complex exponentials $\phi_k[n]=e^{+j2\pi kn/N}$ for $k=0,\dots,N-1$. There are exactly $N$ of them, matching the $N$ unknowns.</p>
<p><b>Step 2 — test orthogonality.</b> Two of these sinusoids, summed over one period, satisfy</p>
$$ \sum_{n=0}^{N-1} e^{j2\pi(k-l)n/N}=\begin{cases}N,& k\equiv l \pmod N\\ 0,&\text{otherwise.}\end{cases} $$
<p>This is a geometric series: if $k=l$ every term is 1 (sum $N$); otherwise the common ratio is an $N$-th root of unity other than 1, so the series sums to $(r^N-1)/(r-1)=0$ because $r^N=1$. The basis is orthogonal.</p>
<p><b>Step 3 — project.</b> To find how much of $\phi_k$ is in $x$, correlate $x[n]$ with $\overline{\phi_k[n]}=e^{-j2\pi kn/N}=W_N^{kn}$:</p>
$$ X[k]=\sum_{n=0}^{N-1}x[n]W_N^{kn}. $$
<p><b>Step 4 — reconstruct.</b> Write $x[n]=\frac1N\sum_k X[k]e^{+j2\pi kn/N}$ and substitute the definition of $X[k]$; orthogonality collapses the double sum to just the matching term, recovering $x[n]$ exactly. The $1/N$ normalizes the "$N$" from orthogonality.</p>
<p><b>Result.</b> $$ X[k]=\sum_n x[n]W_N^{kn}, \qquad x[n]=\tfrac1N\sum_k X[k]W_N^{-kn}. $$ Analysis and synthesis differ only by the sign of the exponent and the $1/N$ — which is why one program computes both.</p>` },
    { title: 'Cooley–Tukey decomposition', tex: String.raw`$$ X[k]=E[k]+W_N^k\,O[k], \quad X[k+\tfrac N2]=E[k]-W_N^k\,O[k] $$`,
      derivation: String.raw`<p><b>Where we start.</b> The DFT sum with $N$ even. We split the index $n$ into even $n=2m$ and odd $n=2m+1$ parts.</p>
<p><b>Step 1 — split the sum.</b></p>
$$ X[k]=\sum_{m=0}^{N/2-1}x[2m]W_N^{2mk}+\sum_{m=0}^{N/2-1}x[2m+1]W_N^{(2m+1)k}. $$
<p>The evens and odds are now two separate sums of length $N/2$.</p>
<p><b>Step 2 — use the halving identity.</b> Since $W_N^{2}=e^{-j2\pi\cdot2/N}=e^{-j2\pi/(N/2)}=W_{N/2}$, replace $W_N^{2mk}$ with $W_{N/2}^{mk}$:</p>
$$ X[k]=\underbrace{\sum_m x[2m]W_{N/2}^{mk}}_{E[k]}+W_N^{k}\underbrace{\sum_m x[2m+1]W_{N/2}^{mk}}_{O[k]}. $$
<p>$E[k]$ and $O[k]$ are themselves $N/2$-point DFTs. We factored one $W_N^{k}$ out of the odd sum.</p>
<p><b>Step 3 — exploit symmetry for the upper half.</b> $E$ and $O$ are periodic with period $N/2$, so $E[k+N/2]=E[k]$ and $O[k+N/2]=O[k]$. The twiddle, however, flips sign: $W_N^{k+N/2}=W_N^{k}W_N^{N/2}=W_N^{k}e^{-j\pi}=-W_N^{k}$. Therefore</p>
$$ X[k+\tfrac N2]=E[k]-W_N^{k}O[k]. $$
<p><b>Result.</b> $$ X[k]=E[k]+W_N^kO[k], \quad X[k+\tfrac N2]=E[k]-W_N^kO[k]. $$ One $N$-point DFT is now two $N/2$-point DFTs plus $N/2$ twiddle multiplies. Recursing gives the FFT.</p>` },
    { title: 'Operation count', tex: String.raw`$$ C_{\text{mult}}(N)=\tfrac{N}{2}\log_2 N,\qquad C_{\text{add}}(N)=N\log_2 N $$`,
      derivation: String.raw`<p><b>Where we start.</b> Let $C(N)$ be the number of complex multiplies to FFT a length-$N$ sequence, $N=2^p$.</p>
<p><b>Step 1 — write the recurrence.</b> Computing $X$ requires two half-size FFTs plus one twiddle multiply per butterfly, and there are $N/2$ butterflies:</p>
$$ C(N)=2\,C\!\left(\tfrac N2\right)+\tfrac N2, \qquad C(1)=0. $$
<p><b>Step 2 — unroll.</b> Each level down doubles the number of subproblems and halves their size, contributing $N/2$ multiplies at every one of the $\log_2 N$ levels:</p>
$$ C(N)=\underbrace{\tfrac N2+\tfrac N2+\cdots+\tfrac N2}_{\log_2 N \text{ terms}}=\tfrac N2\log_2 N. $$
<p><b>Step 3 — additions.</b> Each butterfly does two complex adds, and there are $\tfrac N2\log_2N$ butterflies, so $C_{\text{add}}=N\log_2 N$.</p>
<p><b>Result.</b> $$ C_{\text{mult}}=\tfrac N2\log_2 N. $$ Compared with the direct $N^2$, the ratio is $2N/\log_2 N$, which grows without bound — the defining advantage of the FFT.</p>` },
    { title: 'Twiddle symmetry', tex: String.raw`$$ W_N^{k+N/2}=-\,W_N^{k} $$`,
      derivation: String.raw`<p><b>Where we start.</b> $W_N=e^{-j2\pi/N}$, a point on the unit circle.</p>
<p><b>Step 1 — separate the exponent.</b> $$ W_N^{k+N/2}=W_N^{k}\cdot W_N^{N/2}. $$</p>
<p><b>Step 2 — evaluate the half-turn.</b> $$ W_N^{N/2}=e^{-j2\pi(N/2)/N}=e^{-j\pi}=\cos\pi-j\sin\pi=-1. $$ Advancing the exponent by $N/2$ is a half rotation around the circle, which lands on $-1$.</p>
<p><b>Result.</b> $$ W_N^{k+N/2}=-W_N^{k}. $$ This single sign flip is what lets the butterfly produce two outputs from one multiplication, halving the arithmetic at every stage.</p>` },
    { title: 'Frequency resolution', tex: String.raw`$$ \Delta f=\frac{f_s}{N}=\frac{1}{N T_s}=\frac{1}{T_{\text{record}}} $$`,
      derivation: String.raw`<p><b>Where we start.</b> Bin $k$ of an $N$-point DFT of data sampled at $f_s$ corresponds to a sinusoid completing exactly $k$ cycles over the record.</p>
<p><b>Step 1 — map bin to frequency.</b> The $k$-th basis sinusoid is $e^{j2\pi kn/N}$; over $n=0\dots N-1$ (a duration $NT_s$) it completes $k$ cycles, so its frequency is $f_k=k/(NT_s)=k\,f_s/N$.</p>
<p><b>Step 2 — take the spacing.</b> Adjacent bins differ by one in $k$: $$ \Delta f=f_{k+1}-f_k=\frac{f_s}{N}. $$</p>
<p><b>Step 3 — express via record length.</b> Since $NT_s=T_{\text{record}}$ (the total observation time) and $f_s=1/T_s$: $$ \Delta f=\frac{1}{NT_s}=\frac{1}{T_{\text{record}}}. $$</p>
<p><b>Result.</b> $$ \Delta f=\frac{1}{T_{\text{record}}}. $$ To resolve two tones $\Delta f$ apart you must observe for at least $1/\Delta f$ seconds — a time–frequency uncertainty. Sampling faster raises the analysis bandwidth but does not sharpen resolution.</p>` },
    { title: 'Parseval / power conservation', tex: String.raw`$$ \sum_{n=0}^{N-1}|x[n]|^2=\frac{1}{N}\sum_{k=0}^{N-1}|X[k]|^2 $$`,
      derivation: String.raw`<p><b>Where we start.</b> Total energy computed two ways — from samples and from spectrum — must agree.</p>
<p><b>Step 1 — write energy and substitute the IDFT for one factor.</b></p>
$$ \sum_n |x[n]|^2=\sum_n x[n]\overline{x[n]}=\sum_n x[n]\cdot\frac1N\sum_k \overline{X[k]}\,W_N^{kn}. $$
<p><b>Step 2 — swap the order of summation.</b> $$ =\frac1N\sum_k \overline{X[k]}\sum_n x[n]W_N^{kn}=\frac1N\sum_k \overline{X[k]}\,X[k]. $$ The inner sum is exactly $X[k]$ by the DFT definition.</p>
<p><b>Result.</b> $$ \sum_n|x[n]|^2=\frac1N\sum_k|X[k]|^2. $$ Energy is conserved between domains; the $1/N$ is the DFT's asymmetric normalization. This is why a windowed FFT needs a correction factor to read true power.</p>` }
  ],
  flashcards: [
    { front: String.raw`What does the FFT actually compute?`, back: String.raw`The exact same DFT as the direct definition — it is a fast algorithm, not an approximation or a different transform.` },
    { front: String.raw`Complexity of direct DFT vs FFT?`, back: String.raw`Direct DFT: $O(N^2)$ ($N^2$ complex multiplies). FFT: $O(N\log N)$ ($\tfrac N2\log_2 N$ multiplies).` },
    { front: String.raw`State the twiddle factor.`, back: String.raw`$W_N=e^{-j2\pi/N}$, the primitive $N$-th root of unity; $X[k]=\sum_n x[n]W_N^{kn}$.` },
    { front: String.raw`What symmetry makes the FFT possible?`, back: String.raw`$W_N^{k+N/2}=-W_N^k$ (sign flip) and $W_N^2=W_{N/2}$ (halving), letting a butterfly give two outputs from one multiply.` },
    { front: String.raw`Write the DIT butterfly equations.`, back: String.raw`$X[k]=E[k]+W_N^k O[k]$ and $X[k+N/2]=E[k]-W_N^k O[k]$.` },
    { front: String.raw`Cost of one butterfly?`, back: String.raw`One complex multiply and two complex adds.` },
    { front: String.raw`Why can the FFT run in place?`, back: String.raw`Each butterfly reads and writes back to the same two array positions, so the output overwrites the input — no extra buffer needed.` },
    { front: String.raw`What is bit-reversal?`, back: String.raw`The input permutation from repeated even/odd splitting: sample $n$ moves to the index with $n$'s binary digits reversed. DIT takes bit-reversed in, natural out.` },
    { front: String.raw`What sets FFT frequency resolution?`, back: String.raw`$\Delta f=f_s/N=1/T_{\text{record}}$ — the total record length in seconds, not the sample rate.` },
    { front: String.raw`Does zero-padding improve resolution?`, back: String.raw`No. It interpolates the displayed spectrum (smoother curve) but true resolution is still $1/T_{\text{record}}$.` },
    { front: String.raw`What causes spectral leakage?`, back: String.raw`A tone with a non-integer number of cycles in the window creates a discontinuity in the periodic extension, smearing energy across bins.` },
    { front: String.raw`Windowing trade-off?`, back: String.raw`Tapering (Hann/Hamming/Blackman) lowers side lobes (less leakage, bigger dynamic range) at the cost of a wider main lobe (worse resolution).` },
    { front: String.raw`How does the FFT give the inverse?`, back: String.raw`Conjugate the twiddle factors (flip the exponent sign) and scale by $1/N$; the same butterfly structure applies.` },
    { front: String.raw`What if $N$ is not a power of two?`, back: String.raw`Use mixed-radix FFTs, or the Bluestein/chirp-z algorithm, which handle arbitrary $N$ in $O(N\log N)$.` },
    { front: String.raw`Why is the FFT central to OFDM?`, back: String.raw`Each OFDM symbol is formed by an IFFT of the subcarrier data and demodulated by an FFT at the receiver.` }
  ],
  mcqs: [
    { q: String.raw`The FFT reduces the DFT cost from $O(N^2)$ to:`, options: [String.raw`$O(N)$`, String.raw`$O(N\log N)$`, String.raw`$O(\log N)$`, String.raw`$O(N^{1.5})$`], answer: 1, explain: String.raw`Radix-2 needs $\tfrac N2\log_2 N$ multiplies, i.e. $O(N\log N)$.` },
    { q: String.raw`How many complex multiplies does the direct DFT of length $N$ require?`, options: [String.raw`$N$`, String.raw`$N\log_2 N$`, String.raw`$N^2$`, String.raw`$2N$`], answer: 2, explain: String.raw`Each of the $N$ outputs sums $N$ terms, each a multiply, giving $N^2$.` },
    { q: String.raw`The twiddle factor $W_N$ equals:`, options: [String.raw`$e^{+j2\pi/N}$`, String.raw`$e^{-j2\pi/N}$`, String.raw`$e^{-j\pi N}$`, String.raw`$1/N$`], answer: 1, explain: String.raw`$W_N=e^{-j2\pi/N}$, the primitive $N$-th root of unity in the DFT kernel.` },
    { q: String.raw`Which identity gives the upper half of the spectrum for free in a DIT FFT?`, options: [String.raw`$W_N^2=W_{N/2}$`, String.raw`$W_N^{k+N/2}=-W_N^k$`, String.raw`$W_N^N=1$`, String.raw`$W_N^0=1$`], answer: 1, explain: String.raw`The sign-flip symmetry makes $X[k+N/2]=E[k]-W_N^k O[k]$.` },
    { q: String.raw`A single radix-2 butterfly costs:`, options: [String.raw`2 multiplies, 1 add`, String.raw`1 multiply, 2 adds`, String.raw`4 multiplies, 4 adds`, String.raw`1 multiply, 1 add`], answer: 1, explain: String.raw`Multiply $O[k]$ by the twiddle once, then add and subtract from $E[k]$.` },
    { q: String.raw`A DIT FFT expects its input in what order?`, options: [String.raw`Natural order`, String.raw`Bit-reversed order`, String.raw`Reverse order`, String.raw`Random order`], answer: 1, explain: String.raw`Decimation in time consumes bit-reversed input and produces natural-order output.` },
    { q: String.raw`FFT frequency resolution $\Delta f$ is set by:`, options: [String.raw`The sample rate only`, String.raw`The record length $1/T_{\text{record}}$`, String.raw`The word length`, String.raw`The window shape`], answer: 1, explain: String.raw`$\Delta f=f_s/N=1/T_{\text{record}}$ — total observation time governs resolution.` },
    { q: String.raw`Zero-padding a record before the FFT:`, options: [String.raw`Improves true resolution`, String.raw`Adds noise`, String.raw`Interpolates the spectrum but does not improve true resolution`, String.raw`Removes leakage`], answer: 2, explain: String.raw`It only smooths the displayed spectrum; resolution still equals $1/T_{\text{record}}$.` },
    { q: String.raw`Spectral leakage occurs when:`, options: [String.raw`The signal is band-limited`, String.raw`A tone has a non-integer number of cycles in the window`, String.raw`$N$ is a power of two`, String.raw`The DC term is zero`], answer: 1, explain: String.raw`Non-integer cycles create a seam discontinuity that smears energy across bins.` },
    { q: String.raw`Compared with a rectangular window, a Blackman window has:`, options: [String.raw`Narrower main lobe, higher side lobes`, String.raw`Wider main lobe, lower side lobes`, String.raw`Identical response`, String.raw`No main lobe`], answer: 1, explain: String.raw`Windows trade a wider main lobe (worse resolution) for much lower side lobes (~−58 dB).` },
    { q: String.raw`The IFFT is obtained from the FFT by:`, options: [String.raw`Reversing the input`, String.raw`Conjugating the twiddles and scaling by $1/N$`, String.raw`Doubling $N$`, String.raw`Nothing changes`], answer: 1, explain: String.raw`Flip the exponent sign (conjugate $W_N$) and normalize by $1/N$.` },
    { q: String.raw`For $N=1024$, the FFT is roughly how many times faster than the direct DFT?`, options: [String.raw`~2×`, String.raw`~10×`, String.raw`~200×`, String.raw`~1×`], answer: 2, explain: String.raw`$N^2/(\tfrac N2\log_2N)=2N/\log_2N=2048/10\approx205$.` },
    { q: String.raw`Fast convolution via the FFT uses:`, options: [String.raw`Only forward FFTs`, String.raw`FFT, pointwise multiply, IFFT (overlap-add/save)`, String.raw`Bit-reversal alone`, String.raw`Windowing alone`], answer: 1, explain: String.raw`Time convolution = frequency multiplication, done block-wise with overlap-add or overlap-save.` },
    { q: String.raw`Which is required for a strict radix-2 FFT?`, options: [String.raw`$N$ prime`, String.raw`$N=2^p$`, String.raw`$N$ odd`, String.raw`$N$ a multiple of 3`], answer: 1, explain: String.raw`Radix-2 divides by two at each stage, so $N$ must be a power of two.` },
    { q: String.raw`Scalloping loss refers to:`, options: [String.raw`Loss from a tone falling between bins`, String.raw`Quantization noise`, String.raw`ADC clipping`, String.raw`Filter roll-off`], answer: 0, explain: String.raw`A tone between bin centers is attenuated (up to ~3.9 dB for rectangular) because no bin sits exactly on it.` }
  ],
  numericals: [
    { q: String.raw`A 4096-point radix-2 FFT: how many complex multiplies, and how many for the direct DFT?`, solution: String.raw`<p><b>Formula.</b> $$ C_{\text{FFT}}=\tfrac{N}{2}\log_2 N,\qquad C_{\text{DFT}}=N^2 $$ where $N$ is the transform length and $C$ is the number of complex multiplies.</p>
<p><b>Substitute.</b> $$ C_{\text{FFT}}=\frac{4096}{2}\times\log_2 4096=2048\times12,\qquad C_{\text{DFT}}=4096^2. $$</p>
<p><b>Compute.</b> $C_{\text{FFT}}=24{,}576$ and $C_{\text{DFT}}=16{,}777{,}216$, so the speed-up is $16{,}777{,}216/24{,}576\approx 683\times$.</p>
<p><b>Explanation.</b> The FFT does the identical transform with about 683 times less arithmetic. Sanity check: the ratio should be $2N/\log_2 N=8192/12\approx683$ — it matches.</p>` },
    { q: String.raw`Sampling at $f_s=48$ kHz with $N=8192$, find the bin spacing and the frequency of bin 100.`, solution: String.raw`<p><b>Formula.</b> $$ \Delta f=\frac{f_s}{N},\qquad f_k=k\,\Delta f $$ where $\Delta f$ is the bin spacing, $f_s$ the sample rate, $N$ the FFT length and $k$ the bin index.</p>
<p><b>Substitute.</b> $$ \Delta f=\frac{48000\ \text{Hz}}{8192},\qquad f_{100}=100\times\Delta f. $$</p>
<p><b>Compute.</b> $\Delta f=5.859$ Hz; $f_{100}=100\times5.859=585.9$ Hz.</p>
<p><b>Explanation.</b> Each bin is about 5.86 Hz wide, and bin 100 sits at 585.9 Hz. The resolution is fixed by the record length $N/f_s=0.171$ s, not by the sample rate alone.</p>` },
    { q: String.raw`You must resolve two tones 2 Hz apart. What minimum record length and (at $f_s=10$ kHz) minimum $N$?`, solution: String.raw`<p><b>Formula.</b> $$ T_{\text{record}}\ge\frac{1}{\Delta f},\qquad N\ge f_s\,T_{\text{record}} $$ where $\Delta f$ is the required frequency resolution and $T_{\text{record}}$ the observation time.</p>
<p><b>Substitute.</b> $$ T_{\text{record}}\ge\frac{1}{2\ \text{Hz}}=0.5\ \text{s},\qquad N\ge 10000\times0.5. $$</p>
<p><b>Compute.</b> $T_{\text{record}}\ge0.5$ s and $N\ge5000$; the next power of two for a radix-2 FFT is $N=8192$.</p>
<p><b>Explanation.</b> Resolving 2 Hz-spaced tones demands at least half a second of data regardless of sample rate — the time–frequency uncertainty. Rounding up to 8192 satisfies the radix-2 requirement.</p>` },
    { q: String.raw`How many stages and total butterflies in a 1024-point FFT?`, solution: String.raw`<p><b>Formula.</b> $$ \text{stages}=\log_2 N,\qquad \text{butterflies}=\frac{N}{2}\log_2 N $$ where each of the $\log_2 N$ stages contains $N/2$ butterflies.</p>
<p><b>Substitute.</b> $$ \text{stages}=\log_2 1024,\qquad \text{butterflies}=\frac{1024}{2}\times\log_2 1024. $$</p>
<p><b>Compute.</b> Stages $=10$; butterflies per stage $=512$; total $=512\times10=5120$.</p>
<p><b>Explanation.</b> The 5120 total equals the complex-multiply count, since each butterfly does exactly one multiply. Sanity check: $\tfrac{N}{2}\log_2N=512\times10=5120$ confirms it.</p>` },
    { q: String.raw`In an 8-point FFT, where does input sample $x[3]$ go after bit-reversal?`, solution: String.raw`<p><b>Formula.</b> For $N=8$, an index uses $\log_2 8=3$ bits; bit-reversal reads those bits in reverse order to give the new position.</p>
<p><b>Substitute.</b> $$ 3=011_2\ \longrightarrow\ \text{reverse the 3 bits}\ \longrightarrow\ 110_2. $$</p>
<p><b>Compute.</b> $110_2=6$, so $x[3]$ moves to position 6.</p>
<p><b>Explanation.</b> This one-time $O(N)$ permutation is what lets a DIT FFT consume bit-reversed input and emit natural-order output. Note the pair is symmetric: $x[6]$ correspondingly moves to position 3.</p>` },
    { q: String.raw`A rectangular-windowed FFT shows a tone leaking badly. Switching to Hann, by roughly how much do peak side lobes drop?`, solution: String.raw`<p><b>Formula.</b> $$ \Delta_{\text{dB}}=|\text{SLL}_{\text{Hann}}|-|\text{SLL}_{\text{rect}}| $$ comparing the peak side-lobe levels (SLL) of the two windows.</p>
<p><b>Substitute.</b> Rectangular peak SLL $\approx-13$ dB, Hann $\approx-31$ dB, so $$ \Delta_{\text{dB}}=31-13. $$</p>
<p><b>Compute.</b> $\Delta_{\text{dB}}\approx18$ dB of extra side-lobe suppression.</p>
<p><b>Explanation.</b> The Hann window buys about 18 dB less leakage, which uncovers weak tones near a strong one — at the cost of doubling the main-lobe width (worse resolution). This is the fundamental window trade-off.</p>` },
    { q: String.raw`Estimate the time for a $2^{20}$-point FFT on a processor doing $10^9$ complex multiplies per second.`, solution: String.raw`<p><b>Formula.</b> $$ C=\tfrac{N}{2}\log_2 N,\qquad t=\frac{C}{R} $$ where $C$ is the multiply count, $R$ the processor rate (multiplies/s) and $t$ the run time.</p>
<p><b>Substitute.</b> With $N=2^{20}=1{,}048{,}576$: $$ C=\frac{2^{20}}{2}\times20=524{,}288\times20,\qquad t=\frac{C}{10^9}. $$</p>
<p><b>Compute.</b> $C=1.05\times10^7$ multiplies, so $t=1.05\times10^7/10^9\approx10.5$ ms. The direct DFT would need $N^2\approx1.1\times10^{12}$ multiplies, i.e. $\approx1100$ s $\approx18$ minutes.</p>
<p><b>Explanation.</b> A megapoint transform runs in about 10 ms with the FFT but would take a quarter-hour by brute force — the difference between real-time DSP and none at all.</p>` }
  ],
  realWorld: String.raw`<p>The FFT is everywhere in RF and communications. Every spectrum analyzer and SDR waterfall display computes streaming FFTs (often with Welch averaging for a stable noise floor). <b>OFDM</b> systems — Wi-Fi, LTE, 5G-NR, DVB — map data onto orthogonal subcarriers via an IFFT at the transmitter and recover them with an FFT at the receiver, turning a frequency-selective channel into many flat sub-channels. Radar and sonar use FFTs for Doppler processing and pulse compression; the chirp-z and matched-filter operations are FFT-based. Audio codecs (MP3, AAC), image compression, and machine-learning spectrograms all lean on it. In hardware, pipelined and streaming FFT cores on FPGAs (e.g. on RFSoC-class devices) sustain gigasample throughput, and the in-place, bit-reversed structure maps cleanly onto dedicated butterfly datapaths.</p>`,
  related: ['fourier-transform', 'frequency-spectrum', 'psd', 'convolution', 'nyquist-sampling', 'sinc-function']
},
{
  id: 'fir-filters',
  title: 'FIR Filters',
  category: 'Signals & Systems',
  tags: ['FIR', 'linear phase', 'convolution', 'taps', 'windowed sinc', 'Parks-McClellan', 'group delay'],
  summary: String.raw`A Finite Impulse Response filter computes its output as a weighted sum of a finite window of past inputs, $y[n]=\sum_k b_k\,x[n-k]$, making it inherently stable and capable of exactly linear phase.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-fir-filters" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<text x="30" y="40" fill="#e6edf3" text-anchor="middle">x[n]</text>
<line x1="20" y1="50" x2="500" y2="50" stroke="#9aa7b5" marker-end="url(#arr-fir-filters)"/>
<rect x="120" y="36" width="34" height="28" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="137" y="55" fill="#e6edf3" text-anchor="middle" font-size="10">z⁻¹</text>
<rect x="240" y="36" width="34" height="28" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="257" y="55" fill="#e6edf3" text-anchor="middle" font-size="10">z⁻¹</text>
<rect x="360" y="36" width="34" height="28" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="377" y="55" fill="#e6edf3" text-anchor="middle" font-size="10">z⁻¹</text>
<line x1="60" y1="50" x2="60" y2="95" stroke="#9aa7b5" marker-end="url(#arr-fir-filters)"/><text x="60" y="88" fill="#63e6be" text-anchor="middle" font-size="10">×b₀</text>
<line x1="180" y1="50" x2="180" y2="95" stroke="#9aa7b5" marker-end="url(#arr-fir-filters)"/><text x="180" y="88" fill="#63e6be" text-anchor="middle" font-size="10">×b₁</text>
<line x1="300" y1="50" x2="300" y2="95" stroke="#9aa7b5" marker-end="url(#arr-fir-filters)"/><text x="300" y="88" fill="#63e6be" text-anchor="middle" font-size="10">×b₂</text>
<line x1="420" y1="50" x2="420" y2="95" stroke="#9aa7b5" marker-end="url(#arr-fir-filters)"/><text x="425" y="88" fill="#63e6be" text-anchor="middle" font-size="10">×b_{N-1}</text>
<rect x="40" y="100" width="400" height="34" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="240" y="121" fill="#e6edf3" text-anchor="middle">Σ  (sum of weighted taps)</text>
<line x1="440" y1="117" x2="500" y2="117" stroke="#9aa7b5" marker-end="url(#arr-fir-filters)"/><text x="490" y="110" fill="#e6edf3" text-anchor="middle">y[n]</text>
<text x="240" y="160" fill="#b197fc" text-anchor="middle" font-size="11">feed-forward only — no feedback ⇒ always stable, linear phase</text>
</svg>`,
    caption: String.raw`FIR structure: a tapped delay line ($z^{-1}$) scales each delayed input by $b_k$ and sums them — purely feed-forward, giving $y[n]=\sum_k b_k x[n-k]$.`,
  },
  {
    title: String.raw`FIR design flow: spec → window/Parks-McClellan → taps → verify`,
    svg: String.raw`<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-fir-filters" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="6" y="45" width="104" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="58" y="64" fill="#e6edf3" text-anchor="middle" font-size="11">spec</text><text x="58" y="79" fill="#9aa7b5" text-anchor="middle" font-size="10">f_c, ripple, Δf</text>
<rect x="130" y="45" width="120" height="46" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="190" y="61" fill="#e6edf3" text-anchor="middle" font-size="11">design method</text><text x="190" y="76" fill="#9aa7b5" text-anchor="middle" font-size="9">window / Parks-McClellan</text>
<rect x="270" y="45" width="110" height="46" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="325" y="64" fill="#e6edf3" text-anchor="middle" font-size="11">coefficients</text><text x="325" y="79" fill="#9aa7b5" text-anchor="middle" font-size="10">taps b_k</text>
<rect x="400" y="45" width="132" height="46" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="466" y="61" fill="#e6edf3" text-anchor="middle" font-size="11">verify</text><text x="466" y="76" fill="#9aa7b5" text-anchor="middle" font-size="9">|H(e^{jω})| vs mask</text>
<line x1="110" y1="68" x2="128" y2="68" stroke="#9aa7b5" marker-end="url(#arr2-fir-filters)"/>
<line x1="250" y1="68" x2="268" y2="68" stroke="#9aa7b5" marker-end="url(#arr2-fir-filters)"/>
<line x1="380" y1="68" x2="398" y2="68" stroke="#9aa7b5" marker-end="url(#arr2-fir-filters)"/>
<line x1="466" y1="91" x2="466" y2="108" stroke="#9aa7b5"/><line x1="466" y1="108" x2="190" y2="108" stroke="#9aa7b5"/><line x1="190" y1="108" x2="190" y2="93" stroke="#9aa7b5" marker-end="url(#arr2-fir-filters)"/>
<text x="325" y="122" fill="#9aa7b5" text-anchor="middle" font-size="9">fail mask → raise N, re-design</text>
</svg>`,
    caption: String.raw`FIR design flow: translate the spec (cutoff, ripple, transition width) into taps via the window method or Parks–McClellan, then verify the magnitude response against the mask, raising the tap count $N$ and iterating if it fails.`,
  },
  {
    title: String.raw`Linear phase: symmetric taps → constant group delay`,
    svg: String.raw`<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-fir-filters" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="14" y="30" width="180" height="50" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="104" y="50" fill="#e6edf3" text-anchor="middle" font-size="11">symmetric taps</text><text x="104" y="66" fill="#9aa7b5" text-anchor="middle" font-size="10">b_k = b_{N-1-k}</text>
<rect x="232" y="30" width="180" height="50" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="322" y="50" fill="#e6edf3" text-anchor="middle" font-size="11">linear phase</text><text x="322" y="66" fill="#9aa7b5" text-anchor="middle" font-size="10">∠H = −ω(N−1)/2</text>
<rect x="180" y="98" width="180" height="42" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="270" y="116" fill="#e6edf3" text-anchor="middle" font-size="11">constant group delay</text><text x="270" y="131" fill="#9aa7b5" text-anchor="middle" font-size="10">τ_g = (N−1)/2 samples</text>
<line x1="194" y1="55" x2="230" y2="55" stroke="#9aa7b5" marker-end="url(#arr3-fir-filters)"/>
<line x1="322" y1="80" x2="290" y2="96" stroke="#9aa7b5" marker-end="url(#arr3-fir-filters)"/>
<text x="450" y="120" fill="#9aa7b5" text-anchor="middle" font-size="9">no waveform</text><text x="450" y="132" fill="#9aa7b5" text-anchor="middle" font-size="9">distortion / ISI</text>
</svg>`,
    caption: String.raw`Why FIR is prized in comms: mirror-symmetric taps ($b_k=b_{N-1-k}$) force a purely linear phase $\angle H=-\omega(N-1)/2$, hence a constant group delay of $(N-1)/2$ samples — every frequency delayed equally, so no waveform distortion or filter-induced ISI.`,
  }
  ],
  prerequisites: ['convolution', 'z-transform', 'sinc-function', 'frequency-spectrum'],
  intro: String.raw`<p>A <b>Finite Impulse Response (FIR)</b> filter builds each output sample from a fixed-length weighted sum of recent input samples — nothing else. Its impulse response is exactly the list of weights (the <b>taps</b>) and lasts only as long as that list: hit it with a single impulse and after $N$ samples the output is dead silent. There is no feedback, so a bounded input can never blow up: <b>every FIR filter is stable</b>, full stop.</p>
<p>The property that makes FIR filters beloved in communications is <b>exactly linear phase</b>. If the taps are symmetric, every frequency is delayed by the same constant time, so the waveform's shape is preserved — no phase distortion, no smearing of pulse edges, no inter-symbol interference introduced by the filter itself. The price is length: to get a sharp transition band an FIR may need dozens or hundreds of taps, meaning more multiplies per sample and more latency than a comparable IIR filter. FIR filters are the default choice whenever waveform fidelity matters more than raw efficiency: pulse shaping, matched filtering, channelization, and decimation/interpolation.</p>`,
  sections: [
    { h: 'Definition and structure', html: String.raw`<p>An FIR filter of order $N-1$ (with $N$ taps) is the difference equation</p>
$$ y[n]=\sum_{k=0}^{N-1} b_k\,x[n-k]=b_0 x[n]+b_1 x[n-1]+\cdots+b_{N-1}x[n-(N-1)]. $$
<p>This is a direct <b>convolution</b> of the input with the tap sequence. The taps <i>are</i> the impulse response: set $x[n]=\delta[n]$ and you read out $h[n]=b_n$. Because the sum has no term involving past <i>outputs</i>, there is no feedback — the structure is purely feed-forward (a tapped delay line, "transversal" filter).</p>
<div class="callout"><b>Nomenclature:</b> "$N$-tap FIR" means $N$ coefficients, order $N-1$, impulse response length $N$, and $N-1$ delay elements. The terms tap, coefficient, and impulse-response sample all refer to the same $b_k$.</div>` },
    { h: 'Guaranteed stability', html: String.raw`<p>A causal LTI system is <b>BIBO stable</b> iff its impulse response is absolutely summable, $\sum_n|h[n]|<\infty$. For an FIR filter the impulse response has only $N$ nonzero terms, so the sum is finite <i>automatically</i>, whatever the coefficients. In the $z$-domain,</p>
$$ H(z)=\sum_{k=0}^{N-1} b_k z^{-k}=\frac{b_0 z^{N-1}+b_1 z^{N-2}+\cdots+b_{N-1}}{z^{N-1}}. $$
<p>All $N-1$ poles sit at $z=0$, deep inside the unit circle. There is no denominator polynomial to place poles anywhere else, so an FIR filter can <b>never</b> be unstable and can <b>never</b> oscillate on its own. Quantizing the coefficients moves the zeros a little but leaves stability untouched — a decisive practical advantage over IIR.</p>` },
    { h: 'Linear phase from symmetric taps', html: String.raw`<p>If the taps are <b>symmetric</b>, $b_k=b_{N-1-k}$, or <b>antisymmetric</b>, $b_k=-b_{N-1-k}$, the frequency response factors into a real (or imaginary) amplitude times a pure linear-phase term $e^{-j\omega(N-1)/2}$. The phase is then</p>
$$ \angle H(e^{j\omega})=-\,\omega\,\frac{N-1}{2}\;(+\text{const}), $$
<p>a straight line in $\omega$. A straight-line phase means a <b>constant group delay</b> — every frequency component is delayed by the same amount, so the output is a time-shifted, undistorted version of what the passband lets through. This is impossible for a causal IIR filter. There are four canonical linear-phase types:</p>
<table class="data">
<tr><th>Type</th><th>Symmetry</th><th>Length</th><th>Forced zero at</th><th>Good for</th></tr>
<tr><td>I</td><td>symmetric</td><td>odd</td><td>—</td><td>any: LP, HP, BP, BS</td></tr>
<tr><td>II</td><td>symmetric</td><td>even</td><td>$\omega=\pi$</td><td>low-pass, band-pass (not HP)</td></tr>
<tr><td>III</td><td>antisymmetric</td><td>odd</td><td>$\omega=0,\pi$</td><td>differentiators, Hilbert</td></tr>
<tr><td>IV</td><td>antisymmetric</td><td>even</td><td>$\omega=0$</td><td>differentiators, Hilbert</td></tr>
</table>` },
    { h: 'Group delay', html: String.raw`<p><b>Group delay</b> is the negative derivative of phase with respect to frequency, $\tau_g(\omega)=-\,d\phi/d\omega$; it is the time delay experienced by the envelope of a narrowband group of frequencies. For a linear-phase FIR:</p>
$$ \tau_g=\frac{N-1}{2}\ \text{samples}=\frac{N-1}{2 f_s}\ \text{seconds — constant for all }\omega. $$
<p>A 101-tap filter delays every frequency by exactly 50 samples. Constant group delay is exactly what prevents a filter from smearing symbol edges and adding <b>inter-symbol interference</b>, which is why matched filters and pulse-shaping filters are almost always linear-phase FIR. The flip side: half the filter length is pure latency, so a very sharp (long) FIR can add substantial delay — a real concern in feedback loops and low-latency links.</p>` },
    { h: 'Design 1 — windowed sinc', html: String.raw`<p>The <b>ideal</b> low-pass filter has a brick-wall rectangular response, whose inverse DFT is an infinitely long <b>sinc</b>:</p>
$$ h_{\text{ideal}}[n]=2\frac{f_c}{f_s}\,\operatorname{sinc}\!\Big(2\tfrac{f_c}{f_s}\,(n-\tfrac{N-1}{2})\Big). $$
<p>It is non-causal and infinite, so we (1) <b>truncate</b> it to $N$ taps and (2) <b>shift</b> it to be causal. Abrupt truncation multiplies by a rectangular window, whose transform is a sinc — producing the <b>Gibbs phenomenon</b>: fixed ~9% overshoot ripple near the band edge that does <i>not</i> shrink as $N$ grows. The fix is to taper the truncation with a smooth window (Hamming, Hann, Blackman, or the parameterized <b>Kaiser</b>):</p>
$$ h[n]=h_{\text{ideal}}[n]\cdot w[n]. $$
<div class="callout"><b>Kaiser window:</b> its $\beta$ parameter trades stopband attenuation against transition width; Kaiser's formulas estimate the tap count $N$ directly from the required ripple and transition bandwidth. Simple, robust, and the usual first choice.</div>` },
    { h: 'Design 2 — Parks–McClellan (equiripple)', html: String.raw`<p>The window method wastes taps: it over-satisfies the spec in the middle of each band and only just meets it at the edges. The <b>Parks–McClellan</b> algorithm (a.k.a. Remez exchange, <code>firpm</code>) instead makes the approximation error <b>equiripple</b> — the same maximum deviation everywhere in each band — which is provably optimal in the minimax (Chebyshev) sense. For a given specification it delivers the <b>shortest possible FIR</b>, or equivalently the smallest error for a given length.</p>
<p>You specify band edges, desired gains, and relative ripple weights; the algorithm iteratively relocates the extremal frequencies until the error alternates in sign and touches $\pm\delta$ the right number of times (the alternation theorem). A useful estimate for the required length is</p>
$$ N \approx \frac{-10\log_{10}(\delta_p\,\delta_s)-13}{14.6\,\Delta f/f_s}+1, $$
<p>where $\delta_p,\delta_s$ are passband/stopband ripples and $\Delta f$ is the transition width. Parks–McClellan is the professional default for demanding, tightly-specified FIR designs.</p>` },
    { h: 'Tap count vs sharpness — the fundamental trade-off', html: String.raw`<p>A filter's <b>transition width</b> (how fast it falls from passband to stopband) is inversely proportional to its length: halving the transition band roughly <b>doubles</b> the number of taps. Deeper <b>stopband attenuation</b> also costs taps. The estimate above shows both effects: $N$ grows as attenuation increases and as $\Delta f$ shrinks.</p>
<table class="data">
<tr><th>Want</th><th>Effect on tap count $N$</th><th>Cost</th></tr>
<tr><td>Sharper transition (smaller $\Delta f$)</td><td>$N\propto 1/\Delta f$</td><td>more MACs/sample, more delay</td></tr>
<tr><td>Deeper stopband</td><td>$N$ grows with attenuation (dB)</td><td>more MACs/sample</td></tr>
<tr><td>More passband ripple allowed</td><td>$N$ decreases</td><td>less flat passband</td></tr>
</table>
<p>Each output sample of an $N$-tap FIR needs $N$ multiply-accumulates, so long filters are expensive at high sample rates. This computational cost — many taps for a sharp response — is precisely the weakness that IIR filters exploit.</p>` },
    { h: 'Efficient forms and implementation', html: String.raw`<p>Several tricks cut the cost of FIR filters. <b>Symmetric folding:</b> because $b_k=b_{N-1-k}$, you can add the two mirror-image taps <i>before</i> multiplying, halving the multiplier count. <b>Polyphase decomposition:</b> in decimators and interpolators, split the filter into sub-filters so multiplies happen only at the lower rate — a big saving in multirate systems. <b>FFT-based fast convolution</b> (overlap-add/save) beats direct convolution when the filter is very long. In hardware, FIR filters map onto systolic MAC arrays and DSP slices with regular, pipelineable structure; the lack of feedback means the pipeline never stalls on a recursive dependency.</p>` },
    { h: 'What you should now understand', html: String.raw`<div class="callout tip"><p>The essential FIR takeaways:</p>
<ul>
<li><b>An FIR is a finite feed-forward sum,</b> $y[n]=\sum_k b_k x[n-k]$ — pure convolution, and the taps <i>are</i> the impulse response.</li>
<li><b>Every FIR is unconditionally stable</b> because a finite impulse response is always absolutely summable; all poles sit at $z=0$.</li>
<li><b>Symmetric taps give exactly linear phase,</b> hence a constant group delay $(N-1)/2$ samples — no waveform distortion, no filter-induced ISI.</li>
<li><b>Two main design routes:</b> windowed-sinc (truncate the ideal sinc and taper) and Parks–McClellan (optimal equiripple, shortest filter for a spec).</li>
<li><b>The cost is length:</b> sharper transitions or deeper stopbands need more taps ($N\propto1/\Delta f$), meaning more MACs and more latency than a comparable IIR.</li>
<li><b>Why it matters:</b> pulse shaping, matched filtering, and channelizers use FIR precisely because phase fidelity — not raw efficiency — is what they cannot compromise.</li>
</ul></div>` },
    {
      h: String.raw`Further reading`,
      html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Finite_impulse_response" target="_blank" rel="noopener">Wikipedia — Finite impulse response</a> — a thorough reference on FIR structure, linear phase, and the window, least-squares and Parks–McClellan design routes.</li>
<li><a href="https://www.dspguide.com/ch16.htm" target="_blank" rel="noopener">DSP Guide (Steven Smith) — Ch. 16: Windowed-Sinc Filters</a> — the definitive practical treatment of designing FIR filters by truncating and tapering the ideal sinc.</li>
<li><a href="https://ccrma.stanford.edu/~jos/filters/FIR_Digital_Filters.html" target="_blank" rel="noopener">Stanford CCRMA — Julius Smith, FIR Digital Filters</a> — a rigorous online-textbook chapter on transversal/tapped-delay-line FIR structure, convergence and transfer functions.</li>
<li><a href="https://www.mathworks.com/help/signal/ug/fir-filter-design.html" target="_blank" rel="noopener">MathWorks — FIR Filter Design</a> — an authoritative guide to the four linear-phase types and windowing, least-squares and equiripple design with worked code.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`FIR output is a finite weighted sum of past inputs: $y[n]=\sum_{k=0}^{N-1}b_k\,x[n-k]$ — pure convolution, no feedback.`,
    String.raw`The taps <i>are</i> the impulse response: $h[n]=b_n$, length $N$.`,
    String.raw`Every FIR filter is BIBO stable — a finite impulse response is always absolutely summable; all poles sit at $z=0$.`,
    String.raw`Symmetric ($b_k=b_{N-1-k}$) or antisymmetric taps give exactly linear phase, hence constant group delay.`,
    String.raw`Group delay of a linear-phase FIR is $(N-1)/2$ samples for all frequencies — no waveform distortion.`,
    String.raw`Four linear-phase types (I–IV) by symmetry × length parity; type constrains which responses (HP/differentiator/Hilbert) are realizable.`,
    String.raw`Windowed-sinc design: truncate the ideal sinc and taper with a window to control Gibbs ripple; Kaiser $\beta$ trades ripple vs width.`,
    String.raw`Parks–McClellan gives the optimal equiripple FIR — shortest filter meeting a minimax spec.`,
    String.raw`Sharper transition or deeper stopband ⇒ more taps; roughly $N\propto 1/\Delta f$.`,
    String.raw`Each output costs $N$ multiply-accumulates; long filters are compute-heavy and add latency.`,
    String.raw`Symmetry folding halves multipliers; polyphase forms cut cost in multirate systems.`,
    String.raw`Preferred wherever phase fidelity matters: pulse shaping, matched filtering, channelizers, decimation/interpolation.`
  ],
  equations: [
    { title: 'FIR difference equation / convolution', tex: String.raw`$$ y[n]=\sum_{k=0}^{N-1} b_k\,x[n-k]=(x*h)[n] $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want a causal linear time-invariant system with a finite memory of the last $N$ input samples and no dependence on past outputs.</p>
<p><b>Step 1 — LTI means convolution.</b> Any LTI system obeys $y[n]=\sum_{k=-\infty}^{\infty}h[k]\,x[n-k]$, where $h[k]$ is its impulse response. This is the defining superposition property of LTI systems.</p>
<p><b>Step 2 — impose finiteness and causality.</b> Restrict $h[k]$ to be nonzero only for $k=0,1,\dots,N-1$: finite length ($N$ taps) and causal (no negative indices). The infinite sum collapses:</p>
$$ y[n]=\sum_{k=0}^{N-1} h[k]\,x[n-k]. $$
<p><b>Step 3 — rename the impulse response as coefficients.</b> Write $b_k\equiv h[k]$; these are the tap weights we design. Substituting $x[n]=\delta[n]$ confirms $y[n]=b_n$, so the taps literally are the impulse response.</p>
<p><b>Result.</b> $$ y[n]=\sum_{k=0}^{N-1}b_k\,x[n-k]. $$ A finite convolution — a tapped delay line with weights, no feedback path.</p>` },
    { title: 'Transfer function and pole locations', tex: String.raw`$$ H(z)=\sum_{k=0}^{N-1}b_k z^{-k}=\frac{\sum_k b_k z^{N-1-k}}{z^{N-1}} $$`,
      derivation: String.raw`<p><b>Where we start.</b> Take the $z$-transform of the FIR difference equation to get its transfer function.</p>
<p><b>Step 1 — transform each term.</b> The $z$-transform is linear and a delay by $k$ multiplies by $z^{-k}$: $\mathcal{Z}\{x[n-k]\}=z^{-k}X(z)$. So</p>
$$ Y(z)=\sum_{k=0}^{N-1}b_k z^{-k}X(z). $$
<p><b>Step 2 — form $H(z)=Y/X$.</b> $$ H(z)=\sum_{k=0}^{N-1}b_k z^{-k}. $$ This is a polynomial in $z^{-1}$ — no denominator polynomial, hence <i>all-zero</i>.</p>
<p><b>Step 3 — put over a common denominator.</b> Multiply top and bottom by $z^{N-1}$: $$ H(z)=\frac{b_0 z^{N-1}+b_1 z^{N-2}+\cdots+b_{N-1}}{z^{N-1}}. $$ The denominator is $z^{N-1}$, so all $N-1$ poles are at $z=0$.</p>
<p><b>Result.</b> Poles fixed at the origin — always inside the unit circle — so the filter is unconditionally stable. Only the zeros (numerator roots) shape the response.</p>` },
    { title: 'Linear phase from symmetry', tex: String.raw`$$ b_k=b_{N-1-k}\ \Rightarrow\ H(e^{j\omega})=A(\omega)\,e^{-j\omega(N-1)/2} $$`,
      derivation: String.raw`<p><b>Where we start.</b> An odd-length ($N$ odd) symmetric FIR with center tap at $M=(N-1)/2$ and $b_k=b_{N-1-k}$.</p>
<p><b>Step 1 — evaluate the DTFT.</b> $$ H(e^{j\omega})=\sum_{k=0}^{N-1}b_k e^{-j\omega k}. $$</p>
<p><b>Step 2 — factor out the center delay.</b> Substitute $k=M+m$ so $m$ runs symmetrically about the center:</p>
$$ H(e^{j\omega})=e^{-j\omega M}\sum_{m=-M}^{M}b_{M+m}\,e^{-j\omega m}. $$
<p><b>Step 3 — pair mirror taps.</b> Symmetry gives $b_{M+m}=b_{M-m}$. Pair term $+m$ with $-m$; the exponentials combine as $e^{-j\omega m}+e^{+j\omega m}=2\cos(\omega m)$, which is purely real:</p>
$$ H(e^{j\omega})=e^{-j\omega M}\Big[b_M+\sum_{m=1}^{M}2b_{M+m}\cos(\omega m)\Big]=e^{-j\omega M}A(\omega). $$
<p><b>Result.</b> The bracket $A(\omega)$ is a real amplitude; all the phase is the linear term $-\omega M=-\omega(N-1)/2$. $$ \angle H=-\omega\frac{N-1}{2}. $$ Linear phase — constant group delay — arises purely from tap symmetry.</p>` },
    { title: 'Constant group delay', tex: String.raw`$$ \tau_g=-\frac{d}{d\omega}\Big(-\omega\frac{N-1}{2}\Big)=\frac{N-1}{2}\ \text{samples} $$`,
      derivation: String.raw`<p><b>Where we start.</b> Group delay is defined as $\tau_g(\omega)=-\,d\phi(\omega)/d\omega$, the delay of the envelope of a narrowband packet centered at $\omega$.</p>
<p><b>Step 1 — insert the linear phase.</b> For a linear-phase FIR, $\phi(\omega)=-\omega(N-1)/2\ (+$ a constant $0$ or $\pi$ from the sign of $A$).</p>
<p><b>Step 2 — differentiate.</b> $$ \tau_g=-\frac{d}{d\omega}\!\left[-\omega\frac{N-1}{2}\right]=\frac{N-1}{2}. $$ The constant term differentiates to zero, so $\tau_g$ is independent of $\omega$.</p>
<p><b>Result.</b> $$ \tau_g=\frac{N-1}{2}\ \text{samples}=\frac{N-1}{2f_s}\ \text{s}. $$ Every frequency is delayed identically, so the filtered waveform is a pure time shift of the passband content — no dispersion, no ISI from the filter. Half the filter length is the price in latency.</p>` },
    { title: 'Ideal low-pass impulse response (sinc)', tex: String.raw`$$ h_{\text{LP}}[n]=2\frac{f_c}{f_s}\operatorname{sinc}\!\Big(2\tfrac{f_c}{f_s}n\Big) $$`,
      derivation: String.raw`<p><b>Where we start.</b> Define the ideal low-pass as a brick wall: $H(e^{j\omega})=1$ for $|\omega|<\omega_c$ and $0$ otherwise, with $\omega_c=2\pi f_c/f_s$.</p>
<p><b>Step 1 — inverse DTFT.</b> $$ h[n]=\frac{1}{2\pi}\int_{-\pi}^{\pi}H(e^{j\omega})e^{j\omega n}\,d\omega=\frac{1}{2\pi}\int_{-\omega_c}^{\omega_c}e^{j\omega n}\,d\omega. $$</p>
<p><b>Step 2 — integrate the exponential.</b> $$ h[n]=\frac{1}{2\pi}\cdot\frac{e^{j\omega_c n}-e^{-j\omega_c n}}{jn}=\frac{\sin(\omega_c n)}{\pi n}. $$</p>
<p><b>Step 3 — write as a sinc.</b> With $\operatorname{sinc}(x)=\sin(\pi x)/(\pi x)$ and $\omega_c=2\pi f_c/f_s$: $$ h[n]=\frac{\omega_c}{\pi}\operatorname{sinc}\!\Big(\frac{\omega_c}{\pi}n\Big)=2\frac{f_c}{f_s}\operatorname{sinc}\!\Big(2\tfrac{f_c}{f_s}n\Big). $$</p>
<p><b>Result.</b> The ideal low-pass impulse response is an infinitely long, non-causal sinc. Real FIR design truncates it to $N$ taps, shifts it to be causal, and windows it to tame the Gibbs ripple.</p>` },
    { title: 'Kaiser tap-count estimate', tex: String.raw`$$ N\approx\frac{A-8}{2.285\,\Delta\omega}+1 $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want a formula linking the required stopband attenuation $A$ (in dB) and transition width $\Delta\omega$ (in rad/sample) to the filter length $N$, for a Kaiser-windowed design.</p>
<p><b>Step 1 — attenuation sets the window shape.</b> Kaiser found empirically that to reach stopband attenuation $A$ dB, the window shape parameter must satisfy roughly $\beta\propto(A-8.7)$; larger $A$ needs a heavier taper.</p>
<p><b>Step 2 — width sets the length.</b> A heavier taper widens the main lobe, so to keep the transition band $\Delta\omega$ narrow you need more taps. Kaiser's fit gives $N-1\approx(A-8)/(2.285\,\Delta\omega)$.</p>
<p><b>Step 3 — solve for $N$.</b> $$ N\approx\frac{A-8}{2.285\,\Delta\omega}+1. $$</p>
<p><b>Result.</b> $N$ grows linearly with attenuation and inversely with transition width — the concrete statement of "sharper or deeper ⇒ more taps." It gives a first-cut length before optimization.</p>` }
  ],
  flashcards: [
    { front: String.raw`Write the FIR difference equation.`, back: String.raw`$y[n]=\sum_{k=0}^{N-1}b_k\,x[n-k]$ — a finite weighted sum of past inputs, i.e. convolution with the taps.` },
    { front: String.raw`Why is every FIR filter stable?`, back: String.raw`Its impulse response has only $N$ terms, so $\sum|h[n]|<\infty$ always. All poles sit at $z=0$, inside the unit circle.` },
    { front: String.raw`What relationship do the taps have to the impulse response?`, back: String.raw`They are identical: $h[n]=b_n$. Feeding an impulse reads out the coefficients.` },
    { front: String.raw`What tap property gives exactly linear phase?`, back: String.raw`Symmetry $b_k=b_{N-1-k}$ (or antisymmetry $b_k=-b_{N-1-k}$).` },
    { front: String.raw`Group delay of a linear-phase FIR?`, back: String.raw`Constant $\tau_g=(N-1)/2$ samples for all frequencies — no waveform distortion.` },
    { front: String.raw`What is the Gibbs phenomenon in FIR design?`, back: String.raw`Truncating the ideal sinc with a rectangular window causes ~9% overshoot ripple near the band edge that does not shrink with $N$; smooth windows suppress it.` },
    { front: String.raw`How does windowed-sinc design work?`, back: String.raw`Take the ideal sinc impulse response, truncate to $N$ taps, shift to be causal, and multiply by a smooth window (Hamming/Hann/Blackman/Kaiser).` },
    { front: String.raw`What does the Kaiser $\beta$ control?`, back: String.raw`The trade-off between stopband attenuation (larger $\beta$ = deeper) and transition-band width (larger $\beta$ = wider).` },
    { front: String.raw`What makes Parks–McClellan optimal?`, back: String.raw`It produces an equiripple response — equal maximum error across each band — the shortest FIR meeting a minimax spec (alternation theorem).` },
    { front: String.raw`How does tap count scale with transition width?`, back: String.raw`Inversely: $N\propto 1/\Delta f$. Halving the transition band roughly doubles the taps.` },
    { front: String.raw`Cost per output sample of an $N$-tap FIR?`, back: String.raw`$N$ multiply-accumulates (halved to ~$N/2$ if symmetry folding is used).` },
    { front: String.raw`Name the four linear-phase FIR types.`, back: String.raw`I: symmetric/odd. II: symmetric/even. III: antisymmetric/odd. IV: antisymmetric/even. Types III/IV suit differentiators and Hilbert transformers.` },
    { front: String.raw`Why are FIR filters used for pulse shaping and matched filtering?`, back: String.raw`Their constant group delay preserves waveform shape and avoids adding inter-symbol interference.` },
    { front: String.raw`What is polyphase decomposition?`, back: String.raw`Splitting an FIR into sub-filters so multiplies run at the lower rate in decimators/interpolators, cutting computation.` },
    { front: String.raw`Main disadvantage of FIR vs IIR?`, back: String.raw`It needs far more taps (compute + latency) to achieve the same transition sharpness.` }
  ],
  mcqs: [
    { q: String.raw`The defining equation of an FIR filter is:`, options: [String.raw`$y[n]=\sum b_k x[n-k]-\sum a_k y[n-k]$`, String.raw`$y[n]=\sum_{k=0}^{N-1} b_k x[n-k]$`, String.raw`$y[n]=x[n]+y[n-1]$`, String.raw`$Y(s)=H(s)X(s)$`], answer: 1, explain: String.raw`FIR is a finite feed-forward sum of inputs with no output feedback.` },
    { q: String.raw`Why is an FIR filter always stable?`, options: [String.raw`Its coefficients are small`, String.raw`Its finite impulse response is always absolutely summable (poles at $z=0$)`, String.raw`It uses feedback`, String.raw`It is band-limited`], answer: 1, explain: String.raw`A length-$N$ impulse response gives a finite sum; all poles lie at the origin.` },
    { q: String.raw`The taps of an FIR filter are equal to:`, options: [String.raw`Its poles`, String.raw`Its impulse response $h[n]$`, String.raw`Its step response`, String.raw`Its group delay`], answer: 1, explain: String.raw`$h[n]=b_n$; an impulse reads out the coefficients directly.` },
    { q: String.raw`Exactly linear phase requires:`, options: [String.raw`Complex taps`, String.raw`Symmetric or antisymmetric taps`, String.raw`Feedback`, String.raw`An even number of poles`], answer: 1, explain: String.raw`$b_k=\pm b_{N-1-k}$ factors the response into a real amplitude times $e^{-j\omega(N-1)/2}$.` },
    { q: String.raw`The group delay of a linear-phase FIR filter is:`, options: [String.raw`Frequency dependent`, String.raw`$(N-1)/2$ samples, constant`, String.raw`Zero`, String.raw`Infinite`], answer: 1, explain: String.raw`Linear phase differentiates to a constant delay $(N-1)/2$ samples.` },
    { q: String.raw`The Gibbs phenomenon in FIR design comes from:`, options: [String.raw`Feedback`, String.raw`Rectangular truncation of the ideal sinc`, String.raw`Coefficient quantization`, String.raw`Aliasing`], answer: 1, explain: String.raw`Sharp truncation causes ~9% overshoot ripple that a smooth window suppresses.` },
    { q: String.raw`Which method gives the optimal (shortest) equiripple FIR?`, options: [String.raw`Windowed sinc`, String.raw`Parks–McClellan / Remez`, String.raw`Bilinear transform`, String.raw`Impulse invariance`], answer: 1, explain: String.raw`Parks–McClellan equalizes ripple across each band (minimax optimal).` },
    { q: String.raw`To make an FIR transition band twice as sharp, the tap count roughly:`, options: [String.raw`Halves`, String.raw`Stays the same`, String.raw`Doubles`, String.raw`Quadruples`], answer: 2, explain: String.raw`$N\propto 1/\Delta f$, so halving $\Delta f$ doubles $N$.` },
    { q: String.raw`Each output sample of an $N$-tap FIR requires:`, options: [String.raw`1 multiply`, String.raw`$N$ multiply-accumulates`, String.raw`$\log_2 N$ multiplies`, String.raw`$N^2$ multiplies`], answer: 1, explain: String.raw`Direct-form FIR does $N$ MACs per output (half with symmetry folding).` },
    { q: String.raw`A Type II linear-phase FIR (symmetric, even length) is forced to have a zero at:`, options: [String.raw`$\omega=0$`, String.raw`$\omega=\pi$`, String.raw`nowhere`, String.raw`$\omega=\pi/2$`], answer: 1, explain: String.raw`Type II has a null at Nyquist, so it cannot implement a high-pass.` },
    { q: String.raw`Where are the poles of an FIR filter's transfer function?`, options: [String.raw`On the unit circle`, String.raw`All at $z=0$`, String.raw`Outside the unit circle`, String.raw`At the zeros`], answer: 1, explain: String.raw`$H(z)$ has denominator $z^{N-1}$, so all poles sit at the origin.` },
    { q: String.raw`Constant group delay is desirable in communications because it:`, options: [String.raw`Increases SNR`, String.raw`Avoids waveform distortion and filter-induced ISI`, String.raw`Reduces the sample rate`, String.raw`Cancels noise`], answer: 1, explain: String.raw`Equal delay for all frequencies preserves pulse shape and prevents inter-symbol interference.` },
    { q: String.raw`The Kaiser $\beta$ parameter primarily trades:`, options: [String.raw`Latency vs cost`, String.raw`Stopband attenuation vs transition width`, String.raw`Sample rate vs bandwidth`, String.raw`Phase vs magnitude`], answer: 1, explain: String.raw`Larger $\beta$ deepens the stopband but widens the transition band.` },
    { q: String.raw`Symmetry folding in an FIR implementation:`, options: [String.raw`Doubles the tap count`, String.raw`Halves the number of multipliers`, String.raw`Adds feedback`, String.raw`Removes linear phase`], answer: 1, explain: String.raw`Adding mirror-image inputs before multiplying uses one multiplier per symmetric pair.` },
    { q: String.raw`Compared with an IIR filter of equal sharpness, an FIR filter typically has:`, options: [String.raw`Fewer taps`, String.raw`More taps but guaranteed stability and linear phase`, String.raw`Nonlinear phase`, String.raw`Unstable behavior`], answer: 1, explain: String.raw`FIR trades higher order/latency for unconditional stability and exact linear phase.` }
  ],
  numericals: [
    { q: String.raw`A 65-tap linear-phase FIR runs at $f_s=1$ MHz. What is its group delay in samples and microseconds?`, solution: String.raw`<p><b>Formula.</b> $$ \tau_g=\frac{N-1}{2}\ \text{samples}=\frac{N-1}{2 f_s}\ \text{seconds} $$ where $N$ is the tap count and $f_s$ the sample rate; for a linear-phase FIR this delay is constant over all frequencies.</p>
<p><b>Substitute.</b> $$ \tau_g=\frac{65-1}{2}=\frac{64}{2}\ \text{samples},\qquad t=\frac{32}{10^6\ \text{Hz}}. $$</p>
<p><b>Compute.</b> $\tau_g=32$ samples $=32/10^6=32\ \mu\text{s}$.</p>
<p><b>Explanation.</b> Every frequency is delayed by exactly 32 samples, so the waveform emerges undistorted 32 µs later. Half the filter length is pure latency — the price of linear phase.</p>` },
    { q: String.raw`Design a low-pass FIR with cutoff $f_c=2$ kHz at $f_s=16$ kHz. Give the first few ideal (unwindowed) tap values around the center.`, solution: String.raw`<p><b>Formula.</b> $$ h[m]=2\frac{f_c}{f_s}\operatorname{sinc}\!\Big(2\tfrac{f_c}{f_s}\,m\Big),\qquad \operatorname{sinc}(x)=\frac{\sin(\pi x)}{\pi x} $$ where $m$ is the tap index measured from the centre.</p>
<p><b>Substitute.</b> $2f_c/f_s=2(2000)/16000=0.25$, so $h[m]=0.25\,\operatorname{sinc}(0.25\,m)$. Evaluate at $m=0,\pm1,\pm2$.</p>
<p><b>Compute.</b> $m=0$: $0.25\,\operatorname{sinc}(0)=0.25$. $m=\pm1$: $0.25\,\operatorname{sinc}(0.25)=0.25\times0.9003=0.225$. $m=\pm2$: $0.25\,\operatorname{sinc}(0.5)=0.25\times0.6366=0.159$.</p>
<p><b>Explanation.</b> These are the ideal (infinite) sinc samples; a real design multiplies them by a window and shifts to be causal. The centre tap $0.25$ equals the fractional cutoff $f_c/f_s\times2$, as expected for the DC gain.</p>` },
    { q: String.raw`Using the Kaiser estimate $N\approx(A-8)/(2.285\,\Delta\omega)+1$, find $N$ for $A=60$ dB and a transition of $\Delta\omega=0.1$ rad/sample.`, solution: String.raw`<p><b>Formula.</b> $$ N\approx\frac{A-8}{2.285\,\Delta\omega}+1 $$ where $A$ is the required stopband attenuation (dB) and $\Delta\omega$ the transition width (rad/sample).</p>
<p><b>Substitute.</b> $$ N\approx\frac{60-8}{2.285\times0.1}+1=\frac{52}{0.2285}+1. $$</p>
<p><b>Compute.</b> $52/0.2285=227.6$, so $N\approx227.6+1\approx229$ taps.</p>
<p><b>Explanation.</b> Roughly 229 taps are needed for a 60 dB stopband and this transition width. Sanity check: $N$ scales linearly with attenuation and inversely with $\Delta\omega$ — deeper or sharper both cost taps.</p>` },
    { q: String.raw`An FIR needs a transition width of 500 Hz. Roughly how many taps if 250 Hz needed 400 taps (same attenuation, same $f_s$)?`, solution: String.raw`<p><b>Formula.</b> $$ N\propto\frac{1}{\Delta f}\ \Rightarrow\ \frac{N_2}{N_1}=\frac{\Delta f_1}{\Delta f_2} $$ where tap count is inversely proportional to transition width $\Delta f$ at fixed attenuation.</p>
<p><b>Substitute.</b> $$ N_2=N_1\frac{\Delta f_1}{\Delta f_2}=400\times\frac{250}{500}. $$</p>
<p><b>Compute.</b> $N_2=400\times0.5=200$ taps.</p>
<p><b>Explanation.</b> Relaxing the transition from 250 Hz to 500 Hz (twice as wide) halves the tap count. Equivalently, sharpening a filter is expensive: halving $\Delta f$ doubles the taps, MACs, and latency.</p>` },
    { q: String.raw`How many multiply-accumulates per second does a 128-tap FIR need at $f_s=10$ MHz, and how many with symmetry folding?`, solution: String.raw`<p><b>Formula.</b> $$ \text{MAC/s}=N\,f_s,\qquad \text{(folded)}\approx\frac{N}{2}f_s $$ where each output needs $N$ multiply-accumulates, halved by symmetry folding for a linear-phase FIR.</p>
<p><b>Substitute.</b> $$ \text{MAC/s}=128\times10^7,\qquad \text{folded}=64\times10^7. $$</p>
<p><b>Compute.</b> Direct: $1.28\times10^9$ MAC/s. Folded: $6.4\times10^8$ MAC/s.</p>
<p><b>Explanation.</b> Over a billion multiplies per second — long FIRs are compute-heavy at high sample rates. Symmetry folding adds the two mirror taps before multiplying, cutting the multiplier count in half.</p>` },
    { q: String.raw`Verify stability: an FIR has taps $[0.5,\,1.2,\,-0.9,\,2.0]$. Is it stable?`, solution: String.raw`<p><b>Formula.</b> $$ \text{BIBO stable}\iff \sum_n|h[n]|<\infty $$ and for an FIR the sum has only $N$ finite terms, so it always converges (all poles at $z=0$).</p>
<p><b>Substitute.</b> $$ \sum_n|h[n]|=|0.5|+|1.2|+|-0.9|+|2.0|. $$</p>
<p><b>Compute.</b> $=0.5+1.2+0.9+2.0=4.6<\infty$.</p>
<p><b>Explanation.</b> Yes — stable, unconditionally. The finite sum is bounded no matter how large the tap values are; FIR stability never depends on coefficient magnitudes, only on the response being finite in length.</p>` },
    { q: String.raw`A symmetric 7-tap FIR has taps $b=[1,2,3,4,3,2,1]$ (unnormalized). Confirm linear phase and give the group delay.`, solution: String.raw`<p><b>Formula.</b> $$ b_k=b_{N-1-k}\ \Rightarrow\ \text{linear phase},\qquad \tau_g=\frac{N-1}{2}\ \text{samples} $$ where symmetry of the taps guarantees a constant group delay.</p>
<p><b>Substitute.</b> Check symmetry: $b_0=b_6=1$, $b_1=b_5=2$, $b_2=b_4=3$, centre $b_3=4$. With $N=7$: $\tau_g=(7-1)/2$.</p>
<p><b>Compute.</b> The taps satisfy $b_k=b_{6-k}$, so the phase is linear; $\tau_g=6/2=3$ samples.</p>
<p><b>Explanation.</b> A symmetric odd-length filter is a Type I linear-phase FIR, delaying every frequency by exactly 3 samples — the centre tap's position. This is precisely why such filters preserve pulse shape.</p>` }
  ],
  realWorld: String.raw`<p>FIR filters dominate wherever waveform fidelity is non-negotiable. In digital modems the transmit <b>pulse-shaping</b> filter (root-raised-cosine) and the receiver's <b>matched filter</b> are linear-phase FIRs, chosen precisely because their constant group delay avoids adding inter-symbol interference. SDR <b>channelizers</b> and polyphase <b>decimation/interpolation</b> filters (e.g. in the digital front-ends of the AD9361 or on RFSoC FPGAs) are FIR, exploiting polyphase structure to run efficiently across sample-rate changes. Half-band FIRs (nearly half the taps are zero) are workhorses for 2:1 rate changes. Audio crossovers and measurement/anti-aliasing filters use linear-phase FIR to keep transients undistorted. The trade-off — many taps for a sharp cut — is accepted in these applications because the alternative (IIR phase distortion) would corrupt the very information the filter is meant to preserve.</p>`,
  related: ['iir-filters', 'convolution', 'sinc-function', 'pulse-shaping', 'matched-filter', 'z-transform']
},
{
  id: 'iir-filters',
  title: 'IIR Filters',
  category: 'Signals & Systems',
  tags: ['IIR', 'recursive', 'poles', 'stability', 'Butterworth', 'Chebyshev', 'elliptic', 'biquad'],
  summary: String.raw`An Infinite Impulse Response filter feeds past outputs back into the computation, giving a recursive difference equation whose transfer function $H(z)=B(z)/A(z)$ has poles that must lie inside the unit circle for stability.`,
  diagram: [
  {
    svg: String.raw`<svg viewBox="0 0 540 185" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-iir-filters" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<text x="30" y="55" fill="#e6edf3" text-anchor="middle">x[n]</text>
<line x1="48" y1="55" x2="196" y2="55" stroke="#9aa7b5" marker-end="url(#arr-iir-filters)"/><text x="120" y="46" fill="#63e6be" text-anchor="middle" font-size="10">Σ bₖ x[n−k]</text>
<circle cx="215" cy="55" r="16" fill="#1c232e" stroke="#ffa94d"/><text x="215" y="60" fill="#e6edf3" text-anchor="middle" font-size="14">Σ</text>
<line x1="231" y1="55" x2="360" y2="55" stroke="#9aa7b5" marker-end="url(#arr-iir-filters)"/>
<rect x="360" y="40" width="80" height="30" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="400" y="60" fill="#e6edf3" text-anchor="middle" font-size="11">output y[n]</text>
<line x1="440" y1="55" x2="510" y2="55" stroke="#9aa7b5" marker-end="url(#arr-iir-filters)"/><text x="500" y="46" fill="#e6edf3" text-anchor="middle">y[n]</text>
<line x1="400" y1="70" x2="400" y2="120" stroke="#b197fc"/>
<rect x="300" y="112" width="60" height="30" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="330" y="132" fill="#e6edf3" text-anchor="middle" font-size="10">z⁻¹ ·aₖ</text>
<line x1="400" y1="127" x2="362" y2="127" stroke="#b197fc"/>
<line x1="300" y1="127" x2="215" y2="127" stroke="#b197fc"/>
<line x1="215" y1="127" x2="215" y2="73" stroke="#b197fc" marker-end="url(#arr-iir-filters)"/>
<text x="255" y="160" fill="#b197fc" text-anchor="middle" font-size="11">feedback loop: −Σ aₖ y[n−k]</text>
<text x="255" y="176" fill="#9aa7b5" text-anchor="middle" font-size="10">poles must lie inside |z|&lt;1 for stability</text>
</svg>`,
    caption: String.raw`IIR structure: feed-forward inputs sum at $\Sigma$, then delayed, scaled past outputs ($z^{-1}\cdot a_k$) are fed back — the feedback loop that gives an infinite response and demands poles inside the unit circle.`,
  },
  {
    title: String.raw`Direct-Form-II biquad: one shared delay line, a/b paths`,
    svg: String.raw`<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-iir-filters" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<text x="24" y="46" fill="#e6edf3" text-anchor="middle">x[n]</text>
<circle cx="120" cy="42" r="14" fill="#1c232e" stroke="#ffa94d"/><text x="120" y="47" fill="#e6edf3" text-anchor="middle" font-size="13">Σ</text>
<line x1="42" y1="42" x2="106" y2="42" stroke="#9aa7b5" marker-end="url(#arr2-iir-filters)"/>
<line x1="134" y1="42" x2="420" y2="42" stroke="#9aa7b5" marker-end="url(#arr2-iir-filters)"/>
<circle cx="440" cy="42" r="14" fill="#1c232e" stroke="#ffa94d"/><text x="440" y="47" fill="#e6edf3" text-anchor="middle" font-size="13">Σ</text>
<line x1="454" y1="42" x2="520" y2="42" stroke="#9aa7b5" marker-end="url(#arr2-iir-filters)"/><text x="512" y="34" fill="#e6edf3" text-anchor="middle">y[n]</text>
<rect x="240" y="74" width="80" height="28" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="280" y="93" fill="#e6edf3" text-anchor="middle" font-size="11">z⁻¹ (w1)</text>
<rect x="240" y="128" width="80" height="28" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="280" y="147" fill="#e6edf3" text-anchor="middle" font-size="11">z⁻¹ (w2)</text>
<line x1="280" y1="42" x2="280" y2="74" stroke="#9aa7b5" marker-end="url(#arr2-iir-filters)"/>
<line x1="280" y1="102" x2="280" y2="128" stroke="#9aa7b5" marker-end="url(#arr2-iir-filters)"/>
<line x1="240" y1="88" x2="150" y2="88" stroke="#b197fc"/><line x1="150" y1="88" x2="150" y2="56" stroke="#b197fc" marker-end="url(#arr2-iir-filters)"/><text x="180" y="84" fill="#b197fc" text-anchor="middle" font-size="10">−a₁</text>
<line x1="320" y1="88" x2="410" y2="88" stroke="#63e6be"/><line x1="410" y1="88" x2="410" y2="56" stroke="#63e6be" marker-end="url(#arr2-iir-filters)"/><text x="372" y="84" fill="#63e6be" text-anchor="middle" font-size="10">b₁</text>
<line x1="240" y1="142" x2="150" y2="142" stroke="#b197fc"/><line x1="150" y1="142" x2="150" y2="100" stroke="#b197fc"/><text x="180" y="138" fill="#b197fc" text-anchor="middle" font-size="10">−a₂</text>
<line x1="320" y1="142" x2="410" y2="142" stroke="#63e6be"/><line x1="410" y1="142" x2="410" y2="100" stroke="#63e6be"/><text x="372" y="138" fill="#63e6be" text-anchor="middle" font-size="10">b₂</text>
<text x="270" y="172" fill="#9aa7b5" text-anchor="middle" font-size="10">feedback (−aₖ, purple) and feed-forward (bₖ, green) share the SAME two delays</text>
</svg>`,
    caption: String.raw`Direct-Form-II biquad internals: a single pair of delay elements (state $w_1,w_2$) is shared between the feedback path (coefficients $-a_1,-a_2$) and the feed-forward path ($b_1,b_2$), minimizing storage — the canonical second-order building block.`,
  },
  {
    title: String.raw`IIR design flow: Butterworth prototype → bilinear → H(z)`,
    svg: String.raw`<svg viewBox="0 0 540 120" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-iir-filters" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9aa7b5"/></marker></defs>
<rect x="6" y="40" width="118" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="65" y="59" fill="#e6edf3" text-anchor="middle" font-size="11">analog prototype</text><text x="65" y="74" fill="#9aa7b5" text-anchor="middle" font-size="10">Butterworth H(s)</text>
<rect x="146" y="40" width="110" height="46" rx="6" fill="#1c232e" stroke="#b197fc"/><text x="201" y="59" fill="#e6edf3" text-anchor="middle" font-size="11">pre-warp edges</text><text x="201" y="74" fill="#9aa7b5" text-anchor="middle" font-size="9">Ω=2/T·tan(ω/2)</text>
<rect x="278" y="40" width="118" height="46" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="337" y="59" fill="#e6edf3" text-anchor="middle" font-size="11">bilinear transform</text><text x="337" y="74" fill="#9aa7b5" text-anchor="middle" font-size="9">s=2/T·(1−z⁻¹)/(1+z⁻¹)</text>
<rect x="418" y="40" width="114" height="46" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="475" y="59" fill="#e6edf3" text-anchor="middle" font-size="11">digital H(z)</text><text x="475" y="74" fill="#9aa7b5" text-anchor="middle" font-size="10">biquad cascade</text>
<line x1="124" y1="63" x2="144" y2="63" stroke="#9aa7b5" marker-end="url(#arr3-iir-filters)"/>
<line x1="256" y1="63" x2="276" y2="63" stroke="#9aa7b5" marker-end="url(#arr3-iir-filters)"/>
<line x1="396" y1="63" x2="416" y2="63" stroke="#9aa7b5" marker-end="url(#arr3-iir-filters)"/>
</svg>`,
    caption: String.raw`Standard IIR design flow: start from a well-studied analog prototype $H(s)$ (e.g. Butterworth), pre-warp the critical band edges, apply the bilinear transform to get $H(z)$, and realize it as a numerically robust biquad cascade.`,
  }
  ],
  prerequisites: ['z-transform', 'laplace-transform', 'fir-filters', 'convolution'],
  intro: String.raw`<p>An <b>Infinite Impulse Response (IIR)</b> filter computes each output from a weighted sum of past <i>inputs</i> <b>and</b> past <i>outputs</i>. That feedback path is the whole story: it lets a handful of coefficients create a response that, in principle, rings on forever — an <i>infinite</i> impulse response. The same feedback that gives IIR its efficiency also gives it its dangers: poles that can escape the unit circle and make the filter unstable, and a phase response that is inherently nonlinear.</p>
<p>The payoff is dramatic economy. A recursive filter of order 4–8 can achieve a transition sharpness that would demand a hundred or more FIR taps. IIR filters are the digital cousins of the classic analog prototypes — <b>Butterworth</b>, <b>Chebyshev</b>, <b>elliptic</b> — and are typically designed by warping an analog design into the digital domain with the <b>bilinear transform</b>. They are implemented as cascades of second-order <b>biquad</b> sections to keep the arithmetic well-conditioned. Choose IIR when computational efficiency, low order, and steep roll-off matter more than exact phase linearity — the mirror image of the FIR trade-off.</p>`,
  sections: [
    { h: 'The recursive difference equation', html: String.raw`<p>The general IIR filter combines feed-forward and feedback terms:</p>
$$ y[n]=\underbrace{\sum_{k=0}^{M} b_k\,x[n-k]}_{\text{feed-forward}}\;-\;\underbrace{\sum_{k=1}^{N} a_k\,y[n-k]}_{\text{feedback}}. $$
<p>The $a_k$ terms feed previous outputs back in. This recursion is what distinguishes IIR from FIR (which has no $a_k$). Because $y[n]$ depends on $y[n-1]$, which depended on $y[n-2]$, and so on, a single input impulse can influence the output indefinitely — the impulse response has, in general, infinite length. By convention $a_0=1$ (the equation is normalized so $y[n]$ has unit coefficient).</p>
<div class="callout"><b>Consequence of feedback:</b> IIR filters cannot be computed by simple convolution of a finite kernel; the recursion must be run sample by sample, and its behavior depends critically on where the feedback places the poles.</div>` },
    { h: 'Transfer function H(z) = B(z)/A(z)', html: String.raw`<p>Taking the $z$-transform of the difference equation gives a <b>rational</b> transfer function — a ratio of two polynomials:</p>
$$ H(z)=\frac{B(z)}{A(z)}=\frac{\sum_{k=0}^{M} b_k z^{-k}}{1+\sum_{k=1}^{N} a_k z^{-k}}=\frac{b_0+b_1 z^{-1}+\cdots+b_M z^{-M}}{1+a_1 z^{-1}+\cdots+a_N z^{-N}}. $$
<p>The <b>zeros</b> are the roots of the numerator $B(z)$ (where the response nulls); the <b>poles</b> are the roots of the denominator $A(z)$ (where it peaks). Unlike an FIR, whose denominator is just $z^{N-1}$ (all poles at the origin), an IIR filter has poles placed anywhere in the $z$-plane. Those pole locations set the resonances, the sharpness of the roll-off, and — crucially — the stability.</p>` },
    { h: 'Poles and stability: the unit circle', html: String.raw`<p>A causal discrete system is stable if and only if <b>every pole lies strictly inside the unit circle</b>, $|p_i|<1$. The reason: each pole contributes a mode $p_i^{\,n}$ to the impulse response. If $|p_i|<1$ that geometric term decays to zero; if $|p_i|=1$ it sustains (marginal); if $|p_i|>1$ it grows without bound and the filter is <b>unstable</b>.</p>
<table class="data">
<tr><th>Pole location</th><th>Impulse-response mode $p^n$</th><th>Result</th></tr>
<tr><td>$|p|<1$ (inside)</td><td>decays</td><td>stable</td></tr>
<tr><td>$|p|=1$ (on circle)</td><td>constant / oscillates forever</td><td>marginally stable</td></tr>
<tr><td>$|p|>1$ (outside)</td><td>grows exponentially</td><td>unstable</td></tr>
</table>
<div class="callout"><b>Why designers fear IIR quantization:</b> rounding the coefficients moves the poles. A pole placed near the unit circle for a sharp resonance can be pushed <i>outside</i> by finite word-length rounding, turning a working filter into an oscillator. This is the practical counterweight to IIR's efficiency, and the reason for biquad cascades and careful scaling.</div>` },
    { h: 'The IIR advantage: far fewer coefficients', html: String.raw`<p>Feedback lets an IIR filter place sharp resonances with very low order. Where an FIR must accumulate many taps to bend its all-zero response steeply, an IIR pole sitting near the unit circle produces a sharp peak "for free." As a rule of thumb, an IIR filter needs roughly <b>an order of magnitude fewer coefficients</b> than an FIR for the same transition sharpness and stopband depth.</p>
<table class="data">
<tr><th>Property</th><th>FIR</th><th>IIR</th></tr>
<tr><td>Feedback</td><td>none</td><td>yes (recursive)</td></tr>
<tr><td>Stability</td><td>always</td><td>only if poles inside unit circle</td></tr>
<tr><td>Phase</td><td>can be exactly linear</td><td>inherently nonlinear</td></tr>
<tr><td>Order for a given sharpness</td><td>high (many taps)</td><td>low (few coefficients)</td></tr>
<tr><td>Latency / group delay</td><td>large, constant</td><td>small, frequency-dependent</td></tr>
<tr><td>Coefficient-quantization risk</td><td>benign (zeros only)</td><td>can destabilize (poles move)</td></tr>
</table>
<p>So the choice is a genuine trade: IIR buys efficiency and low latency at the cost of phase linearity and stability margin.</p>` },
    { h: 'The price: nonlinear phase', html: String.raw`<p>A causal, stable IIR filter <b>cannot</b> have exactly linear phase — that would require a symmetric, and therefore non-causal or unstable, impulse response. Consequently its group delay $\tau_g(\omega)=-d\phi/d\omega$ <i>varies with frequency</i>, and the variation is worst right where it hurts: near the band edges and near sharp poles. Different frequency components are delayed by different amounts, so pulse shapes are smeared (phase distortion / dispersion), which can create inter-symbol interference in data links.</p>
<p>Two remedies: (1) accept it where only the magnitude matters (audio tone controls, anti-alias/anti-image filtering, decimation); or (2) add an <b>all-pass equalizer</b> to flatten the group delay, or run the filter forwards then backwards (<b>zero-phase</b> filtering, e.g. <code>filtfilt</code>) in offline processing, which cancels the phase at the cost of doubling the effective order and requiring the whole signal in memory.</p>` },
    { h: 'Classic prototypes: Butterworth, Chebyshev, elliptic', html: String.raw`<p>IIR designs inherit the well-studied analog prototype families, each a different point on the flatness-vs-sharpness trade curve:</p>
<table class="data">
<tr><th>Prototype</th><th>Passband</th><th>Stopband</th><th>Roll-off for given order</th><th>Notes</th></tr>
<tr><td><b>Butterworth</b></td><td>maximally flat (no ripple)</td><td>monotonic</td><td>gentlest</td><td>smoothest magnitude, best transient behavior</td></tr>
<tr><td><b>Chebyshev I</b></td><td>equiripple</td><td>monotonic</td><td>steeper</td><td>ripple traded for sharper cut</td></tr>
<tr><td><b>Chebyshev II</b></td><td>flat</td><td>equiripple</td><td>steeper</td><td>ripple in stopband instead</td></tr>
<tr><td><b>Elliptic (Cauer)</b></td><td>equiripple</td><td>equiripple</td><td>steepest</td><td>lowest order for a spec; worst phase</td></tr>
<tr><td><b>Bessel</b></td><td>flat</td><td>monotonic</td><td>gentle</td><td>maximally flat group delay (best phase)</td></tr>
</table>
<p>The rule: allowing ripple somewhere buys you a steeper transition for the same order. Elliptic filters are the most efficient (fewest poles) but have the most nonlinear phase; Bessel sacrifices selectivity for the flattest group delay. Butterworth is the safe, smooth default.</p>` },
    { h: 'From analog to digital: the bilinear transform', html: String.raw`<p>The standard route to a digital IIR filter is to design a good analog prototype $H(s)$ and map it to $H(z)$ with the <b>bilinear transform</b>:</p>
$$ s=\frac{2}{T}\,\frac{1-z^{-1}}{1+z^{-1}}. $$
<p>This conformal map sends the entire left half of the $s$-plane (stable analog region) into the interior of the unit circle (stable digital region), so <b>stability is preserved</b>. It also folds the infinite analog frequency axis into the finite digital range $[0,\pi)$, which introduces <b>frequency warping</b>: the relation between analog frequency $\Omega$ and digital frequency $\omega$ is $\Omega=(2/T)\tan(\omega/2)$. Designers <b>pre-warp</b> the critical band edges so they land on target after the mapping. (An alternative, <b>impulse invariance</b>, matches the impulse response but can alias — the bilinear transform avoids aliasing at the cost of warping.)</p>` },
    { h: 'Implementation: biquad (second-order) sections', html: String.raw`<p>A high-order IIR filter is almost never implemented as one big difference equation — the coefficient sensitivity is catastrophic and rounding can destabilize it. Instead it is factored into a <b>cascade of second-order sections</b> ("biquads"), each with its own conjugate pole pair and zero pair:</p>
$$ H(z)=\prod_i \frac{b_{0i}+b_{1i}z^{-1}+b_{2i}z^{-2}}{1+a_{1i}z^{-1}+a_{2i}z^{-2}}. $$
<p>Second-order sections keep each pole pair local, so coefficient quantization moves each pair only slightly and cannot easily push it outside the unit circle. Robust structures such as <b>Direct Form II transposed</b> minimize round-off noise and internal overflow. Ordering and scaling the sections (pairing poles with nearby zeros, sorting by peak gain) further controls dynamic range. This biquad-cascade form is the universal way IIR filters ship in DSP libraries and audio hardware.</p>` },
    { h: 'What you should now understand', html: String.raw`<div class="callout tip"><p>The IIR essentials, and how they mirror the FIR trade-offs:</p>
<ul>
<li><b>IIR uses feedback:</b> $y[n]=\sum_k b_k x[n-k]-\sum_{k\ge1}a_k y[n-k]$, giving a generally infinite impulse response and a rational $H(z)=B(z)/A(z)$.</li>
<li><b>Stability is a pole condition:</b> every pole (root of $A(z)$) must lie strictly inside the unit circle; each pole contributes a mode $p^n$ that decays only if $|p|<1$.</li>
<li><b>The reward is economy</b> — roughly an order of magnitude fewer coefficients than an equivalent FIR — because feedback places sharp poles cheaply.</li>
<li><b>The price is nonlinear phase</b> (frequency-dependent group delay) and the risk that coefficient quantization moves a pole outside the circle.</li>
<li><b>Design by analog prototype:</b> pick Butterworth/Chebyshev/elliptic/Bessel, pre-warp, apply the bilinear transform, and realize as a robust biquad cascade.</li>
<li><b>Why it matters:</b> audio EQ, anti-alias filtering, notch/hum removal, and control compensators use IIR whenever compute and latency are tight and magnitude — not phase — is what counts.</li>
</ul></div>` },
    {
      h: String.raw`Further reading`,
      html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Infinite_impulse_response" target="_blank" rel="noopener">Wikipedia — Infinite impulse response</a> — a solid reference on IIR transfer functions, pole-based stability, and the impulse-invariance and bilinear-transform design methods.</li>
<li><a href="https://www.dspguide.com/ch19.htm" target="_blank" rel="noopener">DSP Guide (Steven Smith) — Ch. 19: Recursive Filters</a> — an intuitive account of single-pole and narrow-band recursive filters, phase response and integer implementation.</li>
<li><a href="https://ccrma.stanford.edu/~jos/fp/" target="_blank" rel="noopener">Stanford CCRMA — Julius Smith, Introduction to Digital Filters</a> — a full online textbook covering recursive filter realizations, pole-zero analysis and the bilinear transform with frequency warping.</li>
<li><a href="https://www.mathworks.com/help/signal/ug/iir-filter-design.html" target="_blank" rel="noopener">MathWorks — IIR Filter Design</a> — an authoritative walkthrough of Butterworth, Chebyshev, elliptic and Bessel prototypes and their digital realization.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`IIR output uses feedback: $y[n]=\sum_k b_k x[n-k]-\sum_{k\ge1} a_k y[n-k]$ — past outputs re-enter the computation.`,
    String.raw`Feedback gives a (generally) infinite-length impulse response and a rational transfer function $H(z)=B(z)/A(z)$.`,
    String.raw`Poles are roots of $A(z)$; stability requires <b>all poles strictly inside the unit circle</b> ($|p|<1$).`,
    String.raw`Each pole contributes a mode $p^n$: decays if $|p|<1$, grows if $|p|>1$ (unstable), sustains if $|p|=1$.`,
    String.raw`IIR achieves the same sharpness as FIR with roughly an order of magnitude fewer coefficients.`,
    String.raw`A causal, stable IIR filter has inherently <b>nonlinear phase</b> (frequency-dependent group delay).`,
    String.raw`Coefficient quantization moves poles and can destabilize a filter — the main practical risk of IIR.`,
    String.raw`Classic prototypes: Butterworth (maximally flat), Chebyshev I/II (equiripple in one band), elliptic (equiripple both, steepest), Bessel (flat group delay).`,
    String.raw`Allowing ripple in a band buys steeper roll-off for the same order.`,
    String.raw`The bilinear transform $s=\tfrac{2}{T}\tfrac{1-z^{-1}}{1+z^{-1}}$ maps analog $H(s)$ to digital $H(z)$, preserving stability but warping frequency (pre-warp the band edges).`,
    String.raw`High-order IIR filters are built as cascaded second-order <b>biquad</b> sections for numerical robustness.`,
    String.raw`Zero-phase filtering (forward+backward, e.g. filtfilt) removes phase distortion offline at double the order.`
  ],
  equations: [
    { title: 'IIR difference equation', tex: String.raw`$$ y[n]=\sum_{k=0}^{M}b_k x[n-k]-\sum_{k=1}^{N}a_k y[n-k] $$`,
      derivation: String.raw`<p><b>Where we start.</b> We want a recursive system: the output depends on recent inputs and on its own recent outputs, so a few coefficients can produce a long-lasting response.</p>
<p><b>Step 1 — start from the transfer function.</b> Let the system be rational, $H(z)=B(z)/A(z)$ with $A(z)=1+\sum_{k=1}^N a_k z^{-k}$ and $B(z)=\sum_{k=0}^M b_k z^{-k}$.</p>
<p><b>Step 2 — write $Y=HX$ and cross-multiply.</b> $$ A(z)\,Y(z)=B(z)\,X(z). $$ Expanding: $$ Y(z)+\sum_{k=1}^N a_k z^{-k}Y(z)=\sum_{k=0}^M b_k z^{-k}X(z). $$</p>
<p><b>Step 3 — inverse-transform.</b> Each $z^{-k}$ is a delay of $k$ samples, so $z^{-k}Y(z)\to y[n-k]$: $$ y[n]+\sum_{k=1}^N a_k y[n-k]=\sum_{k=0}^M b_k x[n-k]. $$</p>
<p><b>Step 4 — solve for $y[n]$.</b> Move the feedback terms to the right: $$ y[n]=\sum_{k=0}^M b_k x[n-k]-\sum_{k=1}^N a_k y[n-k]. $$</p>
<p><b>Result.</b> The recursion computes each output from past inputs and past outputs — the defining IIR structure. The feedback ($a_k$) sum is exactly what an FIR lacks.</p>` },
    { title: 'Rational transfer function', tex: String.raw`$$ H(z)=\frac{B(z)}{A(z)}=\frac{\sum_{k=0}^{M}b_k z^{-k}}{1+\sum_{k=1}^{N}a_k z^{-k}} $$`,
      derivation: String.raw`<p><b>Where we start.</b> Take the IIR difference equation and transform it to find $H(z)=Y(z)/X(z)$.</p>
<p><b>Step 1 — transform term by term.</b> Using linearity and the delay property $\mathcal Z\{y[n-k]\}=z^{-k}Y(z)$:</p>
$$ Y(z)+\sum_{k=1}^N a_k z^{-k}Y(z)=\sum_{k=0}^M b_k z^{-k}X(z). $$
<p><b>Step 2 — factor $Y$ and $X$.</b> $$ Y(z)\Big(1+\sum_{k=1}^N a_k z^{-k}\Big)=X(z)\sum_{k=0}^M b_k z^{-k}. $$</p>
<p><b>Step 3 — divide.</b> $$ H(z)=\frac{Y(z)}{X(z)}=\frac{\sum_{k=0}^M b_k z^{-k}}{1+\sum_{k=1}^N a_k z^{-k}}=\frac{B(z)}{A(z)}. $$</p>
<p><b>Result.</b> $H(z)$ is a ratio of polynomials. Numerator roots are zeros (nulls); denominator roots are poles (resonances). The presence of a nontrivial denominator — poles away from the origin — is what makes the response infinitely long and the stability question nontrivial.</p>` },
    { title: 'Stability condition (poles inside the unit circle)', tex: String.raw`$$ \text{stable} \iff |p_i|<1 \ \text{for every pole } p_i $$`,
      derivation: String.raw`<p><b>Where we start.</b> Expand $H(z)$ in partial fractions over its poles $p_i$ (assume simple poles): $$ H(z)=\sum_i \frac{r_i}{1-p_i z^{-1}}. $$</p>
<p><b>Step 1 — invert each term.</b> The causal inverse $z$-transform of $\dfrac{r_i}{1-p_i z^{-1}}$ is $r_i\,p_i^{\,n}u[n]$. So the impulse response is a sum of geometric modes:</p>
$$ h[n]=\sum_i r_i\,p_i^{\,n},\quad n\ge0. $$
<p><b>Step 2 — apply the BIBO criterion.</b> The system is stable iff $\sum_n|h[n]|<\infty$. For a single mode, $\sum_n|r_i||p_i|^n$ is a geometric series that converges iff $|p_i|<1$.</p>
<p><b>Step 3 — combine.</b> The total is absolutely summable iff <i>every</i> pole satisfies $|p_i|<1$; a single pole with $|p_i|\ge1$ makes a term that fails to decay, so the whole sum diverges.</p>
<p><b>Result.</b> $$ \text{stable}\iff \text{all poles strictly inside the unit circle}. $$ A pole on the circle is marginal (sustained oscillation); outside, the mode $p^n$ blows up. This is why moving a pole by coefficient rounding is dangerous.</p>` },
    { title: 'Bilinear transform', tex: String.raw`$$ s=\frac{2}{T}\frac{1-z^{-1}}{1+z^{-1}}, \qquad \Omega=\frac{2}{T}\tan\!\Big(\frac{\omega}{2}\Big) $$`,
      derivation: String.raw`<p><b>Where we start.</b> We have a good analog design $H(s)$ (Butterworth, elliptic, …) and want a digital $H(z)$ that preserves its shape and stability.</p>
<p><b>Step 1 — approximate the s↔z relation.</b> Exactly, $z=e^{sT}$. A first-order Padé (trapezoidal integration) approximation gives $$ z=e^{sT}\approx\frac{1+sT/2}{1-sT/2}. $$</p>
<p><b>Step 2 — solve for $s$.</b> Rearranging, $$ s=\frac{2}{T}\frac{z-1}{z+1}=\frac{2}{T}\frac{1-z^{-1}}{1+z^{-1}}. $$ Substituting this $s$ into $H(s)$ yields $H(z)$.</p>
<p><b>Step 3 — stability mapping.</b> Set $z=e^{j\omega}$ and simplify: $s=\frac{2}{T}\frac{1-e^{-j\omega}}{1+e^{-j\omega}}=j\frac{2}{T}\tan(\omega/2)$, purely imaginary. So the digital unit circle maps exactly onto the analog $j\Omega$ axis, and the LHP maps to the disk interior — stable stays stable.</p>
<p><b>Step 4 — read off the warping.</b> $\Omega=\frac{2}{T}\tan(\omega/2)$. The analog frequency axis $(0,\infty)$ compresses into $\omega\in(0,\pi)$ — nonlinear <b>frequency warping</b>. Pre-warping a critical edge means setting the analog design frequency to $\Omega_c=\frac{2}{T}\tan(\omega_c/2)$ so it lands correctly.</p>
<p><b>Result.</b> A one-to-one, stability-preserving, alias-free map from $H(s)$ to $H(z)$, at the cost of frequency warping that is corrected by pre-warping the band edges.</p>` },
    { title: 'Second-order (biquad) section', tex: String.raw`$$ H_i(z)=\frac{b_{0}+b_{1}z^{-1}+b_{2}z^{-2}}{1+a_{1}z^{-1}+a_{2}z^{-2}} $$`,
      derivation: String.raw`<p><b>Where we start.</b> A high-order $H(z)=B(z)/A(z)$ whose poles and zeros are complex; direct implementation is numerically fragile.</p>
<p><b>Step 1 — factor into conjugate pairs.</b> Real-coefficient polynomials have roots that are real or in complex-conjugate pairs. Group each conjugate pole pair (and a zero pair) into a quadratic with <i>real</i> coefficients: a pair $p,\bar p$ gives denominator $(1-pz^{-1})(1-\bar p z^{-1})=1+a_1 z^{-1}+a_2 z^{-2}$ with $a_1=-2\operatorname{Re}(p)$, $a_2=|p|^2$.</p>
<p><b>Step 2 — cascade the sections.</b> $$ H(z)=\prod_i H_i(z)=\prod_i\frac{b_{0i}+b_{1i}z^{-1}+b_{2i}z^{-2}}{1+a_{1i}z^{-1}+a_{2i}z^{-2}}. $$ Cascading multiplies the transfer functions, reproducing the original $H(z)$.</p>
<p><b>Step 3 — why it helps.</b> In a biquad, coefficient rounding perturbs only one local pole pair, moving it slightly; the pole cannot easily cross the unit circle. In the monolithic form, every coefficient couples to every root, so tiny errors cause huge pole movement (Wilkinson's ill-conditioning).</p>
<p><b>Result.</b> $$ H(z)=\prod_i H_i(z). $$ The biquad cascade is the numerically robust, universally used realization of IIR filters.</p>` },
    { title: 'Group delay is non-constant', tex: String.raw`$$ \tau_g(\omega)=-\frac{d}{d\omega}\arg H(e^{j\omega})\neq \text{const} $$`,
      derivation: String.raw`<p><b>Where we start.</b> We ask whether a causal, stable IIR filter can have constant group delay (linear phase).</p>
<p><b>Step 1 — linear phase demands symmetry.</b> Exactly linear phase requires an impulse response symmetric about its midpoint, $h[n]=\pm h[N-1-n]$.</p>
<p><b>Step 2 — symmetry is incompatible with a finite-pole causal filter.</b> A symmetric impulse response either is finite in length (which makes the filter FIR, not IIR) or extends symmetrically to $n<0$ (non-causal). Equivalently, symmetry forces zeros in reciprocal pairs $z$ and $1/z$, and matching that with a stable causal all-pole part is impossible without cancelling the recursion.</p>
<p><b>Step 3 — therefore the phase curves.</b> With poles at nonzero locations, $\arg H(e^{j\omega})$ bends, most steeply near the poles. Differentiating a nonlinear phase gives a frequency-dependent delay:</p>
$$ \tau_g(\omega)=-\frac{d\phi}{d\omega}, \quad \text{varying with } \omega. $$
<p><b>Result.</b> A causal, stable IIR filter necessarily has nonlinear phase and dispersive (frequency-dependent) group delay — the fundamental price for its efficiency. All-pass equalization or forward–backward filtering can compensate it.</p>` }
  ],
  flashcards: [
    { front: String.raw`Write the IIR difference equation.`, back: String.raw`$y[n]=\sum_{k=0}^{M}b_k x[n-k]-\sum_{k=1}^{N}a_k y[n-k]$ — feed-forward inputs plus feedback of past outputs.` },
    { front: String.raw`What makes an IIR filter's response "infinite"?`, back: String.raw`Feedback: $y[n]$ depends on past outputs, so a single impulse can influence the output forever.` },
    { front: String.raw`Give the IIR transfer function form.`, back: String.raw`$H(z)=B(z)/A(z)=\dfrac{\sum b_k z^{-k}}{1+\sum a_k z^{-k}}$ — a ratio of polynomials (rational).` },
    { front: String.raw`Stability condition for a causal IIR filter?`, back: String.raw`All poles (roots of $A(z)$) must lie strictly inside the unit circle, $|p_i|<1$.` },
    { front: String.raw`What does each pole contribute to the impulse response?`, back: String.raw`A mode $p^n$: decays if $|p|<1$ (stable), grows if $|p|>1$ (unstable), sustains if $|p|=1$ (marginal).` },
    { front: String.raw`Main efficiency advantage of IIR over FIR?`, back: String.raw`It reaches the same transition sharpness with roughly 10× fewer coefficients (feedback places sharp poles cheaply).` },
    { front: String.raw`Main disadvantage of IIR?`, back: String.raw`Inherently nonlinear phase (frequency-dependent group delay) and possible instability if poles move.` },
    { front: String.raw`Why can't a causal, stable IIR filter have exactly linear phase?`, back: String.raw`Linear phase needs a symmetric impulse response, which is non-causal or FIR — incompatible with a stable all-pole recursion.` },
    { front: String.raw`Butterworth filter characteristic?`, back: String.raw`Maximally flat passband, monotonic stopband, gentlest roll-off — smoothest magnitude response.` },
    { front: String.raw`Elliptic (Cauer) filter characteristic?`, back: String.raw`Equiripple in both passband and stopband; steepest roll-off / lowest order for a spec, but worst phase.` },
    { front: String.raw`What does the bilinear transform do?`, back: String.raw`Maps analog $H(s)$ to digital $H(z)$ via $s=\tfrac{2}{T}\tfrac{1-z^{-1}}{1+z^{-1}}$, preserving stability but warping frequency.` },
    { front: String.raw`What is frequency pre-warping?`, back: String.raw`Adjusting the analog band edges to $\Omega=\tfrac{2}{T}\tan(\omega/2)$ so they land on the target digital frequencies after the bilinear map.` },
    { front: String.raw`What is a biquad?`, back: String.raw`A second-order IIR section; high-order filters are built as cascades of biquads for numerical robustness.` },
    { front: String.raw`Why cascade biquads instead of one big filter?`, back: String.raw`Coefficient rounding then perturbs only a local pole pair; the monolithic form is ill-conditioned and can be pushed unstable.` },
    { front: String.raw`How does zero-phase (filtfilt) filtering work?`, back: String.raw`Filter forward then backward; the phase cancels, giving zero net phase distortion at double the order (offline only).` }
  ],
  mcqs: [
    { q: String.raw`What distinguishes an IIR filter from an FIR filter?`, options: [String.raw`It has more taps`, String.raw`It feeds back past outputs (recursion)`, String.raw`It is always linear phase`, String.raw`It uses no multiplies`], answer: 1, explain: String.raw`The feedback terms $-\sum a_k y[n-k]$ make it recursive, giving an infinite impulse response.` },
    { q: String.raw`An IIR transfer function has the form:`, options: [String.raw`$H(z)=\sum b_k z^{-k}$ only`, String.raw`$H(z)=B(z)/A(z)$, a ratio of polynomials`, String.raw`$H(z)=z^{-N}$`, String.raw`$H(z)=1$`], answer: 1, explain: String.raw`The feedback denominator $A(z)$ makes the transfer function rational.` },
    { q: String.raw`A causal IIR filter is stable if and only if:`, options: [String.raw`All zeros are inside the unit circle`, String.raw`All poles are inside the unit circle`, String.raw`All poles are on the unit circle`, String.raw`It has an even order`], answer: 1, explain: String.raw`Each pole gives a mode $p^n$; it decays only if $|p|<1$.` },
    { q: String.raw`A pole at $|p|=1.05$ produces:`, options: [String.raw`A decaying response`, String.raw`A stable filter`, String.raw`An unstable (growing) response`, String.raw`Linear phase`], answer: 2, explain: String.raw`$|p|>1$ makes $p^n$ grow without bound — the filter is unstable.` },
    { q: String.raw`Compared with an FIR of equal sharpness, an IIR filter needs:`, options: [String.raw`Far more coefficients`, String.raw`About the same`, String.raw`Roughly 10× fewer coefficients`, String.raw`Exactly twice as many`], answer: 2, explain: String.raw`Feedback places sharp poles cheaply, so IIR order is much lower.` },
    { q: String.raw`A causal, stable IIR filter's phase is:`, options: [String.raw`Always exactly linear`, String.raw`Inherently nonlinear`, String.raw`Always zero`, String.raw`Constant`], answer: 1, explain: String.raw`Linear phase needs a symmetric (non-causal/FIR) impulse response, impossible for a stable all-pole recursion.` },
    { q: String.raw`Which prototype has a maximally flat passband?`, options: [String.raw`Chebyshev I`, String.raw`Elliptic`, String.raw`Butterworth`, String.raw`Chebyshev II`], answer: 2, explain: String.raw`Butterworth is maximally flat with no passband ripple, at the cost of a gentler roll-off.` },
    { q: String.raw`Which prototype gives the steepest roll-off for a given order?`, options: [String.raw`Butterworth`, String.raw`Bessel`, String.raw`Elliptic (Cauer)`, String.raw`Moving average`], answer: 2, explain: String.raw`Elliptic filters ripple in both bands, achieving the sharpest transition (lowest order).` },
    { q: String.raw`The bilinear transform substitutes:`, options: [String.raw`$s=z^{-1}$`, String.raw`$s=\tfrac{2}{T}\tfrac{1-z^{-1}}{1+z^{-1}}$`, String.raw`$z=e^{-sT}$ only`, String.raw`$s=1/z$`], answer: 1, explain: String.raw`This maps the analog LHP to the unit disk, preserving stability while warping frequency.` },
    { q: String.raw`Frequency pre-warping is needed because the bilinear transform:`, options: [String.raw`Causes aliasing`, String.raw`Warps the frequency axis nonlinearly`, String.raw`Adds delay`, String.raw`Moves the poles outside`], answer: 1, explain: String.raw`$\Omega=\tfrac{2}{T}\tan(\omega/2)$ is nonlinear, so band edges are pre-distorted to land correctly.` },
    { q: String.raw`High-order IIR filters are implemented as:`, options: [String.raw`One large difference equation`, String.raw`Cascaded second-order biquad sections`, String.raw`FIR approximations`, String.raw`Lookup tables`], answer: 1, explain: String.raw`Biquad cascades localize coefficient sensitivity and keep the filter numerically stable.` },
    { q: String.raw`The chief practical danger when quantizing IIR coefficients is:`, options: [String.raw`Loss of linear phase`, String.raw`Poles moving outside the unit circle → instability`, String.raw`Increased latency`, String.raw`Higher sample rate`], answer: 1, explain: String.raw`Rounding shifts pole locations; a near-circle pole can cross it and the filter oscillates.` },
    { q: String.raw`Zero-phase filtering (e.g. filtfilt) achieves linear/zero phase by:`, options: [String.raw`Using only FIR taps`, String.raw`Filtering forward then backward`, String.raw`Doubling the sample rate`, String.raw`Removing all poles`], answer: 1, explain: String.raw`Forward+reverse passes cancel the phase; it doubles the order and needs the whole signal (offline).` },
    { q: String.raw`Which filter has the flattest (most constant) group delay?`, options: [String.raw`Elliptic`, String.raw`Chebyshev I`, String.raw`Bessel`, String.raw`Chebyshev II`], answer: 2, explain: String.raw`The Bessel prototype is designed for maximally flat group delay (best phase behavior).` },
    { q: String.raw`In $H(z)=B(z)/A(z)$, the poles are:`, options: [String.raw`Roots of $B(z)$`, String.raw`Roots of $A(z)$`, String.raw`Always at $z=0$`, String.raw`On the unit circle`], answer: 1, explain: String.raw`Poles are denominator roots; zeros are numerator roots. FIR (denominator $z^{N-1}$) puts all poles at the origin.` }
  ],
  numericals: [
    { q: String.raw`A first-order IIR filter is $y[n]=x[n]+0.9\,y[n-1]$. Find its pole and state whether it is stable.`, solution: String.raw`<p><b>Formula.</b> $$ H(z)=\frac{1}{1-a\,z^{-1}},\qquad \text{pole at }z=a,\quad \text{stable}\iff|a|<1 $$ where $a$ is the feedback coefficient.</p>
<p><b>Substitute.</b> Here $a=0.9$, so $H(z)=\dfrac{1}{1-0.9z^{-1}}$ with a pole at $z=0.9$.</p>
<p><b>Compute.</b> $|0.9|<1$, so the filter is <b>stable</b>; its impulse response is $h[n]=0.9^{\,n}u[n]$.</p>
<p><b>Explanation.</b> The pole sits inside the unit circle, so the mode $0.9^n$ decays geometrically to zero. This is the classic one-pole leaky integrator / low-pass smoother.</p>` },
    { q: String.raw`For $y[n]=x[n]+1.2\,y[n-1]$, is the filter stable? What is the impulse response?`, solution: String.raw`<p><b>Formula.</b> $$ H(z)=\frac{1}{1-a\,z^{-1}},\qquad h[n]=a^{\,n}u[n],\quad \text{stable}\iff|a|<1 $$ with feedback coefficient $a$.</p>
<p><b>Substitute.</b> Here $a=1.2$, giving a pole at $z=1.2$ and $h[n]=1.2^{\,n}u[n]$.</p>
<p><b>Compute.</b> $|1.2|>1$, so the filter is <b>unstable</b>; $h[n]=1.2^{\,n}u[n]$ grows without bound.</p>
<p><b>Explanation.</b> A pole outside the unit circle makes the mode $1.2^n$ blow up, so any nonzero input drives the output to infinity. This is exactly the failure that coefficient rounding can trigger by nudging a near-circle pole outward.</p>` },
    { q: String.raw`A conjugate pole pair sits at radius $r=0.95$, angle $\theta=\pi/4$. Give the biquad denominator coefficients $a_1,a_2$.`, solution: String.raw`<p><b>Formula.</b> $$ a_1=-2r\cos\theta,\qquad a_2=r^2 $$ for a conjugate pole pair at radius $r$ and angle $\theta$, giving denominator $1+a_1 z^{-1}+a_2 z^{-2}$.</p>
<p><b>Substitute.</b> $$ a_1=-2(0.95)\cos(\pi/4)=-2(0.95)(0.7071),\qquad a_2=(0.95)^2. $$</p>
<p><b>Compute.</b> $a_1=-1.343$ and $a_2=0.9025$, so the denominator is $1-1.343z^{-1}+0.9025z^{-2}$.</p>
<p><b>Explanation.</b> Since $r=0.95<1$ the pair is inside the unit circle, so the biquad is stable. Note $a_2=r^2=|p|^2$ directly reads off the pole radius — a quick stability check on any biquad.</p>` },
    { q: String.raw`Pre-warp a digital cutoff of $\omega_c=0.2\pi$ for a bilinear design with $T=1$. Find the analog design frequency $\Omega_c$.`, solution: String.raw`<p><b>Formula.</b> $$ \Omega_c=\frac{2}{T}\tan\!\Big(\frac{\omega_c}{2}\Big) $$ the pre-warp relation that corrects the bilinear transform's frequency warping, where $T$ is the sample period.</p>
<p><b>Substitute.</b> $$ \Omega_c=\frac{2}{1}\tan\!\Big(\frac{0.2\pi}{2}\Big)=2\tan(0.1\pi). $$</p>
<p><b>Compute.</b> $0.1\pi=18^\circ$ and $\tan(18^\circ)=0.3249$, so $\Omega_c=2(0.3249)=0.6498$ rad/s.</p>
<p><b>Explanation.</b> Designing the analog prototype at $\Omega_c=0.6498$ rad/s makes the digital cutoff land exactly at $0.2\pi$ after the bilinear map. Skipping the pre-warp would place the cutoff at the wrong frequency.</p>` },
    { q: String.raw`A 6th-order elliptic IIR is factored into biquads. How many second-order sections are needed?`, solution: String.raw`<p><b>Formula.</b> $$ \text{sections}=\frac{\text{order}}{2} $$ since each biquad realizes one conjugate pole pair (a second-order section).</p>
<p><b>Substitute.</b> $$ \text{sections}=\frac{6}{2}. $$</p>
<p><b>Compute.</b> $=3$ biquad sections.</p>
<p><b>Explanation.</b> Three cascaded second-order stages handle the six poles (three conjugate pairs). Cascading biquads localizes coefficient sensitivity so rounding cannot easily push any pole outside the unit circle.</p>` },
    { q: String.raw`Roughly compare coefficient counts: an FIR needs 120 taps for a spec that a Butterworth IIR meets at order 8. State the multiply saving per sample (direct forms).`, solution: String.raw`<p><b>Formula.</b> $$ \text{FIR MACs}\approx N,\qquad \text{IIR MACs}\approx 5\times\frac{\text{order}}{2} $$ where a direct-form FIR does $N$ MACs and each biquad does about 5 MACs.</p>
<p><b>Substitute.</b> FIR: $\approx120$ MACs/sample. IIR order 8 $=4$ biquads: $4\times5=20$ MACs/sample.</p>
<p><b>Compute.</b> Saving $=120/20=6\times$ fewer multiplies per sample.</p>
<p><b>Explanation.</b> Feedback lets the IIR meet the same spec with roughly six times less arithmetic, plus far lower latency. The trade paid for it is nonlinear phase and the need to guard pole placement against quantization.</p>` },
    { q: String.raw`An IIR filter has poles at $z=0.8$ and $z=-0.6$ and a zero at $z=1$. Write $H(z)$ (gain 1 at DC-normalizable) and confirm stability.`, solution: String.raw`<p><b>Formula.</b> $$ H(z)=\frac{\prod_i(1-z_i z^{-1})}{\prod_k(1-p_k z^{-1})},\qquad \text{stable}\iff|p_k|<1 $$ built from zeros $z_i$ and poles $p_k$.</p>
<p><b>Substitute.</b> With zero at $z=1$ and poles at $0.8,-0.6$: $$ H(z)=\frac{1-z^{-1}}{(1-0.8z^{-1})(1+0.6z^{-1})}. $$</p>
<p><b>Compute.</b> Expanding the denominator: $(1-0.8z^{-1})(1+0.6z^{-1})=1-0.2z^{-1}-0.48z^{-2}$, so $H(z)=\dfrac{1-z^{-1}}{1-0.2z^{-1}-0.48z^{-2}}$. Both poles ($0.8$ and $-0.6$) have magnitude $<1$, so it is <b>stable</b>.</p>
<p><b>Explanation.</b> The zero at $z=1$ forces a null at DC ($\omega=0$), giving a high-pass character — a one-line way to build a DC blocker. Stability follows directly because every pole lies inside the unit circle.</p>` }
  ],
  realWorld: String.raw`<p>IIR filters are the efficient workhorses wherever compute and latency are tight and phase linearity is not sacred. Audio equalizers, tone controls, crossovers, and the biquad banks in every DAW and codec are IIR — a parametric EQ band is a single biquad. In RF and instrumentation, IIR filters implement steep anti-alias and anti-image filtering, DC blocking (a one-pole high-pass), and narrow resonant/notch filters (e.g. removing 50/60 Hz hum) with just a couple of coefficients. Control systems use IIR structures for PID and lead-lag compensators. Their low order means low delay, which matters in real-time feedback loops and active noise cancellation. The catch — nonlinear phase — is why data-communication pulse shaping and matched filtering stay with FIR, while magnitude-only tasks happily use IIR. In fixed-point DSP and FPGA/ASIC designs, IIR filters ship as scaled Direct-Form-II-transposed biquad cascades to guard against the pole-migration instability that finite word lengths would otherwise cause.</p>`,
  related: ['fir-filters', 'z-transform', 'laplace-transform', 'convolution', 'frequency-spectrum']
}
);
