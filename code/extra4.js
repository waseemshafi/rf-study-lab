// extra4.js — MATLAB + Python teaching code for 5 probability/comms topics.
// Populates the global CONTENT_CODE map. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'normal-distribution': {
    matlab: String.raw`% Normal (Gaussian) distribution: sample it, compare to the analytic PDF,
% check the 68/95/99.7 rule, and watch the sample mean converge (CLT).
rng(1);
mu = 2.0; sig = 1.5;              % mean and standard deviation
N  = 100000;
x  = mu + sig*randn(1, N);        % Gaussian samples

% --- Histogram (as density) vs the analytic PDF ---
figure; subplot(2,1,1);
edges = linspace(mu-5*sig, mu+5*sig, 60);
histogram(x, edges, 'Normalization', 'pdf'); hold on; grid on;
xx  = linspace(mu-5*sig, mu+5*sig, 400);
pdf = 1./(sig*sqrt(2*pi)) .* exp(-(xx-mu).^2 ./ (2*sig^2));
plot(xx, pdf, 'LineWidth', 1.6);
xlabel('x'); ylabel('density'); title('Gaussian samples vs analytic PDF');
legend('histogram', 'PDF');

% --- Empirical 68/95/99.7 rule ---
for k = 1:3
    frac = mean(abs(x-mu) <= k*sig);
    fprintf('within %d sigma: %.2f%% (theory %.1f%%)\n', ...
        k, 100*frac, 100*(erf(k/sqrt(2))));
end

% --- Sample mean converges to mu as N grows (law of large numbers / CLT) ---
run = cumsum(x) ./ (1:N);
subplot(2,1,2);
semilogx(1:N, run, 'LineWidth', 1.1); hold on; grid on;
yline(mu, 'k--');
xlabel('number of samples'); ylabel('running mean');
title('Sample mean converging to \mu');
`,
    python: String.raw`# Normal (Gaussian) distribution: sample it, compare to the analytic PDF,
# check the 68/95/99.7 rule, and watch the sample mean converge (CLT).
import numpy as np
import matplotlib.pyplot as plt
from math import erf

rng = np.random.default_rng(1)
mu, sig, N = 2.0, 1.5, 100000
x = mu + sig*rng.standard_normal(N)          # Gaussian samples

fig, ax = plt.subplots(2, 1, figsize=(7, 7))
edges = np.linspace(mu-5*sig, mu+5*sig, 60)
ax[0].hist(x, bins=edges, density=True, alpha=0.6, label="histogram")
xx = np.linspace(mu-5*sig, mu+5*sig, 400)
pdf = 1/(sig*np.sqrt(2*np.pi)) * np.exp(-(xx-mu)**2 / (2*sig**2))
ax[0].plot(xx, pdf, lw=1.6, label="PDF"); ax[0].grid(True); ax[0].legend()
ax[0].set(xlabel="x", ylabel="density", title="Gaussian samples vs analytic PDF")

# Empirical 68/95/99.7 rule
for k in (1, 2, 3):
    frac = np.mean(np.abs(x-mu) <= k*sig)
    print(f"within {k} sigma: {100*frac:.2f}% (theory {100*erf(k/np.sqrt(2)):.1f}%)")

# Sample mean converges to mu (law of large numbers / CLT)
run = np.cumsum(x) / np.arange(1, N+1)
ax[1].semilogx(np.arange(1, N+1), run, lw=1.1)
ax[1].axhline(mu, color='k', ls='--'); ax[1].grid(True)
ax[1].set(xlabel="number of samples", ylabel="running mean",
          title="Sample mean converging to mu")
plt.tight_layout(); plt.show()
`
  },

  'error-function': {
    matlab: String.raw`% Error function family: erf, erfc, and the Gaussian tail Q(x).
% Key identity: Q(x) = 0.5*erfc(x/sqrt(2)).  Then use it for BPSK BER.
x = linspace(-3, 3, 400);

figure; subplot(2,1,1);
plot(x, erf(x),  'LineWidth', 1.4); hold on; grid on;
plot(x, erfc(x), 'LineWidth', 1.4);
Q = 0.5*erfc(x/sqrt(2));                 % Gaussian upper-tail probability
plot(x, Q, 'LineWidth', 1.4);
xlabel('x'); ylabel('value');
legend('erf(x)', 'erfc(x)', 'Q(x)=0.5 erfc(x/\surd2)');
title('erf, erfc, and the Q-function');

% --- Verify the identity numerically ---
err = max(abs(Q - 0.5*erfc(x/sqrt(2))));
fprintf('max |Q(x) - 0.5*erfc(x/sqrt2)| = %.2e (should be ~0)\n', err);

% --- BPSK bit error rate over AWGN:  BER = Q(sqrt(2*Eb/N0)) ---
EbN0dB = 0:1:10;
EbN0   = 10.^(EbN0dB/10);
BER    = 0.5*erfc(sqrt(EbN0));            % = Q(sqrt(2*EbN0))
subplot(2,1,2);
semilogy(EbN0dB, BER, '-o', 'LineWidth', 1.4); grid on;
xlabel('Eb/N0 (dB)'); ylabel('BER');
title('BPSK BER = Q(\surd(2 Eb/N0))');
`,
    python: String.raw`# Error function family: erf, erfc, and the Gaussian tail Q(x).
# Key identity: Q(x) = 0.5*erfc(x/sqrt(2)).  Then use it for BPSK BER.
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erf, erfc

x = np.linspace(-3, 3, 400)

fig, ax = plt.subplots(2, 1, figsize=(7, 7))
ax[0].plot(x, erf(x),  lw=1.4, label="erf(x)")
ax[0].plot(x, erfc(x), lw=1.4, label="erfc(x)")
Q = 0.5*erfc(x/np.sqrt(2))               # Gaussian upper-tail probability
ax[0].plot(x, Q, lw=1.4, label="Q(x)=0.5 erfc(x/sqrt2)")
ax[0].grid(True); ax[0].legend()
ax[0].set(xlabel="x", ylabel="value", title="erf, erfc, and the Q-function")

# Verify the identity numerically
err = np.max(np.abs(Q - 0.5*erfc(x/np.sqrt(2))))
print(f"max |Q(x) - 0.5*erfc(x/sqrt2)| = {err:.2e} (should be ~0)")

# BPSK bit error rate over AWGN:  BER = Q(sqrt(2*Eb/N0))
EbN0dB = np.arange(0, 11)
EbN0 = 10**(EbN0dB/10)
BER = 0.5*erfc(np.sqrt(EbN0))            # = Q(sqrt(2*EbN0))
ax[1].semilogy(EbN0dB, BER, '-o', lw=1.4); ax[1].grid(True)
ax[1].set(xlabel="Eb/N0 (dB)", ylabel="BER", title="BPSK BER = Q(sqrt(2 Eb/N0))")
plt.tight_layout(); plt.show()
`
  },

  'rayleigh-distribution': {
    matlab: String.raw`% Rayleigh distribution: envelope R=sqrt(I^2+Q^2) of two i.i.d. Gaussians.
% Compare histogram to the PDF r/sig^2 * exp(-r^2/2sig^2); mark mean and mode;
% then show a fading envelope over time with characteristic deep fades.
rng(2);
sig = 1.0; N = 100000;
I = sig*randn(1, N); Q = sig*randn(1, N);   % in-phase and quadrature
R = sqrt(I.^2 + Q.^2);                       % Rayleigh envelope

figure; subplot(2,1,1);
histogram(R, 60, 'Normalization', 'pdf'); hold on; grid on;
r   = linspace(0, max(R), 400);
pdf = r./sig^2 .* exp(-r.^2 ./ (2*sig^2));   % Rayleigh PDF
plot(r, pdf, 'LineWidth', 1.6);
meanR = sig*sqrt(pi/2);                       % theoretical mean
modeR = sig;                                  % theoretical mode (peak of PDF)
xline(meanR, 'k--'); xline(modeR, 'r:');
xlabel('r'); ylabel('density'); title('Rayleigh envelope: histogram vs PDF');
legend('histogram', 'PDF', 'mean=\sigma\surd(\pi/2)', 'mode=\sigma');
fprintf('empirical mean %.3f, theory %.3f; mode ~ %.3f\n', mean(R), meanR, modeR);

% --- Fading envelope vs time (correlated) with deep fades ---
M  = 800; h = (randn(1,M) + 1j*randn(1,M))/sqrt(2);
h  = filter(ones(1,8)/8, 1, h);              % smooth -> time-correlated fading
env = 20*log10(abs(h) + 1e-6);
subplot(2,1,2);
plot(env, 'LineWidth', 1.0); grid on; hold on;
yline(-10, 'r--');
xlabel('time (samples)'); ylabel('|h| (dB)');
title('Fading envelope: dips below -10 dB are deep fades');
`,
    python: String.raw`# Rayleigh distribution: envelope R=sqrt(I^2+Q^2) of two i.i.d. Gaussians.
# Compare histogram to the PDF r/sig^2 * exp(-r^2/2sig^2); mark mean and mode;
# then show a fading envelope over time with characteristic deep fades.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2)
sig, N = 1.0, 100000
I = sig*rng.standard_normal(N)
Q = sig*rng.standard_normal(N)
R = np.sqrt(I**2 + Q**2)                      # Rayleigh envelope

fig, ax = plt.subplots(2, 1, figsize=(7, 7))
ax[0].hist(R, bins=60, density=True, alpha=0.6, label="histogram")
r = np.linspace(0, R.max(), 400)
pdf = r/sig**2 * np.exp(-r**2 / (2*sig**2))   # Rayleigh PDF
ax[0].plot(r, pdf, lw=1.6, label="PDF")
meanR = sig*np.sqrt(np.pi/2)                  # theoretical mean
modeR = sig                                   # theoretical mode
ax[0].axvline(meanR, color='k', ls='--', label="mean=sig*sqrt(pi/2)")
ax[0].axvline(modeR, color='r', ls=':',  label="mode=sig")
ax[0].grid(True); ax[0].legend()
ax[0].set(xlabel="r", ylabel="density", title="Rayleigh envelope: histogram vs PDF")
print(f"empirical mean {R.mean():.3f}, theory {meanR:.3f}; mode ~ {modeR:.3f}")

# Fading envelope vs time (time-correlated) with deep fades
M = 800
h = (rng.standard_normal(M) + 1j*rng.standard_normal(M))/np.sqrt(2)
h = np.convolve(h, np.ones(8)/8, mode='same')   # smooth -> correlated fading
env = 20*np.log10(np.abs(h) + 1e-6)
ax[1].plot(env, lw=1.0); ax[1].axhline(-10, color='r', ls='--')
ax[1].grid(True)
ax[1].set(xlabel="time (samples)", ylabel="|h| (dB)",
          title="Fading envelope: dips below -10 dB are deep fades")
plt.tight_layout(); plt.show()
`
  },

  'awgn': {
    matlab: String.raw`% AWGN channel: add Gaussian noise to a BPSK signal at a target Eb/N0,
% scatter the noisy samples, count bit errors, and compare to theory.
rng(4);
Nbits = 200000;
EbN0dB = 7;                               % target Eb/N0 (dB)
EbN0   = 10^(EbN0dB/10);

bits = randi([0 1], 1, Nbits);
s    = 1 - 2*bits;                        % BPSK: 0->+1, 1->-1 (Eb = 1)
sigma = sqrt(1/(2*EbN0));                 % noise std for Eb=1, Es/N0=Eb/N0
r    = s + sigma*randn(1, Nbits);         % received = signal + AWGN

% --- Detect and count errors ---
bhat = r < 0;                             % decision threshold at 0
Nerr = sum(bhat ~= bits);
BERm = Nerr / Nbits;                      % measured BER
BERt = 0.5*erfc(sqrt(EbN0));              % theory = Q(sqrt(2 Eb/N0))
fprintf('Eb/N0 = %d dB: measured BER = %.4e, theory = %.4e (%d errors)\n', ...
    EbN0dB, BERm, BERt, Nerr);

% --- Scatter of noisy samples around the two symbols ---
figure; subplot(2,1,1);
idx = 1:2000;
plot(r(idx), zeros(size(idx)) + 0.02*randn(size(idx)), '.'); grid on; hold on;
xline(0, 'k--'); xline(1,'g:'); xline(-1,'g:');
xlabel('received amplitude'); ylabel('(jitter)');
title('AWGN: samples cluster near +1 / -1, threshold at 0');

subplot(2,1,2);
histogram(r(bits==0), 80); hold on; histogram(r(bits==1), 80); grid on;
xline(0, 'k--'); xlabel('received amplitude'); ylabel('count');
title('Overlap of the two clouds -> bit errors'); legend('sent +1','sent -1');
`,
    python: String.raw`# AWGN channel: add Gaussian noise to a BPSK signal at a target Eb/N0,
# scatter the noisy samples, count bit errors, and compare to theory.
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

rng = np.random.default_rng(4)
Nbits = 200000
EbN0dB = 7                                # target Eb/N0 (dB)
EbN0 = 10**(EbN0dB/10)

bits = rng.integers(0, 2, Nbits)
s = 1 - 2*bits                            # BPSK: 0->+1, 1->-1 (Eb = 1)
sigma = np.sqrt(1/(2*EbN0))               # noise std for Eb=1
r = s + sigma*rng.standard_normal(Nbits)  # received = signal + AWGN

# Detect and count errors
bhat = (r < 0).astype(int)                # threshold at 0
Nerr = np.sum(bhat != bits)
BERm = Nerr / Nbits                       # measured BER
BERt = 0.5*erfc(np.sqrt(EbN0))            # theory = Q(sqrt(2 Eb/N0))
print(f"Eb/N0 = {EbN0dB} dB: measured BER = {BERm:.4e}, "
      f"theory = {BERt:.4e} ({Nerr} errors)")

# Scatter of noisy samples around the two symbols
fig, ax = plt.subplots(2, 1, figsize=(7, 7))
idx = slice(0, 2000)
jit = 0.02*rng.standard_normal(2000)
ax[0].plot(r[idx], jit, '.', ms=2); ax[0].grid(True)
ax[0].axvline(0, color='k', ls='--')
ax[0].axvline(1, color='g', ls=':'); ax[0].axvline(-1, color='g', ls=':')
ax[0].set(xlabel="received amplitude", ylabel="(jitter)",
          title="AWGN: samples cluster near +1 / -1, threshold at 0")

ax[1].hist(r[bits == 0], bins=80, alpha=0.6, label="sent +1")
ax[1].hist(r[bits == 1], bins=80, alpha=0.6, label="sent -1")
ax[1].axvline(0, color='k', ls='--'); ax[1].grid(True); ax[1].legend()
ax[1].set(xlabel="received amplitude", ylabel="count",
          title="Overlap of the two clouds -> bit errors")
plt.tight_layout(); plt.show()
`
  },

  'trellis-diagram': {
    matlab: String.raw`% Trellis diagram: rate-1/2, K=3 convolutional code, generators g=[7 5] (octal).
% Encode bits, then run Viterbi (build states, add-compare-select, traceback)
% and confirm the message is recovered.
rng(6);
K = 3; Nstate = 4;                        % constraint length, number of states
% Precompute outputs and next-state for each (state,input).
% State = last two input bits [s1 s0]; g1=111 (7), g2=101 (5).
nxt = zeros(Nstate,2); out = zeros(Nstate,2);
for s = 0:Nstate-1
  s1 = bitget(s,2); s0 = bitget(s,1);
  for u = 0:1
    o1 = mod(u + s1 + s0, 2);             % g=7 -> taps on u,s1,s0
    o2 = mod(u + s0, 2);                  % g=5 -> taps on u,s0
    nxt(s+1,u+1) = bitshift(mod(bitor(bitshift(u,1),s1),4),0); % new [u s1]
    out(s+1,u+1) = 2*o1 + o2;
  end
end

msg = randi([0 1], 1, 12);
% --- Encode (start in state 0) ---
st = 0; code = [];
for k = 1:numel(msg)
  o = out(st+1, msg(k)+1); code = [code, bitshift(o,-1), bitand(o,1)];
  st = nxt(st+1, msg(k)+1);
end

% --- Viterbi decode over the trellis ---
Ns = numel(msg); INF = 1e9;
pm = INF*ones(Nstate,1); pm(1) = 0;       % path metrics, start in state 0
prev = zeros(Nstate, Ns); dec = zeros(Nstate, Ns);
for k = 1:Ns
  rx = [code(2*k-1), code(2*k)];
  npm = INF*ones(Nstate,1);
  for s = 0:Nstate-1
    if pm(s+1) >= INF, continue; end
    for u = 0:1
      o = out(s+1,u+1); ob = [bitshift(o,-1), bitand(o,1)];
      m = pm(s+1) + sum(ob ~= rx);        % Hamming branch metric (ACS)
      ns = nxt(s+1,u+1);
      if m < npm(ns+1)
        npm(ns+1) = m; prev(ns+1,k) = s; dec(ns+1,k) = u;
      end
    end
  end
  pm = npm;
end

% --- Traceback from the best final state ---
[~, s] = min(pm); s = s-1; hat = zeros(1,Ns);
for k = Ns:-1:1
  hat(k) = dec(s+1,k); s = prev(s+1,k);
end
fprintf('bit errors after Viterbi = %d\n', sum(hat ~= msg));
disp('msg :'); disp(msg); disp('decoded:'); disp(hat);
`,
    python: String.raw`# Trellis diagram: rate-1/2, K=3 convolutional code, generators g=[7 5] (octal).
# Encode bits, then run Viterbi (build states, add-compare-select, traceback)
# and confirm the message is recovered.
import numpy as np

rng = np.random.default_rng(6)
Nstate = 4                                # K=3 -> 2 memory bits -> 4 states
# State = last two input bits [s1 s0]; g1=111(oct 7), g2=101(oct 5).
nxt = np.zeros((Nstate, 2), int)
out = np.zeros((Nstate, 2), int)
for s in range(Nstate):
    s1, s0 = (s >> 1) & 1, s & 1
    for u in (0, 1):
        o1 = (u + s1 + s0) % 2            # g=7 taps on u,s1,s0
        o2 = (u + s0) % 2                 # g=5 taps on u,s0
        nxt[s, u] = ((u << 1) | s1) & 3   # new state [u s1]
        out[s, u] = (o1 << 1) | o2

msg = rng.integers(0, 2, 12)
# Encode (start in state 0)
st, code = 0, []
for b in msg:
    o = out[st, b]; code += [(o >> 1) & 1, o & 1]
    st = nxt[st, b]
code = np.array(code)

# Viterbi decode over the trellis
Ns, INF = len(msg), 10**9
pm = np.full(Nstate, INF); pm[0] = 0      # path metrics, start in state 0
prev = np.zeros((Nstate, Ns), int)
dec  = np.zeros((Nstate, Ns), int)
for k in range(Ns):
    rx = code[2*k:2*k+2]
    npm = np.full(Nstate, INF)
    for s in range(Nstate):
        if pm[s] >= INF:
            continue
        for u in (0, 1):
            o = out[s, u]; ob = np.array([(o >> 1) & 1, o & 1])
            m = pm[s] + int(np.sum(ob != rx))   # Hamming branch metric (ACS)
            ns = nxt[s, u]
            if m < npm[ns]:
                npm[ns] = m; prev[ns, k] = s; dec[ns, k] = u
    pm = npm

# Traceback from the best final state
s = int(np.argmin(pm)); hat = np.zeros(Ns, int)
for k in range(Ns-1, -1, -1):
    hat[k] = dec[s, k]; s = prev[s, k]
print("bit errors after Viterbi =", int(np.sum(hat != msg)))
print("msg    :", msg)
print("decoded:", hat)
`
  }
});
