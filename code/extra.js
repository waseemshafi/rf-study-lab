// Extra teaching code (MATLAB + Python) for 9 DSP/comms topics.
// Appends runnable, commented examples to the global CONTENT_CODE map.
Object.assign(CONTENT_CODE, {
  'shannon': {
    matlab: String.raw`% Shannon capacity: C = B * log2(1 + SNR)
% Explore capacity vs SNR and vs bandwidth, and the -1.59 dB limit.
clear; clc;

% --- Capacity vs SNR (fixed bandwidth) ---
B  = 1e6;                       % bandwidth = 1 MHz
SNRdB = -20:0.5:30;             % SNR sweep in dB
SNR   = 10.^(SNRdB/10);         % linear SNR
C = B .* log2(1 + SNR);         % Shannon capacity (bits/s)

figure;
subplot(1,3,1);
plot(SNRdB, C/1e6, 'LineWidth', 1.5); grid on;
xlabel('SNR (dB)'); ylabel('Capacity (Mbit/s)');
title('Capacity vs SNR  (B = 1 MHz)');

% --- Spectral efficiency and the -1.59 dB Shannon limit ---
% As efficiency C/B -> 0, required Eb/N0 -> ln(2) = -1.59 dB.
eta = 0.01:0.01:8;              % spectral efficiency C/B (bit/s/Hz)
EbN0 = (2.^eta - 1) ./ eta;     % required Eb/N0 (linear)
subplot(1,3,2);
plot(10*log10(EbN0), eta, 'LineWidth', 1.5); grid on; hold on;
xline(-1.59, '--r', '-1.59 dB limit');
xlabel('Eb/N0 (dB)'); ylabel('Spectral efficiency (bit/s/Hz)');
title('Shannon bound');

% --- Capacity vs bandwidth at fixed total power ---
% C = B*log2(1 + P/(N0*B)); capacity saturates as B grows.
P = 1e-3; N0 = 1e-9;            % signal power and noise PSD
Bw = linspace(1e3, 5e7, 400);
Csat = Bw .* log2(1 + P ./ (N0 .* Bw));
subplot(1,3,3);
plot(Bw/1e6, Csat/1e6, 'LineWidth', 1.5); grid on;
yline(P/(N0*log(2))/1e6, '--k', 'B->inf limit');
xlabel('Bandwidth (MHz)'); ylabel('Capacity (Mbit/s)');
title('Capacity vs bandwidth (fixed power)');`,
    python: String.raw`# Shannon capacity: C = B * log2(1 + SNR)
# Explore capacity vs SNR and vs bandwidth, plus the -1.59 dB limit.
import numpy as np
import matplotlib.pyplot as plt

# --- Capacity vs SNR (fixed bandwidth) ---
B = 1e6                              # bandwidth = 1 MHz
snr_db = np.arange(-20, 30.5, 0.5)
snr = 10 ** (snr_db / 10)            # linear SNR
C = B * np.log2(1 + snr)             # capacity, bits/s

fig, ax = plt.subplots(1, 3, figsize=(14, 4))
ax[0].plot(snr_db, C / 1e6, lw=1.5)
ax[0].set(xlabel='SNR (dB)', ylabel='Capacity (Mbit/s)',
          title='Capacity vs SNR (B = 1 MHz)')
ax[0].grid(True)

# --- Spectral efficiency vs required Eb/N0 (the -1.59 dB limit) ---
# As efficiency -> 0, required Eb/N0 -> ln(2) = -1.59 dB.
eta = np.arange(0.01, 8, 0.01)       # C/B in bit/s/Hz
ebn0 = (2 ** eta - 1) / eta          # required Eb/N0 (linear)
ax[1].plot(10 * np.log10(ebn0), eta, lw=1.5)
ax[1].axvline(-1.59, ls='--', color='r', label='-1.59 dB limit')
ax[1].set(xlabel='Eb/N0 (dB)', ylabel='Spectral eff. (bit/s/Hz)',
          title='Shannon bound')
ax[1].legend(); ax[1].grid(True)

# --- Capacity vs bandwidth at fixed total power ---
P, N0 = 1e-3, 1e-9
Bw = np.linspace(1e3, 5e7, 400)
Csat = Bw * np.log2(1 + P / (N0 * Bw))
ax[2].plot(Bw / 1e6, Csat / 1e6, lw=1.5)
ax[2].axhline(P / (N0 * np.log(2)) / 1e6, ls='--', color='k',
              label='B->inf limit')
ax[2].set(xlabel='Bandwidth (MHz)', ylabel='Capacity (Mbit/s)',
          title='Capacity vs bandwidth (fixed power)')
ax[2].legend(); ax[2].grid(True)
plt.tight_layout(); plt.show()`
  },

  'source-coding': {
    matlab: String.raw`% Source coding: entropy, Huffman code, and compression ratio.
clear; clc;

symbols = {'a','b','c','d','e'};
p = [0.4 0.2 0.2 0.1 0.1];           % source probabilities (sum = 1)

% --- Entropy: H = -sum p*log2 p  (bits/symbol, the lower bound) ---
H = -sum(p .* log2(p));
fprintf('Entropy H = %.4f bits/symbol\n', H);

% --- Build a Huffman code (needs Communications Toolbox) ---
% If unavailable, this hand-built merge shows the same idea.
[dict, avglen] = huffmandict(symbols, p);
fprintf('Average Huffman length = %.4f bits/symbol\n', avglen);

% --- Show codewords ---
for k = 1:numel(symbols)
    cw = num2str(dict{k,2});
    cw(cw == ' ') = [];
    fprintf('  %s (p=%.2f) -> %s\n', symbols{k}, p(k), cw);
end

% --- Efficiency and compression ratio vs a 3-bit fixed code ---
fixedLen = ceil(log2(numel(symbols)));   % 3 bits for 5 symbols
efficiency = H / avglen;
compression = fixedLen / avglen;
fprintf('Efficiency  H/Lavg   = %.3f\n', efficiency);
fprintf('Compression vs %d-bit = %.3f x\n', fixedLen, compression);

% --- Encode a random message and check measured bit rate ---
n = 10000;
idx = randsrc(1, n, [1:numel(symbols); p]);
bits = huffmanenco(symbols(idx), dict);
fprintf('Encoded %d symbols into %d bits (%.3f bits/sym)\n', ...
        n, numel(bits), numel(bits)/n);`,
    python: String.raw`# Source coding: entropy, Huffman code, and compression ratio.
import numpy as np
import heapq

symbols = ['a', 'b', 'c', 'd', 'e']
p = np.array([0.4, 0.2, 0.2, 0.1, 0.1])   # probabilities, sum = 1

# --- Entropy: H = -sum p*log2 p  (bits/symbol, the lower bound) ---
H = -np.sum(p * np.log2(p))
print(f'Entropy H = {H:.4f} bits/symbol')

# --- Build a Huffman code with a priority queue ---
def huffman(symbols, probs):
    # heap entries: [weight, tie, {symbol: codeword}]
    heap = [[w, i, {s: ''}] for i, (s, w) in enumerate(zip(symbols, probs))]
    heapq.heapify(heap)
    tie = len(heap)
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for s in lo[2]:
            lo[2][s] = '0' + lo[2][s]     # left branch gets 0
        for s in hi[2]:
            hi[2][s] = '1' + hi[2][s]     # right branch gets 1
        merged = dict(lo[2]); merged.update(hi[2])
        heapq.heappush(heap, [lo[0] + hi[0], tie, merged]); tie += 1
    return heap[0][2]

code = huffman(symbols, p)
avglen = sum(p[i] * len(code[s]) for i, s in enumerate(symbols))
for i, s in enumerate(symbols):
    print(f'  {s} (p={p[i]:.2f}) -> {code[s]}')
print(f'Average Huffman length = {avglen:.4f} bits/symbol')

# --- Efficiency and compression vs a fixed-length code ---
fixed_len = int(np.ceil(np.log2(len(symbols))))   # 3 bits for 5 symbols
print(f'Efficiency  H/Lavg   = {H / avglen:.3f}')
print(f'Compression vs {fixed_len}-bit = {fixed_len / avglen:.3f} x')

# --- Encode a random message and measure the real bit rate ---
rng = np.random.default_rng(0)
n = 10000
msg = rng.choice(symbols, size=n, p=p)
bits = ''.join(code[s] for s in msg)
print(f'Encoded {n} symbols into {len(bits)} bits '
      f'({len(bits) / n:.3f} bits/sym)')`
  },

  'sinc-function': {
    matlab: String.raw`% The sinc function: zeros, main lobe, and its FFT duality with rect.
clear; clc;

% --- Plot normalized sinc(x) = sin(pi x)/(pi x) ---
x = -8:0.001:8;
y = sinc(x);                       % MATLAB sinc is already normalized
figure;
subplot(2,1,1);
plot(x, y, 'LineWidth', 1.2); grid on; hold on;
plot(-8:8, sinc(-8:8), 'ro');      % integer zeros (except x=0)
xline(-1, '--'); xline(1, '--');   % main-lobe edges at +/-1
xlabel('x'); ylabel('sinc(x)');
title('sinc(x): main lobe in [-1,1], zeros at nonzero integers');

% --- Duality: FFT of a rectangle is a sinc ---
N = 1024; fs = 1000;
t = (-N/2:N/2-1)/fs;
W = 0.05;                          % pulse half-width (s)
rect = double(abs(t) <= W);        % time-domain rectangle
R = fftshift(fft(ifftshift(rect)));
f = (-N/2:N/2-1)*(fs/N);
subplot(2,1,2);
plot(f, abs(R)/max(abs(R)), 'LineWidth', 1.2); grid on;
xlim([-100 100]);
xlabel('Frequency (Hz)'); ylabel('|FFT(rect)| (norm)');
title('FFT of a rectangle -> sinc  (and vice versa)');`,
    python: String.raw`# The sinc function: zeros, main lobe, and FFT duality with rect.
import numpy as np
import matplotlib.pyplot as plt

# --- Plot normalized sinc(x) = sin(pi x)/(pi x) ---
x = np.arange(-8, 8, 0.001)
y = np.sinc(x)                       # numpy sinc is normalized
fig, ax = plt.subplots(2, 1, figsize=(9, 7))
ax[0].plot(x, y, lw=1.2)
ints = np.arange(-8, 9)
ax[0].plot(ints, np.sinc(ints), 'ro')       # zeros at nonzero integers
ax[0].axvline(-1, ls='--'); ax[0].axvline(1, ls='--')  # main-lobe edges
ax[0].set(xlabel='x', ylabel='sinc(x)',
          title='sinc(x): main lobe [-1,1], zeros at nonzero integers')
ax[0].grid(True)

# --- Duality: FFT of a rectangle is a sinc ---
N, fs = 1024, 1000
t = np.arange(-N // 2, N // 2) / fs
W = 0.05                              # pulse half-width (s)
rect = (np.abs(t) <= W).astype(float) # time-domain rectangle
R = np.fft.fftshift(np.fft.fft(np.fft.ifftshift(rect)))
f = np.arange(-N // 2, N // 2) * (fs / N)
ax[1].plot(f, np.abs(R) / np.abs(R).max(), lw=1.2)
ax[1].set(xlim=(-100, 100), xlabel='Frequency (Hz)',
          ylabel='|FFT(rect)| (norm)',
          title='FFT of a rectangle -> sinc (and vice versa)')
ax[1].grid(True)
plt.tight_layout(); plt.show()`
  },

  'frequency-spectrum': {
    matlab: String.raw`% Frequency spectrum: one-sided amplitude spectrum and spectral leakage.
clear; clc;

fs = 1000;                 % sampling rate (Hz)
N  = 1024;                 % number of samples
t  = (0:N-1)/fs;

% --- Multi-tone signal (note 123.5 Hz is NOT an FFT bin -> leakage) ---
x = 1.0*sin(2*pi*100*t) + 0.5*sin(2*pi*250*t) + 0.7*sin(2*pi*123.5*t);

% --- One-sided amplitude spectrum, rectangular (no) window ---
X = fft(x);
P2 = abs(X)/N;             % two-sided magnitude
P1 = P2(1:N/2+1);          % keep 0..Nyquist
P1(2:end-1) = 2*P1(2:end-1);   % double interior bins for one-sided
f = fs*(0:N/2)/N;

% --- Same signal with a Hann window to suppress leakage ---
w  = hann(N)';
xw = x .* w;
Xw = fft(xw);
P2w = abs(Xw)/sum(w);      % normalize by window sum (coherent gain)
P1w = P2w(1:N/2+1); P1w(2:end-1) = 2*P1w(2:end-1);

figure;
subplot(2,1,1);
stem(f, P1, 'filled', 'MarkerSize', 3); grid on; xlim([0 300]);
xlabel('Frequency (Hz)'); ylabel('Amplitude');
title('One-sided spectrum (rectangular window: 123.5 Hz leaks)');
subplot(2,1,2);
stem(f, P1w, 'filled', 'MarkerSize', 3); grid on; xlim([0 300]);
xlabel('Frequency (Hz)'); ylabel('Amplitude');
title('With Hann window (leakage reduced)');`,
    python: String.raw`# Frequency spectrum: one-sided amplitude spectrum and spectral leakage.
import numpy as np
import matplotlib.pyplot as plt

fs, N = 1000, 1024               # sample rate, number of samples
t = np.arange(N) / fs

# --- Multi-tone signal; 123.5 Hz is not an exact FFT bin -> leakage ---
x = (1.0 * np.sin(2 * np.pi * 100 * t)
     + 0.5 * np.sin(2 * np.pi * 250 * t)
     + 0.7 * np.sin(2 * np.pi * 123.5 * t))

def one_sided(sig, win=None):
    if win is None:
        X = np.fft.fft(sig); norm = N
    else:
        X = np.fft.fft(sig * win); norm = win.sum()   # coherent gain
    P = np.abs(X) / norm
    P1 = P[:N // 2 + 1].copy()
    P1[1:-1] *= 2                # double interior bins for one-sided
    return P1

f = fs * np.arange(N // 2 + 1) / N
P_rect = one_sided(x)                       # rectangular window
P_hann = one_sided(x, np.hanning(N))        # Hann window

fig, ax = plt.subplots(2, 1, figsize=(9, 7))
ax[0].stem(f, P_rect, markerfmt=' ', basefmt=' ')
ax[0].set(xlim=(0, 300), xlabel='Frequency (Hz)', ylabel='Amplitude',
          title='One-sided spectrum (rect window: 123.5 Hz leaks)')
ax[0].grid(True)
ax[1].stem(f, P_hann, markerfmt=' ', basefmt=' ')
ax[1].set(xlim=(0, 300), xlabel='Frequency (Hz)', ylabel='Amplitude',
          title='With Hann window (leakage reduced)')
ax[1].grid(True)
plt.tight_layout(); plt.show()`
  },

  'fft': {
    matlab: String.raw`% Radix-2 Cooley-Tukey FFT vs built-in fft and a naive DFT.
clear; clc;

N = 1024;                       % must be a power of 2
x = randn(1, N) + 1i*randn(1, N);

% --- Recursive radix-2 FFT (divide by even/odd indices) ---
X_rec = myfft(x);
fprintf('Max error vs built-in fft: %.2e\n', max(abs(X_rec - fft(x))));

% --- Timing: naive DFT is O(N^2), FFT is O(N log N) ---
tic; myfft(x);       t_fft = toc;
n = 0:N-1;
tic; W = exp(-2i*pi*(n')*n/N); Xdft = (W*x.').'; t_dft = toc;  % O(N^2)
fprintf('Recursive FFT: %.4f s | Naive DFT: %.4f s\n', t_fft, t_dft);
fprintf('Speedup ~ %.1fx (theory N/log2 N = %.1f)\n', ...
        t_dft/t_fft, N/log2(N));

function X = myfft(x)
    N = numel(x);
    if N == 1
        X = x; return;
    end
    Xe = myfft(x(1:2:end));     % FFT of even-indexed samples
    Xo = myfft(x(2:2:end));     % FFT of odd-indexed samples
    k  = 0:N/2-1;
    tw = exp(-2i*pi*k/N);       % twiddle factors
    X  = [Xe + tw.*Xo, Xe - tw.*Xo];   % butterfly combine
end`,
    python: String.raw`# Radix-2 Cooley-Tukey FFT vs numpy.fft and a naive DFT.
import numpy as np
import time

def myfft(x):
    """Recursive radix-2 Cooley-Tukey FFT (len must be power of 2)."""
    x = np.asarray(x, dtype=complex)
    N = x.shape[0]
    if N == 1:
        return x
    Xe = myfft(x[0::2])          # FFT of even-indexed samples
    Xo = myfft(x[1::2])          # FFT of odd-indexed samples
    k = np.arange(N // 2)
    tw = np.exp(-2j * np.pi * k / N)     # twiddle factors
    return np.concatenate([Xe + tw * Xo, Xe - tw * Xo])   # butterflies

N = 1024                          # power of 2
rng = np.random.default_rng(0)
x = rng.standard_normal(N) + 1j * rng.standard_normal(N)

# --- Correctness check against numpy ---
X_rec = myfft(x)
print(f'Max error vs numpy.fft: {np.max(np.abs(X_rec - np.fft.fft(x))):.2e}')

# --- Timing: naive DFT O(N^2) vs FFT O(N log N) ---
t0 = time.perf_counter(); myfft(x); t_fft = time.perf_counter() - t0

n = np.arange(N)
t0 = time.perf_counter()
W = np.exp(-2j * np.pi * np.outer(n, n) / N)   # DFT matrix, O(N^2)
X_dft = W @ x
t_dft = time.perf_counter() - t0

print(f'Recursive FFT: {t_fft:.4f} s | Naive DFT: {t_dft:.4f} s')
print(f'Speedup ~ {t_dft / t_fft:.1f}x '
      f'(theory N/log2 N = {N / np.log2(N):.1f})')`
  },

  'fir-filters': {
    matlab: String.raw`% FIR low-pass: windowed-sinc design, impulse & magnitude response, linear phase.
clear; clc;

fs = 1000;                      % sampling rate (Hz)
fc = 100;                       % cutoff (Hz)
Ntaps = 51;                     % odd -> symmetric, exact linear phase

% --- Manual windowed-sinc design ---
n  = -(Ntaps-1)/2 : (Ntaps-1)/2;
h_ideal = 2*fc/fs * sinc(2*fc/fs * n);   % ideal LP impulse response
w  = hamming(Ntaps)';                    % Hamming window
h  = h_ideal .* w;
h  = h / sum(h);                         % unity DC gain

figure;
subplot(3,1,1);
stem(n, h, 'filled', 'MarkerSize', 3); grid on;
xlabel('Sample'); ylabel('h[n]');
title('FIR impulse response (symmetric -> linear phase)');

% --- Frequency response ---
[H, f] = freqz(h, 1, 1024, fs);
subplot(3,1,2);
plot(f, 20*log10(abs(H)+eps), 'LineWidth', 1.2); grid on;
xline(fc, '--r'); ylim([-80 5]);
xlabel('Frequency (Hz)'); ylabel('Magnitude (dB)');
title('Magnitude response');

% --- Phase is linear across the passband ---
subplot(3,1,3);
plot(f, unwrap(angle(H)), 'LineWidth', 1.2); grid on;
xlabel('Frequency (Hz)'); ylabel('Phase (rad)');
title('Phase response (straight line = constant group delay)');`,
    python: String.raw`# FIR low-pass: windowed-sinc design, impulse & magnitude response, linear phase.
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

fs, fc, Ntaps = 1000, 100, 51    # sample rate, cutoff, odd tap count

# --- Manual windowed-sinc design (symmetric -> exact linear phase) ---
n = np.arange(-(Ntaps - 1) / 2, (Ntaps - 1) / 2 + 1)
h_ideal = 2 * fc / fs * np.sinc(2 * fc / fs * n)   # ideal LP kernel
h = h_ideal * np.hamming(Ntaps)                    # apply window
h /= h.sum()                                       # unity DC gain

# (scipy.signal.firwin gives essentially the same taps)
# h = signal.firwin(Ntaps, fc, fs=fs, window='hamming')

fig, ax = plt.subplots(3, 1, figsize=(9, 9))
ax[0].stem(n, h, markerfmt=' ', basefmt=' ')
ax[0].set(xlabel='Sample', ylabel='h[n]',
          title='FIR impulse response (symmetric -> linear phase)')
ax[0].grid(True)

# --- Frequency response ---
f, H = signal.freqz(h, 1, worN=1024, fs=fs)
ax[1].plot(f, 20 * np.log10(np.abs(H) + 1e-12), lw=1.2)
ax[1].axvline(fc, ls='--', color='r'); ax[1].set(ylim=(-80, 5))
ax[1].set(xlabel='Frequency (Hz)', ylabel='Magnitude (dB)',
          title='Magnitude response')
ax[1].grid(True)

# --- Phase is linear across the passband ---
ax[2].plot(f, np.unwrap(np.angle(H)), lw=1.2)
ax[2].set(xlabel='Frequency (Hz)', ylabel='Phase (rad)',
          title='Phase response (straight line = constant group delay)')
ax[2].grid(True)
plt.tight_layout(); plt.show()`
  },

  'iir-filters': {
    matlab: String.raw`% IIR Butterworth low-pass: poles/zeros, magnitude response, tap-count vs FIR.
clear; clc;

fs = 1000;                      % sampling rate (Hz)
fc = 100;                       % cutoff (Hz)
order = 4;                      % IIR order (only a few coefficients!)

% --- Design a Butterworth low-pass ---
[b, a] = butter(order, fc/(fs/2));   % normalized cutoff (Nyquist = 1)
fprintf('IIR: %d numerator + %d denominator coeffs\n', numel(b), numel(a));

figure;
% --- Pole-zero plot: poles inside unit circle -> stable ---
subplot(1,2,1);
zplane(b, a); grid on;
title(sprintf('Poles/zeros (order %d Butterworth)', order));

% --- Magnitude response ---
[H, f] = freqz(b, a, 1024, fs);
subplot(1,2,2);
plot(f, 20*log10(abs(H)+eps), 'LineWidth', 1.2); grid on;
xline(fc, '--r'); yline(-3, '--k', '-3 dB'); ylim([-80 5]);
xlabel('Frequency (Hz)'); ylabel('Magnitude (dB)');
title('Butterworth magnitude (maximally flat passband)');

% --- Efficiency: an FIR needs many more taps for similar rolloff ---
firLen = 51;
fprintf('This IIR: ~%d coeffs vs comparable FIR: ~%d taps\n', ...
        numel(b)+numel(a), firLen);`,
    python: String.raw`# IIR Butterworth low-pass: poles/zeros, magnitude response, tap count vs FIR.
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

fs, fc, order = 1000, 100, 4     # sample rate, cutoff, IIR order

# --- Design a Butterworth low-pass ---
b, a = signal.butter(order, fc / (fs / 2))    # normalized cutoff
print(f'IIR: {len(b)} numerator + {len(a)} denominator coeffs')

z, p, _ = signal.tf2zpk(b, a)    # zeros, poles for the pole-zero plot

fig, ax = plt.subplots(1, 2, figsize=(12, 5))
# --- Pole-zero plot: poles inside the unit circle -> stable ---
theta = np.linspace(0, 2 * np.pi, 200)
ax[0].plot(np.cos(theta), np.sin(theta), 'k--', lw=0.8)   # unit circle
ax[0].plot(np.real(z), np.imag(z), 'o', mfc='none', label='zeros')
ax[0].plot(np.real(p), np.imag(p), 'x', label='poles')
ax[0].set(aspect='equal', xlabel='Real', ylabel='Imag',
          title=f'Poles/zeros (order {order} Butterworth)')
ax[0].legend(); ax[0].grid(True)

# --- Magnitude response ---
f, H = signal.freqz(b, a, worN=1024, fs=fs)
ax[1].plot(f, 20 * np.log10(np.abs(H) + 1e-12), lw=1.2)
ax[1].axvline(fc, ls='--', color='r')
ax[1].axhline(-3, ls='--', color='k')
ax[1].set(ylim=(-80, 5), xlabel='Frequency (Hz)', ylabel='Magnitude (dB)',
          title='Butterworth magnitude (maximally flat passband)')
ax[1].grid(True)
plt.tight_layout(); plt.show()

# --- Efficiency: an FIR needs many more taps for similar rolloff ---
print(f'This IIR: ~{len(b) + len(a)} coeffs vs comparable FIR: ~51 taps')`
  },

  'convolutional-codes': {
    matlab: String.raw`% Rate-1/2, K=3 convolutional encoder with generators g1=111, g2=101 (octal 7,5).
clear; clc;

msg = [1 0 1 1 0 0 1 0];       % information bits (flush handled below)
g1  = [1 1 1];                 % generator 1 (octal 7)
g2  = [1 0 1];                 % generator 2 (octal 5)

% --- Encode: state = last 2 input bits; 2 output bits per input ---
state = [0 0];                 % shift-register memory (K-1 = 2 bits)
out = [];
fprintf(' in | state | out\n');
fprintf('----+-------+-----\n');
padded = [msg 0 0];            % 2 zero bits to flush the register
for b = padded
    sr = [b state];            % current register contents [b s1 s2]
    o1 = mod(sum(sr .* g1), 2);% parity 1
    o2 = mod(sum(sr .* g2), 2);% parity 2
    fprintf('  %d |  %d%d   | %d%d\n', b, state(1), state(2), o1, o2);
    out = [out o1 o2];
    state = [b state(1)];      % shift register right
end
fprintf('\nInput  bits (%d): %s\n', numel(msg), num2str(msg));
fprintf('Output bits (%d): %s\n', numel(out), num2str(out));
fprintf('Code rate = %d/%d = 1/2\n', numel(padded), numel(out));`,
    python: String.raw`# Rate-1/2, K=3 convolutional encoder, generators g1=111, g2=101 (octal 7,5).
import numpy as np

msg = [1, 0, 1, 1, 0, 0, 1, 0]   # information bits
g1 = [1, 1, 1]                   # generator 1 (octal 7)
g2 = [1, 0, 1]                   # generator 2 (octal 5)

def parity(bits, g):
    return sum(b * gi for b, gi in zip(bits, g)) % 2

# --- Encode: state = last 2 input bits; 2 output bits per input bit ---
state = [0, 0]                   # register memory (K-1 = 2 bits)
out = []
print(' in | state | out')
print('----+-------+-----')
for b in msg + [0, 0]:           # append 2 zeros to flush the register
    sr = [b] + state             # [b s1 s2]
    o1, o2 = parity(sr, g1), parity(sr, g2)
    print(f'  {b} |  {state[0]}{state[1]}   | {o1}{o2}')
    out += [o1, o2]
    state = [b, state[0]]        # shift the register

print()
print(f'Input  bits ({len(msg)}): {msg}')
print(f'Output bits ({len(out)}): {out}')
print('Code rate = 1/2 (2 output bits per input bit)')`
  },

  'channel-coding': {
    matlab: String.raw`% Channel coding: BER with/without a rate-1/3 repetition code over a BSC.
clear; clc;

N = 200000;                    % information bits per point
pvec = logspace(-3, -0.5, 12); % channel crossover probabilities
berU = zeros(size(pvec));      % uncoded BER
berC = zeros(size(pvec));      % coded BER (majority vote of 3)

for i = 1:numel(pvec)
    p = pvec(i);
    bits = randi([0 1], 1, N);

    % --- Uncoded: send each bit once through the BSC ---
    rxU = xor(bits, rand(1, N) < p);
    berU(i) = mean(rxU ~= bits);

    % --- Coded: repeat x3, flip in channel, majority-vote decode ---
    tx = repmat(bits, 3, 1);                 % 3 copies per bit
    rx = xor(tx, rand(3, N) < p);            % independent BSC on each
    dec = sum(rx, 1) >= 2;                   % majority vote
    berC(i) = mean(dec ~= bits);
end

figure;
loglog(pvec, berU, 'o-', pvec, berC, 's-', 'LineWidth', 1.4); grid on;
legend('Uncoded', 'Repetition (3,1)', 'Location', 'northwest');
xlabel('Channel crossover prob p'); ylabel('Bit error rate');
title('Coding gain: majority-vote repetition code over a BSC');`,
    python: String.raw`# Channel coding: BER with/without a rate-1/3 repetition code over a BSC.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
N = 200000                       # information bits per point
pvec = np.logspace(-3, -0.5, 12) # channel crossover probabilities
ber_u, ber_c = [], []

for p in pvec:
    bits = rng.integers(0, 2, N)

    # --- Uncoded: each bit once through the BSC ---
    rx_u = bits ^ (rng.random(N) < p)
    ber_u.append(np.mean(rx_u != bits))

    # --- Coded: repeat x3, flip in channel, majority-vote decode ---
    tx = np.tile(bits, (3, 1))               # 3 copies per bit
    rx = tx ^ (rng.random((3, N)) < p)       # independent BSC per copy
    dec = (rx.sum(axis=0) >= 2).astype(int)  # majority vote
    ber_c.append(np.mean(dec != bits))

plt.figure(figsize=(8, 5))
plt.loglog(pvec, ber_u, 'o-', label='Uncoded')
plt.loglog(pvec, ber_c, 's-', label='Repetition (3,1)')
plt.xlabel('Channel crossover prob p'); plt.ylabel('Bit error rate')
plt.title('Coding gain: majority-vote repetition code over a BSC')
plt.legend(loc='upper left'); plt.grid(True, which='both')
plt.tight_layout(); plt.show()`
  }
});
