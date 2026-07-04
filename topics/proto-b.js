// Interfaces & Protocols category topics: SPI, AXI Bus, MIL-STD-1553B
CONTENT.topics.push(
  {
    id: 'spi',
    title: 'SPI',
    category: 'Interfaces & Protocols',
    tags: ['spi', 'serial', 'synchronous', 'full-duplex', 'cpol', 'cpha', 'master-slave', 'on-board'],
    summary: String.raw`The Serial Peripheral Interface is a four-wire, full-duplex, synchronous, master-driven on-board bus that clocks one bit per SCLK edge with no addressing, acknowledgement, or flow control.`,
    diagram: { svg: String.raw`<svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-spi" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="18" y="70" width="110" height="110" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="73" y="94" fill="#e6edf3" text-anchor="middle" font-weight="bold">Master</text>
<text x="73" y="112" fill="#9aa7b5" text-anchor="middle" font-size="9">SCLK / MOSI</text>
<text x="73" y="125" fill="#9aa7b5" text-anchor="middle" font-size="9">MISO / SS&#215;n</text>
<line x1="128" y1="88" x2="360" y2="88" stroke="#63e6be" marker-end="url(#arr-spi)"/>
<text x="240" y="83" fill="#e6edf3" text-anchor="middle" font-size="10">SCLK + MOSI (shared)</text>
<line x1="360" y1="108" x2="128" y2="108" stroke="#ffa94d" marker-end="url(#arr-spi)"/>
<text x="240" y="103" fill="#e6edf3" text-anchor="middle" font-size="10">MISO (shared, tri-state)</text>
<line x1="128" y1="135" x2="360" y2="135" stroke="#b197fc" marker-end="url(#arr-spi)"/>
<text x="240" y="130" fill="#b197fc" text-anchor="middle" font-size="10">SS1</text>
<line x1="128" y1="158" x2="360" y2="200" stroke="#b197fc" marker-end="url(#arr-spi)"/>
<text x="240" y="180" fill="#b197fc" text-anchor="middle" font-size="10">SS2 &#8230; SSn (one per slave)</text>
<rect x="365" y="60" width="120" height="42" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="425" y="86" fill="#e6edf3" text-anchor="middle" font-size="11">Slave 1</text>
<rect x="365" y="118" width="120" height="42" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="425" y="144" fill="#e6edf3" text-anchor="middle" font-size="11">Slave 2</text>
<rect x="365" y="176" width="120" height="42" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="425" y="202" fill="#e6edf3" text-anchor="middle" font-size="11">Slave n</text>
<text x="270" y="222" fill="#9aa7b5" text-anchor="middle" font-size="10">shared SCLK/MOSI/MISO; a dedicated SS line selects exactly one slave</text>
</svg>`, caption: String.raw`SPI: one master drives shared SCLK/MOSI/MISO to several slaves, selecting exactly one at a time via its dedicated active-low SS line.` },
    prerequisites: ['comm-basics', 'rs232', 'rs422'],
    intro: String.raw`<p>The <b>Serial Peripheral Interface (SPI)</b> is a de-facto industry standard introduced by Motorola in the 1980s for short-reach, chip-to-chip communication on a single printed-circuit board. It is <b>synchronous</b> (a dedicated clock line accompanies the data), <b>full-duplex</b> (data flows in both directions simultaneously on separate lines), and <b>single-master, multiple-slave</b>. Its defining virtue is brutal simplicity: there is no addressing scheme, no acknowledgement, no error-detection field, no arbitration, and no defined maximum speed - the master simply toggles a clock and both sides shift bits.</p>
    <p>Because a bit is transferred on every clock edge and there is <b>zero protocol overhead</b> (no start/stop/parity bits, no headers), SPI delivers a payload throughput exactly equal to the clock frequency in bits per second. That efficiency, plus trivial hardware (a pair of shift registers and a clock), makes SPI the workhorse for ADCs/DACs, flash memory, sensors, displays, and radio transceivers such as the AD9361. The cost of that simplicity is that everything the protocol omits - addressing, acknowledgement, integrity checking - must be handled by the application layer or done without.</p>`,
    sections: [
      {
        h: 'Physical & Electrical Layer: The Four Wires',
        html: String.raw`<p>SPI in its canonical form uses <b>four signals</b>, all single-ended CMOS/TTL logic referenced to a common ground, driven push-pull (not open-drain like I2C):</p>
        <ul>
          <li><b>SCLK</b> (Serial Clock) - generated <em>only</em> by the master; it paces every bit. No clock, no transfer.</li>
          <li><b>MOSI</b> (Master Out, Slave In) - data from master to the selected slave.</li>
          <li><b>MISO</b> (Master In, Slave Out) - data from the selected slave back to the master. Unselected slaves must tri-state (high-Z) this line.</li>
          <li><b>SS / CS</b> (Slave Select / Chip Select) - one active-low line per slave, asserted by the master to enable exactly one slave for the transaction.</li>
        </ul>
        <p>Modern vendor-neutral naming replaces master/slave with <b>controller/peripheral</b> and MOSI/MISO with <b>SDO/SDI (or COPI/CIPO)</b>, but the signalling is identical. Because signals are single-ended and unterminated, SPI is a <b>short-reach on-board interface</b> - typically a few centimetres to tens of centimetres. There is no differential option in the base standard, so it is not intended to leave the board or drive a cable of any length (contrast with RS-422/RS-485/LVDS).</p>
        <div class="callout"><b>Duplex:</b> SPI is inherently <b>full-duplex</b>. Every clock edge that shifts a bit out of the master on MOSI simultaneously shifts a bit into the master on MISO. The two shift registers form a ring; a "read" and a "write" always happen together, even if one direction is dummy data.</div>`
      },
      {
        h: 'Clocking: SCLK, CPOL and CPHA - the Four Modes',
        html: String.raw`<p>SPI is <b>source-synchronous</b>: the master ships the clock alongside the data, so no clock recovery is needed at the slave. Two configuration bits define the exact timing relationship, and both master and slave must agree or every bit is misread:</p>
        <ul>
          <li><b>CPOL</b> (Clock Polarity) - the idle level of SCLK. CPOL=0 means the clock idles low; CPOL=1 means it idles high.</li>
          <li><b>CPHA</b> (Clock Phase) - which clock edge <em>samples</em> data. CPHA=0 samples on the <b>first</b> (leading) edge and shifts on the second; CPHA=1 samples on the <b>second</b> (trailing) edge and shifts on the first.</li>
        </ul>
        <p>The two bits give <b>four modes</b>:</p>
        <table class="data">
          <tr><th>Mode</th><th>CPOL</th><th>CPHA</th><th>SCLK idle</th><th>Data sampled on</th><th>Data shifted on</th></tr>
          <tr><td>0</td><td>0</td><td>0</td><td>Low</td><td>Rising (leading)</td><td>Falling (trailing)</td></tr>
          <tr><td>1</td><td>0</td><td>1</td><td>Low</td><td>Falling (trailing)</td><td>Rising (leading)</td></tr>
          <tr><td>2</td><td>1</td><td>0</td><td>High</td><td>Falling (leading)</td><td>Rising (trailing)</td></tr>
          <tr><td>3</td><td>1</td><td>1</td><td>High</td><td>Rising (trailing)</td><td>Falling (leading)</td></tr>
        </table>
        <p><b>Mode 0</b> (CPOL=0, CPHA=0) is by far the most common. A subtle but critical point: when CPHA=0, the first data bit must be presented on the data line <b>before</b> the first clock edge (i.e., on the SS-assertion edge), because the very first edge already samples it. This makes CPHA=0 slightly harder to bit-bang correctly.</p>`
      },
      {
        h: 'Topology, Addressing and Number of Devices',
        html: String.raw`<p>SPI has <b>no addressing whatsoever</b>. A slave is selected purely by pulling its dedicated <b>SS</b> line low. This has direct topological consequences:</p>
        <ul>
          <li><b>Independent (star) topology</b> - the usual arrangement: SCLK, MOSI, MISO are shared buses, but the master provides <b>one SS line per slave</b>. To add a slave you add a GPIO pin. The practical device count is therefore limited by the master's available select pins, not by any protocol address field.</li>
          <li><b>Daisy-chain topology</b> - MISO of one slave feeds MOSI of the next, all sharing one SS and one SCLK, forming one long shift register. Data ripples through all devices; N devices require N-word-long transfers. Saves select pins but adds latency and requires device support.</li>
        </ul>
        <p>Since there is no address, there is also no broadcast/acknowledge/collision concept. Exactly one slave may drive MISO at a time; the master guarantees this by asserting only one SS. If two SS lines were low at once, two slaves would fight on MISO (bus contention).</p>
        <div class="callout"><b>No handshaking / no flow control:</b> SPI has <b>no ACK, no NACK, no wait states, and no ready signal</b> in the base protocol. The master clocks data at whatever rate it chooses and simply assumes the slave keeps up. If a slave is not ready, the base protocol offers no standardized way to stall the master (unlike AXI's VALID/READY). This is the sharpest contrast with handshaken buses.</div>`
      },
      {
        h: 'Data / Frame / Word Format',
        html: String.raw`<p>SPI defines <b>no framing at the protocol level</b> - there are no start bits, stop bits, parity bits, length fields, or delimiters. A "frame" is simply the span during which SS is held low; within it the master emits an arbitrary number of clock pulses, transferring one bit per edge. Conventions layered on top:</p>
        <ul>
          <li><b>Word size</b> is application-defined, commonly 8, 16, or 24/32 bits. Both ends must agree; nothing on the wire announces it.</li>
          <li><b>Bit order</b> is usually <b>MSB-first</b>, but LSB-first is configurable on many controllers - again, a mutual agreement, not a wire-encoded property.</li>
          <li><b>Command/address bytes</b> - device datasheets (e.g., a flash chip's READ opcode plus 3 address bytes) define a private higher-layer format inside the raw SPI stream. SPI itself is agnostic.</li>
          <li>Because it is full-duplex, every transferred byte out is matched by a byte in. A one-directional operation still clocks dummy bytes in the unused direction.</li>
        </ul>
        <p>The result: SPI's on-wire "format" is <b>pure payload</b>. There is nothing to strip and nothing to insert, which is exactly why its throughput equals the clock rate.</p>
        <p>Although SPI defines no protocol framing, a typical device-defined <b>transaction</b> follows a recognisable structure, delimited entirely by the SS line. A common flash/register access looks like:</p>
        <table class="data">
          <tr><th>Phase</th><th>On which line</th><th>Typical size</th><th>Purpose</th></tr>
          <tr><td>1. Assert CS/SS</td><td>SS (master, active-low)</td><td>—</td><td>Selects the slave and marks the start of the transaction</td></tr>
          <tr><td>2. Command / opcode byte</td><td>MOSI</td><td>0–1 byte (device-defined)</td><td>Optional instruction (e.g. READ, WRITE, register access)</td></tr>
          <tr><td>3. Address byte(s)</td><td>MOSI</td><td>0–4 bytes (device-defined)</td><td>Optional target address / register index</td></tr>
          <tr><td>4. Data byte(s)</td><td>MOSI and/or MISO</td><td>N bytes</td><td>Payload written and/or read (full-duplex: both directions clock together)</td></tr>
          <tr><td>5. Deassert CS/SS</td><td>SS</td><td>—</td><td>Ends the transaction and returns the slave to idle</td></tr>
        </table>
        <p>Every one of these phases is <b>defined by the device datasheet, not by SPI</b> — the command, address, and data widths are conventions the two ends agree on. On the wire it is just a run of clocked bits between SS-assert and SS-deassert.</p>`
      },
      {
        h: 'Error Checking, Integrity and Reliability',
        html: String.raw`<p>The base SPI protocol has <b>no error detection at all</b> - no parity bit, no checksum, no CRC, no acknowledgement. A bit corrupted by noise, a marginal setup/hold violation, or a mis-set mode is silently accepted. Consequences and mitigations:</p>
        <ul>
          <li>Reliability rests on the <b>short, controlled on-board environment</b>: tight, matched trace lengths; grounded returns; and clock rates kept well within the slave's rated setup/hold window.</li>
          <li>Any integrity checking is <b>application-layer</b>: device protocols may embed a CRC in the payload (some sensors and NAND flash do), or the software may read-back and verify.</li>
          <li>There is <b>no redundancy</b> concept - no dual bus, no failover - in the standard. SPI is a point-of-simplicity design, not a fault-tolerant one.</li>
        </ul>
        <p>This is a deliberate trade: SPI omits every field that costs bits or wires, accepting that the integrator must guarantee signal integrity by layout and by keeping the clock conservative.</p>`
      },
      {
        h: 'Data Rate, Throughput and Timing',
        html: String.raw`<p>SPI has <b>no maximum speed defined by the standard</b>; the limit is set by the slowest device's rated maximum SCLK, by trace/parasitic delays, and by round-trip timing on MISO. Practical rates run from hundreds of kHz for slow sensors to <b>tens of MHz</b> (commonly 10-50 MHz, up to ~100+ MHz for fast flash/DDR-mode parts).</p>
        <p>Because there is one bit per clock and no overhead, the arithmetic is exact:</p>
        <ul>
          <li><b>Throughput</b> $R = f_{SCLK}$ bits/s (single-lane, standard SPI). No overhead factor.</li>
          <li><b>Frame time</b> for an $N$-bit word: $T = N / f_{SCLK}$, plus small inter-frame SS setup/hold gaps.</li>
          <li><b>Round-trip constraint</b>: on a read, the master drives SCLK, the slave responds after its clock-to-out delay, and that data must return and settle before the master samples it. At high $f_{SCLK}$ this MISO round-trip (not the shift register) is often the true speed ceiling.</li>
        </ul>
        <p>Wider "Dual" and "Quad" SPI (QSPI) variants use 2 or 4 data lines to multiply throughput by 2x or 4x while sacrificing pure full-duplex - a common extension for serial flash, though outside base SPI.</p>
        <p><b>Key SPI variants</b> beyond the canonical 4-wire form:</p>
        <table class="data">
          <tr><th>Variant</th><th>Data lines</th><th>Duplex</th><th>Notes</th></tr>
          <tr><td>Standard (4-wire)</td><td>MOSI + MISO (2)</td><td>Full-duplex</td><td>The canonical form: separate in and out lines.</td></tr>
          <tr><td>3-wire (half-duplex)</td><td>Single bidirectional SDIO/SISO (1)</td><td>Half-duplex</td><td>MOSI and MISO merged into one bidirectional data line plus SCLK and SS; saves a pin at the cost of full-duplex. Common on space-constrained sensors.</td></tr>
          <tr><td>Dual SPI</td><td>IO0, IO1 (2)</td><td>Half-duplex</td><td>Both lines carry data in the same direction to double throughput; used by serial flash.</td></tr>
          <tr><td>Quad SPI / QSPI</td><td>IO0-IO3 (4)</td><td>Half-duplex</td><td>Four data lines for 4x throughput; the standard fast-read mode for NOR flash and XIP boot.</td></tr>
          <tr><td>Microwire</td><td>SI + SO (2)</td><td>Half-duplex (typ.)</td><td>National Semiconductor's predecessor/subset of SPI, effectively fixed to Mode 0, typically half-duplex with a command/response framing.</td></tr>
        </table>
        <p>Note that Dual/Quad/QSPI trade SPI's inherent full-duplex for higher one-directional throughput, and the 3-wire form trades it for a lower pin count.</p>`
      },
      {
        h: 'Use Cases, Pros and Cons, and a Comparison Table',
        html: String.raw`<p><b>Where SPI shines:</b> on-board links to ADCs/DACs, SPI/QSPI NOR flash, MEMS and environmental sensors, LCD/OLED display controllers, SD cards (SPI mode), Ethernet/CAN controllers, and RF transceiver configuration ports (e.g., configuring the AD9361 via its SPI register map).</p>
        <p><b>Pros:</b> highest raw throughput of the simple on-board buses (no overhead), full-duplex, dead-simple hardware (two shift registers), no pull-ups required, no addressing to manage for small systems, no defined speed cap. <b>Cons:</b> no error checking, no acknowledgement/flow control, no addressing (one SS pin per slave burns pins), short reach (single-ended, unterminated), no formal standard document, and four+ wires versus I2C's two.</p>
        <table class="data">
          <tr><th>Attribute</th><th>SPI</th><th>I2C</th><th>UART (RS-232)</th><th>RS-485</th></tr>
          <tr><td>Wires</td><td>4 (+1 SS/slave)</td><td>2 (SDA, SCL)</td><td>2-3 (TX, RX, GND)</td><td>2 (differential pair)</td></tr>
          <tr><td>Clocking</td><td>Synchronous (SCLK)</td><td>Synchronous (SCL)</td><td>Asynchronous</td><td>Asynchronous</td></tr>
          <tr><td>Duplex</td><td>Full</td><td>Half</td><td>Full</td><td>Half (typ. multidrop)</td></tr>
          <tr><td>Masters</td><td>Single</td><td>Multi-master</td><td>Point-to-point</td><td>Multidrop</td></tr>
          <tr><td>Addressing</td><td>None (SS line)</td><td>7/10-bit address</td><td>None</td><td>App-layer</td></tr>
          <tr><td>Ack / flow control</td><td>None</td><td>ACK/NACK per byte</td><td>None (opt. RTS/CTS)</td><td>None (app-layer)</td></tr>
          <tr><td>Error check</td><td>None</td><td>ACK only</td><td>Parity (optional)</td><td>App-layer</td></tr>
          <tr><td>Typical rate</td><td>10s of MHz</td><td>0.1-3.4 MHz</td><td>&le;~1 Mbps</td><td>&le;~10 Mbps</td></tr>
          <tr><td>Reach</td><td>On-board (cm)</td><td>On-board (cm)</td><td>~15 m</td><td>~1200 m</td></tr>
        </table>`
      }
    ],
    keyPoints: [
      String.raw`SPI is a 4-wire (SCLK, MOSI, MISO, SS), full-duplex, synchronous, single-master/multiple-slave on-board bus.`,
      String.raw`Only the master generates SCLK; a slave is selected by pulling its dedicated active-low SS line low - there is no addressing.`,
      String.raw`Four modes are set by CPOL (idle level) and CPHA (sampling edge); both ends must match. Mode 0 (CPOL=0, CPHA=0) is most common.`,
      String.raw`Full-duplex: every SCLK edge shifts a bit out on MOSI and simultaneously a bit in on MISO - a read and a write always co-occur.`,
      String.raw`No framing: no start/stop/parity, no length field, no headers. Word size and MSB/LSB order are agreed off-wire.`,
      String.raw`No handshaking, no ACK/NACK, no wait states - the master clocks at will and assumes the slave keeps up.`,
      String.raw`No error detection in the base protocol (no parity, checksum, or CRC); integrity relies on short controlled layout or app-layer checks.`,
      String.raw`Zero protocol overhead means throughput $R = f_{SCLK}$ exactly (one payload bit per clock).`,
      String.raw`Frame time for an $N$-bit word is $T = N/f_{SCLK}$; at high speed the MISO round-trip delay, not the shift register, caps the rate.`,
      String.raw`Device count in independent mode is limited by the master's SS pins, not by any address space; daisy-chaining shares one SS as one long shift register.`,
      String.raw`Short reach: single-ended, unterminated push-pull signalling meant for a single PCB, not cables.`,
      String.raw`No formal standard document exists; SPI is a de-facto convention with vendor-specific naming (controller/peripheral, SDO/SDI).`,
      String.raw`Variants: 3-wire (single bidirectional SDIO line, half-duplex, saves a pin); Dual/Quad/QSPI (2/4 data lines for 2x/4x throughput, half-duplex, used by serial flash); Microwire (National's SPI predecessor, effectively Mode 0).`
    ],
    equations: [
      {
        title: 'SPI throughput = clock rate',
        tex: String.raw`$$ R = f_{SCLK} \quad \text{(bits/s, single lane)} $$`,
        derivation: String.raw`<p><b>Where we start.</b> On an SPI transfer, the master toggles SCLK and every clock edge that "samples" moves exactly one data bit from transmitter to receiver. There are no start bits, stop bits, parity bits, address fields, or headers on the wire.</p>
        <p><b>Step 1 - count bits per clock.</b> In standard single-lane SPI, one payload bit is transferred per SCLK period (sampled on one edge, shifted on the other). So in one clock period we move one useful bit.</p>
        $$ \text{bits per clock period} = 1 $$
        <p>This is the crucial fact: unlike an asynchronous UART frame (which spends bits on start/stop/parity), SPI spends <em>no</em> bits on framing.</p>
        <p><b>Step 2 - multiply by clock frequency.</b> If SCLK runs at $f_{SCLK}$ periods per second, and each period carries one bit, the payload rate is just their product.</p>
        $$ R = 1\ \tfrac{\text{bit}}{\text{clock}} \times f_{SCLK}\ \tfrac{\text{clocks}}{\text{s}} = f_{SCLK} $$
        <p><b>Result.</b> $$ R = f_{SCLK} $$ Sanity check: at $f_{SCLK}=20$ MHz, $R=20$ Mbit/s - all payload, since the overhead factor is 1. Compare a UART at 20 Mbaud with 8N1 framing, which delivers only $8/10 = 16$ Mbit/s of payload.</p>`
      },
      {
        title: 'Frame time for an N-bit word',
        tex: String.raw`$$ T_{frame} = \frac{N}{f_{SCLK}} $$`,
        derivation: String.raw`<p><b>Where we start.</b> A "word" in SPI is just $N$ consecutive bits clocked while SS is held low; there is nothing else in the frame.</p>
        <p><b>Step 1 - one clock period per bit.</b> The duration of a single SCLK period is the reciprocal of its frequency.</p>
        $$ T_{clk} = \frac{1}{f_{SCLK}} $$
        <p><b>Step 2 - N bits take N periods.</b> Because exactly one bit moves per clock period, an $N$-bit word occupies $N$ periods.</p>
        $$ T_{frame} = N \times T_{clk} = \frac{N}{f_{SCLK}} $$
        <p><b>Result.</b> $$ T_{frame} = \frac{N}{f_{SCLK}} $$ Sanity check: a 16-bit ADC read at $f_{SCLK}=10$ MHz takes $16/10^7 = 1.6\ \mu s$ (plus small SS setup/hold and any inter-word gap). Doubling the clock halves the frame time, as expected for an overhead-free bus.</p>`
      },
      {
        title: 'Effective payload efficiency vs a framed async link',
        tex: String.raw`$$ \eta_{SPI} = \frac{N_{data}}{N_{data} + N_{overhead}} = \frac{N}{N + 0} = 1 $$`,
        derivation: String.raw`<p><b>Where we start.</b> Efficiency (payload divided by total bits on the wire) exposes how much of the link is "wasted" on framing.</p>
        <p><b>Step 1 - write the general efficiency.</b> For any framed link, of every group of bits some are data and some are protocol overhead.</p>
        $$ \eta = \frac{N_{data}}{N_{data} + N_{overhead}} $$
        <p><b>Step 2 - substitute SPI's overhead.</b> SPI adds no start, stop, parity, address, or CRC bits, so $N_{overhead}=0$.</p>
        $$ \eta_{SPI} = \frac{N}{N + 0} = 1 $$
        <p><b>Result.</b> $$ \eta_{SPI} = 1\ (100\%) $$ Sanity check: for an 8N1 UART, $N_{data}=8$ and $N_{overhead}=2$ (1 start + 1 stop), giving $\eta = 8/10 = 0.8$. SPI's 100% efficiency is the mathematical statement of "zero protocol overhead."</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What are the four SPI signals?`, back: String.raw`SCLK (clock, master-generated), MOSI (master out/slave in), MISO (master in/slave out), and SS/CS (active-low slave select, one per slave).` },
      { front: String.raw`Who generates the SPI clock?`, back: String.raw`Only the master. Slaves never drive SCLK; without the master's clock, no bits move.` },
      { front: String.raw`Is SPI full- or half-duplex?`, back: String.raw`Full-duplex: MOSI and MISO carry data simultaneously; every clock edge shifts a bit out and a bit in at the same time.` },
      { front: String.raw`What do CPOL and CPHA set?`, back: String.raw`CPOL sets the idle level (polarity) of SCLK; CPHA selects which edge (leading or trailing) samples the data. Together they define the four SPI modes.` },
      { front: String.raw`Which SPI mode is most common?`, back: String.raw`Mode 0 (CPOL=0, CPHA=0): clock idles low, data sampled on the rising (leading) edge.` },
      { front: String.raw`How is a slave addressed in SPI?`, back: String.raw`It is not addressed by any field - the master simply pulls that slave's dedicated SS line low. One SS pin per slave.` },
      { front: String.raw`What error detection does SPI provide?`, back: String.raw`None in the base protocol: no parity, checksum, or CRC, and no acknowledgement. Integrity must be handled at the application layer.` },
      { front: String.raw`What is SPI's flow control mechanism?`, back: String.raw`There is none. No ACK/NACK, no wait states, no ready line - the master clocks at its chosen rate and assumes the slave keeps up.` },
      { front: String.raw`What is SPI's protocol overhead?`, back: String.raw`Zero. No start/stop/parity/address/CRC bits, so throughput equals the clock rate ($R = f_{SCLK}$) and efficiency is 100%.` },
      { front: String.raw`Why is SPI short-reach?`, back: String.raw`Signals are single-ended, push-pull, and unterminated, intended for one PCB (cm-scale). It is not a cable/differential interface.` },
      { front: String.raw`What limits SPI's maximum speed?`, back: String.raw`Not the standard (there is none) but the slowest slave's rated SCLK and the MISO round-trip delay (clock-to-out plus return settling) at high frequency.` },
      { front: String.raw`Independent vs daisy-chain SPI topology?`, back: String.raw`Independent: shared SCLK/MOSI/MISO with one SS per slave (star). Daisy-chain: slaves form one long shift register sharing a single SS and SCLK.` },
      { front: String.raw`What must happen on MISO for unselected slaves?`, back: String.raw`They must tri-state (high-Z) their MISO output so only the one selected slave drives the shared line - otherwise bus contention.` },
      { front: String.raw`How long does a 16-bit SPI word take at 10 MHz?`, back: String.raw`$T = N/f_{SCLK} = 16/10^7 = 1.6\ \mu s$, plus small SS setup/hold and inter-word gaps.` },
      { front: String.raw`What is 3-wire SPI?`, back: String.raw`A half-duplex variant where MOSI and MISO are merged into a single bidirectional data line (SDIO), leaving SCLK, SDIO, and SS. It saves a pin but gives up full-duplex; the direction is turned around under software control.` },
      { front: String.raw`What are Dual, Quad, and QSPI?`, back: String.raw`Multi-lane SPI extensions using 2 (Dual) or 4 (Quad/QSPI) data lines carrying data in the same direction for 2x or 4x throughput. They are half-duplex and are the standard fast-read modes for serial NOR flash and execute-in-place (XIP) boot.` },
      { front: String.raw`What is Microwire?`, back: String.raw`National Semiconductor's predecessor to / subset of SPI, effectively locked to Mode 0 and typically half-duplex with a simple command/response framing. It interoperates with SPI Mode 0 devices.` }
    ],
    mcqs: [
      { q: String.raw`Which signal in a standard SPI bus is generated exclusively by the master?`, options: ['MISO', 'SCLK', 'SS of the master', 'MOSI and MISO equally'], answer: 1, explain: String.raw`Only the master generates SCLK. MOSI is master-driven data, MISO is slave-driven data, and SS lines are master outputs, but the clock is uniquely the master's.` },
      { q: String.raw`SPI is best described as:`, options: ['Half-duplex asynchronous', 'Full-duplex synchronous', 'Full-duplex asynchronous', 'Half-duplex synchronous'], answer: 1, explain: String.raw`A dedicated clock line makes it synchronous, and simultaneous MOSI/MISO traffic makes it full-duplex.` },
      { q: String.raw`CPHA=0 means data is sampled on the:`, options: ['Second (trailing) clock edge', 'First (leading) clock edge', 'Falling edge only', 'SS-deassert edge'], answer: 1, explain: String.raw`CPHA=0 samples on the first/leading edge of each clock period and shifts on the second; CPHA=1 is the reverse.` },
      { q: String.raw`How does an SPI master address a particular slave?`, options: ['With a 7-bit address byte', 'By asserting that slave\'s dedicated SS line low', 'By a preamble sync word', 'By CRC token'], answer: 1, explain: String.raw`SPI has no addressing field; selection is purely by pulling the slave's active-low SS line low.` },
      { q: String.raw`What is the protocol overhead of standard single-lane SPI?`, options: ['1 start + 1 stop bit per byte', 'A CRC per frame', 'Zero', 'A 7-bit address per transfer'], answer: 2, explain: String.raw`SPI adds no framing, parity, address, or CRC bits, giving zero overhead and 100% payload efficiency.` },
      { q: String.raw`Payload throughput of standard SPI equals:`, options: ['$f_{SCLK}/2$', '$0.8\,f_{SCLK}$', '$f_{SCLK}$', '$2 f_{SCLK}$'], answer: 2, explain: String.raw`One payload bit per clock with no overhead gives $R = f_{SCLK}$.` },
      { q: String.raw`Which of these does base SPI NOT provide?`, options: ['A clock line', 'Full-duplex data', 'Acknowledgement / error checking', 'Slave select'], answer: 2, explain: String.raw`SPI has no ACK/NACK and no parity/CRC. It does provide SCLK, full-duplex data, and SS lines.` },
      { q: String.raw`In an independent (star) SPI topology, the number of slaves is limited primarily by:`, options: ['A 5-bit address space', 'The number of SS pins on the master', 'The 256-beat burst limit', 'The parity budget'], answer: 1, explain: String.raw`Each slave needs its own SS line, so the master's available select pins cap the count - there is no address field.` },
      { q: String.raw`Why must unselected SPI slaves tri-state MISO?`, options: ['To save power only', 'To avoid two drivers fighting on the shared MISO line', 'To generate the clock', 'To send a NACK'], answer: 1, explain: String.raw`Only the selected slave may drive the shared MISO; others must go high-Z to prevent bus contention.` },
      { q: String.raw`Compared with a UART, SPI is:`, options: ['Asynchronous and slower', 'Synchronous with a shared clock and no framing overhead', 'Differential and long-reach', 'Multi-master with addressing'], answer: 1, explain: String.raw`SPI is synchronous (shares SCLK) and carries pure payload, unlike an asynchronous UART with start/stop framing.` },
      { q: String.raw`Which is the true speed ceiling for SPI reads at high $f_{SCLK}$?`, options: ['Parity recomputation', 'MISO round-trip delay (clock-to-out plus return settling)', 'The 32-word message limit', 'Manchester decoding'], answer: 1, explain: String.raw`At high clock rates the slave's clock-to-out delay plus the return path must settle before the master samples - this round-trip, not the shift register, usually limits speed.` },
      { q: String.raw`A daisy-chained SPI arrangement:`, options: ['Uses one SS per device', 'Forms one long shift register sharing a single SS and SCLK', 'Requires I2C addressing', 'Is full-duplex per device with separate clocks'], answer: 1, explain: String.raw`In daisy-chain mode MISO->MOSI links devices into one shift register clocked by a shared SCLK under a single SS.` },
      { q: String.raw`Time to clock a 24-bit SPI word at 8 MHz (ignoring gaps) is:`, options: ['$1.5\ \mu s$', '$3\ \mu s$', '$0.33\ \mu s$', '$24\ \mu s$'], answer: 1, explain: String.raw`$T = N/f_{SCLK} = 24/(8\times10^6) = 3\ \mu s$.` },
      { q: String.raw`SPI's intended physical reach is:`, options: ['Up to 1200 m', 'On-board, centimetre-scale', 'Tens of metres over cable', 'Global via transformers'], answer: 1, explain: String.raw`Single-ended, unterminated push-pull signalling limits SPI to short on-board traces.` },
      { q: String.raw`Which SPI variant merges MOSI and MISO into one bidirectional line and is therefore half-duplex?`, options: ['Quad SPI (QSPI)', '3-wire SPI', 'Daisy-chain SPI', 'Microwire'], answer: 1, explain: String.raw`3-wire SPI uses a single bidirectional SDIO line (plus SCLK and SS), saving a pin at the cost of full-duplex operation.` },
      { q: String.raw`Compared with standard 4-wire SPI, Quad SPI (QSPI):`, options: ['Adds a CRC to every frame', 'Uses 4 data lines for up to 4x throughput but is half-duplex', 'Doubles the reach to metres', 'Adds a 7-bit address field'], answer: 1, explain: String.raw`QSPI uses four data lines (IO0-IO3) carrying data in the same direction, giving up to 4x throughput at the expense of full-duplex - the standard fast-read mode for NOR flash.` }
    ],
    numericals: [
      { q: String.raw`An SPI ADC is read as a 16-bit word at $f_{SCLK}=25$ MHz. What is the frame time and the payload throughput?`, solution: String.raw`Frame time $T = N/f_{SCLK} = 16/(25\times10^6) = 0.64\ \mu s$. Throughput $R = f_{SCLK} = 25$ Mbit/s (overhead-free). If words are read back-to-back with no gap, sample rate $\approx 1/0.64\ \mu s \approx 1.56$ Msps.` },
      { q: String.raw`A serial flash needs an 8-bit opcode, 24-bit address, then 256 data bytes read over standard SPI at 40 MHz. Estimate the transfer time (ignore SS gaps).`, solution: String.raw`Total bits $= 8 + 24 + 256\times8 = 8 + 24 + 2048 = 2080$ bits. Time $= 2080/(40\times10^6) = 52\ \mu s$. Because SPI has zero overhead, every bit is either command, address, or data.` },
      { q: String.raw`Compare payload efficiency of SPI vs an 8N1 UART, both clocking 8-bit data words.`, solution: String.raw`SPI: $\eta = N/(N+0) = 8/8 = 1 = 100\%$. UART 8N1: $\eta = 8/(8+1+1) = 8/10 = 80\%$. At the same raw bit rate SPI delivers 25% more payload ($1/0.8 = 1.25$).` },
      { q: String.raw`A slave's datasheet lists a max clock-to-output delay $t_{co}=8$ ns on MISO and requires 4 ns setup at the master. Round-trip trace delay is 3 ns. What is the approximate maximum reliable $f_{SCLK}$ for reads?`, solution: String.raw`The MISO data must be valid at the master before its sampling edge. Budget $= t_{co} + t_{trace} + t_{su} = 8 + 3 + 4 = 15$ ns. This must fit within (roughly) half a clock period for mode-0 sampling, so $T_{clk}/2 \ge 15$ ns $\Rightarrow T_{clk}\ge 30$ ns $\Rightarrow f_{SCLK}\le 1/30\text{ns} \approx 33$ MHz. The round-trip, not the shift register, sets the limit.` },
      { q: String.raw`Four SPI sensors share SCLK/MOSI/MISO in independent mode. How many master GPIO lines are needed just for chip selects, and why can't they share one?`, solution: String.raw`Four SS lines - one per sensor - because there is no address field; selection is by asserting a unique SS low. Sharing one SS would select all four, causing multiple slaves to drive MISO simultaneously (contention). Total independent-mode pins: 3 shared + 4 SS = 7.` }
    ],
    realWorld: String.raw`<p>SPI is ubiquitous in embedded and avionics-adjacent hardware. In an SDR platform, the host controller configures an <b>AD9361</b> RF transceiver entirely through its SPI register map - setting LO frequencies, gains, and filter bandwidths - while the wideband IQ data flows over a separate high-speed interface. Board designers pick SPI for its raw speed to <b>QSPI NOR flash</b> holding FPGA bitstreams (fast boot), for streaming from high-resolution ADCs, and for driving TFT displays. The engineering discipline SPI demands is timing: because there is no acknowledgement or error check, integrators verify setup/hold across temperature, keep SCLK conservative, match trace lengths, and add application-layer read-back or CRC where data integrity is safety-relevant. Its very austerity - no addressing, no ACK, no CRC - is what makes it fast and cheap, and simultaneously why it never leaves the board.</p>`,
    related: ['rs232', 'rs422', 'axi', 'sdr', 'ad9361']
  },
  {
    id: 'axi',
    title: 'AXI Bus',
    category: 'Interfaces & Protocols',
    tags: ['axi', 'amba', 'arm', 'valid-ready', 'burst', 'memory-mapped', 'soc', 'fpga', 'interconnect'],
    summary: String.raw`AXI is ARM's high-performance AMBA on-chip interconnect protocol built on five independent VALID/READY-handshaked channels, supporting bursts, out-of-order and outstanding transactions between memory-mapped managers and subordinates.`,
    diagram: { svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-axi" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<rect x="14" y="70" width="104" height="120" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="66" y="126" fill="#e6edf3" text-anchor="middle" font-weight="bold">Manager</text>
<text x="66" y="144" fill="#9aa7b5" text-anchor="middle" font-size="9">(master)</text>
<rect x="215" y="55" width="110" height="150" rx="6" fill="#1c232e" stroke="#b197fc"/>
<text x="270" y="126" fill="#e6edf3" text-anchor="middle" font-weight="bold">Inter-</text>
<text x="270" y="144" fill="#e6edf3" text-anchor="middle" font-weight="bold">connect</text>
<rect x="422" y="70" width="104" height="120" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="474" y="126" fill="#e6edf3" text-anchor="middle" font-weight="bold">Subordinate</text>
<text x="474" y="144" fill="#9aa7b5" text-anchor="middle" font-size="9">(slave)</text>
<line x1="118" y1="80" x2="215" y2="80" stroke="#ffa94d" marker-end="url(#arr-axi)"/>
<text x="166" y="75" fill="#ffa94d" text-anchor="middle" font-size="9">AW</text>
<line x1="118" y1="100" x2="215" y2="100" stroke="#ffa94d" marker-end="url(#arr-axi)"/>
<text x="166" y="95" fill="#ffa94d" text-anchor="middle" font-size="9">W</text>
<line x1="215" y1="120" x2="118" y2="120" stroke="#63e6be" marker-end="url(#arr-axi)"/>
<text x="166" y="115" fill="#63e6be" text-anchor="middle" font-size="9">B</text>
<line x1="118" y1="145" x2="215" y2="145" stroke="#4dabf7" marker-end="url(#arr-axi)"/>
<text x="166" y="140" fill="#4dabf7" text-anchor="middle" font-size="9">AR</text>
<line x1="215" y1="165" x2="118" y2="165" stroke="#63e6be" marker-end="url(#arr-axi)"/>
<text x="166" y="160" fill="#63e6be" text-anchor="middle" font-size="9">R</text>
<line x1="325" y1="80" x2="422" y2="80" stroke="#ffa94d" marker-end="url(#arr-axi)"/>
<text x="373" y="75" fill="#ffa94d" text-anchor="middle" font-size="9">AW</text>
<line x1="325" y1="100" x2="422" y2="100" stroke="#ffa94d" marker-end="url(#arr-axi)"/>
<text x="373" y="95" fill="#ffa94d" text-anchor="middle" font-size="9">W</text>
<line x1="422" y1="120" x2="325" y2="120" stroke="#63e6be" marker-end="url(#arr-axi)"/>
<text x="373" y="115" fill="#63e6be" text-anchor="middle" font-size="9">B</text>
<line x1="325" y1="145" x2="422" y2="145" stroke="#4dabf7" marker-end="url(#arr-axi)"/>
<text x="373" y="140" fill="#4dabf7" text-anchor="middle" font-size="9">AR</text>
<line x1="422" y1="165" x2="325" y2="165" stroke="#63e6be" marker-end="url(#arr-axi)"/>
<text x="373" y="160" fill="#63e6be" text-anchor="middle" font-size="9">R</text>
<text x="270" y="225" fill="#e6edf3" text-anchor="middle" font-size="10">5 channels: AR, R (read) &#183; AW, W, B (write)</text>
<text x="270" y="242" fill="#9aa7b5" text-anchor="middle" font-size="10">each carries its own VALID/READY handshake</text>
</svg>`, caption: String.raw`AXI: a manager talks through the interconnect to a subordinate over five independent channels (AR, R, AW, W, B), each with its own VALID/READY handshake.` },
    prerequisites: ['spi', 'comm-basics', 'sdr'],
    intro: String.raw`<p>The <b>Advanced eXtensible Interface (AXI)</b> is part of ARM's <b>AMBA</b> (Advanced Microcontroller Bus Architecture) family. Introduced as AXI3 and refined into <b>AXI4</b>, it is the dominant <b>on-chip interconnect</b> for SoCs and FPGAs: it connects CPUs, DMA engines, DDR memory controllers, accelerators, and peripherals inside a single die. Unlike SPI - a handful of wires bit-banging serial data on-board - AXI is a wide, parallel, <b>memory-mapped</b>, high-throughput fabric measured in gigabytes per second.</p>
    <p>AXI's defining ideas are (1) <b>five independent channels</b> that separate the address, data, and response phases of reads and writes, so they can overlap and pipeline; and (2) a single, universal <b>VALID/READY handshake</b> on every channel that provides two-way flow control - the source asserts VALID when it has data, the destination asserts READY when it can accept, and transfer occurs only when both are high on a rising clock edge. This decoupling lets AXI support pipelined <b>bursts</b> (up to 256 beats in AXI4), multiple <b>outstanding transactions</b>, and <b>out-of-order</b> completion, which are the levers that hide memory latency and sustain high bandwidth. The three profiles - full <b>AXI4</b> (bursts), <b>AXI4-Lite</b> (single beat, register access), and <b>AXI4-Stream</b> (no addresses, pure data flow) - cover everything from a control register to a video pipeline.</p>`,
    sections: [
      {
        h: 'The Five Channels and Who Initiates',
        html: String.raw`<p>AXI is a <b>manager/subordinate</b> (formerly master/slave) protocol: a <b>manager</b> initiates transactions; a <b>subordinate</b> (e.g., a memory controller) responds. A read and a write are fully independent, each with its own channels:</p>
        <ul>
          <li><b>AR - Read Address channel</b> (manager -> subordinate): carries the read address and control (ARADDR, ARLEN, ARSIZE, ARBURST, ARID...).</li>
          <li><b>R - Read Data channel</b> (subordinate -> manager): returns read data (RDATA), a response (RRESP), and RLAST marking the final beat.</li>
          <li><b>AW - Write Address channel</b> (manager -> subordinate): the write address and control, mirroring AR.</li>
          <li><b>W - Write Data channel</b> (manager -> subordinate): the write data (WDATA), byte-enable strobes (WSTRB), and WLAST.</li>
          <li><b>B - Write Response channel</b> (subordinate -> manager): a single response (BRESP) acknowledging the whole write burst.</li>
        </ul>
        <p>Because address and data are on <b>separate channels</b>, a manager can issue the next address while data for the previous transaction is still flowing - this is the source of AXI's pipelining. Reads have no separate response channel (RRESP rides on each read-data beat); writes need channel B because the subordinate must confirm the write landed.</p>
        <p>Each channel carries its own payload signals plus the universal <code>xVALID</code>/<code>xREADY</code> handshake pair. The key signals per channel:</p>
        <table class="data">
          <tr><th>Channel</th><th>Direction</th><th>Key payload signals</th><th>Handshake</th></tr>
          <tr><td><b>AR</b> - Read Address</td><td>manager &rarr; subordinate</td><td>ARADDR, ARLEN (beats-1), ARSIZE (bytes/beat), ARBURST (FIXED/INCR/WRAP), ARID, ARPROT, ARCACHE</td><td>ARVALID / ARREADY</td></tr>
          <tr><td><b>R</b> - Read Data</td><td>subordinate &rarr; manager</td><td>RDATA, RRESP (OKAY/EXOKAY/SLVERR/DECERR), RLAST, RID</td><td>RVALID / RREADY</td></tr>
          <tr><td><b>AW</b> - Write Address</td><td>manager &rarr; subordinate</td><td>AWADDR, AWLEN, AWSIZE, AWBURST, AWID, AWPROT, AWCACHE</td><td>AWVALID / AWREADY</td></tr>
          <tr><td><b>W</b> - Write Data</td><td>manager &rarr; subordinate</td><td>WDATA, WSTRB (per-byte write strobes), WLAST</td><td>WVALID / WREADY</td></tr>
          <tr><td><b>B</b> - Write Response</td><td>subordinate &rarr; manager</td><td>BRESP (OKAY/EXOKAY/SLVERR/DECERR), BID</td><td>BVALID / BREADY</td></tr>
        </table>
        <p><b>Burst / beat structure:</b> one address handshake on AR/AW launches a burst of 1-256 <b>beats</b> (data transfers) on R/W. AxLEN encodes (beats &minus; 1); AxSIZE sets the bytes per beat (up to the full data-bus width); AxBURST sets how the address advances between beats (FIXED, INCR, or WRAP); and <code>xLAST</code> is asserted on the final beat to delimit the burst - there is no length field on the data channel itself. A write burst is: one AW handshake, then N W-beats (last one WLAST=1), then a single B response; a read burst is: one AR handshake, then N R-beats (last one RLAST=1), each carrying its own RRESP.</p>
        <div class="callout"><b>Read vs write independence:</b> the AR/R pair and AW/W/B pair are decoupled, so reads and writes proceed <b>concurrently</b> and can be reordered relative to each other. This full separation of read and write paths is a key differentiator from older shared-bus designs.</div>`
      },
      {
        h: 'The VALID/READY Handshake - Flow Control on Every Channel',
        html: String.raw`<p>Every one of the five channels uses the <b>identical two-wire handshake</b>. The <b>source</b> of a channel drives <code>xVALID</code> to say "the payload on this channel is valid"; the <b>destination</b> drives <code>xREADY</code> to say "I can accept it now." A <b>transfer happens on a rising clock edge only when both VALID and READY are high</b>.</p>
        <ul>
          <li>The source <b>must not wait</b> for READY before asserting VALID (that would deadlock); it asserts VALID as soon as it has valid data.</li>
          <li>Once VALID is asserted it <b>must remain</b> asserted (and the payload stable) until the handshake completes - VALID cannot be withdrawn.</li>
          <li>The destination may assert or de-assert READY freely; de-asserting READY inserts <b>wait states</b> that throttle the source - this is the flow control.</li>
        </ul>
        <p>This gives clean, per-channel backpressure. A slow subordinate simply holds READY low to stall; a manager not ready for read data holds RREADY low. It is fully <b>synchronous</b> - all channels share one clock, all handshakes are sampled on its rising edge - so there is no clock recovery or Manchester coding as in a self-clocked bus.</p>
        <div class="callout"><b>Latency of a handshake:</b> a transfer's latency (in cycles) is the number of clock edges from VALID assertion until the edge where READY is also high. Zero wait states means one cycle per beat; each cycle READY is held low adds one beat of latency.</div>`
      },
      {
        h: 'Bursts, Beats and Transfer Sizing',
        html: String.raw`<p>AXI4 moves data in <b>bursts</b>: one address transaction on AR/AW triggers a sequence of data <b>beats</b> on R/W. Key control fields:</p>
        <ul>
          <li><b>ARLEN/AWLEN</b> - burst length. In AXI4 a burst can be <b>1 to 256 beats</b> (LEN field value 0-255, since length = LEN+1). AXI3 allowed up to 16.</li>
          <li><b>ARSIZE/AWSIZE</b> - the number of bytes per beat, up to the full data-bus width (a 128-bit bus = 16 bytes/beat).</li>
          <li><b>ARBURST/AWBURST</b> - burst type: <b>FIXED</b> (same address, e.g., a FIFO port), <b>INCR</b> (address increments each beat - normal memory), or <b>WRAP</b> (wraps at a boundary - used for cache-line fills).</li>
          <li><b>WSTRB</b> - per-byte write strobes let a beat write only some byte lanes (sparse/partial writes).</li>
          <li><b>xLAST</b> - asserted on the final beat to delimit the burst; there is no separate length counter on the data channel.</li>
        </ul>
        <p>A single address handshake amortized over up to 256 data beats is why AXI sustains high bandwidth: the address overhead is paid once per burst, not per beat. Address alignment and the "no 4KB boundary crossing" rule keep bursts within a single subordinate region.</p>
        <p><b>Narrow and unaligned transfers:</b> a beat need not use the full data-bus width. When AxSIZE is smaller than the bus width, the transfer is <b>narrow</b> - the active byte lanes shift according to the address and burst type, and WSTRB (writes) marks which lanes are live. When the start address is not aligned to AxSIZE, the first beat is <b>unaligned</b> and only the bytes at/above the address are valid. Together, narrow and unaligned support let AXI faithfully move a single byte, a half-word, or a misaligned struct without a separate protocol.</p>`
      },
      {
        h: 'Outstanding, Out-of-Order Transactions and IDs',
        html: String.raw`<p>AXI can have many transactions <b>in flight (outstanding)</b> at once, and can complete them <b>out of order</b>. The mechanism is the transaction <b>ID</b> tag:</p>
        <ul>
          <li><b>ARID/AWID</b> tag each issued transaction; <b>RID/BID</b> on the responses carry the matching tag so the manager can reassemble responses that arrive out of order.</li>
          <li>Transactions with the <b>same ID</b> must complete <b>in order</b> (ordering guarantee); different IDs may complete in any order, letting a fast subordinate answer before a slow one.</li>
          <li><b>Outstanding depth</b> - a manager may issue several addresses before receiving the first data, hiding memory latency. If each transaction takes $L$ cycles and the manager keeps $D$ outstanding, throughput is sustained as long as $D \ge L / T_{beat}$ so the pipeline never drains.</li>
        </ul>
        <p>This is how AXI hides DRAM latency: rather than stalling for one transaction to return, the manager launches many, and the interconnect/subordinate services and returns them by ID. Out-of-order plus outstanding transactions are the throughput levers that a purely in-order, one-at-a-time bus lacks.</p>`
      },
      {
        h: 'Exclusive/Locked Access and the Control Sidebands (QoS/CACHE/PROT)',
        html: String.raw`<p>Beyond address and data, each AXI address channel carries <b>sideband control signals</b> that qualify a transaction, plus a mechanism for atomic access:</p>
        <ul>
          <li><b>Exclusive access</b> (AxLOCK = exclusive) implements atomic read-modify-write for semaphores/mutexes without locking the whole bus. A manager issues an <b>exclusive read</b>, later an <b>exclusive write</b> to the same address; if no other master wrote that location in between, the subordinate returns <b>EXOKAY</b> and the write succeeds - otherwise it returns OKAY and the write is not performed, so the manager retries. This is the load-linked/store-conditional idiom carried on the bus.</li>
          <li><b>Locked access</b> (a legacy AXI3 AxLOCK value) held the bus/slave locked across a sequence of transactions; AXI4 <b>deprecated true locked transfers</b> in favour of the lighter exclusive-access scheme, leaving AxLOCK a single bit (normal vs exclusive).</li>
          <li><b>AxCACHE</b> (4 bits) - memory attributes: Bufferable, Modifiable/Cacheable, Read-Allocate, Write-Allocate - telling the interconnect/memory how the access may be buffered or cached.</li>
          <li><b>AxPROT</b> (3 bits) - protection type: privileged vs unprivileged, secure vs non-secure (TrustZone), and instruction vs data access.</li>
          <li><b>AxQOS</b> (4 bits, added in AXI4) - a Quality-of-Service priority hint the interconnect can use to arbitrate between competing managers.</li>
          <li><b>AxREGION</b> (4 bits, AXI4) - a region identifier letting one physical slave interface present multiple logical regions without extra address decode.</li>
        </ul>
        <table class="data">
          <tr><th>Signal</th><th>Width</th><th>Purpose</th></tr>
          <tr><td>AxLOCK</td><td>1 bit (AXI4)</td><td>Normal vs exclusive (atomic) access; locked transfers deprecated from AXI3.</td></tr>
          <tr><td>AxCACHE</td><td>4 bits</td><td>Bufferable / Modifiable / Read-Allocate / Write-Allocate memory attributes.</td></tr>
          <tr><td>AxPROT</td><td>3 bits</td><td>Privileged/unprivileged, Secure/Non-secure, Instruction/Data.</td></tr>
          <tr><td>AxQOS</td><td>4 bits</td><td>Quality-of-Service arbitration priority hint (AXI4).</td></tr>
          <tr><td>AxREGION</td><td>4 bits</td><td>Region identifier for multi-region slave interfaces (AXI4).</td></tr>
        </table>
        <p>These sidebands are how AXI conveys security, cacheability, atomicity, and priority to the interconnect without any extra transaction - metadata riding alongside every address handshake.</p>`
      },
      {
        h: 'AXI4 vs AXI4-Lite vs AXI4-Stream',
        html: String.raw`<p>The AMBA AXI4 specification defines three variants tuned to different needs:</p>
        <table class="data">
          <tr><th>Variant</th><th>Channels</th><th>Bursts</th><th>Addressing</th><th>Use</th></tr>
          <tr><td><b>AXI4</b> (full)</td><td>All 5 (AR,R,AW,W,B)</td><td>Up to 256 beats</td><td>Memory-mapped</td><td>High-throughput memory / DMA / DDR</td></tr>
          <tr><td><b>AXI4-Lite</b></td><td>All 5, but single-beat</td><td>1 beat only</td><td>Memory-mapped</td><td>Simple register/control access</td></tr>
          <tr><td><b>AXI4-Stream</b></td><td>1 (data only)</td><td>Unbounded flow</td><td>None (no address)</td><td>Streaming data (video, DSP, IQ)</td></tr>
        </table>
        <p><b>AXI4-Lite</b> strips out bursts, IDs, and out-of-order support for a lightweight register interface - ideal for a peripheral's control/status registers. <b>AXI4-Stream</b> throws away addresses entirely: it is a pure point-to-point data pipe with TVALID/TREADY handshake, TDATA, TLAST (frame boundary), TKEEP, and TUSER - perfect for streaming an IQ sample flow from an SDR front end into a DSP block. Full <b>AXI4</b> is the memory-mapped workhorse.</p>
        <p>The broader <b>AMBA</b> family that AXI belongs to (all ARM specifications) situates these profiles among related buses:</p>
        <table class="data">
          <tr><th>Protocol</th><th>Role in AMBA</th><th>Distinguishing feature</th></tr>
          <tr><td><b>AXI3</b></td><td>Original high-performance interface</td><td>5 channels; bursts up to 16 beats; supported write-data interleaving.</td></tr>
          <tr><td><b>AXI4</b></td><td>Refined high-performance interface</td><td>Bursts up to 256 beats (INCR); added QoS signals; dropped write interleaving.</td></tr>
          <tr><td><b>AXI4-Lite</b></td><td>Lightweight subset</td><td>Single-beat, no bursts/IDs - for registers.</td></tr>
          <tr><td><b>AXI4-Stream</b></td><td>Streaming subset</td><td>Address-less data flow (TVALID/TREADY/TDATA/TLAST).</td></tr>
          <tr><td><b>ACE</b> (AXI Coherency Extensions)</td><td>Cache-coherent extension of AXI4</td><td>Adds coherency channels/signals (snoop address AC, snoop response CR, snoop data CD, plus ACSNOOP/ARSNOOP/AWSNOOP domains) so multiple caching masters share a coherent view of memory; <b>ACE-Lite</b> is the one-way-coherent variant for I/O-coherent masters (e.g. a DMA that snoops CPU caches but is not itself snooped).</td></tr>
          <tr><td><b>AHB / APB</b></td><td>Older/simpler AMBA buses</td><td>AHB is a pipelined shared bus; APB is a low-power peripheral bus - both predate AXI and are still used for low-bandwidth blocks.</td></tr>
        </table>`
      },
      {
        h: 'Bandwidth, Data Width and Clocking',
        html: String.raw`<p>AXI is <b>synchronous</b>: one shared clock times all channels; every handshake and beat is sampled on its rising edge. Peak bandwidth follows directly from data-bus width and clock:</p>
        <ul>
          <li><b>Peak bandwidth</b> $BW = W_{bytes}\times f_{clk}$, i.e., (bytes per beat) x (beats per second) at one beat/cycle with no wait states.</li>
          <li>Common widths: 32, 64, 128, 256, 512, up to 1024 bits. A 128-bit (16-byte) bus at 200 MHz gives $16\times200\times10^6 = 3.2$ GB/s.</li>
          <li><b>Efficiency</b> = useful beats / total cycles. Wait states (READY low), address-phase gaps, and short bursts reduce it below 100%; long INCR bursts with a fast subordinate approach 100%.</li>
        </ul>
        <p>Because AXI stays on-chip and synchronous, there is no error-detection field like CRC on the wire (the die is a controlled environment); the only "response" is the 2-bit <b>RRESP/BRESP</b> status (OKAY, EXOKAY, SLVERR, DECERR) reporting access success, a slave error, or a decode (no such address) error. Data integrity for safety-critical use is added by ECC in memories and, in ARM's extended <b>AMBA</b> family, by protocols/parity layered on top - not by the base AXI handshake.</p>`
      },
      {
        h: 'Use Cases, Pros/Cons and a Comparison Table',
        html: String.raw`<p><b>Where AXI lives:</b> the internal fabric of ARM SoCs and Xilinx/AMD & Intel FPGAs - connecting processing systems to DDR controllers, DMA, video/DSP accelerators, and IP blocks. In an RFSoC/SDR, wideband IQ streams travel over <b>AXI4-Stream</b> between the data converters and DSP, while control registers are reached over <b>AXI4-Lite</b>, and bulk sample buffers move to DRAM over full <b>AXI4</b>.</p>
        <p><b>Pros:</b> very high bandwidth (parallel, wide, burst); pipelined via separate address/data channels; two-way flow control via VALID/READY; outstanding and out-of-order transactions hide latency; scalable interconnect; well-supported IP ecosystem. <b>Cons:</b> on-chip only (not a board/cable interface); many wires (hundreds of signals); more complex to implement than a simple bus; no on-wire error coding beyond 2-bit response status.</p>
        <table class="data">
          <tr><th>Attribute</th><th>AXI4</th><th>SPI</th><th>MIL-STD-1553B</th></tr>
          <tr><td>Domain</td><td>On-chip (SoC/FPGA)</td><td>On-board (PCB)</td><td>Platform (aircraft)</td></tr>
          <tr><td>Topology</td><td>Interconnect fabric</td><td>Star / daisy-chain</td><td>Dual-redundant multidrop bus</td></tr>
          <tr><td>Initiator</td><td>Manager</td><td>Master</td><td>Bus Controller</td></tr>
          <tr><td>Clocking</td><td>Synchronous (shared clk)</td><td>Source-synchronous (SCLK)</td><td>Self-clocked (Manchester II)</td></tr>
          <tr><td>Flow control</td><td>VALID/READY per channel</td><td>None</td><td>Command/response, BC-scheduled</td></tr>
          <tr><td>Data path</td><td>Parallel 32-1024 bit</td><td>Serial 1 bit</td><td>Serial 1 Mbps</td></tr>
          <tr><td>Error check</td><td>2-bit RRESP/BRESP</td><td>None</td><td>Parity + Status word</td></tr>
          <tr><td>Redundancy</td><td>None (in base)</td><td>None</td><td>Dual-redundant bus</td></tr>
          <tr><td>Bandwidth</td><td>GB/s</td><td>10s of Mbit/s</td><td>1 Mbit/s (deterministic)</td></tr>
        </table>`
      }
    ],
    keyPoints: [
      String.raw`AXI is ARM's AMBA on-chip interconnect (AXI3/AXI4) for SoCs and FPGAs - wide, parallel, memory-mapped, GB/s-class.`,
      String.raw`Five independent channels: AR & R (read), AW, W & B (write). Separate address and data channels enable pipelining.`,
      String.raw`A manager (master) initiates; a subordinate (slave) responds. Reads and writes are fully independent and can proceed concurrently.`,
      String.raw`Every channel uses the same VALID/READY handshake; transfer occurs when both are high on a rising clock edge - this is the flow control.`,
      String.raw`Source asserts VALID as soon as data is ready (must not wait for READY) and holds it until the handshake completes; destination throttles by holding READY low.`,
      String.raw`AXI4 bursts run 1-256 beats (LEN+1); burst types FIXED, INCR, WRAP; xLAST delimits the final beat; WSTRB gives per-byte writes.`,
      String.raw`Transaction IDs (ARID/AWID -> RID/BID) allow multiple outstanding and out-of-order transactions; same ID stays ordered, different IDs may reorder.`,
      String.raw`Outstanding transactions hide memory latency: keep enough in flight so the pipeline never drains.`,
      String.raw`Three profiles: AXI4 (full bursts, memory-mapped), AXI4-Lite (single-beat register access), AXI4-Stream (address-less data flow, TVALID/TREADY/TLAST).`,
      String.raw`AXI is fully synchronous on a shared clock; peak bandwidth $BW = W_{bytes}\times f_{clk}$.`,
      String.raw`On-wire status is the 2-bit RRESP/BRESP (OKAY, EXOKAY, SLVERR, DECERR); there is no CRC in base AXI - it is an on-chip controlled environment.`,
      String.raw`Contrast with SPI (serial, no flow control, on-board) and 1553 (self-clocked, redundant, avionics): AXI trades reach for on-chip bandwidth.`,
      String.raw`AMBA family: AXI3 (16-beat bursts), AXI4 (256-beat, QoS, no write-interleave), AXI4-Lite, AXI4-Stream, and ACE/ACE-Lite (cache-coherency extensions adding snoop channels AC/CR/CD); older AHB/APB round out AMBA.`,
      String.raw`Atomic access uses exclusive transactions (AxLOCK=exclusive): an exclusive read then exclusive write, succeeding with EXOKAY only if the location was untouched in between - AXI4 deprecated the older true "locked" transfers.`,
      String.raw`Address sidebands qualify each transaction: AxCACHE (bufferable/cacheable attributes), AxPROT (privileged/secure/instruction), AxQOS (priority hint), AxREGION - plus narrow (AxSIZE < bus width) and unaligned transfers.`
    ],
    equations: [
      {
        title: 'Peak AXI bandwidth',
        tex: String.raw`$$ BW = W_{bytes}\times f_{clk} $$`,
        derivation: String.raw`<p><b>Where we start.</b> AXI is synchronous: one beat of data (a full data-bus word) can transfer on each rising clock edge, provided VALID and READY are both high (no wait states).</p>
        <p><b>Step 1 - bytes per beat.</b> If the data bus is $W_{bits}$ wide, each beat carries $W_{bytes} = W_{bits}/8$ bytes.</p>
        $$ W_{bytes} = \frac{W_{bits}}{8} $$
        <p><b>Step 2 - beats per second.</b> With one beat per clock and clock frequency $f_{clk}$, there are $f_{clk}$ beats per second at full utilisation.</p>
        $$ \text{beats/s} = f_{clk} $$
        <p><b>Step 3 - multiply.</b> Bandwidth is bytes per beat times beats per second.</p>
        $$ BW = W_{bytes}\times f_{clk} $$
        <p><b>Result.</b> $$ BW = \frac{W_{bits}}{8}\times f_{clk} $$ Sanity check: a 128-bit bus at 200 MHz gives $BW = 16\times200\times10^6 = 3.2\ \text{GB/s}$. Wait states and address gaps only reduce this from the peak.</p>`
      },
      {
        title: 'Burst payload and address-overhead amortization',
        tex: String.raw`$$ D_{burst} = (\text{AxLEN}+1)\times W_{bytes} $$`,
        derivation: String.raw`<p><b>Where we start.</b> One address handshake on AR/AW launches a whole burst of data beats on R/W. The burst length field AxLEN encodes (beats - 1).</p>
        <p><b>Step 1 - number of beats.</b> Because AxLEN is zero-based, the beat count is one more than the field value.</p>
        $$ N_{beats} = \text{AxLEN} + 1 \quad (1 \le N_{beats} \le 256\ \text{in AXI4}) $$
        <p><b>Step 2 - bytes per beat.</b> Each beat carries $W_{bytes}$ bytes (from AxSIZE, up to full bus width).</p>
        $$ \text{bytes/beat} = W_{bytes} $$
        <p><b>Step 3 - total burst data.</b> Multiply beats by bytes per beat.</p>
        $$ D_{burst} = (\text{AxLEN}+1)\times W_{bytes} $$
        <p><b>Result & efficiency.</b> A single address cycle is amortized over $N_{beats}$ data cycles, so bus efficiency $\eta \approx \dfrac{N_{beats}}{N_{beats}+1}$ (one address cycle per burst). For a 256-beat burst, $\eta \approx 256/257 \approx 99.6\%$; for a single-beat (Lite) access, $\eta \approx 1/2 = 50\%$. This is why long bursts are essential for high sustained throughput.</p>`
      },
      {
        title: 'Outstanding transactions needed to hide latency',
        tex: String.raw`$$ D_{min} = \left\lceil \frac{L}{T_{beat}} \right\rceil $$`,
        derivation: String.raw`<p><b>Where we start.</b> A subordinate returns read data $L$ seconds after it accepts an address (round-trip latency). If the manager issues one transaction and waits, the read data channel sits idle for $L$ each time - throughput collapses.</p>
        <p><b>Step 1 - the pipeline must stay full.</b> To keep the data channel busy every cycle, new data must arrive each beat time $T_{beat}=1/f_{clk}$. During one latency $L$, the number of beat-slots that would otherwise be empty is $L/T_{beat}$.</p>
        $$ \text{slots per latency} = \frac{L}{T_{beat}} $$
        <p><b>Step 2 - issue that many outstanding.</b> If the manager keeps $D$ transactions outstanding, their responses arrive staggered one per beat, filling those slots. We need at least enough to cover the latency.</p>
        $$ D_{min} = \left\lceil \frac{L}{T_{beat}} \right\rceil $$
        <p><b>Result.</b> $$ D_{min} = \left\lceil \frac{L}{T_{beat}} \right\rceil $$ Sanity check: latency $L=100$ ns and $T_{beat}=5$ ns ($f_{clk}=200$ MHz) require $D_{min}=\lceil 100/5\rceil = 20$ outstanding transactions to run the data channel at full rate. Fewer than that and the pipeline drains, wasting bandwidth. This is precisely why AXI supports many outstanding, out-of-order transactions.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`Name AXI's five channels and their directions.`, back: String.raw`AR (read address, mgr->sub), R (read data, sub->mgr), AW (write address, mgr->sub), W (write data, mgr->sub), B (write response, sub->mgr).` },
      { front: String.raw`What is the AXI VALID/READY handshake rule?`, back: String.raw`The source asserts xVALID when its payload is valid; the destination asserts xREADY when it can accept; transfer happens on a rising clock edge only when both are high.` },
      { front: String.raw`Can a source wait for READY before asserting VALID?`, back: String.raw`No. The source must assert VALID as soon as it has valid data, independent of READY (waiting would deadlock), and must hold VALID until the handshake completes.` },
      { front: String.raw`How does an AXI subordinate throttle a manager?`, back: String.raw`By de-asserting READY, which inserts wait states and stalls the source - this is AXI's built-in flow control (backpressure).` },
      { front: String.raw`What is the maximum burst length in AXI4?`, back: String.raw`256 beats (AxLEN 0-255, length = AxLEN+1). AXI3 allowed only 16.` },
      { front: String.raw`What are the three AXI burst types?`, back: String.raw`FIXED (same address, e.g. FIFO), INCR (incrementing address, normal memory), and WRAP (wraps at a boundary, for cache-line fills).` },
      { front: String.raw`What do AXI transaction IDs enable?`, back: String.raw`Multiple outstanding and out-of-order transactions. Same-ID transactions stay ordered; different IDs may complete in any order (tagged by RID/BID).` },
      { front: String.raw`Why does a write need a B channel but a read does not?`, back: String.raw`A read carries its response (RRESP) on each data beat, but a write must be confirmed after the data lands, so the subordinate returns a single BRESP on channel B.` },
      { front: String.raw`Distinguish AXI4, AXI4-Lite, and AXI4-Stream.`, back: String.raw`AXI4: full memory-mapped bursts. AXI4-Lite: single-beat, no bursts/IDs, for registers. AXI4-Stream: address-less point-to-point data flow (TVALID/TREADY/TDATA/TLAST).` },
      { front: String.raw`What are AXI's response codes?`, back: String.raw`The 2-bit RRESP/BRESP: OKAY, EXOKAY (exclusive access OK), SLVERR (slave error), DECERR (decode error - no such address).` },
      { front: String.raw`Give AXI's peak bandwidth formula.`, back: String.raw`$BW = W_{bytes}\times f_{clk}$: bytes per beat times beats per second at one beat/cycle with no wait states.` },
      { front: String.raw`Is AXI synchronous or self-clocked?`, back: String.raw`Fully synchronous: all five channels share one clock and every handshake/beat is sampled on its rising edge - no clock recovery.` },
      { front: String.raw`What does WSTRB do?`, back: String.raw`Per-byte write strobes select which byte lanes of a write beat are actually written, enabling sparse/partial writes.` },
      { front: String.raw`How do outstanding transactions improve throughput?`, back: String.raw`They hide latency: the manager issues many addresses before responses return, keeping the data channel full so the pipeline never drains.` },
      { front: String.raw`What is ACE in the AMBA family?`, back: String.raw`AXI Coherency Extensions - it extends AXI4 with snoop channels (AC snoop-address, CR snoop-response, CD snoop-data) and snoop-domain signals so multiple cached masters keep a coherent view of shared memory. ACE-Lite is the one-way (I/O-coherent) variant.` },
      { front: String.raw`How does AXI perform an atomic (exclusive) access?`, back: String.raw`With AxLOCK set to exclusive: the manager does an exclusive read then an exclusive write to the same address. The subordinate returns EXOKAY (and performs the write) only if nothing wrote that location in between; otherwise it returns OKAY and skips the write, so the manager retries. AXI4 deprecated the older true "locked" transactions.` },
      { front: String.raw`What do AxCACHE, AxPROT, and AxQOS convey?`, back: String.raw`AxCACHE gives memory attributes (bufferable/cacheable/allocate); AxPROT gives protection (privileged/secure/instruction-vs-data); AxQOS (AXI4) is a Quality-of-Service priority hint the interconnect uses to arbitrate between managers.` },
      { front: String.raw`What are narrow and unaligned AXI transfers?`, back: String.raw`A narrow transfer uses AxSIZE smaller than the full data-bus width, so only some byte lanes are active; an unaligned transfer starts at an address not aligned to AxSIZE, so only the bytes at/above the address are valid in the first beat.` }
    ],
    mcqs: [
      { q: String.raw`How many independent channels does AXI define?`, options: ['3', '5', '2', '8'], answer: 1, explain: String.raw`Five: AR and R (read), AW, W, and B (write). Separate address and data channels enable pipelining.` },
      { q: String.raw`In AXI, a data transfer on a channel occurs when:`, options: ['VALID is high, regardless of READY', 'READY is high, regardless of VALID', 'Both VALID and READY are high on a rising clock edge', 'The address matches an ID'], answer: 2, explain: String.raw`The universal handshake: transfer happens only when both VALID and READY are asserted at a rising clock edge.` },
      { q: String.raw`Which statement about the VALID signal is correct?`, options: ['The source may wait for READY before asserting VALID', 'Once asserted, VALID must be held until the handshake completes', 'VALID is driven by the destination', 'VALID can be pulsed for one cycle then dropped before READY'], answer: 1, explain: String.raw`The source asserts VALID independently of READY and must keep it (and the payload) stable until the transfer completes.` },
      { q: String.raw`The maximum burst length in AXI4 is:`, options: ['16 beats', '64 beats', '256 beats', '1024 beats'], answer: 2, explain: String.raw`AXI4 allows up to 256 beats (AxLEN+1); AXI3 was limited to 16.` },
      { q: String.raw`Which AXI burst type is used for cache-line fills?`, options: ['FIXED', 'INCR', 'WRAP', 'STREAM'], answer: 2, explain: String.raw`WRAP wraps the address at a boundary, matching how a cache line is filled starting from the critical word.` },
      { q: String.raw`AXI transaction IDs primarily enable:`, options: ['Error correction', 'Multiple outstanding and out-of-order transactions', 'Clock recovery', 'Redundant buses'], answer: 1, explain: String.raw`IDs tag transactions so responses can return out of order; same-ID transactions remain ordered.` },
      { q: String.raw`Why does a write need channel B but a read does not?`, options: ['Writes are slower', 'A read carries its response per beat; a write needs a single confirmation after data lands', 'B carries the clock', 'Reads use Manchester coding'], answer: 1, explain: String.raw`RRESP rides on each read beat, but the write needs the subordinate to confirm completion via BRESP on channel B.` },
      { q: String.raw`AXI4-Stream differs from full AXI4 in that it:`, options: ['Adds CRC to every beat', 'Has no address channels - it is pure data flow', 'Supports dual-redundant buses', 'Uses asynchronous signalling'], answer: 1, explain: String.raw`AXI4-Stream is address-less point-to-point streaming (TVALID/TREADY/TDATA/TLAST), ideal for DSP/IQ pipes.` },
      { q: String.raw`Peak bandwidth of a 256-bit AXI bus at 250 MHz is:`, options: ['4 GB/s', '8 GB/s', '16 GB/s', '32 GB/s'], answer: 1, explain: String.raw`$W_{bytes}=32$, $BW = 32\times250\times10^6 = 8$ GB/s.` },
      { q: String.raw`Which is NOT a valid AXI response code?`, options: ['OKAY', 'SLVERR', 'DECERR', 'CRCERR'], answer: 3, explain: String.raw`The 2-bit RRESP/BRESP values are OKAY, EXOKAY, SLVERR, DECERR. AXI has no CRC field, so CRCERR does not exist.` },
      { q: String.raw`AXI clocking is:`, options: ['Self-clocked Manchester', 'Source-synchronous serial', 'Fully synchronous on a shared clock', 'Asynchronous start/stop'], answer: 2, explain: String.raw`All channels are timed by one shared clock; every handshake is sampled on its rising edge.` },
      { q: String.raw`Amortizing one address cycle over a 256-beat burst gives an efficiency of about:`, options: ['50%', '75%', '99.6%', '25%'], answer: 2, explain: String.raw`$\eta \approx N/(N+1) = 256/257 \approx 99.6\%$ - long bursts hide the single address-cycle overhead.` },
      { q: String.raw`To hide a 100 ns latency at a 5 ns beat time, the minimum outstanding transactions needed is:`, options: ['5', '10', '20', '100'], answer: 2, explain: String.raw`$D_{min} = \lceil L/T_{beat}\rceil = \lceil 100/5\rceil = 20$.` },
      { q: String.raw`Compared with SPI and MIL-STD-1553B, AXI is distinguished by:`, options: ['Longest physical reach', 'On-chip GB/s parallel bandwidth with per-channel VALID/READY flow control', 'Dual-redundant transformer coupling', 'Self-clocked serial signalling'], answer: 1, explain: String.raw`AXI is the on-chip, wide, parallel, high-bandwidth fabric with handshake flow control - not a reach-oriented or redundant bus.` },
      { q: String.raw`Which AMBA protocol adds cache-coherency (snoop) support on top of AXI4?`, options: ['AXI4-Lite', 'AXI4-Stream', 'ACE (AXI Coherency Extensions)', 'APB'], answer: 2, explain: String.raw`ACE extends AXI4 with snoop channels (AC/CR/CD) and snoop domains so multiple cached masters share a coherent view of memory; ACE-Lite is the I/O-coherent variant.` },
      { q: String.raw`An AXI exclusive (atomic) access succeeds - returning EXOKAY - when:`, options: ['The burst is exactly 256 beats', 'No other master wrote the location between the exclusive read and exclusive write', 'AxPROT indicates a secure access', 'The address is 4KB-aligned'], answer: 1, explain: String.raw`Exclusive access (AxLOCK=exclusive) returns EXOKAY and performs the write only if the location was untouched since the exclusive read; otherwise OKAY is returned and the write is skipped, so the manager retries.` },
      { q: String.raw`The AXI signal that carries a Quality-of-Service arbitration priority hint is:`, options: ['AxCACHE', 'AxPROT', 'AxQOS', 'AxSIZE'], answer: 2, explain: String.raw`AxQOS (added in AXI4) is a 4-bit priority hint the interconnect can use to arbitrate among competing managers; AxCACHE gives memory attributes and AxPROT gives protection type.` },
      { q: String.raw`A "narrow" AXI transfer is one where:`, options: ['The address channel is disabled', 'AxSIZE is smaller than the full data-bus width, so only some byte lanes are active', 'The burst uses WRAP', 'Only reads are allowed'], answer: 1, explain: String.raw`A narrow transfer sets AxSIZE below the bus width, activating a subset of byte lanes (which lanes depends on address and burst type); an unaligned transfer starts off an AxSIZE boundary.` }
    ],
    numericals: [
      { q: String.raw`A full AXI4 write burst on a 64-bit bus has AWLEN = 15. How many bytes are written, and how many data beats occur?`, solution: String.raw`Beats $= $ AWLEN $+1 = 16$. Bytes/beat $= 64/8 = 8$. Total $D_{burst} = 16\times8 = 128$ bytes over 16 W-channel beats, launched by a single AW address handshake.` },
      { q: String.raw`Compute the peak bandwidth of a 512-bit AXI bus running at 300 MHz.`, solution: String.raw`$W_{bytes} = 512/8 = 64$. $BW = 64\times300\times10^6 = 1.92\times10^{10} = 19.2$ GB/s peak (one beat/cycle, no wait states).` },
      { q: String.raw`A subordinate returns read data 80 ns after accepting an address. The bus runs at 200 MHz. How many outstanding read transactions keep the read-data channel fully utilised?`, solution: String.raw`$T_{beat} = 1/f_{clk} = 5$ ns. $D_{min} = \lceil L/T_{beat}\rceil = \lceil 80/5\rceil = 16$ outstanding transactions. With 16 in flight, responses arrive one per beat and the data channel never idles.` },
      { q: String.raw`Compare bus efficiency of a single-beat AXI4-Lite access versus a 128-beat AXI4 burst, counting one address cycle overhead each.`, solution: String.raw`Lite: $\eta = 1/(1+1) = 50\%$ (one data beat per address cycle). Burst: $\eta = 128/(128+1) = 128/129 \approx 99.2\%$. The burst is far more efficient because the address cost is shared across many beats.` },
      { q: String.raw`A DMA reads 4 KB from DRAM over a 128-bit AXI4 bus using maximum-length bursts. How many bursts and beats are required (assume no 4KB boundary issue), and how long at 250 MHz with no wait states?`, solution: String.raw`Bytes/beat $= 16$. Beats needed $= 4096/16 = 256$ beats - exactly one maximum 256-beat AXI4 burst. Time $= 256\ \text{beats}\times(1/250\text{MHz}) = 256\times4\text{ns} = 1.024\ \mu s$ (plus one address cycle).` }
    ],
    realWorld: String.raw`<p>AXI is the connective tissue of virtually every modern SoC and FPGA. On a Xilinx/AMD RFSoC used for SDR, the ADC/DAC blocks stream wideband IQ samples into the programmable logic over <b>AXI4-Stream</b> (TVALID/TREADY backpressure naturally handles rate mismatches), DSP blocks are configured through <b>AXI4-Lite</b> register maps, and captured buffers are DMA'd to DDR over full <b>AXI4</b> bursts. An ARM Cortex CPU, its cache/DMA, the DDR controller, and every accelerator all talk over an AXI interconnect. Designers tune performance by choosing bus width, burst length, and outstanding-transaction depth to keep the DRAM pipeline full - exactly the levers the equations above quantify. Because it is a controlled on-chip environment, AXI spends no bits on CRC or redundancy; integrity for safety-critical designs is added by ECC memory and higher-layer AMBA extensions, not the base handshake. Its VALID/READY discipline - simple, universal, per-channel - is what makes disparate IP blocks from different vendors interoperate cleanly inside one chip.</p>`,
    related: ['spi', 'mil-std-1553', 'sdr', 'rfsoc']
  },
  {
    id: 'mil-std-1553',
    title: 'MIL-STD-1553B',
    category: 'Interfaces & Protocols',
    tags: ['1553', 'avionics', 'manchester', 'dual-redundant', 'deterministic', 'bus-controller', 'remote-terminal', 'military'],
    summary: String.raw`MIL-STD-1553B is a deterministic, dual-redundant 1 Mbps Manchester-II, transformer-coupled avionics data bus in which a single Bus Controller commands up to 31 Remote Terminals using 20-bit-time command, data, and status words.`,
    diagram: { svg: String.raw`<svg viewBox="0 0 540 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs><marker id="arr-1553" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa7b5"/></marker></defs>
<line x1="40" y1="70" x2="500" y2="70" stroke="#63e6be"/>
<text x="270" y="63" fill="#63e6be" text-anchor="middle" font-size="10">Bus A (dual-redundant twisted pair)</text>
<line x1="40" y1="92" x2="500" y2="92" stroke="#ffa94d"/>
<text x="270" y="107" fill="#ffa94d" text-anchor="middle" font-size="10">Bus B</text>
<line x1="40" y1="70" x2="40" y2="92" stroke="#b197fc" stroke-width="2"/>
<line x1="500" y1="70" x2="500" y2="92" stroke="#b197fc" stroke-width="2"/>
<text x="24" y="86" fill="#b197fc" text-anchor="middle" font-size="9">term</text>
<rect x="45" y="130" width="110" height="55" rx="6" fill="#1c232e" stroke="#4dabf7"/>
<text x="100" y="153" fill="#e6edf3" text-anchor="middle" font-size="11" font-weight="bold">Bus</text>
<text x="100" y="170" fill="#e6edf3" text-anchor="middle" font-size="11" font-weight="bold">Controller</text>
<rect x="185" y="130" width="80" height="55" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="225" y="155" fill="#e6edf3" text-anchor="middle" font-size="11">RT 1</text>
<text x="225" y="172" fill="#9aa7b5" text-anchor="middle" font-size="9">terminal</text>
<rect x="295" y="130" width="80" height="55" rx="6" fill="#1c232e" stroke="#63e6be"/>
<text x="335" y="155" fill="#e6edf3" text-anchor="middle" font-size="11">RT &#8804;31</text>
<rect x="405" y="130" width="95" height="55" rx="6" fill="#1c232e" stroke="#9aa7b5"/>
<text x="452" y="155" fill="#e6edf3" text-anchor="middle" font-size="11">Bus</text>
<text x="452" y="172" fill="#9aa7b5" text-anchor="middle" font-size="10">Monitor</text>
<line x1="100" y1="92" x2="100" y2="130" stroke="#9aa7b5" marker-end="url(#arr-1553)"/>
<circle cx="100" cy="111" r="5" fill="none" stroke="#b197fc"/>
<line x1="225" y1="92" x2="225" y2="130" stroke="#9aa7b5" marker-end="url(#arr-1553)"/>
<circle cx="225" cy="111" r="5" fill="none" stroke="#b197fc"/>
<line x1="335" y1="92" x2="335" y2="130" stroke="#9aa7b5" marker-end="url(#arr-1553)"/>
<circle cx="335" cy="111" r="5" fill="none" stroke="#b197fc"/>
<line x1="452" y1="92" x2="452" y2="130" stroke="#9aa7b5" marker-end="url(#arr-1553)"/>
<circle cx="452" cy="111" r="5" fill="none" stroke="#b197fc"/>
<text x="270" y="215" fill="#9aa7b5" text-anchor="middle" font-size="10">BC commands up to 31 RTs over transformer-coupled stubs (&#9711;); BM listens passively</text>
<text x="270" y="233" fill="#9aa7b5" text-anchor="middle" font-size="10">dual-redundant Bus A / Bus B, terminated at both ends</text>
</svg>`, caption: String.raw`MIL-STD-1553B: a Bus Controller commands up to 31 Remote Terminals (plus a passive Bus Monitor) over a transformer-coupled, dual-redundant Bus A / Bus B.` },
    prerequisites: ['mil-std-1553', 'comm-basics', 'rs485'],
    intro: String.raw`<p><b>MIL-STD-1553</b> is a US military standard (first issued 1973; the widely used <b>1553B</b> notice dates to 1978) defining a <b>digital, command/response, time-division multiplexed serial data bus</b> for military aircraft, and later spacecraft, ships, and ground vehicles. Where SPI is on-board simplicity and AXI is on-chip bandwidth, 1553 is about <b>determinism and fault tolerance</b> in a hostile, safety-critical environment: it must carry avionics data (attitude, navigation, weapons, engine) reliably for decades.</p>
    <p>Its architecture is deliberately centralized: a single <b>Bus Controller (BC)</b> is the sole initiator, scheduling every transfer; up to <b>31 Remote Terminals (RTs)</b> respond only when commanded; and optional <b>Bus Monitors (BM)</b> passively record traffic. The physical layer is a <b>shielded twisted-pair, transformer-coupled, dual-redundant</b> bus running <b>1 Mbps</b> using self-clocking <b>Manchester II</b> biphase encoding. Every transfer is built from fixed <b>20-bit-time words</b> (3 bit-times of sync + 16 data bits + 1 parity bit), and each word therefore lasts exactly <b>20 microseconds</b>. Because the BC schedules all traffic and the timing is fixed, message latency is bounded and predictable - the property that makes 1553 trusted for flight-critical control long after faster commercial buses appeared.</p>`,
    sections: [
      {
        h: 'Physical & Electrical Layer: Transformer-Coupled Dual-Redundant Bus',
        html: String.raw`<p>1553 uses a <b>shielded twisted-pair (STP)</b> transmission line as a shared multidrop bus, terminated at both ends in its characteristic impedance (nominally 70-85 ohm) to prevent reflections. Key electrical features:</p>
        <ul>
          <li><b>Transformer coupling</b> - terminals connect via isolation transformers, either <b>transformer-coupled</b> (long stub, with a coupling transformer and isolation resistors on the stub) or <b>direct-coupled</b> (short stub). Coupling provides galvanic isolation, common-mode rejection, and fault tolerance (a shorted stub does not kill the bus).</li>
          <li><b>Dual-redundant</b> - the standard specifies <b>two independent buses</b> (Bus A and Bus B). Only one is active at a time; if a message fails on one, the BC retries on the other. This redundancy is central to 1553's fault tolerance.</li>
          <li><b>Differential signalling</b> on the twisted pair rejects common-mode noise, essential in the electrically noisy airframe.</li>
          <li>Signal amplitude on the bus is a few volts peak-to-peak; the standard bounds transmitter output, noise rejection, and terminal input impedance so mixed-vendor terminals interoperate.</li>
        </ul>
        <div class="callout"><b>Why transformers?</b> Isolation transformers block DC, reject common-mode noise/ground loops, and let a faulty stub fail without shorting the main bus - exactly the ruggedness avionics demands over a 30-year airframe life.</div>`
      },
      {
        h: 'Clocking & Encoding: Self-Clocked Manchester II',
        html: String.raw`<p>Unlike SPI (separate clock wire) or AXI (shared clock), 1553 has <b>no separate clock line</b>. It is <b>self-clocking</b> via <b>Manchester II biphase-level encoding</b>: each bit contains a mid-bit transition, so the clock is embedded in the data stream and recovered by the receiver.</p>
        <ul>
          <li><b>Logic 1</b> = a high-to-low transition at the middle of the bit time; <b>logic 0</b> = a low-to-high transition. Every bit guarantees a mid-bit edge, so the receiver stays in sync and there is no DC content (good for transformer coupling).</li>
          <li>Because every bit has a transition, a long run of identical bits still carries timing - no separate clock needed and no baseline wander through the transformers.</li>
          <li>The <b>sync field</b> at the start of each word deliberately <b>violates</b> Manchester rules (a 3-bit-time waveform with no mid-bit transition in the usual place) so it is unmistakable as a word boundary, not data.</li>
        </ul>
        <p>At <b>1 Mbps</b>, one bit time is <b>1 microsecond</b>. The sync pattern occupies 3 bit-times (3 us), the 16 data bits occupy 16 us, and the parity bit 1 us - giving the fixed 20 us word.</p>`
      },
      {
        h: 'Word Formats: Command, Data and Status',
        html: String.raw`<p>Every 1553 transfer is assembled from three <b>20-bit-time word</b> types, each = 3-bit sync + 16 information bits + 1 odd-parity bit:</p>
        <table class="data">
          <tr><th>Word type</th><th>Sync</th><th>16-bit content</th><th>Sent by</th></tr>
          <tr><td><b>Command</b></td><td>Command/Status sync</td><td>5-bit RT address, T/R bit, 5-bit subaddress/mode, 5-bit word count / mode code</td><td>Bus Controller</td></tr>
          <tr><td><b>Data</b></td><td>Data sync (opposite of cmd)</td><td>16 bits of payload data</td><td>BC or RT</td></tr>
          <tr><td><b>Status</b></td><td>Command/Status sync</td><td>5-bit RT address + status/error bits (Message Error, Busy, Service Request, etc.)</td><td>Remote Terminal</td></tr>
        </table>
        <ul>
          <li>The <b>Command word</b>'s 5-bit RT address field allows addresses 0-31; address <b>31 (11111) is reserved for broadcast</b>, so <b>up to 31 uniquely addressable RTs</b> plus broadcast.</li>
          <li>The <b>Transmit/Receive (T/R) bit</b> tells the RT whether to transmit or receive; the 5-bit <b>word count</b> field encodes 1-32 data words (count 0 means 32), so <b>up to 32 data words per message</b>.</li>
          <li>The <b>Status word</b> is the RT's mandatory response, echoing its address and reporting health/error via dedicated bits - this is 1553's built-in acknowledgement.</li>
        </ul>
        <p>Field by field, each word is exactly <b>20 bit-times</b>. The three bit-field layouts follow.</p>
        <p><b>Command Word</b> (BC &rarr; RT), 20 bit-times:</p>
        <table class="data">
          <tr><th>Field</th><th>Bit-times</th><th>Meaning</th></tr>
          <tr><td>Sync</td><td>3</td><td>Command/Status sync (invalid-Manchester pattern; positive half then negative half)</td></tr>
          <tr><td>Remote Terminal Address</td><td>5</td><td>Which RT is addressed (0-30; 31 = broadcast)</td></tr>
          <tr><td>T/R bit</td><td>1</td><td>Transmit/Receive: 1 = RT transmits, 0 = RT receives</td></tr>
          <tr><td>Subaddress / Mode</td><td>5</td><td>RT subaddress (data location); values 00000 or 11111 flag a mode command</td></tr>
          <tr><td>Word Count / Mode Code</td><td>5</td><td>Number of data words 1-32 (00000 = 32), or a mode code when subaddress = 0/31</td></tr>
          <tr><td>Parity</td><td>1</td><td>Odd parity over the 16 information bits</td></tr>
        </table>
        <p><b>Status Word</b> (RT &rarr; BC), 20 bit-times:</p>
        <table class="data">
          <tr><th>Field</th><th>Bit-times</th><th>Meaning</th></tr>
          <tr><td>Sync</td><td>3</td><td>Command/Status sync (same distinctive pattern as the Command word)</td></tr>
          <tr><td>RT Address</td><td>5</td><td>Echoes the responding RT's own address</td></tr>
          <tr><td>Message Error</td><td>1</td><td>RT detected an error in the received command/data</td></tr>
          <tr><td>Instrumentation</td><td>1</td><td>Always logic 0 (distinguishes a status word from a command word)</td></tr>
          <tr><td>Service Request</td><td>1</td><td>RT requests BC attention/service</td></tr>
          <tr><td>Reserved</td><td>3</td><td>Reserved bits, set to 0</td></tr>
          <tr><td>Broadcast Command Received</td><td>1</td><td>Set if the last valid command was a broadcast</td></tr>
          <tr><td>Busy</td><td>1</td><td>RT is busy and cannot move data right now</td></tr>
          <tr><td>Subsystem Flag</td><td>1</td><td>A fault/failure in the RT's subsystem</td></tr>
          <tr><td>Dynamic Bus Control Acceptance</td><td>1</td><td>RT accepts becoming the bus controller</td></tr>
          <tr><td>Terminal Flag</td><td>1</td><td>A fault/failure within the RT itself</td></tr>
          <tr><td>Parity</td><td>1</td><td>Odd parity over the 16 information bits</td></tr>
        </table>
        <p><b>Data Word</b> (BC or RT), 20 bit-times:</p>
        <table class="data">
          <tr><th>Field</th><th>Bit-times</th><th>Meaning</th></tr>
          <tr><td>Sync</td><td>3</td><td>Data sync (the <em>opposite</em> invalid-Manchester pattern: negative half then positive half)</td></tr>
          <tr><td>Data</td><td>16</td><td>16 bits of payload (MSB first)</td></tr>
          <tr><td>Parity</td><td>1</td><td>Odd parity over the 16 data bits</td></tr>
        </table>
        <div class="callout"><b>The 3-bit-time sync is a distinctive invalid-Manchester pattern.</b> It deliberately holds one level for 1.5 bit-times then the other for 1.5 bit-times (no legal mid-bit transition), so it can never be mistaken for data. The <b>Command/Status sync is the opposite polarity of the Data sync</b> (Command/Status: high-half then low-half; Data: low-half then high-half), letting the receiver tell a data word from a command/status word purely from the sync.</div>
        <p><b>Common Mode Codes</b> (carried in the Word Count/Mode Code field when subaddress = 0 or 31):</p>
        <table class="data">
          <tr><th>Mode code</th><th>Function</th></tr>
          <tr><td>00000 (0)</td><td>Dynamic Bus Control</td></tr>
          <tr><td>00001 (1)</td><td>Synchronize (without data word)</td></tr>
          <tr><td>00010 (2)</td><td>Transmit Status Word</td></tr>
          <tr><td>00011 (3)</td><td>Initiate Self-Test</td></tr>
          <tr><td>00100 (4)</td><td>Transmitter Shutdown</td></tr>
          <tr><td>00101 (5)</td><td>Override Transmitter Shutdown</td></tr>
          <tr><td>00110 (6)</td><td>Inhibit Terminal Flag bit</td></tr>
          <tr><td>00111 (7)</td><td>Override Inhibit Terminal Flag bit</td></tr>
          <tr><td>01000 (8)</td><td>Reset Remote Terminal</td></tr>
          <tr><td>10000 (16)</td><td>Transmit Vector Word (with data word)</td></tr>
          <tr><td>10001 (17)</td><td>Synchronize (with data word)</td></tr>
          <tr><td>10010 (18)</td><td>Transmit Last Command (with data word)</td></tr>
          <tr><td>10011 (19)</td><td>Transmit Built-In-Test (BIT) Word (with data word)</td></tr>
          <tr><td>10100 (20)</td><td>Selected Transmitter Shutdown (with data word)</td></tr>
          <tr><td>10101 (21)</td><td>Override Selected Transmitter Shutdown (with data word)</td></tr>
        </table>
        <p>Mode codes <b>0-15 (0-01111) carry no data word</b>; mode codes <b>16-21 (10000-10101) carry a single data word</b>. The T/R bit distinguishes transmit (RT sends the data word) from receive (BC sends it) mode commands. Codes 01001-01111 and 10110-11111 are <b>reserved</b>.</p>`
      },
      {
        h: 'Message Formats and Who Initiates',
        html: String.raw`<p>1553 is strictly <b>command/response</b>: the <b>Bus Controller initiates every transaction</b>; RTs never speak unless commanded (no collisions possible). The standard defines message formats built from the three word types:</p>
        <ul>
          <li><b>BC-to-RT (receive)</b> - BC sends a receive Command word, then up to 32 Data words; the RT replies with a Status word.</li>
          <li><b>RT-to-BC (transmit)</b> - BC sends a transmit Command word; the RT replies with a Status word followed by up to 32 Data words.</li>
          <li><b>RT-to-RT</b> - BC sends a receive Command to one RT and a transmit Command to another; the transmitting RT sends Status + data, the receiving RT sends Status.</li>
          <li><b>Mode commands</b> - special commands (subaddress 0 or 31) for bus control functions (synchronize, transmit status, initiate self-test, etc.).</li>
          <li><b>Broadcast</b> - using RT address 31, the BC addresses all RTs at once (they do not return Status, to avoid collisions).</li>
        </ul>
        <p>The standard formally defines <b>ten information-transfer formats</b> (the six non-broadcast forms plus four broadcast variants). "C" = Command word, "D" = Data word, "S" = Status word; arrows show direction and the sequence is left-to-right in time:</p>
        <table class="data">
          <tr><th>#</th><th>Message format</th><th>Sequence on the bus</th><th>Broadcast?</th></tr>
          <tr><td>1</td><td>BC &rarr; RT (receive)</td><td>C (rcv) + up to 32 D from BC, then S from RT</td><td>No</td></tr>
          <tr><td>2</td><td>RT &rarr; BC (transmit)</td><td>C (xmt) from BC, then S + up to 32 D from RT</td><td>No</td></tr>
          <tr><td>3</td><td>RT &rarr; RT</td><td>C (rcv) to RT-A, C (xmt) to RT-B; RT-B sends S + D; RT-A sends S</td><td>No</td></tr>
          <tr><td>4</td><td>Mode command without data word</td><td>C (mode) from BC, then S from RT</td><td>No</td></tr>
          <tr><td>5</td><td>Mode command with data word (transmit)</td><td>C (mode) from BC, then S + one D from RT</td><td>No</td></tr>
          <tr><td>6</td><td>Mode command with data word (receive)</td><td>C (mode) + one D from BC, then S from RT</td><td>No</td></tr>
          <tr><td>7</td><td>Broadcast BC &rarr; RT(s)</td><td>C (rcv, addr 31) + up to 32 D from BC; no Status returned</td><td>Yes</td></tr>
          <tr><td>8</td><td>Broadcast RT &rarr; RT(s)</td><td>C (rcv, addr 31) + C (xmt) to one RT; that RT sends S + D; no Status from receivers</td><td>Yes</td></tr>
          <tr><td>9</td><td>Broadcast mode command without data word</td><td>C (mode, addr 31) from BC; no Status returned</td><td>Yes</td></tr>
          <tr><td>10</td><td>Broadcast mode command with data word (receive)</td><td>C (mode, addr 31) + one D from BC; no Status returned</td><td>Yes</td></tr>
        </table>
        <p>Note the rule for all broadcast forms: because every addressed RT would otherwise reply simultaneously, <b>RTs suppress their Status word on a broadcast</b> (they instead set the Broadcast Command Received bit for the next non-broadcast Status request). There is no broadcast form of RT&rarr;BC transmit (a single transmitter would not be a broadcast).</p>
        <p><b>Response time:</b> a commanded RT must begin its Status response within <b>4-12 us</b> of the command (the "response time"); the BC uses a <b>no-response timeout</b> (~14 us) to detect a dead RT and can then retry, including switching to the redundant bus. This deterministic timing is what bounds latency.</p>
        <div class="callout"><b>Duplex:</b> the bus is <b>half-duplex</b> - a single pair carries traffic in one direction at a time, arbitrated entirely by the BC's schedule. There is never contention because only the commanded terminal transmits.</div>`
      },
      {
        h: 'Error Checking, Status Reporting and Redundancy',
        html: String.raw`<p>1553 layers several integrity mechanisms - fitting for flight-critical use:</p>
        <ul>
          <li><b>Odd parity</b> on every word: the single parity bit makes each 17-bit (16 data + parity) field odd, catching any single-bit error per word.</li>
          <li><b>Manchester validity</b>: the receiver checks that each bit had a legal mid-bit transition and correct bit/word timing; a coding violation flags the word invalid.</li>
          <li><b>Status word error bits</b>: the RT's Status word carries a <b>Message Error</b> bit (set if the RT detected a bad command/data), plus Busy, Terminal Flag, and Service Request bits - a rich, protocol-level acknowledgement and health report.</li>
          <li><b>No-response timeout</b>: if no valid Status returns within the timeout, the BC declares an error and retries (often on the other bus).</li>
          <li><b>Dual-redundant bus</b>: two full buses (A and B) mean a physical fault or noisy channel is survived by retrying on the alternate. This is 1553's headline reliability feature.</li>
        </ul>
        <p>Note the layering: parity + Manchester coding catch bit errors, the Status word acknowledges at message level, and dual buses provide physical redundancy - defense in depth rather than a single CRC.</p>`
      },
      {
        h: 'Timing, Frames and Determinism',
        html: String.raw`<p>1553's determinism comes from fixed word timing plus a <b>scheduled frame structure</b> the BC runs:</p>
        <ul>
          <li><b>Word</b> = 20 bit-times = <b>20 us</b> at 1 Mbps (3 sync + 16 data + 1 parity).</li>
          <li><b>Message</b> = command word + up to 32 data words + status word, plus intermessage gaps (min ~4 us) and RT response time - a few tens to hundreds of microseconds.</li>
          <li><b>Minor frame</b> - the BC groups messages that must run at a given rate (e.g., every 20 ms) into a repeating minor frame; time-critical data (flight control) is scheduled every minor frame.</li>
          <li><b>Major frame</b> - a sequence of minor frames covering all message rates; slower data (built-in test, config) appears once per major frame.</li>
        </ul>
        <p>Because the BC pre-plans exactly which messages run in each frame, worst-case latency for any parameter is known at design time - the property commercial best-effort buses cannot guarantee. The 1 Mbps rate is modest by modern standards, but its <b>bounded, jitter-free timing</b> is what avionics certification requires. Practical bus loading is kept well below 100% (often <70-80%) so retries and future growth fit within each frame.</p>`
      },
      {
        h: 'Use Cases, Pros/Cons and a Comparison Table',
        html: String.raw`<p><b>Where 1553 rules:</b> military aircraft avionics (F-16, F/A-18, and countless platforms), missiles, satellites and launch vehicles, and armored vehicles - anywhere deterministic, fault-tolerant, EMI-hardened data exchange between subsystems is mandatory and longevity matters.</p>
        <p><b>Pros:</b> deterministic bounded latency; dual-redundant fault tolerance; robust transformer-coupled EMI-hardened physical layer; self-clocking (no separate clock); mature, certified, decades-proven; simple centralized (collision-free) command/response. <b>Cons:</b> low data rate (1 Mbps) versus modern buses; single Bus Controller is a scheduling bottleneck (needs a backup BC); heavy/bulky wiring and transformers; limited to 31 RTs and 32 words/message; costly certified hardware.</p>
        <table class="data">
          <tr><th>Attribute</th><th>MIL-STD-1553B</th><th>SPI</th><th>AXI4</th></tr>
          <tr><td>Domain</td><td>Platform (aircraft)</td><td>On-board (PCB)</td><td>On-chip (SoC)</td></tr>
          <tr><td>Data rate</td><td>1 Mbps (fixed)</td><td>10s of Mbps</td><td>GB/s</td></tr>
          <tr><td>Initiator</td><td>Bus Controller (sole)</td><td>Master</td><td>Manager</td></tr>
          <tr><td>Responders</td><td>Up to 31 RTs + broadcast</td><td>Slaves (SS-limited)</td><td>Subordinates</td></tr>
          <tr><td>Clocking</td><td>Self-clocked Manchester II</td><td>Source-sync SCLK</td><td>Shared synchronous clock</td></tr>
          <tr><td>Encoding</td><td>Manchester biphase</td><td>NRZ (implicit)</td><td>Parallel (implicit)</td></tr>
          <tr><td>Duplex</td><td>Half (BC-scheduled)</td><td>Full</td><td>Full (sep. R/W)</td></tr>
          <tr><td>Word/frame</td><td>20-bit-time word, 32 data words/msg</td><td>Arbitrary</td><td>Beats/bursts (256 max)</td></tr>
          <tr><td>Error check</td><td>Parity + Manchester + Status word</td><td>None</td><td>2-bit RRESP/BRESP</td></tr>
          <tr><td>Redundancy</td><td>Dual-redundant (Bus A/B)</td><td>None</td><td>None (base)</td></tr>
          <tr><td>Determinism</td><td>Bounded / scheduled</td><td>Master-timed</td><td>Handshake-gated</td></tr>
        </table>`
      }
    ],
    keyPoints: [
      String.raw`MIL-STD-1553B (1978) is a deterministic, command/response, time-division-multiplexed avionics serial bus at 1 Mbps.`,
      String.raw`Physical layer: shielded twisted-pair, transformer-coupled, terminated (~78 ohm), differential, and dual-redundant (Bus A and Bus B).`,
      String.raw`Self-clocking via Manchester II biphase encoding: every bit has a mid-bit transition, so the clock is embedded and there is no DC content - no separate clock wire.`,
      String.raw`One Bus Controller initiates every transfer; up to 31 Remote Terminals respond only when commanded; Bus Monitors listen passively.`,
      String.raw`Three word types (Command, Data, Status), each = 20 bit-times = 3 sync + 16 information bits + 1 odd-parity bit, lasting exactly 20 us at 1 Mbps.`,
      String.raw`The 5-bit RT address gives addresses 0-31; address 31 is reserved for broadcast, so up to 31 uniquely addressable RTs.`,
      String.raw`The 5-bit word-count field allows up to 32 data words per message (count 0 = 32).`,
      String.raw`The RT's Status word is the mandatory acknowledgement, carrying Message Error, Busy, Service Request and other health/error bits.`,
      String.raw`Error checking = odd parity per word + Manchester coding validity + Status-word error bits + no-response timeout; retries can switch to the redundant bus.`,
      String.raw`RT response time is 4-12 us; a no-response timeout (~14 us) lets the BC detect a dead terminal - the basis of bounded latency.`,
      String.raw`The bus is half-duplex; the BC's scheduled minor/major frame structure makes worst-case latency deterministic.`,
      String.raw`Chosen for avionics/military for determinism, redundancy, and EMI-hardened ruggedness despite its modest 1 Mbps rate.`,
      String.raw`Ten information-transfer formats: BC-to-RT, RT-to-BC, RT-to-RT, mode command without data, mode command with data (transmit), mode command with data (receive), plus four broadcast variants; on any broadcast the RTs suppress their Status word to avoid collisions.`,
      String.raw`Mode codes 0-15 carry no data word; codes 16-21 carry a single data word (e.g. Transmit Vector Word, Synchronize-with-data, Transmit Last Command, Transmit BIT Word, Selected Transmitter Shutdown/Override).`,
      String.raw`Command/Status sync and Data sync are opposite-polarity invalid-Manchester patterns (Command/Status: positive-then-negative half; Data: negative-then-positive), so the receiver tells word type from the sync alone.`,
      String.raw`Full Status-word bit set: Message Error, Instrumentation (always 0), Service Request, three Reserved, Broadcast Command Received, Busy, Subsystem Flag, Dynamic Bus Control Acceptance, and Terminal Flag.`
    ],
    equations: [
      {
        title: 'Word duration on the 1553 bus',
        tex: String.raw`$$ T_{word} = 20\ \text{bit-times} = \frac{20\ \text{bits}}{1\ \text{Mbps}} = 20\ \mu s $$`,
        derivation: String.raw`<p><b>Where we start.</b> Every 1553 word - command, data, or status - has an identical fixed structure: a 3-bit-time sync field, 16 information bits, and 1 parity bit.</p>
        <p><b>Step 1 - count the bit-times in a word.</b> Add the fields.</p>
        $$ N = 3\ (\text{sync}) + 16\ (\text{data}) + 1\ (\text{parity}) = 20\ \text{bit-times} $$
        <p><b>Step 2 - find one bit-time.</b> At the fixed data rate of 1 Mbps, one bit occupies the reciprocal of the rate.</p>
        $$ T_{bit} = \frac{1}{1\times10^{6}\ \text{bit/s}} = 1\ \mu s $$
        <p><b>Step 3 - multiply.</b> Twenty bit-times each of 1 us.</p>
        $$ T_{word} = N\times T_{bit} = 20\times 1\ \mu s = 20\ \mu s $$
        <p><b>Result.</b> $$ T_{word} = 20\ \mu s $$ Sanity check: the sync alone is $3\ \mu s$, data $16\ \mu s$, parity $1\ \mu s$, summing to $20\ \mu s$ - the atomic timing unit from which all 1553 message timing is built.</p>`
      },
      {
        title: 'Message transfer time (BC-to-RT)',
        tex: String.raw`$$ T_{msg} = (1 + N_{data} + 1)\,T_{word} + T_{resp} + T_{gap} $$`,
        derivation: String.raw`<p><b>Where we start.</b> A BC-to-RT message is: one Command word, then $N_{data}$ Data words (up to 32), then the RT's Status word - separated by the RT's response time and intermessage gaps.</p>
        <p><b>Step 1 - count the words.</b> One command + $N_{data}$ data + one status.</p>
        $$ N_{words} = 1 + N_{data} + 1 $$
        <p><b>Step 2 - convert words to time.</b> Each word is $T_{word}=20\ \mu s$.</p>
        $$ T_{words} = (2 + N_{data})\times 20\ \mu s $$
        <p><b>Step 3 - add protocol gaps.</b> The RT waits its response time $T_{resp}$ (4-12 us) before its Status word, and an intermessage gap $T_{gap}$ (min ~4 us) follows.</p>
        $$ T_{msg} = (2 + N_{data})\,T_{word} + T_{resp} + T_{gap} $$
        <p><b>Result.</b> For a full 32-data-word message with $T_{resp}\approx 8\ \mu s$ and $T_{gap}\approx 4\ \mu s$: $T_{msg} = (2+32)\times20 + 8 + 4 = 680 + 12 = 692\ \mu s$. Sanity check: a maximum message takes well under a millisecond, so many can fit in a 20 ms minor frame - the basis of scheduling.</p>`
      },
      {
        title: 'Effective payload throughput of a maximum message',
        tex: String.raw`$$ R_{eff} = \frac{16\,N_{data}}{T_{msg}} $$`,
        derivation: String.raw`<p><b>Where we start.</b> Only the 16-bit contents of the $N_{data}$ Data words are user payload; sync, parity, the command/status words, response time, and gaps are protocol overhead.</p>
        <p><b>Step 1 - payload bits.</b> Each data word carries 16 payload bits.</p>
        $$ B_{payload} = 16\times N_{data} $$
        <p><b>Step 2 - divide by total message time.</b> Effective rate is payload bits over the whole message duration $T_{msg}$ from the previous derivation.</p>
        $$ R_{eff} = \frac{16\,N_{data}}{T_{msg}} $$
        <p><b>Step 3 - evaluate a maximum message.</b> With $N_{data}=32$ and $T_{msg}=692\ \mu s$: $B_{payload}=512$ bits, so $R_{eff} = 512 / (692\times10^{-6}) \approx 740\ \text{kbit/s}$.</p>
        <p><b>Result.</b> $$ R_{eff} \approx 0.74\ \text{Mbit/s} $$ Sanity check: the raw bus is 1 Mbps, so a big message achieves about 74% payload efficiency; short messages (fewer data words but the same command/status/gap overhead) are far less efficient - which is why 1553 traffic is packed into longer messages where possible.</p>`
      }
    ],
    flashcards: [
      { front: String.raw`What kind of bus is MIL-STD-1553B?`, back: String.raw`A deterministic, command/response, time-division-multiplexed, dual-redundant serial avionics data bus at 1 Mbps.` },
      { front: String.raw`What are the three terminal roles in 1553?`, back: String.raw`Bus Controller (BC, sole initiator), Remote Terminal (RT, responds only when commanded, up to 31), and Bus Monitor (BM, passive listener).` },
      { front: String.raw`How is the 1553 bus clocked?`, back: String.raw`It is self-clocked via Manchester II biphase encoding - each bit has a mid-bit transition, so the clock is embedded in the data; there is no separate clock wire and no DC content.` },
      { front: String.raw`What is the structure and duration of a 1553 word?`, back: String.raw`3 bit-times of sync + 16 information bits + 1 odd-parity bit = 20 bit-times = 20 us at 1 Mbps.` },
      { front: String.raw`What are the three 1553 word types?`, back: String.raw`Command (from BC), Data (from BC or RT), and Status (from RT). Command and Status share one sync pattern; Data uses the opposite.` },
      { front: String.raw`How many Remote Terminals can 1553 address?`, back: String.raw`The 5-bit RT address allows 0-31; address 31 is reserved for broadcast, giving up to 31 uniquely addressable RTs.` },
      { front: String.raw`How many data words fit in one 1553 message?`, back: String.raw`Up to 32. The 5-bit word-count field encodes 1-32 (a count of 0 means 32).` },
      { front: String.raw`What is the Status word's role?`, back: String.raw`It is the RT's mandatory acknowledgement, echoing its address and reporting health/errors via bits like Message Error, Busy, and Service Request.` },
      { front: String.raw`Name 1553's error-checking mechanisms.`, back: String.raw`Odd parity on every word, Manchester coding validity checks, Status-word error bits, and a no-response timeout - plus dual-bus retry for physical faults.` },
      { front: String.raw`What makes 1553 fault-tolerant at the physical layer?`, back: String.raw`It is dual-redundant (Bus A and Bus B) and transformer-coupled, so a failed message or faulty stub is survived by retrying on the alternate bus.` },
      { front: String.raw`Why transformer coupling in 1553?`, back: String.raw`Transformers give galvanic isolation, common-mode noise rejection, no DC content, and let a shorted stub fail without killing the main bus.` },
      { front: String.raw`Is 1553 full- or half-duplex?`, back: String.raw`Half-duplex - one direction at a time on the shared pair, arbitrated entirely by the BC's schedule, so there is never contention.` },
      { front: String.raw`What is the RT response time and no-response timeout?`, back: String.raw`An RT must begin its Status response within about 4-12 us of the command; if no valid Status returns within ~14 us, the BC declares a no-response error and may retry.` },
      { front: String.raw`What makes 1553 deterministic?`, back: String.raw`Fixed 20-us word timing plus the BC's pre-planned minor/major frame schedule give a known worst-case latency for every parameter.` },
      { front: String.raw`Why is 1553 still used despite only 1 Mbps?`, back: String.raw`Its bounded, jitter-free determinism, dual-redundant fault tolerance, and EMI-hardened ruggedness are what avionics certification requires - speed is secondary.` },
      { front: String.raw`Name the 1553 information-transfer message formats.`, back: String.raw`Ten total: BC-to-RT (receive), RT-to-BC (transmit), RT-to-RT, mode command without data, mode command with data (transmit), mode command with data (receive), and the four broadcast variants (broadcast BC-to-RT, broadcast RT-to-RT, broadcast mode without data, broadcast mode with data-receive).` },
      { front: String.raw`Which 1553 mode codes carry a data word?`, back: String.raw`Mode codes 16-21 carry one data word (Transmit Vector Word, Synchronize-with-data, Transmit Last Command, Transmit BIT Word, Selected Transmitter Shutdown, Override Selected Transmitter Shutdown). Codes 0-15 carry no data word.` },
      { front: String.raw`How does the receiver distinguish a Data word from a Command/Status word?`, back: String.raw`By the sync polarity: the Command/Status sync is a positive-half-then-negative-half invalid-Manchester pattern, and the Data sync is the exact opposite (negative-then-positive). The two are inverses, so sync alone identifies the word type.` },
      { front: String.raw`Why do RTs not send a Status word on a broadcast?`, back: String.raw`Because every addressed RT (address 31) would otherwise reply at once and collide. Instead each RT sets its Broadcast Command Received bit, reported in its Status word at the next non-broadcast request.` },
      { front: String.raw`List the fields of the 1553 Status word.`, back: String.raw`RT Address (5), then Message Error, Instrumentation (always 0), Service Request, three Reserved, Broadcast Command Received, Busy, Subsystem Flag, Dynamic Bus Control Acceptance, Terminal Flag - plus the parity bit.` }
    ],
    mcqs: [
      { q: String.raw`The raw data rate of MIL-STD-1553B is:`, options: ['100 kbps', '1 Mbps', '10 Mbps', '1 Gbps'], answer: 1, explain: String.raw`1553B runs at a fixed 1 Mbps using Manchester II encoding.` },
      { q: String.raw`How long is a single 1553 word?`, options: ['16 bit-times', '17 us', '20 us', '32 us'], answer: 2, explain: String.raw`3 sync + 16 data + 1 parity = 20 bit-times = 20 us at 1 Mbps.` },
      { q: String.raw`Who initiates every transaction on a 1553 bus?`, options: ['Any Remote Terminal', 'The Bus Controller', 'The Bus Monitor', 'Whichever terminal wins arbitration'], answer: 1, explain: String.raw`1553 is strictly command/response; the single Bus Controller schedules and initiates all transfers - RTs only respond.` },
      { q: String.raw`The maximum number of uniquely addressable Remote Terminals is:`, options: ['16', '31', '32', '64'], answer: 1, explain: String.raw`The 5-bit address spans 0-31, but 31 is reserved for broadcast, leaving 31 uniquely addressable RTs (0-30 plus one more, i.e., 31 addresses usable for RTs with 31 as broadcast).` },
      { q: String.raw`The maximum number of data words in one 1553 message is:`, options: ['16', '31', '32', '64'], answer: 2, explain: String.raw`The 5-bit word-count field encodes up to 32 (count 0 = 32 data words).` },
      { q: String.raw`1553 encoding is:`, options: ['NRZ with a separate clock line', 'Manchester II (self-clocking biphase)', 'PAM-4', 'Differential SPI'], answer: 1, explain: String.raw`Manchester II embeds the clock via a mandatory mid-bit transition, so no separate clock wire is needed and there is no DC content.` },
      { q: String.raw`Which word does a Remote Terminal always return to acknowledge a command?`, options: ['Command word', 'Data word', 'Status word', 'Sync word'], answer: 2, explain: String.raw`The RT's Status word is the mandatory response, echoing its address and reporting error/health bits.` },
      { q: String.raw`1553 error checking within a word relies on:`, options: ['A 16-bit CRC', 'A single odd-parity bit plus Manchester validity', 'Reed-Solomon coding', 'No error checking'], answer: 1, explain: String.raw`Each word has one odd-parity bit, and the receiver checks Manchester coding validity; message-level acknowledgement is via the Status word.` },
      { q: String.raw`The dual-redundant nature of 1553 means:`, options: ['Two Bus Controllers always run in parallel', 'There are two independent buses (A and B) for fault tolerance', 'Every word is sent twice', 'Data is duplicated across 31 RTs'], answer: 1, explain: String.raw`Two independent buses let the BC retry a failed message on the alternate bus - the core redundancy feature.` },
      { q: String.raw`Why does 1553 use transformer coupling?`, options: ['To increase data rate', 'For galvanic isolation, common-mode rejection, and fault tolerance', 'To add a clock line', 'To provide CRC'], answer: 1, explain: String.raw`Transformers isolate DC, reject common-mode noise, and let a shorted stub fail without killing the bus.` },
      { q: String.raw`A commanded RT must begin its Status response within about:`, options: ['1 us', '4-12 us', '100 us', '1 ms'], answer: 1, explain: String.raw`The RT response time is 4-12 us; a ~14 us no-response timeout lets the BC detect a dead terminal.` },
      { q: String.raw`What primarily makes 1553 attractive for flight-critical avionics?`, options: ['Its GB/s throughput', 'Bounded, deterministic latency with dual-redundant fault tolerance', 'Its lack of any error checking', 'Its long cable reach of 1200 m'], answer: 1, explain: String.raw`Determinism (scheduled fixed-timing frames) plus redundancy and EMI hardening are why it is certified for flight-critical use despite modest speed.` },
      { q: String.raw`The sync field at the start of each 1553 word is special because it:`, options: ['Carries the parity bit', 'Deliberately violates normal Manchester timing so it is unmistakable', 'Is the RT address', 'Contains the CRC'], answer: 1, explain: String.raw`The 3-bit-time sync intentionally breaks the mid-bit-transition rule so a receiver cannot confuse it with data - marking the word boundary.` },
      { q: String.raw`A BC-to-RT message with 32 data words takes roughly (with typical gaps):`, options: ['~20 us', '~200 us', '~700 us', '~7 ms'], answer: 2, explain: String.raw`$(2+32)\times20\ \mu s + \sim12\ \mu s \approx 692\ \mu s$ - under a millisecond, so many fit in a 20 ms minor frame.` },
      { q: String.raw`How many information-transfer message formats does MIL-STD-1553B define?`, options: ['3', '6', '10', '32'], answer: 2, explain: String.raw`Ten: the six non-broadcast forms (BC-to-RT, RT-to-BC, RT-to-RT, mode without data, mode with data transmit, mode with data receive) plus four broadcast variants.` },
      { q: String.raw`In every broadcast message format, the addressed RTs:`, options: ['Each return a Status word in turn', 'Suppress their Status word to avoid collisions', 'Switch to Bus B', 'Return a data word instead of status'], answer: 1, explain: String.raw`Because all addressed RTs would reply simultaneously, they suppress the Status word on a broadcast and instead set the Broadcast Command Received bit for the next request.` },
      { q: String.raw`Which mode codes carry an associated data word?`, options: ['Codes 0-15', 'Codes 16-21', 'Only code 0', 'All 32 codes'], answer: 1, explain: String.raw`Mode codes 16-21 (e.g. Transmit Vector Word, Synchronize-with-data, Transmit Last Command, Transmit BIT Word) carry one data word; codes 0-15 carry none.` },
      { q: String.raw`In an RT-to-RT transfer, the Bus Controller sends:`, options: ['One command word only', 'A receive command to one RT and a transmit command to another', 'Two data words', 'A broadcast to address 31'], answer: 1, explain: String.raw`The BC issues a receive command to the destination RT and a transmit command to the source RT; the source sends Status + data and the destination sends Status.` },
      { q: String.raw`The Instrumentation bit in a 1553 Status word is:`, options: ['Set to signal an error', 'Always logic 0, distinguishing status from a command word', 'The parity bit', 'The broadcast flag'], answer: 1, explain: String.raw`The Instrumentation bit is always logic 0 in the Status word, which (with the shared Command/Status sync) helps distinguish a Status word from a Command word.` }
    ],
    numericals: [
      { q: String.raw`How long does it take to transmit a single 1553 data word, and what fraction of that time is actual payload?`, solution: String.raw`Word time $= 20\ \mu s$ (3 sync + 16 data + 1 parity at 1 us/bit). Payload = 16 data bits = $16\ \mu s$. Fraction $= 16/20 = 80\%$; the 3-us sync and 1-us parity are the 20% overhead of a single word.` },
      { q: String.raw`Compute the total time for a BC-to-RT message carrying 20 data words, taking response time 8 us and intermessage gap 4 us.`, solution: String.raw`Words $= 1$ command $+ 20$ data $+ 1$ status $= 22$ words. Word time $= 22\times20 = 440\ \mu s$. Add $T_{resp}=8$ and $T_{gap}=4$: $T_{msg} = 440 + 8 + 4 = 452\ \mu s$.` },
      { q: String.raw`What is the effective payload throughput of that 20-data-word message?`, solution: String.raw`Payload bits $= 16\times20 = 320$ bits. $R_{eff} = 320 / (452\times10^{-6}) \approx 708$ kbit/s, i.e. about 71% of the 1 Mbps raw rate. Overhead comes from the command/status words, sync/parity, response time, and gap.` },
      { q: String.raw`If a 20 ms minor frame is loaded to at most 75% with maximum (692 us) messages, how many such messages fit per minor frame?`, solution: String.raw`Available time $= 0.75\times20\ \text{ms} = 15\ \text{ms} = 15000\ \mu s$. Messages $= \lfloor 15000/692 \rfloor = \lfloor 21.7 \rfloor = 21$ maximum messages per minor frame, leaving margin for retries and growth.` },
      { q: String.raw`A designer needs to poll 30 RTs, each returning 4 data words (RT-to-BC), every 50 ms. Estimate the bus load (use ~8 us response + 4 us gap per message).`, solution: String.raw`Each RT-to-BC message: 1 command + 1 status + 4 data $= 6$ words $= 120\ \mu s$, plus $8+4 = 12\ \mu s$ overhead $= 132\ \mu s$. Thirty RTs: $30\times132 = 3960\ \mu s \approx 3.96\ \text{ms}$ of traffic per 50 ms frame. Load $= 3.96/50 \approx 7.9\%$ - comfortably low, leaving ample scheduling margin.` },
      { q: String.raw`Why can 1553 guarantee a worst-case latency that a best-effort commercial bus cannot?`, solution: String.raw`Because every word has fixed 20-us timing, only the BC transmits commands (no contention), and the BC runs a pre-planned minor/major frame schedule. The time each message occupies is known exactly, so the maximum delay before any parameter is refreshed is bounded and computable at design time - determinism by construction, not by statistical best effort.` }
    ],
    realWorld: String.raw`<p>MIL-STD-1553B is the nervous system of military aircraft. On an F-16 or F/A-18, the mission computer acts as Bus Controller and polls Remote Terminals embedded in the inertial navigation unit, radar, stores-management (weapons), displays, and engine controllers - all on a dual-redundant transformer-coupled twisted pair threaded through the airframe. Flight-critical parameters (attitude, air data) are scheduled in every minor frame so their latency is bounded and certifiable; slower housekeeping (built-in test, configuration) rides once per major frame. The bus survives combat-grade EMI and single-point stub faults precisely because of Manchester self-clocking (no DC, robust sync), transformer isolation, and Bus A/B redundancy. The same standard extends to satellites, launch vehicles, and ground combat systems, and its ecosystem includes derivatives and higher-rate successors, yet legacy 1553 endures because avionics values determinism and proven reliability over raw speed - a 1 Mbps bus that has flown safely for over forty years. Its trade against SPI and AXI is stark: it sacrifices bandwidth for guaranteed timing and fault tolerance in an environment where a missed deadline can be catastrophic.</p>`,
    related: ['rs485', 'spi', 'axi', 'comm-basics']
  }
);
