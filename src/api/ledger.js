const LEDGER_ENDPOINT = '/api/ledger';

const getLedgerPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload.transactions || payload.data || payload.ledger || [];
};

export const normalizeTransaction = (transaction) => ({
  id: String(transaction.id || transaction.transactionId || transaction._id || ''),
  eventId: String(transaction.eventId || transaction.event || ''),
  tenant: transaction.tenant || transaction.tenantName || transaction.customer || 'Unknown tenant',
  amount: Number(transaction.amount || transaction.total || 0),
  currency: transaction.currency || 'USD',
  status: String(transaction.status || 'pending').toLowerCase(),
  timestamp: transaction.timestamp || transaction.createdAt || transaction.date || null,
  description: transaction.description || transaction.memo || 'Ledger transaction'
});

export async function fetchLedger(signal) {
  const response = await fetch(LEDGER_ENDPOINT, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('ledgerguard.jwt') || ''}`,
    },
    signal
  });

  if (!response.ok) {
    const error = new Error(`Ledger request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  const payload = await response.json();
  return getLedgerPayload(payload).map(normalizeTransaction).filter((transaction) => transaction.id);
}

export async function createLedgerEntry(entry) {
  const response = await fetch(LEDGER_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('ledgerguard.jwt') || ''}`,
    },
    body: JSON.stringify(entry),
  });

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.message || `Ledger request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return normalizeTransaction(payload.entry);
}