// Extra runnable MATLAB + Python teaching snippets for 7 comms/DSP topics.
// Each string is String.raw so backslashes stay literal. CONTENT_CODE is global.
Object.assign(CONTENT_CODE, {
  'pulse-shaping': {
    matlab: String.raw`% Pulse shaping with a Raised-Cosine filter, ISI-free zero crossings.
sps = 8;           % samples per symbol
span = 8;          % filter length in symbols
Nsym = 200;        % random symbols
betas = [0.0 0.35 1.0];   % roll-off sweep

figure;
for k = 1:numel(betas)
    beta = betas(k);
    h = rcosdesign(beta, span, sps, 'normal');  % raised-cosine (needs Comm TB)
    bits = randi([0 1], Nsym, 1);
    syms = 2*bits - 1;                 % BPSK +/-1
    up = upsample(syms, sps);          % insert zeros between symbols
    tx = conv(up, h, 'same');          % shaped waveform

    subplot(3,1,1); plot((-span*sps/2:span*sps/2)/sps, h); hold on;  % pulse
    subplot(3,1,2);                                                   % spectrum
    H = 20*log10(abs(fftshift(fft(h, 1024))) + 1e-6);
    f = linspace(-0.5, 0.5, 1024) * sps;
    plot(f, H); hold on;
    subplot(3,1,3);                                                   % waveform
    if k == 2, plot(tx(1:40*sps)); hold on; end
end
subplot(3,1,1); title('RC pulse (zeros every symbol => ISI-free)'); grid on;
subplot(3,1,2); title('Spectrum vs roll-off \beta'); xlabel('f/R_{sym}');
legend('\beta=0','\beta=0.35','\beta=1'); grid on;
subplot(3,1,3); title('Shaped BPSK waveform (\beta=0.35)'); grid on;
`,
    python: String.raw`# Pulse shaping with a Raised-Cosine filter; show ISI-free zero crossings.
import numpy as np
import matplotlib.pyplot as plt

def rc_filter(beta, span, sps):
    """Raised-cosine impulse response, span symbols, sps samples/symbol."""
    t = np.arange(-span*sps/2, span*sps/2 + 1) / sps
    # sinc gives the ideal part; the cosine term applies the roll-off taper
    with np.errstate(divide='ignore', invalid='ignore'):
        h = np.sinc(t) * np.cos(np.pi*beta*t) / (1 - (2*beta*t)**2)
    h[np.isnan(h)] = np.pi/4 * np.sinc(1/(2*beta)) if beta > 0 else 0.0
    return h / np.sqrt(np.sum(h**2))

sps, span, Nsym = 8, 8, 200
betas = [0.0, 0.35, 1.0]
fig, ax = plt.subplots(3, 1, figsize=(8, 8))

for beta in betas:
    h = rc_filter(max(beta, 1e-9), span, sps)
    t = np.arange(len(h)) / sps - span/2
    ax[0].plot(t, h, label='beta=%.2f' % beta)         # pulse: zeros at integers
    H = 20*np.log10(np.abs(np.fft.fftshift(np.fft.fft(h, 1024))) + 1e-6)
    f = np.linspace(-0.5, 0.5, 1024) * sps
    ax[1].plot(f, H, label='beta=%.2f' % beta)          # spectrum

bits = np.random.randint(0, 2, Nsym)
syms = 2*bits - 1                                        # BPSK
up = np.zeros(Nsym*sps); up[::sps] = syms               # upsample
tx = np.convolve(up, rc_filter(0.35, span, sps), 'same')
ax[2].plot(tx[:40*sps])

ax[0].set_title('RC pulse: nulls every symbol => no ISI'); ax[0].legend(); ax[0].grid(True)
ax[1].set_title('Spectrum vs roll-off'); ax[1].set_xlabel('f / Rsym'); ax[1].legend(); ax[1].grid(True)
ax[2].set_title('Shaped BPSK waveform (beta=0.35)'); ax[2].grid(True)
plt.tight_layout(); plt.show()
`
  },

  'eye-diagram': {
    matlab: String.raw`% Eye diagram of a pulse-shaped BPSK signal with a little noise.
sps = 16; span = 8; Nsym = 400; beta = 0.35;
h = rcosdesign(beta, span, sps, 'sqrt');        % RRC shaping filter
bits = randi([0 1], Nsym, 1);
syms = 2*bits - 1;
up = upsample(syms, sps);
tx = conv(up, h, 'same');
rx = tx + 0.06*randn(size(tx));                 % add mild AWGN

% Overlay 2-symbol-wide segments to build the eye
seg = 2*sps;
figure; hold on;
start = span*sps;                               % skip filter transient
for n = start:seg:(length(rx)-seg)
    plot(0:seg-1, rx(n:n+seg-1), 'b');
end
xline(sps, 'r--', 'best sample');               % eye is widest here
title(sprintf('Eye diagram (beta=%.2f). Vertical opening = noise margin', beta));
xlabel('sample within 2 symbols'); ylabel('amplitude'); grid on;
fprintf('Best sampling instant is at the max eye opening (x = %d).\n', sps);
`,
    python: String.raw`# Eye diagram of a pulse-shaped BPSK signal with a little noise.
import numpy as np
import matplotlib.pyplot as plt

sps, span, Nsym, beta = 16, 8, 400, 0.35

def rrc(beta, span, sps):
    t = np.arange(-span*sps/2, span*sps/2 + 1) / sps
    b = beta
    h = np.zeros_like(t)
    for i, ti in enumerate(t):
        if abs(ti) < 1e-8:
            h[i] = 1 - b + 4*b/np.pi
        elif b > 0 and abs(abs(ti) - 1/(4*b)) < 1e-8:
            h[i] = (b/np.sqrt(2))*((1+2/np.pi)*np.sin(np.pi/(4*b)) +
                                   (1-2/np.pi)*np.cos(np.pi/(4*b)))
        else:
            h[i] = (np.sin(np.pi*ti*(1-b)) + 4*b*ti*np.cos(np.pi*ti*(1+b))) / \
                   (np.pi*ti*(1-(4*b*ti)**2))
    return h/np.sqrt(np.sum(h**2))

h = rrc(beta, span, sps)
bits = np.random.randint(0, 2, Nsym)
up = np.zeros(Nsym*sps); up[::sps] = 2*bits - 1
tx = np.convolve(up, h, 'same')
rx = tx + 0.06*np.random.randn(len(tx))        # mild AWGN

seg = 2*sps                                     # 2 symbols wide
plt.figure(figsize=(7, 5))
for n in range(span*sps, len(rx)-seg, seg):     # skip transient, step by 2 syms
    plt.plot(np.arange(seg), rx[n:n+seg], 'b', alpha=0.3)
plt.axvline(sps, color='r', ls='--', label='best sample (max opening)')
plt.title('Eye diagram: vertical opening = noise margin, horizontal = timing margin')
plt.xlabel('sample within 2 symbols'); plt.ylabel('amplitude')
plt.legend(); plt.grid(True); plt.tight_layout(); plt.show()
print('Sample at the widest eye opening, index =', sps)
`
  },

  'ber': {
    matlab: String.raw`% Monte-Carlo BPSK BER over AWGN vs theory Q(sqrt(2 Eb/N0)).
EbN0_dB = 0:1:10;
Nbits = 2e5;
ber = zeros(size(EbN0_dB));

for k = 1:numel(EbN0_dB)
    EbN0 = 10^(EbN0_dB(k)/10);
    bits = randi([0 1], Nbits, 1);
    tx = 2*bits - 1;                       % BPSK, Eb = 1
    sigma = sqrt(1/(2*EbN0));              % noise std for real BPSK
    rx = tx + sigma*randn(Nbits, 1);       % AWGN channel
    dec = rx > 0;                          % threshold detector
    ber(k) = mean(dec ~= bits);            % measured error rate
end

theory = 0.5*erfc(sqrt(10.^(EbN0_dB/10))); % Q(sqrt(2 Eb/N0)) = 0.5 erfc(sqrt(Eb/N0))

figure;
semilogy(EbN0_dB, theory, 'k-', 'LineWidth', 1.5); hold on;
semilogy(EbN0_dB, max(ber, 1e-6), 'ro');
grid on; xlabel('Eb/N0 (dB)'); ylabel('BER');
legend('Theory Q(sqrt(2 Eb/N0))', 'Monte-Carlo');
title('BPSK BER over AWGN');
`,
    python: String.raw`# Monte-Carlo BPSK BER over AWGN vs theory Q(sqrt(2 Eb/N0)).
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

EbN0_dB = np.arange(0, 11)
Nbits = 200000
ber = np.zeros(len(EbN0_dB))

for k, db in enumerate(EbN0_dB):
    EbN0 = 10**(db/10)
    bits = np.random.randint(0, 2, Nbits)
    tx = 2*bits - 1                         # BPSK, Eb = 1
    sigma = np.sqrt(1/(2*EbN0))             # noise std for real BPSK
    rx = tx + sigma*np.random.randn(Nbits)  # AWGN
    dec = (rx > 0).astype(int)             # threshold detector
    ber[k] = np.mean(dec != bits)          # measured BER

theory = 0.5*erfc(np.sqrt(10**(EbN0_dB/10)))   # = Q(sqrt(2 Eb/N0))

plt.figure()
plt.semilogy(EbN0_dB, theory, 'k-', lw=1.5, label='Theory Q(sqrt(2 Eb/N0))')
plt.semilogy(EbN0_dB, np.maximum(ber, 1e-6), 'ro', label='Monte-Carlo')
plt.grid(True, which='both'); plt.xlabel('Eb/N0 (dB)'); plt.ylabel('BER')
plt.title('BPSK BER over AWGN'); plt.legend(); plt.tight_layout(); plt.show()
`
  },

  'eb-no': {
    matlab: String.raw`% Relate Eb/N0, SNR and spectral efficiency; mark the Shannon limit.
% Eb/N0 = SNR * B / Rb = SNR / (spectral efficiency).  eta = Rb/B (bit/s/Hz).
SNR_dB = 10;  B = 1e6;  Rb = 250e3;             % example link
eta = Rb / B;                                    % spectral efficiency
EbN0_dB = SNR_dB - 10*log10(eta);                % convert SNR -> Eb/N0
fprintf('SNR=%.1f dB, eta=%.2f b/s/Hz  =>  Eb/N0=%.2f dB\n', SNR_dB, eta, EbN0_dB);

% BER curve for BPSK with the Shannon limit marked
EbN0 = -2:0.25:10;
ber = 0.5*erfc(sqrt(10.^(EbN0/10)));
shannon = -1.59;                                 % dB: Eb/N0 limit as eta -> 0

figure;
semilogy(EbN0, ber, 'b-', 'LineWidth', 1.5); hold on;
xline(shannon, 'r--', 'Shannon limit -1.59 dB');
grid on; xlabel('Eb/N0 (dB)'); ylabel('BER (BPSK)');
title('BER vs Eb/N0 with Shannon limit');
ylim([1e-6 1]);
`,
    python: String.raw`# Relate Eb/N0, SNR and spectral efficiency; mark the Shannon limit.
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

# Eb/N0 = SNR * B / Rb = SNR / eta, where eta = Rb/B (bit/s/Hz)
SNR_dB, B, Rb = 10.0, 1e6, 250e3
eta = Rb / B
EbN0_dB = SNR_dB - 10*np.log10(eta)
print('SNR=%.1f dB, eta=%.2f b/s/Hz  =>  Eb/N0=%.2f dB' % (SNR_dB, eta, EbN0_dB))

EbN0 = np.arange(-2, 10.01, 0.25)
ber = 0.5*erfc(np.sqrt(10**(EbN0/10)))          # BPSK
shannon = -1.59                                  # dB, Eb/N0 limit as eta -> 0

plt.figure()
plt.semilogy(EbN0, ber, 'b-', lw=1.5)
plt.axvline(shannon, color='r', ls='--', label='Shannon limit -1.59 dB')
plt.grid(True, which='both'); plt.xlabel('Eb/N0 (dB)'); plt.ylabel('BER (BPSK)')
plt.title('BER vs Eb/N0 with Shannon limit'); plt.ylim(1e-6, 1)
plt.legend(); plt.tight_layout(); plt.show()
`
  },

  'processing-gain': {
    matlab: String.raw`% DSSS spread/despread: measure SNR before and after despreading.
N = 31;                     % chips per bit -> processing gain 10log10(N)
Nbits = 2000;
bits = 2*randi([0 1], Nbits, 1) - 1;      % BPSK data +/-1
code = 2*randi([0 1], N, 1) - 1;          % pseudo-random spreading code

chips = kron(bits, code);                 % spread: each bit -> N chips
sigma = 3.0;                              % strong noise (low chip SNR)
rx = chips + sigma*randn(size(chips));    % AWGN on the wideband signal

% Despread by correlating each N-chip block with the code
rxb = reshape(rx, N, Nbits);
desp = (code' * rxb)' / N;                % coherent combine of N chips
dec = sign(desp);
ber = mean(dec ~= bits);

snr_before = 10*log10(1 / sigma^2);       % per-chip SNR
snr_after  = 10*log10(N^2 / (N*sigma^2)); % gain of N from combining
fprintf('Processing gain = 10log10(%d) = %.1f dB\n', N, 10*log10(N));
fprintf('SNR before = %.1f dB, after despread = %.1f dB, BER=%.4f\n', ...
        snr_before, snr_after, ber);

figure;
subplot(2,1,1); plot(abs(fftshift(fft(chips(1:512))))); title('Spread signal spectrum (wide)');
subplot(2,1,2); plot(abs(fftshift(fft(desp(1:512))))); title('Despread spectrum (collapsed to data BW)');
`,
    python: String.raw`# DSSS spread/despread: measure SNR before and after despreading.
import numpy as np
import matplotlib.pyplot as plt

N = 31                                    # chips per bit
Nbits = 2000
bits = 2*np.random.randint(0, 2, Nbits) - 1
code = 2*np.random.randint(0, 2, N) - 1   # spreading code

chips = np.kron(bits, code)               # spread
sigma = 3.0                               # strong noise
rx = chips + sigma*np.random.randn(len(chips))

rxb = rx.reshape(Nbits, N)                # one row per bit
desp = rxb @ code / N                      # correlate with code (combine N chips)
dec = np.sign(desp)
ber = np.mean(dec != bits)

snr_before = 10*np.log10(1 / sigma**2)        # per-chip
snr_after  = 10*np.log10(N**2 / (N*sigma**2)) # coherent gain of N
print('Processing gain = 10log10(%d) = %.1f dB' % (N, 10*np.log10(N)))
print('SNR before = %.1f dB, after = %.1f dB, BER = %.4f' %
      (snr_before, snr_after, ber))

fig, ax = plt.subplots(2, 1, figsize=(7, 6))
ax[0].plot(np.abs(np.fft.fftshift(np.fft.fft(chips[:512]))))
ax[0].set_title('Spread signal spectrum (wideband)')
ax[1].plot(np.abs(np.fft.fftshift(np.fft.fft(desp[:512]))))
ax[1].set_title('Despread spectrum (collapsed to data BW)')
plt.tight_layout(); plt.show()
`
  },

  'jamming-margin': {
    matlab: String.raw`% Jamming margin: Mj = Gp - Losses - (S/N)req  (all in dB).
% Mj is the max jammer-to-signal ratio (J/S) the link can tolerate.
Losses = 2;                          % implementation/system losses (dB)
Gp_dB = 10:2:30;                     % processing gain sweep (dB)
SNreq = [7 10 13];                   % required S/N for target BER (dB)

figure; hold on;
fprintf('Gp(dB)   ');
fprintf('SNreq=%2ddB  ', SNreq); fprintf('\n');
for g = Gp_dB
    Mj = g - Losses - SNreq;         % tolerable J/S for each required S/N
    fprintf('%5.0f    ', g);
    fprintf('%8.1f   ', Mj); fprintf('\n');
end
for i = 1:numel(SNreq)
    plot(Gp_dB, Gp_dB - Losses - SNreq(i), '-o', ...
         'DisplayName', sprintf('(S/N)req=%d dB', SNreq(i)));
end
grid on; xlabel('Processing gain Gp (dB)'); ylabel('Jamming margin Mj = J/S (dB)');
title('Jamming margin vs processing gain'); legend('Location','northwest');
`,
    python: String.raw`# Jamming margin: Mj = Gp - Losses - (S/N)req  (all in dB).
# Mj is the max jammer-to-signal ratio (J/S) the link can tolerate.
import numpy as np
import matplotlib.pyplot as plt

Losses = 2.0                          # system/implementation losses (dB)
Gp_dB = np.arange(10, 31, 2)          # processing gain sweep
SNreq = [7, 10, 13]                   # required S/N (dB) for target BER

print('Gp(dB)  ' + '  '.join('SNreq=%ddB' % s for s in SNreq))
for g in Gp_dB:
    row = [g - Losses - s for s in SNreq]
    print('%5.0f   ' % g + '   '.join('%7.1f' % m for m in row))

plt.figure()
for s in SNreq:
    plt.plot(Gp_dB, Gp_dB - Losses - s, '-o', label='(S/N)req=%d dB' % s)
plt.grid(True); plt.xlabel('Processing gain Gp (dB)')
plt.ylabel('Jamming margin Mj = J/S (dB)')
plt.title('Jamming margin vs processing gain')
plt.legend(); plt.tight_layout(); plt.show()
`
  },

  'sensitivity': {
    matlab: String.raw`% Receiver sensitivity = -174 + 10log10(B) + NF + SNRreq (dBm).
% -174 dBm/Hz is the thermal noise floor kTB at ~290 K.
B = [1e3 1e4 1e5 1e6 1e7];           % bandwidth sweep (Hz)
NF = [2 5 8];                        % noise figure sweep (dB)
SNRreq = 10;                         % required SNR for target BER (dB)

fprintf('   B(Hz)   ');
fprintf('NF=%ddB   ', NF); fprintf('\n');
for b = B
    fprintf('%8.0f  ', b);
    for nf = NF
        S = -174 + 10*log10(b) + nf + SNRreq;   % sensitivity in dBm
        fprintf('%7.1f  ', S);
    end
    fprintf('\n');
end

figure; hold on;
for nf = NF
    plot(10*log10(B), -174 + 10*log10(B) + nf + SNRreq, '-o', ...
         'DisplayName', sprintf('NF=%d dB', nf));
end
grid on; xlabel('10 log10(B)  (dB-Hz)'); ylabel('Sensitivity (dBm)');
title(sprintf('Sensitivity vs BW and NF (SNRreq=%d dB)', SNRreq));
legend('Location','northwest');
`,
    python: String.raw`# Receiver sensitivity = -174 + 10log10(B) + NF + SNRreq (dBm).
# -174 dBm/Hz is the thermal noise floor kTB at ~290 K.
import numpy as np
import matplotlib.pyplot as plt

B = np.array([1e3, 1e4, 1e5, 1e6, 1e7])   # bandwidth sweep (Hz)
NF = [2, 5, 8]                             # noise figure sweep (dB)
SNRreq = 10.0                              # required SNR (dB)

print('   B(Hz)   ' + '  '.join('NF=%ddB' % nf for nf in NF))
for b in B:
    vals = [-174 + 10*np.log10(b) + nf + SNRreq for nf in NF]
    print('%9.0f  ' % b + '  '.join('%6.1f' % v for v in vals))

plt.figure()
for nf in NF:
    plt.plot(10*np.log10(B), -174 + 10*np.log10(B) + nf + SNRreq, '-o',
             label='NF=%d dB' % nf)
plt.grid(True); plt.xlabel('10 log10(B)  (dB-Hz)'); plt.ylabel('Sensitivity (dBm)')
plt.title('Sensitivity vs bandwidth and NF (SNRreq=%d dB)' % SNRreq)
plt.legend(); plt.tight_layout(); plt.show()
`
  }
});
