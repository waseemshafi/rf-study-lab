// RF link teaching code: RSSI, path-loss, and link-budget (MATLAB + Python).
Object.assign(CONTENT_CODE, {
  'rssi': {
    matlab: String.raw`% RSSI vs distance: path-loss + log-normal shadowing, distance estimation,
% and SNR derivation. Run in base MATLAB.
clear; close all; rng(1);

% --- Model parameters ---
d0     = 1;      % reference distance (m)
PL_d0  = 40;     % path loss at d0 (dB)
n      = 3.0;    % path-loss exponent
Ptx    = 20;     % transmit power (dBm)
sigma  = 4;      % shadowing std dev (dB)
Nf     = -100;   % noise floor (dBm)

% --- True distances and received power ---
d      = logspace(0, 2, 200);            % 1..100 m
PL     = PL_d0 + 10*n*log10(d/d0);       % log-distance path loss
shadow = sigma*randn(size(d));           % log-normal shadowing
RSSI   = Ptx - PL + shadow;              % measured RSSI (dBm)

% --- Estimate distance back from RSSI (invert model, ignore shadowing) ---
d_est  = d0 .* 10.^((Ptx - RSSI - PL_d0) ./ (10*n));
err    = d_est - d;                      % distance error (m)

% --- SNR from RSSI and noise floor ---
SNR    = RSSI - Nf;                      % dB

fprintf('mean |distance error| = %.2f m\n', mean(abs(err)));
fprintf('SNR range = %.1f .. %.1f dB\n', min(SNR), max(SNR));

% --- Plots ---
subplot(3,1,1);
semilogx(d, RSSI, '.'); grid on;
xlabel('distance (m)'); ylabel('RSSI (dBm)'); title('RSSI vs distance');

subplot(3,1,2);
loglog(d, abs(err)+eps, '.'); grid on;
xlabel('true distance (m)'); ylabel('|est error| (m)');
title('Distance estimation error');

subplot(3,1,3);
semilogx(d, SNR, '.'); grid on;
xlabel('distance (m)'); ylabel('SNR (dB)'); title('SNR from RSSI');
`,
    python: String.raw`# RSSI vs distance: path-loss + log-normal shadowing, distance estimation,
# and SNR derivation. Needs numpy + matplotlib.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(1)

# --- Model parameters ---
d0, PL_d0, n = 1.0, 40.0, 3.0   # ref distance (m), loss at d0 (dB), exponent
Ptx, sigma, Nf = 20.0, 4.0, -100.0  # tx power (dBm), shadowing std (dB), noise floor (dBm)

# --- True distances and received power ---
d = np.logspace(0, 2, 200)               # 1..100 m
PL = PL_d0 + 10 * n * np.log10(d / d0)   # log-distance path loss
shadow = sigma * rng.standard_normal(d.shape)
RSSI = Ptx - PL + shadow                 # measured RSSI (dBm)

# --- Estimate distance back from RSSI (invert model, ignore shadowing) ---
d_est = d0 * 10 ** ((Ptx - RSSI - PL_d0) / (10 * n))
err = d_est - d                          # distance error (m)

# --- SNR from RSSI and noise floor ---
SNR = RSSI - Nf                          # dB

print(f"mean |distance error| = {np.mean(np.abs(err)):.2f} m")
print(f"SNR range = {SNR.min():.1f} .. {SNR.max():.1f} dB")

# --- Plots ---
fig, ax = plt.subplots(3, 1, figsize=(7, 9))
ax[0].semilogx(d, RSSI, '.'); ax[0].set(xlabel='distance (m)', ylabel='RSSI (dBm)',
    title='RSSI vs distance'); ax[0].grid(True)
ax[1].loglog(d, np.abs(err) + 1e-12, '.'); ax[1].set(xlabel='true distance (m)',
    ylabel='|est error| (m)', title='Distance estimation error'); ax[1].grid(True)
ax[2].semilogx(d, SNR, '.'); ax[2].set(xlabel='distance (m)', ylabel='SNR (dB)',
    title='SNR from RSSI'); ax[2].grid(True)
plt.tight_layout(); plt.show()
`
  },
  'path-loss': {
    matlab: String.raw`% Free-space path loss (FSPL) vs distance for several frequencies, plus a
% log-distance exponent model. Shows the 6 dB/octave rule. Base MATLAB.
clear; close all;

% FSPL(dB) = 20log10(d_km) + 20log10(f_MHz) + 32.44
d_km  = logspace(-2, 1, 200);       % 0.01 .. 10 km
freqs = [900, 1800, 2400, 5000];    % MHz

figure; hold on; grid on;
for f = freqs
    FSPL = 20*log10(d_km) + 20*log10(f) + 32.44;
    semilogx(d_km, FSPL, 'LineWidth', 1.5, 'DisplayName', sprintf('%d MHz', f));
end

% Overlay path-loss-exponent models anchored at 1 km, 2400 MHz
d0   = 1;  f0 = 2400;
PL0  = 20*log10(d0) + 20*log10(f0) + 32.44;
for nn = [2, 3, 3.5]
    PLn = PL0 + 10*nn*log10(d_km/d0);
    semilogx(d_km, PLn, '--', 'DisplayName', sprintf('n = %.1f', nn));
end
set(gca, 'XScale', 'log');
xlabel('distance (km)'); ylabel('path loss (dB)');
title('FSPL and log-distance path loss'); legend('Location','SouthEast');

% --- Demonstrate 6 dB per octave (doubling distance) ---
f  = 2400;
d1 = 1; d2 = 2;                       % one octave in distance
PL1 = 20*log10(d1) + 20*log10(f) + 32.44;
PL2 = 20*log10(d2) + 20*log10(f) + 32.44;
fprintf('FSPL at 1 km: %.2f dB\n', PL1);
fprintf('FSPL at 2 km: %.2f dB\n', PL2);
fprintf('increase per octave: %.2f dB (expect ~6.02)\n', PL2 - PL1);
`,
    python: String.raw`# Free-space path loss (FSPL) vs distance for several frequencies, plus a
# log-distance exponent model. Shows the 6 dB/octave rule. numpy + matplotlib.
import numpy as np
import matplotlib.pyplot as plt

# FSPL(dB) = 20log10(d_km) + 20log10(f_MHz) + 32.44
d_km = np.logspace(-2, 1, 200)          # 0.01 .. 10 km
freqs = [900, 1800, 2400, 5000]         # MHz

plt.figure(figsize=(7, 5))
for f in freqs:
    FSPL = 20*np.log10(d_km) + 20*np.log10(f) + 32.44
    plt.semilogx(d_km, FSPL, lw=1.5, label=f"{f} MHz")

# Overlay path-loss-exponent models anchored at 1 km, 2400 MHz
d0, f0 = 1.0, 2400.0
PL0 = 20*np.log10(d0) + 20*np.log10(f0) + 32.44
for nn in (2, 3, 3.5):
    PLn = PL0 + 10*nn*np.log10(d_km / d0)
    plt.semilogx(d_km, PLn, '--', label=f"n = {nn}")

plt.xlabel('distance (km)'); plt.ylabel('path loss (dB)')
plt.title('FSPL and log-distance path loss'); plt.grid(True); plt.legend()

# --- Demonstrate 6 dB per octave (doubling distance) ---
f = 2400.0
PL1 = 20*np.log10(1) + 20*np.log10(f) + 32.44
PL2 = 20*np.log10(2) + 20*np.log10(f) + 32.44
print(f"FSPL at 1 km: {PL1:.2f} dB")
print(f"FSPL at 2 km: {PL2:.2f} dB")
print(f"increase per octave: {PL2 - PL1:.2f} dB (expect ~6.02)")
plt.tight_layout(); plt.show()
`
  },
  'link-budget': {
    matlab: String.raw`% Full link-budget calculator: print a line-by-line budget table, compute
% margin, sweep distance for max range, and plot margin vs distance. Base MATLAB.
clear; close all;

% --- Link parameters ---
Ptx   = 20;     % tx power (dBm)
Gtx   = 6;      % tx antenna gain (dBi)
Ltx   = 2;      % tx-side losses (dB)
Grx   = 6;      % rx antenna gain (dBi)
Lrx   = 2;      % rx-side losses (dB)
Lmisc = 3;      % misc/margin-eating losses (dB)
f_MHz = 2400;   % frequency (MHz)
B_Hz  = 1e6;    % bandwidth (Hz)
NF    = 6;      % receiver noise figure (dB)
SNRreq= 10;     % required SNR (dB)

% --- Receiver sensitivity: -174 + 10log10(B) + NF + SNRreq ---
sens = -174 + 10*log10(B_Hz) + NF + SNRreq;   % dBm

fspl = @(d_km) 20*log10(d_km) + 20*log10(f_MHz) + 32.44;
Prx  = @(d_km) Ptx + Gtx - Ltx - fspl(d_km) + Grx - Lrx - Lmisc;

% --- Line-by-line budget at a reference distance ---
d_ref = 1.0;    % km
fprintf('%-28s %8s\n', 'Item', 'Value');
fprintf('%-28s %8.2f dBm\n', 'Tx power',            Ptx);
fprintf('%-28s %8.2f dB\n',  'Tx antenna gain',      Gtx);
fprintf('%-28s %8.2f dB\n',  'Tx losses',           -Ltx);
fprintf('%-28s %8.2f dB\n',  'FSPL',                -fspl(d_ref));
fprintf('%-28s %8.2f dB\n',  'Rx antenna gain',      Grx);
fprintf('%-28s %8.2f dB\n',  'Rx losses',           -Lrx);
fprintf('%-28s %8.2f dB\n',  'Misc losses',         -Lmisc);
fprintf('%-28s %8.2f dBm\n', 'Rx power',             Prx(d_ref));
fprintf('%-28s %8.2f dBm\n', 'Sensitivity',          sens);
fprintf('%-28s %8.2f dB\n',  'MARGIN',               Prx(d_ref) - sens);

% --- Sweep distance to find max range where margin > 0 ---
d_km   = logspace(-2, 1.3, 400);
margin = Prx(d_km) - sens;
idx    = find(margin > 0, 1, 'last');
fprintf('\nmax range (margin>0): %.2f km\n', d_km(idx));

% --- Plot margin vs distance ---
figure; semilogx(d_km, margin, 'LineWidth', 1.5); grid on; hold on;
yline(0, 'r--'); xline(d_km(idx), 'k:');
xlabel('distance (km)'); ylabel('margin (dB)');
title('Link margin vs distance');
`,
    python: String.raw`# Full link-budget calculator: print a line-by-line budget table, compute
# margin, sweep distance for max range, and plot margin vs distance.
import numpy as np
import matplotlib.pyplot as plt

# --- Link parameters ---
Ptx, Gtx, Ltx = 20.0, 6.0, 2.0    # tx power (dBm), tx gain (dBi), tx loss (dB)
Grx, Lrx, Lmisc = 6.0, 2.0, 3.0   # rx gain (dBi), rx loss (dB), misc loss (dB)
f_MHz, B_Hz = 2400.0, 1e6         # frequency (MHz), bandwidth (Hz)
NF, SNRreq = 6.0, 10.0            # noise figure (dB), required SNR (dB)

# --- Receiver sensitivity: -174 + 10log10(B) + NF + SNRreq ---
sens = -174 + 10*np.log10(B_Hz) + NF + SNRreq   # dBm

def fspl(d_km):
    return 20*np.log10(d_km) + 20*np.log10(f_MHz) + 32.44

def prx(d_km):
    return Ptx + Gtx - Ltx - fspl(d_km) + Grx - Lrx - Lmisc

# --- Line-by-line budget at a reference distance ---
d_ref = 1.0  # km
rows = [
    ("Tx power (dBm)",       Ptx),
    ("Tx antenna gain (dB)", Gtx),
    ("Tx losses (dB)",       -Ltx),
    ("FSPL (dB)",            -fspl(d_ref)),
    ("Rx antenna gain (dB)", Grx),
    ("Rx losses (dB)",       -Lrx),
    ("Misc losses (dB)",     -Lmisc),
    ("Rx power (dBm)",        prx(d_ref)),
    ("Sensitivity (dBm)",     sens),
    ("MARGIN (dB)",           prx(d_ref) - sens),
]
print(f"{'Item':<24}{'Value':>10}")
for name, val in rows:
    print(f"{name:<24}{val:>10.2f}")

# --- Sweep distance to find max range where margin > 0 ---
d_km = np.logspace(-2, 1.3, 400)
margin = prx(d_km) - sens
idx = np.where(margin > 0)[0][-1]
print(f"\nmax range (margin>0): {d_km[idx]:.2f} km")

# --- Plot margin vs distance ---
plt.figure(figsize=(7, 5))
plt.semilogx(d_km, margin, lw=1.5)
plt.axhline(0, color='r', ls='--'); plt.axvline(d_km[idx], color='k', ls=':')
plt.xlabel('distance (km)'); plt.ylabel('margin (dB)')
plt.title('Link margin vs distance'); plt.grid(True)
plt.tight_layout(); plt.show()
`
  }
});
