import React, { useState, useEffect, useCallback } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import toast from 'react-hot-toast';
import MetricCard from '../components/UI/MetricCard';
import { SkeletonMetrics, SkeletonTable } from '../components/UI/Skeleton';
import Modal from '../components/UI/Modal';
import {
  fetchMetrics, fetchRecentOrders, fetchRevenueChart,
  fetchOrderStatus, fetchCategories, createOrder,
} from '../api';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const STATUS_BADGE = { delivered:'badge-success', processing:'badge-info', pending:'badge-warning', cancelled:'badge-danger' };

const chartOpts = (isDark, yCallback) => ({
  responsive: true, maintainAspectRatio: false,
  interaction: { mode:'index', intersect:false },
  plugins: {
    legend: { labels:{ color: isDark?'#94a3b8':'#64748b', usePointStyle:true, font:{family:'Inter',size:12} } },
    tooltip: { backgroundColor:'rgba(15,23,42,.9)', titleColor:'#f1f5f9', bodyColor:'#94a3b8', padding:12, cornerRadius:8 },
  },
  scales: {
    x: { grid:{ color: isDark?'rgba(255,255,255,.06)':'rgba(0,0,0,.05)' }, ticks:{ color: isDark?'#94a3b8':'#64748b', font:{family:'Inter'} } },
    y: { grid:{ color: isDark?'rgba(255,255,255,.06)':'rgba(0,0,0,.05)' }, ticks:{ color: isDark?'#94a3b8':'#64748b', font:{family:'Inter'}, callback: yCallback } },
  },
});

export default function Dashboard() {
  const { isDark } = useTheme();
  const [loading,        setLoading]        = useState(true);
  const [metrics,        setMetrics]        = useState(null);
  const [recentOrders,   setRecentOrders]   = useState([]);
  const [revenueData,    setRevenueData]    = useState(null);
  const [statusData,     setStatusData]     = useState(null);
  const [catData,        setCatData]        = useState(null);
  const [period,         setPeriod]         = useState('W');
  const [modalOpen,      setModalOpen]      = useState(false);
  const [form,           setForm]           = useState({ customer:'', amount:'', items:1, payment:'Credit Card' });

  const load = useCallback(async () => {
    try {
      const [m, ro, rv, st, ct] = await Promise.all([
        fetchMetrics(), fetchRecentOrders(),
        fetchRevenueChart(period), fetchOrderStatus(), fetchCategories(),
      ]);
      setMetrics(m); setRecentOrders(ro);
      setRevenueData(rv); setStatusData(st); setCatData(ct);
    } catch (e) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 30s
  useEffect(() => {
    const t = setInterval(() => { fetchRevenueChart(period).then(setRevenueData).catch(()=>{}); }, 30000);
    return () => clearInterval(t);
  }, [period]);

  const changePeriod = (p) => { setPeriod(p); setLoading(true); };

  const handleCreate = async () => {
    try {
      await createOrder(form);
      toast.success('✅ Order created!');
      setModalOpen(false);
      setForm({ customer:'', amount:'', items:1, payment:'Credit Card' });
      load();
    } catch (e) { toast.error(e.message); }
  };

  const exportCSV = () => {
    const rows = [['ID','Customer','Amount','Status','Date'],
      ...recentOrders.map(o => [o.id, o.customer, o.amount, o.status, o.date])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
    a.download = 'orders.csv';
    a.click();
    toast.success('⬇️ CSV downloaded!');
  };

  // Build chart datasets
  const revenueChartData = revenueData ? {
    labels: revenueData.labels,
    datasets: [
      { label:'Revenue ($)', data: revenueData.revenue, borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,.15)', fill:true, tension:.4, pointBackgroundColor:'#2563eb', pointRadius:4 },
      { label:'Orders',      data: revenueData.ordersCount, borderColor:'#10b981', backgroundColor:'rgba(16,185,129,.1)', fill:true, tension:.4, pointBackgroundColor:'#10b981', pointRadius:4, yAxisID:'y2' },
    ],
  } : null;

  const revenueOptions = {
    ...chartOpts(isDark, v => '$'+v.toLocaleString()),
    scales: {
      ...chartOpts(isDark).scales,
      y:  { ...chartOpts(isDark).scales?.y, ticks:{ callback: v => '$'+v.toLocaleString(), color: isDark?'#94a3b8':'#64748b', font:{family:'Inter'} } },
      y2: { position:'right', grid:{display:false}, ticks:{ color:'#10b981', font:{family:'Inter'} } },
    },
  };

  const donutData = statusData ? {
    labels: statusData.labels,
    datasets: [{ data: statusData.data, backgroundColor:['#10b981','#2563eb','#f59e0b','#ef4444'], borderWidth:0, hoverOffset:8 }],
  } : null;

  const donutOpts = { responsive:true, maintainAspectRatio:false, cutout:'72%',
    plugins:{ legend:{ position:'bottom', labels:{ color: isDark?'#94a3b8':'#64748b', usePointStyle:true, padding:16, font:{family:'Inter',size:12} } },
      tooltip:{ backgroundColor:'rgba(15,23,42,.9)', padding:12, cornerRadius:8 } }
  };

  const barData = catData ? {
    labels: catData.labels,
    datasets:[{ label:'Sales ($)', data: catData.data, backgroundColor:['#2563eb','#8b5cf6','#10b981','#f59e0b','#0284c7'], borderRadius:6, borderSkipped:false }],
  } : null;

  const barOpts = { ...chartOpts(isDark, v => '$'+v.toLocaleString()), plugins:{ legend:{ display:false } } };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p className="page-subtitle">Welcome back, Muhammad Anees! Here's what's happening today.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>⬇️ Export CSV</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>+ New Order</button>
        </div>
      </div>

      {/* Metrics */}
      {loading ? <SkeletonMetrics /> : (
        <div className="metrics-grid">
          <MetricCard label="Total Revenue"    value={metrics?.revenue?.value}    prefix="$" trend={metrics?.revenue?.trend}    color="#2563eb" iconBg="rgba(37,99,235,.1)"   icon="💰" />
          <MetricCard label="Total Orders"     value={metrics?.orders?.value}               trend={metrics?.orders?.trend}     color="#10b981" iconBg="rgba(16,185,129,.1)"  icon="📦" />
          <MetricCard label="Customers"        value={metrics?.customers?.value}             trend={metrics?.customers?.trend}  color="#8b5cf6" iconBg="rgba(139,92,246,.1)"  icon="👥" />
          <MetricCard label="Conversion Rate"  value={metrics?.conversion?.value}  suffix="%" trend={metrics?.conversion?.trend} color="#f59e0b" iconBg="rgba(245,158,11,.1)"  icon="🎯" />
        </div>
      )}

      {/* Charts */}
      <div className="charts-grid">
        {/* Revenue line */}
        <div className="chart-card full">
          <div className="chart-header">
            <div className="chart-header-left">
              <div className="chart-title">Revenue Overview</div>
              <div className="chart-subtitle">Monthly revenue trend with orders</div>
            </div>
            <div className="chart-header-right filter-tabs">
              {['D','W','M'].map(p => (
                <button key={p} className={`filter-tab${period===p?' active':''}`} onClick={() => changePeriod(p)}>
                  {p==='D'?'Daily':p==='W'?'Weekly':'Monthly'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height:280 }}>
            {revenueChartData ? <Line data={revenueChartData} options={revenueOptions} /> : <div style={{height:280}} className="skeleton" />}
          </div>
        </div>

        {/* Donut */}
        <div className="chart-card">
          <div className="chart-title" style={{marginBottom:16}}>Orders by Status</div>
          <div style={{ height:220 }}>
            {donutData ? <Doughnut data={donutData} options={donutOpts} /> : <div style={{height:220}} className="skeleton" />}
          </div>
        </div>

        {/* Bar */}
        <div className="chart-card">
          <div className="chart-title" style={{marginBottom:16}}>Top Categories</div>
          <div style={{ height:220 }}>
            {barData ? <Bar data={barData} options={barOpts} /> : <div style={{height:220}} className="skeleton" />}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-header">
          <strong style={{fontSize:15}}>Recent Orders</strong>
        </div>
        <div className="table-wrap">
          {loading ? <SkeletonTable /> : (
            <table className="data-table">
              <thead><tr>
                <th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th>
              </tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td><span style={{fontWeight:600,color:'var(--primary)'}}>{o.id}</span></td>
                    <td>{o.customer}</td>
                    <td>{o.items} item{o.items>1?'s':''}</td>
                    <td><strong>${parseFloat(o.amount).toFixed(2)}</strong></td>
                    <td><span className={`badge ${STATUS_BADGE[o.status]||'badge-gray'}`}>{o.status}</span></td>
                    <td style={{color:'var(--text-muted)'}}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Order"
        footer={<>
          <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}>Create Order</button>
        </>}
      >
        <div className="form-group">
          <label className="form-label">Customer Name</label>
          <input className="form-input" value={form.customer} onChange={e => setForm(f=>({...f,customer:e.target.value}))} placeholder="Enter customer name" />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input className="form-input" type="number" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} placeholder="0.00" />
          </div>
          <div className="form-group">
            <label className="form-label">Items</label>
            <input className="form-input" type="number" min="1" value={form.items} onChange={e => setForm(f=>({...f,items:e.target.value}))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select className="form-select" value={form.payment} onChange={e => setForm(f=>({...f,payment:e.target.value}))}>
            <option>Credit Card</option>
            <option>PayPal</option>
            <option>Bank Transfer</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
