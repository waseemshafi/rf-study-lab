// split-bit-tracking.js — MATLAB + Python teaching code for the Split-Bit (Data-Transition) Tracking topic.
// Populates CONTENT_CODE['split-bit-tracking']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'split-bit-tracking': {
    matlab: String.raw`% Split-bit (data-transition) tracking -- the DTTL symbol synchronizer.
% Demonstrates: (1) the S-curve g(tau) = 2*A*pt*tau measured by simulation
% for two transition densities, confirming the slope is proportional to pt;
% (2) a closed-loop DTTL pulling an initial timing offset to zero, with the
% error gated to zero on no-transition symbols; (3) the thermal timing-jitter
% law sigma_lambda = sqrt(xi*BL*T/(4*pt*EsN0)) versus Es/N0.
rng(11);

A  = 1.0;      % NRZ amplitude
T  = 1.0;      % symbol time (normalized)
xi = 0.5;      % mid-phase window width, fraction of a symbol

% Per-symbol DTTL error sample (analytic model of the two integrators):
% lam   = normalized timing offset tau/T (estimate early for lam > 0)
% trans = 1 if this boundary has a data transition, else 0
% On a transition inside the window the gated error is 2*A*tau = 2*A*T*lam,
% clipped at the window edge; no transition -> gate closed -> zero.
dttl_e = @(lam, trans) trans .* 2*A*T .* max(-xi/2, min(xi/2, lam));

% ---- (1) S-curve by simulation for two transition densities ----
lams = -0.5:0.02:0.5;
Nsym = 4000;
figure; hold on;
for pbit = [0.5, 0.8]                       % P(bit = +1): 0.5 random, 0.8 biased
    a  = 2*(rand(1, Nsym) < pbit) - 1;      % i.i.d. +/-1 symbols
    tr = [0, a(2:end) ~= a(1:end-1)];       % transition indicator per boundary
    pt = 2*pbit*(1-pbit);                   % theoretical transition density
    g  = zeros(size(lams));
    for i = 1:numel(lams)
        g(i) = mean(dttl_e(lams(i), tr));   % average gated error over the data
    end
    plot(lams, g, 'LineWidth', 1.6, ...
        'DisplayName', sprintf('p_t = %.2f (slope 2Ap_t = %.2f)', pt, 2*A*pt));
end
grid on; xline(0,'k:'); yline(0,'k:');
xlabel('normalized offset \lambda = \tau/T'); ylabel('mean error g(\lambda)');
legend('Location','NorthWest');
title('DTTL S-curve: slope proportional to transition density');

% ---- (2) Closed-loop DTTL: pull a 0.2-symbol offset to zero ----
K     = 0.4;                 % first-order loop gain
lam   = 0.2;                 % initial timing offset (symbols)
Nrun  = 120;
EsN0  = 10^(10/10);          % Es/N0 = 10 dB, linear
sig_J = sqrt(xi*T/(2*EsN0)); % mid-phase integrator noise, N0*xi*T/2 with Es=A^2*T=1
a     = 2*(rand(1, Nrun+1) < 0.5) - 1;
hist  = zeros(1, Nrun);
for k = 1:Nrun
    trans = a(k+1) ~= a(k);                          % real data gating
    e = dttl_e(lam, trans) + trans*sig_J*randn;      % noise enters only when gated
    lam = lam - K*e/(2*A*T);                         % NCO epoch correction
    hist(k) = lam;
end
figure; plot(0:Nrun, [0.2 hist], 'o-', 'LineWidth', 1.2); grid on;
yline(0,'k--'); xlabel('symbol index'); ylabel('timing offset \lambda');
title('Closed-loop DTTL: coasts on no-transition symbols, corrects on edges');

% ---- (3) Timing jitter vs Es/N0 for two windows ----
EsN0dB = 0:2:16;  EsN0lin = 10.^(EsN0dB/10);
BLT = 0.02;  pt = 0.5;                       % BL*T product, random data
figure;
for xiv = [1.0, 0.25]
    sig = sqrt(xiv*BLT ./ (4*pt*EsN0lin));   % 1-sigma jitter (symbols)
    semilogy(EsN0dB, sig, 'o-', 'LineWidth', 1.3); hold on;
end
grid on; xlabel('E_s/N_0 (dB)'); ylabel('timing jitter \sigma_\lambda (symbols)');
legend('\xi = 1.0', '\xi = 0.25');
title('DTTL jitter: narrow window and strong signal win');
`,
    python: String.raw`# Split-bit (data-transition) tracking -- the DTTL symbol synchronizer.
# (1) S-curve g(tau) = 2*A*pt*tau by simulation for two transition densities,
# (2) closed-loop DTTL pulling an initial timing offset to zero (gated errors),
# (3) thermal timing-jitter law sigma_lambda = sqrt(xi*BL*T/(4*pt*EsN0)).
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(11)
A, T, xi = 1.0, 1.0, 0.5    # amplitude, symbol time, mid-phase window fraction

def dttl_e(lam, trans):
    """Gated DTTL error: 2*A*T*lam on transitions (clipped at the window
    edge +/- xi/2), zero when the transition gate is closed."""
    return trans * 2*A*T * np.clip(lam, -xi/2, xi/2)

# ---- (1) S-curve by simulation for two transition densities ----
lams = np.arange(-0.5, 0.52, 0.02)
Nsym = 4000
fig1, ax1 = plt.subplots(figsize=(7, 4))
for pbit in (0.5, 0.8):                       # P(bit=+1): random vs biased
    a  = np.where(rng.random(Nsym) < pbit, 1, -1)
    tr = np.concatenate(([0], (a[1:] != a[:-1]).astype(float)))
    pt = 2*pbit*(1-pbit)
    g  = [np.mean(dttl_e(l, tr)) for l in lams]
    ax1.plot(lams, g, lw=1.6, label=f'pt = {pt:.2f} (slope 2*A*pt = {2*A*pt:.2f})')
ax1.axhline(0, color='k', ls=':'); ax1.axvline(0, color='k', ls=':')
ax1.set_xlabel(r'normalized offset $\lambda=\tau/T$')
ax1.set_ylabel(r'mean error $g(\lambda)$')
ax1.grid(True); ax1.legend(loc='upper left')
ax1.set_title('DTTL S-curve: slope proportional to transition density')

# ---- (2) Closed-loop DTTL: pull a 0.2-symbol offset to zero ----
K, lam, Nrun = 0.4, 0.2, 120
EsN0  = 10**(10/10)                    # 10 dB, linear
sig_J = np.sqrt(xi*T/(2*EsN0))         # mid-phase noise: var = N0*xi*T/2, Es=1
a = np.where(rng.random(Nrun+1) < 0.5, 1, -1)
hist = [lam]
for k in range(Nrun):
    trans = float(a[k+1] != a[k])                     # real data gating
    e = dttl_e(lam, trans) + trans*sig_J*rng.standard_normal()
    lam = lam - K*e/(2*A*T)                           # NCO epoch correction
    hist.append(lam)
fig2, ax2 = plt.subplots(figsize=(7, 4))
ax2.plot(range(Nrun+1), hist, 'o-', lw=1.2, ms=3)
ax2.axhline(0, color='k', ls='--'); ax2.grid(True)
ax2.set_xlabel('symbol index'); ax2.set_ylabel(r'timing offset $\lambda$')
ax2.set_title('Closed-loop DTTL: coasts on no-transition symbols, corrects on edges')

# ---- (3) Timing jitter vs Es/N0 for two windows ----
EsN0dB  = np.arange(0, 17, 2); EsN0lin = 10**(EsN0dB/10)
BLT, pt = 0.02, 0.5
fig3, ax3 = plt.subplots(figsize=(7, 4))
for xiv in (1.0, 0.25):
    sig = np.sqrt(xiv*BLT / (4*pt*EsN0lin))
    ax3.semilogy(EsN0dB, sig, 'o-', lw=1.3, label=f'xi = {xiv}')
ax3.grid(True, which='both'); ax3.legend()
ax3.set_xlabel(r'$E_s/N_0$ (dB)')
ax3.set_ylabel(r'timing jitter $\sigma_\lambda$ (symbols)')
ax3.set_title('DTTL jitter: narrow window and strong signal win')
plt.tight_layout(); plt.show()
`,
    note: String.raw`The S-curve plots confirm the central DTTL facts: the mean error is linear through a stable zero crossing over the window +/- xi/2, and its slope equals 2*A*pt, so the biased data (pt = 0.32) pulls visibly less hard than random data (pt = 0.5). The closed-loop run shows the defining gating behaviour: the offset trace is flat wherever the data happens not to transition (the loop coasts) and steps toward zero at every detected edge. The jitter curves follow sigma_lambda = sqrt(xi*BL*T/(4*pt*Es/N0)): quartering the window halves the jitter with no change in central slope, exactly the narrow-correlator trade of the DLL. Convert Es/N0 from dB to linear (10^(dB/10)) before substituting, and remember the loop's effective update rate is pt/T, so sparse transitions also slow settling.`
  }
});
