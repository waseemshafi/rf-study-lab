// bpsk-vs-dbpsk.js — MATLAB + Python teaching code for the BPSK vs DBPSK topic.
// Populates CONTENT_CODE['bpsk-vs-dbpsk']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'bpsk-vs-dbpsk': {
    matlab: String.raw`% BPSK vs DBPSK: differential encode/decode, ambiguity immunity, and BER.
% (1) verify the differential encoder/decoder and its 180-deg ambiguity immunity,
% (2) Monte-Carlo BER of coherent BPSK and differentially coherent DBPSK,
% (3) overlay the theory curves Q(sqrt(2*Eb/N0)) and 0.5*exp(-Eb/N0).
rng(7);

% ---- (1) Differential encode/decode and ambiguity check ----
b = [1 0 1 1 0 0 1 0 1 1];          % data bits
d = zeros(1, numel(b));  ref = 0;   % initial reference d(-1)=0
for k = 1:numel(b)
    d(k) = xor(b(k), ref);          % encoder: d_k = b_k XOR d_{k-1}
    ref  = d(k);
end
% decode d_k XOR d_{k-1} (prepend the same reference 0)
dprev = [0 d(1:end-1)];
bhat  = xor(d, dprev);
% simulate a global 180-deg phase flip: EVERY received symbol inverts,
% including the initial reference symbol, so the reference flips 0 -> 1
dflip = 1 - d;
bhat_flip = xor(dflip, [1 dflip(1:end-1)]);   % flipped stream + flipped reference
disp('data      :'); disp(b);
disp('encoded d :'); disp(d);
disp('decoded   :'); disp(bhat);              % equals b
disp('decoded after 180-deg flip:'); disp(bhat_flip);  % still equals b

% ---- (2) Monte-Carlo BER ----
EbN0dB = 0:1:10;  EbN0 = 10.^(EbN0dB/10);
Nbits  = 2e5;
berBPSK = zeros(size(EbN0));  berDBPSK = zeros(size(EbN0));
for i = 1:numel(EbN0)
    sigma = sqrt(1/(2*EbN0(i)));           % noise std for unit Eb (I channel)
    bits  = randi([0 1], 1, Nbits);

    % --- coherent BPSK ---
    tx    = 1 - 2*bits;                     % 0->+1, 1->-1 (antipodal)
    rx    = tx + sigma*randn(1, Nbits);
    rxb   = (rx < 0);                       % threshold at 0
    berBPSK(i) = mean(rxb ~= bits);

    % --- differentially coherent DBPSK (complex, previous-symbol reference) ---
    dd    = zeros(1, Nbits);  r = 0;
    for k = 1:Nbits, dd(k) = xor(bits(k), r); r = dd(k); end
    sym   = 1 - 2*[0 dd];                   % prepend the d(-1)=0 reference symbol
    n     = sigma*(randn(1,Nbits+1) + 1j*randn(1,Nbits+1));  % N0/2 per dimension
    y     = sym + n;                        % received complex symbols
    prod0 = real( y(2:end) .* conj(y(1:end-1)) );  % compare adjacent symbols
    dech  = (prod0 < 0);                    % >0 same phase (b=0), <0 flip (b=1)
    berDBPSK(i) = mean(dech ~= bits);
end

% ---- (3) Theory overlay ----
theoryBPSK  = 0.5*erfc(sqrt(EbN0));   % = Q(sqrt(2*Eb/N0)), no toolbox needed
theoryDBPSK = 0.5*exp(-EbN0);
figure; semilogy(EbN0dB, theoryBPSK, 'b-', 'LineWidth', 1.6); hold on;
semilogy(EbN0dB, berBPSK, 'bo', 'MarkerSize', 6);
semilogy(EbN0dB, theoryDBPSK, 'r-', 'LineWidth', 1.6);
semilogy(EbN0dB, berDBPSK, 'rs', 'MarkerSize', 6);
grid on; xlabel('E_b/N_0 (dB)'); ylabel('BER');
legend('BPSK theory','BPSK sim','DBPSK theory','DBPSK sim');
title('BPSK vs DBPSK: DBPSK is ~1 dB to the right');
`,
    python: String.raw`# BPSK vs DBPSK: differential encode/decode, ambiguity immunity, and BER.
# (1) verify the encoder/decoder and its 180-deg ambiguity immunity,
# (2) Monte-Carlo BER of coherent BPSK and differentially coherent DBPSK,
# (3) overlay theory Q(sqrt(2*Eb/N0)) and 0.5*exp(-Eb/N0).
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

rng = np.random.default_rng(7)
Q = lambda x: 0.5*erfc(x/np.sqrt(2))

def diff_encode(b, ref=0):
    d = np.empty_like(b)
    for k in range(len(b)):
        d[k] = b[k] ^ ref
        ref  = d[k]
    return d

def diff_decode(d, ref=0):
    dprev = np.concatenate(([ref], d[:-1]))
    return d ^ dprev

# ---- (1) Encode / decode / ambiguity check ----
b = np.array([1,0,1,1,0,0,1,0,1,1])
d = diff_encode(b)
bhat = diff_decode(d)
dflip = 1 - d                       # global 180-deg phase flip inverts EVERY symbol,
bhat_flip = diff_decode(dflip, ref=1)   # including the initial reference (0 -> 1)
print('data           :', b)
print('encoded d      :', d)
print('decoded        :', bhat)         # equals b
print('decoded flipped:', bhat_flip)    # still equals b -> ambiguity immune

# ---- (2) Monte-Carlo BER ----
EbN0dB = np.arange(0, 11)
EbN0   = 10**(EbN0dB/10)
Nbits  = 200000
berBPSK, berDBPSK = [], []
for g in EbN0:
    sigma = np.sqrt(1/(2*g))                 # noise std (per real dimension, unit Eb)
    bits  = rng.integers(0, 2, Nbits)

    # coherent BPSK
    tx  = 1 - 2*bits                          # 0->+1, 1->-1
    rx  = tx + sigma*rng.standard_normal(Nbits)
    berBPSK.append(np.mean((rx < 0).astype(int) != bits))

    # differentially coherent DBPSK
    dd  = diff_encode(bits)
    sym = (1 - 2*np.concatenate(([0], dd))).astype(complex)  # prepend d(-1)=0 reference symbol
    n   = sigma*(rng.standard_normal(Nbits+1) + 1j*rng.standard_normal(Nbits+1))  # N0/2 per dim
    y   = sym + n
    prod0 = np.real(y[1:]*np.conj(y[:-1]))    # compare adjacent symbols
    dech  = (prod0 < 0).astype(int)
    berDBPSK.append(np.mean(dech != bits))

# ---- (3) Theory overlay ----
theoryBPSK  = Q(np.sqrt(2*EbN0))
theoryDBPSK = 0.5*np.exp(-EbN0)
plt.figure(figsize=(6.5,4.5))
plt.semilogy(EbN0dB, theoryBPSK,  'b-', lw=1.6, label='BPSK theory')
plt.semilogy(EbN0dB, berBPSK,     'bo', ms=6,   label='BPSK sim')
plt.semilogy(EbN0dB, theoryDBPSK, 'r-', lw=1.6, label='DBPSK theory')
plt.semilogy(EbN0dB, berDBPSK,    'rs', ms=6,   label='DBPSK sim')
plt.grid(True, which='both'); plt.legend()
plt.xlabel('Eb/N0 (dB)'); plt.ylabel('BER')
plt.title('BPSK vs DBPSK: DBPSK is ~1 dB to the right')
plt.tight_layout(); plt.show()
`,
    note: String.raw`Part (1) prints the data, the differentially encoded stream d_k = b_k XOR d_{k-1}, and the decoded output, which exactly equals the data; decoding a globally inverted stream (a 180-deg phase ambiguity) STILL returns the original data, demonstrating DBPSK's built-in ambiguity immunity — note the flip inverts the initial reference symbol too, which is why the decode uses the flipped reference 1. Part (2)-(3) Monte-Carlo the two schemes: coherent BPSK slices at zero, while DBPSK transmits one extra reference symbol (d(-1)=0) and compares each complex symbol to the previous one via real(y_k * conj(y_{k-1})). The simulated points sit on the theory curves Q(sqrt(2*Eb/N0)) = 0.5*erfc(sqrt(Eb/N0)) and 0.5*exp(-Eb/N0), and the DBPSK curve lies about 0.9 dB to the right of BPSK near BER 1e-4 (expect visible Monte-Carlo scatter below about 1e-5 with 2e5 bits). Remember to convert Eb/N0 from dB to a linear ratio (10^(dB/10)) before using either formula.`
  }
});
