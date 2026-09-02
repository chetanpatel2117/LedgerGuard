const LEDGER_ENDPOINT = '/api/ledger';

const getLedgerPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload.transactions || payload.data || payload.ledger || [];
};

export const normalizeTransaction = (transaction) => ({
  id: String(transaction.id || transaction.transactionId || transaction._id || ''),
  tenant: transaction.tenant || transaction.tenantName || transaction.customer || 'Unknown tenant',
  amount: Number(transaction.amount || transaction.total || 0),
  currency: transaction.currency || 'USD',
  status: String(transaction.status || 'pending').toLowerCase(),
  timestamp: transaction.timestamp || transaction.createdAt || transaction.date || null,
  description: transaction.description || transaction.memo || 'Ledger transaction'
});

export async function fetchLedger(signal) {
  const response = await fetch(LEDGER_ENDPOINT, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) throw new Error(`Ledger request failed (${response.status}).`);
  const payload = await response.json();
  return getLedgerPayload(payload).map(normalizeTransaction).filter((transaction) => transaction.id);
}