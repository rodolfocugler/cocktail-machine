import React, {useEffect, useRef} from 'react';

export function Sheet({onClose, children}) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="handle"/>
        {children}
      </div>
    </div>
  );
}

export function Field({label, ...props}) {
  return (
    <label className="stack" style={{gap: 6}}>
      <span className="label">{label}</span>
      {props.rows ? <textarea {...props}/> : <input {...props}/>}
    </label>
  );
}

export function Thumb({src, className = 'thumb', size}) {
  return (
    <div className={className} style={size && {width: size, height: size}}>
      {src ? <img src={src} alt=""/> : '🍸'}
    </div>
  );
}

export const Spinner = () => <div className="center"><div className="spinner"/></div>;

// Calls onMore when the sentinel scrolls into view (infinite scroll)
export function LoadMore({onMore, loading}) {
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onMore());
    io.observe(ref.current);
    return () => io.disconnect();
  }, [onMore]);
  return <div ref={ref}>{loading && <Spinner/>}</div>;
}
