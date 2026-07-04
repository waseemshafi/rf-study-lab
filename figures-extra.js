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
})();
