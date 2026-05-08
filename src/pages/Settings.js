import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { isDark, toggleDark } = useTheme();
  const [profile, setProfile] = useState({ firstName:'Admin', lastName:'Khan', email:'aneesashiq472@gmail.com', phone:'+92 347 1327180' });
  const [prefs,   setPrefs]   = useState({ currency:'USD ($)', timezone:'UTC+5 (Pakistan)', language:'English', emailNotif: true });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile */}
        <div className="chart-card">
          <div className="chart-title" style={{marginBottom:20}}>Profile Settings</div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">First Name</label>
              <input className="form-input" value={profile.firstName} onChange={e=>setProfile(p=>({...p,firstName:e.target.value}))} />
            </div>
            <div className="form-group"><label className="form-label">Last Name</label>
              <input className="form-input" value={profile.lastName} onChange={e=>setProfile(p=>({...p,lastName:e.target.value}))} />
            </div>
          </div>
          <div className="form-group"><label className="form-label">Email</label>
            <input className="form-input" type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} />
          </div>
          <div className="form-group"><label className="form-label">Phone</label>
            <input className="form-input" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} />
          </div>
          <button className="btn btn-primary" onClick={() => toast.success('✅ Profile saved!')}>Save Profile</button>
        </div>

        {/* Preferences */}
        <div className="chart-card">
          <div className="chart-title" style={{marginBottom:20}}>Preferences</div>
          <div className="form-group"><label className="form-label">Currency</label>
            <select className="form-select" value={prefs.currency} onChange={e=>setPrefs(p=>({...p,currency:e.target.value}))}>
              <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option><option>PKR (₨)</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Timezone</label>
            <select className="form-select" value={prefs.timezone} onChange={e=>setPrefs(p=>({...p,timezone:e.target.value}))}>
              <option>UTC+0</option><option>UTC+5 (Pakistan)</option><option>UTC-5 (EST)</option><option>UTC+8 (China)</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Language</label>
            <select className="form-select" value={prefs.language} onChange={e=>setPrefs(p=>({...p,language:e.target.value}))}>
              <option>English</option><option>Urdu</option><option>Arabic</option>
            </select>
          </div>

          {/* Dark mode row */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderTop:'1px solid var(--border)'}}>
            <span style={{fontSize:14,fontWeight:500}}>Dark Mode</span>
            <button className={`dark-toggle-btn${isDark?' on':''}`} onClick={toggleDark}>
              <span className="toggle-knob-inner">{isDark?'🌙':'☀️'}</span>
            </button>
          </div>

          {/* Email notif row */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderTop:'1px solid var(--border)'}}>
            <span style={{fontSize:14,fontWeight:500}}>Email Notifications</span>
            <button className={`dark-toggle-btn${prefs.emailNotif?' on':''}`} onClick={() => setPrefs(p=>({...p,emailNotif:!p.emailNotif}))}>
              <span className="toggle-knob-inner">{prefs.emailNotif?'✓':'✕'}</span>
            </button>
          </div>

          <button className="btn btn-primary" style={{marginTop:8}} onClick={() => toast.success('✅ Preferences saved!')}>Save Preferences</button>
        </div>
      </div>

      <style>{`
        .dark-toggle-btn { width:52px; height:28px; background:var(--surface2); border:1px solid var(--border); border-radius:99px; cursor:pointer; display:flex; align-items:center; padding:3px; transition:all .2s; }
        .dark-toggle-btn.on { background:var(--primary); border-color:var(--primary); }
        .toggle-knob-inner { width:20px; height:20px; background:var(--surface); border-radius:50%; transition:all .2s; display:flex; align-items:center; justify-content:center; font-size:11px; }
        .dark-toggle-btn.on .toggle-knob-inner { transform:translateX(24px); }
      `}</style>
    </div>
  );
}
