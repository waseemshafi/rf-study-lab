// dsss-acquisition.js — MATLAB + Python teaching code for the DSSS Acquisition topic.
// Populates CONTENT_CODE['dsss-acquisition']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'dsss-acquisition': {
    matlab: String.raw`% DSSS acquisition: serial (sliding-correlator) vs FFT parallel code-phase search.
% Simulates a length-31 m-sequence, offsets the incoming code by an unknown phase
% and Doppler, then (1) sweeps code phase serially with non-coherent Z=I^2+Q^2,
% and (2) recovers ALL code phases at once by FFT circular correlation.
rng(7);
N   = 31;                          % PN code length (chips)
fs  = 4;                           % samples per chip
EbN0dB = 6;                        % chip SNR (dB) for the demo
% --- length-31 m-sequence (taps x^5 + x^2 + 1) ---
reg = [1 0 0 0 0]; c = zeros(1,N);
for k = 1:N
    c(k) = reg(end);
    fb = xor(reg(5), reg(2));
    reg = [fb reg(1:4)];
end
c = 2*c - 1;                       % map {0,1} -> {-1,+1}
cs = kron(c, ones(1,fs));          % oversampled code

trueDelay = 12;                    % unknown code phase (chips) to be found
fd = 0.002;                        % small residual Doppler (cycles/sample); kept
                                   % well below 1/(dwell) so the peak survives
n  = 0:numel(cs)-1;
rx = circshift(cs, trueDelay*fs) .* exp(1j*2*pi*fd*n);   % delayed + Doppler-rotated
sigma = 10^(-EbN0dB/20);
rx = rx + sigma*(randn(size(rx)) + 1j*randn(size(rx)))/sqrt(2);

% ---------- (1) SERIAL non-coherent search over 2N half-chip cells ----------
step = fs/2;                       % half-chip step (samples)
cells = 0:(2*N-1);
Z = zeros(size(cells));
for m = 1:numel(cells)
    local = circshift(cs, cells(m)*step);         % local replica at trial phase
    corr  = sum(rx .* conj(local));               % complex correlation over dwell
    Z(m)  = abs(corr)^2;                          % non-coherent Z = I^2 + Q^2
end
Z = Z / max(Z);
[~, idx] = max(Z);
estDelay_serial = cells(idx)*step/fs;             % in chips

% ---------- (2) FFT parallel code-phase search (all phases at once) ----------
R = fft(rx);
C = fft(cs);
xcorr_circ = abs(ifft(R .* conj(C))).^2;          % circular correlation, all phases
xcorr_circ = xcorr_circ / max(xcorr_circ);
[~, pk] = max(xcorr_circ);
estDelay_fft = (pk-1)/fs;                          % in chips

fprintf('True code phase   : %d chips\n', trueDelay);
fprintf('Serial estimate   : %.1f chips\n', estDelay_serial);
fprintf('FFT estimate      : %.1f chips\n', estDelay_fft);

% Threshold from a target Pfa (Gaussian model on the amplitude)
Q    = @(x) 0.5*erfc(x/sqrt(2));
Qinv = @(p) sqrt(2)*erfcinv(2*p);
Pfa_target = 1e-3;
sigZ = std(sqrt(Z(Z < 0.3)));                     % rough noise-floor std of amplitude
Vt   = sigZ * Qinv(Pfa_target);
fprintf('Threshold (%.0e Pfa): %.3f (in normalized amplitude)\n', Pfa_target, Vt);

figure;
subplot(2,1,1); stem(cells, Z, 'filled'); grid on;
xlabel('half-chip cell'); ylabel('Z (norm)'); title('Serial non-coherent search: Z=I^2+Q^2');
subplot(2,1,2); plot((0:numel(xcorr_circ)-1)/fs, xcorr_circ, 'LineWidth', 1.2); grid on;
xlabel('code phase (chips)'); ylabel('|corr|^2 (norm)'); title('FFT parallel code-phase search (all phases at once)');
`,
    python: String.raw`# DSSS acquisition: serial (sliding-correlator) vs FFT parallel code-phase search.
# Builds a length-31 m-sequence, applies an unknown code phase + residual Doppler,
# then (1) sweeps half-chip cells with a non-coherent detector Z = I^2 + Q^2, and
# (2) recovers all code phases at once via FFT circular correlation (the GPS trick).
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc, erfcinv

rng = np.random.default_rng(7)
Q    = lambda x: 0.5*erfc(x/np.sqrt(2))
Qinv = lambda p: np.sqrt(2)*erfcinv(2*p)

N, fs = 31, 4                       # code length (chips), samples per chip
EbN0dB = 6

# length-31 m-sequence, taps x^5 + x^2 + 1
reg = [1, 0, 0, 0, 0]; c = []
for _ in range(N):
    c.append(reg[-1])
    fb = reg[4] ^ reg[1]
    reg = [fb] + reg[:4]
c  = 2*np.array(c) - 1              # {0,1} -> {-1,+1}
cs = np.repeat(c, fs).astype(complex)   # oversampled code

true_delay = 12                     # unknown code phase (chips)
fd = 0.002                          # residual Doppler (cycles/sample), kept well
                                    # below 1/(dwell) so the peak survives
n  = np.arange(cs.size)
rx = np.roll(cs, true_delay*fs) * np.exp(1j*2*np.pi*fd*n)
sigma = 10**(-EbN0dB/20)
rx = rx + sigma*(rng.standard_normal(cs.size) + 1j*rng.standard_normal(cs.size))/np.sqrt(2)

# ---------- (1) serial non-coherent search over 2N half-chip cells ----------
step  = fs//2
cells = np.arange(2*N)
Z = np.empty(cells.size)
for m, cell in enumerate(cells):
    local = np.roll(cs, cell*step)
    corr  = np.sum(rx * np.conj(local))     # complex correlation over the dwell
    Z[m]  = np.abs(corr)**2                  # non-coherent Z = I^2 + Q^2
Z /= Z.max()
est_serial = cells[np.argmax(Z)]*step/fs

# ---------- (2) FFT parallel code-phase search (all phases in one shot) ----------
R = np.fft.fft(rx)
C = np.fft.fft(cs)
xcorr_circ = np.abs(np.fft.ifft(R*np.conj(C)))**2   # circular correlation
xcorr_circ /= xcorr_circ.max()
est_fft = np.argmax(xcorr_circ)/fs

print(f"True code phase : {true_delay} chips")
print(f"Serial estimate : {est_serial:.1f} chips")
print(f"FFT estimate    : {est_fft:.1f} chips")

# Threshold from a target Pfa (Gaussian model on the amplitude)
Pfa_target = 1e-3
sigZ = np.std(np.sqrt(Z[Z < 0.3]))          # rough noise-floor amplitude std
Vt   = sigZ * Qinv(Pfa_target)
print(f"Threshold (Pfa={Pfa_target:.0e}): {Vt:.3f} (normalized amplitude)")

fig, ax = plt.subplots(2, 1, figsize=(9, 6))
ax[0].stem(cells, Z)
ax[0].set_xlabel('half-chip cell'); ax[0].set_ylabel('Z (norm)')
ax[0].set_title('Serial non-coherent search: Z = I^2 + Q^2'); ax[0].grid(True)
ax[1].plot(np.arange(xcorr_circ.size)/fs, xcorr_circ, lw=1.2)
ax[1].set_xlabel('code phase (chips)'); ax[1].set_ylabel('|corr|^2 (norm)')
ax[1].set_title('FFT parallel code-phase search (all phases at once)'); ax[1].grid(True)
plt.tight_layout(); plt.show()
`,
    note: String.raw`Both scripts hide the incoming code at an unknown phase (and a small Doppler) and then find it two ways. The serial search dwells on each of the 2N half-chip cells with a non-coherent detector Z = I^2 + Q^2 (needed because the carrier phase is unknown), while the FFT method computes the circular correlation R * conj(C) and inverse-transforms to reveal ALL code phases in a single pass — the huge speed-up used in GPS. Both should report a code-phase estimate at the true delay (12 chips). The threshold is set from a target false-alarm probability via Vt = sigma * Qinv(Pfa), the Neyman-Pearson rule.`
  }
});
