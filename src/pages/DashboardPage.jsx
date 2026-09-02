import { useEffect, useMemo, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Link, useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const STORAGE_KEY = 'ledgerguard.jwt';

const defaultAnalytics = {
  summary: {
    totalUsage: '0h',
    monthlySpend: '$0',
    activeResources: 0,
    utilization: '0%',
  },
  usageOverTime: { labels: [], values: [] },
  resourceConsumption: { labels: [], values: [] },
  costDistribution: { labels: [], values: [] },
};

const chartPalette = {
  line: '#7dd3fc',
  fill: 'rgba(125, 211, 252, 0.18)',
  bar: '#8b5cf6',
  barAlt: '#38bdf8',
  doughnut: ['#38bdf8', '#8b5cf6', '#34d399', '#fbbf24'],
};

function DashboardPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/analytics', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Analytics request failed (${response.status}).`);
        }

        const payload = await response.json();
        setAnalytics({ ...defaultAnalytics, ...payload });
      } catch (caughtError) {
        if (caughtError.name === 'AbortError') {
          return;
        }

        setError(caughtError.message || 'Unable to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    return () => controller.abort();
  }, []);

  const lineChartData = useMemo(() => ({
    labels: analytics.usageOverTime.labels,
    datasets: [{
      label: 'Usage over time',
      data: analytics.usageOverTime.values,
      borderColor: chartPalette.line,
      backgroundColor: chartPalette.fill,
      pointBackgroundColor: chartPalette.line,
      pointBorderColor: '#f8fafc',
      pointRadius: 4,
      fill: true,
      tension: 0.35,
    }],
  }), [analytics.usageOverTime]);

  const barChartData = useMemo(() => ({
    labels: analytics.resourceConsumption.labels,
    datasets: [{
      label: 'Resource usage',
      data: analytics.resourceConsumption.values,
      backgroundColor: [chartPalette.barAlt, chartPalette.bar, '#22c55e', '#f97316', '#f43f5e'],
      borderRadius: 10,
    }],
  }), [analytics.resourceConsumption]);

  const doughnutChartData = useMemo(() => ({
    labels: analytics.costDistribution.labels,
    datasets: [{
      label: 'Cost distribution',
      data: analytics.costDistribution.values,
      backgroundColor: chartPalette.doughnut,
      borderWidth: 0,
    }],
  }), [analytics.costDistribution]);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate('/login');
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <div className="page-actions">
          <Link className="text-link" to="/ledger">Open billing ledger</Link>
          <button className="logout-button" onClick={handleLogout} type="button">
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-summary-grid" aria-label="Dashboard summary metrics">
        <article className="summary-card">
          <span>Total usage</span>
          <strong>{analytics.summary.totalUsage}</strong>
        </article>
        <article className="summary-card">
          <span>Monthly spend</span>
          <strong>{analytics.summary.monthlySpend}</strong>
        </article>
        <article className="summary-card">
          <span>Active resources</span>
          <strong>{analytics.summary.activeResources}</strong>
        </article>
        <article className="summary-card">
          <span>Utilization</span>
          <strong>{analytics.summary.utilization}</strong>
        </article>
      </section>

      {error && <div className="dashboard-error">{error}</div>}

      <section className="dashboard-grid">
        <article className="dashboard-panel chart-panel">
          <div className="panel-header">
            <h2>Usage over time</h2>
          </div>
          {loading ? (
            <div className="chart-placeholder">Loading chart…</div>
          ) : (
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: false, grid: { color: 'rgba(148, 163, 184, 0.15)' }, ticks: { color: '#cbd5e1' } },
                  x: { grid: { display: false }, ticks: { color: '#cbd5e1' } },
                },
              }}
            />
          )}
        </article>

        <article className="dashboard-panel chart-panel">
          <div className="panel-header">
            <h2>Resource consumption</h2>
          </div>
          {loading ? (
            <div className="chart-placeholder">Loading chart…</div>
          ) : (
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' }, ticks: { color: '#cbd5e1' } },
                  x: { grid: { display: false }, ticks: { color: '#cbd5e1' } },
                },
              }}
            />
          )}
        </article>

        <article className="dashboard-panel chart-panel doughnut-panel">
          <div className="panel-header">
            <h2>Cost distribution</h2>
          </div>
          {loading ? (
            <div className="chart-placeholder">Loading chart…</div>
          ) : (
            <Doughnut
              data={doughnutChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true, boxWidth: 10 } } },
                cutout: '60%',
              }}
            />
          )}
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;
