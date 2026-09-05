import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchLedger } from '../api/ledger';
import { formatAmount, formatTimestamp } from './LedgerPage';

function TransactionDetailsPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: '', transaction: null });

  useEffect(() => {
    const controller = new AbortController();
    fetchLedger(controller.signal).then((transactions) => {
      const transaction = transactions.find((item) => item.id === transactionId);
      setState({ loading: false, error: transaction ? '' : 'Transaction not found.', transaction });
    }).catch((error) => {
      if (error.name !== 'AbortError') setState({ loading: false, error: error.message, transaction: null });
    });
    return () => controller.abort();
  }, [transactionId]);

  const handleLogout = () => {
    localStorage.removeItem('ledgerguard.jwt');
    navigate('/login');
  };
  const transaction = state.transaction;

  return (
    <div className="ledger-shell">
      <header className="ledger-header">
        <div className="brand-block compact-brand">
          <div className="brand-mark">LG</div>
          <div>
            <p className="eyebrow">Billing operations</p>
            <h1>Ledger</h1>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout} type="button">Log out</button>
      </header>

      <main className="details-content">
        <Link to="/ledger" className="back-link">&larr; Back to ledger</Link>

        {state.loading && <div className="ledger-state">Loading transaction...</div>}

        {!state.loading && state.error && (
          <div className="ledger-state error-state">
            <strong>{state.error}</strong>
            <span>Check the transaction ID and try again.</span>
          </div>
        )}

        {!state.loading && transaction && (
          <section className="details-panel">
            <div className="details-heading">
              <div>
                <p className="eyebrow">Transaction details</p>
                <h2>{transaction.id}</h2>
              </div>
              <span className={`status status-${transaction.status}`}>{transaction.status}</span>
            </div>

            <dl className="details-grid">
              <div><dt>Tenant</dt><dd>{transaction.tenant}</dd></div>
              <div><dt>Event ID</dt><dd>{transaction.eventId || 'Unavailable'}</dd></div>
              <div><dt>Amount</dt><dd>{formatAmount(transaction.amount, transaction.currency)}</dd></div>
              <div><dt>Status</dt><dd>{transaction.status}</dd></div>
              <div><dt>Timestamp</dt><dd>{formatTimestamp(transaction.timestamp)}</dd></div>
              <div className="details-full"><dt>Description</dt><dd>{transaction.description}</dd></div>
            </dl>
          </section>
        )}
      </main>
    </div>
  );
}

export default TransactionDetailsPage;