// Synchronization loop teaching code: PLL, FLL, Costas loop (MATLAB + Python)
Object.assign(CONTENT_CODE, {
  'pll': {
    matlab: String.raw`% Second-order digital PLL locking to a phase/frequency step
% Loop filter is a PI controller; NCO integrates to produce phase.
% We compare two damping factors (zeta) to show the settling behavior.
clear; clc;

Fs   = 1000;          % sample rate (Hz)
N    = 2000;          % number of samples
t    = (0:N-1)/Fs;    % time vector

% Input phase to track: a phase step plus a small frequency step.
phase_step = pi/2;                 % rad, applied at n=0
freq_step  = 5;                    % Hz, applied at t=0.5 s
phi_in = phase_step + 2*pi*freq_step*max(t-0.5,0);

Bn = 25;              % loop noise bandwidth (Hz), a design knob
zetas = [0.707 2.0]; % under-ish vs over-damped

figure; hold on; grid on;
for k = 1:numel(zetas)
    zeta = zetas(k);
    % Standard 2nd-order loop-filter gains (proportional Kp, integral Ki).
    theta = Bn/Fs / (zeta + 1/(4*zeta));
    Kp = 4*zeta*theta / (1 + 2*zeta*theta + theta^2);
    Ki = 4*theta^2    / (1 + 2*zeta*theta + theta^2);

    nco   = 0;        % NCO accumulated phase
    integ = 0;        % integrator state of the PI filter
    perr  = zeros(1,N);

    for n = 1:N
        % Phase detector (small-signal): difference of input and NCO phase.
        e = angle(exp(1i*(phi_in(n) - nco)));
        perr(n) = e;
        integ = integ + Ki*e;      % integral path -> tracks freq offset
        nco   = nco + Kp*e + integ;% NCO update = VCO/accumulator
    end
    plot(t, perr, 'LineWidth', 1.2, 'DisplayName', sprintf('zeta = %.3f', zeta));
end
xlabel('Time (s)'); ylabel('Phase error (rad)');
title('2nd-order digital PLL: phase error settling (lock)');
legend show;
`,
    python: String.raw`# Second-order digital PLL locking to a phase/frequency step.
# Loop filter is a PI controller; NCO integrates phase (the VCO).
# We compare two damping factors (zeta) to show settling / lock.
import numpy as np
import matplotlib.pyplot as plt

Fs = 1000.0            # sample rate (Hz)
N  = 2000             # samples
t  = np.arange(N) / Fs

# Input phase to track: a phase step plus a frequency step midway.
phase_step = np.pi / 2                 # rad at n = 0
freq_step  = 5.0                       # Hz starting at t = 0.5 s
phi_in = phase_step + 2*np.pi*freq_step*np.maximum(t - 0.5, 0.0)

Bn = 25.0             # loop noise bandwidth (Hz)
zetas = [0.707, 2.0] # under-ish vs over-damped

plt.figure()
for zeta in zetas:
    # Standard 2nd-order PI loop-filter gains.
    theta = (Bn / Fs) / (zeta + 1.0/(4.0*zeta))
    Kp = 4*zeta*theta      / (1 + 2*zeta*theta + theta**2)
    Ki = 4*theta**2        / (1 + 2*zeta*theta + theta**2)

    nco = 0.0             # NCO accumulated phase
    integ = 0.0           # PI integrator state
    perr = np.zeros(N)

    for n in range(N):
        # Phase detector, wrapped to (-pi, pi] via angle of complex exp.
        e = np.angle(np.exp(1j*(phi_in[n] - nco)))
        perr[n] = e
        integ += Ki*e                 # integral path tracks freq offset
        nco   += Kp*e + integ         # NCO / VCO update

    plt.plot(t, perr, linewidth=1.2, label=f"zeta = {zeta:.3f}")

plt.xlabel("Time (s)")
plt.ylabel("Phase error (rad)")
plt.title("2nd-order digital PLL: phase error settling (lock)")
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()
`
  },
  'fll': {
    matlab: String.raw`% Frequency-Locked Loop (FLL) pulling in a LARGE frequency offset.
% A plain PLL would slip cycles here; an FLL locks frequency first.
% Discriminator uses the phase change between consecutive samples.
clear; clc;

Fs   = 10000;          % sample rate (Hz)
N    = 4000;           % samples
t    = (0:N-1)/Fs;

f_off = 800;           % LARGE input frequency offset (Hz)
sig = exp(1i*2*pi*f_off*t);        % complex tone to acquire

% First-order FLL: integrate the frequency-discriminator output.
Kf   = 0.02;           % FLL gain (sets pull-in speed / bandwidth)
nco_phase = 0;         % local oscillator phase
nco_freq  = 0;         % local oscillator frequency estimate (rad/sample)

ferr = zeros(1,N);     % frequency error (Hz)
prev_prod = 1;
for n = 1:N
    lo   = exp(-1i*nco_phase);           % local replica (conjugate mix)
    baseb = sig(n) * lo;                 % mix down to baseband
    % Cross-product frequency discriminator: imag(z*conj(z_prev)) ~ dphase.
    disc = imag(baseb * conj(prev_prod));
    prev_prod = baseb;

    nco_freq  = nco_freq + Kf*disc;      % integrate freq error estimate
    nco_phase = nco_phase + nco_freq;    % advance NCO phase

    ferr(n) = f_off - nco_freq*Fs/(2*pi);% remaining offset in Hz
end

figure; plot(t, ferr, 'LineWidth', 1.3); grid on;
xlabel('Time (s)'); ylabel('Frequency error (Hz)');
title(sprintf('FLL pulling in %d Hz offset (converges to 0)', f_off));
`,
    python: String.raw`# Frequency-Locked Loop (FLL) pulling in a LARGE frequency offset.
# A plain PLL would slip cycles here; the FLL locks frequency first.
# Discriminator = cross product of consecutive baseband samples.
import numpy as np
import matplotlib.pyplot as plt

Fs = 10000.0           # sample rate (Hz)
N  = 4000             # samples
t  = np.arange(N) / Fs

f_off = 800.0          # LARGE input frequency offset (Hz)
sig = np.exp(1j*2*np.pi*f_off*t)   # complex tone to acquire

Kf = 0.02             # FLL gain (pull-in speed / bandwidth)
nco_phase = 0.0        # local oscillator phase
nco_freq  = 0.0        # LO frequency estimate (rad/sample)

ferr = np.zeros(N)
prev_prod = 1.0 + 0j
for n in range(N):
    lo    = np.exp(-1j*nco_phase)          # local replica (conjugate mix)
    baseb = sig[n] * lo                    # mix down to baseband
    # Cross-product discriminator: imag(z * conj(z_prev)) ~ delta-phase.
    disc  = np.imag(baseb * np.conj(prev_prod))
    prev_prod = baseb

    nco_freq  += Kf*disc                   # integrate freq error estimate
    nco_phase += nco_freq                  # advance NCO phase

    ferr[n] = f_off - nco_freq*Fs/(2*np.pi)  # remaining offset (Hz)

plt.figure()
plt.plot(t, ferr, linewidth=1.3)
plt.xlabel("Time (s)")
plt.ylabel("Frequency error (Hz)")
plt.title(f"FLL pulling in {f_off:.0f} Hz offset (converges to 0)")
plt.grid(True)
plt.tight_layout()
plt.show()
`
  },
  'costas-loop': {
    matlab: String.raw`% Costas loop recovering BPSK carrier phase.
% I and Q arms; error = I*Q removes the data modulation (+/-1).
% Note: BPSK Costas has an inherent 180-degree phase ambiguity.
clear; clc;

Fs   = 20000;          % sample rate (Hz)
N    = 6000;           % samples
Rb   = 500;            % bit rate (bits/s)
sps  = Fs/Rb;          % samples per bit

% BPSK signal at baseband with an unknown static phase offset.
bits = 2*(rand(1, ceil(N/sps))>0.5) - 1;      % +/-1 symbols
data = repelem(bits, sps); data = data(1:N);
phi0 = 1.0;            % unknown carrier phase offset (rad)
rx   = data .* exp(1i*phi0);                  % received complex baseband

% Second-order Costas loop (PI filter + NCO).
zeta = 0.707; Bn = 40; theta = Bn/Fs/(zeta+1/(4*zeta));
Kp = 4*zeta*theta/(1+2*zeta*theta+theta^2);
Ki = 4*theta^2   /(1+2*zeta*theta+theta^2);

nco = 0; integ = 0;
perr = zeros(1,N); Iout = zeros(1,N); Qout = zeros(1,N);
for n = 1:N
    z = rx(n) * exp(-1i*nco);   % de-rotate by NCO estimate
    I = real(z); Q = imag(z);
    Iout(n) = I; Qout(n) = Q;
    e = I*Q;                    % Costas error: data-independent
    perr(n) = e;
    integ = integ + Ki*e;
    nco   = nco + Kp*e + integ; % NCO update
end

figure;
subplot(2,1,1); plot((0:N-1)/Fs, perr); grid on;
xlabel('Time (s)'); ylabel('I*Q error'); title('Costas loop phase error converging');
subplot(2,1,2);
idx = round(N/2):N;            % after lock
plot(Iout(idx), Qout(idx), '.'); grid on; axis equal;
xlabel('I'); ylabel('Q'); title('Recovered constellation (note 180-deg ambiguity)');
`,
    python: String.raw`# Costas loop recovering BPSK carrier phase.
# I and Q arms; error = I*Q removes the +/-1 data modulation.
# Note: BPSK Costas has an inherent 180-degree phase ambiguity.
import numpy as np
import matplotlib.pyplot as plt

Fs = 20000.0           # sample rate (Hz)
N  = 6000             # samples
Rb = 500.0             # bit rate (bits/s)
sps = int(Fs / Rb)     # samples per bit

# BPSK baseband signal with an unknown static carrier phase offset.
rng  = np.random.default_rng(0)
bits = 2*(rng.random(int(np.ceil(N/sps))) > 0.5) - 1     # +/-1 symbols
data = np.repeat(bits, sps)[:N]
phi0 = 1.0             # unknown carrier phase offset (rad)
rx   = data * np.exp(1j*phi0)

# Second-order Costas loop (PI loop filter + NCO).
zeta, Bn = 0.707, 40.0
theta = (Bn/Fs)/(zeta + 1.0/(4.0*zeta))
Kp = 4*zeta*theta/(1 + 2*zeta*theta + theta**2)
Ki = 4*theta**2   /(1 + 2*zeta*theta + theta**2)

nco = 0.0; integ = 0.0
perr = np.zeros(N); Iout = np.zeros(N); Qout = np.zeros(N)
for n in range(N):
    z = rx[n] * np.exp(-1j*nco)     # de-rotate by NCO estimate
    I, Q = np.real(z), np.imag(z)
    Iout[n], Qout[n] = I, Q
    e = I*Q                         # Costas error: data-independent
    perr[n] = e
    integ += Ki*e
    nco   += Kp*e + integ           # NCO update

t = np.arange(N)/Fs
fig, ax = plt.subplots(2, 1, figsize=(7, 7))
ax[0].plot(t, perr); ax[0].grid(True)
ax[0].set_xlabel("Time (s)"); ax[0].set_ylabel("I*Q error")
ax[0].set_title("Costas loop phase error converging")
idx = slice(N//2, N)                # after lock
ax[1].plot(Iout[idx], Qout[idx], '.', markersize=2)
ax[1].set_aspect('equal'); ax[1].grid(True)
ax[1].set_xlabel("I"); ax[1].set_ylabel("Q")
ax[1].set_title("Recovered constellation (note 180-deg ambiguity)")
plt.tight_layout()
plt.show()
`
  }
});
