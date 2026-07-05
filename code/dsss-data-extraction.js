// dsss-data-extraction.js — MATLAB + Python teaching code for the DSSS Data Extraction topic.
// Populates CONTENT_CODE['dsss-data-extraction']. No literal backticks or template-literal placeholders inside code strings.
Object.assign(CONTENT_CODE, {
  'dsss-data-extraction': {
    matlab: String.raw`% DSSS data extraction: despread -> integrate-and-dump -> decide, in AWGN + a CW jammer.
% Demonstrates the two headline facts:
%  (1) In pure AWGN the despread BER equals plain BPSK at the same Eb/N0 (no processing gain).
%  (2) Despreading suppresses a CW jammer by the processing gain N = Rc/Rb.
rng(7);
N      = 64;                    % chips per bit = processing gain (Rc/Rb)
Nbits  = 2e5;                   % number of data bits
EbN0dB = 0:1:10;                % Eb/N0 sweep (dB)
Q      = @(x) 0.5*erfc(x/sqrt(2));

% Fixed random +/-1 PN code, one period per bit (BPSK spreading)
code = 2*(rand(1,N) > 0.5) - 1;

berAWGN = zeros(size(EbN0dB));
for k = 1:numel(EbN0dB)
    EbN0 = 10^(EbN0dB(k)/10);
    d  = 2*(rand(1,Nbits) > 0.5) - 1;          % +/-1 data bits
    tx = kron(d, code);                        % spread: each bit -> N chips
    % Per-chip noise: Eb spread over N chips, so per-chip energy Ec = Eb/N.
    % With unit-amplitude chips, chip noise std sigma = sqrt(N/(2*EbN0)).
    sigma = sqrt(N/(2*EbN0));
    rx = tx + sigma*randn(size(tx));           % AWGN channel (no jammer here)
    % Despread + integrate-and-dump: multiply by code, sum each block of N chips
    desp = rx .* repmat(code, 1, Nbits);
    z    = sum(reshape(desp, N, Nbits), 1);    % decision statistic per bit
    dhat = sign(z);                            % coherent BPSK decision
    berAWGN(k) = mean(dhat ~= d);
end
berTheory = Q(sqrt(2*10.^(EbN0dB/10)));        % plain BPSK reference

% --- CW jammer demo at a fixed Eb/N0, sweeping jammer-to-signal ratio ---
EbN0 = 10^(6/10); sigma = sqrt(N/(2*EbN0));
JSRdB = 0:3:30; berJam = zeros(size(JSRdB));
for k = 1:numel(JSRdB)
    JSR = 10^(JSRdB(k)/10);
    d  = 2*(rand(1,Nbits) > 0.5) - 1;
    tx = kron(d, code);
    Aj = sqrt(JSR);                            % CW-jammer amplitude (signal chip amp = 1)
    t  = 0:numel(tx)-1;
    jam = Aj*cos(2*pi*0.12*t);                 % narrowband tone relative to chip rate
    rx = tx + sigma*randn(size(tx)) + jam;
    z  = sum(reshape(rx .* repmat(code,1,Nbits), N, Nbits), 1);
    berJam(k) = mean(sign(z) ~= d);
end

figure;
subplot(1,2,1);
semilogy(EbN0dB, berAWGN, 'bo-','LineWidth',1.4); hold on;
semilogy(EbN0dB, berTheory, 'r--','LineWidth',1.4); grid on;
xlabel('E_b/N_0 (dB)'); ylabel('BER');
legend('DSSS despread (sim)','plain BPSK Q(\surd(2E_b/N_0))');
title('AWGN: despread BER = plain BPSK (no G_p gain)');

subplot(1,2,2);
semilogy(JSRdB, max(berJam,1e-6), 'ko-','LineWidth',1.4); grid on;
xlabel('Jammer/Signal (dB)'); ylabel('BER');
title(sprintf('CW jammer tolerated up to ~G_p=%.0f dB (N=%d)', 10*log10(N), N));
`,
    python: String.raw`# DSSS data extraction: despread -> integrate-and-dump -> decide, in AWGN + a CW jammer.
# Shows (1) pure-AWGN BER equals plain BPSK (no processing-gain benefit vs noise) and
#       (2) despreading suppresses a CW jammer by the processing gain N = Rc/Rb.
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

rng = np.random.default_rng(7)
Q = lambda x: 0.5*erfc(x/np.sqrt(2))

N      = 64                      # chips per bit = processing gain
Nbits  = 200_000
EbN0dB = np.arange(0, 11)
code   = 2*(rng.random(N) > 0.5) - 1     # fixed +/-1 PN code, one period per bit

ber_awgn = []
for db in EbN0dB:
    EbN0 = 10**(db/10)
    d  = 2*(rng.random(Nbits) > 0.5) - 1
    tx = np.repeat(d, N) * np.tile(code, Nbits)        # spread each bit into N chips
    sigma = np.sqrt(N/(2*EbN0))                         # per-chip noise std (Ec = Eb/N)
    rx = tx + sigma*rng.standard_normal(tx.size)        # AWGN only
    # Despread + integrate-and-dump: multiply by code, sum each block of N chips
    z  = (rx * np.tile(code, Nbits)).reshape(Nbits, N).sum(axis=1)
    dhat = np.sign(z)
    ber_awgn.append(np.mean(dhat != d))
ber_awgn = np.array(ber_awgn)
ber_theory = Q(np.sqrt(2*10**(EbN0dB/10)))              # plain BPSK reference

# --- CW jammer demo at fixed Eb/N0, sweeping jammer-to-signal ratio ---
EbN0 = 10**(6/10); sigma = np.sqrt(N/(2*EbN0))
JSRdB = np.arange(0, 31, 3); ber_jam = []
for db in JSRdB:
    JSR = 10**(db/10)
    d  = 2*(rng.random(Nbits) > 0.5) - 1
    tx = np.repeat(d, N) * np.tile(code, Nbits)
    t  = np.arange(tx.size)
    jam = np.sqrt(JSR)*np.cos(2*np.pi*0.12*t)           # narrowband tone vs chip rate
    rx = tx + sigma*rng.standard_normal(tx.size) + jam
    z  = (rx * np.tile(code, Nbits)).reshape(Nbits, N).sum(axis=1)
    ber_jam.append(np.mean(np.sign(z) != d))
ber_jam = np.maximum(ber_jam, 1e-6)

fig, ax = plt.subplots(1, 2, figsize=(11, 4.5))
ax[0].semilogy(EbN0dB, ber_awgn, 'o-', label='DSSS despread (sim)')
ax[0].semilogy(EbN0dB, ber_theory, 'r--', label=r'plain BPSK $Q(\sqrt{2E_b/N_0})$')
ax[0].set_xlabel('Eb/N0 (dB)'); ax[0].set_ylabel('BER'); ax[0].grid(True, which='both')
ax[0].legend(); ax[0].set_title('AWGN: despread BER = plain BPSK')

ax[1].semilogy(JSRdB, ber_jam, 'ko-')
ax[1].set_xlabel('Jammer/Signal (dB)'); ax[1].set_ylabel('BER'); ax[1].grid(True, which='both')
ax[1].set_title(f'CW jammer tolerated ~Gp={10*np.log10(N):.0f} dB (N={N})')
plt.tight_layout(); plt.show()
`,
    note: String.raw`Two lessons in one script. Left panel: the simulated despread BER sits exactly on the plain-BPSK curve Q(sqrt(2 Eb/N0)) — spreading then despreading is a lossless round trip in AWGN, so processing gain gives NO thermal-noise benefit. Right panel: a continuous-wave tone jammer is spread by the despreader over the chip bandwidth, so the link keeps low BER until the jammer exceeds roughly the processing gain 10log10(N) dB above the signal — that jam-suppression is the real payoff of DSSS data extraction. The decision statistic z is the integrate-and-dump matched-filter output; sign(z) is the coherent BPSK bit.`
  }
});
