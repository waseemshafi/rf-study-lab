// fft-bin.js — MATLAB + Python teaching code for the "FFT Bins & Frequency Resolution" topic.
// Populates CONTENT_CODE['fft-bin']. No literal backticks or template-literal placeholders inside code strings.
// Every part is self-checking: measured numbers are printed next to the theoretical values they must match.
Object.assign(CONTENT_CODE, {
  'fft-bin': {
    matlab: String.raw`% FFT BIN / RESOLUTION experiments, all runnable and self-checking (base MATLAB or Octave;
% no toolboxes -- windows are built explicitly):
%   PART 1: on-bin tone lands in ONE bin  vs  off-bin tone leaking into every bin
%   PART 2: scalloping loss swept over sub-bin offset; worst case vs theory 20*log10(2/pi) = 3.92 dB
%   PART 3: rectangular vs Hann (and Hamming/Blackman/flat-top) -- ENBW and highest sidelobe
%   PART 4: zero-padding INTERPOLATES but does NOT resolve two closely-spaced tones
format short g;

fs = 1000;                 % sample rate (Hz)
N  = 256;                  % record length (samples)
n  = (0:N-1);
df = fs/N;                 % bin width  = frequency resolution
T  = N/fs;                 % record (observation) length
fprintf('SETUP: fs=%g Hz  N=%d  ->  df = fs/N = %.5f Hz,  T = N/fs = %.4f s,  1/T = %.5f Hz\n', ...
        fs, N, df, T, 1/T);

% =================== PART 1: ON-BIN vs OFF-BIN ===================
k0    = 20;                      % target bin index
f_on  = k0*df;                   % exactly ON bin 20 (integer cycles in the record)
f_off = (k0+0.5)*df;             % worst case: exactly halfway between bins 20 and 21

x_on  = cos(2*pi*f_on *n/fs);    % unit-amplitude tones
x_off = cos(2*pi*f_off*n/fs);

% single-sided amplitude estimate: 2*|X[k]| / sum(window). Rect window => sum(w) = N.
A_on  = 2*abs(fft(x_on ))/N;
A_off = 2*abs(fft(x_off))/N;

cyc_on  = f_on *T;               % cycles completed inside the record
cyc_off = f_off*T;
fprintf('\nPART 1 on-bin : f = %.4f Hz = %g*df, cycles in record = %.2f (integer -> ON-BIN)\n', f_on, k0, cyc_on);
fprintf('PART 1 on-bin : peak A[%d] = %.6f ; neighbours A[%d]=%.3e  A[%d]=%.3e  (essentially zero)\n', ...
        k0, A_on(k0+1), k0-1, A_on(k0), k0+1, A_on(k0+2));
fprintf('PART 1 off-bin: f = %.4f Hz = %.1f*df, cycles in record = %.2f (fractional -> OFF-BIN)\n', ...
        f_off, k0+0.5, cyc_off);
fprintf('PART 1 off-bin: straddling bins A[%d]=%.4f  A[%d]=%.4f  (theory 2/pi = 0.6366 each)\n', ...
        k0, A_off(k0+1), k0+1, A_off(k0+2));
fprintf('PART 1 off-bin: outer neighbours A[%d]=%.4f  A[%d]=%.4f  (LEAKAGE -- nothing is zero now)\n', ...
        k0-1, A_off(k0), k0+2, A_off(k0+3));

% count how many of the N/2 one-sided bins hold more than -40 dB relative to the peak
half   = 1:(N/2);
nz_on  = sum(A_on(half)  > 0.01*max(A_on(half)));
nz_off = sum(A_off(half) > 0.01*max(A_off(half)));
fprintf('PART 1 bins above -40 dBc: on-bin = %d (energy is confined), off-bin = %d (energy is spread)\n', ...
        nz_on, nz_off);

% =================== PART 2: SCALLOPING LOSS vs SUB-BIN OFFSET ===================
w_rect = ones(1,N);
w_hann = 0.5 - 0.5*cos(2*pi*n/N);          % PERIODIC Hann (correct one for spectral analysis)
deltas = 0:0.02:1;
Lr = zeros(size(deltas));  Lh = zeros(size(deltas));
for i = 1:numel(deltas)
    f  = (k0+deltas(i))*df;
    % a COMPLEX exponential (not a real cosine) isolates the effect: a real cosine also carries a
    % negative-frequency image whose own leakage adds ~0.1 dB of error to the measurement
    x  = exp(2j*pi*f*n/fs);
    Xr = abs(fft(x.*w_rect))/sum(w_rect);   % normalising by sum(w) makes an on-bin tone read 1.0
    Xh = abs(fft(x.*w_hann))/sum(w_hann);
    Lr(i) = max(Xr(half));                  % best (largest) bin the analyser can report
    Lh(i) = max(Xh(half));
end
worst_r = min(Lr);  worst_h = min(Lh);
theo_r  = 2/pi;                             % |sinc(1/2)|
fprintf('\nPART 2 scalloping (rect): worst measured factor = %.5f  -> %.3f dB\n', worst_r, -20*log10(worst_r));
fprintf('PART 2 scalloping (rect): theory 2/pi             = %.5f  -> %.3f dB   [match]\n', theo_r, -20*log10(theo_r));
fprintf('PART 2 scalloping (Hann): worst measured factor = %.5f  -> %.3f dB  (textbook 1.42 dB)\n', ...
        worst_h, -20*log10(worst_h));
fprintf('PART 2 the worst case occurs at a HALF-bin offset, delta = %.2f\n', deltas(find(Lr==worst_r,1)));

% =================== PART 3: WINDOW COMPARISON (ENBW + highest sidelobe) ===================
Nw = 64;  m = (0:Nw-1);  Npad = 8192;       % heavy padding to trace the window transform finely
W = { 'Rectangular', ones(1,Nw), 1;
      'Hann',        0.5 - 0.5*cos(2*pi*m/Nw),                                        2;
      'Hamming',     0.54 - 0.46*cos(2*pi*m/Nw),                                      2;
      'Blackman',    0.42 - 0.5*cos(2*pi*m/Nw) + 0.08*cos(4*pi*m/Nw),                 3;
      'Flat-top',    0.21557895 - 0.41663158*cos(2*pi*m/Nw) + 0.277263158*cos(4*pi*m/Nw) ...
                     - 0.083578947*cos(6*pi*m/Nw) + 0.006947368*cos(8*pi*m/Nw),       5 };
fprintf('\nPART 3 window comparison (ENBW = N*sum(w^2)/sum(w)^2, in bins):\n');
fprintf('  %-12s  %8s  %8s  %12s\n', 'window', 'CohGain', 'ENBW', 'peak sidelobe');
for i = 1:size(W,1)
    w    = W{i,2};  mlobe = W{i,3};          % mlobe = main-lobe half-width in bins
    cg   = sum(w)/Nw;                        % coherent gain
    enbw = Nw*sum(w.^2)/sum(w)^2;            % equivalent noise bandwidth, in bins
    S    = abs(fft(w, Npad));  S = S/S(1);   % window transform, normalised to its DC peak
    binp = Npad/Nw;                          % output samples per true bin
    lo   = round(mlobe*binp) + 1;            % first sample past the main lobe
    sl   = 20*log10(max(S(lo:Npad/2)));      % highest sidelobe, dB
    fprintf('  %-12s  %8.4f  %8.4f  %9.1f dB\n', W{i,1}, cg, enbw, sl);
end
fprintf('  (expected ENBW: 1.00 / 1.50 / 1.36 / 1.73 / ~3.77 ; sidelobes -13 / -31 / -43 / -58 dB.\n');
fprintf('   The flat-top tends to its tabulated -93 dB only for long windows; at N=%d it measures ~-88 dB.)\n', Nw);

% =================== PART 4: ZERO-PADDING DOES NOT RESOLVE ===================
% Two equal tones 2 Hz apart. BOTH cases below produce 2048 output bins at the SAME spacing.
f1 = 100; f2 = 102;  Nfft = 2048;
% Case A: only 256 REAL samples (T = 0.256 s), zero-padded up to 2048
nA = (0:255);
xA = cos(2*pi*f1*nA/fs) + cos(2*pi*f2*nA/fs);
XA = abs(fft(xA, Nfft));
% Case B: 2048 REAL samples (T = 2.048 s), no padding
nB = (0:Nfft-1);
xB = cos(2*pi*f1*nB/fs) + cos(2*pi*f2*nB/fs);
XB = abs(fft(xB));

dfd = fs/Nfft;                               % identical DISPLAY bin spacing in both cases
lo  = round(95/dfd)+1;  hi = round(107/dfd)+1;
cntA = count_peaks(XA, lo, hi);
cntB = count_peaks(XB, lo, hi);
fprintf('\nPART 4 two tones at %g and %g Hz (separation %g Hz); both FFTs have %d bins, spacing %.4f Hz\n', ...
        f1, f2, f2-f1, Nfft, dfd);
fprintf('  Case A: 256 real samples + zero-pad -> T = %.3f s, TRUE df = %.3f Hz -> peaks found = %d\n', ...
        256/fs, fs/256, cntA);
fprintf('  Case B: 2048 real samples           -> T = %.3f s, TRUE df = %.3f Hz -> peaks found = %d\n', ...
        Nfft/fs, fs/Nfft, cntB);
fprintf('  Verdict: identical bin spacing, different RESOLUTION. Zero-padding interpolates; only T resolves.\n');

% residual scalloping after zero-padding by L
L = 8;  dmax = 1/(2*L);
fprintf('  Bonus: padding by L=%d leaves worst offset %.4f bin -> scalloping %.3f dB (vs 3.92 dB unpadded)\n', ...
        L, dmax, -20*log10(sin(pi*dmax)/(pi*dmax)));

figure;
subplot(3,1,1);
stem(0:40, A_on(1:41), 'filled'); hold on; stem(0:40, A_off(1:41), 'r'); grid on;
xlabel('bin index k'); ylabel('amplitude'); legend('on-bin','off-bin');
title('On-bin lands in one bin; off-bin leaks everywhere');
subplot(3,1,2);
plot(deltas, 20*log10(Lr), 'LineWidth', 1.3); hold on; plot(deltas, 20*log10(Lh), 'LineWidth', 1.3); grid on;
xlabel('sub-bin offset \delta'); ylabel('measured level (dB)'); legend('rectangular','Hann');
title('Scalloping loss: worst at \delta = 0.5 (rect 3.92 dB, Hann 1.42 dB)');
subplot(3,1,3);
fax = (0:Nfft-1)*dfd;
plot(fax(lo:hi), XA(lo:hi)/max(XA(lo:hi)), 'r', 'LineWidth', 1.3); hold on;
plot(fax(lo:hi), XB(lo:hi)/max(XB(lo:hi)), 'g', 'LineWidth', 1.3); grid on;
xlabel('frequency (Hz)'); ylabel('normalised |X|'); legend('256 real + zeros','2048 real');
title('Same 2048 bins: zero-padding does NOT separate the two tones');

function c = count_peaks(mag, lo, hi)
    seg = mag(lo:hi);  pk = max(seg);  c = 0;
    for i = 2:numel(seg)-1
        if seg(i) > seg(i-1) && seg(i) >= seg(i+1) && seg(i) > 0.5*pk
            c = c + 1;
        end
    end
end
`,
    python: String.raw`# FFT BIN / RESOLUTION experiments, all runnable and self-checking (NumPy only):
#   PART 1: on-bin tone lands in ONE bin  vs  off-bin tone leaking into every bin
#   PART 2: scalloping loss swept over sub-bin offset; worst case vs theory 20*log10(2/pi) = 3.92 dB
#   PART 3: rectangular vs Hann (and Hamming/Blackman/flat-top) -- ENBW and highest sidelobe
#   PART 4: zero-padding INTERPOLATES but does NOT resolve two closely-spaced tones
import numpy as np

fs = 1000.0                 # sample rate (Hz)
N  = 256                    # record length (samples)
n  = np.arange(N)
df = fs/N                   # bin width = frequency resolution
T  = N/fs                   # record (observation) length
print(f"SETUP: fs={fs:g} Hz  N={N}  ->  df = fs/N = {df:.5f} Hz,  T = N/fs = {T:.4f} s,  1/T = {1/T:.5f} Hz")

# =================== PART 1: ON-BIN vs OFF-BIN ===================
k0    = 20
f_on  = k0*df               # exactly ON bin 20 (integer cycles in the record)
f_off = (k0+0.5)*df         # worst case: exactly halfway between bins 20 and 21

x_on  = np.cos(2*np.pi*f_on *n/fs)
x_off = np.cos(2*np.pi*f_off*n/fs)

# single-sided amplitude estimate: 2*|X[k]| / sum(window). Rect window => sum(w) = N.
A_on  = 2*np.abs(np.fft.fft(x_on ))/N
A_off = 2*np.abs(np.fft.fft(x_off))/N

print(f"\nPART 1 on-bin : f = {f_on:.4f} Hz = {k0}*df, cycles in record = {f_on*T:.2f} (integer -> ON-BIN)")
print(f"PART 1 on-bin : peak A[{k0}] = {A_on[k0]:.6f} ; "
      f"neighbours A[{k0-1}]={A_on[k0-1]:.3e}  A[{k0+1}]={A_on[k0+1]:.3e}  (essentially zero)")
print(f"PART 1 off-bin: f = {f_off:.4f} Hz = {k0+0.5}*df, cycles in record = {f_off*T:.2f} (fractional -> OFF-BIN)")
print(f"PART 1 off-bin: straddling bins A[{k0}]={A_off[k0]:.4f}  A[{k0+1}]={A_off[k0+1]:.4f}  "
      f"(theory 2/pi = 0.6366 each)")
print(f"PART 1 off-bin: outer neighbours A[{k0-1}]={A_off[k0-1]:.4f}  A[{k0+2}]={A_off[k0+2]:.4f}  "
      f"(LEAKAGE -- nothing is zero now)")

half   = slice(0, N//2)
nz_on  = int(np.sum(A_on[half]  > 0.01*A_on[half].max()))
nz_off = int(np.sum(A_off[half] > 0.01*A_off[half].max()))
print(f"PART 1 bins above -40 dBc: on-bin = {nz_on} (energy is confined), off-bin = {nz_off} (energy is spread)")

# =================== PART 2: SCALLOPING LOSS vs SUB-BIN OFFSET ===================
w_rect = np.ones(N)
w_hann = 0.5 - 0.5*np.cos(2*np.pi*n/N)      # PERIODIC Hann (the correct one for spectral analysis)
deltas = np.arange(0, 1.0001, 0.02)
Lr, Lh = [], []
for d in deltas:
    # a COMPLEX exponential (not a real cosine) isolates the effect: a real cosine also carries a
    # negative-frequency image whose own leakage adds ~0.1 dB of error to the measurement
    x  = np.exp(2j*np.pi*((k0+d)*df)*n/fs)
    # normalising by sum(w) makes an on-bin tone read exactly 1.0 for any window
    Xr = np.abs(np.fft.fft(x*w_rect))/w_rect.sum()
    Xh = np.abs(np.fft.fft(x*w_hann))/w_hann.sum()
    Lr.append(Xr[half].max())               # best (largest) bin the analyser can report
    Lh.append(Xh[half].max())
Lr = np.array(Lr); Lh = np.array(Lh)

worst_r, worst_h = Lr.min(), Lh.min()
theo_r = 2/np.pi                            # |sinc(1/2)|
print(f"\nPART 2 scalloping (rect): worst measured factor = {worst_r:.5f}  -> {-20*np.log10(worst_r):.3f} dB")
print(f"PART 2 scalloping (rect): theory 2/pi             = {theo_r:.5f}  -> {-20*np.log10(theo_r):.3f} dB   [match]")
print(f"PART 2 scalloping (Hann): worst measured factor = {worst_h:.5f}  -> {-20*np.log10(worst_h):.3f} dB  (textbook 1.42 dB)")
print(f"PART 2 the worst case occurs at a HALF-bin offset, delta = {deltas[int(np.argmin(Lr))]:.2f}")

# =================== PART 3: WINDOW COMPARISON (ENBW + highest sidelobe) ===================
Nw = 64; m = np.arange(Nw); Npad = 8192     # heavy padding to trace the window transform finely
windows = [
    ("Rectangular", np.ones(Nw), 1),
    ("Hann",        0.5  - 0.5 *np.cos(2*np.pi*m/Nw), 2),
    ("Hamming",     0.54 - 0.46*np.cos(2*np.pi*m/Nw), 2),
    ("Blackman",    0.42 - 0.5 *np.cos(2*np.pi*m/Nw) + 0.08*np.cos(4*np.pi*m/Nw), 3),
    ("Flat-top",    0.21557895 - 0.41663158*np.cos(2*np.pi*m/Nw)
                  + 0.277263158*np.cos(4*np.pi*m/Nw) - 0.083578947*np.cos(6*np.pi*m/Nw)
                  + 0.006947368*np.cos(8*np.pi*m/Nw), 5),
]
print("\nPART 3 window comparison (ENBW = N*sum(w^2)/sum(w)^2, in bins):")
print(f"  {'window':<12}  {'CohGain':>8}  {'ENBW':>8}  {'peak sidelobe':>14}")
for name, w, mlobe in windows:
    cg   = w.sum()/Nw                       # coherent gain
    enbw = Nw*np.sum(w**2)/w.sum()**2       # equivalent noise bandwidth, in bins
    S    = np.abs(np.fft.fft(w, Npad)); S = S/S[0]
    binp = Npad//Nw                         # output samples per true bin
    lo   = mlobe*binp                       # first sample past the main lobe
    sl   = 20*np.log10(S[lo:Npad//2].max())
    print(f"  {name:<12}  {cg:8.4f}  {enbw:8.4f}  {sl:11.1f} dB")
print("  (expected ENBW: 1.00 / 1.50 / 1.36 / 1.73 / ~3.77 ; sidelobes -13 / -31 / -43 / -58 dB.")
print(f"   The flat-top tends to its tabulated -93 dB only for long windows; at N={Nw} it measures ~-88 dB.)")

# =================== PART 4: ZERO-PADDING DOES NOT RESOLVE ===================
def count_peaks(mag, lo, hi, rel=0.5):
    seg = mag[lo:hi]; pk = seg.max(); c = 0
    for i in range(1, len(seg)-1):
        if seg[i] > seg[i-1] and seg[i] >= seg[i+1] and seg[i] > rel*pk:
            c += 1
    return c

# Two equal tones 2 Hz apart. BOTH cases below produce 2048 output bins at the SAME spacing.
f1, f2, Nfft = 100.0, 102.0, 2048
nA = np.arange(256)                          # Case A: only 256 REAL samples, then zero-padded
xA = np.cos(2*np.pi*f1*nA/fs) + np.cos(2*np.pi*f2*nA/fs)
XA = np.abs(np.fft.fft(xA, Nfft))
nB = np.arange(Nfft)                         # Case B: 2048 REAL samples, no padding
xB = np.cos(2*np.pi*f1*nB/fs) + np.cos(2*np.pi*f2*nB/fs)
XB = np.abs(np.fft.fft(xB))

dfd = fs/Nfft                                # identical DISPLAY bin spacing in both cases
lo, hi = int(round(95/dfd)), int(round(107/dfd))
cntA, cntB = count_peaks(XA, lo, hi), count_peaks(XB, lo, hi)
print(f"\nPART 4 two tones at {f1:g} and {f2:g} Hz (separation {f2-f1:g} Hz); "
      f"both FFTs have {Nfft} bins, spacing {dfd:.4f} Hz")
print(f"  Case A: 256 real samples + zero-pad -> T = {256/fs:.3f} s, TRUE df = {fs/256:.3f} Hz -> peaks found = {cntA}")
print(f"  Case B: 2048 real samples           -> T = {Nfft/fs:.3f} s, TRUE df = {fs/Nfft:.3f} Hz -> peaks found = {cntB}")
print("  Verdict: identical bin spacing, different RESOLUTION. Zero-padding interpolates; only T resolves.")

L = 8; dmax = 1/(2*L)                        # residual scalloping after zero-padding by L
resid = -20*np.log10(np.sin(np.pi*dmax)/(np.pi*dmax))
print(f"  Bonus: padding by L={L} leaves worst offset {dmax:.4f} bin -> scalloping {resid:.3f} dB (vs 3.92 dB unpadded)")

try:
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(3, 1, figsize=(7, 9))
    ax[0].stem(np.arange(41), A_on[:41], linefmt='C0-', markerfmt='C0o', basefmt=' ', label='on-bin')
    ax[0].stem(np.arange(41), A_off[:41], linefmt='C3-', markerfmt='C3x', basefmt=' ', label='off-bin')
    ax[0].set_xlabel('bin index k'); ax[0].set_ylabel('amplitude'); ax[0].legend(); ax[0].grid(True)
    ax[0].set_title('On-bin lands in one bin; off-bin leaks everywhere')
    ax[1].plot(deltas, 20*np.log10(Lr), lw=1.3, label='rectangular')
    ax[1].plot(deltas, 20*np.log10(Lh), lw=1.3, label='Hann')
    ax[1].set_xlabel('sub-bin offset delta'); ax[1].set_ylabel('measured level (dB)')
    ax[1].legend(); ax[1].grid(True)
    ax[1].set_title('Scalloping loss: worst at delta = 0.5 (rect 3.92 dB, Hann 1.42 dB)')
    fax = np.arange(Nfft)*dfd
    ax[2].plot(fax[lo:hi], XA[lo:hi]/XA[lo:hi].max(), 'C3', lw=1.3, label='256 real + zeros')
    ax[2].plot(fax[lo:hi], XB[lo:hi]/XB[lo:hi].max(), 'C2', lw=1.3, label='2048 real')
    ax[2].set_xlabel('frequency (Hz)'); ax[2].set_ylabel('normalised |X|'); ax[2].legend(); ax[2].grid(True)
    ax[2].set_title('Same 2048 bins: zero-padding does NOT separate the two tones')
    plt.tight_layout(); plt.show()
except Exception as e:
    print('(plot skipped:', e, ')')
`,
    note: String.raw`Four experiments, each printing a measured number beside the theory it must match. PART 1 sets fs=1000 Hz and N=256, so df=fs/N=3.90625 Hz and T=N/fs=0.256 s (note 1/T=df exactly). A tone at 20*df completes exactly 20.00 cycles in the record and lands entirely in bin 20 with amplitude 1.000 while its neighbours read about 1e-16 -- machine zero. Moving the tone by half a bin, to 20.5*df, makes it complete 20.50 cycles; now the two straddling bins read 0.6295 and 0.6437 -- both within about 1 percent of the theoretical 2/pi = 0.6366, the small split either side of it being the real cosine's negative-frequency image leaking back (a complex exponential, used in PART 2, removes that bias) -- and every other bin is non-zero, so the count of bins above -40 dBc jumps from 1 to all 128 (the quietest bin in the half-spectrum still sits at -38.3 dBc): that is spectral leakage, caused by the fractional cycle leaving a seam in the DFT's periodic extension. PART 2 sweeps the sub-bin offset from 0 to 1 using a complex exponential (which, unlike a real cosine, carries no negative-frequency image to contaminate the measurement) and records the largest bin the analyser could report; the worst value occurs exactly at delta=0.5 and measures 0.636624, i.e. 3.9223 dB of scalloping loss, against the theoretical 2/pi = 0.636620 and 3.9224 dB -- agreement to five digits. The periodic Hann window (normalised by sum(w) so an on-bin tone still reads 1.0) bottoms out at 0.84883 = 1.424 dB, the textbook Hann figure, and the closed form agrees: the Hann transform is 0.5*D(d) + 0.25*D(d-1) + 0.25*D(d+1), so at d = 0.5 it is 0.5*sinc(0.5) + 0.25*sinc(-0.5) + 0.25*sinc(1.5) = 0.31831 + 0.15916 - 0.05305 = 0.42441, and dividing by the coherent gain 0.5 gives 0.84883 again. (Watch the sign: sinc(1.5) = -0.21221 is negative, so that third term SUBTRACTS; flipping it to +0.05305 would give 1.061, an impossible gain above unity.) PART 3 computes ENBW = N*sum(w^2)/sum(w)^2 directly from the window samples and measures the highest sidelobe from a heavily zero-padded window transform, reproducing the comparison table: rectangular 1.0000 bins / -13.3 dB, Hann 1.5000 / -31.5, Hamming 1.3628 / -42.4, Blackman 1.7268 / -58.1, flat-top 3.7702 / -88.2 (the flat-top's tabulated -93 dB is an asymptotic figure approached only for long windows) -- the monotone trade of sidelobe suppression bought with main-lobe width. Note the ENBW values are exact, matching the closed forms 0.375/0.25 = 1.5 for Hann, 0.3974/0.2916 = 1.363 for Hamming and 0.3046/0.1764 = 1.727 for Blackman. PART 4 is the decisive zero-padding experiment: two equal tones 2 Hz apart are transformed twice, both producing 2048 bins at an identical 0.488 Hz display spacing, but Case A holds only 256 real samples (T=0.256 s, true resolution 3.906 Hz) padded with zeros and yields ONE merged peak, while Case B holds 2048 real samples (T=2.048 s, true resolution 0.488 Hz) and cleanly yields TWO. Same bins, different information: padding interpolates the spectrum and (as the bonus line shows) collapses scalloping from 3.92 dB to 0.056 dB at L=8, but only a longer observation buys resolution.`
  }
});
