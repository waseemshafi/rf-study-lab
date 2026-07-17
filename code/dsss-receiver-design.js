// dsss-receiver-design.js — MATLAB + Python teaching code for the DSSS Receiver Design topic.
// Populates CONTENT_CODE['dsss-receiver-design']. No literal backticks or template-literal placeholders inside code strings.
Object.assign(CONTENT_CODE, {
  'dsss-receiver-design': {
    matlab: String.raw`% Full DSSS receiver: spread + carrier -> despread with aligned PN -> integrate-and-dump
% -> BER vs Eb/N0 (must match theory) ; PLUS a RAKE maximal-ratio combiner whose
% combined SNR equals the sum of the finger SNRs.
rng(11);
Q = @(x) 0.5*erfc(x/sqrt(2));

% ================= PART 1: end-to-end BPSK-DSSS receiver, BER vs Eb/N0 =================
N      = 31;                 % chips per bit = processing gain (Rc/Rb)
Nbits  = 2e5;                % data bits per SNR point
fc     = 0.25;               % carrier (cycles/sample) for the passband demo
sps    = 4;                  % samples per chip (so carrier fits)
EbN0dB = 0:1:9;
code   = 2*(rand(1,N) > 0.5) - 1;         % fixed +/-1 PN code, one period per bit

t   = 0:(N*sps-1);
car = cos(2*pi*fc*t);                      % coherent carrier reference (assume tracked)
berSim = zeros(size(EbN0dB));
for k = 1:numel(EbN0dB)
    EbN0 = 10^(EbN0dB(k)/10);
    d    = 2*(rand(1,Nbits) > 0.5) - 1;               % +/-1 data bits
    chips = kron(d, code);                             % spread: each bit -> N chips
    chipUp = kron(chips, ones(1,sps));                 % oversample to carrier rate
    txBB  = repmat(car, 1, Nbits);                     % carrier per bit block
    tx    = chipUp .* txBB;                            % DSSS-BPSK passband signal
    % Passband AWGN: per-bit energy Eb = N*sps*0.5 (carrier power 1/2); set noise accordingly.
    Eb    = N*sps*0.5;
    N0    = Eb / EbN0;
    rx    = tx + sqrt(N0/2)*randn(size(tx));
    % --- Receiver: coherent carrier wipe-off, despread, integrate-and-dump ---
    bb    = rx .* repmat(car, 1, Nbits);               % multiply by carrier (x2 factor absorbed)
    bbChip = squeeze(sum(reshape(bb, sps, N*Nbits), 1));   % accumulate each chip
    desp   = bbChip .* repmat(code, 1, Nbits);         % despread with aligned PN
    z      = sum(reshape(desp, N, Nbits), 1);          % integrate-and-dump over the bit
    dhat   = sign(z);                                  % coherent BPSK decision
    berSim(k) = mean(dhat ~= d);
end
berTheory = Q(sqrt(2*10.^(EbN0dB/10)));               % plain BPSK reference

figure;
semilogy(EbN0dB, max(berSim,1e-6), 'bo-','LineWidth',1.5); hold on;
semilogy(EbN0dB, berTheory, 'r--','LineWidth',1.5); grid on;
xlabel('E_b/N_0 (dB)'); ylabel('BER');
legend('DSSS receiver (sim)','plain BPSK Q(\surd(2E_b/N_0))');
title(sprintf('End-to-end DSSS receiver BER = plain BPSK (N=%d, no G_p AWGN gain)', N));

% ================= PART 2: RAKE receiver, MRC combined SNR = sum of finger SNRs =========
L        = 4;                          % resolvable multipath fingers
gamma_dB = [8 6 4 2];                  % per-finger SNRs (dB)
gamma    = 10.^(gamma_dB/10);          % linear per-finger SNRs
h        = sqrt(gamma);                % finger amplitudes (unit-noise convention), real
Ntrial   = 2e5;

% Simulate MRC: y_l = h_l*s + n_l ; combine with w_l = conj(h_l)
s   = 2*(rand(1,Ntrial) > 0.5) - 1;    % BPSK symbols
z   = zeros(1,Ntrial);
for l = 1:L
    y = h(l)*s + randn(1,Ntrial);            % finger output, noise variance 1
    z = z + conj(h(l))*y;                    % maximal-ratio combine
end
berMRC   = mean(sign(z) ~= s);
gammaMRC_theory_dB = 10*log10(sum(gamma));   % combined SNR = sum of finger SNRs

fprintf('RAKE MRC: sum of finger SNRs = %.2f dB (fingers: %s dB)\n', ...
        gammaMRC_theory_dB, mat2str(gamma_dB));
fprintf('RAKE MRC simulated BER = %.2e ; single strongest finger BER approx = %.2e\n', ...
        berMRC, Q(sqrt(max(gamma))));   % noise var=1 => gamma is the finger OUTPUT SNR, so BER=Q(sqrt(SNR))
% For L equal fingers of SNR g0, combined = L*g0 (i.e. +10log10(L) dB array gain).
`,
    python: String.raw`# Full DSSS receiver: spread + carrier -> despread with aligned PN -> integrate-and-dump
# -> BER vs Eb/N0 matching theory ; PLUS a RAKE maximal-ratio combiner whose combined SNR
# equals the sum of the finger SNRs.
import numpy as np
from scipy.special import erfc

rng = np.random.default_rng(11)
Q = lambda x: 0.5*erfc(x/np.sqrt(2))

# ============ PART 1: end-to-end BPSK-DSSS receiver, BER vs Eb/N0 ============
N      = 31                 # chips per bit = processing gain
Nbits  = 200_000
fc     = 0.25               # carrier (cycles/sample)
sps    = 4                  # samples per chip
EbN0dB = np.arange(0, 10)
code   = 2*(rng.random(N) > 0.5) - 1          # fixed +/-1 PN code, one period per bit

t   = np.arange(N*sps)
car = np.cos(2*np.pi*fc*t)                    # coherent carrier reference (assumed tracked)
ber_sim = []
for db in EbN0dB:
    EbN0 = 10**(db/10)
    d      = 2*(rng.random(Nbits) > 0.5) - 1                 # +/-1 data bits
    chips  = np.repeat(d, N) * np.tile(code, Nbits)          # spread each bit into N chips
    chipUp = np.repeat(chips, sps)                           # oversample to carrier rate
    txBB   = np.tile(car, Nbits)                             # carrier per bit block
    tx     = chipUp * txBB                                   # DSSS-BPSK passband
    Eb     = N*sps*0.5                                       # Eb (carrier power 1/2)
    N0     = Eb / EbN0
    rx     = tx + np.sqrt(N0/2)*rng.standard_normal(tx.size) # passband AWGN
    # --- Receiver: coherent carrier wipe-off -> despread -> integrate-and-dump ---
    bb      = rx * np.tile(car, Nbits)                       # multiply by carrier
    bb_chip = bb.reshape(N*Nbits, sps).sum(axis=1)           # accumulate each chip
    desp    = bb_chip * np.tile(code, Nbits)                 # despread with aligned PN
    z       = desp.reshape(Nbits, N).sum(axis=1)             # integrate-and-dump over the bit
    dhat    = np.sign(z)                                     # coherent BPSK decision
    ber_sim.append(np.mean(dhat != d))
ber_sim    = np.maximum(ber_sim, 1e-6)
ber_theory = Q(np.sqrt(2*10**(EbN0dB/10)))                  # plain BPSK reference

# ============ PART 2: RAKE receiver, MRC combined SNR = sum of finger SNRs ============
gamma_dB = np.array([8., 6., 4., 2.])        # per-finger SNRs (dB)
gamma    = 10**(gamma_dB/10)                  # linear per-finger SNRs
h        = np.sqrt(gamma)                     # finger amplitudes (unit-noise convention)
Ntrial   = 200_000
s        = 2*(rng.random(Ntrial) > 0.5) - 1   # BPSK symbols
z        = np.zeros(Ntrial)
for l in range(len(gamma)):
    y = h[l]*s + rng.standard_normal(Ntrial)  # finger output, noise variance 1
    z = z + np.conj(h[l])*y                    # maximal-ratio combine
ber_mrc  = np.mean(np.sign(z) != s)
gamma_mrc_dB = 10*np.log10(gamma.sum())        # combined SNR = sum of finger SNRs

print(f"RAKE MRC: sum of finger SNRs = {gamma_mrc_dB:.2f} dB (fingers {gamma_dB} dB)")
# noise variance 1 => gamma is the finger OUTPUT SNR, so BER = Q(sqrt(SNR))
print(f"RAKE MRC simulated BER = {ber_mrc:.2e} ; strongest-finger-only BER ~ {Q(np.sqrt(gamma.max())):.2e}")

try:
    import matplotlib.pyplot as plt
    plt.figure()
    plt.semilogy(EbN0dB, ber_sim, 'o-', label='DSSS receiver (sim)')
    plt.semilogy(EbN0dB, ber_theory, 'r--', label=r'plain BPSK $Q(\sqrt{2E_b/N_0})$')
    plt.xlabel('Eb/N0 (dB)'); plt.ylabel('BER'); plt.grid(True, which='both'); plt.legend()
    plt.title(f'End-to-end DSSS receiver BER = plain BPSK (N={N})')
    plt.tight_layout(); plt.show()
except Exception as e:
    print('(plot skipped:', e, ')')
`,
    note: String.raw`Part 1 builds a complete DSSS-BPSK link: each bit is spread by an N-chip PN code, oversampled onto a carrier, and passed through AWGN; the receiver wipes off the (assumed-tracked) carrier, despreads with the time-aligned PN replica, and integrate-and-dumps over the bit. The simulated BER sits on the plain-BPSK curve Q(sqrt(2 Eb/N0)) — proof that spread-then-despread is a lossless round trip in AWGN, so processing gain gives NO thermal-noise gain (it buys interference/jam margin instead). Part 2 is a RAKE maximal-ratio combiner: with per-finger SNRs of 8, 6, 4, 2 dB, MRC (weights w_l = conj(h_l)) yields a combined SNR equal to the SUM of the linear finger SNRs (about 11.6 dB here: 6.31+3.98+2.51+1.58 = 14.4 linear), well above the strongest single finger (8 dB) — the diversity gain of the RAKE. For L equal fingers the combined SNR is L times one finger, i.e. a 10log10(L) dB array gain.`
  }
});
