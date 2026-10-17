import {createGlobalStyle} from 'styled-components';

// Palette mirrors drinkeiro-android ui/theme/Theme.kt
export default createGlobalStyle`
  :root {
    --bg0: #1A1008; --bg1: #221508; --bg2: #2E1E0D; --bg3: #3D2A12;
    --border: #5A3D1E;
    --accent: #D4922E; --accent-lo: rgba(212,146,46,.2); --accent-md: rgba(212,146,46,.4);
    --cream: #FFF3DC; --cream2: rgba(255,243,220,.8); --cream3: rgba(255,243,220,.6); --cream4: rgba(255,243,220,.33);
    --green: #6DC88A; --error: #E55C5C;
    --serif: Georgia, 'Times New Roman', serif;
    --sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    background: var(--bg0); color: var(--cream);
    font: 15px/1.5 var(--serif); -webkit-font-smoothing: antialiased;
  }
  button { cursor: pointer; font: inherit; color: inherit; background: none; border: 0; }
  button:disabled { cursor: default; opacity: .45; }
  input, select, textarea {
    width: 100%; font: 14px var(--serif); color: var(--cream);
    background: var(--bg0); border: 1px solid var(--border); border-radius: 12px; padding: 11px 12px;
  }
  input:focus, select:focus, textarea:focus { outline: 0; border-color: var(--accent); }
  input::placeholder, textarea::placeholder { color: var(--cream4); }
  select option { background: var(--bg2); }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  .label { font: 700 10px var(--sans); letter-spacing: 1.2px; text-transform: uppercase; color: var(--cream3); }
  .muted { color: var(--cream3); font-size: 13px; }
  .row { display: flex; align-items: center; gap: 10px; }
  .grow { flex: 1; min-width: 0; }
  .stack { display: flex; flex-direction: column; gap: 14px; }
  .ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .center { display: flex; justify-content: center; padding: 40px; }
  .empty { padding: 60px 32px; text-align: center; font-style: italic; color: var(--cream3); white-space: pre-line; }

  .btn {
    height: 52px; border-radius: 16px; font-weight: 700; padding: 0 18px;
    background: var(--accent); color: var(--bg0);
  }
  .btn:disabled { background: var(--cream4); opacity: 1; }
  .btn.ghost { background: none; border: 1.5px solid var(--border); color: var(--cream2); font-weight: 600; }
  .chip {
    font: 700 10px var(--sans); letter-spacing: 1.2px; text-transform: uppercase;
    color: var(--accent); background: var(--accent-lo); border: 1.5px solid var(--accent-md);
    border-radius: 10px; padding: 7px 14px;
  }
  .tag {
    font: 700 10px var(--sans); letter-spacing: 1.2px; text-transform: uppercase;
    border-radius: 5px; padding: 2px 8px; background: var(--accent-lo); color: var(--accent);
  }
  .tag.plain { background: var(--bg3); color: var(--cream3); border: 1px solid var(--border); text-transform: none; }
  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; }
  .box { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 9px 12px; }
  .icon-btn {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: var(--bg3); border: 1.5px solid var(--border); color: var(--cream3);
  }
  .icon-btn.danger { color: var(--error); background: rgba(229,92,92,.1); border-color: rgba(229,92,92,.3); }
  .icon-btn.on { color: var(--accent); background: var(--accent-lo); border-color: var(--accent-md); }
  .x { color: var(--error); font-size: 20px; padding: 0 6px; }

  .dot { width: 8px; height: 8px; border-radius: 50%; background: #6B7280; flex-shrink: 0; }
  .dot.on { background: var(--green); animation: pulse .9s linear infinite alternate; }
  @keyframes pulse { to { opacity: .3; } }
  .spinner {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2.5px solid var(--accent-lo); border-top-color: var(--accent); animation: spin .8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .search {
    display: flex; align-items: center; gap: 8px; height: 44px; margin: 12px 0;
    background: var(--bg3); border: 1px solid var(--border); border-radius: 14px; padding: 0 12px;
  }
  .search input { border: 0; background: none; padding: 0; }

  .pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
  .pill {
    flex-shrink: 0; border-radius: 20px; padding: 7px 16px; font-size: 13px; font-weight: 600;
    background: var(--bg2); border: 1.5px solid var(--border); color: var(--cream2);
  }
  .pill.on { background: var(--accent-lo); border-color: var(--accent-md); color: var(--accent); }

  .list-item {
    display: flex; align-items: center; gap: 14px; width: 100%; text-align: left;
    padding: 12px 0; border-bottom: .5px solid var(--border);
  }
  .thumb {
    width: 56px; height: 56px; border-radius: 14px; flex-shrink: 0; overflow: hidden;
    display: flex; align-items: center; justify-content: center; font-size: 26px;
    background: var(--bg2); border: 1px solid var(--border);
  }
  .thumb img, .hero img { width: 100%; height: 100%; object-fit: cover; }

  /* Bottom sheet */
  .overlay {
    position: fixed; inset: 0; z-index: 10; background: rgba(0,0,0,.55);
    display: flex; align-items: flex-end; justify-content: center;
  }
  .sheet {
    width: 100%; max-width: 640px; max-height: 92vh; overflow-y: auto;
    background: var(--bg2); border-radius: 28px 28px 0 0; padding: 12px 22px 24px;
  }
  .sheet .handle { width: 40px; height: 4px; border-radius: 2px; background: var(--border); margin: 0 auto 16px; }
  .sheet h2 { font-size: 17px; font-weight: 600; }
  .hero { position: relative; height: 160px; border-radius: 20px; overflow: hidden; background: var(--bg3); }
  .hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(transparent, rgba(46,30,13,.95)); }
  .hero .over { position: absolute; z-index: 1; left: 14px; right: 14px; bottom: 14px; display: flex; align-items: flex-end; gap: 7px; }

  .pump-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .pump-cell {
    aspect-ratio: 1; border-radius: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: var(--bg2); border: 1.5px solid var(--border); color: var(--cream4);
    font: 700 10px var(--sans); letter-spacing: 1px; gap: 3px; overflow: hidden; padding: 4px;
  }
  .pump-cell.on { background: var(--accent-lo); border-color: var(--accent-md); color: var(--accent); }
  .pump-cell small { font-size: 8px; color: var(--cream3); text-align: center; }
  .progress { height: 4px; border-radius: 2px; background: var(--bg3); overflow: hidden; margin-top: 10px; }
  .progress div { height: 100%; background: var(--green); transition: width 1s linear; }
  input[type=range] { padding: 0; border: 0; background: none; accent-color: var(--accent); }

  .Toastify__toast { background: var(--bg2); color: var(--cream); border: 1.5px solid var(--accent-md); border-radius: 18px; font-family: var(--serif); }
  .Toastify__toast--error { border-color: rgba(229,92,92,.5); }
`;
