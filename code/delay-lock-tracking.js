// delay-lock-tracking.js — MATLAB + Python teaching code for the Delay-Lock Loop topic.
// Populates CONTENT_CODE['delay-lock-tracking']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'delay-lock-tracking': {
    matlab: String.raw`% Delay-Lock Loop (DLL) code tracking.
% Demonstrates: (1) the discriminator S-curve from the code autocorrelation
% triangle for a wide (delta=1) and a narrow (delta=0.2) correlator, showing
% the negative-going zero crossing and how narrow delta keeps the same central
% slope but shrinks the plateau and linear region;
% (2) a closed-loop DLL pulling an initial code-phase offset epsilon to zero;
% (3) the thermal-noise code-jitter law sigma = sqrt(BL*delta/(2*C/N0)).
rng(7);

% Ideal PN autocorrelation triangle R(tau) = 1 - |tau|, zero beyond one chip.
R = @(t) max(0, 1 - abs(t));

% ---- (1) Discriminator S-curve: coherent E-L and normalized non-coherent ----
ep = -1.5:0.01:1.5;                      % code-phase error sweep (chips)
for delta = [1.0, 0.2]
    E = R(ep + delta/2);  L = R(ep - delta/2);
    Dcoh  = E - L;                        % coherent early-minus-late
    Dnorm = (E.^2 - L.^2) ./ (E.^2 + L.^2 + 1e-12);  % normalized non-coherent
    figure; plot(ep, Dcoh, 'LineWidth',1.6); hold on;
    plot(ep, Dnorm, '--', 'LineWidth',1.6); grid on;
    xline(0,'k:'); yline(0,'k:');
    xlabel('code error \epsilon (chips)'); ylabel('discriminator D(\epsilon)');
    legend('E-L (coherent)','(E^2-L^2)/(E^2+L^2)','Location','SouthWest');
    title(sprintf('DLL S-curve, early-late spacing \\delta = %.1f chip', delta));
end

% ---- (2) Closed-loop DLL: pull an initial code-phase offset to zero ----
delta = 0.5;            % early-late spacing (chips)
K     = 0.35;           % loop gain (first-order loop-filter constant)
eps0  = 0.4;            % initial code-phase error (chips)
N     = 60;             % update epochs
CN0   = 10^(42/10);     % C/N0 ratio (Hz) from 42 dB-Hz
T     = 1e-3;           % predetection integration time (s)
epsk  = eps0;  hist = zeros(1,N);
for k = 1:N
    E = R(epsk + delta/2);  L = R(epsk - delta/2);
    % noisy coherent discriminator; per-correlator noise ~ 1/sqrt(2*T*CN0)
    noise = (1/sqrt(2*T*CN0))*randn;
    Dk    = (E - L) + noise;
    % D ~ -2*eps near lock (negative slope), so ADD K*D: eps <- eps*(1-2K) -> 0
    epsk  = epsk + K*Dk;                  % code NCO nudges replica to null the error
    hist(k) = epsk;
end
figure; plot(0:N, [eps0 hist], 'o-','LineWidth',1.3); grid on;
yline(0,'k--'); xlabel('epoch'); ylabel('code error \epsilon (chips)');
title('Closed-loop DLL: initial 0.4-chip offset pulled to lock');

% ---- (3) Thermal-noise code jitter vs C/N0 for several delta ----
CN0dB = 30:2:50;  CN0lin = 10.^(CN0dB/10);  BL = 1;   % BL loop bandwidth (Hz)
figure;
for delta = [1.0, 0.5, 0.1]
    sig = sqrt(BL*delta ./ (2*CN0lin));   % 1-sigma code jitter (chips)
    semilogy(CN0dB, sig, 'o-','LineWidth',1.3); hold on;
end
grid on; xlabel('C/N_0 (dB-Hz)'); ylabel('code jitter \sigma (chips)');
legend('\delta=1.0','\delta=0.5','\delta=0.1');
title('DLL code jitter: narrower \delta and higher C/N_0 win');
`,
    python: String.raw`# Delay-Lock Loop (DLL) code tracking.
# (1) discriminator S-curve from the triangle for wide vs narrow correlator,
# (2) a closed-loop DLL pulling an initial code offset epsilon to zero,
# (3) the thermal-noise code-jitter law sigma = sqrt(BL*delta/(2*C/N0)).
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)
R = lambda t: np.maximum(0.0, 1.0 - np.abs(t))     # PN autocorrelation triangle

# ---- (1) Discriminator S-curve ----
eps = np.arange(-1.5, 1.5, 0.01)
fig1, ax1 = plt.subplots(1, 2, figsize=(11, 4))
for i, delta in enumerate([1.0, 0.2]):
    E = R(eps + delta/2); L = R(eps - delta/2)
    Dcoh  = E - L
    Dnorm = (E**2 - L**2) / (E**2 + L**2 + 1e-12)
    ax1[i].plot(eps, Dcoh, lw=1.6, label='E-L (coherent)')
    ax1[i].plot(eps, Dnorm, '--', lw=1.6, label=r'$(E^2-L^2)/(E^2+L^2)$')
    ax1[i].axhline(0, color='k', ls=':'); ax1[i].axvline(0, color='k', ls=':')
    ax1[i].set_xlabel(r'code error $\epsilon$ (chips)'); ax1[i].set_ylabel(r'$D(\epsilon)$')
    ax1[i].grid(True); ax1[i].legend(loc='lower left')
    ax1[i].set_title(f'DLL S-curve, delta = {delta:.1f} chip')
fig1.tight_layout()

# ---- (2) Closed-loop DLL ----
delta, K, eps0, N = 0.5, 0.35, 0.4, 60
CN0 = 10**(42/10)          # C/N0 ratio (Hz) from 42 dB-Hz
T   = 1e-3                 # predetection integration time (s)
epsk = eps0; hist = [eps0]
for _ in range(N):
    E = R(epsk + delta/2); L = R(epsk - delta/2)
    noise = (1/np.sqrt(2*T*CN0)) * rng.standard_normal()   # correlator noise
    Dk = (E - L) + noise
    # D ~ -2*eps near lock (negative slope), so ADD K*D: eps <- eps*(1-2K) -> 0
    epsk = epsk + K*Dk                                       # NCO nulls the error
    hist.append(epsk)
fig2, ax2 = plt.subplots(figsize=(6, 4))
ax2.plot(range(N+1), hist, 'o-', lw=1.3)
ax2.axhline(0, color='k', ls='--'); ax2.grid(True)
ax2.set_xlabel('epoch'); ax2.set_ylabel(r'code error $\epsilon$ (chips)')
ax2.set_title('Closed-loop DLL: initial 0.4-chip offset pulled to lock')

# ---- (3) Code jitter vs C/N0 ----
CN0dB = np.arange(30, 51, 2); CN0lin = 10**(CN0dB/10); BL = 1.0
fig3, ax3 = plt.subplots(figsize=(6, 4))
for delta in [1.0, 0.5, 0.1]:
    sig = np.sqrt(BL*delta / (2*CN0lin))
    ax3.semilogy(CN0dB, sig, 'o-', lw=1.3, label=f'delta={delta}')
ax3.grid(True, which='both'); ax3.legend()
ax3.set_xlabel('C/N0 (dB-Hz)'); ax3.set_ylabel(r'code jitter $\sigma$ (chips)')
ax3.set_title('DLL code jitter: narrower delta and higher C/N0 win')
plt.tight_layout(); plt.show()
`,
    note: String.raw`The S-curve plots show the negative-going zero crossing at epsilon=0 (the stable lock point) and how a narrow correlator (delta=0.2) keeps the same central slope (-2 for the coherent E-L) while its plateau height (delta) and linear region (+/-delta/2) shrink — the narrow correlator's jitter advantage comes from correlated Early/Late noise cancelling in the difference, not from a steeper S-curve. The closed-loop run demonstrates the DLL nulling a 0.4-chip handover offset in a handful of epochs as the code NCO adjusts the local chipping rate. The jitter curves confirm the law sigma = sqrt(BL*delta/(2*C/N0)): convert C/N0 from dB-Hz to a linear ratio (10^(dBHz/10)) before using it, and note jitter drops as sqrt(delta) and as 1/sqrt(C/N0). Multiply a chip jitter by c/Rc to get the pseudorange error in metres.`
  }
});
