// RF/DSP fundamentals: runnable MATLAB + Python teaching snippets for each topic id.
Object.assign(CONTENT_CODE, {
  'comm-basics': {
    matlab: String.raw`% comm-basics: Shannon-Hartley capacity C = B*log2(1+SNR)
% Illustrates the bandwidth/power (SNR) tradeoff for reliable communication.

clear; clc;

B = 1e6;                         % channel bandwidth [Hz] (1 MHz)
snr_dB = -10:0.5:30;             % SNR sweep in dB
snr_lin = 10.^(snr_dB/10);       % linear SNR

C = B .* log2(1 + snr_lin);      % capacity [bits/s]

% Spectral efficiency (bits/s/Hz) is capacity normalized by bandwidth
eta = C / B;

figure;
subplot(2,1,1);
plot(snr_dB, C/1e6, 'LineWidth', 1.6); grid on;
xlabel('SNR [dB]'); ylabel('Capacity [Mbit/s]');
title('Shannon capacity vs SNR for B = 1 MHz');

% Bandwidth/power tradeoff: to hit a fixed rate, more B lets you use less SNR.
target_rate = 5e6;               % 5 Mbit/s target
Bsweep = (1:0.1:10)*1e6;         % bandwidth sweep [Hz]
% Solve C=target for required SNR: SNR = 2^(R/B) - 1
snr_req = 2.^(target_rate ./ Bsweep) - 1;

subplot(2,1,2);
plot(Bsweep/1e6, 10*log10(snr_req), 'r', 'LineWidth', 1.6); grid on;
xlabel('Bandwidth [MHz]'); ylabel('Required SNR [dB]');
title('Power/bandwidth tradeoff to reach 5 Mbit/s');

fprintf('At SNR=10 dB, capacity = %.2f Mbit/s\n', ...
        B*log2(1+10)/1e6);
fprintf('Spectral efficiency at 20 dB = %.2f bits/s/Hz\n', ...
        log2(1+100));`,
    python: String.raw`# comm-basics: Shannon-Hartley capacity C = B*log2(1+SNR)
# Illustrates the bandwidth/power (SNR) tradeoff for reliable communication.

import numpy as np
import matplotlib.pyplot as plt

B = 1e6                          # channel bandwidth [Hz] (1 MHz)
snr_dB = np.arange(-10, 30.5, 0.5)
snr_lin = 10 ** (snr_dB / 10)    # linear SNR

C = B * np.log2(1 + snr_lin)     # capacity [bits/s]
eta = C / B                      # spectral efficiency [bits/s/Hz]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7, 7))

ax1.plot(snr_dB, C / 1e6, lw=1.6)
ax1.set_xlabel('SNR [dB]'); ax1.set_ylabel('Capacity [Mbit/s]')
ax1.set_title('Shannon capacity vs SNR for B = 1 MHz'); ax1.grid(True)

# Bandwidth/power tradeoff: to hit a fixed rate, more B lets you use less SNR.
target_rate = 5e6                # 5 Mbit/s target
Bsweep = np.arange(1, 10.1, 0.1) * 1e6
snr_req = 2 ** (target_rate / Bsweep) - 1   # required SNR (linear)

ax2.plot(Bsweep / 1e6, 10 * np.log10(snr_req), 'r', lw=1.6)
ax2.set_xlabel('Bandwidth [MHz]'); ax2.set_ylabel('Required SNR [dB]')
ax2.set_title('Power/bandwidth tradeoff to reach 5 Mbit/s'); ax2.grid(True)

plt.tight_layout()
plt.show()

print('At SNR=10 dB, capacity = %.2f Mbit/s' % (B * np.log2(1 + 10) / 1e6))
print('Spectral efficiency at 20 dB = %.2f bits/s/Hz' % np.log2(1 + 100))`
  },
  'noise': {
    matlab: String.raw`% noise: generate AWGN and verify its statistics against theory.
% Thermal noise power in a bandwidth B is P = k*T*B (= N0*B).

clear; clc;

k  = 1.380649e-23;   % Boltzmann constant [J/K]
T  = 290;            % system temperature [K]
B  = 1e6;            % noise bandwidth [Hz]
N  = 200000;         % number of samples

N0 = k * T;                 % noise power spectral density [W/Hz]
Pn = N0 * B;                % expected noise power (variance) [W]
sigma = sqrt(Pn);           % standard deviation of voltage samples

% Real-valued AWGN with the target variance
noise = sigma * randn(1, N);

meas_var = var(noise);
fprintf('Expected noise power kTB = %.3e W\n', Pn);
fprintf('Measured sample variance = %.3e W\n', meas_var);
fprintf('Ratio (meas/theory)      = %.4f\n', meas_var/Pn);

% Add a known signal to demonstrate SNR
A = 5 * sigma;                       % signal amplitude
Ps = A^2 / 2;                        % power of a sinusoid amplitude A
t  = (0:N-1) / (2*B);
sig = A * sin(2*pi*1e5*t);
rx  = sig + noise;
SNR_dB = 10*log10(Ps / meas_var);
fprintf('SNR = %.2f dB\n', SNR_dB);

% Compare histogram of noise to the ideal Gaussian PDF
figure;
histogram(noise, 60, 'Normalization', 'pdf'); hold on;
x = linspace(min(noise), max(noise), 300);
pdf = (1/(sigma*sqrt(2*pi))) * exp(-x.^2/(2*sigma^2));
plot(x, pdf, 'r', 'LineWidth', 1.8);
grid on; xlabel('Amplitude [V]'); ylabel('Probability density');
title('AWGN histogram vs Gaussian PDF'); legend('samples','Gaussian');`,
    python: String.raw`# noise: generate AWGN and verify its statistics against theory.
# Thermal noise power in a bandwidth B is P = k*T*B (= N0*B).

import numpy as np
import matplotlib.pyplot as plt

k  = 1.380649e-23   # Boltzmann constant [J/K]
T  = 290            # system temperature [K]
B  = 1e6            # noise bandwidth [Hz]
N  = 200000         # number of samples

N0 = k * T          # noise PSD [W/Hz]
Pn = N0 * B         # expected noise power (variance) [W]
sigma = np.sqrt(Pn)

rng = np.random.default_rng(0)
noise = sigma * rng.standard_normal(N)

meas_var = np.var(noise)
print('Expected noise power kTB = %.3e W' % Pn)
print('Measured sample variance = %.3e W' % meas_var)
print('Ratio (meas/theory)      = %.4f' % (meas_var / Pn))

# Add a known signal to demonstrate SNR
A = 5 * sigma                 # signal amplitude
Ps = A ** 2 / 2               # power of a sinusoid of amplitude A
t = np.arange(N) / (2 * B)
sig = A * np.sin(2 * np.pi * 1e5 * t)
rx = sig + noise
SNR_dB = 10 * np.log10(Ps / meas_var)
print('SNR = %.2f dB' % SNR_dB)

# Compare histogram of noise to the ideal Gaussian PDF
plt.figure(figsize=(7, 4))
plt.hist(noise, bins=60, density=True, alpha=0.6, label='samples')
x = np.linspace(noise.min(), noise.max(), 300)
pdf = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-x ** 2 / (2 * sigma ** 2))
plt.plot(x, pdf, 'r', lw=1.8, label='Gaussian')
plt.grid(True); plt.xlabel('Amplitude [V]'); plt.ylabel('Probability density')
plt.title('AWGN histogram vs Gaussian PDF'); plt.legend()
plt.tight_layout(); plt.show()`
  },
  'psd': {
    matlab: String.raw`% psd: estimate the power spectral density of a tone buried in noise.
% Also demonstrates Wiener-Khinchin: PSD = FFT of the autocorrelation.

clear; clc;

fs = 10e3;             % sample rate [Hz]
N  = 8192;             % number of samples
t  = (0:N-1)/fs;

f0 = 1200;            % tone frequency [Hz]
A  = 1.0;            % tone amplitude
tone  = A*sin(2*pi*f0*t);
noise = 0.5*randn(1, N);
x = tone + noise;

% --- Method 1: periodogram (direct FFT-based PSD estimate) ---
X = fft(x);
Pxx = (1/(fs*N)) * abs(X).^2;      % one-sided scaling handled below
Pxx = Pxx(1:N/2+1);
Pxx(2:end-1) = 2*Pxx(2:end-1);     % fold negative frequencies
f = (0:N/2)*(fs/N);

% --- Method 2: Wiener-Khinchin via autocorrelation ---
r = xcorr(x, 'biased');            % autocorrelation estimate
Sww = abs(fft(ifftshift(r)));      % FFT of autocorr -> PSD (unnormalized)
Sww = Sww(1:N/2+1);
fw  = (0:N/2)*(fs/length(r));

figure;
subplot(2,1,1);
plot(f, 10*log10(Pxx+eps), 'LineWidth', 1.2); grid on;
xlabel('Frequency [Hz]'); ylabel('PSD [dB/Hz]');
title('Periodogram of tone + noise');

subplot(2,1,2);
plot(fw, 10*log10(Sww/max(Sww)+eps), 'r', 'LineWidth', 1.2); grid on;
xlabel('Frequency [Hz]'); ylabel('Normalized PSD [dB]');
title('Wiener-Khinchin: FFT of autocorrelation');

% Verify Parseval: signal power should match integral of PSD
fprintf('Time-domain power  = %.4f\n', mean(x.^2));
fprintf('Integrated PSD     = %.4f\n', trapz(f, Pxx));`,
    python: String.raw`# psd: estimate the power spectral density of a tone buried in noise.
# Also demonstrates Wiener-Khinchin: PSD = FFT of the autocorrelation.

import numpy as np
import matplotlib.pyplot as plt

fs = 10e3            # sample rate [Hz]
N  = 8192            # number of samples
t  = np.arange(N) / fs

f0 = 1200.0          # tone frequency [Hz]
A  = 1.0             # tone amplitude
tone = A * np.sin(2 * np.pi * f0 * t)
rng = np.random.default_rng(1)
noise = 0.5 * rng.standard_normal(N)
x = tone + noise

# --- Method 1: periodogram (direct FFT-based PSD estimate) ---
X = np.fft.rfft(x)
Pxx = (1.0 / (fs * N)) * np.abs(X) ** 2
Pxx[1:-1] *= 2                       # fold negative frequencies (one-sided)
f = np.fft.rfftfreq(N, 1 / fs)

# --- Method 2: Wiener-Khinchin via autocorrelation ---
r = np.correlate(x, x, mode='full') / N      # biased autocorrelation
Sww = np.abs(np.fft.rfft(np.fft.ifftshift(r)))
fw = np.fft.rfftfreq(len(r), 1 / fs)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7, 7))
ax1.plot(f, 10 * np.log10(Pxx + 1e-20), lw=1.2)
ax1.set_xlabel('Frequency [Hz]'); ax1.set_ylabel('PSD [dB/Hz]')
ax1.set_title('Periodogram of tone + noise'); ax1.grid(True)

ax2.plot(fw, 10 * np.log10(Sww / Sww.max() + 1e-20), 'r', lw=1.2)
ax2.set_xlabel('Frequency [Hz]'); ax2.set_ylabel('Normalized PSD [dB]')
ax2.set_title('Wiener-Khinchin: FFT of autocorrelation'); ax2.grid(True)

plt.tight_layout(); plt.show()

# Verify Parseval: signal power should match integral of PSD
print('Time-domain power = %.4f' % np.mean(x ** 2))
print('Integrated PSD    = %.4f' % np.trapz(Pxx, f))`
  },
  'noise-floor': {
    matlab: String.raw`% noise-floor: thermal noise floor and receiver sensitivity.
% Floor[dBm] = -174 + 10*log10(B) + NF, referenced to 290 K (kTB).

clear; clc;

kTB_dBm_1Hz = -174;      % thermal noise density at 290K [dBm/Hz]
NF = 6;                  % receiver noise figure [dB]
SNR_req = 10;            % SNR needed to demodulate [dB]

% Sweep bandwidth from 1 kHz to 100 MHz
B = logspace(3, 8, 200);            % [Hz]
floor_dBm = kTB_dBm_1Hz + 10*log10(B) + NF;

% Sensitivity = minimum detectable signal for the required SNR
sensitivity_dBm = floor_dBm + SNR_req;

figure;
semilogx(B, floor_dBm, 'b', 'LineWidth', 1.6); hold on;
semilogx(B, sensitivity_dBm, 'r--', 'LineWidth', 1.6); grid on;
xlabel('Bandwidth [Hz]'); ylabel('Power [dBm]');
title('Noise floor and sensitivity vs bandwidth');
legend('Noise floor', sprintf('Sensitivity (SNR=%d dB)', SNR_req), ...
       'Location', 'northwest');

% Point examples for a few common bandwidths
for Bx = [1e3 1e6 20e6]
    fl = kTB_dBm_1Hz + 10*log10(Bx) + NF;
    fprintf('B=%8.0f Hz : floor=%.1f dBm, sensitivity=%.1f dBm\n', ...
            Bx, fl, fl+SNR_req);
end`,
    python: String.raw`# noise-floor: thermal noise floor and receiver sensitivity.
# Floor[dBm] = -174 + 10*log10(B) + NF, referenced to 290 K (kTB).

import numpy as np
import matplotlib.pyplot as plt

kTB_dBm_1Hz = -174   # thermal noise density at 290K [dBm/Hz]
NF = 6               # receiver noise figure [dB]
SNR_req = 10         # SNR needed to demodulate [dB]

# Sweep bandwidth from 1 kHz to 100 MHz
B = np.logspace(3, 8, 200)          # [Hz]
floor_dBm = kTB_dBm_1Hz + 10 * np.log10(B) + NF

# Sensitivity = minimum detectable signal for the required SNR
sensitivity_dBm = floor_dBm + SNR_req

plt.figure(figsize=(7, 4.5))
plt.semilogx(B, floor_dBm, 'b', lw=1.6, label='Noise floor')
plt.semilogx(B, sensitivity_dBm, 'r--', lw=1.6,
             label='Sensitivity (SNR=%d dB)' % SNR_req)
plt.grid(True, which='both')
plt.xlabel('Bandwidth [Hz]'); plt.ylabel('Power [dBm]')
plt.title('Noise floor and sensitivity vs bandwidth')
plt.legend(loc='upper left')
plt.tight_layout(); plt.show()

# Point examples for a few common bandwidths
for Bx in [1e3, 1e6, 20e6]:
    fl = kTB_dBm_1Hz + 10 * np.log10(Bx) + NF
    print('B=%9.0f Hz : floor=%.1f dBm, sensitivity=%.1f dBm'
          % (Bx, fl, fl + SNR_req))`
  },
  'noise-figure': {
    matlab: String.raw`% noise-figure: Friis cascade noise factor for an RF chain.
% F_tot = F1 + (F2-1)/G1 + (F3-1)/(G1*G2) + ...
% Shows why the FIRST stage (LNA) dominates the system noise figure.

clear; clc;

T0 = 290;    % reference temperature [K]

% Stage gains [dB] and noise figures [dB]
G_dB  = [15  20  10];      % e.g. LNA, mixer/amp, IF amp
NF_dB = [1.2 6.0 3.0];

G = 10.^(G_dB/10);         % linear gain
F = 10.^(NF_dB/10);        % linear noise factor

% Friis cascade
F_tot = F(1);
Gcum = 1;
for n = 2:numel(F)
    Gcum = Gcum * G(n-1);
    F_tot = F_tot + (F(n) - 1) / Gcum;
end

NF_tot = 10*log10(F_tot);
Te_tot = T0 * (F_tot - 1);     % equivalent noise temperature [K]

fprintf('Cascade noise factor F_tot = %.3f\n', F_tot);
fprintf('System noise figure        = %.2f dB\n', NF_tot);
fprintf('Equivalent noise temp Te   = %.1f K\n', Te_tot);

% Contribution of each stage to (F_tot - 1)
contrib = zeros(1, numel(F));
Gcum = 1;
contrib(1) = F(1) - 1;
for n = 2:numel(F)
    Gcum = Gcum * G(n-1);
    contrib(n) = (F(n) - 1) / Gcum;
end
pct = 100 * contrib / sum(contrib);

figure;
bar(pct); grid on;
set(gca, 'XTickLabel', {'Stage 1 (LNA)','Stage 2','Stage 3'});
ylabel('Contribution to excess noise [%]');
title('First-stage dominance in Friis cascade');
for n = 1:numel(pct)
    fprintf('Stage %d contributes %.1f%%\n', n, pct(n));
end`,
    python: String.raw`# noise-figure: Friis cascade noise factor for an RF chain.
# F_tot = F1 + (F2-1)/G1 + (F3-1)/(G1*G2) + ...
# Shows why the FIRST stage (LNA) dominates the system noise figure.

import numpy as np
import matplotlib.pyplot as plt

T0 = 290   # reference temperature [K]

# Stage gains [dB] and noise figures [dB]
G_dB  = np.array([15, 20, 10])     # e.g. LNA, mixer/amp, IF amp
NF_dB = np.array([1.2, 6.0, 3.0])

G = 10 ** (G_dB / 10)              # linear gain
F = 10 ** (NF_dB / 10)            # linear noise factor

# Friis cascade
F_tot = F[0]
Gcum = 1.0
for n in range(1, len(F)):
    Gcum *= G[n - 1]
    F_tot += (F[n] - 1) / Gcum

NF_tot = 10 * np.log10(F_tot)
Te_tot = T0 * (F_tot - 1)         # equivalent noise temperature [K]

print('Cascade noise factor F_tot = %.3f' % F_tot)
print('System noise figure        = %.2f dB' % NF_tot)
print('Equivalent noise temp Te   = %.1f K' % Te_tot)

# Contribution of each stage to (F_tot - 1)
contrib = np.zeros(len(F))
contrib[0] = F[0] - 1
Gcum = 1.0
for n in range(1, len(F)):
    Gcum *= G[n - 1]
    contrib[n] = (F[n] - 1) / Gcum
pct = 100 * contrib / contrib.sum()

plt.figure(figsize=(6, 4))
plt.bar(['Stage 1 (LNA)', 'Stage 2', 'Stage 3'], pct)
plt.grid(True, axis='y')
plt.ylabel('Contribution to excess noise [%]')
plt.title('First-stage dominance in Friis cascade')
plt.tight_layout(); plt.show()

for n, p in enumerate(pct):
    print('Stage %d contributes %.1f%%' % (n + 1, p))`
  },
  'phase-noise': {
    matlab: String.raw`% phase-noise: synthesize an oscillator with phase jitter, show the
% spectral skirts, and integrate L(f) to get RMS phase jitter.

clear; clc;

fs = 1e6;            % sample rate [Hz]
N  = 2^16;           % samples
t  = (0:N-1)/fs;
fc = 100e3;          % carrier frequency [Hz]

% Model phase noise as filtered (integrated) white noise -> 1/f^2 skirts.
wn = 0.02 * randn(1, N);          % white frequency noise
phi = cumsum(wn);                 % integrate to phase (random walk)
phi = phi - mean(phi);

% Oscillator output with phase perturbation
x = cos(2*pi*fc*t + phi);

% Spectrum (single-sided PSD in dB)
X = fft(x .* hanning(N)');
Pxx = abs(X(1:N/2+1)).^2;
Pxx = Pxx / max(Pxx);             % normalize to carrier peak
f = (0:N/2)*(fs/N);

figure;
subplot(2,1,1);
plot(f/1e3, 10*log10(Pxx+1e-20), 'LineWidth', 1.0); grid on;
xlabel('Frequency [kHz]'); ylabel('Relative power [dBc]');
title('Oscillator spectrum with phase-noise skirts');
xlim([fc/1e3-20, fc/1e3+20]);

% Single-sideband phase noise L(f) [dBc/Hz] vs offset frequency
offset = f - fc;
pos = offset > 0;
Loff = 10*log10(Pxx(pos)/(fs/N) + 1e-20);   % PSD per Hz, relative to carrier
foff = offset(pos);

subplot(2,1,2);
semilogx(foff, Loff, 'r', 'LineWidth', 1.2); grid on;
xlabel('Offset frequency [Hz]'); ylabel('L(f) [dBc/Hz]');
title('SSB phase noise L(f)');

% Integrate L(f) to RMS phase jitter: sigma_phi = sqrt(2*int L(f) df)
Llin = 10.^(Loff/10);
sigma_phi = sqrt(2 * trapz(foff, Llin));    % [rad]
jitter_s = sigma_phi / (2*pi*fc);           % time jitter [s]
fprintf('RMS phase jitter = %.4f rad (%.2f deg)\n', ...
        sigma_phi, sigma_phi*180/pi);
fprintf('RMS time jitter  = %.3e s\n', jitter_s);`,
    python: String.raw`# phase-noise: synthesize an oscillator with phase jitter, show the
# spectral skirts, and integrate L(f) to get RMS phase jitter.

import numpy as np
import matplotlib.pyplot as plt

fs = 1e6             # sample rate [Hz]
N  = 2 ** 16         # samples
t  = np.arange(N) / fs
fc = 100e3           # carrier frequency [Hz]

# Model phase noise as filtered (integrated) white noise -> 1/f^2 skirts.
rng = np.random.default_rng(2)
wn = 0.02 * rng.standard_normal(N)   # white frequency noise
phi = np.cumsum(wn)                  # integrate to phase (random walk)
phi -= phi.mean()

# Oscillator output with phase perturbation
x = np.cos(2 * np.pi * fc * t + phi)

# Spectrum (single-sided PSD in dB)
win = np.hanning(N)
X = np.fft.rfft(x * win)
Pxx = np.abs(X) ** 2
Pxx /= Pxx.max()                     # normalize to carrier peak
f = np.fft.rfftfreq(N, 1 / fs)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7, 7))
ax1.plot(f / 1e3, 10 * np.log10(Pxx + 1e-20), lw=1.0)
ax1.set_xlabel('Frequency [kHz]'); ax1.set_ylabel('Relative power [dBc]')
ax1.set_title('Oscillator spectrum with phase-noise skirts')
ax1.set_xlim(fc / 1e3 - 20, fc / 1e3 + 20); ax1.grid(True)

# Single-sideband phase noise L(f) [dBc/Hz] vs offset frequency
offset = f - fc
pos = offset > 0
Loff = 10 * np.log10(Pxx[pos] / (fs / N) + 1e-20)
foff = offset[pos]

ax2.semilogx(foff, Loff, 'r', lw=1.2)
ax2.set_xlabel('Offset frequency [Hz]'); ax2.set_ylabel('L(f) [dBc/Hz]')
ax2.set_title('SSB phase noise L(f)'); ax2.grid(True, which='both')
plt.tight_layout(); plt.show()

# Integrate L(f) to RMS phase jitter: sigma_phi = sqrt(2*int L(f) df)
Llin = 10 ** (Loff / 10)
sigma_phi = np.sqrt(2 * np.trapz(Llin, foff))   # [rad]
jitter_s = sigma_phi / (2 * np.pi * fc)         # time jitter [s]
print('RMS phase jitter = %.4f rad (%.2f deg)'
      % (sigma_phi, sigma_phi * 180 / np.pi))
print('RMS time jitter  = %.3e s' % jitter_s)`
  }
});