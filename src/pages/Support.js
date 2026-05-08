import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Support() {
  const [form, setForm] = useState({ subject:'', type:'Bug Report', message:'' });

  const handleSubmit = () => {
    if (!form.subject || !form.message) { toast.error('Please fill in all fields'); return; }
    toast.success('✅ Feedback submitted! We\'ll respond within 24 hours.');
    setForm({ subject:'', type:'Bug Report', message:'' });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Help & Support</h2>
          <p className="page-subtitle">Get help or send feedback to our team</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="support-grid">
        <div className="chart-card" style={{cursor:'pointer',textAlign:'center',padding:24}} onClick={() => toast.success('💬 Live chat opened!')}>
          <div style={{fontSize:40,marginBottom:12}}>💬</div>
          <h3 style={{fontSize:16,marginBottom:8}}>Live Chat</h3>
          <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:12}}>Chat with our support team in real-time</p>
          <span className="badge badge-success">● Online</span>
        </div>
        <div className="chart-card" style={{cursor:'pointer',textAlign:'center',padding:24}} onClick={() => toast.success('📧 Email client opening…')}>
          <div style={{fontSize:40,marginBottom:12}}>📧</div>
          <h3 style={{fontSize:16,marginBottom:8}}>Email Support</h3>
          <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:12}}>Send us a detailed message</p>
          <span style={{fontSize:13,color:'var(--primary)'}}>support@shoplytics.com</span>
        </div>
      </div>

      {/* Feedback form */}
      <div className="chart-card">
        <div className="chart-title" style={{marginBottom:20}}>Send Feedback</div>
        <div className="form-group">
          <label className="form-label">Subject</label>
          <input className="form-input" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Briefly describe your issue or feedback" />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
            <option>Bug Report</option>
            <option>Feature Request</option>
            <option>General Feedback</option>
            <option>Billing Issue</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-input form-textarea" rows={5} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Describe in detail…" />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>Submit Feedback</button>
      </div>
    </div>
  );
}
