// Interfaces & Protocols: serial standards RS-232, RS-422, RS-485, LVDS
CONTENT.topics.push(
  {
    id: 'rs232',
    title: 'RS-232',
    category: 'Interfaces & Protocols',
    tags: ['rs232', 'serial', 'single-ended', 'uart', 'tia-232', 'async', '8n1', 'point-to-point'],
    summary: String.raw`RS-232 (TIA/EIA-232) is a single-ended, bipolar-voltage, point-to-point asynchronous serial interface that swings roughly $\pm 3$ to $\pm 15$ V about a common ground, reaching about 15 m at rates up to ~115–230 kbps using NRZ 8N1 framing.`,
    diagram: [{ svg: String.raw`<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-rs232" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="20" y="55" width="150" height="110" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="95" y="80" fill="#e6edf3" text-anchor="middle" font-weight="bold">DTE (PC)</text>
<text x="95" y="96" fill="#9aa7b5" text-anchor="middle" font-size="10">terminal / UART</text>
<rect x="370" y="55" width="150" height="110" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="445" y="80" fill="#e6edf3" text-anchor="middle" font-weight="bold">DCE (modem)</text>
<text x="445" y="96" fill="#9aa7b5" text-anchor="middle" font-size="10">peer device</text>
<line x1="170" y1="78" x2="370" y2="78" stroke="#4dabf7" marker-end="url(#arr-rs232)"/>
<text x="270" y="73" fill="#e6edf3" text-anchor="middle" font-size="10">TxD &#8594; RxD</text>
<line x1="370" y1="100" x2="170" y2="100" stroke="#63e6be" marker-end="url(#arr-rs232)"/>
<text x="270" y="95" fill="#e6edf3" text-anchor="middle" font-size="10">RxD &#8592; TxD</text>
<line x1="170" y1="122" x2="370" y2="122" stroke="#ffa94d" marker-end="url(#arr-rs232)"/>
<text x="270" y="117" fill="#e6edf3" text-anchor="middle" font-size="10">RTS &#8594; / &#8592; CTS</text>
<line x1="170" y1="150" x2="370" y2="150" stroke="#9aa7b5"/>
<text x="270" y="145" fill="#9aa7b5" text-anchor="middle" font-size="10">GND (common return)</text>
<text x="270" y="200" fill="#9aa7b5" text-anchor="middle" font-size="10">single-ended, referenced to shared ground &#183; point-to-point</text>
</svg>`, caption: String.raw`RS-232: two devices (DTE&#8596;DCE) linked point-to-point by single-ended TxD/RxD/RTS/CTS lines all referenced to one shared GND.` },
      { title: String.raw`UART internals: parallel byte to serial frame`, svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-rs232" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="20" y="30" width="120" height="70" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="80" y="55" fill="#e6edf3" text-anchor="middle" font-weight="bold" font-size="11">Tx holding reg</text>
<text x="80" y="72" fill="#9aa7b5" text-anchor="middle" font-size="9">parallel byte D7..D0</text>
<text x="80" y="88" fill="#63e6be" text-anchor="middle" font-size="9">8 bits wide</text>
<rect x="210" y="30" width="130" height="70" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="275" y="55" fill="#e6edf3" text-anchor="middle" font-weight="bold" font-size="11">Shift register</text>
<text x="275" y="72" fill="#9aa7b5" text-anchor="middle" font-size="9">LSB-first, 1 bit/clk</text>
<text x="275" y="88" fill="#9aa7b5" text-anchor="middle" font-size="9">out the serial pin</text>
<rect x="210" y="130" width="130" height="52" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="275" y="152" fill="#e6edf3" text-anchor="middle" font-size="11">Baud generator</text>
<text x="275" y="168" fill="#9aa7b5" text-anchor="middle" font-size="9">f_clk / (16&#215;N)</text>
<rect x="410" y="30" width="115" height="70" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="467" y="55" fill="#e6edf3" text-anchor="middle" font-weight="bold" font-size="11">Level shifter</text>
<text x="467" y="72" fill="#9aa7b5" text-anchor="middle" font-size="9">TTL &#8594; &#177;V</text>
<text x="467" y="88" fill="#63e6be" text-anchor="middle" font-size="9">MAX232</text>
<line x1="140" y1="65" x2="210" y2="65" stroke="#9aa7b5" marker-end="url(#arr2-rs232)"/>
<text x="175" y="58" fill="#9aa7b5" text-anchor="middle" font-size="9">load</text>
<line x1="340" y1="65" x2="410" y2="65" stroke="#9aa7b5" marker-end="url(#arr2-rs232)"/>
<text x="375" y="58" fill="#9aa7b5" text-anchor="middle" font-size="9">serial</text>
<line x1="275" y1="130" x2="275" y2="100" stroke="#ffa94d" marker-end="url(#arr2-rs232)"/>
<text x="330" y="120" fill="#ffa94d" text-anchor="middle" font-size="9">clocks shifts</text>
<rect x="20" y="205" width="505" height="34" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="272" y="220" fill="#e6edf3" text-anchor="middle" font-size="10">on the wire: START(0) &#183; D0 D1 D2 D3 D4 D5 D6 D7 &#183; [PAR] &#183; STOP(1)</text>
<text x="272" y="233" fill="#9aa7b5" text-anchor="middle" font-size="9">10 bit-times for 8N1; idle line = MARK (&#8722;V)</text>
</svg>`, caption: String.raw`UART transmit path: a parallel byte is loaded into a shift register, clocked out LSB-first at the baud rate (f_clk/16N), wrapped in start/data/parity/stop bits, and level-shifted to &#177;V by a MAX232-class driver.` },
      { title: String.raw`RTS/CTS hardware flow-control handshake`, svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-rs232" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="30" y="55" width="150" height="100" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="105" y="82" fill="#e6edf3" text-anchor="middle" font-weight="bold">Sender</text>
<text x="105" y="100" fill="#9aa7b5" text-anchor="middle" font-size="9">wants to transmit</text>
<rect x="360" y="55" width="150" height="100" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="435" y="82" fill="#e6edf3" text-anchor="middle" font-weight="bold">Receiver</text>
<text x="435" y="100" fill="#9aa7b5" text-anchor="middle" font-size="9">buffer may fill</text>
<line x1="180" y1="78" x2="360" y2="78" stroke="#ffa94d" marker-end="url(#arr3-rs232)"/>
<text x="270" y="72" fill="#ffa94d" text-anchor="middle" font-size="10">1. RTS: &#8220;may I send?&#8221;</text>
<line x1="360" y1="105" x2="180" y2="105" stroke="#63e6be" marker-end="url(#arr3-rs232)"/>
<text x="270" y="99" fill="#63e6be" text-anchor="middle" font-size="10">2. CTS asserted: &#8220;go&#8221;</text>
<line x1="180" y1="130" x2="360" y2="130" stroke="#4dabf7" marker-end="url(#arr3-rs232)"/>
<text x="270" y="124" fill="#4dabf7" text-anchor="middle" font-size="10">3. TxD data flows</text>
<text x="270" y="150" fill="#9aa7b5" text-anchor="middle" font-size="9">4. buffer full &#8594; CTS de-asserted &#8594; sender pauses (loop)</text>
<text x="270" y="185" fill="#9aa7b5" text-anchor="middle" font-size="10">CTS low throttles the sender; CTS high resumes it &#8212; closed-loop backpressure</text>
</svg>`, caption: String.raw`RTS/CTS handshake loop: the sender raises RTS, waits for the receiver to assert CTS, then streams data; when the receiver's buffer fills it drops CTS to pause the sender, forming a closed flow-control loop.` }],
    prerequisites: ['comm-basics', 'noise', 'bandwidth'],
    intro: String.raw`<p><strong>Why RS-232 exists.</strong> In the 1960s a terminal and a modem from different manufacturers had no agreed way to exchange serial bits: what voltage means a "1", which wire carries data, how the two ends signal "ready" and "go." Every vendor pairing needed a custom cable and custom electronics. RS-232 solved that by <em>standardising the electrical interface and the wiring</em> — fixed voltage levels, named signal lines, and a common connector — so any conforming terminal could be plugged into any conforming modem and simply work. That interoperability, not raw performance, is the problem RS-232 was invented to solve, and it is why the standard still shows up wherever two boxes need a dependable short serial link.</p>
<p><strong>RS-232</strong> — formally <strong>TIA/EIA-232-F</strong> (originally EIA RS-232-C, and internationally aligned with ITU-T V.24/V.28) — is the oldest and most familiar of the serial-line standards. It was defined in the 1960s to connect <em>Data Terminal Equipment (DTE)</em> such as a terminal or PC to <em>Data Communication Equipment (DCE)</em> such as a modem. Almost every microcontroller UART, PC COM port, industrial console, GPS module, and lab instrument has spoken RS-232 at some point.</p>
<p>Three properties define RS-232 and explain both its ubiquity and its limits. First, it is <strong>single-ended</strong>: each signal is one wire referenced to a shared ground, so noise picked up on the wire is measured directly against that ground with no cancellation. Second, it uses <strong>large bipolar voltages</strong> (nominally $\pm 5$ to $\pm 12$ V in practice, legal from $\pm 3$ up to $\pm 15$ V) with an unusual <em>inverted</em> logic convention. Third, it is fundamentally a <strong>point-to-point, full-duplex</strong> link between exactly two devices — there is no bus, no addressing, and no arbitration. These choices make RS-232 trivially simple and robust for a short cable to one peer, but they cap its speed, its reach, and its ability to network many nodes.</p>`,
    sections: [
      {
        h: 'Physical and electrical layer: single-ended bipolar voltages',
        html: String.raw`<p>RS-232 transmits each logical signal on a <strong>single wire measured against a common signal ground</strong> (pin 5 on a DB-9). Because the receiver decides the bit by comparing the line voltage to that ground, it is a <em>single-ended</em> (unbalanced) interface — the exact opposite of the differential standards (RS-422/485, LVDS) covered later.</p>
<p>The voltage convention is deliberately generous to survive resistive cable drops and to give large noise margins on short cables:</p>
<table class="data">
<tr><th>Quantity</th><th>Driver (transmit) output</th><th>Receiver (input) threshold</th></tr>
<tr><td>Logic 0 / SPACE / "ON" control</td><td>$+5$ to $+15$ V</td><td>$> +3$ V</td></tr>
<tr><td>Logic 1 / MARK / "OFF" control</td><td>$-5$ to $-15$ V</td><td>$< -3$ V</td></tr>
<tr><td>Undefined ("dead zone")</td><td>—</td><td>$-3$ V to $+3$ V</td></tr>
</table>
<p>Note the <strong>inverted, bipolar logic</strong>: a data <em>MARK</em> (logic 1, the idle state) is a <em>negative</em> voltage, and a <em>SPACE</em> (logic 0) is <em>positive</em>. The driver must supply at least $\pm 5$ V; the standard guarantees the receiver decides correctly with $\ge \pm 3$ V, leaving at least a 2 V margin for cable loss. The $\pm 3$ V band around ground is a forbidden transition region. A chip such as the MAX232 exists precisely to generate the required negative and elevated positive rails from a single $+5$ V (or $+3.3$ V) supply using charge pumps.</p>
<div class="callout"><strong>Why so much voltage?</strong> The wide $\pm(5\!-\!15)$ V swing is what buys RS-232 its noise immunity <em>despite</em> being single-ended: a several-volt transition is hard to corrupt on a short cable. But that same large swing, driven into cable capacitance, is exactly what limits speed and distance — slewing $\pm 12$ V through many nF of cable is slow.</div>
<p>The standard also bounds the driver slew rate (to control crosstalk) to $\le 30$ V/µs and specifies a driver output impedance and a receiver input resistance of 3–7 kΩ.</p>`
      },
      {
        h: 'Signaling, encoding and the idle state',
        html: String.raw`<p>RS-232 data uses <strong>NRZ (Non-Return-to-Zero)</strong> line coding: the voltage simply holds at the mark or space level for the whole bit period; there is no return to zero between bits and <em>no separate clock line</em>. The idle (no data) line sits in the <strong>MARK</strong> state, i.e. a steady negative voltage (logic 1). This idle-high convention is what lets a receiver detect the beginning of a character: the first thing a transmitter does to send a byte is pull the line to SPACE (positive), creating the <em>start bit</em>.</p>
<p>Because there is no clock wire, RS-232 is <strong>asynchronous</strong>: transmitter and receiver each run their own local clock at an agreed baud rate, and the receiver re-synchronises on every character using the start-bit edge (see clocking section). Control/handshake lines (RTS, CTS, DTR, DSR, DCD, RI) use the same voltage convention but are level signals, where a positive voltage means the "ON"/asserted state.</p>
<p>One special line condition is worth naming: the <strong>BREAK condition</strong>. A BREAK is a deliberate <em>SPACE (logic 0, positive) held continuously for longer than one full character time</em> — i.e. the line stays in the start-bit polarity past the point where a stop bit (MARK) should have appeared. Because a valid frame must return to MARK for its stop bit, a receiver detects this as a <strong>framing error whose data reads all-zeros</strong>, and UARTs flag it as a distinct "break received" status. BREAK is an out-of-band signal, not a data byte: it is historically used to get a remote's attention, to force a terminal into a command/interrupt state (the classic terminal "send break"), for wake-up/reset signalling, and as a bus-idle/attention marker in some protocols (e.g. the SYNC-break that opens an LIN frame on the automotive LIN bus, which is UART-based). The transmitter asserts BREAK by holding the SPACE level for a programmed number of bit-times (often 1–2 character times) and then releasing the line back to idle MARK.</p>`
      },
      {
        h: 'Frame format: start / data / parity / stop (8N1)',
        html: String.raw`<p>Data is sent one <strong>character at a time</strong>, each wrapped in a self-delimiting frame. The canonical format is written like <strong>8N1</strong> = 8 data bits, No parity, 1 stop bit. A frame consists of:</p>
<ul>
<li><strong>Start bit (1 bit):</strong> a single SPACE (logic 0) that breaks the idle MARK and tells the receiver "a character is coming — synchronise now." Its falling edge is the timing reference for the whole frame.</li>
<li><strong>Data bits (5–8, usually 8):</strong> sent <em>LSB first</em>.</li>
<li><strong>Parity bit (0 or 1):</strong> optional even/odd parity for a crude single-bit error check.</li>
<li><strong>Stop bit(s) (1, 1.5, or 2):</strong> the line returns to MARK for at least one bit time, guaranteeing an idle interval and a fresh falling edge for the next start bit.</li>
</ul>
<p>Field-by-field, the UART character frame is:</p>
<table class="data">
<tr><th>Field</th><th>Width</th><th>Value / order</th><th>Meaning</th></tr>
<tr><td>Start</td><td>1 bit</td><td>SPACE (0)</td><td>Breaks idle MARK; its falling edge is the frame timing reference</td></tr>
<tr><td>Data</td><td>5–9 bits (usually 8)</td><td>LSB first</td><td>The payload character</td></tr>
<tr><td>Parity</td><td>0 or 1 bit</td><td>none / even / odd</td><td>Optional single-bit error check over the data bits</td></tr>
<tr><td>Stop</td><td>1, 1.5, or 2 bits</td><td>MARK (1)</td><td>Returns line to idle; guarantees a fresh start edge for the next frame</td></tr>
</table>
<p>So an 8N1 character occupies <strong>10 bit-times to carry 8 payload bits</strong> — 1 start + 8 data + 1 stop. That framing overhead is the origin of the classic "divide baud by 10 to get bytes/s" rule and of the 80% efficiency figure derived below. With 8E1 (even parity) or 7E1 the overhead grows and efficiency drops.</p>
<div class="callout"><strong>Rule of thumb:</strong> for 8N1, <em>maximum characters per second $\approx$ baud rate / 10</em>. At 9600 baud that is 960 bytes/s; at 115200 baud, ~11.5 kB/s.</div>`
      },
      {
        h: 'Clocking and synchronization: asynchronous, mid-bit sampling',
        html: String.raw`<p>RS-232 sends <em>no clock</em>. Instead the receiver's UART oversamples the line, typically at <strong>16× the baud rate</strong>. The mechanism:</p>
<ul>
<li>The line idles at MARK. The UART watches for the <strong>falling edge</strong> of the start bit.</li>
<li>Having found it, the UART waits half a bit time and samples again to confirm the start bit is still SPACE (rejects noise glitches).</li>
<li>It then samples <strong>at the centre of each subsequent bit</strong> (every 16 clocks) — mid-bit sampling maximises the margin against edge jitter and clock mismatch.</li>
<li>After the last data/parity bit it checks the stop bit is MARK; if not, it flags a <em>framing error</em>.</li>
</ul>
<p>Because each character re-synchronises on its own start bit, the two clocks only have to stay aligned for the ~10 bits of one frame. This tolerates a fair clock mismatch: the accumulated timing error at the last (stop) bit must stay within about half a bit. Practically the combined transmitter+receiver baud error should be under roughly <strong>$\pm 2\%$</strong> (often quoted as ~3–5% total budget, split between the two ends), which is why UART baud generators use accurate crystals rather than RC oscillators.</p>`
      },
      {
        h: 'Baud rate, data rate and how it is set',
        html: String.raw`<p>The <strong>baud rate</strong> is the number of signalling symbols per second on the line. In RS-232 each symbol is one bit (binary NRZ, one bit per symbol), so <strong>baud = bit/s</strong> here. Standard rates form a roughly geometric ladder: 300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200 baud (and, with modern transceivers, 230400 and higher).</p>
<p>The rate is fixed by the UART's internal baud-rate generator, a divider off a reference clock: $\text{baud} = f_{\text{clk}} / (16 \cdot N)$ where $N$ is the programmed divisor and 16 is the oversampling factor. The two devices must be pre-configured to the <em>same</em> baud, format, and parity — there is no auto-negotiation. A wrong baud produces garbage or framing errors.</p>
<p>The original standard only guaranteed operation to 20 kbps; real transceivers and short cables push to 115.2 kbps or 230.4 kbps, but higher rates force shorter cables (next section).</p>`
      },
      {
        h: 'Topology, duplex, cable length and the rate–length trade-off',
        html: String.raw`<p>RS-232 is strictly <strong>point-to-point</strong>: one driver and one receiver per signal, exactly two devices on the link. It is naturally <strong>full-duplex</strong> because transmit (TXD) and receive (RXD) are separate wires that can carry data simultaneously in both directions. There is no multidrop bus, no node addressing, and no way to attach a third device.</p>
<p>The classic EIA-232 spec bounded the total load capacitance at <strong>2500 pF</strong>. With typical cable at ~40–50 pF/m that works out to roughly <strong>15 m (50 ft)</strong> of cable — the number everyone remembers. In practice, low-capacitance cable at low baud can go further, and short jumpers at high baud are fine; the real limit is capacitance and slew, not a hard distance.</p>
<p>The trade-off is fundamental: driving a large $\pm 12$ V swing through cable capacitance forms an RC low-pass. As baud rises the bit period shrinks toward the RC rise time, edges round off, and the receiver mis-times its mid-bit sample. So <strong>higher baud ⇒ shorter usable cable</strong>. Because RS-232 is single-ended, it also has no common-mode rejection: any ground-potential difference between the two chassis appears directly as an offset on every signal, which further limits distance.</p>
<div class="callout"><strong>DTE/DCE and null-modem:</strong> A DTE's TXD is a DCE's RXD. Connecting two DTEs (e.g. two PCs) requires a <em>null-modem</em> cable that crosses TXD↔RXD and the handshake pairs. This DTE/DCE distinction is a frequent source of "it's plugged in but nothing works" confusion.</div>`
      },
      {
        h: 'Connectors, the standard body, and handshaking',
        html: String.raw`<p>The standard is maintained by the <strong>TIA (Telecommunications Industry Association)</strong>, current designation <strong>TIA-232-F</strong> (historically EIA RS-232-C/D/E). The original mechanical connector was the 25-pin <strong>DB-25</strong>; the PC industry popularised the 9-pin <strong>DE-9 (commonly called DB-9)</strong>, which carries the signals that matter in practice:</p>
<table class="data">
<tr><th>DB-9 pin</th><th>Signal</th><th>Direction (DTE)</th><th>Purpose</th></tr>
<tr><td>2</td><td>RXD</td><td>in</td><td>Received data</td></tr>
<tr><td>3</td><td>TXD</td><td>out</td><td>Transmitted data</td></tr>
<tr><td>5</td><td>GND</td><td>—</td><td>Signal ground (reference)</td></tr>
<tr><td>7 / 8</td><td>RTS / CTS</td><td>out / in</td><td>Hardware flow control</td></tr>
<tr><td>4 / 6</td><td>DTR / DSR</td><td>out / in</td><td>Terminal/set ready</td></tr>
<tr><td>1 / 9</td><td>DCD / RI</td><td>in / in</td><td>Carrier detect / ring indicator</td></tr>
</table>
<p>The full set of RS-232 signal lines, with direction relative to the DTE and their meaning:</p>
<table class="data">
<tr><th>Signal</th><th>Name</th><th>Direction (DTE)</th><th>Meaning</th></tr>
<tr><td>TxD</td><td>Transmit Data</td><td>out</td><td>Serial data sent by the DTE</td></tr>
<tr><td>RxD</td><td>Receive Data</td><td>in</td><td>Serial data received by the DTE</td></tr>
<tr><td>RTS</td><td>Request To Send</td><td>out</td><td>DTE asserts to request permission to transmit (flow control)</td></tr>
<tr><td>CTS</td><td>Clear To Send</td><td>in</td><td>DCE asserts to grant the DTE permission to transmit (flow control)</td></tr>
<tr><td>DTR</td><td>Data Terminal Ready</td><td>out</td><td>DTE signals it is present and ready</td></tr>
<tr><td>DSR</td><td>Data Set Ready</td><td>in</td><td>DCE signals it is present and ready</td></tr>
<tr><td>DCD</td><td>Data Carrier Detect</td><td>in</td><td>DCE has detected a carrier / valid connection</td></tr>
<tr><td>RI</td><td>Ring Indicator</td><td>in</td><td>DCE (modem) signals an incoming ring</td></tr>
<tr><td>GND</td><td>Signal Ground</td><td>—</td><td>Common voltage reference for all signals</td></tr>
</table>
<p><strong>Flow control</strong> prevents overrun. <em>Hardware</em> flow control uses RTS/CTS: the receiver de-asserts CTS to tell the transmitter to pause. <em>Software</em> flow control uses in-band XON (0x11) / XOFF (0x13) control bytes. The minimal "3-wire" RS-232 uses only TXD, RXD, and GND with no handshaking.</p>`
      },
      {
        h: 'Noise immunity, use cases, pros/cons and comparison',
        html: String.raw`<p>RS-232's single-ended nature is its Achilles' heel for noise. There is <strong>no common-mode rejection</strong>: ground bounce, ground loops, and induced interference on the wire all appear directly at the receiver. Its only defence is the large voltage swing, which gives good margins over a <em>short</em> cable but does nothing about ground-offset over a long one. This is exactly why the differential standards were invented.</p>
<p><strong>Use cases:</strong> device consoles and serial terminals, legacy modems, GPS/GNSS module output (NMEA), lab instruments (SCPI over serial), industrial equipment configuration ports, embedded debug UARTs (usually at TTL/3.3 V levels, converted to true RS-232 by a MAX232), and point-of-sale/barcode peripherals.</p>
<p><strong>Pros:</strong> dead simple, universally supported, no clock wire, robust over short cables, cheap. <strong>Cons:</strong> point-to-point only (no bus), short reach (~15 m), modest speed, no noise cancellation, requires bipolar rails, and DTE/DCE/null-modem confusion.</p>
<table class="data">
<tr><th>Property</th><th>RS-232</th><th>RS-422</th><th>RS-485</th><th>LVDS</th></tr>
<tr><td>Signaling</td><td>Single-ended</td><td>Differential</td><td>Differential</td><td>Differential (current-mode)</td></tr>
<tr><td>Voltage</td><td>$\pm 3$ to $\pm 15$ V</td><td>$\pm 2$–$6$ V diff</td><td>$\pm 1.5$–$6$ V diff</td><td>~350 mV swing, ~1.2 V CM</td></tr>
<tr><td>Drivers × receivers</td><td>1 × 1</td><td>1 × up to 10</td><td>up to 32 UL (drivers+rcvrs)</td><td>typ. 1 × 1</td></tr>
<tr><td>Topology</td><td>Point-to-point</td><td>Point-to-point / multidrop</td><td>Multidrop bus</td><td>Point-to-point</td></tr>
<tr><td>Duplex</td><td>Full</td><td>Full</td><td>Half or full</td><td>Simplex per pair</td></tr>
<tr><td>Max distance</td><td>~15 m</td><td>~1200 m</td><td>~1200 m</td><td>~10 m (rate-dependent)</td></tr>
<tr><td>Max rate</td><td>~115–230 kbps</td><td>10 Mbps @ 12 m</td><td>10 Mbps @ 12 m</td><td>Gbps</td></tr>
<tr><td>Standard</td><td>TIA-232</td><td>TIA-422</td><td>TIA-485</td><td>TIA/EIA-644</td></tr>
</table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">Pull the pieces together: RS-232 trades speed and reach for dead-simple, guaranteed interoperability over a short two-device link.</div>
<ul>
<li><strong>It is single-ended and bipolar.</strong> Each signal is one wire measured against a shared ground, swinging $\pm 5$–$15$ V with <em>inverted</em> logic (MARK/idle negative, SPACE positive) and a $\pm 3$ V forbidden zone.</li>
<li><strong>The big voltage is its only noise defence.</strong> With no common-mode rejection, RS-232 relies purely on a large swing over a short cable — which is also what limits speed and distance (~2500 pF ⇒ ~15 m).</li>
<li><strong>Framing is 8N1 = 10 bits per byte.</strong> Start + 8 data (LSB first) + stop gives 80% efficiency; the receiver has no clock wire, so it oversamples (16×) and re-syncs on every start bit.</li>
<li><strong>Both ends must be preset.</strong> Baud, format, and parity are agreed in advance — no auto-negotiation — and the clock-mismatch budget is only ~$\pm 2\%$.</li>
<li><strong>Topology is point-to-point, full-duplex.</strong> Exactly two devices; connecting two DTEs needs a null-modem crossover, and flow control is RTS/CTS (hardware) or XON/XOFF (software).</li>
<li><strong>Know when to leave it.</strong> For distance, noise immunity, or many nodes, step up to the differential standards (RS-422/485) or to LVDS/USB/Ethernet for speed.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`RS-232 is <strong>single-ended, bipolar, point-to-point, full-duplex, asynchronous</strong> — one driver and one receiver per signal, referenced to a shared ground.`,
      String.raw`Logic is <strong>inverted</strong>: MARK (logic 1, idle) is <em>negative</em> ($-5$ to $-15$ V); SPACE (logic 0) is <em>positive</em> ($+5$ to $+15$ V); $\pm 3$ V is a forbidden zone.`,
      String.raw`Receiver threshold is $\pm 3$ V; drivers must produce $\ge \pm 5$ V, leaving margin for cable loss.`,
      String.raw`Line coding is <strong>NRZ</strong> with no clock line; the receiver oversamples (typically 16×) and re-synchronises on each start bit.`,
      String.raw`Framing is start + data + optional parity + stop; <strong>8N1 = 10 bits per 8-bit byte ⇒ 80% efficiency</strong>.`,
      String.raw`Baud = bit rate here (1 bit/symbol); both ends must be preset to the same baud/format — there is no auto-negotiation.`,
      String.raw`Cable is limited to ~<strong>2500 pF ⇒ ~15 m</strong>; higher baud forces shorter cable (RC rise-time limit).`,
      String.raw`No common-mode rejection — ground-offset and induced noise hit the receiver directly; long/noisy runs need RS-422/485 instead.`,
      String.raw`Standard body is the <strong>TIA (TIA-232-F)</strong>; connectors are DB-25 and the common DE-9 ("DB-9"); ITU-T V.24/V.28 align internationally.`,
      String.raw`DTE↔DCE: connecting two DTEs needs a <strong>null-modem</strong> cable that swaps TXD/RXD.`,
      String.raw`Flow control: hardware (RTS/CTS) or software (XON/XOFF); minimal link is 3-wire (TXD, RXD, GND).`,
      String.raw`Clock-mismatch budget: combined baud error must stay under ~$\pm 2\%$ so the stop bit is still sampled correctly.`,
      String.raw`A <strong>BREAK condition</strong> is a continuous SPACE (logic 0) held longer than one character time; the receiver flags it as a framing error with all-zero data — used as an out-of-band attention/wake signal (e.g. LIN SYNC-break), not a data byte.`
    ],
    equations: [
      {
        title: 'Bit time from baud rate',
        tex: String.raw`$$T_b = \frac{1}{R_b}$$`,
        derivation: String.raw`<p><b>Where we start.</b> Baud rate $R_b$ is defined as the number of signalling symbols sent per second. In RS-232 the line is binary NRZ, so one symbol carries exactly one bit and baud equals bit/s.</p>
<p><b>Step 1 — invert the rate.</b> If $R_b$ bits pass every second, then the time occupied by one bit is simply the reciprocal:</p>
$$T_b = \frac{1}{R_b}.$$
<p>The units check: $\text{s} = 1/(\text{bit/s})$ per bit.</p>
<p><b>Result.</b> $$T_b = \frac{1}{R_b}.$$ Sanity check: at 9600 baud, $T_b = 1/9600 \approx 104.2\ \mu\text{s}$ per bit. A UART oversampling at 16× therefore samples every $T_b/16 \approx 6.5\ \mu\text{s}$.</p>`
      },
      {
        title: 'Frame time for one character (8N1)',
        tex: String.raw`$$T_{\text{frame}} = N_{\text{frame}}\,T_b = (1 + N_d + N_p + N_s)\,T_b$$`,
        derivation: String.raw`<p><b>Where we start.</b> Each RS-232 character is self-delimited by a start bit and stop bit(s), with the data (and optional parity) in between. Count the total bits on the wire, not just the payload.</p>
<p><b>Step 1 — tally the bits.</b> One start bit, $N_d$ data bits (usually 8), $N_p$ parity bits (0 or 1), and $N_s$ stop bits (1, 1.5, or 2):</p>
$$N_{\text{frame}} = 1 + N_d + N_p + N_s.$$
<p><b>Step 2 — multiply by the bit time.</b> Every bit occupies $T_b = 1/R_b$, so the whole frame lasts</p>
$$T_{\text{frame}} = N_{\text{frame}}\,T_b = \frac{N_{\text{frame}}}{R_b}.$$
<p><b>Result.</b> For 8N1, $N_{\text{frame}} = 1 + 8 + 0 + 1 = 10$, so $$T_{\text{frame}} = \frac{10}{R_b}.$$ Sanity check: at 9600 baud a byte takes $10/9600 \approx 1.04$ ms, hence ~960 characters/s.</p>`
      },
      {
        title: 'Framing efficiency and throughput',
        tex: String.raw`$$\eta = \frac{N_d}{N_{\text{frame}}}, \qquad R_{\text{data}} = \eta\,R_b$$`,
        derivation: String.raw`<p><b>Where we start.</b> Efficiency is the fraction of on-wire bits that are actual payload. Only the $N_d$ data bits are useful; the start, parity, and stop bits are overhead.</p>
<p><b>Step 1 — form the ratio.</b> Useful bits over total bits per frame:</p>
$$\eta = \frac{N_d}{1 + N_d + N_p + N_s}.$$
<p><b>Step 2 — convert to a data rate.</b> The line runs at $R_b$ bit/s, but only fraction $\eta$ is payload, so the effective payload throughput is</p>
$$R_{\text{data}} = \eta\,R_b = \frac{N_d}{N_{\text{frame}}}\,R_b.$$
<p><b>Result.</b> For 8N1, $$\eta = \frac{8}{10} = 0.80 = 80\%,$$ so at 115200 baud the payload rate is $0.8 \times 115200 = 92.16$ kbit/s $\approx 11.5$ kB/s. Sanity check: adding parity (8E1 ⇒ 11 bits) drops $\eta$ to $8/11 \approx 73\%$, as expected since overhead grew.</p>`
      },
      {
        title: 'Cable length limit from capacitance',
        tex: String.raw`$$L_{\max} = \frac{C_{\max}}{C'}$$`,
        derivation: String.raw`<p><b>Where we start.</b> EIA-232 caps the <em>total load capacitance</em> the driver must charge at $C_{\max} = 2500$ pF, because charging capacitance through the driver's finite slew limit is what rounds off edges.</p>
<p><b>Step 1 — relate total capacitance to length.</b> A cable of length $L$ with per-unit capacitance $C'$ (farads per metre) presents $C = C' L$. Setting this equal to the maximum allowed:</p>
$$C' L_{\max} = C_{\max}.$$
<p><b>Step 2 — solve for length.</b></p>
$$L_{\max} = \frac{C_{\max}}{C'}.$$
<p><b>Result.</b> With typical $C' \approx 50$ pF/m, $$L_{\max} = \frac{2500\ \text{pF}}{50\ \text{pF/m}} = 50\ \text{m}\ \text{(theoretical)},$$ but the practical, conservative figure is the well-known <strong>~15 m</strong> once slew, ground offset, and margin are included. Sanity check: lower-capacitance cable (25 pF/m) doubles the reach, confirming capacitance — not a hard distance — is the true limit.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Is RS-232 single-ended or differential?`, back: String.raw`Single-ended (unbalanced): each signal is one wire referenced to a common ground, with no noise cancellation.` },
      { front: String.raw`What voltage represents a logic 1 (MARK) in RS-232?`, back: String.raw`A <em>negative</em> voltage, $-5$ to $-15$ V. RS-232 uses inverted logic; MARK/idle is negative, SPACE (logic 0) is positive.` },
      { front: String.raw`What is the receiver decision threshold?`, back: String.raw`$> +3$ V = SPACE (0); $< -3$ V = MARK (1); the band $-3$ V to $+3$ V is an undefined transition region.` },
      { front: String.raw`Decode "8N1".`, back: String.raw`8 data bits, No parity, 1 stop bit. With the start bit, the frame is 10 bits long to carry 8 payload bits.` },
      { front: String.raw`What is the framing efficiency of 8N1?`, back: String.raw`$8/10 = 80\%$. Ten bits on the wire carry eight payload bits.` },
      { front: String.raw`Does RS-232 have a clock line?`, back: String.raw`No. It is asynchronous; the receiver oversamples (typically 16×) and re-synchronises on each start bit's falling edge.` },
      { front: String.raw`Where does the receiver sample each bit?`, back: String.raw`At the <em>centre</em> of the bit (mid-bit sampling) to maximise margin against edge jitter and clock mismatch.` },
      { front: String.raw`Approximate maximum cable length and why?`, back: String.raw`~15 m, set by the 2500 pF total-capacitance limit (edges round off as cable capacitance grows).` },
      { front: String.raw`What topology and duplex does RS-232 support?`, back: String.raw`Point-to-point (exactly two devices), full-duplex (separate TXD and RXD wires).` },
      { front: String.raw`What is the standard's official designation and connectors?`, back: String.raw`TIA-232-F (formerly EIA RS-232). Connectors: DB-25 and the common DE-9 ("DB-9"). ITU-T V.24/V.28 align internationally.` },
      { front: String.raw`What is a null-modem cable?`, back: String.raw`A cable that crosses TXD↔RXD (and handshake pairs) so two DTE devices (e.g. two PCs) can talk directly.` },
      { front: String.raw`Name the two kinds of flow control.`, back: String.raw`Hardware (RTS/CTS lines) and software (in-band XON/XOFF bytes, 0x11/0x13).` },
      { front: String.raw`What is a BREAK condition in RS-232?`, back: String.raw`A continuous SPACE (logic 0, positive) held for longer than one full character time, so the expected stop-bit MARK never appears. The receiver reports it as a framing error with all-zero data — an out-of-band attention/wake signal, not a data byte.` },
      { front: String.raw`Why does RS-232 use such large voltages?`, back: String.raw`Large swing gives good noise margin on short cables (its only defence, since it has no common-mode rejection), but the swing into cable capacitance is what limits speed/distance.` },
      { front: String.raw`How is baud rate generated in a UART?`, back: String.raw`By dividing a reference clock: $\text{baud} = f_{\text{clk}}/(16 N)$, with 16× oversampling and programmable divisor $N$.` }
    ],
    mcqs: [
      { q: String.raw`In RS-232, an idle line (no data) sits at:`, options: [String.raw`0 V (ground)`, String.raw`a negative voltage (MARK)`, String.raw`a positive voltage (SPACE)`, String.raw`a floating high impedance`], answer: 1, explain: String.raw`The idle state is MARK = logic 1 = a steady negative voltage. The first start bit pulls the line positive (SPACE).` },
      { q: String.raw`Which statement about RS-232 logic levels is correct?`, options: [String.raw`Positive voltage = logic 1`, String.raw`Negative voltage = logic 0`, String.raw`Positive voltage = SPACE = logic 0`, String.raw`Levels are 0 V and +5 V`], answer: 2, explain: String.raw`RS-232 is inverted and bipolar: positive = SPACE = logic 0; negative = MARK = logic 1.` },
      { q: String.raw`How many bits are on the wire per character in 8N1?`, options: [String.raw`8`, String.raw`9`, String.raw`10`, String.raw`11`], answer: 2, explain: String.raw`1 start + 8 data + 0 parity + 1 stop = 10 bits.` },
      { q: String.raw`The 8N1 framing efficiency is:`, options: [String.raw`100%`, String.raw`90%`, String.raw`80%`, String.raw`73%`], answer: 2, explain: String.raw`$8$ payload bits out of $10$ total $= 80\%$.` },
      { q: String.raw`RS-232 is fundamentally which topology?`, options: [String.raw`Multidrop bus`, String.raw`Point-to-point`, String.raw`Ring`, String.raw`Star`], answer: 1, explain: String.raw`Exactly one driver and one receiver per signal — two devices only, no bus.` },
      { q: String.raw`The ~15 m cable-length limit is primarily set by:`, options: [String.raw`Total load capacitance (~2500 pF)`, String.raw`Wire resistance`, String.raw`Signal ground current`, String.raw`FCC regulation`], answer: 0, explain: String.raw`The standard caps total capacitance at 2500 pF; at ~50 pF/m that is roughly 15 m in practice.` },
      { q: String.raw`Why does higher baud rate reduce usable cable length?`, options: [String.raw`Wire heats up`, String.raw`RC of the cable rounds edges until mid-bit timing fails`, String.raw`Parity errors increase`, String.raw`Ground voltage rises`], answer: 1, explain: String.raw`Cable capacitance forms an RC low-pass; as bit time shrinks toward the rise time, edges round off and sampling mis-times.` },
      { q: String.raw`A receiver reads $+8$ V on RXD. This is:`, options: [String.raw`MARK (logic 1)`, String.raw`SPACE (logic 0)`, String.raw`Undefined`, String.raw`A fault`], answer: 1, explain: String.raw`$> +3$ V is SPACE = logic 0.` },
      { q: String.raw`RS-232 achieves noise immunity mainly by:`, options: [String.raw`Differential cancellation`, String.raw`Large voltage swing on short cables`, String.raw`Twisted-pair termination`, String.raw`Common-mode rejection`], answer: 1, explain: String.raw`Being single-ended, it has no common-mode rejection; its only defence is the big $\pm(5\!-\!15)$ V swing over a short cable.` },
      { q: String.raw`Connecting two PCs (both DTE) directly requires:`, options: [String.raw`A straight-through cable`, String.raw`A null-modem cable`, String.raw`A terminator`, String.raw`Nothing special`], answer: 1, explain: String.raw`Two DTEs both transmit on TXD; a null-modem cable crosses TXD↔RXD so each hears the other.` },
      { q: String.raw`Which chip is commonly used to make true RS-232 levels from a single +5 V rail?`, options: [String.raw`74LS00`, String.raw`MAX232`, String.raw`LM317`, String.raw`ULN2003`], answer: 1, explain: String.raw`The MAX232 uses charge pumps to generate the negative and elevated positive rails RS-232 needs.` },
      { q: String.raw`XON/XOFF is an example of:`, options: [String.raw`Hardware flow control`, String.raw`Software (in-band) flow control`, String.raw`Parity checking`, String.raw`Baud negotiation`], answer: 1, explain: String.raw`XON (0x11)/XOFF (0x13) are in-band control bytes — software flow control. RTS/CTS is hardware flow control.` },
      { q: String.raw`An RS-232 BREAK condition is:`, options: [String.raw`A single stop bit`, String.raw`A continuous SPACE held longer than one character time`, String.raw`A parity error`, String.raw`A negative-voltage idle`], answer: 1, explain: String.raw`BREAK holds the SPACE (logic 0) level past where a stop-bit MARK should appear, so the receiver sees a framing error with all-zero data — an out-of-band attention/wake signal.` }
    ],
    numericals: [
      { q: String.raw`At 19200 baud with 8N1 framing, how long does it take to transmit a 100-byte message, and what is the effective payload throughput?`, solution: String.raw`<p><b>Formula.</b> Total transmit time is the on-wire bit count divided by the baud rate, and effective payload rate is the framing efficiency times the baud rate: $$t = \frac{N_{\text{bytes}}\,N_{\text{frame}}}{R_b}, \qquad R_{\text{data}} = \eta\,R_b = \frac{N_d}{N_{\text{frame}}}\,R_b$$ where $N_{\text{bytes}}$ is the message length, $N_{\text{frame}}=10$ bits per 8N1 character, $R_b$ the baud rate, $N_d=8$ data bits, and $\eta$ the efficiency.</p>
<p><b>Substitute.</b> $$t = \frac{100 \times 10}{19200}, \qquad R_{\text{data}} = \frac{8}{10}\times 19200$$</p>
<p><b>Compute.</b> On-wire bits $=100\times10 = 1000$; $t = 1000/19200 = 0.05208\ \text{s} = 52.08$ ms. Payload rate $= 0.8\times19200 = 15360$ bit/s $= 1920$ bytes/s.</p>
<p><b>Explanation.</b> A 100-byte message clears in about 52 ms at 19.2 kbaud. Cross-check: $100\ \text{bytes}/1920\ \text{B/s} = 52.08$ ms — the two routes agree. The 80% efficiency (2 of every 10 bits are start/stop overhead) is why the payload rate sits below the raw baud.</p>` },
      { q: String.raw`A link uses 115200 baud, 8E1 (8 data, even parity, 1 stop). Find the frame length, efficiency, and payload rate.`, solution: String.raw`<p><b>Formula.</b> $$N_{\text{frame}} = 1 + N_d + N_p + N_s, \qquad \eta = \frac{N_d}{N_{\text{frame}}}, \qquad R_{\text{data}} = \eta\,R_b$$ with start bit $=1$, data $N_d$, parity $N_p$, stop $N_s$, baud $R_b$.</p>
<p><b>Substitute.</b> $$N_{\text{frame}} = 1 + 8 + 1 + 1, \qquad \eta = \frac{8}{11}, \qquad R_{\text{data}} = \frac{8}{11}\times 115200$$</p>
<p><b>Compute.</b> $N_{\text{frame}} = 11$ bits. $\eta = 8/11 = 0.7273 = 72.7\%$. $R_{\text{data}} = 0.7273\times115200 = 83{,}782$ bit/s $\approx 83.8$ kbit/s $\approx 10.5$ kB/s.</p>
<p><b>Explanation.</b> Adding the parity bit stretches the frame from 10 to 11 bits, dropping efficiency from 80% to 72.7% — about a 7-percentage-point cost. Sanity check: $83.8/115.2 = 0.727$, matching $\eta$, confirming the parity overhead directly scales the payload rate.</p>` },
      { q: String.raw`Cable capacitance is 45 pF/m. What is the theoretical maximum length under the 2500 pF limit, ignoring slew and ground offset?`, solution: String.raw`<p><b>Formula.</b> $$L_{\max} = \frac{C_{\max}}{C'}$$ where $C_{\max}=2500$ pF is the EIA-232 total-load-capacitance limit and $C'$ is the per-metre cable capacitance.</p>
<p><b>Substitute.</b> $$L_{\max} = \frac{2500\ \text{pF}}{45\ \text{pF/m}}$$</p>
<p><b>Compute.</b> $$L_{\max} = 55.6\ \text{m}.$$</p>
<p><b>Explanation.</b> Purely on the capacitance budget the cable could reach ~56 m, but the quoted practical limit is ~15 m once slew-rate rounding, ground-potential offset, and margin are folded in. Sanity check: lower-capacitance cable (e.g. 25 pF/m) would give 100 m — confirming capacitance, not a fixed distance, is the true ceiling.</p>` },
      { q: String.raw`A transmitter runs at exactly 9600 baud; a receiver's clock is 3% fast. Using 8N1, will the stop bit still be sampled correctly?`, solution: String.raw`<p><b>Formula.</b> The accumulated timing error at the last sampled bit must stay under half a bit: $$\Delta = \varepsilon \cdot n_{\text{last}} < 0.5\ \text{bit}$$ where $\varepsilon$ is the fractional clock error and $n_{\text{last}}$ the sample index (in bit-times) of the stop bit measured from the start edge.</p>
<p><b>Substitute.</b> The stop bit of a 10-bit 8N1 frame is sampled at its centre, $n_{\text{last}} \approx 9.5$ bit-times. $$\Delta = 0.03 \times 9.5$$</p>
<p><b>Compute.</b> $$\Delta = 0.285\ \text{bit} < 0.5\ \text{bit}.$$</p>
<p><b>Explanation.</b> The drift reaches only 0.285 of a bit by the stop bit, comfortably inside the $\pm0.5$-bit mid-sample window, so the frame decodes correctly (margin is tight). Sanity check: the error hits 0.5 bit at $\varepsilon = 0.5/9.5 \approx 5.3\%$, consistent with the usual "~5% total budget" rule beyond which framing errors appear.</p>` },
      { q: String.raw`How many 256-byte packets per second can a 57600 baud, 8N1 link carry at 100% utilisation?`, solution: String.raw`<p><b>Formula.</b> $$P = \frac{R_b}{N_{\text{bytes}}\,N_{\text{frame}}}$$ where $R_b$ is the baud rate, $N_{\text{bytes}}$ the packet length, and $N_{\text{frame}}=10$ bits per 8N1 character.</p>
<p><b>Substitute.</b> $$P = \frac{57600}{256 \times 10}$$</p>
<p><b>Compute.</b> Bits per packet $= 256\times10 = 2560$; $P = 57600/2560 = 22.5$ packets/s.</p>
<p><b>Explanation.</b> The line sustains 22.5 full 256-byte packets each second. Cross-check via payload rate: $0.8\times57600 = 46080$ bit/s $= 5760$ B/s, and $5760/256 = 22.5$ packets/s — the two methods agree, confirming the arithmetic.</p>` }
    ],
    realWorld: String.raw`<p>RS-232 remains the default "get me a console" interface across embedded and industrial gear decades after its heyday. Nearly every router, switch, PDU, and server BMC has a serial console port for out-of-band recovery when the network is down. GPS/GNSS modules stream NMEA sentences over a 3-wire RS-232 (or TTL-serial) link at 4800–115200 baud. Bench instruments, older CNC machines, point-of-sale scanners, and RFID readers still ship RS-232 ports, and USB-to-serial adapters (FTDI, CP210x, CH340) keep it alive on modern laptops that dropped the physical DE-9. On microcontrollers the same UART speaks logic-level ("TTL") serial for debug, converted to true $\pm$ RS-232 by a MAX232-class transceiver only when a real cable to a PC COM port is needed. Its persistent limitations — ~15 m reach, single peer, no noise cancellation — are exactly what drive designers to RS-422/485 for factory-floor distances and multidrop networks, and to LVDS/USB/Ethernet for high speed.</p>`,
    related: ['rs422', 'rs485', 'lvds', 'comm-basics']
  },
  {
    id: 'rs422',
    title: 'RS-422',
    category: 'Interfaces & Protocols',
    tags: ['rs422', 'differential', 'balanced', 'tia-422', 'multidrop', 'point-to-point', 'twisted-pair', 'long-distance'],
    summary: String.raw`RS-422 (TIA/EIA-422) is a balanced differential interface with one driver and up to ten receivers, spanning ~1200 m at 100 kbps or 10 Mbps at ~12 m, using $\pm 2$–$6$ V differential levels over terminated twisted pair for excellent common-mode noise rejection.`,
    diagram: [{ svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-rs422" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="18" y="80" width="90" height="60" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="63" y="106" fill="#e6edf3" text-anchor="middle" font-weight="bold">Driver</text>
<text x="63" y="122" fill="#9aa7b5" text-anchor="middle" font-size="10">1 only</text>
<line x1="108" y1="98" x2="470" y2="98" stroke="#63e6be"/>
<line x1="108" y1="122" x2="470" y2="122" stroke="#ffa94d"/>
<text x="290" y="92" fill="#e6edf3" text-anchor="middle" font-size="10">B (+)</text>
<text x="290" y="138" fill="#e6edf3" text-anchor="middle" font-size="10">A (&#8722;)</text>
<text x="290" y="72" fill="#9aa7b5" text-anchor="middle" font-size="10">twisted pair (differential)</text>
<line x1="470" y1="98" x2="470" y2="122" stroke="#b197fc" stroke-width="2"/>
<text x="500" y="114" fill="#b197fc" text-anchor="middle" font-size="10">R&#7734;&#8776;Z&#8320;</text>
<rect x="150" y="160" width="70" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="185" y="187" fill="#e6edf3" text-anchor="middle" font-size="11">Rx 1</text>
<rect x="255" y="160" width="70" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="290" y="187" fill="#e6edf3" text-anchor="middle" font-size="11">Rx 2</text>
<rect x="380" y="160" width="90" height="46" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="425" y="181" fill="#e6edf3" text-anchor="middle" font-size="11">Rx &#8804;10</text>
<text x="425" y="196" fill="#9aa7b5" text-anchor="middle" font-size="9">(far-end term.)</text>
<line x1="185" y1="122" x2="185" y2="160" stroke="#9aa7b5" marker-end="url(#arr-rs422)"/>
<line x1="290" y1="122" x2="290" y2="160" stroke="#9aa7b5" marker-end="url(#arr-rs422)"/>
<line x1="425" y1="122" x2="425" y2="160" stroke="#9aa7b5" marker-end="url(#arr-rs422)"/>
<text x="270" y="224" fill="#9aa7b5" text-anchor="middle" font-size="10">one driver broadcasts to up to 10 receivers; termination at the far end</text>
</svg>`, caption: String.raw`RS-422: a single differential driver feeds a twisted A/B pair broadcasting to up to 10 receivers, with far-end termination R&#7734;&#8776;Z&#8320;.` },
      { title: String.raw`Differential noise-rejection mechanism`, svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-rs422" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="20" y="70" width="90" height="90" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="65" y="112" fill="#e6edf3" text-anchor="middle" font-weight="bold" font-size="11">Driver</text>
<text x="65" y="128" fill="#9aa7b5" text-anchor="middle" font-size="9">V_B, V_A</text>
<rect x="410" y="70" width="110" height="90" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="465" y="105" fill="#e6edf3" text-anchor="middle" font-weight="bold" font-size="11">Receiver</text>
<text x="465" y="122" fill="#9aa7b5" text-anchor="middle" font-size="9">subtracts:</text>
<text x="465" y="138" fill="#63e6be" text-anchor="middle" font-size="10">V_B &#8722; V_A</text>
<line x1="110" y1="92" x2="410" y2="92" stroke="#63e6be" stroke-width="2"/>
<text x="250" y="86" fill="#63e6be" text-anchor="middle" font-size="10">B: signal +s, noise +n</text>
<line x1="110" y1="140" x2="410" y2="140" stroke="#ffa94d" stroke-width="2"/>
<text x="250" y="156" fill="#ffa94d" text-anchor="middle" font-size="10">A: signal &#8722;s, noise +n</text>
<line x1="150" y1="60" x2="370" y2="60" stroke="#b197fc" stroke-dasharray="4 3"/>
<text x="260" y="52" fill="#b197fc" text-anchor="middle" font-size="9">EMI couples equally (+n) onto BOTH wires</text>
<line x1="200" y1="55" x2="200" y2="88" stroke="#b197fc" marker-end="url(#arr2-rs422)"/>
<line x1="320" y1="55" x2="320" y2="88" stroke="#b197fc" marker-end="url(#arr2-rs422)"/>
<rect x="60" y="190" width="420" height="48" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="270" y="209" fill="#e6edf3" text-anchor="middle" font-size="10">(+s+n) &#8722; (&#8722;s+n) = 2s &#8212; noise n cancels, signal DOUBLES</text>
<text x="270" y="227" fill="#9aa7b5" text-anchor="middle" font-size="9">common-mode n rejected; differential 2s survives &#8594; 1200 m reach</text>
</svg>`, caption: String.raw`Noise rejection: interference couples equally (+n) onto both wires, so the receiver's subtraction (V_B&#8722;V_A) cancels the common-mode noise while the wanted differential signal adds to 2s.` }],
    prerequisites: ['rs232', 'noise', 'comm-basics'],
    intro: String.raw`<p><strong>Why RS-422 exists.</strong> RS-232 works beautifully across a short cable but falls apart over distance: single-ended signalling has no way to reject noise or a ground-potential shift between two chassis, so a long run in a noisy factory turns data into garbage. The problem RS-422 solves is <em>carrying serial data reliably over long, electrically hostile cable</em>. Its answer is to stop measuring one wire against ground and instead send each bit as the <em>difference between two wires</em>, so that whatever noise or ground shift both wires pick up together simply cancels at the receiver. That one change buys kilometres of reach and megabits of speed where RS-232 managed metres and kilobits.</p>
<p><strong>RS-422</strong> — formally <strong>TIA/EIA-422-B</strong> (ITU-T V.11) — is the differential answer to RS-232's distance and noise limitations. Instead of one wire against ground, RS-422 sends each signal as the <em>difference between two wires</em> (a balanced pair, labelled A/− and B/+). The receiver looks only at the <strong>voltage difference</strong> $V_{AB}$ between the two wires, ignoring whatever noise or ground shift they share in common. This single change — from single-ended to <em>balanced differential</em> — is what lets RS-422 run kilometres and megabits where RS-232 runs metres and kilobits.</p>
<p>RS-422 keeps a familiar link shape: it is essentially <strong>point-to-point or one-driver multidrop</strong>. There is exactly one driver on a bus, but up to <strong>ten receivers</strong> may listen. It is typically wired full-duplex using two pairs (one per direction). Compared to its close sibling RS-485, RS-422 does not support multiple drivers/true bus arbitration — its driver is always enabled — which makes it simpler but non-networking.</p>`,
    sections: [
      {
        h: 'Balanced differential signaling: why two wires win',
        html: String.raw`<p>In a <strong>balanced differential</strong> pair, the driver puts complementary voltages on wires A and B: when B is high, A is low, and vice versa. The receiver computes $V_{\text{diff}} = V_B - V_A$ and decides the bit from its sign — positive is one logic state, negative the other. The two wires are twisted together and routed side by side, so any external interference (or a ground-potential shift between transmitter and receiver) couples <em>almost equally</em> onto both wires. That shared disturbance is <strong>common-mode</strong>, and because the receiver subtracts the two wires, common-mode largely <em>cancels</em>.</p>
<p>RS-422 driver and receiver limits:</p>
<table class="data">
<tr><th>Parameter</th><th>Value</th></tr>
<tr><td>Driver differential output (loaded)</td><td>$\ge \pm 2$ V (up to $\pm 6$ V)</td></tr>
<tr><td>Receiver sensitivity (threshold)</td><td>$\pm 200$ mV ($\pm 0.2$ V)</td></tr>
<tr><td>Receiver input common-mode range</td><td>$-7$ V to $+7$ V</td></tr>
<tr><td>Line impedance / termination</td><td>~100–120 Ω twisted pair, terminated with $R_T \approx Z_0$</td></tr>
</table>
<p>Because the receiver only needs a 200 mV difference but the driver produces at least 2 V, RS-422 has a <strong>10:1 noise margin</strong> even after long-cable attenuation — an enormous improvement over single-ended signalling.</p>
<div class="callout"><strong>The core idea:</strong> a differential receiver rejects anything common to both wires. Noise, ground bounce, and EMI that would wreck RS-232 are largely invisible to RS-422 because they appear as common-mode, not differential, signals.</div>`
      },
      {
        h: 'Common-mode rejection and noise immunity',
        html: String.raw`<p>The receiver's <strong>Common-Mode Rejection Ratio (CMRR)</strong> quantifies how well it ignores the shared voltage. An ideal differential receiver output depends only on $V_A - V_B$ and not at all on $(V_A + V_B)/2$. Real receivers achieve very high CMRR over the specified <strong>$-7$ V to $+7$ V common-mode range</strong>, meaning the two ends' grounds can differ by up to 7 V (plus the signal swing) and the link still works — impossible for RS-232.</p>
<p>Two effects give RS-422 its immunity:</p>
<ul>
<li><strong>Common-mode cancellation:</strong> interference couples equally onto both twisted wires and subtracts out at the receiver.</li>
<li><strong>Ground-offset tolerance:</strong> the $\pm 7$ V CM window absorbs ground-potential differences between chassis, which single-ended links cannot handle at all.</li>
</ul>
<p>Twisting the pair is essential: it ensures the two wires occupy nearly the same position in space on average, so an external field links them equally (keeping interference common-mode) and so their emitted fields cancel (low radiated EMI).</p>`
      },
      {
        h: 'Encoding, framing and clocking',
        html: String.raw`<p>RS-422 is a <strong>physical/electrical layer only</strong> — it specifies voltages, impedances, and driver/receiver behaviour, <em>not</em> the data format. In practice it carries the <strong>same asynchronous NRZ UART framing as RS-232</strong> (start bit, 5–8 data bits, optional parity, stop bit), just with differential electrical levels. So an RS-422 link is usually still <strong>asynchronous 8N1-style</strong> with no separate clock: the receiver oversamples and re-synchronises on each start bit exactly as in RS-232.</p>
<p>The async UART character frame it carries, field by field, is identical to RS-232's — only the electrical levels differ:</p>
<table class="data">
<tr><th>Field</th><th>Width</th><th>Value / order</th><th>Meaning</th></tr>
<tr><td>Start</td><td>1 bit</td><td>SPACE (0)</td><td>Marks the start of a character; its edge is the timing reference</td></tr>
<tr><td>Data</td><td>5–9 bits (usually 8)</td><td>LSB first</td><td>The payload character</td></tr>
<tr><td>Parity</td><td>0 or 1 bit</td><td>none / even / odd</td><td>Optional single-bit error check</td></tr>
<tr><td>Stop</td><td>1, 1.5, or 2 bits</td><td>MARK (1)</td><td>Returns the line to idle before the next frame</td></tr>
</table>
<p>The <strong>packet/message structure above this is defined by a higher layer</strong> — for RS-422 the electrical standard says nothing about addressing or message framing; a protocol layered on top (e.g. an application- or fieldbus-specific format) groups these characters into packets.</p>
<p>The idle/mark state corresponds to a defined differential polarity (B > A). Because only the layer changed and not the protocol, engineers frequently "upgrade" an RS-232 design to RS-422 simply by swapping the transceiver chip and using twisted pair, to gain distance and noise immunity while keeping the UART, drivers, and software unchanged. (Synchronous, clocked variants exist for high-rate applications, but async UART framing dominates.)</p>`
      },
      {
        h: 'Topology, duplex, and the 1-driver / 10-receiver limit',
        html: String.raw`<p>RS-422 allows <strong>exactly one driver</strong> per bus but up to <strong>ten receivers</strong> listening to it. This makes it a one-way <em>broadcast multidrop</em>: a master can send the same data to up to ten slaves. It is not a true bus — the single driver is permanently enabled and there is no mechanism for a receiver to talk back on that same pair.</p>
<p>The ten-receiver limit comes from loading. Each RS-422 receiver has a minimum input resistance of <strong>4 kΩ</strong>. Ten in parallel present $4\,\text{k}\Omega/10 = 400\ \Omega$, which, together with the termination, the driver can still drive to its guaranteed $\pm 2$ V. Add more and the differential voltage sags below spec.</p>
<p>For <strong>full-duplex</strong> bidirectional communication you use <strong>two twisted pairs</strong> — one pair driven by each end. Only the pair being received is terminated at its far end; the standard also permits stub terminations at intermediate receivers on longer runs.</p>`
      },
      {
        h: 'Termination and transmission-line behaviour',
        html: String.raw`<p>At RS-422 speeds and distances the cable behaves as a <strong>transmission line</strong>, so its far end must be <strong>terminated</strong> with a resistor equal to the characteristic impedance $Z_0$ (typically <strong>100–120 Ω</strong>) to prevent reflections. A signal edge that reaches an unterminated end reflects back, superimposes on later bits, and causes inter-symbol interference and false receiver triggering.</p>
<p>The termination resistor is placed at the <em>receiving end</em> of the pair (the electrically far end from the single driver). On a multidrop RS-422 bus with several receivers, the termination goes at the last receiver; intermediate stubs must be kept short so their unterminated reflections are negligible. Whether termination is needed depends on the edge rate versus the round-trip propagation time — short, slow links can skip it, but any run long enough that the round-trip delay exceeds a fraction of the rise time must be terminated.</p>
<div class="callout"><strong>Rule of thumb:</strong> terminate when the one-way cable delay exceeds roughly the signal rise time (equivalently, when the cable is "electrically long"). At 10 Mbps essentially every cable needs termination; at 9600 baud over a few metres it usually does not.</div>
<p><strong>Fail-safe biasing.</strong> Even though RS-422's single driver is always enabled, a robust design still adds <strong>fail-safe bias resistors</strong> — a pull-up on the B/+ line and a pull-down on the A/− line — so that if the cable is disconnected, cut, or shorted (leaving the receiver input open or indeterminate), the pair is gently pulled to a defined idle (mark) polarity ($V_B > V_A$) rather than floating across the receiver's $\pm 200$ mV threshold. Without bias, an open or unpowered link can leave the receiver output chattering on noise and emitting false start bits. The bias resistors must be chosen large enough not to disturb the terminated line's differential level in normal operation, yet small enough to hold the idle state (typically a few hundred ohms to a couple of kΩ). Many modern RS-422/485 receivers also provide <em>internal</em> open-input fail-safe that guarantees a known output when the inputs float. This is the same fail-safe idea used on the RS-485 bus, applied here to protect against a broken or open RS-422 link.</p>`
      },
      {
        h: 'Data rate, cable length, and the rate–length trade-off',
        html: String.raw`<p>RS-422's headline numbers are <strong>10 Mbps at ~12 m (40 ft)</strong> down to <strong>100 kbps at ~1200 m (4000 ft)</strong>. Between these endpoints the achievable rate falls roughly with distance because cable attenuation, dispersion, and accumulated propagation delay degrade the edges. This is the famous <strong>rate–length trade-off</strong> shared with RS-485.</p>
<table class="data">
<tr><th>Cable length</th><th>Approx. max data rate</th></tr>
<tr><td>12 m (40 ft)</td><td>10 Mbps</td></tr>
<tr><td>120 m (400 ft)</td><td>~1 Mbps</td></tr>
<tr><td>1200 m (4000 ft)</td><td>~100 kbps</td></tr>
</table>
<p>A useful approximation is that the <strong>rate × length product</strong> is roughly constant in the mid-region (about $10^7$–$10^8$ bit·m/s), i.e. halving the rate roughly doubles the reach. The physical cause is that longer cable attenuates high-frequency content and adds delay, so bits must be held longer (lower rate) for the receiver to see a clean, well-timed edge. Compared to RS-232's ~15 m, RS-422 reaches ~80× farther and ~100× faster because differential signalling survives the attenuation and noise that single-ended cannot.</p>`
      },
      {
        h: 'Standard, connectors, use cases, pros/cons and comparison',
        html: String.raw`<p>RS-422 is maintained by the <strong>TIA (TIA/EIA-422-B)</strong>; the balanced electrical layer is also standardised as <strong>ITU-T V.11</strong> and its interoperability is described alongside RS-449. Unlike RS-232 it does <em>not</em> mandate a connector — designers use DE-9, RJ-45, terminal blocks, or DB-37/DB-25 depending on the equipment.</p>
<p><strong>Use cases:</strong> long-distance point-to-point serial links, factory automation and PLCs, motion/servo control (many encoders output RS-422 quadrature), broadcast video timecode and camera control, DMX-style theatrical lighting is actually RS-485 but RS-422 is common for one-master-to-many displays, marine/aircraft data buses, and legacy Apple Macintosh serial ports (which were RS-422).</p>
<p><strong>Pros:</strong> long reach, high speed, excellent noise immunity, up to 10 listeners, drop-in electrical upgrade from RS-232. <strong>Cons:</strong> single driver only (no true multi-master bus — use RS-485 for that), needs twisted pair and termination, and requires differential transceivers rather than a simple pin.</p>
<table class="data">
<tr><th>Property</th><th>RS-232</th><th>RS-422</th><th>RS-485</th><th>LVDS</th></tr>
<tr><td>Signaling</td><td>Single-ended</td><td>Differential (balanced)</td><td>Differential (balanced)</td><td>Differential (current-mode)</td></tr>
<tr><td>Drivers × receivers</td><td>1 × 1</td><td><strong>1 × 10</strong></td><td>32 UL (multi-driver)</td><td>typ. 1 × 1</td></tr>
<tr><td>Topology</td><td>Point-to-point</td><td>Point-to-point / 1-driver multidrop</td><td>Multidrop bus (multi-master)</td><td>Point-to-point</td></tr>
<tr><td>Duplex</td><td>Full</td><td>Full (2 pairs)</td><td>Half or full</td><td>Simplex per pair</td></tr>
<tr><td>Common-mode range</td><td>none (single-ended)</td><td>$-7$ to $+7$ V</td><td>$-7$ to $+12$ V</td><td>~$\pm 1$ V about 1.2 V</td></tr>
<tr><td>Max distance / rate</td><td>15 m / 115 kbps</td><td>1200 m / 10 Mbps@12m</td><td>1200 m / 10 Mbps@12m</td><td>~10 m / Gbps</td></tr>
<tr><td>Standard</td><td>TIA-232</td><td>TIA-422 (V.11)</td><td>TIA-485</td><td>TIA/EIA-644</td></tr>
</table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">One idea does all the heavy lifting: send the signal as a <em>difference</em> between two wires, and the receiver can throw away everything the two wires share — noise, ground shift, interference.</div>
<ul>
<li><strong>Balanced differential is the whole trick.</strong> The receiver decides on $V_B - V_A$; noise couples equally onto both wires (common-mode) and subtracts out, while the wanted difference survives — the mechanism behind RS-422's kilometre reach.</li>
<li><strong>The margin is enormous.</strong> A $\ge \pm 2$ V driver into a $\pm 200$ mV receiver threshold is a 10:1 (20 dB) margin, so the signal can lose a factor of ten to cable attenuation and still be read.</li>
<li><strong>It is one driver, up to ten receivers.</strong> A broadcast multidrop, <em>not</em> a multi-master bus — the driver is always on. The ten-receiver limit is just $4\,\text{k}\Omega/10 = 400\ \Omega$ still meeting spec.</li>
<li><strong>Long lines are transmission lines.</strong> Terminate the far (receiving) end with $R_T \approx Z_0$ (100–120 Ω) whenever the cable is electrically long, and add fail-safe bias so an open/cut link idles at a valid mark.</li>
<li><strong>It is a drop-in electrical upgrade from RS-232.</strong> Same async UART framing; swap only the transceiver and use twisted pair to gain distance and noise immunity — no software change.</li>
<li><strong>When you need many talkers, move to RS-485.</strong> RS-422's single always-on driver cannot arbitrate a shared bus; RS-485 adds the tristate driver that does.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`RS-422 is <strong>balanced differential</strong>: the receiver decides on $V_{\text{diff}} = V_B - V_A$, cancelling common-mode noise.`,
      String.raw`Driver output is $\ge \pm 2$ V; receiver sensitivity is only $\pm 200$ mV — a <strong>10:1 noise margin</strong>.`,
      String.raw`Common-mode input range is <strong>$-7$ V to $+7$ V</strong>, tolerating ground-potential differences between the two ends.`,
      String.raw`Topology: <strong>one driver, up to ten receivers</strong> (broadcast multidrop) — <em>not</em> a multi-master bus (that is RS-485).`,
      String.raw`The 10-receiver limit follows from each receiver's $\ge 4$ kΩ input; ten in parallel = 400 Ω, still drivable to $\pm 2$ V.`,
      String.raw`Full-duplex uses <strong>two twisted pairs</strong>, one per direction; each driven pair is terminated at its far (receiving) end with $R_T \approx Z_0$ (100–120 Ω).`,
      String.raw`RS-422 is a physical layer only; it usually carries the <strong>same async NRZ UART framing (8N1) as RS-232</strong>, no clock line.`,
      String.raw`Rate–length trade-off: <strong>10 Mbps @ ~12 m ⟶ 100 kbps @ ~1200 m</strong>; rate × length is roughly constant.`,
      String.raw`Termination prevents reflections on the transmission line; needed whenever the cable is "electrically long" (round-trip delay > rise time).`,
      String.raw`Twisted pair keeps interference common-mode (so it cancels) and keeps emitted EMI low.`,
      String.raw`<strong>Fail-safe biasing</strong> (pull-up on B, pull-down on A, or internal open-input fail-safe) forces a valid idle/mark polarity if the link is open, cut, or unpowered — otherwise a floating receiver input chatters on noise.`,
      String.raw`Standard body: <strong>TIA (TIA-422-B)</strong>, also ITU-T V.11; connector is not mandated.`,
      String.raw`An RS-232 design can often be "upgraded" to RS-422 by swapping only the transceiver and cable — software unchanged.`
    ],
    equations: [
      {
        title: 'Differential decision voltage',
        tex: String.raw`$$V_{\text{diff}} = V_B - V_A$$`,
        derivation: String.raw`<p><b>Where we start.</b> A balanced driver puts complementary voltages on the two wires: $V_A = V_{\text{cm}} - \tfrac{V_s}{2}$ and $V_B = V_{\text{cm}} + \tfrac{V_s}{2}$, where $V_{\text{cm}}$ is the common-mode (average) voltage and $V_s$ is the differential swing.</p>
<p><b>Step 1 — model added noise.</b> External interference $n(t)$ and any ground shift couple almost equally onto both wires: $V_A' = V_A + n$, $V_B' = V_B + n$.</p>
<p><b>Step 2 — take the difference at the receiver.</b></p>
$$V_{\text{diff}} = V_B' - V_A' = (V_B + n) - (V_A + n) = V_B - V_A.$$
<p>The noise $n$ cancels exactly because it is common to both wires.</p>
<p><b>Result.</b> $$V_{\text{diff}} = V_B - V_A = V_s,$$ independent of $V_{\text{cm}}$ and of common-mode noise $n$. Sanity check: this is precisely why the receiver's $\pm 7$ V common-mode range and its immunity to ground offsets exist — the decision never depends on $V_{\text{cm}}$.</p>`
      },
      {
        title: 'Noise margin ratio',
        tex: String.raw`$$M = \frac{V_{\text{od,min}}}{V_{\text{th}}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The driver guarantees a minimum loaded differential output $V_{\text{od,min}} = 2$ V, and the receiver decides reliably once the magnitude exceeds its threshold $V_{\text{th}} = 0.2$ V.</p>
<p><b>Step 1 — form the ratio of "signal available" to "signal required."</b></p>
$$M = \frac{V_{\text{od,min}}}{V_{\text{th}}}.$$
<p><b>Step 2 — interpret.</b> $M$ tells how much the differential signal can be attenuated by cable loss and still be read correctly.</p>
<p><b>Result.</b> $$M = \frac{2\ \text{V}}{0.2\ \text{V}} = 10.$$ The differential signal can lose up to $20\log_{10}(10) = 20$ dB (a factor of 10) over the cable and still exceed the receiver threshold. Sanity check: compare RS-232, which relies on absolute voltage against ground and has no such attenuation headroom — this ratio is why RS-422 spans 1200 m.</p>`
      },
      {
        title: 'Maximum receiver count from input loading',
        tex: String.raw`$$N_{\max} = \left\lfloor \frac{R_{\text{in}}}{R_{\text{load,min}}} \right\rfloor$$`,
        derivation: String.raw`<p><b>Where we start.</b> The driver can source enough current to hold $\pm 2$ V across a minimum load resistance. Each receiver presents an input resistance $R_{\text{in}} \ge 4\ \text{k}\Omega$; $N$ receivers in parallel present $R_{\text{in}}/N$.</p>
<p><b>Step 1 — set the parallel load equal to the minimum the driver can hold at spec.</b> The standard's guaranteed drive corresponds to a minimum load of about $R_{\text{load,min}} \approx 400\ \Omega$ (the value at which $\pm 2$ V is still met):</p>
$$\frac{R_{\text{in}}}{N} \ge R_{\text{load,min}}.$$
<p><b>Step 2 — solve for $N$.</b></p>
$$N \le \frac{R_{\text{in}}}{R_{\text{load,min}}}.$$
<p><b>Result.</b> $$N_{\max} = \left\lfloor \frac{4000\ \Omega}{400\ \Omega} \right\rfloor = 10.$$ Sanity check: this reproduces the well-known "1 driver, 10 receivers" limit — adding an 11th receiver drops the parallel resistance below 400 Ω and the differential voltage sags under $\pm 2$ V.</p>`
      },
      {
        title: 'Cable propagation delay',
        tex: String.raw`$$t_{pd} = \frac{L}{v} = \frac{L}{c/\sqrt{\varepsilon_r}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A signal travels down the cable at velocity $v$, which is slower than light $c$ by the square root of the insulation's relative permittivity: $v = c/\sqrt{\varepsilon_r}$ (the "velocity factor").</p>
<p><b>Step 1 — delay = distance / speed.</b></p>
$$t_{pd} = \frac{L}{v} = \frac{L\sqrt{\varepsilon_r}}{c}.$$
<p><b>Step 2 — apply a typical velocity factor.</b> For common twisted pair, $v \approx 0.66c \approx 2\times 10^8$ m/s (about 5 ns/m).</p>
<p><b>Result.</b> For $L = 1200$ m, $$t_{pd} = \frac{1200}{2\times 10^8} = 6\ \mu\text{s}.$$ Sanity check: this one-way delay ($\approx 5$ ns/m) is exactly what forces termination on long runs — the round trip ($12\ \mu\text{s}$) vastly exceeds a 10 Mbps bit time (100 ns), so reflections would corrupt many bits if the far end were left open.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`How does an RS-422 receiver decide a bit?`, back: String.raw`From the sign of the differential voltage $V_{\text{diff}} = V_B - V_A$ between the two wires — not from an absolute voltage against ground.` },
      { front: String.raw`Driver output and receiver threshold voltages?`, back: String.raw`Driver $\ge \pm 2$ V (up to $\pm 6$ V) differential; receiver sensitivity $\pm 200$ mV. That is a 10:1 margin.` },
      { front: String.raw`What is the common-mode input range?`, back: String.raw`$-7$ V to $+7$ V, letting the two ends' grounds differ by up to 7 V.` },
      { front: String.raw`How many drivers and receivers does RS-422 allow?`, back: String.raw`One driver, up to ten receivers (broadcast multidrop). It is not a multi-master bus.` },
      { front: String.raw`Why exactly ten receivers?`, back: String.raw`Each receiver is $\ge 4$ kΩ; ten in parallel = 400 Ω, the minimum load the driver still holds to $\pm 2$ V.` },
      { front: String.raw`How is full-duplex RS-422 wired?`, back: String.raw`Two twisted pairs — one driven by each end; each pair terminated at its far (receiving) end.` },
      { front: String.raw`What framing does RS-422 typically carry?`, back: String.raw`The same asynchronous NRZ UART framing as RS-232 (8N1-style), with no clock line — RS-422 is just the electrical layer.` },
      { front: String.raw`What is the rate–length trade-off?`, back: String.raw`10 Mbps at ~12 m down to 100 kbps at ~1200 m; rate × length is roughly constant.` },
      { front: String.raw`Why terminate the cable?`, back: String.raw`To match $Z_0$ (~100–120 Ω) and absorb the edge, preventing reflections/ISI on the electrically-long transmission line.` },
      { front: String.raw`Where does the termination resistor go?`, back: String.raw`At the far (receiving) end of the driven pair; on multidrop, at the last receiver, with short intermediate stubs.` },
      { front: String.raw`Why twisted pair?`, back: String.raw`It makes interference couple equally onto both wires (so it cancels as common-mode) and keeps emitted EMI low.` },
      { front: String.raw`Does RS-422 need fail-safe biasing?`, back: String.raw`Its driver is always on, so a live link defines the state; but a robust design still adds fail-safe bias (pull-up on B, pull-down on A) or uses an internal open-input fail-safe receiver so an open/cut/unpowered link idles at a valid mark instead of floating and chattering.` },
      { front: String.raw`Which standard body and numbers define RS-422?`, back: String.raw`TIA (TIA/EIA-422-B); also ITU-T V.11. No mandatory connector.` },
      { front: String.raw`Main difference between RS-422 and RS-485?`, back: String.raw`RS-422 has one always-on driver (broadcast); RS-485 supports up to 32 unit loads with multiple, tristate-able drivers on a true multi-master bus.` },
      { front: String.raw`How much cable loss can RS-422 tolerate?`, back: String.raw`About 20 dB (a factor of 10), from the 2 V / 0.2 V margin — the reason it reaches 1200 m.` }
    ],
    mcqs: [
      { q: String.raw`RS-422 signalling is:`, options: [String.raw`Single-ended`, String.raw`Balanced differential`, String.raw`Current-loop`, String.raw`Optical`], answer: 1, explain: String.raw`Each signal is the difference between two balanced wires, giving common-mode rejection.` },
      { q: String.raw`The RS-422 receiver sensitivity (threshold) is about:`, options: [String.raw`$\pm 3$ V`, String.raw`$\pm 1.5$ V`, String.raw`$\pm 200$ mV`, String.raw`$\pm 50$ mV`], answer: 2, explain: String.raw`It reliably decides once $|V_{\text{diff}}| > 200$ mV, versus the driver's $\ge 2$ V — a 10:1 margin.` },
      { q: String.raw`How many receivers can share one RS-422 driver?`, options: [String.raw`1`, String.raw`10`, String.raw`32`, String.raw`256`], answer: 1, explain: String.raw`Up to ten receivers; the $4$ kΩ input of each limits parallel load to 400 Ω.` },
      { q: String.raw`RS-422's common-mode input range is:`, options: [String.raw`$0$ to $5$ V`, String.raw`$-7$ V to $+7$ V`, String.raw`$-7$ V to $+12$ V`, String.raw`$\pm 15$ V`], answer: 1, explain: String.raw`$-7$ to $+7$ V. (RS-485 widens this to $-7$ to $+12$ V.)` },
      { q: String.raw`Full-duplex RS-422 requires:`, options: [String.raw`One wire plus ground`, String.raw`One twisted pair`, String.raw`Two twisted pairs`, String.raw`A coaxial cable`], answer: 2, explain: String.raw`Two pairs, one driven by each end, for simultaneous bidirectional data.` },
      { q: String.raw`At ~1200 m, the maximum RS-422 data rate is about:`, options: [String.raw`10 Mbps`, String.raw`1 Mbps`, String.raw`100 kbps`, String.raw`9600 bps`], answer: 2, explain: String.raw`~100 kbps at 1200 m; ~10 Mbps only at ~12 m.` },
      { q: String.raw`The termination resistor should equal:`, options: [String.raw`The driver output impedance`, String.raw`The cable characteristic impedance $Z_0$ (~100–120 Ω)`, String.raw`4 kΩ`, String.raw`50 Ω always`], answer: 1, explain: String.raw`Matching $R_T$ to $Z_0$ absorbs the edge and prevents reflections.` },
      { q: String.raw`RS-422 common-mode noise is rejected because the receiver:`, options: [String.raw`Averages the two wires`, String.raw`Subtracts the two wires`, String.raw`Grounds one wire`, String.raw`Uses a large threshold`], answer: 1, explain: String.raw`Taking $V_B - V_A$ cancels any voltage common to both wires.` },
      { q: String.raw`Which framing does an RS-422 UART link usually use?`, options: [String.raw`Manchester`, String.raw`Synchronous HDLC only`, String.raw`Asynchronous NRZ 8N1 (like RS-232)`, String.raw`8b/10b`], answer: 2, explain: String.raw`RS-422 defines only the electrical layer; it typically carries the same async UART framing as RS-232.` },
      { q: String.raw`Compared with RS-485, RS-422 differs in that it:`, options: [String.raw`Is single-ended`, String.raw`Supports only one (always-on) driver`, String.raw`Cannot be terminated`, String.raw`Has no common-mode range`], answer: 1, explain: String.raw`RS-422 allows one driver (broadcast to 10 receivers); RS-485 supports multiple tristate drivers on a true bus.` },
      { q: String.raw`Roughly how much differential attenuation can RS-422 tolerate?`, options: [String.raw`3 dB`, String.raw`6 dB`, String.raw`20 dB`, String.raw`40 dB`], answer: 2, explain: String.raw`$20\log_{10}(2\,\text{V}/0.2\,\text{V}) = 20$ dB.` },
      { q: String.raw`The standard body for RS-422 is:`, options: [String.raw`IEEE`, String.raw`TIA/EIA (also ITU-T V.11)`, String.raw`USB-IF`, String.raw`ISO`], answer: 1, explain: String.raw`TIA/EIA-422-B, aligned with ITU-T V.11.` },
      { q: String.raw`RS-422 fail-safe bias resistors are added mainly to:`, options: [String.raw`Increase the data rate`, String.raw`Force a valid idle/mark state if the link is open, cut, or unpowered`, String.raw`Terminate the transmission line`, String.raw`Widen the common-mode range`], answer: 1, explain: String.raw`A pull-up on B and pull-down on A (or an internal open-input fail-safe) hold a defined mark so a floating receiver input does not chatter on noise; termination is a separate resistor.` }
    ],
    numericals: [
      { q: String.raw`An RS-422 driver guarantees $\pm 2.0$ V into the load. The cable attenuates the differential signal by 15 dB. Does the signal still exceed the $\pm 200$ mV receiver threshold?`, solution: String.raw`<p><b>Formula.</b> An attenuation of $A$ dB scales the amplitude by a voltage factor $$k = 10^{A/20}, \qquad V_{\text{rx}} = \frac{V_{\text{od}}}{k}$$ where $V_{\text{od}}$ is the driver differential output and $V_{\text{rx}}$ the received amplitude.</p>
<p><b>Substitute.</b> $$k = 10^{15/20}, \qquad V_{\text{rx}} = \frac{2.0\ \text{V}}{k}$$</p>
<p><b>Compute.</b> $k = 10^{0.75} = 5.62$. $V_{\text{rx}} = 2.0/5.62 = 0.356\ \text{V} = 356$ mV.</p>
<p><b>Explanation.</b> At 356 mV the signal clears the 200 mV threshold, so the link works — with a factor $356/200 = 1.78$ (about 5 dB) of headroom left. This illustrates why RS-422's 10:1 (20 dB) design margin lets it tolerate long, lossy cable that single-ended RS-232 could not.</p>` },
      { q: String.raw`Twelve RS-422 receivers (each 4 kΩ) are placed on one driver. What is the parallel load, and can a driver rated to hold $\pm 2$ V into 400 Ω still meet spec?`, solution: String.raw`<p><b>Formula.</b> $N$ equal receivers of input resistance $R_{\text{in}}$ present a parallel load $$R_{\text{par}} = \frac{R_{\text{in}}}{N},$$ which must stay at or above the driver's minimum load $R_{\text{load,min}}$ for the $\pm2$ V output to hold.</p>
<p><b>Substitute.</b> $$R_{\text{par}} = \frac{4000\ \Omega}{12}, \qquad \text{compare with } R_{\text{load,min}} = 400\ \Omega$$</p>
<p><b>Compute.</b> $R_{\text{par}} = 333\ \Omega < 400\ \Omega$.</p>
<p><b>Explanation.</b> Twelve receivers pull the parallel load to 333 Ω, below the 400 Ω the driver can sustain at $\pm2$ V, so the differential output sags out of spec. The 10-receiver limit is exactly where $4000/10 = 400\ \Omega$ is reached — confirming why "one driver, ten receivers" is the ceiling and 12 is too many.</p>` },
      { q: String.raw`A 600 m RS-422 cable has velocity factor 0.66. Find the one-way propagation delay and comment on whether termination is needed at 5 Mbps.`, solution: String.raw`<p><b>Formula.</b> $$v = \text{VF}\cdot c, \qquad t_{pd} = \frac{L}{v}, \qquad T_b = \frac{1}{R_b}$$ where VF is the velocity factor, $c=3\times10^8$ m/s, $L$ the length, and $T_b$ the bit time at rate $R_b$.</p>
<p><b>Substitute.</b> $$v = 0.66\times 3\times10^8, \qquad t_{pd} = \frac{600}{v}, \qquad T_b = \frac{1}{5\times10^6}$$</p>
<p><b>Compute.</b> $v = 1.98\times10^8$ m/s. $t_{pd} = 600/1.98\times10^8 = 3.03\ \mu\text{s}$. $T_b = 200$ ns.</p>
<p><b>Explanation.</b> The one-way delay (3.03 µs) is about 15 bit-times — far longer than a bit period, so the cable is very "electrically long" and an unterminated far end would reflect edges into later bits. Termination matched to $Z_0$ at the receiving end is essential here.</p>` },
      { q: String.raw`Using the rate × length $\approx 10^8$ bit·m/s rule, estimate the maximum data rate over 300 m of RS-422 cable.`, solution: String.raw`<p><b>Formula.</b> $$R_{\max} \approx \frac{(R_b \cdot L)_{\text{const}}}{L}$$ where $(R_b\cdot L)_{\text{const}}\approx10^8$ bit·m/s is the roughly constant rate–length product and $L$ the cable length.</p>
<p><b>Substitute.</b> $$R_{\max} \approx \frac{10^8\ \text{bit·m/s}}{300\ \text{m}}$$</p>
<p><b>Compute.</b> $$R_{\max} \approx 3.3\times10^5\ \text{bit/s} = 333\ \text{kbps}.$$</p>
<p><b>Explanation.</b> About 333 kbps is the practical ceiling at 300 m. It sits sensibly between the standard anchor points (≈1 Mbps at ~120 m and 100 kbps at ~1200 m), confirming the inverse rate–length relationship: shorten the cable and the rate rises proportionally.</p>` },
      { q: String.raw`Two RS-422 chassis have grounds differing by 5 V, and interference adds a 3 V common-mode transient. Is the link within its common-mode range?`, solution: String.raw`<p><b>Formula.</b> The total common-mode voltage the receiver sees is the sum of contributions, which must lie inside the receiver's common-mode window: $$V_{\text{cm}} = V_{\text{gnd}} + V_{\text{noise}}, \qquad -7\ \text{V} \le V_{\text{cm}} \le +7\ \text{V (RS-422)}$$</p>
<p><b>Substitute.</b> $$V_{\text{cm}} = 5\ \text{V} + 3\ \text{V}$$</p>
<p><b>Compute.</b> $$V_{\text{cm}} = 8\ \text{V} > 7\ \text{V}.$$</p>
<p><b>Explanation.</b> At 8 V the common-mode exceeds RS-422's $\pm7$ V range, so the link may fail during that transient. RS-485's wider $-7$ to $+12$ V window would absorb it — which is precisely why plants with large, noisy ground offsets specify RS-485. The takeaway: budget ground offset plus noise against the receiver's CM range.</p>` }
    ],
    realWorld: String.raw`<p>RS-422 is the quiet workhorse of long-haul industrial and instrumentation serial links. Incremental and absolute encoders on servo motors almost universally output differential RS-422 quadrature (A/A̅, B/B̅, Z/Z̅) so the position signal survives the electrically noisy environment of a motor cabinet and a multi-metre cable run to the drive. Broadcast facilities use RS-422 for VTR/camera control and for distributing SMPTE/EBU timecode. Factory PLCs, CNC machines, and marine/avionics data buses lean on RS-422 for reliable point-to-point links out to a kilometre where RS-232 would fail. Classic Apple Macintosh serial ports were RS-422, and many "industrial RS-232" products are internally RS-422/485 with converters. Because the framing is identical to RS-232, upgrading a design for distance and noise immunity is often just a transceiver swap (e.g. a DS26LS31/32 driver/receiver pair) plus twisted-pair cabling and a termination resistor — no software change. When an application needs many talkers on one shared bus rather than one broadcaster, engineers step up to RS-485.</p>`,
    related: ['rs232', 'rs485', 'lvds', 'noise']
  },
  {
    id: 'rs485',
    title: 'RS-485',
    category: 'Interfaces & Protocols',
    tags: ['rs485', 'differential', 'multidrop', 'bus', 'tia-485', 'half-duplex', 'unit-load', 'modbus', 'tristate'],
    summary: String.raw`RS-485 (TIA/EIA-485) is a balanced differential multidrop bus supporting up to 32 unit loads (256 with fractional-load transceivers) of tristate-able drivers and receivers, half- or full-duplex, reaching ~1200 m at 100 kbps or 10 Mbps at ~12 m over a $120\,\Omega$-terminated twisted pair.`,
    diagram: [{ svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-rs485" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<line x1="55" y1="78" x2="485" y2="78" stroke="#63e6be"/>
<line x1="55" y1="98" x2="485" y2="98" stroke="#ffa94d"/>
<text x="270" y="70" fill="#9aa7b5" text-anchor="middle" font-size="10">2-wire differential bus (A / B)</text>
<line x1="55" y1="78" x2="55" y2="98" stroke="#b197fc" stroke-width="2"/>
<text x="40" y="92" fill="#b197fc" text-anchor="middle" font-size="10">120&#937;</text>
<line x1="485" y1="78" x2="485" y2="98" stroke="#b197fc" stroke-width="2"/>
<text x="505" y="92" fill="#b197fc" text-anchor="middle" font-size="10">120&#937;</text>
<rect x="70" y="125" width="90" height="55" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="115" y="149" fill="#e6edf3" text-anchor="middle" font-size="11">XCVR 1</text>
<text x="115" y="165" fill="#9aa7b5" text-anchor="middle" font-size="9">DE tri-state</text>
<rect x="225" y="125" width="90" height="55" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="270" y="149" fill="#e6edf3" text-anchor="middle" font-size="11">XCVR 2</text>
<text x="270" y="165" fill="#9aa7b5" text-anchor="middle" font-size="9">DE tri-state</text>
<rect x="380" y="125" width="100" height="55" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="430" y="149" fill="#e6edf3" text-anchor="middle" font-size="11">XCVR &#8804;32 UL</text>
<text x="430" y="165" fill="#9aa7b5" text-anchor="middle" font-size="9">DE tri-state</text>
<line x1="115" y1="98" x2="115" y2="125" stroke="#9aa7b5" marker-end="url(#arr-rs485)"/>
<line x1="270" y1="98" x2="270" y2="125" stroke="#9aa7b5" marker-end="url(#arr-rs485)"/>
<line x1="430" y1="98" x2="430" y2="125" stroke="#9aa7b5" marker-end="url(#arr-rs485)"/>
<text x="270" y="200" fill="#9aa7b5" text-anchor="middle" font-size="10">many tri-state transceivers share one bus, 120&#937; both ends; half-duplex turn-taking</text>
</svg>`, caption: String.raw`RS-485: multiple tri-state (DE) transceivers hang off one 2-wire differential bus terminated 120&#937; at both ends, taking turns half-duplex.` },
      { title: String.raw`Bus turnaround: driver-enable timing`, svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-rs485" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<line x1="30" y1="45" x2="510" y2="45" stroke="#9aa7b5"/>
<text x="270" y="38" fill="#9aa7b5" text-anchor="middle" font-size="10">shared A/B bus &#8212; only ONE driver active at a time</text>
<rect x="30" y="70" width="140" height="70" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="100" y="94" fill="#e6edf3" text-anchor="middle" font-weight="bold" font-size="11">Master</text>
<text x="100" y="111" fill="#63e6be" text-anchor="middle" font-size="9">DE active: polls</text>
<text x="100" y="126" fill="#9aa7b5" text-anchor="middle" font-size="9">&#8220;RT2, report?&#8221;</text>
<rect x="200" y="70" width="140" height="70" rx="6" fill="#1c232e" stroke="#9aa7b5"/>
<text x="270" y="94" fill="#e6edf3" text-anchor="middle" font-size="11">Slave 1</text>
<text x="270" y="111" fill="#ffa94d" text-anchor="middle" font-size="9">DE tri-state (Z)</text>
<text x="270" y="126" fill="#9aa7b5" text-anchor="middle" font-size="9">listening</text>
<rect x="370" y="70" width="140" height="70" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="440" y="94" fill="#e6edf3" text-anchor="middle" font-size="11">Slave 2</text>
<text x="440" y="111" fill="#63e6be" text-anchor="middle" font-size="9">DE active: responds</text>
<text x="440" y="126" fill="#9aa7b5" text-anchor="middle" font-size="9">after turnaround</text>
<line x1="100" y1="70" x2="100" y2="45" stroke="#4dabf7" marker-end="url(#arr2-rs485)"/>
<line x1="440" y1="45" x2="440" y2="70" stroke="#63e6be" marker-end="url(#arr2-rs485)"/>
<rect x="30" y="165" width="480" height="70" rx="6" fill="#1c232e" stroke="#ffa94d"/>
<text x="270" y="185" fill="#e6edf3" text-anchor="middle" font-size="10">turnaround sequence (2-wire half-duplex):</text>
<text x="270" y="202" fill="#9aa7b5" text-anchor="middle" font-size="9">1. master asserts DE, sends poll &#183; 2. master tri-states after last stop bit</text>
<text x="270" y="218" fill="#9aa7b5" text-anchor="middle" font-size="9">3. line settles (t_turn) &#183; 4. slave asserts DE, sends status &#183; 5. slave tri-states</text>
<text x="270" y="231" fill="#ffa94d" text-anchor="middle" font-size="9">tri-state too early = clipped byte; too late = collision</text>
</svg>`, caption: String.raw`Bus turnaround: exactly one driver enables its DE at a time. The master polls, tri-states after its final stop bit, the line settles, then the addressed slave enables DE and responds &#8212; mistimed DE clips a byte or collides.` },
      { title: String.raw`Fail-safe biasing network`, svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-rs485" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="220" y="20" width="100" height="30" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="270" y="40" fill="#e6edf3" text-anchor="middle" font-size="11">Vcc</text>
<line x1="70" y1="95" x2="470" y2="95" stroke="#63e6be" stroke-width="2"/>
<text x="120" y="88" fill="#63e6be" text-anchor="middle" font-size="10">B (+)</text>
<line x1="70" y1="150" x2="470" y2="150" stroke="#ffa94d" stroke-width="2"/>
<text x="120" y="168" fill="#ffa94d" text-anchor="middle" font-size="10">A (&#8722;)</text>
<line x1="270" y1="50" x2="270" y2="95" stroke="#b197fc"/>
<rect x="255" y="58" width="30" height="14" rx="3" fill="#1c232e" stroke="#b197fc"/>
<text x="330" y="70" fill="#b197fc" text-anchor="middle" font-size="9">pull-up ~560&#937; &#8594; B high</text>
<line x1="270" y1="150" x2="270" y2="195" stroke="#b197fc"/>
<rect x="255" y="168" width="30" height="14" rx="3" fill="#1c232e" stroke="#b197fc"/>
<text x="330" y="192" fill="#b197fc" text-anchor="middle" font-size="9">pull-down ~560&#937; &#8594; A low</text>
<line x1="220" y1="205" x2="320" y2="205" stroke="#9aa7b5"/>
<text x="270" y="220" fill="#9aa7b5" text-anchor="middle" font-size="10">GND</text>
<rect x="60" y="80" width="20" height="85" rx="3" fill="#1c232e" stroke="#b197fc"/>
<text x="45" y="60" fill="#b197fc" text-anchor="middle" font-size="9">120&#937;</text>
<rect x="460" y="80" width="20" height="85" rx="3" fill="#1c232e" stroke="#b197fc"/>
<text x="495" y="60" fill="#b197fc" text-anchor="middle" font-size="9">120&#937;</text>
<text x="270" y="120" fill="#e6edf3" text-anchor="middle" font-size="10">all drivers tri-stated &#8594; bias holds V_B &gt; V_A (valid idle/mark)</text>
</svg>`, caption: String.raw`Fail-safe bias network: a pull-up on B and pull-down on A gently force V_B &gt; V_A when every driver is tri-stated, so an idle (floating) bus reads as a valid mark instead of chattering across the &#177;200 mV threshold; the two 120&#937; terminators sit at the bus ends.` }],
    prerequisites: ['rs422', 'rs232', 'noise'],
    intro: String.raw`<p><strong>Why RS-485 exists.</strong> RS-422 gave industry long-reach, noise-immune differential links — but only <em>one</em> device could ever drive the wire. A factory or building, though, has dozens of sensors, drives, and controllers that all need to share information over a single cheap cable run. Wiring a separate RS-422 link to each would be a rat's nest. The problem RS-485 solves is <em>letting many devices share one bus and take turns transmitting</em>: it keeps RS-422's differential electrical layer but adds a tristate (high-impedance) driver so that every node can electrically "let go" of the wire when it is not its turn. That single addition turns a point-to-point link into a true multidrop, multi-master network — the backbone of industrial fieldbuses.</p>
<p><strong>RS-485</strong> — formally <strong>TIA/EIA-485-A</strong> — is the networking-capable big brother of RS-422. It keeps the same balanced-differential electrical philosophy (decide on $V_B - V_A$, reject common-mode) but adds the one ingredient RS-422 lacks: <strong>multiple drivers can share the same bus</strong>. Each driver has a <strong>tristate (high-impedance) disabled state</strong>, so many nodes can take turns transmitting on a single twisted pair — a true <em>multidrop, multi-master bus</em>.</p>
<p>This makes RS-485 the backbone of industrial fieldbus networking: <strong>Modbus RTU, PROFIBUS, DMX512</strong> (stage lighting), BACnet MS/TP, and countless proprietary sensor networks all ride on RS-485. Its defining specs are the ability to hang <strong>up to 32 "unit loads"</strong> on the bus (extendable to 128 or 256 with fractional-unit-load transceivers), a wide <strong>$-7$ V to $+12$ V common-mode range</strong>, half- or full-duplex operation, and the familiar RS-422 rate/length envelope of 10 Mbps at 12 m down to 100 kbps at 1200 m.</p>`,
    sections: [
      {
        h: 'From RS-422 to a true bus: tristate drivers',
        html: String.raw`<p>The electrical layer of RS-485 is nearly identical to RS-422 — balanced differential pair, decide on the sign of $V_B - V_A$, twisted-pair transmission line — but with one architectural addition. Every RS-485 driver has an <strong>enable input</strong> that can put its outputs into a <strong>high-impedance (tristate) state</strong>. When disabled, the driver electrically "disappears" from the bus, letting another node drive the pair.</p>
<p>This tristate capability is what turns a point-to-point link into a shared <strong>bus</strong>. Because several drivers could in principle drive at once, RS-485 also tightens the electrical spec:</p>
<table class="data">
<tr><th>Parameter</th><th>RS-485 value</th><th>vs RS-422</th></tr>
<tr><td>Driver differential output (loaded)</td><td>$\ge \pm 1.5$ V (up to $\pm 6$ V)</td><td>RS-422: $\ge \pm 2$ V</td></tr>
<tr><td>Receiver sensitivity</td><td>$\pm 200$ mV</td><td>same</td></tr>
<tr><td>Common-mode range</td><td>$-7$ V to $+12$ V</td><td>RS-422: $-7$ to $+7$ V</td></tr>
<tr><td>Driver tristate</td><td>Yes (enable pin)</td><td>RS-422: always on</td></tr>
<tr><td>Bus loading limit</td><td>32 unit loads</td><td>RS-422: 10 receivers</td></tr>
</table>
<p>The slightly lower guaranteed $\pm 1.5$ V driver minimum (vs RS-422's $\pm 2$ V) reflects the heavier bus loading. The wider $-7$ to $+12$ V common-mode range gives extra ground-offset tolerance for nodes scattered across a large plant.</p>`
      },
      {
        h: 'Unit loads and the 32-node rule',
        html: String.raw`<p>RS-485 counts bus loading in <strong>unit loads (UL)</strong>, not simply "devices." One <strong>standard unit load</strong> is defined by a specified V–I characteristic (roughly a device that draws no more than a certain current across the $-7$ to $+12$ V range, corresponding to an input impedance of about <strong>12 kΩ</strong>). A standard driver is guaranteed to hold its differential output across <strong>32 unit loads</strong> in parallel plus the two termination resistors.</p>
<p>Crucially, "32" is <em>unit loads, not necessarily devices</em>. Modern transceivers are often built as <strong>fractional unit loads</strong>:</p>
<table class="data">
<tr><th>Transceiver type</th><th>Input impedance</th><th>Unit-load fraction</th><th>Max devices on bus</th></tr>
<tr><td>Standard (1 UL)</td><td>~12 kΩ</td><td>1</td><td>32</td></tr>
<tr><td>1/2 UL</td><td>~24 kΩ</td><td>0.5</td><td>64</td></tr>
<tr><td>1/4 UL</td><td>~48 kΩ</td><td>0.25</td><td>128</td></tr>
<tr><td>1/8 UL</td><td>~96 kΩ</td><td>0.125</td><td>256</td></tr>
</table>
<p>So an RS-485 segment can host <strong>up to 256 nodes</strong> if every node uses a 1/8-unit-load transceiver ($32 / 0.125 = 256$). The limit is fundamentally about how much current the single active driver must sink/source while still delivering $\ge \pm 1.5$ V — higher-impedance receivers load the driver less, so more can be attached.</p>
<div class="callout"><strong>Remember:</strong> the "32" limit is <em>unit loads</em>. With 1/8-UL parts you can reach 256 devices. The parallel input impedance of all nodes (plus the two 120 Ω terminators) must stay high enough that the driver still meets its $\pm 1.5$ V minimum.</div>`
      },
      {
        h: 'Half-duplex vs full-duplex and 2-wire / 4-wire',
        html: String.raw`<p>RS-485 comes in two wiring styles:</p>
<ul>
<li><strong>2-wire, half-duplex:</strong> a single twisted pair shared by all nodes for both directions. Only one node transmits at a time; all others listen. Each node's driver is tristated except when it is its turn to talk. This is the most common form (Modbus RTU, DMX). It requires a <strong>direction-control</strong> mechanism — software or hardware toggles the driver enable (DE) and receiver enable (RE̅) pins to "turn around" the bus, and there is a small <em>turnaround time</em> before the line settles.</li>
<li><strong>4-wire, full-duplex:</strong> two pairs, one for master→slaves and one for slaves→master. The master drives one pair continuously; slaves share the other pair (still one talker at a time, tristated otherwise). This eases direction control but the return pair is still multidrop, so it is not truly "everyone talks at once."</li>
</ul>
<p>Because the medium is shared, RS-485 needs a <strong>higher-layer protocol</strong> for addressing and arbitration (which node may talk, and to whom). RS-485 itself provides only the electrical bus; Modbus RTU, PROFIBUS, etc. supply the master/slave polling, node addresses, and collision avoidance.</p>`
      },
      {
        h: 'Topology, termination, and biasing',
        html: String.raw`<p>The correct RS-485 topology is a <strong>daisy-chained linear bus (a "backbone")</strong> with short stubs to each node — <em>not</em> a star or ring. Stubs must be short because each unterminated stub end reflects. Both <strong>ends of the backbone are terminated with $120\ \Omega$</strong> resistors (matching the typical twisted-pair $Z_0$) to absorb signal energy and prevent reflections. Note: two terminators, one at each far end — not one per node.</p>
<p>A second issue unique to a shared bus is the <strong>idle (undriven) state</strong>. When <em>all</em> drivers are tristated (no one transmitting), the bus floats, and noise could push it across the $\pm 200$ mV threshold, producing false start bits. <strong>Fail-safe biasing</strong> fixes this: pull-up and pull-down resistors gently bias the pair to a defined idle (mark) state so a floating bus reads as a valid idle, not garbage. Many modern transceivers include internal fail-safe.</p>
<table class="data">
<tr><th>Resistor</th><th>Value (typical)</th><th>Purpose</th></tr>
<tr><td>Termination (×2)</td><td>120 Ω</td><td>Match $Z_0$, kill reflections — one at each bus end</td></tr>
<tr><td>Bias pull-up (to $V_{cc}$)</td><td>~560 Ω–1 kΩ</td><td>Fail-safe idle: force B > A when bus floats</td></tr>
<tr><td>Bias pull-down (to GND)</td><td>~560 Ω–1 kΩ</td><td>Fail-safe idle pair</td></tr>
</table>`
      },
      {
        h: 'Encoding, framing, and clocking',
        html: String.raw`<p>Like RS-422, RS-485 is <strong>only the electrical layer</strong>: it defines differential voltages, bus loading, and driver enable behaviour, not the data format. In practice it carries <strong>asynchronous NRZ UART framing</strong> — the same start/data/parity/stop 8N1-style characters as RS-232 — layered under a protocol like Modbus RTU. There is no clock wire; each receiving node oversamples and re-synchronises on start bits.</p>
<p>The async UART character frame each byte uses, field by field:</p>
<table class="data">
<tr><th>Field</th><th>Width</th><th>Value / order</th><th>Meaning</th></tr>
<tr><td>Start</td><td>1 bit</td><td>SPACE (0)</td><td>Marks the start of a character; its edge is the timing reference</td></tr>
<tr><td>Data</td><td>5–9 bits (usually 8)</td><td>LSB first</td><td>The payload character</td></tr>
<tr><td>Parity</td><td>0 or 1 bit</td><td>none / even / odd</td><td>Optional single-bit error check (Modbus RTU commonly uses even parity)</td></tr>
<tr><td>Stop</td><td>1, 1.5, or 2 bits</td><td>MARK (1)</td><td>Returns the line to idle before the next frame</td></tr>
</table>
<p>Around this UART frame, half-duplex RS-485 adds a <strong>driver-enable (DE) framing</strong> envelope: before its first start bit a node must assert DE, wait a short <em>enable/settle</em> time for the line to reach a valid level, transmit all the character frames of its packet, then <strong>tristate DE promptly after the final stop bit</strong> so another node can drive the bus. Mis-timing this turnaround (tristating mid-byte, or holding DE and colliding with the next talker) is the classic RS-485 fault. The <strong>packet that these characters form is defined by the higher layer</strong> — e.g. Modbus RTU frames a packet as address + function + data + CRC, delimited by a silent gap (see below); RS-485 itself only defines the electrical byte transport.</p>
<p>The key addition over a simple UART is <strong>bus turnaround timing</strong>. In 2-wire half-duplex, a node must assert its driver enable, wait for the line to settle, send its frame, then <em>promptly tristate</em> before the next node speaks. Modbus RTU, for instance, delimits frames by a <strong>silent interval of at least 3.5 character-times</strong>; the master waits this gap and manages who transmits. Getting the DE/RE̅ toggle timing right (not tristating mid-byte, not colliding with the peer) is the classic RS-485 firmware pitfall.</p>`
      },
      {
        h: 'Data rate, length, and the rate–length trade-off',
        html: String.raw`<p>RS-485 inherits RS-422's transmission-line envelope: <strong>10 Mbps at ~12 m (40 ft)</strong> tapering to <strong>100 kbps at ~1200 m (4000 ft)</strong>, with rate × length roughly constant in between. The same physics applies — longer cable attenuates high frequencies and adds propagation delay, so bits must be held longer.</p>
<table class="data">
<tr><th>Cable length</th><th>Approx. max data rate</th></tr>
<tr><td>12 m</td><td>10 Mbps</td></tr>
<tr><td>120 m</td><td>~1 Mbps</td></tr>
<tr><td>1200 m</td><td>~100 kbps (Modbus commonly 9600–115200)</td></tr>
</table>
<p>On a multidrop bus, additional practical limits appear: the number and length of stubs, the total capacitive load of many transceivers, and the bus turnaround time all reduce the achievable rate below the pure point-to-point figures. Real fieldbus deployments (Modbus RTU, PROFIBUS DP) typically run 9.6 kbps to 12 Mbps depending on cable length and node count. Longer or larger networks use <strong>repeaters</strong> to start a fresh segment (each repeater resets the unit-load and length budget).</p>`
      },
      {
        h: 'Standard, use cases, pros/cons and comparison',
        html: String.raw`<p>The standard is maintained by the <strong>TIA (TIA/EIA-485-A)</strong>, sometimes still called EIA-485; the DIN/PROFIBUS world references it too. It mandates no connector — screw terminals, DE-9, and RJ-45 are all used.</p>
<p><strong>Use cases:</strong> Modbus RTU sensor/PLC networks, PROFIBUS DP factory automation, DMX512 stage lighting (up to 32 fixtures per universe — a direct 32-UL heritage), BACnet MS/TP building automation, solar-inverter and battery-management communication, security/access-control panels, and long multidrop instrumentation links.</p>
<p><strong>Pros:</strong> true multidrop bus (up to 256 nodes), long reach, high speed, robust differential noise immunity, wide $-7$ to $+12$ V common-mode range, cheap transceivers. <strong>Cons:</strong> shared medium needs a higher-layer protocol for addressing/arbitration; half-duplex turnaround adds latency and firmware complexity; requires correct termination, biasing, and daisy-chain topology (star wiring fails); one shorted/babbling node can take down the bus.</p>
<table class="data">
<tr><th>Property</th><th>RS-232</th><th>RS-422</th><th>RS-485</th><th>LVDS</th></tr>
<tr><td>Signaling</td><td>Single-ended</td><td>Differential</td><td>Differential (tristate)</td><td>Differential (current-mode)</td></tr>
<tr><td>Drivers</td><td>1</td><td>1 (always on)</td><td><strong>many (tristate-able)</strong></td><td>typ. 1</td></tr>
<tr><td>Nodes</td><td>2</td><td>1 drv + 10 rcv</td><td><strong>32 UL → up to 256</strong></td><td>2</td></tr>
<tr><td>Topology</td><td>Point-to-point</td><td>Broadcast multidrop</td><td>Multi-master bus (daisy chain)</td><td>Point-to-point</td></tr>
<tr><td>Duplex</td><td>Full</td><td>Full</td><td>Half (2-wire) or full (4-wire)</td><td>Simplex per pair</td></tr>
<tr><td>Common-mode range</td><td>none</td><td>$-7$ to $+7$ V</td><td><strong>$-7$ to $+12$ V</strong></td><td>~$\pm 1$ V</td></tr>
<tr><td>Termination</td><td>none</td><td>far end</td><td><strong>120 Ω both ends + bias</strong></td><td>100 Ω at receiver</td></tr>
<tr><td>Distance / rate</td><td>15 m / 115 kbps</td><td>1200 m / 10 Mbps@12m</td><td>1200 m / 10 Mbps@12m</td><td>~10 m / Gbps</td></tr>
<tr><td>Standard</td><td>TIA-232</td><td>TIA-422</td><td>TIA-485</td><td>TIA-644</td></tr>
</table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">RS-485 = RS-422's differential physics + one tristate driver, and almost everything else follows from making a <em>shared</em> bus work.</div>
<ul>
<li><strong>Tristate drivers make it a bus.</strong> Each driver can go high-impedance, so many nodes hang off one pair and take turns — a true multidrop, multi-master network, unlike RS-422's single always-on driver.</li>
<li><strong>Loading is counted in unit loads.</strong> A standard driver holds 32 UL (1 UL ≈ 12 kΩ); fractional-UL parts (1/8 UL ≈ 96 kΩ) extend the count to $32/0.125 = 256$ devices.</li>
<li><strong>Sharing a wire needs discipline.</strong> Terminate 120 Ω at <em>both</em> ends of a daisy-chained backbone (never a star), and add fail-safe bias so an idle bus with all drivers tristated still reads a valid mark.</li>
<li><strong>Half-duplex costs turnaround.</strong> A node asserts DE, sends, then must tristate promptly — too early clips a byte, too late collides; the settling delay is real overhead on long buses.</li>
<li><strong>RS-485 is only the electrical layer.</strong> Addressing and arbitration come from a higher protocol (Modbus RTU, PROFIBUS, DMX512, BACnet MS/TP) carried as ordinary async UART frames.</li>
<li><strong>Wider common mode, same rate–length envelope.</strong> The $-7$ to $+12$ V range tolerates big plant ground offsets; reach still runs 10 Mbps @ ~12 m down to 100 kbps @ ~1200 m, extended by repeaters.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`RS-485 = RS-422's differential electrical layer <strong>plus tristate drivers</strong>, enabling a true <strong>multidrop, multi-master bus</strong>.`,
      String.raw`Loading is counted in <strong>unit loads (UL)</strong>: a standard driver supports <strong>32 UL</strong>; 1 UL ≈ 12 kΩ input.`,
      String.raw`With fractional-UL transceivers (1/8 UL ≈ 96 kΩ) a segment reaches <strong>up to 256 devices</strong> ($32/0.125$).`,
      String.raw`Driver output $\ge \pm 1.5$ V (heavier bus load than RS-422's $\pm 2$ V); receiver threshold still $\pm 200$ mV.`,
      String.raw`Wide common-mode range <strong>$-7$ V to $+12$ V</strong> tolerates larger ground offsets across a plant.`,
      String.raw`Wiring: <strong>2-wire half-duplex</strong> (one shared pair, direction control via DE/RE̅) or <strong>4-wire full-duplex</strong> (separate master/slave pairs).`,
      String.raw`Topology must be a <strong>daisy-chained linear bus</strong> with short stubs; <strong>terminate 120 Ω at BOTH ends</strong> — not stars/rings.`,
      String.raw`<strong>Fail-safe bias</strong> pull-up/pull-down resistors force a valid idle when all drivers are tristated (a floating bus would give false start bits).`,
      String.raw`RS-485 is the electrical layer only; it carries async NRZ UART framing under a higher-layer protocol (<strong>Modbus RTU, PROFIBUS, DMX512, BACnet MS/TP</strong>).`,
      String.raw`Half-duplex needs <strong>bus turnaround timing</strong>: enable driver, send, tristate promptly; the master arbitrates who talks.`,
      String.raw`Same rate–length envelope as RS-422: <strong>10 Mbps @ ~12 m ⟶ 100 kbps @ ~1200 m</strong>; repeaters extend beyond one segment.`,
      String.raw`Standard body: <strong>TIA (TIA-485-A)</strong>; no mandated connector.`
    ],
    equations: [
      {
        title: 'Maximum devices from unit loads',
        tex: String.raw`$$N_{\text{dev}} = \frac{N_{\text{UL,max}}}{u}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A standard RS-485 driver is specified to still deliver $\ge \pm 1.5$ V while driving $N_{\text{UL,max}} = 32$ standard unit loads plus the two terminators. Each device presents a unit-load fraction $u$ (1 for a standard part, 1/8 for a high-impedance part).</p>
<p><b>Step 1 — the total load budget is fixed.</b> The sum of all devices' unit loads may not exceed 32:</p>
$$N_{\text{dev}}\cdot u \le 32.$$
<p><b>Step 2 — solve for the device count.</b></p>
$$N_{\text{dev}} = \frac{32}{u}.$$
<p><b>Result.</b> For standard parts $u=1$: $N_{\text{dev}} = 32$. For 1/8-UL parts $u = 0.125$: $$N_{\text{dev}} = \frac{32}{0.125} = 256.$$ Sanity check: a 1/8-UL transceiver has ~$8\times$ the input impedance (~96 kΩ vs ~12 kΩ), so it loads the driver 1/8 as much, allowing $8\times$ as many nodes.</p>`
      },
      {
        title: 'Parallel bus load impedance',
        tex: String.raw`$$R_{\text{bus}} = \left(\frac{2}{R_T} + \frac{N}{R_{\text{in}}}\right)^{-1}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The active driver sees, in parallel, the two termination resistors $R_T$ (one at each end) and the input resistance $R_{\text{in}}$ of each of the $N$ nodes.</p>
<p><b>Step 1 — add conductances (parallel resistors add in $1/R$).</b> Two terminators contribute $2/R_T$; $N$ receivers contribute $N/R_{\text{in}}$:</p>
$$\frac{1}{R_{\text{bus}}} = \frac{2}{R_T} + \frac{N}{R_{\text{in}}}.$$
<p><b>Step 2 — invert.</b></p>
$$R_{\text{bus}} = \left(\frac{2}{R_T} + \frac{N}{R_{\text{in}}}\right)^{-1}.$$
<p><b>Result.</b> With $R_T = 120\ \Omega$ and $N = 32$ standard loads of $R_{\text{in}} = 12\ \text{k}\Omega$: terminators give $2/120 = 16.7$ mS and receivers give $32/12000 = 2.67$ mS, total $19.3$ mS, so $$R_{\text{bus}} = 51.7\ \Omega.$$ Sanity check: the driver must push $\pm 1.5$ V into ~52 Ω, i.e. source about $1.5/51.7 = 29$ mA — within a standard RS-485 driver's capability. The terminators dominate the load, which is why the receiver count barely stresses the driver.</p>`
      },
      {
        title: 'Rate–length product (rule of thumb)',
        tex: String.raw`$$R_b \cdot L \approx \text{constant} \approx 10^8\ \text{bit·m/s}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A cable behaves as a low-pass channel: its usable bandwidth $B$ falls inversely with length $L$ (longer cable attenuates high frequencies and disperses edges), so $B \approx k/L$ for some cable constant $k$.</p>
<p><b>Step 1 — relate bit rate to bandwidth.</b> For NRZ signalling the achievable bit rate is proportional to the channel bandwidth, $R_b \approx \alpha B$.</p>
<p><b>Step 2 — substitute.</b></p>
$$R_b \approx \alpha B = \alpha \frac{k}{L} \quad\Rightarrow\quad R_b \cdot L \approx \alpha k = \text{constant}.$$
<p><b>Result.</b> Calibrating to the standard's anchor points — 10 Mbps at 12 m gives $10^7 \times 12 = 1.2\times 10^8$; 100 kbps at 1200 m gives $10^5 \times 1200 = 1.2\times 10^8$ — the product is indeed roughly constant: $$R_b \cdot L \approx 1.2\times 10^8\ \text{bit·m/s}.$$ Sanity check: halving the rate to 50 kbps predicts $\sim 2400$ m, and doubling to 20 Mbps predicts $\sim 6$ m — both consistent with observed behaviour.</p>`
      },
      {
        title: 'Bus turnaround / settling constraint',
        tex: String.raw`$$t_{\text{turn}} \ge 2\,t_{pd} + t_{\text{driver}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> In 2-wire half-duplex, after one node stops driving, the bus must settle before another node's data is valid. The relevant times are the one-way propagation delay $t_{pd} = L/v$ and the transceiver enable/disable delay $t_{\text{driver}}$.</p>
<p><b>Step 1 — account for a round trip.</b> A change launched at one end must propagate to the far end and any reflection must die out; conservatively allow a round-trip $2\,t_{pd}$.</p>
<p><b>Step 2 — add transceiver switching.</b> The driver takes $t_{\text{driver}}$ to disable and the next to enable and reach a valid level:</p>
$$t_{\text{turn}} \ge 2\,t_{pd} + t_{\text{driver}}.$$
<p><b>Result.</b> For $L = 1200$ m at $v = 2\times 10^8$ m/s, $t_{pd} = 6\ \mu\text{s}$, so $2 t_{pd} = 12\ \mu\text{s}$; add a few µs of transceiver delay and $$t_{\text{turn}} \gtrsim 15\ \mu\text{s}.$$ Sanity check: at 100 kbps a bit is 10 µs, so turnaround costs ~1–2 bit-times on a long bus — the reason half-duplex RS-485 loses throughput to direction switching, and why firmware must not tristate too early.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What does RS-485 add to the RS-422 electrical layer?`, back: String.raw`Tristate (high-impedance) drivers with an enable pin, so multiple drivers can share one bus — a true multidrop, multi-master bus.` },
      { front: String.raw`How many unit loads can a standard RS-485 driver support?`, back: String.raw`32 unit loads (plus the two terminators), while still delivering $\ge \pm 1.5$ V.` },
      { front: String.raw`What is one unit load?`, back: String.raw`A defined V–I characteristic corresponding to ~12 kΩ input impedance across the $-7$ to $+12$ V range.` },
      { front: String.raw`How do you reach 256 devices on one segment?`, back: String.raw`Use 1/8-unit-load transceivers (~96 kΩ): $32 / 0.125 = 256$ devices.` },
      { front: String.raw`RS-485 common-mode range?`, back: String.raw`$-7$ V to $+12$ V — wider than RS-422's $-7$ to $+7$ V, for bigger ground offsets.` },
      { front: String.raw`Driver output and receiver threshold?`, back: String.raw`Driver $\ge \pm 1.5$ V (loaded); receiver sensitivity $\pm 200$ mV.` },
      { front: String.raw`2-wire vs 4-wire RS-485?`, back: String.raw`2-wire = half-duplex, one shared pair with direction control; 4-wire = full-duplex, separate master and slave pairs.` },
      { front: String.raw`How is an RS-485 bus terminated?`, back: String.raw`120 Ω at BOTH ends of the daisy-chained backbone (matching $Z_0$). Two terminators total.` },
      { front: String.raw`What is fail-safe biasing and why?`, back: String.raw`Pull-up/pull-down resistors that force a valid idle (mark) when all drivers are tristated, so a floating bus does not produce false start bits.` },
      { front: String.raw`What topology must RS-485 use?`, back: String.raw`A daisy-chained linear bus (backbone) with short stubs — not a star or ring.` },
      { front: String.raw`Name protocols that run over RS-485.`, back: String.raw`Modbus RTU, PROFIBUS DP, DMX512, BACnet MS/TP — RS-485 is only the electrical layer; these add addressing/arbitration.` },
      { front: String.raw`What is bus turnaround?`, back: String.raw`In half-duplex, the delay to switch driver enable off/on and let the line settle before the next node transmits; adds latency and is a firmware pitfall.` },
      { front: String.raw`RS-485 rate–length envelope?`, back: String.raw`10 Mbps at ~12 m down to 100 kbps at ~1200 m; use repeaters to extend beyond one segment.` },
      { front: String.raw`How does DMX512 relate to RS-485?`, back: String.raw`DMX512 stage lighting is an RS-485-based protocol; the classic 32-fixture-per-universe limit comes directly from the 32-unit-load rule.` }
    ],
    mcqs: [
      { q: String.raw`The key feature distinguishing RS-485 from RS-422 is:`, options: [String.raw`Single-ended signalling`, String.raw`Tristate drivers allowing a multi-master bus`, String.raw`A mandatory connector`, String.raw`Lower voltage`], answer: 1, explain: String.raw`Tristate (high-Z) drivers let many nodes share one pair — a true multidrop bus.` },
      { q: String.raw`A standard RS-485 driver supports how many unit loads?`, options: [String.raw`10`, String.raw`32`, String.raw`128`, String.raw`256`], answer: 1, explain: String.raw`32 unit loads plus the two terminators, still meeting $\pm 1.5$ V.` },
      { q: String.raw`Using 1/8-unit-load transceivers, the maximum node count is:`, options: [String.raw`32`, String.raw`64`, String.raw`128`, String.raw`256`], answer: 3, explain: String.raw`$32 / 0.125 = 256$ devices.` },
      { q: String.raw`RS-485 common-mode input range is:`, options: [String.raw`$-7$ to $+7$ V`, String.raw`$-7$ to $+12$ V`, String.raw`$0$ to $5$ V`, String.raw`$\pm 15$ V`], answer: 1, explain: String.raw`$-7$ to $+12$ V — wider than RS-422 to handle larger ground offsets.` },
      { q: String.raw`How should an RS-485 bus be terminated?`, options: [String.raw`120 Ω at one end`, String.raw`120 Ω at both ends`, String.raw`120 Ω at every node`, String.raw`Not terminated`], answer: 1, explain: String.raw`One 120 Ω terminator at each end of the daisy-chained backbone (two total).` },
      { q: String.raw`Fail-safe bias resistors are used to:`, options: [String.raw`Terminate the line`, String.raw`Set a valid idle state when all drivers are tristated`, String.raw`Limit driver current`, String.raw`Speed up edges`], answer: 1, explain: String.raw`They force a defined mark/idle so a floating bus doesn't create false start bits.` },
      { q: String.raw`2-wire RS-485 is:`, options: [String.raw`Full-duplex`, String.raw`Half-duplex (shared pair, direction control)`, String.raw`Simplex only`, String.raw`Clocked`], answer: 1, explain: String.raw`One shared pair; nodes take turns via driver-enable direction control — half-duplex.` },
      { q: String.raw`Which protocol commonly runs over RS-485?`, options: [String.raw`HDMI`, String.raw`Modbus RTU`, String.raw`I²C`, String.raw`SPI`], answer: 1, explain: String.raw`Modbus RTU (also PROFIBUS, DMX512, BACnet MS/TP) uses the RS-485 electrical bus.` },
      { q: String.raw`The correct RS-485 topology is:`, options: [String.raw`Star`, String.raw`Ring`, String.raw`Daisy-chained linear bus with short stubs`, String.raw`Mesh`], answer: 2, explain: String.raw`A linear backbone with short stubs; stars/rings cause reflections.` },
      { q: String.raw`RS-485 minimum guaranteed driver differential output is:`, options: [String.raw`$\pm 200$ mV`, String.raw`$\pm 1.5$ V`, String.raw`$\pm 2$ V`, String.raw`$\pm 5$ V`], answer: 1, explain: String.raw`$\ge \pm 1.5$ V loaded (lower than RS-422's $\pm 2$ V because the bus is more heavily loaded).` },
      { q: String.raw`Why does half-duplex RS-485 lose some throughput?`, options: [String.raw`Parity overhead`, String.raw`Bus turnaround / direction-switching time`, String.raw`Clock recovery`, String.raw`Encryption`], answer: 1, explain: String.raw`After each transmission the bus must turn around (disable one driver, enable another, settle), adding latency.` },
      { q: String.raw`To extend an RS-485 network beyond one 32-UL / 1200 m segment you use:`, options: [String.raw`A longer terminator`, String.raw`A repeater (starts a fresh segment)`, String.raw`Higher voltage`, String.raw`A star hub`], answer: 1, explain: String.raw`A repeater regenerates the signal and resets the unit-load and length budget for a new segment.` }
    ],
    numericals: [
      { q: String.raw`An RS-485 bus uses transceivers rated at 1/4 unit load. How many can share one segment, and what is each device's approximate input impedance?`, solution: String.raw`<p><b>Formula.</b> $$N_{\text{dev}} = \frac{N_{\text{UL,max}}}{u}, \qquad R_{\text{in}} = \frac{R_{\text{1UL}}}{u}$$ where $N_{\text{UL,max}}=32$ is the driver's unit-load budget, $u$ the per-device unit-load fraction, and $R_{\text{1UL}}\approx12\ \text{k}\Omega$ the one-UL input impedance.</p>
<p><b>Substitute.</b> $$N_{\text{dev}} = \frac{32}{0.25}, \qquad R_{\text{in}} = \frac{12\ \text{k}\Omega}{0.25}$$</p>
<p><b>Compute.</b> $N_{\text{dev}} = 128$ devices; $R_{\text{in}} = 48\ \text{k}\Omega$.</p>
<p><b>Explanation.</b> A 1/4-UL transceiver has 4× the input impedance (48 kΩ), so it loads the driver one-quarter as much and 4× as many can share the bus (128 vs 32). This is the general mechanism by which fractional-UL parts extend node count without violating the driver's current budget.</p>` },
      { q: String.raw`Compute the driver load for a bus with two 120 Ω terminators and 32 receivers of 12 kΩ each. How much current must the driver source to hold $\pm 1.5$ V?`, solution: String.raw`<p><b>Formula.</b> Parallel elements add in conductance: $$\frac{1}{R_{\text{bus}}} = \frac{2}{R_T} + \frac{N}{R_{\text{in}}}, \qquad I = \frac{V_{\text{od}}}{R_{\text{bus}}}$$ with two terminators $R_T=120\ \Omega$, $N=32$ receivers of $R_{\text{in}}=12\ \text{k}\Omega$, and target output $V_{\text{od}}=1.5$ V.</p>
<p><b>Substitute.</b> $$\frac{1}{R_{\text{bus}}} = \frac{2}{120} + \frac{32}{12000}, \qquad I = \frac{1.5}{R_{\text{bus}}}$$</p>
<p><b>Compute.</b> Terminators $= 16.67$ mS; receivers $= 2.67$ mS; total $= 19.34$ mS $\Rightarrow R_{\text{bus}} = 51.7\ \Omega$. $I = 1.5/51.7 = 29$ mA.</p>
<p><b>Explanation.</b> The driver need only source ~29 mA, well within a standard RS-485 driver's ~60 mA capability. Notice the two terminators (16.67 mS) dominate over all 32 receivers (2.67 mS) — the reason receiver count barely stresses the driver and termination is the real load.</p>` },
      { q: String.raw`Using the rate × length ≈ $1.2\times 10^8$ bit·m/s rule, what is the maximum data rate on a 500 m RS-485 cable?`, solution: String.raw`<p><b>Formula.</b> $$R_{\max} \approx \frac{(R_b\cdot L)_{\text{const}}}{L}$$ where $(R_b\cdot L)_{\text{const}}\approx1.2\times10^8$ bit·m/s is the RS-485 rate–length product and $L$ the length.</p>
<p><b>Substitute.</b> $$R_{\max} \approx \frac{1.2\times10^8}{500}$$</p>
<p><b>Compute.</b> $$R_{\max} \approx 2.4\times10^5\ \text{bit/s} = 240\ \text{kbps}.$$</p>
<p><b>Explanation.</b> The cable supports up to ~240 kbps at 500 m. In practice engineers pick a standard rate at or below this — e.g. 187.5 kbps (a common PROFIBUS rate) or 115.2 kbps for margin — since real multidrop buses derate further for stubs, loading, and turnaround.</p>` },
      { q: String.raw`A 1200 m half-duplex RS-485 bus runs at 100 kbps (velocity $2\times 10^8$ m/s). Estimate the turnaround delay and express it in bit-times.`, solution: String.raw`<p><b>Formula.</b> $$t_{pd} = \frac{L}{v}, \qquad t_{\text{turn}} \ge 2\,t_{pd} + t_{\text{driver}}, \qquad n = \frac{t_{\text{turn}}}{T_b}$$ where $t_{pd}$ is one-way delay, $t_{\text{driver}}$ the transceiver enable/disable time, and $T_b=1/R_b$ the bit time.</p>
<p><b>Substitute.</b> $$t_{pd} = \frac{1200}{2\times10^8}, \qquad t_{\text{turn}} = 2t_{pd} + 3\ \mu\text{s}, \qquad n = \frac{t_{\text{turn}}}{10\ \mu\text{s}}$$</p>
<p><b>Compute.</b> $t_{pd} = 6\ \mu\text{s}$; $2t_{pd} = 12\ \mu\text{s}$; $t_{\text{turn}} \approx 12 + 3 = 15\ \mu\text{s}$. Bit time $T_b = 1/10^5 = 10\ \mu\text{s}$, so $n = 15/10 = 1.5$ bit-times.</p>
<p><b>Explanation.</b> Each direction change costs ~1.5 bit-times of dead air. When a master polls many short frames this turnaround overhead accumulates and cuts throughput — the reason half-duplex RS-485 firmware must tri-state promptly but not early, and why long buses favour fewer, longer messages.</p>` },
      { q: String.raw`A plant has nodes whose grounds vary by up to 9 V, plus 2 V of induced common-mode noise. Is RS-485 within its common-mode range? Would RS-422 survive?`, solution: String.raw`<p><b>Formula.</b> $$V_{\text{cm}} = V_{\text{gnd}} + V_{\text{noise}}, \qquad V_{\text{cm}} \le V_{\text{cm,max}}$$ compared against RS-485's $+12$ V and RS-422's $+7$ V upper limits.</p>
<p><b>Substitute.</b> $$V_{\text{cm}} = 9\ \text{V} + 2\ \text{V}$$</p>
<p><b>Compute.</b> $V_{\text{cm}} = 11$ V. RS-485: $11 < 12$ V (in range). RS-422: $11 > 7$ V (out of range).</p>
<p><b>Explanation.</b> RS-485 survives the 11 V common-mode; RS-422 would not. This is exactly why RS-485 widened the common-mode window to $-7\ldots+12$ V: large multidrop plants accumulate big ground offsets, and the extra headroom keeps a scattered bus reliable.</p>` }
    ],
    realWorld: String.raw`<p>RS-485 is the dominant physical layer of industrial and building networks. <strong>Modbus RTU</strong> — the lingua franca of PLCs, VFDs, power meters, and sensors — runs on 2-wire half-duplex RS-485, typically at 9600–115200 baud over daisy-chained shielded twisted pair with 120 Ω terminators at each end and fail-safe bias resistors. <strong>PROFIBUS DP</strong> pushes RS-485 to 12 Mbps over short segments in automotive and process plants. <strong>DMX512</strong> stage-lighting control is RS-485 at 250 kbps, and its historical 32-fixture-per-"universe" limit is a direct consequence of the 32-unit-load rule. <strong>BACnet MS/TP</strong> networks HVAC and building controllers, and solar inverters, EV chargers, and battery-management systems widely use RS-485 for their comms bus. The recurring field problems are all about the physical layer: missing or doubled termination, star wiring instead of daisy-chain, no fail-safe bias (bus floats and drops offline), and firmware that tristates the driver too early and clips the last byte, or too late and collides with the next talker. When a design needs more than 32 loads it moves to 1/8-UL transceivers (up to 256) or inserts repeaters; when it needs gigabit rates over a backplane it moves to LVDS or high-speed serial instead.</p>`,
    related: ['rs422', 'rs232', 'lvds', 'noise']
  },
  {
    id: 'lvds',
    title: 'LVDS',
    category: 'Interfaces & Protocols',
    tags: ['lvds', 'differential', 'current-mode', 'tia-644', 'high-speed', 'fpd-link', 'serdes', 'low-power', 'displays'],
    summary: String.raw`LVDS (Low-Voltage Differential Signaling, TIA/EIA-644) is a current-mode differential interface with a ~350 mV swing on a $100\,\Omega$-terminated pair about a ~1.2 V common mode, delivering gigabit rates at very low power and low EMI over short point-to-point links (displays, FPD-Link, camera links, backplanes).`,
    diagram: [{ svg: String.raw`<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-lvds" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="20" y="75" width="120" height="70" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="80" y="103" fill="#e6edf3" text-anchor="middle" font-weight="bold">Driver</text>
<text x="80" y="120" fill="#9aa7b5" text-anchor="middle" font-size="10">current source</text>
<text x="80" y="134" fill="#63e6be" text-anchor="middle" font-size="10">~3.5 mA</text>
<rect x="400" y="75" width="120" height="70" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="460" y="103" fill="#e6edf3" text-anchor="middle" font-weight="bold">Receiver</text>
<text x="460" y="120" fill="#9aa7b5" text-anchor="middle" font-size="10">comparator</text>
<text x="460" y="134" fill="#9aa7b5" text-anchor="middle" font-size="10">V&#7580;&#8776;1.2 V</text>
<line x1="140" y1="95" x2="360" y2="95" stroke="#63e6be" marker-end="url(#arr-lvds)"/>
<line x1="360" y1="125" x2="140" y2="125" stroke="#ffa94d" marker-end="url(#arr-lvds)"/>
<text x="250" y="88" fill="#9aa7b5" text-anchor="middle" font-size="10">differential pair (100&#937; traces)</text>
<line x1="360" y1="95" x2="360" y2="125" stroke="#b197fc" stroke-width="2"/>
<text x="360" y="150" fill="#b197fc" text-anchor="middle" font-size="10">100&#937;</text>
<text x="270" y="180" fill="#e6edf3" text-anchor="middle" font-size="10">3.5 mA &#215; 100 &#937; = 350 mV across the termination</text>
<text x="270" y="198" fill="#9aa7b5" text-anchor="middle" font-size="10">point-to-point SerDes; low swing &#8594; low power, low EMI</text>
</svg>`, caption: String.raw`LVDS: a ~3.5 mA current-mode driver steers current down a 100&#937; differential pair, developing ~350 mV across the receiver-end termination (point-to-point).` },
      { title: String.raw`Current-steering detail: 3.5 mA to &#177;350 mV`, svg: String.raw`<svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr2-lvds" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="30" y="60" width="120" height="120" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="90" y="88" fill="#e6edf3" text-anchor="middle" font-weight="bold" font-size="11">Current source</text>
<text x="90" y="106" fill="#63e6be" text-anchor="middle" font-size="10">3.5 mA (constant)</text>
<text x="90" y="128" fill="#9aa7b5" text-anchor="middle" font-size="9">4 switches steer</text>
<text x="90" y="143" fill="#9aa7b5" text-anchor="middle" font-size="9">DIRECTION only</text>
<text x="90" y="165" fill="#ffa94d" text-anchor="middle" font-size="9">supply I &#8776; const</text>
<line x1="150" y1="90" x2="400" y2="90" stroke="#63e6be" stroke-width="2" marker-end="url(#arr2-lvds)"/>
<text x="270" y="83" fill="#63e6be" text-anchor="middle" font-size="9">out on + wire</text>
<line x1="400" y1="150" x2="150" y2="150" stroke="#ffa94d" stroke-width="2" marker-end="url(#arr2-lvds)"/>
<text x="270" y="166" fill="#ffa94d" text-anchor="middle" font-size="9">return on &#8722; wire (equal/opposite)</text>
<rect x="395" y="85" width="24" height="70" rx="3" fill="#1c232e" stroke="#b197fc"/>
<text x="430" y="124" fill="#b197fc" text-anchor="middle" font-size="10">100&#937;</text>
<rect x="455" y="70" width="70" height="100" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="490" y="112" fill="#e6edf3" text-anchor="middle" font-size="10">Rx</text>
<text x="490" y="128" fill="#9aa7b5" text-anchor="middle" font-size="9">comp.</text>
<rect x="60" y="195" width="430" height="38" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="275" y="213" fill="#e6edf3" text-anchor="middle" font-size="10">V = I&#215;R = 3.5 mA &#215; 100&#937; = &#177;350 mV across the termination</text>
<text x="275" y="227" fill="#9aa7b5" text-anchor="middle" font-size="9">constant current, only its path flips &#8594; low supply noise, low EMI</text>
</svg>`, caption: String.raw`Current-steering: a constant 3.5 mA is steered down the + wire and back the &#8722; wire (direction flips per bit); across the 100&#937; termination it develops &#177;350 mV by Ohm's law. Because the magnitude is constant and the two currents are equal/opposite, supply noise and EMI stay very low.` },
      { title: String.raw`SerDes chain: parallel to LVDS lanes and back`, svg: String.raw`<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr3-lvds" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="20" y="65" width="90" height="70" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="65" y="93" fill="#e6edf3" text-anchor="middle" font-size="10">Parallel</text>
<text x="65" y="109" fill="#9aa7b5" text-anchor="middle" font-size="9">wide bus</text>
<rect x="140" y="65" width="90" height="70" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="185" y="93" fill="#e6edf3" text-anchor="middle" font-size="10">Serializer</text>
<text x="185" y="109" fill="#9aa7b5" text-anchor="middle" font-size="9">7:1 / 8b10b</text>
<rect x="310" y="65" width="90" height="70" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="355" y="93" fill="#e6edf3" text-anchor="middle" font-size="10">Deserializer</text>
<text x="355" y="109" fill="#9aa7b5" text-anchor="middle" font-size="9">CDR / PLL</text>
<rect x="430" y="65" width="90" height="70" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="475" y="93" fill="#e6edf3" text-anchor="middle" font-size="10">Parallel</text>
<text x="475" y="109" fill="#9aa7b5" text-anchor="middle" font-size="9">recovered</text>
<line x1="110" y1="100" x2="140" y2="100" stroke="#9aa7b5" marker-end="url(#arr3-lvds)"/>
<line x1="230" y1="88" x2="310" y2="88" stroke="#63e6be" stroke-width="2" marker-end="url(#arr3-lvds)"/>
<line x1="230" y1="100" x2="310" y2="100" stroke="#63e6be" stroke-width="2" marker-end="url(#arr3-lvds)"/>
<line x1="230" y1="112" x2="310" y2="112" stroke="#ffa94d" stroke-width="2" marker-end="url(#arr3-lvds)"/>
<text x="270" y="78" fill="#9aa7b5" text-anchor="middle" font-size="9">few LVDS lanes + clk pair</text>
<line x1="400" y1="100" x2="430" y2="100" stroke="#9aa7b5" marker-end="url(#arr3-lvds)"/>
<text x="270" y="160" fill="#9aa7b5" text-anchor="middle" font-size="10">a wide slow bus becomes a few fast 350 mV pairs, then is rebuilt at the far end</text>
</svg>`, caption: String.raw`SerDes chain: a wide parallel bus is serialised (7:1 or 8b/10b) onto a few high-speed 350 mV LVDS lanes plus a clock pair, then a CDR/PLL deserialiser rebuilds the parallel word at the receiver &#8212; how one thin cable carries a whole panel.` }],
    prerequisites: ['rs422', 'noise', 'bandwidth'],
    intro: String.raw`<p><strong>Why LVDS exists.</strong> By the 1990s systems needed to move a <em>lot</em> of data quickly across a short distance — pixels to a laptop panel, samples from a fast ADC to an FPGA — and the old ways were failing. Wide parallel buses burned pins and power and radiated badly; large-swing signalling (even differential RS-422) was too slow and too power-hungry to run at gigabit rates across dozens of lanes without cooking the power budget or failing EMC tests. LVDS solves this by shrinking the signal to a tiny <strong>~350 mV</strong> swing and driving it with a <em>constant current</em> instead of a switching voltage. Small, constant, and differential means fast edges, very low power, and almost no radiated noise — exactly what a dense, high-speed, short-reach link needs.</p>
<p><strong>LVDS (Low-Voltage Differential Signaling)</strong> — standardised as <strong>TIA/EIA-644(-A)</strong> and, for the ANSI multipoint variant, IEEE 1596.3 (SCI-LVDS) — is the go-to interface when you need <em>gigabit-class speed at very low power and low EMI</em> over a short distance. Where RS-422/485 optimise for <em>distance and robustness</em> with volt-level swings, LVDS optimises for <em>speed and efficiency</em> with a tiny <strong>~350 mV</strong> differential swing.</p>
<p>Two ideas define LVDS. First, it is <strong>current-mode</strong>: instead of switching a voltage, the driver steers a nearly constant <strong>~3.5 mA</strong> current through the two wires in one direction or the other, and that current develops the signal across a <strong>100 Ω termination resistor at the receiver</strong> ($V = IR$). Because the current is roughly constant and just changes direction, the power drawn from the supply barely changes with data, and the two wires' currents are equal-and-opposite, so <strong>near-zero net (common-mode) current flows</strong> — which is why LVDS radiates so little EMI and sips power. Second, the low ~350 mV swing about a low ~1.2 V common mode lets edges be fast and the logic run at gigabit rates while staying quiet. LVDS underlies laptop/TV display links (FPD-Link, "LVDS panels"), Camera Link, and countless chip-to-chip and backplane SerDes.</p>`,
    sections: [
      {
        h: 'Current-mode differential driver: the core mechanism',
        html: String.raw`<p>An LVDS driver is a <strong>current source</strong> (nominally $3.5$ mA), not a voltage driver. It steers this fixed current out through one wire of the pair, across the far-end termination, and back through the other wire. Four transistors arranged as a switch (an "H-bridge"/current-steering topology) choose the <em>direction</em> of the current for logic 1 vs logic 0.</p>
<p>At the receiver, a single <strong>100 Ω resistor bridges the pair</strong> (matching the ~100 Ω differential impedance of the twisted pair or PCB traces). The steered current flowing through this resistor develops the differential voltage by Ohm's law:</p>
<p>$$V_{\text{od}} = I_{\text{source}} \times R_{\text{term}} = 3.5\ \text{mA} \times 100\ \Omega = 350\ \text{mV}.$$</p>
<p>Switching a bit reverses the current direction, so the receiver sees $+350$ mV or $-350$ mV — a total peak-to-peak swing of ~700 mV. The receiver is a differential comparator with only a <strong>few tens of millivolts of sensitivity</strong> (typically $\pm 100$ mV threshold), giving comfortable margin against the 350 mV signal.</p>
<div class="callout"><strong>Why current-mode matters:</strong> the supply current is essentially constant regardless of the data (the current just changes <em>path</em>, not magnitude). Constant supply current ⇒ almost no switching noise injected into the supply and almost no common-mode current on the cable ⇒ very low EMI and very low, nearly data-independent power.</div>`
      },
      {
        h: 'Voltage levels, common mode, and termination',
        html: String.raw`<p>LVDS runs at a low <strong>common-mode voltage of about $1.2$ V</strong> (the average of the two line voltages), well below the supply, which is what lets it work from low-voltage rails and switch fast. The two line voltages sit roughly at $1.2 \pm 0.175$ V, i.e. about $1.025$ V and $1.375$ V, and swap on each bit.</p>
<table class="data">
<tr><th>Parameter</th><th>Typical value</th></tr>
<tr><td>Driver current</td><td>~3.5 mA</td></tr>
<tr><td>Termination resistor</td><td>100 Ω (across the pair, at receiver)</td></tr>
<tr><td>Differential output swing $V_{\text{od}}$</td><td>~350 mV (250–450 mV allowed)</td></tr>
<tr><td>Common-mode voltage $V_{\text{cm}}$</td><td>~1.2 V</td></tr>
<tr><td>Receiver threshold</td><td>$\pm 100$ mV</td></tr>
<tr><td>Receiver common-mode range</td><td>~0 to 2.4 V (≈ $V_{\text{cm}} \pm 1$ V)</td></tr>
</table>
<p>The <strong>100 Ω termination is mandatory and lives at the receiver</strong> (electrically far end), directly across the differential pair. It serves two roles simultaneously: it matches the ~100 Ω line impedance to kill reflections, and it is the resistor across which the driver current develops the signal voltage. Remove it and there is no voltage at all — unlike a voltage-mode link, an unterminated LVDS line produces essentially no usable signal.</p>`
      },
      {
        h: 'Low power and low EMI: why LVDS wins at speed',
        html: String.raw`<p>LVDS's efficiency comes directly from the current-mode, low-swing design:</p>
<ul>
<li><strong>Low static power:</strong> the load power is $P = I^2 R = (3.5\ \text{mA})^2 \times 100\ \Omega = 1.2$ mW per pair — a fraction of what a rail-to-rail CMOS or RS-422 driver burns. Total supply current stays near-constant (~a few mA) regardless of toggle rate.</li>
<li><strong>Low EMI:</strong> the two wires carry equal-and-opposite currents, so their magnetic fields cancel in the far field and net common-mode current is near zero. Small swing + tight coupling ⇒ radiated emissions far below single-ended or large-swing differential.</li>
<li><strong>Fast edges:</strong> a small 350 mV swing takes little time to slew, so bit periods can be very short — gigabit rates are routine.</li>
</ul>
<p>These properties are precisely why LVDS displaced older parallel and large-swing interfaces inside laptops, cameras, and instruments: it moves a lot of data quickly without cooking the power budget or failing EMC tests.</p>`
      },
      {
        h: 'Encoding, serialization and clocking',
        html: String.raw`<p>Baseline LVDS (TIA-644) is just an <strong>electrical layer</strong> — it defines the driver/receiver, not the bit protocol. In real systems LVDS is almost always used with a <strong>SerDes</strong> (serializer/deserializer) that takes a wide parallel bus, serialises it onto one or a few high-speed LVDS pairs, and sends a <strong>separate LVDS clock pair</strong> (source-synchronous) or embeds the clock in the data.</p>
<ul>
<li><strong>Source-synchronous (e.g. FPD-Link, Camera Link):</strong> data pairs plus a forwarded clock pair. The classic display "LVDS" serialises 7 bits per clock across several data lanes (e.g. 3 or 4 data pairs + 1 clock pair for a colour panel).</li>
<li><strong>Embedded-clock / line-coded (high-speed SerDes):</strong> the clock is recovered from data transitions by a CDR PLL, and <strong>8b/10b</strong> (or similar) coding guarantees enough transitions and DC balance. These forms carry gigabit serial streams on a single pair.</li>
</ul>
<p>LVDS itself has <strong>no inherent packet or word structure</strong> — it is purely an electrical layer. Any "structure" comes from the SerDes scheme layered on top. A representative and widely deployed example is <strong>FPD-Link / OpenLDI</strong> (the classic display "LVDS"), which uses <strong>7:1 serialization per pixel clock</strong>: each LVDS data pair carries 7 bits in every pixel-clock period, alongside a forwarded LVDS clock pair. A single-pixel (18-bit RGB666) link uses three data pairs plus one clock pair; a 24-bit RGB888 panel adds a fourth data pair. The per-pixel-clock structure serialised across the pairs is:</p>
<table class="data">
<tr><th>LVDS pair</th><th>Bits per pixel clock (7:1)</th><th>Carries</th></tr>
<tr><td>Data 0</td><td>7</td><td>R0–R5 (red) + one control bit</td></tr>
<tr><td>Data 1</td><td>7</td><td>G0–G5 (green) + one control bit</td></tr>
<tr><td>Data 2</td><td>7</td><td>B0–B5 (blue) + the three control/sync bits HSYNC, VSYNC, DE</td></tr>
<tr><td>Data 3 (RGB888 only)</td><td>7</td><td>R6–R7, G6–G7, B6–B7 (the extra 2 bits per colour) + control</td></tr>
<tr><td>Clock</td><td>—</td><td>Forwarded pixel clock; receiver PLL multiplies ×7 to recover the 7 bit-phases</td></tr>
</table>
<p>So one pixel clock period transports one pixel: its RGB colour bits plus the HSYNC/VSYNC/DE framing/control bits, 7 bits at a time on each pair. High-speed embedded-clock SerDes instead use 8b/10b so the structure becomes 10-bit code groups on a single pair with the clock recovered by a CDR.</p>
<p>So LVDS spans a range from simple source-synchronous display links to fully clock-embedded gigabit lanes, but in all cases the <em>electrical</em> layer is the same 350 mV current-mode differential signalling.</p>
<p>The LVDS <em>family</em> extends into even lower-swing relatives for mobile and chip-to-chip use. <strong>SLVS (Scalable Low-Voltage Signaling, e.g. SLVS-400 in JEDEC/MIPI contexts)</strong> shrinks the swing to roughly <strong>200 mV about a ~200 mV common mode</strong>, driven from very low rails, and underlies fast mobile links such as MIPI camera/display physical layers — trading margin for still-lower power and voltage than baseline LVDS. Along with Bus-LVDS and M-LVDS (the multipoint variants), SLVS shows the same current-steered differential idea rescaled: LVDS for general point-to-point, M-LVDS/BLVDS for multipoint backplanes, and SLVS for the lowest-voltage, highest-density mobile lanes.</p>`
      },
      {
        h: 'Topology, distance, and the speed–reach trade-off',
        html: String.raw`<p>Standard TIA-644 LVDS is <strong>point-to-point</strong>: one driver, one receiver, one 100 Ω termination. (Bus/multipoint variants exist — <strong>Bus LVDS (BLVDS)</strong> and <strong>M-LVDS, TIA-899</strong> — which use stronger drivers and double termination to allow multidrop backplanes, analogous to how RS-485 extends RS-422.)</p>
<p>LVDS is a <strong>short-reach</strong> interface. The tiny swing that buys speed and low power also means little margin against cable loss, so practical distances are on the order of <strong>a few metres to ~10 m</strong>, strongly dependent on rate: gigabit links run only tens of centimetres to a couple of metres, while a modest-rate LVDS link can go several metres. As always, higher rate ⇒ shorter reach, because high-frequency cable attenuation and skew close the eye. LVDS is therefore aimed at <em>on-board, board-to-board, and short-cable</em> links — not the kilometre runs of RS-422/485.</p>
<div class="callout"><strong>Positioning:</strong> RS-422/485 trade speed for kilometre reach with volt-level swings; LVDS trades reach for gigabit speed and low power with a 350 mV swing. They occupy opposite corners of the same differential-signalling design space.</div>`
      },
      {
        h: 'Noise immunity and common-mode behaviour',
        html: String.raw`<p>LVDS is differential, so like RS-422/485 it <strong>rejects common-mode noise</strong>: interference and ground shifts couple onto both wires and cancel at the comparator. But its common-mode <em>range</em> is far narrower — roughly <strong>$V_{\text{cm}} \pm 1$ V (about 0 to 2.4 V)</strong> — compared to RS-422's $\pm 7$ V, precisely because LVDS runs at low voltage. So LVDS tolerates <em>on-board</em> noise and small ground differences beautifully, but it cannot bridge the large ground-potential differences between separated chassis that RS-485 handles.</p>
<p>Its very low <strong>emitted</strong> noise (near-zero common-mode current, tiny swing, tight field cancellation) is a headline advantage: LVDS both rejects noise and generates very little, which is why it passes EMC in dense products carrying many gigabit lanes. The main design cautions are keeping the pair tightly coupled and length-matched (skew between + and − destroys the differential eye), and placing the single 100 Ω termination right at the receiver.</p>
<p><strong>Fail-safe.</strong> Because the swing is only 350 mV and the comparator threshold is a few tens of millivolts, an <em>open, shorted, or undriven</em> LVDS input can float near the threshold and cause the receiver output to chatter. Most LVDS receivers therefore include <strong>open/short/terminated-fail-safe</strong> circuitry that forces the output to a known logic state (typically high) when the differential input is invalid — open inputs, shorted inputs, or a properly terminated pair with no driver active. This matters wherever a link may be hot-unplugged or a lane may be temporarily idle, so a disconnected LVDS lane presents a defined level rather than random noise.</p>`
      },
      {
        h: 'Standard, use cases, pros/cons and comparison',
        html: String.raw`<p>LVDS is standardised as <strong>TIA/EIA-644-A</strong> (electrical), with the multipoint bus variant as <strong>TIA/EIA-899 (M-LVDS)</strong> and the ANSI/IEEE 1596.3 SCI-LVDS lineage. It defines electricals only; application standards layer on top.</p>
<p><strong>Use cases:</strong> flat-panel display links — <strong>FPD-Link</strong> and "LVDS panels" in laptops, monitors, and TVs; <strong>Camera Link</strong> and CoaXPress-adjacent machine-vision interfaces; chip-to-chip and FPGA-to-ADC/DAC data (e.g. JESD204 physical layers and many high-speed data converters output LVDS); backplane and board-to-board SerDes; and clock/data distribution inside instruments and base stations.</p>
<p><strong>Pros:</strong> gigabit speed, very low power, very low EMI, low supply voltage, excellent for dense high-lane-count systems. <strong>Cons:</strong> short reach, narrow common-mode range (can't span big ground offsets), point-to-point (baseline), requires careful impedance-controlled length-matched routing, and mandatory precise 100 Ω termination.</p>
<table class="data">
<tr><th>Property</th><th>RS-232</th><th>RS-422</th><th>RS-485</th><th>LVDS</th></tr>
<tr><td>Drive style</td><td>Single-ended voltage</td><td>Differential voltage</td><td>Differential voltage</td><td><strong>Differential current-mode</strong></td></tr>
<tr><td>Signal swing</td><td>$\pm 5$–$15$ V</td><td>$\ge \pm 2$ V diff</td><td>$\ge \pm 1.5$ V diff</td><td><strong>~350 mV diff</strong></td></tr>
<tr><td>Common-mode $V$/range</td><td>ground-ref</td><td>$-7$ to $+7$ V</td><td>$-7$ to $+12$ V</td><td>~1.2 V, $\pm 1$ V range</td></tr>
<tr><td>Termination</td><td>none</td><td>$Z_0$ far end</td><td>120 Ω both ends</td><td><strong>100 Ω at receiver</strong></td></tr>
<tr><td>Topology</td><td>Point-to-point</td><td>Broadcast multidrop</td><td>Multi-master bus</td><td>Point-to-point (M-LVDS: bus)</td></tr>
<tr><td>Max rate</td><td>~115–230 kbps</td><td>10 Mbps@12m</td><td>10 Mbps@12m</td><td><strong>Gbps</strong></td></tr>
<tr><td>Max reach</td><td>~15 m</td><td>~1200 m</td><td>~1200 m</td><td><strong>~a few m to 10 m</strong></td></tr>
<tr><td>Power / EMI</td><td>high V, moderate</td><td>moderate</td><td>moderate</td><td><strong>very low / very low</strong></td></tr>
<tr><td>Standard</td><td>TIA-232</td><td>TIA-422</td><td>TIA-485</td><td>TIA-644 (M-LVDS: TIA-899)</td></tr>
</table>`
      },
      {
        h: 'What you should now understand',
        html: String.raw`<div class="callout tip">LVDS sits in the opposite corner from RS-422/485: it trades reach away to buy gigabit speed, tiny power, and very low EMI — and the current-mode driver is what makes all three happen at once.</div>
<ul>
<li><strong>It is current-mode, not voltage-mode.</strong> A constant ~3.5 mA is steered through the pair; the signal is $V = IR = 3.5\,\text{mA}\times100\,\Omega = 350$ mV developed across the receiver's termination — remove the resistor and there is no signal.</li>
<li><strong>Constant current buys low power and low EMI.</strong> The magnitude never changes (only its direction), so supply current is steady and the equal/opposite wire currents give near-zero common-mode current — fields cancel, ~1.2 mW/pair.</li>
<li><strong>Small swing means fast, but fragile.</strong> A 350 mV swing slews quickly (gigabit rates) but leaves little margin, so LVDS is short-reach (a few m to ~10 m) with a narrow common-mode range (~0–2.4 V) that cannot span big chassis offsets.</li>
<li><strong>Termination is exact and mandatory.</strong> One 100 Ω resistor right at the receiver both matches $Z_0$ (zero reflection) and creates the voltage — 120 Ω would mismatch and reflect.</li>
<li><strong>Real links add a SerDes.</strong> LVDS is only the electrical layer; a serializer/deserializer with a forwarded clock (FPD-Link, Camera Link) or embedded clock + 8b/10b carries the actual data, and pairs must be length-matched to hold skew to picoseconds.</li>
<li><strong>The family scales.</strong> M-LVDS/Bus-LVDS add multipoint backplanes; SLVS drops the swing further for mobile/MIPI lanes — same current-steered differential idea, rescaled.</li>
</ul>`
      }
    ],
    keyPoints: [
      String.raw`LVDS is a <strong>current-mode differential</strong> interface: a ~3.5 mA current is steered through the pair and develops the signal across a 100 Ω termination.`,
      String.raw`Swing is $V_{\text{od}} = I \cdot R = 3.5\ \text{mA} \times 100\ \Omega = \textbf{350 mV}$ about a ~1.2 V common mode.`,
      String.raw`The <strong>100 Ω termination is mandatory and sits at the receiver</strong>; it both matches $Z_0$ and creates the signal voltage — remove it and there is no signal.`,
      String.raw`Because supply current is nearly constant and the two wires carry equal/opposite currents, LVDS has <strong>near-zero common-mode current ⇒ very low EMI and very low power</strong> (~1.2 mW/pair).`,
      String.raw`Receiver is a comparator with $\pm 100$ mV sensitivity, giving good margin against the 350 mV swing.`,
      String.raw`LVDS reaches <strong>gigabit rates</strong> because the small swing slews fast; it is a <strong>short-reach</strong> link (a few m to ~10 m, rate-dependent).`,
      String.raw`Common-mode range is narrow (~$V_{\text{cm}} \pm 1$ V, ≈ 0–2.4 V) — good for on-board noise but cannot span large chassis ground offsets like RS-485.`,
      String.raw`Baseline TIA-644 LVDS is <strong>point-to-point</strong>; <strong>M-LVDS (TIA-899)</strong> and Bus-LVDS add multipoint/backplane operation.`,
      String.raw`LVDS is an electrical layer; real links add a <strong>SerDes</strong> with a forwarded clock (source-synchronous, e.g. FPD-Link/Camera Link) or embedded clock + 8b/10b coding.`,
      String.raw`Standard body: <strong>TIA (TIA/EIA-644-A)</strong>; also ANSI/IEEE 1596.3. Application layers: FPD-Link, Camera Link, JESD204.`,
      String.raw`Routing must be <strong>impedance-controlled (~100 Ω diff) and length-matched</strong>; intra-pair skew collapses the differential eye.`,
      String.raw`Positioning: RS-422/485 = volt-swing, kilometre reach, slow; LVDS = 350 mV swing, gigabit, short reach — opposite corners of differential signalling.`,
      String.raw`The family scales: <strong>M-LVDS/Bus-LVDS</strong> add multipoint backplanes, and <strong>SLVS</strong> (~200 mV swing about ~200 mV CM) drops the voltage further for mobile/MIPI chip-to-chip lanes.`,
      String.raw`LVDS receivers typically include <strong>open/short-input fail-safe</strong> that forces a defined output (usually high) when a lane is disconnected or idle, so a floating pair does not chatter.`
    ],
    equations: [
      {
        title: 'LVDS differential swing from current-mode drive',
        tex: String.raw`$$V_{\text{od}} = I_{\text{source}} \cdot R_{\text{term}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> An LVDS driver is a current source of value $I_{\text{source}}$ (nominally 3.5 mA). It steers this current out one wire, through the receiver's termination resistor, and back the other wire.</p>
<p><b>Step 1 — apply Ohm's law at the termination.</b> All of the steered current $I_{\text{source}}$ flows through the single termination resistor $R_{\text{term}}$ bridging the pair, developing a voltage:</p>
$$V_{\text{od}} = I_{\text{source}} \cdot R_{\text{term}}.$$
<p><b>Step 2 — plug in the standard values.</b> $I_{\text{source}} = 3.5$ mA, $R_{\text{term}} = 100\ \Omega$:</p>
$$V_{\text{od}} = 3.5\ \text{mA} \times 100\ \Omega.$$
<p><b>Result.</b> $$V_{\text{od}} = 350\ \text{mV}.$$ Switching the current direction gives $-350$ mV, so peak-to-peak swing is ~700 mV. Sanity check: with a $\pm 100$ mV receiver threshold, the 350 mV amplitude leaves ~250 mV of margin — plenty. And note removing $R_{\text{term}}$ makes $V_{\text{od}} \to 0$: the resistor <em>is</em> the signal source in a current-mode link.</p>`
      },
      {
        title: 'LVDS load power',
        tex: String.raw`$$P_{\text{load}} = I^2 R_{\text{term}} = \frac{V_{\text{od}}^2}{R_{\text{term}}}$$`,
        derivation: String.raw`<p><b>Where we start.</b> The only place the driver dissipates signal power into the channel is the termination resistor, carrying current $I = 3.5$ mA.</p>
<p><b>Step 1 — power in a resistor.</b></p>
$$P_{\text{load}} = I^2 R_{\text{term}} = (3.5\ \text{mA})^2 \times 100\ \Omega.$$
<p><b>Step 2 — evaluate.</b> $(3.5\times 10^{-3})^2 = 1.225\times 10^{-5}$ A²; times 100 Ω:</p>
$$P_{\text{load}} = 1.225\times 10^{-3}\ \text{W} = 1.2\ \text{mW}.$$
<p><b>Result.</b> $$P_{\text{load}} \approx 1.2\ \text{mW per pair}.$$ Equivalently $V_{\text{od}}^2/R = (0.35)^2/100 = 1.2$ mW — consistent. Sanity check: a rail-to-rail CMOS or $\pm 2$ V RS-422 driver dissipates many times this, which is why LVDS wins the power budget in high-lane-count systems. Because $I$ is nearly constant, this power is almost independent of the data rate.</p>`
      },
      {
        title: 'Near-zero common-mode current',
        tex: String.raw`$$I_{\text{cm}} = I_+ + I_- \approx 0, \qquad I_+ = -I_-$$`,
        derivation: String.raw`<p><b>Where we start.</b> The LVDS driver is a single current source whose output must return through the same pair — whatever current leaves on the + wire returns on the − wire.</p>
<p><b>Step 1 — write Kirchhoff's current law for the pair.</b> Define $I_+$ into the + wire and $I_-$ into the − wire. Conservation of the steered current gives</p>
$$I_+ = -I_-.$$
<p><b>Step 2 — form the common-mode (net) current.</b> The common-mode current is the <em>sum</em> of the two wire currents (the net current that would flow in the ground return / radiate as an antenna):</p>
$$I_{\text{cm}} = I_+ + I_- = I_+ + (-I_+) = 0.$$
<p><b>Result.</b> $$I_{\text{cm}} \approx 0.$$ The differential current $I_{\text{diff}} = (I_+ - I_-)/2 = I_+$ carries the signal, while the net current is ~zero. Sanity check: zero net current means the pair's magnetic fields cancel and there is no common-mode return to radiate — this is the physical reason LVDS has such low EMI and injects almost no switching noise into the supply.</p>`
      },
      {
        title: 'Propagation delay and skew limit on reach',
        tex: String.raw`$$t_{pd} = \frac{L}{v}, \qquad t_{\text{skew}} < \tfrac{1}{2}\,\text{UI}$$`,
        derivation: String.raw`<p><b>Where we start.</b> A bit occupies one unit interval $\text{UI} = 1/R_b$. The signal travels at $v = c/\sqrt{\varepsilon_r} \approx 2\times 10^8$ m/s, and the + and − wires must arrive aligned; any length mismatch $\Delta L$ creates a skew $t_{\text{skew}} = \Delta L / v$.</p>
<p><b>Step 1 — propagation delay.</b></p>
$$t_{pd} = \frac{L}{v}.$$
<p><b>Step 2 — bound the skew.</b> For the differential eye to stay open, intra-pair skew must be a small fraction of the bit period:</p>
$$t_{\text{skew}} = \frac{\Delta L}{v} < \frac{1}{2}\,\text{UI} = \frac{1}{2 R_b}.$$
<p><b>Result.</b> At $R_b = 1$ Gbps, $\text{UI} = 1$ ns, so skew must stay well under ~500 ps; at $v \approx 6$ ps/mm that means matching the + and − trace lengths to within a few mm. $$\Delta L < \frac{v}{2 R_b} = \frac{2\times 10^8}{2\times 10^9} = 0.1\ \text{m} = 100\ \text{mm (loose bound)},$$ but good practice matches to $<5$ mm. Sanity check: this is exactly why gigabit LVDS demands length-matched, impedance-controlled routing and only spans short distances — high $R_b$ shrinks the allowable skew and the cable-loss budget together.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What kind of driver does LVDS use?`, back: String.raw`A current-mode driver: it steers a ~3.5 mA constant current through the pair in one direction or the other, rather than switching a voltage.` },
      { front: String.raw`How is the LVDS signal voltage produced?`, back: String.raw`By the steered current flowing through the 100 Ω receiver termination: $V_{\text{od}} = I R = 3.5\ \text{mA} \times 100\ \Omega = 350$ mV.` },
      { front: String.raw`What is the LVDS differential swing and common-mode voltage?`, back: String.raw`~350 mV differential swing about a ~1.2 V common mode.` },
      { front: String.raw`Where is the LVDS termination and what value?`, back: String.raw`A single 100 Ω resistor across the pair at the receiver (far end); it both matches $Z_0$ and creates the signal.` },
      { front: String.raw`What happens if you remove the LVDS termination?`, back: String.raw`There is essentially no signal — in a current-mode link the termination resistor is what develops the voltage (and it prevents reflections).` },
      { front: String.raw`Why does LVDS have such low EMI?`, back: String.raw`Equal-and-opposite wire currents give near-zero common-mode current, so fields cancel; plus the small 350 mV swing and constant supply current.` },
      { front: String.raw`Approximate LVDS load power per pair?`, back: String.raw`$I^2 R = (3.5\ \text{mA})^2 \times 100\ \Omega \approx 1.2$ mW, nearly independent of data rate.` },
      { front: String.raw`LVDS receiver threshold?`, back: String.raw`About $\pm 100$ mV — comfortably below the 350 mV swing.` },
      { front: String.raw`What is LVDS's reach and why?`, back: String.raw`Short — a few metres to ~10 m, rate-dependent. The tiny swing leaves little margin against cable loss, and high rates shrink it further.` },
      { front: String.raw`How does LVDS's common-mode range compare to RS-422?`, back: String.raw`Narrow (~$1.2 \pm 1$ V, ≈ 0–2.4 V) vs RS-422's $\pm 7$ V — LVDS can't span big chassis ground offsets.` },
      { front: String.raw`What standard defines LVDS? And multipoint LVDS?`, back: String.raw`TIA/EIA-644-A (also ANSI/IEEE 1596.3). Multipoint bus variant: M-LVDS = TIA/EIA-899.` },
      { front: String.raw`How is a clock provided in LVDS links?`, back: String.raw`Either source-synchronous (a forwarded LVDS clock pair, e.g. FPD-Link/Camera Link) or embedded and recovered by a CDR with 8b/10b-style coding.` },
      { front: String.raw`Name common LVDS applications.`, back: String.raw`Flat-panel display links (FPD-Link, "LVDS panels"), Camera Link machine vision, chip-to-chip/ADC-DAC SerDes (JESD204), backplanes.` },
      { front: String.raw`Why must LVDS pairs be length-matched?`, back: String.raw`Intra-pair skew from length mismatch collapses the differential eye; at gigabit rates a UI is ~1 ns, so + and − must match to a few mm.` },
      { front: String.raw`What is SLVS and how does it relate to LVDS?`, back: String.raw`Scalable Low-Voltage Signaling — a lower-swing LVDS relative (~200 mV swing about a ~200 mV common mode) for the lowest-voltage, highest-density mobile links (e.g. MIPI camera/display PHYs). Same current-steered differential idea, rescaled for less power/voltage.` },
      { front: String.raw`What does LVDS receiver fail-safe do?`, back: String.raw`It forces the receiver output to a known state (usually high) when the differential input is invalid — open, shorted, or terminated-but-undriven — so a disconnected or idle lane presents a defined level instead of chattering on noise.` }
    ],
    mcqs: [
      { q: String.raw`LVDS is best described as:`, options: [String.raw`Single-ended voltage-mode`, String.raw`Differential current-mode`, String.raw`Differential voltage-mode with volt-level swing`, String.raw`Optical`], answer: 1, explain: String.raw`LVDS steers a constant current through the pair; the signal is developed as $IR$ across the termination.` },
      { q: String.raw`The nominal LVDS differential swing is:`, options: [String.raw`3.5 V`, String.raw`1.2 V`, String.raw`350 mV`, String.raw`100 mV`], answer: 2, explain: String.raw`$3.5\ \text{mA} \times 100\ \Omega = 350$ mV.` },
      { q: String.raw`Where is the LVDS termination resistor placed and what value?`, options: [String.raw`120 Ω at both ends`, String.raw`100 Ω at the receiver`, String.raw`50 Ω at the driver`, String.raw`No termination`], answer: 1, explain: String.raw`A single 100 Ω across the pair at the receiver, matching the ~100 Ω line and forming the signal.` },
      { q: String.raw`Removing the LVDS termination resistor causes:`, options: [String.raw`Higher swing`, String.raw`Essentially no signal`, String.raw`Lower EMI`, String.raw`No effect`], answer: 1, explain: String.raw`The current has nothing to develop a voltage across, so $V_{\text{od}} \to 0$ (and reflections appear).` },
      { q: String.raw`LVDS common-mode voltage is about:`, options: [String.raw`0 V`, String.raw`1.2 V`, String.raw`2.5 V`, String.raw`5 V`], answer: 1, explain: String.raw`~1.2 V, a low value that lets LVDS run fast from low supplies.` },
      { q: String.raw`LVDS has very low EMI mainly because:`, options: [String.raw`It uses shielding`, String.raw`Equal/opposite currents give ~zero common-mode current`, String.raw`It runs slowly`, String.raw`It is single-ended`], answer: 1, explain: String.raw`Near-zero net current means fields cancel and little radiates; the small swing helps too.` },
      { q: String.raw`Approximate LVDS load power per pair is:`, options: [String.raw`1.2 mW`, String.raw`12 mW`, String.raw`120 mW`, String.raw`1.2 W`], answer: 0, explain: String.raw`$(3.5\ \text{mA})^2 \times 100\ \Omega = 1.2$ mW.` },
      { q: String.raw`LVDS is characterised in reach/rate as:`, options: [String.raw`Long reach, low rate`, String.raw`Short reach, gigabit rate`, String.raw`Long reach, gigabit rate`, String.raw`Short reach, low rate`], answer: 1, explain: String.raw`Gigabit speed over short distances (a few m to ~10 m) — the opposite trade to RS-422/485.` },
      { q: String.raw`Baseline TIA-644 LVDS topology is:`, options: [String.raw`Multidrop bus`, String.raw`Point-to-point`, String.raw`Ring`, String.raw`Star`], answer: 1, explain: String.raw`Point-to-point; M-LVDS (TIA-899) and Bus-LVDS add multipoint operation.` },
      { q: String.raw`Which application is a classic LVDS use?`, options: [String.raw`Kilometre Modbus network`, String.raw`Laptop/TV flat-panel display link (FPD-Link)`, String.raw`RS-232 console`, String.raw`Telephone line`], answer: 1, explain: String.raw`FPD-Link/"LVDS panels" drive laptop and TV displays; Camera Link and SerDes are others.` },
      { q: String.raw`Compared with RS-422, LVDS's common-mode range is:`, options: [String.raw`Wider ($\pm 12$ V)`, String.raw`The same`, String.raw`Much narrower (~$\pm 1$ V about 1.2 V)`, String.raw`Infinite`], answer: 2, explain: String.raw`Low-voltage operation gives only ~0–2.4 V CM range, so LVDS can't span large ground offsets.` },
      { q: String.raw`The standard for LVDS is:`, options: [String.raw`TIA-232`, String.raw`TIA-485`, String.raw`TIA/EIA-644`, String.raw`IEEE 802.3`], answer: 2, explain: String.raw`TIA/EIA-644(-A); the multipoint variant M-LVDS is TIA/EIA-899.` },
      { q: String.raw`SLVS differs from baseline LVDS mainly in that it:`, options: [String.raw`Uses a larger volt-level swing`, String.raw`Uses an even smaller swing (~200 mV) about a low ~200 mV common mode for mobile/MIPI links`, String.raw`Is single-ended`, String.raw`Requires no termination`], answer: 1, explain: String.raw`SLVS (Scalable Low-Voltage Signaling) shrinks the swing and common mode below LVDS to save voltage/power in dense mobile chip-to-chip lanes such as MIPI PHYs.` },
      { q: String.raw`LVDS receiver fail-safe circuitry ensures that:`, options: [String.raw`The swing rises to 700 mV`, String.raw`An open, shorted, or undriven input yields a defined output (usually high)`, String.raw`The termination is removed`, String.raw`The common-mode range widens to $\pm 7$ V`], answer: 1, explain: String.raw`With only a 350 mV swing and a few-tens-of-mV threshold, a floating lane would chatter; fail-safe forces a known logic level when the input is invalid.` }
    ],
    numericals: [
      { q: String.raw`An LVDS driver sources 3.5 mA into a 100 Ω termination. Find the differential swing, peak-to-peak swing, and margin over a $\pm 100$ mV receiver threshold.`, solution: String.raw`<p><b>Formula.</b> $$V_{\text{od}} = I_{\text{source}}\,R_{\text{term}}, \qquad V_{pp} = 2V_{\text{od}}, \qquad M = V_{\text{od}} - V_{\text{th}}$$ where $I_{\text{source}}$ is the steered current, $R_{\text{term}}$ the termination, and $V_{\text{th}}$ the receiver threshold.</p>
<p><b>Substitute.</b> $$V_{\text{od}} = 3.5\ \text{mA}\times100\ \Omega, \qquad V_{pp} = 2\times350\ \text{mV}, \qquad M = 350 - 100$$</p>
<p><b>Compute.</b> $V_{\text{od}} = 350$ mV; $V_{pp} = 700$ mV; $M = 250$ mV.</p>
<p><b>Explanation.</b> The 350 mV swing sits 250 mV above the 100 mV threshold — a 3.5:1 margin, robust for a short link. The peak-to-peak is 700 mV because switching the bit reverses the current direction, giving $\pm350$ mV.</p>` },
      { q: String.raw`A design uses a 3.7 mA driver into a 100 Ω load. What is $V_{\text{od}}$, and is it within the 250–450 mV LVDS spec?`, solution: String.raw`<p><b>Formula.</b> $$V_{\text{od}} = I_{\text{source}}\,R_{\text{term}}, \qquad 250\ \text{mV} \le V_{\text{od}} \le 450\ \text{mV (TIA-644)}$$</p>
<p><b>Substitute.</b> $$V_{\text{od}} = 3.7\ \text{mA}\times100\ \Omega$$</p>
<p><b>Compute.</b> $V_{\text{od}} = 370$ mV, and $250 \le 370 \le 450$ mV.</p>
<p><b>Explanation.</b> At 370 mV the output is comfortably inside the TIA-644 window. Note the sensitivity to termination: a mistaken 120 Ω would give $3.7\times120 = 444$ mV — still just in range but now impedance-mismatched, so reflections would degrade the eye. The exact 100 Ω value matters in a current-mode link.</p>` },
      { q: String.raw`Compute the per-pair load power for an LVDS link, and compare to an RS-422 driver delivering 2 V into a 100 Ω differential load.`, solution: String.raw`<p><b>Formula.</b> Power dissipated in the termination is $$P = I^2 R = \frac{V^2}{R}$$ (use current form for the LVDS current-mode driver, voltage form for the RS-422 voltage driver).</p>
<p><b>Substitute.</b> $$P_{\text{LVDS}} = (3.5\ \text{mA})^2\times100\ \Omega, \qquad P_{422} = \frac{(2\ \text{V})^2}{100\ \Omega}$$</p>
<p><b>Compute.</b> $P_{\text{LVDS}} = 1.225\times10^{-5}\times100 = 1.2$ mW; $P_{422} = 4/100 = 40$ mW.</p>
<p><b>Explanation.</b> LVDS burns ~1.2 mW per pair versus ~40 mW for RS-422 — about 1/33 the load power. In a device with dozens of gigabit lanes that ratio dominates the power and thermal budget, which is why LVDS displaced volt-swing signalling for dense, high-lane-count links.</p>` },
      { q: String.raw`A 1.5 Gbps LVDS link runs on PCB traces with velocity 6 ps/mm. To keep intra-pair skew below 1/10 of a UI, what is the maximum + / − length mismatch?`, solution: String.raw`<p><b>Formula.</b> $$\text{UI} = \frac{1}{R_b}, \qquad t_{\text{skew}} = \frac{\text{UI}}{10}, \qquad \Delta L = \frac{t_{\text{skew}}}{\tau}$$ where $R_b$ is the bit rate, UI the unit interval, and $\tau = 6$ ps/mm the trace delay per length.</p>
<p><b>Substitute.</b> $$\text{UI} = \frac{1}{1.5\times10^9}, \qquad t_{\text{skew}} = \frac{\text{UI}}{10}, \qquad \Delta L = \frac{t_{\text{skew}}}{6\ \text{ps/mm}}$$</p>
<p><b>Compute.</b> UI $= 0.667$ ns $= 667$ ps; $t_{\text{skew}} = 66.7$ ps; $\Delta L = 66.7/6 = 11.1$ mm.</p>
<p><b>Explanation.</b> The + and − traces must match to within ~11 mm to hold skew under 1/10 UI; designers usually target a few mm for margin. This shows why gigabit LVDS demands length-matched routing — higher $R_b$ shrinks the UI and the allowable mismatch together.</p>` },
      { q: String.raw`Verify that the differential impedance seen by the driver equals the termination. If the pair is 100 Ω differential and terminated in 100 Ω, what fraction of an incident edge reflects?`, solution: String.raw`<p><b>Formula.</b> The reflection coefficient at a load $R_L$ on a line of impedance $Z_0$ is $$\Gamma = \frac{R_L - Z_0}{R_L + Z_0}$$ and the reflected fraction of the edge amplitude is $|\Gamma|$.</p>
<p><b>Substitute.</b> $$\Gamma = \frac{100 - 100}{100 + 100}$$</p>
<p><b>Compute.</b> $\Gamma = 0/200 = 0$.</p>
<p><b>Explanation.</b> With a perfectly matched 100 Ω termination none of the edge reflects, so the eye stays clean. If the termination were 120 Ω, $\Gamma = 20/220 \approx 0.09$, so about 9% reflects and degrades the signal, which is why LVDS specifies 100 Ω exactly, not RS-485's 120 Ω.</p>` }
    ],
    realWorld: String.raw`<p>LVDS is everywhere data has to move fast on a short wire without burning power or radiating. The screen you are reading this on very likely uses an <strong>LVDS/FPD-Link</strong> panel interface: a serializer near the GPU turns parallel RGB pixels into a few gigabit LVDS pairs plus a clock pair running to the display's deserializer, which is why laptops can drive high-resolution panels through a thin hinge cable. <strong>Camera Link</strong> and related machine-vision links carry sensor data to frame grabbers over LVDS. Inside RF and instrumentation systems, high-speed <strong>ADCs and DACs</strong> (and the <strong>JESD204</strong> converter-to-FPGA links) use LVDS or its descendants to stream gigasamples per second to the FPGA fabric — the AD9361 and RFSoC data paths, for example, rely on such differential lanes. Backplanes and board-to-board links in telecom and networking gear use LVDS/BLVDS/M-LVDS for clock and data distribution. The recurring engineering discipline is signal integrity: impedance-controlled ~100 Ω differential routing, tight intra-pair length matching to hold skew to a few picoseconds, and one precise 100 Ω termination right at the receiver. When a design instead needs kilometre reach or a large multidrop field network, engineers step back down to RS-422/485; LVDS deliberately trades that reach away for speed, low power, and low EMI.</p>`,
    related: ['rs422', 'rs485', 'rs232', 'adc']
  }
);
