import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Info, Activity, Globe, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bitcoin = () => {
  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto font-body">
      <Link to="/market" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:-translate-x-2 transition-transform">
        <ArrowLeft size={20} /> Back to Market
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
        <div className="w-full lg:w-2/3 space-y-12">
          <header className="flex justify-between items-end border-b border-[#556069]/10 pb-12">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-orange-100 flex items-center justify-center p-4">
                <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#556069] font-headline">Bitcoin</h1>
                <p className="text-lg font-bold text-[#705953] flex items-center gap-2">
                  BTC <span className="bg-primary/10 px-3 py-0.5 rounded-full text-xs text-primary uppercase tracking-widest">Rank #1</span>
                </p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-[#556069] font-headline">$64,231.50</h2>
              <p className="text-emerald-600 font-bold flex items-center justify-end gap-1">
                <TrendingUp size={18} /> +2.4% (24h)
              </p>
            </div>
          </header>

          <div className="aspect-[21/9] bg-[#556069]/5 rounded-[3rem] border border-[#556069]/10 flex items-center justify-center relative overflow-hidden">
             <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent"
             />
             <Activity size={64} className="text-[#556069]/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoBlock title="Market Cap" value="$1.26T" />
            <InfoBlock title="Circulating Supply" value="19.6M BTC" />
            <InfoBlock title="Max Supply" value="21M BTC" />
            <InfoBlock title="Volume (24h)" value="$32.4B" />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#556069] font-headline">What is Bitcoin?</h3>
            <p className="text-lg text-[#605d6a] leading-relaxed">
              Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries. Transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 space-y-8">
          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-[#556069]/5 shadow-xl shadow-[#556069]/5">
            <h3 className="text-xl font-bold text-[#556069] mb-6 flex items-center gap-2">
              <Info size={20} className="text-[#705953]" /> Market Sentiment
            </h3>
            <div className="space-y-6">
               <div className="h-4 bg-[#556069]/10 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[78%] rounded-full" />
               </div>
               <div className="flex justify-between text-sm font-bold">
                 <span className="text-emerald-600">Fear & Greed Index: 78 (Greed)</span>
               </div>
            </div>
          </div>

          <div className="bg-[#e2dded] rounded-[2.5rem] p-8 shadow-xl shadow-[#605d6a]/10">
            <h3 className="text-xl font-bold text-[#605d6a] mb-6 flex items-center gap-2">
              <Globe size={20} /> Official Links
            </h3>
            <ul className="space-y-4">
               <li><a href="#" className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white transition-colors group">
                 <span className="text-sm font-bold text-[#605d6a]">Website</span>
                 <ArrowLeft size={16} className="rotate-180 text-[#605d6a]/40 group-hover:text-primary" />
               </a></li>
               <li><a href="#" className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white transition-colors group">
                 <span className="text-sm font-bold text-[#605d6a]">Whitepaper</span>
                 <ArrowLeft size={16} className="rotate-180 text-[#605d6a]/40 group-hover:text-primary" />
               </a></li>
               <li><a href="#" className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white transition-colors group">
                 <span className="text-sm font-bold text-[#605d6a]">Community</span>
                 <MessageSquare size={16} className="text-[#605d6a]/40 group-hover:text-primary" />
               </a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBlock = ({ title, value }) => (
  <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-[#556069]/5 shadow-sm">
    <p className="text-xs font-bold text-[#705953] uppercase tracking-widest mb-2">{title}</p>
    <p className="text-2xl font-bold text-[#556069]">{value}</p>
  </div>
);

export default Bitcoin;
