import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, MessageSquare, RefreshCw, TrendingUp, TrendingDown, Activity, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const CG_API_KEY = 'CG-XgRkwptpUH4LFa6Mub8chHXH';

// ── UTILITIES ────────────────────────────────────────────────────────────────
const fmt = (n, dec = 2) => {
  if (n == null) return '—';
  if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(dec)}T`;
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(dec)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(dec)}M`;
  if (Math.abs(n) >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  if (Math.abs(n) >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(6)}`;
};

const fmtNum = (n) => {
  if (n == null) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

// ── SUBCOMPONENTS ────────────────────────────────────────────────────────────

const CoinHeader = ({ coin, md, price, change24h, isUp }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-[#556069]/10 pb-10">
    <div className="flex items-center gap-5">
      <div className="w-20 h-20 rounded-[1.5rem] bg-white/60 border border-[#556069]/10 shadow-lg flex items-center justify-center p-3">
        {coin?.image?.large && (
          <img src={coin.image.large} alt={coin.name} className="w-full h-full object-contain" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#556069] font-headline">{coin?.name}</h1>
          <span className="bg-[#556069]/10 text-[#556069] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            #{md?.market_cap_rank}
          </span>
        </div>
        <p className="text-lg font-bold text-[#705953] uppercase tracking-widest">{coin?.symbol}</p>
      </div>
    </div>

    <div className="text-left sm:text-right">
      <p className="text-4xl md:text-5xl font-bold text-[#556069] font-headline tabular-nums">
        {fmt(price)}
      </p>
      <div className={`flex items-center gap-1 mt-2 sm:justify-end font-bold text-lg ${isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
        {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        {isUp ? '+' : ''}{change24h?.toFixed(2)}% (24h)
      </div>
    </div>
  </div>
);

const PriceCard = ({ chartData, chartLoading, chartDays, setChartDays, isUp }) => {
  const prices = chartData?.prices || [];
  
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-[#556069]/5 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between p-6 border-b border-[#556069]/5">
        <h3 className="font-bold text-[#556069] font-headline">Price Chart</h3>
        <div className="flex gap-2">
          {[
            { label: '1D', val: 1 },
            { label: '7D', val: 7 },
            { label: '30D', val: 30 },
            { label: '1Y', val: 365 },
          ].map(({ label, val }) => (
            <button
              key={val}
              onClick={() => setChartDays(val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chartDays === val
                  ? 'bg-[#556069] text-white'
                  : 'bg-[#556069]/5 text-[#556069] hover:bg-[#556069]/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative" style={{ height: 320 }}>
        {chartLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw size={24} className="text-[#556069]/30 animate-spin" />
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', padding: '24px 0 0' }}>
            <CoinChart chartData={chartData} isPositive={isUp} />
          </div>
        )}
      </div>
      {prices.length > 1 && !chartLoading && (
        <div className="flex justify-between px-6 py-3 border-t border-[#556069]/5 text-xs text-[#556069]/50 font-medium tabular-nums">
          <span>Low: {fmt(Math.min(...prices.map(p => p[1])))}</span>
          <span>High: {fmt(Math.max(...prices.map(p => p[1])))}</span>
        </div>
      )}
    </div>
  );
};

const CoinChart = ({ chartData, isPositive }) => {
  const svgRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  const prices = chartData?.prices;
  const volumes = chartData?.total_volumes;

  if (!prices || prices.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Activity size={48} className="text-[#556069]/10" />
      </div>
    );
  }

  const W = 800;
  const H = 280;
  const PAD_X = 0;
  const PAD_Y = 10;

  const vals = prices.map((p) => p[1]);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const range = maxV - minV || 1;

  const getX = (i) => PAD_X + (i / (vals.length - 1)) * (W - PAD_X * 2);
  const getY = (v) => PAD_Y + (1 - (v - minV) / range) * (H - PAD_Y * 2);

  const coords = vals.map((v, i) => `${getX(i).toFixed(2)},${getY(v).toFixed(2)}`);
  const line = `M ${coords.join(' L ')}`;
  const area = `${line} L ${getX(vals.length - 1).toFixed(2)},${H} L ${getX(0).toFixed(2)},${H} Z`;

  const color = isPositive ? '#10b981' : '#f43f5e';
  const uid = `chart-${isPositive ? 'u' : 'd'}`;

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const idx = Math.round(pct * (prices.length - 1));
    setHoverIdx(idx);
  };

  const hoveredTime = hoverIdx !== null ? prices[hoverIdx][0] : null;
  const hoveredPrice = hoverIdx !== null ? prices[hoverIdx][1] : null;
  const hoveredVol = hoverIdx !== null && volumes && volumes[hoverIdx] ? volumes[hoverIdx][1] : null;
  
  const dateParts = hoveredTime ? new Date(hoveredTime).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '';

  return (
    <div 
      className="relative w-full h-full cursor-crosshair group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
      onTouchMove={(e) => handleMouseMove(e.touches[0])}
      onTouchEnd={() => setHoverIdx(null)}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${uid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        
        {/* Interactive Hover Elements */}
        {hoverIdx !== null && (
          <g>
            <line 
              x1={getX(hoverIdx)} y1={0} x2={getX(hoverIdx)} y2={H} 
              stroke={color} strokeWidth={1} strokeDasharray="4 4" 
            />
            <circle 
              cx={getX(hoverIdx)} cy={getY(hoveredPrice)} 
              r={5} fill={color} stroke="#fff" strokeWidth={2} 
            />
          </g>
        )}
      </svg>

      {/* Hover Tooltip (HTML overlay) */}
      {hoverIdx !== null && (
        <div 
          className="absolute pointer-events-none bg-white rounded-xl shadow-xl border border-[#556069]/10 p-4 z-10 font-body transition-opacity duration-150"
          style={{
            left: `${(hoverIdx / (prices.length - 1)) * 100}%`,
            top: '20px',
            transform: `translateX(${(hoverIdx / prices.length) > 0.5 ? '-110%' : '10%'})`,
            minWidth: '220px'
          }}
        >
          <div className="text-xs font-bold text-[#556069]/60 mb-3 border-b border-[#556069]/10 pb-2">
            {dateParts}
          </div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-[#705953]">Price:</span>
            <span className="text-sm font-bold text-[#556069] tabular-nums">{fmt(hoveredPrice, 4)}</span>
          </div>
          {hoveredVol !== null && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#705953]">Vol:</span>
              <span className="text-sm font-bold text-[#556069] tabular-nums">{fmt(hoveredVol)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MarketStats = ({ md, coin }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
    <InfoBlock label="Market Cap" value={fmt(md?.market_cap?.usd)} />
    <InfoBlock label="24h Volume" value={fmt(md?.total_volume?.usd)} />
    <InfoBlock label="Circ. Supply" value={`${fmtNum(md?.circulating_supply)} ${coin?.symbol?.toUpperCase()}`} />
    <InfoBlock label="Max Supply" value={md?.max_supply ? `${fmtNum(md.max_supply)} ${coin?.symbol?.toUpperCase()}` : '∞'} />
    <InfoBlock label="ATH" value={fmt(md?.ath?.usd)} sub={`${md?.ath_change_percentage?.usd?.toFixed(1)}% from ATH`} />
    <InfoBlock label="ATL" value={fmt(md?.atl?.usd)} />
    <InfoBlock label="7d Change" value={`${(md?.price_change_percentage_7d ?? 0) >= 0 ? '+' : ''}${md?.price_change_percentage_7d?.toFixed(2) ?? '—'}%`} color={(md?.price_change_percentage_7d ?? 0) >= 0 ? '#10b981' : '#f43f5e'} />
    <InfoBlock label="30d Change" value={`${(md?.price_change_percentage_30d ?? 0) >= 0 ? '+' : ''}${md?.price_change_percentage_30d?.toFixed(2) ?? '—'}%`} color={(md?.price_change_percentage_30d ?? 0) >= 0 ? '#10b981' : '#f43f5e'} />
  </div>
);

const SentimentSection = ({ md }) => (
  <div className="bg-white/40 backdrop-blur-md rounded-3xl p-7 border border-[#556069]/5 shadow-lg">
    <h3 className="font-bold text-[#556069] text-lg mb-5 font-headline">Price Changes</h3>
    <div className="space-y-4">
      {[
        { label: '1h', val: md?.price_change_percentage_1h_in_currency?.usd },
        { label: '24h', val: md?.price_change_percentage_24h },
        { label: '7d', val: md?.price_change_percentage_7d },
        { label: '30d', val: md?.price_change_percentage_30d },
        { label: '1y', val: md?.price_change_percentage_1y },
      ].map(({ label, val }) => {
        const up = (val ?? 0) >= 0;
        const pct = Math.min(Math.abs(val ?? 0), 100);
        return (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#705953] w-6 uppercase">{label}</span>
            <div className="flex-1 h-2 bg-[#556069]/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: up ? '#10b981' : '#f43f5e',
                }}
              />
            </div>
            <span className={`text-xs font-bold w-16 text-right tabular-nums ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
              {up ? '+' : ''}{val?.toFixed(2) ?? '—'}%
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

const CoinDetail = () => {
  const { id } = useParams();

  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartDays, setChartDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoin = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
        { headers: { 'x-cg-demo-api-key': CG_API_KEY } }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const d = await res.json();
      setCoin(d);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchChart = useCallback(async (days) => {
    setChartLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
        { headers: { 'x-cg-demo-api-key': CG_API_KEY } }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const d = await res.json();
      setChartData(d);
    } catch (_) {}
    finally { setChartLoading(false); }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCoin();
    const intervalId = setInterval(fetchCoin, 30000);
    return () => clearInterval(intervalId);
  }, [fetchCoin, id]);

  useEffect(() => {
    fetchChart(chartDays);
  }, [fetchChart, chartDays, id]);

  const md = coin?.market_data;
  const price = md?.current_price?.usd;
  const change24h = md?.price_change_percentage_24h;
  const isUp = (change24h ?? 0) >= 0;

  if (loading) return <LoadingSkeleton />;
  if (error) return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto text-center">
      <p className="text-rose-500 font-bold text-lg">Failed to load coin data: {error}</p>
      <Link to="/market" className="mt-4 inline-block text-[#556069] font-bold hover:underline">
        ← Back to Market
      </Link>
    </div>
  );

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto font-body">
      <Link to="/market" className="inline-flex items-center gap-2 text-[#556069]/60 hover:text-[#556069] font-bold mb-8 transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Market
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 items-start mb-12">
        <div className="w-full lg:w-2/3 space-y-8">
          <CoinHeader coin={coin} md={md} price={price} change24h={change24h} isUp={isUp} />
          <PriceCard chartData={chartData} chartLoading={chartLoading} chartDays={chartDays} setChartDays={setChartDays} isUp={isUp} />
          <MarketStats md={md} coin={coin} />
        </div>

        <div className="w-full lg:w-1/3 space-y-6">
          {coin?.description?.en && (
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-7 border border-[#556069]/5 shadow-lg">
              <h3 className="font-bold text-[#556069] text-lg mb-4 font-headline">About {coin.name}</h3>
              <p className="text-sm text-[#605d6a] leading-relaxed line-clamp-6"
                dangerouslySetInnerHTML={{ __html: coin.description.en.split('. ').slice(0, 4).join('. ') + '.' }}
              />
            </div>
          )}

          <SentimentSection md={md} />

          {/* Links */}
          <div className="bg-[#e2dded] rounded-3xl p-7 shadow-lg">
            <h3 className="font-bold text-[#605d6a] text-lg mb-5 font-headline flex items-center gap-2">
              <Globe size={18} /> Official Links
            </h3>
            <div className="space-y-3">
              {coin?.links?.homepage?.[0] && (
                <LinkItem label="Website" href={coin.links.homepage[0]} />
              )}
              {coin?.links?.whitepaper && (
                <LinkItem label="Whitepaper" href={coin.links.whitepaper} />
              )}
              {coin?.links?.subreddit_url && (
                <LinkItem label="Reddit" href={coin.links.subreddit_url} icon={<MessageSquare size={14} />} />
              )}
              {coin?.links?.repos_url?.github?.[0] && (
                <LinkItem label="GitHub" href={coin.links.repos_url.github[0]} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MINOR UI HELPERS ─────────────────────────────────────────────────────────

const InfoBlock = ({ label, value, sub, color }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-[#556069]/5 shadow-sm"
  >
    <p className="text-[10px] font-bold text-[#705953] uppercase tracking-widest mb-1.5">{label}</p>
    <p className="font-bold text-[#556069] tabular-nums text-sm" style={color ? { color } : {}}>
      {value}
    </p>
    {sub && <p className="text-[10px] text-[#556069]/40 mt-1 font-medium">{sub}</p>}
  </motion.div>
);

const LinkItem = ({ label, href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between p-3.5 bg-white/50 rounded-2xl hover:bg-white transition-colors group"
  >
    <div className="flex items-center gap-2 text-sm font-bold text-[#605d6a]">
      {icon || <Globe size={14} />}
      {label}
    </div>
    <ExternalLink size={14} className="text-[#605d6a]/30 group-hover:text-[#556069] transition-colors" />
  </a>
);

const LoadingSkeleton = () => (
  <div className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
    <div className="h-6 w-32 bg-[#556069]/10 rounded" />
    <div className="h-16 w-64 bg-[#556069]/10 rounded-2xl" />
    <div className="h-64 w-full bg-[#556069]/5 rounded-3xl" />
    <div className="grid grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-20 bg-[#556069]/5 rounded-2xl" />
      ))}
    </div>
  </div>
);

export default CoinDetail;
