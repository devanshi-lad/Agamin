import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowUpRight, ArrowDownRight, RefreshCw, WifiOff, Search, Cloud, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const CG_API_KEY = 'CG-XgRkwptpUH4LFa6Mub8chHXH';
const REFRESH_INTERVAL = 10000;

const formatPrice = (price) => {
  if (price === null || price === undefined) return '—';
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
};

const formatLargeNum = (num) => {
  if (!num) return '—';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

// ── Pure SVG sparkline ───────────────────────────────────────────────────────
const SparklineChart = ({ prices, isPositive }) => {
  const W = 120;
  const H = 40;
  const PAD = 3;
  const color = isPositive ? '#10b981' : '#f43f5e';
  const bg = isPositive ? 'rgba(236,253,245,0.7)' : 'rgba(255,241,242,0.7)';

  if (!prices || prices.length < 2) {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <rect width={W} height={H} rx={8} fill={bg} />
        <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2}
          stroke={color} strokeWidth={1.5} strokeDasharray="4 3" strokeOpacity={0.4} />
      </svg>
    );
  }

  const step = Math.max(1, Math.floor(prices.length / 50));
  const pts = prices.filter((_, i) => i % step === 0);

  const minV = Math.min(...pts);
  const maxV = Math.max(...pts);
  const range = maxV - minV || 1;

  const x = (i) => (PAD + (i / (pts.length - 1)) * (W - PAD * 2)).toFixed(2);
  const y = (v) => (PAD + (1 - (v - minV) / range) * (H - PAD * 2)).toFixed(2);

  const coords = pts.map((v, i) => `${x(i)},${y(v)}`);
  const line = `M ${coords.join(' L ')}`;
  const area = `${line} L ${x(pts.length - 1)},${H} L ${x(0)},${H} Z`;
  const uid = `sg${isPositive ? 'u' : 'd'}${(Math.random() * 1e6 | 0)}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} rx={8} fill={bg} />
      <path d={area} fill={`url(#${uid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])}
        r={3} fill={color} stroke="white" strokeWidth={1.5}
      />
    </svg>
  );
};

const LiveDot = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
  </span>
);

const FILTERS = ['All', 'DeFi', 'Layer 1', 'Layer 2', 'Metaverse', 'Meme', 'Stablecoins'];

const Market = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [online, setOnline] = useState(true);
  const [watchlist, setWatchlist] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [syncing, setSyncing] = useState(false);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const { user, token, BACKEND_URL } = useAuth();

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const ids = "aave,cardano,avalanche-2,binancecoin,bitcoin,polkadot,ethereum,litecoin,pepe,matic-network,shiba-inu,solana,sui,tron,uniswap,ripple";
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=1h%2C24h%2C7d`,
        { headers: { 'x-cg-demo-api-key': CG_API_KEY } }
      );
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setCryptos(data);
      setLastUpdated(new Date());
      setError(null);
      setOnline(true);
    } catch (err) {
      setError(err.message);
      setOnline(false);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setCountdown(10);
    }
  }, []);

  // Sync user's watchlist from DB on load
  useEffect(() => {
    if (user && user.bookmarks) {
      setWatchlist(new Set(user.bookmarks));
    }
  }, [user]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => fetchData(), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((p) => (p <= 1 ? 10 : p - 1));
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, []);

  const toggleWatchlist = (id) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const saveToCloud = async () => {
    if (!user) return alert("Please login first to sync your watchlist!");
    setSyncing(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/save`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookmarks: Array.from(watchlist), alerts: [] })
      });

      if (response.ok) {
        alert("✅ Success! Watchlist synced to your Cloud Account.");
      } else {
        alert("❌ Sync failed. Session might have expired.");
      }
    } catch (error) {
      console.error(error);
      alert("Error: Could not connect to backend server.");
    } finally {
      setSyncing(false);
    }
  };

  const filtered = cryptos.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-[#556069]"
          >
            Live Market
          </motion.h1>
          <p className="text-[#705953] text-base max-w-xl">
            Real-time prices from CoinGecko — auto-refresh every 10 s.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {online ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
              <LiveDot />
              <span className="text-emerald-700 text-xs font-bold">
                LIVE — refreshing in {countdown}s
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-4 py-2 rounded-full">
              <WifiOff size={14} className="text-rose-500" />
              <span className="text-rose-700 text-xs font-bold">Offline</span>
            </div>
          )}
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-[#556069] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#3e4851] transition-all disabled:opacity-50"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Cloud Sync Section - Only visible when logged in */}
      <AnimatePresence>
        {user && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-600 p-6 rounded-3xl mb-8 shadow-xl shadow-blue-200 border border-blue-400 flex flex-col md:flex-row justify-between items-center gap-4 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Cloud className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Cloud Watchlist Sync</h3>
                <p className="text-blue-100 text-sm">Saving to account: <span className="font-bold underline">{user.username}</span></p>
              </div>
            </div>
            
            <button 
              onClick={saveToCloud}
              disabled={syncing}
              className="px-8 py-3 bg-white text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg disabled:opacity-70"
            >
              {syncing ? <Loader2 className="animate-spin" size={18} /> : "☁️ Sync to Cloud Now"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!user && (
        <div className="bg-amber-50 p-6 rounded-3xl mb-8 border border-amber-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <User className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="text-amber-900 font-bold">Sync disabled</h3>
              <p className="text-amber-700/70 text-sm">Login to save your watchlist across devices.</p>
            </div>
          </div>
          <Link to="/login" className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all shadow-md">
            Login to Sync
          </Link>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative max-w-sm w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#556069]/40" />
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/60 border border-[#556069]/10 rounded-xl text-sm text-[#556069] placeholder:text-[#556069]/30 focus:outline-none focus:border-[#556069]/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                activeFilter === f
                  ? 'bg-[#556069] text-white shadow-md shadow-[#556069]/20'
                  : 'bg-white/50 text-[#556069] border border-[#556069]/10 hover:bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
          <WifiOff size={18} className="text-rose-500 shrink-0" />
          <p className="text-rose-700 text-sm font-medium">
            Could not fetch: {error}. Retrying automatically…
          </p>
        </div>
      )}

      {/* Table card */}
      <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-[#556069]/5 overflow-hidden shadow-2xl shadow-[#556069]/5">
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#556069]/5 text-[#556069]/60 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-5 px-5">
                    <Star size={13} />
                  </th>
                  <th className="py-5 px-3">#</th>
                  <th className="py-5 px-4" style={{ minWidth: 200 }}>Coin</th>
                  <th className="py-5 px-4">Price</th>
                  <th className="py-5 px-4">1h %</th>
                  <th className="py-5 px-4">24h %</th>
                  <th className="py-5 px-4">7d %</th>
                  <th className="py-5 px-4 text-right">Market Cap</th>
                  <th className="py-5 px-4 text-right">Vol 24h</th>
                  <th className="py-5 px-5 text-center" style={{ minWidth: 140 }}>7d Chart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#556069]/5 text-sm">
                <AnimatePresence>
                  {filtered.map((coin, idx) => {
                    const is24hUp = (coin.price_change_percentage_24h_in_currency ?? 0) >= 0;
                    const sparkPrices = coin.sparkline_in_7d?.price ?? [];
                    const isWatched = watchlist.has(coin.id);
                    return (
                      <motion.tr
                        key={coin.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.025, duration: 0.25 }}
                        className="hover:bg-white/70 transition-colors group cursor-pointer"
                      >
                        {/* Star */}
                        <td className="py-4 px-5">
                          <button onClick={() => toggleWatchlist(coin.id)}>
                            <Star
                              size={15}
                              className={`transition-colors ${
                                isWatched
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-[#556069]/20 group-hover:text-amber-400'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Rank */}
                        <td className="py-4 px-3 font-medium text-[#705953] text-sm">
                          {coin.market_cap_rank}
                        </td>

                        {/* Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={coin.image}
                              alt={coin.symbol}
                              width={36} height={36}
                              className="rounded-full bg-white p-0.5 shadow-sm border border-[#556069]/5 object-contain"
                            />
                            <div>
                              <Link
                                to={`/coin/${coin.id}`}
                                className="font-bold text-[#556069] block leading-tight hover:underline"
                              >
                                {coin.name}
                              </Link>
                              <span className="text-[#705953] text-[11px] font-semibold uppercase tracking-wide">
                                {coin.symbol}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 font-bold text-[#556069] tabular-nums whitespace-nowrap">
                          {formatPrice(coin.current_price)}
                        </td>

                        {/* 1h / 24h / 7d */}
                        <PriceCell val={coin.price_change_percentage_1h_in_currency} />
                        <PriceCell val={coin.price_change_percentage_24h_in_currency} />
                        <PriceCell val={coin.price_change_percentage_7d_in_currency} />

                        {/* Market Cap */}
                        <td className="py-4 px-4 text-right font-medium text-[#556069] tabular-nums whitespace-nowrap">
                          {formatLargeNum(coin.market_cap)}
                        </td>

                        {/* Volume */}
                        <td className="py-4 px-4 text-right font-medium text-[#556069] tabular-nums whitespace-nowrap">
                          {formatLargeNum(coin.total_volume)}
                        </td>

                        {/* Sparkline */}
                        <td className="py-4 px-5">
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <SparklineChart prices={sparkPrices} isPositive={is24hUp} />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer row */}
        <div className="px-8 py-4 border-t border-[#556069]/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-[#705953]/60 text-xs font-medium">
            Showing <span className="font-bold text-[#556069]">{filtered.length}</span> coins · Powered by CoinGecko
          </span>
          {lastUpdated && (
            <span className="text-[#556069]/40 text-xs">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Watchlist toast */}
      {watchlist.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center gap-3 bg-amber-50 border border-amber-200 px-6 py-3 rounded-2xl"
        >
          <Star size={15} className="text-amber-400 fill-amber-400 shrink-0" />
          <p className="text-amber-700 text-sm font-medium">
            {watchlist.size} coin{watchlist.size > 1 ? 's' : ''} in your watchlist
          </p>
        </motion.div>
      )}
    </div>
  );
};

// ── Price change cell ────────────────────────────────────────────────────────
const PriceCell = ({ val }) => {
  const isUp = (val ?? 0) >= 0;
  return (
    <td className={`py-4 px-4 font-bold tabular-nums ${isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
      <div className="flex items-center gap-0.5 whitespace-nowrap">
        {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {Math.abs(val ?? 0).toFixed(2)}%
      </div>
    </td>
  );
};

// ── Skeleton loader ──────────────────────────────────────────────────────────
const SkeletonTable = () => (
  <div className="p-8 space-y-5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center gap-5">
        <div className="w-9 h-9 bg-[#556069]/10 rounded-full animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-[#556069]/10 rounded w-32 animate-pulse" />
          <div className="h-2.5 bg-[#556069]/5 rounded w-16 animate-pulse" />
        </div>
        <div className="h-3.5 bg-[#556069]/10 rounded w-20 animate-pulse" />
        <div className="h-3.5 bg-emerald-100 rounded w-14 animate-pulse" />
        <div className="h-3.5 bg-[#556069]/10 rounded w-24 animate-pulse" />
        <div className="h-10 bg-[#556069]/5 rounded-lg w-28 animate-pulse" />
      </div>
    ))}
  </div>
);

export default Market;
