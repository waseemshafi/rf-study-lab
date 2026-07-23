// short-ldpc.js — MATLAB + Python teaching code for "Single-Packet Short LDPC Codes".
// Populates CONTENT_CODE['short-ldpc']. No literal backticks or template-literal placeholders inside code strings.
// Every part is self-checking: measured numbers are printed next to the theory they must match.
// PART 1 computes the finite-blocklength (Polyanskiy-Poor-Verdu) normal-approximation max rate
//        R*(n,eps,SNR) = C - sqrt(V/n) Qinv(eps) + log2(n)/(2n) on the real-AWGN channel, tabulates it
//        vs blocklength, prints the gap to capacity, and verifies the sqrt(V/n) "halve-n -> x sqrt(2)" rule.
// PART 2 builds a small QC-LDPC parity-check from a protograph by circulant lifting (n = Z*n_b) and
//        reports its rate and MEASURED girth (BFS shortest cycle on the Tanner graph); it also prints the
//        stated 4x8, Z=64 -> n=512, k=256, R=1/2 scaling.
// PART 3 draws a stylized BLER waterfall+floor: a finite-blocklength waterfall term (from the normal
//        approximation) plus a union-bound error floor A_dmin Q(sqrt(2 dmin R Eb/N0)).
// PART 4 counts ordered-statistics-decoding (OSD) order-t complexity, sum_{i=0}^t C(k,i) re-encodings.
// For the belief-propagation / min-sum message algebra itself, see the general "LDPC Codes" topic; this
// file deliberately does not duplicate it.
Object.assign(CONTENT_CODE, {
  'short-ldpc': {
    matlab: String.raw`% SHORT LDPC / SINGLE-PACKET experiments, runnable and self-checking (base MATLAB or Octave, no toolboxes).
format short g;
LOG2E = 1/log(2);

% =================== PART 1: FINITE-BLOCKLENGTH (FBL) NORMAL APPROXIMATION ===================
fprintf('=========== PART 1: FBL max rate R*(n,eps,SNR) vs blocklength (real AWGN) ===========\n');
SNR = 1.0; eps = 1e-5;                         % 0 dB, five-nines target
C = 0.5*log2(1+SNR);                           % capacity, bits/use
V = SNR*(SNR+2)/(2*(1+SNR)^2) * LOG2E^2;       % dispersion, bits^2/use
qi = qinv(eps);
fprintf('SNR=%.3g (%.2f dB): C=%.4f bits/use, V=%.4f bits^2/use, Qinv(%.0e)=%.4f\n', SNR, 10*log10(SNR), C, V, eps, qi);
ns = [32 64 100 128 200 500 1000 2000 10000];
for k = 1:numel(ns)
    n = ns(k);
    backoff = sqrt(V/n)*qi;
    Rstar = C - backoff + log2(n)/(2*n);
    fprintf('n=%5d: backoff=%.4f  R*=%.4f  gap-to-C=%.4f (%.1f%% of C)\n', ...
            n, backoff, Rstar, C-Rstar, 100*(1-Rstar/C));
end
% halve-n rule: back-off ratio must be sqrt(2)
b128 = sqrt(V/128); b64 = sqrt(V/64);
fprintf('halving rule: back-off(64)/back-off(128) = %.5f (theory sqrt2 = %.5f)\n', b64/b128, sqrt(2));

% =================== PART 2: QC-LDPC FROM A PROTOGRAPH BY CIRCULANT LIFTING ===================
fprintf('\n=========== PART 2: QC-LDPC protograph + circulant lifting, measured girth ===========\n');
mb = 3; nb = 6; Z = 7;                          % base 3x6 (regular (3,6), rate 1/2), lift Z=7 (prime)
S = zeros(mb, nb);                              % array-LDPC style shifts s_ij = (i*j) mod Z
for i = 0:mb-1, for j = 0:nb-1, S(i+1,j+1) = mod(i*j, Z); end, end
H = lift_qc(S, Z);                              % (mb*Z) x (nb*Z) binary parity-check
n = nb*Z; m = mb*Z; kk = n - m; R = 1 - mb/nb;
g = tanner_girth(H);
fprintf('base %dx%d, Z=%d -> n=%d, m=%d, k=%d, rate R=1-mb/nb=%.3f, measured girth=%d\n', mb, nb, Z, n, m, kk, R, g);
fprintf('scaling (stated): base 4x8, Z=64 -> n=%d, m=%d, k=%d, R=%.3f\n', 8*64, 4*64, 8*64-4*64, 1-4/8);

% =================== PART 3: STYLIZED BLER WATERFALL + ERROR FLOOR ===================
fprintf('\n=========== PART 3: stylized BLER waterfall (FBL) + union-bound floor ===========\n');
nb_len = 128; Rc = 0.5; dmin = 10; Admin = 30;
fprintf('n=%d, R=%.2f, dmin=%d, A_dmin=%d\n', nb_len, Rc, dmin, Admin);
for EbN0dB = 1:0.5:6
    EbN0 = 10^(EbN0dB/10);
    s = Rc*EbN0;                                % Es/N0 for rate Rc
    Cc = 0.5*log2(1+s); Vc = s*(s+2)/(2*(1+s)^2)*LOG2E^2;
    eps_wf = qfun( sqrt(nb_len/Vc) * (Cc - Rc + log2(nb_len)/(2*nb_len)) );   % waterfall
    floor  = Admin * qfun( sqrt(2*dmin*Rc*EbN0) );                            % union-bound floor
    bler = min(1, eps_wf + floor);
    fprintf('Eb/N0=%.1f dB: waterfall=%.2e  floor=%.2e  BLER=%.2e\n', EbN0dB, eps_wf, floor, bler);
end

% =================== PART 4: ORDERED-STATISTICS DECODING (OSD) COMPLEXITY ===================
fprintf('\n=========== PART 4: OSD order-t re-encode count, sum_{i=0}^t C(k,i)  [(128,64): k=64] ===========\n');
kinfo = 64;
for t = 0:3
    N_TEP = 0; for i = 0:t, N_TEP = N_TEP + nchoosek_safe(kinfo, i); end
    fprintf('order-%d: N_TEP = sum_{i=0}^%d C(64,i) = %d\n', t, t, N_TEP);
end
fprintf('C(64,2)=%d (dominant order-2 term); long-code (k=8000) order-2 C=%.3g -> OSD is a SHORT-code tool.\n', ...
        nchoosek_safe(64,2), nchoosek_safe(8000,2));

% ------------------------- helper functions -------------------------
function y = qfun(x)                            % Q(x) = 0.5 erfc(x/sqrt2)
    y = 0.5*erfc(x/sqrt(2));
end
function x = qinv(p)                             % inverse Q by bisection
    lo = -10; hi = 10;
    for it = 1:200
        mid = 0.5*(lo+hi);
        if qfun(mid) > p, lo = mid; else, hi = mid; end
    end
    x = 0.5*(lo+hi);
end
function H = lift_qc(S, Z)                       % lift shift matrix S to a binary QC parity-check
    [mb, nb] = size(S);
    H = zeros(mb*Z, nb*Z);
    I = eye(Z);
    for i = 1:mb
        for j = 1:nb
            P = I(:, mod((0:Z-1) + S(i,j), Z) + 1);   % circulant: identity cyclically shifted by S(i,j)
            H((i-1)*Z+(1:Z), (j-1)*Z+(1:Z)) = P;
        end
    end
end
function g = tanner_girth(H)                     % shortest cycle on the bipartite Tanner graph via BFS
    [m, n] = size(H);
    N = n + m;                                   % nodes: 1..n variables, n+1..n+m checks
    adj = cell(N,1);
    [ri, ci] = find(H);
    for e = 1:numel(ri)
        v = ci(e); c = n + ri(e);
        adj{v}(end+1) = c; adj{c}(end+1) = v;
    end
    g = Inf;
    for s = 1:N
        dist = -ones(N,1); par = -ones(N,1);
        dist(s) = 0; q = s; head = 1;
        while head <= numel(q)
            u = q(head); head = head + 1;
            for w = adj{u}
                if dist(w) < 0
                    dist(w) = dist(u)+1; par(w) = u; q(end+1) = w;
                elseif par(u) ~= w
                    g = min(g, dist(u)+dist(w)+1);
                end
            end
        end
    end
end
function c = nchoosek_safe(n, r)                 % binomial without toolbox surprises
    c = 1; for i = 0:r-1, c = c*(n-i)/(i+1); end; c = round(c);
end
`,
    python: String.raw`# SHORT LDPC / SINGLE-PACKET experiments, runnable and self-checking (NumPy + math only).
# PART 1 tabulates the finite-blocklength (PPV) normal-approximation max rate R*(n,eps,SNR) on real AWGN.
# PART 2 builds a QC-LDPC parity-check from a protograph by circulant lifting and measures its girth.
# PART 3 draws a stylized BLER waterfall (from the normal approximation) plus a union-bound error floor.
# PART 4 counts ordered-statistics-decoding (OSD) order-t complexity, sum_{i=0}^t C(k,i).
# For the belief-propagation / min-sum algebra, see the general "LDPC Codes" topic; not duplicated here.
import math
from math import comb, log2, erfc, sqrt
from collections import deque
import numpy as np

LOG2E = 1.0 / math.log(2)


def Q(x):
    return 0.5 * erfc(x / math.sqrt(2))


def Qinv(p):                                    # inverse Q by bisection
    lo, hi = -10.0, 10.0
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        if Q(mid) > p:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi)


def awgn_C(snr):
    return 0.5 * log2(1 + snr)


def awgn_V(snr):
    return snr * (snr + 2) / (2 * (1 + snr) ** 2) * LOG2E ** 2


# =================== PART 1: FINITE-BLOCKLENGTH NORMAL APPROXIMATION ===================
print("=========== PART 1: FBL max rate R*(n,eps,SNR) vs blocklength (real AWGN) ===========")
SNR, eps = 1.0, 1e-5
C, V, qi = awgn_C(SNR), awgn_V(SNR), Qinv(1e-5)
print(f"SNR={SNR:g} ({10*math.log10(SNR):.2f} dB): C={C:.4f} bits/use, V={V:.4f} bits^2/use, Qinv({eps:.0e})={qi:.4f}")
for n in (32, 64, 100, 128, 200, 500, 1000, 2000, 10000):
    backoff = sqrt(V / n) * qi
    Rstar = C - backoff + log2(n) / (2 * n)
    print(f"n={n:5d}: backoff={backoff:.4f}  R*={Rstar:.4f}  gap-to-C={C-Rstar:.4f} ({100*(1-Rstar/C):.1f}% of C)")
print(f"halving rule: back-off(64)/back-off(128) = {sqrt(V/64)/sqrt(V/128):.5f} (theory sqrt2 = {math.sqrt(2):.5f})")


# =================== PART 2: QC-LDPC FROM A PROTOGRAPH BY CIRCULANT LIFTING ===================
def lift_qc(S, Z):                              # lift integer shift matrix S to a binary QC parity-check
    mb, nb = S.shape
    H = np.zeros((mb * Z, nb * Z), dtype=int)
    for i in range(mb):
        for j in range(nb):
            s = S[i, j] % Z
            for r in range(Z):                 # circulant: row r has a 1 at column (r+s) mod Z
                H[i * Z + r, j * Z + (r + s) % Z] = 1
    return H


def tanner_girth(H):                            # shortest cycle on the bipartite Tanner graph via BFS
    m, n = H.shape
    N = n + m                                   # nodes: 0..n-1 variables, n..n+m-1 checks
    adj = [[] for _ in range(N)]
    rows, cols = np.nonzero(H)
    for r, c in zip(rows, cols):
        v, ck = int(c), n + int(r)
        adj[v].append(ck); adj[ck].append(v)
    g = math.inf
    for s in range(N):
        dist = [-1] * N; par = [-1] * N
        dist[s] = 0; dq = deque([s])
        while dq:
            u = dq.popleft()
            for w in adj[u]:
                if dist[w] < 0:
                    dist[w] = dist[u] + 1; par[w] = u; dq.append(w)
                elif par[u] != w:
                    g = min(g, dist[u] + dist[w] + 1)
    return g


print("\n=========== PART 2: QC-LDPC protograph + circulant lifting, measured girth ===========")
mb, nb, Z = 3, 6, 7                             # base 3x6 (regular (3,6), rate 1/2), lift Z=7 (prime)
S = np.array([[(i * j) % Z for j in range(nb)] for i in range(mb)])  # array-LDPC style shifts
H = lift_qc(S, Z)
n, m = nb * Z, mb * Z
print(f"base {mb}x{nb}, Z={Z} -> n={n}, m={m}, k={n-m}, rate R=1-mb/nb={1-mb/nb:.3f}, measured girth={tanner_girth(H)}")
print(f"scaling (stated): base 4x8, Z=64 -> n={8*64}, m={4*64}, k={8*64-4*64}, R={1-4/8:.3f}")

# =================== PART 3: STYLIZED BLER WATERFALL + ERROR FLOOR ===================
print("\n=========== PART 3: stylized BLER waterfall (FBL) + union-bound floor ===========")
n_len, Rc, dmin, Admin = 128, 0.5, 10, 30
print(f"n={n_len}, R={Rc}, dmin={dmin}, A_dmin={Admin}")
ebn0_db = 1.0
while ebn0_db <= 6.0 + 1e-9:
    ebn0 = 10 ** (ebn0_db / 10)
    s = Rc * ebn0                               # Es/N0 for rate Rc
    Cc, Vc = awgn_C(s), awgn_V(s)
    eps_wf = Q(sqrt(n_len / Vc) * (Cc - Rc + log2(n_len) / (2 * n_len)))     # waterfall term
    floor = Admin * Q(sqrt(2 * dmin * Rc * ebn0))                            # union-bound floor
    bler = min(1.0, eps_wf + floor)
    print(f"Eb/N0={ebn0_db:.1f} dB: waterfall={eps_wf:.2e}  floor={floor:.2e}  BLER={bler:.2e}")
    ebn0_db += 0.5

# =================== PART 4: ORDERED-STATISTICS DECODING (OSD) COMPLEXITY ===================
print("\n=========== PART 4: OSD order-t re-encode count, sum_{i=0}^t C(k,i)  [(128,64): k=64] ===========")
kinfo = 64
for t in range(4):
    N_TEP = sum(comb(kinfo, i) for i in range(t + 1))
    print(f"order-{t}: N_TEP = sum_i=0..{t} C(64,i) = {N_TEP}")
print(f"C(64,2)={comb(64,2)} (dominant order-2 term); k=8000 order-2 C(8000,2)={comb(8000,2):.3g} -> OSD is a SHORT-code tool")
`,
    note: String.raw`Four self-checking experiments, each printing a measured number beside the theory it must match. PART 1 evaluates the finite-blocklength (Polyanskiy-Poor-Verdu) normal approximation R*(n,eps,SNR) = C - sqrt(V/n) Qinv(eps) + log2(n)/(2n) on the real-AWGN channel, using the capacity C = (1/2) log2(1+SNR) and the channel dispersion V = SNR(SNR+2)/(2(1+SNR)^2) (log2 e)^2. At SNR = 1 (0 dB) it prints C = 0.5 bits/use and V = 0.781 bits^2/use, then tabulates R* and the gap to capacity across blocklengths: at n = 128, eps = 1e-5 the back-off sqrt(V/n) Qinv(eps) is 0.333 bits so R* = 0.194 (about 61% below capacity), while at n = 1000 the gap has shrunk to about 23% and at n = 10000 to about 7% -- the slow 1/sqrt(n) approach to C. It closes by checking the halving rule: back-off(64)/back-off(128) = sqrt(2) = 1.41421 exactly, the statement that every halving of the blocklength inflates the rate penalty by sqrt(2). PART 2 constructs a quasi-cyclic LDPC parity-check by circulant lifting: it starts from a 3x6 protograph (a regular (3,6), rate-1/2 base graph), assigns array-LDPC-style shifts s_ij = (i*j) mod Z, and lifts each entry to a Z x Z circulant permutation matrix (identity cyclically shifted by s_ij) with Z = 7, giving n = Z*nb = 42, m = Z*mb = 21, k = 21, rate 1 - mb/nb = 0.5. It then MEASURES the girth by a breadth-first shortest-cycle search on the bipartite Tanner graph and prints it (this small array construction has no length-4 cycles, so the measured girth is 6). It also prints the stated scaling for a 4x8 base lifted by Z = 64 -> n = 512, k = 256, R = 1/2, the concrete short QC-LDPC code used throughout the topic. PART 3 draws a stylized short-code (n = 128, R = 1/2) curve that shows the two short-block effects side by side. It prints, at each Eb/N0, a WATERFALL term obtained by inverting the normal approximation, eps_wf = Q( sqrt(n/V) (C(Es/N0) - R + log2(n)/(2n)) ), which is deliberately shallow because sqrt(V/n) is large at short n, and separately a union-bound minimum-distance ERROR-FLOOR term A_dmin Q( sqrt(2 dmin R Eb/N0) ) from a stated (dmin = 10, multiplicity 30) -- e.g. the floor term is 8.1e-6 at 4 dB and 2.8e-7 at 5 dB, matching the topic's union-bound numerical. For this shallow-waterfall / high-dmin code the gentle finite-blocklength waterfall dominates the printed BLER across the whole 1-6 dB sweep, while the floor term sits below it; the floor term is what would flatten the curve for a code with a steeper (near-ML) waterfall or a smaller minimum distance. Together the two columns make concrete the two things that shape a single short packet's error curve: a gentle waterfall from the finite-blocklength back-off and a minimum-distance floor from the countable low-weight codewords. PART 4 counts the cost of near-maximum-likelihood ordered-statistics decoding (OSD): order-t reprocessing tries every test error pattern of weight <= t over the k most reliable positions, so the number of re-encodings is sum_{i=0}^t C(k,i). For a (128,64) code (k = 64) it prints 65 (order 1), 2081 (order 2) and 43745 (order 3), and contrasts C(64,2) = 2016 with C(8000,2) = 3.2e7 to make the point that OSD is affordable precisely because k is small -- a short-code tool. Every printed value ties to an equation, table or numerical in the topic, so running the file line-by-line verifies the finite-blocklength numbers, the lift geometry and girth, the waterfall+floor shape and the OSD complexity. Note: the belief-propagation / min-sum message-passing algebra that actually decodes these codes lives in the general "LDPC Codes" topic and its code; this file focuses on what is special to the short single packet.`
  }
});
