import React, {useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import api, {errorMessage} from '../services/api';
import {PAGE_SIZE, useDebounced, usePaged} from '../hooks';
import CocktailDetail from './CocktailDetail';
import {LoadMore, Spinner} from './ui';

export function CocktailCard({cocktail, onClick}) {
  return (
    <button className="cocktail-card" onClick={onClick}>
      <div className="img">
        {cocktail.strDrinkThumb ? <img src={cocktail.strDrinkThumb} alt="" loading="lazy"/> : '🍸'}
        <span className="fav" style={{color: cocktail.isFavorite ? 'var(--accent)' : 'var(--cream3)'}}>
          {cocktail.isFavorite ? '★' : '☆'}
        </span>
      </div>
      <div className="body">
        <div className="ellipsis serif" style={{fontWeight: 600, fontSize: 15}}>{cocktail.strDrink}</div>
        <div className="ellipsis muted">{(cocktail.strIngredient || []).map((i) => i.strIngredient).join(' · ')}</div>
        <div className="row" style={{gap: 5, marginTop: 4, overflow: 'hidden'}}>
          {cocktail.strCategory && <span className="tag ellipsis">{cocktail.strCategory.replace('/Unknown', '')}</span>}
          {cocktail.strGlass && <span className="tag plain ellipsis">{cocktail.strGlass}</span>}
        </div>
      </div>
    </button>
  );
}

// favorites=true → Favorites tab, otherwise the Cocktails tab with category chips
export default function CocktailList({favorites, categories, version, onBrew, onEdit, onDelete}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [detail, setDetail] = useState(null);
  const search = useDebounced(query.trim()) || undefined;
  const searchRef = useRef();

  // "/" focuses search, like most desktop web apps
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.target.matches('input, textarea, select')) return;
      e.preventDefault();
      searchRef.current.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const list = usePaged(async (page) => {
    const params = favorites
      ? {page, pageSize: PAGE_SIZE, filter: search}
      : {page, pageSize: PAGE_SIZE, search, category: category === 'All' ? undefined : category};
    const {data} = await api.get(favorites ? 'api/cocktails/favorites' : 'api/cocktails', {params});
    return favorites ? data.content.map((c) => ({...c, isFavorite: true})) : data.content;
  }, [favorites, search, category, version]);

  const toggleFav = async (c) => {
    const isFavorite = !c.isFavorite;
    try {
      if (isFavorite) await api.patch(`api/cocktails/favorites/${c.id}`);
      else await api.delete(`api/cocktails/favorites/${c.id}`);
    } catch (e) {
      toast.error(errorMessage(e));
      return;
    }
    const updated = {...c, isFavorite};
    setDetail(updated);
    list.setItems((items) => (favorites && !isFavorite
      ? items.filter((i) => i.id !== c.id)
      : items.map((i) => (i.id === c.id ? updated : i))));
  };

  return (
    <div className="page">
      <div className="toolbar">
        <div className="search">
          <span style={{color: 'var(--cream3)'}}>⌕</span>
          <input ref={searchRef} aria-label="Search" placeholder="Search cocktails or ingredients…  ( / )" value={query} onChange={(e) => setQuery(e.target.value)}/>
          {query && <button style={{color: 'var(--cream3)'}} title="Clear" onClick={() => setQuery('')}>✕</button>}
        </div>
        {favorites
          ? <div className="label">{list.items.length} saved</div>
          : (
            <div className="pills">
              {categories.map((c) => (
                <button key={c} className={`pill ${c === category ? 'on' : ''}`} onClick={() => { setCategory(c); setQuery(''); }}>{c}</button>
              ))}
            </div>
          )}
      </div>

      {list.loading && <Spinner/>}
      {!list.loading && list.items.length === 0 && (
        <div className="empty">
          {query ? `No ${favorites ? 'favorites' : 'cocktails'} match "${query}"`
            : favorites ? 'No favorites yet.\nClick ☆ on any cocktail to save it.' : 'No cocktails here.\nClick + New Recipe to add one.'}
        </div>
      )}
      {!list.loading && (
        <div className="grid">
          {list.items.map((c) => <CocktailCard key={c.id} cocktail={c} onClick={() => setDetail(c)}/>)}
        </div>
      )}
      <LoadMore onMore={list.more} loading={list.loadingMore}/>

      {detail && (
        <CocktailDetail
          cocktail={detail}
          onToggleFav={() => toggleFav(detail)}
          onBrew={(c, ings) => { onBrew(c, ings); setDetail(null); }}
          onEdit={() => { onEdit(detail); setDetail(null); }}
          onDelete={() => { onDelete(detail); setDetail(null); }}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}
