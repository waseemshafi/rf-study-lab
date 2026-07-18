// dsss-receiver-implementation.js — MATLAB + Python teaching code for the DSSS Receiver Implementation topic.
// Populates CONTENT_CODE['dsss-receiver-implementation']. No literal backticks or template-literal placeholders inside code strings.
Object.assign(CONTENT_CODE, {
  'dsss-receiver-implementation': {
    matlab: String.raw`% DSSS receiver IMPLEMENTATION primitives, all runnable and self-checking:
%   PART 1: DDS/NCO phase accumulator -> tone at a target frequency + frequency resolution
%   PART 2: FFT-based parallel code-phase acquisition vs a serial correlator (+ op-count/speedup)
%   PART 3: fixed-point integrate-and-dump showing accumulator bit growth = ceil(log2 N)
rng(7);

% =================== PART 1: DDS / NCO (phase accumulator + FCW) ===================
B    = 32;                 % phase-accumulator width (bits)
fs   = 100e6;              % NCO clock (Hz)
ftgt = 2.5e6;             % target output frequency (Hz)
FCW  = round(ftgt * 2^B / fs);       % frequency control word (integer)
fact = FCW * fs / 2^B;               % actual synthesized frequency
df   = fs / 2^B;                      % frequency resolution (one FCW LSB)
fprintf('PART 1 DDS/NCO: FCW=%d  f_target=%.4f Hz  f_actual=%.4f Hz  err=%.4f Hz  df=%.6f Hz\n', ...
        FCW, ftgt, fact, ftgt-fact, df);

Nsmp  = 4096;
phase = mod((0:Nsmp-1) * FCW, 2^B);  % B-bit phase accumulator (wraps mod 2^B)
Lbits = 12;                          % use top 12 bits of phase to address a sine LUT
lut   = round(2047 * sin(2*pi*(0:2^Lbits-1)/2^Lbits));  % 12-bit signed sine LUT
addr  = floor(phase / 2^(B-Lbits));  % phase-to-amplitude: top bits index the LUT
tone  = lut(addr + 1);
% verify tone frequency by finding the dominant FFT bin:
S = abs(fft(double(tone))); S(1) = 0;
[~,pk] = max(S(1:Nsmp/2));  fmeas = (pk-1) * fs / Nsmp;
fprintf('PART 1 check: dominant FFT bin = %.4f MHz (near f_actual = %.4f MHz)\n', fmeas/1e6, fact/1e6);

% =================== PART 2: FFT parallel acquisition vs serial correlator ===================
N     = 1023;                         % code length (chips), 1 sample/chip for the search demo
code  = 2*(rand(1,N) > 0.5) - 1;      % +/-1 PN code
tau0  = 350;                          % true (unknown) code phase to recover
snr   = 3;                            % linear SNR of the buried signal
rxc   = circshift(code, [0 tau0]);    % received = shifted code ...
rx    = sqrt(snr)*rxc + randn(1,N);   % ... plus AWGN (signal below noise for snr<1; here modest)

% --- serial correlator: test ALL N phases one at a time (O(N^2)) ---
corrS = zeros(1,N);
for m = 0:N-1
    corrS(m+1) = sum(rx .* circshift(code, [0 m]));
end
[~,iS] = max(corrS);  tauS = iS-1;

% --- FFT-based circular correlation: ALL phases at once (O(N log N)) ---
C     = fft(code);
corrF = ifft(fft(rx) .* conj(C));     % circular correlation
[~,iF] = max(abs(corrF));  tauF = iF-1;

opsSerial = N*N;                      % complex mults, serial all-phase search
opsFFT    = round(N*log2(N));         % ~ two length-N transforms dominate
fprintf('PART 2 acquisition: true tau=%d  serial est=%d  FFT est=%d  (match=%d)\n', ...
        tau0, tauS, tauF, (tauS==tau0)&&(tauF==tau0));
fprintf('PART 2 op-count: serial ~ %d, FFT ~ %d, speedup ~ %.0fx\n', ...
        opsSerial, opsFFT, opsSerial/opsFFT);

% =================== PART 3: fixed-point integrate-and-dump bit growth ===================
Nchip = 1023;                         % integrate-and-dump length
bin   = 8;                            % input word length (signed): magnitude up to 2^(bin-1)
smpl  = randi([-2^(bin-1), 2^(bin-1)-1], 1, Nchip);   % 8-bit signed samples
acc   = sum(int64(smpl));             % exact wide accumulation
dB    = ceil(log2(Nchip));            % extra bits required
bacc  = bin + dB;                     % total accumulator width
worst = Nchip * 2^(bin-1);            % worst-case |sum|
fprintf('PART 3 bit growth: N=%d  extra bits=ceil(log2 N)=%d  total acc width=%d-bit signed\n', ...
        Nchip, dB, bacc);
fprintf('PART 3 check: worst-case |sum|=%d < 2^%d=%d ; this run |sum|=%d (fits=%d)\n', ...
        worst, bacc-1, 2^(bacc-1), abs(acc), abs(acc) < 2^(bacc-1));

figure;
subplot(2,1,1); plot(0:N-1, abs(corrF), 'LineWidth', 1.2); grid on;
xlabel('code phase (chips)'); ylabel('|correlation|');
title(sprintf('FFT parallel acquisition: peak at tau=%d (true %d)', tauF, tau0));
subplot(2,1,2); stem(0:63, double(tone(1:64)), 'filled'); grid on;
xlabel('sample'); ylabel('NCO out'); title(sprintf('DDS tone: f=%.3f MHz, df=%.4f Hz', fact/1e6, df));
`,
    python: String.raw`# DSSS receiver IMPLEMENTATION primitives, all runnable and self-checking:
#   PART 1: DDS/NCO phase accumulator -> tone at a target frequency + frequency resolution
#   PART 2: FFT-based parallel code-phase acquisition vs a serial correlator (+ op-count/speedup)
#   PART 3: fixed-point integrate-and-dump showing accumulator bit growth = ceil(log2 N)
import numpy as np

rng = np.random.default_rng(7)

# =================== PART 1: DDS / NCO (phase accumulator + FCW) ===================
B    = 32                       # phase-accumulator width (bits)
fs   = 100e6                    # NCO clock (Hz)
ftgt = 2.5e6                    # target output frequency (Hz)
FCW  = round(ftgt * 2**B / fs)  # frequency control word (integer)
fact = FCW * fs / 2**B          # actual synthesized frequency
df   = fs / 2**B                # frequency resolution (one FCW LSB)
print(f"PART 1 DDS/NCO: FCW={FCW}  f_target={ftgt:.4f} Hz  f_actual={fact:.4f} Hz  "
      f"err={ftgt-fact:.4f} Hz  df={df:.6f} Hz")

Nsmp  = 4096
n     = np.arange(Nsmp)
phase = (n * FCW) % (2**B)                      # B-bit phase accumulator (wraps mod 2^B)
Lbits = 12                                      # top 12 bits address a sine LUT
lut   = np.round(2047 * np.sin(2*np.pi*np.arange(2**Lbits)/2**Lbits)).astype(np.int64)
addr  = (phase // 2**(B-Lbits)).astype(np.int64)  # phase-to-amplitude: top bits index the LUT
tone  = lut[addr]
S = np.abs(np.fft.fft(tone.astype(float))); S[0] = 0
fmeas = np.argmax(S[:Nsmp//2]) * fs / Nsmp
print(f"PART 1 check: dominant FFT bin = {fmeas/1e6:.4f} MHz (near f_actual = {fact/1e6:.4f} MHz)")

# =================== PART 2: FFT parallel acquisition vs serial correlator ===================
N    = 1023                                     # code length (chips)
code = 2*(rng.random(N) > 0.5) - 1              # +/-1 PN code
tau0 = 350                                      # true (unknown) code phase
snr  = 3.0                                       # linear SNR of the buried signal
rxc  = np.roll(code, tau0)                       # received = shifted code ...
rx   = np.sqrt(snr)*rxc + rng.standard_normal(N) # ... plus AWGN

# serial correlator: test ALL N phases one at a time (O(N^2))
corrS = np.array([np.sum(rx * np.roll(code, m)) for m in range(N)])
tauS  = int(np.argmax(corrS))

# FFT-based circular correlation: ALL phases at once (O(N log N))
C     = np.fft.fft(code)
corrF = np.fft.ifft(np.fft.fft(rx) * np.conj(C))
tauF  = int(np.argmax(np.abs(corrF)))

ops_serial = N*N
ops_fft    = round(N*np.log2(N))
print(f"PART 2 acquisition: true tau={tau0}  serial est={tauS}  FFT est={tauF}  "
      f"match={(tauS==tau0) and (tauF==tau0)}")
print(f"PART 2 op-count: serial ~ {ops_serial}, FFT ~ {ops_fft}, speedup ~ {ops_serial/ops_fft:.0f}x")

# =================== PART 3: fixed-point integrate-and-dump bit growth ===================
Nchip = 1023                                     # integrate-and-dump length
bin_w = 8                                        # input word length (signed)
smpl  = rng.integers(-2**(bin_w-1), 2**(bin_w-1), size=Nchip)  # 8-bit signed samples
acc   = int(np.sum(smpl.astype(np.int64)))       # exact wide accumulation
dB    = int(np.ceil(np.log2(Nchip)))             # extra bits required
bacc  = bin_w + dB                               # total accumulator width
worst = Nchip * 2**(bin_w-1)                      # worst-case |sum|
print(f"PART 3 bit growth: N={Nchip}  extra bits=ceil(log2 N)={dB}  total acc width={bacc}-bit signed")
print(f"PART 3 check: worst-case |sum|={worst} < 2^{bacc-1}={2**(bacc-1)} ; "
      f"this run |sum|={abs(acc)} (fits={abs(acc) < 2**(bacc-1)})")

try:
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(2, 1, figsize=(7, 6))
    ax[0].plot(np.arange(N), np.abs(corrF), lw=1.2); ax[0].grid(True)
    ax[0].set_xlabel('code phase (chips)'); ax[0].set_ylabel('|correlation|')
    ax[0].set_title(f'FFT parallel acquisition: peak at tau={tauF} (true {tau0})')
    ax[1].stem(np.arange(64), tone[:64]); ax[1].grid(True)
    ax[1].set_xlabel('sample'); ax[1].set_ylabel('NCO out')
    ax[1].set_title(f'DDS tone: f={fact/1e6:.3f} MHz, df={df:.4f} Hz')
    plt.tight_layout(); plt.show()
except Exception as e:
    print('(plot skipped:', e, ')')
`,
    note: String.raw`Three implementation primitives, each self-checking. PART 1 builds a direct-digital-synthesis NCO: a 32-bit phase accumulator adds a frequency control word FCW=round(f_target*2^B/fs)=107374182 every clock, synthesizing 2.5 MHz to within ~0.009 Hz, bounded by the resolution df=fs/2^B=0.0233 Hz; the accumulator's top 12 bits address a sine LUT (the phase-to-amplitude converter) and an FFT of the output confirms the tone frequency. PART 2 recovers an unknown code phase two ways: a serial correlator tests all N=1023 phases one at a time (about N^2 = 1.05e6 complex multiplies) while an FFT-based circular correlation ifft(fft(rx).*conj(fft(code))) evaluates every phase at once (about N*log2(N) = 1.02e4), both landing on the true phase but the FFT ~102x cheaper — the reason acquisition is FFT-based. PART 3 sizes a fixed-point integrate-and-dump: summing N=1023 eight-bit samples needs ceil(log2 1023)=10 extra bits, an 18-bit signed accumulator, and the code verifies the worst-case magnitude 1023*128=130944 < 2^17, so it never overflows. Together they are the NCO, the correlator, and the bit budget that turn the DSSS receiver architecture into gates and samples.`
  }
});
