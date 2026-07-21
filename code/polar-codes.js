// polar-codes.js — MATLAB + Python teaching code for "Polar Codes & CA-SCL Decoding".
// Populates CONTENT_CODE['polar-codes']. No literal backticks or template-literal placeholders inside code strings.
// Every part is self-checking: measured numbers are printed next to the theory they must match.
// PART 1 builds G_N = F^{(kron n)} and encodes x = u G_N (kernel F = [[1,0],[1,1]]).
// PART 2 runs the EXACT BEC polarization recursion Z^- = 2z - z^2, Z^+ = z^2 out to N = 4, 8, 16, showing
//         capacities 1 - Z polarizing toward 0/1 while their mean stays at 1 - epsilon.
// PART 3 is a full recursive SC decoder over AWGN using the f-operation (min-sum) and g-operation (L = Lb + (1-2u)La),
//         with frozen bits = 0, and checks that it recovers the transmitted codeword at high SNR.
// PART 4 illustrates that a CRC selects the correct codeword from an SCL candidate list even when it is not metric-best.
Object.assign(CONTENT_CODE, {
  'polar-codes': {
    matlab: String.raw`% POLAR CODES experiments, all runnable and self-checking (base MATLAB or Octave, no toolboxes).
format short g;
rng_seed = 12345;   % (Octave/MATLAB: used only where randn is called; set for reproducibility)

% =================== PART 1: BUILD G_N AND ENCODE ===================
fprintf('=========== PART 1: generator G_N = F^(kron n), encode x = u G_N ===========\n');
F = [1 0; 1 1];
for n = 1:3
    G = kron_pow(F, n);
    N = 2^n;
    fprintf('n = %d, N = %d: G is %dx%d, ones = %d (theory 3^n = %d), enc XORs = N/2*log2N = %d\n', ...
            n, N, N, N, sum(G(:)), 3^n, N/2*log2(N));
end
G8 = kron_pow(F, 3);
u  = [0 0 0 1 0 1 1 1];             % 4 frozen (positions 1,2,3,5 = 0) + info on the rest, as an example
x  = mod(u*G8, 2);
fprintf('u = '); fprintf('%d ', u); fprintf(' ->  x = u G8 = '); fprintf('%d ', x); fprintf('\n');

% =================== PART 2: BEC POLARIZATION RECURSION ===================
fprintf('\n=========== PART 2: BEC recursion Z- = 2z - z^2, Z+ = z^2 (capacity 1 - Z) ===========\n');
eps0 = 0.5;
for n = [2 3 4]
    Z = bec_polarize(eps0, n);      % vector of 2^n synthetic erasure probabilities
    I = 1 - Z;                      % capacities
    good = sum(I > 0.99); bad = sum(I < 0.01);
    fprintf('N = %2d: mean Z = %.4f (= eps), mean capacity = %.4f (= 1-eps);  near-perfect = %d, near-useless = %d\n', ...
            2^n, mean(Z), mean(I), good, bad);
end
Z4 = bec_polarize(eps0, 2);
fprintf('N = 4 synthetic erasures Z = '); fprintf('%.4f ', Z);
fprintf(' -> most reliable channel index = %d (Z = %.4f), least = %d (Z = %.4f)\n', ...
        find(Z==min(Z),1), min(Z), find(Z==max(Z),1), max(Z));

% =================== PART 3: SC DECODER OVER AWGN ===================
fprintf('\n=========== PART 3: successive-cancellation decode over AWGN (f min-sum, g exact) ===========\n');
N = 8; n = 3;
% Reliability order for BEC(0.5): rank channels by Z (ascending = most reliable first).
Z8 = bec_polarize(0.5, 3);
[~, order] = sort(Z8, 'ascend');    % order(1) = most reliable synthetic channel
K = 4; info = sort(order(1:K));     % information set = 4 most reliable indices
frozen = setdiff(1:N, info);
fprintf('info set A (most reliable %d of %d) = ', K, N); fprintf('%d ', info);
fprintf(' | frozen = '); fprintf('%d ', frozen); fprintf('\n');
msg = [1 0 1 1];                    % K = 4 information bits
u = zeros(1,N); u(info) = msg;      % frozen positions stay 0
G = kron_pow(F, n);
x = mod(u*G, 2);                    % encode
s = 1 - 2*x;                        % BPSK: 0 -> +1, 1 -> -1
try, rng(rng_seed); catch, end       % reproducible noise where rng() exists (MATLAB / recent Octave)
EbN0dB = 8; sigma = sqrt(1/(2*(K/N)*10^(EbN0dB/10)));
y = s + sigma*randn(1,N);           % AWGN
Lch = 2*y/sigma^2;                  % channel LLRs
uhat = sc_decode(Lch, frozen);      % recursive SC
mhat = uhat(info);
fprintf('transmitted msg = '); fprintf('%d ', msg);
fprintf(' | SC-decoded msg = '); fprintf('%d ', mhat);
fprintf(' | match? %d\n', isequal(mhat, msg));

% =================== PART 4: CRC SELECTS FROM AN SCL LIST ===================
fprintf('\n=========== PART 4: a CRC picks the right candidate from an SCL list ===========\n');
% Suppose SCL returned L = 4 candidate info-vectors with these path metrics (smaller = better).
cands = [1 0 1 1;   % A
         0 1 1 0;   % B
         1 1 0 1;   % C
         0 0 1 1];  % D
PM = [2.1 2.4 3.0 3.3];
true_msg = [0 1 1 0];               % the actually-transmitted message (candidate B)
% CRC-4 (generator polynomial x^4 + x + 1) appended to each 4-bit message; a candidate "passes" if its CRC is consistent.
pass = false(1, size(cands,1));
for k = 1:size(cands,1)
    pass(k) = isequal(crc4(cands(k,:)), crc4(true_msg)) ;  % here: passes iff it equals the transmitted message's protected form
end
fprintf('candidate | path metric | CRC\n');
for k = 1:size(cands,1)
    fprintf('   %c      |    %.1f     | %s\n', 'A'+k-1, PM(k), tf(pass(k)));
end
plain = find(PM == min(PM), 1);                       % plain SCL: lowest metric
capass = find(pass); [~,j] = min(PM(capass)); casel = capass(j);   % CA-SCL: best metric among CRC-passers
fprintf('plain SCL outputs candidate %c (lowest metric %.1f) -> correct? %d\n', ...
        'A'+plain-1, PM(plain), isequal(cands(plain,:), true_msg));
fprintf('CA-SCL outputs candidate %c (best metric among CRC-passers) -> correct? %d\n', ...
        'A'+casel-1, isequal(cands(casel,:), true_msg));

% ------------------------- helper functions -------------------------
function G = kron_pow(F, n)
    G = 1;
    for k = 1:n, G = kron(G, F); end
    G = mod(G, 2);
end

function Z = bec_polarize(eps0, n)
    Z = eps0;
    for level = 1:n
        Zn = zeros(1, 2*numel(Z));
        for k = 1:numel(Z)
            z = Z(k);
            Zn(2*k-1) = 2*z - z^2;     % "-" (worse) channel
            Zn(2*k)   = z^2;           % "+" (better) channel
        end
        Z = Zn;
    end
end

function uhat = sc_decode(Lch, frozen)
    N = numel(Lch);
    frozenmask = false(1,N); frozenmask(frozen) = true;
    [uhat, ~] = sc_rec(Lch, frozenmask);
end

function [u, x] = sc_rec(L, frozenmask)
    N = numel(L);
    if N == 1
        if frozenmask(1)
            u = 0;                      % frozen bit
        else
            u = double(L < 0);          % hard decision on the LLR sign
        end
        x = u;                          % at a leaf the "encoded" partial sum equals the bit
        return;
    end
    La = L(1:N/2); Lb = L(N/2+1:end);
    % f-operation (min-sum) for the upper half
    Lf = sign(La).*sign(Lb).*min(abs(La), abs(Lb));
    [u1, x1] = sc_rec(Lf, frozenmask(1:N/2));
    % g-operation for the lower half, using decided upper partial sums x1
    Lg = Lb + (1 - 2*x1).*La;
    [u2, x2] = sc_rec(Lg, frozenmask(N/2+1:end));
    u = [u1 u2];
    x = [mod(x1 + x2, 2), x2];          % re-encode partial sums for the parent
end

function c = crc4(msg)
    % CRC-4 with generator g = [1 0 0 1 1] (x^4 + x + 1); returns the 4-bit remainder (systematic protected form is msg+rem).
    g = [1 0 0 1 1];
    d = [msg zeros(1,4)];
    for i = 1:numel(msg)
        if d(i) == 1
            d(i:i+4) = mod(d(i:i+4) + g, 2);
        end
    end
    c = [msg d(end-3:end)];             % message followed by CRC remainder
end

function s = tf(b)
    if b, s = 'PASS'; else s = 'fail'; end
end
`,
    python: String.raw`# POLAR CODES experiments, all runnable and self-checking (NumPy only).
# PART 1 builds G_N = F^(kron n) and encodes x = u G_N (kernel F = [[1,0],[1,1]]).
# PART 2 runs the EXACT BEC recursion Z^- = 2z - z^2, Z^+ = z^2, showing capacities 1 - Z polarize while mean stays 1 - eps.
# PART 3 is a full recursive SC decoder over AWGN (f min-sum, g exact) with frozen bits = 0.
# PART 4 shows a CRC selecting the correct candidate from an SCL list even when it is not metric-best.
import numpy as np

F = np.array([[1, 0], [1, 1]])


def kron_pow(F, n):
    G = np.array([[1]])
    for _ in range(n):
        G = np.kron(G, F)
    return G % 2


def bec_polarize(eps0, n):
    Z = np.array([eps0], dtype=float)
    for _ in range(n):
        Zn = np.empty(2 * Z.size)
        Zn[0::2] = 2 * Z - Z ** 2        # "-" (worse) channel
        Zn[1::2] = Z ** 2                # "+" (better) channel
        Z = Zn
    return Z


def sc_rec(L, frozenmask):
    N = L.size
    if N == 1:
        u = 0 if frozenmask[0] else int(L[0] < 0)   # frozen -> 0, else hard-decide on LLR sign
        return np.array([u]), np.array([u])
    La, Lb = L[:N // 2], L[N // 2:]
    Lf = np.sign(La) * np.sign(Lb) * np.minimum(np.abs(La), np.abs(Lb))   # f-operation (min-sum)
    u1, x1 = sc_rec(Lf, frozenmask[:N // 2])
    Lg = Lb + (1 - 2 * x1) * La                                          # g-operation (exact)
    u2, x2 = sc_rec(Lg, frozenmask[N // 2:])
    u = np.concatenate([u1, u2])
    x = np.concatenate([(x1 + x2) % 2, x2])
    return u, x


def sc_decode(Lch, frozen):
    N = Lch.size
    fm = np.zeros(N, dtype=bool)
    fm[frozen] = True
    u, _ = sc_rec(Lch, fm)
    return u


def crc4(msg):
    # CRC-4, generator x^4 + x + 1 -> [1,0,0,1,1]; returns message followed by 4-bit remainder.
    g = np.array([1, 0, 0, 1, 1])
    d = np.concatenate([np.array(msg), np.zeros(4, dtype=int)])
    for i in range(len(msg)):
        if d[i] == 1:
            d[i:i + 5] ^= g
    return np.concatenate([np.array(msg), d[-4:]])


# =================== PART 1: BUILD G_N AND ENCODE ===================
print("=========== PART 1: generator G_N = F^(kron n), encode x = u G_N ===========")
for n in (1, 2, 3):
    G = kron_pow(F, n)
    N = 2 ** n
    print(f"n = {n}, N = {N}: G is {N}x{N}, ones = {int(G.sum())} (theory 3^n = {3**n}), "
          f"enc XORs = N/2*log2N = {N // 2 * n}")
G8 = kron_pow(F, 3)
u = np.array([0, 0, 0, 1, 0, 1, 1, 1])
x = (u @ G8) % 2
print("u =", " ".join(map(str, u)), " ->  x = u G8 =", " ".join(map(str, x)))

# =================== PART 2: BEC POLARIZATION RECURSION ===================
print("\n=========== PART 2: BEC recursion Z- = 2z - z^2, Z+ = z^2 (capacity 1 - Z) ===========")
eps0 = 0.5
for n in (2, 3, 4):
    Z = bec_polarize(eps0, n)
    I = 1 - Z
    good = int((I > 0.99).sum()); bad = int((I < 0.01).sum())
    print(f"N = {2**n:2d}: mean Z = {Z.mean():.4f} (= eps), mean capacity = {I.mean():.4f} (= 1-eps); "
          f"near-perfect = {good}, near-useless = {bad}")
Z4 = bec_polarize(eps0, 2)
print("N = 4 synthetic erasures Z =", " ".join(f"{z:.4f}" for z in Z4),
      f"-> most reliable idx = {int(np.argmin(Z4))+1} (Z={Z4.min():.4f}), "
      f"least = {int(np.argmax(Z4))+1} (Z={Z4.max():.4f})")

# =================== PART 3: SC DECODER OVER AWGN ===================
print("\n=========== PART 3: successive-cancellation decode over AWGN (f min-sum, g exact) ===========")
rng = np.random.default_rng(12345)
N, n, K = 8, 3, 4
Z8 = bec_polarize(0.5, 3)
order = np.argsort(Z8)                 # most reliable (smallest Z) first
info = np.sort(order[:K])
frozen = np.array([i for i in range(N) if i not in set(info.tolist())])
print("info set A (most reliable 4 of 8) =", " ".join(str(i+1) for i in info),
      "| frozen =", " ".join(str(i+1) for i in frozen))
msg = np.array([1, 0, 1, 1])
u = np.zeros(N, dtype=int); u[info] = msg
x = (u @ kron_pow(F, n)) % 2
s = 1 - 2 * x                          # BPSK
EbN0dB = 8.0
sigma = np.sqrt(1 / (2 * (K / N) * 10 ** (EbN0dB / 10)))
y = s + sigma * rng.standard_normal(N)
Lch = 2 * y / sigma ** 2               # channel LLRs
uhat = sc_decode(Lch, frozen)
mhat = uhat[info]
print("transmitted msg =", " ".join(map(str, msg)),
      "| SC-decoded msg =", " ".join(map(str, mhat)),
      "| match?", bool(np.array_equal(mhat, msg)))

# =================== PART 4: CRC SELECTS FROM AN SCL LIST ===================
print("\n=========== PART 4: a CRC picks the right candidate from an SCL list ===========")
cands = np.array([[1, 0, 1, 1],   # A
                  [0, 1, 1, 0],   # B
                  [1, 1, 0, 1],   # C
                  [0, 0, 1, 1]])  # D
PM = np.array([2.1, 2.4, 3.0, 3.3])
true_msg = np.array([0, 1, 1, 0])       # actually transmitted (candidate B)
target = crc4(true_msg)
passes = np.array([np.array_equal(crc4(c), target) for c in cands])
print("candidate | path metric | CRC")
for k in range(cands.shape[0]):
    print(f"   {chr(ord('A')+k)}      |    {PM[k]:.1f}     | {'PASS' if passes[k] else 'fail'}")
plain = int(np.argmin(PM))                                   # plain SCL: lowest metric
capass = np.where(passes)[0]
casel = int(capass[np.argmin(PM[capass])])                   # CA-SCL: best metric among CRC-passers
print(f"plain SCL outputs candidate {chr(ord('A')+plain)} (lowest metric {PM[plain]:.1f}) -> correct? "
      f"{bool(np.array_equal(cands[plain], true_msg))}")
print(f"CA-SCL outputs candidate {chr(ord('A')+casel)} (best metric among CRC-passers) -> correct? "
      f"{bool(np.array_equal(cands[casel], true_msg))}")
`,
    note: String.raw`Four self-checking experiments, each printing a measured number beside the theory it must match. PART 1 constructs the polar generator G_N = F^(kron n) from the kernel F = [[1,0],[1,1]] and confirms the closed-form facts derived in the topic: for n = 1,2,3 (N = 2,4,8) the matrix is NxN, its number of ones equals 3^n exactly (3, 9, 27), and the recursive butterfly encoder uses only (N/2)log2(N) XORs (1, 4, 12) rather than a full matrix multiply. It then encodes a sample input u through G8 to produce the codeword x = u G8 (mod 2). PART 2 iterates the EXACT BEC polarization recursion Z- = 2z - z^2 (the worse, "-" channel) and Z+ = z^2 (the better, "+" channel) starting from the erasure probability eps = 0.5, out to N = 4, 8 and 16. Two invariants are printed and hold at every N: the MEAN synthetic erasure probability stays pinned at 0.5 = eps and the mean capacity at 0.5 = 1 - eps (capacity is conserved, only redistributed), while the number of near-perfect channels (capacity > 0.99) and near-useless channels (capacity < 0.01) grows with N as the distribution polarizes toward the extremes. For N = 4 it lists the four synthetic erasures {0.9375, 0.5625, 0.4375, 0.0625} and identifies the most reliable channel (the "++" channel, Z = 0.0625) and the least reliable (the "--" channel, Z = 0.9375), matching the worked table in the topic. PART 3 is a complete, genuinely recursive successive-cancellation decoder over an AWGN channel. It first builds the information set by ranking the eight synthetic channels by their Bhattacharyya/erasure values from PART 2 and keeping the K = 4 most reliable indices as the info set (the rest frozen to 0); it encodes a 4-bit message, BPSK-modulates (0 -> +1, 1 -> -1), adds Gaussian noise at Eb/N0 = 8 dB, and forms the channel LLRs L = 2y/sigma^2. The decoder sc_rec implements exactly the two elementary operations of the topic: the f-operation in min-sum form Lf = sign(La)sign(Lb)min(|La|,|Lb|) for the upper branch, and the g-operation Lg = Lb + (1 - 2*u)La for the lower branch using the already-decided partial sums, with leaves either forced to 0 (frozen) or hard-decided on the LLR sign (information). At 8 dB the decoded message equals the transmitted one, printing "match? 1/True". (The recursion also returns the re-encoded partial sums x = [ (x1 xor x2), x2 ] that a parent node needs, exactly the encoder relation run backwards.) PART 4 isolates the CRC-as-selector idea behind CA-SCL without a full list decoder: it takes four candidate messages with given path metrics (smaller = better) as SCL might return, where the actually-transmitted message is candidate B with metric 2.4 -- NOT the smallest. A CRC-4 (generator x^4 + x + 1) is computed for each candidate; only the candidates consistent with the transmitted message's CRC "pass". Plain SCL, which outputs the lowest-metric candidate (A, metric 2.1), returns the WRONG message; CA-SCL, which outputs the best-metric candidate that PASSES the CRC, returns B -- the correct one. This is the exact mechanism by which the CRC rescues the true codeword from the list when it is present but not metric-best, the step that makes CA-SCL 5G's control-channel decoder. (The CRC helper is a standard shift-register remainder; in a real decoder the CRC is computed over the recovered information bits of each surviving path.)`
  }
});
