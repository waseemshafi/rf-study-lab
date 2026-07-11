// sliding-correlator.js — MATLAB + Python teaching code for the Sliding Correlator topic.
// Populates CONTENT_CODE['sliding-correlator']. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'sliding-correlator': {
    matlab: String.raw`% Sliding correlator: serial-search acquisition and STDCC channel sounding.
% Demonstrates: (1) the PN autocorrelation triangle a searcher hunts for,
% (2) a serial search sliding a replica in half-chip steps until the peak is
% found, (3) the STDCC time-dilation: correlating against a slightly slow
% replica (f - df) stretches a multipath impulse response by k = f/df.
rng(3);

% ---- Build a maximal-length PN code (m-sequence, N = 2^m - 1) ----
m = 7; N = 2^m - 1;                 % 127-chip code
taps = [7 6];                        % primitive polynomial x^7 + x^6 + 1
reg = ones(1,m); pn = zeros(1,N);
for i = 1:N
    pn(i) = reg(m);
    fb = mod(sum(reg(taps)),2);
    reg = [fb reg(1:m-1)];
end
c = 2*pn - 1;                        % map {0,1} -> {-1,+1}

% ---- (1) Circular autocorrelation: the triangle/thumbtack ----
Rxx = zeros(1,N);
for s = 0:N-1
    Rxx(s+1) = sum(c .* circshift(c,[0 s])) / N;
end
figure; stem(0:N-1, Rxx, 'filled'); grid on;
xlabel('code shift (chips)'); ylabel('R(shift)');
title(sprintf('PN autocorrelation: peak 1, floor -1/N = %.3f', -1/N));

% ---- (2) Serial search: slide replica in half-chip steps to the peak ----
true_delay = 40;                     % unknown incoming code phase (chips)
os = 2;                              % 2 samples/chip -> half-chip steps
cs = repelem(c, os);                 % code sampled at 2 samples/chip
rx = repmat(circshift(cs,[0 os*true_delay]), 1, 4);  % a few periods
rx = rx + 0.7*randn(size(rx));                       % plus noise
cells = 2*N; corrOut = zeros(1,cells); Td = os*N;    % dwell = one period
for k = 0:cells-1
    rep = circshift(cs, [0 k]);                    % k half-chip shifts
    seg = rx(1:Td);
    corrOut(k+1) = abs(sum(seg .* rep)) / Td;      % integrate-and-dump
end
thr = 0.5;                                          % detection threshold
hitCell = find(corrOut > thr, 1);
figure; plot((0:cells-1)/os, corrOut, 'LineWidth',1.2); hold on;
yline(thr,'r--'); grid on;
xlabel('replica phase (chips)'); ylabel('|correlation|');
title(sprintf('Serial search: peak found near chip %d (true = %d)', ...
      round((hitCell-1)/os), true_delay));

% ---- (3) STDCC time dilation: k = f / df ----
f  = 200e6;   df = 25e3;             % chip rate and slide offset
kdil = f/df;                         % slide (time-dilation) factor
Tc = 1/f;                            % chip duration (real delay per chip)
delays_ns = [0 30 80];              % three multipath echoes (ns)
gains     = [1 0.6 0.35];
tau_out = (delays_ns*1e-9) * kdil;   % dilated output arrival times (s)
fprintf('Slide factor k = f/df = %g\n', kdil);
fprintf('Chip = %.1f ns real -> %.1f us output; PG = %.1f dB\n', ...
        Tc*1e9, (Tc*kdil)*1e6, 10*log10(kdil));
figure; stem(tau_out*1e6, gains, 'filled'); grid on;
xlabel('dilated output time (\mus)'); ylabel('relative amplitude');
title(sprintf('STDCC: real delays %s ns stretched by k = %g', ...
      mat2str(delays_ns), kdil));
`,
    python: String.raw`# Sliding correlator: serial-search acquisition and STDCC channel sounding.
# (1) PN autocorrelation triangle the searcher hunts for,
# (2) a serial search sliding a replica in half-chip steps to the peak,
# (3) STDCC time-dilation: correlating against a slow replica (f - df)
#     stretches a multipath impulse response by the slide factor k = f/df.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(3)

# ---- Build a maximal-length PN code (m-sequence, N = 2^m - 1) ----
m = 7; N = 2**m - 1                     # 127-chip code
taps = [7, 6]                           # primitive poly x^7 + x^6 + 1
reg = np.ones(m, dtype=int); pn = np.zeros(N, dtype=int)
for i in range(N):
    pn[i] = reg[-1]
    fb = np.sum(reg[[t-1 for t in taps]]) % 2
    reg = np.concatenate(([fb], reg[:-1]))
c = 2*pn - 1                            # map {0,1} -> {-1,+1}

# ---- (1) Circular autocorrelation: the triangle/thumbtack ----
Rxx = np.array([np.sum(c * np.roll(c, s)) / N for s in range(N)])
fig1, ax1 = plt.subplots(figsize=(6,4))
ax1.stem(np.arange(N), Rxx)
ax1.set_xlabel('code shift (chips)'); ax1.set_ylabel('R(shift)'); ax1.grid(True)
ax1.set_title(f'PN autocorrelation: peak 1, floor -1/N = {-1/N:.3f}')

# ---- (2) Serial search: slide replica in half-chip steps to the peak ----
true_delay = 40                         # unknown incoming code phase (chips)
os = 2                                  # 2 samples/chip -> half-chip steps
cs = np.repeat(c, os)                   # code sampled at 2 samples/chip
rx = np.tile(np.roll(cs, os*true_delay), 4).astype(float)
rx += 0.7*rng.standard_normal(rx.size)
cells = 2*N; Td = os*N; corr = np.zeros(cells)
for k in range(cells):
    rep = np.roll(cs, k)                # k half-chip shifts
    corr[k] = abs(np.sum(rx[:Td] * rep)) / Td
thr = 0.5
hit = np.argmax(corr > thr)
fig2, ax2 = plt.subplots(figsize=(6,4))
ax2.plot(np.arange(cells)/os, corr, lw=1.2)
ax2.axhline(thr, color='r', ls='--'); ax2.grid(True)
ax2.set_xlabel('replica phase (chips)'); ax2.set_ylabel('|correlation|')
ax2.set_title(f'Serial search: peak near chip {int(round(hit/os))} (true = {true_delay})')

# ---- (3) STDCC time dilation: k = f / df ----
f, df = 200e6, 25e3                     # chip rate, slide offset
kdil = f/df                            # slide (time-dilation) factor
Tc = 1/f                               # chip duration (real delay per chip)
delays_ns = np.array([0, 30, 80]); gains = np.array([1, 0.6, 0.35])
tau_out = (delays_ns*1e-9) * kdil      # dilated output arrival times (s)
print(f'Slide factor k = f/df = {kdil:g}')
print(f'Chip = {Tc*1e9:.1f} ns real -> {Tc*kdil*1e6:.1f} us output; '
      f'PG = {10*np.log10(kdil):.1f} dB')
fig3, ax3 = plt.subplots(figsize=(6,4))
ax3.stem(tau_out*1e6, gains)
ax3.set_xlabel('dilated output time (us)'); ax3.set_ylabel('relative amplitude')
ax3.grid(True); ax3.set_title(f'STDCC: real delays {delays_ns} ns stretched by k = {kdil:g}')
plt.tight_layout(); plt.show()
`,
    note: String.raw`Part (1) builds a real 127-chip m-sequence and plots its autocorrelation: a peak of 1 at zero shift and a flat floor of -1/N = -0.0079 everywhere else -- the thumbtack the sliding correlator hunts for. Part (2) slides a local replica in half-chip steps across all 2N cells, integrating each dwell and thresholding; the peak lands at the true code phase (40 chips), illustrating serial search. Part (3) computes the STDCC slide factor k = f/df = 200 MHz / 25 kHz = 8000, so 5 ns real chips are stretched to 40 us of output (processing gain 10*log10(8000) approximately 39 dB) and three multipath echoes at 0/30/80 ns appear at 0/240/640 us on the dilated axis -- the same fine 5 ns resolution, just slow enough for a cheap ADC. Increase df for faster snapshots at lower sensitivity; lengthen the code N for a wider unambiguous window.`
  }
});
