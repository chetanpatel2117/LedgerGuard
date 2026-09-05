import { Link, useLocation, useNavigate } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/ledger', label: 'Billing ledger' },
  { to: '/organization', label: 'Organization' },
  { to: '/settings', label: 'Settings' },
];

function AppShell({ eyebrow, title, actions, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ledgerguard.jwt');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="shell-brand" to="/dashboard">
          <span className="brand-mark">LG</span>
          <span>LedgerGuard</span>
        </Link>
        <nav className="shell-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link className={location.pathname.startsWith(link.to) ? 'active' : ''} key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button className="logout-button" onClick={handleLogout} type="button">Log out</button>
      </header>
      <main className="shell-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}

export default AppShell;
