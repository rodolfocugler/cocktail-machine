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
  html { scrollbar-color: var(--border) transparent; }
  body {
    background: var(--bg0); color: var(--cream);
    font: 14px/1.5 var(--sans); -webkit-font-smoothing: antialiased;
  }
  h1, h2, .serif { font-family: var(--serif); }
  button { cursor: pointer; font: inherit; color: inherit; background: none; border: 0; }
  button:disabled { cursor: default; opacity: .45; }
  input, select, textarea {
    width: 100%; font: 14px var(--sans); color: var(--cream);
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
    padding: 12px 16px; border-bottom: .5px solid var(--border);
  }
  .list-item:last-child { border-bottom: 0; }

  /* Hover feedback (desktop pointer) */
  .box, .pill, .icon-btn, .chip, .btn, .pump-cell, .nav-item, .cocktail-card {
    transition: background .15s, border-color .15s, color .15s, filter .15s, transform .15s, box-shadow .15s;
  }
  button.box:hover:not(:disabled), .pill:hover, .icon-btn:hover:not(:disabled), button.pump-cell:hover { border-color: var(--accent-md); color: var(--cream); }
  .icon-btn.danger:hover:not(:disabled) { border-color: var(--error); color: var(--error); }
  .btn:hover:not(:disabled), .chip:hover { filter: brightness(1.12); }

  /* App shell: sidebar + scrolling content */
  .app { display: grid; grid-template-columns: 232px 1fr; height: 100%; }
  .sidebar {
    display: flex; flex-direction: column; gap: 2px; padding: 20px 12px;
    background: var(--bg1); border-right: 1px solid var(--border);
  }
  .brand { display: flex; align-items: center; gap: 10px; padding: 4px 12px 24px; font-size: 20px; font-weight: 700; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px;
    font-weight: 600; color: var(--cream3); text-align: left;
  }
  .nav-item:hover { background: var(--bg2); color: var(--cream); }
  .nav-item.on { background: var(--accent-lo); color: var(--accent); }
  .nav-item .ico { width: 20px; text-align: center; font-size: 16px; }
  .nav-spacer { flex: 1; }
  .content { overflow-y: auto; min-width: 0; min-height: 0; }
  .page-head {
    position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 12px; padding: 14px 32px;
    background: rgba(26,16,8,.88); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border);
  }
  .page-head h1 { flex: 1; font-size: 22px; }
  .page { padding: 20px 32px 48px; max-width: 1320px; }
  .toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .toolbar .search { margin: 0; width: 340px; flex-shrink: 0; }
  .toolbar .pills { flex: 1; padding: 0; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .cocktail-card {
    display: flex; flex-direction: column; text-align: left; overflow: hidden;
    background: var(--bg2); border: 1px solid var(--border); border-radius: 16px;
  }
  .cocktail-card:hover { transform: translateY(-2px); border-color: var(--accent-md); box-shadow: 0 10px 28px rgba(0,0,0,.4); }
  .cocktail-card .img { position: relative; aspect-ratio: 4/3; display: grid; place-items: center; font-size: 48px; background: var(--bg3); }
  .cocktail-card .img img { width: 100%; height: 100%; object-fit: cover; }
  .cocktail-card .fav {
    position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; border-radius: 50%;
    display: grid; place-items: center; font-size: 16px; background: rgba(26,16,8,.75);
  }
  .cocktail-card .body { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px 14px; }

  .machine-layout { display: grid; grid-template-columns: 340px 1fr; gap: 28px; align-items: start; }
  .thumb {
    width: 56px; height: 56px; border-radius: 14px; flex-shrink: 0; overflow: hidden;
    display: flex; align-items: center; justify-content: center; font-size: 26px;
    background: var(--bg2); border: 1px solid var(--border);
  }
  .thumb img, .hero img { width: 100%; height: 100%; object-fit: cover; }

  /* Bottom sheet */
  /* Centered modal on desktop, bottom sheet on phones */
  .overlay {
    position: fixed; inset: 0; z-index: 10; background: rgba(0,0,0,.6); backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center; padding: 24px; animation: fade .15s;
  }
  .sheet {
    position: relative; width: 100%; max-width: 560px; max-height: calc(100vh - 48px); overflow-y: auto;
    background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 24px;
    box-shadow: 0 24px 64px rgba(0,0,0,.55); animation: pop .15s;
  }
  .sheet .handle { display: none; width: 40px; height: 4px; border-radius: 2px; background: var(--border); margin: 0 auto 16px; }
  .sheet-close {
    position: absolute; z-index: 2; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%;
    font-size: 20px; line-height: 1; color: var(--cream2); background: rgba(26,16,8,.6);
  }
  .sheet-close:hover { color: var(--cream); background: var(--bg3); }
  @keyframes fade { from { opacity: 0; } }
  @keyframes pop { from { opacity: 0; transform: scale(.97); } }
  .sheet h2 { font-size: 17px; font-weight: 600; }
  .hero { position: relative; height: 160px; border-radius: 20px; overflow: hidden; background: var(--bg3); }
  .hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(transparent, rgba(46,30,13,.95)); }
  .hero .over { position: absolute; z-index: 1; left: 14px; right: 14px; bottom: 14px; display: flex; align-items: flex-end; gap: 7px; }

  .pump-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; }
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

  .login { display: grid; grid-template-columns: 1.2fr 1fr; min-height: 100%; }
  .login-hero {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; padding: 48px; text-align: center;
    background: radial-gradient(circle at 50% 45%, rgba(212,146,46,.14), transparent 340px), linear-gradient(var(--bg0), var(--bg1), var(--bg0));
  }
  .login-panel { display: grid; place-items: center; padding: 32px; background: var(--bg1); border-left: 1px solid var(--border); }

  /* Phone: sidebar becomes a bottom tab bar, modals become bottom sheets */
  @media (max-width: 760px) {
    .app { grid-template-columns: 1fr; grid-template-rows: 1fr auto; }
    .sidebar {
      order: 2; flex-direction: row; padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
      border-right: 0; border-top: 1px solid var(--border);
    }
    .brand, .nav-spacer { display: none; }
    .nav-item { flex: 1; flex-direction: column; align-items: center; gap: 2px; padding: 6px 0; font-size: 10px; letter-spacing: .5px; text-transform: uppercase; }
    .nav-item:hover { background: none; }
    .page-head { padding: 12px 16px; }
    .page-head h1 { font-size: 18px; }
    .page { padding: 12px 16px 32px; }
    .toolbar { flex-direction: column; align-items: stretch; gap: 8px; }
    .toolbar .search { width: auto; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
    .machine-layout { grid-template-columns: 1fr; }
    .pump-grid { grid-template-columns: repeat(4, 1fr); }
    .overlay { align-items: flex-end; padding: 0; }
    .sheet { max-height: 92vh; border: 0; border-radius: 28px 28px 0 0; padding: 12px 22px 24px; animation: none; }
    .sheet .handle { display: block; }
    .sheet-close { display: none; }
    .login { grid-template-columns: 1fr; }
    .login-panel { border-left: 0; background: none; padding-top: 0; }
  }

  .Toastify__toast { background: var(--bg2); color: var(--cream); border: 1.5px solid var(--accent-md); border-radius: 18px; font-family: var(--sans); }
  .Toastify__toast--error { border-color: rgba(229,92,92,.5); }
`;
