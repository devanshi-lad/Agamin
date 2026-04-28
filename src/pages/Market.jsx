import { motion } from 'framer-motion';
import { Star, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Market = () => {
  const cryptos = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: '$64,231.50', h1: '+0.2%', h24: '+1.4%', d7: '-2.1%', marketCap: '$1,265.4B', volume: '$32.1B', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: '$3,421.12', h1: '-0.1%', h24: '+2.8%', d7: '+4.5%', marketCap: '$410.2B', volume: '$14.5B', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { id: 3, name: 'Solana', symbol: 'SOL', price: '$145.82', h1: '-1.2%', h24: '-4.3%', d7: '+12.4%', marketCap: '$64.8B', volume: '$4.2B', image: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    { id: 4, name: 'BNB', symbol: 'BNB', price: '$584.22', h1: '+0.5%', h24: '-0.2%', d7: '-1.1%', marketCap: '$86.1B', volume: '$1.8B', image: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    { id: 5, name: 'XRP', symbol: 'XRP', price: '$0.52', h1: '+0.1%', h24: '+0.5%', d7: '-0.2%', marketCap: '$28.1B', volume: '$0.8B', image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
    { id: 6, name: 'Cardano', symbol: 'ADA', price: '$0.45', h1: '-0.2%', h24: '+1.2%', d7: '-4.1%', marketCap: '$15.8B', volume: '$0.4B', image: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  ];

  return (
    <div className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-headline text-5xl font-extrabold tracking-tight text-primary mb-4"
        >
          Market Ecosystem
        </motion.h1>
        <p className="text-[#705953] text-lg max-w-2xl leading-relaxed font-body">
          Explore the ethereal movements of our curated digital vault. Real-time insights for the discerning investor.
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button className="px-6 py-2.5 rounded-full bg-primary text-white font-medium text-sm transition-all hover:scale-105">All</button>
        {['DeFi', 'Layer 1', 'Layer 2', 'Metaverse', 'Meme', 'Stablecoins'].map(filter => (
          <button key={filter} className="px-6 py-2.5 rounded-full bg-white/50 text-primary font-medium text-sm hover:bg-white transition-all border border-[#556069]/5">
            {filter}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 text-primary font-bold">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-[#556069]/5 overflow-hidden shadow-2xl shadow-[#556069]/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#556069]/5 text-[#556069]/70 font-semibold text-xs uppercase tracking-wider">
                <th className="py-6 px-8"><Star size={14} /></th>
                <th className="py-6 px-4">#</th>
                <th className="py-6 px-4 min-w-[200px]">Coin Name</th>
                <th className="py-6 px-4">Price (USD)</th>
                <th className="py-6 px-4">1h%</th>
                <th className="py-6 px-4">24h%</th>
                <th className="py-6 px-4">7d%</th>
                <th className="py-6 px-4 text-right">Market Cap</th>
                <th className="py-6 px-4 text-right">Volume (24h)</th>
                <th className="py-6 px-8 text-center">Chart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#556069]/5 text-sm font-body">
              {cryptos.map((coin, index) => (
                <motion.tr 
                  key={coin.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/50 transition-colors group cursor-pointer"
                >
                  <td className="py-6 px-8">
                    <Star size={16} className="text-[#556069]/20 group-hover:text-[#705953] transition-colors" />
                  </td>
                  <td className="py-6 px-4 font-medium text-[#705953]">{coin.id}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#556069]/5 p-2 flex items-center justify-center">
                        <img src={coin.image} alt={coin.symbol} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="font-bold text-primary block leading-tight hover:underline">
                          <Link to={`/bitcoin`}>{coin.name}</Link>
                        </span>
                        <span className="text-[#705953] text-xs font-medium uppercase">{coin.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4 font-bold text-[#556069]">{coin.price}</td>
                  <PriceChange val={coin.h1} />
                  <PriceChange val={coin.h24} />
                  <PriceChange val={coin.d7} />
                  <td className="py-6 px-4 text-right font-medium text-[#556069]">{coin.marketCap}</td>
                  <td className="py-6 px-4 text-right font-medium text-[#556069]">{coin.volume}</td>
                  <td className="py-6 px-8">
                    <div className="w-24 h-10 mx-auto bg-[#556069]/5 rounded-lg overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-[#556069]/5 flex items-center justify-between">
          <span className="text-[#705953]/60 text-sm">Showing 12 of 10,000+ cryptos</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white rounded-xl border border-[#556069]/5 text-sm font-bold text-[#556069] hover:bg-[#556069]/5">Previous</button>
            <button className="px-4 py-2 bg-white rounded-xl border border-[#556069]/5 text-sm font-bold text-[#556069] hover:bg-[#556069]/5">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceChange = ({ val }) => {
  const isUp = val.startsWith('+');
  return (
    <td className={`py-6 px-4 font-bold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
      <div className="flex items-center gap-1">
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {val}
      </div>
    </td>
  );
};

export default Market;
