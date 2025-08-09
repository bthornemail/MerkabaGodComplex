import React, { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  Coins,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Flame
} from 'lucide-react';
import { AttentionToken, DPOStatistics } from '@/types';
import { wsService } from '@/services/websocket';

interface TokenExchangeProps {
  tokens: AttentionToken[];
  dpoStats: DPOStatistics | null;
}

interface ExchangeOrder {
  orderId: string;
  type: 'buy' | 'sell';
  tokenId: string;
  amount: number;
  pricePerToken: number;
  totalValue: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: Date;
  userId: string;
}

export function TokenExchangeInterface({ tokens, dpoStats }: TokenExchangeProps) {
  const [selectedToken, setSelectedToken] = useState<AttentionToken | null>(null);
  const [exchangeType, setExchangeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [pricePerToken, setPricePerToken] = useState<string>('');
  const [orders, setOrders] = useState<ExchangeOrder[]>([]);
  const [userBalance, setUserBalance] = useState<number>(1000); // Mock user balance
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock order book data
  const [orderBook, setOrderBook] = useState<{
    bids: { price: number; amount: number }[];
    asks: { price: number; amount: number }[];
  }>({
    bids: [],
    asks: []
  });

  useEffect(() => {
    // Generate mock order book for selected token
    if (selectedToken) {
      const basePrice = selectedToken.attentionValue;
      const bids = Array.from({ length: 5 }, (_, i) => ({
        price: basePrice - (i + 1) * 0.001,
        amount: Math.random() * 100 + 10
      }));
      const asks = Array.from({ length: 5 }, (_, i) => ({
        price: basePrice + (i + 1) * 0.001,
        amount: Math.random() * 100 + 10
      }));
      setOrderBook({ bids, asks });
    }
  }, [selectedToken]);

  const totalValue = selectedToken && amount && pricePerToken
    ? parseFloat(amount) * parseFloat(pricePerToken)
    : 0;

  const handleCreateOrder = async () => {
    if (!selectedToken || !amount || !pricePerToken) return;

    setIsProcessing(true);

    const order: ExchangeOrder = {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: exchangeType,
      tokenId: selectedToken.tokenId,
      amount: parseFloat(amount),
      pricePerToken: parseFloat(pricePerToken),
      totalValue,
      status: 'pending',
      timestamp: new Date(),
      userId: 'current_user'
    };

    // Send to backend
    wsService.send('create_exchange_order', order);

    // Update local state
    setOrders(prev => [order, ...prev]);

    // Clear form
    setAmount('');
    setPricePerToken('');

    setTimeout(() => setIsProcessing(false), 1000);
  };

  const TokenSelector = () => (
    <div className="space-y-3">
      <h4 className="font-medium text-white text-sm sm:text-base">Select Token</h4>
      <div className="grid grid-cols-1 gap-2 max-h-48 sm:max-h-60 overflow-y-auto">
        {tokens.map((token) => {
          const isSelected = selectedToken?.tokenId === token.tokenId;
          return (
            <button
              key={token.tokenId}
              onClick={() => setSelectedToken(token)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'border-cue-primary bg-cue-primary/20 text-white'
                  : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    <span className="font-medium">{token.tokenId}</span>
                    {token.isAlive && <Flame className="w-3 h-3 text-orange-400" />}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Gen {token.generationDepth} • Quality {(token.qualityScore * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{token.attentionValue.toFixed(4)}</div>
                  <div className="text-xs text-slate-400">ATN</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const OrderForm = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setExchangeType('buy')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            exchangeType === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setExchangeType('sell')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            exchangeType === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Sell
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cue-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Price per Token</label>
        <input
          type="number"
          step="0.0001"
          value={pricePerToken}
          onChange={(e) => setPricePerToken(e.target.value)}
          placeholder="0.0000"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cue-primary"
        />
        {selectedToken && (
          <button
            onClick={() => setPricePerToken(selectedToken.attentionValue.toString())}
            className="mt-1 text-xs text-cue-primary hover:text-cue-secondary"
          >
            Use market price ({selectedToken.attentionValue.toFixed(4)})
          </button>
        )}
      </div>

      {totalValue > 0 && (
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Total Value:</span>
            <span className="text-white font-medium">{totalValue.toFixed(4)} ATN</span>
          </div>
          {exchangeType === 'buy' && totalValue > userBalance && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Insufficient balance
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleCreateOrder}
        disabled={!selectedToken || !amount || !pricePerToken || isProcessing || (exchangeType === 'buy' && totalValue > userBalance)}
        className="w-full py-3 bg-cue-primary hover:bg-cue-primary/80 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ArrowUpDown className="w-4 h-4" />
            Place {exchangeType === 'buy' ? 'Buy' : 'Sell'} Order
          </>
        )}
      </button>
    </div>
  );

  const OrderBook = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-white">Order Book</h4>
      {selectedToken ? (
        <div className="space-y-3">
          <div>
            <h5 className="text-sm text-red-400 mb-2">Sell Orders (Asks)</h5>
            <div className="space-y-1">
              {orderBook.asks.map((ask, i) => (
                <div key={i} className="flex justify-between text-sm py-1 px-2 bg-red-500/10 rounded">
                  <span className="text-red-400">{ask.price.toFixed(4)}</span>
                  <span className="text-slate-300">{ask.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-slate-600 pt-3">
            <h5 className="text-sm text-green-400 mb-2">Buy Orders (Bids)</h5>
            <div className="space-y-1">
              {orderBook.bids.map((bid, i) => (
                <div key={i} className="flex justify-between text-sm py-1 px-2 bg-green-500/10 rounded">
                  <span className="text-green-400">{bid.price.toFixed(4)}</span>
                  <span className="text-slate-300">{bid.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Select a token to view order book</p>
        </div>
      )}
    </div>
  );

  const RecentOrders = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-white">Your Recent Orders</h4>
      {orders.length > 0 ? (
        <div className="space-y-2">
          {orders.slice(0, 5).map((order) => (
            <div key={order.orderId} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === 'filled' ? 'bg-green-400' :
                    order.status === 'cancelled' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    order.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {order.type.toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-300">{order.tokenId}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">{order.amount} @ {order.pricePerToken.toFixed(4)}</div>
                  <div className="text-xs text-slate-400">{order.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No recent orders</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Token Exchange</h3>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">Trade living knowledge-backed attention tokens</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right">
            <div className="text-sm text-slate-400">Your Balance</div>
            <div className="text-lg font-medium text-white">{userBalance.toFixed(2)} ATN</div>
          </div>
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
        </div>
      </div>

      {/* Market Overview */}
      {dpoStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xs sm:text-sm text-slate-400">Market Cap</span>
            </div>
            <div className="text-sm sm:text-xl font-bold text-white">{dpoStats.totalMarketCap.toFixed(2)} ATN</div>
          </div>
          <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xs sm:text-sm text-slate-400">Active Tokens</span>
            </div>
            <div className="text-sm sm:text-xl font-bold text-white">{dpoStats.activeTokens}</div>
          </div>
          <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <span className="text-xs sm:text-sm text-slate-400">Avg. Value</span>
            </div>
            <div className="text-sm sm:text-xl font-bold text-white">{dpoStats.averageTokenValue.toFixed(4)}</div>
          </div>
          <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-xs sm:text-sm text-slate-400">Health</span>
            </div>
            <div className="text-sm sm:text-xl font-bold text-white">{(dpoStats.systemHealth * 100).toFixed(1)}%</div>
          </div>
        </div>
      )}

      {/* Exchange Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Token Selection & Order Form */}
        <div className="lg:col-span-1 space-y-4 lg:space-y-6">
          <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <TokenSelector />
          </div>
          
          {selectedToken && (
            <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <h4 className="font-medium text-white mb-4">Place Order</h4>
              <OrderForm />
            </div>
          )}
        </div>

        {/* Order Book */}
        <div className="lg:col-span-1">
          <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 h-fit">
            <OrderBook />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-1">
          <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 h-fit">
            <RecentOrders />
          </div>
        </div>
      </div>
    </div>
  );
}