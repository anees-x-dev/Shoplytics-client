import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

const items = [
  { icon:'📊', title:'Dashboard',       sub:'Go to dashboard',         section:'Pages',   path:'/'          },
  { icon:'📈', title:'Analytics',       sub:'View analytics',          section:'Pages',   path:'/analytics' },
  { icon:'📦', title:'Orders',          sub:'Manage orders',           section:'Pages',   path:'/orders'    },
  { icon:'🛍️', title:'Products',        sub:'Manage products',         section:'Pages',   path:'/products'  },
  { icon:'👥', title:'Customers',       sub:'View customers',          section:'Pages',   path:'/customers' },
  { icon:'💬', title:'Help & Support',  sub:'Get help or send feedback',section:'Pages',  path:'/support'   },
  { icon:'⚙️', title:'Settings',        sub:'Account settings',        section:'Pages',   path:'/settings'  },
];

export default function CommandPalette({ onClose }) {
  const [query,    setQuery]    = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef  = useRef(null);
  const navigate  = useNavigate();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query
    ? items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.sub.toLowerCase().includes(query.toLowerCase()))
    : items;

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter')     { if (filtered[selected]) go(filtered[selected]); }
    if (e.key === 'Escape')    { onClose(); }
  };

  const go = (item) => { navigate(item.path); onClose(); };

  const sections = [...new Set(filtered.map(i => i.section))];

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-row">
          <span className="cmd-search-icon">🔍</span>
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Search pages, actions…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKey}
          />
          <span className="cmd-esc">ESC</span>
        </div>

        <div className="cmd-results">
          {filtered.length === 0 ? (
            <div className="cmd-empty">No results found</div>
          ) : sections.map(sec => (
            <div key={sec}>
              <div className="cmd-section">{sec}</div>
              {filtered.filter(i => i.section === sec).map((item, idx) => {
                const globalIdx = filtered.indexOf(item);
                return (
                  <div
                    key={item.title}
                    className={`cmd-item${globalIdx === selected ? ' selected' : ''}`}
                    onClick={() => go(item)}
                    onMouseEnter={() => setSelected(globalIdx)}
                  >
                    <div className="cmd-item-icon">{item.icon}</div>
                    <div>
                      <div className="cmd-item-title">{item.title}</div>
                      <div className="cmd-item-sub">{item.sub}</div>
                    </div>
                    <span className="cmd-item-kbd">↵</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
