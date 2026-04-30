import React from 'react';
import MeterGauge from './MeterGauge';

export default function CircuitDiagram(props) {
  const {
    r1, setR1, r2, setR2, r3, setR3, r4, setR4,
    l1, setL1, c1, setC1,
    v1, setV1, f1, setF1, v2, setV2, f2, setF2,
    s1, setS1, s2, setS2,
    a1, a2,
    led1Off, setLed1Off, led2Off, setLed2Off,
    switchEnabled,
    toggleSwitch
  } = props;

  const overlayStyle = { position: 'absolute', pointerEvents: 'auto' };
  const baseInput = {
    width: '56px',
    padding: '5px 6px',
    borderRadius: 8,
    border: '1px solid #ffffff',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    boxSizing: 'border-box',
    fontSize: 13,
    boxShadow: '0 4px 10px rgba(12,24,48,0.06)'
  };
  const baseSelect = {
    width: '150px',
    padding: '6px 10px',
    borderRadius: 9,
    backgroundColor: '#dff0dc',
    border: '1px solid #b6d7b0',
    color: '#0b3b16',
    fontWeight: 800,
    boxSizing: 'border-box',
    fontSize: 14,
    boxShadow: '0 5px 12px rgba(12,24,48,0.06)'
  };

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 10, overflow: 'hidden', backgroundColor: '#d6e6f8' }}>
      <img src="/reciprocity.jpg" alt="reciprocity diagram" style={{ width: '100%', height: 'auto', maxHeight: '520px', objectFit: 'contain', display: 'block' }} />

      {/* Va-a input */}
      <div style={{ ...overlayStyle, left: '9%', top: '38%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={v1} onChange={(e) => setV1(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* Va freq */}
      <div style={{ ...overlayStyle, left: '9%', top: '47%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={f1} onChange={(e) => setF1(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* S1 dropdown overlay */}
      <div style={{ ...overlayStyle, left: '20%', top: '28%', width: 150, transform: 'translate(-50%, -50%)' }}>
        <select value={s1} onChange={(e) => setS1(parseInt(e.target.value))} disabled={switchEnabled}
          style={baseSelect}>
          <option value={1}>Power</option>
          <option value={2}>Short</option>
        </select>
      </div>

      {/* R1 overlay */}
      <div style={{ ...overlayStyle, left: '40%', top: '12%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={r1} onChange={(e) => setR1(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* R2 overlay */}
      <div style={{ ...overlayStyle, left: '52%', top: '12%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={r2} onChange={(e) => setR2(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* R3 overlay */}
      <div style={{ ...overlayStyle, left: '72%', top: '12%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={r3} onChange={(e) => setR3(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* R4 overlay (right) */}
      <div style={{ ...overlayStyle, left: '80%', top: '24%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={r4} onChange={(e) => setR4(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* L1 overlay */}
      <div style={{ ...overlayStyle, left: '56%', top: '62%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={l1} onChange={(e) => setL1(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* C1 overlay */}
      <div style={{ ...overlayStyle, left: '62%', top: '20%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={c1} onChange={(e) => setC1(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* S2 dropdown */}
      <div style={{ ...overlayStyle, left: '72%', top: '28%', width: 150, transform: 'translate(-50%, -50%)' }}>
        <select value={s2} onChange={(e) => setS2(parseInt(e.target.value))} disabled={switchEnabled}
          style={baseSelect}>
          <option value={1}>Power</option>
          <option value={2}>Short</option>
        </select>
      </div>

      {/* Vc-c and freq overlay */}
      <div style={{ ...overlayStyle, left: '88%', top: '36%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={v2} onChange={(e) => setV2(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>
      <div style={{ ...overlayStyle, left: '88%', top: '46%', width: 56, transform: 'translate(-50%, -50%)' }}>
        <input type="number" value={f2} onChange={(e) => setF2(parseFloat(e.target.value) || 0)} disabled={switchEnabled}
          style={baseInput} />
      </div>

      {/* Ammeter A2 (left) gauge overlay */}
      <div style={{ ...overlayStyle, left: '38%', top: '40%', width: 80 }}>
        <MeterGauge value={a2} id="gauge-a2" />
      </div>

      {/* Ammeter A1 (right) gauge overlay */}
      <div style={{ ...overlayStyle, left: '64%', top: '40%', width: 80 }}>
        <MeterGauge value={a1} id="gauge-a1" />
      </div>

      {/* Fuse indicators (click to repair) */}
      <div style={{ ...overlayStyle, left: '30%', top: '12%', width: 28, height: 28 }}>
        <div onClick={() => led1Off && setLed1Off(false)} title={led1Off ? 'Click to repair fuse' : 'Fuse OK'}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: led1Off ? '#bbb' : '#7ee08a', border: '2px solid #43b048', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: led1Off ? 'pointer' : 'default' }}>
          ✓
        </div>
      </div>

      <div style={{ ...overlayStyle, left: '70%', top: '12%', width: 28, height: 28 }}>
        <div onClick={() => led2Off && setLed2Off(false)} title={led2Off ? 'Click to repair fuse' : 'Fuse OK'}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: led2Off ? '#bbb' : '#7ee08a', border: '2px solid #43b048', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: led2Off ? 'pointer' : 'default' }}>
          ✓
        </div>
      </div>
    </div>
  );
}
