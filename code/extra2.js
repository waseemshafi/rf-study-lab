// extra2.js — MATLAB + Python teaching code for 7 comms/DSP topics.
// Populates the global CONTENT_CODE map. No literal backticks or ${...} inside code strings.
Object.assign(CONTENT_CODE, {
  'am': {
    matlab: String.raw`% Amplitude Modulation (AM): waveform, envelope, spectrum, detection, overmodulation
fs = 20000; t = 0:1/fs:0.05;         % sampling grid (50 ms)
fc = 2000; fm = 100;                 % carrier and message tone (Hz)
Ac = 1;                              % carrier amplitude
msg = cos(2*pi*fm*t);               % single-tone message

for m = [0.5 1.0 1.5]               % modulation index: under, critical, over
    s = Ac*(1 + m*msg).*cos(2*pi*fc*t);   % standard AM (DSB-LC)
    env = Ac*(1 + m*msg);                 % ideal envelope

    % Envelope detection: rectify + low-pass (simple moving average)
    rect = abs(s);
    w = round(fs/(4*fc)); w = max(w,1);
    det = filter(ones(1,w)/w, 1, rect);

    figure('Name', sprintf('AM m=%.1f', m));
    subplot(3,1,1); plot(t, s); hold on; plot(t, env, 'r', 'LineWidth', 1.2);
    plot(t, -env, 'r'); title(sprintf('AM waveform + envelope, m=%.1f', m));
    xlabel('t (s)'); ylabel('s(t)'); xlim([0 0.02]);
    if m > 1, text(0.001, 0, 'OVERMODULATION: envelope crosses zero'); end

    subplot(3,1,2); plot(t, det); title('Envelope-detected message');
    xlabel('t (s)'); xlim([0 0.02]);

    N = length(s); f = (-N/2:N/2-1)*(fs/N);
    S = fftshift(abs(fft(s))/N);
    subplot(3,1,3); plot(f, 20*log10(S+eps));
    title('Spectrum: carrier at fc, sidebands at fc +/- fm');
    xlabel('f (Hz)'); ylabel('dB'); xlim([fc-500 fc+500]);
end
% Key ideas: sidebands sit at fc +/- fm; power in sidebands grows with m^2;
% m>1 makes (1+m*msg) go negative -> envelope detector distorts.
`,
    python: String.raw`# Amplitude Modulation (AM): waveform, envelope, spectrum, detection, overmodulation
import numpy as np
import matplotlib.pyplot as plt

fs = 20000.0
t = np.arange(0, 0.05, 1/fs)          # 50 ms grid
fc, fm, Ac = 2000.0, 100.0, 1.0        # carrier, message tone, carrier amplitude
msg = np.cos(2*np.pi*fm*t)             # single-tone message

for m in (0.5, 1.0, 1.5):              # under / critical / over modulation
    s = Ac*(1 + m*msg)*np.cos(2*np.pi*fc*t)   # DSB-LC AM
    env = Ac*(1 + m*msg)                       # ideal envelope

    # Envelope detection: rectify then moving-average low-pass
    w = max(int(fs/(4*fc)), 1)
    det = np.convolve(np.abs(s), np.ones(w)/w, mode='same')

    fig, ax = plt.subplots(3, 1, figsize=(8, 7))
    ax[0].plot(t, s, lw=0.6); ax[0].plot(t, env, 'r'); ax[0].plot(t, -env, 'r')
    ax[0].set_xlim(0, 0.02); ax[0].set_title(f'AM waveform + envelope, m={m}')
    if m > 1:
        ax[0].text(0.001, 0, 'OVERMODULATION: envelope crosses zero', color='k')

    ax[1].plot(t, det); ax[1].set_xlim(0, 0.02)
    ax[1].set_title('Envelope-detected message')

    N = len(s); f = np.fft.fftshift(np.fft.fftfreq(N, 1/fs))
    S = np.fft.fftshift(np.abs(np.fft.fft(s))/N)
    ax[2].plot(f, 20*np.log10(S + 1e-12))
    ax[2].set_xlim(fc-500, fc+500)
    ax[2].set_title('Spectrum: carrier at fc, sidebands at fc +/- fm')
    ax[2].set_xlabel('f (Hz)'); ax[2].set_ylabel('dB')
    fig.tight_layout()

# Sidebands at fc +/- fm; sideband power scales with m^2; m>1 distorts the envelope detector.
plt.show()
`
  },

  'fm': {
    matlab: String.raw`% Frequency Modulation (FM): waveform, instantaneous frequency, spectrum, Carson BW
fs = 200000; t = 0:1/fs:0.02;        % 20 ms grid
fc = 20000; fm = 500;                % carrier and message tone (Hz)
msg = cos(2*pi*fm*t);               % message

for beta = [1 5]                     % FM modulation index beta = df/fm
    df = beta*fm;                    % peak frequency deviation (Hz)
    % Phase = integral of instantaneous freq; for cosine message: (df/fm)*sin(...)
    phi = 2*pi*fc*t + beta*sin(2*pi*fm*t);
    s = cos(phi);

    % Instantaneous frequency = (1/2pi) d(phi)/dt
    finst = fc + df*cos(2*pi*fm*t);

    figure('Name', sprintf('FM beta=%d', beta));
    subplot(3,1,1); plot(t, s); xlim([0 0.004]);
    title(sprintf('FM waveform, beta=%d', beta)); xlabel('t (s)');

    subplot(3,1,2); plot(t, finst); title('Instantaneous frequency (Hz)');
    xlabel('t (s)'); xlim([0 0.004]);

    N = length(s); f = (-N/2:N/2-1)*(fs/N);
    S = fftshift(abs(fft(s))/N);
    Bc = 2*(df + fm);               % Carson bandwidth
    subplot(3,1,3); plot(f, 20*log10(S+eps)); hold on;
    xline(fc - Bc/2, 'r--'); xline(fc + Bc/2, 'r--');
    title(sprintf('Spectrum, Carson BW = 2(df+fm) = %.0f Hz', Bc));
    xlabel('f (Hz)'); ylabel('dB'); xlim([fc-2*Bc fc+2*Bc]);
end
% Carson's rule: ~98%% of FM power lies within 2(df+fm). Larger beta -> wider spectrum.
`,
    python: String.raw`# Frequency Modulation (FM): waveform, instantaneous frequency, spectrum, Carson BW
import numpy as np
import matplotlib.pyplot as plt

fs = 200000.0
t = np.arange(0, 0.02, 1/fs)          # 20 ms grid
fc, fm = 20000.0, 500.0               # carrier, message tone

for beta in (1, 5):                    # FM modulation index beta = df/fm
    df = beta*fm                        # peak frequency deviation
    phi = 2*np.pi*fc*t + beta*np.sin(2*np.pi*fm*t)   # integrated phase
    s = np.cos(phi)
    finst = fc + df*np.cos(2*np.pi*fm*t)             # instantaneous frequency

    fig, ax = plt.subplots(3, 1, figsize=(8, 7))
    ax[0].plot(t, s, lw=0.6); ax[0].set_xlim(0, 0.004)
    ax[0].set_title(f'FM waveform, beta={beta}')

    ax[1].plot(t, finst); ax[1].set_xlim(0, 0.004)
    ax[1].set_title('Instantaneous frequency (Hz)')

    N = len(s); f = np.fft.fftshift(np.fft.fftfreq(N, 1/fs))
    S = np.fft.fftshift(np.abs(np.fft.fft(s))/N)
    Bc = 2*(df + fm)                    # Carson bandwidth
    ax[2].plot(f, 20*np.log10(S + 1e-12))
    ax[2].axvline(fc - Bc/2, color='r', ls='--')
    ax[2].axvline(fc + Bc/2, color='r', ls='--')
    ax[2].set_xlim(fc-2*Bc, fc+2*Bc)
    ax[2].set_title(f'Spectrum, Carson BW=2(df+fm)={Bc:.0f} Hz')
    ax[2].set_xlabel('f (Hz)'); ax[2].set_ylabel('dB')
    fig.tight_layout()

# Carson's rule: ~98% of FM power within 2(df+fm); wider beta -> wider occupied bandwidth.
plt.show()
`
  },

  'qpsk': {
    matlab: String.raw`% QPSK: Gray mapping, AWGN, constellation, Monte-Carlo BER vs theory
rng(1);
EbN0_dB = 0:1:10;
nBits = 2e5;                         % keep even (2 bits/symbol)
bits = randi([0 1], 1, nBits);

% Gray map bit pairs -> symbols. Pairs (b1 b0): 00,01,11,10 around the circle.
b1 = bits(1:2:end); b0 = bits(2:2:end);
I = 1 - 2*b1;                        % +/-1
Q = 1 - 2*b0;                        % +/-1
sym = (I + 1i*Q)/sqrt(2);           % unit average energy

ber = zeros(size(EbN0_dB));
for k = 1:length(EbN0_dB)
    EbN0 = 10^(EbN0_dB(k)/10);
    % Es = 2*Eb (2 bits/sym), Es=1 here -> noise var per complex dim
    N0 = 1/EbN0;                    % since Eb=Es/2=0.5, N0 = Es/(2*EbN0)... use below
    noise = sqrt(N0/2)*(randn(size(sym)) + 1i*randn(size(sym)));
    r = sym + noise;

    % Decision per quadrant
    rb1 = real(r) < 0;
    rb0 = imag(r) < 0;
    rx = zeros(1, nBits);
    rx(1:2:end) = rb1; rx(2:2:end) = rb0;
    ber(k) = mean(rx ~= bits);
end

berTheory = qfunc(sqrt(2*10.^(EbN0_dB/10)));   % Q(sqrt(2 Eb/N0))

figure; subplot(1,2,1);
r = sym + sqrt((1/10^(0.7))/2)*(randn(size(sym))+1i*randn(size(sym)));
plot(real(r(1:2000)), imag(r(1:2000)), '.'); axis equal; grid on;
title('QPSK constellation (~7 dB)'); xlabel('I'); ylabel('Q');

subplot(1,2,2);
semilogy(EbN0_dB, ber, 'o-'); hold on;
semilogy(EbN0_dB, berTheory, 'k--');
grid on; xlabel('Eb/N0 (dB)'); ylabel('BER');
legend('Monte-Carlo', 'Q(sqrt(2 Eb/N0))'); title('QPSK BER');
% Gray coding makes QPSK BER match BPSK: one bit error per symbol error typically.
`,
    python: String.raw`# QPSK: Gray mapping, AWGN, constellation, Monte-Carlo BER vs theory
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

rng = np.random.default_rng(1)
def qfunc(x): return 0.5*erfc(x/np.sqrt(2))

EbN0_dB = np.arange(0, 11)
nBits = 200000                        # even: 2 bits/symbol
bits = rng.integers(0, 2, nBits)

b1 = bits[0::2]; b0 = bits[1::2]      # Gray-coded pairs
I = 1 - 2*b1; Q = 1 - 2*b0
sym = (I + 1j*Q)/np.sqrt(2)           # unit-energy symbols

ber = []
for dB in EbN0_dB:
    EbN0 = 10**(dB/10)
    N0 = 1/EbN0                        # Es=1=2Eb -> per-symbol noise var = N0/2 per dim
    noise = np.sqrt(N0/2)*(rng.standard_normal(sym.shape) + 1j*rng.standard_normal(sym.shape))
    r = sym + noise
    rb1 = (r.real < 0).astype(int)
    rb0 = (r.imag < 0).astype(int)
    rx = np.empty(nBits, dtype=int); rx[0::2] = rb1; rx[1::2] = rb0
    ber.append(np.mean(rx != bits))

berTheory = qfunc(np.sqrt(2*10**(EbN0_dB/10)))

fig, ax = plt.subplots(1, 2, figsize=(11, 4.5))
N0 = 1/10**0.7
r = sym[:2000] + np.sqrt(N0/2)*(rng.standard_normal(2000) + 1j*rng.standard_normal(2000))
ax[0].plot(r.real, r.imag, '.', ms=2); ax[0].set_aspect('equal'); ax[0].grid(True)
ax[0].set_title('QPSK constellation (~7 dB)'); ax[0].set_xlabel('I'); ax[0].set_ylabel('Q')

ax[1].semilogy(EbN0_dB, ber, 'o-', label='Monte-Carlo')
ax[1].semilogy(EbN0_dB, berTheory, 'k--', label='Q(sqrt(2 Eb/N0))')
ax[1].grid(True, which='both'); ax[1].set_xlabel('Eb/N0 (dB)'); ax[1].set_ylabel('BER')
ax[1].legend(); ax[1].set_title('QPSK BER')
fig.tight_layout()
# Gray coding: QPSK BER equals BPSK; a symbol error usually flips just one bit.
plt.show()
`
  },

  'rrc-filter': {
    matlab: String.raw`% Root-Raised-Cosine: single RRC has ISI, RRC*RRC = raised cosine is ISI-free
beta = 0.25; sps = 8; span = 8;      % rolloff, samples/symbol, span in symbols
N = span*sps; t = (-N/2:N/2)/sps;    % time axis in symbol periods

% RRC impulse response (handle singularities)
h = zeros(size(t));
for i = 1:length(t)
    ti = t(i);
    if ti == 0
        h(i) = 1 - beta + 4*beta/pi;
    elseif abs(abs(ti) - 1/(4*beta)) < 1e-8
        h(i) = (beta/sqrt(2))*((1+2/pi)*sin(pi/(4*beta)) + (1-2/pi)*cos(pi/(4*beta)));
    else
        num = sin(pi*ti*(1-beta)) + 4*beta*ti.*cos(pi*ti*(1+beta));
        den = pi*ti.*(1 - (4*beta*ti).^2);
        h(i) = num/den;
    end
end
h = h/sqrt(sum(h.^2));               % normalize energy

rc = conv(h, h); rc = rc/max(rc);    % matched cascade = raised cosine

figure;
subplot(2,2,1); stem(t, h, '.'); title('RRC impulse response'); xlabel('symbols');
subplot(2,2,2);
Nf = 1024; f = (-Nf/2:Nf/2-1)/Nf*sps;
plot(f, 20*log10(fftshift(abs(fft(h,Nf)))+eps)); xlim([-1 1]);
title('RRC frequency response'); xlabel('f/Rs'); ylabel('dB');

% ISI check: sample RC at symbol instants -> zeros except center (Nyquist)
subplot(2,2,3);
crc = rc(1:end); tc = (-(length(rc)-1)/2:(length(rc)-1)/2)/sps;
plot(tc, crc); hold on; stem(-span:span, interp1(tc,crc,-span:span), 'r.');
title('RRC*RRC = RC: zero ISI at integer symbols'); xlabel('symbols');

% Eye diagram from a random shaped stream, matched-filtered
sym = 2*randi([0 1],1,200)-1;
up = upsample(sym, sps);
tx = conv(up, h); rx = conv(tx, h);   % transmit RRC + receive RRC
rx = rx(2*N/2+1 : end-2*N/2);         % trim transients approx
subplot(2,2,4);
for k = 1:2*sps:length(rx)-2*sps
    seg = rx(k:k+2*sps); plot((0:2*sps)/sps, seg, 'b'); hold on;
end
title('Eye diagram (open at symbol centers)'); xlabel('symbols');
`,
    python: String.raw`# Root-Raised-Cosine: single RRC has ISI; RRC*RRC = raised cosine is ISI-free
import numpy as np
import matplotlib.pyplot as plt

beta, sps, span = 0.25, 8, 8           # rolloff, samples/symbol, span (symbols)
N = span*sps
t = np.arange(-N/2, N/2 + 1)/sps       # time in symbol periods

def rrc(t, beta):
    h = np.zeros_like(t)
    for i, ti in enumerate(t):
        if abs(ti) < 1e-8:
            h[i] = 1 - beta + 4*beta/np.pi
        elif abs(abs(ti) - 1/(4*beta)) < 1e-8:
            h[i] = (beta/np.sqrt(2))*((1+2/np.pi)*np.sin(np.pi/(4*beta))
                                       + (1-2/np.pi)*np.cos(np.pi/(4*beta)))
        else:
            num = np.sin(np.pi*ti*(1-beta)) + 4*beta*ti*np.cos(np.pi*ti*(1+beta))
            den = np.pi*ti*(1 - (4*beta*ti)**2)
            h[i] = num/den
    return h/np.sqrt(np.sum(h**2))     # unit energy

h = rrc(t, beta)
rc = np.convolve(h, h); rc /= rc.max() # matched cascade = raised cosine
tc = np.arange(-(len(rc)-1)/2, (len(rc)-1)/2 + 1)/sps

fig, ax = plt.subplots(2, 2, figsize=(11, 7))
ax[0,0].stem(t, h); ax[0,0].set_title('RRC impulse response'); ax[0,0].set_xlabel('symbols')

Nf = 1024; f = np.fft.fftshift(np.fft.fftfreq(Nf))*sps
H = np.fft.fftshift(np.abs(np.fft.fft(h, Nf)))
ax[0,1].plot(f, 20*np.log10(H + 1e-12)); ax[0,1].set_xlim(-1, 1)
ax[0,1].set_title('RRC frequency response'); ax[0,1].set_xlabel('f/Rs'); ax[0,1].set_ylabel('dB')

ax[1,0].plot(tc, rc)
samp = np.arange(-span, span+1)
ax[1,0].stem(samp, np.interp(samp, tc, rc), linefmt='r', markerfmt='r.')
ax[1,0].set_title('RRC*RRC=RC: zero ISI at integer symbols'); ax[1,0].set_xlabel('symbols')

# Eye diagram: random stream, transmit RRC + matched receive RRC
rng = np.random.default_rng(0)
sym = 2*rng.integers(0, 2, 200) - 1
up = np.zeros(len(sym)*sps); up[::sps] = sym
tx = np.convolve(up, h); rx = np.convolve(tx, h)
rx = rx[2*(N//2): len(rx)-2*(N//2)]
for k in range(0, len(rx)-2*sps, 2*sps):
    ax[1,1].plot(np.arange(2*sps+1)/sps, rx[k:k+2*sps+1], 'b', lw=0.5)
ax[1,1].set_title('Eye diagram (open at symbol centers)'); ax[1,1].set_xlabel('symbols')
fig.tight_layout()
plt.show()
`
  },

  'bandwidth': {
    matlab: String.raw`% Bandwidth definitions on a spectrum: -3 dB, null-to-null, 99%% occupied
rng(0);
Rs = 1000; sps = 16; fs = Rs*sps;    % symbol rate, samples/symbol, sample rate
nSym = 4000;
sym = 2*randi([0 1],1,nSym)-1;       % BPSK symbols
up = upsample(sym, sps);
p = ones(1, sps);                    % rectangular pulse -> sinc spectrum
x = conv(up, p);

% Power spectral density via Welch-like averaging
Nf = 2048; w = hann(Nf)';
segs = floor(length(x)/Nf);
Pxx = zeros(1, Nf);
for i = 1:segs
    seg = x((i-1)*Nf+1 : i*Nf).*w;
    Pxx = Pxx + abs(fft(seg)).^2;
end
Pxx = fftshift(Pxx/segs);
f = (-Nf/2:Nf/2-1)*(fs/Nf);
PdB = 10*log10(Pxx/max(Pxx));

% -3 dB bandwidth (two-sided): find where PdB crosses -3 around center
half = f(f>=0); Phalf = PdB(f>=0);
idx3 = find(Phalf <= -3, 1); f3 = half(idx3); BW3 = 2*f3;

nullBW = 2*Rs;                        % null-to-null for rect pulse = 2*Rs

% 99% occupied bandwidth: cumulative power symmetric about DC
cp = cumsum(Pxx); cp = cp/cp(end);
loI = find(cp >= 0.005, 1); hiI = find(cp >= 0.995, 1);
occBW = f(hiI) - f(loI);

figure; plot(f, PdB); hold on; grid on;
xline([-f3 f3], 'g--'); xline([-Rs Rs], 'r--');
xline([f(loI) f(hiI)], 'm:');
xlabel('f (Hz)'); ylabel('PSD (dB)'); xlim([-3*Rs 3*Rs]);
title(sprintf('BW: -3dB=%.0f, null-null=%.0f, 99%%=%.0f Hz', BW3, nullBW, occBW));
legend('PSD', '-3 dB', 'null-null (2 Rs)', '99%% occupied');
% For a rect-pulsed stream at rate Rs the main lobe spans 2*Rs (null-to-null).
`,
    python: String.raw`# Bandwidth definitions on a spectrum: -3 dB, null-to-null, 99% occupied
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import welch

rng = np.random.default_rng(0)
Rs, sps = 1000.0, 16
fs = Rs*sps
nSym = 4000
sym = 2*rng.integers(0, 2, nSym) - 1     # BPSK symbols
up = np.zeros(nSym*sps); up[::sps] = sym
x = np.convolve(up, np.ones(sps))        # rectangular pulse shaping

f, Pxx = welch(x, fs=fs, nperseg=2048, return_onesided=False)
idx = np.argsort(f); f = f[idx]; Pxx = Pxx[idx]
PdB = 10*np.log10(Pxx/Pxx.max())

# -3 dB two-sided bandwidth
pos = f >= 0
half, Phalf = f[pos], PdB[pos]
f3 = half[np.argmax(Phalf <= -3)]
BW3 = 2*f3

nullBW = 2*Rs                            # rect pulse main lobe = 2*Rs

# 99% occupied bandwidth from cumulative power
cp = np.cumsum(Pxx); cp /= cp[-1]
loI = np.argmax(cp >= 0.005); hiI = np.argmax(cp >= 0.995)
occBW = f[hiI] - f[loI]

plt.figure(figsize=(9, 5))
plt.plot(f, PdB)
for v in (-f3, f3): plt.axvline(v, color='g', ls='--')
for v in (-Rs, Rs): plt.axvline(v, color='r', ls='--')
for v in (f[loI], f[hiI]): plt.axvline(v, color='m', ls=':')
plt.xlim(-3*Rs, 3*Rs); plt.grid(True)
plt.xlabel('f (Hz)'); plt.ylabel('PSD (dB)')
plt.title(f'BW: -3dB={BW3:.0f}, null-null={nullBW:.0f}, 99%={occBW:.0f} Hz')
plt.legend(['PSD', '-3 dB', 'null-null (2 Rs)', '99% occupied'])
# Rect-pulsed stream: main lobe null-to-null width equals 2*Rs.
plt.show()
`
  },

  'early-late-correlator': {
    matlab: String.raw`% Early-Late DLL: triangular autocorrelation, E-L discriminator S-curve, tracking
Tc = 1;                              % chip period (normalized)
d = 0.5;                             % early-late spacing (chips)

% Triangular code autocorrelation R(tau), zero beyond +/- 1 chip
R = @(tau) max(0, 1 - abs(tau)/Tc);

% S-curve: discriminator output vs true timing error
tau = -1.5:0.01:1.5;
E = R(tau + d/2); L = R(tau - d/2);
Scurve = E - L;                      % (Early - Late) power/amplitude discriminator

figure;
subplot(1,2,1); plot(tau, R(tau), 'k'); hold on;
plot(tau, E, 'g'); plot(tau, L, 'r');
legend('Prompt','Early','Late'); xlabel('timing offset (chips)');
title('Triangular autocorrelation'); grid on;

subplot(1,2,2); plot(tau, Scurve, 'b'); hold on; yline(0,'k:');
xlabel('timing error (chips)'); ylabel('E - L'); title('DLL S-curve'); grid on;

% Simulate a DLL locking timing error to zero
err = 0.8;                           % initial timing error (chips)
Kloop = 0.4;                         % loop gain
hist = zeros(1, 40);
for n = 1:40
    disc = R(err + d/2) - R(err - d/2);   % discriminator sample
    err = err - Kloop*disc;               % negative feedback drives err -> 0
    hist(n) = err;
end
figure; plot(0:39, hist, 'o-'); grid on;
xlabel('iteration'); ylabel('timing error (chips)');
title('DLL locking timing error to zero');
% The S-curve slope near zero gives negative feedback: loop pulls error to the lock point.
`,
    python: String.raw`# Early-Late DLL: triangular autocorrelation, E-L discriminator S-curve, tracking
import numpy as np
import matplotlib.pyplot as plt

Tc = 1.0                              # chip period (normalized)
d = 0.5                               # early-late spacing (chips)

def R(tau):                           # triangular code autocorrelation
    return np.maximum(0.0, 1 - np.abs(tau)/Tc)

tau = np.arange(-1.5, 1.5, 0.01)
E = R(tau + d/2); L = R(tau - d/2)
Scurve = E - L                        # (Early - Late) discriminator

fig, ax = plt.subplots(1, 2, figsize=(11, 4.5))
ax[0].plot(tau, R(tau), 'k', label='Prompt')
ax[0].plot(tau, E, 'g', label='Early'); ax[0].plot(tau, L, 'r', label='Late')
ax[0].legend(); ax[0].grid(True); ax[0].set_xlabel('timing offset (chips)')
ax[0].set_title('Triangular autocorrelation')

ax[1].plot(tau, Scurve, 'b'); ax[1].axhline(0, color='k', ls=':')
ax[1].set_xlabel('timing error (chips)'); ax[1].set_ylabel('E - L')
ax[1].set_title('DLL S-curve'); ax[1].grid(True)
fig.tight_layout()

# Simulate a DLL locking timing error to zero
err = 0.8; Kloop = 0.4; hist = []
for _ in range(40):
    disc = R(err + d/2) - R(err - d/2)    # discriminator sample
    err = err - Kloop*disc                 # negative feedback -> err to 0
    hist.append(err)

plt.figure(figsize=(7, 4))
plt.plot(range(40), hist, 'o-'); plt.grid(True)
plt.xlabel('iteration'); plt.ylabel('timing error (chips)')
plt.title('DLL locking timing error to zero')
# The S-curve slope near lock provides negative feedback that pulls the error to zero.
plt.show()
`
  },

  'polarization': {
    matlab: String.raw`% Polarization: ellipse from two orthogonal E-fields, axial ratio, loss factor
wt = linspace(0, 2*pi, 400);

cases = {'Linear (45 deg)', 1, 0;      % {name, amp ratio Ey/Ex, phase diff (rad)}
         'Circular (RHCP)', 1, pi/2;
         'Elliptical',      2, pi/3};

figure;
for c = 1:size(cases,1)
    name = cases{c,1}; ratio = cases{c,2}; delta = cases{c,3};
    Ex = cos(wt);                    % x-component (reference)
    Ey = ratio*cos(wt + delta);      % y-component with amplitude ratio and phase

    % Axial ratio from ellipse geometry (major/minor axis)
    a = 1; b = ratio;
    Emax = sqrt(0.5*((a^2+b^2) + sqrt(a^4 + b^4 + 2*a^2*b^2*cos(2*delta))));
    Emin = sqrt(0.5*((a^2+b^2) - sqrt(a^4 + b^4 + 2*a^2*b^2*cos(2*delta))));
    AR = Emax/max(Emin, 1e-9);       % axial ratio (>=1); inf for linear

    subplot(1,3,c); plot(Ex, Ey); axis equal; grid on;
    xlabel('E_x'); ylabel('E_y');
    title(sprintf('%s\nAR = %.2f', name, AR));
end

% Polarization Loss Factor between two linearly polarized antennas at angle psi
psi = linspace(0, pi/2, 100);
PLF = cos(psi).^2;                   % |rho_t . rho_r|^2 for linear polarizations
figure; plot(rad2deg(psi), PLF); grid on;
xlabel('misalignment angle (deg)'); ylabel('PLF');
title('Polarization Loss Factor (linear): cos^2(psi)');
% AR=1 -> circular; AR=inf -> linear. Cross-polarized linear antennas: PLF=0 (90 deg).
`,
    python: String.raw`# Polarization: ellipse from two orthogonal E-fields, axial ratio, loss factor
import numpy as np
import matplotlib.pyplot as plt

wt = np.linspace(0, 2*np.pi, 400)

cases = [('Linear (45 deg)', 1, 0.0),       # (name, amp ratio Ey/Ex, phase diff)
         ('Circular (RHCP)', 1, np.pi/2),
         ('Elliptical',      2, np.pi/3)]

fig, ax = plt.subplots(1, 3, figsize=(12, 4))
for c, (name, ratio, delta) in enumerate(cases):
    Ex = np.cos(wt)                    # reference x-component
    Ey = ratio*np.cos(wt + delta)      # y-component: amplitude ratio + phase

    a, b = 1.0, ratio                  # axial ratio from ellipse geometry
    root = np.sqrt(a**4 + b**4 + 2*a**2*b**2*np.cos(2*delta))
    Emax = np.sqrt(0.5*((a**2+b**2) + root))
    Emin = np.sqrt(0.5*((a**2+b**2) - root))
    AR = Emax/max(Emin, 1e-9)          # >=1; -> inf for linear

    ax[c].plot(Ex, Ey); ax[c].set_aspect('equal'); ax[c].grid(True)
    ax[c].set_xlabel('Ex'); ax[c].set_ylabel('Ey')
    ax[c].set_title(f'{name}\nAR = {AR:.2f}')
fig.tight_layout()

# Polarization Loss Factor between two linear antennas at misalignment psi
psi = np.linspace(0, np.pi/2, 100)
PLF = np.cos(psi)**2                    # |rho_t . rho_r|^2 for linear polarizations
plt.figure(figsize=(7, 4))
plt.plot(np.degrees(psi), PLF); plt.grid(True)
plt.xlabel('misalignment angle (deg)'); plt.ylabel('PLF')
plt.title('Polarization Loss Factor (linear): cos^2(psi)')
# AR=1 is circular, AR->inf is linear; cross-polarized linear antennas give PLF=0.
plt.show()
`
  }
});
