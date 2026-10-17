import React, {useEffect, useRef, useState} from 'react';
import {Field, Sheet} from './ui';

const TEST_SECONDS = 10;

function PumpEditor({pump, isNew, used, onSave, onClose}) {
  const available = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => !used.includes(n) || n === pump.port);
  const [p, setP] = useState({...pump, port: isNew ? available[0] || 1 : pump.port});
  const set = (k) => (e) => setP({...p, [k]: e.target.value});

  return (
    <Sheet onClose={onClose}>
      <div className="stack" style={{gap: 16}}>
        <h2>{isNew ? 'New Pump' : 'Edit Pump'}</h2>
        <div className="stack" style={{gap: 8}}>
          <span className="label">Pump Number</span>
          <div className="row" style={{gap: 8, flexWrap: 'wrap'}}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button key={n} disabled={!available.includes(n)} onClick={() => setP({...p, port: n})}
                className={`icon-btn ${p.port === n ? 'on' : ''}`} style={{width: 44, height: 44, borderRadius: 12, fontWeight: 700}}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <Field label="Name (Nickname)" placeholder="e.g. Vodka, Lime juice…" value={p.name} onChange={set('name')}/>
        <Field label="Ingredient (English name)" placeholder="e.g. Vodka, Lime juice…" value={p.ingredientId} onChange={set('ingredientId')}/>
        <div>
          <div className="row" style={{justifyContent: 'space-between'}}>
            <span className="label">Flow Rate</span>
            <b style={{color: 'var(--accent)', fontSize: 13}}>{p.flowRateInMlPerSec} ml/s</b>
          </div>
          <input type="range" min={1} max={30} step={1} value={p.flowRateInMlPerSec}
            onChange={(e) => setP({...p, flowRateInMlPerSec: Number(e.target.value)})}/>
          <div className="row label" style={{justifyContent: 'space-between', color: 'var(--cream4)'}}><span>1 ml/s</span><span>30 ml/s</span></div>
        </div>
        <div className="row">
          <button className="btn ghost grow" onClick={onClose}>Cancel</button>
          <button className="btn" style={{flex: 2}} disabled={!p.ingredientId.trim()}
            onClick={() => onSave({...p, name: p.name.trim(), ingredientId: p.ingredientId.trim()})}>
            {isNew ? 'Create Pump' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

export default function MachineTab({m, onCollaborators, onCreateMachine}) {
  const {active, machines, pumps} = m;
  const [editor, setEditor] = useState(null); // {pump, isNew}
  const [testing, setTesting] = useState(null); // {port, left}
  const timer = useRef();
  useEffect(() => () => clearInterval(timer.current), []);

  const test = (port) => {
    m.triggerPump(port);
    setTesting({port, left: TEST_SECONDS});
    clearInterval(timer.current);
    timer.current = setInterval(() => setTesting((t) => {
      if (t.left > 1) return {...t, left: t.left - 1};
      clearInterval(timer.current);
      return null;
    }), 1000);
  };

  const rename = () => {
    const name = window.prompt('Rename Machine', active.name);
    if (name && name.trim() && name.trim() !== active.name) m.updateMachine({...active, name: name.trim()});
  };

  const online = active?.status === 'online';
  const collabs = active?.collaborators?.length || 0;
  const sorted = [...pumps].sort((a, b) => a.port - b.port);

  return (
    <div className="stack" style={{padding: '12px 20px', gap: 12}}>
      <div className="card">
        <div className="row" style={{padding: '14px 16px', gap: 12}}>
          <span className={`dot ${online ? 'on' : ''}`}/>
          <div className="grow">
            <div style={{fontWeight: 700}}>{active?.name || 'No machine'}</div>
            <div className="muted">{online ? 'Online' : 'Offline'}{collabs > 0 && ` · ${collabs} collaborator${collabs !== 1 ? 's' : ''}`}</div>
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 12, borderTop: '.5px solid var(--border)'}}>
          <button className="box" disabled={!active} onClick={rename}>✎ Rename</button>
          <button className="box" disabled={!active} onClick={onCollaborators}>{'👥 Collaborators'}</button>
          <button className="box" onClick={onCreateMachine}>＋ New Machine</button>
          <button className="box icon-btn danger" style={{width: 'auto', height: 'auto', borderRadius: 12}} disabled={!active}
            onClick={() => window.confirm(`Delete "${active.name}"?\nThis will remove the machine and all its configuration.`) && m.deleteMachine(active.id)}>
            🗑 Delete
          </button>
        </div>
        {machines.length > 1 && (
          <div className="stack" style={{gap: 6, padding: '8px 12px 12px', borderTop: '.5px solid var(--border)'}}>
            <span className="label">Switch Machine</span>
            {machines.filter((x) => x.id !== active?.id).map((x) => (
              <button key={x.id} className="box row" onClick={() => m.selectMachine(x)}>
                <span className={`dot ${x.status === 'online' ? 'on' : ''}`}/>
                <span className="grow" style={{textAlign: 'left', color: 'var(--cream2)'}}>{x.name}</span>
                <span className="label" style={{color: 'var(--accent)'}}>Switch →</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && <>
        <div className="row" style={{justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 17, fontWeight: 600}}>Pump Configuration</div>
            <div className="muted">{pumps.length}/8 configured</div>
          </div>
          {pumps.length < 8 && (
            <button className="chip" onClick={() => setEditor({pump: {port: 0, name: '', ingredientId: '', flowRateInMlPerSec: 8}, isNew: true})}>+ Add</button>
          )}
        </div>

        <div className="pump-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
            const p = pumps.find((x) => x.port === n);
            return p ? (
              <button key={n} className="pump-cell on" onClick={() => setEditor({pump: p, isNew: false})}>
                P{n}<small>{p.name.split(' ').slice(0, 2).join(' ')}</small><small>{p.flowRateInMlPerSec}ml/s</small>
              </button>
            ) : <div key={n} className="pump-cell">P{n}</div>;
          })}
        </div>

        {sorted.map((p) => {
          const isTesting = testing?.port === p.port;
          return (
            <div key={p.port} className="card" style={{padding: 13}}>
              <div className="row" style={{gap: 12}}>
                <div className="pump-cell on" style={{width: 40, height: 40, fontSize: 13, borderRadius: 12}}>P{p.port}</div>
                <div className="grow">
                  <div style={{fontWeight: 600}}>{p.name}</div>
                  <div className="muted">{p.flowRateInMlPerSec} ml/s</div>
                </div>
                <button className="icon-btn" title="Test pump" disabled={!!testing && !isTesting} onClick={() => !testing && test(p.port)}
                  style={isTesting ? {color: 'var(--green)', borderColor: 'var(--green)', fontWeight: 700} : undefined}>
                  {isTesting ? testing.left : '▶'}
                </button>
                <button className="icon-btn" title="Edit" onClick={() => setEditor({pump: p, isNew: false})}>✎</button>
                <button className="icon-btn danger" title="Delete"
                  onClick={() => window.confirm(`Delete Pump ${p.port}?`) && m.deletePump(p.port)}>×</button>
              </div>
              {isTesting && <div className="progress"><div style={{width: `${(1 - testing.left / TEST_SECONDS) * 100}%`}}/></div>}
            </div>
          );
        })}
      </>}

      {editor && (
        <PumpEditor
          pump={editor.pump}
          isNew={editor.isNew}
          used={pumps.map((p) => p.port)}
          onSave={(p) => { if (editor.isNew) m.createPump(p); else m.updatePump(editor.pump.port, p); setEditor(null); }}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  );
}
