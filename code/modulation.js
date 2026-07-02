// Modulation teaching code: MATLAB + Python for bpsk, dbpsk, matched-filter, evm.
Object.assign(CONTENT_CODE, {
  'bpsk': {
    matlab: String.raw`% BPSK over AWGN: BER vs Eb/N0 with theory overlay + constellation
clear; close all;
N     = 2e5;                 % number of bits
EbN0dB = 0:1:10;             % Eb/N0 sweep in dB
ber   = zeros(size(EbN0dB));

bits = randi([0 1], 1, N);   % random bits
s    = 2*bits - 1;           % BPSK map: 0 -> -1, 1 -> +1 (Eb = 1)

for k = 1:length(EbN0dB)
    EbN0 = 10^(EbN0dB(k)/10);
    sigma = sqrt(1/(2*EbN0)); % noise std for unit-energy real BPSK
    r = s + sigma*randn(1,N); % AWGN channel
    bhat = r > 0;             % coherent decision at 0
    ber(k) = mean(bhat ~= bits);
end

% Theory: Pb = Q(sqrt(2*Eb/N0)),  Q(x) = 0.5*erfc(x/sqrt(2))
EbN0lin  = 10.^(EbN0dB/10);
berTheory = 0.5*erfc(sqrt(EbN0lin));   % = Q(sqrt(2*EbN0))

figure;
semilogy(EbN0dB, berTheory, 'k-', 'LineWidth', 1.5); hold on;
semilogy(EbN0dB, ber, 'ro', 'MarkerFaceColor', 'r');
grid on; xlabel('Eb/N0 (dB)'); ylabel('BER');
legend('Theory Q(sqrt(2 Eb/N0))', 'Simulated'); title('BPSK BER over AWGN');

% Constellation at a moderate SNR
EbN0 = 10^(6/10); sigma = sqrt(1/(2*EbN0));
rc = s(1:2000) + sigma*randn(1,2000);
figure; plot(rc, zeros(size(rc)), 'b.'); hold on;
plot([-1 1], [0 0], 'rx', 'MarkerSize', 12, 'LineWidth', 2);
grid on; xlabel('In-phase'); ylabel('Quadrature');
title('BPSK constellation at Eb/N0 = 6 dB'); axis([-3 3 -1 1]);
`,
    python: String.raw`# BPSK over AWGN: BER vs Eb/N0 with theory overlay + constellation
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

def qfunc(x):
    return 0.5 * erfc(x / np.sqrt(2.0))

N = 200000                       # number of bits
EbN0dB = np.arange(0, 11)        # Eb/N0 sweep in dB
ber = np.zeros(len(EbN0dB))

rng  = np.random.default_rng(0)
bits = rng.integers(0, 2, N)     # random bits
s    = 2*bits - 1                # BPSK map: 0 -> -1, 1 -> +1 (Eb = 1)

for k, dB in enumerate(EbN0dB):
    EbN0  = 10**(dB/10.0)
    sigma = np.sqrt(1.0/(2.0*EbN0))          # noise std, unit-energy real BPSK
    r     = s + sigma*rng.standard_normal(N) # AWGN channel
    bhat  = (r > 0).astype(int)              # coherent decision at 0
    ber[k] = np.mean(bhat != bits)

# Theory: Pb = Q(sqrt(2 Eb/N0))
EbN0lin   = 10**(EbN0dB/10.0)
berTheory = qfunc(np.sqrt(2*EbN0lin))

plt.figure()
plt.semilogy(EbN0dB, berTheory, 'k-', lw=1.5, label='Theory Q(sqrt(2 Eb/N0))')
plt.semilogy(EbN0dB, ber, 'ro', label='Simulated')
plt.grid(True, which='both'); plt.xlabel('Eb/N0 (dB)'); plt.ylabel('BER')
plt.legend(); plt.title('BPSK BER over AWGN')

# Constellation at 6 dB
EbN0 = 10**(6/10.0); sigma = np.sqrt(1.0/(2.0*EbN0))
rc = s[:2000] + sigma*rng.standard_normal(2000)
plt.figure()
plt.plot(rc, np.zeros_like(rc), 'b.', alpha=0.3)
plt.plot([-1, 1], [0, 0], 'rx', ms=12, mew=2)
plt.grid(True); plt.xlabel('In-phase'); plt.ylabel('Quadrature')
plt.title('BPSK constellation at Eb/N0 = 6 dB'); plt.axis([-3, 3, -1, 1])
plt.show()
`
  },
  'dbpsk': {
    matlab: String.raw`% DBPSK: differential encode/decode, BER vs Eb/N0 vs coherent BPSK
clear; close all;
N      = 3e5;
EbN0dB = 0:1:10;
berD   = zeros(size(EbN0dB));
berC   = zeros(size(EbN0dB));

bits = randi([0 1], 1, N);

% Differential encoding: d(k) = d(k-1) XOR bit(k), start reference = 0
d = zeros(1, N+1);            % d(1) is the reference symbol
for k = 1:N
    d(k+1) = xor(d(k), bits(k));
end
s = 2*d - 1;                 % map differential bits to +/-1

for i = 1:length(EbN0dB)
    EbN0 = 10^(EbN0dB(i)/10);
    sigma = sqrt(1/(2*EbN0));
    r = s + sigma*randn(1, N+1);

    % Differential (non-coherent style) decode: compare adjacent symbols
    dhat = r > 0;                       % detect each symbol
    bhatD = xor(dhat(1:end-1), dhat(2:end));
    berD(i) = mean(bhatD ~= bits);

    % Coherent BPSK reference on the raw bits
    sc = 2*bits - 1;
    rc = sc + sigma*randn(1, N);
    berC(i) = mean((rc > 0) ~= bits);
end

EbN0lin = 10.^(EbN0dB/10);
berDBPSKtheory = 0.5*exp(-EbN0lin);        % DBPSK approx
berBPSKtheory  = 0.5*erfc(sqrt(EbN0lin));  % coherent BPSK = Q(sqrt(2 EbN0))

figure;
semilogy(EbN0dB, berBPSKtheory, 'b-', 'LineWidth', 1.5); hold on;
semilogy(EbN0dB, berDBPSKtheory, 'r-', 'LineWidth', 1.5);
semilogy(EbN0dB, berC, 'bo'); semilogy(EbN0dB, berD, 'rs');
grid on; xlabel('Eb/N0 (dB)'); ylabel('BER');
legend('BPSK theory', 'DBPSK theory 0.5 e^{-EbN0}', 'BPSK sim', 'DBPSK sim');
title('DBPSK vs coherent BPSK (~1 dB penalty)');
`,
    python: String.raw`# DBPSK: differential encode/decode, BER vs Eb/N0 vs coherent BPSK
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

N = 300000
EbN0dB = np.arange(0, 11)
berD = np.zeros(len(EbN0dB))
berC = np.zeros(len(EbN0dB))

rng  = np.random.default_rng(1)
bits = rng.integers(0, 2, N)

# Differential encoding: d[k] = d[k-1] XOR bit[k], reference = 0
d = np.zeros(N+1, dtype=int)
for k in range(N):
    d[k+1] = d[k] ^ bits[k]
s = 2*d - 1                       # map to +/-1

for i, dB in enumerate(EbN0dB):
    EbN0  = 10**(dB/10.0)
    sigma = np.sqrt(1.0/(2.0*EbN0))
    r = s + sigma*rng.standard_normal(N+1)

    # Differential decode: compare adjacent detected symbols
    dhat  = (r > 0).astype(int)
    bhatD = dhat[:-1] ^ dhat[1:]
    berD[i] = np.mean(bhatD != bits)

    # Coherent BPSK reference
    sc = 2*bits - 1
    rc = sc + sigma*rng.standard_normal(N)
    berC[i] = np.mean(((rc > 0).astype(int)) != bits)

EbN0lin        = 10**(EbN0dB/10.0)
berDBPSKtheory = 0.5*np.exp(-EbN0lin)        # DBPSK approx
berBPSKtheory  = 0.5*erfc(np.sqrt(EbN0lin))  # coherent BPSK

plt.figure()
plt.semilogy(EbN0dB, berBPSKtheory, 'b-', lw=1.5, label='BPSK theory')
plt.semilogy(EbN0dB, berDBPSKtheory, 'r-', lw=1.5, label='DBPSK theory 0.5 exp(-EbN0)')
plt.semilogy(EbN0dB, berC, 'bo', label='BPSK sim')
plt.semilogy(EbN0dB, berD, 'rs', label='DBPSK sim')
plt.grid(True, which='both'); plt.xlabel('Eb/N0 (dB)'); plt.ylabel('BER')
plt.legend(); plt.title('DBPSK vs coherent BPSK (~1 dB penalty)')
plt.show()
`
  },
  'matched-filter': {
    matlab: String.raw`% Matched filter: h(t)=s(T-t), correlation peak and SNR gain = 2E/N0
clear; close all;
Fs = 100;                    % samples per pulse duration
t  = (0:Fs-1)/Fs;            % one symbol interval, T = 1
s  = sin(pi*t);              % half-sine transmit pulse s(t)
E  = sum(s.^2);              % pulse energy (in samples)

N0     = 2.0;                % noise PSD parameter
sigma  = sqrt(N0/2);         % AWGN std per sample
guard  = zeros(1, Fs);
tx     = [guard s guard];    % pulse embedded in a longer record
noise  = sigma*randn(size(tx));
rx     = tx + noise;         % noisy received signal

h  = fliplr(s);              % matched filter h(t) = s(T - t)
y  = conv(rx, h);            % matched-filter (correlator) output
[peak, idx] = max(y);        % correlation peak location

% SNR gain check: peak signal power / output noise power ~ 2E/N0
sigOut   = conv(tx, h);
peakSig  = max(sigOut);
noiseOut = conv(noise, h);
snrOut   = peakSig^2 / var(noiseOut);
fprintf('Measured MF output SNR = %.2f, theory 2E/N0 = %.2f\n', snrOut, 2*E/N0);

figure;
subplot(2,1,1); plot(rx); grid on;
title('Received noisy signal (input to matched filter)'); xlabel('sample');
subplot(2,1,2); plot(y); hold on; plot(idx, peak, 'ro', 'MarkerFaceColor', 'r');
grid on; title('Matched-filter output (correlation peak)'); xlabel('sample');
`,
    python: String.raw`# Matched filter: h(t)=s(T-t), correlation peak and SNR gain = 2E/N0
import numpy as np
import matplotlib.pyplot as plt

Fs = 100                       # samples per pulse duration
t  = np.arange(Fs)/Fs          # one symbol interval, T = 1
s  = np.sin(np.pi*t)           # half-sine transmit pulse s(t)
E  = np.sum(s**2)              # pulse energy (in samples)

N0    = 2.0                    # noise PSD parameter
sigma = np.sqrt(N0/2)          # AWGN std per sample
rng   = np.random.default_rng(2)

guard = np.zeros(Fs)
tx    = np.concatenate([guard, s, guard])   # pulse in a longer record
noise = sigma*rng.standard_normal(tx.shape)
rx    = tx + noise                          # noisy received signal

h = s[::-1]                    # matched filter h(t) = s(T - t)
y = np.convolve(rx, h)         # matched-filter (correlator) output
idx = int(np.argmax(y)); peak = y[idx]

# SNR gain: peak signal power / output noise power ~ 2E/N0
sigOut   = np.convolve(tx, h)
peakSig  = np.max(sigOut)
noiseOut = np.convolve(noise, h)
snrOut   = peakSig**2 / np.var(noiseOut)
print('Measured MF output SNR = %.2f, theory 2E/N0 = %.2f' % (snrOut, 2*E/N0))

fig, ax = plt.subplots(2, 1)
ax[0].plot(rx); ax[0].grid(True)
ax[0].set_title('Received noisy signal (input to matched filter)'); ax[0].set_xlabel('sample')
ax[1].plot(y); ax[1].plot(idx, peak, 'ro')
ax[1].grid(True); ax[1].set_title('Matched-filter output (correlation peak)'); ax[1].set_xlabel('sample')
plt.tight_layout(); plt.show()
`
  },
  'evm': {
    matlab: String.raw`% EVM: 16-QAM with impairments, EVM_rms, SNR ~= -20log10(EVM)
clear; close all;
M = 16; k = log2(M); Nsym = 5000;

% Gray-ish 16-QAM constellation (normalized to unit average power)
re = [-3 -1 1 3]; [I, Q] = meshgrid(re, re);
alphabet = I(:) + 1j*Q(:);
alphabet = alphabet / sqrt(mean(abs(alphabet).^2));

idx  = randi([1 M], 1, Nsym);
tx   = alphabet(idx).';       % ideal transmitted symbols

% Impairments: AWGN, phase error, gain (I/Q) imbalance
snrdB    = 25;
noiseVar = 10^(-snrdB/10);
n        = sqrt(noiseVar/2)*(randn(1,Nsym) + 1j*randn(1,Nsym));
phi      = 3*pi/180;          % 3 degree phase error
g        = 1.05;              % 5% gain imbalance on I branch
rx       = (g*real(tx) + 1j*imag(tx)) .* exp(1j*phi) + n;

% EVM: error vector relative to RMS reference amplitude
errv   = rx - tx;
evmRms = sqrt(mean(abs(errv).^2) / mean(abs(tx).^2));
snrEst = -20*log10(evmRms);
fprintf('EVM_rms = %.2f %%, implied SNR = %.2f dB\n', evmRms*100, snrEst);

figure; hold on;
plot(real(rx), imag(rx), 'b.', 'MarkerSize', 4);
plot(real(alphabet), imag(alphabet), 'rx', 'MarkerSize', 10, 'LineWidth', 2);
for m = 1:300                 % draw error vectors for a subset
    plot([real(tx(m)) real(rx(m))], [imag(tx(m)) imag(rx(m))], 'g-');
end
grid on; axis equal; xlabel('I'); ylabel('Q');
title(sprintf('16-QAM EVM = %.1f%% (SNR ~ %.1f dB)', evmRms*100, snrEst));
`,
    python: String.raw`# EVM: 16-QAM with impairments, EVM_rms, SNR ~= -20log10(EVM)
import numpy as np
import matplotlib.pyplot as plt

M = 16; Nsym = 5000
rng = np.random.default_rng(3)

# 16-QAM constellation normalized to unit average power
re = np.array([-3, -1, 1, 3])
I, Q = np.meshgrid(re, re)
alphabet = (I.ravel() + 1j*Q.ravel())
alphabet = alphabet / np.sqrt(np.mean(np.abs(alphabet)**2))

idx = rng.integers(0, M, Nsym)
tx  = alphabet[idx]                 # ideal transmitted symbols

# Impairments: AWGN, phase error, gain (I/Q) imbalance
snrdB    = 25.0
noiseVar = 10**(-snrdB/10.0)
n   = np.sqrt(noiseVar/2)*(rng.standard_normal(Nsym) + 1j*rng.standard_normal(Nsym))
phi = np.deg2rad(3.0)               # 3 degree phase error
g   = 1.05                          # 5% gain imbalance on I branch
rx  = (g*tx.real + 1j*tx.imag)*np.exp(1j*phi) + n

# EVM relative to RMS reference amplitude
errv   = rx - tx
evmRms = np.sqrt(np.mean(np.abs(errv)**2) / np.mean(np.abs(tx)**2))
snrEst = -20*np.log10(evmRms)
print('EVM_rms = %.2f %%, implied SNR = %.2f dB' % (evmRms*100, snrEst))

plt.figure()
plt.plot(rx.real, rx.imag, 'b.', ms=3, alpha=0.4)
plt.plot(alphabet.real, alphabet.imag, 'rx', ms=10, mew=2)
for m in range(300):                # error vectors for a subset
    plt.plot([tx[m].real, rx[m].real], [tx[m].imag, rx[m].imag], 'g-', lw=0.5)
plt.grid(True); plt.axis('equal'); plt.xlabel('I'); plt.ylabel('Q')
plt.title('16-QAM EVM = %.1f%% (SNR ~ %.1f dB)' % (evmRms*100, snrEst))
plt.show()
`
  }
});
