import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar        from './components/Layout/Sidebar';
import Topbar         from './components/Layout/Topbar';
import CommandPalette from './components/UI/CommandPalette';
import Dashboard  from './pages/Dashboard';
import Analytics  from './pages/Analytics';
import Orders     from './pages/Orders';
import Products   from './pages/Products';
import Customers  from './pages/Customers';
import Support    from './pages/Support';
import Settings   from './pages/Settings';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebar,    setMobileSidebar]    = useState(false);
  const [cmdOpen,          setCmdOpen]          = useState(false);

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    const h = () => { if (window.innerWidth > 900) setMobileSidebar(false); };
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth <= 900) setMobileSidebar(p => !p);
    else setSidebarCollapsed(p => !p);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} mobileOpen={mobileSidebar} onClose={() => setMobileSidebar(false)} />
      {mobileSidebar && <div className="mobile-overlay" onClick={() => setMobileSidebar(false)} />}
      <div className={`main-content${sidebarCollapsed ? ' collapsed' : ''}`}>
        <Topbar onToggleSidebar={toggleSidebar} onOpenCmd={() => setCmdOpen(true)} />
        <main className="page-content">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/orders"    element={<Orders />}    />
            <Route path="/products"  element={<Products />}  />
            <Route path="/customers" element={<Customers />} />
            <Route path="/support"   element={<Support />}   />
            <Route path="/settings"  element={<Settings />}  />
          </Routes>
        </main>
      </div>
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
    </div>
  );
}
