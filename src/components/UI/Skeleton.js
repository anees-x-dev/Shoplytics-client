import React from 'react';

export default function Skeleton({ width = '100%', height = 20, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 6, ...style }}
    />
  );
}

export function SkeletonMetrics() {
  return (
    <div className="metrics-grid">
      {[1,2,3,4].map(i => (
        <div key={i} className="card" style={{ padding: 20 }}>
          <Skeleton height={12} width="60%" style={{ marginBottom: 16 }} />
          <Skeleton height={32} width="50%" style={{ marginBottom: 12 }} />
          <Skeleton height={10} width="70%" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div style={{ padding: '0 20px 20px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display:'flex', gap:16, padding:'14px 0', borderBottom:'1px solid var(--border)' }}>
          <Skeleton width={80}  height={14} />
          <Skeleton width={120} height={14} />
          <Skeleton width={80}  height={14} />
          <Skeleton width={60}  height={20} />
        </div>
      ))}
    </div>
  );
}
