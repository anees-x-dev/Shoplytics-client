import React, { useState, useEffect, useCallback } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Modal from '../components/UI/Modal';
import { SkeletonTable } from '../components/UI/Skeleton';
import { fetchCustomers, fetchCustomerGrowth, fetchCustomerSegments, createCustomer, deleteCustomer } from '../api';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const STATUS_BADGE = { vip:'badge-warning', regular:'badge-info', new:'badge-success' };

export default function Customers() {
  const { isDark } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [growth,    setGrowth]    = useState(null);
  const [segments,  setSegments]  = useState(null);
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState({ name:'', email:'' });

  const tickColor  = isDark ? '#94a3b8' : '#64748b';
  const gridColor  = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)';
  const legendOpts = { color: tickColor, usePointStyle:true, font:{family:'Inter',size:12} };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, g, s] = await Promise.all([fetchCustomers({ search }), fetchCustomerGrowth(), fetchCustomerSegments()]);
      setCustomers(c.customers); setGrowth(g); setSegments(s);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    try { await createCustomer(form); toast.success('✅ Customer added!'); setModal(false); load(); }
    catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try { await deleteCustomer(id); toast.success('Customer deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  const growthData = growth ? {
    labels: growth.labels,
    datasets:[{ label:'New Customers', data: growth.data, borderColor:'#8b5cf6', backgroundColor:'rgba(139,92,246,.15)', fill:true, tension:.4, pointBackgroundColor:'#8b5cf6', pointRadius:4 }],
  } : null;

  const segData = segments ? {
    labels: segments.labels,
    datasets:[{ data: segments.data, backgroundColor:['#f59e0b','#2563eb','#10b981','#94a3b8'], borderWidth:0, hoverOffset:6 }],
  } : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Customers</h2>
          <p className="page-subtitle">Manage your customer base and insights</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Add Customer</button>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{marginBottom:24}}>
        <div className="chart-card">
          <div className="chart-title" style={{marginBottom:16}}>Customer Growth</div>
          <div style={{height:200}}>
            {growthData ? (
              <Line data={growthData} options={{ responsive:true, maintainAspectRatio:false,
                plugins:{ legend:{display:false}, tooltip:{backgroundColor:'rgba(15,23,42,.9)',padding:12,cornerRadius:8} },
                scales:{ x:{grid:{display:false},ticks:{color:tickColor,font:{family:'Inter',size:11}}}, y:{grid:{color:gridColor},ticks:{color:tickColor,font:{family:'Inter'}}} }
              }} />
            ) : <div style={{height:200}} className="skeleton" />}
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-title" style={{marginBottom:16}}>Customer Segments</div>
          <div style={{height:200}}>
            {segData ? (
              <Doughnut data={segData} options={{ responsive:true, maintainAspectRatio:false, cutout:'70%',
                plugins:{ legend:{ position:'bottom', labels: legendOpts }, tooltip:{backgroundColor:'rgba(15,23,42,.9)',padding:12,cornerRadius:8} }
              }} />
            ) : <div style={{height:200}} className="skeleton" />}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <strong style={{fontSize:15}}>Customer List</strong>
          <input className="form-input" style={{width:220,padding:'7px 12px',fontSize:13}} placeholder="Search customers…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap">
          {loading ? <SkeletonTable rows={5} /> : (
            <table className="data-table">
              <thead><tr><th>Customer</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {customers.map((c, i) => {
                  const initials = c.name.split(' ').map(n=>n[0]).join('');
                  return (
                    <motion.tr key={c.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.04}}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:12}}>
                          <div style={{width:36,height:36,borderRadius:'50%',background:c.color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:13,fontFamily:'Poppins,sans-serif',flexShrink:0}}>{initials}</div>
                          <strong style={{fontSize:13}}>{c.name}</strong>
                        </div>
                      </td>
                      <td style={{color:'var(--text-muted)'}}>{c.email}</td>
                      <td>{c.orders}</td>
                      <td><strong>${c.spent.toLocaleString()}</strong></td>
                      <td style={{color:'var(--text-muted)'}}>{c.joined}</td>
                      <td><span className={`badge ${STATUS_BADGE[c.status]||'badge-gray'}`}>{c.status?.toUpperCase()}</span></td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button></td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add New Customer"
        footer={<>
          <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>Add Customer</button>
        </>}
      >
        <div className="form-group"><label className="form-label">Full Name</label>
          <input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Customer name" />
        </div>
        <div className="form-group"><label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@example.com" />
        </div>
      </Modal>
    </div>
  );
}
