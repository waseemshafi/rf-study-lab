// extra6.js — MATLAB + Python teaching code for 6 filter topics.
// Populates the global CONTENT_CODE map. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'filters': {
    matlab: String.raw`% Compare classic analog low-pass approximations at the SAME order.
% Butterworth (maximally flat) vs Chebyshev-I (passband ripple) vs
% elliptic (ripple both bands, steepest) vs Bessel (linear phase, gentle).
n  = 5;              % filter order (same for all four)
fc = 1e3;            % cutoff frequency (Hz)
Wc = 2*pi*fc;        % cutoff in rad/s
Rp = 1;              % passband ripple (dB) for Cheby/elliptic
Rs = 40;             % stopband attenuation (dB) for elliptic

[bb, ab] = butter(n, Wc, 's');            % Butterworth
[bc, ac] = cheby1(n, Rp, Wc, 's');        % Chebyshev type I
[be, ae] = ellip(n, Rp, Rs, Wc, 's');     % elliptic (Cauer)
[bs, as] = besself(n, Wc);                % Bessel (Thomson)

w = 2*pi*logspace(1, 5, 2000);            % 10 Hz .. 100 kHz
Hb = freqs(bb, ab, w); Hc = freqs(bc, ac, w);
He = freqs(be, ae, w); Hs = freqs(bs, as, w);

figure; semilogx(w/(2*pi), 20*log10(abs(Hb)), 'LineWidth', 1.4); hold on;
semilogx(w/(2*pi), 20*log10(abs(Hc)), 'LineWidth', 1.4);
semilogx(w/(2*pi), 20*log10(abs(He)), 'LineWidth', 1.4);
semilogx(w/(2*pi), 20*log10(abs(Hs)), 'LineWidth', 1.4);
grid on; ylim([-80 5]);
xline(fc, 'k:'); yline(-3, 'k:');
xlabel('frequency (Hz)'); ylabel('magnitude (dB)');
legend('Butterworth', 'Chebyshev-I', 'elliptic', 'Bessel', 'Location', 'southwest');
title(sprintf('Order-%d low-pass responses (fc = %g Hz)', n, fc));
`,
    python: String.raw`# Compare classic analog low-pass approximations at the SAME order.
# Butterworth (maximally flat) vs Chebyshev-I (passband ripple) vs
# elliptic (ripple both bands, steepest) vs Bessel (linear phase, gentle).
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

n, fc = 5, 1e3            # order and cutoff (Hz)
Wc = 2*np.pi*fc           # cutoff in rad/s
Rp, Rs = 1, 40            # passband ripple / stopband atten (dB)

designs = {
    "Butterworth": signal.butter(n, Wc, 'low', analog=True),
    "Chebyshev-I": signal.cheby1(n, Rp, Wc, 'low', analog=True),
    "elliptic":    signal.ellip(n, Rp, Rs, Wc, 'low', analog=True),
    "Bessel":      signal.bessel(n, Wc, 'low', analog=True),
}

w = 2*np.pi*np.logspace(1, 5, 2000)     # 10 Hz .. 100 kHz
plt.figure(figsize=(7.5, 4.5))
for name, (b, a) in designs.items():
    _, H = signal.freqs(b, a, worN=w)
    plt.semilogx(w/(2*np.pi), 20*np.log10(np.abs(H)), lw=1.4, label=name)

plt.axvline(fc, color='k', ls=':'); plt.axhline(-3, color='k', ls=':')
plt.ylim(-80, 5); plt.grid(True, which='both')
plt.xlabel("frequency (Hz)"); plt.ylabel("magnitude (dB)")
plt.title(f"Order-{n} low-pass responses (fc = {fc:g} Hz)")
plt.legend(loc='lower left')
plt.tight_layout(); plt.show()
`
  },

  'lpf': {
    matlab: String.raw`% RC low-pass filter:  H(s) = 1/(1 + s R C),  fc = 1/(2 pi R C).
% Plot magnitude & phase, mark fc and the -20 dB/decade roll-off, and
% show the step response (RC charging).
R = 1e3; C = 159e-9;             % chosen so fc ~ 1 kHz
fc = 1/(2*pi*R*C);
fprintf('fc = 1/(2 pi R C) = %.1f Hz\n', fc);

b = 1; a = [R*C 1];              % transfer function 1/(RCs+1)
f = logspace(0, 5, 2000); w = 2*pi*f;
H = freqs(b, a, w);
mag = 20*log10(abs(H)); ph = angle(H)*180/pi;

figure;
subplot(3,1,1); semilogx(f, mag, 'LineWidth', 1.4); grid on; hold on;
xline(fc, 'k:'); yline(-3, 'k:');
% asymptotic -20 dB/decade line above fc
fa = logspace(log10(fc), 5, 50);
semilogx(fa, -20*log10(fa/fc), 'r--');
text(fc*3, -25, '-20 dB/decade');
xlabel('f (Hz)'); ylabel('|H| (dB)'); title('RC low-pass magnitude');

subplot(3,1,2); semilogx(f, ph, 'LineWidth', 1.4); grid on;
xline(fc, 'k:'); yline(-45, 'k:');
xlabel('f (Hz)'); ylabel('phase (deg)'); title('Phase (-45 deg at fc)');

subplot(3,1,3);
t = 0:R*C/50:6*R*C; s = 1 - exp(-t/(R*C));   % step response
plot(t*1e3, s, 'LineWidth', 1.4); grid on;
xlabel('t (ms)'); ylabel('v_C / V_{in}'); title('Step response (RC charging)');
`,
    python: String.raw`# RC low-pass filter:  H(s) = 1/(1 + s R C),  fc = 1/(2 pi R C).
# Magnitude & phase, mark fc and the -20 dB/decade roll-off, plus step response.
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

R, C = 1e3, 159e-9              # chosen so fc ~ 1 kHz
fc = 1/(2*np.pi*R*C)
print(f"fc = 1/(2 pi R C) = {fc:.1f} Hz")

b, a = [1], [R*C, 1]           # H(s) = 1/(RC s + 1)
f = np.logspace(0, 5, 2000); w = 2*np.pi*f
_, H = signal.freqs(b, a, worN=w)
mag, ph = 20*np.log10(np.abs(H)), np.angle(H, deg=True)

fig, ax = plt.subplots(3, 1, figsize=(7, 8))
ax[0].semilogx(f, mag, lw=1.4); ax[0].grid(True, which='both')
ax[0].axvline(fc, color='k', ls=':'); ax[0].axhline(-3, color='k', ls=':')
fa = np.logspace(np.log10(fc), 5, 50)
ax[0].semilogx(fa, -20*np.log10(fa/fc), 'r--')      # -20 dB/decade asymptote
ax[0].text(fc*3, -25, "-20 dB/decade")
ax[0].set(xlabel="f (Hz)", ylabel="|H| (dB)", title="RC low-pass magnitude")

ax[1].semilogx(f, ph, lw=1.4); ax[1].grid(True, which='both')
ax[1].axvline(fc, color='k', ls=':'); ax[1].axhline(-45, color='k', ls=':')
ax[1].set(xlabel="f (Hz)", ylabel="phase (deg)", title="Phase (-45 deg at fc)")

t = np.arange(0, 6*R*C, R*C/50)
step = 1 - np.exp(-t/(R*C))                          # RC charging
ax[2].plot(t*1e3, step, lw=1.4); ax[2].grid(True)
ax[2].set(xlabel="t (ms)", ylabel="vC / Vin", title="Step response (RC charging)")
plt.tight_layout(); plt.show()
`
  },

  'hpf': {
    matlab: String.raw`% CR high-pass filter:  H(s) = s R C / (1 + s R C),  fc = 1/(2 pi R C).
% Magnitude & phase: blocks DC (|H|->0), passes highs (|H|->1), +45 deg at fc.
R = 1e3; C = 159e-9;            % fc ~ 1 kHz
fc = 1/(2*pi*R*C);
fprintf('fc = %.1f Hz;  |H(DC)| = 0, |H(inf)| = 1\n', fc);

b = [R*C 0]; a = [R*C 1];      % s R C / (s R C + 1)
f = logspace(0, 5, 2000); w = 2*pi*f;
H = freqs(b, a, w);
mag = 20*log10(abs(H)); ph = angle(H)*180/pi;

figure;
subplot(2,1,1); semilogx(f, mag, 'LineWidth', 1.4); grid on; hold on;
xline(fc, 'k:'); yline(-3, 'k:');
% +20 dB/decade rising asymptote below fc
fb = logspace(0, log10(fc), 50);
semilogx(fb, 20*log10(fb/fc), 'r--');
text(fc/1e2, -35, '+20 dB/decade (DC blocked)');
xlabel('f (Hz)'); ylabel('|H| (dB)'); title('CR high-pass magnitude');

subplot(2,1,2); semilogx(f, ph, 'LineWidth', 1.4); grid on;
xline(fc, 'k:'); yline(45, 'k:');
xlabel('f (Hz)'); ylabel('phase (deg)'); title('Phase: +90 deg at DC, +45 deg at fc');
`,
    python: String.raw`# CR high-pass filter:  H(s) = s R C / (1 + s R C),  fc = 1/(2 pi R C).
# Magnitude & phase: blocks DC (|H|->0), passes highs (|H|->1), +45 deg at fc.
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

R, C = 1e3, 159e-9             # fc ~ 1 kHz
fc = 1/(2*np.pi*R*C)
print(f"fc = {fc:.1f} Hz;  |H(DC)| = 0, |H(inf)| = 1")

b, a = [R*C, 0], [R*C, 1]     # s R C / (s R C + 1)
f = np.logspace(0, 5, 2000); w = 2*np.pi*f
_, H = signal.freqs(b, a, worN=w)
mag, ph = 20*np.log10(np.abs(H)), np.angle(H, deg=True)

fig, ax = plt.subplots(2, 1, figsize=(7, 6))
ax[0].semilogx(f, mag, lw=1.4); ax[0].grid(True, which='both')
ax[0].axvline(fc, color='k', ls=':'); ax[0].axhline(-3, color='k', ls=':')
fb = np.logspace(0, np.log10(fc), 50)
ax[0].semilogx(fb, 20*np.log10(fb/fc), 'r--')       # +20 dB/decade rise
ax[0].text(fc/1e2, -35, "+20 dB/decade (DC blocked)")
ax[0].set(xlabel="f (Hz)", ylabel="|H| (dB)", title="CR high-pass magnitude")

ax[1].semilogx(f, ph, lw=1.4); ax[1].grid(True, which='both')
ax[1].axvline(fc, color='k', ls=':'); ax[1].axhline(45, color='k', ls=':')
ax[1].set(xlabel="f (Hz)", ylabel="phase (deg)",
          title="Phase: +90 deg at DC, +45 deg at fc")
plt.tight_layout(); plt.show()
`
  },

  'bpf': {
    matlab: String.raw`% Series-RLC band-pass:  H(s) = (s/(RC)) / (s^2 + s/(RC) + 1/(LC)).
% Resonance f0 = 1/(2 pi sqrt(LC)); bandwidth BW = R/(2 pi L); Q = f0/BW.
R = 50; L = 1e-3; C = 1e-9;
f0 = 1/(2*pi*sqrt(L*C));         % centre frequency
BW = R/(2*pi*L);                 % -3 dB bandwidth
Q  = f0/BW;                      % quality factor
fprintf('f0 = %.1f Hz, BW = %.1f Hz, Q = f0/BW = %.2f\n', f0, BW, Q);

b = [1/(R*C) 0]; a = [1 1/(R*C) 1/(L*C)];   % band-pass transfer function
f = logspace(4, 7, 3000); w = 2*pi*f;
H = freqs(b, a, w);
mag = 20*log10(abs(H));

figure; semilogx(f, mag, 'LineWidth', 1.4); grid on; hold on;
xline(f0, 'k:'); yline(-3, 'r:');
xline(f0 - BW/2, 'g:'); xline(f0 + BW/2, 'g:');
text(f0, 2, sprintf('f0 = %.0f Hz', f0));
text(f0*1.1, -10, sprintf('Q = %.2f', Q));
ylim([-40 5]);
xlabel('f (Hz)'); ylabel('|H| (dB)');
title(sprintf('RLC band-pass: f0 = %.0f Hz, BW = %.0f Hz, Q = %.2f', f0, BW, Q));
`,
    python: String.raw`# Series-RLC band-pass:  H(s) = (s/(RC)) / (s^2 + s/(RC) + 1/(LC)).
# Resonance f0 = 1/(2 pi sqrt(LC)); bandwidth BW = R/(2 pi L); Q = f0/BW.
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

R, L, C = 50, 1e-3, 1e-9
f0 = 1/(2*np.pi*np.sqrt(L*C))    # centre frequency
BW = R/(2*np.pi*L)               # -3 dB bandwidth
Q = f0/BW                        # quality factor
print(f"f0 = {f0:.1f} Hz, BW = {BW:.1f} Hz, Q = f0/BW = {Q:.2f}")

b = [1/(R*C), 0]; a = [1, 1/(R*C), 1/(L*C)]   # band-pass H(s)
f = np.logspace(4, 7, 3000); w = 2*np.pi*f
_, H = signal.freqs(b, a, worN=w)
mag = 20*np.log10(np.abs(H))

plt.figure(figsize=(7.5, 4.5))
plt.semilogx(f, mag, lw=1.4); plt.grid(True, which='both')
plt.axvline(f0, color='k', ls=':'); plt.axhline(-3, color='r', ls=':')
plt.axvline(f0 - BW/2, color='g', ls=':'); plt.axvline(f0 + BW/2, color='g', ls=':')
plt.text(f0, 2, f"f0 = {f0:.0f} Hz")
plt.text(f0*1.1, -10, f"Q = {Q:.2f}")
plt.ylim(-40, 5)
plt.xlabel("f (Hz)"); plt.ylabel("|H| (dB)")
plt.title(f"RLC band-pass: f0 = {f0:.0f} Hz, BW = {BW:.0f} Hz, Q = {Q:.2f}")
plt.tight_layout(); plt.show()
`
  },

  'notch-filter': {
    matlab: String.raw`% Notch (band-stop) filter: deep null at f0, passes everything else.
% Digital biquad with conjugate zeros on the unit circle at e^{+/- j w0}
% and poles pulled just inside by r -> narrow, deep notch.
fs = 8e3;                       % sample rate (Hz)
f0 = 1e3;                       % notch frequency (Hz)
w0 = 2*pi*f0/fs;                % notch angle
r  = 0.98;                      % pole radius (closer to 1 -> narrower notch)
fprintf('Notch at f0 = %g Hz (fs = %g Hz), r = %.3f\n', f0, fs, r);

% zeros at e^{+/- j w0}, poles at r e^{+/- j w0}
b = [1, -2*cos(w0), 1];
a = [1, -2*r*cos(w0), r^2];
[H, w] = freqz(b, a, 4096, fs);
mag = 20*log10(abs(H) + 1e-12);

figure;
subplot(2,1,1); plot(w, mag, 'LineWidth', 1.4); grid on; hold on;
xline(f0, 'r:');
xlabel('f (Hz)'); ylabel('|H| (dB)'); title('Notch magnitude (deep null at f0)');
subplot(2,1,2); zplane(b, a);
title('Pole-zero plot: conjugate zeros on unit circle at e^{\pm j w0}');
`,
    python: String.raw`# Notch (band-stop) filter: deep null at f0, passes everything else.
# Digital biquad with conjugate zeros on the unit circle at e^{+/- j w0}
# and poles pulled just inside by r -> narrow, deep notch.
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

fs, f0 = 8e3, 1e3              # sample rate and notch frequency (Hz)
w0 = 2*np.pi*f0/fs             # notch angle
r = 0.98                      # pole radius (closer to 1 -> narrower)
print(f"Notch at f0 = {f0:g} Hz (fs = {fs:g} Hz), r = {r:.3f}")

b = [1, -2*np.cos(w0), 1]                 # zeros at e^{+/- j w0}
a = [1, -2*r*np.cos(w0), r**2]            # poles at r e^{+/- j w0}
w, H = signal.freqz(b, a, worN=4096, fs=fs)
mag = 20*np.log10(np.abs(H) + 1e-12)

fig, ax = plt.subplots(2, 1, figsize=(7, 7))
ax[0].plot(w, mag, lw=1.4); ax[0].grid(True)
ax[0].axvline(f0, color='r', ls=':')
ax[0].set(xlabel="f (Hz)", ylabel="|H| (dB)", title="Notch magnitude (deep null at f0)")

z, p, _ = signal.tf2zpk(b, a)
th = np.linspace(0, 2*np.pi, 400)
ax[1].plot(np.cos(th), np.sin(th), 'k:', lw=0.8)     # unit circle
ax[1].plot(z.real, z.imag, 'bo', ms=9, mfc='none', label="zeros")
ax[1].plot(p.real, p.imag, 'rx', ms=9, label="poles")
ax[1].axis('equal'); ax[1].grid(True); ax[1].legend()
ax[1].set(title="Pole-zero: conjugate zeros on unit circle at e^{+/- j w0}")
plt.tight_layout(); plt.show()
`
  },

  'filter-design': {
    matlab: String.raw`% Butterworth filter design from a spec (Ap, As, wp, ws):
% estimate the minimum order n, then design and verify it meets the mask.
Ap = 1;      As = 40;               % max passband ripple / min stopband atten (dB)
fp = 1e3;    fsb = 3e3;             % passband edge / stopband edge (Hz)
wp = 2*pi*fp; ws = 2*pi*fsb;

% --- Order estimate from the Butterworth magnitude formula ---
% |H|^2 = 1/(1 + (w/wc)^{2n});  solve so it just meets Ap at wp and As at ws.
num = log10((10^(As/10) - 1)/(10^(Ap/10) - 1));
den = 2*log10(ws/wp);
n   = ceil(num/den);                % minimum order (round up)
fprintf('Estimated Butterworth order n = %d\n', n);

% Cutoff placed so the passband ripple spec is exactly met at wp:
wc = wp / (10^(Ap/10) - 1)^(1/(2*n));

[b, a] = butter(n, wc, 's');        % design the analog prototype
w = 2*pi*logspace(1, 5, 3000);
H = freqs(b, a, w);
mag = 20*log10(abs(H));

figure; semilogx(w/(2*pi), mag, 'LineWidth', 1.4); grid on; hold on;
% spec mask
plot([10 fp], [-Ap -Ap], 'r--'); plot([fsb 1e5], [-As -As], 'r--');
xline(fp, 'k:'); xline(fsb, 'k:');
text(fp/5, -Ap+4, sprintf('Ap = %g dB', Ap));
text(fsb*1.2, -As+4, sprintf('As = %g dB', As));
ylim([-80 5]);
xlabel('f (Hz)'); ylabel('|H| (dB)');
title(sprintf('Butterworth design meets spec, order n = %d', n));
`,
    python: String.raw`# Butterworth filter design from a spec (Ap, As, wp, ws):
# estimate the minimum order n, then design and verify it meets the mask.
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

Ap, As = 1, 40                 # passband ripple / stopband atten (dB)
fp, fsb = 1e3, 3e3             # passband / stopband edges (Hz)
wp, ws = 2*np.pi*fp, 2*np.pi*fsb

# Order from the Butterworth magnitude formula |H|^2 = 1/(1+(w/wc)^{2n}).
num = np.log10((10**(As/10) - 1)/(10**(Ap/10) - 1))
den = 2*np.log10(ws/wp)
n = int(np.ceil(num/den))      # minimum order (round up)
print(f"Estimated Butterworth order n = {n}")

# Cutoff placed so the passband spec is exactly met at wp:
wc = wp / (10**(Ap/10) - 1)**(1/(2*n))

b, a = signal.butter(n, wc, 'low', analog=True)   # analog prototype
w = 2*np.pi*np.logspace(1, 5, 3000)
_, H = signal.freqs(b, a, worN=w)
mag = 20*np.log10(np.abs(H))

plt.figure(figsize=(7.5, 4.5))
plt.semilogx(w/(2*np.pi), mag, lw=1.4); plt.grid(True, which='both')
plt.plot([10, fp], [-Ap, -Ap], 'r--')             # passband mask
plt.plot([fsb, 1e5], [-As, -As], 'r--')           # stopband mask
plt.axvline(fp, color='k', ls=':'); plt.axvline(fsb, color='k', ls=':')
plt.text(fp/5, -Ap+4, f"Ap = {Ap:g} dB")
plt.text(fsb*1.2, -As+4, f"As = {As:g} dB")
plt.ylim(-80, 5)
plt.xlabel("f (Hz)"); plt.ylabel("|H| (dB)")
plt.title(f"Butterworth design meets spec, order n = {n}")
plt.tight_layout(); plt.show()
`
  }
});
