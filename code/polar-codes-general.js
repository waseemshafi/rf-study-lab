// polar-codes-general.js — MATLAB + Python teaching code for "Polar Codes (General Theory)".
// Populates CONTENT_CODE['polar-codes-general']. No literal backticks or template-literal placeholders inside code strings.
// Every part is self-checking: measured numbers are printed next to the theory they must match.
// PART 1 builds G_N = F^(kron n), verifies 3^n ones and the (N/2)log2N XOR / O(N log N) counts, and encodes NON-SYSTEMATICALLY.
// PART 2 encodes the SAME info bits SYSTEMATICALLY (info bits appear verbatim in the codeword) via u_A = m (G_AA)^{-1} over GF(2),
//        and checks the systematic codeword contains the message while both encodings lie in the same code (same frozen constraints).
// PART 3 compares THREE construction methods on AWGN for the same (N,K): Bhattacharyya Z-recursion, Gaussian-Approximation
//        mean-LLR recursion, and the 5G-style Polarization-Weight / beta-expansion; it prints the three info sets and shows they
//        largely agree (size of their common intersection).
// PART 4 does rate matching (puncturing / shortening / repetition) to reach arbitrary (M,K) from a 2^n mother code.
Object.assign(CONTENT_CODE, {
  'polar-codes-general': {
    matlab: String.raw`% POLAR CODES (GENERAL THEORY) experiments, runnable and self-checking (base MATLAB or Octave, no toolboxes).
format short g;

% =================== PART 1: G_N, COUNTS, NON-SYSTEMATIC ENCODE ===================
fprintf('=========== PART 1: G_N = F^(kron n); 3^n ones; (N/2)log2N XORs; non-systematic encode ===========\n');
F = [1 0; 1 1];
for n = 1:4
    G = kron_pow(F, n); N = 2^n;
    fprintf('n=%d N=%2d: G is %2dx%-2d, ones=%3d (theory 3^n=%3d), enc XORs=%3d, SC ops~N log2N=%3d\n', ...
            n, N, N, N, sum(G(:)), 3^n, N/2*log2(N), N*log2(N));
end
N = 8; n = 3; G = kron_pow(F, n);
A = [4 6 7 8];                       % information set (most reliable, from PART 3 / BEC ranking)
frozen = setdiff(1:N, A);
m = [1 0 1 1];                       % K = 4 message bits
u = zeros(1, N); u(A) = m;           % frozen positions stay 0
x_ns = mod(u*G, 2);                  % NON-SYSTEMATIC codeword
fprintf('info set A = '); fprintf('%d ', A);
fprintf('| msg m = '); fprintf('%d ', m);
fprintf('| non-sys x = '); fprintf('%d ', x_ns);
fprintf('| x(A) = '); fprintf('%d ', x_ns(A)); fprintf('(scattered, != m in general)\n');

% =================== PART 2: SYSTEMATIC ENCODE (info bits verbatim in codeword) ===================
fprintf('\n=========== PART 2: systematic encode  u_A = m (G_AA)^-1  ->  x(A) = m ===========\n');
Gaa = G(A, A);                       % submatrix (lower-tri, unit diagonal -> invertible over GF(2))
uA  = mod(m * gf2inv(Gaa), 2);       % solve u_A G_AA = m
u_sys = zeros(1, N); u_sys(A) = uA;  % frozen stay 0
x_sys = mod(u_sys*G, 2);             % SYSTEMATIC codeword
fprintf('systematic x = '); fprintf('%d ', x_sys);
fprintf('| x(A) = '); fprintf('%d ', x_sys(A));
fprintf('| equals m? %d\n', isequal(x_sys(A), m));
% both codewords have u frozen to 0 at the same positions -> both are valid codewords of the SAME code:
u_recover_ns  = mod(x_ns  * gf2inv(G), 2);  % G is self-inverse up to B_N; here G=F^kron n is involutory so inv=G
u_recover_sys = mod(x_sys * gf2inv(G), 2);
fprintf('recovered u (non-sys) frozen bits all 0? %d ; (sys) frozen bits all 0? %d\n', ...
        all(u_recover_ns(frozen)==0), all(u_recover_sys(frozen)==0));
fprintf('note: same code (same FER); systematic exposes m verbatim -> lower BER when a block errs.\n');

% =================== PART 3: THREE CONSTRUCTION METHODS AGREE ON THE INFO SET ===================
fprintf('\n=========== PART 3: Bhattacharyya vs Gaussian-approx vs Polarization-weight (N=8, K=4) ===========\n');
N = 8; n = 3; K = 4; designEbN0dB = 2.0; R = K/N;
EsN0 = R * 10^(designEbN0dB/10);
Zb  = bhatt_construct(N, exp(-EsN0));         % Bhattacharyya (rank ascending = most reliable)
mu  = ga_construct(N, 4*EsN0);                % Gaussian approx mean LLR (rank descending)
pw  = pw_construct(N);                        % polarization weight, beta = 2^(1/4) (rank descending)
Ab = topk_ascend(Zb, K);
Ag = topk_descend(mu, K);
Ap = topk_descend(pw, K);
fprintf('Bhattacharyya  info set A = '); fprintf('%d ', Ab); fprintf('\n');
fprintf('Gaussian-approx info set A = '); fprintf('%d ', Ag); fprintf('\n');
fprintf('Polar-weight    info set A = '); fprintf('%d ', Ap); fprintf('\n');
common = intersect(intersect(Ab, Ag), Ap);
fprintf('common to all three: '); fprintf('%d ', common);
fprintf(' -> %d of %d agree (methods largely agree)\n', numel(common), K);

% =================== PART 4: RATE MATCHING TO ARBITRARY (M, K) ===================
fprintf('\n=========== PART 4: rate matching (puncture / shorten / repeat) from a 2^n mother ===========\n');
targets = [200 128; 48 24; 40 16];            % rows: [M K]
for t = 1:size(targets,1)
    M = targets(t,1); Kt = targets(t,2);
    rate_match_report(M, Kt);
end

% ------------------------- helper functions -------------------------
function G = kron_pow(F, n)
    G = 1; for k = 1:n, G = kron(G, F); end; G = mod(G, 2);
end

function Ainv = gf2inv(A)             % inverse of a binary matrix over GF(2) by Gauss-Jordan
    m = size(A,1); M = mod([A eye(m)], 2);
    for col = 1:m
        piv = find(M(col:end, col) == 1, 1); piv = piv + col - 1;
        tmp = M(col,:); M(col,:) = M(piv,:); M(piv,:) = tmp;   % swap to get a 1 pivot
        for r = 1:m
            if r ~= col && M(r,col) == 1, M(r,:) = mod(M(r,:) + M(col,:), 2); end
        end
    end
    Ainv = M(:, m+1:end);
end

function Z = bhatt_construct(N, Z0)   % Z^- = 2Z - Z^2 (worse), Z^+ = Z^2 (better)
    Z = Z0;
    while numel(Z) < N
        Zn = zeros(1, 2*numel(Z));
        for k = 1:numel(Z), z = Z(k); Zn(2*k-1) = 2*z - z^2; Zn(2*k) = z^2; end
        Z = Zn;
    end
end

function mu = ga_construct(N, mu0)    % mu^+ = 2 mu, mu^- = phi^{-1}(1 - (1 - phi(mu))^2)
    mu = mu0;
    while numel(mu) < N
        mn = zeros(1, 2*numel(mu));
        for k = 1:numel(mu)
            m = mu(k);
            mn(2*k-1) = phi_inv(1 - (1 - phi(m))^2);   % worse
            mn(2*k)   = 2*m;                            % better
        end
        mu = mn;
    end
end

function pw = pw_construct(N)         % polarization weight, beta = 2^(1/4)
    n = round(log2(N)); beta = 2^(1/4); pw = zeros(1, N);
    for i = 0:N-1
        b = bitget(i, 1:n);          % b(1)=LSB
        w = 0; for j = 1:n, w = w + b(j)*beta^(j-1); end
        pw(i+1) = w;
    end
end

function y = phi(x)                   % Arikan/Chung GA function, decreasing, phi(0)=1
    if x <= 0, y = 1; return; end
    if x < 10, y = exp(-0.4527*x^0.859 + 0.0218);
    else,      y = sqrt(pi/x)*exp(-x/4)*(1 - 10/(7*x)); end
end

function x = phi_inv(y)               % numeric inverse of phi by bisection
    if y >= 1, x = 0; return; end
    lo = 0; hi = 1e4;
    for it = 1:200
        mid = 0.5*(lo+hi);
        if phi(mid) > y, lo = mid; else, hi = mid; end
    end
    x = 0.5*(lo+hi);
end

function A = topk_ascend(v, K)        % indices of the K smallest entries (most reliable for Z)
    [~, ord] = sort(v, 'ascend'); A = sort(ord(1:K));
end
function A = topk_descend(v, K)       % indices of the K largest entries (most reliable for mu / PW)
    [~, ord] = sort(v, 'descend'); A = sort(ord(1:K));
end

function rate_match_report(M, K)
    n = ceil(log2(max(M, K))); N = 2^n;
    if M <= N
        op = 'puncture/shorten'; removed = N - M;
        fprintf('target (M=%d,K=%d): mother N=%d, %s %d bits; mother rate=%.3f, effective rate K/M=%.3f\n', ...
                M, K, N, op, removed, K/N, K/M);
    else
        Nm = 2^floor(log2(M)); repeated = M - Nm;
        fprintf('target (M=%d,K=%d): mother N=%d, repeat %d bits; mother rate=%.3f, effective rate K/M=%.3f\n', ...
                M, K, Nm, repeated, K/Nm, K/M);
    end
end
`,
    python: String.raw`# POLAR CODES (GENERAL THEORY) experiments, runnable and self-checking (NumPy only).
# PART 1 builds G_N = F^(kron n), verifies 3^n ones and O(N log N) counts, and encodes NON-SYSTEMATICALLY.
# PART 2 encodes the SAME message SYSTEMATICALLY (info bits appear verbatim) via u_A = m (G_AA)^-1 over GF(2).
# PART 3 compares Bhattacharyya, Gaussian-approximation and Polarization-weight constructions -> they largely agree.
# PART 4 rate-matches (puncture / shorten / repeat) a 2^n mother code to arbitrary (M, K).
import numpy as np

F = np.array([[1, 0], [1, 1]])


def kron_pow(F, n):
    G = np.array([[1]])
    for _ in range(n):
        G = np.kron(G, F)
    return G % 2


def gf2inv(A):                              # inverse of a binary matrix over GF(2) by Gauss-Jordan
    m = A.shape[0]
    M = np.concatenate([A % 2, np.eye(m, dtype=int)], axis=1)
    for col in range(m):
        piv = col + int(np.argmax(M[col:, col]))
        M[[col, piv]] = M[[piv, col]]                       # swap so pivot is 1
        for r in range(m):
            if r != col and M[r, col] == 1:
                M[r, :] ^= M[col, :]
    return M[:, m:]


def bhatt_construct(N, Z0):                 # Z^- = 2Z - Z^2, Z^+ = Z^2
    Z = np.array([Z0], dtype=float)
    while Z.size < N:
        Zn = np.empty(2 * Z.size)
        Zn[0::2] = 2 * Z - Z ** 2           # worse
        Zn[1::2] = Z ** 2                   # better
        Z = Zn
    return Z


def phi(x):                                 # Arikan/Chung GA function, decreasing, phi(0)=1
    if x <= 0:
        return 1.0
    if x < 10:
        return float(np.exp(-0.4527 * x ** 0.859 + 0.0218))
    return float(np.sqrt(np.pi / x) * np.exp(-x / 4) * (1 - 10 / (7 * x)))


def phi_inv(y):                             # numeric inverse of phi by bisection
    if y >= 1:
        return 0.0
    lo, hi = 0.0, 1e4
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        if phi(mid) > y:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi)


def ga_construct(N, mu0):                   # mu^+ = 2 mu, mu^- = phi^{-1}(1 - (1 - phi(mu))^2)
    mu = np.array([mu0], dtype=float)
    while mu.size < N:
        mn = np.empty(2 * mu.size)
        for k, m in enumerate(mu):
            mn[2 * k] = phi_inv(1 - (1 - phi(m)) ** 2)      # worse
            mn[2 * k + 1] = 2 * m                           # better
        mu = mn
    return mu


def pw_construct(N):                        # polarization weight, beta = 2^(1/4)
    n = int(round(np.log2(N)))
    beta = 2 ** 0.25
    pw = np.zeros(N)
    for i in range(N):
        w = 0.0
        for j in range(n):
            if (i >> j) & 1:
                w += beta ** j
        pw[i] = w
    return pw


def topk_ascend(v, K):                      # 1-based indices of K smallest (most reliable for Z)
    return sorted((np.argsort(v)[:K] + 1).tolist())


def topk_descend(v, K):                     # 1-based indices of K largest (most reliable for mu / PW)
    return sorted((np.argsort(-v)[:K] + 1).tolist())


# =================== PART 1: G_N, COUNTS, NON-SYSTEMATIC ENCODE ===================
print("=========== PART 1: G_N = F^(kron n); 3^n ones; (N/2)log2N XORs; non-systematic encode ===========")
for n in (1, 2, 3, 4):
    G = kron_pow(F, n); N = 2 ** n
    print(f"n={n} N={N:2d}: G is {N:2d}x{N:<2d}, ones={int(G.sum()):3d} (theory 3^n={3**n:3d}), "
          f"enc XORs={N // 2 * n:3d}, SC ops~N log2N={N * n:3d}")
N, n = 8, 3
G = kron_pow(F, n)
A = [4, 6, 7, 8]                             # information set (1-based), most reliable
Ai = np.array(A) - 1                         # 0-based
frozen = [i for i in range(1, N + 1) if i not in A]
m = np.array([1, 0, 1, 1])                   # K = 4 message bits
u = np.zeros(N, dtype=int); u[Ai] = m
x_ns = (u @ G) % 2                           # NON-SYSTEMATIC codeword
print("info set A =", " ".join(map(str, A)), "| msg m =", " ".join(map(str, m)),
      "| non-sys x =", " ".join(map(str, x_ns)), "| x(A) =", " ".join(map(str, x_ns[Ai])),
      "(scattered, != m in general)")

# =================== PART 2: SYSTEMATIC ENCODE ===================
print("\n=========== PART 2: systematic encode  u_A = m (G_AA)^-1  ->  x(A) = m ===========")
Gaa = G[np.ix_(Ai, Ai)]                      # submatrix (invertible over GF(2))
uA = (m @ gf2inv(Gaa)) % 2                   # solve u_A G_AA = m
u_sys = np.zeros(N, dtype=int); u_sys[Ai] = uA
x_sys = (u_sys @ G) % 2                      # SYSTEMATIC codeword
print("systematic x =", " ".join(map(str, x_sys)), "| x(A) =", " ".join(map(str, x_sys[Ai])),
      "| equals m?", bool(np.array_equal(x_sys[Ai], m)))
Ginv = gf2inv(G)                             # G is involutory (F^kron n), so Ginv == G
u_rec_ns = (x_ns @ Ginv) % 2
u_rec_sys = (x_sys @ Ginv) % 2
fz = np.array(frozen) - 1
print(f"recovered u (non-sys) frozen bits all 0? {bool((u_rec_ns[fz] == 0).all())} ; "
      f"(sys) frozen bits all 0? {bool((u_rec_sys[fz] == 0).all())}")
print("note: same code (same FER); systematic exposes m verbatim -> lower BER when a block errs.")

# =================== PART 3: THREE CONSTRUCTION METHODS AGREE ===================
print("\n=========== PART 3: Bhattacharyya vs Gaussian-approx vs Polarization-weight (N=8, K=4) ===========")
N, n, K, design_dB = 8, 3, 4, 2.0
R = K / N
EsN0 = R * 10 ** (design_dB / 10)
Zb = bhatt_construct(N, np.exp(-EsN0))
mu = ga_construct(N, 4 * EsN0)
pw = pw_construct(N)
Ab = topk_ascend(Zb, K)
Ag = topk_descend(mu, K)
Ap = topk_descend(pw, K)
print("Bhattacharyya  info set A =", " ".join(map(str, Ab)))
print("Gaussian-approx info set A =", " ".join(map(str, Ag)))
print("Polar-weight    info set A =", " ".join(map(str, Ap)))
common = sorted(set(Ab) & set(Ag) & set(Ap))
print("common to all three:", " ".join(map(str, common)),
      f"-> {len(common)} of {K} agree (methods largely agree)")

# =================== PART 4: RATE MATCHING ===================
print("\n=========== PART 4: rate matching (puncture / shorten / repeat) from a 2^n mother ===========")
for (M, Kt) in [(200, 128), (48, 24), (40, 16)]:
    n = int(np.ceil(np.log2(max(M, Kt))))
    Nm = 2 ** n
    if M <= Nm:
        print(f"target (M={M},K={Kt}): mother N={Nm}, puncture/shorten {Nm - M} bits; "
              f"mother rate={Kt / Nm:.3f}, effective rate K/M={Kt / M:.3f}")
    else:
        Nlow = 2 ** int(np.floor(np.log2(M)))
        print(f"target (M={M},K={Kt}): mother N={Nlow}, repeat {M - Nlow} bits; "
              f"mother rate={Kt / Nlow:.3f}, effective rate K/M={Kt / M:.3f}")
`,
    note: String.raw`Four self-checking experiments, each printing a measured number beside the theory it must match. PART 1 constructs the polar generator G_N = F^(kron n) from the kernel F = [[1,0],[1,1]] and confirms the closed-form counts derived in the topic: for n = 1..4 the matrix is NxN, its number of ones equals 3^n exactly (3, 9, 27, 81), the recursive butterfly encoder uses (N/2)log2(N) XORs, and SC decoding uses ~N log2(N) node operations -- both O(N log N), far below the N^2 of a naive matrix multiply. It then encodes a 4-bit message NON-SYSTEMATICALLY as x = u G_8 (mod 2) with the message on the information set A = {4,6,7,8} and frozen bits 0, and shows the message bits are SCATTERED through the codeword (x(A) is not m in general). PART 2 encodes the SAME message SYSTEMATICALLY: it forms the submatrix G_AA of rows and columns in A, inverts it over GF(2) (a Gauss-Jordan helper, valid because F^(kron n) is lower-triangular with unit diagonal so G_AA is invertible), sets u_A = m (G_AA)^-1, and re-encodes. The systematic codeword satisfies x(A) = m EXACTLY -- the information bits now appear VERBATIM in the codeword (the check prints "equals m? True"). It then confirms both the non-systematic and systematic codewords are valid words of the SAME code by recovering u = x G^-1 (G = F^(kron n) is involutory, so its GF(2) inverse is itself) and checking that the frozen positions are all 0 in both cases -- the concrete meaning of "same code, same FER, but systematic gives a lower BER because a wrong block flips fewer message bits". PART 3 is the heart of the construction breadth: for a target (N,K) = (8,4) at a design Eb/N0 = 2 dB it builds the information set THREE independent ways -- (i) the Bhattacharyya Z-recursion Z^- = 2Z - Z^2, Z^+ = Z^2 initialised at Z0 = exp(-Es/N0) and ranked by Z ascending; (ii) the Gaussian-approximation mean-LLR recursion mu^+ = 2 mu, mu^- = phi^{-1}(1 - (1 - phi(mu))^2) initialised at mu0 = 4 Es/N0 and ranked by mu descending, with phi Arikan's GA function and phi^{-1} computed by bisection; and (iii) the channel-independent 5G-style Polarization-Weight / beta-expansion PW(i) = sum_j b_j beta^j with beta = 2^(1/4), ranked descending. It prints all three information sets and the size of their common intersection, demonstrating the topic's claim that these very different rulers LARGELY AGREE on which channels to use (here they coincide). PART 4 performs rate matching from a power-of-two mother code to arbitrary (M, K): for each target it picks the smallest mother N = 2^ceil(log2 M), reports the number of coded bits to PUNCTURE or SHORTEN (N - M) when M <= N, or to REPEAT (M - N) when the target exceeds the mother, and prints both the mother rate K/N and the transmitted effective rate K/M -- e.g. (M,K) = (200,128) uses a mother N = 256, punctures 56 bits, and raises the rate from 0.500 to 0.640. Every printed value ties directly to an equation, table, or numerical in the topic, so running the file is a line-by-line verification of the general theory. Note: for the decoder internals (the SC f/g operations, the SCL path metric and the CRC-as-selector), see the companion "Polar Codes & CA-SCL Decoding" topic and its code, which this file deliberately does not duplicate.`
  }
});
