// extra3.js — MATLAB + Python teaching code for 6 comms/DSP topics.
// Populates the global CONTENT_CODE map. No literal backticks or dollar-brace inside code strings.
Object.assign(CONTENT_CODE, {
  'vco': {
    matlab: String.raw`% VCO: voltage-controlled oscillator  f_out = f0 + Kvco * Vctrl
% Show the tuning curve, then drive with a time-varying control voltage.
f0   = 1e3;        % free-running frequency at Vctrl=0 (Hz)
Kvco = 500;        % VCO gain (Hz per volt)
fprintf('Kvco = %g Hz/V, f0 = %g Hz\n', Kvco, f0);

% --- Tuning curve: sweep the control voltage ---
Vsweep = -2:0.1:2;
fout   = f0 + Kvco*Vsweep;          % linear tuning law
figure; subplot(3,1,1);
plot(Vsweep, fout, 'LineWidth', 1.4); grid on;
xlabel('Vctrl (V)'); ylabel('f_{out} (Hz)'); title('VCO tuning curve');

% --- Time-domain output with a stepped control voltage ---
fs = 50e3; t = 0:1/fs:0.02;         % 20 ms record
Vt = 1.0*(t >= 0.01);               % control jumps 0 -> 1 V at t=10 ms
finst = f0 + Kvco*Vt;               % instantaneous frequency (Hz)
phi   = 2*pi*cumsum(finst)/fs;      % integrate frequency to get phase
x     = cos(phi);                   % VCO output waveform

subplot(3,1,2); plot(t*1e3, Vt, 'LineWidth', 1.4); grid on;
xlabel('t (ms)'); ylabel('Vctrl (V)'); title('Control voltage');
subplot(3,1,3); plot(t*1e3, x); grid on;
xlabel('t (ms)'); ylabel('x(t)');
title('VCO output: frequency rises when Vctrl steps up');
`,
    python: String.raw`# VCO: voltage-controlled oscillator  f_out = f0 + Kvco * Vctrl
# Tuning curve, then output driven by a time-varying control voltage.
import numpy as np
import matplotlib.pyplot as plt

f0, Kvco = 1e3, 500.0        # free-running freq (Hz), VCO gain (Hz/V)
print(f"Kvco = {Kvco} Hz/V, f0 = {f0} Hz")

# --- Tuning curve ---
Vsweep = np.arange(-2, 2.01, 0.1)
fout = f0 + Kvco*Vsweep
fig, ax = plt.subplots(3, 1, figsize=(7, 7))
ax[0].plot(Vsweep, fout, lw=1.4); ax[0].grid(True)
ax[0].set(xlabel="Vctrl (V)", ylabel="f_out (Hz)", title="VCO tuning curve")

# --- Time-domain output: control voltage steps 0 -> 1 V at 10 ms ---
fs = 50e3
t = np.arange(0, 0.02, 1/fs)
Vt = np.where(t >= 0.01, 1.0, 0.0)
finst = f0 + Kvco*Vt                 # instantaneous frequency
phi = 2*np.pi*np.cumsum(finst)/fs    # integrate to phase
x = np.cos(phi)                      # VCO output

ax[1].plot(t*1e3, Vt, lw=1.4); ax[1].grid(True)
ax[1].set(xlabel="t (ms)", ylabel="Vctrl (V)", title="Control voltage")
ax[2].plot(t*1e3, x); ax[2].grid(True)
ax[2].set(xlabel="t (ms)", ylabel="x(t)",
          title="VCO output: frequency rises when Vctrl steps up")
plt.tight_layout(); plt.show()
`
  },

  'nco': {
    matlab: String.raw`% NCO: numerically controlled oscillator
% Phase accumulator (N-bit) + sine lookup.  f_out = FCW * fs / 2^N
N   = 12;               % phase-accumulator width (bits)
fs  = 48e3;             % clock / sample rate (Hz)
FCW = 512;              % frequency control word
fout = FCW * fs / 2^N;  % synthesized frequency
fprintf('N=%d bits, fs=%g Hz, FCW=%d -> f_out=%.2f Hz\n', N, fs, FCW, fout);

Ns = 512;                       % number of output samples
acc = zeros(1, Ns); phase = 0;
for k = 1:Ns
    acc(k) = phase;
    phase  = mod(phase + FCW, 2^N);   % accumulator wraps modulo 2^N
end

% Optional: phase truncation (use only top B bits to index the LUT) -> spurs
B = 8; Llut = 2^B;
lut = sin(2*pi*(0:Llut-1)/Llut);      % sine lookup table
idx = floor(acc / 2^(N-B));           % keep top B bits (truncation)
y   = lut(mod(idx, Llut) + 1);        % table lookup

t = (0:Ns-1)/fs;
figure;
subplot(3,1,1); stairs(acc); grid on;
xlabel('sample'); ylabel('phase'); title('Phase accumulator ramp (wraps at 2^N)');
subplot(3,1,2); plot(t*1e3, y); grid on;
xlabel('t (ms)'); ylabel('y'); title('Synthesized sine (with phase truncation)');
subplot(3,1,3);
Y = fftshift(abs(fft(y))/Ns); f = (-Ns/2:Ns/2-1)*(fs/Ns);
plot(f/1e3, 20*log10(Y + 1e-6)); grid on;
xlabel('f (kHz)'); ylabel('dB'); title('Spectrum: note truncation spurs');
`,
    python: String.raw`# NCO: numerically controlled oscillator
# Phase accumulator (N-bit) + sine lookup.  f_out = FCW * fs / 2^N
import numpy as np
import matplotlib.pyplot as plt

N, fs, FCW = 12, 48e3, 512
fout = FCW * fs / 2**N
print(f"N={N} bits, fs={fs} Hz, FCW={FCW} -> f_out={fout:.2f} Hz")

Ns = 512
acc = np.zeros(Ns, dtype=int)
phase = 0
for k in range(Ns):
    acc[k] = phase
    phase = (phase + FCW) % (2**N)     # wraps modulo 2^N

# Phase truncation: index LUT with only the top B bits -> spurs
B = 8; Llut = 2**B
lut = np.sin(2*np.pi*np.arange(Llut)/Llut)
idx = (acc >> (N - B)) % Llut          # keep top B bits
y = lut[idx]

t = np.arange(Ns)/fs
fig, ax = plt.subplots(3, 1, figsize=(7, 7))
ax[0].step(np.arange(Ns), acc); ax[0].grid(True)
ax[0].set(xlabel="sample", ylabel="phase", title="Phase accumulator ramp (wraps at 2^N)")
ax[1].plot(t*1e3, y); ax[1].grid(True)
ax[1].set(xlabel="t (ms)", ylabel="y", title="Synthesized sine (phase-truncated)")
Y = np.fft.fftshift(np.abs(np.fft.fft(y))/Ns)
f = np.fft.fftshift(np.fft.fftfreq(Ns, 1/fs))
ax[2].plot(f/1e3, 20*np.log10(Y + 1e-6)); ax[2].grid(True)
ax[2].set(xlabel="f (kHz)", ylabel="dB", title="Spectrum: note truncation spurs")
plt.tight_layout(); plt.show()
`
  },

  'cfo': {
    matlab: String.raw`% CFO: carrier frequency offset on a QPSK signal.
% Show the constellation spinning, then estimate + correct it.
rng(1);
Nsym = 2000; fs = 1e6;              % symbols and symbol rate (Hz)
bits = randi([0 1], 2, Nsym);
sym  = (1-2*bits(1,:)) + 1j*(1-2*bits(2,:));  % Gray QPSK, +/-1 +/-1j
sym  = sym / sqrt(2);

n   = 0:Nsym-1;
cfo = 200;                          % carrier frequency offset (Hz)
rx  = sym .* exp(1j*2*pi*cfo/fs .* n);        % apply CFO (rotation)

% --- Estimate CFO by the 4th-power (M-power) method for QPSK ---
% Raising QPSK to the 4th power removes the modulation, leaving 4*CFO tone.
z    = rx.^4;
cfoHat = fs/4 * angle(mean(z .* exp(-1j*2*pi*0))) / (2*pi) * 0; %#ok init
phi4 = angle(sum(z .* exp(-1j*2*pi*(4*cfo/fs).*n))); %#ok explanatory
% Practical estimator: average the per-sample phase increment of z
dphi   = angle(mean(z(2:end) .* conj(z(1:end-1))));
cfoHat = dphi/4 * fs/(2*pi);
fprintf('True CFO = %.1f Hz,  Estimated CFO = %.1f Hz\n', cfo, cfoHat);

rxc = rx .* exp(-1j*2*pi*cfoHat/fs .* n);     % de-rotate to correct

figure;
subplot(1,2,1); plot(real(rx), imag(rx), '.'); axis equal; grid on;
title('Received: CFO spins the constellation'); xlabel('I'); ylabel('Q');
subplot(1,2,2); plot(real(rxc), imag(rxc), '.'); axis equal; grid on;
title('After CFO correction'); xlabel('I'); ylabel('Q');
`,
    python: String.raw`# CFO: carrier frequency offset on a QPSK signal.
# Show the constellation spinning, then estimate + correct it.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(1)
Nsym, fs = 2000, 1e6
bits = rng.integers(0, 2, (2, Nsym))
sym = ((1 - 2*bits[0]) + 1j*(1 - 2*bits[1])) / np.sqrt(2)   # Gray QPSK

n = np.arange(Nsym)
cfo = 200.0                                  # carrier frequency offset (Hz)
rx = sym * np.exp(1j*2*np.pi*cfo/fs * n)      # apply CFO (rotation)

# Estimate CFO with the 4th-power method (QPSK modulation cancels at ^4).
z = rx**4
dphi = np.angle(np.mean(z[1:] * np.conj(z[:-1])))   # avg phase increment of z
cfo_hat = dphi/4 * fs/(2*np.pi)
print(f"True CFO = {cfo:.1f} Hz,  Estimated CFO = {cfo_hat:.1f} Hz")

rxc = rx * np.exp(-1j*2*np.pi*cfo_hat/fs * n)  # de-rotate to correct

fig, ax = plt.subplots(1, 2, figsize=(9, 4.2))
ax[0].plot(rx.real, rx.imag, '.', ms=2); ax[0].axis('equal'); ax[0].grid(True)
ax[0].set(title="Received: CFO spins constellation", xlabel="I", ylabel="Q")
ax[1].plot(rxc.real, rxc.imag, '.', ms=2); ax[1].axis('equal'); ax[1].grid(True)
ax[1].set(title="After CFO correction", xlabel="I", ylabel="Q")
plt.tight_layout(); plt.show()
`
  },

  'dll': {
    matlab: String.raw`% DLL: first-order delay-locked loop.
% Adjust a delay so the output clock edge aligns to a reference edge.
% First-order loop -> phase error decays exponentially to zero (no overshoot),
% unlike a second-order PLL which can ring before settling.
Nstep = 60;               % iterations
mu    = 0.3;              % loop gain (0<mu<2 for stability of this update)
ref   = 0.0;             % reference edge position (target phase, arb. units)
delay = 1.0;             % initial controllable delay (starts misaligned)

perr = zeros(1, Nstep);
for k = 1:Nstep
    e        = ref - delay;         % phase-detector output (edge misalignment)
    perr(k)  = e;
    delay    = delay + mu*e;        % first-order integrator adjusts the delay
end
fprintf('Final phase error = %.4g (started at %.4g)\n', perr(end), perr(1));

% Contrast: second-order (PLL-like) response, underdamped -> ringing
z = 0.3; wn = 0.5; x = 0; v = 0; pll = zeros(1, Nstep);
for k = 1:Nstep
    e   = ref - x; pll(k) = e;
    v   = v + wn^2*e;               % integral path
    x   = x + v + 2*z*wn*e;         % proportional + integral update
end

figure;
plot(0:Nstep-1, perr, '-o', 'LineWidth', 1.3); hold on;
plot(0:Nstep-1, pll, '-s', 'LineWidth', 1.0);
grid on; yline(0, 'k:');
xlabel('iteration'); ylabel('phase error');
legend('DLL (1st order): monotone decay', 'PLL (2nd order): rings');
title('DLL delay/phase-error converging to zero');
`,
    python: String.raw`# DLL: first-order delay-locked loop.
# Adjust a delay so the output clock edge aligns to a reference edge.
# First-order loop -> exponential decay to zero (no overshoot);
# contrast with a second-order PLL that can ring before settling.
import numpy as np
import matplotlib.pyplot as plt

Nstep, mu, ref = 60, 0.3, 0.0
delay = 1.0                       # initial misaligned delay
perr = np.zeros(Nstep)
for k in range(Nstep):
    e = ref - delay               # phase-detector: edge misalignment
    perr[k] = e
    delay += mu*e                 # first-order integrator adjusts delay
print(f"Final phase error = {perr[-1]:.4g} (started at {perr[0]:.4g})")

# Second-order (PLL-like) response for contrast: underdamped -> ringing
z, wn = 0.3, 0.5
x = v = 0.0
pll = np.zeros(Nstep)
for k in range(Nstep):
    e = ref - x; pll[k] = e
    v += wn**2 * e                # integral path
    x += v + 2*z*wn*e             # proportional + integral update

plt.figure(figsize=(7, 4.2))
plt.plot(range(Nstep), perr, '-o', lw=1.3, label="DLL (1st order): monotone decay")
plt.plot(range(Nstep), pll, '-s', lw=1.0, label="PLL (2nd order): rings")
plt.axhline(0, color='k', ls=':'); plt.grid(True)
plt.xlabel("iteration"); plt.ylabel("phase error")
plt.title("DLL delay/phase-error converging to zero"); plt.legend()
plt.tight_layout(); plt.show()
`
  },

  'turbo-codes': {
    matlab: String.raw`% Turbo codes: rate-1/3 encoder (2 RSC + interleaver) and iterative
% soft decoding. Small demo -> BER drops as iterations accumulate.
rng(3);
K = 200;                          % message length
u = randi([0 1], 1, K);          % info bits
perm = randperm(K);              % interleaver

% --- Simple recursive systematic convolutional (RSC) parity, G=[1,1/(1+D^2)] ---
rsc = @(b) local_rsc(b);
p1 = rsc(u);                     % parity from encoder 1
p2 = rsc(u(perm));              % parity from encoder 2 (interleaved input)

% BPSK over AWGN; systematic + two parity streams (rate 1/3)
EbN0 = 1.0; sigma = sqrt(1/(2*(1/3)*10^(EbN0/10)));
tx = 1 - 2*[u; p1; p2];          % map 0->+1, 1->-1
rx = tx + sigma*randn(size(tx));
Lc = 2/sigma^2;                  % channel reliability
Ls = Lc*rx(1,:); L1 = Lc*rx(2,:); L2 = Lc*rx(3,:);

% --- Turbo iterations: exchange extrinsic info between the two "decoders" ---
% (Illustrative soft combiner: each decoder refines the systematic LLR.)
ext = zeros(1, K);
for it = 1:6
    La   = Ls + ext;                          % a-priori from other decoder
    d1   = La + L1;                            % decoder-1 soft output (toy)
    e1   = tanh(d1/2);                         % extrinsic (as reliability)
    e1p  = e1(perm);                           % interleave
    d2   = Ls(perm) + L2 + atanh(0.99*e1p);    % decoder-2 (toy MAP-like)
    e2                = zeros(1, K);
    e2(perm)          = atanh(0.99*tanh(d2/2));
    ext  = e2;                                 % feed back extrinsic
    dec  = (Ls + L1 + ext) < 0;                % hard decision
    ber(it) = mean(dec ~= u); %#ok<SAGROW>
    fprintf('iter %d: BER = %.4f\n', it, ber(it));
end
figure; semilogy(1:6, ber + 1e-4, '-o', 'LineWidth', 1.4); grid on;
xlabel('turbo iteration'); ylabel('BER'); title('Turbo decoding: BER vs iterations');

function p = local_rsc(b)
    % Rate-1 RSC with feedback poly 1+D^2, feedforward 1+D+D^2
    s1 = 0; s2 = 0; p = zeros(size(b));
    for k = 1:numel(b)
        fb   = xor(b(k), s2);           % feedback into the shift register
        p(k) = xor(xor(fb, s1), s2);   % parity output
        s2 = s1; s1 = fb;              % shift
    end
end
`,
    python: String.raw`# Turbo codes: rate-1/3 encoder (2 RSC + interleaver) with iterative
# soft (LLR) decoding. Small demo -> BER drops as iterations accumulate.
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(3)
K = 200
u = rng.integers(0, 2, K)
perm = rng.permutation(K)               # interleaver

def rsc(b):
    # Rate-1 RSC: feedback poly 1+D^2, feedforward 1+D+D^2
    s1 = s2 = 0
    p = np.zeros_like(b)
    for k in range(len(b)):
        fb = b[k] ^ s2                  # feedback into shift register
        p[k] = fb ^ s1 ^ s2             # parity output
        s2, s1 = s1, fb                 # shift
    return p

p1 = rsc(u)
p2 = rsc(u[perm])                       # parity of interleaved input

EbN0 = 1.0
sigma = np.sqrt(1/(2*(1/3)*10**(EbN0/10)))
tx = 1 - 2*np.vstack([u, p1, p2])       # BPSK: 0->+1, 1->-1
rx = tx + sigma*rng.standard_normal(tx.shape)
Lc = 2/sigma**2
Ls, L1, L2 = Lc*rx[0], Lc*rx[1], Lc*rx[2]

ext = np.zeros(K)
ber = []
for it in range(6):
    La = Ls + ext                       # a-priori from the other decoder
    d1 = La + L1                         # decoder-1 soft output (toy)
    e1 = np.tanh(d1/2)                   # extrinsic reliability
    d2 = Ls[perm] + L2 + np.arctanh(0.99*e1[perm])   # decoder-2 (toy MAP-like)
    e2 = np.zeros(K)
    e2[perm] = np.arctanh(0.99*np.tanh(d2/2))
    ext = e2                             # feed extrinsic back
    dec = (Ls + L1 + ext) < 0           # hard decision
    ber.append(np.mean(dec != u))
    print(f"iter {it+1}: BER = {ber[-1]:.4f}")

plt.figure(figsize=(6.5, 4))
plt.semilogy(range(1, 7), np.array(ber)+1e-4, '-o', lw=1.4); plt.grid(True)
plt.xlabel("turbo iteration"); plt.ylabel("BER")
plt.title("Turbo decoding: BER vs iterations")
plt.tight_layout(); plt.show()
`
  },

  'ldpc': {
    matlab: String.raw`% LDPC: small sparse parity-check code + sum-product (belief propagation).
% Build H, form the Tanner graph, correct BSC errors, watch syndrome -> 0.
% (7,3)-ish toy code: 4 checks x 7 bits, each column weight 2.
H = [1 1 0 1 0 0 0;
     0 1 1 0 1 0 0;
     0 0 1 1 0 1 0;
     1 0 0 0 1 0 1];
[M, Nb] = size(H);
fprintf('H is %dx%d; Tanner graph: %d check nodes, %d variable nodes\n', M, Nb, M, Nb);

cw = zeros(1, Nb);                 % all-zero valid codeword (in its null space)
p  = 0.1;                         % BSC crossover probability
rng(5);
rx = xor(cw, rand(1, Nb) < p);    % flip a few bits
fprintf('Received (errors in bold positions): %s\n', mat2str(rx));
fprintf('Initial syndrome = %s\n', mat2str(mod(H*rx.', 2).'));

% LLR init from BSC channel
Lch = (1 - 2*rx) * log((1-p)/p);
[ri, ci] = find(H);               % edges of the Tanner graph
Mvc = zeros(M, Nb); Mcv = zeros(M, Nb);
for e = 1:numel(ri), Mvc(ri(e), ci(e)) = Lch(ci(e)); end

for it = 1:8
    % Check -> variable (sum-product via tanh rule)
    for m = 1:M
        vs = find(H(m,:));
        for n = vs
            others = vs(vs ~= n);
            Mcv(m,n) = 2*atanh(prod(tanh(Mvc(m,others)/2)));
        end
    end
    % Variable -> check
    for n = 1:Nb
        cs = find(H(:,n)).';
        for m = cs
            Mvc(m,n) = Lch(n) + sum(Mcv(cs(cs~=m), n));
        end
    end
    Ltot = Lch + sum(Mcv, 1);
    xhat = Ltot < 0;              % hard decision
    syn  = mod(H*xhat.', 2).';
    fprintf('iter %d: syndrome weight = %d\n', it, sum(syn));
    if all(syn == 0), fprintf('Converged: syndrome is zero.\n'); break; end
end
`,
    python: String.raw`# LDPC: small sparse parity-check code + sum-product belief propagation.
# Build H, form the Tanner graph, correct BSC errors, watch syndrome -> 0.
import numpy as np

H = np.array([[1,1,0,1,0,0,0],
              [0,1,1,0,1,0,0],
              [0,0,1,1,0,1,0],
              [1,0,0,0,1,0,1]])
M, Nb = H.shape
print(f"H is {M}x{Nb}; Tanner graph: {M} check nodes, {Nb} variable nodes")

cw = np.zeros(Nb, dtype=int)          # all-zero valid codeword
p = 0.1                               # BSC crossover probability
rng = np.random.default_rng(5)
rx = (cw ^ (rng.random(Nb) < p)).astype(int)   # flip a few bits
print("Received       :", rx)
print("Initial syndrome:", (H @ rx) % 2)

Lch = (1 - 2*rx) * np.log((1-p)/p)    # channel LLRs from BSC
Mvc = np.where(H > 0, Lch[None, :], 0.0)   # variable->check messages
Mcv = np.zeros((M, Nb))

for it in range(8):
    # Check -> variable (tanh product rule)
    for m in range(M):
        vs = np.where(H[m] > 0)[0]
        for n in vs:
            others = vs[vs != n]
            Mcv[m, n] = 2*np.arctanh(np.clip(
                np.prod(np.tanh(Mvc[m, others]/2)), -0.999999, 0.999999))
    # Variable -> check
    for n in range(Nb):
        cs = np.where(H[:, n] > 0)[0]
        for m in cs:
            Mvc[m, n] = Lch[n] + np.sum(Mcv[cs[cs != m], n])
    Ltot = Lch + Mcv.sum(axis=0)
    xhat = (Ltot < 0).astype(int)     # hard decision
    syn = (H @ xhat) % 2
    print(f"iter {it+1}: syndrome weight = {syn.sum()}")
    if syn.sum() == 0:
        print("Converged: syndrome is zero.")
        break
`
  }
});
