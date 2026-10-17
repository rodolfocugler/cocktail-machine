import React, {useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import api, {errorMessage, logout, session} from '../services/api';
import CocktailList from '../components/CocktailList';
import HistoryTab from '../components/HistoryTab';
import MachineTab from '../components/MachineTab';
import RecipeEditor, {emptyCocktail} from '../components/RecipeEditor';
import {Sheet} from '../components/ui';

const TABS = [['favorites', '★', 'Favorites'], ['cocktails', '◈', 'Cocktails'], ['history', '⏱', 'History'], ['machine', '⚙', 'Machine']];

// Runs a request, toasts the error, and resolves to undefined on failure
const call = (p) => p.then((r) => r.data).catch((e) => { toast.error(errorMessage(e)); });

function useMachines() {
  const [machines, setMachines] = useState([]);
  const [active, setActive] = useState(null);
  const [pumps, setPumps] = useState([]);

  const select = useCallback((machine) => {
    setActive(machine);
    setPumps([]);
    if (!machine) return;
    session.setMachineId(machine.id);
    call(api.get(`api/machines/${machine.id}/pumps`)).then((p) => p && setPumps(p));
  }, []);

  useEffect(() => {
    call(api.get('api/machines')).then((data) => {
      if (!data) return;
      setMachines(data.content);
      const saved = session.getMachineId();
      select(data.content.find((x) => x.id === saved) || data.content[0] || null);
    });
  }, [select]);

  const replace = (updated) => {
    setMachines((ms) => ms.map((x) => (x.id === updated.id ? updated : x)));
    setActive((a) => (a?.id === updated.id ? updated : a));
  };
  const pumpsUrl = (suffix = '') => `api/machines/${active.id}/pumps${suffix}`;

  return {
    machines, active, pumps,
    selectMachine: select,
    createMachine: async (name) => {
      const created = await call(api.post('api/machines', {id: '', name, status: 'offline', collaborators: []}));
      if (created) { setMachines((ms) => [...ms, created]); toast(`"${created.name}" created`); }
    },
    updateMachine: async (machine) => {
      const updated = await call(api.put(`api/machines/${machine.id}`, machine));
      if (updated) { replace(updated); toast(`"${updated.name}" updated`); }
    },
    deleteMachine: async (id) => {
      if ((await call(api.delete(`api/machines/${id}`))) === undefined) return;
      const remaining = machines.filter((x) => x.id !== id);
      setMachines(remaining);
      if (active?.id === id) select(remaining[0] || null);
      toast('Machine deleted');
    },
    addCollaborator: async (email) => {
      const updated = await call(api.put(`api/machines/${active.id}/email/${encodeURIComponent(email)}`));
      if (updated) { replace(updated); toast(`${email} added`); }
    },
    removeCollaborator: async (email) => {
      const updated = await call(api.delete(`api/machines/${active.id}/email/${encodeURIComponent(email)}`));
      if (updated) { replace(updated); toast(`${email} removed`); }
    },
    createPump: async (pump) => {
      const created = await call(api.post(pumpsUrl(), pump));
      if (created) { setPumps((ps) => [...ps, created]); toast(`Pump ${created.port} created`); }
    },
    updatePump: async (port, pump) => {
      const updated = await call(api.put(pumpsUrl(`/${port}`), pump));
      if (updated) setPumps((ps) => ps.map((x) => (x.port === port ? updated : x)));
    },
    deletePump: async (port) => {
      if ((await call(api.delete(pumpsUrl(`/${port}`)))) === undefined) return;
      setPumps((ps) => ps.filter((x) => x.port !== port));
      toast(`Pump ${port} removed`);
    },
    triggerPump: (port) => call(api.post(pumpsUrl(`/${port}/trigger`), {durationSeconds: 10})),
  };
}

function Collaborators({machine, onAdd, onRemove, onClose}) {
  const [email, setEmail] = useState('');
  const add = () => { if (email.trim()) { onAdd(email.trim()); setEmail(''); } };
  const collabs = machine?.collaborators || [];
  return (
    <Sheet onClose={onClose}>
      <div className="stack" style={{gap: 16}}>
        <div>
          <h2>Collaborators</h2>
          <div className="muted">{machine?.name || 'Machine'} · anyone added can brew cocktails</div>
        </div>
        {collabs.length === 0 && <i className="muted">No collaborators yet.</i>}
        {collabs.map((c) => (
          <div key={c} className="box row" style={{padding: '10px 14px'}}>
            <span aria-hidden>{'👤'}</span><span className="grow ellipsis">{c}</span>
            <button className="x" title={`Remove ${c}`} onClick={() => onRemove(c)}>×</button>
          </div>
        ))}
        <span className="label" style={{borderTop: '1px solid var(--border)', paddingTop: 16}}>Add Collaborator</span>
        <div className="row">
          <input type="email" placeholder="Email…" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}/>
          <button className="btn" style={{height: 44, borderRadius: 12}} disabled={!email.trim()} onClick={add}>Add</button>
        </div>
      </div>
    </Sheet>
  );
}

export default function Main() {
  const [tab, setTab] = useState('favorites');
  const [categories, setCategories] = useState(['All']);
  const [editor, setEditor] = useState(null); // {cocktail, isNew}
  const [picker, setPicker] = useState(false);
  const [showCollabs, setShowCollabs] = useState(false);
  const [version, setVersion] = useState(0); // bump to reload lists after a write
  const m = useMachines();

  useEffect(() => {
    api.get('api/categories').then(({data}) => setCategories(['All', ...data.map((c) => c.strCategory)])).catch(() => {});
  }, []);

  const createMachine = () => {
    const name = window.prompt('New Machine', '');
    if (name && name.trim()) m.createMachine(name.trim());
  };

  const brew = async (cocktail, ings) => {
    if (!m.active) { toast.error('Select a machine first'); return; }
    const ok = await call(api.post(`api/machines/${m.active.id}/brew`, {idDrink: cocktail.id, strIngredient: ings}));
    if (ok !== undefined) toast(`🥂 Brewing ${cocktail.strDrink}!`);
  };

  const saveRecipe = async ({isFavorite, ...entity}) => {
    const saved = await call(editor.isNew ? api.post('api/cocktails', entity) : api.put(`api/cocktails/${entity.id}`, entity));
    if (saved === undefined) return;
    toast(`${entity.strDrink} ${editor.isNew ? 'created' : 'updated'}!`);
    setEditor(null);
    setVersion((v) => v + 1);
  };

  const deleteRecipe = async (c) => {
    if (!window.confirm(`Delete "${c.strDrink}"?\nThis cannot be undone.`)) return;
    if ((await call(api.delete(`api/cocktails/${c.id}`))) === undefined) return;
    toast('Recipe deleted');
    setVersion((v) => v + 1);
  };

  const listProps = {categories, version, onBrew: brew, onEdit: (c) => setEditor({cocktail: c, isNew: false}), onDelete: deleteRecipe};
  const online = m.active?.status === 'online';

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="brand serif"><span aria-hidden>{'🍸'}</span>Drinkeiro</div>
        {TABS.map(([key, icon, label]) => (
          <button key={key} className={`nav-item ${tab === key ? 'on' : ''}`} aria-current={tab === key} onClick={() => setTab(key)}>
            <span className="ico">{icon}</span>{label}
          </button>
        ))}
        <div className="nav-spacer"/>
      </nav>

      <main className="content">
        <header className="page-head">
          <h1>{TABS.find(([key]) => key === tab)[2]}</h1>
          {tab === 'cocktails' && (
            <button className="btn" style={{height: 38, borderRadius: 10}} onClick={() => setEditor({cocktail: emptyCocktail(), isNew: true})}>+ New Recipe</button>
          )}
          <button className="box row" style={{gap: 8, fontWeight: 600}} title="Switch machine" onClick={() => setPicker(true)}>
            <span className={`dot ${online ? 'on' : ''}`}/>
            <span className="ellipsis" style={{maxWidth: 180}}>{m.active?.name || 'No machine'}</span>
            <small style={{color: 'var(--cream3)'}}>▾</small>
          </button>
          <button className="icon-btn" title="Logout" onClick={logout}>⎋</button>
        </header>

        {tab === 'favorites' && <CocktailList favorites {...listProps}/>}
        {tab === 'cocktails' && <CocktailList {...listProps}/>}
        {tab === 'history' && <HistoryTab machineId={m.active?.id} version={version}/>}
        {tab === 'machine' && <MachineTab m={m} onCollaborators={() => setShowCollabs(true)} onCreateMachine={createMachine}/>}
      </main>

      {picker && (
        <Sheet onClose={() => setPicker(false)}>
          <div className="stack" style={{gap: 12}}>
            <h2>My Machines</h2>
            {m.machines.map((x) => (
              <button key={x.id} className={`box row ${x.id === m.active?.id ? 'pill on' : ''}`} style={{padding: 14, borderRadius: 16, gap: 14}}
                onClick={() => { m.selectMachine(x); setPicker(false); }}>
                <span className={`dot ${x.status === 'online' ? 'on' : ''}`}/>
                <span className="grow" style={{textAlign: 'left'}}>
                  <div style={{fontWeight: 600, color: 'var(--cream)'}}>{x.name}</div>
                  <div className="muted">{x.status === 'online' ? 'Online' : 'Offline'} · {x.collaborators.length} users</div>
                </span>
                {x.id === m.active?.id && <span style={{color: 'var(--accent)', fontSize: 18}}>✓</span>}
              </button>
            ))}
            <button className="box" style={{padding: 14, borderRadius: 16, fontWeight: 600, color: 'var(--cream2)'}}
              onClick={() => { setPicker(false); createMachine(); }}>+ New Machine</button>
          </div>
        </Sheet>
      )}

      {showCollabs && (
        <Collaborators machine={m.active} onAdd={m.addCollaborator} onRemove={m.removeCollaborator} onClose={() => setShowCollabs(false)}/>
      )}

      {editor && (
        <RecipeEditor cocktail={editor.cocktail} isNew={editor.isNew} categories={categories.filter((c) => c !== 'All')}
          onSave={saveRecipe} onClose={() => setEditor(null)}/>
      )}
    </div>
  );
}
