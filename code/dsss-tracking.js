// dsss-tracking.js — MATLAB + Python teaching code for the DSSS Tracking topic.
// Populates CONTENT_CODE['dsss-tracking']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'dsss-tracking': {
    matlab: String.raw`% DSSS code tracking with a Delay-Locked Loop (DLL).
% Demonstrates: (1) the discriminator S-curve from the code autocorrelation
% triangle for wide (d=1) and narrow (d=0.1) correlators, (2) a closed-loop
% DLL pulling an initial code-phase offset to zero, and (3) the thermal-noise
% code-jitter law sigma = sqrt(BL*d/(2*C/N0)).
rng(2);

% ---- (1) Discriminator S-curve from the triangle R(tau)=1-|tau| ----
R   = @(t) max(0, 1 - abs(t));          % ideal PN autocorrelation triangle
tau = -1.5:0.01:1.5;                     % code-phase error sweep (chips)
for d = [1.0, 0.1]
    E = R(tau + d/2);  L = R(tau - d/2);
    Dcoh = E - L;                        % coherent early-minus-late
    Dnorm = (E.^2 - L.^2) ./ (E.^2 + L.^2 + eps);  % normalized non-coherent
    figure; plot(tau, Dcoh, 'LineWidth',1.5); hold on;
    plot(tau, Dnorm, '--','LineWidth',1.5); grid on;
    xline(0,'k:'); yline(0,'k:');
    xlabel('code error \tau (chips)'); ylabel('discriminator D(\tau)');
    legend('E-L (coherent)','(E^2-L^2)/(E^2+L^2)');
    title(sprintf('DLL S-curve, early-late spacing d = %.1f chip', d));
end

% ---- (2) Closed-loop DLL: pull an initial offset to zero ----
d      = 0.5;            % early-late spacing (chips)
K      = 0.30;           % loop gain (loop-filter constant, first-order)
tau0   = 0.4;            % initial code-phase error (chips)
N      = 60;             % update epochs
CN0dB  = 42;  CN0 = 10^(CN0dB/10);   % C/N0 ratio (Hz)
T      = 0.001;          % 1 ms integration time
tauk   = tau0;  hist = zeros(1,N);
for k = 1:N
    E = R(tauk + d/2);  L = R(tauk - d/2);
    % noisy discriminator (coherent), noise ~ 1/sqrt(2*T*CN0) per correlator
    n = (1/sqrt(2*T*CN0))*randn;
    Dk = (E - L) + n;
    tauk = tauk - K*Dk;                 % NCO nudges replica to null the error
    hist(k) = tauk;
end
figure; plot(0:N, [tau0 hist], 'o-','LineWidth',1.3); grid on;
yline(0,'k--'); xlabel('epoch'); ylabel('code error \tau (chips)');
title('Closed-loop DLL: initial offset pulled to lock');

% ---- (3) Thermal-noise code jitter vs C/N0 ----
CN0dB_sweep = 30:2:50;  CN0lin = 10.^(CN0dB_sweep/10);
BL = 1;                                 % loop noise bandwidth (Hz)
for d = [1.0, 0.5, 0.1]
    sig = sqrt(BL*d ./ (2*CN0lin));     % 1-sigma jitter (chips)
    semilogy(CN0dB_sweep, sig, 'o-','LineWidth',1.3); hold on;
end
grid on; xlabel('C/N_0 (dB-Hz)'); ylabel('code jitter \sigma (chips)');
legend('d=1.0','d=0.5','d=0.1'); title('DLL code jitter: narrower d and higher C/N_0 win');
`,
    python: String.raw`# DSSS code tracking with a Delay-Locked Loop (DLL).
# (1) discriminator S-curve from the triangle for wide vs narrow correlator,
# (2) a closed-loop DLL pulling an initial code offset to zero,
# (3) the thermal-noise code-jitter law sigma = sqrt(BL*d/(2*C/N0)).
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2)
R = lambda t: np.maximum(0.0, 1.0 - np.abs(t))     # PN autocorrelation triangle

# ---- (1) Discriminator S-curve ----
tau = np.arange(-1.5, 1.5, 0.01)
fig1, ax1 = plt.subplots(1, 2, figsize=(11, 4))
for i, d in enumerate([1.0, 0.1]):
    E = R(tau + d/2); L = R(tau - d/2)
    Dcoh  = E - L
    Dnorm = (E**2 - L**2) / (E**2 + L**2 + 1e-12)
    ax1[i].plot(tau, Dcoh, lw=1.5, label='E-L (coherent)')
    ax1[i].plot(tau, Dnorm, '--', lw=1.5, label=r'$(E^2-L^2)/(E^2+L^2)$')
    ax1[i].axhline(0, color='k', ls=':'); ax1[i].axvline(0, color='k', ls=':')
    ax1[i].set_xlabel(r'code error $\tau$ (chips)'); ax1[i].set_ylabel(r'$D(\tau)$')
    ax1[i].grid(True); ax1[i].legend()
    ax1[i].set_title(f'DLL S-curve, d = {d:.1f} chip')
fig1.tight_layout()

# ---- (2) Closed-loop DLL ----
d, K, tau0, N = 0.5, 0.30, 0.4, 60
CN0 = 10**(42/10)          # C/N0 ratio (Hz)
T   = 1e-3                 # integration time (s)
tauk = tau0; hist = [tau0]
for _ in range(N):
    E = R(tauk + d/2); L = R(tauk - d/2)
    n  = (1/np.sqrt(2*T*CN0)) * rng.standard_normal()   # correlator noise
    Dk = (E - L) + n
    tauk = tauk - K*Dk                                    # NCO nulls the error
    hist.append(tauk)
fig2, ax2 = plt.subplots(figsize=(6, 4))
ax2.plot(range(N+1), hist, 'o-', lw=1.3)
ax2.axhline(0, color='k', ls='--'); ax2.grid(True)
ax2.set_xlabel('epoch'); ax2.set_ylabel(r'code error $\tau$ (chips)')
ax2.set_title('Closed-loop DLL: initial offset pulled to lock')

# ---- (3) Code jitter vs C/N0 ----
CN0dB = np.arange(30, 51, 2); CN0lin = 10**(CN0dB/10); BL = 1.0
fig3, ax3 = plt.subplots(figsize=(6, 4))
for d in [1.0, 0.5, 0.1]:
    sig = np.sqrt(BL*d / (2*CN0lin))
    ax3.semilogy(CN0dB, sig, 'o-', lw=1.3, label=f'd={d}')
ax3.grid(True, which='both'); ax3.legend()
ax3.set_xlabel('C/N0 (dB-Hz)'); ax3.set_ylabel(r'code jitter $\sigma$ (chips)')
ax3.set_title('DLL code jitter: narrower d and higher C/N0 win')
plt.tight_layout(); plt.show()
`,
    note: String.raw`The S-curve plots show the negative-going zero-crossing at tau=0 (the lock point) and how a narrow correlator (d=0.1) gives a steeper slope but a smaller linear pull-in region. The closed-loop run demonstrates the DLL nulling a 0.4-chip handover offset in a handful of epochs. The jitter curves confirm the law sigma = sqrt(BL*d/(2*C/N0)): remember to convert C/N0 from dB-Hz to a linear ratio (10^(dBHz/10)) before using it, and note jitter drops as sqrt(d) and as 1/sqrt(C/N0).`
  }
});
