import { motion } from 'framer-motion';
import { Shield, Zap, Globe, BarChart, ExternalLink, Star } from 'lucide-react';

const Exchanges = () => {
  const exchanges = [
    { id: 1, name: 'Binance', score: 9.8, volume: '$12.4B', pairs: '1,200+', liquidity: 980, image: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png' },
    { id: 2, name: 'Coinbase', score: 9.5, volume: '$4.2B', pairs: '450+', liquidity: 920, image: 'https://cryptologos.cc/logos/coinbase-cbe-logo.png' },
    { id: 3, name: 'Kraken', score: 9.2, volume: '$1.8B', pairs: '320+', liquidity: 850, image: 'https://cryptologos.cc/logos/kraken-krak-logo.png' },
    { id: 4, name: 'OKX', score: 9.0, volume: '$3.5B', pairs: '800+', liquidity: 890, image: 'https://cryptologos.cc/logos/okx-okx-logo.png' },
  ];

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto font-body">
      <header className="mb-20 space-y-6">
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-[#556069] tracking-tight text-center">Top <span className="text-[#705953] italic">Exchanges</span></h1>
        <p className="text-xl text-[#605d6a] max-w-3xl mx-auto leading-relaxed text-center">
          Compare global exchanges based on volume, liquidity, and security scores. We rank them so you can trade with confidence.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
         <MetricBlock icon={<Shield className="text-emerald-500" />} label="Avg. Security Score" value="9.4/10" />
         <MetricBlock icon={<Zap className="text-purple-500" />} label="Global Liquidity" value="High" />
         <MetricBlock icon={<Globe className="text-blue-500" />} label="Countries Supported" value="190+" />
         <MetricBlock icon={<BarChart className="text-orange-500" />} label="Total 24h Volume" value="$42.8B" />
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-[#556069]/5 overflow-hidden shadow-2xl shadow-[#556069]/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[#556069]/5 text-[#556069]/50 text-xs font-bold uppercase tracking-widest">
                     <th className="py-6 px-8">#</th>
                     <th className="py-6 px-4">Exchange</th>
                     <th className="py-6 px-4">Agamin Score</th>
                     <th className="py-6 px-4">24h Volume</th>
                     <th className="py-6 px-4">Liquidity</th>
                     <th className="py-6 px-8 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#556069]/5">
                  {exchanges.map((ex, idx) => (
                    <motion.tr 
                      key={ex.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="hover:bg-white transition-colors group"
                    >
                       <td className="py-8 px-8 font-bold text-[#705953]">{ex.id}</td>
                       <td className="py-8 px-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-[#556069]/5 p-2 flex items-center justify-center">
                                <img src={ex.image} alt={ex.name} className="w-full h-full object-contain" />
                             </div>
                             <div>
                                <p className="font-bold text-[#556069] text-lg">{ex.name}</p>
                                <p className="text-xs text-[#605d6a]/60 font-medium">{ex.pairs} Trading Pairs</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-8 px-4">
                          <div className="flex items-center gap-2">
                             <span className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold">{ex.score}</span>
                             <div className="flex gap-0.5 text-emerald-400">
                                {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                             </div>
                          </div>
                       </td>
                       <td className="py-8 px-4 font-bold text-[#556069]">{ex.volume}</td>
                       <td className="py-8 px-4">
                          <div className="w-32 h-2 bg-[#556069]/5 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(ex.liquidity / 1000) * 100}%` }} />
                          </div>
                       </td>
                       <td className="py-8 px-8 text-right">
                          <button className="flex items-center gap-2 ml-auto bg-[#556069]/5 text-[#556069] px-6 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all group-hover:scale-105">
                             Visit <ExternalLink size={14} />
                          </button>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const MetricBlock = ({ icon, label, value }) => (
  <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-[#556069]/5 shadow-sm text-center space-y-4 group">
     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <div className="space-y-1">
        <p className="text-xs font-bold text-[#705953] uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-[#556069]">{value}</p>
     </div>
  </div>
);

export default Exchanges;
