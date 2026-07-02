// Antenna / EM teaching code: MATLAB + Python for 5 topic ids.
Object.assign(CONTENT_CODE, {
  'antenna': {
    matlab: String.raw`% Half-wave dipole: radiation pattern, directivity, resonant length, Fraunhofer distance
% F(theta) = cos(pi/2*cos(theta)) / sin(theta)  (E-plane pattern of ideal lambda/2 dipole)
clear; clc;

c   = 3e8;        % speed of light [m/s]
f   = 300e6;      % operating frequency [Hz]
lam = c / f;      % wavelength [m]

% --- Physical dimensions ---
L    = lam / 2;              % resonant half-wave dipole length [m]
Dmax = L;                    % largest antenna dimension ~ its length
Rff  = 2 * Dmax^2 / lam;     % Fraunhofer (far-field) distance [m]

% --- Radiation pattern ---
theta = linspace(1e-4, pi, 2000);          % avoid divide-by-zero at 0 and pi
F     = cos(pi/2 * cos(theta)) ./ sin(theta);
U     = F.^2;                              % radiation intensity (unnormalized)

% --- Directivity by numerical integration over the sphere ---
% Prad_norm = (1/4pi) * integral U * sin(theta) dtheta dphi ; phi symmetry -> *2pi
Uavg = trapz(theta, U .* sin(theta)) * 2*pi / (4*pi);
D0   = max(U) / Uavg;                        % directivity (linear)
D0dB = 10 * log10(D0);                       % dBi

fprintf('Wavelength         = %.3f m\n', lam);
fprintf('Dipole length L    = %.3f m (lambda/2)\n', L);
fprintf('Fraunhofer dist Rff= %.3f m\n', Rff);
fprintf('Directivity D0     = %.3f  (%.2f dBi)  [ideal ~1.64 / 2.15 dBi]\n', D0, D0dB);

% --- Polar plot of the normalized pattern ---
figure;
polarplot(theta, F/max(F), 'LineWidth', 2); hold on;
polarplot(-theta, F/max(F), 'LineWidth', 2);   % mirror for full E-plane cut
title('Half-wave dipole E-plane pattern');
`,
    python: String.raw`# Half-wave dipole: radiation pattern, directivity, resonant length, Fraunhofer distance
# F(theta) = cos(pi/2*cos(theta)) / sin(theta)  (E-plane pattern of ideal lambda/2 dipole)
import numpy as np
import matplotlib.pyplot as plt

c   = 3e8        # speed of light [m/s]
f   = 300e6      # operating frequency [Hz]
lam = c / f      # wavelength [m]

# --- Physical dimensions ---
L    = lam / 2                 # resonant half-wave dipole length [m]
Dmax = L                       # largest antenna dimension ~ its length
Rff  = 2 * Dmax**2 / lam       # Fraunhofer (far-field) distance [m]

# --- Radiation pattern ---
theta = np.linspace(1e-4, np.pi, 2000)     # avoid divide-by-zero at 0 and pi
F     = np.cos(np.pi/2 * np.cos(theta)) / np.sin(theta)
U     = F**2                               # radiation intensity (unnormalized)

# --- Directivity by numerical integration over the sphere ---
Uavg = np.trapz(U * np.sin(theta), theta) * 2*np.pi / (4*np.pi)
D0   = U.max() / Uavg                       # directivity (linear)
D0dB = 10 * np.log10(D0)                     # dBi

print('Wavelength         = %.3f m' % lam)
print('Dipole length L    = %.3f m (lambda/2)' % L)
print('Fraunhofer dist Rff= %.3f m' % Rff)
print('Directivity D0     = %.3f  (%.2f dBi)  [ideal ~1.64 / 2.15 dBi]' % (D0, D0dB))

# --- Polar plot of the normalized pattern ---
Fn = F / F.max()
ax = plt.subplot(111, projection='polar')
ax.plot(theta,  Fn, lw=2)
ax.plot(-theta, Fn, lw=2)       # mirror for full E-plane cut
ax.set_title('Half-wave dipole E-plane pattern')
plt.show()
`
  },

  'antenna-gain': {
    matlab: String.raw`% Aperture antenna gain: G = eta * 4*pi*A / lambda^2
% Sweep dish diameter and frequency; show +6 dB/octave; gain-beamwidth link.
clear; clc;

c   = 3e8;
eta = 0.6;                     % aperture efficiency (typical parabolic dish)

% --- Gain vs diameter at a few frequencies ---
D    = linspace(0.3, 5, 200);          % dish diameter [m]
freq = [2e9, 6e9, 12e9];               % Hz
figure; hold on; grid on;
for f = freq
    lam = c / f;
    A   = pi * (D/2).^2;                % physical aperture area [m^2]
    G   = eta * 4*pi .* A / lam^2;      % gain (linear)
    plot(D, 10*log10(G), 'LineWidth', 2, 'DisplayName', sprintf('%.0f GHz', f/1e9));
end
xlabel('Dish diameter [m]'); ylabel('Gain [dBi]');
title('Parabolic dish gain vs diameter'); legend('Location','southeast');

% --- +6 dB per octave of frequency (fixed diameter) ---
Dfix = 1.0;  A = pi*(Dfix/2)^2;
foct = 1e9 * 2.^(0:4);                  % 1,2,4,8,16 GHz (octaves)
Goct = 10*log10(eta * 4*pi*A ./ (c./foct).^2);
fprintf('Fixed D=%.1f m: gain per octave (expect +6 dB steps):\n', Dfix);
for k = 1:numel(foct)
    fprintf('  %5.1f GHz : %6.2f dBi\n', foct(k)/1e9, Goct(k));
end
fprintf('Delta per octave ~= %.2f dB\n', mean(diff(Goct)));

% --- Gain <-> beamwidth: G ~= 26000 / (theta_az * theta_el) [degrees] ---
th_az = 3; th_el = 3;                    % example half-power beamwidths [deg]
G_bw  = 26000 / (th_az * th_el);
fprintf('Gain from beamwidth (%.0f x %.0f deg) ~= %.0f (%.1f dBi)\n', ...
        th_az, th_el, G_bw, 10*log10(G_bw));
`,
    python: String.raw`# Aperture antenna gain: G = eta * 4*pi*A / lambda^2
# Sweep dish diameter and frequency; show +6 dB/octave; gain-beamwidth link.
import numpy as np
import matplotlib.pyplot as plt

c   = 3e8
eta = 0.6                      # aperture efficiency (typical parabolic dish)

# --- Gain vs diameter at a few frequencies ---
D    = np.linspace(0.3, 5, 200)        # dish diameter [m]
freq = [2e9, 6e9, 12e9]                # Hz
plt.figure()
for f in freq:
    lam = c / f
    A   = np.pi * (D/2)**2             # physical aperture area [m^2]
    G   = eta * 4*np.pi * A / lam**2   # gain (linear)
    plt.plot(D, 10*np.log10(G), lw=2, label='%.0f GHz' % (f/1e9))
plt.xlabel('Dish diameter [m]'); plt.ylabel('Gain [dBi]')
plt.title('Parabolic dish gain vs diameter'); plt.legend(); plt.grid(True)

# --- +6 dB per octave of frequency (fixed diameter) ---
Dfix = 1.0; A = np.pi*(Dfix/2)**2
foct = 1e9 * 2.0**np.arange(5)         # 1,2,4,8,16 GHz (octaves)
Goct = 10*np.log10(eta * 4*np.pi*A / (c/foct)**2)
print('Fixed D=%.1f m: gain per octave (expect +6 dB steps):' % Dfix)
for fo, g in zip(foct, Goct):
    print('  %5.1f GHz : %6.2f dBi' % (fo/1e9, g))
print('Delta per octave ~= %.2f dB' % np.mean(np.diff(Goct)))

# --- Gain <-> beamwidth: G ~= 26000 / (theta_az * theta_el) [degrees] ---
th_az, th_el = 3.0, 3.0                # example half-power beamwidths [deg]
G_bw = 26000 / (th_az * th_el)
print('Gain from beamwidth (%.0f x %.0f deg) ~= %.0f (%.1f dBi)'
      % (th_az, th_el, G_bw, 10*np.log10(G_bw)))
plt.show()
`
  },

  'antenna-beamwidth': {
    matlab: String.raw`% N-element uniform linear array: array factor, HPBW, side lobes, beam steering.
clear; clc;

N  = 8;                         % number of elements
d  = 0.5;                       % spacing in wavelengths (lambda units)
th = linspace(-pi/2, pi/2, 4000);   % angle from broadside [rad]

% --- Broadside array factor (progressive phase = 0) ---
psi = 2*pi*d*sin(th);
AF  = abs(sin(N*psi/2) ./ (N*sin(psi/2) + eps));   % normalized |AF|
AFdB = 20*log10(AF + eps);

% --- Estimated HPBW: rule of thumb ~ 70 * lambda / D (D = aperture length) ---
Dap  = N * d;                                    % aperture length in wavelengths
HPBW = 70 / Dap;                                 % degrees (lambda/D form, lambda=1)
fprintf('N=%d, d=%.2f lambda, aperture=%.1f lambda\n', N, d, Dap);
fprintf('Approx HPBW ~= 70*lambda/D = %.1f deg\n', HPBW);

% --- Steered array factor (progressive phase steers main lobe to th0) ---
th0  = 30*pi/180;                                % steer to +30 deg
beta = -2*pi*d*sin(th0);                         % progressive phase shift
psiS = 2*pi*d*sin(th) + beta;
AFs  = abs(sin(N*psiS/2) ./ (N*sin(psiS/2) + eps));

% --- Rectangular plot (dB) ---
figure;
plot(th*180/pi, AFdB, 'LineWidth', 2); grid on; ylim([-40 2]);
xlabel('Angle [deg]'); ylabel('|AF| [dB]');
title(sprintf('%d-element ULA: main lobe, side lobes, HPBW', N));

% --- Polar plot: broadside vs steered ---
figure;
polarplot(th, AF, 'LineWidth', 2); hold on;
polarplot(th, AFs, '--', 'LineWidth', 2);
legend('Broadside', 'Steered +30 deg');
title('Array factor: broadside vs steered');
`,
    python: String.raw`# N-element uniform linear array: array factor, HPBW, side lobes, beam steering.
import numpy as np
import matplotlib.pyplot as plt

N  = 8                          # number of elements
d  = 0.5                        # spacing in wavelengths (lambda units)
th = np.linspace(-np.pi/2, np.pi/2, 4000)   # angle from broadside [rad]
eps = 1e-12

# --- Broadside array factor (progressive phase = 0) ---
psi  = 2*np.pi*d*np.sin(th)
AF   = np.abs(np.sin(N*psi/2) / (N*np.sin(psi/2) + eps))   # normalized |AF|
AFdB = 20*np.log10(AF + eps)

# --- Estimated HPBW: rule of thumb ~ 70 * lambda / D (D = aperture length) ---
Dap  = N * d                                  # aperture length in wavelengths
HPBW = 70 / Dap                               # degrees (lambda=1)
print('N=%d, d=%.2f lambda, aperture=%.1f lambda' % (N, d, Dap))
print('Approx HPBW ~= 70*lambda/D = %.1f deg' % HPBW)

# --- Steered array factor (progressive phase steers main lobe to th0) ---
th0  = np.deg2rad(30)                          # steer to +30 deg
beta = -2*np.pi*d*np.sin(th0)                  # progressive phase shift
psiS = 2*np.pi*d*np.sin(th) + beta
AFs  = np.abs(np.sin(N*psiS/2) / (N*np.sin(psiS/2) + eps))

# --- Rectangular plot (dB) ---
plt.figure()
plt.plot(np.rad2deg(th), AFdB, lw=2); plt.grid(True); plt.ylim(-40, 2)
plt.xlabel('Angle [deg]'); plt.ylabel('|AF| [dB]')
plt.title('%d-element ULA: main lobe, side lobes, HPBW' % N)

# --- Polar plot: broadside vs steered ---
ax = plt.subplot(111, projection='polar')
ax.plot(th, AF,  lw=2, label='Broadside')
ax.plot(th, AFs, '--', lw=2, label='Steered +30 deg')
ax.legend(loc='upper right')
ax.set_title('Array factor: broadside vs steered')
plt.show()
`
  },

  'antenna-types': {
    matlab: String.raw`% Compare antenna types by their patterns: isotropic, half-wave dipole,
% and N-element uniform arrays (proxy for high-gain Yagi / patch array).
clear; clc;

th  = linspace(-pi, pi, 4000);
eps0 = 1e-12;

% --- Isotropic reference ---
Piso = ones(size(th));

% --- Half-wave dipole (E-plane) ---
Fdip = abs(cos(pi/2*cos(th)) ./ (sin(th) + eps0));
Fdip = Fdip / max(Fdip);

% --- Uniform linear arrays (broadside), d = 0.5 lambda ---
d = 0.5;
arrayAF = @(N) abs(sin(N*pi*d*sin(th)) ./ (N*sin(pi*d*sin(th)) + eps0));
AF4 = arrayAF(4);
AF8 = arrayAF(8);

% --- Directivity estimate (2D cut proxy) and HPBW helper ---
dirEst = @(P) max(P).^2 ./ (trapz(th, P.^2)/(2*pi));   % rough relative directivity
names = {'Isotropic','Dipole lambda/2','4-elem array','8-elem array'};
pats  = {Piso, Fdip, AF4, AF8};

fprintf('%-16s  RelDir  RelGain[dB]\n', 'Antenna');
for k = 1:numel(pats)
    Dk = dirEst(pats{k});
    fprintf('%-16s  %5.2f   %6.2f\n', names{k}, Dk, 10*log10(Dk));
end
fprintf('(Larger arrays -> higher gain, narrower beam.)\n');

% --- Overlay patterns in polar ---
figure;
polarplot(th, Piso/max(Piso), 'LineWidth', 1.5); hold on;
polarplot(th, Fdip, 'LineWidth', 1.5);
polarplot(th, AF4,  'LineWidth', 1.5);
polarplot(th, AF8,  'LineWidth', 1.5);
legend(names); title('Antenna type pattern comparison');
`,
    python: String.raw`# Compare antenna types by their patterns: isotropic, half-wave dipole,
# and N-element uniform arrays (proxy for high-gain Yagi / patch array).
import numpy as np
import matplotlib.pyplot as plt

th   = np.linspace(-np.pi, np.pi, 4000)
eps0 = 1e-12

# --- Isotropic reference ---
Piso = np.ones_like(th)

# --- Half-wave dipole (E-plane) ---
Fdip = np.abs(np.cos(np.pi/2*np.cos(th)) / (np.sin(th) + eps0))
Fdip = Fdip / Fdip.max()

# --- Uniform linear arrays (broadside), d = 0.5 lambda ---
d = 0.5
def arrayAF(N):
    return np.abs(np.sin(N*np.pi*d*np.sin(th)) / (N*np.sin(np.pi*d*np.sin(th)) + eps0))
AF4 = arrayAF(4)
AF8 = arrayAF(8)

# --- Directivity estimate (2D cut proxy) ---
def dirEst(P):
    return P.max()**2 / (np.trapz(P**2, th)/(2*np.pi))
names = ['Isotropic', 'Dipole lambda/2', '4-elem array', '8-elem array']
pats  = [Piso, Fdip, AF4, AF8]

print('%-16s  RelDir  RelGain[dB]' % 'Antenna')
for nm, P in zip(names, pats):
    Dk = dirEst(P)
    print('%-16s  %5.2f   %6.2f' % (nm, Dk, 10*np.log10(Dk)))
print('(Larger arrays -> higher gain, narrower beam.)')

# --- Overlay patterns in polar ---
ax = plt.subplot(111, projection='polar')
for nm, P in zip(names, pats):
    ax.plot(th, P/P.max(), lw=1.5, label=nm)
ax.legend(loc='upper right', fontsize=8)
ax.set_title('Antenna type pattern comparison')
plt.show()
`
  },

  'maxwell': {
    matlab: String.raw`% Plane EM wave: orthogonal E and B fields propagating along z.
% Verify c = 1/sqrt(mu0*eps0) and eta0 = sqrt(mu0/eps0) ~ 377 ohm; E/H = eta0.
clear; clc;

mu0  = 4*pi*1e-7;              % permeability of free space [H/m]
eps0 = 8.8541878128e-12;      % permittivity of free space [F/m]

c    = 1/sqrt(mu0*eps0);      % speed of light
eta0 = sqrt(mu0/eps0);        % intrinsic impedance of free space

fprintf('c    = %.6e m/s   (expected ~2.998e8)\n', c);
fprintf('eta0 = %.4f ohm    (expected ~376.73)\n', eta0);

% --- Field amplitudes: H = E/eta0 ---
f    = 1e9;  lam = c/f;  k = 2*pi/lam;  w = 2*pi*f;
E0   = 1.0;                    % V/m
H0   = E0/eta0;                % A/m
fprintf('E0/H0 = %.4f ohm = eta0? %s\n', E0/H0, ...
        string(abs(E0/H0 - eta0) < 1e-6));

% --- Snapshot / animation of the wave along z ---
z = linspace(0, 3*lam, 600);
figure;
for t = linspace(0, 3/f, 60)          % a few periods
    E = E0*cos(w*t - k*z);            % E along x
    H = H0*cos(w*t - k*z);            % H along y (in phase, orthogonal)
    plot3(z, E, zeros(size(z)), 'b', 'LineWidth', 2); hold on;
    plot3(z, zeros(size(z)), H, 'r', 'LineWidth', 2);
    hold off; grid on; axis([0 max(z) -1.2 1.2 -1.2/eta0 1.2/eta0]);
    xlabel('z [m]'); ylabel('E_x [V/m]'); zlabel('H_y [A/m]');
    title('Plane wave: E (blue) and H (red) orthogonal, in phase');
    view(30, 20); drawnow;
end
`,
    python: String.raw`# Plane EM wave: orthogonal E and B fields propagating along z.
# Verify c = 1/sqrt(mu0*eps0) and eta0 = sqrt(mu0/eps0) ~ 377 ohm; E/H = eta0.
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D  # noqa: enables 3D projection

mu0  = 4*np.pi*1e-7            # permeability of free space [H/m]
eps0 = 8.8541878128e-12       # permittivity of free space [F/m]

c    = 1/np.sqrt(mu0*eps0)    # speed of light
eta0 = np.sqrt(mu0/eps0)      # intrinsic impedance of free space

print('c    = %.6e m/s   (expected ~2.998e8)' % c)
print('eta0 = %.4f ohm    (expected ~376.73)' % eta0)

# --- Field amplitudes: H = E/eta0 ---
f   = 1e9; lam = c/f; k = 2*np.pi/lam; w = 2*np.pi*f
E0  = 1.0                      # V/m
H0  = E0/eta0                  # A/m
print('E0/H0 = %.4f ohm = eta0? %s' % (E0/H0, abs(E0/H0 - eta0) < 1e-6))

# --- Snapshot of the wave along z (single frame; loop for animation) ---
z = np.linspace(0, 3*lam, 600)
t = 0.0
E = E0*np.cos(w*t - k*z)       # E along x
H = H0*np.cos(w*t - k*z)       # H along y (in phase, orthogonal)

fig = plt.figure()
ax  = fig.add_subplot(111, projection='3d')
ax.plot(z, E, np.zeros_like(z), 'b', lw=2, label='E_x [V/m]')
ax.plot(z, np.zeros_like(z), H, 'r', lw=2, label='H_y [A/m]')
ax.set_xlabel('z [m]'); ax.set_ylabel('E_x [V/m]'); ax.set_zlabel('H_y [A/m]')
ax.set_title('Plane wave: E (blue) and H (red) orthogonal, in phase')
ax.legend()
plt.show()
`
  }
});
