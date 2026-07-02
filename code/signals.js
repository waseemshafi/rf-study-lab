// DSP teaching code: MATLAB + Python scripts for 7 core signals/systems topics.
// Registered onto the global CONTENT_CODE map.
Object.assign(CONTENT_CODE, {
  'fourier-transform': {
    matlab: String.raw`% Fourier Transform: FFT of a signal, magnitude spectrum, Parseval check
Fs = 1000;              % sampling rate (Hz)
N  = 1024;              % number of samples
t  = (0:N-1)/Fs;        % time vector

% Build a signal: sum of two sines (50 Hz and 120 Hz)
x = 1.0*sin(2*pi*50*t) + 0.5*sin(2*pi*120*t);

% FFT and one-sided magnitude spectrum
X  = fft(x);
f  = (0:N-1)*(Fs/N);            % frequency bins
mag = abs(X)/N;                 % normalized magnitude
half = 1:floor(N/2)+1;         % positive frequencies

figure;
subplot(2,1,1);
plot(t, x); xlim([0 0.1]);
xlabel('Time (s)'); ylabel('Amplitude'); title('Time-domain signal');

subplot(2,1,2);
plot(f(half), 2*mag(half));    % x2 for one-sided energy
xlabel('Frequency (Hz)'); ylabel('|X(f)|'); title('Magnitude spectrum');

% Parseval's theorem: energy in time == energy in frequency
E_time = sum(abs(x).^2);
E_freq = sum(abs(X).^2)/N;
fprintf('Parseval: time=%.4f  freq=%.4f  (should match)\n', E_time, E_freq);
`,
    python: String.raw`# Fourier Transform: FFT of a signal, magnitude spectrum, Parseval check
import numpy as np
import matplotlib.pyplot as plt

Fs = 1000            # sampling rate (Hz)
N  = 1024            # number of samples
t  = np.arange(N)/Fs

# Build a signal: sum of two sines (50 Hz and 120 Hz)
x = 1.0*np.sin(2*np.pi*50*t) + 0.5*np.sin(2*np.pi*120*t)

# FFT and one-sided magnitude spectrum
X    = np.fft.fft(x)
f    = np.arange(N)*(Fs/N)      # frequency bins
mag  = np.abs(X)/N              # normalized magnitude
half = slice(0, N//2 + 1)      # positive frequencies

fig, ax = plt.subplots(2, 1, figsize=(8, 6))
ax[0].plot(t, x); ax[0].set_xlim(0, 0.1)
ax[0].set_xlabel('Time (s)'); ax[0].set_ylabel('Amplitude')
ax[0].set_title('Time-domain signal')

ax[1].plot(f[half], 2*mag[half])   # x2 for one-sided energy
ax[1].set_xlabel('Frequency (Hz)'); ax[1].set_ylabel('|X(f)|')
ax[1].set_title('Magnitude spectrum')
plt.tight_layout()

# Parseval's theorem: energy in time == energy in frequency
E_time = np.sum(np.abs(x)**2)
E_freq = np.sum(np.abs(X)**2)/N
print(f'Parseval: time={E_time:.4f}  freq={E_freq:.4f}  (should match)')
plt.show()
`
  },

  'laplace-transform': {
    matlab: String.raw`% Laplace Transform: transfer function H(s), pole-zero map, step & impulse response
% Second-order system: H(s) = wn^2 / (s^2 + 2*zeta*wn*s + wn^2)
wn   = 2*pi*5;      % natural frequency (rad/s)
zeta = 0.3;         % damping ratio (0<zeta<1 -> underdamped, stable)

num = wn^2;
den = [1, 2*zeta*wn, wn^2];
H = tf(num, den);

% Poles determine stability: real part < 0 => stable
p = roots(den);
fprintf('Poles:\n'); disp(p);
if all(real(p) < 0)
    fprintf('All poles in left half-plane -> STABLE\n');
else
    fprintf('A pole in right half-plane -> UNSTABLE\n');
end

figure;
subplot(1,2,1);
pzmap(H); title('Pole-Zero map');   % poles marked x, must be in LHP

subplot(2,2,2);
impulse(H); title('Impulse response');

subplot(2,2,4);
step(H); title('Step response');
`,
    python: String.raw`# Laplace Transform: transfer function H(s), pole-zero map, step & impulse response
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Second-order system: H(s) = wn^2 / (s^2 + 2*zeta*wn*s + wn^2)
wn   = 2*np.pi*5     # natural frequency (rad/s)
zeta = 0.3           # damping ratio (0<zeta<1 -> underdamped, stable)

num = [wn**2]
den = [1, 2*zeta*wn, wn**2]
H = signal.TransferFunction(num, den)

# Poles determine stability: real part < 0 => stable
poles = np.roots(den)
print('Poles:', poles)
print('STABLE' if np.all(poles.real < 0) else 'UNSTABLE',
      '(poles in left half-plane => stable)')

t_imp, y_imp = signal.impulse(H)
t_stp, y_stp = signal.step(H)

fig, ax = plt.subplots(1, 3, figsize=(12, 4))
# Pole-zero map: x = poles, o = zeros; left half-plane is stable
ax[0].axvline(0, color='k', lw=0.5); ax[0].axhline(0, color='k', lw=0.5)
ax[0].plot(poles.real, poles.imag, 'x', ms=10, mew=2, label='poles')
ax[0].set_title('Pole-Zero map (s-plane)')
ax[0].set_xlabel('Real'); ax[0].set_ylabel('Imag'); ax[0].grid(True)

ax[1].plot(t_imp, y_imp); ax[1].set_title('Impulse response'); ax[1].set_xlabel('t (s)')
ax[2].plot(t_stp, y_stp); ax[2].set_title('Step response');    ax[2].set_xlabel('t (s)')
plt.tight_layout()
plt.show()
`
  },

  'z-transform': {
    matlab: String.raw`% Z-Transform: one-pole digital filter H(z), z-plane, impulse response
% H(z) = b0 / (1 - a*z^-1)  -> difference eq: y[n] = b0*x[n] + a*y[n-1]
a  = 0.8;      % pole location (|a|<1 => inside unit circle => stable)
b0 = 1 - a;    % normalize DC gain to 1

b = b0;
den = [1, -a];

% Poles/zeros
pol = roots(den);
fprintf('Pole at z = %.3f  (|z|=%.3f)\n', pol, abs(pol));
if all(abs(pol) < 1)
    fprintf('Pole inside unit circle -> STABLE\n');
else
    fprintf('Pole on/outside unit circle -> UNSTABLE\n');
end

% Impulse response (should decay for a stable filter)
n = 0:30;
h = filter(b, den, [1 zeros(1,30)]);

figure;
subplot(1,2,1);
zplane(b, den); title('z-plane (poles x, unit circle)');  % pole must be inside

subplot(1,2,2);
stem(n, h, 'filled'); xlabel('n'); ylabel('h[n]');
title('Impulse response (decays)');
`,
    python: String.raw`# Z-Transform: one-pole digital filter H(z), z-plane, impulse response
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# H(z) = b0 / (1 - a*z^-1)  -> y[n] = b0*x[n] + a*y[n-1]
a  = 0.8            # pole location (|a|<1 => inside unit circle => stable)
b0 = 1 - a         # normalize DC gain to 1

b   = [b0]
den = [1, -a]

# Poles/zeros
poles = np.roots(den)
print(f'Pole at z = {poles[0]:.3f}  (|z| = {abs(poles[0]):.3f})')
print('STABLE' if np.all(np.abs(poles) < 1) else 'UNSTABLE',
      '(pole inside unit circle => stable)')

# Impulse response (decays for a stable filter)
n = np.arange(31)
imp = np.zeros(31); imp[0] = 1
h = signal.lfilter(b, den, imp)

fig, ax = plt.subplots(1, 2, figsize=(10, 4))
# z-plane: unit circle + poles/zeros
theta = np.linspace(0, 2*np.pi, 200)
ax[0].plot(np.cos(theta), np.sin(theta), 'k--', lw=1)   # unit circle
ax[0].plot(poles.real, poles.imag, 'x', ms=10, mew=2, label='pole')
ax[0].set_aspect('equal'); ax[0].grid(True)
ax[0].set_title('z-plane'); ax[0].set_xlabel('Real'); ax[0].set_ylabel('Imag')
ax[0].legend()

ax[1].stem(n, h)
ax[1].set_title('Impulse response (decays)'); ax[1].set_xlabel('n'); ax[1].set_ylabel('h[n]')
plt.tight_layout()
plt.show()
`
  },

  'convolution': {
    matlab: String.raw`% Convolution: rect * rect -> triangle (flip-and-slide)
% Two rectangular pulses; their convolution is a triangle.
x = ones(1,20);     % rect pulse, length 20
h = ones(1,20);     % rect pulse, length 20

% Built-in convolution
y = conv(x, h);     % length = length(x)+length(h)-1

% Manual convolution to show the flip-and-slide sum:
%   y[n] = sum_k x[k]*h[n-k]  (h is flipped, then slid across x)
Ly = length(x)+length(h)-1;
ym = zeros(1, Ly);
for n = 1:Ly
    s = 0;
    for k = 1:length(x)
        idx = n - k + 1;              % index into flipped/shifted h
        if idx >= 1 && idx <= length(h)
            s = s + x(k)*h(idx);
        end
    end
    ym(n) = s;
end
fprintf('Manual vs conv max diff: %.3g\n', max(abs(ym - y)));

figure;
subplot(3,1,1); stem(x,'filled'); title('x[n] (rect)');
subplot(3,1,2); stem(h,'filled'); title('h[n] (rect)');
subplot(3,1,3); stem(y,'filled'); title('y = x * h (triangle)');
xlabel('n');
`,
    python: String.raw`# Convolution: rect * rect -> triangle (flip-and-slide)
import numpy as np
import matplotlib.pyplot as plt

# Two rectangular pulses; their convolution is a triangle.
x = np.ones(20)      # rect pulse, length 20
h = np.ones(20)      # rect pulse, length 20

# Built-in convolution
y = np.convolve(x, h)   # length = len(x)+len(h)-1

# Manual convolution to show the flip-and-slide sum:
#   y[n] = sum_k x[k]*h[n-k]  (h is flipped, then slid across x)
Ly = len(x) + len(h) - 1
ym = np.zeros(Ly)
for n in range(Ly):
    s = 0.0
    for k in range(len(x)):
        idx = n - k                      # index into flipped/shifted h
        if 0 <= idx < len(h):
            s += x[k]*h[idx]
    ym[n] = s
print('Manual vs np.convolve max diff:', np.max(np.abs(ym - y)))

fig, ax = plt.subplots(3, 1, figsize=(8, 6))
ax[0].stem(x);            ax[0].set_title('x[n] (rect)')
ax[1].stem(h);            ax[1].set_title('h[n] (rect)')
ax[2].stem(y);            ax[2].set_title('y = x * h (triangle)'); ax[2].set_xlabel('n')
plt.tight_layout()
plt.show()
`
  },

  'correlation': {
    matlab: String.raw`% Correlation: find a delay via cross-correlation; also autocorrelation
Fs = 500; N = 256;
t = (0:N-1)/Fs;

% Reference signal: a short chirp-like burst
s = sin(2*pi*20*t) .* exp(-((t-0.15)/0.05).^2);

% Delayed + noisy copy: shift by known lag, add noise
lag_true = 40;                       % samples of delay
sd = [zeros(1,lag_true), s(1:end-lag_true)];
y  = sd + 0.5*randn(1, N);           % noisy received signal

% Cross-correlation finds the lag as the peak location
[c, lags] = xcorr(y, s);
[~, k] = max(c);
lag_est = lags(k);
fprintf('True lag = %d, estimated lag = %d samples\n', lag_true, lag_est);

% Autocorrelation of s: peak at zero lag
[ac, aclags] = xcorr(s);

figure;
subplot(3,1,1); plot(t, s);  title('Reference s[n]');
subplot(3,1,2); plot(t, y);  title('Noisy delayed copy y[n]');
subplot(3,1,3); plot(lags, c); hold on;
xline(lag_est,'r--'); title(sprintf('Cross-corr peak at lag %d', lag_est));
xlabel('Lag (samples)');
`,
    python: String.raw`# Correlation: find a delay via cross-correlation; also autocorrelation
import numpy as np
import matplotlib.pyplot as plt

Fs = 500; N = 256
t = np.arange(N)/Fs

# Reference signal: a short Gaussian-windowed burst
s = np.sin(2*np.pi*20*t) * np.exp(-((t-0.15)/0.05)**2)

# Delayed + noisy copy: shift by a known lag, add noise
lag_true = 40                                   # samples of delay
sd = np.concatenate([np.zeros(lag_true), s[:N-lag_true]])
rng = np.random.default_rng(0)
y = sd + 0.5*rng.standard_normal(N)             # noisy received signal

# Cross-correlation finds the lag as the peak location
c = np.correlate(y, s, mode='full')
lags = np.arange(-N+1, N)
lag_est = lags[np.argmax(c)]
print(f'True lag = {lag_true}, estimated lag = {lag_est} samples')

# Autocorrelation of s: peak at zero lag
ac = np.correlate(s, s, mode='full')

fig, ax = plt.subplots(3, 1, figsize=(8, 7))
ax[0].plot(t, s);  ax[0].set_title('Reference s[n]')
ax[1].plot(t, y);  ax[1].set_title('Noisy delayed copy y[n]')
ax[2].plot(lags, c); ax[2].axvline(lag_est, color='r', ls='--')
ax[2].set_title(f'Cross-corr peak at lag {lag_est}'); ax[2].set_xlabel('Lag (samples)')
plt.tight_layout()
plt.show()
`
  },

  'nyquist-sampling': {
    matlab: String.raw`% Nyquist Sampling: sample above vs below Nyquist, reconstruct via sinc interp
f0 = 8;                 % signal frequency (Hz)
% Nyquist rate = 2*f0 = 16 Hz. Sample above and below it.
Fs_ok  = 40;            % well above Nyquist -> good
Fs_bad = 12;            % below Nyquist (< 2*f0) -> aliased reconstruction

tc = linspace(0, 1, 2000);          % "continuous" reference
xc = sin(2*pi*f0*tc);

reconstruct = @(Fs) deal_recon(f0, Fs, tc);

figure;
for i = 1:2
    if i==1, Fs = Fs_ok; ttl='Fs=40 Hz (> Nyquist)';
    else,    Fs = Fs_bad; ttl='Fs=12 Hz (< Nyquist)'; end
    n  = 0:1/Fs:1;                   % sample instants
    xn = sin(2*pi*f0*n);            % samples
    % Whittaker-Shannon sinc reconstruction
    xr = zeros(size(tc));
    for k = 1:length(n)
        xr = xr + xn(k)*sinc(Fs*(tc - n(k)));
    end
    subplot(2,1,i);
    plot(tc, xc, 'b'); hold on;
    stem(n, xn, 'r','filled');
    plot(tc, xr, 'g--');
    title(ttl); legend('original','samples','reconstructed');
end
xlabel('Time (s)');

function out = deal_recon(~,~,~)
    out = [];   % placeholder (reconstruction done inline above)
end
`,
    python: String.raw`# Nyquist Sampling: sample above vs below Nyquist, reconstruct via sinc interp
import numpy as np
import matplotlib.pyplot as plt

f0 = 8               # signal frequency (Hz); Nyquist rate = 2*f0 = 16 Hz
tc = np.linspace(0, 1, 2000)      # "continuous" reference
xc = np.sin(2*np.pi*f0*tc)

def sinc_reconstruct(Fs):
    n  = np.arange(0, 1, 1/Fs)     # sample instants
    xn = np.sin(2*np.pi*f0*n)      # samples
    # Whittaker-Shannon interpolation: sum of shifted sincs
    xr = np.zeros_like(tc)
    for k in range(len(n)):
        xr += xn[k]*np.sinc(Fs*(tc - n[k]))
    return n, xn, xr

fig, ax = plt.subplots(2, 1, figsize=(9, 6))
for i, (Fs, ttl) in enumerate([(40, 'Fs=40 Hz (> Nyquist)'),
                               (12, 'Fs=12 Hz (< Nyquist)')]):
    n, xn, xr = sinc_reconstruct(Fs)
    ax[i].plot(tc, xc, 'b', label='original')
    ax[i].stem(n, xn, linefmt='r', markerfmt='ro', basefmt=' ', label='samples')
    ax[i].plot(tc, xr, 'g--', label='reconstructed')
    ax[i].set_title(ttl); ax[i].legend(loc='upper right')
ax[1].set_xlabel('Time (s)')
plt.tight_layout()
plt.show()
`
  },

  'aliasing': {
    matlab: String.raw`% Aliasing: sample a high-frequency sine too slowly -> low-frequency alias
f0 = 90;            % true signal frequency (Hz)
Fs = 100;           % sampling rate (Hz); Nyquist = 50 Hz, so f0 > Nyquist

% Alias frequency: fold f0 into [0, Fs/2]
k = round(f0/Fs);
falias = abs(f0 - k*Fs);
fprintf('True f = %d Hz, Fs = %d Hz -> alias appears at %d Hz\n', f0, Fs, falias);

% "Continuous" signal vs the samples
tc = linspace(0, 0.1, 5000);
xc = sin(2*pi*f0*tc);
n  = 0:1/Fs:0.1;
xn = sin(2*pi*f0*n);

% The samples also lie on the low-frequency alias sine
xalias = sin(2*pi*falias*tc);

figure;
plot(tc, xc, 'b'); hold on;
plot(tc, xalias, 'g--', 'LineWidth', 1.5);
stem(n, xn, 'r', 'filled');
legend('true 90 Hz', sprintf('alias %d Hz', falias), 'samples');
xlabel('Time (s)'); ylabel('Amplitude');
title('Undersampling creates a low-frequency alias');
`,
    python: String.raw`# Aliasing: sample a high-frequency sine too slowly -> low-frequency alias
import numpy as np
import matplotlib.pyplot as plt

f0 = 90             # true signal frequency (Hz)
Fs = 100            # sampling rate (Hz); Nyquist = 50 Hz, so f0 > Nyquist

# Alias frequency: fold f0 into [0, Fs/2]
k = round(f0/Fs)
falias = abs(f0 - k*Fs)
print(f'True f = {f0} Hz, Fs = {Fs} Hz -> alias appears at {falias} Hz')

# "Continuous" signal vs the samples
tc = np.linspace(0, 0.1, 5000)
xc = np.sin(2*np.pi*f0*tc)
n  = np.arange(0, 0.1, 1/Fs)
xn = np.sin(2*np.pi*f0*n)

# The samples also lie on the low-frequency alias sine
xalias = np.sin(2*np.pi*falias*tc)

plt.figure(figsize=(9, 4))
plt.plot(tc, xc, 'b', label='true 90 Hz')
plt.plot(tc, xalias, 'g--', lw=1.5, label=f'alias {falias} Hz')
plt.stem(n, xn, linefmt='r', markerfmt='ro', basefmt=' ', label='samples')
plt.legend(loc='upper right')
plt.xlabel('Time (s)'); plt.ylabel('Amplitude')
plt.title('Undersampling creates a low-frequency alias')
plt.tight_layout()
plt.show()
`
  }
});
