import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowUpRight, TrendingUp, History, Settings } from 'lucide-react';

const Portfolio = () => {
  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto font-body">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="space-y-4">
          <h1 className="font-headline text-5xl font-extrabold text-[#556069] tracking-tight">Your Portfolio</h1>
          <p className="text-lg text-[#605d6a]">Track your digital wealth with precision and style.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-[#556069] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
            <Plus size={20} /> Add Asset
          </button>
          <button className="p-3 bg-white border border-[#556069]/10 rounded-xl hover:bg-[#faf1f4] transition-colors">
            <Settings size={20} className="text-[#556069]" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-[#556069] rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-[#556069]/20"
        >
          <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
            <div className="space-y-2">
              <p className="text-[#bdc8d2] font-medium tracking-widest uppercase text-xs">Total Balance</p>
              <h2 className="text-5xl md:text-6xl font-bold font-headline">$124,562.80</h2>
              <p className="flex items-center gap-2 text-emerald-400 font-bold">
                <ArrowUpRight size={20} /> +$4,231.50 (3.51%) <span className="text-white/40 font-normal">Past 24h</span>
              </p>
            </div>
            <div className="h-48 w-full bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
               <TrendingUp size={48} className="text-white/10" />
            </div>
          </div>
          <div className="absolute top-12 right-12 text-white/5">
             <Wallet size={120} />
          </div>
        </motion.div>

        <div className="space-y-8">
          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-[#556069]/5 shadow-xl shadow-[#556069]/5">
            <h3 className="text-xl font-bold text-[#556069] mb-6 font-headline flex items-center gap-2">
              <History size={20} className="text-[#705953]" /> Recent Activity
            </h3>
            <ul className="space-y-6">
              <ActivityItem type="Buy" asset="Bitcoin" amount="0.05 BTC" time="2h ago" price="+$3,210" />
              <ActivityItem type="Sell" asset="Ethereum" amount="1.2 ETH" time="5h ago" price="-$4,102" />
              <ActivityItem type="Swap" asset="SOL/USDC" amount="45 SOL" time="1d ago" price="+$6,400" />
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-[#556069]/5 overflow-hidden shadow-2xl shadow-[#556069]/5">
        <div className="p-8 border-b border-[#556069]/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#556069] font-headline">Assets</h3>
          <button className="text-sm font-bold text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                <tr className="text-[#556069]/50 text-xs uppercase tracking-widest font-bold">
                  <th className="py-6 px-8">Asset</th>
                  <th className="py-6 px-4">Price</th>
                  <th className="py-6 px-4">Holdings</th>
                  <th className="py-6 px-4 text-right">Value</th>
                  <th className="py-6 px-8 text-right">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#556069]/5">
                <AssetRow name="Bitcoin" symbol="BTC" price="$64,231" holdings="0.85 BTC" value="$54,596" change="+1.2%" />
                <AssetRow name="Ethereum" symbol="ETH" price="$3,452" holdings="12.5 ETH" value="$43,150" change="-0.5%" />
                <AssetRow name="Solana" symbol="SOL" price="$142" holdings="150 SOL" value="$21,300" change="+4.8%" />
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ type, asset, amount, time, price }) => (
  <li className="flex justify-between items-center group">
    <div className="flex gap-4 items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${type === 'Buy' ? 'bg-emerald-100 text-emerald-700' : type === 'Sell' ? 'bg-rose-100 text-rose-700' : 'bg-primary/10 text-primary'}`}>
        {type[0]}
      </div>
      <div>
        <p className="text-sm font-bold text-[#556069] group-hover:translate-x-1 transition-transform">{type} {asset}</p>
        <p className="text-xs text-[#605d6a]/60">{time} • {amount}</p>
      </div>
    </div>
    <span className={`text-sm font-bold ${price.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{price}</span>
  </li>
);

const AssetRow = ({ name, symbol, price, holdings, value, change }) => (
  <tr className="hover:bg-[#556069]/5 transition-colors cursor-pointer group">
    <td className="py-6 px-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center font-bold text-xs text-primary shadow-sm">{symbol}</div>
        <div>
          <p className="font-bold text-[#556069]">{name}</p>
          <p className="text-xs text-[#605d6a]/60 font-medium">{symbol}</p>
        </div>
      </div>
    </td>
    <td className="py-6 px-4 font-bold text-[#556069]">{price}</td>
    <td className="py-6 px-4 font-medium text-[#605d6a]">{holdings}</td>
    <td className="py-6 px-4 text-right font-bold text-[#556069]">{value}</td>
    <td className={`py-6 px-8 text-right font-bold ${change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{change}</td>
  </tr>
);

export default Portfolio;
