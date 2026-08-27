import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'ledgerguard.jwt';

function DashboardPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem(STORAGE_KEY) || '');
  }, []);

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
        <button className="logout-button" onClick={handleLogout} type="button">
          Log out
        </button>
      </header>

      <section className="dashboard-card">
        <Link className="dashboard-link" to="/ledger">Open billing ledger</Link>
        <h2>Authentication status</h2>
        <p>JWT is stored successfully and the user is authenticated.</p>
        <div className="token-box">
          <strong>Token:</strong>
          <code>{token || 'No token stored'}</code>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
