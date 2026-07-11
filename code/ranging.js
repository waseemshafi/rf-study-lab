// ranging.js — MATLAB + Python teaching code for the Ranging (PN / Pseudorange) topic.
// Populates CONTENT_CODE['ranging']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'ranging': {
    matlab: String.raw`% Ranging (PN / Pseudorange).
% Demonstrates: (1) PN code-phase ranging -- delay a PN code, correlate against
% a local replica, find the correlation peak, interpolate it to sub-chip
% precision, and convert code phase to metres via the chip length c/Rc;
% (2) the pseudorange trick -- pseudoranges to 6 satellites are biased by a
% common receiver clock offset; Gauss-Newton least squares solves position
% AND clock bias together; (3) thermal ranging jitter sigma_R vs C/N0.
rng(11);
c = 3e8;                                  % speed of light (m/s)

% ---- (1) PN code-phase ranging by correlation ----
% Generate a 1023-chip m-sequence (10-stage LFSR, taps 10 and 3: x^10+x^3+1).
Nc = 1023; reg = ones(1,10); code = zeros(1,Nc);
for k = 1:Nc
    code(k) = reg(10);
    fb = xor(reg(10), reg(3));
    reg = [fb reg(1:9)];
end
code = 1 - 2*code;                        % 0/1 -> +1/-1 chips

Rc   = 1.023e6;                           % chip rate (chips/s), GPS C/A-like
os   = 4;                                 % samples per chip
x    = repelem(code, os);                 % oversampled code waveform
tau_true = 341.62;                        % true delay in CHIPS (sub-chip part!)
d_samp = tau_true*os;                     % desired delay in samples (fractional)
ki = floor(d_samp); fr = d_samp - ki;     % integer + fractional sample parts
rx   = (1-fr)*circshift(x,ki) + fr*circshift(x,ki+1);  % 2-tap fractional-sample delay
rx   = rx + 0.7*randn(size(rx));          % additive noise

% Circular correlation via FFT (fast sliding correlator over all lags).
Cf = ifft( fft(rx) .* conj(fft(x)) );
C  = real(Cf) / (Nc*os);                  % normalized correlation vs lag
[~, m] = max(C);                          % coarse peak (sample index)

% Sub-sample peak interpolation exact for a triangular apex:
% offset = (yp - ym) / (2*(y0 - min(ym,yp))), in samples.
ym = C(mod(m-2, numel(C))+1); y0 = C(m); yp = C(mod(m, numel(C))+1);
off = (yp - ym) / (2*(y0 - min(ym, yp)));
tau_hat_chips = ((m-1) + off) / os;       % measured code phase (chips)

chip_m  = c / Rc;                         % chip length (m): 293.3 m for C/A
R_hat   = tau_hat_chips * chip_m;         % measured range (m), modulo R_u
R_true  = tau_true * chip_m;
R_u     = Nc * chip_m;                    % unambiguous range = c*N*Tc
fprintf('true delay  %.3f chips -> %.1f m\n', tau_true, R_true);
fprintf('measured    %.3f chips -> %.1f m  (err %.2f m)\n', ...
        tau_hat_chips, R_hat, R_hat - R_true);
fprintf('chip length %.1f m, unambiguous range %.1f km\n', chip_m, R_u/1e3);
figure; plot((0:numel(C)-1)/os, C); grid on; hold on;
plot(tau_hat_chips, y0, 'rv');
xlabel('replica delay (chips)'); ylabel('correlation');
title('PN ranging: the peak position IS the delay measurement');

% ---- (2) Pseudorange positioning: solve (x,y,z) AND clock bias b ----
sat = 26.6e6 * [ 0.53  0.61  0.59;      % 6 satellite positions (m), ECEF-like
                -0.60  0.45  0.66;
                 0.66 -0.48  0.58;
                -0.35 -0.65  0.67;
                 0.05  0.90  0.43;
                 0.80  0.10  0.59];
r_true = [1.115e6; 6.10e5; 6.25e6];       % true receiver position (m)
b_true = 3e5;                             % clock bias: 1 ms at c=3e8 -> 300 km
rho = sqrt(sum((sat - r_true.').^2, 2)) + b_true + 1.5*randn(6,1);

est = [0; 0; 6.4e6; 0];                   % initial guess: surface, zero bias
for it = 1:6
    d    = sat - est(1:3).';              % vectors receiver -> satellites
    rng0 = sqrt(sum(d.^2, 2));
    u    = d ./ rng0;                     % unit line-of-sight vectors
    G    = [-u, ones(6,1)];               % geometry matrix rows [-u_i 1]
    dz   = rho - (rng0 + est(4));         % pseudorange residuals
    est  = est + (G \ dz);                % least-squares update
end
fprintf('\nposition error %.2f m, clock-bias error %.2f m\n', ...
        norm(est(1:3)-r_true), est(4)-b_true);
Q = inv(G.'*G);                           % DOP from final geometry
fprintf('GDOP %.2f  PDOP %.2f  TDOP %.2f\n', sqrt(trace(Q)), ...
        sqrt(trace(Q(1:3,1:3))), sqrt(Q(4,4)));

% ---- (3) Thermal ranging jitter vs C/N0 for two chip rates ----
CN0dB = 25:2:50; CN0 = 10.^(CN0dB/10);    % linear ratio (Hz)
BL = 0.5; delta = 0.2;                    % loop bandwidth (Hz), E-L spacing
figure;
for Rck = [1.023e6, 10.23e6]
    sigR = (c/Rck) * sqrt(BL*delta ./ (2*CN0));   % metres
    semilogy(CN0dB, sigR, 'o-', 'LineWidth', 1.3); hold on;
end
grid on; xlabel('C/N_0 (dB-Hz)'); ylabel('range jitter \sigma_R (m)');
legend('C/A 1.023 Mcps', 'P(Y) 10.23 Mcps');
title('Ranging jitter: ten times the chip rate = ten times finer ranging');
`,
    python: String.raw`# Ranging (PN / Pseudorange).
# (1) PN code-phase ranging: delay a PN code, correlate, interpolate the peak
#     to sub-chip precision, convert to metres via the chip length c/Rc;
# (2) pseudorange positioning: 6 biased pseudoranges, Gauss-Newton solves
#     position AND the common receiver clock bias; DOP from the geometry;
# (3) thermal ranging jitter sigma_R vs C/N0 for two chip rates.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(11)
c = 3e8                                   # speed of light (m/s)

# ---- (1) PN code-phase ranging by correlation ----
# 1023-chip m-sequence from a 10-stage LFSR (taps 10 and 3: x^10+x^3+1).
Nc = 1023
reg = np.ones(10, dtype=int)
code = np.zeros(Nc, dtype=int)
for k in range(Nc):
    code[k] = reg[9]
    fb = reg[9] ^ reg[2]
    reg = np.r_[fb, reg[:9]]
code = 1 - 2*code                         # 0/1 -> +1/-1 chips

Rc = 1.023e6                              # chip rate (GPS C/A-like)
os = 4                                    # samples per chip
x = np.repeat(code, os)                   # oversampled code waveform
tau_true = 341.62                         # true delay in CHIPS (note sub-chip part)
d_samp = tau_true*os                      # desired delay in samples (fractional)
ki = int(np.floor(d_samp)); fr = d_samp - ki   # integer + fractional sample parts
rx = (1-fr)*np.roll(x, ki) + fr*np.roll(x, ki+1)   # 2-tap fractional-sample delay
rx = rx + 0.7*rng.standard_normal(rx.size)

# Circular correlation via FFT = sliding correlator over every lag at once.
C = np.real(np.fft.ifft(np.fft.fft(rx) * np.conj(np.fft.fft(x)))) / (Nc*os)
m = int(np.argmax(C))                     # coarse peak (sample index)

# Sub-sample interpolation, exact for a triangular apex:
ym, y0, yp = C[(m-1) % C.size], C[m], C[(m+1) % C.size]
off = (yp - ym) / (2*(y0 - min(ym, yp)))
tau_hat = (m + off) / os                  # measured code phase (chips)

chip_m = c / Rc                           # 293.3 m per C/A chip
R_hat, R_true = tau_hat*chip_m, tau_true*chip_m
R_u = Nc * chip_m                         # unambiguous range = c*N*Tc
print(f'true delay  {tau_true:.3f} chips -> {R_true:.1f} m')
print(f'measured    {tau_hat:.3f} chips -> {R_hat:.1f} m (err {R_hat-R_true:.2f} m)')
print(f'chip length {chip_m:.1f} m, unambiguous range {R_u/1e3:.1f} km')
fig1, ax1 = plt.subplots(figsize=(7, 4))
ax1.plot(np.arange(C.size)/os, C)
ax1.plot(tau_hat, y0, 'rv')
ax1.set_xlabel('replica delay (chips)'); ax1.set_ylabel('correlation')
ax1.set_title('PN ranging: the peak position IS the delay measurement')
ax1.grid(True)

# ---- (2) Pseudorange positioning: solve (x,y,z) AND clock bias b ----
sat = 26.6e6 * np.array([[ 0.53,  0.61, 0.59],
                         [-0.60,  0.45, 0.66],
                         [ 0.66, -0.48, 0.58],
                         [-0.35, -0.65, 0.67],
                         [ 0.05,  0.90, 0.43],
                         [ 0.80,  0.10, 0.59]])
r_true = np.array([1.115e6, 6.10e5, 6.25e6])   # true receiver position (m)
b_true = 3e5                                   # 1 ms clock bias -> 300 km
rho = (np.linalg.norm(sat - r_true, axis=1) + b_true
       + 1.5*rng.standard_normal(6))           # measured pseudoranges (m)

est = np.array([0.0, 0.0, 6.4e6, 0.0])         # guess: surface, zero bias
for _ in range(6):
    d = sat - est[:3]
    rng0 = np.linalg.norm(d, axis=1)
    u = d / rng0[:, None]                      # unit line-of-sight vectors
    G = np.hstack([-u, np.ones((6, 1))])       # geometry matrix rows [-u_i 1]
    dz = rho - (rng0 + est[3])                 # residuals
    est = est + np.linalg.lstsq(G, dz, rcond=None)[0]
print(f'\nposition error {np.linalg.norm(est[:3]-r_true):.2f} m, '
      f'clock-bias error {est[3]-b_true:.2f} m')
Q = np.linalg.inv(G.T @ G)                     # DOP from the final geometry
print(f'GDOP {np.sqrt(np.trace(Q)):.2f}  PDOP {np.sqrt(np.trace(Q[:3,:3])):.2f}'
      f'  TDOP {np.sqrt(Q[3,3]):.2f}')

# ---- (3) Thermal ranging jitter vs C/N0 for two chip rates ----
CN0dB = np.arange(25, 51, 2); CN0 = 10**(CN0dB/10)
BL, delta = 0.5, 0.2                           # loop bandwidth (Hz), E-L spacing
fig2, ax2 = plt.subplots(figsize=(7, 4))
for Rck, lab in [(1.023e6, 'C/A 1.023 Mcps'), (10.23e6, 'P(Y) 10.23 Mcps')]:
    sigR = (c/Rck) * np.sqrt(BL*delta / (2*CN0))
    ax2.semilogy(CN0dB, sigR, 'o-', lw=1.3, label=lab)
ax2.grid(True, which='both'); ax2.legend()
ax2.set_xlabel('C/N0 (dB-Hz)'); ax2.set_ylabel('range jitter (m)')
ax2.set_title('Ranging jitter: 10x the chip rate = 10x finer ranging')
plt.tight_layout(); plt.show()
`,
    note: String.raw`Part (1) is the whole idea of PN ranging in a dozen lines: the FFT circular correlation is a sliding correlator over every lag at once, the peak lands at the true delay, and the triangular-apex interpolation reads it to a small fraction of a chip -- multiply by the chip length c/Rc (293.3 m for C/A) to get metres, remembering the answer wraps every c*N*Tc (300 km here). Part (2) shows why a pseudorange is solvable despite a 300-km clock bias: the bias is identical on all six satellites, so Gauss-Newton with geometry rows [-u_i 1] recovers position to metres AND the bias almost exactly; the printed DOPs come from inv(G'G) and grade the satellite geometry. Part (3) plots sigma_R = (c/Rc)*sqrt(BL*delta/(2*C/N0)): the decade gap between the two curves is purely the chip-rate ratio, and C/N0 must be converted from dB-Hz to a linear ratio before use.`
  }
});
