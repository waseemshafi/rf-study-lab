// 5g.js — MATLAB + Python teaching code for "5G Technology (5G NR)".
// Populates CONTENT_CODE['5g']. No literal backticks or template-literal placeholders inside code strings.
// Every part is self-checking: measured numbers are printed next to the theory they must match.
// PART 1 builds the NR numerology table for mu = 0..4 (SCS = 15*2^mu kHz, slot = 1ms/2^mu, 14 symbols/slot)
//        and shows the samples-per-slot invariant for a fixed FFT size.
// PART 2 evaluates the 3GPP (TS 38.306) peak data-rate formula for several carrier configurations
//        (FR1 100 MHz, FR2 400 MHz, and a two-carrier aggregate) and prints Mbps/Gbps.
// PART 3 computes a uniform-linear-array (ULA) beamforming array factor, steers the main beam, and
//        measures the half-power beamwidth, checking it against the 102/N rule and the 10log10(N) array gain.
// PART 4 counts the downlink resource grid (12 subcarriers/RB * 14 symbols/slot * N_RB) and the raw bit capacity.
Object.assign(CONTENT_CODE, {
  '5g': {
    matlab: String.raw`% 5G NR experiments, runnable and self-checking (base MATLAB or Octave, no toolboxes).
format short g;

% =================== PART 1: SCALABLE NUMEROLOGY (mu = 0..4) ===================
fprintf('=========== PART 1: NR numerology  SCS=15*2^mu kHz, slot=1ms/2^mu, 14 symbols/slot ===========\n');
Nfft = 4096;                              % example FFT size (sampling rate scales with SCS)
fprintf(' mu  SCS(kHz)  slot(ms)  slots/subframe  symbol(us)  Fs(MHz)  samples/slot\n');
for mu = 0:4
    scs   = 15e3 * 2^mu;                  % subcarrier spacing (Hz)
    Tslot = 1e-3 / 2^mu;                  % slot duration (s)
    nslot = 2^mu;                         % slots per 1 ms subframe
    Tsym  = Tslot / 14;                   % ~ OFDM symbol duration (s)
    Fs    = Nfft * scs;                   % sampling rate (Hz)
    spslot = Fs * Tslot;                  % samples per slot
    fprintf(' %d   %6.0f    %7.4f      %2d          %6.2f    %6.2f    %6.0f\n', ...
            mu, scs/1e3, Tslot*1e3, nslot, Tsym*1e6, Fs/1e6, spslot);
end
fprintf('Note: samples/slot = Nfft*15kHz = %d is INVARIANT in mu (Fs and slot scale oppositely).\n', Nfft*15);

% =================== PART 2: 3GPP PEAK DATA-RATE FORMULA (TS 38.306) ===================
fprintf('\n=========== PART 2: peak rate = 1e-6 * sum_j v*Qm*f*Rmax*(N_PRB*12/Ts)*(1-OH) ===========\n');
Rmax = 948/1024;                          % maximum code rate
% each row: [mu, N_PRB, Qm, v_layers, f, OH, label-index]
cfgs = { 1, 273, 8, 4, 1.0, 0.14, 'FR1 100MHz 30kHz, 4 layers, 256QAM';
         3, 264, 8, 2, 1.0, 0.18, 'FR2 400MHz 120kHz, 2 layers, 256QAM';
         1, 273, 8, 4, 1.0, 0.14, 'same FR1 carrier (for aggregation)'};
rates = zeros(1, size(cfgs,1));
for i = 1:size(cfgs,1)
    mu = cfgs{i,1}; Nprb = cfgs{i,2}; Qm = cfgs{i,3}; v = cfgs{i,4}; f = cfgs{i,5}; OH = cfgs{i,6};
    Ts = 1e-3 / (14 * 2^mu);              % average OFDM symbol duration in a subframe
    rate = 1e-6 * v * Qm * f * Rmax * (Nprb*12 / Ts) * (1 - OH);   % Mbps
    rates(i) = rate;
    fprintf('  %-42s -> %8.1f Mbps (%.2f Gbps)\n', cfgs{i,7}, rate, rate/1e3);
end
agg = rates(1) + rates(3);                % two-carrier aggregation of the FR1 carriers
fprintf('  carrier aggregation of the two FR1 carriers  -> %8.1f Mbps (%.2f Gbps)\n', agg, agg/1e3);

% =================== PART 3: ULA BEAMFORMING (array factor, steering, beamwidth) ===================
fprintf('\n=========== PART 3: ULA beamforming  gain=10log10(N),  HPBW ~ 102/N deg (broadside) ===========\n');
d = 0.5;                                  % element spacing in wavelengths (lambda/2)
theta0 = 90;                              % steer to broadside (degrees)
th = linspace(0, 180, 8001);             % observation angles (degrees)
for N = [8 16 64]
    beta = -2*pi*d*cosd(theta0);         % progressive phase for steering
    AF = zeros(size(th));
    for k = 1:numel(th)
        psi = 2*pi*d*cosd(th(k)) + beta;
        AF(k) = abs(sum(exp(1j*(0:N-1)*psi)));
    end
    AFdb = 20*log10(AF / max(AF));
    [~, pk] = max(AF);
    li = pk; while li > 1        && AFdb(li) > -3, li = li - 1; end
    ri = pk; while ri < numel(th) && AFdb(ri) > -3, ri = ri + 1; end
    HPBW = th(ri) - th(li);              % measured half-power beamwidth
    fprintf('  N=%2d: array gain=%5.2f dB, measured HPBW=%5.2f deg, theory 102/N=%5.2f deg\n', ...
            N, 10*log10(N), HPBW, 102/N);
end

% =================== PART 4: DOWNLINK RESOURCE GRID (RE and raw bits) ===================
fprintf('\n=========== PART 4: resource grid  N_RE = 12 * 14 * N_RB per slot ===========\n');
Nsc = 12; Nsym = 14; Nrb = 273; Qm = 8;   % 100 MHz FR1 @ 30 kHz -> 273 RB, 256-QAM
RE = Nsc * Nsym * Nrb;
fprintf('  N_RB=%d: RE/slot = %d*%d*%d = %d, raw bits/slot at Qm=%d: %d (%.2f Mbit)\n', ...
        Nrb, Nsc, Nsym, Nrb, RE, Qm, RE*Qm, RE*Qm/1e6);
% at mu=1 there are 2 slots per ms -> RE per second:
mu = 1; slots_per_s = 2^mu / 1e-3;
fprintf('  at mu=1 (%d slots/ms): RE/s = %.3e (matches N_PRB*12/Ts used in the peak-rate formula)\n', ...
        2^mu, RE * slots_per_s);
`,
    python: String.raw`# 5G NR experiments, runnable and self-checking (NumPy only).
# PART 1 tabulates the scalable numerology (SCS = 15*2^mu kHz, slot = 1ms/2^mu, 14 symbols/slot).
# PART 2 evaluates the 3GPP TS 38.306 peak data-rate formula for several carrier configurations.
# PART 3 computes a ULA beamforming array factor, steers the beam, and measures the half-power beamwidth.
# PART 4 counts the downlink resource grid (12 * 14 * N_RB) and the raw bit capacity.
import numpy as np

# =================== PART 1: SCALABLE NUMEROLOGY (mu = 0..4) ===================
print("=========== PART 1: NR numerology  SCS=15*2^mu kHz, slot=1ms/2^mu, 14 symbols/slot ===========")
Nfft = 4096
print(" mu  SCS(kHz)  slot(ms)  slots/subframe  symbol(us)  Fs(MHz)  samples/slot")
for mu in range(5):
    scs = 15e3 * 2 ** mu
    Tslot = 1e-3 / 2 ** mu
    nslot = 2 ** mu
    Tsym = Tslot / 14
    Fs = Nfft * scs
    spslot = Fs * Tslot
    print(f" {mu}   {scs/1e3:6.0f}    {Tslot*1e3:7.4f}      {nslot:2d}          "
          f"{Tsym*1e6:6.2f}    {Fs/1e6:6.2f}    {spslot:6.0f}")
print(f"Note: samples/slot = Nfft*15kHz = {Nfft*15} is INVARIANT in mu (Fs and slot scale oppositely).")

# =================== PART 2: 3GPP PEAK DATA-RATE FORMULA (TS 38.306) ===================
print("\n=========== PART 2: peak rate = 1e-6 * sum_j v*Qm*f*Rmax*(N_PRB*12/Ts)*(1-OH) ===========")
Rmax = 948 / 1024
# (mu, N_PRB, Qm, v_layers, f, OH, label)
cfgs = [(1, 273, 8, 4, 1.0, 0.14, "FR1 100MHz 30kHz, 4 layers, 256QAM"),
        (3, 264, 8, 2, 1.0, 0.18, "FR2 400MHz 120kHz, 2 layers, 256QAM"),
        (1, 273, 8, 4, 1.0, 0.14, "same FR1 carrier (for aggregation)")]
rates = []
for mu, Nprb, Qm, v, f, OH, label in cfgs:
    Ts = 1e-3 / (14 * 2 ** mu)
    rate = 1e-6 * v * Qm * f * Rmax * (Nprb * 12 / Ts) * (1 - OH)   # Mbps
    rates.append(rate)
    print(f"  {label:42s} -> {rate:8.1f} Mbps ({rate/1e3:.2f} Gbps)")
agg = rates[0] + rates[2]
print(f"  {'carrier aggregation of the two FR1 carriers':42s} -> {agg:8.1f} Mbps ({agg/1e3:.2f} Gbps)")

# =================== PART 3: ULA BEAMFORMING (array factor, steering, beamwidth) ===================
print("\n=========== PART 3: ULA beamforming  gain=10log10(N),  HPBW ~ 102/N deg (broadside) ===========")
d = 0.5                      # element spacing in wavelengths (lambda/2)
theta0 = 90.0               # steer to broadside (degrees)
th = np.linspace(0, 180, 8001)
for N in (8, 16, 64):
    beta = -2 * np.pi * d * np.cos(np.deg2rad(theta0))
    psi = 2 * np.pi * d * np.cos(np.deg2rad(th)) + beta
    n = np.arange(N)
    AF = np.abs(np.exp(1j * np.outer(psi, n)).sum(axis=1))
    AFdb = 20 * np.log10(AF / AF.max())
    pk = int(np.argmax(AF))
    li = pk
    while li > 0 and AFdb[li] > -3:
        li -= 1
    ri = pk
    while ri < len(th) - 1 and AFdb[ri] > -3:
        ri += 1
    HPBW = th[ri] - th[li]
    print(f"  N={N:2d}: array gain={10*np.log10(N):5.2f} dB, measured HPBW={HPBW:5.2f} deg, "
          f"theory 102/N={102/N:5.2f} deg")

# =================== PART 4: DOWNLINK RESOURCE GRID (RE and raw bits) ===================
print("\n=========== PART 4: resource grid  N_RE = 12 * 14 * N_RB per slot ===========")
Nsc, Nsym, Nrb, Qm = 12, 14, 273, 8       # 100 MHz FR1 @ 30 kHz -> 273 RB, 256-QAM
RE = Nsc * Nsym * Nrb
print(f"  N_RB={Nrb}: RE/slot = {Nsc}*{Nsym}*{Nrb} = {RE}, raw bits/slot at Qm={Qm}: "
      f"{RE*Qm} ({RE*Qm/1e6:.2f} Mbit)")
mu = 1
slots_per_s = 2 ** mu / 1e-3
print(f"  at mu=1 ({2**mu} slots/ms): RE/s = {RE*slots_per_s:.3e} "
      f"(matches N_PRB*12/Ts used in the peak-rate formula)")
`,
    note: String.raw`Four self-checking experiments, each printing a measured number beside the theory it must match. PART 1 builds the NR scalable-numerology table for mu = 0..4: the subcarrier spacing SCS = 15*2^mu kHz (15, 30, 60, 120, 240 kHz), the slot duration 1 ms / 2^mu (1, 0.5, 0.25, 0.125, 0.0625 ms), the number of slots per 1 ms subframe (2^mu), the approximate OFDM symbol duration (slot / 14), and the sampling rate Fs = N_FFT * SCS for an example N_FFT = 4096. It highlights a neat invariant: samples-per-slot = Fs * T_slot = N_FFT * 15 kHz = 61440 regardless of mu, because the sampling rate grows by 2^mu exactly as the slot shrinks by 2^mu, so the sample count is the same for every numerology. PART 2 evaluates the exact 3GPP peak data-rate formula (TS 38.306): rate = 1e-6 * sum over carriers of v_Layers * Qm * f * Rmax * (N_PRB * 12 / Ts) * (1 - OH), where Ts = 1e-3 / (14 * 2^mu) is the average OFDM symbol duration in a subframe, Rmax = 948/1024, Qm is bits per symbol (8 for 256-QAM), f is the scaling factor, and OH is the reference-signal/control overhead (0.14 for FR1 DL, 0.18 for FR2 DL). It computes three cases: a single 100 MHz FR1 carrier (mu=1, 273 PRB, 4 layers, 256-QAM) which yields about 2337 Mbps (about 2.34 Gbps); a single 400 MHz FR2 carrier (mu=3, 264 PRB, 2 layers, 256-QAM) which yields about 4.3 Gbps; and the two-carrier aggregate of two FR1 carriers, showing how carrier aggregation sums the per-carrier rates toward the multi-gigabit eMBB peak. PART 3 computes the array factor of a uniform linear array of N elements at half-wavelength spacing, AF(theta) = sum over n of exp(j*n*(2*pi*d*cos(theta) + beta)), sets the progressive phase beta = -2*pi*d*cos(theta0) to steer the main lobe to broadside (theta0 = 90 degrees), and then measures the half-power (-3 dB) beamwidth directly from the pattern by walking outward from the peak. For N = 8, 16, 64 the measured beamwidth closely matches the closed-form 102/N degrees, and the array gain over a single element is printed as 10*log10(N) dB (about 9, 12, 18 dB) -- the gain that offsets the extra mmWave path loss. PART 4 counts the downlink resource grid: with 12 subcarriers per resource block and 14 OFDM symbols per slot, a 100 MHz FR1 carrier of 273 resource blocks has 12*14*273 = 45864 resource elements per slot, i.e. 45864 * 8 = 366912 raw bits per slot at 256-QAM before overhead and coding. It then multiplies by the 2 slots per millisecond at mu = 1 to get the resource elements per second, and confirms this equals the N_PRB*12/Ts term used inside the PART 2 peak-rate formula, tying the two experiments together. For the channel codes referenced by 5G (LDPC on the data channels, polar on the control channels) see the companion "LDPC" and "Polar Codes" topics and their code, which this file deliberately does not duplicate.`
  }
});
