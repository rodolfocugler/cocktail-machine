import React, {useState} from 'react';
import {Sheet, Thumb} from './ui';

export default function CocktailDetail({cocktail, onToggleFav, onBrew, onEdit, onDelete, onClose}) {
  const [ings, setIngs] = useState(cocktail.strIngredient || []);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMeasure, setNewMeasure] = useState('');
  const [confirm, setConfirm] = useState(false);
  const fav = cocktail.isFavorite;

  const addIngredient = () => {
    if (!newName.trim()) return;
    const order = Math.max(0, ...ings.map((i) => i.order)) + 1;
    setIngs([...ings, {strIngredient: newName.trim(), strMeasure: newMeasure.trim() || null, order}]);
    setNewName(''); setNewMeasure(''); setAdding(false);
  };

  if (confirm) {
    return (
      <Sheet onClose={() => setConfirm(false)}>
        <div className="stack" style={{gap: 18}}>
          <h2>Ready to brew?</h2>
          <div className="box row" style={{padding: 14, gap: 14, borderRadius: 16}}>
            <Thumb src={cocktail.strDrinkThumb} size={54}/>
            <div>
              <div style={{fontWeight: 600}}>{cocktail.strDrink}</div>
              <div className="muted">{cocktail.strGlass}</div>
            </div>
          </div>
          <span className="label">Ingredients to dispense</span>
          {ings.map((i) => (
            <div key={i.order} className="box row" style={{justifyContent: 'space-between'}}>
              <span style={{color: 'var(--cream2)'}}>{i.strIngredient}</span>
              <span className="muted">{i.strMeasure || 'to fill'}</span>
            </div>
          ))}
          <div className="row">
            <button className="btn ghost grow" onClick={() => setConfirm(false)}>Cancel</button>
            <button className="btn" style={{flex: 2}} onClick={() => onBrew(cocktail, ings)}>{'🍸 Brew Now'}</button>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose}>
      <div className="hero">
        {cocktail.strDrinkThumb
          ? <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink}/>
          : <div style={{fontSize: 52, display: 'grid', placeItems: 'center', height: '100%'}}>{'🍸'}</div>}
        <div className="over">
          <div className="grow">
            <h2 style={{fontSize: 20}}>{cocktail.strDrink}</h2>
            <div className="muted">{[cocktail.strGlass, cocktail.strAlcoholic].filter(Boolean).join(' · ')}</div>
          </div>
          <button className="icon-btn danger" title="Delete" onClick={onDelete}>🗑</button>
          <button className="icon-btn" title="Edit" onClick={onEdit}>✎</button>
          <button className={`icon-btn ${fav ? 'on' : ''}`} title={fav ? 'Remove favorite' : 'Add favorite'} onClick={onToggleFav}>
            {fav ? '★' : '☆'}
          </button>
        </div>
      </div>

      <div className="stack" style={{paddingTop: 14}}>
        <div className="row" style={{gap: 6, flexWrap: 'wrap'}}>
          {cocktail.strCategory && <span className="tag">{cocktail.strCategory}</span>}
          {cocktail.strIBA && <span className="tag plain">IBA: {cocktail.strIBA}</span>}
          {cocktail.strTags?.split(',').map((t) => <span key={t} className="tag plain">{t.trim()}</span>)}
        </div>

        {cocktail.strInstructions && (
          <div className="box" style={{padding: 13, borderRadius: 14}}>
            <span className="label">Instructions</span>
            <p style={{fontStyle: 'italic', color: 'var(--cream2)', marginTop: 4}}>{cocktail.strInstructions}</p>
          </div>
        )}

        <div className="row" style={{justifyContent: 'space-between'}}>
          <span className="label">Ingredients</span>
          <button style={{color: 'var(--accent)', fontWeight: 700, fontSize: 12}} onClick={() => setAdding(!adding)}>
            {adding ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {ings.map((ing) => (
          <div key={ing.order} className="box row">
            <span className="grow">{ing.strIngredient}</span>
            <input
              style={{width: 90, padding: '5px 8px', borderRadius: 8, fontSize: 13}}
              value={ing.strMeasure || ''}
              placeholder="to fill"
              onChange={(e) => setIngs(ings.map((i) => (i.order === ing.order ? {...i, strMeasure: e.target.value || null} : i)))}
            />
            <button className="x" title="Remove" onClick={() => setIngs(ings.filter((i) => i.order !== ing.order))}>×</button>
          </div>
        ))}

        {adding && (
          <div className="stack" style={{gap: 8, padding: 12, borderRadius: 14, background: 'var(--accent-lo)', border: '1.5px solid var(--accent-md)'}}>
            <span className="label">Add Ingredient</span>
            <input placeholder="Ingredient name…" value={newName} onChange={(e) => setNewName(e.target.value)}/>
            <div className="row" style={{gap: 8}}>
              <input placeholder="Measure (e.g. 1.5 oz)" value={newMeasure} onChange={(e) => setNewMeasure(e.target.value)}/>
              <button className="btn" style={{height: 44, borderRadius: 10}} onClick={addIngredient}>Add</button>
            </div>
          </div>
        )}

        <button className="btn" onClick={() => setConfirm(true)}>{'🍸 Brew this Cocktail'}</button>
      </div>
    </Sheet>
  );
}
