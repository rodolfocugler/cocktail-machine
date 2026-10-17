import {useCallback, useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {errorMessage} from './services/api';

export const PAGE_SIZE = 20;

export function useDebounced(value, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

// Paginated list: fetchPage(page) -> Promise<items[]>. Reloads from page 0 when deps change.
export function usePaged(fetchPage, deps) {
  const [state, setState] = useState({items: [], page: 0, canMore: true, loading: true, loadingMore: false});
  const req = useRef(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetcher = useCallback(fetchPage, deps);

  const reload = useCallback(() => {
    const id = ++req.current;
    setState((s) => ({...s, loading: true}));
    fetcher(0)
      .then((items) => id === req.current && setState({items, page: 0, canMore: items.length >= PAGE_SIZE, loading: false, loadingMore: false}))
      .catch((e) => {
        if (id !== req.current) return;
        setState((s) => ({...s, loading: false}));
        toast.error(errorMessage(e));
      });
  }, [fetcher]);

  useEffect(reload, [reload]);

  const latest = useRef(state);
  latest.current = state;

  const more = useCallback(() => {
    const s = latest.current;
    if (!s.canMore || s.loading || s.loadingMore) return;
    const id = req.current;
    const page = s.page + 1;
    latest.current = {...s, loadingMore: true};
    setState((st) => ({...st, loadingMore: true}));
    fetcher(page)
      .then((items) => id === req.current && setState((st) => ({
        ...st, items: [...st.items, ...items], page, canMore: items.length >= PAGE_SIZE, loadingMore: false,
      })))
      .catch(() => setState((st) => ({...st, loadingMore: false})));
  }, [fetcher]);

  const setItems = (fn) => setState((s) => ({...s, items: fn(s.items)}));
  return {...state, reload, more, setItems};
}
