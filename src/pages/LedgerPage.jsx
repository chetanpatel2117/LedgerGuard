import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLedger } from '../api/ledger';

export const formatAmount = (amount, currency) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency
}).format(amount);

export const formatTimestamp = (timestamp) => timestamp
  ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp))
  : 'No timestamp';

function LedgerPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    fetchLedger(controller.signal).then((data) => {
      setTransactions(data);
      setState({ loading: false, error: '' });
    }).catch((error) => {
      if (error.name !== 'AbortError') setState({ loading: false, error: error.message });
    });
    return () => controller.abort();
  }, []);

  const filteredTransactions = useMemo(() => transactions.filter((transaction) => {
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesDate = !dateFilter || (transaction.timestamp && transaction.timestamp.startsWith(dateFilter));
    return matchesStatus && matchesDate;
  }), [dateFilter, statusFilter, transactions]);
  const statuses = [...new Set(transactions.map((transaction) => transaction.status))];

  const handleLogout = () => {
    localStorage.removeItem('ledgerguard.jwt');
    navigate('/login');
  };

  return (
    <div className="ledger-shell">
      <header className="ledger-header">
        <div className="brand-block compact-brand"><div className="brand-mark">LG</div><div><p className="eyebrow">Billing operations</p><h1>Ledger</h1></div></div>
        <nav className="page-actions" aria-label="Page navigation"><Link to="/dashboard" className="text-link">Dashboard</Link><button className="logout-button" onClick={handleLogout} type="button">Log out</button></nav>
      </header>
      <main className="ledger-content">
        <div className="ledger-intro"><div><p className="eyebrow">Transaction register</p><h2>All transactions</h2></div><span className="record-count">{filteredTransactions.length} records</span></div>
        <section className="ledger-panel" aria-label="Ledger transactions">
          <div className="ledger-toolbar">
            <label htmlFor="status-filter">Status<select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></label>
            <label htmlFor="date-filter">Date<input id="date-filter" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></label>
            {(statusFilter !== 'all' || dateFilter) && <button type="button" className="clear-filter" onClick={() => { setStatusFilter('all'); setDateFilter(''); }}>Clear filters</button>}
          </div>
          {state.loading && <div className="ledger-state">Loading ledger data...</div>}
          {!state.loading && state.error && <div className="ledger-state error-state"><strong>Unable to load the ledger.</strong><span>{state.error}</span></div>}
          {!state.loading && !state.error && filteredTransactions.length === 0 && <div className="ledger-state">No transactions match these filters.</div>}
          {!state.loading && !state.error && filteredTransactions.length > 0 && <div className="table-wrap"><table><thead><tr><th>Transaction ID</th><th>Tenant</th><th>Amount</th><th>Status</th><th>Timestamp</th><th><span className="sr-only">Details</span></th></tr></thead><tbody>{filteredTransactions.map((transaction) => <tr key={transaction.id}><td><Link className="transaction-link" to={`/ledger/${encodeURIComponent(transaction.id)}`}>{transaction.id}</Link></td><td>{transaction.tenant}</td><td className="amount-cell">{formatAmount(transaction.amount, transaction.currency)}</td><td><span className={`status status-${transaction.status}`}>{transaction.status}</span></td><td className="timestamp-cell">{formatTimestamp(transaction.timestamp)}</td><td><Link className="details-link" to={`/ledger/${encodeURIComponent(transaction.id)}`}>View</Link></td></tr>)}</tbody></table></div>}
        </section>
      </main>
    </div>
  );
}

export default LedgerPage;