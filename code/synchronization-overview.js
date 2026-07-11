// synchronization-overview.js — MATLAB + Python teaching code for the Synchronization (Overview) topic.
// Populates CONTENT_CODE['synchronization'] (key is the topic id; the file name differs on purpose).
// No literal backticks or dollar-brace inside the code strings.
Object.assign(CONTENT_CODE, {
  'synchronization': {
    matlab: String.raw`% Receiver synchronization overview: three demonstrations that tie the topic together.
% (1) A second-order digital PLL acquiring a carrier with a frequency offset, then
%     tracking it -- the acquisition transient followed by steady-state jitter.
% (2) The phase-jitter law sigma_phi^2 = 1/(2*rhoL) confirmed by a Monte-Carlo loop
%     against the closed-form theory across C/N0.
% (3) The acquisition-versus-tracking bandwidth trade: pull-in time falls as 1/BL^3
%     while tracking jitter grows as sqrt(BL) -- the tension that rules loop design.
rng(7);

% ---- (1) Second-order PLL: acquisition transient then steady tracking ----
Fs = 1e4; N = 3000; n = (0:N-1).';           % sample rate (Hz) and time index
CN0dB = 45; CN0 = 10^(CN0dB/10);              % link C/N0: dB-Hz -> linear ratio (Hz)
A = 1; C = A^2;                               % carrier amplitude and power
sigma = sqrt(Fs/(2*CN0));                     % per-rail complex-noise std for this C/N0
df = 20; phi0 = deg2rad(40);                  % true frequency offset (Hz) and phase offset
theta = 2*pi*df*n/Fs + phi0;                  % true instantaneous carrier phase
r = A*exp(1j*theta) + sigma*(randn(N,1)+1j*randn(N,1));   % received complex baseband tone
Kp = 0.05; Ki = 0.002;                        % proportional and integral loop-filter gains
phi = 0; integ = 0; perr = zeros(N,1);
for k = 1:N
    perr(k) = angle(exp(1j*(theta(k)-phi)));  % true tracking error at this sample (rad)
    e = angle(r(k).*exp(-1j*phi));            % phase detector (residual angle after de-rotation)
    integ = integ + Ki*e;                     % loop-filter integrator -> zero steady-state freq error
    phi = phi + Kp*e + integ;                 % NCO advances the phase estimate
end
figure; plot(1e3*n/Fs, rad2deg(perr), 'LineWidth',1.0); grid on; yline(0,'k--');
xlabel('time (ms)'); ylabel('phase error (deg)');
title('Second-order PLL: pull-in from 40 deg + 20 Hz offset, then noisy tracking (C/N_0 = 45 dB-Hz)');

% ---- (2) Phase-jitter law sigma_phi^2 = 1/(2*rhoL): Monte Carlo vs theory ----
alpha = 0.02;                                 % first-order loop update gain
BL = Fs*alpha/(2-alpha);                      % two-sided loop noise bandwidth (Hz) implied by alpha
CN0dBv = 25:2:45; CN0v = 10.^(CN0dBv/10);
Nmc = 2e5; sig_meas = zeros(size(CN0v));
for ii = 1:numel(CN0v)
    sw = sqrt(Fs/(2*CN0v(ii)));               % per-update phase-detector noise std (rad)
    w  = sw*randn(Nmc,1);
    pe = filter(-alpha, [1 -(1-alpha)], w);   % linearized first-order loop: pe = (1-a)pe - a*w
    sig_meas(ii) = std(pe(round(Nmc/2):end)); % measured RMS jitter (discard transient)
end
rhoL   = CN0v/BL;                             % loop SNR with the two-sided BL
sig_th = sqrt(1./(2*rhoL));                   % theory: sigma_phi = sqrt(1/(2*rhoL))
figure; plot(CN0dBv, rad2deg(sig_th), '-', 'LineWidth',1.6); hold on;
plot(CN0dBv, rad2deg(sig_meas), 'o', 'LineWidth',1.3); grid on;
xlabel('C/N_0 (dB-Hz)'); ylabel('RMS phase jitter (deg)');
legend('theory: sqrt(1/(2 rho_L))','Monte-Carlo loop','Location','NorthEast');
title(sprintf('Jitter law verified (B_L = %.0f Hz, two-sided)', BL));

% ---- (3) The bandwidth trade: pull-in ~ 1/BL^3 vs jitter ~ sqrt(BL) ----
BLv  = logspace(0, 2, 60);                    % loop noise bandwidth 1..100 Hz
dfac = 500;                                   % frequency offset to acquire (Hz)
Tp   = 4.2*dfac^2 ./ BLv.^3;                  % 2nd-order pull-in time (s)
CN03 = 10^(40/10);                            % C/N0 = 40 dB-Hz (linear)
sigj = rad2deg(sqrt(BLv./(2*CN03)));          % tracking jitter (deg): sigma^2 = BL/(2*C/N0)
figure;
subplot(2,1,1); loglog(BLv, Tp, 'LineWidth',1.6); grid on;
ylabel('pull-in time (s)'); title('Acquisition/tracking trade at C/N_0 = 40 dB-Hz, \Deltaf = 500 Hz');
subplot(2,1,2); semilogx(BLv, sigj, 'LineWidth',1.6); grid on;
xlabel('loop noise bandwidth B_L (Hz)'); ylabel('RMS jitter (deg)');
title('wide B_L: fast pull-in but more jitter;   narrow B_L: low jitter but slow acquisition');
`,
    python: String.raw`# Receiver synchronization overview: three demonstrations that tie the topic together.
# (1) A second-order digital PLL acquiring a carrier with a frequency offset, then tracking it.
# (2) The phase-jitter law sigma_phi^2 = 1/(2*rhoL) confirmed by a Monte-Carlo loop vs theory.
# (3) The acquisition-versus-tracking bandwidth trade: pull-in ~ 1/BL^3 vs jitter ~ sqrt(BL).
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import lfilter

rng = np.random.default_rng(7)

# ---- (1) Second-order PLL: acquisition transient then steady tracking ----
Fs, Ns = 1e4, 3000
n = np.arange(Ns)
CN0 = 10**(45/10)                                 # C/N0: dB-Hz -> linear ratio (Hz)
A = 1.0
sigma = np.sqrt(Fs/(2*CN0))                        # per-rail complex-noise std for this C/N0
df, phi0 = 20.0, np.deg2rad(40)                    # true frequency and phase offsets
theta = 2*np.pi*df*n/Fs + phi0                     # true instantaneous carrier phase
r = A*np.exp(1j*theta) + sigma*(rng.standard_normal(Ns) + 1j*rng.standard_normal(Ns))
Kp, Ki = 0.05, 0.002                               # proportional and integral loop gains
phi, integ = 0.0, 0.0
perr = np.zeros(Ns)
for k in range(Ns):
    perr[k] = np.angle(np.exp(1j*(theta[k] - phi))) # true tracking error at this sample
    e = np.angle(r[k]*np.exp(-1j*phi))              # phase detector
    integ += Ki*e                                   # loop-filter integrator (kills freq error)
    phi += Kp*e + integ                             # NCO advances the estimate
fig1, ax1 = plt.subplots(figsize=(7.5, 4))
ax1.plot(1e3*n/Fs, np.rad2deg(perr), lw=1.0); ax1.axhline(0, color='k', ls='--'); ax1.grid(True)
ax1.set_xlabel('time (ms)'); ax1.set_ylabel('phase error (deg)')
ax1.set_title('Second-order PLL: pull-in from 40 deg + 20 Hz offset, then tracking (C/N0 = 45 dB-Hz)')

# ---- (2) Phase-jitter law sigma_phi^2 = 1/(2*rhoL): Monte Carlo vs theory ----
alpha = 0.02                                        # first-order loop update gain
BL = Fs*alpha/(2-alpha)                             # two-sided loop noise bandwidth (Hz)
CN0dBv = np.arange(25, 46, 2); CN0v = 10**(CN0dBv/10)
Nmc = 200000
sig_meas = np.zeros(CN0v.size)
for ii, cn0 in enumerate(CN0v):
    sw = np.sqrt(Fs/(2*cn0))                        # per-update detector noise std (rad)
    w = sw*rng.standard_normal(Nmc)
    pe = lfilter([-alpha], [1, -(1-alpha)], w)      # linearized first-order loop
    sig_meas[ii] = np.std(pe[Nmc//2:])              # measured RMS jitter
rhoL = CN0v/BL
sig_th = np.sqrt(1/(2*rhoL))                        # theory: sigma_phi = sqrt(1/(2*rhoL))
fig2, ax2 = plt.subplots(figsize=(7, 4))
ax2.plot(CN0dBv, np.rad2deg(sig_th), '-', lw=1.6, label='theory: sqrt(1/(2 rhoL))')
ax2.plot(CN0dBv, np.rad2deg(sig_meas), 'o', lw=1.3, label='Monte-Carlo loop')
ax2.grid(True); ax2.legend()
ax2.set_xlabel('C/N0 (dB-Hz)'); ax2.set_ylabel('RMS phase jitter (deg)')
ax2.set_title('Jitter law verified (BL = %.0f Hz, two-sided)' % BL)

# ---- (3) The bandwidth trade: pull-in ~ 1/BL^3 vs jitter ~ sqrt(BL) ----
BLv = np.logspace(0, 2, 60)                         # loop bandwidth 1..100 Hz
dfac = 500.0                                        # frequency offset to acquire (Hz)
Tp = 4.2*dfac**2 / BLv**3                           # 2nd-order pull-in time (s)
CN03 = 10**(40/10)                                  # C/N0 = 40 dB-Hz (linear)
sigj = np.rad2deg(np.sqrt(BLv/(2*CN03)))            # tracking jitter (deg)
fig3, ax3 = plt.subplots(2, 1, figsize=(7, 6))
ax3[0].loglog(BLv, Tp, lw=1.6); ax3[0].grid(True, which='both')
ax3[0].set_ylabel('pull-in time (s)')
ax3[0].set_title('Acquisition/tracking trade at C/N0 = 40 dB-Hz, df = 500 Hz')
ax3[1].semilogx(BLv, sigj, lw=1.6); ax3[1].grid(True, which='both')
ax3[1].set_xlabel('loop noise bandwidth BL (Hz)'); ax3[1].set_ylabel('RMS jitter (deg)')
ax3[1].set_title('wide BL: fast pull-in, more jitter;  narrow BL: low jitter, slow acquisition')
plt.tight_layout(); plt.show()
`,
    note: String.raw`Part (1) is the whole story in one plot: a second-order digital PLL fed a carrier with a 40-degree phase offset and a 20 Hz frequency offset drags its error from 40 degrees down through a pull-in transient and then holds near zero with a residual thermal jitter -- acquisition followed by tracking, driven by the classic error-detector / loop-filter / NCO trio. The integrator in the loop filter is what makes the steady-state frequency error zero (a second-order loop). Part (2) verifies the headline performance law: a linearized first-order loop is run as a Monte-Carlo recursion, its measured RMS jitter is overlaid on the closed-form sigma_phi = sqrt(1/(2*rhoL)), and the two agree because the loop SNR uses the same two-sided noise bandwidth BL = Fs*alpha/(2-alpha) implied by the update gain. Always convert C/N0 from dB-Hz to a linear ratio (10^(dBHz/10)) before it enters rhoL = (C/N0)/BL, and watch the BL convention: this code uses the two-sided definition that gives 1/(2*rhoL); a one-sided BL gives N0*BL/C, identical physics with different bookkeeping. Part (3) plots the trade that governs every loop design -- pull-in time falls as 1/BL^3 (from Tp ~ 4.2*df^2/BL^3) while tracking jitter grows as sqrt(BL) -- which is exactly why receivers gear-shift the bandwidth or use FLL-assisted-PLL handover to buy fast acquisition and low jitter at once. Part (1) uses a plain angle() phase detector, valid for an unmodulated carrier; a data-modulated signal needs a decision-directed or Costas detector, but the loop dynamics and the jitter law are unchanged.`
  }
});
