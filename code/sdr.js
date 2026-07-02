// Teaching code for 5 RF/DSP topics: sdr, adc, dac, ad9361, rfsoc.
// Each entry provides a runnable MATLAB script and a runnable Python script.
Object.assign(CONTENT_CODE, {
  'sdr': {
    matlab: String.raw`% SDR: IQ (complex baseband) sampling via zero-IF downconversion.
% We take an "RF-ish" tone, mix it down with cos and -sin, low-pass filter,
% and recover the I/Q (amplitude + phase) as complex baseband.
clear; close all; clc;

fs   = 200e3;          % ADC sample rate (Hz)
t    = (0:1/fs:5e-3-1/fs).';
fc   = 40e3;           % "RF" carrier we pretend to receive (must be < fs/2 here)
fbb  = 3e3;            % baseband modulation offset from carrier
A    = 0.8;            % amplitude
phi  = pi/4;           % phase we want to recover

% Received real passband signal: a tone at fc+fbb with amplitude A and phase phi
rf = A*cos(2*pi*(fc+fbb)*t + phi);

% --- Zero-IF (direct conversion) mixing ---
lo_i =  cos(2*pi*fc*t);
lo_q = -sin(2*pi*fc*t);
mixI = rf .* lo_i;     % I branch (in-phase)
mixQ = rf .* lo_q;     % Q branch (quadrature)

% --- Low-pass filter to keep baseband, reject 2*fc image ---
% Simple moving-average FIR as an illustrative LPF.
N   = 64; h = ones(N,1)/N;
I   = filter(h,1,mixI);
Q   = filter(h,1,mixQ);
bb  = 2*(I + 1i*Q);    % complex baseband (factor 2 restores amplitude)

% --- Recover amplitude and phase ---
est_A   = mean(abs(bb(end-500:end)));
est_phi = angle(bb(1000));  % instantaneous phase includes 2*pi*fbb*t term
fprintf('True A=%.3f  Est A=%.3f\n', A, est_A);

% --- Spectra ---
NFFT = 2048;
f = (-NFFT/2:NFFT/2-1)*fs/NFFT;
BB = fftshift(fft(bb(1:NFFT).*hann(NFFT)));

figure;
subplot(2,2,1); plot(t*1e3, rf); xlabel('ms'); ylabel('rf'); title('Received real passband');
subplot(2,2,2); plot(t*1e3, real(bb), t*1e3, imag(bb)); legend('I','Q');
  xlabel('ms'); title('Complex baseband I/Q'); grid on;
subplot(2,2,3); plot(real(bb(1:2000)), imag(bb(1:2000))); axis equal;
  xlabel('I'); ylabel('Q'); title('IQ plane (rotates at fbb)'); grid on;
subplot(2,2,4); plot(f/1e3, 20*log10(abs(BB)+eps)); xlim([-20 20]);
  xlabel('kHz'); ylabel('dB'); title('Baseband spectrum (peak near fbb)'); grid on;
`,
    python: String.raw`# SDR: IQ (complex baseband) sampling via zero-IF downconversion.
# Mix an "RF-ish" tone down with cos and -sin, low-pass filter,
# and recover I/Q (amplitude + phase) as complex baseband.
import numpy as np
import matplotlib.pyplot as plt

fs  = 200e3                 # ADC sample rate (Hz)
t   = np.arange(0, 5e-3, 1/fs)
fc  = 40e3                  # "RF" carrier we pretend to receive
fbb = 3e3                   # baseband offset from carrier
A   = 0.8                   # amplitude to recover
phi = np.pi/4              # phase to recover

# Received real passband signal
rf = A*np.cos(2*np.pi*(fc+fbb)*t + phi)

# --- Zero-IF (direct conversion) mixing ---
lo_i =  np.cos(2*np.pi*fc*t)
lo_q = -np.sin(2*np.pi*fc*t)
mixI = rf*lo_i             # I branch
mixQ = rf*lo_q             # Q branch

# --- Low-pass filter (moving-average FIR) to reject the 2*fc image ---
N = 64
h = np.ones(N)/N
I = np.convolve(mixI, h, mode='same')
Q = np.convolve(mixQ, h, mode='same')
bb = 2*(I + 1j*Q)          # complex baseband; factor 2 restores amplitude

est_A = np.mean(np.abs(bb[-500:]))
print('True A=%.3f  Est A=%.3f' % (A, est_A))

# --- Baseband spectrum ---
NFFT = 2048
win  = np.hanning(NFFT)
BB   = np.fft.fftshift(np.fft.fft(bb[:NFFT]*win))
f    = np.fft.fftshift(np.fft.fftfreq(NFFT, 1/fs))

fig, ax = plt.subplots(2, 2, figsize=(11, 7))
ax[0,0].plot(t*1e3, rf); ax[0,0].set(title='Received real passband', xlabel='ms')
ax[0,1].plot(t*1e3, bb.real, label='I'); ax[0,1].plot(t*1e3, bb.imag, label='Q')
ax[0,1].legend(); ax[0,1].set(title='Complex baseband I/Q', xlabel='ms'); ax[0,1].grid(True)
ax[1,0].plot(bb[:2000].real, bb[:2000].imag); ax[1,0].axis('equal')
ax[1,0].set(title='IQ plane (rotates at fbb)', xlabel='I', ylabel='Q'); ax[1,0].grid(True)
ax[1,1].plot(f/1e3, 20*np.log10(np.abs(BB)+1e-12)); ax[1,1].set_xlim(-20, 20)
ax[1,1].set(title='Baseband spectrum (peak near fbb)', xlabel='kHz', ylabel='dB'); ax[1,1].grid(True)
plt.tight_layout(); plt.show()
`
  },
  'adc': {
    matlab: String.raw`% ADC: quantize a sine to N bits, measure SNR, compare to 6.02N+1.76 dB.
% Also sweep N and demonstrate aliasing by undersampling.
clear; close all; clc;

fs  = 100e3;
t   = (0:1/fs:20e-3-1/fs).';
fin = 2.3e3;
x   = 0.98*sin(2*pi*fin*t);          % full-scale-ish sine in [-1,1]

quantize = @(sig,N) round(sig*(2^(N-1)-1))/(2^(N-1)-1);

% --- SNR vs bits sweep ---
bits = 4:16;
snr_meas = zeros(size(bits));
for k = 1:numel(bits)
    xq  = quantize(x, bits(k));
    e   = xq - x;                    % quantization error
    snr_meas(k) = 10*log10(sum(x.^2)/sum(e.^2));
end
snr_ideal = 6.02*bits + 1.76;

% --- Quantization staircase (few bits, exaggerated) ---
Nshow = 3;
xs = linspace(-1,1,400);
xq_show = quantize(xs, Nshow);

% --- Aliasing: sample a 30 kHz tone at 40 kHz -> folds to 10 kHz ---
fs2 = 40e3; t2 = (0:1/fs2:2e-3-1/fs2).';
falias = 30e3;                        % above fs2/2 = 20 kHz
xa = sin(2*pi*falias*t2);
falias_apparent = abs(falias - round(falias/fs2)*fs2);
fprintf('True %.0f kHz aliases to %.0f kHz\n', falias/1e3, falias_apparent/1e3);

figure;
subplot(2,2,1); plot(bits, snr_meas,'o-', bits, snr_ideal,'--');
  legend('measured','6.02N+1.76','Location','NW'); grid on;
  xlabel('bits N'); ylabel('SNR (dB)'); title('ADC SNR vs resolution');
subplot(2,2,2); stairs(xs, xq_show); hold on; plot(xs, xs,':');
  grid on; title(sprintf('%d-bit quantization staircase', Nshow)); xlabel('in'); ylabel('out');
subplot(2,2,3); plot(t(1:200)*1e3, x(1:200)); hold on;
  stairs(t(1:200)*1e3, quantize(x(1:200),4)); grid on;
  legend('analog','4-bit'); xlabel('ms'); title('Time-domain quantization');
subplot(2,2,4); plot(t2*1e3, xa,'.-'); grid on;
  title(sprintf('Undersampled 30kHz -> looks like %.0fkHz', falias_apparent/1e3));
  xlabel('ms');
`,
    python: String.raw`# ADC: quantize a sine to N bits, measure SNR, compare to 6.02N+1.76 dB.
# Sweep N; demonstrate aliasing by undersampling.
import numpy as np
import matplotlib.pyplot as plt

fs  = 100e3
t   = np.arange(0, 20e-3, 1/fs)
fin = 2.3e3
x   = 0.98*np.sin(2*np.pi*fin*t)      # near full scale in [-1,1]

def quantize(sig, N):
    lvl = 2**(N-1) - 1
    return np.round(sig*lvl)/lvl

# --- SNR vs bits sweep ---
bits = np.arange(4, 17)
snr_meas = []
for N in bits:
    xq = quantize(x, N)
    e  = xq - x
    snr_meas.append(10*np.log10(np.sum(x**2)/np.sum(e**2)))
snr_meas  = np.array(snr_meas)
snr_ideal = 6.02*bits + 1.76

# --- Quantization staircase (few bits) ---
Nshow = 3
xs = np.linspace(-1, 1, 400)
xq_show = quantize(xs, Nshow)

# --- Aliasing: 30 kHz tone sampled at 40 kHz folds to 10 kHz ---
fs2 = 40e3
t2  = np.arange(0, 2e-3, 1/fs2)
falias = 30e3
xa = np.sin(2*np.pi*falias*t2)
apparent = abs(falias - round(falias/fs2)*fs2)
print('True %.0f kHz aliases to %.0f kHz' % (falias/1e3, apparent/1e3))

fig, ax = plt.subplots(2, 2, figsize=(11, 7))
ax[0,0].plot(bits, snr_meas, 'o-', label='measured')
ax[0,0].plot(bits, snr_ideal, '--', label='6.02N+1.76')
ax[0,0].legend(); ax[0,0].grid(True); ax[0,0].set(xlabel='bits N', ylabel='SNR (dB)', title='ADC SNR vs resolution')
ax[0,1].step(xs, xq_show, where='mid'); ax[0,1].plot(xs, xs, ':')
ax[0,1].grid(True); ax[0,1].set(title='%d-bit quantization staircase' % Nshow, xlabel='in', ylabel='out')
ax[1,0].plot(t[:200]*1e3, x[:200], label='analog')
ax[1,0].step(t[:200]*1e3, quantize(x[:200], 4), where='mid', label='4-bit')
ax[1,0].legend(); ax[1,0].grid(True); ax[1,0].set(xlabel='ms', title='Time-domain quantization')
ax[1,1].plot(t2*1e3, xa, '.-'); ax[1,1].grid(True)
ax[1,1].set(title='Undersampled 30kHz -> looks like %.0fkHz' % (apparent/1e3), xlabel='ms')
plt.tight_layout(); plt.show()
`
  },
  'dac': {
    matlab: String.raw`% DAC: zero-order-hold (ZOH) reconstruction.
% Show the sinc(f/fs) envelope and spectral images at multiples of fs,
% plus optional inverse-sinc pre-emphasis to flatten the passband.
clear; close all; clc;

fs   = 20e3;            % DAC update rate
fsig = 3e3;             % tone to reconstruct
Nsym = 256;
n    = (0:Nsym-1).';
d    = sin(2*pi*fsig/fs*n);           % discrete samples

% --- Zero-order hold: repeat each sample OS times (oversampled "analog") ---
OS   = 32;
fs_a = fs*OS;                          % pseudo-analog rate
zoh  = kron(d, ones(OS,1));            % staircase output of the DAC

% --- Optional inverse-sinc pre-emphasis (boost highs before DAC) ---
% ZOH imposes H(f)=sinc(f/fs); pre-distort digital samples to compensate.
Nf   = length(d);
f0   = (0:Nf-1).'/Nf*fs;               % bin frequencies 0..fs
fc0  = min(f0, fs-f0);                 % fold to [0,fs/2]
sinc_resp = sinc(fc0/fs);              % ZOH magnitude response
D    = fft(d);
d_pre = real(ifft(D ./ max(sinc_resp,1e-3)));
zoh_pre = kron(d_pre, ones(OS,1));

% --- Spectra of the pseudo-analog ZOH output (shows images) ---
NFFT = 4096;
f = (0:NFFT-1)/NFFT*fs_a;
Z  = abs(fft(zoh(1:NFFT).*hann(NFFT)));
% Theoretical ZOH sinc envelope across the wide band
env = abs(sinc(f/fs));

figure;
subplot(2,1,1);
stairs((0:5*OS-1)/fs_a*1e3, zoh(1:5*OS)); grid on;
xlabel('ms'); ylabel('DAC out'); title('Zero-order-hold staircase');

subplot(2,1,2);
plot(f/1e3, 20*log10(Z/max(Z)+eps)); hold on;
plot(f/1e3, 20*log10(env+eps), '--', 'LineWidth',1.2);
for k=1:4, xline(k*fs/1e3, ':'); end
xlim([0 fs_a/2/1e3]); ylim([-60 5]); grid on;
legend('ZOH output','sinc(f/fs) envelope','Location','NE');
xlabel('kHz'); ylabel('dB'); title('Spectral images at k*fs under sinc roll-off');
fprintf('Passband droop at fsig: %.2f dB\n', 20*log10(sinc(fsig/fs)));
`,
    python: String.raw`# DAC: zero-order-hold (ZOH) reconstruction.
# Show the sinc(f/fs) envelope and spectral images at multiples of fs,
# plus optional inverse-sinc pre-emphasis.
import numpy as np
import matplotlib.pyplot as plt

fs   = 20e3            # DAC update rate
fsig = 3e3            # tone to reconstruct
Nsym = 256
n    = np.arange(Nsym)
d    = np.sin(2*np.pi*fsig/fs*n)      # discrete samples

# np.sinc is the normalized sinc: sinc(x)=sin(pi x)/(pi x)
sinc = np.sinc

# --- Zero-order hold: repeat each sample OS times (pseudo-analog) ---
OS   = 32
fs_a = fs*OS
zoh  = np.repeat(d, OS)                # DAC staircase output

# --- Optional inverse-sinc pre-emphasis ---
Nf   = len(d)
f0   = np.arange(Nf)/Nf*fs
fc0  = np.minimum(f0, fs-f0)          # fold to [0, fs/2]
sinc_resp = sinc(fc0/fs)
D      = np.fft.fft(d)
d_pre  = np.real(np.fft.ifft(D/np.maximum(sinc_resp, 1e-3)))
zoh_pre = np.repeat(d_pre, OS)

# --- Spectrum of the ZOH output (reveals images) ---
NFFT = 4096
win  = np.hanning(NFFT)
Z    = np.abs(np.fft.fft(zoh[:NFFT]*win))
f    = np.arange(NFFT)/NFFT*fs_a
env  = np.abs(sinc(f/fs))             # theoretical ZOH envelope

fig, ax = plt.subplots(2, 1, figsize=(10, 7))
ax[0].step(np.arange(5*OS)/fs_a*1e3, zoh[:5*OS], where='post')
ax[0].grid(True); ax[0].set(xlabel='ms', ylabel='DAC out', title='Zero-order-hold staircase')

ax[1].plot(f/1e3, 20*np.log10(Z/Z.max()+1e-12), label='ZOH output')
ax[1].plot(f/1e3, 20*np.log10(env+1e-12), '--', lw=1.2, label='sinc(f/fs) envelope')
for k in range(1, 5):
    ax[1].axvline(k*fs/1e3, ls=':', color='gray')
ax[1].set_xlim(0, fs_a/2/1e3); ax[1].set_ylim(-60, 5); ax[1].grid(True); ax[1].legend()
ax[1].set(xlabel='kHz', ylabel='dB', title='Spectral images at k*fs under sinc roll-off')
print('Passband droop at fsig: %.2f dB' % (20*np.log10(sinc(fsig/fs))))
plt.tight_layout(); plt.show()
`
  },
  'ad9361': {
    matlab: String.raw`% AD9361 (Analog Devices RF Agile Transceiver): configuration-style script.
% If a real device + libiio/Communications Toolbox is present, the top block
% would tune the LO/sample-rate/bandwidth and stream I/Q. Since hardware is
% usually absent, we fall back to a clearly-commented SIMULATED equivalent.
clear; close all; clc;

% ---------- HARDWARE PATH (representative; commented out) ----------
% rx = sdrrx('AD936x', ...
%     'IPAddress',        '192.168.2.1', ...
%     'CenterFrequency',  2.4e9, ...      % LO tune (Hz)
%     'BasebandSampleRate', 5e6, ...      % ADC/interpolation rate (Hz)
%     'RFBandwidth',      4e6, ...        % analog LPF bandwidth (Hz)
%     'GainSource',       'Manual', 'Gain', 30, ...
%     'SamplesPerFrame',  4096, 'OutputDataType','double');
% iq = rx();          % returns a complex column vector of I/Q samples
% release(rx);

% ---------- SIMULATED EQUIVALENT ----------
cfg.CenterFrequency   = 2.4e9;   % LO (Hz)   -- not simulated at RF, just recorded
cfg.BasebandSampleRate= 5e6;     % fs (Hz)
cfg.RFBandwidth       = 4e6;     % analog BW (Hz)
cfg.SamplesPerFrame   = 4096;

fs = cfg.BasebandSampleRate;
N  = cfg.SamplesPerFrame;
t  = (0:N-1).'/fs;

% Simulate a received complex baseband: a tone at +1.2 MHz plus noise.
% (Zero-IF: the AD9361 delivers I/Q already centered at the LO.)
f_off = 1.2e6;
iq = 0.7*exp(1i*2*pi*f_off*t) + 0.05*(randn(N,1)+1i*randn(N,1));

% Emulate the analog RFBandwidth LPF (anything beyond +/-BW/2 is rejected).
NFFT = N;
f = (-NFFT/2:NFFT/2-1).'*fs/NFFT;
mask = double(abs(f) <= cfg.RFBandwidth/2);
IQf = fftshift(fft(iq)).*mask;
iq  = ifft(ifftshift(IQf));

fprintf('AD9361 (sim): LO=%.3f GHz  fs=%.1f MHz  BW=%.1f MHz  N=%d\n', ...
    cfg.CenterFrequency/1e9, fs/1e6, cfg.RFBandwidth/1e6, N);

P = 20*log10(abs(fftshift(fft(iq.*hann(N))))+eps);
figure;
subplot(2,1,1); plot(t(1:400)*1e6, real(iq(1:400)), t(1:400)*1e6, imag(iq(1:400)));
  legend('I','Q'); xlabel('us'); title('AD9361 captured I/Q (simulated)'); grid on;
subplot(2,1,2); plot(f/1e6, P); xlabel('MHz'); ylabel('dB'); grid on;
  title('Baseband spectrum (tone at +1.2 MHz, within RFBandwidth)');
`,
    python: String.raw`# AD9361 (Analog Devices RF Agile Transceiver) via pyadi-iio.
# With real hardware, the HARDWARE PATH below tunes LO / sample rate /
# bandwidth and streams I/Q. Without libiio/hardware, we run a clearly
# commented SIMULATED equivalent of tuning + capturing I/Q.
import numpy as np
import matplotlib.pyplot as plt

# ---------- HARDWARE PATH (representative) ----------
def capture_hardware():
    import adi                              # pyadi-iio
    sdr = adi.ad9361(uri='ip:192.168.2.1')
    sdr.rx_lo            = int(2.4e9)       # LO tune (Hz)
    sdr.sample_rate      = int(5e6)         # ADC/baseband rate (Hz)
    sdr.rx_rf_bandwidth  = int(4e6)         # analog LPF bandwidth (Hz)
    sdr.gain_control_mode_chan0 = 'manual'
    sdr.rx_hardwaregain_chan0   = 30
    sdr.rx_buffer_size   = 4096
    return sdr.rx()                         # complex I/Q ndarray

# ---------- SIMULATED EQUIVALENT ----------
cfg = dict(center_freq=2.4e9, sample_rate=5e6, rf_bandwidth=4e6, nsamp=4096)
fs, N = cfg['sample_rate'], cfg['nsamp']
t = np.arange(N)/fs

try:
    iq = capture_hardware()
    src = 'hardware'
except Exception:
    # Zero-IF: AD9361 delivers I/Q centered at the LO. Simulate a tone at +1.2 MHz.
    f_off = 1.2e6
    iq = 0.7*np.exp(1j*2*np.pi*f_off*t) + 0.05*(np.random.randn(N)+1j*np.random.randn(N))
    # Emulate the analog RFBandwidth LPF: reject content beyond +/- BW/2.
    f = np.fft.fftshift(np.fft.fftfreq(N, 1/fs))
    mask = (np.abs(f) <= cfg['rf_bandwidth']/2).astype(float)
    iq = np.fft.ifft(np.fft.ifftshift(np.fft.fftshift(np.fft.fft(iq))*mask))
    src = 'simulated'

print('AD9361 (%s): LO=%.3f GHz  fs=%.1f MHz  BW=%.1f MHz  N=%d' %
      (src, cfg['center_freq']/1e9, fs/1e6, cfg['rf_bandwidth']/1e6, N))

f = np.fft.fftshift(np.fft.fftfreq(N, 1/fs))
P = 20*np.log10(np.abs(np.fft.fftshift(np.fft.fft(iq*np.hanning(N))))+1e-12)

fig, ax = plt.subplots(2, 1, figsize=(10, 7))
ax[0].plot(t[:400]*1e6, iq[:400].real, label='I')
ax[0].plot(t[:400]*1e6, iq[:400].imag, label='Q')
ax[0].legend(); ax[0].grid(True); ax[0].set(xlabel='us', title='AD9361 captured I/Q (%s)' % src)
ax[1].plot(f/1e6, P); ax[1].grid(True)
ax[1].set(xlabel='MHz', ylabel='dB', title='Baseband spectrum (tone at +1.2 MHz, within RFBandwidth)')
plt.tight_layout(); plt.show()
`
  },
  'rfsoc': {
    matlab: String.raw`% RFSoC: direct RF sampling + digital down-conversion (DDC).
% Generate an RF signal, sample at a (scaled) GSPS-like rate, then mix with an
% NCO and decimate to baseband. Nyquist zones are annotated. On real hardware
% the RF Data Converter (xrfdc) does the ADC + hardware NCO/decimation.
clear; close all; clc;

% Scale everything by 1e6 so "GSPS" runs fast: 1 unit = 1 MHz here.
fs   = 2.048e9/1e3;      % 2.048 MSPS stand-in for 2.048 GSPS ADC
f_rf = 0.6e9/1e3;        % 600 MHz stand-in RF carrier (Nyquist zone 1)
N    = 8192;
t    = (0:N-1).'/fs;

% Direct-RF signal: carrier with a small +5 (MHz-scaled) modulation offset.
f_mod = 5e6/1e3;
rf = cos(2*pi*(f_rf+f_mod)*t) + 0.02*randn(N,1);

% --- Digital Down-Conversion: complex NCO mix to DC, then decimate ---
nco = exp(-1i*2*pi*f_rf*t);         % tune NCO to the carrier
mix = rf.*nco;                       % shifts carrier to baseband

D   = 16;                            % decimation factor
% Anti-alias FIR before decimation (moving average for illustration)
h   = ones(64,1)/64;
mixf= filter(h,1,mix);
bb  = mixf(1:D:end);                 % decimated complex baseband
fs_bb = fs/D;

fprintf('RFSoC DDC: fs=%.1f (scaled)  f_rf=%.1f  Nyquist zone=%d  fs_bb=%.1f\n', ...
    fs, f_rf, floor(f_rf/(fs/2))+1, fs_bb);

% Spectra
NF = 4096;
f1 = (-NF/2:NF/2-1).'*fs/NF;
Prf= 20*log10(abs(fftshift(fft(rf(1:NF).*hann(NF))))+eps);
Nb = length(bb);
f2 = (-Nb/2:Nb/2-1).'*fs_bb/Nb;
Pbb= 20*log10(abs(fftshift(fft(bb.*hann(Nb))))+eps);

figure;
subplot(2,1,1); plot(f1, Prf); grid on; xlabel('freq (scaled)'); ylabel('dB');
  title('Direct-RF spectrum (carrier in Nyquist zone 1)');
  xline(fs/2, ':'); text(fs/2, max(Prf)-10, ' fs/2');
subplot(2,1,2); plot(f2, Pbb); grid on; xlabel('freq (scaled)'); ylabel('dB');
  title(sprintf('After DDC + decimate-by-%d: baseband peak near f mod', D));
% --- Hardware note (xrfdc): configure ADC tile sample rate, set the coarse/fine
%     NCO to f_rf, enable the on-chip DDC + decimation, then read the I/Q stream.
`,
    python: String.raw`# RFSoC: direct RF sampling + digital down-conversion (DDC).
# Generate an RF signal, sample at a (scaled) GSPS-like rate, mix with an NCO,
# and decimate to baseband. Nyquist zones annotated. On real hardware the
# RF Data Converter (xrfdc) performs the ADC + hardware NCO + decimation.
import numpy as np
import matplotlib.pyplot as plt

# Scale by 1e3 so "GSPS" runs fast: values below are MHz-scaled stand-ins.
fs    = 2.048e9/1e3      # 2.048 MSPS stand-in for a 2.048 GSPS ADC
f_rf  = 0.6e9/1e3       # 600 MHz stand-in carrier (Nyquist zone 1)
N     = 8192
t     = np.arange(N)/fs

f_mod = 5e6/1e3
rf = np.cos(2*np.pi*(f_rf+f_mod)*t) + 0.02*np.random.randn(N)

# --- DDC: complex NCO mix to DC, anti-alias filter, decimate ---
nco = np.exp(-1j*2*np.pi*f_rf*t)     # tune NCO to carrier
mix = rf*nco
h   = np.ones(64)/64
mixf = np.convolve(mix, h, mode='same')
D   = 16
bb  = mixf[::D]                       # decimated complex baseband
fs_bb = fs/D

zone = int(np.floor(f_rf/(fs/2))) + 1
print('RFSoC DDC: fs=%.1f (scaled)  f_rf=%.1f  Nyquist zone=%d  fs_bb=%.1f' %
      (fs, f_rf, zone, fs_bb))

NF = 4096
f1 = np.fft.fftshift(np.fft.fftfreq(NF, 1/fs))
Prf = 20*np.log10(np.abs(np.fft.fftshift(np.fft.fft(rf[:NF]*np.hanning(NF))))+1e-12)
Nb = len(bb)
f2 = np.fft.fftshift(np.fft.fftfreq(Nb, 1/fs_bb))
Pbb = 20*np.log10(np.abs(np.fft.fftshift(np.fft.fft(bb*np.hanning(Nb))))+1e-12)

fig, ax = plt.subplots(2, 1, figsize=(10, 7))
ax[0].plot(f1, Prf); ax[0].grid(True); ax[0].axvline(fs/2, ls=':', color='gray')
ax[0].set(xlabel='freq (scaled)', ylabel='dB', title='Direct-RF spectrum (carrier in Nyquist zone 1)')
ax[1].plot(f2, Pbb); ax[1].grid(True)
ax[1].set(xlabel='freq (scaled)', ylabel='dB',
          title='After DDC + decimate-by-%d: baseband peak near f_mod' % D)
plt.tight_layout(); plt.show()
# Hardware note (xrfdc): set ADC tile sample rate, program coarse/fine NCO to
# f_rf, enable the on-chip DDC + decimation, then stream the I/Q via DMA.
`
  }
});
