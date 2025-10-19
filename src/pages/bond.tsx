import { useState } from 'react';
import { BondAPI } from '../lib/useBondApi';

export default function BondPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const response = await BondAPI.getContracts();
      setContracts(response.contracts || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1 className="title">Module Bond/Escrow</h1>
        <button onClick={loadContracts} className="btn btn-primary" disabled={loading}>
          {loading ? 'Chargement...' : 'Charger les contrats'}
        </button>
      </div>
      
      <div className="card" style={{ marginTop: '24px' }}>
        <h3>Contrats Bond/Escrow</h3>
        {contracts.length > 0 ? (
          <ul className="list">
            {contracts.map((contract: any) => (
              <li key={contract.id} className="list-item">
                <div>
                  <strong>{contract.title}</strong>
                  <p className="muted">
                    Montant: {contract.totalAmount} {contract.currency}
                  </p>
                  <p className="muted">
                    Statut: {contract.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Aucun contrat trouvé. Cliquez sur "Charger les contrats" pour commencer.</p>
        )}
      </div>
    </main>
  );
}
