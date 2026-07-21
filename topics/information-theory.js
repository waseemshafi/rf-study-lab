/* information-theory.js — "Information Theory" topic (Fundamentals).
   Single CONTENT.topics.push, deep schema, inline from-scratch derivations.
   This is the UMBRELLA framework: self-information, entropy, joint/conditional entropy,
   mutual information, relative entropy (KL), channel capacity C = max I(X;Y), and the two
   fundamental theorems (source coding, noisy-channel coding), plus data-processing and
   Fano's inequalities and differential entropy. It deliberately COMPLEMENTS the sibling
   topics rather than duplicating them: 'shannon' owns the AWGN result C = B log2(1+SNR)
   (referenced, never re-derived here); 'source-coding' owns Huffman/practical compression
   (referenced, not re-taught); 'channel-coding'/'fec' own the code families that the
   coding theorem makes possible. Cross-references, not re-derivations.
   All text in String.raw; no literal backticks, no dollar-immediately-before-curly-brace.
   Every SVG marker/def id is prefixed "information-theory-" to avoid collisions. */
CONTENT.topics.push(
  {
    id: 'information-theory',
    title: 'Information Theory',
    category: 'Fundamentals',
    tags: ['information theory', 'entropy', 'self-information', 'surprise', 'mutual information', 'conditional entropy', 'joint entropy', 'chain rule', 'KL divergence', 'relative entropy', 'Gibbs inequality', 'channel capacity', 'BSC', 'BEC', 'source coding theorem', 'noisy-channel coding theorem', 'data-processing inequality', 'Fano', 'differential entropy', 'bits', 'nats'],
    summary: String.raw`Information theory, founded by Claude Shannon in his 1948 paper <em>A Mathematical Theory of Communication</em>, is the mathematical framework that measures information and fixes the ultimate limits on compressing and communicating it. Its atom is <strong>self-information</strong> $I(x)=-\log_2 p(x)$ bits — the "surprise" of an outcome, larger for rarer events — and its central quantity is <strong>entropy</strong> $H(X)=-\sum_x p(x)\log_2 p(x)=\mathbb E[I(X)]$, the average uncertainty of a source in bits per symbol, bounded by $0\le H(X)\le\log_2|\mathcal X|$ (zero for a deterministic source, maximal for the uniform one). The <strong>binary entropy</strong> $H(p)=-p\log_2 p-(1-p)\log_2(1-p)$ is the concave bell that peaks at $H(0.5)=1$ bit. Two sources are tied together by the <strong>joint entropy</strong> $H(X,Y)$, the <strong>conditional entropy</strong> $H(Y\mid X)$ (leftover uncertainty about $Y$ once $X$ is known), and the <strong>chain rule</strong> $H(X,Y)=H(X)+H(Y\mid X)$; conditioning never increases entropy, $H(Y\mid X)\le H(Y)$. Their shared content is the <strong>mutual information</strong> $I(X;Y)=H(X)-H(X\mid Y)=H(Y)-H(Y\mid X)=H(X)+H(Y)-H(X,Y)=\sum_{x,y}p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}$, which is symmetric, non-negative, and zero exactly when $X$ and $Y$ are independent. Underlying non-negativity is the <strong>relative entropy</strong> (Kullback–Leibler divergence) $D(p\,\|\,q)=\sum_x p(x)\log_2\frac{p(x)}{q(x)}\ge 0$ (Gibbs' inequality), with $I(X;Y)=D\big(p(x,y)\,\|\,p(x)p(y)\big)$. Maximising mutual information over the input distribution defines <strong>channel capacity</strong> $C=\max_{p(x)}I(X;Y)$ bits per channel use — for the binary symmetric channel $C=1-H(p)$, for the binary erasure channel $C=1-\epsilon$, and for the band-limited AWGN channel Shannon's $C=B\log_2(1+\mathrm{SNR})$ (that specific result is the <em>Shannon Capacity</em> topic and is only cross-referenced here). Two <strong>fundamental theorems</strong> close the framework: the <em>source-coding theorem</em> — lossless compression needs at least $H(X)$ bits/symbol on average, and $H$ is achievable (the <em>Source Coding</em> topic builds Huffman codes to reach it) — and the <em>noisy-channel coding theorem</em> — every rate $R<C$ admits codes with vanishing error, while $R>C$ is hopeless (the reason FEC, LDPC, turbo and polar codes exist). Supporting pillars are the <strong>data-processing inequality</strong> ($X\to Y\to Z\Rightarrow I(X;Z)\le I(X;Y)$), <strong>Fano's inequality</strong> (which turns error probability into the converse of the coding theorem), and <strong>differential entropy</strong> $h(X)$ for continuous variables, maximised for fixed variance by the Gaussian, $h=\tfrac12\log_2(2\pi e\,\sigma^2)$. This topic derives each of these from scratch and shows how the <em>Shannon</em> and <em>Source Coding</em> results are special cases of the general theory.`,
    prerequisites: ['comm-basics', 'source-coding', 'shannon'],
    intro: String.raw`<p><strong>Why does a single 1948 paper sit underneath every compression format, every error-correcting code, and every claim about how fast a channel can carry data?</strong> Before Claude Shannon, "information" was a vague, qualitative idea — engineers spoke of signals and noise, but had no way to <em>measure</em> how much a message contained, or to say what was and was not physically possible. Shannon's <em>A Mathematical Theory of Communication</em> changed that overnight by doing something audacious: it defined information as a precise number, in bits, derived from probability alone, and then proved theorems about that number that no clever engineering could ever violate. The companion topics in this app — the <em>Shannon Capacity</em> formula $C=B\log_2(1+\mathrm{SNR})$ and the <em>Source Coding</em> story of compressing to the entropy $H$ — are not separate facts to memorise. They are two specific <em>consequences</em> of one underlying theory, and this page is that theory: the definitions and the theorems that everything else is a corollary of.</p>
<p>The whole edifice rests on one deceptively simple idea: <strong>information is surprise</strong>. If a friend tells you something you already knew for certain, they have told you nothing; if they tell you something wildly unexpected, they have told you a great deal. Shannon made this quantitative — the information in an outcome of probability $p$ is $-\log_2 p$ bits, so a coin-flip carries one bit, a roll that could go eight ways carries three, and a sure thing carries zero. Average that surprise over everything a source can emit and you get its <strong>entropy</strong> $H$, the single most important quantity in the subject: the true, irreducible amount of information the source produces per symbol, and therefore the hard floor on how far you can compress it. Entropy is why a text file zips down to a fraction of its size but a file of random bytes will not budge — the random file already sits at its entropy.</p>
<p>From that one root, the theory branches to describe <em>relationships</em> between quantities. How much does knowing $X$ tell you about $Y$? That is <strong>mutual information</strong> $I(X;Y)$, and it turns out to be the master quantity of communication: a noisy channel is nothing but a statistical link between what you send and what you receive, and the most information that link can convey — maximised over how you use it — is its <strong>capacity</strong> $C$. Push the definitions a little further and you meet the <strong>Kullback–Leibler divergence</strong>, the natural "distance" between two probability distributions that quietly underlies why mutual information is never negative, why entropy is maximised by the uniform distribution, and much of modern machine learning besides. These are not disconnected formulas; they are one interlocking web, and once you see the web you can read the two great theorems straight off it.</p>
<p>This topic builds that web from the ground up and keeps its two headline results in view the whole way. We define self-information and entropy and prove the bound $0\le H(X)\le\log_2|\mathcal X|$; we derive the binary entropy curve, joint and conditional entropy, and the chain rule; we build mutual information four equivalent ways and connect it to KL divergence; we define capacity and compute it exactly for the binary symmetric and binary erasure channels; and we state the source-coding and noisy-channel coding theorems as the two limits that bracket every real system — you cannot compress below $H$, and you cannot communicate reliably above $C$. Throughout we lean on the neighbours rather than repeat them: the <em>Shannon Capacity</em> topic for the AWGN formula and the $-1.59$ dB energy floor, the <em>Source Coding</em> topic for Huffman codes and practical compression, and <em>Channel Coding</em> / <em>FEC</em> for the code families that the coding theorem promises must exist. What we own here is the framework itself — the reason all of those results are true.</p>`,
    sections: [
      {
        h: 'Why an umbrella theory: from vague "information" to a number',
        html: String.raw`<p><strong>Why start a communications curriculum with abstract probability instead of circuits and waveforms?</strong> Because without Shannon's measure of information you cannot even <em>state</em> the questions the rest of the subject answers. "How small can this file get?" and "How fast can this link carry data without errors?" sound like engineering questions, but their answers — the entropy $H$ and the capacity $C$ — are properties of probability distributions, fixed before any hardware is chosen. Information theory is the layer that turns fuzzy words like "redundancy", "uncertainty", and "channel quality" into numbers you can compute and prove theorems about. Every specific result in this app about limits — the compression floor, the capacity ceiling, the $-1.59$ dB energy limit — is a special case of what is derived here.</p>
        <p>Shannon's move was to insist that the <em>meaning</em> of a message is irrelevant to how much information it carries; only the <em>probabilities</em> matter. A message that was one of a million equally likely possibilities pins down more than a message that was one of two, regardless of what either says. This is liberating: it lets one theory cover text, speech, images, telemetry, and DNA with the same equations. The price is that "information" here is a statistical quantity — the average surprise of a source — not a measure of importance or truth.</p>
        <div class="callout"><strong>Framing.</strong> This topic owns the <em>foundations</em>: self-information, entropy, conditional and joint entropy, mutual information, relative entropy, capacity as $\max I(X;Y)$, and the two fundamental theorems in their general form. It cross-references, and does <em>not</em> re-derive, its neighbours: the <em>Shannon Capacity</em> topic for the band-limited AWGN result $C=B\log_2(1+\mathrm{SNR})$ and the energy floor; the <em>Source Coding</em> topic for Huffman coding and real compressors reaching $H$; <em>Channel Coding</em> and <em>FEC</em> for the concrete codes (Hamming, LDPC, turbo, polar) whose very existence the noisy-channel coding theorem guarantees. Read those for the specifics; read this for why they are all true.</p></div>
        <p>Keep one organising picture in mind. A communication system has a <em>source</em> (which produces information at rate $H$) and a <em>channel</em> (which can carry it at rate up to $C$). Source coding squeezes the message down toward $H$; channel coding pads it back up with structured redundancy to survive the channel, staying under $C$. The entire theory is the study of these two numbers and the quantity that generates both of them — mutual information. The final section's diagram places $H$ as a floor and $C$ as a ceiling, with reliable communication possible exactly when $H\le C$.</p>`
      },
      {
        h: 'Self-information: measuring surprise, and the units of information',
        html: String.raw`<p>Everything begins with a single outcome. Suppose an event $x$ occurs with probability $p(x)$. How much information have you gained by learning that it happened? Shannon demanded three properties of any sensible measure $I(x)$: (i) it depends only on the probability $p(x)$, not on what $x$ "means"; (ii) less likely events are more informative, so $I$ decreases as $p$ increases, with $I=0$ for a certain event ($p=1$); and (iii) the information from two <em>independent</em> events adds, $I(x,y)=I(x)+I(y)$ whenever $p(x,y)=p(x)p(y)$. The only continuous function that turns the product $p(x)p(y)$ into the sum $I(x)+I(y)$ is the logarithm, which forces</p>
        <p>$$ I(x)=-\log_b p(x). $$</p>
        <p>The minus sign makes $I$ positive (since $p\le 1$ gives $\log p\le 0$), and the base $b$ merely sets the <strong>unit</strong>. This is the atom of the whole theory — the <strong>self-information</strong> or "surprisal" of an outcome. A fair coin landing heads ($p=\tfrac12$) carries $-\log_2\tfrac12=1$ bit; one face of a fair die ($p=\tfrac16$) carries $\log_2 6\approx 2.585$ bits; drawing the one winning ticket from a million carries about $20$ bits. Rare events are surprising and therefore informative; near-certain events are dull and carry almost nothing.</p>
        <p>The choice of logarithm base is purely a change of unit, exactly like measuring the same distance in metres or feet:</p>
        <table class="data">
          <tr><th>Log base</th><th>Unit</th><th>Named after / also called</th><th>Conversion</th><th>Where seen</th></tr>
          <tr><td>$b=2$</td><td><strong>bit</strong></td><td>"shannon" (binary digit)</td><td>reference unit</td><td>digital comms, coding</td></tr>
          <tr><td>$b=e$</td><td><strong>nat</strong></td><td>natural unit</td><td>$1\ \text{nat}=\dfrac{1}{\ln 2}\approx 1.4427$ bits</td><td>analysis, ML, physics</td></tr>
          <tr><td>$b=10$</td><td><strong>Hartley</strong></td><td>ban / dit</td><td>$1\ \text{Hartley}=\log_2 10\approx 3.3219$ bits</td><td>Hartley's early work</td></tr>
        </table>
        <p>To convert between bases, divide by the logarithm of the new base in the old: $\log_2 x=\ln x/\ln 2$, so a quantity of $H$ nats equals $H/\ln 2$ bits. We use <strong>bits</strong> (base 2) throughout, because they match the binary digits of real systems, but every equation below holds verbatim in nats if you swap $\log_2$ for $\ln$. The rest of the theory is nothing more than <em>averaging</em> this self-information in various ways.</p>
        <div class="callout tip"><strong>Self-information vs a "bit" of storage.</strong> The two meanings of "bit" coincide only for a fair coin. A biased source whose symbol is almost always the same emits far less than one bit of information per symbol even though each symbol still occupies one binary digit of naive storage — which is exactly the slack that compression removes (see <em>Source Coding</em>).</p></div>`
      },
      {
        h: 'Entropy: the average information of a source',
        html: String.raw`<p>Self-information describes one outcome; a <em>source</em> emits many, so we average. The <strong>entropy</strong> of a discrete random variable $X$ taking values in an alphabet $\mathcal X$ with probabilities $p(x)$ is the expected self-information:</p>
        <p>$$ H(X)=\mathbb E[I(X)]=\sum_{x\in\mathcal X}p(x)\,\big(-\log_2 p(x)\big)=-\sum_{x}p(x)\log_2 p(x)\quad\text{bits/symbol}, $$</p>
        <p>with the convention $0\log_2 0=0$ (an impossible symbol contributes nothing). Entropy is the <em>average uncertainty</em> of the source before you see its output, and equivalently the average information you gain once you do. It is the single most important number in the subject, because the source-coding theorem (later) proves it is the exact floor on lossless compression: no code can represent the source in fewer than $H(X)$ bits per symbol on average.</p>
        <p>Two hard bounds pin entropy between certainty and maximum ignorance:</p>
        <p>$$ 0\le H(X)\le\log_2|\mathcal X|. $$</p>
        <p>The lower bound is reached when the source is <strong>deterministic</strong> — one symbol has probability $1$, all surprise vanishes, $H=0$. The upper bound is reached only by the <strong>uniform</strong> distribution $p(x)=1/|\mathcal X|$, where every symbol is equally surprising and $H=\log_2|\mathcal X|$; this is the "maximum entropy" state, the most unpredictable a source of that size can be. A fair coin has $H=\log_2 2=1$ bit; a fair die $H=\log_2 6\approx 2.585$ bits; a biased source sits strictly between $0$ and the uniform ceiling.</p>
        <p>The special case of a single biased bit is so useful it gets its own name, the <strong>binary entropy function</strong>:</p>
        <p>$$ H(p)=-p\log_2 p-(1-p)\log_2(1-p), $$</p>
        <p>plotted in the first diagram. It is <em>concave</em>, symmetric about $p=\tfrac12$, and peaks at $H(0.5)=1$ bit (a fair coin, maximum uncertainty), falling to $0$ at $p=0$ and $p=1$ (a certain bit). This one curve reappears everywhere — it is the conditional entropy of a bit flipped with probability $p$, and hence, as we will see, the capacity loss of a binary symmetric channel.</p>
        <table class="data">
          <tr><th>Source</th><th>Distribution</th><th>Entropy $H$ (bits/symbol)</th><th>Comment</th></tr>
          <tr><td>Certain symbol</td><td>$(1)$</td><td>$0$</td><td>no information, no surprise</td></tr>
          <tr><td>Fair coin</td><td>$(\tfrac12,\tfrac12)$</td><td>$1$</td><td>uniform on 2 symbols $=\log_2 2$</td></tr>
          <tr><td>Biased coin</td><td>$(0.9,0.1)$</td><td>$H(0.1)\approx 0.469$</td><td>predictable, compressible</td></tr>
          <tr><td>Four-symbol dyadic</td><td>$(\tfrac12,\tfrac14,\tfrac18,\tfrac18)$</td><td>$1.75$</td><td>below $\log_2 4=2$; 87.5% efficient</td></tr>
          <tr><td>Fair die</td><td>$(\tfrac16,\dots,\tfrac16)$</td><td>$\log_2 6\approx 2.585$</td><td>uniform ceiling on 6 symbols</td></tr>
        </table>
        <p>The gap between a source's entropy and the naive $\log_2|\mathcal X|$ of a fixed-length code is its <strong>redundancy</strong> — the compressible slack. The four-symbol dyadic source above carries only $1.75$ bits where a fixed-length code spends $2$, so an ideal compressor saves $12.5\%$; the <em>Source Coding</em> topic shows Huffman codes capturing exactly this. Entropy is where compression stops.</p>`
      },
      {
        h: 'Joint and conditional entropy, and the chain rule',
        html: String.raw`<p>Real problems involve <em>pairs</em> of variables — an input and an output, a symbol and its noisy copy — so we extend entropy to two random variables $X,Y$ with joint distribution $p(x,y)$. The <strong>joint entropy</strong> is the total uncertainty of the pair,</p>
        <p>$$ H(X,Y)=-\sum_{x,y}p(x,y)\log_2 p(x,y), $$</p>
        <p>and the <strong>conditional entropy</strong> is the uncertainty that <em>remains</em> about $Y$ once you have observed $X$, averaged over $X$:</p>
        <p>$$ H(Y\mid X)=-\sum_{x,y}p(x,y)\log_2 p(y\mid x)=\sum_x p(x)\,H(Y\mid X=x). $$</p>
        <p>Read $H(Y\mid X)$ as "the leftover surprise in $Y$ after $X$ is known". If $Y$ is a deterministic function of $X$, then knowing $X$ removes all doubt and $H(Y\mid X)=0$; if $Y$ is unrelated to $X$, knowing $X$ tells you nothing and $H(Y\mid X)=H(Y)$.</p>
        <p>These three quantities are bound together by the <strong>chain rule</strong>, the additive law of uncertainty:</p>
        <p>$$ H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y). $$</p>
        <p>In words: the uncertainty of the whole pair equals the uncertainty of the first variable <em>plus</em> whatever uncertainty is left in the second once the first is known. It is the exact information-theoretic echo of the probability chain rule $p(x,y)=p(x)\,p(y\mid x)$, with logarithms turning the product into a sum. The rule extends to any number of variables, $H(X_1,\dots,X_n)=\sum_i H(X_i\mid X_1,\dots,X_{i-1})$, and is the workhorse behind almost every later identity.</p>
        <div class="callout"><strong>Conditioning reduces entropy.</strong> A fundamental inequality states $H(Y\mid X)\le H(Y)$: on <em>average</em>, learning something can only reduce (never increase) your uncertainty about $Y$, with equality if and only if $X$ and $Y$ are independent. The subtlety worth remembering is that this holds only on average — a <em>particular</em> observation $X=x$ can occasionally raise your uncertainty $H(Y\mid X=x)$ above $H(Y)$ (a surprising clue can confuse you), but averaged over all $x$ the conditional entropy never exceeds the unconditional one. This single fact is what makes the next quantity, mutual information, non-negative.</p></div>
        <p>Because $H(Y\mid X)\le H(Y)$, the joint entropy obeys $\max(H(X),H(Y))\le H(X,Y)\le H(X)+H(Y)$: the pair is at least as uncertain as either member alone, and at most as uncertain as the sum (with the sum reached exactly when $X,Y$ are independent, so nothing is shared). The amount by which $H(X)+H(Y)$ <em>overshoots</em> $H(X,Y)$ is precisely the information the two variables share — which is where we turn next.</p>`
      },
      {
        h: 'Mutual information: the shared content of two variables',
        html: String.raw`<p>The central quantity of communication is the <strong>mutual information</strong> $I(X;Y)$: how much observing one variable tells you about the other. It has four equivalent faces, and being fluent in all of them is most of the battle:</p>
        <p>$$ I(X;Y)=\underbrace{H(X)-H(X\mid Y)}_{\text{uncertainty removed from }X}=\underbrace{H(Y)-H(Y\mid X)}_{\text{uncertainty removed from }Y}=\underbrace{H(X)+H(Y)-H(X,Y)}_{\text{overlap}}=\underbrace{\sum_{x,y}p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}}_{\text{divergence form}}. $$</p>
        <p>The first two faces say the same thing from each side: mutual information is the <em>reduction in uncertainty</em> about $X$ once you see $Y$, and equally about $Y$ once you see $X$. The third is the "overlap" picture drawn in the second diagram — a Venn diagram in which the disk $H(X)$ and the disk $H(Y)$ overlap in the region $I(X;Y)$, the left crescent is $H(X\mid Y)$, the right crescent is $H(Y\mid X)$, and the whole union is $H(X,Y)$. The fourth writes $I$ directly from the joint distribution, comparing the true joint $p(x,y)$ to the product $p(x)p(y)$ that would hold if the variables were independent.</p>
        <p>Three properties follow and are worth committing to memory:</p>
        <ul>
          <li><strong>Symmetry:</strong> $I(X;Y)=I(Y;X)$. Information is mutual — $X$ tells you exactly as much about $Y$ as $Y$ does about $X$.</li>
          <li><strong>Non-negativity:</strong> $I(X;Y)\ge 0$, a direct consequence of "conditioning reduces entropy" ($H(X\mid Y)\le H(X)$). Observing another variable can never, on average, make you more uncertain.</li>
          <li><strong>Independence test:</strong> $I(X;Y)=0$ if and only if $X$ and $Y$ are independent, since then $p(x,y)=p(x)p(y)$ and every log term is $\log_2 1=0$. Nonzero mutual information is exactly statistical dependence, measured in bits.</li>
        </ul>
        <p>Note $I(X;X)=H(X)-H(X\mid X)=H(X)$: a variable's mutual information with <em>itself</em> is its entropy, which is why entropy is sometimes called self-information in the averaged sense. Mutual information is the bridge from the single-source world of entropy to the two-terminal world of channels: a channel is a probabilistic map $p(y\mid x)$, and how much of what you send survives to the output is exactly $I(X;Y)$. Maximising that over how you drive the channel gives its capacity — the subject two sections on.</p>`
      },
      {
        h: 'Relative entropy (KL divergence): the engine behind the inequalities',
        html: String.raw`<p>One quantity silently powers most of the theory's inequalities: the <strong>relative entropy</strong> or <strong>Kullback–Leibler divergence</strong> between two distributions $p$ and $q$ on the same alphabet,</p>
        <p>$$ D(p\,\|\,q)=\sum_{x}p(x)\log_2\frac{p(x)}{q(x)}. $$</p>
        <p>Interpret $D(p\,\|\,q)$ as the <em>penalty</em> for believing the wrong distribution: it is the average number of <em>extra</em> bits you waste when you compress data that truly follows $p$ using a code optimised for $q$ instead. If your model $q$ is perfect ($q=p$) you waste nothing; the more $q$ misjudges $p$, the more bits you burn. Its cardinal property is <strong>Gibbs' inequality</strong>:</p>
        <p>$$ D(p\,\|\,q)\ge 0,\qquad\text{with equality if and only if } p=q. $$</p>
        <p>This one inequality is the source of nearly every "$\ge$" in information theory. Entropy is maximised by the uniform distribution because $D(p\,\|\,\text{uniform})=\log_2|\mathcal X|-H(X)\ge 0$. Mutual information is non-negative because it <em>is</em> a KL divergence:</p>
        <p>$$ I(X;Y)=D\big(p(x,y)\,\|\,p(x)p(y)\big)\ge 0, $$</p>
        <p>i.e. mutual information measures how far the joint distribution is from the independent product — dependence is exactly distance-from-independence, and distance is never negative. So the Venn-diagram overlap of the previous section can never be negative, which is far from obvious without this tool.</p>
        <div class="callout"><strong>Not a distance.</strong> Despite the name "divergence", $D$ is <em>not</em> a metric. It is <strong>asymmetric</strong> — in general $D(p\,\|\,q)\ne D(q\,\|\,p)$ — and it violates the triangle inequality. The asymmetry is meaningful: $D(p\,\|\,q)$ weights errors by the <em>true</em> distribution $p$, so it heavily penalises assigning small $q(x)$ to an $x$ that is actually common. This directional character is why choosing "$D(p\,\|\,q)$ vs $D(q\,\|\,p)$" matters in statistics and machine learning (variational inference, for instance, deliberately picks one direction). For our purposes, remember only that $D\ge 0$ with equality iff the distributions match — that is the lever that makes entropy, mutual information, and capacity behave.</p></div>
        <p>KL divergence also unifies the units story: cross-entropy, the quantity minimised when you train a classifier, is exactly $H(p)+D(p\,\|\,q)$, so minimising cross-entropy means driving your model $q$ toward the truth $p$ until the divergence vanishes. The same $D\ge 0$ that bounds a channel's capacity bounds a neural network's loss — one inequality, many disciplines.</p>`
      },
      {
        h: 'Channel capacity: the maximum of mutual information',
        html: String.raw`<p>A <strong>channel</strong> is a probabilistic map from an input $X$ to an output $Y$, fully described by its transition law $p(y\mid x)$. How much information can it carry? For a given input distribution $p(x)$ the answer is $I(X;Y)$; but you are free to <em>choose</em> how often you send each symbol, so the channel's intrinsic limit is the mutual information under the best possible input:</p>
        <p>$$ C=\max_{p(x)}I(X;Y)\qquad\text{bits per channel use}. $$</p>
        <p>Capacity depends only on the channel law $p(y\mid x)$, not on any code — it is a property of the channel itself, computed once and for all. Two discrete channels have famously clean capacities that fall straight out of the definition, and both use the binary entropy function from earlier.</p>
        <p>The <strong>binary symmetric channel</strong> $\mathrm{BSC}(p)$ transmits a bit and flips it with probability $p$. Given the input, the output is the input plus an independent flip, so the noise term is fixed at $H(Y\mid X)=H(p)$ regardless of $x$; choosing equiprobable inputs makes $Y$ equiprobable and maximises $H(Y)=1$, giving</p>
        <p>$$ C_{\mathrm{BSC}}=1-H(p)\quad\text{bits/use}. $$</p>
        <p>This is perfect ($C=1$) at $p=0$ or $p=1$ and useless ($C=0$) at $p=\tfrac12$, where output and input are independent. The <strong>binary erasure channel</strong> $\mathrm{BEC}(\epsilon)$ instead delivers each bit perfectly with probability $1-\epsilon$ or replaces it with an "erasure" mark with probability $\epsilon$ — you never receive a <em>wrong</em> bit, only a missing one. A fraction $1-\epsilon$ of uses get through cleanly, so</p>
        <p>$$ C_{\mathrm{BEC}}=1-\epsilon\quad\text{bits/use}. $$</p>
        <table class="data">
          <tr><th>Channel</th><th>Model</th><th>Capacity $C$ (bits/use)</th><th>$C=0$ when</th><th>$C=\max$ when</th></tr>
          <tr><td>BSC$(p)$</td><td>bit flipped w.p. $p$</td><td>$1-H(p)$</td><td>$p=\tfrac12$</td><td>$p=0$ or $1$ (perfect)</td></tr>
          <tr><td>BEC$(\epsilon)$</td><td>bit erased w.p. $\epsilon$</td><td>$1-\epsilon$</td><td>$\epsilon=1$</td><td>$\epsilon=0$ (perfect)</td></tr>
          <tr><td>Noiseless binary</td><td>$Y=X$</td><td>$1$</td><td>—</td><td>always</td></tr>
          <tr><td>Band-limited AWGN</td><td>continuous, power $S$, noise $N$</td><td>$B\log_2(1+S/N)$</td><td>$S\to 0$</td><td>large $B$ or SNR</td></tr>
        </table>
        <p>The last row is the celebrated Shannon–Hartley result. It is the capacity of the continuous, band-limited additive-Gaussian-noise channel, and it is derived in full — including the $-1.59$ dB energy floor and the bandwidth-vs-power trade — in the dedicated <em>Shannon Capacity</em> topic. We deliberately do <em>not</em> re-derive it here; the point of this section is that it is simply another instance of $C=\max_{p(x)}I(X;Y)$, this time over continuous inputs, with the maximising input distribution being Gaussian. Capacity, whether for a coin-flip channel or a fibre-optic link, is always the same idea: the most mutual information the channel can be made to carry.</p>`
      },
      {
        h: 'The two fundamental theorems, and the supporting inequalities',
        html: String.raw`<p>The framework culminates in Shannon's two coding theorems, which turn the quantities $H$ and $C$ into hard operational limits. They are the reason this whole topic matters.</p>
        <p><strong>1. The source-coding theorem (compression limit).</strong> For a source of entropy $H(X)$, any lossless code needs at least $H(X)$ bits per symbol on average, and codes exist whose average length approaches $H(X)$ as closely as desired (by coding long blocks). You cannot beat the entropy; you can get arbitrarily near it. This is the theoretical backing of every zip, PNG, and FLAC file, and the <em>Source Coding</em> topic constructs the Huffman and prefix codes that reach the bound in practice — we state the limit here and cross-reference the construction there rather than repeating it.</p>
        <p><strong>2. The noisy-channel coding theorem (communication limit).</strong> For a channel of capacity $C$, every rate $R<C$ admits codes of increasing block length whose error probability tends to zero, while for every rate $R>C$ the error probability is bounded away from zero no matter how clever the code. Reliability is not bought by slowing down without limit; it is bought by staying below $C$ and paying with longer codewords (hence latency and complexity). This sharp threshold at $R=C$ is the entire reason forward error correction exists — Hamming, convolutional, LDPC, turbo, and polar codes (see <em>Channel Coding</em>, <em>FEC</em>, and their dedicated topics) are all attempts to build the codes this theorem promises must exist, chasing the capacity $C$ that this framework defines.</p>
        <div class="callout tip"><strong>Source–channel separation.</strong> The two theorems combine into a beautifully clean design rule: for a stationary source over a memoryless channel, you lose nothing by compressing to $H$ and protecting up to $C$ as two <em>independent</em> stages. Reliable end-to-end transmission is possible if and only if $H\le C$ — the source produces less information than the channel can carry. This is why real systems have a distinct compression block (JPEG, MP3) and a distinct FEC block, designed by different teams, and why the final diagram shows $H$ as a floor and $C$ as a ceiling.</p></div>
        <p>Three supporting results give the theorems their teeth and round out the theory:</p>
        <ul>
          <li><strong>Data-processing inequality.</strong> If $X\to Y\to Z$ form a Markov chain (so $Z$ depends on $X$ only through $Y$), then $I(X;Z)\le I(X;Y)$. Post-processing can never <em>create</em> information about the source: once $Y$ has thrown information away, no clever function of $Y$ can recover it. This formalises the intuition that a decoder cannot extract more about the message than the channel output already contains.</li>
          <li><strong>Fano's inequality.</strong> It bounds the probability of error $P_e$ in guessing $X$ from $Y$ by the leftover uncertainty: $H(X\mid Y)\le H(P_e)+P_e\log_2(|\mathcal X|-1)$. Rearranged, it says that if $H(X\mid Y)$ is large (the output leaves much doubt) then $P_e$ cannot be small — which is exactly the <em>converse</em> of the coding theorem, proving reliable communication is impossible above capacity.</li>
          <li><strong>Differential entropy.</strong> For a continuous variable with density $f(x)$, entropy generalises to $h(X)=-\int f(x)\log_2 f(x)\,dx$. Unlike discrete entropy it can be negative and shifts under change of scale, but differences and mutual information remain meaningful. Its key fact anchors the AWGN result: among all densities of a fixed variance $\sigma^2$, the <strong>Gaussian maximises</strong> differential entropy, with $h=\tfrac12\log_2(2\pi e\,\sigma^2)$ — the reason Gaussian noise is the "worst case" and Gaussian inputs are capacity-optimal on the AWGN channel.</li>
        </ul>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<p>Information theory is the umbrella framework beneath every compression and communication limit in this app, and it flows from one idea — information is surprise — averaged and combined in a handful of ways. You should now be able to say:</p>
        <ul>
          <li><strong>Self-information and entropy:</strong> the surprise of an outcome is $I(x)=-\log_2 p(x)$ bits (log$_2$→bits, ln→nats, log$_{10}$→Hartleys); averaging gives entropy $H(X)=-\sum p\log_2 p=\mathbb E[I(X)]$, the source's information per symbol, bounded by $0\le H\le\log_2|\mathcal X|$ — zero for a deterministic source, maximal for the uniform one — with the concave binary entropy $H(p)$ peaking at $H(0.5)=1$ bit.</li>
          <li><strong>Joint, conditional, and the chain rule:</strong> $H(X,Y)=-\sum p(x,y)\log_2 p(x,y)$, $H(Y\mid X)$ is the leftover uncertainty about $Y$ given $X$, and the chain rule $H(X,Y)=H(X)+H(Y\mid X)$ ties them together; conditioning reduces entropy, $H(Y\mid X)\le H(Y)$, with equality iff independent.</li>
          <li><strong>Mutual information:</strong> $I(X;Y)=H(X)-H(X\mid Y)=H(Y)-H(Y\mid X)=H(X)+H(Y)-H(X,Y)=\sum p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}$ — symmetric, non-negative, zero iff independent; it is the shared information and the master quantity of channels.</li>
          <li><strong>Relative entropy:</strong> $D(p\,\|\,q)=\sum p\log_2(p/q)\ge 0$ (Gibbs), zero iff $p=q$, asymmetric and not a metric; it powers the inequalities, and $I(X;Y)=D(p(x,y)\,\|\,p(x)p(y))$.</li>
          <li><strong>Capacity:</strong> $C=\max_{p(x)}I(X;Y)$ bits/use; $C_{\mathrm{BSC}}=1-H(p)$, $C_{\mathrm{BEC}}=1-\epsilon$, and the AWGN $C=B\log_2(1+\mathrm{SNR})$ is the same maximisation over continuous inputs (see the <em>Shannon</em> topic — not re-derived here).</li>
          <li><strong>The two theorems and their support:</strong> you cannot compress below $H$ (source-coding theorem) and cannot communicate reliably above $C$ (noisy-channel coding theorem), so reliable transmission needs $H\le C$; the data-processing inequality ($I(X;Z)\le I(X;Y)$), Fano's inequality (the converse), and differential entropy (Gaussian maximises it for fixed variance) complete the picture.</li>
        </ul>`
      },
      {
        h: String.raw`Further reading`,
        html: String.raw`<ul class="further-reading">
<li><a href="https://en.wikipedia.org/wiki/Entropy_(information_theory)" target="_blank" rel="noopener">Wikipedia — Entropy (information theory)</a> — the best single-page anchor for the core of this topic: it defines self-information $I(E)=-\log p(E)$ and entropy $H(X)=-\sum p\log p$, states the axioms that force the logarithm, works through the bits/nats/shannons units, and connects entropy to Shannon's source-coding theorem and to differential entropy — a direct cross-check on the first half of every section here.</li>
<li><a href="https://en.wikipedia.org/wiki/Mutual_information" target="_blank" rel="noopener">Wikipedia — Mutual information</a> — the deep dive on the master quantity of this topic: it lays out all four equivalent forms $I(X;Y)=H(X)-H(X\mid Y)=H(X)+H(Y)-H(X,Y)=D_{\mathrm{KL}}(p_{XY}\,\|\,p_Xp_Y)$, proves non-negativity and symmetry, and covers conditional and normalised variants — the rigorous companion to the mutual-information and KL-divergence sections.</li>
<li><a href="https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/" target="_blank" rel="noopener">MIT OpenCourseWare 6.441 — Information Theory (Polyanskiy)</a> — a full graduate course with free lecture notes, problem sets, and exams that builds entropy, relative entropy, mutual information, the source-coding and channel-coding theorems, Fano's inequality, and lossy compression from first principles — the place to go for the proofs this topic only sketches.</li>
<li><a href="https://colah.github.io/posts/2015-09-Visual-Information/" target="_blank" rel="noopener">Christopher Olah — "Visual Information Theory"</a> — an outstanding illustrated tutorial that makes entropy, cross-entropy, KL divergence, and mutual information intuitive through pictures (variable-length codes, the "Alice and Bob" vocabulary example, and area diagrams for $H(X,Y)$ and $I(X;Y)$) — the perfect visual counterpart to the Venn-diagram section here.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`Information theory (Shannon, 1948, <em>A Mathematical Theory of Communication</em>) is the umbrella framework that measures information; the <em>Shannon Capacity</em> $C=B\log_2(1+\mathrm{SNR})$ and the <em>Source Coding</em> entropy limit are specific results <em>of</em> this theory, not separate facts.`,
      String.raw`<strong>Self-information</strong> $I(x)=-\log_2 p(x)$ bits is the "surprise" of an outcome — rarer events carry more information; base 2 gives bits, base $e$ gives nats ($1\,\text{nat}=1/\ln 2\approx1.443$ bits), base 10 gives Hartleys ($\approx 3.322$ bits).`,
      String.raw`<strong>Entropy</strong> $H(X)=-\sum_x p(x)\log_2 p(x)=\mathbb E[I(X)]$ is the average information / uncertainty of a source in bits per symbol — the irreducible floor on lossless compression.`,
      String.raw`Entropy is bounded $0\le H(X)\le\log_2|\mathcal X|$: it is $0$ for a deterministic source and maximal ($=\log_2|\mathcal X|$) for the <strong>uniform</strong> distribution (maximum ignorance).`,
      String.raw`The <strong>binary entropy</strong> $H(p)=-p\log_2 p-(1-p)\log_2(1-p)$ is a concave bell, symmetric about $p=\tfrac12$, peaking at $H(0.5)=1$ bit and vanishing at $p=0,1$.`,
      String.raw`<strong>Joint entropy</strong> $H(X,Y)=-\sum p(x,y)\log_2 p(x,y)$ and <strong>conditional entropy</strong> $H(Y\mid X)=-\sum p(x,y)\log_2 p(y\mid x)$ measure the pair's total and the leftover uncertainty in $Y$ given $X$.`,
      String.raw`The <strong>chain rule</strong> $H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y)$ is the additive law of uncertainty — the log-image of $p(x,y)=p(x)p(y\mid x)$.`,
      String.raw`<strong>Conditioning reduces entropy</strong>: $H(Y\mid X)\le H(Y)$ on average, with equality iff $X$ and $Y$ are independent — the fact that makes mutual information non-negative.`,
      String.raw`<strong>Mutual information</strong> $I(X;Y)=H(X)-H(X\mid Y)=H(Y)-H(Y\mid X)=H(X)+H(Y)-H(X,Y)=\sum p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}$ is the information one variable carries about another.`,
      String.raw`$I(X;Y)$ is <strong>symmetric</strong>, <strong>non-negative</strong>, and $=0$ <strong>iff</strong> $X,Y$ are independent; also $I(X;X)=H(X)$.`,
      String.raw`<strong>Relative entropy / KL divergence</strong> $D(p\,\|\,q)=\sum_x p(x)\log_2\frac{p(x)}{q(x)}\ge 0$ (Gibbs' inequality), $=0$ iff $p=q$; it is asymmetric and not a metric.`,
      String.raw`Mutual information is a KL divergence, $I(X;Y)=D\big(p(x,y)\,\|\,p(x)p(y)\big)$, which is why it is $\ge 0$ — dependence is distance from independence.`,
      String.raw`<strong>Channel capacity</strong> $C=\max_{p(x)}I(X;Y)$ bits/use is the maximum reliable rate: $C_{\mathrm{BSC}}=1-H(p)$, $C_{\mathrm{BEC}}=1-\epsilon$, and AWGN $C=B\log_2(1+\mathrm{SNR})$ (cross-reference the <em>Shannon</em> topic — not re-derived here).`,
      String.raw`<strong>Source-coding theorem:</strong> lossless compression needs $\ge H(X)$ bits/symbol on average, and $H$ is achievable (the <em>Source Coding</em> topic builds Huffman codes to reach it).`,
      String.raw`<strong>Noisy-channel coding theorem:</strong> for any rate $R<C$ codes exist with error $\to 0$, and $R>C$ is impossible — the reason FEC, LDPC, turbo, and polar codes exist; reliable transmission needs $H\le C$.`,
      String.raw`Supporting pillars: the <strong>data-processing inequality</strong> ($X\to Y\to Z\Rightarrow I(X;Z)\le I(X;Y)$), <strong>Fano's inequality</strong> (error vs $H(X\mid Y)$, giving the converse), and <strong>differential entropy</strong> $h(X)=\tfrac12\log_2(2\pi e\,\sigma^2)$ for a Gaussian, which maximises entropy at fixed variance.`
    ],
    diagram: [
      {
        title: String.raw`The binary entropy function H(p)`,
        svg: String.raw`<svg viewBox="0 0 540 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="320" fill="#1c232e"/>
<text x="14" y="22" fill="#e6edf3" font-size="13">Binary entropy H(p): the uncertainty of one biased bit</text>
<!-- axes -->
<line x1="70" y1="270" x2="490" y2="270" stroke="#9aa7b5" stroke-width="1.2"/>
<line x1="70" y1="270" x2="70" y2="45" stroke="#9aa7b5" stroke-width="1.2"/>
<!-- y ticks -->
<line x1="66" y1="270" x2="70" y2="270" stroke="#9aa7b5"/><text x="46" y="274" fill="#9aa7b5" font-size="10">0</text>
<line x1="66" y1="160" x2="70" y2="160" stroke="#9aa7b5"/><text x="34" y="164" fill="#9aa7b5" font-size="10">0.5</text>
<line x1="66" y1="50" x2="70" y2="50" stroke="#9aa7b5"/><text x="46" y="54" fill="#9aa7b5" font-size="10">1</text>
<text x="22" y="175" fill="#9aa7b5" font-size="10" transform="rotate(-90 22 175)">H(p)  bits</text>
<!-- x ticks -->
<text x="66" y="286" fill="#9aa7b5" font-size="10">0</text>
<line x1="270" y1="270" x2="270" y2="274" stroke="#9aa7b5"/><text x="262" y="286" fill="#9aa7b5" font-size="10">0.5</text>
<text x="466" y="286" fill="#9aa7b5" font-size="10">1</text>
<text x="242" y="306" fill="#9aa7b5" font-size="11">p = Pr(bit = 1)</text>
<!-- guides to peak -->
<line x1="270" y1="270" x2="270" y2="50" stroke="#3a4652" stroke-width="0.8" stroke-dasharray="4 3"/>
<line x1="70" y1="50" x2="270" y2="50" stroke="#3a4652" stroke-width="0.8" stroke-dasharray="4 3"/>
<!-- curve -->
<polyline fill="none" stroke="#4dabf7" stroke-width="2.2" points="70,270 90,207 110,166.8 130,135.8 150,111.2 170,91.5 190,76.1 210,64.5 230,56.4 250,51.6 270,50 290,51.6 310,56.4 330,64.5 350,76.1 370,91.5 390,111.2 410,135.8 430,166.8 450,207 470,270"/>
<!-- peak dot -->
<circle cx="270" cy="50" r="4" fill="#63e6be"/>
<text x="280" y="46" fill="#63e6be" font-size="11">H(0.5) = 1 bit  (max uncertainty)</text>
<!-- endpoints -->
<circle cx="70" cy="270" r="3.5" fill="#ff6b6b"/><circle cx="470" cy="270" r="3.5" fill="#ff6b6b"/>
<text x="300" y="238" fill="#ffa94d" font-size="10">H(0) = H(1) = 0 : a certain bit carries no information</text></svg>`,
        caption: String.raw`The binary entropy function $H(p)=-p\log_2 p-(1-p)\log_2(1-p)$, the uncertainty of a single biased bit. It is concave, symmetric about $p=\tfrac12$, and peaks at $H(0.5)=1$ bit — a fair coin, the state of maximum surprise — falling to $0$ at $p=0$ and $p=1$ where the bit is certain and carries no information. This one curve underlies BSC capacity $1-H(p)$ and the general principle that a predictable source has low entropy.`
      },
      {
        title: String.raw`Entropy Venn diagram: H, conditional entropy and mutual information`,
        svg: String.raw`<svg viewBox="0 0 540 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="0" width="540" height="320" fill="#1c232e"/>
<text x="14" y="22" fill="#e6edf3" font-size="13">How H(X), H(Y), H(X|Y), H(Y|X) and I(X;Y) fit together</text>
<!-- two overlapping disks -->
<circle cx="210" cy="180" r="115" fill="#4dabf7" fill-opacity="0.16" stroke="#4dabf7" stroke-width="1.8"/>
<circle cx="330" cy="180" r="115" fill="#63e6be" fill-opacity="0.16" stroke="#63e6be" stroke-width="1.8"/>
<!-- disk titles -->
<text x="150" y="70" fill="#4dabf7" font-size="13" text-anchor="middle">H(X)</text>
<text x="390" y="70" fill="#63e6be" font-size="13" text-anchor="middle">H(Y)</text>
<!-- region labels -->
<text x="150" y="184" fill="#e6edf3" font-size="12" text-anchor="middle">H(X|Y)</text>
<text x="150" y="200" fill="#9aa7b5" font-size="9" text-anchor="middle">X only</text>
<text x="270" y="176" fill="#ffa94d" font-size="12" text-anchor="middle">I(X;Y)</text>
<text x="270" y="192" fill="#ffa94d" font-size="9" text-anchor="middle">overlap</text>
<text x="390" y="184" fill="#e6edf3" font-size="12" text-anchor="middle">H(Y|X)</text>
<text x="390" y="200" fill="#9aa7b5" font-size="9" text-anchor="middle">Y only</text>
<!-- identities -->
<text x="270" y="292" fill="#b197fc" font-size="11" text-anchor="middle">union of both disks = H(X,Y) = H(X) + H(Y) - I(X;Y)</text>
<text x="270" y="310" fill="#9aa7b5" font-size="10" text-anchor="middle">I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)  >= 0</text></svg>`,
        caption: String.raw`The additive "area" picture of entropy. The blue disk is $H(X)$, the teal disk is $H(Y)$; their overlap is the mutual information $I(X;Y)$, the left crescent is the conditional entropy $H(X\mid Y)$ and the right crescent is $H(Y\mid X)$. The whole shaded union is the joint entropy $H(X,Y)=H(X)+H(Y)-I(X;Y)$. Reading the overlap two ways gives $I(X;Y)=H(X)-H(X\mid Y)=H(Y)-H(Y\mid X)$, and because an area cannot be negative, $I(X;Y)\ge 0$, with the disks disjoint (no overlap) exactly when $X$ and $Y$ are independent.`
      },
      {
        title: String.raw`Source coding limit H and channel coding limit C`,
        svg: String.raw`<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="information-theory-arr" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="0" y="0" width="540" height="300" fill="#1c232e"/>
<text x="14" y="22" fill="#e6edf3" font-size="13">Shannon's system: compress toward H, protect up to C</text>
<!-- blocks row -->
<rect x="8" y="70" width="72" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="44" y="96" fill="#e6edf3" font-size="11" text-anchor="middle">Source</text>
<rect x="96" y="70" width="86" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="139" y="90" fill="#e6edf3" font-size="10" text-anchor="middle">Source enc</text><text x="139" y="104" fill="#9aa7b5" font-size="9" text-anchor="middle">compress -&gt; H</text>
<rect x="198" y="70" width="86" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="241" y="90" fill="#e6edf3" font-size="10" text-anchor="middle">Channel enc</text><text x="241" y="104" fill="#9aa7b5" font-size="9" text-anchor="middle">+ redundancy</text>
<rect x="300" y="62" width="92" height="60" rx="6" fill="#1c232e" stroke="#ffa94d"/><text x="346" y="84" fill="#e6edf3" font-size="10" text-anchor="middle">Channel</text><text x="346" y="98" fill="#9aa7b5" font-size="9" text-anchor="middle">p(y|x)</text><text x="346" y="111" fill="#ffa94d" font-size="10" text-anchor="middle">capacity C</text>
<rect x="408" y="70" width="72" height="44" rx="6" fill="#1c232e" stroke="#4dabf7"/><text x="444" y="90" fill="#e6edf3" font-size="10" text-anchor="middle">Decoders</text><text x="444" y="104" fill="#9aa7b5" font-size="9" text-anchor="middle">undo both</text>
<rect x="496" y="70" width="40" height="44" rx="6" fill="#1c232e" stroke="#63e6be"/><text x="516" y="96" fill="#e6edf3" font-size="10" text-anchor="middle">Sink</text>
<!-- noise arrow -->
<text x="346" y="46" fill="#b197fc" font-size="10" text-anchor="middle">noise</text>
<line x1="346" y1="50" x2="346" y2="60" stroke="#b197fc" stroke-width="1.4" marker-end="url(#information-theory-arr)"/>
<!-- flow arrows -->
<line x1="80" y1="92" x2="94" y2="92" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#information-theory-arr)"/>
<line x1="182" y1="92" x2="196" y2="92" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#information-theory-arr)"/>
<line x1="284" y1="92" x2="298" y2="92" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#information-theory-arr)"/>
<line x1="392" y1="92" x2="406" y2="92" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#information-theory-arr)"/>
<line x1="480" y1="92" x2="494" y2="92" stroke="#9aa7b5" stroke-width="1.4" marker-end="url(#information-theory-arr)"/>
<!-- annotations -->
<text x="139" y="150" fill="#63e6be" font-size="10" text-anchor="middle">source-coding limit</text>
<text x="139" y="164" fill="#9aa7b5" font-size="9" text-anchor="middle">rate cannot go below H</text>
<text x="346" y="150" fill="#ffa94d" font-size="10" text-anchor="middle">channel-coding limit</text>
<text x="346" y="164" fill="#9aa7b5" font-size="9" text-anchor="middle">R &lt; C reliable, R &gt; C impossible</text>
<!-- floor/ceiling bar -->
<rect x="70" y="196" width="400" height="34" rx="6" fill="#1e2b26" stroke="#63e6be" stroke-width="1.6"/>
<text x="270" y="217" fill="#63e6be" font-size="12" text-anchor="middle">Reliable transmission possible  iff   H  &lt;=  C</text>
<text x="270" y="258" fill="#9aa7b5" font-size="10" text-anchor="middle">H = entropy of the source (floor)      C = max I(X;Y) capacity of the channel (ceiling)</text>
<text x="270" y="276" fill="#9aa7b5" font-size="9" text-anchor="middle">source-channel separation: compress and protect as two independent stages</text></svg>`,
        caption: String.raw`Shannon's end-to-end system with its two limits made explicit. The source encoder squeezes the message down toward the entropy $H$ (the source-coding floor — you cannot compress below it), and the channel encoder adds structured redundancy so the message survives the noisy channel, whose capacity $C=\max_{p(x)}I(X;Y)$ is the ceiling on reliable rate ($R<C$ works, $R>C$ is impossible). Reliable end-to-end communication is possible if and only if $H\le C$, and by source–channel separation the two stages can be designed independently — compression (see <em>Source Coding</em>) then protection (see <em>Channel Coding</em>/<em>FEC</em>).`
      }
    ],
    equations: [
      {
        title: 'Self-information (surprise) of an outcome',
        tex: String.raw`$$ I(x)=-\log_2 p(x)\quad\text{bits} $$`,
        derivation: String.raw`<p><b>Where we start.</b> We want a number $I(x)$ that measures how much information is gained by learning that an outcome $x$ of probability $p=p(x)$ has occurred. We impose three natural axioms: it depends only on $p$; it is smaller for more probable outcomes with $I=0$ when $p=1$; and information from independent outcomes adds, $I(pq)=I(p)+I(q)$ whenever their probabilities multiply.</p>
        <p><b>Step 1 — the additivity axiom forces a logarithm.</b> We need a continuous function $g$ with $g(pq)=g(p)+g(q)$ for all $p,q\in(0,1]$. Substituting $p=e^{-a},q=e^{-b}$ turns the multiplicative condition into an additive one, and the only continuous solution is $g(p)\propto\log p$. So $I(x)=-c\,\log p(x)$ for some positive constant $c$ (the minus sign makes $I\ge 0$ since $\log p\le 0$).</p>
        <p><b>Step 2 — fix the constant by choosing a unit.</b> The constant $c$ merely sets the base of the logarithm and hence the unit. We define one <em>bit</em> as the information in a fair coin flip, $p=\tfrac12$, so $I(\tfrac12)=1$. This requires the base-2 logarithm: $-\log_2\tfrac12=1$.</p>
        <p><b>Result.</b> $$ I(x)=-\log_2 p(x)\ \text{bits}. $$ Halving a probability adds exactly one bit; a one-in-a-million event carries about $20$ bits; a certain event ($p=1$) carries $0$. Choosing base $e$ or $10$ instead gives nats or Hartleys — the same quantity in a different unit.</p>`
      },
      {
        title: 'Entropy as expected self-information',
        tex: String.raw`$$ H(X)=-\sum_{x}p(x)\log_2 p(x)=\mathbb E\!\left[-\log_2 p(X)\right] $$`,
        derivation: String.raw`<p><b>Where we start.</b> Self-information $I(x)=-\log_2 p(x)$ scores a single outcome. A source emits outcomes repeatedly with distribution $p(x)$, so we want the <em>average</em> information it produces per symbol — a single number summarising the whole source.</p>
        <p><b>Step 1 — take the expectation.</b> The natural summary is the expected self-information, weighting each outcome's surprise by how often it occurs:</p>
        $$ H(X)=\mathbb E[I(X)]=\sum_x p(x)\,I(x)=\sum_x p(x)\big(-\log_2 p(x)\big). $$
        <p><b>Step 2 — adopt the empty-symbol convention.</b> For any $x$ with $p(x)=0$ the term $p(x)\log_2 p(x)$ is an indeterminate $0\cdot(-\infty)$; since $\lim_{p\to 0^+}p\log_2 p=0$, we define $0\log_2 0=0$, so impossible symbols contribute nothing.</p>
        <p><b>Result.</b> $$ H(X)=-\sum_x p(x)\log_2 p(x)\ \text{bits/symbol}. $$ Sanity check on a fair coin: $H=-(\tfrac12\log_2\tfrac12+\tfrac12\log_2\tfrac12)=1$ bit, matching the definition of a bit. Entropy is the average uncertainty of the source and the irreducible floor for lossless compression.</p>`
      },
      {
        title: 'Bounds on entropy: maximised by the uniform distribution',
        tex: String.raw`$$ 0\le H(X)\le\log_2|\mathcal X|,\qquad\text{max iff } p(x)=\tfrac{1}{|\mathcal X|} $$`,
        derivation: String.raw`<p><b>Where we start.</b> $X$ takes values in a finite alphabet $\mathcal X$ with $|\mathcal X|=M$ symbols. We want the smallest and largest possible entropy over all distributions on $\mathcal X$.</p>
        <p><b>Step 1 — the lower bound.</b> Each term $-p(x)\log_2 p(x)\ge 0$ because $0\le p(x)\le 1$ makes $\log_2 p(x)\le 0$. So $H(X)\ge 0$, with equality only when every term vanishes, i.e. some symbol has $p=1$ and the rest $p=0$ — a deterministic source.</p>
        <p><b>Step 2 — the upper bound via Gibbs' inequality.</b> Compare $p$ to the uniform distribution $u(x)=1/M$ using relative entropy, which is non-negative: $D(p\,\|\,u)=\sum_x p(x)\log_2\frac{p(x)}{1/M}=\sum_x p(x)\log_2 p(x)+\log_2 M=-H(X)+\log_2 M\ge 0.$ Rearranging gives $H(X)\le\log_2 M$.</p>
        <p><b>Result.</b> $$ 0\le H(X)\le\log_2|\mathcal X|. $$ Equality in the upper bound holds iff $D(p\,\|\,u)=0$, i.e. $p=u$ — the <em>uniform</em> distribution is the unique maximiser, the state of maximum uncertainty (a fair die reaches $\log_2 6\approx 2.585$ bits). This is the formal statement of "maximum entropy = maximum ignorance".</p>`
      },
      {
        title: 'The binary entropy function',
        tex: String.raw`$$ H(p)=-p\log_2 p-(1-p)\log_2(1-p) $$`,
        derivation: String.raw`<p><b>Where we start.</b> Consider the simplest non-trivial source: a single bit that equals $1$ with probability $p$ and $0$ with probability $1-p$. We specialise the entropy formula to this two-symbol alphabet.</p>
        <p><b>Step 1 — write the two-term sum.</b> With outcomes $\{0,1\}$ and probabilities $\{1-p,\;p\}$, $$ H(X)=-\big[p\log_2 p+(1-p)\log_2(1-p)\big]\equiv H(p). $$ This defines the binary entropy function of the single parameter $p$.</p>
        <p><b>Step 2 — locate the maximum.</b> Differentiate: $\frac{dH}{dp}=\log_2\frac{1-p}{p}$, which is zero when $\frac{1-p}{p}=1$, i.e. $p=\tfrac12$. The second derivative $\frac{d^2H}{dp^2}=-\frac{1}{p(1-p)\ln 2}<0$ confirms a maximum and shows $H(p)$ is concave. At $p=\tfrac12$, $H=1$ bit.</p>
        <p><b>Result.</b> $$ H(p)=-p\log_2 p-(1-p)\log_2(1-p), $$ a concave bell symmetric about $p=\tfrac12$ (since swapping $p\leftrightarrow 1-p$ leaves it unchanged), peaking at $H(0.5)=1$ bit and falling to $H(0)=H(1)=0$. Example: $H(0.1)=-0.1\log_2 0.1-0.9\log_2 0.9\approx 0.469$ bits. This curve is the noise term of the binary symmetric channel and hence its capacity loss $1-H(p)$.</p>`
      },
      {
        title: 'Chain rule for entropy',
        tex: String.raw`$$ H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y) $$`,
        derivation: String.raw`<p><b>Where we start.</b> Two variables $X,Y$ have joint distribution $p(x,y)$. We want to relate the joint entropy $H(X,Y)$ to the entropy of one variable and the conditional entropy of the other.</p>
        <p><b>Step 1 — factor the joint probability.</b> The probability chain rule states $p(x,y)=p(x)\,p(y\mid x)$. Take $-\log_2$ of both sides: $-\log_2 p(x,y)=-\log_2 p(x)-\log_2 p(y\mid x).$ The self-information of the pair is the self-information of $X$ plus the conditional self-information of $Y$ given $X$.</p>
        <p><b>Step 2 — average over the joint distribution.</b> Multiply by $p(x,y)$ and sum over all $x,y$:</p>
        $$ H(X,Y)=-\sum_{x,y}p(x,y)\log_2 p(x)-\sum_{x,y}p(x,y)\log_2 p(y\mid x). $$
        <p>In the first sum, $\sum_y p(x,y)=p(x)$, collapsing it to $-\sum_x p(x)\log_2 p(x)=H(X)$. The second sum is by definition $H(Y\mid X)$.</p>
        <p><b>Result.</b> $$ H(X,Y)=H(X)+H(Y\mid X). $$ By symmetry of the roles of $X$ and $Y$ (factor as $p(y)p(x\mid y)$ instead), the same argument gives $H(X,Y)=H(Y)+H(X\mid Y)$. Uncertainty is additive: the whole pair equals the first variable plus what remains of the second.</p>`
      },
      {
        title: 'Mutual information (four equivalent forms)',
        tex: String.raw`$$ I(X;Y)=H(X)-H(X\mid Y)=H(X)+H(Y)-H(X,Y)=\sum_{x,y}p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)} $$`,
        derivation: String.raw`<p><b>Where we start.</b> We want to quantify how much observing $Y$ reduces uncertainty about $X$. The natural definition is the drop in entropy: $I(X;Y)\equiv H(X)-H(X\mid Y)$. We show this equals three other useful expressions.</p>
        <p><b>Step 1 — the symmetric "overlap" form.</b> Apply the chain rule two ways: $H(X\mid Y)=H(X,Y)-H(Y)$. Substitute into the definition: $I(X;Y)=H(X)-\big(H(X,Y)-H(Y)\big)=H(X)+H(Y)-H(X,Y).$ Because this is symmetric in $X$ and $Y$, we immediately get $I(X;Y)=H(Y)-H(Y\mid X)=I(Y;X)$ — information is mutual.</p>
        <p><b>Step 2 — the divergence form.</b> Expand each entropy as a sum and combine the logarithms. Using $H(X,Y)=-\sum p(x,y)\log_2 p(x,y)$, $H(X)=-\sum p(x,y)\log_2 p(x)$ and $H(Y)=-\sum p(x,y)\log_2 p(y)$ (each marginalised over the joint), $$ I(X;Y)=\sum_{x,y}p(x,y)\big[\log_2 p(x,y)-\log_2 p(x)-\log_2 p(y)\big]=\sum_{x,y}p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}. $$</p>
        <p><b>Result.</b> All four forms are equal. The last one exposes $I(X;Y)=D\big(p(x,y)\,\|\,p(x)p(y)\big)\ge 0$, so mutual information is non-negative and vanishes exactly when $p(x,y)=p(x)p(y)$ — i.e. when $X$ and $Y$ are independent. Mutual information is the shared information of the two variables, in bits.</p>`
      },
      {
        title: 'Relative entropy (KL divergence) is non-negative — Gibbs',
        tex: String.raw`$$ D(p\,\|\,q)=\sum_{x}p(x)\log_2\frac{p(x)}{q(x)}\ge 0,\quad\text{= 0 iff } p=q $$`,
        derivation: String.raw`<p><b>Where we start.</b> Given two distributions $p,q$ on the same alphabet, relative entropy $D(p\,\|\,q)=\sum_x p(x)\log_2\frac{p(x)}{q(x)}$ measures the cost of modelling $p$ by $q$. We prove it can never be negative.</p>
        <p><b>Step 1 — switch to natural logs and bound with a line.</b> Write $D(p\,\|\,q)=\frac{1}{\ln 2}\sum_x p(x)\ln\frac{p(x)}{q(x)}=-\frac{1}{\ln 2}\sum_x p(x)\ln\frac{q(x)}{p(x)}.$ Use the elementary inequality $\ln t\le t-1$ for all $t>0$ (equality iff $t=1$), with $t=q(x)/p(x)$.</p>
        <p><b>Step 2 — apply the bound and simplify.</b> $$ \sum_x p(x)\ln\frac{q(x)}{p(x)}\le\sum_x p(x)\!\left(\frac{q(x)}{p(x)}-1\right)=\sum_x q(x)-\sum_x p(x)=1-1=0. $$ Therefore $-\frac{1}{\ln 2}\times(\text{something}\le 0)\ge 0$, giving $D(p\,\|\,q)\ge 0$.</p>
        <p><b>Result.</b> $$ D(p\,\|\,q)\ge 0, $$ with equality iff $q(x)/p(x)=1$ for every $x$, i.e. $p=q$. This is <em>Gibbs' inequality</em>. It is the engine behind the entropy upper bound ($H\le\log_2 M$), the non-negativity of mutual information ($I=D(p_{XY}\,\|\,p_Xp_Y)\ge 0$), and the fact that cross-entropy is minimised by the true distribution. Note $D$ is asymmetric and is not a metric.</p>`
      },
      {
        title: 'Capacity of the binary symmetric channel',
        tex: String.raw`$$ C_{\mathrm{BSC}}=\max_{p(x)}I(X;Y)=1-H(p) $$`,
        derivation: String.raw`<p><b>Where we start.</b> The binary symmetric channel $\mathrm{BSC}(p)$ takes a bit $X\in\{0,1\}$ and outputs $Y=X\oplus N$, where $N=1$ (a flip) with probability $p$ independently of $X$. Capacity is $C=\max_{p(x)}I(X;Y)$; we use $I(X;Y)=H(Y)-H(Y\mid X)$.</p>
        <p><b>Step 1 — the noise term is fixed.</b> Given $X=x$, the output $Y$ equals $x$ except for a flip of probability $p$, so its conditional distribution is $\{1-p,p\}$ regardless of $x$. Hence $H(Y\mid X=x)=H(p)$ for every $x$, and averaging, $H(Y\mid X)=H(p)$ — independent of the input distribution.</p>
        <p><b>Step 2 — maximise the output entropy.</b> Since $Y$ is binary, $H(Y)\le 1$ bit, with equality iff $Y$ is equiprobable. Choosing the input equiprobable, $p(X=0)=p(X=1)=\tfrac12$, makes $P(Y=0)=(1-p)\tfrac12+p\tfrac12=\tfrac12$, so $Y$ is equiprobable and $H(Y)=1$ is achieved.</p>
        <p><b>Result.</b> $$ C_{\mathrm{BSC}}=\max H(Y)-H(Y\mid X)=1-H(p)\ \text{bits/use}. $$ At $p=0$ or $p=1$, $H(p)=0$ so $C=1$ (a perfect, if inverted, wire); at $p=\tfrac12$, $H(p)=1$ so $C=0$ (output independent of input, the channel is useless). Example: $p=0.11$ gives $H(p)\approx 0.5$, so $C\approx 0.5$ bit/use.</p>`
      },
      {
        title: 'Capacity of the binary erasure channel',
        tex: String.raw`$$ C_{\mathrm{BEC}}=\max_{p(x)}I(X;Y)=1-\epsilon $$`,
        derivation: String.raw`<p><b>Where we start.</b> The binary erasure channel $\mathrm{BEC}(\epsilon)$ has input $X\in\{0,1\}$ and output $Y\in\{0,1,e\}$: with probability $1-\epsilon$ the bit arrives correctly ($Y=X$), and with probability $\epsilon$ it is erased ($Y=e$). Crucially the receiver always <em>knows</em> when an erasure occurred. Capacity is $C=\max_{p(x)}I(X;Y)$, and we use $I(X;Y)=H(X)-H(X\mid Y)$.</p>
        <p><b>Step 1 — compute the residual uncertainty about the input.</b> When $Y\in\{0,1\}$ (probability $1-\epsilon$) the input is known exactly, contributing zero uncertainty. When $Y=e$ (probability $\epsilon$) the output says nothing about $X$, leaving the full input uncertainty $H(X)$. Averaging, $H(X\mid Y)=(1-\epsilon)\cdot 0+\epsilon\cdot H(X)=\epsilon\,H(X).$</p>
        <p><b>Step 2 — substitute and maximise.</b> Then $I(X;Y)=H(X)-\epsilon H(X)=(1-\epsilon)H(X).$ This is maximised by making $H(X)$ as large as possible; for a binary input $\max H(X)=1$ bit, at an equiprobable input.</p>
        <p><b>Result.</b> $$ C_{\mathrm{BEC}}=(1-\epsilon)\cdot 1=1-\epsilon\ \text{bits/use}. $$ Intuitively, a fraction $1-\epsilon$ of channel uses get through perfectly and the rest are lost but flagged, so exactly $1-\epsilon$ bits per use survive. Example: $\epsilon=0.25$ gives $C=0.75$ bit/use. Compare $C_{\mathrm{BSC}}=1-H(p)$: erasures (known losses) cost less capacity than flips (unknown errors) of the same probability.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Define the self-information of an outcome.`, back: String.raw`$I(x)=-\log_2 p(x)$ bits — the "surprise" of $x$; rarer outcomes (smaller $p$) carry more information, and a certain event carries $0$.` },
      { front: String.raw`Define the entropy of a source $X$.`, back: String.raw`$H(X)=-\sum_x p(x)\log_2 p(x)=\mathbb E[-\log_2 p(X)]$: the average information (bits/symbol), i.e. the average surprise of the source.` },
      { front: String.raw`When is entropy maximal, and what is the maximum?`, back: String.raw`For the uniform distribution $p(x)=1/|\mathcal X|$; the maximum is $H=\log_2|\mathcal X|$. Maximum entropy = maximum ignorance.` },
      { front: String.raw`When is entropy zero?`, back: String.raw`When the source is deterministic — one symbol has probability $1$ — so there is no uncertainty and no information.` },
      { front: String.raw`Write the binary entropy function and its peak.`, back: String.raw`$H(p)=-p\log_2 p-(1-p)\log_2(1-p)$; concave, symmetric about $p=\tfrac12$, peaking at $H(0.5)=1$ bit, with $H(0)=H(1)=0$.` },
      { front: String.raw`What are the units of information for log base 2, $e$, and 10?`, back: String.raw`Base 2 → bits (shannons); base $e$ → nats ($1\,\text{nat}=1/\ln2\approx1.443$ bits); base 10 → Hartleys/dits ($\approx3.322$ bits).` },
      { front: String.raw`Define conditional entropy $H(Y\mid X)$.`, back: String.raw`$H(Y\mid X)=-\sum_{x,y}p(x,y)\log_2 p(y\mid x)$: the average uncertainty left in $Y$ after $X$ is known.` },
      { front: String.raw`State the chain rule for entropy.`, back: String.raw`$H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y)$ — the additive law of uncertainty.` },
      { front: String.raw`Does conditioning increase or decrease entropy?`, back: String.raw`On average it decreases (never increases) it: $H(Y\mid X)\le H(Y)$, with equality iff $X$ and $Y$ are independent.` },
      { front: String.raw`Give the four equivalent forms of mutual information.`, back: String.raw`$I(X;Y)=H(X)-H(X\mid Y)=H(Y)-H(Y\mid X)=H(X)+H(Y)-H(X,Y)=\sum p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}$.` },
      { front: String.raw`List three key properties of $I(X;Y)$.`, back: String.raw`Symmetric ($I(X;Y)=I(Y;X)$); non-negative ($I\ge 0$); and $I=0$ iff $X,Y$ independent. Also $I(X;X)=H(X)$.` },
      { front: String.raw`Define KL divergence and state Gibbs' inequality.`, back: String.raw`$D(p\,\|\,q)=\sum_x p(x)\log_2\frac{p(x)}{q(x)}$; Gibbs: $D\ge 0$, with equality iff $p=q$. It is asymmetric and not a metric.` },
      { front: String.raw`How is mutual information a KL divergence?`, back: String.raw`$I(X;Y)=D\big(p(x,y)\,\|\,p(x)p(y)\big)$ — the divergence of the joint from the product of marginals; this is why $I\ge 0$.` },
      { front: String.raw`Define channel capacity.`, back: String.raw`$C=\max_{p(x)}I(X;Y)$ bits per channel use — the maximum reliable rate, a property of the channel law $p(y\mid x)$ alone.` },
      { front: String.raw`Give the capacities of the BSC and BEC.`, back: String.raw`$C_{\mathrm{BSC}}=1-H(p)$ (flip probability $p$); $C_{\mathrm{BEC}}=1-\epsilon$ (erasure probability $\epsilon$).` },
      { front: String.raw`State the two fundamental coding theorems in one line each.`, back: String.raw`Source coding: lossless compression needs $\ge H$ bits/symbol (achievable). Noisy-channel coding: reliable communication is possible iff the rate $R<C$.` },
      { front: String.raw`State the data-processing inequality.`, back: String.raw`For a Markov chain $X\to Y\to Z$, $I(X;Z)\le I(X;Y)$: post-processing $Y$ cannot create information about $X$.` },
      { front: String.raw`What does Fano's inequality give, and what is the differential entropy of a Gaussian?`, back: String.raw`Fano bounds error probability via $H(X\mid Y)$, providing the converse to the coding theorem. A Gaussian of variance $\sigma^2$ has $h(X)=\tfrac12\log_2(2\pi e\,\sigma^2)$ and maximises differential entropy at fixed variance.` }
    ],
    mcqs: [
      { q: String.raw`The self-information of an outcome with probability $p$ is:`, options: [String.raw`$-\log_2 p$`, String.raw`$+\log_2 p$`, String.raw`$p\log_2 p$`, String.raw`$1-p$`], answer: 0, explain: String.raw`$I=-\log_2 p$ bits: it is positive (since $p\le1$), decreasing in $p$, and additive over independent events.` },
      { q: String.raw`Entropy $H(X)$ is maximised when $X$ is:`, options: [String.raw`deterministic (one certain outcome)`, String.raw`highly skewed`, String.raw`uniformly distributed`, String.raw`always binary`], answer: 2, explain: String.raw`The uniform distribution gives the greatest uncertainty, $H=\log_2|\mathcal X|$; a deterministic source has $H=0$.` },
      { q: String.raw`For an alphabet of size $|\mathcal X|$, the maximum possible entropy is:`, options: [String.raw`$|\mathcal X|$ bits`, String.raw`$1$ bit`, String.raw`$\log_2|\mathcal X|$ bits`, String.raw`$|\mathcal X|\log_2|\mathcal X|$ bits`], answer: 2, explain: String.raw`$H\le\log_2|\mathcal X|$, achieved by the uniform distribution (e.g. $\log_2 6\approx2.585$ bits for a fair die).` },
      { q: String.raw`Mutual information $I(X;Y)=0$ if and only if:`, options: [String.raw`$X=Y$`, String.raw`the channel is noiseless`, String.raw`$X$ and $Y$ are independent`, String.raw`$H(X)=H(Y)$`], answer: 2, explain: String.raw`$I=D(p_{XY}\,\|\,p_Xp_Y)$ is zero exactly when $p(x,y)=p(x)p(y)$, i.e. independence.` },
      { q: String.raw`Which identity for mutual information is correct?`, options: [String.raw`$I(X;Y)=H(X)+H(Y)+H(X,Y)$`, String.raw`$I(X;Y)=H(X,Y)-H(X)-H(Y)$`, String.raw`$I(X;Y)=H(X\mid Y)+H(Y\mid X)$`, String.raw`$I(X;Y)=H(X)+H(Y)-H(X,Y)$`], answer: 3, explain: String.raw`The "overlap" form: the sum of individual entropies minus the joint entropy is the shared information.` },
      { q: String.raw`The chain rule for entropy states:`, options: [String.raw`$H(X,Y)=H(X)+H(Y\mid X)$`, String.raw`$H(X,Y)=H(X)\,H(Y)$`, String.raw`$H(X,Y)=H(X)-H(Y\mid X)$`, String.raw`$H(X,Y)=H(X\mid Y)-H(Y\mid X)$`], answer: 0, explain: String.raw`It mirrors $p(x,y)=p(x)p(y\mid x)$; taking $-\log_2$ and averaging turns the product into the sum $H(X)+H(Y\mid X)$.` },
      { q: String.raw`Because conditioning cannot increase entropy on average:`, options: [String.raw`$H(Y\mid X)\ge H(Y)$`, String.raw`$H(Y\mid X)\le H(Y)$`, String.raw`$H(Y\mid X)=H(Y)$ always`, String.raw`$H(Y\mid X)=0$ always`], answer: 1, explain: String.raw`$H(Y\mid X)\le H(Y)$, with equality iff independent; this is what makes $I(X;Y)\ge0$.` },
      { q: String.raw`Which statement about the KL divergence $D(p\,\|\,q)$ is TRUE?`, options: [String.raw`It is symmetric in $p$ and $q$`, String.raw`It can be negative`, String.raw`It is $\ge 0$, with equality iff $p=q$`, String.raw`It obeys the triangle inequality`], answer: 2, explain: String.raw`Gibbs' inequality: $D\ge 0$ and $=0$ iff $p=q$. It is asymmetric and not a metric, so it is not a true distance.` },
      { q: String.raw`The capacity of a binary symmetric channel with crossover probability $p$ is:`, options: [String.raw`$1-p$`, String.raw`$H(p)$`, String.raw`$1-H(p)$`, String.raw`$1+H(p)$`], answer: 2, explain: String.raw`$C=\max H(Y)-H(Y\mid X)=1-H(p)$; zero at $p=\tfrac12$, one at $p=0$ or $1$.` },
      { q: String.raw`The capacity of a binary erasure channel with erasure probability $\epsilon$ is:`, options: [String.raw`$1-\epsilon$`, String.raw`$1-H(\epsilon)$`, String.raw`$\epsilon$`, String.raw`$1-2\epsilon$`], answer: 0, explain: String.raw`A fraction $1-\epsilon$ of uses arrive perfectly (erasures are known losses), so $C=1-\epsilon$ bits/use.` },
      { q: String.raw`Channel capacity is defined as:`, options: [String.raw`$\min_{p(x)}I(X;Y)$`, String.raw`$\max_{p(x)}I(X;Y)$`, String.raw`$H(X)-H(Y)$`, String.raw`$\max_x H(X)$`], answer: 1, explain: String.raw`Capacity maximises the mutual information over all input distributions; it depends only on $p(y\mid x)$.` },
      { q: String.raw`For a Markov chain $X\to Y\to Z$, the data-processing inequality gives:`, options: [String.raw`$I(X;Z)\ge I(X;Y)$`, String.raw`$I(X;Z)=I(X;Y)$`, String.raw`$I(X;Z)\le I(X;Y)$`, String.raw`$I(X;Z)=0$`], answer: 2, explain: String.raw`Post-processing cannot create information: $Z$'s information about $X$ cannot exceed $Y$'s.` },
      { q: String.raw`The noisy-channel coding theorem says arbitrarily reliable communication is achievable exactly when:`, options: [String.raw`$R>C$`, String.raw`$R=C$ exactly`, String.raw`$R<C$`, String.raw`$R>H$`], answer: 2, explain: String.raw`For every rate below capacity codes with vanishing error exist; above capacity, error is bounded away from zero.` },
      { q: String.raw`One nat of information equals:`, options: [String.raw`$\ln 2\approx0.693$ bits`, String.raw`exactly $1$ bit`, String.raw`$1/\ln 2\approx1.443$ bits`, String.raw`$2$ bits`], answer: 2, explain: String.raw`Since $1$ bit $=\ln 2$ nats, $1$ nat $=1/\ln 2\approx1.4427$ bits (divide a nat count by $\ln 2$ to get bits).` },
      { q: String.raw`Among continuous distributions with a fixed variance $\sigma^2$, maximum differential entropy is achieved by the:`, options: [String.raw`uniform distribution`, String.raw`Gaussian distribution`, String.raw`exponential distribution`, String.raw`Laplace distribution`], answer: 1, explain: String.raw`The Gaussian maximises $h(X)$ for a given variance, $h=\tfrac12\log_2(2\pi e\,\sigma^2)$ — why Gaussian noise is the worst case.` }
    ],
    numericals: [
      { q: String.raw`A source emits four symbols with probabilities $\{\tfrac12,\tfrac14,\tfrac18,\tfrac18\}$. Find its entropy and its efficiency versus a uniform source of the same alphabet size.`, solution: String.raw`<p><b>Formula.</b> $$ H(X)=-\sum_i p_i\log_2 p_i,\qquad \eta=\frac{H(X)}{\log_2 M} $$ where $M=|\mathcal X|$ is the alphabet size and $\log_2 M$ is the maximum (uniform) entropy.</p>
<p><b>Substitute.</b> $$ H=-\Big(\tfrac12\log_2\tfrac12+\tfrac14\log_2\tfrac14+\tfrac18\log_2\tfrac18+\tfrac18\log_2\tfrac18\Big). $$</p>
<p><b>Compute.</b> $\log_2\tfrac12=-1,\ \log_2\tfrac14=-2,\ \log_2\tfrac18=-3$, so $H=\tfrac12(1)+\tfrac14(2)+\tfrac18(3)+\tfrac18(3)=0.5+0.5+0.375+0.375=1.75$ bits/symbol. With $M=4$, $\log_2 4=2$, so $\eta=1.75/2=0.875=87.5\%$.</p>
<p><b>Explanation.</b> The source carries $1.75$ bits/symbol where a naive fixed-length code spends $2$ bits, so an ideal compressor (see <em>Source Coding</em>) saves $12.5\%$ — the redundancy. Sanity check: $H=1.75<\log_2 4=2$, correctly below the uniform ceiling, and the probabilities are dyadic so a Huffman code hits $H$ exactly.</p>` },
      { q: String.raw`Compute the binary entropy $H(p)$ at $p=0.1$.`, solution: String.raw`<p><b>Formula.</b> $$ H(p)=-p\log_2 p-(1-p)\log_2(1-p) $$ where $p$ is the probability of one of the two outcomes and $H(p)$ is in bits.</p>
<p><b>Substitute.</b> $$ H(0.1)=-0.1\log_2 0.1-0.9\log_2 0.9. $$</p>
<p><b>Compute.</b> $\log_2 0.1=-3.3219$ so $-0.1\times(-3.3219)=0.3322$; $\log_2 0.9=-0.1520$ so $-0.9\times(-0.1520)=0.1368$. Sum: $H(0.1)=0.3322+0.1368=0.4690$ bits.</p>
<p><b>Explanation.</b> A $90/10$ biased bit carries only about $0.47$ bits, less than half the $1$ bit of a fair coin — its predictability is compressible slack. Sanity check: $H(0.1)$ lies between $H(0)=0$ and the peak $H(0.5)=1$, and equals $H(0.9)$ by the symmetry of the curve.</p>` },
      { q: String.raw`For the joint distribution $p(0,0)=\tfrac12,\ p(0,1)=\tfrac14,\ p(1,0)=0,\ p(1,1)=\tfrac14$, find $H(X)$, $H(Y)$, $H(X,Y)$ and the mutual information $I(X;Y)$.`, solution: String.raw`<p><b>Formula.</b> $$ I(X;Y)=H(X)+H(Y)-H(X,Y),\quad H(\cdot)=-\sum p\log_2 p. $$ Marginals: $p(x)=\sum_y p(x,y)$, $p(y)=\sum_x p(x,y)$.</p>
<p><b>Substitute.</b> Marginals: $p(X\!=\!0)=\tfrac12+\tfrac14=\tfrac34,\ p(X\!=\!1)=\tfrac14$; $p(Y\!=\!0)=\tfrac12,\ p(Y\!=\!1)=\tfrac12$. So $H(X)=H(\tfrac34)$, $H(Y)=H(\tfrac12)=1$, and $H(X,Y)=-\big(\tfrac12\log_2\tfrac12+\tfrac14\log_2\tfrac14+\tfrac14\log_2\tfrac14\big)$ (the $0$ term drops out).</p>
<p><b>Compute.</b> $H(X)=-\tfrac34\log_2\tfrac34-\tfrac14\log_2\tfrac14=0.75(0.4150)+0.25(2)=0.3113+0.5=0.8113$ bits; $H(Y)=1$ bit; $H(X,Y)=\tfrac12(1)+\tfrac14(2)+\tfrac14(2)=0.5+0.5+0.5=1.5$ bits. Then $I(X;Y)=0.8113+1-1.5=0.3113$ bits.</p>
<p><b>Explanation.</b> $X$ and $Y$ share about $0.31$ bits. Cross-check with the other form: $H(X\mid Y)=H(X,Y)-H(Y)=1.5-1=0.5$, so $H(X)-H(X\mid Y)=0.8113-0.5=0.3113$ — identical, confirming $I=H(X)-H(X\mid Y)$. The value is positive (they are dependent) and below $\min(H(X),H(Y))=0.8113$, as it must be.</p>` },
      { q: String.raw`Compute the KL divergence $D(p\,\|\,q)$ (in bits) for $p=(\tfrac12,\tfrac12)$ and $q=(\tfrac14,\tfrac34)$, and confirm it is non-negative.`, solution: String.raw`<p><b>Formula.</b> $$ D(p\,\|\,q)=\sum_x p(x)\log_2\frac{p(x)}{q(x)} $$ where the sum runs over the shared alphabet and the result is in bits.</p>
<p><b>Substitute.</b> $$ D=\tfrac12\log_2\frac{1/2}{1/4}+\tfrac12\log_2\frac{1/2}{3/4}=\tfrac12\log_2 2+\tfrac12\log_2\tfrac{2}{3}. $$</p>
<p><b>Compute.</b> $\log_2 2=1$; $\log_2\tfrac23=\log_2 2-\log_2 3=1-1.5850=-0.5850$. So $D=\tfrac12(1)+\tfrac12(-0.5850)=0.5-0.2925=0.2075$ bits.</p>
<p><b>Explanation.</b> Modelling the true fair source $p$ with the skewed code $q$ wastes about $0.21$ extra bits per symbol; $D\ge0$ as Gibbs' inequality guarantees. Note the asymmetry: the reverse $D(q\,\|\,p)=\tfrac14\log_2\tfrac12+\tfrac34\log_2\tfrac32=-0.25+0.4387=0.189$ bits differs, confirming $D$ is not a distance.</p>` },
      { q: String.raw`A binary symmetric channel has crossover probability $p=0.11$. Find its capacity.`, solution: String.raw`<p><b>Formula.</b> $$ C_{\mathrm{BSC}}=1-H(p),\qquad H(p)=-p\log_2 p-(1-p)\log_2(1-p) $$ with $C$ in bits per channel use.</p>
<p><b>Substitute.</b> $$ H(0.11)=-0.11\log_2 0.11-0.89\log_2 0.89. $$</p>
<p><b>Compute.</b> $\log_2 0.11=-3.1844$ so $-0.11\times(-3.1844)=0.3503$; $\log_2 0.89=-0.1681$ so $-0.89\times(-0.1681)=0.1496$. Then $H(0.11)=0.3503+0.1496=0.4999\approx0.500$, and $C=1-0.500=0.500$ bit/use.</p>
<p><b>Explanation.</b> An $11\%$ error rate halves the channel's information-carrying ability, from $1$ bit/use down to about $0.5$. Sanity check: $C=1$ at $p=0$ and $C=0$ at $p=0.5$, and $0.5$ sits correctly between; a rate-$\tfrac12$ code (see <em>FEC</em>) is right at this channel's limit.</p>` },
      { q: String.raw`A binary erasure channel erases each bit with probability $\epsilon=0.25$. Find its capacity, and compare with a BSC of the same parameter.`, solution: String.raw`<p><b>Formula.</b> $$ C_{\mathrm{BEC}}=1-\epsilon,\qquad C_{\mathrm{BSC}}=1-H(\epsilon). $$ Both are in bits per channel use.</p>
<p><b>Substitute.</b> $$ C_{\mathrm{BEC}}=1-0.25=0.75;\qquad C_{\mathrm{BSC}}=1-H(0.25). $$</p>
<p><b>Compute.</b> $C_{\mathrm{BEC}}=0.75$ bit/use. For comparison $H(0.25)=-0.25\log_2 0.25-0.75\log_2 0.75=0.25(2)+0.75(0.4150)=0.5+0.3113=0.8113$, so $C_{\mathrm{BSC}}=1-0.8113=0.1887$ bit/use.</p>
<p><b>Explanation.</b> An erasure channel keeps $0.75$ bit/use because the $25\%$ of lost bits are <em>flagged</em> (known losses), whereas a BSC that flips $25\%$ of bits keeps only $0.19$ bit/use — unknown errors are far more damaging than known erasures of the same probability. This is why erasure-aware schemes and retransmission thrive on packet networks.</p>` },
      { q: String.raw`A Gaussian noise source of variance $\sigma^2=1$ has differential entropy $h=\tfrac12\ln(2\pi e\,\sigma^2)$ nats. Express it in bits.`, solution: String.raw`<p><b>Formula.</b> $$ h=\tfrac12\ln(2\pi e\,\sigma^2)\ \text{nats},\qquad h_{\text{bits}}=\frac{h_{\text{nats}}}{\ln 2}=\tfrac12\log_2(2\pi e\,\sigma^2). $$ Dividing a nat count by $\ln2=0.6931$ converts it to bits.</p>
<p><b>Substitute.</b> With $\sigma^2=1$: $2\pi e=2(3.14159)(2.71828)=17.079$, so $h=\tfrac12\ln(17.079)$ nats and $h_{\text{bits}}=h/\ln2$.</p>
<p><b>Compute.</b> $\ln(17.079)=2.8379$, so $h=1.4189$ nats. In bits: $h_{\text{bits}}=1.4189/0.6931=2.047$ bits (equivalently $\tfrac12\log_2 17.079=\tfrac12(4.094)=2.047$).</p>
<p><b>Explanation.</b> The unit conversion is a simple division by $\ln 2$ (a nat is worth $\approx1.443$ bits). Differential entropy, unlike discrete entropy, can be negative and depends on scale — here it is positive because $\sigma^2=1$ is "large". The Gaussian is the maximum-entropy distribution for this variance, the fact that makes it the worst-case noise and the capacity-optimal input on the AWGN channel (see <em>Shannon</em>).</p>` }
    ],
    realWorld: String.raw`<p>Information theory is not an abstraction bolted onto communications — it is the ruler every real system is measured against. Data compression is entropy made practical: ZIP and PNG use entropy coders (Huffman, arithmetic, and modern range/ANS coders) that approach the source entropy $H$, JPEG and MP3 first discard perceptually irrelevant information and then entropy-code what remains, and a "high-entropy" file (already-compressed or encrypted) refuses to shrink further precisely because it already sits at its entropy floor. Mutual information is the currency of machine learning and statistics: cross-entropy loss — the objective minimised when training essentially every classifier and language model — is $H(p)+D(p\,\|\,q)$, so learning is literally driving the KL divergence between the model $q$ and the truth $p$ toward zero; feature-selection and decision-tree "information gain" are mutual information by another name.</p>
<p>On the channel side, capacity $C=\max I(X;Y)$ sets the target that modern codes chase to within a fraction of a decibel: LDPC and turbo codes on the AWGN channel (the <em>Shannon</em> topic's $C=B\log_2(1+\mathrm{SNR})$), and the polar codes proven to <em>achieve</em> the capacity of any binary-input channel. The binary erasure channel of this topic is the textbook model for packet networks, where a lost packet is a known erasure, explaining why erasure codes (fountain/LT/Raptor codes) and retransmission are so effective — erasures cost far less capacity than undetected errors. Fano's inequality underlies the "impossibility" side of every standards debate about how much a link can carry, and differential entropy with the Gaussian maximum-entropy property is why additive Gaussian noise is treated as the worst case in link budgets. From the $56$k modem plateau to $5$G's adaptive modulation and coding, from FLAC to large language models, the same handful of quantities — $H$, $I(X;Y)$, $D$, and $C$ — quietly set the limits.</p>`,
    related: ['shannon', 'source-coding', 'channel-coding', 'fec', 'awgn']
  }
);
