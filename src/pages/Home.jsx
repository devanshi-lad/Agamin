import { motion } from 'framer-motion';
import { Search, TrendingUp, BarChart3, PieChart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TickerItem = ({ symbol, price, change }) => (
  <span className="flex items-center gap-2 text-sm font-medium text-tertiary mx-6">
    {symbol} <span className="text-on-surface">{price}</span> 
    <span className={change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}>{change}</span>
  </span>
);

const Home = () => {
  const tickerData = [
    { symbol: 'BTC', price: '$64,231.40', change: '+1.24%' },
    { symbol: 'ETH', price: '$3,452.12', change: '-0.45%' },
    { symbol: 'SOL', price: '$142.88', change: '+4.12%' },
    { symbol: 'ADA', price: '$0.45', change: '-2.10%' },
    { symbol: 'DOT', price: '$7.21', change: '+0.88%' },
    { symbol: 'LINK', price: '$18.44', change: '+5.54%' },
    { symbol: 'MATIC', price: '$0.68', change: '-1.15%' },
  ];

  return (
    <div className="pt-20">
      {/* Scrolling Ticker */}
      <div className="w-full overflow-hidden bg-surface-container-low py-3 border-b border-[#556069]/10">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...tickerData, ...tickerData].map((item, idx) => (
            <TickerItem key={idx} {...item} />
          ))}
        </motion.div>
      </div>

      {/* Hero Section */}
      <main className="relative mesh-gradient min-h-[80vh] flex flex-col items-center justify-center px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-primary leading-tight">
            Track Every Coin. <br />
            <span className="text-tertiary italic">Trade with Confidence.</span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-[#605d6a] max-w-2xl mx-auto leading-relaxed">
            Real-time prices, market data, and portfolio tools for the digital era.
          </p>

          {/* Central Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto mt-12 group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-[#556069]/40" size={24} />
            </div>
            <input 
              type="text"
              placeholder="Search for a crypto (e.g. BTC, ETH, SOL)..."
              className="w-full bg-white/60 backdrop-blur-md border-2 border-[#556069]/5 h-16 pl-16 pr-6 rounded-2xl text-lg text-on-surface placeholder:text-[#556069]/40 transition-all duration-300 focus:ring-0 focus:border-[#556069]/20 shadow-xl shadow-[#556069]/5"
            />
          </div>
        </motion.div>

        {/* Key Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mt-24 px-4">
          <StatCard title="Total Market Cap" value="$2.48T" change="+2.4%" icon={<TrendingUp />} />
          <StatCard title="24h Trading Volume" value="$84.2B" change="-1.1%" icon={<BarChart3 />} color="rose" />
          <StatCard title="BTC Dominance" value="52.4%" change="+0.8%" icon={<PieChart />} />
        </div>
      </main>

      {/* Market Pulse Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Market Pulse</h2>
            <p className="text-tertiary mt-2">Curated data points for the modern trader.</p>
          </div>
          <Link to="/market" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            View all markets <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-white/40 backdrop-blur-sm border border-[#556069]/5 rounded-3xl p-10 flex flex-col md:flex-row gap-12 items-center shadow-lg shadow-[#556069]/5"
          >
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="font-headline text-2xl font-bold text-primary">Advanced Algorithm Predictions</h3>
              <p className="text-[#605d6a] leading-relaxed">
                Leverage our state-of-the-art predictive models to anticipate market movements for the top cryptocurrencies.
              </p>
              <Link to="/prediction" className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                Read Analysis
              </Link>
            </div>
            <div className="w-full md:w-1/2 aspect-video bg-[#c5d0db]/20 rounded-2xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800" alt="Crypto Vision" className="w-full h-full object-cover mix-blend-overlay opacity-60" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-[#e6c8bf] rounded-3xl p-10 flex flex-col justify-between shadow-lg shadow-[#705953]/10"
          >
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 text-[#705953] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Trending</span>
              <h3 className="font-headline text-xl font-bold text-[#705953]">Top Gainer: PEPE</h3>
            </div>
            <div className="mt-8">
              <span className="text-4xl font-extrabold text-[#705953]">+45.2%</span>
              <p className="text-[#705953]/70 mt-1">Movement in last 24h</p>
            </div>
            <div className="mt-8 h-20 w-full bg-[#705953]/10 rounded-xl"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, color = 'emerald' }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/40 backdrop-blur-sm border border-[#556069]/5 p-8 rounded-3xl relative overflow-hidden group shadow-lg shadow-[#556069]/5"
  >
    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
      <span className="text-sm font-semibold uppercase tracking-widest text-[#705953]">{title}</span>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-primary font-headline tracking-tight">{value}</span>
        <div className="flex flex-col items-end">
          <span className={`text-${color}-600 text-sm font-bold`}>{change}</span>
        </div>
      </div>
    </div>
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
  </motion.div>
);

export default Home;
