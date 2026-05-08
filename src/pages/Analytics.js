import React, { useState, useEffect, useCallback } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import { fetchTraffic, fetchDevices, fetchSources, fetchAnalyticsSummary } from '../api';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Analytics() {
  const { isDark } = useTheme();
  const [period,   setPeriod]   = useState('W');
  const [traffic,  setTraffic]  = useState(null);
  const [devices,  setDevices]  = useState(null);
  const [sources,  setSources]  = useState(null);
  const [summary,  setSummary]  = useState(null);
  // loading state drives setLoading calls; data-null checks handle skeleton display
  const [, setLoading] = useState(true);

  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, d, s, sum] = await Promise.all([fetchTraffic(period), fetchDevices(), fetchSources(), fetchAnalyticsSummary()]);
      setTraffic(t); setDevices(d); setSources(s); setSummary(sum);
    } catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const trafficData = traffic ? {
    labels: traffic.labels,
    datasets: [
      { label:'Visitors',    data: traffic.visitors,    backgroundColor:'rgba(37,99,235,.7)',  borderRadius:6 },
      { label:'Conversions', data: traffic.conversions, backgroundColor:'rgba(16,185,129,.7)', borderRadius:6 },
    ],
  } : null;

  const devicesData = devices ? {
    labels: devices.labels,
    datasets: [{ data: devices.data, backgroundColor:['#2563eb','#10b981','#f59e0b'], borderWidth:0 }],
  } : null;

  const sourcesData = sources ? {
    labels: sources.labels,
    datasets: [{ data: sources.data, backgroundColor:['#2563eb','#8b5cf6','#10b981','#f59e0b','#0284c7'], borderWidth:0, hoverOffset:6 }],
  } : null;

  const legendLabels = { color: tickColor, usePointStyle:true, font:{family:'Inter',size:12} };
  const tooltipOpts  = { backgroundColor:'rgba(15,23,42,.9)', padding:12, cornerRadius:8 };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Advanced Analytics</h2>
          <p className="page-subtitle">Deep insights into your store performance</p>
        </div>
        <div className="filter-tabs">
          {['D','W','M'].map(p => (
            <button key={p} className={`filter-tab${period===p?' active':''}`} onClick={() => setPeriod(p)}>
              {p==='D'?'Daily':p==='W'?'Weekly':'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="stats-row">
        {[
          { icon:'📈', val:`$${(summary?.avgMonthlyRevenue||0).toLocaleString()}`, lbl:'Avg Monthly Revenue', bg:'rgba(37,99,235,.1)' },
          { icon:'⚡', val:`${summary?.avgLoadTime||0}ms`,  lbl:'Avg Load Time',      bg:'rgba(16,185,129,.1)' },
          { icon:'🔁', val:`${summary?.returnRate||0}%`,    lbl:'Return Rate',         bg:'rgba(139,92,246,.1)' },
        ].map(s => (
          <div key={s.lbl} className="card" style={{display:'flex',alignItems:'center',gap:14,padding:16}}>
            <div style={{width:44,height:44,borderRadius:12,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{s.icon}</div>
            <div>
              <div style={{fontSize:20,fontWeight:700,fontFamily:'Poppins,sans-serif'}}>{s.val}</div>
              <div style={{fontSize:12,color:'var(--text-muted)'}}>{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card full">
          <div className="chart-title" style={{marginBottom:20}}>Traffic & Conversions</div>
          <div style={{height:260}}>
            {trafficData ? (
              <Bar data={trafficData} options={{
                responsive:true, maintainAspectRatio:false,
                plugins:{ legend:{ labels: legendLabels }, tooltip: tooltipOpts },
                scales:{
                  x:{ grid:{display:false}, ticks:{color:tickColor,font:{family:'Inter'}} },
                  y:{ grid:{color:gridColor}, ticks:{color:tickColor,font:{family:'Inter'}} },
                },
              }} />
            ) : <div style={{height:260}} className="skeleton" />}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title" style={{marginBottom:16}}>Device Breakdown</div>
          <div style={{height:220}}>
            {devicesData ? (
              <Pie data={devicesData} options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels: legendLabels }, tooltip: tooltipOpts } }} />
            ) : <div style={{height:220}} className="skeleton" />}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title" style={{marginBottom:16}}>Revenue Sources</div>
          <div style={{height:220}}>
            {sourcesData ? (
              <Doughnut data={sourcesData} options={{ responsive:true, maintainAspectRatio:false, cutout:'65%', plugins:{ legend:{ position:'bottom', labels: legendLabels }, tooltip: tooltipOpts } }} />
            ) : <div style={{height:220}} className="skeleton" />}
          </div>
        </div>
      </div>
    </div>
  );
}
