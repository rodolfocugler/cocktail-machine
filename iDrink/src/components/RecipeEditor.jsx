import React, {useState} from 'react';
import {Field, Sheet} from './ui';

const ALCOHOLIC = ['Alcoholic', 'Non alcoholic', 'Optional alcohol'];
const MEASURES = ['ml', 'cl', 'oz', 'shot', 'part', 'leaves', 'garnish', 'top', 'chopped',
  'cup', 'fill to top', 'dash', 'drop', 'tsp', 'tblsp', 'slice', 'bottle', 'glass', 'cube'];
const CC_OPTIONS = ['Yes', 'No', 'Undefined'];

export function emptyCocktail() {
  return {
    id: `custom_${Date.now()}`, strDrink: '', strCategory: 'Cocktail', strAlcoholic: 'Alcoholic',
    strGlass: '', isFavorite: false, strIngredient: [],
  };
}

export default function RecipeEditor({cocktail, isNew, categories, onSave, onClose}) {
  const [f, setF] = useState({...cocktail, strCreativeCommonsConfirmed: cocktail.strCreativeCommonsConfirmed || 'No'});
  const [ings, setIngs] = useState(cocktail.strIngredient || []);
  const [n, setN] = useState({name: '', measure: '', unit: 'ml'});
  const set = (k) => (e) => setF({...f, [k]: e.target.value});
  const setIng = (order, k, v) => setIngs(ings.map((i) => (i.order === order ? {...i, [k]: v} : i)));

  const addIngredient = () => {
    if (!n.name.trim()) return;
    const order = Math.max(0, ...ings.map((i) => i.order)) + 1;
    setIngs([...ings, {strIngredient: n.name.trim(), strMeasure: `${n.measure.trim()} ${n.unit}`.trim(), order}]);
    setN({...n, name: '', measure: ''});
  };

  const save = () => {
    const blankToNull = (v) => (v && v.trim()) || null;
    onSave({
      ...f,
      strDrink: f.strDrink.trim(),
      strDrinkAlternate: blankToNull(f.strDrinkAlternate),
      strGlass: f.strGlass?.trim(),
      strIBA: blankToNull(f.strIBA),
      strTags: blankToNull(f.strTags),
      strInstructions: (f.strInstructions || '').trim(),
      strDrinkThumb: blankToNull(f.strDrinkThumb),
      strIngredient: ings,
      dateModified: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
  };

  return (
    <Sheet onClose={onClose}>
      <h2 style={{marginBottom: 12}}>{isNew ? 'New Recipe' : 'Edit Recipe'}</h2>
      <div className="stack">
        <Field label="Cocktail Name *" placeholder="e.g. Tropical Sunset" value={f.strDrink} onChange={set('strDrink')}/>
        <Field label="Alternate Name" placeholder="Optional" value={f.strDrinkAlternate || ''} onChange={set('strDrinkAlternate')}/>
        <div className="row">
          <label className="stack grow" style={{gap: 6}}>
            <span className="label">Category</span>
            <select value={f.strCategory || ''} onChange={set('strCategory')}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="stack grow" style={{gap: 6}}>
            <span className="label">Alcoholic</span>
            <select value={f.strAlcoholic || ''} onChange={set('strAlcoholic')}>
              {ALCOHOLIC.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <Field label="Glass" placeholder="e.g. Collins Glass" value={f.strGlass || ''} onChange={set('strGlass')}/>
        <div className="row">
          <div className="grow"><Field label="IBA Category" placeholder="e.g. Unforgettables" value={f.strIBA || ''} onChange={set('strIBA')}/></div>
          <div className="grow"><Field label="Tags" placeholder="IBA, Party" value={f.strTags || ''} onChange={set('strTags')}/></div>
        </div>
        <Field label="Instructions" placeholder="Preparation instructions…" rows={3} value={f.strInstructions || ''} onChange={set('strInstructions')}/>
        <Field label="Image URL" placeholder="https://…" value={f.strDrinkThumb || ''} onChange={set('strDrinkThumb')}/>

        <div className="stack" style={{gap: 6}}>
          <span className="label">Creative Commons</span>
          <div className="row" style={{gap: 8}}>
            {CC_OPTIONS.map((o) => (
              <button key={o} className={`pill grow ${f.strCreativeCommonsConfirmed === o ? 'on' : ''}`}
                style={{borderRadius: 10}} onClick={() => setF({...f, strCreativeCommonsConfirmed: o})}>{o}</button>
            ))}
          </div>
        </div>

        <span className="label">Ingredients</span>
        {ings.length === 0 && <div className="box muted" style={{textAlign: 'center', padding: 14}}>No ingredients yet.</div>}
        {ings.map((i) => (
          <div key={i.order} className="box row">
            <div className="grow stack" style={{gap: 4}}>
              <input value={i.strIngredient} onChange={(e) => setIng(i.order, 'strIngredient', e.target.value)}/>
              <input placeholder="Measure (e.g. 1.5 oz)" style={{fontSize: 13}} value={i.strMeasure || ''}
                onChange={(e) => setIng(i.order, 'strMeasure', e.target.value || null)}/>
            </div>
            <button className="x" title="Remove" onClick={() => setIngs(ings.filter((x) => x.order !== i.order))}>×</button>
          </div>
        ))}

        <div className="stack" style={{gap: 8, padding: 12, borderRadius: 14, background: 'var(--accent-lo)', border: '1.5px solid var(--accent-md)'}}>
          <span className="label">Add Ingredient</span>
          <input placeholder="Ingredient name *…" value={n.name} onChange={(e) => setN({...n, name: e.target.value})}/>
          <div className="row" style={{gap: 8}}>
            <input placeholder="e.g. 2" value={n.measure} onChange={(e) => setN({...n, measure: e.target.value})}/>
            <select value={n.unit} onChange={(e) => setN({...n, unit: e.target.value})}>
              {MEASURES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <button className="btn" style={{height: 44, borderRadius: 10}} onClick={addIngredient}>Add</button>
        </div>

        <div className="row" style={{borderTop: '.5px solid var(--border)', paddingTop: 12}}>
          <button className="btn ghost grow" onClick={onClose}>Cancel</button>
          <button className="btn" style={{flex: 2}} disabled={!f.strDrink.trim()} onClick={save}>
            {isNew ? 'Create Recipe' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
