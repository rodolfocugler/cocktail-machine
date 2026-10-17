import React, {useEffect, useRef, useState} from 'react';
import api, {errorMessage, GOOGLE_CLIENT_ID, loginWithGoogle} from '../services/api';

// Polls actuator/health (2s timeout) every 10s until the backend answers — Render cold starts
function useHealth() {
  const [h, setH] = useState({status: 'checking', attempt: 0, run: 0});
  useEffect(() => {
    let stop = false;
    let timer;
    const poll = async (attempt) => {
      setH((s) => ({...s, status: 'checking'}));
      const ok = await api.get('actuator/health', {timeout: 2000}).then(() => true, () => false);
      if (stop) return;
      setH((s) => ({...s, status: ok ? 'online' : 'offline', attempt}));
      if (!ok) timer = setTimeout(() => poll(attempt + 1), 10000);
    };
    poll(1);
    return () => { stop = true; clearTimeout(timer); };
  }, [h.run]);
  return [h, () => setH((s) => ({...s, run: s.run + 1}))];
}

const BANNER = {
  online: ['var(--green)', 'Backend online'],
  offline: ['var(--error)', 'Backend unreachable'],
  checking: ['var(--accent)', 'Checking backend…'],
};

export default function Login() {
  const [health, retry] = useHealth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const button = useRef();

  useEffect(() => {
    const gis = window.google?.accounts?.id;
    if (!gis) { setError('Google Sign-In failed to load'); return; }
    gis.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: ({credential}) => {
        setLoading(true);
        setError(null);
        // On success the session listener in App swaps to the main screen
        loginWithGoogle(credential).catch((e) => { setError(errorMessage(e)); setLoading(false); });
      },
    });
    gis.renderButton(button.current, {theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', width: 300});
  }, []);

  const [color, label] = BANNER[health.status];
  return (
    <div style={{
      minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
      padding: '56px 32px 48px', textAlign: 'center',
      background: 'radial-gradient(circle at 50% 35%, rgba(212,146,46,.12), transparent 280px), linear-gradient(var(--bg0), var(--bg1), var(--bg0))',
    }}>
      <div className="stack" style={{alignItems: 'center', gap: 18}}>
        <div className="card" style={{width: 82, height: 82, borderRadius: 24, fontSize: 40, display: 'grid', placeItems: 'center'}}>{'🍸'}</div>
        <div>
          <h1 style={{fontSize: 38, letterSpacing: 1}}>Drinkeiro</h1>
          <div className="label">Cocktail Machine</div>
        </div>
      </div>

      <div>
        <div style={{fontSize: 92}}>{'🍹'}</div>
        <p style={{fontStyle: 'italic', color: 'var(--cream3)', fontSize: 16}}>Craft perfection,<br/>one pour at a time.</p>
      </div>

      <div className="stack" style={{width: '100%', maxWidth: 380, alignItems: 'center', gap: 12}}>
        <div className="row" style={{
          width: '100%', padding: '10px 14px', borderRadius: 14, color, fontSize: 13, fontWeight: 600,
          border: `1px solid ${color}`, background: 'rgba(0,0,0,.15)',
        }}>
          <span className="dot" style={{background: color, animation: health.status === 'checking' ? 'pulse .7s linear infinite alternate' : 'none'}}/>
          <span className="grow" style={{textAlign: 'left'}}>{label}</span>
          {health.status === 'offline' && <>
            <span className="label">Attempt {health.attempt} · retrying in 10s</span>
            <button style={{color: 'var(--accent)', fontWeight: 700, fontSize: 12}} onClick={retry}>Retry</button>
          </>}
        </div>

        <div ref={button} style={{minHeight: 44, opacity: loading ? 0.4 : 1, pointerEvents: loading ? 'none' : 'auto'}}/>
        {loading && <span className="muted">Signing in…</span>}
        {error && <span style={{color: 'var(--error)', fontSize: 13}}>{error}</span>}
        <span className="label" style={{color: 'var(--cream4)'}}>By continuing you agree to our Terms &amp; Privacy Policy</span>
      </div>
    </div>
  );
}
