// Spread Spectrum & Coding — the Trellis Diagram (the time-unrolled state machine Viterbi/BCJR decode on)
CONTENT.topics.push(
{
  id: 'trellis-diagram',
  title: 'Trellis Diagram',
  category: 'Spread Spectrum & Coding',
  tags: ['trellis', 'Viterbi', 'state diagram', 'branch metric', 'path metric', 'survivor path', 'add-compare-select', 'traceback'],
  summary: String.raw`A trellis diagram unrolls a finite-state encoder in time — a column of states at each step joined by branches labelled input/output — turning maximum-likelihood decoding into a shortest-path search that the Viterbi and BCJR algorithms solve with add–compare–select and traceback.`,
  diagram: [{
    title: String.raw`State diagram unrolled into a trellis`,
    svg: String.raw`<svg viewBox="0 0 540 270" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-trellis-diagram" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<text x="12" y="18" fill="#e6edf3">4-state (7,5)&#8323; encoder unrolled over time; branch label = output v&#8321;v&#8322;</text>
<text x="12" y="34" fill="#9aa7b5">solid = input 0, dashed = input 1</text>
<text x="26" y="66" fill="#4dabf7">00</text><text x="26" y="116" fill="#ffa94d">10</text><text x="26" y="166" fill="#63e6be">01</text><text x="26" y="216" fill="#b197fc">11</text>
<text x="88" y="248" fill="#9aa7b5">t</text><text x="220" y="248" fill="#9aa7b5">t+1</text><text x="352" y="248" fill="#9aa7b5">t+2</text><text x="484" y="248" fill="#9aa7b5">t+3</text>
<circle cx="90" cy="62" r="5" fill="#4dabf7"/><circle cx="90" cy="112" r="5" fill="#ffa94d"/><circle cx="90" cy="162" r="5" fill="#63e6be"/><circle cx="90" cy="212" r="5" fill="#b197fc"/>
<circle cx="222" cy="62" r="5" fill="#4dabf7"/><circle cx="222" cy="112" r="5" fill="#ffa94d"/><circle cx="222" cy="162" r="5" fill="#63e6be"/><circle cx="222" cy="212" r="5" fill="#b197fc"/>
<circle cx="354" cy="62" r="5" fill="#4dabf7"/><circle cx="354" cy="112" r="5" fill="#ffa94d"/><circle cx="354" cy="162" r="5" fill="#63e6be"/><circle cx="354" cy="212" r="5" fill="#b197fc"/>
<circle cx="486" cy="62" r="5" fill="#4dabf7"/><circle cx="486" cy="112" r="5" fill="#ffa94d"/><circle cx="486" cy="162" r="5" fill="#63e6be"/><circle cx="486" cy="212" r="5" fill="#b197fc"/>
<line x1="95" y1="62" x2="217" y2="62" stroke="#9aa7b5"/><text x="140" y="56" fill="#9aa7b5">00</text>
<line x1="95" y1="62" x2="217" y2="112" stroke="#9aa7b5" stroke-dasharray="5,3"/><text x="140" y="92" fill="#9aa7b5">11</text>
<line x1="95" y1="112" x2="217" y2="162" stroke="#9aa7b5"/><text x="140" y="142" fill="#9aa7b5">10</text>
<line x1="95" y1="112" x2="217" y2="212" stroke="#9aa7b5" stroke-dasharray="5,3"/><text x="140" y="178" fill="#9aa7b5">01</text>
<line x1="95" y1="162" x2="217" y2="62" stroke="#9aa7b5"/><text x="140" y="110" fill="#9aa7b5">11</text>
<line x1="95" y1="212" x2="217" y2="162" stroke="#9aa7b5" stroke-dasharray="5,3"/><text x="140" y="200" fill="#9aa7b5">00</text>
<line x1="227" y1="62" x2="349" y2="62" stroke="#9aa7b5"/>
<line x1="227" y1="62" x2="349" y2="112" stroke="#9aa7b5" stroke-dasharray="5,3"/>
<line x1="227" y1="112" x2="349" y2="162" stroke="#9aa7b5"/>
<line x1="227" y1="112" x2="349" y2="212" stroke="#9aa7b5" stroke-dasharray="5,3"/>
<line x1="227" y1="162" x2="349" y2="62" stroke="#9aa7b5"/>
<line x1="227" y1="212" x2="349" y2="162" stroke="#9aa7b5" stroke-dasharray="5,3"/>
<line x1="359" y1="62" x2="481" y2="62" stroke="#9aa7b5" marker-end="url(#arr-trellis-diagram)"/>
<line x1="359" y1="112" x2="481" y2="162" stroke="#9aa7b5" marker-end="url(#arr-trellis-diagram)"/>
<line x1="359" y1="162" x2="481" y2="62" stroke="#9aa7b5" marker-end="url(#arr-trellis-diagram)"/>
<line x1="359" y1="212" x2="481" y2="162" stroke="#9aa7b5" stroke-dasharray="5,3" marker-end="url(#arr-trellis-diagram)"/>
</svg>`,
    caption: String.raw`The state diagram unrolled in time. Each column is the four register states at one clock; from every node input 0 (solid) and input 1 (dashed) fire one branch, labelled with the emitted output pair. Paths that reach the same state at the same time merge — that merging is what makes the trellis decodable.`
  },
  {
    title: String.raw`One trellis stage &#8594; add&#8211;compare&#8211;select`,
    svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-trellis-diagram" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<text x="12" y="18" fill="#e6edf3">two branches enter a state; ACS keeps the smaller accumulated metric</text>
<text x="12" y="34" fill="#9aa7b5">branch metric = Hamming (hard) or Euclidean (soft) distance</text>
<circle cx="70" cy="80" r="6" fill="#4dabf7"/><text x="24" y="84" fill="#9aa7b5">PM=3</text><text x="52" y="66" fill="#4dabf7">s'&#8320;</text>
<circle cx="70" cy="180" r="6" fill="#63e6be"/><text x="24" y="184" fill="#9aa7b5">PM=1</text><text x="52" y="204" fill="#63e6be">s'&#8321;</text>
<circle cx="360" cy="130" r="6" fill="#ffa94d"/><text x="374" y="134" fill="#ffa94d">s (next state)</text>
<line x1="76" y1="80" x2="354" y2="126" stroke="#4dabf7" marker-end="url(#arr2-trellis-diagram)"/>
<text x="150" y="96" fill="#4dabf7">+ bm=2  &#8594; 3+2=5</text>
<line x1="76" y1="180" x2="354" y2="134" stroke="#63e6be" marker-end="url(#arr2-trellis-diagram)"/>
<text x="150" y="176" fill="#63e6be">+ bm=1  &#8594; 1+1=2  &#10003; survivor</text>
<rect x="150" y="205" width="240" height="30" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="162" y="224" fill="#e6edf3">ADD &#8226; COMPARE(5,2) &#8226; SELECT min = 2</text>
</svg>`,
    caption: String.raw`Zoom on one state. Each incoming branch adds its branch metric (Hamming or Euclidean distance) to the old path metric of its source state; the decoder compares the candidate sums and selects the minimum, storing that value and which branch won. This add–compare–select step is the atom of Viterbi decoding, repeated for every state at every stage.`
  },
  {
    title: String.raw`Survivor traceback = maximum-likelihood path`,
    svg: String.raw`<svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-trellis-diagram" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<text x="12" y="18" fill="#e6edf3">after the forward sweep, trace the winning branches backwards</text>
<text x="12" y="34" fill="#9aa7b5">grey = pruned branches, orange = surviving ML path</text>
<text x="26" y="66" fill="#4dabf7">00</text><text x="26" y="116" fill="#4dabf7">10</text><text x="26" y="166" fill="#4dabf7">01</text><text x="26" y="216" fill="#4dabf7">11</text>
<circle cx="80" cy="62" r="5" fill="#9aa7b5"/><circle cx="80" cy="112" r="5" fill="#9aa7b5"/><circle cx="80" cy="162" r="5" fill="#9aa7b5"/><circle cx="80" cy="212" r="5" fill="#9aa7b5"/>
<circle cx="220" cy="62" r="5" fill="#9aa7b5"/><circle cx="220" cy="112" r="5" fill="#9aa7b5"/><circle cx="220" cy="162" r="5" fill="#9aa7b5"/><circle cx="220" cy="212" r="5" fill="#9aa7b5"/>
<circle cx="360" cy="62" r="5" fill="#9aa7b5"/><circle cx="360" cy="112" r="5" fill="#9aa7b5"/><circle cx="360" cy="162" r="5" fill="#9aa7b5"/><circle cx="360" cy="212" r="5" fill="#9aa7b5"/>
<circle cx="500" cy="62" r="5" fill="#9aa7b5"/><circle cx="500" cy="112" r="5" fill="#9aa7b5"/><circle cx="500" cy="162" r="5" fill="#9aa7b5"/><circle cx="500" cy="212" r="5" fill="#9aa7b5"/>
<line x1="85" y1="62" x2="215" y2="112" stroke="#9aa7b5"/><line x1="85" y1="112" x2="215" y2="212" stroke="#9aa7b5"/>
<line x1="225" y1="112" x2="355" y2="162" stroke="#9aa7b5"/><line x1="225" y1="212" x2="355" y2="112" stroke="#9aa7b5"/>
<line x1="365" y1="62" x2="495" y2="112" stroke="#9aa7b5"/><line x1="365" y1="162" x2="495" y2="212" stroke="#9aa7b5"/>
<line x1="85" y1="62" x2="215" y2="62" stroke="#ffa94d" stroke-width="2.5"/>
<line x1="225" y1="62" x2="355" y2="112" stroke="#ffa94d" stroke-width="2.5"/>
<line x1="365" y1="112" x2="495" y2="162" stroke="#ffa94d" stroke-width="2.5" marker-end="url(#arr3-trellis-diagram)"/>
<circle cx="80" cy="62" r="6" fill="#ffa94d"/><circle cx="220" cy="62" r="6" fill="#ffa94d"/><circle cx="360" cy="112" r="6" fill="#ffa94d"/><circle cx="500" cy="162" r="6" fill="#ffa94d"/>
<text x="70" y="248" fill="#9aa7b5">start</text><text x="470" y="248" fill="#9aa7b5">end (min metric)</text>
</svg>`,
    caption: String.raw`Once the forward pass finishes, pick the terminal state with the smallest path metric and walk its stored survivor pointers back to the start. The highlighted orange chain is the single maximum-likelihood path; the input bits that label its branches are the decoded message.`
  }],
  prerequisites: ['convolutional-codes', 'viterbi'],
  related: ['viterbi', 'convolutional-codes', 'fec', 'turbo-codes', 'ldpc'],
  intro: String.raw`<p><strong>Why do we need a trellis at all?</strong> A convolutional encoder — or any finite-state machine — is easy to describe as a state diagram: a handful of states with arrows between them. But the state diagram hides <em>time</em>. When a decoder receives a noisy sequence and must ask "which sequence of state transitions most likely produced this?", a static state diagram gives no place to reason about <em>when</em> each transition happened, and the naïve alternative — the tree of all possible input sequences — explodes as $2^L$ for an $L$-bit message. A machine's behaviour over time is genuinely hard to reason about in either picture.</p>
<p>The <strong>trellis diagram</strong> is the fix. It takes the state diagram and <em>unrolls it in time</em>: draw a column of all the states at time $t$, another column at $t{+}1$, and connect them with exactly the branches the state diagram allows. Because paths that reach the same state at the same time are indistinguishable from that point forward, the trellis <em>merges</em> the tree's redundant branches back together, so its width stays fixed at the number of states instead of doubling every step. That single structural fact converts maximum-likelihood decoding from an exponential search into a <strong>shortest-path problem</strong> on a graph — solvable in linear time by the Viterbi algorithm's add–compare–select recursion. The trellis is not a decoder; it is the <em>arena</em> every convolutional decoder (Viterbi, BCJR/MAP, SOVA) runs in.</p>`,
  sections: [
    {
      h: String.raw`State = shift-register contents; the trellis unrolls it over time`,
      html: String.raw`<p>Start from the encoder's <strong>state</strong>. For a rate-$k/n$ convolutional encoder with $m$ memory cells, the state is simply the contents of those cells — the $m$ most recent past input bits. Nothing about the encoder's future output depends on <em>how</em> those bits got there; only on what they are. That Markov property is the whole reason a compact state description exists: there are $2^m$ possible register contents, hence $2^m$ states.</p>
<p>The <strong>state diagram</strong> draws those $2^m$ states as nodes and, for each possible input, an arrow to the next state labelled with the emitted output bits. It is compact but timeless — it tells you the rules of transition, not the history of a particular run.</p>
<p>A <strong>trellis diagram</strong> is that same state machine <em>unrolled along a time axis</em>. Draw the $2^m$ states as a vertical column at time $t$; draw another identical column at $t{+}1$; then, for every legal transition in the state diagram, draw a <em>branch</em> from the source state in column $t$ to the destination state in column $t{+}1$. Repeat for every time step of the received sequence. The result is a lattice — the word "trellis" is borrowed from the garden lattice it resembles.</p>
<div class="callout tip"><b>Intuition.</b> The state diagram is a <em>map</em> of a city (which streets connect which intersections). The trellis is your <em>itinerary grid</em>: the same intersections copied once per hour, with roads drawn only between consecutive hours. Decoding is then just "find the cheapest route across the grid".</div>`
    },
    {
      h: String.raw`Nodes and branches: what each element means`,
      html: String.raw`<p>The trellis has exactly two kinds of element, and reading them fluently is half the battle:</p>
<ul>
<li><strong>Nodes</strong> are states at a given time step. A node at $(\text{state } s,\ \text{time } t)$ says "the encoder register held $s$ just before the $t$-th input arrived." Each column has $2^m$ nodes; the number of columns equals the number of decoded time steps (plus tail).</li>
<li><strong>Branches</strong> are state transitions. A branch from node $s'$ (at $t$) to node $s$ (at $t{+}1$) represents one specific input symbol that drives the register from $s'$ to $s$. It is labelled <strong>input / output</strong>: the $k$ input bits that caused the transition, and the $n$ code bits the encoder emitted on that transition.</li>
</ul>
<p>From each node there are exactly $2^k$ outgoing branches (one per possible $k$-bit input) and, in a well-formed code, $2^k$ incoming branches. For the common $k=1$ case that is two out, two in — the "butterfly" pattern. By convention a solid branch is input 0 and a dashed branch is input 1, so you can read the input sequence straight off the drawn path.</p>
<p>Crucially, a <em>path</em> through the trellis — a connected chain of branches from the initial state onward — corresponds one-to-one with a candidate <strong>input sequence</strong> and its <strong>codeword</strong>. Decoding is the search for the best path.</p>`
    },
    {
      h: String.raw`How the trellis is derived from the state diagram by unfolding`,
      html: String.raw`<p>The derivation is mechanical. Take the $(7,5)_8$, $K{=}3$ encoder, whose four states are $00,10,01,11$. Its state diagram says, for example: from state $00$, input 0 emits $00$ and stays in $00$; input 1 emits $11$ and moves to $10$. From state $10$, input 0 emits $10$ and goes to $01$; input 1 emits $01$ and goes to $11$. And so on for all four states.</p>
<p>To unfold, place the four states in a column at $t$. Copy that column at $t{+}1$. Now redraw every state-diagram arrow as a branch from its source in column $t$ to its destination in column $t{+}1$, carrying the same input/output label. Stack another copy for $t{+}2$, and so on. Self-loops in the state diagram (e.g. $00 \xrightarrow{0/00} 00$) become horizontal branches; transitions to other states become diagonal branches.</p>
<p>Two structural features emerge from the unfolding that the state diagram could not show:</p>
<ul>
<li><strong>Merging.</strong> Two different partial paths can arrive at the <em>same</em> node. From there on they are indistinguishable, so the decoder can discard all but the best — this is exactly what caps complexity.</li>
<li><strong>Time-invariance.</strong> Every interior stage looks identical (same branch pattern), because the code is time-invariant. Only the <em>start</em> (register known to be $00$) and, if terminated, the <em>end</em> differ.</li>
</ul>
<div class="callout tip"><b>Intuition.</b> Unfolding trades the state diagram's compactness for an explicit time axis. You pay with width (one column per step) but gain the ability to say "at this instant, these are the live hypotheses" — which is precisely what a decoder needs.</div>`
    },
    {
      h: String.raw`Branch metric: Hamming for hard decisions, Euclidean for soft`,
      html: String.raw`<p>To decode we must score how well each branch's <em>expected</em> output matches what was actually received in that time step. That score is the <strong>branch metric</strong> $\gamma$. Its form depends on the demodulator's output:</p>
<ul>
<li><strong>Hard-decision (Hamming) metric.</strong> The demodulator already sliced each received symbol to a 0 or 1. The branch metric is the <em>Hamming distance</em> between the branch's $n$ expected code bits and the $n$ received bits — i.e. how many of the $n$ positions disagree. Fewer disagreements = smaller metric = better match.</li>
<li><strong>Soft-decision (Euclidean) metric.</strong> The demodulator hands over analog/quantized reliabilities $r_j$ instead of hard bits. The branch metric is the squared <em>Euclidean distance</em> $\sum_j (r_j - c_j)^2$ between the received samples and the branch's ideal symbols $c_j$ (equivalently, a correlation metric $-\sum_j r_j c_j$). Soft metrics use the confidence the hard slicer threw away, buying roughly <strong>2 dB</strong> of coding gain.</li>
</ul>
<p>Either way the metric is <em>local</em>: it depends only on one branch's label and one time step's received data. That locality is what lets the decoder build long-path scores incrementally by simple addition.</p>`
    },
    {
      h: String.raw`Path metric, survivor paths, and add–compare–select`,
      html: String.raw`<p>A <strong>path metric</strong> is the running sum of branch metrics along a path from the start to some node — the total mismatch a candidate sequence has accumulated so far. The maximum-likelihood path is the one with the smallest total path metric (for Hamming/Euclidean distances, "smallest" = "most likely").</p>
<p>Here the merging property pays off. At each node, several branches arrive, each extending a different partial path. The decoder computes, for each incoming branch, the candidate metric <em>old path metric of the source node + branch metric</em>, then keeps only the single best (minimum) — the <strong>survivor</strong> — and discards the rest. Because any future extension is common to all paths reaching this node, discarding the losers can never lose the optimum. This three-step operation is <strong>add–compare–select (ACS)</strong>:</p>
<ul>
<li><strong>Add</strong> each incoming survivor's path metric to its branch metric.</li>
<li><strong>Compare</strong> the resulting candidate metrics.</li>
<li><strong>Select</strong> the minimum as the node's new survivor, recording which branch won.</li>
</ul>
<p>After processing every node in a column, each of the $2^m$ nodes holds exactly one survivor path and its metric. ACS is the computational heart of Viterbi decoding, and dedicated ACS units in silicon run at hundreds of Mb/s.</p>
<div class="callout tip"><b>Intuition.</b> At every intersection you keep only the cheapest way to have gotten there, because from that intersection onward the route options are identical no matter how you arrived. Keeping the loser can never help.</div>`
    },
    {
      h: String.raw`Traceback: recovering the decoded bits`,
      html: String.raw`<p>The forward ACS sweep leaves each node with a pointer to the branch that won its survivor. To read out the message we run <strong>traceback</strong>: pick the terminal node with the smallest path metric (or, if the code is zero-terminated, the known final state $00$), then walk the survivor pointers <em>backwards</em> to the start. The chain of branches visited is the maximum-likelihood path, and the input labels on those branches — read in forward order — are the decoded bits.</p>
<p>In a streaming (non-terminated) decoder we cannot wait for the end of an infinite sequence. Instead we exploit the fact that all survivors tend to <em>merge</em> into a common history after a finite depth: choose a <strong>traceback depth</strong> of about $5K$ to $6K$ branches (for constraint length $K$), trace back that far from the current best state, and emit the oldest decided bit. With that depth the truncation loss is negligible while latency and memory stay bounded.</p>
<div class="callout tip"><b>Intuition.</b> You do not need to know the whole future to be sure about the distant past. Once every live path agrees on what happened $5K$ steps ago, that bit is settled — commit it and move on.</div>`
    },
    {
      h: String.raw`The trellis is what Viterbi and BCJR actually run on`,
      html: String.raw`<p>The trellis is deliberately <em>algorithm-agnostic</em>: it is a data structure, and different decoders sweep it differently.</p>
<ul>
<li><strong>Viterbi (MLSE).</strong> A single forward pass with ACS keeping one <em>minimum-metric</em> survivor per node, then traceback. It finds the single most likely <em>sequence</em>.</li>
<li><strong>BCJR / MAP.</strong> A <em>forward</em> recursion ($\alpha$) and a <em>backward</em> recursion ($\beta$) over the very same trellis, combined with branch metrics ($\gamma$) to produce the a-posteriori probability of <em>each bit</em>. Where Viterbi's ACS uses $\min$, BCJR uses a soft $\max^*$ (log-sum) to marginalize over paths instead of picking one. This per-bit soft output is what iterative decoders (turbo) need.</li>
<li><strong>SOVA.</strong> Viterbi plus a reliability update — a cheaper soft-output compromise.</li>
</ul>
<p>All three see the identical nodes-and-branches lattice; they differ only in how they combine metrics along it. That is why "understanding the trellis" is the prerequisite for understanding <em>any</em> convolutional decoder.</p>`
    },
    {
      h: String.raw`Termination, tail bits, and the puncturing view`,
      html: String.raw`<p>A finite message needs its trellis <em>closed off</em> so the decoder knows the final state:</p>
<ul>
<li><strong>Zero-flushing (tail bits).</strong> Append $m$ known zero bits after the message. These drive the register back to the all-zero state $00$, forcing the trellis to funnel into a single known terminal node. The cost is $m$ extra coded steps — a small rate penalty that matters for short blocks.</li>
<li><strong>Tail-biting.</strong> Constrain the encoder to <em>start and end in the same</em> (data-dependent) state, so no tail bits are wasted. The trellis becomes circular; decoding costs a little more (you must guess or iterate over the start state) but wastes zero overhead — used in LTE/5G short control channels.</li>
</ul>
<p><strong>Puncturing on the trellis.</strong> To raise the rate, some coded bits are deleted before transmission. The decoder does <em>not</em> change the trellis at all: at each punctured position it simply inserts a <em>neutral</em> branch metric (an erasure — zero contribution, or LLR $=0$ for soft decoding) for the missing bit, then runs ordinary ACS on the mother code's trellis. One trellis therefore serves a whole family of rates.</p>`
    },
    {
      h: String.raw`What you should now understand`,
      html: String.raw`<div class="callout tip"><p>If the trellis has clicked, you should be able to explain each of these in a sentence:</p>
<ul>
<li><strong>What a trellis is.</strong> A finite-state machine unrolled in time — a column of $2^m$ states per step, joined by branches labelled input/output — that merges the tree's redundant paths so its width stays fixed.</li>
<li><strong>Nodes vs branches.</strong> A node is a state at a time step; a branch is a state transition carrying one input and its emitted output; a path is one candidate message/codeword.</li>
<li><strong>Branch and path metrics.</strong> The branch metric scores one transition against the received symbols (Hamming for hard, Euclidean for soft); the path metric is their running sum — the total mismatch of a candidate.</li>
<li><strong>Add–compare–select and survivors.</strong> At each node the decoder adds branch metrics to incoming survivors, compares, and selects the minimum, keeping one survivor per state because future options are common once you arrive.</li>
<li><strong>Traceback.</strong> Walking the stored survivor pointers back from the best terminal node recovers the maximum-likelihood bits; a depth of $\approx 5K$ enables streaming.</li>
<li><strong>Why it matters.</strong> Viterbi, BCJR/MAP, and SOVA all run on this same lattice; termination/tail bits close it, and puncturing reuses it across rates.</li>
</ul></div>`
    },
    {
      h: String.raw`Further reading`,
      html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Convolutional_code" target="_blank" rel="noopener">Wikipedia — Convolutional code</a> — canonical overview whose trellis-diagram section shows the encoder as a finite state machine unrolled into a lattice, with the Viterbi and BCJR decoders that sweep it.</li>
<li><a href="https://ocw.mit.edu/courses/6-02-introduction-to-eecs-ii-digital-communication-systems-fall-2012/f398fa4a366439301b3d17e45e028952_MIT6_02F12_lec07.pdf" target="_blank" rel="noopener">MIT OCW 6.02 — Lecture 7: Viterbi decoding</a> — worked lecture slides that build the (7,5) trellis step by step and walk branch metrics, path metrics, and add-compare-select on concrete numbers.</li>
<li><a href="https://en.wikipedia.org/wiki/BCJR_algorithm" target="_blank" rel="noopener">Wikipedia — BCJR algorithm</a> — the forward-backward MAP decoder that runs on the identical trellis, deriving the per-bit soft outputs (and Max-Log-MAP variants) that iterative turbo/LDPC decoders need.</li>
<li><a href="https://www.mathworks.com/help/comm/ref/comm.viterbidecoder-system-object.html" target="_blank" rel="noopener">MathWorks — comm.ViterbiDecoder</a> — vendor reference tying the abstract trellis to a real decoder: trellis structures via poly2trellis, traceback depth, hard/soft/unquantized metrics, and continuous/truncated/terminated termination.</li>
</ul>`
    }
  ],
  keyPoints: [
    String.raw`A trellis is a finite-state encoder <b>unrolled in time</b>: a column of $2^m$ state nodes at each step, connected by branches to the next column.`,
    String.raw`A <b>node</b> is a state at a time index; a <b>branch</b> is a state transition labelled <b>input / output</b>; a <b>path</b> is one candidate input sequence and its codeword.`,
    String.raw`The trellis is derived from the state diagram by copying its states once per time step and redrawing each legal transition as a branch — merging the tree's redundant paths.`,
    String.raw`The <b>branch metric</b> scores one transition against the received data: <b>Hamming</b> distance for hard decisions, <b>Euclidean</b> (squared) distance for soft decisions (~2 dB gain).`,
    String.raw`The <b>path metric</b> is the running sum of branch metrics; the maximum-likelihood path minimizes it.`,
    String.raw`<b>Add–compare–select (ACS)</b> keeps one <b>survivor</b> per node — add branch metric to each incoming survivor, compare, select the minimum — which caps decoding complexity.`,
    String.raw`<b>Traceback</b> walks the stored survivor pointers backwards from the best terminal state to recover the decoded bits.`,
    String.raw`Streaming decoders use a <b>traceback depth</b> of about $5K$–$6K$ branches, after which survivors have almost surely merged.`,
    String.raw`Viterbi (min-metric survivor) and BCJR/MAP (forward $\alpha$, backward $\beta$, $\max^*$) run on the <b>same</b> trellis; the trellis itself is decoder-agnostic.`,
    String.raw`<b>Termination</b> closes the trellis: zero-flushing appends $m$ tail bits to force state $00$; tail-biting starts and ends in the same state with no overhead.`,
    String.raw`<b>Puncturing</b> reuses one trellis for many rates: deleted bits are decoded as neutral (erasure) branch metrics; the mother-code trellis is unchanged.`,
    String.raw`A rate-$k/n$, memory-$m$ code has $2^m = 2^{K-1}$ nodes per column and $2^k$ branches leaving each node.`
  ],
  equations: [
    {
      title: 'Trellis width and branch fan-out',
      tex: String.raw`$$ N_{states} = 2^{m} = 2^{K-1}, \qquad B_{node} = 2^{k} $$`,
      derivation: String.raw`<p><b>Where we start.</b> A rate-$k/n$ convolutional encoder holds $m$ memory bits and takes in $k$ new bits each clock. The trellis draws one node per possible state per time step, and one branch per possible transition out of each node. We want the number of nodes in a column (the trellis "width") and the number of branches leaving each node.</p>
<p><b>Step 1 — count the states.</b> The encoder's next output and next state depend only on the current register contents, not on their history (the Markov/state property). The register stores $m$ bits, so the number of distinct contents — hence the number of nodes in one trellis column — is the number of binary strings of length $m$:</p>
$$ N_{states} = 2^{m}. $$
<p><b>Step 2 — express via constraint length.</b> The constraint length is $K = m+1$ (present bit plus $m$ remembered bits), so $m = K-1$ and</p>
$$ N_{states} = 2^{m} = 2^{K-1}. $$
<p><b>Step 3 — count outgoing branches.</b> A transition is triggered by the $k$ new input bits arriving this clock. There are $2^k$ distinct $k$-bit inputs, and each produces one branch to a (generally distinct) next state. Hence every node has $B_{node}=2^k$ outgoing branches (and, for a non-catastrophic code, $2^k$ incoming ones — the butterfly).</p>
<p><b>Result.</b> $$ N_{states}=2^{K-1}, \qquad B_{node}=2^{k}. $$ For the $(7,5)_8$, $K=3$, rate-1/2 code: $N_{states}=2^{2}=4$ nodes per column and $2^{1}=2$ branches per node. For the standard $K=7$ code: $2^{6}=64$ nodes per column. Total branches processed per stage is $N_{states}\times B_{node}=2^{K-1}2^{k}$, which sets Viterbi's per-step cost.</p>`
    },
    {
      title: 'Accumulated path metric recursion (ACS)',
      tex: String.raw`$$ PM_{t+1}(s) = \min_{s' \to s}\Big[\, PM_t(s') + \gamma_t(s' \to s) \,\Big] $$`,
      derivation: String.raw`<p><b>Where we start.</b> Every node $s$ at time $t{+}1$ holds a <em>survivor</em> path metric $PM_{t+1}(s)$: the smallest total branch-metric sum of any path from the start that reaches state $s$ at time $t{+}1$. We want a recursion that computes it from the previous column's survivors and the local branch metrics $\gamma_t(s'\to s)$.</p>
<p><b>Step 1 — enumerate the incoming candidates.</b> Any path ending at $s$ at time $t{+}1$ must have passed through some predecessor state $s'$ at time $t$ (there are $2^k$ such predecessors) and then taken the branch $s'\to s$. The total metric of such a path is the survivor metric already accumulated at $s'$ plus the metric of the final branch:</p>
$$ \text{candidate}(s') = PM_t(s') + \gamma_t(s' \to s). $$
<p>This is the <b>Add</b> step.</p>
<p><b>Step 2 — why the old survivor suffices.</b> Any optimal path to $s$ that passes through $s'$ must use the <em>best</em> path to $s'$ (otherwise swapping in the better prefix would lower the total, a contradiction). So we only need $PM_t(s')$, not every path into $s'$. This is the principle of optimality that makes the recursion valid.</p>
<p><b>Step 3 — compare and select.</b> Among the $2^k$ candidates (one per predecessor), keep the minimum — the <b>Compare</b> and <b>Select</b> steps — and record which branch won for later traceback:</p>
$$ PM_{t+1}(s) = \min_{s' \to s}\big[\,PM_t(s') + \gamma_t(s'\to s)\,\big]. $$
<p><b>Result.</b> Iterating this add–compare–select over every state and every time step is the Viterbi algorithm. It is a dynamic program: cost $O(L\,2^{K-1}2^{k})$ — linear in sequence length $L$, exponential only in $K$. (BCJR uses the same graph but replaces $\min$ with the soft $\max^*(a,b)=\ln(e^a+e^b)$ to sum over paths instead of picking one.)</p>`
    },
    {
      title: 'Hamming branch metric (hard-decision)',
      tex: String.raw`$$ \gamma_t(s' \to s) = d_H\big(\mathbf{r}_t,\ \mathbf{c}(s' \to s)\big) = \sum_{j=1}^{n}\big(r_{t,j} \oplus c_j\big) $$`,
      derivation: String.raw`<p><b>Where we start.</b> With hard decisions, the demodulator has already sliced each received code symbol into a bit. In one time step it delivers an $n$-bit vector $\mathbf r_t=(r_{t,1},\dots,r_{t,n})$. Each trellis branch $s'\to s$ carries an $n$-bit expected output $\mathbf c(s'\to s)=(c_1,\dots,c_n)$. We want a branch metric proportional to the negative log-likelihood of receiving $\mathbf r_t$ if that branch were taken.</p>
<p><b>Step 1 — likelihood on a binary symmetric channel.</b> On a BSC with crossover probability $p<0.5$, each of the $n$ positions is received correctly with probability $1-p$ and flipped with probability $p$, independently. If the branch and the received vector disagree in $d$ positions,</p>
$$ P(\mathbf r_t \mid \text{branch}) = p^{\,d}\,(1-p)^{\,n-d}. $$
<p><b>Step 2 — take the negative log.</b> Maximizing likelihood = minimizing $-\ln P$. Taking logs turns the product into a sum:</p>
$$ -\ln P = -d\ln p - (n-d)\ln(1-p) = d\,\ln\!\tfrac{1-p}{p} - n\ln(1-p). $$
<p><b>Step 3 — drop the constant.</b> The term $-n\ln(1-p)$ is the same for every branch in a column, so it cannot change which branch wins; discard it. Since $p<0.5$ makes $\ln\frac{1-p}{p}>0$ a positive constant, minimizing $-\ln P$ is equivalent to minimizing $d$ itself.</p>
<p><b>Result.</b> $$ \gamma_t(s'\to s) = d = \sum_{j=1}^{n} (r_{t,j}\oplus c_j), $$ the <b>Hamming distance</b> between received and expected bits. Example: expected $c=11$, received $r=10$ gives $\gamma = (1\oplus1)+(1\oplus0)=0+1=1$. For soft decisions the same argument on an AWGN channel replaces the Hamming distance with the squared <b>Euclidean</b> distance $\sum_j (r_{t,j}-c_j)^2$, recovering the ~2 dB soft-decision gain.</p>`
    },
    {
      title: 'Traceback depth from free distance and merging',
      tex: String.raw`$$ L_{tb} \approx 5K \ \text{to}\ 6K, \qquad K = m+1 $$`,
      derivation: String.raw`<p><b>Where we start.</b> In a streaming decoder we cannot wait for the sequence to end before deciding old bits. We rely on the empirical fact that the $2^{K-1}$ survivor paths, traced backwards, tend to <em>merge</em> into a single common history after some depth. We want a rule of thumb for how deep to trace so that truncation loss is negligible.</p>
<p><b>Step 1 — why paths merge.</b> Two survivor paths that currently end in different states share a common past once you go back far enough, because a wrong path that diverges from the correct one must accumulate at least $d_{free}$ extra metric to compete, and it re-merges within a bounded span. The typical span of a low-weight divergence scales with the constraint length $K$ (the encoder's memory reach).</p>
<p><b>Step 2 — margin for safety.</b> A single merging span of a few constraint lengths guarantees merging only <em>on average</em>; noise occasionally stretches a divergence longer. Empirically and by simulation, choosing the depth several times the constraint length makes the probability that the survivors have <em>not</em> merged vanishingly small:</p>
$$ L_{tb} \approx 5K\ \text{to}\ 6K. $$
<p><b>Step 3 — apply.</b> For the standard $K=7$ code, $L_{tb}\approx 5\times 7 = 35$ to $6\times 7 = 42$ branches. For $K=3$, $L_{tb}\approx 15$–$18$. Deeper traceback only adds latency and memory without measurable BER benefit; shallower traceback risks committing a bit before the survivors agree.</p>
<p><b>Result.</b> $$ L_{tb} \approx 5K\text{–}6K. $$ This bounded, fixed depth is what lets a Viterbi decoder emit one decoded bit per input clock on an unbounded stream while staying within a hair of the optimal (fully terminated) decoder's performance.</p>`
    }
  ],
  flashcards: [
    { front: String.raw`What is a trellis diagram?`, back: String.raw`A finite-state encoder <b>unrolled in time</b>: a column of $2^m$ state nodes at each time step, connected by branches to the next column. It merges the tree's redundant paths so its width stays fixed at the number of states.` },
    { front: String.raw`What does a node represent? A branch?`, back: String.raw`A <b>node</b> is a state (register contents) at a specific time index. A <b>branch</b> is a state transition, labelled <b>input / output</b> — the input that caused it and the code bits emitted.` },
    { front: String.raw`How is the trellis derived from the state diagram?`, back: String.raw`Copy the state diagram's $2^m$ states once per time step, then redraw every legal transition as a branch from column $t$ to column $t{+}1$ with the same input/output label. Unfolding adds the time axis the state diagram lacks.` },
    { front: String.raw`What is a branch metric, and its two forms?`, back: String.raw`The mismatch between a branch's expected output and the received symbols in that step. <b>Hamming</b> distance for hard decisions; squared <b>Euclidean</b> distance (or correlation) for soft decisions (~2 dB better).` },
    { front: String.raw`What is a path metric?`, back: String.raw`The running sum of branch metrics along a path from the start to a node — the total accumulated mismatch of that candidate sequence. The maximum-likelihood path minimizes it.` },
    { front: String.raw`What is a survivor path?`, back: String.raw`At each node, the single best (minimum-metric) path reaching it. All other incoming paths are discarded because any future extension is common to them all, so keeping the loser can never help.` },
    { front: String.raw`What are the three steps of ACS?`, back: String.raw`<b>Add</b> each incoming survivor's path metric to its branch metric; <b>Compare</b> the candidate sums; <b>Select</b> the minimum as the node's new survivor (recording the winning branch). It is the atom of Viterbi decoding.` },
    { front: String.raw`What is traceback?`, back: String.raw`After the forward sweep, pick the terminal node with the smallest metric (or the known final state) and walk the survivor pointers backwards to the start; the branch input labels, read forward, are the decoded bits.` },
    { front: String.raw`What traceback depth is used for streaming, and why?`, back: String.raw`About $5K$–$6K$ branches. By that depth all survivors have almost surely merged into a common history, so the oldest bit is stable and can be emitted with negligible loss.` },
    { front: String.raw`Which decoders run on the trellis?`, back: String.raw`Viterbi (MLSE, min-metric survivor + traceback), BCJR/MAP (forward $\alpha$, backward $\beta$, $\max^*$ to get per-bit soft outputs), and SOVA. The trellis is the shared, decoder-agnostic arena.` },
    { front: String.raw`How is the trellis closed off for a finite message?`, back: String.raw`Termination. <b>Zero-flushing</b> appends $m$ tail bits to force the register to state $00$ (a known terminal node). <b>Tail-biting</b> starts and ends in the same state with no wasted bits (used in LTE/5G control).` },
    { front: String.raw`How does puncturing appear on the trellis?`, back: String.raw`The trellis is unchanged. At each punctured (deleted) position the decoder inserts a <b>neutral</b> branch metric (erasure / LLR $=0$) and runs ordinary ACS on the mother code's trellis, so one trellis serves many rates.` },
    { front: String.raw`How many nodes per column and branches per node?`, back: String.raw`$N_{states}=2^m=2^{K-1}$ nodes per column, and $2^k$ branches leaving each node (rate $k/n$). For $K=7$ that is 64 nodes; for $k=1$, two branches per node.` }
  ],
  mcqs: [
    { q: String.raw`A trellis diagram is best described as:`, options: [String.raw`a table of syndromes`, String.raw`a state diagram unrolled in time`, String.raw`a tree with no merging`, String.raw`a Tanner graph`], answer: 1, explain: String.raw`The trellis copies the states once per time step and connects them with the state diagram's transitions — the state machine unrolled along a time axis.` },
    { q: String.raw`In a trellis, a single branch represents:`, options: [String.raw`an entire codeword`, String.raw`one state transition, labelled input/output`, String.raw`the whole received sequence`, String.raw`a decoding error`], answer: 1, explain: String.raw`Each branch is one transition; its label gives the input that caused it and the code bits emitted.` },
    { q: String.raw`For a rate-1/2, memory-$m=2$ code, the number of nodes per trellis column is:`, options: [String.raw`2`, String.raw`4`, String.raw`8`, String.raw`16`], answer: 1, explain: String.raw`Nodes per column $=2^m=2^2=4$.` },
    { q: String.raw`The branch metric for hard-decision decoding is the:`, options: [String.raw`Euclidean distance`, String.raw`Hamming distance between expected and received bits`, String.raw`code rate`, String.raw`free distance`], answer: 1, explain: String.raw`Hard decisions give sliced bits, so the metric counts disagreeing positions — Hamming distance.` },
    { q: String.raw`Soft-decision decoding replaces the Hamming branch metric with:`, options: [String.raw`a larger Hamming distance`, String.raw`squared Euclidean (or correlation) distance`, String.raw`the constraint length`, String.raw`a random value`], answer: 1, explain: String.raw`Soft metrics use analog reliabilities via Euclidean/correlation distance, gaining roughly 2 dB.` },
    { q: String.raw`The path metric of a partial path is:`, options: [String.raw`the number of states`, String.raw`the running sum of its branch metrics`, String.raw`the traceback depth`, String.raw`the free distance`], answer: 1, explain: String.raw`It accumulates branch metrics from the start; the ML path minimizes this sum.` },
    { q: String.raw`At each node, add–compare–select keeps:`, options: [String.raw`all incoming paths`, String.raw`the single minimum-metric survivor`, String.raw`the maximum-metric path`, String.raw`a random incoming path`], answer: 1, explain: String.raw`Only the best (minimum-metric) survivor is retained; future extensions are common, so losers can be discarded.` },
    { q: String.raw`Two candidate paths reach a state with metrics 5 and 2 after ACS. The survivor metric is:`, options: [String.raw`7`, String.raw`5`, String.raw`2`, String.raw`3`], answer: 2, explain: String.raw`Select the minimum: $\min(5,2)=2$.` },
    { q: String.raw`Traceback recovers the decoded bits by:`, options: [String.raw`re-encoding the received sequence`, String.raw`walking survivor pointers backwards from the best terminal node`, String.raw`summing all path metrics`, String.raw`computing syndromes`], answer: 1, explain: String.raw`Following the stored survivor branches back to the start yields the ML path; its input labels are the message.` },
    { q: String.raw`A recommended streaming traceback depth for a $K=7$ code is roughly:`, options: [String.raw`7 branches`, String.raw`14 branches`, String.raw`35–42 branches`, String.raw`256 branches`], answer: 2, explain: String.raw`About $5K$–$6K = 35$–$42$ branches ensures the survivors have merged.` },
    { q: String.raw`Which statement about the trellis and decoders is correct?`, options: [String.raw`only Viterbi can use a trellis`, String.raw`Viterbi, BCJR/MAP and SOVA all run on the same trellis`, String.raw`BCJR needs a different graph than Viterbi`, String.raw`the trellis is only for encoding`], answer: 1, explain: String.raw`The trellis is decoder-agnostic; Viterbi uses $\min$, BCJR uses forward/backward with $\max^*$, on the identical lattice.` },
    { q: String.raw`Zero-flushing (tail bits) is used to:`, options: [String.raw`increase the code rate`, String.raw`force the encoder to a known final state, closing the trellis`, String.raw`remove the interleaver`, String.raw`double the number of states`], answer: 1, explain: String.raw`Appending $m$ zeros drives the register to state $00$, giving the decoder a known terminal node.` },
    { q: String.raw`On the trellis, a punctured (deleted) coded bit is handled by:`, options: [String.raw`adding a new state`, String.raw`inserting a neutral/erasure branch metric and running ordinary ACS`, String.raw`rebuilding the trellis`, String.raw`discarding the whole stage`], answer: 1, explain: String.raw`The mother-code trellis is unchanged; a zero-contribution (erasure) metric is used for the missing bit.` },
    { q: String.raw`Why does unrolling the state diagram into a trellis avoid the tree's exponential blow-up?`, options: [String.raw`it deletes states`, String.raw`paths reaching the same state at the same time merge, capping the width at $2^m$`, String.raw`it uses fewer branches per node`, String.raw`it ignores the input bits`], answer: 1, explain: String.raw`Merging keeps each column at $2^m$ nodes rather than doubling every step as the tree does.` }
  ],
  numericals: [
    { q: String.raw`How many states (nodes per trellis column) does the standard rate-1/2, constraint-length $K=7$ convolutional code have, and how many branches leave each node?`, solution: String.raw`<p><b>Formula.</b> The number of trellis states is $N_{states}=2^{m}=2^{K-1}$, where $m=K-1$ is the encoder memory. The number of branches leaving each node is $B_{node}=2^{k}$ for a rate-$k/n$ code (here $k=1$).</p>
<p><b>Substitute.</b> $K=7\Rightarrow m=K-1=6$, so $N_{states}=2^{6}$. For rate $1/2$, $k=1$, so $B_{node}=2^{1}$.</p>
<p><b>Compute.</b> $N_{states}=2^{6}=64$ nodes per column; $B_{node}=2^{1}=2$ branches per node. Total branches processed per stage $=64\times 2=128$.</p>
<p><b>Explanation.</b> The 64 states are the 64 possible contents of the 6-bit shift register; each state offers two outgoing branches, one for input 0 and one for input 1. This $2^{K-1}$ growth — 64 states here — is exactly why Viterbi complexity (one survivor and one ACS per state) explodes with constraint length, capping practical $K$ near 9.</p>` },
    { q: String.raw`A message of $L=100$ information bits is encoded by a $K=3$ (memory $m=2$) convolutional code and zero-terminated with tail bits. How many trellis stages (columns of transitions) does the decoder process?`, solution: String.raw`<p><b>Formula.</b> Zero-termination appends $m=K-1$ tail bits, so the total number of input bits is $L+m$, and the number of trellis transition stages equals that total (one stage per input bit).</p>
<p><b>Substitute.</b> $L=100$, $m=K-1=2$, so stages $=L+m=100+2$.</p>
<p><b>Compute.</b> Stages $=100+2=102$ transition columns (spanning $103$ node columns from the initial state to the terminal state).</p>
<p><b>Explanation.</b> Each information bit advances the trellis one stage; the two flush bits add two more stages that funnel every survivor back into the known state $00$, giving the decoder a definite terminal node for traceback. The tail costs a slight rate loss of $L/(L+m)=100/102\approx 98\%$ efficiency — negligible for long blocks, noticeable for short ones (a reason tail-biting is preferred there).</p>` },
    { q: String.raw`At a trellis node, two branches arrive. Branch A comes from a source with path metric 3 and has branch metric 2; branch B from a source with path metric 1 and branch metric 1. Perform add–compare–select: which survives, and what is the node's new path metric?`, solution: String.raw`<p><b>Formula.</b> ACS computes each candidate as $PM_{cand}=PM_{source}+\gamma_{branch}$, then the survivor is $PM_{new}=\min(\text{candidates})$.</p>
<p><b>Substitute.</b> Branch A: $PM_{cand,A}=3+2$. Branch B: $PM_{cand,B}=1+1$.</p>
<p><b>Compute.</b> $PM_{cand,A}=5$, $PM_{cand,B}=2$; $PM_{new}=\min(5,2)=2$, so <b>branch B survives</b> and the node stores metric $2$ with a pointer to B's source.</p>
<p><b>Explanation.</b> The decoder keeps only the cheaper way to have reached this state, because from here on the two paths would be extended identically — discarding A can never lose the optimum. The stored back-pointer to B is what traceback later follows to reconstruct the decoded bits.</p>` },
    { q: String.raw`A rate-1/2 branch expects the code pair $\mathbf c = 11$. The demodulator delivers the hard-decision pair $\mathbf r = 10$. Compute the Hamming branch metric.`, solution: String.raw`<p><b>Formula.</b> The hard-decision branch metric is the Hamming distance $\gamma=d_H(\mathbf r,\mathbf c)=\sum_{j=1}^{n}(r_j\oplus c_j)$, i.e. the number of disagreeing bit positions ($n=2$ here).</p>
<p><b>Substitute.</b> Compare position by position: bit 1 is $r_1=1$ vs $c_1=1$; bit 2 is $r_2=0$ vs $c_2=1$. So $\gamma=(1\oplus1)+(0\oplus1)$.</p>
<p><b>Compute.</b> $\gamma=(1\oplus1)+(0\oplus1)=0+1=1$.</p>
<p><b>Explanation.</b> The branch and the received pair disagree in exactly one of the two positions, so this branch is charged a metric of 1. During ACS this value is added to the source node's path metric; a perfectly matching branch would cost 0, and a fully mismatched pair would cost 2. Small branch metrics steer the survivor toward the maximum-likelihood path.</p>` },
    { q: String.raw`For a $K=7$ code, estimate the streaming traceback depth $L_{tb}$, and state how many surviving paths must be maintained during the forward sweep.`, solution: String.raw`<p><b>Formula.</b> The rule-of-thumb traceback depth is $L_{tb}\approx 5K$ to $6K$. The number of survivors maintained equals the number of states, $N_{states}=2^{K-1}$ (one survivor per node).</p>
<p><b>Substitute.</b> $K=7$: $L_{tb}\approx 5\times 7$ to $6\times 7$; survivors $=2^{K-1}=2^{6}$.</p>
<p><b>Compute.</b> $L_{tb}\approx 35$ to $42$ branches; survivors $=2^{6}=64$ paths held simultaneously.</p>
<p><b>Explanation.</b> The decoder keeps one survivor per state (64 of them), each with an accumulated metric and a history of back-pointers. Tracing back about $5K$–$6K\approx 35$–$42$ steps virtually guarantees all 64 survivors have merged into a common past, so the oldest bit can be output with negligible truncation loss while latency and memory stay bounded.</p>` }
  ],
  realWorld: String.raw`<p>The trellis is the silent workhorse inside almost every convolutional receiver ever built. A GSM handset runs a Viterbi decoder over the trellis of its $K=5$ code for every speech and control burst; Wi-Fi (802.11a/g/n) decodes punctured rate-1/2, $K=7$ convolutional codes on the same trellis at every OFDM symbol; deep-space probes (Voyager, Cassini) decoded the $(171,133)_8$, $K=7$ code's 64-state trellis with soft decisions to squeeze out ~5 dB of coding gain. Trellis-coded modulation (TCM), Ungerboeck's marriage of coding and modulation, decodes signal-constellation transitions on a trellis to gain coding without bandwidth expansion in voiceband and DSL modems. Even the capacity-approaching codes lean on it: each constituent decoder inside a turbo code runs the BCJR/MAP algorithm over an RSC trellis. Whenever you see "Viterbi", "BCJR", "MAP", or "SOVA" in a datasheet, a trellis is being swept underneath — nodes, branches, add–compare–select, and traceback, exactly as drawn here.</p>`
}
);
