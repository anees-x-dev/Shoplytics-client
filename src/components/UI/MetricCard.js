import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './MetricCard.css';

function useCounter(target, duration = 1800) {
  const el = useRef(null);
  useEffect(() => {
    if (!el.current || target == null) return;
    let startTime = null;
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = Math.min((ts - startTime) / duration, 1);
      const val = Math.floor(easeOut(elapsed) * parseFloat(target));
      if (el.current) el.current.textContent = val.toLocaleString();
      if (elapsed < 1) requestAnimationFrame(step);
      else if (el.current) el.current.textContent = parseFloat(target).toLocaleString();
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return el;
}

export default function MetricCard({ label, value, prefix = '', suffix = '', trend, color, icon, iconBg }) {
  const counterRef = useCounter(value);
  const isUp = trend >= 0;

  return (
    <motion.div
      className="metric-card"
      style={{ '--card-color': color, '--icon-bg': iconBg }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: .3 }}
    >
      <div className="mc-top">
        <span className="mc-label">{label}</span>
        <div className="mc-icon">{icon}</div>
      </div>
      <div className="mc-value">
        {prefix}<span ref={counterRef}>0</span>{suffix}
      </div>
      <div className={`mc-trend ${isUp ? 'up' : 'down'}`}>
        {isUp ? '▲' : '▼'} {Math.abs(trend)}%
        <span className="mc-trend-label"> vs last month</span>
      </div>
    </motion.div>
  );
}
