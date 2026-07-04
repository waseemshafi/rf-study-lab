/* ============================================================
   figures-extra.js — additional diagrams appended to topics.
   Loaded AFTER figures.js. Each add() pushes another figure spec
   onto a topic's FIG.map entry, so most topics show 2-4 diagrams
   (these + any schematic SVG in the topic content).
   ============================================================ */
(function () {
  if (typeof FIG === 'undefined' || !FIG.map) return;
  const M = FIG.map;
  const EX = s => s;
  const add = (id, spec) => { if (M[id]) M[id].push(spec); };
  const addFront = (id, spec) => { if (M[id]) M[id].unshift(spec); };

  // ---- Protocol packet / word / frame STRUCTURE diagrams (shown as Figure 1) ----
  const uartFrame = { name: 'UART character frame', note: 'parity optional; 8-N-1 omits it', fields: [
    { l: 'Start', bits: 1 }, { l: 'D0', bits: 1 }, { l: 'D1', bits: 1 }, { l: 'D2', bits: 1 }, { l: 'D3', bits: 1 }, { l: 'D4', bits: 1 }, { l: 'D5', bits: 1 }, { l: 'D6', bits: 1 }, { l: 'D7', bits: 1 }, { l: 'Par', bits: 1 }, { l: 'Stop', bits: 1 } ] };
  const uartExplain = EX('<b>What it shows:</b> the field-by-field frame the receiver decodes. A low <b>Start</b> bit wakes it up, 8 <b>data</b> bits follow LSB-first, an optional <b>parity</b> bit checks for errors, and a high <b>Stop</b> bit closes the character. 8-N-1 = 10 bits on the wire for 8 data bits.');
  addFront('rs232', { type: 'packetStructure', words: [uartFrame], title: 'RS-232 frame structure', caption: 'Every field of one transmitted character.', explain: uartExplain });
  addFront('rs422', { type: 'packetStructure', words: [uartFrame], title: 'RS-422 frame structure', caption: 'Same UART frame, sent differentially.', explain: uartExplain });
  addFront('rs485', { type: 'packetStructure', words: [uartFrame], title: 'RS-485 frame structure', caption: 'UART frame; higher layers (e.g. Modbus) add the packet.', explain: EX('<b>What it shows:</b> RS-485 carries the same UART character frame, but a higher-layer protocol (like Modbus) wraps these bytes into addressed packets with a CRC, since many devices share the bus.') });

  addFront('lvds', { type: 'packetStructure', words: [{ name: 'FPD-Link serialization (example)', note: '7 bits per pixel clock, per lane', unit: ' bits/clock', fields: [
    { l: 'b0', bits: 1 }, { l: 'b1', bits: 1 }, { l: 'b2', bits: 1 }, { l: 'b3', bits: 1 }, { l: 'b4', bits: 1 }, { l: 'b5', bits: 1 }, { l: 'b6', bits: 1 } ] }], title: 'LVDS carries serialized data', caption: 'LVDS is electrical — it serializes bits (e.g. 7:1).', explain: EX('<b>What it shows:</b> LVDS itself defines no packet — it is the electrical layer. Standards built on it, like FPD-Link, serialize parallel data (here 7 bits of RGB+control per pixel clock, per lane) onto the fast differential pair.') });

  addFront('spi', { type: 'packetStructure', words: [{ name: 'Typical SPI transaction', note: 'device-defined; CS low throughout', fields: [
    { l: 'Command', bits: 8 }, { l: 'Address', bits: 24 }, { l: 'Data byte(s)', bits: 24 } ] }], title: 'SPI transaction structure', caption: 'SPI has no fixed packet — devices define it.', explain: EX('<b>What it shows:</b> SPI itself only shifts bits, so the "packet" is whatever the slave device defines — commonly a command byte, then an address, then data, all while chip-select is held low. There is no built-in addressing, length, or acknowledge.') });

  addFront('axi', { type: 'packetStructure', words: [
    { name: 'Write Address channel (AW)', unit: ' bits (typ.)', fields: [{ l: 'AWID', bits: 4 }, { l: 'AWADDR', bits: 32 }, { l: 'AWLEN', bits: 8 }, { l: 'AWSIZE', bits: 3 }, { l: 'AWBURST', bits: 2 }] },
    { name: 'Write Data channel (W) — one beat', unit: ' bits (typ.)', fields: [{ l: 'WDATA', bits: 32 }, { l: 'WSTRB', bits: 4 }, { l: 'WLAST', bits: 1 }] },
    { name: 'Write Response channel (B)', unit: ' bits (typ.)', fields: [{ l: 'BID', bits: 4 }, { l: 'BRESP', bits: 2 }] }
  ], title: 'AXI channel structure', caption: 'Address, data-burst, and response travel on separate channels.', explain: EX('<b>What it shows:</b> an AXI write splits across channels — send the address & burst control once (AW), stream the data beats (W, last one flags WLAST), then get a response (B). Reads use AR + R. Every channel uses the VALID/READY handshake.') });

  addFront('mil-std-1553', { type: 'packetStructure', words: [
    { name: 'Command Word', unit: ' bit-times', fields: [{ l: 'Sync', bits: 3 }, { l: 'RT Address', bits: 5 }, { l: 'T/R', bits: 1 }, { l: 'Subaddr/Mode', bits: 5 }, { l: 'Word Count/Mode Code', bits: 5 }, { l: 'P', bits: 1 }] },
    { name: 'Status Word', unit: ' bit-times', fields: [{ l: 'Sync', bits: 3 }, { l: 'RT Address', bits: 5 }, { l: 'ME', bits: 1 }, { l: 'Instr', bits: 1 }, { l: 'SRQ', bits: 1 }, { l: 'Reserved', bits: 3 }, { l: 'BCR', bits: 1 }, { l: 'Busy', bits: 1 }, { l: 'SSF', bits: 1 }, { l: 'DBC', bits: 1 }, { l: 'TF', bits: 1 }, { l: 'P', bits: 1 }] },
    { name: 'Data Word', unit: ' bit-times', fields: [{ l: 'Sync', bits: 3 }, { l: 'Data', bits: 16 }, { l: 'P', bits: 1 }] }
  ], title: 'MIL-STD-1553 word structures', caption: 'The Command, Status and Data words — each 20 bit-times.', explain: EX('<b>What it shows:</b> all three 1553 word types, field by field. The <b>Command Word</b> (from the Bus Controller) names a terminal, direction, subaddress and word count. The <b>Status Word</b> (from the terminal) carries the health bits — ME=Message Error, SRQ=Service Request, BCR=Broadcast Received, Busy, SSF=Subsystem Flag, DBC=Dynamic Bus Control, TF=Terminal Flag. The <b>Data Word</b> wraps 16 payload bits. Each starts with a 3-bit sync and ends with a parity bit.') });

  // ---- Protocol dynamic-behaviour figures ----
  add('axi', { type: 'axiBurst', title: 'AXI burst types', caption: 'FIXED / INCR / WRAP — how the address advances.', explain: EX('<b>What it shows:</b> an AXI burst sends the address once, then streams beats. <b>Try:</b> FIXED reuses one address (a FIFO), INCR walks through memory, and WRAP increments then wraps at a boundary (cache-line fills). AWLEN sets how many beats, AWSIZE the bytes per beat.') });
  add('mil-std-1553', { type: 'msgSequence1553', title: '1553 message formats', caption: 'Command → (gap) → Status/Data — pick a format.', explain: EX('<b>What it shows:</b> how words flow on the bus for each message type. <b>Try:</b> in BC→RT the controller sends a Command then Data words and the RT replies with a Status word; in RT→BC the RT sends Status then Data; RT→RT chains two commands. Each word is 20 µs and the RT must answer within 4–12 µs.') });

  // ---- Round 11: guarantee every topic has >=3 diagrams (a third figure each) ----

  // ---- Fundamentals ----
  add('comm-basics', { type: 'berCurve', series: [{ name: 'bpsk' }], title: 'Reliability vs energy per bit', caption: 'How the error rate falls as you spend more energy per bit.', explain: EX('Communication is a trade of energy for reliability — this BER curve shows the payoff for every extra dB of Eb/N0.') });
  add('noise', { type: 'noiseFloorBw', title: 'Noise floor vs bandwidth', caption: 'Noise power grows with bandwidth (kTB).', explain: EX('Because noise power is kTB, opening the bandwidth lets in more noise — 3 dB per doubling.') });
  add('psd', { type: 'spectrumBuilder', title: 'A signal as a sum of tones', caption: 'PSD shows where a signal’s power sits in frequency.', explain: EX('PSD is the power view of the spectrum: each tone is a spike whose height is its power.') });
  add('noise-floor', { type: 'sensitivityStack', title: 'From floor to sensitivity', caption: 'The floor is the first ingredient of receiver sensitivity.', explain: EX('Sensitivity is built by stacking the noise figure and required SNR on top of the kTB floor.') });
  add('noise-figure', { type: 'noiseFloorBw', title: 'NF lifts the whole floor', caption: 'Noise figure adds directly to the noise floor.', explain: EX('Every dB of noise figure raises the noise floor by a dB, hurting sensitivity everywhere.') });
  add('phase-noise', { type: 'constellation', order: 16, snr: 26, title: 'Phase noise rotates the constellation', caption: 'Jitter smears constellation points around the circle.', explain: EX('Phase noise spins each symbol slightly; dense constellations like 16-QAM suffer first.') });

  // ---- Signals & Systems ----
  add('fourier-transform', { type: 'spectrumBuilder', title: 'Spectrum of a multi-tone signal', caption: 'The transform lists the tones inside a signal.', explain: EX('The Fourier transform turns the time wiggle into this list of frequency components.') });
  add('fft', { type: 'fourierTransform', title: 'Fourier synthesis (inverse view)', caption: 'The same tones can rebuild the original wave.', explain: EX('Add the harmonics back up and the wave reappears — the FFT works both directions.') });
  add('sinc-function', { type: 'sincImages', title: 'Sinc in a real DAC', caption: 'The zero-order hold’s sinc envelope in practice.', explain: EX('The sinc shape isn’t just theory — it is the frequency droop every DAC imposes.') });
  add('frequency-spectrum', { type: 'fftDemo', title: 'Reading a spectrum from data', caption: 'An FFT recovers the spectrum of a noisy signal.', explain: EX('Feed real samples to an FFT and the spectrum’s spikes pop out of the noise.') });
  add('laplace-transform', { type: 'zPlane', title: 'The discrete cousin (z-plane)', caption: 'Digital systems use the z-plane and unit circle.', explain: EX('Laplace’s s-plane maps to the z-plane for sampled systems; the stability line becomes the unit circle.') });
  add('z-transform', { type: 'laplacePoleZero', title: 'The continuous cousin (s-plane)', caption: 'The z-plane mirrors the analog s-plane.', explain: EX('The z-transform is the sampled version of the Laplace transform; poles inside the circle ↔ left-half plane.') });
  add('convolution', { type: 'correlationDemo', title: 'Correlation (convolution’s twin)', caption: 'Correlation slides without the flip.', explain: EX('Correlation is convolution without the flip — handy for spotting a known pattern.') });
  add('correlation', { type: 'matchedFilter', title: 'Correlation = matched filtering', caption: 'A matched filter correlates against the known pulse.', explain: EX('Correlating a signal with a template is exactly what the optimal matched filter does.') });
  add('fir-filters', { type: 'iirResponse', title: 'Compare: IIR response', caption: 'IIR gets a sharp cutoff with far fewer coefficients.', explain: EX('Compare the FIR curve with this IIR one — feedback buys sharpness cheaply, at the cost of phase linearity.') });
  add('iir-filters', { type: 'firResponse', title: 'Compare: FIR response', caption: 'FIR is heavier but always stable and linear-phase.', explain: EX('The FIR needs more taps for the same sharpness but can never go unstable.') });
  add('iir-filters', { type: 'zPlane', title: 'IIR poles on the z-plane', caption: 'Feedback places poles — keep them inside the circle.', explain: EX('An IIR filter’s feedback creates poles; stability demands they stay inside the unit circle.') });
  add('nyquist-sampling', { type: 'aliasingDemo', title: 'What happens if you break Nyquist', caption: 'Under-sampling folds a fast tone to a false slow one.', explain: EX('Sample too slowly and Nyquist’s promise breaks — the tone aliases to a wrong frequency.') });
  add('aliasing', { type: 'nyquistZones', title: 'Aliasing across Nyquist zones', caption: 'Higher zones fold down onto baseband.', explain: EX('Every Nyquist zone folds onto the first — the basis of both aliasing and deliberate under-sampling.') });

  // ---- Modulation & Detection ----
  add('bpsk', { type: 'matchedFilter', title: 'The detector behind BPSK', caption: 'A matched filter makes the ±1 decision.', explain: EX('Behind the constellation, a matched filter squeezes each noisy symbol to a clean value before the sign decision.') });
  add('dbpsk', { type: 'constellation', order: 2, snr: 10, title: 'The underlying BPSK points', caption: 'DBPSK still lives on the BPSK constellation.', explain: EX('Differential encoding rides on the same two antipodal points — it just reads the change between them.') });
  add('matched-filter', { type: 'correlationDemo', title: 'Matched filter as a correlator', caption: 'Sliding-correlation view of the same operation.', explain: EX('The matched filter’s peak is a correlation peak — line the template up with the signal.') });
  add('evm', { type: 'berCurve', series: [{ name: 'bpsk' }], title: 'EVM ↔ error rate', caption: 'Worse EVM (lower SNR) means more errors.', explain: EX('EVM is really inverse SNR, so a rising EVM slides you up this error-rate curve.') });
  add('ber', { type: 'constellation', order: 2, snr: 8, title: 'Where errors come from', caption: 'Errors happen when noise crosses the decision line.', explain: EX('Each bit error is a sample that the noise pushed across zero — lower the SNR to see the rate climb.') });
  add('eb-no', { type: 'capacity', title: 'Eb/N0 and the Shannon limit', caption: 'There is a hard floor at −1.59 dB.', explain: EX('Eb/N0 is bounded below by the Shannon limit; capacity shows the ceiling you are pushing against.') });
  add('pulse-shaping', { type: 'eyeDiagram', title: 'Pulse shaping seen in the eye', caption: 'Good shaping opens the eye wide.', explain: EX('The whole point of pulse shaping is a wide-open eye — no inter-symbol interference at the sampling instant.') });
  add('eye-diagram', { type: 'raisedCosine', title: 'The pulse that opens the eye', caption: 'Raised-cosine pulses cause the clean eye.', explain: EX('The eye is open because each pulse is zero at its neighbours’ sampling times.') });

  // ---- Synchronization ----
  add('pll', { type: 'phaseNoise', title: 'A PLL cleans phase noise', caption: 'Inside its loop bandwidth the loop tracks/cleans phase.', explain: EX('A PLL follows slow phase wander and rejects fast jitter beyond its loop bandwidth.') });
  add('fll', { type: 'pllStep', title: 'Hand-off to the PLL', caption: 'After the FLL pulls in, a PLL fine-tracks.', explain: EX('Receivers acquire with the robust FLL, then switch to the PLL’s precise phase tracking.') });
  add('costas-loop', { type: 'constellation', order: 2, snr: 12, title: 'What the loop recovers', caption: 'Lock aligns the BPSK points to the axes.', explain: EX('Once the Costas loop locks, the recovered constellation snaps onto the I-axis — ready to decide.') });

  // ---- Spread Spectrum & Coding ----
  add('dsss', { type: 'autocorr', title: 'Despreading uses the code’s sharp peak', caption: 'The PN code correlates only when aligned.', explain: EX('Despreading works because the spreading code has a razor-sharp autocorrelation peak.') });
  add('frequency-hopping', { type: 'spread', title: 'Hopping also spreads the spectrum', caption: 'Over time the energy covers a wide band.', explain: EX('Instantaneously narrowband, a hopper still spreads its average power over the whole hop set.') });
  add('pn-codes', { type: 'crosscorr', title: 'Different codes barely correlate', caption: 'Cross-correlation is small between codes.', explain: EX('A good code family has a tall self-peak but tiny cross-correlation with other codes.') });
  add('gold-code', { type: 'autocorr', title: 'Each code’s own sharp peak', caption: 'Autocorrelation stays sharp for timing.', explain: EX('Alongside their bounded cross-correlation, Gold codes keep a strong autocorrelation peak for sync.') });
  add('fec', { type: 'trellis', title: 'A convolutional code’s trellis', caption: 'Redundancy woven along a trellis path.', explain: EX('One common FEC is the convolutional code, whose structure is this trellis the decoder searches.') });
  add('viterbi', { type: 'berCurve', series: [{ name: 'bpsk' }, { name: 'coded' }], title: 'The payoff: coding gain', caption: 'Decoding shifts the error curve left.', explain: EX('Viterbi decoding delivers the coding gain — the left-shift of the error-rate curve.') });
  add('processing-gain', { type: 'autocorr', title: 'Correlation gain in action', caption: 'The correlation peak is the processing gain.', explain: EX('Processing gain is really correlation gain — the sharp peak that lifts the signal out of noise.') });
  add('jamming-margin', { type: 'spread', title: 'Spreading buys the margin', caption: 'A wider spread gives more anti-jam headroom.', explain: EX('Jamming margin comes from processing gain, which comes from how far you spread the signal.') });
  add('convolutional-codes', { type: 'berCurve', series: [{ name: 'bpsk' }, { name: 'coded' }], title: 'Coding gain from the code', caption: 'The code’s redundancy shifts the curve left.', explain: EX('The whole reason to add a convolutional code is this leftward shift — the coding gain.') });
  add('channel-coding', { type: 'trellis', title: 'A convolutional coder’s trellis', caption: 'One family of channel codes and its trellis.', explain: EX('Convolutional codes are a workhorse of channel coding; the decoder walks this trellis.') });

  // ---- SDR & Data Converters ----
  add('sdr', { type: 'spectrumBuilder', title: 'The SDR works in the spectrum', caption: 'Digitized IQ is processed in the frequency domain.', explain: EX('Once digitized, an SDR mostly lives in the spectrum — filtering and demodulating by frequency.') });
  add('adc', { type: 'samplingDemo', title: 'Sampling: fast enough?', caption: 'An ADC must obey Nyquist.', explain: EX('Before quantizing, an ADC samples — too slow and the signal aliases beyond repair.') });
  add('adc', { type: 'aliasingDemo', title: 'What under-sampling does', caption: 'A too-slow ADC invents a false low tone.', explain: EX('This is why every ADC needs an anti-alias filter ahead of it.') });
  add('dac', { type: 'sincFunction', title: 'The sinc behind the hold', caption: 'The zero-order hold is a sinc in frequency.', explain: EX('The DAC’s droop and images come straight from the sinc shape of holding each sample.') });
  add('ad9361', { type: 'iqDemod', title: 'It delivers I/Q', caption: 'The chip hands the FPGA complex baseband.', explain: EX('The AD9361 down-converts to I/Q — the complex-baseband pair every SDR processes.') });
  add('rfsoc', { type: 'samplingDemo', title: 'Direct RF sampling', caption: 'RFSoC samples fast enough to digitize RF directly.', explain: EX('Gigasample converters let RFSoC obey Nyquist even at RF, skipping the analog mixer.') });

  // ---- RF Link & Metrics ----
  add('rssi', { type: 'sensitivityStack', title: 'RSSI vs the sensitivity floor', caption: 'A useful RSSI must beat sensitivity.', explain: EX('RSSI only means a working link if it sits above the receiver’s sensitivity floor.') });
  add('path-loss', { type: 'linkWaterfall', title: 'Path loss in a link budget', caption: 'Path loss is the biggest subtraction.', explain: EX('In the budget, path loss is usually the dominant loss between transmit power and the receiver.') });
  add('link-budget', { type: 'pathLoss', title: 'Where the path loss comes from', caption: 'Distance and frequency set the loss term.', explain: EX('The budget’s path-loss line is read straight off this distance/frequency curve.') });
  add('sensitivity', { type: 'noiseFloorBw', title: 'The floor under sensitivity', caption: 'Bandwidth sets the kTB starting point.', explain: EX('Sensitivity starts from this bandwidth-dependent noise floor before adding NF and required SNR.') });

  // ---- Antennas & EM ----
  add('antenna', { type: 'gainFreq', title: 'Bigger/higher-frequency = more gain', caption: 'Aperture and frequency set the gain.', explain: EX('An antenna’s gain grows with its size in wavelengths — bigger dish or higher band.') });
  add('antenna-gain', { type: 'polarPattern', N: 8, title: 'Gain shows as a tighter beam', caption: 'High gain means a narrow main lobe.', explain: EX('Gain and beamwidth are two views of the same thing — more gain, narrower beam.') });
  add('antenna-beamwidth', { type: 'gainFreq', title: 'Beamwidth ↔ gain', caption: 'Narrow beams come from large apertures.', explain: EX('The same aperture that narrows the beam is what raises the gain.') });
  add('antenna-types', { type: 'polarPattern', N: 6, title: 'Array pattern up close', caption: 'Steer and shape an array beam.', explain: EX('Phased arrays are the modern antenna type — electronically steered, as shown here.') });

  // ---- Information theory ----
  add('shannon', { type: 'entropyCoding', title: 'Source entropy', caption: 'Entropy sets the compression side of the theory.', explain: EX('Shannon’s theory has two halves: capacity (the channel) and entropy (the source shown here).') });
  add('source-coding', { type: 'capacity', title: 'The channel side', caption: 'Compression pairs with channel capacity.', explain: EX('Source coding removes redundancy; capacity then says how fast the cleaned bits can be sent.') });

  // ---- Round 10: new topics ----
  add('am', { type: 'spectrumBuilder', title: 'AM sidebands', caption: 'AM creates a carrier plus two sidebands.', explain: EX('AM places the message as two mirror-image sidebands around the carrier, spanning 2·fm of bandwidth.') });
  add('fm', { type: 'spectrumBuilder', title: 'FM has many sidebands', caption: 'FM spreads into multiple Bessel sidebands.', explain: EX('Unlike AM’s two sidebands, FM generates a whole family of sidebands — the wider spectrum Carson’s rule estimates.') });
  add('qpsk', { type: 'berCurve', series: [{ name: 'bpsk' }], title: 'QPSK BER = BPSK BER', caption: 'Per bit, QPSK matches BPSK.', explain: EX('QPSK carries twice the bits in the same band yet has the same per-bit error rate as BPSK — a rare free lunch.') });
  add('rrc-filter', { type: 'eyeDiagram', title: 'RRC opens the eye', caption: 'Matched RRC filtering yields a clean eye.', explain: EX('With RRC at both ends the eye opens wide and the sampling instant is ISI-free.') });
  add('bandwidth', { type: 'sincFunction', title: 'Time-bandwidth duality', caption: 'Narrow in time ⇄ wide in frequency.', explain: EX('A short pulse needs a wide bandwidth and vice-versa — you cannot be narrow in both at once.') });
  add('early-late-correlator', { type: 'autocorr', title: 'The code correlation it tracks', caption: 'The sharp PN peak the gates straddle.', explain: EX('The early/late gates sit either side of this correlation peak; keeping them balanced locks the timing.') });
  add('polarization', { type: 'emWave', title: 'The wave whose E-field it describes', caption: 'Polarization is the orientation of E.', explain: EX('Polarization simply asks: as this wave goes by, which way does the electric field point (and does it rotate)?') });

  // ---- Round 11: guarantee every topic has >=3 diagrams (a third figure each) ----
  add('fourier-transform', { type: 'fftDemo', title: 'The FFT computes it fast', caption: 'The FFT is the practical Fourier transform.', explain: EX('The FFT is just a fast way to compute this same transform on sampled data.') });
  add('laplace-transform', { type: 'pllStep', title: 'A transfer function in action', caption: 'A 2nd-order H(s) response.', explain: EX('This settling response is exactly what a Laplace transfer function H(s) predicts in the time domain.') });
  add('z-transform', { type: 'iirResponse', title: 'A digital filter H(z)', caption: 'Digital filters live in the z-domain.', explain: EX('An IIR filter is designed and analysed entirely with the z-transform — its poles set its behaviour.') });
  add('convolution', { type: 'matchedFilter', title: 'Convolution in a receiver', caption: 'Filtering IS convolution with h(t).', explain: EX('Passing a signal through a filter is convolving it with the filter’s impulse response — here, a matched filter.') });
  add('correlation', { type: 'autocorr', title: 'Autocorrelation', caption: 'A signal correlated with itself.', explain: EX('Autocorrelation (a signal vs a shifted copy of itself) reveals its structure and underlies the PSD.') });
  add('nyquist-sampling', { type: 'sincFunction', title: 'Sinc reconstruction', caption: 'Samples are rebuilt with sinc pulses.', explain: EX('Perfect reconstruction sums a sinc at every sample — the mathematical heart of the sampling theorem.') });
  add('aliasing', { type: 'samplingDemo', title: 'Sampling done right', caption: 'Enough samples avoids aliasing.', explain: EX('Aliasing is what sampling below the Nyquist rate causes — sample fast enough and it disappears.') });
  add('pulse-shaping', { type: 'sincFunction', title: 'The ideal (sinc) pulse', caption: 'Nyquist pulses are sinc-based.', explain: EX('The zero-ISI ideal is the sinc pulse; raised-cosine is a practical, less-ringy version of it.') });
  add('eye-diagram', { type: 'berCurve', title: 'A closing eye means errors', caption: 'Eye closure raises the error rate.', explain: EX('When noise and ISI shut the eye, decisions fail — you slide up this bit-error-rate curve.') });
  add('ber', { type: 'eyeDiagram', title: 'Errors seen in the eye', caption: 'A shut eye is a high BER.', explain: EX('The eye diagram is the physical picture of why the BER rises — the 1s and 0s stop being separable.') });
  add('eb-no', { type: 'constellation', order: 4, snr: 12, title: 'Eb/N0 shapes the constellation', caption: 'Lower Eb/N0 = fuzzier points.', explain: EX('Eb/N0 controls how tight the received points are; too low and the clouds merge into errors.') });
  add('processing-gain', { type: 'jammingMargin', title: 'It becomes anti-jam margin', caption: 'Processing gain buys jamming margin.', explain: EX('Processing gain is what you spend as jamming margin — the two are directly linked.') });
  add('jamming-margin', { type: 'hopping', title: 'Hopping is another anti-jam trick', caption: 'Frequency hopping also fights jammers.', explain: EX('Besides spreading gain, hopping dodges a jammer in time — another route to jamming margin.') });
  add('sensitivity', { type: 'friisNF', title: 'Noise figure sets the floor', caption: 'NF (via the LNA) drives sensitivity.', explain: EX('Sensitivity depends on noise figure, which the first-stage LNA dominates per Friis.') });
  add('shannon', { type: 'berCurve', title: 'Real schemes approach the limit', caption: 'Capacity is the ceiling; BER is reality.', explain: EX('A real link’s BER curve shows how close practical coding gets to Shannon’s theoretical ceiling.') });
  add('source-coding', { type: 'quantize', title: 'Lossy source coding', caption: 'Quantization is lossy compression.', explain: EX('Rounding a signal to N bits is lossy source coding — trading fidelity for fewer bits.') });
  add('sinc-function', { type: 'raisedCosine', title: 'Sinc → raised cosine', caption: 'A gentler, practical relative.', explain: EX('The raised-cosine pulse is a windowed, less-ringy cousin of the ideal sinc.') });
  add('frequency-spectrum', { type: 'fourierTransform', title: 'Spectra come from Fourier', caption: 'The transform builds the spectrum.', explain: EX('Adding sine harmonics (and reading their amplitudes) is exactly what makes a spectrum.') });
  add('fft', { type: 'spectrumBuilder', title: 'What the FFT reveals', caption: 'The FFT exposes the component tones.', explain: EX('The FFT’s output is this spectrum — the list of tones hiding in the signal.') });
  add('fir-filters', { type: 'convolutionDemo', title: 'An FIR filter is a convolution', caption: 'FIR output = input ∗ taps.', explain: EX('An FIR filter literally convolves the input with its tap sequence — this is that operation.') });
  add('convolutional-codes', { type: 'shiftReg', title: 'The encoder', caption: 'A shift register with XOR taps.', explain: EX('A convolutional encoder is this little shift register; each input bit yields several XOR-tapped output bits.') });
  add('channel-coding', { type: 'shiftReg', title: 'A convolutional encoder', caption: 'How redundancy is generated.', explain: EX('One common channel coder is this convolutional encoder — redundancy woven in by XOR taps.') });
  add('am', { type: 'fmWave', title: 'Compare with FM', caption: 'AM varies amplitude; FM varies frequency.', explain: EX('Side by side with FM: AM puts the message in the height, FM puts it in the pitch.') });
  add('fm', { type: 'amWave', title: 'Compare with AM', caption: 'FM varies frequency; AM varies amplitude.', explain: EX('Compared with AM’s changing height, FM keeps constant height and changes the cycle spacing.') });
  add('qpsk', { type: 'matchedFilter', title: 'Detection per branch', caption: 'Each I/Q branch is matched-filtered.', explain: EX('QPSK’s I and Q arms are each detected by a matched filter, like two BPSK receivers.') });
  add('rrc-filter', { type: 'sincFunction', title: 'The Nyquist sinc it approximates', caption: 'RRC×RRC → a sinc-like zero-ISI pulse.', explain: EX('The cascade approaches the ideal sinc’s zero-ISI property with far gentler tails.') });
  add('bandwidth', { type: 'fftDemo', title: 'Measuring bandwidth from a spectrum', caption: 'Bandwidth is read off the FFT.', explain: EX('In practice you measure a signal’s bandwidth straight from its FFT spectrum.') });
  add('early-late-correlator', { type: 'pllStep', title: 'The tracking loop', caption: 'The DLL is a loop, like a PLL.', explain: EX('The early-late discriminator drives a loop that settles just like a PLL — here is that loop response.') });
  add('polarization', { type: 'polarPattern', title: 'Antennas radiate a polarization', caption: 'Pattern and polarization together.', explain: EX('An antenna’s radiation pattern comes with a polarization — the two describe how it launches the wave.') });
})();
