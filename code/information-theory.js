// information-theory.js — MATLAB + Python teaching code for "Information Theory".
// Populates CONTENT_CODE['information-theory']. No literal backticks or template-literal placeholders inside code strings.
// Every part is self-checking: measured numbers are printed next to the theory they must match.
// PART 1 computes entropy H(X) of a source and its efficiency vs the uniform ceiling log2|X|.
// PART 2 builds a joint distribution p(x,y) and computes H(X), H(Y), H(X,Y), H(Y|X), and I(X;Y),
//         verifying the three identities I = H(X)+H(Y)-H(X,Y) = H(X)-H(X|Y) = D(p_xy || p_x p_y).
// PART 3 is the binary entropy H(p) and KL divergence D(p||q) >= 0 (Gibbs), including asymmetry.
// PART 4 computes capacities: BSC C = 1 - H(p) and BEC C = 1 - epsilon, plus a nats->bits check.
Object.assign(CONTENT_CODE, {
  'information-theory': {
    matlab: String.raw`% INFORMATION THEORY experiments, all runnable and self-checking (base MATLAB or Octave, no toolboxes).
format short g;

% =================== PART 1: ENTROPY OF A SOURCE ===================
fprintf('=========== PART 1: entropy H(X) = -sum p log2 p, and efficiency vs uniform ===========\n');
p = [1/2 1/4 1/8 1/8];
H = ent(p);
M = numel(p);
fprintf('source p = [1/2 1/4 1/8 1/8]:  H = %.4f bits/symbol (theory 1.75)\n', H);
fprintf('uniform ceiling log2(%d) = %.4f;  efficiency eta = H/log2(M) = %.4f (= 87.5%%),  redundancy = %.4f\n', ...
        M, log2(M), H/log2(M), 1 - H/log2(M));
fprintf('deterministic source [1 0 0 0]: H = %.4f (theory 0);  uniform [.25 .25 .25 .25]: H = %.4f (theory 2)\n', ...
        ent([1 0 0 0]), ent([1 1 1 1]/4));

% =================== PART 2: JOINT / CONDITIONAL ENTROPY AND MUTUAL INFORMATION ===================
fprintf('\n=========== PART 2: I(X;Y) from a joint table, three ways ===========\n');
% Joint P(x,y): rows x = 0,1 ; cols y = 0,1
P = [1/2 1/4;    % x=0
     0   1/4];   % x=1
px = sum(P, 2)';         % marginal of X
py = sum(P, 1);          % marginal of Y
HX = ent(px); HY = ent(py); HXY = ent(P(:)');
HX_given_Y = HXY - HY;   % chain rule
I1 = HX + HY - HXY;                       % overlap form
I2 = HX - HX_given_Y;                     % reduction-in-uncertainty form
% divergence form: sum P .* log2( P / (px' * py) )
Q = px' * py;            % product of marginals
mask = P > 0;
I3 = sum( P(mask) .* log2( P(mask) ./ Q(mask) ) );
fprintf('H(X) = %.4f, H(Y) = %.4f, H(X,Y) = %.4f, H(X|Y) = %.4f\n', HX, HY, HXY, HX_given_Y);
fprintf('I(X;Y):  overlap = %.4f | H(X)-H(X|Y) = %.4f | KL(Pxy||PxPy) = %.4f  -> all equal? %d\n', ...
        I1, I2, I3, (abs(I1-I2) < 1e-12) && (abs(I1-I3) < 1e-12));

% =================== PART 3: BINARY ENTROPY AND KL DIVERGENCE (GIBBS) ===================
fprintf('\n=========== PART 3: binary entropy H(p) and KL divergence D(p||q) >= 0 ===========\n');
fprintf('H(0.1) = %.4f (theory 0.4690),  H(0.5) = %.4f (max = 1),  H(0.11) = %.4f (~0.5)\n', ...
        hb(0.1), hb(0.5), hb(0.11));
pv = [1/2 1/2]; qv = [1/4 3/4];
Dpq = kl(pv, qv); Dqp = kl(qv, pv);
fprintf('D(p||q) = %.4f bits (theory 0.2075) >= 0;  D(q||p) = %.4f bits (theory 0.1887)  -> asymmetric: %d\n', ...
        Dpq, Dqp, abs(Dpq - Dqp) > 1e-9);
fprintf('D(p||p) = %.4f (theory 0, equality iff p=q)\n', kl(pv, pv));

% =================== PART 4: CHANNEL CAPACITIES + UNIT CHECK ===================
fprintf('\n=========== PART 4: BSC C = 1 - H(p),  BEC C = 1 - eps,  nats -> bits ===========\n');
for pp = [0.0 0.11 0.25 0.5]
    fprintf('BSC(p=%.2f): C = 1 - H(p) = %.4f bit/use\n', pp, 1 - hb(pp));
end
for ee = [0.0 0.25 0.5 1.0]
    fprintf('BEC(eps=%.2f): C = 1 - eps = %.4f bit/use\n', ee, 1 - ee);
end
% erasures (known losses) cost less capacity than flips (unknown errors) of the same parameter:
fprintf('at parameter 0.25:  BEC C = %.4f  >  BSC C = %.4f\n', 1 - 0.25, 1 - hb(0.25));
% differential entropy of a unit-variance Gaussian, nats -> bits by dividing by ln2:
h_nats = 0.5 * log(2*pi*exp(1)*1);
fprintf('Gaussian (var=1) diff. entropy: %.4f nats = %.4f bits (= 0.5*log2(2*pi*e) = %.4f)\n', ...
        h_nats, h_nats/log(2), 0.5*log2(2*pi*exp(1)));

% ------------------------- helper functions -------------------------
function H = ent(p)
    p = p(p > 0);            % drop zero-probability terms (0 log 0 = 0)
    H = -sum(p .* log2(p));
end

function H = hb(p)
    if p == 0 || p == 1
        H = 0;
    else
        H = -p*log2(p) - (1-p)*log2(1-p);
    end
end

function D = kl(p, q)
    idx = p > 0;             % terms with p = 0 contribute 0
    D = sum( p(idx) .* log2( p(idx) ./ q(idx) ) );
end
`,
    python: String.raw`# INFORMATION THEORY experiments, all runnable and self-checking (NumPy only).
# PART 1 computes entropy H(X) and efficiency vs the uniform ceiling log2|X|.
# PART 2 builds a joint p(x,y) and gets I(X;Y) three ways: overlap, H(X)-H(X|Y), and KL(Pxy||PxPy).
# PART 3 is binary entropy H(p) and KL divergence D(p||q) >= 0 (Gibbs), including its asymmetry.
# PART 4 is BSC capacity 1-H(p), BEC capacity 1-eps, and a nats->bits unit check.
import numpy as np


def ent(p):
    p = np.asarray(p, dtype=float)
    p = p[p > 0]                       # 0 log 0 = 0
    return float(-np.sum(p * np.log2(p)))


def hb(p):
    if p in (0, 1):
        return 0.0
    return float(-p * np.log2(p) - (1 - p) * np.log2(1 - p))


def kl(p, q):
    p = np.asarray(p, dtype=float)
    q = np.asarray(q, dtype=float)
    idx = p > 0                        # terms with p = 0 contribute 0
    return float(np.sum(p[idx] * np.log2(p[idx] / q[idx])))


# =================== PART 1: ENTROPY OF A SOURCE ===================
print("=========== PART 1: entropy H(X) = -sum p log2 p, and efficiency vs uniform ===========")
p = np.array([1/2, 1/4, 1/8, 1/8])
H = ent(p)
M = p.size
print(f"source p = [1/2 1/4 1/8 1/8]:  H = {H:.4f} bits/symbol (theory 1.75)")
print(f"uniform ceiling log2({M}) = {np.log2(M):.4f};  efficiency eta = {H/np.log2(M):.4f} (= 87.5%), "
      f"redundancy = {1 - H/np.log2(M):.4f}")
print(f"deterministic [1,0,0,0]: H = {ent([1,0,0,0]):.4f} (theory 0);  "
      f"uniform: H = {ent([.25,.25,.25,.25]):.4f} (theory 2)")

# =================== PART 2: JOINT / CONDITIONAL ENTROPY AND MUTUAL INFORMATION ===================
print("\n=========== PART 2: I(X;Y) from a joint table, three ways ===========")
P = np.array([[1/2, 1/4],   # x=0
              [0.0, 1/4]])   # x=1
px = P.sum(axis=1)           # marginal of X
py = P.sum(axis=0)           # marginal of Y
HX, HY, HXY = ent(px), ent(py), ent(P.ravel())
HX_given_Y = HXY - HY        # chain rule
I1 = HX + HY - HXY                                   # overlap form
I2 = HX - HX_given_Y                                 # reduction-in-uncertainty form
Q = np.outer(px, py)                                 # product of marginals
mask = P > 0
I3 = float(np.sum(P[mask] * np.log2(P[mask] / Q[mask])))   # divergence form
print(f"H(X) = {HX:.4f}, H(Y) = {HY:.4f}, H(X,Y) = {HXY:.4f}, H(X|Y) = {HX_given_Y:.4f}")
print(f"I(X;Y):  overlap = {I1:.4f} | H(X)-H(X|Y) = {I2:.4f} | KL(Pxy||PxPy) = {I3:.4f}  "
      f"-> all equal? {abs(I1-I2) < 1e-12 and abs(I1-I3) < 1e-12}")

# =================== PART 3: BINARY ENTROPY AND KL DIVERGENCE (GIBBS) ===================
print("\n=========== PART 3: binary entropy H(p) and KL divergence D(p||q) >= 0 ===========")
print(f"H(0.1) = {hb(0.1):.4f} (theory 0.4690),  H(0.5) = {hb(0.5):.4f} (max = 1),  "
      f"H(0.11) = {hb(0.11):.4f} (~0.5)")
pv, qv = [1/2, 1/2], [1/4, 3/4]
Dpq, Dqp = kl(pv, qv), kl(qv, pv)
print(f"D(p||q) = {Dpq:.4f} bits (theory 0.2075) >= 0;  D(q||p) = {Dqp:.4f} bits (theory 0.1887)  "
      f"-> asymmetric: {abs(Dpq - Dqp) > 1e-9}")
print(f"D(p||p) = {kl(pv, pv):.4f} (theory 0, equality iff p=q)")

# =================== PART 4: CHANNEL CAPACITIES + UNIT CHECK ===================
print("\n=========== PART 4: BSC C = 1 - H(p),  BEC C = 1 - eps,  nats -> bits ===========")
for pp in (0.0, 0.11, 0.25, 0.5):
    print(f"BSC(p={pp:.2f}): C = 1 - H(p) = {1 - hb(pp):.4f} bit/use")
for ee in (0.0, 0.25, 0.5, 1.0):
    print(f"BEC(eps={ee:.2f}): C = 1 - eps = {1 - ee:.4f} bit/use")
print(f"at parameter 0.25:  BEC C = {1 - 0.25:.4f}  >  BSC C = {1 - hb(0.25):.4f}")
h_nats = 0.5 * np.log(2 * np.pi * np.e * 1)          # unit-variance Gaussian differential entropy (nats)
print(f"Gaussian (var=1) diff. entropy: {h_nats:.4f} nats = {h_nats/np.log(2):.4f} bits "
      f"(= 0.5*log2(2*pi*e) = {0.5*np.log2(2*np.pi*np.e):.4f})")
`,
    note: String.raw`Four self-checking experiments, each printing a measured number beside the theory it must match. PART 1 computes the entropy H(X) = -sum p log2 p of the dyadic source {1/2, 1/4, 1/8, 1/8} and confirms H = 1.75 bits/symbol; it then reports the efficiency eta = H/log2(M) = 1.75/2 = 0.875 (so the source has 12.5% redundancy versus a fixed-length code), and checks the two extremes derived in the topic — a deterministic source [1,0,0,0] gives H = 0 and the uniform source gives H = log2(4) = 2, the maximum for four symbols. PART 2 is the heart of the demo: it builds the joint distribution P(x,y) with P(0,0)=1/2, P(0,1)=1/4, P(1,0)=0, P(1,1)=1/4, forms the marginals px = (3/4, 1/4) and py = (1/2, 1/2), and computes H(X) = 0.8113, H(Y) = 1, H(X,Y) = 1.5 and H(X|Y) = H(X,Y) - H(Y) = 0.5. It then evaluates the mutual information THREE independent ways — the overlap form H(X)+H(Y)-H(X,Y), the reduction-in-uncertainty form H(X)-H(X|Y), and the divergence form sum P log2(P/(px py)) = D(Pxy || Px Py) — and verifies all three agree at I(X;Y) = 0.3113 bits, the numerical proof that the four faces of mutual information in the topic are the same quantity. PART 3 evaluates the binary entropy function H(p) at p = 0.1 (0.4690), 0.5 (the maximum, 1 bit) and 0.11 (about 0.5), then computes the Kullback-Leibler divergence D(p||q) for p = (1/2,1/2) and q = (1/4,3/4): it returns 0.2075 bits, confirms it is non-negative (Gibbs' inequality), and demonstrates the ASYMMETRY by also computing the reverse D(q||p) = 0.1887 bits (different), plus D(p||p) = 0 to show equality holds iff the distributions match. PART 4 turns the definitions into channel capacities: it prints the binary symmetric channel capacity C = 1 - H(p) for p in {0, 0.11, 0.25, 0.5} (giving 1, ~0.5, 0.1887, 0) and the binary erasure channel capacity C = 1 - epsilon for epsilon in {0, 0.25, 0.5, 1} (giving 1, 0.75, 0.5, 0), and highlights that at the same parameter 0.25 the BEC keeps 0.75 bit/use while the BSC keeps only 0.1887 — known erasures cost far less capacity than unknown flips. Finally it computes the differential entropy of a unit-variance Gaussian, 0.5*ln(2*pi*e) = 1.4189 nats, and converts it to bits by dividing by ln2 to get 2.047 bits, matching 0.5*log2(2*pi*e) and demonstrating the nats-to-bits unit conversion (1 nat = 1/ln2 ~= 1.4427 bits). Every printed value ties directly to an equation, table, or numerical in the topic, so running the file is a line-by-line verification of the theory. Note: all logarithms are base 2 so every quantity is in bits; switch log2 to natural log to get nats.`
  }
});
