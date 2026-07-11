// tau-dither-tracking.js — MATLAB + Python teaching code for the Tau-Dither Loop Tracking topic.
// Populates CONTENT_CODE['tau-dither-tracking']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'tau-dither-tracking': {
    matlab: String.raw`% Tau-dither loop (TDL) code tracking: single correlator, dither + synchronous detection.
% Demonstrates: (1) the dither-modulated correlator output y(t) and how synchronous
% detection recovers the early-minus-late S-curve, (2) the discriminator S-curve vs
% code error, (3) a closed-loop TDL pulling an initial offset to zero, and
% (4) the dither (time-sharing) loss inflating jitter relative to a two-arm DLL.
rng(3);

R = @(t) max(0, 1 - abs(t));          % ideal PN autocorrelation triangle

% ---- (1) Dither-modulated output and synchronous detection (one epoch sweep) ----
D_spacing = 1.0;                       % early-late spacing Delta (chips)
eps_true  = 0.2;                       % code error (chips)
fs = 2000; T = 0.05; t = (0:1/fs:T-1/fs);
fd = 100;                              % dither rate (Hz), inside BL << fd << Rc
nh = fs/(2*fd);                        % samples per dither half-period
q  = repmat([ones(1,nh) -ones(1,nh)], 1, round(T*fd));  % exact 50/50 square wave +/-1
% single correlator sees code offset eps + (Delta/2)*q(t):
y  = R(eps_true + (D_spacing/2).*q);   % correlator output y(t) (amplitude A=1)
det = q .* y;                          % synchronous detector (multiply by dither)
Dbar = mean(det);                      % LPF (average) -> discriminator value
fprintf('eps=%.2f: synchronous-detector output D = %.4f (theory %.4f)\n', ...
        eps_true, Dbar, 0.5*(R(eps_true+D_spacing/2)-R(eps_true-D_spacing/2)));
figure; subplot(2,1,1); plot(t*1e3, y, 'LineWidth',1.2); grid on;
ylabel('y(t)'); title('Dither-modulated correlator output (ripple at f_d)');
subplot(2,1,2); plot(t*1e3, det, 'LineWidth',1.2); grid on;
xlabel('time (ms)'); ylabel('q(t)y(t)'); title('After synchronous detection (mean = D)');

% ---- (2) Discriminator S-curve D(eps) = (A/2)[R(eps+D/2)-R(eps-D/2)] ----
eps = -1.5:0.01:1.5;
figure;
for D_spacing = [1.0, 0.5]
    Dd = 0.5*(R(eps + D_spacing/2) - R(eps - D_spacing/2));
    plot(eps, Dd, 'LineWidth',1.5); hold on;
end
grid on; xline(0,'k:'); yline(0,'k:');
xlabel('code error \epsilon (chips)'); ylabel('D(\epsilon)');
legend('\Delta=1.0','\Delta=0.5'); title('Tau-dither S-curve (single correlator)');

% ---- (3) Closed-loop TDL: pull an initial offset to lock ----
D_spacing = 0.5; K = 0.6; eps0 = 0.35; N = 60;
CN0 = 10^(40/10); Tint = 10e-3; Ld = 1.4;  % 10 ms/epoch; Ld = dither loss (~+3 dB)
epsk = eps0; hist = zeros(1,N);
for k = 1:N
    Dtrue = 0.5*(R(epsk + D_spacing/2) - R(epsk - D_spacing/2));  % discriminator (slope -A near lock)
    n = Ld*(1/sqrt(2*Tint*CN0))*randn;      % noise inflated by dither loss
    Dk = Dtrue + n;
    epsk = epsk + K*Dk;                     % NCO update (D has negative slope)
    hist(k) = epsk;
end
figure; plot(0:N, [eps0 hist], 'o-','LineWidth',1.3); grid on;
yline(0,'k--'); xlabel('epoch'); ylabel('code error \epsilon (chips)');
title('Closed-loop tau-dither loop: initial offset pulled to lock');

% ---- (4) Jitter: TDL vs ideal DLL across C/N0 ----
CN0dB = 30:2:50; CN0lin = 10.^(CN0dB/10);
BL = 1; D_spacing = 0.5;
sigDLL = sqrt(BL*D_spacing ./ (2*CN0lin));
sigTDL = Ld * sigDLL;
figure; semilogy(CN0dB, sigDLL, 'o-','LineWidth',1.3); hold on;
semilogy(CN0dB, sigTDL, 's--','LineWidth',1.3); grid on;
xlabel('C/N_0 (dB-Hz)'); ylabel('code jitter \sigma (chips)');
legend('ideal 2-arm DLL','tau-dither (L_d=1.4)');
title('Tau-dither loss inflates jitter by ~1-3 dB');
`,
    python: String.raw`# Tau-dither loop (TDL) code tracking: single correlator, dither + synchronous detection.
# (1) dither-modulated output y(t) and synchronous-detection recovery of the S-curve,
# (2) discriminator S-curve vs code error, (3) closed-loop TDL pulling an offset to zero,
# (4) dither (time-sharing) loss inflating jitter relative to a two-arm DLL.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(3)
R = lambda t: np.maximum(0.0, 1.0 - np.abs(t))     # PN autocorrelation triangle

# ---- (1) Dither-modulated output and synchronous detection ----
D_spacing, eps_true = 1.0, 0.2
fs, T = 2000, 0.05
t = np.arange(0, T, 1/fs)
fd = 100.0                                          # dither rate (Hz)
nh = int(fs/(2*fd))                                 # samples per dither half-period
q = np.tile(np.r_[np.ones(nh), -np.ones(nh)], int(round(T*fd)))  # exact 50/50 square wave +/-1
y = R(eps_true + (D_spacing/2)*q)                   # single-correlator output (A=1)
det = q * y                                         # synchronous detector
Dbar = det.mean()                                   # LPF (average) -> discriminator
theory = 0.5*(R(eps_true+D_spacing/2) - R(eps_true-D_spacing/2))
print(f'eps={eps_true:.2f}: detector D = {Dbar:.4f} (theory {theory:.4f})')
fig1, ax1 = plt.subplots(2, 1, figsize=(7, 5))
ax1[0].plot(t*1e3, y, lw=1.2); ax1[0].grid(True)
ax1[0].set_ylabel('y(t)'); ax1[0].set_title('Dither-modulated output (ripple at f_d)')
ax1[1].plot(t*1e3, det, lw=1.2); ax1[1].grid(True)
ax1[1].set_xlabel('time (ms)'); ax1[1].set_ylabel('q(t)y(t)')
ax1[1].set_title('After synchronous detection (mean = D)')
fig1.tight_layout()

# ---- (2) Discriminator S-curve ----
eps = np.arange(-1.5, 1.5, 0.01)
fig2, ax2 = plt.subplots(figsize=(6, 4))
for D_spacing in [1.0, 0.5]:
    Dd = 0.5*(R(eps + D_spacing/2) - R(eps - D_spacing/2))
    ax2.plot(eps, Dd, lw=1.5, label=f'Delta={D_spacing}')
ax2.axhline(0, color='k', ls=':'); ax2.axvline(0, color='k', ls=':')
ax2.grid(True); ax2.legend()
ax2.set_xlabel(r'code error $\epsilon$ (chips)'); ax2.set_ylabel(r'$D(\epsilon)$')
ax2.set_title('Tau-dither S-curve (single correlator)')

# ---- (3) Closed-loop TDL ----
D_spacing, K, eps0, N = 0.5, 0.6, 0.35, 60
CN0 = 10**(40/10); Tint = 10e-3; Ld = 1.4          # 10 ms integrate per epoch
epsk = eps0; hist = [eps0]
for _ in range(N):
    Dtrue = 0.5*(R(epsk + D_spacing/2) - R(epsk - D_spacing/2))
    n = Ld*(1/np.sqrt(2*Tint*CN0))*rng.standard_normal()   # noise x dither loss
    Dk = Dtrue + n
    epsk = epsk + K*Dk                                      # NCO update
    hist.append(epsk)
fig3, ax3 = plt.subplots(figsize=(6, 4))
ax3.plot(range(N+1), hist, 'o-', lw=1.3); ax3.axhline(0, color='k', ls='--')
ax3.grid(True); ax3.set_xlabel('epoch'); ax3.set_ylabel(r'code error $\epsilon$ (chips)')
ax3.set_title('Closed-loop tau-dither loop: offset pulled to lock')

# ---- (4) Jitter: TDL vs ideal DLL ----
CN0dB = np.arange(30, 51, 2); CN0lin = 10**(CN0dB/10); BL = 1.0; D_spacing = 0.5
sigDLL = np.sqrt(BL*D_spacing / (2*CN0lin))
sigTDL = Ld * sigDLL
fig4, ax4 = plt.subplots(figsize=(6, 4))
ax4.semilogy(CN0dB, sigDLL, 'o-', lw=1.3, label='ideal 2-arm DLL')
ax4.semilogy(CN0dB, sigTDL, 's--', lw=1.3, label='tau-dither (Ld=1.4)')
ax4.grid(True, which='both'); ax4.legend()
ax4.set_xlabel('C/N0 (dB-Hz)'); ax4.set_ylabel(r'code jitter $\sigma$ (chips)')
ax4.set_title('Tau-dither loss inflates jitter by ~1-3 dB')
plt.tight_layout(); plt.show()
`,
    note: String.raw`Part (1) confirms the key mechanism: a single correlator dithered between the early and late positions produces a ripple at f_d, and multiplying by the dither q(t) then averaging (synchronous detection) returns the discriminator value D = (A/2)[R(eps+D/2)-R(eps-D/2)] — the printed detector output should match the theory line. Part (2) shows the S-curve with its negative-going zero-crossing at eps=0 and slope -A (for a triangular R). Part (3) closes the loop and pulls a 0.35-chip handover offset to lock. Part (4) plots the dither (time-sharing) loss: the tau-dither jitter sits a factor Ld (about 1.4, i.e. ~3 dB) above the ideal two-arm DLL. Remember to convert C/N0 from dB-Hz to a linear ratio (10^(dBHz/10)) before using the jitter formula.`
  }
});
