import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SkeletonTable } from '../components/UI/Skeleton';
import Modal from '../components/UI/Modal';
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../api';

const STATUSES = ['all','pending','processing','delivered','cancelled'];

export default function Orders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ customer:'', amount:'', items:1, payment:'Credit Card' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOrders({ status: filter, search });
      setOrders(data.orders);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    try {
      await createOrder(form);
      toast.success('✅ Order created!');
      setModal(false); setForm({ customer:'', amount:'', items:1, payment:'Credit Card' });
      load();
    } catch (e) { toast.error(e.message); }
  };

  const handleStatus = async (id, status) => {
    try { await updateOrder(id, { status }); toast.success('Status updated'); load(); }
    catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try { await deleteOrder(id); toast.success('Order deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  const exportCSV = () => {
    const rows = [['ID','Customer','Items','Amount','Payment','Status','Date'],
      ...orders.map(o => [o.id,o.customer,o.items,o.amount,o.payment,o.status,o.date])];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'}));
    a.download = 'orders.csv'; a.click();
    toast.success('⬇️ CSV downloaded!');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Orders Management</h2>
          <p className="page-subtitle">Track, manage and fulfill customer orders</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>⬇️ Export CSV</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ New Order</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {STATUSES.map(s => (
              <button key={s} className={`filter-tab${filter===s?' active':''}`} onClick={() => setFilter(s)}>
                {s.charAt(0).toUpperCase()+s.slice(1)}
              </button>
            ))}
          </div>
          <input
            className="form-input" style={{width:220,padding:'7px 12px',fontSize:13}}
            placeholder="Search orders…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          {loading ? <SkeletonTable rows={6} /> : (
            <table className="data-table">
              <thead><tr>
                <th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {orders.map(o => (
                  <motion.tr key={o.id} initial={{opacity:0}} animate={{opacity:1}}>
                    <td><span style={{fontWeight:600,color:'var(--primary)'}}>{o.id}</span></td>
                    <td>{o.customer}</td>
                    <td>{o.items}</td>
                    <td><strong>${parseFloat(o.amount).toFixed(2)}</strong></td>
                    <td><span className="badge badge-gray">{o.payment}</span></td>
                    <td>
                      <select
                        className="form-select"
                        style={{padding:'3px 8px',fontSize:12,width:'auto'}}
                        value={o.status}
                        onChange={e => handleStatus(o.id, e.target.value)}
                        onClick={e => e.stopPropagation()}
                      >
                        {['pending','processing','delivered','cancelled'].map(s=>(
                          <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{color:'var(--text-muted)'}}>{o.date}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Create New Order"
        footer={<>
          <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}>Create</button>
        </>}
      >
        <div className="form-group"><label className="form-label">Customer Name</label>
          <input className="form-input" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))} placeholder="Enter name" />
        </div>
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Amount ($)</label>
            <input className="form-input" type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0.00" />
          </div>
          <div className="form-group"><label className="form-label">Items</label>
            <input className="form-input" type="number" min="1" value={form.items} onChange={e=>setForm(f=>({...f,items:e.target.value}))} />
          </div>
        </div>
        <div className="form-group"><label className="form-label">Payment</label>
          <select className="form-select" value={form.payment} onChange={e=>setForm(f=>({...f,payment:e.target.value}))}>
            <option>Credit Card</option><option>PayPal</option><option>Bank Transfer</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
