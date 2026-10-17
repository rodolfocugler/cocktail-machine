import React from 'react';
import api from '../services/api';
import {PAGE_SIZE, usePaged} from '../hooks';
import {LoadMore, Spinner} from './ui';

const fmt = (ts) => new Date(ts).toLocaleString(undefined, {
  day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

export default function HistoryTab({machineId, version}) {
  const list = usePaged(async (page) => {
    if (!machineId) return [];
    const {data} = await api.get(`api/histories/machine/${machineId}`, {params: {page, pageSize: PAGE_SIZE}});
    return data.content;
  }, [machineId, version]);

  if (list.loading) return <Spinner/>;
  if (!list.items.length) return <div className="empty">{'No brews yet.\nCheers soon! 🥂'}</div>;

  return (
    <div style={{padding: '0 20px'}}>
      <div className="label" style={{padding: '12px 0'}}>Recent Brews</div>
      {list.items.map((h) => (
        <div key={h.id} className="list-item">
          <div className="thumb" style={{width: 44, height: 44, borderRadius: 12, fontSize: 22, background: 'var(--accent-lo)', borderColor: 'var(--accent-md)'}}>{'🍸'}</div>
          <div className="grow">
            <div style={{fontWeight: 600}}>{fmt(h.timestamp)}</div>
            <div className="muted">{h.historyEntries.map((e) => e.name).join(', ')}</div>
          </div>
        </div>
      ))}
      <LoadMore onMore={list.more} loading={list.loadingMore}/>
    </div>
  );
}
