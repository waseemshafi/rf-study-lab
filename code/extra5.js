// extra5.js — MATLAB + Python teaching code for 9 RF/receiver topics.
// Populates the global CONTENT_CODE map. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'lna': {
    matlab: String.raw`% LNA + cascade noise figure via Friis.
% F_total = F1 + (F2-1)/G1 + (F3-1)/(G1 G2) + ...
% A good low-noise, high-gain first stage sets the whole chain's NF.
% Stage 1 = LNA, stage 2 = mixer, stage 3 = IF amp.
NFdB = [1.5 8.0 6.0];      % noise figures (dB) per stage
GdB  = [18  -6   20];      % gains (dB) per stage (mixer has conversion loss)
F = 10.^(NFdB/10);         % convert NF (dB) to linear noise factor
G = 10.^(GdB/10);          % convert gain (dB) to linear

Ftot = F(1);
Gcum = 1;
for k = 2:numel(F)
    Gcum = Gcum * G(k-1);
    Ftot = Ftot + (F(k)-1)/Gcum;   % Friis term for stage k
end
NFtot = 10*log10(Ftot);
fprintf('System NF = %.2f dB\n', NFtot);

% Sweep the LNA gain to show how it suppresses later-stage noise.
Glna = 0:2:30;
NFsys = zeros(size(Glna));
for i = 1:numel(Glna)
    Gv = [10^(Glna(i)/10) G(2) G(3)];
    Fs = F(1) + (F(2)-1)/Gv(1) + (F(3)-1)/(Gv(1)*Gv(2));
    NFsys(i) = 10*log10(Fs);
end
figure; plot(Glna, NFsys, '-o', 'LineWidth', 1.4); grid on;
xlabel('LNA gain (dB)'); ylabel('System NF (dB)');
title('More LNA gain -> system NF approaches LNA NF');
`,
    python: String.raw`# LNA + cascade noise figure via Friis.
# F_total = F1 + (F2-1)/G1 + (F3-1)/(G1 G2) + ...
# A good low-noise, high-gain first stage sets the whole chain's NF.
import numpy as np
import matplotlib.pyplot as plt

NFdB = np.array([1.5, 8.0, 6.0])    # NF (dB): LNA, mixer, IF amp
GdB  = np.array([18.0, -6.0, 20.0]) # gains (dB); mixer has conversion loss
F = 10**(NFdB/10)                   # linear noise factors
G = 10**(GdB/10)                    # linear gains

Ftot, Gcum = F[0], 1.0
for k in range(1, len(F)):
    Gcum *= G[k-1]
    Ftot += (F[k]-1)/Gcum           # Friis term for stage k
print(f"System NF = {10*np.log10(Ftot):.2f} dB")

# Sweep LNA gain to show it suppresses later-stage noise.
Glna = np.arange(0, 31, 2)
NFsys = []
for g in Glna:
    g1 = 10**(g/10)
    Fs = F[0] + (F[1]-1)/g1 + (F[2]-1)/(g1*G[1])
    NFsys.append(10*np.log10(Fs))

plt.figure(figsize=(7, 4.2))
plt.plot(Glna, NFsys, '-o', lw=1.4); plt.grid(True)
plt.xlabel("LNA gain (dB)"); plt.ylabel("System NF (dB)")
plt.title("More LNA gain -> system NF approaches LNA NF")
plt.tight_layout(); plt.show()
`
  },

  'agc': {
    matlab: String.raw`% AGC: automatic gain control loop.
% VGA -> envelope detector -> compare to reference -> integrator -> gain.
% Input has a big level step; the loop drives the output to a constant level.
fs = 10e3; t = 0:1/fs:0.2;            % 200 ms record
fc = 200;                             % test-tone frequency (Hz)
env = 0.2 + 1.3*(t >= 0.1);           % envelope steps up at 100 ms
x   = env .* sin(2*pi*fc*t);          % input signal

ref  = 0.5;      % target output amplitude
mu   = 0.02;     % loop (integrator) step size
beta = 0.02;     % envelope-detector smoothing
g = 1; e_env = 0;
y = zeros(size(x)); gain = zeros(size(x));
for n = 1:numel(x)
    yn      = g * x(n);                       % VGA output
    y(n)    = yn;
    e_env   = (1-beta)*e_env + beta*abs(yn);  % leaky-integrator envelope
    err     = ref - e_env;                    % level error
    g       = max(g + mu*err, 0.01);          % integrator updates the gain
    gain(n) = g;
end

figure;
subplot(3,1,1); plot(t, x); grid on; ylabel('input');
title('AGC: input has a large level step');
subplot(3,1,2); plot(t, y); grid on; ylabel('output');
title('Stabilized output holds a near-constant level');
subplot(3,1,3); plot(t, gain, 'LineWidth', 1.3); grid on;
xlabel('t (s)'); ylabel('gain'); title('AGC gain adapts to cancel the step');
`,
    python: String.raw`# AGC: automatic gain control loop.
# VGA -> envelope detector -> compare to reference -> integrator -> gain.
# Input has a big level step; the loop drives output to a constant level.
import numpy as np
import matplotlib.pyplot as plt

fs = 10e3
t = np.arange(0, 0.2, 1/fs)
fc = 200.0
env = np.where(t >= 0.1, 1.5, 0.2)    # envelope steps up at 100 ms
x = env * np.sin(2*np.pi*fc*t)

ref, mu, beta = 0.5, 0.02, 0.02       # target level, loop step, detector smoothing
g, e_env = 1.0, 0.0
y = np.zeros_like(x); gain = np.zeros_like(x)
for n in range(len(x)):
    yn = g * x[n]                     # VGA output
    y[n] = yn
    e_env = (1-beta)*e_env + beta*abs(yn)   # leaky-integrator envelope
    err = ref - e_env                 # level error
    g = max(g + mu*err, 0.01)         # integrator updates the gain
    gain[n] = g

fig, ax = plt.subplots(3, 1, figsize=(7, 7))
ax[0].plot(t, x); ax[0].grid(True); ax[0].set(ylabel="input",
    title="AGC: input has a large level step")
ax[1].plot(t, y); ax[1].grid(True); ax[1].set(ylabel="output",
    title="Stabilized output holds a near-constant level")
ax[2].plot(t, gain, lw=1.3); ax[2].grid(True)
ax[2].set(xlabel="t (s)", ylabel="gain", title="AGC gain adapts to cancel the step")
plt.tight_layout(); plt.show()
`
  },

  'mixer': {
    matlab: String.raw`% Mixer: multiply an RF tone by an LO tone.
% cos(wRF t) cos(wLO t) = 0.5[cos((wRF-wLO)t) + cos((wRF+wLO)t)]
% -> a difference (IF) term and a sum term. Image maps to the same IF.
fs  = 200e3; t = 0:1/fs:5e-3;      % 5 ms record
fRF = 45e3;  fLO = 40e3;           % RF and LO (Hz)
fIF = abs(fRF - fLO);              % intermediate frequency = 5 kHz
fImg = fLO - fIF;                  % image on the other side of the LO
fprintf('fIF = %.1f kHz, image at %.1f kHz\n', fIF/1e3, fImg/1e3);

rf = cos(2*pi*fRF*t);
lo = cos(2*pi*fLO*t);
prod = rf .* lo;                   % ideal multiplying mixer output

N = numel(t);
P = abs(fft(prod))/N; f = (0:N-1)*(fs/N);
half = 1:floor(N/2);
figure;
subplot(2,1,1); plot(t*1e3, prod); grid on;
xlabel('t (ms)'); ylabel('product'); title('Mixer output (time domain)');
subplot(2,1,2); plot(f(half)/1e3, P(half), 'LineWidth', 1.2); grid on;
xlabel('f (kHz)'); ylabel('|X|');
title('Spectrum: difference (IF) and sum terms');
xline(fIF/1e3, 'r--'); xline((fRF+fLO)/1e3, 'g--');
`,
    python: String.raw`# Mixer: multiply an RF tone by an LO tone.
# cos(wRF t) cos(wLO t) = 0.5[cos((wRF-wLO)t) + cos((wRF+wLO)t)]
# -> a difference (IF) term and a sum term. Image maps to the same IF.
import numpy as np
import matplotlib.pyplot as plt

fs = 200e3
t = np.arange(0, 5e-3, 1/fs)
fRF, fLO = 45e3, 40e3
fIF = abs(fRF - fLO)               # intermediate frequency = 5 kHz
fImg = fLO - fIF                   # image on the other side of the LO
print(f"fIF = {fIF/1e3:.1f} kHz, image at {fImg/1e3:.1f} kHz")

rf = np.cos(2*np.pi*fRF*t)
lo = np.cos(2*np.pi*fLO*t)
prod = rf * lo                     # ideal multiplying mixer output

N = len(t)
P = np.abs(np.fft.fft(prod))/N
f = np.fft.fftfreq(N, 1/fs)
half = f >= 0
fig, ax = plt.subplots(2, 1, figsize=(7, 6))
ax[0].plot(t*1e3, prod); ax[0].grid(True)
ax[0].set(xlabel="t (ms)", ylabel="product", title="Mixer output (time domain)")
ax[1].plot(f[half]/1e3, P[half], lw=1.2); ax[1].grid(True)
ax[1].set(xlabel="f (kHz)", ylabel="|X|",
          title="Spectrum: difference (IF) and sum terms")
ax[1].axvline(fIF/1e3, color='r', ls='--')
ax[1].axvline((fRF+fLO)/1e3, color='g', ls='--')
plt.tight_layout(); plt.show()
`
  },

  'harmonics': {
    matlab: String.raw`% Harmonics from a memoryless nonlinearity y = a1 x + a2 x^2 + a3 x^3.
% A single tone in produces energy at f, 2f, 3f. Compute THD.
fs = 100e3; t = 0:1/fs:20e-3;        % 20 ms
f0 = 1e3; A = 1.0;                   % input tone
x = A*sin(2*pi*f0*t);
a1 = 1.0; a2 = 0.2; a3 = 0.1;        % nonlinearity coefficients
y = a1*x + a2*x.^2 + a3*x.^3;        % distorted output

N = numel(t); Y = abs(fft(y))/N*2; f = (0:N-1)*(fs/N);
% Amplitude at each harmonic (find nearest bin).
binOf = @(fq) round(fq/(fs/N)) + 1;
H1 = Y(binOf(f0)); H2 = Y(binOf(2*f0)); H3 = Y(binOf(3*f0));
THD = sqrt(H2^2 + H3^2) / H1 * 100;  % percent
fprintf('H1=%.3f H2=%.3f H3=%.3f  THD = %.2f %%\n', H1, H2, H3, THD);

half = 1:floor(N/2);
figure; plot(f(half)/1e3, 20*log10(Y(half)+1e-6), 'LineWidth', 1.1); grid on;
xlim([0 5]); xlabel('f (kHz)'); ylabel('dB');
title(sprintf('Harmonics at f, 2f, 3f   (THD = %.1f%%)', THD));
xline(f0/1e3,'k--'); xline(2*f0/1e3,'r--'); xline(3*f0/1e3,'g--');
`,
    python: String.raw`# Harmonics from a memoryless nonlinearity y = a1 x + a2 x^2 + a3 x^3.
# A single tone in produces energy at f, 2f, 3f. Compute THD.
import numpy as np
import matplotlib.pyplot as plt

fs = 100e3
t = np.arange(0, 20e-3, 1/fs)
f0, A = 1e3, 1.0
x = A*np.sin(2*np.pi*f0*t)
a1, a2, a3 = 1.0, 0.2, 0.1           # nonlinearity coefficients
y = a1*x + a2*x**2 + a3*x**3         # distorted output

N = len(t)
Y = np.abs(np.fft.fft(y))/N*2
f = np.fft.fftfreq(N, 1/fs)
def bin_of(fq): return int(round(fq/(fs/N)))
H1, H2, H3 = Y[bin_of(f0)], Y[bin_of(2*f0)], Y[bin_of(3*f0)]
THD = np.sqrt(H2**2 + H3**2)/H1*100  # percent
print(f"H1={H1:.3f} H2={H2:.3f} H3={H3:.3f}  THD = {THD:.2f} %")

half = f >= 0
plt.figure(figsize=(7, 4.2))
plt.plot(f[half]/1e3, 20*np.log10(Y[half]+1e-6), lw=1.1); plt.grid(True)
plt.xlim(0, 5); plt.xlabel("f (kHz)"); plt.ylabel("dB")
plt.title(f"Harmonics at f, 2f, 3f   (THD = {THD:.1f}%)")
for m, c in zip([1, 2, 3], ['k--', 'r--', 'g--']):
    plt.axvline(m*f0/1e3, ls='--', color=c[0])
plt.tight_layout(); plt.show()
`
  },

  'third-order-intercept': {
    matlab: String.raw`% IIP3: two-tone test through a cubic nonlinearity.
% Sweep input power; fundamental rises 1:1, IM3 rises 3:1 in dB.
% Their extrapolated crossing is the third-order intercept point.
fs = 400e3; t = 0:1/fs:10e-3;
f1 = 40e3; f2 = 41e3;                 % closely spaced tones (Hz)
a1 = 1.0; a3 = -0.15;                 % linear and cubic coefficients
N = numel(t); f = (0:N-1)*(fs/N);
binOf = @(fq) round(fq/(fs/N)) + 1;

Pin = -40:2:0;                        % input level (dBV-ish)
Pfund = zeros(size(Pin)); Pim3 = zeros(size(Pin));
for i = 1:numel(Pin)
    A = 10^(Pin(i)/20);
    x = A*sin(2*pi*f1*t) + A*sin(2*pi*f2*t);
    y = a1*x + a3*x.^3;               % cubic-only nonlinearity
    Y = abs(fft(y))/N*2;
    Pfund(i) = 20*log10(Y(binOf(f1)) + 1e-9);          % fundamental
    Pim3(i)  = 20*log10(Y(binOf(2*f1 - f2)) + 1e-9);   % IM3 at 2f1-f2
end

% Extrapolate the two lines (low-power, linear region) to find IIP3.
lo = 1:5;
pf = polyfit(Pin(lo), Pfund(lo), 1);  % slope ~ 1
pi3 = polyfit(Pin(lo), Pim3(lo), 1);  % slope ~ 3
IIP3 = (pi3(2) - pf(2)) / (pf(1) - pi3(1));
fprintf('Extrapolated IIP3 = %.1f dB\n', IIP3);

figure; plot(Pin, Pfund, '-o', Pin, Pim3, '-s', 'LineWidth', 1.3); grid on;
hold on; xline(IIP3, 'k--');
xlabel('Pin (dB)'); ylabel('Pout (dB)');
legend('fundamental (1:1)', 'IM3 (3:1)', 'IIP3', 'Location','SouthEast');
title('Two-tone test: fundamental vs IM3 -> IIP3');
`,
    python: String.raw`# IIP3: two-tone test through a cubic nonlinearity.
# Sweep input power; fundamental rises 1:1, IM3 rises 3:1 in dB.
# Their extrapolated crossing is the third-order intercept point.
import numpy as np
import matplotlib.pyplot as plt

fs = 400e3
t = np.arange(0, 10e-3, 1/fs)
f1, f2 = 40e3, 41e3
a1, a3 = 1.0, -0.15
N = len(t); f = np.fft.fftfreq(N, 1/fs)
def bin_of(fq): return int(round(fq/(fs/N)))

Pin = np.arange(-40, 1, 2.0)
Pfund = np.zeros_like(Pin); Pim3 = np.zeros_like(Pin)
for i, p in enumerate(Pin):
    A = 10**(p/20)
    x = A*np.sin(2*np.pi*f1*t) + A*np.sin(2*np.pi*f2*t)
    y = a1*x + a3*x**3                # cubic-only nonlinearity
    Y = np.abs(np.fft.fft(y))/N*2
    Pfund[i] = 20*np.log10(Y[bin_of(f1)] + 1e-9)          # fundamental
    Pim3[i]  = 20*np.log10(Y[bin_of(2*f1 - f2)] + 1e-9)   # IM3 at 2f1-f2

lo = slice(0, 5)                      # low-power linear region
pf = np.polyfit(Pin[lo], Pfund[lo], 1)   # slope ~ 1
p3 = np.polyfit(Pin[lo], Pim3[lo], 1)    # slope ~ 3
IIP3 = (p3[1] - pf[1]) / (pf[0] - p3[0])
print(f"Extrapolated IIP3 = {IIP3:.1f} dB")

plt.figure(figsize=(7, 4.6))
plt.plot(Pin, Pfund, '-o', lw=1.3, label="fundamental (1:1)")
plt.plot(Pin, Pim3, '-s', lw=1.3, label="IM3 (3:1)")
plt.axvline(IIP3, color='k', ls='--', label="IIP3")
plt.grid(True); plt.xlabel("Pin (dB)"); plt.ylabel("Pout (dB)")
plt.title("Two-tone test: fundamental vs IM3 -> IIP3")
plt.legend(loc="lower right"); plt.tight_layout(); plt.show()
`
  },

  'intermediate-frequency': {
    matlab: String.raw`% Intermediate frequency: tuning the LO puts any channel on a fixed IF.
% fIF = |fRF - fLO|. Use high-side LO: fLO = fRF + fIF.
% The IF filter stays put; the LO does the tuning.
fIF = 10.7e6;                     % fixed IF (Hz), classic FM IF
channels = (88:2:98)*1e6;         % wanted RF channels (Hz)
fLO = channels + fIF;             % high-side LO for each channel
fImg = fLO + fIF;                 % image sits one IF above the LO

fprintf(' RF(MHz)   LO(MHz)   IF(MHz)   Image(MHz)\n');
for k = 1:numel(channels)
    thisIF = abs(channels(k) - fLO(k));
    fprintf('%8.1f %9.1f %8.2f %10.1f\n', ...
        channels(k)/1e6, fLO(k)/1e6, thisIF/1e6, fImg(k)/1e6);
end

figure; hold on; grid on;
for k = 1:numel(channels)
    plot([channels(k) fLO(k)]/1e6, [1 1]*k, '-o');   % RF -> LO for each
end
yline(0); xlabel('frequency (MHz)'); ylabel('channel index');
title('Different RF + tuned LO all land on the same fixed IF');
`,
    python: String.raw`# Intermediate frequency: tuning the LO puts any channel on a fixed IF.
# fIF = |fRF - fLO|. Use high-side LO: fLO = fRF + fIF.
# The IF filter stays put; the LO does the tuning.
import numpy as np
import matplotlib.pyplot as plt

fIF = 10.7e6                      # fixed IF (Hz), classic FM IF
channels = np.arange(88, 99, 2)*1e6   # wanted RF channels (Hz)
fLO = channels + fIF             # high-side LO for each channel
fImg = fLO + fIF                 # image one IF above the LO

print(" RF(MHz)   LO(MHz)   IF(MHz)   Image(MHz)")
for rf, lo, img in zip(channels, fLO, fImg):
    print(f"{rf/1e6:8.1f} {lo/1e6:9.1f} {abs(rf-lo)/1e6:8.2f} {img/1e6:10.1f}")

plt.figure(figsize=(7, 4.2))
for k, (rf, lo) in enumerate(zip(channels, fLO)):
    plt.plot([rf/1e6, lo/1e6], [k, k], '-o')   # RF -> LO for each channel
plt.grid(True); plt.xlabel("frequency (MHz)"); plt.ylabel("channel index")
plt.title("Different RF + tuned LO all land on the same fixed IF")
plt.tight_layout(); plt.show()
`
  },

  'image-frequency': {
    matlab: String.raw`% Image frequency: wanted and image RF both fall on the same IF.
% fLO = fRF - fIF (low-side). Image = fLO - fIF = fRF - 2 fIF.
% A preselector (RF bandpass) must attenuate the image before the mixer.
fIF  = 5e3;
fLO  = 40e3;
fWant = fLO + fIF;                 % wanted RF (high-side of LO)
fImg  = fLO - fIF;                 % image RF (low-side of LO)
fprintf('Wanted RF = %.1f kHz, Image RF = %.1f kHz, both -> IF %.1f kHz\n', ...
    fWant/1e3, fImg/1e3, fIF/1e3);

fs = 400e3; t = 0:1/fs:5e-3;
lo = cos(2*pi*fLO*t);
% Preselector: bandpass centred on the wanted RF, ~fWant +/- 3 kHz.
% Model its gain as a Gaussian in frequency; image gets attenuated.
presel = @(fq) exp(-((fq - fWant)/3e3).^2);
Gwant = presel(fWant); Gimg = presel(fImg);
fprintf('Preselector gain: wanted %.3f, image %.4f (%.1f dB rejection)\n', ...
    Gwant, Gimg, 20*log10(Gwant/Gimg));

rf = Gwant*cos(2*pi*fWant*t) + Gimg*cos(2*pi*fImg*t);
mix = rf .* lo;
N = numel(t); M = abs(fft(mix))/N*2; f = (0:N-1)*(fs/N);
half = 1:floor(N/2);
figure; plot(f(half)/1e3, M(half), 'LineWidth', 1.2); grid on;
xlim([0 20]); xlabel('f (kHz)'); ylabel('|X|');
title('After preselector + mixer: image contribution suppressed at IF');
xline(fIF/1e3, 'r--');
`,
    python: String.raw`# Image frequency: wanted and image RF both fall on the same IF.
# fLO = fRF - fIF (low-side). Image = fLO - fIF = fRF - 2 fIF.
# A preselector (RF bandpass) must attenuate the image before the mixer.
import numpy as np
import matplotlib.pyplot as plt

fIF, fLO = 5e3, 40e3
fWant = fLO + fIF                 # wanted RF (high-side of LO)
fImg  = fLO - fIF                 # image RF (low-side of LO)
print(f"Wanted RF = {fWant/1e3:.1f} kHz, Image RF = {fImg/1e3:.1f} kHz, "
      f"both -> IF {fIF/1e3:.1f} kHz")

fs = 400e3
t = np.arange(0, 5e-3, 1/fs)
lo = np.cos(2*np.pi*fLO*t)
# Preselector: Gaussian bandpass centred on the wanted RF.
presel = lambda fq: np.exp(-((fq - fWant)/3e3)**2)
Gwant, Gimg = presel(fWant), presel(fImg)
print(f"Preselector gain: wanted {Gwant:.3f}, image {Gimg:.4f} "
      f"({20*np.log10(Gwant/Gimg):.1f} dB rejection)")

rf = Gwant*np.cos(2*np.pi*fWant*t) + Gimg*np.cos(2*np.pi*fImg*t)
mix = rf * lo
N = len(t); M = np.abs(np.fft.fft(mix))/N*2; f = np.fft.fftfreq(N, 1/fs)
half = f >= 0
plt.figure(figsize=(7, 4.2))
plt.plot(f[half]/1e3, M[half], lw=1.2); plt.grid(True)
plt.xlim(0, 20); plt.xlabel("f (kHz)"); plt.ylabel("|X|")
plt.title("After preselector + mixer: image contribution suppressed at IF")
plt.axvline(fIF/1e3, color='r', ls='--')
plt.tight_layout(); plt.show()
`
  },

  'superheterodyne': {
    matlab: String.raw`% Superheterodyne receiver frequency plan.
% Single-conversion: pick LO for a fixed IF, report the image.
% Then a dual-conversion plan (high 1st IF for image rejection).
fRF = 100e6;                      % wanted RF (Hz)

% --- Single conversion (high-side LO) ---
fIF = 10.7e6;
fLO = fRF + fIF;                  % high-side injection
fImg = fLO + fIF;                 % image one IF above the LO
fprintf('== Single conversion ==\n');
fprintf('RF   = %8.3f MHz\n', fRF/1e6);
fprintf('LO   = %8.3f MHz (high-side)\n', fLO/1e6);
fprintf('IF   = %8.3f MHz\n', fIF/1e6);
fprintf('Image= %8.3f MHz (reject with preselector)\n\n', fImg/1e6);

% --- Dual conversion: high 1st IF eases image rejection ---
fIF1 = 45e6; fIF2 = 455e3;
fLO1 = fRF + fIF1;               % first LO
fImg1 = fLO1 + fIF1;            % first image (far from RF -> easy to filter)
fLO2 = fIF1 + fIF2;            % second LO converts 1st IF -> 2nd IF
fprintf('== Dual conversion ==\n');
fprintf('LO1  = %8.3f MHz, 1st IF = %6.3f MHz, 1st image = %8.3f MHz\n', ...
    fLO1/1e6, fIF1/1e6, fImg1/1e6);
fprintf('LO2  = %8.3f MHz, 2nd IF = %6.3f MHz\n', fLO2/1e6, fIF2/1e6);

figure;
stem([fRF fLO fImg]/1e6, [1 1 1], 'filled'); grid on;
text(fRF/1e6,1.05,'RF'); text(fLO/1e6,1.05,'LO'); text(fImg/1e6,1.05,'Image');
ylim([0 1.3]); xlabel('MHz'); title('Single-conversion frequency plan');
`,
    python: String.raw`# Superheterodyne receiver frequency plan.
# Single-conversion: pick LO for a fixed IF, report the image.
# Then a dual-conversion plan (high 1st IF for image rejection).
import numpy as np
import matplotlib.pyplot as plt

fRF = 100e6                       # wanted RF (Hz)

# --- Single conversion (high-side LO) ---
fIF = 10.7e6
fLO = fRF + fIF                   # high-side injection
fImg = fLO + fIF                  # image one IF above the LO
print("== Single conversion ==")
print(f"RF   = {fRF/1e6:8.3f} MHz")
print(f"LO   = {fLO/1e6:8.3f} MHz (high-side)")
print(f"IF   = {fIF/1e6:8.3f} MHz")
print(f"Image= {fImg/1e6:8.3f} MHz (reject with preselector)\n")

# --- Dual conversion: high 1st IF eases image rejection ---
fIF1, fIF2 = 45e6, 455e3
fLO1 = fRF + fIF1                 # first LO
fImg1 = fLO1 + fIF1              # first image (far from RF -> easy to filter)
fLO2 = fIF1 + fIF2              # second LO: 1st IF -> 2nd IF
print("== Dual conversion ==")
print(f"LO1  = {fLO1/1e6:8.3f} MHz, 1st IF = {fIF1/1e6:6.3f} MHz, "
      f"1st image = {fImg1/1e6:8.3f} MHz")
print(f"LO2  = {fLO2/1e6:8.3f} MHz, 2nd IF = {fIF2/1e6:6.3f} MHz")

plt.figure(figsize=(7, 3.6))
freqs = np.array([fRF, fLO, fImg])/1e6
plt.stem(freqs, [1, 1, 1])
for x, lbl in zip(freqs, ["RF", "LO", "Image"]):
    plt.text(x, 1.05, lbl, ha="center")
plt.ylim(0, 1.3); plt.grid(True); plt.xlabel("MHz")
plt.title("Single-conversion frequency plan")
plt.tight_layout(); plt.show()
`
  },

  'zero-if': {
    matlab: String.raw`% Zero-IF (direct conversion): quadrature downconvert to baseband.
% Inject I/Q gain + phase mismatch, measure the image-rejection ratio (IRR).
% IRR ~ ((1+g)^2 + 2(1+g)cos(phi) + 1) / ((1+g)^2 - 2(1+g)cos(phi) + 1)
fs = 200e3; t = 0:1/fs:10e-3;
fc = 40e3; fbb = 3e3;                  % carrier and baseband offset (Hz)
% Complex baseband signal at +fbb; ideal RX would show only +fbb.
s = exp(1j*2*pi*fbb*t);
rf = real(s .* exp(1j*2*pi*fc*t));     % real passband signal

gerr = 0.05;                           % I/Q amplitude mismatch (fraction)
perr = 3*pi/180;                       % I/Q phase mismatch (radians)
I =  (1+gerr) * cos(2*pi*fc*t);        % mismatched LO in-phase
Q = -sin(2*pi*fc*t + perr);            % mismatched LO quadrature
bb = rf.*I + 1j*(rf.*Q);               % quadrature downconversion

% Theoretical IRR from the mismatch:
g = gerr; phi = perr;
num = (1+g)^2 + 2*(1+g)*cos(phi) + 1;
den = (1+g)^2 - 2*(1+g)*cos(phi) + 1;
IRR = 10*log10(num/den);
fprintf('Gain err %.1f%%, phase err %.1f deg -> IRR = %.1f dB\n', ...
    100*gerr, perr*180/pi, IRR);

N = numel(t); B = fftshift(abs(fft(bb))/N);
f = (-N/2:N/2-1)*(fs/N);
figure; plot(f/1e3, 20*log10(B+1e-6), 'LineWidth', 1.1); grid on;
xlabel('baseband f (kHz)'); ylabel('dB');
title('Zero-IF: wanted at +fbb, mismatch leaks an image at -fbb');
xline(fbb/1e3,'g--'); xline(-fbb/1e3,'r--');
`,
    python: String.raw`# Zero-IF (direct conversion): quadrature downconvert to baseband.
# Inject I/Q gain + phase mismatch, measure the image-rejection ratio (IRR).
import numpy as np
import matplotlib.pyplot as plt

fs = 200e3
t = np.arange(0, 10e-3, 1/fs)
fc, fbb = 40e3, 3e3                     # carrier and baseband offset (Hz)
s = np.exp(1j*2*np.pi*fbb*t)           # wanted complex baseband at +fbb
rf = np.real(s * np.exp(1j*2*np.pi*fc*t))   # real passband signal

gerr = 0.05                            # I/Q amplitude mismatch (fraction)
perr = np.deg2rad(3)                   # I/Q phase mismatch (radians)
I =  (1+gerr) * np.cos(2*np.pi*fc*t)   # mismatched LO in-phase
Q = -np.sin(2*np.pi*fc*t + perr)       # mismatched LO quadrature
bb = rf*I + 1j*(rf*Q)                  # quadrature downconversion

g, phi = gerr, perr
num = (1+g)**2 + 2*(1+g)*np.cos(phi) + 1
den = (1+g)**2 - 2*(1+g)*np.cos(phi) + 1
IRR = 10*np.log10(num/den)
print(f"Gain err {100*gerr:.1f}%, phase err {np.rad2deg(perr):.1f} deg "
      f"-> IRR = {IRR:.1f} dB")

N = len(t)
B = np.fft.fftshift(np.abs(np.fft.fft(bb))/N)
f = np.fft.fftshift(np.fft.fftfreq(N, 1/fs))
plt.figure(figsize=(7, 4.2))
plt.plot(f/1e3, 20*np.log10(B+1e-6), lw=1.1); plt.grid(True)
plt.xlabel("baseband f (kHz)"); plt.ylabel("dB")
plt.title("Zero-IF: wanted at +fbb, mismatch leaks an image at -fbb")
plt.axvline(fbb/1e3, color='g', ls='--')
plt.axvline(-fbb/1e3, color='r', ls='--')
plt.tight_layout(); plt.show()
`
  }
});
