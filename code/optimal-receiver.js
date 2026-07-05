// optimal-receiver.js — MATLAB + Python teaching code for the Optimal Receiver topic.
// Populates CONTENT_CODE['optimal-receiver']. No literal backticks or ${...} inside code strings.
Object.assign(CONTENT_CODE, {
  'optimal-receiver': {
    matlab: String.raw`% Optimal (minimum-distance / ML) receiver for QPSK in AWGN.
% Demonstrates: correlator front-end -> decision regions -> error rate,
% and compares the simulated SER to the union-bound / nearest-neighbour estimate.
rng(1);
EsN0dB = 0:2:14;                    % symbol SNR sweep (dB)
Nsym   = 2e5;                       % symbols per point
% Unit-energy QPSK constellation (Es = 1): points on a circle at 45,135,225,315 deg
S = (1/sqrt(2))*[ 1+1i, -1+1i, -1-1i, 1-1i ];

ser = zeros(size(EsN0dB));
for k = 1:numel(EsN0dB)
    EsN0 = 10^(EsN0dB(k)/10);
    sigma = sqrt(1/(2*EsN0));       % noise std per I/Q axis (Es=1, N0=1/EsN0)
    tx = randi([1 4], 1, Nsym);     % random symbol indices
    r  = S(tx) + sigma*(randn(1,Nsym)+1i*randn(1,Nsym));  % received points
    % Optimal receiver = minimum Euclidean distance to each constellation point
    [~, dec] = min(abs(r.' - S).', [], 1);
    ser(k) = mean(dec ~= tx);
end

% Nearest-neighbour / union-bound estimate: QPSK has dmin=sqrt(2*Es), Nmin=2
Q = @(x) 0.5*erfc(x/sqrt(2));
EsN0 = 10.^(EsN0dB/10);
serNN = 2*Q(sqrt(EsN0));            % ~ Nmin * Q(dmin/2sigma), dmin/2sigma = sqrt(Es/N0)

figure;
subplot(1,2,1);
semilogy(EsN0dB, ser, 'bo-','LineWidth',1.4); hold on;
semilogy(EsN0dB, serNN, 'r--','LineWidth',1.4);
grid on; xlabel('E_s/N_0 (dB)'); ylabel('Symbol error rate');
legend('simulated (min-distance)','2\cdotQ(\surd(E_s/N_0))'); title('Optimal QPSK receiver: sim vs bound');

% Show decision regions with a noisy cloud at one SNR
subplot(1,2,2);
sigma = sqrt(1/(2*10^(10/10)));
tx = randi([1 4],1,3000); r = S(tx) + sigma*(randn(1,3000)+1i*randn(1,3000));
plot(real(r),imag(r),'.','Color',[0.3 0.6 1]); hold on;
plot(real(S),imag(S),'o','MarkerFaceColor','r','MarkerEdgeColor','k','MarkerSize',8);
xline(0,'k--'); yline(0,'k--'); axis equal; grid on;
xlabel('I'); ylabel('Q'); title('Decision regions = quadrants (E_s/N_0 = 10 dB)');
`,
    python: String.raw`# Optimal (minimum-distance / ML) receiver for QPSK in AWGN.
# Correlator front-end is implicit: r is already the projected sufficient statistic.
# We show that "pick the nearest constellation point" matches the union bound.
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

rng = np.random.default_rng(1)
Q = lambda x: 0.5*erfc(x/np.sqrt(2))

EsN0dB = np.arange(0, 15, 2)
Nsym   = 200_000
# Unit-energy QPSK constellation (Es = 1)
S = (1/np.sqrt(2))*np.array([1+1j, -1+1j, -1-1j, 1-1j])

ser = []
for db in EsN0dB:
    EsN0 = 10**(db/10)
    sigma = np.sqrt(1/(2*EsN0))                 # per-axis noise std (N0 = 1/EsN0)
    tx = rng.integers(0, 4, Nsym)
    r  = S[tx] + sigma*(rng.standard_normal(Nsym) + 1j*rng.standard_normal(Nsym))
    # Optimal decision: nearest constellation point (minimum |r - s_m|)
    dec = np.argmin(np.abs(r[:, None] - S[None, :]), axis=1)
    ser.append(np.mean(dec != tx))
ser = np.array(ser)

EsN0 = 10**(EsN0dB/10)
serNN = 2*Q(np.sqrt(EsN0))                       # Nmin=2, dmin/2sigma = sqrt(Es/N0)

fig, ax = plt.subplots(1, 2, figsize=(11, 4.5))
ax[0].semilogy(EsN0dB, ser, 'o-', label='simulated (min-distance)')
ax[0].semilogy(EsN0dB, serNN, 'r--', label=r'$2\,Q(\sqrt{E_s/N_0})$')
ax[0].set_xlabel('Es/N0 (dB)'); ax[0].set_ylabel('Symbol error rate')
ax[0].grid(True, which='both'); ax[0].legend(); ax[0].set_title('Optimal QPSK receiver')

sigma = np.sqrt(1/(2*10**(10/10)))
tx = rng.integers(0, 4, 3000)
r  = S[tx] + sigma*(rng.standard_normal(3000) + 1j*rng.standard_normal(3000))
ax[1].plot(r.real, r.imag, '.', ms=3, alpha=0.4, color='#4dabf7')
ax[1].plot(S.real, S.imag, 'o', mfc='r', mec='k', ms=8)
ax[1].axhline(0, color='k', ls='--', lw=0.8); ax[1].axvline(0, color='k', ls='--', lw=0.8)
ax[1].set_aspect('equal'); ax[1].grid(True)
ax[1].set_xlabel('I'); ax[1].set_ylabel('Q'); ax[1].set_title('Decision regions (Es/N0 = 10 dB)')
plt.tight_layout(); plt.show()
`,
    note: String.raw`The "correlator bank" is implicit here: for a memoryless AWGN constellation the received complex sample r is already the sufficient statistic, so optimal detection is literally the nearest-point search. Note how the simulated SER hugs the nearest-neighbour bound 2·Q(√(Es/N0)) — the minimum distance sets the performance.`
  }
});
