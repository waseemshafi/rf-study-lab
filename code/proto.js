// Protocol/interface teaching code: MATLAB + Python for 7 topic ids.
Object.assign(CONTENT_CODE, {
  'rs232': {
    matlab: String.raw`% RS-232 UART frame (8N1) waveform + timing
baud = 9600;
Tb   = 1/baud;                 % bit time (s)
byte = 65;                     % 'A' = 0x41 = 0b01000001
bits = bitget(byte, 1:8);      % LSB-first data bits

% Frame: idle(1) start(0) d0..d7 stop(1)
frame = [1 0 bits 1];          % 8N1, no parity
labels = ["idle" "start" "b0" "b1" "b2" "b3" "b4" "b5" "b6" "b7" "stop"];

% Build a time-vs-level staircase
fs = 100;                      % samples per bit
t  = (0:numel(frame)*fs-1)/fs; % time in bit-periods
y  = repelem(frame, fs);

figure; stairs(t, y, 'LineWidth', 2); ylim([-0.3 1.3]);
xlabel('time (bit periods)'); ylabel('line level');
title('RS-232 8N1 UART frame for byte 0x41');
grid on;
for k = 1:numel(frame)
    text(k-0.9, 1.15, labels(k), 'FontSize', 8);
end

% Timing numbers
frameBits = 10;                % 1 start + 8 data + 1 stop
Tframe = frameBits*Tb;
eff = 8/frameBits;             % payload/total = 80%
fprintf('bit time   = %.3f us\n', Tb*1e6);
fprintf('frame time = %.3f us (10 bit-times)\n', Tframe*1e6);
fprintf('8N1 efficiency = %.0f%%\n', eff*100);
fprintf('max throughput = %.0f bytes/s\n', baud/frameBits);`,
    python: String.raw`# RS-232 UART frame (8N1) waveform + timing
import numpy as np
import matplotlib.pyplot as plt

baud = 9600
Tb   = 1/baud                       # bit time (s)
byte = 0x41                         # 'A'
bits = [(byte >> i) & 1 for i in range(8)]   # LSB-first

# Frame: idle(1) start(0) d0..d7 stop(1)  -> 8N1
frame  = [1, 0] + bits + [1]
labels = ["idle","start","b0","b1","b2","b3","b4","b5","b6","b7","stop"]

fs = 100                            # samples per bit
y  = np.repeat(frame, fs)
t  = np.arange(y.size)/fs           # time in bit periods

plt.step(t, y, where='post', lw=2)
plt.ylim(-0.3, 1.3); plt.grid(True)
plt.xlabel('time (bit periods)'); plt.ylabel('line level')
plt.title('RS-232 8N1 UART frame for byte 0x41')
for k, lab in enumerate(labels):
    plt.text(k+0.05, 1.15, lab, fontsize=8)
plt.tight_layout(); plt.show()

# Timing numbers
frame_bits = 10                     # 1 start + 8 data + 1 stop
Tframe = frame_bits*Tb
eff = 8/frame_bits                  # 80%
print(f"bit time   = {Tb*1e6:.3f} us")
print(f"frame time = {Tframe*1e6:.3f} us (10 bit-times)")
print(f"8N1 efficiency = {eff*100:.0f}%")
print(f"max throughput = {baud/frame_bits:.0f} bytes/s")`
  },

  'rs422': {
    matlab: String.raw`% RS-422 differential signaling rejects common-mode noise
baud = 1e6;  Tb = 1/baud;
data = [0 1 1 0 1 0 0 1];
fs = 200;
d  = repelem(data, fs);
t  = (0:numel(d)-1)/fs*Tb*1e6;   % time in us

% Driver: A and B are complementary about 2.5 V, +-1 V swing
A =  2.5 + (d-0.5)*2;            % high/low line
B =  2.5 - (d-0.5)*2;            % inverted line

% Add common-mode noise to BOTH lines (couples equally)
noise = 0.8*sin(2*pi*0.3*t) + 0.3*randn(size(t));
An = A + noise;  Bn = B + noise;
diff = An - Bn;                  % receiver takes A - B

figure;
subplot(2,1,1); plot(t,An,t,Bn,'LineWidth',1.2);
legend('A+noise','B+noise'); ylabel('V'); grid on;
title('RS-422 lines with common-mode noise');
subplot(2,1,2); plot(t,diff,'LineWidth',1.5);
ylabel('A - B (V)'); xlabel('time (us)'); grid on;
title('Differential receiver output (noise cancels)');

% Length vs rate rule of thumb (RS-422)
rates = [100e3 1e6 10e6];       % bps
lens  = [1200  120  12];        % meters (approx)
fprintf('RS-422 length-vs-rate rule of thumb:\n');
for k=1:numel(rates)
    fprintf('  %6.2f Mbps -> ~%5.0f m\n', rates(k)/1e6, lens(k));
end`,
    python: String.raw`# RS-422 differential signaling rejects common-mode noise
import numpy as np
import matplotlib.pyplot as plt

baud = 1e6; Tb = 1/baud
data = np.array([0,1,1,0,1,0,0,1])
fs = 200
d  = np.repeat(data, fs)
t  = np.arange(d.size)/fs*Tb*1e6         # time in us

# Complementary lines about 2.5 V, +-1 V swing
A = 2.5 + (d-0.5)*2
B = 2.5 - (d-0.5)*2

# Common-mode noise couples equally onto both lines
noise = 0.8*np.sin(2*np.pi*0.3*t) + 0.3*np.random.randn(t.size)
An, Bn = A+noise, B+noise
diff = An - Bn                            # receiver: A - B

fig, ax = plt.subplots(2,1, figsize=(7,5), sharex=True)
ax[0].plot(t, An, label='A+noise'); ax[0].plot(t, Bn, label='B+noise')
ax[0].legend(); ax[0].set_ylabel('V'); ax[0].grid(True)
ax[0].set_title('RS-422 lines with common-mode noise')
ax[1].plot(t, diff); ax[1].set_ylabel('A - B (V)')
ax[1].set_xlabel('time (us)'); ax[1].grid(True)
ax[1].set_title('Differential receiver output (noise cancels)')
plt.tight_layout(); plt.show()

# Length vs rate rule of thumb
for r, L in [(100e3,1200),(1e6,120),(10e6,12)]:
    print(f"  {r/1e6:6.2f} Mbps -> ~{L:5.0f} m")`
  },

  'rs485': {
    matlab: String.raw`% RS-485 half-duplex multidrop bus: driver-enable timeline
baud = 115200; Tb = 1/baud;
slot = 8;                        % 8 bit-times of data per turn
gap  = 2;                        % turnaround guard (bit-times)
nodes = 3;                       % nodes take turns driving

% Timeline in bit-times: each node drives its slot, tri-states otherwise
total = nodes*(slot+gap);
t = 0:total-1;
DE = zeros(nodes, total);        % driver-enable per node
for n = 1:nodes
    s = (n-1)*(slot+gap);
    DE(n, s+1 : s+slot) = 1;
end
busActive = any(DE,1);           % bus driven when any DE high

figure;
for n=1:nodes
    subplot(nodes+1,1,n);
    stairs(t, DE(n,:), 'LineWidth',1.5); ylim([-0.2 1.2]);
    ylabel(sprintf('Node %d DE',n)); grid on;
end
subplot(nodes+1,1,nodes+1);
stairs(t, busActive, 'LineWidth',1.5); ylim([-0.2 1.2]);
ylabel('bus driven'); xlabel('time (bit-times)'); grid on;
sgtitle('RS-485 half-duplex: only one driver enabled at a time');

% Numbers
maxUL = 32;                      % standard unit loads (nodes)
Tturn = gap*Tb;
fprintf('max standard unit loads = %d nodes\n', maxUL);
fprintf('bit time = %.3f us, turnaround guard = %.3f us\n', Tb*1e6, Tturn*1e6);
fprintf('slot time (%d bits) = %.2f us\n', slot, slot*Tb*1e6);`,
    python: String.raw`# RS-485 half-duplex multidrop bus: driver-enable timeline
import numpy as np
import matplotlib.pyplot as plt

baud = 115200; Tb = 1/baud
slot, gap, nodes = 8, 2, 3        # bit-times of data, guard, node count

total = nodes*(slot+gap)
t = np.arange(total)
DE = np.zeros((nodes, total))
for n in range(nodes):
    s = n*(slot+gap)
    DE[n, s:s+slot] = 1
bus_active = DE.any(axis=0)       # bus driven if any node enabled

fig, ax = plt.subplots(nodes+1, 1, figsize=(7,6), sharex=True)
for n in range(nodes):
    ax[n].step(t, DE[n], where='post', lw=1.5)
    ax[n].set_ylim(-0.2,1.2); ax[n].set_ylabel(f'Node{n} DE'); ax[n].grid(True)
ax[-1].step(t, bus_active, where='post', lw=1.5)
ax[-1].set_ylim(-0.2,1.2); ax[-1].set_ylabel('bus driven')
ax[-1].set_xlabel('time (bit-times)'); ax[-1].grid(True)
fig.suptitle('RS-485 half-duplex: one driver enabled at a time')
plt.tight_layout(); plt.show()

max_ul = 32                       # standard unit loads
print(f"max standard unit loads = {max_ul} nodes")
print(f"bit time = {Tb*1e6:.3f} us, turnaround guard = {gap*Tb*1e6:.3f} us")
print(f"slot time ({slot} bits) = {slot*Tb*1e6:.2f} us")`
  },

  'lvds': {
    matlab: String.raw`% LVDS current-mode driver: 3.5 mA into 100 ohm -> ~350 mV swing
I   = 3.5e-3;                    % driver current
R   = 100;                       % termination resistor (ohm)
Vcm = 1.2;                       % common-mode voltage
Vswing = I*R;                    % differential swing amplitude
Vp = Vcm + Vswing/2;             % line high level
Vn = Vcm - Vswing/2;             % line low level

data = [0 1 1 0 1 0 0 1 1 0];
fs = 100;
d  = repelem(data, fs);
t  = (0:numel(d)-1)/fs;          % bit periods

% Two lines swing complementarily about Vcm
Vp_line = Vcm + (d-0.5)*Vswing;
Vn_line = Vcm - (d-0.5)*Vswing;
Vdiff   = Vp_line - Vn_line;

figure;
subplot(2,1,1);
plot(t,Vp_line,t,Vn_line,'LineWidth',1.5);
yline(Vcm,'--','Vcm'); legend('D+','D-'); ylabel('V'); grid on;
title('LVDS lines about 1.2 V common mode');
subplot(2,1,2);
plot(t,Vdiff,'LineWidth',1.5); ylabel('D+ minus D- (V)');
xlabel('time (bit periods)'); grid on;
title('Differential signal');

Pterm = I^2*R;                   % power in termination
fprintf('swing = %.0f mV, common mode = %.2f V\n', Vswing*1e3, Vcm);
fprintf('D+ high = %.3f V, D- low = %.3f V\n', Vp, Vn);
fprintf('termination power = %.3f mW\n', Pterm*1e3);`,
    python: String.raw`# LVDS current-mode driver: 3.5 mA into 100 ohm -> ~350 mV swing
import numpy as np
import matplotlib.pyplot as plt

I   = 3.5e-3          # driver current
R   = 100             # termination (ohm)
Vcm = 1.2             # common mode
Vswing = I*R          # ~0.35 V
Vp = Vcm + Vswing/2
Vn = Vcm - Vswing/2

data = np.array([0,1,1,0,1,0,0,1,1,0])
fs = 100
d  = np.repeat(data, fs)
t  = np.arange(d.size)/fs

Vp_line = Vcm + (d-0.5)*Vswing
Vn_line = Vcm - (d-0.5)*Vswing
Vdiff   = Vp_line - Vn_line

fig, ax = plt.subplots(2,1, figsize=(7,5), sharex=True)
ax[0].plot(t, Vp_line, label='D+'); ax[0].plot(t, Vn_line, label='D-')
ax[0].axhline(Vcm, ls='--', color='k'); ax[0].legend()
ax[0].set_ylabel('V'); ax[0].grid(True)
ax[0].set_title('LVDS lines about 1.2 V common mode')
ax[1].plot(t, Vdiff); ax[1].set_ylabel('D+ minus D- (V)')
ax[1].set_xlabel('time (bit periods)'); ax[1].grid(True)
ax[1].set_title('Differential signal')
plt.tight_layout(); plt.show()

Pterm = I**2*R
print(f"swing = {Vswing*1e3:.0f} mV, common mode = {Vcm:.2f} V")
print(f"D+ high = {Vp:.3f} V, D- low = {Vn:.3f} V")
print(f"termination power = {Pterm*1e3:.3f} mW")`
  },

  'spi': {
    matlab: String.raw`% SPI mode 0 (CPOL=0, CPHA=0): SCLK, MOSI, MISO, SS + sample edges
fsclk = 1e6;  Tclk = 1/fsclk;
mosi_byte = 178;  miso_byte = 75;   % 0xB2, 0x4B
N = 8;
mbits = bitget(mosi_byte, N:-1:1);  % MSB-first
sbits = bitget(miso_byte, N:-1:1);

% 2 samples per clock -> build clock and data lanes
sub = 2;
tp = (0:N*sub)/sub;                 % in clock periods
SCLK = zeros(1,N*sub);
SCLK(2:2:end) = 1;                  % rising edge = sample (mode 0)
MOSI = repelem(mbits, sub);
MISO = repelem(sbits, sub);
SS   = zeros(1,N*sub);              % active low, asserted whole transfer
t = (0:N*sub-1)/sub;

figure;
lanes = {SS,SCLK,MOSI,MISO}; names = {'SS','SCLK','MOSI','MISO'};
for k=1:4
    subplot(4,1,k); stairs(t,lanes{k},'LineWidth',1.5); ylim([-0.3 1.3]);
    ylabel(names{k}); grid on;
    if k>=3
        edges = 0.5:1:N;            % rising-edge sample points
        hold on; plot(edges, 1.15*ones(size(edges)),'rv');
    end
end
xlabel('time (SCLK periods)'); sgtitle('SPI mode 0 byte transfer (v = sample edge)');

Tbyte = N*Tclk;
fprintf('SCLK = %.1f MHz, throughput = %.1f Mbit/s\n', fsclk/1e6, fsclk/1e6);
fprintf('one byte = %.2f us; 256 bytes = %.1f us\n', Tbyte*1e6, 256*Tbyte*1e6);`,
    python: String.raw`# SPI mode 0 (CPOL=0, CPHA=0): SCLK, MOSI, MISO, SS + sample edges
import numpy as np
import matplotlib.pyplot as plt

fsclk = 1e6; Tclk = 1/fsclk
mosi_byte, miso_byte, N = 0xB2, 0x4B, 8
mbits = [(mosi_byte >> i) & 1 for i in range(N-1,-1,-1)]  # MSB-first
sbits = [(miso_byte >> i) & 1 for i in range(N-1,-1,-1)]

sub = 2
SCLK = np.zeros(N*sub); SCLK[1::2] = 1        # rising edge = sample
MOSI = np.repeat(mbits, sub)
MISO = np.repeat(sbits, sub)
SS   = np.zeros(N*sub)                        # active low, held asserted
t = np.arange(N*sub)/sub

fig, ax = plt.subplots(4,1, figsize=(7,6), sharex=True)
lanes = [(SS,'SS'),(SCLK,'SCLK'),(MOSI,'MOSI'),(MISO,'MISO')]
edges = np.arange(0.5, N, 1.0)               # rising-edge sample points
for k,(lane,name) in enumerate(lanes):
    ax[k].step(t, lane, where='post', lw=1.5); ax[k].set_ylim(-0.3,1.3)
    ax[k].set_ylabel(name); ax[k].grid(True)
    if k>=2:
        ax[k].plot(edges, 1.15*np.ones_like(edges), 'rv')
ax[-1].set_xlabel('time (SCLK periods)')
fig.suptitle('SPI mode 0 byte transfer (v = sample edge)')
plt.tight_layout(); plt.show()

Tbyte = N*Tclk
print(f"SCLK = {fsclk/1e6:.1f} MHz, throughput = {fsclk/1e6:.1f} Mbit/s")
print(f"one byte = {Tbyte*1e6:.2f} us; 256 bytes = {256*Tbyte*1e6:.1f} us")`
  },

  'axi': {
    matlab: String.raw`% AXI VALID/READY handshake for a burst; transfer only when both high
fclk = 100e6; Tclk = 1/fclk;
width = 32;                         % data bus width (bits)
Ncy = 12;                           % clock cycles simulated
% Master asserts VALID, slave READY drops mid-burst (a stall)
VALID = [0 1 1 1 1 1 1 1 1 1 0 0];
READY = [0 1 1 0 0 1 1 1 1 1 0 0];  % stall cycles 4-5
XFER  = VALID & READY;              % beat happens only when both high

t = 0:Ncy-1;
DATA = zeros(1,Ncy); beat = 0;
for k=1:Ncy
    if XFER(k), beat = beat+1; end
    DATA(k) = beat;                 % beat index shown when transferring
end

figure;
subplot(4,1,1); stairs(t,VALID,'LineWidth',1.5); ylim([-0.2 1.2]); ylabel('VALID'); grid on;
subplot(4,1,2); stairs(t,READY,'LineWidth',1.5); ylim([-0.2 1.2]); ylabel('READY'); grid on;
subplot(4,1,3); stairs(t,XFER,'LineWidth',1.5);  ylim([-0.2 1.2]); ylabel('transfer'); grid on;
subplot(4,1,4); stairs(t,DATA,'LineWidth',1.5);  ylabel('beat #'); xlabel('clock cycle'); grid on;
sgtitle('AXI handshake: beat only when VALID and READY (note stall)');

beats = sum(XFER);
BW = beats*width/(Ncy*Tclk);        % effective over the window
peakBW = fclk*width;                % one beat every clock
fprintf('beats transferred = %d in %d cycles\n', beats, Ncy);
fprintf('peak bandwidth = %.2f Gbit/s (%d-bit @ %.0f MHz)\n', peakBW/1e9, width, fclk/1e6);
fprintf('effective bandwidth = %.2f Gbit/s (with stall)\n', BW/1e9);`,
    python: String.raw`# AXI VALID/READY handshake for a burst; transfer only when both high
import numpy as np
import matplotlib.pyplot as plt

fclk = 100e6; Tclk = 1/fclk
width = 32                          # bus width (bits)
VALID = np.array([0,1,1,1,1,1,1,1,1,1,0,0])
READY = np.array([0,1,1,0,0,1,1,1,1,1,0,0])   # stall cycles 3-4
XFER  = VALID & READY
Ncy = VALID.size
t = np.arange(Ncy)

DATA = np.zeros(Ncy); beat = 0
for k in range(Ncy):
    if XFER[k]: beat += 1
    DATA[k] = beat

fig, ax = plt.subplots(4,1, figsize=(7,6), sharex=True)
for a,(sig,name) in zip(ax, [(VALID,'VALID'),(READY,'READY'),(XFER,'transfer'),(DATA,'beat #')]):
    a.step(t, sig, where='post', lw=1.5); a.set_ylabel(name); a.grid(True)
    if name!='beat #': a.set_ylim(-0.2,1.2)
ax[-1].set_xlabel('clock cycle')
fig.suptitle('AXI handshake: beat only when VALID and READY (note stall)')
plt.tight_layout(); plt.show()

beats = int(XFER.sum())
peakBW = fclk*width
BW = beats*width/(Ncy*Tclk)
print(f"beats transferred = {beats} in {Ncy} cycles")
print(f"peak bandwidth = {peakBW/1e9:.2f} Gbit/s ({width}-bit @ {fclk/1e6:.0f} MHz)")
print(f"effective bandwidth = {BW/1e9:.2f} Gbit/s (with stall)")`
  },

  'mil-std-1553': {
    matlab: String.raw`% MIL-STD-1553 word: 3-bit sync + 16 data + parity = 20 bit-times, Manchester-II
rate = 1e6; Tb = 1/rate;            % 1 Mbps -> 1 us per bit
data16 = [1 0 1 1 0 0 1 0 1 1 1 0 0 1 0 1];
parity = mod(sum(data16)+1, 2);     % odd parity
% Sync: command/status sync = 3 bit-times, high-then-low (encoded specially)
% Represent word as logic bits for Manchester (sync handled separately)
bits = [data16 parity];             % 17 logical bits

sub = 20;                           % samples per bit
% Manchester-II (IEEE): 1 -> high->low, 0 -> low->high (per half-bit)
man = [];
for b = bits
    if b==1, half=[ones(1,sub/2) zeros(1,sub/2)];
    else     half=[zeros(1,sub/2) ones(1,sub/2)]; end
    man = [man half];
end
% 3-bit-time command sync: high for 1.5 bits then low for 1.5 bits
sync = [ones(1,3*sub/2) zeros(1,3*sub/2)];
wave = [sync man];
t = (0:numel(wave)-1)/sub;          % time in bit-times

figure; plot(t, wave, 'LineWidth', 1.5); ylim([-0.2 1.2]);
xlabel('time (bit-times, 1 us each)'); ylabel('level');
title('MIL-STD-1553 word: 3-bit sync + 16 data + parity (Manchester-II)');
grid on; xline(3,'--','end sync');

Tword = 20*Tb;                      % 20 us
Nwords = 1 + 32;                    % command + up to 32 data words
Tmsg = Nwords*Tword;
fprintf('bit time = %.2f us, word time = %.1f us (20 bit-times)\n', Tb*1e6, Tword*1e6);
fprintf('parity (odd) = %d\n', parity);
fprintf('33-word message = %.1f us\n', Tmsg*1e6);`,
    python: String.raw`# MIL-STD-1553 word: 3-bit sync + 16 data + parity = 20 bit-times, Manchester-II
import numpy as np
import matplotlib.pyplot as plt

rate = 1e6; Tb = 1/rate                       # 1 us per bit
data16 = np.array([1,0,1,1,0,0,1,0,1,1,1,0,0,1,0,1])
parity = (data16.sum()+1) % 2                 # odd parity
bits = np.append(data16, parity)              # 17 logical bits

sub = 20                                       # samples per bit
man = []
for b in bits:
    if b == 1: half = np.concatenate([np.ones(sub//2), np.zeros(sub//2)])
    else:      half = np.concatenate([np.zeros(sub//2), np.ones(sub//2)])
    man.append(half)
man = np.concatenate(man)
# Command/status sync = 3 bit-times: high 1.5 then low 1.5
sync = np.concatenate([np.ones(3*sub//2), np.zeros(3*sub//2)])
wave = np.concatenate([sync, man])
t = np.arange(wave.size)/sub                  # bit-times

plt.plot(t, wave, lw=1.5); plt.ylim(-0.2,1.2); plt.grid(True)
plt.axvline(3, ls='--', color='k')
plt.xlabel('time (bit-times, 1 us each)'); plt.ylabel('level')
plt.title('MIL-STD-1553 word: 3-bit sync + 16 data + parity (Manchester-II)')
plt.tight_layout(); plt.show()

Tword = 20*Tb                                  # 20 us
Nwords = 1 + 32                                # command + up to 32 data
Tmsg = Nwords*Tword
print(f"bit time = {Tb*1e6:.2f} us, word time = {Tword*1e6:.1f} us (20 bit-times)")
print(f"parity (odd) = {parity}")
print(f"33-word message = {Tmsg*1e6:.1f} us")`
  }
});
