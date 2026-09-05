import { useState } from 'react';
import AppShell from '../components/AppShell';

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const token = localStorage.getItem('ledgerguard.jwt') || '';
  return <AppShell eyebrow="Account controls" title="Settings"><section className="settings-grid"><form className="settings-panel" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><p className="panel-kicker">Profile</p><h2>Personal details</h2><label htmlFor="display-name">Display name</label><input id="display-name" defaultValue="LedgerGuard operator" /><label htmlFor="email">Email</label><input id="email" type="email" placeholder="operator@example.com" /><button type="submit">Save profile</button>{saved && <span className="save-state">Profile saved locally.</span>}</form><article className="settings-panel"><p className="panel-kicker">Security</p><h2>Authentication</h2><dl className="details-grid compact-details"><div><dt>Session</dt><dd>JWT bearer session</dd></div><div><dt>Transport</dt><dd>Protected API requests</dd></div><div><dt>Credentials</dt><dd>Managed by auth service</dd></div></dl></article><article className="settings-panel settings-full"><p className="panel-kicker">Developer access</p><h2>API authentication</h2><p className="muted-copy">Your current session token is stored locally and used for protected ledger requests.</p><div className="token-box"><code>{token ? `${token.slice(0, 28)}...` : 'No active token'}</code></div></article></section></AppShell>;
}

export default SettingsPage;
