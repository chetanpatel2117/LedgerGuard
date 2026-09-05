import { useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import AppShell from '../components/AppShell';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/analytics', { headers: { Accept: 'application/json' }, signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Analytics request failed (${response.status}).`);
        return response.json();
      })
      .then(setAnalytics)
      .catch((caughtError) => {
        if (caughtError.name !== 'AbortError') setError(caughtError.message);
      });
    return () => controller.abort();
  }, []);

  const chartOptions = useMemo(() => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' }, ticks: { color: '#cbd5e1' } }, x: { grid: { display: false }, ticks: { color: '#cbd5e1' } } } }), []);
  const chartData = analytics && {
    usage: { labels: analytics.usageOverTime.labels, datasets: [{ label: 'Usage', data: analytics.usageOverTime.values, borderColor: '#7dd3fc', backgroundColor: 'rgba(125, 211, 252, 0.18)', fill: true, tension: 0.35 }] },
    resources: { labels: analytics.resourceConsumption.labels, datasets: [{ label: 'Resources', data: analytics.resourceConsumption.values, backgroundColor: ['#38bdf8', '#8b5cf6', '#22c55e', '#f97316', '#f43f5e'], borderRadius: 8 }] },
  };

  return (
    <AppShell eyebrow="Resource intelligence" title="Usage analytics">
      {error && <div className="dashboard-error">{error}</div>}
      {!analytics && !error && <div className="ledger-state">Loading analytics...</div>}
      {analytics && <><section className="dashboard-summary-grid" aria-label="Analytics summary">{Object.entries(analytics.summary).map(([label, value]) => <article className="summary-card neutral" key={label}><span>{label.replace(/([A-Z])/g, ' $1')}</span><strong>{value}</strong></article>)}</section><section className="analytics-grid"><article className="dashboard-panel chart-panel"><div className="panel-header"><p className="panel-kicker">Historical trend</p><h2>Usage over time</h2></div><div className="chart-wrap"><Line data={chartData.usage} options={chartOptions} /></div></article><article className="dashboard-panel chart-panel"><div className="panel-header"><p className="panel-kicker">Resource mix</p><h2>Consumption by resource</h2></div><div className="chart-wrap"><Bar data={chartData.resources} options={chartOptions} /></div></article></section></>}
    </AppShell>
  );
}

export default AnalyticsPage;
