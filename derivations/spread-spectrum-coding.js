// From-scratch derivations for the "Spread Spectrum & Coding" category.
Object.assign(CONTENT_DERIV, {
  'dsss': {
    0: String.raw`
<p><b>Where we start.</b> In a direct-sequence system the information bit lasts a time $T_b$, so the data rate is $R_b = 1/T_b$. We multiply the data waveform by a pseudorandom "chip" waveform whose smallest unit — the chip — lasts $T_c$, giving a chip rate $R_c = 1/T_c$. We want the spreading factor $N$: how many chips are packed into one bit.</p>

<p><b>Step 1 — Line up one bit against the chips.</b> By design the code is synchronized to the data so that an integer number of chips fits exactly inside one bit interval:</p>
$$ T_b = N\,T_c. $$
<p>This is the defining relationship of DSSS — a bit is chopped into $N$ equal pieces, each stamped with one chip $\pm 1$.</p>

<p><b>Step 2 — Convert the time picture into a rate picture.</b> Take reciprocals of $T_b = N T_c$:</p>
$$ \frac{1}{T_b} = \frac{1}{N T_c} \;\Longrightarrow\; R_b = \frac{R_c}{N}. $$

<p><b>Step 3 — Solve for $N$.</b> Rearranging,</p>
$$ N = \frac{R_c}{R_b} = \frac{1/T_c}{1/T_b} = \frac{T_b}{T_c}. $$

<p><b>Result.</b> $$ \boxed{\,N = \frac{R_c}{R_b} = \frac{T_b}{T_c}\,} $$ The spreading factor is just "chips per bit." Intuition/sanity check: if each bit is 1 ms and each chip is 1 $\mu$s, then $N=1000$ chips ride on every bit — the transmitted bandwidth balloons by $\sim 1000\times$ while the information rate is unchanged.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Bandwidth of a digital waveform scales with its symbol rate: a stream of rectangular pulses at rate $R$ occupies a null-to-null bandwidth $\approx R$ (or $2R$ for a two-sided count — the constant cancels in the ratio). So the <i>data</i> waveform occupies $B_{data} \propto R_b$ and the <i>chip</i> (spread) waveform occupies $B_{ss} \propto R_c$.</p>

<p><b>Step 1 — Form the bandwidth ratio.</b> Because both bandwidths use the same proportionality constant, the constant cancels:</p>
$$ \frac{B_{ss}}{B_{data}} = \frac{k\,R_c}{k\,R_b} = \frac{R_c}{R_b} = N. $$
<p>The bandwidth expansion equals the spreading factor derived above.</p>

<p><b>Step 2 — Define processing gain as this ratio, in decibels.</b> Processing gain measures how much wider the transmitted band is than the information band. Converting a power-like ratio to dB uses $10\log_{10}(\cdot)$:</p>
$$ G_p \;=\; 10\log_{10}\!\left(\frac{B_{ss}}{B_{data}}\right). $$

<p><b>Step 3 — Substitute the ratio.</b> Since $B_{ss}/B_{data} \approx N$,</p>
$$ G_p \approx 10\log_{10} N. $$

<p><b>Result.</b> $$ \boxed{\,G_p = 10\log_{10}\!\left(\frac{B_{ss}}{B_{data}}\right) \approx 10\log_{10} N\,} $$ Intuition/sanity check: $N=1000 \Rightarrow G_p \approx 30$ dB. Every factor-of-10 in spreading buys 10 dB of gain against narrowband interference — the "$\times 10 \to +10\,$dB" rule of decibels.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> The transmitter sends the product of data $d(t)\in\{\pm1\}$ and the code $c(t)\in\{\pm1\}$. After the channel adds noise/interference $n(t)$, the receiver has</p>
$$ r(t) = d(t)\,c(t) + n(t). $$
<p>To despread, the receiver multiplies by a locally generated, time-aligned copy of the <i>same</i> code $c(t)$.</p>

<p><b>Step 1 — Multiply the received signal by the code.</b></p>
$$ r(t)\,c(t) = \big[d(t)c(t) + n(t)\big]c(t) = d(t)\,c^2(t) + n(t)\,c(t). $$

<p><b>Step 2 — Use the key property of a $\pm 1$ code.</b> Since every chip is $\pm 1$, squaring it gives $+1$ at every instant:</p>
$$ c^2(t) = \big(\pm 1\big)^2 = 1 \quad\text{for all }t. $$
<p>This is the algebraic heart of despreading: the code is its own "undo" operation.</p>

<p><b>Step 3 — Collapse the signal term.</b></p>
$$ d(t)\,c^2(t) = d(t)\cdot 1 = d(t). $$
<p>The wideband signal snaps back to the narrow data waveform, while the interference $n(t)c(t)$ — uncorrelated with the code — gets multiplied by a $\pm1$ pattern and is <i>spread</i> across the wide band.</p>

<p><b>Result.</b> $$ \boxed{\,r(t)\,c(t) = d(t)\,c^2(t) + n(t)\,c(t) = d(t) + n(t)\,c(t)\,} $$ Intuition/sanity check: despreading recovers $d(t)$ exactly (noiseless case). The follow-on narrowband filter keeps all of $d(t)$'s power but only the $1/N$ slice of the now-spread interference — that fraction rejected is exactly the processing gain.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> After despreading, the demodulator needs a certain quality, expressed as a required $\left(E_b/N_0\right)_{req}$, to hit its target error rate. Processing gain $G_p$ (in dB) is the head-start the spreading gives us against a jammer. Real hardware also wastes some margin through implementation losses $L_{sys}$.</p>

<p><b>Step 1 — Account for what the gain must pay for.</b> The gain budget, in dB, must first cover the demodulator's appetite for SNR and the system's losses. Whatever is left over is the safety cushion against jamming:</p>
$$ \text{(available gain)} - \text{(demod need)} - \text{(losses)} = \text{margin}. $$

<p><b>Step 2 — Write it symbolically.</b></p>
$$ M_j = G_p - \left(\frac{E_b}{N_0}\right)_{req} - L_{sys}. $$

<p><b>Step 3 — Interpret the margin.</b> $M_j$ is the maximum jammer-to-signal ratio (in dB) the link can tolerate before the demodulator drops below its required $E_b/N_0$. If a jammer arrives $M_j$ dB stronger than our signal, the link is exactly at threshold; stronger than that, it breaks.</p>

<p><b>Result.</b> $$ \boxed{\,M_j = G_p - \left(\frac{E_b}{N_0}\right)_{req} - L_{sys}\ \ [\text{dB}]\,} $$ Intuition/sanity check: with $G_p=30$ dB, a demod needing $7$ dB, and $2$ dB of losses, $M_j = 21$ dB — the jammer can be $\sim 126\times$ our received power and we still close the link.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> From the despreading identity, the wanted signal keeps all its power while broadband interference is spread over the whole $B_{ss}$ and only a $B_{data}/B_{ss}=1/N$ fraction survives the post-correlator filter. Let $\mathrm{SINR}_{in}=S/I$ be the ratio at the correlator input (in the wide band).</p>

<p><b>Step 1 — Track the signal.</b> Despreading is coherent for the wanted signal: its power is preserved, $S_{out}=S_{in}$.</p>

<p><b>Step 2 — Track the interference.</b> The interference power that lands inside the narrow output band is reduced by the ratio of bandwidths:</p>
$$ I_{out} = I_{in}\cdot\frac{B_{data}}{B_{ss}} = \frac{I_{in}}{N}. $$

<p><b>Step 3 — Form the output SINR.</b></p>
$$ \mathrm{SINR}_{out} = \frac{S_{out}}{I_{out}} = \frac{S_{in}}{I_{in}/N} = N\cdot\frac{S_{in}}{I_{in}} = N\cdot\mathrm{SINR}_{in} = G_p\cdot \mathrm{SINR}_{in}. $$

<p><b>Step 4 — Express the improvement in dB.</b> Taking $10\log_{10}$ of the multiplicative factor $N$:</p>
$$ \Delta\ \text{dB} = 10\log_{10} N. $$

<p><b>Result.</b> $$ \boxed{\,\mathrm{SINR}_{out} = G_p\cdot \mathrm{SINR}_{in} \quad\Rightarrow\quad \Delta\ \text{dB} = 10\log_{10}N\,} $$ Intuition/sanity check: the receiver's SINR improves by exactly the processing gain — the correlator is a "matched filter" that coherently gathers the code energy while incoherent interference averages away by $1/N$.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> In a single CDMA cell, $K$ users share the band using different codes. For any one receiver, the other $K-1$ users look like interference. Assume perfect power control so all users arrive at power $S$; then interference power is $I=(K-1)S$.</p>

<p><b>Step 1 — Post-despread energy per bit vs interference density.</b> After despreading, the wanted signal's $E_b/N_0$ equals its post-correlator SINR. The interference is spread and reduced by the processing gain, so effectively</p>
$$ \frac{E_b}{N_0} \;\approx\; \frac{S}{I}\cdot G_p = \frac{S}{(K-1)S}\,G_p = \frac{G_p}{K-1}. $$
<p>Physically: our one signal enjoys the full gain $G_p$ against the pooled interference of the other $K-1$ users.</p>

<p><b>Step 2 — Solve for the number of users.</b> Set the delivered $E_b/N_0$ equal to what the demodulator requires, $\left(E_b/N_0\right)_{req}$, and invert:</p>
$$ \left(\frac{E_b}{N_0}\right)_{req} = \frac{G_p}{K-1} \;\Longrightarrow\; K-1 = \frac{G_p}{(E_b/N_0)_{req}}. $$

<p><b>Step 3 — Add back the user itself.</b></p>
$$ K \approx 1 + \frac{G_p}{(E_b/N_0)_{req}}. $$

<p><b>Result.</b> $$ \boxed{\,\frac{E_b}{N_0} \approx \frac{G_p}{K-1} \quad\Rightarrow\quad K \approx 1 + \frac{G_p}{(E_b/N_0)_{req}}\,} $$ Intuition/sanity check: more processing gain (wider spreading) directly buys more simultaneous users; a hungrier demod (higher required $E_b/N_0$) reduces them. CDMA is "interference-limited," not noise-limited.</p>
`,
    6: String.raw`
<p><b>Where we start.</b> The GPS C/A signal spreads a $50$ bit/s navigation message with a $1.023$ Mchip/s spreading code. Processing gain is $10\log_{10}$ of the ratio of these two rates (chip rate over data rate).</p>

<p><b>Step 1 — Plug the two rates into $G_p = 10\log_{10}(R_c/R_b)$.</b></p>
$$ G_p = 10\log_{10}\!\left(\frac{1.023\times 10^{6}}{50}\right). $$

<p><b>Step 2 — Evaluate the ratio.</b></p>
$$ \frac{1.023\times 10^{6}}{50} = 2.046\times 10^{4} \approx 20460. $$

<p><b>Step 3 — Convert to dB.</b> Since $\log_{10}(20460)\approx 4.311$,</p>
$$ G_p \approx 10\times 4.311 \approx 43.1\ \text{dB}. $$

<p><b>Result.</b> $$ \boxed{\,G_p = 10\log_{10}\!\left(\frac{1.023\times 10^6}{50}\right) \approx 43\ \text{dB}\,} $$ Intuition/sanity check: $\sim 43$ dB is why GPS works even though the received signal sits far below the thermal-noise floor at the antenna — despreading lifts it $\sim 43$ dB above where wideband noise ends up.</p>
`
  },
  'frequency-hopping': {
    0: String.raw`
<p><b>Where we start.</b> In frequency hopping the carrier jumps to a new frequency at a fixed hop <i>rate</i> $R_h$ (hops per second). The time the transmitter spends parked on one frequency before jumping is called the dwell time $T_d$.</p>

<p><b>Step 1 — Rate is events per unit time; dwell is time per event.</b> If $R_h$ hops occur each second, then each hop occupies an equal slice of that second:</p>
$$ T_d = \frac{1\ \text{second}}{R_h\ \text{hops}} = \frac{1}{R_h}. $$
<p>This is the same reciprocal relationship as period $=1/$frequency.</p>

<p><b>Result.</b> $$ \boxed{\,T_d = \frac{1}{R_h}\,} $$ Intuition/sanity check: a $1000$ hop/s system dwells $1$ ms per frequency. Faster hopping $\Rightarrow$ shorter dwell $\Rightarrow$ harder for a jammer to find and hit the current channel in time.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> An FH system has $M$ available hop channels, each of instantaneous bandwidth $B_{inst}$. Collectively they span the total spread bandwidth $W_{ss}$. Because the channels tile the band with (approximately) no overlap and no gaps,</p>
$$ W_{ss} \approx M\cdot B_{inst}. $$

<p><b>Step 1 — Processing gain is the ratio of spread band to instantaneous band.</b> At any instant the receiver listens in just one $B_{inst}$-wide slot, but the signal energy is smeared across all of $W_{ss}$ over time. The gain against a fixed narrowband threat is</p>
$$ G_p \approx \frac{W_{ss}}{B_{inst}}. $$

<p><b>Step 2 — Substitute $W_{ss}\approx M\,B_{inst}$.</b></p>
$$ G_p \approx \frac{M\,B_{inst}}{B_{inst}} = M. $$
<p>So the processing gain is simply the <i>number of hop channels</i>.</p>

<p><b>Step 3 — Express in dB.</b></p>
$$ G_p[\text{dB}] = 10\log_{10} M. $$

<p><b>Result.</b> $$ \boxed{\,G_p \approx \frac{W_{ss}}{B_{inst}} \approx M,\qquad G_p[\text{dB}]=10\log_{10}M\,} $$ Intuition/sanity check: with $M=1000$ channels, $G_p\approx 30$ dB. A narrowband jammer can only corrupt the $1/M$ of the time the hopper visits its frequency — the rest of the time the link is clean.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Two clocks compete in an FH link: the hop rate $R_h$ (how fast we change frequency) and the symbol rate $R_s$ (how fast we send data symbols). Their comparison defines the hopping regime.</p>

<p><b>Step 1 — Ask: does the frequency change within a symbol, or across many symbols?</b></p>
<ul>
<li>If $R_h > R_s$, we hop <i>more often</i> than we emit symbols, so one symbol is transmitted over several frequencies — this is <b>fast hopping</b>.</li>
<li>If $R_h < R_s$, we send <i>several symbols</i> per frequency before hopping — this is <b>slow hopping</b>.</li>
</ul>

<p><b>Step 2 — State the boundary formally.</b></p>
$$ \text{fast: } R_h > R_s, \qquad \text{slow: } R_h < R_s. $$
<p>Equivalently, comparing $T_d=1/R_h$ against the symbol duration $T_s=1/R_s$: fast hopping has $T_d<T_s$, slow hopping has $T_d>T_s$.</p>

<p><b>Result.</b> $$ \boxed{\,\text{fast: } R_h > R_s,\qquad \text{slow: } R_h < R_s\,} $$ Intuition/sanity check: fast hopping gives frequency diversity <i>within</i> a symbol (good against fading/follower jammers) at the cost of tougher synchronization; slow hopping is simpler but a hit corrupts a whole burst of symbols.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> A partial-band jammer concentrates its power over only a fraction of the spread band, covering bandwidth $W_j$ out of the total $W_{ss}$. Assume the hopper visits frequencies uniformly at random over $W_{ss}$.</p>

<p><b>Step 1 — Probability = favorable band / total band.</b> On any given hop, the transmitter lands somewhere uniformly in $W_{ss}$. It falls inside the jammed region only if it lands in the $W_j$-wide slice. For a uniform distribution the probability is the ratio of the target length to the whole:</p>
$$ P_{hit} = \frac{\text{jammed bandwidth}}{\text{total bandwidth}} = \frac{W_j}{W_{ss}}. $$

<p><b>Step 2 — Name the fraction.</b> Define $\rho \equiv W_j/W_{ss}$, the jammer's fractional band coverage. Then</p>
$$ P_{hit} = \rho. $$

<p><b>Result.</b> $$ \boxed{\,P_{hit} = \rho = \frac{W_j}{W_{ss}}\,} $$ Intuition/sanity check: if the jammer covers $10\%$ of the band ($\rho=0.1$), one hop in ten is hit. The remaining $90\%$ of hops are clean, and FEC across hops can repair the occasional corrupted hop — which is exactly why partial-band jamming is countered by hopping plus coding.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> A "follower" (repeater) jammer tries to detect which frequency the hopper is using <i>right now</i>, retune its own transmitter to that frequency, and blast it — all before the hopper moves on. It succeeds only if this whole loop finishes within the dwell time $T_d$.</p>

<p><b>Step 1 — List the delays the jammer must pay.</b> To land energy on the current channel while it is still in use, the jammer needs:</p>
<ul>
<li>$\tau_{detect}$ — time to sense and identify the hop frequency,</li>
<li>$\tau_{retune}$ — time to steer its own synthesizer to that frequency,</li>
<li>$\tau_{prop}$ — round-trip propagation from hopper to jammer to victim receiver.</li>
</ul>

<p><b>Step 2 — Condition for the hopper to defeat the follower.</b> If the transmitter hops away before the jammer's energy arrives, the jam misses. That is guaranteed when the dwell time is shorter than the jammer's total reaction loop:</p>
$$ T_d < \tau_{detect} + \tau_{retune} + \tau_{prop}. $$

<p><b>Result.</b> $$ \boxed{\,T_d < \tau_{detect} + \tau_{retune} + \tau_{prop}\,} $$ Intuition/sanity check: this is why fast frequency hoppers use very short dwell times — shrink $T_d$ below the sum of the jammer's detect+retune+propagation delays and follower jamming becomes physically impossible, no matter how powerful the jammer.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> In fast hopping the carrier changes several times during a single data symbol. We want $L$: how many hops (hence independent frequency looks) make up one symbol.</p>

<p><b>Step 1 — Count hops that fit inside one symbol.</b> The symbol lasts $T_s = 1/R_s$; each hop lasts $T_d=1/R_h$. The number of hops per symbol is the symbol duration divided by the hop duration:</p>
$$ L = \frac{T_s}{T_d} = \frac{1/R_s}{1/R_h} = \frac{R_h}{R_s}. $$

<p><b>Step 2 — Interpret $L$ as a diversity order.</b> Because each of the $L$ hops is on a different frequency, the receiver gets $L$ statistically independent copies of the same symbol. Combining them provides $L$-fold frequency diversity against fading and partial-band jamming.</p>

<p><b>Result.</b> $$ \boxed{\,L = \frac{R_h}{R_s}\,} $$ Intuition/sanity check: $L=1$ is exactly the fast/slow boundary ($R_h=R_s$); $L>1$ is genuine fast hopping. Higher $L$ means a partial-band jammer must corrupt more of the $L$ looks to destroy one symbol — diversity gain grows with $L$.</p>
`
  },
  'pn-codes': {
    0: String.raw`
<p><b>Where we start.</b> An m-sequence is produced by a linear-feedback shift register (LFSR) with $n$ binary stages. The register's contents form an $n$-bit "state." Each clock, the state updates by a linear (XOR) feedback rule, and the output bit is read off. Because the update is deterministic, the sequence <i>must</i> eventually repeat once a state recurs.</p>

<p><b>Step 1 — Count the possible states.</b> With $n$ binary cells, the number of distinct states is</p>
$$ 2^{n}. $$

<p><b>Step 2 — Remove the forbidden all-zero state.</b> For linear (XOR) feedback, if the register ever becomes all-zeros, the feedback produces zero forever — the sequence gets stuck. So the all-zero state is excluded from any nontrivial cycle. That leaves</p>
$$ 2^{n} - 1 $$
<p>usable states.</p>

<p><b>Step 3 — A maximal-length (primitive-polynomial) LFSR visits every nonzero state exactly once per period.</b> When the feedback taps come from a <i>primitive</i> polynomial, the state sequence cycles through all $2^n-1$ nonzero states before repeating. The output period equals the number of distinct states traversed:</p>
$$ L = 2^{n} - 1. $$

<p><b>Result.</b> $$ \boxed{\,L = 2^{n} - 1\,} $$ Intuition/sanity check: $n=10 \Rightarrow L=1023$ (the GPS C/A code length). "Maximal-length" literally means the longest possible period an $n$-stage LFSR can have — every nonzero state used, none wasted.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Over one full period the LFSR steps through all $2^n-1$ nonzero states exactly once. The output bit at each step is (say) a chosen register cell. We count how many 1s and 0s appear in one period.</p>

<p><b>Step 1 — Enumerate the states by their output bit.</b> Among all $2^n$ possible $n$-bit patterns, exactly half have a given cell equal to 1:</p>
$$ \#\{\text{patterns with that bit}=1\} = 2^{n-1}, \qquad \#\{\text{patterns with that bit}=0\} = 2^{n-1}. $$

<p><b>Step 2 — Delete the all-zero state.</b> The all-zero pattern is never visited. It has output bit $=0$, so it is removed from the "0" tally, not the "1" tally:</p>
$$ N_1 = 2^{n-1}, \qquad N_0 = 2^{n-1} - 1. $$

<p><b>Step 3 — Take the difference.</b></p>
$$ N_1 - N_0 = 2^{n-1} - \big(2^{n-1}-1\big) = 1. $$

<p><b>Result.</b> $$ \boxed{\,N_1 = 2^{n-1},\quad N_0 = 2^{n-1}-1,\quad N_1 - N_0 = 1\,} $$ Intuition/sanity check: the sequence is "almost balanced" — exactly one more 1 than 0 per period. In $\pm1$ (bipolar) form the DC sum over a period is $+1$, which is the tiny imbalance responsible for the $-1/L$ off-peak autocorrelation.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Map the binary code to bipolar symbols $a_k \in \{+1,-1\}$ (bit $0\to+1$, bit $1\to-1$). The periodic autocorrelation compares the sequence with a shifted copy of itself:</p>
$$ R(\tau) = \frac{1}{L}\sum_{k=0}^{L-1} a_k\,a_{k+\tau}, $$
<p>with indices taken modulo $L$ (one full period).</p>

<p><b>Step 1 — Zero shift.</b> When $\tau=0$, every term is $a_k^2=(\pm1)^2=1$:</p>
$$ R(0) = \frac{1}{L}\sum_{k=0}^{L-1} 1 = \frac{L}{L} = 1. $$
<p>Perfect self-match.</p>

<p><b>Step 2 — Nonzero shift and the shift-and-add property.</b> A key property of m-sequences: XOR-ing the sequence with any cyclic shift of itself ($\tau\neq 0$) reproduces the <i>same</i> m-sequence (another shift of it). In bipolar terms, the product sequence $b_k = a_k\,a_{k+\tau}$ is itself an m-sequence, so its symbols also obey the balance property.</p>

<p><b>Step 3 — Sum a balanced $\pm1$ sequence.</b> The product sequence $b_k$ has one more $+1$ than $-1$ over a period (balance property, Eq. 1). Therefore its sum is exactly $+1$... but we must be careful with sign: for a genuine m-sequence the number of agreements minus disagreements over a period equals $-1$. Concretely, $\sum_{k} a_k a_{k+\tau}$ counts (agreements $-$ disagreements) $= (2^{n-1}-1) - 2^{n-1} = -1$:</p>
$$ \sum_{k=0}^{L-1} a_k a_{k+\tau} = -1 \quad (\tau\neq 0). $$

<p><b>Step 4 — Normalize by $L$.</b></p>
$$ R(\tau) = \frac{-1}{L} \quad (\tau\neq 0). $$

<p><b>Result.</b> $$ \boxed{\,R(\tau)=\begin{cases}1,&\tau=0\\[2pt] -\tfrac{1}{L},&\tau\neq0\end{cases}\,} $$ Intuition/sanity check: the autocorrelation is a sharp spike of height $1$ at $\tau=0$ sitting on a flat floor of $-1/L$. For $L=1023$ the sidelobes are only $\approx -0.001$ — nearly ideal, which is exactly why the receiver can lock code timing so precisely.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> For a given register length $n$, different choices of feedback taps (different primitive polynomials) yield genuinely different m-sequences. We count how many <i>distinct</i> maximal-length sequences exist. This is a counting problem tied to the algebra of the field $GF(2^n)$.</p>

<p><b>Step 1 — Count generators of the multiplicative group.</b> The nonzero elements of $GF(2^n)$ form a cyclic group of order $2^n-1$. An m-sequence corresponds to a <i>primitive</i> element — a generator of this group. The number of generators of a cyclic group of order $m$ is Euler's totient $\phi(m)$:</p>
$$ \#\{\text{primitive elements}\} = \phi(2^n-1). $$

<p><b>Step 2 — Group them by primitive polynomial.</b> Each primitive polynomial of degree $n$ has exactly $n$ conjugate roots (the element and its $2^0,2^1,\dots,2^{n-1}$ Frobenius powers), all primitive. These $n$ roots correspond to phase shifts of the <i>same</i> underlying sequence family, produced by one primitive polynomial. So we divide the count of primitive elements by $n$:</p>
$$ N_{seq} = \frac{\phi(2^n-1)}{n}. $$

<p><b>Result.</b> $$ \boxed{\,N_{seq} = \frac{\phi(2^n-1)}{n}\,} $$ Intuition/sanity check: for $n=5$, $2^n-1=31$ is prime so $\phi(31)=30$, giving $N_{seq}=30/5=6$ distinct m-sequences of length 31. This is also the number of degree-5 primitive polynomials over $GF(2)$ — the count matches.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> A "run" is a maximal block of consecutive identical bits. The <i>run property</i> of m-sequences follows from the fact that, over one period, the register visits every nonzero $n$-bit state exactly once. We find the longest possible run of 1s and of 0s.</p>

<p><b>Step 1 — Longest run of 1s.</b> A run of $n$ consecutive 1s would require the register to pass through the all-ones state $\underbrace{11\cdots1}_{n}$. This state is nonzero, so it <i>is</i> visited (exactly once). Hence a run of exactly $n$ ones occurs. A run of $n+1$ ones would demand the all-ones window to appear twice or an $(n{+}1)$-length constant block, which the single-visit property forbids. So:</p>
$$ \text{max run of 1s} = n. $$

<p><b>Step 2 — Longest run of 0s.</b> A run of $n$ consecutive 0s would require passing through the all-zero state $\underbrace{00\cdots0}_{n}$ — which is exactly the forbidden state that is never visited. Therefore the longest achievable run of zeros is one shorter:</p>
$$ \text{max run of 0s} = n-1. $$

<p><b>Result.</b> $$ \boxed{\,\text{max run of 1s}=n,\qquad \text{max run of 0s}=n-1\,} $$ Intuition/sanity check: the forbidden all-zero state is precisely what shortens the zero-run by one relative to the one-run. This asymmetry is the same "one extra 1" seen in the balance property — both trace back to excluding the all-zero state.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Suppose an application demands a code period of at least $L_{req}$ chips (e.g., to guarantee unambiguous ranging or a minimum spreading). We must pick the smallest register length $n$ whose maximal period $2^n-1$ meets or exceeds $L_{req}$.</p>

<p><b>Step 1 — Impose the requirement.</b> The achievable period is $L = 2^n-1$, so we need</p>
$$ 2^{n} - 1 \ge L_{req}. $$

<p><b>Step 2 — Solve for $n$.</b> Add 1 to both sides and take base-2 logs:</p>
$$ 2^{n} \ge L_{req}+1 \;\Longrightarrow\; n \ge \log_2\!\big(L_{req}+1\big). $$

<p><b>Step 3 — $n$ must be a whole number.</b> Register stages are integers, so round <i>up</i> to the nearest integer (ceiling), guaranteeing the requirement is still satisfied:</p>
$$ n \ge \left\lceil \log_2\!\big(L_{req}+1\big)\right\rceil. $$

<p><b>Result.</b> $$ \boxed{\,n \ge \left\lceil \log_2(L_{req}+1) \right\rceil\,} $$ Intuition/sanity check: need $L_{req}=1000$? Then $\lceil\log_2 1001\rceil = \lceil 9.97\rceil = 10$ stages, giving $L=1023\ge 1000$. Nine stages would only reach $511$ — too short — so the ceiling is doing real work.</p>
`
  },
  'gold-code': {
    0: String.raw`
<p><b>Where we start.</b> Gold codes are built from a "preferred pair" of m-sequences $u$ and $v$, each of length $L=2^n-1$. New codes are formed by XOR-ing $u$ with every cyclic shift of $v$: $u\oplus T^0 v,\ u\oplus T^1 v,\dots$ We count the full family.</p>

<p><b>Step 1 — Count the XOR combinations.</b> There are exactly $L=2^n-1$ distinct cyclic shifts of $v$. Each shift, XOR-ed with $u$, produces a different Gold sequence:</p>
$$ \#\{u\oplus T^k v\} = 2^n - 1. $$

<p><b>Step 2 — Add the two parent sequences.</b> The two original m-sequences $u$ and $v$ are themselves members of the Gold family (they satisfy the same correlation bounds). Including them adds 2:</p>
$$ N_{Gold} = (2^n-1) + 2 = 2^n + 1. $$

<p><b>Step 3 — Restate using $L$.</b> Since $L=2^n-1$,</p>
$$ N_{Gold} = L + 2. $$

<p><b>Result.</b> $$ \boxed{\,N_{Gold} = 2^n + 1 = (2^n-1) + 2 = L + 2\,} $$ Intuition/sanity check: for $n=10$, $N_{Gold}=1025$ codes of length $1023$. That is far more than the handful of pure m-sequences of the same length — which is why Gold codes are used for CDMA/GPS where each user needs its own well-behaved code.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> The cross-correlation between two Gold codes takes only three values, and they are all controlled by a single integer $t(n)$ that depends on the register length $n$. We derive the standard formula for $t(n)$.</p>

<p><b>Step 1 — Origin of $t(n)$.</b> For a preferred pair of m-sequences, the peak cross-correlation magnitude is bounded by $t(n)$. Number theory of preferred pairs gives the exponent as $\lfloor (n+2)/2\rfloor$: the bound scales like $2$ raised to roughly half of $n$.</p>

<p><b>Step 2 — Write the two parity cases explicitly.</b> Evaluating $\lfloor (n+2)/2\rfloor$:</p>
$$ n\ \text{odd:}\ \left\lfloor\frac{n+2}{2}\right\rfloor=\frac{n+1}{2}, \qquad n\ \text{even:}\ \left\lfloor\frac{n+2}{2}\right\rfloor=\frac{n+2}{2}. $$

<p><b>Step 3 — Assemble $t(n)$.</b> The peak parameter is one more than this power of two:</p>
$$ t(n) = 1 + 2^{\lfloor (n+2)/2 \rfloor}. $$

<p><b>Result.</b> $$ \boxed{\,t(n) = 1 + 2^{\lfloor (n+2)/2 \rfloor}\,} $$ Intuition/sanity check: for $n=10$ (even), the exponent is $\lfloor 12/2\rfloor = 6$, so $t(10)=1+2^6=65$. This single number sets the worst-case interference one GPS satellite's code can cause to another.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> With the peak parameter $t(n)$ in hand, the remarkable fact about (preferred-pair) Gold codes is that the periodic cross-correlation between any two family members takes only <i>three</i> possible values, symmetric about a small negative center.</p>

<p><b>Step 1 — Recall the m-sequence off-peak floor.</b> A single m-sequence has off-peak (auto)correlation sum $-1$. This $-1$ becomes the central of the three cross-correlation levels for the Gold family.</p>

<p><b>Step 2 — The two extreme levels sit one $t(n)$-step on either side.</b> The preferred-pair construction confines the cross-correlation excursions to $\pm t(n)$ about the $-1$ baseline, but expressed as absolute values the three levels come out as $-1$, $-t(n)$, and $t(n)-2$:</p>
$$ \theta_{cross} \in \{\,-1,\ -t(n),\ t(n)-2\,\}. $$
<p>(Note $-t(n)$ and $t(n)-2$ are the two values obtained by shifting $-1$ by $\pm(t(n)-1)$: $-1-(t(n)-1)=-t(n)$ and $-1+(t(n)-1)=t(n)-2$.)</p>

<p><b>Result.</b> $$ \boxed{\,\theta_{cross} \in \{\,-1,\ -t(n),\ t(n)-2\,\}\,} $$ Intuition/sanity check: for $n=10$, $t=65$, the three levels are $\{-1,\,-65,\,63\}$ out of a peak of $L=1023$. The worst normalized crosstalk is $65/1023\approx 0.064$ — small and, crucially, <i>bounded</i>, so every user pair has predictable, low mutual interference.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> The quality of a code family for CDMA is the <i>normalized</i> peak cross-correlation, $t(n)/L$: worst-case interference relative to the autocorrelation peak $L$. We show it decays like $1/\sqrt{L}$.</p>

<p><b>Step 1 — Approximate $t(n)$ by its dominant term.</b> From $t(n)=1+2^{\lfloor(n+2)/2\rfloor}$, drop the $+1$ and take the odd-$n$ exponent $\tfrac{n+1}{2}$ for a clean estimate:</p>
$$ t(n) \approx 2^{(n+1)/2}. $$

<p><b>Step 2 — Divide by $L\approx 2^n$.</b></p>
$$ \frac{t(n)}{L} \approx \frac{2^{(n+1)/2}}{2^n} = 2^{(n+1)/2 - n} = 2^{-(n-1)/2}. $$

<p><b>Step 3 — Rewrite in terms of $L$.</b> Since $2^n\approx L$, we have $2^{-(n-1)/2} = 2^{1/2}\cdot 2^{-n/2} = \sqrt{2}/\sqrt{2^n} \approx \sqrt{2}/\sqrt{L}$:</p>
$$ \frac{t(n)}{L} \sim \sqrt{\frac{2}{L}}. $$

<p><b>Result.</b> $$ \boxed{\,\frac{t(n)}{L} \approx \frac{2^{(n+1)/2}}{2^n} = 2^{-(n-1)/2} \sim \sqrt{\tfrac{2}{L}}\,} $$ Intuition/sanity check: crosstalk shrinks as $1/\sqrt{L}$. Doubling $n$ (squaring the length) roughly halves the normalized interference — longer Gold codes give cleaner multiple access, approaching the Welch bound $\sim 1/\sqrt{L}$ for large families.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> The GPS C/A Gold codes use register length $n=10$. We compute the code length and the peak cross-correlation parameter for this specific case.</p>

<p><b>Step 1 — Length from $L=2^n-1$.</b></p>
$$ L = 2^{10} - 1 = 1024 - 1 = 1023. $$
<p>This is why each GPS C/A code is $1023$ chips long, repeating every $1$ ms at $1.023$ Mchip/s.</p>

<p><b>Step 2 — Peak parameter from $t(n)=1+2^{\lfloor(n+2)/2\rfloor}$ with $n=10$.</b> The exponent is $\lfloor 12/2\rfloor = 6$:</p>
$$ t(10) = 1 + 2^{6} = 1 + 64 = 65. $$

<p><b>Result.</b> $$ \boxed{\,L = 2^{10}-1 = 1023,\qquad t(10)=1+2^6=65\,} $$ Intuition/sanity check: the three cross-correlation levels are $\{-1,-65,63\}$ against a peak of $1023$, so any two GPS satellites interfere at worst at $\approx 65/1023\approx 6.4\%$ — low enough that a receiver can pull one satellite out from under all the others.</p>
`
  },
  'fec': {
    0: String.raw`
<p><b>Where we start.</b> A block encoder takes $k$ information bits and appends structured redundancy to output $n$ coded bits ($n>k$). The added $n-k$ bits are parity — they carry no new information but enable error correction. The <i>code rate</i> measures information efficiency.</p>

<p><b>Step 1 — Define efficiency as useful bits per transmitted bit.</b> Of the $n$ transmitted bits, only $k$ are information. The fraction that is information is</p>
$$ R = \frac{k}{n}. $$

<p><b>Step 2 — Bound the rate.</b> Since we always add redundancy, $n\ge k$, so $R\le 1$. And $k\ge 1$ with $n$ finite gives $R>0$. Hence</p>
$$ 0 < R \le 1. $$
<p>$R=1$ means no redundancy (no coding); $R\to 0$ means heavy redundancy.</p>

<p><b>Result.</b> $$ \boxed{\,R = \frac{k}{n},\qquad 0 < R \le 1\,} $$ Intuition/sanity check: a rate-$1/2$ code sends 2 bits for every 1 information bit — half the channel carries protection. Lower rate buys stronger error correction at the price of bandwidth (or throughput).</p>
`,
    1: String.raw`
<p><b>Where we start.</b> Codewords are points in a binary space; the Hamming distance between two codewords is the number of bit positions in which they differ. The <i>minimum distance</i> $d_{min}$ is the smallest such distance over all distinct codeword pairs. Noise flips bits, moving a received word away from the sent codeword.</p>

<p><b>Step 1 — Decoding = nearest codeword.</b> The decoder maps a received word to the closest codeword (minimum Hamming distance). Correct decoding happens as long as the received word is still closer to the true codeword than to any other.</p>

<p><b>Step 2 — Geometry of correction spheres.</b> Draw a sphere of radius $t$ (in Hamming distance) around every codeword. If these spheres don't overlap, any error of $\le t$ flips lands inside the correct sphere and is decoded correctly. Non-overlap requires the spheres of two nearest codewords (distance $d_{min}$ apart) to not touch:</p>
$$ t + t < d_{min} \;\Longrightarrow\; 2t < d_{min} \;\Longrightarrow\; 2t \le d_{min}-1. $$

<p><b>Step 3 — Solve for the largest guaranteed $t$.</b></p>
$$ t \le \frac{d_{min}-1}{2}, \qquad t = \left\lfloor \frac{d_{min}-1}{2}\right\rfloor. $$
<p>The floor is because $t$ is an integer number of correctable bit errors.</p>

<p><b>Result.</b> $$ \boxed{\,t = \left\lfloor \frac{d_{min}-1}{2} \right\rfloor\,} $$ Intuition/sanity check: $d_{min}=3 \Rightarrow t=1$ (single-error correcting, like a Hamming code); $d_{min}=5\Rightarrow t=2$. You need distance $2t+1$ to correct $t$ errors — the classic separation requirement.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Detection is easier than correction: to <i>detect</i> an error we need only notice that the received word is not a valid codeword; we don't have to identify the right one. Again $d_{min}$ is the smallest distance between distinct codewords.</p>

<p><b>Step 1 — When does an error go undetected?</b> An error pattern is undetectable only if it turns one valid codeword into <i>another</i> valid codeword. The fewest bit flips that can do that is exactly $d_{min}$ (the closest other codeword).</p>

<p><b>Step 2 — Detectable range.</b> Therefore any nonzero error of weight from $1$ up to $d_{min}-1$ lands on a non-codeword and is caught. The largest number of errors guaranteed detectable is one short of $d_{min}$:</p>
$$ e_{detect} = d_{min} - 1. $$

<p><b>Result.</b> $$ \boxed{\,e_{detect} = d_{min} - 1\,} $$ Intuition/sanity check: with $d_{min}=4$ you can detect up to $3$ errors (but only correct $t=\lfloor 3/2\rfloor=1$). Detection always reaches farther than correction because it asks the easier question "is this valid?" rather than "which codeword was sent?"</p>
`,
    3: String.raw`
<p><b>Where we start.</b> To hit a target bit-error rate, an uncoded link needs some $\left(E_b/N_0\right)_{uncoded}$; a coded link achieves the <i>same</i> BER at a lower $\left(E_b/N_0\right)_{coded}$ because the code repairs errors. Coding gain quantifies the energy saved.</p>

<p><b>Step 1 — Compare at equal BER.</b> Fix a target BER. Read off the $E_b/N_0$ each system requires to reach it. The horizontal gap between the two BER-vs-$E_b/N_0$ curves at that BER is the benefit of coding.</p>

<p><b>Step 2 — Define the gain as that gap (in dB).</b></p>
$$ G_{code} = \left(\frac{E_b}{N_0}\right)_{uncoded} - \left(\frac{E_b}{N_0}\right)_{coded}. $$
<p>Both quantities are in dB, so their difference is a dB gain.</p>

<p><b>Result.</b> $$ \boxed{\,G_{code} = \left(\frac{E_b}{N_0}\right)_{uncoded} - \left(\frac{E_b}{N_0}\right)_{coded}\ \text{(dB, at equal BER)}\,} $$ Intuition/sanity check: a coding gain of $5$ dB means the coded system reaches the same reliability with $\sim 3\times$ less transmit power (or range/margin). It is "free" performance bought with redundancy and decoder complexity rather than watts.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> At high SNR the coded BER is dominated by confusing a codeword with its nearest neighbor at distance $d_{min}$. We estimate the coding gain from the code's parameters alone, without simulating curves.</p>

<p><b>Step 1 — Effective distance in energy.</b> Each coded bit carries only a fraction $R=k/n$ of an information bit's energy (the same $E_b$ is split across more channel bits). A minimum-distance error event flips $d_{min}$ coded bits, so the effective squared-distance advantage over uncoded transmission scales as the product $R\cdot d_{min}$.</p>

<p><b>Step 2 — Convert the factor to dB.</b> The asymptotic (high-SNR) coding gain is $10\log_{10}$ of this product:</p>
$$ G_a \approx 10\log_{10}\!\big(R\,d_{min}\big). $$

<p><b>Result.</b> $$ \boxed{\,G_a \approx 10\log_{10}\!\big(R\,d_{min}\big)\ \text{dB}\,} $$ Intuition/sanity check: a rate-$1/2$ code with $d_{min}=10$ gives $G_a\approx 10\log_{10}(5)\approx 7$ dB. The formula rewards large distance but penalizes low rate — you can't get correction power for free; spreading $E_b$ over more bits ($R<1$) is the cost.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Shannon's capacity theorem gives the maximum error-free data rate $C$ over a bandwidth-$B$ channel with signal-to-noise ratio $S/N$. From it we extract the absolute minimum energy per bit any code can ever need.</p>

<p><b>Step 1 — State capacity.</b></p>
$$ C = B\log_2\!\left(1 + \frac{S}{N}\right). $$
<p>Write $S = E_b C$ (energy per bit times bits/s) and noise $N = N_0 B$. At capacity, data rate $R_b=C$, so $S/N = E_b C/(N_0 B)$.</p>

<p><b>Step 2 — Substitute and set spectral efficiency $\eta = C/B$.</b></p>
$$ \eta = \log_2\!\left(1 + \frac{E_b}{N_0}\,\eta\right) \;\Longrightarrow\; 2^{\eta} = 1 + \frac{E_b}{N_0}\eta \;\Longrightarrow\; \frac{E_b}{N_0} = \frac{2^{\eta}-1}{\eta}. $$

<p><b>Step 3 — Take the wideband limit $\eta\to 0$.</b> As bandwidth grows without bound, use $2^{\eta}=e^{\eta\ln 2}\approx 1+\eta\ln 2$:</p>
$$ \frac{E_b}{N_0} \to \frac{(1+\eta\ln2)-1}{\eta} = \ln 2. $$

<p><b>Step 4 — Convert to dB.</b> $\;10\log_{10}(\ln 2) = 10\log_{10}(0.693) \approx -1.59$ dB.</p>

<p><b>Result.</b> $$ \boxed{\,C = B\log_2\!\left(1+\tfrac{S}{N}\right),\qquad \left(\tfrac{E_b}{N_0}\right)_{min}=\ln 2 = -1.59\ \text{dB}\,} $$ Intuition/sanity check: no code, however clever, can deliver reliable communication below $-1.59$ dB of $E_b/N_0$. Modern turbo/LDPC codes operate within a fraction of a dB of this hard wall — the ultimate target that coding gain chases.</p>
`
  },
  'viterbi': {
    0: String.raw`
<p><b>Where we start.</b> A convolutional encoder with constraint length $K$ remembers the current input bit plus the previous $K-1$ input bits (held in a shift register). The encoder's output depends on this remembered history — the "state." The trellis has one node per possible state at each time step.</p>

<p><b>Step 1 — Identify what forms the state.</b> The current output is determined by the current input bit together with the contents of the memory, which holds the previous $K-1$ bits. The <i>state</i> is exactly those $K-1$ stored bits (the current input is the branch label, not part of the state).</p>

<p><b>Step 2 — Count the states.</b> Each of the $K-1$ memory bits is $0$ or $1$, independently, so the number of distinct states is</p>
$$ N_{states} = 2^{K-1}. $$

<p><b>Result.</b> $$ \boxed{\,N_{states} = 2^{K-1}\,} $$ Intuition/sanity check: a $K=7$ encoder (industry standard, e.g. rate-$1/2$ NASA code) has $2^{6}=64$ states. Decoder complexity grows exponentially in $K$ — the reason $K$ rarely exceeds $\sim 9$ for Viterbi decoding.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> The Viterbi algorithm finds the single most-likely path through the trellis. It keeps, for each state $s'$ at time $t$, the best cumulative "path metric" $PM_t(s')$ — the total mismatch of the best sequence of transitions ending in $s'$. It builds this up recursively via <b>Add-Compare-Select (ACS)</b>.</p>

<p><b>Step 1 — Each state is reachable from a few predecessors.</b> Only a limited set of previous states $s$ have a valid branch $s\to s'$ (for a binary code, exactly two). Any surviving path into $s'$ must pass through one of them.</p>

<p><b>Step 2 — Add.</b> Extend each predecessor's best path to $s'$ by adding the branch metric $BM_t(s\to s')$ (how badly that transition matches the received symbols) to its stored path metric:</p>
$$ PM_{t-1}(s) + BM_t(s\to s'). $$

<p><b>Step 3 — Compare and Select.</b> Among all predecessors, keep the <i>smallest</i> total — that is the best way to arrive in $s'$ (larger metrics can never become optimal later, by the optimality principle of dynamic programming):</p>
$$ PM_t(s') = \min_{s\to s'}\big[\,PM_{t-1}(s) + BM_t(s\to s')\,\big]. $$

<p><b>Result.</b> $$ \boxed{\,PM_t(s') = \min_{s\to s'}\big[\,PM_{t-1}(s) + BM_t(s\to s')\,\big]\,} $$ Intuition/sanity check: this is the Bellman recursion — the best path to $s'$ is the best path to some predecessor plus the last hop. Discarding losers at every node keeps the survivor count fixed at $2^{K-1}$, making the search linear in sequence length instead of exponential.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> With <i>hard-decision</i> demodulation, each received bit is already sliced to a firm $0$ or $1$. The branch metric should measure how much a candidate branch's expected coded bits $\mathbf{c}_{branch}$ disagree with the received bits $\mathbf{r}$.</p>

<p><b>Step 1 — Disagreement per bit is XOR.</b> For binary $r_i, c_i$, the bit $r_i \oplus c_i$ equals $1$ exactly when they differ and $0$ when they agree.</p>

<p><b>Step 2 — Sum the disagreements = Hamming distance.</b> Counting the mismatched positions over the branch's bits gives the Hamming distance:</p>
$$ BM = d_H(\mathbf{r},\mathbf{c}_{branch}) = \sum_i r_i \oplus c_i. $$

<p><b>Step 3 — Why this is the right (ML) metric.</b> On a binary symmetric channel with crossover $p<0.5$, the log-likelihood of a branch is a decreasing linear function of the number of mismatches. Minimizing total Hamming distance therefore maximizes likelihood — exactly what Viterbi's $\min$ recursion does.</p>

<p><b>Result.</b> $$ \boxed{\,BM = d_H(\mathbf{r},\mathbf{c}_{branch}) = \sum_i r_i \oplus c_i\,} $$ Intuition/sanity check: a branch expecting $01$ against received $00$ scores $BM=1$ (one mismatch). The path accumulating the fewest total mismatches wins — the maximum-likelihood sequence for hard decisions.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> With <i>soft-decision</i> demodulation the receiver keeps the analog (or finely quantized) values $r_i$ instead of slicing to bits. This retains reliability information and buys $\sim 2$ dB over hard decisions. The branch metric should reflect Euclidean, not Hamming, closeness.</p>

<p><b>Step 1 — Maximum-likelihood on the AWGN channel.</b> For Gaussian noise, the likelihood of receiving $\mathbf{r}$ given transmitted branch symbols $\mathbf{c}$ is $\propto \exp\!\big(-\sum_i (r_i-c_i)^2 / 2\sigma^2\big)$. Maximizing this likelihood means <i>minimizing</i> the squared Euclidean distance:</p>
$$ BM = \sum_i (r_i - c_i)^2. $$

<p><b>Step 2 — Expand and drop constants.</b> Expand the square:</p>
$$ \sum_i (r_i-c_i)^2 = \sum_i r_i^2 - 2\sum_i r_i c_i + \sum_i c_i^2. $$
<p>The term $\sum r_i^2$ is the same for every branch (independent of $\mathbf{c}$), and for $\pm1$ symbols $\sum c_i^2$ is constant too. Only the middle (correlation) term distinguishes branches.</p>

<p><b>Step 3 — Equivalent correlation metric.</b> Minimizing $\sum(r_i-c_i)^2$ is therefore equivalent to <i>maximizing</i> $\sum r_i c_i$, i.e. minimizing its negative:</p>
$$ BM = -\sum_i r_i\,c_i. $$

<p><b>Result.</b> $$ \boxed{\,BM = \sum_i (r_i - c_i)^2 \quad\text{or}\quad BM = -\sum_i r_i c_i\,} $$ Intuition/sanity check: soft metrics use "how far," not just "different or not," so a barely-flipped bit costs little and a confidently-correct bit helps a lot. This finer information is exactly the $\sim 2$ dB advantage of soft-decision Viterbi decoding.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> Viterbi doesn't wait for the whole message before deciding early bits. It traces back a fixed number of trellis stages — the <i>traceback depth</i> $L_{tb}$ — and outputs the bit that far back, because by then all surviving paths have merged to a common history.</p>

<p><b>Step 1 — Why paths merge.</b> Wrong survivor paths accumulate metric penalties and get eliminated; after enough stages, all survivors share the same old history. Once merged, the decision on that old bit is unambiguous and (with high probability) correct.</p>

<p><b>Step 2 — How deep is "enough"?</b> Empirically and from error-event analysis, the merging depth scales with the code's memory, i.e. with the constraint length $K$. A safe, near-optimal choice is about five constraint lengths:</p>
$$ L_{tb} \approx 5K. $$
<p>Beyond $\sim 5K$ the extra BER improvement is negligible, so this is the standard engineering rule.</p>

<p><b>Result.</b> $$ \boxed{\,L_{tb} \approx 5K\,} $$ Intuition/sanity check: for $K=7$, $L_{tb}\approx 35$ stages. Truncating shorter than this risks outputting a bit before survivors merge (extra errors); much longer just wastes memory and latency for no gain.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> We estimate the arithmetic cost of Viterbi decoding. The work is dominated by the ACS operations, one per trellis state per time step. Recall there are $N_{states}=2^{K-1}$ states.</p>

<p><b>Step 1 — Cost per bit.</b> At each time step (one decoded bit), every one of the $2^{K-1}$ states runs an ACS. For a binary code each ACS compares $2$ incoming branches, so the number of add/compare operations per bit is</p>
$$ \text{ops/bit} \approx 2\cdot 2^{K-1} = 2^{K}. $$

<p><b>Step 2 — Total over the whole sequence.</b> For a message of $N$ bits, multiply by $N$:</p>
$$ \text{total} = N\cdot 2^{K-1} \cdot (\text{const}) = \mathcal{O}\!\big(N\,2^{K-1}\big). $$

<p><b>Result.</b> $$ \boxed{\,\text{ops/bit} \approx 2\cdot 2^{K-1} = 2^{K},\qquad \text{total} = \mathcal{O}\!\big(N\,2^{K-1}\big)\,} $$ Intuition/sanity check: complexity is <i>linear</i> in message length $N$ (great) but <i>exponential</i> in constraint length $K$ (the catch). Every $+1$ in $K$ doubles the hardware — which is precisely why practical Viterbi decoders cap $K$ around $7$–$9$ and longer memory codes switch to turbo/LDPC.</p>
`
  },
  'processing-gain': {
    0: String.raw`
<p><b>Where we start.</b> A spread-spectrum transmitter occupies RF bandwidth $W$ (set by the chip rate $R_c$) while carrying an information rate $R$ (set by the bit rate $R_b$). Processing gain measures how much wider the transmission is than the information it conveys.</p>

<p><b>Step 1 — Form the fundamental ratio.</b> Since bandwidth tracks rate ($W\propto R_c$, $R\propto R_b$ with the same constant), the ratio is</p>
$$ G_p = \frac{W}{R} = \frac{R_c}{R_b}. $$

<p><b>Step 2 — Recognize the spreading factor.</b> By definition of DSSS, $R_c/R_b = N$ (chips per bit):</p>
$$ G_p = \frac{R_c}{R_b} = N. $$

<p><b>Step 3 — Express in decibels.</b> As a power-like ratio it converts with $10\log_{10}$:</p>
$$ G_p[\text{dB}] = 10\log_{10}\frac{W}{R}. $$

<p><b>Result.</b> $$ \boxed{\,G_p=\frac{W}{R}=\frac{R_c}{R_b}=N,\qquad G_p[\mathrm{dB}]=10\log_{10}\frac{W}{R}\,} $$ Intuition/sanity check: processing gain, spreading factor, and bandwidth-expansion ratio are three names for the same number $N$. It is the single figure of merit summarizing a spread system's anti-jam and multiple-access power.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> A correlator (matched filter) despreads the received signal. The wanted signal correlates coherently with the local code; wideband noise/interference does not. We track what happens to signal and noise power through the correlator.</p>

<p><b>Step 1 — Signal is gathered coherently.</b> Over the $N$ chips of a bit, the code multiplication turns the spread signal back into a full-amplitude data pulse — the correlator adds the $N$ chip contributions in phase. Signal power at the output is preserved (indeed enhanced relative to the noise floor).</p>

<p><b>Step 2 — Noise is reduced by the bandwidth ratio.</b> Broadband noise is uncorrelated with the code, so after despreading it spreads over $W$ while the post-correlator filter keeps only the information band $R$. The surviving noise fraction is $R/W = 1/G_p$.</p>

<p><b>Step 3 — Combine into the SNR relation.</b> Signal held, noise cut by $1/G_p$:</p>
$$ \left(\frac{S}{N}\right)_{out} = \frac{S_{in}}{N_{in}/G_p} = G_p\left(\frac{S}{N}\right)_{in}. $$

<p><b>Result.</b> $$ \boxed{\,\left(\frac{S}{N}\right)_{out}=G_p\left(\frac{S}{N}\right)_{in}\,} $$ Intuition/sanity check: the correlator multiplies SNR by exactly the processing gain. This is the payoff that lets a spread signal live below the noise floor at the antenna yet decode reliably after despreading.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> Processing gain can be viewed in the time–frequency plane. A signal observed for duration $T$ over bandwidth $W$ has a number of independent degrees of freedom (resolvable dimensions) equal to the time–bandwidth product $TW$.</p>

<p><b>Step 1 — Dimensionality of the signal space.</b> The Nyquist/Landau result: a waveform confined to bandwidth $W$ and time $T$ occupies about $TW$ independent complex dimensions. A correlator/matched filter coherently combines all of them.</p>

<p><b>Step 2 — Coherent combining gain.</b> Combining $TW$ independent noise samples coherently for the signal while averaging noise incoherently yields a gain equal to the number of dimensions:</p>
$$ G_p = T\,W. $$

<p><b>Step 3 — Consistency with the rate form.</b> For a DSSS bit, $T=T_b$ and $W\approx R_c$, so $TW = T_b R_c = R_c/R_b = N$ — the same processing gain as before.</p>

<p><b>Result.</b> $$ \boxed{\,G_p = T\,W\,} $$ Intuition/sanity check: processing gain is fundamentally a time–bandwidth product. Radar pulse compression, spread spectrum, and matched-filter integration all exploit the same $TW$ principle — collect more dimensions, gain more SNR.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> Now the "noise" is a jammer of power $P_j$ competing with signal power $P_s$. At the correlator input the signal-to-jammer ratio is $S/J = P_s/P_j$. We find the output ratio after despreading.</p>

<p><b>Step 1 — Signal preserved, jammer spread.</b> As with noise, despreading keeps the wanted signal coherent while a wideband jammer is spread over $W$ and reduced by $1/G_p$ in the output band. (Even a narrowband jammer, multiplied by the code, is spread out and only $1/G_p$ of it survives the filter.)</p>

<p><b>Step 2 — Apply the gain.</b></p>
$$ \left(\frac{S}{J}\right)_{out} = G_p\cdot\frac{S}{J} = G_p\cdot\frac{P_s}{P_j}. $$

<p><b>Result.</b> $$ \boxed{\,\left(\frac{S}{J}\right)_{out}=G_p\,\frac{S}{J}=G_p\,\frac{P_s}{P_j}\,} $$ Intuition/sanity check: even if a jammer arrives far stronger than the signal ($P_j\gg P_s$), the processing gain lifts the output ratio by $G_p$. As long as $G_p\cdot P_s/P_j$ exceeds the demodulator's required SNR, the link survives — this surplus is the jamming margin.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> In a single-cell CDMA network $K$ users share the band, each spread with gain $G_p$. With power control all users arrive at equal power, so for any receiver the other $K-1$ users act as interference.</p>

<p><b>Step 1 — Post-despread $E_b/N_0$.</b> Our signal enjoys the full processing gain against the pooled interference of $K-1$ equal-power users:</p>
$$ \frac{E_b}{N_0} \approx \frac{S}{(K-1)S}\,G_p = \frac{G_p}{K-1}. $$

<p><b>Step 2 — Solve for capacity.</b> Setting the delivered ratio equal to the demodulator's requirement $(E_b/N_0)_{req}$ and inverting:</p>
$$ K-1 = \frac{G_p}{(E_b/N_0)_{req}} \;\Longrightarrow\; K \approx 1 + \frac{G_p}{(E_b/N_0)_{req}}. $$

<p><b>Result.</b> $$ \boxed{\,\frac{E_b}{N_0}\approx\frac{G_p}{K-1}\quad\Rightarrow\quad K\approx 1+\frac{G_p}{(E_b/N_0)_{req}}\,} $$ Intuition/sanity check: capacity grows linearly with processing gain. Real systems further multiply this by voice-activity and sectorization factors, but the core message stands: wider spreading directly means more users.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Pulse-compression radar transmits a long, coded pulse of width $\tau$ and bandwidth $B$ (e.g. a chirp), then compresses it in a matched filter. Processing gain here is the improvement in peak SNR / range resolution from that compression.</p>

<p><b>Step 1 — Long pulse for energy, wide band for resolution.</b> A pulse of duration $\tau$ carries energy $\propto\tau$ (good for detection), while bandwidth $B$ sets range resolution $\propto 1/B$ (good for resolving targets). Uncoded, these fight each other; coding lets us have both.</p>

<p><b>Step 2 — Compression ratio.</b> The matched filter squeezes the $\tau$-wide pulse down to a compressed width $\approx 1/B$. The gain is the ratio of input pulse width to compressed width:</p>
$$ G_p = \frac{\tau}{1/B} = \tau B. $$

<p><b>Result.</b> $$ \boxed{\,G_p = \tau B = \frac{\tau}{1/B} = \frac{\text{pulse width}}{\text{compressed width}}\,} $$ Intuition/sanity check: it's the same time–bandwidth product $TW$ as spread spectrum. A $100\ \mu$s pulse with $1$ MHz bandwidth gives $\tau B=100$ (20 dB) — the radar detects as if it sent a $100\times$ stronger short pulse, without needing the peak power to do so.</p>
`
  },
  'jamming-margin': {
    0: String.raw`
<p><b>Where we start.</b> Processing gain $G_p$ is the total SNR advantage spreading provides (in dB). Some of it is unavoidably spent: the demodulator needs a minimum $\left(S/N\right)_{req}$ to work, and real hardware loses $L_{sys}$ to imperfections. Whatever is left is the cushion against a jammer.</p>

<p><b>Step 1 — Allocate the gain budget.</b> Start with all the gain, then subtract the mandatory expenditures:</p>
$$ \underbrace{G_p}_{\text{total advantage}} - \underbrace{L_{sys}}_{\text{losses}} - \underbrace{\left(\tfrac{S}{N}\right)_{req}}_{\text{demod needs}} = \underbrace{M_j}_{\text{spare margin}}. $$

<p><b>Step 2 — Write the margin.</b></p>
$$ M_j = G_p - L_{sys} - \left(\frac{S}{N}\right)_{req}. $$

<p><b>Result.</b> $$ \boxed{\,M_j = G_p - L_{sys} - \left(\frac{S}{N}\right)_{req}\quad[\text{dB}]\,} $$ Intuition/sanity check: $M_j$ is the number of dB by which a jammer may exceed our signal before the demodulator falls below threshold. Bigger $G_p$, smaller losses, or a more robust demod (lower required SNR) all widen the margin.</p>
`,
    1: String.raw`
<p><b>Where we start.</b> A jammer succeeds when the post-despread signal-to-jammer ratio drops below the demodulator's requirement. We find the largest input jammer-to-signal ratio $(J/S)$ the link can tolerate.</p>

<p><b>Step 1 — Output ratio after despreading.</b> From the processing-gain relation (in dB), spreading adds $G_p$ to the ratio while losses subtract $L_{sys}$:</p>
$$ \left(\frac{S}{J}\right)_{out} = G_p - L_{sys} - \left(\frac{J}{S}\right)_{in}. $$

<p><b>Step 2 — Threshold condition.</b> The link just survives when the output equals the required SNR:</p>
$$ \left(\frac{S}{N}\right)_{req} = G_p - L_{sys} - \left(\frac{J}{S}\right)_{max}. $$

<p><b>Step 3 — Solve for the maximum jammer-to-signal ratio.</b></p>
$$ \left(\frac{J}{S}\right)_{max} = G_p - L_{sys} - \left(\frac{S}{N}\right)_{req} = M_j. $$

<p><b>Result.</b> $$ \boxed{\,\left(\frac{J}{S}\right)_{max}=M_j=G_p-L_{sys}-\left(\frac{S}{N}\right)_{req}\,} $$ Intuition/sanity check: the maximum tolerable $J/S$ <i>is</i> the jamming margin — the two are the same number. If a jammer's $J/S$ at the receiver exceeds $M_j$ dB, the link breaks; below it, the link holds.</p>
`,
    2: String.raw`
<p><b>Where we start.</b> We want the despread signal-to-jammer ratio in terms of the input jammer-to-signal ratio and the processing gain, all in dB. The despreading correlator gives the wanted signal the full gain while spreading the jammer.</p>

<p><b>Step 1 — Linear-domain relation.</b> As shown for processing gain, $(S/J)_{out} = G_p\cdot (S/J)_{in}$ in linear units. Equivalently $(S/J)_{out} = G_p/(J/S)_{in}$.</p>

<p><b>Step 2 — Convert to dB.</b> Take $10\log_{10}$ of both sides; multiplication becomes addition and division becomes subtraction:</p>
$$ \left(\frac{S}{J}\right)_{out}[\text{dB}] = G_p[\text{dB}] - \left(\frac{J}{S}\right)_{in}[\text{dB}]. $$

<p><b>Result.</b> $$ \boxed{\,\left(\frac{S}{J}\right)_{out}=G_p-\left(\frac{J}{S}\right)_{in}\quad[\text{dB}]\,} $$ Intuition/sanity check: with $G_p=30$ dB and a jammer $20$ dB above our signal ($(J/S)_{in}=20$ dB), the despread ratio is $+10$ dB — comfortably positive. Processing gain has turned a losing $20$ dB deficit into a $10$ dB surplus.</p>
`,
    3: String.raw`
<p><b>Where we start.</b> The jammer-to-signal ratio at the victim receiver is set by link budgets: transmit powers, antenna gains, and path losses for the jammer link versus the desired-signal link. We build $J/S$ from the two one-way link equations.</p>

<p><b>Step 1 — Received power via the range law.</b> For a transmitter of power $P$ and antenna gain $G_T$, into a receive antenna of gain $G_R$ at range $R$, the received power falls as $R^{-n}$ (with $n=2$ in free space, larger with terrain/foliage):</p>
$$ P_{rx} \propto \frac{P\,G_T\,G_R}{R^{n}}. $$

<p><b>Step 2 — Write both received powers.</b> Jammer at range $R_J$ with gains $G_J$ (jammer) and $G_{RJ}$ (receiver's gain toward the jammer); desired signal at range $R_S$ with gains $G_S$ and $G_{RS}$:</p>
$$ J \propto \frac{P_J G_J G_{RJ}}{R_J^{\,n}}, \qquad S \propto \frac{P_S G_S G_{RS}}{R_S^{\,n}}. $$

<p><b>Step 3 — Take the ratio.</b> The proportionality constants cancel:</p>
$$ \frac{J}{S} = \frac{P_J G_J G_{RJ}}{P_S G_S G_{RS}}\left(\frac{R_S}{R_J}\right)^{n}. $$

<p><b>Result.</b> $$ \boxed{\,\frac{J}{S}=\frac{P_J G_J G_{RJ}}{P_S G_S G_{RS}}\left(\frac{R_S}{R_J}\right)^{n}\,} $$ Intuition/sanity check: a jammer closer than the transmitter ($R_J<R_S$) makes $(R_S/R_J)^n>1$, amplifying its effect — the "burn-through" problem. Directional receive nulling (small $G_{RJ}$) is the classic defense, shrinking $J/S$ directly.</p>
`,
    4: String.raw`
<p><b>Where we start.</b> Demodulator performance is quoted as $E_b/N_0$ (energy per bit over noise density), but the jamming-margin equation uses the wideband signal-to-noise ratio $S/N$. We relate the two through the bit rate $R_b$ and receiver bandwidth $B$.</p>

<p><b>Step 1 — Express $S/N$ from energy and rate.</b> Signal power is energy per bit times bits per second, $S = E_b R_b$; noise power is density times bandwidth, $N = N_0 B$. Therefore</p>
$$ \frac{S}{N} = \frac{E_b R_b}{N_0 B} = \frac{E_b}{N_0}\cdot\frac{R_b}{B}. $$

<p><b>Step 2 — Take the required-SNR case.</b> Using the demodulator's required $E_b/N_0$:</p>
$$ \left(\frac{S}{N}\right)_{req} = \frac{E_b}{N_0}\cdot\frac{R_b}{B}. $$

<p><b>Step 3 — Convert to dB.</b> The product becomes a sum of dB terms:</p>
$$ \left(\frac{S}{N}\right)_{req}[\text{dB}] = \frac{E_b}{N_0}[\text{dB}] + 10\log_{10}\frac{R_b}{B}. $$
<p>Note $R_b/B = 1/G_p$, so $10\log_{10}(R_b/B) = -G_p[\text{dB}]$ — the spreading is what makes $(S/N)_{req}$ negative (signal below noise).</p>

<p><b>Result.</b> $$ \boxed{\,\left(\frac{S}{N}\right)_{req}=\frac{E_b}{N_0}\cdot\frac{R_b}{B}\;\Rightarrow\;\left(\frac{S}{N}\right)_{req}[\text{dB}]=\frac{E_b}{N_0}[\text{dB}]+10\log_{10}\frac{R_b}{B}\,} $$ Intuition/sanity check: since $R_b\ll B$ in spread spectrum, $10\log_{10}(R_b/B)$ is a large negative number — the required wideband $S/N$ can sit well below $0$ dB, quantifying how spread signals hide beneath the noise.</p>
`,
    5: String.raw`
<p><b>Where we start.</b> Forward error correction lowers the $E_b/N_0$ (hence the $S/N$) the demodulator needs, by exactly its coding gain $G_{coding}$. We fold that saving into the jamming-margin budget.</p>

<p><b>Step 1 — Start from the uncoded margin.</b> Without coding, $M_j = G_p - L_{sys} - \left(\frac{S}{N}\right)_{req,\,uncoded}$.</p>

<p><b>Step 2 — Coding reduces the required SNR.</b> Coding gain means the demod now needs $G_{coding}$ dB less SNR: $\left(\frac{S}{N}\right)_{req,\,coded} = \left(\frac{S}{N}\right)_{req,\,uncoded} - G_{coding}$. Substitute into the margin:</p>
$$ M_j^{coded} = G_p - L_{sys} - \Big[\left(\tfrac{S}{N}\right)_{req,\,uncoded} - G_{coding}\Big]. $$

<p><b>Step 3 — Collect terms.</b> The coding gain adds directly to the margin:</p>
$$ M_j^{coded} = G_p + G_{coding} - L_{sys} - \left(\frac{S}{N}\right)_{req,\,uncoded}. $$

<p><b>Result.</b> $$ \boxed{\,M_j^{coded}=G_p+G_{coding}-L_{sys}-\left(\frac{S}{N}\right)_{req,\,uncoded}\,} $$ Intuition/sanity check: coding gain and processing gain stack additively (in dB) against the jammer. A $30$ dB $G_p$ plus $5$ dB coding gain buys $35$ dB of raw anti-jam headroom — which is why real military spread-spectrum links always pair spreading with strong FEC.</p>
`
  }
});
