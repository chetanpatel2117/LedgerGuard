import AppShell from '../components/AppShell';

const readToken = () => {
  try {
    const token = localStorage.getItem('ledgerguard.jwt');
    return token ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) : {};
  } catch {
    return {};
  }
};

function OrganizationPage() {
  const claims = readToken();
  return <AppShell eyebrow="Account scope" title="Organization"><section className="settings-grid"><article className="settings-panel"><p className="panel-kicker">Current organization</p><h2>{claims.tenantId || 'Unknown tenant'}</h2><dl className="details-grid compact-details"><div><dt>Tenant ID</dt><dd>{claims.tenantId || 'Unavailable'}</dd></div><div><dt>Role</dt><dd>{claims.role || 'user'}</dd></div><div><dt>Access</dt><dd>Authenticated</dd></div></dl></article><article className="settings-panel"><p className="panel-kicker">Database details</p><h2>Tenant-isolated storage</h2><dl className="details-grid compact-details"><div><dt>Connection scope</dt><dd>{claims.tenantId ? `Tenant ${claims.tenantId}` : 'JWT tenant scope'}</dd></div><div><dt>Ledger source</dt><dd>MongoDB tenant database</dd></div><div><dt>Security</dt><dd>Server-side tenant validation</dd></div></dl></article></section></AppShell>;
}

export default OrganizationPage;
