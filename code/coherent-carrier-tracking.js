// coherent-carrier-tracking.js — MATLAB + Python teaching code for the Coherent Carrier Tracking topic.
// Populates CONTENT_CODE['coherent-carrier-tracking']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'coherent-carrier-tracking': {
    matlab: String.raw`% Coherent carrier tracking of a suppressed-carrier BPSK signal.
% Demonstrates: (1) the squaring loop exposing a spectral line at 2*fc that
% is absent at fc, (2) a closed-loop Costas loop pulling an initial phase
% error to zero and revealing the 180-degree ambiguity, and (3) the
% phase-jitter / squaring-loss law and the cos^2 BER penalty.
rng(7);

% ---- (1) Squaring reveals a line at 2*fc ----
fs = 20e3; T = 1.0; t = (0:1/fs:T-1/fs).';    % time base
fc = 1e3;                                       % carrier frequency (Hz)
Rb = 100;  Nb = round(Rb*T);                    % 100 bits
d = [ones(Nb/2,1); -ones(Nb/2,1)];              % balanced +/-1 BPSK data (zero mean,
d = d(randperm(Nb));                            %  so the finite record has no fc leakage)
data = repelem(d, fs/Rb);  data = data(1:numel(t));
s = data .* cos(2*pi*fc*t);                     % suppressed-carrier BPSK
S  = abs(fft(s)).^2;   S2 = abs(fft(s.^2)).^2;  % spectra of s and s^2
f  = (0:numel(t)-1).'*fs/numel(t);
figure;
subplot(2,1,1); plot(f, 10*log10(S+eps)); xlim([0 3e3]); grid on;
title('Spectrum of BPSK s(t): no discrete line at f_c = 1 kHz (suppressed carrier)');
xlabel('Hz'); ylabel('dB');
subplot(2,1,2); plot(f, 10*log10(S2+eps)); xlim([0 3e3]); grid on;
title('Spectrum of s^2(t): strong LINE at 2f_c = 2 kHz (data removed, d^2=1)');
xlabel('Hz'); ylabel('dB');

% ---- (2) Closed-loop Costas loop pulling a phase error to zero ----
phi_true = 50*pi/180;         % true (unknown) carrier phase, radians
phihat   = 0;                 % loop estimate
mu       = 0.02;              % loop gain (first-order)
N        = numel(t);
err = zeros(N,1);
Ilp = 0;  Qlp = 0;            % leaky-integrator LPF states
for n = 1:N
    c =  cos(2*pi*fc*t(n) + phihat);   % I-arm reference
    slo = -sin(2*pi*fc*t(n) + phihat); % Q-arm reference
    I = 2*(data(n).*cos(2*pi*fc*t(n)+phi_true)) .* c;    % *2 undoes 1/2
    Q = 2*(data(n).*cos(2*pi*fc*t(n)+phi_true)) .* slo;
    % crude per-sample LPF via leaky integrator on I and Q
    Ilp = 0.98*Ilp + 0.02*I;  Qlp = 0.98*Qlp + 0.02*Q;
    e   = Ilp.*Qlp;               % Costas error ~ sin(2*dphi)
    phihat = phihat + mu*e;       % VCO update
    err(n) = (phi_true - phihat);
end
figure; plot(t, err*180/pi); grid on; yline(0,'k--');
xlabel('time (s)'); ylabel('phase error (deg)');
title('Costas loop pulls phase error to 0 (or 180) deg -- note the ambiguity');

% ---- (3) Phase jitter, squaring loss, and cos^2 BER penalty ----
CN0dB = 30:2:50;  CN0 = 10.^(CN0dB/10);   BL = 100;   % loop bandwidth (Hz)
rhoL  = CN0 / BL;                          % loop SNR
sig_clean = sqrt(1 ./ (2*rhoL));           % clean-carrier RMS jitter (rad)
rho_i = CN0 / 500;                         % arm SNR (arm BW ~500 Hz)
sig_sq = sqrt((1 ./ (2*rhoL)) .* (1 + 1./(2*rho_i)));  % with squaring loss
figure; plot(CN0dB, sig_clean*180/pi, 'o-','LineWidth',1.3); hold on;
plot(CN0dB, sig_sq*180/pi, 's--','LineWidth',1.3); grid on;
xlabel('C/N_0 (dB-Hz)'); ylabel('RMS phase jitter (deg)');
legend('clean carrier','with squaring loss'); title('Carrier-loop phase jitter');

Q = @(x) 0.5*erfc(x/sqrt(2));
EbN0dB = 8; EbN0 = 10^(EbN0dB/10);
dphi = (0:5:40)*pi/180;                    % residual phase error sweep
Pb = Q(sqrt(2*EbN0).*cos(dphi));
figure; semilogy(dphi*180/pi, Pb, 'o-','LineWidth',1.3); grid on;
xlabel('residual phase error \Delta\phi (deg)'); ylabel('BER');
title('Coherent BPSK BER vs residual phase error (E_b/N_0 = 8 dB): cos^2 penalty');
`,
    python: String.raw`# Coherent carrier tracking of a suppressed-carrier BPSK signal.
# (1) squaring loop exposes a line at 2*fc absent at fc,
# (2) a closed-loop Costas loop pulls a phase error to zero (180-deg ambiguity),
# (3) phase-jitter / squaring-loss law and the cos^2 BER penalty.
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

rng = np.random.default_rng(7)
Qf = lambda x: 0.5*erfc(x/np.sqrt(2))

# ---- (1) Squaring reveals a line at 2*fc ----
fs, T, fc, Rb = 20e3, 1.0, 1e3, 100
t = np.arange(0, T, 1/fs)
Nb = int(Rb*T)                                   # 100 bits
d = rng.permutation(np.r_[np.ones(Nb//2), -np.ones(Nb//2)])  # balanced +/-1 data
data = np.repeat(d, int(fs/Rb))[:t.size]
s = data * np.cos(2*np.pi*fc*t)
S  = np.abs(np.fft.fft(s))**2
S2 = np.abs(np.fft.fft(s**2))**2
f  = np.arange(t.size)*fs/t.size
fig1, ax1 = plt.subplots(2, 1, figsize=(8, 6))
ax1[0].plot(f, 10*np.log10(S+1e-12)); ax1[0].set_xlim(0, 3e3); ax1[0].grid(True)
ax1[0].set_title('Spectrum of BPSK s(t): no discrete line at fc = 1 kHz (suppressed carrier)')
ax1[0].set_xlabel('Hz'); ax1[0].set_ylabel('dB')
ax1[1].plot(f, 10*np.log10(S2+1e-12)); ax1[1].set_xlim(0, 3e3); ax1[1].grid(True)
ax1[1].set_title('Spectrum of s^2(t): LINE at 2fc = 2 kHz (data removed, d^2=1)')
ax1[1].set_xlabel('Hz'); ax1[1].set_ylabel('dB')
fig1.tight_layout()

# ---- (2) Closed-loop Costas loop pulling a phase error to zero ----
phi_true = np.deg2rad(50)     # true (unknown) carrier phase
phihat, mu = 0.0, 0.02        # estimate and loop gain
Ilp = Qlp = 0.0
err = np.zeros(t.size)
for n in range(t.size):
    ref_I =  np.cos(2*np.pi*fc*t[n] + phihat)
    ref_Q = -np.sin(2*np.pi*fc*t[n] + phihat)
    x = 2*(data[n]*np.cos(2*np.pi*fc*t[n] + phi_true))   # *2 undoes the 1/2
    I, Q = x*ref_I, x*ref_Q
    Ilp = 0.98*Ilp + 0.02*I                              # leaky-integrator LPF
    Qlp = 0.98*Qlp + 0.02*Q
    e = Ilp*Qlp                                           # error ~ sin(2*dphi)
    phihat += mu*e                                        # VCO update
    err[n] = phi_true - phihat
fig2, ax2 = plt.subplots(figsize=(7, 4))
ax2.plot(t, np.rad2deg(err)); ax2.axhline(0, color='k', ls='--'); ax2.grid(True)
ax2.set_xlabel('time (s)'); ax2.set_ylabel('phase error (deg)')
ax2.set_title('Costas loop pulls phase error to 0 (or 180) deg -- the ambiguity')

# ---- (3) Phase jitter, squaring loss, and cos^2 BER penalty ----
CN0dB = np.arange(30, 51, 2); CN0 = 10**(CN0dB/10); BL = 100.0
rhoL = CN0/BL
sig_clean = np.sqrt(1/(2*rhoL))
rho_i = CN0/500.0                        # arm SNR (arm BW ~500 Hz)
sig_sq = np.sqrt((1/(2*rhoL))*(1 + 1/(2*rho_i)))
fig3, ax3 = plt.subplots(figsize=(7, 4))
ax3.plot(CN0dB, np.rad2deg(sig_clean), 'o-', lw=1.3, label='clean carrier')
ax3.plot(CN0dB, np.rad2deg(sig_sq), 's--', lw=1.3, label='with squaring loss')
ax3.grid(True); ax3.legend()
ax3.set_xlabel('C/N0 (dB-Hz)'); ax3.set_ylabel('RMS phase jitter (deg)')
ax3.set_title('Carrier-loop phase jitter')

EbN0 = 10**(8/10)
dphi = np.deg2rad(np.arange(0, 41, 5))
Pb = Qf(np.sqrt(2*EbN0)*np.cos(dphi))
fig4, ax4 = plt.subplots(figsize=(7, 4))
ax4.semilogy(np.rad2deg(dphi), Pb, 'o-', lw=1.3); ax4.grid(True, which='both')
ax4.set_xlabel('residual phase error (deg)'); ax4.set_ylabel('BER')
ax4.set_title('Coherent BPSK BER vs residual phase error (Eb/N0=8 dB): cos^2 penalty')
plt.tight_layout(); plt.show()
`,
    note: String.raw`Part (1) makes the suppressed-carrier problem visible: the BPSK spectrum is a smooth data lobe with no discrete spectral line at fc (the code uses balanced +/-1 data so the finite record shows no spurious residual line either), but after squaring a sharp line appears at 2*fc because d^2=1 wipes out the data (cos^2 = 1/2 + 1/2*cos(2*wc*t)). Part (2) runs a first-order Costas loop; the phase error settles to 0 (or 180) degrees, illustrating the 180-degree ambiguity that differential encoding or a unique word must resolve. Part (3) confirms the jitter law sigma_phi = sqrt(1/(2*rhoL)) with rhoL = (C/N0)/BL (convert C/N0 from dB-Hz to a linear ratio first), shows the squaring-loss inflation (1 + 1/(2*rho_i)), and plots the cos^2 BER penalty from a residual phase error via Pb = Q(sqrt(2*Eb/N0)*cos(dphi)). Both snippets use a simple first-order leaky integrator as a stand-in for the arm lowpass filters; in a real receiver these are proper matched/decimating filters.`
  }
});
