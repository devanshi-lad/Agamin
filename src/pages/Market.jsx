import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowUpRight, ArrowDownRight, Filter, RefreshCw, Wifi, WifiOff, TrendingUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const CG_API_KEY = 'CG-XgRkwptpUH4LFa6Mub8chHXH';
const REFRESH_INTERVAL = 10000; // 10 seconds

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

const formatChange = (val) => {
  if (val === null || val === undefined) return '—';
  return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
};

// Sparkline chart from 7d price data
const SparklineChart = ({ prices, isPositive }) => {
  if (!prices || prices.length === 0) return <div className="w-28 h-10 bg-[#556069]/5 rounded-lg" />;

  const data = prices.map((p, i) => ({ i, v: p }));
  const color = isPositive ? '#10b981' : '#f43f5e';

  return (
    <div className="w-28 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#grad-${isPositive ? 'up' : 'down'})`}
            dot={false}
            isAnimationActive={false}
          />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div className="bg-white text-xs px-2 py-1 rounded shadow text-[#556069] font-bold border border-[#556069]/10">
                  {formatPrice(payload[0].value)}
                </div>
              ) : null
            }
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Blinking live dot
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
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`,
        {
          headers: { 'x-cg-demo-api-key': CG_API_KEY },
        }
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
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

  // Auto-refresh every 10s
  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => fetchData(), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  // Live countdown timer
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 10 : prev - 1));
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

  const filtered = cryptos.filter((c) =>
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
          <p className="text-[#705953] text-base max-w-xl font-body">
            Real-time prices from CoinGecko — updating every 10 seconds.
          </p>
        </div>

        {/* Status bar */}
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

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#556069]/40" />
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/60 border border-[#556069]/10 rounded-xl text-sm text-[#556069] placeholder:text-[#556069]/30 focus:outline-none focus:border-[#556069]/30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
          <WifiOff size={18} className="text-rose-500 shrink-0" />
          <p className="text-rose-700 text-sm font-medium">
            Failed to fetch data: {error}. Retrying automatically...
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-[#556069]/5 overflow-hidden shadow-2xl shadow-[#556069]/5">
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#556069]/5 text-[#556069]/60 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-5 px-6"><Star size={13} /></th>
                  <th className="py-5 px-3">#</th>
                  <th className="py-5 px-4 min-w-[200px]">Coin</th>
                  <th className="py-5 px-4">Price</th>
                  <th className="py-5 px-4">1h %</th>
                  <th className="py-5 px-4">24h %</th>
                  <th className="py-5 px-4">7d %</th>
                  <th className="py-5 px-4 text-right">Market Cap</th>
                  <th className="py-5 px-4 text-right">Volume 24h</th>
                  <th className="py-5 px-6 text-center">7d Chart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#556069]/5 text-sm font-body">
                <AnimatePresence>
                  {filtered.map((coin, index) => {
                    const is24hUp = (coin.price_change_percentage_24h_in_currency ?? 0) >= 0;
                    const sparkPrices = coin.sparkline_in_7d?.price ?? [];
                    const isWatched = watchlist.has(coin.id);

                    return (
                      <motion.tr
                        key={coin.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.3 }}
                        className="hover:bg-white/60 transition-colors group cursor-pointer"
                      >
                        {/* Watchlist star */}
                        <td className="py-5 px-6">
                          <button onClick={() => toggleWatchlist(coin.id)}>
                            <Star
                              size={16}
                              className={`transition-colors ${
                                isWatched
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-[#556069]/20 group-hover:text-amber-400'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Rank */}
                        <td className="py-5 px-3 font-medium text-[#705953] text-sm">{coin.market_cap_rank}</td>

                        {/* Name */}
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={coin.image}
                              alt={coin.symbol}
                              className="w-9 h-9 rounded-full bg-white p-1 shadow-sm border border-[#556069]/5 object-contain"
                            />
                            <div>
                              <Link
                                to={`/bitcoin`}
                                className="font-bold text-[#556069] block leading-tight hover:text-primary hover:underline"
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
                        <td className="py-5 px-4 font-bold text-[#556069] tabular-nums">
                          {formatPrice(coin.current_price)}
                        </td>

                        {/* 1h */}
                        <PriceCell val={coin.price_change_percentage_1h_in_currency} />

                        {/* 24h */}
                        <PriceCell val={coin.price_change_percentage_24h_in_currency} />

                        {/* 7d */}
                        <PriceCell val={coin.price_change_percentage_7d_in_currency} />

                        {/* Market Cap */}
                        <td className="py-5 px-4 text-right font-medium text-[#556069] tabular-nums">
                          {formatLargeNum(coin.market_cap)}
                        </td>

                        {/* Volume */}
                        <td className="py-5 px-4 text-right font-medium text-[#556069] tabular-nums">
                          {formatLargeNum(coin.total_volume)}
                        </td>

                        {/* Sparkline */}
                        <td className="py-5 px-6">
                          <div className="flex justify-center">
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

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#556069]/5 flex flex-col md:flex-row items-center justify-between gap-3">
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

      {/* Watchlist hint */}
      {watchlist.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center gap-3 bg-amber-50 border border-amber-200 px-6 py-3 rounded-2xl"
        >
          <Star size={16} className="text-amber-400 fill-amber-400 shrink-0" />
          <p className="text-amber-700 text-sm font-medium">
            {watchlist.size} coin{watchlist.size > 1 ? 's' : ''} in your watchlist
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Price change cell
const PriceCell = ({ val }) => {
  const isUp = (val ?? 0) >= 0;
  return (
    <td className={`py-5 px-4 font-bold tabular-nums ${isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
      <div className="flex items-center gap-0.5">
        {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {Math.abs(val ?? 0).toFixed(2)}%
      </div>
    </td>
  );
};

// Skeleton loading state
const SkeletonTable = () => (
  <div className="p-8 space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <div className="h-5 w-5 bg-[#556069]/10 rounded animate-pulse" />
      <div className="h-4 w-48 bg-[#556069]/10 rounded animate-pulse" />
    </div>
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center gap-6 py-3">
        <div className="w-8 h-8 bg-[#556069]/10 rounded-full animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-[#556069]/10 rounded w-32 animate-pulse" />
          <div className="h-2.5 bg-[#556069]/5 rounded w-16 animate-pulse" />
        </div>
        <div className="h-3.5 bg-[#556069]/10 rounded w-20 animate-pulse" />
        <div className="h-3.5 bg-emerald-100 rounded w-14 animate-pulse" />
        <div className="h-3.5 bg-[#556069]/10 rounded w-24 animate-pulse" />
        <div className="h-8 bg-[#556069]/5 rounded-lg w-24 animate-pulse" />
      </div>
    ))}
  </div>
);

export default Market;
