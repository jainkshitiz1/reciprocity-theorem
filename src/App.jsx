import React, { useRef, useState } from 'react';
import MeterGauge from './components/MeterGauge';
import AlertDialog from './components/AlertDialog';
import CircuitDiagram from './components/CircuitDiagram';
import './App.css';

// Complex number operations
const add = (x, y) => [x[0] + y[0], x[1] + y[1]];
const mult = (x, y) => [
  x[0] * y[0] - x[1] * y[1],
  x[0] * y[1] + x[1] * y[0],
];
const div = (x, y) => {
  const t = [y[0] / (y[0] * y[0] + y[1] * y[1]), (-y[1]) / (y[0] * y[0] + y[1] * y[1])];
  return mult(x, t);
};

export default function App() {
  // Circuit parameters
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(150);
  const [r3, setR3] = useState(200);
  const [r4, setR4] = useState(50);
  const [l1, setL1] = useState(423);
  const [c1, setC1] = useState(1.95);
  const [v1, setV1] = useState(220);
  const [f1, setF1] = useState(50);
  const [v2, setV2] = useState(220);
  const [f2, setF2] = useState(50);
  const [s1, setS1] = useState(1);
  const [s2, setS2] = useState(2);

  // Current measurements
  const [a1, setA1] = useState(0);
  const [a2, setA2] = useState(0);
  const [a11, setA11] = useState(0);
  const [a22, setA22] = useState(0);
  const [r11, setR11] = useState(0);
  const [r22, setR22] = useState(0);

  // UI states
  const [cf1, setCf1] = useState(0);
  const [cf2, setCf2] = useState(0);
  const [cf3, setCf3] = useState(0);
  const [count, setCount] = useState(0);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [led1Off, setLed1Off] = useState(false);
  const [led2Off, setLed2Off] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('case1');
  const [observations, setObservations] = useState([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const case1ResultRef = useRef(null);
  const case2ResultRef = useRef(null);

  const showAlertDialog = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const toggleSwitch = () => {
    if (switchEnabled) {
      setSwitchEnabled(false);
      setA1(0);
      setA2(0);
      setA11(0);
      setA22(0);
      setR11(0);
      setR22(0);
      setCf3(0);
    } else {
      setSwitchEnabled(true);
      setCf3(1);
    }
  };

  const executeCkt = () => {
    const w1 = 2 * Math.PI * f1;
    const w2 = 2 * Math.PI * f2;

    if (s1 === 1 && s2 === 2) {
      // Case 1
      const r1Complex = [r1, 0];
      const r2Complex = [r2, 0];
      const r3Complex = [r3, 0];
      const r4Complex = [r4, 0];
      const l1Complex = [0, w1 * (l1 / 1000)];
      const c1Complex = [0, -1 / (w1 * (c1 / 1e6))];
      const v1Complex = [v1, 0];

      const z1 = div(
        add(mult(add(r4Complex, l1Complex), add(r1Complex, r2Complex)), mult(r1Complex, r2Complex)),
        add(add(r1Complex, r4Complex), l1Complex)
      );

      const vn1 = div(
        mult(
          mult(add(r4Complex, l1Complex), r1Complex),
          div(mult(mult(z1, c1Complex), v1Complex), add(mult(z1, c1Complex), mult(r3Complex, add(z1, c1Complex))))
        ),
        add(mult(add(r4Complex, l1Complex), add(r1Complex, r2Complex)), mult(r1Complex, r2Complex))
      );

      const i1 = div(vn1, r1Complex);
      const magnitude = Math.sqrt(i1[0] * i1[0] + i1[1] * i1[1]);
      setA11(magnitude);
      setA1(magnitude);
      case1ResultRef.current = {
        voltage: v1,
        current: magnitude,
        ratio: v1 / magnitude,
      };

      if (magnitude > 5 || isNaN(magnitude)) {
        setLed1Off(true);
        showAlertDialog('Click on the fuse indicator to repair it and increase the resistance value.');
      }

      const ratio = v1 / magnitude;
      setR11(ratio);
      setCf1(1);
    } else if (s1 === 2 && s2 === 1) {
      // Case 2
      const r1Complex = [r1, 0];
      const r2Complex = [r2, 0];
      const r3Complex = [r3, 0];
      const r4Complex = [r4, 0];
      const l1Complex = [0, w2 * (l1 / 1000)];
      const c1Complex = [0, -1 / (w2 * (c1 / 1e6))];
      const v2Complex = [v2, 0];

      const z1 = div(
        add(mult(add(r4Complex, l1Complex), add(r1Complex, r2Complex)), mult(r1Complex, r2Complex)),
        add(add(r1Complex, r4Complex), l1Complex)
      );

      const vn1 = div(
        mult(
          mult(add(r4Complex, l1Complex), r1Complex),
          div(mult(mult(z1, c1Complex), v2Complex), add(mult(z1, c1Complex), mult(r3Complex, add(z1, c1Complex))))
        ),
        add(mult(add(r4Complex, l1Complex), add(r1Complex, r2Complex)), mult(r1Complex, r2Complex))
      );

      const i1 = div(vn1, r1Complex);
      const magnitude = Math.sqrt(i1[0] * i1[0] + i1[1] * i1[1]);
      setA22(magnitude);
      setA2(magnitude);
      case2ResultRef.current = {
        voltage: v2,
        current: magnitude,
        ratio: v2 / magnitude,
      };

      if (magnitude > 5 || isNaN(magnitude)) {
        setLed2Off(true);
        showAlertDialog('Click on the fuse indicator to repair it and increase the resistance value.');
      }

      const ratio = v2 / magnitude;
      setR22(ratio);
      setCf2(1);
    }
  };

  const perform1 = () => {
    if (s1 === 1 && s2 === 2 && switchEnabled) {
      executeCkt();
    } else {
      showAlertDialog('Please configure S1 to Power and S2 to Short, then switch ON the circuit.');
    }
  };

  const perform2 = () => {
    if (s1 === 2 && s2 === 1 && switchEnabled) {
      executeCkt();
    } else {
      showAlertDialog('Please configure S1 to Short and S2 to Power, then switch ON the circuit.');
    }
  };

  const perform3 = () => {
    const case1Result = case1ResultRef.current;
    const case2Result = case2ResultRef.current;

    if (case1Result && case2Result) {
      const newCount = count + 1;
      const newObservations = [...observations];
      const obsIndex = count;
      if (obsIndex < 5) {
        newObservations[obsIndex] = [
          case1Result.voltage,
          parseFloat(case1Result.current.toFixed(3)),
          parseFloat(case1Result.ratio.toFixed(2)),
          case2Result.voltage,
          parseFloat(case2Result.current.toFixed(3)),
          parseFloat(case2Result.ratio.toFixed(2))
        ];
      }

      setCount(newCount);
      setObservations(newObservations);
      case1ResultRef.current = null;
      case2ResultRef.current = null;
      setCf1(0);
      setCf2(0);
      setA1(0);
      setA2(0);
      setA11(0);
      setA22(0);
      setR11(0);
      setR22(0);
      setSwitchEnabled(false);
      setCf3(0);

      showAlertDialog('The observation table is updated. Change the resistance and voltage source values to take another observation.');
    } else {
      showAlertDialog('Please simulate all the 2 cases first.');
    }
  };

  return (
    <div style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2230%22 fill=%22none%22 stroke=%22%23ddd%22 stroke-width=%221%22/%3E%3Cpath d=%22M50 20 Q60 50 50 80%22 stroke=%22%23ddd%22 stroke-width=%221%22 fill=%22none%22/%3E%3C/svg%3E")',
      backgroundColor: '#e8e8e8',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Title */}
      <h1 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', marginBottom: '30px', color: '#333' }}>
        Verification of Reciprocity Theorem
      </h1>

      {/* Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* LEFT PANEL - Instructions */}
        <div style={{
          backgroundColor: '#c5d9f1',
          border: '3px solid #8fbc8f',
          borderRadius: '8px',
          padding: '20px',
          minHeight: '500px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333', textDecoration: 'underline' }}>
            Procedure:
          </h3>
          
          <p style={{ color: '#0066cc', fontWeight: 'bold', marginBottom: '10px', fontSize: '13px' }}>
            Allow JavaScript alerts in your browser.
          </p>
          
          <p style={{ color: '#0066cc', marginBottom: '15px', fontSize: '13px', lineHeight: '1.5' }}>
            Keep Inductance, Capacitance and all the resistances (R1, R2 & R3) close to their respective maximum values.
          </p>

          <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px', color: '#333', marginTop: '20px' }}>
            Experiment Part Select:
          </h4>

          <p style={{ color: '#333', marginBottom: '10px', fontSize: '13px', lineHeight: '1.5' }}>
            <strong>Case 1:</strong><br/>
            Apply the supply voltage through the terminal a-a and read the current from the ammeter. To do this first select <strong>case1 tab</strong>, then select the switches S1 to power and S2 to short and switch on the circuit main supply.
          </p>

          <p style={{ color: '#333', marginBottom: '15px', fontSize: '13px', lineHeight: '1.5' }}>
            <strong>Case-2:</strong> Apply the supply voltage through the terminal c-c and read the current from the ammeter A2. To do this select <strong>case-2 tab</strong>, then select the switches S1 to short and S2 to power and switch on the circuit main supply.
          </p>

          <p style={{ color: '#333', marginBottom: '15px', fontSize: '13px', lineHeight: '1.5' }}>
            Verify the ratio of voltage and current for both the cases are same or not. Click on <strong>Fill data to the table</strong> on case-2 tab to update the observation table for 5 different observations.
          </p>

          <div style={{ marginTop: '20px', borderTop: '2px solid #8fbc8f', paddingTop: '15px' }}>
            <p style={{ color: '#333', fontSize: '13px', marginBottom: '10px' }}>
              <strong>M.I.-Moving Iron type Ammeter.</strong>
            </p>
            <p style={{ color: '#333', fontSize: '13px', marginBottom: '10px' }}>
              <strong>DPDT- Double pole Double throw.</strong>
            </p>
            <p style={{ color: '#333', fontSize: '13px' }}>
              <strong>N.B. :- All the resistances are in ohms.</strong>
            </p>
          </div>

          {/* Main Switch - Fixed at bottom */}
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              onClick={toggleSwitch}
              style={{
                padding: '10px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: switchEnabled ? '#cc6655' : '#8AC007',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {switchEnabled ? 'Switch OFF' : 'Switch ON'}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - Circuit Diagram */}
        <div style={{
          backgroundColor: '#c5d9f1',
          border: '3px solid #8fbc8f',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Diagram-only view: controls are presented on the circuit image itself */}
          <div style={{ marginBottom: '8px' }} />

          {/* Circuit Diagram */}
          <div style={{ marginBottom: '15px', flex: 0 }}>
            <CircuitDiagram
              r1={r1} setR1={setR1}
              r2={r2} setR2={setR2}
              r3={r3} setR3={setR3}
              r4={r4} setR4={setR4}
              l1={l1} setL1={setL1}
              c1={c1} setC1={setC1}
              v1={v1} setV1={setV1}
              f1={f1} setF1={setF1}
              v2={v2} setV2={setV2}
              f2={f2} setF2={setF2}
              s1={s1} setS1={setS1}
              s2={s2} setS2={setS2}
              a1={a1} a2={a2}
              led1Off={led1Off} setLed1Off={setLed1Off}
              led2Off={led2Off} setLed2Off={setLed2Off}
              switchEnabled={switchEnabled}
              toggleSwitch={toggleSwitch}
            />
          </div>

          {/* Tabs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* S1/S2 selectors removed — image contains the switches and overlays handle them */}

            {/* Tab Buttons */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '0' }}>
              <button
                onClick={() => setActiveTab('case1')}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: activeTab === 'case1' ? '#0066cc' : '#e8e8e8',
                  color: activeTab === 'case1' ? 'white' : '#333',
                  border: '2px solid #8AC007',
                  borderBottomWidth: activeTab === 'case1' ? '0px' : '2px',
                  borderRadius: '5px 5px 0 0',
                  cursor: 'pointer'
                }}
              >
                case 1
              </button>
              <button
                onClick={() => setActiveTab('case2')}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: activeTab === 'case2' ? '#0066cc' : '#e8e8e8',
                  color: activeTab === 'case2' ? 'white' : '#333',
                  border: '2px solid #8AC007',
                  borderBottomWidth: activeTab === 'case2' ? '0px' : '2px',
                  borderRadius: '5px 5px 0 0',
                  cursor: 'pointer'
                }}
              >
                case 2
              </button>
            </div>

            {/* Tab Content */}
            <div style={{
              backgroundColor: '#0066cc',
              color: 'white',
              padding: '15px',
              borderRadius: '0 5px 5px 5px',
              border: '2px solid #8AC007',
              borderTopWidth: '0px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {activeTab === 'case1' && (
                <>
                  <p style={{ fontSize: '13px', marginBottom: '15px', lineHeight: '1.5' }}>
                    Apply the supply voltage through the terminal a-a and read the current from the ammeter <strong>A<sub>1</sub></strong>.<br/>
                    Select switches <strong>S<sub>1</sub></strong> to Power and <strong>S<sub>2</sub></strong> to Short and Simulate.
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    marginBottom: '15px',
                    flex: 1
                  }}>
                    <div style={{ backgroundColor: '#00539b', padding: '10px', borderRadius: '3px' }}>
                      <p style={{ fontSize: '12px', marginBottom: '5px' }}>A<sub>1</sub> ammeter reading (I<sub>b-b</sub>):</p>
                      <input type="text" value={a11.toFixed(3)} disabled style={{ width: '100%', padding: '5px', backgroundColor: '#ffcc00', color: '#333', fontWeight: 'bold', fontSize: '14px', border: 'none', borderRadius: '3px' }} />
                    </div>
                    <div style={{ backgroundColor: '#00539b', padding: '10px', borderRadius: '3px' }}>
                      <p style={{ fontSize: '12px', marginBottom: '5px' }}>Ratio(V<sub>a-a</sub>/I<sub>b-b</sub>):</p>
                      <input type="text" value={r11.toFixed(2)} disabled style={{ width: '100%', padding: '5px', backgroundColor: '#ffcc00', color: '#333', fontWeight: 'bold', fontSize: '14px', border: 'none', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <button
                    onClick={perform1}
                    style={{
                      padding: '10px 20px',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: '100%',
                      marginTop: 'auto'
                    }}
                  >
                    Simulate
                  </button>
                </>
              )}

              {activeTab === 'case2' && (
                <>
                  <p style={{ fontSize: '13px', marginBottom: '15px', lineHeight: '1.5' }}>
                    Apply the supply voltage through the terminal c-c and read the current from the ammeter <strong>A<sub>2</sub></strong>.<br/>
                    Select switches <strong>S<sub>1</sub></strong> to Short and <strong>S<sub>2</sub></strong> to Power and Simulate.
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    marginBottom: '15px',
                    flex: 1
                  }}>
                    <div style={{ backgroundColor: '#00539b', padding: '10px', borderRadius: '3px' }}>
                      <p style={{ fontSize: '12px', marginBottom: '5px' }}>A<sub>2</sub> ammeter reading (I<sub>c-c</sub>):</p>
                      <input type="text" value={a22.toFixed(3)} disabled style={{ width: '100%', padding: '5px', backgroundColor: '#ffcc00', color: '#333', fontWeight: 'bold', fontSize: '14px', border: 'none', borderRadius: '3px' }} />
                    </div>
                    <div style={{ backgroundColor: '#00539b', padding: '10px', borderRadius: '3px' }}>
                      <p style={{ fontSize: '12px', marginBottom: '5px' }}>Ratio(V<sub>c-c</sub>/I<sub>c-c</sub>):</p>
                      <input type="text" value={r22.toFixed(2)} disabled style={{ width: '100%', padding: '5px', backgroundColor: '#ffcc00', color: '#333', fontWeight: 'bold', fontSize: '14px', border: 'none', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button
                      onClick={perform2}
                      style={{
                        padding: '10px 20px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Simulate
                    </button>
                    <button
                      onClick={perform3}
                      style={{
                        padding: '10px 20px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Fill data to the table
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Observation Table - Full Width */}
      <div style={{
        maxWidth: '1400px',
        margin: '30px auto 0',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #999'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
          Observation Table for Verification of Reciprocity theorem experiment:
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #999' }}>
          <thead>
            <tr style={{ backgroundColor: '#0066cc', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #999', fontWeight: 'bold' }}>Obs.</th>
              <th style={{ padding: '10px', border: '1px solid #999', fontWeight: 'bold' }}>V<sub>a-a</sub> (V)</th>
              <th style={{ padding: '10px', border: '1px solid #999', fontWeight: 'bold' }}>A<sub>11</sub> (A)</th>
              <th style={{ padding: '10px', border: '1px solid #999', fontWeight: 'bold' }}>Ratio (V<sub>a-a</sub>/I<sub>b-b</sub>)</th>
              <th style={{ padding: '10px', border: '1px solid #999', fontWeight: 'bold' }}>V<sub>c-c</sub> (V)</th>
              <th style={{ padding: '10px', border: '1px solid #999', fontWeight: 'bold' }}>A<sub>22</sub> (A)</th>
              <th style={{ padding: '10px', border: '1px solid #999', fontWeight: 'bold' }}>Ratio (V<sub>c-c</sub>/I<sub>d-d</sub>)</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f5f5f5' : '#ffffff' }}>
                <td style={{ padding: '10px', border: '1px solid #999', fontWeight: 'bold', textAlign: 'center' }}>{idx + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #999', textAlign: 'center' }}>{obs[0]}</td>
                <td style={{ padding: '10px', border: '1px solid #999', textAlign: 'center' }}>{obs[1]}</td>
                <td style={{ padding: '10px', border: '1px solid #999', textAlign: 'center' }}>{obs[2]}</td>
                <td style={{ padding: '10px', border: '1px solid #999', textAlign: 'center' }}>{obs[3]}</td>
                <td style={{ padding: '10px', border: '1px solid #999', textAlign: 'center' }}>{obs[4]}</td>
                <td style={{ padding: '10px', border: '1px solid #999', textAlign: 'center' }}>{obs[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alert Dialog */}
      {showAlert && <AlertDialog message={alertMessage} onClose={closeAlert} />}
    </div>
  );
}
