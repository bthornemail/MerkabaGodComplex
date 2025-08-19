import React, { useState, useCallback } from 'react';
import { useQuantumNetwork } from '../hooks/useQuantumNetwork';

interface ClassifiedAd {
  id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  currency?: string;
  vectorPath: number[];
  timestamp: number;
  author: string;
}

interface MarketplaceOffer {
  id: string;
  type: 'buy' | 'sell' | 'trade';
  item: string;
  quantity: number;
  price: number;
  currency: string;
  vectorPath: number[];
  timestamp: number;
  delegated?: boolean;
}

interface Delegation {
  id: string;
  task: string;
  reward: number;
  currency: string;
  requirements: string[];
  vectorPath: number[];
  timestamp: number;
  status: 'open' | 'assigned' | 'completed';
}

export const QuantumMarketplace: React.FC = () => {
  const { connected, quantumEntangle, accessVector, logs } = useQuantumNetwork();
  const [activeTab, setActiveTab] = useState<'ads' | 'offers' | 'delegations'>('ads');
  
  const [classifiedAds, setClassifiedAds] = useState<ClassifiedAd[]>([]);
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);

  const createClassifiedAd = useCallback((ad: Omit<ClassifiedAd, 'id' | 'timestamp' | 'vectorPath'>) => {
    const vectorPath = [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)];
    const newAd: ClassifiedAd = {
      ...ad,
      id: `ad_${Date.now()}`,
      timestamp: Date.now(),
      vectorPath,
    };

    // Entangle ad to quantum network
    quantumEntangle(vectorPath, JSON.stringify(newAd), 'application/json');
    setClassifiedAds(prev => [...prev, newAd]);
  }, [quantumEntangle]);

  const createOffer = useCallback((offer: Omit<MarketplaceOffer, 'id' | 'timestamp' | 'vectorPath'>) => {
    const vectorPath = [Math.floor(Math.random() * 1000) + 1000, Math.floor(Math.random() * 1000)];
    const newOffer: MarketplaceOffer = {
      ...offer,
      id: `offer_${Date.now()}`,
      timestamp: Date.now(),
      vectorPath,
    };

    quantumEntangle(vectorPath, JSON.stringify(newOffer), 'application/json');
    setOffers(prev => [...prev, newOffer]);
  }, [quantumEntangle]);

  const createDelegation = useCallback((delegation: Omit<Delegation, 'id' | 'timestamp' | 'vectorPath' | 'status'>) => {
    const vectorPath = [Math.floor(Math.random() * 1000) + 2000, Math.floor(Math.random() * 1000)];
    const newDelegation: Delegation = {
      ...delegation,
      id: `delegation_${Date.now()}`,
      timestamp: Date.now(),
      vectorPath,
      status: 'open',
    };

    quantumEntangle(vectorPath, JSON.stringify(newDelegation), 'application/json');
    setDelegations(prev => [...prev, newDelegation]);
  }, [quantumEntangle]);

  const accessQuantumVector = useCallback((vectorPath: number[]) => {
    accessVector(vectorPath);
  }, [accessVector]);

  return (
    <div className="quantum-marketplace">
      <div className="marketplace-header">
        <h2>🌌 Quantum Marketplace</h2>
        <div className="connection-status">
          {connected ? '🟢 Quantum Network Connected' : '🔴 Disconnected'}
        </div>
      </div>

      <div className="marketplace-tabs">
        <button 
          className={`tab-button ${activeTab === 'ads' ? 'active' : ''}`}
          onClick={() => setActiveTab('ads')}
        >
          📰 Classified Ads
        </button>
        <button 
          className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          💱 Offers
        </button>
        <button 
          className={`tab-button ${activeTab === 'delegations' ? 'active' : ''}`}
          onClick={() => setActiveTab('delegations')}
        >
          🤝 Delegations
        </button>
      </div>

      <div className="marketplace-content">
        {activeTab === 'ads' && (
          <ClassifiedAdsTab 
            ads={classifiedAds} 
            createAd={createClassifiedAd}
            accessVector={accessQuantumVector}
          />
        )}
        {activeTab === 'offers' && (
          <OffersTab 
            offers={offers} 
            createOffer={createOffer}
            accessVector={accessQuantumVector}
          />
        )}
        {activeTab === 'delegations' && (
          <DelegationsTab 
            delegations={delegations} 
            createDelegation={createDelegation}
            accessVector={accessQuantumVector}
          />
        )}
      </div>

      <div className="quantum-logs">
        <h4>🔄 Quantum Operations Log</h4>
        <div className="logs-container">
          {logs.slice(-5).map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .quantum-marketplace {
          background: rgba(0, 20, 40, 0.9);
          border: 1px solid #333;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          color: white;
        }
        .marketplace-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .connection-status {
          font-size: 14px;
          padding: 5px 10px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.1);
        }
        .marketplace-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .tab-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }
        .tab-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .tab-button.active {
          background: #4CAF50;
        }
        .marketplace-content {
          min-height: 300px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .quantum-logs {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          padding: 15px;
        }
        .logs-container {
          font-family: monospace;
          font-size: 12px;
          max-height: 100px;
          overflow-y: auto;
        }
        .log-entry {
          margin: 2px 0;
          color: #aaa;
        }
      `}</style>
    </div>
  );
};

interface ClassifiedAdsTabProps {
  ads: ClassifiedAd[];
  createAd: (ad: Omit<ClassifiedAd, 'id' | 'timestamp' | 'vectorPath'>) => void;
  accessVector: (vectorPath: number[]) => void;
}

const ClassifiedAdsTab: React.FC<ClassifiedAdsTabProps> = ({ ads, createAd, accessVector }) => {
  const [showForm, setShowForm] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    category: 'general',
    price: 0,
    currency: 'USD',
    author: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAd(newAd);
    setNewAd({ title: '', description: '', category: 'general', price: 0, currency: 'USD', author: '' });
    setShowForm(false);
  };

  return (
    <div className="classified-ads">
      <div className="ads-header">
        <h3>📰 Classified Advertisements</h3>
        <button onClick={() => setShowForm(!showForm)} className="create-button">
          {showForm ? '❌ Cancel' : '➕ Post Ad'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="ad-form">
          <input
            type="text"
            placeholder="Ad title"
            value={newAd.title}
            onChange={(e) => setNewAd({...newAd, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={newAd.description}
            onChange={(e) => setNewAd({...newAd, description: e.target.value})}
            required
          />
          <select
            value={newAd.category}
            onChange={(e) => setNewAd({...newAd, category: e.target.value})}
          >
            <option value="general">General</option>
            <option value="services">Services</option>
            <option value="goods">Goods</option>
            <option value="housing">Housing</option>
            <option value="jobs">Jobs</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={newAd.price}
            onChange={(e) => setNewAd({...newAd, price: Number(e.target.value)})}
          />
          <input
            type="text"
            placeholder="Your name"
            value={newAd.author}
            onChange={(e) => setNewAd({...newAd, author: e.target.value})}
            required
          />
          <button type="submit" className="submit-button">🔮 Entangle to Quantum Network</button>
        </form>
      )}

      <div className="ads-list">
        {ads.map((ad) => (
          <div key={ad.id} className="ad-card">
            <div className="ad-header">
              <h4>{ad.title}</h4>
              <span className="ad-category">{ad.category}</span>
            </div>
            <p>{ad.description}</p>
            <div className="ad-footer">
              <span className="price">{ad.price} {ad.currency}</span>
              <span className="author">by {ad.author}</span>
              <button 
                onClick={() => accessVector(ad.vectorPath)}
                className="vector-button"
                title={`Access vector [${ad.vectorPath.join(',')}]`}
              >
                📐 [{ad.vectorPath.join(',')}]
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .ads-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .create-button {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          background: #4CAF50;
          color: white;
          cursor: pointer;
        }
        .ad-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .ad-form input, .ad-form textarea, .ad-form select {
          padding: 10px;
          border: 1px solid #444;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }
        .submit-button {
          padding: 12px;
          border: none;
          border-radius: 5px;
          background: #2196F3;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }
        .ads-list {
          display: grid;
          gap: 15px;
        }
        .ad-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 15px;
        }
        .ad-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .ad-category {
          background: #666;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 12px;
        }
        .ad-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-size: 14px;
        }
        .price {
          font-weight: bold;
          color: #4CAF50;
        }
        .vector-button {
          padding: 4px 8px;
          border: none;
          border-radius: 3px;
          background: #FF9800;
          color: white;
          cursor: pointer;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

interface OffersTabProps {
  offers: MarketplaceOffer[];
  createOffer: (offer: Omit<MarketplaceOffer, 'id' | 'timestamp' | 'vectorPath'>) => void;
  accessVector: (vectorPath: number[]) => void;
}

const OffersTab: React.FC<OffersTabProps> = ({ offers, createOffer, accessVector }) => {
  const [showForm, setShowForm] = useState(false);
  const [newOffer, setNewOffer] = useState({
    type: 'sell' as 'buy' | 'sell' | 'trade',
    item: '',
    quantity: 1,
    price: 0,
    currency: 'USD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOffer(newOffer);
    setNewOffer({ type: 'sell', item: '', quantity: 1, price: 0, currency: 'USD' });
    setShowForm(false);
  };

  return (
    <div className="offers-tab">
      <div className="offers-header">
        <h3>💱 Marketplace Offers</h3>
        <button onClick={() => setShowForm(!showForm)} className="create-button">
          {showForm ? '❌ Cancel' : '➕ Create Offer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="offer-form">
          <select
            value={newOffer.type}
            onChange={(e) => setNewOffer({...newOffer, type: e.target.value as 'buy' | 'sell' | 'trade'})}
          >
            <option value="sell">🔴 Sell</option>
            <option value="buy">🟢 Buy</option>
            <option value="trade">🔄 Trade</option>
          </select>
          <input
            type="text"
            placeholder="Item name"
            value={newOffer.item}
            onChange={(e) => setNewOffer({...newOffer, item: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            min="1"
            value={newOffer.quantity}
            onChange={(e) => setNewOffer({...newOffer, quantity: Number(e.target.value)})}
            required
          />
          <input
            type="number"
            placeholder="Price per unit"
            step="0.01"
            value={newOffer.price}
            onChange={(e) => setNewOffer({...newOffer, price: Number(e.target.value)})}
            required
          />
          <input
            type="text"
            placeholder="Currency"
            value={newOffer.currency}
            onChange={(e) => setNewOffer({...newOffer, currency: e.target.value})}
          />
          <button type="submit" className="submit-button">🔮 Entangle Offer</button>
        </form>
      )}

      <div className="offers-list">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-type">
              {offer.type === 'sell' ? '🔴' : offer.type === 'buy' ? '🟢' : '🔄'} {offer.type.toUpperCase()}
            </div>
            <h4>{offer.item}</h4>
            <div className="offer-details">
              <span>Quantity: {offer.quantity}</span>
              <span>Price: {offer.price} {offer.currency}</span>
              <span>Total: {(offer.quantity * offer.price).toFixed(2)} {offer.currency}</span>
            </div>
            <button 
              onClick={() => accessVector(offer.vectorPath)}
              className="vector-button"
              title={`Access vector [${offer.vectorPath.join(',')}]`}
            >
              📐 [{offer.vectorPath.join(',')}]
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .offers-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .create-button {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          background: #4CAF50;
          color: white;
          cursor: pointer;
        }
        .offer-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .offer-form input, .offer-form select {
          padding: 10px;
          border: 1px solid #444;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }
        .submit-button {
          padding: 12px;
          border: none;
          border-radius: 5px;
          background: #2196F3;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }
        .offers-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }
        .offer-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 15px;
        }
        .offer-type {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .offer-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin: 10px 0;
          font-size: 14px;
        }
        .vector-button {
          padding: 6px 12px;
          border: none;
          border-radius: 3px;
          background: #FF9800;
          color: white;
          cursor: pointer;
          font-size: 12px;
          width: 100%;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

interface DelegationsTabProps {
  delegations: Delegation[];
  createDelegation: (delegation: Omit<Delegation, 'id' | 'timestamp' | 'vectorPath' | 'status'>) => void;
  accessVector: (vectorPath: number[]) => void;
}

const DelegationsTab: React.FC<DelegationsTabProps> = ({ delegations, createDelegation, accessVector }) => {
  const [showForm, setShowForm] = useState(false);
  const [newDelegation, setNewDelegation] = useState({
    task: '',
    reward: 0,
    currency: 'USD',
    requirements: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDelegation({
      ...newDelegation,
      requirements: newDelegation.requirements.filter(req => req.trim())
    });
    setNewDelegation({ task: '', reward: 0, currency: 'USD', requirements: [''] });
    setShowForm(false);
  };

  const addRequirement = () => {
    setNewDelegation({
      ...newDelegation,
      requirements: [...newDelegation.requirements, '']
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...newDelegation.requirements];
    updated[index] = value;
    setNewDelegation({ ...newDelegation, requirements: updated });
  };

  return (
    <div className="delegations-tab">
      <div className="delegations-header">
        <h3>🤝 Task Delegations</h3>
        <button onClick={() => setShowForm(!showForm)} className="create-button">
          {showForm ? '❌ Cancel' : '➕ Create Delegation'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="delegation-form">
          <textarea
            placeholder="Task description"
            value={newDelegation.task}
            onChange={(e) => setNewDelegation({...newDelegation, task: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Reward amount"
            step="0.01"
            value={newDelegation.reward}
            onChange={(e) => setNewDelegation({...newDelegation, reward: Number(e.target.value)})}
            required
          />
          <input
            type="text"
            placeholder="Currency"
            value={newDelegation.currency}
            onChange={(e) => setNewDelegation({...newDelegation, currency: e.target.value})}
          />
          
          <div className="requirements-section">
            <label>Requirements:</label>
            {newDelegation.requirements.map((req, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Requirement ${index + 1}`}
                value={req}
                onChange={(e) => updateRequirement(index, e.target.value)}
              />
            ))}
            <button type="button" onClick={addRequirement} className="add-req-button">
              ➕ Add Requirement
            </button>
          </div>
          
          <button type="submit" className="submit-button">🔮 Entangle Delegation</button>
        </form>
      )}

      <div className="delegations-list">
        {delegations.map((delegation) => (
          <div key={delegation.id} className="delegation-card">
            <div className="delegation-header">
              <h4>Task Delegation</h4>
              <span className={`status ${delegation.status}`}>{delegation.status.toUpperCase()}</span>
            </div>
            <p>{delegation.task}</p>
            <div className="reward">💰 Reward: {delegation.reward} {delegation.currency}</div>
            
            {delegation.requirements.length > 0 && (
              <div className="requirements">
                <strong>Requirements:</strong>
                <ul>
                  {delegation.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              onClick={() => accessVector(delegation.vectorPath)}
              className="vector-button"
              title={`Access vector [${delegation.vectorPath.join(',')}]`}
            >
              📐 [{delegation.vectorPath.join(',')}]
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .delegations-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .create-button {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          background: #4CAF50;
          color: white;
          cursor: pointer;
        }
        .delegation-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .delegation-form input, .delegation-form textarea {
          padding: 10px;
          border: 1px solid #444;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }
        .requirements-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .add-req-button {
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          background: #666;
          color: white;
          cursor: pointer;
          align-self: flex-start;
        }
        .submit-button {
          padding: 12px;
          border: none;
          border-radius: 5px;
          background: #2196F3;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }
        .delegations-list {
          display: grid;
          gap: 20px;
        }
        .delegation-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 20px;
        }
        .delegation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .status {
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status.open {
          background: #4CAF50;
          color: white;
        }
        .status.assigned {
          background: #FF9800;
          color: white;
        }
        .status.completed {
          background: #9C27B0;
          color: white;
        }
        .reward {
          font-size: 18px;
          font-weight: bold;
          color: #4CAF50;
          margin: 15px 0;
        }
        .requirements {
          margin: 15px 0;
        }
        .requirements ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        .vector-button {
          padding: 8px 16px;
          border: none;
          border-radius: 3px;
          background: #FF9800;
          color: white;
          cursor: pointer;
          font-size: 12px;
          width: 100%;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default QuantumMarketplace;