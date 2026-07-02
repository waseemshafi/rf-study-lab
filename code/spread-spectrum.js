// Spread-spectrum teaching code: MATLAB + Python for 6 topics.
Object.assign(CONTENT_CODE, {
  'dsss': {
    matlab: String.raw`% DSSS: spreading, wideband low-PSD, narrowband jammer, despreading, processing gain
% Concept: multiplying data by a fast PN chip sequence spreads energy over a wide band,
% lowering power spectral density. A despread at the receiver collapses the signal back
% while spreading the jammer, giving processing gain Gp = 10*log10(N).
clear; clc;
N   = 32;                 % chips per bit (spreading factor)
nb  = 200;                % number of data bits
fs  = N;                  % samples/bit == chips/bit here
rng(1);

bits = 2*(rand(1,nb)>0.5)-1;         % +-1 data
pn   = 2*(rand(1,N)>0.5)-1;          % PN chip sequence (+-1)

% Spread: each bit repeated across N chips then multiplied by PN
tx = zeros(1,nb*N);
for k=1:nb
  tx((k-1)*N+1:k*N) = bits(k)*pn;
end

% Narrowband jammer: a strong tone at a fixed frequency
t  = (0:numel(tx)-1);
Aj = 6;                               % jammer amplitude (much larger)
jammer = Aj*cos(2*pi*0.10*t);         % narrowband interferer
rx = tx + jammer + 0.3*randn(size(tx));

% Despread: multiply by same PN, integrate over each bit
rhat = zeros(1,nb);
for k=1:nb
  seg = rx((k-1)*N+1:k*N);
  rhat(k) = sign(sum(seg.*pn));       % correlator / matched filter
end
ber = mean(rhat ~= bits);
Gp  = 10*log10(N);
fprintf('Spreading factor N=%d, Processing gain Gp=%.1f dB, BER=%.3f\n',N,Gp,ber);

% Spectra before/after despreading (first part of signal)
figure;
subplot(2,1,1);
pwelch(rx,[],[],[],fs); title('Before despread: wideband signal + narrowband jammer');
subplot(2,1,2);
% Rebuild a despread chip stream (jammer gets spread, signal collapses)
despread = rx .* repmat(pn,1,nb);
pwelch(despread,[],[],[],fs); title('After despread: signal concentrated, jammer spread');
`,
    python: String.raw`# DSSS: spreading, wideband low-PSD, narrowband jammer, despreading, processing gain
# Concept: a fast PN chip sequence spreads data energy over a wide band, lowering PSD.
# The receiver despreads (correlates) to recover the bit while the narrowband jammer
# gets spread out. Processing gain Gp = 10*log10(N).
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(1)
N   = 32          # chips per bit (spreading factor)
nb  = 200         # number of data bits
fs  = N           # samples/bit

bits = 2*(rng.random(nb) > 0.5).astype(int) - 1     # +-1 data
pn   = 2*(rng.random(N)  > 0.5).astype(int) - 1     # PN chips +-1

# Spread: repeat each bit over N chips, multiply by PN
tx = np.concatenate([b*pn for b in bits])

# Narrowband jammer (strong tone) + noise
t      = np.arange(tx.size)
Aj     = 6.0
jammer = Aj*np.cos(2*np.pi*0.10*t)
rx     = tx + jammer + 0.3*rng.standard_normal(tx.size)

# Despread: correlate each bit window with PN, decide sign
rhat = np.array([np.sign(np.sum(rx[k*N:(k+1)*N]*pn)) for k in range(nb)])
ber  = np.mean(rhat != bits)
Gp   = 10*np.log10(N)
print("Spreading factor N=%d, Processing gain Gp=%.1f dB, BER=%.3f" % (N, Gp, ber))

# Spectra before/after despread
despread = rx * np.tile(pn, nb)
def psd(x):
    X = np.fft.rfftfreq(x.size, d=1.0/fs), 20*np.log10(np.abs(np.fft.rfft(x))+1e-9)
    return X
fb, Pb = psd(rx)
fa, Pa = psd(despread)
fig, ax = plt.subplots(2,1, figsize=(8,6))
ax[0].plot(fb, Pb); ax[0].set_title('Before despread: wideband + narrowband jammer')
ax[0].set_ylabel('dB')
ax[1].plot(fa, Pa); ax[1].set_title('After despread: signal collapses, jammer spreads')
ax[1].set_xlabel('Frequency'); ax[1].set_ylabel('dB')
plt.tight_layout(); plt.show()
`
  },
  'frequency-hopping': {
    matlab: String.raw`% FHSS: pseudo-random frequency hopping across channels; time-frequency hop map;
% a partial-band jammer that only corrupts some dwells.
% Concept: the carrier hops among M channels following a PN hop sequence. A jammer
% fixed on a few channels only hits the dwells that land there.
clear; clc; rng(7);
M      = 8;             % number of channels
nHops  = 40;            % number of dwell periods
dwell  = 50;            % samples per dwell
fs     = 100;           % sample rate (arbitrary units)

% PN hop sequence: pseudo-random channel index per dwell
hopSeq = randi([1 M], 1, nHops);
chFreq = (1:M);         % channel center "frequencies" (units)

% Jammer occupies a fixed subset of channels
jamChans = [3 6];
hit = ismember(hopSeq, jamChans);
fprintf('Jammed channels: %s\n', mat2str(jamChans));
fprintf('Fraction of dwells hit by jammer: %.2f\n', mean(hit));

% Build a time-frequency image (channel occupancy over time)
TF = zeros(M, nHops);
for k=1:nHops
  TF(hopSeq(k), k) = 1;          % signal present in this channel
end
% Mark jammed channels as persistent interference
JAM = zeros(M, nHops); JAM(jamChans,:) = 0.4;
IMG = TF + JAM;

figure;
imagesc((1:nHops), chFreq, IMG); axis xy;
colormap(hot); colorbar;
xlabel('Dwell (time)'); ylabel('Channel (frequency)');
title('FHSS hop pattern (bright=signal, dim rows=jammer); collisions where they overlap');
hold on;
coll = find(hit);
plot(coll, hopSeq(coll), 'gx', 'MarkerSize', 12, 'LineWidth', 2); % collisions
legend('collisions');
`,
    python: String.raw`# FHSS: pseudo-random frequency hopping across channels; time-frequency hop map;
# partial-band jammer that only corrupts some dwells.
# Concept: the carrier hops among M channels via a PN hop sequence. A fixed jammer
# only hits dwells that land on its channels.
import numpy as np
import matplotlib.pyplot as plt

rng   = np.random.default_rng(7)
M     = 8            # channels
nHops = 40           # dwell periods
hopSeq = rng.integers(1, M+1, size=nHops)   # PN hop sequence (1..M)

jamChans = np.array([3, 6])                  # jammer's fixed channels
hit = np.isin(hopSeq, jamChans)
print("Jammed channels:", jamChans.tolist())
print("Fraction of dwells hit by jammer: %.2f" % hit.mean())

# Time-frequency occupancy image
TF = np.zeros((M, nHops))
for k in range(nHops):
    TF[hopSeq[k]-1, k] = 1.0     # signal present
JAM = np.zeros((M, nHops)); JAM[jamChans-1, :] = 0.4   # persistent jammer rows
IMG = TF + JAM

plt.figure(figsize=(9,4))
plt.imshow(IMG, origin='lower', aspect='auto', cmap='hot',
           extent=[0, nHops, 0.5, M+0.5])
plt.colorbar(label='occupancy')
coll = np.where(hit)[0]
plt.plot(coll+0.5, hopSeq[coll], 'gx', ms=10, mew=2, label='collisions')
plt.xlabel('Dwell (time)'); plt.ylabel('Channel (frequency)')
plt.title('FHSS hop pattern (bright=signal, dim rows=jammer)')
plt.legend(); plt.tight_layout(); plt.show()
`
  },
  'pn-codes': {
    matlab: String.raw`% PN codes: LFSR m-sequence generator, verify period 2^n-1 and two-valued autocorrelation.
% Concept: a maximal-length LFSR with a primitive polynomial cycles through all
% 2^n-1 nonzero states. Its bipolar autocorrelation is L at zero lag and -1 elsewhere.
clear; clc;
n    = 5;                       % LFSR length -> period L = 2^n - 1 = 31
taps = [5 3];                   % feedback taps for primitive poly x^5 + x^3 + 1
L    = 2^n - 1;
reg  = ones(1,n);               % nonzero initial state
seq  = zeros(1,L);

for i = 1:L
  seq(i) = reg(n);              % output bit
  fb = 0;
  for t = taps
    fb = xor(fb, reg(t));       % XOR of tapped stages
  end
  reg = [fb, reg(1:end-1)];     % shift right, insert feedback
end

% Verify maximal length: state should not repeat before L
fprintf('n=%d, expected period L=2^n-1=%d\n', n, L);
fprintf('Number of ones=%d, zeros=%d (balance property ~ one extra one)\n', ...
        sum(seq), L-sum(seq));

% Bipolar mapping and circular autocorrelation
bp = 2*seq - 1;                 % 0->-1, 1->+1
R  = zeros(1,L);
for k = 0:L-1
  R(k+1) = sum(bp .* circshift(bp,[0 k]));
end
fprintf('R(0)=%d (=L), off-peak values unique set: %s\n', R(1), mat2str(unique(R(2:end))));

figure;
stem(0:L-1, R, 'filled');
xlabel('lag'); ylabel('autocorrelation');
title('m-sequence autocorrelation: two-valued (L at 0, -1 elsewhere)');
grid on;
`,
    python: String.raw`# PN codes: LFSR m-sequence generator, verify period 2^n-1 and two-valued autocorrelation.
# Concept: a maximal-length LFSR with a primitive polynomial visits all 2^n-1 nonzero
# states. Bipolar autocorrelation = L at zero lag and -1 for all other lags.
import numpy as np
import matplotlib.pyplot as plt

def mseq(n, taps, init=None):
    L = 2**n - 1
    reg = np.ones(n, dtype=int) if init is None else np.array(init)
    out = np.zeros(L, dtype=int)
    for i in range(L):
        out[i] = reg[-1]                 # output bit
        fb = 0
        for t in taps:
            fb ^= reg[t-1]               # XOR of tapped stages
        reg = np.roll(reg, 1); reg[0] = fb
    return out

n, taps = 5, [5, 3]                      # primitive poly x^5 + x^3 + 1
seq = mseq(n, taps)
L = 2**n - 1
print("n=%d, expected period L=2^n-1=%d" % (n, L))
print("ones=%d zeros=%d (balance: one extra one)" % (seq.sum(), L-seq.sum()))

bp = 2*seq - 1                           # bipolar +-1
R = np.array([np.sum(bp*np.roll(bp, k)) for k in range(L)])
print("R(0)=%d (=L); off-peak unique values: %s" % (R[0], np.unique(R[1:]).tolist()))

plt.figure(figsize=(8,4))
plt.stem(np.arange(L), R)
plt.xlabel('lag'); plt.ylabel('autocorrelation')
plt.title('m-sequence autocorrelation: two-valued (L at 0, -1 elsewhere)')
plt.grid(True); plt.tight_layout(); plt.show()
`
  },
  'gold-code': {
    matlab: String.raw`% Gold codes: build a family from a preferred pair of m-sequences; three-valued
% cross-correlation; report the bound t(n).
% Concept: XORing one m-sequence with cyclic shifts of a second preferred m-sequence
% yields 2^n+1 Gold codes whose cross-correlation takes only 3 values.
clear; clc;
n = 5; L = 2^n - 1;

function s = gen(n, taps)
  L = 2^n - 1; reg = ones(1,n); s = zeros(1,L);
  for i=1:L
    s(i) = reg(n); fb = 0;
    for t = taps, fb = xor(fb, reg(t)); end
    reg = [fb, reg(1:end-1)];
  end
end

% Preferred pair of primitive polynomials for n=5
a = gen(n, [5 3]);         % x^5 + x^3 + 1
b = gen(n, [5 4 3 2]);     % x^5 + x^4 + x^3 + x^2 + 1

% Gold family: a, b, and a XOR (shifts of b)  -> L+2 codes total
G = zeros(L+2, L);
G(1,:) = a; G(2,:) = b;
for k = 0:L-1
  G(k+3,:) = xor(a, circshift(b,[0 k]));
end

% Three-valued cross-correlation bound
tn = 1 + 2^(floor((n+2)/2));         % t(n) for odd n
fprintf('n=%d: t(n)=%d, allowed correlation values {-t, -1, t-2} = {%d,-1,%d}\n', ...
        n, tn, -tn, tn-2);

% Cross-correlate two Gold codes over all shifts (bipolar)
x = 2*G(3,:)-1; y = 2*G(4,:)-1;
C = zeros(1,L);
for k=0:L-1, C(k+1) = sum(x .* circshift(y,[0 k])); end
fprintf('Observed cross-correlation values: %s\n', mat2str(unique(C)));

figure; stem(0:L-1, C, 'filled');
xlabel('shift'); ylabel('cross-correlation');
title('Gold-code cross-correlation: three-valued');
grid on;
`,
    python: String.raw`# Gold codes: build a family from a preferred pair of m-sequences; three-valued
# cross-correlation; report the bound t(n).
# Concept: XOR one m-sequence with cyclic shifts of a second preferred m-sequence to
# form 2^n+1 Gold codes; their cross-correlation takes only 3 values.
import numpy as np
import matplotlib.pyplot as plt

def gen(n, taps):
    L = 2**n - 1; reg = np.ones(n, dtype=int); s = np.zeros(L, dtype=int)
    for i in range(L):
        s[i] = reg[-1]; fb = 0
        for t in taps: fb ^= reg[t-1]
        reg = np.roll(reg, 1); reg[0] = fb
    return s

n = 5; L = 2**n - 1
a = gen(n, [5, 3])            # x^5 + x^3 + 1
b = gen(n, [5, 4, 3, 2])     # preferred partner

# Gold family: a, b, and a XOR shift(b)
G = [a, b] + [np.bitwise_xor(a, np.roll(b, k)) for k in range(L)]
G = np.array(G)

tn = 1 + 2**((n+2)//2)       # t(n) for odd n
print("n=%d: t(n)=%d, allowed values {-t,-1,t-2} = {%d,-1,%d}" % (n, tn, -tn, tn-2))

x = 2*G[2]-1; y = 2*G[3]-1
C = np.array([np.sum(x*np.roll(y, k)) for k in range(L)])
print("Observed cross-correlation values:", np.unique(C).tolist())

plt.figure(figsize=(8,4))
plt.stem(np.arange(L), C)
plt.xlabel('shift'); plt.ylabel('cross-correlation')
plt.title('Gold-code cross-correlation: three-valued')
plt.grid(True); plt.tight_layout(); plt.show()
`
  },
  'fec': {
    matlab: String.raw`% FEC: (7,4) Hamming encoder/decoder; BER coded vs uncoded over a BSC; coding gain.
% Concept: adding 3 parity bits to 4 data bits lets the decoder correct any single-bit
% error via syndrome decoding, lowering BER at the cost of rate.
clear; clc; rng(3);
G = [1 0 0 0 1 1 0;     % generator (systematic): [I | P]
     0 1 0 0 1 0 1;
     0 0 1 0 0 1 1;
     0 0 0 1 1 1 1];
H = [1 1 0 1 1 0 0;     % parity-check matrix
     1 0 1 1 0 1 0;
     0 1 1 1 0 0 1];

nWords = 20000;
p = 0.05;                          % BSC crossover probability

dataBitErr = 0; codedBitErr = 0;
% Syndrome -> error position lookup
synMap = containers.Map('KeyType','double','ValueType','double');
for pos = 1:7
  e = zeros(1,7); e(pos) = 1;
  s = mod(e*H',2); key = s(1)*4 + s(2)*2 + s(3);
  synMap(key) = pos;
end

for w = 1:nWords
  d = randi([0 1],1,4);
  c = mod(d*G,2);                  % encode
  % channel
  cErr = xor(c, rand(1,7) < p);
  uErr = xor(d, rand(1,4) < p);    % uncoded 4 bits over same BSC
  % decode: syndrome correct
  s = mod(cErr*H',2); key = s(1)*4 + s(2)*2 + s(3);
  cCorr = cErr;
  if key ~= 0 && isKey(synMap,key)
    pos = synMap(key); cCorr(pos) = 1 - cCorr(pos);
  end
  dHat = cCorr(1:4);               % systematic data bits
  codedBitErr = codedBitErr + sum(dHat ~= d);
  dataBitErr  = dataBitErr  + sum(uErr ~= d);
end
berU = dataBitErr /(nWords*4);
berC = codedBitErr/(nWords*4);
fprintf('BSC p=%.3f\n', p);
fprintf('Uncoded BER = %.4f\n', berU);
fprintf('Coded   BER = %.4f  (Hamming 7,4)\n', berC);
fprintf('Coding gain factor ~ %.2fx fewer errors\n', berU/max(berC,1e-9));

figure; bar([berU berC]); set(gca,'XTickLabel',{'Uncoded','Coded (7,4)'});
ylabel('BER'); title('Hamming(7,4) coding gain over BSC'); grid on;
`,
    python: String.raw`# FEC: (7,4) Hamming encoder/decoder; BER coded vs uncoded over a BSC; coding gain.
# Concept: 3 parity bits on 4 data bits let syndrome decoding correct any single-bit
# error, lowering BER at the cost of rate.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(3)
G = np.array([[1,0,0,0,1,1,0],
              [0,1,0,0,1,0,1],
              [0,0,1,0,0,1,1],
              [0,0,0,1,1,1,1]])
H = np.array([[1,1,0,1,1,0,0],
              [1,0,1,1,0,1,0],
              [0,1,1,1,0,0,1]])

# Syndrome -> error position lookup
synMap = {}
for pos in range(7):
    e = np.zeros(7, dtype=int); e[pos] = 1
    s = (e @ H.T) % 2
    synMap[int(s[0]*4 + s[1]*2 + s[2])] = pos

nWords, p = 20000, 0.05
codedErr = uncodedErr = 0
for _ in range(nWords):
    d = rng.integers(0, 2, 4)
    c = (d @ G) % 2
    cErr = np.bitwise_xor(c, (rng.random(7) < p).astype(int))
    uErr = np.bitwise_xor(d, (rng.random(4) < p).astype(int))
    s = (cErr @ H.T) % 2
    key = int(s[0]*4 + s[1]*2 + s[2])
    cCorr = cErr.copy()
    if key != 0 and key in synMap:
        pos = synMap[key]; cCorr[pos] ^= 1
    dHat = cCorr[:4]
    codedErr   += np.sum(dHat != d)
    uncodedErr += np.sum(uErr != d)

berU = uncodedErr / (nWords*4)
berC = codedErr   / (nWords*4)
print("BSC p=%.3f" % p)
print("Uncoded BER = %.4f" % berU)
print("Coded   BER = %.4f  (Hamming 7,4)" % berC)
print("Coding gain ~ %.2fx fewer errors" % (berU/max(berC,1e-9)))

plt.figure(figsize=(5,4))
plt.bar(['Uncoded','Coded (7,4)'], [berU, berC])
plt.ylabel('BER'); plt.title('Hamming(7,4) coding gain over BSC')
plt.grid(True, axis='y'); plt.tight_layout(); plt.show()
`
  },
  'viterbi': {
    matlab: String.raw`% Viterbi decoder for rate-1/2, K=3 convolutional code (g0=111, g1=101).
% Concept: the encoder is a 4-state machine; the decoder tracks the most likely path
% through the trellis using add-compare-select, then tracebacks to recover the bits.
clear; clc; rng(11);
K = 3; nStates = 4;                 % states = shift-register content (2 bits)
g0 = [1 1 1]; g1 = [1 0 1];

% Precompute trellis: for each state and input bit, next state + 2 output bits
nextS = zeros(nStates,2); outp = zeros(nStates,2,2);
for s = 0:nStates-1
  sr = [bitand(bitshift(s,-1),1), bitand(s,1)];   % [s1 s0]
  for u = 0:1
    reg = [u sr];                                  % current + memory
    o0 = mod(sum(reg.*g0),2); o1 = mod(sum(reg.*g1),2);
    ns = bitor(bitshift(u,1), sr(1));              % new state
    nextS(s+1,u+1) = ns; outp(s+1,u+1,:) = [o0 o1];
  end
end

% Encode a random message (terminate to state 0)
msg = [randi([0 1],1,12) 0 0];  Lm = numel(msg);
st = 0; code = zeros(1,2*Lm);
for i=1:Lm
  u = msg(i); o = squeeze(outp(st+1,u+1,:))';
  code(2*i-1:2*i) = o; st = nextS(st+1,u+1);
end

% BSC channel: flip some bits
rx = xor(code, rand(1,numel(code)) < 0.08);

% Viterbi: path metrics + survivor decisions
INF = 1e9; pm = INF*ones(nStates,1); pm(1)=0;
dec = zeros(nStates, Lm);           % survivor input decisions
for i=1:Lm
  r = rx(2*i-1:2*i); npm = INF*ones(nStates,1); ndec = zeros(nStates,1);
  for s=0:nStates-1
    for u=0:1
      ns = nextS(s+1,u+1); o = squeeze(outp(s+1,u+1,:))';
      m = pm(s+1) + sum(r ~= o);    % Hamming branch metric (add)
      if m < npm(ns+1)              % compare-select
        npm(ns+1)=m; ndec(ns+1)=s;  % remember predecessor
      end
    end
  end
  pm = npm; dec(:,i) = ndec;
end

% Traceback from state 0 (terminated)
st = 0; path = zeros(1,Lm);
for i=Lm:-1:1
  ps = dec(st+1,i);
  % recover input that took ps -> st
  u = (nextS(ps+1,1)==st) * 0 + (nextS(ps+1,2)==st) * 1;
  path(i) = u; st = ps;
end
errs = sum(path ~= msg);
fprintf('States: %s\n', mat2str(0:nStates-1));
fprintf('Channel bit flips = %d, decoded message errors = %d\n', ...
        sum(rx~=code), errs);
disp('msg :'); disp(msg); disp('decoded:'); disp(path);
`,
    python: String.raw`# Viterbi decoder for rate-1/2, K=3 convolutional code (g0=111, g1=101).
# Concept: encoder is a 4-state machine; the decoder finds the most likely trellis path
# by add-compare-select, then tracebacks to recover the message bits.
import numpy as np
rng = np.random.default_rng(11)

K, nStates = 3, 4
g0, g1 = np.array([1,1,1]), np.array([1,0,1])

# Trellis: next state and 2 output bits for each (state, input)
nextS = np.zeros((nStates,2), dtype=int)
outp  = np.zeros((nStates,2,2), dtype=int)
for s in range(nStates):
    sr = [(s>>1)&1, s&1]                 # [s1 s0]
    for u in range(2):
        reg = np.array([u, sr[0], sr[1]])
        o0 = np.sum(reg*g0) % 2; o1 = np.sum(reg*g1) % 2
        ns = ((u<<1) | sr[0])
        nextS[s,u] = ns; outp[s,u] = [o0, o1]

# Encode a random terminated message
msg = np.concatenate([rng.integers(0,2,12), [0,0]])
st = 0; code = []
for u in msg:
    code += list(outp[st,u]); st = nextS[st,u]
code = np.array(code)

# BSC channel
rx = np.bitwise_xor(code, (rng.random(code.size) < 0.08).astype(int))

# Viterbi add-compare-select
Lm = msg.size; INF = 1e9
pm = np.full(nStates, INF); pm[0] = 0
dec = np.zeros((nStates, Lm), dtype=int)
for i in range(Lm):
    r = rx[2*i:2*i+2]; npm = np.full(nStates, INF); ndec = np.zeros(nStates, dtype=int)
    for s in range(nStates):
        for u in range(2):
            ns = nextS[s,u]; m = pm[s] + np.sum(r != outp[s,u])
            if m < npm[ns]:
                npm[ns] = m; ndec[ns] = s
    pm = npm; dec[:,i] = ndec

# Traceback from terminated state 0
st = 0; path = np.zeros(Lm, dtype=int)
for i in range(Lm-1, -1, -1):
    ps = dec[st, i]
    u = 1 if nextS[ps,1] == st else 0
    path[i] = u; st = ps

print("States:", list(range(nStates)))
print("Channel bit flips =", int(np.sum(rx != code)),
      " decoded message errors =", int(np.sum(path != msg)))
print("msg    :", msg.tolist())
print("decoded:", path.tolist())
`
  }
});
