// tanner-graph.js — MATLAB + Python teaching code for the "Tanner Graph" topic.
// Populates CONTENT_CODE['tanner-graph']. No literal backticks or template-literal placeholders inside code strings.
// Every part is self-checking: measured numbers are printed next to the theory they must match.
// PART 1 builds the bipartite graph from H (node counts, degree distributions, edges by two counts, rate).
// PART 2 runs the (7,4) Hamming syndrome and reads a single-bit error position off it.
// PART 3 detects length-4 cycles (two columns of H sharing two rows).
// PART 4 is a Gallager hard-decision bit-flipping decoder on a girth-6, (3,3)-regular code (the Fano / PG(2,2)
//         incidence matrix), which corrects a single error cleanly — something the girth-4 Hamming graph cannot.
Object.assign(CONTENT_CODE, {
  'tanner-graph': {
    matlab: String.raw`% TANNER GRAPH experiments, all runnable and self-checking (base MATLAB or Octave, no toolboxes).
format short g;

% ---- three example parity-check matrices ----
H63  = [1 1 0 1 0 0; 0 1 1 0 1 0; 1 0 1 0 0 1];              % small (6,3) code, girth 6
H74  = [0 0 0 1 1 1 1; 0 1 1 0 0 1 1; 1 0 1 0 1 0 1];        % (7,4) Hamming, columns = binary 1..7
% Fano plane / PG(2,2) incidence matrix: rows = 7 lines, cols = 7 points, (3,3)-regular, girth 6.
Hf   = [1 1 1 0 0 0 0;    % L1 = points 1,2,3
        1 0 0 1 1 0 0;    % L2 = points 1,4,5
        1 0 0 0 0 1 1;    % L3 = points 1,6,7
        0 1 0 1 0 1 0;    % L4 = points 2,4,6
        0 1 0 0 1 0 1;    % L5 = points 2,5,7
        0 0 1 1 0 0 1;    % L6 = points 3,4,7
        0 0 1 0 1 1 0];   % L7 = points 3,5,6

% =================== PART 1: BUILD THE GRAPH FROM H ===================
fprintf('=========== PART 1: the Tanner graph is the incidence structure of H ===========\n');
report_graph('(6,3) code', H63);
report_graph('(7,4) Hamming', H74);
report_graph('Fano / PG(2,2)', Hf);

% =================== PART 2: SYNDROME AND SINGLE-ERROR LOCATION (Hamming) ===================
fprintf('\n=========== PART 2: syndrome s = H r^T (mod 2) locates a single error ===========\n');
c   = [1 1 0 1 0 0 1];                          % a valid Hamming codeword
fprintf('transmitted codeword c = '); fprintf('%d ', c);
fprintf(' -> H c^T mod 2 = '); fprintf('%d ', mod(H74*c',2)); fprintf('(all zero => codeword)\n');
r   = c; r(6) = 1 - r(6);                        % flip bit 6
s   = mod(H74*r',2);
pos = s(1)*4 + s(2)*2 + s(3)*1;                  % read the 3 syndrome bits as a binary number (MSB first)
fprintf('received       r = '); fprintf('%d ', r); fprintf('\n');
fprintf('syndrome       s = (%d,%d,%d) = binary %d  ->  single error at position %d\n', s(1),s(2),s(3),pos,pos);
rc  = r; if pos>=1 && pos<=7, rc(pos) = 1 - rc(pos); end
fprintf('corrected      r = '); fprintf('%d ', rc);
fprintf(' -> syndrome now '); fprintf('%d ', mod(H74*rc',2));
fprintf('  matches c? %d\n', isequal(rc,c));

% =================== PART 3: DETECT LENGTH-4 CYCLES ===================
fprintf('\n=========== PART 3: a length-4 cycle = two columns sharing two rows ===========\n');
detect_g4('(6,3) code', H63);
detect_g4('(7,4) Hamming', H74);

% =================== PART 4: HARD-DECISION BIT-FLIPPING DECODER ===================
fprintf('\n=========== PART 4: Gallager bit-flipping on the girth-6 Fano code ===========\n');
fprintf('(Hamming is girth-4, so bit-flipping ties; the (3,3)-regular girth-6 code corrects cleanly.)\n');
cf  = [0 0 0 1 1 1 1];                            % a weight-4 Fano codeword (Hf cf^T = 0)
fprintf('transmitted cf = '); fprintf('%d ', cf);
fprintf(' -> Hf cf^T mod 2 = '); fprintf('%d ', mod(Hf*cf',2)); fprintf('\n');
rf  = cf; rf(2) = 1 - rf(2);                      % inject a single error at bit 2
dec = bitflip(Hf, rf, 10);
fprintf('decoded    = '); fprintf('%d ', dec);
fprintf(' matches transmitted codeword? %d\n', isequal(dec,cf));

% ------------------------- helper functions -------------------------
function report_graph(name, H)
    [m,n] = size(H);
    dv = sum(H,1);            % column weights = variable-node degrees
    dc = sum(H,2)';           % row weights    = check-node degrees
    E  = sum(H(:));           % number of ones = number of edges
    rk = gf2rank(H);          % rank over GF(2)
    fprintf('\n%s:  n = %d variable nodes,  m = %d check nodes\n', name, n, m);
    fprintf('  variable degrees dv = '); fprintf('%d ', dv); fprintf(' (sum = %d)\n', sum(dv));
    fprintf('  check    degrees dc = '); fprintf('%d ', dc); fprintf(' (sum = %d)\n', sum(dc));
    fprintf('  edges |E| = %d   [by columns = %d, by rows = %d -> handshake %s]\n', ...
            E, sum(dv), sum(dc), tf(sum(dv)==sum(dc) && E==sum(dv)));
    fprintf('  rank2(H) = %d   design rate 1 - m/n = %.4f   true rate (n-rank)/n = %.4f\n', ...
            rk, 1 - m/n, (n-rk)/n);
end

function detect_g4(name, H)
    M = H' * H;               % integer; off-diagonal (j,k) = #rows where columns j,k are both 1
    n = size(H,2);  found = 0;
    fprintf('\n%s girth-4 test:\n', name);
    for j = 1:n-1
        for k = j+1:n
            if M(j,k) >= 2
                rows = find(H(:,j) & H(:,k))';
                fprintf('  4-cycle  v%d - c%d - v%d - c%d - v%d   (columns %d,%d share rows %s)\n', ...
                        j, rows(1), k, rows(2), j, j, k, mat2str(rows));
                found = found + 1;
            end
        end
    end
    if found == 0
        fprintf('  no two columns share two rows -> no length-4 cycle -> girth >= 6\n');
    else
        fprintf('  total length-4 cycles = %d -> girth = 4\n', found);
    end
end

function dec = bitflip(H, r, maxit)
    [m,n] = size(H);
    s  = mod(H*r',2);
    fprintf('  iter 0 : r = '); fprintf('%d ', r); fprintf(' | unsatisfied checks = %d\n', sum(s));
    it = 0;
    while any(s) && it < maxit
        it = it + 1;
        fails = zeros(1,n);
        for j = 1:n
            fails(j) = sum(s(H(:,j) == 1));      % how many of bit j's checks are unsatisfied
        end
        flip = find(fails == max(fails));         % flip the bit(s) in the most failing checks
        r(flip) = 1 - r(flip);
        s = mod(H*r',2);
        fprintf('  iter %d : flip bit(s) %s -> r = ', it, mat2str(flip));
        fprintf('%d ', r); fprintf(' | unsatisfied checks = %d\n', sum(s));
    end
    dec = r;
end

function rk = gf2rank(A)
    A = mod(A,2); [m,n] = size(A); rk = 0; row = 1;
    for col = 1:n
        if row > m, break; end
        piv = find(A(row:m,col), 1);
        if isempty(piv), continue; end
        piv = piv + row - 1;
        A([row piv],:) = A([piv row],:);
        others = find(A(:,col))'; others(others == row) = [];
        for i = others
            A(i,:) = mod(A(i,:) + A(row,:), 2);
        end
        row = row + 1; rk = rk + 1;
    end
end

function s = tf(b)
    if b, s = 'OK'; else s = 'MISMATCH'; end
end
`,
    python: String.raw`# TANNER GRAPH experiments, all runnable and self-checking (NumPy only).
# PART 1 builds the bipartite graph from H (node counts, degrees, edges two ways, rate).
# PART 2 runs the (7,4) Hamming syndrome and locates a single-bit error.
# PART 3 detects length-4 cycles (two columns sharing two rows).
# PART 4 is a Gallager bit-flipping decoder on a girth-6 (3,3)-regular code (the Fano / PG(2,2) matrix).
import numpy as np

# ---- three example parity-check matrices ----
H63 = np.array([[1,1,0,1,0,0],
                [0,1,1,0,1,0],
                [1,0,1,0,0,1]])
H74 = np.array([[0,0,0,1,1,1,1],
                [0,1,1,0,0,1,1],
                [1,0,1,0,1,0,1]])                  # Hamming(7,4), columns = binary 1..7
Hf  = np.array([[1,1,1,0,0,0,0],                   # Fano / PG(2,2), (3,3)-regular, girth 6
                [1,0,0,1,1,0,0],
                [1,0,0,0,0,1,1],
                [0,1,0,1,0,1,0],
                [0,1,0,0,1,0,1],
                [0,0,1,1,0,0,1],
                [0,0,1,0,1,1,0]])


def gf2rank(H):
    A = (np.array(H) % 2).astype(int).copy()
    m, n = A.shape
    rank, row = 0, 0
    for col in range(n):
        if row >= m:
            break
        piv = next((i for i in range(row, m) if A[i, col]), None)
        if piv is None:
            continue
        A[[row, piv]] = A[[piv, row]]
        for i in range(m):
            if i != row and A[i, col]:
                A[i] ^= A[row]
        row += 1
        rank += 1
    return rank


def report_graph(name, H):
    m, n = H.shape
    dv = H.sum(axis=0)          # column weights = variable-node degrees
    dc = H.sum(axis=1)          # row weights    = check-node degrees
    E  = int(H.sum())
    rk = gf2rank(H)
    hs = "OK" if (dv.sum() == dc.sum() == E) else "MISMATCH"
    print(f"\n{name}:  n = {n} variable nodes,  m = {m} check nodes")
    print("  variable degrees dv =", " ".join(map(str, dv)), f"(sum = {dv.sum()})")
    print("  check    degrees dc =", " ".join(map(str, dc)), f"(sum = {dc.sum()})")
    print(f"  edges |E| = {E}   [by columns = {dv.sum()}, by rows = {dc.sum()} -> handshake {hs}]")
    print(f"  rank2(H) = {rk}   design rate 1 - m/n = {1 - m/n:.4f}   true rate (n-rank)/n = {(n-rk)/n:.4f}")


def syndrome(H, r):
    return (H.dot(r)) % 2


def detect_g4(name, H):
    M = H.T.dot(H)              # off-diagonal (j,k) = #rows where columns j,k are both 1
    n = H.shape[1]
    found = 0
    print(f"\n{name} girth-4 test:")
    for j in range(n):
        for k in range(j+1, n):
            if M[j, k] >= 2:
                rows = [i+1 for i in range(H.shape[0]) if H[i, j] and H[i, k]]
                print(f"  4-cycle  v{j+1} - c{rows[0]} - v{k+1} - c{rows[1]} - v{j+1}"
                      f"   (columns {j+1},{k+1} share rows {rows})")
                found += 1
    if found == 0:
        print("  no two columns share two rows -> no length-4 cycle -> girth >= 6")
    else:
        print(f"  total length-4 cycles = {found} -> girth = 4")


def bitflip(H, r, maxit=10):
    r = r.copy()
    m, n = H.shape
    s = syndrome(H, r)
    print("  iter 0 : r =", " ".join(map(str, r)), f"| unsatisfied checks = {int(s.sum())}")
    it = 0
    while s.any() and it < maxit:
        it += 1
        fails = np.array([int(s[H[:, j] == 1].sum()) for j in range(n)])  # unsatisfied checks per bit
        flip = np.where(fails == fails.max())[0]                          # flip the most-failing bit(s)
        r[flip] ^= 1
        s = syndrome(H, r)
        print(f"  iter {it} : flip bit(s) {list(flip + 1)} -> r =",
              " ".join(map(str, r)), f"| unsatisfied checks = {int(s.sum())}")
    return r


# =================== PART 1: BUILD THE GRAPH FROM H ===================
print("=========== PART 1: the Tanner graph is the incidence structure of H ===========")
report_graph("(6,3) code", H63)
report_graph("(7,4) Hamming", H74)
report_graph("Fano / PG(2,2)", Hf)

# =================== PART 2: SYNDROME AND SINGLE-ERROR LOCATION (Hamming) ===================
print("\n=========== PART 2: syndrome s = H r^T (mod 2) locates a single error ===========")
c = np.array([1, 1, 0, 1, 0, 0, 1])                 # a valid Hamming codeword
print("transmitted codeword c =", " ".join(map(str, c)),
      "-> H c^T mod 2 =", " ".join(map(str, syndrome(H74, c))), "(all zero => codeword)")
r = c.copy(); r[5] ^= 1                              # flip bit 6 (index 5)
s = syndrome(H74, r)
pos = s[0]*4 + s[1]*2 + s[2]*1                       # read the 3 syndrome bits as a binary number (MSB first)
print("received       r =", " ".join(map(str, r)))
print(f"syndrome       s = ({s[0]},{s[1]},{s[2]}) = binary {pos}  ->  single error at position {pos}")
rc = r.copy()
if 1 <= pos <= 7:
    rc[pos-1] ^= 1
print("corrected      r =", " ".join(map(str, rc)),
      "-> syndrome now", " ".join(map(str, syndrome(H74, rc))),
      f" matches c? {np.array_equal(rc, c)}")

# =================== PART 3: DETECT LENGTH-4 CYCLES ===================
print("\n=========== PART 3: a length-4 cycle = two columns sharing two rows ===========")
detect_g4("(6,3) code", H63)
detect_g4("(7,4) Hamming", H74)

# =================== PART 4: HARD-DECISION BIT-FLIPPING DECODER ===================
print("\n=========== PART 4: Gallager bit-flipping on the girth-6 Fano code ===========")
print("(Hamming is girth-4, so bit-flipping ties; the (3,3)-regular girth-6 code corrects cleanly.)")
cf = np.array([0, 0, 0, 1, 1, 1, 1])                # a weight-4 Fano codeword (Hf cf^T = 0)
print("transmitted cf =", " ".join(map(str, cf)),
      "-> Hf cf^T mod 2 =", " ".join(map(str, syndrome(Hf, cf))))
rf = cf.copy(); rf[1] ^= 1                           # inject a single error at bit 2 (index 1)
dec = bitflip(Hf, rf, 10)
print("decoded    =", " ".join(map(str, dec)), f"matches transmitted codeword? {np.array_equal(dec, cf)}")
`,
    note: String.raw`Four self-checking experiments, each printing a measured number beside the theory it must match. PART 1 turns three parity-check matrices into their Tanner graphs and reads off every graph quantity. For the (6,3) code it reports n = 6 variable nodes and m = 3 check nodes, variable degrees dv = [2 2 2 1 1 1] (sum 9) and check degrees dc = [3 3 3] (sum 9), so the edge count |E| = 9 is confirmed two independent ways -- by columns (2+2+2+1+1+1) and by rows (3+3+3) -- which is the bipartite handshake, and the code prints "handshake OK" only when both totals equal |E|. The rank over GF(2) is 3, so the design rate 1 - m/n = 0.5000 equals the true rate (n - rank)/n = 0.5000. For the (7,4) Hamming code it reports n = 7, m = 3, dv = [1 1 2 1 2 2 3] (sum 12), dc = [4 4 4] (sum 12), |E| = 12, rank 3, and design rate 1 - 3/7 = 0.5714 = true rate -- an irregular variable side (degrees 1, 2 and 3) with a regular check side. The Fano / PG(2,2) matrix is the instructive one: it is (3,3)-regular with n = m = 7, dv and dc all 3, |E| = 21 = 7x3 = 7x3, yet its GF(2) rank is only 4, not 7. So its design rate 1 - m/n = 1 - 7/7 = 0.0000 is a strict LOWER bound that badly understates the true rate (7 - 4)/7 = 0.4286 -- a concrete demonstration that three of the seven check rows are linearly dependent (redundant), exactly the case where the design rate and the true rate part company. PART 2 exercises the syndrome as a fault locator. It first confirms c = [1 1 0 1 0 0 1] is a Hamming codeword (H c^T mod 2 comes back all zero), then flips bit 6 to form r = [1 1 0 1 0 1 1] and computes the syndrome s = H r^T mod 2 = (1,1,0). Because the Hamming columns are the binary numerals 1..7, reading those three bits as a binary number (MSB first) gives 1x4 + 1x2 + 0x1 = 6, pointing straight at the flipped bit; flipping position 6 back drives the syndrome to all zeros and recovers c exactly. PART 3 hunts length-4 cycles by forming M = H^T H, whose off-diagonal entry (j,k) counts the rows in which columns j and k are both 1: any value >= 2 is two variable nodes sharing two check neighbours, i.e. a 4-cycle. On the (6,3) code every pair of columns shares at most one row, so it reports "no length-4 cycle -> girth >= 6". On the Hamming code it finds three of them -- columns (3,7) sharing rows {2,3}, columns (5,7) sharing rows {1,3}, and columns (6,7) sharing rows {1,2} -- and concludes girth = 4, which is why short, dense codes like Hamming are decoded by one-shot syndrome lookup rather than by iterating belief propagation. PART 4 runs a pure hard-decision Gallager bit-flipping decoder, which is message passing stripped to its bones: compute the syndrome, count for each bit how many of its checks are unsatisfied, flip the bit(s) sitting in the most failing checks, and repeat. It is run on the girth-6, (3,3)-regular Fano code precisely because the Hamming graph's girth-4 structure makes bit-flipping tie between the true error and a degree-3 neighbour; on the girth-6 code the error bit is the unique node all of whose three checks fail (any other bit shares at most one of them), so a single error injected into the codeword cf = [0 0 0 1 1 1 1] at bit 2 is corrected in a single iteration -- iter 0 shows 3 unsatisfied checks, iter 1 flips exactly bit 2 and drives the count to 0, recovering cf. The same code sanity-checks itself throughout: cf is verified to satisfy Hf cf^T = 0 before the error is injected, and the decoded word is compared for exact equality with the transmitted codeword.`
  }
});
