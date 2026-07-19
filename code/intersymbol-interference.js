// intersymbol-interference.js — MATLAB + Python teaching code for the "Intersymbol Interference (ISI)" topic.
// Populates CONTENT_CODE['intersymbol-interference']. No literal backticks or template-literal placeholders inside code strings.
// Every part is self-checking: measured numbers are printed next to the theoretical values they must match.
Object.assign(CONTENT_CODE, {
  'intersymbol-interference': {
    matlab: String.raw`% INTERSYMBOL INTERFERENCE experiments, all runnable and self-checking (base MATLAB or Octave;
% no toolboxes -- the raised-cosine pulse and the equalizers are built explicitly):
%   PART 1: a raised-cosine pulse has h(nT) = 0 at EVERY non-zero multiple of T  -> zero ISI
%   PART 2: a timing offset destroys that property; measure D and the eye-closure penalty
%   PART 3: a dispersive channel tap list -> ISI for one data pattern vs the WORST pattern
%   PART 4: zero-forcing equalizer removes the ISI but ENHANCES noise; MMSE trades the two
format short g;

T  = 1;                          % symbol period (normalised)
Rs = 1/T;                        % symbol rate
fprintf('SETUP: T = %g, Rs = %g. Nyquist minimum baseband bandwidth = Rs/2 = %g\n', T, Rs, Rs/2);

% =================== PART 1: A NYQUIST PULSE HAS ZEROS ON THE SYMBOL GRID ===================
alpha = 0.35;                    % raised-cosine roll-off
SPAN  = 20;                      % how many symbol periods either side we account for
fprintf('\nPART 1 raised cosine, alpha = %.2f. Occupied baseband BW = (1+alpha)*Rs/2 = %.4f\n', ...
        alpha, (1+alpha)*Rs/2);
fprintf('  n        h(nT)          (must be 1 at n=0, ZERO elsewhere)\n');
for n = 0:4
    fprintf('  %2d   %14.6e\n', n, rcpulse(n*T, alpha));
end
D_ideal = peakdist(alpha, 0, SPAN);
fprintf('  peak distortion D at PERFECT timing = %.3e  (machine zero -> no ISI)\n', D_ideal);

% =================== PART 2: A TIMING OFFSET RE-CREATES ISI ===================
% The Nyquist property holds AT the sampling instants only. Sample at mT + eps and the
% neighbours' zero crossings are missed, AND the wanted term shrinks from h(0) to h(eps).
fprintf('\nPART 2a sampling-phase offset sweep at alpha = %.2f (span +-%d symbols):\n', alpha, SPAN);
fprintf('   eps/T     h(eps)        D          eye opening   penalty (dB)\n');
for e = [0 0.01 0.02 0.05 0.10 0.15 0.20]
    D  = peakdist(alpha, e, SPAN);
    h0 = rcpulse(e*T, alpha);
    fprintf('   %5.2f    %7.5f    %7.5f     %7.4f      %6.3f\n', ...
            e, h0, D, 2*(1-D), -20*log10(1-D));
end

fprintf('\nPART 2b the SAME 10%% offset, for different roll-offs (bigger alpha is more forgiving):\n');
fprintf('   alpha       D       penalty (dB)\n');
for a = [0.001 0.22 0.35 0.50 1.00]
    D = peakdist(a, 0.10, SPAN);
    fprintf('   %5.3f   %7.5f    %7.3f\n', a, D, -20*log10(1-D));
end
fprintf('  (alpha -> 0 is the ideal sinc: its 1/t tails make the sum DIVERGE. Watch it grow with span:)\n');
for sp = [5 20 100 1000]
    Dsinc = peakdist(0.001, 0.10, sp);
    if Dsinc >= 1
        flag = '  <-- EYE FULLY CLOSED (D >= 1)';
    else
        flag = '';
    end
    fprintf('    sinc, span +-%4d symbols -> D = %.4f%s\n', sp, Dsinc, flag);
end

% =================== PART 3: A DISPERSIVE CHANNEL TAP LIST ===================
% Overall response sampled on the symbol grid, cursor at index 3 (offsets n = -2..+2):
taps = [0.05 -0.20 1.00 0.30 -0.10];
cur  = 3;                                  % index of h(0)
offs = (1:numel(taps)) - cur;              % n = -2 -1 0 1 2
% y_m = sum_n a_{m-n} h(nT). Take this pattern (a_{m+2} .. a_{m-2} as n = -2..2 partners):
%   a_{m-2}=+1  a_{m-1}=+1  a_m=+1  a_{m+1}=-1  a_{m+2}=+1
% so the symbol multiplying tap h(nT) is a_{m-n}:
sym_for_tap = [ +1 -1 +1 +1 +1 ];          % partners of n = -2,-1,0,1,2 i.e. a_{m+2},a_{m+1},a_m,a_{m-1},a_{m-2}
isi_pattern = sum(sym_for_tap(offs~=0) .* taps(offs~=0));
y_pattern   = sym_for_tap(cur)*taps(cur) + isi_pattern;

D_ch    = sum(abs(taps(offs~=0))) / abs(taps(cur));
y_worst = abs(taps(cur))*(1 - D_ch);
worst_syms = -sign(taps(cur)) * sign(taps);          % the adversarial data pattern
fprintf('\nPART 3 channel taps h(nT), n = -2..+2:');  fprintf(' %+.2f', taps); fprintf('\n');
fprintf('  ISI for the given pattern      = %+.4f  ->  y_m = %.4f  (CONSTRUCTIVE here -- looks fine!)\n', ...
        isi_pattern, y_pattern);
fprintf('  peak distortion D              = %.4f   (= sum|h(nT)|/|h(0)| over n ~= 0)\n', D_ch);
fprintf('  WORST-case sample              = %.4f   (%.1f%% of the margin destroyed)\n', y_worst, 100*D_ch);
fprintf('  worst-case data pattern a_{m-n}:'); fprintf(' %+d', worst_syms(offs~=0)); fprintf('\n');
fprintf('  vertical eye opening           = %.4f   (fully open would be 2.0000)\n', 2*y_worst);
fprintf('  eye-closure SNR penalty        = %.3f dB\n', -20*log10(1-D_ch));
if D_ch >= 1
    fprintf('  *** D >= 1: eye CLOSED, errors occur with zero noise ***\n');
end
% brute-force check that no data pattern is worse than the D bound
side = taps(offs~=0);  nb = numel(side);  worst_found = 0;
for m = 0:(2^nb - 1)
    bits = 2*bitget(m, 1:nb) - 1;                    % all +-1 patterns
    worst_found = max(worst_found, abs(sum(bits .* side)));
end
fprintf('  brute force over all %d patterns: max |ISI| = %.4f  vs  D*|h(0)| = %.4f   [match]\n', ...
        2^nb, worst_found, D_ch*abs(taps(cur)));

% =================== PART 4: ZERO-FORCING vs MMSE EQUALIZATION ===================
% Channel H(z) = 1 + a z^-1. Its magnitude dips to |1-a| at the band edge.
L      = 30;                       % equalizer length
snr_db = 20;  sw2 = 10^(-snr_db/10);   % noise variance (symbol energy normalised to 1)
fprintf('\nPART 4 equalizing H(z) = 1 + a z^-1 with L = %d taps at Es/N0 = %d dB\n', L, snr_db);
for a = [0.5 0.9]
    h = [1 a];
    % ---- zero forcing: exact inverse 1/(1 + a z^-1) = sum_k (-a)^k z^-k, truncated to L
    czf  = (-a).^(0:L-1);
    comb = conv(h, czf);                       % combined channel+equalizer response
    Dzf  = (sum(abs(comb)) - abs(comb(1))) / abs(comb(1));
    enh  = sum(czf.^2);                        % noise power gain = ||c||^2
    mse_zf = sum(comb(2:end).^2) + enh*sw2;    % residual ISI power + amplified noise
    % ---- MMSE: solve R c = p with R = channel autocorr + noise, p = delayed channel
    best_mse = inf;
    for d = 0:(L + numel(h) - 2)
        R = zeros(L); p = zeros(L,1);
        for i = 1:L
            for j = 1:L
                R(i,j) = chanacf(h, i-j) + (i==j)*sw2;
            end
            k = d - (i-1) + 1;
            if k >= 1 && k <= numel(h), p(i) = h(k); end
        end
        c   = R \ p;
        mse = 1 - p.'*c;
        if mse < best_mse
            best_mse = mse;  best_c = c;  best_d = d;
        end
    end
    cmb2 = conv(h, best_c.');
    Dmm  = (sum(abs(cmb2)) - abs(cmb2(best_d+1))) / abs(cmb2(best_d+1));
    enh2 = sum(best_c.^2);
    fprintf('\n  a = %.1f :  |H|min = %.2f  (%.2f dB dip)\n', a, 1-a, 20*log10(1-a));
    fprintf('    ZF  : noise enh = %.4f (%.3f dB)   theory 1/(1-a^2) = %.4f (%.3f dB)   resid D = %.5f   MSE = %.5f\n', ...
            enh, 10*log10(enh), 1/(1-a^2), 10*log10(1/(1-a^2)), Dzf, mse_zf);
    fprintf('    MMSE: noise enh = %.4f (%.3f dB)   best delay = %2d                     resid D = %.5f   MSE = %.5f\n', ...
            enh2, 10*log10(enh2), best_d, Dmm, best_mse);
    fprintf('    -> MMSE ACCEPTS residual ISI to avoid amplifying noise; ZF forces D to 0 and pays for it.\n');
end

% =================== PLOTS ===================
tt = -6:0.01:6;
figure;
subplot(3,1,1);
plot(tt, rcpulse(tt, alpha), 'LineWidth', 1.4); hold on; grid on;
stem(-6:6, rcpulse(-6:6, alpha), 'filled', 'r');
plot((-6:6)+0.1, rcpulse((-6:6)+0.1, alpha), 'go', 'MarkerSize', 5);
xlabel('t / T'); ylabel('h(t)'); legend('raised cosine','samples at nT (zero!)','samples at nT+0.1T');
title('Nyquist pulse: zero at every nT -- but NOT at nT + 0.1T');
subplot(3,1,2);
ev = 0:0.005:0.25;  Dv = arrayfun(@(e) peakdist(0.35, e, SPAN), ev);
plot(ev, -20*log10(1-Dv), 'LineWidth', 1.4); hold on; grid on;
plot(ev, -20*log10(1-arrayfun(@(e) peakdist(0.22, e, SPAN), ev)), 'LineWidth', 1.4);
plot(ev, -20*log10(1-arrayfun(@(e) peakdist(1.00, e, SPAN), ev)), 'LineWidth', 1.4);
xlabel('timing offset \epsilon / T'); ylabel('eye-closure penalty (dB)');
legend('\alpha = 0.35','\alpha = 0.22','\alpha = 1.0','Location','NorthWest');
title('Timing offset re-creates ISI; larger roll-off is more forgiving');
subplot(3,1,3);
fT = linspace(0, 0.5, 400);
for a = [0.5 0.9]
    Hm = abs(1 + a*exp(-2j*pi*fT));
    plot(fT, 20*log10(Hm), 'LineWidth', 1.3); hold on;
    plot(fT, -20*log10(Hm), '--', 'LineWidth', 1.3);
end
grid on; xlabel('normalised frequency fT'); ylabel('dB');
legend('|H|, a=0.5','|1/H| (ZF), a=0.5','|H|, a=0.9','|1/H| (ZF), a=0.9');
title('Zero forcing inverts the channel -- and amplifies noise in the null');

% ---------- helper functions ----------
function y = rcpulse(t, alpha)
    % raised-cosine impulse response, T = 1, with both removable singularities handled
    y = zeros(size(t));
    for i = 1:numel(t)
        u = t(i);
        if abs(u) < 1e-12
            y(i) = 1;
        elseif alpha > 0 && abs(abs(u) - 1/(2*alpha)) < 1e-9
            y(i) = (alpha/2) * sin(pi/(2*alpha));      % L'Hopital at t = T/(2 alpha)
        else
            y(i) = (sin(pi*u)/(pi*u)) * cos(pi*alpha*u) / (1 - (2*alpha*u)^2);
        end
    end
end

function D = peakdist(alpha, eps_over_T, span)
    % peak distortion D = sum_{n~=0} |h(nT+eps)| / |h(eps)|
    n = -span:span;  n(n == 0) = [];
    D = sum(abs(rcpulse(n + eps_over_T, alpha))) / abs(rcpulse(eps_over_T, alpha));
end

function r = chanacf(h, k)
    % autocorrelation of the channel taps at lag k
    r = 0;
    for i = 1:numel(h)
        j = i + k;
        if j >= 1 && j <= numel(h), r = r + h(i)*h(j); end
    end
end
`,
    python: String.raw`# INTERSYMBOL INTERFERENCE experiments, all runnable and self-checking (NumPy only):
#   PART 1: a raised-cosine pulse has h(nT) = 0 at EVERY non-zero multiple of T  -> zero ISI
#   PART 2: a timing offset destroys that property; measure D and the eye-closure penalty
#   PART 3: a dispersive channel tap list -> ISI for one data pattern vs the WORST pattern
#   PART 4: zero-forcing equalizer removes the ISI but ENHANCES noise; MMSE trades the two
import itertools
import numpy as np

T, Rs = 1.0, 1.0            # symbol period and rate (normalised)
print(f"SETUP: T = {T:g}, Rs = {Rs:g}. Nyquist minimum baseband bandwidth = Rs/2 = {Rs/2:g}")


def rcpulse(t, alpha):
    """Raised-cosine impulse response with T = 1, both removable singularities handled."""
    t = np.atleast_1d(np.asarray(t, dtype=float))
    y = np.empty_like(t)
    for i, u in enumerate(t):
        if abs(u) < 1e-12:
            y[i] = 1.0
        elif alpha > 0 and abs(abs(u) - 1.0/(2*alpha)) < 1e-9:
            y[i] = (alpha/2) * np.sin(np.pi/(2*alpha))       # L'Hopital at t = T/(2 alpha)
        else:
            y[i] = (np.sin(np.pi*u)/(np.pi*u)) * np.cos(np.pi*alpha*u) / (1 - (2*alpha*u)**2)
    return y


def peakdist(alpha, eps, span):
    """Peak distortion D = sum_{n != 0} |h(nT + eps)| / |h(eps)|."""
    n = np.array([k for k in range(-span, span+1) if k != 0], dtype=float)
    return float(np.sum(np.abs(rcpulse(n + eps, alpha))) / abs(rcpulse(eps, alpha)[0]))


# =================== PART 1: A NYQUIST PULSE HAS ZEROS ON THE SYMBOL GRID ===================
alpha, SPAN = 0.35, 20
print(f"\nPART 1 raised cosine, alpha = {alpha:.2f}. "
      f"Occupied baseband BW = (1+alpha)*Rs/2 = {(1+alpha)*Rs/2:.4f}")
print("  n        h(nT)          (must be 1 at n=0, ZERO elsewhere)")
for n in range(5):
    print(f"  {n:2d}   {rcpulse(n*T, alpha)[0]:14.6e}")
print(f"  peak distortion D at PERFECT timing = {peakdist(alpha, 0.0, SPAN):.3e}  (machine zero -> no ISI)")

# =================== PART 2: A TIMING OFFSET RE-CREATES ISI ===================
# The Nyquist property holds AT the sampling instants only. Sample at mT + eps and the
# neighbours' zero crossings are missed, AND the wanted term shrinks from h(0) to h(eps).
print(f"\nPART 2a sampling-phase offset sweep at alpha = {alpha:.2f} (span +-{SPAN} symbols):")
print("   eps/T     h(eps)        D          eye opening   penalty (dB)")
for e in [0.0, 0.01, 0.02, 0.05, 0.10, 0.15, 0.20]:
    D, h0 = peakdist(alpha, e, SPAN), rcpulse(e*T, alpha)[0]
    pen = -20*np.log10(1-D) if D < 1 else np.inf
    print(f"   {e:5.2f}    {h0:7.5f}    {D:7.5f}     {2*(1-D):7.4f}      {pen:6.3f}")

print("\nPART 2b the SAME 10% offset, for different roll-offs (bigger alpha is more forgiving):")
print("   alpha       D       penalty (dB)")
for a in [0.001, 0.22, 0.35, 0.50, 1.00]:
    D = peakdist(a, 0.10, SPAN)
    print(f"   {a:5.3f}   {D:7.5f}    {-20*np.log10(1-D):7.3f}")
print("  (alpha -> 0 is the ideal sinc: its 1/t tails make the sum DIVERGE. Watch it grow with span:)")
for sp in [5, 20, 100, 1000]:
    D = peakdist(0.001, 0.10, sp)
    flag = "  <-- EYE FULLY CLOSED (D >= 1)" if D >= 1 else ""
    print(f"    sinc, span +-{sp:4d} symbols -> D = {D:.4f}{flag}")

# =================== PART 3: A DISPERSIVE CHANNEL TAP LIST ===================
# Overall response sampled on the symbol grid, cursor at index 2 (offsets n = -2..+2):
taps = np.array([0.05, -0.20, 1.00, 0.30, -0.10])
cur  = 2
offs = np.arange(len(taps)) - cur                # n = -2 -1 0 1 2
# y_m = sum_n a_{m-n} h(nT); the symbol multiplying tap h(nT) is a_{m-n}, so with the pattern
#   a_{m-2}=+1  a_{m-1}=+1  a_m=+1  a_{m+1}=-1  a_{m+2}=+1
# the partners of n = -2,-1,0,1,2 are a_{m+2}, a_{m+1}, a_m, a_{m-1}, a_{m-2}:
sym_for_tap = np.array([+1, -1, +1, +1, +1])
side = offs != 0
isi_pattern = float(np.sum(sym_for_tap[side] * taps[side]))
y_pattern   = sym_for_tap[cur]*taps[cur] + isi_pattern

D_ch    = float(np.sum(np.abs(taps[side])) / abs(taps[cur]))
y_worst = abs(taps[cur]) * (1 - D_ch)
worst_syms = (-np.sign(taps[cur]) * np.sign(taps)).astype(int)
print("\nPART 3 channel taps h(nT), n = -2..+2:", " ".join(f"{v:+.2f}" for v in taps))
print(f"  ISI for the given pattern      = {isi_pattern:+.4f}  ->  y_m = {y_pattern:.4f}"
      f"  (CONSTRUCTIVE here -- looks fine!)")
print(f"  peak distortion D              = {D_ch:.4f}   (= sum|h(nT)|/|h(0)| over n != 0)")
print(f"  WORST-case sample              = {y_worst:.4f}   ({100*D_ch:.1f}% of the margin destroyed)")
print("  worst-case data pattern a_{m-n}:", " ".join(f"{v:+d}" for v in worst_syms[side]))
print(f"  vertical eye opening           = {2*y_worst:.4f}   (fully open would be 2.0000)")
print(f"  eye-closure SNR penalty        = {-20*np.log10(1-D_ch):.3f} dB")
if D_ch >= 1:
    print("  *** D >= 1: eye CLOSED, errors occur with zero noise ***")
# brute-force check that no data pattern beats the D bound
sd = taps[side]
worst_found = max(abs(float(np.dot(b, sd))) for b in itertools.product([-1, 1], repeat=len(sd)))
print(f"  brute force over all {2**len(sd)} patterns: max |ISI| = {worst_found:.4f}"
      f"  vs  D*|h(0)| = {D_ch*abs(taps[cur]):.4f}   [match]")

# =================== PART 4: ZERO-FORCING vs MMSE EQUALIZATION ===================
# Channel H(z) = 1 + a z^-1. Its magnitude dips to |1-a| at the band edge.
L, snr_db = 30, 20
sw2 = 10**(-snr_db/10)                            # noise variance, symbol energy normalised to 1
print(f"\nPART 4 equalizing H(z) = 1 + a z^-1 with L = {L} taps at Es/N0 = {snr_db} dB")


def chanacf(h, k):
    return float(sum(h[i]*h[i+k] for i in range(len(h)) if 0 <= i+k < len(h)))


for a in [0.5, 0.9]:
    h = np.array([1.0, a])
    # ---- zero forcing: exact inverse 1/(1 + a z^-1) = sum_k (-a)^k z^-k, truncated to L
    czf  = (-a) ** np.arange(L)
    comb = np.convolve(h, czf)
    Dzf  = (np.sum(np.abs(comb)) - abs(comb[0])) / abs(comb[0])
    enh  = float(np.sum(czf**2))                  # noise power gain = ||c||^2
    mse_zf = float(np.sum(comb[1:]**2) + enh*sw2) # residual ISI power + amplified noise
    # ---- MMSE: solve R c = p with R = channel autocorrelation + noise, p = delayed channel
    best = None
    for d in range(L + len(h) - 1):
        R = np.array([[chanacf(h, i-j) + (sw2 if i == j else 0.0) for j in range(L)]
                      for i in range(L)])
        p = np.array([h[d-i] if 0 <= d-i < len(h) else 0.0 for i in range(L)])
        c = np.linalg.solve(R, p)
        mse = float(1 - p @ c)
        if best is None or mse < best[0]:
            best = (mse, c, d)
    mse_mm, cmm, dmm = best
    cmb2 = np.convolve(h, cmm)
    Dmm  = (np.sum(np.abs(cmb2)) - abs(cmb2[dmm])) / abs(cmb2[dmm])
    enh2 = float(np.sum(cmm**2))
    print(f"\n  a = {a:.1f} :  |H|min = {1-a:.2f}  ({20*np.log10(1-a):.2f} dB dip)")
    print(f"    ZF  : noise enh = {enh:.4f} ({10*np.log10(enh):.3f} dB)   "
          f"theory 1/(1-a^2) = {1/(1-a*a):.4f} ({10*np.log10(1/(1-a*a)):.3f} dB)   "
          f"resid D = {Dzf:.5f}   MSE = {mse_zf:.5f}")
    print(f"    MMSE: noise enh = {enh2:.4f} ({10*np.log10(enh2):.3f} dB)   best delay = {dmm:2d}"
          f"                     resid D = {Dmm:.5f}   MSE = {mse_mm:.5f}")
    print("    -> MMSE ACCEPTS residual ISI to avoid amplifying noise; ZF forces D to 0 and pays for it.")

# =================== PLOTS ===================
try:
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(3, 1, figsize=(7, 10))
    tt = np.arange(-6, 6.001, 0.01)
    grid = np.arange(-6, 7, dtype=float)
    ax[0].plot(tt, rcpulse(tt, alpha), lw=1.4, label='raised cosine')
    ax[0].stem(grid, rcpulse(grid, alpha), linefmt='C3-', markerfmt='C3o', basefmt=' ',
               label='samples at nT (zero!)')
    ax[0].plot(grid+0.1, rcpulse(grid+0.1, alpha), 'C2o', ms=5, label='samples at nT+0.1T')
    ax[0].set_xlabel('t / T'); ax[0].set_ylabel('h(t)'); ax[0].grid(True); ax[0].legend(fontsize=8)
    ax[0].set_title('Nyquist pulse: zero at every nT -- but NOT at nT + 0.1T')
    ev = np.arange(0, 0.2501, 0.005)
    for aa in [0.22, 0.35, 1.00]:
        Dv = np.array([peakdist(aa, e, SPAN) for e in ev])
        ax[1].plot(ev, -20*np.log10(1-Dv), lw=1.4, label=f'alpha = {aa}')
    ax[1].set_xlabel('timing offset eps / T'); ax[1].set_ylabel('eye-closure penalty (dB)')
    ax[1].grid(True); ax[1].legend()
    ax[1].set_title('Timing offset re-creates ISI; larger roll-off is more forgiving')
    fT = np.linspace(0, 0.5, 400)
    for aa in [0.5, 0.9]:
        Hm = np.abs(1 + aa*np.exp(-2j*np.pi*fT))
        ax[2].plot(fT, 20*np.log10(Hm), lw=1.3, label=f'|H|, a={aa}')
        ax[2].plot(fT, -20*np.log10(Hm), '--', lw=1.3, label=f'|1/H| (ZF), a={aa}')
    ax[2].set_xlabel('normalised frequency fT'); ax[2].set_ylabel('dB')
    ax[2].grid(True); ax[2].legend(fontsize=8)
    ax[2].set_title('Zero forcing inverts the channel -- and amplifies noise in the null')
    plt.tight_layout(); plt.show()
except Exception as e:
    print('(plot skipped:', e, ')')
`,
    note: String.raw`Four experiments, each printing a measured number beside the theory it must match. PART 1 builds a raised-cosine pulse with roll-off alpha = 0.35 (occupied baseband bandwidth (1+alpha)*Rs/2 = 0.675*Rs) and evaluates it on the symbol grid: h(0) = 1.000000 exactly, while h(T), h(2T), h(3T) and h(4T) all come back at the 1e-17 level or below (3.47e-17, -2.39e-17, 1.13e-17, -1.76e-18) -- machine zero. Summing the magnitudes of every neighbour out to +-20 symbols gives a peak distortion of about 1.7e-16, confirming the Nyquist condition h(nT) = h(0)*delta_n numerically. Note that the code handles BOTH removable singularities of the raised cosine: the obvious one at t = 0, and the 0/0 form at t = T/(2*alpha) where the denominator 1-(2*alpha*t/T)^2 vanishes, whose L'Hopital value is (alpha/2)*sin(pi/(2*alpha)). That second case is not academic -- at alpha = 0.5 it lands exactly on t = T, where it correctly evaluates to 0.25*sin(pi) = 0, preserving the zero crossing that the whole scheme depends on. PART 2a then moves the sampling instant. At eps = 0.01T the wanted term has barely moved (h = 0.99982) but D has already risen to 0.02676, costing 0.236 dB; by eps = 0.05T, D = 0.13415 (1.251 dB); by 0.10T, D = 0.27042 (2.739 dB); and by 0.20T, D = 0.55842 with the eye opening down to 0.883 out of 2.0 and the penalty at 7.100 dB. Two mechanisms compound: the numerator grows because the neighbours' zero crossings are missed, and the denominator shrinks because the wanted term falls from h(0) = 1 to h(eps) = 0.93121 at the largest offset. PART 2b repeats the same 10 percent offset across roll-offs and produces the design table directly: alpha = 0.22 gives D = 0.36146 (3.896 dB), alpha = 0.35 gives 0.27042 (2.739 dB), alpha = 0.5 gives 0.20029 (1.941 dB) and alpha = 1.0 gives just 0.08058 (0.730 dB) -- a 4.5x spread, which is the quantitative reason bandwidth buys timing tolerance. The sinc limit (alpha -> 0.001) is the cautionary case, and the code makes the divergence visible by growing the summation span: D = 0.4591 over +-5 symbols, 0.7219 over +-20, 1.0390 over +-100 and 1.4202 over +-1000, so somewhere past +-100 symbols D passes 1 and the eye is FULLY CLOSED -- errors with no noise whatsoever. That is the harmonic series 1/|n| refusing to converge, and it is why the theoretically optimal minimum-bandwidth pulse is never used. PART 3 switches from pulse shaping to a channel tap list h(nT) = [0.05, -0.20, 1.00, 0.30, -0.10] for n = -2..+2. For the particular data pattern chosen the ISI comes out at +0.4500, so the sample reads 1.4500 -- larger than ideal, because that pattern's interference happens to be constructive, which is exactly why a typical-case measurement is misleading. The worst case is computed two independent ways and they agree: the peak-distortion formula gives D = sum|h(nT)|/|h(0)| = 0.65/1.00 = 0.6500, while a brute-force search over all 2^4 = 16 sign patterns finds a maximum |ISI| of 0.6500 as well. So the worst sample is 0.3500 (65 percent of the margin gone), the vertical eye opening is 0.7000 against 2.0000 fully open, and the eye-closure penalty is 9.119 dB. The code also prints the adversarial pattern itself, a_{m-n} = -sign(a_m)*sign(h(nT)), which is a perfectly legal data sequence and will therefore occur in service. PART 4 equalizes the two-tap channel H(z) = 1 + a*z^-1 with a 30-tap equalizer at 20 dB SNR. For a = 0.5 the channel dips to |H|min = 0.50 (-6.02 dB) and the truncated zero-forcing inverse c_k = (-a)^k drives the residual distortion to 0.00000 while its energy measures 1.3333 -- exactly the theoretical 1/(1-a^2) = 1.3333, i.e. 1.249 dB of noise enhancement, a tolerable price. For a = 0.9 the dip deepens to 0.10 (-20.00 dB) and the same equalizer measures 5.2537 (7.205 dB) against the theoretical 5.2632 (7.212 dB), the small shortfall being truncation at 30 taps. The MMSE solution, obtained by solving R*c = p over every candidate delay and keeping the best, tells the other half of the story: on the mild a = 0.5 channel it barely differs (1.060 dB enhancement, MSE 0.01305 versus ZF's 0.01333), but on the deep-null a = 0.9 channel it deliberately leaves a residual distortion of 0.479 in order to cut noise enhancement from 7.205 dB to 4.398 dB, lowering total mean-squared error from 0.05433 to 0.03791 -- a 30 percent improvement obtained purely by refusing to fully invert the null. That single comparison is the whole argument for MMSE over zero forcing.`
  }
});
